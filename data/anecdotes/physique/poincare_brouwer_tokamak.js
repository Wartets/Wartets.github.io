export default {
	id: 'anecdote_poincare_brouwer_tokamak',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Topologie Différentielle / Physique des Plasmas', en: 'Differential Topology / Plasma Physics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Un résultat fondamental de topologie algébrique affirme qu'il est impossible de « peigner » un champ de vecteurs tangent continu sur une sphère sans qu'il ne s'annule en au moins un point : c'est le théorème de la boule chevelue. En physique des plasmas, cette contrainte purement mathématique impose qu'un réacteur de fusion nucléaire de forme sphérique possède inévitablement une faille magnétique par laquelle le plasma s'échapperait. C'est précisément pour cette raison que les réacteurs à confinement magnétique, comme ITER, adoptent la forme d'un tore : c'est la seule surface fermée en trois dimensions admettant un champ de vecteurs continu ne s'annulant jamais.`,
		en: `A fundamental result of algebraic topology states that a continuous tangent vector field cannot be "combed" on a sphere without vanishing at at least one point: this is the hairy ball theorem. In plasma physics, this purely mathematical constraint means that a spherical nuclear fusion reactor would inevitably possess a magnetic flaw through which the plasma could escape. This is precisely why magnetic confinement reactors, such as ITER, adopt the shape of a torus: it is the only closed three-dimensional surface admitting a continuous, nowhere-vanishing vector field.`
	},
	sources: [
		{
			name: { fr: 'Sur les courbes définies par une équation différentielle (1885)', en: 'Sur les courbes définies par une équation différentielle (1885)' },
			url: 'https://gallica.bnf.fr/ark:/12148/bpt6k164010'
		}
	],
	contexts: [
		{
			title: { fr: 'Caractéristique d\'Euler-Poincaré et théorème de Poincaré-Hopf', en: 'The Euler-Poincaré characteristic and the Poincaré-Hopf theorem' },
			body: {
				fr: `Le théorème de Poincaré-Hopf relie la topologie globale d'une variété différentielle à la somme des indices des zéros d'un champ de vecteurs tangent qui lui est défini :\n\n$$\\sum_{i} \\text{ind}(X, x_i) = \\chi(M)$$\n\noù $\\chi(M)$ est la caractéristique d'Euler de la variété $M$. Pour une sphère $S^2$, cette caractéristique vaut $\\chi(S^2) = 2$, ce qui impose mathématiquement l'existence d'au moins un point de singularité (typiquement un pôle) pour tout champ de vecteurs tangent continu.\n\nPour un tore $T^2$, en revanche, $\\chi(T^2) = 0$, ce qui autorise un champ de vecteurs continu ne s'annulant jamais nulle part, comme les lignes de champ magnétique parallèles enroulées autour du grand rayon d'un tokamak. C'est cette différence topologique, et non un simple choix technique, qui contraint la géométrie des réacteurs de fusion à confinement magnétique.`,
				en: `The Poincaré-Hopf theorem relates the global topology of a differentiable manifold to the sum of the indices of the zeros of a tangent vector field defined on it:\n\n$$\\sum_{i} \\text{ind}(X, x_i) = \\chi(M)$$\n\nwhere $\\chi(M)$ is the Euler characteristic of the manifold $M$. For a sphere $S^2$, this characteristic equals $\\chi(S^2) = 2$, which mathematically forces the existence of at least one singular point (typically a pole) for any continuous tangent vector field.\n\nFor a torus $T^2$, by contrast, $\\chi(T^2) = 0$, which allows a continuous vector field that never vanishes anywhere, such as magnetic field lines wound around the major radius of a tokamak. It is this topological difference, not a mere engineering preference, that constrains the geometry of magnetic confinement fusion reactors.`
			},
			external: false
		}
	]
};
