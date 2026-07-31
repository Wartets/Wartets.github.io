export default {
	id: 'anecdote_noether_second_theorem_gauge',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Physique Mathématique / Gravitation', en: 'Mathematical Physics / Gravitation' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Si le premier théorème d'Emmy Noether, reliant symétrie globale et loi de conservation, est mondialement célèbre, c'est souvent au détriment de son Second Théorème, publié dans le même article de 1918. Il énonce que si l'action d'un système possède une symétrie paramétrée non pas par des constantes, mais par des fonctions arbitraires de l'espace-temps, une symétrie dite « locale » ou de « jauge », cela engendre des identités mathématiques redondantes plutôt qu'une simple loi de conservation. Ce second théorème, longtemps resté dans l'ombre du premier, constitue pourtant le cœur mathématique de la Relativité Générale d'Einstein comme des théories quantiques de jauge de Yang-Mills qui composent le Modèle Standard.`,
		en: `While Emmy Noether's first theorem, linking global symmetry to conservation laws, is world-famous, this fame has often come at the expense of her Second Theorem, published in the same 1918 paper. It states that if a system's action possesses a symmetry parameterized not by constants but by arbitrary functions of spacetime, a so-called "local" or "gauge" symmetry, this generates redundant mathematical identities rather than a simple conservation law. This second theorem, long overshadowed by the first, is nonetheless the mathematical core of both Einstein's General Relativity and the Yang-Mills gauge theories that make up the Standard Model.`
	},
	sources: [
		{
			name: { fr: 'Invariante Variationsprobleme (1918)', en: 'Invariante Variationsprobleme (1918)' },
			url: 'https://arxiv.org/abs/physics/0503066'
		}
	],
	contexts: [
		{
			title: { fr: 'Groupes de Lie locaux et dérivées fonctionnelles', en: 'Local Lie groups and functional derivatives' },
			body: {
				fr: `Considérons un groupe de symétrie de dimension infinie, paramétré par des fonctions locales infinitésimales $\\epsilon^a(x)$ dépendant du point de l'espace-temps. L'invariance locale de l'action lagrangienne implique l'identité de Noether suivante :\n\n$$W_a - \\partial_\\mu W_a^\\mu \\equiv 0 \\quad \\text{avec} \\quad W_a = \\frac{\\delta \\mathcal{L}}{\\delta \\phi} \\frac{\\partial(\\delta \\phi)}{\\partial \\epsilon^a}$$\n\nContrairement au premier théorème, cette relation est vérifiée « hors couche » (off-shell), c'est-à-dire indépendamment des équations du mouvement elles-mêmes. En Relativité Générale, où le groupe de jauge local est le groupe des difféomorphismes, ce théorème conduit directement à l'identité de Bianchi contractée :\n\n$$\\nabla_\\mu G^{\\mu\\nu} = 0$$\n\nCette identité géométrique contraint mathématiquement le tenseur énergie-impulsion à être conservé, non pas comme une hypothèse physique supplémentaire, mais comme une conséquence structurelle inévitable de l'invariance locale de la théorie.`,
				en: `Consider an infinite-dimensional symmetry group, parameterized by local infinitesimal functions $\\epsilon^a(x)$ depending on the spacetime point. Local invariance of the Lagrangian action implies the following Noether identity:\n\n$$W_a - \\partial_\\mu W_a^\\mu \\equiv 0 \\quad \\text{with} \\quad W_a = \\frac{\\delta \\mathcal{L}}{\\delta \\phi} \\frac{\\partial(\\delta \\phi)}{\\partial \\epsilon^a}$$\n\nUnlike the first theorem, this relation holds "off-shell", that is, independently of the equations of motion themselves. In General Relativity, where the local gauge group is the group of diffeomorphisms, this theorem leads directly to the contracted Bianchi identity:\n\n$$\\nabla_\\mu G^{\\mu\\nu} = 0$$\n\nThis geometric identity mathematically forces the energy-momentum tensor to be conserved, not as an additional physical assumption, but as an unavoidable structural consequence of the theory's local invariance.`
			},
			external: false
		}
	]
};
