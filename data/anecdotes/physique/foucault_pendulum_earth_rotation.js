export default {
	id: 'anecdote_foucault_pendulum_earth_rotation',
	enabled: true,
	priority: 3,
	addedDate: '2026-07-31',
	domain: { fr: 'Mécanique Classique', en: 'Classical Mechanics' },
	scheduling: { type: 'annual', dates: ['03-31'] },
	content: (lang, year) => {
		const elapsed = year - 1851;
		return lang === 'fr'
			? `Comment prouver que la Terre tourne sur elle-même sans jamais regarder les étoiles ? En 1851, le physicien français Léon Foucault suspendit une lourde sphère de laiton de 28 kg au bout d'un fil de 67 mètres sous le dôme du Panthéon de Paris. Une fois lancé, le plan d'oscillation du pendule se mit à pivoter lentement, faisant tomber une à une des petites cibles de sable posées au sol, au grand émerveillement du public parisien, il y a désormais ${elapsed} ans. Ce n'était pas le pendule qui tournait sous l'effet d'une force mystérieuse, mais le sol du bâtiment (et la planète entière) qui tournait physiquement sous le pendule.`
			: `How can it be proven that the Earth rotates on its axis without ever looking at the stars? In 1851, French physicist Léon Foucault suspended a heavy 28 kg brass sphere at the end of a 67-meter wire beneath the dome of the Panthéon in Paris. Once set swinging, the pendulum's plane of oscillation began to slowly rotate, knocking down small sand targets placed on the floor one by one, to the great amazement of the Parisian public, ${elapsed} years ago now. It was not the pendulum that was turning under some mysterious force, but the building's floor (and the entire planet) that was physically turning beneath the pendulum.`;
	},
	sources: [
		{
			name: { fr: 'Démonstration physique du mouvement de rotation de la Terre au moyen du pendule (L. Foucault, Comptes rendus de l\'Académie des sciences, 1851)', en: 'Démonstration physique du mouvement de rotation de la Terre au moyen du pendule (L. Foucault, Comptes rendus de l\'Académie des sciences, 1851)' },
			url: 'https://gallica.bnf.fr/ark:/12148/bpt6k29897'
		}
	],
	contexts: [
		{
			title: { fr: 'Force de Coriolis et repères non galiléens', en: 'The Coriolis force and non-inertial reference frames' },
			body: {
				fr: `Dans le repère tournant de la Terre, la dynamique du pendule doit intégrer des forces d'inertie (force centrifuge, balancée par la gravité effective, et la force de Coriolis). L'équation fondamentale de la dynamique fait apparaître le vecteur rotation terrestre $\\vec{\\Omega}$. Le déplacement latéral est dominé par l'accélération de Coriolis : $\\vec{a}_c = -2 \\vec{\\Omega} \\times \\vec{v}$. En résolvant l'équation différentielle couplée, on démontre que la période $T$ de rotation complète du plan d'oscillation dépend exclusivement de la latitude $\\lambda$ du lieu (à Paris, $\\lambda \\approx 48,8^\\circ$) :\n\n$$T = \\frac{24 \\text{ heures}}{\\sin \\lambda} \\approx 31,8 \\text{ heures (pour Paris)}$$`,
				en: `In Earth's rotating frame, the pendulum's dynamics must include inertial forces (centrifugal force, balanced by effective gravity, and the Coriolis force). The fundamental equation of dynamics brings in Earth's rotation vector $\\vec{\\Omega}$. Lateral displacement is dominated by the Coriolis acceleration: $\\vec{a}_c = -2 \\vec{\\Omega} \\times \\vec{v}$. Solving the coupled differential equation shows that the full rotation period $T$ of the oscillation plane depends exclusively on the latitude $\\lambda$ of the location (in Paris, $\\lambda \\approx 48.8^\\circ$):\n\n$$T = \\frac{24 \\text{ hours}}{\\sin \\lambda} \\approx 31.8 \\text{ hours (for Paris)}$$`
			},
			external: false
		}
	]
};
