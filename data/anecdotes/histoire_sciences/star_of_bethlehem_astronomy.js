export default {
	id: 'anecdote_star_of_bethlehem_astronomy',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Histoire des Sciences / Astronomie', en: 'History of Science / Astronomy' },
	scheduling: { type: 'period', dates: ['12-18', '12-25'] },
	content: {
		fr: `Parmi les hypothèses astronomiques avancées pour expliquer l'« étoile de Bethléem » de l'évangile de Matthieu, la plus célèbre revient à Johannes Kepler. En 1614, après avoir observé une rare conjonction Jupiter-Saturne-Mars en 1603, il calcula qu'une conjonction similaire de Jupiter et Saturne s'était produite en 7 avant notre ère dans la constellation des Poissons, et proposa que cet alignement planétaire, apparaissant et disparaissant à trois reprises en quelques mois, ait pu être interprété comme un signe céleste exceptionnel par des observateurs de l'Antiquité.`,
		en: `Among the astronomical hypotheses put forward to explain the "Star of Bethlehem" from the Gospel of Matthew, the most famous comes from Johannes Kepler. In 1614, after observing a rare Jupiter-Saturn-Mars conjunction in 1603, he calculated that a similar conjunction of Jupiter and Saturn had occurred in 7 BCE in the constellation Pisces, and proposed that this planetary alignment, appearing and vanishing three times within a few months, could have been interpreted as an exceptional celestial sign by ancient observers.`
	},
	sources: [
		{
			name: { fr: 'Star of Bethlehem Bibliography', en: 'Star of Bethlehem Bibliography' },
			url: 'https://webspace.science.uu.nl/~gent0113/stellamagorum/stellamagorum.htm'
		}
	],
	contexts: [
		{
			title: { fr: 'La conjonction triple, un effet de perspective orbitale', en: 'The triple conjunction, an orbital perspective effect' },
			body: {
				fr: `Une « conjonction triple » se produit lorsque la Terre, plus rapide sur son orbite, double une planète extérieure comme Jupiter ou Saturne pendant que celles-ci semblent, elles, ralentir puis reculer temporairement dans le ciel (mouvement rétrograde apparent). Si deux planètes extérieures sont proches l'une de l'autre au moment de ce dépassement terrestre, elles peuvent alors sembler se rapprocher, s'écarter puis se rapprocher à nouveau en quelques mois, un phénomène rare qui n'est observable que tous les quelques siècles pour une même paire de planètes dans la même région du zodiaque. D'autres hypothèses concurrentes, comme une nova consignée par les astronomes chinois vers 5 avant notre ère (l'« étoile invitée » du *Livre des Han*) ou le passage d'une comète, restent également discutées, sans consensus historique définitif.`,
				en: `A "triple conjunction" occurs when Earth, moving faster along its orbit, overtakes an outer planet such as Jupiter or Saturn while that planet appears to slow down and temporarily move backward in the sky (apparent retrograde motion). If two outer planets happen to be close to one another at the moment of this overtaking, they can appear to approach, separate, and approach again within a few months, a rare phenomenon observable only once every few centuries for the same pair of planets in the same region of the zodiac. Other competing hypotheses, such as a nova recorded by Chinese astronomers around 5 BCE (the "guest star" of the *Book of Han*) or the passage of a comet, remain equally debated, with no definitive historical consensus.`
			},
			external: false
		}
	]
};
