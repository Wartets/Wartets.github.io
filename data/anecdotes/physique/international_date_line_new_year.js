export default {
	id: 'anecdote_international_date_line_new_year',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Physique - Géophysique / Fuseaux Horaires', en: 'Physics - Geophysics / Time Zones' },
	scheduling: { type: 'period', dates: ['12-30', '01-02'] },
	content: {
		fr: `Le passage à la nouvelle année ne se produit pas au même instant partout dans le monde. En raison du découpage de la Terre en fuseaux horaires, minuit du Nouvel An balaie le globe d'est en ouest sur environ 26 heures : les premiers à le célébrer sont les habitants des îles de la Ligne, en République de Kiribati (UTC+14), tandis que les Samoa américaines et l'île Baker (UTC-11), à l'extrémité opposée de la ligne de changement de date, sont les derniers sur Terre à y basculer.`,
		en: `The New Year does not begin at the same instant everywhere on Earth. Because the planet is divided into time zones, New Year's midnight sweeps across the globe from east to west over roughly 26 hours: the first to celebrate it are the inhabitants of the Line Islands in the Republic of Kiribati (UTC+14), while American Samoa and Baker Island (UTC-11), at the opposite end of the International Date Line, are the last places on Earth to cross into it.`
	},
	sources: [
		{
			name: { fr: 'Midnight at the IDL: student confusion and textbook error (K. S. Uhlik, Journal of Geography in Higher Education, 2004)', en: 'Midnight at the IDL: student confusion and textbook error (K. S. Uhlik, Journal of Geography in Higher Education, 2004)' },
			url: 'https://doi.org/10.1080/0309826042000242440'
		}
	],
	contexts: [
		{
			title: { fr: 'Une ligne conventionnelle, non un méridien rectiligne', en: 'A conventional line, not a straight meridian' },
			body: {
				fr: `La ligne de changement de date suit approximativement, mais pas exactement, le méridien à 180°, formant plusieurs zigzags destinés à maintenir des nations ou territoires insulaires sur une seule et même date civile, pour des raisons pratiques et économiques. La République de Kiribati déplaça ainsi sa portion de la ligne vers l'est en 1995 afin d'unifier la date sur l'ensemble de son territoire, gagnant au passage la distinction symbolique d'accueillir le tout premier lever de soleil de chaque nouvelle année sur Terre. L'étendue totale des fuseaux horaires utilisés, de UTC+14 à UTC-11, représente un écart de 25 heures, ce qui signifie que les célébrations du Nouvel An s'étalent, à l'échelle de la planète, sur plus d'une journée civile complète.`,
				en: `The International Date Line roughly, but not exactly, follows the 180° meridian, forming several zigzags designed to keep island nations or territories on a single, consistent civil date for practical and economic reasons. The Republic of Kiribati moved its portion of the line eastward in 1995 to unify the date across its territory, in the process gaining the symbolic distinction of hosting the very first sunrise of each new year on Earth. The full span of time zones in use, from UTC+14 to UTC-11, amounts to a 25-hour gap, meaning that New Year's celebrations, on a planetary scale, stretch across more than one full civil day.`
			},
			external: false
		}
	]
};
