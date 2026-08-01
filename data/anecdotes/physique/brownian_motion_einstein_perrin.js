export default {
	id: 'anecdote_brownian_motion_einstein_perrin',
	enabled: true,
	priority: 3,
	addedDate: '2026-08-01',
	domain: { fr: 'Physique Statistique / Histoire', en: 'Statistical Physics / History' },
	scheduling: { type: 'annual', dates: ['05-11'] },
	content: (lang, year) => {
		const elapsed = year - 1905;
		return lang === 'fr'
			? `En 1827, le botaniste Robert Brown observait des grains de pollen tressautant de manière aléatoire dans l'eau, pensant d'abord avoir découvert une forme de « force vitale » de la nature. Il fallut attendre le 11 mai 1905, il y a désormais ${elapsed} ans, pour qu'Albert Einstein publie l'explication mathématique de ce mouvement brownien : les grains de pollen sont percutés en permanence et de façon asymétrique par les molécules d'eau, invisibles à l'œil. Ce fut l'une des toutes premières preuves empiriques de l'existence concrète des atomes et des molécules.`
			: `In 1827, botanist Robert Brown observed pollen grains jittering randomly in water, at first believing he had discovered some kind of "vital force" of nature. It took until May 11, 1905, ${elapsed} years ago now, for Albert Einstein to publish the mathematical explanation of this Brownian motion: pollen grains are constantly and asymmetrically struck by water molecules, invisible to the naked eye. It was one of the very first empirical proofs of the concrete existence of atoms and molecules.`;
	},
	sources: [
		{
			name: { fr: 'Über die von der molekularkinetischen Theorie der Wärme geforderte Bewegung von in ruhenden Flüssigkeiten suspendierten Teilchen (A. Einstein, Annalen der Physik, 1905)', en: 'Über die von der molekularkinetischen Theorie der Wärme geforderte Bewegung von in ruhenden Flüssigkeiten suspendierten Teilchen (A. Einstein, Annalen der Physik, 1905)' },
			url: 'https://onlinelibrary.wiley.com/doi/abs/10.1002/andp.19053220806'
		}
	],
	contexts: [
		{
			title: { fr: 'Marche aléatoire et coefficient de diffusion', en: 'Random walk and the diffusion coefficient' },
			body: {
				fr: `Einstein modélisa ce phénomène comme une marche aléatoire markovienne dictée par les collisions thermiques. Il prouva que la distance quadratique moyenne $\\langle x^2 \\rangle$ parcourue par le grain de pollen croît linéairement avec le temps, et non avec le carré du temps comme en cinématique classique :\n\n$$\\langle x^2 \\rangle = 2Dt \\quad \\text{avec} \\quad D = \\frac{k_B T}{6\\pi \\eta r}$$\n\n(formule de Stokes-Einstein, où $\\eta$ est la viscosité du fluide et $r$ le rayon de la particule). Jean Perrin utilisa cette équation pour calculer précisément le nombre d'Avogadro, fermant définitivement le débat sur l'existence des atomes.`,
				en: `Einstein modeled this phenomenon as a Markovian random walk driven by thermal collisions. He proved that the mean squared distance $\\langle x^2 \\rangle$ traveled by the pollen grain grows linearly with time, not with the square of time as in classical kinematics:\n\n$$\\langle x^2 \\rangle = 2Dt \\quad \\text{with} \\quad D = \\frac{k_B T}{6\\pi \\eta r}$$\n\n(the Stokes-Einstein relation, where $\\eta$ is the fluid's viscosity and $r$ the particle's radius). Jean Perrin used this equation to precisely compute Avogadro's number, finally closing the debate on the existence of atoms.`
			},
			external: false
		}
	]
};
