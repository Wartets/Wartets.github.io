export default {
	id: 'anecdote_magnus_effect_fluid',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Mécanique des Fluides', en: 'Fluid Mechanics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Lorsqu'un joueur de football ou de tennis frappe une balle en lui appliquant un effet brossé, une rotation rapide sur elle-même, la balle adopte une trajectoire asymétrique spectaculaire, plongeant ou s'incurvant latéralement dans l'air. Ce phénomène est dû à l'Effet Magnus. La rotation de la balle entraîne une fine couche d'air avec elle par friction visqueuse. D'un côté de la balle, ce mouvement s'additionne au vent de la course, accélérant l'air ; de l'autre côté, il s'y oppose, le ralentissant. Cette différence de vitesse crée, selon le principe physique de Bernoulli, une différence de pression atmosphérique qui « aspire » littéralement le projectile de son côté le plus rapide.`,
		en: `When a football or tennis player strikes a ball with topspin or sidespin, a rapid rotation about its own axis, the ball adopts a spectacular asymmetric trajectory, dipping or curving sideways through the air. This phenomenon is due to the Magnus Effect. The ball's rotation drags a thin layer of air along with it through viscous friction. On one side of the ball, this motion adds to the oncoming airflow, accelerating the air; on the other side, it opposes it, slowing it down. This speed difference creates, according to Bernoulli's principle, a difference in atmospheric pressure that literally "sucks" the projectile toward its faster side.`
	},
	sources: [
		{
			name: { fr: 'Über die Abweichung der Geschosse (H. G. Magnus, Annalen der Physik und Chemie, 1853)', en: 'Über die Abweichung der Geschosse (H. G. Magnus, Annalen der Physik und Chemie, 1853)' },
			url: 'https://doi.org/10.1002/andp.18531640102'
		}
	],
	contexts: [
		{
			title: { fr: 'Le Théorème de Kutta-Joukowski et la Portance', en: 'The Kutta-Joukowski theorem and lift' },
			body: {
				fr: `Dans le cadre de l'aérodynamique des écoulements potentiels, fluides parfaits incompressibles irrotationnels, l'effet Magnus peut être rigoureusement calculé par la superposition d'un écoulement uniforme de vitesse libre $U$ et d'un vortex de circulation $\\Gamma$. La rotation du cylindre ou de la sphère modifie le champ de lignes de courant, déplaçant les points d'arrêt. La force aérodynamique de portance perpendiculaire à l'axe de progression et à l'axe de rotation est quantifiée par le théorème de Kutta-Joukowski. Pour un cylindre de longueur $L$ :\n\n$$\\mathbf{F} = \\rho L (\\mathbf{V} \\times \\mathbf{\\Gamma}) \\quad \\implies \\quad F_L = \\rho U \\Gamma L$$\n\noù $\\rho$ est la densité du fluide, et la circulation $\\Gamma = \\oint \\mathbf{v} \\cdot d\\mathbf{l}$ quantifie l'intensité du tourbillon imposé par la condition d'adhérence visqueuse du fluide à la surface en rotation.`,
				en: `In the framework of potential-flow aerodynamics, irrotational incompressible ideal fluids, the Magnus effect can be rigorously computed by superposing a uniform free-stream flow of speed $U$ and a vortex of circulation $\\Gamma$. The rotation of the cylinder or sphere alters the streamline field, shifting the stagnation points. The aerodynamic lift force, perpendicular to both the direction of travel and the axis of rotation, is quantified by the Kutta-Joukowski theorem. For a cylinder of length $L$:\n\n$$\\mathbf{F} = \\rho L (\\mathbf{V} \\times \\mathbf{\\Gamma}) \\quad \\implies \\quad F_L = \\rho U \\Gamma L$$\n\nwhere $\\rho$ is the fluid density, and the circulation $\\Gamma = \\oint \\mathbf{v} \\cdot d\\mathbf{l}$ quantifies the strength of the vortex imposed by the fluid's viscous no-slip condition at the rotating surface.`
			},
			external: false
		}
	]
};
