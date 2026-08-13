export default {
	id: 'anecdote_dynamical_casimir_effect_quantum',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-13',
	domain: { fr: 'Physique Quantique / Théorie des Champs', en: 'Quantum Physics / Field Theory' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Le vide quantique n'est jamais parfaitement vide : des paires de photons virtuels y apparaissent et s'annihilent continuellement sans jamais devenir observables. En 2011, une équipe de l'université de Chalmers a montré qu'en faisant vibrer la frontière effective d'une cavité supraconductrice à une vitesse proche de celle de la lumière, ces photons virtuels pouvaient être arrachés au vide et transformés en photons réels détectables, confirmant expérimentalement l'effet Casimir dynamique prédit dès les années 1970.`,
		en: `Quantum vacuum is never perfectly empty: pairs of virtual photons continuously appear and annihilate there without ever becoming observable. In 2011, a team at Chalmers University of Technology showed that rapidly modulating the effective boundary of a superconducting cavity at a speed approaching that of light could tear these virtual photons out of the vacuum and turn them into real, detectable photons, experimentally confirming the dynamical Casimir effect predicted since the 1970s.`
	},
	sources: [
		{
			name: { fr: 'Observation of the dynamical Casimir effect in a superconducting circuit (Nature, 2011)', en: 'Observation of the dynamical Casimir effect in a superconducting circuit (Nature, 2011)' },
			url: 'https://doi.org/10.1038/nature10561'
		}
	],
	contexts: [
		{
			title: { fr: 'Transformation de Bogoliubov et miroir mobile', en: 'Bogoliubov transformation and the moving mirror' },
			body: {
				fr: `Le champ électromagnétique confiné entre deux frontières oscille selon des modes normaux dont la définition dépend de la position des parois. Si une paroi se déplace à vitesse constante, les opérateurs de création et d'annihilation à deux instants différents restent liés par une simple phase. Mais si le mouvement est non uniforme, ils se mélangent par une transformation de Bogoliubov, dont les coefficients $\\beta_k$ déterminent le nombre moyen de photons réels produits dans le mode $k$ à partir du vide initial :\n\n$$\\langle 0 | \\hat{N}_k | 0 \\rangle = \\sinh^2(\\beta_k)$$\n\nLa production devient résonnante lorsque la fréquence de modulation $\\Omega$ approche $2\\omega_k$, doublant l'effet de conversion.`,
				en: `The electromagnetic field confined between two boundaries oscillates in normal modes whose definition depends on the boundary positions. If a boundary moves at constant velocity, the creation and annihilation operators at two different times remain related by a simple phase factor. But if the motion is non-uniform, they mix through a Bogoliubov transformation, whose coefficients $\\beta_k$ determine the average number of real photons produced in mode $k$ from the initial vacuum:\n\n$$\\langle 0 | \\hat{N}_k | 0 \\rangle = \\sinh^2(\\beta_k)$$\n\nPhoton production becomes resonant when the modulation frequency $\\Omega$ approaches $2\\omega_k$, doubling the conversion effect.`
			},
			external: false
		},
		{
			title: { fr: "L'expérience aux SQUID : un miroir sans mouvement mécanique", en: 'The SQUID experiment: a mirror without mechanical motion' },
			body: {
				fr: `Déplacer physiquement un miroir à une fraction significative de $c$ est irréalisable. L'expérience de 2011 contourne l'obstacle en terminant un guide d'onde supraconducteur par un SQUID, dont l'inductance effective est modulée électriquement à plusieurs gigahertz. Cette modulation équivaut à faire varier la longueur effective de la cavité à une vitesse proche de $0{,}25\\,c$, suffisante pour observer un spectre de rayonnement compatible avec la distribution thermique prédite par la théorie.`,
				en: `Physically moving a mirror at a significant fraction of $c$ is not feasible. The 2011 experiment sidesteps this by terminating a superconducting waveguide with a SQUID, whose effective inductance is electronically modulated at several gigahertz. This modulation is equivalent to varying the cavity's effective length at a speed close to $0.25\\,c$, enough to observe a radiation spectrum consistent with the thermal distribution predicted by theory.`
			},
			external: false
		}
	]
};
