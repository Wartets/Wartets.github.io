export default {
	id: 'anecdote_poincare_n_body_problem_chaos',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Mécanique Céleste / Mathématiques', en: 'Celestial Mechanics / Mathematics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Pourquoi peut-on prédire une éclipse à la minute près des siècles à l'avance, mais pas décrire analytiquement l'orbite de trois corps en interaction gravitationnelle mutuelle ? En répondant au concours mathématique du roi Oscar II de Suède en 1889, Henri Poincaré découvrit que le problème des trois corps n'admet, en général, aucune solution analytique fermée : c'est la première mise en évidence rigoureuse du chaos déterministe, l'ancêtre conceptuel de « l'effet papillon ».`,
		en: `Why can an eclipse be predicted down to the minute centuries in advance, yet the orbit of three mutually interacting gravitational bodies cannot be described analytically? Answering King Oscar II of Sweden's mathematical prize competition in 1889, Henri Poincaré discovered that the three-body problem generally admits no closed analytical solution: it was the first rigorous demonstration of deterministic chaos, the conceptual ancestor of the "butterfly effect".`
	},
	sources: [
		{
			name: { fr: 'Sur le problème des trois corps et les équations de la dynamique (H. Poincaré, Acta Mathematica, 1890)', en: 'Sur le problème des trois corps et les équations de la dynamique (H. Poincaré, Acta Mathematica, 1890)' },
			url: 'https://www.persee.fr/doc/bastr_0572-7405_1891_num_8_1_10419'
		}
	],
	contexts: [
		{
			title: { fr: 'Un système non intégrable', en: 'A non-integrable system' },
			body: {
				fr: `Pour $N=3$ masses ponctuelles $m_i$, l'équation newtonienne du mouvement de chaque corps s'écrit :\n\n$$m_i \\ddot{\\mathbf{r}}_i = -G\\sum_{j \\neq i} \\frac{m_i m_j}{|\\mathbf{r}_i - \\mathbf{r}_j|^3}(\\mathbf{r}_i - \\mathbf{r}_j)$$\n\nCe système possède seulement dix intégrales premières classiques (conservation de l'énergie, de la quantité de mouvement et du moment cinétique), alors que sa résolution complète en nécessiterait davantage. Poincaré montra géométriquement, via ses « sections de retour », que les trajectoires s'enchevêtrent en des structures homoclines complexes rendant impossible toute prédiction précise à long terme : une infime variation des conditions initiales entraîne une divergence exponentielle des trajectoires.`,
				en: `For $N=3$ point masses $m_i$, Newton's equation of motion for each body is:\n\n$$m_i \\ddot{\\mathbf{r}}_i = -G\\sum_{j \\neq i} \\frac{m_i m_j}{|\\mathbf{r}_i - \\mathbf{r}_j|^3}(\\mathbf{r}_i - \\mathbf{r}_j)$$\n\nThis system has only ten classical first integrals (conservation of energy, momentum, and angular momentum), while a full solution would require more. Poincaré showed geometrically, through his "return maps", that trajectories tangle into complex homoclinic structures making precise long-term prediction impossible: an infinitesimal change in initial conditions leads to an exponential divergence of trajectories.`
			},
			external: false
		}
	]
};
