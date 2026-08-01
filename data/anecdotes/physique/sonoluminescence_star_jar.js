export default {
	id: 'anecdote_sonoluminescence_star_jar',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Acoustique / Physique des Fluides', en: 'Acoustics / Fluid Physics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Il est possible de créer une « étoile dans un bocal » avec de la simple eau et du son : c'est le phénomène de la sonoluminescence. En bombardant un récipient d'eau avec de puissantes ondes ultrasonores, de minuscules bulles de gaz se forment puis s'effondrent violemment sur elles-mêmes sous la pression acoustique. Cet effondrement est si violent et asymétrique que le gaz piégé à l'intérieur est brièvement chauffé à des températures comparables à la surface du Soleil, provoquant l'émission de flashs de lumière bleutée en plein milieu de l'eau froide.`,
		en: `It is possible to create a "star in a jar" using nothing but water and sound: this is the phenomenon of sonoluminescence. When a container of water is bombarded with powerful ultrasonic waves, tiny gas bubbles form and then violently collapse under acoustic pressure. This collapse is so violent and asymmetric that the trapped gas inside is briefly heated to temperatures comparable to the Sun's surface, producing flashes of bluish light in the middle of the cold water.`
	},
	sources: [
		{
			name: { fr: 'Observation of single-bubble sonoluminescence (D.F. Gaitan et al., The Journal of the Acoustical Society of America, 1992)', en: 'Observation of single-bubble sonoluminescence (D.F. Gaitan et al., The Journal of the Acoustical Society of America, 1992)' },
			url: 'https://asa.scitation.org/doi/10.1121/1.402855'
		}
	],
	contexts: [
		{
			title: { fr: 'Cavitation acoustique et chauffage adiabatique', en: 'Acoustic cavitation and adiabatic heating' },
			body: {
				fr: `L'onde sonore produit des cycles de compression et de raréfaction dans le liquide. Une bulle microscopique se dilate (cavitation) puis implose brutalement, à des vitesses supersoniques : il n'y a pas le temps pour un transfert de chaleur avec l'eau environnante, la compression est donc adiabatique. Pour un gaz parfait subissant une compression adiabatique de volume $V_{max}$ vers $V_{min}$, la température grimpe selon :\n\n$$T_{max} = T_{min} \\left( \\frac{V_{max}}{V_{min}} \\right)^{\\gamma - 1}$$\n\noù $\\gamma$ est le rapport des capacités thermiques. Le collapsus peut réduire le volume d'un facteur d'un million, expliquant le pic thermique et le flash de photons.`,
				en: `The sound wave produces cycles of compression and rarefaction in the liquid. A microscopic bubble expands (cavitation) then implodes violently, at supersonic speeds: there is no time for heat transfer with the surrounding water, so the compression is adiabatic. For an ideal gas undergoing adiabatic compression from volume $V_{max}$ to $V_{min}$, the temperature rises according to:\n\n$$T_{max} = T_{min} \\left( \\frac{V_{max}}{V_{min}} \\right)^{\\gamma - 1}$$\n\nwhere $\\gamma$ is the ratio of heat capacities. The collapse can reduce volume by a factor of a million, explaining the huge thermal spike and photon flash.`
			},
			external: false
		}
	]
};
