export default {
	id: 'anecdote_kepler_snowflake_conjecture',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Mathématiques - Géométrie / Cristallographie', en: 'Mathematics - Geometry / Crystallography' },
	scheduling: { type: 'period', dates: ['12-10', '01-06'] },
	content: {
		fr: `En 1611, offrant un modeste cadeau du Nouvel An à un ami désargenté, l'astronome Johannes Kepler rédigea à la place un court traité scientifique, « Strena Seu de Nive Sexangula » (De la neige hexagonale). Il y posait une question en apparence anodine : pourquoi les flocons de neige adoptent-ils toujours une symétrie à six branches ? En cherchant la réponse du côté de l'empilement optimal de sphères identiques, il énonça au passage une conjecture mathématique qui allait résister à toute démonstration rigoureuse pendant près de quatre siècles.`,
		en: `In 1611, meant to offer a modest New Year's gift to a cash-strapped friend, astronomer Johannes Kepler wrote a short scientific treatise instead, "Strena Seu de Nive Sexangula" (On the Six-Cornered Snowflake). In it, he posed a seemingly innocent question: why do snowflakes always display six-fold symmetry? While searching for the answer through the optimal packing of identical spheres, he stated in passing a mathematical conjecture that would resist any rigorous proof for nearly four centuries.`
	},
	sources: [
		{
			name: { fr: 'T. C. Hales, A proof of the Kepler conjecture (Annals of Mathematics, 2005)', en: 'T. C. Hales, A proof of the Kepler conjecture (Annals of Mathematics, 2005)' },
			url: 'https://doi.org/10.4007/annals.2005.162.1065'
		}
	],
	contexts: [
		{
			title: { fr: 'Pourquoi les flocons ont six branches', en: 'Why snowflakes have six branches' },
			body: {
				fr: `La molécule d'eau forme, en phase glace (glace Ih), un réseau cristallin hexagonal imposé par la géométrie de ses liaisons hydrogène et par l'angle H-O-H d'environ 104,5°. Cette structure hexagonale de base impose sa symétrie à toute croissance cristalline ultérieure : chaque nouvelle molécule s'ajoute préférentiellement selon les six directions du réseau. La forme précise des branches (aiguilles, plaquettes, dendrites) dépend ensuite très finement de la température et de l'humidité relative rencontrées durant la chute du flocon, ce que résume le diagramme de morphologie de Nakaya (1954).`,
				en: `In its solid form (ice Ih), the water molecule forms a hexagonal crystal lattice imposed by the geometry of its hydrogen bonds and by the roughly 104.5° H-O-H angle. This underlying hexagonal structure dictates the symmetry of all subsequent crystal growth: each new molecule preferentially attaches along the six lattice directions. The precise shape of the branches (needles, plates, dendrites) then depends very sensitively on the temperature and relative humidity encountered as the snowflake falls, as summarized by Nakaya's morphology diagram (1954).`
			},
			external: false
		},
		{
			title: { fr: 'L\'empilement optimal de sphères, résolu par ordinateur', en: 'Optimal sphere packing, solved by computer' },
			body: {
				fr: `La conjecture de Kepler affirme que l'empilement cubique à faces centrées (identique à l'empilement hexagonal compact) est le plus dense possible pour des sphères identiques, avec une fraction de volume occupée :\n\n$$\\rho = \\frac{\\pi}{3\\sqrt{2}} \\approx 0{,}74048$$\n\nDémontrée en 1998 par Thomas Hales via une méthode d'optimisation exhaustive de configurations locales assistée par ordinateur, la preuve fut jugée « à 99 % certaine » par les relecteurs de la revue *Annals of Mathematics* en 2005, faute de pouvoir vérifier intégralement le code source à la main. Une preuve formelle complète, vérifiée automatiquement par les assistants de preuve Isabelle/HOL et HOL Light dans le cadre du projet Flyspeck, ne fut achevée qu'en 2014.`,
				en: `The Kepler conjecture states that the face-centered cubic packing (identical to hexagonal close packing) is the densest possible arrangement of identical spheres, with a volume fraction:\n\n$$\\rho = \\frac{\\pi}{3\\sqrt{2}} \\approx 0.74048$$\n\nProved in 1998 by Thomas Hales through an exhaustive computer-assisted optimization of local configurations, the proof was judged "99% certain" by the referees of the *Annals of Mathematics* in 2005, since the source code could not be fully checked by hand. A complete formal proof, automatically verified by the Isabelle/HOL and HOL Light proof assistants as part of the Flyspeck project, was only completed in 2014.`
			},
			external: false
		}
	]
};
