export default {
	id: 'anecdote_cesium_second_definition',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Physique - Métrologie', en: 'Physics - Metrology' },
	scheduling: { type: 'period', dates: ['12-30', '01-01'] },
	content: {
		fr: `Le compte à rebours de minuit du réveillon repose, en dernier ressort, non pas sur la rotation de la Terre mais sur un atome. Depuis 1967, la seconde du Système international n'est plus définie astronomiquement, mais comme la durée de très exactement 9 192 631 770 oscillations du rayonnement correspondant à la transition hyperfine de l'état fondamental de l'atome de césium 133. Ce sont des réseaux d'horloges atomiques comme celles de l'Observatoire de Paris qui, in fine, fixent l'heure officielle du Nouvel An dans le monde entier.`,
		en: `The countdown to midnight on New Year's Eve ultimately relies not on Earth's rotation but on an atom. Since 1967, the SI second has no longer been defined astronomically, but as the duration of exactly 9,192,631,770 oscillations of the radiation corresponding to the hyperfine transition of the ground state of the cesium-133 atom. Networks of atomic clocks, such as those at the Paris Observatory, are what ultimately set the official New Year's time worldwide.`
	},
	sources: [
		{
			name: { fr: 'Résolution 1 de la 13e CGPM : Unité SI de temps (seconde) (Bureau International des Poids et Mesures, 1967)', en: 'Resolution 1 of the 13th CGPM: SI unit of time (second) (International Bureau of Weights and Measures, 1967)' },
			url: 'https://www.bipm.org/en/committees/cg/cgpm/13-1967/resolution-1'
		}
	],
	contexts: [
		{
			title: { fr: 'La transition hyperfine du césium 133', en: 'The cesium-133 hyperfine transition' },
			body: {
				fr: `Le niveau fondamental de l'atome de césium 133 est scindé en deux sous-niveaux très proches par l'interaction entre le spin du noyau et le moment magnétique du cortège électronique (structure hyperfine). La fréquence de résonance associée à la transition entre ces deux sous-niveaux, $\\nu = 9\\,192\\,631\\,770$ Hz, a une valeur fixée exactement depuis la redéfinition du Système international de 2019. Les meilleures horloges atomiques à fontaine de césium atteignent aujourd'hui une exactitude relative de l'ordre de $10^{-16}$, soit une dérive d'environ une seconde sur cent millions d'années.`,
				en: `The ground state of the cesium-133 atom is split into two closely spaced sublevels by the interaction between the nuclear spin and the electron cloud's magnetic moment (hyperfine structure). The resonance frequency associated with the transition between these two sublevels, $\\nu = 9,192,631,770$ Hz, has had its value fixed exactly since the 2019 redefinition of the SI. The best cesium fountain atomic clocks today reach a relative accuracy on the order of $10^{-16}$, a drift of about one second over a hundred million years.`
			},
			external: false
		}
	]
};

