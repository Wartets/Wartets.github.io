export default {
	id: 'anecdote_collatz_conjecture_math',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Mathématiques - Théorie des Nombres', en: 'Mathematics - Number Theory' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `C'est l'un des problèmes mathématiques dont l'énoncé est le plus simple à expliquer, mais qui résiste depuis sa formulation en 1937 par Lothar Collatz. Prenez un entier strictement positif arbitraire. S'il est pair, divisez-le par 2. S'il est impair, multipliez-le par 3 et ajoutez 1. Répétez l'opération avec le nouveau nombre obtenu. En testant empiriquement ce procédé, tous les nombres finissent par retomber dans la boucle 4, 2, 1, 4, 2, 1... À ce jour, malgré des milliards de vérifications par supercalculateurs, il reste mathématiquement impossible de prouver que cette loi s'applique à la totalité infinie des entiers.`,
		en: `This is one of the mathematical problems whose statement is the simplest to explain, yet it has resisted proof since its formulation in 1937 by Lothar Collatz. Take an arbitrary strictly positive integer. If it is even, divide it by 2. If it is odd, multiply it by 3 and add 1. Repeat the operation with the resulting number. Testing this procedure empirically, every number eventually falls into the loop 4, 2, 1, 4, 2, 1... To this day, despite billions of supercomputer verifications, it remains mathematically impossible to prove that this law applies to the entire infinite set of integers.`
	},
	sources: [
		{
			name: { fr: 'The 3x+1 problem and its generalizations (J. C. Lagarias, The American Mathematical Monthly, 1985)', en: 'The 3x+1 problem and its generalizations (J. C. Lagarias, The American Mathematical Monthly, 1985)' },
			url: 'https://doi.org/10.48550/arXiv.2111.02635'
		}
	],
	contexts: [
		{
			title: { fr: 'Systèmes dynamiques discrets et graphes orientés', en: 'Discrete dynamical systems and directed graphs' },
			body: {
				fr: `La conjecture porte sur l'orbite de la suite récurrente définie par la fonction modulaire :\n\n$$f(n) = \\begin{cases} \\frac{n}{2} & \\text{si } n \\equiv 0 \\pmod 2 \\\\ 3n + 1 & \\text{si } n \\equiv 1 \\pmod 2 \\end{cases}$$\n\nLe problème demande de prouver que pour tout entier positif de départ $n_0$, il existe un indice itératif $k$ tel que $f^k(n_0) = 1$. Paul Erdős affirmait que « les mathématiques ne sont pas encore mûres pour de tels problèmes ». L'une des difficultés majeures est l'absence de régularité globale : les durées de vol des nombres adjacents fluctuent de manière chaotique. La conjecture équivaut à affirmer que le graphe de transition de tous les entiers naturels génère un unique arbre enraciné, sans boucle disjointe ni trajectoire divergente.`,
				en: `The conjecture concerns the orbit of the recurrent sequence defined by the modular function:\n\n$$f(n) = \\begin{cases} \\frac{n}{2} & \\text{if } n \\equiv 0 \\pmod 2 \\\\ 3n + 1 & \\text{if } n \\equiv 1 \\pmod 2 \\end{cases}$$\n\nThe problem asks to prove that for every positive starting integer $n_0$, there exists an iteration index $k$ such that $f^k(n_0) = 1$. Paul Erdős stated that "mathematics is not yet ready for such problems". One major difficulty is the absence of global regularity: the flight times of adjacent numbers fluctuate chaotically. The conjecture is equivalent to stating that the transition graph of all natural numbers forms a single rooted tree, with no disjoint loop and no divergent trajectory.`
			},
			external: false
		}
	]
};
