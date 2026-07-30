import { formatNumber } from '/js/anecdotes/format.js';

export default {
	id: 'anecdote_jour_pi',
	enabled: true,
	priority: 3,
	addedDate: '2026-07-30',
	domain: { fr: 'Mathématiques - Constantes', en: 'Mathematics - Constants' },
	scheduling: { type: 'annual', dates: ['03-14'] },
	content: (lang) => {
		const digits = formatNumber(3.14159265358979, lang);
		return lang === 'fr'
			? `Le 14 mars (3/14 selon la notation mois-jour) correspond aux trois premières décimales de π ≈ ${digits}. La coïncidence est poussée plus loin par les amateurs à 1h59, en référence aux décimales suivantes.`
			: `March 14 (3/14 in month-day notation) matches the first digits of π ≈ ${digits}. Enthusiasts push the coincidence further at 1:59 PM, referencing the following decimal digits.`;
	},
	sources: [
		{
			name: { fr: 'Congressional Record, House of Representatives (2009)', en: 'Congressional Record, House of Representatives (2009)' },
			url: 'https://www.congress.gov/bill/111th-congress/house-resolution/224'
		}
	],
	contexts: []
};
