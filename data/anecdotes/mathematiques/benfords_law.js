export default {
	id: 'anecdote_benfords_law',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Statistiques Appliquées', en: 'Applied Statistics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Si l'on vous demande de générer des nombres aléatoires pour falsifier une déclaration d'impôts, vous veillerez probablement à ce que tous les chiffres de 1 à 9 apparaissent de manière équilibrée au début de vos montants. C'est l'erreur fatale. Dans des ensembles de données naturels (tailles de populations, constantes physiques, factures), le chiffre « 1 » apparaît comme premier chiffre environ 30 % du temps, contre seulement 4,5 % pour le chiffre « 9 ». Cette contre-intuitive « Loi de Benford » est aujourd'hui utilisée par les auditeurs fiscaux pour détecter les données fabriquées par les humains.`,
		en: `If asked to generate random numbers to falsify a tax return, you would probably make sure all digits from 1 to 9 appear evenly at the start of your amounts. That is the fatal mistake. In natural datasets (population sizes, physical constants, invoices), the digit "1" appears as the leading digit about 30% of the time, versus only 4.5% for the digit "9". This counterintuitive "Benford's Law" is used today by tax auditors to detect data fabricated by humans.`
	},
	sources: [
		{
			name: { fr: 'The Law of Anomalous Numbers (F. Benford, Proceedings of the American Philosophical Society, 1938)', en: 'The Law of Anomalous Numbers (F. Benford, Proceedings of the American Philosophical Society, 1938)' },
			url: 'https://www.jstor.org/stable/984802'
		}
	],
	contexts: [
		{
			title: { fr: 'Invariance d\'échelle et distribution logarithmique', en: 'Scale invariance and logarithmic distribution' },
			body: {
				fr: `La loi émerge naturellement dans tout ensemble de données couvrant plusieurs ordres de grandeur, car l'espacement entre les nombres suit une échelle logarithmique. Si un phénomène croît exponentiellement (comme des intérêts bancaires), il passe beaucoup plus de temps dans la tranche « 100 à 199 » que dans la tranche « 900 à 999 » avant de passer à l'ordre supérieur. La probabilité qu'un nombre commence par le chiffre $d$ (de 1 à 9) s'écrit :\n\n$$P(d) = \\log_{10}\\left(1 + \\frac{1}{d}\\right) = \\log_{10}(d+1) - \\log_{10}(d)$$`,
				en: `The law arises naturally in any dataset spanning several orders of magnitude, because the spacing between numbers follows a logarithmic scale. If a phenomenon grows exponentially (like bank interest), it spends much more time in the "100 to 199" range than in the "900 to 999" range before moving up an order of magnitude. The probability that a number begins with digit $d$ (from 1 to 9) is given by:\n\n$$P(d) = \\log_{10}\\left(1 + \\frac{1}{d}\\right) = \\log_{10}(d+1) - \\log_{10}(d)$$`
			},
			external: false
		}
	]
};
