export default {
	id: 'anecdote_negative_refractive_index_metamaterials',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Optique Quantique - Électromagnétisme', en: 'Quantum Optics - Electromagnetism' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Imaginez plonger un bâton dans une piscine et le voir se tordre optiquement non pas vers le fond, mais en pointant vers l'extérieur de la surface, comme si la lumière faisait un coude. En 1968, le théoricien russe Victor Veselago pose l'hypothèse de matériaux à « indice de réfraction négatif », une idée qui choquait l'intuition de l'optique. Pendant 30 ans, aucun élément naturel n'affichait cette propriété. Au début des années 2000, l'ingénierie permet de fabriquer des « métamatériaux », des structures géométriques plus fines que la lumière elle-même, obligeant la lumière à s'inverser, ouvrant la voie aux « capes d'invisibilité » théoriques.`,
		en: `Imagine dipping a stick into a swimming pool and watching it optically bend, not toward the bottom, but pointing outward from the surface, as if the light made a sharp turn. In 1968, Russian theorist Victor Veselago hypothesized materials with a "negative refractive index", an idea that shocked optical intuition. For 30 years, no natural element displayed this property. In the early 2000s, engineering made it possible to fabricate "metamaterials", geometric structures finer than the wavelength of light itself, forcing light to reverse direction, opening the way to theoretical "invisibility cloaks".`
	},
	sources: [
		{
			name: { fr: 'Electrodynamics of substances with simultaneously negative values of ε and μ (V. G. Veselago, Soviet Physics Uspekhi, 1968)', en: 'Electrodynamics of substances with simultaneously negative values of ε and μ (V. G. Veselago, Soviet Physics Uspekhi, 1968)' },
			url: 'https://doi.org/10.1070/PU1968v010n04ABEH003699'
		}
	],
	contexts: [
		{
			title: { fr: 'Les équations de Maxwell et la permittivité négative', en: 'Maxwell\'s equations and negative permittivity' },
			body: {
				fr: `L'indice de réfraction $n$ d'un milieu isotrope est lié à la permittivité électrique $\\epsilon$ et à la perméabilité magnétique $\\mu$ par $n^2 = \\epsilon \\mu$. Classiquement, la lumière ne traverse que des milieux où $\\epsilon > 0$ et $\\mu > 0$. Veselago a exploré la région où $\\epsilon < 0$ et $\\mu < 0$ simultanément. Dans ce régime doublement négatif, le produit $\\epsilon\\mu$ redevient positif, permettant la propagation d'ondes, mais la racine complexe impose de sélectionner la branche négative : $n = -\\sqrt{|\\epsilon\\mu|}$.`,
				en: `The refractive index $n$ of an isotropic medium relates to the electric permittivity $\\epsilon$ and magnetic permeability $\\mu$ via $n^2 = \\epsilon \\mu$. Classically, light propagates only through media where $\\epsilon > 0$ and $\\mu > 0$. Veselago explored the region where $\\epsilon < 0$ and $\\mu < 0$ simultaneously. In this doubly negative regime, the product $\\epsilon\\mu$ becomes positive again, allowing wave propagation, but the complex square root requires selecting the negative branch: $n = -\\sqrt{|\\epsilon\\mu|}$.`
			},
			external: false
		},
		{
			title: { fr: 'Vecteur de Poynting et trièdre indirect', en: 'Poynting vector and the left-handed triad' },
			body: {
				fr: `Ce changement de signe a une conséquence brutale sur l'onde électromagnétique transverse. D'après la relation de Maxwell-Faraday $\\mathbf{k} \\times \\mathbf{E} = \\omega \\mu \\mathbf{H}$, si $\\mu$ est négatif, le vecteur d'onde $\\mathbf{k}$ pointe dans la direction opposée au vecteur de flux d'énergie de Poynting :\n\n$$\\mathbf{S} = \\mathbf{E} \\times \\mathbf{H}$$\n\nL'onde présente une vitesse de phase anti-parallèle à sa vitesse de groupe. La loi de Snell-Descartes $n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)$ voit son angle sortant basculer de l'autre côté de la normale à l'interface.`,
				en: `This sign change has a drastic consequence for the transverse electromagnetic wave. From the Maxwell-Faraday relation $\\mathbf{k} \\times \\mathbf{E} = \\omega \\mu \\mathbf{H}$, if $\\mu$ is negative, the wave vector $\\mathbf{k}$ points opposite to the Poynting energy-flux vector:\n\n$$\\mathbf{S} = \\mathbf{E} \\times \\mathbf{H}$$\n\nThe wave's phase velocity becomes anti-parallel to its group velocity. Snell's law, $n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)$, sees its outgoing angle flip to the other side of the interface normal.`
			},
			external: false
		},
		{
			title: { fr: 'L\'optique de transformation et les tenseurs invariants', en: 'Transformation optics and invariant tensors' },
			body: {
				fr: `Le concept d'invisibilité de Pendry (2006) utilise l'invariance tensorielle des équations de Maxwell sous une déformation des coordonnées spatiales : on compresse virtuellement l'espace entourant un volume vide dans une coquille annulaire. Le métamatériau doit présenter des profils d'anisotropie diélectrique radiale s'écrivant, en coordonnées sphériques :\n\n$$\\epsilon_r = \\mu_r = \\frac{R_2}{R_2 - R_1} \\left( \\frac{r - R_1}{r} \\right)^2, \\quad \\epsilon_\\theta = \\mu_\\theta = \\frac{R_2}{R_2 - R_1}$$\n\nToute onde plane incidente contourne le trou central $R_1$ sans réflexion ni retard de phase observable au rayon extérieur $R_2$.`,
				en: `Pendry's invisibility concept (2006) exploits the tensorial invariance of Maxwell's equations under a spatial-coordinate deformation: the space surrounding an empty volume is virtually compressed into an annular shell. The metamaterial must exhibit radial dielectric anisotropy profiles written, in spherical coordinates, as:\n\n$$\\epsilon_r = \\mu_r = \\frac{R_2}{R_2 - R_1} \\left( \\frac{r - R_1}{r} \\right)^2, \\quad \\epsilon_\\theta = \\mu_\\theta = \\frac{R_2}{R_2 - R_1}$$\n\nAny incident plane wave bends around the central hole $R_1$ without reflection or observable phase delay at the outer radius $R_2$.`
			},
			external: false
		}
	]
};
