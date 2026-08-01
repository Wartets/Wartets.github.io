export default {
	id: 'anecdote_mpemba_effect_freezing',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Thermodynamique', en: 'Thermodynamics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `C'est l'un des phénomènes physiques les plus contre-intuitifs du quotidien : dans certaines conditions spécifiques, un récipient d'eau chaude gèle plus rapidement qu'un récipient identique rempli d'eau froide placé dans le même congélateur. Redécouvert en 1963 par Erasto Mpemba, un lycéen tanzanien préparant de la crème glacée, cet effet s'explique aujourd'hui par la combinaison de la convection thermique accélérée, de l'évaporation (qui réduit la masse d'eau à geler) et de la rupture prématurée des liaisons hydrogène.`,
		en: `It is one of the most counterintuitive everyday physical phenomena: under certain specific conditions, a container of hot water freezes faster than an identical container of cold water placed in the same freezer. Rediscovered in 1963 by Erasto Mpemba, a Tanzanian high-school student making ice cream, this effect is today explained by a combination of accelerated thermal convection, evaporation (which reduces the mass of water left to freeze), and the premature breaking of hydrogen bonds.`
	},
	sources: [
		{
			name: { fr: 'Cool? (E.B. Mpemba, D.G. Osborne, Physics Education, 1969)', en: 'Cool? (E.B. Mpemba, D.G. Osborne, Physics Education, 1969)' },
			url: 'https://iopscience.iop.org/article/10.1088/0031-9120/4/3/312'
		}
	],
	contexts: [
		{
			title: { fr: 'Surfusion et loi de refroidissement de Newton', en: "Supercooling and Newton's law of cooling" },
			body: {
				fr: `La loi phénoménologique de refroidissement de Newton indique que le taux de perte de chaleur est proportionnel à l'écart de température avec le milieu extérieur :\n\n$$\\frac{dT}{dt} = -k(T - T_{ext})$$\n\nL'eau chaude refroidit donc initialement beaucoup plus vite en valeur absolue. De plus, l'eau froide a tendance à descendre en dessous de 0°C sans cristalliser immédiatement (surfusion). Le chauffage préalable de l'eau dégaze les gaz dissous, ce qui modifie les sites de nucléation cristalline et limite la surfusion, permettant à l'eau chaude de déclencher sa transition de phase de manière plus abrupte.`,
				en: `Newton's phenomenological cooling law states that the rate of heat loss is proportional to the temperature difference with the surrounding medium:\n\n$$\\frac{dT}{dt} = -k(T - T_{ext})$$\n\nHot water therefore initially cools much faster in absolute terms. In addition, cold water tends to drop below 0°C without immediately crystallizing (supercooling). Pre-heating water degasses dissolved gases, altering crystal nucleation sites and limiting supercooling, allowing hot water to trigger its phase transition more abruptly.`
			},
			external: false
		}
	]
};
