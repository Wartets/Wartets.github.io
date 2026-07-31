export default {
	id: 'anecdote_monstrous_moonshine',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Mathématiques - Théorie des Groupes', en: 'Mathematics - Group Theory' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1978, le mathématicien John McKay remarqua une coïncidence numérique en apparence absurde : le premier coefficient non trivial de la fonction modulaire j (196884) est égal, à 1 près, à la dimension de la plus petite représentation irréductible non triviale du groupe Monstre. Cette observation, d'abord moquée sous le nom de « moonshine », a révélé un pont profond entre théorie des groupes finis, formes modulaires et théorie des cordes.`,
		en: `In 1978, mathematician John McKay noticed a seemingly absurd numerical coincidence: the first non-trivial coefficient of the modular j-function (196884) equals, to within 1, the dimension of the smallest non-trivial irreducible representation of the Monster group. This observation, initially mocked as "moonshine", revealed a deep bridge between finite group theory, modular forms, and string theory.`
	},
	sources: [
		{
			name: { fr: 'Monstrous Moonshine (1979)', en: 'Monstrous Moonshine (1979)' },
			url: 'https://londmathsoc.onlinelibrary.wiley.com/doi/abs/10.1112/blms/11.3.308'
		},
		{
			name: { fr: 'Monstrous moonshine and string theory (IAS)', en: 'Monstrous moonshine and string theory (IAS)' },
			url: 'https://www.ias.edu/ideas/2012/duncan-monstrous-moonshine'
		}
	],
	contexts: [
		{
			title: { fr: 'Développement en série et algèbres vertex', en: 'Series expansion and vertex algebras' },
			body: {
				fr: `Le j-invariant de Klein $j(\\tau)$ admet un développement de Fourier en posant $q = e^{2i\\pi\\tau}$ :\n\n$$j(\\tau) = \\frac{1}{q} + 744 + 196884q + 21493760q^2 + \\dots$$\n\nLe groupe Monstre, plus grand des groupes simples sporadiques, possède des représentations irréductibles de dimensions $r_1 = 1$, $r_2 = 196883$, $r_3 = 21296876$, etc. McKay remarqua que $196884 = 196883 + 1 = r_2 + r_1$.\n\nLa conjecture, formalisée par Conway et Norton, fut finalement démontrée par Richard Borcherds en 1992 grâce aux algèbres d'opérateurs vertex, lui valant la médaille Fields en 1998.`,
				en: `Klein's j-invariant $j(\\tau)$ admits a Fourier expansion with $q = e^{2i\\pi\\tau}$:\n\n$$j(\\tau) = \\frac{1}{q} + 744 + 196884q + 21493760q^2 + \\dots$$\n\nThe Monster group, the largest sporadic simple group, has irreducible representations of dimensions $r_1 = 1$, $r_2 = 196883$, $r_3 = 21296876$, and so on. McKay noticed that $196884 = 196883 + 1 = r_2 + r_1$.\n\nThe conjecture, formalized by Conway and Norton, was finally proven by Richard Borcherds in 1992 using vertex operator algebras, earning him the Fields Medal in 1998.`
			},
			external: false
		}
	]
};
