export default {
	id: 'anecdote_least_action_principle',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Mécanique Analytique', en: 'Analytical Mechanics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En mécanique classique, on utilise souvent les forces de Newton pour calculer la trajectoire d'un objet. Toutefois, le mathématicien Joseph-Louis Lagrange a reformulé la physique autour d'un concept plus profond : la nature est économe. Un rayon de lumière ou une balle de tennis lancée en l'air suit toujours la trajectoire exacte qui minimise, ou rend stationnaire, une grandeur mathématique abstraite appelée « l'Action ». Plutôt que de calculer des causes instantanées, les forces, cette approche déduit le mouvement de manière globale en comparant tous les chemins possibles entre un point de départ et un point d'arrivée.`,
		en: `In classical mechanics, Newtonian forces are often used to calculate an object's trajectory. However, mathematician Joseph-Louis Lagrange reformulated physics around a deeper concept: nature is economical. A ray of light or a tennis ball thrown into the air always follows the exact trajectory that minimizes, or makes stationary, an abstract mathematical quantity called the "Action". Rather than computing instantaneous causes, the forces, this approach derives motion globally by comparing all possible paths between a starting point and an ending point.`
	},
	sources: [
		{
			name: { fr: 'Mécanique analytique (J.-L. Lagrange, 1788, Gallica)', en: 'Mécanique analytique (J.-L. Lagrange, 1788, Gallica)' },
			url: 'http://sites.mathdoc.fr/cgi-bin/oeitem?id=OE_LAGRANGE__11_1_0'
		}
	],
	contexts: [
		{
			title: { fr: 'Le formalisme Lagrangien et le Calcul des Variations', en: 'The Lagrangian formalism and the Calculus of Variations' },
			body: {
				fr: `Le Lagrangien $\\mathcal{L}$ d'un système correspond à la différence entre son énergie cinétique $T$ et son énergie potentielle $V$ ($\\mathcal{L} = T - V$). L'Action $S$ est l'intégrale temporelle de ce Lagrangien le long d'un chemin défini. Le principe de Hamilton postule que la trajectoire physique réelle $q(t)$ est celle qui rend la variation de l'action nulle ($\\delta S = 0$). En appliquant le calcul des variations, on obtient les équations d'Euler-Lagrange :\n\n$$\\frac{d}{dt} \\left( \\frac{\\partial \\mathcal{L}}{\\partial \\dot{q}_i} \\right) - \\frac{\\partial \\mathcal{L}}{\\partial q_i} = 0$$\n\nCe formalisme puissant ne dépend d'aucun système de coordonnées particulier et s'étend naturellement à la relativité générale et à la théorie quantique des champs.`,
				en: `The Lagrangian $\\mathcal{L}$ of a system is the difference between its kinetic energy $T$ and its potential energy $V$ ($\\mathcal{L} = T - V$). The Action $S$ is the time integral of this Lagrangian along a defined path. Hamilton's principle postulates that the actual physical trajectory $q(t)$ is the one that makes the variation of the action vanish ($\\delta S = 0$). Applying the calculus of variations yields the Euler-Lagrange equations:\n\n$$\\frac{d}{dt} \\left( \\frac{\\partial \\mathcal{L}}{\\partial \\dot{q}_i} \\right) - \\frac{\\partial \\mathcal{L}}{\\partial q_i} = 0$$\n\nThis powerful formalism does not depend on any particular coordinate system and naturally extends to general relativity and quantum field theory.`
			},
			external: false
		}
	]
};
