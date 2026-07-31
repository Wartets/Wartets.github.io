export default {
	id: 'anecdote_apollo15_galileo_drop',
	enabled: true,
	priority: 3,
	addedDate: '2026-07-31',
	domain: { fr: 'Mécanique Classique', en: 'Classical Mechanics' },
	scheduling: { type: 'annual', dates: ['08-02'] },
	content: (lang, year) => {
		const elapsed = year - 1971;
		return lang === 'fr'
			? `En 1589, Galilée affirmait que, sans la résistance de l'air, tous les objets tomberaient à la même vitesse, indépendamment de leur masse, s'opposant ainsi à la pensée aristotélicienne. En 1971, le commandant d'Apollo 15, David Scott, profita du vide quasi parfait de la Lune pour rendre hommage au physicien italien. Devant les caméras, il lâcha simultanément un marteau en aluminium de 1,32 kg et une plume de faucon de 30 grammes. Tous deux heurtèrent le sol lunaire très exactement au même instant, il y a désormais ${elapsed} ans, illustrant brillamment le principe d'équivalence gravitationnelle.`
			: `In 1589, Galileo claimed that, without air resistance, all objects would fall at the same speed regardless of their mass, opposing Aristotelian thought. In 1971, Apollo 15 commander David Scott took advantage of the Moon's near-perfect vacuum to pay tribute to the Italian physicist. In front of the cameras, he simultaneously dropped a 1.32 kg aluminum hammer and a 30-gram falcon feather. Both struck the lunar surface at exactly the same instant, ${elapsed} years ago now, brilliantly illustrating the principle of gravitational equivalence.`;
	},
	sources: [
		{
			name: { fr: 'The Apollo 15 Hammer-Feather Drop (NASA History Division)', en: 'The Apollo 15 Hammer-Feather Drop (NASA History Division)' },
			url: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_15_feather_drop.html'
		}
	],
	contexts: [
		{
			title: { fr: 'Principe d\'équivalence faible', en: 'The weak equivalence principle' },
			body: {
				fr: `La mécanique classique distingue conceptuellement la masse inerte $m_i$ (la résistance au mouvement de la seconde loi de Newton $F = m_i a$) et la masse grave $m_g$ (la charge sensible à la gravité $F = G \\frac{M m_g}{r^2}$). L'expérience lunaire illustre que $m_i = m_g$ avec une précision extrême. L'équation du mouvement devient alors indépendante de la masse de l'objet :\n\n$$m_i a = m_g g_{lune} \\implies a = g_{lune} \\approx 1,62 \\text{ m/s}^2$$`,
				en: `Classical mechanics conceptually distinguishes inertial mass $m_i$ (the resistance to motion in Newton's second law $F = m_i a$) from gravitational mass $m_g$ (the charge sensitive to gravity, $F = G \\frac{M m_g}{r^2}$). The lunar experiment illustrates that $m_i = m_g$ to extreme precision. The equation of motion then becomes independent of the object's mass:\n\n$$m_i a = m_g g_{moon} \\implies a = g_{moon} \\approx 1.62 \\text{ m/s}^2$$`
			},
			external: false
		}
	]
};
