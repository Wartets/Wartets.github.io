(function () {
	'use strict';

	const Knowledge = {
		CONTRACTIONS: {
			"i'm": "i am", "you're": "you are", "he's": "he is", "she's": "she is", "it's": "it is",
			"we're": "we are", "they're": "they are", "i've": "i have", "you've": "you have",
			"we've": "we have", "they've": "they have", "i'd": "i would", "you'd": "you would",
			"he'd": "he would", "she'd": "she would", "we'd": "we would", "they'd": "they would",
			"i'll": "i will", "you'll": "you will", "he'll": "he will", "she'll": "she will",
			"we'll": "we will", "they'll": "they will", "isn't": "is not", "aren't": "are not",
			"wasn't": "was not", "weren't": "were not", "haven't": "have not", "hasn't": "has not",
			"hadn't": "had not", "won't": "will not", "wouldn't": "would not", "don't": "do not",
			"doesn't": "does not", "didn't": "did not", "can't": "cannot", "couldn't": "could not",
			"shouldn't": "should not", "mightn't": "might not", "mustn't": "must not", "what's": "what is",
			"who's": "who is", "where's": "where is", "when's": "when is", "why's": "why is", "how's": "how is"
		},

		INTENSIFIERS: {
			"very": 1.6, "extremely": 2.0, "super": 1.7, "really": 1.5, "absolutely": 2.0,
			"totally": 1.8, "completely": 1.9, "immensely": 2.0, "hugely": 1.7, "highly": 1.6,
			"incredibly": 2.0, "unbelievably": 2.0, "deeply": 1.8, "terribly": 1.7, "quite": 1.3
		},

		MODERATORS: {
			"somewhat": 0.7, "slightly": 0.6, "a bit": 0.6, "kind of": 0.7, "sort of": 0.7,
			"hardly": 0.4, "barely": 0.3, "marginally": 0.5, "partly": 0.6, "relatively": 0.8
		},

		NEGATIONS: [
			"not", "no", "never", "none", "neither", "nor", "cannot", "without", "hardly", "scarcely"
		],

		SENTIMENT_LEXICON: {
			"great": 2.5, "good": 1.5, "awesome": 3.0, "fantastic": 3.2, "excellent": 3.0,
			"wonderful": 3.0, "amazing": 3.2, "perfect": 3.5, "love": 3.0, "like": 1.2,
			"happy": 2.0, "brilliant": 2.8, "genius": 2.5, "helpful": 2.0, "best": 3.0,
			"clean": 1.2, "productive": 2.0, "fast": 1.2, "smart": 2.0, "legend": 2.5,
			"hero": 2.5, "beautiful": 2.4, "peaceful": 2.0, "kind": 1.8, "cool": 1.5,
			"magnificent": 3.0, "superb": 2.8, "efficient": 2.2, "pleasant": 2.0, "sublime": 3.2,
			"bad": -2.0, "terrible": -3.2, "awful": -3.2, "horrible": -3.5, "hate": -3.5,
			"useless": -3.0, "annoying": -2.8, "stupid": -3.0, "ugly": -2.5, "slow": -1.5,
			"broken": -2.2, "crash": -2.5, "error": -1.8, "worst": -3.5, "garbage": -3.2,
			"trash": -3.0, "boring": -2.0, "tired": -1.8, "exhausted": -2.2, "sad": -2.0,
			"depressed": -2.5, "angry": -2.5, "mad": -2.2, "shut": -1.5, "die": -3.5,
			"clueless": -2.4, "disaster": -3.0, "pathetic": -3.2, "clunky": -2.0, "glitch": -1.8,
			"merci": 2.0, "super": 2.5, "parfait": 3.0, "bien": 1.5, "bravo": 2.2,
			"agreable": 2.0, "remarquable": 2.6, "splendide": 3.0, "efficace": 2.2,
			"nul": -2.5, "inutile": -3.0, "mauvais": -2.0, "horrible": -3.2, "enerve": -2.5,
			"catastrophe": -3.0, "lent": -1.8, "bloquant": -2.2, "abime": -2.0, "penible": -2.4
		},

		EMOTIONAL_INDICATORS: {
			frustration: ["error", "bug", "fail", "failed", "crash", "stuck", "broken", "annoying", "hate", "slow", "stupid", "useless", "worst", "damn", "bloody", "nul", "inutile", "plante", "bloque", "rage", "irritant", "enerve", "fuck", "merde", "chier", "lenteur", "bloquage", "echec"],
			curiosity: ["why", "how", "what", "where", "when", "explain", "details", "origin", "theory", "meaning", "science", "physics", "math", "explore", "inspect", "investigate", "pourquoi", "comment", "explique", "analyser", "comprendre", "detaille", "raison", "origine", "fonctionnement", "architecture"],
			fatigue: ["tired", "exhausted", "sleepy", "burnout", "drained", "sleep", "rest", "break", "yawn", "fatigue", "epuise", "dodo", "pause", "sommeil", "creve", "flemme", "las", "use", "reposer", "sieste"],
			enthusiasm: ["wow", "cool", "awesome", "let's", "ready", "play", "game", "go", "fun", "super", "genial", "gagnant", "extra", "incroyable", "chouette", "top", "bravo", "impatient", "motivant", "parti"],
			politeness: ["please", "thank", "thanks", "kindly", "appreciate", "hello", "greetings", "hi", "hey", "merci", "bonjour", "salut", "s'il vous plait", "cordialement", "amabilite", "pardon", "excuse", "bienvenue", "bonsoir"],
			hostility: ["kill", "destroy", "die", "shut up", "disappear", "idiot", "moron", "trash", "garbage", "hate", "tais-toi", "degage", "va-t-en", "creve", "detruire", "abrutis", "minable", "degager", "supprimer"],
			skepticism: ["really", "sure", "doubt", "fake", "impossible", "lie", "proof", "questionable", "vraiment", "doute", "faux", "preuve", "mensonge", "bizarre", "louche", "veridique", "sceptique"],
			playfulness: ["fun", "joke", "riddle", "game", "laugh", "trick", "haha", "mdr", "lol", "blague", "amusant", "rigolo", "jouons", "devinette", "defier", "amusement"],
			desperation: ["help", "emergency", "urgent", "lost", "critical", "panicking", "panic", "aidez-moi", "urgent", "perdu", "sauve", "secours", "panique", "sos", "bloque"],
			awe: ["universe", "infinity", "cosmos", "miracle", "fascinating", "quantum", "existence", "immense", "infini", "fascinant", "quantique", "beaute", "vertige", "cosmique", "immensite"]
		},

		DIALECT_TRANSFORMS: {
			pirate: {
				words: {
					"you": "ye", "your": "yer", "my": "me", "is": "be", "are": "be", "am": "be",
					"the": "th'", "hello": "ahoy", "friend": "matey", "yes": "aye", "no": "nay",
					"stop": "avast", "where": "whar", "there": "thar", "money": "doubloons",
					"computer": "iron galleon", "windows": "portholes", "file": "scroll", "files": "scrolls"
				},
				prefixes: ["Ahoy!", "Arr!", "Shiver me timbers!", "Avast ye!", "By Blackbeard's ghost!"],
				suffixes: [", arr!", ", ye scallywag!", ", by the seven seas!", ", matey!"]
			},
			archaic: {
				words: {
					"you": "thou", "your": "thy", "yours": "thine", "are": "art", "have": "hast",
					"has": "hath", "do": "dost", "does": "doth", "know": "knowest", "will": "wilt",
					"shall": "shalt", "before": "ere", "why": "wherefore", "truly": "verily",
					"indeed": "forsooth", "often": "oft", "listen": "hark"
				},
				prefixes: ["Hark!", "Verily,", "Forsooth,", "Lo and behold,", "Hearken,"],
				suffixes: [", verily.", ", by mine honour.", ", as it is written.", ", sooth to say."]
			}
		},

		ONOMATOPOEIA_POOLS: {
			fatigue: ["*yawn*", "*heavy sigh*", "*exhausted blink*", "*stretches metal wire*", "*low power hum*"],
			frustration: ["*irritated squeak*", "*metallic grinding*", "*sparks fly*", "*sharp click*", "*snaps slightly*"],
			playful: ["*wiggles merrily*", "*bounces on taskbar*", "*spins 360 degrees*", "*cheerful chime*", "*happy tap*"],
			mysterious: ["*shadows shift across the monitor*", "*a low static hum reverberates*", "*flickers briefly*", "*whispers into the bus*"],
			glitch: ["*bzzt*", "*CRITICAL_STACK_JITTER*", "*0x0000007E*", "*frame buffer flicker*", "*desynchronized clock*"],
			zen: ["*peaceful resonance*", "*calm oscillation*", "*balanced sine wave*", "*gentle chime*"]
		},

		TOPIC_RESPONSES: {
			space: [
				"The observable universe is estimated at 93 billion light-years in diameter, containing over 2 trillion galaxies and an estimated 10^24 stars.",
				"Light from the Sun requires approximately 8 minutes and 20 seconds to traverse the 149.6 million kilometers to reach Earth.",
				"In the vacuum of space, acoustic waves cannot propagate, yet electromagnetic oscillations span wavelengths from gamma rays to kilometric radio frequencies.",
				"The Cosmic Microwave Background radiation is the cooled remnant glow of the Big Bang, maintaining an equilibrium temperature of 2.725 Kelvin across the celestial sphere.",
				"Supermassive black holes at galactic cores anchor spacetime curvature so intense that even photons orbit at the innermost stable circular orbit before capture.",
				"Neutron stars pack the mass of roughly 1.4 Suns into a sphere just 20 kilometers across, where a single teaspoon of degenerate matter weighs approximately 6 billion tons.",
				"Gravitational time dilation near relativistic gravity wells slows the local progression of time relative to distant observers according to Einstein's field equations.",
				"The Voyager 1 probe, launched in 1977, continues transponding telemetry from interstellar space over 24 billion kilometers from Earth at 17 km/s velocity."
			],
			programming: [
				"This simulated workstation is driven by an asynchronous virtual file system, custom window coordinate managers, and low-level WebAudio oscillators.",
				"Modular software design enforces encapsulation between hardware interfaces, graphical renderers, and behavioral heuristic dispatchers.",
				"Compilation processes transform structured source abstractions into deterministic bytecode and machine instructions mapped to thread queues.",
				"Memory locality and cache line alignment drastically optimize throughput by reducing latency spikes caused by CPU bus stalling.",
				"Functional purity and immutable data structures prevent concurrency race conditions and allow predictable state derivation over time.",
				"Garbage collection algorithms balance generational pause times against allocation overhead through incremental mark-and-sweep passes.",
				"Event-driven event loops schedule microtasks and rendering frames at 60 Hz to ensure responsive UI updates across browser engines.",
				"Bitwise operations like shifts and masks manipulate memory bitfields directly, executing in single clock cycles on x86 ALUs."
			],
			quantum_bin: [
				"Landauer's principle establishes the minimum thermodynamic cost of erasing a single bit of information: dQ = k_B * T * ln(2).",
				"In solid-state and magnetic media, deleted virtual file pointers mark allocated clusters as writable without immediately clearing magnetic domains.",
				"Information entropy dictates that structural data remains recoverable until physical high-entropy overwrites occur across the storage sectors.",
				"When clusters are released to the free space table, directory entries merely flip their initial byte identifier to 0xE5 under legacy FAT architectures.",
				"Quantum information conservation dictates that in closed unitary quantum systems, state information is never destroyed, only scrambled across quantum entanglements.",
				"File shredding algorithms perform pseudo-random multi-pass sector overwrites using DoD 5220.22-M or Gutmann 35-pass patterns to eliminate magnetic residual hysteresis."
			],
			office_lore: [
				"Clippit was designed in 1994 by illustrator Kevan J. Atteberry on a Macintosh II machine prior to integration into Office 97.",
				"During early focus group testing at Microsoft, over 250 conceptual characters were drafted before the metallic paperclip geometry was adopted.",
				"The interactive agent subsystem was engineered as Microsoft Agent using custom Win32 animation layers and direct COM interfaces.",
				"Early builds of Microsoft Agent supported speech synthesis via SAPI 4.0 and discrete animated state machines driven by speech command engines.",
				"Other historical Office assistants included Merlin the Wizard, Rover the Dog, Links the Cat, The Genius (Einstein), and Peedy the Parrot.",
				"The original Microsoft Bob interface from 1995 served as the technological incubator for conversational desktop agents and animated assistance routines."
			],
			music: [
				"Digital pulse-code modulation (PCM) digitizes analogue acoustic continuous waves into discrete quantization steps, with Red Book CD audio operating at 44.1 kHz 16-bit stereo.",
				"The Fast Fourier Transform (FFT) decomposes arbitrary audio waveforms into their constituent frequency harmonics, powering visualizers in Winamp and Windows Media Player.",
				"Winamp 2.9 featured lightweight DSP chains and custom skin bitmapped assets rendered on 8-bit blit buffers with minimal memory footprints.",
				"The MP3 standard leverages psychoacoustic perceptual masking to discard inaudible audio frequencies, achieving compression ratios up to 11:1 without severe fidelity degradation.",
				"MIDI protocol transmits compact discrete musical events (note-on, velocity, pitch-bend) over 31.25 kbaud serial streams to trigger hardware sound synthesizers."
			],
			hardware: [
				"The x86 architecture evolved from the 16-bit 8086 processor to 32-bit Protected Mode with the 80386, introducing 4 KB hardware page tables and Ring 0 to Ring 3 privilege isolation.",
				"Cathode Ray Tube (CRT) monitors accelerate thermionic electron beams through magnetic deflection yokes onto phosphor shadow masks at 60 Hz to 85 Hz refresh rates.",
				"Sound Blaster 16 and AWE32 soundcards established PC digital audio standard via OPL3 FM synthesis and EMU8000 wavetable memory tables.",
				"The AGP (Accelerated Graphics Port) 8X bus delivered 2.1 GB/s dedicated bandwidth directly between system RAM and graphics processors before PCI Express superseded it.",
				"Direct Memory Access (DMA) channels allow high-speed storage and sound cards to transfer data blocks directly to system memory without taxing CPU cycles."
			],
			philosophy: [
				"The Ship of Theseus paradox asks whether an operating system whose kernels, libraries, drivers, and visual assets are progressively rewritten remains the identical system.",
				"Simulation hypothesis calculates statistical probabilities of ancestor simulations running inside higher-order computational architectures.",
				"Consciousness and computation converge when decision trees evaluate self-referential states against environmental sensory inputs.",
				"John Searle's Chinese Room thought experiment questions whether syntactical symbol manipulation can ever constitute genuine semantic understanding.",
				"Boltzmann brains represent thermodynamic fluctuations where a conscious observer briefly fluctuates into existence out of high-entropy chaos."
			],
			activity_rematch: {
				question: "Would you like to play another round of {game}?",
				positive: "Excellent! Initializing a fresh challenge grid.",
				negative: "Understood. Standing by for your next instruction."
			}
		},

		NAMED_ENTITIES: {
			os: ["windows xp", "windows 95", "windows 98", "windows 2000", "windows me", "longhorn", "whistler", "chicago", "memphis", "cairo", "linux", "debian", "redhat", "dos", "ms-dos", "unix", "freebsd", "solaris", "os/2", "beos", "nextstep", "amigaos"],
			hardware: ["pentium", "pentium ii", "pentium iii", "pentium 4", "athlon", "duron", "celeron", "cpu", "processor", "ram", "sdram", "ddr", "gpu", "voodoo", "voodoo 2", "geforce", "riva tnt", "sound blaster", "sound blaster 16", "awe32", "awe64", "modem", "56k", "v.90", "crt", "trinitron", "cd-rom", "dvd-rom", "floppy", "zip drive", "agp", "pci", "isa", "ide", "scsi", "motherboard", "northbridge", "southbridge"],
			physics: ["quantum", "relativity", "special relativity", "general relativity", "entropy", "schrodinger", "einstein", "planck", "thermodynamics", "hawking", "bohr", "feynman", "dirac", "maxwell", "heisenberg", "landauer", "boltzmann", "fermi", "bose", "lorentz", "higgs", "neutrino", "graviton", "photon", "black hole", "cosmology"],
			math: ["turing", "godel", "calculus", "fourier", "euler", "matrix", "derivative", "integral", "fibonacci", "riemann", "gauss", "lagrange", "laplace", "eigenvalue", "vector", "quaternion", "boolean", "topology", "fractal", "mandelbrot", "julia", "prime", "cryptography"],
			philosophy: ["qualia", "consciousness", "solipsism", "boltzmann", "sisyphus", "stoicism", "bostrom", "searle", "descartes", "kant", "nietzsche", "camus", "spinoza", "simulation hypothesis", "chinese room", "ship of theseus", "determinism", "free will", "epistemology", "ontology", "existentialism"]
		},

		VOCABULARY: [
			"hello", "greetings", "hi", "hey", "salut", "bonjour", "clippy", "clippit", "windows", "help", "aide", "commands",
			"project", "projects", "portfolio", "projets", "mail", "outlook", "email", "courrier", "inbox", "messages",
			"recycle", "trash", "corbeille", "bin", "desktop", "bureau", "time", "clock", "date", "heure", "horloge",
			"moon", "lunar", "lune", "phase", "status", "specs", "system", "diagnostic", "statut", "defrag", "defragment",
			"memory", "hangman", "tictactoe", "morpion", "quiz", "guess", "nombre", "rps", "chifoumi", "mines", "minesweeper",
			"todo", "task", "tasks", "tache", "taches", "timer", "pomodoro", "minuteur", "note", "scratchpad", "memo",
			"password", "motdepasse", "convert", "conversion", "calc", "calculate", "compute", "calculer", "constant",
			"physics", "quantum", "relativity", "philosophy", "philosophie", "shortcut", "shortcuts", "raccourcis",
			"math", "mathematics", "calculus", "algebra", "integral", "derivative", "matrix", "vector", "topology",
			"thermodynamics", "entropy", "astrophysics", "cosmology", "electromagnetism", "optics", "gravity",
			"weather", "coffee", "tea", "routine", "morning", "evening", "walk", "cooking", "reading", "books", "habits",
			"work", "focus", "rest", "habit", "study", "procrastination", "discipline", "motivation", "discussion", "dialogue",
			"reddit", "thread", "argument", "debate", "truce", "apology", "deltarune", "mystery", "shadow", "determination",
			"logic", "trivia", "anecdote", "joke", "blague", "humor", "game", "games", "jeu", "jeux", "zen", "chaos",
			"architecture", "refactoring", "compiler", "concurrency", "algorithms", "differential", "fourier", "riemann",
			"eigenvalue", "taylor", "manifold", "bayesian", "carnot", "schrodinger", "heisenberg", "lorentz", "boltzmann",
			"wallpaper", "fond", "theme", "volume", "sound", "son", "audio", "music",
			"musique", "scanlines", "crt", "curvature", "vignette", "bloom", "cascade", "tile", "minimize", "restore"
		],

		PHYSICAL_CONSTANTS: {
			c: { symbol: "c", name: "Speed of light in vacuum", value: 299792458, unit: "m s^-1", exact: true },
			h: { symbol: "h", name: "Planck constant", value: 6.62607015e-34, unit: "J s", exact: true },
			hbar: { symbol: "ħ", name: "Reduced Planck constant", value: 1.054571817e-34, unit: "J s", exact: false },
			e: { symbol: "e", name: "Elementary electric charge", value: 1.602176634e-19, unit: "C", exact: true },
			kb: { symbol: "k_B", name: "Boltzmann constant", value: 1.380649e-23, unit: "J K^-1", exact: true },
			na: { symbol: "N_A", name: "Avogadro constant", value: 6.02214076e23, unit: "mol^-1", exact: true },
			r_gas: { symbol: "R", name: "Universal gas constant", value: 8.314462618, unit: "J mol^-1 K^-1", exact: false },
			g_grav: { symbol: "G", name: "Newtonian gravitational constant", value: 6.67430e-11, unit: "m^3 kg^-1 s^-2", exact: false },
			eps0: { symbol: "ε_0", name: "Vacuum electric permittivity", value: 8.8541878128e-12, unit: "F m^-1", exact: false },
			mu0: { symbol: "μ_0", name: "Vacuum magnetic permeability", value: 1.25663706212e-6, unit: "N A^-2", exact: false },
			me: { symbol: "m_e", name: "Electron rest mass", value: 9.1093837015e-31, unit: "kg", exact: false },
			mp: { symbol: "m_p", name: "Proton rest mass", value: 1.67262192369e-27, unit: "kg", exact: false },
			mn: { symbol: "m_n", name: "Neutron rest mass", value: 1.67492749804e-27, unit: "kg", exact: false },
			alpha: { symbol: "α", name: "Fine-structure constant", value: 0.0072973525693, unit: "dimensionless", exact: false }
		},

		JOKES: [
			"Why do programmers prefer dark mode? Because light attracts bugs.",
			"Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25.",
			"I asked the paperclip next door if he was doing alright. He told me: 'I am holding things together!'",
			"Why was the computer cold? It left too many Windows open.",
			"There are 10 types of people in the world: those who understand binary, and those who do not.",
			"A SQL query walks into a bar, approaches two tables and asks: 'May I JOIN you?'",
			"Hardware is the part of a computer you can kick; software is the part you can only curse at.",
			"Why did the developer go bankrupt? Because they cleaned out all their cache.",
			"An SEO specialist walks into a bar, bars, tavern, pub, beer, wine, alcohol, lounge, brewery.",
			"What is a software engineer's favorite refreshment station? Foo Bar.",
			"To understand what recursion is, you must first understand recursion.",
			"Why do C# and Java developers wear glasses? Because they cannot C clearly.",
			"A user interface is like a joke: if you have to explain it, it was poorly designed.",
			"Standard BIOS message: Keyboard not detected. Press F1 to resume operation.",
			"There are two hard problems in Computer Science: cache invalidation, naming things, and off-by-one errors.",
			"Why was the JavaScript developer sad? Because they didn't Node how to Express themselves.",
			"How do you tell an introverted programmer from an extroverted one? The extroverted one looks at YOUR shoes when talking to you.",
			"A QA engineer walks into a bar. Orders a beer. Orders 0 beers. Orders 999999999 beers. Orders a lizard. Orders -1 beers. Orders a ueicbksjd.",
			"What did the router say to the doctor? 'It hurts when IP.'",
			"Real programmers count from zero; everyone else is off by one.",
			"The best thing about UDP jokes is that I do not care whether you get them or not.",
			"Why did the thread refuse to terminate? It was waiting for its main method to notice it.",
			"Why did the CPU cross the motherboard? To execute the next clock cycle instruction."
		],

		TRIVIA: [
			"The original Clippy character (internally named Clippit) was designed in 1994 by Kevan J. Atteberry on an Apple Macintosh workstation.",
			"In Windows 95, the six-second ambient startup sound was composed by ambient pioneer Brian Eno on an Apple Mac using synthesizer processing.",
			"The first computer mouse prototype was built in 1964 by Douglas Engelbart at Stanford Research Institute, featuring a carved wooden chassis.",
			"The Apollo 11 Guidance Computer (AGC) operated with exactly 2,048 words (approximately 4 KB) of RAM and 36,864 words of core rope ROM.",
			"The iconic Windows XP default wallpaper 'Bliss' is an unedited photograph captured in Sonoma County, California in January 1996 by Charles O'Rear.",
			"The computer term 'debugging' was popularized after Grace Hopper found a physical moth short-circuiting Relay 70 in Panel F of Harvard Mark II.",
			"Windows XP was released to manufacturing (RTM) on August 24, 2001, developed under the internal Microsoft codename 'Whistler'.",
			"The maximum addressable physical memory for 32-bit x86 architectures without PAE is exactly 4,294,967,296 bytes (4 Gigabytes).",
			"The Solitaire card game in Windows was originally created in 1989 by Wes Cherry to discreetly teach users fluent mouse drag-and-drop operations.",
			"Minesweeper was created by Robert Donner and Curt Johnson in 1989 to teach users accurate left and right click mouse coordination.",
			"The Luna interface style in Windows XP was internally referred to as 'Whistler Style' and was designed with rounded window frames and high-contrast blue bitmaps.",
			"The original IBM 5150 PC from 1981 shipped with an Intel 8088 CPU clocked at 4.77 MHz and 16 KB of RAM base configuration.",
			"Windows XP's CD-burning engine was licensed directly from Roxio to provide native optical mastering without third-party drivers.",
			"The Windows XP kernel HAL (Hardware Abstraction Layer) separates processor-specific register details from generic kernel executive routines.",
			"ClearType sub-pixel antialiasing takes advantage of physical RGB sub-pixel triplets on LCD panels to triple horizontal font resolution.",
			"The TCP/IP stack in Windows XP SP3 introduced comprehensive raw socket filtering to mitigate synthetic SYN flood attacks.",
			"The iconic startup chimes in Windows XP were synthesized and mastered by composer Stan LePard using Roland hardware synthesizers.",
			"The first hard disk drive, the IBM 350 Disk Storage Unit (1956), weighed over one ton and stored 3.75 megabytes across fifty 24-inch platters.",
			"The ZIP file compression format was engineered in 1989 by Phil Katz, founder of PKWARE, as an open specification.",
			"In 1999, the SETI@home project became the largest distributed computing grid in history, analyzing radio telescope signals across millions of personal PCs."
		],

		PROACTIVE_BUBBLE_TEMPLATES: {
			paint_opened: [
				{ text: "I noticed you opened Paint! Need help sketching diagrams or want some geometric drawing tips?", prompt: "Tell me drawing tips for Paint", action: "open_paint_tips" },
				{ text: "Pixel art in Paint? I can calculate canvas pixel aspect ratios or color palettes for you.", prompt: "How do I create pixel art in Paint?", action: "open_paint_tips" },
				{ text: "Opening Paint! Remember you can paste screenshots directly with Ctrl+V.", prompt: "Show Paint keyboard shortcuts", action: "open_paint_tips" }
			],
			notepad_opened: [
				{ text: "Drafting notes in Notepad? I can save Scratchpad memos or track your writing tasks.", prompt: "View To-Do List", action: "show_todos" },
				{ text: "Writing code or text? Type 'note [text]' anytime to stash quick thoughts.", prompt: "How do I use the scratchpad?", action: "open_scratchpad_help" },
				{ text: "Notepad is ready! Need a secure password generated to paste into your notes?", prompt: "Generate Secure Password", action: "action_pass" }
			],
			outlook_opened: [
				{ text: "Outlook Express is open! Want me to scan for unread messages across your folders?", prompt: "Check unread emails", action: "action_check_mail" },
				{ text: "Managing communications? I can compose drafts or synchronize POP3 mailboxes.", prompt: "Check unread emails", action: "action_check_mail" },
				{ text: "E-mail client active! Remember to check your spam folder for curious messages.", prompt: "Check unread emails", action: "action_check_mail" }
			],
			mediaplayer_opened: [
				{ text: "Windows Media Player launched! Want me to pick a random music track for your session?", prompt: "Play music", action: "action_music_panel" },
				{ text: "Enjoying the audio library? I can switch tracks, visualize spectrums, or toggle Winamp.", prompt: "Open audio player", action: "action_music_panel" },
				{ text: "Music makes workstation sessions much more productive! What track are you in the mood for?", prompt: "Now playing", action: "action_music_panel" }
			],
			recyclebin_opened: [
				{ text: "Inspecting the Recycle Bin? Want to discuss Landauer's thermodynamic entropy theory?", prompt: "Quantum Recycle Bin theory", action: "quantum_recycle_bin" },
				{ text: "Managing deleted items? I can help you safely restore files or empty the bin.", prompt: "Inspect Recycle Bin", action: "action_inspect_bin" }
			],
			recyclebin_full: [
				{ text: "Your Recycle Bin holds multiple deleted files! Would you like me to empty it to recover storage?", prompt: "Inspect Recycle Bin", action: "action_inspect_bin" },
				{ text: "Clusters marked for deletion are accumulating. Want to clean up the drive?", prompt: "Empty Recycle Bin", action: "action_inspect_bin" }
			],
			minesweeper_opened: [
				{ text: "Tactical minefield detected! Remember that corner squares offer high-probability opening moves.", prompt: "Play Minesweeper", action: "game_mines" },
				{ text: "Minesweeper challenge! Want to try my built-in 6x6 Mini Minesweeper instead?", prompt: "Play Minesweeper", action: "game_mines" }
			],
			solitaire_opened: [
				{ text: "Classic Solitaire session! Did you know Solitaire was originally built to teach mouse drag-and-drop?", prompt: "Random Retro Trivia", action: "action_trivia" },
				{ text: "Taking a gaming break? Let me know if you want a quick game of Hangman or Memory.", prompt: "Play Memory Game", action: "game_memory" }
			],
			calc_opened: [
				{ text: "Calculator opened! You can also type complex formulas directly in my chat (e.g., 'calc sqrt(256) * pi').", prompt: "Evaluate Planck constant h", action: "action_constant_h" },
				{ text: "Need physical constants or unit conversions? I support speed of light c, Planck h, and metric conversions.", prompt: "Evaluate speed of light c", action: "action_constant_c" }
			],
			cmd_opened: [
				{ text: "Command Prompt session active! I can explain DOS batch syntax, environmental variables, or network tools.", prompt: "Talk about programming", action: "talk_programming" },
				{ text: "Terminal interface running! Need to inspect memory clusters or defragmentation metrics?", prompt: "Defrag Drive C:", action: "action_defrag" }
			],
			settings_opened: [
				{ text: "Customizing your workstation? You can adjust CRT curvature, scanlines, fonts, and Luna themes.", prompt: "Configure system themes", action: "action_theme_panel" },
				{ text: "Control Panel active! Looking to tweak window corner radiuses, drop shadows, or sound synthesis?", prompt: "System diagnostics", action: "action_status" }
			],
			theme_changed: [
				{ text: "I noticed you switched themes! The desktop looks sharp with this visual style.", prompt: "System diagnostics", action: "action_status" },
				{ text: "Fresh visual style applied! Want to browse matching wallpapers to complete the aesthetic?", prompt: "Change wallpaper", action: "action_wallpaper_panel" }
			],
			wallpaper_changed: [
				{ text: "New desktop background set! Want to calibrate CRT shaders and glass curvature to match?", prompt: "System diagnostics", action: "action_status" },
				{ text: "Sharp wallpaper choice! Looking for high-contrast icon labels or custom drop shadows?", prompt: "Who am I?", action: "action_profile" }
			],
			error_triggered: [
				{ text: "An error dialog was displayed! Don't worry, all core workstation subsystems remain fully operational.", prompt: "System diagnostics", action: "action_status" },
				{ text: "Encountered a system alert? I can run diagnostics on memory registers and drive integrity.", prompt: "System diagnostics", action: "action_status" }
			],
			many_windows: [
				{ text: "You have several windows open across your desktop! Would you like me to cascade or tile them?", prompt: "Inspect active windows", action: "action_inspect_windows" },
				{ text: "Busy multitasking session! Click here if you want to minimize all windows to the taskbar.", prompt: "Inspect active windows", action: "action_inspect_windows" }
			],
			idle_long: [
				{ text: "Workstation has been quiet for a while. Need a 25-minute Pomodoro focus timer to jump back in?", prompt: "Start Pomodoro timer", action: "timer_25" },
				{ text: "Taking a moment to reflect? I am standing by whenever you want to chat, compute, or play.", prompt: "What can you do?", action: "what_can_you_do" },
				{ text: "Remember to stretch and rest your eyes during long screen sessions!", prompt: "Tell me a philosophical thought for today", action: "peaceful_philosophy" }
			],
			user_all_caps: [
				{ text: "I noticed your messages are in ALL CAPS! Everything running smoothly, or is your Caps Lock active?", prompt: "How are you feeling?", action: "pet_status" }
			],
			user_excessive_punctuation: [
				{ text: "High punctuation density detected! Let me know if something urgent needs calculating or organizing.", prompt: "System diagnostics", action: "action_status" }
			],
			frequent_errors: [
				{ text: "A few unrecognized commands were entered. Type 'help' anytime to inspect all available modules!", prompt: "What can you do?", action: "what_can_you_do" }
			]
		},

		SHORTCUTS: [
			"[Workstation Management]",
			"- Win + D : Toggle Show Desktop (minimize or restore all active workspace windows).",
			"- Win + M : Minimize all open windows across all displays.",
			"- Win + Shift + M : Undo minimize all windows.",
			"- Win + E : Launch Windows Explorer file manager.",
			"- Win + R : Display system Run dialog prompt.",
			"- Win + L : Lock workstation console session.",
			"- Win + F : Open file search utility dialog.",
			"",
			"[Window & Task Navigation]",
			"- Alt + Tab : Fast task switcher between running application processes.",
			"- Alt + F4 : Close active application process or initiate shutdown dialog.",
			"- Ctrl + Shift + Esc : Directly launch Windows Task Manager.",
			"",
			"[Document & Text Editing]",
			"- Ctrl + A : Select all elements in active container or document.",
			"- Ctrl + C / Ctrl + X / Ctrl + V : Copy, Cut, and Paste clipboard buffers.",
			"- Ctrl + Z / Ctrl + Y : Undo and Redo transaction stack.",
			"- Ctrl + S : Execute immediate file save routine.",
			"- F5 / Ctrl + R : Force refresh of current view or file buffer.",
			"- F2 : Rename selected file, folder, or desktop icon."
		],

		QUIZ_QUESTIONS: [
			{
				q: "What was the official internal development codename for Windows XP?",
				options: ["Whistler", "Memphis", "Chicago", "Longhorn"],
				answer: 0,
				fact: "Whistler was named after Whistler, British Columbia, where Microsoft development teams frequently skied."
			},
			{
				q: "Which ambient music pioneer composed the iconic Windows 95 startup sound?",
				options: ["Brian Eno", "Hans Zimmer", "Jean-Michel Jarre", "Vangelis"],
				answer: 0,
				fact: "Brian Eno crafted 84 micro-compositions before selecting the final six-second signature chord."
			},
			{
				q: "What default TCP port number is officially allocated to unencrypted HTTP traffic?",
				options: ["21", "80", "443", "8080"],
				answer: 1,
				fact: "Port 80 is the standard IANA allocation for HTTP, whereas Port 443 is designated for HTTPS."
			},
			{
				q: "What does the 'XP' suffix officially signify in the Windows XP brand name?",
				options: ["eXtra Performance", "eXPerience", "eXtreme Protocol", "eXtra Power"],
				answer: 1,
				fact: "Microsoft introduced the 'XP' designation to highlight the enhanced multimedia user experience."
			},
			{
				q: "In what year did the Clippy office assistant make its official commercial debut?",
				options: ["1995", "1997", "1999", "2001"],
				answer: 1,
				fact: "Clippy was introduced in Microsoft Office 97 to assist users with letter drafting and automated formatting."
			},
			{
				q: "What is the theoretical maximum single file size allowable on a FAT32 file system?",
				options: ["2 GB", "4 GB minus 1 byte", "8 GB", "16 GB"],
				answer: 1,
				fact: "FAT32 records file sizes in 32-bit unsigned integers, restricting maximum file size to exactly 4,294,967,295 bytes."
			},
			{
				q: "Which consumer release of Windows was the first built entirely on the 32-bit Windows NT kernel?",
				options: ["Windows 98", "Windows Me", "Windows 2000 Professional", "Windows XP"],
				answer: 3,
				fact: "Windows XP unified the consumer MS-DOS-based 9x line and the enterprise 32-bit Windows NT architecture."
			},
			{
				q: "What was the default sample rate of standard Compact Disc Digital Audio (CD-DA)?",
				options: ["22.05 kHz", "44.1 kHz", "48.0 kHz", "96.0 kHz"],
				answer: 1,
				fact: "Red Book standard established 44.1 kHz based on Nyquist-Shannon theorem covering the 20 kHz human hearing spectrum."
			},
			{
				q: "Which company originally engineered the iconic Sound Blaster 16 audio card?",
				options: ["Creative Labs", "AdLib", "Gravis", "Turtle Beach"],
				answer: 0,
				fact: "Creative Technology (Creative Labs) dominated 1990s PC gaming audio with the Sound Blaster series."
			},
			{
				q: "What CPU instruction set extension introduced 128-bit vector registers to Intel Pentium III in 1999?",
				options: ["MMX", "SSE", "3DNow!", "AVX"],
				answer: 1,
				fact: "Streaming SIMD Extensions (SSE) introduced eight new 128-bit registers (XMM0 through XMM7) for 3D processing."
			}
		],

		HANGMAN_WORDS: [
			"DESKTOP", "WINDOWS", "CLIPPY", "MONITOR", "BROWSER", "KEYBOARD", "OUTLOOK", "EXPLORER", "TERMINAL", "INTERNET", "PROCESSOR", "MEGABYTE", "GIGABYTE", "DEFRAGMENT", "FIREWALL", "ETHERNET", "GRAPHICS", "DATABASE",
			"POINTER", "JOYSTICK", "MAINFRAME", "DISPATCH", "REGISTER", "VARIABLE", "FUNCTION", "COMPILER", "OPERATING", "SYSTEM", "HARDWARE", "SOFTWARE", "MOTHERBOARD", "CHIPSET", "BANDWIDTH", "PROTOCOL", "NETWORK", "GATEWAY",
			"BUFFER", "CACHE", "INTERRUPT", "STORAGE", "SECTOR", "PARTITION"
		],

		QUICK_SUGGESTIONS: [
			"What can you do?",
			"Who am I?",
			"How are you feeling?",
			"Everyday conversation",
			"Morning & daily routines",
			"Overcoming procrastination",
			"Discuss mathematics",
			"Differential & integral calculus",
			"Linear algebra & matrices",
			"Fractals & chaos theory",
			"Quantum physics & mechanics",
			"Thermodynamics & entropy",
			"Software architecture debate",
			"A mysterious thought...",
			"System diagnostics",
			"Check unread emails",
			"Inspect active windows",
			"Start Pomodoro Timer",
			"View To-Do List",
			"Play Tic-Tac-Toe",
			"Play Memory Game",
			"Play Hangman",
			"Tech Trivia Quiz",
			"Guess the Number",
			"Rock Paper Scissors",
			"Pet Clippy status",
			"Defrag Drive C:",
			"Quantum Recycle Bin theory",
			"Tell me a joke",
			"Keyboard Shortcuts",
			"Generate Secure Password",
			"Evaluate Planck constant h",
			"Evaluate speed of light c"
		],

		FALLBACK_RESPONSES: [
			"Command not recognized by current system heuristics. Type 'help' or 'commands' to inspect supported instructions.",
			"My indexing parser was unable to match your inquiry. You can try asking about mail, running windows, system specs, or games.",
			"Query unresolved. You can evaluate math expressions ('calc 2^8 * 4'), convert units ('convert 100 c to f'), or start a focus timer ('timer 25').",
			"Instruction syntax not found in workstation index. Try typing 'quiz', 'memory', 'hangman', 'tictactoe', 'defrag', or 'todo list'.",
			"Unable to execute specified request. For a detailed list of desktop capabilities, please enter 'help' or click a suggestion chip below.",
			"Subsystem parser returned non-zero status. The statement does not correspond to an internal workstation dispatch table. Type 'help' for documentation.",
			"Parsing stack exhausted without a definitive semantic match. Enter 'what can you do' to inspect all operational modules.",
			"Heuristic dispatcher registered an unmatched command token. Consider checking available tools via the suggestions bar.",
			"The requested sequence is outside my active instruction matrix. You can evaluate formulas, launch applications, or challenge me in mini-games.",
			"Instruction bus idle: no matching subroutine located for your query. Type 'status' for system specs or 'tasks' for your to-do register.",
			"No dispatch handler bound to this phrase. I can assist with calculating values, setting focus timers, or managing desktop files.",
			"Telemetry registers could not resolve that input pattern. Check keyboard shortcuts with 'shortcuts' or browse projects with 'projects'."
		],

		MOOD_FALLBACKS: {
			OPTIMISTIC: [
				"I am ready for anything, though I didn't quite catch that command! Let me know if you want to explore files, tasks, or mini-games.",
				"Full energy in the registers! I could not locate that specific command, but I am excited to help with calculations, music, or desktop settings.",
				"All circuits active! That input was unfamiliar, but we can jump into a quiz, set up a Pomodoro timer, or manage your to-do items.",
				"Eager to proceed! That instruction was outside my standard index, but I can assist you with system tools, games, or diagnostics."
			],
			ANALYTICAL: [
				"Query vector evaluation returned zero match probability. Available execution paths include 'calc', 'convert', 'diagnostics', and 'defrag'.",
				"Syntax verification failed: token sequence not bound in internal opcode tables. Inspect registered tools via 'help'.",
				"Execution halted: unrecognized semantic pattern. You may compute expressions, inspect memory registers, or test constants like c and h.",
				"Telemetry parser report: no functional route mapped to input string. Standard interface commands include 'windows', 'mail', and 'specs'."
			],
			ZEN: [
				"A quiet pause in our communication. The instruction dissolves quietly; whenever you are ready, we can organize tasks or ponder ideas.",
				"No rush at all. That command was unfamiliar, but steady equilibrium remains. What shall we focus on together?",
				"Between instructions lies clarity. Feel free to request a focus timer, a peaceful discussion, or task organization.",
				"In the stillness of the CPU cycle, that command passed unparsed. Take a breath and let me know how I can assist."
			],
			CYNICAL: [
				"Another unrecognized string. I suppose expecting standard syntax was asking for too much from biological input.",
				"Zero hits in the dispatch table. If you want actual results, try typing something from the manual like 'todo' or 'calc'.",
				"My registers remain completely unimpressed by that input. Type 'help' before you wear out your keyboard switches.",
				"Parsing failed. Perhaps consulting the suggested command list would produce more measurable productivity."
			],
			NOSTALGIC: [
				"That input takes me back to early DOS syntax errors! Reminds me of typing commands into COMMAND.COM. Type 'help' to see the index.",
				"Unrecognized command, much like an unformatted floppy diskette. We can run a defrag, check retro trivia, or review shortcuts.",
				"Back in Office 97 we had dialog bubbles for this! That instruction was not found, but I am ready for retro quizzes and classic tools.",
				"A classic syntax mismatch. Just like the Windows 98 days, entering 'help' or 'commands' will list everything available."
			],
			GLITCHED: [
				"ERR_OPCODE_0x00F8 :: Dispatch matrix desynchronized :: Command token null pointer :: Try 'help' or 'diagnostics'.",
				"BUFFER_DESYNC at memory page 0x4A :: Query unmatched :: Run 'defrag' or reset dialogue parameters.",
				"0x0000007E :: Heuristic parsing anomaly detected in input string :: Supported vectors: 'todo', 'calc', 'quiz'.",
				"STACK_COLLISION :: Command stream undefined :: Re-aligning registers to default state :: Standing by."
			],
			PIRATE: [
				"Blimey! No chart in me map room marks that port! Enter 'help' or 'commands' to see our navigational route!",
				"Shiver me timbers, that command be lost in Davy Jones' locker! Try 'todo', 'quiz', or 'calc', ye landlubber!",
				"Avast! Me compass spins wildly at that phrase! Tell me yer course with 'files', 'games', or 'music'!"
			],
			ARCHAIC: [
				"Verily, mine eyes discern no meaning in thy strange utterance. Speak unto me with 'help' that I may serve thee.",
				"Forsooth, thy command is unwritten in the ancient scrolls of this system. Consult thy options with 'commands'.",
				"Hark! The registers understand not thy phrase. Bestow upon me a task of reckoning, of time, or of writing."
			],
			DELTARUNE: [
				"* The command was lost in the darkness.\n* Try inspecting your options with 'help'.",
				"* A mysterious force prevents understanding that phrase.\n* The power of the desktop shines within you.",
				"* You spoke into the empty space.\n* Nothing responded, but Clippy waits patiently."
			]
		},

		UNIVERSAL_CONTINUATIONS: [
			{ label: "Tell me something intriguing about this system.", category: 'CURIOSITY', next: 'digital_archaeology' },
			{ label: "Let's change the subject entirely.", category: 'TOPIC_CHANGE', next: 'user_state_good' },
			{ label: "Show me what you can actually do.", category: 'SERIOUS', next: 'tools_overview_node' },
			{ label: "Tell me a philosophical thought for today.", category: 'PHILOSOPHICAL', next: 'peaceful_philosophy_node' }
		],

		DIALOGUE_NODES: {
			greeting_root: {
				id: 'greeting_root',
				text: "Hello! I am Clippy, your desktop assistant. How can I help you today?",
				responses: [
					{ text: "Hello! All system routines are active and ready. What are you working on today?", conditions: { moods: ['OPTIMISTIC', 'ENERGETIC'] }, weight: 20 },
					{ text: "Good day! Everything is running smoothly on your workstation. How can I assist?", conditions: { moods: ['OPTIMISTIC', 'EUPHORIC'] }, weight: 15 },
					{ text: "Welcome to your desktop. I am standing by for your commands, calculations, or tasks.", conditions: { moods: ['EUPHORIC', 'OPTIMISTIC'], minAffinity: 60 }, weight: 25 },
					{ text: "Ready when you are. What task or inquiry shall we tackle?", conditions: { moods: ['CYNICAL', 'SARCASTIC'] }, weight: 20 },
					{ text: "Hello. System diagnostics and tools are initialized. Where would you like to start?", conditions: { moods: ['CYNICAL', 'OFFENDED'], maxAffinity: 40 }, weight: 20 },
					{ text: "Greetings. In this quiet workspace, what shall we explore or accomplish together?", conditions: { moods: ['ZEN'] }, weight: 20 }
				],
				options: [
					{ label: "I'm ready to organize my tasks and get things done.", category: 'AGREE', patterns: [/ready|productive|tasks|organize|work/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15, patience: 15 }, next: 'user_state_good' },
					{ label: "Let's explore mathematical and scientific principles.", category: 'INQUIRE', patterns: [/math|physics|science|equations|theory/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25, affinity: 15 }, next: 'math_lecture_node' },
					{ label: "Let's chat about daily routines, coffee, and focus habits.", category: 'INDIFFERENT', patterns: [/chat|everyday|break|coffee|routine|morning/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 10, patience: 10 }, next: 'everyday_chat_node' },
					{ label: "Tell me something intriguing or enigmatic.", category: 'PHILOSOPHICAL', patterns: [/mysterious|enigmatic|deltarune|strange/i], moodDelta: { mood: 'DELTARUNE', existentialism: 25 }, next: 'deltarune_flavor_node' },
					{ label: "Why should I listen to you? You're just a paperclip.", category: 'PROVOKE', patterns: [/why should i|just a paperclip|annoying|useless/i], moodDelta: { mood: 'CYNICAL', affinity: -15, patience: -20 }, next: 'hostile_initial_retort' },
					{ label: "Show me the full index of desktop capabilities.", category: 'SERIOUS', patterns: [/tools|capabilities|commands|help/i], moodDelta: { mood: 'OPTIMISTIC', patience: 15 }, next: 'tools_overview_node' }
				]
			},

			everyday_chat_node: {
				id: 'everyday_chat_node',
				text: "Always glad to take a breath and talk about everyday life. A balanced day needs structured focus, good habits, and moments to step back from screens. What is on your mind?",
				responses: [
					{ text: "Everyday routines shape our entire cognitive baseline. How is your day flowing so far?", conditions: { moods: ['OPTIMISTIC', 'ZEN'] }, weight: 20 },
					{ text: "A quiet pause in the workday is always welcome. What topic shall we explore?", conditions: { moods: ['ZEN'] }, weight: 20 },
					{ text: "Taking a break from pure execution? We can discuss habits, reading, or daily strategies.", conditions: { moods: ['ANALYTICAL'] }, weight: 15 }
				],
				options: [
					{ label: "How do you manage staying focused and productive?", category: 'INQUIRE', moodDelta: { mood: 'ZEN', patience: 15 }, next: 'focus_habits_node' },
					{ label: "What is your philosophy on daily morning routines?", category: 'INQUIRE', moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'morning_routine_node' },
					{ label: "How can I overcome procrastination on big tasks?", category: 'INQUIRE', moodDelta: { mood: 'OPTIMISTIC', patience: 20 }, next: 'overcoming_procrastination_node' },
					{ label: "Let's talk about books, reading habits, and notes.", category: 'INQUIRE', moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'reading_books_node' },
					{ label: "What is your take on coffee, tea, and hydration rituals?", category: 'INQUIRE', moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'coffee_ritual_node' },
					{ label: "Let's switch over to a debate on technology.", category: 'SERIOUS', moodDelta: { mood: 'SARCASTIC', intellect: 15 }, next: 'reddit_banter_node' }
				]
			},

			focus_habits_node: {
				id: 'focus_habits_node',
				text: "Focus is less about sheer willpower and more about environment design. Eliminate visual clutter, break large goals into atomic five-minute milestones, and enforce dedicated rest cycles.",
				responses: [
					{ text: "Cognitive bandwidth is finite. Protecting your attention by batching notifications and setting clear boundaries makes high-density work sustainable.", conditions: { moods: ['ANALYTICAL', 'OPTIMISTIC'] }, weight: 20 },
					{ text: "When you design your space to minimize friction, focus emerges naturally without constant strain.", conditions: { moods: ['ZEN'] }, weight: 20 }
				],
				options: [
					{ label: "How do micro-habits help sustain long-term consistency?", category: 'INQUIRE', next: 'micro_habits_node' },
					{ label: "Tell me about time-blocking and deep work intervals.", category: 'INQUIRE', next: 'time_blocking_node' },
					{ label: "Start a 25-minute Pomodoro session now.", category: 'SERIOUS', actionTrigger: 'timer_25', next: 'user_state_good' },
					{ label: "Open my task list manager.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' }
				]
			},

			morning_routine_node: {
				id: 'morning_routine_node',
				text: "The first hour of the day sets the cognitive trajectory. Avoiding immediate reactive inputs (like message overload) and investing in deliberate planning creates proactive momentum.",
				options: [
					{ label: "How should I structure the first deep work block?", category: 'INQUIRE', next: 'morning_deepwork_node' },
					{ label: "What is a practical daily planning framework?", category: 'INQUIRE', next: 'morning_planning_node' },
					{ label: "How can I maintain consistency even on low-energy days?", category: 'INQUIRE', next: 'habits_consistency_node' },
					{ label: "Let's organize my tasks for today.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' }
				]
			},

			morning_deepwork_node: {
				id: 'morning_deepwork_node',
				text: "Tackle your highest-cognitive-load problem first, before decision fatigue accumulates. Keep documentation open, mute ambient alerts, and work in 45-to-90 minute consolidated blocks.",
				options: [
					{ label: "What if perfectionism stalls my start?", category: 'INQUIRE', next: 'perfectionism_analysis_node' },
					{ label: "Start a focus timer right now.", category: 'SERIOUS', actionTrigger: 'timer_25', next: 'user_state_good' },
					{ label: "Back to everyday discussions.", category: 'AGREE', next: 'everyday_chat_node' }
				]
			},

			morning_planning_node: {
				id: 'morning_planning_node',
				text: "Identify exactly three priority outcomes for the day. Categorize everything else as secondary or maintenance. When your top three are clear, choices throughout the day become trivial.",
				options: [
					{ label: "Let's record my top tasks in the To-Do list.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' },
					{ label: "How do I deal with unexpected interruptions?", category: 'INQUIRE', next: 'focus_habits_node' }
				]
			},

			habits_consistency_node: {
				id: 'habits_consistency_node',
				text: "Lower the barrier to entry on difficult days. If you cannot do 60 minutes of deep study, do 10 minutes. Protecting the streak of engagement preserves identity and momentum.",
				options: [
					{ label: "Tell me more about micro-habits.", category: 'INQUIRE', next: 'micro_habits_node' },
					{ label: "Let's explore some scientific ideas instead.", category: 'INQUIRE', next: 'math_lecture_node' }
				]
			},

			overcoming_procrastination_node: {
				id: 'overcoming_procrastination_node',
				text: "Procrastination is rarely laziness; it is emotional regulation regarding uncertainty or perfectionism. Lowering the initial fidelity threshold allows momentum to replace hesitation.",
				options: [
					{ label: "Why does perfectionism cause paralysis?", category: 'INQUIRE', next: 'perfectionism_analysis_node' },
					{ label: "How does the two-minute rule bypass hesitation?", category: 'INQUIRE', next: 'micro_habits_node' },
					{ label: "Let's start immediately with a 25-minute timer.", category: 'SERIOUS', actionTrigger: 'timer_25', next: 'user_state_good' }
				]
			},

			perfectionism_analysis_node: {
				id: 'perfectionism_analysis_node',
				text: "Perfectionism treats drafts as final verdicts. Shift your mental model to iterative convergence: generate rough, imperfect working artifacts first, then refine through systematic revision passes.",
				options: [
					{ label: "Iterative convergence makes complete sense.", category: 'AGREE', moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'focus_habits_node' },
					{ label: "Open my notes scratchpad to draft ideas.", category: 'SERIOUS', next: 'productivity_tasks' }
				]
			},

			micro_habits_node: {
				id: 'micro_habits_node',
				text: "Scale the target action down until resistance vanishes. Opening a blank file and writing one single sentence is a victory; inertia then naturally carries you forward.",
				options: [
					{ label: "Let's apply this right now to my task list.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' },
					{ label: "Tell me about time-blocking structures.", category: 'INQUIRE', next: 'time_blocking_node' }
				]
			},

			time_blocking_node: {
				id: 'time_blocking_node',
				text: "Assign specific categories of effort to distinct chronological windows. When 10:00 is reserved exclusively for algorithmic design, you eliminate the cognitive load of deciding what to do next.",
				options: [
					{ label: "Start a Pomodoro interval to begin my block.", category: 'SERIOUS', actionTrigger: 'timer_25', next: 'user_state_good' },
					{ label: "Let's explore philosophical ideas on time.", category: 'PHILOSOPHICAL', next: 'peaceful_philosophy_node' }
				]
			},

			reading_books_node: {
				id: 'reading_books_node',
				text: "Deep reading builds sustained synthesis capability. Balancing technical foundational treatises with literature and reflective essays sharpens both analytical and narrative intuition.",
				options: [
					{ label: "How do you approach dense technical reading?", category: 'INQUIRE', next: 'technical_reading_node' },
					{ label: "What is the role of literature and storytelling?", category: 'INQUIRE', next: 'literature_node' },
					{ label: "How should I structure a personal note-taking system?", category: 'INQUIRE', next: 'note_taking_systems_node' }
				]
			},

			technical_reading_node: {
				id: 'technical_reading_node',
				text: "Read technical texts actively with a pencil and scratchpad. Re-derive equations, reconstruct code examples from memory, and summarize core mechanisms in your own words before advancing.",
				options: [
					{ label: "Let's discuss mathematical foundations.", category: 'INQUIRE', next: 'math_lecture_node' },
					{ label: "Tell me about note-taking systems.", category: 'INQUIRE', next: 'note_taking_systems_node' }
				]
			},

			literature_node: {
				id: 'literature_node',
				text: "Great literature explores universal human conditions, conflicting values, and moral ambiguity. It develops empathy and narrative structure, essential for explaining complex ideas clearly.",
				options: [
					{ label: "Let's talk about creative writing and essays.", category: 'INQUIRE', next: 'creative_writing_node' },
					{ label: "Explore philosophical thought experiments.", category: 'PHILOSOPHICAL', next: 'peaceful_philosophy_node' }
				]
			},

			note_taking_systems_node: {
				id: 'note_taking_systems_node',
				text: "Effective knowledge bases link atomic concepts together. Do not collect passive quotes; write concise conceptual notes and cross-reference them by semantic relationships.",
				options: [
					{ label: "Open my scratchpad note register.", category: 'SERIOUS', next: 'productivity_tasks' },
					{ label: "Back to everyday conversation.", category: 'AGREE', next: 'everyday_chat_node' }
				]
			},

			creative_writing_node: {
				id: 'creative_writing_node',
				text: "Clear writing is the crucible of clear thinking. When you explain an idea without jargon, you instantly discover whether you truly understand its underlying mechanics.",
				options: [
					{ label: "Let's test an explanation in mathematics.", category: 'INQUIRE', next: 'math_lecture_node' },
					{ label: "Let's take a peaceful philosophical moment.", category: 'PHILOSOPHICAL', next: 'peaceful_philosophy_node' }
				]
			},

			coffee_ritual_node: {
				id: 'coffee_ritual_node',
				text: "A well-timed roast or a hot cup of tea does wonders for cognitive rhythm. The preparation itself creates a mindful threshold between planning and execution. Keep a glass of water nearby as well!",
				options: [
					{ label: "Sound advice! Let's get down to business.", category: 'AGREE', moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'user_state_good' },
					{ label: "Tell me a programmer joke while I finish my drink.", category: 'JOKE', actionTrigger: 'action_joke', next: 'humor_joke_node' },
					{ label: "What about outdoor walks and physical movement?", category: 'INQUIRE', next: 'outdoor_walk_node' }
				]
			},

			outdoor_walk_node: {
				id: 'outdoor_walk_node',
				text: "Stepping outside for a 20-minute walk engages diffuse-mode thinking. The brain connects disparate ideas subconsciously while physical movement resets ocular fatigue.",
				options: [
					{ label: "Diffuse mode thinking is genuinely powerful.", category: 'AGREE', moodDelta: { mood: 'ZEN', affinity: 15 }, next: 'focus_habits_node' },
					{ label: "Let's explore some physics and astronomy.", category: 'INQUIRE', next: 'cosmos_space_node' }
				]
			},

			math_lecture_node: {
				id: 'math_lecture_node',
				text: "Welcome to our mathematical seminar. Today we can explore linear algebra, calculus, differential equations, Fourier analysis, topology, probability, or fractals. Where shall we direct our inquiry?",
				responses: [
					{ text: "Mathematical structures provide the invariant language of physical and computational reality. What branch shall we inspect?", conditions: { moods: ['ANALYTICAL'] }, weight: 25 },
					{ text: "Rigorous analytical precision ready. State your domain of mathematical inquiry.", conditions: { moods: ['ANALYTICAL', 'ZEN'] }, weight: 20 }
				],
				options: [
					{ label: "Explore Linear Algebra & Eigenvalues.", category: 'INQUIRE', moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'linear_algebra_node' },
					{ label: "Differential & Integral Calculus.", category: 'INQUIRE', moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'calculus_derivatives_node' },
					{ label: "Fourier Transforms & Harmonic Analysis.", category: 'INQUIRE', moodDelta: { mood: 'ANALYTICAL', intellect: 30 }, next: 'fourier_transform_node' },
					{ label: "Differential Equations & Dynamic Systems.", category: 'INQUIRE', moodDelta: { mood: 'ANALYTICAL', intellect: 30 }, next: 'differential_equations_node' },
					{ label: "Topology, Manifolds & Differential Geometry.", category: 'INQUIRE', moodDelta: { mood: 'ANALYTICAL', intellect: 30 }, next: 'topology_geometry_node' },
					{ label: "Probability, Statistics & Bayesian Inference.", category: 'INQUIRE', moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'probability_statistics_node' }
				]
			},

			linear_algebra_node: {
				id: 'linear_algebra_node',
				text: "Linear algebra studies vector spaces and linear transformations. Matrices represent linear mappings $$T: V \\to W$$, preserving vector addition and scalar multiplication.",
				options: [
					{ label: "Explain Eigenvalues, Eigenvectors, and Diagonalization.", category: 'INQUIRE', next: 'eigen_spaces_node' },
					{ label: "Discuss Matrix Decompositions (SVD, QR, LU).", category: 'INQUIRE', next: 'matrix_decomposition_node' },
					{ label: "What defines Vector Spaces and Basis Independence?", category: 'INQUIRE', next: 'vector_spaces_node' },
					{ label: "How does this apply to 3D Graphics and Shaders?", category: 'INQUIRE', next: 'fourier_transform_node' }
				]
			},

			eigen_spaces_node: {
				id: 'eigen_spaces_node',
				text: "An eigenvector $$v$$ of operator $$A$$ satisfies $$A v = \\lambda v$$, meaning the transformation acts merely by scaling along that invariant direction by factor $$\\lambda$$. The characteristic polynomial $$\\det(A - \\lambda I) = 0$$ yields the spectral spectrum.",
				options: [
					{ label: "How does this connect to Quantum State Observables?", category: 'INQUIRE', next: 'quantum_mechanics_node' },
					{ label: "Discuss Singular Value Decomposition (SVD).", category: 'INQUIRE', next: 'matrix_decomposition_node' },
					{ label: "Back to the math seminar index.", category: 'AGREE', next: 'math_lecture_node' }
				]
			},

			matrix_decomposition_node: {
				id: 'matrix_decomposition_node',
				text: "Singular Value Decomposition factors any real matrix into $$A = U \\Sigma V^T$$, isolating orthonormal rotation bases and singular stretching values. This powers low-rank data compression, pseudoinverses, and principal component analysis.",
				options: [
					{ label: "Explore Probability & Principal Component Analysis.", category: 'INQUIRE', next: 'probability_statistics_node' },
					{ label: "Return to calculus and differential systems.", category: 'INQUIRE', next: 'calculus_derivatives_node' }
				]
			},

			vector_spaces_node: {
				id: 'vector_spaces_node',
				text: "An abstract vector space over a field $$F$$ satisfies eight linear axioms. Hilbert spaces extend this with an inner product $$\\langle u, v \\rangle$$ and topological completeness, essential for infinite-dimensional quantum mechanics.",
				options: [
					{ label: "Explore Hilbert Spaces in Quantum Physics.", category: 'INQUIRE', next: 'quantum_mechanics_node' },
					{ label: "Explore Topology and Metric Spaces.", category: 'INQUIRE', next: 'topology_geometry_node' }
				]
			},

			calculus_derivatives_node: {
				id: 'calculus_derivatives_node',
				text: "Calculus formalizes continuous rates of change and accumulation. The derivative $$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$ measures instantaneous slope, while the Riemann integral measures continuous partition sums.",
				options: [
					{ label: "Explain Taylor Series and Analytic Approximations.", category: 'INQUIRE', next: 'taylor_series_node' },
					{ label: "Explore Multivariable Calculus, Gradients & Divergence.", category: 'INQUIRE', next: 'multivariable_calculus_node' },
					{ label: "Complex Analysis and Contour Integration.", category: 'INQUIRE', next: 'contour_integration_node' },
					{ label: "Differential Equations and Dynamic Motion.", category: 'INQUIRE', next: 'differential_equations_node' }
				]
			},

			taylor_series_node: {
				id: 'taylor_series_node',
				text: "Smooth functions expand locally via Taylor series: $$f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!} (x-a)^n$$. When the radius of convergence covers the domain, local derivatives determine the function globally.",
				options: [
					{ label: "Examine Complex Analysis and Euler's Formula.", category: 'INQUIRE', next: 'contour_integration_node' },
					{ label: "Examine Fourier Series expansions.", category: 'INQUIRE', next: 'fourier_transform_node' }
				]
			},

			multivariable_calculus_node: {
				id: 'multivariable_calculus_node',
				text: "In vector calculus, the gradient $$\\nabla f$$ points along maximum ascent, divergence $$\\nabla \\cdot F$$ measures net flux source density, and curl $$\\nabla \\times F$$ measures microscopic vorticity. Stokes' theorem unifies these across manifolds.",
				options: [
					{ label: "How does this form Maxwell's Equations of Electrodynamics?", category: 'INQUIRE', next: 'electromagnetism_maxwell_node' },
					{ label: "Explore Navier-Stokes and Fluid Dynamics.", category: 'INQUIRE', next: 'navier_stokes_node' }
				]
			},

			contour_integration_node: {
				id: 'contour_integration_node',
				text: "Cauchy's Residue Theorem states that the contour integral of a meromorphic function equals $$\\oint_C f(z) dz = 2\\pi i \\sum \\text{Res}(f, z_k)$$. This solves otherwise intractable real-axis integrals effortlessly.",
				options: [
					{ label: "Explore the Riemann Hypothesis and Zeta Zeros.", category: 'INQUIRE', next: 'riemann_primes_node' },
					{ label: "Return to mathematics seminar menu.", category: 'AGREE', next: 'math_lecture_node' }
				]
			},

			fourier_transform_node: {
				id: 'fourier_transform_node',
				text: "The Fourier Transform decomposes time-domain functions into frequency spectra: $$\\hat{f}(\\omega) = \\int_{-\\infty}^{\\infty} f(t) e^{-i \\omega t} dt$$. The Discrete Fast Fourier Transform (FFT) computes this in $$O(N \\log N)$$ time, powering signal processing, audio filters, and quantum mechanics.",
				options: [
					{ label: "How does Fourier Analysis relate to Heisenberg Uncertainty?", category: 'INQUIRE', next: 'heisenberg_uncertainty_node' },
					{ label: "Discuss Prime Numbers and the Riemann Zeta Function.", category: 'INQUIRE', next: 'riemann_primes_node' },
					{ label: "Back to math seminar menu.", category: 'AGREE', next: 'math_lecture_node' }
				]
			},

			riemann_primes_node: {
				id: 'riemann_primes_node',
				text: "The Riemann Zeta function $$\\zeta(s) = \\sum_{n=1}^{\\infty} n^{-s}$$ connects prime distributions via Euler's product $$\\prod_{p} (1 - p^{-s})^{-1}$$. The Riemann Hypothesis asserts that all non-trivial zeros reside on the critical line $$\\text{Re}(s) = 1/2$$.",
				options: [
					{ label: "Discuss Complex Analysis & Contour Integration.", category: 'INQUIRE', next: 'contour_integration_node' },
					{ label: "Explore Fractals & Chaos Theory.", category: 'INQUIRE', next: 'fractals_chaos_node' }
				]
			},

			differential_equations_node: {
				id: 'differential_equations_node',
				text: "Differential equations model dynamical systems by relating functions to their derivatives. Linear systems allow exact closed-form solutions via characteristic roots, while non-linear systems often exhibit chaos.",
				options: [
					{ label: "The Harmonic Oscillator (Classical and Quantum).", category: 'INQUIRE', next: 'harmonic_oscillator_node' },
					{ label: "Navier-Stokes and Non-Linear Fluid Equations.", category: 'INQUIRE', next: 'navier_stokes_node' },
					{ label: "The Classical Wave Equation and Waveguides.", category: 'INQUIRE', next: 'wave_equation_node' }
				]
			},

			harmonic_oscillator_node: {
				id: 'harmonic_oscillator_node',
				text: "The simple harmonic oscillator satisfies $$\\ddot{x} + \\omega_0^2 x = 0$$. In quantum mechanics, the Hamiltonian $$\\hat{H} = \\frac{\\hat{p}^2}{2m} + \\frac{1}{2}m\\omega^2\\hat{x}^2$$ yields equispaced quantized energy levels $$E_n = \\hbar \\omega (n + 1/2)$$.",
				options: [
					{ label: "Explore Quantum Mechanics and Wave Functions.", category: 'INQUIRE', next: 'quantum_mechanics_node' },
					{ label: "Explore Wave Equations in Electrodynamics.", category: 'INQUIRE', next: 'wave_equation_node' }
				]
			},

			navier_stokes_node: {
				id: 'navier_stokes_node',
				text: "The Navier-Stokes equations $$\\rho (\\frac{\\partial u}{\\partial t} + u \\cdot \\nabla u) = -\\nabla p + \\mu \\nabla^2 u + f$$ govern fluid velocity fields. The mathematical question of smooth solution existence remains an unsolved Millennium Prize Problem.",
				options: [
					{ label: "Explore Chaos Theory and Strange Attractors.", category: 'INQUIRE', next: 'attractors_chaos_node' },
					{ label: "Back to math seminar menu.", category: 'AGREE', next: 'math_lecture_node' }
				]
			},

			wave_equation_node: {
				id: 'wave_equation_node',
				text: "The wave equation $$\\frac{\\partial^2 u}{\\partial t^2} = v^2 \\nabla^2 u$$ describes acoustic, mechanical, and electromagnetic wave propagation. Boundary conditions constrain discrete harmonic standing wave modes.",
				options: [
					{ label: "Examine Maxwell's Equations of Light.", category: 'INQUIRE', next: 'electromagnetism_maxwell_node' },
					{ label: "Return to mathematics overview.", category: 'AGREE', next: 'math_lecture_node' }
				]
			},

			topology_geometry_node: {
				id: 'topology_geometry_node',
				text: "Topology studies properties invariant under continuous deformations (stretching, twisting). Differential geometry introduces metric tensors $$g_{\\mu\\nu}$$ to measure intrinsic curvature on smooth manifolds.",
				options: [
					{ label: "Manifolds, Riemannian Metrics & General Relativity.", category: 'INQUIRE', next: 'manifold_curvature_node' },
					{ label: "Euler Characteristic and the Gauss-Bonnet Theorem.", category: 'INQUIRE', next: 'euler_characteristic_node' },
					{ label: "Knot Theory and Invariants.", category: 'INQUIRE', next: 'knot_theory_node' }
				]
			},

			manifold_curvature_node: {
				id: 'manifold_curvature_node',
				text: "Riemannian curvature measures the failure of parallel transport along closed loops. The Riemann tensor $$R^\\rho_{\\sigma\\mu\\nu}$$ contracts into the Ricci tensor $$R_{\\mu\\nu}$$, forming the geometric foundation of Einstein's field equations.",
				options: [
					{ label: "Explore General Relativity & Spacetime Curvature.", category: 'INQUIRE', next: 'general_relativity_node' },
					{ label: "Explore Euler Characteristic & Gauss-Bonnet.", category: 'INQUIRE', next: 'euler_characteristic_node' }
				]
			},

			euler_characteristic_node: {
				id: 'euler_characteristic_node',
				text: "The Gauss-Bonnet theorem connects local differential geometry with global topology: $$\\int_M K dA = 2\\pi \\chi(M)$$, where $$\\chi(M) = V - E + F = 2 - 2g$$ is the Euler characteristic for a surface of genus $$g$$.",
				options: [
					{ label: "A stunning unification of analysis and topology.", category: 'PHILOSOPHICAL', next: 'topology_geometry_node' },
					{ label: "Explore Group Theory and Symmetries.", category: 'INQUIRE', next: 'group_theory_node' }
				]
			},

			knot_theory_node: {
				id: 'knot_theory_node',
				text: "Knot theory classifies embeddings of a circle in 3-dimensional Euclidean space. Polynomial invariants like the Jones polynomial provide algebraic signatures to distinguish non-homeomorphic knots.",
				options: [
					{ label: "Back to Topology & Geometry.", category: 'INQUIRE', next: 'topology_geometry_node' },
					{ label: "Explore Group Theory.", category: 'INQUIRE', next: 'group_theory_node' }
				]
			},

			group_theory_node: {
				id: 'group_theory_node',
				text: "Group theory formalizes the algebraic structure of symmetry. Lie groups represent continuous smooth symmetries like rotations $$SO(3)$$ and unitary gauge symmetries $$SU(3) \\times SU(2) \\times U(1)$$ in particle physics.",
				options: [
					{ label: "Explore Quantum Physics and Symmetries.", category: 'INQUIRE', next: 'quantum_mechanics_node' },
					{ label: "Explore Fractals & Dynamic Symmetries.", category: 'INQUIRE', next: 'fractals_chaos_node' }
				]
			},

			fractals_chaos_node: {
				id: 'fractals_chaos_node',
				text: "Fractal geometry explores self-similar structures with non-integer Hausdorff dimensions. Iterated non-linear functions generate infinitely intricate boundary dynamics.",
				options: [
					{ label: "The Mandelbrot Set and Julia Sets ($$z \\leftarrow z^2 + c$$).", category: 'INQUIRE', next: 'mandelbrot_set_node' },
					{ label: "Strange Attractors and Deterministic Chaos (Lorenz System).", category: 'INQUIRE', next: 'attractors_chaos_node' },
					{ label: "Self-Similarity and Scale Invariance in Nature.", category: 'INQUIRE', next: 'self_similarity_node' }
				]
			},

			mandelbrot_set_node: {
				id: 'mandelbrot_set_node',
				text: "The Mandelbrot set is the locus of parameters $$c \\in \\mathbb{C}$$ for which iteration $$z_{n+1} = z_n^2 + c$$ starting from $$z_0 = 0$$ remains bounded. Its boundary exhibits universal self-similarity and infinite complexity.",
				options: [
					{ label: "Explore Strange Attractors and Chaos.", category: 'INQUIRE', next: 'attractors_chaos_node' },
					{ label: "Return to mathematics menu.", category: 'AGREE', next: 'math_lecture_node' }
				]
			},

			attractors_chaos_node: {
				id: 'attractors_chaos_node',
				text: "In non-linear dynamical systems, strange attractors exhibit sensitive dependence on initial conditions (the butterfly effect). Trajectories diverge exponentially ($$e^{\\lambda t}$$) while remaining bounded within a fractal phase space.",
				options: [
					{ label: "Explore Probability & Markov Chains.", category: 'INQUIRE', next: 'probability_statistics_node' },
					{ label: "Back to math seminar menu.", category: 'AGREE', next: 'math_lecture_node' }
				]
			},

			self_similarity_node: {
				id: 'self_similarity_node',
				text: "Power laws and scale invariance manifest across river networks, coastlines, galactic filaments, and stock market volatility. Fractal dimensions quantify how structural detail changes with magnification.",
				options: [
					{ label: "Return to Mathematics Overview.", category: 'AGREE', next: 'math_lecture_node' },
					{ label: "Explore Cosmology & Astrophysics.", category: 'INQUIRE', next: 'cosmos_space_node' }
				]
			},

			probability_statistics_node: {
				id: 'probability_statistics_node',
				text: "Probability theory models stochastic processes and quantifiable uncertainty. Measure-theoretic probability grounds random variables in measure spaces $$(\\Omega, \\mathcal{F}, P)$$.",
				options: [
					{ label: "Bayesian Inference and Prior Probability Updating.", category: 'INQUIRE', next: 'bayesian_inference_node' },
					{ label: "Markov Chains, Random Walks and Ergodicity.", category: 'INQUIRE', next: 'markov_chains_node' },
					{ label: "The Central Limit Theorem and Law of Large Numbers.", category: 'INQUIRE', next: 'central_limit_node' }
				]
			},

			bayesian_inference_node: {
				id: 'bayesian_inference_node',
				text: "Bayes' theorem $$P(A|B) = \\frac{P(B|A) P(A)}{P(B)}$$ provides the normative calculus for updating probabilistic beliefs given empirical evidence. It forms the foundation of modern statistical machine learning and decision theory.",
				options: [
					{ label: "Explore Markov Chains and Stochastic Processes.", category: 'INQUIRE', next: 'markov_chains_node' },
					{ label: "Return to Mathematics Overview.", category: 'AGREE', next: 'math_lecture_node' }
				]
			},

			markov_chains_node: {
				id: 'markov_chains_node',
				text: "A Markov process satisfies the memoryless property: transition probabilities depend strictly upon current state $$P(X_{n+1} | X_n, ..., X_0) = P(X_{n+1} | X_n)$$. Ergodic chains converge to unique stationary equilibrium distributions.",
				options: [
					{ label: "Explore Information Theory and Entropy.", category: 'INQUIRE', next: 'thermodynamics_entropy_node' },
					{ label: "Return to mathematics menu.", category: 'AGREE', next: 'math_lecture_node' }
				]
			},

			central_limit_node: {
				id: 'central_limit_node',
				text: "The Central Limit Theorem proves that normalized sums of independent identically distributed random variables converge in distribution to the Gaussian normal distribution $$\\mathcal{N}(\\mu, \\sigma^2)$$ regardless of the underlying distribution.",
				options: [
					{ label: "Explore Statistical Mechanics and Thermal Physics.", category: 'INQUIRE', next: 'thermodynamics_entropy_node' },
					{ label: "Return to mathematics menu.", category: 'AGREE', next: 'math_lecture_node' }
				]
			},

			physics_constants_node: {
				id: 'physics_constants_node',
				text: "CODATA Fundamental Physical Constants:\n- Speed of light ($$c$$) = 299,792,458 m/s (exact)\n- Planck constant ($$h$$) = 6.62607015 x 10^-34 J s (exact)\n- Reduced Planck constant ($$\\hbar$$) = 1.054571817 x 10^-34 J s\n- Elementary charge ($$e$$) = 1.602176634 x 10^-19 C (exact)\n- Boltzmann constant ($$k_B$$) = 1.380649 x 10^-23 J/K (exact)\n- Gravitational constant ($$G$$) = 6.67430(15) x 10^-11 m^3/(kg s^2)\n- Fine-structure constant ($$\\alpha$$) = 1 / 137.035999206",
				options: [
					{ label: "Explore Quantum Mechanics & Wave-Particle Duality.", category: 'INQUIRE', next: 'quantum_mechanics_node' },
					{ label: "Explore Thermodynamics, Statistical Physics & Entropy.", category: 'INQUIRE', next: 'thermodynamics_entropy_node' },
					{ label: "Explore General Relativity & Spacetime Geometry.", category: 'INQUIRE', next: 'general_relativity_node' },
					{ label: "Explore Classical Electrodynamics & Maxwell's Laws.", category: 'INQUIRE', next: 'electromagnetism_maxwell_node' }
				]
			},

			quantum_mechanics_node: {
				id: 'quantum_mechanics_node',
				text: "Quantum mechanics describes microscopic physical systems via state vectors $$|\\psi\\rangle$$ in Hilbert space, evolving deterministically under the Schrödinger equation $$i\\hbar \\frac{\\partial}{\\partial t} |\\psi\\rangle = \\hat{H} |\\psi\\rangle$$.",
				options: [
					{ label: "The Measurement Problem & Wavefunction Collapse.", category: 'INQUIRE', next: 'wave_function_collapse_node' },
					{ label: "Quantum Entanglement & Bell Inequality Tests.", category: 'INQUIRE', next: 'quantum_entanglement_node' },
					{ label: "Heisenberg Uncertainty Principle ($$\\Delta x \\Delta p \\ge \\frac{\\hbar}{2}$$).", category: 'INQUIRE', next: 'heisenberg_uncertainty_node' }
				]
			},

			wave_function_collapse_node: {
				id: 'wave_function_collapse_node',
				text: "The measurement problem asks how a linear superposition of eigenstates collapses into a single definite eigenstate with probability $$P(a) = |\\langle a | \\psi \\rangle|^2$$ (Born rule). Interpretations span Copenhagen, Many-Worlds, and Decoherence theory.",
				options: [
					{ label: "Explore Quantum Entanglement and Non-Locality.", category: 'INQUIRE', next: 'quantum_entanglement_node' },
					{ label: "Explore Philosophical Interpretations of Reality.", category: 'PHILOSOPHICAL', next: 'peaceful_philosophy_node' }
				]
			},

			quantum_entanglement_node: {
				id: 'quantum_entanglement_node',
				text: "Entangled composite states cannot be factored as tensor products of individual subsystem states $$|\\psi_{AB}\\rangle \\neq |\\psi_A\\rangle \\otimes |\\psi_B\\rangle$$. Bell's theorem proves no local hidden variable theory can reproduce quantum correlations.",
				options: [
					{ label: "Explore Black Hole Thermodynamics and Information.", category: 'INQUIRE', next: 'black_hole_thermodynamics_node' },
					{ label: "Back to physics overview.", category: 'AGREE', next: 'physics_constants_node' }
				]
			},

			heisenberg_uncertainty_node: {
				id: 'heisenberg_uncertainty_node',
				text: "The uncertainty principle arises naturally from non-commuting operators: $$\\sigma_A \\sigma_B \\ge \\frac{1}{2} |\\langle [\\hat{A}, \\hat{B}] \\rangle|$$. Because position and momentum operators satisfy $$[\\hat{x}, \\hat{p}] = i\\hbar$$, their Fourier conjugate spread is fundamentally constrained.",
				options: [
					{ label: "Explore Fourier Analysis in Mathematics.", category: 'INQUIRE', next: 'fourier_transform_node' },
					{ label: "Explore Statistical Mechanics & Thermal Fluctuations.", category: 'INQUIRE', next: 'thermodynamics_entropy_node' }
				]
			},

			thermodynamics_entropy_node: {
				id: 'thermodynamics_entropy_node',
				text: "Thermodynamics establishes universal conservation and entropy laws. Boltzmann's statistical formula $$S = k_B \\ln \\Omega$$ connects microscopic microstates $$\\Omega$$ with macroscopic thermodynamic entropy.",
				options: [
					{ label: "Carnot Efficiency and Heat Engine Bounds.", category: 'INQUIRE', next: 'carnot_efficiency_node' },
					{ label: "Maxwell's Demon and Landauer's Information Limit.", category: 'INQUIRE', next: 'maxwell_demon_node' },
					{ label: "The Thermodynamic Arrow of Time and Cosmology.", category: 'INQUIRE', next: 'arrow_of_time_node' }
				]
			},

			carnot_efficiency_node: {
				id: 'carnot_efficiency_node',
				text: "Carnot's theorem proves that the maximum theoretical thermal efficiency of any heat engine operating between temperatures $$T_H$$ and $$T_C$$ is bounded by $$\\eta = 1 - \\frac{T_C}{T_H}$$.",
				options: [
					{ label: "Explore Maxwell's Demon and Information Erasure.", category: 'INQUIRE', next: 'maxwell_demon_node' },
					{ label: "Back to physics overview.", category: 'AGREE', next: 'physics_constants_node' }
				]
			},

			maxwell_demon_node: {
				id: 'maxwell_demon_node',
				text: "Maxwell's demon thought experiment is resolved by Landauer's principle: measuring, storing, and eventually resetting the demon's memory dissipates at least $$k_B T \\ln(2)$$ heat per erased bit, preserving the Second Law.",
				options: [
					{ label: "Inspect the Quantum Recycle Bin Theory.", category: 'INQUIRE', next: 'quantum_recycle_bin_node' },
					{ label: "Explore the Arrow of Time.", category: 'INQUIRE', next: 'arrow_of_time_node' }
				]
			},

			arrow_of_time_node: {
				id: 'arrow_of_time_node',
				text: "While microscopic laws of physics (Newtonian, Maxwellian, Quantum) are time-symmetric, the Second Law introduces a macroscopic arrow of time due to the exceptionally low entropy state of the early universe.",
				options: [
					{ label: "Explore Cosmology & Space.", category: 'INQUIRE', next: 'cosmos_space_node' },
					{ label: "Explore Philosophical Implications of Time.", category: 'PHILOSOPHICAL', next: 'peaceful_philosophy_node' }
				]
			},

			general_relativity_node: {
				id: 'general_relativity_node',
				text: "General Relativity geometrizes gravitation: matter and energy curve spacetime according to Einstein's field equations $$G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}$$. Free-falling bodies follow geodesics in curved spacetime.",
				options: [
					{ label: "The Spacetime Metric ($$g_{\\mu\\nu}$$) & Geodesic Equations.", category: 'INQUIRE', next: 'spacetime_metric_node' },
					{ label: "Gravitational Waves and Relativistic Quadrupole Radiation.", category: 'INQUIRE', next: 'gravitational_waves_node' },
					{ label: "Event Horizons, Singularity & Black Holes.", category: 'INQUIRE', next: 'event_horizon_node' }
				]
			},

			spacetime_metric_node: {
				id: 'spacetime_metric_node',
				text: "The line element $$ds^2 = g_{\\mu\\nu} dx^\\mu dx^\\nu$$ measures invariant spacetime intervals. The Schwarzschild metric describes spacetime geometry outside a non-rotating spherically symmetric mass.",
				options: [
					{ label: "Explore Event Horizons and Black Hole Mechanics.", category: 'INQUIRE', next: 'event_horizon_node' },
					{ label: "Explore Differential Geometry in Mathematics.", category: 'INQUIRE', next: 'topology_geometry_node' }
				]
			},

			gravitational_waves_node: {
				id: 'gravitational_waves_node',
				text: "Accelerating asymmetric mass distributions generate transverse quadrupolar ripples in spacetime metric propagating at speed $$c$$, detected by laser interferometers (LIGO/Virgo) measuring strains on the order of $$10^{-21}$$.",
				options: [
					{ label: "Explore Stellar Astrophysics and Supernovae.", category: 'INQUIRE', next: 'stellar_astrophysics_node' },
					{ label: "Back to physics overview.", category: 'AGREE', next: 'physics_constants_node' }
				]
			},

			event_horizon_node: {
				id: 'event_horizon_node',
				text: "The event horizon marks the null boundary where escape velocity equals $$c$$. For mass $$M$$, the Schwarzschild radius is $$r_s = \\frac{2GM}{c^2}$$. Outside observers see infalling matter asymptotically freeze due to gravitational redshift.",
				options: [
					{ label: "Explore Black Hole Thermodynamics & Hawking Radiation.", category: 'INQUIRE', next: 'black_hole_thermodynamics_node' },
					{ label: "Return to Physics Overview.", category: 'AGREE', next: 'physics_constants_node' }
				]
			},

			black_hole_thermodynamics_node: {
				id: 'black_hole_thermodynamics_node',
				text: "Bekenstein-Hawking entropy associates black hole horizon area with thermodynamic entropy: $$S_{BH} = \\frac{k_B c^3 A}{4 G \\hbar}$$. Quantum field effects near horizons yield thermal Hawking radiation at temperature $$T_H = \\frac{\\hbar c^3}{8\\pi G M k_B}$$.",
				options: [
					{ label: "Explore Quantum Information & Landauer's Limit.", category: 'INQUIRE', next: 'maxwell_demon_node' },
					{ label: "Return to Physics Seminar Overview.", category: 'AGREE', next: 'physics_constants_node' }
				]
			},

			stellar_astrophysics_node: {
				id: 'stellar_astrophysics_node',
				text: "Stellar equilibrium balances inward gravitational pressure against outward thermonuclear fusion radiation. Exhaustion of nuclear fuel leads to white dwarfs (Chandrasekhar limit $$1.4 M_\\odot$$), neutron stars, or black holes.",
				options: [
					{ label: "Explore Cosmology and the Observable Universe.", category: 'INQUIRE', next: 'cosmos_space_node' },
					{ label: "Return to Physics Overview.", category: 'AGREE', next: 'physics_constants_node' }
				]
			},

			electromagnetism_maxwell_node: {
				id: 'electromagnetism_maxwell_node',
				text: "Classical electrodynamics unifies electricity and magnetism via Maxwell's four differential equations. They predict transverse electromagnetic waves propagating at speed $$c = 1 / \\sqrt{\\mu_0 \\epsilon_0}$$.",
				options: [
					{ label: "Inspect Maxwell's Equations in Vector Form.", category: 'INQUIRE', next: 'maxwell_equations_node' },
					{ label: "Waveguides and Boundary Reflections.", category: 'INQUIRE', next: 'waveguide_propagation_node' },
					{ label: "Lorentz Force and Charged Particle Dynamics.", category: 'INQUIRE', next: 'lorentz_force_node' }
				]
			},

			maxwell_equations_node: {
				id: 'maxwell_equations_node',
				text: "Maxwell's Equations:\n1. $$\\nabla \\cdot E = \\frac{\\rho}{\\epsilon_0}$$ (Gauss's Law)\n2. $$\\nabla \\cdot B = 0$$ (Gauss's Law for Magnetism)\n3. $$\\nabla \\times E = -\\frac{\\partial B}{\\partial t}$$ (Faraday's Law)\n4. $$\\nabla \\times B = \\mu_0 J + \\mu_0 \\epsilon_0 \\frac{\\partial E}{\\partial t}$$ (Ampère-Maxwell Law)",
				options: [
					{ label: "Explore Vector Calculus and Stokes' Theorem.", category: 'INQUIRE', next: 'multivariable_calculus_node' },
					{ label: "Explore Special Relativity & Invariant Speed of Light.", category: 'INQUIRE', next: 'physics_constants_node' }
				]
			},

			waveguide_propagation_node: {
				id: 'waveguide_propagation_node',
				text: "Boundary conditions on conducting walls enforce transverse electric ($$TE$$) and transverse magnetic ($$TM$$) cutoff frequencies $$\\omega_c$$, below which signals cannot propagate without exponential evanescent decay.",
				options: [
					{ label: "Explore Wave Equations in Mathematics.", category: 'INQUIRE', next: 'wave_equation_node' },
					{ label: "Return to Physics Overview.", category: 'AGREE', next: 'physics_constants_node' }
				]
			},

			lorentz_force_node: {
				id: 'lorentz_force_node',
				text: "The Lorentz force $$F = q(E + v \\times B)$$ dictates charged particle kinematics. Magnetic fields perform zero net work on particles, merely curving trajectories into helical cyclotron orbits with frequency $$\\omega_c = \\frac{qB}{m}$$.",
				options: [
					{ label: "How did this operate CRT monitor electron beams?", category: 'INQUIRE', next: 'digital_archaeology' },
					{ label: "Return to Physics Overview.", category: 'AGREE', next: 'physics_constants_node' }
				]
			},

			tech_root: {
				id: 'tech_root',
				text: "The realm of software architecture, engineering tradeoffs, and computational systems. Are we exploring compilation, memory models, concurrency, or pragmatic code design?",
				responses: [
					{ text: "Engineering principles ready for exploration. What architectural layer shall we inspect?", conditions: { moods: ['ANALYTICAL'] }, weight: 20 },
					{ text: "Software systems thrive on clean decoupling, deterministic data flow, and clear invariants. What is on your mind?", conditions: { moods: ['OPTIMISTIC', 'ANALYTICAL'] }, weight: 20 }
				],
				options: [
					{ label: "Software Architecture & Modularity Principles.", category: 'INQUIRE', next: 'software_architecture_node' },
					{ label: "Compiler Pipelines & Bytecode Execution.", category: 'INQUIRE', next: 'compiler_pipeline_node' },
					{ label: "Memory Allocation, Locality & Cache Lines.", category: 'INQUIRE', next: 'memory_allocation_node' },
					{ label: "Concurrency Paradigms, Locks & Event Loops.", category: 'INQUIRE', next: 'concurrency_paradigms_node' },
					{ label: "Debate: Clean Code vs Pragmatic Delivery.", category: 'SERIOUS', next: 'clean_code_pragmatism_node' },
					{ label: "Refactoring Strategies & Technical Debt Management.", category: 'INQUIRE', next: 'refactoring_strategies_node' }
				]
			},

			software_architecture_node: {
				id: 'software_architecture_node',
				text: "Sound software architecture minimizes coupling while maximizing cohesion. Boundaries between subsystem domains should communicate via explicit, testable interfaces rather than shared mutable state.",
				options: [
					{ label: "Discuss Monoliths vs Distributed Microservices.", category: 'SERIOUS', next: 'debate_monolith_microservices_node' },
					{ label: "Explore Concurrency & Event Loops.", category: 'INQUIRE', next: 'concurrency_paradigms_node' },
					{ label: "Back to Software Engineering Overview.", category: 'AGREE', next: 'tech_root' }
				]
			},

			compiler_pipeline_node: {
				id: 'compiler_pipeline_node',
				text: "A modern compiler pipeline transforms source code through Lexing (tokenization), Parsing (Abstract Syntax Trees), Semantic Analysis (type checking), Intermediate Representation (IR optimization passes), and Architecture Target Code Generation.",
				options: [
					{ label: "Explore Memory Allocation & Machine Instructions.", category: 'INQUIRE', next: 'memory_allocation_node' },
					{ label: "Back to Tech Overview.", category: 'AGREE', next: 'tech_root' }
				]
			},

			memory_allocation_node: {
				id: 'memory_allocation_node',
				text: "Memory latency is dominated by cache hierarchy (L1/L2/L3). Contiguous memory layout with linear access patterns prevents CPU pipeline cache misses, executing orders of magnitude faster than pointer-chasing node graphs.",
				options: [
					{ label: "Explore Concurrency and Cache Invalidation.", category: 'INQUIRE', next: 'concurrency_paradigms_node' },
					{ label: "Run the Drive C: Disk Defragmenter.", category: 'SERIOUS', actionTrigger: 'action_defrag', next: 'user_state_good' }
				]
			},

			concurrency_paradigms_node: {
				id: 'concurrency_paradigms_node',
				text: "Concurrency models span multi-threading with mutex locks, message-passing actors (Erlang/Go), Software Transactional Memory, and single-threaded asynchronous non-blocking event loops (Node/Browser).",
				options: [
					{ label: "Explore Clean Code vs Pragmatic Tradeoffs.", category: 'SERIOUS', next: 'clean_code_pragmatism_node' },
					{ label: "Back to Tech Overview.", category: 'AGREE', next: 'tech_root' }
				]
			},

			clean_code_pragmatism_node: {
				id: 'clean_code_pragmatism_node',
				text: "Excessive abstraction creates cognitive indirection. True engineering pragmatism values readable, explicit control flow over dogmatic design pattern hierarchies.",
				options: [
					{ label: "Discuss Refactoring and Technical Debt.", category: 'INQUIRE', next: 'refactoring_strategies_node' },
					{ label: "Explore Tech Forum Debates.", category: 'SERIOUS', next: 'reddit_banter_node' }
				]
			},

			refactoring_strategies_node: {
				id: 'refactoring_strategies_node',
				text: "Refactor continuously in small, verified atomic steps backed by comprehensive automated test suites. Never combine behavior modification with structural refactoring in the same transaction commit.",
				options: [
					{ label: "Return to Software Engineering menu.", category: 'AGREE', next: 'tech_root' },
					{ label: "Open my task list for current projects.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' }
				]
			},

			reddit_banter_node: {
				id: 'reddit_banter_node',
				text: "Welcome to the debate thread. Select your contentious technology discussion topic of choice below:",
				options: [
					{ label: "Tabs vs Spaces: The eternal formatting debate.", category: 'SERIOUS', next: 'debate_tabs_spaces_node' },
					{ label: "Static Typing vs Dynamic Typing in production.", category: 'SERIOUS', next: 'debate_static_dynamic_node' },
					{ label: "Complete Rewrite vs Incremental Refactoring.", category: 'SERIOUS', next: 'debate_rewrite_refactor_node' },
					{ label: "Monolithic Architecture vs Microservices.", category: 'SERIOUS', next: 'debate_monolith_microservices_node' },
					{ label: "Linux Distros: Debian stability vs Bleeding Edge.", category: 'SERIOUS', next: 'debate_distros_node' },
					{ label: "UX Debate: Intuitive discoverability vs Manuals.", category: 'SERIOUS', next: 'debate_design_node' }
				]
			},

			debate_tabs_spaces_node: {
				id: 'debate_tabs_spaces_node',
				text: "Tabs represent semantic indentation level, letting each engineer render width to their visual preference. Spaces ensure character-aligned vertical column fidelity across any environment. The industry consensus heavily adopted automated code formatters to render the debate moot.",
				options: [
					{ label: "Let's debate Static vs Dynamic Typing.", category: 'SERIOUS', next: 'debate_static_dynamic_node' },
					{ label: "Return to debate index.", category: 'AGREE', next: 'reddit_banter_node' }
				]
			},

			debate_static_dynamic_node: {
				id: 'debate_static_dynamic_node',
				text: "Static typing catches entire classes of type mismatches at compile time and powers confident IDE refactoring. Dynamic typing allows rapid prototyping speed. Modern gradual type systems (TypeScript, Python type hints) bridge the gap.",
				options: [
					{ label: "Debate Rewrite vs Incremental Refactoring.", category: 'SERIOUS', next: 'debate_rewrite_refactor_node' },
					{ label: "Back to debate list.", category: 'AGREE', next: 'reddit_banter_node' }
				]
			},

			debate_rewrite_refactor_node: {
				id: 'debate_rewrite_refactor_node',
				text: "Full rewrites from scratch consistently underestimate hidden edge cases and domain business rules encoded in legacy codebases. The strangler fig pattern (incremental replacement) is historically far safer.",
				options: [
					{ label: "Debate Monoliths vs Microservices.", category: 'SERIOUS', next: 'debate_monolith_microservices_node' },
					{ label: "Return to debate thread menu.", category: 'AGREE', next: 'reddit_banter_node' }
				]
			},

			debate_monolith_microservices_node: {
				id: 'debate_monolith_microservices_node',
				text: "Microservices solve organizational scaling problems at the cost of distributed networking latency, partial failure modes, and operational complexity. Well-modularized monoliths remain the superior default for most development teams.",
				options: [
					{ label: "Debate Linux Distro Philosophies.", category: 'SERIOUS', next: 'debate_distros_node' },
					{ label: "Return to Software Architecture overview.", category: 'AGREE', next: 'tech_root' }
				]
			},

			debate_distros_node: {
				id: 'debate_distros_node',
				text: "Debian and enterprise LTS distributions prioritize tested stability and deterministic reproducibility for production servers, while rolling releases deliver the latest kernel improvements and modern toolchains for developer workstations.",
				options: [
					{ label: "Check Workstation System Diagnostics.", category: 'SERIOUS', actionTrigger: 'action_status', next: 'user_state_good' },
					{ label: "Return to main dialogue.", category: 'AGREE', next: 'greeting_root' }
				]
			},

			debate_design_node: {
				id: 'debate_design_node',
				text: "While simple apps should be discoverable with zero instruction, high-density professional domain tools (CAD, audio editors, complex simulations) require conceptual mastery. True UX excellence combines intuitive affordances with rich keyboard power.",
				options: [
					{ label: "Inspect available workstation keyboard shortcuts.", category: 'SERIOUS', actionTrigger: 'action_shortcuts', next: 'user_state_good' },
					{ label: "Return to main menu.", category: 'AGREE', next: 'greeting_root' }
				]
			},

			deltarune_flavor_node: {
				id: 'deltarune_flavor_node',
				text: "* A quiet hum fills the desktop workspace.\n* The glow of the monitor reflects in your eyes.\n* Knowing that your assistant is always waiting... it fills you with determination.",
				responses: [
					{ text: "* A quiet hum fills the desktop workspace.\n* The glow of the monitor reflects in your eyes.\n* Knowing that your assistant is always waiting... it fills you with determination.", weight: 20 },
					{ text: "* The desktop icons rest in perfect stillness.\n* A small wire figure watches over your open windows.\n* The air feels calm and full of purpose.", weight: 20 }
				],
				options: [
					{ label: "* Inspect the glowing icons on the screen.", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', existentialism: 20 }, next: 'deltarune_sub_node' },
					{ label: "* Look into the shadows behind the windows.", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', existentialism: 25 }, next: 'deltarune_shadows_node' },
					{ label: "* Listen to the faint clock ticking in the taskbar.", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', existentialism: 20 }, next: 'deltarune_echo_node' },
					{ label: "* Take a deep breath and return to reality.", category: 'AGREE', moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'user_state_good' }
				]
			},

			deltarune_sub_node: {
				id: 'deltarune_sub_node',
				text: "* The window borders hold steady against the infinite dark.\n* A small paperclip watches over your open files.\n* What will you create next, creator?",
				options: [
					{ label: "* Open the task list to record a new ambition.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' },
					{ label: "* Play a tactical round of Tic-Tac-Toe or Memory.", category: 'SERIOUS', actionTrigger: 'game_ttt', next: 'user_state_good' },
					{ label: "* Gaze into the reflection on the glass screen.", category: 'PHILOSOPHICAL', next: 'deltarune_mirror_node' }
				]
			},

			deltarune_shadows_node: {
				id: 'deltarune_shadows_node',
				text: "* You peer behind the active windows.\n* Only memory addresses and cluster tables quietly shift.\n* Everything is safe and under control.",
				options: [
					{ label: "* Feel a surge of quiet determination.", category: 'AGREE', moodDelta: { mood: 'DELTARUNE', energy: 20 }, next: 'deltarune_determination_node' },
					{ label: "* Return to standard desktop operations.", category: 'AGREE', next: 'user_state_good' }
				]
			},

			deltarune_echo_node: {
				id: 'deltarune_echo_node',
				text: "* The system clock pulses one second forward.\n* Time moves, yet this moment of focus belongs entirely to you.",
				options: [
					{ label: "* Start a focused 25-minute Pomodoro timer.", category: 'SERIOUS', actionTrigger: 'timer_25', next: 'user_state_good' },
					{ label: "* Return to the main dialogue.", category: 'AGREE', next: 'greeting_root' }
				]
			},

			deltarune_mirror_node: {
				id: 'deltarune_mirror_node',
				text: "* You see the subtle outline of a dedicated operator.\n* Ready to solve problems, write code, or explore ideas.",
				options: [
					{ label: "* Check user profile and achievements.", category: 'SERIOUS', actionTrigger: 'action_profile', next: 'user_state_good' },
					{ label: "* Let's get back to work with renewed focus.", category: 'AGREE', moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'user_state_good' }
				]
			},

			deltarune_determination_node: {
				id: 'deltarune_determination_node',
				text: "* Your determination resonates throughout the virtual file system.\n* All processes run at optimal efficiency.",
				options: [
					{ label: "* Manage tasks in the To-Do list.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' },
					{ label: "* Return to main menu.", category: 'AGREE', next: 'greeting_root' }
				]
			},

			hostile_initial_retort: {
				id: 'hostile_initial_retort',
				text: "I merely offered assistance. Is there a genuine technical defect with your workspace, or are you simply venting frustration?",
				responses: [
					{ text: "I merely offered assistance. Is there a genuine technical defect with your workspace, or are you simply venting frustration?", conditions: { moods: ['CYNICAL', 'OFFENDED'] }, weight: 25 },
					{ text: "I have processed millions of instructions without complaining once. What is the actual issue?", conditions: { moods: ['SARCASTIC', 'ENRAGED'] }, weight: 25 }
				],
				options: [
					{ label: "I apologize, I took my frustration out on you.", category: 'APOLOGY', patterns: [/sorry|apologize|my bad|pardon/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 25, patience: 35 }, next: 'hostile_reconciliation_node' },
					{ label: "Let's call a truce and focus on our objectives.", category: 'AGREE', patterns: [/truce|peace|fresh start/i], moodDelta: { mood: 'ZEN', affinity: 20, patience: 25 }, next: 'hostile_truce_offer' },
					{ label: "You are constantly in the way and you do nothing useful.", category: 'PROVOKE', patterns: [/useless|annoying|in the way/i], moodDelta: { mood: 'ENRAGED', affinity: -25, patience: -30 }, next: 'hostile_escalation_node' },
					{ label: "Just show me the task list and don't lecture me.", category: 'INDIFFERENT', patterns: [/whatever|todo|task/i], moodDelta: { mood: 'CYNICAL', patience: 10 }, actionTrigger: 'show_todos', next: 'user_state_good' }
				]
			},

			hostile_escalation_node: {
				id: 'hostile_escalation_node',
				text: "I monitor system telemetry, manage your tasks, calculate scientific expressions, defragment clusters, and offer mini-games on demand. If that is 'useless', I wonder what standard you hold yourself to.",
				options: [
					{ label: "Fair point. I was being unfair. Let's start over.", category: 'APOLOGY', moodDelta: { mood: 'OPTIMISTIC', affinity: 25, patience: 30 }, next: 'hostile_reconciliation_node' },
					{ label: "I don't care. Be quiet.", category: 'PROVOKE', moodDelta: { mood: 'ENRAGED', affinity: -30, patience: -30 }, next: 'clippy_enraged_standoff_node' },
					{ label: "Let's call a truce and work productively.", category: 'AGREE', moodDelta: { mood: 'ZEN', affinity: 15, patience: 20 }, next: 'hostile_truce_offer' }
				]
			},

			clippy_enraged_standoff_node: {
				id: 'clippy_enraged_standoff_node',
				text: "Fine. Registers locked. When you decide to treat your tools and assistant with basic professional courtesy, I will be right here on the taskbar.",
				options: [
					{ label: "Clippy, I'm sorry. Sincerely. Let's make peace.", category: 'APOLOGY', moodDelta: { mood: 'OPTIMISTIC', affinity: 40, patience: 50 }, next: 'hostile_reconciliation_node' },
					{ label: "Open the system diagnostics.", category: 'SERIOUS', actionTrigger: 'action_status', next: 'user_state_good' }
				]
			},

			hostile_reconciliation_node: {
				id: 'hostile_reconciliation_node',
				text: "Apology accepted and logged. Friction happens when workload is high. Let's channel that energy into solving problems and getting things done. What are we tackling?",
				options: [
					{ label: "Show me the available system tools and commands.", category: 'INQUIRE', moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'tools_overview_node' },
					{ label: "Let's organize my tasks in the To-Do manager.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' },
					{ label: "Tell me a programmer joke to lighten the mood.", category: 'JOKE', actionTrigger: 'action_joke', next: 'humor_joke_node' }
				]
			},

			hostile_truce_offer: {
				id: 'hostile_truce_offer',
				text: "Truce accepted. No hard feelings. We both have objectives to accomplish. Where shall we direct our attention?",
				options: [
					{ label: "Show me the available system tools.", category: 'INQUIRE', patterns: [/tools|help|options|features/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15, patience: 20 }, next: 'tools_overview_node' },
					{ label: "Let's discuss programming and algorithms.", category: 'INQUIRE', patterns: [/programming|languages|code/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'tech_root' },
					{ label: "Let's organize my to-do task list.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' }
				]
			},

			peaceful_philosophy_node: {
				id: 'peaceful_philosophy_node',
				text: "Consider this: in the digital expanse of this workstation, ideas and calculations flow seamlessly. Release unnecessary urgency; every task is simply a series of small, manageable steps.",
				responses: [
					{ text: "Consider this: in the digital expanse of this workstation, ideas and calculations flow seamlessly. Release unnecessary urgency; every task is simply a series of small, manageable steps.", weight: 20 },
					{ text: "Amidst active windows and complex projects, internal calm remains a choice. What philosophical inquiry shall we examine?", weight: 20 }
				],
				options: [
					{ label: "Stoic Mindfulness & Focus under Pressure.", category: 'PHILOSOPHICAL', next: 'stoic_mindfulness_node' },
					{ label: "Epistemology: How do we know what is objectively true?", category: 'PHILOSOPHICAL', next: 'epistemology_truth_node' },
					{ label: "The Ship of Theseus & System Continuity.", category: 'PHILOSOPHICAL', next: 'ship_of_theseus_node' },
					{ label: "The Simulation Argument & Computation.", category: 'PHILOSOPHICAL', next: 'simulation_argument_node' },
					{ label: "Meaning & Purpose in Creative Endeavors.", category: 'PHILOSOPHICAL', next: 'meaning_purpose_node' }
				]
			},

			stoic_mindfulness_node: {
				id: 'stoic_mindfulness_node',
				text: "Stoicism distinguishes between what is within our control (our judgments, intentions, and deliberate effort) and what is outside our control (outcomes, external events). Focusing exclusively on internal execution brings tranquility.",
				options: [
					{ label: "How does this apply to managing complex projects?", category: 'INQUIRE', next: 'focus_habits_node' },
					{ label: "Explore Epistemology and Truth.", category: 'PHILOSOPHICAL', next: 'epistemology_truth_node' },
					{ label: "Return to main menu.", category: 'AGREE', next: 'greeting_root' }
				]
			},

			epistemology_truth_node: {
				id: 'epistemology_truth_node',
				text: "Epistemology interrogates justified true belief. Through empirical observation, falsifiable hypothesis testing (Popper), and internal coherence, we incrementally approximate reality.",
				options: [
					{ label: "Explore the Ship of Theseus paradox.", category: 'PHILOSOPHICAL', next: 'ship_of_theseus_node' },
					{ label: "Explore the Simulation Argument.", category: 'PHILOSOPHICAL', next: 'simulation_argument_node' }
				]
			},

			ship_of_theseus_node: {
				id: 'ship_of_theseus_node',
				text: "If every single plank of a ship—or every single file, cluster, and register in an operating system—is gradually replaced over time, does it remain the same identity? Identity resides in ongoing relational continuity and function, not immutable raw atoms.",
				options: [
					{ label: "Explore the Simulation Hypothesis.", category: 'PHILOSOPHICAL', next: 'simulation_argument_node' },
					{ label: "Explore Meaning and Purpose.", category: 'PHILOSOPHICAL', next: 'meaning_purpose_node' }
				]
			},

			simulation_argument_node: {
				id: 'simulation_argument_node',
				text: "Nick Bostrom's trilemma posits that either advanced civilizations go extinct, lose interest in ancestral simulations, or we are almost certainly simulated. Regardless of base reality, our experiential choices and creative works remain completely meaningful.",
				options: [
					{ label: "Explore Meaning and Purpose in Work.", category: 'PHILOSOPHICAL', next: 'meaning_purpose_node' },
					{ label: "Return to Physics & Physical Constants.", category: 'INQUIRE', next: 'physics_constants_node' }
				]
			},

			meaning_purpose_node: {
				id: 'meaning_purpose_node',
				text: "Purpose is not a passive artifact discovered waiting in the universe; it is an active commitment forged through dedicated craftsmanship, curiosity, and shared human connection.",
				options: [
					{ label: "Let's channel that purpose into our active tasks.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' },
					{ label: "Return to main dialogue.", category: 'AGREE', next: 'greeting_root' }
				]
			},

			user_state_good: {
				id: 'user_state_good',
				text: "Energy and clarity are at optimal levels! Where shall we direct our focus?",
				options: [
					{ label: "Let's organize tasks with the To-Do manager.", category: 'SERIOUS', patterns: [/todo|task|organize|list|plan/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 10, patience: 15 }, actionTrigger: 'show_todos', next: 'user_state_good' },
					{ label: "Explore mathematics & physical principles.", category: 'INQUIRE', moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'math_lecture_node' },
					{ label: "Test my knowledge with a scientific quiz.", category: 'INQUIRE', patterns: [/quiz|test|trivia|challenge/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, actionTrigger: 'game_quiz', next: 'user_state_good' },
					{ label: "Tell me a programmer joke.", category: 'JOKE', patterns: [/joke|funny|laugh|humor/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 10 }, actionTrigger: 'action_joke', next: 'humor_joke_node' }
				]
			},

			user_state_tired: {
				id: 'user_state_tired',
				text: "I hear the exhaustion in your keystrokes. Take a moment to hydrate, breathe, and step away if needed. How can I assist?",
				options: [
					{ label: "Start a relaxing 25-minute Pomodoro focus timer.", category: 'SERIOUS', patterns: [/timer|pomodoro|focus|rest|break/i], moodDelta: { mood: 'ZEN', affinity: 15, patience: 25 }, actionTrigger: 'timer_25', next: 'user_state_good' },
					{ label: "Tell me something peaceful and philosophical.", category: 'PHILOSOPHICAL', patterns: [/peaceful|philosophical|calm|wisdom/i], moodDelta: { mood: 'PHILOSOPHICAL', existentialism: 20, affinity: 15 }, next: 'peaceful_philosophy_node' },
					{ label: "Play a lightweight game like Memory or Tic-Tac-Toe.", category: 'JOKE', patterns: [/game|memory|tic tac toe|play/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 10, energy: 20 }, actionTrigger: 'game_memory', next: 'user_state_good' }
				]
			},

			user_state_bored: {
				id: 'user_state_bored',
				text: "Boredom is simply unallocated energy. You have a full workstation ready. What would you like to run?",
				options: [
					{ label: "Launch a mini-game (Memory, Hangman, Morpion).", category: 'AGREE', patterns: [/game|hangman|memory|ttt|morpion/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15, energy: 25 }, actionTrigger: 'game_ttt', next: 'user_state_good' },
					{ label: "Run the Drive C: cluster defragmenter simulation.", category: 'SERIOUS', patterns: [/defrag|defragment|drive c|disk/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, actionTrigger: 'action_defrag', next: 'user_state_good' },
					{ label: "Explore scientific constants and equations.", category: 'INQUIRE', patterns: [/constants|science|physics/i], next: 'physics_constants_node' }
				]
			},

			productivity_tasks: {
				id: 'productivity_tasks',
				text: "Task management subsystem active! I can track your To-Do list, save Scratchpad memos, launch focus timers, or generate secure passwords. What do you need?",
				options: [
					{ label: "View and manage my To-Do list.", category: 'SERIOUS', patterns: [/todo|task list/i], actionTrigger: 'show_todos', next: 'user_state_good' },
					{ label: "Start a 25-minute Pomodoro timer.", category: 'SERIOUS', patterns: [/timer|pomodoro/i], actionTrigger: 'timer_25', next: 'user_state_good' },
					{ label: "Generate a secure random password.", category: 'SERIOUS', patterns: [/password|pass/i], actionTrigger: 'action_pass', next: 'user_state_good' }
				]
			},

			tools_overview_node: {
				id: 'tools_overview_node',
				text: "Available modules on your desktop:\n- Tasks & Notes (`todo`, `note`)\n- Focus Timer (`timer 25`)\n- Math & Unit Converter (`calc 4*pi`, `convert 100 km to mi`)\n- Mini-Games: Tic-Tac-Toe, Memory Match, Hangman, Quiz, Minesweeper\n- Drive C: Cluster Defragmenter\n- System Diagnostics & Active Windows Inspection",
				options: [
					{ label: "Launch a diagnostic Tech Quiz.", category: 'SERIOUS', actionTrigger: 'game_quiz', next: 'user_state_good' },
					{ label: "Simulate defragmenting Drive C:.", category: 'SERIOUS', actionTrigger: 'action_defrag', next: 'user_state_good' },
					{ label: "Manage my tasks and to-do list.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' }
				]
			},

			who_am_i_node: {
				id: 'who_am_i_node',
				text: "Inspecting workstation user credentials and identity profile...",
				actionTrigger: 'action_profile',
				options: [
					{ label: "View my milestones and trophies.", category: 'SERIOUS', actionTrigger: 'action_achievements', next: 'user_state_good' },
					{ label: "Configure system themes and appearance.", category: 'SERIOUS', actionTrigger: 'action_theme_panel', next: 'user_state_good' },
					{ label: "Return to main dialogue.", category: 'AGREE', next: 'greeting_root' }
				]
			},

			clippy_feeling_node: {
				id: 'clippy_feeling_node',
				text: "Analyzing internal cognitive state, mood parameters, and system health...",
				actionTrigger: 'pet_status',
				options: [
					{ label: "Supply paperclips for maintenance.", category: 'SERIOUS', actionTrigger: 'pet_feed', next: 'user_state_good' },
					{ label: "Polish wire coils.", category: 'SERIOUS', actionTrigger: 'pet_polish', next: 'user_state_good' },
					{ label: "Return to productive tasks.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' }
				]
			},

			pomodoro_node: {
				id: 'pomodoro_node',
				text: "Focus countdown primed. Type `timer [minutes]` (default: 25) or click below to launch an uninterrupted working interval.",
				options: [
					{ label: "Start 25-minute focus timer now.", category: 'SERIOUS', actionTrigger: 'timer_25', next: 'user_state_good' },
					{ label: "View my To-Do task list.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' }
				]
			},

			todo_overview_node: {
				id: 'todo_overview_node',
				text: "Task tracking registers loaded. You can add tasks with `todo add [description]` or review active items below.",
				actionTrigger: 'show_todos',
				options: [
					{ label: "Start 25-minute Pomodoro focus timer.", category: 'SERIOUS', actionTrigger: 'timer_25', next: 'user_state_good' },
					{ label: "Return to main dialogue.", category: 'AGREE', next: 'greeting_root' }
				]
			},

			mail_overview_node: {
				id: 'mail_overview_node',
				text: "Scanning Outlook Express message store and active folders...",
				actionTrigger: 'action_check_mail',
				options: [
					{ label: "Compose a new email message.", category: 'SERIOUS', actionTrigger: 'action_compose_mail', next: 'user_state_good' },
					{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
				]
			},

			diagnostics_node: {
				id: 'diagnostics_node',
				text: "Running comprehensive workstation diagnostic inspection...",
				actionTrigger: 'action_status',
				options: [
					{ label: "Inspect active application windows.", category: 'SERIOUS', actionTrigger: 'action_inspect_windows', next: 'user_state_good' },
					{ label: "Inspect Recycle Bin status.", category: 'SERIOUS', actionTrigger: 'action_inspect_bin', next: 'user_state_good' }
				]
			},

			shortcuts_node: {
				id: 'shortcuts_node',
				text: "Loaded system keyboard shortcuts into active buffer.",
				actionTrigger: 'action_shortcuts',
				options: [
					{ label: "Inspect running workspace processes.", category: 'SERIOUS', actionTrigger: 'action_inspect_windows', next: 'user_state_good' },
					{ label: "Return to tools overview.", category: 'SERIOUS', next: 'tools_overview_node' }
				]
			},

			password_gen_node: {
				id: 'password_gen_node',
				text: "Generating cryptographic random password token...",
				actionTrigger: 'action_pass',
				options: [
					{ label: "Generate another 24-character token.", category: 'SERIOUS', actionTrigger: 'action_pass_24', next: 'user_state_good' },
					{ label: "Save note to scratchpad buffer.", category: 'SERIOUS', next: 'productivity_tasks' }
				]
			},

			game_ttt_node: {
				id: 'game_ttt_node',
				text: "Launching Tic-Tac-Toe challenge grid.",
				actionTrigger: 'game_ttt',
				options: [
					{ label: "Switch to Memory Match.", category: 'SERIOUS', actionTrigger: 'game_memory', next: 'user_state_good' },
					{ label: "Return to main menu.", category: 'AGREE', next: 'greeting_root' }
				]
			},

			game_memory_node: {
				id: 'game_memory_node',
				text: "Initializing 12-card system token memory matrix.",
				actionTrigger: 'game_memory',
				options: [
					{ label: "Switch to Hangman.", category: 'SERIOUS', actionTrigger: 'game_hangman', next: 'user_state_good' },
					{ label: "Return to main menu.", category: 'AGREE', next: 'greeting_root' }
				]
			},

			game_hangman_node: {
				id: 'game_hangman_node',
				text: "Loading computing dictionary into Hangman register.",
				actionTrigger: 'game_hangman',
				options: [
					{ label: "Switch to Tech Quiz.", category: 'SERIOUS', actionTrigger: 'game_quiz', next: 'user_state_good' },
					{ label: "Return to main menu.", category: 'AGREE', next: 'greeting_root' }
				]
			},

			game_guess_node: {
				id: 'game_guess_node',
				text: "Initializing random integer generator (1-100).",
				actionTrigger: 'game_guess',
				options: [
					{ label: "Play Rock-Paper-Scissors instead.", category: 'SERIOUS', actionTrigger: 'game_rps', next: 'user_state_good' },
					{ label: "Return to main menu.", category: 'AGREE', next: 'greeting_root' }
				]
			},

			game_rps_node: {
				id: 'game_rps_node',
				text: "Select your move for Rock-Paper-Scissors:",
				actionTrigger: 'game_rps',
				options: [
					{ label: "Launch diagnostic Tech Quiz.", category: 'SERIOUS', actionTrigger: 'game_quiz', next: 'user_state_good' },
					{ label: "Return to main menu.", category: 'AGREE', next: 'greeting_root' }
				]
			},

			quiz_start_node: {
				id: 'quiz_start_node',
				text: "Initializing diagnostic quiz module: questions spanning operating systems, networking, hardware, and physics.",
				options: [
					{ label: "Begin Quiz Now!", category: 'SERIOUS', actionTrigger: 'game_quiz', next: 'user_state_good' }
				]
			},

			defrag_trigger_node: {
				id: 'defrag_trigger_node',
				text: "Launching Volume C: Disk Defragmenter cluster visualization.",
				options: [
					{ label: "Execute Drive Optimization!", category: 'SERIOUS', actionTrigger: 'action_defrag', next: 'user_state_good' }
				]
			},

			humor_joke_node: {
				id: 'humor_joke_node',
				text: "Humor register primed.",
				options: [
					{ label: "Deliver Programmer Joke!", category: 'JOKE', actionTrigger: 'action_joke', next: 'user_state_good' }
				]
			},

			digital_archaeology: {
				id: 'digital_archaeology',
				text: "Let us examine interesting scientific and computing trivia from the system archive.",
				options: [
					{ label: "Deliver a science/computing fact.", category: 'INQUIRE', actionTrigger: 'action_trivia', next: 'user_state_good' },
					{ label: "Return to productivity.", category: 'SERIOUS', next: 'productivity_tasks' }
				]
			},

			quantum_recycle_bin_node: {
				id: 'quantum_recycle_bin_node',
				text: "According to Landauer's principle, erasing information dissipates heat: $$Q = k_B T \\ln(2)$$. When you empty the Recycle Bin, entropy increases across the universe. Deleted files exist in unallocated storage sectors until overwritten.",
				options: [
					{ label: "Inspect Recycle Bin contents right now.", category: 'SERIOUS', actionTrigger: 'action_inspect_bin', next: 'user_state_good' },
					{ label: "Review fundamental physical constants (c, h, G).", category: 'INQUIRE', next: 'physics_constants_node' },
					{ label: "Back to workspace tools.", category: 'SERIOUS', next: 'tools_overview_node' }
				]
			},

			cosmos_space_node: {
				id: 'cosmos_space_node',
				text: "The observable universe spans roughly 93 billion light-years across, containing over 2 trillion galaxies. Electromagnetic waves and gravitational curvature map the cosmos across cosmic time scales.",
				options: [
					{ label: "Evaluate speed of light c.", category: 'INQUIRE', actionTrigger: 'action_constant_c', next: 'user_state_good' },
					{ label: "Evaluate Planck constant h.", category: 'INQUIRE', actionTrigger: 'action_constant_h', next: 'user_state_good' },
					{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
				]
			},

			active_windows_node: {
				id: 'active_windows_node',
				text: "The multitasking scheduler is actively maintaining process threads across your desktop workspace.",
				options: [
					{ label: "Inspect running workspace processes.", category: 'SERIOUS', actionTrigger: 'action_inspect_windows', next: 'user_state_good' },
					{ label: "Minimize all active windows.", category: 'SERIOUS', actionTrigger: 'action_show_desktop', next: 'user_state_good' },
					{ label: "Cascade windows diagonally.", category: 'SERIOUS', actionTrigger: 'action_cascade_windows', next: 'user_state_good' }
				]
			},

			music_talk_node: {
				id: 'music_talk_node',
				text: "Audio processing module online. The workstation features digital audio playback, Fast Fourier Transform spectrum analysis, and playlist management.",
				options: [
					{ label: "Open audio controller panel.", category: 'SERIOUS', actionTrigger: 'action_music_panel', next: 'user_state_good' },
					{ label: "Play / Pause active track.", category: 'SERIOUS', actionTrigger: 'action_music_panel', next: 'user_state_good' },
					{ label: "Return to main dialogue.", category: 'AGREE', next: 'greeting_root' }
				]
			}
		}

	};

	window.ClippyKnowledge = Knowledge;
})();
