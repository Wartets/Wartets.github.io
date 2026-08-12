export default {
	id: 'anecdote_maxwell_equations_unification',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Physique / Électromagnétisme', en: 'Physics / Electromagnetism' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1865, James Clerk Maxwell unifie en quatre équations tout ce que l'on savait alors de l'électricité, du magnétisme et de l'optique. En manipulant ces équations, il découvre qu'elles admettent des solutions ondulatoires se propageant dans le vide à une vitesse calculable à partir des seules constantes électriques et magnétiques, une vitesse qui coïncide avec celle de la lumière déjà mesurée. Maxwell en conclut que la lumière elle-même est une onde électromagnétique.`,
		en: `In 1865, James Clerk Maxwell unified everything then known about electricity, magnetism, and optics into four equations. Manipulating these equations, he discovered that they admit wave solutions propagating through vacuum at a speed calculable purely from electric and magnetic constants, a speed that coincided with the already-measured speed of light. Maxwell concluded that light itself is an electromagnetic wave.`
	},
	sources: [
		{
			name: { fr: 'A Dynamical Theory of the Electromagnetic Field (J. C. Maxwell, Philosophical Transactions of the Royal Society, 1865)', en: 'A Dynamical Theory of the Electromagnetic Field (J. C. Maxwell, Philosophical Transactions of the Royal Society, 1865)' },
			url: 'https://doi.org/10.1098/rstl.1865.0008'
		}
	],
	contexts: [
		{
			title: { fr: 'De quatre équations à une vitesse universelle', en: 'From four equations to a universal speed' },
			body: {
				fr: `Les équations de Maxwell dans le vide s'écrivent : $\\nabla \\cdot \\mathbf{E} = 0$, $\\nabla \\cdot \\mathbf{B} = 0$, $\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}$, $\\nabla \\times \\mathbf{B} = \\mu_0 \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}$. En combinant les deux dernières, on obtient une équation de propagation d'onde $\\nabla^2 \\mathbf{E} = \\mu_0 \\varepsilon_0 \\frac{\\partial^2 \\mathbf{E}}{\\partial t^2}$, dont la vitesse de propagation est :\n\n$$c = \\frac{1}{\\sqrt{\\mu_0 \\varepsilon_0}}$$\n\nCette valeur, obtenue uniquement à partir de mesures électriques et magnétiques en laboratoire, correspondait à la vitesse de la lumière déjà mesurée par des méthodes purement optiques, révélant leur nature commune.`,
				en: `Maxwell's equations in vacuum are: $\\nabla \\cdot \\mathbf{E} = 0$, $\\nabla \\cdot \\mathbf{B} = 0$, $\\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}$, $\\nabla \\times \\mathbf{B} = \\mu_0 \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}$. Combining the last two yields a wave propagation equation $\\nabla^2 \\mathbf{E} = \\mu_0 \\varepsilon_0 \\frac{\\partial^2 \\mathbf{E}}{\\partial t^2}$, whose propagation speed is:\n\n$$c = \\frac{1}{\\sqrt{\\mu_0 \\varepsilon_0}}$$\n\nThis value, obtained purely from laboratory electric and magnetic measurements, matched the speed of light already measured through purely optical methods, revealing their common nature.`
			},
			external: false
		}
	]
};
