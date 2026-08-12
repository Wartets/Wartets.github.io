export default {
	id: 'anecdote_cavendish_earth_weighing',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Physique Expérimentale / Mécanique', en: 'Experimental Physics / Mechanics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1798, le scientifique Henry Cavendish réussit l'exploit expérimental de déterminer la masse de la Terre entière à l'aide d'un instrument de laboratoire extrêmement délicat : une balance de torsion. En suspendant un balancier équipé de deux petites sphères de plomb près de deux énormes sphères de plomb fixes, il a pu mesurer l'attraction gravitationnelle infime s'exerçant entre ces masses. Pour éviter que la simple chaleur de son corps ne crée des courants d'air faussant l'expérience, Cavendish observait les microscopiques oscillations du mécanisme à distance, à travers un trou dans le mur de sa grange, avec un télescope.`,
		en: `In 1798, scientist Henry Cavendish achieved the experimental feat of determining the mass of the entire Earth using an extremely delicate laboratory instrument: a torsion balance. By suspending a beam fitted with two small lead spheres near two enormous fixed lead spheres, he was able to measure the tiny gravitational attraction acting between these masses. To prevent the mere heat of his own body from creating air currents that would distort the experiment, Cavendish observed the microscopic oscillations of the mechanism from a distance, through a hole in the wall of his barn, using a telescope.`
	},
	sources: [
		{
			name: { fr: 'Experiments to Determine the Density of the Earth (H. Cavendish, Philosophical Transactions of the Royal Society, 1798)', en: 'Experiments to Determine the Density of the Earth (H. Cavendish, Philosophical Transactions of the Royal Society, 1798)' },
			url: 'https://doi.org/10.1098/rstl.1798.0022'
		}
	],
	contexts: [
		{
			title: { fr: 'Balance de torsion et détermination de la constante G', en: 'Torsion balance and the determination of constant G' },
			body: {
				fr: `Le dispositif de Cavendish repose sur l'équilibre entre le moment de force gravitationnelle et le couple de rappel du fil de torsion. La force d'attraction entre une petite masse $m$ et une grande masse $M$ distantes de $r$ est $F = G \\frac{mM}{r^2}$. L'attraction engendre une rotation du balancier de longueur $L$, arrêtée par la rigidité du fil, caractérisée par sa constante de torsion $\\kappa$. À l'équilibre, le couple satisfait :\n\n$$\\kappa \\theta = 2 G \\frac{mM}{r^2} \\frac{L}{2}$$\n\nEn mesurant l'angle de déviation $\\theta$ et en déduisant $\\kappa$ via la période d'oscillation naturelle du pendule, Cavendish a pu déduire, indirectement via la densité de la Terre, la constante gravitationnelle $G$, avec une erreur inférieure à 1% par rapport aux mesures modernes.`,
				en: `Cavendish's device relies on the balance between the gravitational torque and the restoring torque of the torsion wire. The attractive force between a small mass $m$ and a large mass $M$ separated by distance $r$ is $F = G \\frac{mM}{r^2}$. The attraction causes the beam of length $L$ to rotate, resisted by the wire's stiffness, characterized by its torsion constant $\\kappa$. At equilibrium, the torque satisfies:\n\n$$\\kappa \\theta = 2 G \\frac{mM}{r^2} \\frac{L}{2}$$\n\nBy measuring the deflection angle $\\theta$ and deducing $\\kappa$ from the pendulum's natural oscillation period, Cavendish was able to derive, indirectly via Earth's density, the gravitational constant $G$, with an error of less than 1% compared to modern measurements.`
			},
			external: false
		}
	]
};
