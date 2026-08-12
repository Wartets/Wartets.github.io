export default {
	id: 'anecdote_penrose_process_black_hole',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Relativité Générale - Énergétique Cosmique', en: 'General Relativity - Cosmic Energetics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Serait-il possible de puiser une énergie quasi inépuisable dans un trou noir ? En 1969, Roger Penrose démontre mathématiquement que les trous noirs en rotation sont entourés d'une zone tampon appelée l'ergosphère. Si un objet est envoyé avec une trajectoire précise dans cette zone pour s'y scinder en deux morceaux, l'un plongeant dans le trou noir et l'autre recraché en arrière, ce dernier ressort avec une vitesse accrue, emportant une fraction volée de l'énergie de rotation propre du trou noir.`,
		en: `Could it be possible to draw a nearly inexhaustible amount of energy from a black hole? In 1969, Roger Penrose mathematically demonstrated that rotating black holes are surrounded by a buffer zone called the ergosphere. If an object is sent along a precise trajectory into this zone and splits into two fragments there, one plunging into the black hole and the other flung back outward, the escaping fragment emerges with increased speed, carrying away a stolen fraction of the black hole's own rotational energy.`
	},
	sources: [
		{
			name: { fr: 'Gravitational Collapse: The Role of General Relativity (R. Penrose, Rivista del Nuovo Cimento, 1969)', en: 'Gravitational Collapse: The Role of General Relativity (R. Penrose, Rivista del Nuovo Cimento, 1969)' },
			url: 'https://ui.adsabs.harvard.edu/abs/1969NCimR...1..252P'
		}
	],
	contexts: [
		{
			title: { fr: 'Métrique de Kerr, ergosphère et états d\'énergie négative', en: 'Kerr metric, ergosphere, and negative-energy states' },
			body: {
				fr: `Dans l'espace-temps de Kerr, l'ergosphère est la région entre la limite statique, où la composante $g_{tt}$ du tenseur métrique s'annule, et l'horizon des événements. Tout observateur y est contraint de co-tourner avec le trou noir. L'énergie conservée d'une particule, $E = -p_\\mu \\xi^\\mu$, peut y prendre une valeur négative pour un observateur lointain.\n\nUne particule entrante d'énergie $E_0 > 0$ peut se scinder : une partie $A$ tombe dans l'horizon avec $E_A < 0$, l'autre $B$ s'échappe. Par conservation locale :\n\n$$E_0 = E_A + E_B \\quad \\implies \\quad E_B = E_0 - E_A > E_0$$\n\nLa masse extraite est directement prélevée sur le moment cinétique réductible de la singularité en rotation.`,
				en: `In the Kerr spacetime, the ergosphere is the region between the static limit, where the metric tensor component $g_{tt}$ vanishes, and the event horizon. Any observer there is forced to co-rotate with the black hole. A particle's conserved energy, $E = -p_\\mu \\xi^\\mu$, can take a negative value as seen by a distant observer.\n\nAn incoming particle with energy $E_0 > 0$ can split: fragment $A$ falls into the horizon with $E_A < 0$, while fragment $B$ escapes. By local conservation:\n\n$$E_0 = E_A + E_B \\quad \\implies \\quad E_B = E_0 - E_A > E_0$$\n\nThe extracted mass is drawn directly from the reducible rotational angular momentum of the spinning singularity.`
			},
			external: false
		}
	]
};
