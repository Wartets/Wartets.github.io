export default {
	id: 'anecdote_winter_solstice_christmas_origins',
	enabled: false,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Histoire des Sciences / Astronomie', en: 'History of Science / Astronomy' },
	scheduling: { type: 'period', dates: ['12-18', '12-24'] },
	content: {
		fr: `Aucun texte du Nouveau Testament ne fixe de date pour la naissance de Jésus. C'est aux troisième et quatrième siècles que des auteurs chrétiens associèrent progressivement cet événement au solstice d'hiver, alors compté le 25 décembre dans le calendrier julien, en partie pour s'imposer face aux fêtes romaines concurrentes comme le Sol Invictus ou les Saturnales. Astronomiquement, le solstice marque le moment précis où le Soleil atteint sa déclinaison la plus au sud (-23,44°), après quoi la durée du jour recommence à croître dans l'hémisphère Nord.`,
		en: `No text of the New Testament fixes a date for the birth of Jesus. It was in the third and fourth centuries that Christian writers progressively associated the event with the winter solstice, then reckoned on December 25 in the Julian calendar, partly to assert itself against competing Roman festivals such as Sol Invictus or Saturnalia. Astronomically, the solstice marks the precise moment when the Sun reaches its southernmost declination (-23.44°), after which day length begins to grow again in the Northern Hemisphere.`
	},
	sources: [
		{
			name: {
				fr: 'Steven Hijmans — "Sol Invictus, the Winter Solstice, and the Origins of Christmas" (Mouseion, 2003)',
				en: 'Steven Hijmans — "Sol Invictus, the Winter Solstice, and the Origins of Christmas" (Mouseion, 2003)'
			},
			url: 'https://www.academia.edu/968841/_Sol_Invictus_the_Winter_Solstice_and_the_Origins_of_Christmas_Mouseion_Number_47_3_2003_377_398'
		}
	],
	contexts: [
		{
			title: { fr: 'Mécanique de l\'inclinaison axiale terrestre', en: "Mechanics of Earth's axial tilt" },
			body: {
				fr: `L'axe de rotation terrestre est incliné de 23,44° par rapport au plan de son orbite autour du Soleil. Au solstice d'hiver de l'hémisphère Nord, le pôle Nord est incliné au maximum à l'écart du Soleil, ce qui minimise la durée d'ensoleillement à ces latitudes. La déclinaison solaire apparente au fil de l'année peut être approximée par :\n\n$$\\delta(d) \\approx -23{,}44° \\times \\cos\\left(\\frac{360}{365}(d + 10)\\right)$$\n\noù $d$ est le numéro du jour dans l'année, le minimum de $\\delta$ étant atteint autour du 21 décembre.`,
				en: `Earth's rotation axis is tilted 23.44° relative to the plane of its orbit around the Sun. At the Northern Hemisphere's winter solstice, the North Pole is tilted maximally away from the Sun, minimizing daylight duration at those latitudes. The apparent solar declination through the year can be approximated by:\n\n$$\\delta(d) \\approx -23.44° \\times \\cos\\left(\\frac{360}{365}(d + 10)\\right)$$\n\nwhere $d$ is the day number of the year, with the minimum of $\\delta$ reached around December 21.`
			},
			external: false
		}
	]
};
