export default {
	id: 'anecdote_santa_claus_speed_physics',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Physique - Estimation par Ordre de Grandeur', en: 'Physics - Order-of-Magnitude Estimation' },
	scheduling: { type: 'period', dates: ['12-20', '12-25'] },
	content: {
		fr: `Combien de temps le Père Noël dispose-t-il, physiquement, pour livrer tous ses cadeaux dans la nuit du 24 au 25 décembre ? Grâce au décalage des fuseaux horaires, la nuit se déplace d'est en ouest et lui offre en réalité une fenêtre approximative de 31 heures plutôt qu'une seule. Ce genre de calcul rapide, mêlant démographie, géographie et cinématique élémentaire, est un exercice classique de vulgarisation appelé « problème de Fermi » : estimer un ordre de grandeur physique absurde à partir d'hypothèses grossières mais raisonnables.`,
		en: `How much time does Santa Claus physically have to deliver every gift during the night of December 24-25? Thanks to the offset of time zones, the night sweeps from east to west, giving him an effective window of roughly 31 hours rather than a single one. This kind of quick calculation, mixing demographics, geography, and elementary kinematics, is a classic popular-science exercise known as a "Fermi problem": estimating an absurd physical order of magnitude from rough but reasonable assumptions.`
	},
	sources: [
		{
			name: { fr: 'American Association of Physics Teachers - The Physics Teacher', en: 'American Association of Physics Teachers - The Physics Teacher' },
			url: 'https://aapt.scitation.org/journal/pte'
		}
	],
	contexts: [
		{
			title: { fr: 'Le problème de Fermi et la vitesse requise', en: 'The Fermi problem and the required speed' },
			body: {
				fr: `La méthode d'Enrico Fermi consiste à décomposer une question impossible à trancher précisément en une série de sous-quantités faciles à estimer grossièrement. Ici : nombre de foyers à visiter (de l'ordre du milliard), distance moyenne entre deux arrêts, temps disponible via le décalage horaire. La vitesse moyenne nécessaire se déduit alors simplement de :\n\n$$v = \\frac{d}{t}$$\n\nLe résultat obtenu, de plusieurs centaines de fois la vitesse de libération terrestre (11,2 km/s), illustre avant tout la puissance pédagogique du raisonnement dimensionnel : il permet d'évaluer en quelques lignes la plausibilité physique d'un scénario, sans jamais prétendre à une précision réelle.`,
				en: `Enrico Fermi's method consists in breaking down a question that cannot be answered precisely into a series of sub-quantities that are easy to estimate roughly. Here: the number of households to visit (on the order of a billion), the average distance between two stops, and the time available thanks to the time-zone offset. The required average speed then follows simply from:\n\n$$v = \\frac{d}{t}$$\n\nThe resulting figure, several hundred times Earth's escape velocity (11.2 km/s), mainly illustrates the pedagogical power of dimensional reasoning: it lets one assess, in a few lines, the physical plausibility of a scenario without ever claiming real precision.`
			},
			external: false
		}
	]
};
