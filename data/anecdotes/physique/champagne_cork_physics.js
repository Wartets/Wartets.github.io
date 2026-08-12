export default {
	id: 'anecdote_champagne_cork_physics',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Physique - Thermodynamique des Gaz', en: 'Physics - Gas Thermodynamics' },
	scheduling: { type: 'period', dates: ['12-29', '01-02'] },
	content: {
		fr: `La seconde fermentation en bouteille du champagne produit une pression interne d'environ 6 bars, comparable à celle d'un pneu de camion. Lorsque le bouchon est libéré, il peut atteindre plus de 40 km/h en quelques millisecondes. Le nuage blanc caractéristique qui s'échappe alors du goulot n'est pas de la vapeur d'eau chaude, mais l'effet inverse : une brusque détente du gaz qui refroidit l'air ambiant sous son point de rosée, provoquant une condensation instantanée, exactement comme dans la formation d'un nuage naturel.`,
		en: `The secondary fermentation inside a champagne bottle produces an internal pressure of roughly 6 bar, comparable to a truck tire. Once released, the cork can reach speeds exceeding 40 km/h within milliseconds. The characteristic white cloud escaping the neck is not hot water vapor, but the opposite effect: a sudden gas expansion that cools the surrounding air below its dew point, causing instant condensation, exactly as in the formation of a natural cloud.`
	},
	sources: [
		{
			name: { fr: 'G. Liger-Belair, The Physics and Chemistry behind the Bubbling Properties of Champagne and Sparkling Wines (Journal of Agricultural and Food Chemistry, 2005)', en: 'G. Liger-Belair, The Physics and Chemistry behind the Bubbling Properties of Champagne and Sparkling Wines (Journal of Agricultural and Food Chemistry, 2005)' },
			url: 'https://pubs.acs.org/journal/jafcau'
		}
	],
	contexts: [
		{
			title: { fr: 'Détente adiabatique et formation du nuage de condensation', en: 'Adiabatic expansion and the condensation cloud' },
			body: {
				fr: `L'échappement rapide du CO₂ pressurisé à travers le goulot constitue une détente proche de l'adiabatique : le gaz effectue un travail sur l'air environnant sans échange de chaleur notable, ce qui abaisse fortement sa température selon la relation :\n\n$$T_2 = T_1 \\left(\\frac{P_2}{P_1}\\right)^{\\frac{\\gamma - 1}{\\gamma}}$$\n\nCe refroidissement local, parfois de plusieurs dizaines de degrés, fait chuter la température de l'air sous son point de rosée et provoque la condensation immédiate de la vapeur d'eau ambiante. La nucléation des bulles elles-mêmes, quant à elle, se produit majoritairement sur des microfibres de cellulose déposées sur la paroi interne du verre lors de son essuyage, comme l'ont montré les travaux de Gérard Liger-Belair à l'Université de Reims.`,
				en: `The rapid escape of pressurized CO₂ through the neck is close to an adiabatic expansion: the gas performs work on the surrounding air with negligible heat exchange, which sharply lowers its temperature according to:\n\n$$T_2 = T_1 \\left(\\frac{P_2}{P_1}\\right)^{\\frac{\\gamma - 1}{\\gamma}}$$\n\nThis local cooling, sometimes by several tens of degrees, drops the air temperature below its dew point and causes immediate condensation of the ambient water vapor. Bubble nucleation itself mostly occurs on cellulose microfibers left on the inner glass wall during wiping, as shown by Gérard Liger-Belair's research group at the University of Reims.`
			},
			external: false
		}
	]
};
