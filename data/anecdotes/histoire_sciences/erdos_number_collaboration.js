export default {
	id: 'anecdote_erdos_number_collaboration',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Histoire des Sciences / Mathématiques', en: 'History of Science / Mathematics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Le mathématicien hongrois Paul Erdős n'eut jamais de domicile fixe : il voyageait constamment d'université en université, une valise à la main, dormant chez ses collaborateurs et publiant plus de 1500 articles avec près de 500 co-auteurs différents. Cette hyperproductivité collaborative donna naissance au « nombre d'Erdős », une mesure ludique de la distance de collaboration entre un chercheur et Erdős lui-même dans le graphe des publications mathématiques.`,
		en: `The Hungarian mathematician Paul Erdős never had a fixed home: he traveled constantly from university to university, suitcase in hand, sleeping at his collaborators' homes and publishing more than 1,500 papers with nearly 500 different co-authors. This collaborative hyperproductivity gave rise to the "Erdős number", a playful measure of the collaboration distance between a researcher and Erdős himself within the graph of mathematical publications.`
	},
	sources: [
		{
			name: { fr: 'The Erdős Number Project (Oakland University)', en: 'The Erdős Number Project (Oakland University)' },
			url: 'https://oakland.edu/enp/'
		}
	],
	contexts: [
		{
			title: { fr: 'Le graphe de collaboration académique', en: 'The academic collaboration graph' },
			body: {
				fr: `Le nombre d'Erdős se calcule dans un graphe où chaque chercheur est un sommet et chaque co-publication une arête. Erdős lui-même a le nombre 0 ; ses co-auteurs directs ont le nombre 1 ; les co-auteurs de ces co-auteurs ont le nombre 2, et ainsi de suite, le nombre attribué correspondant à la distance du plus court chemin dans ce graphe. La grande majorité des mathématiciens publiants possèdent un nombre d'Erdős inférieur à 5, une illustration concrète du phénomène de « petit monde » observé dans de nombreux réseaux sociaux et scientifiques.`,
				en: `The Erdős number is computed within a graph where each researcher is a vertex and each co-publication an edge. Erdős himself has number 0; his direct co-authors have number 1; the co-authors of those co-authors have number 2, and so on, the assigned number corresponding to the shortest-path distance in this graph. The vast majority of publishing mathematicians have an Erdős number below 5, a concrete illustration of the "small world" phenomenon observed in many social and scientific networks.`
			},
			external: false
		}
	]
};
