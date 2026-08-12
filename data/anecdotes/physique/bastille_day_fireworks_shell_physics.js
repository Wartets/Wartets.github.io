export default {
	id: 'anecdote_bastille_day_fireworks_shell_physics',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Physique - Balistique et Combustion', en: 'Physics - Ballistics and Combustion' },
	scheduling: { type: 'period', dates: ['07-10', '07-15'] },
	content: {
		fr: `Au-delà de la couleur des étincelles, la forme même d'une explosion de feu d'artifice du 14 juillet, pivoine, chrysanthème ou saule pleureur, résulte d'un problème d'ingénierie balistique. Une charge de propulsion ("lift charge") éjecte la bombe hors du mortier ; une mèche pyrotechnique calibrée déclenche ensuite, à l'apogée de la trajectoire, une charge d'éclatement qui disperse dans toutes les directions de petites étoiles pyrotechniques disposées en coquille sphérique.`,
		en: `Beyond the color of the sparks, the very shape of a Bastille Day fireworks burst, peony, chrysanthemum, or weeping willow, is the result of a ballistic engineering problem. A lift charge ejects the shell out of the mortar tube; a precisely timed pyrotechnic fuse then triggers, at the apex of the trajectory, a burst charge that scatters small pyrotechnic stars in every direction from their spherical shell arrangement.`
	},
	sources: [
		{
			name: { fr: 'The Chemistry of Fireworks (M. S. Russell, Royal Society of Chemistry, 2000)', en: 'The Chemistry of Fireworks (M. S. Russell, Royal Society of Chemistry, 2000)' },
			url: 'https://doi.org/10.1039/9781847552037'
		}
	],
	contexts: [
		{
			title: { fr: 'Trajectoire balistique et vitesse de combustion des étoiles', en: 'Ballistic trajectory and star burn speed' },
			body: {
				fr: `En négligeant la résistance de l'air, la hauteur d'apogée atteinte à partir d'une vitesse de tir $v_0$ vérifie :\n\n$$h = \\frac{v_0^2}{2g}$$\n\nUne fois la charge d'éclatement déclenchée, chaque étoile pyrotechnique est projetée à vitesse quasi-uniforme $v_{étoile}$ dans toutes les directions ; le rayon apparent de la sphère lumineuse croît alors linéairement dans le temps, $R(t) \\approx v_{étoile} \\cdot t$, jusqu'à extinction de la combustion des étoiles. Les variations de masse, de vitesse initiale ou de durée de combustion des étoiles individuelles, volontaires ou non, expliquent les motifs asymétriques comme la traîne caractéristique de l'effet « saule », obtenue avec des étoiles à combustion lente riches en charbon de bois et en titane.`,
				en: `Neglecting air resistance, the apex height reached from a launch speed $v_0$ satisfies:\n\n$$h = \\frac{v_0^2}{2g}$$\n\nOnce the burst charge fires, each pyrotechnic star is ejected at a near-uniform speed $v_{star}$ in every direction; the apparent radius of the luminous sphere then grows linearly with time, $R(t) \\approx v_{star} \\cdot t$, until the stars finish burning. Variations in mass, initial speed, or individual star burn duration, whether intentional or not, explain asymmetric patterns such as the characteristic trailing tail of the "willow" effect, achieved with slow-burning stars rich in charcoal and titanium.`
			},
			external: false
		}
	]
};
