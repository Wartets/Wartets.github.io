export default {
	id: 'anecdote_olbers_paradox_dark_sky',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Cosmologie / Astrophysique', en: 'Cosmology / Astrophysics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Pourquoi le ciel est-il noir la nuit ? Cette question enfantine est en réalité un profond paradoxe scientifique formulé par Heinrich Olbers en 1823. Si l'univers était statique, infini et peuplé uniformément d'étoiles éternelles, chaque ligne de vue devrait aboutir à la surface d'une étoile. Le ciel nocturne devrait donc être aussi brillant que la surface du Soleil. Le fait qu'il fasse noir la nuit est la preuve observable à l'œil nu que l'univers n'est ni statique ni infini dans le temps : il a eu un commencement (le Big Bang) et il est en expansion.`,
		en: `Why is the sky dark at night? This childlike question is in fact a profound scientific paradox formulated by Heinrich Olbers in 1823. If the universe were static, infinite, and uniformly populated with eternal stars, every line of sight would eventually end on the surface of a star. The night sky should therefore be as bright as the surface of the Sun. The fact that it is dark at night is observable, naked-eye proof that the universe is neither static nor infinite in time: it had a beginning (the Big Bang) and is expanding.`
	},
	sources: [
		{
			name: { fr: 'Cosmology: The Science of the Universe, 2nd Edition (Edward Harrison, Cambridge University Press, 2000)', en: 'Cosmology: The Science of the Universe, 2nd Edition (Edward Harrison, Cambridge University Press, 2000)' },
			url: 'https://www.cambridge.org/core/books/cosmology/'
		}
	],
	contexts: [
		{
			title: { fr: 'Calcul du flux lumineux total dans un univers euclidien infini', en: 'Total light flux in an infinite Euclidean universe' },
			body: {
				fr: `Considérons une densité numérique d'étoiles $n$ et une luminosité moyenne $L$. L'univers est découpé en coquilles sphériques d'épaisseur $dr$ à une distance $r$. Le nombre d'étoiles par coquille est $dN = n 4\\pi r^2 dr$. Le flux apparent d'une étoile diminue avec le carré de la distance : $f = L / (4\\pi r^2)$. Le flux total reçu sur Terre s'intègre sur toutes les coquilles jusqu'à l'infini :\n\n$$F_{total} = \\int_{0}^{\\infty} \\left( \\frac{L}{4\\pi r^2} \\right) (n 4\\pi r^2 dr) = n L \\int_{0}^{\\infty} dr = \\infty$$\n\nLe flux devrait être infini (ou plafonné à la brillance de surface stellaire). Le décalage vers le rouge et l'âge fini de l'univers limitent l'intégrale, résolvant le paradoxe.`,
				en: `Consider a number density of stars $n$ and an average luminosity $L$. The universe is divided into spherical shells of thickness $dr$ at distance $r$. The number of stars per shell is $dN = n\\, 4\\pi r^2 dr$. A star's apparent flux decreases with the square of distance: $f = L / (4\\pi r^2)$. The total flux received on Earth integrates over all shells to infinity:\n\n$$F_{total} = \\int_{0}^{\\infty} \\left( \\frac{L}{4\\pi r^2} \\right) (n\\, 4\\pi r^2 dr) = nL \\int_{0}^{\\infty} dr = \\infty$$\n\nThe total flux should be infinite (or capped at stellar surface brightness). Redshift and the finite age of the universe limit the integral, resolving the paradox.`
			},
			external: false
		}
	]
};
