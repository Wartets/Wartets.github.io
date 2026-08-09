export default {
	id: 'anecdote_decouverte_neptune',
	enabled: true,
	priority: 3,
	addedDate: '2026-07-30',
	domain: { fr: 'Physique - Astronomie', en: 'Physics - Astronomy' },
	scheduling: { type: 'annual', dates: ['09-23'] },
	content: (lang, year) => {
		const elapsed = year - 1846;
		return lang === 'fr'
			? `Le 23 septembre 1846, l'astronome Johann Galle observe Neptune à moins d'un degré de la position calculée par Urbain Le Verrier à partir des seules perturbations gravitationnelles observées sur l'orbite d'Uranus, il y a désormais ${elapsed} ans.`
			: `On September 23, 1846, astronomer Johann Galle observed Neptune within one degree of the position calculated by Urbain Le Verrier from the gravitational perturbations alone observed on Uranus's orbit, ${elapsed} years ago.`;
	},
	sources: [
		{
			name: { fr: 'Comptes Rendus de l\'Académie des Sciences', en: 'Comptes Rendus de l\'Académie des Sciences' },
			url: 'https://comptes-rendus.academie-sciences.fr/physique/item/10.1016/j.crhy.2017.10.011.pdf'
		}
	],
	contexts: [
		{
			title: { fr: 'La découverte au bout de la plume', en: 'A discovery at the tip of a pen' },
			body: {
				fr: `Depuis les années 1820, les astronomes constatent que l'orbite d'Uranus dévie légèrement des prédictions de la mécanique newtonienne. Urbain Le Verrier, sans jamais observer le ciel lui-même, calcule pendant des mois la position d'une hypothétique planète perturbatrice à partir de ces écarts.\n\nIl envoie ses résultats à l'observatoire de Berlin plutôt qu'à l'Observatoire de Paris, jugé trop lent. Johann Galle et son assistant Heinrich d'Arrest localisent Neptune dès la première nuit d'observation, à moins d'un degré de la position prédite.\n\nCet épisode est resté un cas d'école de la puissance prédictive de la gravitation newtonienne, avant que les anomalies de l'orbite de Mercure ne nécessitent, un siècle plus tard, la relativité générale d'Einstein pour être expliquées.`,
				en: `Since the 1820s, astronomers had noted that Uranus's orbit deviated slightly from Newtonian mechanics predictions. Urbain Le Verrier, without ever observing the sky himself, spent months calculating the position of a hypothetical perturbing planet from these deviations.\n\nHe sent his results to the Berlin observatory rather than the Paris Observatory, which he judged too slow. Johann Galle and his assistant Heinrich d'Arrest located Neptune on the very first night of observation, within one degree of the predicted position.\n\nThis episode remained a textbook case of the predictive power of Newtonian gravitation, before the anomalies in Mercury's orbit required, a century later, Einstein's general relativity to be explained.`
			},
			external: false
		}
	]
};
