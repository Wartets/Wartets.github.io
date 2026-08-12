export default {
	id: 'anecdote_conway_game_of_life_cellular',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Systèmes Complexes / Automates Cellulaires', en: 'Complex Systems / Cellular Automata' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1970, le mathématicien John Horton Conway invente un « jeu » sans aucun joueur, se déroulant sur une grille de cases pixelisées, des cellules mortes ou vivantes. Son évolution ne dépend que de quatre règles simplissimes : une cellule survit si elle a 2 ou 3 voisines, meurt de solitude ou d'étouffement sinon, et naît d'une case vide si elle a exactement 3 voisines. Contre toute attente, cette simplicité déterministe génère des comportements extraordinairement chaotiques et organiques. Les passionnés y ont découvert des « vaisseaux » qui se déplacent, des « canons » qui tirent, et il a même été prouvé que cet automate est « Turing-complet » : le Jeu de la Vie possède la capacité théorique de simuler n'importe quel programme informatique, voire une version de lui-même.`,
		en: `In 1970, mathematician John Horton Conway invented a "game" with no players at all, played out on a grid of pixelated cells, either dead or alive. Its evolution depends on only four extremely simple rules: a cell survives if it has 2 or 3 neighbors, dies of loneliness or overcrowding otherwise, and is born in an empty cell that has exactly 3 neighbors. Against all odds, this deterministic simplicity generates extraordinarily chaotic and organic behavior. Enthusiasts have discovered "gliders" that move, "guns" that fire, and it has even been proven that this automaton is "Turing-complete": the Game of Life theoretically has the capacity to simulate any computer program, even a version of itself.`
	},
	sources: [
		{
			name: { fr: 'Mathematical Games: The fantastic combinations of John Conway\'s new solitaire game "life" (M. Gardner, Scientific American, 1970)', en: 'Mathematical Games: The fantastic combinations of John Conway\'s new solitaire game "life" (M. Gardner, Scientific American, 1970)' },
			url: 'https://www.scientificamerican.com/article/mathematical-games-1970-10/'
		}
	],
	contexts: [
		{
			title: { fr: 'Fonctions de transition et complétude de Turing', en: 'Transition functions and Turing completeness' },
			body: {
				fr: `Le Jeu de la Vie est un automate cellulaire de voisinage de Moore, les 8 cellules environnantes. L'état d'une cellule $S_{i,j}$ à l'itération $t+1$ est dicté par une fonction booléenne non linéaire de l'état de son voisinage au temps $t$. En notant $N$ la somme des états des voisines, l'évolution se formalise par :\n\n$$S_{i,j}^{t+1} = \\begin{cases} 1 & \\text{si } N = 3 \\\\ 1 & \\text{si } S_{i,j}^t = 1 \\text{ et } N = 2 \\\\ 0 & \\text{sinon} \\end{cases}$$\n\nLa preuve rigoureuse de sa complétude de Turing repose sur la construction de portes logiques (AND, OR, NOT) utilisant des flux de « planeurs » comme signaux électriques, permettant de construire une machine de Turing universelle intégrale uniquement avec ces règles de survie.`,
				en: `The Game of Life is a cellular automaton with a Moore neighborhood, the 8 surrounding cells. The state of a cell $S_{i,j}$ at iteration $t+1$ is dictated by a nonlinear boolean function of its neighborhood's state at time $t$. Denoting $N$ as the sum of the neighbors' states, the evolution is formalized as:\n\n$$S_{i,j}^{t+1} = \\begin{cases} 1 & \\text{if } N = 3 \\\\ 1 & \\text{if } S_{i,j}^t = 1 \\text{ and } N = 2 \\\\ 0 & \\text{otherwise} \\end{cases}$$\n\nThe rigorous proof of its Turing completeness relies on constructing logic gates (AND, OR, NOT) using streams of "gliders" as electrical signals, making it possible to build a fully universal Turing machine using only these survival rules.`
			},
			external: false
		}
	]
};
