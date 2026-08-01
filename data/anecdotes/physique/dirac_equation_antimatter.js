export default {
	id: 'anecdote_dirac_equation_antimatter',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Mécanique Quantique Relativiste', en: 'Relativistic Quantum Mechanics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1928, le physicien Paul Dirac cherchait une équation décrivant le comportement d'un électron se déplaçant à une vitesse proche de celle de la lumière. Son équation s'avéra parfaite, mais présentait une anomalie dérangeante : comme l'équation $x^2 = 4$ qui possède deux solutions (2 et -2), l'équation de Dirac générait des résultats pour une énergie positive, et d'autres pour une énergie négative, ce qui semblait physiquement impossible. Au lieu d'ignorer ce résultat, Dirac fit confiance à ses mathématiques et déclara qu'il devait exister une « anti-particule » de charge opposée. Quatre ans plus tard, l'anti-électron (positron) était découvert.`,
		en: `In 1928, physicist Paul Dirac was seeking an equation describing the behavior of an electron moving at a speed close to that of light. His equation proved perfect, but carried a troubling anomaly: like the equation $x^2 = 4$, which has two solutions (2 and -2), the Dirac equation produced results for positive energy and for negative energy, which seemed physically impossible. Rather than dismiss the result, Dirac trusted his mathematics and declared that an "anti-particle" of opposite charge must exist. Four years later, the anti-electron (positron) was discovered.`
	},
	sources: [
		{
			name: { fr: 'The Quantum Theory of the Electron (P.A.M. Dirac, Proceedings of the Royal Society of London A, 1928)', en: 'The Quantum Theory of the Electron (P.A.M. Dirac, Proceedings of the Royal Society of London A, 1928)' },
			url: 'https://royalsocietypublishing.org/doi/10.1098/rspa.1928.0023'
		}
	],
	contexts: [
		{
			title: { fr: 'L\'équation de Dirac et la Mer de Dirac', en: 'The Dirac equation and the Dirac sea' },
			body: {
				fr: `L'équation s'écrit de manière covariante à l'aide des matrices de Dirac $\\gamma^\\mu$, qui obéissent à l'algèbre de Clifford :\n\n$$(i\\gamma^\\mu \\partial_\\mu - m)\\psi = 0$$\n\nEn cherchant les ondes planes solutions, on trouve les valeurs propres de l'énergie $E = \\pm\\sqrt{p^2c^2 + m^2c^4}$. Pour éviter que tous les électrons ne tombent dans un niveau d'énergie infiniment négatif en radiant de l'énergie, Dirac postula le principe de Pauli : tous les états d'énergie négative sont déjà remplis, formant la « Mer de Dirac ». Un vide dans cette mer (un trou) se comporte alors comme une particule d'énergie et de charge positives.`,
				en: `The equation is written covariantly using the Dirac matrices $\\gamma^\\mu$, which obey Clifford algebra:\n\n$$(i\\gamma^\\mu \\partial_\\mu - m)\\psi = 0$$\n\nSeeking plane-wave solutions yields the energy eigenvalues $E = \\pm\\sqrt{p^2c^2 + m^2c^4}$. To prevent every electron from falling into an infinitely negative energy level by radiating energy away, Dirac postulated the Pauli principle: every negative-energy state is already filled, forming the "Dirac sea". A vacancy in this sea (a hole) then behaves as a particle of positive energy and positive charge.`
			},
			external: false
		}
	]
};
