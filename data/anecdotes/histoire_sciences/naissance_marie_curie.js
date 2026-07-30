export default {
	id: 'anecdote_naissance_marie_curie',
	enabled: true,
	priority: 3,
	addedDate: '2026-07-30',
	domain: { fr: 'Histoire des Sciences', en: 'History of Science' },
	scheduling: { type: 'annual', dates: ['11-07'] },
	content: (lang, currentYear) => {
		const age = currentYear - 1867;
		return lang === 'fr'
			? `Marie Curie est née un 7 novembre. Elle aurait ${age} ans aujourd'hui.`
			: `Marie Curie was born on November 7. She would be ${age} years old today.`;
	},
	sources: [
		{
			name: { fr: 'Fondation Nobel', en: 'Nobel Foundation' },
			url: 'https://www.nobelprize.org/prizes/physics/1903/marie-curie/biographical/'
		}
	],
	contexts: []
};
