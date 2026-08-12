export default {
	id: 'anecdote_quicksort_algorithm_hoare',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Informatique - Algorithmique', en: 'Computer Science - Algorithms' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Comment ranger un million de dossiers par ordre alphabétique dans le minimum de temps ? En 1959, le chercheur britannique Tony Hoare conçoit un algorithme si subtil, nommé « Quicksort », qu'il est encore aujourd'hui au cœur de nombreuses bibliothèques logicielles. Plutôt que de comparer chaque élément un par un, son approche « diviser pour régner » choisit arbitrairement une donnée de la liste (le pivot), place toutes les valeurs plus petites à gauche et les plus grandes à droite, puis répète récursivement l'opération sur chaque sous-groupe jusqu'à ce que chaque compartiment ne contienne plus qu'un unique élément, trié de fait.`,
		en: `How can a million files be sorted alphabetically in the least amount of time? In 1959, British researcher Tony Hoare devised an algorithm so subtle, named "Quicksort", that it still lies at the heart of countless software libraries today. Rather than comparing every element one by one, its "divide and conquer" approach arbitrarily picks one item from the list (the pivot), places every smaller value to its left and every larger value to its right, and then recursively repeats the operation on each subgroup until every partition contains a single, effectively sorted, element.`
	},
	sources: [
		{
			name: { fr: 'Algorithm 64: Quicksort (C. A. R. Hoare, Communications of the ACM, 1961)', en: 'Algorithm 64: Quicksort (C. A. R. Hoare, Communications of the ACM, 1961)' },
			url: 'https://doi.org/10.1145/366622.366644'
		}
	],
	contexts: [
		{
			title: { fr: 'Complexité temporelle et paradigme récursif', en: 'Time complexity and the recursive paradigm' },
			body: {
				fr: `Le tri par insertion a une complexité asymptotique en $\\mathcal{O}(n^2)$, incapable de traiter des bases de données massives. L'algorithme de partitionnement récursif de Hoare équilibre en moyenne l'arbre d'exécution des appels, produisant une profondeur logarithmique. La relation de récurrence du temps de calcul $T(n)$ s'approxime par :\n\n$$T(n) \\approx 2 T\\left(\\frac{n}{2}\\right) + c \\cdot n$$\n\nLe théorème maître de l'algorithmique montre que la solution moyenne de cette récurrence donne une complexité optimale $\\mathcal{O}(n \\log_2 n)$. L'élégance du Quicksort réside dans son tri « en place » : l'échange d'index aux extrémités ne requiert quasiment aucune mémoire supplémentaire, hormis $\\mathcal{O}(\\log n)$ pour la pile d'appels récursifs.`,
				en: `Insertion sort has a disastrous asymptotic complexity of $\\mathcal{O}(n^2)$, unable to handle massive datasets. Hoare's recursive partitioning algorithm balances the call execution tree on average, producing a logarithmic depth. The recurrence relation for the running time $T(n)$ approximates to:\n\n$$T(n) \\approx 2 T\\left(\\frac{n}{2}\\right) + c \\cdot n$$\n\nThe master theorem of algorithmics shows that the average solution to this recurrence gives an optimal complexity of $\\mathcal{O}(n \\log_2 n)$. The elegance of Quicksort lies in its "in-place" sorting: swapping indices at the endpoints requires almost no additional memory, aside from $\\mathcal{O}(\\log n)$ for the recursive call stack.`
			},
			external: false
		}
	]
};
