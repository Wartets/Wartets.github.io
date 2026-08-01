export default {
	id: 'anecdote_perfect_solar_eclipse_coincidence',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Astronomie / Géométrie', en: 'Astronomy / Geometry' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Les éclipses totales de Soleil telles que nous les voyons depuis la Terre sont une anomalie géométrique unique dans tout le système solaire. Le Soleil a un diamètre environ 400 fois plus grand que celui de notre Lune. Par une extraordinaire coïncidence spatiale, le Soleil se trouve également être environ 400 fois plus éloigné de la Terre que la Lune : dans le ciel, leurs disques s'empilent donc de façon strictement identique, permettant à la Lune de masquer la sphère solaire tout en laissant admirer sa fine couronne atmosphérique.`,
		en: `Total solar eclipses as we see them from Earth are a unique geometric anomaly within the entire Solar System. The Sun has a diameter roughly 400 times greater than that of our Moon. By an extraordinary spatial coincidence, the Sun also happens to be roughly 400 times farther from Earth than the Moon: in the sky, their disks therefore overlap almost exactly, allowing the Moon to hide the solar sphere while still letting its thin atmospheric corona be admired.`
	},
	sources: [
		{
			name: { fr: 'Solar Eclipses: Past and Future (NASA Eclipse Web Site)', en: 'Solar Eclipses: Past and Future (NASA Eclipse Web Site)' },
			url: 'https://eclipse.gsfc.nasa.gov/solar.html'
		}
	],
	contexts: [
		{
			title: { fr: 'Diamètre apparent et approximation des petits angles', en: 'Angular diameter and the small-angle approximation' },
			body: {
				fr: `La taille visuelle d'un objet céleste est définie par son diamètre angulaire $\\theta$. Pour un objet de diamètre physique $D$ situé à une distance $d$ (avec $d \\gg D$), l'angle en radians est donné par l'approximation de l'arc :\n\n$$\\theta \\approx \\frac{D}{d}$$\n\nPour le Soleil, $D_S \\approx 1,39 \\times 10^6$ km et $d_S \\approx 1,50 \\times 10^8$ km, soit $\\theta_S \\approx 0,0093$ rad (environ $0,53°$). Pour la Lune, $D_L \\approx 3474$ km et $d_L \\approx 384\\,400$ km, soit $\\theta_L \\approx 0,0090$ rad. Les deux valeurs sont presque égales. À cause du freinage par les marées, la Lune s'éloigne de la Terre : cette époque d'éclipses parfaites est donc transitoire.`,
				en: `The visual size of a celestial object is defined by its angular diameter $\\theta$. For an object of physical diameter $D$ at a distance $d$ (with $d \\gg D$), the angle in radians is given by the small-arc approximation:\n\n$$\\theta \\approx \\frac{D}{d}$$\n\nFor the Sun, $D_S \\approx 1.39 \\times 10^6$ km and $d_S \\approx 1.50 \\times 10^8$ km, giving $\\theta_S \\approx 0.0093$ rad (about $0.53°$). For the Moon, $D_L \\approx 3474$ km and $d_L \\approx 384{,}400$ km, giving $\\theta_L \\approx 0.0090$ rad. The two values are nearly equal. Because of tidal braking, the Moon is receding from Earth: this era of perfect eclipses is therefore transitory.`
			},
			external: false
		}
	]
};
