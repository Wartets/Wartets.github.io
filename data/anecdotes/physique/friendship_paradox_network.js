export default {
	id: 'anecdote_friendship_paradox_network',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Théorie des Réseaux / Statistiques', en: 'Network Theory / Statistics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Vous avez probablement l'impression que vos amis ont une vie sociale plus riche que la vôtre. Ce n'est pas de la psychologie, c'est une loi mathématique universelle démontrée en 1991. Dans n'importe quel réseau social, la majorité des individus ont strictement moins d'amis que la moyenne du nombre d'amis de leurs propres amis. C'est un biais d'échantillonnage de la théorie des graphes : les personnes très populaires sont, par définition, présentes dans un très grand nombre de cercles sociaux, gonflant mathématiquement la moyenne.`,
		en: `You probably feel that your friends have a richer social life than you do. This is not psychology, it is a universal mathematical law proven in 1991. In any social network, the majority of individuals have strictly fewer friends than the average number of friends their own friends have. This is a sampling bias from graph theory: highly popular people are, by definition, present in a very large number of social circles, mathematically inflating the average.`
	},
	sources: [
		{
			name: { fr: 'Why Your Friends Have More Friends Than You Do (Scott L. Feld, American Journal of Sociology, 1991)', en: 'Why Your Friends Have More Friends Than You Do (Scott L. Feld, American Journal of Sociology, 1991)' },
			url: 'https://www.jstor.org/stable/2781907'
		}
	],
	contexts: [
		{
			title: { fr: 'Variance et degré nodal attendu', en: 'Variance and expected nodal degree' },
			body: {
				fr: `Soit un graphe non orienté où les individus sont les nœuds et les amitiés les arêtes. Le nombre de connexions d'un nœud est son degré $d$, et la moyenne de ce degré sur tout le réseau est $\\mu$. Si l'on choisit une arête au hasard, la probabilité d'atteindre un nœud de degré $d$ est proportionnelle à $d$ lui-même.\n\nLe degré espéré d'un ami (le nœud adjacent) n'est donc pas $\\mu$, mais intègre la variance $\\sigma^2$ de la distribution des degrés :\n\n$$\\text{Espérance(Amis d'un ami)} = \\mu + \\frac{\\sigma^2}{\\mu}$$\n\nPuisque la variance d'un réseau réel est strictement positive ($\\sigma^2 > 0$), cette espérance est toujours mathématiquement supérieure à $\\mu$.`,
				en: `Let there be an undirected graph in which individuals are nodes and friendships are edges. The number of connections of a node is its degree $d$, and the average of this degree over the whole network is $\\mu$. If an edge is chosen at random, the probability of reaching a node of degree $d$ is proportional to $d$ itself.\n\nThe expected degree of a friend (the adjacent node) is therefore not $\\mu$, but incorporates the variance $\\sigma^2$ of the degree distribution:\n\n$$\\text{Expectation(Friends of a friend)} = \\mu + \\frac{\\sigma^2}{\\mu}$$\n\nSince the variance of a real network is strictly positive ($\\sigma^2 > 0$), this expectation is always mathematically greater than $\\mu$.`
			},
			external: false
		}
	]
};
