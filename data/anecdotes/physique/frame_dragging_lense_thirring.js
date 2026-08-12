export default {
	id: 'anecdote_frame_dragging_lense_thirring',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Relativité Générale - Astrophysique', en: 'General Relativity - Astrophysics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1915, Einstein montre que la Terre incurve la géométrie de l'espace-temps par son seul poids statique. Mais en 1918, Josef Lense et Hans Thirring réalisent que les équations de la relativité impliquent un phénomène plus étrange encore pour un objet en rotation. En pivotant, la Terre ne se contente pas de creuser l'espace, elle l'entraîne visqueusement autour d'elle, comme une cuillère tournant dans du miel. Cet « entraînement des référentiels » est si infime qu'il a fallu attendre 2011 et les gyroscopes en orbite du satellite Gravity Probe B pour valider expérimentalement son existence.`,
		en: `In 1915, Einstein showed that the Earth curves the geometry of spacetime simply through its static weight. But in 1918, Josef Lense and Hans Thirring realized that the equations of relativity imply an even stranger phenomenon for a rotating object. As it spins, the Earth does not merely dent space, it viscously drags it along with itself, much like a spoon stirring honey. This "frame dragging" is so minute that it took until 2011, with the orbiting gyroscopes of the Gravity Probe B satellite, to experimentally validate its existence.`
	},
	sources: [
		{
			name: { fr: 'Gravity Probe B: Final Results of a Space Experiment to Test General Relativity (C. W. F. Everitt et al., Physical Review Letters, 2011)', en: 'Gravity Probe B: Final Results of a Space Experiment to Test General Relativity (C. W. F. Everitt et al., Physical Review Letters, 2011)' },
			url: 'https://doi.org/10.1103/PhysRevLett.106.221101'
		}
	],
	contexts: [
		{
			title: { fr: 'Tenseur métrique de Kerr et précession angulaire', en: 'Kerr metric tensor and angular precession' },
			body: {
				fr: `Ce phénomène gravitomagnétique n'apparaît pas dans la métrique de Schwarzschild, valable pour un corps statique, mais dans la métrique de Kerr décrivant l'espace-temps autour d'une masse en rotation. L'effet provient d'un terme croisé non diagonal $dt\\,d\\phi$ dans le tenseur métrique $g_{\\mu\\nu}$ : l'espace-temps lui-même acquiert une vitesse angulaire.\n\nUn gyroscope idéal en orbite subit une précession induite par le moment cinétique planétaire $J$, de fréquence :\n\n$$\\boldsymbol{\\Omega}_{LT} = \\frac{G}{c^2 r^3} \\left[ \\frac{3 (\\mathbf{J} \\cdot \\mathbf{r}) \\mathbf{r}}{r^2} - \\mathbf{J} \\right]$$\n\nPour la Terre, cet effet induit un décalage du gyroscope d'environ 39 millièmes de seconde d'arc par an.`,
				en: `This gravitomagnetic phenomenon does not appear in the Schwarzschild metric, valid for a static body, but in the Kerr metric describing spacetime around a rotating mass. The effect arises from a non-diagonal cross term $dt\\,d\\phi$ in the metric tensor $g_{\\mu\\nu}$: spacetime itself acquires an angular velocity.\n\nAn ideal orbiting gyroscope undergoes a precession induced by the planetary angular momentum $J$, with frequency:\n\n$$\\boldsymbol{\\Omega}_{LT} = \\frac{G}{c^2 r^3} \\left[ \\frac{3 (\\mathbf{J} \\cdot \\mathbf{r}) \\mathbf{r}}{r^2} - \\mathbf{J} \\right]$$\n\nFor Earth, this effect shifts the gyroscope by roughly 39 milliarcseconds per year.`
			},
			external: false
		}
	]
};
