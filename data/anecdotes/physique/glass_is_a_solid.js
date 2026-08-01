export default {
	id: 'anecdote_glass_is_a_solid',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Physique des Matériaux', en: 'Materials Physics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Une légende tenace affirme que le verre des vitraux des vieilles cathédrales est plus épais à la base parce qu'il serait un « liquide très lent » qui coule vers le bas au fil des siècles sous l'effet de la gravité. C'est faux. D'un point de vue thermodynamique, à température ambiante, le verre est un solide amorphe pétrifié. La différence d'épaisseur vient de la technique de fabrication médiévale (verre en couronne), qui produisait des plaques inégales : les vitriers installaient simplement le côté le plus lourd vers le bas pour stabiliser l'armature de plomb.`,
		en: `A persistent legend claims that the glass in the stained-glass windows of old cathedrals is thicker at the bottom because it is a "very slow liquid" flowing downward over the centuries under gravity. This is false. Thermodynamically, at room temperature, glass is a petrified amorphous solid. The difference in thickness comes from the medieval manufacturing technique (crown glass), which produced uneven panes: glaziers simply installed the heavier side at the bottom to stabilize the lead frame.`
	},
	sources: [
		{
			name: { fr: 'The myth of flowing glass (E.D. Zanotto, American Journal of Physics, 1998)', en: 'The myth of flowing glass (E.D. Zanotto, American Journal of Physics, 1998)' },
			url: 'https://aapt.scitation.org/doi/10.1119/1.19026'
		}
	],
	contexts: [
		{
			title: { fr: 'Temps de relaxation et viscosité macroscopique', en: 'Relaxation time and macroscopic viscosity' },
			body: {
				fr: `La classification liquide/solide à l'échelle macroscopique repose sur le nombre de Deborah, le rapport entre le temps de relaxation moléculaire $\\tau$ et le temps d'observation $t_{obs}$. La viscosité dynamique $\\eta$ du verre fondu augmente exponentiellement lors du refroidissement, selon l'équation de Vogel-Fulcher-Tammann (VFT) :\n\n$$\\eta(T) = \\eta_0 \\exp\\left( \\frac{B}{T - T_0} \\right)$$\n\nAu passage de la transition vitreuse, la viscosité atteint $10^{12}\\ \\text{Pa}\\cdot\\text{s}$. À température ambiante, le temps de relaxation nécessaire pour observer un écoulement gravitationnel de la silice sur un millimètre dépasse de plusieurs ordres de grandeur l'âge actuel de l'univers.`,
				en: `The macroscopic liquid/solid classification relies on the Deborah number, the ratio between the molecular relaxation time $\\tau$ and the observation time $t_{obs}$. The dynamic viscosity $\\eta$ of molten glass increases exponentially upon cooling, following the Vogel-Fulcher-Tammann (VFT) equation:\n\n$$\\eta(T) = \\eta_0 \\exp\\left( \\frac{B}{T - T_0} \\right)$$\n\nAt the glass transition, viscosity reaches $10^{12}\\ \\text{Pa}\\cdot\\text{s}$. At room temperature, the relaxation time needed to observe one millimeter of gravitational flow of silica exceeds the current age of the universe by several orders of magnitude.`
			},
			external: false
		}
	]
};
