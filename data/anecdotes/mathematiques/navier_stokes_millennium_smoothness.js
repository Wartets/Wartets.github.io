export default {
	id: 'anecdote_navier_stokes_millennium_smoothness',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Mécanique des Fluides / Mathématiques', en: 'Fluid Mechanics / Mathematics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `L'équation de Navier-Stokes, écrite au XIXe siècle, décrit avec précision le mouvement des fluides et sert quotidiennement à l'ingénierie aérodynamique ou hydraulique. Pourtant, aucune démonstration mathématique n'a jamais prouvé qu'en trois dimensions, une solution physiquement raisonnable ne finira jamais par concentrer une vitesse infinie en un point en un temps fini. C'est l'un des sept problèmes du prix du millénaire de l'institut Clay, doté d'un million de dollars, toujours non résolu.`,
		en: `The Navier-Stokes equation, written in the 19th century, precisely describes fluid motion and is used daily in aerodynamic and hydraulic engineering. Yet no mathematical proof has ever shown that, in three dimensions, a physically reasonable solution will never end up concentrating infinite velocity at a point in finite time. It is one of the seven Millennium Prize Problems of the Clay Institute, carrying a one-million-dollar reward, and it remains unsolved.`
	},
	sources: [
		{
			name: { fr: 'Sur le mouvement d\'un liquide visqueux emplissant l\'espace (J. Leray, Acta Mathematica, 1934)', en: 'Sur le mouvement d\'un liquide visqueux emplissant l\'espace (J. Leray, Acta Mathematica, 1934)' },
			url: 'https://doi.org/10.1007/BF02547354'
		}
	],
	contexts: [
		{
			title: { fr: 'Solutions faibles de Leray et le terme d\'inertie', en: 'Leray\'s weak solutions and the inertial term' },
			body: {
				fr: `Le système d'équations s'écrit, pour un fluide incompressible de densité $\\rho$ et de viscosité $\\nu$ :\n\n$$\\frac{\\partial \\mathbf{v}}{\\partial t} + (\\mathbf{v} \\cdot \\nabla) \\mathbf{v} = -\\frac{1}{\\rho} \\nabla p + \\nu \\nabla^2 \\mathbf{v}, \\qquad \\nabla \\cdot \\mathbf{v} = 0$$\n\nLe terme non linéaire $(\\mathbf{v} \\cdot \\nabla)\\mathbf{v}$ fragmente l'énergie vers des échelles de plus en plus petites. Jean Leray démontra en 1934 l'existence de « solutions faibles » globales, mais sans garantir leur régularité : le prix Clay exige de prouver qu'une solution forte, parfaitement lisse, existe toujours, sans apparition d'une singularité explosive $\\|\\mathbf{v}\\|_\\infty \\to \\infty$ en temps fini.`,
				en: `The system of equations is written, for an incompressible fluid of density $\\rho$ and viscosity $\\nu$, as:\n\n$$\\frac{\\partial \\mathbf{v}}{\\partial t} + (\\mathbf{v} \\cdot \\nabla) \\mathbf{v} = -\\frac{1}{\\rho} \\nabla p + \\nu \\nabla^2 \\mathbf{v}, \\qquad \\nabla \\cdot \\mathbf{v} = 0$$\n\nThe nonlinear term $(\\mathbf{v} \\cdot \\nabla)\\mathbf{v}$ fragments energy toward increasingly smaller scales. Jean Leray proved in 1934 the existence of global "weak solutions", but without guaranteeing their regularity: the Clay Prize requires proving that a perfectly smooth, strong solution always exists, with no explosive singularity $\\|\\mathbf{v}\\|_\\infty \\to \\infty$ appearing in finite time.`
			},
			external: false
		}
	]
};
