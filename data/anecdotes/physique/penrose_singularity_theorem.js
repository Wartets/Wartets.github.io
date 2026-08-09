export default {
	id: 'anecdote_penrose_singularity_theorem',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Relativité Générale / Topologie', en: 'General Relativity / Topology' },
	scheduling: { type: 'annual', dates: ['01-15'] },
	content: (lang, year) => {
		const elapsed = year - 1965;
		return lang === 'fr'
			? `Jusqu'en 1965, de nombreux physiciens croyaient que les trous noirs n'étaient qu'une anomalie mathématique née du modèle excessivement idéalisé de Schwarzschild, exigeant une étoile parfaitement sphérique pour s'effondrer en un point infinitésimal. Roger Penrose introduisit alors des méthodes inédites de topologie globale en relativité pour démontrer, il y a désormais ${elapsed} ans, que dès qu'une étoile s'effondre suffisamment pour former une « surface piégée », où même la lumière tombe vers l'intérieur, une singularité d'espace-temps se forme inévitablement, quelle que soit l'asymétrie ou le chaos de l'effondrement.`
			: `Until 1965, many physicists believed that black holes were merely a mathematical anomaly arising from the excessively idealized Schwarzschild model, which required a perfectly spherical star to collapse into an infinitesimal point. Roger Penrose then introduced novel global topology methods into relativity to prove, ${elapsed} years ago now, that once a star collapses enough to form a "trapped surface", where even light falls inward, a spacetime singularity forms inevitably, regardless of how asymmetric or chaotic the collapse may be.`;
	},
	sources: [
		{
			name: { fr: 'Gravitational Collapse and Space-Time Singularities (1965)', en: 'Gravitational Collapse and Space-Time Singularities (1965)' },
			url: 'https://doi.org/10.1103/PhysRevLett.14.57'
		}
	],
	contexts: [
		{
			title: { fr: 'Équation de Raychaudhuri et incomplétude géodésique', en: 'The Raychaudhuri equation and geodesic incompleteness' },
			body: {
				fr: `Considérons une congruence de géodésiques nulles, les trajectoires suivies par la lumière, et son évolution décrite par l'expansion scalaire $\\theta$, régie par l'équation de Raychaudhuri. Si l'univers respecte la condition d'énergie forte, exprimée par la contraction du tenseur de Ricci avec des vecteurs nuls $k^\\mu$ :\n\n$$R_{\\mu\\nu} k^\\mu k^\\nu \\ge 0$$\n\nalors, dès qu'une surface piégée apparaît, Penrose démontra que l'expansion $\\theta$ devient nécessairement infiniment négative en un temps propre fini. L'espace-temps devient alors « géodésiquement incomplet » : l'histoire d'une particule y trouve une fin abrupte, mathématiquement inévitable, prouvant rigoureusement l'existence d'une singularité sans avoir à supposer la moindre symétrie particulière de l'effondrement, contrairement aux solutions exactes précédemment connues.`,
				en: `Consider a congruence of null geodesics, the paths followed by light, and its evolution described by the expansion scalar $\\theta$, governed by the Raychaudhuri equation. If the universe satisfies the strong energy condition, expressed by the contraction of the Ricci tensor with null vectors $k^\\mu$:\n\n$$R_{\\mu\\nu} k^\\mu k^\\nu \\ge 0$$\n\nthen, once a trapped surface forms, Penrose showed that the expansion $\\theta$ necessarily becomes infinitely negative within a finite proper time. Spacetime then becomes "geodesically incomplete": the history of a particle reaches an abrupt, mathematically unavoidable end, rigorously proving the existence of a singularity without having to assume any particular symmetry of the collapse, unlike the previously known exact solutions.`
			},
			external: false
		}
	]
};
