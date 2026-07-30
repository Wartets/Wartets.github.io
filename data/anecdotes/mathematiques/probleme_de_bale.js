export default {
	id: 'anecdote_probleme_de_bale',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-30',
	domain: { fr: 'Mathématiques - Analyse', en: 'Mathematics - Analysis' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1735, Leonhard Euler résout le problème de Bâle, ouvert depuis près d'un siècle, en démontrant que la somme des inverses des carrés de tous les entiers naturels converge exactement vers π²/6.`,
		en: `In 1735, Leonhard Euler solved the Basel problem, open for nearly a century, by proving that the sum of the reciprocals of the squares of all natural numbers converges exactly to π²/6.`
	},
	sources: [
		{
			name: { fr: 'MacTutor History of Mathematics', en: 'MacTutor History of Mathematics' },
			url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Euler/'
		}
	],
	contexts: [
		{
			title: { fr: "La démonstration originale d'Euler", en: "Euler's original proof" },
			body: {
				fr: `Euler part du développement en produit infini de la fonction sinus cardinal normalisée :\n\n$$\\frac{\\sin(\\pi x)}{\\pi x} = \\prod_{n=1}^{\\infty}\\left(1 - \\frac{x^2}{n^2}\\right)$$\n\nEn développant ce produit et en comparant le coefficient du terme en $x^2$ avec celui du développement en série de Taylor du sinus, il obtient :\n\n$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$\n\nCe résultat avait résisté aux tentatives de Jakob Bernoulli et de son frère Johann. Il constitue le premier cas particulier connu de la fonction zêta de Riemann, $\\zeta(2)$, et a ouvert la voie au calcul de $\\zeta(2n)$ pour tout entier positif $n$, chacun s'exprimant comme un multiple rationnel de $\\pi^{2n}$.`,
				en: `Euler starts from the infinite product expansion of the normalized sinc function:\n\n$$\\frac{\\sin(\\pi x)}{\\pi x} = \\prod_{n=1}^{\\infty}\\left(1 - \\frac{x^2}{n^2}\\right)$$\n\nBy expanding this product and comparing the coefficient of the $x^2$ term with that of the Taylor series of sine, he obtains:\n\n$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$\n\nThis result had resisted the attempts of Jakob Bernoulli and his brother Johann. It is the first known particular case of the Riemann zeta function, $\\zeta(2)$, and paved the way for computing $\\zeta(2n)$ for every positive integer $n$, each expressible as a rational multiple of $\\pi^{2n}$.`
			},
			external: false
		}
	]
};
