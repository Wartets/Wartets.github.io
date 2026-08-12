export default {
	id: 'anecdote_bayes_theorem_probability',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Mathématiques / Probabilités', en: 'Mathematics / Probability' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Le théorème qui porte le nom du révérend Thomas Bayes n'a jamais été publié par lui de son vivant. C'est son ami Richard Price qui, après la mort de Bayes en 1761, retrouva ses notes manuscrites et les fit publier en 1763. Ce théorème, qui décrit comment mettre à jour une croyance à la lumière de nouvelles données observées, est aujourd'hui au cœur du diagnostic médical, du filtrage anti-spam, et de l'ensemble des méthodes d'inférence bayésienne en apprentissage automatique.`,
		en: `The theorem bearing Reverend Thomas Bayes's name was never published by him during his lifetime. It was his friend Richard Price who, after Bayes's death in 1761, found his handwritten notes and had them published in 1763. This theorem, which describes how to update a belief in light of newly observed data, is today central to medical diagnosis, spam filtering, and the whole family of Bayesian inference methods in machine learning.`
	},
	sources: [
		{
			name: { fr: 'An Essay towards solving a Problem in the Doctrine of Chances (T. Bayes, R. Price, Philosophical Transactions of the Royal Society, 1763)', en: 'An Essay towards solving a Problem in the Doctrine of Chances (T. Bayes, R. Price, Philosophical Transactions of the Royal Society, 1763)' },
			url: 'https://doi.org/10.1098/rstl.1763.0053'
		}
	],
	contexts: [
		{
			title: { fr: 'Inverser la probabilité conditionnelle', en: 'Inverting conditional probability' },
			body: {
				fr: `Le théorème de Bayes relie la probabilité d'une hypothèse $A$ sachant une observation $B$ à la probabilité inverse, plus facile à estimer directement :\n\n$$P(A \\mid B) = \\frac{P(B \\mid A)\\, P(A)}{P(B)}$$\n\nEn médecine, par exemple, $P(B \\mid A)$ (la probabilité qu'un test soit positif sachant que le patient est malade) est connue par calibration du test, tandis que $P(A \\mid B)$ (la probabilité d'être réellement malade sachant un test positif) est la quantité recherchée, souvent contre-intuitivement plus faible que prévu lorsque la maladie est rare, en raison du terme $P(A)$, la prévalence a priori.`,
				en: `Bayes' theorem relates the probability of a hypothesis $A$ given an observation $B$ to the reverse probability, which is often easier to estimate directly:\n\n$$P(A \\mid B) = \\frac{P(B \\mid A)\\, P(A)}{P(B)}$$\n\nIn medicine, for example, $P(B \\mid A)$ (the probability a test is positive given the patient is sick) is known from test calibration, while $P(A \\mid B)$ (the probability of actually being sick given a positive test) is the sought quantity, often counter-intuitively lower than expected when the disease is rare, due to the term $P(A)$, the prior prevalence.`
			},
			external: false
		}
	]
};
