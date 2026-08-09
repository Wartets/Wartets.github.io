export default {
	id: 'anecdote_newton_plague_calculus',
	enabled: true,
	priority: 3,
	addedDate: '2026-07-31',
	domain: { fr: 'Histoire des Sciences / Mathématiques', en: 'History of Science / Mathematics' },
	scheduling: { type: 'annual', dates: ['01-04'] },
	content: {
		fr: `En 1665, l'Université de Cambridge fut contrainte de fermer ses portes en raison de la Grande Peste de Londres, forçant les étudiants au confinement. Le jeune Isaac Newton retourna dans la ferme familiale de Woolsthorpe. Durant ces 18 mois d'isolement forcé, libéré du cursus académique, il posa les bases de la mécanique classique, fit des découvertes fondamentales en optique (la décomposition de la lumière blanche par un prisme), et inventa une branche entière des mathématiques : le calcul différentiel et intégral. Cette période est aujourd'hui qualifiée d'*Annus Mirabilis* (l'Année des Merveilles).`,
		en: `In 1665, the University of Cambridge was forced to close its doors because of the Great Plague of London, sending its students into isolation. The young Isaac Newton returned to the family farm at Woolsthorpe. During these 18 months of forced isolation, freed from the academic curriculum, he laid the foundations of classical mechanics, made fundamental discoveries in optics (the decomposition of white light by a prism), and invented an entire branch of mathematics: differential and integral calculus. This period is today known as his *Annus Mirabilis* (Year of Wonders).`
	},
	sources: [
		{
			name: { fr: 'The Mathematical Papers of Isaac Newton (Éditées par D. T. Whiteside, Cambridge University Press, 1967)', en: 'The Mathematical Papers of Isaac Newton (Edited by D. T. Whiteside, Cambridge University Press, 1967)' },
			url: 'https://assets.cambridge.org/97805210/45858/frontmatter/9780521045858_frontmatter.pdf/'
		}
	],
	contexts: [
		{
			title: { fr: 'La méthode des fluxions', en: 'The method of fluxions' },
			body: {
				fr: `Avant Newton (et Leibniz de façon indépendante), le calcul de la pente d'une courbe ou de l'aire sous une courbe reposait sur des méthodes géométriques d'exhaustion lourdes et limitées. Newton a formalisé le concept de « fluxion » (la dérivée par rapport au temps, notée $\\dot{x}$) et de « fluente » (la variable). Le théorème fondamental de l'analyse, reliant intégration et dérivation, s'exprime ainsi :\n\n$$\\int_a^b f(x) dx = F(b) - F(a) \\quad \\text{où} \\quad F'(x) = f(x)$$`,
				en: `Before Newton (and Leibniz independently), computing the slope of a curve or the area under a curve relied on cumbersome and limited geometric methods of exhaustion. Newton formalized the concept of a "fluxion" (the derivative with respect to time, denoted $\\dot{x}$) and a "fluent" (the variable). The fundamental theorem of calculus, linking integration and differentiation, is expressed as:\n\n$$\\int_a^b f(x) dx = F(b) - F(a) \\quad \\text{where} \\quad F'(x) = f(x)$$`
			},
			external: false
		}
	]
};
