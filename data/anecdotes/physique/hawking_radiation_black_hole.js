export default {
	id: 'anecdote_hawking_radiation_black_hole',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Gravité Quantique - Cosmologie', en: 'Quantum Gravity - Cosmology' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Un trou noir est défini par une gravité si intense que même la lumière ne peut s'en échapper. Pourtant, en 1974, Stephen Hawking démontre théoriquement que les trous noirs ne sont pas totalement noirs : ils brillent d'une très faible lueur thermique. L'espace vide autour de l'horizon des événements est rempli de paires de particules virtuelles apparaissant et disparaissant. Parfois, la gravité arrache l'une d'elles et absorbe son partenaire d'énergie négative. Vue de l'extérieur, la particule échappée devient un rayonnement réel, ce qui force, sur des échelles de temps immenses, le trou noir à s'évaporer et à disparaître.`,
		en: `A black hole is defined by gravity so intense that not even light can escape it. Yet in 1974, Stephen Hawking theoretically demonstrated that black holes are not entirely black: they glow with a very faint thermal light. The empty space around the event horizon is filled with virtual particle pairs constantly appearing and disappearing. Sometimes gravity tears one away and absorbs its negative-energy partner. Seen from the outside, the escaped particle becomes real radiation, which, over immense timescales, forces the black hole to evaporate and eventually vanish.`
	},
	sources: [
		{
			name: { fr: 'Particle creation by black holes (S. W. Hawking, Communications in Mathematical Physics, 1975)', en: 'Particle creation by black holes (S. W. Hawking, Communications in Mathematical Physics, 1975)' },
			url: 'https://doi.org/10.1007/BF02345020'
		}
	],
	contexts: [
		{
			title: { fr: 'Théorie quantique des champs en espace courbe', en: 'Quantum field theory in curved spacetime' },
			body: {
				fr: `La démonstration de Hawking repose sur l'incompatibilité de la définition du vide entre deux observateurs. Un observateur en chute libre définit un vide de Minkowski, tandis qu'un observateur éloigné utilise des coordonnées de Schwarzschild. Les modes de fréquence positive du premier se développent sur une combinaison de modes de fréquence positive et négative du second via une transformation de Bogolioubov. L'opérateur de nombre de particules perçu par l'observateur lointain est :\n\n$$\\langle 0_{in} | \\hat{N}_{out} | 0_{in} \\rangle = \\sum_j |\\beta_{ij}|^2 \\neq 0$$\n\nLe vide originel est perçu à l'infini comme un bain thermique de particules réelles.`,
				en: `Hawking's demonstration relies on the incompatibility between the definitions of vacuum held by two different observers. A freely falling observer defines a Minkowski vacuum, while a distant observer uses Schwarzschild coordinates. The positive-frequency modes of the former expand as a combination of positive- and negative-frequency modes of the latter, via a Bogoliubov transformation. The particle-number operator perceived by the distant observer is:\n\n$$\\langle 0_{in} | \\hat{N}_{out} | 0_{in} \\rangle = \\sum_j |\\beta_{ij}|^2 \\neq 0$$\n\nThe original vacuum is perceived at infinity as a thermal bath of real particles.`
			},
			external: false
		},
		{
			title: { fr: 'Température de Bekenstein-Hawking', en: 'Bekenstein-Hawking temperature' },
			body: {
				fr: `Le spectre des particules émises correspond exactement à celui d'un corps noir idéal. Pour un trou noir de Schwarzschild, la température s'obtient via la gravité de surface $\\kappa$ évaluée sur l'horizon :\n\n$$T_H = \\frac{\\hbar c^3}{8 \\pi G M k_B}$$\n\nCette équation lie relativité, mécanique quantique et thermodynamique, et indique un phénomène de capacité thermique négative : plus un trou noir est petit, plus il est chaud et plus il s'évapore rapidement, conduisant à une explosion finale.`,
				en: `The spectrum of emitted particles corresponds exactly to that of an ideal black body. For a Schwarzschild black hole, the temperature is obtained via the surface gravity $\\kappa$ evaluated at the horizon:\n\n$$T_H = \\frac{\\hbar c^3}{8 \\pi G M k_B}$$\n\nThis equation links relativity, quantum mechanics, and thermodynamics, and reveals a negative heat capacity: the smaller a black hole is, the hotter it becomes and the faster it evaporates, leading to a final explosive burst.`
			},
			external: false
		},
		{
			title: { fr: 'Le paradoxe de l\'information', en: 'The information paradox' },
			body: {
				fr: `Si l'on jette une encyclopédie dans un trou noir, l'information est avalée. Puisque le rayonnement de Hawking est strictement thermique et stochastique (ne dépendant que de $M$), il ne code aucune de ces informations. À la fin de l'évaporation, le trou noir disparaît et l'information semble définitivement détruite, ce qui viole le principe d'unitarité de la mécanique quantique, où une évolution s'écrit $|\\psi(t)\\rangle = e^{-iHt} |\\psi(0)\\rangle$. Ce conflit reste aujourd'hui l'un des plus grands problèmes non résolus de la physique fondamentale.`,
				en: `If an encyclopedia is thrown into a black hole, its information is swallowed. Since Hawking radiation is strictly thermal and stochastic (depending only on $M$), it encodes none of that information. By the end of evaporation, the black hole disappears and the information seems permanently destroyed, violating the unitarity principle of quantum mechanics, where evolution is written $|\\psi(t)\\rangle = e^{-iHt} |\\psi(0)\\rangle$. This conflict remains one of the greatest unresolved problems in fundamental physics today.`
			},
			external: false
		}
	]
};
