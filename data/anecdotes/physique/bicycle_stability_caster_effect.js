export default {
	id: 'anecdote_bicycle_stability_caster_effect',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Mécanique Classique - Ingénierie', en: 'Classical Mechanics - Engineering' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Il est de croyance populaire qu'un vélo roulant sans cycliste reste debout grâce à l'effet gyroscopique de ses roues. C'est physiquement inexact : l'expérience prouve qu'un vélo muni de contre-roues annulant cet effet parvient tout de même à s'auto-équilibrer. Le secret mécanique principal est « la chasse » (effet caster) : l'axe de rotation de la direction croise le sol devant le point de contact de la roue avant. Si le vélo penche, la géométrie du cadre force automatiquement le guidon à braquer dans la direction de la chute, créant une force centrifuge qui ramène le vélo à la verticale.`,
		en: `It is popularly believed that a riderless bicycle stays upright thanks to the gyroscopic effect of its spinning wheels. This is physically inaccurate: experiments show that a bicycle fitted with counter-rotating wheels that cancel this effect still manages to self-stabilize. The main mechanical secret is "trail" (the caster effect): the steering axis intersects the ground ahead of the front wheel's contact point. If the bicycle leans, the frame's geometry automatically forces the handlebars to steer in the direction of the fall, generating a centrifugal force that brings the bicycle back upright.`
	},
	sources: [
		{
			name: { fr: 'A bicycle can be self-stable without gyroscopic or caster effects (J. D. G. Kooijman et al., Science, 2011)', en: 'A bicycle can be self-stable without gyroscopic or caster effects (J. D. G. Kooijman et al., Science, 2011)' },
			url: 'https://doi.org/10.1126/science.1201959'
		}
	],
	contexts: [
		{
			title: { fr: 'La précession gyroscopique', en: 'Gyroscopic precession' },
			body: {
				fr: `Lorsqu'un solide en rotation rapide possède un moment cinétique $\\mathbf{L} = I \\boldsymbol{\\omega}$ le long de son axe, un basculement d'angle $\\phi$ (roulis) provoque un couple gravitationnel $\\boldsymbol{\\tau} = \\mathbf{r} \\times \\mathbf{F}_g$ orthogonal à $\\mathbf{L}$. Par le principe fondamental de la dynamique en rotation, $\\boldsymbol{\\tau} = \\frac{d\\mathbf{L}}{dt}$, ce couple entraîne une rotation directionnelle de l'axe :\n\n$$\\boldsymbol{\\Omega}_{precession} = \\frac{\\boldsymbol{\\tau}}{I \\omega}$$\n\nCette précession induit bien un braquage du guidon, mais son amplitude est minoritaire face aux forces de contact sur la route.`,
				en: `When a rapidly rotating body has angular momentum $\\mathbf{L} = I \\boldsymbol{\\omega}$ along its axis, tilting by an angle $\\phi$ (roll) produces a gravitational torque $\\boldsymbol{\\tau} = \\mathbf{r} \\times \\mathbf{F}_g$ orthogonal to $\\mathbf{L}$. By the fundamental principle of rotational dynamics, $\\boldsymbol{\\tau} = \\frac{d\\mathbf{L}}{dt}$, this torque causes the axis to precess directionally:\n\n$$\\boldsymbol{\\Omega}_{precession} = \\frac{\\boldsymbol{\\tau}}{I \\omega}$$\n\nThis precession does induce some handlebar steering, but its magnitude is minor compared to the contact forces on the road.`
			},
			external: false
		},
		{
			title: { fr: 'La géométrie de chasse (trail) et le modèle de Whipple', en: 'Trail geometry and the Whipple model' },
			body: {
				fr: `Le paramètre critique est le déport de chasse $c$, la distance au sol entre le point projeté de l'axe de direction et le point de contact du pneu, identique à celle des petites roues de caddie. Si le vélo s'incline, la réaction normale du sol pousse le pneu hors de l'axe. La stabilité auto-corrective est démontrée par les valeurs propres de la matrice jacobienne du modèle linéarisé de Whipple. Le couple de rappel géométrique de l'angle de direction $\\delta$ lié à l'angle de roulis $\\phi$ est approximé par $M_\\delta \\propto c \\cdot m g \\cdot \\sin(\\phi)$.`,
				en: `The critical parameter is the trail offset $c$, the ground distance between the projected steering axis point and the tire's contact point, identical in principle to the small caster wheels of a shopping cart. As the bicycle leans, the ground's normal reaction pushes the tire off-axis. Self-correcting stability is demonstrated by the eigenvalues of the Jacobian matrix of the linearized Whipple model. The geometric restoring torque of the steering angle $\\delta$ linked to the roll angle $\\phi$ is approximated by $M_\\delta \\propto c \\cdot m g \\cdot \\sin(\\phi)$.`
			},
			external: false
		}
	]
};
