export default {
	id: 'anecdote_machine_de_turing',
	enabled: true,
	priority: 2,
	addedDate: '2026-07-30',
	domain: { fr: 'Informatique - Fondements', en: 'Computer Science - Foundations' },
	scheduling: { type: 'annual', dates: ['06-23'] },
	content: (lang, year) => {
		const age = year - 1912;
		return lang === 'fr'
			? `Né un 23 juin 1912, il y a ${age} ans, Alan Turing publiait en 1936 « On Computable Numbers », introduisant la machine universelle qui définit encore aujourd'hui le cadre théorique de tout ordinateur programmable.`
			: `Born on June 23, 1912, ${age} years ago, Alan Turing published "On Computable Numbers" in 1936, introducing the universal machine that still defines the theoretical framework of every programmable computer today.`;
	},
	sources: [
		{
			name: { fr: 'Proceedings of the London Mathematical Society (1936)', en: 'Proceedings of the London Mathematical Society (1936)' },
			url: 'https://www.cs.virginia.edu/~robins/Turing_Paper_1936.pdf'
		}
	],
	contexts: [
		{
			title: { fr: 'Le problème de la décision', en: 'The decision problem' },
			body: {
				fr: `L'article de Turing répond au « Entscheidungsproblem » posé par Hilbert : existe-t-il une méthode mécanique permettant de déterminer si une proposition mathématique donnée est démontrable ?\n\nTuring formalise la notion de calcul en imaginant une machine abstraite lisant et écrivant des symboles sur un ruban infini selon une table d'instructions finie. Il démontre l'existence d'une machine universelle capable de simuler toute autre machine de ce type, à condition de recevoir en entrée une description de celle-ci, préfigurant l'architecture des ordinateurs à programme enregistré.\n\nIl prouve ensuite qu'il n'existe aucun algorithme général permettant de déterminer, pour une machine et une entrée quelconques, si le calcul s'arrêtera un jour, le problème de l'arrêt, apportant une réponse négative au problème de Hilbert de façon rigoureusement équivalente au résultat obtenu la même année par Alonzo Church avec le lambda-calcul.`,
				en: `Turing's paper answers Hilbert's "Entscheidungsproblem": is there a mechanical method to determine whether a given mathematical proposition is provable?\n\nTuring formalizes the notion of computation by imagining an abstract machine reading and writing symbols on an infinite tape according to a finite table of instructions. He demonstrates the existence of a universal machine capable of simulating any other such machine, provided it receives a description of it as input, foreshadowing the architecture of stored-program computers.\n\nHe then proves that no general algorithm exists to determine, for an arbitrary machine and input, whether the computation will ever halt, the halting problem, providing a negative answer to Hilbert's problem rigorously equivalent to the result obtained the same year by Alonzo Church with the lambda calculus.`
			},
			external: false
		}
	]
};
