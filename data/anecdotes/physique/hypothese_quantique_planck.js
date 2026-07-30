export default {
	id: 'anecdote_hypothese_quantique_planck',
	enabled: true,
	priority: 3,
	addedDate: '2026-07-30',
	domain: { fr: 'Physique - Mécanique quantique', en: 'Physics - Quantum Mechanics' },
	scheduling: { type: 'annual', dates: ['12-14'] },
	content: (lang, year) => {
		const elapsed = year - 1900;
		return lang === 'fr'
			? `Le 14 décembre 1900, Max Planck présente devant la Société allemande de physique l'hypothèse selon laquelle l'énergie n'est échangée qu'en quantités discrètes, $E = h\\nu$, posant sans le vouloir la première pierre de la mécanique quantique, il y a désormais ${elapsed} ans.`
			: `On December 14, 1900, Max Planck presented to the German Physical Society the hypothesis that energy is exchanged only in discrete amounts, $E = h\\nu$, unwittingly laying the first stone of quantum mechanics, ${elapsed} years ago.`;
	},
	sources: [
		{
			name: { fr: 'Fondation Nobel', en: 'Nobel Foundation' },
			url: 'https://www.nobelprize.org/prizes/physics/1918/planck/biographical/'
		}
	],
	contexts: [
		{
			title: { fr: "Le problème du corps noir", en: 'The black-body problem' },
			body: {
				fr: `À la fin du XIXe siècle, la loi de Rayleigh-Jeans, dérivée de la thermodynamique classique, prédit une émission d'énergie divergente aux courtes longueurs d'onde pour un corps noir, un défaut connu sous le nom de « catastrophe ultraviolette ».\n\nPlanck résout cette divergence en postulant que les oscillateurs de la cavité ne peuvent échanger de l'énergie qu'en paquets discrets proportionnels à leur fréquence, selon $E = h\\nu$, où $h$ est une constante universelle qu'il détermine empiriquement.\n\nPlanck lui-même considérait initialement cette hypothèse comme un artifice mathématique commode plutôt qu'une réalité physique. C'est Einstein qui, en 1905, en tirera les conséquences physiques radicales en interprétant la lumière elle-même comme composée de quanta discrets pour expliquer l'effet photoélectrique.`,
				en: `At the end of the 19th century, the Rayleigh-Jeans law, derived from classical thermodynamics, predicted a divergent energy emission at short wavelengths for a black body, a flaw known as the "ultraviolet catastrophe".\n\nPlanck resolved this divergence by postulating that the cavity's oscillators can only exchange energy in discrete packets proportional to their frequency, according to $E = h\\nu$, where $h$ is a universal constant he determined empirically.\n\nPlanck himself initially regarded this hypothesis as a convenient mathematical device rather than physical reality. It was Einstein who, in 1905, drew the radical physical consequences by interpreting light itself as composed of discrete quanta to explain the photoelectric effect.`
			},
			external: false
		}
	]
};
