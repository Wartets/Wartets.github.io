export default {
	id: 'anecdote_ramanujan_constant_almost_integer',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Théorie Analytique des Nombres', en: 'Analytic Number Theory' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Il existe un nombre dans l'univers mathématique qui ressemble à un canular parfait. Si l'on prend le nombre irrationnel $e$, qu'on l'élève à la puissance $\\pi$ multiplié par la racine carrée de 163, la calculatrice affiche : 262 537 412 640 768 743,99999999999925... Ce nombre possède une succession ahurissante de 12 neufs après la virgule, donnant l'illusion trompeuse qu'il s'agit d'un entier exact. Bien qu'étudié initialement par Charles Hermite, il est souvent attribué au génie de l'arithmétique indien Srinivasa Ramanujan.`,
		en: `There exists a number in the mathematical universe that resembles a perfect hoax. Taking the irrational number $e$ and raising it to the power of $\\pi$ times the square root of 163, a calculator displays: 262,537,412,640,768,743.99999999999925... This number carries an astonishing run of 12 nines after the decimal point, giving the misleading illusion of being an exact integer. Although first studied by French mathematician Charles Hermite, it is often attributed to the arithmetical genius of Srinivasa Ramanujan.`
	},
	sources: [
		{
			name: { fr: 'Ramanujan Constant (MathWorld - Wolfram)', en: 'Ramanujan Constant (MathWorld - Wolfram)' },
			url: 'https://mathworld.wolfram.com/RamanujanConstant.html'
		}
	],
	contexts: [
		{
			title: { fr: 'Nombres de Heegner et Invariant J', en: 'Heegner numbers and the J-invariant' },
			body: {
				fr: `Ce « miracle » numérique s'explique par l'étude de la fonction invariante modulaire $j(\\tau)$. Le nombre 163 est le plus grand des neuf nombres de Heegner (des entiers $d$ tels que le corps quadratique imaginaire $\\mathbb{Q}(\\sqrt{-d})$ possède un nombre de classes égal à 1). Pour de telles valeurs, $j\\left(\\frac{1+i\\sqrt{d}}{2}\\right)$ s'avère être un entier exact.\n\nLe développement asymptotique de Fourier de la fonction s'écrit (avec $q = e^{2i\\pi\\tau}$) :\n\n$$j(\\tau) = \\frac{1}{q} + 744 + 196884q + \\mathcal{O}(q^2)$$\n\nEn posant $\\tau = \\frac{1+i\\sqrt{163}}{2}$, le terme $1/q$ correspond très exactement à $-e^{\\pi\\sqrt{163}}$. Le reste de la série convergente $196884q$ devenant extrêmement petit (car $q$ est proche de zéro), l'expression principale est mathématiquement contrainte de frôler un entier.`,
				en: `This numerical "miracle" is explained by the modular invariant function $j(\\tau)$. The number 163 is the largest of the nine Heegner numbers (integers $d$ such that the imaginary quadratic field $\\mathbb{Q}(\\sqrt{-d})$ has class number 1). For such values, $j\\left(\\frac{1+i\\sqrt{d}}{2}\\right)$ turns out to be an exact integer.\n\nThe asymptotic Fourier expansion of the function is (with $q = e^{2i\\pi\\tau}$):\n\n$$j(\\tau) = \\frac{1}{q} + 744 + 196884q + \\mathcal{O}(q^2)$$\n\nSetting $\\tau = \\frac{1+i\\sqrt{163}}{2}$, the term $1/q$ corresponds almost exactly to $-e^{\\pi\\sqrt{163}}$. Since the rest of the convergent series $196884q$ becomes extremely small (as $q$ is close to zero), the leading expression is mathematically forced to nearly hit an integer.`
			},
			external: false
		}
	]
};
