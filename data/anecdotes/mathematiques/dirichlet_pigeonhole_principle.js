export default {
	id: 'anecdote_dirichlet_pigeonhole_principle',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Combinatoire / Logique', en: 'Combinatorics / Logic' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Le « principe des tiroirs » est une idée mathématique d'une simplicité enfantine : si l'on a 10 pigeons et seulement 9 nids, il est mathématiquement certain qu'au moins un nid contiendra deux pigeons. Cette trivialité apparente permet de prouver des faits complexes : elle sert par exemple à démontrer de manière irréfutable qu'il existe, dans n'importe quelle grande ville, au moins deux personnes ayant très exactement le même nombre de cheveux sur la tête, au cheveu près.`,
		en: `The "pigeonhole principle" is a mathematical idea of childlike simplicity: if there are 10 pigeons and only 9 nests, it is mathematically certain that at least one nest will contain two pigeons. This apparent triviality can prove remarkably complex facts: it is used, for instance, to irrefutably show that in any large city there exist at least two people with the exact same number of hairs on their head, down to the strand.`
	},
	sources: [
		{
			name: { fr: 'Dirichlet\'s Box Principle (Cut The Knot Mathematics)', en: "Dirichlet's Box Principle (Cut The Knot Mathematics)" },
			url: 'https://www.cut-the-knot.org/do_you_know/pigeon.shtml'
		}
	],
	contexts: [
		{
			title: { fr: 'Formalisation du principe et probabilité absolue', en: 'Formalization of the principle and absolute certainty' },
			body: {
				fr: `Soit un ensemble $A$ (les cheveux) de cardinal $n$, et un ensemble $B$ (les habitants d'une ville) de cardinal $m$. Si une fonction $f: A \\to B$ relie ces ensembles et que $m > n$, la fonction ne peut pas être injective. Le nombre maximum de cheveux sur une tête humaine est scientifiquement borné à environ $n = 200\\,000$. Pour une population $m \\approx 2\\,000\\,000$ d'habitants, avec $m \\gg n$, l'équation de répartition assure qu'au moins une classe d'équivalence contient un minimum de :\n\n$$\\left\\lceil \\frac{m}{n} \\right\\rceil = \\left\\lceil \\frac{2\\,000\\,000}{200\\,000} \\right\\rceil = 10\\ \\text{personnes}$$`,
				en: `Let $A$ (hairs) have cardinality $n$, and $B$ (a city's inhabitants) have cardinality $m$. If a function $f: A \\to B$ maps these sets and $m > n$, the function cannot be injective. The maximum number of hairs on a human head is scientifically bounded at about $n = 200,000$. For a population of $m \\approx 2,000,000$ inhabitants, since $m \\gg n$, the distribution equation guarantees that at least one equivalence class contains a minimum of:\n\n$$\\left\\lceil \\frac{m}{n} \\right\\rceil = \\left\\lceil \\frac{2,000,000}{200,000} \\right\\rceil = 10\\ \\text{people}$$`
			},
			external: false
		}
	]
};
