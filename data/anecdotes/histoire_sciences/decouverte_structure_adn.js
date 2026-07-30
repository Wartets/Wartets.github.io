export default {
	id: 'anecdote_decouverte_structure_adn',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-30',
	domain: { fr: 'Biologie - Biologie moléculaire', en: 'Biology - Molecular Biology' },
	scheduling: { type: 'annual', dates: ['02-28'] },
	content: (lang, year) => {
		const elapsed = year - 1953;
		return lang === 'fr'
			? `Le 28 février 1953, James Watson et Francis Crick annoncent au Eagle Pub de Cambridge avoir « découvert le secret de la vie » : la structure en double hélice de l'ADN, il y a désormais ${elapsed} ans.`
			: `On February 28, 1953, James Watson and Francis Crick announced at the Eagle Pub in Cambridge that they had "found the secret of life": the double helix structure of DNA, ${elapsed} years ago.`;
	},
	sources: [
		{
			name: { fr: 'Nature (1953)', en: 'Nature (1953)' },
			url: 'https://www.nature.com/articles/171737a0'
		}
	],
	contexts: [
		{
			title: { fr: 'Un modèle construit sur des données tierces', en: 'A model built on third-party data' },
			body: {
				fr: `Watson et Crick n'ont réalisé eux-mêmes aucune expérience de diffraction. Leur modèle s'appuie de façon décisive sur la photographie 51, un cliché de diffraction des rayons X obtenu par Rosalind Franklin et son doctorant Raymond Gosling, révélant la structure hélicoïdale de la molécule.\n\nCette photographie leur fut montrée par Maurice Wilkins, collègue de Franklin, sans que celle-ci en soit informée ni n'ait donné son accord explicite, un épisode resté controversé dans l'historiographie des sciences.\n\nWatson, Crick et Wilkins reçurent le prix Nobel de physiologie ou médecine en 1962. Rosalind Franklin, décédée en 1958 d'un cancer probablement lié à son exposition aux rayons X, ne pouvait être nommée, le prix Nobel n'étant pas attribué à titre posthume.`,
				en: `Watson and Crick did not perform any diffraction experiments themselves. Their model relies decisively on Photograph 51, an X-ray diffraction image obtained by Rosalind Franklin and her doctoral student Raymond Gosling, revealing the molecule's helical structure.\n\nThis photograph was shown to them by Maurice Wilkins, Franklin's colleague, without her being informed or having given explicit consent, an episode that remains controversial in the historiography of science.\n\nWatson, Crick, and Wilkins received the 1962 Nobel Prize in Physiology or Medicine. Rosalind Franklin, who died in 1958 of cancer likely linked to her X-ray exposure, could not be named, as the Nobel Prize is not awarded posthumously.`
			},
			external: false
		}
	]
};
