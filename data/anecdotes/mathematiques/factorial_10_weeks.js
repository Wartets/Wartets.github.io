export default {
	id: 'anecdote_factorial_10_weeks',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Mathématiques / Arithmétique', en: 'Mathematics / Arithmetic' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `La factorielle d'un nombre entier est le produit de tous les nombres positifs qui lui sont inférieurs ou égaux. Une propriété arithmétique étonnante, d'une symétrie parfaite, lie la factorielle de 10 à notre perception du temps : 10! secondes correspondent à très exactement 6 semaines, sans aucune virgule ni arrondi.`,
		en: `The factorial of an integer is the product of every positive number less than or equal to it. A striking arithmetic property, of perfect symmetry, links the factorial of 10 to our perception of time: 10! seconds correspond to exactly 6 weeks, with no decimal and no rounding.`
	},
	sources: [
		{
			name: { fr: 'Factorial Properties (MathWorld - Wolfram)', en: 'Factorial Properties (MathWorld - Wolfram)' },
			url: 'https://mathworld.wolfram.com/Factorial.html'
		}
	],
	contexts: [
		{
			title: { fr: 'Décomposition en facteurs premiers', en: 'Prime factorization' },
			body: {
				fr: `La démonstration repose sur une simplification algébrique. La durée de 6 semaines en secondes s'écrit $6 \\times 7 \\times 24 \\times 60 \\times 60$. Décomposons ces nombres pour retrouver les facteurs de 1 à 10 :\n\n$$\\text{Secondes} = 6 \\times 7 \\times (8 \\times 3) \\times (10 \\times 6) \\times (5 \\times 12)$$\n\nEn réorganisant, avec $12 = 3 \\times 4$ et $6 = 2 \\times 3$, on retrouve instantanément le produit strict :\n\n$$10! = 10 \\times 9 \\times 8 \\times 7 \\times 6 \\times 5 \\times 4 \\times 3 \\times 2 \\times 1 = 3\\,628\\,800\\ \\text{secondes}$$`,
				en: `The proof relies on algebraic simplification. The duration of 6 weeks in seconds is $6 \\times 7 \\times 24 \\times 60 \\times 60$. Decomposing these numbers recovers the factors from 1 to 10:\n\n$$\\text{Seconds} = 6 \\times 7 \\times (8 \\times 3) \\times (10 \\times 6) \\times (5 \\times 12)$$\n\nRearranging, with $12 = 3 \\times 4$ and $6 = 2 \\times 3$, one instantly recovers the exact product:\n\n$$10! = 10 \\times 9 \\times 8 \\times 7 \\times 6 \\times 5 \\times 4 \\times 3 \\times 2 \\times 1 = 3,628,800\\ \\text{seconds}$$`
			},
			external: false
		}
	]
};
