export default {
	id: 'anecdote_ramanujan_hardy_partition',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Mathématiques - Théorie Analytique des Nombres', en: 'Mathematics - Analytic Number Theory' },
	scheduling: { type: 'annual', dates: ['12-22'] },
	content: (lang, year) => {
		const elapsed = year - 1918;
		return lang === 'fr'
			? `Compter le nombre de façons de décomposer un entier en somme d'entiers positifs devient un cauchemar combinatoire à mesure que ce nombre grandit : le nombre 200 possède déjà 3 972 999 029 388 partitions. En 1918, il y a désormais ${elapsed} ans, Srinivasa Ramanujan et G.H. Hardy publièrent une formule asymptotique spectaculaire permettant de calculer cette fonction avec une précision inouïe.`
			: `Counting the number of ways an integer can be decomposed into a sum of positive integers quickly becomes a combinatorial nightmare as the number grows: the number 200 alone has 3,972,999,029,388 partitions. In 1918, ${elapsed} years ago, Srinivasa Ramanujan and G.H. Hardy published a spectacular asymptotic formula allowing this function to be computed with astonishing precision.`;
	},
	sources: [
		{
			name: { fr: 'Asymptotic Formulae in Combinatory Analysis (1918)', en: 'Asymptotic Formulae in Combinatory Analysis (1918)' },
			url: 'https://londmathsoc.onlinelibrary.wiley.com/doi/10.1112/plms/s2-17.1.75'
		}
	],
	contexts: [
		{
			title: { fr: 'La méthode du cercle et le comportement asymptotique de p(n)', en: 'The circle method and the asymptotic behavior of p(n)' },
			body: {
				fr: `La fonction génératrice des partitions s'écrit comme un produit infini :\n\n$$\\sum_{n=0}^{\\infty} p(n)x^n = \\prod_{k=1}^{\\infty} \\frac{1}{1-x^k}$$\n\nHardy et Ramanujan durent évaluer une intégrale sur le cercle unité dont le contour porte une infinité dense de singularités, situées aux points rationnels $e^{2i\\pi p/q}$. Leur méthode, dite « méthode du cercle », consiste à découper ce contour en arcs majeurs et mineurs pour isoler la contribution dominante de chaque singularité.\n\nLe résultat obtenu est la formule asymptotique :\n\n$$p(n) \\sim \\frac{1}{4n\\sqrt{3}} \\exp\\left( \\pi \\sqrt{\\frac{2n}{3}} \\right) \\quad \\text{lorsque} \\quad n \\to \\infty$$\n\nQuelques années plus tard, Hans Rademacher perfectionna cette estimation en une série convergente exacte, transformant l'approximation en une formule fermée rigoureuse.`,
				en: `The generating function of partitions is written as an infinite product:\n\n$$\\sum_{n=0}^{\\infty} p(n)x^n = \\prod_{k=1}^{\\infty} \\frac{1}{1-x^k}$$\n\nHardy and Ramanujan had to evaluate an integral over the unit circle whose contour carries a dense infinity of singularities, located at the rational points $e^{2i\\pi p/q}$. Their approach, the "circle method", splits this contour into major and minor arcs to isolate the dominant contribution of each singularity.\n\nThe resulting asymptotic formula is:\n\n$$p(n) \\sim \\frac{1}{4n\\sqrt{3}} \\exp\\left( \\pi \\sqrt{\\frac{2n}{3}} \\right) \\quad \\text{as} \\quad n \\to \\infty$$\n\nA few years later, Hans Rademacher refined this estimate into an exact convergent series, turning the approximation into a rigorous closed form.`
			},
			external: false
		}
	]
};
