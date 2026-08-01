export default {
	id: 'anecdote_roentgen_xray_discovery',
	enabled: true,
	priority: 3,
	addedDate: '2026-08-01',
	domain: { fr: 'Physique Expérimentale', en: 'Experimental Physics' },
	scheduling: { type: 'annual', dates: ['11-08'] },
	content: (lang, year) => {
		const elapsed = year - 1895;
		return lang === 'fr'
			? `Le 8 novembre 1895, il y a désormais ${elapsed} ans, le physicien allemand Wilhelm Röntgen étudiait le comportement des rayons cathodiques dans un tube sous vide recouvert de carton noir opaque. Il remarqua avec stupéfaction qu'un écran fluorescent, situé à l'autre bout de la pièce, s'illuminait à chaque fois qu'il allumait son tube. Il venait de découvrir une forme de rayonnement électromagnétique inconnue, capable de traverser la matière solide, qu'il baptisa « rayons X », le X symbolisant l'inconnu en mathématiques.`
			: `On November 8, 1895, ${elapsed} years ago now, German physicist Wilhelm Röntgen was studying the behavior of cathode rays in a vacuum tube covered with opaque black cardboard. He noticed with astonishment that a fluorescent screen at the far end of the room lit up every time he switched on his tube. He had just discovered an unknown form of electromagnetic radiation capable of passing through solid matter, which he named "X-rays", the X standing for the unknown in mathematics.`;
	},
	sources: [
		{
			name: { fr: 'Ueber eine neue Art von Strahlen (W.C. Röntgen, Sitzungsberichte der Würzburger Physik-medic. Gesellschaft, 1895)', en: 'Ueber eine neue Art von Strahlen (W.C. Röntgen, Sitzungsberichte der Würzburger Physik-medic. Gesellschaft, 1895)' },
			url: 'https://onlinelibrary.wiley.com/doi/abs/10.1002/andp.18983000102'
		}
	],
	contexts: [
		{
			title: { fr: 'Rayonnement de freinage (Bremsstrahlung)', en: 'Bremsstrahlung radiation' },
			body: {
				fr: `Les rayons X découverts par Röntgen ne proviennent pas du faisceau d'électrons lui-même, mais de son interaction violente avec la paroi métallique de l'anode. Lorsqu'un électron de haute énergie est freiné par le champ coulombien d'un noyau atomique lourd, son énergie cinétique perdue est convertie en un photon très énergétique.\n\nL'énergie maximale du photon émis est donnée par la limite de Duane-Hunt :\n\n$$E_{max} = h\\nu_{max} = \\frac{hc}{\\lambda_{min}} = eU$$\n\noù $e$ est la charge élémentaire et $U$ la tension d'accélération du tube. Ce phénomène, entièrement classique dans son mécanisme, coexiste avec les raies caractéristiques d'origine quantique émises lors du réarrangement des électrons de cœur de l'anode.`,
				en: `The X-rays discovered by Röntgen do not originate from the electron beam itself, but from its violent interaction with the anode's metal wall. When a high-energy electron is decelerated by the Coulomb field of a heavy atomic nucleus, its lost kinetic energy is converted into a highly energetic photon.\n\nThe maximum energy of the emitted photon is given by the Duane-Hunt limit:\n\n$$E_{max} = h\\nu_{max} = \\frac{hc}{\\lambda_{min}} = eU$$\n\nwhere $e$ is the elementary charge and $U$ the tube's accelerating voltage. This mechanism, entirely classical in origin, coexists with the characteristic lines of quantum origin emitted when the anode's core electrons rearrange.`
			},
			external: false
		}
	]
};
