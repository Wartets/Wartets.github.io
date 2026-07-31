export default {
	id: 'anecdote_shannon_gibbs_entropy',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Théorie de l\'Information / Physique Statistique', en: 'Information Theory / Statistical Physics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1948, alors que Claude Shannon fondait la théorie mathématique de la communication, il cherchait un nom pour sa mesure de l'incertitude de l'information. John von Neumann lui conseilla de l'appeler « entropie », d'une part parce que la formule mathématique était identique à celle de la mécanique statistique de Boltzmann et Gibbs, et d'autre part parce que « personne ne sait vraiment ce qu'est l'entropie », ce qui lui donnerait un avantage certain dans les débats. Cette analogie s'est avérée une vérité physique fondamentale.`,
		en: `In 1948, as Claude Shannon was founding the mathematical theory of communication, he sought a name for his measure of information uncertainty. John von Neumann advised him to call it "entropy", partly because the mathematical formula was identical to that of Boltzmann and Gibbs's statistical mechanics, and partly because "nobody really knows what entropy is", which would give him a definite advantage in any debate. This analogy has proven to be a fundamental physical truth.`
	},
	sources: [
		{
			name: { fr: 'A Mathematical Theory of Communication (1948)', en: 'A Mathematical Theory of Communication (1948)' },
			url: 'https://ieeexplore.ieee.org/document/6773024'
		}
	],
	contexts: [
		{
			title: { fr: 'Isomorphisme mathématique des entropies', en: 'The mathematical isomorphism of entropies' },
			body: {
				fr: `L'entropie de Shannon mesure la quantité d'information moyenne portée par une source discrète, définie par :\n\n$$H = - \\sum_{i} p_i \\log_2 p_i$$\n\nCette expression est structurellement identique à l'entropie statistique de Gibbs pour un micro-état :\n\n$$S = - k_B \\sum_{i} p_i \\ln p_i$$\n\nCet isomorphisme n'est pas une simple coïncidence de notation : il démontre que l'information est une grandeur thermodynamique tangible, convertible en énergie via le facteur $k_B \\ln 2$ par bit d'information, un lien qui sera au cœur du principe de Landauer sur le coût énergétique de l'effacement d'un bit.`,
				en: `Shannon's entropy measures the average amount of information carried by a discrete source, defined as:\n\n$$H = - \\sum_{i} p_i \\log_2 p_i$$\n\nThis expression is structurally identical to Gibbs's statistical entropy for a microstate:\n\n$$S = - k_B \\sum_{i} p_i \\ln p_i$$\n\nThis isomorphism is not a mere notational coincidence: it demonstrates that information is a tangible thermodynamic quantity, convertible into energy via the factor $k_B \\ln 2$ per bit of information, a link that would later become central to Landauer's principle on the energy cost of erasing a bit.`
			},
			external: false
		}
	]
};
