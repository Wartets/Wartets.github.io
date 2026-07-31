export default {
	id: 'anecdote_water_density_anomaly',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Thermodynamique / Mécanique des Fluides', en: 'Thermodynamics / Fluid Mechanics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En physique classique, la grande majorité des substances voient leur volume se contracter et leur densité augmenter à mesure qu'on les refroidit, devenant plus denses à l'état solide qu'à l'état liquide. L'eau possède une anomalie extraordinaire : elle atteint sa densité maximale à très exactement 4°C (3,98°C pour être précis). En dessous de cette température, elle se dilate. C'est la raison pour laquelle les glaçons flottent dans un verre, et surtout, la raison physique pour laquelle les lacs gèlent par la surface, préservant la vie aquatique dans les profondeurs liquides en hiver.`,
		en: `In classical physics, the vast majority of substances contract in volume and increase in density as they cool, becoming denser as a solid than as a liquid. Water possesses an extraordinary anomaly: it reaches its maximum density at exactly 4°C (3.98°C, to be precise). Below this temperature, it expands. This is why ice cubes float in a glass, and, more importantly, why lakes freeze from the surface downward, preserving aquatic life in the liquid depths during winter.`
	},
	sources: [
		{
			name: { fr: 'The anomalous properties of water (Water Structure and Science, London South Bank University)', en: 'The anomalous properties of water (Water Structure and Science, London South Bank University)' },
			url: 'https://water.lsbu.ac.uk/water/water_anomalies.html'
		}
	],
	contexts: [
		{
			title: { fr: 'Liaisons hydrogène et réseau cristallin', en: 'Hydrogen bonds and the crystal lattice' },
			body: {
				fr: `La molécule d'eau ($H_2O$) est hautement polaire. Lors du refroidissement en dessous de 4°C, l'agitation thermique diminue suffisamment pour que les liaisons hydrogène dictent la géométrie moléculaire. À 0°C, elles forcent la cristallisation sous la forme d'un réseau hexagonal (glace Ih) très aéré. Le volume molaire de la glace est supérieur d'environ 9 % à celui de l'eau liquide. Le coefficient de dilatation thermique $\\alpha$ s'annule puis devient négatif :\n\n$$\\alpha = \\frac{1}{V} \\left(\\frac{\\partial V}{\\partial T}\\right)_p$$\n\nPour l'eau entre 0°C et 4°C, $\\alpha < 0$.`,
				en: `The water molecule ($H_2O$) is highly polar. When cooled below 4°C, thermal agitation decreases enough for hydrogen bonds to dictate the molecular geometry. At 0°C, they force crystallization into a highly open hexagonal lattice (ice Ih). The molar volume of ice is about 9% greater than that of liquid water. The thermal expansion coefficient $\\alpha$ becomes zero and then negative:\n\n$$\\alpha = \\frac{1}{V} \\left(\\frac{\\partial V}{\\partial T}\\right)_p$$\n\nFor water between 0°C and 4°C, $\\alpha < 0$.`
			},
			external: false
		}
	]
};
