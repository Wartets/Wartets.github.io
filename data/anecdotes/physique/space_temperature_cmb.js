export default {
	id: 'anecdote_space_temperature_cmb',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Cosmologie', en: 'Cosmology' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `L'espace intersidéral est glacial, mais il n'est pas au zéro absolu. Si vous vous trouviez au milieu du vide de l'espace intergalactique, loin de toute étoile, votre thermomètre afficherait précisément 2,725 kelvins (soit environ -270,42°C). Cette chaleur résiduelle homogène ne provient pas des galaxies environnantes, mais est littéralement la chaleur « fossile » de la boule de feu originelle du Big Bang, diluée et refroidie par 13,8 milliards d'années d'expansion de l'univers, baignant la totalité de l'espace cosmique.`,
		en: `Interstellar space is frigid, but it is not at absolute zero. If you were floating in the depths of intergalactic vacuum, far from any star, your thermometer would read precisely 2.725 kelvins (about -270.42°C). This uniform residual warmth does not come from surrounding galaxies, but is literally the "fossil" heat of the original Big Bang fireball, diluted and cooled by 13.8 billion years of cosmic expansion, bathing the entirety of space.`
	},
	sources: [
		{
			name: { fr: 'The Cosmic Microwave Background (Ruth Durrer, 2008)', en: 'The Cosmic Microwave Background (Ruth Durrer, 2008)' },
			url: 'https://doi.org/10.48550/arXiv.1506.01907'
		}
	],
	contexts: [
		{
			title: { fr: 'Refroidissement adiabatique de l\'univers', en: 'Adiabatic cooling of the universe' },
			body: {
				fr: `Le modèle de Friedmann-Lemaître-Robertson-Walker décrit l'évolution de l'univers via le facteur d'échelle $a(t)$. Le rayonnement obéit à la loi d'évolution thermodynamique d'un gaz de photons en expansion adiabatique, où la longueur d'onde s'étire en même temps que l'espace.\n\nLa température du fond diffus cosmologique (CMB) décroît de manière inversement proportionnelle au facteur d'échelle, exprimée en fonction du décalage vers le rouge cosmologique $z$ :\n\n$$T(z) = T_0(1+z)$$\n\nLe CMB fut libéré lors de la recombinaison (à $z \\approx 1100$), alors que l'univers était à environ 3000 K, ce qui explique sa valeur moderne diluée de 2,725 K.`,
				en: `The Friedmann-Lemaître-Robertson-Walker model describes the evolution of the universe through the scale factor $a(t)$. Radiation follows the thermodynamic evolution law of a photon gas undergoing adiabatic expansion, where wavelength stretches along with space itself.\n\nThe temperature of the cosmic microwave background (CMB) decreases inversely proportional to the scale factor, expressed in terms of the cosmological redshift $z$:\n\n$$T(z) = T_0(1+z)$$\n\nThe CMB was released during recombination (at $z \\approx 1100$), when the universe was at about 3000 K, explaining its diluted modern value of 2.725 K.`
			},
			external: false
		}
	]
};
