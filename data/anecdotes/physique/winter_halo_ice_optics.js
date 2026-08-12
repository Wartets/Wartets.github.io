export default {
	id: 'anecdote_winter_halo_ice_optics',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Physique - Optique Atmosphérique', en: 'Physics - Atmospheric Optics' },
	scheduling: { type: 'period', dates: ['12-15', '01-15'] },
	content: {
		fr: `Le halo pâle parfois visible autour du Soleil ou de la Lune lors des froides journées d'hiver, avec un rayon apparent de presque exactement 22°, est produit par la réfraction de la lumière à travers des millions de minuscules cristaux de glace hexagonaux orientés aléatoirement, suspendus dans des nuages de haute altitude. C'est la même géométrie cristalline hexagonale à l'origine de la symétrie des flocons de neige qui agit ici comme un prisme naturel.`,
		en: `The pale ring sometimes seen around the sun or moon on cold winter days, with an apparent radius of almost exactly 22°, is produced by light refracting through millions of tiny, randomly oriented hexagonal ice crystals suspended in high-altitude clouds. It is the same hexagonal crystal geometry behind snowflake symmetry that acts here as a natural prism.`
	},
	sources: [
		{
			name: { fr: 'Met Office - Halos and Ice Crystal Optics', en: 'Met Office - Halos and Ice Crystal Optics' },
			url: 'https://www.metoffice.gov.uk'
		},
		{
			name: { fr: 'Atmospheric Optics (Les Cowley)', en: 'Atmospheric Optics (Les Cowley)' },
			url: 'https://www.atoptics.co.uk'
		}
	],
	contexts: [
		{
			title: { fr: 'Réfraction minimale à travers un prisme hexagonal', en: 'Minimum deviation through a hexagonal prism' },
			body: {
				fr: `Un cristal de glace hexagonal se comporte comme un prisme d'angle $A = 60°$ pour la lumière entrant par une face et ressortant par une face non adjacente. L'angle de déviation minimale d'un tel prisme s'écrit :\n\n$$\\delta_{min} = 2\\arcsin\\!\\left(n\\sin\\frac{A}{2}\\right) - A$$\n\nAvec un indice de réfraction de la glace $n \\approx 1{,}31$, on obtient $\\delta_{min} \\approx 22°$, expliquant précisément le rayon caractéristique du halo. La légère dispersion chromatique de l'indice avec la longueur d'onde produit également un fin liseré rougeâtre sur le bord intérieur du halo et bleuté sur le bord extérieur.`,
				en: `A hexagonal ice crystal behaves like a 60° prism for light entering one face and exiting a non-adjacent face. The minimum deviation angle of such a prism is:\n\n$$\\delta_{min} = 2\\arcsin\\!\\left(n\\sin\\frac{A}{2}\\right) - A$$\n\nWith an ice refractive index of $n \\approx 1.31$, this gives $\\delta_{min} \\approx 22°$, precisely explaining the halo's characteristic radius. The slight chromatic dispersion of the refractive index with wavelength also produces a thin reddish fringe on the halo's inner edge and a bluish fringe on the outer edge.`
			},
			external: false
		}
	]
};
