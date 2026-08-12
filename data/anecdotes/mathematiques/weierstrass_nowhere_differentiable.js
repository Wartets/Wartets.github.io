export default {
	id: 'anecdote_weierstrass_nowhere_differentiable',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Mathématiques / Analyse', en: 'Mathematics / Analysis' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Au XIXe siècle, les mathématiciens pensaient qu'une fonction continue devait forcément admettre une tangente en presque tout point, comme une courbe tracée sans lever le crayon. En 1872, Karl Weierstrass présente à l'Académie de Berlin une fonction qui brise cette intuition : elle est continue partout, mais dérivable nulle part, une courbe infiniment rugueuse à toutes les échelles d'observation, préfigurant les objets fractals étudiés un siècle plus tard.`,
		en: `In the 19th century, mathematicians believed a continuous function must have a tangent at almost every point, like a curve drawn without lifting the pen. In 1872, Karl Weierstrass presented to the Berlin Academy a function that shattered this intuition: it is continuous everywhere but differentiable nowhere, an infinitely rough curve at every scale of observation, foreshadowing the fractal objects studied a century later.`
	},
	sources: [
		{
			name: { fr: 'Can One Visualize a Continuous Nowhere Differentiable Function? (A. M. Bruckner, J. B. Bruckner, B. S. Thomson, The American Mathematical Monthly, 2023)', en: 'Can One Visualize a Continuous Nowhere Differentiable Function? (A. M. Bruckner, J. B. Bruckner, B. S. Thomson, The American Mathematical Monthly, 2023)' },
			url: 'https://doi.org/10.1080/00029890.2022.2154555'
		}
	],
	contexts: [
		{
			title: { fr: 'Une somme infinie d\'oscillations', en: 'An infinite sum of oscillations' },
			body: {
				fr: `La fonction de Weierstrass s'écrit comme une série infinie d'oscillations de fréquence croissante et d'amplitude décroissante :\n\n$$f(x) = \\sum_{n=0}^{\\infty} a^n \\cos(b^n \\pi x)$$\n\navec $0 < a < 1$, $b$ un entier impair, et $ab > 1 + \\frac{3\\pi}{2}$. La continuité découle de la convergence uniforme de la série, garantie par le critère de Weierstrass lui-même. Mais l'absence de dérivée en tout point vient du fait qu'à chaque échelle de zoom, de nouvelles oscillations de fréquence $b^n$ apparaissent, empêchant la courbe de se stabiliser localement en une droite tangente, aussi petit que soit l'intervalle considéré.`,
				en: `The Weierstrass function is written as an infinite series of oscillations of increasing frequency and decreasing amplitude:\n\n$$f(x) = \\sum_{n=0}^{\\infty} a^n \\cos(b^n \\pi x)$$\n\nwith $0 < a < 1$, $b$ an odd integer, and $ab > 1 + \\frac{3\\pi}{2}$. Continuity follows from the series' uniform convergence, guaranteed by the Weierstrass test itself. But the absence of a derivative at every point comes from the fact that at every zoom scale, new oscillations of frequency $b^n$ appear, preventing the curve from locally settling into a tangent line, no matter how small the interval considered.`
			},
			external: false
		}
	]
};
