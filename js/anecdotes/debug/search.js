import { getFullEntry } from './entry-cache.js';

function stripDiacritics(value) {
	return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function normalize(value) {
	return stripDiacritics(String(value || '').toLowerCase());
}

function supportedLanguageCodes() {
	return window.I18N_LANGUAGES ? Object.keys(window.I18N_LANGUAGES) : ['en'];
}

export async function buildSearchIndex(registryEntries, lang) {
	const settled = await Promise.allSettled(
		registryEntries.map(async registryEntry => {
			const fullEntry = await getFullEntry(registryEntry, lang);
			return { registryEntry, fullEntry };
		})
	);

	const resolved = settled
		.filter(result => result.status === 'fulfilled')
		.map(result => result.value);

	const items = resolved.filter(item => !item.fullEntry.__loadFailed);
	const invalidItems = resolved.filter(item => item.fullEntry.__loadFailed);

	return {
		items,
		invalidItems,
		validCount: items.length,
		invalidCount: invalidItems.length
	};
}

function buildSearchableText(item, dateContext) {
	const { registryEntry, fullEntry } = item;
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

export function searchIndex(indexItems, query, dateContext) {
	const normalizedQuery = normalize(query).trim();
	if (!normalizedQuery) return [];
	const terms = normalizedQuery.split(/\s+/).filter(Boolean);
	return indexItems.filter(item => {
		if (!item.__searchText) item.__searchText = buildSearchableText(item, dateContext);
		return terms.every(term => item.__searchText.includes(term));
	});
}
