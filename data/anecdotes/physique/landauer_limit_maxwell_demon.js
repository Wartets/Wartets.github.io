export default {
	id: 'anecdote_landauer_limit_maxwell_demon',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Informatique Théorique / Thermodynamique', en: 'Theoretical Computer Science / Thermodynamics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Pendant un siècle, le « Démon de Maxwell », une entité hypothétique triant les molécules chaudes et froides sans dépenser d'énergie, menaçait de violer le second principe de la thermodynamique. En 1961, Rolf Landauer résout ce paradoxe en établissant un lien fondamental entre informatique et physique : l'effacement d'un bit d'information est une opération logiquement irréversible qui dissipe obligatoirement une quantité minimale d'énergie sous forme de chaleur.`,
		en: `For a century, "Maxwell's Demon", a hypothetical entity sorting hot and cold molecules without expending energy, threatened to violate the second law of thermodynamics. In 1961, Rolf Landauer resolved this paradox by establishing a fundamental link between computation and physics: erasing a bit of information is a logically irreversible operation that must dissipate a minimum amount of energy as heat.`
	},
	sources: [
		{
			name: { fr: 'Irreversibility and Heat Generation in the Computing Process (1961)', en: 'Irreversibility and Heat Generation in the Computing Process (1961)' },
			url: 'https://ieeexplore.ieee.org/document/5392446'
		},
		{
			name: { fr: 'Thermodynamics of Information (2015)', en: 'Thermodynamics of Information (2015)' },
			url: 'https://www.nature.com/articles/nphys3230'
		}
	],
	contexts: [
		{
			title: { fr: 'Coût énergétique du calcul irréversible', en: 'The energy cost of irreversible computation' },
			body: {
				fr: `Dans un dispositif bistable, tel un puits de potentiel à double creux, l'effacement d'un bit revient à forcer le système vers un unique état, quel que soit son état initial, perdant ainsi un degré de liberté informationnel.\n\nLandauer démontra que ce processus dissipe nécessairement une quantité de chaleur bornée inférieurement par la température du système $T$ :\n\n$$\\Delta Q \\ge k_B T \\ln 2$$\n\nLe Démon de Maxwell doit posséder une mémoire pour enregistrer ses mesures des molécules, et c'est précisément l'effacement inévitable de cette mémoire, à un moment ou à un autre, qui rétablit le second principe. Cette limite a également stimulé le développement de l'informatique réversible (portes de Fredkin et Toffoli), qui permet théoriquement d'effectuer des calculs sans dissipation énergétique en évitant l'effacement.`,
				en: `In a bistable device, such as a double-well potential, erasing a bit amounts to forcing the system into a single state regardless of its initial state, thereby losing one degree of informational freedom.\n\nLandauer showed that this process necessarily dissipates a quantity of heat bounded below by the system's temperature $T$:\n\n$$\\Delta Q \\ge k_B T \\ln 2$$\n\nMaxwell's Demon must possess a memory to record its measurements of the molecules, and it is precisely the inevitable erasure of this memory, sooner or later, that restores the second law. This limit also spurred the development of reversible computing (Fredkin and Toffoli gates), which theoretically allows computation with no energy dissipation by avoiding erasure altogether.`
			},
			external: false
		}
	]
};
