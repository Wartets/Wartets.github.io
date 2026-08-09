export default {
	id: 'anecdote_gps_relativity_correction',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Physique Appliquée / Relativité', en: 'Applied Physics / Relativity' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Les équations d'Einstein sur la relativité restreinte et générale peuvent sembler n'avoir d'intérêt que pour les astrophysiciens, mais sans elles, la carte de votre smartphone vous perdrait en quelques minutes. Les satellites GPS tournant à grande vitesse (environ 14 000 km/h), leurs horloges atomiques embarquées « ralentissent » par rapport à nous à cause de la relativité restreinte. Simultanément, étant plus éloignés de la Terre, la gravité plus faible fait qu'ils « accélèrent » dans le temps à cause de la relativité générale. L'effet net nécessite une correction logicielle quotidienne, sans laquelle le positionnement dériverait d'environ 11 kilomètres par jour.`,
		en: `Einstein's equations of special and general relativity might seem relevant only to astrophysicists, but without them, your smartphone's map would lose you within minutes. GPS satellites, traveling at high speed (about 14,000 km/h), have their onboard atomic clocks "slow down" relative to us due to special relativity. Simultaneously, being farther from Earth, weaker gravity makes them "speed up" in time due to general relativity. The net effect requires a daily software correction, without which positioning would drift by about 11 kilometers per day.`
	},
	sources: [
		{
			name: { fr: 'Relativity and the Global Positioning System (N. Ashby, Physics Today, 2003)', en: 'Relativity and the Global Positioning System (N. Ashby, Physics Today, 2003)' },
			url: 'https://doi.org/10.12942/lrr-2003-1'
		}
	],
	contexts: [
		{
			title: { fr: 'Dilatation temporelle cinématique et gravitationnelle', en: 'Kinematic and gravitational time dilation' },
			body: {
				fr: `Le décalage temporel relatif $\\frac{\\Delta t}{t}$ subit deux contributions opposées. La relativité restreinte (vitesse $v$) induit un retard cinématique : $-\\frac{v^2}{2c^2}$. La relativité générale (potentiel gravitationnel newtonien $\\Phi = -\\frac{GM}{r}$) induit une avance gravitationnelle par rapport à la surface : $\\frac{\\Delta \\Phi}{c^2} = \\frac{GM}{c^2} \\left(\\frac{1}{R_{\\text{terre}}} - \\frac{1}{R_{\\text{orbite}}}\\right)$. Le bilan net donne l'avance totale par jour :\n\n$$\\Delta t = \\int_{0}^{24h} \\left( \\frac{\\Delta \\Phi}{c^2} - \\frac{v^2}{2c^2} \\right) dt \\approx + 38 \\text{ microsecondes/jour}$$`,
				en: `The relative time shift $\\frac{\\Delta t}{t}$ has two opposing contributions. Special relativity (velocity $v$) induces a kinematic delay: $-\\frac{v^2}{2c^2}$. General relativity (Newtonian gravitational potential $\\Phi = -\\frac{GM}{r}$) induces a gravitational advance relative to the surface: $\\frac{\\Delta \\Phi}{c^2} = \\frac{GM}{c^2} \\left(\\frac{1}{R_{earth}} - \\frac{1}{R_{orbit}}\\right)$. The net balance gives the total daily advance:\n\n$$\\Delta t = \\int_{0}^{24h} \\left( \\frac{\\Delta \\Phi}{c^2} - \\frac{v^2}{2c^2} \\right) dt \\approx + 38 \\text{ microseconds/day}$$`
			},
			external: false
		}
	]
};
