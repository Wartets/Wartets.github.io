export default {
	id: 'anecdote_quantum_zeno_effect_observation',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Mécanique Quantique', en: 'Quantum Mechanics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Le dicton populaire veut que l'eau qu'on regarde fixement ne bout jamais. En mécanique quantique, cette intuition devient une réalité expérimentale rigoureuse : l'effet Zénon quantique montre que mesurer très fréquemment l'état d'un système instable ralentit, voire fige, son évolution. Chaque observation force la fonction d'onde à se réinitialiser à son état initial, empêchant la transition de progresser. L'effet fut confirmé expérimentalement sur des ions de béryllium piégés en 1989.`,
		en: `The popular saying goes that a watched pot never boils. In quantum mechanics, this intuition becomes a rigorous experimental reality: the quantum Zeno effect shows that measuring the state of an unstable system very frequently slows, or even freezes, its evolution. Each observation forces the wave function to reset to its initial state, preventing the transition from progressing. The effect was experimentally confirmed on trapped beryllium ions in 1989.`
	},
	sources: [
		{
			name: { fr: 'The Zeno\'s paradox in quantum theory (B. Misra, E. C. G. Sudarshan, Journal of Mathematical Physics, 1977)', en: 'The Zeno\'s paradox in quantum theory (B. Misra, E. C. G. Sudarshan, Journal of Mathematical Physics, 1977)' },
			url: 'https://doi.org/10.1063/1.523304'
		}
	],
	contexts: [
		{
			title: { fr: 'Probabilité de survie et limite des mesures infinies', en: 'Survival probability and the limit of infinite measurements' },
			body: {
				fr: `Pour un système préparé dans l'état $|\\psi(0)\\rangle$, la probabilité de le retrouver inchangé après un court intervalle $\\Delta t$ s'écrit, au second ordre : $P(\\Delta t) \\approx 1 - \\frac{(\\Delta E)^2}{\\hbar^2}(\\Delta t)^2$, où $\\Delta E$ est l'écart-type de l'énergie. En répétant $n$ mesures sur un intervalle total $t$ fixé, avec $\\tau = t/n$, la probabilité de survie globale devient $P_{survie}(t) = \\left[P(t/n)\\right]^n$. Comme cette dégradation évolue en $t^2$ et non en $t$, la limite $n \\to \\infty$ donne $\\lim_{n\\to\\infty} P_{survie}(t) = 1$ : des mesures infiniment fréquentes gèlent totalement l'évolution du système.`,
				en: `For a system prepared in state $|\\psi(0)\\rangle$, the probability of finding it unchanged after a short interval $\\Delta t$ is, to second order: $P(\\Delta t) \\approx 1 - \\frac{(\\Delta E)^2}{\\hbar^2}(\\Delta t)^2$, where $\\Delta E$ is the energy's standard deviation. Repeating $n$ measurements over a fixed total interval $t$, with $\\tau = t/n$, the overall survival probability becomes $P_{survival}(t) = \\left[P(t/n)\\right]^n$. Because this decay scales as $t^2$ rather than $t$, the limit $n \\to \\infty$ gives $\\lim_{n\\to\\infty} P_{survival}(t) = 1$: infinitely frequent measurements completely freeze the system's evolution.`
			},
			external: false
		}
	]
};
