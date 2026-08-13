export default {
	id: 'anecdote_full_moon_tidal_lock',
	enabled: true,
	priority: 3,
	addedDate: '2026-08-13',
	domain: { fr: 'Mécanique Céleste', en: 'Celestial Mechanics' },
	scheduling: { type: 'formula', dates: [] },
	content: {
		fr: `Ce soir, la Lune est pleine. Un fait souvent ignoré est que la Lune nous montre toujours la même face non pas par hasard, mais parce qu'elle est verrouillée gravitationnellement (rotation synchrone) : sa période de rotation sur elle-même est rigoureusement égale à sa période de révolution autour de la Terre, un état d'équilibre atteint après des milliards d'années de dissipation d'énergie par friction des marées.`,
		en: `Tonight the Moon is full. An often overlooked fact is that the Moon always shows us the same face not by coincidence, but because it is tidally locked (synchronous rotation): its rotation period exactly matches its orbital period around Earth, an equilibrium state reached after billions of years of tidal-friction energy dissipation.`
	},
	sources: [
		{
			name: { fr: 'NASA Solar System Exploration — Moon in Depth', en: 'NASA Solar System Exploration — Moon in Depth' },
			url: 'https://science.nasa.gov/moon/facts/'
		}
	],
	contexts: [
		{
			title: { fr: 'Dissipation par friction des marées', en: 'Tidal-friction dissipation' },
			body: {
				fr: `Le couple exercé par les bourrelets de marée que la Terre induit sur la Lune a progressivement ralenti la rotation lunaire jusqu'à ce qu'elle égale sa révolution orbitale. Ce même mécanisme, appliqué en sens inverse par la Lune sur la Terre, ralentit très légèrement la rotation terrestre et éloigne la Lune d'environ 3,8 cm par an.`,
				en: `The torque exerted by the tidal bulges Earth raises on the Moon gradually slowed the Moon's rotation until it matched its orbital period. The same mechanism, applied in reverse by the Moon on Earth, very slightly slows Earth's rotation and pushes the Moon away by about 3.8 cm per year.`
			},
			external: false
		}
	]
};
