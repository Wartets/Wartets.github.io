export default {
	id: 'anecdote_sledding_friction_physics',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Physique - Mécanique du Frottement', en: 'Physics - Friction Mechanics' },
	scheduling: { type: 'period', dates: ['12-20', '01-10'] },
	content: {
		fr: `La vitesse d'une luge sur la neige dépend d'un coefficient de frottement cinétique très faible, typiquement entre 0,02 et 0,1, entre les patins polis et le manteau neigeux. Ce coefficient varie fortement avec la température : à proximité de 0°C, l'eau de fonte peut au contraire créer un effet de succion qui freine la luge, tandis qu'à très basse température, la neige sèche et cassante augmente le frottement direct, ce qui explique pourquoi les fartages de compétition diffèrent selon la plage de température attendue.`,
		en: `The speed of a sled on snow depends on a very low kinetic friction coefficient, typically between 0.02 and 0.1, between the polished runners and the snowpack. This coefficient varies strongly with temperature: near 0°C, meltwater can instead create a suction effect that slows the sled down, while at very low temperature, dry brittle snow increases direct friction, which is why competition waxes differ depending on the expected temperature range.`
	},
	sources: [
		{
			name: { fr: 'Sports Engineering (Springer)', en: 'Sports Engineering (Springer)' },
			url: 'https://link.springer.com/journal/12283'
		}
	],
	contexts: [
		{
			title: { fr: 'Bilan des forces sur un plan incliné enneigé', en: 'Force balance on a snowy incline' },
			body: {
				fr: `Pour une luge glissant sur une pente d'angle $\\theta$, l'accélération nette s'écrit simplement :\n\n$$a = g(\\sin\\theta - \\mu\\cos\\theta)$$\n\noù $\\mu$ est le coefficient de frottement cinétique. Ce coefficient dépend fortement du mécanisme dominant : proche du point de fusion, le film d'eau généré peut créer une force de succion capillaire qui augmente paradoxalement le frottement effectif, tandis qu'à très basse température, l'absence de lubrification liquide favorise un frottement sec plus important, expliquant pourquoi les fartages de compétition se déclinent en plusieurs formulations, du paraffine simple aux fluorocarbures, selon la plage de température visée.`,
				en: `For a sled sliding down a slope of angle $\\theta$, the net acceleration is simply:\n\n$$a = g(\\sin\\theta - \\mu\\cos\\theta)$$\n\nwhere $\\mu$ is the kinetic friction coefficient. This coefficient depends strongly on the dominant mechanism: near the melting point, the generated water film can create a capillary suction force that paradoxically increases the effective friction, while at very low temperature, the lack of liquid lubrication favors greater dry friction, which is why competition waxes come in several formulations, from simple paraffin to fluorocarbons, depending on the targeted temperature range.`
			},
			external: false
		}
	]
};
