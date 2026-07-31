export default {
	id: 'anecdote_banach_tarski_paradox',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Mathématiques - Théorie de la Mesure', en: 'Mathematics - Measure Theory' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Il existe un théorème mathématiquement rigoureux stipulant qu'il est possible de découper une sphère pleine en un nombre fini de morceaux (généralement 5), de les déplacer en utilisant uniquement des rotations et des translations, pour finalement les réassembler et former deux sphères pleines identiques à l'originale. Ce paradoxe, démontrant l'existence d'ensembles non mesurables, repose fondamentalement sur l'axiome du choix de la théorie des ensembles de Zermelo-Fraenkel.`,
		en: `There exists a mathematically rigorous theorem stating that a solid sphere can be cut into a finite number of pieces (typically 5), moved using only rotations and translations, and reassembled to form two solid spheres identical to the original. This paradox, demonstrating the existence of non-measurable sets, fundamentally relies on the Axiom of Choice from Zermelo-Fraenkel set theory.`
	},
	sources: [
		{
			name: { fr: 'Sur la décomposition des ensembles de points en parties respectivement congruentes (1924)', en: 'Sur la décomposition des ensembles de points en parties respectivement congruentes (1924)' },
			url: 'http://matwbn.icm.edu.pl/ksiazki/fm/fm6/fm6127.pdf'
		}
	],
	contexts: [
		{
			title: { fr: 'Action de groupe et ensembles non mesurables', en: 'Group action and non-measurable sets' },
			body: {
				fr: `La démonstration repose sur le groupe des rotations orthogonales $SO(3)$, qui contient un sous-groupe isomorphe au groupe libre à deux générateurs $F_2$.\n\nCe groupe libre admet une décomposition paradoxale de lui-même :\n\n$$F_2 = \\{e\\} \\cup a F_2 \\cup a^{-1} F_2 \\cup b F_2 \\cup b^{-1} F_2$$\n\nEn transportant cette décomposition sur la sphère via l'action du groupe de rotations, on obtient des « morceaux » qui ne possèdent aucune mesure de Lebesgue cohérente : le concept usuel de volume devient caduc lors de cette opération. C'est précisément l'axiome du choix, permettant de sélectionner un représentant dans chaque orbite de cette action sans procédure explicite, qui rend cette construction possible, suscitant depuis un profond débat philosophique sur la nature de l'infini en mathématiques.`,
				en: `The proof relies on the group of orthogonal rotations $SO(3)$, which contains a subgroup isomorphic to the free group on two generators $F_2$.\n\nThis free group admits a paradoxical decomposition of itself:\n\n$$F_2 = \\{e\\} \\cup a F_2 \\cup a^{-1} F_2 \\cup b F_2 \\cup b^{-1} F_2$$\n\nBy transporting this decomposition onto the sphere via the rotation group's action, one obtains "pieces" that carry no coherent Lebesgue measure: the usual notion of volume becomes meaningless during this operation. It is precisely the Axiom of Choice, allowing a representative to be selected from each orbit of this action without an explicit procedure, that makes this construction possible, sparking a profound philosophical debate ever since on the nature of infinity in mathematics.`
			},
			external: false
		}
	]
};
