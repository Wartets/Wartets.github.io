const MAX_ATTEMPTS = 3;
const BASE_DELAY_MS = 500;

function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function buildFallback(lang) {
	return {
		id: 'anecdote_fallback',
		enabled: true,
		domain: { fr: 'Indisponible', en: 'Unavailable' },
		priority: 10,
		scheduling: { type: 'anytime', dates: [] },
		content: () => {
			const translated = window.t ? window.t('anecdote.unavailable') : null;
			if (translated && translated !== 'anecdote.unavailable') return translated;
			return lang === 'fr'
				? 'Anecdote indisponible pour le moment.'
				: 'Anecdote temporarily unavailable.';
		},
		sources: [],
		contexts: []
	};
}

export async function loadAnecdoteModule(path, lang) {
	let attempt = 0;
	let lastError = null;
	while (attempt < MAX_ATTEMPTS) {
		try {
			const module = await import(path);
			return module.default;
		} catch (error) {
			lastError = error;
			attempt += 1;
			if (attempt < MAX_ATTEMPTS) {
				await wait(BASE_DELAY_MS * Math.pow(2, attempt - 1));
			}
		}
	}
	console.warn(`[anecdotes] Échec du chargement de ${path} après ${MAX_ATTEMPTS} tentatives.`, lastError);
	return buildFallback(lang);
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
