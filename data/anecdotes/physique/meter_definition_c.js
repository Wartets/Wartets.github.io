export default {
	id: 'anecdote_meter_definition_c',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Métrologie / Physique Fondamentale', en: 'Metrology / Fundamental Physics' },
	scheduling: { type: 'annual', dates: ['10-21'] },
	content: (lang, year) => {
		const elapsed = year - 1983;
		return lang === 'fr'
			? `Historiquement, un mètre était défini par un prototype en platine iridié précieusement gardé à Paris. Mais les objets physiques s'altèrent avec le temps. Depuis l'adoption de la nouvelle définition il y a désormais ${elapsed} ans, le mètre n'est plus une grandeur mesurée : il est défini mathématiquement par la vitesse de la lumière, fixée arbitrairement de façon exacte et sans incertitude. Un mètre est donc officiellement la distance parcourue par la lumière dans le vide en exactement 1/299 792 458 de seconde.`
			: `Historically, the metre was defined by a platinum-iridium prototype carefully kept in Paris. But physical objects change over time. Since the adoption of the new definition ${elapsed} years ago now, the metre is no longer a measured quantity: it is defined mathematically by the speed of light, fixed arbitrarily as an exact value with no uncertainty. A metre is therefore officially the distance traveled by light in a vacuum in exactly 1/299,792,458 of a second.`;
	},
	sources: [
		{
			name: { fr: 'Resolution 1 of the 17th CGPM (Bureau International des Poids et Mesures, 1983)', en: 'Resolution 1 of the 17th CGPM (Bureau International des Poids et Mesures, 1983)' },
			url: 'https://www.bipm.org/en/committees/cg/cgpm/17-1983/resolution-1'
		}
	],
	contexts: [
		{
			title: { fr: 'Fixation des constantes fondamentales', en: 'Fixing the fundamental constants' },
			body: {
				fr: `Le Système International (SI) a renversé la logique de la mesure. Au lieu de mesurer la vitesse de la lumière $c$ avec une règle de 1 mètre imprécise, $c$ est définie comme une constante exacte :\n\n$$c \\equiv 299\\,792\\,458\\ \\text{m/s}$$\n\nCette refonte a culminé en 2019, lorsque la constante de Planck $h$, la charge élémentaire $e$ et la constante de Boltzmann $k_B$ ont également été fixées avec des valeurs exactes, rendant toutes les unités terrestres indépendantes de tout artefact matériel.`,
				en: `The International System of Units (SI) reversed the logic of measurement. Instead of measuring the speed of light $c$ with an imprecise 1-meter ruler, $c$ is defined as an exact constant:\n\n$$c \\equiv 299,792,458\\ \\text{m/s}$$\n\nThis overhaul culminated in 2019, when Planck's constant $h$, the elementary charge $e$, and Boltzmann's constant $k_B$ were also fixed at exact values, making every terrestrial unit independent of any physical artifact.`
			},
			external: false
		}
	]
};
