export default {
	id: 'anecdote_analemma_equation_of_time',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Physique - Mécanique Céleste', en: 'Physics - Celestial Mechanics' },
	scheduling: { type: 'period', dates: ['06-15', '06-24'] },
	content: {
		fr: `Photographier le Soleil à la même heure d'horloge, chaque jour de l'année, depuis le même endroit, dessine dans le ciel une fine courbe en forme de huit appelée analemme. Cette figure résulte de la combinaison de l'inclinaison de l'axe terrestre (23,44°) et de l'excentricité de l'orbite terrestre (0,0167), qui font que le Soleil apparent est parfois en avance, parfois en retard de près d'un quart d'heure sur l'heure moyenne indiquée par une horloge, un écart appelé équation du temps.`,
		en: `Photographing the Sun at the exact same clock time every day of the year, from the same location, traces a thin figure-eight in the sky called the analemma. This shape results from the combination of Earth's axial tilt (23.44°) and its orbital eccentricity (0.0167), which make the apparent Sun run sometimes almost a quarter hour ahead, sometimes behind, the mean time shown by a clock, a discrepancy known as the equation of time.`
	},
	sources: [
		{
			name: { fr: 'The Equation of Time (D. W. Hughes, B. D. Yallop, C. Y. Hohenkerk, Monthly Notices of the Royal Astronomical Society, 1989)', en: 'The Equation of Time (D. W. Hughes, B. D. Yallop, C. Y. Hohenkerk, Monthly Notices of the Royal Astronomical Society, 1989)' },
			url: 'https://doi.org/10.1093/mnras/238.4.1529'
		}
	],
	contexts: [
		{
			title: { fr: 'Deux contributions astronomiques superposées', en: 'Two superimposed astronomical contributions' },
			body: {
				fr: `L'équation du temps résulte de la somme de deux effets de périodes différentes : l'obliquité de l'écliptique et l'excentricité orbitale. Une approximation empirique classique (Spencer) s'écrit :\n\n$$EoT \\approx 9{,}87\\sin(2B) - 7{,}53\\cos(B) - 1{,}5\\sin(B) \\ \\text{(minutes)}$$\n\navec $B = \\dfrac{360}{365}(d - 81)$ en degrés, $d$ étant le numéro du jour dans l'année. La combinaison d'un terme à période annuelle (excentricité) et d'un terme dominé par une période semestrielle (obliquité), qui ne se compensent pas symétriquement, est précisément ce qui donne à l'analemme sa forme dissymétrique en huit, avec une boucle plus grande que l'autre.`,
				en: `The equation of time results from the sum of two effects with different periods: the obliquity of the ecliptic and orbital eccentricity. A classic empirical approximation (Spencer) is:\n\n$$EoT \\approx 9.87\\sin(2B) - 7.53\\cos(B) - 1.5\\sin(B) \\ \\text{(minutes)}$$\n\nwith $B = \\dfrac{360}{365}(d - 81)$ in degrees, $d$ being the day number of the year. The combination of an annual-period term (eccentricity) and a term dominated by a semiannual period (obliquity), which do not cancel symmetrically, is precisely what gives the analemma its asymmetric figure-eight shape, with one loop larger than the other.`
			},
			external: false
		}
	]
};
