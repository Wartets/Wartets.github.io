export default {
	id: 'anecdote_snow_albedo_radiative_physics',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Physique - Bilan Radiatif', en: 'Physics - Radiative Balance' },
	scheduling: { type: 'period', dates: ['12-15', '01-10'] },
	content: {
		fr: `Une neige fraîchement tombée réfléchit entre 80 et 90 % du rayonnement solaire incident, contre seulement 10 à 20 % pour un sol nu ou de l'asphalte. Cette valeur explique pourquoi un paysage enneigé paraît d'une clarté aveuglante même sous un ciel couvert, mais aussi pourquoi la neige fond nettement plus lentement au soleil qu'on ne l'imagine intuitivement, jusqu'à ce qu'elle se tasse, se salisse ou devienne humide, moment où son albédo chute brutalement.`,
		en: `Freshly fallen snow reflects between 80 and 90% of incoming solar radiation, compared to only 10-20% for bare ground or asphalt. This value explains why a snowy landscape appears dazzlingly bright even under an overcast sky, but also why snow melts noticeably more slowly in sunlight than intuition suggests, until it compacts, gets dirty, or turns wet, at which point its albedo drops sharply.`
	},
	sources: [
		{
			name: { fr: 'A Model for the Spectral Albedo of Snow. I: Pure Snow (W. J. Wiscombe, S. G. Warren, Journal of the Atmospheric Sciences, 1980)', en: 'A Model for the Spectral Albedo of Snow. I: Pure Snow (W. J. Wiscombe, S. G. Warren, Journal of the Atmospheric Sciences, 1980)' },
			url: 'https://doi.org/10.1175/1520-0469(1980)037<2712:AMFTSA>2.0.CO;2'
		}
	],
	contexts: [
		{
			title: { fr: 'La rétroaction glace-albédo', en: 'The ice-albedo feedback' },
			body: {
				fr: `L'albédo se définit comme le rapport entre le flux radiatif réfléchi et le flux radiatif incident :\n\n$$\\alpha = \\frac{\\Phi_{réfléchi}}{\\Phi_{incident}}$$\n\nLorsqu'une surface de neige ou de glace fond, elle expose un sol ou un océan bien plus sombre, dont l'albédo, souvent inférieur à 0,1, absorbe davantage d'énergie solaire, accélérant la fonte environnante et exposant encore plus de surface sombre. Cette boucle de rétroaction positive, appelée rétroaction glace-albédo, est l'un des principaux mécanismes amplifiant le réchauffement observé aux hautes latitudes.`,
				en: `Albedo is defined as the ratio between the reflected radiative flux and the incident radiative flux:\n\n$$\\alpha = \\frac{\\Phi_{reflected}}{\\Phi_{incident}}$$\n\nWhen a snow or ice surface melts, it exposes much darker ground or ocean, whose albedo, often below 0.1, absorbs more solar energy, accelerating the surrounding melt and exposing even more dark surface. This positive feedback loop, called the ice-albedo feedback, is one of the main mechanisms amplifying the warming observed at high latitudes.`
			},
			external: false
		}
	]
};
