export default {
	id: 'anecdote_chadwick_neutron_discovery',
	enabled: true,
	priority: 3,
	addedDate: '2026-08-01',
	domain: { fr: 'Physique Nucléaire', en: 'Nuclear Physics' },
	scheduling: { type: 'annual', dates: ['02-27'] },
	content: (lang, year) => {
		const elapsed = year - 1932;
		return lang === 'fr'
			? `Jusqu'en 1932, les physiciens pensaient que le noyau d'un atome n'était composé que de protons et d'électrons compactés, une théorie posant d'immenses problèmes de mécanique quantique. En bombardant du béryllium avec des particules alpha, James Chadwick prouva, il y a désormais ${elapsed} ans, l'existence d'une particule fantôme dépourvue de charge électrique mais de masse presque identique à celle du proton : le neutron. Cette découverte rendit possible la fission nucléaire contrôlée.`
			: `Until 1932, physicists believed that the atomic nucleus was made up solely of compacted protons and electrons, a theory that raised enormous quantum-mechanical problems. By bombarding beryllium with alpha particles, James Chadwick proved, ${elapsed} years ago now, the existence of a ghostly particle carrying no electric charge but with a mass nearly identical to that of the proton: the neutron. This discovery made controlled nuclear fission possible.`;
	},
	sources: [
		{
			name: { fr: 'Possible Existence of a Neutron (J. Chadwick, Nature, 1932)', en: 'Possible Existence of a Neutron (J. Chadwick, Nature, 1932)' },
			url: 'https://www.nature.com/articles/129312a0'
		}
	],
	contexts: [
		{
			title: { fr: 'Cinématique des collisions élastiques', en: 'Kinematics of elastic collisions' },
			body: {
				fr: `Irène et Frédéric Joliot-Curie avaient observé ce rayonnement neutre mais pensaient qu'il s'agissait de rayons gamma très énergétiques. Chadwick mesura le recul des atomes (hydrogène et azote) frappés par ce rayonnement.\n\nEn appliquant la conservation de l'énergie et de la quantité de mouvement non relativiste, la vitesse maximale $v_p$ acquise par un noyau cible de masse $m$ heurté par une particule incidente de masse $M$ et de vitesse $V$ est :\n\n$$v_p = \\frac{2M}{M+m}V$$\n\nEn comparant les reculs pour l'hydrogène et l'azote, Chadwick calcula que $M$ (la masse de la particule mystère) valait environ 1,006 fois la masse du proton, prouvant qu'il ne s'agissait pas de lumière (photons sans masse) mais d'une particule massive neutre.`,
				en: `Irène and Frédéric Joliot-Curie had observed this neutral radiation but believed it to be highly energetic gamma rays. Chadwick measured the recoil of atoms (hydrogen and nitrogen) struck by this radiation.\n\nApplying non-relativistic conservation of energy and momentum, the maximum velocity $v_p$ acquired by a target nucleus of mass $m$ struck by an incident particle of mass $M$ and velocity $V$ is:\n\n$$v_p = \\frac{2M}{M+m}V$$\n\nBy comparing the recoils for hydrogen and nitrogen, Chadwick calculated that $M$ (the mystery particle's mass) was about 1.006 times the proton's mass, proving it was not light (massless photons) but a massive neutral particle.`
			},
			external: false
		}
	]
};
