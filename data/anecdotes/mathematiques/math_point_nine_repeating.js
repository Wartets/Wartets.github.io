export default {
	id: 'anecdote_math_point_nine_repeating',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Mathématiques - Analyse Réelle', en: 'Mathematics - Real Analysis' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `L'intuition suggère souvent que le nombre 0,999... (avec une infinité de 9) est infiniment proche de 1, mais strictement inférieur. En mathématiques formelles, cette idée est fausse : 0,999... est exactement et rigoureusement égal à 1. Ce ne sont que deux représentations décimales différentes d'un seul et unique nombre réel, illustrant parfaitement les pièges de l'intuition face au concept mathématique de l'infini.`,
		en: `Intuition often suggests that the number 0.999... (with an infinite string of 9s) is infinitely close to 1 but strictly less than it. In formal mathematics, this idea is false: 0.999... is exactly and rigorously equal to 1. These are merely two different decimal representations of one and the same real number, a perfect illustration of how intuition can be misled by the mathematical concept of infinity.`
	},
	sources: [
		{
			name: { fr: 'Principles of Mathematical Analysis, 3rd Edition (Walter Rudin, McGraw-Hill, 1976, p. 11)', en: 'Principles of Mathematical Analysis, 3rd Edition (Walter Rudin, McGraw-Hill, 1976, p. 11)' },
			url: 'https://david92jackson.neocities.org/images/Principles_of_Mathematical_Analysis-Rudin.pdf'
		}
	],
	contexts: [
		{
			title: { fr: 'Série géométrique convergente', en: 'Convergent geometric series' },
			body: {
				fr: `La notation décimale périodique représente par définition une série infinie. Le nombre $0,999...$ peut s'écrire comme une somme de puissances de 10. L'équation suivante démontre le résultat par la formule de la limite d'une série géométrique de raison $q = 1/10$ :\n\n$$0,999... = \\sum_{n=1}^{\\infty} 9 \\left(\\frac{1}{10}\\right)^n = 9 \\left( \\frac{1/10}{1 - 1/10} \\right) = 9 \\left( \\frac{1/10}{9/10} \\right) = 1$$\n\nToute différence supposée entre les deux valeurs est donc strictement nulle.`,
				en: `Repeating decimal notation represents, by definition, an infinite series. The number $0.999...$ can be written as a sum of powers of 10. The following equation demonstrates the result via the formula for the limit of a geometric series of ratio $q = 1/10$:\n\n$$0.999... = \\sum_{n=1}^{\\infty} 9 \\left(\\frac{1}{10}\\right)^n = 9 \\left( \\frac{1/10}{1 - 1/10} \\right) = 9 \\left( \\frac{1/10}{9/10} \\right) = 1$$\n\nAny supposed difference between the two values is therefore strictly zero.`
			},
			external: false
		}
	]
};
