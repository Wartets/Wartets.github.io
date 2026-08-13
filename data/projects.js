const projects = [
	{
		title: { en: "Lenia GPU Simulator", fr: "Simulateur Lenia GPU" },
		timestamp: "2026-03-01T13:24:00Z",
		github: "https://github.com/Wartets/Lenia",
		description: {
			en: "A high-performance, real-time Lenia simulator powered by C++20 and OpenGL compute shaders. Explore complex artificial life with 500+ pre-loaded species and multichannel dynamics at massive scales.",
			fr: "Un simulateur Lenia temps réel haute performance, propulsé par C++20 et des compute shaders OpenGL. Explorez une vie artificielle complexe avec plus de 500 espèces préchargées et une dynamique multicanal à très grande échelle."
		},
		longDescription: {
			en: "This project is a state-of-the-art implementation of Lenia, a continuous cellular automaton that produces lifelike emergent behaviors. Built for extreme performance, the engine utilizes a 'Zero-Copy' architecture where the entire simulation state lives in VRAM, leveraging OpenGL 4.6 compute shaders to achieve throughputs exceeding 10 Gcells/s. It features a massive library of 548 pre-loaded species (including Orbium and Scutium), support for multichannel RGB dynamics, and 11 distinct growth functions. The application includes professional analysis tools for centroid tracking, stability monitoring, and real-time performance metrics, all accessible through a highly customizable, detachable ImGui interface. It bridges the gap between mathematical research and interactive artistic exploration.",
			fr: "Ce projet est une implémentation de pointe de Lenia, un automate cellulaire continu produisant des comportements émergents proches du vivant. Conçu pour une performance extrême, le moteur repose sur une architecture 'Zero-Copy' où l'intégralité de l'état de simulation réside en VRAM, exploitant les compute shaders OpenGL 4.6 pour dépasser 10 Gcells/s. Il embarque une bibliothèque de 548 espèces préchargées (dont Orbium et Scutium), une dynamique RGB multicanal, et 11 fonctions de croissance distinctes. L'application propose des outils d'analyse professionnels pour le suivi de centroïde, la surveillance de stabilité et des métriques de performance en temps réel, accessibles via une interface ImGui détachable et hautement personnalisable. Il relie recherche mathématique et exploration artistique interactive."
		},
		icon: "../assets/images/card/Lenia-card.png",
		image: "../assets/images/card/Lenia-card.png",
		link: "https://wartets.github.io/Lenia/docs/",
		keywords: ["simulation", "physics", "c++", "opengl", "gpu-acceleration", "artificial-life", "cellular-automata", "high-performance"],
		languages: ["en", "fr"],
		show: true
	},
	{
		title: { en: "Turbulence Simulation", fr: "Simulation de Turbulence" },
		timestamp: "2026-02-01T09:43:58Z",
		github: "https://github.com/wartets/Turbulence-sim",
		description: {
			en: "A high-performance 2D fluid dynamics simulation running in the browser. Powered by a C++/WebAssembly engine using the Lattice Boltzmann Method, it features multi-threading, WebGL2 rendering, and advanced physics models.",
			fr: "Une simulation de dynamique des fluides 2D haute performance s'exécutant dans le navigateur. Propulsée par un moteur C++/WebAssembly utilisant la méthode de Boltzmann sur réseau, elle intègre multithreading, rendu WebGL2 et modèles physiques avancés."
		},
		longDescription: {
			en: "A high-performance 2D fluid dynamics simulation that brings complex turbulence models to the web. The core of the simulation is a C++ engine compiled to WebAssembly, utilizing the Lattice Boltzmann Method (LBM) for computational efficiency. The engine is multi-threaded to leverage modern hardware, ensuring smooth, real-time interaction. It supports a wide range of physical phenomena, including buoyancy, vorticity confinement, Large Eddy Simulation (LES) via the Smagorinsky model, and non-Newtonian fluid rheology. Users can interact with the fluid through a customizable brush system and visualize various fields like velocity, vorticity, and pressure. The rendering is handled by a custom WebGL2 engine, complete with particle advection and post-processing filters, making it a powerful tool for both education and artistic exploration.",
			fr: "Une simulation de dynamique des fluides 2D haute performance amenant des modèles de turbulence complexes sur le web. Le cœur du moteur est écrit en C++ et compilé en WebAssembly, utilisant la méthode de Boltzmann sur réseau (LBM) pour son efficacité de calcul. Le moteur est multithreadé pour exploiter le matériel moderne et garantir une interaction fluide en temps réel. Il prend en charge un large éventail de phénomènes physiques : flottabilité, confinement de vorticité, simulation des grandes échelles (LES) via le modèle de Smagorinsky, et rhéologie de fluides non newtoniens. Les utilisateurs interagissent avec le fluide via un système de pinceau personnalisable et visualisent différents champs (vitesse, vorticité, pression). Le rendu repose sur un moteur WebGL2 sur mesure, avec advection de particules et filtres de post-traitement."
		},
		icon: "../assets/images/card/Turbulence-sim-card.png",
		image: "../assets/images/card/Turbulence-sim-card.png",
		link: "https://github.com/Wartets/Turbulence-sim/blob/main/README.md",
		keywords: ["simulation", "physics", "webassembly", "c++", "webgl", "interactive", "lbm", "fluid-dynamics", "multithreading"],
		languages: ["en"],
		show: true
	},
	{
		title: { en: "TikZ Generator", fr: "Générateur TikZ" },
		timestamp: "2026-01-16T09:43:58Z",
		github: "https://github.com/wartets/TikZ-Generator",
		description: {
			en: "A powerful visual editor for generating TikZ code for LaTeX documents. Create diagrams, electric circuits, and geometric figures intuitively and export the code in real-time.",
			fr: "Un éditeur visuel puissant pour générer du code TikZ pour vos documents LaTeX. Créez des diagrammes, des circuits électriques et des figures géométriques intuitivement et exportez le code en temps réel."
		},
		longDescription: {
			en: "TikZ Generator is a comprehensive web-based tool designed to bridge the gap between visual drawing and LaTeX coding. It provides an intuitive canvas where users can draw geometric shapes, arrows, and complex diagrams using a variety of tools. The application features specialized libraries for drawing electric circuits (using Circuitikz), optics, logic gates, and flowcharts. As you draw, the application generates clean, copy-paste ready TikZ code in real-time. Key features include freehand drawing with smoothing, a robust property editor for styling (colors, line styles, arrows), undo/redo functionality, and local state persistence. It is an essential utility for students, teachers, and researchers who need to incorporate high-quality vector graphics into their LaTeX documents without writing code from scratch.",
			fr: "TikZ Generator est un outil web complet conçu pour combler l'écart entre le dessin visuel et l'écriture de code LaTeX. Il offre un canevas intuitif permettant de dessiner des formes géométriques, des flèches et des diagrammes complexes à l'aide de nombreux outils. L'application propose des bibliothèques spécialisées pour dessiner des circuits électriques (via Circuitikz), de l'optique, des portes logiques et des organigrammes. Au fil du dessin, l'application génère un code TikZ propre et prêt à être copié en temps réel. Parmi les fonctionnalités clés : dessin à main levée avec lissage, éditeur de propriétés robuste pour le style (couleurs, styles de traits, flèches), historique annuler/rétablir et persistance locale de l'état. C'est un outil essentiel pour les étudiants, enseignants et chercheurs souhaitant intégrer des graphiques vectoriels de haute qualité dans leurs documents LaTeX sans écrire de code à la main."
		},
		icon: "../assets/images/card/TikZ-Generator-card.png",
		image: "../assets/images/card/TikZ-Generator-card.png",
		link: "https://wartets.github.io/TikZ-Generator/",
		keywords: ["tool", "latex", "tikz", "visual-editor", "diagrams", "educational"],
		languages: ["en", "fr", "es", "de"],
		show: true
	},
	{
		title: { en: "Document Library", fr: "Bibliothèque de Documents" },
		timestamp: "2025-08-10T00:00:00Z",
		github: "https://github.com/library",
		description: {
			en: "Interactive digital library for academic notes and papers. Features a custom PDF viewer, real-time search, and dynamic filtering.",
			fr: "Bibliothèque numérique interactive pour notes et rapports académiques. Dotée d'un lecteur PDF personnalisé, d'une recherche en temps réel et d'un filtrage dynamique."
		},
		longDescription: {
			en: "A comprehensive digital archive designed to organize and present academic notes, research papers, and personal documents. The application features a custom-built PDF viewer with lazy loading and preview generation, ensuring a seamless reading experience directly in the browser. It incorporates advanced filtering, sorting, and fuzzy search capabilities to efficiently navigate through categories like Physics, Mathematics, and Computer Science.",
			fr: "Une archive numérique complète conçue pour organiser et présenter des notes académiques, des rapports de recherche et des documents personnels. L'application propose un lecteur PDF sur mesure avec chargement différé et génération d'aperçus, garantissant une expérience de lecture fluide directement dans le navigateur. Elle intègre un filtrage avancé, un tri et une recherche approximative pour naviguer efficacement entre les catégories comme Physique, Mathématiques et Informatique."
		},
		icon: "../assets/images/card/Document-Library-card.png",
		image: "../assets/images/card/Document-Library-card.png",
		link: "https://wartets.github.io/library/index.html",
		keywords: ["tool", "interactive", "educational", "physics", "math", "visualization"],
		languages: ["en", "fr"],
		show: true
	},
	{
		title: { en: "Thought's Library", fr: "Bibliothèque de Pensées" },
		timestamp: "2026-01-14T00:00:00Z",
		github: "https://github.com/Wartets/poetry/index.html",
		description: {
			en: "Library of all my poems and thoughts, presented in an interactive web format. Organized for easy navigation with features like categorization by theme and search functionality.",
			fr: "Bibliothèque de tous mes poèmes et pensées, présentée dans un format web interactif. Organisée pour une navigation facile avec catégorisation par thème et fonction de recherche."
		},
		longDescription: {
			en: "A digital collection of personal poems and thoughts, presented in an interactive web format. This project serves as a creative outlet and a way to share reflections, ideas, and literary works with others. The library is organized for easy navigation and includes features such as categorization by theme, search functionality, and a visually appealing design that enhances the reading experience.",
			fr: "Une collection numérique de poèmes et pensées personnels, présentée dans un format web interactif. Ce projet sert d'exutoire créatif et de moyen de partager réflexions, idées et œuvres littéraires. La bibliothèque est organisée pour une navigation facile et propose une catégorisation par thème, une fonction de recherche et un design soigné qui enrichit l'expérience de lecture."
		},
		icon: "../assets/images/card/Thoughts-Library-card.png",
		image: "../assets/images/card/Thoughts-Library-card.png",
		link: "https://wartets.github.io/poetry/",
		keywords: ["poetry", "thoughts", "library"],
		languages: ["en", "fr"],
		show: false
	},
	{
		title: { en: "N-Body-Simulation", fr: "Simulation à N-Corps" },
		timestamp: "2026-01-01T08:00:00Z",
		github: "https://github.com/wartets/N-Body-Simulation",
		description: {
			en: "An advanced physics sandbox for simulating N-body systems with gravity, electromagnetism, and collisions. Features extensive tools for creating, modifying, and analyzing complex cosmic scenarios in real-time.",
			fr: "Un bac à sable physique avancé pour simuler des systèmes à N corps avec gravité, électromagnétisme et collisions. Doté d'outils complets pour créer, modifier et analyser des scénarios cosmiques complexes en temps réel."
		},
		longDescription: {
			en: "An advanced physics sandbox for simulating N-body systems under various physical laws. This feature-rich simulation allows users to model gravitational, electric, and magnetic interactions with high precision. It incorporates a Barnes-Hut algorithm for efficient long-range force calculation, enabling large-scale simulations. The engine supports elastic bonds, solid barriers, and various environmental zones like viscosity, thermal, and custom force fields. Advanced features include body fragmentation, thermodynamic properties, and a complete undo/redo history for all actions. The highly interactive interface provides real-time control over every simulation parameter, body property, and environmental effect, making it a powerful tool for both educational exploration and complex cosmic experimentation.",
			fr: "Un bac à sable physique avancé pour simuler des systèmes à N corps sous diverses lois physiques. Cette simulation riche en fonctionnalités permet de modéliser avec précision les interactions gravitationnelles, électriques et magnétiques. Elle intègre un algorithme de Barnes-Hut pour un calcul efficace des forces à longue portée, permettant des simulations à grande échelle. Le moteur prend en charge les liaisons élastiques, les barrières solides et diverses zones environnementales telles que viscosité, thermique et champs de force personnalisés. Les fonctionnalités avancées incluent la fragmentation des corps, les propriétés thermodynamiques et un historique annuler/rétablir complet. L'interface hautement interactive offre un contrôle en temps réel sur chaque paramètre de simulation, propriété de corps et effet environnemental, en faisant un outil puissant tant pour l'exploration pédagogique que pour l'expérimentation cosmique complexe."
		},
		icon: "../assets/images/card/N-Body-Simulation-card.png",
		image: "../assets/images/card/N-Body-Simulation-card.png",
		link: "https://wartets.github.io/N-Body-Simulation/",
		keywords: ["simulation", "physics", "n-body", "interactive", "visualization", "sandbox"],
		languages: ["en"],
		show: true
	},
	{
		title: { en: "FDTD Wave Simulator", fr: "Simulateur d'Ondes FDTD" },
		timestamp: "2025-12-01T08:00:01Z",
		github: "https://github.com/wartets/FDTD-Wave-Simulator",
		description: {
			en: "A web-based simulator for 2D wave propagation using the FDTD method. Visualize phenomena like interference and reflection with interactive tools for sources, obstacles, and boundary conditions.",
			fr: "Un simulateur web de propagation d'ondes 2D utilisant la méthode FDTD. Visualisez des phénomènes comme l'interférence et la réflexion grâce à des outils interactifs pour sources, obstacles et conditions aux limites."
		},
		longDescription: {
			en: "This project is a high-performance numerical simulator that models and visualizes 2D scalar wave propagation using the Finite-Difference Time-Domain (FDTD) method. The application features a client-server architecture where a powerful Python backend (using Flask and SocketIO) handles the complex physics calculations, while a responsive JavaScript frontend provides real-time visualization and an interactive user interface. Users can explore wave phenomena like interference, reflection, and diffraction by drawing wave sources and obstacles directly onto the grid. The simulation is highly configurable, offering control over grid dimensions, wave speed, and various boundary conditions—including fixed (Dirichlet), periodic, reflecting (Neumann), and absorbing (Mur). The dynamic visualization uses a selectable colormap that can be normalized in real-time, providing a clear and intuitive representation of wave amplitude. It serves as an excellent educational tool for students and enthusiasts to explore the principles of wave physics.",
			fr: "Ce projet est un simulateur numérique haute performance qui modélise et visualise la propagation d'ondes scalaires 2D grâce à la méthode des différences finies dans le domaine temporel (FDTD). L'application repose sur une architecture client-serveur où un backend Python puissant (utilisant Flask et SocketIO) gère les calculs physiques complexes, tandis qu'un frontend JavaScript réactif fournit une visualisation en temps réel et une interface interactive. Les utilisateurs peuvent explorer des phénomènes ondulatoires comme l'interférence, la réflexion et la diffraction en dessinant directement des sources d'ondes et des obstacles sur la grille. La simulation est hautement configurable, offrant un contrôle sur les dimensions de la grille, la vitesse des ondes et diverses conditions aux limites — fixes (Dirichlet), périodiques, réfléchissantes (Neumann) et absorbantes (Mur). La visualisation dynamique utilise une palette de couleurs sélectionnable pouvant être normalisée en temps réel, offrant une représentation claire et intuitive de l'amplitude des ondes. C'est un excellent outil pédagogique pour explorer les principes de la physique ondulatoire."
		},
		icon: "../assets/images/card/FDTD-Wave-Simulator-card.png",
		image: "../assets/images/card/FDTD-Wave-Simulator-card.png",
		link: "https://wartets.github.io/FDTD-Wave-Simulator/",
		keywords: ["simulation", "physics", "visualization", "interactive", "educational", "python"],
		languages: ["en"],
		show: true
	},
	{
		title: { en: "Origami", fr: "Origami" },
		timestamp: "2025-11-01T08:00:00Z",
		github: "https://github.com/wartets/Origami",
		description: {
			en: "An interactive web-based origami simulator to explore the mathematical axioms of paper folding. Create complex crease patterns, experiment with folds, and visualize the geometric principles behind the art of origami.",
			fr: "Un simulateur web interactif d'origami pour explorer les axiomes mathématiques du pliage de papier. Créez des motifs de plis complexes, expérimentez des pliages et visualisez les principes géométriques de l'art de l'origami."
		},
		longDescription: {
			en: "Origami is an advanced, interactive web-based simulator dedicated to exploring the mathematical principles of paper folding. The application provides a comprehensive toolset based on the seven Huzita-Hatori axioms, allowing users to construct complex crease patterns with geometric precision. Users create folds by selecting points and edges on virtual paper, with real-time visual feedback that includes construction lines and a preview of the resulting crease. The simulation engine accurately handles face splitting, vertex reflection, and the complex layering of paper that results from each fold. It also includes an undo/redo history, state persistence, an X-ray mode to see hidden layers, and the ability to import standard Crease Pattern (.cp) files. This project is both an educational tool for learning geometric constructions and a creative sandbox for origami enthusiasts and mathematicians.",
			fr: "Origami est un simulateur web interactif avancé dédié à l'exploration des principes mathématiques du pliage de papier. L'application propose un ensemble d'outils complets basés sur les sept axiomes de Huzita-Hatori, permettant de construire des motifs de plis complexes avec une précision géométrique. Les plis se créent en sélectionnant des points et des arêtes sur le papier virtuel, avec un retour visuel en temps réel incluant des lignes de construction et un aperçu du pli résultant. Le moteur de simulation gère avec précision la division des faces, la réflexion des sommets et le superposition complexe du papier résultant de chaque pli. Il inclut également un historique annuler/rétablir, une persistance de l'état, un mode radiographique pour voir les couches cachées, et la possibilité d'importer des fichiers Crease Pattern (.cp) standards. Ce projet est à la fois un outil pédagogique pour apprendre les constructions géométriques et un bac à sable créatif pour les passionnés d'origami et les mathématiciens."
		},
		icon: "../assets/images/card/Origami-card.png",
		image: "../assets/images/card/Origami-card.png",
		link: "https://wartets.github.io/Origami/",
		keywords: ["simulation", "math", "art", "tool", "interactive", "educational"],
		languages: ["en", "fr"],
		show: true
	},
	{
		title: { en: "Molecule Builder", fr: "Constructeur de Molécules" },
		timestamp: "2025-10-18T20:07:00Z",
		github: "https://github.com/wartets/Molecule-Builder",
		description: {
			en: "Interactive web-based tool that allows you to create, visualize, and manipulate 3D models of chemical molecules.",
			fr: "Outil web interactif permettant de créer, visualiser et manipuler des modèles 3D de molécules chimiques."
		},
		longDescription: {
			en: "This interactive web-based tool allows users to build, visualize, and manipulate 3D models of chemical molecules. With a user-friendly interface, you can add atoms, create and increment bonds, and view molecular representations such as the Van der Waals surface. The tool provides important information through features like the display of lone pairs and formal charges, which are essential for understanding chemical structures and reactivity. Users can manipulate the view by rotating, panning, and zooming, and they can move or delete atoms. This simulation focuses on providing a flexible and intuitive way to explore molecular geometry, making it a valuable educational resource for students and a useful tool for chemistry enthusiasts.",
			fr: "Cet outil web interactif permet de construire, visualiser et manipuler des modèles 3D de molécules chimiques. Grâce à une interface intuitive, on peut ajouter des atomes, créer et incrémenter des liaisons, et afficher différentes représentations moléculaires comme la surface de Van der Waals. L'outil fournit des informations essentielles à la compréhension des structures chimiques et de la réactivité, notamment l'affichage des doublets non liants et des charges formelles. La vue peut être manipulée par rotation, translation et zoom, et les atomes peuvent être déplacés ou supprimés. Cette simulation offre une approche flexible et intuitive de l'exploration de la géométrie moléculaire, en faisant une ressource pédagogique précieuse pour les étudiants et un outil utile pour les passionnés de chimie."
		},
		icon: "../assets/images/card/Molecule-Builder-card.png",
		image: "../assets/images/card/Molecule-Builder-card.png",
		link: "https://wartets.github.io/Molecule-Builder/",
		keywords: ["simulation", "chemistry", "3d", "visualization", "interactive", "educational"],
		languages: ["en"],
		show: true
	},
	{
		title: { en: "Computational Chemistry", fr: "Chimie Computationnelle" },
		timestamp: "2025-10-12T20:07:00Z",
		github: "https://github.com/wartets/ComputationalChemistry",
		description: {
			en: "This website is an interactive tool to explore molecular geometry. It shows how atoms and electrons arrange through simple forces like attraction and repulsion.",
			fr: "Ce site est un outil interactif d'exploration de la géométrie moléculaire, montrant comment atomes et électrons s'organisent sous l'effet de forces simples d'attraction et de répulsion."
		},
		longDescription: {
			en: "This website offers an interactive tool to explore molecular geometry by showing how atoms in a molecule arrange themselves based on fundamental forces like attraction and repulsion. Users can select from various pre-configured molecules, such as H₂O, CH₄, and CO₂, or even create their own custom molecules. The simulation visualizes electron clouds as a particle system, where thousands of particles are influenced by nuclei. Key simulation parameters—such as particle density, quantum constants, and repulsion forces—are adjustable, allowing users to observe how these changes impact the molecular structure. This tool provides an educational and interactive experience by illustrating how these fundamental principles determine molecular shape.",
			fr: "Ce site propose un outil interactif d'exploration de la géométrie moléculaire, montrant comment les atomes d'une molécule s'organisent sous l'effet de forces fondamentales d'attraction et de répulsion. Il est possible de sélectionner différentes molécules préconfigurées, comme H₂O, CH₄ ou CO₂, ou d'en créer de personnalisées. La simulation représente les nuages électroniques sous forme d'un système de particules, où des milliers de particules sont influencées par les noyaux. Les paramètres clés de la simulation, tels que la densité de particules, les constantes quantiques et les forces de répulsion, sont ajustables, ce qui permet d'observer leur impact sur la structure moléculaire. Cet outil offre une expérience pédagogique et interactive illustrant comment ces principes fondamentaux déterminent la forme des molécules."
		},
		icon: "../assets/images/card/ComputationalChemistry-card.png",
		image: "../assets/images/card/ComputationalChemistry-card.png",
		link: "https://wartets.github.io/ComputationalChemistry/",
		keywords: ["simulation", "chemistry", "physics", "visualization", "interactive", "educational"],
		languages: ["en"],
		show: true
	},
	{
		title: { en: "Match 3", fr: "Match 3" },
		timestamp: "2025-09-04T08:00:00Z",
		github: "https://github.com/wartets/Match3",
		description: {
			en: "A classic gem-matching puzzle game with smooth animations and swap mechanics. Create lines of three or more matching colors to score points in this implementation.",
			fr: "Un jeu de puzzle classique d'association de gemmes, avec animations fluides et mécanique d'échange. Alignez trois couleurs identiques ou plus pour marquer des points."
		},
		longDescription: {
			en: "A classic gem-matching puzzle game with smooth animations and swap mechanics. Create lines of three or more matching colors to score points in this implementation. This project delivers a traditional Match 3 game experience with polished visual and interactive elements.",
			fr: "Un jeu de puzzle classique d'association de gemmes, avec animations fluides et mécanique d'échange. Alignez trois couleurs identiques ou plus pour marquer des points dans cette implémentation. Ce projet propose une expérience de Match 3 traditionnelle, soignée sur le plan visuel et interactif."
		},
		icon: "../assets/images/card/Match3-card.png",
		image: "../assets/images/card/Match3-card.png",
		link: "https://wartets.github.io/Match3/",
		keywords: ["game", "puzzle", "match-3"],
		languages: ["en"],
		show: true
	},
	{
		title: { en: "Labyrinth", fr: "Labyrinthe" },
		timestamp: "2025-08-19T08:00:00Z",
		github: "https://github.com/wartets/Labyrinthe",
		description: {
			en: "This project explores maze solving through a highly customizable genetic/evolutionary algorithm approach.",
			fr: "Ce projet explore la résolution de labyrinthes via une approche par algorithme génétique/évolutionnaire hautement personnalisable."
		},
		longDescription: {
			en: "This project explores maze solving through a highly customizable genetic and evolutionary algorithm. It allows users to generate mazes using various algorithms—including DFS, Prim's, and Kruskal's—and provides precise control over labyrinth generation with parameters like maze size and opening percentages. The core of the project is the genetic algorithm used to find the solution, which can be fine-tuned with settings for population size, mutation rate, and elitism rate. The fitness function that guides the evolution of the solutions is also highly configurable, with weights for path length, distance to the exit and penalties for collisions. Advanced features, such as multiple crossover and mutation types, ensure a deep and adaptable maze-solving simulation. The project is an ideal platform for visualizing and understanding evolutionary computation in action.",
			fr: "Ce projet explore la résolution de labyrinthes à travers un algorithme génétique et évolutionnaire hautement personnalisable. Il permet de générer des labyrinthes via différents algorithmes (DFS, Prim, Kruskal) et offre un contrôle précis sur leur génération, avec des paramètres comme la taille ou le pourcentage d'ouvertures. Le cœur du projet repose sur l'algorithme génétique chargé de trouver la solution, réglable via la taille de la population, le taux de mutation et le taux d'élitisme. La fonction d'adaptation guidant l'évolution des solutions est elle aussi hautement configurable, avec des pondérations sur la longueur du chemin, la distance à la sortie et des pénalités de collision. Des fonctionnalités avancées, comme plusieurs types de croisement et de mutation, garantissent une simulation riche et adaptable. Le projet constitue une plateforme idéale pour visualiser et comprendre le calcul évolutionnaire en action."
		},
		icon: "../assets/images/card/Labyrinthe-card.png",
		image: "../assets/images/card/Labyrinthe-card.png",
		link: "https://wartets.github.io/Labyrinthe/",
		keywords: ["simulation", "ai", "genetic-algorithm", "pathfinding", "maze"],
		languages: ["fr"],
		show: true
	},
	{
		title: { en: "Highways", fr: "Autoroutes" },
		timestamp: "2025-08-13T08:00:00Z",
		github: "https://github.com/wartets/Autoroutes",
		description: {
			en: "A web simulation that procedurally generates a highway system. It uses simple rules to create a complex, winding road network, showcasing how basic algorithms can lead to intricate, emergent patterns.",
			fr: "Une simulation web générant procéduralement un réseau autoroutier. Des règles simples produisent un réseau routier complexe et sinueux, illustrant comment des algorithmes basiques peuvent créer des motifs émergents intriqués."
		},
		longDescription: {
			en: "A web simulation that procedurally generates a highway system. It uses simple rules to create a complex, winding road network, showcasing how basic algorithms can lead to intricate, emergent patterns. This project serves as a clear and pedagogical tool for visualizing emergent complexity.",
			fr: "Une simulation web générant procéduralement un réseau autoroutier. Des règles simples produisent un réseau routier complexe et sinueux, illustrant comment des algorithmes basiques peuvent créer des motifs émergents intriqués. Ce projet sert d'outil clair et pédagogique pour visualiser la complexité émergente."
		},
		icon: "../assets/images/card/Autoroutes-card.png",
		image: "../assets/images/card/Autoroutes-card.png",
		link: "https://wartets.github.io/Autoroutes/",
		keywords: ["simulation", "procedural-generation", "visualization", "emergence"],
		languages: ["fr"],
		show: true
	},
	{
		title: { en: "Diffusion-Limited Aggregation", fr: "Agrégation Limitée par Diffusion" },
		timestamp: "2025-08-03T08:00:00Z",
		github: "https://github.com/wartets/Diffusion-Limited-Aggregation",
		description: {
			en: "An interactive simulation of Diffusion-Limited Aggregation (DLA) exploring how Brownian motion creates complex fractal structures. Features distinct modes for classic radial growth and mobile cluster aggregation.",
			fr: "Une simulation interactive d'agrégation limitée par diffusion (DLA) explorant comment le mouvement brownien engendre des structures fractales complexes, avec des modes distincts de croissance radiale classique et d'agrégation de clusters mobiles."
		},
		longDescription: {
			en: "This project provides a comprehensive numerical simulation of Diffusion-Limited Aggregation (DLA), a process where particles undergoing Brownian motion cluster together to form fractals. The application offers a deep dive into statistical physics with two distinct simulation modes: the 'Classic' mode, showcasing radial dendritic growth from a fixed seed, and a 'Mobile Aggregates' mode, where multiple clusters diffuse and coalesce based on their mass. It features real-time analysis tools that calculate the fractal dimension and the radius of gyration. With adjustable parameters for particle density, diffusion speed, and seed configuration, this tool serves as an interactive laboratory for exploring self-similarity and pattern formation in non-equilibrium systems.",
			fr: "Ce projet propose une simulation numérique complète de l'agrégation limitée par diffusion (DLA), un processus où des particules en mouvement brownien s'agrègent pour former des fractales. L'application offre une immersion en physique statistique avec deux modes distincts : le mode 'Classique', illustrant une croissance dendritique radiale à partir d'une graine fixe, et le mode 'Agrégats mobiles', où plusieurs amas diffusent et fusionnent selon leur masse. Des outils d'analyse en temps réel calculent la dimension fractale et le rayon de giration. Grâce à des paramètres ajustables de densité de particules, de vitesse de diffusion et de configuration des graines, cet outil constitue un laboratoire interactif pour explorer l'auto-similarité et la formation de motifs dans les systèmes hors équilibre."
		},
		icon: "../assets/images/card/DLA-card.png",
		image: "../assets/images/card/DLA-card.png",
		link: "https://wartets.github.io/Diffusion-Limited-Aggregation/",
		keywords: ["simulation", "physics", "fractals", "brownian-motion", "interactive", "educational"],
		languages: ["fr"],
		show: true
	},
	{
		title: { en: "Mercury-Redstone", fr: "Mercury-Redstone" },
		timestamp: "2025-07-07T08:00:00Z",
		github: "https://github.com/wartets/Mercury",
		description: {
			en: "Simulation of the May 5, 1961 Mercury-Redstone mission.",
			fr: "Simulation de la mission Mercury-Redstone du 5 mai 1961."
		},
		longDescription: {
			en: "This project is a detailed simulation of the May 5, 1961 Mercury-Redstone mission, known as Freedom 7, which was the first American human spaceflight, piloted by astronaut Alan Shepard. The simulation displays key flight data, including altitude, speed, and g-force, and plots the flight's trajectory and acceleration profile in real time. Mission objectives—such as testing the capsule's systems, manual controls, and heat shield, as well as studying the effects of weightlessness—are central to this interactive experience. The simulation is based on the actual stats of the mission, which achieved an altitude of 187 km.",
			fr: "Ce projet est une simulation détaillée de la mission Mercury-Redstone du 5 mai 1961, connue sous le nom de Freedom 7, premier vol spatial habité américain, piloté par l'astronaute Alan Shepard. La simulation affiche les données de vol clés (altitude, vitesse, accélération en g) et trace en temps réel la trajectoire et le profil d'accélération du vol. Les objectifs de la mission — tester les systèmes de la capsule, les commandes manuelles et le bouclier thermique, ainsi qu'étudier les effets de l'apesanteur — sont au cœur de cette expérience interactive. La simulation repose sur les données réelles de la mission, qui a atteint une altitude de 187 km."
		},
		icon: "../assets/images/card/Mercury-card.png",
		image: "../assets/images/card/Mercury-card.png",
		link: "https://wartets.github.io/Mercury/",
		keywords: ["simulation", "physics", "space", "historical", "interactive"],
		languages: ["fr"],
		show: true
	},
	{
		title: { en: "Caustics", fr: "Caustiques" },
		timestamp: "2025-07-08T08:00:00Z",
		github: "https://github.com/wartets/Caustiques",
		description: {
			en: "Simulation of caustic lines due to refraction of a corrugated glass base.",
			fr: "Simulation des lignes caustiques dues à la réfraction sur un fond de verre ondulé."
		},
		longDescription: {
			en: "This project is an interactive optical simulation that visualizes caustic lines formed by the refraction of light through a corrugated glass base. Users have fine-grained control over the simulation parameters and can adjust the cup's dimensions (height and radius), the light source's properties (height, angle, and position), and the glass orientation (X and Y tilt). The simulation accurately traces the path of thousands of light rays, and users can set the maximum number of reflections for each ray, providing a powerful tool to explore the intricate and beautiful patterns that emerge.",
			fr: "Ce projet est une simulation optique interactive visualisant les lignes caustiques formées par la réfraction de la lumière à travers un fond de verre ondulé. Les paramètres de simulation sont finement réglables : dimensions du récipient (hauteur, rayon), propriétés de la source lumineuse (hauteur, angle, position) et orientation du verre (inclinaisons X et Y). La simulation trace avec précision le trajet de milliers de rayons lumineux, avec un nombre maximal de réflexions configurable par rayon, offrant un outil puissant pour explorer les motifs subtils et esthétiques qui en émergent."
		},
		icon: "../assets/images/card/Caustiques-card.png",
		image: "../assets/images/card/Caustiques-card.png",
		link: "https://wartets.github.io/Caustiques/",
		keywords: ["simulation", "physics", "optics", "visualization", "interactive"],
		languages: ["fr"],
		show: true
	},
	{
		title: { en: "Fractals", fr: "Fractales" },
		timestamp: "2025-07-11T08:00:00Z",
		github: "https://github.com/wartets/Fractals",
		description: {
			en: "Generating fractal plant structures with affine transformations.",
			fr: "Génération de structures végétales fractales par transformations affines."
		},
		longDescription: {
			en: "This project showcases the generation of a wide variety of fractal plant structures using affine transformations. Fractals, known for their self-similarity and repeating patterns at different scales, are visualized here with several selectable types, including 'Fern,' 'Tree,' and 'Dragon' fractals. The web interface offers a high degree of control over the generation with parameters to define the quality and to reset the generation or the view. For analytical purposes, the program can compute the fractal dimension of a generated shape. These features allow you to create complex and visually appealing digital images from simple mathematical formulas and explore those fascinating mathematical objects.",
			fr: "Ce projet présente la génération d'une grande variété de structures végétales fractales par transformations affines. Les fractales, connues pour leur auto-similarité et leurs motifs répétitifs à différentes échelles, sont ici visualisées à travers plusieurs types sélectionnables, dont les fractales 'Fougère', 'Arbre' et 'Dragon'. L'interface web offre un contrôle poussé sur la génération, avec des paramètres de qualité et une réinitialisation de la génération ou de la vue. À des fins d'analyse, le programme peut calculer la dimension fractale d'une forme générée. Ces fonctionnalités permettent de créer des images numériques complexes et esthétiques à partir de formules mathématiques simples et d'explorer ces objets mathématiques fascinants."
		},
		icon: "../assets/images/card/Fractals-card.png",
		image: "../assets/images/card/Fractals-card.png",
		link: "https://wartets.github.io/Fractals/",
		keywords: ["generative-art", "math", "fractals", "visualization", "L-system"],
		languages: ["fr"],
		show: true
	},
	{
		title: { en: "Lenia Web", fr: "Lenia Web" },
		timestamp: "2025-07-01T08:00:00Z",
		github: "https://github.com/wartets/Lenia-Web",
		description: {
			en: "A dynamic web implementation of the Lenia system, modeling artificial organisms evolving via parameterized growth fields.",
			fr: "Une implémentation web dynamique du système Lenia, modélisant des organismes artificiels évoluant selon des champs de croissance paramétrés."
		},
		longDescription: {
			en: "A dynamic web implementation of the Lenia system, a continuous cellular automaton that is also a generalization of Conway's Game of Life. This web implementation can create a diverse range of complex and highly life-like patterns by modeling artificial organisms evolving in a world defined by parameterized growth fields. This generalization from a discrete to a continuous domain is what allows for the incredible visual diversity, providing a world of smooth transitions and endless complexity for the digital organisms it spawns. Users can choose from plenty of initial configurations and fine-tune the grid parameters to explore and generate their own creatures.",
			fr: "Une implémentation web dynamique du système Lenia, un automate cellulaire continu qui généralise le Jeu de la Vie de Conway. Cette implémentation permet de créer une grande diversité de motifs complexes et étonnamment vivants, en modélisant des organismes artificiels évoluant dans un monde défini par des champs de croissance paramétrés. Ce passage du discret au continu est précisément ce qui permet une telle diversité visuelle, offrant un univers de transitions douces et de complexité infinie pour les organismes numériques générés. De nombreuses configurations initiales sont disponibles, et les paramètres de grille peuvent être ajustés finement pour explorer et créer ses propres créatures."
		},
		icon: "../assets/images/card/LeniaWeb-card.png",
		image: "../assets/images/card/LeniaWeb-card.png",
		link: "https://wartets.github.io/Lenia-Web/",
		keywords: ["simulation", "ai", "cellular-automata", "emergence", "python"],
		languages: ["en"],
		show: true
	},
	{
		title: { en: "Curve Fitting", fr: "Ajustement de Courbes" },
		timestamp: "2025-06-01T08:00:00Z",
		github: "https://github.com/wartets/Curve-Fitting",
		description: {
			en: "This project illustrates thin-plate splines, a smooth surface interpolation technique used in geometry and machine learning.",
			fr: "Ce projet illustre les splines de plaque mince (thin-plate splines), une technique d'interpolation de surface lisse utilisée en géométrie et en apprentissage automatique."
		},
		longDescription: {
			en: "This project is a powerful interactive illustration of the thin-plate splines technique, a method for generating a smooth surface from a set of data points widely used in geometric modeling and machine learning. In this tool, you can directly add points to the canvas and instantaneously visualize how the spline adapts to new data. It is possible to adjust a λ (lambda) parameter, which controls the algorithm's trade-off between interpolation and linear regression, allowing you to choose on a spectrum from a fluctuating curve that passes through all points to a smoother line. 'Curve Fitting' lets you explore this interpolation and smoothing in an interactive way.",
			fr: "Ce projet est une illustration interactive puissante de la technique des splines de plaque mince, une méthode générant une surface lisse à partir d'un ensemble de points, largement utilisée en modélisation géométrique et en apprentissage automatique. Cet outil permet d'ajouter directement des points sur le canevas et de visualiser instantanément l'adaptation de la spline aux nouvelles données. Un paramètre λ (lambda) est ajustable, contrôlant le compromis de l'algorithme entre interpolation et régression linéaire, offrant un spectre allant d'une courbe fluctuante passant par tous les points à une ligne plus lissée. 'Curve Fitting' permet d'explorer cette interpolation et ce lissage de façon interactive."
		},
		icon: "../assets/images/card/Curve-Fitting-card.png",
		image: "../assets/images/card/Curve-Fitting-card.png",
		link: "https://wartets.github.io/Curve-Fitting/",
		keywords: ["math", "visualization", "tool", "interactive", "interpolation"],
		languages: ["en"],
		show: false
	},
	{
		title: { en: "Procedural Art Gen.", fr: "Générateur d'Art Procédural" },
		timestamp: "2025-05-01T08:00:00Z",
		github: "https://github.com/wartets/Procedural-Art",
		description: {
			en: "A seed-based generative art system creating unique visual patterns. Explore geometric formations, organic fractals, and abstract compositions that remain reproducible.",
			fr: "Un système d'art génératif basé sur des graines produisant des motifs visuels uniques. Explorez des formations géométriques, des fractales organiques et des compositions abstraites, toutes reproductibles."
		},
		longDescription: {
			en: "A robust seed-based generative art system built to produce a vast diversity of unique visual patterns. The 'Seed' and 'Complexity' sliders, along with the 'Pattern' and 'Palettes' dropdowns in its user-friendly interface, encourage the exploration of a wide range of styles—from geometric formations and organic fractals to abstract compositions. All of this is accomplished while guaranteeing that you can find your amazing creations again with their seed alone. Through this intuitive setup, the tool demonstrates how simple, repeatable algorithms can generate aesthetic diversity.",
			fr: "Un système d'art génératif robuste basé sur des graines, produisant une grande diversité de motifs visuels uniques. Les curseurs 'Graine' et 'Complexité', ainsi que les menus déroulants 'Motif' et 'Palettes' de son interface conviviale, encouragent l'exploration d'un large éventail de styles, des formations géométriques aux fractales organiques en passant par les compositions abstraites. Le tout en garantissant de pouvoir retrouver ses créations grâce à la seule graine utilisée. Grâce à cette configuration intuitive, l'outil démontre comment des algorithmes simples et reproductibles peuvent engendrer une diversité esthétique."
		},
		icon: "../assets/images/card/Procedural-Art-card.png",
		image: "../assets/images/card/Procedural-Art-card.png",
		link: "https://wartets.github.io/Procedural-Art/",
		keywords: ["generative-art", "art", "procedural-generation", "creative-coding", "fractals"],
		languages: ["en"],
		show: true
	},
	[
		{
			title: { en: "Space Trip Game 3D", fr: "Space Trip 3D" },
			timestamp: "2025-04-01T08:00:00Z",
			github: "https://github.com/wartets/Space-Trip-3D",
			description: {
				en: "Survival game for a small ship in a swarm of asteroids, where you have to score as many points as possible by destroying them and staying alive as long as possible.",
				fr: "Jeu de survie pour un petit vaisseau perdu dans un essaim d'astéroïdes, où il faut marquer un maximum de points en les détruisant tout en restant en vie le plus longtemps possible."
			},
			longDescription: {
				en: "A fast-paced, single-player 3D survival game where you pilot a small ship stuck in a dense and hostile asteroid field. You must use skill, luck, and dexterity to keep your ship unscathed for as long as possible. A high-score system motivates players to compete and test their mettle. The main focus of this project is to test spatial navigation and fast-paced combat in various environmental settings, all made possible through a web-friendly canvas for everyone to play and enjoy for a bit of entertainment.",
				fr: "Un jeu de survie 3D solo, rythmé, dans lequel vous pilotez un petit vaisseau coincé dans un champ d'astéroïdes dense et hostile. Adresse, réflexes et un peu de chance sont nécessaires pour garder votre vaisseau intact le plus longtemps possible. Un système de meilleurs scores motive la compétition. Ce projet vise avant tout à tester la navigation spatiale et le combat rythmé dans différents environnements, le tout accessible directement dans le navigateur pour un moment de divertissement."
			},
			icon: "../assets/images/card/Spaceship-card.png",
			image: "../assets/images/card/Spaceship-card.png",
			link: "https://wartets.github.io/Space-Trip-3D/",
			keywords: ["game", "3d", "space", "survival", "arcade", "three.js"],
			languages: ["en"],
			show: true
		},
		{
			title: { en: "Space Trip Game 2D", fr: "Space Trip 2D" },
			timestamp: "2025-03-01T08:00:00Z",
			github: "https://github.com/wartets/Space-Trip-2D",
			description: {
				en: "\"Simplified\" 2D version of the Space Trip game.",
				fr: "Version 2D \"simplifiée\" du jeu Space Trip."
			},
			longDescription: {
				en: "This is the simplified 2D version of its 3D counterpart, but it's also a game in its own right. The experience is an asteroid-scoring survival action game that challenges players to test their skills in different game modes where only reflexes matter. How long you can dodge can change everything. This more arcade-style version of a space survival game promises a fair dose of instant gaming fun, with space-themed backgrounds and other features that will surely entertain.",
				fr: "Il s'agit de la version 2D simplifiée de son équivalent 3D, mais c'est aussi un jeu à part entière. L'expérience est un jeu d'action-survie basé sur la destruction d'astéroïdes, mettant les réflexes à l'épreuve dans différents modes de jeu. Tenir plus longtemps peut tout changer. Cette version plus arcade d'un jeu de survie spatiale promet une bonne dose de plaisir immédiat, avec des décors spatiaux et diverses fonctionnalités divertissantes."
			},
			icon: "../assets/images/card/Space-Trip-2D-card.png",
			image: "../assets/images/card/Space-Trip-2D-card.png",
			link: "https://wartets.github.io/Space-Trip-2D/",
			keywords: ["game", "2d", "space", "survival", "arcade"],
			languages: ["en"],
			show: true
		}
	],
	{
		title: { en: "Sudoku", fr: "Sudoku" },
		timestamp: "2025-02-01T08:00:00Z",
		github: "https://github.com/wartets/Sudoku",
		description: {
			en: "A customizable web-based Sudoku game that allows you to adjust both the grid size and difficulty level. It features real-time input validation, providing an interactive and engaging puzzle-solving experience.",
			fr: "Un jeu de Sudoku web personnalisable permettant d'ajuster la taille de la grille et le niveau de difficulté, avec validation des saisies en temps réel pour une expérience interactive et engageante."
		},
		longDescription: {
			en: "A customizable web-based implementation of Sudoku, the classic logic puzzle game. It allows the player to set their own custom rules, such as the difficulty level, and supports a wide range of grid dimensions, which is always an enjoyable feature in this type of classic game. Overall, this is a strong web-game that offers tons of replayability that never goes out of style.",
			fr: "Une implémentation web personnalisable du Sudoku, le célèbre jeu de logique. Le joueur peut définir ses propres règles, comme le niveau de difficulté, et l'application prend en charge un large éventail de tailles de grille, une fonctionnalité toujours appréciable dans ce type de jeu classique. Un jeu web solide, offrant une grande rejouabilité qui ne se démode jamais."
		},
		icon: "../assets/images/card/Sudoku-card.png",
		image: "../assets/images/card/Sudoku-card.png",
		link: "https://wartets.github.io/Sudoku/",
		keywords: ["game", "puzzle", "logic", "sudoku"],
		languages: ["en"],
		show: true
	},
	{
		title: { en: "Chess Game", fr: "Jeu d'Échecs" },
		timestamp: "2025-01-01T08:00:00Z",
		github: "https://github.com/wartets/Chess-Game",
		description: {
			en: "An Interactive chess game, offering classic and random board setups. It allows custom piece placement, and personalized size grid.",
			fr: "Un jeu d'échecs interactif proposant des configurations classiques ou aléatoires du plateau, avec placement personnalisé des pièces et taille de grille ajustable."
		},
		longDescription: {
			en: "An interactive chess game offering classic and random board setups. It allows custom piece placement and personalized grid size. The project implements the classic game of chess, allowing two players to compete with various customizable options. It's a tool that lets players of all levels sharpen their skills, especially with new variations that custom board sizes can provide.",
			fr: "Un jeu d'échecs interactif proposant des configurations classiques ou aléatoires du plateau, avec placement personnalisé des pièces et taille de grille ajustable. Le projet implémente le jeu d'échecs classique, permettant à deux joueurs de s'affronter avec diverses options personnalisables. Un outil permettant aux joueurs de tous niveaux d'affiner leurs compétences, notamment grâce aux nouvelles variantes offertes par des tailles de plateau personnalisées."
		},
		icon: "../assets/images/card/Chess-card.png",
		image: "../assets/images/card/Chess-card.png",
		link: "https://wartets.github.io/Chess-Game/",
		keywords: ["game", "puzzle", "strategy", "chess"],
		languages: ["en"],
		show: true
	},
	{
		title: { en: "Minesweeper", fr: "Démineur" },
		timestamp: "2024-12-01T08:00:00Z",
		github: "https://github.com/wartets/Demineur",
		description: {
			en: "A simple mine-clearing game in javascript. Discover all the squares without touching a mine! Adjust the grid size and number of mines to personalize the experience.",
			fr: "Un simple jeu de déminage en JavaScript. Découvrez toutes les cases sans toucher une mine ! Ajustez la taille de la grille et le nombre de mines pour personnaliser l'expérience."
		},
		longDescription: {
			en: "A classic implementation of Minesweeper, a logic puzzle game where you must clear a board without detonating hidden mines. This version allows players to adjust the grid dimensions and the number of mines to personalize their game. The project aims to provide a high-quality, classic, and intuitive single-player experience for anyone looking for a quick and fun mental exercise.",
			fr: "Une implémentation classique du Démineur, un jeu de logique où il faut déminer un plateau sans faire détoner de mine cachée. Cette version permet d'ajuster les dimensions de la grille et le nombre de mines pour personnaliser la partie. Le projet vise à offrir une expérience solo classique, intuitive et de qualité, pour un exercice mental rapide et divertissant."
		},
		icon: "../assets/images/card/Demineur-card.png",
		image: "../assets/images/card/Demineur-card.png",
		link: "https://wartets.github.io/Demineur/",
		keywords: ["game", "puzzle", "logic", "minesweeper"],
		languages: ["en"],
		show: true
	},
	{
		title: { en: "Julia-Set", fr: "Ensemble de Julia" },
		timestamp: "2024-11-01T12:00:00Z",
		github: "https://github.com/wartets/Julia-Set",
		description: {
			en: "Explore the beauty of Julia sets with interactive controls to adjust equations and rendering settings. Create custom stunning fractal visuals in \"real-time\" with a simple interface.",
			fr: "Explorez la beauté des ensembles de Julia grâce à des contrôles interactifs ajustant équations et paramètres de rendu. Créez de superbes visuels fractals personnalisés en temps « réel » via une interface simple."
		},
		longDescription: {
			en: "This project lets you explore the abyssal beauty of fractals generated from complex numbers. It uses core mathematical laws, such as function composition, to generate a near-infinite variety of aesthetic shapes through a simple graphical interface. Its fine-grained controls over initial mathematical settings offer users a high-dimensional space of possibilities, where each unique set of parameters produces a distinct mathematical structure. The near real-time generation in the canvas gives the feeling of exploring an infinite space of possibilities within its minimalist design.",
			fr: "Ce projet permet d'explorer la beauté insondable des fractales générées à partir de nombres complexes. Il repose sur des lois mathématiques fondamentales, comme la composition de fonctions, pour engendrer une variété quasi infinie de formes esthétiques via une interface graphique simple. Ses réglages fins des paramètres mathématiques initiaux offrent un espace de possibilités à haute dimension, où chaque combinaison unique de paramètres produit une structure mathématique distincte. La génération quasi temps réel dans le canevas donne le sentiment d'explorer un espace infini de possibilités, au sein d'un design minimaliste."
		},
		icon: "../assets/images/card/JuilaSet-card.png",
		image: "../assets/images/card/JuilaSet-card.png",
		link: "https://wartets.github.io/Julia-Set/",
		keywords: ["visualization", "math", "fractals", "interactive", "generative-art"],
		languages: ["en"],
		show: true
	},
	{
		title: { en: "Bird-cloud", fr: "Nuée d'Oiseaux" },
		timestamp: "2024-11-01T08:00:00Z",
		github: "https://github.com/wartets/Bird-cloud",
		description: {
			en: "An interactive simulation of flocking behavior in birds, based on the Boids model. Adjust parameters like speed, vision radius, and randomness to see how individual rules create collective patterns.",
			fr: "Une simulation interactive du comportement de nuée chez les oiseaux, basée sur le modèle Boids. Ajustez vitesse, rayon de vision et aléatoire pour observer comment des règles individuelles créent des motifs collectifs."
		},
		longDescription: {
			en: "This dynamic agent-based simulation lets you discover the beauty of emergent complexity through a toy model of artificial life. It reproduces the collective flocking behavior of birds or schooling of fish using a population of thousands of separate, autonomous 'boid' entities. At its core, it uses classic AI behavior algorithms like Reynolds' Boids model. The simulation results can be adjusted with basic flight parameters and a full array of custom variables, allowing you to have fun trying all possible flight behaviors. It's a classic and excellent example of an agent-based system.",
			fr: "Cette simulation dynamique à base d'agents permet de découvrir la beauté de la complexité émergente à travers un modèle jouet de vie artificielle. Elle reproduit le comportement collectif de nuée chez les oiseaux ou de banc chez les poissons, à l'aide d'une population de milliers d'entités 'boids' autonomes. Elle repose sur des algorithmes classiques d'IA comportementale comme le modèle Boids de Reynolds. Les résultats de la simulation sont ajustables via des paramètres de vol de base et un large éventail de variables personnalisées, permettant d'essayer tous les comportements de vol imaginables. Un exemple classique et excellent de système multi-agents."
		},
		icon: "../assets/images/card/BirdCloud-card.png",
		image: "../assets/images/card/BirdCloud-card.png",
		link: "https://wartets.github.io/Bird-cloud/",
		keywords: ["simulation", "ai", "emergence", "boids", "interactive"],
		languages: ["en"],
		show: true
	},
	{
		title: { en: "N-Body-Problem", fr: "Problème à N-Corps" },
		timestamp: "2024-10-01T08:00:00Z",
		github: "https://github.com/wartets/N-Body-Problem",
		description: {
			en: "A physics simulation of an N-body system with gravity, collisions, and electromagnetism. Customize object properties like mass, charge, and position to observe how forces shape their motion.",
			fr: "Une simulation physique d'un système à N corps avec gravité, collisions et électromagnétisme. Personnalisez masse, charge et position des objets pour observer comment les forces façonnent leur mouvement."
		},
		longDescription: {
			en: "A physics simulation of an N-body system with gravity, collisions, and electromagnetism. This classic problem in physics involves predicting the individual motions of a group of celestial objects interacting with each other gravitationally. This tool allows you to customize object properties like mass, charge, and position to observe how forces shape their motion. It provides an intuitive glimpse into the unique and chaotic dynamics that complex multi-body systems produce.",
			fr: "Une simulation physique d'un système à N corps avec gravité, collisions et électromagnétisme. Ce problème classique de la physique consiste à prédire les mouvements individuels d'un groupe d'objets célestes en interaction gravitationnelle. Cet outil permet de personnaliser la masse, la charge et la position des objets pour observer comment les forces façonnent leur mouvement, offrant un aperçu intuitif de la dynamique unique et chaotique produite par des systèmes multi-corps complexes."
		},
		icon: "../assets/images/card/NBodyProblem-card.png",
		image: "../assets/images/card/NBodyProblem-card.png",
		link: "https://wartets.github.io/N-Body-Problem/",
		keywords: ["simulation", "physics", "n-body", "interactive", "educational"],
		languages: ["en", "es", "de", "fr", "it", "la", "pt"],
		show: true
	},
	{
		title: { en: "Lenia-Simulation", fr: "Lenia-Simulation" },
		timestamp: "2024-06-01T08:00:00Z",
		github: "https://github.com/wartets/Lenia-Simulation",
		description: {
			en: "Discover Lenia, a continuous cellular automaton that extends Conway's Game of Life. Explore lifelike, emergent patterns in a world of smooth transitions and endless complexity.",
			fr: "Découvrez Lenia, un automate cellulaire continu prolongeant le Jeu de la Vie de Conway. Explorez des motifs émergents étonnamment vivants, dans un monde de transitions douces et de complexité infinie."
		},
		longDescription: {
			en: "Discover Lenia, a continuous cellular automaton that extends Conway's Game of Life. Explore lifelike, emergent patterns in a world of smooth transitions and endless complexity. Lenia models artificial organisms evolving via parameterized growth fields, showcasing how simple rules can lead to complex systems that grow, evolve, and develop behaviors reminiscent of real-world organisms. It's a fantastic tool for anyone with scientific curiosity about complex systems and emergence.",
			fr: "Découvrez Lenia, un automate cellulaire continu prolongeant le Jeu de la Vie de Conway. Explorez des motifs émergents étonnamment vivants, dans un monde de transitions douces et de complexité infinie. Lenia modélise des organismes artificiels évoluant via des champs de croissance paramétrés, démontrant comment des règles simples peuvent engendrer des systèmes complexes qui croissent, évoluent et développent des comportements rappelant des organismes réels. Un outil fascinant pour toute curiosité scientifique envers les systèmes complexes et l'émergence."
		},
		icon: "../assets/images/card/LeniaSimulation-card.png",
		image: "../assets/images/card/LeniaSimulation-card.png",
		link: "https://wartets.github.io/Lenia-Simulation/",
		keywords: ["simulation", "ai", "cellular-automata", "emergence", "python"],
		languages: ["en"],
		show: true
	},
	{
		title: "Solar-System",
		timestamp: "2024-05-01T08:00:00Z",
		github: "https://github.com/wartets/SolarSystem",
		description: {
			en: "A 3D solar system visualization. Interact with the planets and their orbits in a dynamic and immersive interface.",
			fr: "Une visualisation 3D du système solaire. Interagissez avec les planètes et leurs orbites dans une interface dynamique et immersive."
		},
		longDescription: {
			en: "A 3D solar system visualization created to simulate our universe and its beautiful objects on various scales. It offers an immersive and informative interface where you can roam freely, visit planets and their satellites, and compare their characteristics. The goal is to allow users of any background, especially younger learners, to learn from interacting with the environment and its features.",
			fr: "Une visualisation 3D du système solaire conçue pour simuler notre univers et ses magnifiques objets à différentes échelles. Elle offre une interface immersive et informative permettant de se déplacer librement, de visiter les planètes et leurs satellites, et de comparer leurs caractéristiques. L'objectif est de permettre à chacun, en particulier aux plus jeunes, d'apprendre en interagissant avec l'environnement et ses fonctionnalités."
		},
		icon: "../assets/images/card/SolarSystem-card.png",
		image: "../assets/images/card/SolarSystem-card.png",
		link: "https://wartets.github.io/SolarSystem/",
		keywords: ["visualization", "3d", "space", "simulation", "educational", "geogebra"],
		languages: ["en"],
		show: true
	},
	[
		{
			title: { en: "Music-Library", fr: "Bibliothèque Musicale" },
			timestamp: "2026-05-05T11:56:00Z",
			github: "https://wartets.github.io/music/",
			description: {
				en: "A complete library of all my completed and published musical works since 2018.",
				fr: "Une bibliothèque complète de toutes mes œuvres musicales achevées et publiées depuis 2018."
			},
			longDescription: {
				en: "This website is designed as a local-first, offline-capable web application for managing and playing strictly organized, high-resolution music collections. All my music and compositions are featured and presented clearly on the website.",
				fr: "Ce site est conçu comme une application web local-first, utilisable hors-ligne, pour gérer et écouter des collections musicales rigoureusement organisées et en haute résolution. Toutes mes musiques et compositions y sont présentées clairement."
			},
			icon: "../assets/images/card/Music-Library-card.png",
			image: "../assets/images/card/Music-Library-card.png",
			link: "https://wartets.github.io/music/",
			keywords: ["music", "creative", "electronic", "ambient"],
			languages: ["en", "fr", "it"],
			show: true
		},
		{
			title: { en: "My Music (SoundCloud)", fr: "Ma Musique (SoundCloud)" },
			timestamp: "",
			github: "",
			description: {
				en: "I create electronic, ambient, funky, and drumcore music. I focus on improving my skills and exploring new sounds. Not all my music is on my SoundCloud because I've run out of space on it.",
				fr: "Je crée de la musique électronique, ambiante, funky et drumcore. Je me concentre sur l'amélioration de mes compétences et l'exploration de nouveaux sons. Toute ma musique n'est pas sur mon SoundCloud car je n'ai plus d'espace disponible."
			},
			longDescription: {
				en: "I create electronic, ambient, funky, and drumcore music. I focus on improving my skills and exploring new sounds. Not all my music is on my SoundCloud because I've run out of space on it.",
				fr: "Je crée de la musique électronique, ambiante, funky et drumcore. Je me concentre sur l'amélioration de mes compétences et l'exploration de nouveaux sons. Toute ma musique n'est pas sur mon SoundCloud car je n'ai plus d'espace disponible."
			},
			icon: "../assets/images/card/Soundcloud-card.jpg",
			image: "../assets/images/card/Soundcloud-card.jpg",
			link: "https://soundcloud.com/wartets",
			keywords: ["music", "creative", "electronic", "ambient"],
			languages: ["en", "fr"],
			show: false
		},
		{
			title: { en: "My Music (YouTube)", fr: "Ma Musique (YouTube)" },
			timestamp: "",
			github: "",
			description: {
				en: "Explore my music projects on YouTube.",
				fr: "Explorez mes projets musicaux sur YouTube."
			},
			longDescription: {
				en: "Explore my music projects on YouTube.",
				fr: "Explorez mes projets musicaux sur YouTube."
			},
			icon: "../assets/images/card/Soundcloud-card.jpg",
			image: "../assets/images/card/Soundcloud-card.jpg",
			link: "https://www.youtube.com/@Wartets",
			keywords: ["music", "creative", "electronic", "youtube"],
			languages: ["en"],
			show: false
		}
	]
];
