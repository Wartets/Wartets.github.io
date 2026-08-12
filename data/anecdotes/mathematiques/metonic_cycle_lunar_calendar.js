export default {
	id: 'anecdote_metonic_cycle_lunar_calendar',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Mathématiques - Astronomie du Calendrier', en: 'Mathematics - Calendrical Astronomy' },
	scheduling: { type: 'period', dates: ['01-15', '02-20'] },
	content: {
		fr: `La date variable du Nouvel An chinois, comprise entre le 21 janvier et le 20 février, comme celle de nombreux calendriers luni-solaires, repose sur une coïncidence numérique remarquable découverte indépendamment vers 432 avant notre ère par l'astronome grec Méton d'Athènes et par des astronomes chinois : 19 années solaires correspondent presque exactement à 235 mois lunaires synodiques, avec un écart d'à peine deux heures, ce qui permet d'intercaler régulièrement des mois lunaires supplémentaires pour maintenir le calendrier lunaire aligné sur les saisons.`,
		en: `The variable date of Chinese New Year, falling between January 21 and February 20, like that of many lunisolar calendars, rests on a remarkable numerical coincidence discovered independently around 432 BCE by the Greek astronomer Meton of Athens and by Chinese astronomers: 19 solar years correspond almost exactly to 235 synodic lunar months, with a discrepancy of barely two hours, allowing extra lunar months to be regularly intercalated to keep the lunar calendar aligned with the seasons.`
	},
	sources: [
		{
			name: { fr: 'Britannica - Metonic cycle', en: 'Britannica - Metonic cycle' },
			url: 'https://www.britannica.com/science/Metonic-cycle'
		}
	],
	contexts: [
		{
			title: { fr: 'La coïncidence numérique du cycle métonique', en: 'The numerical coincidence of the Metonic cycle' },
			body: {
				fr: `L'année tropique vaut environ 365,2422 jours et le mois synodique (lunaison complète) environ 29,5306 jours. Le cycle métonique repose sur la coïncidence :\n\n$$19 \\times 365{,}2422 \\approx 235 \\times 29{,}5306 \\approx 6939{,}6\\ \\text{jours}$$\n\nl'écart entre les deux membres n'étant que de quelques heures sur dix-neuf ans. Sur les dix-neuf années du cycle, sept reçoivent un mois lunaire intercalaire supplémentaire (dans le calendrier chinois comme dans le calendrier hébraïque), selon un motif régulier qui répartit ces années embolismiques à intervalles réguliers de deux ou trois ans.`,
				en: `The tropical year is about 365.2422 days and the synodic month (full lunation) about 29.5306 days. The Metonic cycle rests on the coincidence:\n\n$$19 \\times 365.2422 \\approx 235 \\times 29.5306 \\approx 6939.6\\ \\text{days}$$\n\nwith the gap between the two sides amounting to only a few hours over nineteen years. Of the nineteen years in the cycle, seven receive an extra intercalary lunar month (in both the Chinese and Hebrew calendars), following a regular pattern that spaces these embolismic years at intervals of two or three years.`
			},
			external: false
		}
	]
};
