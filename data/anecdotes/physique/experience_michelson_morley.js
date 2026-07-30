export default {
	id: 'anecdote_experience_michelson_morley',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-30',
	domain: { fr: 'Physique - Relativité', en: 'Physics - Relativity' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1887, Albert Michelson et Edward Morley cherchent à mesurer la vitesse de la Terre par rapport à l'éther luminifère supposé emplir l'espace. Leur interféromètre ne détecte aucune variation, un résultat négatif qui deviendra l'une des expériences les plus influentes de l'histoire de la physique.`,
		en: `In 1887, Albert Michelson and Edward Morley sought to measure Earth's velocity relative to the luminiferous ether presumed to fill space. Their interferometer detected no variation whatsoever, a null result that would become one of the most influential experiments in the history of physics.`
	},
	sources: [
		{
			name: { fr: 'American Journal of Science (1887)', en: 'American Journal of Science (1887)' },
			url: 'https://en.wikisource.org/wiki/On_the_Relative_Motion_of_the_Earth_and_the_Luminiferous_Ether'
		}
	],
	contexts: [
		{
			title: { fr: 'Un résultat négatif fondateur', en: 'A foundational null result' },
			body: {
				fr: `L'interféromètre de Michelson-Morley sépare un faisceau lumineux en deux trajets perpendiculaires, réfléchis par des miroirs puis recombinés. Si la Terre se déplaçait à travers un éther fixe, la vitesse de la lumière mesurée le long de chaque bras devrait varier selon l'orientation de l'appareil, produisant des franges d'interférence décalées.\n\nAucun décalage significatif ne fut observé, quelle que soit l'orientation ou le moment de la journée. Ce résultat contredisait directement l'hypothèse de l'éther, alors largement acceptée depuis les travaux de Fresnel et Maxwell sur la propagation ondulatoire de la lumière.\n\nL'absence d'explication satisfaisante dans le cadre classique motivera les travaux de Lorentz sur la contraction des longueurs, puis la formulation par Einstein, en 1905, de la relativité restreinte, qui postule directement l'invariance de la vitesse de la lumière sans recourir à un milieu de propagation.`,
				en: `The Michelson-Morley interferometer splits a light beam into two perpendicular paths, reflected by mirrors and then recombined. If Earth moved through a fixed ether, the speed of light measured along each arm should vary with the instrument's orientation, producing shifted interference fringes.\n\nNo significant shift was observed, regardless of orientation or time of day. This result directly contradicted the ether hypothesis, then widely accepted following Fresnel's and Maxwell's work on the wave propagation of light.\n\nThe lack of a satisfactory classical explanation motivated Lorentz's work on length contraction, and then Einstein's 1905 formulation of special relativity, which directly postulates the invariance of the speed of light without recourse to a propagation medium.`
			},
			external: false
		}
	]
};
