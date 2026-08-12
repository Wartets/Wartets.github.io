export default {
	id: 'anecdote_shor_algorithm_quantum_factorization',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Informatique Quantique / Algèbre', en: 'Quantum Computing / Algebra' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `La sécurité de presque toutes les transactions bancaires et communications en ligne repose sur le chiffrement RSA. Ce système protège vos données grâce à un postulat mathématique simple : il est facile de multiplier deux très grands nombres premiers entre eux, mais il est pratiquement impossible pour un ordinateur classique de retrouver ces deux nombres à partir du résultat. En 1994, Peter Shor a bouleversé ce postulat en écrivant un algorithme théorique pour ordinateur quantique. En utilisant les propriétés de superposition et d'interférence quantique, l'algorithme de Shor est capable de factoriser ces nombres de manière exponentiellement plus rapide, forçant le monde entier à développer une nouvelle « cryptographie post-quantique ».`,
		en: `The security of almost every bank transaction and online communication relies on RSA encryption. This system protects your data through a simple mathematical postulate: it is easy to multiply two very large prime numbers together, but practically impossible for a classical computer to recover those two numbers from the result. In 1994, Peter Shor overturned this postulate by writing a theoretical algorithm for quantum computers. Using the properties of quantum superposition and interference, Shor's algorithm is able to factor such numbers exponentially faster, forcing the entire world to develop a new "post-quantum cryptography".`
	},
	sources: [
		{
			name: { fr: 'Algorithms for quantum computation: discrete logarithms and factoring (P. W. Shor, FOCS, 1994)', en: 'Algorithms for quantum computation: discrete logarithms and factoring (P. W. Shor, FOCS, 1994)' },
			url: 'https://ieeexplore.ieee.org/document/365700'
		}
	],
	contexts: [
		{
			title: { fr: 'Recherche de période par Transformée de Fourier Quantique', en: 'Period-finding via the Quantum Fourier Transform' },
			body: {
				fr: `La factorisation d'un grand entier $N$ se réduit mathématiquement à la recherche de la période $r$ de la fonction d'exponentiation modulaire $f(x) = a^x \\bmod N$. Classiquement, ce problème est intraitable en temps exponentiel. L'ordinateur quantique prépare un état superposé de toutes les valeurs de $x$, calcule $f(x)$ en une seule étape, puis applique une Transformée de Fourier Quantique (QFT) qui crée des interférences constructives uniquement pour les états correspondant à l'inverse de la période. La complexité temporelle s'effondre :\n\n$$\\mathcal{O}((\\log N)^3) \\quad \\text{au lieu de} \\quad \\mathcal{O}\\left(\\exp\\left(c \\sqrt[3]{\\log N (\\log \\log N)^2}\\right)\\right)$$\n\nSi la période $r$ trouvée est paire, les facteurs de $N$ sont obtenus classiquement par $\\gcd(a^{r/2} \\pm 1, N)$.`,
				en: `Factoring a large integer $N$ mathematically reduces to finding the period $r$ of the modular exponentiation function $f(x) = a^x \\bmod N$. Classically, this problem is intractable in exponential time. The quantum computer prepares a superposed state of all values of $x$, computes $f(x)$ in a single step, then applies a Quantum Fourier Transform (QFT) that creates constructive interference only for states corresponding to the inverse of the period. The time complexity collapses:\n\n$$\\mathcal{O}((\\log N)^3) \\quad \\text{instead of} \\quad \\mathcal{O}\\left(\\exp\\left(c \\sqrt[3]{\\log N (\\log \\log N)^2}\\right)\\right)$$\n\nIf the period $r$ found is even, the factors of $N$ are obtained classically via $\\gcd(a^{r/2} \\pm 1, N)$.`
			},
			external: false
		}
	]
};
