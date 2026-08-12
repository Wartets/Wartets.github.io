export default {
	id: 'anecdote_nobel_prize_ceremony_december',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Histoire des Sciences', en: 'History of Science' },
	scheduling: { type: 'period', dates: ['12-08', '12-11'] },
	content: {
		fr: `Chaque 10 décembre, jour anniversaire de la mort d'Alfred Nobel en 1896, Stockholm accueille la cérémonie de remise des prix Nobel de physique, chimie, médecine, littérature et sciences économiques, tandis que le prix de la paix est décerné le même jour à Oslo, conformément aux volontés testamentaires de Nobel. Le tout premier prix de physique, en 1901, récompensa Wilhelm Röntgen pour sa découverte des rayons X.`,
		en: `Every December 10, the anniversary of Alfred Nobel's death in 1896, Stockholm hosts the award ceremony for the Nobel Prizes in physics, chemistry, medicine, literature, and economic sciences, while the peace prize is presented the same day in Oslo, in accordance with Nobel's will. The very first physics prize, in 1901, honored Wilhelm Röntgen for his discovery of X-rays.`
	},
	sources: [
		{
			name: { fr: 'The Nobel Prize - Official Website', en: 'The Nobel Prize - Official Website' },
			url: 'https://www.nobelprize.org'
		}
	],
	contexts: [
		{
			title: { fr: 'Le financement du prix par le brevet de la dynamite', en: 'Funding the prize through the dynamite patent' },
			body: {
				fr: `Alfred Nobel déposa plus de 350 brevets au cours de sa vie, dont celui de la dynamite en 1867, un explosif à base de nitroglycérine stabilisée par de la terre de diatomées. Sa fortune, léguée en 1895 à une fondation chargée de récompenser chaque année « ceux qui auront apporté le plus grand bénéfice à l'humanité », est depuis gérée et réinvestie par la Fondation Nobel, le montant exact de chaque prix variant chaque année selon les performances financières du capital placé.`,
				en: `Alfred Nobel filed more than 350 patents during his lifetime, including dynamite in 1867, an explosive based on nitroglycerin stabilized with diatomaceous earth. His fortune, bequeathed in 1895 to a foundation tasked with annually rewarding "those who have conferred the greatest benefit to humankind", has since been managed and reinvested by the Nobel Foundation, with the exact prize amount varying each year according to the financial performance of the invested capital.`
			},
			external: false
		}
	]
};
