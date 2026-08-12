export default {
	id: 'anecdote_carnot_cycle_thermodynamics',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Thermodynamique - Histoire des Sciences', en: 'Thermodynamics - History of Science' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Au début du XIXe siècle, les ingénieurs cherchaient par tous les moyens à améliorer le rendement des machines à vapeur. En 1824, un ingénieur de 27 ans nommé Sadi Carnot publie un traité prouvant de façon implacable qu'aucune machine thermique de l'univers, indépendamment de son fluide et de son ingénierie, ne pourra jamais atteindre un rendement de 100 %. Il formule une équation indépassable, démontrant que l'efficacité ne dépend que de l'écart de température entre la source chaude et la source froide. Ce concept posa les premières bases de ce qui deviendra le second principe de la thermodynamique.`,
		en: `In the early 19th century, engineers sought by every means to improve the efficiency of steam engines. In 1824, a 27-year-old engineer named Sadi Carnot published a treatise proving inexorably that no heat engine in the universe, regardless of its working fluid or engineering, could ever reach 100% efficiency. He formulated an insurmountable equation showing that efficiency depends only on the temperature gap between the hot source and the cold source. This concept laid the first foundations for what would become the second law of thermodynamics.`
	},
	sources: [
		{
			name: { fr: 'Réflexions sur la puissance motrice du feu (S. Carnot, Éditions Bachelier, 1824)', en: 'Réflexions sur la puissance motrice du feu (S. Carnot, Bachelier, 1824)' },
			url: 'https://archive.org/details/bub_gb_QX9iIWF3yOMC'
		}
	],
	contexts: [
		{
			title: { fr: 'Rendement maximum et transformations réversibles', en: 'Maximum efficiency and reversible transformations' },
			body: {
				fr: `Le cycle idéalisé de Carnot modélise une machine thermique réversible opérant en quatre phases : deux détentes et compressions isothermes, et deux détentes et compressions isentropiques. Le rendement thermodynamique $\\eta$ est le rapport du travail utile $W$ sur la chaleur absorbée $Q_H$.\n\nPar conservation de l'énergie ($W = Q_H - Q_C$) et l'égalité de Clausius pour un cycle réversible ($\\frac{Q_H}{T_H} = \\frac{Q_C}{T_C}$), le rendement théorique maximal se simplifie en :\n\n$$\\eta_{Carnot} = 1 - \\frac{T_C}{T_H}$$\n\nAtteindre une efficacité de 100 % exigerait mathématiquement une source froide au zéro absolu ($T_C = 0\\text{ K}$), un état physiquement inaccessible.`,
				en: `The idealized Carnot cycle models a reversible heat engine operating in four phases: two isothermal expansions and compressions, and two isentropic (adiabatic) expansions and compressions. The thermodynamic efficiency $\\eta$ is the ratio of useful work $W$ to heat absorbed $Q_H$.\n\nBy conservation of energy ($W = Q_H - Q_C$) and Clausius's equality for a reversible cycle ($\\frac{Q_H}{T_H} = \\frac{Q_C}{T_C}$), the theoretical maximum efficiency simplifies to:\n\n$$\\eta_{Carnot} = 1 - \\frac{T_C}{T_H}$$\n\nReaching 100% efficiency would mathematically require a cold source at absolute zero ($T_C = 0\\text{ K}$), a physically unreachable state.`
			},
			external: false
		}
	]
};
