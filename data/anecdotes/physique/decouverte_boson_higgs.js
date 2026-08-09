export default {
	id: 'anecdote_decouverte_boson_higgs',
	enabled: true,
	priority: 3,
	addedDate: '2026-07-30',
	domain: { fr: 'Physique - Physique des particules', en: 'Physics - Particle Physics' },
	scheduling: { type: 'annual', dates: ['07-04'] },
	content: (lang, year) => {
		const elapsed = year - 2012;
		return lang === 'fr'
			? `Le 4 juillet 2012, les collaborations ATLAS et CMS du CERN annoncent la découverte d'une nouvelle particule compatible avec le boson de Higgs, confirmant 48 ans après sa prédiction théorique le mécanisme donnant leur masse aux particules élémentaires, il y a désormais ${elapsed} ans.`
			: `On July 4, 2012, the ATLAS and CMS collaborations at CERN announced the discovery of a new particle consistent with the Higgs boson, confirming 48 years after its theoretical prediction the mechanism giving elementary particles their mass, ${elapsed} years ago.`;
	},
	sources: [
		{
			name: { fr: 'CERN', en: 'CERN' },
			url: 'https://home.cern/fr/science/physics/higgs-boson/'
		}
	],
	contexts: [
		{
			title: { fr: 'Le mécanisme de Brout-Englert-Higgs', en: 'The Brout-Englert-Higgs mechanism' },
			body: {
				fr: `Proposé en 1964 indépendamment par Robert Brout et François Englert, puis par Peter Higgs, le mécanisme postule l'existence d'un champ scalaire emplissant tout l'espace. Les particules élémentaires acquièrent leur masse en interagissant avec ce champ, à des degrés divers selon la force du couplage.\n\nLe boson associé à ce champ, d'une masse d'environ 125 GeV/c², est extrêmement instable et se désintègre en une fraction infime de seconde. Sa détection au Grand collisionneur de hadrons a nécessité l'analyse statistique de milliards de collisions proton-proton pour isoler un signal ne représentant qu'un excès infime d'événements par rapport au bruit de fond attendu.\n\nFrançois Englert et Peter Higgs reçurent le prix Nobel de physique en 2013 pour cette prédiction théorique, Robert Brout étant décédé en 2011.`,
				en: `Proposed in 1964 independently by Robert Brout and François Englert, and then by Peter Higgs, the mechanism postulates the existence of a scalar field filling all of space. Elementary particles acquire mass by interacting with this field, to varying degrees depending on the coupling strength.\n\nThe boson associated with this field, with a mass of about 125 GeV/c², is extremely unstable and decays within a tiny fraction of a second. Its detection at the Large Hadron Collider required the statistical analysis of billions of proton-proton collisions to isolate a signal representing only a tiny excess of events relative to the expected background.\n\nFrançois Englert and Peter Higgs received the 2013 Nobel Prize in Physics for this theoretical prediction, Robert Brout having passed away in 2011.`
			},
			external: false
		}
	]
};
