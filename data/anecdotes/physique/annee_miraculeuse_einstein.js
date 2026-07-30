export default {
	id: 'anecdote_annee_miraculeuse_einstein',
	enabled: true,
	priority: 3,
	addedDate: '2026-07-30',
	domain: { fr: 'Physique - Histoire des sciences', en: 'Physics - History of Science' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1905, alors employé au bureau des brevets de Berne, Albert Einstein publie en quelques mois quatre articles qui transformeront la physique : l'effet photoélectrique, le mouvement brownien, la relativité restreinte et l'équivalence masse-énergie E=mc².`,
		en: `In 1905, while employed at the Bern patent office, Albert Einstein published four papers within a few months that would transform physics: the photoelectric effect, Brownian motion, special relativity, and mass-energy equivalence E=mc².`
	},
	sources: [
		{
			name: { fr: 'Annalen der Physik (1905)', en: 'Annalen der Physik (1905)' },
			url: 'https://onlinelibrary.wiley.com/doi/10.1002/andp.19053221004'
		}
	],
	contexts: [
		{
			title: { fr: 'Les quatre articles', en: 'The four papers' },
			body: {
				fr: `Le premier article, publié en mars, explique l'effet photoélectrique en postulant que la lumière est composée de quanta d'énergie discrets, travail qui lui vaudra le prix Nobel de physique en 1921.\n\nLe deuxième, en mai, fournit une explication statistique du mouvement brownien, apportant une preuve indirecte décisive de l'existence des atomes, encore contestée par certains physiciens de l'époque.\n\nLe troisième, en juin, introduit la relativité restreinte, qui postule l'invariance de la vitesse de la lumière et l'abandon d'un temps et d'un espace absolus.\n\nLe quatrième, en septembre, dérive de la relativité restreinte la relation $E = mc^2$, établissant l'équivalence entre masse et énergie.\n\nAucun de ces articles ne cite de bibliographie, un fait rare pour l'époque, révélateur de la nouveauté radicale des idées exposées.`,
				en: `The first paper, published in March, explains the photoelectric effect by postulating that light is composed of discrete energy quanta, work that earned him the 1921 Nobel Prize in Physics.\n\nThe second, in May, provides a statistical explanation of Brownian motion, offering decisive indirect proof of the existence of atoms, still disputed by some physicists of the time.\n\nThe third, in June, introduces special relativity, which postulates the invariance of the speed of light and abandons absolute time and space.\n\nThe fourth, in September, derives from special relativity the relation $E = mc^2$, establishing the equivalence between mass and energy.\n\nNone of these papers cites a bibliography, a rare fact for the time, revealing the radical novelty of the ideas presented.`
			},
			external: false
		}
	]
};
