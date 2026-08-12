import { loadRegistry, loadAnecdoteModule } from './loader.js';
import { resolveSpecialEntry } from './scheduler.js';
import { computeGeneralDaysCounter, pickGeneralEntry } from './cycle-engine.js';
import { getAuthoritativeUTCDate, toUTCDateOnly, getCachedUTCDateNowSync } from './time-sync.js';
import { ensureMarkdownAssets, renderMarkdownWithMath, containsMath } from './markdown-render.js';
import { openModal, closeModal } from './modal.js';
import { applyLanguageTypography } from './format.js';

const preciseTooltipRegistry = new Map();
let preciseTooltipElement = null;

function ensurePreciseTooltipElement() {
	if (preciseTooltipElement) return preciseTooltipElement;
	preciseTooltipElement = document.createElement('div');
	preciseTooltipElement.className = 'anecdote-precise-tooltip';
	document.body.appendChild(preciseTooltipElement);
	return preciseTooltipElement;
}

function positionPreciseTooltip(target) {
	const tooltip = ensurePreciseTooltipElement();
	const rect = target.getBoundingClientRect();
	const tooltipRect = tooltip.getBoundingClientRect();
	let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
	let top = rect.top - tooltipRect.height - 8;
	if (left < 8) left = 8;
	if (left + tooltipRect.width > window.innerWidth - 8) left = window.innerWidth - tooltipRect.width - 8;
	if (top < 8) top = rect.bottom + 8;
	tooltip.style.left = `${left}px`;
	tooltip.style.top = `${top}px`;
}

function registerPreciseTooltip(entryId, tooltipFn, langCode) {
	preciseTooltipRegistry.set(entryId, { tooltipFn, langCode });
}

document.addEventListener('mouseover', (event) => {
	const target = event.target.closest('.has-precise-tooltip');
	if (!target) return;
	const entry = preciseTooltipRegistry.get(target.dataset.tooltipEntryId);
	if (!entry) return;
	const tooltip = ensurePreciseTooltipElement();
	tooltip.textContent = entry.tooltipFn(entry.langCode, getCachedUTCDateNowSync());
	tooltip.classList.add('visible');
	positionPreciseTooltip(target);
});

document.addEventListener('mouseout', (event) => {
	const target = event.target.closest('.has-precise-tooltip');
	if (target && preciseTooltipElement) {
		preciseTooltipElement.classList.remove('visible');
	}
});

function translate(key, fallback) {
	const translated = window.t ? window.t(key) : key;
	if (translated && translated !== key) return translated;
	return fallback;
}

const CONTAINER_ID = 'anecdote-container';
let renderedDateISO = null;
let currentRegistry = null;

function currentLang() {
	return window.currentSiteLang || document.documentElement.lang || (window.I18N_DEFAULT_LANGUAGE || 'en');
}

function buildSkeleton(container) {
	container.innerHTML = `
		<div class="anecdote-card" aria-live="polite">
			<div class="anecdote-domain skeleton-block skeleton-domain"></div>
			<div class="skeleton-block skeleton-line"></div>
			<div class="skeleton-block skeleton-line skeleton-line-short"></div>
		</div>
	`;
}

function ensureModalSkeleton() {
	if (document.getElementById('anecdote-context-modal')) return;
	const overlay = document.createElement('div');
	overlay.id = 'anecdote-context-modal';
	overlay.className = 'anecdote-modal-overlay';
	overlay.setAttribute('role', 'dialog');
	overlay.setAttribute('aria-modal', 'true');
	overlay.setAttribute('aria-hidden', 'true');
	overlay.setAttribute('aria-labelledby', 'anecdote-context-modal-title');
	overlay.tabIndex = -1;
	overlay.innerHTML = `
		<div class="anecdote-modal-container">
			<button type="button" class="anecdote-modal-close" aria-label="${translate('anecdote.close', 'Close')}">&times;</button>
			<h3 id="anecdote-context-modal-title" class="anecdote-modal-title"></h3>
			<div id="anecdote-context-modal-body" class="anecdote-modal-body"></div>
		</div>
	`;
	document.body.appendChild(overlay);

	overlay.addEventListener('click', (event) => {
		if (event.target === overlay) closeModal();
	});
	overlay.querySelector('.anecdote-modal-close').addEventListener('click', closeModal);
}

