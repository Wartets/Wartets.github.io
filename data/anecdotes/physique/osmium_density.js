export default {
	id: 'anecdote_osmium_density',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Chimie Structurale / Science des Matériaux', en: 'Structural Chemistry / Materials Science' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Le plomb a longtemps été le symbole de la lourdeur ultime, mais il est loin d'être le tenant du titre. Sur Terre, l'élément naturel le plus dense est l'Osmium (numéro atomique 76). Il est deux fois plus dense que le plomb. Si l'on coulait un simple ballon de football en Osmium massif, celui-ci pèserait près de 125 kilogrammes. Malgré sa masse atomique inférieure à celle de l'uranium, sa structure cristalline est si incroyablement compactée qu'il détient le record absolu de densité matérielle chimique mesurable.`,
		en: `Lead has long been the symbol of ultimate heaviness, but it is far from holding the title. On Earth, the densest naturally occurring element is osmium (atomic number 76). It is twice as dense as lead. If you cast a simple soccer ball out of solid osmium, it would weigh nearly 125 kilograms. Despite an atomic mass lower than uranium's, its crystal structure is so incredibly compact that it holds the absolute record for measurable chemical material density.`
	},
	sources: [
		{
			name: { fr: 'The Densities of Osmium and Iridium (J.W. Arblaster, Platinum Metals Review, 1989)', en: 'The Densities of Osmium and Iridium (J.W. Arblaster, Platinum Metals Review, 1989)' },
			url: 'https://technology.matthey.com/article/33/1/14-16/'
		}
	],
	contexts: [
		{
			title: { fr: 'Contraction des lanthanides et maille hexagonale', en: 'Lanthanide contraction and the hexagonal lattice' },
			body: {
				fr: `La densité macroscopique $\\rho$ dérive directement du volume de la maille élémentaire du cristal. L'Osmium possède une structure hexagonale compacte (hcp). Bien que le noyau d'uranium (238 u) soit plus lourd que l'Osmium (190,2 u), le nuage électronique de l'Osmium subit fortement l'attraction du noyau (effet d'écran faible des orbitales f, appelé contraction des lanthanides), ce qui réduit drastiquement son rayon atomique empirique à 130 pm. L'équation de la densité cristallographique donne :\n\n$$\\rho = \\frac{Z \\times M}{N_A \\times V_c} \\approx 22,59 \\text{ g/cm}^3$$\n\n(où $Z$ est le motif par maille et $V_c$ le volume microscopique de la maille).`,
				en: `Macroscopic density $\\rho$ derives directly from the volume of the crystal's unit cell. Osmium has a hexagonal close-packed (hcp) structure. Although the uranium nucleus (238 u) is heavier than osmium's (190.2 u), osmium's electron cloud is strongly pulled in by nuclear attraction (weak shielding effect of the f orbitals, called lanthanide contraction), drastically reducing its empirical atomic radius to 130 pm. The crystallographic density equation gives:\n\n$$\\rho = \\frac{Z \\times M}{N_A \\times V_c} \\approx 22.59 \\text{ g/cm}^3$$\n\n(where $Z$ is the number of formula units per cell and $V_c$ the microscopic volume of the cell).`
			},
			external: false
		}
	]
};
