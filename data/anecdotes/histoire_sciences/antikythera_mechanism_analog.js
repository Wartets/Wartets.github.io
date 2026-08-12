export default {
	id: 'anecdote_antikythera_mechanism_analog',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Histoire des Sciences / Astronomie', en: 'History of Science / Astronomy' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Découverte en 1901 dans l'épave d'un navire antique au large de la Grèce, la machine d'Anticythère est datée d'environ 150 avant J.-C. Il s'agit du plus ancien calculateur analogique connu de l'humanité. Composé d'un réseau complexe d'engrenages en bronze, ce mécanisme reproduisait le mouvement des planètes, prédisait les éclipses solaires et lunaires, et synchronisait différents calendriers. Le niveau technologique de cette ingénierie, impliquant des engrenages différentiels épicycloïdaux, a été mystérieusement perdu pendant plus d'un millénaire, n'étant réinventé qu'en Europe lors de la création des horloges astronomiques à la Renaissance.`,
		en: `Discovered in 1901 in the wreck of an ancient ship off the coast of Greece, the Antikythera mechanism is dated to around 150 BC. It is the oldest known analog computer in human history. Made of a complex network of bronze gears, this device reproduced planetary motion, predicted solar and lunar eclipses, and synchronized different calendars. The technological sophistication involved, including epicyclic differential gearing, was mysteriously lost for over a millennium, only being reinvented in Europe with the creation of astronomical clocks during the Renaissance.`
	},
	sources: [
		{
			name: { fr: 'Decoding the ancient Greek astronomical calculator known as the Antikythera Mechanism (T. Freeth et al., Nature, 2006)', en: 'Decoding the ancient Greek astronomical calculator known as the Antikythera Mechanism (T. Freeth et al., Nature, 2006)' },
			url: 'https://www.nature.com/articles/nature05357'
		}
	],
	contexts: [
		{
			title: { fr: 'Modélisation géométrique des orbites elliptiques', en: 'Geometric modeling of elliptical orbits' },
			body: {
				fr: `Bien que les Grecs fussent attachés au modèle géocentrique, ils avaient remarqué que la Lune ne se déplaçait pas à une vitesse constante dans le ciel, première anomalie lunaire, expliquée aujourd'hui par la deuxième loi de Kepler sur une orbite elliptique. La machine modélise cette variation de vitesse grâce à un mécanisme de goupille et d'encoche reliant deux engrenages légèrement désaxés. Mathématiquement, la position angulaire $\\theta$ de l'axe de sortie par rapport à l'axe d'entrée $\\phi$, tournant à vitesse constante $\\omega$ et décalé d'une distance $e$, produit une approximation de l'équation du centre :\n\n$$\\theta \\approx \\phi + \\frac{e}{R} \\sin(\\phi)$$\n\nCela reproduisait mécaniquement les coefficients de Fourier de l'anomalie orbitale.`,
				en: `Although the Greeks favored the geocentric model, they had noticed that the Moon did not move across the sky at constant speed, the first lunar anomaly, explained today by Kepler's second law on an elliptical orbit. The machine models this speed variation through a pin-and-slot mechanism linking two slightly offset gears. Mathematically, the angular position $\\theta$ of the output axis relative to the input axis $\\phi$, rotating at constant speed $\\omega$ and offset by a distance $e$, produces an approximation of the equation of the center:\n\n$$\\theta \\approx \\phi + \\frac{e}{R} \\sin(\\phi)$$\n\nThis mechanically reproduced the Fourier coefficients of the orbital anomaly.`
			},
			external: false
		}
	]
};
