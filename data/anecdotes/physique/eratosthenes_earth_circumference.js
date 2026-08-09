export default {
	id: 'anecdote_eratosthenes_earth_circumference',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Géométrie Historique / Astronomie', en: 'Historical Geometry / Astronomy' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Environ 240 ans avant notre ère, le savant grec Eratosthène a réussi à calculer la circonférence exacte de la Terre avec une précision stupéfiante (à quelques pourcents près). Son seul équipement scientifique ? Un simple bâton planté dans le sol (un gnomon) à Alexandrie et l'information selon laquelle, le jour du solstice d'été à Assouan, le Soleil éclairait le fond d'un puits sans faire d'ombre. Par un coup de génie géométrique, il a transformé l'ombre portée de son bâton en la mesure complète de notre planète.`,
		en: `Around 240 BCE, the Greek scholar Eratosthenes managed to calculate the exact circumference of the Earth with astonishing accuracy (within a few percent). His only scientific equipment? A simple stick planted in the ground (a gnomon) in Alexandria, and the knowledge that, on the day of the summer solstice in Aswan, the Sun lit the bottom of a well without casting any shadow. Through a stroke of geometric genius, he transformed his stick's cast shadow into the full measurement of our planet.`
	},
	sources: [
		{
			name: { fr: 'Astronomy Before the Telescope (C. Walker, British Museum Press, 1996)', en: 'Astronomy Before the Telescope (C. Walker, British Museum Press, 1996)' },
			url: 'https://ui.adsabs.harvard.edu/abs/1996abt..conf.....W/abstract'
		}
	],
	contexts: [
		{
			title: { fr: 'Angles alternes-internes et arc de cercle', en: 'Alternate interior angles and arc length' },
			body: {
				fr: `En supposant les rayons du Soleil parallèles (vu la distance Terre-Soleil), Eratosthène a mesuré l'angle de l'ombre à Alexandrie à environ 7,2° (soit un cinquantième de cercle). Par le théorème des angles alternes-internes, cet angle correspond exactement à l'angle au centre de la Terre séparant les deux villes. La distance $D$ entre Syène (Assouan) et Alexandrie étant connue (environ 5000 stades), la circonférence totale $C$ s'obtient par une simple règle de trois :\n\n$$C = \\frac{360^{\\circ}}{7,2^{\\circ}} \\times D = 50 \\times 5000 = 250\\,000 \\text{ stades} \\approx 40\\,000 \\text{ km}$$`,
				en: `Assuming the Sun's rays are parallel (given the Earth-Sun distance), Eratosthenes measured the shadow's angle in Alexandria at about 7.2° (one-fiftieth of a circle). By the theorem of alternate interior angles, this angle corresponds exactly to Earth's central angle separating the two cities. Knowing the distance $D$ between Syene (Aswan) and Alexandria (about 5000 stadia), the total circumference $C$ is obtained by a simple rule of three:\n\n$$C = \\frac{360^{\\circ}}{7.2^{\\circ}} \\times D = 50 \\times 5000 = 250{,}000 \\text{ stadia} \\approx 40{,}000 \\text{ km}$$`
			},
			external: false
		}
	]
};
