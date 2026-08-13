export default {
	id: 'anecdote_oklo_natural_nuclear_reactor_fission',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-13',
	domain: { fr: 'Physique Nucléaire / Géochimie', en: 'Nuclear Physics / Geochemistry' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Il y a environ 2 milliards d'années, des gisements d'uranium naturel de la région d'Oklo, au Gabon, ont fonctionné comme des réacteurs nucléaires spontanés. Une concentration suffisante d'uranium-235, associée à l'infiltration d'eau souterraine jouant le rôle de modérateur de neutrons, a permis d'entretenir des réactions de fission en chaîne pendant plusieurs centaines de milliers d'années, découvertes en 1972 grâce à un déficit anormal de cet isotope dans le minerai.`,
		en: `About 2 billion years ago, natural uranium deposits in the Oklo region of Gabon operated as spontaneous nuclear reactors. A sufficient concentration of uranium-235, combined with infiltrating groundwater acting as a neutron moderator, sustained self-propagating fission chain reactions for several hundred thousand years, discovered in 1972 through an anomalous depletion of that isotope in the ore.`
	},
	sources: [
		{
			name: { fr: "Meet Oklo, the Earth's Only Known Natural Nuclear Reactor (AIEA)", en: "Meet Oklo, the Earth's Only Known Natural Nuclear Reactor (IAEA)" },
			url: 'https://www.iaea.org/newscenter/news/meet-oklo-the-earths-two-billion-year-old-only-known-natural-nuclear-reactor'
		}
	],
	contexts: [
		{
			title: { fr: 'Modération neutronique et criticité naturelle', en: 'Neutron moderation and natural criticality' },
			body: {
				fr: `Les neutrons émis lors de la fission de l'uranium-235 sont rapides, avec une énergie cinétique de l'ordre du MeV, alors que la section efficace de fission $\\sigma_f$ est bien plus grande pour des neutrons thermiques ($E \\approx 0{,}025$ eV), car $\\sigma_f$ varie approximativement en $1/v$. L'eau interstitielle de la roche a ralenti les neutrons par collisions élastiques successives avec les protons, portant le facteur de multiplication effectif $k_{eff}$ à une valeur proche de l'unité et entretenant la réaction. Un cycle d'ébullition, arrêtant la modération, puis de refroidissement, la relançant, a régulé le réacteur pendant des millénaires.`,
				en: `Neutrons emitted during uranium-235 fission are fast, with kinetic energies around 1 MeV, whereas the fission cross-section $\\sigma_f$ is much larger for thermal neutrons ($E \\approx 0.025$ eV), since $\\sigma_f$ scales roughly as $1/v$. Interstitial water in the rock slowed the neutrons through successive elastic collisions with protons, pushing the effective multiplication factor $k_{eff}$ close to unity and sustaining the reaction. A cycle of boiling, which halted moderation, followed by cooling, which restarted it, regulated the reactor for millennia.`
			},
			external: false
		}
	]
};
