export default {
	id: 'anecdote_runge_kutta_numerical_integration',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Analyse Numérique - Simulation', en: 'Numerical Analysis - Simulation' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Pour simuler la trajectoire d'une navette spatiale subissant la variation constante de l'atmosphère, de sa masse et de la gravité, il est impossible de résoudre les équations analytiquement. Au début du XXe siècle, Carl Runge et Martin Kutta ont inventé une méthode numérique permettant aux machines de prédire l'avenir pas à pas. Plutôt que de tracer une ligne droite naïve depuis l'état présent, la méthode RK4 évalue quatre états intermédiaires à chaque petit intervalle pour capturer la courbure microscopique de l'équation, générant une trajectoire d'une précision remarquable.`,
		en: `To simulate the trajectory of a spacecraft subject to constantly changing atmosphere, mass, and gravity, the equations cannot be solved analytically. In the early 20th century, Carl Runge and Martin Kutta invented a numerical method allowing machines to predict the future step by step. Rather than drawing a naive straight line from the current state, the RK4 method evaluates four intermediate states within each small interval to capture the equation's microscopic curvature, producing a numerical trajectory of remarkable precision.`
	},
	sources: [
		{
			name: {
				fr: 'J. C. Butcher, « A history of Runge-Kutta methods », Applied Numerical Mathematics (1996)',
				en: 'J. C. Butcher, "A history of Runge-Kutta methods", Applied Numerical Mathematics (1996)'
			},
			url: 'https://doi.org/10.1016/0168-9274(95)00108-5'
		}
	],
	contexts: [
		{
			title: { fr: 'Intégration d\'équations différentielles et erreur de troncature', en: 'Integrating ordinary differential equations and truncation error' },
			body: {
				fr: `Une équation différentielle ordinaire du premier ordre s'écrit $y'(t) = f(t, y)$ avec la condition initiale $y(t_0) = y_0$. La méthode d'Euler basique, $y_{n+1} = y_n + h f(t_n, y_n)$, génère une erreur proportionnelle au pas de temps $h$. La méthode RK4 échantillonne la pente du champ de vecteurs en quatre points du pas temporel pour annuler les termes de rang inférieur dans le développement de Taylor :\n\n$$y_{n+1} = y_n + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$$\n\navec $k_1 = f(t_n, y_n)$, $k_2 = f(t_n + \\frac{h}{2}, y_n + h \\frac{k_1}{2})$, $k_3 = f(t_n + \\frac{h}{2}, y_n + h \\frac{k_2}{2})$ et $k_4 = f(t_n + h, y_n + h k_3)$.\n\nLa pondération de ces coefficients confère à RK4 une erreur de troncature globale en $\\mathcal{O}(h^4)$, permettant une haute précision sans réduire excessivement le pas temporel.`,
				en: `A first-order ordinary differential equation is written $y'(t) = f(t, y)$ with initial condition $y(t_0) = y_0$. The basic Euler method, $y_{n+1} = y_n + h f(t_n, y_n)$, generates an error proportional to the time step $h$. The RK4 method samples the vector field's slope at four points within the time step to cancel lower-order terms in the Taylor expansion:\n\n$$y_{n+1} = y_n + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$$\n\nwith $k_1 = f(t_n, y_n)$, $k_2 = f(t_n + \\frac{h}{2}, y_n + h \\frac{k_1}{2})$, $k_3 = f(t_n + \\frac{h}{2}, y_n + h \\frac{k_2}{2})$, and $k_4 = f(t_n + h, y_n + h k_3)$.\n\nThe weighting of these coefficients gives RK4 a global truncation error of $\\mathcal{O}(h^4)$, allowing high precision without drastically shrinking the time step.`
			},
			external: false
		}
	]
};
