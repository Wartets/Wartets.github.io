export default {
	id: 'anecdote_kalman_filter_apollo',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Ingénierie Aérospatiale - Algorithmique', en: 'Aerospace Engineering - Algorithms' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Lors de la mission Apollo 11 en 1969, l'ordinateur de bord devait calculer la position exacte du module lunaire, alors que le radar et les capteurs renvoyaient des données parasitées et contradictoires. Pour éviter un crash, le MIT implémenta un algorithme inventé en 1960 par Rudolf Kalman. Ce « filtre » ne se contente pas de moyenner les capteurs : il utilise un modèle physique pour prédire où le vaisseau devrait se trouver, compare cette prédiction aux mesures bruitées, et fusionne les deux en accordant plus de confiance à la source la plus fiable à l'instant T. Cet algorithme est aujourd'hui au cœur de tous les GPS et systèmes de pilotage automatique.`,
		en: `During the Apollo 11 mission in 1969, the onboard computer had to calculate the exact position of the lunar module, while radar and acceleration sensors returned noisy and contradictory data. To avoid a crash, MIT implemented an algorithm invented in 1960 by Rudolf Kalman. This "filter" does not simply average the sensors: it uses a physical model to predict where the craft should be, compares that prediction against noisy measurements, and fuses the two by dynamically trusting the more reliable source at each instant. This estimation algorithm is now at the heart of every GPS receiver and autopilot system.`
	},
	sources: [
		{
			name: { fr: 'A New Approach to Linear Filtering and Prediction Problems (R. E. Kalman, Journal of Basic Engineering, 1960)', en: 'A New Approach to Linear Filtering and Prediction Problems (R. E. Kalman, Journal of Basic Engineering, 1960)' },
			url: 'https://doi.org/10.1115/1.3662552'
		}
	],
	contexts: [
		{
			title: { fr: 'Modélisation dans l\'espace d\'état (phase de prédiction)', en: 'State-space modeling (prediction phase)' },
			body: {
				fr: `Le filtre de Kalman opère sur un système dynamique linéaire discret. L'état caché à l'instant $k$, noté $\\mathbf{x}_k$, est modélisé par une matrice de transition $\\mathbf{F}_k$ appliquée à l'état précédent, augmentée d'une matrice de contrôle $\\mathbf{B}_k$. La phase de prédiction s'écrit :\n\n$$\\hat{\\mathbf{x}}_{k|k-1} = \\mathbf{F}_k \\hat{\\mathbf{x}}_{k-1|k-1} + \\mathbf{B}_k \\mathbf{u}_k$$\n\nLa covariance de l'erreur de prédiction croît selon la matrice de bruit de processus $\\mathbf{Q}_k$ :\n\n$$\\mathbf{P}_{k|k-1} = \\mathbf{F}_k \\mathbf{P}_{k-1|k-1} \\mathbf{F}_k^T + \\mathbf{Q}_k$$`,
				en: `The Kalman filter operates on a discrete linear dynamical system. The hidden state at instant $k$, denoted $\\mathbf{x}_k$, is modeled by a transition matrix $\\mathbf{F}_k$ applied to the previous state, augmented by a control matrix $\\mathbf{B}_k$. The prediction phase is written:\n\n$$\\hat{\\mathbf{x}}_{k|k-1} = \\mathbf{F}_k \\hat{\\mathbf{x}}_{k-1|k-1} + \\mathbf{B}_k \\mathbf{u}_k$$\n\nThe prediction error covariance grows according to the process noise matrix $\\mathbf{Q}_k$:\n\n$$\\mathbf{P}_{k|k-1} = \\mathbf{F}_k \\mathbf{P}_{k-1|k-1} \\mathbf{F}_k^T + \\mathbf{Q}_k$$`
			},
			external: false
		},
		{
			title: { fr: 'L\'innovation et le gain de Kalman (phase de mise à jour)', en: 'Innovation and the Kalman gain (update phase)' },
			body: {
				fr: `L'observation $\\mathbf{z}_k$ est liée à l'état par la matrice d'observation $\\mathbf{H}_k$ et un bruit de mesure gaussien de covariance $\\mathbf{R}_k$. Le cœur de l'algorithme calcule le gain de Kalman $\\mathbf{K}_k$, qui pondère la confiance accordée à la mesure par rapport à la prédiction interne :\n\n$$\\mathbf{K}_k = \\mathbf{P}_{k|k-1} \\mathbf{H}_k^T \\left( \\mathbf{H}_k \\mathbf{P}_{k|k-1} \\mathbf{H}_k^T + \\mathbf{R}_k \\right)^{-1}$$\n\nL'état estimé final est mis à jour par le résidu de la mesure :\n\n$$\\hat{\\mathbf{x}}_{k|k} = \\hat{\\mathbf{x}}_{k|k-1} + \\mathbf{K}_k (\\mathbf{z}_k - \\mathbf{H}_k \\hat{\\mathbf{x}}_{k|k-1})$$`,
				en: `The observation $\\mathbf{z}_k$ is related to the state through the observation matrix $\\mathbf{H}_k$ and a Gaussian measurement noise of covariance $\\mathbf{R}_k$. The core of the algorithm computes the Kalman gain $\\mathbf{K}_k$, which weighs the trust placed in the measurement against the internal prediction:\n\n$$\\mathbf{K}_k = \\mathbf{P}_{k|k-1} \\mathbf{H}_k^T \\left( \\mathbf{H}_k \\mathbf{P}_{k|k-1} \\mathbf{H}_k^T + \\mathbf{R}_k \\right)^{-1}$$\n\nThe final estimated state is updated by the measurement residual:\n\n$$\\hat{\\mathbf{x}}_{k|k} = \\hat{\\mathbf{x}}_{k|k-1} + \\mathbf{K}_k (\\mathbf{z}_k - \\mathbf{H}_k \\hat{\\mathbf{x}}_{k|k-1})$$`
			},
			external: false
		},
		{
			title: { fr: 'Le filtre de Kalman étendu (EKF) pour la non-linéarité', en: 'The Extended Kalman Filter (EKF) for non-linearity' },
			body: {
				fr: `La mécanique orbitale d'Apollo n'est pas linéaire (la gravité varie en $1/r^2$). Le filtre original diverge rapidement sur de tels systèmes. L'ordinateur d'Apollo utilisait le filtre de Kalman étendu (EKF), qui remplace les matrices $\\mathbf{F}$ et $\\mathbf{H}$ par des fonctions non linéaires $f$ et $h$, en calculant localement leur linéarisation par développement de Taylor au premier ordre. Les matrices de transition deviennent les matrices jacobiennes :\n\n$$\\mathbf{F}_k = \\left. \\frac{\\partial f}{\\partial \\mathbf{x}} \\right|_{\\hat{\\mathbf{x}}_{k-1|k-1}, \\mathbf{u}_k}$$\n\nCe calcul en temps réel sollicitait au maximum les capacités du microprocesseur AGC de 2 MHz.`,
				en: `Apollo's orbital mechanics are not linear (gravity varies as $1/r^2$). The original filter diverges rapidly on such systems. Apollo's onboard computer used the Extended Kalman Filter (EKF), which replaces matrices $\\mathbf{F}$ and $\\mathbf{H}$ with non-linear functions $f$ and $h$, locally linearizing them through a first-order Taylor expansion. The transition matrices become the Jacobian matrices:\n\n$$\\mathbf{F}_k = \\left. \\frac{\\partial f}{\\partial \\mathbf{x}} \\right|_{\\hat{\\mathbf{x}}_{k-1|k-1}, \\mathbf{u}_k}$$\n\nThis real-time computation pushed the 2 MHz AGC microprocessor to its limits.`
			},
			external: false
		}
	]
};
