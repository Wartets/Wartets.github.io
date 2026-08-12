export default {
	id: 'anecdote_ada_lovelace_first_algorithm',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Histoire de l\'Informatique / Mathématiques', en: 'History of Computing / Mathematics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1843, la mathématicienne britannique Ada Lovelace traduit et annote un article sur le projet de la Machine Analytique de Charles Babbage. Dans sa « Note G », elle ne se contente pas de décrire la machine matérielle : elle écrit une suite d'instructions détaillant pas à pas comment utiliser la machine pour calculer une séquence complexe de nombres rationnels, les nombres de Bernoulli. Ce diagramme de flux abstrait, comportant des variables de travail et des boucles conditionnelles, est aujourd'hui reconnu comme le tout premier programme informatique publié de l'histoire, un siècle avant l'invention de l'ordinateur électronique.`,
		en: `In 1843, British mathematician Ada Lovelace translated and annotated an article on Charles Babbage's Analytical Engine project. In her "Note G", she went beyond describing the physical machine: she wrote a sequence of instructions detailing step by step how to use the machine to compute a complex sequence of rational numbers, the Bernoulli numbers. This abstract flow diagram, featuring working variables and conditional loops, is today recognized as the very first published computer program in history, a century before the invention of the electronic computer.`
	},
	sources: [
		{
			name: { fr: 'Sketch of the Analytical Engine Invented by Charles Babbage, with notes by A.A.L. (1843)', en: 'Sketch of the Analytical Engine Invented by Charles Babbage, with notes by A.A.L. (1843)' },
			url: 'https://www.fourmilab.ch/babbage/sketch.html'
		}
	],
	contexts: [
		{
			title: { fr: 'Génération itérative des Nombres de Bernoulli', en: 'Iterative generation of Bernoulli numbers' },
			body: {
				fr: `Le programme de Lovelace s'attaquait au calcul des nombres de Bernoulli $B_n$, fondamentaux en analyse, notamment pour le développement en série de Taylor de la fonction tangente. Ils peuvent être définis implicitement par l'équation génératrice :\n\n$$\\frac{x}{e^x - 1} = \\sum_{n=0}^{\\infty} B_n \\frac{x^n}{n!}$$\n\nAfin d'être calculable par la machine à cartes perforées de Babbage, Lovelace a utilisé une relation de récurrence stricte n'exigeant que de l'arithmétique élémentaire, dérivée de $\\sum_{k=0}^{n} \\binom{n+1}{k} B_k = 0$. Elle a explicitement documenté l'état des « moulins », les registres actuels, et du « magasin », la mémoire, à chaque étape de la boucle.`,
				en: `Lovelace's program tackled the computation of the Bernoulli numbers $B_n$, fundamental in analysis, notably for the Taylor series expansion of the tangent function. They can be defined implicitly by the generating equation:\n\n$$\\frac{x}{e^x - 1} = \\sum_{n=0}^{\\infty} B_n \\frac{x^n}{n!}$$\n\nTo be computable on Babbage's punched-card machine, Lovelace used a strict recurrence relation requiring only elementary arithmetic, derived from $\\sum_{k=0}^{n} \\binom{n+1}{k} B_k = 0$. She explicitly documented the state of the "mill", today's registers, and the "store", memory, at each step of the loop.`
			},
			external: false
		}
	]
};