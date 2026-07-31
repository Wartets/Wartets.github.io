export default {
	id: 'anecdote_hong_ou_mandel_interference',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Optique Quantique', en: 'Quantum Optics' },
	scheduling: { type: 'annual', dates: ['08-31'] },
	content: (lang, year) => {
		const elapsed = year - 1987;
		return lang === 'fr'
			? `En physique classique, deux faisceaux lumineux traversant une lame séparatrice semi-réfléchissante émergent de façon aléatoire et indépendante de chaque côté. En 1987, il y a désormais ${elapsed} ans, une expérience révolutionnaire démontra que si deux photons uniques et parfaitement identiques entrent simultanément dans une telle lame, ils se « groupent » systématiquement et ressortent toujours ensemble par la même sortie. Ce phénomène, dépourvu de tout analogue classique, prouve que l'interférence quantique ne se limite pas à une particule interférant avec elle-même, mais s'étend aux amplitudes de probabilité de plusieurs particules à la fois.`
			: `In classical physics, two light beams passing through a semi-reflective beam splitter emerge randomly and independently on either side. In 1987, ${elapsed} years ago now, a groundbreaking experiment showed that if two single, perfectly identical photons enter such a splitter simultaneously, they systematically "bunch" together and always exit through the same output port. This phenomenon, with no classical analogue whatsoever, proves that quantum interference is not limited to a single particle interfering with itself, but extends to the joint probability amplitudes of multiple particles at once.`;
	},
	sources: [
		{
			name: { fr: 'Measurement of subpicosecond time intervals between two photons by interference (1987)', en: 'Measurement of subpicosecond time intervals between two photons by interference (1987)' },
			url: 'https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.59.2044'
		}
	],
	contexts: [
		{
			title: { fr: 'Opérateurs de création et interférence destructive des amplitudes', en: 'Creation operators and destructive interference of amplitudes' },
			body: {
				fr: `La lame séparatrice est modélisée par une transformation unitaire agissant sur les opérateurs de création photonique $\\hat{a}^\\dagger$ et $\\hat{b}^\\dagger$ associés aux deux ports d'entrée. La réflexion introduit conventionnellement un déphasage imaginaire.\n\nLorsque deux photons indiscernables entrent simultanément, un par port, l'état de sortie s'écrit :\n\n$$(\\hat{a}^\\dagger + i\\hat{b}^\\dagger)(\\hat{b}^\\dagger + i\\hat{a}^\\dagger)\\ket{0,0} = (\\hat{a}^\\dagger\\hat{b}^\\dagger + i\\hat{a}^{\\dagger 2} + i\\hat{b}^{\\dagger 2} - \\hat{b}^\\dagger\\hat{a}^\\dagger)\\ket{0,0}$$\n\nLes opérateurs bosoniques commutant, $\\hat{a}^\\dagger\\hat{b}^\\dagger = \\hat{b}^\\dagger\\hat{a}^\\dagger$, les deux termes croisés correspondant à une sortie séparée des photons s'annulent exactement par interférence destructive. Il ne subsiste que les termes où les deux photons sortent groupés du même côté, un effet aujourd'hui exploité comme test de référence de l'indiscernabilité de photons uniques en information quantique.`,
				en: `The beam splitter is modeled as a unitary transformation acting on the photon creation operators $\\hat{a}^\\dagger$ and $\\hat{b}^\\dagger$ associated with the two input ports. Reflection conventionally introduces an imaginary phase shift.\n\nWhen two indistinguishable photons enter simultaneously, one through each port, the output state is:\n\n$$(\\hat{a}^\\dagger + i\\hat{b}^\\dagger)(\\hat{b}^\\dagger + i\\hat{a}^\\dagger)\\ket{0,0} = (\\hat{a}^\\dagger\\hat{b}^\\dagger + i\\hat{a}^{\\dagger 2} + i\\hat{b}^{\\dagger 2} - \\hat{b}^\\dagger\\hat{a}^\\dagger)\\ket{0,0}$$\n\nSince bosonic operators commute, $\\hat{a}^\\dagger\\hat{b}^\\dagger = \\hat{b}^\\dagger\\hat{a}^\\dagger$, the two cross terms corresponding to the photons exiting separately cancel exactly through destructive interference. Only the terms in which both photons exit bunched together on the same side survive, an effect now used as a benchmark test of single-photon indistinguishability in quantum information science.`
			},
			external: false
		}
	]
};
