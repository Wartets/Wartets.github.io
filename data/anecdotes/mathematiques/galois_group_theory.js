export default {
	id: 'anecdote_galois_group_theory',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Mathématiques - Algèbre Abstraite', en: 'Mathematics - Abstract Algebra' },
	scheduling: { type: 'annual', dates: ['05-29'] },
	content: (lang, year) => {
		const elapsed = year - 1832;
		return lang === 'fr'
			? `La nuit précédant le duel au pistolet qui lui coûta la vie, il y a désormais ${elapsed} ans, le mathématicien français Évariste Galois, âgé d'à peine vingt ans, rédigea précipitamment une lettre à son ami Auguste Chevalier. Conscient de sa mort probable, il y coucha à la hâte des idées qui allaient fonder la théorie des groupes, apportant la réponse définitive à un problème vieux de plusieurs siècles : la condition nécessaire et suffisante pour qu'une équation polynomiale soit résoluble par radicaux.`
			: `The night before the pistol duel that would cost him his life, ${elapsed} years ago now, the French mathematician Évariste Galois, barely twenty years old, hastily wrote a letter to his friend Auguste Chevalier. Aware that death was likely, he rushed to set down ideas that would found group theory, providing the definitive answer to a centuries-old problem: the necessary and sufficient condition for a polynomial equation to be solvable by radicals.`;
	},
	sources: [
		{
			name: { fr: 'Œuvres mathématiques d\'Évariste Galois (1846)', en: 'Œuvres mathématiques d\'Évariste Galois (1846)' },
			url: 'https://gallica.bnf.fr/ark:/12148/bpt6k16394s/f395.image'
		}
	],
	contexts: [
		{
			title: { fr: 'Groupes résolubles et théorème d\'Abel-Ruffini', en: 'Solvable groups and the Abel-Ruffini theorem' },
			body: {
				fr: `À tout polynôme $P$ à coefficients dans un corps $K$, on associe son groupe de Galois $\\text{Gal}(L/K)$, le groupe des automorphismes du corps de décomposition $L$ de $P$ qui laissent $K$ invariant.\n\nUn groupe est dit résoluble s'il admet une suite de composition dont tous les quotients successifs sont abéliens. Galois démontra qu'une équation polynomiale\n\n$$P(x) = ax^5 + bx^4 + cx^3 + dx^2 + ex + f = 0$$\n\nest résoluble par radicaux si et seulement si son groupe de Galois est résoluble. Or, pour tout $n \\ge 5$, le groupe symétrique $S_n$ n'est pas résoluble, car son sous-groupe alterné $A_n$ est simple et non abélien. C'est cette obstruction purement algébrique qui explique pourquoi, contrairement aux équations de degré inférieur ou égal à 4, il n'existe aucune formule générale analogue à celle du second degré pour résoudre les équations de degré cinq et plus.`,
				en: `To every polynomial $P$ with coefficients in a field $K$, one associates its Galois group $\\text{Gal}(L/K)$, the group of automorphisms of the splitting field $L$ of $P$ that leave $K$ fixed.\n\nA group is called solvable if it admits a composition series whose successive quotients are all abelian. Galois proved that a polynomial equation\n\n$$P(x) = ax^5 + bx^4 + cx^3 + dx^2 + ex + f = 0$$\n\nis solvable by radicals if and only if its Galois group is solvable. For every $n \\ge 5$, however, the symmetric group $S_n$ is not solvable, because its alternating subgroup $A_n$ is simple and non-abelian. This purely algebraic obstruction explains why, unlike equations of degree four or lower, no formula analogous to the quadratic formula exists for solving equations of degree five and above.`
			},
			external: false
		}
	]
};
