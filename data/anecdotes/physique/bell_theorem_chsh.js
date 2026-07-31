export default {
	id: 'anecdote_bell_theorem_chsh',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Fondements de la Mécanique Quantique', en: 'Foundations of Quantum Mechanics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1935, Einstein, Podolsky et Rosen affirmaient que la mécanique quantique était incomplète et qu'il devait exister des variables cachées locales pour expliquer le comportement des particules intriquées. En 1964, John Stewart Bell transforma ce débat philosophique en un théorème testable mathématiquement, démontrant que si la nature obéit au réalisme local, certaines corrélations statistiques obéissent à une limite stricte. Les expériences d'Alain Aspect prouvèrent par la suite que la nature viole cette limite : la réalité quantique est intrinsèquement non locale.`,
		en: `In 1935, Einstein, Podolsky, and Rosen argued that quantum mechanics was incomplete and that local hidden variables had to exist to explain the behavior of entangled particles. In 1964, John Stewart Bell turned this philosophical debate into a mathematically testable theorem, showing that if nature obeys local realism, certain statistical correlations must satisfy a strict bound. Alain Aspect's experiments later proved that nature violates this bound: quantum reality is intrinsically non-local.`
	},
	sources: [
		{
			name: { fr: 'On the Einstein Podolsky Rosen paradox (1964)', en: 'On the Einstein Podolsky Rosen paradox (1964)' },
			url: 'https://journals.aps.org/ppf/abstract/10.1103/PhysicsPhysiqueFizika.1.195'
		},
		{
			name: { fr: 'Experimental Realization of Einstein-Podolsky-Rosen-Bohm Gedankenexperiment (1982)', en: 'Experimental Realization of Einstein-Podolsky-Rosen-Bohm Gedankenexperiment (1982)' },
			url: 'https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.49.91'
		}
	],
	contexts: [
		{
			title: { fr: 'Inégalité CHSH et limite de Tsirelson', en: 'The CHSH inequality and the Tsirelson bound' },
			body: {
				fr: `La version CHSH (Clauser-Horne-Shimony-Holt) de l'inégalité de Bell formalise le réalisme local à l'aide de quatre choix de mesure $(A, A', B, B')$ pouvant chacun prendre les valeurs $\\pm 1$.\n\nSi les résultats de mesure préexistent indépendamment de l'observation (réalisme) et si aucune influence ne peut se propager plus vite que la lumière (localité), alors la combinaison de corrélations suivante est nécessairement bornée :\n\n$$S = |E(A,B) - E(A,B') + E(A',B) + E(A',B')| \\le 2$$\n\nEn mécanique quantique, pour une paire de particules préparées dans l'état de Bell maximalement intriqué $\\ket{\\Psi^-} = \\frac{1}{\\sqrt{2}}(\\ket{01} - \\ket{10})$, le choix optimal des angles de mesure conduit à une violation de cette borne, atteignant la limite de Tsirelson :\n\n$$S_{QM} = 2\\sqrt{2} \\approx 2,828$$\n\nCette valeur, supérieure à la borne classique mais strictement inférieure à la borne algébrique maximale de 4, marque la frontière exacte que la mécanique quantique ne peut jamais dépasser, même si des théories encore plus non locales sont mathématiquement concevables.`,
				en: `The CHSH (Clauser-Horne-Shimony-Holt) version of Bell's inequality formalizes local realism using four measurement choices $(A, A', B, B')$, each of which can take the values $\\pm 1$.\n\nIf measurement outcomes pre-exist independently of observation (realism) and no influence can travel faster than light (locality), then the following combination of correlations is necessarily bounded:\n\n$$S = |E(A,B) - E(A,B') + E(A',B) + E(A',B')| \\le 2$$\n\nIn quantum mechanics, for a pair of particles prepared in the maximally entangled Bell state $\\ket{\\Psi^-} = \\frac{1}{\\sqrt{2}}(\\ket{01} - \\ket{10})$, the optimal choice of measurement angles leads to a violation of this bound, reaching the Tsirelson limit:\n\n$$S_{QM} = 2\\sqrt{2} \\approx 2.828$$\n\nThis value, greater than the classical bound yet strictly below the maximum algebraic bound of 4, marks the exact frontier that quantum mechanics can never exceed, even though mathematically conceivable theories could in principle be even more non-local.`
			},
			external: false
		}
	]
};
