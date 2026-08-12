export default {
	id: 'anecdote_perseid_meteor_shower_physics',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Physique - Astronomie', en: 'Physics - Astronomy' },
	scheduling: { type: 'period', dates: ['08-09', '08-16'] },
	content: {
		fr: `Chaque année, autour de la période de l'Assomption, la Terre traverse le nuage de débris laissé par la comète périodique 109P/Swift-Tuttle (dernier passage au périhélie en 1992). Cette traversée produit l'essaim d'étoiles filantes des Perséides, dont le maximum survient vers le 12-13 août. De simples grains de poussière, souvent pas plus gros qu'un grain de sable, se vaporisent par frottement atmosphérique à environ 60 km/s, entre 80 et 120 km d'altitude, produisant le sillage lumineux observé.`,
		en: `Every year, around the time of the Assumption holiday, Earth crosses the debris trail left by the periodic comet 109P/Swift-Tuttle (last perihelion passage in 1992). This crossing produces the Perseid meteor shower, whose peak occurs around August 12-13. Simple dust grains, often no larger than a grain of sand, vaporize through atmospheric friction at around 60 km/s, between 80 and 120 km altitude, producing the observed light trail.`
	},
	sources: [
		{
			name: { fr: 'On the unusual activity of the Perseid meteor shower (1989–96) and the dust trail of comet 109P/Swift-Tuttle (P. Jenniskens et al., Monthly Notices of the Royal Astronomical Society, 1998)', en: 'On the unusual activity of the Perseid meteor shower (1989–96) and the dust trail of comet 109P/Swift-Tuttle (P. Jenniskens et al., Monthly Notices of the Royal Astronomical Society, 1998)' },
			url: 'https://ui.adsabs.harvard.edu/link_gateway/1998MNRAS.301..941J/doi:10.1046/j.1365-8711.1998.02020.x'
		}
	],
	contexts: [
		{
			title: { fr: 'Radiant et vitesse géocentrique d\'impact', en: 'Radiant point and geocentric impact velocity' },
			body: {
				fr: `Les débris de la comète suivent des trajectoires quasiment parallèles ; l'effet de perspective fait qu'ils semblent tous émaner d'un même point du ciel, le radiant, situé ici dans la constellation de Persée. La vitesse géocentrique d'impact combine vectoriellement la vitesse orbitale terrestre (environ 29,8 km/s) et celle des débris, ce qui donne aux Perséides l'une des vitesses d'impact les plus élevées parmi les essaims connus. L'énergie cinétique ainsi dissipée sous forme de chaleur, de lumière et d'ionisation dans la haute atmosphère s'écrit simplement :\n\n$$E_k = \\frac{1}{2}mv^2$$`,
				en: `Comet debris follows nearly parallel trajectories; the perspective effect makes them all appear to emanate from a single point in the sky, the radiant, located here in the constellation Perseus. The geocentric impact velocity vectorially combines Earth's orbital velocity (about 29.8 km/s) with that of the debris, giving the Perseids one of the highest impact velocities among known showers. The kinetic energy thus dissipated as heat, light, and ionization in the upper atmosphere is simply:\n\n$$E_k = \\frac{1}{2}mv^2$$`
			},
			external: false
		}
	]
};
