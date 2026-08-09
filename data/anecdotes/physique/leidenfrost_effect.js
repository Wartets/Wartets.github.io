export default {
	id: 'anecdote_leidenfrost_effect',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Thermodynamique / Transfert Thermique', en: 'Thermodynamics / Heat Transfer' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Si vous déposez une goutte d'eau sur une poêle chauffée à 100°C, elle bout et s'évapore rapidement. Mais si vous chauffez la poêle violemment jusqu'à 200°C, un phénomène surprenant se produit : la goutte d'eau refuse de bouillir. Elle se forme en perle et glisse sur la surface métallique comme sur une patinoire, survivant beaucoup plus longtemps. C'est l'effet Leidenfrost : la base de la goutte se vaporise instantanément, créant un coussin de gaz microscopique sur lequel elle lévite, ce gaz jouant le rôle d'un bouclier thermique isolant.`,
		en: `If you drop a bead of water onto a pan heated to 100°C, it boils and evaporates quickly. But if you heat the pan violently up to 200°C, a surprising thing happens: the water drop refuses to boil. It forms into a bead and glides across the metal surface as if on a skating rink, surviving far longer. This is the Leidenfrost effect: the base of the drop instantly vaporizes, creating a microscopic gas cushion on which it levitates, this gas acting as an insulating thermal shield.`
	},
	sources: [
		{
			name: { fr: 'De aquae communis nonnullis qualitatibus tractatus (J.G. Leidenfrost, 1756)', en: 'De aquae communis nonnullis qualitatibus tractatus (J.G. Leidenfrost, 1756)' },
			url: 'https://doi.org/10.13140/RG.2.1.1442.7045'
		}
	],
	contexts: [
		{
			title: { fr: 'Régime d\'ébullition en film et conductivité', en: 'Film boiling regime and thermal conductivity' },
			body: {
				fr: `Le transfert de chaleur $q$ entre la surface solide (température $T_s$) et le liquide (température de saturation $T_{sat}$) suit la loi de refroidissement de Newton. Au-delà du point de flux de chaleur critique (crise d'ébullition), on entre dans le régime d'ébullition en film (film boiling).\n\nLa conductivité thermique de la vapeur d'eau ($\\approx 0,025$ W/m·K) étant environ 24 fois plus faible que celle de l'eau liquide ($\\approx 0,6$ W/m·K), le flux thermique s'effondre :\n\n$$q = h(T_s - T_{sat}) \\quad \\text{où } h \\text{ (coefficient de transfert) diminue fortement}$$\n\nLa durée de vie de la goutte augmente alors drastiquement, à l'inverse de l'intuition qui suggère qu'une surface plus chaude fait bouillir plus vite.`,
				en: `Heat transfer $q$ between the solid surface (temperature $T_s$) and the liquid (saturation temperature $T_{sat}$) follows Newton's law of cooling. Beyond the critical heat flux point (boiling crisis), the system enters the film boiling regime.\n\nSince the thermal conductivity of water vapor ($\\approx 0.025$ W/m·K) is about 24 times lower than that of liquid water ($\\approx 0.6$ W/m·K), the heat flux collapses:\n\n$$q = h(T_s - T_{sat}) \\quad \\text{where } h \\text{ (transfer coefficient) drops sharply}$$\n\nThe drop's lifetime then increases drastically, contrary to the intuition that a hotter surface should boil liquid faster.`
			},
			external: false
		}
	]
};
