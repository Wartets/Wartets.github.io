export default {
	id: 'anecdote_quantum_tunneling_sun',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Physique Quantique / Astrophysique', en: 'Quantum Physics / Astrophysics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Selon les lois de la thermodynamique classique, le cœur du Soleil n'est pas assez chaud pour briller. La température d'environ 15 millions de degrés ne fournit pas une énergie cinétique suffisante aux protons pour qu'ils puissent vaincre leur répulsion électromagnétique mutuelle et fusionner. Si le Soleil parvient tout de même à s'allumer, c'est grâce à la mécanique quantique. Les protons se comportant comme des ondes de probabilité, il existe une chance infinitésimale mais non nulle qu'ils se « téléportent » littéralement de l'autre côté de la barrière de répulsion. Ce phénomène, appelé « effet tunnel », se produit assez souvent sur l'énorme quantité de matière solaire pour maintenir l'étoile en vie.`,
		en: `According to the laws of classical thermodynamics, the Sun's core is not hot enough to shine. A temperature of about 15 million degrees does not provide protons with enough kinetic energy to overcome their mutual electromagnetic repulsion and fuse. If the Sun manages to ignite anyway, it is thanks to quantum mechanics. Since protons behave as probability waves, there is an infinitesimal but nonzero chance that they will literally "teleport" through the repulsion barrier. This phenomenon, called "quantum tunneling", happens often enough across the Sun's enormous amount of matter to keep the star alive.`
	},
	sources: [
		{
			name: { fr: 'Zur Frage der Aufbaumöglichkeit der Elemente in Sternen (R. d\'E. Atkinson, F. G. Houtermans, Zeitschrift für Physik, 1929)', en: 'Zur Frage der Aufbaumöglichkeit der Elemente in Sternen (R. d\'E. Atkinson, F. G. Houtermans, Zeitschrift für Physik, 1929)' },
			url: 'https://doi.org/10.1007/BF01341595'
		}
	],
	contexts: [
		{
			title: { fr: 'Barrière Coulombienne et Pic de Gamow', en: 'Coulomb barrier and the Gamow peak' },
			body: {
				fr: `L'énergie thermique moyenne d'un proton au centre du Soleil est de l'ordre de $1 \\text{ keV}$, tandis que la barrière de potentiel Coulombien requiert environ $1 \\text{ MeV}$. Le coefficient de transmission quantique à travers une barrière de potentiel $V(r)$ est calculable via l'approximation WKB. La probabilité de pénétration est proportionnelle à $\\exp(-2\\pi\\eta)$, où $\\eta$ est le paramètre de Sommerfeld :\n\n$$\\eta = \\frac{Z_1 Z_2 e^2}{4\\pi\\epsilon_0 \\hbar v}$$\n\nLe taux de fusion thermonucléaire dépend du produit de cette probabilité de transmission (croissante avec l'énergie) et de la distribution de Maxwell-Boltzmann (décroissante avec l'énergie). Le croisement de ces deux exponentielles crée une étroite fenêtre d'énergie efficace appelée « Pic de Gamow », où se produisent la quasi-totalité des réactions de fusion.`,
				en: `The average thermal energy of a proton at the Sun's center is of the order of $1 \\text{ keV}$, while the Coulomb potential barrier requires about $1 \\text{ MeV}$. The quantum transmission coefficient through a potential barrier $V(r)$ can be computed via the WKB approximation. The penetration probability is proportional to $\\exp(-2\\pi\\eta)$, where $\\eta$ is the Sommerfeld parameter:\n\n$$\\eta = \\frac{Z_1 Z_2 e^2}{4\\pi\\epsilon_0 \\hbar v}$$\n\nThe thermonuclear fusion rate depends on the product of this transmission probability (increasing with energy) and the Maxwell-Boltzmann distribution (decreasing with energy). The crossing of these two exponentials creates a narrow effective energy window called the "Gamow peak", where nearly all fusion reactions occur.`
			},
			external: false
		}
	]
};
