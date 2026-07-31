export default {
	id: 'anecdote_chiral_anomaly_abj',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Théorie Quantique des Champs (QFT)', en: 'Quantum Field Theory (QFT)' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En physique classique, le théorème de Noether garantit que toute symétrie continue d'un système physique induit une loi de conservation stricte. L'anomalie chirale est le phénomène profondément quantique par lequel une telle symétrie, valable au niveau classique, se trouve irrémédiablement brisée par le processus de quantification. Découverte en 1969, indépendamment, par Stephen Adler d'une part et John Bell avec Roman Jackiw d'autre part, cette brisure de la conservation du courant axial s'est révélée essentielle : sans elle, la désintégration expérimentalement observée du pion neutre en deux photons, qui survient en dix puissance moins seize secondes, serait théoriquement impossible.`,
		en: `In classical physics, Noether's theorem guarantees that every continuous symmetry of a physical system induces a strict conservation law. The chiral anomaly is the deeply quantum phenomenon by which such a symmetry, valid at the classical level, is irremediably broken by the process of quantization. Discovered in 1969, independently, by Stephen Adler on one hand and John Bell together with Roman Jackiw on the other, this breaking of axial current conservation turned out to be essential: without it, the experimentally observed decay of the neutral pion into two photons, which occurs within ten to the minus sixteen seconds, would be theoretically impossible.`
	},
	sources: [
		{
			name: { fr: 'Axial-Vector Vertex in Spinor Electrodynamics (1969)', en: 'Axial-Vector Vertex in Spinor Electrodynamics (1969)' },
			url: 'https://journals.aps.org/pr/abstract/10.1103/PhysRev.177.2426'
		},
		{
			name: { fr: 'A PCAC puzzle: pi0 to gamma gamma in the sigma-model (1969)', en: 'A PCAC puzzle: pi0 to gamma gamma in the sigma-model (1969)' },
			url: 'https://link.springer.com/article/10.1007/BF02823296'
		}
	],
	contexts: [
		{
			title: { fr: 'Calcul du diagramme triangle et régularisation', en: 'The triangle diagram calculation and regularization' },
			body: {
				fr: `Le lagrangien de l'électrodynamique quantique pour des fermions sans masse est classiquement invariant sous la transformation chirale $\\psi \\to e^{i\\alpha\\gamma_5}\\psi$, ce qui impose par le théorème de Noether la conservation du courant axial :\n\n$$\\partial_\\mu j^\\mu_5 = 0$$\n\nLorsqu'on calcule les corrections quantiques associées à ce courant, le diagramme de Feynman dominant est un « triangle » de fermions reliant le courant axial à deux photons. Ce diagramme est ultravioletement divergent, et toute procédure de régularisation compatible avec l'invariance de jauge électromagnétique brise inévitablement l'invariance chirale.\n\nLe résultat, l'anomalie ABJ (Adler-Bell-Jackiw), couple directement le courant axial au tenseur électromagnétique :\n\n$$\\partial_\\mu j^\\mu_5 = \\frac{e^2}{16\\pi^2} \\epsilon^{\\mu\\nu\\rho\\sigma} F_{\\mu\\nu} F_{\\rho\\sigma}$$\n\nCette relation, purement quantique, fournit exactement le taux de désintégration mesuré du pion neutre, une prédiction impossible à obtenir dans le cadre strictement classique.`,
				en: `The Lagrangian of quantum electrodynamics for massless fermions is classically invariant under the chiral transformation $\\psi \\to e^{i\\alpha\\gamma_5}\\psi$, which, by Noether's theorem, implies conservation of the axial current:\n\n$$\\partial_\\mu j^\\mu_5 = 0$$\n\nWhen the quantum corrections associated with this current are computed, the dominant Feynman diagram is a fermion "triangle" connecting the axial current to two photons. This diagram is ultraviolet divergent, and any regularization procedure compatible with electromagnetic gauge invariance inevitably breaks chiral invariance.\n\nThe result, the ABJ (Adler-Bell-Jackiw) anomaly, directly couples the axial current to the electromagnetic field tensor:\n\n$$\\partial_\\mu j^\\mu_5 = \\frac{e^2}{16\\pi^2} \\epsilon^{\\mu\\nu\\rho\\sigma} F_{\\mu\\nu} F_{\\rho\\sigma}$$\n\nThis purely quantum relation yields exactly the measured decay rate of the neutral pion, a prediction that a strictly classical treatment could never produce.`
			},
			external: false
		}
	]
};
