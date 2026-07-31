export default {
	id: 'anecdote_cherenkov_radiation',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Physique des Particules / Optique', en: 'Particle Physics / Optics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Il est bien connu que rien ne peut dépasser la vitesse de la lumière dans le vide absolu. Cependant, dans un milieu matériel comme l'eau ou le verre, la lumière est fortement ralentie. Si une particule très énergétique (comme un électron émis par un réacteur nucléaire) pénètre dans l'eau à une vitesse supérieure à la vitesse de la lumière *dans ce milieu spécifique*, elle crée une onde de choc lumineuse. C'est l'équivalent électromagnétique du « bang » supersonique d'un avion, et cela se manifeste par une intense lueur bleutée : le rayonnement Tcherenkov.`,
		en: `It is well known that nothing can exceed the speed of light in a vacuum. However, inside a material medium such as water or glass, light is considerably slowed down. If a highly energetic particle (such as an electron emitted by a nuclear reactor) enters water at a speed exceeding the speed of light *in that specific medium*, it creates a luminous shock wave. This is the electromagnetic equivalent of a supersonic aircraft's sonic boom, and it manifests as an intense bluish glow: Cherenkov radiation.`
	},
	sources: [
		{
			name: { fr: 'Visible Radiation Produced by Electrons Moving in a Medium with Velocities Exceeding that of Light (P.A. Čerenkov, Physical Review, 1937)', en: 'Visible Radiation Produced by Electrons Moving in a Medium with Velocities Exceeding that of Light (P.A. Čerenkov, Physical Review, 1937)' },
			url: 'https://journals.aps.org/pr/abstract/10.1103/PhysRev.52.378'
		}
	],
	contexts: [
		{
			title: { fr: 'Indice de réfraction et cône d\'émission', en: 'Refractive index and the emission cone' },
			body: {
				fr: `La vitesse de phase de la lumière dans un milieu d'indice de réfraction $n$ est $v_p = c/n$. Si la vitesse de la particule est $v > c/n$, elle polarise asymétriquement les molécules du milieu sur son passage. Lors de la dépolarisation, l'interférence constructive des ondes électromagnétiques forme un cône d'ouverture $\\theta$. L'angle du cône de Tcherenkov est donné par la relation d'onde de choc :\n\n$$\\cos \\theta = \\frac{v_p}{v} = \\frac{c}{n v}$$\n\nC'est ce principe qui est utilisé dans l'observatoire IceCube en Antarctique pour détecter les neutrinos.`,
				en: `The phase velocity of light in a medium of refractive index $n$ is $v_p = c/n$. If the particle's velocity exceeds $v > c/n$, it asymmetrically polarizes the medium's molecules along its path. During depolarization, the constructive interference of the electromagnetic waves forms a cone of opening angle $\\theta$. The angle of the Cherenkov cone is given by the shock-wave relation:\n\n$$\\cos \\theta = \\frac{v_p}{v} = \\frac{c}{n v}$$\n\nThis is the very principle exploited at the IceCube Observatory in Antarctica to detect neutrinos.`
			},
			external: false
		}
	]
};
