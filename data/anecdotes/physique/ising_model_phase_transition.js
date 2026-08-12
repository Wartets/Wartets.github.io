export default {
	id: 'anecdote_ising_model_phase_transition',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Physique Statistique', en: 'Statistical Physics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Pourquoi un aimant perd-il soudainement sa capacité de magnétisation au-delà d'une certaine température de chauffe, le point de Curie ? En 1924, Ernst Ising tente de modéliser ce phénomène en considérant les atomes du métal comme de petits aimants, des spins, pouvant pointer vers le « haut » ou vers le « bas », disposés sur une ligne. Ising démontra que sur une simple ligne, à une dimension, le métal ne pouvait pas devenir magnétique. Il fallut attendre vingt ans pour que le physicien Lars Onsager réussisse l'exploit de résoudre ce modèle sur une grille à deux dimensions, prouvant mathématiquement pour la première fois comment le chaos thermique parvient à détruire un ordre microscopique local.`,
		en: `Why does a magnet suddenly lose its ability to be magnetized above a certain heating temperature, the Curie point? In 1924, Ernst Ising attempted to model this phenomenon by treating the metal's atoms as tiny magnets, spins, pointing either "up" or "down", arranged along a line. Ising showed that on a simple one-dimensional line, the metal could not become magnetic. It took twenty years for physicist Lars Onsager to achieve the feat of solving this model on a two-dimensional grid, mathematically proving for the first time how thermal chaos manages to destroy local microscopic order.`
	},
	sources: [
		{
			name: { fr: 'Crystal Statistics. I. A Two-Dimensional Model with an Order-Disorder Transition (L. Onsager, Physical Review, 1944)', en: 'Crystal Statistics. I. A Two-Dimensional Model with an Order-Disorder Transition (L. Onsager, Physical Review, 1944)' },
			url: 'https://doi.org/10.1103/PhysRev.65.117'
		}
	],
	contexts: [
		{
			title: { fr: 'Hamiltonien du Modèle d\'Ising et Température Critique', en: 'The Ising Model Hamiltonian and Critical Temperature' },
			body: {
				fr: `Le modèle associe à chaque site du réseau une variable de spin discrète $\\sigma_i \\in \\{-1, +1\\}$. L'interaction se limite souvent aux plus proches voisins, notés $\\langle i, j \\rangle$. En l'absence de champ magnétique externe, l'énergie de la configuration s'écrit :\n\n$$\\mathcal{H} = -J \\sum_{\\langle i,j \\rangle} \\sigma_i \\sigma_j$$\n\noù $J$ est la constante de couplage d'échange. Si $J > 0$, le système est ferromagnétique. L'aimantation spontanée émerge lorsque la température passe sous un seuil critique $T_c$. En 1944, Onsager a obtenu la solution analytique exacte de la fonction de partition pour un réseau carré 2D infini, prouvant que la transition de phase a lieu très exactement à la température vérifiant $\\sinh\\left(\\frac{2J}{k_B T_c}\\right) = 1$.`,
				en: `The model assigns to each lattice site a discrete spin variable $\\sigma_i \\in \\{-1, +1\\}$. Interactions are often limited to nearest neighbors, denoted $\\langle i, j \\rangle$. In the absence of an external magnetic field, the configuration's energy is written:\n\n$$\\mathcal{H} = -J \\sum_{\\langle i,j \\rangle} \\sigma_i \\sigma_j$$\n\nwhere $J$ is the exchange coupling constant. If $J > 0$, the system is ferromagnetic. Spontaneous magnetization emerges when the temperature drops below a critical threshold $T_c$. In 1944, Onsager obtained the exact analytical solution of the partition function for an infinite 2D square lattice, proving that the phase transition occurs exactly at the temperature satisfying $\\sinh\\left(\\frac{2J}{k_B T_c}\\right) = 1$.`
			},
			external: false
		}
	]
};
