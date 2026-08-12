export default {
	id: 'anecdote_huffman_coding_compression',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Informatique / Théorie de l\'Information', en: 'Computer Science / Information Theory' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1952, David Huffman, alors étudiant au MIT, invente pour un devoir de fin d'année un algorithme de compression sans perte optimal. Plutôt que d'attribuer le même nombre de bits à chaque lettre, sa méthode attribue des codes binaires courts aux symboles les plus fréquents et des codes longs aux symboles rares, atteignant ainsi la limite théorique de compression sans perte d'information, sans aucune complexité de calcul excessive.`,
		en: `In 1952, David Huffman, then a student at MIT, invented an optimal lossless compression algorithm for a term paper. Rather than assigning the same number of bits to every letter, his method assigns short binary codes to the most frequent symbols and long codes to rare ones, reaching the theoretical limit of lossless compression without excessive computational complexity.`
	},
	sources: [
		{
			name: { fr: 'A Method for the Construction of Minimum-Redundancy Codes (D. A. Huffman, Proceedings of the IRE, 1952)', en: 'A Method for the Construction of Minimum-Redundancy Codes (D. A. Huffman, Proceedings of the IRE, 1952)' },
			url: 'https://doi.org/10.1109/JRPROC.1952.273898'
		}
	],
	contexts: [
		{
			title: { fr: 'Entropie de Shannon et code sans préfixe', en: 'Shannon entropy and prefix-free coding' },
			body: {
				fr: `L'algorithme de Huffman s'appuie sur la borne théorique définie par Claude Shannon en 1948 : l'entropie moyenne $H(X) = -\\sum_i p(x_i) \\log_2 p(x_i)$ mesure l'information minimale nécessaire par symbole. Huffman construit un arbre binaire en fusionnant récursivement les deux symboles de plus faible probabilité, produisant un code « sans préfixe » où aucun code court n'est le début d'un code plus long. La longueur moyenne $L$ obtenue vérifie $H(X) \\le L < H(X) + 1$, un encadrement optimal parmi tous les codes à longueur variable.`,
				en: `Huffman's algorithm relies on the theoretical bound defined by Claude Shannon in 1948: the average entropy $H(X) = -\\sum_i p(x_i) \\log_2 p(x_i)$ measures the minimal information required per symbol. Huffman builds a binary tree by recursively merging the two lowest-probability symbols, producing a "prefix-free" code in which no short code is the start of a longer one. The resulting average length $L$ satisfies $H(X) \\le L < H(X) + 1$, an optimal bound among all variable-length codes.`
			},
			external: false
		}
	]
};
