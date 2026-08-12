export default {
	id: 'anecdote_turing_bombe_enigma_crypto',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Cryptographie / Histoire des Sciences', en: 'Cryptography / History of Science' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Durant la Seconde Guerre mondiale, l'armée allemande chiffrait ses communications avec Enigma, une machine à rotors générant des millions de milliards de combinaisons possibles chaque jour. Alan Turing et les cryptanalystes de Bletchley Park ne tentèrent pas de tester toutes ces combinaisons : ils exploitèrent une faiblesse structurelle du câblage, à savoir qu'une lettre n'était jamais chiffrée par elle-même, pour concevoir « la Bombe », une machine électromécanique d'élimination logique qui réduisit drastiquement le temps de décryptage.`,
		en: `During the Second World War, the German army encrypted its communications with Enigma, a rotor machine generating millions of billions of possible combinations each day. Alan Turing and the cryptanalysts at Bletchley Park did not attempt to test every combination: they exploited a structural weakness in the wiring, namely that a letter was never encrypted as itself, to design "the Bombe", an electromechanical machine of logical elimination that drastically reduced decryption time.`
	},
	sources: [
		{
			name: { fr: 'The Turing-Welchman Bombe', en: 'The Turing-Welchman Bombe' },
			url: 'https://www.tnmoc.org/bombe'
		}
	],
	contexts: [
		{
			title: { fr: 'Une machine sans point fixe', en: 'A machine with no fixed point' },
			body: {
				fr: `Le chiffrement d'Enigma peut se modéliser comme une permutation sur les 26 lettres de l'alphabet, combinant le tableau de connexions $S$, les rotors $P$ et le réflecteur $R$ : $E = S \\cdot P \\cdot R \\cdot P^{-1} \\cdot S^{-1}$. Le réflecteur impose une propriété cruciale : cette permutation globale est une involution ($E^2 = \\text{id}$) sans point fixe, donc $E(x) \\neq x$ pour toute lettre $x$. À partir de mots probables (« cribs »), les équipes construisaient des graphes de déductions logiques : toute hypothèse de rotor menant à une contradiction électrique était rejetée, éliminant en quelques minutes des millions de configurations.`,
				en: `Enigma's encryption can be modeled as a permutation over the 26 letters of the alphabet, combining the plugboard $S$, the rotors $P$, and the reflector $R$: $E = S \\cdot P \\cdot R \\cdot P^{-1} \\cdot S^{-1}$. The reflector enforces a crucial property: this global permutation is an involution ($E^2 = \\text{id}$) with no fixed point, so $E(x) \\neq x$ for any letter $x$. Starting from probable words ("cribs"), the teams built graphs of logical deductions: any rotor hypothesis leading to an electrical contradiction was rejected, eliminating millions of configurations within minutes.`
			},
			external: false
		}
	]
};
