export default {
	id: 'anecdote_diffie_hellman_key_exchange',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Cryptographie - Algèbre Numérique', en: 'Cryptography - Number Algebra' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Le fondement de la sécurité moderne sur Internet repose sur un problème abstrait de communication : comment deux personnes (Alice et Bob, par convention) peuvent-elles convenir d'un secret commun en « criant » dans une pièce bondée où tout le monde les entend ? En 1976, Whitfield Diffie et Martin Hellman inventent un protocole mathématique asymétrique résolvant ce paradoxe. Alice et Bob s'échangent publiquement des nombres semi-transformés, puis effectuent chacun un calcul privé sur le nombre reçu, faisant converger leurs résultats vers un même chiffre commun. Un espion interceptant l'intégralité de l'échange ne possède jamais les éléments nécessaires pour reconstituer ce secret.`,
		en: `Modern internet security rests on an abstract communication problem: how can two people (conventionally called Alice and Bob) agree on a shared secret while "shouting" in a crowded room where everyone can hear them? In 1976, Whitfield Diffie and Martin Hellman invented an asymmetric mathematical protocol solving this paradox. Alice and Bob publicly exchange partially transformed numbers, then each perform a private computation on the number they received, causing their results to converge on the same shared value. An eavesdropper intercepting the entire exchange never possesses the pieces needed to reconstruct that secret.`
	},
	sources: [
		{
			name: { fr: 'New Directions in Cryptography (W. Diffie, M. Hellman, IEEE Transactions on Information Theory, 1976)', en: 'New Directions in Cryptography (W. Diffie, M. Hellman, IEEE Transactions on Information Theory, 1976)' },
			url: 'https://doi.org/10.1109/TIT.1976.1055638'
		}
	],
	contexts: [
		{
			title: { fr: 'L\'exponentiation modulaire et le logarithme discret', en: 'Modular exponentiation and the discrete logarithm' },
			body: {
				fr: `L'algorithme de Diffie-Hellman repose sur la difficulté calculatoire du problème du logarithme discret dans un groupe cyclique multiplicatif fini. Alice et Bob s'accordent publiquement sur un grand nombre premier $p$ et une base génératrice $g$.\n\nAlice choisit un entier secret $a$ et calcule sa clé publique $A = g^a \\pmod{p}$. Bob choisit un entier secret $b$ et calcule $B = g^b \\pmod{p}$. Ils échangent $A$ et $B$ sur un canal non sécurisé, puis calculent chacun le même secret partagé :\n\n$$S = B^a \\pmod{p} = A^b \\pmod{p} = g^{ab} \\pmod{p}$$\n\nUn attaquant espionnant le réseau ne voit que $g$, $p$, $A$ et $B$. Retrouver $a$ à partir de $A$ nécessite l'inversion d'une fonction à sens unique, mathématiquement intraitable pour des valeurs de $p$ supérieures à 2048 bits.`,
				en: `The Diffie-Hellman algorithm relies on the computational difficulty of the discrete logarithm problem in a finite cyclic multiplicative group. Alice and Bob publicly agree on a large prime number $p$ and a generator base $g$.\n\nAlice chooses a secret integer $a$ and computes her public key $A = g^a \\pmod{p}$. Bob chooses a secret integer $b$ and computes $B = g^b \\pmod{p}$. They exchange $A$ and $B$ over an unsecured channel, then each compute the same shared secret:\n\n$$S = B^a \\pmod{p} = A^b \\pmod{p} = g^{ab} \\pmod{p}$$\n\nAn attacker eavesdropping on the network only sees $g$, $p$, $A$, and $B$. Recovering $a$ from $A$ requires inverting a one-way function, computationally intractable for values of $p$ larger than 2048 bits.`
			},
			external: false
		}
	]
};
