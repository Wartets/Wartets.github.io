export default {
	id: 'anecdote_pascaline_sautoir_mechanism',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Histoire de l\'Informatique / Mécanique', en: 'History of Computing / Mechanics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1642, Blaise Pascal, alors âgé de 19 ans, conçoit la première machine à calculer mécanique fonctionnelle pour aider son père, surintendant des impôts. Le véritable défi de cette « Pascaline » n'était pas l'addition des unités, mais la transmission de la retenue entre les roues dentées, sans que les frictions ne bloquent la machine. Pascal invente alors le « sautoir », une pièce mécanique indépendante qui accumule l'énergie gravitationnelle en s'élevant lentement lors du passage de 0 à 9 d'une roue, puis retombe brusquement par son propre poids pour faire avancer la roue suivante d'un cran. Cette séparation de l'effort physique a permis à la Pascaline d'opérer sur plusieurs dizaines de chiffres sans bloquer.`,
		en: `In 1642, Blaise Pascal, then only 19 years old, designed the first functional mechanical calculating machine to help his father, a tax supervisor. The real challenge of this "Pascaline" was not adding units, but transmitting the carry between the toothed wheels without friction jamming the machine. Pascal therefore invented the "sautoir" (jumper), an independent mechanical part that accumulates gravitational energy by slowly rising as a wheel passes from 0 to 9, then suddenly falls under its own weight to advance the next wheel by one notch. This decoupling of physical effort allowed the Pascaline to operate over dozens of digits without jamming.`
	},
	sources: [
		{
			name: { fr: 'Œuvres de Blaise Pascal : Lettre dédicatoire sur le sujet de la machine nouvellement inventée', en: 'Works of Blaise Pascal: Dedicatory letter on the newly invented machine' },
			url: 'https://fr.wikisource.org/wiki/%C5%92uvres_de_Blaise_Pascal/Lettre_D%C3%A9dicatoire_de_la_Machine_Arithm%C3%A9tique_et_Avis_n%C3%A9cessaire/Lettre'
		}
	],
	contexts: [
		{
			title: { fr: 'Le problème de la propagation de la retenue', en: 'The carry propagation problem' },
			body: {
				fr: `Dans un système de numération de base 10, l'addition de deux nombres nécessite de gérer la retenue $c_i$ à chaque position $i$. Mathématiquement, l'addition de $a_i$ et $b_i$ donne une somme $s_i$ et une retenue définie par :\n\n$$c_{i+1} = \\left\\lfloor \\frac{a_i + b_i + c_i}{10} \\right\\rfloor \\quad \\text{et} \\quad s_i = (a_i + b_i + c_i) \\bmod 10$$\n\nDans les calculateurs mécaniques rudimentaires, si 9999 devenait 10000, la première roue devait physiquement fournir l'énergie cinétique pour faire tourner toutes les autres roues simultanément. Le sautoir de Pascal a résolu ce problème de couple résistant exponentiel en utilisant l'énergie potentielle accumulée localement par chaque chiffre de manière découplée.`,
				en: `In a base-10 numeral system, adding two numbers requires handling the carry $c_i$ at each position $i$. Mathematically, adding $a_i$ and $b_i$ gives a sum $s_i$ and a carry defined by:\n\n$$c_{i+1} = \\left\\lfloor \\frac{a_i + b_i + c_i}{10} \\right\\rfloor \\quad \\text{and} \\quad s_i = (a_i + b_i + c_i) \\bmod 10$$\n\nIn rudimentary mechanical calculators, if 9999 became 10000, the first wheel had to physically supply the kinetic energy to turn every other wheel simultaneously. Pascal's sautoir solved this exponential resistive-torque problem by using potential energy accumulated locally and independently by each digit.`
			},
			external: false
		}
	]
};
