export default {
	id: 'anecdote_chirality_limonene_smell',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Chimie Organique / Biophysique', en: 'Organic Chemistry / Biophysics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `La molécule responsable de l'odeur du citron et celle responsable de l'odeur de l'orange sont strictement identiques sur le papier : même formule chimique (C10H16), même structure géométrique. Leur seule différence est d'être l'image miroir l'une de l'autre, comme la main gauche et la main droite. Nos récepteurs olfactifs sont des serrures tridimensionnelles si précises qu'elles différencient parfaitement la molécule « droitière » (le R-limonène, qui sent l'orange) de la molécule « gauchère » (le S-limonène, qui sent le citron ou le pin). On appelle cela la chiralité.`,
		en: `The molecule responsible for the smell of lemon and the one responsible for the smell of orange are strictly identical on paper: same chemical formula (C10H16), same geometric structure. Their only difference is that they are mirror images of one another, like the left and right hand. Our olfactory receptors are three-dimensional locks so precise that they perfectly distinguish the "right-handed" molecule (R-limonene, which smells of orange) from the "left-handed" one (S-limonene, which smells of lemon or pine). This is called chirality.`
	},
	sources: [
		{
			name: { fr: 'Stereochemical effects in olfaction (L. Friedman, J.G. Miller, Science, 1971)', en: 'Stereochemical effects in olfaction (L. Friedman, J.G. Miller, Science, 1971)' },
			url: 'https://www.science.org/doi/10.1126/science.172.3987.1044'
		}
	],
	contexts: [
		{
			title: { fr: 'Énantiomères et stéréochimie', en: 'Enantiomers and stereochemistry' },
			body: {
				fr: `Une molécule est chirale si elle n'est pas superposable à son image dans un miroir, souvent en raison d'un carbone asymétrique lié à quatre substituants différents. Les deux formes sont appelées énantiomères. Bien qu'elles partagent exactement les mêmes propriétés physiques scalaires (température d'ébullition, densité), elles interagissent différemment avec la lumière polarisée et avec d'autres molécules chirales, comme les protéines biologiques. La rotation spécifique du plan de polarisation de la lumière est donnée par la loi de Biot :\n\n$$\\alpha = [\\alpha]_{D}^{T} \\times l \\times c$$\n\nL'énantiomère R fait tourner la lumière d'un angle $+\\alpha$ et le S d'un angle $-\\alpha$.`,
				en: `A molecule is chiral if it is not superimposable on its mirror image, often due to an asymmetric carbon bonded to four different substituents. The two forms are called enantiomers. Although they share exactly the same scalar physical properties (boiling point, density), they interact differently with polarized light and with other chiral molecules, such as biological proteins. The specific rotation of the plane of polarization of light is given by Biot's law:\n\n$$\\alpha = [\\alpha]_{D}^{T} \\times l \\times c$$\n\nThe R enantiomer rotates light by an angle $+\\alpha$ and the S enantiomer by $-\\alpha$.`
			},
			external: false
		}
	]
};
