export default {
	id: 'anecdote_hypothese_riemann',
	enabled: true,
	priority: 3,
	addedDate: '2026-07-30',
	domain: { fr: 'Mathématiques - Théorie des nombres', en: 'Mathematics - Number Theory' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1859, dans un article de huit pages, Bernhard Riemann conjecture que tous les zéros non triviaux de sa fonction zêta possèdent une partie réelle égale à 1/2, un énoncé encore non démontré aujourd'hui et récompensé d'un million de dollars par l'institut Clay.`,
		en: `In 1859, in an eight-page paper, Bernhard Riemann conjectured that every non-trivial zero of his zeta function has real part equal to 1/2, a statement still unproven today and carrying a one-million-dollar prize from the Clay Institute.`
	},
	sources: [
		{
			name: { fr: 'Clay Mathematics Institute', en: 'Clay Mathematics Institute' },
			url: 'https://www.claymath.org/millennium/riemann-hypothesis/'
		}
	],
	contexts: [
		{
			title: { fr: "Comprendre l'hypothèse de Riemann", en: 'Understanding the Riemann Hypothesis' },
			external: true,
			externalPath: {
				fr: '/contexts_pages/hypothese_riemann_fr.html',
				en: '/contexts_pages/hypothese_riemann_en.html'
			}
		}
	]
};
