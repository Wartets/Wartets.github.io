import { pluralize } from '/js/anecdotes/format.js';

export default {
	id: 'anecdote_theoreme_noether',
	enabled: true,
	priority: 3,
	addedDate: '2026-07-30',
	domain: { fr: 'Mathématiques - Physique théorique', en: 'Mathematics - Theoretical Physics' },
	scheduling: { type: 'annual', dates: ['03-23'] },
	content: (lang, year) => {
		const age = year - 1882;
		const yearsLabel = lang === 'fr'
			? pluralize(lang, age, { one: 'an', other: 'ans' })
			: pluralize(lang, age, { one: 'year', other: 'years' });
		return lang === 'fr'
			? `Emmy Noether, née un 23 mars et qui aurait ${age} ${yearsLabel} aujourd'hui, démontra en 1918 que toute symétrie continue d'un système physique correspond à une quantité conservée, unifiant en un seul théorème la conservation de l'énergie, de l'impulsion et du moment cinétique.`
			: `Emmy Noether, born on March 23 and who would be ${age} ${yearsLabel} old today, proved in 1918 that every continuous symmetry of a physical system corresponds to a conserved quantity, unifying the conservation of energy, momentum, and angular momentum in a single theorem.`;
	},
	sources: [
		{
			name: { fr: 'Nachrichten von der Gesellschaft der Wissenschaften zu Göttingen (1918)', en: 'Nachrichten von der Gesellschaft der Wissenschaften zu Göttingen (1918)' },
			url: 'https://gdz.sub.uni-goettingen.de/id/PPN252457811_1918'
		}
	],
	contexts: [
		{
			title: { fr: 'Symétrie et conservation', en: 'Symmetry and conservation' },
			body: {
				fr: `Le théorème de Noether relie chaque symétrie continue de l'action d'un système à une loi de conservation : l'invariance par translation dans le temps donne la conservation de l'énergie, l'invariance par translation dans l'espace donne la conservation de l'impulsion, et l'invariance par rotation donne la conservation du moment cinétique.\n\nMalgré ce résultat fondateur pour la physique théorique moderne, Noether ne put jamais obtenir de poste de professeure titulaire à l'Université de Göttingen en raison des restrictions de l'époque envers les femmes universitaires, et enseigna sous le nom de David Hilbert pendant plusieurs années avant d'obtenir un statut officiel.`,
				en: `Noether's theorem relates every continuous symmetry of a system's action to a conservation law: invariance under time translation yields conservation of energy, invariance under spatial translation yields conservation of momentum, and invariance under rotation yields conservation of angular momentum.\n\nDespite this foundational result for modern theoretical physics, Noether was never able to obtain a tenured professorship at the University of Göttingen due to the era's restrictions on women academics, and lectured under David Hilbert's name for several years before obtaining official status.`
			},
			external: false
		}
	]
};
