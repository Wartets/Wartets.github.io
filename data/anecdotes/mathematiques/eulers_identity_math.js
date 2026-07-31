export default {
	id: 'anecdote_eulers_identity_math',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Analyse Complexe', en: 'Complex Analysis' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Souvent élue « plus belle équation des mathématiques » par les physiciens et mathématiciens, l'identité d'Euler accomplit un exploit métaphysique de concision. En une seule ligne, elle réunit les cinq constantes fondamentales les plus importantes des mathématiques (0, 1, Pi, le nombre e et l'unité imaginaire i) en utilisant exactement une fois les trois opérations fondamentales (addition, multiplication, exponentiation). Richard Feynman l'a qualifiée de « joyau absolu » et de « formule la plus remarquable de toutes les mathématiques ».`,
		en: `Often voted the "most beautiful equation in mathematics" by physicists and mathematicians alike, Euler's identity achieves a metaphysical feat of concision. In a single line, it unites the five most fundamental constants of mathematics (0, 1, Pi, the number e, and the imaginary unit i) using each of the three fundamental operations (addition, multiplication, exponentiation) exactly once. Richard Feynman called it an "absolute jewel" and "the most remarkable formula in all of mathematics".`
	},
	sources: [
		{
			name: { fr: 'Introductio in analysin infinitorum (L. Euler, Marcum-Michaelem Bousquet, 1748)', en: 'Introductio in analysin infinitorum (L. Euler, Marcum-Michaelem Bousquet, 1748)' },
			url: 'https://math.dartmouth.edu/~euler/pages/E101.html'
		}
	],
	contexts: [
		{
			title: { fr: 'La formule d\'Euler sur le cercle unitaire', en: "Euler's formula on the unit circle" },
			body: {
				fr: `Cette identité est un cas particulier de la formule de Moivre dans le plan complexe analytique. La série de Maclaurin de l'exponentielle s'écrit $e^z = \\sum \\frac{z^n}{n!}$. En injectant un argument purement imaginaire $z = ix$, le développement en série se sépare en parties paires (cosinus) et impaires (sinus avec un facteur $i$), donnant :\n\n$$e^{ix} = \\cos(x) + i\\sin(x)$$\n\nEn évaluant cette fonction à l'angle spécifique du demi-tour géométrique $x = \\pi$, on obtient $-1 + 0i$, aboutissant à la forme canonique élégante :\n\n$$e^{i\\pi} + 1 = 0$$`,
				en: `This identity is a special case of de Moivre's formula in the complex analytic plane. The Maclaurin series of the exponential is $e^z = \\sum \\frac{z^n}{n!}$. Substituting a purely imaginary argument $z = ix$, the series expansion splits into even (cosine) and odd (sine, with an $i$ factor) parts, giving:\n\n$$e^{ix} = \\cos(x) + i\\sin(x)$$\n\nEvaluating this function at the specific angle of a geometric half-turn, $x = \\pi$, yields $-1 + 0i$, resulting in the elegant canonical form:\n\n$$e^{i\\pi} + 1 = 0$$`
			},
			external: false
		}
	]
};
