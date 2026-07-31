export default {
	id: 'anecdote_turing_reaction_diffusion',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Biophysique / Équations aux Dérivées Partielles', en: 'Biophysics / Partial Differential Equations' },
	scheduling: { type: 'annual', dates: ['08-14'] },
	content: (lang, year) => {
		const elapsed = year - 1952;
		return lang === 'fr'
			? `Juste avant son décès tragique, Alan Turing, père de l'informatique théorique, publia il y a désormais ${elapsed} ans un article fondateur en biologie mathématique. Il y résolut une question fondamentale : comment un œuf sphérique parfaitement symétrique développe-t-il une structure asymétrique, comme les rayures d'un zèbre ou les taches d'un léopard ? Il démontra que la combinaison de deux substances chimiques réagissant et diffusant à des vitesses différentes provoque une instabilité spontanée brisant la symétrie spatiale.`
			: `Just before his tragic death, Alan Turing, the father of theoretical computer science, published a foundational paper in mathematical biology ${elapsed} years ago. In it, he solved a fundamental question: how does a perfectly symmetric spherical egg develop an asymmetric structure, such as a zebra's stripes or a leopard's spots? He showed that the combination of two chemical substances reacting and diffusing at different rates causes a spontaneous instability that breaks spatial symmetry.`;
	},
	sources: [
		{
			name: { fr: 'The Chemical Basis of Morphogenesis (1952)', en: 'The Chemical Basis of Morphogenesis (1952)' },
			url: 'https://royalsocietypublishing.org/doi/10.1098/rstb.1952.0012'
		}
	],
	contexts: [
		{
			title: { fr: 'Analyse de stabilité linéaire du système de réaction-diffusion', en: 'Linear stability analysis of the reaction-diffusion system' },
			body: {
				fr: `Turing modélise la concentration de deux substances chimiques, un activateur et un inhibiteur, par le système non linéaire :\n\n$$\\frac{\\partial \\mathbf{c}}{\\partial t} = \\mathbf{f}(\\mathbf{c}) + \\mathbf{D} \\nabla^2 \\mathbf{c}$$\n\nEn partant d'un état d'équilibre homogène et en lui appliquant une perturbation spatiale de la forme $e^{\\lambda t} e^{i \\mathbf{k} \\cdot \\mathbf{r}}$, l'analyse de stabilité linéaire montre un résultat paradoxal : alors que la diffusion tend intuitivement à homogénéiser un système, une diffusion suffisamment inégale entre l'activateur et l'inhibiteur (matrice $\\mathbf{D}$) peut au contraire déstabiliser l'état homogène et faire croître certains modes de nombre d'onde $k$, générant spontanément des motifs périodiques complexes à partir d'un état initial parfaitement uniforme.`,
				en: `Turing models the concentration of two chemical substances, an activator and an inhibitor, using the nonlinear system:\n\n$$\\frac{\\partial \\mathbf{c}}{\\partial t} = \\mathbf{f}(\\mathbf{c}) + \\mathbf{D} \\nabla^2 \\mathbf{c}$$\n\nStarting from a homogeneous equilibrium state and applying a spatial perturbation of the form $e^{\\lambda t} e^{i \\mathbf{k} \\cdot \\mathbf{r}}$, linear stability analysis reveals a paradoxical result: while diffusion intuitively tends to homogenize a system, a sufficiently unequal diffusion rate between the activator and inhibitor (matrix $\\mathbf{D}$) can instead destabilize the homogeneous state and cause certain wavenumber modes $k$ to grow, spontaneously generating complex periodic patterns from a perfectly uniform starting state.`
			},
			external: false
		}
	]
};
