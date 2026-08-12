export default {
	id: 'anecdote_cooley_tukey_fft_algorithm',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Traitement du Signal / Mathématiques', en: 'Signal Processing / Mathematics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1965, James Cooley et John Tukey publient un article de seulement quatre pages qui va façonner l'ère numérique moderne : la Transformée de Fourier Rapide (FFT). Ils ont conçu une méthode permettant de décomposer instantanément n'importe quel signal complexe, comme le son d'une voix, en ses fréquences fondamentales de base. Sans la réorganisation mathématique géniale de la FFT, le traitement de données serait des milliers de fois plus lent. Des technologies comme les réseaux Wi-Fi, l'imagerie médicale IRM, ou la compression des images JPEG et de la musique MP3, ne pourraient techniquement pas fonctionner en temps réel aujourd'hui sans cet algorithme.`,
		en: `In 1965, James Cooley and John Tukey published a mere four-page paper that would shape the modern digital era: the Fast Fourier Transform (FFT). They devised a method to instantly decompose any complex signal, such as the sound of a voice, into its fundamental frequencies. Without the FFT's brilliant mathematical reorganization, data processing would be thousands of times slower. Technologies such as Wi-Fi networks, MRI medical imaging, or JPEG image and MP3 music compression could not technically run in real time today without this algorithm.`
	},
	sources: [
		{
			name: { fr: 'An algorithm for the machine calculation of complex Fourier series (J. W. Cooley, J. W. Tukey, Mathematics of Computation, 1965)', en: 'An algorithm for the machine calculation of complex Fourier series (J. W. Cooley, J. W. Tukey, Mathematics of Computation, 1965)' },
			url: 'https://www.ams.org/journals/mcom/1965-19-090/S0025-5718-1965-0178586-1/'
		}
	],
	contexts: [
		{
			title: { fr: 'Le paradigme Diviser pour Régner', en: 'The Divide and Conquer paradigm' },
			body: {
				fr: `La Transformée de Fourier Discrète (DFT) directe d'un signal de $N$ échantillons est définie par $X_k = \\sum_{n=0}^{N-1} x_n W_N^{kn}$, avec $W_N = e^{-i 2\\pi / N}$. Son calcul naïf requiert une complexité de $\\mathcal{O}(N^2)$, limitant drastiquement la taille des signaux traitables. L'algorithme de Cooley-Tukey sépare la somme en indices pairs et impairs. L'équation de récurrence s'écrit :\n\n$$X_k = \\sum_{m=0}^{N/2-1} x_{2m} W_{N/2}^{km} + W_N^k \\sum_{m=0}^{N/2-1} x_{2m+1} W_{N/2}^{km}$$\n\nCette subdivision récursive réduit drastiquement le nombre de multiplications nécessaires, faisant chuter la complexité à $\\mathcal{O}(N \\log N)$. Pour $N=10^6$, l'algorithme est environ 50 000 fois plus rapide que la méthode matricielle classique.`,
				en: `The direct Discrete Fourier Transform (DFT) of a signal with $N$ samples is defined by $X_k = \\sum_{n=0}^{N-1} x_n W_N^{kn}$, with $W_N = e^{-i 2\\pi / N}$. Its naive computation requires $\\mathcal{O}(N^2)$ complexity, drastically limiting the size of processable signals. The Cooley-Tukey algorithm splits the sum into even and odd indices. The recurrence equation is:\n\n$$X_k = \\sum_{m=0}^{N/2-1} x_{2m} W_{N/2}^{km} + W_N^k \\sum_{m=0}^{N/2-1} x_{2m+1} W_{N/2}^{km}$$\n\nThis recursive subdivision drastically reduces the number of multiplications needed, dropping the complexity to $\\mathcal{O}(N \\log N)$. For $N=10^6$, the algorithm is about 50,000 times faster than the classical matrix method.`
			},
			external: false
		}
	]
};
