export default {
	id: 'anecdote_monty_hall_probability',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Probabilités et Statistiques', en: 'Probability and Statistics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Vous participez à un jeu télévisé. Devant vous, trois portes : derrière l'une se trouve une voiture, derrière les deux autres, des chèvres. Vous choisissez une porte. L'animateur, qui sait où se trouve la voiture, ouvre alors l'une des portes restantes pour révéler une chèvre, puis vous demande si vous souhaitez changer de porte. L'intuition suggère que les chances sont désormais de 50/50. C'est faux : mathématiquement, changer de porte double vos chances de gagner, qui passent de 1/3 à 2/3.`,
		en: `You are on a game show. In front of you, three doors: behind one is a car, behind the other two, goats. You pick a door. The host, who knows where the car is, then opens one of the remaining doors to reveal a goat, and asks whether you want to switch doors. Intuition suggests the odds are now 50/50. This is wrong: mathematically, switching doors doubles your chances of winning, from 1/3 to 2/3.`
	},
	sources: [
		{
			name: { fr: 'The Monty Hall problem (S. Selvin, The American Statistician, 1975)', en: 'The Monty Hall problem (S. Selvin, The American Statistician, 1975)' },
			url: 'https://amstat.tandfonline.com/doi/abs/10.1080/00031305.1975.10479121'
		}
	],
	contexts: [
		{
			title: { fr: 'Théorème de Bayes et probabilités conditionnelles', en: "Bayes' theorem and conditional probability" },
			body: {
				fr: `Notons $V_i$ l'événement « la voiture est derrière la porte $i$ » et $A_j$ « l'animateur ouvre la porte $j$ ». Au départ, $P(V_i) = 1/3$ pour tout $i$. Si vous avez choisi la porte 1 et que l'animateur ouvre la porte 3, on cherche $P(V_2 | A_3)$. L'animateur ne choisit pas au hasard : si la voiture est en 2, il est forcé d'ouvrir la 3, donc $P(A_3 | V_2) = 1$. Par le théorème de Bayes :\n\n$$P(V_2 | A_3) = \\frac{P(A_3 | V_2)P(V_2)}{P(A_3|V_1)P(V_1) + P(A_3|V_2)P(V_2)} = \\frac{1 \\times 1/3}{(1/2 \\times 1/3) + (1 \\times 1/3)} = \\frac{2}{3}$$`,
				en: `Let $V_i$ denote the event "the car is behind door $i$" and $A_j$ "the host opens door $j$". Initially, $P(V_i) = 1/3$ for every $i$. If you picked door 1 and the host opens door 3, we seek $P(V_2 | A_3)$. The host does not choose randomly: if the car is behind door 2, they are forced to open door 3, so $P(A_3 | V_2) = 1$. By Bayes' theorem:\n\n$$P(V_2 | A_3) = \\frac{P(A_3 | V_2)P(V_2)}{P(A_3|V_1)P(V_1) + P(A_3|V_2)P(V_2)} = \\frac{1 \\times 1/3}{(1/2 \\times 1/3) + (1 \\times 1/3)} = \\frac{2}{3}$$`
			},
			external: false
		}
	]
};
