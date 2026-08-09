export default {
	id: 'anecdote_aharonov_bohm_topology',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Mécanique Quantique / Électrodynamique', en: 'Quantum Mechanics / Electrodynamics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En physique classique, les potentiels électromagnétiques vecteur et scalaire ne sont que de simples outils de calcul, seuls les champs électrique et magnétique ayant une réalité physique mesurable. L'effet Aharonov-Bohm, théorisé en 1959, prouve le contraire en mécanique quantique : un faisceau d'électrons séparé en deux et contournant un solénoïde infiniment long subit un déphasage mesurable, bien que les électrons évoluent dans une région où le champ magnétique est strictement nul.`,
		en: `In classical physics, the electromagnetic vector and scalar potentials are considered mere mathematical bookkeeping tools, only the electric and magnetic fields having measurable physical reality. The Aharonov-Bohm effect, theorized in 1959, proves the opposite in quantum mechanics: an electron beam split in two and routed around an infinitely long solenoid undergoes a measurable phase shift, even though the electrons travel through a region where the magnetic field is strictly zero.`
	},
	sources: [
		{
			name: { fr: 'Significance of Electromagnetic Potentials in the Quantum Theory (1959)', en: 'Significance of Electromagnetic Potentials in the Quantum Theory (1959)' },
			url: 'https://journals.aps.org/pr/abstract/10.1103/PhysRev.115.485'
		},
		{
			name: { fr: 'Evidence for Aharonov-Bohm effect with magnetic field completely shielded from electron wave (1986)', en: 'Evidence for Aharonov-Bohm effect with magnetic field completely shielded from electron wave (1986)' },
			url: 'https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.56.792'
		}
	],
	contexts: [
		{
			title: { fr: 'Déphasage quantique et topologie de l\'espace', en: 'Quantum phase shift and the topology of space' },
			body: {
				fr: `Dans un montage interférométrique de type fentes de Young enveloppant un solénoïde, le couplage minimal introduit le potentiel vecteur $\\mathbf{A}$ directement dans l'hamiltonien quantique :\n\n$$\\hat{H} = \\frac{1}{2m} (\\hat{\\mathbf{p}} - q\\mathbf{A})^2$$\n\nLa différence de phase accumulée par les deux chemins possibles de l'électron s'écrit :\n\n$$\\Delta \\varphi = \\frac{e}{\\hbar} \\oint_C \\mathbf{A} \\cdot d\\mathbf{l} = \\frac{e}{\\hbar} \\iint_S (\\nabla \\times \\mathbf{A}) \\cdot d\\mathbf{S} = \\frac{e}{\\hbar} \\Phi_B$$\n\nCe déphasage ne dépend que du flux magnétique enclos $\\Phi_B$, et non du champ local ressenti par les électrons eux-mêmes : le potentiel vecteur affecte la fonction d'onde de manière non locale et topologique, propriété confirmée expérimentalement avec une précision remarquable par holographie électronique en 1986.`,
				en: `In a double-slit-style interferometric setup enclosing a solenoid, minimal coupling introduces the vector potential $\\mathbf{A}$ directly into the quantum Hamiltonian:\n\n$$\\hat{H} = \\frac{1}{2m} (\\hat{\\mathbf{p}} - q\\mathbf{A})^2$$\n\nThe phase difference accumulated along the electron's two possible paths is given by:\n\n$$\\Delta \\varphi = \\frac{e}{\\hbar} \\oint_C \\mathbf{A} \\cdot d\\mathbf{l} = \\frac{e}{\\hbar} \\iint_S (\\nabla \\times \\mathbf{A}) \\cdot d\\mathbf{S} = \\frac{e}{\\hbar} \\Phi_B$$\n\nThis phase shift depends only on the enclosed magnetic flux $\\Phi_B$, not on the local field experienced by the electrons themselves: the vector potential affects the wavefunction in a non-local, topological way, a property confirmed experimentally with remarkable precision by electron holography in 1986.`
			},
			external: false
		}
	]
};
