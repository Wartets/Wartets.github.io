export default {
	id: 'anecdote_hilbert_hotel_infinity',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Mathématiques / Théorie des Ensembles', en: 'Mathematics / Set Theory' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Imaginez un hôtel possédant une infinité dénombrable de chambres, toutes occupées, où arrive pourtant un nouveau client. Le mathématicien David Hilbert, dans une conférence de 1924, montra qu'il suffit de déplacer chaque occupant de la chambre $n$ vers la chambre $n+1$ pour libérer la chambre 1 et accueillir le nouvel arrivant, sans jamais mettre personne à la porte. Ce paradoxe illustre de façon vivante les propriétés contre-intuitives de l'infini dénombrable.`,
		en: `Imagine a hotel with a countably infinite number of rooms, all occupied, when a new guest arrives. Mathematician David Hilbert, in a 1924 lecture, showed that simply moving every occupant from room $n$ to room $n+1$ frees up room 1 to welcome the newcomer, without ever turning anyone away. This paradox vividly illustrates the counter-intuitive properties of countable infinity.`
	},
	sources: [
		{
			name: { fr: 'One Two Three... Infinity (G. Gamow, 1947, popularisant la conférence de Hilbert de 1924)', en: 'One Two Three... Infinity (G. Gamow, 1947, popularizing Hilbert\'s 1924 lecture)' },
			url: 'https://archive.org/details/onetwothreeinfin00gamo'
		}
	],
	contexts: [
		{
			title: { fr: 'Accueillir une infinité de nouveaux clients', en: 'Welcoming infinitely many new guests' },
			body: {
				fr: `Le décalage $n \\mapsto n+1$ est une bijection entre $\\mathbb{N}$ et $\\mathbb{N} \\setminus \\{1\\}$, confirmant que retirer un élément d'un ensemble infini dénombrable n'en change pas la cardinalité. Plus surprenant encore : si un bus contenant une infinité dénombrable de nouveaux clients arrive, il suffit de déplacer chaque occupant de la chambre $n$ vers la chambre $2n$, libérant instantanément toutes les chambres impaires pour les nouveaux venus, démontrant que $|\\mathbb{N}| + |\\mathbb{N}| = |\\mathbb{N}|$, une égalité qui n'a aucun équivalent dans l'arithmétique des nombres finis.`,
				en: `The shift $n \\mapsto n+1$ is a bijection between $\\mathbb{N}$ and $\\mathbb{N} \\setminus \\{1\\}$, confirming that removing one element from a countably infinite set does not change its cardinality. Even more surprising: if a bus carrying countably infinitely many new guests arrives, moving each occupant from room $n$ to room $2n$ instantly frees every odd-numbered room for the newcomers, demonstrating that $|\\mathbb{N}| + |\\mathbb{N}| = |\\mathbb{N}|$, an equality with no equivalent in finite-number arithmetic.`
			},
			external: false
		}
	]
};
