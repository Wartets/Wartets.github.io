export default {
	id: 'anecdote_pagerank_algorithm_markov',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Algorithmique Numérique / Graphes', en: 'Numerical Algorithms / Graphs' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Le succès fulgurant du premier moteur de recherche Google à la fin des années 1990 ne reposait pas sur l'analyse linguistique complexe du texte des sites, mais sur un emprunt à la sociologie des publications scientifiques. Sergey Brin et Larry Page ont conçu le « PageRank » sur l'idée qu'une page web est jugée pertinente si de nombreuses autres pages pertinentes contiennent un lien vers elle. Le réseau internet entier est modélisé comme un graphe géant. Le PageRank simule le comportement probabiliste d'un internaute aléatoire cliquant indéfiniment de lien en lien, la pertinence d'une page devenant simplement sa probabilité mathématique d'y atterrir au terme de ce surf infini.`,
		en: `The meteoric success of the first Google search engine in the late 1990s did not rely on complex linguistic analysis of site text, but on an idea borrowed from the sociology of scientific publications. Sergey Brin and Larry Page designed "PageRank" around the idea that a web page is deemed relevant if many other relevant pages link to it. The entire internet network is modeled as a giant graph. PageRank simulates the probabilistic behavior of a random surfer clicking indefinitely from link to link, a page's relevance simply becoming its mathematical probability of being landed on at the end of this infinite surf.`
	},
	sources: [
		{
			name: { fr: 'The Anatomy of a Large-Scale Hypertextual Web Search Engine (S. Brin, L. Page, Computer Networks and ISDN Systems, 1998)', en: 'The Anatomy of a Large-Scale Hypertextual Web Search Engine (S. Brin, L. Page, Computer Networks and ISDN Systems, 1998)' },
			url: 'https://doi.org/10.1016/S0169-7552(98)00110-X'
		}
	],
	contexts: [
		{
			title: { fr: 'Modélisation par Chaîne de Markov et Vecteur Propre', en: 'Markov chain modeling and the eigenvector' },
			body: {
				fr: `Soit $N$ le nombre de pages totales. La matrice d'adjacence pondérée du Web construit une matrice de transition stochastique. L'algorithme résout le score de PageRank $PR(u)$ d'une page $u$ de manière itérative, en considérant l'ensemble $B_u$ des pages $v$ pointant vers $u$, et $L(v)$ le nombre de liens sortants de $v$. Pour éviter le piégeage probabiliste dans des nœuds sans lien sortant, un facteur d'amortissement $d$, historiquement $d = 0,85$, est introduit. L'équation centrale s'écrit :\n\n$$PR(u) = \\frac{1-d}{N} + d \\sum_{v \\in B_u} \\frac{PR(v)}{L(v)}$$\n\nMathématiquement, ce calcul revient à utiliser la méthode des puissances pour extraire le vecteur propre principal associé à la valeur propre $\\lambda = 1$ de la matrice de transition modifiée de Google, garantie convergente par le théorème de Perron-Frobenius.`,
				en: `Let $N$ be the total number of pages. The weighted adjacency matrix of the Web builds a stochastic transition matrix. The algorithm solves the PageRank score $PR(u)$ of a page $u$ iteratively, considering the set $B_u$ of pages $v$ linking to $u$, and $L(v)$ the number of outgoing links from $v$. To avoid probabilistic trapping in nodes with no outgoing links, a damping factor $d$, historically $d = 0.85$, is introduced. The central equation is:\n\n$$PR(u) = \\frac{1-d}{N} + d \\sum_{v \\in B_u} \\frac{PR(v)}{L(v)}$$\n\nMathematically, this computation amounts to using the power method to extract the principal eigenvector associated with eigenvalue $\\lambda = 1$ of Google's modified transition matrix, guaranteed to converge by the Perron-Frobenius theorem.`
			},
			external: false
		}
	]
};
