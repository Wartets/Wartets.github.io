export default {
	id: 'anecdote_planck_units_natural_scale',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Physique / Métrologie', en: 'Physics / Metrology' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1899, Max Planck remarque que trois constantes fondamentales de la physique, la vitesse de la lumière, la constante de gravitation et sa propre constante quantique, peuvent se combiner pour définir un système d'unités de longueur, de temps et de masse totalement indépendant de toute convention humaine, valable pour n'importe quelle civilisation de l'univers observable, y compris extraterrestre.`,
		en: `In 1899, Max Planck noticed that three fundamental constants of physics, the speed of light, the gravitational constant, and his own quantum constant, could be combined to define a system of length, time, and mass units entirely independent of any human convention, valid for any civilization in the observable universe, including extraterrestrial ones.`
	},
	sources: [
		{
			name: { fr: 'Über irreversible Strahlungsvorgänge (M. Planck, Sitzungsberichte der Preussischen Akademie der Wissenschaften, 1899)', en: 'Über irreversible Strahlungsvorgänge (M. Planck, Sitzungsberichte der Preussischen Akademie der Wissenschaften, 1899)' },
			url: 'https://onlinelibrary.wiley.com/doi/10.1002/andp.19003060105'
		}
	],
	contexts: [
		{
			title: { fr: 'Construire une longueur à partir de trois constantes', en: 'Building a length from three constants' },
			body: {
				fr: `Par analyse dimensionnelle, la seule combinaison de $c$ (vitesse de la lumière), $G$ (constante de gravitation) et $\\hbar$ (constante de Planck réduite) ayant la dimension d'une longueur est :\n\n$$\\ell_P = \\sqrt{\\frac{\\hbar G}{c^3}} \\approx 1{,}6 \\times 10^{-35}\\ \\text{m}$$\n\nLe temps de Planck correspondant, $t_P = \\ell_P / c \\approx 5{,}4 \\times 10^{-44}$ s, marque l'échelle en deçà de laquelle la relativité générale et la mécanique quantique entrent en conflit théorique, aucune théorie unifiée de gravité quantique n'ayant encore décrit rigoureusement la physique à cette échelle.`,
				en: `Through dimensional analysis, the only combination of $c$ (speed of light), $G$ (gravitational constant), and $\\hbar$ (reduced Planck constant) with the dimension of a length is:\n\n$$\\ell_P = \\sqrt{\\frac{\\hbar G}{c^3}} \\approx 1.6 \\times 10^{-35}\\ \\text{m}$$\n\nThe corresponding Planck time, $t_P = \\ell_P / c \\approx 5.4 \\times 10^{-44}$ s, marks the scale below which general relativity and quantum mechanics enter theoretical conflict, as no unified theory of quantum gravity has yet rigorously described physics at this scale.`
			},
			external: false
		}
	]
};
