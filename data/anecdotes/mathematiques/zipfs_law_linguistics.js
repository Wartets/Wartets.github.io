export default {
	id: 'anecdote_zipfs_law_linguistics',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Statistiques / Théorie de l\'Information', en: 'Statistics / Information Theory' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Prenez le livre le plus long d'une bibliothèque et comptez tous les mots. Un fait mathématique fascinant se produit alors : le mot le plus utilisé apparaît environ deux fois plus souvent que le deuxième mot le plus utilisé, trois fois plus souvent que le troisième, et cent fois plus que le centième. Cette règle, appelée loi de Zipf, s'applique à quasiment toutes les langues humaines, anciennes ou modernes, et même au trafic des sites internet ou à la taille des villes. Elle reflète un principe de « moindre effort » dans l'organisation du langage.`,
		en: `Take the longest book in a library and count every word. A fascinating mathematical fact emerges: the most frequently used word appears roughly twice as often as the second most frequent word, three times as often as the third, and a hundred times more than the hundredth. This rule, known as Zipf's law, applies to almost every human language, ancient or modern, and even to website traffic or city sizes. It reflects a "principle of least effort" in the organization of language.`
	},
	sources: [
		{
			name: { fr: 'Human Behavior and the Principle of Least Effort (George K. Zipf, Addison-Wesley Press, 1949)', en: 'Human Behavior and the Principle of Least Effort (George K. Zipf, Addison-Wesley Press, 1949)' },
			url: 'https://archive.org/details/humanbehaviorand00zipf'
		}
	],
	contexts: [
		{
			title: { fr: 'Loi de puissance et distribution de Pareto', en: 'Power law and the Pareto distribution' },
			body: {
				fr: `La loi de Zipf est une distribution de probabilité discrète fondée sur une loi de puissance. En classant les mots d'un corpus par rang de fréquence $r$ (1 pour le plus fréquent, 2 pour le second, etc.), la fréquence d'apparition $f(r)$ est inversement proportionnelle à son rang :\n\n$$f(r) = \\frac{C}{r^\\alpha}$$\n\noù $C$ est une constante de normalisation dépendant de la taille du corpus et $\\alpha$ un exposant très proche de 1. En passant au logarithme, la distribution forme une droite de pente $-1$ : $\\log f(r) = \\log C - \\alpha \\log r$.`,
				en: `Zipf's law is a discrete probability distribution based on a power law. Ranking the words of a corpus by frequency rank $r$ (1 for the most frequent, 2 for the second, and so on), the frequency of occurrence $f(r)$ is inversely proportional to its rank:\n\n$$f(r) = \\frac{C}{r^\\alpha}$$\n\nwhere $C$ is a normalization constant depending on the corpus size and $\\alpha$ an exponent very close to 1. Taking the logarithm, the distribution forms a straight line of slope $-1$: $\\log f(r) = \\log C - \\alpha \\log r$.`
			},
			external: false
		}
	]
};
