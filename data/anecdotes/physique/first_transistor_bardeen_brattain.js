export default {
	id: 'anecdote_first_transistor_bardeen_brattain',
	enabled: true,
	priority: 3,
	addedDate: '2026-08-01',
	domain: { fr: 'Physique des Semi-conducteurs', en: 'Semiconductor Physics' },
	scheduling: { type: 'annual', dates: ['12-23'] },
	content: (lang, year) => {
		const elapsed = year - 1947;
		return lang === 'fr'
			? `L'objet le plus fabriqué de l'histoire de l'humanité, moteur fondamental de tous les ordinateurs et téléphones, fut inventé la veille de Noël 1947 aux laboratoires Bell, il y a désormais ${elapsed} ans. Avant cette date, l'électronique reposait sur des tubes à vide en verre, encombrants, fragiles et brûlants. John Bardeen et Walter Brattain réussirent à reproduire un effet d'amplification du courant électrique à travers un minuscule cristal de germanium sur lequel ils avaient appliqué deux pointes d'or. Le premier transistor (à pointes) était né, changeant la civilisation à tout jamais.`
			: `The most manufactured object in human history, the fundamental engine of every computer and phone, was invented on Christmas Eve 1947 at Bell Labs, ${elapsed} years ago now. Before that date, electronics relied on bulky, fragile, and hot glass vacuum tubes. John Bardeen and Walter Brattain succeeded in reproducing an amplification effect on electric current through a tiny germanium crystal to which they had applied two gold point contacts. The first (point-contact) transistor was born, changing civilization forever.`;
	},
	sources: [
		{
			name: { fr: 'The Transistor, A Semi-Conductor Triode (J. Bardeen, W.H. Brattain, Physical Review, 1948)', en: 'The Transistor, A Semi-Conductor Triode (J. Bardeen, W.H. Brattain, Physical Review, 1948)' },
			url: 'https://journals.aps.org/pr/abstract/10.1103/PhysRev.74.230'
		}
	],
	contexts: [
		{
			title: { fr: 'Niveaux d\'énergie et bande interdite (Gap)', en: 'Energy levels and the forbidden band (Gap)' },
			body: {
				fr: `Contrairement à un métal classique où la bande de conduction recoupe la bande de valence, un semi-conducteur possède une bande interdite (gap $E_g$). Dans le germanium, $E_g \\approx 0,67$ eV. Le contact des pointes d'or injecte des « trous » (charges positives) dans la surface de type N du cristal.\n\nLa concentration intrinsèque en porteurs de charge s'écrit en fonction de la température $T$ :\n\n$$n_i^2 = N_C N_V \\exp\\left(-\\frac{E_g}{k_B T}\\right)$$\n\nLa modulation de ce nuage de charges minoritaires par le courant de l'émetteur contrôle proportionnellement le courant beaucoup plus puissant du collecteur, principe fondateur de l'amplification transistorisée.`,
				en: `Unlike a classical metal, where the conduction band overlaps the valence band, a semiconductor has a forbidden band (gap $E_g$). In germanium, $E_g \\approx 0.67$ eV. The gold point contacts inject "holes" (positive charges) into the N-type surface of the crystal.\n\nThe intrinsic charge-carrier concentration is written as a function of temperature $T$:\n\n$$n_i^2 = N_C N_V \\exp\\left(-\\frac{E_g}{k_B T}\\right)$$\n\nModulating this cloud of minority charges via the emitter current proportionally controls the much more powerful collector current, the founding principle of transistor amplification.`
			},
			external: false
		}
	]
};
