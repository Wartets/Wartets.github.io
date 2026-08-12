export default {
	id: 'anecdote_cardioid_valentine_heart_curve',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Mathématiques - Géométrie des Courbes', en: 'Mathematics - Curve Geometry' },
	scheduling: { type: 'period', dates: ['02-10', '02-16'] },
	content: {
		fr: `La forme de cœur associée à la Saint-Valentin porte un nom mathématique précis : la cardioïde (du grec « kardia », cœur), courbe tracée par un point fixé sur un cercle qui roule sans glisser autour d'un second cercle de rayon identique. On la retrouve, sans le savoir, dans la caustique lumineuse formée à l'intérieur d'une tasse de café éclairée sur le côté, ou d'un anneau métallique réfléchissant.`,
		en: `The heart shape associated with Valentine's Day has a precise mathematical name: the cardioid (from the Greek "kardia", heart), a curve traced by a fixed point on a circle rolling without slipping around a second circle of equal radius. Without realizing it, one can see this same curve in the light caustic formed inside a coffee cup lit from the side, or a reflective metal ring.`
	},
	sources: [
		{
			name: { fr: 'MathWorld - Cardioid', en: 'MathWorld - Cardioid' },
			url: 'https://mathworld.wolfram.com/Cardioid.html'
		}
	],
	contexts: [
		{
			title: { fr: 'Équation polaire et caustique de réflexion', en: 'Polar equation and reflection caustic' },
			body: {
				fr: `La cardioïde admet une équation polaire remarquablement simple :\n\n$$r = a(1 + \\cos\\theta)$$\n\nElle apparaît naturellement comme caustique de réflexion : lorsque des rayons lumineux issus d'une source ponctuelle proche du bord frappent l'intérieur d'un anneau circulaire réfléchissant, l'angle d'incidence varie continûment le long du cercle, si bien que les rayons réfléchis s'enveloppent le long d'une courbe brillante en forme de cœur. Ce même principe géométrique explique la figure lumineuse en forme de cœur parfois visible au fond d'une tasse ou d'un verre à pied éclairé de biais.`,
				en: `The cardioid has a remarkably simple polar equation:\n\n$$r = a(1 + \\cos\\theta)$$\n\nIt appears naturally as a reflection caustic: when light rays from a point source near the edge strike the inside of a reflective circular ring, the angle of incidence varies continuously around the circle, so the reflected rays envelope along a bright heart-shaped curve. This same geometric principle explains the heart-shaped bright figure sometimes visible at the bottom of a mug or a stemmed glass lit from the side.`
			},
			external: false
		}
	]
};
