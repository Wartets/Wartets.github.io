export default {
	id: 'anecdote_mars_olympus_mons',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Planétologie Comparée', en: 'Comparative Planetology' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Le mont Everest est la plus haute montagne terrestre avec ses 8848 mètres. Il fait pourtant pâle figure face au volcan géant de Mars, Olympus Mons. Culminant à près de 22 kilomètres d'altitude, soit plus de deux fois et demie l'Everest, avec une base de la taille de la France entière, sa croissance a été rendue possible par la géologie martienne. Contrairement à la Terre, Mars ne possède pas de tectonique des plaques mobiles : un point chaud magmatique a donc craché de la lave au même endroit sans discontinuer pendant des millions d'années, empilant la roche sans limite.`,
		en: `Mount Everest is Earth's highest mountain at 8,848 meters. Yet it pales in comparison to Mars's giant volcano, Olympus Mons. Towering nearly 22 kilometers high, more than two and a half times Everest, with a base the size of all of France, its growth was made possible by Martian geology. Unlike Earth, Mars has no mobile plate tectonics: a magmatic hotspot therefore erupted lava at the same spot uninterrupted for millions of years, stacking rock without limit.`
	},
	sources: [
		{
			name: { fr: 'The Surface of Mars (1982)', en: 'The Surface of Mars (1982)' },
			url: 'https://doi.org/10.1093/astrogeo/72.2.537-a'
		}
	],
	contexts: [
		{
			title: { fr: 'Pression lithostatique et gravité de surface', en: 'Lithostatic pressure and surface gravity' },
			body: {
				fr: `La hauteur maximale d'une montagne sur une planète rocheuse est limitée par la résistance à la compression de la roche à sa base. Si la pression lithostatique dépasse la limite d'élasticité de la croûte, la base s'effondre sous son propre poids, avec $P = \\rho g h$. L'accélération de la pesanteur martienne $g_{mars}$ n'étant que de 38 % de celle de la Terre, la roche martienne peut supporter une colonne de matière bien plus haute. La hauteur maximale théorique s'écrit :\n\n$$h_{max} \\approx \\frac{\\sigma_c}{\\rho g}$$\n\noù $\\sigma_c$ est la limite de compression. Puisque $g_{mars} \\approx g_{terre} / 2,6$, le relief martien peut être naturellement 2,6 fois plus élevé.`,
				en: `The maximum height of a mountain on a rocky planet is limited by the compressive strength of the rock at its base. If lithostatic pressure exceeds the crust's elastic limit, the base collapses under its own weight, with $P = \\rho g h$. Since Martian surface gravity $g_{mars}$ is only 38% of Earth's, Martian rock can support a much taller column of material. The theoretical maximum height is:\n\n$$h_{max} \\approx \\frac{\\sigma_c}{\\rho g}$$\n\nwhere $\\sigma_c$ is the compressive limit. Since $g_{mars} \\approx g_{earth} / 2.6$, Martian relief can naturally reach 2.6 times higher.`
			},
			external: false
		}
	]
};
