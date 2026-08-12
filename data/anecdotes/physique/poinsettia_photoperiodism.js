export default {
	id: 'anecdote_poinsettia_photoperiodism',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Physique - Biophysique / Photopériodisme', en: 'Physics - Biophysics / Photoperiodism' },
	scheduling: { type: 'period', dates: ['12-01', '12-25'] },
	content: {
		fr: `Le poinsettia (Euphorbia pulcherrima), plante incontournable des fêtes de fin d'année, ne rougit ses bractées (des feuilles modifiées, et non de véritables pétales) qu'en réponse à un signal précis de photopériodisme : il lui faut environ 12 à 14 heures consécutives d'obscurité totale et ininterrompue, chaque nuit pendant 8 à 10 semaines, pour déclencher le mécanisme responsable de sa coloration, régulé par le système pigmentaire du phytochrome.`,
		en: `The poinsettia (Euphorbia pulcherrima), the quintessential holiday-season plant, only turns its bracts (modified leaves, not true flower petals) red in response to a precise photoperiodism signal: it requires roughly 12 to 14 consecutive hours of complete, uninterrupted darkness, every night for 8 to 10 weeks, to trigger the mechanism responsible for its coloration, regulated by the phytochrome pigment system.`
	},
	sources: [
		{
			name: { fr: 'Determining the Optimum Night Length for Flower Development in a Modern Poinsettia Cultivar (M. J. Alden, J. E. Faust, HortScience, 2022)', en: 'Determining the Optimum Night Length for Flower Development in a Modern Poinsettia Cultivar (M. J. Alden, J. E. Faust, HortScience, 2022)' },
			url: 'https://doi.org/10.21273/HORTSCI16112-21'
		}
	],
	contexts: [
		{
			title: { fr: 'Le système phytochrome et le seuil critique d\'obscurité', en: 'The phytochrome system and the critical dark-period threshold' },
			body: {
				fr: `Le phytochrome existe sous deux formes interconvertibles : $P_r$, sensible au rouge, inactive, et $P_{fr}$, sensible au rouge lointain, active. La lumière du jour convertit progressivement $P_r$ en $P_{fr}$, tandis qu'une lente réversion $P_{fr} \\rightarrow P_r$ s'opère spontanément dans l'obscurité. La floraison et la coloration des bractées ne se déclenchent que lorsque le taux de $P_{fr}$ redescend sous un seuil critique, ce qui exige une obscurité suffisamment longue et surtout ininterrompue : la moindre exposition lumineuse brève pendant la nuit (phare de voiture, réverbère) réinitialise le cycle et empêche la coloration, ce qui explique pourquoi les producteurs professionnels utilisent des rideaux occultants stricts.`,
				en: `Phytochrome exists in two interconvertible forms: $P_r$, red-absorbing and inactive, and $P_{fr}$, far-red-absorbing and active. Daylight progressively converts $P_r$ into $P_{fr}$, while a slow spontaneous reversion $P_{fr} \\rightarrow P_r$ occurs in darkness. Flowering and bract coloration are only triggered once the $P_{fr}$ level falls below a critical threshold, which requires sufficiently long and, crucially, uninterrupted darkness: even a brief light exposure during the night (a car's headlights, a streetlamp) resets the cycle and prevents coloration, which is why commercial growers use strict blackout curtains.`
			},
			external: false
		}
	]
};
