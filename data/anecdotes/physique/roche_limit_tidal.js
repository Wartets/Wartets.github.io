export default {
	id: 'anecdote_roche_limit_tidal',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Mécanique Céleste / Astrophysique', en: 'Celestial Mechanics / Astrophysics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Pourquoi Saturne possède-t-elle un majestueux système d'anneaux de poussière et de glace plutôt qu'une grande lune sphérique en orbite proche ? L'explication a été formulée en 1848 par l'astronome français Édouard Roche. Il a mathématiquement défini une distance critique de sécurité autour d'une planète. Si une lune s'approche en deçà de cette orbite, la limite de Roche, la force gravitationnelle que la planète exerce sur la face avant de la lune devient si supérieure à celle exercée sur sa face arrière que cette différence, la force de marée, surpasse la gravité interne qui maintient la lune solidaire. La lune est alors littéralement déchiquetée, ses débris s'étalant pour former des anneaux.`,
		en: `Why does Saturn have a majestic system of dust and ice rings rather than a single large spherical moon in close orbit? The explanation was formulated in 1848 by French astronomer Édouard Roche. He mathematically defined a critical safety distance around a planet. If a moon comes closer than this orbit, the Roche limit, the gravitational pull the planet exerts on the moon's near side becomes so much greater than on its far side that this difference, the tidal force, overcomes the moon's own internal gravity holding it together. The moon is then literally torn apart, its debris spreading out to form rings.`
	},
	sources: [
		{
			name: { fr: 'A Simplified Theoretical Treatment and Simulated Experimental Calculation of the Roche Limit (M. C. LoPresto, The Physics Teacher, 2006)', en: 'A Simplified Theoretical Treatment and Simulated Experimental Calculation of the Roche Limit (M. C. LoPresto, The Physics Teacher, 2006)' },
			url: 'https://doi.org/10.1119/1.2336145'
		}
	],
	contexts: [
		{
			title: { fr: 'Gradient gravitationnel et équation d\'équilibre', en: 'Gravitational gradient and equilibrium equation' },
			body: {
				fr: `La limite de Roche évalue le point de rupture où la force de marée différentielle $F_t$ exercée par un corps primaire, masse $M$, rayon $R$, sur un satellite fluide, masse $m$, rayon $r$, compense très exactement l'auto-gravité de confinement $F_g$ de ce dernier. Le gradient de la force de Newton sur le diamètre du satellite permet d'exprimer la force d'étirement :\n\n$$F_t \\approx \\frac{2 G M m r}{d^3} \\quad \\text{contre} \\quad F_g = \\frac{G m^2}{r^2}$$\n\nEn égalisant ces deux forces et en exprimant les masses en fonction des densités volumiques respectives $\\rho_M$ et $\\rho_m$, on obtient la distance d'orbite critique $d$. Pour un satellite dit « fluide », maintenu uniquement par sa propre gravité, le calcul rigoureux de Roche donne la limite absolue :\n\n$$d \\approx 2,423 R \\left( \\frac{\\rho_M}{\\rho_m} \\right)^{1/3}$$`,
				en: `The Roche limit evaluates the breaking point at which the differential tidal force $F_t$ exerted by a primary body, mass $M$, radius $R$, on a fluid satellite, mass $m$, radius $r$, exactly matches the latter's own self-gravity confinement $F_g$. The gradient of the Newtonian force across the satellite's diameter gives the stretching force:\n\n$$F_t \\approx \\frac{2 G M m r}{d^3} \\quad \\text{versus} \\quad F_g = \\frac{G m^2}{r^2}$$\n\nEqualizing these two forces and expressing the masses in terms of their respective bulk densities $\\rho_M$ and $\\rho_m$ gives the critical orbital distance $d$. For a so-called "fluid" satellite, held together only by its own gravity, Roche's rigorous calculation gives the absolute limit:\n\n$$d \\approx 2.423 R \\left( \\frac{\\rho_M}{\\rho_m} \\right)^{1/3}$$`
			},
			external: false
		}
	]
};
