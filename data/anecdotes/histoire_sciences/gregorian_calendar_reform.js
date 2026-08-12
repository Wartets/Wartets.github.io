export default {
	id: 'anecdote_gregorian_calendar_reform',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Histoire des Sciences / Astronomie', en: 'History of Science / Astronomy' },
	scheduling: { type: 'period', dates: ['12-29', '01-03'] },
	content: {
		fr: `Le calendrier que nous suivons pour célébrer le 1er janvier n'est en usage que depuis 1582. Cette année-là, la bulle papale « Inter gravissimas » corrigea d'un coup les dix jours accumulés en erreur depuis Jules César, en décrétant que le 4 octobre serait immédiatement suivi du 15 octobre. L'adoption de ce nouveau calendrier fut cependant loin d'être immédiate : la Grande-Bretagne et ses colonies attendirent 1752, et la Russie 1918, laissant des décalages de dates encore sensibles aujourd'hui en généalogie et en histoire.`,
		en: `The calendar we now follow to celebrate January 1st has only been in use since 1582. That year, the papal bull "Inter gravissimas" corrected in one stroke the ten days of accumulated error inherited from Julius Caesar's calendar, decreeing that October 4 would be immediately followed by October 15. Adoption of this new calendar was, however, far from immediate: Britain and its colonies waited until 1752, and Russia until 1918, leaving date discrepancies still noticeable today in genealogy and history.`
	},
	sources: [
		{
			name: { fr: 'Britannica - Gregorian calendar', en: 'Britannica - Gregorian calendar' },
			url: 'https://www.britannica.com/topic/Gregorian-calendar'
		},
		{
			name: { fr: 'IMCCE - Institut de mécanique céleste et de calcul des éphémérides', en: 'IMCCE - Institute of Celestial Mechanics and Ephemeris Calculation' },
			url: 'https://www.imcce.fr'
		}
	],
	contexts: [
		{
			title: { fr: 'L\'erreur cumulée du calendrier julien', en: "The Julian calendar's accumulated error" },
			body: {
				fr: `Le calendrier julien compte une année moyenne de 365,25 jours (un jour bissextile tous les quatre ans sans exception), contre une année tropique réelle d'environ 365,2422 jours. L'erreur annuelle vaut :\n\n$$\\Delta t = 365{,}25 - 365{,}2422 = 0{,}0078\\ \\text{jour/an}$$\n\nsoit environ un jour de dérive tous les 128 ans. La réforme grégorienne affine la règle des années bissextiles : bissextile si divisible par 4, sauf les années séculaires non divisibles par 400 (1700, 1800, 1900 ne le sont pas ; 2000 l'est). L'année moyenne grégorienne, de 365,2425 jours, ne dérive plus que d'environ un jour tous les 3 300 ans.`,
				en: `The Julian calendar has an average year of 365.25 days (one leap day every four years without exception), against a real tropical year of about 365.2422 days. The annual error is:\n\n$$\\Delta t = 365.25 - 365.2422 = 0.0078\\ \\text{day/year}$$\n\nabout one day of drift every 128 years. The Gregorian reform refines the leap-year rule: leap if divisible by 4, except century years not divisible by 400 (1700, 1800, and 1900 are not; 2000 is). The average Gregorian year, 365.2425 days, now drifts only about one day every 3,300 years.`
			},
			external: false
		}
	]
};
