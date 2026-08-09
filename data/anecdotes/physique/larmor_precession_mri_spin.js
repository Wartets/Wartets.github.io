export default {
	id: 'anecdote_larmor_precession_mri_spin',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Mécanique Quantique Appliquée', en: 'Applied Quantum Mechanics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `L'Imagerie par Résonance Magnétique, l'un des outils de diagnostic médical non invasifs les plus puissants des hôpitaux modernes, exploite directement une propriété abstraite de la mécanique quantique. Les protons des molécules d'eau du corps humain possèdent une propriété intrinsèque appelée le spin. Soumis au champ magnétique intense du tunnel de l'IRM, l'axe de ce spin est contraint d'entrer dans un mouvement de toupie autour des lignes de champ : c'est la précession de Larmor. En émettant une onde radio exactement à la fréquence de cette précession, la machine induit une résonance qui permet de cartographier l'intérieur du corps sans aucune irradiation ionisante.`,
		en: `Magnetic Resonance Imaging, one of the most powerful non-invasive diagnostic tools in modern hospitals, directly exploits an abstract property of quantum mechanics. The protons in the water molecules of the human body possess an intrinsic property called spin. Subjected to the intense magnetic field of the MRI tunnel, the axis of this spin is forced into a gyroscopic precession around the field lines: this is Larmor precession. By emitting a radio wave at exactly the frequency of this precession, the machine induces a resonance that maps the inside of the body without any ionizing radiation.`
	},
	sources: [
		{
			name: { fr: 'On the Theory of the Magnetic Influence on Spectra (1897)', en: 'On the Theory of the Magnetic Influence on Spectra (1897)' },
			url: 'https://doi.org/10.1080/14786449708621095'
		}
	],
	contexts: [
		{
			title: { fr: 'Dynamique du spin et équations de Bloch', en: 'Spin dynamics and the Bloch equations' },
			body: {
				fr: `Le moment magnétique du proton est directement proportionnel à son spin quantique, $\\vec{\\mu} = \\gamma \\vec{S}$, où $\\gamma$ est le rapport gyromagnétique. En présence d'un champ magnétique statique intense $\\vec{B}_0 = B_0 \\hat{k}$, l'hamiltonien d'interaction de type Zeeman impose au spin d'évoluer selon l'équation de Heisenberg, ce qui fait précesser l'aimantation autour de $\\vec{B}_0$ à la fréquence angulaire de Larmor :\n\n$$\\omega_L = \\gamma B_0 = \\frac{g_p \\mu_N}{\\hbar} B_0$$\n\nL'appareil d'IRM applique ensuite une brève impulsion radiofréquence transversale $B_1$, calibrée exactement à cette fréquence de résonance, qui bascule temporairement l'aimantation hors de l'équilibre. Le retour progressif à l'équilibre, la relaxation, induit par la loi de Faraday un signal électrique mesurable dans les bobines réceptrices, dont les temps caractéristiques $T_1$ et $T_2$ diffèrent selon la nature des tissus biologiques traversés, permettant leur distinction sur l'image finale.`,
				en: `A proton's magnetic moment is directly proportional to its quantum spin, $\\vec{\\mu} = \\gamma \\vec{S}$, where $\\gamma$ is the gyromagnetic ratio. In the presence of a strong static magnetic field $\\vec{B}_0 = B_0 \\hat{k}$, the Zeeman-type interaction Hamiltonian forces the spin to evolve according to the Heisenberg equation, causing the magnetization to precess around $\\vec{B}_0$ at the Larmor angular frequency:\n\n$$\\omega_L = \\gamma B_0 = \\frac{g_p \\mu_N}{\\hbar} B_0$$\n\nThe MRI scanner then applies a brief transverse radiofrequency pulse $B_1$, tuned exactly to this resonance frequency, which temporarily tips the magnetization out of equilibrium. The gradual return to equilibrium, relaxation, induces, via Faraday's law, a measurable electrical signal in the receiver coils, whose characteristic times $T_1$ and $T_2$ differ depending on the type of biological tissue traversed, allowing tissues to be distinguished in the final image.`
			},
			external: false
		}
	]
};
