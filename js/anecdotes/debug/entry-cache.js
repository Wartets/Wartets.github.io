import { loadAnecdoteModule } from '../loader.js';

const moduleCache = new Map();

export function getFullEntry(registryEntry, lang) {
	const cacheKey = registryEntry.path;
	if (!moduleCache.has(cacheKey)) {
		moduleCache.set(cacheKey, loadAnecdoteModule(registryEntry, lang));
	}
	return moduleCache.get(cacheKey);
}

export function resetEntryCache() {
	moduleCache.clear();
}
