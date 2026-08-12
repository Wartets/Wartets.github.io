export default {
	id: 'anecdote_poincare_conjecture_ricci_flow',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Mathématiques Pures - Topologie', en: 'Pure Mathematics - Topology' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Imaginez un élastique fermé en boucle à la surface d'une sphère : vous pouvez toujours le faire glisser et le rétrécir jusqu'à un point, sans qu'il ne se coince ni ne quitte la surface. Sur un tore, l'élastique coincé autour du trou central ne peut pas rétrécir ainsi. En 1904, Henri Poincaré conjecture que tout espace tridimensionnel possédant cette propriété de rétrécissement total est nécessairement une forme déformée de l'hypersphère. Il aura fallu près d'un siècle pour que le mathématicien russe Grigori Perelman prouve cette affirmation, ce qui lui valut le premier « Prix du Millénaire », qu'il refusa de façon spectaculaire.`,
		en: `Imagine a closed rubber band looped on the surface of a sphere: you can always slide and shrink it down to a point, without it ever getting stuck or leaving the surface. On a torus, a band looped around the central hole cannot shrink that way. In 1904, Henri Poincaré conjectured that any three-dimensional space with this property of total contractibility is necessarily a deformed shape of the hypersphere. It took nearly a century for Russian mathematician Grigori Perelman to prove this statement, earning him the first "Millennium Prize", which he spectacularly declined.`
	},
	sources: [
		{
			name: { fr: 'The entropy formula for the Ricci flow and its geometric applications (G. Perelman, ArXiv, 2002)', en: 'The entropy formula for the Ricci flow and its geometric applications (G. Perelman, ArXiv, 2002)' },
			url: 'https://arxiv.org/abs/math/0211159'
		}
	],
	contexts: [
		{
			title: { fr: 'Variétés simplement connexes et l\'hypothèse originelle', en: 'Simply connected manifolds and the original hypothesis' },
			body: {
				fr: `Topologiquement, une hypersphère 3D est notée $S^3$. La notion de rétrécissement des boucles s'exprime par le premier groupe d'homotopie $\\pi_1(\\mathcal{M})$. Si toute boucle fermée est contractile en un point, la variété est dite simplement connexe : $\\pi_1(\\mathcal{M}) = 0$.\n\nL'énoncé de Poincaré stipule que toute variété de dimension 3, compacte, sans bord et simplement connexe est homéomorphe à $S^3$. Ce théorème lie de manière rigide les propriétés topologiques locales à la classification topologique globale d'un espace tridimensionnel.`,
				en: `Topologically, a 3D hypersphere is denoted $S^3$. The notion of loop contractibility is expressed by the first homotopy group $\\pi_1(\\mathcal{M})$. If every closed loop is contractible to a point, the manifold is said to be simply connected: $\\pi_1(\\mathcal{M}) = 0$.\n\nPoincaré's statement asserts that every compact, boundaryless, simply connected 3-manifold is homeomorphic to $S^3$. This theorem rigidly links local topological properties to the global topological classification of a three-dimensional space.`
			},
			external: false
		},
		{
			title: { fr: 'La résolution géométrique par le flot de Ricci', en: 'The geometric resolution via Ricci flow' },
			body: {
				fr: `Perelman n'a pas utilisé des outils purement topologiques, mais la géométrie différentielle. Il s'est appuyé sur le « flot de Ricci » de Richard Hamilton, un système d'équations aux dérivées partielles semblable à une diffusion de chaleur pour la courbure spatiale. L'évolution du tenseur métrique $g_{ij}(t)$ est pilotée par le tenseur de courbure de Ricci $R_{ij}$ :\n\n$$\\frac{\\partial g_{ij}}{\\partial t} = -2 R_{ij}$$\n\nCe flot lisse les courbures irrégulières, rendant la variété de plus en plus ronde. Perelman a défini une technique chirurgicale pour couper et boucher topologiquement les points de singularité de courte durée, prouvant que la variété limite globale est constituée de sphères géométriques $S^3$.`,
				en: `Perelman did not use purely topological tools, but differential geometry. He relied on Richard Hamilton's "Ricci flow", a system of partial differential equations similar to a heat-diffusion equation for spatial curvature. The evolution of the metric tensor $g_{ij}(t)$ is driven by the Ricci curvature tensor $R_{ij}$:\n\n$$\\frac{\\partial g_{ij}}{\\partial t} = -2 R_{ij}$$\n\nThis flow smooths out irregular curvatures, making the manifold increasingly round. Perelman devised a surgical technique to cut and topologically patch finite-time singularity points, proving that the resulting global limit manifold consists of geometric $S^3$ spheres.`
			},
			external: false
		}
	]
};
