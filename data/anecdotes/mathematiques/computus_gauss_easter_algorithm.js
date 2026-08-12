export default {
	id: 'anecdote_computus_gauss_easter_algorithm',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Mathématiques - Arithmétique Modulaire', en: 'Mathematics - Modular Arithmetic' },
	scheduling: { type: 'period', dates: ['03-15', '04-25'] },
	content: {
		fr: `Depuis le concile de Nicée en 325, Pâques est fixée au premier dimanche suivant la première pleine lune survenant à l'équinoxe de printemps ou après. Faire coïncider un calendrier solaire et un cycle lunaire pour prédire cette date à l'avance, sans aucune observation astronomique, donna naissance à toute une discipline mathématique appelée « computus ». En 1800, Carl Friedrich Gauss publia un algorithme remarquablement compact, reposant uniquement sur l'arithmétique modulaire, capable de calculer la date exacte de Pâques pour n'importe quelle année du calendrier grégorien.`,
		en: `Since the Council of Nicaea in 325, Easter has been fixed as the first Sunday following the first full moon occurring on or after the spring equinox. Reconciling a solar calendar with a lunar cycle to predict this date in advance, without any astronomical observation, gave rise to an entire mathematical discipline called "computus". In 1800, Carl Friedrich Gauss published a remarkably compact algorithm, relying purely on modular arithmetic, capable of computing the exact date of Easter for any year of the Gregorian calendar.`
	},
	sources: [
		{
			name: {
				fr: 'IMCCE - Détermination de la date de Pâques',
				en: 'IMCCE - Determination of Easter date'
			},
			url: 'https://promenade.imcce.fr/fr/pages4/442.html'
		}
	],
	contexts: [
		{
			title: { fr: 'L\'algorithme modulaire de Gauss', en: "Gauss's modular algorithm" },
			body: {
				fr: `Pour une année $Y$ du calendrier grégorien, on calcule d'abord trois restes liés respectivement au cycle métonique de 19 ans, au cycle bissextile de 4 ans, et à la semaine de 7 jours :\n\n$$a = Y \\bmod 19, \\quad b = Y \\bmod 4, \\quad c = Y \\bmod 7$$\n\nCes valeurs, combinées à des termes correctifs $M$ et $N$ dépendant du siècle (pour compenser les irrégularités introduites par la réforme grégorienne), permettent de calculer une épacte $d$ et un décalage $e$ :\n\n$$d = (19a + M) \\bmod 30, \\qquad e = (2b + 4c + 6d + N) \\bmod 7$$\n\nPâques tombe alors le $(22 + d + e)$ mars, ou le $(d + e - 9)$ avril si cette somme dépasse 31, avec de rares exceptions destinées à éviter que Pâques ne coïncide exactement avec la Pâque juive.`,
				en: `For a year $Y$ of the Gregorian calendar, three remainders are first computed, tied respectively to the 19-year Metonic cycle, the 4-year leap cycle, and the 7-day week:\n\n$$a = Y \\bmod 19, \\quad b = Y \\bmod 4, \\quad c = Y \\bmod 7$$\n\nThese values, combined with correction terms $M$ and $N$ depending on the century (to compensate for irregularities introduced by the Gregorian reform), give an epact $d$ and an offset $e$:\n\n$$d = (19a + M) \\bmod 30, \\qquad e = (2b + 4c + 6d + N) \\bmod 7$$\n\nEaster then falls on March $(22 + d + e)$, or April $(d + e - 9)$ if this sum exceeds 31, with a few rare exceptions designed to prevent Easter from coinciding exactly with Jewish Passover.`
			},
			external: false
		}
	]
};
