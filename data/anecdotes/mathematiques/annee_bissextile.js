export default {
	id: 'anecdote_annee_bissextile',
	enabled: true,
	priority: 1,
	addedDate: '2026-07-30',
	domain: { fr: 'Mathématiques', en: 'Mathematics' },
	scheduling: { type: 'annual', dates: ['02-29'] },
	content: (lang) => lang === 'fr'
		? `Le 29 février n'existe que lorsque l'année est divisible par 4, sauf si elle est divisible par 100 sans l'être par 400.`
		: `February 29 only exists when the year is divisible by 4, unless it is divisible by 100 but not by 400.`,
	sources: [],
	contexts: [
		{
			title: { fr: 'La règle complète', en: 'The full rule' },
			body: {
				fr: `Une année est bissextile si $n \\bmod 4 = 0$ et ($n \\bmod 100 \\neq 0$ ou $n \\bmod 400 = 0$).`,
				en: `A year is a leap year if $n \\bmod 4 = 0$ and ($n \\bmod 100 \\neq 0$ or $n \\bmod 400 = 0$).`
			},
			external: false
		}
	]
};
