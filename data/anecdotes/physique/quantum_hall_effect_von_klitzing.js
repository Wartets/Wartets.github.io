export default {
	id: 'anecdote_quantum_hall_effect_von_klitzing',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Physique de la Matière Condensée', en: 'Condensed Matter Physics' },
	scheduling: { type: 'annual', dates: ['02-05'] },
	content: (lang, year) => {
		const elapsed = year - 1980;
		return lang === 'fr'
			? `En refroidissant un gaz d'électrons bidimensionnel près du zéro absolu sous un puissant champ magnétique, Klaus von Klitzing découvrit le 5 février 1980, il y a désormais ${elapsed} ans, que la résistance électrique transversale ne croît plus de façon linéaire, mais forme des plateaux en paliers. Le plus saisissant est que la valeur de ces plateaux est quantifiée avec une précision d'un pour un milliard, indépendamment des impuretés du matériau utilisé. Cette découverte a mené à une redéfinition complète des unités du Système International, l'ancien étalon du kilogramme reposant désormais sur la constante de Planck et la constante de von Klitzing.`
			: `By cooling a two-dimensional electron gas close to absolute zero under a powerful magnetic field, Klaus von Klitzing discovered on February 5, 1980, ${elapsed} years ago now, that transverse electrical resistance no longer increases linearly but instead forms sharp plateaus. The most striking feature is that the value of these plateaus is quantized to a precision of one part per billion, regardless of the impurities present in the material used. This discovery led to a complete redefinition of SI units, with the old kilogram standard now grounded in the Planck constant and the von Klitzing constant.`;
	},
	sources: [
		{
			name: { fr: 'New Method for High-Accuracy Determination of the Fine-Structure Constant Based on Quantized Hall Resistance (1980)', en: 'New Method for High-Accuracy Determination of the Fine-Structure Constant Based on Quantized Hall Resistance (1980)' },
			url: 'https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.45.494'
		},
		{
			name: { fr: 'Quantized Hall Conductance in a Two-Dimensional Periodic Potential (1982)', en: 'Quantized Hall Conductance in a Two-Dimensional Periodic Potential (1982)' },
			url: 'https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.49.405'
		}
	],
	contexts: [
		{
			title: { fr: 'Niveaux de Landau et nombres de Chern (TKNN)', en: 'Landau levels and Chern numbers (TKNN)' },
			body: {
				fr: `Sous un champ magnétique intense, les orbites cyclotron d'un gaz d'électrons bidimensionnel se quantifient en niveaux de Landau discrets. La résistance de Hall mesurée sur les plateaux s'exprime par :\n\n$$R_H = \\frac{h}{\\nu e^2}$$\n\noù $\\nu$ est un entier exact appelé facteur de remplissage. L'article de Thouless, Kohmoto, Nightingale et den Nijs (TKNN), publié en 1982, démontra que cet entier correspond en réalité au nombre de Chern de la fonction d'onde de la bande de Bloch considérée dans la zone de Brillouin.\n\nCe nombre de Chern est un invariant topologique, une propriété globale insensible à toute déformation continue de l'hamiltonien, y compris l'ajout d'un désordre cristallin modéré. C'est cette origine topologique qui explique l'extraordinaire précision et robustesse de la quantification observée expérimentalement, indépendamment des détails microscopiques du matériau étudié.`,
				en: `Under a strong magnetic field, the cyclotron orbits of a two-dimensional electron gas become quantized into discrete Landau levels. The Hall resistance measured on the plateaus is given by:\n\n$$R_H = \\frac{h}{\\nu e^2}$$\n\nwhere $\\nu$ is an exact integer called the filling factor. The 1982 paper by Thouless, Kohmoto, Nightingale, and den Nijs (TKNN) showed that this integer actually corresponds to the Chern number of the Bloch band wavefunction over the Brillouin zone.\n\nThis Chern number is a topological invariant, a global property insensitive to any continuous deformation of the Hamiltonian, including the addition of moderate crystalline disorder. It is this topological origin that explains the extraordinary precision and robustness of the quantization observed experimentally, regardless of the microscopic details of the material under study.`
			},
			external: false
		}
	]
};
