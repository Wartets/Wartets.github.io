export default {
	id: 'anecdote_noether_theorem_publication',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Physique Mathématique', en: 'Mathematical Physics' },
	scheduling: { type: 'annual', dates: ['07-23'] },
	content: (lang, year) => {
		const elapsed = year - 1918;
		return lang === 'fr'
			? `Le théorème établi par Emmy Noether devant la Société mathématique de Göttingen démontre rigoureusement que toute symétrie continue de l'action d'un système physique correspond à une loi de conservation stricte, il y a désormais ${elapsed} ans.`
			: `The theorem established by Emmy Noether before the Göttingen Mathematical Society rigorously demonstrates that every continuous symmetry of a physical system's action corresponds to a strict conservation law, ${elapsed} years ago.`;
	},
	sources: [
		{
			name: { fr: 'Invariante Variationsprobleme (1918, traduction académique)', en: 'Invariante Variationsprobleme (1918, academic translation)' },
			url: 'https://arxiv.org/abs/physics/0503066'
		}
	],
	contexts: [
		{
			title: { fr: 'Formalisme lagrangien et courants conservés', en: 'Lagrangian formalism and conserved currents' },
			body: {
				fr: `Le principe de moindre action stipule que la trajectoire physique d'un système extrémise l'action $S = \\int \\mathcal{L}\\, dt$. En considérant une transformation infinitésimale continue des coordonnées et des champs qui laisse cette action invariante, on peut dériver une équation de continuité.\n\nLe courant de Noether conservé associé s'écrit :\n\n$$\\partial_\\mu j^\\mu = 0 \\quad \\text{avec} \\quad j^\\mu = \\frac{\\partial \\mathcal{L}}{\\partial (\\partial_\\mu \\phi)} \\delta \\phi - \\mathcal{J}^\\mu$$\n\nCe premier théorème (portant sur les symétries globales) s'étend aux théories de jauge locales, dites de Yang-Mills, qui constituent le socle mathématique du Modèle Standard de la physique des particules.`,
				en: `The principle of least action states that a system's physical trajectory extremizes the action $S = \\int \\mathcal{L}\\, dt$. By considering a continuous infinitesimal transformation of coordinates and fields that leaves this action invariant, one can derive a continuity equation.\n\nThe associated conserved Noether current is written:\n\n$$\\partial_\\mu j^\\mu = 0 \\quad \\text{with} \\quad j^\\mu = \\frac{\\partial \\mathcal{L}}{\\partial (\\partial_\\mu \\phi)} \\delta \\phi - \\mathcal{J}^\\mu$$\n\nThis first theorem (concerning global symmetries) extends to local, so-called Yang-Mills gauge theories, which form the mathematical foundation of the Standard Model of particle physics.`
			},
			external: false
		}
	]
};