async function fetchExternalContextMarkdown(path) {
	const response = await fetch(path);
	if (!response.ok) throw new Error(`Unable to load ${path}`);
	const text = await response.text();
	const parser = new DOMParser();
	const doc = parser.parseFromString(text, 'text/html');
	const source = doc.getElementById('context-markdown-source');
	if (source) return source.textContent;
	const main = doc.querySelector('main');
	return main ? main.textContent : text;
}

async function openContextModal(context, triggerElement, langCode) {
	ensureModalSkeleton();
	const modal = document.getElementById('anecdote-context-modal');
	const modalTitle = document.getElementById('anecdote-context-modal-title');
	const modalBody = document.getElementById('anecdote-context-modal-body');

	modalTitle.textContent = window.resolveWithFallback(context.title, langCode);
	modalBody.innerHTML = '';
	modalBody.classList.add('anecdote-markdown-body');

	if (context.external) {
		try {
			const resolvedExternalPath = typeof context.externalPath === 'string'
				? context.externalPath
				: window.resolveWithFallback(context.externalPath, langCode);
			const rawMarkdown = await fetchExternalContextMarkdown(resolvedExternalPath);
			await ensureMarkdownAssets();
			modalBody.innerHTML = await renderMarkdownWithMath(rawMarkdown);
		} catch (error) {
			modalBody.textContent = translate('anecdote.context_unavailable', 'Content unavailable.');
		}
	} else {
		const rawBody = window.resolveWithFallback(context.body, langCode);
		if (containsMath(rawBody) || /[*_#>-]/.test(rawBody)) {
			await ensureMarkdownAssets();
			modalBody.innerHTML = await renderMarkdownWithMath(rawBody);
		} else {
			modalBody.textContent = rawBody;
		}
	}

	triggerElement.setAttribute('aria-expanded', 'true');
	openModal(modal, triggerElement);
}

function renderLinksRow(entry, langCode) {
	const row = document.createElement('div');
	row.className = 'anecdote-links-row';

	(entry.sources || []).forEach((source, index) => {
		const link = document.createElement('a');
		link.className = 'anecdote-link anecdote-source-link';
		link.href = source.url;
		link.target = '_blank';
		link.rel = 'noopener noreferrer';
		const resolvedName = window.resolveWithFallback(source.name, langCode);
		link.textContent = resolvedName || `${translate('anecdote.source_generic_label', 'Source')} ${index + 1}`;
		row.appendChild(link);
	});

	(entry.contexts || []).forEach((context, index) => {
		const trigger = document.createElement('button');
		trigger.type = 'button';
		trigger.className = 'anecdote-link anecdote-context-trigger';
		const resolvedTitle = window.resolveWithFallback(context.title, langCode);
		trigger.textContent = resolvedTitle || `${translate('anecdote.context_generic_label', 'Context')} ${index + 1}`;
		trigger.setAttribute('aria-haspopup', 'dialog');
		trigger.setAttribute('aria-expanded', 'false');
		trigger.setAttribute('aria-controls', 'anecdote-context-modal');
		trigger.addEventListener('click', () => openContextModal(context, trigger, langCode));
		row.appendChild(trigger);
	});

	return row;
}

async function renderAnecdote(container, entry, today, preciseNow) {
	const langCode = currentLang();
	const fullEntry = await loadAnecdoteModule(entry, langCode);

	container.innerHTML = '';

	const card = document.createElement('div');
	card.className = 'anecdote-card';

	if (fullEntry.__loadFailed) {
		card.classList.add('anecdote-card-error');

		const domainEl = document.createElement('p');
		domainEl.className = 'anecdote-domain';
		domainEl.textContent = translate('anecdote.load_error_title', 'Loading error');

		const contentEl = document.createElement('p');
		contentEl.className = 'anecdote-content';
		contentEl.textContent = translate('anecdote.load_error_message', 'This anecdote could not be loaded.');

		const metaEl = document.createElement('dl');
		metaEl.className = 'anecdote-error-meta';
		const addRow = (labelText, value) => {
			const dt = document.createElement('dt');
			dt.textContent = labelText;
			const dd = document.createElement('dd');
			dd.textContent = value;
			metaEl.append(dt, dd);
		};
		addRow('ID', fullEntry.id);
		addRow(translate('anecdote.load_error_path', 'Path'), fullEntry.__attemptedPath);
		addRow(translate('anecdote.load_error_detail', 'Detail'), fullEntry.__errorMessage);

		card.append(domainEl, contentEl, metaEl);
		container.appendChild(card);
		container.style.minHeight = '';
		return;
	}

	const domainText = window.resolveWithFallback(fullEntry.domain, langCode);
	const rawContent = typeof fullEntry.content === 'function'
		? fullEntry.content(langCode, today.getUTCFullYear(), today)
		: window.resolveWithFallback(fullEntry.content, langCode);
	const contentText = applyLanguageTypography(rawContent, langCode);

	const domainEl = document.createElement('p');
	domainEl.className = 'anecdote-domain';
	domainEl.textContent = domainText;

	const contentEl = document.createElement('p');
	contentEl.className = 'anecdote-content';
	contentEl.textContent = contentText;

	if (typeof fullEntry.tooltip === 'function') {
		contentEl.classList.add('has-precise-tooltip');
		contentEl.dataset.tooltipEntryId = fullEntry.id;
		registerPreciseTooltip(fullEntry.id, fullEntry.tooltip, langCode);
	}

	card.appendChild(domainEl);
	card.appendChild(contentEl);

	const linksRow = renderLinksRow(fullEntry, langCode);
	if (linksRow.children.length > 0) card.appendChild(linksRow);

	container.appendChild(card);
	container.style.minHeight = '';
}

async function loadAndRenderToday(container) {
	buildSkeleton(container);
	const measuredHeight = container.getBoundingClientRect().height;
	container.style.minHeight = `${measuredHeight || 180}px`;

	currentRegistry = await loadRegistry();
	const preciseNow = await getAuthoritativeUTCDate();
	const today = toUTCDateOnly(preciseNow);
	const todayISODate = today.toISOString().slice(0, 10);
	renderedDateISO = todayISODate;

	const { counterBeforeToday } = computeGeneralDaysCounter(today, currentRegistry);

	const specialEntry = resolveSpecialEntry(currentRegistry, today);
	if (specialEntry) {
		await renderAnecdote(container, specialEntry, today, preciseNow);
		return;
	}

	const generalEntry = pickGeneralEntry(currentRegistry, counterBeforeToday, todayISODate);

	if (!generalEntry) {
		container.innerHTML = `<div class="anecdote-card"><p class="anecdote-content">${translate('anecdote.none_available', 'No anecdote available.')}</p></div>`;
		return;
	}

	await renderAnecdote(container, generalEntry, today, preciseNow);
}

function watchDayRollover(container) {
	document.addEventListener('visibilitychange', async () => {
		if (document.visibilityState !== 'visible') return;
		const today = toUTCDateOnly(await getAuthoritativeUTCDate());
		const todayISO = today.toISOString().slice(0, 10);
		if (todayISO === renderedDateISO) return;

		container.classList.add('is-transitioning');
		await new Promise(resolve => setTimeout(resolve, 250));
		await loadAndRenderToday(container);
		container.classList.remove('is-transitioning');
	});
}

function initAnecdoteSection() {
	const container = document.getElementById(CONTAINER_ID);
	if (!container) return;
	loadAndRenderToday(container);
	watchDayRollover(container);

	document.addEventListener('i18nReady', () => {
		if (currentRegistry) loadAndRenderToday(container);
	});
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initAnecdoteSection);
} else {
	initAnecdoteSection();
}
