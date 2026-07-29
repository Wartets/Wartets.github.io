window.libraryData = {
	categories: [
		{ id: 1, name: "Physics" },
		{ id: 2, name: "Mathematics" },
		{ id: 3, name: "Computer Science" },
		{ id: 4, name: "Personal Notes" },
		{ id: 5, name: "Chemistry" },
		{ id: 6, name: "Biology" },
		{ id: 7, name: "Engineering" },
		{ id: 8, name: "Philosophy" },
		{ id: 9, name: "History" },
		{ id: 10, name: "Economics" },
		{ id: 11, name: "Literature" },
		{ id: 12, name: "Art" },
		{ id: 13, name: "Astronomy" },
		{ id: 14, name: "Medicine" },
		{ id: 15, name: "Law" },
		{ id: 16, name: "Psychology" },
		{ id: 17, name: "Sociology" },
		{ id: 18, name: "Geography" },
		{ id: 19, name: "Political Science" },
		{ id: 20, name: "Linguistics" }
	],
	types: [
		{ id: "course", name: "Course" },
		{ id: "exercise", name: "Exercise" },
		{ id: "report", name: "Report" },
		{ id: "paper", name: "Paper" },
		{ id: "reference", name: "Reference" },
		{ id: "theory", name: "Theory" }
	],
	languages: [
		{ id: "fr", name: "Français" },
		{ id: "en", name: "English" }
	],
	authors: [
		{ id: "cbr", forname: "Colin", surname: "Bossu Réaubourg" },
		{ id: "atp", forname: "Ayrton", surname: "Tavares de Pinho" }
	],
	documents: [
		{
			id: "doc-001",
			slug: "introduction-physique-quantique",
			title: { fr: "Introduction à la Physique Quantique", en: "Introduction to Quantum Physics" },
			description: {
				fr: "Notes de cours magistral de troisième année de licence.",
				en: "Lecture notes from a third-year undergraduate course."
			},
			filePath: "https://wartets.github.io/assets/documents/Cours_Quantique_1.pdf",
			categoryIds: [1],
			typeId: "course",
			authorIds: ["cbr"],
			tags: ["physics", "quantum", "university", "lecture", "lesson"],
			langId: "fr",
			timestamp: "2025-12-13T00:00:00Z",
			show: true
		},
		{
			id: "doc-002",
			slug: "mathematiques-5-cours",
			title: { fr: "Mathématiques 5 - Cours", en: "Mathematics 5 - Course" },
			description: {
				fr: "Écriture tensorielle, Analyse complexe, Séries de Fourier et Équations différentielles.",
				en: "Tensor notation, complex analysis, Fourier series and differential equations."
			},
			filePath: "https://wartets.github.io/assets/documents/Cours_Mathématiques_5.pdf",
			categoryIds: [2],
			typeId: "course",
			authorIds: ["cbr"],
			tags: ["mathematics", "university", "lecture", "lesson"],
			langId: "fr",
			timestamp: "2025-12-13T00:00:00Z",
			show: true
		},
		{
			id: "doc-003",
			slug: "rapport-physique-experimentale-etude-lasso",
			title: { fr: "Rapport de physique expérimentale - Etude du lasso", en: "Experimental Physics Report - Study of the Lasso" },
			description: {
				fr: "Étude expérimentale de la bifurcation supercritique d'un anneau en rotation : effets de géométrie finie et imperfections.",
				en: "Experimental study of the supercritical bifurcation of a rotating ring: effects of finite geometry and imperfections."
			},
			filePath: "https://wartets.github.io/assets/documents/Rapport_Final_Physique_Expérimentale.pdf",
			categoryIds: [1],
			typeId: "report",
			authorIds: ["cbr", "atp"],
			tags: ["physics", "experimental", "university", "lecture"],
			langId: "fr",
			timestamp: "2025-12-07T00:00:00Z",
			show: true
		},
		{
			id: "doc-004",
			slug: "resolution-equation-schrodinger-potentiel-periodique",
			title: { fr: "Résolution de l'équation de Schrödinger pour un potentiel périodique fini", en: "Solving the Schrödinger Equation for a Finite Periodic Potential" },
			description: { fr: "", en: "" },
			filePath: "https://wartets.github.io/assets/documents/Résolution_eqShrod_period_fini.pdf",
			categoryIds: [1],
			typeId: "exercise",
			authorIds: ["cbr"],
			tags: ["physics", "quantum", "exercise"],
			langId: "fr",
			timestamp: "2025-10-16T00:00:00Z",
			show: true
		},
		{
			id: "doc-005",
			slug: "probabilites-et-lancer-de-des",
			title: { fr: "Probabilités et Lancer de Dés", en: "Probability and Dice Rolls" },
			description: {
				fr: "Calcul des probabilités associées aux sommes obtenues lors de lancers de dés.",
				en: "Calculation of the probabilities associated with the sums obtained when rolling dice."
			},
			filePath: "https://wartets.github.io/assets/documents/Lancé_de_dés.pdf",
			categoryIds: [2],
			typeId: "exercise",
			authorIds: ["cbr"],
			tags: ["mathematics", "exercise", "probabilities"],
			langId: "fr",
			timestamp: "2025-11-07T00:00:00Z",
			show: true
		},
		{
			id: "doc-006",
			slug: "informatique-quantique-avec-qiskit",
			title: { fr: "Informatique Quantique avec Qiskit", en: "Quantum Computing with Qiskit" },
			description: {
				fr: "Traité sur l'information quantique avec Qiskit",
				en: "A treatise on quantum information using Qiskit."
			},
			filePath: "https://wartets.github.io/assets/documents/Informatique_Quantique_avec_Qiskit.pdf",
			categoryIds: [1, 3],
			typeId: "course",
			authorIds: ["cbr"],
			tags: ["physics", "quantum", "lesson", "computer"],
			langId: "fr",
			timestamp: "2025-09-29T00:00:00Z",
			show: true
		},
		{
			id: "doc-007",
			slug: "optique-et-electromagnetisme-cours",
			title: { fr: "Optique et électromagnétisme - Cours", en: "Optics and Electromagnetism - Course" },
			description: {
				fr: "Optique ondulatoire et électromagnétisme dans les milieu.",
				en: "Wave optics and electromagnetism in media."
			},
			filePath: "https://wartets.github.io/assets/documents/Cours_OOEM.pdf",
			categoryIds: [1],
			typeId: "course",
			authorIds: ["cbr"],
			tags: ["physics", "optics", "university", "lecture", "lesson"],
			langId: "fr",
			timestamp: "2025-09-25T00:00:00Z",
			show: true
		},
		{
			id: "doc-008",
			slug: "formules-mathematiques-physique",
			title: { fr: "Quelques formules mathématiques pour la physique", en: "Some Mathematical Formulas for Physics" },
			description: {
				fr: "Formules mathématiques couramment utilisées en physique, présentées de manière concise comme référence analytique.",
				en: "Mathematical formulas commonly used in physics, presented concisely as an analytical reference."
			},
			filePath: "https://wartets.github.io/assets/documents/Quelques_formules_mathématiques_pour_la_physique.pdf",
			categoryIds: [1, 2],
			typeId: "reference",
			authorIds: ["cbr"],
			tags: ["physics", "mathematics"],
			langId: "fr",
			timestamp: "2025-08-10T00:00:00Z",
			show: true
		},
		{
			id: "doc-009",
			slug: "theorie-algebrique-unites-constantes-normalisation",
			title: { fr: "Théorie Algébrique des Unités, Constantes et Normalisation Physique", en: "Algebraic Theory of Units, Constants, and Physical Normalization" },
			description: {
				fr: "Formalisme mathématique, métrologie et implémentation numérique de la théroie des unitées",
				en: "Mathematical formalism, metrology, and numerical implementation of the theory of units."
			},
			filePath: "https://wartets.github.io/assets/documents/theorie_algebrique_unites.pdf",
			categoryIds: [1, 2, 3],
			typeId: "theory",
			authorIds: ["cbr"],
			tags: ["physics", "mathematics", "computer science"],
			langId: "fr",
			timestamp: "2025-12-09T00:00:00Z",
			show: true
		},
		{
			id: "doc-010",
			slug: "arithmetic-and-number-theory",
			title: { fr: "Arithmétique et Théorie des Nombres", en: "Arithmetic and Number Theory" },
			description: {
				fr: "Problèmes choisis sur les carrés parfaits et la divisibilité.",
				en: "Selected Problems on Perfect Squares and Divisibility"
			},
			filePath: "https://wartets.github.io/assets/documents/Arithmetic_and_Number_Theory.pdf",
			categoryIds: [2],
			typeId: "exercise",
			authorIds: ["cbr"],
			tags: ["mathematics", "arithmetic", "number theory"],
			langId: "en",
			timestamp: "2025-12-17T23:42:50Z",
			show: true
		},
		{
			id: "doc-011",
			slug: "resolution-problemes-np-complets-monte-carlo",
			title: { fr: "Résolution de Problèmes NP-Complets par Méthodes de Monte Carlo", en: "Solving NP-Complete Problems Using Monte Carlo Methods" },
			description: {
				fr: "Application de l'algorithme de Metropolis-Hastings au Sudoku",
				en: "Application of the Metropolis-Hastings algorithm to Sudoku."
			},
			filePath: "https://wartets.github.io/assets/documents/sudoku_monte_carlo_np_complet.pdf",
			categoryIds: [2, 3],
			typeId: "paper",
			authorIds: ["cbr"],
			tags: ["mathematics", "computer science", "number theory"],
			langId: "fr",
			timestamp: "2026-01-06T23:27:23Z",
			show: true
		},
		{
			id: "doc-012",
			slug: "curiosites-gravitation-cylindrique",
			title: { fr: "Quelques Curiosités de la Gravitation Cylindrique", en: "Some Curiosities of Cylindrical Gravitation" },
			description: {
				fr: "Exploration théorique des structures de l'espace-temps, des effets de bord Newtoniens aux singularités relativistes.",
				en: "Theoretical exploration of spacetime structures, from Newtonian edge effects to relativistic singularities."
			},
			filePath: "https://wartets.github.io/assets/documents/Gravitation_Cylindrique.pdf",
			categoryIds: [1],
			typeId: "theory",
			authorIds: ["cbr"],
			tags: ["physics", "relativity", "gravitation", "mathematics"],
			langId: "fr",
			timestamp: "2026-01-10T00:00:00Z",
			show: true
		},
		{
			id: "doc-013",
			slug: "factorielles",
			title: { fr: "Factorielles", en: "Factorials" },
			description: {
				fr: "Panorama des hiérarchies de croissance et des structures arithmétiques : des extensions analytiques aux factorielles exotiques",
				en: "An overview of growth hierarchies and arithmetic structures: from analytic extensions to exotic factorials."
			},
			filePath: "https://wartets.github.io/assets/documents/Factorielles.pdf",
			categoryIds: [2],
			typeId: "theory",
			authorIds: ["cbr"],
			tags: ["mathematics", "analysis", "combinatorics", "number theory"],
			langId: "fr",
			timestamp: "2026-01-23T21:42:00Z",
			show: true
		},
		{
			id: "doc-014",
			slug: "dynamique-horizons-apparents",
			title: { fr: "Dynamique des Horizons Apparents", en: "Dynamics of Apparent Horizons" },
			description: {
				fr: "Étude de la métrique de McVittie en régimes de Sitter, Fantôme, Rebond et Friedmann.",
				en: "Study of the McVittie metric in de Sitter, Phantom, Bounce, and Friedmann regimes."
			},
			filePath: "https://wartets.github.io/assets/documents/Dynamique_des_Horizons_Apparents.pdf",
			categoryIds: [1, 13],
			typeId: "theory",
			authorIds: ["cbr"],
			tags: ["physics", "relativity", "cosmology", "black holes"],
			langId: "fr",
			timestamp: "2026-01-08T18:12:00Z",
			show: true
		},
		{
			id: "doc-015",
			slug: "probabilites-galettes-des-rois",
			title: { fr: "Probabilités et Galettes des rois", en: "Probability and the King Cake" },
			description: {
				fr: "Étude géométrique du découpage de la Galette des Rois : quantification du risque d'intersection avec la fève et analyse de la sensibilité au centrage (paradoxe de la maladresse).",
				en: "A geometric study of slicing the King Cake: quantifying the risk of intersecting the trinket and analyzing sensitivity to centering (the clumsiness paradox)."
			},
			filePath: "https://wartets.github.io/assets/documents/Probabilités_et_Galettes_des_rois.pdf",
			categoryIds: [2],
			typeId: "exercise",
			authorIds: ["cbr"],
			tags: ["mathematics", "probability", "geometry", "calculus"],
			langId: "fr",
			timestamp: "2026-01-10T14:00:00Z",
			show: true
		},
		{
			id: "doc-016",
			slug: "dynamique-systemes-particules-milieu-confine",
			title: { fr: "Dynamique des Systèmes de Particules en Milieu Confiné", en: "Dynamics of Particle Systems in Confined Media" },
			description: {
				fr: "Du problème classique des fourmis sur une règle (1D) à l'analyse statistique de la diffusion et du temps de sortie dans un carré (2D).",
				en: "From the classic problem of ants on a ruler (1D) to the statistical analysis of diffusion and exit time in a square (2D)."
			},
			filePath: "https://wartets.github.io/assets/documents/Fourmis.pdf",
			categoryIds: [1, 2],
			typeId: "theory",
			authorIds: ["cbr"],
			tags: ["physics", "statistical mechanics", "diffusion", "probability"],
			langId: "fr",
			timestamp: "2026-01-15T12:00:00Z",
			show: true
		},
		{
			id: "doc-017",
			slug: "determination-enveloppe-de-surete",
			title: { fr: "Détermination de l'Enveloppe de Sûreté", en: "Determination of the Safety Envelope" },
			description: {
				fr: "Étude comparative des trajectoires balistiques dans le vide et en milieu fluide linéaire : équations horaires et parabole de sûreté.",
				en: "A comparative study of ballistic trajectories in vacuum and in a linear fluid medium: equations of motion and the safety parabola."
			},
			filePath: "https://wartets.github.io/assets/documents/Enveloppe_de_Surete.pdf",
			categoryIds: [1],
			typeId: "theory",
			authorIds: ["cbr"],
			tags: ["physics", "mechanics", "ballistics", "kinematics"],
			langId: "fr",
			timestamp: "2026-01-16T02:00:00Z",
			show: true
		},
		{
			id: "doc-018",
			slug: "etude-cinematique-ellipse-roulante",
			title: { fr: "Étude Cinématique d'une Ellipse Roulante", en: "Kinematic Study of a Rolling Ellipse" },
			description: {
				fr: "Détermination des trajectoires d'un point du contour et du foyer (ondulaire) et lien avec les surfaces de Delaunay.",
				en: "Determination of the trajectories of a point on the contour and of the focus (wave-like curve), and connection to Delaunay surfaces."
			},
			filePath: "https://wartets.github.io/assets/documents/Cinematique_Ellipse.pdf",
			categoryIds: [1, 2],
			typeId: "theory",
			authorIds: ["cbr"],
			tags: ["physics", "mathematics", "geometry", "kinematics"],
			langId: "fr",
			timestamp: "2026-01-16T10:00:00Z",
			show: true
		},
		{
			id: "doc-019",
			slug: "analyse-systeme-granulaire-discret",
			title: { fr: "Analyse d'un Système Granulaire Discret", en: "Analysis of a Discrete Granular System" },
			description: {
				fr: "Document illustrant l'analyse théorique des systèmes granulaires discrets, avec des exemples de formalismes mathématiques, d'algorithmes et de mise en page scientifique.",
				en: "A document illustrating the theoretical analysis of discrete granular systems, with examples of mathematical formalisms, algorithms, and scientific layout."
			},
			filePath: "https://wartets.github.io/assets/documents/Système_granulaire_discret.pdf",
			categoryIds: [1, 2, 3],
			typeId: "paper",
			authorIds: ["cbr"],
			tags: ["physics", "granular matter", "mathematics", "simulation"],
			langId: "fr",
			timestamp: "2026-01-17T01:00:00Z",
			show: true
		},
		{
			id: "doc-020",
			slug: "modelisation-analytique-impact-jet-ressaut-hydraulique",
			title: { fr: "Modélisation Analytique de l'Impact d'un Jet et du Ressaut Hydraulique", en: "Analytical Modeling of Jet Impact and the Hydraulic Jump" },
			description: {
				fr: "Étude des régimes stationnaires et de la dynamique transitoire d'expansion. Modélisation de l'évolution du rayon du cratère formé par un jet vertical.",
				en: "Study of steady-state regimes and the transient expansion dynamics. Modeling of the evolution of the crater radius formed by a vertical jet."
			},
			filePath: "https://wartets.github.io/assets/documents/Impact_jet_eau.pdf",
			categoryIds: [1],
			typeId: "theory",
			authorIds: ["cbr"],
			tags: ["physics", "fluid dynamics", "mechanics"],
			langId: "fr",
			timestamp: "2026-01-17T15:27:00Z",
			show: true
		},
		{
			id: "doc-021",
			slug: "real-time-web-cfd-lattice-boltzmann",
			title: { fr: "Dynamique des Fluides Interactive en Temps Réel sur le Web", en: "Real-Time Interactive Fluid Dynamics on the Web" },
			description: {
				fr: "Une approche multiphysique par la méthode de Boltzmann sur réseau utilisant WebAssembly et WebGL2. Étude technique sur l'implémentation d'un moteur CFD haute performance, incluant la turbulence LES et la rhéologie non-newtonienne.",
				en: "A Multiphysics Lattice Boltzmann Approach using WebAssembly and WebGL2. Technical study on high-performance CFD engine implementation, including LES turbulence and non-Newtonian rheology."
			},
			filePath: "https://wartets.github.io/assets/documents/Turbulence-sim.pdf",
			categoryIds: [1, 2, 3, 7],
			typeId: "paper",
			authorIds: ["cbr"],
			tags: ["physics", "fluid dynamics", "CFD", "WASM", "WebGL", "LBM", "turbulence", "numerical methods"],
			langId: "en",
			timestamp: "2026-01-23T10:00:00Z",
			show: true
		},
		{
			id: "doc-022",
			slug: "analyse-algebrique-derivees-n-iemes",
			title: { fr: "Analyse Algébrique des Dérivées n-ièmes", en: "Algebraic Analysis of n-th Derivatives" },
			description: {
				fr: "Étude structurelle des fonctions homogènes singulières sans simplification. Analyse de la propagation des termes algébriques, lien avec les polynômes de Gegenbauer et émergence distributionnelle.",
				en: "A structural study of singular homogeneous functions without simplification. Analysis of the propagation of algebraic terms, connection to Gegenbauer polynomials, and distributional emergence."
			},
			filePath: "https://wartets.github.io/assets/documents/Derivees_de_abs.pdf",
			categoryIds: [2],
			typeId: "theory",
			authorIds: ["cbr"],
			tags: ["mathematics", "analysis", "calculus", "Gegenbauer", "distributions"],
			langId: "fr",
			timestamp: "2026-02-03T21:35:00Z",
			show: true
		},
		{
			id: "doc-023",
			slug: "advanced-course-gaussian-primes",
			title: { fr: "Cours Avancé sur les Nombres Premiers de Gauss", en: "Advanced Course on Gaussian Primes" },
			description: {
				fr: "Des fondements aux applications modernes. Un exposé mathématique complet sur l'anneau des entiers de Gauss, couvrant la classification des nombres premiers, la théorie des idéaux, la fonction zêta de Dedekind, les équations diophantiennes et les applications modernes en cryptographie et en physique.",
				en: "From Foundations to Modern Applications. A comprehensive mathematical exposition on the ring of Gaussian integers, covering prime classification, ideal theory, the Dedekind zeta function, Diophantine equations, and modern applications in cryptography and physics."
			},
			filePath: "https://wartets.github.io/assets/documents/Gaussian_primes.pdf",
			categoryIds: [1, 2, 3],
			typeId: "course",
			authorIds: ["cbr"],
			tags: ["mathematics", "number theory", "algebra", "analytic number theory", "cryptography", "physics"],
			langId: "en",
			timestamp: "2026-02-28T12:06:00Z",
			show: true
		},
		{
			id: "doc-024",
			slug: "geometrie-equilibre-fluide-ndim",
			title: { fr: "Géométrie d'équilibre d'un fluide auto-gravitant en dimension N", en: "Equilibrium Geometry of a Self-Gravitating Fluid in N Dimensions" },
			description: {
				fr: "Preuve variationnelle et analyse hydrostatique : application de l'inégalité de réarrangement de Riesz pour démontrer la forme sphérique d'équilibre.",
				en: "A variational proof and hydrostatic analysis: applying the Riesz rearrangement inequality to demonstrate the spherical equilibrium shape."
			},
			filePath: "https://wartets.github.io/assets/documents/Géométrie_équilibre_fluide_Ndim.pdf",
			categoryIds: [1, 2],
			typeId: "theory",
			authorIds: ["cbr"],
			tags: ["physics", "mathematics", "geometry", "gravitation", "fluid dynamics"],
			langId: "fr",
			timestamp: "2026-03-08T20:59:00Z",
			show: true
		},
		{
			id: "doc-025",
			slug: "modelisation-solidification-fluide-conduite-inclinee",
			title: { fr: "Modélisation de la Solidification d'un Fluide en Conduite Inclinée", en: "Modeling the Solidification of a Fluid in an Inclined Pipe" },
			description: {
				fr: "Étude thermodynamique et mécanique des fluides en régime permanent. Analyse des conditions d'apparition et du temps caractéristique de solidification selon l'inclinaison.",
				en: "A thermodynamic and fluid mechanics study under steady-state conditions. Analysis of the onset conditions and characteristic solidification time as a function of inclination."
			},
			filePath: "https://wartets.github.io/assets/documents/Solidification_liquide_en_mouvement.pdf",
			categoryIds: [1],
			typeId: "theory",
			authorIds: ["cbr"],
			tags: ["physics", "fluid dynamics", "thermodynamics", "mechanics"],
			langId: "fr",
			timestamp: "2026-03-11T10:00:00Z",
			show: true
		},
		{
			id: "doc-026",
			slug: "modelisation-statistique-probabiliste-phenomenes-bimodaux",
			title: { fr: "Modélisation Statistique et Probabiliste de Phénomènes Bimodaux", en: "Statistical and Probabilistic Modeling of Bimodal Phenomena" },
			description: {
				fr: "Analyse comparative entre biais de sélection (distributions pondérées pour les débits Wi-Fi) et processus additifs de mélange (trafic routier journalier).",
				en: "A comparative analysis between selection bias (weighted distributions for Wi-Fi throughput) and additive mixing processes (daily road traffic)."
			},
			filePath: "https://wartets.github.io/assets/documents/Mesure_de_debit_de_reseau_et_trafic_routier.pdf",
			categoryIds: [2],
			typeId: "theory",
			authorIds: ["cbr"],
			tags: ["mathematics", "statistics", "probability", "modeling"],
			langId: "fr",
			timestamp: "2026-03-11T14:30:00Z",
			show: true
		},
		{
			id: "doc-027",
			slug: "construction-progressive-modele-standard",
			title: { fr: "Construction progressive du Modèle Standard", en: "Progressive Construction of the Standard Model" },
			description: {
				fr: "Des symétries physiques aux groupes SU(N). Formalisation de la transition conceptuelle des symétries globales vers les théories de jauge non-abéliennes et mécanisme de Higgs.",
				en: "From physical symmetries to SU(N) groups. Formalizing the conceptual transition from global symmetries to non-abelian gauge theories and the Higgs mechanism."
			},
			filePath: "https://wartets.github.io/assets/documents/Construction_Modele_Standard.pdf",
			categoryIds: [1, 2],
			typeId: "course",
			authorIds: ["cbr"],
			tags: ["physics", "quantum", "particle physics", "mathematics", "algebra"],
			langId: "fr",
			timestamp: "2026-03-10T09:00:00Z",
			show: true
		},
		{
			id: "doc-028",
			slug: "introduction-physique-quantique-materiaux",
			title: { fr: "Introduction à la physique quantique des matériaux", en: "Introduction to the Quantum Physics of Materials" },
			description: {
				fr: "Cours de Matière Condensée abordant l'électron comme objet quantique, la dualité onde-corpuscule, les modèles de Drude et Sommerfeld, et une introduction à la supraconductivité.",
				en: "A Condensed Matter course addressing the electron as a quantum object, wave-particle duality, the Drude and Sommerfeld models, and an introduction to superconductivity."
			},
			filePath: "https://wartets.github.io/assets/documents/Cours_Matière_Condensée_1.pdf",
			categoryIds: [1],
			typeId: "course",
			authorIds: ["cbr"],
			tags: ["physics", "quantum", "condensed matter", "solid state", "materials", "lesson"],
			langId: "fr",
			timestamp: "2026-03-11T22:33:00Z",
			show: true
		},
		{
			id: "doc-029",
			slug: "geometrie-cinematique-multi-spheres",
			title: { fr: "Géométrie et Cinématique Multi-Sphères", en: "Multi-Sphere Geometry and Kinematics" },
			description: {
				fr: "Étude Analytique des Faisceaux Coniques et de leurs Empreintes Topologiques. Application au calcul exact de la fraction de remplissage lunaire observée depuis un point terrestre.",
				en: "An analytical study of conical beams and their topological footprints. Application to the exact calculation of the observed lunar fill fraction from a terrestrial point."
			},
			filePath: "https://wartets.github.io/assets/documents/phase_de_lune.pdf",
			categoryIds: [1, 2, 13],
			typeId: "theory",
			authorIds: ["cbr"],
			tags: ["physics", "mathematics", "geometry", "kinematics", "topology", "astronomy"],
			langId: "fr",
			timestamp: "2026-04-14T00:00:00Z",
			show: true
		},
		{
			id: "doc-030",
			slug: "rapport-stage-MPQ-QITE-2026",
			title: { fr: "Sources AlGaAs de photons intriqués pour les communications quantiques", en: "AlGaAs Entangled Photon Sources for Quantum Communications" },
			description: {
				fr: "Rapport de stage sur la participation à une expérience de distribution de photons intriqués sur réseau de fibres déployé.",
				en: "Internship report on participating in an entangled photon distribution experiment over a deployed fiber network."
			},
			filePath: "https://wartets.github.io/assets/documents/Rapport_Stage_MPQ_QITE_2026.pdf",
			categoryIds: [1, 3],
			typeId: "paper",
			authorIds: ["cbr"],
			tags: ["physics", "quantum", "communication", "lecture"],
			langId: "fr",
			timestamp: "2026-06-29T09:00:00Z",
			show: true
		},
	]
};
