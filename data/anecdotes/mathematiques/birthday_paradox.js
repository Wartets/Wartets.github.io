export default {
	id: 'anecdote_birthday_paradox',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Probabilités / Statistiques', en: 'Probability / Statistics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Combien de personnes faut-il réunir dans une pièce pour avoir plus de 50 % de chances que deux d'entre elles partagent la même date d'anniversaire ? L'intuition humaine, habituée à la linéarité, suggère souvent un nombre proche de 180 (la moitié des jours d'une année). En réalité, les lois mathématiques des probabilités montrent qu'il suffit de seulement 23 personnes. Avec 70 personnes, la probabilité atteint 99,9 %.`,
		en: `How many people need to be gathered in a room for there to be more than a 50% chance that two of them share the same birthday? Human intuition, accustomed to linear reasoning, often suggests a number close to 180 (half the days in a year). In reality, the mathematical laws of probability show that just 23 people suffice. With 70 people, the probability reaches 99.9%.`
	},
	sources: [
		// {
		// 	name: { fr: 'Understanding Probability, 3rd Edition (Henk Tijms, Cambridge University Press, 2012)', en: 'Understanding Probability, 3rd Edition (Henk Tijms, Cambridge University Press, 2012)' },
		// 	url: 'https://www.cambridge.org/highereducation/books/understanding-probability/'
		// }
	],
	contexts: [
		{
			title: { fr: 'Calcul de probabilité par l\'événement contraire', en: 'Probability via the complementary event' },
			body: {
				fr: `L'erreur intuitive consiste à comparer son propre anniversaire à celui des autres. Le problème demande si *n'importe quelle* paire de personnes partage un anniversaire, ce qui augmente quadratiquement le nombre de paires possibles. Il est plus simple de calculer la probabilité $P(\\bar{A})$ que personne n'ait le même anniversaire. Pour $n$ personnes, le résultat est :\n\n$$P(A) = 1 - \\frac{365}{365} \\times \\frac{364}{365} \\times \\dots \\times \\frac{365 - n + 1}{365} = 1 - \\frac{365!}{365^n (365-n)!}$$\n\nPour $n=23$, $P(A) \\approx 0,5073$.`,
				en: `The intuitive mistake is to compare one's own birthday to everyone else's. The problem asks whether *any* pair of people shares a birthday, which increases the number of possible pairs quadratically. It is simpler to compute the probability $P(\\bar{A})$ that no one shares a birthday. For $n$ people, the result is:\n\n$$P(A) = 1 - \\frac{365}{365} \\times \\frac{364}{365} \\times \\dots \\times \\frac{365 - n + 1}{365} = 1 - \\frac{365!}{365^n (365-n)!}$$\n\nFor $n=23$, $P(A) \\approx 0.5073$.`
			},
			external: false
		}
	]
};
