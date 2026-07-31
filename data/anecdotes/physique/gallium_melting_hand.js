export default {
	id: 'anecdote_gallium_melting_hand',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Physique de la Matière Condensée / Chimie', en: 'Condensed Matter Physics / Chemistry' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Les métaux sont généralement associés à des points de fusion très élevés, nécessitant des forges intenses pour être fondus. Le gallium, élément numéro 31 du tableau périodique, fait exception à la règle. Bien qu'il soit un métal solide et dur à température ambiante, son point de fusion est d'environ 29,76°C. Si vous prenez un morceau de gallium dans la paume de votre main, la chaleur naturelle de votre corps humain (environ 37°C) est largement suffisante pour briser son réseau cristallin et le transformer en une flaque de métal liquide brillant, semblable au mercure, mais non toxique.`,
		en: `Metals are generally associated with very high melting points, requiring intense forges to be melted. Gallium, element number 31 of the periodic table, is an exception. Although it is a hard solid metal at room temperature, its melting point is about 29.76°C. If you hold a piece of gallium in the palm of your hand, the natural heat of the human body (about 37°C) is more than enough to break its crystal lattice and turn it into a shiny liquid metal puddle, resembling mercury, but non-toxic.`
	},
	sources: [
		{
			name: { fr: 'Structure of Liquid Gallium from X-Ray Diffraction (A. Bizid et al., The Journal of Chemical Physics, 1980)', en: 'Structure of Liquid Gallium from X-Ray Diffraction (A. Bizid et al., The Journal of Chemical Physics, 1980)' },
			url: 'https://aip.scitation.org/doi/abs/10.1063/1.440268'
		}
	],
	contexts: [
		{
			title: { fr: 'Enthalpie de fusion et structure cristalline', en: 'Enthalpy of fusion and crystal structure' },
			body: {
				fr: `La faiblesse du point de fusion du gallium s'explique par sa structure cristalline orthorhombique très inhabituelle. Contrairement à la plupart des métaux qui forment des réseaux denses avec des liaisons métalliques uniformes, le gallium solide est constitué de paires discrètes de molécules diatomiques (Ga₂). L'énergie thermique nécessaire pour vaincre les forces intermoléculaires faibles entre ces paires (sans casser les liaisons covalentes intra-paires) est très basse. La transition de phase à pression constante nécessite un faible apport thermique $Q$ :\n\n$$Q = m \\cdot L_f$$\n\noù la chaleur latente de fusion $L_f$ du gallium est de seulement 80,4 kJ/kg.`,
				en: `Gallium's low melting point is explained by its highly unusual orthorhombic crystal structure. Unlike most metals, which form dense lattices with uniform metallic bonds, solid gallium consists of discrete pairs of diatomic molecules (Ga₂). The thermal energy needed to overcome the weak intermolecular forces between these pairs (without breaking the intra-pair covalent bonds) is very low. The phase transition at constant pressure requires only a small heat input $Q$:\n\n$$Q = m \\cdot L_f$$\n\nwhere gallium's latent heat of fusion $L_f$ is only 80.4 kJ/kg.`
			},
			external: false
		}
	]
};
