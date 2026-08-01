export default {
	id: 'anecdote_frog_magnetic_levitation',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Électromagnétisme Appliqué', en: 'Applied Electromagnetism' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1997, le physicien Andre Geim a réussi à faire léviter une grenouille vivante en laboratoire, sans aucun trucage ni métal implanté dans l'animal. Il a exploité le fait que l'eau, qui compose la majorité des êtres vivants, est une substance diamagnétique. Plongée dans un champ magnétique extrêmement puissant (environ 16 teslas, soit 300 000 fois le champ terrestre), l'eau repousse magnétiquement la source du champ. La force de répulsion a suffi à annuler la gravité. Geim est la seule personne au monde à avoir reçu à la fois le prix Ig Nobel (pour cette grenouille) et le prix Nobel de physique (pour le graphène).`,
		en: `In 1997, physicist Andre Geim managed to levitate a live frog in the laboratory, with no trickery and no metal implanted in the animal. He exploited the fact that water, which makes up most living organisms, is a diamagnetic substance. Immersed in an extremely powerful magnetic field (about 16 teslas, or 300,000 times Earth's field), water magnetically repels the field's source. The repulsive force was enough to cancel out gravity. Geim is the only person in the world to have received both the Ig Nobel Prize (for this frog) and the Nobel Prize in Physics (for graphene).`
	},
	sources: [
		{
			name: { fr: 'Of flying frogs and levitrons (M.V. Berry, A.K. Geim, European Journal of Physics, 1997)', en: 'Of flying frogs and levitrons (M.V. Berry, A.K. Geim, European Journal of Physics, 1997)' },
			url: 'https://iopscience.iop.org/article/10.1088/0143-0807/18/4/012'
		}
	],
	contexts: [
		{
			title: { fr: 'Susceptibilité diamagnétique et condition de lévitation', en: 'Diamagnetic susceptibility and the levitation condition' },
			body: {
				fr: `La force magnétique par unité de volume s'exerçant sur un matériau diamagnétique (susceptibilité $\\chi_m < 0$) dans un champ non uniforme $\\mathbf{B}$ est dirigée vers les zones de champ faible. La condition de lévitation nécessite que cette force compense exactement le poids (densité volumique de masse $\\rho$). L'équilibre critique s'écrit :\n\n$$F_z = \\frac{\\chi_m}{\\mu_0} B_z \\frac{\\partial B_z}{\\partial z} \\ge \\rho g$$\n\nPour l'eau, $\\chi_m \\approx -9 \\times 10^{-6}$, ce qui exige un produit extrêmement élevé du champ par son gradient, $B_z \\frac{\\partial B_z}{\\partial z} \\approx 1400\\ \\text{T}^2/\\text{m}$.`,
				en: `The magnetic force per unit volume acting on a diamagnetic material (susceptibility $\\chi_m < 0$) in a non-uniform field $\\mathbf{B}$ is directed toward regions of weaker field. Levitation requires this force to exactly balance weight (mass density $\\rho$). The critical equilibrium is:\n\n$$F_z = \\frac{\\chi_m}{\\mu_0} B_z \\frac{\\partial B_z}{\\partial z} \\ge \\rho g$$\n\nFor water, $\\chi_m \\approx -9 \\times 10^{-6}$, which requires an extremely high product of the field and its gradient, $B_z \\frac{\\partial B_z}{\\partial z} \\approx 1400\\ \\text{T}^2/\\text{m}$.`
			},
			external: false
		}
	]
};
