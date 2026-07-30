import { loadRegistry, loadAnecdoteModule } from './loader.js';
import { resolveSpecialEntry } from './scheduler.js';
import { computeGeneralDaysCounter, pickGeneralEntry } from './cycle-engine.js';
import { getAuthoritativeUTCDate, toUTCDateOnly } from './time-sync.js';
import { ensureMarkdownAssets, renderMarkdownWithMath, containsMath } from './markdown-render.js';
import { openModal, closeModal } from './modal.js';
import { frenchTypography } from './format.js';

const CONTAINER_ID = 'anecdote-container';
let renderedDateISO = null;
let currentRegistry = null;

function currentLang() {
	return window.currentSiteLang || document.documentElement.lang || 'en';
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
			<button type="button" class="anecdote-modal-close" aria-label="${currentLang() === 'fr' ? 'Fermer' : 'Close'}">&times;</button>
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

async function fetchExternalContextHTML(path) {
	const response = await fetch(path);
	if (!response.ok) throw new Error(`Impossible de charger ${path}`);
	const text = await response.text();
	const parser = new DOMParser();
	const doc = parser.parseFromString(text, 'text/html');
	const main = doc.querySelector('main');
	return main ? main.innerHTML : text;
}

async function openContextModal(context, index, triggerElement, langCode) {
	ensureModalSkeleton();
	const modal = document.getElementById('anecdote-context-modal');
	const modalTitle = document.getElementById('anecdote-context-modal-title');
	const modalBody = document.getElementById('anecdote-context-modal-body');
	modal.id = `anecdote-modal-context-${index}`;

	modalTitle.textContent = (context.title && (context.title[langCode] || context.title.en)) || '';
	modalBody.innerHTML = '';
	modalBody.classList.add('anecdote-markdown-body');

	if (context.external) {
		try {
			const html = await fetchExternalContextHTML(context.externalPath);
			modalBody.innerHTML = html;
		} catch (error) {
			modalBody.textContent = langCode === 'fr' ? 'Contenu indisponible.' : 'Content unavailable.';
		}
	} else {
		const rawBody = (context.body && (context.body[langCode] || context.body.en)) || '';
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
		link.textContent = (source.name && (source.name[langCode] || source.name.en)) || `Source ${index + 1}`;
		row.appendChild(link);
	});

	(entry.contexts || []).forEach((context, index) => {
		const trigger = document.createElement('button');
		trigger.type = 'button';
		trigger.className = 'anecdote-link anecdote-context-trigger';
		trigger.textContent = (context.title && (context.title[langCode] || context.title.en)) || `Contexte ${index + 1}`;
		trigger.setAttribute('aria-haspopup', 'dialog');
		trigger.setAttribute('aria-expanded', 'false');
		trigger.setAttribute('aria-controls', `anecdote-modal-context-${index}`);
		trigger.addEventListener('click', () => openContextModal(context, index, trigger, langCode));
		row.appendChild(trigger);
	});

	return row;
}

async function renderAnecdote(container, entry) {
	const langCode = currentLang();
	const today = toUTCDateOnly(await getAuthoritativeUTCDate());
	const fullEntry = await loadAnecdoteModule(entry.path, langCode);

	const domainText = (fullEntry.domain && (fullEntry.domain[langCode] || fullEntry.domain.en)) || '';
	const rawContent = typeof fullEntry.content === 'function'
		? fullEntry.content(langCode, today.getUTCFullYear(), today)
		: (fullEntry.content && (fullEntry.content[langCode] || fullEntry.content.en)) || '';
	const contentText = frenchTypography(rawContent, langCode);

	container.innerHTML = '';

	const card = document.createElement('div');
	card.className = 'anecdote-card';

	const domainEl = document.createElement('p');
	domainEl.className = 'anecdote-domain';
	domainEl.textContent = domainText;

	const contentEl = document.createElement('p');
	contentEl.className = 'anecdote-content';
	contentEl.textContent = contentText;

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
	const today = toUTCDateOnly(await getAuthoritativeUTCDate());
	const todayISODate = today.toISOString().slice(0, 10);
	renderedDateISO = todayISODate;

	const { counterBeforeToday } = computeGeneralDaysCounter(today, currentRegistry);

	const specialEntry = resolveSpecialEntry(currentRegistry, today);
	if (specialEntry) {
		await renderAnecdote(container, specialEntry);
		return;
	}

	const generalEntry = pickGeneralEntry(currentRegistry, counterBeforeToday, todayISODate);

	if (!generalEntry) {
		const langCode = currentLang();
		container.innerHTML = `<div class="anecdote-card"><p class="anecdote-content">${langCode === 'fr' ? 'Aucune anecdote disponible.' : 'No anecdote available.'}</p></div>`;
		return;
	}

	await renderAnecdote(container, generalEntry);
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
