export default {
	id: 'anecdote_christmas_lights_circuits',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Physique - Électrocinétique', en: 'Physics - Electrical Circuits' },
	scheduling: { type: 'period', dates: ['12-05', '12-26'] },
	content: {
		fr: `Jusque dans les années 1960, il suffisait qu'un seul filament d'ampoule s'use pour plonger tout le sapin de Noël dans le noir, obligeant à tester chaque ampoule une par une. Cette panne caractéristique tenait à un choix électrique précis : le circuit en série, où toutes les ampoules partagent une seule et même boucle de courant. La moindre coupure interrompt l'ensemble du circuit. Les guirlandes modernes, câblées en parallèle ou en petits groupes shuntés, ont mis fin à ce désagrément en isolant chaque défaillance individuelle.`,
		en: `Until the 1960s, a single burnt-out filament was enough to plunge the entire Christmas tree into darkness, forcing you to test every bulb one by one. This characteristic failure came down to a specific electrical choice: the series circuit, in which every bulb shares one single current loop. The slightest break interrupts the whole circuit. Modern light strings, wired in parallel or in small shunted groups, put an end to this nuisance by isolating each individual failure.`
	},
	sources: [
		{
			name: { fr: 'Physics of holiday lights (J. J. Birriel, The Physics Teacher, 2024)', en: 'Physics of holiday lights (J. J. Birriel, The Physics Teacher, 2024)' },
			url: 'https://doi.org/10.1119/5.0195689'
		}
	],
	contexts: [
		{
			title: { fr: 'Loi des mailles et loi des nœuds de Kirchhoff', en: "Kirchhoff's voltage and current laws" },
			body: {
				fr: `Dans un circuit série, l'intensité $I$ est identique en tout point de la boucle, et la loi des mailles de Kirchhoff impose que la tension totale se répartisse entre les éléments :\n\n$$V_{total} = \\sum_i V_i$$\n\nSi une ampoule grille, la boucle est ouverte et $I = 0$ partout : toute la guirlande s'éteint. Dans un circuit parallèle, c'est la tension qui est identique aux bornes de chaque branche, tandis que la loi des nœuds impose que le courant total se répartisse entre les branches :\n\n$$I_{total} = \\sum_i I_i$$\n\nLa défaillance d'une branche ne modifie que très marginalement la résistance équivalente du réseau, laissant les autres ampoules fonctionner normalement.`,
				en: `In a series circuit, the current $I$ is identical at every point of the loop, and Kirchhoff's voltage law requires the total voltage to be shared among the elements:\n\n$$V_{total} = \\sum_i V_i$$\n\nIf one bulb burns out, the loop is broken and $I = 0$ everywhere: the whole string goes dark. In a parallel circuit, it is the voltage across each branch that stays identical, while Kirchhoff's current law requires the total current to be split among the branches:\n\n$$I_{total} = \\sum_i I_i$$\n\nThe failure of one branch only marginally changes the equivalent resistance of the network, leaving the other bulbs working normally.`
			},
			external: false
		}
	]
};
