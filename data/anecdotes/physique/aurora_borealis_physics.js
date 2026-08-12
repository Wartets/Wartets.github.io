export default {
	id: 'anecdote_aurora_borealis_physics',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Physique - Physique des Plasmas et Magnétosphère', en: 'Physics - Plasma Physics and Magnetosphere' },
	scheduling: { type: 'period', dates: ['12-15', '01-05'] },
	content: {
		fr: `Les longues nuits de la période des fêtes offrent des conditions d'observation idéales pour les aurores boréales. Elles se forment lorsque des particules chargées issues du vent solaire, canalisées le long des lignes de champ magnétique terrestre vers les régions polaires, entrent en collision avec les atomes d'oxygène et d'azote de la haute atmosphère, excitant leurs électrons, qui réémettent ensuite des couleurs caractéristiques : vert pour l'oxygène vers 100 km d'altitude, rouge pour l'oxygène plus en altitude, violet-bleuté pour l'azote ionisé.`,
		en: `The long nights of the holiday season offer prime viewing conditions for the northern lights. They form when charged particles from the solar wind, funneled along Earth's magnetic field lines toward the polar regions, collide with atmospheric oxygen and nitrogen atoms, exciting their electrons, which then re-emit characteristic colors: green from oxygen around 100 km altitude, red from oxygen higher up, and blue-violet from ionized nitrogen.`
	},
	sources: [
		{
			name: { fr: 'Auroral ionization and excitation by incident energetic electrons (M. H. Rees, Planetary and Space Science, 1963)', en: 'Auroral ionization and excitation by incident energetic electrons (M. H. Rees, Planetary and Space Science, 1963)' },
			url: 'https://doi.org/10.1016/0032-0633(63)90252-6'
		}
	],
	contexts: [
		{
			title: { fr: 'Excitation collisionnelle et raies interdites', en: 'Collisional excitation and forbidden lines' },
			body: {
				fr: `Guidées par la force de Lorentz le long des lignes de champ magnétique terrestre,\n\n$$\\vec{F} = q\\vec{v} \\times \\vec{B}$$\n\nles particules chargées viennent percuter les atomes de la haute atmosphère à des altitudes de 100 à 300 km. La raie verte de l'oxygène, à 557,7 nm, correspond à une transition dite « interdite », dont le temps de vie relativement long (environ 0,7 seconde) l'empêche d'apparaître aux basses altitudes trop denses, où les collisions désexcitent l'atome avant qu'il n'ait pu émettre. La raie rouge de l'oxygène à 630,0 nm, encore plus lente, n'apparaît qu'aux altitudes supérieures à 200 km, où l'atmosphère raréfiée laisse le temps à cette transition de se produire.`,
				en: `Guided by the Lorentz force along Earth's magnetic field lines,\n\n$$\\vec{F} = q\\vec{v} \\times \\vec{B}$$\n\ncharged particles strike upper atmospheric atoms at altitudes between 100 and 300 km. Oxygen's green line, at 557.7 nm, corresponds to a so-called "forbidden" transition, whose relatively long lifetime (about 0.7 second) prevents it from appearing at lower, denser altitudes, where collisions de-excite the atom before it can emit. Oxygen's even slower red line at 630.0 nm only appears above 200 km, where the thinner atmosphere gives this transition time to occur.`
			},
			external: false
		}
	]
};
