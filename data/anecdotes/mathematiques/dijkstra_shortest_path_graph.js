export default {
	id: 'anecdote_dijkstra_shortest_path_graph',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Théorie des Graphes / Informatique', en: 'Graph Theory / Computer Science' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1956, le jeune informaticien néerlandais Edsger W. Dijkstra cherche à démontrer les capacités d'un nouvel ordinateur. En prenant un café avec sa fiancée à Amsterdam, il conçoit mentalement, en seulement vingt minutes, une méthode systématique pour trouver le trajet le plus court entre deux villes quelconques sur une carte géographique. L'algorithme de Dijkstra explore les nœuds d'un réseau en s'assurant mathématiquement de toujours valider le chemin le moins coûteux avant d'aller plus loin. Aujourd'hui, près de soixante-dix ans plus tard, c'est toujours le principe conceptuel central utilisé par les protocoles de routage d'Internet et les applications de navigation GPS.`,
		en: `In 1956, young Dutch computer scientist Edsger W. Dijkstra was trying to demonstrate the capabilities of a new computer. While having coffee with his fiancée in Amsterdam, he mentally devised, in just twenty minutes, a systematic method for finding the shortest route between any two cities on a geographic map. Dijkstra's algorithm explores the nodes of a network while mathematically guaranteeing that it always validates the least costly path before proceeding further. Today, nearly seventy years later, it remains the core conceptual principle behind Internet routing protocols and GPS navigation applications.`
	},
	sources: [
		{
			name: { fr: 'A note on two problems in connexion with graphs (E. W. Dijkstra, Numerische Mathematik, 1959)', en: 'A note on two problems in connexion with graphs (E. W. Dijkstra, Numerische Mathematik, 1959)' },
			url: 'https://link.springer.com/article/10.1007/BF01386390'
		}
	],
	contexts: [
		{
			title: { fr: 'Relaxation des arêtes et optimisation par tas', en: 'Edge relaxation and heap-based optimization' },
			body: {
				fr: `Dans un graphe pondéré $G = (V, E)$ où le poids des arêtes est positif $w(u, v) \\ge 0$, l'algorithme maintient un ensemble de sommets dont la distance minimale depuis la source est connue. L'étape cruciale est la « relaxation » d'une arête : si le chemin passant par le nœud $u$ pour atteindre $v$ est plus court que la distance actuelle connue pour $v$, on met à jour cette distance :\n\n$$\\text{si } d(u) + w(u, v) < d(v) \\implies d(v) := d(u) + w(u, v)$$\n\nInitialement conçu avec une complexité en $\\mathcal{O}(|V|^2)$, l'implémentation moderne utilisant des structures de données avancées comme le Tas de Fibonacci permet de réduire cette borne à $\\mathcal{O}(|E| + |V| \\log |V|)$, rendant le traitement des graphes massifs comme le réseau routier mondial computationnellement viable.`,
				en: `In a weighted graph $G = (V, E)$ where edge weights are positive $w(u, v) \\ge 0$, the algorithm maintains a set of vertices whose minimal distance from the source is known. The crucial step is edge "relaxation": if the path through node $u$ to reach $v$ is shorter than the currently known distance to $v$, that distance is updated:\n\n$$\\text{if } d(u) + w(u, v) < d(v) \\implies d(v) := d(u) + w(u, v)$$\n\nOriginally designed with $\\mathcal{O}(|V|^2)$ complexity, modern implementations using advanced data structures such as the Fibonacci Heap reduce this bound to $\\mathcal{O}(|E| + |V| \\log |V|)$, making the processing of massive graphs like the global road network computationally viable.`
			},
			external: false
		}
	]
};
