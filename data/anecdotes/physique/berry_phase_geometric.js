export default {
	id: 'anecdote_berry_phase_geometric',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Physique - Mécanique Quantique Fondamentale', en: 'Physics - Fundamental Quantum Mechanics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1984, Michael Berry démontra qu'un système quantique soumis à une évolution cyclique adiabatique, revenant exactement à ses paramètres physiques de départ, conserve une mémoire topologique de son parcours géométrique. En plus de la phase dynamique attendue, la fonction d'onde accumule un facteur de phase purement géométrique, équivalent quantique du pendule de Foucault, aujourd'hui crucial pour les isolants topologiques et l'informatique quantique tolérante aux erreurs.`,
		en: `In 1984, Michael Berry demonstrated that a quantum system undergoing a cyclic adiabatic evolution, returning exactly to its initial physical parameters, retains a topological memory of its geometric path. Beyond the expected dynamical phase, the wavefunction accumulates a purely geometric phase factor, a quantum equivalent of Foucault's pendulum, now crucial to the classification of topological insulators and to error-resistant quantum computing.`
	},
	sources: [
		{
			name: { fr: 'Quantal Phase Factors Accompanying Adiabatic Changes (1984)', en: 'Quantal Phase Factors Accompanying Adiabatic Changes (1984)' },
			url: 'https://royalsocietypublishing.org/doi/10.1098/rspa.1984.0023'
		}
	],
	contexts: [
		{
			title: { fr: 'Dérivation de la connexion de Berry', en: 'Derivation of the Berry connection' },
			body: {
				fr: `Dans l'approximation adiabatique de Born-Fock, l'état instantané du système est noté $\\ket{n(\\mathbf{R})}$, où $\\mathbf{R}$ est un vecteur de paramètres de contrôle évoluant lentement.\n\nEn substituant l'état évolué dans l'équation de Schrödinger dépendante du temps, on constate que la phase accumulée ne se réduit pas à la seule phase dynamique $\\exp\\left(-\\frac{i}{\\hbar}\\int E_n\\, dt\\right)$ : un terme supplémentaire, purement géométrique, apparaît.\n\nCe terme, la phase de Berry, s'exprime comme l'intégrale curviligne de la connexion de Berry le long d'un contour fermé $C$ de l'espace des paramètres :\n\n$$\\gamma_n = i \\oint_C \\langle n(\\mathbf{R}) | \\nabla_{\\mathbf{R}} n(\\mathbf{R}) \\rangle \\cdot d\\mathbf{R}$$\n\nCette phase ne dépend que de la géométrie du chemin parcouru, et non de la vitesse à laquelle il est parcouru, un résultat directement relié au théorème de Gauss-Bonnet et aux nombres de Chern qui classifient aujourd'hui les phases topologiques de la matière.`,
				en: `In the Born-Fock adiabatic approximation, the instantaneous state of the system is denoted $\\ket{n(\\mathbf{R})}$, where $\\mathbf{R}$ is a vector of slowly varying control parameters.\n\nSubstituting the evolved state into the time-dependent Schrödinger equation shows that the accumulated phase is not reduced to the expected dynamical phase $\\exp\\left(-\\frac{i}{\\hbar}\\int E_n\\, dt\\right)$: an additional, purely geometric term appears.\n\nThis term, the Berry phase, is expressed as the line integral of the Berry connection along a closed contour $C$ in parameter space:\n\n$$\\gamma_n = i \\oint_C \\langle n(\\mathbf{R}) | \\nabla_{\\mathbf{R}} n(\\mathbf{R}) \\rangle \\cdot d\\mathbf{R}$$\n\nThis phase depends only on the geometry of the path taken, not on the speed at which it is traversed, a result directly linked to the Gauss-Bonnet theorem and to the Chern numbers that today classify the topological phases of matter.`
			},
			external: false
		}
	]
};
