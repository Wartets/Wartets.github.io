export default {
	id: 'anecdote_ckm_matrix_cp_violation',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Physique des Particules - Modèle Standard', en: 'Particle Physics - Standard Model' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `La raison pour laquelle l'univers actuel est constitué de matière, alors que l'antimatière a presque totalement disparu peu après le Big Bang, trouve une partie de son explication dans une simple matrice 3×3. La matrice CKM décrit le mélange des saveurs de quarks sous l'interaction faible. Pour qu'elle introduise une phase irréductible brisant la symétrie CP, condition nécessaire à l'asymétrie matière-antimatière, il est mathématiquement impératif qu'il existe au moins trois générations de quarks, prédisant ainsi l'existence des quarks top et bottom bien avant leur découverte.`,
		en: `The reason today's universe is made of matter, while antimatter almost entirely vanished shortly after the Big Bang, is partly explained by a simple 3×3 matrix. The CKM matrix describes the mixing of quark flavors under the weak interaction. For it to introduce an irreducible phase breaking Charge-Parity (CP) symmetry, a necessary condition for matter-antimatter asymmetry, it is mathematically required that at least three generations of quarks exist, thereby predicting the top and bottom quarks well before their discovery.`
	},
	sources: [
		{
			name: { fr: 'CP Violation in the Renormalizable Theory of Weak Interaction (1973)', en: 'CP Violation in the Renormalizable Theory of Weak Interaction (1973)' },
			url: 'https://academic.oup.com/ptp/article/49/2/652/1923058'
		}
	],
	contexts: [
		{
			title: { fr: 'Mélange des quarks et matrice unitaire complexe', en: 'Quark mixing and the complex unitary matrix' },
			body: {
				fr: `Les états propres de l'interaction faible des quarks de type down ($d, s, b$) ne coïncident pas exactement avec leurs états propres de masse. La matrice CKM relie ces deux bases par une transformation unitaire complexe.\n\nSa paramétrisation de Wolfenstein met en évidence la hiérarchie des mélanges en fonction du paramètre de Cabibbo $\\lambda \\approx 0,22$ :\n\n$$\\begin{pmatrix} V_{ud} & V_{us} & V_{ub} \\\\ V_{cd} & V_{cs} & V_{cb} \\\\ V_{td} & V_{ts} & V_{tb} \\end{pmatrix} \\approx \\begin{pmatrix} 1-\\lambda^2/2 & \\lambda & A\\lambda^3(\\rho-i\\eta) \\\\ -\\lambda & 1-\\lambda^2/2 & A\\lambda^2 \\\\ A\\lambda^3(1-\\rho-i\\eta) & -A\\lambda^2 & 1 \\end{pmatrix}$$\n\nLe paramètre imaginaire $i\\eta$ est précisément la source de la violation CP. Avec seulement deux générations de quarks, une telle matrice ne pourrait comporter de phase physique irréductible : la troisième génération est mathématiquement indispensable.`,
				en: `The weak-interaction eigenstates of the down-type quarks ($d, s, b$) do not exactly coincide with their mass eigenstates. The CKM matrix relates these two bases through a complex unitary transformation.\n\nIts Wolfenstein parametrization highlights the hierarchy of mixings in terms of the Cabibbo parameter $\\lambda \\approx 0.22$:\n\n$$\\begin{pmatrix} V_{ud} & V_{us} & V_{ub} \\\\ V_{cd} & V_{cs} & V_{cb} \\\\ V_{td} & V_{ts} & V_{tb} \\end{pmatrix} \\approx \\begin{pmatrix} 1-\\lambda^2/2 & \\lambda & A\\lambda^3(\\rho-i\\eta) \\\\ -\\lambda & 1-\\lambda^2/2 & A\\lambda^2 \\\\ A\\lambda^3(1-\\rho-i\\eta) & -A\\lambda^2 & 1 \\end{pmatrix}$$\n\nThe imaginary parameter $i\\eta$ is precisely the source of CP violation. With only two quark generations, such a matrix could not carry an irreducible physical phase: the third generation is mathematically indispensable.`
			},
			external: false
		}
	]
};
