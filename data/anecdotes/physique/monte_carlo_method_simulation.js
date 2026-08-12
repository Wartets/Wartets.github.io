export default {
	id: 'anecdote_monte_carlo_method_simulation',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Physique Statistique / Simulation', en: 'Statistical Physics / Simulation' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `À la fin des années 1940, lors du projet Manhattan, le mathématicien Stanislaw Ulam se remettait d'une maladie en jouant au solitaire. Il se demanda quelle était la probabilité mathématique exacte de réussir son jeu. Constatant que l'approche analytique combinatoire était presque impossible à résoudre, il réalisa qu'il suffisait de jouer des centaines de parties virtuellement et d'en faire la moyenne. Avec John von Neumann et Nicholas Metropolis, il formalisa cette idée : utiliser des nombres aléatoires pour résoudre des équations déterministes. Nommée « Méthode de Monte-Carlo » en référence aux casinos, cette technique est aujourd'hui le socle des simulations en physique nucléaire, en dynamique des fluides et en mathématiques financières.`,
		en: `In the late 1940s, during the Manhattan Project, mathematician Stanislaw Ulam was recovering from an illness by playing solitaire. He wondered what the exact mathematical probability of winning was. Realizing that the combinatorial analytical approach was nearly impossible to solve, he understood that it was enough to play hundreds of virtual games and average the outcome. With John von Neumann and Nicholas Metropolis, he formalized this idea: using random numbers to solve deterministic equations. Named the "Monte Carlo Method" after the casinos, this technique is today the backbone of simulations in nuclear physics, fluid dynamics, and financial mathematics.`
	},
	sources: [
		{
			name: { fr: 'The Monte Carlo Method (N. Metropolis, S. Ulam, Journal of the American Statistical Association, 1949)', en: 'The Monte Carlo Method (N. Metropolis, S. Ulam, Journal of the American Statistical Association, 1949)' },
			url: 'https://www.tandfonline.com/doi/abs/10.1080/01621459.1949.10483310'
		}
	],
	contexts: [
		{
			title: { fr: 'Théorème central limite et intégration stochastique', en: 'Central limit theorem and stochastic integration' },
			body: {
				fr: `En analyse numérique classique, comme la méthode des trapèzes, l'intégration d'une fonction à $d$ dimensions souffre de la « malédiction de la dimensionnalité », l'erreur décroissant en $O(N^{-2/d})$. L'approche de Monte-Carlo transforme l'intégrale en une espérance mathématique en tirant $N$ variables aléatoires $X_i$ uniformément réparties :\n\n$$\\int_V f(x) dx \\approx \\frac{V}{N} \\sum_{i=1}^N f(X_i)$$\n\nSelon le Théorème Central Limite, la variance de cette estimation est proportionnelle à $1/N$. L'erreur statistique décroît donc toujours en $O(1/\\sqrt{N})$, de manière totalement indépendante du nombre de dimensions du problème physique étudié.`,
				en: `In classical numerical analysis, such as the trapezoidal method, integrating a function over $d$ dimensions suffers from the "curse of dimensionality", with error decreasing as $O(N^{-2/d})$. The Monte Carlo approach turns the integral into a mathematical expectation by drawing $N$ uniformly distributed random variables $X_i$:\n\n$$\\int_V f(x) dx \\approx \\frac{V}{N} \\sum_{i=1}^N f(X_i)$$\n\nBy the Central Limit Theorem, the variance of this estimate is proportional to $1/N$. The statistical error therefore always decreases as $O(1/\\sqrt{N})$, entirely independent of the number of dimensions of the physical problem studied.`
			},
			external: false
		}
	]
};
