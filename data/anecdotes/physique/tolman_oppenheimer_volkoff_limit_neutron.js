export default {
	id: 'anecdote_tolman_oppenheimer_volkoff_limit_neutron',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Astrophysique Relativiste', en: 'Relativistic Astrophysics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Lorsqu'une étoile massive épuise son carburant et s'effondre en supernova, elle laisse derrière elle un noyau extraordinairement dense : une étoile à neutrons. En 1939, J. Robert Oppenheimer et George Volkoff calculent la masse maximale que ce résidu peut supporter avant que même la pression de dégénérescence des neutrons ne suffise plus à contenir la gravité. Au-delà de cette limite, l'effondrement se poursuit inévitablement jusqu'à former un trou noir.`,
		en: `When a massive star exhausts its fuel and collapses in a supernova, it leaves behind an extraordinarily dense core: a neutron star. In 1939, J. Robert Oppenheimer and George Volkoff calculated the maximum mass this remnant can support before even the degeneracy pressure of neutrons is no longer enough to hold back gravity. Beyond this limit, collapse inevitably continues until a black hole forms.`
	},
	sources: [
		{
			name: { fr: 'On Massive Neutron Cores (J. R. Oppenheimer, G. M. Volkoff, Physical Review, 1939)', en: 'On Massive Neutron Cores (J. R. Oppenheimer, G. M. Volkoff, Physical Review, 1939)' },
			url: 'https://doi.org/10.1103/PhysRev.55.374'
		}
	],
	contexts: [
		{
			title: { fr: 'Pression de dégénérescence et équilibre relativiste', en: 'Degeneracy pressure and relativistic equilibrium' },
			body: {
				fr: `Les neutrons, fermions de spin 1/2, obéissent au principe d'exclusion de Pauli : deux d'entre eux ne peuvent occuper le même état quantique. À densité extrême, cette contrainte génère une pression de dégénérescence répulsive indépendante de la température. Contrairement au cas newtonien de la limite de Chandrasekhar, l'équilibre hydrostatique de l'étoile à neutrons doit intégrer la courbure de l'espace-temps via l'équation de Tolman-Oppenheimer-Volkoff :\n\n$$\\frac{dP}{dr} = -\\frac{G}{r^2}\\left(\\rho + \\frac{P}{c^2}\\right)\\left(m(r) + 4\\pi r^3 \\frac{P}{c^2}\\right)\\left(1 - \\frac{2Gm(r)}{rc^2}\\right)^{-1}$$\n\nSelon l'équation d'état encore incertaine de la matière nucléaire dense, cette limite se situe approximativement entre 2,1 et 2,3 masses solaires.`,
				en: `Neutrons, spin-1/2 fermions, obey the Pauli exclusion principle: no two can occupy the same quantum state. At extreme densities, this constraint generates a repulsive degeneracy pressure independent of temperature. Unlike the Newtonian case of the Chandrasekhar limit, the hydrostatic equilibrium of a neutron star must account for spacetime curvature through the Tolman-Oppenheimer-Volkoff equation:\n\n$$\\frac{dP}{dr} = -\\frac{G}{r^2}\\left(\\rho + \\frac{P}{c^2}\\right)\\left(m(r) + 4\\pi r^3 \\frac{P}{c^2}\\right)\\left(1 - \\frac{2Gm(r)}{rc^2}\\right)^{-1}$$\n\nDepending on the still-uncertain equation of state of dense nuclear matter, this limit falls roughly between 2.1 and 2.3 solar masses.`
			},
			external: false
		}
	]
};
