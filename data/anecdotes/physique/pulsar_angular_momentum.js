export default {
	id: 'anecdote_pulsar_angular_momentum',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Astrophysique / Mécanique', en: 'Astrophysics / Mechanics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Lorsqu'un patineur artistique tourne sur la glace et ramène ses bras contre son corps, il se met à tourner beaucoup plus vite : c'est le principe de conservation du moment cinétique. Ce même principe s'applique à l'échelle des étoiles. Lorsqu'une étoile massive meurt, son noyau de la taille du Soleil, qui tournait sur lui-même en un mois, s'effondre pour former une étoile à neutrons de la taille d'une petite ville (environ 20 km). Pour conserver son impulsion de rotation, elle doit accélérer, atteignant parfois des centaines de tours par seconde. Ces étoiles hyper-rapides, qui flashent comme des phares, sont appelées des pulsars.`,
		en: `When a figure skater spins on the ice and pulls their arms in against their body, they begin spinning much faster: this is the principle of conservation of angular momentum. The same principle applies on the scale of stars. When a massive star dies, its Sun-sized core, which had been rotating once a month, collapses to form a neutron star the size of a small city (about 20 km). To conserve its rotational momentum, it must speed up, sometimes reaching hundreds of rotations per second. These hyper-fast stars, flashing like lighthouses, are called pulsars.`
	},
	sources: [
		{
			name: { fr: 'Observation of a Rapidly Pulsating Radio Source (A. Hewish, S.J. Bell et al., Nature, 1968)', en: 'Observation of a Rapidly Pulsating Radio Source (A. Hewish, S.J. Bell et al., Nature, 1968)' },
			url: 'https://www.nature.com/articles/217709a0'
		}
	],
	contexts: [
		{
			title: { fr: 'Moment d\'inertie et conservation du moment cinétique', en: 'Moment of inertia and conservation of angular momentum' },
			body: {
				fr: `En l'absence de couple externe, le moment cinétique scalaire $L = I\\omega$ est conservé, où $I$ est le moment d'inertie et $\\omega$ la vitesse angulaire. En modélisant l'étoile par une sphère de densité uniforme, $I = \\frac{2}{5} M R^2$. Les états initial (noyau stellaire) et final (étoile à neutrons) obéissent à la relation :\n\n$$\\frac{2}{5} M R_i^2 \\omega_i = \\frac{2}{5} M R_f^2 \\omega_f \\implies \\omega_f = \\omega_i \\left( \\frac{R_i}{R_f} \\right)^2$$\n\nLe rapport des rayons étant de l'ordre de $10^5$, la fréquence de rotation finale est augmentée d'un facteur $10^{10}$.`,
				en: `In the absence of an external torque, the scalar angular momentum $L = I\\omega$ is conserved, where $I$ is the moment of inertia and $\\omega$ the angular velocity. Modeling the star as a uniform-density sphere gives $I = \\frac{2}{5} M R^2$. The initial (stellar core) and final (neutron star) states obey the relation:\n\n$$\\frac{2}{5} M R_i^2 \\omega_i = \\frac{2}{5} M R_f^2 \\omega_f \\implies \\omega_f = \\omega_i \\left( \\frac{R_i}{R_f} \\right)^2$$\n\nSince the ratio of radii is on the order of $10^5$, the final rotation frequency is increased by a factor of $10^{10}$.`
			},
			external: false
		}
	]
};
