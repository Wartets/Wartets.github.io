import { loadRegistry } from '../loader.js';
import { getAuthoritativeUTCDate, toUTCDateOnly } from '../time-sync.js';
import { resolveEntryForDate } from './engine.js';
import { getFullEntry } from './entry-cache.js';
import { buildDetailedCard } from './card-renderer.js';
import { buildCalendar } from './calendar.js';
import { buildSearchIndex, searchIndex } from './search.js';
import { initScrollProgressBar, initBackToTop } from './chrome.js';

const RESULTS_PER_PAGE = 10;

let registryEntries = [];
let todayDateUTC = null;
let selectedDateUTC = null;
let preciseNow = null;
let calendarWidget = null;
let searchIndexPromise = null;
let searchIndexItems = [];
let currentSearchResults = [];
let currentSearchPage = 1;
let lastRandomItem = null;

function currentLang() {
	return window.currentSiteLang || document.documentElement.lang || 'en';
}

function translate(key, fallbackFr, fallbackEn) {
	const translated = window.t ? window.t(key) : key;
	if (translated && translated !== key) return translated;
	return currentLang() === 'fr' ? fallbackFr : fallbackEn;
}

function isSameUTCDate(a, b) {
	return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate();
}

function formatSelectedDate(dateUTC) {
	return new Intl.DateTimeFormat(currentLang() === 'fr' ? 'fr-FR' : 'en-US', {
		weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
	}).format(dateUTC);
}

function buildLoadingPlaceholder() {
	const el = document.createElement('div');
	el.className = 'debug-loading-placeholder';
	el.textContent = translate('anecdote_debug.loading', 'Chargement...', 'Loading...');
	return el;
}

function buildEmptyState() {
	const el = document.createElement('div');
	el.className = 'debug-empty-state';
	el.textContent = translate('anecdote_debug.none_available', 'Aucune anecdote disponible.', 'No anecdote available.');
	return el;
}

function buildPreciseContext(dateUTC) {
	return new Date(Date.UTC(
		dateUTC.getUTCFullYear(),
		dateUTC.getUTCMonth(),
		dateUTC.getUTCDate(),
		preciseNow.getUTCHours(),
		preciseNow.getUTCMinutes(),
		preciseNow.getUTCSeconds()
	));
}

async function renderDayView(dateUTC) {
	selectedDateUTC = dateUTC;

	const dateLabel = document.getElementById('debug-date-label');
	const todaySuffix = isSameUTCDate(dateUTC, todayDateUTC)
		? ` (${translate('anecdote_debug.today_suffix', "aujourd'hui", 'today')})`
		: '';
	dateLabel.textContent = `${formatSelectedDate(dateUTC)}${todaySuffix}`;

	const container = document.getElementById('debug-anecdote-container');
	container.innerHTML = '';
	container.appendChild(buildLoadingPlaceholder());

	const { registryEntry, isSpecial } = resolveEntryForDate(dateUTC, registryEntries);

	if (!registryEntry) {
		container.innerHTML = '';
		container.appendChild(buildEmptyState());
		if (calendarWidget) calendarWidget.setSelectedDate(dateUTC);
		return;
	}

	const fullEntry = await getFullEntry(registryEntry.path, currentLang());

	if (selectedDateUTC !== dateUTC) return;

	container.innerHTML = '';
	container.appendChild(buildDetailedCard({
		registryEntry,
		fullEntry,
		lang: currentLang(),
		contextDate: dateUTC,
		preciseDate: buildPreciseContext(dateUTC),
		isSpecial
	}));

	if (calendarWidget) calendarWidget.setSelectedDate(dateUTC);
}

function shiftDay(offset) {
	const next = new Date(selectedDateUTC.getTime() + offset * 86400000);
	renderDayView(next);
}

async function renderRandomAnecdote() {
	if (registryEntries.length === 0) return;
	const resultContainer = document.getElementById('debug-random-result');
	resultContainer.innerHTML = '';
	resultContainer.appendChild(buildLoadingPlaceholder());

	const randomEntry = registryEntries[Math.floor(Math.random() * registryEntries.length)];
	const fullEntry = await getFullEntry(randomEntry.path, currentLang());

	lastRandomItem = { registryEntry: randomEntry, fullEntry };

	resultContainer.innerHTML = '';
	resultContainer.appendChild(buildDetailedCard({
		registryEntry: randomEntry,
		fullEntry,
		lang: currentLang(),
		contextDate: todayDateUTC,
		preciseDate: preciseNow,
		isSpecial: null
	}));
}

