export default {
	id: 'anecdote_bose_einstein_condensate',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Physique Quantique / Matière Condensée', en: 'Quantum Physics / Condensed Matter' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `La matière se présente habituellement sous trois états : solide, liquide et gaz. Mais en 1924, Satyendra Nath Bose et Albert Einstein prédisent théoriquement l'existence d'un nouvel état. Si l'on refroidit un gaz de certains atomes à une température extrêmement proche du zéro absolu, à peine quelques milliardièmes de degré au-dessus de -273,15°C, les atomes ralentissent au point de perdre leur individualité physique. Leurs ondes quantiques s'étalent, se chevauchent, puis fusionnent pour former une seule « super-onde » macroscopique. Le gaz entier se comporte alors physiquement comme s'il n'était plus qu'un seul et unique atome géant. Cet état n'a pu être créé en laboratoire pour la première fois qu'en 1995.`,
		en: `Matter usually occurs in three states: solid, liquid, and gas. But in 1924, Satyendra Nath Bose and Albert Einstein theoretically predicted the existence of a new state. If a gas of certain atoms is cooled to a temperature extremely close to absolute zero, mere billionths of a degree above -273.15°C, the atoms slow down to the point of losing their physical individuality. Their quantum waves spread out, overlap, and then merge into a single macroscopic "super-wave". The entire gas then physically behaves as though it were a single, giant atom. This state was first created in a laboratory only in 1995.`
	},
	sources: [
		{
			name: { fr: 'Observation of Bose-Einstein Condensation in a Dilute Atomic Vapor (M. H. Anderson et al., Science, 1995)', en: 'Observation of Bose-Einstein Condensation in a Dilute Atomic Vapor (M. H. Anderson et al., Science, 1995)' },
			url: 'https://doi.org/10.1126/science.269.5221.198'
		}
	],
	contexts: [
		{
			title: { fr: 'Longueur d\'onde thermique et occupation de l\'état fondamental', en: 'Thermal wavelength and ground-state occupation' },
			body: {
				fr: `D'après la dualité onde-corpuscule, la longueur d'onde de de Broglie thermique d'une particule massive dépend de l'agitation thermique $T$. Elle est donnée par $\\lambda_{dB} = \\frac{h}{\\sqrt{2\\pi m k_B T}}$. À température ambiante, $\\lambda_{dB}$ est négligeable par rapport à la distance interatomique $d$. Cependant, lorsque $T \\rightarrow 0$, la longueur d'onde s'étend jusqu'à vérifier $\\lambda_{dB} > d$. Les fonctions d'onde des atomes, des bosons de spin entier, se recouvrent spatialement. La statistique de distribution de Bose-Einstein montre l'effondrement des particules dans le niveau d'énergie le plus bas $E_0$ :\n\n$$\\langle n_i \\rangle = \\frac{1}{\\exp\\left(\\frac{E_i - \\mu}{k_B T}\\right) - 1}$$\n\nLorsque le potentiel chimique $\\mu \\rightarrow E_0$, l'occupation de l'état fondamental $n_0$ devient macroscopique, constituant la transition de phase du condensat.`,
				en: `According to wave-particle duality, the thermal de Broglie wavelength of a massive particle depends on the thermal agitation $T$. It is given by $\\lambda_{dB} = \\frac{h}{\\sqrt{2\\pi m k_B T}}$. At room temperature, $\\lambda_{dB}$ is negligible compared to the interatomic distance $d$. However, as $T \\rightarrow 0$, the wavelength grows until $\\lambda_{dB} > d$. The atoms' wavefunctions, integer-spin bosons, spatially overlap. The Bose-Einstein distribution statistic shows the collapse of particles into the lowest energy level $E_0$:\n\n$$\\langle n_i \\rangle = \\frac{1}{\\exp\\left(\\frac{E_i - \\mu}{k_B T}\\right) - 1}$$\n\nAs the chemical potential $\\mu \\rightarrow E_0$, the occupation of the ground state $n_0$ becomes macroscopic, constituting the condensate's phase transition.`
			},
			external: false
		}
	]
};
