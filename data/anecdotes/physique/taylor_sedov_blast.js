export default {
	id: 'anecdote_taylor_sedov_blast',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Physique - Mécanique des Fluides', en: 'Physics - Fluid Mechanics' },
	scheduling: { type: 'annual', dates: ['07-16'] },
	content: (lang, year) => {
		const elapsed = year - 1945;
		return lang === 'fr'
			? `En exploitant des photographies déclassifiées du premier essai nucléaire Trinity publiées dans le magazine Life, le physicien britannique G.I. Taylor a déduit par simple analyse dimensionnelle l'énergie exacte de l'explosion, alors classée secret défense, il y a désormais ${elapsed} ans.`
			: `By exploiting declassified photographs of the first Trinity nuclear test published in Life magazine, British physicist G.I. Taylor deduced the exact energy of the explosion, then a closely guarded secret, through dimensional analysis alone, ${elapsed} years ago.`;
	},
	sources: [
		{
			name: { fr: 'The Formation of a Blast Wave by a Very Intense Explosion (1950)', en: 'The Formation of a Blast Wave by a Very Intense Explosion (1950)' },
			url: 'https://royalsocietypublishing.org/doi/10.1098/rspa.1950.0049'
		}
	],
	contexts: [
		{
			title: { fr: 'Théorème de Buckingham et onde de choc de Sedov-Taylor', en: 'Buckingham theorem and the Sedov-Taylor blast wave' },
			body: {
				fr: `Taylor identifia les seuls paramètres physiquement pertinents pour décrire le front d'une onde de choc issue d'une explosion ponctuelle : le rayon du front $R$, le temps écoulé $t$, la masse volumique de l'air non perturbé $\\rho$, et l'énergie libérée $E$.\n\nPar analyse dimensionnelle pure, la seule combinaison de ces grandeurs ayant la dimension d'une longueur s'écrit :\n\n$$R(t) = S(\\gamma) \\left( \\frac{E t^2}{\\rho} \\right)^{1/5}$$\n\noù $S(\\gamma)$ est une constante adimensionnelle dépendant de l'indice adiabatique de l'air. En mesurant simplement le rayon du champignon atomique sur des clichés publics à différents instants, Taylor put remonter à une valeur de $E$ étonnamment proche des 20 kilotonnes réels de l'essai Trinity, sans jamais avoir eu accès à une seule donnée classifiée.`,
				en: `Taylor identified the only physically relevant parameters describing the shock front from a point explosion: the front radius $R$, the elapsed time $t$, the density of undisturbed air $\\rho$, and the energy released $E$.\n\nThrough pure dimensional analysis, the only combination of these quantities with the dimension of a length is:\n\n$$R(t) = S(\\gamma) \\left( \\frac{E t^2}{\\rho} \\right)^{1/5}$$\n\nwhere $S(\\gamma)$ is a dimensionless constant depending on air's adiabatic index. By simply measuring the radius of the mushroom cloud on publicly released photographs at different times, Taylor was able to derive a value of $E$ strikingly close to the actual 20-kiloton yield of the Trinity test, without ever accessing a single classified figure.`
			},
			external: false
		}
	]
};
