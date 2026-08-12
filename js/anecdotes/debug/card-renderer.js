import { frenchTypography } from '../format.js';
import { ensureMarkdownAssets, renderMarkdownWithMath, containsMath } from '../markdown-render.js';
import { openModal, closeModal } from '../modal.js';

const LABELS = {
	enabled: { fr: 'Actif', en: 'Enabled' },
	disabled: { fr: 'Désactivé', en: 'Disabled' },
	priority: { fr: 'Priorité', en: 'Priority' },
	special: { fr: 'Événement spécial', en: 'Special event' },
	general: { fr: 'Vivier général', en: 'General pool' },
	addedDate: { fr: 'Ajoutée le', en: 'Added on' },
	scheduling: { fr: 'Planification', en: 'Scheduling' },
	path: { fr: 'Chemin', en: 'Path' },
	preciseValue: { fr: 'Valeur précise', en: 'Precise value' },
	anytime: { fr: 'À tout moment (vivier général)', en: 'Anytime (general pool)' },
	annual: { fr: 'Annuel', en: 'Annual' },
	specificDate: { fr: 'Date précise', en: 'Specific date' },
	period: { fr: 'Période', en: 'Period' }
};

function label(key, lang) {
	const entry = LABELS[key];
	return entry ? (entry[lang] || entry.en) : key;
}

function formatMMDDLabel(mmdd, lang) {
	const [month, day] = mmdd.split('-').map(Number);
	const reference = new Date(Date.UTC(2024, month - 1, day));
	return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(reference);
}

function formatISODateLabel(iso, lang) {
	const [year, month, day] = iso.split('-').map(Number);
	const reference = new Date(Date.UTC(year, month - 1, day));
	return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(reference);
}

function formatSchedulingSummary(scheduling, lang) {
	if (!scheduling) return '—';
	if (scheduling.type === 'anytime') return label('anytime', lang);
	if (scheduling.type === 'annual') {
		return `${label('annual', lang)} — ${scheduling.dates.map(date => formatMMDDLabel(date, lang)).join(', ')}`;
	}
	if (scheduling.type === 'specific_date') {
		return `${label('specificDate', lang)} — ${scheduling.dates.map(date => formatISODateLabel(date, lang)).join(', ')}`;
	}
	if (scheduling.type === 'period' && scheduling.dates.length === 2) {
		return `${label('period', lang)} — ${formatMMDDLabel(scheduling.dates[0], lang)} → ${formatMMDDLabel(scheduling.dates[1], lang)}`;
	}
	return scheduling.type;
}

