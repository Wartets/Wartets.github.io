export default {
	id: 'anecdote_feynman_smoluchowski_ratchet_demon',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Thermodynamique - Physique Statistique', en: 'Thermodynamics - Statistical Physics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Pourrait-on construire une machine nanoscopique tirant son énergie directement de la chaleur ambiante et du hasard ? Richard Feynman a analysé en 1962 un mécanisme célèbre : une minuscule roue à rochet reliée à des pales plongées dans un fluide tiède. Les molécules du fluide, s'agitant au hasard, percutent les pales, et le blocage du loquet ne laisserait la roue tourner que dans un seul sens. Feynman démontre pourtant que cette illusion s'effondre à l'échelle moléculaire : le loquet est lui-même soumis à la chaleur et tressautera de manière aléatoire, annulant toute extraction nette de travail.`,
		en: `Could one build a nanoscopic machine drawing energy directly from ambient heat and randomness? Richard Feynman analyzed a famous mechanism in 1962: a tiny ratchet wheel connected to paddles submerged in a lukewarm fluid. The fluid's randomly jostling molecules strike the paddles, and the pawl's locking would seemingly let the wheel turn only one way. Feynman showed, however, that this illusion collapses at the molecular scale: the pawl itself is subject to heat and will randomly jitter, canceling out any net extraction of work.`
	},
	sources: [
		{
			name: { fr: 'The Feynman Lectures on Physics, Vol. I, Chapter 46: Ratchet and pawl (R. P. Feynman, R. B. Leighton, M. Sands, 1963)', en: 'The Feynman Lectures on Physics, Vol. I, Chapter 46: Ratchet and pawl (R. P. Feynman, R. B. Leighton, M. Sands, 1963)' },
			url: 'https://www.feynmanlectures.caltech.edu/I_46.html'
		}
	],
	contexts: [
		{
			title: { fr: 'Bilan énergétique du rochet isotherme', en: 'Energy balance of the isothermal ratchet' },
			body: {
				fr: `Le dispositif nécessite de soulever le cliquet d'une énergie potentielle $E$ pour passer une dent. La probabilité que les pales reçoivent un choc thermique suffisant depuis le bain (température $T_1$) est $P_{avant} = \\exp\\left(-\\frac{E}{k_B T_1}\\right)$. Si le cliquet, dans la même enceinte isotherme ($T_2 = T_1$), accumule aussi une fluctuation thermique aléatoire pour glisser en arrière avec la même probabilité $P_{arriere}$, la vitesse angulaire nette devient :\n\n$$\\omega \\propto \\exp\\left(-\\frac{E}{k_B T_1}\\right) - \\exp\\left(-\\frac{E}{k_B T_2}\\right) = 0$$\n\nAucune rotation macroscopique dirigée ne se produit, préservant le second principe.`,
				en: `The device requires lifting the pawl by a potential energy $E$ to pass one tooth. The probability that the paddles receive a sufficient thermal kick from the bath (temperature $T_1$) is $P_{forward} = \\exp\\left(-\\frac{E}{k_B T_1}\\right)$. If the pawl, sitting in the same isothermal enclosure ($T_2 = T_1$), also accumulates a random thermal fluctuation allowing it to slip backward with the same probability $P_{backward}$, the net angular velocity becomes:\n\n$$\\omega \\propto \\exp\\left(-\\frac{E}{k_B T_1}\\right) - \\exp\\left(-\\frac{E}{k_B T_2}\\right) = 0$$\n\nNo directed macroscopic rotation occurs, preserving the second law.`
			},
			external: false
		},
		{
			title: { fr: 'Les moteurs browniens et le gradient thermique', en: 'Brownian motors and the thermal gradient' },
			body: {
				fr: `L'analyse de Feynman-Smoluchowski prouve aussi que si le dispositif est plongé dans deux bains thermiques asymétriques (le cliquet refroidi à $T_2 < T_1$), la machine se met spontanément à tourner. Le cliquet froid ne tressaute presque plus, tandis que les pales chaudes absorbent beaucoup de chocs : le taux de rotation devient positif. Il ne s'agit plus d'un mouvement perpétuel, mais d'une machine thermique classique extrayant du travail d'un gradient de température, dont le rendement reste strictement limité par le rendement de Carnot $\\eta \\le 1 - T_2/T_1$.`,
				en: `The Feynman-Smoluchowski analysis also proves that if the device is placed between two asymmetric thermal baths (a cooler pawl at $T_2 < T_1$), the machine spontaneously starts turning. The cold pawl barely jitters anymore, while the hot paddles absorb many kicks: the rotation rate becomes positive. This is no longer perpetual motion, but a classical heat engine extracting work from a temperature gradient, its efficiency strictly bounded by the Carnot limit $\\eta \\le 1 - T_2/T_1$.`
			},
			external: false
		}
	]
};
