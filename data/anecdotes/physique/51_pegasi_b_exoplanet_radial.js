export default {
	id: 'anecdote_51_pegasi_b_exoplanet_radial',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Astronomie - Astrophysique', en: 'Astronomy - Astrophysics' },
	scheduling: { type: 'annual', dates: ['10-06'] },
	content: {
		fr: `En 1995, Michel Mayor et Didier Queloz annoncent une découverte qui allait changer l'astronomie : la première planète en orbite autour d'une étoile similaire au Soleil. Fascinant, ils n'ont jamais vu cette planète au télescope, perdue dans l'éblouissement de son étoile ; ils l'ont découverte par son poids analytique. Lorsqu'une planète tourne autour d'une étoile, sa gravité tire légèrement sur l'étoile en retour, la faisant vaciller. En analysant la lumière de 51 Pegasi, les astronomes ont remarqué que ses couleurs oscillaient subtilement vers le bleu puis le rouge à cause de ce balancement. Cette méthode indirecte a depuis permis de découvrir des milliers de mondes.`,
		en: `In 1995, Michel Mayor and Didier Queloz announced a discovery that would change astronomy: the first planet orbiting a Sun-like star. Fascinatingly, they never saw this planet through a telescope, lost as it was in the glare of its star; they discovered it through its analytical weight. When a planet orbits a star, its gravity pulls slightly back on the star, making it wobble. By analyzing the light from 51 Pegasi, astronomers noticed its colors subtly shifting toward blue then red because of this wobble. This indirect method has since led to the discovery of thousands of worlds.`
	},
	sources: [
		{
			name: { fr: 'A Jupiter-mass companion to a solar-type star (M. Mayor, D. Queloz, Nature, 1995)', en: 'A Jupiter-mass companion to a solar-type star (M. Mayor, D. Queloz, Nature, 1995)' },
			url: 'https://ui.adsabs.harvard.edu/abs/1995Natur.378..355M/abstract'
		}
	],
	contexts: [
		{
			title: { fr: 'Effet Doppler-Fizeau spectroscopique', en: 'Doppler-Fizeau spectroscopic effect' },
			body: {
				fr: `La lumière émise par les atomes de l'atmosphère stellaire possède une longueur d'onde propre $\\lambda_0$. Lorsque l'étoile se rapproche ou s'éloigne de la Terre sous la traction de sa planète, cette longueur d'onde subit un décalage Doppler. Pour des vitesses faibles devant $c$ :\n\n$$\\frac{\\Delta \\lambda}{\\lambda_0} \\approx \\frac{v_{radiale}}{c}$$\n\nLe spectromètre ELODIE utilisé à l'Observatoire de Haute-Provence était capable de mesurer une vitesse radiale d'à peine 50 mètres par seconde, témoignant d'une stabilité opto-mécanique extrême.`,
				en: `Light emitted by atoms in the stellar atmosphere has an intrinsic wavelength $\\lambda_0$. As the star moves toward or away from Earth under the pull of its planet, this wavelength undergoes a Doppler shift. For velocities small compared to $c$:\n\n$$\\frac{\\Delta \\lambda}{\\lambda_0} \\approx \\frac{v_{radial}}{c}$$\n\nThe ELODIE spectrograph used at the Observatoire de Haute-Provence was able to measure a stellar radial velocity of just 50 meters per second, testifying to extreme opto-mechanical stability.`
			},
			external: false
		},
		{
			title: { fr: 'Problème à deux corps et fonction de masse', en: 'Two-body problem and the mass function' },
			body: {
				fr: `La dynamique orbitale relie la période de vacillement $P$ et l'amplitude de la vitesse radiale $K$ à la masse de l'exoplanète $m_p$. En posant $M_*$ la masse de l'étoile et $i$ l'angle d'inclinaison de l'orbite, la fonction de masse s'écrit :\n\n$$\\frac{(m_p \\sin i)^3}{(M_* + m_p)^2} = \\frac{P \\cdot K^3}{2\\pi G} \\left(1 - e^2\\right)^{3/2}$$\n\noù $e$ est l'excentricité de l'orbite. Puisque l'angle $i$ est généralement inconnu, la masse déduite $m_p \\sin i$ est toujours une borne inférieure de la véritable masse planétaire.`,
				en: `Orbital dynamics link the wobble period $P$ and the radial-velocity amplitude $K$ to the exoplanet's mass $m_p$. Denoting $M_*$ the star's mass and $i$ the orbital inclination angle, the mass function reads:\n\n$$\\frac{(m_p \\sin i)^3}{(M_* + m_p)^2} = \\frac{P \\cdot K^3}{2\\pi G} \\left(1 - e^2\\right)^{3/2}$$\n\nwhere $e$ is the orbital eccentricity. Since the angle $i$ is generally unknown from this method alone, the derived mass $m_p \\sin i$ is always a rigorous lower bound on the true planetary mass.`
			},
			external: false
		},
		{
			title: { fr: 'Le choc de la classe des « Jupiters chauds »', en: 'The shock of the "Hot Jupiter" class' },
			body: {
				fr: `Le signal mesuré pour 51 Pegasi indiquait une période orbitale absurde de seulement 4,23 jours : une planète de la moitié de la masse de Jupiter orbitant à 0,05 Unité Astronomique, sept fois plus près de son étoile que Mercure ne l'est du Soleil. Les modèles de formation planétaire de l'époque affirmaient que les géantes gazeuses ne pouvaient se former qu'au-delà de la « ligne de glace », loin de l'étoile. Cette observation a contraint les astrophysiciens à inventer le mécanisme de migration planétaire pour expliquer l'existence de ces « Jupiters chauds ».`,
				en: `The signal measured for 51 Pegasi indicated an absurd orbital period of just 4.23 days: a planet half the mass of Jupiter orbiting at 0.05 Astronomical Units, seven times closer to its star than Mercury is to the Sun. Planet-formation models of the time held that gas giants could only form beyond the "ice line", far from the star. This observation forced astrophysicists to devise the mechanism of planetary migration to explain the existence of these "Hot Jupiters".`
			},
			external: false
		}
	]
};
