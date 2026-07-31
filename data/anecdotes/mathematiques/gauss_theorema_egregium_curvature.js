export default {
	id: 'anecdote_gauss_theorema_egregium_curvature',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Géométrie Différentielle', en: 'Differential Geometry' },
	scheduling: { type: 'annual', dates: ['10-08'] },
	content: (lang, year) => {
		const elapsed = year - 1827;
		return lang === 'fr'
			? `Carl Friedrich Gauss découvrit en 1827, il y a désormais ${elapsed} ans, un théorème mathématique si remarquable qu'il le baptisa lui-même Theorema Egregium. Il démontre que la courbure d'une surface est une propriété intrinsèque : elle ne change pas lorsqu'on plie la surface sans l'étirer ni la déchirer. C'est la raison mathématique stricte pour laquelle il est impossible de dessiner une carte du monde parfaitement plane sans déformer les distances, et c'est également pourquoi plier légèrement une part de pizza en forme de U l'empêche de s'affaisser sous son propre poids.`
			: `Carl Friedrich Gauss discovered in 1827, ${elapsed} years ago now, a mathematical theorem so remarkable that he himself named it the Theorema Egregium. It proves that the curvature of a surface is an intrinsic property: it does not change when the surface is bent without stretching or tearing it. This is the strict mathematical reason why it is impossible to draw a perfectly flat map of the world without distorting distances, and it is also why gently folding a slice of pizza into a U-shape keeps it from drooping under its own weight.`;
	},
	sources: [
		{
			name: { fr: 'Disquisitiones generales circa superficies curvas (1827)', en: 'Disquisitiones generales circa superficies curvas (1827)' },
			url: 'https://gdz.sub.uni-goettingen.de/id/PPN235999628'
		}
	],
	contexts: [
		{
			title: { fr: 'Formes fondamentales et invariance isométrique', en: 'Fundamental forms and isometric invariance' },
			body: {
				fr: `La géométrie locale d'une surface se décrit par deux formes quadratiques : la Première forme fondamentale, qui code la métrique intrinsèque à l'aide des coefficients $E$, $F$, $G$, et la Seconde forme fondamentale, qui décrit son plongement dans l'espace ambiant à l'aide des coefficients $L$, $M$, $N$.\n\nLa courbure de Gauss se définit d'abord de façon extrinsèque, comme le produit des deux courbures principales de la surface :\n\n$$K = \\kappa_1 \\kappa_2 = \\frac{LN - M^2}{EG - F^2}$$\n\nL'exploit démontré par Gauss est que cette quantité, bien que définie à partir du plongement, peut en réalité s'exprimer uniquement à l'aide des coefficients de la Première forme fondamentale et de leurs dérivées, sans faire aucunement référence à la Seconde. La courbure de Gauss est donc invariante sous toute isométrie locale, c'est-à-dire toute déformation préservant les longueurs, ce qui explique pourquoi aucune carte plane ne peut représenter fidèlement toutes les distances d'une sphère.`,
				en: `The local geometry of a surface is described by two quadratic forms: the first fundamental form, which encodes the intrinsic metric via coefficients $E$, $F$, $G$, and the second fundamental form, which describes its embedding in ambient space via coefficients $L$, $M$, $N$.\n\nGaussian curvature is first defined extrinsically, as the product of the surface's two principal curvatures:\n\n$$K = \\kappa_1 \\kappa_2 = \\frac{LN - M^2}{EG - F^2}$$\n\nGauss's remarkable achievement was to prove that this quantity, although defined from the embedding, can in fact be expressed solely in terms of the coefficients of the first fundamental form and their derivatives, without any reference to the second. Gaussian curvature is therefore invariant under every local isometry, that is, every length-preserving deformation, which explains why no flat map can faithfully represent all the distances on a sphere.`
			},
			external: false
		}
	]
};
