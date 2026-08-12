import { getFullEntry } from './entry-cache.js';

function stripDiacritics(value) {
	return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function normalize(value) {
	return stripDiacritics(String(value || '').toLowerCase());
}

export async function buildSearchIndex(registryEntries, lang) {
	const settled = await Promise.allSettled(
		registryEntries.map(async registryEntry => {
			const fullEntry = await getFullEntry(registryEntry.path, lang);
			return { registryEntry, fullEntry };
		})
	);
	return settled
		.filter(result => result.status === 'fulfilled' && result.value.fullEntry && result.value.fullEntry.id !== 'anecdote_fallback')
		.map(result => result.value);
}

function buildSearchableText(item, dateContext) {
	const { registryEntry, fullEntry } = item;
	const parts = [registryEntry.id];
	if (fullEntry.domain) {
		parts.push(fullEntry.domain.fr || '', fullEntry.domain.en || '');
	}
	['fr', 'en'].forEach(lang => {
		try {
			const content = typeof fullEntry.content === 'function'
				? fullEntry.content(lang, dateContext.getUTCFullYear(), dateContext)
				: (fullEntry.content && fullEntry.content[lang]) || '';
			parts.push(content);
		} catch (error) {}
	});
	(fullEntry.sources || []).forEach(source => {
		if (source.name) parts.push(source.name.fr || '', source.name.en || '');
	});
	(fullEntry.contexts || []).forEach(context => {
		if (context.title) parts.push(context.title.fr || '', context.title.en || '');
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
