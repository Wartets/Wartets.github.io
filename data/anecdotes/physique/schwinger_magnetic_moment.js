export default {
	id: 'anecdote_schwinger_magnetic_moment',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Physique - Électrodynamique Quantique', en: 'Physics - Quantum Electrodynamics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `L'équation de Dirac prédisait originellement un facteur de Landé g exactement égal à 2 pour l'électron. En 1948, Julian Schwinger calcula la première correction radiative due aux fluctuations du vide quantique, prouvant que l'électron interagit avec son propre champ électromagnétique. Cette correction, gravée sur sa pierre tombale, constitue l'un des accords les plus précis entre théorie et expérience en physique moderne.`,
		en: `The Dirac equation originally predicted a Landé g-factor of exactly 2 for the electron. In 1948, Julian Schwinger calculated the first radiative correction due to quantum vacuum fluctuations, proving that the electron interacts with its own electromagnetic field. This correction, engraved on his tombstone, remains one of the most precise agreements between theory and experiment in modern physics.`
	},
	sources: [
		{
			name: { fr: 'On Quantum-Electrodynamics and the Magnetic Moment of the Electron (1948)', en: 'On Quantum-Electrodynamics and the Magnetic Moment of the Electron (1948)' },
			url: 'https://journals.aps.org/pr/abstract/10.1103/PhysRev.73.416'
		},
		{
			name: { fr: 'The anomalous magnetic moment of the muon in the Standard Model (2020)', en: 'The anomalous magnetic moment of the muon in the Standard Model (2020)' },
			url: 'https://arxiv.org/abs/2006.04822'
		}
	],
	contexts: [
		{
			title: { fr: 'Correction de vertex à une boucle et facteur de Landé', en: 'One-loop vertex correction and the Landé factor' },
			body: {
				fr: `En théorie des perturbations, la propagation d'un électron dans un champ électromagnétique externe peut être corrigée par des diagrammes de Feynman de plus en plus complexes. Le diagramme le plus simple au-delà de l'approximation de Dirac est le vertex à une boucle, où l'électron émet puis réabsorbe un photon virtuel.\n\nSchwinger calcula que cette correction modifie le moment magnétique anormal de l'électron selon :\n\n$$a_e = \\frac{g-2}{2} = \\frac{\\alpha}{2\\pi} \\approx 0,0011614$$\n\noù $\\alpha$ est la constante de structure fine. Les calculs contemporains, poussés jusqu'à cinq boucles et plus de 12 000 diagrammes distincts, atteignent un accord avec l'expérience à plus de dix chiffres significatifs, faisant de l'électrodynamique quantique la théorie physique la plus précisément vérifiée jamais élaborée.`,
				en: `In perturbation theory, an electron propagating in an external electromagnetic field can be corrected by increasingly complex Feynman diagrams. The simplest diagram beyond the Dirac approximation is the one-loop vertex, where the electron emits and reabsorbs a virtual photon.\n\nSchwinger calculated that this correction modifies the electron's anomalous magnetic moment according to:\n\n$$a_e = \\frac{g-2}{2} = \\frac{\\alpha}{2\\pi} \\approx 0.0011614$$\n\nwhere $\\alpha$ is the fine-structure constant. Contemporary calculations, pushed to five loops and over 12,000 distinct diagrams, achieve agreement with experiment to more than ten significant figures, making quantum electrodynamics the most precisely verified physical theory ever devised.`
			},
			external: false
		}
	]
};
