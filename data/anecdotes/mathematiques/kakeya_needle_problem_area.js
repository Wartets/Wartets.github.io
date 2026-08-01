export default {
	id: 'anecdote_kakeya_needle_problem_area',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Analyse Mathématique / Théorie de la Mesure', en: 'Mathematical Analysis / Measure Theory' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Imaginez une aiguille (un segment de droite) de longueur 1 posée sur une table. Quelle est la plus petite surface d'espace nécessaire pour lui faire faire un demi-tour complet (180 degrés) de manière continue, jusqu'à ce qu'elle retrouve sa position d'origine mais inversée ? Intuitivement, on pense à un disque (surface π/4) ou à une forme étoilée spécifique. En 1919, le mathématicien Abram Besicovitch prouva un résultat hallucinant : la réponse est zéro.`,
		en: `Imagine a needle (a line segment) of length 1 lying on a table. What is the smallest area of space needed to make it perform a full half-turn (180 degrees) continuously, until it returns to its original position but reversed? Intuitively, one thinks of a disk (area π/4) or a specific star-shaped figure. In 1919, mathematician Abram Besicovitch proved a stunning result: the answer is zero.`
	},
	sources: [
		{
			name: { fr: 'Sur deux questions de géométrie et de topologie (A.S. Besicovitch, Mathematische Annalen, 1919)', en: 'Sur deux questions de géométrie et de topologie (A.S. Besicovitch, Mathematische Annalen, 1919)' },
			url: 'https://link.springer.com/article/10.1007/BF01458264'
		}
	],
	contexts: [
		{
			title: { fr: 'Ensemble de Besicovitch et construction par arbres', en: 'The Besicovitch set and tree construction' },
			body: {
				fr: `Un ensemble contenant un segment de longueur 1 dans toutes les directions du plan est appelé un ensemble de Kakeya. Besicovitch utilisa une méthode de construction itérative (les arbres de Perron), consistant à découper un triangle en de nombreux sous-triangles plus fins, puis à les faire glisser les uns sur les autres le long de leur hauteur pour qu'ils se superposent massivement, fusionnant leur aire.\n\nL'aire de l'ensemble limite, au sens de la mesure de Lebesgue, s'écrit :\n\n$$\\mu(K) = \\iint_K dx\\,dy = 0$$\n\nPourtant, l'ensemble contient une infinité indénombrable de segments, constituant une fractale d'une finesse extrême.`,
				en: `A set containing a segment of length 1 in every direction of the plane is called a Kakeya set. Besicovitch used an iterative construction method (Perron trees), consisting of slicing a triangle into many thinner sub-triangles, then sliding them over one another along their height so they overlap massively, merging their area.\n\nThe area of the limiting set, in the sense of Lebesgue measure, is:\n\n$$\\mu(K) = \\iint_K dx\\,dy = 0$$\n\nYet the set contains an uncountable infinity of segments, forming an extremely fine fractal.`
			},
			external: false
		}
	]
};
