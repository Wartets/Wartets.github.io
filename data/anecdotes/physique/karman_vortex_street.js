export default {
	id: 'anecdote_karman_vortex_street',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Mécanique des Fluides', en: 'Fluid Mechanics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Lorsqu'un flux d'air ou d'eau s'écoule autour d'un obstacle fixe, comme le pilier d'un pont ou une antenne de voiture, l'écoulement ne se sépare pas toujours en deux courants calmes. À une certaine plage de vitesse, il se déséquilibre et engendre un sillage tourbillonnaire alterné : des vortex se détachent périodiquement d'un côté puis de l'autre de l'obstacle, dessinant une allée de spirales symétrique, appelée « allée de Karman ». Ce phénomène induit des forces latérales alternées, ce qui explique le sifflement éolien des câbles électriques ou les graves dommages par résonance que peuvent subir de hautes cheminées industrielles.`,
		en: `When a flow of air or water passes around a fixed obstacle, such as a bridge pier or a car antenna, the flow does not always split into two calm streams. Above a certain velocity range, it destabilizes and produces an alternating vortex wake: vortices periodically detach from one side of the obstacle, then the other, forming a symmetric street of spirals known as the "Kármán vortex street". This instability induces alternating lateral forces, which explains the whistling sound of wind on power lines and the severe resonance damage that tall industrial chimneys can suffer.`
	},
	sources: [
		{
			name: { fr: 'Vortex Dynamics in the Cylinder Wake (C. H. K. Williamson, Annual Review of Fluid Mechanics, 1996)', en: 'Vortex Dynamics in the Cylinder Wake (C. H. K. Williamson, Annual Review of Fluid Mechanics, 1996)' },
			url: 'https://doi.org/10.1146/annurev.fl.28.010196.002401'
		}
	],
	contexts: [
		{
			title: { fr: 'Le nombre de Strouhal et l\'instabilité hydrodynamique', en: 'The Strouhal number and hydrodynamic instability' },
			body: {
				fr: `Le détachement périodique des vortex est un comportement de bifurcation émergeant des solutions non linéaires des équations de Navier-Stokes. Le régime de l'allée de Karman s'établit typiquement pour un nombre de Reynolds $Re = \\frac{UD}{\\nu}$ compris entre 47 et $10^5$, où $D$ est le diamètre du cylindre obstacle et $\\nu$ la viscosité cinématique.\n\nLa fréquence $f$ de détachement des vortex est caractérisée par un invariant adimensionnel, le nombre de Strouhal $St$ :\n\n$$St = \\frac{f \\cdot D}{U} \\approx 0,2 \\quad \\text{(régime sous-critique)}$$\n\nSi cette fréquence s'approche de la fréquence de résonance naturelle de la structure, un phénomène de flottement aéroélastique se produit, nécessitant l'installation d'ailettes hélicoïdales sur les cheminées pour briser la cohérence spatiale des tourbillons.`,
				en: `Periodic vortex shedding is a bifurcation behavior emerging from the non-linear solutions of the Navier-Stokes equations. The Kármán vortex street regime typically establishes itself for a Reynolds number $Re = \\frac{UD}{\\nu}$ between 47 and $10^5$, where $D$ is the diameter of the obstacle cylinder and $\\nu$ the kinematic viscosity.\n\nThe vortex shedding frequency $f$ is characterized by a dimensionless invariant, the Strouhal number $St$:\n\n$$St = \\frac{f \\cdot D}{U} \\approx 0.2 \\quad \\text{(subcritical regime)}$$\n\nIf this shedding frequency approaches the structure's natural resonance frequency, aeroelastic flutter occurs, requiring the installation of helical strakes on chimneys to break the spatial coherence of the vortices.`
			},
			external: false
		}
	]
};
