export default {
	id: 'anecdote_einstein_nobel_photoelectric',
	enabled: true,
	priority: 3,
	addedDate: '2026-07-31',
	domain: { fr: 'Histoire de la Physique Quantique', en: 'History of Quantum Physics' },
	scheduling: { type: 'annual', dates: ['11-09'] },
	content: {
		fr: `Albert Einstein est universellement célèbre pour sa théorie de la Relativité (E=mc²). Pourtant, le comité du Prix Nobel refusait catégoriquement de le récompenser pour cela, car la théorie était jugée trop théorique, mathématique et controversée (dépourvue de preuves expérimentales définitives à l'époque). Lorsqu'il reçut enfin le prix Nobel de physique de 1921, la citation officielle stipulait que c'était pour « ses services à la physique théorique, et particulièrement pour sa découverte de la loi de l'effet photoélectrique », un travail fondateur qui a indirectement donné naissance à la mécanique quantique.`,
		en: `Albert Einstein is universally famous for his theory of Relativity (E=mc²). Yet the Nobel Prize committee categorically refused to award him the prize for it, deeming the theory too theoretical, mathematical, and controversial (lacking definitive experimental proof at the time). When he finally received the 1921 Nobel Prize in Physics, the official citation stated it was "for his services to theoretical physics, and especially for his discovery of the law of the photoelectric effect", a foundational piece of work that indirectly gave birth to quantum mechanics.`
	},
	sources: [
		{
			name: { fr: 'Über einen die Erzeugung und Verwandlung des Lichtes betreffenden heuristischen Gesichtspunkt (A. Einstein, Annalen der Physik, 1905)', en: 'Über einen die Erzeugung und Verwandlung des Lichtes betreffenden heuristischen Gesichtspunkt (A. Einstein, Annalen der Physik, 1905)' },
			url: 'https://onlinelibrary.wiley.com/doi/abs/10.1002/andp.19053220607'
		}
	],
	contexts: [
		{
			title: { fr: 'Quantification de la lumière et travail d\'extraction', en: 'Quantization of light and the work function' },
			body: {
				fr: `La théorie ondulatoire de Maxwell prédisait que l'énergie des électrons arrachés à un métal dépendrait de l'intensité de la lumière incidente. L'expérience a montré que cela ne dépendait que de sa fréquence (couleur). Einstein a résolu le mystère en postulant que la lumière est constituée de quanta d'énergie discrets (les futurs photons). L'équation met en évidence l'énergie cinétique maximale $E_c$ de l'électron éjecté :\n\n$$E_c = h\\nu - \\Phi$$\n\noù $h$ est la constante de Planck, $\\nu$ la fréquence lumineuse et $\\Phi$ le travail d'extraction (l'énergie de liaison) du métal.`,
				en: `Maxwell's wave theory predicted that the energy of electrons ejected from a metal would depend on the intensity of the incident light. Experiments showed it depended only on its frequency (color). Einstein solved the mystery by postulating that light consists of discrete energy quanta (the future photons). The equation highlights the maximum kinetic energy $E_c$ of the ejected electron:\n\n$$E_c = h\\nu - \\Phi$$\n\nwhere $h$ is Planck's constant, $\\nu$ the light frequency, and $\\Phi$ the work function (binding energy) of the metal.`
			},
			external: false
		}
	]
};
