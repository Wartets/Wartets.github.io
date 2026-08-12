const MAX_ATTEMPTS = 3;
const BASE_DELAY_MS = 500;

function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function buildFallback(registryEntry, lang, error) {
	const attemptedId = (registryEntry && registryEntry.id) ? registryEntry.id : 'unknown';
	const attemptedPath = (registryEntry && registryEntry.path) ? registryEntry.path : 'unknown';
	const errorMessage = error ? (error.message || String(error)) : 'Unknown error';
	return {
		id: attemptedId,
		enabled: true,
		priority: registryEntry ? registryEntry.priority : null,
		addedDate: registryEntry ? registryEntry.addedDate : null,
		domain: { fr: 'Erreur de chargement', en: 'Loading error' },
		scheduling: registryEntry ? registryEntry.scheduling : { type: 'anytime', dates: [] },
		content: () => {
			const translated = window.t ? window.t('anecdote.unavailable') : null;
			if (translated && translated !== 'anecdote.unavailable') return translated;
			return lang === 'fr'
				? 'Anecdote indisponible pour le moment.'
				: 'Anecdote temporarily unavailable.';
		},
		sources: [],
		contexts: [],
		__loadFailed: true,
		__attemptedPath: attemptedPath,
		__errorMessage: errorMessage
	};
}

export async function loadAnecdoteModule(registryEntry, lang) {
	let attempt = 0;
	let lastError = null;
	while (attempt < MAX_ATTEMPTS) {
		try {
			const module = await import(registryEntry.path);
			if (!module || !module.default) {
				throw new Error(`Module at ${registryEntry.path} has no default export`);
			}
			return module.default;
		} catch (error) {
			lastError = error;
			attempt += 1;
			if (attempt < MAX_ATTEMPTS) {
				await wait(BASE_DELAY_MS * Math.pow(2, attempt - 1));
			}
		}
	}
	console.warn(`[anecdotes] Échec du chargement de ${registryEntry.path} après ${MAX_ATTEMPTS} tentatives.`, lastError);
	return buildFallback(registryEntry, lang, lastError);
}

export async function loadRegistry() {
	try {
		const module = await import('/data/anecdotes/registry.js');
		return module.default;
	} catch (error) {
		console.error('[anecdotes] Registre indisponible.', error);
		return [];
	}
}
