export default {
	id: 'anecdote_lorenz_butterfly_effect_chaos',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Physique / Théorie du Chaos', en: 'Physics / Chaos Theory' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1961, le météorologue Edward Lorenz relance une simulation numérique de convection atmosphérique en réintroduisant une valeur intermédiaire arrondie à trois décimales au lieu de six. Le résultat diverge radicalement de la simulation initiale en quelques jours simulés. Lorenz venait de découvrir, presque par accident, la sensibilité extrême aux conditions initiales des systèmes chaotiques, popularisée plus tard sous le nom d'« effet papillon ».`,
		en: `In 1961, meteorologist Edward Lorenz restarted a numerical simulation of atmospheric convection by re-entering an intermediate value rounded to three decimal places instead of six. The result diverged radically from the original simulation within a few simulated days. Lorenz had just discovered, almost by accident, the extreme sensitivity to initial conditions of chaotic systems, later popularized as the "butterfly effect".`
	},
	sources: [
		{
			name: { fr: 'Deterministic Nonperiodic Flow (E. N. Lorenz, Journal of the Atmospheric Sciences, 1963)', en: 'Deterministic Nonperiodic Flow (E. N. Lorenz, Journal of the Atmospheric Sciences, 1963)' },
			url: 'https://doi.org/10.1175/1520-0469(1963)020%3C0130:DNF%3E2.0.CO;2'
		}
	],
	contexts: [
		{
			title: { fr: 'Les équations de Lorenz et l\'attracteur étrange', en: 'The Lorenz equations and the strange attractor' },
			body: {
				fr: `Le modèle simplifié de convection de Lorenz réduit les équations de Navier-Stokes à trois variables couplées non linéaires :\n\n$$\\dot{x} = \\sigma(y - x), \\qquad \\dot{y} = x(\\rho - z) - y, \\qquad \\dot{z} = xy - \\beta z$$\n\nPour les paramètres classiques $\\sigma = 10$, $\\rho = 28$, $\\beta = 8/3$, les trajectoires ne convergent ni vers un point fixe ni vers un cycle périodique, mais s'enroulent indéfiniment autour de deux lobes selon une structure fractale : l'attracteur de Lorenz, la première image visuelle célèbre du chaos déterministe.`,
				en: `Lorenz's simplified convection model reduces the Navier-Stokes equations to three coupled nonlinear variables:\n\n$$\\dot{x} = \\sigma(y - x), \\qquad \\dot{y} = x(\\rho - z) - y, \\qquad \\dot{z} = xy - \\beta z$$\n\nFor the classic parameters $\\sigma = 10$, $\\rho = 28$, $\\beta = 8/3$, trajectories converge neither to a fixed point nor to a periodic cycle, but wind indefinitely around two lobes in a fractal structure: the Lorenz attractor, the first famous visual image of deterministic chaos.`
			},
			external: false
		}
	]
};
