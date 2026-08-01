export default {
	id: 'anecdote_rayleigh_scattering_sky',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Optique Électromagnétique', en: 'Electromagnetic Optics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Contrairement à une idée très répandue, le ciel n'est pas bleu parce qu'il reflète la couleur des océans (c'est l'inverse). La couleur du ciel est une pure conséquence mathématique de la taille des molécules de l'atmosphère (diazote et dioxygène), qui agissent comme de minuscules antennes diffusant la lumière du Soleil dans toutes les directions. Les ondes courtes (le bleu) sont diffusées de manière exponentiellement plus forte que les ondes longues (le rouge), inondant l'atmosphère d'une lueur bleutée.`,
		en: `Contrary to popular belief, the sky is not blue because it reflects the color of the oceans (it is the other way around). The color of the sky is a pure mathematical consequence of the size of atmospheric molecules (nitrogen and oxygen), which behave as tiny antennas scattering sunlight in every direction. Short wavelengths (blue) are scattered exponentially more strongly than long wavelengths (red), flooding the atmosphere with a bluish glow.`
	},
	sources: [
		{
			name: { fr: 'On the light from the sky, its polarization and colour (Lord Rayleigh, Philosophical Magazine and Journal of Science, 1871)', en: 'On the light from the sky, its polarization and colour (Lord Rayleigh, Philosophical Magazine and Journal of Science, 1871)' },
			url: 'https://www.tandfonline.com/doi/abs/10.1080/14786447108640454'
		}
	],
	contexts: [
		{
			title: { fr: 'Section efficace de Rayleigh', en: 'The Rayleigh scattering cross-section' },
			body: {
				fr: `Le modèle de Lord Rayleigh (1871) s'applique lorsque la taille des particules diffusantes (environ 0,3 nm) est très inférieure à la longueur d'onde de la lumière visible (400 à 700 nm). Sous l'action du champ électrique oscillant de la lumière incidente, la molécule se comporte comme un dipôle oscillant dont la puissance rayonnée s'obtient via les équations de Maxwell.\n\nL'intensité diffusée $I$ dépend inversement de la puissance quatrième de la longueur d'onde $\\lambda$ :\n\n$$I \\propto \\frac{1}{\\lambda^4}$$\n\nLe violet (380 nm) est en réalité encore plus diffusé que le bleu (450 nm), mais l'œil humain est biologiquement beaucoup moins sensible au violet : notre perception nous offre donc un ciel bleu.`,
				en: `Lord Rayleigh's model (1871) applies when the size of the scattering particles (about 0.3 nm) is much smaller than the wavelength of visible light (400 to 700 nm). Under the oscillating electric field of incident light, the molecule behaves as an oscillating dipole whose radiated power follows from Maxwell's equations.\n\nThe scattered intensity $I$ depends inversely on the fourth power of the wavelength $\\lambda$:\n\n$$I \\propto \\frac{1}{\\lambda^4}$$\n\nViolet light (380 nm) is actually scattered even more strongly than blue (450 nm), but the human eye is biologically far less sensitive to violet: our perception therefore delivers a blue sky.`
			},
			external: false
		}
	]
};
