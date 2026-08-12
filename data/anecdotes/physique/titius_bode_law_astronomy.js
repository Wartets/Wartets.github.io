export default {
	id: 'anecdote_titius_bode_law_astronomy',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Astronomie - Histoire des Sciences', en: 'Astronomy - History of Science' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1766, l'astronome allemand Johann Titius remarque une troublante régularité dans la position des planètes par rapport au Soleil. Une simple formule mathématique de doublage correspondait à la distance exacte de Mercure, Vénus, la Terre, Mars, Jupiter et Saturne, à l'exception d'un « vide » non identifié entre Mars et Jupiter. Cette loi devint si célèbre qu'elle mena à la découverte de Cérès et de la ceinture d'astéroïdes. Elle s'effondra finalement en 1846 avec la découverte de Neptune, prouvant qu'il s'agissait d'une coïncidence dynamique plutôt que d'une vérité fondamentale.`,
		en: `In 1766, German astronomer Johann Titius noticed a puzzling regularity in the position of the planets relative to the Sun. A simple doubling formula matched the exact distances of Mercury, Venus, Earth, Mars, Jupiter, and Saturn, except for an unidentified "gap" between Mars and Jupiter. This law became so famous that it led to the discovery of Ceres and the asteroid belt. It finally collapsed in 1846 with the discovery of Neptune, proving it was a dynamical coincidence rather than a fundamental truth.`
	},
	sources: [
		{
			name: { fr: 'Anleitung zur Kenntniss des gestirnten Himmels (J. E. Bode, 1772)', en: 'Anleitung zur Kenntniss des gestirnten Himmels (J. E. Bode, 1772)' },
			url: 'https://archive.org/details/anleitungzurken00bodegoog'
		}
	],
	contexts: [
		{
			title: { fr: 'Progression géométrique orbitale empirique', en: 'Empirical orbital geometric progression' },
			body: {
				fr: `La loi de Titius-Bode, dépourvue de fondement dans la mécanique newtonienne, s'énonce comme une suite empirique pour le demi-grand axe $a$ des planètes (en Unités Astronomiques). En notant $m$ l'indice de l'objet ($m = -\\infty$ pour Mercure, $m = 0$ pour Vénus, $m = 1$ pour la Terre, etc.), la formule s'écrit :\n\n$$a_m \\approx 0,4 + 0,3 \\times 2^m \\quad \\text{UA}$$\n\nElle donne $a = 1,0$ pour la Terre et $a = 5,2$ pour Jupiter (corrects), et posait une orbite à $a = 2,8$ ($m = 3$). La découverte de Cérès (orbite réelle à 2,77 UA) en 1801 confirma transitoirement la loi. L'analyse moderne par simulations N-corps suppose que ces rapports résultent des migrations et résonances de mouvement moyen qui ordonnent les orbites au fil des milliards d'années.`,
				en: `The Titius-Bode law, lacking any foundation in Newtonian mechanics, is stated as an empirical sequence for the semi-major axis $a$ of the planets (in Astronomical Units). Denoting $m$ the index of the object ($m = -\\infty$ for Mercury, $m = 0$ for Venus, $m = 1$ for Earth, etc.), the formula reads:\n\n$$a_m \\approx 0.4 + 0.3 \\times 2^m \\quad \\text{AU}$$\n\nIt gives $a = 1.0$ for Earth and $a = 5.2$ for Jupiter (correct), and predicted an orbit at $a = 2.8$ ($m = 3$). The discovery of Ceres (actual orbit at 2.77 AU) in 1801 transiently confirmed the law. Modern N-body simulations suggest these ratios result from planetary migration and mean-motion resonances that order orbits over billions of years.`
			},
			external: false
		}
	]
};
