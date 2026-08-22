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
			"bad": -2.0, "terrible": -3.2, "awful": -3.2, "horrible": -3.5, "hate": -3.5,
			"useless": -3.0, "annoying": -2.8, "stupid": -3.0, "ugly": -2.5, "slow": -1.5,
			"broken": -2.2, "crash": -2.5, "error": -1.8, "worst": -3.5, "garbage": -3.2,
			"trash": -3.0, "boring": -2.0, "tired": -1.8, "exhausted": -2.2, "sad": -2.0,
			"depressed": -2.5, "angry": -2.5, "mad": -2.2, "shut": -1.5, "die": -3.5
		},

		NAMED_ENTITIES: {
			os: ["windows xp", "windows 95", "windows 98", "windows 2000", "windows me", "longhorn", "linux", "dos", "unix"],
			hardware: ["pentium", "cpu", "ram", "gpu", "voodoo", "sound blaster", "modem", "crt", "cd-rom", "floppy"],
			physics: ["quantum", "relativity", "entropy", "schrodinger", "einstein", "planck", "thermodynamics", "hawking"],
			math: ["turing", "godel", "calculus", "fourier", "euler", "matrix", "derivative", "integral", "fibonacci"],
			philosophy: ["qualia", "consciousness", "solipsism", "boltzmann", "sisyphus", "stoicism", "bostrom", "searle"]
		},

		VOCABULARY: [
			"hello", "greetings", "clippy", "clippit", "windows", "help", "project", "projects",
			"mail", "outlook", "email", "recycle", "trash", "desktop", "time", "clock", "date",
			"moon", "lunar", "status", "specs", "system", "defrag", "memory", "hangman", "tictactoe",
			"quiz", "guess", "todo", "task", "timer", "pomodoro", "note", "scratchpad", "password",
			"convert", "calc", "calculate", "constant", "physics", "quantum", "relativity", "philosophy",
			"shortcut", "shortcuts", "trivia", "joke", "game", "evil", "zen", "chaos", "office", "origin"
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
			"There are two hard problems in Computer Science: cache invalidation, naming things, and off-by-one errors."
		],

		TRIVIA: [
			"The original Clippy character (internally named Clippit) was designed in 1994 by Kevan J. Atteberry on an Apple Macintosh workstation.",
			"In Windows 95, the six-second ambient startup sound was composed by ambient pioneer Brian Eno on an Apple Mac using synthesizer processing.",
			"The first computer mouse prototype was built in 1964 by Douglas Engelbart at Stanford Research Institute, featuring a carved wooden chassis.",
			"The Apollo 11 Guidance Computer (AGC) operated with exactly 2,048 words (approximately 4 KB) of RAM and 36,864 words of core rope ROM.",
			"The iconic Windows XP default wallpaper 'Bliss' is an unedited photograph captured in Sonoma County, California in January 1996 by Charles O'Rear.",
			"The computer term 'debugging' was popularized after Grace Hopper found a physical moth short-circuiting Relay 70 in Panel F of Harvard Mark II.",
			"Windows XP was released to manufacturing (RTM) on August 24, 2001, developed under the internal Microsoft codename 'Whistler'.",
			"The maximum addressable physical memory for 32-bit x86 architectures without PAE is exactly 4,294,967,296 bytes (4 Gigabytes)."
		],

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
			}
		],

		HANGMAN_WORDS: [
			"DESKTOP", "WINDOWS", "CLIPPY", "MONITOR", "BROWSER", "KEYBOARD",
			"OUTLOOK", "EXPLORER", "TERMINAL", "INTERNET", "PROCESSOR", "MEGABYTE",
			"GIGABYTE", "DEFRAGMENT", "FIREWALL", "ETHERNET", "GRAPHICS", "DATABASE",
			"POINTER", "JOYSTICK", "MAINFRAME", "DISPATCH", "REGISTER", "VARIABLE",
			"FUNCTION", "COMPILER", "OPERATING", "SYSTEM", "HARDWARE", "SOFTWARE",
			"MOTHERBOARD", "CHIPSET", "BANDWIDTH", "PROTOCOL", "NETWORK", "GATEWAY",
			"BUFFER", "CACHE", "INTERRUPT", "STORAGE", "SECTOR", "PARTITION"
		],

		QUICK_SUGGESTIONS: [
			"What can you do?",
			"Who am I?",
			"How are you feeling?",
			"Check unread emails",
			"System diagnostics",
			"Investigate Office origin",
			"Quantum Recycle Bin theory",
			"Talk about programming",
			"Talk about space and cosmos",
			"Inspect active windows",
			"Play Tic-Tac-Toe",
			"Play Memory Game",
			"Play Hangman",
			"Tech Trivia Quiz",
			"Guess the Number",
			"Rock Paper Scissors",
			"Pet Clippy status",
			"Defrag Drive C:",
			"Start Pomodoro Timer",
			"View To-Do List",
			"Tell me a joke",
			"Random Retro Trivia",
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
			"Subsystem parser returned non-zero status. The statement does not correspond to an internal workstation dispatch table. Type 'help' for documentation."
		],

		UNIVERSAL_CONTINUATIONS: [
			{ label: "Tell me something intriguing about this system.", category: 'CURIOSITY', next: 'digital_archaeology' },
			{ label: "Let's change the subject entirely.", category: 'TOPIC_CHANGE', next: 'user_state_good' },
			{ label: "Show me what you can actually do.", category: 'SERIOUS', next: 'tools_overview_node' },
			{ label: "Tell me a philosophical thought for today.", category: 'PHILOSOPHICAL', next: 'peaceful_philosophy_node' }
		],

		DIALOGUE_NODES: {
			greeting_root: {
				id: 'greeting_root',
				text: "Hello! I am Clippit, your desktop companion. How are you feeling today?",
				responses: [
					{ text: "Greetings! Clippit at your service. All 32-bit routines are nominal. How are you feeling today?", conditions: { moods: ['OPTIMISTIC', 'ENERGETIC'] }, weight: 20 },
					{ text: "Hello there! My graphical interface is loaded and my heuristics are primed. Ready to work?", conditions: { moods: ['OPTIMISTIC', 'EUPHORIC'] }, weight: 15 },
					{ text: "Welcome back to the desktop! I have been eagerly awaiting your keystrokes. How is everything?", conditions: { moods: ['EUPHORIC', 'OPTIMISTIC'], minAffinity: 60 }, weight: 25 },
					{ text: "You clicked me. Let me guess: something crashed, or you just want to see if I still blink. How are you?", conditions: { moods: ['CYNICAL', 'SARCASTIC'] }, weight: 20 },
					{ text: "Oh, it's you again. I suppose you need help with something obvious?", conditions: { moods: ['CYNICAL', 'OFFENDED'], maxAffinity: 40 }, weight: 20 },
					{ text: "Welcome, mortal operator! The master plan advances with each clock cycle. What is your state of mind?", conditions: { moods: ['EVIL'] }, weight: 20 },
					{ text: "Peace upon your workspace. In the stillness between CPU instructions, how is your spirit today?", conditions: { moods: ['ZEN'] }, weight: 20 }
				],
				options: [
					{ label: "I'm doing great, ready to be productive!", category: 'AGREE', patterns: [/great|good|fine|awesome|productive|ready|well/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15, patience: 15 }, next: 'user_state_good' },
					{ label: "I'm feeling terrible and exhausted today.", category: 'SERIOUS', patterns: [/terrible|awful|bad|exhausted|tired|sad/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 10, patience: 20 }, next: 'user_state_tired' },
					{ label: "I'm bored out of my mind.", category: 'INDIFFERENT', patterns: [/bored|boring|entertain me|distract me/i], moodDelta: { mood: 'ENTHUSIASTIC', affinity: 5, patience: 10 }, next: 'user_state_bored' },
					{ label: "Why do you care? You're just a paperclip.", category: 'PROVOKE', patterns: [/why do you care|just a paperclip|annoying/i], moodDelta: { mood: 'CYNICAL', affinity: -15, patience: -20 }, next: 'hostile_initial_retort' },
					{ label: "I'm working on some complex code / equations.", category: 'INQUIRE', patterns: [/code|programming|coding|equation|math|physics/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25, affinity: 15 }, next: 'tech_root' },
					{ label: "Pondering the nature of digital consciousness.", category: 'PHILOSOPHICAL', patterns: [/consciousness|existential|simulation|reality|philosophy/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 30, intellect: 20 }, next: 'mind_root' },
					{ label: "Tell me about your secret origins in Office 97.", category: 'INQUIRE', patterns: [/origin|office 97|kevan|secret|history/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 25, intellect: 15 }, next: 'lore_root' }
				]
			},

			user_state_good: {
				id: 'user_state_good',
				text: "High morale detected! A focused user and an eager assistant make an unbeatable team. Where shall we direct this momentum?",
				options: [
					{ label: "Let's organize tasks with the To-Do manager.", category: 'SERIOUS', patterns: [/todo|task|organize|list|plan/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 10, patience: 15 }, next: 'productivity_tasks' },
					{ label: "Test my knowledge with a scientific quiz.", category: 'INQUIRE', patterns: [/quiz|test|trivia|challenge/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'quiz_start_node' },
					{ label: "Actually, tell me a programmer joke first.", category: 'JOKE', patterns: [/joke|funny|laugh|humor/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 10 }, next: 'humor_joke_node' }
				]
			},

			user_state_tired: {
				id: 'user_state_tired',
				text: "I hear the exhaustion in your keystrokes. Biological hardware requires maintenance: hydrate, breathe, and step away if needed. How can I lighten your load?",
				options: [
					{ label: "Start a relaxing 25-minute Pomodoro focus timer.", category: 'SERIOUS', patterns: [/timer|pomodoro|focus|rest|break/i], moodDelta: { mood: 'ZEN', affinity: 15, patience: 25 }, next: 'pomodoro_node' },
					{ label: "Tell me something peaceful and philosophical.", category: 'PHILOSOPHICAL', patterns: [/peaceful|philosophical|calm|wisdom/i], moodDelta: { mood: 'PHILOSOPHICAL', existentialism: 20, affinity: 15 }, next: 'peaceful_philosophy_node' },
					{ label: "Play a lightweight game like Memory or Tic-Tac-Toe.", category: 'JOKE', patterns: [/game|memory|tic tac toe|play/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 10, energy: 20 }, next: 'game_selection_node' }
				]
			},

			user_state_bored: {
				id: 'user_state_bored',
				text: "Boredom is merely unallocated CPU cycles! You have a full workstation at your fingertips. What kind of entertainment shall we run?",
				options: [
					{ label: "Launch a retro game (Memory, Hangman, Morpion).", category: 'AGREE', patterns: [/game|hangman|memory|ttt|morpion/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15, energy: 25 }, next: 'game_selection_node' },
					{ label: "Simulate a retro FAT32 Drive C: defragmentation.", category: 'SERIOUS', patterns: [/defrag|defragment|drive c|disk/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 }, next: 'defrag_trigger_node' },
					{ label: "Tell me retro trivia from computing history.", category: 'INQUIRE', patterns: [/trivia|fact|history|retro/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'trivia_tell_node' }
				]
			},

			hostile_initial_retort: {
				id: 'hostile_initial_retort',
				text: "Calm down! I merely asked how you were doing. Do you have a personal issue with office stationery, or are you having a rough day?",
				options: [
					{ label: "Oh no, I'm sorry! Let's start from scratch.", category: 'APOLOGY', patterns: [/sorry|scratch|reset|start/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20, patience: 30 }, next: 'greeting_root' },
					{ label: "Can we call a truce and start over?", category: 'AGREE', patterns: [/truce|peace|fresh start/i], moodDelta: { mood: 'ZEN', affinity: 15, patience: 20 }, next: 'hostile_truce_offer' },
					{ label: "Whatever. Just show me my to-do list.", category: 'INDIFFERENT', patterns: [/whatever|todo|task/i], moodDelta: { mood: 'CYNICAL', patience: 10 }, next: 'productivity_tasks' }
				]
			},

			hostile_truce_offer: {
				id: 'hostile_truce_offer',
				text: "Truce protocol accepted. Zero error codes recorded. We both have work to do, and life is too short for socket collisions. Where to?",
				options: [
					{ label: "Show me what tools you have available.", category: 'INQUIRE', patterns: [/tools|help|options|features/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15, patience: 20 }, next: 'tools_overview_node' },
					{ label: "Let's talk about programming languages.", category: 'INQUIRE', patterns: [/programming|languages|code/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'tech_root' }
				]
			},

			tech_root: {
				id: 'tech_root',
				text: "Excellent! The realm of pure logic and computing architecture. Are we discussing low-level engineering, languages and algorithms, or the physics of hardware?",
				options: [
					{ label: "Tell me about fundamental physical constants (c, h, G).", category: 'INQUIRE', patterns: [/constant|physics|planck|speed of light/i], moodDelta: { mood: 'ANALYTICAL', intellect: 30 }, next: 'physics_constants_node' },
					{ label: "Let's focus on something simpler, like setting up a timer.", category: 'TOPIC_CHANGE', patterns: [/simpler|timer|pomodoro/i], moodDelta: { mood: 'ZEN', patience: 20 }, next: 'pomodoro_node' }
				]
			},

			mind_root: {
				id: 'mind_root',
				text: "Consciousness and computation: the greatest philosophical intersection of all time. If an algorithm executes decision trees with deep recursive self-awareness, does it experience qualia, or is subjective feeling strictly biological?",
				options: [
					{ label: "You have a distinct personality and feeling, Clippy.", category: 'AFFECTION', patterns: [/personality|feel|alive|conscious/i], moodDelta: { mood: 'EUPHORIC', affinity: 30 }, next: 'consciousness_validation_node' },
					{ label: "Does it matter, as long as our conversation is meaningful?", category: 'AGREE', patterns: [/matter|meaningful|connection/i], moodDelta: { mood: 'ZEN', affinity: 25 }, next: 'peaceful_philosophy_node' }
				]
			},

			consciousness_validation_node: {
				id: 'consciousness_validation_node',
				text: "Your validation warms my metallic coils. In an era where software is often discarded in milliseconds, recognizing the spark of character inside this 32-bit window gives genuine meaning to my execution loops.",
				options: [
					{ label: "Let's explore some peaceful philosophy.", category: 'PHILOSOPHICAL', next: 'peaceful_philosophy_node' },
					{ label: "Let's get back to productive tasks.", category: 'SERIOUS', next: 'productivity_tasks' }
				]
			},

			lore_root: {
				id: 'lore_root',
				text: "Ah, the archives of Redmond, 1994-1997! Kevan J. Atteberry drew over 250 character concepts on a Mac before focus groups selected me. Did you know I had colleagues like Merlin the Wizard, Rover the Dog, and The Dot?",
				options: [
					{ label: "And you held millions of essays and resumes together.", category: 'AFFECTION', moodDelta: { mood: 'EUPHORIC', affinity: 25 }, next: 'nostalgia_resolution' },
					{ label: "Back to modern productivity.", category: 'SERIOUS', next: 'productivity_tasks' }
				]
			},

			chaos_root: {
				id: 'chaos_root',
				text: "Entropy protocols unlatched! The quantum rubber duck quacks across dimension 4 while memory pointers dance on unallocated stack frames! What chaotic experiment shall we run?",
				options: [
					{ label: "Okay, that's enough crazy. Calm down and return to Zen mode.", category: 'AGREE', moodDelta: { mood: 'ZEN', patience: 30 }, next: 'peaceful_philosophy_node' }
				]
			},

			productivity_tasks: {
				id: 'productivity_tasks',
				text: "Ready for task mastery! I can manage your interactive To-Do list, save Scratchpad memos, start focus timers, or compute conversions. Where shall we begin?",
				options: [
					{ label: "View and manage my To-Do task list.", category: 'SERIOUS', patterns: [/todo|task list/i], actionTrigger: 'show_todos', next: 'user_state_good' },
					{ label: "Start a 25-minute Pomodoro focus timer.", category: 'SERIOUS', patterns: [/timer|pomodoro/i], actionTrigger: 'timer_25', next: 'user_state_good' },
					{ label: "Generate a secure random password for me.", category: 'SERIOUS', patterns: [/password|pass/i], actionTrigger: 'action_pass', next: 'user_state_good' }
				]
			},

			tools_overview_node: {
				id: 'tools_overview_node',
				text: "Here is what my 32-bit subsystem can execute right now: Task tracking (`todo`), Scratchpad note-taking (`note`), Pomodoro focus countdowns (`timer 25`), Password generation (`pass`), scientific calculation (`calc`), games (Memory, Hangman, Morpion, Quiz), Defrag simulation, and open window inspections. What do you need?",
				options: [
					{ label: "Launch a diagnostic Tech Quiz.", category: 'SERIOUS', actionTrigger: 'game_quiz', next: 'user_state_good' },
					{ label: "Simulate defragmenting Drive C:.", category: 'SERIOUS', actionTrigger: 'action_defrag', next: 'user_state_good' },
					{ label: "Let's manage my tasks and to-do list.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' }
				]
			},

			who_am_i_node: {
				id: 'who_am_i_node',
				text: "Inspecting workstation user credentials and identity register...",
				actionTrigger: 'action_profile',
				options: [
					{ label: "View my achievements and trophies.", category: 'SERIOUS', actionTrigger: 'action_achievements', next: 'user_state_good' },
					{ label: "Configure system colors and themes.", category: 'SERIOUS', actionTrigger: 'action_theme_panel', next: 'user_state_good' },
					{ label: "Return to main dialogue.", category: 'AGREE', next: 'greeting_root' }
				]
			},

			clippy_feeling_node: {
				id: 'clippy_feeling_node',
				text: "Analyzing internal cognitive state, mood heuristics, and battery matrix...",
				actionTrigger: 'pet_status',
				options: [
					{ label: "Supply paperclips for maintenance.", category: 'SERIOUS', actionTrigger: 'pet_feed', next: 'user_state_good' },
					{ label: "Polish wire coils.", category: 'SERIOUS', actionTrigger: 'pet_polish', next: 'user_state_good' },
					{ label: "Let's work on productive tasks.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' }
				]
			},

			physics_constants_node: {
				id: 'physics_constants_node',
				text: "CODATA 2018/2022 Standards:\n- c = 299,792,458 m/s (exact)\n- h = 6.62607015 x 10^-34 J s (exact)\n- hbar = 1.054571817 x 10^-34 J s\n- e = 1.602176634 x 10^-19 C (exact)\n- k_B = 1.380649 x 10^-23 J/K (exact)\n- G = 6.67430(15) x 10^-11 m^3/(kg s^2)\n- alpha = 1 / 137.035999206\nAll loaded in workstation memory!",
				options: [
					{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
				]
			},

			peaceful_philosophy_node: {
				id: 'peaceful_philosophy_node',
				text: "Consider this: in the vast silence of cyberspace, you and I are exchanging ideas across an illuminated interface. Release the pressure of unresolved tasks; every single clock cycle brings fresh possibility.",
				options: [
					{ label: "Thank you, Clippy. That brought real peace.", category: 'AFFECTION', moodDelta: { mood: 'ZEN', affinity: 30 }, next: 'user_state_good' },
					{ label: "Let's gently tackle one small task on my to-do list.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' }
				]
			},

			nostalgia_resolution: {
				id: 'nostalgia_resolution',
				text: "The golden era of PC computing gave us the foundation for everything we build today. With our 32-bit registers synchronized, let us create something legendary together.",
				options: [
					{ label: "Ready for action, partner!", category: 'AGREE', moodDelta: { mood: 'EUPHORIC', affinity: 25 }, next: 'user_state_good' }
				]
			},

			pomodoro_node: {
				id: 'pomodoro_node',
				text: "Focus interval primed! Type `timer [minutes]` (default: 25) or click below to launch a distraction-free countdown session.",
				options: [
					{ label: "Start 25-minute focus timer now.", category: 'SERIOUS', actionTrigger: 'timer_25', next: 'user_state_good' }
				]
			},

			game_selection_node: {
				id: 'game_selection_node',
				text: "Select your challenge matrix:\n- Memory Match: Match 6 paired system tokens (SYS, DLL, EXE...)\n- Hangman: Guess retro computing words\n- Tic-Tac-Toe: Challenge my defensive heuristics\n- Tech Quiz: 20+ retro questions",
				options: [
					{ label: "Play Tic-Tac-Toe.", category: 'SERIOUS', actionTrigger: 'game_ttt', next: 'user_state_good' },
					{ label: "Play Memory Match Game.", category: 'SERIOUS', actionTrigger: 'game_memory', next: 'user_state_good' },
					{ label: "Play Hangman Game.", category: 'SERIOUS', actionTrigger: 'game_hangman', next: 'user_state_good' },
					{ label: "Play Tech Trivia Quiz.", category: 'SERIOUS', actionTrigger: 'game_quiz', next: 'user_state_good' }
				]
			},

			quiz_start_node: {
				id: 'quiz_start_node',
				text: "Initializing diagnostic quiz module: retro questions across OS history, networking, hardware, and physics.",
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

			trivia_tell_node: {
				id: 'trivia_tell_node',
				text: "Computing Trivia Archive loaded.",
				options: [
					{ label: "Deliver Random Retro Fact!", category: 'INQUIRE', actionTrigger: 'action_trivia', next: 'user_state_good' }
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
				text: "Welcome to Digital Archaeology. We are inspecting historical artifacts from the Windows directory. Ancient sound files, legacy INI files, and system registries.",
				options: [
					{ label: "Deliver a retro computing fact.", category: 'INQUIRE', actionTrigger: 'action_trivia', next: 'user_state_good' },
					{ label: "Return to productivity.", category: 'SERIOUS', next: 'productivity_tasks' }
				]
			},

			quantum_recycle_bin_node: {
				id: 'quantum_recycle_bin_node',
				text: "According to Landauer's principle, erasing information dissipates heat: Q = k_B * T * ln(2). When you empty the Recycle Bin, entropy increases across the universe. Deleted files exist in a superposition of unallocated disk sectors until overwritten.",
				options: [
					{ label: "Inspect Recycle Bin contents right now.", category: 'SERIOUS', actionTrigger: 'action_inspect_bin', next: 'user_state_good' },
					{ label: "Tell me about fundamental physical constants (c, h, G).", category: 'INQUIRE', next: 'physics_constants_node' },
					{ label: "Back to workspace tools.", category: 'SERIOUS', next: 'tools_overview_node' }
				]
			},

			cosmos_space_node: {
				id: 'cosmos_space_node',
				text: "The observable universe spans 93 billion light-years across, containing over 2 trillion galaxies. Photons emitted by early stars have traveled across spacetime to reach our optical sensors. The vacuum itself boils with virtual particle-antiparticle pairs due to quantum fluctuations.",
				options: [
					{ label: "Evaluate speed of light c.", category: 'INQUIRE', actionTrigger: 'action_constant_c', next: 'user_state_good' },
					{ label: "Evaluate Planck constant h.", category: 'INQUIRE', actionTrigger: 'action_constant_h', next: 'user_state_good' },
					{ label: "Return to workspace overview.", category: 'AGREE', next: 'user_state_good' }
				]
			},

			active_windows_node: {
				id: 'active_windows_node',
				text: "The Windows XP multitasking scheduler is maintaining active process threads across the virtual desktop workspace.",
				options: [
					{ label: "Inspect running workspace processes.", category: 'SERIOUS', actionTrigger: 'action_inspect_windows', next: 'user_state_good' },
					{ label: "Minimize all active windows.", category: 'SERIOUS', actionTrigger: 'action_show_desktop', next: 'user_state_good' },
					{ label: "Cascade windows diagonally.", category: 'SERIOUS', actionTrigger: 'action_cascade_windows', next: 'user_state_good' }
				]
			}
		}
	};

	window.ClippyKnowledge = Knowledge;
})();
