export default {
	id: 'anecdote_bekenstein_hawking_entropy',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Physique - Relativité Générale / Thermodynamique', en: 'Physics - General Relativity / Thermodynamics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En thermodynamique classique, l'entropie d'un système est proportionnelle à son volume. En 1973, Jacob Bekenstein et Stephen Hawking démontrèrent pourtant que l'entropie d'un trou noir est proportionnelle à l'aire de son horizon des événements, et non à son volume. Cette découverte contre-intuitive stipule que la quantité maximale d'information qu'une région de l'espace peut contenir dépend de sa surface frontalière, fondement originel du « principe holographique ».`,
		en: `In classical thermodynamics, a system's entropy is proportional to its volume. In 1973, Jacob Bekenstein and Stephen Hawking nonetheless showed that a black hole's entropy is proportional to the area of its event horizon, not its volume. This counterintuitive discovery states that the maximum amount of information a region of space can contain depends on its bounding surface, the original foundation of the "holographic principle".`
	},
	sources: [
		{
			name: { fr: 'Black Holes and Entropy (1973)', en: 'Black Holes and Entropy (1973)' },
			url: 'https://journals.aps.org/prd/abstract/10.1103/PhysRevD.7.2333'
		},
		{
			name: { fr: 'Particle Creation by Black Holes (1975)', en: 'Particle Creation by Black Holes (1975)' },
			url: 'https://link.springer.com/article/10.1007/BF02345020'
		}
	],
	contexts: [
		{
			title: { fr: 'Dérivation de l\'entropie et rayonnement de Hawking', en: 'Deriving the entropy and Hawking radiation' },
			body: {
				fr: `Le paradoxe de l'information trouve son origine dans une similarité frappante entre la seconde loi de la thermodynamique et le théorème de l'aire de Hawking, selon lequel l'aire d'un trou noir ne peut jamais décroître en physique classique.\n\nCette analogie mena à la formule de l'entropie de Bekenstein-Hawking, rassemblant les constantes fondamentales de la relativité, de la mécanique quantique et de la thermodynamique :\n\n$$S_{BH} = \\frac{k_B A}{4 \\ell_P^2} = \\frac{k_B c^3 A}{4 G \\hbar}$$\n\nHawking démontra ensuite que les trous noirs ne sont pas parfaitement noirs : ils émettent un rayonnement thermique à une température associée :\n\n$$T_H = \\frac{\\hbar c^3}{8 \\pi G M k_B}$$\n\nCe rayonnement implique que les trous noirs s'évaporent lentement, posant la question toujours ouverte du devenir de l'information tombée dans un trou noir une fois celui-ci disparu.`,
				en: `The information paradox stems from a striking similarity between the second law of thermodynamics and Hawking's area theorem, which states that a black hole's area can never decrease in classical physics.\n\nThis analogy led to the Bekenstein-Hawking entropy formula, gathering the fundamental constants of relativity, quantum mechanics, and thermodynamics:\n\n$$S_{BH} = \\frac{k_B A}{4 \\ell_P^2} = \\frac{k_B c^3 A}{4 G \\hbar}$$\n\nHawking then showed that black holes are not perfectly black: they emit thermal radiation at an associated temperature:\n\n$$T_H = \\frac{\\hbar c^3}{8 \\pi G M k_B}$$\n\nThis radiation implies that black holes slowly evaporate, raising the still-open question of what happens to information that fell into a black hole once it has disappeared.`
			},
			external: false
		}
	]
};
