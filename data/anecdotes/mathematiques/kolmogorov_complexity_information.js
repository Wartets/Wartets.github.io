export default {
	id: 'anecdote_kolmogorov_complexity_information',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Mathématiques / Théorie de l\'Information', en: 'Mathematics / Information Theory' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Comment mesurer objectivement la complexité d'une chaîne de caractères ? En 1965, le mathématicien soviétique Andreï Kolmogorov (avec des travaux parallèles de Ray Solomonoff et Gregory Chaitin) propose une réponse radicale : la complexité d'une chaîne est la longueur du plus court programme informatique capable de la produire. Une suite de mille zéros est simple, un programme court suffit à la générer ; une suite de mille caractères réellement aléatoires ne peut, en général, être décrite plus brièvement qu'en la recopiant intégralement.`,
		en: `How can the complexity of a string of characters be measured objectively? In 1965, the Soviet mathematician Andrey Kolmogorov (alongside parallel work by Ray Solomonoff and Gregory Chaitin) proposed a radical answer: the complexity of a string is the length of the shortest computer program able to produce it. A sequence of a thousand zeros is simple, a short program suffices to generate it; a sequence of a thousand genuinely random characters can generally not be described more briefly than by copying it in full.`
	},
	sources: [
		{
			name: { fr: 'Three Approaches to the Quantitative Definition of Information (A. N. Kolmogorov, Problems of Information Transmission, 1965)', en: 'Three Approaches to the Quantitative Definition of Information (A. N. Kolmogorov, Problems of Information Transmission, 1965)' },
			url: 'https://doi.org/10.1080/00207166808803030'
		}
	],
	contexts: [
		{
			title: { fr: 'Une complexité fondamentalement incalculable', en: 'A fundamentally incomputable complexity' },
			body: {
				fr: `La complexité de Kolmogorov $K(x)$ d'une chaîne $x$ est définie comme la longueur, en bits, du plus court programme $p$ pour une machine de Turing universelle $U$ tel que $U(p) = x$. Bien que cette définition soit précise, Chaitin démontra qu'aucun algorithme ne peut, en général, calculer $K(x)$ pour une chaîne $x$ arbitraire : la fonction est incomputable, un résultat étroitement lié au théorème d'incomplétude de Gödel et au problème de l'arrêt de Turing, révélant une limite fondamentale à toute tentative de mesurer objectivement le hasard.`,
				en: `The Kolmogorov complexity $K(x)$ of a string $x$ is defined as the length, in bits, of the shortest program $p$ for a universal Turing machine $U$ such that $U(p) = x$. Although this definition is precise, Chaitin proved that no algorithm can, in general, compute $K(x)$ for an arbitrary string $x$: the function is uncomputable, a result closely tied to Gödel's incompleteness theorem and Turing's halting problem, revealing a fundamental limit to any attempt to objectively measure randomness.`
			},
			external: false
		}
	]
};
