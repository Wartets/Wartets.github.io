export default {
	id: 'anecdote_nash_equilibrium_game_theory',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Théorie des Jeux - Mathématiques', en: 'Game Theory - Mathematics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1950, le mathématicien John Nash bouleverse notre compréhension de l'économie et de la stratégie comportementale en formulant le concept qui porte aujourd'hui son nom. Dans tout contexte concurrentiel impliquant plusieurs décideurs, un « équilibre de Nash » est atteint lorsqu'aucun participant ne peut tirer un avantage supplémentaire en changeant seul sa stratégie, connaissant celles choisies par tous les autres. Le point fascinant et contre-intuitif révélé par Nash est que cet état d'équilibre est souvent sous-optimal : la stabilité individuelle condamne fréquemment tous les joueurs à un résultat collectif moins bon que s'ils avaient pu se faire mutuellement confiance.`,
		en: `In 1950, mathematician John Nash upended our understanding of economics and strategic behavior by formulating the concept that now bears his name. In any competitive setting involving several decision-makers, a "Nash equilibrium" is reached when no participant can gain any additional advantage by unilaterally changing their strategy, given the strategies chosen by everyone else. The fascinating and counterintuitive point Nash revealed is that this equilibrium state is often suboptimal: individual stability frequently condemns all players to a worse collective outcome than if they had been able to trust one another.`
	},
	sources: [
		{
			name: { fr: 'Equilibrium points in n-person games (J. F. Nash, Proceedings of the National Academy of Sciences, 1950)', en: 'Equilibrium points in n-person games (J. F. Nash, Proceedings of the National Academy of Sciences, 1950)' },
			url: 'https://doi.org/10.1073/pnas.36.1.48'
		}
	],
	contexts: [
		{
			title: { fr: 'Le dilemme du prisonnier et le théorème du point fixe', en: 'The prisoner\'s dilemma and the fixed-point theorem' },
			body: {
				fr: `Le célèbre dilemme du prisonnier illustre cette notion : deux suspects sont interrogés séparément. S'ils se taisent tous deux, ils purgent 1 an. Si l'un dénonce l'autre (qui se tait), il est libre et l'autre prend 10 ans. S'ils se dénoncent mutuellement, ils prennent chacun 5 ans. L'état (Dénonciation, Dénonciation) est l'unique équilibre de Nash, car peu importe le choix de l'autre, dénoncer reste la réponse optimale unilatérale, bien que l'issue soit dominée par la coopération.\n\nL'apport majeur de Nash fut de prouver l'existence systématique d'au moins un tel équilibre dans tout jeu fini à $n$ joueurs, en introduisant la notion de « stratégie mixte ». La preuve s'appuie topologiquement sur le théorème du point fixe de Kakutani, formulant la fonction de meilleure réponse :\n\n$$\\forall i, \\quad s_i^* \\in \\arg\\max_{s_i \\in S_i} u_i(s_i, s_{-i}^*)$$\n\noù $u_i$ est la fonction d'utilité du joueur $i$, et $s_{-i}^*$ le profil de stratégies des autres joueurs.`,
				en: `The famous prisoner's dilemma illustrates this notion: two suspects are interrogated separately. If both stay silent, each serves 1 year. If one betrays the other (who stays silent), the betrayer goes free and the other gets 10 years. If both betray each other, each gets 5 years. The state (Betray, Betray) is the unique Nash equilibrium, since regardless of the other's choice, betraying remains the optimal unilateral response, even though the outcome is dominated by cooperation.\n\nNash's major contribution was proving the systematic existence of at least one such equilibrium in any finite $n$-player game, by introducing the notion of "mixed strategy". The proof rests topologically on Kakutani's fixed-point theorem, formulating the best-response function:\n\n$$\\forall i, \\quad s_i^* \\in \\arg\\max_{s_i \\in S_i} u_i(s_i, s_{-i}^*)$$\n\nwhere $u_i$ is player $i$'s utility function, and $s_{-i}^*$ the strategy profile of the other players.`
			},
			external: false
		}
	]
};
