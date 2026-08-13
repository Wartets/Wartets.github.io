export default {
	id: 'anecdote_negative_absolute_temperature_spin',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-13',
	domain: { fr: 'Physique Statistique / Thermodynamique', en: 'Statistical Physics / Thermodynamics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Le zéro absolu n'est pas la limite basse ultime de l'échelle des températures. Dans des systèmes quantiques bornés en énergie, comme des réseaux de spins, il est possible d'atteindre des températures absolues négatives. Paradoxalement, un système à température négative n'est pas plus froid que le zéro absolu : il est thermodynamiquement plus chaud que n'importe quelle température positive, cédant toujours de la chaleur à un système positif mis en contact avec lui.`,
		en: `Absolute zero is not the ultimate lower bound of the temperature scale. In quantum systems with a bounded energy spectrum, such as spin lattices, it is possible to reach negative absolute temperatures. Paradoxically, a system at negative temperature is not colder than absolute zero: it is thermodynamically hotter than any positive temperature, always releasing heat into a positive-temperature system it is placed in contact with.`
	},
	sources: [
		{
			name: { fr: 'A Nuclear Spin System at Negative Temperature (Purcell, Pound, Physical Review, 1951)', en: 'A Nuclear Spin System at Negative Temperature (Purcell, Pound, Physical Review, 1951)' },
			url: 'https://doi.org/10.1103/PhysRev.81.279'
		}
	],
	contexts: [
		{
			title: { fr: 'Entropie, énergie bornée et inversion de population', en: 'Entropy, bounded energy, and population inversion' },
			body: {
				fr: `La température statistique est définie par $1/T = \\partial S/\\partial U$. Pour un gaz ordinaire, l'énergie n'est pas bornée : ajouter de l'énergie augmente toujours le nombre de micro-états, donc $S$, gardant $T>0$. Un réseau de spins dans un champ magnétique possède au contraire une énergie maximale (spins tous anti-alignés) : au-delà de l'énergie médiane, ajouter de l'énergie réduit le nombre de configurations accessibles, rendant $\\partial S/\\partial U$ négatif. La distribution de Boltzmann devient alors croissante avec l'énergie, caractéristique d'une température négative.`,
                en: `Statistical temperature is defined by $1/T = \\partial S/\\partial U$. For an ordinary gas, energy is unbounded: adding energy always increases the number of microstates, hence $S$, keeping $T>0$. A spin lattice in a magnetic field, on the other hand, has a maximum energy (all spins anti-aligned): beyond the median energy, adding energy reduces the number of accessible configurations, making $\\partial S/\\partial U$ negative. The Boltzmann distribution then becomes increasing with energy, characteristic of a negative temperature.`
            },
        }
    ]
}
