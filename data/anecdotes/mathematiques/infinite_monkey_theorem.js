export default {
	id: 'anecdote_infinite_monkey_theorem',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Théorie des Probabilités', en: 'Probability Theory' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `C'est une métaphore célèbre pour illustrer la puissance vertigineuse du concept d'infini mathématique. Si l'on place un singe immortel devant une machine à écrire et qu'il tape de manière strictement aléatoire et infinie sur les touches, il est mathématiquement certain qu'il finira par taper l'intégralité du texte de « Hamlet » de William Shakespeare sans aucune faute de frappe. Bien que le temps nécessaire dépasse largement l'âge de l'univers, la probabilité, à mesure que le nombre d'essais tend vers l'infini, converge irrémédiablement vers une certitude absolue.`,
		en: `This is a famous metaphor illustrating the dizzying power of the mathematical concept of infinity. If an immortal monkey is placed in front of a typewriter and types strictly randomly and forever, it is mathematically certain that it will eventually type the entire text of William Shakespeare's "Hamlet" without a single typo. Although the time required vastly exceeds the age of the universe, as the number of trials tends toward infinity the probability converges irremediably toward absolute certainty.`
	},
	sources: [
		{
			name: { fr: 'Mécanique Statistique et Irréversibilité (É. Borel, Journal de Physique Théorique et Appliquée, 1913)', en: 'Mécanique Statistique et Irréversibilité (É. Borel, Journal de Physique Théorique et Appliquée, 1913)' },
			url: 'https://hal.science/jpa-00241832/document'
		}
	],
	contexts: [
		{
			title: { fr: 'Lemme de Borel-Cantelli et probabilités asymptotiques', en: 'The Borel-Cantelli lemma and asymptotic probabilities' },
			body: {
				fr: `Supposons une machine à 50 touches et un texte objectif de $N$ caractères. La probabilité de taper correctement les $N$ caractères du premier coup est $p = (1/50)^N$, un nombre infiniment petit mais non nul. La probabilité d'échouer sur un bloc de $N$ touches est $q = 1 - p$. Si le singe tape indépendamment $k$ blocs successifs, la probabilité d'échouer à chaque fois est $q^k = (1-p)^k$. En appliquant les lois des limites à l'infini :\n\n$$\\lim_{k \\to \\infty} P(\\text{Échec constant}) = \\lim_{k \\to \\infty} (1-p)^k = 0$$\n\nLa probabilité de réussite est donc $1 - 0 = 1$ : un événement presque sûr.`,
				en: `Suppose a typewriter with 50 keys and a target text of $N$ characters. The probability of typing the $N$ characters correctly on the first try is $p = (1/50)^N$, an infinitesimally small but non-zero number. The probability of failing on a block of $N$ keystrokes is $q = 1 - p$. If the monkey independently types $k$ successive blocks, the probability of failing every time is $q^k = (1-p)^k$. Applying the laws of limits at infinity:\n\n$$\\lim_{k \\to \\infty} P(\\text{Constant failure}) = \\lim_{k \\to \\infty} (1-p)^k = 0$$\n\nThe probability of success is therefore $1 - 0 = 1$: an almost sure event.`
			},
			external: false
		}
	]
};
