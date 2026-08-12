export default {
	id: 'anecdote_cordic_trigonometry_algorithm',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Algorithmique Numérique', en: 'Numerical Algorithms' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Lorsque vous demandez à une calculatrice de trouver le cosinus ou le sinus d'un angle, elle n'utilise pas les séries de Taylor apprises en analyse mathématique, car celles-ci nécessitent des multiplications et des divisions trop coûteuses en ressources matérielles. Les puces électroniques utilisent l'algorithme CORDIC (Coordinate Rotation Digital Computer), inventé en 1959 pour la navigation aérienne. CORDIC calcule les fonctions trigonométriques uniquement en utilisant des additions, des soustractions et des décalages de bits, en « tournant » un vecteur par approximations successives grâce à une petite table de constantes pré-enregistrées.`,
		en: `When you ask a calculator to find the cosine or sine of an angle, it does not use the Taylor series learned in mathematical analysis, since these require multiplications and divisions that are too costly in hardware resources. Electronic chips use the CORDIC algorithm (Coordinate Rotation Digital Computer), invented in 1959 for aerial navigation. CORDIC computes trigonometric functions using only additions, subtractions, and bit shifts, "rotating" a vector through successive approximations with a small table of pre-stored constants.`
	},
	sources: [
		{
			name: { fr: 'The CORDIC Trigonometric Computing Technique (J. E. Volder, IRE Transactions on Electronic Computers, 1959)', en: 'The CORDIC Trigonometric Computing Technique (J. E. Volder, IRE Transactions on Electronic Computers, 1959)' },
			url: 'https://ieeexplore.ieee.org/document/5222693'
		}
	],
	contexts: [
		{
			title: { fr: 'Formalisme matriciel des pseudo-rotations', en: 'Matrix formalism of pseudo-rotations' },
			body: {
				fr: `Une rotation d'un vecteur $(x, y)$ d'un angle $\\theta$ s'écrit classiquement avec une matrice de rotation. L'astuce de Jack Volder est de factoriser $\\cos(\\theta)$ et de décomposer l'angle cible en une somme d'angles spécifiques $\\alpha_i$ tels que $\\tan(\\alpha_i) = 2^{-i}$. La multiplication par une puissance de 2 en informatique binaire n'est qu'un simple décalage de bits ne coûtant aucun cycle d'horloge. L'itération s'écrit :\n\n$$\\begin{pmatrix} x_{i+1} \\\\ y_{i+1} \\end{pmatrix} = \\cos(\\alpha_i) \\begin{pmatrix} 1 & -d_i 2^{-i} \\\\ d_i 2^{-i} & 1 \\end{pmatrix} \\begin{pmatrix} x_i \\\\ y_i \\end{pmatrix}$$\n\noù $d_i \\in \\{-1, 1\\}$ détermine le sens de rotation. Le produit des $\\cos(\\alpha_i)$ converge vers une constante universelle $K \\approx 0,607252$, appliquée à la toute fin du processus.`,
				en: `Rotating a vector $(x, y)$ by an angle $\\theta$ is classically written with a rotation matrix. Jack Volder's trick is to factor out $\\cos(\\theta)$ and decompose the target angle into a sum of specific angles $\\alpha_i$ such that $\\tan(\\alpha_i) = 2^{-i}$. Multiplying by a power of 2 in binary computing is just a bit shift, costing no clock cycles. The iteration is written:\n\n$$\\begin{pmatrix} x_{i+1} \\\\ y_{i+1} \\end{pmatrix} = \\cos(\\alpha_i) \\begin{pmatrix} 1 & -d_i 2^{-i} \\\\ d_i 2^{-i} & 1 \\end{pmatrix} \\begin{pmatrix} x_i \\\\ y_i \\end{pmatrix}$$\n\nwhere $d_i \\in \\{-1, 1\\}$ determines the direction of rotation. The product of the $\\cos(\\alpha_i)$ converges to a universal constant $K \\approx 0.607252$, applied at the very end of the process.`
			},
			external: false
		}
	]
};
