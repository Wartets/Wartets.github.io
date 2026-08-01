export default {
	id: 'anecdote_dna_length_human_body',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Biophysique Quantique', en: 'Quantum Biophysics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `L'empaquetage de l'information biologique frôle le miracle géométrique. Si l'on extrayait tout l'ADN contenu dans les milliards de cellules d'un seul corps humain pour le déplier bout à bout en un fil continu, sa longueur atteindrait environ deux fois le diamètre du système solaire, soit un aller-retour jusqu'à l'orbite de Pluton. Ce fil microscopique doit pourtant être enroulé et replié avec une précision absolue autour de protéines (les histones) pour tenir dans des noyaux cellulaires mesurant à peine un centième de millimètre de diamètre.`,
		en: `The packaging of biological information borders on a geometric miracle. If all the DNA contained in the billions of cells of a single human body were extracted and unfolded end to end into a continuous thread, its length would reach about twice the diameter of the Solar System, roughly a round trip to Pluto's orbit. Yet this microscopic thread must be wound and folded with absolute precision around proteins (histones) to fit inside cell nuclei barely a hundredth of a millimeter across.`
	},
	sources: [
		{
			name: { fr: 'Molecular Biology of the Cell, 4th edition (B. Alberts et al., Garland Science, 2002)', en: 'Molecular Biology of the Cell, 4th edition (B. Alberts et al., Garland Science, 2002)' },
			url: 'https://www.ncbi.nlm.nih.gov/books/NBK21054/'
		}
	],
	contexts: [
		{
			title: { fr: 'Empaquetage de la double hélice et distance de paires de bases', en: 'Double-helix packaging and base-pair spacing' },
			body: {
				fr: `La structure cristallographique de l'ADN-B indique qu'une paire de bases nucléotidiques occupe une longueur axiale de $\\Delta x = 0,34\\ \\text{nm}$. Le génome humain diploïde contient $N_b \\approx 6,4 \\times 10^9$ paires de bases. La longueur linéaire de l'ADN d'une seule cellule est $L_{cellule} = N_b \\times \\Delta x \\approx 2,17$ mètres. Le corps humain moyen comportant environ $C = 3 \\times 10^{13}$ cellules nucléées, la longueur totale s'écrit :\n\n$$L_{total} = L_{cellule} \\times C \\approx 2,17 \\times 3 \\cdot 10^{13} \\approx 6,5 \\times 10^{13}\\ \\text{mètres}$$\n\nSoit environ 65 milliards de kilomètres, environ 430 fois la distance Terre-Soleil.`,
				en: `The crystallographic structure of B-DNA shows that a nucleotide base pair occupies an axial length of $\\Delta x = 0.34\\ \\text{nm}$. The diploid human genome contains $N_b \\approx 6.4 \\times 10^9$ base pairs. The linear DNA length of a single cell is $L_{cell} = N_b \\times \\Delta x \\approx 2.17$ meters. With the average human body containing about $C = 3 \\times 10^{13}$ nucleated cells, the total length is:\n\n$$L_{total} = L_{cell} \\times C \\approx 2.17 \\times 3 \\cdot 10^{13} \\approx 6.5 \\times 10^{13}\\ \\text{meters}$$\n\nAbout 65 billion kilometers, roughly 430 times the Earth-Sun distance.`
			},
			external: false
		}
	]
};