function ensureDebugModal() {
	let overlay = document.getElementById('debug-context-modal');
	if (overlay) return overlay;
	overlay = document.createElement('div');
	overlay.id = 'debug-context-modal';
	overlay.className = 'anecdote-modal-overlay';
	overlay.setAttribute('role', 'dialog');
	overlay.setAttribute('aria-modal', 'true');
	overlay.setAttribute('aria-hidden', 'true');
	overlay.setAttribute('aria-labelledby', 'debug-context-modal-title');
	overlay.tabIndex = -1;
	overlay.innerHTML = `
		<div class="anecdote-modal-container">
			<button type="button" class="anecdote-modal-close" aria-label="Close">&times;</button>
			<h3 id="debug-context-modal-title" class="anecdote-modal-title"></h3>
			<div id="debug-context-modal-body" class="anecdote-modal-body"></div>
		</div>
	`;
	document.body.appendChild(overlay);
	overlay.addEventListener('click', event => {
		if (event.target === overlay) closeModal();
	});
	overlay.querySelector('.anecdote-modal-close').addEventListener('click', closeModal);
	return overlay;
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

async function openDebugContextModal(context, triggerElement, langCode) {
	const overlay = ensureDebugModal();
	const modalTitle = document.getElementById('debug-context-modal-title');
	const modalBody = document.getElementById('debug-context-modal-body');

	modalTitle.textContent = (context.title && (context.title[langCode] || context.title.en)) || '';
	modalBody.innerHTML = '';
	modalBody.classList.add('anecdote-markdown-body');

	if (context.external) {
		try {
			const resolvedExternalPath = typeof context.externalPath === 'string'
				? context.externalPath
				: (context.externalPath[langCode] || context.externalPath.en || context.externalPath.fr);
			const rawMarkdown = await fetchExternalContextMarkdown(resolvedExternalPath);
			await ensureMarkdownAssets();
			modalBody.innerHTML = await renderMarkdownWithMath(rawMarkdown);
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
	openModal(overlay, triggerElement);
}

function buildLinksRow(entry, langCode) {
	const row = document.createElement('div');
	row.className = 'anecdote-links-row debug-links-row';

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
		trigger.textContent = (context.title && (context.title[langCode] || context.title.en)) || (langCode === 'fr' ? `Contexte ${index + 1}` : `Context ${index + 1}`);
		trigger.setAttribute('aria-haspopup', 'dialog');
		trigger.setAttribute('aria-expanded', 'false');
		trigger.setAttribute('aria-controls', 'debug-context-modal');
		trigger.addEventListener('click', () => openDebugContextModal(context, trigger, langCode));
		row.appendChild(trigger);
	});

	return row;
}

export function buildDetailedCard({ registryEntry, fullEntry, lang, contextDate, preciseDate, isSpecial }) {
	const card = document.createElement('article');
	card.className = 'debug-anecdote-card';

	const header = document.createElement('div');
	header.className = 'debug-card-header';

	const idBadge = document.createElement('span');
	idBadge.className = 'debug-badge debug-badge-id';
	idBadge.textContent = registryEntry.id;
	header.appendChild(idBadge);

	const isEnabled = registryEntry.enabled !== false;
	const enabledBadge = document.createElement('span');
	enabledBadge.className = `debug-badge ${isEnabled ? 'debug-badge-enabled' : 'debug-badge-disabled'}`;
	enabledBadge.textContent = label(isEnabled ? 'enabled' : 'disabled', lang);
	header.appendChild(enabledBadge);

	const priorityBadge = document.createElement('span');
	priorityBadge.className = 'debug-badge debug-badge-priority';
	priorityBadge.textContent = `${label('priority', lang)} ${registryEntry.priority ?? '—'}`;
	header.appendChild(priorityBadge);

	if (isSpecial === true || isSpecial === false) {
		const typeBadge = document.createElement('span');
		typeBadge.className = `debug-badge ${isSpecial ? 'debug-badge-special' : 'debug-badge-general'}`;
		typeBadge.textContent = label(isSpecial ? 'special' : 'general', lang);
		header.appendChild(typeBadge);
	}

	card.appendChild(header);

	const domainEl = document.createElement('p');
	domainEl.className = 'anecdote-domain debug-card-domain';
	domainEl.textContent = (fullEntry.domain && (fullEntry.domain[lang] || fullEntry.domain.en)) || '';
	card.appendChild(domainEl);

	const metaList = document.createElement('dl');
	metaList.className = 'debug-meta-list';

	function addMetaRow(labelKey, value) {
		const dt = document.createElement('dt');
		dt.textContent = label(labelKey, lang);
		const dd = document.createElement('dd');
		dd.textContent = value;
		metaList.append(dt, dd);
	}

	addMetaRow('addedDate', registryEntry.addedDate ? formatISODateLabel(registryEntry.addedDate, lang) : '—');
	addMetaRow('scheduling', formatSchedulingSummary(registryEntry.scheduling, lang));
	addMetaRow('path', registryEntry.path);

	card.appendChild(metaList);

	const contentEl = document.createElement('p');
	contentEl.className = 'anecdote-content debug-card-content';
	let contentText = '';
	try {
		contentText = typeof fullEntry.content === 'function'
			? fullEntry.content(lang, contextDate.getUTCFullYear(), contextDate)
			: (fullEntry.content && (fullEntry.content[lang] || fullEntry.content.en)) || '';
	} catch (error) {
		contentText = lang === 'fr' ? 'Erreur lors du rendu du contenu.' : 'Error rendering content.';
	}
	contentEl.textContent = frenchTypography(contentText, lang);
	card.appendChild(contentEl);

	if (typeof fullEntry.tooltip === 'function') {
		let tooltipText = '';
		try {
			tooltipText = fullEntry.tooltip(lang, preciseDate);
		} catch (error) {
			tooltipText = '';
		}
		if (tooltipText) {
			const tooltipEl = document.createElement('p');
			tooltipEl.className = 'debug-card-tooltip';
			tooltipEl.textContent = `${label('preciseValue', lang)} : ${tooltipText}`;
			card.appendChild(tooltipEl);
		}
	}

	const linksRow = buildLinksRow(fullEntry, lang);
	if (linksRow.children.length > 0) card.appendChild(linksRow);

	return card;
}
