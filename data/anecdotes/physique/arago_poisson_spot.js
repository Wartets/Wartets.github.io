export default {
	id: 'anecdote_arago_poisson_spot',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Optique Ondulatoire', en: 'Wave Optics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1818, Augustin Fresnel soumit à l'Académie des sciences une théorie décrivant la lumière comme une onde. Siméon Denis Poisson, fervent partisan de la théorie corpusculaire de Newton, tenta de ridiculiser ce modèle en démontrant mathématiquement qu'il prédisait une absurdité : si l'on éclaire un objet sphérique opaque, la diffraction des ondes devrait former un point extrêmement lumineux exactement au centre géométrique de son ombre. François Arago réalisa aussitôt l'expérience en laboratoire. À la stupéfaction générale, la tache lumineuse apparut, parfaitement nette. Poisson venait, bien malgré lui, de prouver la théorie qu'il cherchait à détruire.`,
		en: `In 1818, Augustin Fresnel submitted to the Académie des sciences a theory describing light as a wave. Siméon Denis Poisson, a staunch defender of Newton's corpuscular theory, tried to ridicule the model by mathematically showing that it predicted an absurdity: if an opaque spherical object is illuminated, wave diffraction should produce an intensely bright point exactly at the geometric center of its shadow. François Arago immediately carried out the experiment in the laboratory. To everyone's astonishment, the bright spot appeared, perfectly sharp. Poisson had, quite against his own intentions, just proven the very theory he sought to destroy.`
	},
	sources: [
		{
			name: { fr: 'Mémoire sur la diffraction de la lumière (1818)', en: 'Mémoire sur la diffraction de la lumière (1818)' },
			url: 'https://doi.org/10.4000/bibnum.749'
		}
	],
	contexts: [
		{
			title: { fr: 'Principe de Huygens-Fresnel et intégrale de diffraction', en: 'The Huygens-Fresnel principle and the diffraction integral' },
			body: {
				fr: `Le principe de Huygens-Fresnel postule que chaque point d'un front d'onde non obstrué se comporte comme une source secondaire d'ondelettes sphériques. Le champ complexe résultant au centre de l'ombre géométrique d'un disque opaque de rayon $R$, observé à une distance $z$, s'obtient en intégrant la contribution de toute la zone non occultée autour du disque.\n\nCette intégrale de Kirchhoff simplifiée, calculée exactement au point central de l'ombre, s'écrit :\n\n$$I = I_0 \\left| \\int_{R}^{\\infty} e^{i \\frac{k r^2}{2z}} \\frac{r}{z} dr \\right|^2 \\approx I_0$$\n\nLe résultat remarquable est que, sans tenir compte de l'atténuation d'obliquité, ce point central est théoriquement aussi lumineux que si aucun obstacle n'était présent sur le trajet de la lumière, une conséquence purement ondulatoire totalement inaccessible à la théorie corpusculaire de la lumière défendue par Poisson.`,
				en: `The Huygens-Fresnel principle postulates that every point on an unobstructed wavefront behaves as a secondary source of spherical wavelets. The resulting complex field at the center of the geometric shadow of an opaque disk of radius $R$, observed at a distance $z$, is obtained by integrating the contribution of the entire unobstructed region surrounding the disk.\n\nThis simplified Kirchhoff integral, evaluated exactly at the shadow's central point, is:\n\n$$I = I_0 \\left| \\int_{R}^{\\infty} e^{i \\frac{k r^2}{2z}} \\frac{r}{z} dr \\right|^2 \\approx I_0$$\n\nThe remarkable result is that, neglecting obliquity attenuation, this central point is theoretically just as bright as if no obstacle stood in the path of the light, a purely wave-based consequence entirely inaccessible to the corpuscular theory of light that Poisson championed.`
			},
			external: false
		}
	]
};
