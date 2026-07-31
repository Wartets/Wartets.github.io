export default {
	id: 'anecdote_banana_antimatter_positron',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Physique Nucléaire', en: 'Nuclear Physics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `L'antimatière semble relever de la science-fiction ou des accélérateurs de particules géants, pourtant, une simple banane en produit régulièrement. Les bananes sont naturellement riches en potassium. Une infime fraction de ce potassium est l'isotope instable Potassium-40. Lors de sa désintégration radioactive, il émet, environ une fois toutes les 75 minutes, un positron (l'anti-électron). Le positron s'annihile presque instantanément avec un électron environnant, émettant deux photons gamma inoffensifs à l'échelle humaine.`,
		en: `Antimatter might seem to belong to the realm of science fiction or giant particle accelerators, yet an ordinary banana regularly produces some. Bananas are naturally rich in potassium. A tiny fraction of that potassium is the unstable isotope potassium-40. During its radioactive decay, about once every 75 minutes, it emits a positron (the anti-electron). The positron annihilates almost instantly with a nearby electron, releasing two harmless gamma photons on a human scale.`
	},
	sources: [
		{
			name: { fr: 'Radioactivity in the Environment (IAEA - International Atomic Energy Agency)', en: 'Radioactivity in the Environment (IAEA - International Atomic Energy Agency)' },
			url: 'https://www.iaea.org/Publications/Factsheets/English/radlife'
		}
	],
	contexts: [
		{
			title: { fr: 'Émission Bêta Plus et Annihilation', en: 'Beta-plus decay and annihilation' },
			body: {
				fr: `Le Potassium-40 a trois voies de désintégration possibles. Dans environ 0,001 % des cas, un proton du noyau se transforme en neutron en émettant un positron ($\\beta^+$) et un neutrino électronique ($\\nu_e$). L'équation nucléaire s'écrit :\n\n$$^{40}_{19}\\text{K} \\rightarrow\\, ^{40}_{18}\\text{Ar} + e^+ + \\nu_e$$\n\nL'énergie de masse libérée lors de l'annihilation du positron avec un électron donne deux photons de $511 \\text{ keV}$ chacun, conservant l'impulsion totale.`,
				en: `Potassium-40 has three possible decay pathways. In about 0.001% of cases, a proton in the nucleus converts into a neutron by emitting a positron ($\\beta^+$) and an electron neutrino ($\\nu_e$). The nuclear equation is written:\n\n$$^{40}_{19}\\text{K} \\rightarrow\\, ^{40}_{18}\\text{Ar} + e^+ + \\nu_e$$\n\nThe mass-energy released when the positron annihilates with an electron produces two photons of $511 \\text{ keV}$ each, conserving total momentum.`
			},
			external: false
		}
	]
};
