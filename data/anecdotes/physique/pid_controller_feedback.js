export default {
	id: 'anecdote_pid_controller_feedback',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Ingénierie / Automatique', en: 'Engineering / Control Theory' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Qu'il s'agisse de maintenir l'altitude stationnaire d'un drone, la température d'un four industriel, ou le régulateur de vitesse d'une voiture, l'industrie moderne repose presque universellement sur l'algorithme « PID » (Proportionnel, Intégral, Dérivé). Formalisé en 1922 par Nicolas Minorsky pour automatiser le maintien du cap des navires militaires, ce contrôleur analyse en permanence l'erreur entre la position voulue et la position réelle en évaluant simultanément trois aspects du temps. Il regarde le présent, l'erreur actuelle, accumule le passé, les erreurs résiduelles, et anticipe le futur, la vitesse à laquelle l'erreur varie. Ce triptyque assure un ajustement électronique doux, stable et sans oscillation brusque.`,
		en: `Whether it's holding a drone at a steady altitude, regulating the temperature of an industrial furnace, or controlling a car's cruise speed, modern industry relies almost universally on the "PID" (Proportional, Integral, Derivative) algorithm. Formalized in 1922 by Nicolas Minorsky to automate heading control on military ships, this controller continuously analyzes the error between the desired position and the actual position by evaluating three aspects of time simultaneously. It looks at the present, the current error, accumulates the past, the residual errors, and anticipates the future, how fast the error is changing. This triad ensures smooth, stable electronic adjustment without abrupt oscillation.`
	},
	sources: [
		{
			name: { fr: 'Directional Stability of Automatically Steered Bodies (N. Minorsky, Journal of the American Society for Naval Engineers, 1922)', en: 'Directional Stability of Automatically Steered Bodies (N. Minorsky, Journal of the American Society for Naval Engineers, 1922)' },
			url: 'https://doi.org/10.1111/j.1559-3584.1922.tb04958.x'
		}
	],
	contexts: [
		{
			title: { fr: 'Équation de transfert du correcteur PID continu', en: 'Transfer equation of the continuous PID controller' },
			body: {
				fr: `Dans une boucle d'asservissement fermée, le régulateur PID calcule la commande $u(t)$ à envoyer à l'actionneur en fonction de la fonction d'erreur $e(t) = c(t) - y(t)$, la consigne moins la mesure. Le signal de commande est la combinaison linéaire de trois termes :\n\n$$u(t) = K_p e(t) + K_i \\int_{0}^{t} e(\\tau) d\\tau + K_d \\frac{de(t)}{dt}$$\n\nL'action Proportionnelle ($K_p$) réagit instantanément à l'écart, mais laisse toujours une erreur statique résiduelle permanente. L'action Intégrale ($K_i$) annule cette erreur statique en intégrant l'historique de l'écart au fil du temps. L'action Dérivée ($K_d$) freine les variations brusques en évaluant la pente de l'erreur, apportant une stabilité d'amortissement pour éviter le dépassement du point de consigne.`,
				en: `In a closed feedback loop, the PID controller computes the command $u(t)$ to send to the actuator based on the error function $e(t) = c(t) - y(t)$, the setpoint minus the measurement. The control signal is the linear combination of three terms:\n\n$$u(t) = K_p e(t) + K_i \\int_{0}^{t} e(\\tau) d\\tau + K_d \\frac{de(t)}{dt}$$\n\nThe Proportional action ($K_p$) reacts instantly to the deviation, but always leaves a permanent residual steady-state error. The Integral action ($K_i$) cancels this steady-state error by integrating the history of the deviation over time. The Derivative action ($K_d$) dampens abrupt changes by evaluating the slope of the error, providing damping stability to prevent overshoot of the setpoint.`
			},
			external: false
		}
	]
};
