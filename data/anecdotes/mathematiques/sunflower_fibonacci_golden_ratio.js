export default {
	id: 'anecdote_sunflower_fibonacci_golden_ratio',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Biologie Mathématique / Suites Récurrentes', en: 'Mathematical Biology / Recurrence Sequences' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Le cœur d'une fleur de tournesol ne répartit pas ses graines au hasard. Elles forment de magnifiques spirales entrelacées (des parastiches). Si vous comptez le nombre de spirales tournant vers la droite, puis celui des spirales tournant vers la gauche, vous obtiendrez systématiquement deux nombres adjacents de la célèbre suite de Fibonacci (par exemple, 34 et 55, ou 55 et 89). C'est la solution géométrique la plus optimale développée par l'évolution naturelle pour compacter le maximum de graines possible sur un disque, fondée intimement sur le Nombre d'Or.`,
		en: `The heart of a sunflower does not scatter its seeds at random. They form magnificent interlocking spirals (parastichies). Counting the spirals turning clockwise, then those turning counterclockwise, will systematically yield two adjacent numbers from the famous Fibonacci sequence (for instance, 34 and 55, or 55 and 89). This is the most optimal geometric solution developed by natural evolution to pack the maximum number of seeds onto a disk, intimately grounded in the Golden Ratio.`
	},
	sources: [
		{
			name: { fr: 'A better way to construct the sunflower head (H. Vogel, Mathematical Biosciences, 1979)', en: 'A better way to construct the sunflower head (H. Vogel, Mathematical Biosciences, 1979)' },
			url: 'https://www.sciencedirect.com/science/article/pii/0025556479900804'
		}
	],
	contexts: [
		{
			title: { fr: 'Phyllotaxie et Nombre d\'Or', en: 'Phyllotaxis and the Golden Ratio' },
			body: {
				fr: `L'angle de divergence optimal entre l'apparition de deux bourgeons consécutifs (primordia), permettant d'éviter tout chevauchement lors de leur croissance radiale, est l'angle d'or. Il divise le cercle entier $\\tau = 2\\pi$ selon le nombre d'or $\\phi = \\frac{1+\\sqrt{5}}{2}$ :\n\n$$\\alpha = \\frac{2\\pi}{\\phi^2} \\approx 137,5077°$$\n\nEn utilisant la représentation en coordonnées polaires de Vogel pour la $n$-ième graine ($r = c\\sqrt{n}$, $\\theta = n\\alpha$), on démontre mathématiquement que les seules trajectoires visuelles spiralées formées correspondent aux approximations rationnelles de $\\phi$, précisément les fractions de nombres successifs de Fibonacci $F_{k+1}/F_k$.`,
				en: `The optimal divergence angle between the appearance of two consecutive buds (primordia), which avoids any overlap as they grow radially, is the golden angle. It divides the full circle $\\tau = 2\\pi$ according to the golden ratio $\\phi = \\frac{1+\\sqrt{5}}{2}$:\n\n$$\\alpha = \\frac{2\\pi}{\\phi^2} \\approx 137.5077°$$\n\nUsing Vogel's polar-coordinate representation for the $n$-th seed ($r = c\\sqrt{n}$, $\\theta = n\\alpha$), it can be mathematically shown that the only visible spiral trajectories that form correspond to rational approximations of $\\phi$, precisely the fractions of successive Fibonacci numbers $F_{k+1}/F_k$.`
			},
			external: false
		}
	]
};
