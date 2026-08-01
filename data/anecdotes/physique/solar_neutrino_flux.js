export default {
	id: 'anecdote_solar_neutrino_flux',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Physique Subatomique', en: 'Subatomic Physics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `L'univers n'est pas rempli que de photons. À chaque seconde, de jour comme de nuit, environ 100 milliards de particules subatomiques fantomatiques traversent l'ongle d'un pouce. Ces particules, appelées neutrinos, sont produites par les réactions de fusion nucléaire au cœur du Soleil. Sans charge électrique et de masse presque nulle, elles traversent la matière solide, y compris la planète Terre entière, à la vitesse de la lumière sans jamais s'y heurter, comme si l'univers matériel était totalement vide.`,
		en: `The universe is not filled with photons alone. Every second, day and night, about 100 billion ghostly subatomic particles pass through the surface of a thumbnail. These particles, called neutrinos, are produced by nuclear fusion reactions at the Sun's core. Carrying no electric charge and almost no mass, they pass through solid matter, including the entire planet Earth, at the speed of light without ever colliding, as if the material universe were entirely empty.`
	},
	sources: [
		{
			name: { fr: 'Solar Neutrinos: I. Theoretical (J.N. Bahcall, Physical Review Letters, 1964)', en: 'Solar Neutrinos: I. Theoretical (J.N. Bahcall, Physical Review Letters, 1964)' },
			url: 'https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.12.300'
		}
	],
	contexts: [
		{
			title: { fr: 'Section efficace de l\'interaction faible', en: 'Cross-section of the weak interaction' },
			body: {
				fr: `Les neutrinos interagissent avec les nucléons et les électrons presque exclusivement via la force nucléaire faible, médiée par les bosons Z et W. La probabilité qu'une particule entre en collision avec une cible est décrite par la section efficace $\\sigma$. Pour un neutrino solaire d'énergie de l'ordre du MeV, la section efficace est de l'ordre de $10^{-44}\\ \\text{cm}^2$. Le libre parcours moyen dans un matériau de densité atomique $n$ s'écrit :\n\n$$\\lambda = \\frac{1}{n\\sigma}$$\n\nPour traverser l'eau, ou un être humain, $\\lambda$ est de l'ordre d'une année-lumière d'épaisseur, expliquant leur nature évanescente.`,
				en: `Neutrinos interact with nucleons and electrons almost exclusively through the weak nuclear force, mediated by the Z and W bosons. The probability of a particle colliding with a target is described by the cross-section $\\sigma$. For a solar neutrino with an energy on the order of a MeV, the cross-section is on the order of $10^{-44}\\ \\text{cm}^2$. The mean free path in a material of atomic density $n$ is:\n\n$$\\lambda = \\frac{1}{n\\sigma}$$\n\nTo be stopped by water, or a human being, $\\lambda$ is on the order of a light-year of thickness, explaining their elusive nature.`
			},
			external: false
		}
	]
};
