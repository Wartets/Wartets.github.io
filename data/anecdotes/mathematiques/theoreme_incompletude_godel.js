export default {
	id: 'anecdote_theoreme_incompletude_godel',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-30',
	domain: { fr: 'Mathématiques - Logique', en: 'Mathematics - Logic' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1931, Kurt Gödel démontre que tout système formel cohérent et suffisamment puissant pour décrire l'arithmétique contient nécessairement des énoncés vrais qu'il est impossible de démontrer en son sein, mettant fin au programme de formalisation complète des mathématiques porté par David Hilbert.`,
		en: `In 1931, Kurt Gödel proved that any consistent formal system powerful enough to describe arithmetic necessarily contains true statements that cannot be proven within it, ending David Hilbert's program of complete formalization of mathematics.`
	},
	sources: [
		{
			name: { fr: 'Stanford Encyclopedia of Philosophy', en: 'Stanford Encyclopedia of Philosophy' },
			url: 'https://plato.stanford.edu/entries/goedel-incompleteness/'
		}
	],
	contexts: [
		{
			title: { fr: 'Les deux théorèmes', en: 'The two theorems' },
			body: {
				fr: `Le premier théorème établit que dans tout système axiomatique cohérent $S$ contenant l'arithmétique de Peano, il existe une proposition $G$ telle que ni $G$ ni sa négation $\\neg G$ ne sont démontrables dans $S$.\n\nGödel construit $G$ par un codage arithmétique des formules du système (aujourd'hui appelé numérotation de Gödel), permettant à une formule de « parler d'elle-même » : $G$ énonce essentiellement « je ne suis pas démontrable dans $S$ ».\n\nLe second théorème renforce le premier : un tel système $S$ ne peut démontrer sa propre cohérence, notée $\\mathrm{Cons}(S)$, à moins d'être lui-même incohérent. Ce résultat a des répercussions directes sur l'informatique théorique, notamment via le lien établi par Turing entre indécidabilité logique et problème de l'arrêt.`,
				en: `The first theorem establishes that in any consistent axiomatic system $S$ containing Peano arithmetic, there exists a proposition $G$ such that neither $G$ nor its negation $\\neg G$ is provable within $S$.\n\nGödel constructs $G$ through an arithmetic encoding of the system's formulas (now called Gödel numbering), allowing a formula to "speak about itself": $G$ essentially states "I am not provable in $S$".\n\nThe second theorem strengthens the first: such a system $S$ cannot prove its own consistency, denoted $\\mathrm{Cons}(S)$, unless it is itself inconsistent. This result has direct repercussions on theoretical computer science, notably through the link Turing established between logical undecidability and the halting problem.`
			},
			external: false
		}
	]
};
