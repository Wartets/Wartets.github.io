export default {
	id: 'anecdote_cantor_diagonalization_infinity',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Mathématiques Pures / Théorie des Ensembles', en: 'Pure Mathematics / Set Theory' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `À la fin du XIXe siècle, Georg Cantor démontre qu'il existe plusieurs tailles d'infini, emboîtées les unes dans les autres. Bien qu'il y ait une infinité de nombres entiers, Cantor prouve par son « argument de la diagonale » que même une liste supposément exhaustive de tous les nombres réels laissera toujours échapper un nombre absent, en modifiant systématiquement le n-ième chiffre du n-ième élément de la liste. L'ensemble des réels est un infini strictement plus grand que celui des entiers.`,
		en: `At the end of the 19th century, Georg Cantor proved that several sizes of infinity exist, nested within one another. Although there are infinitely many integers, Cantor showed with his "diagonal argument" that any supposedly exhaustive list of real numbers will always miss one, by systematically altering the n-th digit of the n-th listed element. The set of real numbers is a strictly larger infinity than the set of integers.`
	},
	sources: [
		{
			name: { fr: 'Über eine elementare Frage der Mannigfaltigkeitslehre (G. Cantor, 1891)', en: 'Über eine elementare Frage der Mannigfaltigkeitslehre (G. Cantor, 1891)' },
			url: 'https://www.researchgate.net/publication/335364685_A_Translation_of_G_Cantor\'s_Ueber_eine_elementare_Frage_der_Mannigfaltigkeitslehre'
		}
	],
	contexts: [
		{
			title: { fr: 'Cardinalité et infinis dénombrables', en: 'Cardinality and countable infinities' },
			body: {
				fr: `Deux ensembles infinis ont le même cardinal s'il existe entre eux une bijection parfaite. Cantor montre que $\\mathbb{N}$ est en bijection avec $\\mathbb{Q}$, malgré l'intuition : cette taille, dite dénombrable, vaut $\\aleph_0$. En revanche, aucune bijection n'existe entre $\\mathbb{N}$ et $\\mathbb{R}$, dont le cardinal, noté $\\mathfrak{c}$, vérifie :\n\n$$\\aleph_0 < 2^{\\aleph_0} = \\mathfrak{c}$$\n\nLa question de savoir s'il existe un infini de taille strictement intermédiaire (l'hypothèse du continu) fut montrée indécidable dans le cadre axiomatique usuel par Gödel et Cohen.`,
				en: `Two infinite sets share the same cardinal if a perfect bijection exists between them. Cantor showed that $\\mathbb{N}$ is in bijection with $\\mathbb{Q}$, despite intuition suggesting otherwise: this size, called countable, is $\\aleph_0$. However, no bijection exists between $\\mathbb{N}$ and $\\mathbb{R}$, whose cardinal, denoted $\\mathfrak{c}$, satisfies:\n\n$$\\aleph_0 < 2^{\\aleph_0} = \\mathfrak{c}$$\n\nWhether an infinity of strictly intermediate size exists (the continuum hypothesis) was later shown to be undecidable within the standard axiomatic framework by Gödel and Cohen.`
			},
			external: false
		}
	]
};
