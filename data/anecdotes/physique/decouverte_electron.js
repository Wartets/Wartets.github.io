export default {
	id: 'anecdote_decouverte_electron',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-30',
	domain: { fr: 'Physique - Physique des particules', en: 'Physics - Particle Physics' },
	scheduling: { type: 'annual', dates: ['04-30'] },
	content: (lang, year) => {
		const elapsed = year - 1897;
		return lang === 'fr'
			? `Le 30 avril 1897, J.J. Thomson annonce à la Royal Institution avoir isolé une particule chargée négativement bien plus légère que l'atome d'hydrogène, baptisée par la suite électron, remettant en cause l'idée d'indivisibilité de l'atome, il y a désormais ${elapsed} ans.`
			: `On April 30, 1897, J.J. Thomson announced at the Royal Institution that he had isolated a negatively charged particle far lighter than the hydrogen atom, later named the electron, challenging the idea of the atom's indivisibility, ${elapsed} years ago.`;
	},
	sources: [
		{
			name: { fr: 'Philosophical Magazine (1897)', en: 'Philosophical Magazine (1897)' },
			url: 'https://web.lemoyne.edu/~giunta/thomson1897.html'
		}
	],
	contexts: []
};
