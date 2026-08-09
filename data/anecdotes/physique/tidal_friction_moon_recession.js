export default {
	id: 'anecdote_tidal_friction_moon_recession',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Mécanique Céleste', en: 'Celestial Mechanics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Les journées de 24 heures que nous vivons ne sont pas définitives. À l'époque des dinosaures, une journée terrestre durait environ 23 heures ; juste après la formation de la Lune, elle durait moins de 10 heures. La cause de ce ralentissement continu est la friction des marées : la gravité de la Lune tire sur nos océans, créant un bourrelet d'eau. La rotation de la Terre entraîne ce bourrelet en avant de la Lune, ce qui agit comme un frein gigantesque sur notre planète. Par transfert d'énergie, la Lune s'éloigne de nous de 3,8 centimètres par an.`,
		en: `The 24-hour days we experience today are not permanent. In the age of the dinosaurs, an Earth day lasted about 23 hours; shortly after the Moon formed, it lasted less than 10 hours. The cause of this continuous slowdown is tidal friction: the Moon's gravity pulls on our oceans, creating a bulge of water. Earth's rotation drags this bulge ahead of the Moon, acting as a gigantic brake on our planet. Through energy transfer, the Moon recedes from us at 3.8 centimeters per year.`
	},
	sources: [
		{
			name: { fr: 'Lunar orbital evolution: A synthesis of recent results (B.G. Bills, R.D. Ray, Geophysical Research Letters, 1999)', en: 'Lunar orbital evolution: A synthesis of recent results (B.G. Bills, R.D. Ray, Geophysical Research Letters, 1999)' },
			url: 'https://doi.org/10.1029/1999GL008348 '
		}
	],
	contexts: [
		{
			title: { fr: 'Conservation du moment cinétique du système Terre-Lune', en: 'Conservation of angular momentum in the Earth-Moon system' },
			body: {
				fr: `En négligeant l'influence solaire, le moment cinétique total $\\vec{L}_{total}$ du système est invariant. Il est la somme du moment cinétique de rotation propre de la Terre $L_T = I_T \\omega_T$ et du moment cinétique orbital de la Lune $L_L = M_L \\sqrt{G(M_T + M_L)a}$, où $a$ est le rayon orbital. Le couple de force de marée dissipe l'énergie de rotation terrestre, donc $d\\omega_T/dt < 0$. Pour que $L_{total}$ reste constant, l'orbite lunaire doit s'élargir :\n\n$$\\frac{dL_{total}}{dt} = I_T \\frac{d\\omega_T}{dt} + \\frac{1}{2} M_L \\sqrt{\\frac{G(M_T+M_L)}{a}} \\frac{da}{dt} = 0 \\implies \\frac{da}{dt} > 0$$`,
				en: `Neglecting solar influence, the total angular momentum $\\vec{L}_{total}$ of the system is conserved. It is the sum of Earth's spin angular momentum $L_T = I_T \\omega_T$ and the Moon's orbital angular momentum $L_L = M_L \\sqrt{G(M_T + M_L)a}$, where $a$ is the orbital radius. Tidal torque dissipates Earth's rotational energy, so $d\\omega_T/dt < 0$. For $L_{total}$ to remain constant, the lunar orbit must widen:\n\n$$\\frac{dL_{total}}{dt} = I_T \\frac{d\\omega_T}{dt} + \\frac{1}{2} M_L \\sqrt{\\frac{G(M_T+M_L)}{a}} \\frac{da}{dt} = 0 \\implies \\frac{da}{dt} > 0$$`
			},
			external: false
		}
	]
};
