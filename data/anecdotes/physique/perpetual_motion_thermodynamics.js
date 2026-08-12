export default {
	id: 'anecdote_perpetual_motion_thermodynamics',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Thermodynamique / Histoire des Sciences', en: 'Thermodynamics / History of Science' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `De Léonard de Vinci aux inventeurs amateurs contemporains, d'innombrables ingénieurs ont conçu des roues à poids basculants censées tourner indéfiniment en produisant plus d'énergie qu'elles n'en consomment. Le théorème d'Emmy Noether, publié en 1918, referme cette quête de façon définitive : il démontre que l'invariance des lois physiques par translation dans le temps implique nécessairement la conservation de l'énergie totale d'un système isolé, rendant tout moteur à mouvement perpétuel de première espèce structurellement impossible.`,
		en: `From Leonardo da Vinci to contemporary amateur inventors, countless engineers have designed wheels with tilting weights meant to spin indefinitely while producing more energy than they consume. Emmy Noether's theorem, published in 1918, closes this quest for good: it shows that the invariance of physical laws under time translation necessarily implies the conservation of total energy in an isolated system, making any perpetual motion machine of the first kind structurally impossible.`
	},
	sources: [
		{
			name: { fr: 'Invariante Variationsprobleme (E. Noether, Nachrichten von der Gesellschaft der Wissenschaften zu Göttingen, 1918)', en: 'Invariante Variationsprobleme (E. Noether, Nachrichten von der Gesellschaft der Wissenschaften zu Göttingen, 1918)' },
			url: 'https://eudml.org/doc/59024'
		}
	],
	contexts: [
		{
			title: { fr: 'De la symétrie temporelle à la conservation de l\'énergie', en: 'From time symmetry to energy conservation' },
			body: {
				fr: `Si le lagrangien $\\mathcal{L}(q, \\dot{q}, t)$ d'un système ne dépend pas explicitement du temps, c'est-à-dire $\\frac{\\partial \\mathcal{L}}{\\partial t} = 0$, alors le théorème de Noether garantit que le hamiltonien du système, $H = \\sum \\dot{q}_i p_i - \\mathcal{L}$, est constant : $\\frac{dH}{dt} = 0$. Ce hamiltonien s'identifiant à l'énergie mécanique totale, aucune machine isolée ne peut créer d'énergie nette : le premier principe de la thermodynamique n'est pas un postulat arbitraire, mais la conséquence directe et rigoureuse de l'homogénéité du temps.`,
				en: `If a system's Lagrangian $\\mathcal{L}(q, \\dot{q}, t)$ does not explicitly depend on time, that is $\\frac{\\partial \\mathcal{L}}{\\partial t} = 0$, then Noether's theorem guarantees that the system's Hamiltonian, $H = \\sum \\dot{q}_i p_i - \\mathcal{L}$, is constant: $\\frac{dH}{dt} = 0$. Since this Hamiltonian corresponds to the total mechanical energy, no isolated machine can create net energy: the first law of thermodynamics is not an arbitrary postulate but a direct, rigorous consequence of the homogeneity of time.`
			},
			external: false
		}
	]
};
