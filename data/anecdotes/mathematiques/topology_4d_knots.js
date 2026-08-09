export default {
	id: 'anecdote_topology_4d_knots',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Topologie / Mathématiques', en: 'Topology / Mathematics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Les nœuds marins (ou ceux de nos lacets) existent dans notre univers à trois dimensions spatiales. Étonnamment, la théorie mathématique des nœuds démontre qu'il est absolument impossible de faire un nœud avec une ficelle (à 1 dimension) dans un espace à 4 dimensions spatiales. Dans un tel espace, la dimension supplémentaire offre toujours un « chemin » libre permettant à la boucle de glisser à travers elle-même sans jamais s'intersecter, défaisant spontanément n'importe quel nœud.`,
		en: `Marine knots (or shoelace knots) exist in our three-dimensional universe. Remarkably, mathematical knot theory proves that it is absolutely impossible to tie a knot with a string (1-dimensional) in a space with 4 spatial dimensions. In such a space, the extra dimension always provides a free "path" allowing the loop to slip through itself without ever intersecting, spontaneously undoing any knot.`
	},
	sources: [
		{
			name: { fr: 'Knot Theory and Its Applications (K. Murasugi, Birkhäuser, 1996, Chapter 1)', en: 'Knot Theory and Its Applications (K. Murasugi, Birkhäuser, 1996, Chapter 1)' },
			url: 'https://www.sidalc.net/search/Record/KOHA-OAI-TEST:212470/Description'
		}
	],
	contexts: [
		{
			title: { fr: 'Codimension et transversalité', en: 'Codimension and transversality' },
			body: {
				fr: `Un nœud classique est un plongement lisse du cercle $S^1$ dans l'espace $\\mathbb{R}^3$. En topologie algébrique, la possibilité pour deux sous-variétés de s'intersecter génériquement dépend de leur codimension (la différence entre la dimension de l'espace ambiant et celle de la variété). La dimension de l'espace ambiant est $n$. Pour que deux brins d'une courbe 1D puissent s'éviter lors d'une déformation, il faut que $n \\ge 4$. En termes de transversalité mathématique : la dimension de l'intersection générique de deux courbes 1D dans un espace $n$-dimensionnel s'écrit :\n\n$$\\text{dim} = 1 + 1 - n = 2 - n$$\n\nSi $n = 4$, la dimension d'intersection est $-2$, ce qui signifie que l'intersection est structurellement impossible.`,
				en: `A classical knot is a smooth embedding of the circle $S^1$ into space $\\mathbb{R}^3$. In algebraic topology, whether two submanifolds can intersect generically depends on their codimension (the difference between the dimension of the ambient space and that of the submanifold). Let $n$ be the dimension of the ambient space. For two strands of a 1D curve to be able to avoid each other during a deformation, $n \\ge 4$ is required. In terms of mathematical transversality, the dimension of the generic intersection of two 1D curves in an $n$-dimensional space is:\n\n$$\\text{dim} = 1 + 1 - n = 2 - n$$\n\nIf $n = 4$, the intersection dimension is $-2$, meaning the intersection is structurally impossible.`
			},
			external: false
		}
	]
};
