export default {
	id: 'anecdote_euler_polyhedron_formula',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Géométrie / Topologie', en: 'Geometry / Topology' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Dessinez n'importe quelle forme en trois dimensions composée de faces plates et d'arêtes droites, un cube, une pyramide, ou un polyèdre farfelu avec cent facettes. Si l'on compte le nombre de sommets (S), d'arêtes (A) et de faces (F), Leonhard Euler a démontré en 1758 une loi universelle inaltérable : la quantité « sommets moins arêtes plus faces » vaut absolument et toujours 2. C'est l'un des tout premiers théorèmes de la topologie.`,
		en: `Draw any three-dimensional shape made of flat faces and straight edges, a cube, a pyramid, or an eccentric polyhedron with a hundred facets. Counting the number of vertices (V), edges (E), and faces (F), Leonhard Euler proved in 1758 an inalterable universal law: the quantity "vertices minus edges plus faces" is always, absolutely, equal to 2. It is one of the very first theorems of topology.`
	},
	sources: [
		{
			name: { fr: 'Elementa doctrinae solidorum (L. Euler, Novi Commentarii academiae scientiarum Petropolitanae, 1758)', en: 'Elementa doctrinae solidorum (L. Euler, Novi Commentarii academiae scientiarum Petropolitanae, 1758)' },
			url: 'https://scholarlycommons.pacific.edu/cgi/viewcontent.cgi?article=1229&context=euler-works'
		}
	],
	contexts: [
		{
			title: { fr: 'Caractéristique d\'Euler et genres topologiques', en: "Euler characteristic and topological genus" },
			body: {
				fr: `La formule $S - A + F = 2$ est valable pour tout polyèdre convexe, ou tout graphe planaire connexe. En mathématiques modernes, cette constante « 2 » correspond à la caractéristique d'Euler $\\chi$ de la surface d'une sphère euclidienne, car on peut gonfler mentalement le polyèdre pour qu'il devienne une sphère sans le déchirer. La généralisation topologique relie cette caractéristique au « genre » $g$ de la surface, le nombre de « trous » ou de « poignées », comme dans un tore :\n\n$$\\chi = S - A + F = 2 - 2g$$\n\nPour un cube, sans trou ($g=0$), on retrouve 2.`,
				en: `The formula $V - E + F = 2$ holds for every convex polyhedron, or every connected planar graph. In modern mathematics, this constant "2" corresponds to the Euler characteristic $\\chi$ of the surface of a Euclidean sphere, since the polyhedron can mentally be inflated into a sphere without tearing it. The topological generalization relates this characteristic to the "genus" $g$ of the surface, the number of "holes" or "handles", as in a torus:\n\n$$\\chi = V - E + F = 2 - 2g$$\n\nFor a cube, with no hole ($g=0$), one recovers 2.`
			},
			external: false
		}
	]
};
