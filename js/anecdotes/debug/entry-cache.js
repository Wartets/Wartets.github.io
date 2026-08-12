import { loadAnecdoteModule } from '../loader.js';

const moduleCache = new Map();

export function getFullEntry(path, lang) {
	if (!moduleCache.has(path)) {
		moduleCache.set(path, loadAnecdoteModule(path, lang));
	}
	return moduleCache.get(path);
}

export function resetEntryCache() {
	moduleCache.clear();
}
