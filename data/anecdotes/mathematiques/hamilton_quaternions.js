export default {
	id: 'anecdote_hamilton_quaternions',
	enabled: true,
	priority: 4,
	addedDate: '2026-07-31',
	domain: { fr: 'Algèbre Non Commutative', en: 'Non-commutative Algebra' },
	scheduling: { type: 'annual', dates: ['10-16'] },
	content: (lang, year) => {
		const elapsed = year - 1843;
		return lang === 'fr'
			? `Le 16 octobre 1843, il y a désormais ${elapsed} ans, alors qu'il se promenait à Dublin le long du canal royal, le mathématicien William Rowan Hamilton eut une illumination soudaine pour étendre les nombres complexes à des dimensions supérieures. N'ayant pas de papier sous la main, il grava directement au canif les équations fondamentales de sa découverte dans la pierre du pont de Brougham. Il venait d'inventer les quaternions, au prix du sacrifice d'un postulat millénaire : la commutativité de la multiplication.`
			: `On October 16, 1843, ${elapsed} years ago now, while walking along the Royal Canal in Dublin, mathematician William Rowan Hamilton had a sudden flash of insight for extending complex numbers into higher dimensions. Having no paper at hand, he carved the fundamental equations of his discovery directly into the stone of Broom Bridge with his penknife. He had just invented quaternions, at the cost of sacrificing a centuries-old postulate: the commutativity of multiplication.`;
	},
	sources: [
		{
			name: { fr: 'Letter to John T. Graves on the discovery of Quaternions (1844)', en: 'Letter to John T. Graves on the discovery of Quaternions (1844)' },
			url: 'https://maths.tcd.ie/pub/HistMath/People/Hamilton/QLetter/QLetter.pdf'
		}
	],
	contexts: [
		{
			title: { fr: 'Isomorphisme avec SU(2) et rotations spatiales', en: 'Isomorphism with SU(2) and spatial rotations' },
			body: {
				fr: `Les relations gravées par Hamilton sur le pont de Brougham définissent entièrement l'algèbre des quaternions :\n\n$$i^2 = j^2 = k^2 = ijk = -1$$\n\nUn quaternion unitaire permet de représenter de façon compacte une rotation d'angle $\\theta$ autour d'un axe unitaire $\\vec{u}$ :\n\n$$q = \\cos\\left(\\frac{\\theta}{2}\\right) + \\sin\\left(\\frac{\\theta}{2}\\right)(u_x i + u_y j + u_z k)$$\n\nCette structure est directement isomorphe au groupe spécial unitaire $SU(2)$ et aux matrices de Pauli, ce qui en fait le cadre naturel pour décrire le spin des fermions en mécanique quantique. En robotique et en aérospatiale, les quaternions sont aujourd'hui préférés aux angles d'Euler pour le contrôle d'orientation des satellites et des vaisseaux, car ils évitent le blocage de cardan (gimbal lock).`,
				en: `The relations Hamilton carved onto Broom Bridge fully define the algebra of quaternions:\n\n$$i^2 = j^2 = k^2 = ijk = -1$$\n\nA unit quaternion compactly represents a rotation of angle $\\theta$ about a unit axis $\\vec{u}$:\n\n$$q = \\cos\\left(\\frac{\\theta}{2}\\right) + \\sin\\left(\\frac{\\theta}{2}\\right)(u_x i + u_y j + u_z k)$$\n\nThis structure is directly isomorphic to the special unitary group $SU(2)$ and to the Pauli matrices, making it the natural framework for describing fermion spin in quantum mechanics. In robotics and aerospace engineering, quaternions are now preferred over Euler angles for spacecraft and satellite orientation control, since they avoid gimbal lock.`
			},
			external: false
		}
	]
};
