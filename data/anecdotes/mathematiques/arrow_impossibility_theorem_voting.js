export default {
	id: 'anecdote_arrow_impossibility_theorem_voting',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-13',
	domain: { fr: 'Théorie du Choix Social / Mathématiques', en: 'Social Choice Theory / Mathematics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Aucun système de vote par classement ne peut être mathématiquement parfait. En 1950, l'économiste Kenneth Arrow a démontré qu'aucune fonction agrégeant les préférences ordonnées d'au moins trois candidats ne peut simultanément satisfaire l'unanimité, l'indépendance vis-à-vis des options non pertinentes et l'absence de dictateur : l'une de ces trois exigences démocratiques élémentaires doit toujours être sacrifiée.`,
		en: `No ranked voting system can be mathematically perfect. In 1950, economist Kenneth Arrow proved that no function aggregating the ranked preferences of at least three candidates can simultaneously satisfy unanimity, independence from irrelevant alternatives, and the absence of a dictator: one of these three basic democratic requirements must always be sacrificed.`
	},
	sources: [
		{
			name: { fr: 'A Difficulty in the Concept of Social Welfare (Arrow, Journal of Political Economy, 1950)', en: 'A Difficulty in the Concept of Social Welfare (Arrow, Journal of Political Economy, 1950)' },
			url: 'https://doi.org/10.1086/256963'
		}
	],
	contexts: [
		{
			title: { fr: "Les trois axiomes et l'esquisse de la preuve", en: 'The three axioms and a sketch of the proof' },
			body: {
				fr: `Pour un ensemble de candidats $A$ ($|A|\\ge 3$) et de votants $N$, une fonction de choix social $F$ associe à tout profil de préférences individuelles un ordre social. Arrow impose l'unanimité de Pareto (si tous préfèrent $x$ à $y$, la société aussi), l'indépendance aux alternatives non pertinentes (le classement de $x$ et $y$ ne dépend que des préférences relatives entre $x$ et $y$) et la non-dictature. La preuve construit un « ensemble décisif » de votants dont l'accord impose le choix social ; en combinant Pareto et l'indépendance, on montre par récurrence que cet ensemble se réduit nécessairement à un votant unique, contredisant la non-dictature.`,
				en: `For a set of candidates $A$ ($|A|\\ge 3$) and voters $N$, a social choice function $F$ maps any profile of individual preferences to a social ordering. Arrow requires Pareto unanimity (if everyone prefers $x$ to $y$, so does society), independence of irrelevant alternatives (the ranking of $x$ and $y$ depends only on preferences between $x$ and $y$), and non-dictatorship. The proof constructs a "decisive set" of voters whose agreement forces the social choice; combining Pareto with independence, one shows by induction that this set must shrink to a single voter, contradicting non-dictatorship.`
			},
			external: false
		}
	]
};
