export default {
	id: 'anecdote_fireworks_flame_emission_colors',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Physique - Spectroscopie Atomique', en: 'Physics - Atomic Spectroscopy' },
	scheduling: { type: 'period', dates: ['12-29', '01-02'] },
	content: {
		fr: `Les couleurs des feux d'artifice du Nouvel An proviennent de sels métalliques portés à incandescence : le strontium donne le rouge, le baryum le vert, le sodium le jaune-orangé. Le bleu, en revanche, reste la couleur la plus difficile à obtenir de façon éclatante : il exige des composés de cuivre chauffés dans une fenêtre de température extrêmement étroite, trop chaude détruisant la molécule émettrice, trop froide ne l'excitant pas suffisamment.`,
		en: `The colors of New Year's Eve fireworks come from metal salts heated to incandescence: strontium gives red, barium gives green, sodium gives yellow-orange. Blue, however, remains the hardest color to achieve vividly: it requires copper compounds heated within an extremely narrow temperature window, too hot destroying the emitting molecule, too cold failing to excite it sufficiently.`
	},
	sources: [
		{
			name: { fr: 'Using the Chemistry of Fireworks To Engage Students in Learning Basic Chemical Principles: A Lesson in Eco-Friendly Pyrotechnics (G. Steinhauser, T. M. Klapötke, Journal of Chemical Education, 2010)', en: 'Using the Chemistry of Fireworks To Engage Students in Learning Basic Chemical Principles: A Lesson in Eco-Friendly Pyrotechnics (G. Steinhauser, T. M. Klapötke, Journal of Chemical Education, 2010)' },
			url: 'https://doi.org/10.1021/ed800057x'
		}
	],
	contexts: [
		{
			title: { fr: 'Transitions électroniques et couleur caractéristique', en: 'Electronic transitions and characteristic color' },
			body: {
				fr: `La chaleur de combustion excite les électrons de valence des atomes métalliques vers des niveaux d'énergie supérieurs. En retombant vers leur état fondamental, ces électrons réémettent l'énergie sous forme de photons dont la longueur d'onde est fixée par l'écart énergétique entre niveaux :\n\n$$E = h\\nu = \\frac{hc}{\\lambda}$$\n\nChaque élément possédant un jeu unique de niveaux d'énergie permis, la couleur émise lui est caractéristique, exactement comme dans le test à la flamme utilisé en chimie analytique. Le cas du cuivre, dont la molécule émettrice (CuCl) se dissocie facilement à haute température, illustre la difficulté pratique de stabiliser une couleur pure à grande échelle.`,
				en: `Combustion heat excites the valence electrons of metal atoms to higher energy levels. As these electrons fall back to their ground state, they re-emit the energy as photons whose wavelength is set by the energy gap between levels:\n\n$$E = h\\nu = \\frac{hc}{\\lambda}$$\n\nSince each element has a unique set of allowed energy levels, the emitted color is characteristic of it, exactly as in the flame test used in analytical chemistry. Copper, whose emitting molecule (CuCl) readily dissociates at high temperature, illustrates the practical difficulty of stabilizing a pure color at large scale.`
			},
			external: false
		}
	]
};
