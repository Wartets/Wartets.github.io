export default {
	id: 'anecdote_uranus_named_george',
	enabled: true,
	priority: 3,
	addedDate: '2026-07-31',
	domain: { fr: 'Histoire de l\'Astronomie', en: 'History of Astronomy' },
	scheduling: { type: 'annual', dates: ['03-13'] },
	content: {
		fr: `Toutes les planètes du système solaire portent majestueusement les noms de divinités mythologiques gréco-romaines (Mercure, Vénus, Mars...). Mais lorsque l'astronome britannique William Herschel a découvert la première planète invisible à l'œil nu à l'aide d'un télescope en 1781, il a rompu avec cette tradition antique. Pour remercier son mécène, le roi d'Angleterre, il baptisa l'astre « Georgium Sidus » (L'Étoile de George). Pendant plusieurs décennies, le système solaire était donc composé de Mercure, Vénus, Terre, Mars, Jupiter, Saturne... et George, avant que la communauté internationale ne tranche finalement pour Uranus.`,
		en: `All the planets of the Solar System majestically bear the names of Greco-Roman mythological deities (Mercury, Venus, Mars...). But when British astronomer William Herschel discovered the first planet invisible to the naked eye using a telescope in 1781, he broke with this ancient tradition. To thank his patron, the King of England, he named the object "Georgium Sidus" (George's Star). For several decades, the Solar System therefore consisted of Mercury, Venus, Earth, Mars, Jupiter, Saturn... and George, before the international community finally settled on Uranus.`
	},
	sources: [
		{
			name: { fr: 'Naming the Universe, American Scientist', en: 'Naming the Universe, American Scientist' },
			url: 'https://www.jstor.org/stable/26910913'
		}
	],
	contexts: [
		{
			title: { fr: 'Découverte par mouvement propre et Loi de Titius-Bode', en: 'Discovery through proper motion and the Titius-Bode law' },
			body: {
				fr: `Herschel pensait initialement avoir découvert une comète ou une nébuleuse. C'est l'observation de sa parallaxe très faible et de son mouvement propre lent par rapport au fond d'étoiles fixes qui a confirmé son orbite lointaine, quasi circulaire. L'engouement fut d'autant plus fort que son demi-grand axe $a$ (environ 19,2 UA) tombait remarquablement proche de la valeur prédite par la loi empirique de Titius-Bode :\n\n$$a = 0,4 + 0,3 \\times 2^m \\text{ Unités Astronomiques}$$\n\n(pour Uranus, le rang $m=6$ donne 19,6 UA).`,
				en: `Herschel initially believed he had discovered a comet or a nebula. It was the observation of its very small parallax and slow proper motion against the background of fixed stars that confirmed its distant, nearly circular orbit. Enthusiasm grew even stronger when its semi-major axis $a$ (about 19.2 AU) turned out remarkably close to the value predicted by the empirical Titius-Bode law:\n\n$$a = 0.4 + 0.3 \\times 2^m \\text{ Astronomical Units}$$\n\n(for Uranus, rank $m=6$ gives 19.6 AU).`
			},
			external: false
		}
	]
};
