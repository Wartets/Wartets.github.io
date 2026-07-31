export default {
	id: 'anecdote_triple_point_water',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Thermodynamique Appliquée', en: 'Applied Thermodynamics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Nous sommes habitués à voir l'eau bouillir à 100°C et geler à 0°C (à la pression atmosphérique du niveau de la mer). Mais si l'on place de l'eau dans une chambre sous vide et que l'on ajuste précisément la pression à 0,006 atmosphère (611,657 Pascals) pour une température exacte de 0,01°C, l'eau devient « folle ». Elle se met à bouillir vigoureusement tout en gelant simultanément pour former de la glace au milieu de la vapeur. Cet état d'équilibre thermodynamique magique où les trois phases (solide, liquide, gaz) coexistent s'appelle le « Point Triple ».`,
		en: `We are used to seeing water boil at 100°C and freeze at 0°C (at sea-level atmospheric pressure). But if water is placed in a vacuum chamber and the pressure is precisely adjusted to 0.006 atmosphere (611.657 Pascals) at an exact temperature of 0.01°C, the water goes "wild". It begins boiling vigorously while simultaneously freezing, forming ice in the middle of the vapor. This magical thermodynamic equilibrium state, where all three phases (solid, liquid, gas) coexist, is called the "Triple Point".`
	},
	sources: [
		{
			name: { fr: 'Definition of the kelvin (SI Brochure: The International System of Units) (BIPM, 2006)', en: 'Definition of the kelvin (SI Brochure: The International System of Units) (BIPM, 2006)' },
			url: 'https://www.bipm.org/en/committees/cg/cgpm/26-2018/resolution-1'
		}
	],
	contexts: [
		{
			title: { fr: 'Règle des phases de Gibbs et Équilibre chimique', en: "Gibbs' phase rule and chemical equilibrium" },
			body: {
				fr: `La coexistence thermodynamique des phases implique l'égalité des potentiels chimiques pour chaque phase $\\mu_{solide}(p,T) = \\mu_{liquide}(p,T) = \\mu_{gaz}(p,T)$. Le nombre de degrés de liberté intensifs (variance) d'un système est régi par la règle des phases de Gibbs :\n\n$$V = C - P + 2$$\n\n(où $C$ est le nombre de constituants et $P$ le nombre de phases). Pour de l'eau pure, $C = 1$. Au point triple, les trois phases sont présentes ($P = 3$). Par conséquent, $V = 1 - 3 + 2 = 0$. Le système n'a aucun degré de liberté : la pression et la température de cet événement sont uniques et universellement fixes.`,
				en: `The thermodynamic coexistence of phases implies equality of chemical potentials for each phase, $\\mu_{solid}(p,T) = \\mu_{liquid}(p,T) = \\mu_{gas}(p,T)$. The number of intensive degrees of freedom (variance) of a system is governed by Gibbs' phase rule:\n\n$$V = C - P + 2$$\n\n(where $C$ is the number of components and $P$ the number of phases). For pure water, $C = 1$. At the triple point, all three phases are present ($P = 3$). Therefore, $V = 1 - 3 + 2 = 0$. The system has zero degrees of freedom: the pressure and temperature of this event are unique and universally fixed.`
			},
			external: false
		}
	]
};
