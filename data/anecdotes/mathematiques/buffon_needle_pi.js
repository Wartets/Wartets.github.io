export default {
	id: 'anecdote_buffon_needle_pi',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Probabilités / Géométrie Intégrale', en: 'Probability / Integral Geometry' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1733, Georges-Louis Leclerc, comte de Buffon, posa l'un des tout premiers problèmes de géométrie probabiliste : si l'on lâche aléatoirement une aiguille sur un parquet composé de lattes de bois parallèles, quelle est la probabilité qu'elle chevauche une rainure ? L'élégance stupéfiante de la solution réside dans le fait que cette probabilité fait intervenir le nombre π. Cette découverte ouvrit la voie, deux siècles plus tard, aux méthodes d'intégration stochastique par ordinateur appelées « méthodes de Monte-Carlo », massivement utilisées depuis pour simuler des interactions nucléaires ou évaluer des intégrales impossibles à résoudre analytiquement.`,
		en: `In 1733, Georges-Louis Leclerc, Comte de Buffon, posed one of the very first problems in geometric probability: if a needle is dropped at random onto a floor made of parallel wooden planks, what is the probability that it crosses a seam line? The startling elegance of the solution lies in the fact that this probability involves the number π. This discovery paved the way, two centuries later, for computer-based stochastic integration methods known as "Monte Carlo methods", now widely used to simulate nuclear interactions or evaluate integrals impossible to solve analytically.`
	},
	sources: [
		{
			name: { fr: 'Essai d\'arithmétique morale (1777)', en: 'Essai d\'arithmétique morale (1777)' },
			url: 'https://www.researchgate.net/publication/226040429_Georges-Louis_Leclerc_de_Buffon%27s_%27Essays_on_Moral_Arithmetic%27'
		}
	],
	contexts: [
		{
			title: { fr: 'Densité de probabilité et intégration géométrique', en: 'Probability density and geometric integration' },
			body: {
				fr: `Considérons une aiguille de longueur $l$ tombant sur un parquet dont les lattes sont espacées de $d$, avec $l \\le d$. Le centre de l'aiguille se situe à une distance $x$, comprise entre $0$ et $d/2$, de la ligne la plus proche, et son angle aigu par rapport aux lignes vaut $\\theta$, compris entre $0$ et $\\pi/2$.\n\nL'aiguille croise une ligne si et seulement si $x \\le \\frac{l}{2} \\sin \\theta$. En supposant l'espace des configurations $(x, \\theta)$ uniformément probable, la probabilité de croisement s'obtient par le rapport de deux intégrales doubles :\n\n$$P = \\frac{\\int_{0}^{\\pi/2} \\int_{0}^{\\frac{l}{2} \\sin \\theta} dx\\, d\\theta}{\\int_{0}^{\\pi/2} \\int_{0}^{d/2} dx\\, d\\theta} = \\frac{\\frac{l}{2} \\int_{0}^{\\pi/2} \\sin \\theta\\, d\\theta}{\\frac{\\pi d}{4}} = \\frac{2l}{\\pi d}$$\n\nEn répétant l'expérience un grand nombre de fois et en comptant la fréquence empirique des croisements, on peut ainsi estimer numériquement la valeur de π, une méthode expérimentale amusante mais authentiquement rigoureuse d'approcher cette constante.`,
				en: `Consider a needle of length $l$ falling onto a floor whose planks are spaced $d$ apart, with $l \\le d$. The needle's center lies at a distance $x$, between $0$ and $d/2$, from the nearest line, and its acute angle relative to the lines is $\\theta$, between $0$ and $\\pi/2$.\n\nThe needle crosses a line if and only if $x \\le \\frac{l}{2} \\sin \\theta$. Assuming the configuration space $(x, \\theta)$ is uniformly distributed, the crossing probability is obtained as the ratio of two double integrals:\n\n$$P = \\frac{\\int_{0}^{\\pi/2} \\int_{0}^{\\frac{l}{2} \\sin \\theta} dx\\, d\\theta}{\\int_{0}^{\\pi/2} \\int_{0}^{d/2} dx\\, d\\theta} = \\frac{\\frac{l}{2} \\int_{0}^{\\pi/2} \\sin \\theta\\, d\\theta}{\\frac{\\pi d}{4}} = \\frac{2l}{\\pi d}$$\n\nBy repeating the experiment many times and counting the empirical frequency of crossings, one can numerically estimate the value of π, an amusing yet genuinely rigorous experimental method for approximating this constant.`
			},
			external: false
		}
	]
};
