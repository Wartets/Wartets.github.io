export default {
	id: 'anecdote_p_vs_np_problem',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Informatique Théorique / Mathématiques', en: 'Theoretical Computer Science / Mathematics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Il est facile de vérifier qu'une solution de Sudoku remplie est correcte, mais beaucoup plus difficile d'en trouver une à partir d'une grille vide. Cette asymétrie entre vérifier et résoudre est au cœur du problème P contre NP, formalisé indépendamment par Stephen Cook et Leonid Levin au début des années 1970. Toujours non résolu et doté d'un million de dollars par l'institut Clay, il demande si tout problème dont la solution se vérifie rapidement peut également se résoudre rapidement.`,
		en: `It is easy to verify that a completed Sudoku solution is correct, but much harder to find one starting from an empty grid. This asymmetry between verifying and solving lies at the heart of the P versus NP problem, formalized independently by Stephen Cook and Leonid Levin in the early 1970s. Still unsolved and carrying a one-million-dollar reward from the Clay Institute, it asks whether every problem whose solution can be quickly verified can also be quickly solved.`
	},
	sources: [
		{
			name: { fr: 'The Complexity of Theorem-Proving Procedures (S. A. Cook, Proceedings of STOC, 1971)', en: 'The Complexity of Theorem-Proving Procedures (S. A. Cook, Proceedings of STOC, 1971)' },
			url: 'https://doi.org/10.1145/800157.805047'
		}
	],
	contexts: [
		{
			title: { fr: 'Classes de complexité et NP-complétude', en: 'Complexity classes and NP-completeness' },
			body: {
				fr: `La classe P regroupe les problèmes résolubles en temps polynomial par rapport à la taille de l'entrée $n$, c'est-à-dire en $O(n^k)$ pour un $k$ fixé. La classe NP regroupe les problèmes dont une solution proposée peut être vérifiée en temps polynomial, même si la trouver peut être bien plus long. Cook démontra qu'il existe des problèmes « NP-complets » (comme SAT, la satisfiabilité booléenne) auxquels tout problème de NP se ramène en temps polynomial : si l'on trouvait un algorithme polynomial pour un seul problème NP-complet, on prouverait $P = NP$ et l'on résoudrait instantanément des milliers de problèmes combinatoires, y compris la cryptographie moderne.`,
				en: `Class P groups problems solvable in polynomial time relative to input size $n$, i.e. in $O(n^k)$ for a fixed $k$. Class NP groups problems whose proposed solution can be verified in polynomial time, even if finding it may take far longer. Cook proved that "NP-complete" problems exist (such as SAT, boolean satisfiability) to which every NP problem reduces in polynomial time: finding a polynomial algorithm for a single NP-complete problem would prove $P = NP$ and instantly solve thousands of combinatorial problems, including breaking modern cryptography.`
			},
			external: false
		}
	]
};
