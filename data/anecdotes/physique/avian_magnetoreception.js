export default {
	id: 'anecdote_avian_magnetoreception',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Physique - Biophysique Quantique', en: 'Physics - Quantum Biophysics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Le rouge-gorge familier s'oriente lors de ses migrations grâce à une boussole interne exploitant l'intrication quantique de paires de radicaux. Le paradoxe physique réside dans le fait que cette intrication est maintenue à température ambiante, dans un milieu biologique bruyant, pendant des dizaines de microsecondes, une cohérence que les physiciens peinent à reproduire en laboratoire dans des conditions cryogéniques.`,
		en: `The European robin orients itself during migration using an internal compass exploiting the quantum entanglement of radical pairs. The physical paradox lies in the fact that this entanglement is maintained at room temperature, in a noisy biological medium, for tens of microseconds, a coherence time physicists struggle to reproduce in the laboratory under cryogenic conditions.`
	},
	sources: [
		{
			name: { fr: 'Chemical magnetoreception in birds: The radical pair mechanism (2016)', en: 'Chemical magnetoreception in birds: The radical pair mechanism (2016)' },
			url: 'https://www.pnas.org/doi/10.1073/pnas.0711968106'
		},
		{
			name: { fr: 'Quantum Biology (Nature Physics, 2013)', en: 'Quantum Biology (Nature Physics, 2013)' },
			url: 'https://www.nature.com/articles/nphys2474'
		}
	],
	contexts: [
		{
			title: { fr: 'Dynamique de spin et mécanisme des paires de radicaux', en: 'Spin dynamics and the radical pair mechanism' },
			body: {
				fr: `Le mécanisme repose sur une protéine de la rétine, le cryptochrome. Un photon incident y crée une paire électron-trou spatialement séparée mais intriquée, dans un état singulet initial.\n\nCette paire évolue sous un hamiltonien de spin couplant l'interaction Zeeman (le champ magnétique terrestre) et l'interaction hyperfine (les noyaux atomiques environnants) :\n\n$$\\hat{H} = \\mu_B \\vec{B}_0 \\cdot (\\mathbf{g}_1 \\hat{S}_1 + \\mathbf{g}_2 \\hat{S}_2) + \\hat{S}_1 \\cdot \\mathbf{A}_1 \\cdot \\hat{I}_1 + \\dots$$\n\nLa recombinaison finale de la paire, asymétrique entre l'état singulet et l'état triplet selon l'orientation du champ, génère un signal biochimique directionnel exploitable par l'oiseau.`,
				en: `The mechanism relies on a retinal protein, cryptochrome. An incident photon creates a spatially separated but entangled electron-hole pair, in an initial singlet state.\n\nThis pair evolves under a spin Hamiltonian coupling the Zeeman interaction (Earth's magnetic field) and the hyperfine interaction (surrounding atomic nuclei):\n\n$$\\hat{H} = \\mu_B \\vec{B}_0 \\cdot (\\mathbf{g}_1 \\hat{S}_1 + \\mathbf{g}_2 \\hat{S}_2) + \\hat{S}_1 \\cdot \\mathbf{A}_1 \\cdot \\hat{I}_1 + \\dots$$\n\nThe pair's final recombination, asymmetric between the singlet and triplet states depending on the field orientation, generates a directional biochemical signal the bird can exploit.`
			},
			external: false
		}
	]
};