function renderSearchResults() {
	const resultsContainer = document.getElementById('debug-search-results');
	const paginationContainer = document.getElementById('debug-search-pagination');
	const statusEl = document.getElementById('debug-search-status');
	const query = document.getElementById('debug-search-input').value.trim();

	resultsContainer.innerHTML = '';
	paginationContainer.innerHTML = '';

	if (currentSearchResults.length === 0) {
		statusEl.textContent = query ? translate('anecdote_debug.search_no_results', 'Aucun résultat.', 'No results.') : '';
		return;
	}

	const totalPages = Math.max(1, Math.ceil(currentSearchResults.length / RESULTS_PER_PAGE));
	currentSearchPage = Math.min(currentSearchPage, totalPages);
	const startIndex = (currentSearchPage - 1) * RESULTS_PER_PAGE;
	const pageItems = currentSearchResults.slice(startIndex, startIndex + RESULTS_PER_PAGE);

	statusEl.textContent = `${currentSearchResults.length} ${translate('anecdote_debug.results_label', 'résultat(s)', 'result(s)')}`;

	pageItems.forEach((item, index) => {
		const card = buildDetailedCard({
			registryEntry: item.registryEntry,
			fullEntry: item.fullEntry,
			lang: currentLang(),
			contextDate: todayDateUTC,
			preciseDate: preciseNow,
			isSpecial: null
		});
		card.classList.add('debug-search-result-card');
		card.style.animationDelay = `${index * 40}ms`;
		resultsContainer.appendChild(card);
	});

	if (totalPages > 1) {
		const prevBtn = document.createElement('button');
		prevBtn.type = 'button';
		prevBtn.className = 'debug-pagination-btn';
		prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left" aria-hidden="true"></i>';
		prevBtn.disabled = currentSearchPage <= 1;
		prevBtn.addEventListener('click', () => {
			currentSearchPage -= 1;
			renderSearchResults();
			document.getElementById('debug-search-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
		});

		const pageLabel = document.createElement('span');
		pageLabel.className = 'debug-pagination-label';
		pageLabel.textContent = `${currentSearchPage} / ${totalPages}`;

		const nextBtn = document.createElement('button');
		nextBtn.type = 'button';
		nextBtn.className = 'debug-pagination-btn';
		nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>';
		nextBtn.disabled = currentSearchPage >= totalPages;
		nextBtn.addEventListener('click', () => {
			currentSearchPage += 1;
			renderSearchResults();
			document.getElementById('debug-search-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
		});

		paginationContainer.append(prevBtn, pageLabel, nextBtn);
	}
}

let searchDebounceTimer = null;

function handleSearchInput(event) {
	const query = event.target.value;
	clearTimeout(searchDebounceTimer);
	searchDebounceTimer = setTimeout(async () => {
		if (!query.trim()) {
			currentSearchResults = [];
			currentSearchPage = 1;
			renderSearchResults();
			return;
		}
		const statusEl = document.getElementById('debug-search-status');
		if (!searchIndexItems.length) {
			statusEl.textContent = translate('anecdote_debug.search_indexing', 'Indexation en cours...', 'Indexing...');
			searchIndexItems = await searchIndexPromise;
		}
		currentSearchResults = searchIndex(searchIndexItems, query, todayDateUTC);
		currentSearchPage = 1;
		renderSearchResults();
	}, 250);
}

async function handleLanguageChange() {
	if (selectedDateUTC) await renderDayView(selectedDateUTC);
	if (calendarWidget) calendarWidget.refresh();
	if (lastRandomItem) {
		const resultContainer = document.getElementById('debug-random-result');
		resultContainer.innerHTML = '';
		resultContainer.appendChild(buildDetailedCard({
			registryEntry: lastRandomItem.registryEntry,
			fullEntry: lastRandomItem.fullEntry,
			lang: currentLang(),
			contextDate: todayDateUTC,
			preciseDate: preciseNow,
			isSpecial: null
		}));
	}
	if (currentSearchResults.length) renderSearchResults();
}

async function init() {
	initScrollProgressBar();
	initBackToTop();

	registryEntries = await loadRegistry();
	preciseNow = await getAuthoritativeUTCDate();
	todayDateUTC = toUTCDateOnly(preciseNow);

	searchIndexPromise = buildSearchIndex(registryEntries, currentLang());

	await renderDayView(todayDateUTC);

	calendarWidget = buildCalendar(document.getElementById('debug-calendar'), {
		initialDate: todayDateUTC,
		todayDate: todayDateUTC,
		onSelect: dateUTC => renderDayView(dateUTC)
	});

	document.getElementById('debug-prev-day').addEventListener('click', () => shiftDay(-1));
	document.getElementById('debug-next-day').addEventListener('click', () => shiftDay(1));
	document.getElementById('debug-random-button').addEventListener('click', renderRandomAnecdote);
	document.getElementById('debug-search-input').addEventListener('input', handleSearchInput);

	document.addEventListener('i18nReady', handleLanguageChange);

	searchIndexPromise.then(items => {
		searchIndexItems = items;
	});
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
