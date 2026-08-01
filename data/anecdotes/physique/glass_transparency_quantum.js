export default {
	id: 'anecdote_glass_transparency_quantum',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-01',
	domain: { fr: 'Physique Quantique / Matériaux', en: 'Quantum Physics / Materials' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Pourquoi la lumière passe-t-elle à travers une vitre en verre mais est bloquée par un mur en pierre ? En mécanique quantique, les électrons ne peuvent absorber l'énergie que par « sauts » précis (les quanta). Dans la silice pure, le saut d'énergie qu'un électron doit franchir pour s'exciter est si grand qu'un photon de lumière visible n'a pas assez d'énergie pour le propulser : il est simplement ignoré, et traverse le matériau comme s'il n'y avait rien. Les rayons ultraviolets, plus puissants, ont juste la bonne énergie et sont donc bloqués, empêchant de bronzer derrière une vitre.`,
		en: `Why does light pass through a glass window yet get blocked by a stone wall? In quantum mechanics, electrons can only absorb energy in precise "jumps" (quanta). In pure silica, the energy jump an electron must make to become excited is so large that a visible-light photon lacks enough energy to trigger it: the photon is simply ignored, and passes through the material as if nothing were there. Ultraviolet rays, more powerful, carry exactly the right energy and are therefore blocked, which is why one cannot tan behind a window.`
	},
	sources: [
		{
			name: { fr: 'Optical properties of glass (J. Tauc, Journal of Non-Crystalline Solids, 1970)', en: 'Optical properties of glass (J. Tauc, Journal of Non-Crystalline Solids, 1970)' },
			url: 'https://www.sciencedirect.com/science/article/pii/0022309370901563'
		}
	],
	contexts: [
		{
			title: { fr: 'Structure de bande et énergie du gap optique', en: 'Band structure and optical gap energy' },
			body: {
				fr: `Le dioxyde de silicium ($SiO_2$ amorphe) possède une structure de bandes caractérisée par un immense gap d'énergie séparant la bande de valence (pleine) de la bande de conduction (vide), avec $E_g \\approx 9$ eV.\n\nL'énergie d'un photon incident est reliée à sa fréquence par la relation de Planck :\n\n$$E_{photon} = h\\nu = \\frac{hc}{\\lambda}$$\n\nLa lumière visible (400-700 nm) a une énergie maximale d'environ $3,1$ eV (bleu-violet). Puisque $3,1$ eV $\\ll 9$ eV, aucun électron ne peut subir de transition : le coefficient d'absorption reste nul, conférant au verre sa transparence structurelle.`,
				en: `Amorphous silicon dioxide ($SiO_2$) has a band structure characterized by an immense energy gap separating the (full) valence band from the (empty) conduction band, with $E_g \\approx 9$ eV.\n\nThe energy of an incident photon is related to its frequency by Planck's relation:\n\n$$E_{photon} = h\\nu = \\frac{hc}{\\lambda}$$\n\nVisible light (400-700 nm) has a maximum energy of about $3.1$ eV (blue-violet). Since $3.1$ eV $\\ll 9$ eV, no electron can undergo a transition: the absorption coefficient remains zero, giving glass its structural transparency.`
			},
			external: false
		}
	]
};
