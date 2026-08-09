export default {
	id: 'anecdote_potato_paradox_algebra',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Mathématiques - Algèbre', en: 'Mathematics - Algebra' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `L'intuition humaine gère très mal les pourcentages, comme l'illustre ce paradoxe classique de l'algèbre. Vous possédez 100 kg de pommes de terre composées à 99 % d'eau. Vous les laissez sécher au soleil jusqu'à ce qu'elles ne soient plus composées qu'à 98 % d'eau. À la surprise générale, en perdant seulement « 1 % » d'eau sur le papier, vos pommes de terre ne pèsent plus que 50 kg : elles ont perdu la moitié de leur poids total.`,
		en: `Human intuition handles percentages remarkably poorly, as this classic algebra paradox illustrates. You own 100 kg of potatoes made up of 99% water. You leave them to dry in the sun until they are only 98% water. To everyone's surprise, having lost only "1%" of water on paper, your potatoes now weigh just 50 kg: they have lost half of their total weight.`
	},
	sources: [
		{
			name: { fr: 'The Universal Book of Mathematics: From Abracadabra to Zeno\'s Paradoxes (David Darling, John Wiley & Sons, 2004)', en: 'The Universal Book of Mathematics: From Abracadabra to Zeno\'s Paradoxes (David Darling, John Wiley & Sons, 2004)' },
			url: 'https://www.softouch.on.ca/kb/data/Universal%20Book%20of%20Mathematics%20%28The%29.pdf'
		}
	],
	contexts: [
		{
			title: { fr: 'Invariance de la masse sèche', en: 'Invariance of the dry mass' },
			body: {
				fr: `La résolution du paradoxe nécessite d'isoler la constante du système : la matière sèche (solide). Initialement, sur $100$ kg de pommes de terre à $99\\%$ d'eau, la masse d'eau est de $99$ kg et la masse sèche est de $1$ kg.\n\nLors du séchage, seule l'eau s'évapore : la masse sèche finale reste rigoureusement égale à $1$ kg. Si les pommes de terre finales contiennent $98\\%$ d'eau, la masse sèche représente donc $2\\%$ de la masse totale $M_f$. L'équation du premier degré s'écrit :\n\n$$0,02 \\times M_f = 1 \\text{ kg} \\implies M_f = \\frac{1}{0,02} = 50 \\text{ kg}$$\n\nLa masse totale a été divisée par deux, alors que le pourcentage d'eau n'a chuté que d'un point : c'est la non-linéarité du rapport qui trompe l'intuition.`,
				en: `Resolving the paradox requires isolating the one constant of the system: the dry matter (solids). Initially, in $100$ kg of potatoes at $99\\%$ water, the water mass is $99$ kg and the dry mass is $1$ kg.\n\nDuring drying, only water evaporates: the final dry mass remains exactly $1$ kg. If the final potatoes contain $98\\%$ water, the dry mass therefore represents $2\\%$ of the total mass $M_f$. The resulting first-degree equation is:\n\n$$0.02 \\times M_f = 1 \\text{ kg} \\implies M_f = \\frac{1}{0.02} = 50 \\text{ kg}$$\n\nThe total mass has been halved, even though the water percentage dropped by only one point: it is the non-linearity of the ratio that deceives intuition.`
			},
			external: false
		}
	]
};
