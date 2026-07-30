export default {
	id: 'anecdote_premiere_detection_ondes_gravitationnelles',
	enabled: true,
	priority: 3,
	addedDate: '2026-07-30',
	domain: { fr: 'Physique - Relativité générale', en: 'Physics - General Relativity' },
	scheduling: { type: 'annual', dates: ['02-11'] },
	content: (lang, year) => {
		const elapsed = year - 2016;
		return lang === 'fr'
			? `Le 11 février 2016, la collaboration LIGO annonce la première détection directe d'ondes gravitationnelles, produites par la fusion de deux trous noirs il y a 1,3 milliard d'années, confirmant une prédiction d'Einstein vieille de cent ans, il y a désormais ${elapsed} ans.`
			: `On February 11, 2016, the LIGO collaboration announced the first direct detection of gravitational waves, produced by the merger of two black holes 1.3 billion years ago, confirming a century-old prediction by Einstein, ${elapsed} years ago.`;
	},
	sources: [
		{
			name: { fr: 'Physical Review Letters (2016)', en: 'Physical Review Letters (2016)' },
			url: 'https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.116.061102'
		}
	],
	contexts: [
		{
			title: { fr: "L'événement GW150914", en: 'The GW150914 event' },
			body: {
				fr: `Le signal, détecté le 14 septembre 2015 par les deux détecteurs LIGO situés à Livingston et Hanford, provient de la fusion de deux trous noirs de respectivement 36 et 29 masses solaires, produisant un trou noir final de 62 masses solaires. La différence, soit environ 3 masses solaires, fut convertie en énergie rayonnée sous forme d'ondes gravitationnelles.\n\nCes ondes provoquent une déformation de l'espace-temps si infime, de l'ordre de $10^{-21}$ en variation relative de longueur, que les interféromètres de LIGO, longs de 4 kilomètres, durent être capables de mesurer des variations de longueur mille fois plus petites que le diamètre d'un proton.\n\nCette détection valut le prix Nobel de physique 2017 à Rainer Weiss, Barry Barish et Kip Thorne, et ouvrit un nouveau champ d'observation astronomique complémentaire à l'astronomie électromagnétique traditionnelle.`,
				en: `The signal, detected on September 14, 2015 by the two LIGO detectors located at Livingston and Hanford, originated from the merger of two black holes of 36 and 29 solar masses respectively, producing a final black hole of 62 solar masses. The difference, about 3 solar masses, was converted into energy radiated as gravitational waves.\n\nThese waves cause a spacetime distortion so tiny, on the order of $10^{-21}$ in relative length variation, that LIGO's 4-kilometer-long interferometers had to be capable of measuring length variations a thousand times smaller than the diameter of a proton.\n\nThis detection earned the 2017 Nobel Prize in Physics for Rainer Weiss, Barry Barish, and Kip Thorne, and opened a new field of astronomical observation complementary to traditional electromagnetic astronomy.`
			},
			external: false
		}
	]
};
