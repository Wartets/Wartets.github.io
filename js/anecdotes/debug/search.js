import { getFullEntry } from './entry-cache.js';

const TEXT_CACHE_VERSION = 'v3';
const CHUNK_SIZE = 40;

function stripDiacritics(value) {
	return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function normalize(value) {
	return stripDiacritics(String(value || '').toLowerCase());
}

function supportedLanguageCodes() {
	return window.I18N_LANGUAGES ? Object.keys(window.I18N_LANGUAGES) : ['en'];
}

function textCacheKey(lang, id) {
	return `anecdotes_search_text_${TEXT_CACHE_VERSION}_${lang}::${id}`;
}

function readCachedText(lang, id) {
	try {
		return sessionStorage.getItem(textCacheKey(lang, id));
	} catch (error) {
		return null;
	}
}

function writeCachedText(lang, id, text) {
	try {
		sessionStorage.setItem(textCacheKey(lang, id), text);
	} catch (error) {}
}

function buildSearchableText(registryEntry, fullEntry, dateContext) {
	const parts = [registryEntry.id];
	const languageCodes = supportedLanguageCodes();

	if (fullEntry.domain) {
		languageCodes.forEach(code => parts.push(fullEntry.domain[code] || ''));
	}

	languageCodes.forEach(code => {
		try {
			const content = typeof fullEntry.content === 'function'
				? fullEntry.content(code, dateContext.getUTCFullYear(), dateContext)
				: (fullEntry.content && fullEntry.content[code]) || '';
			parts.push(content);
		} catch (error) {}
	});

	(fullEntry.sources || []).forEach(source => {
		if (source.name) languageCodes.forEach(code => parts.push(source.name[code] || ''));
	});

	(fullEntry.contexts || []).forEach(context => {
		if (context.title) languageCodes.forEach(code => parts.push(context.title[code] || ''));
	});

	return normalize(parts.join(' \u2022 '));
}

function chunkArray(array, size) {
	const chunks = [];
	for (let i = 0; i < array.length; i += size) {
		chunks.push(array.slice(i, i + size));
	}
	return chunks;
}

export async function buildSearchIndex(registryEntries, lang, dateContext, onProgress) {
	const items = [];
	const invalidItems = [];
	const groups = chunkArray(registryEntries, CHUNK_SIZE);
	let processed = 0;

	for (const group of groups) {
		const settled = await Promise.allSettled(group.map(async registryEntry => {
			const cachedText = readCachedText(lang, registryEntry.id);
			if (cachedText !== null) {
				return { registryEntry, fullEntry: null, searchText: cachedText, isValid: true };
			}
			const fullEntry = await getFullEntry(registryEntry, lang);
			if (!fullEntry || fullEntry.__loadFailed) {
				return { registryEntry, fullEntry: fullEntry || null, searchText: '', isValid: false };
			}
			const searchText = buildSearchableText(registryEntry, fullEntry, dateContext);
			writeCachedText(lang, registryEntry.id, searchText);
			return { registryEntry, fullEntry, searchText, isValid: true };
		}));

		settled.forEach(result => {
			if (result.status !== 'fulfilled') return;
			const value = result.value;
			if (value.isValid) items.push(value);
			else invalidItems.push(value);
		});

		processed += group.length;
		if (onProgress) {
			onProgress({ processed, total: registryEntries.length, validCount: items.length, invalidCount: invalidItems.length });
		}
	}

	return {
		items,
		invalidItems,
		validCount: items.length,
		invalidCount: invalidItems.length
	};
}

export function searchIndex(items, query) {
	const normalizedQuery = normalize(query).trim();
	if (!normalizedQuery) return [];
	const terms = normalizedQuery.split(/\s+/).filter(Boolean);
	return items.filter(item => terms.every(term => item.searchText.includes(term)));
}

export async function resolveFullEntry(item, lang) {
	if (item.fullEntry) return item.fullEntry;
	const fullEntry = await getFullEntry(item.registryEntry, lang);
	item.fullEntry = fullEntry;
	return fullEntry;
}
