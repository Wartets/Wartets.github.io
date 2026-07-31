export default {
	id: 'anecdote_planets_earth_moon_distance',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Astronomie de Position', en: 'Positional Astronomy' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En regardant la pleine Lune dans le ciel nocturne, elle semble familière et relativement proche. C'est une illusion d'échelle. L'espace vide entre la Terre et la Lune est si gigantesque (environ 384 400 kilomètres en moyenne) que l'on pourrait y aligner bout à bout toutes les autres planètes du système solaire (Mercure, Vénus, Mars, Jupiter, Saturne, Uranus et Neptune). Non seulement elles rentreraient toutes parfaitement dans cet espace, mais il resterait même un jeu d'environ 4000 kilomètres de vide.`,
		en: `Looking at the full Moon in the night sky, it seems familiar and relatively close. This is a trick of scale. The empty space between Earth and the Moon is so vast (about 384,400 kilometers on average) that all the other planets of the Solar System (Mercury, Venus, Mars, Jupiter, Saturn, Uranus, and Neptune) could be lined up end to end within it. Not only would they all fit perfectly in that space, but there would still be about 4,000 kilometers of empty space left over.`
	},
	sources: [
		{
			name: { fr: 'Planetary Fact Sheet - Metric (NASA Goddard Space Flight Center)', en: 'Planetary Fact Sheet - Metric (NASA Goddard Space Flight Center)' },
			url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/'
		}
	],
	contexts: [
		{
			title: { fr: 'Somme des diamètres équatoriaux', en: 'Sum of equatorial diameters' },
			body: {
				fr: `Le demi-grand axe de l'orbite lunaire est calculé par télémétrie laser via les réflecteurs posés lors du programme Apollo. La vérification de cette anecdote astronomique est une simple somme arithmétique des diamètres équatoriaux planétaires :\n\n$$\\sum D_i = D_{Me} + D_V + D_{Ma} + D_J + D_S + D_U + D_N$$\n\n$$\\sum D_i \\approx 4879 + 12104 + 6779 + 139820 + 116460 + 50724 + 49244 \\approx 380\\,010 \\text{ km}$$\n\nLe périgée de l'orbite lunaire étant à 362 600 km, les planètes s'y glissent confortablement la majorité du temps (distance moyenne 384 400 km).`,
				en: `The semi-major axis of the lunar orbit is measured by laser ranging via the reflectors placed during the Apollo program. Verifying this astronomical claim is a simple arithmetic sum of planetary equatorial diameters:\n\n$$\\sum D_i = D_{Me} + D_V + D_{Ma} + D_J + D_S + D_U + D_N$$\n\n$$\\sum D_i \\approx 4879 + 12104 + 6779 + 139820 + 116460 + 50724 + 49244 \\approx 380{,}010 \\text{ km}$$\n\nWith the Moon's orbital perigee at 362,600 km, the planets comfortably fit in most of the time (average distance 384,400 km).`
			},
			external: false
		}
	]
};
