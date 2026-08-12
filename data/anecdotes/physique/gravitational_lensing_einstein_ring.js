export default {
	id: 'anecdote_gravitational_lensing_einstein_ring',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Cosmologie / Relativité Générale', en: 'Cosmology / General Relativity' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `L'une des prédictions les plus spectaculaires de la relativité générale est la capacité d'une masse galactique à courber l'espace au point de transformer une galaxie lointaine en un télescope naturel géant. Lorsqu'une source lumineuse et une masse gravitationnelle s'alignent parfaitement sur la ligne de visée d'un observateur, la lumière de la source est déviée symétriquement tout autour de la masse, formant un mirage circulaire complet appelé « anneau d'Einstein ».`,
		en: `One of the most spectacular predictions of general relativity is the ability of a galactic mass to curve space so severely that it turns a distant galaxy into a giant natural telescope. When a light source and a gravitational mass align perfectly along an observer's line of sight, the source's light is bent symmetrically all the way around the mass, forming a complete circular mirage called an "Einstein ring".`
	},
	sources: [
		{
			name: { fr: 'Lens-Like Action of a Star by the Deviation of Light in the Gravitational Field (A. Einstein, Science, 1936)', en: 'Lens-Like Action of a Star by the Deviation of Light in the Gravitational Field (A. Einstein, Science, 1936)' },
			url: 'https://doi.org/10.1126/science.84.2188.506'
		}
	],
	contexts: [
		{
			title: { fr: 'Angle de déflexion et rayon d\'Einstein', en: 'Deflection angle and the Einstein radius' },
			body: {
				fr: `En relativité générale, un photon de paramètre d'impact $b$ frôlant une masse ponctuelle $M$ subit une déflexion angulaire :\n\n$$\\hat{\\alpha} = \\frac{4GM}{c^2 b}$$\n\nsoit le double de la valeur prédite par la mécanique newtonienne classique appliquée à un corpuscule massif. Dans le cas d'un alignement parfait entre l'observateur, la lentille (à distance $D_L$) et la source (à distance $D_S$, avec $D_{LS}$ la distance lentille-source), l'image se distord en un anneau dont le rayon angulaire, dit rayon d'Einstein, s'écrit :\n\n$$\\theta_E = \\sqrt{\\frac{4GM}{c^2}\\frac{D_{LS}}{D_L D_S}}$$\n\nCette mesure permet aujourd'hui d'estimer la masse d'amas de galaxies entiers, y compris leur matière noire invisible.`,
				en: `In general relativity, a photon with impact parameter $b$ grazing a point mass $M$ undergoes an angular deflection:\n\n$$\\hat{\\alpha} = \\frac{4GM}{c^2 b}$$\n\ntwice the value predicted by classical Newtonian mechanics applied to a massive particle. In the case of a perfect alignment between the observer, the lens (at distance $D_L$) and the source (at distance $D_S$, with $D_{LS}$ the lens-source distance), the image distorts into a ring whose angular radius, called the Einstein radius, is:\n\n$$\\theta_E = \\sqrt{\\frac{4GM}{c^2}\\frac{D_{LS}}{D_L D_S}}$$\n\nThis measurement is now used to estimate the mass of entire galaxy clusters, including their invisible dark matter.`
			},
			external: false
		}
	]
};
