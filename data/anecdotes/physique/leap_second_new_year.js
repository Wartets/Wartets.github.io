export default {
	id: 'anecdote_leap_second_new_year',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Physique - Métrologie du Temps', en: 'Physics - Time Metrology' },
	scheduling: { type: 'period', dates: ['12-28', '01-02'] },
	content: {
		fr: `Certaines nuits de la Saint-Sylvestre ont duré une seconde de plus que les autres. Depuis 1972, le Service international de la rotation terrestre a inséré à 27 reprises une « seconde intercalaire » à minuit UTC, le plus souvent le 31 décembre ou le 30 juin, afin de compenser le fait que la Terre ne tourne pas assez régulièrement pour rester parfaitement synchronisée avec les horloges atomiques. En 2022, la communauté scientifique a décidé d'abandonner cette pratique à partir de 2035, ses effets perturbateurs sur les systèmes informatiques mondiaux dépassant désormais son intérêt.`,
		en: `Some New Year's Eve nights have lasted one second longer than usual. Since 1972, the International Earth Rotation Service has inserted 27 "leap seconds" at UTC midnight, most often on December 31 or June 30, to compensate for the fact that Earth does not rotate regularly enough to stay perfectly synchronized with atomic clocks. In 2022, the scientific community decided to abandon this practice starting in 2035, as its disruptive effects on global computer systems now outweigh its usefulness.`
	},
	sources: [
		{
			name: { fr: 'A proposal to change the leap-second adjustments to UTC (J. Levine, P. Tavella, M. Milton, Metrologia, 2023)', en: 'A proposal to change the leap-second adjustments to UTC (J. Levine, P. Tavella, M. Milton, Metrologia, 2023)' },
			url: 'https://doi.org/10.1088/1681-7575/ac9da5'
		}
	],
	contexts: [
		{
			title: { fr: 'Temps atomique, UT1 et l\'écart maximal toléré', en: 'Atomic time, UT1, and the maximum tolerated gap' },
			body: {
				fr: `Le Temps Atomique International (TAI) découle du comptage d'oscillations d'horloges au césium, parfaitement régulier par définition. Le temps UT1, lui, suit la rotation réelle de la Terre, ralentie de façon irrégulière par le frottement des marées, les échanges de moment cinétique entre le noyau et le manteau, ou le rebond post-glaciaire. Le temps civil UTC est maintenu artificiellement proche de UT1 par convention internationale :\n\n$$|UT1 - UTC| \\le 0{,}9\\ \\text{s}$$\n\nChaque fois que cet écart menace de dépasser le seuil, une seconde intercalaire est ajoutée.`,
				en: `International Atomic Time (TAI) results from counting oscillations of cesium clocks, perfectly regular by definition. UT1, on the other hand, follows Earth's actual rotation, slowed irregularly by tidal friction, angular momentum exchange between the core and mantle, or post-glacial rebound. Civil time UTC is kept artificially close to UT1 by international convention:\n\n$$|UT1 - UTC| \\le 0.9\\ \\text{s}$$\n\nWhenever this gap threatens to exceed the threshold, a leap second is inserted.`
			},
			external: false
		}
	]
};
