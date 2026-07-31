export default {
	id: 'anecdote_friendship_theorem_graph',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Théorie des Graphes / Combinatoire', en: 'Graph Theory / Combinatorics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Imaginons une soirée géante obéissant à une règle sociale stricte : si l'on prend n'importe quelle paire de deux personnes dans la salle, il faut obligatoirement qu'elles aient très exactement *un* seul et unique ami commun. Le « Théorème de l'amitié », démontré par Paul Erdős, prouve mathématiquement que cette soirée ne peut exister que sous la forme d'une dictature bienveillante : il y a obligatoirement un politicien (ou hôte) au centre qui est personnellement l'ami direct de chaque personne présente à la fête.`,
		en: `Imagine a giant party governed by a strict social rule: taking any pair of two people in the room, they must have exactly *one* single mutual friend. The "Friendship Theorem", proven by Paul Erdős, mathematically shows that such a party can only exist in the form of a benevolent dictatorship: there must necessarily be a politician (or host) at the center who is personally a direct friend of every person present at the party.`
	},
	sources: [
		{
			name: { fr: 'On a Problem of Graph Theory (P. Erdős, A. Rényi, V. T. Sós, Studia Sci. Math. Hungar., 1966)', en: 'On a Problem of Graph Theory (P. Erdős, A. Rényi, V. T. Sós, Studia Sci. Math. Hungar., 1966)' },
			url: 'https://users.renyi.hu/~p_erdos/1966-06.pdf'
		}
	],
	contexts: [
		{
			title: { fr: 'Graphes fortement réguliers et valeur propre', en: 'Strongly regular graphs and eigenvalues' },
			body: {
				fr: `Le problème se modélise par un graphe fini $G$ non orienté où chaque paire de sommets adjacents ou non partage exactement un voisin. La condition se traduit mathématiquement sur la matrice d'adjacence $A$ :\n\n$$A^2 = J + (k-1)I$$\n\n(où $J$ est la matrice pleine de 1, $I$ l'identité, et $k$ le degré régulier conjecturé). La preuve algébrique montre que si le graphe est régulier (chacun a le même nombre d'amis), les multiplicités des valeurs propres de cette matrice ne peuvent pas être entières, ce qui est absurde. Le graphe ne peut donc pas être régulier, forçant l'existence d'un sommet central de degré universel (un graphe « moulin à vent »).`,
				en: `The problem is modeled by a finite undirected graph $G$ in which every pair of adjacent or non-adjacent vertices shares exactly one common neighbor. This condition translates mathematically onto the adjacency matrix $A$ as:\n\n$$A^2 = J + (k-1)I$$\n\n(where $J$ is the all-ones matrix, $I$ the identity, and $k$ the conjectured regular degree). The algebraic proof shows that if the graph is regular (everyone has the same number of friends), the eigenvalue multiplicities of this matrix cannot be integers, which is absurd. The graph therefore cannot be regular, forcing the existence of a central vertex of universal degree (a "windmill graph").`
			},
			external: false
		}
	]
};
