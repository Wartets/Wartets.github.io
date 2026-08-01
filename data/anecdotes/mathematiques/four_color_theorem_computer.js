export default {
	id: 'anecdote_four_color_theorem_computer',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Topologie / Théorie des Graphes', en: 'Topology / Graph Theory' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Tracez une carte imaginaire avec autant de pays que vous le souhaitez, de formes aussi tarabiscotées que possible. Il vous suffira de seulement 4 couleurs pour colorier l'intégralité de la carte sans que deux pays partageant une frontière aient la même couleur. Formulé en 1852, ce théorème a résisté aux plus grands mathématiciens pendant plus d'un siècle. En 1976, il fut finalement prouvé... par un ordinateur, qui vérifia 1936 cas particuliers, provoquant un séisme philosophique sur la définition même d'une « preuve » mathématique.`,
		en: `Draw an imaginary map with as many countries as you like, in shapes as convoluted as possible. You will need only 4 colors to color the entire map so that no two countries sharing a border share the same color. Formulated in 1852, this theorem resisted the greatest mathematicians for over a century. In 1976, it was finally proven... by a computer, which checked 1936 individual cases, triggering a philosophical earthquake over the very definition of a mathematical "proof".`
	},
	sources: [
		{
			name: { fr: 'Every Planar Map is Four Colorable (K. Appel, W. Haken, Bulletin of the American Mathematical Society, 1976)', en: 'Every Planar Map is Four Colorable (K. Appel, W. Haken, Bulletin of the American Mathematical Society, 1976)' },
			url: 'https://projecteuclid.org/journals/bulletin-of-the-american-mathematical-society/volume-82/issue-5/Every-planar-map-is-four-colorable/bams/1183538215.full'
		}
	],
	contexts: [
		{
			title: { fr: 'Graphes planaires et réduction de configurations', en: 'Planar graphs and configuration reduction' },
			body: {
				fr: `Le problème revient à colorier les sommets d'un graphe planaire sans que deux sommets adjacents aient la même couleur. La preuve de Kenneth Appel et Wolfgang Haken repose sur la recherche d'un « ensemble inévitable de configurations réductibles ».\n\nIls prouvèrent par la logique de déchargement que toute carte planaire infinie contient au moins l'une de ces 1936 sous-structures. Puisque le polynôme chromatique $P(G, k)$ du graphe complet garantit $P(G, 4) > 0$ si les sous-configurations le sont, la preuve nécessite la vérification exhaustive de la réductibilité de chaque cas :\n\n$$\\forall C \\in \\text{Ensemble Inévitable}, \\quad C \\text{ est coloriable à 4 couleurs}$$`,
				en: `The problem amounts to coloring the vertices of a planar graph so that no two adjacent vertices share a color. Kenneth Appel and Wolfgang Haken's proof rests on finding an "unavoidable set of reducible configurations".\n\nUsing discharging logic, they proved that every infinite planar map contains at least one of these 1936 substructures. Since the chromatic polynomial $P(G, k)$ of the complete graph guarantees $P(G, 4) > 0$ if the sub-configurations do, the proof requires exhaustively checking the reducibility of every case:\n\n$$\\forall C \\in \\text{Unavoidable Set}, \\quad C \\text{ is 4-colorable}$$`
			},
			external: false
		}
	]
};
