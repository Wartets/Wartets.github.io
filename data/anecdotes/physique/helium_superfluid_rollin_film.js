export default {
	id: 'anecdote_helium_superfluid_rollin_film',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Physique Quantique Macroscopique', en: 'Macroscopic Quantum Physics' },
	scheduling: { type: 'annual', dates: ['01-08'] },
	content: (lang, year) => {
		const elapsed = year - 1938;
		return lang === 'fr'
			? `En refroidissant l'hélium-4 à 2,17 kelvins (-270,98°C), il se produit une transition de phase quantique fascinante : il devient un « superfluide », publiée il y a désormais ${elapsed} ans. Le liquide perd alors totalement sa viscosité. Conséquence visuelle directe : placé dans un verre, il refuse d'y rester, formant spontanément un film atomique qui grimpe le long des parois intérieures contre la gravité, passe par-dessus le bord, et s'échappe à l'extérieur. L'hélium superfluide se comporte comme une seule et immense particule quantique.`
			: `Cooling helium-4 down to 2.17 kelvins (-270.98°C) triggers a fascinating quantum phase transition: it becomes a "superfluid", first published ${elapsed} years ago now. The liquid then loses all viscosity. A direct visual consequence: placed in a glass, it refuses to stay put, spontaneously forming an atomic film that climbs the inner walls against gravity, passes over the rim, and escapes outward. Superfluid helium behaves as a single, enormous quantum particle.`;
	},
	sources: [
		{
			name: { fr: 'Viscosity of Liquid Helium below the λ-Point (P. Kapitza, Nature, 1938)', en: 'Viscosity of Liquid Helium below the λ-Point (P. Kapitza, Nature, 1938)' },
			url: 'https://www.nature.com/articles/141074a0'
		}
	],
	contexts: [
		{
			title: { fr: 'Condensat de Bose-Einstein et viscosité nulle', en: 'Bose-Einstein condensate and zero viscosity' },
			body: {
				fr: `À la température lambda $T_\\lambda$, une fraction macroscopique des atomes d'hélium (des bosons de spin entier) s'accumule dans l'état quantique d'énergie la plus basse. Le fluide se modélise par un modèle à deux fluides (Tisza et Landau), avec une densité totale $\\rho = \\rho_{normal} + \\rho_{superfluide}$. L'équation de Navier-Stokes pour la composante superfluide perd son terme dissipatif de viscosité. Le film rampant (film de Rollin) minimise son énergie potentielle en épousant les parois : son épaisseur $d$ à une hauteur $h$ résulte de l'équilibre entre la gravité et l'attraction de Van der Waals (constante $\\alpha$) :\n\n$$d = \\left( \\frac{\\alpha}{\\rho g h} \\right)^{1/3}$$`,
				en: `At the lambda temperature $T_\\lambda$, a macroscopic fraction of helium atoms (integer-spin bosons) accumulate in the lowest-energy quantum state. The fluid is modeled with a two-fluid model (Tisza and Landau), with total density $\\rho = \\rho_{normal} + \\rho_{superfluid}$. The Navier-Stokes equation for the superfluid component loses its dissipative viscosity term. The creeping Rollin film minimizes its potential energy by hugging the walls: its thickness $d$ at height $h$ results from the balance between gravity and Van der Waals attraction (constant $\\alpha$):\n\n$$d = \\left( \\frac{\\alpha}{\\rho g h} \\right)^{1/3}$$`
			},
			external: false
		}
	]
};
