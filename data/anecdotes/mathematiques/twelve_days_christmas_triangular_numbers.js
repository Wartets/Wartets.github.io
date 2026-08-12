export default {
	id: 'anecdote_twelve_days_christmas_triangular_numbers',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Mathématiques - Combinatoire', en: 'Mathematics - Combinatorics' },
	scheduling: { type: 'period', dates: ['12-25', '01-06'] },
	content: {
		fr: `Le chant traditionnel anglais « The Twelve Days of Christmas » énumère un cadeau offert le premier jour, deux le second (en plus du premier), et ainsi de suite jusqu'au douzième jour. Si l'on additionne absolument tous les présents cumulés reçus au fil des douze jours, le total atteint très exactement 364, soit un cadeau pour chaque jour de l'année à l'exception d'un seul. Cette somme n'est autre que le douzième nombre tétraédrique, une conséquence directe de l'empilement de nombres triangulaires successifs.`,
		en: `The traditional English carol "The Twelve Days of Christmas" lists one gift given on the first day, two on the second (in addition to the first), and so on through the twelfth day. Adding up absolutely every gift accumulated over the twelve days gives a total of exactly 364, one gift short of a full year. This sum is none other than the twelfth tetrahedral number, a direct consequence of stacking successive triangular numbers.`
	},
	sources: [
		{
			name: { fr: 'MathWorld - Tetrahedral Number', en: 'MathWorld - Tetrahedral Number' },
			url: 'https://mathworld.wolfram.com/TetrahedralNumber.html'
		}
	],
	contexts: [
		{
			title: { fr: 'Nombres triangulaires et tétraédriques', en: 'Triangular and tetrahedral numbers' },
			body: {
				fr: `Le nombre de cadeaux reçus le jour $n$ (cumul des types de cadeaux répétés depuis le premier jour) est le $n$-ième nombre triangulaire :\n\n$$T_n = \\frac{n(n+1)}{2}$$\n\nLe total sur les douze jours est la somme de ces nombres triangulaires, c'est-à-dire le nombre tétraédrique correspondant :\n\n$$Te_n = \\sum_{k=1}^{n} T_k = \\frac{n(n+1)(n+2)}{6} = \\binom{n+2}{3}$$\n\nPour $n = 12$ : $Te_{12} = \\frac{12 \\times 13 \\times 14}{6} = 364$.`,
				en: `The number of gifts received on day $n$ (cumulative repeated gift types since day one) is the $n$-th triangular number:\n\n$$T_n = \\frac{n(n+1)}{2}$$\n\nThe total over twelve days is the sum of these triangular numbers, that is, the corresponding tetrahedral number:\n\n$$Te_n = \\sum_{k=1}^{n} T_k = \\frac{n(n+1)(n+2)}{6} = \\binom{n+2}{3}$$\n\nFor $n = 12$: $Te_{12} = \\frac{12 \\times 13 \\times 14}{6} = 364$.`
			},
			external: false
		}
	]
};
