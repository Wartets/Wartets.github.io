export default {
	id: 'anecdote_zeta_regularization_casimir',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Physique - Théorie Quantique des Champs', en: 'Physics - Quantum Field Theory' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `L'une des manipulations mathématiques les plus contre-intuitives de la physique associe la somme de tous les entiers naturels à la valeur -1/12, via le prolongement analytique de la fonction zêta de Riemann. Loin d'être une simple curiosité formelle, cette régularisation justifie une force mesurable : l'attraction entre deux plaques métalliques neutres placées dans le vide quantique, l'effet Casimir.`,
		en: `One of the most counterintuitive mathematical manipulations in physics associates the sum of all natural numbers with the value -1/12, via the analytic continuation of the Riemann zeta function. Far from a mere formal curiosity, this regularization underlies a measurable force: the attraction between two neutral metallic plates placed in the quantum vacuum, the Casimir effect.`
	},
	sources: [
		{
			name: { fr: 'On the attraction between two perfectly conducting plates (1948)', en: 'On the attraction between two perfectly conducting plates (1948)' },
			url: 'https://dwc.knaw.nl/DL/publications/PU00018547.pdf'
		},
		{
			name: { fr: 'New Developments in the Casimir Effect (2001)', en: 'New Developments in the Casimir Effect (2001)' },
			url: 'https://arxiv.org/abs/quant-ph/0106045'
		}
	],
	contexts: [
		{
			title: { fr: 'Énergie du point zéro et prolongement analytique', en: 'Zero-point energy and analytic continuation' },
			body: {
				fr: `La densité d'énergie du vide entre deux plaques conductrices s'obtient en sommant les énergies de point zéro $\\frac{1}{2}\\hbar\\omega$ de tous les modes du champ électromagnétique confiné. Cette somme diverge naïvement, mais le prolongement de la fonction zêta permet de lui assigner une valeur finie :\n\n$$\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s} \\implies \\zeta(-1) = -\\frac{1}{12}$$\n\nLa force par unité de surface qui en résulte, mesurée expérimentalement avec précision depuis les années 1990, s'écrit :\n\n$$\\frac{F}{A} = -\\frac{\\pi^2 \\hbar c}{240 a^4}$$\n\noù $a$ est la distance séparant les plaques. Cette force purement quantique n'a aucun analogue en physique classique.`,
				en: `The vacuum energy density between two conducting plates is obtained by summing the zero-point energies $\\frac{1}{2}\\hbar\\omega$ of all modes of the confined electromagnetic field. This sum naively diverges, but the analytic continuation of the zeta function allows a finite value to be assigned to it:\n\n$$\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s} \\implies \\zeta(-1) = -\\frac{1}{12}$$\n\nThe resulting force per unit area, measured experimentally with precision since the 1990s, is:\n\n$$\\frac{F}{A} = -\\frac{\\pi^2 \\hbar c}{240 a^4}$$\n\nwhere $a$ is the distance separating the plates. This purely quantum force has no classical analogue.`
			},
			external: false
		}
	]
};
