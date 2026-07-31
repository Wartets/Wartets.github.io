export default {
	id: 'anecdote_cmb_tv_static',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Cosmologie', en: 'Cosmology' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Avant l'ère de la télévision numérique, lorsqu'un téléviseur analogique était réglé sur une fréquence sans émission, l'écran affichait une « neige » statique accompagnée d'un grésillement. Il est fascinant de noter qu'environ un pourcent de ce bruit parasite était directement causé par les photons du fond diffus cosmologique. Les antennes captaient l'écho électromagnétique refroidi du Big Bang, émis il y a plus de treize milliards huit cents millions d'années, rendant la naissance de l'univers visible, sans le savoir, dans chaque salon.`,
		en: `Before the era of digital television, whenever an analog TV set was tuned to a frequency with no broadcast, the screen displayed static "snow" accompanied by a hissing sound. It is a remarkable fact that about one percent of this background noise was directly caused by photons from the cosmic microwave background. Household antennas were picking up the cooled electromagnetic echo of the Big Bang, emitted more than 13.8 billion years ago, unknowingly making the birth of the universe visible in every living room.`
	},
	sources: [
		{
			name: { fr: 'A Measurement of Excess Antenna Temperature at 4080 Mc/s (1965)', en: 'A Measurement of Excess Antenna Temperature at 4080 Mc/s (1965)' },
			url: 'https://ui.adsabs.harvard.edu/abs/1965ApJ...142..419P/abstract'
		}
	],
	contexts: [
		{
			title: { fr: 'Rayonnement de corps noir et loi de Wien', en: 'Black-body radiation and Wien\'s law' },
			body: {
				fr: `L'univers primordial était un plasma opaque. Lors de la recombinaison, environ 380 000 ans après le Big Bang, les électrons se lièrent aux noyaux pour former des atomes neutres, libérant subitement la lumière alors piégée. L'expansion continue de l'univers a depuis étiré la longueur d'onde de ces photons, un phénomène de décalage vers le rouge cosmologique.\n\nAujourd'hui, ce rayonnement fossile correspond exactement à un corps noir à la température de 2,725 kelvins. La loi de déplacement de Wien,\n\n$$\\lambda_{max} = \\frac{b}{T}$$\n\navec $b \\approx 2,897 \\times 10^{-3}$ m·K, place le pic d'émission de ce rayonnement dans le domaine des micro-ondes, autour de 1,06 millimètre, soit environ 160 GHz. Cette fréquence chevauche partiellement les bandes radio VHF/UHF captées par les antennes des anciens téléviseurs analogiques, expliquant la présence de cet écho cosmique au sein même du bruit domestique.`,
				en: `The early universe was an opaque plasma. During recombination, about 380,000 years after the Big Bang, electrons bound to nuclei to form neutral atoms, suddenly releasing the light that had been trapped until then. The universe's continued expansion has since stretched the wavelength of these photons, a phenomenon known as cosmological redshift.\n\nToday, this fossil radiation corresponds exactly to a black body at a temperature of 2.725 kelvins. Wien's displacement law,\n\n$$\\lambda_{max} = \\frac{b}{T}$$\n\nwith $b \\approx 2.897 \\times 10^{-3}$ m·K, places the peak emission of this radiation in the microwave range, around 1.06 millimeters, or about 160 GHz. This frequency partially overlaps the VHF/UHF radio bands picked up by old analog television antennas, explaining the presence of this cosmic echo within ordinary household noise.`
			},
			external: false
		}
	]
};
