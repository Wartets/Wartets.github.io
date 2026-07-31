export default {
	id: 'anecdote_alpher_bethe_gamow_paper',
	enabled: true,
	priority: 5,
	addedDate: '2026-07-31',
	domain: { fr: 'Cosmologie - Nucléosynthèse Primordiale', en: 'Cosmology - Primordial Nucleosynthesis' },
	scheduling: { type: 'annual', dates: ['04-01'] },
	content: (lang, year) => {
		const elapsed = year - 1948;
		return lang === 'fr'
			? `L'un des articles fondateurs de la cosmologie moderne, expliquant la création des éléments légers lors du Big Bang, fut rédigé par Ralph Alpher et son directeur de thèse George Gamow, il y a désormais ${elapsed} ans. Gamow, réputé pour son humour facétieux, ajouta arbitrairement le nom de son ami Hans Bethe (qui n'avait pas participé aux travaux) à la liste des auteurs, uniquement pour former un jeu de mots avec les trois premières lettres de l'alphabet grec : Alpha, Beta, Gamma.`
			: `One of modern cosmology's founding papers, explaining the creation of light elements during the Big Bang, was written by Ralph Alpher and his thesis advisor George Gamow, ${elapsed} years ago. Gamow, known for his mischievous humor, arbitrarily added the name of his friend Hans Bethe (who had not taken part in the work) to the author list, purely to form a pun with the first three letters of the Greek alphabet: Alpha, Beta, Gamma.`;
	},
	sources: [
		{
			name: { fr: 'The Origin of Chemical Elements (1948)', en: 'The Origin of Chemical Elements (1948)' },
			url: 'https://journals.aps.org/pr/abstract/10.1103/PhysRev.73.803'
		}
	],
	contexts: [
		{
			title: { fr: 'Nucléosynthèse du Big Bang (BBN)', en: 'Big Bang Nucleosynthesis (BBN)' },
			body: {
				fr: `L'article original propose un modèle (surnommé « Ylem ») où les captures neutroniques successives, dans l'univers primordial extrêmement chaud et dense, forgent progressivement les noyaux légers. L'évolution de l'abondance isotopique $X_i$ obéit à une équation différentielle couplée :\n\n$$\\frac{dX_i}{dt} = \\sum_{j,k} Y_j Y_k \\langle \\sigma v \\rangle_{j,k \\to i} - X_i \\sum_l Y_l \\langle \\sigma v \\rangle_{i,l \\to \\dots}$$\n\nL'article commettait cependant une erreur pour les éléments plus lourds que le lithium : l'absence de noyaux stables de masse 5 et 8 constitue un goulot d'étranglement infranchissable dans les conditions d'expansion rapide de l'univers primordial, empêchant la nucléosynthèse des éléments lourds. Il faudra attendre les travaux ultérieurs sur la nucléosynthèse stellaire pour comprendre comment le carbone et les éléments plus lourds se forment réellement, à l'intérieur des étoiles.`,
				en: `The original paper proposes a model (nicknamed "Ylem") in which successive neutron captures, in the extremely hot and dense primordial universe, progressively forge the light nuclei. The evolution of isotopic abundance $X_i$ obeys a coupled differential equation:\n\n$$\\frac{dX_i}{dt} = \\sum_{j,k} Y_j Y_k \\langle \\sigma v \\rangle_{j,k \\to i} - X_i \\sum_l Y_l \\langle \\sigma v \\rangle_{i,l \\to \\dots}$$\n\nThe paper did, however, contain an error regarding elements heavier than lithium: the absence of stable nuclei of mass 5 and 8 forms an insurmountable bottleneck under the rapid expansion conditions of the primordial universe, preventing heavy-element nucleosynthesis there. It took later work on stellar nucleosynthesis to understand how carbon and heavier elements actually form, inside stars.`
			},
			external: false
		}
	]
};
