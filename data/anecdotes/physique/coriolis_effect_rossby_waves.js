export default {
	id: 'anecdote_coriolis_effect_rossby_waves',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Géophysique - Mécanique des Fluides', en: 'Geophysics - Fluid Mechanics' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `Observées depuis l'espace, les grandes tempêtes tournent toujours dans le sens inverse des aiguilles d'une montre dans l'hémisphère Nord, et dans l'autre sens au Sud. Ceci n'est pas causé par des frottements magiques, mais par l'effet Coriolis. La Terre tourne plus vite à l'équateur, où la circonférence est grande, qu'aux pôles. L'air chaud des tropiques, poussé vers le Nord, transporte sa grande vitesse latérale d'origine, ce qui le dévie apparemment vers la droite par rapport au sol plus lent en dessous. Cet effet dicte la circulation de toutes les atmosphères planétaires, générant des courants-jets ondulatoires appelés ondes de Rossby.`,
		en: `Observed from space, large storms always rotate counterclockwise in the Northern Hemisphere, and clockwise in the Southern Hemisphere. This is not caused by magical friction, but by the Coriolis effect. The Earth spins faster at the equator, where its circumference is large, than near the poles. Warm tropical air, pushed northward, carries its greater original lateral velocity, causing it to appear deflected to the right relative to the slower ground beneath it. This effect governs the circulation of every planetary atmosphere, generating undulating jet streams known as Rossby waves.`
	},
	sources: [
		{
			name: { fr: 'Relation between variations in the intensity of the zonal circulation of the atmosphere... (C. G. Rossby, Journal of Marine Research, 1939)', en: 'Relation between variations in the intensity of the zonal circulation of the atmosphere... (C. G. Rossby, Journal of Marine Research, 1939)' },
			url: 'https://peabody.yale.edu/sites/default/files/documents/publications/jmr02-01-06-CG_ROSSBYetal.pdf'
		}
	],
	contexts: [
		{
			title: { fr: 'La force fictive de Coriolis en référentiel tournant', en: 'The fictitious Coriolis force in a rotating frame' },
			body: {
				fr: `Dans un référentiel non galiléen en rotation à vitesse angulaire $\\boldsymbol{\\Omega}$, l'application de la seconde loi de Newton requiert l'addition d'une force inertielle. Pour une masse d'air $m$ se déplaçant à la vitesse relative $\\mathbf{v}$, la force de Coriolis s'écrit :\n\n$$\\mathbf{F}_C = -2m \\boldsymbol{\\Omega} \\times \\mathbf{v}$$\n\nL'accélération latérale subie par une particule atmosphérique aux latitudes moyennes $\\varphi$ est proportionnelle au paramètre de Coriolis local $f = 2\\Omega \\sin(\\varphi)$. L'équilibre géostrophique dicte que le gradient de pression de l'air d'un cyclone est équilibré par cette force inertielle latérale.`,
				en: `In a non-inertial frame rotating at angular velocity $\\boldsymbol{\\Omega}$, applying Newton's second law requires adding an inertial force. For an air mass $m$ moving at relative velocity $\\mathbf{v}$, the induced Coriolis force is:\n\n$$\\mathbf{F}_C = -2m \\boldsymbol{\\Omega} \\times \\mathbf{v}$$\n\nThe lateral acceleration experienced by an atmospheric parcel at mid-latitudes $\\varphi$ is proportional to the local Coriolis parameter $f = 2\\Omega \\sin(\\varphi)$. Geostrophic balance dictates that a cyclone's pressure gradient is balanced by this lateral inertial force.`
			},
			external: false
		},
		{
			title: { fr: 'Les ondes de Rossby et l\'approximation du plan-bêta', en: 'Rossby waves and the beta-plane approximation' },
			body: {
				fr: `Parce que la force de Coriolis dépend de la latitude, le paramètre $f$ n'est pas constant spatialement. En effectuant un développement de Taylor au premier ordre, dit plan-$\\beta$, on obtient $f \\approx f_0 + \\beta y$. La conservation de la vorticité potentielle impose qu'une parcelle d'air déplacée vers le Nord diminue sa rotation propre pour compenser l'augmentation de la rotation terrestre, créant une onde stationnaire immense. La vitesse de phase $c$ des ondes de Rossby se résout par :\n\n$$c = U - \\frac{\\beta}{k^2 + l^2}$$\n\noù $U$ est le vent moyen d'Ouest, et $k, l$ les nombres d'onde. Ces calculs fondent les modèles numériques de prévision météorologique à long terme.`,
				en: `Because the Coriolis force depends on latitude, the parameter $f$ is not spatially constant. A first-order Taylor expansion, known as the beta-plane approximation, gives $f \\approx f_0 + \\beta y$. Conservation of potential vorticity requires that an air parcel displaced northward reduces its own rotation to compensate for the increasing rotation of the Earth, creating a giant standing wave. The phase velocity $c$ of Rossby waves is given by:\n\n$$c = U - \\frac{\\beta}{k^2 + l^2}$$\n\nwhere $U$ is the mean westerly wind, and $k, l$ the wavenumbers. These calculations underlie long-range numerical weather-forecasting models.`
			},
			external: false
		}
	]
};
