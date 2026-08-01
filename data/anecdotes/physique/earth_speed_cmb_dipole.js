export default {
	id: 'anecdote_earth_speed_cmb_dipole',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Cosmologie', en: 'Cosmology' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `La Relativité stipule qu'il n'y a pas de référentiel absolu ni de « centre » de l'univers. Néanmoins, il existe un référentiel global très particulier : celui du Fond Diffus Cosmologique. En mesurant les micro-ondes du ciel, les astrophysiciens s'aperçoivent qu'elles sont un peu plus chaudes (bleutées) d'un côté de la galaxie, et plus froides (rougies) de l'autre. Cet effet Doppler cosmique permet de calculer notre propre vitesse absolue : le Système Solaire voyage à environ 370 kilomètres par seconde à travers l'univers, filant vers la constellation du Lion.`,
		en: `Relativity states that there is no absolute reference frame nor "center" of the universe. Yet there exists one very particular global frame: that of the Cosmic Microwave Background. Measuring the sky's microwaves, astrophysicists notice they are slightly warmer (blueshifted) on one side of the galaxy, and colder (redshifted) on the other. This cosmic Doppler effect allows our own absolute velocity to be calculated: the Solar System travels at about 370 kilometers per second through the universe, heading toward the constellation Leo.`
	},
	sources: [
		{
			name: { fr: 'Planck 2018 results. I. Overview and the cosmological legacy of Planck (Planck Collaboration, Astronomy & Astrophysics, 2020)', en: 'Planck 2018 results. I. Overview and the cosmological legacy of Planck (Planck Collaboration, Astronomy & Astrophysics, 2020)' },
			url: 'https://www.aanda.org/articles/aa/full_html/2020/09/aa33880-18/aa33880-18.html'
		}
	],
	contexts: [
		{
			title: { fr: 'Effet Doppler Relativiste et Anisotropie Dipolaire', en: 'Relativistic Doppler Effect and Dipole Anisotropy' },
			body: {
				fr: `Le rayonnement de fond est un corps noir de température moyenne $T_0 = 2,725$ K. À cause de notre mouvement propre (vitesse $v$, avec $\\beta = v/c$), la température mesurée par notre antenne n'est pas isotrope. Elle dépend de l'angle $\\theta$ par rapport à l'axe de notre trajectoire cosmique :\n\n$$T(\\theta) = T_0 \\frac{\\sqrt{1-\\beta^2}}{1-\\beta\\cos\\theta} \\approx T_0(1+\\beta\\cos\\theta)$$\n\nL'amplitude de cette anomalie (le dipôle) mesurée par les satellites COBE et Planck est de $\\Delta T \\approx 3,36$ mK, permettant d'isoler mathématiquement notre vitesse de dérive (environ 369 km/s pour le Soleil, hors orbite terrestre).`,
				en: `The background radiation is a black body at an average temperature $T_0 = 2.725$ K. Because of our proper motion (velocity $v$, with $\\beta = v/c$), the temperature measured by our antenna is not isotropic. It depends on the angle $\\theta$ relative to the axis of our cosmic trajectory:\n\n$$T(\\theta) = T_0 \\frac{\\sqrt{1-\\beta^2}}{1-\\beta\\cos\\theta} \\approx T_0(1+\\beta\\cos\\theta)$$\n\nThe amplitude of this anomaly (the dipole), measured by the COBE and Planck satellites, is $\\Delta T \\approx 3.36$ mK, allowing our drift velocity to be isolated mathematically (about 369 km/s for the Sun, excluding Earth's orbital motion).`
			},
			external: false
		}
	]
};
