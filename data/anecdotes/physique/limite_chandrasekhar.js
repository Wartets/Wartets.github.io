import { formatNumber } from '/js/anecdotes/format.js';

export default {
	id: 'anecdote_limite_chandrasekhar',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-30',
	domain: { fr: 'Physique - Astrophysique', en: 'Physics - Astrophysics' },
	scheduling: { type: 'anytime', dates: [] },
	content: (lang) => {
		const limit = formatNumber(1.4, lang);
		return lang === 'fr'
			? `En 1930, à seulement 19 ans, Subrahmanyan Chandrasekhar calcule qu'une naine blanche ne peut excéder environ ${limit} masse solaire sans s'effondrer sous sa propre gravité, faute de pression de dégénérescence électronique suffisante pour la retenir.`
			: `In 1930, at only 19 years old, Subrahmanyan Chandrasekhar calculated that a white dwarf cannot exceed roughly ${limit} solar masses without collapsing under its own gravity, lacking sufficient electron degeneracy pressure to hold it up.`;
	},
	sources: [
		{
			name: { fr: 'Fondation Nobel', en: 'Nobel Foundation' },
			url: 'https://www.nobelprize.org/prizes/physics/1983/chandrasekhar/biographical/'
		}
	],
	contexts: [
		{
			title: { fr: 'Une controverse retentissante', en: 'A resounding controversy' },
			body: {
				fr: `Chandrasekhar élabore ce résultat durant la traversée en bateau qui le mène de l'Inde à Cambridge. Il combine la mécanique quantique relativiste et la pression de dégénérescence des électrons, un gaz d'électrons libres obéissant au principe d'exclusion de Pauli, pour déterminer la masse maximale au-delà de laquelle cette pression ne peut plus contrebalancer la gravitation.\n\nAu-delà de cette limite, environ 1,4 masse solaire, l'étoile ne peut se stabiliser en naine blanche et poursuit son effondrement, aboutissant selon les cas à une supernova, une étoile à neutrons ou un trou noir.\n\nSir Arthur Eddington, alors figure dominante de l'astrophysique britannique, rejeta publiquement ce résultat en 1935, le jugeant physiquement absurde. Il fallut plusieurs décennies et la découverte des étoiles à neutrons et des trous noirs pour que la communauté scientifique reconnaisse pleinement la validité du calcul de Chandrasekhar, qui reçut le prix Nobel de physique en 1983.`,
				en: `Chandrasekhar developed this result during the boat voyage that took him from India to Cambridge. He combined relativistic quantum mechanics and electron degeneracy pressure, a gas of free electrons obeying the Pauli exclusion principle, to determine the maximum mass beyond which this pressure can no longer counterbalance gravity.\n\nBeyond this limit, about 1.4 solar masses, the star cannot stabilize as a white dwarf and continues to collapse, resulting depending on circumstances in a supernova, a neutron star, or a black hole.\n\nSir Arthur Eddington, then a dominant figure in British astrophysics, publicly rejected this result in 1935, deeming it physically absurd. It took several decades and the discovery of neutron stars and black holes for the scientific community to fully recognize the validity of Chandrasekhar's calculation, for which he received the 1983 Nobel Prize in Physics.`
			},
			external: false
		}
	]
};
