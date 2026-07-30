export default {
	id: 'anecdote_dernier_theoreme_fermat',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-30',
	domain: { fr: 'Mathématiques - Théorie des nombres', en: 'Mathematics - Number Theory' },
	scheduling: { type: 'annual', dates: ['06-23'] },
	content: (lang, year) => {
		const elapsed = year - 1993;
		return lang === 'fr'
			? `Le 23 juin ${year === 1993 ? '1993' : `1993, il y a ${elapsed} ans`}, Andrew Wiles annonçait à l'Institut Isaac Newton de Cambridge une démonstration du dernier théorème de Fermat, clôturant une conjecture énoncée par Pierre de Fermat en 1637 et restée ouverte pendant 356 ans.`
			: `On June 23${year === 1993 ? ', 1993' : `, 1993 - ${elapsed} years ago`}, Andrew Wiles announced at the Isaac Newton Institute in Cambridge a proof of Fermat's Last Theorem, closing a conjecture stated by Pierre de Fermat in 1637 and left open for 356 years.`;
	},
	sources: [
		{
			name: { fr: 'Annals of Mathematics', en: 'Annals of Mathematics' },
			url: 'https://annals.math.princeton.edu/1995/141-3/p01'
		}
	],
	contexts: [
		{
			title: { fr: "L'énoncé et la faille initiale", en: 'The statement and the initial gap' },
			body: {
				fr: `Le théorème énonce qu'il n'existe aucun triplet d'entiers strictement positifs $(a, b, c)$ tel que $a^n + b^n = c^n$ pour un entier $n$ strictement supérieur à 2.\n\nLa première version de la preuve de Wiles, présentée en juin 1993, contenait une erreur dans l'estimation de la taille d'un groupe de Selmer, découverte par Nick Katz lors de la relecture. Wiles corrigea la faille en collaboration avec Richard Taylor, en s'appuyant sur les techniques de la théorie d'Iwasawa, et publia la preuve complète en 1995.\n\nLa démonstration repose sur la conjecture de modularité (Taniyama-Shimura-Weil) restreinte aux courbes elliptiques semi-stables, reliant courbes elliptiques et formes modulaires, un pont qui n'existait pas au XVIIe siècle.`,
				en: `The theorem states that there is no triple of strictly positive integers $(a, b, c)$ such that $a^n + b^n = c^n$ for any integer $n$ strictly greater than 2.\n\nThe first version of Wiles's proof, presented in June 1993, contained an error in the estimation of the size of a Selmer group, discovered by Nick Katz during review. Wiles fixed the gap in collaboration with Richard Taylor, drawing on techniques from Iwasawa theory, and published the complete proof in 1995.\n\nThe proof relies on the modularity conjecture (Taniyama-Shimura-Weil) restricted to semistable elliptic curves, linking elliptic curves and modular forms, a bridge that did not exist in the 17th century.`
			},
			external: false
		}
	]
};
