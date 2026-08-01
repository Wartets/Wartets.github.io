export default {
	id: 'anecdote_cosmic_rays_bit_flip',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Physique des Particules / Informatique', en: 'Particle Physics / Computer Science' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Parfois, un ordinateur ou un smartphone plante de manière totalement inexplicable, sans aucune erreur de code. Le coupable vient souvent de l'espace profond. Des particules de haute énergie (rayons cosmiques) frappent l'atmosphère terrestre, créant des cascades de neutrons. Si l'un de ces neutrons percute exactement un minuscule transistor de la mémoire RAM d'un appareil, il peut en inverser la charge électrique, transformant un « 0 » en « 1 ». Ce phénomène (Single-Event Upset) est si courant que les serveurs critiques et les satellites utilisent des mémoires spéciales capables de corriger mathématiquement ces collisions cosmiques.`,
		en: `Sometimes a computer or smartphone crashes for no apparent reason, with no code error involved. The culprit often comes from deep space. High-energy particles (cosmic rays) strike Earth's atmosphere, producing cascades of neutrons. If one of these neutrons happens to hit a tiny transistor in a device's RAM, it can flip its electrical charge, turning a "0" into a "1". This phenomenon (Single-Event Upset) is so common that critical servers and satellites use special memories capable of mathematically correcting these cosmic collisions.`
	},
	sources: [
		{
			name: { fr: 'Cosmic Rays and Soft Errors (J.F. Ziegler, IBM Journal of Research and Development, 1996)', en: 'Cosmic Rays and Soft Errors (J.F. Ziegler, IBM Journal of Research and Development, 1996)' },
			url: 'https://ieeexplore.ieee.org/document/5390035'
		}
	],
	contexts: [
		{
			title: { fr: 'Dépôt d\'énergie et taux d\'erreur douce (SER)', en: 'Energy deposition and the Soft Error Rate (SER)' },
			body: {
				fr: `Un neutron secondaire atmosphérique percute un atome de silicium du semi-conducteur, provoquant une réaction nucléaire locale (par exemple une spallation). Les ions lourds de recul génèrent une trace de paires électron-trou. Si la charge collectée $Q$ à un nœud sensible dépasse la charge critique $Q_{crit}$ de la cellule mémoire, l'état logique bascule. Le taux d'erreur est souvent modélisé selon la loi empirique de Hazucha-Svensson :\n\n$$SER \\propto F \\times K \\times \\exp\\left(-\\frac{Q_{crit}}{Q_s}\\right)$$\n\noù $F$ est le flux de neutrons, $K$ une constante de section efficace, et $Q_s$ la charge de collection d'efficacité.`,
				en: `A secondary atmospheric neutron strikes a silicon atom of the semiconductor, causing a local nuclear reaction (e.g. spallation). The heavy recoil ions leave a track of electron-hole pairs. If the charge $Q$ collected at a sensitive node exceeds the critical charge $Q_{crit}$ of the memory cell, the logical state flips. The error rate is often modeled using the empirical Hazucha-Svensson law:\n\n$$SER \\propto F \\times K \\times \\exp\\left(-\\frac{Q_{crit}}{Q_s}\\right)$$\n\nwhere $F$ is the neutron flux, $K$ a cross-section constant, and $Q_s$ the collection efficiency charge.`
			},
			external: false
		}
	]
};
