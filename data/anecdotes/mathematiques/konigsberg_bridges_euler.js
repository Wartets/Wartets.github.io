export default {
	id: 'anecdote_konigsberg_bridges_euler',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Mathématiques / Théorie des Graphes', en: 'Mathematics / Graph Theory' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Au XVIIIe siècle, les habitants de la ville de Königsberg, aujourd'hui Kaliningrad, aimaient se lancer un défi lors de leurs promenades : était-il possible de traverser les sept ponts de la ville, répartis sur deux îles et deux berges, en ne passant qu'une seule et unique fois par chaque pont ? En 1736, le mathématicien Leonhard Euler résolut le problème de manière analytique. Plutôt que d'essayer tous les chemins, il abstraisit la ville en un schéma de points et de lignes. Il démontra que la topologie même du parcours rendait ce défi mathématiquement impossible, posant par là même les fondations d'une toute nouvelle branche des mathématiques : la théorie des graphes.`,
		en: `In the 18th century, the inhabitants of the city of Königsberg, today's Kaliningrad, enjoyed setting themselves a challenge during their walks: was it possible to cross the city's seven bridges, spread across two islands and two riverbanks, passing over each bridge exactly once? In 1736, mathematician Leonhard Euler solved the problem analytically. Rather than trying every path, he abstracted the city into a scheme of points and lines. He proved that the very topology of the route made the challenge mathematically impossible, thereby laying the foundations of an entirely new branch of mathematics: graph theory.`
	},
	sources: [
		{
			name: { fr: 'Solutio problematis ad geometriam situs pertinentis (L. Euler, Commentarii academiae scientiarum Petropolitanae, 1741)', en: 'Solutio problematis ad geometriam situs pertinentis (L. Euler, Commentarii academiae scientiarum Petropolitanae, 1741)' },
			url: 'https://scholarlycommons.pacific.edu/euler-works/53/'
		}
	],
	contexts: [
		{
			title: { fr: 'Le degré des sommets et les chemins Eulériens', en: 'Vertex degree and Eulerian paths' },
			body: {
				fr: `Euler a converti les masses terrestres en « sommets » et les ponts en « arêtes ». Il a identifié que pour entrer et ressortir d'un sommet sans réutiliser un pont, le sommet doit nécessairement posséder un nombre pair d'arêtes connectées, son « degré ». Le théorème fondamental des graphes eulériens énonce qu'un graphe connexe admet un chemin eulérien si et seulement si le nombre de sommets de degré impair est exactement zéro ou deux, ces deux sommets étant alors les points de départ et d'arrivée. Dans la modélisation de Königsberg par Euler, les 4 masses terrestres possédaient toutes un nombre impair de ponts, degrés 3, 3, 3 et 5. La condition n'étant pas remplie, le parcours est rigoureusement impossible.`,
				en: `Euler converted the land masses into "vertices" and the bridges into "edges". He identified that to enter and leave a vertex without reusing a bridge, that vertex must necessarily have an even number of connected edges, its "degree". The fundamental theorem of Eulerian graphs states that a connected graph admits an Eulerian path if and only if the number of odd-degree vertices is exactly zero or two, these two vertices then being the start and end points. In Euler's modeling of Königsberg, all 4 land masses had an odd number of bridges, degrees 3, 3, 3, and 5. Since the condition was not met, the walk is rigorously impossible.`
			},
			external: false
		}
	]
};
