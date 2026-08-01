export default {
	id: 'anecdote_coastline_paradox_fractals',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Géométrie Fractale', en: 'Fractal Geometry' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Quelle est la longueur de la côte de la Grande-Bretagne ? Mathématiquement, la réponse dépend de la taille de la règle utilisée. Mesurée avec des segments de 100 km, on obtient une certaine longueur. Avec une règle de 1 mètre, il faut contourner chaque rocher, et la longueur augmente considérablement. Avec une règle de la taille d'un atome, la longueur tend vers l'infini. Les littoraux n'ont pas de périmètre bien défini en une dimension : ce sont des « fractales » possédant une dimension fractionnaire, comprise entre la ligne à une dimension et la surface à deux dimensions.`,
		en: `What is the length of the coastline of Great Britain? Mathematically, the answer depends on the size of the ruler used. Measured with 100 km segments, one obtains a certain length. With a 1-meter ruler, every rock must be traced around, and the length increases considerably. With a ruler the size of an atom, the length tends toward infinity. Coastlines have no well-defined one-dimensional perimeter: they are "fractals" possessing a fractional dimension, lying between the one-dimensional line and the two-dimensional surface.`
	},
	sources: [
		{
			name: { fr: 'How Long Is the Coast of Britain? Statistical Self-Similarity and Fractional Dimension (B. Mandelbrot, Science, 1967)', en: 'How Long Is the Coast of Britain? Statistical Self-Similarity and Fractional Dimension (B. Mandelbrot, Science, 1967)' },
			url: 'https://www.science.org/doi/10.1126/science.156.3775.636'
		}
	],
	contexts: [
		{
			title: { fr: 'Dimension de Hausdorff-Besicovitch', en: 'The Hausdorff-Besicovitch dimension' },
			body: {
				fr: `Le paradoxe, popularisé par Benoît Mandelbrot et inspiré des travaux de L.F. Richardson, est quantifié par la relation entre la longueur mesurée $L(\\epsilon)$ et la longueur du segment de mesure $\\epsilon$. Pour une courbe euclidienne lisse, $L$ converge vers une constante quand $\\epsilon \\to 0$. Pour une courbe fractale, elle diverge selon une loi de puissance :\n\n$$L(\\epsilon) \\propto \\epsilon^{1-D}$$\n\nPour la côte de la Grande-Bretagne, des mesures empiriques estiment $D \\approx 1,25$. Comme $1,25 > 1$, l'objet remplit l'espace de manière plus dense qu'une simple ligne.`,
				en: `The paradox, popularized by Benoît Mandelbrot and inspired by the work of L.F. Richardson, is quantified by the relation between the measured length $L(\\epsilon)$ and the length of the measuring segment $\\epsilon$. For a smooth Euclidean curve, $L$ converges to a constant as $\\epsilon \\to 0$. For a fractal curve, it diverges as a power law:\n\n$$L(\\epsilon) \\propto \\epsilon^{1-D}$$\n\nFor the coastline of Great Britain, empirical measurements estimate $D \\approx 1.25$. Since $1.25 > 1$, the object fills space more densely than a simple line.`
			},
			external: false
		}
	]
};
