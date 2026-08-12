export default {
	id: 'anecdote_euler_totient_function_rsa_crypto',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Théorie des Nombres / Cryptographie', en: 'Number Theory / Cryptography' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1763, Leonhard Euler introduit une fonction comptant, pour un nombre entier $n$, combien d'entiers lui sont inférieurs et premiers avec lui. Plus de deux siècles plus tard, en 1978, Ron Rivest, Adi Shamir et Leonard Adleman combinent cette « fonction indicatrice » à la difficulté de factoriser de grands nombres premiers pour concevoir RSA, l'algorithme de chiffrement asymétrique qui sécurise aujourd'hui l'essentiel des communications numériques mondiales.`,
		en: `In 1763, Leonhard Euler introduced a function counting, for an integer $n$, how many integers below it are coprime with it. More than two centuries later, in 1978, Ron Rivest, Adi Shamir, and Leonard Adleman combined this "totient function" with the difficulty of factoring large prime numbers to design RSA, the asymmetric encryption algorithm that today secures most of the world's digital communications.`
	},
	sources: [
		{
			name: { fr: 'A Method for Obtaining Digital Signatures and Public-Key Cryptosystems (R. L. Rivest, A. Shamir, L. Adleman, Communications of the ACM, 1978)', en: 'A Method for Obtaining Digital Signatures and Public-Key Cryptosystems (R. L. Rivest, A. Shamir, L. Adleman, Communications of the ACM, 1978)' },
			url: 'https://doi.org/10.1145/359340.359342'
		}
	],
	contexts: [
		{
			title: { fr: 'Le théorème d\'Euler et la trappe cryptographique', en: 'Euler\'s theorem and the cryptographic trapdoor' },
			body: {
				fr: `L'indicatrice $\\phi(n)$ compte les entiers $k$ tels que $1 \\le k \\le n$ et $\\gcd(k,n)=1$. Le théorème d'Euler stipule que pour tout $a$ premier avec $n$ : $a^{\\phi(n)} \\equiv 1 \\pmod n$. Pour RSA, Alice choisit deux grands nombres premiers secrets $p$ et $q$, publie leur produit $N = p \\times q$, mais garde secret $\\phi(N) = (p-1)(q-1)$. Un attaquant connaissant $N$ ne peut retrouver $\\phi(N)$ sans factoriser $N$, un problème considéré comme calculatoirement intraitable pour des nombres suffisamment grands, ce qui garantit la sécurité de la clé privée $d \\equiv e^{-1} \\pmod{\\phi(N)}$.`,
				en: `The totient $\\phi(n)$ counts integers $k$ such that $1 \\le k \\le n$ and $\\gcd(k,n)=1$. Euler's theorem states that for any $a$ coprime with $n$: $a^{\\phi(n)} \\equiv 1 \\pmod n$. In RSA, Alice chooses two large secret prime numbers $p$ and $q$, publishes their product $N = p \\times q$, but keeps $\\phi(N) = (p-1)(q-1)$ secret. An attacker knowing $N$ cannot recover $\\phi(N)$ without factoring $N$, a problem considered computationally intractable for sufficiently large numbers, which secures the private key $d \\equiv e^{-1} \\pmod{\\phi(N)}$.`
			},
			external: false
		}
	]
};
