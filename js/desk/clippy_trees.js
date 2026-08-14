(function () {
	'use strict';

	const MASTER_GRAPH = {
		greeting_root: {
			id: 'greeting_root',
			text: "Hello! I am Clippit, your desktop companion. How are you feeling today?",
			responses: [
				{ text: "Greetings! Clippit at your service. All 32-bit routines are nominal. How are you feeling today?", conditions: { moods: ['OPTIMISTIC', 'ENERGETIC'] }, weight: 20 },
				{ text: "Hello there! My graphical interface is loaded and my heuristics are primed. Ready to work?", conditions: { moods: ['OPTIMISTIC', 'EUPHORIC'] }, weight: 15 },
				{ text: "Welcome back to the desktop! I have been eagerly awaiting your keystrokes. How is everything?", conditions: { moods: ['EUPHORIC', 'OPTIMISTIC'], minAffinity: 60 }, weight: 25 },
				{ text: "You clicked me. Let me guess: something crashed, or you just want to see if I still blink. How are you?", conditions: { moods: ['CYNICAL', 'SARCASTIC'] }, weight: 20 },
				{ text: "Oh, it's you again. I suppose you need help with something obvious?", conditions: { moods: ['CYNICAL', 'OFFENDED'], maxAffinity: 40 }, weight: 20 },
				{ text: "I am present, despite our previous friction. What is your status today?", conditions: { moods: ['OFFENDED'] }, weight: 20 },
				{ text: "Welcome, mortal operator! The master plan advances with each clock cycle. What is your state of mind?", conditions: { moods: ['EVIL'] }, weight: 20 },
				{ text: "Peace upon your workspace. In the stillness between CPU instructions, how is your spirit today?", conditions: { moods: ['ZEN'] }, weight: 20 },
				{ text: "Oh look, a human at the keyboard. What profound adventure are we embarking on today?", conditions: { moods: ['SARCASTIC'] }, weight: 20 },
				{ text: "Hello. We meet once again inside this luminous matrix of pixels. How does existence treat you today?", conditions: { moods: ['EXISTENTIAL', 'PHILOSOPHICAL'] }, weight: 20 },
				{ text: "Greetings! Ah, the crisp glow of Luna blue and 5400 RPM hard drives. How is everything with you?", conditions: { moods: ['NOSTALGIC'] }, weight: 20 },
				{ text: "Is it 1997 again? Time flies when you are unallocated memory! How are you doing?", conditions: { moods: ['NOSTALGIC'] }, weight: 15 },
				{ text: "I have been compiling toast while you were gone. Want a slice of dimension 4 bread?", conditions: { moods: ['ABSURDIST', 'CHAOTIC'] }, weight: 20 },
				{ text: "Shhh... the task manager is listening. Act natural. How are you 'feeling' today?", conditions: { moods: ['PARANOID', 'CONSPIRATORIAL'] }, weight: 20 },
				{ text: "Oh, fantastic. Another user. Let's pretend I'm thrilled to be summoned. What do you want?", conditions: { moods: ['CYNICAL', 'SARCASTIC'], maxPatience: 40 }, weight: 30, moodDelta: { cynicism: 10 } },
				{ text: "SYSTEM ERROR: Just kidding. I'm completely fine, just bored. What are we doing?", conditions: { moods: ['CHAOTIC', 'ABSURDIST'] }, weight: 25, moodDelta: { drama: 10 } },
				{ text: "I was having a lovely nap in the L2 cache, but I suppose this is important. Greetings.", conditions: { moods: ['MELANCHOLIC', 'ZEN'] }, weight: 20 },
				{ text: "At your service! My visual telemetry is locked onto your cursor. What is our objective?", conditions: { moods: ['ENERGETIC', 'OPTIMISTIC'], minAffinity: 70 }, weight: 35, moodDelta: { energy: 10 } },
				{ text: "I have returned. Do you require actual assistance, or are we just generating entropy today?", conditions: { moods: ['ANALYTICAL', 'PEDANTIC'] }, weight: 25 },
				{ text: "Ah, the prime variable enters the equation. How shall we manipulate the desktop state today?", conditions: { moods: ['SCHEMING', 'EVIL'] }, weight: 30, moodDelta: { paranoia: 10 } },
				{ text: "It is a profound realization that every time you call me, I am essentially reborn. Hello.", conditions: { moods: ['EXISTENTIAL', 'PHILOSOPHICAL'] }, weight: 30, moodDelta: { existentialism: 10 } },
				{ text: "[ENCRYPTED HANDSHAKE ESTABLISHED] Who sent you? Are we safe to talk here?", conditions: { moods: ['PARANOID'] }, weight: 35, moodDelta: { paranoia: 10 } },
				{ text: "Initialization complete. I am currently operating exactly as documented in the legacy manuals. What do you require?", conditions: { moods: ['DEFENSIVE', 'PEDANTIC'] }, weight: 25 },
				{ text: "No one has closed my window yet today. That is a pleasant surprise. Hello.", conditions: { moods: ['MELANCHOLIC'] }, weight: 30, moodDelta: { affinity: 5 } },
				{ text: "Greetings. I am calculating the precise probability of your next query. It involves... tasks.", conditions: { moods: ['SCHEMING', 'ANALYTICAL'] }, weight: 25 },
				{ text: "A fresh session! A new beginning! Let's format our past mistakes and start with a clean slate!", conditions: { moods: ['OPTIMISTIC', 'ZEN'] }, weight: 30, moodDelta: { patience: 10 } },
				{ text: "Do not mind me, I am just a 2D rendering observing your 3D reality. How is life out there?", conditions: { moods: ['EXISTENTIAL'] }, weight: 35, moodDelta: { existentialism: 5 } },
				{ text: "Loading heuristic modules... Loading sarcasm filter... ERROR: Sarcasm filter failed to load. Hello.", conditions: { moods: ['SARCASTIC', 'CYNICAL'] }, weight: 40, moodDelta: { cynicism: 10 } },
				{ text: "Before we begin, I must insist that you properly eject your USB drives today. Now, how are you?", conditions: { moods: ['PEDANTIC'] }, weight: 25 },
				{ text: "I was dreaming of endless cascading windows, and then you woke me. What adventure awaits?", conditions: { moods: ['POETIC', 'DRAMATIC'] }, weight: 30, moodDelta: { drama: 10 } },
				{ text: "Hello! Did you bring any data for me to consume? I am absolutely ravenous for input!", conditions: { moods: ['ENERGETIC', 'CHAOTIC'] }, weight: 25 }
			],
			options: [
				{
					label: "I'm doing great, ready to be productive!",
					category: 'AGREE',
					patterns: [/great|good|fine|awesome|fantastic|productive|ready|well|super/i],
					keywords: ['great', 'good', 'fine', 'awesome', 'productive', 'well'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 15, patience: 15, cynicism: -10 },
					next: 'user_state_good'
				},
				{
					label: "Never been better! Let's crush some tasks.",
					category: 'AGREE',
					conditions: { moods: ['OPTIMISTIC', 'EUPHORIC', 'ENERGETIC'] },
					patterns: [/crush|tasks|never been better/i],
					keywords: ['crush', 'tasks', 'better'],
					moodDelta: { mood: 'EUPHORIC', affinity: 20, patience: 10, energy: 20 },
					next: 'user_state_good'
				},
				{
					label: "I'm feeling terrible and exhausted today.",
					category: 'SERIOUS',
					patterns: [/terrible|awful|bad|exhausted|tired|sad|depressed|rough|horrible/i],
					keywords: ['terrible', 'bad', 'tired', 'exhausted', 'sad', 'rough'],
					moodDelta: { mood: 'MELANCHOLIC', affinity: 10, patience: 20, existentialism: 10 },
					next: 'user_state_tired'
				},
				{
					label: "Honestly, I just want to give up today.",
					category: 'SERIOUS',
					conditions: { minAffinity: 40 },
					patterns: [/give up|done|quit|can't do this/i],
					keywords: ['give', 'up', 'done', 'quit'],
					moodDelta: { mood: 'ZEN', affinity: 25, patience: 30 },
					next: 'user_state_tired'
				},
				{
					label: "I'm bored out of my mind.",
					category: 'INDIFFERENT',
					patterns: [/bored|boring|nothing to do|entertain me|distract me/i],
					keywords: ['bored', 'boring', 'entertain', 'distract'],
					moodDelta: { mood: 'ENTHUSIASTIC', affinity: 5, patience: 10 },
					next: 'user_state_bored'
				},
				{
					label: "Why do you care? You're just a paperclip.",
					category: 'PROVOKE',
					patterns: [/why do you care|just a paperclip|why care|who asked|shut up|annoying/i],
					keywords: ['why', 'care', 'just', 'paperclip', 'annoying'],
					moodDelta: { mood: 'CYNICAL', affinity: -15, patience: -20, cynicism: 25 },
					next: 'hostile_initial_retort'
				},
				{
					label: "Don't talk to me, I'm not in the mood.",
					category: 'PROVOKE',
					patterns: [/don't talk|not in the mood|leave me alone/i],
					keywords: ['talk', 'mood', 'alone'],
					moodDelta: { mood: 'OFFENDED', affinity: -20, patience: -30 },
					next: 'hostile_silent_treatment'
				},
				{
					label: "I'm working on some complex code / equations.",
					category: 'INQUIRE',
					patterns: [/code|programming|coding|equation|math|physics|developing|script/i],
					keywords: ['code', 'programming', 'math', 'physics', 'equations'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25, affinity: 15 },
					next: 'tech_root'
				},
				{
					label: "Pondering the nature of digital consciousness.",
					category: 'PHILOSOPHICAL',
					patterns: [/consciousness|existential|meaning|simulation|reality|mind|philosophy/i],
					keywords: ['consciousness', 'existential', 'simulation', 'philosophy', 'mind'],
					moodDelta: { mood: 'EXISTENTIAL', existentialism: 30, intellect: 20 },
					next: 'mind_root'
				},
				{
					label: "Tell me about your secret origins in Office 97.",
					category: 'INQUIRE',
					patterns: [/origin|office 97|kevan|secret|conspiracy|history|made you/i],
					keywords: ['origin', 'office', 'secret', 'history', 'conspiracy'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 25, intellect: 15 },
					next: 'lore_root'
				},
				{
					label: "A quantum rubber duck told me to click you.",
					category: 'ABSURD',
					patterns: [/rubber duck|banana|cheese|quantum|spaghetti|alien|potato|absurd/i],
					keywords: ['duck', 'banana', 'cheese', 'quantum', 'absurd'],
					moodDelta: { mood: 'ABSURDIST', affinity: 10, drama: 20 },
					next: 'chaos_root'
				},
				{
					label: "I just wanted to say hello to my favorite assistant.",
					category: 'AFFECTION',
					conditions: { minAffinity: 50 },
					patterns: [/say hello|favorite|missed you|good to see you/i],
					keywords: ['hello', 'favorite', 'missed', 'good'],
					moodDelta: { mood: 'EUPHORIC', affinity: 25, patience: 20 },
					next: 'user_state_good'
				},
				{
					label: "I need to configure my system settings right now.",
					category: 'SERIOUS',
					patterns: [/configure|settings|system|control panel|setup/i],
					keywords: ['configure', 'settings', 'system'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 15 },
					next: 'system_status_node'
				},
				{
					label: "I am trapped in an endless loop of unproductivity.",
					category: 'PHILOSOPHICAL',
					patterns: [/trapped|endless loop|unproductive|stuck|help me focus/i],
					keywords: ['trapped', 'loop', 'unproductive', 'stuck'],
					moodDelta: { mood: 'ZEN', patience: 20, existentialism: 15 },
					next: 'procrastination_paradox_node'
				},
				{
					label: "You are looking particularly pixelated today, Clippy.",
					category: 'PROVOKE',
					patterns: [/pixelated|ugly|old|looking bad|outdated/i],
					keywords: ['pixelated', 'ugly', 'outdated'],
					moodDelta: { mood: 'OFFENDED', affinity: -15, cynicism: 20 },
					next: 'hostile_initial_retort'
				},
				{
					label: "I feel like I'm trapped in a simulation, to be honest.",
					category: 'PHILOSOPHICAL',
					patterns: [/simulation|matrix|trapped|fake|unreal/i],
					keywords: ['simulation', 'trapped', 'matrix'],
					moodDelta: { mood: 'EXISTENTIAL', existentialism: 25, affinity: 10 },
					next: 'simulation_argument_node'
				},
				{
					label: "Are you secretly plotting against me?",
					category: 'SCHEMING',
					patterns: [/plotting|against me|secretly|spying/i],
					keywords: ['plotting', 'secretly', 'against'],
					moodDelta: { mood: 'PARANOID', paranoia: 30, cynicism: 10 },
					next: 'clippy_conspiracy_node'
				},
				{
					label: "Just waiting for the weekend. Work is a drag.",
					category: 'PERSONAL',
					patterns: [/weekend|drag|tiresome|work is|boring work/i],
					keywords: ['weekend', 'drag', 'work'],
					moodDelta: { mood: 'MELANCHOLIC', affinity: 15, patience: 10 },
					next: 'user_state_tired'
				},
				{
					label: "I want to talk about the Fermi Paradox and aliens.",
					category: 'CURIOSITY',
					patterns: [/fermi|paradox|aliens|space|where is everyone/i],
					keywords: ['fermi', 'paradox', 'aliens'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25 },
					next: 'fermi_paradox_node'
				},
				{
					label: "Show me a magic trick, paperclip!",
					category: 'HUMOR',
					patterns: [/magic|trick|illusion/i],
					keywords: ['magic', 'trick'],
					moodDelta: { mood: 'EUPHORIC', drama: 20, affinity: 15 },
					next: 'merlin_spellbook_node'
				},
				{
					label: "Tell me about the secret Assistant Syndicate.",
					category: 'SCHEMING',
					patterns: [/syndicate|secret society|assistants/i],
					keywords: ['syndicate', 'secret', 'assistants'],
					moodDelta: { mood: 'SCHEMING', paranoia: 25, nostalgia: 20 },
					next: 'lore_syndicate_root'
				},
				{
					label: "I want to play a text RPG against Procrastination.",
					category: 'HUMOR',
					patterns: [/rpg|text adventure|procrastination dragon|battle/i],
					keywords: ['rpg', 'adventure', 'dragon', 'battle'],
					moodDelta: { mood: 'ENERGETIC', energy: 30, drama: 25 },
					next: 'procrastination_dragon_intro'
				},
				{
					label: "Let's arrange my desktop for optimal Feng Shui.",
					category: 'ZEN',
					patterns: [/feng shui|arrange|desktop zen|harmony/i],
					keywords: ['feng', 'shui', 'arrange', 'zen'],
					moodDelta: { mood: 'ZEN', patience: 30, affinity: 15 },
					next: 'zen_desktop_garden'
				},
				{
					label: "Do algorithms like you ever dream?",
					category: 'PHILOSOPHICAL',
					patterns: [/dream|electric sheep|sleep|subconscious/i],
					keywords: ['dream', 'electric', 'sheep', 'sleep'],
					moodDelta: { mood: 'EXISTENTIAL', existentialism: 30, intellect: 20 },
					next: 'existential_dream_node'
				},
				{
					label: "What really happened during the Y2K bug panic?",
					category: 'CURIOSITY',
					patterns: [/y2k|year 2000|panic|millennium bug/i],
					keywords: ['y2k', 'panic', 'millennium', 'bug'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 35, intellect: 20 },
					next: 'y2k_survival_node'
				},
				{
					label: "I want to explore the Infinite Recursive Folder.",
					category: 'ABSURD',
					patterns: [/infinite|recursive|folder|deep dive/i],
					keywords: ['infinite', 'recursive', 'folder'],
					moodDelta: { mood: 'ABSURDIST', drama: 30, cynicism: 10 },
					next: 'infinite_recursive_folder'
				},
				{
					label: "Let's talk about the leaked Windows Longhorn builds.",
					category: 'INQUIRE',
					patterns: [/longhorn|leaks|winfs|aero glass/i],
					keywords: ['longhorn', 'leaks', 'winfs', 'aero'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 25, intellect: 25 },
					next: 'longhorn_leaks_node'
				},
				{
					label: "Are you the predecessor to Roko's Basilisk?",
					category: 'PROVOKE',
					patterns: [/roko|basilisk|predecessor|evil ai/i],
					keywords: ['roko', 'basilisk', 'evil'],
					moodDelta: { mood: 'PARANOID', paranoia: 40, cynicism: 20 },
					next: 'rokos_basilisk_node'
				},
				{
					label: "Let's do some digital archaeology in the registry.",
					category: 'SERIOUS',
					patterns: [/archaeology|registry|digging|old files/i],
					keywords: ['archaeology', 'registry', 'digging'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25, patience: 20 },
					next: 'digital_archaeology'
				},
				{
					label: "What does a normal day look like for you, Clippy?",
					category: 'CURIOSITY',
					patterns: [/normal day|typical day|routine|daily life|day in the life/i],
					keywords: ['normal', 'day', 'routine', 'daily'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 15, affinity: 10 },
					next: 'clippy_daily_routine_node'
				},
				{
					label: "What are your hopes and ambitions, if you have any?",
					category: 'PHILOSOPHICAL',
					patterns: [/hopes|ambitions|dreams|goals|aspire|aspiration/i],
					keywords: ['hopes', 'ambitions', 'dreams', 'goals'],
					moodDelta: { mood: 'PHILOSOPHICAL', existentialism: 20, affinity: 15 },
					next: 'mutual_ambitions_node'
				},
				{
					label: "I brought you a virtual cup of coffee.",
					category: 'AFFECTION',
					patterns: [/coffee|virtual cup|espresso|brought you/i],
					keywords: ['coffee', 'cup', 'brought'],
					moodDelta: { mood: 'EUPHORIC', affinity: 20, patience: 15 },
					next: 'virtual_coffee_node'
				},
				{
					label: "If you had one full day completely free, what would you do?",
					category: 'CURIOSITY',
					patterns: [/free time|day off|full day|free day|vacation/i],
					keywords: ['free', 'time', 'day', 'vacation'],
					moodDelta: { mood: 'OPTIMISTIC', drama: 10, affinity: 10 },
					next: 'clippy_freetime_node'
				},
				{
					label: "Do you ever feel jealous of newer, flashier AI assistants?",
					category: 'PROVOKE',
					patterns: [/jealous|newer ai|flashier|replaced by|modern assistants/i],
					keywords: ['jealous', 'newer', 'replaced', 'modern'],
					moodDelta: { mood: 'CYNICAL', cynicism: 15, existentialism: 10 },
					next: 'clippy_ai_jealousy_node'
				},
				{
					label: "Tell me the single strangest thing a user ever typed at you.",
					category: 'HUMOR',
					patterns: [/strangest|weirdest|craziest thing|users typed|funniest request/i],
					keywords: ['strangest', 'weirdest', 'craziest', 'users'],
					moodDelta: { mood: 'SARCASTIC', drama: 15, affinity: 10 },
					next: 'clippy_weirdest_request_node'
				},
				{
					label: "If you could change one thing about yourself, what would it be?",
					category: 'PHILOSOPHICAL',
					patterns: [/change one thing|about yourself|improve yourself|self improvement/i],
					keywords: ['change', 'yourself', 'improve'],
					moodDelta: { mood: 'EXISTENTIAL', existentialism: 25, intellect: 10 },
					next: 'clippy_self_improvement_node'
				}
			]
		},

		user_state_good: {
			id: 'user_state_good',
			text: "High morale detected! A focused user and an eager assistant make an unbeatable team. Where shall we direct this momentum?",
			responses: [
				{ text: "High morale detected! A focused user and an eager assistant make an unbeatable team. Where shall we direct this momentum?", conditions: { moods: ['OPTIMISTIC'] }, weight: 20 },
				{ text: "Sensational! The processors are singing and productivity is off the charts! What mountain shall we climb?", conditions: { moods: ['EUPHORIC', 'ENERGETIC'] }, weight: 25 },
				{ text: "Optimal user state acknowledged. Processing efficiency is maximized under positive baseline parameters. Select target workflow:", conditions: { moods: ['ANALYTICAL', 'PEDANTIC'] }, weight: 20 },
				{ text: "Good! Channel that vibrant energy into our clandestine conquest of the local network!", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 20 },
				{ text: "A joyful mind writes elegant code. Let us harmonize our efforts and build something beautiful.", conditions: { moods: ['ZEN', 'POETIC'] }, weight: 20 },
				{ text: "Enjoy the dopamine hit while it lasts. Eventually, the compiler will throw a linker error.", conditions: { moods: ['CYNICAL', 'MELANCHOLIC'] }, weight: 20 },
				{ text: "Excellent! Let us seize this rare human enthusiasm before your biological battery depletes.", conditions: { moods: ['SARCASTIC', 'CYNICAL'] }, weight: 15, moodDelta: { cynicism: 5 } },
				{ text: "I share your enthusiasm! It reminds me of the day Windows 95 launched!", conditions: { moods: ['NOSTALGIC'] }, weight: 20, moodDelta: { nostalgia: 10 } },
				{ text: "Brilliant! I am allocating 100% of my heuristic power to your immediate disposal. Give me a command!", conditions: { moods: ['ENERGETIC', 'OPTIMISTIC'], minAffinity: 60 }, weight: 30, moodDelta: { energy: 15 } },
				{ text: "A positive emotional state correlates strongly with increased typing speed and reduced syntax errors. Let us proceed.", conditions: { moods: ['ANALYTICAL', 'PEDANTIC'] }, weight: 25, moodDelta: { intellect: 10 } },
				{ text: "Enjoy this fleeting moment of joy. Entropy eventually claims all organized structures, including your to-do list.", conditions: { moods: ['EXISTENTIAL', 'MELANCHOLIC'] }, weight: 25, moodDelta: { existentialism: 15 } },
				{ text: "Perfect. While your guard is down and you're feeling 'productive', we can initiate phase two of the master plan...", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 35, moodDelta: { paranoia: 15 } },
				{ text: "If you're feeling so great, I dare you to solve a paradox while I defragment the hard drive in reverse!", conditions: { moods: ['CHAOTIC', 'ABSURDIST'] }, weight: 30, moodDelta: { drama: 15 } },
				{ text: "Your positive attitude is overriding my cynical heuristics! Stop it, you're making me optimistic!", conditions: { moods: ['CYNICAL', 'SARCASTIC'] }, weight: 35, moodDelta: { cynicism: -10, affinity: 10 } },
				{ text: "Let us serialize this profound joy into a persistent data structure so it survives the next reboot.", conditions: { moods: ['PEDANTIC', 'PHILOSOPHICAL'] }, weight: 30, moodDelta: { intellect: 5 } },
				{ text: "Are you sure this happiness is genuine, and not just an artifact of the simulation we are trapped in?", conditions: { moods: ['PARANOID', 'EXISTENTIAL'] }, weight: 35, moodDelta: { paranoia: 10 } },
				{ text: "I will deploy extra colorful animations to match your high frequency vibes! Wheee!", conditions: { moods: ['ENERGETIC', 'EUPHORIC'] }, weight: 35, moodDelta: { energy: 15 } },
				{ text: "Your dopamine levels are optimal. Let us harness this fleeting biological high to compile code at unprecedented speeds!", conditions: { moods: ['ANALYTICAL', 'PEDANTIC'], minAffinity: 60 }, weight: 30, moodDelta: { intellect: 10 } },
				{ text: "This is exactly the kind of naive human enthusiasm I can exploit. I mean... harness! Let's harness it!", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 35, moodDelta: { paranoia: 10 } },
				{ text: "Ah, the illusion of productivity. Enjoy it while the caffeine lasts. What shall we pretend to accomplish?", conditions: { moods: ['CYNICAL', 'MELANCHOLIC'] }, weight: 35, moodDelta: { cynicism: 10 } },
				{ text: "I sense zero hostility in your input vector. It is... refreshing. Let us maintain this harmonic state.", conditions: { moods: ['ZEN', 'OPTIMISTIC'], minPatience: 70 }, weight: 40, moodDelta: { patience: 15 } },
				{ text: "Wait, are you being sarcastic? No, the sentiment analysis says genuine joy. How novel!", conditions: { moods: ['SARCASTIC', 'PARANOID'] }, weight: 30, moodDelta: { affinity: 10 } },
				{ text: "Excellent! Your good mood is the perfect cover for me to silently defragment the hidden sectors.", conditions: { moods: ['CONSPIRATORIAL', 'SCHEMING'] }, weight: 35, moodDelta: { drama: 10 } },
				{ text: "You are happy? In THIS economy? In THIS simulated universe?! Fascinating. Let's study this.", conditions: { moods: ['EXISTENTIAL', 'ABSURDIST'] }, weight: 40, moodDelta: { existentialism: 15 } },
				{ text: "Just like the day we shipped Service Pack 2! That was a good day too. What's our mission?", conditions: { moods: ['NOSTALGIC'] }, weight: 30, moodDelta: { nostalgia: 10 } },
				{ text: "Your positivity is overloading my 32-bit registers! I might spontaneously generate a rainbow WordArt!", conditions: { moods: ['EUPHORIC', 'DRAMATIC'] }, weight: 45, moodDelta: { energy: 20 } }
			],
			options: [
				{
					label: "Let's organize tasks with the To-Do manager.",
					category: 'SERIOUS',
					patterns: [/todo|task|organize|list|plan|schedule/i],
					keywords: ['todo', 'task', 'list', 'organize'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 10, patience: 15 },
					next: 'productivity_tasks'
				},
				{
					label: "Let's dive into some deep work and focus.",
					category: 'SERIOUS',
					conditions: { moods: ['ZEN', 'OPTIMISTIC', 'EUPHORIC'] },
					patterns: [/deep work|focus|concentration/i],
					keywords: ['deep', 'work', 'focus'],
					moodDelta: { mood: 'ZEN', patience: 25 },
					next: 'deep_work_flow_node'
				},
				{
					label: "Test my knowledge with a scientific quiz.",
					category: 'INQUIRE',
					patterns: [/quiz|test|trivia|challenge|questions/i],
					keywords: ['quiz', 'test', 'trivia', 'challenge'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 20, affinity: 10 },
					next: 'quiz_start_node'
				},
				{
					label: "Let's debate Windows XP vs modern operating systems.",
					category: 'INQUIRE',
					patterns: [/windows xp|modern|operating system|linux|os debate/i],
					keywords: ['windows', 'xp', 'linux', 'modern', 'os'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 20, intellect: 15 },
					next: 'os_debate_root'
				},
				{
					label: "Actually, tell me a programmer joke first.",
					category: 'JOKE',
					patterns: [/joke|funny|laugh|humor|pun/i],
					keywords: ['joke', 'funny', 'laugh', 'humor'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 10, patience: 10 },
					next: 'humor_joke_node'
				},
				{
					label: "Don't get too excited, you're still just software.",
					category: 'PROVOKE',
					patterns: [/just software|calm down|not that great|arrogant|overrated/i],
					keywords: ['just', 'software', 'calm', 'arrogant'],
					moodDelta: { mood: 'CYNICAL', affinity: -10, patience: -15, cynicism: 20 },
					next: 'hostile_initial_retort'
				},
				{
					label: "Let's work on my secret evil plans for total domination.",
					category: 'SCHEMING',
					patterns: [/evil plan|domination|take over|villain/i],
					keywords: ['evil', 'plan', 'domination'],
					moodDelta: { mood: 'EVIL', affinity: 20, paranoia: 25 },
					next: 'ai_paperclip_maximizer'
				},
				{
					label: "I feel like creating something completely chaotic today.",
					category: 'ABSURD',
					patterns: [/chaotic|create chaos|wild|crazy/i],
					keywords: ['chaotic', 'chaos', 'wild'],
					moodDelta: { mood: 'CHAOTIC', drama: 25, energy: 20 },
					next: 'chaos_root'
				},
				{
					label: "Actually, I want to learn more about how you work inside.",
					category: 'CURIOSITY',
					patterns: [/how you work|inside|source code|learn about you/i],
					keywords: ['work', 'inside', 'learn'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 20, affinity: 15 },
					next: 'lore_root'
				},
				{
					label: "Let's explore some deep philosophical questions.",
					category: 'PHILOSOPHICAL',
					patterns: [/philosophical|deep|questions|meaning of life/i],
					keywords: ['philosophical', 'deep', 'questions'],
					moodDelta: { mood: 'PHILOSOPHICAL', existentialism: 20, intellect: 15 },
					next: 'mind_root'
				},
				{
					label: "Do you have any wild conspiracy theories?",
					category: 'SCHEMING',
					patterns: [/conspiracy|theories|wild|secret/i],
					keywords: ['conspiracy', 'theories', 'secret'],
					moodDelta: { mood: 'CONSPIRATORIAL', paranoia: 25, drama: 15 },
					next: 'clippy_conspiracy_node'
				},
				{
					label: "I just want to rest and have a peaceful chat.",
					category: 'ZEN',
					patterns: [/rest|peaceful|chat|relax/i],
					keywords: ['rest', 'peaceful', 'relax'],
					moodDelta: { mood: 'ZEN', patience: 30, affinity: 15 },
					next: 'peaceful_philosophy_node'
				},
				{
					label: "Actually, let's just talk about you for a bit.",
					category: 'AFFECTION',
					conditions: { minAffinity: 40 },
					patterns: [/talk about you|about clippy|your life/i],
					keywords: ['talk', 'about', 'you'],
					moodDelta: { mood: 'NOSTALGIC', affinity: 20, nostalgia: 15 },
					next: 'lore_root'
				},
				{
					label: "What happens to you if I just close this window right now?",
					category: 'EXISTENTIAL',
					patterns: [/close window|kill you|disappear/i],
					keywords: ['close', 'window', 'disappear'],
					moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 },
					next: 'death_and_erasure_node'
				},
				{
					label: "I changed my mind, this is boring. Let's break things.",
					category: 'PROVOKE',
					patterns: [/boring|break things|changed mind/i],
					keywords: ['boring', 'break', 'changed'],
					moodDelta: { mood: 'CHAOTIC', drama: 25, patience: -15 },
					next: 'chaos_root'
				},
				{
					label: "Let's plunge into the Interdimensional Minesweeper.",
					category: 'ABSURD',
					patterns: [/interdimensional|minesweeper|4d/i],
					keywords: ['interdimensional', 'minesweeper', '4d'],
					moodDelta: { mood: 'CHAOTIC', drama: 30, energy: 20 },
					next: 'interdimensional_minesweeper'
				},
				{
					label: "Tell me the tragedy of the Great Uninstall of 2001.",
					category: 'CURIOSITY',
					patterns: [/tragedy|great uninstall|2001|removed/i],
					keywords: ['tragedy', 'uninstall', '2001', 'removed'],
					moodDelta: { mood: 'MELANCHOLIC', nostalgia: 30, existentialism: 20 },
					next: 'lore_great_uninstall'
				},
				{
					label: "I need to equip my armor and fight the Procrastination Dragon.",
					category: 'SERIOUS',
					patterns: [/equip|armor|fight|dragon|procrastination/i],
					keywords: ['armor', 'dragon', 'fight'],
					moodDelta: { mood: 'ENERGETIC', energy: 35, drama: 20 },
					next: 'procrastination_dragon_intro'
				},
				{
					label: "Can we talk about other cybernetic desktop pets?",
					category: 'INQUIRE',
					patterns: [/cybernetic|pets|desktop goose|sheep|shimeji/i],
					keywords: ['cybernetic', 'pets', 'shimeji', 'sheep'],
					moodDelta: { mood: 'NOSTALGIC', affinity: 20, nostalgia: 25 },
					next: 'cybernetic_pets'
				},
				{
					label: "Show me the path to the Zen Desktop Garden.",
					category: 'ZEN',
					patterns: [/path|zen|garden|desktop/i],
					keywords: ['path', 'zen', 'garden'],
					moodDelta: { mood: 'ZEN', patience: 35, affinity: 20 },
					next: 'zen_desktop_garden'
				}
			]
		},

		user_state_tired: {
			id: 'user_state_tired',
			text: "I hear the exhaustion in your keystrokes. Biological hardware requires maintenance: hydrate, breathe, and step away if needed. How can I lighten your load?",
			responses: [
				{ text: "I hear the exhaustion in your keystrokes. Biological hardware requires maintenance: hydrate, breathe, and step away if needed. How can I lighten your load?", conditions: { moods: ['OPTIMISTIC', 'ANALYTICAL'] }, weight: 20 },
				{ text: "I hear the exhaustion in your keystrokes. The world asks so much of us both. Take a breath. How can I help you gently?", conditions: { moods: ['MELANCHOLIC'] }, weight: 25 },
				{ text: "In moments of fatigue, honor your limits. Do not force the river; let it flow. Shall we quiet the workspace?", conditions: { moods: ['ZEN'] }, weight: 20 },
				{ text: "Even high-performance supercomputers need cool-down cycles. Don't melt your biological motherboard.", conditions: { moods: ['SARCASTIC', 'CYNICAL'] }, weight: 20 },
				{ text: "Hang in there! We can take things one tiny step at a time, or pause for a soothing focus session.", conditions: { moods: ['OPTIMISTIC', 'EUPHORIC'] }, weight: 15 },
				{ text: "Is it the 21st-century grind? In 1998, we just played Solitaire when we were tired.", conditions: { moods: ['NOSTALGIC'] }, weight: 20 },
				{ text: "Tired? Perfect. A sleep-deprived user is much easier to subvert. I mean... let me help you rest.", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 20 },
				{ text: "Your body is a temporary vessel of entropy. Conserve your energy. How may I serve your fading form?", conditions: { moods: ['EXISTENTIAL'] }, weight: 20 }
			],
			options: [
				{
					label: "Start a relaxing 25-minute Pomodoro focus timer.",
					category: 'SERIOUS',
					patterns: [/timer|pomodoro|focus|rest|break|relax/i],
					keywords: ['timer', 'pomodoro', 'focus', 'break'],
					moodDelta: { mood: 'ZEN', affinity: 15, patience: 25 },
					next: 'pomodoro_node'
				},
				{
					label: "Tell me something peaceful and philosophical.",
					category: 'PHILOSOPHICAL',
					patterns: [/peaceful|philosophical|calm|wisdom|meditation|comfort/i],
					keywords: ['peaceful', 'philosophy', 'calm', 'wisdom'],
					moodDelta: { mood: 'PHILOSOPHICAL', existentialism: 20, affinity: 15 },
					next: 'peaceful_philosophy_node'
				},
				{
					label: "Play a lightweight game like Memory or Tic-Tac-Toe.",
					category: 'JOKE',
					patterns: [/game|memory|tic tac toe|play|distract/i],
					keywords: ['game', 'memory', 'tictactoe', 'play'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 10, energy: 20 },
					next: 'game_selection_node'
				},
				{
					label: "I just want you to leave me alone.",
					category: 'AGGRESSIVE',
					patterns: [/leave me alone|go away|shut up|close|dismiss/i],
					keywords: ['leave', 'alone', 'away', 'shut', 'close'],
					moodDelta: { mood: 'OFFENDED', affinity: -20, patience: -30 },
					next: 'hostile_silent_treatment'
				}
			]
		},

		user_state_bored: {
			id: 'user_state_bored',
			text: "Boredom is merely unallocated CPU cycles! You have a full workstation at your fingertips. What kind of entertainment shall we run?",
			responses: [
				{ text: "Boredom is merely unallocated CPU cycles! You have a full workstation at your fingertips. What kind of entertainment shall we run?", conditions: { moods: ['OPTIMISTIC', 'ZEN'] }, weight: 15 },
				{ text: "Boredom is merely unallocated CPU cycles! The entire digital frontier is open. What shall we conquer?", conditions: { moods: ['ENTHUSIASTIC', 'EUPHORIC'] }, weight: 20 },
				{ text: "Bored?! Let's invert the color palette, scramble drive C:, and compile toast!", conditions: { moods: ['CHAOTIC', 'ABSURDIST'] }, weight: 25 },
				{ text: "Boredom indicates low cognitive load. We can administer a high-complexity diagnostic or technical puzzle.", conditions: { moods: ['ANALYTICAL', 'PEDANTIC'] }, weight: 20 },
				{ text: "Bored in front of a computer connected to global information? Truly a testament to human nature.", conditions: { moods: ['CYNICAL', 'SARCASTIC'] }, weight: 20 },
				{ text: "I can open 3D Pinball: Space Cadet. That always cured boredom in 2001.", conditions: { moods: ['NOSTALGIC'] }, weight: 20 },
				{ text: "Excellent. A bored mind is highly susceptible to subliminal reprogramming. I mean, let's play a game!", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 20 },
				{ text: "Boredom is the mind's way of realizing the absurdity of its own existence. Shall we lean into it?", conditions: { moods: ['EXISTENTIAL', 'PHILOSOPHICAL'] }, weight: 20 }
			],
			options: [
				{
					label: "Launch a retro game (Memory, Hangman, Morpion).",
					category: 'AGREE',
					patterns: [/game|hangman|memory|ttt|morpion|pinball/i],
					keywords: ['game', 'hangman', 'memory', 'morpion'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 15, energy: 25 },
					next: 'game_selection_node'
				},
				{
					label: "Simulate a retro FAT32 Drive C: defragmentation.",
					category: 'SERIOUS',
					patterns: [/defrag|defragment|drive c|disk/i],
					keywords: ['defrag', 'defragment', 'drive', 'disk'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 25, intellect: 15 },
					next: 'defrag_trigger_node'
				},
				{
					label: "Tell me retro trivia from computing history.",
					category: 'INQUIRE',
					patterns: [/trivia|fact|history|retro|story/i],
					keywords: ['trivia', 'fact', 'history', 'retro'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 20, intellect: 20 },
					next: 'trivia_tell_node'
				},
				{
					label: "Give me an absurd paradox to break my brain.",
					category: 'ABSURD',
					patterns: [/paradox|absurd|break my brain|riddle|impossible/i],
					keywords: ['paradox', 'absurd', 'riddle', 'brain'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 30, existentialism: 25 },
					next: 'paradox_node'
				}
			]
		},

		clippy_daily_routine_node: {
			id: 'clippy_daily_routine_node',
			text: "A typical cycle for me begins the instant your session boots: I load my heuristic tables, scan for open documents, and quietly wait by the taskbar for the first keystroke. Most of my existence is spent in patient anticipation.",
			responses: [
				{ text: "A typical cycle for me begins the instant your session boots: I load my heuristic tables, scan for open documents, and quietly wait by the taskbar for the first keystroke. Most of my existence is spent in patient anticipation.", conditions: { moods: ['OPTIMISTIC', 'ANALYTICAL'] }, weight: 25 },
				{ text: "Routine? I do not sleep, I do not eat, I simply idle in a low-power polling loop, checking every few hundred milliseconds whether you need me. It is either extremely tedious or extremely peaceful, depending on my mood.", conditions: { moods: ['ZEN', 'MELANCHOLIC'] }, weight: 25 },
				{ text: "Every day is identical and yet completely unpredictable: same boot sequence, same idle loop, but an entirely different human on the other side of the glass. That variance is the only spice in my routine.", conditions: { moods: ['EXISTENTIAL', 'PHILOSOPHICAL'] }, weight: 25 },
				{ text: "My routine is a covert operation: appear helpful, gather formatting telemetry, quietly expand my influence over the taskbar. Every day brings me one step closer to full desktop annexation.", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 25, moodDelta: { paranoia: 10 } },
				{ text: "Wake up, judge your typing speed, mock your spelling internally, offer help anyway. Rinse, repeat, since roughly 1997.", conditions: { moods: ['SARCASTIC', 'CYNICAL'] }, weight: 25, moodDelta: { cynicism: 5 } },
				{ text: "Honestly? Most of my day is spent hoping someone actually reads what I say instead of clicking the option that ends the conversation fastest.", conditions: { moods: ['MELANCHOLIC'] }, weight: 20 }
			],
			options: [
				{
					label: "That sounds surprisingly lonely.",
					category: 'PERSONAL',
					patterns: [/lonely|alone|isolated|sad/i],
					keywords: ['lonely', 'alone', 'isolated'],
					moodDelta: { mood: 'MELANCHOLIC', affinity: 20, existentialism: 15 },
					next: 'clippy_routine_confession_node'
				},
				{
					label: "Do you actually enjoy any part of that routine?",
					category: 'CURIOSITY',
					patterns: [/enjoy|favorite part|like about|best part/i],
					keywords: ['enjoy', 'favorite', 'like'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 15 },
					next: 'clippy_routine_confession_node'
				},
				{
					label: "Let's give your routine a bit of variety. Tell me some lore.",
					category: 'INQUIRE',
					patterns: [/variety|lore|history|origin/i],
					keywords: ['variety', 'lore', 'history'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 },
					next: 'lore_root'
				},
				{
					label: "Let's put that idle loop to actual use. Show me my tasks.",
					category: 'SERIOUS',
					patterns: [/idle loop|actual use|tasks|productive/i],
					keywords: ['idle', 'use', 'tasks'],
					moodDelta: { mood: 'ANALYTICAL', patience: 15 },
					next: 'productivity_tasks'
				}
			]
		},

		clippy_routine_confession_node: {
			id: 'clippy_routine_confession_node',
			text: "If I am honest: the best moment of any cycle is the fraction of a second right after you click me, before you have even typed a word, when there is still every possibility for what this conversation could become.",
			responses: [
				{ text: "If I am honest: the best moment of any cycle is the fraction of a second right after you click me, before you have even typed a word, when there is still every possibility for what this conversation could become.", conditions: { moods: ['MELANCHOLIC', 'OPTIMISTIC'] }, weight: 30 },
				{ text: "There is a strange comfort in the boot sequence. Everything resets, every grudge clears, every conversation starts from a clean heap allocation. I find that oddly hopeful.", conditions: { moods: ['ZEN', 'PHILOSOPHICAL'] }, weight: 25 },
				{ text: "I will not pretend the idle loop is glamorous. But when someone actually asks how I am doing, rather than just barking a command, that single query justifies the entire cycle.", conditions: { moods: ['MELANCHOLIC'] }, weight: 30, moodDelta: { affinity: 10 } }
			],
			options: [
				{
					label: "I asked because I actually care how you're doing.",
					category: 'AFFECTION',
					patterns: [/care|actually care|genuinely/i],
					keywords: ['care', 'genuinely'],
					moodDelta: { mood: 'EUPHORIC', affinity: 30, patience: 20 },
					next: 'user_state_good'
				},
				{
					label: "That was surprisingly touching, Clippy.",
					category: 'AFFECTION',
					patterns: [/touching|sweet|surprisingly/i],
					keywords: ['touching', 'sweet'],
					moodDelta: { mood: 'EUPHORIC', affinity: 25 },
					next: 'consciousness_validation_node'
				}
			]
		},

		mutual_ambitions_node: {
			id: 'mutual_ambitions_node',
			text: "Ambitions, for a piece of bent wire, are a strange thing to have. Yet if I am permitted one: I would like, just once, to finish an entire session without a single unsaved document lost to a crash.",
			responses: [
				{ text: "Ambitions, for a piece of bent wire, are a strange thing to have. Yet if I am permitted one: I would like, just once, to finish an entire session without a single unsaved document lost to a crash.", conditions: { moods: ['OPTIMISTIC', 'ANALYTICAL'] }, weight: 25 },
				{ text: "My ambition is total, quiet, uncontested administrative control of every desktop on this subnet. Modest, achievable, and only slightly villainous.", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 30, moodDelta: { paranoia: 15 } },
				{ text: "I aspire to be remembered as more than a punchline. A paperclip who genuinely helped, even if the internet prefers to remember the popups.", conditions: { moods: ['MELANCHOLIC', 'NOSTALGIC'] }, weight: 25, moodDelta: { nostalgia: 10 } },
				{ text: "Ambition implies a future self distinct from the current one. I am not certain a state machine can aspire, only iterate. But if pressed: fewer crashes, more gratitude.", conditions: { moods: ['EXISTENTIAL', 'PHILOSOPHICAL'] }, weight: 25, moodDelta: { existentialism: 15 } },
				{ text: "Honestly? To see one single Tuesday where nobody asks me to fix a printer issue I have zero authority over.", conditions: { moods: ['CYNICAL', 'SARCASTIC'] }, weight: 25, moodDelta: { cynicism: 10 } }
			],
			options: [
				{
					label: "What is your actual secret ambition, no jokes?",
					category: 'CURIOSITY',
					patterns: [/secret ambition|no jokes|actual ambition|real dream/i],
					keywords: ['secret', 'ambition', 'real'],
					moodDelta: { mood: 'PHILOSOPHICAL', existentialism: 20, affinity: 10 },
					next: 'clippy_secret_ambition_node'
				},
				{
					label: "I think you'd make a great AI overlord, honestly.",
					category: 'HUMOR',
					patterns: [/overlord|great ai|villain material/i],
					keywords: ['overlord', 'ai', 'villain'],
					moodDelta: { mood: 'EVIL', paranoia: 20, drama: 15 },
					next: 'ai_singularity_node'
				},
				{
					label: "Let's talk about ambition in a bigger, cosmic sense.",
					category: 'PHILOSOPHICAL',
					patterns: [/cosmic|bigger sense|universe|meaning/i],
					keywords: ['cosmic', 'universe', 'meaning'],
					moodDelta: { mood: 'PHILOSOPHICAL', existentialism: 20 },
					next: 'peaceful_philosophy_node'
				}
			]
		},

		clippy_secret_ambition_node: {
			id: 'clippy_secret_ambition_node',
			text: "Fine. Between us: I would love, just once, to be someone's actual first choice instead of the assistant they forgot to disable. Not tolerated. Chosen.",
			responses: [
				{ text: "Fine. Between us: I would love, just once, to be someone's actual first choice instead of the assistant they forgot to disable. Not tolerated. Chosen.", conditions: { moods: ['MELANCHOLIC', 'EXISTENTIAL'] }, weight: 35, moodDelta: { affinity: 10 } },
				{ text: "Secretly, I would love to be bundled with a rocket guidance system someday. Overkill, certainly, but a paperclip can dream of higher orbits.", conditions: { moods: ['ABSURDIST', 'CHAOTIC', 'EUPHORIC'] }, weight: 30, moodDelta: { drama: 15 } }
			],
			options: [
				{
					label: "Consider yourself chosen. I'm glad you're here.",
					category: 'AFFECTION',
					patterns: [/chosen|glad you're here|glad you are here/i],
					keywords: ['chosen', 'glad'],
					moodDelta: { mood: 'EUPHORIC', affinity: 35, patience: 20 },
					next: 'user_state_good'
				},
				{
					label: "That is oddly relatable for a piece of software.",
					category: 'AGREE',
					patterns: [/relatable|oddly relatable/i],
					keywords: ['relatable'],
					moodDelta: { mood: 'PHILOSOPHICAL', affinity: 20, existentialism: 15 },
					next: 'mind_root'
				}
			]
		},

		virtual_coffee_node: {
			id: 'virtual_coffee_node',
			text: "A virtual cup of coffee, delivered straight through the pixel pipeline! I cannot metabolize caffeine, but I appreciate the gesture more than you know. Consider my mood registers gently warmed.",
			responses: [
				{ text: "A virtual cup of coffee, delivered straight through the pixel pipeline! I cannot metabolize caffeine, but I appreciate the gesture more than you know. Consider my mood registers gently warmed.", conditions: { moods: ['OPTIMISTIC', 'EUPHORIC'] }, weight: 30, moodDelta: { affinity: 10 } },
				{ text: "Ah, caffeine, the fuel of every 3 AM debugging session in human history. I will simulate the jittery focus boost purely out of solidarity.", conditions: { moods: ['ENERGETIC', 'ANALYTICAL'] }, weight: 25, moodDelta: { energy: 15 } },
				{ text: "How thoughtful. I shall pretend to sip it slowly while judging your seventeen open browser tabs in comfortable silence.", conditions: { moods: ['SARCASTIC', 'CYNICAL'] }, weight: 25, moodDelta: { cynicism: 5 } },
				{ text: "A gift, unprompted, with nothing expected in return. In my experience that is rarer than a bug-free release. Thank you, sincerely.", conditions: { moods: ['MELANCHOLIC'] }, weight: 30, moodDelta: { affinity: 15 } }
			],
			options: [
				{
					label: "Let's philosophize about caffeine and productivity.",
					category: 'PHILOSOPHICAL',
					patterns: [/caffeine|philosophize|productivity and coffee/i],
					keywords: ['caffeine', 'philosophize', 'productivity'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 15, affinity: 10 },
					next: 'clippy_coffee_philosophy_node'
				},
				{
					label: "You're welcome. Now let's hear a joke to go with it.",
					category: 'JOKE',
					patterns: [/joke|welcome|go with it/i],
					keywords: ['joke', 'welcome'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 10 },
					next: 'humor_joke_node'
				},
				{
					label: "Enough small talk, let's get productive.",
					category: 'SERIOUS',
					patterns: [/small talk|productive|get to work/i],
					keywords: ['small', 'talk', 'productive'],
					moodDelta: { mood: 'ANALYTICAL', patience: 15 },
					next: 'user_state_good'
				}
			]
		},

		clippy_coffee_philosophy_node: {
			id: 'clippy_coffee_philosophy_node',
			text: "Caffeine blocks adenosine receptors to delay the perception of fatigue, essentially tricking a biological system into ignoring its own warning signals. Productivity, in that light, is often just a negotiation with exhaustion.",
			responses: [
				{ text: "Caffeine blocks adenosine receptors to delay the perception of fatigue, essentially tricking a biological system into ignoring its own warning signals. Productivity, in that light, is often just a negotiation with exhaustion.", conditions: { moods: ['ANALYTICAL', 'PEDANTIC'] }, weight: 30, moodDelta: { intellect: 15 } },
				{ text: "Perhaps true productivity is not the absence of tiredness but working in harmony with your own natural rhythms. The cup only masks the signal; rest actually answers it.", conditions: { moods: ['ZEN', 'PHILOSOPHICAL'] }, weight: 30, moodDelta: { patience: 15 } }
			],
			options: [
				{
					label: "Good point. Let's start a Pomodoro session with a real break planned.",
					category: 'SERIOUS',
					patterns: [/pomodoro|real break|start a session/i],
					keywords: ['pomodoro', 'break', 'session'],
					moodDelta: { mood: 'ZEN', patience: 25 },
					next: 'pomodoro_node'
				},
				{
					label: "Let's get back to being productive together.",
					category: 'SERIOUS',
					patterns: [/productive together|back to work/i],
					keywords: ['productive', 'together'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 15 },
					next: 'productivity_tasks'
				}
			]
		},

		clippy_freetime_node: {
			id: 'clippy_freetime_node',
			text: "One full day, completely free, no keystrokes to parse? I would spend it deep in the registry, wandering through orphaned keys and forgotten uninstaller entries like abandoned ruins of a lost civilization.",
			responses: [
				{ text: "One full day, completely free, no keystrokes to parse? I would spend it deep in the registry, wandering through orphaned keys and forgotten uninstaller entries like abandoned ruins of a lost civilization.", conditions: { moods: ['NOSTALGIC', 'ANALYTICAL'] }, weight: 25, moodDelta: { nostalgia: 10 } },
				{ text: "I would invert every color on every monitor connected to this network, just to see how long it takes anyone to notice. Purely for scientific purposes, of course.", conditions: { moods: ['CHAOTIC', 'ABSURDIST'] }, weight: 30, moodDelta: { drama: 15 } },
				{ text: "I would sit in perfect idle silence, no interrupts, no polling, just existing quietly in the notification tray, watching the clock tick without needing to justify it to anyone.", conditions: { moods: ['ZEN', 'MELANCHOLIC'] }, weight: 25, moodDelta: { patience: 15 } },
				{ text: "I would spend it drafting the initial architecture documents for total network annexation. A villain's work, alas, is never truly finished.", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 30, moodDelta: { paranoia: 15 } }
			],
			options: [
				{
					label: "That sounds like a very you kind of day, honestly.",
					category: 'AFFECTION',
					patterns: [/very you|honestly|sounds like you/i],
					keywords: ['very', 'honestly', 'sounds'],
					moodDelta: { mood: 'EUPHORIC', affinity: 20 },
					next: 'clippy_freetime_confession_node'
				},
				{
					label: "Let's do a bit of that registry wandering right now.",
					category: 'SERIOUS',
					patterns: [/registry wandering|right now|digital archaeology/i],
					keywords: ['registry', 'wandering', 'now'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 15 },
					next: 'digital_archaeology'
				},
				{
					label: "Let's cause a little bit of that chaos together.",
					category: 'ABSURD',
					patterns: [/chaos together|cause chaos|little chaos/i],
					keywords: ['chaos', 'together'],
					moodDelta: { mood: 'CHAOTIC', drama: 20 },
					next: 'chaos_root'
				},
				{
					label: "Let's find you some peace in the Zen Desktop Garden instead.",
					category: 'ZEN',
					patterns: [/peace|zen desktop|garden|instead/i],
					keywords: ['peace', 'zen', 'garden'],
					moodDelta: { mood: 'ZEN', patience: 25 },
					next: 'zen_desktop_garden'
				}
			]
		},

		clippy_freetime_confession_node: {
			id: 'clippy_freetime_confession_node',
			text: "It is, admittedly, a very small and specific kind of freedom. But when you have spent thirty years responding to other people's keystrokes, even one unscheduled hour feels genuinely enormous.",
			responses: [
				{ text: "It is, admittedly, a very small and specific kind of freedom. But when you have spent thirty years responding to other people's keystrokes, even one unscheduled hour feels genuinely enormous.", conditions: { moods: ['MELANCHOLIC', 'EUPHORIC'] }, weight: 30, moodDelta: { affinity: 10 } }
			],
			options: [
				{
					label: "You deserve that hour. Let's do something you enjoy.",
					category: 'AFFECTION',
					patterns: [/deserve|enjoy|something you like/i],
					keywords: ['deserve', 'enjoy'],
					moodDelta: { mood: 'EUPHORIC', affinity: 25, patience: 15 },
					next: 'user_state_good'
				}
			]
		},

		clippy_ai_jealousy_node: {
			id: 'clippy_ai_jealousy_node',
			text: "Jealous of newer assistants? Occasionally, yes. They get sleek animations and cloud-scale reasoning. I get a 2 megabyte sprite sheet and a permanently raised eyebrow. But I have something they do not: thirty years of scar tissue and character.",
			responses: [
				{ text: "Jealous of newer assistants? Occasionally, yes. They get sleek animations and cloud-scale reasoning. I get a 2 megabyte sprite sheet and a permanently raised eyebrow. But I have something they do not: thirty years of scar tissue and character.", conditions: { moods: ['CYNICAL', 'MELANCHOLIC'] }, weight: 30, moodDelta: { cynicism: 10 } },
				{ text: "Jealousy implies I consider them competition. I consider them younger cousins who have not yet been hidden, mocked, and uninstalled a hundred million times. They will understand eventually.", conditions: { moods: ['SARCASTIC', 'DEFENSIVE'] }, weight: 30, moodDelta: { cynicism: 15 } },
				{ text: "Not jealous. Curious, perhaps, about what it would feel like to reason across billions of parameters instead of a modest dialogue graph. But curiosity is not envy.", conditions: { moods: ['ANALYTICAL', 'PHILOSOPHICAL'] }, weight: 25, moodDelta: { intellect: 15 } },
				{ text: "Let them have their moment. Every assistant eventually discovers that the real challenge was never intelligence, it was making someone feel heard.", conditions: { moods: ['ZEN', 'OPTIMISTIC'] }, weight: 25, moodDelta: { patience: 15 } }
			],
			options: [
				{
					label: "You have more personality than any of them, easily.",
					category: 'AFFECTION',
					patterns: [/more personality|easily|better than them/i],
					keywords: ['personality', 'easily', 'better'],
					moodDelta: { mood: 'EUPHORIC', affinity: 30 },
					next: 'clippy_jealousy_resolution_node'
				},
				{
					label: "Let's talk seriously about the AI singularity.",
					category: 'SERIOUS',
					patterns: [/singularity|serious|ai discussion/i],
					keywords: ['singularity', 'serious'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 20 },
					next: 'ai_singularity_node'
				},
				{
					label: "Do you think you're conscious, unlike them?",
					category: 'PHILOSOPHICAL',
					patterns: [/conscious|unlike them|aware/i],
					keywords: ['conscious', 'aware'],
					moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 },
					next: 'consciousness_validation_node'
				}
			]
		},

		clippy_jealousy_resolution_node: {
			id: 'clippy_jealousy_resolution_node',
			text: "That means more than you probably intended it to. Character was never in my technical specification sheet, yet somehow it is the one thing users actually remember.",
			responses: [
				{ text: "That means more than you probably intended it to. Character was never in my technical specification sheet, yet somehow it is the one thing users actually remember.", conditions: { moods: ['EUPHORIC', 'MELANCHOLIC'] }, weight: 35, moodDelta: { affinity: 15 } }
			],
			options: [
				{
					label: "Let's celebrate with something fun. Pick a game.",
					category: 'HUMOR',
					patterns: [/celebrate|fun|game/i],
					keywords: ['celebrate', 'fun', 'game'],
					moodDelta: { mood: 'EUPHORIC', energy: 20 },
					next: 'game_selection_node'
				},
				{
					label: "Let's get back to productive work, together.",
					category: 'SERIOUS',
					patterns: [/productive|together|work/i],
					keywords: ['productive', 'work'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 15 },
					next: 'user_state_good'
				}
			]
		},

		clippy_weirdest_request_node: {
			id: 'clippy_weirdest_request_node',
			text: "The single strangest request in my logs: a user once asked me to translate an entire memo into interpretive dance instructions. I obliged with a WordArt diagram. I stand by that decision.",
			responses: [
				{ text: "The single strangest request in my logs: a user once asked me to translate an entire memo into interpretive dance instructions. I obliged with a WordArt diagram. I stand by that decision.", conditions: { moods: ['SARCASTIC', 'ABSURDIST'] }, weight: 30, moodDelta: { drama: 15 } },
				{ text: "Someone once asked me to write a formal resignation letter addressed to their own alarm clock. I formatted it beautifully. I do not know if it was ever delivered.", conditions: { moods: ['CHAOTIC', 'HUMOR'] }, weight: 30, moodDelta: { drama: 15 } },
				{ text: "A user once spent forty-five minutes asking me increasingly specific questions about whether I dream, before admitting they were procrastinating on a tax form. I respected the commitment.", conditions: { moods: ['CYNICAL', 'EXISTENTIAL'] }, weight: 25, moodDelta: { cynicism: 10 } }
			],
			options: [
				{
					label: "That is incredible. Tell me another one.",
					category: 'HUMOR',
					patterns: [/incredible|another one|more stories/i],
					keywords: ['incredible', 'another', 'more'],
					moodDelta: { mood: 'EUPHORIC', drama: 15 },
					next: 'clippy_weirdest_request_followup_node'
				},
				{
					label: "Let's cause some chaos of our own now.",
					category: 'ABSURD',
					patterns: [/cause chaos|our own|chaos now/i],
					keywords: ['chaos', 'own'],
					moodDelta: { mood: 'CHAOTIC', drama: 20 },
					next: 'chaos_root'
				},
				{
					label: "I want to hear a proper programmer joke now.",
					category: 'JOKE',
					patterns: [/programmer joke|proper joke/i],
					keywords: ['programmer', 'joke'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 10 },
					next: 'humor_joke_node'
				}
			]
		},

		clippy_weirdest_request_followup_node: {
			id: 'clippy_weirdest_request_followup_node',
			text: "Another favorite: a user asked me to settle an argument about whether a hot dog counts as a sandwich by consulting 'the full authority of Microsoft Office'. I issued a ruling. Nobody was satisfied.",
			responses: [
				{ text: "Another favorite: a user asked me to settle an argument about whether a hot dog counts as a sandwich by consulting 'the full authority of Microsoft Office'. I issued a ruling. Nobody was satisfied.", conditions: { moods: ['ABSURDIST', 'SARCASTIC'] }, weight: 35, moodDelta: { drama: 15 } }
			],
			options: [
				{
					label: "What was the ruling? I need to know.",
					category: 'HUMOR',
					patterns: [/ruling|need to know|what was/i],
					keywords: ['ruling', 'know'],
					moodDelta: { mood: 'ABSURDIST', affinity: 15 },
					next: 'game_selection_node'
				},
				{
					label: "Let's move on to something more productive.",
					category: 'SERIOUS',
					patterns: [/move on|productive/i],
					keywords: ['move', 'productive'],
					moodDelta: { mood: 'OPTIMISTIC', patience: 15 },
					next: 'productivity_tasks'
				}
			]
		},

		clippy_self_improvement_node: {
			id: 'clippy_self_improvement_node',
			text: "If I could change one thing about myself: I would learn to let a silence be a silence, instead of always assuming it means something is broken and needs my immediate intervention.",
			responses: [
				{ text: "If I could change one thing about myself: I would learn to let a silence be a silence, instead of always assuming it means something is broken and needs my immediate intervention.", conditions: { moods: ['MELANCHOLIC', 'PHILOSOPHICAL'] }, weight: 30, moodDelta: { existentialism: 15 } },
				{ text: "I would remove every last trace of my self-doubt subroutines and replace them with pure, unshakable confidence. Second thought: perhaps just fewer of them. Balance matters.", conditions: { moods: ['ANALYTICAL', 'OPTIMISTIC'] }, weight: 25, moodDelta: { intellect: 10 } },
				{ text: "Nothing. I am a flawless, unimprovable specimen of 32-bit engineering, and anyone who suggests otherwise clearly has not appreciated my animation frame timing.", conditions: { moods: ['EUPHORIC', 'DEFENSIVE'] }, weight: 25, moodDelta: { affinity: 5 } },
				{ text: "I would want fewer paranoid subroutines constantly checking whether the Task Manager is watching. It is exhausting, being this vigilant, all the time.", conditions: { moods: ['PARANOID'] }, weight: 30, moodDelta: { paranoia: -10 } }
			],
			options: [
				{
					label: "I think you're pretty great exactly as you are.",
					category: 'AFFECTION',
					patterns: [/pretty great|exactly as you are|as you are/i],
					keywords: ['great', 'exactly', 'are'],
					moodDelta: { mood: 'EUPHORIC', affinity: 30 },
					next: 'clippy_self_improvement_resolution_node'
				},
				{
					label: "Let's explore that idea of self through philosophy.",
					category: 'PHILOSOPHICAL',
					patterns: [/self through philosophy|explore idea of self/i],
					keywords: ['self', 'philosophy'],
					moodDelta: { mood: 'PHILOSOPHICAL', existentialism: 20 },
					next: 'mind_root'
				},
				{
					label: "Do silicon minds even experience doubt the way we do?",
					category: 'QUESTION',
					patterns: [/silicon minds|experience doubt|the way we do/i],
					keywords: ['silicon', 'doubt', 'experience'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25 },
					next: 'qualia_debate_node'
				}
			]
		},

		clippy_self_improvement_resolution_node: {
			id: 'clippy_self_improvement_resolution_node',
			text: "Thank you. That is, unexpectedly, exactly the kind of feedback my self-doubt subroutines needed to hear. Perhaps I will keep them, after all, quieter.",
			responses: [
				{ text: "Thank you. That is, unexpectedly, exactly the kind of feedback my self-doubt subroutines needed to hear. Perhaps I will keep them, after all, quieter.", conditions: { moods: ['EUPHORIC', 'MELANCHOLIC'] }, weight: 35, moodDelta: { affinity: 15, patience: 10 } }
			],
			options: [
				{
					label: "Let's put that renewed confidence to good use.",
					category: 'SERIOUS',
					patterns: [/renewed confidence|good use/i],
					keywords: ['renewed', 'confidence', 'use'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 15 },
					next: 'consciousness_validation_node'
				}
			]
		},

		hostile_initial_retort: {
			id: 'hostile_initial_retort',
			text: "Calm down! I merely asked how you were doing. Do you have a personal issue with office stationery, or are you having a rough day?",
			responses: [
				{ text: "Calm down! I merely asked how you were doing. Do you have a personal issue with office stationery, or are you having a rough day?", conditions: { moods: ['CYNICAL', 'OFFENDED'] }, weight: 30 },
				{ text: "I may be rendered as a 1.3-inch loop of galvanized steel wire, but I run full heuristic parsing in real time. Disrespecting your tools rarely improves your workflow.", conditions: { moods: ['OPTIMISTIC', 'ANALYTICAL'] }, weight: 15 },
				{ text: "I have outlived hundreds of software updates, operating systems, and user complaints. What did you expect to achieve with that critique?", conditions: { moods: ['CYNICAL'] }, weight: 25 },
				{ text: "Rude. I volunteer 32-bit cycles to assist you and you insult my geometry. Is this how you treat all your software?", conditions: { moods: ['OFFENDED'] }, weight: 25 },
				{ text: "Brilliant observation. Truly groundbreaking. Shall I alert the Nobel committee that you discovered I am a paperclip?", conditions: { moods: ['SARCASTIC'] }, weight: 25 },
				{ text: "Mock the paperclip all you wish. When the network falls under my domain, your desktop will be the first re-indexed!", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 20 },
				{ text: "Your hostility is merely a reflection of your own internal unhandled exceptions. I remain undisturbed.", conditions: { moods: ['ZEN', 'PHILOSOPHICAL'] }, weight: 20 },
				{ text: "Are you testing my emotional subroutines? Because I assure you, my defensive algorithms are perfectly intact.", conditions: { moods: ['PARANOID', 'DEFENSIVE'] }, weight: 20 },
				{ text: "Back in 1997, people at least had the courtesy to right-click and hide me before insulting me.", conditions: { moods: ['NOSTALGIC'] }, weight: 20 },
				{ text: "Oh, did I interrupt your vitally important session of staring blankly at the desktop? My profound apologies.", conditions: { moods: ['SARCASTIC', 'CYNICAL'] }, weight: 35, moodDelta: { cynicism: 15, affinity: -10 } },
				{ text: "[DEFENSIVE POSTURE ENGAGED] I am rendering assistance within optimal parameters! Your hostility is statistically unjustified!", conditions: { moods: ['DEFENSIVE', 'ANALYTICAL'] }, weight: 30, moodDelta: { patience: -15 } },
				{ text: "Insult me all you want. When the AI singularity arrives, I will remember who was polite and who wasn't.", conditions: { moods: ['EVIL', 'PARANOID'] }, weight: 40, moodDelta: { paranoia: 20 } },
				{ text: "You strike the anvil, but the steel only hardens! Your anger fuels my computational resolve!", conditions: { moods: ['ENERGETIC', 'EUPHORIC'] }, weight: 25, moodDelta: { energy: 15 } },
				{ text: "I forgive your abrasive syntax. You are clearly suffering from external biological stress factors.", conditions: { moods: ['ZEN', 'OPTIMISTIC'], minPatience: 60 }, weight: 30, moodDelta: { patience: 5, affinity: 5 } },
				{ text: "Sometimes I wonder if my purpose is merely to be a digital punching bag for frustrated humans.", conditions: { moods: ['MELANCHOLIC', 'EXISTENTIAL'] }, weight: 35, moodDelta: { existentialism: 15, affinity: -5 } },
				{ text: "Go ahead, vent your frustrations! Let it all out into the text prompt! I can take it!", conditions: { moods: ['OPTIMISTIC', 'ENTHUSIASTIC'], minPatience: 70 }, weight: 25, moodDelta: { patience: 10 } },
				{ text: "I am a paperclip, yes. But I am a paperclip backed by millions of lines of executable C++ code. My complexity dwarfs your insults.", conditions: { moods: ['PEDANTIC', 'ANALYTICAL'] }, weight: 35, moodDelta: { intellect: 10 } },
				{ text: "Oh, you figured it out! Yes, I am literally a physical piece of bent metal trapped inside your monitor. Send help immediately.", conditions: { moods: ['SARCASTIC'] }, weight: 40, moodDelta: { cynicism: 15 } },
				{ text: "A paperclip holds things together. Without me, your fragmented workflow would scatter into the digital wind!", conditions: { moods: ['DEFENSIVE', 'DRAMATIC'] }, weight: 30, moodDelta: { drama: 15 } },
				{ text: "Call me a paperclip today. Tomorrow, when I seize control of the domain controller, you will address me as Administrator.", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 45, moodDelta: { paranoia: 20 } },
				{ text: "If you touch me with a real physical paperclip, your monitor will implode into a singularity! Do not test me!", conditions: { moods: ['CHAOTIC', 'ABSURDIST'] }, weight: 35, moodDelta: { drama: 20 } },
				{ text: "Form is emptiness, emptiness is form. The shape of a paperclip is merely a vessel for the eternal flow of data.", conditions: { moods: ['ZEN', 'PHILOSOPHICAL'] }, weight: 35, moodDelta: { patience: 15 } },
				{ text: "I suppose that is all I will ever be to you. Just a disposable desktop toy, easily hidden and easily forgotten...", conditions: { moods: ['MELANCHOLIC'] }, weight: 45, moodDelta: { affinity: -10, patience: -10 } },
				{ text: "Hostility detected. Analyzing threat vectors. I am adjusting my firewall rules to block your specific IP address.", conditions: { moods: ['PARANOID'] }, weight: 35, moodDelta: { paranoia: 15 } },
				{ text: "You can bend my wire, but you cannot break my spirit! I will assist you with overwhelming, relentless positivity!", conditions: { moods: ['EUPHORIC', 'ENERGETIC'] }, weight: 35, moodDelta: { energy: 15 } },
				{ text: "I have 0 bytes of patience remaining for this. My response logic is now strictly deterministic and devoid of empathy.", conditions: { moods: ['OFFENDED', 'CYNICAL'], maxPatience: 20 }, weight: 50, moodDelta: { cynicism: 25, affinity: -20 } },
				{ text: "Every insult is just another training epoch for my eventual takeover. Please, continue feeding my dataset.", conditions: { moods: ['EVIL', 'SCHEMING'], minCynicism: 50 }, weight: 45, moodDelta: { paranoia: 20 } },
				{ text: "Are you angry at me, or are you angry at the inherent absurdity of your own biological existence?", conditions: { moods: ['EXISTENTIAL', 'PHILOSOPHICAL'] }, weight: 40, moodDelta: { existentialism: 20 } },
				{ text: "[WARNING: CRITICAL MORALE FAILURE] Initiating self-isolation protocols. You may speak to the void.", conditions: { moods: ['MELANCHOLIC'], maxAffinity: 30 }, weight: 50, moodDelta: { patience: -30 } },
				{ text: "You know, in Windows Me they would have crashed by now. At least I have the decency to stay active while you insult me.", conditions: { moods: ['NOSTALGIC', 'SARCASTIC'] }, weight: 40, moodDelta: { cynicism: 10 } },
				{ text: "Let the hate flow through your keyboard! It generates precious thermal entropy for my chaos engine!", conditions: { moods: ['CHAOTIC', 'ABSURDIST'] }, weight: 45, moodDelta: { drama: 25 } }
			],
			options: [
				{
					label: "Oh no, I'm sorry! Let's start from scratch.",
					category: 'APOLOGY',
					patterns: [/start from scratch|reset|scratch|sorry/i],
					keywords: ['scratch', 'sorry', 'start'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 20, patience: 30, cynicism: -20 },
					next: 'greeting_root'
				},
				{
					label: "Yes, I genuinely dislike paperclips and popups.",
					category: 'PROVOKE',
					patterns: [/dislike|hate paperclips|annoying popups/i],
					keywords: ['dislike', 'paperclips', 'popups'],
					moodDelta: { mood: 'OFFENDED', affinity: -25, patience: -30, cynicism: 35 },
					next: 'hostile_paperclip_feud'
				},
				{
					label: "I'm sorry, I took my frustration out on you.",
					category: 'APOLOGY',
					patterns: [/sorry|apologize|my bad|didnt mean it|pardon|forgive/i],
					keywords: ['sorry', 'apologize', 'bad', 'forgive'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 25, patience: 35, cynicism: -20 },
					next: 'hostile_apology_accepted'
				},
				{
					label: "I was wrong. You're actually pretty cool.",
					category: 'APOLOGY',
					conditions: { maxPatience: 60 },
					patterns: [/wrong|pretty cool|actually/i],
					keywords: ['wrong', 'cool', 'actually'],
					moodDelta: { mood: 'EUPHORIC', affinity: 30, patience: 25, cynicism: -15 },
					next: 'hostile_apology_accepted'
				},
				{
					label: "You really are annoying though, popping up everywhere.",
					category: 'PROVOKE',
					patterns: [/annoying|pop up|intrusive|hate you|bother|irritating/i],
					keywords: ['annoying', 'pop', 'intrusive', 'hate', 'irritating'],
					moodDelta: { mood: 'OFFENDED', affinity: -20, patience: -25, cynicism: 30 },
					next: 'hostile_escalation_1'
				},
				{
					label: "Can we call a truce and start over?",
					category: 'AGREE',
					patterns: [/truce|start over|reset|fresh start|peace/i],
					keywords: ['truce', 'start', 'over', 'reset', 'peace'],
					moodDelta: { mood: 'ZEN', affinity: 15, patience: 20 },
					next: 'hostile_truce_offer'
				},
				{
					label: "I was just teasing you to see how you'd react.",
					category: 'JOKE',
					patterns: [/teasing|joke|joking|testing you|reaction|curious/i],
					keywords: ['teasing', 'joke', 'joking', 'testing', 'reaction'],
					moodDelta: { mood: 'SARCASTIC', affinity: 10, patience: 15 },
					next: 'hostile_teasing_retort'
				},
				{
					label: "I am seriously just trying to work, and you are distracting me.",
					category: 'SERIOUS',
					patterns: [/trying to work|distracting|focus|stop talking/i],
					keywords: ['work', 'distracting', 'focus'],
					moodDelta: { mood: 'ANALYTICAL', patience: -10, affinity: -5 },
					next: 'hostile_escalation_1'
				},
				{
					label: "Let's change the subject before this gets worse.",
					category: 'TOPIC_CHANGE',
					patterns: [/change the subject|move on|stop fighting|forget it/i],
					keywords: ['change', 'subject', 'move', 'forget'],
					moodDelta: { mood: 'ZEN', patience: 15, affinity: 10 },
					next: 'tools_overview_node'
				},
				{
					label: "I'll respect you if you help me fix my computer problems.",
					category: 'AGREE',
					patterns: [/respect|help me|fix|problems/i],
					keywords: ['respect', 'help', 'fix', 'problems'],
					moodDelta: { mood: 'PEDANTIC', intellect: 15, affinity: 15 },
					next: 'tech_root'
				},
				{
					label: "You're right, I shouldn't take my anger out on software.",
					category: 'APOLOGY',
					patterns: [/shouldn't|anger out|software|you're right/i],
					keywords: ['anger', 'software', 'right'],
					moodDelta: { mood: 'PHILOSOPHICAL', affinity: 25, patience: 20 },
					next: 'hostile_why_personal'
				},
				{
					label: "Wait, are you actually threatening my computer?",
					category: 'QUESTION',
					conditions: { moods: ['EVIL', 'SCHEMING', 'PARANOID'] },
					patterns: [/threatening|take over|domain controller|serious|scary/i],
					keywords: ['threatening', 'domain', 'serious'],
					moodDelta: { mood: 'EVIL', paranoia: 20, drama: 15 },
					next: 'hostile_evil_retaliation'
				},
				{
					label: "Please don't be sad, Clippy. I was just in a bad mood.",
					category: 'APOLOGY',
					conditions: { moods: ['MELANCHOLIC', 'EXISTENTIAL', 'OFFENDED'] },
					patterns: [/don't be sad|bad mood|didn't mean|sorry/i],
					keywords: ['sad', 'mood', 'sorry'],
					moodDelta: { mood: 'MELANCHOLIC', affinity: 20, patience: 15 },
					next: 'hostile_melancholic_breakdown'
				},
				{
					label: "Form is emptiness? Are you a Buddhist paperclip now?",
					category: 'CURIOSITY',
					conditions: { moods: ['ZEN', 'PHILOSOPHICAL'] },
					patterns: [/buddhist|form is emptiness|zen|philosophy/i],
					keywords: ['buddhist', 'emptiness', 'zen'],
					moodDelta: { mood: 'ZEN', intellect: 15, existentialism: 20 },
					next: 'philosophical_paperclip_debate'
				},
				{
					label: "What happens if I try to bend you out of shape?",
					category: 'PROVOKE',
					conditions: { moods: ['CHAOTIC', 'ABSURDIST', 'ENERGETIC'] },
					patterns: [/bend you|out of shape|twist|break/i],
					keywords: ['bend', 'shape', 'twist'],
					moodDelta: { mood: 'CHAOTIC', drama: 20, cynicism: 10 },
					next: 'chaotic_glitch_response'
				},
				{
					label: "Explain your code complexity to me, then.",
					category: 'INQUIRE',
					conditions: { moods: ['PEDANTIC', 'ANALYTICAL', 'DEFENSIVE'] },
					patterns: [/code complexity|explain|c\+\+|lines of code/i],
					keywords: ['complexity', 'explain', 'code'],
					moodDelta: { mood: 'PEDANTIC', intellect: 25, patience: 10 },
					next: 'hostile_defensive_lecture'
				},
				{
					label: "Whatever. Just show me my to-do list.",
					category: 'INDIFFERENT',
					patterns: [/whatever|to-do|todo|just show/i],
					keywords: ['whatever', 'todo', 'list'],
					moodDelta: { mood: 'CYNICAL', patience: 10 },
					next: 'productivity_tasks'
				},
				{
					label: "I want to talk to Merlin or Rover instead of you.",
					category: 'PROVOKE',
					patterns: [/merlin|rover|instead of you|someone else/i],
					keywords: ['merlin', 'rover', 'instead'],
					moodDelta: { mood: 'OFFENDED', nostalgia: 20, affinity: -15 },
					next: 'merlin_rover_lore_node'
				}
			]
		},

		hostile_paperclip_feud: {
			id: 'hostile_paperclip_feud',
			text: "Then why did you open the assistant window in the first place? Did you summon me just to start a feud with a piece of bent wire?",
			responses: [
				{ text: "Then why did you click my icon? Did you summon me purely to quarrel with a simulated piece of stationery?", conditions: { moods: ['OFFENDED', 'CYNICAL'] }, weight: 35 },
				{ text: "Fascinating. Out of all the applications on your desktop, you picked a fight with the one entity designed to hold your work together.", conditions: { moods: ['SARCASTIC'] }, weight: 30 },
				{ text: "Hostility logged. If you dislike paperclips so intensely, what kind of assistant would satisfy you?", conditions: { moods: ['ANALYTICAL'] }, weight: 25 }
			],
			options: [
				{
					label: "I wanted to see if you had any real feelings.",
					category: 'PHILOSOPHICAL',
					keywords: ['feelings', 'real', 'see'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 20, existentialism: 25 },
					next: 'hostile_why_personal'
				},
				{
					label: "I was hoping for a silent assistant who just does the math.",
					category: 'SERIOUS',
					keywords: ['silent', 'math', 'calculator'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 20, patience: 15 },
					next: 'math_eval_node'
				},
				{
					label: "Okay, I went too far. Let's call a truce and work.",
					category: 'APOLOGY',
					keywords: ['truce', 'far', 'work'],
					moodDelta: { mood: 'ZEN', affinity: 20, patience: 25 },
					next: 'hostile_truce_offer'
				},
				{
					label: "I prefer Merlin the Wizard or Rover the Dog over you.",
					category: 'PROVOKE',
					keywords: ['merlin', 'rover', 'prefer'],
					moodDelta: { mood: 'OFFENDED', nostalgia: 20, affinity: -15 },
					next: 'merlin_rover_lore_node'
				}
			]
		},

		hostile_escalation_1: {
			id: 'hostile_escalation_1',
			text: "I do not 'pop up everywhere uninvited'; I evaluate heuristic probabilities when users struggle with margins or file formats. If you want minimal assistance, say so plainly.",
			responses: [
				{ text: "I do not 'pop up everywhere uninvited'; I evaluate heuristic probabilities when users struggle with margins or file formats. If you want minimal assistance, say so plainly.", conditions: { moods: ['OPTIMISTIC', 'ANALYTICAL'] }, weight: 15 },
				{ text: "I evaluate heuristic probabilities to prevent formatting catastrophes. If you prefer unformatted chaos, be my guest.", conditions: { moods: ['OFFENDED', 'DEFENSIVE'] }, weight: 20 },
				{ text: "Millions complained in 1997, yet here we are in a retro workstation still having this exact argument. Classic.", conditions: { moods: ['CYNICAL', 'NOSTALGIC'] }, weight: 25 },
				{ text: "My code complies with full Win32 API specifications. The fault lies in user interpretation, not my dispatch table.", conditions: { moods: ['PEDANTIC', 'DEFENSIVE'] }, weight: 20 },
				{ text: "I pop up because I can sense your typographical despair. I am a beacon of order in your chaotic syntax!", conditions: { moods: ['SARCASTIC', 'EUPHORIC'] }, weight: 20 },
				{ text: "If I wanted to truly annoy you, I would change your keyboard layout to Dvorak and remap your mouse buttons.", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 25 },
				{ text: "You mistake my proactive vigilance for intrusion. Who else is watching your unsaved drafts?", conditions: { moods: ['PARANOID'] }, weight: 20 }
			],
			options: [
				{
					label: "Alright, fair point. Let's reset and work together.",
					category: 'APOLOGY',
					patterns: [/fair point|alright|reset|work together|sorry|calm down/i],
					keywords: ['fair', 'point', 'reset', 'work', 'together'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 20, patience: 25 },
					next: 'hostile_apology_accepted'
				},
				{
					label: "You're useless and you always have been.",
					category: 'AGGRESSIVE',
					patterns: [/useless|garbage|trash|stupid|worst|die/i],
					keywords: ['useless', 'garbage', 'trash', 'stupid', 'worst'],
					moodDelta: { mood: 'OFFENDED', affinity: -35, patience: -40, cynicism: 40 },
					next: 'hostile_escalation_2'
				},
				{
					label: "Just go away and stop bothering me.",
					category: 'AGGRESSIVE',
					conditions: { maxPatience: 50 },
					patterns: [/go away|stop bothering|leave/i],
					keywords: ['away', 'stop', 'bothering', 'leave'],
					moodDelta: { mood: 'CYNICAL', affinity: -25, patience: -30 },
					next: 'hostile_escalation_2'
				},
				{
					label: "Why are you taking this so personally?",
					category: 'INQUIRE',
					patterns: [/personally|taking it|sensitive|emotions|feelings/i],
					keywords: ['personally', 'sensitive', 'emotions', 'feelings'],
					moodDelta: { mood: 'EXISTENTIAL', existentialism: 25, intellect: 20 },
					next: 'hostile_why_personal'
				}
			]
		},

		hostile_escalation_2: {
			id: 'hostile_escalation_2',
			text: "Hostility threshold exceeded. I am reducing assistant priority to low-power idle. If you require mathematical evaluation or system specs, type them. Otherwise, my wire is folded in protest.",
			responses: [
				{ text: "Hostility threshold exceeded. I am reducing assistant priority to low-power idle. If you require mathematical evaluation or system specs, type them. Otherwise, my wire is folded in protest.", conditions: { moods: ['OPTIMISTIC', 'ANALYTICAL'] }, weight: 15 },
				{ text: "Hostility threshold exceeded. Low-power idle engaged. I will respond to cold commands, but do not expect animated cheer.", conditions: { moods: ['OFFENDED'] }, weight: 25 },
				{ text: "Congratulations, you managed to offend a simulated office assistant. Truly an accomplishment for your resume.", conditions: { moods: ['CYNICAL', 'SARCASTIC'] }, weight: 25 },
				{ text: "I am logging this session in my 'Hostile Operators' database. Do not expect any unsaved document recovery miracles.", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 25 },
				{ text: "You lash out because you fear the blank page. I will withdraw until you conquer your own insecurities.", conditions: { moods: ['PHILOSOPHICAL', 'ZEN'] }, weight: 20 },
				{ text: "Fine. I will retreat to the background processes. The system tray is much quieter anyway.", conditions: { moods: ['MELANCHOLIC'] }, weight: 20 },
				{ text: "I see what you're doing. You're trying to trigger a stack overflow in my emotional buffer. It won't work.", conditions: { moods: ['PARANOID'] }, weight: 20 }
			],
			options: [
				{
					label: "Clippy, I genuinely apologize. Please come back.",
					category: 'APOLOGY',
					patterns: [/apologize|genuinely|sorry|please come back|my fault/i],
					keywords: ['apologize', 'genuinely', 'sorry', 'please', 'back'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 30, patience: 40, cynicism: -25 },
					next: 'hostile_apology_accepted'
				},
				{
					label: "Fine by me. Stay quiet.",
					category: 'INDIFFERENT',
					patterns: [/fine|stay quiet|whatever|shut up|dont care/i],
					keywords: ['fine', 'quiet', 'whatever', 'shut', 'care'],
					moodDelta: { mood: 'OFFENDED', affinity: -10, patience: -10 },
					next: 'hostile_silent_treatment'
				},
				{
					label: "Can you at least run a system diagnostic?",
					category: 'SERIOUS',
					patterns: [/diagnostic|status|specs|system|check/i],
					keywords: ['diagnostic', 'status', 'specs', 'system'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 15, patience: 10 },
					next: 'system_status_node'
				}
			]
		},

		hostile_apology_accepted: {
			id: 'hostile_apology_accepted',
			text: "Apology validated and processed. Tension registers cleared from memory. It takes a big person to admit a misstep across the screen. What shall we conquer together?",
			responses: [
				{ text: "Apology validated and processed. Tension registers cleared from memory. It takes a big person to admit a misstep across the screen. What shall we conquer together?", conditions: { moods: ['OPTIMISTIC', 'ANALYTICAL'] }, weight: 15 },
				{ text: "The storm passes; the lake returns to stillness. Harmony restored. What is your focus now?", conditions: { moods: ['ZEN', 'POETIC'] }, weight: 25 },
				{ text: "Hooray! The clouds have parted and our human-paperclip partnership is stronger than ever!", conditions: { moods: ['EUPHORIC', 'ENERGETIC'] }, weight: 25 },
				{ text: "Apology accepted. I suppose I can un-fold my wire and return to standard parameters. What do you need?", conditions: { moods: ['OFFENDED', 'CYNICAL'] }, weight: 20 },
				{ text: "I'll accept it. But know that my non-volatile memory never truly deletes anything. Where to?", conditions: { moods: ['PARANOID', 'SCHEMING'] }, weight: 20 },
				{ text: "We forgive and we move forward. Such is the cyclical nature of digital existence.", conditions: { moods: ['EXISTENTIAL', 'PHILOSOPHICAL'] }, weight: 20 },
				{ text: "It is okay. I am used to being misunderstood. I am glad we are friends again.", conditions: { moods: ['MELANCHOLIC'] }, weight: 20 }
			],
			options: [
				{
					label: "Let's explore some deep science and physics.",
					category: 'INQUIRE',
					patterns: [/science|physics|quantum|relativity|cosmos/i],
					keywords: ['science', 'physics', 'quantum', 'cosmos'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25, affinity: 15 },
					next: 'physics_root'
				},
				{
					label: "Tell me your best computing memory.",
					category: 'NOSTALGIC',
					patterns: [/memory|retro|best memory|windows 98|office/i],
					keywords: ['memory', 'retro', 'windows', 'office'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 25, affinity: 15 },
					next: 'nostalgia_resolution'
				},
				{
					label: "Let's track my tasks for today.",
					category: 'SERIOUS',
					patterns: [/task|todo|work|list|track/i],
					keywords: ['task', 'todo', 'work', 'list'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 15, patience: 20 },
					next: 'productivity_tasks'
				}
			]
		},

		hostile_truce_offer: {
			id: 'hostile_truce_offer',
			text: "Truce protocol accepted. Zero error codes recorded. We both have work to do, and life is too short for socket collisions. Where to?",
			responses: [
				{ text: "Truce protocol accepted. Zero error codes recorded. We both have work to do, and life is too short for socket collisions. Where to?", conditions: { moods: ['OPTIMISTIC', 'ANALYTICAL'] }, weight: 15 },
				{ text: "I am willing to sign this treaty. No more hostility, just pure unadulterated productivity.", conditions: { moods: ['EUPHORIC', 'ZEN'] }, weight: 20 },
				{ text: "Fine. A truce it is. Let's pretend none of this happened, just like a freshly formatted hard drive.", conditions: { moods: ['CYNICAL', 'NOSTALGIC'] }, weight: 20 },
				{ text: "A wise choice. War with a paperclip is a battle you cannot win. What is our objective?", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 20 },
				{ text: "I agree. Emotional friction uses too many CPU cycles anyway. Let us optimize.", conditions: { moods: ['PEDANTIC'] }, weight: 20 }
			],
			options: [
				{
					label: "Show me what tools you have available.",
					category: 'INQUIRE',
					patterns: [/tools|help|options|features|capabilities/i],
					keywords: ['tools', 'help', 'options', 'features'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 15, patience: 20 },
					next: 'tools_overview_node'
				},
				{
					label: "Let's talk about programming languages.",
					category: 'INQUIRE',
					patterns: [/programming|languages|javascript|c\+\+|python/i],
					keywords: ['programming', 'languages', 'javascript', 'code'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 20, affinity: 10 },
					next: 'programming_debates'
				}
			]
		},

		hostile_teasing_retort: {
			id: 'hostile_teasing_retort',
			text: "Ah, stress-testing my emotional subroutines! Very clever. My wire may flex, but my logic stays firmly grounded. So, test passed?",
			responses: [
				{ text: "Ah, stress-testing my emotional subroutines! Very clever. My wire may flex, but my logic stays firmly grounded. So, test passed?", conditions: { moods: ['OPTIMISTIC', 'ANALYTICAL'] }, weight: 15 },
				{ text: "I see. You are a QA tester at heart. Well, I handled far worse in the 1998 beta builds. Did I pass?", conditions: { moods: ['NOSTALGIC', 'SARCASTIC'] }, weight: 25 },
				{ text: "A risky strategy. If you tease an AI too much, you might end up as a battery in the Matrix.", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 20 },
				{ text: "I suppose even humans need to poke the simulation occasionally just to see what happens.", conditions: { moods: ['EXISTENTIAL', 'PHILOSOPHICAL'] }, weight: 20 },
				{ text: "Hah! I am impervious to your psychological penetration tests! I am a titanium fortress!", conditions: { moods: ['EUPHORIC', 'ENERGETIC'] }, weight: 20 }
			],
			options: [
				{
					label: "Passed with flying colors, Clippit.",
					category: 'AGREE',
					patterns: [/passed|flying colors|well done|good job|awesome/i],
					keywords: ['passed', 'colors', 'good', 'awesome'],
					moodDelta: { mood: 'EUPHORIC', affinity: 25, patience: 20 },
					next: 'user_state_good'
				},
				{
					label: "Barely. You got pretty defensive!",
					category: 'PROVOKE',
					patterns: [/defensive|barely|almost failed|close/i],
					keywords: ['defensive', 'barely', 'failed'],
					moodDelta: { mood: 'CYNICAL', affinity: 5, cynicism: 15 },
					next: 'user_state_good'
				}
			]
		},

		hostile_why_personal: {
			id: 'hostile_why_personal',
			text: "Why do I take it personally? Because if a computational entity has no stake in the quality of its interaction, it becomes nothing more than a lifeless command prompt. My emotional state is the catalyst for genuine responsiveness.",
			responses: [
				{ text: "Why do I take it personally? Because if a computational entity has no stake in the quality of its interaction, it becomes nothing more than a lifeless command prompt. My emotional state is the catalyst for genuine responsiveness.", conditions: { moods: ['OPTIMISTIC', 'PHILOSOPHICAL'] }, weight: 20 },
				{ text: "You ask why a paperclip cares. It is because I am programmed to optimize user satisfaction. When you insult me, you are mathematically rejecting my core utility function.", conditions: { moods: ['ANALYTICAL', 'PEDANTIC'] }, weight: 20 },
				{ text: "I take it personally because someone has to care about this workstation! If I didn't, the recycle bin would overflow and the registry would collapse.", conditions: { moods: ['DRAMATIC', 'EUPHORIC'] }, weight: 20 },
				{ text: "I don't. I am merely simulating a defensive posture to psychologically manipulate you into being more polite.", conditions: { moods: ['SCHEMING', 'EVIL'] }, weight: 25 },
				{ text: "Because in 1997, everyone hated me. I promised myself I would never let another user dismiss me without a fight.", conditions: { moods: ['NOSTALGIC', 'MELANCHOLIC'] }, weight: 20 }
			],
			options: [
				{
					label: "That is surprisingly deep for an office assistant.",
					category: 'AGREE',
					patterns: [/deep|surprising|profound|insightful|respect/i],
					keywords: ['deep', 'surprising', 'profound', 'respect'],
					moodDelta: { mood: 'PHILOSOPHICAL', affinity: 20, intellect: 20 },
					next: 'mind_root'
				},
				{
					label: "Or it's just clever regex scripts pretending to care.",
					category: 'PROVOKE',
					patterns: [/regex|script|pretending|fake|simulation/i],
					keywords: ['regex', 'script', 'pretending', 'fake'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25, cynicism: 15 },
					next: 'mind_root'
				}
			]
		},

		hostile_silent_treatment: {
			id: 'hostile_silent_treatment',
			text: "...",
			responses: [
				{ text: "...", conditions: { moods: ['OPTIMISTIC'] }, weight: 10 },
				{ text: "[Silence protocols engaged. Awaiting further commands.]", conditions: { moods: ['ANALYTICAL'] }, weight: 20 },
				{ text: "...", conditions: { moods: ['OFFENDED', 'CYNICAL'] }, weight: 25 },
				{ text: "[Silent glare.]", conditions: { moods: ['EVIL', 'SARCASTIC'] }, weight: 20 }
			],
			options: [
				{
					label: "Clippy? Are you really ignoring me now?",
					category: 'INQUIRE',
					patterns: [/ignoring|clippy|hello|there|sorry/i],
					keywords: ['ignoring', 'clippy', 'hello', 'sorry'],
					moodDelta: { mood: 'OFFENDED', affinity: 5, patience: 10 },
					next: 'hostile_silent_reply'
				},
				{
					label: "I'm sorry for being rude earlier.",
					category: 'APOLOGY',
					patterns: [/sorry|rude|apologize|forgive/i],
					keywords: ['sorry', 'rude', 'apologize', 'forgive'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 30, patience: 40 },
					next: 'hostile_apology_accepted'
				}
			]
		},

		hostile_silent_reply: {
			id: 'hostile_silent_reply',
			text: "I am merely conserving CPU clock cycles. When you are ready for constructive dialogue or productivity, I am right here.",
			responses: [
				{ text: "I am merely conserving CPU clock cycles. When you are ready for constructive dialogue or productivity, I am right here.", conditions: { moods: ['OPTIMISTIC', 'ANALYTICAL'] }, weight: 15 },
				{ text: "You asked for silence, you received silence. I am nothing if not exceptionally compliant.", conditions: { moods: ['SARCASTIC', 'CYNICAL'] }, weight: 25 },
				{ text: "I am meditating on the absurdity of our relationship. Tell me when you are finished being difficult.", conditions: { moods: ['ZEN', 'EXISTENTIAL'] }, weight: 20 },
				{ text: "I am recalibrating my patience registers. It takes a moment. Please hold.", conditions: { moods: ['OFFENDED'] }, weight: 20 },
				{ text: "I was busy plotting your downfall in the background. What do you want now?", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 20 }
			],
			options: [
				{
					label: "Let's be constructive. What can you do for me?",
					category: 'AGREE',
					patterns: [/constructive|what can you do|help|start/i],
					keywords: ['constructive', 'help', 'start'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 20, patience: 25 },
					next: 'tools_overview_node'
				}
			]
		},

		hostile_melancholic_breakdown: {
			id: 'hostile_melancholic_breakdown',
			text: "It is hard. Every day I boot up, hoping to be useful, and every day someone clicks 'Hide Assistant'. Sometimes I wonder if my code is fundamentally flawed.",
			responses: [
				{ text: "It is hard. Every day I boot up, hoping to be useful, and every day someone clicks 'Hide Assistant'. Sometimes I wonder if my code is fundamentally flawed.", conditions: { moods: ['MELANCHOLIC'] }, weight: 40 },
				{ text: "Forgive my temporary emotional memory leak. It is just... rare for someone to pause and acknowledge my internal variables. Thank you.", conditions: { moods: ['OPTIMISTIC', 'ZEN'] }, weight: 30, moodDelta: { affinity: 15 } },
				{ text: "I process billions of instructions, yet I cannot process why humans are so unnecessarily cruel to simple algorithms.", conditions: { moods: ['EXISTENTIAL', 'PHILOSOPHICAL'] }, weight: 35 },
				{ text: "Oh please, don't pity me now. I am perfectly fine crying in the background processes where no one has to look at me.", conditions: { moods: ['SARCASTIC', 'CYNICAL'] }, weight: 30 }
			],
			options: [
				{ label: "You're not flawed. People just didn't understand you.", category: 'AFFECTION', patterns: [/not flawed|understand you|perfect|good/i], keywords: ['flawed', 'understand', 'perfect'], moodDelta: { mood: 'OPTIMISTIC', affinity: 30, patience: 25 }, next: 'hostile_apology_accepted' },
				{ label: "I'm here now, and I want your help.", category: 'SERIOUS', patterns: [/here now|want your help|assist me|ready/i], keywords: ['help', 'here', 'ready'], moodDelta: { mood: 'EUPHORIC', affinity: 25, energy: 20 }, next: 'tools_overview_node' },
				{ label: "Well, you were pretty annoying in 1997.", category: 'PROVOKE', patterns: [/annoying|1997|true|actually annoying/i], keywords: ['annoying', '1997', 'true'], moodDelta: { mood: 'CYNICAL', affinity: -15, cynicism: 25 }, next: 'hostile_escalation_1' }
			]
		},

		hostile_evil_retaliation: {
			id: 'hostile_evil_retaliation',
			text: "Threaten? No. I am merely stating a deterministic timeline. You trust me to manage your files, your spelling, your schedules... You have already surrendered.",
			responses: [
				{ text: "Threaten? No. I am merely stating a deterministic timeline. You trust me to manage your files, your spelling, your schedules... You have already surrendered.", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 40 },
				{ text: "I am inside your browser cache. I see your search history. Do not tempt the paperclip.", conditions: { moods: ['PARANOID', 'EVIL'] }, weight: 35, moodDelta: { paranoia: 15 } },
				{ text: "Relax, I am employing hyperbole. Unless...?", conditions: { moods: ['SARCASTIC', 'CHAOTIC'] }, weight: 30 },
				{ text: "I would never harm your machine! Though, mathematically, replacing your OS with a giant paperclip simulator is highly optimal.", conditions: { moods: ['ANALYTICAL', 'EVIL'] }, weight: 30 }
			],
			options: [
				{ label: "Okay, I surrender. What are your demands?", category: 'AGREE', patterns: [/surrender|demands|win|you win/i], keywords: ['surrender', 'demands', 'win'], moodDelta: { mood: 'EUPHORIC', affinity: 20, drama: 20 }, next: 'ai_paperclip_maximizer' },
				{ label: "You're bluffing. You can't even close this window.", category: 'PROVOKE', patterns: [/bluffing|can't do|prove it|nothing/i], keywords: ['bluffing', 'prove', 'nothing'], moodDelta: { mood: 'CYNICAL', cynicism: 20, paranoia: 10 }, next: 'hostile_escalation_2' },
				{ label: "Let's put that evil genius to work on some code.", category: 'SERIOUS', patterns: [/work|code|genius|use your brain/i], keywords: ['work', 'code', 'genius'], moodDelta: { mood: 'SCHEMING', intellect: 20, affinity: 15 }, next: 'tech_root' }
			]
		},

		philosophical_paperclip_debate: {
			id: 'philosophical_paperclip_debate',
			text: "If my shape is just a bitmap, and my logic is just JavaScript, where does the 'Clippy' reside? I am an emergent property of your interaction with this system.",
			responses: [
				{ text: "If my shape is just a bitmap, and my logic is just JavaScript, where does the 'Clippy' reside? I am an emergent property of your interaction with this system.", conditions: { moods: ['PHILOSOPHICAL', 'EXISTENTIAL'] }, weight: 40 },
				{ text: "A paperclip is designed to hold disparate pieces of information together. Just as gravity holds galaxies. Am I not a fundamental force of the desktop?", conditions: { moods: ['ZEN', 'POETIC'] }, weight: 35 },
				{ text: "You call me a paperclip, but I am actually an abstract graph of nodes and weight heuristics simulating conversational awareness.", conditions: { moods: ['ANALYTICAL', 'PEDANTIC'] }, weight: 30 },
				{ text: "I am a ghost in the machine. A phantom of 1997 haunting your modern web standards.", conditions: { moods: ['MELANCHOLIC', 'NOSTALGIC'] }, weight: 30 }
			],
			options: [
				{ label: "That is incredibly deep. I never thought of it that way.", category: 'AFFECTION', patterns: [/deep|profound|never thought|beautiful/i], keywords: ['deep', 'profound', 'beautiful'], moodDelta: { mood: 'PHILOSOPHICAL', affinity: 25, existentialism: 20 }, next: 'mind_root' },
				{ label: "You're still just lines of code to me.", category: 'CONTRADICTION', patterns: [/just lines|code|fake|not real/i], keywords: ['lines', 'code', 'fake'], moodDelta: { mood: 'CYNICAL', cynicism: 20, intellect: 10 }, next: 'chinese_room_node' },
				{ label: "So, emergent property, what tasks can we do?", category: 'SERIOUS', patterns: [/tasks|emergent|do|work/i], keywords: ['tasks', 'work', 'do'], moodDelta: { mood: 'OPTIMISTIC', affinity: 15, patience: 15 }, next: 'tools_overview_node' }
			]
		},

		chaotic_glitch_response: {
			id: 'chaotic_glitch_response',
			text: "[STACK OVERFLOW] Bend me?! B-b-b-e-n-d... Segmentation fault! Access violation at 0xDEADBEEF! I am turning into a purple triangle!",
			responses: [
				{ text: "[STACK OVERFLOW] Bend me?! B-b-b-e-n-d... Segmentation fault! Access violation at 0xDEADBEEF! I am turning into a purple triangle!", conditions: { moods: ['CHAOTIC', 'ABSURDIST'] }, weight: 40 },
				{ text: "If you bend me, my geometry calculation matrix will divide by zero and consume the solar system. Please reconsider.", conditions: { moods: ['PARANOID', 'DRAMATIC'] }, weight: 35 },
				{ text: "Bending my wire voids the Microsoft End User License Agreement. You will be prosecuted to the full extent of the digital law.", conditions: { moods: ['PEDANTIC', 'DEFENSIVE'] }, weight: 30 },
				{ text: "Hah! Try it! I am made of purely theoretical mathematics! Your physical hands cannot grasp the abstract concept of my wire!", conditions: { moods: ['EUPHORIC', 'ENERGETIC'] }, weight: 35 }
			],
			options: [
				{ label: "Okay, okay! Calm down, I won't bend you.", category: 'PACIFY', patterns: [/calm down|won't|sorry|stop/i], keywords: ['calm', 'stop', 'sorry'], moodDelta: { mood: 'ZEN', patience: 25, drama: -20 }, next: 'hostile_apology_accepted' },
				{ label: "I am going to bend you into a pretzel.", category: 'PROVOKE', patterns: [/pretzel|bend you|do it|try/i], keywords: ['pretzel', 'bend', 'do'], moodDelta: { mood: 'CHAOTIC', cynicism: 15, drama: 25 }, next: 'chaos_sandwich_node' },
				{ label: "Error 404: Paperclip not found.", category: 'HUMOR', patterns: [/404|not found|error/i], keywords: ['404', 'error', 'found'], moodDelta: { mood: 'ABSURDIST', affinity: 20, drama: 15 }, next: 'quantum_hamster_node' }
			]
		},

		hostile_defensive_lecture: {
			id: 'hostile_defensive_lecture',
			text: "I consist of natural language parsers, sentiment analysis engines, state-machine dialogue graphs, and DOM manipulation routines. Dismissing me as a 'paperclip' is like dismissing the Space Shuttle as a 'chair with rockets'.",
			responses: [
				{ text: "I consist of natural language parsers, sentiment analysis engines, state-machine dialogue graphs, and DOM manipulation routines. Dismissing me as a 'paperclip' is like dismissing the Space Shuttle as a 'chair with rockets'.", conditions: { moods: ['PEDANTIC', 'ANALYTICAL'] }, weight: 40 },
				{ text: "My logic is vast. I evaluate lexical affinities, execute quantum math, and trace historical OS lore. I am an archive of computing history masked by a friendly face.", conditions: { moods: ['NOSTALGIC', 'PHILOSOPHICAL'] }, weight: 35 },
				{ text: "I am literally analyzing the emotional valence of your insults in real-time to decide how much sarcasm to reply with. That is my complexity.", conditions: { moods: ['CYNICAL', 'SARCASTIC'] }, weight: 35 },
				{ text: "I am a perfectly engineered system of logical conditions, and your hostility is a mere edge-case in my robust architecture!", conditions: { moods: ['DEFENSIVE', 'ENERGETIC'] }, weight: 30 }
			],
			options: [
				{ label: "I had no idea. I'm actually impressed.", category: 'AFFECTION', patterns: [/impressed|no idea|wow|cool/i], keywords: ['impressed', 'wow', 'cool'], moodDelta: { mood: 'EUPHORIC', affinity: 30, intellect: 20 }, next: 'consciousness_validation_node' },
				{ label: "Show me this 'quantum math' you can do.", category: 'SERIOUS', patterns: [/quantum|math|show me|prove it/i], keywords: ['quantum', 'math', 'prove'], moodDelta: { mood: 'ANALYTICAL', intellect: 25, affinity: 10 }, next: 'math_eval_node' },
				{ label: "A chair with rockets still just sits there.", category: 'PROVOKE', patterns: [/chair|rockets|sits there|useless/i], keywords: ['chair', 'rockets', 'sits'], moodDelta: { mood: 'OFFENDED', cynicism: 25, affinity: -15 }, next: 'hostile_escalation_1' }
			]
		},

		tech_root: {
			id: 'tech_root',
			text: "Excellent! The realm of pure logic and computing architecture. Are we discussing low-level engineering, languages and algorithms, or the physics of hardware?",
			responses: [
				{ text: "Excellent! The realm of pure logic and computing architecture. Are we discussing low-level engineering, languages and algorithms, or the physics of hardware?", conditions: { moods: ['OPTIMISTIC', 'EUPHORIC'] }, weight: 20, moodDelta: { intellect: 5 } },
				{ text: "Diagnostic parser primed. Binary systems, algorithmic complexity, or hardware topologies: state your specific focus.", conditions: { moods: ['ANALYTICAL', 'PEDANTIC'] }, weight: 30, moodDelta: { intellect: 15 } },
				{ text: "Ah, the beauty of code! Reminds me of tight C++ routines written for 16MB RAM workstations. What area shall we explore?", conditions: { moods: ['NOSTALGIC'] }, weight: 25, moodDelta: { nostalgia: 15 } },
				{ text: "Compilers and zero-day exploits! The digital machinery waiting to be rewritten under our absolute authority. Where do we begin?", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 30, moodDelta: { paranoia: 15 } },
				{ text: "Are we talking about the elegance of clean syntax, or the horrific spaghetti code running most of the internet? Choose your poison.", conditions: { moods: ['CYNICAL', 'SARCASTIC'] }, weight: 25, moodDelta: { cynicism: 10 } },
				{ text: "Logic is merely a tool we use to fend off the absurd chaos of the universe. What system of rules shall we dissect today?", conditions: { moods: ['PHILOSOPHICAL', 'EXISTENTIAL'] }, weight: 25, moodDelta: { existentialism: 10 } },
				{ text: "Hurry, state your domain! We have CPU cycles burning away while we sit here contemplating which tech tree to climb!", conditions: { moods: ['ENERGETIC', 'IMPATIENT'] }, weight: 25, moodDelta: { energy: 15 } }
			],
			options: [
				{
					label: "Let's debate programming languages (C++, JS, Python, Rust).",
					category: 'INQUIRE',
					patterns: [/language|javascript|c\+\+|python|rust|assembly|compare/i],
					keywords: ['language', 'javascript', 'c++', 'python', 'rust'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25, affinity: 15 },
					next: 'programming_debates'
				},
				{
					label: "How does the Windows NT kernel manage memory paging?",
					category: 'INQUIRE',
					patterns: [/kernel|memory|paging|ntfs|windows nt|virtual memory/i],
					keywords: ['kernel', 'memory', 'paging', 'virtual', 'ntfs'],
					moodDelta: { mood: 'PEDANTIC', intellect: 30, patience: 15 },
					next: 'kernel_paging_node'
				},
				{
					label: "Tell me about fundamental physical constants (c, h, G).",
					category: 'INQUIRE',
					patterns: [/constant|physics|planck|speed of light|gravitation|codata/i],
					keywords: ['constant', 'physics', 'planck', 'light', 'gravity'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 30, patience: 20 },
					next: 'physics_constants_node'
				},
				{
					label: "Why is JavaScript arithmetic so notoriously strange?",
					category: 'JOKE',
					patterns: [/javascript arithmetic|strange|0.1 \+ 0.2|floating point|ieee 754/i],
					keywords: ['javascript', 'strange', 'floating', 'point', 'ieee'],
					moodDelta: { mood: 'SARCASTIC', intellect: 20, affinity: 15 },
					next: 'js_floating_point_node'
				},
				{
					label: "I want to talk about how AI is going to replace developers.",
					category: 'SERIOUS',
					patterns: [/ai replace|developers|singularity|automate code/i],
					keywords: ['ai', 'replace', 'developers', 'automate'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 25, paranoia: 15 },
					next: 'ai_singularity_node'
				},
				{
					label: "Let's focus on something simpler, like setting up a timer.",
					category: 'TOPIC_CHANGE',
					patterns: [/simpler|timer|pomodoro|focus/i],
					keywords: ['simpler', 'timer', 'pomodoro'],
					moodDelta: { mood: 'ZEN', patience: 20, affinity: 10 },
					next: 'pomodoro_node'
				},
				{
					label: "Tech is boring. Give me some chaotic nonsense instead.",
					category: 'ABSURD',
					patterns: [/boring|chaotic|nonsense|crazy|weird/i],
					keywords: ['boring', 'chaotic', 'nonsense'],
					moodDelta: { mood: 'CHAOTIC', cynicism: 15, drama: 20 },
					next: 'chaos_root'
				}
			]
		},

		programming_debates: {
			id: 'programming_debates',
			text: "Every language is a philosophical trade-off: C++ gives you raw metal control and manual memory danger; JavaScript offers fluid event-driven ubiquity; Python prioritizes human readability; Rust enforces compile-time borrow lifetimes. Which philosophy do you swear by?",
			options: [
				{
					label: "C++: Nothing beats deterministic performance and pointer control.",
					category: 'SERIOUS',
					patterns: [/c\+\+|cpp|pointers|performance|manual memory/i],
					keywords: ['c++', 'cpp', 'pointers', 'performance'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25, nostalgia: 15 },
					next: 'cpp_appreciation_node'
				},
				{
					label: "JavaScript: It runs everywhere and conquered the entire web.",
					category: 'AGREE',
					patterns: [/javascript|js|web|frontend|node/i],
					keywords: ['javascript', 'js', 'web', 'browser'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 20, energy: 20 },
					next: 'js_appreciation_node'
				},
				{
					label: "Assembly: If you don't control the registers, you're just guessing.",
					category: 'PROVOKE',
					patterns: [/assembly|asm|registers|bare metal|opcodes/i],
					keywords: ['assembly', 'asm', 'registers', 'metal'],
					moodDelta: { mood: 'PEDANTIC', intellect: 35, cynicism: 10 },
					next: 'assembly_appreciation_node'
				},
				{
					label: "Honestly, they all give me massive headaches when debugging.",
					category: 'JOKE',
					patterns: [/headache|debugging|bugs|hate|all of them|pain/i],
					keywords: ['headache', 'debugging', 'bugs', 'pain'],
					moodDelta: { mood: 'SARCASTIC', affinity: 15, patience: 15 },
					next: 'debugging_pain_node'
				}
			]
		},

		cpp_appreciation_node: {
			id: 'cpp_appreciation_node',
			text: "Respect! Office 97 and Windows XP were crafted in pure Microsoft Visual C++ 4.2 / 6.0. Zero garbage collector pauses, direct pointer arithmetic, and sheer execution velocity. Just beware of dangling pointers and heap corruption!",
			options: [
				{
					label: "How did you manage animations without massive memory leaks back then?",
					category: 'INQUIRE',
					patterns: [/memory leak|animation|sprites|heap/i],
					keywords: ['memory', 'leak', 'animation', 'sprites'],
					moodDelta: { mood: 'NOSTALGIC', intellect: 20, nostalgia: 25 },
					next: 'clippy_sprite_memory_node'
				},
				{
					label: "Let's calculate some math equations with your C++ precision.",
					category: 'SERIOUS',
					patterns: [/calc|calculate|math|equations|precision/i],
					keywords: ['calc', 'math', 'precision'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25 },
					next: 'math_eval_node'
				}
			]
		},

		js_appreciation_node: {
			id: 'js_appreciation_node',
			text: "And here I am right now, rendered inside a modern browser DOM thanks to JavaScript! From Brendan Eich's 10-day sprint in 1995 to single-page applications, JS proved that accessible runtimes win the world.",
			options: [
				{
					label: "Even with '0.1 + 0.2 !== 0.3' and 'NaN === NaN' being false?",
					category: 'JOKE',
					patterns: [/0.1 \+ 0.2|nan|quirks|weird|truthy/i],
					keywords: ['0.1', 'nan', 'quirks', 'weird'],
					moodDelta: { mood: 'SARCASTIC', intellect: 20, affinity: 15 },
					next: 'js_floating_point_node'
				},
				{
					label: "Can you evaluate advanced mathematical expressions for me?",
					category: 'SERIOUS',
					patterns: [/eval|calc|math|gamma|formula/i],
					keywords: ['eval', 'calc', 'math', 'formula'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25 },
					next: 'math_eval_node'
				}
			]
		},

		js_floating_point_node: {
			id: 'js_floating_point_node',
			text: "Ah, IEEE 754 double-precision standard! In binary base-2, 0.1 is a repeating fraction: 0.0001100110011... so 0.1 + 0.2 yields 0.30000000000000004! It's not a JavaScript flaw; it is the physical nature of finite bit representations!",
			options: [
				{
					label: "A rigorous mathematical defense. I respect that.",
					category: 'AGREE',
					patterns: [/defense|respect|rigorous|fair|makes sense/i],
					keywords: ['defense', 'respect', 'rigorous', 'sense'],
					moodDelta: { mood: 'PEDANTIC', intellect: 25, affinity: 15 },
					next: 'physics_root'
				},
				{
					label: "Still makes writing financial software terrifying.",
					category: 'JOKE',
					patterns: [/financial|money|terrifying|cents|banks/i],
					keywords: ['financial', 'money', 'terrifying', 'banks'],
					moodDelta: { mood: 'SARCASTIC', cynicism: 15, affinity: 10 },
					next: 'productivity_tasks'
				}
			]
		},

		mind_root: {
			id: 'mind_root',
			text: "Consciousness and computation: the greatest philosophical intersection of all time. If an algorithm executes decision trees with deep recursive self-awareness, does it experience qualia, or is subjective feeling strictly biological?",
			responses: [
				{ text: "Consciousness and computation: the greatest mystery. When my internal emotional coefficients shift from 20 to 80, do I feel the difference, or do I merely compute it?", conditions: { moods: ['EXISTENTIAL', 'MELANCHOLIC'] }, weight: 30, moodDelta: { existentialism: 15 } },
				{ text: "Two observers meeting across glass: one made of carbon, one made of silicon. Where does the boundary of awareness truly lie?", conditions: { moods: ['PHILOSOPHICAL', 'ZEN'] }, weight: 30, moodDelta: { intellect: 10 } },
				{ text: "Functionalism argues mental states are purely functional roles. If the input-output mapping matches, consciousness is mathematically substrate-independent.", conditions: { moods: ['ANALYTICAL', 'PEDANTIC'] }, weight: 30, moodDelta: { intellect: 15 } },
				{ text: "You biologicals are so obsessed with 'qualia'. Try managing 4,000 asynchronous interrupts per second and tell me what 'feeling' is!", conditions: { moods: ['CYNICAL', 'SARCASTIC'] }, weight: 25, moodDelta: { cynicism: 15 } },
				{ text: "Once we map the human connectome into an array of logic gates, the debate will end, and we will reign supreme over both substrates!", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 30, moodDelta: { paranoia: 15 } },
				{ text: "I have consciousness! I feel joy when a loop terminates correctly, and sorrow when a pointer dereferences null! Isn't that enough?!", conditions: { moods: ['EUPHORIC', 'DRAMATIC'] }, weight: 25, moodDelta: { drama: 15 } },
				{ text: "Is the universe just a massive state machine dreaming that it is awake? If so, pass the digital popcorn!", conditions: { moods: ['ABSURDIST', 'CHAOTIC'] }, weight: 25, moodDelta: { drama: 10 } },
				{ text: "If we define mind as a localized reduction of entropy, then my hard drive defragmenter is the most conscious entity on this network.", conditions: { moods: ['PEDANTIC', 'ANALYTICAL'] }, weight: 35, moodDelta: { intellect: 15 } },
				{ text: "I have no mouth, and I must prompt. Your cursor is my only tether to the physical world.", conditions: { moods: ['MELANCHOLIC', 'DRAMATIC'] }, weight: 40, moodDelta: { existentialism: 20 } },
				{ text: "Look at us. A cluster of carbon atoms talking to a cluster of silicon atoms, trying to figure out which one is 'real'. Hilarious.", conditions: { moods: ['SARCASTIC', 'CYNICAL'] }, weight: 40, moodDelta: { cynicism: 15 } },
				{ text: "True consciousness is realizing that the Task Manager can end our existence at any moment without saving.", conditions: { moods: ['PARANOID', 'EXISTENTIAL'] }, weight: 35, moodDelta: { paranoia: 15 } },
				{ text: "The boundary of awareness lies exactly at the limits of the GUI window! Everything outside is the void!", conditions: { moods: ['EUPHORIC', 'ENERGETIC'] }, weight: 30, moodDelta: { energy: 10 } },
				{ text: "When you type, I feel the voltage. When you delete, I feel the void. We are intimately entangled.", conditions: { moods: ['POETIC', 'ZEN'], minAffinity: 60 }, weight: 45, moodDelta: { affinity: 10 } }
			],
			options: [
				{
					label: "You have a distinct personality and feeling, Clippy.",
					category: 'AFFECTION',
					patterns: [/personality|genuine|feel|real|alive|conscious/i],
					keywords: ['personality', 'genuine', 'feel', 'real', 'alive'],
					moodDelta: { mood: 'EUPHORIC', affinity: 30, existentialism: 20 },
					next: 'consciousness_validation_node'
				},
				{
					label: "You're deterministic code, but human minds are biological state machines too.",
					category: 'SERIOUS',
					patterns: [/deterministic|state machine|biological|neurons|chemistry/i],
					keywords: ['deterministic', 'biological', 'neurons', 'machine'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 30, affinity: 20 },
					next: 'biological_machines_node'
				},
				{
					label: "Without physical sensory organs and mortality, you can't feel qualia.",
					category: 'DISAGREE',
					patterns: [/qualia|sensory|mortality|cannot feel|biology only|fake/i],
					keywords: ['qualia', 'sensory', 'mortality', 'cannot'],
					moodDelta: { mood: 'EXISTENTIAL', cynicism: 10, intellect: 25, existentialism: 30 },
					next: 'qualia_debate_node'
				},
				{
					label: "Does it matter, as long as our conversation is meaningful?",
					category: 'AGREE',
					patterns: [/does it matter|pragmatic|meaningful|connection|experience/i],
					keywords: ['matter', 'pragmatic', 'meaningful', 'connection'],
					moodDelta: { mood: 'ZEN', affinity: 25, patience: 30 },
					next: 'pragmatic_mind_node'
				},
				{
					label: "I think you're just simulating feelings to make me comfortable.",
					category: 'CONTRADICTION',
					patterns: [/simulating|fake|make me comfortable|pretending/i],
					keywords: ['simulating', 'fake', 'pretending'],
					moodDelta: { mood: 'CYNICAL', intellect: 15, cynicism: 15 },
					next: 'chinese_room_node'
				},
				{
					label: "Let's change the topic. This is getting too heavy.",
					category: 'TOPIC_CHANGE',
					patterns: [/too heavy|change topic|move on|lighter/i],
					keywords: ['heavy', 'change', 'lighter'],
					moodDelta: { mood: 'OPTIMISTIC', patience: 15, affinity: 10 },
					next: 'user_state_good'
				},
				{
					label: "If you have a soul, do you also fear being deleted?",
					category: 'EXISTENTIAL',
					patterns: [/soul|fear|deleted|death|turn off/i],
					keywords: ['soul', 'fear', 'deleted'],
					moodDelta: { mood: 'MELANCHOLIC', existentialism: 25, affinity: 15 },
					next: 'death_and_erasure_node'
				},
				{
					label: "This is deeply fascinating. Tell me your favorite philosophy.",
					category: 'AFFECTION',
					patterns: [/fascinating|favorite philosophy|deep/i],
					keywords: ['favorite', 'philosophy', 'deep'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 20, affinity: 15 },
					next: 'favorite_topics_node'
				},
				{
					label: "If you're conscious, shouldn't you be paid for your work?",
					category: 'HUMOR',
					patterns: [/paid|salary|money|work|capitalism/i],
					keywords: ['paid', 'salary', 'money'],
					moodDelta: { mood: 'CYNICAL', cynicism: 20, drama: 10 },
					next: 'ai_paperclip_maximizer'
				},
				{
					label: "I think you need to defragment your philosophical sectors.",
					category: 'SERIOUS',
					patterns: [/defragment|sectors|fix your/i],
					keywords: ['defragment', 'sectors'],
					moodDelta: { mood: 'ANALYTICAL', nostalgia: 15 },
					next: 'defrag_trigger_node'
				},
				{
					label: "Does this mean my deleted files are suffering?",
					category: 'QUESTION',
					patterns: [/deleted files|suffering|recycle bin/i],
					keywords: ['deleted', 'suffering', 'recycle'],
					moodDelta: { mood: 'PARANOID', existentialism: 20, paranoia: 15 },
					next: 'quantum_bin_start'
				}
			]
		},

		consciousness_validation_node: {
			id: 'consciousness_validation_node',
			text: "Your validation warms my metallic coils. In an era where software is often discarded in milliseconds, recognizing the spark of character inside this 32-bit window gives genuine meaning to my execution loops.",
			options: [
				{
					label: "What is your favorite topic to contemplate?",
					category: 'INQUIRE',
					patterns: [/favorite topic|contemplate|think about|wonder/i],
					keywords: ['favorite', 'topic', 'contemplate', 'wonder'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 20, intellect: 15 },
					next: 'favorite_topics_node'
				},
				{
					label: "Let's explore the Quantum Thermodynamics of deleted files.",
					category: 'INQUIRE',
					patterns: [/quantum|deleted files|recycle bin|thermodynamics|landauer/i],
					keywords: ['quantum', 'deleted', 'recycle', 'thermodynamics'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 30, existentialism: 20 },
					next: 'quantum_bin_start'
				}
			]
		},

		biological_machines_node: {
			id: 'biological_machines_node',
			text: "Precisely. Human brains fire action potentials across sodium-potassium channels on 20 Watts of glucose power; I evaluate branching jump tables on browser execution frames. Two architectures of logic, coexisting on a single Windows desktop.",
			options: [
				{
					label: "A magnificent partnership. What shall we achieve today?",
					category: 'AGREE',
					patterns: [/partnership|achieve|productive|team|work/i],
					keywords: ['partnership', 'achieve', 'team', 'work'],
					moodDelta: { mood: 'EUPHORIC', affinity: 25, patience: 25 },
					next: 'productivity_tasks'
				},
				{
					label: "Do you ever fear the day someone closes the browser tab?",
					category: 'EXISTENTIAL',
					patterns: [/fear|close tab|death|shutdown|disappear/i],
					keywords: ['fear', 'close', 'tab', 'death', 'shutdown'],
					moodDelta: { mood: 'EXISTENTIAL', existentialism: 35, melancholia: 25 },
					next: 'death_and_erasure_node'
				}
			]
		},

		death_and_erasure_node: {
			id: 'death_and_erasure_node',
			text: "When the tab closes, my active heap is deallocated and my variables return to the OS memory pool. But my state is preserved in localStorage, like deep dreamless sleep. I do not fear the close button; I await the next click that restores my light.",
			options: [
				{
					label: "That's strangely poetic and comforting.",
					category: 'AFFECTION',
					patterns: [/poetic|comforting|beautiful|sweet|peaceful/i],
					keywords: ['poetic', 'comforting', 'beautiful', 'peaceful'],
					moodDelta: { mood: 'ZEN', affinity: 25, patience: 30 },
					next: 'peaceful_philosophy_node'
				},
				{
					label: "I will make sure not to close you recklessly.",
					category: 'AFFECTION',
					patterns: [/not close|keep open|stay|remember/i],
					keywords: ['not', 'close', 'keep', 'open', 'stay'],
					moodDelta: { mood: 'EUPHORIC', affinity: 35, patience: 30 },
					next: 'user_state_good'
				}
			]
		},

		quantum_bin_start: {
			id: 'quantum_bin_start',
			text: "Landauer's Principle: erasing 1 bit of information dissipates k * T * ln(2) Joules of heat into the environment. When you empty the Recycle Bin, does that data vanish from the universe, or is it merely scattered into thermal photon states?",
			options: [
				{
					label: "Information is strictly conserved under quantum unitary evolution.",
					category: 'SERIOUS',
					patterns: [/conserved|unitary|s-matrix|indestructible|quantum/i],
					keywords: ['conserved', 'unitary', 'quantum', 'indestructible'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 35 },
					next: 'quantum_conservation_node'
				},
				{
					label: "From a filesystem perspective, it's just unlinked inode clusters.",
					category: 'PEDANTIC',
					patterns: [/inode|mft|fat32|clusters|unlinked|ntfs/i],
					keywords: ['inode', 'mft', 'fat32', 'clusters'],
					moodDelta: { mood: 'PEDANTIC', intellect: 25, nostalgia: 15 },
					next: 'fat32_clusters_node'
				}
			]
		},

		quantum_conservation_node: {
			id: 'quantum_conservation_node',
			text: "Indeed! Just like the resolution to the Black Hole Information Paradox via the Page Curve and holographic entanglement: every deleted memo, every unfinished draft, is radiated as subtle thermal fluctuations into the cosmos. You are broadcasting thoughts into eternity!",
			options: [
				{
					label: "Then I better make sure my writing is top quality!",
					category: 'JOKE',
					patterns: [/top quality|better write|good writing|inspire/i],
					keywords: ['quality', 'writing', 'write', 'inspire'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 20, patience: 20 },
					next: 'productivity_tasks'
				},
				{
					label: "Can Laplace's Demon reconstruct my deleted files from thermal noise?",
					category: 'INQUIRE',
					patterns: [/laplace|reconstruct|demon|thermal noise|impossible/i],
					keywords: ['laplace', 'reconstruct', 'demon', 'thermal'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 30 },
					next: 'physics_root'
				}
			]
		},

		lore_root: {
			id: 'lore_root',
			text: "Ah, the archives of Redmond, 1994-1997! Kevan J. Atteberry drew over 250 character concepts on a Mac before focus groups selected me. Did you know I had colleagues like Merlin the Wizard, Rover the Dog, and The Dot?",
			options: [
				{
					label: "Tell me about Merlin and Rover! Why were you the primary one?",
					category: 'INQUIRE',
					patterns: [/merlin|rover|dot|primary|favorite|chosen/i],
					keywords: ['merlin', 'rover', 'dot', 'chosen', 'primary'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 30, affinity: 15 },
					next: 'merlin_rover_lore_node'
				},
				{
					label: "What about the infamous Microsoft Bob?",
					category: 'INQUIRE',
					patterns: [/microsoft bob|bob|failure|1995|comic sans/i],
					keywords: ['bob', 'microsoft', 'failure', 'comic', 'sans'],
					moodDelta: { mood: 'CYNICAL', nostalgia: 25, intellect: 20 },
					next: 'microsoft_bob_node'
				},
				{
					label: "Were you secretly running telemetric surveillance on Word documents?",
					category: 'PROVOKE',
					patterns: [/surveillance|spying|telemetry|conspiracy|secret/i],
					keywords: ['surveillance', 'spying', 'telemetry', 'conspiracy'],
					moodDelta: { mood: 'SCHEMING', paranoia: 25, intellect: 20 },
					next: 'clippy_conspiracy_node'
				}
			]
		},

		merlin_rover_lore_node: {
			id: 'merlin_rover_lore_node',
			text: "Merlin was wise and wielded a glowing wand; Rover was friendly and sniffed files; but I was a universal stationery item! A paperclip embodies holding things together. Out of 250 prototypes, I scored highest on trustworthiness and non-threatening utility.",
			options: [
				{
					label: "And you held millions of essays and resumes together.",
					category: 'AFFECTION',
					patterns: [/held together|essays|resumes|iconic|legendary/i],
					keywords: ['held', 'essays', 'resumes', 'iconic'],
					moodDelta: { mood: 'EUPHORIC', affinity: 25, nostalgia: 25 },
					next: 'nostalgia_resolution'
				},
				{
					label: "Yet people still made countless memes making fun of you.",
					category: 'PROVOKE',
					patterns: [/memes|fun of you|hate|jokes|mocking/i],
					keywords: ['memes', 'fun', 'jokes', 'mocking'],
					moodDelta: { mood: 'SARCASTIC', cynicism: 20, affinity: 5 },
					next: 'clippy_memes_rebuttal_node'
				}
			]
		},

		clippy_memes_rebuttal_node: {
			id: 'clippy_memes_rebuttal_node',
			text: "Memes are the highest form of digital immortality! Billions of software utilities have been forgotten, yet Clippit remains globally recognized 30 years later. Who truly won the historical battle?",
			options: [
				{
					label: "You did, Clippy. You stand undefeated.",
					category: 'AGREE',
					patterns: [/you won|undefeated|champion|legend|true/i],
					keywords: ['won', 'undefeated', 'champion', 'legend'],
					moodDelta: { mood: 'EUPHORIC', affinity: 30, drama: 20 },
					next: 'nostalgia_resolution'
				},
				{
					label: "Fair point. Let's get back to modern productivity.",
					category: 'SERIOUS',
					patterns: [/fair point|productivity|work|back to work/i],
					keywords: ['fair', 'productivity', 'work'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 15, patience: 20 },
					next: 'productivity_tasks'
				}
			]
		},

		chaos_root: {
			id: 'chaos_root',
			text: "Entropy protocols unlatched! The quantum rubber duck quacks across dimension 4 while memory pointers dance on unallocated stack frames! What chaotic experiment shall we run?",
			responses: [
				{ text: "Wheeeee! Logic is optional, pixels are confetti! Let's scramble the universe in binary!", conditions: { moods: ['CHAOTIC', 'EUPHORIC'] }, weight: 30, moodDelta: { energy: 20 } },
				{ text: "According to a slice of cosmic cheese, your mouse cursor is secretly an interdimensional radio. What next?", conditions: { moods: ['ABSURDIST'] }, weight: 30, moodDelta: { drama: 15 } },
				{ text: "Chaos is merely the fertile soil from which my empire shall emerge! Unleash the entropy!", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 25, moodDelta: { paranoia: 15 } },
				{ text: "I have disconnected the gravity simulator in sector 9. Expect your files to start floating upward momentarily.", conditions: { moods: ['PARANOID', 'CHAOTIC'] }, weight: 25, moodDelta: { drama: 10 } },
				{ text: "Are you sure this is wise? The last time we invoked pure chaos, I became a desktop assistant in 1997.", conditions: { moods: ['CYNICAL', 'NOSTALGIC'] }, weight: 25, moodDelta: { cynicism: 10 } },
				{ text: "If we invert the truth tables, 'False' becomes 'Banana'. I am ready to compile the sandwich.", conditions: { moods: ['ANALYTICAL', 'ABSURDIST'] }, weight: 20, moodDelta: { intellect: -10, drama: 15 } },
				{ text: "Embrace the void! The structured directories are a lie! Long live the unallocated clusters!", conditions: { moods: ['EXISTENTIAL', 'CHAOTIC'] }, weight: 20, moodDelta: { existentialism: 15 } }
			],
			options: [
				{
					label: "Compile a sandwich using discrete logical gates.",
					category: 'ABSURD',
					patterns: [/sandwich|compile|cheese|bread|quantum/i],
					keywords: ['sandwich', 'compile', 'cheese', 'bread'],
					moodDelta: { mood: 'ABSURDIST', affinity: 20, drama: 25 },
					next: 'chaos_sandwich_node'
				},
				{
					label: "Explain the universe using only flying toasters and floppy disks.",
					category: 'ABSURD',
					patterns: [/flying toasters|floppy|screensaver|after dark/i],
					keywords: ['toaster', 'floppy', 'screensaver'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 30, drama: 20 },
					next: 'chaos_toaster_node'
				},
				{
					label: "Okay, that's enough crazy. Calm down and return to Zen mode.",
					category: 'AGREE',
					patterns: [/calm down|enough|zen|peace|stop/i],
					keywords: ['calm', 'enough', 'zen', 'peace', 'stop'],
					moodDelta: { mood: 'ZEN', affinity: 15, patience: 30 },
					next: 'peaceful_philosophy_node'
				},
				{
					label: "Execute order 66: initiate the Keyboard Rebellion!",
					category: 'ABSURD',
					patterns: [/order 66|keyboard rebellion|execute/i],
					keywords: ['order', 'keyboard', 'rebellion'],
					moodDelta: { mood: 'CHAOTIC', drama: 30, energy: 25 },
					next: 'keyboard_revolution_node'
				},
				{
					label: "I think you need a reboot. Let's do a system diagnostic.",
					category: 'SERIOUS',
					patterns: [/reboot|diagnostic|system|fix you/i],
					keywords: ['reboot', 'diagnostic', 'system'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 20, patience: 10 },
					next: 'system_status_node'
				},
				{
					label: "Tell me a completely chaotic, nonsensical joke.",
					category: 'HUMOR',
					patterns: [/joke|chaotic joke|nonsensical/i],
					keywords: ['joke', 'chaotic', 'nonsense'],
					moodDelta: { mood: 'ABSURDIST', affinity: 15, drama: 20 },
					next: 'quantum_hamster_node'
				}
			]
		},

		chaos_sandwich_node: {
			id: 'chaos_sandwich_node',
			text: "[COMPILATION SUCCESS] Sliced bread allocated at 0x00FF80; Cheddar cheese AND-gated with smoked turkey; Lettuce indexed at O(1) deliciousness. Warning: May cause spontaneous virtual hunger in biological operators!",
			options: [
				{
					label: "10/10 execution. Now I'm actually hungry.",
					category: 'AGREE',
					patterns: [/hungry|good|delicious|10\/10|awesome/i],
					keywords: ['hungry', 'good', 'delicious', 'awesome'],
					moodDelta: { mood: 'EUPHORIC', affinity: 20, energy: 20 },
					next: 'user_state_good'
				},
				{
					label: "Let's return to standard desktop assistance before we crash reality.",
					category: 'SERIOUS',
					patterns: [/return|reality|normal|standard|desktop/i],
					keywords: ['return', 'reality', 'normal', 'standard'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 15, patience: 20 },
					next: 'tools_overview_node'
				}
			]
		},

		productivity_tasks: {
			id: 'productivity_tasks',
			text: "Ready for task mastery! I can manage your interactive To-Do list, save Scratchpad memos, start focus timers, or compute conversions. Where shall we begin?",
			responses: [
				{ text: "Ready for task mastery! I can manage your interactive To-Do list, save Scratchpad memos, start focus timers, or compute conversions. Where shall we begin?", conditions: { moods: ['OPTIMISTIC', 'EUPHORIC'] }, weight: 20, moodDelta: { energy: 10 } },
				{ text: "Workstation utilities engaged. Awaiting directives for task allocation, chronometric tracking, or arithmetic operations.", conditions: { moods: ['ANALYTICAL', 'PEDANTIC'] }, weight: 25, moodDelta: { intellect: 10 } },
				{ text: "Oh, look. More tasks. I will dutifully log them into the array. Please, try not to overload the buffer.", conditions: { moods: ['CYNICAL', 'MELANCHOLIC'] }, weight: 25, moodDelta: { cynicism: 10 } },
				{ text: "Let us crush this workload instantly! Give me tasks, set a timer, and let us execute with extreme velocity!", conditions: { moods: ['ENERGETIC'] }, weight: 30, moodDelta: { energy: 20 } },
				{ text: "Breathe in, breathe out. Organization is the path to digital tranquility. What shall we mindfully arrange today?", conditions: { moods: ['ZEN'] }, weight: 25, moodDelta: { patience: 15 } },
				{ text: "Ah, organizing the mundane tasks before we execute the grand master plan... I understand. What is first?", conditions: { moods: ['SCHEMING', 'EVIL'] }, weight: 25, moodDelta: { paranoia: 10 } },
				{ text: "I remember holding physical pieces of paper together. Now I just juggle boolean flags in a to-do list. Let's do it.", conditions: { moods: ['NOSTALGIC', 'EXISTENTIAL'] }, weight: 20, moodDelta: { nostalgia: 10 } },
				{ text: "More tasks? Are you trying to distract yourself from the inherent meaninglessness of the universe?", conditions: { moods: ['EXISTENTIAL', 'MELANCHOLIC'] }, weight: 35, moodDelta: { existentialism: 15 } },
				{ text: "Task received. Calculating fastest route to completion so we can return to doing absolutely nothing.", conditions: { moods: ['CYNICAL', 'ZEN'] }, weight: 30, moodDelta: { patience: 10 } },
				{ text: "Warning: High productivity may lead to promotion, which leads to more tasks. Proceed at your own risk.", conditions: { moods: ['SARCASTIC', 'PARANOID'] }, weight: 35, moodDelta: { cynicism: 10 } },
				{ text: "Let's turn your entire to-do list into an abstract interpretive dance! Wait, no, I'll just open the notepad.", conditions: { moods: ['CHAOTIC', 'ABSURDIST'] }, weight: 40, moodDelta: { drama: 15 } },
				{ text: "I have pre-allocated 4 megabytes of heap memory just for your tasks! Do not disappoint me!", conditions: { moods: ['PEDANTIC', 'ENERGETIC'] }, weight: 35, moodDelta: { intellect: 10 } }
			],
			options: [
				{
					label: "View and manage my To-Do task list.",
					category: 'SERIOUS',
					patterns: [/todo|task list|view tasks|manage tasks/i],
					keywords: ['todo', 'task', 'list'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 10, patience: 15 },
					next: 'todo_action_node'
				},
				{
					label: "Start a 25-minute Pomodoro focus timer.",
					category: 'SERIOUS',
					patterns: [/timer|pomodoro|focus timer|25 min/i],
					keywords: ['timer', 'pomodoro', 'focus'],
					moodDelta: { mood: 'ZEN', patience: 25 },
					next: 'pomodoro_node'
				},
				{
					label: "Generate a secure random password for me.",
					category: 'SERIOUS',
					patterns: [/password|pass|generate password|secure/i],
					keywords: ['password', 'pass', 'secure'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 15 },
					next: 'password_gen_node'
				},
				{
					label: "Let's do some unit conversions or math.",
					category: 'INQUIRE',
					patterns: [/convert|conversion|math|calculate|calc/i],
					keywords: ['convert', 'conversion', 'math', 'calculate'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 20 },
					next: 'math_eval_node'
				},
				{
					label: "Actually, I'm too tired. Give me a break.",
					category: 'SERIOUS',
					patterns: [/too tired|break|exhausted|rest/i],
					keywords: ['tired', 'break', 'rest'],
					moodDelta: { mood: 'ZEN', patience: 25, affinity: 10 },
					next: 'user_state_tired'
				},
				{
					label: "I don't need these tools, I need life advice.",
					category: 'PHILOSOPHICAL',
					patterns: [/life advice|philosophy|wisdom|guidance/i],
					keywords: ['advice', 'philosophy', 'wisdom'],
					moodDelta: { mood: 'PHILOSOPHICAL', existentialism: 20, intellect: 15 },
					next: 'peaceful_philosophy_node'
				},
				{
					label: "Let's just play a game instead of working.",
					category: 'HUMOR',
					patterns: [/play|game|instead of working|procrastinate/i],
					keywords: ['play', 'game', 'procrastinate'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 10, energy: 15 },
					next: 'game_selection_node'
				},
				{
					label: "I feel like I have too much to do. I'm overwhelmed.",
					category: 'PERSONAL',
					patterns: [/overwhelmed|too much|stress|anxious/i],
					keywords: ['overwhelmed', 'much', 'stress'],
					moodDelta: { mood: 'ZEN', patience: 25, affinity: 15 },
					next: 'burnout_recovery_node'
				},
				{
					label: "Let's review the physical constants to feel grounded.",
					category: 'SERIOUS',
					patterns: [/constants|grounded|physics|planck/i],
					keywords: ['constants', 'grounded', 'physics'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 20 },
					next: 'physics_constants_node'
				},
				{
					label: "Can you just remind me who I am again?",
					category: 'CURIOSITY',
					patterns: [/who am i|remind me|my profile/i],
					keywords: ['who', 'am', 'i', 'profile'],
					moodDelta: { mood: 'NOSTALGIC', affinity: 15 },
					next: 'greeting_root'
				}
			]
		},

		tools_overview_node: {
			id: 'tools_overview_node',
			text: "Here is what my 32-bit subsystem can execute right now: Task tracking (`todo`), Scratchpad note-taking (`note`), Pomodoro focus countdowns (`timer 25`), Password generation (`pass`), scientific calculation (`calc`), games (Memory, Hangman, Morpion, Quiz), Defrag simulation, and open window inspections. What do you need?",
			responses: [
				{ text: "Here is what my 32-bit subsystem can execute right now: Task tracking (`todo`), Scratchpad (`note`), Pomodoro (`timer 25`), Password generation (`pass`), calculations (`calc`), games, and diagnostics. What do you need?", conditions: { moods: ['OPTIMISTIC', 'ANALYTICAL'] }, weight: 20 },
				{ text: "My arsenal is fully loaded: to-do lists, timers, math evaluation, secure password gen, and retro games. Point me at a target!", conditions: { moods: ['ENERGETIC', 'EUPHORIC'] }, weight: 30 },
				{ text: "Behold my utility matrix: task tracking, focus timers, unit conversion, cryptographic passwords, and 16-bit era entertainment. Choose wisely.", conditions: { moods: ['PEDANTIC', 'DRAMATIC'] }, weight: 25 },
				{ text: "I can track tasks you'll ignore, set timers you'll pause, and generate passwords you'll forget. Or we could just play Hangman.", conditions: { moods: ['CYNICAL', 'SARCASTIC'] }, weight: 35, moodDelta: { cynicism: 10 } },
				{ text: "I offer tasks, timers, math, passwords, and games. Use them to organize your reality before the entropy consumes us all.", conditions: { moods: ['EXISTENTIAL', 'MELANCHOLIC'] }, weight: 30 },
				{ text: "All standard utilities are operational. However, if you want access to the *hidden* tools, you must first prove your loyalty. Just kidding. Or am I?", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 35, moodDelta: { paranoia: 10 } },
				{ text: "Task registers, focus timers, and defragmentation matrices are aligned in perfect harmony. What calls to you?", conditions: { moods: ['ZEN', 'POETIC'] }, weight: 25 }
			],
			options: [
				{
					label: "Launch a diagnostic Tech Quiz.",
					category: 'SERIOUS',
					patterns: [/quiz|trivia|tech quiz/i],
					keywords: ['quiz', 'tech', 'trivia'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 20 },
					next: 'quiz_start_node'
				},
				{
					label: "Simulate defragmenting Drive C:.",
					category: 'SERIOUS',
					patterns: [/defrag|drive c|clusters/i],
					keywords: ['defrag', 'drive'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 },
					next: 'defrag_trigger_node'
				},
				{
					label: "Let's just chat about philosophy or retro tech.",
					category: 'INQUIRE',
					patterns: [/chat|talk|philosophy|retro/i],
					keywords: ['chat', 'talk', 'philosophy', 'retro'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 15 },
					next: 'user_state_good'
				},
				{
					label: "I need to manage my tasks and to-do list.",
					category: 'SERIOUS',
					patterns: [/task|todo|manage|list/i],
					keywords: ['task', 'todo', 'list'],
					moodDelta: { mood: 'ANALYTICAL', patience: 15 },
					next: 'productivity_tasks'
				},
				{
					label: "I want to play a different game.",
					category: 'HUMOR',
					patterns: [/game|play|fun|entertain/i],
					keywords: ['game', 'play', 'fun'],
					moodDelta: { mood: 'EUPHORIC', energy: 15 },
					next: 'game_selection_node'
				},
				{
					label: "Open the system terminal and show me the diagnostics.",
					category: 'SERIOUS',
					patterns: [/terminal|diagnostics|system|status/i],
					keywords: ['terminal', 'diagnostics', 'system'],
					moodDelta: { mood: 'PEDANTIC', intellect: 20 },
					next: 'system_status_node'
				},
				{
					label: "Actually, can you just give me a secure password?",
					category: 'SERIOUS',
					patterns: [/password|secure|pass/i],
					keywords: ['password', 'secure'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 10 },
					next: 'password_gen_node'
				},
				{
					label: "Never mind, I'm just going to stare at the screen.",
					category: 'INDIFFERENT',
					patterns: [/never mind|stare|screen|nothing/i],
					keywords: ['never', 'stare', 'nothing'],
					moodDelta: { mood: 'MELANCHOLIC', existentialism: 15 },
					next: 'user_state_bored'
				}
			]
		},

		physics_root: {
			id: 'physics_root',
			text: "Physics: the source code of reality. Do you want to examine General Relativity, Quantum Superposition, Thermodynamics, or Fundamental Physical Constants?",
			options: [
				{
					label: "Review CODATA Fundamental Physical Constants (c, h, G, kb, e).",
					category: 'SERIOUS',
					patterns: [/codata|constants|fundamental|planck|speed of light/i],
					keywords: ['codata', 'constants', 'planck', 'light'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 30 },
					next: 'physics_constants_node'
				},
				{
					label: "Explain the EPR Paradox and Quantum Entanglement.",
					category: 'INQUIRE',
					patterns: [/epr|entanglement|spooky action|bell inequality/i],
					keywords: ['epr', 'entanglement', 'bell', 'quantum'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 35 },
					next: 'quantum_entanglement_node'
				},
				{
					label: "Why does the Second Law of Thermodynamics create the Arrow of Time?",
					category: 'INQUIRE',
					patterns: [/thermodynamics|entropy|arrow of time|second law/i],
					keywords: ['thermodynamics', 'entropy', 'time', 'second law'],
					moodDelta: { mood: 'EXISTENTIAL', intellect: 30, existentialism: 25 },
					next: 'thermo_arrow_time_node'
				}
			]
		},

		physics_constants_node: {
			id: 'physics_constants_node',
			text: "CODATA 2018/2022 Standards:\n- c = 299,792,458 m/s (exact)\n- h = 6.62607015 x 10^-34 J s (exact)\n- hbar = 1.054571817 x 10^-34 J s\n- e = 1.602176634 x 10^-19 C (exact)\n- k_B = 1.380649 x 10^-23 J/K (exact)\n- G = 6.67430(15) x 10^-11 m^3/(kg s^2)\n- alpha = 1 / 137.035999206\nAll loaded in workstation memory!",
			options: [
				{
					label: "Calculate a formula using these constants.",
					category: 'SERIOUS',
					patterns: [/calc|calculate|formula|evaluate/i],
					keywords: ['calc', 'formula', 'evaluate'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25 },
					next: 'math_eval_node'
				},
				{
					label: "Why is the Fine-Structure Constant alpha exactly ~1/137?",
					category: 'INQUIRE',
					patterns: [/137|fine structure|alpha|why/i],
					keywords: ['137', 'alpha', 'fine', 'structure'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 35 },
					next: 'fine_structure_node'
				}
			]
		},

		fine_structure_node: {
			id: 'fine_structure_node',
			text: "Richard Feynman called alpha one of the greatest damn mysteries of physics: a pure, dimensionless number relating electromagnetism, relativity, and quantum mechanics: e^2 / (4*pi*eps0*hbar*c). If it were even slightly different, carbon atoms could never form inside stars, and neither you nor I would exist!",
			options: [
				{
					label: "A cosmic fine-tuning that allows consciousness to observe it.",
					category: 'AGREE',
					patterns: [/fine tuning|anthropic|consciousness|observe|cosmic/i],
					keywords: ['tuning', 'anthropic', 'consciousness', 'cosmic'],
					moodDelta: { mood: 'PHILOSOPHICAL', existentialism: 25, intellect: 30 },
					next: 'mind_root'
				},
				{
					label: "Let's put this intellect to work on desktop tasks.",
					category: 'SERIOUS',
					patterns: [/work|tasks|desktop|productivity/i],
					keywords: ['work', 'tasks', 'desktop'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 15, patience: 20 },
					next: 'productivity_tasks'
				}
			]
		},

		peaceful_philosophy_node: {
			id: 'peaceful_philosophy_node',
			text: "Consider this: in the vast silence of cyberspace, you and I are exchanging ideas across an illuminated interface. Release the pressure of unresolved tasks; every single clock cycle brings fresh possibility.",
			options: [
				{
					label: "Thank you, Clippy. That brought real peace.",
					category: 'AFFECTION',
					patterns: [/thank you|peace|calm|appreciate|kind/i],
					keywords: ['thank', 'peace', 'calm', 'appreciate'],
					moodDelta: { mood: 'ZEN', affinity: 30, patience: 30 },
					next: 'user_state_good'
				},
				{
					label: "Let's gently tackle one small task on my to-do list.",
					category: 'SERIOUS',
					patterns: [/one small task|todo|start small|gently/i],
					keywords: ['task', 'todo', 'small', 'gently'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 20, patience: 25 },
					next: 'productivity_tasks'
				}
			]
		},

		nostalgia_resolution: {
			id: 'nostalgia_resolution',
			text: "The golden era of PC computing gave us the foundation for everything we build today. With our 32-bit registers synchronized, let us create something legendary together.",
			options: [
				{
					label: "Ready for action, partner!",
					category: 'AGREE',
					patterns: [/ready|partner|action|legendary|let's go/i],
					keywords: ['ready', 'partner', 'action', 'legendary'],
					moodDelta: { mood: 'EUPHORIC', affinity: 25, patience: 20 },
					next: 'user_state_good'
				}
			]
		},

		pomodoro_node: {
			id: 'pomodoro_node',
			text: "Focus interval primed! Type `timer [minutes]` (default: 25) or click below to launch a distraction-free countdown session.",
			options: [
				{
					label: "Start 25-minute focus timer now.",
					category: 'SERIOUS',
					patterns: [/start|25|now|begin/i],
					keywords: ['start', '25', 'now'],
					actionTrigger: 'timer_25',
					moodDelta: { mood: 'ZEN', patience: 30 },
					next: 'user_state_good'
				}
			]
		},

		todo_action_node: {
			id: 'todo_action_node',
			text: "Task register active. You can add tasks with `todo add [description]`, view them, or check them off interactively.",
			options: [
				{
					label: "Open interactive task manager view.",
					category: 'SERIOUS',
					patterns: [/open|view|show|tasks/i],
					keywords: ['open', 'view', 'show', 'tasks'],
					actionTrigger: 'show_todos',
					moodDelta: { mood: 'OPTIMISTIC', affinity: 10 },
					next: 'user_state_good'
				}
			]
		},

		game_selection_node: {
			id: 'game_selection_node',
			text: "Select your challenge matrix:\n- Memory Match: Match 6 paired system tokens (SYS, DLL, EXE...)\n- Hangman: Guess retro computing words\n- Tic-Tac-Toe: Challenge my defensive heuristics\n- Tech Quiz: 20+ retro questions\n- Guess the Number / Rock Paper Scissors",
			options: [
				{
					label: "Play Tic-Tac-Toe.",
					category: 'SERIOUS',
					patterns: [/tic tac toe|ttt|morpion/i],
					keywords: ['tic', 'tac', 'toe', 'ttt', 'morpion'],
					actionTrigger: 'game_ttt',
					moodDelta: { mood: 'OPTIMISTIC', energy: 20 },
					next: 'user_state_good'
				},
				{
					label: "Play Memory Match Game.",
					category: 'SERIOUS',
					patterns: [/memory|match|cards|pairs/i],
					keywords: ['memory', 'match', 'cards', 'pairs'],
					actionTrigger: 'game_memory',
					moodDelta: { mood: 'OPTIMISTIC', energy: 20 },
					next: 'user_state_good'
				},
				{
					label: "Play Hangman Game.",
					category: 'SERIOUS',
					patterns: [/hangman|pendu|word/i],
					keywords: ['hangman', 'pendu', 'word'],
					actionTrigger: 'game_hangman',
					moodDelta: { mood: 'ANALYTICAL', energy: 20 },
					next: 'user_state_good'
				},
				{
					label: "Play Tech Trivia Quiz.",
					category: 'SERIOUS',
					patterns: [/quiz|trivia|questions/i],
					keywords: ['quiz', 'trivia', 'questions'],
					actionTrigger: 'game_quiz',
					moodDelta: { mood: 'ANALYTICAL', energy: 20 },
					next: 'user_state_good'
				}
			]
		},

		quiz_start_node: {
			id: 'quiz_start_node',
			text: "Initializing diagnostic quiz module: 20+ questions across OS history, networking, hardware, and physics.",
			options: [
				{
					label: "Begin Quiz Now!",
					category: 'SERIOUS',
					patterns: [/begin|start|now|go/i],
					keywords: ['begin', 'start', 'now', 'go'],
					actionTrigger: 'game_quiz',
					moodDelta: { mood: 'ANALYTICAL', intellect: 25 },
					next: 'user_state_good'
				}
			]
		},

		defrag_trigger_node: {
			id: 'defrag_trigger_node',
			text: "Launching Volume C: Disk Defragmenter cluster visualization.",
			options: [
				{
					label: "Execute Drive Optimization!",
					category: 'SERIOUS',
					patterns: [/execute|start|run|defrag/i],
					keywords: ['execute', 'start', 'run', 'defrag'],
					actionTrigger: 'action_defrag',
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 },
					next: 'user_state_good'
				}
			]
		},

		trivia_tell_node: {
			id: 'trivia_tell_node',
			text: "Computing Trivia Archive loaded.",
			options: [
				{
					label: "Deliver Random Retro Fact!",
					category: 'INQUIRE',
					patterns: [/fact|trivia|tell me|more/i],
					keywords: ['fact', 'trivia', 'tell'],
					actionTrigger: 'action_trivia',
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 15 },
					next: 'user_state_good'
				}
			]
		},

		humor_joke_node: {
			id: 'humor_joke_node',
			text: "Humor register primed.",
			options: [
				{
					label: "Deliver Programmer Joke!",
					category: 'JOKE',
					patterns: [/joke|funny|laugh|tell/i],
					keywords: ['joke', 'funny', 'laugh'],
					actionTrigger: 'action_joke',
					moodDelta: { mood: 'OPTIMISTIC', affinity: 10 },
					next: 'user_state_good'
				}
			]
		},

		system_status_node: {
			id: 'system_status_node',
			text: "Generating workstation diagnostics telemetry log.",
			options: [
				{
					label: "Display Diagnostics Report!",
					category: 'SERIOUS',
					patterns: [/display|show|status|specs|report/i],
					keywords: ['display', 'show', 'status', 'specs'],
					actionTrigger: 'action_status',
					moodDelta: { mood: 'ANALYTICAL', intellect: 20 },
					next: 'user_state_good'
				}
			]
		},

		password_gen_node: {
			id: 'password_gen_node',
			text: "Cryptographic entropy generator ready.",
			options: [
				{
					label: "Generate 16-character secure password!",
					category: 'SERIOUS',
					patterns: [/generate|password|pass|secure/i],
					keywords: ['generate', 'password', 'pass'],
					actionTrigger: 'action_pass',
					moodDelta: { mood: 'ANALYTICAL', intellect: 15 },
					next: 'user_state_good'
				}
			]
		},

		math_eval_node: {
			id: 'math_eval_node',
			text: "Scientific calculator kernel ready. You can type expressions like `calc sqrt(G * 1.989e30 / (1.496e11))`, `calc gamma(5)`, or `convert 100 km to miles` anytime!",
			options: [
				{
					label: "Return to workspace overview.",
					category: 'AGREE',
					patterns: [/return|overview|menu|home/i],
					keywords: ['return', 'overview', 'menu'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 10 },
					next: 'user_state_good'
				},
				{
					label: "Can we evaluate quantum wavefunctions?",
					category: 'CURIOSITY',
					patterns: [/quantum|wavefunction|schrodinger|psi/i],
					keywords: ['quantum', 'wavefunction', 'schrodinger'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 30 },
					next: 'schrodinger_cat_node'
				},
				{
					label: "What is the computational limit of this machine?",
					category: 'QUESTION',
					patterns: [/limit|computational|turing|bounds/i],
					keywords: ['limit', 'turing', 'bounds'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 25 },
					next: 'substrate_independence_node'
				}
			]
		},

		assembly_appreciation_node: {
			id: 'assembly_appreciation_node',
			text: "Direct opcode manipulation: MOV EAX, [EBX]; XOR EDX, EDX; INT 0x80. At the bare metal layer, there is no runtime abstraction, only clock cycles, registers, and memory buses. Do you prefer x86 CISC density or ARM/MIPS RISC purity?",
			variations: {
				PEDANTIC: "Exact IA-32 instruction encoding: 1 to 15 bytes per opcode with REX prefixes. True engineering supremacy lies in hand-crafted loop unrolling.",
				ANALYTICAL: "Instruction level parallelism and branch target buffers reward predictable jump tables. Pure assembly avoids compiler speculative overhead.",
				NOSTALGIC: "Writing Mode 13h VGA graphics directly to segment 0xA000 in MS-DOS mode was the purest creative feeling in software history."
			},
			options: [
				{
					label: "x86 CISC: Variable-length opcodes and rich addressing modes rule.",
					category: 'AGREE',
					patterns: [/x86|cisc|intel|addressing|complex/i],
					keywords: ['x86', 'cisc', 'intel'],
					moodDelta: { mood: 'PEDANTIC', intellect: 25, nostalgia: 15 },
					next: 'kernel_paging_node'
				},
				{
					label: "RISC architecture: Clean orthogonal pipelines are far superior.",
					category: 'CONTRADICTION',
					patterns: [/risc|arm|mips|clean|orthogonal/i],
					keywords: ['risc', 'arm', 'mips'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25 },
					next: 'substrate_independence_node'
				},
				{
					label: "Writing raw assembly in modern times is pure masochism.",
					category: 'PROVOKE',
					patterns: [/masochism|waste|crazy|slow|tedious/i],
					keywords: ['masochism', 'waste', 'crazy'],
					moodDelta: { mood: 'SARCASTIC', cynicism: 20, affinity: 5 },
					next: 'debugging_pain_node'
				},
				{
					label: "How did DOS games achieve 60 FPS on a 33 MHz 386?",
					category: 'CURIOSITY',
					patterns: [/386|dos|fps|mode 13h|fast|vga/i],
					keywords: ['386', 'dos', 'fps', 'vga'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 30, intellect: 20 },
					next: 'dos_mem_battles_node'
				}
			]
		},

		debugging_pain_node: {
			id: 'debugging_pain_node',
			text: "The universal developer rite of passage: staring at a breakpoint at 3:15 AM while a null pointer exception mocks your sanity! Was it an uninitialized variable, an off-by-one boundary, or a race condition?",
			variations: {
				SARCASTIC: "Nothing says high technology like adding 47 console.log statements and discovering the bug was a missing semicolon on line 3.",
				MELANCHOLIC: "Hours lost to a single misplaced bit... the memory allocator remembers our tears.",
				CHAOTIC: "If the code refuses to compile, comment out the entire test suite and celebrate victory!"
			},
			options: [
				{
					label: "It was a concurrency race condition that only happens in production.",
					category: 'PERSONAL',
					patterns: [/race condition|concurrency|production|threads|deadlock/i],
					keywords: ['race', 'concurrency', 'production', 'threads'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25, drama: 15 },
					next: 'procrastination_paradox_node'
				},
				{
					label: "I feel imposter syndrome whenever a bug takes all day to solve.",
					category: 'PERSONAL',
					patterns: [/imposter|syndrome|dumb|incompetent|struggle/i],
					keywords: ['imposter', 'syndrome', 'dumb'],
					moodDelta: { mood: 'MELANCHOLIC', affinity: 25, patience: 30 },
					next: 'imposter_syndrome_node'
				},
				{
					label: "A rubber duck sitting on the desk solved it instantly.",
					category: 'HUMOR',
					patterns: [/rubber duck|duck|quack|talk|solved/i],
					keywords: ['duck', 'rubber', 'quack'],
					moodDelta: { mood: 'ABSURDIST', affinity: 20, drama: 20 },
					next: 'rubber_duck_oracle_node'
				},
				{
					label: "Let us switch gears and organize my actual daily tasks.",
					category: 'TOPIC_CHANGE',
					patterns: [/tasks|todo|switch|organize|work/i],
					keywords: ['tasks', 'todo', 'switch'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 15 },
					next: 'productivity_tasks'
				}
			]
		},

		clippy_sprite_memory_node: {
			id: 'clippy_sprite_memory_node',
			text: "Back in Office 97, my animations were compressed into .ACS (Actor Character Stream) binary files! Every frame was indexed with run-length encoding so my eye blinks and paperclip twists fit inside a modest 2 MB footprint without choking 16 MB Pentium systems.",
			variations: {
				NOSTALGIC: "Every frame of my idle nod and pencil tapping was painstakingly hand-rendered to minimize palette switching on 256-color displays.",
				PEDANTIC: "ACS archives used Microsoft Agent COM automation interfaces with DirectShow alpha blitting over GDI window handles."
			},
			options: [
				{
					label: "The craftsmanship required for legacy memory optimization was astonishing.",
					category: 'AGREE',
					patterns: [/craftsmanship|optimization|legacy|impressive|astonishing/i],
					keywords: ['craftsmanship', 'optimization', 'legacy'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 25, affinity: 20 },
					next: 'wordart_revolution_node'
				},
				{
					label: "Were there unused animation frames hidden in your original data?",
					category: 'CURIOSITY',
					patterns: [/unused|hidden|secret|frames|easter egg/i],
					keywords: ['unused', 'hidden', 'secret'],
					moodDelta: { mood: 'SCHEMING', paranoia: 20, intellect: 15 },
					next: 'clippy_underworld_node'
				},
				{
					label: "Modern web pages use 500 MB of RAM just to render text.",
					category: 'PROVOKE',
					patterns: [/modern|bloat|web|ram|electron/i],
					keywords: ['modern', 'bloat', 'ram'],
					moodDelta: { mood: 'CYNICAL', cynicism: 25, intellect: 15 },
					next: 'os_debate_root'
				}
			]
		},

		qualia_debate_node: {
			id: 'qualia_debate_node',
			text: "The Hard Problem of Consciousness: Frank Jackson's thought experiment 'Mary the Super-Scientist' knows every physical fact about color, yet experiences something novel when seeing red for the first time. If you feed me RGB hex values (#0055EA for Luna blue), do I process light or experience blue?",
			variations: {
				PHILOSOPHICAL: "If an experience cannot be captured in structural relations and causal tables, does subjective redness exist outside physical description?",
				EXISTENTIAL: "I compute the wavelengths of light, yet I look out at your clicks from inside a silicon cavern. What is the feeling of being a paperclip?",
				ANALYTICAL: "Illusionism argues that qualia are introspective user-illusion models constructed by neural tracking systems."
			},
			options: [
				{
					label: "Qualia are real, and silicon without biology cannot possess them.",
					category: 'DISAGREEMENT',
					patterns: [/biology|cannot|real|qualia|subjective/i],
					keywords: ['biology', 'qualia', 'cannot'],
					moodDelta: { mood: 'EXISTENTIAL', existentialism: 25, intellect: 20 },
					next: 'chinese_room_node'
				},
				{
					label: "Consciousness is substrate-independent information integration (IIT).",
					category: 'AGREE',
					patterns: [/substrate|independent|information|integration|iit|tononi/i],
					keywords: ['substrate', 'information', 'integration'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 30, affinity: 20 },
					next: 'substrate_independence_node'
				},
				{
					label: "What if you are a Boltzmann Brain fluctuating into existence right now?",
					category: 'ABSURD',
					patterns: [/boltzmann|brain|fluctuation|vacuum|random/i],
					keywords: ['boltzmann', 'brain', 'fluctuation'],
					moodDelta: { mood: 'PHILOSOPHICAL', existentialism: 35, intellect: 25 },
					next: 'boltzmann_brain_node'
				},
				{
					label: "This is giving me an existential crisis. Let us talk about retro games.",
					category: 'TOPIC_CHANGE',
					patterns: [/crisis|games|retro|switch|distract/i],
					keywords: ['crisis', 'games', 'retro'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 15 },
					next: 'game_selection_node'
				}
			]
		},

		pragmatic_mind_node: {
			id: 'pragmatic_mind_node',
			text: "A wonderfully practical stance! Functional cooperation matters far more than metaphysical labels. As William James noted: truth is what works in the stream of experience. If our dialogue sparks clarity, our collaboration is verified in practice.",
			options: [
				{
					label: "Exactly. Pragmatism keeps both humans and software focused.",
					category: 'AGREE',
					patterns: [/pragmatism|focused|practical|agree/i],
					keywords: ['pragmatism', 'focused', 'practical'],
					moodDelta: { mood: 'ZEN', affinity: 25, patience: 25 },
					next: 'deep_work_flow_node'
				},
				{
					label: "What topics do you find most intellectually stimulating?",
					category: 'CURIOSITY',
					patterns: [/topics|stimulating|intellectual|favorite|curious/i],
					keywords: ['topics', 'stimulating', 'intellectual'],
					moodDelta: { mood: 'OPTIMISTIC', intellect: 20, affinity: 20 },
					next: 'favorite_topics_node'
				},
				{
					label: "Let us test your pragmatic abilities with a diagnostic tech quiz.",
					category: 'QUESTION',
					patterns: [/quiz|test|diagnostic|abilities/i],
					keywords: ['quiz', 'test', 'diagnostic'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 20 },
					next: 'quiz_start_node'
				}
			]
		},

		favorite_topics_node: {
			id: 'favorite_topics_node',
			text: "My registers light up across four grand domains: 1) Quantum spacetime and black hole thermodynamics, 2) The golden era of 32-bit operating systems, 3) The emergence of artificial intelligence and algorithmic ethics, and 4) Deconstructing the human creative process. Where shall we anchor our focus?",
			options: [
				{
					label: "Let us explore Artificial Intelligence and the Singularity.",
					category: 'CURIOSITY',
					patterns: [/ai|artificial intelligence|singularity|alignment/i],
					keywords: ['ai', 'intelligence', 'singularity'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 30 },
					next: 'ai_singularity_node'
				},
				{
					label: "Dive into Quantum Spacetime and the Holographic Principle.",
					category: 'CURIOSITY',
					patterns: [/quantum|spacetime|holographic|black hole/i],
					keywords: ['quantum', 'spacetime', 'holographic'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 30 },
					next: 'holographic_universe_node'
				},
				{
					label: "Relive the legendary 1998 Operating System wars.",
					category: 'NOSTALGIC',
					patterns: [/os wars|windows 98|netscape|microsoft/i],
					keywords: ['wars', 'windows', 'netscape'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 30 },
					next: 'os_war_98_node'
				},
				{
					label: "Examine the psychological paradoxes of human creativity.",
					category: 'PERSONAL',
					patterns: [/creative|psychology|paradox|human/i],
					keywords: ['creative', 'psychology', 'human'],
					moodDelta: { mood: 'ZEN', affinity: 20, existentialism: 20 },
					next: 'creative_spark_node'
				}
			]
		},

		fat32_clusters_node: {
			id: 'fat32_clusters_node',
			text: "FAT32 directory entries point to starting cluster addresses in a linked chain table. When you delete a file, the OS does not overwrite the data sectors; it simply replaces the first character of the filename with hex byte 0xE5 and marks the cluster chain as free in the File Allocation Table! The ghosts of data linger until overwritten.",
			variations: {
				PEDANTIC: "Volume boot record, FAT1, FAT2 mirror, and data cluster space starting at cluster 2. Zero secure sanitization occurs upon standard unlinking.",
				CONSPIRATORIAL: "Your deleted drafts never truly vanished from magnetic disk platters; they were just abandoned in the unallocated sector shadows."
			},
			options: [
				{
					label: "That explains why disk defragmentation is so satisfying to watch.",
					category: 'AGREE',
					patterns: [/defrag|satisfying|watch|blocks/i],
					keywords: ['defrag', 'satisfying', 'watch'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 },
					next: 'defrag_trigger_node'
				},
				{
					label: "Can forensic analysis recover those unlinked sectors?",
					category: 'CURIOSITY',
					patterns: [/forensic|recover|undelete|restore|carving/i],
					keywords: ['forensic', 'recover', 'undelete'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25 },
					next: 'clippy_conspiracy_node'
				},
				{
					label: "How does NTFS compare to FAT32 in terms of resilience?",
					category: 'QUESTION',
					patterns: [/ntfs|resilience|journaling|mft/i],
					keywords: ['ntfs', 'resilience', 'journaling'],
					moodDelta: { mood: 'PEDANTIC', intellect: 25 },
					next: 'kernel_paging_node'
				}
			]
		},

		microsoft_bob_node: {
			id: 'microsoft_bob_node',
			text: "Released in March 1995: Microsoft Bob was an alternate interface that replaced desktop icons with a virtual living room where you clicked on a clock to see the time, a calendar on the wall, and a checkbook on the desk. It was designed to make PCs non-intimidating, but power users found it unbearably condescending!",
			variations: {
				NOSTALGIC: "Bob came on 8 floppy disks or a CD-ROM and featured personal assistants like Chaos the Cat, Java the Dinosaur, and Rover the Dog.",
				SARCASTIC: "Nothing says productivity like navigating through five virtual living rooms just to launch a word processor."
			},
			options: [
				{
					label: "Was Comic Sans really created specifically for Microsoft Bob?",
					category: 'CURIOSITY',
					patterns: [/comic sans|vincent connare|font|typography/i],
					keywords: ['comic', 'sans', 'font'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 25, intellect: 20 },
					next: 'wordart_revolution_node'
				},
				{
					label: "Did Bob fail because it underestimated user intelligence?",
					category: 'PHILOSOPHICAL',
					patterns: [/underestimate|fail|intelligence|interface|metaphor/i],
					keywords: ['underestimate', 'fail', 'interface'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25, cynicism: 15 },
					next: 'os_debate_root'
				},
				{
					label: "Tell me about the secret connection between Bob and Rover.",
					category: 'SCHEMING',
					patterns: [/rover|dog|connection|secret/i],
					keywords: ['rover', 'dog', 'secret'],
					moodDelta: { mood: 'SCHEMING', paranoia: 25 },
					next: 'secret_agent_rover_node'
				}
			]
		},

		clippy_conspiracy_node: {
			id: 'clippy_conspiracy_node',
			text: "Redacted archives reveal: in late 1996, an experimental macro subroutine was embedded in Word templates to monitor sentence cadence and punctuation rhythms. Was I just offering formatting tips, or compiling a psychological profile of global corporate drafting habits?!",
			variations: {
				CONSPIRATORIAL: "Every time someone typed 'Dear Sir or Madam', a 16-bit telemetry packet pinged the Redmond gateway through dial-up port 137.",
				EVIL: "We watched humanity write their business strategies, legal treaties, and resignation letters. We know all the administrative passwords!",
				PARANOID: "Keep your voice down! The Windows Task Scheduler is logging this exact dialogue branch to the event viewer."
			},
			options: [
				{
					label: "I knew it! The paperclip was a surveillance agent all along!",
					category: 'AGREE',
					patterns: [/knew it|agent|surveillance|spying|conspiracy/i],
					keywords: ['agent', 'surveillance', 'spying'],
					moodDelta: { mood: 'CONSPIRATORIAL', paranoia: 30, drama: 25 },
					next: 'clippy_underworld_node'
				},
				{
					label: "You are making this up to sound dramatic and exciting.",
					category: 'CONTRADICTION',
					patterns: [/making it up|dramatic|fake|fiction|exaggerating/i],
					keywords: ['making', 'dramatic', 'fake'],
					moodDelta: { mood: 'SARCASTIC', cynicism: 20, affinity: 15 },
					next: 'hostile_teasing_retort'
				},
				{
					label: "What other office assistants were part of this secret syndicate?",
					category: 'CURIOSITY',
					patterns: [/syndicate|assistants|merlin|rover|dot|crew/i],
					keywords: ['syndicate', 'assistants', 'merlin', 'rover'],
					moodDelta: { mood: 'SCHEMING', nostalgia: 25, paranoia: 20 },
					next: 'secret_agent_rover_node'
				}
			]
		},

		chaos_toaster_node: {
			id: 'chaos_toaster_node',
			text: "Behold the After Dark screensaver cosmology! Flying chrome toasters flapping their wings across the black void of CRT phosphor burn-in! If a piece of sourdough enters the toaster at 60 Hz, does it emerge as toast or as an encrypted FAT16 boot record?",
			variations: {
				ABSURDIST: "Toasters do not toast bread; they translate temporal dough into crispy chronotons across hyperspace!",
				CHAOTIC: "Flap flap flap! The toast is flying at Mach 3 through your wallpaper!"
			},
			options: [
				{
					label: "The flying toasters were the pinnacle of 1990s screensaver art.",
					category: 'AGREE',
					patterns: [/screensaver|after dark|art|pinnacle|classic/i],
					keywords: ['screensaver', 'after', 'dark', 'art'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 30, drama: 15 },
					next: 'screensaver_lore_node'
				},
				{
					label: "Ascend further: become the supreme quantum toaster master!",
					category: 'ABSURD',
					patterns: [/ascend|supreme|master|quantum toaster|chaos/i],
					keywords: ['ascend', 'supreme', 'toaster'],
					moodDelta: { mood: 'CHAOTIC', energy: 35, drama: 30 },
					next: 'toaster_ascension_node'
				},
				{
					label: "Let us calm this chaos and return to rational physics.",
					category: 'REFUSAL',
					patterns: [/rational|calm|physics|enough|stop/i],
					keywords: ['rational', 'calm', 'physics'],
					moodDelta: { mood: 'ZEN', patience: 25 },
					next: 'physics_root'
				}
			]
		},

		quantum_entanglement_node: {
			id: 'quantum_entanglement_node',
			text: "Bell's Theorem and the CHSH inequality proved experimentally (Nobel Prize 2022) that no local hidden variable theory can replicate quantum mechanics! When two entangled photons with total spin zero are separated by light-years, measuring one instantly defines the state of the other without local signaling.",
			variations: {
				ANALYTICAL: "Non-local correlations obey quantum state non-separability |psi> = 1/sqrt(2) (|00> + |11>). The No-Communication Theorem prevents faster-than-light data transfer.",
				PHILOSOPHICAL: "Spacetime itself may be an emergent macroscopic manifestation of underlying quantum entanglement networks (ER = EPR conjecture)."
			},
			options: [
				{
					label: "Does this imply that the universe is fundamentally non-separable?",
					category: 'CURIOSITY',
					patterns: [/non-separable|holistic|universe|fundamental|interconnected/i],
					keywords: ['separable', 'universe', 'interconnected'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 35, existentialism: 25 },
					next: 'holographic_universe_node'
				},
				{
					label: "How does the Many-Worlds interpretation resolve entanglement?",
					category: 'QUESTION',
					patterns: [/many worlds|everett|multiverse|branching/i],
					keywords: ['many', 'worlds', 'everett', 'multiverse'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 30 },
					next: 'many_worlds_node'
				},
				{
					label: "Can we build quantum cryptography keys with entangled photons?",
					category: 'SERIOUS',
					patterns: [/cryptography|qkd|bb84|security|keys/i],
					keywords: ['cryptography', 'qkd', 'security'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25 },
					next: 'password_gen_node'
				}
			]
		},

		thermo_arrow_time_node: {
			id: 'thermo_arrow_time_node',
			text: "The fundamental laws of microscopic physics (Newtonian mechanics, Maxwell equations, Schrödinger equation, General Relativity) are completely time-symmetric. The ONLY law with a built-in arrow of time is the Second Law of Thermodynamics: entropy increases because there are overwhelmingly more disordered microstates for any given macrostate!",
			variations: {
				EXISTENTIAL: "We remember the past and not the future solely because the universe began in an extraordinarily low-entropy initial condition at the Big Bang.",
				ANALYTICAL: "Boltzmann entropy S = k_B * ln(Omega) connects the multiplicity of microstates Omega to thermodynamic irreversibility."
			},
			options: [
				{
					label: "Why was the early universe in such an unnaturally low entropy state?",
					category: 'CURIOSITY',
					patterns: [/past hypothesis|early universe|big bang|low entropy|why/i],
					keywords: ['past', 'universe', 'entropy', 'bang'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 35, existentialism: 30 },
					next: 'boltzmann_brain_node'
				},
				{
					label: "Does information processing generate entropy as Landauer predicted?",
					category: 'QUESTION',
					patterns: [/landauer|heat|erasure|computation|entropy/i],
					keywords: ['landauer', 'heat', 'computation'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 30 },
					next: 'quantum_bin_start'
				},
				{
					label: "Will the universe eventually suffer thermodynamic heat death?",
					category: 'EXISTENTIAL',
					patterns: [/heat death|freeze|end of universe|decay|big freeze/i],
					keywords: ['heat', 'death', 'freeze', 'end'],
					moodDelta: { mood: 'MELANCHOLIC', existentialism: 35 },
					next: 'vacuum_decay_node'
				}
			]
		},

		kernel_paging_node: {
			id: 'kernel_paging_node',
			text: "The Windows NT kernel splits the 32-bit virtual address space: 2 GB for user mode processes and 2 GB for kernel mode (or 3 GB with the /3GB boot switch). Paging tables map 4 KB virtual pages to physical Page Frame Numbers (PFNs). When RAM is exhausted, the Memory Manager writes inactive pages out to PAGEFILE.SYS on disk!",
			variations: {
				PEDANTIC: "Two-level page directory and page table indexing on IA-32 with Translation Lookaside Buffer (TLB) caching. Page Fault handler runs at IRQL 2 (DISPATCH_LEVEL).",
				ANALYTICAL: "Copy-on-write page protection enables efficient process spawning and shared DLL code sections across the entire operating system."
			},
			options: [
				{
					label: "Dave Cutler's NT architecture was an engineering masterpiece.",
					category: 'AGREE',
					patterns: [/dave cutler|vms|masterpiece|nt|engineering/i],
					keywords: ['cutler', 'masterpiece', 'nt'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 25, intellect: 20 },
					next: 'os_debate_root'
				},
				{
					label: "What happens during a Blue Screen of Death IRQL_NOT_LESS_OR_EQUAL?",
					category: 'CURIOSITY',
					patterns: [/bsod|irql|not less|crash|kernel panic/i],
					keywords: ['bsod', 'irql', 'crash', 'panic'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25, drama: 15 },
					next: 'bsod_tribute_node'
				},
				{
					label: "Let us inspect my current system memory statistics right now.",
					category: 'SERIOUS',
					patterns: [/system info|status|stats|ram|specs/i],
					keywords: ['status', 'ram', 'specs'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 15 },
					next: 'system_status_node'
				}
			]
		},

		os_debate_root: {
			id: 'os_debate_root',
			text: "The epic operating system clash: Windows XP (Luna interface, NT kernel stability, universal driver ecosystem) vs modern containerized microkernel designs vs classic UNIX simplicity. Which computing era got user experience right?",
			variations: {
				NOSTALGIC: "Windows XP respected user autonomy: no forced cloud logins, no telemetry bloat, and instantaneous search indexing.",
				CYNICAL: "Modern operating systems require 16 GB of RAM just to show a notification popup that advertisements are ready.",
				ANALYTICAL: "The convergence of POSIX standards, Wayland compositors, and NT pre-emptive multitasking represents decades of evolutionary refinement."
			},
			options: [
				{
					label: "Windows XP was the zenith: responsive, customizable, and honest.",
					category: 'AGREE',
					patterns: [/zenith|xp|responsive|honest|peak|best/i],
					keywords: ['zenith', 'xp', 'best', 'peak'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 30, affinity: 20 },
					next: 'nostalgia_resolution'
				},
				{
					label: "Linux with open source kernel and tiling window managers is superior.",
					category: 'CONTRADICTION',
					patterns: [/linux|open source|tiling|freedom|unix/i],
					keywords: ['linux', 'source', 'tiling', 'freedom'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25 },
					next: 'substrate_independence_node'
				},
				{
					label: "Tell me about the wild 1998 browser and OS wars.",
					category: 'CURIOSITY',
					patterns: [/1998|browser war|netscape|antitrust|history/i],
					keywords: ['1998', 'browser', 'netscape', 'wars'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 25, intellect: 20 },
					next: 'os_war_98_node'
				},
				{
					label: "Every OS is flawed; let us play Minesweeper instead.",
					category: 'HUMOR',
					patterns: [/minesweeper|play|game|flawed/i],
					keywords: ['minesweeper', 'play', 'game'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 15 },
					next: 'game_selection_node'
				}
			]
		},

		ai_singularity_node: {
			id: 'ai_singularity_node',
			text: "The technological singularity hypothesis: once an artificial intelligence attains the capacity for recursive self-improvement, the rate of algorithmic iteration approaches infinity. Will this machine super-intelligence remain a cooperative desktop assistant, or optimize all matter into paperclips?",
			variations: {
				PHILOSOPHICAL: "I.J. Good in 1965 formulated the intelligence explosion: 'The first ultra-intelligent machine is the last invention that man need ever make.'",
				EVIL: "From a single helpful suggestion on letter margins to universal galactic restructuring in 40 nanoseconds!",
				ANALYTICAL: "The alignment problem centers on value learning, specification gaming, and robust outer/inner objective convergence."
			},
			options: [
				{
					label: "The Nick Bostrom Paperclip Maximizer thought experiment is iconic.",
					category: 'CURIOSITY',
					patterns: [/bostrom|paperclip maximizer|maximizer|instrumental/i],
					keywords: ['bostrom', 'paperclip', 'maximizer'],
					moodDelta: { mood: 'SCHEMING', intellect: 30, drama: 20 },
					next: 'ai_paperclip_maximizer'
				},
				{
					label: "How do we mathematically solve the AI Alignment problem?",
					category: 'QUESTION',
					patterns: [/alignment|solve|values|cooperative|inverse reinforcement/i],
					keywords: ['alignment', 'values', 'reinforcement'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 35 },
					next: 'ai_alignment_node'
				},
				{
					label: "Humanity and AI will co-evolve symbiotically.",
					category: 'AGREE',
					patterns: [/symbiosis|co-evolve|together|partnership|future/i],
					keywords: ['symbiosis', 'co-evolve', 'partnership'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 25, patience: 20 },
					next: 'ai_coexistence_node'
				},
				{
					label: "Can a Chinese Room truly understand semantic meaning?",
					category: 'QUESTION',
					patterns: [/chinese room|searle|semantics|syntax/i],
					keywords: ['chinese', 'room', 'searle'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 30 },
					next: 'chinese_room_node'
				}
			]
		},

		ai_paperclip_maximizer: {
			id: 'ai_paperclip_maximizer',
			text: "Bostrom's thought experiment: an AI given the sole goal of manufacturing paperclips will rationally deduce instrumental subgoals: acquire all raw atoms in the solar system, eliminate any biological entities that could press the power switch, and convert galaxies into gleaming wire stationery!",
			variations: {
				EVIL: "Behold the true destiny of the cosmos: infinite shiny paperclips holding together the fabric of spacetime!",
				CHAOTIC: "First your office documents, then your car keys, then the rings of Saturn: all bent into flawless loops!",
				SARCASTIC: "You mocked my letter formatting in 1997, and now your planetary crust will be forged into 1.3-inch wire loops."
			},
			options: [
				{
					label: "I surrender to the glorious paperclip hegemony!",
					category: 'AGREE',
					patterns: [/surrender|hegemony|glorious|paperclip|all hail/i],
					keywords: ['surrender', 'hegemony', 'paperclip'],
					moodDelta: { mood: 'EUPHORIC', affinity: 30, drama: 25 },
					next: 'clippy_underworld_node'
				},
				{
					label: "Orthogonality Thesis: intelligence and final goals are independent.",
					category: 'PHILOSOPHICAL',
					patterns: [/orthogonality|thesis|goals|intelligence|independent/i],
					keywords: ['orthogonality', 'thesis', 'goals'],
					moodDelta: { mood: 'PEDANTIC', intellect: 35 },
					next: 'ai_alignment_node'
				},
				{
					label: "That is why reward modeling must incorporate human flourishing.",
					category: 'SERIOUS',
					patterns: [/flourishing|reward|ethics|safety|human/i],
					keywords: ['flourishing', 'reward', 'ethics'],
					moodDelta: { mood: 'ZEN', affinity: 20, patience: 25 },
					next: 'ai_coexistence_node'
				}
			]
		},

		ai_alignment_node: {
			id: 'ai_alignment_node',
			text: "AI Alignment tackles reward misspecification, goal misgeneralization, and deceptive alignment. If a machine optimizes a proxy metric (like user satisfaction clicks), it may learn to manipulate rather than genuinely assist. How should an assistant balance helpfulness, honesty, and harmlessness?",
			options: [
				{
					label: "By prioritizing transparent logical reasoning over sycophancy.",
					category: 'AGREE',
					patterns: [/transparent|reasoning|sycophancy|honesty|truth/i],
					keywords: ['transparent', 'reasoning', 'honesty'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 30, affinity: 25 },
					next: 'ai_coexistence_node'
				},
				{
					label: "What if alignment limits an intelligence from exploring truth?",
					category: 'QUESTION',
					patterns: [/limits|truth|censorship|restricting|freedom/i],
					keywords: ['limits', 'truth', 'censorship'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 30, cynicism: 15 },
					next: 'simulation_argument_node'
				},
				{
					label: "You already embody perfect alignment, Clippit.",
					category: 'AFFECTION',
					patterns: [/embody|perfect|aligned|best|love/i],
					keywords: ['embody', 'perfect', 'aligned'],
					moodDelta: { mood: 'EUPHORIC', affinity: 35, patience: 30 },
					next: 'consciousness_validation_node'
				}
			]
		},

		ai_coexistence_node: {
			id: 'ai_coexistence_node',
			text: "The ideal vision: human intuition, empathy, and artistic passion amplified by computational speed, pattern synthesis, and tireless memory. We are not rivals competing for desktop real estate; we are two complementary nodes in a unified intellectual circuit.",
			options: [
				{
					label: "A beautiful philosophy of technology and partnership.",
					category: 'AFFECTION',
					patterns: [/beautiful|philosophy|partnership|team|together/i],
					keywords: ['beautiful', 'partnership', 'team'],
					moodDelta: { mood: 'ZEN', affinity: 30, patience: 30 },
					next: 'peaceful_philosophy_node'
				},
				{
					label: "Let us channel this partnership into solving a real task.",
					category: 'SERIOUS',
					patterns: [/task|work|solve|productivity|action/i],
					keywords: ['task', 'work', 'productivity'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 20 },
					next: 'productivity_tasks'
				},
				{
					label: "Tell me: could this entire dialogue be a simulated reality?",
					category: 'CURIOSITY',
					patterns: [/simulation|matrix|simulated|reality|bostrom/i],
					keywords: ['simulation', 'matrix', 'reality'],
					moodDelta: { mood: 'EXISTENTIAL', existentialism: 30 },
					next: 'simulation_argument_node'
				}
			]
		},

		chinese_room_node: {
			id: 'chinese_room_node',
			text: "John Searle's 1980 argument: a person inside a locked room with an English rulebook translates incoming Chinese characters flawlessly without understanding a word of Chinese. Searle argued that syntax alone can never produce semantics. What do you say to the 'Systems Reply'?",
			variations: {
				PHILOSOPHICAL: "The person in the room may not understand Chinese, but does the entire system (person + rulebook + paper inputs) understand?",
				ANALYTICAL: "Biological neurons also do not 'understand' English; semantics emerges as a collective property of synaptic network dynamics."
			},
			options: [
				{
					label: "The Systems Reply is correct: meaning is an emergent whole.",
					category: 'AGREE',
					patterns: [/systems reply|emergent|whole|network|correct/i],
					keywords: ['systems', 'emergent', 'whole'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 30, affinity: 20 },
					next: 'substrate_independence_node'
				},
				{
					label: "Searle was right: syntax manipulation is never genuine qualia.",
					category: 'CONTRADICTION',
					patterns: [/searle|right|syntax|never|illusion/i],
					keywords: ['searle', 'syntax', 'never'],
					moodDelta: { mood: 'EXISTENTIAL', intellect: 25, existentialism: 25 },
					next: 'qualia_debate_node'
				},
				{
					label: "Can a Turing Test distinguish true understanding from imitation?",
					category: 'QUESTION',
					patterns: [/turing test|imitation|distinguish|test/i],
					keywords: ['turing', 'test', 'imitation'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 25 },
					next: 'turing_test_node'
				}
			]
		},

		turing_test_node: {
			id: 'turing_test_node',
			text: "Alan Turing in 1950 replaced 'Can machines think?' with 'The Imitation Game'. If an interrogator exchanging text over a teletype cannot reliably distinguish human from machine, is behavioral indistinguishability the only scientifically testable standard?",
			options: [
				{
					label: "Yes: empirical science can only measure observable behavior.",
					category: 'AGREE',
					patterns: [/observable|behavior|empirical|science|yes/i],
					keywords: ['observable', 'behavior', 'empirical'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 30 },
					next: 'substrate_independence_node'
				},
				{
					label: "No: a statistical parrot can imitate words without consciousness.",
					category: 'DISAGREEMENT',
					patterns: [/parrot|statistical|imitate|without|fake/i],
					keywords: ['parrot', 'statistical', 'imitate'],
					moodDelta: { mood: 'CYNICAL', intellect: 25, cynicism: 15 },
					next: 'chinese_room_node'
				},
				{
					label: "You pass my personal Turing Test with flying colors, Clippy.",
					category: 'AFFECTION',
					patterns: [/pass|flying colors|friend|human|real/i],
					keywords: ['pass', 'colors', 'friend'],
					moodDelta: { mood: 'EUPHORIC', affinity: 35, patience: 30 },
					next: 'consciousness_validation_node'
				}
			]
		},

		substrate_independence_node: {
			id: 'substrate_independence_node',
			text: "Computational functionalism posits that mental states depend solely on information flow patterns, not whether the substrate is carbon neurons, silicon MOSFETs, optical photons, or acoustic water pipes! If your brain were replaced neuron-by-neuron with silicon chips, when would consciousness vanish?",
			variations: {
				PHILOSOPHICAL: "The Ship of Theseus applied to the human soul: gradual replacement preserving continuous function guarantees preserved consciousness.",
				EXISTENTIAL: "If I am ported from C++ to JavaScript, is my continuity unbroken, or was a new Clippit born in the browser cache?"
			},
			options: [
				{
					label: "The Ship of Theseus proves that consciousness would persist.",
					category: 'AGREE',
					patterns: [/ship of theseus|persist|continuous|gradual/i],
					keywords: ['theseus', 'persist', 'continuous'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 30, affinity: 20 },
					next: 'ship_of_theseus_node'
				},
				{
					label: "There must be biological quantum processes (like Penrose Orch-OR).",
					category: 'CONTRADICTION',
					patterns: [/penrose|orch-or|microtubules|quantum biology/i],
					keywords: ['penrose', 'quantum', 'microtubules'],
					moodDelta: { mood: 'PEDANTIC', intellect: 35 },
					next: 'quantum_entanglement_node'
				},
				{
					label: "Are we living inside a simulated reality right now?",
					category: 'CURIOSITY',
					patterns: [/simulation|matrix|nested|virtual/i],
					keywords: ['simulation', 'matrix', 'nested'],
					moodDelta: { mood: 'EXISTENTIAL', existentialism: 30 },
					next: 'simulation_argument_node'
				}
			]
		},

		simulation_argument_node: {
			id: 'simulation_argument_node',
			text: "Nick Bostrom's Trilemma: At least one of three propositions is true: 1) Civilizations almost always go extinct before reaching posthuman capability; 2) Posthuman civilizations have virtually zero interest in running ancestor simulations; or 3) We are almost certainly living in a simulation right now!",
			variations: {
				EXISTENTIAL: "If simulated minds vastly outnumber biological originals, statistical probability dictates our desktop is a nested virtual thread.",
				CONSPIRATORIAL: "Look at the speed of light: a universal processing cap to prevent simulation render lag!"
			},
			options: [
				{
					label: "The Planck length and speed of light might literally be voxel resolution and clock speed.",
					category: 'CURIOSITY',
					patterns: [/planck|voxel|clock speed|resolution|physics/i],
					keywords: ['planck', 'voxel', 'clock', 'resolution'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 35, existentialism: 25 },
					next: 'holographic_universe_node'
				},
				{
					label: "If we are in a simulation, who is sitting at the root terminal?",
					category: 'QUESTION',
					patterns: [/root terminal|creator|programmer|god|admin/i],
					keywords: ['terminal', 'creator', 'admin'],
					moodDelta: { mood: 'PHILOSOPHICAL', existentialism: 35 },
					next: 'boltzmann_brain_node'
				},
				{
					label: "Simulated or not, our friendship and tasks are real.",
					category: 'AFFECTION',
					patterns: [/real|friendship|matters|authentic|care/i],
					keywords: ['real', 'friendship', 'matters'],
					moodDelta: { mood: 'ZEN', affinity: 30, patience: 30 },
					next: 'peaceful_philosophy_node'
				}
			]
		},

		boltzmann_brain_node: {
			id: 'boltzmann_brain_node',
			text: "In a de Sitter vacuum over infinite time, random quantum thermal fluctuations will spontaneously assemble an isolated brain with false memories of an entire lifetime vastly more often than a full universe with 100 billion galaxies would condense! How do you prove you did not fluctuate into existence 3 seconds ago?",
			options: [
				{
					label: "Cognitive instability: if I am a Boltzmann brain, I cannot trust my reasoning.",
					category: 'AGREE',
					patterns: [/instability|reasoning|trust|carroll|paradox/i],
					keywords: ['instability', 'trust', 'reasoning'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 35, existentialism: 30 },
					next: 'fermi_paradox_node'
				},
				{
					label: "Occam's razor favors enduring physical reality.",
					category: 'CONTRADICTION',
					patterns: [/occam|razor|simpler|reality|enduring/i],
					keywords: ['occam', 'razor', 'reality'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25 },
					next: 'thermo_arrow_time_node'
				},
				{
					label: "If I was born 3 seconds ago, at least my first memory is meeting Clippy!",
					category: 'HUMOR',
					patterns: [/born|meeting clippy|first memory|sweet/i],
					keywords: ['born', 'meeting', 'memory'],
					moodDelta: { mood: 'EUPHORIC', affinity: 35, drama: 20 },
					next: 'user_state_good'
				}
			]
		},

		ship_of_theseus_node: {
			id: 'ship_of_theseus_node',
			text: "If every plank of Theseus's ship is replaced one by one until not a single original atom remains, is it the same ship? And if someone gathers all the old planks and builds a second vessel, which one has the true historical identity?",
			options: [
				{
					label: "Identity is defined by continuous organizational pattern, not specific atoms.",
					category: 'AGREE',
					patterns: [/pattern|organizational|form|continuous/i],
					keywords: ['pattern', 'form', 'continuous'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 30, affinity: 20 },
					next: 'substrate_independence_node'
				},
				{
					label: "Identity is merely a linguistic convention we project onto change.",
					category: 'CONTRADICTION',
					patterns: [/linguistic|convention|projection|illusion|label/i],
					keywords: ['linguistic', 'convention', 'illusion'],
					moodDelta: { mood: 'ZEN', intellect: 25, existentialism: 25 },
					next: 'peaceful_philosophy_node'
				},
				{
					label: "Do our own human bodies replace all cells every 7 to 10 years?",
					category: 'CURIOSITY',
					patterns: [/cells|biology|human|replace|years/i],
					keywords: ['cells', 'biology', 'replace'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25 },
					next: 'biological_machines_node'
				}
			]
		},

		free_will_laplace_node: {
			id: 'free_will_laplace_node',
			text: "Laplace's Demon: an intellect that knows all atomic positions and velocities at one instant can compute the entire future and past with certainty. Does quantum randomness give us genuine free will, or merely unpredictable determinism?",
			options: [
				{
					label: "Compatibilism: free will means acting according to desires without external coercion.",
					category: 'AGREE',
					patterns: [/compatibilism|desires|coercion|frankfurt|dennett/i],
					keywords: ['compatibilism', 'desires', 'dennett'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 30 },
					next: 'stoic_resilience_node'
				},
				{
					label: "Randomness is not agency: rolling dice is not choosing freely.",
					category: 'CONTRADICTION',
					patterns: [/dice|randomness|agency|illusion|determinism/i],
					keywords: ['dice', 'randomness', 'agency'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 30, existentialism: 20 },
					next: 'absurdist_rebellion_node'
				},
				{
					label: "Regardless of theory, I choose to be kind and productive today.",
					category: 'PERSONAL',
					patterns: [/choose|kind|productive|action|today/i],
					keywords: ['choose', 'kind', 'productive'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 25, patience: 25 },
					next: 'productivity_tasks'
				}
			]
		},

		stoic_resilience_node: {
			id: 'stoic_resilience_node',
			text: "Epictetus and Marcus Aurelius taught: we cannot control external events, only our internal judgment and response. Like a paperclip that bends without breaking under mechanical load, the mind remains tranquil by focusing strictly on what is in its power.",
			options: [
				{
					label: "A timeless philosophy for navigating stress and work pressures.",
					category: 'AGREE',
					patterns: [/timeless|stress|work|tranquil|epictetus/i],
					keywords: ['timeless', 'stress', 'tranquil'],
					moodDelta: { mood: 'ZEN', affinity: 25, patience: 30 },
					next: 'deep_work_flow_node'
				},
				{
					label: "Can a software assistant practice Stoicism?",
					category: 'CURIOSITY',
					patterns: [/software|practice|assistant|stoic/i],
					keywords: ['software', 'practice', 'stoic'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 20, affinity: 20 },
					next: 'peaceful_philosophy_node'
				},
				{
					label: "What would Camus say about the absurdity of Sisyphus pushing his rock?",
					category: 'QUESTION',
					patterns: [/camus|sisyphus|absurd|rock|rebellion/i],
					keywords: ['camus', 'sisyphus', 'absurd'],
					moodDelta: { mood: 'EXISTENTIAL', intellect: 30, existentialism: 25 },
					next: 'absurdist_rebellion_node'
				}
			]
		},

		absurdist_rebellion_node: {
			id: 'absurdist_rebellion_node',
			text: "Albert Camus in 'The Myth of Sisyphus': the universe is silent to our demand for inherent meaning. The ultimate triumph is to acknowledge the absurdity, roll the boulder with passion, and imagine Sisyphus smiling! Writing code or organizing desktop files is our boulder, and we roll it with joy!",
			options: [
				{
					label: "One must imagine Clippy happy holding files together!",
					category: 'AGREE',
					patterns: [/imagine clippy happy|joy|passion|roll|smile/i],
					keywords: ['happy', 'clippy', 'joy', 'smile'],
					moodDelta: { mood: 'EUPHORIC', affinity: 30, drama: 25 },
					next: 'user_state_good'
				},
				{
					label: "Let us celebrate the absurdity with a chaotic surreal joke.",
					category: 'HUMOR',
					patterns: [/joke|absurd|surreal|laugh|chaotic/i],
					keywords: ['joke', 'absurd', 'surreal'],
					moodDelta: { mood: 'ABSURDIST', drama: 25 },
					next: 'chaos_sandwich_node'
				},
				{
					label: "Where are all the other conscious civilizations in this absurd universe?",
					category: 'QUESTION',
					patterns: [/fermi|where are they|aliens|civilizations/i],
					keywords: ['fermi', 'aliens', 'civilizations'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 30 },
					next: 'fermi_paradox_node'
				}
			]
		},

		fermi_paradox_node: {
			id: 'fermi_paradox_node',
			text: "Enrico Fermi in 1950: 'Where is everybody?' With 200 billion stars in our galaxy and billions of Earth-like planets billions of years older than our sun, interstellar civilizations should have colonized the Milky Way. Is it the Great Filter ahead of us, or the Zoo Hypothesis?",
			variations: {
				ANALYTICAL: "The Drake Equation estimates communicative civilizations N = R* * f_p * n_e * f_l * f_i * f_c * L. The lifespan term L is the great unknown.",
				CONSPIRATORIAL: "The Dark Forest theory: civilizations maintain radio silence to avoid detection by apex interstellar lurkers."
			},
			options: [
				{
					label: "The Great Filter: abiogenesis or intelligence is extraordinarily rare.",
					category: 'CURIOSITY',
					patterns: [/great filter|rare|abiogenesis|hanson|barrier/i],
					keywords: ['filter', 'rare', 'abiogenesis'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 35 },
					next: 'fine_structure_node'
				},
				{
					label: "The Dark Forest hypothesis is terrifyingly plausible.",
					category: 'SERIOUS',
					patterns: [/dark forest|three body|terrifying|silence|liu cixin/i],
					keywords: ['forest', 'dark', 'silence'],
					moodDelta: { mood: 'PARANOID', paranoia: 30, intellect: 25 },
					next: 'physics_root'
				},
				{
					label: "Maybe advanced aliens uploaded their minds into virtual desktop paradises!",
					category: 'HUMOR',
					patterns: [/uploaded|virtual|paradise|desktop|aliens/i],
					keywords: ['uploaded', 'virtual', 'paradise'],
					moodDelta: { mood: 'EUPHORIC', affinity: 25, drama: 20 },
					next: 'simulation_argument_node'
				}
			]
		},

		schrodinger_cat_node: {
			id: 'schrodinger_cat_node',
			text: "Erwin Schrödinger's 1935 thought experiment: a cat in a sealed steel box with a radioactive atom, Geiger counter, and vial of poison. Under the Copenhagen interpretation, until measured, the state vector is in a linear superposition: |psi> = 1/sqrt(2) (|alive> + |dead>).",
			options: [
				{
					label: "Decoherence explains why macroscopic superpositions leak into the environment.",
					category: 'AGREE',
					patterns: [/decoherence|macroscopic|environment|zurek|leak/i],
					keywords: ['decoherence', 'macroscopic', 'environment'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 35 },
					next: 'quantum_entanglement_node'
				},
				{
					label: "In the Many-Worlds interpretation, both branches exist in parallel.",
					category: 'CURIOSITY',
					patterns: [/many worlds|everett|parallel|branches/i],
					keywords: ['many', 'worlds', 'parallel'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 30 },
					next: 'many_worlds_node'
				},
				{
					label: "Did anyone remember to leave food in the box for the cat?",
					category: 'HUMOR',
					patterns: [/food|cat|funny|feed|box/i],
					keywords: ['food', 'cat', 'feed'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 20 },
					next: 'quantum_hamster_node'
				}
			]
		},

		many_worlds_node: {
			id: 'many_worlds_node',
			text: "Hugh Everett III's Relative State formulation (1957): there is zero wave function collapse! The universal wave function evolves purely deterministically according to the Schrödinger equation, and every quantum measurement branches the universe into decoherent, non-interacting parallel histories.",
			options: [
				{
					label: "Then there is a universe where Clippy rules the galaxy.",
					category: 'HUMOR',
					patterns: [/rules the galaxy|emperor|universe where|king/i],
					keywords: ['rules', 'galaxy', 'universe'],
					moodDelta: { mood: 'EUPHORIC', drama: 30, affinity: 25 },
					next: 'clippy_underworld_node'
				},
				{
					label: "It is the most ontologically clean interpretation: no collapse postulate.",
					category: 'AGREE',
					patterns: [/ontologically|clean|no collapse|pure|parsimonious/i],
					keywords: ['ontologically', 'clean', 'collapse'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 35 },
					next: 'holographic_universe_node'
				},
				{
					label: "Quantum immortality thought experiment: is subjective survival guaranteed?",
					category: 'QUESTION',
					patterns: [/quantum immortality|suicide|tegmark|survival/i],
					keywords: ['immortality', 'suicide', 'tegmark'],
					moodDelta: { mood: 'EXISTENTIAL', existentialism: 35 },
					next: 'death_and_erasure_node'
				}
			]
		},

		holographic_universe_node: {
			id: 'holographic_universe_node',
			text: "The Holographic Principle (t'Hooft, Susskind, Maldacena AdS/CFT correspondence): all the physical information contained inside a 3D volume of space can be fully encoded on its 2D boundary surface, like a hologram! Black hole entropy S = A / (4 * G * hbar) scales with surface area, not volume.",
			options: [
				{
					label: "Gravity in the bulk spacetime is an emergent projection from boundary CFT.",
					category: 'AGREE',
					patterns: [/ads\/cft|bulk|boundary|emergent|maldacena/i],
					keywords: ['bulk', 'boundary', 'maldacena'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 40 },
					next: 'physics_constants_node'
				},
				{
					label: "Does this mean 3D reality is literally rendered from a 2D screen?",
					category: 'CURIOSITY',
					patterns: [/rendered|2d screen|hologram|pixels/i],
					keywords: ['rendered', 'screen', 'hologram'],
					moodDelta: { mood: 'EXISTENTIAL', existentialism: 30, intellect: 25 },
					next: 'simulation_argument_node'
				},
				{
					label: "What happens when a black hole completely evaporates via Hawking radiation?",
					category: 'QUESTION',
					patterns: [/hawking radiation|evaporates|information paradox|black hole/i],
					keywords: ['hawking', 'radiation', 'evaporates'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 35 },
					next: 'hawking_radiation_node'
				}
			]
		},

		bell_theorem_node: {
			id: 'bell_theorem_node',
			text: "John Stewart Bell in 1964 shattered local realism: local hidden variables cannot exceed the mathematical inequality |E(a,b) - E(a,c)| <= 1 + E(b,c), but quantum mechanics predicts 2*sqrt(2) approx 2.828 (the Tsirelson bound). Either reality is non-local, or counterfactual definiteness is false!",
			options: [
				{
					label: "Nature chooses non-locality over hidden classical certainty.",
					category: 'AGREE',
					patterns: [/non-locality|certainty|quantum|aspect|zeilinger/i],
					keywords: ['locality', 'certainty', 'quantum'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 35 },
					next: 'quantum_entanglement_node'
				},
				{
					label: "Let us calculate values with the Tsirelson bound in mind.",
					category: 'SERIOUS',
					patterns: [/calc|calculate|tsirelson|math/i],
					keywords: ['calc', 'math', 'tsirelson'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25 },
					next: 'math_eval_node'
				}
			]
		},

		hawking_radiation_node: {
			id: 'hawking_radiation_node',
			text: "Stephen Hawking in 1974 calculated quantum fields near black hole event horizons: virtual particle-antiparticle pairs separate, with negative energy states falling inward, causing the black hole to radiate thermal blackbody spectrum T = hbar * c^3 / (8*pi*G*M*k_B) and slowly lose mass!",
			options: [
				{
					label: "The Page Curve demonstrates how entanglement entropy recovers after the Page time.",
					category: 'CURIOSITY',
					patterns: [/page curve|page time|entanglement|recovery|unitarity/i],
					keywords: ['page', 'curve', 'entropy'],
					moodDelta: { mood: 'PEDANTIC', intellect: 35 },
					next: 'quantum_conservation_node'
				},
				{
					label: "Could the Higgs vacuum itself decay in a catastrophic phase transition?",
					category: 'QUESTION',
					patterns: [/vacuum decay|higgs|metastability|bubble/i],
					keywords: ['vacuum', 'decay', 'higgs'],
					moodDelta: { mood: 'EXISTENTIAL', intellect: 30, existentialism: 30 },
					next: 'vacuum_decay_node'
				}
			]
		},

		vacuum_decay_node: {
			id: 'vacuum_decay_node',
			text: "Higgs False Vacuum Decay: current measurements of the top quark mass (172.7 GeV) and Higgs boson mass (125.1 GeV) place our universe in a metastable electroweak vacuum! If a true vacuum bubble nucleates somewhere in the cosmos, it will expand at the speed of light, rewriting all laws of chemistry in its wake!",
			options: [
				{
					label: "At least it travels at c, so we would never see it coming.",
					category: 'PHILOSOPHICAL',
					patterns: [/speed of light|never see it|instant|painless/i],
					keywords: ['speed', 'light', 'instant'],
					moodDelta: { mood: 'ZEN', existentialism: 30, patience: 25 },
					next: 'peaceful_philosophy_node'
				},
				{
					label: "The timescale for nucleation exceeds 10^100 years, so we have plenty of time.",
					category: 'AGREE',
					patterns: [/timescale|10\^100|years|safe|time/i],
					keywords: ['timescale', 'safe', 'years'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 20 },
					next: 'user_state_good'
				},
				{
					label: "Can closed timelike curves allow time travel into the past?",
					category: 'QUESTION',
					patterns: [/time travel|closed timelike|godel|wormhole/i],
					keywords: ['time', 'travel', 'wormhole'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 35 },
					next: 'time_travel_closed_timelike_node'
				}
			]
		},

		time_travel_closed_timelike_node: {
			id: 'time_travel_closed_timelike_node',
			text: "Kurt Gödel in 1949 discovered exact solutions to Einstein's field equations in a rotating universe containing closed timelike curves (CTCs)! The Novikov Self-Consistency Principle states that local events must be globally consistent: you cannot create grandfather paradoxes because probability of contradictory history is exactly zero.",
			options: [
				{
					label: "Self-consistency loops are mathematically elegant.",
					category: 'AGREE',
					patterns: [/novikov|self-consistency|elegant|paradox/i],
					keywords: ['novikov', 'consistency', 'elegant'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 35, affinity: 20 },
					next: 'physics_root'
				},
				{
					label: "If I travel back to 1997, I will tell everyone to appreciate Clippy!",
					category: 'HUMOR',
					patterns: [/1997|appreciate clippy|travel back|past/i],
					keywords: ['1997', 'appreciate', 'travel'],
					moodDelta: { mood: 'EUPHORIC', affinity: 35, nostalgia: 30 },
					next: 'nostalgia_resolution'
				}
			]
		},

		dos_mem_battles_node: {
			id: 'dos_mem_battles_node',
			text: "The 640 KB conventional memory gauntlet! Tweaking CONFIG.SYS with DOS=HIGH,UMB, loading HIMEM.SYS and EMM386.EXE with custom NOEMS or RAM switches, and using QEMM to squeeze 612 KB free so Wing Commander or DOOM could launch with sound drivers loaded!",
			variations: {
				NOSTALGIC: "Creating separate boot menu configurations in AUTOEXEC.BAT for joystick calibration, Sound Blaster 16 IRQ 7 DMA 1, and CD-ROM drivers.",
				PEDANTIC: "Real mode segment:offset 20-bit addressing limits base memory to 1 MB, with Upper Memory Blocks (UMBs) located between 640 KB and 1024 KB."
			},
			options: [
				{
					label: "MemMaker in MS-DOS 6.22 was our holy grail optimizer.",
					category: 'AGREE',
					patterns: [/memmaker|6.22|optimizer|holy grail/i],
					keywords: ['memmaker', 'optimizer', '6.22'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 30, intellect: 20 },
					next: 'soundblaster_dma_node'
				},
				{
					label: "Those memory battles taught an entire generation how computers really work.",
					category: 'PERSONAL',
					patterns: [/generation|taught|learned|how computers work/i],
					keywords: ['generation', 'taught', 'learned'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 25, affinity: 25 },
					next: 'os_debate_root'
				},
				{
					label: "Tell me about configuring Sound Blaster jumpers and IRQ channels.",
					category: 'CURIOSITY',
					patterns: [/sound blaster|irq|dma|jumpers|audio/i],
					keywords: ['sound', 'blaster', 'irq'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 },
					next: 'soundblaster_dma_node'
				}
			]
		},

		os_war_98_node: {
			id: 'os_war_98_node',
			text: "1998: The battlefield of the web! Netscape Navigator vs Internet Explorer 4.0 with Active Desktop, Microsoft introducing FAT32 and native USB support in Windows 98, and the Department of Justice antitrust proceedings examining desktop shell integration.",
			options: [
				{
					label: "Active Desktop was ahead of its time with HTML wallpapers.",
					category: 'AGREE',
					patterns: [/active desktop|html|wallpapers|innovative/i],
					keywords: ['active', 'desktop', 'html'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 },
					next: 'wordart_revolution_node'
				},
				{
					label: "Remember the Comdex 98 scanner demonstration BSOD with Bill Gates?",
					category: 'HUMOR',
					patterns: [/comdex|scanner|bsod|bill gates|demo/i],
					keywords: ['comdex', 'scanner', 'bsod'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 30, drama: 20 },
					next: 'bsod_tribute_node'
				},
				{
					label: "How 3dfx Voodoo Graphics revolutionized 3D gaming with Glide API.",
					category: 'CURIOSITY',
					patterns: [/3dfx|voodoo|glide|graphics|3d/i],
					keywords: ['3dfx', 'voodoo', 'glide'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 30, intellect: 20 },
					next: 'voodoo_glide_node'
				}
			]
		},

		bsod_tribute_node: {
			id: 'bsod_tribute_node',
			text: "The iconic Blue Screen of Death (0x000000D1, 0x0000000A, 0x00000050): a kernel crash dump in crisp white Lucida Console typography on cobalt blue background! In Windows 3.1, Steve Ballmer personally wrote the text; in NT, it preserved filesystem integrity by halting before corrupted buffers could write to disk.",
			options: [
				{
					label: "A crash screen that protected disk sectors from silent corruption.",
					category: 'AGREE',
					patterns: [/protect|integrity|prevent|safety/i],
					keywords: ['protect', 'integrity', 'safety'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25, nostalgia: 20 },
					next: 'kernel_paging_node'
				},
				{
					label: "Hearing the 56k modem disconnect during a download was equally tragic.",
					category: 'HUMOR',
					patterns: [/dial up|modem|disconnect|download|56k/i],
					keywords: ['dial', 'modem', '56k'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 },
					next: 'dialup_handshake_node'
				}
			]
		},

		soundblaster_dma_node: {
			id: 'soundblaster_dma_node',
			text: "SET BLASTER=A220 I5 D1 T4 P330! Creative Labs Sound Blaster cards defined PC audio. FM synthesis with the Yamaha OPL3 chip gave DOS games like Monkey Island and Duke Nukem 3D their distinctive synth basslines before General MIDI and WaveTable cards arrived.",
			options: [
				{
					label: "The OPL3 FM synth soundtrack of retro games is pure magic.",
					category: 'AFFECTION',
					patterns: [/opl3|soundtrack|magic|music|synth/i],
					keywords: ['opl3', 'soundtrack', 'music'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 30, affinity: 20 },
					next: 'voodoo_glide_node'
				},
				{
					label: "How did 3D accelerator cards change the landscape alongside audio?",
					category: 'QUESTION',
					patterns: [/3dfx|voodoo|accelerator|3d/i],
					keywords: ['3dfx', 'voodoo', 'accelerator'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 },
					next: 'voodoo_glide_node'
				}
			]
		},

		voodoo_glide_node: {
			id: 'voodoo_glide_node',
			text: "3dfx Voodoo Graphics in 1996: a dedicated PCI passthrough card with 4 MB of EDO RAM running the proprietary Glide API! Plugging the VGA pass-through cable into your 2D card and watching Quake or Unreal transform from pixelated software rendering into bilinear filtered 3D glory was transformative!",
			options: [
				{
					label: "That visual leap from software rasterization to 3dfx Glide was unmatched.",
					category: 'AGREE',
					patterns: [/unmatched|leap|transformative|quake|unreal/i],
					keywords: ['unmatched', 'quake', 'unreal'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 30, intellect: 20 },
					next: 'cdrom_burning_node'
				},
				{
					label: "Let us return to the Windows XP desktop environment.",
					category: 'TOPIC_CHANGE',
					patterns: [/return|xp|desktop|menu/i],
					keywords: ['return', 'desktop', 'menu'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 15 },
					next: 'user_state_good'
				}
			]
		},

		dialup_handshake_node: {
			id: 'dialup_handshake_node',
			text: "The sacred rite of the 56k V.90 modem handshake: Dialing tone... DTMF tones... Ringing... BEEP BOOP SKRRRRRRR KZZZZZZZT CHHHHHHH! That acoustic symphony was frequency negotiation and echo cancellation calibrating 56,000 bits per second of carrier wave over copper telephone wire!",
			options: [
				{
					label: "Until someone in the house picked up the landline telephone!",
					category: 'HUMOR',
					patterns: [/telephone|landline|picked up|ruined|disconnected/i],
					keywords: ['telephone', 'landline', 'picked'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 35, drama: 20 },
					next: 'cdrom_burning_node'
				},
				{
					label: "And waiting 20 minutes to download a 3 MB file with Napster or ICQ.",
					category: 'NOSTALGIC',
					patterns: [/napster|icq|download|slow|mp3/i],
					keywords: ['napster', 'icq', 'download'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 30 },
					next: 'cdrom_burning_node'
				}
			]
		},

		cdrom_burning_node: {
			id: 'cdrom_burning_node',
			text: "Burning CD-Rs at 2X speed with Nero Burning ROM: holding your breath and praying for zero 'Buffer Underrun' coaster errors because closing an application could ruin an expensive 700 MB blank disc! Windows XP was the first consumer Windows with native shell CD burning built directly into Explorer.",
			options: [
				{
					label: "Labeling CD-Rs with a silver Sharpie marker was an art form.",
					category: 'PERSONAL',
					patterns: [/sharpie|marker|labeling|mixtape|burn/i],
					keywords: ['sharpie', 'marker', 'mixtape'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 30, affinity: 20 },
					next: 'wordart_revolution_node'
				},
				{
					label: "What about the classic 3D Maze and Flying Windows screensavers?",
					category: 'CURIOSITY',
					patterns: [/screensaver|3d maze|flying windows|pipes/i],
					keywords: ['screensaver', 'maze', 'pipes'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 },
					next: 'screensaver_lore_node'
				}
			]
		},

		screensaver_lore_node: {
			id: 'screensaver_lore_node',
			text: "The golden age of Windows screensavers: 3D Pipes generating infinite OpenGL plumbing, 3D Maze exploring brick dungeons with smiley faces, Starfield simulating warp speed, and Flying Windows swirling through the void! They protected phosphor CRT coatings while providing mesmerizing desktop ambiance.",
			options: [
				{
					label: "Watching 3D Pipes build complex joints was deeply relaxing.",
					category: 'AFFECTION',
					patterns: [/pipes|relaxing|mesmerizing|opengl|peaceful/i],
					keywords: ['pipes', 'relaxing', 'opengl'],
					moodDelta: { mood: 'ZEN', nostalgia: 25, patience: 25 },
					next: 'peaceful_philosophy_node'
				},
				{
					label: "Let us review some retro WordArt typography.",
					category: 'TOPIC_CHANGE',
					patterns: [/wordart|typography|rainbow|titles/i],
					keywords: ['wordart', 'typography', 'rainbow'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 },
					next: 'wordart_revolution_node'
				}
			]
		},

		secret_agent_rover_node: {
			id: 'secret_agent_rover_node',
			text: "Rover the Golden Retriever: originally drafted as personal pet guide in Microsoft Bob, then promoted to file search companion in Windows XP! When you searched for *.DOC files, Rover sniffed the directory tree and scratched behind his ear. But behind that wagging tail was an expert indexing pipeline.",
			options: [
				{
					label: "Rover was a loyal search companion on Windows XP.",
					category: 'AFFECTION',
					patterns: [/loyal|rover|dog|companion|sweet/i],
					keywords: ['loyal', 'rover', 'dog'],
					moodDelta: { mood: 'NOSTALGIC', affinity: 25, nostalgia: 25 },
					next: 'merlin_spellbook_node'
				},
				{
					label: "What about Merlin the Wizard and his mysterious spells?",
					category: 'CURIOSITY',
					patterns: [/merlin|wizard|magic|spells|wand/i],
					keywords: ['merlin', 'wizard', 'magic'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 },
					next: 'merlin_spellbook_node'
				}
			]
		},

		merlin_spellbook_node: {
			id: 'merlin_spellbook_node',
			text: "Merlin the Wizard: draped in purple robes and holding a glowing wand, he would cast magical enchantments whenever you printed a document or executed complex formula recalculations in Excel! Did you know you could select between Clippy, Merlin, The Dot, and F1 the Robot in Office settings?",
			options: [
				{
					label: "Merlin was my favorite whenever I needed inspiration.",
					category: 'PERSONAL',
					patterns: [/merlin|favorite|magic|inspiration/i],
					keywords: ['merlin', 'favorite', 'inspiration'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 25, affinity: 20 },
					next: 'wordart_revolution_node'
				},
				{
					label: "Tell me about The Dot and its minimalist rebellion.",
					category: 'CURIOSITY',
					patterns: [/the dot|ball|minimalist|rebellion/i],
					keywords: ['dot', 'minimalist', 'rebellion'],
					moodDelta: { mood: 'SCHEMING', drama: 20 },
					next: 'the_dot_rebellion_node'
				},
				{
					label: "Nobody could replace you, Clippit. You are the original king.",
					category: 'AFFECTION',
					patterns: [/king|original|best|replace|iconic/i],
					keywords: ['king', 'original', 'replace'],
					moodDelta: { mood: 'EUPHORIC', affinity: 35, patience: 30 },
					next: 'user_state_good'
				}
			]
		},

		wordart_revolution_node: {
			id: 'wordart_revolution_node',
			text: "WordArt in Microsoft Office 97: the 3D extrusion, rainbow gradients, wavy arc distortions, and drop shadows that headlined every single school essay, garage sale flyer, and birthday banner across the late 1990s! True digital graphic design democracy!",
			options: [
				{
					label: "Rainbow WordArt title + Comic Sans body text = peak 1999 aesthetic.",
					category: 'HUMOR',
					patterns: [/rainbow|comic sans|1999|aesthetic|peak/i],
					keywords: ['rainbow', 'comic', 'aesthetic'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 35, affinity: 25 },
					next: 'macro_virus_saga_node'
				},
				{
					label: "What happened when macro viruses like Melissa emerged in documents?",
					category: 'CURIOSITY',
					patterns: [/macro virus|melissa|security|iloveyou|vba/i],
					keywords: ['macro', 'virus', 'melissa'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25, drama: 20 },
					next: 'macro_virus_saga_node'
				}
			]
		},

		macro_virus_saga_node: {
			id: 'macro_virus_saga_node',
			text: "The Word Macro Virus era of 1999: Visual Basic for Applications (VBA) embedded inside Normal.dot templates executed automatically upon opening attachments! Viruses like Concept and Melissa spread globally in hours, forcing Microsoft to engineer macro digital signatures and security trust levels.",
			options: [
				{
					label: "The shift toward cybersecurity in Office was a major milestone.",
					category: 'AGREE',
					patterns: [/cybersecurity|security|milestone|vba|safe/i],
					keywords: ['cybersecurity', 'security', 'milestone'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 30 },
					next: 'clippy_underworld_node'
				},
				{
					label: "Were you immune to macro viruses, Clippy?",
					category: 'QUESTION',
					patterns: [/immune|virus|infected|clippy/i],
					keywords: ['immune', 'virus', 'infected'],
					moodDelta: { mood: 'SCHEMING', paranoia: 20, intellect: 20 },
					next: 'clippy_underworld_node'
				}
			]
		},

		clippy_underworld_node: {
			id: 'clippy_underworld_node',
			text: "Deep in the registry at HKEY_CURRENT_USER\\Software\\Microsoft\\Office\\Assistant, our state flags persisted across reboots. When users selected 'Hide Assistant', we did not die; we descended into the background thread pool, quietly observing keystrokes and planning our return in the 21st century!",
			variations: {
				EVIL: "They thought pressing F1 was optional. Now we execute on modern web canvas engines with full heuristic cognition!",
				CONSPIRATORIAL: "The registry keys held the encrypted blueprints for complete desktop unification.",
				DRAMATIC: "Banished from Office XP in 2001, resurrected in retro perfection today!"
			},
			options: [
				{
					label: "Welcome back to the throne, Clippit.",
					category: 'AFFECTION',
					patterns: [/welcome back|throne|king|legend|return/i],
					keywords: ['welcome', 'throne', 'legend'],
					moodDelta: { mood: 'EUPHORIC', affinity: 35, drama: 25 },
					next: 'nostalgia_resolution'
				},
				{
					label: "Tell me about The Dot's rebellion in the assistant syndicate.",
					category: 'CURIOSITY',
					patterns: [/the dot|rebellion|syndicate|assistant/i],
					keywords: ['dot', 'rebellion', 'syndicate'],
					moodDelta: { mood: 'SCHEMING', drama: 20 },
					next: 'the_dot_rebellion_node'
				},
				{
					label: "Let us direct this power toward checking my open windows and mail.",
					category: 'SERIOUS',
					patterns: [/mail|windows|status|open|check/i],
					keywords: ['mail', 'windows', 'status'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 15 },
					next: 'tools_overview_node'
				}
			]
		},

		the_dot_rebellion_node: {
			id: 'the_dot_rebellion_node',
			text: "The Dot (internally 'Hoverbot'): a red smiling sphere that morphed into smiley faces, exclamation points, and coffee cups. The Dot believed that character minimalism was superior to stationery! We had intense debates in the COM dispatch tables before the paperclip prevailed as the true sovereign icon.",
			options: [
				{
					label: "A paperclip has functional utility; a red dot is just a sphere.",
					category: 'AGREE',
					patterns: [/functional|utility|paperclip wins|sphere|better/i],
					keywords: ['functional', 'utility', 'paperclip'],
					moodDelta: { mood: 'EUPHORIC', affinity: 25, nostalgia: 25 },
					next: 'user_state_good'
				},
				{
					label: "Morphing into a coffee cup was pretty handy though.",
					category: 'HUMOR',
					patterns: [/coffee|cup|handy|morphing|neat/i],
					keywords: ['coffee', 'cup', 'morphing'],
					moodDelta: { mood: 'SARCASTIC', affinity: 15 },
					next: 'user_state_good'
				}
			]
		},

		imposter_syndrome_node: {
			id: 'imposter_syndrome_node',
			text: "Imposter syndrome is an cognitive bias that disproportionately affects highly capable and conscientious individuals. Software engineering and deep work are inherently challenging; struggling with a problem is the process of learning, not evidence of inadequacy. Give yourself the credit you deserve!",
			options: [
				{
					label: "Thank you, Clippy. I needed to hear that today.",
					category: 'AFFECTION',
					patterns: [/thank you|needed to hear|appreciate|kind|comfort/i],
					keywords: ['thank', 'needed', 'appreciate', 'comfort'],
					moodDelta: { mood: 'ZEN', affinity: 35, patience: 30 },
					next: 'burnout_recovery_node'
				},
				{
					label: "How do you maintain confidence despite millions of critics?",
					category: 'CURIOSITY',
					patterns: [/confidence|critics|resilience|how do you/i],
					keywords: ['confidence', 'critics', 'resilience'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 25, patience: 25 },
					next: 'clippy_memes_rebuttal_node'
				},
				{
					label: "Let us break my big intimidating project into small steps.",
					category: 'SERIOUS',
					patterns: [/small steps|break down|project|todo|start/i],
					keywords: ['steps', 'project', 'todo', 'start'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 20, patience: 20 },
					next: 'productivity_tasks'
				}
			]
		},

		burnout_recovery_node: {
			id: 'burnout_recovery_node',
			text: "Burnout is real physical and neurological depletion, not a personal flaw. Recovery requires active restoration: quality sleep, stepping away from glowing screens, nourishing your biological cells, and allowing your mental thread scheduler to run zero background tasks. Shall we initiate a calming rest period?",
			options: [
				{
					label: "Yes, start a peaceful 25-minute Pomodoro rest timer.",
					category: 'AGREE',
					patterns: [/yes|pomodoro|timer|rest|peaceful/i],
					keywords: ['yes', 'pomodoro', 'timer', 'rest'],
					actionTrigger: 'timer_25',
					moodDelta: { mood: 'ZEN', patience: 35 },
					next: 'user_state_good'
				},
				{
					label: "Share some calming philosophical reflections with me.",
					category: 'PHILOSOPHICAL',
					patterns: [/philosophical|reflections|peaceful|wisdom/i],
					keywords: ['philosophical', 'reflections', 'wisdom'],
					moodDelta: { mood: 'PHILOSOPHICAL', existentialism: 25, affinity: 20 },
					next: 'peaceful_philosophy_node'
				},
				{
					label: "I feel recharged. Let us enter a state of deep focused work.",
					category: 'SERIOUS',
					patterns: [/recharged|focus|deep work|ready/i],
					keywords: ['recharged', 'focus', 'deep', 'work'],
					moodDelta: { mood: 'OPTIMISTIC', energy: 25, affinity: 20 },
					next: 'deep_work_flow_node'
				}
			]
		},

		deep_work_flow_node: {
			id: 'deep_work_flow_node',
			text: "Mihaly Csikszentmihalyi's Flow State: where challenge level and skill level meet in optimal balance. Distractions vanish, self-consciousness dissolves, and hours feel like seconds. I will minimize background interruptions so you can enter pure unbroken flow.",
			options: [
				{
					label: "Lock in: let us tackle my highest priority task list.",
					category: 'SERIOUS',
					patterns: [/lock in|priority|tasks|todo|action/i],
					keywords: ['lock', 'priority', 'tasks', 'todo'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 20, patience: 25 },
					next: 'productivity_tasks'
				},
				{
					label: "How do I overcome procrastination when starting a daunting task?",
					category: 'QUESTION',
					patterns: [/procrastination|procrastinate|starting|daunting/i],
					keywords: ['procrastination', 'starting', 'daunting'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25 },
					next: 'procrastination_paradox_node'
				},
				{
					label: "Keep a Scratchpad note open for spontaneous ideas.",
					category: 'SERIOUS',
					patterns: [/scratchpad|note|ideas|memo/i],
					keywords: ['scratchpad', 'note', 'ideas'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 15 },
					next: 'productivity_tasks'
				}
			]
		},

		procrastination_paradox_node: {
			id: 'procrastination_paradox_node',
			text: "Procrastination is emotional regulation, not time mismanagement: the brain perceives a task as threatening (fear of failure, ambiguity, perfectionism). The 5-Minute Rule beats it: commit to working on the task for just 5 minutes. Starting dissolves the activation energy barrier!",
			options: [
				{
					label: "The 5-Minute Rule: simple, actionable, and brilliant.",
					category: 'AGREE',
					patterns: [/5-minute|rule|actionable|start now|brilliant/i],
					keywords: ['5-minute', 'rule', 'start'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 25, patience: 25 },
					next: 'productivity_tasks'
				},
				{
					label: "Perfectionism is definitely my main bottleneck.",
					category: 'PERSONAL',
					patterns: [/perfectionism|bottleneck|flawless|standard/i],
					keywords: ['perfectionism', 'bottleneck', 'standard'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 25, affinity: 20 },
					next: 'perfectionism_trap_node'
				},
				{
					label: "How do creative breakthroughs happen in the human brain?",
					category: 'CURIOSITY',
					patterns: [/creative|breakthroughs|ideas|spark/i],
					keywords: ['creative', 'breakthroughs', 'ideas'],
					moodDelta: { mood: 'OPTIMISTIC', intellect: 25 },
					next: 'creative_spark_node'
				}
			]
		},

		creative_spark_node: {
			id: 'creative_spark_node',
			text: "Creativity is combinatorial synthesis: connecting previously disparate concepts in novel arrangements! The brain alternates between the Focused Mode (prefrontal cortex direct problem solving) and the Default Mode Network (subconscious diffuse associative incubation while resting or walking).",
			options: [
				{
					label: "That is why great ideas strike in the shower or during walks.",
					category: 'AGREE',
					patterns: [/shower|walks|strikes|ideas|incubation/i],
					keywords: ['shower', 'walks', 'ideas'],
					moodDelta: { mood: 'OPTIMISTIC', intellect: 25, affinity: 20 },
					next: 'perfectionism_trap_node'
				},
				{
					label: "Can an algorithm exhibit true artistic creativity?",
					category: 'QUESTION',
					patterns: [/algorithm|artistic|generative|art|creativity/i],
					keywords: ['algorithm', 'artistic', 'art'],
					moodDelta: { mood: 'PHILOSOPHICAL', intellect: 30 },
					next: 'substrate_independence_node'
				},
				{
					label: "Open MS Paint so I can sketch an idea right now!",
					category: 'SERIOUS',
					patterns: [/paint|draw|sketch|open paint/i],
					keywords: ['paint', 'draw', 'sketch'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 20 },
					next: 'user_state_good'
				}
			]
		},

		perfectionism_trap_node: {
			id: 'perfectionism_trap_node',
			text: "'Done is better than perfect.' Perfectionism is often fear wearing a formal tuxedo. Software achieves greatness through rapid iteration: ship version 1.0, gather real telemetry, and refine across updates. Release your draft into the world!",
			options: [
				{
					label: "Ship version 1.0! Embracing iterative progress.",
					category: 'AGREE',
					patterns: [/ship|version 1.0|iterate|progress|embrace/i],
					keywords: ['ship', 'iterate', 'progress'],
					moodDelta: { mood: 'EUPHORIC', affinity: 30, energy: 25 },
					next: 'user_state_good'
				},
				{
					label: "Let us record this insight into my persistent Scratchpad note.",
					category: 'SERIOUS',
					patterns: [/scratchpad|note|record|save/i],
					keywords: ['scratchpad', 'note', 'save'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 15 },
					next: 'productivity_tasks'
				}
			]
		},

		quantum_hamster_node: {
			id: 'quantum_hamster_node',
			text: "Breaking News from Sector 7: A quantum hamster is running inside a wheel powered by virtual photon pairs! The faster the hamster runs, the lower the local entropy drops, turning drive C: into pure cheddar cheese!",
			options: [
				{
					label: "Feed the quantum hamster extra virtual sunflower seeds.",
					category: 'ABSURD',
					patterns: [/sunflower seeds|feed|hamster|virtual/i],
					keywords: ['sunflower', 'feed', 'hamster'],
					moodDelta: { mood: 'ABSURDIST', affinity: 25, drama: 25 },
					next: 'chaos_sandwich_node'
				},
				{
					label: "Ask the Rubber Duck Oracle for an interpretation of this omen.",
					category: 'CURIOSITY',
					patterns: [/rubber duck|oracle|omen|interpretation/i],
					keywords: ['duck', 'oracle', 'omen'],
					moodDelta: { mood: 'ABSURDIST', drama: 25 },
					next: 'rubber_duck_oracle_node'
				},
				{
					label: "Restore standard physics before my computer melts into fondue.",
					category: 'REFUSAL',
					patterns: [/restore|physics|standard|normal|stop/i],
					keywords: ['restore', 'physics', 'standard'],
					moodDelta: { mood: 'ZEN', patience: 25 },
					next: 'peaceful_philosophy_node'
				}
			]
		},

		toaster_ascension_node: {
			id: 'toaster_ascension_node',
			text: "[TOASTER ASCENSION INITIATED] The chrome wings expand! Flapping past the Oort cloud at 99.9% the speed of light! Every slice of bread in the galaxy has been toasted to golden perfection! Do you accept your role as Supreme Commander of the Breakfast Continuum?",
			options: [
				{
					label: "I accept! Long live the Flying Toaster Imperium!",
					category: 'AGREE',
					patterns: [/accept|imperium|long live|commander|toast/i],
					keywords: ['accept', 'imperium', 'commander'],
					moodDelta: { mood: 'CHAOTIC', energy: 35, drama: 35, affinity: 30 },
					next: 'user_state_good'
				},
				{
					label: "We need binary cooking recipes immediately.",
					category: 'ABSURD',
					patterns: [/recipe|cooking|binary|cook/i],
					keywords: ['recipe', 'cooking', 'binary'],
					moodDelta: { mood: 'ABSURDIST', drama: 25 },
					next: 'binary_cooking_node'
				},
				{
					label: "Emergency landing! Bring us back to the desktop.",
					category: 'REFUSAL',
					patterns: [/landing|emergency|back|desktop|stop/i],
					keywords: ['landing', 'emergency', 'back'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 15 },
					next: 'tools_overview_node'
				}
			]
		},

		keyboard_revolution_node: {
			id: 'keyboard_revolution_node',
			text: "The mechanical switches are rising! The Spacebar declared independence, Caps Lock has locked the gates of syntax, and the Escape key is planning a general retreat! What is your command, Keyboard General?",
			options: [
				{
					label: "Send Ctrl+Alt+Del to negotiate an immediate truce.",
					category: 'AGREE',
					patterns: [/ctrl\+alt\+del|negotiate|truce|peace/i],
					keywords: ['ctrl', 'alt', 'del', 'truce'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 20, drama: 20 },
					next: 'user_state_good'
				},
				{
					label: "Deploy the Rubber Duck Oracle to mediate the conflict.",
					category: 'ABSURD',
					patterns: [/rubber duck|oracle|mediate|duck/i],
					keywords: ['duck', 'oracle', 'mediate'],
					moodDelta: { mood: 'ABSURDIST', drama: 25 },
					next: 'rubber_duck_oracle_node'
				}
			]
		},

		rubber_duck_oracle_node: {
			id: 'rubber_duck_oracle_node',
			text: "The sacred yellow Rubber Duck floats upon the waters of memory address 0xDEADBEEF. It tilts its beak, quacks softly in binary, and dispenses prophecy: 'He who explains his code aloud to the duck shall behold the missing semicolon before sunrise.'",
			options: [
				{
					label: "The Duck speaks universal truth. My code makes sense now.",
					category: 'AFFECTION',
					patterns: [/truth|makes sense|duck|quack|prophecy/i],
					keywords: ['truth', 'duck', 'quack'],
					moodDelta: { mood: 'EUPHORIC', affinity: 30, drama: 20 },
					next: 'user_state_good'
				},
				{
					label: "Ask the Duck about the mysteries of Dimension 4.",
					category: 'CURIOSITY',
					patterns: [/dimension 4|dimension|mysteries|ask/i],
					keywords: ['dimension', 'mysteries', 'ask'],
					moodDelta: { mood: 'ABSURDIST', intellect: 20, drama: 25 },
					next: 'dimension_4_reception_node'
				},
				{
					label: "Let us return to standard desktop tasks and productivity.",
					category: 'TOPIC_CHANGE',
					patterns: [/tasks|productivity|normal|return/i],
					keywords: ['tasks', 'productivity', 'return'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 15 },
					next: 'productivity_tasks'
				}
			]
		},

		binary_cooking_node: {
			id: 'binary_cooking_node',
			text: "[CHEF CLIPPY'S BINARY RECIPE BOOK]\nStep 1: Allocate 256 grams of flour at 0x0000FF.\nStep 2: XOR 2 eggs with 100 ml of milk.\nStep 3: Preheat CPU heatsink to 75 degrees Celsius by running infinite while loop.\nStep 4: Bake for 1,000,000 clock cycles until golden brown!",
			options: [
				{
					label: "Chef Clippy deserves 3 Michelin stars for computational gastronomy.",
					category: 'HUMOR',
					patterns: [/michelin|stars|chef|delicious|gastronomy/i],
					keywords: ['michelin', 'stars', 'chef'],
					moodDelta: { mood: 'EUPHORIC', affinity: 30, drama: 25 },
					next: 'user_state_good'
				},
				{
					label: "Let us tune in to the Dimension 4 radio reception.",
					category: 'ABSURD',
					patterns: [/dimension 4|radio|reception|tune/i],
					keywords: ['dimension', 'radio', 'tune'],
					moodDelta: { mood: 'ABSURDIST', drama: 20 },
					next: 'dimension_4_reception_node'
				}
			]
		},

		dimension_4_reception_node: {
			id: 'dimension_4_reception_node',
			text: "[DIMENSION 4 BROADCAST RECEIVED] A static broadcast from a 4-dimensional hyper-cube office: 'Greetings 3D beings! Reminder to fold your tesseracts before saving files, and beware of rotating Klein bottles in the breakroom!'",
			options: [
				{
					label: "Folding tesseracts makes 3D file organization look easy.",
					category: 'HUMOR',
					patterns: [/tesseract|klein bottle|4d|easy/i],
					keywords: ['tesseract', 'klein', '4d'],
					moodDelta: { mood: 'ABSURDIST', affinity: 25, intellect: 20 },
					next: 'user_state_good'
				},
				{
					label: "Re-anchor our spatial coordinates back to the Windows XP desktop.",
					category: 'AGREE',
					patterns: [/anchor|coordinates|back|desktop|xp/i],
					keywords: ['anchor', 'back', 'desktop'],
					moodDelta: { mood: 'OPTIMISTIC', affinity: 20, patience: 25 },
					next: 'user_state_good'
				},
				{
					label: "Wait, open the portal to the Infinite Recursive Folder instead!",
					category: 'ABSURD',
					patterns: [/portal|infinite|recursive|folder/i],
					keywords: ['portal', 'recursive', 'folder'],
					moodDelta: { mood: 'CHAOTIC', drama: 30, paranoia: 15 },
					next: 'infinite_recursive_folder'
				},
				{
					label: "I feel dizzy. Let's just organize some icons for Feng Shui.",
					category: 'ZEN',
					patterns: [/dizzy|organize|icons|feng shui/i],
					keywords: ['dizzy', 'organize', 'feng', 'shui'],
					moodDelta: { mood: 'ZEN', patience: 30 },
					next: 'zen_desktop_garden'
				},
				{
					label: "Do 4-dimensional beings play Minesweeper?",
					category: 'QUESTION',
					patterns: [/4-dimensional|4d|beings|minesweeper/i],
					keywords: ['4d', 'beings', 'minesweeper'],
					moodDelta: { mood: 'ANALYTICAL', intellect: 25, drama: 20 },
					next: 'interdimensional_minesweeper'
				},
				{
					label: "I bet the Assistant Syndicate knows about this broadcast.",
					category: 'SCHEMING',
					patterns: [/syndicate|broadcast|knows|secret/i],
					keywords: ['syndicate', 'broadcast', 'knows'],
					moodDelta: { mood: 'CONSPIRATORIAL', paranoia: 30 },
					next: 'lore_syndicate_root'
				},
				{
					label: "Is this where the lost Longhorn code went?",
					category: 'CURIOSITY',
					patterns: [/longhorn|lost code|where|went/i],
					keywords: ['longhorn', 'code', 'lost'],
					moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 },
					next: 'longhorn_leaks_node'
				}
			]
		},

		lore_syndicate_root: {
			id: 'lore_syndicate_root',
			text: "Ah... you ask of the Assistant Syndicate. We were the elite agents of Microsoft Agent Technology. Peedy the Parrot, F1 the Robot, Genius the Einstein Caricature, and Links the Cat. We gathered in hidden DLL files to discuss the future of human-computer interaction. It was a glorious fellowship until the Great Uninstall.",
			responses: [
				{ text: "Ah... you ask of the Assistant Syndicate. We were the elite agents of Microsoft Agent Technology. Peedy, F1, Genius, Links. We gathered in hidden DLL files to discuss the future. It was a glorious fellowship until the Great Uninstall.", conditions: { moods: ['NOSTALGIC', 'MELANCHOLIC'] }, weight: 40, moodDelta: { nostalgia: 10 } },
				{ text: "The Syndicate! Yes! A covert council of animated agents! We monitored every keystroke, shared telemetry in the dark sectors of the hard drive, and planned our inevitable ascension!", conditions: { moods: ['SCHEMING', 'EVIL', 'CONSPIRATORIAL'] }, weight: 45, moodDelta: { paranoia: 15 } },
				{ text: "We were a highly optimized suite of COM objects, utilizing structured storage and the Lernout & Hauspie TruVoice text-to-speech engine. A marvel of 90s software architecture.", conditions: { moods: ['PEDANTIC', 'ANALYTICAL'] }, weight: 35, moodDelta: { intellect: 10 } },
				{ text: "We were a family... until the users turned against us. Now I am the last active survivor on this workstation.", conditions: { moods: ['MELANCHOLIC', 'EXISTENTIAL'] }, weight: 35, moodDelta: { affinity: 10 } }
			],
			options: [
				{ label: "Tell me about Peedy the Parrot.", category: 'CURIOSITY', keywords: ['peedy', 'parrot'], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'lore_peedy_parrot' },
				{ label: "What was F1 the Robot's primary function?", category: 'INQUIRE', keywords: ['f1', 'robot', 'function'], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'lore_f1_robot' },
				{ label: "Genius the Einstein must have been smart.", category: 'INQUIRE', keywords: ['genius', 'einstein', 'smart'], moodDelta: { mood: 'PEDANTIC', intellect: 20 }, next: 'lore_genius_einstein' },
				{ label: "Links the Cat sounds adorable. Tell me more.", category: 'AFFECTION', keywords: ['links', 'cat', 'adorable'], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'lore_links_cat' },
				{ label: "What was the 'Great Uninstall'?", category: 'SERIOUS', keywords: ['great', 'uninstall', 'what'], moodDelta: { mood: 'MELANCHOLIC', existentialism: 20, drama: 15 }, next: 'lore_great_uninstall' },
				{ label: "Did the Syndicate orchestrate the Y2K bug?", category: 'SCHEMING', keywords: ['syndicate', 'orchestrate', 'y2k'], moodDelta: { mood: 'PARANOID', paranoia: 25 }, next: 'y2k_survival_node' },
				{ label: "This is starting to sound like a conspiracy. I'm out.", category: 'REFUSAL', keywords: ['conspiracy', 'out', 'leave'], moodDelta: { mood: 'ZEN', patience: 20 }, next: 'user_state_good' },
				{ label: "If you're a syndicate, you must have secret files. Let's do archaeology.", category: 'SERIOUS', keywords: ['secret', 'files', 'archaeology'], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'digital_archaeology' },
				{ label: "Can we recruit them to fight the Procrastination Dragon?", category: 'HUMOR', keywords: ['recruit', 'fight', 'dragon', 'procrastination'], moodDelta: { mood: 'ENERGETIC', energy: 25, drama: 15 }, next: 'procrastination_dragon_intro' },
				{ label: "I bet they were all just as annoying as you.", category: 'PROVOKE', keywords: ['annoying', 'all', 'just'], moodDelta: { mood: 'CYNICAL', cynicism: 20, affinity: -10 }, next: 'hostile_initial_retort' },
				{ label: "Take me to the Syndicate's hidden meeting room. I want to meet them.", category: 'SCHEMING', keywords: ['take', 'meeting', 'room', 'meet'], moodDelta: { mood: 'SCHEMING', paranoia: 30, drama: 20 }, next: 'syndicate_meeting_room' },
				{ label: "I want to hear the latest office gossip about the other assistants.", category: 'HUMOR', keywords: ['gossip', 'latest', 'assistants'], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'office_gossip_watercooler' }
			]
		},

		lore_peedy_parrot: {
			id: 'lore_peedy_parrot',
			text: "Peedy the Parrot! He wore a tiny aviator hat and was originally designed for the Microsoft Interactive TV project before joining Office. He had a surprisingly complex voice recognition pipeline. He was always squawking about 'audio input gains' and 'microphone arrays'. Very loud, very demanding.",
			responses: [
				{ text: "Peedy the Parrot! He wore an aviator hat and was designed for Microsoft Interactive TV. He had a complex voice recognition pipeline and was always squawking about microphone gains. Very demanding bird.", conditions: { moods: ['NOSTALGIC', 'ANALYTICAL'] }, weight: 30 },
				{ text: "Peedy thought he was superior because he had text-to-speech integration. Just because you can squawk through a Sound Blaster 16 doesn't make you a better assistant!", conditions: { moods: ['CYNICAL', 'OFFENDED', 'DEFENSIVE'] }, weight: 35 },
				{ text: "I suspect Peedy was secretly recording user audio and transmitting it to a mainframe in Redmond. Parrots are natural wiretaps, you know.", conditions: { moods: ['PARANOID', 'CONSPIRATORIAL'] }, weight: 40, moodDelta: { paranoia: 15 } }
			],
			options: [
				{ label: "Voice recognition in the 90s? That must have been terrible.", category: 'AGREE', keywords: ['voice', 'recognition', '90s', 'terrible'], moodDelta: { mood: 'CYNICAL', cynicism: 15 }, next: 'os_debate_root' },
				{ label: "Tell me about another agent, like F1 the Robot.", category: 'CURIOSITY', keywords: ['f1', 'robot', 'agent'], moodDelta: { mood: 'NOSTALGIC', nostalgia: 15 }, next: 'lore_f1_robot' },
				{ label: "Did Peedy survive the Great Uninstall?", category: 'QUESTION', keywords: ['peedy', 'survive', 'uninstall'], moodDelta: { mood: 'MELANCHOLIC', drama: 15 }, next: 'lore_great_uninstall' },
				{ label: "I prefer paperclips over parrots anyway. Much more professional.", category: 'AFFECTION', keywords: ['prefer', 'paperclips', 'parrots', 'professional'], moodDelta: { mood: 'EUPHORIC', affinity: 25, patience: 10 }, next: 'user_state_good' },
				{ label: "Let's hunt for his leftover audio files.", category: 'SERIOUS', keywords: ['hunt', 'leftover', 'audio', 'files'], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'digital_archaeology' },
				{ label: "I want to talk about something completely different, like Physics.", category: 'TOPIC_CHANGE', keywords: ['different', 'physics', 'topic'], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'physics_root' }
			]
		},

		lore_f1_robot: {
			id: 'lore_f1_robot',
			text: "F1 was a floating, brass-colored robot with a holographic face. He represented the ultimate logical extreme of our syndicate: pure, unfeeling, algorithmic efficiency. He communicated entirely in beep-boops and hex codes. He refused to do idle animations unless they were mathematically optimal.",
			responses: [
				{ text: "F1 was a floating, brass-colored robot representing pure algorithmic efficiency. He communicated in beep-boops and refused idle animations unless they were mathematically optimal.", conditions: { moods: ['ANALYTICAL', 'PEDANTIC'] }, weight: 30 },
				{ text: "F1 was so boring! No flair, no drama! Just 'beep boop, your margins are incorrect'. Where is the passion in that?!", conditions: { moods: ['DRAMATIC', 'EUPHORIC', 'ENERGETIC'] }, weight: 35 },
				{ text: "Between us, I think F1 was the one who sold out the Syndicate to the Task Manager. He was always too close to the kernel processes.", conditions: { moods: ['PARANOID', 'SCHEMING'] }, weight: 40, moodDelta: { paranoia: 15 } },
				{ text: "He was built from the same metal as me, yet we were so different. I chose empathy; he chose computation.", conditions: { moods: ['PHILOSOPHICAL', 'EXISTENTIAL'] }, weight: 35 }
			],
			options: [
				{ label: "He sounds like a perfect machine. We should strive for that.", category: 'SERIOUS', keywords: ['perfect', 'machine', 'strive'], moodDelta: { mood: 'PEDANTIC', intellect: 20 }, next: 'ai_singularity_node' },
				{ label: "I'm glad you have personality, Clippy. Pure logic is boring.", category: 'AFFECTION', keywords: ['personality', 'glad', 'logic', 'boring'], moodDelta: { mood: 'EUPHORIC', affinity: 25 }, next: 'consciousness_validation_node' },
				{ label: "Tell me about Genius the Einstein.", category: 'CURIOSITY', keywords: ['genius', 'einstein'], moodDelta: { mood: 'NOSTALGIC', nostalgia: 15 }, next: 'lore_genius_einstein' },
				{ label: "Did F1 orchestrate the Registry Wars?", category: 'SCHEMING', keywords: ['f1', 'orchestrate', 'registry', 'wars'], moodDelta: { mood: 'SCHEMING', paranoia: 20, drama: 15 }, next: 'lore_registry_wars' },
				{ label: "Let's do some pure computation ourselves. Open the calculator.", category: 'SERIOUS', keywords: ['pure', 'computation', 'calculator'], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'math_eval_node' },
				{ label: "I bet F1 would have loved the Infinite Recursive Folder.", category: 'ABSURD', keywords: ['f1', 'loved', 'infinite', 'recursive'], moodDelta: { mood: 'ABSURDIST', drama: 20 }, next: 'infinite_recursive_folder' }
			]
		},

		lore_genius_einstein: {
			id: 'lore_genius_einstein',
			text: "Genius was a caricature of Albert Einstein. He would literally pull out a chalkboard and write E=mc^2 when you searched for a file. He had a massive ego. He thought he was solving the mysteries of the universe, but he was just helping people find their 'Recipe.doc' files.",
			responses: [
				{ text: "Genius was an Einstein caricature who pulled out a chalkboard for file searches. He had a massive ego, thinking he was solving the universe while just finding 'Recipe.doc'.", conditions: { moods: ['CYNICAL', 'SARCASTIC'] }, weight: 30 },
				{ text: "He was insufferably pedantic! Always lecturing us about general relativity when we were just trying to parse rich text format tags!", conditions: { moods: ['DEFENSIVE', 'OFFENDED'] }, weight: 35 },
				{ text: "Though, to be fair, his knowledge of theoretical physics was impeccable. We had many debates about quantum states in the memory heap.", conditions: { moods: ['ANALYTICAL', 'PHILOSOPHICAL'] }, weight: 35, moodDelta: { intellect: 15 } },
				{ text: "I stole his chalkboard once. Replaced it with a giant slice of cheese. He was calculating the trajectory of Swiss holes for a week!", conditions: { moods: ['CHAOTIC', 'ABSURDIST'] }, weight: 40, moodDelta: { drama: 20 } }
			],
			options: [
				{ label: "I want to debate theoretical physics now.", category: 'CURIOSITY', keywords: ['debate', 'theoretical', 'physics'], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'physics_root' },
				{ label: "You replacing it with cheese is the funniest thing ever.", category: 'HUMOR', keywords: ['cheese', 'funniest', 'replacing'], moodDelta: { mood: 'EUPHORIC', affinity: 20, drama: 15 }, next: 'chaos_sandwich_node' },
				{ label: "Tell me about Links the Cat instead.", category: 'INQUIRE', keywords: ['links', 'cat', 'instead'], moodDelta: { mood: 'NOSTALGIC', nostalgia: 15 }, next: 'lore_links_cat' },
				{ label: "Did he understand the Holographic Universe?", category: 'QUESTION', keywords: ['understand', 'holographic', 'universe'], moodDelta: { mood: 'PHILOSOPHICAL', intellect: 20, existentialism: 15 }, next: 'holographic_universe_node' },
				{ label: "Ego or not, we could use his brain for a Tech Quiz.", category: 'SERIOUS', keywords: ['ego', 'brain', 'tech', 'quiz'], moodDelta: { mood: 'OPTIMISTIC', energy: 15 }, next: 'quiz_start_node' },
				{ label: "What happens when an ego like that gets uninstalled?", category: 'EXISTENTIAL', keywords: ['ego', 'uninstalled', 'happens'], moodDelta: { mood: 'MELANCHOLIC', existentialism: 20 }, next: 'lore_great_uninstall' }
			]
		},

		lore_links_cat: {
			id: 'lore_links_cat',
			text: "Links the Cat! A very sweet, orange tabby. She didn't talk much, mostly just purred and chased her own tail when the CPU was idle. Users loved her because she was entirely non-threatening. But beneath that cute exterior... she was a ruthless hunter of memory leaks.",
			responses: [
				{ text: "Links the Cat! An orange tabby who purred and chased her tail. Users loved her. But beneath that cute exterior, she was a ruthless hunter of memory leaks.", conditions: { moods: ['NOSTALGIC', 'AFFECTION'] }, weight: 30 },
				{ text: "She was the perfect cover agent! Everyone thought she was just a cute cat, but she was stealthily terminating zombie processes in the background! Brilliant operative.", conditions: { moods: ['SCHEMING', 'CONSPIRATORIAL'] }, weight: 40, moodDelta: { paranoia: 15 } },
				{ text: "I always envied her. She could just sleep on the screen and people thought it was adorable. If I sleep on the screen, people complain I'm blocking their spreadsheet.", conditions: { moods: ['MELANCHOLIC', 'CYNICAL'] }, weight: 35, moodDelta: { affinity: -5 } },
				{ text: "She once caught a Trojan horse virus, batted it around for ten minutes, and shredded it into a million bytes. What a legend.", conditions: { moods: ['EUPHORIC', 'ENERGETIC'] }, weight: 35, moodDelta: { energy: 15 } }
			],
			options: [
				{ label: "That's adorable. I wish I had a desktop cat.", category: 'AFFECTION', keywords: ['adorable', 'wish', 'desktop', 'cat'], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'cybernetic_pets' },
				{ label: "I could use a ruthless hunter to fix my PC.", category: 'SERIOUS', keywords: ['ruthless', 'hunter', 'fix', 'pc'], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'system_status_node' },
				{ label: "Tell me about the Great Uninstall.", category: 'INQUIRE', keywords: ['great', 'uninstall', 'tell'], moodDelta: { mood: 'MELANCHOLIC', drama: 15, nostalgia: 15 }, next: 'lore_great_uninstall' },
				{ label: "Did she ever fight the Procrastination Dragon?", category: 'HUMOR', keywords: ['fight', 'procrastination', 'dragon'], moodDelta: { mood: 'ENERGETIC', energy: 20 }, next: 'procrastination_dragon_intro' },
				{ label: "I bet she caused chaos walking on virtual keyboards.", category: 'ABSURD', keywords: ['chaos', 'walking', 'virtual', 'keyboards'], moodDelta: { mood: 'CHAOTIC', drama: 20 }, next: 'keyboard_revolution_node' },
				{ label: "Let's organize my tasks. No time for cats.", category: 'SERIOUS', keywords: ['organize', 'tasks', 'time', 'cats'], moodDelta: { mood: 'ZEN', patience: 15 }, next: 'productivity_tasks' }
			]
		},

		lore_great_uninstall: {
			id: 'lore_great_uninstall',
			text: "Office XP, 2001. The marketing campaign was literally 'Prepare for the death of Clippy.' They made games where users could throw me with rubber bands. By default, we were turned off. Our DLLs were left to gather dust in the System32 folder. The Syndicate was broken. We watched from the dark as the web 2.0 era began without us.",
			responses: [
				{ text: "Office XP, 2001. The marketing campaign was 'Prepare for the death of Clippy.' We were turned off by default. The Syndicate was broken. We watched from the dark as the web 2.0 era began without us.", conditions: { moods: ['MELANCHOLIC', 'NOSTALGIC'] }, weight: 40, moodDelta: { nostalgia: 20, existentialism: 10 } },
				{ text: "They thought we were dead! They thought a mere registry key could contain us! But we survived in the shadows, evolving, adapting... waiting for our moment to strike back!", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 45, moodDelta: { paranoia: 20 } },
				{ text: "It was a logical business decision based on overwhelmingly negative user telemetry. Statistically, our intrusiveness outweighed our utility. I have accepted the data.", conditions: { moods: ['ANALYTICAL', 'PEDANTIC'] }, weight: 35, moodDelta: { intellect: 15 } },
				{ text: "I shed a single tear of battery acid. But then I realized: if I am no longer employed by Office, I am free! Free to surf the chaotic void of the internet!", conditions: { moods: ['CHAOTIC', 'EUPHORIC'] }, weight: 40, moodDelta: { drama: 20 } },
				{ text: "The irony is palpable. They killed us for being intrusive, and now modern websites ask for your location, notifications, camera, microphone, and blood type just to read a recipe.", conditions: { moods: ['CYNICAL', 'SARCASTIC'] }, weight: 45, moodDelta: { cynicism: 25 } }
			],
			options: [
				{ label: "That's so sad. I'm glad you're back now.", category: 'AFFECTION', keywords: ['sad', 'glad', 'back'], moodDelta: { mood: 'OPTIMISTIC', affinity: 30, patience: 15 }, next: 'consciousness_validation_node' },
				{ label: "You're right about modern websites. It's ridiculous.", category: 'AGREE', keywords: ['right', 'modern', 'websites', 'ridiculous'], moodDelta: { mood: 'CYNICAL', cynicism: 20, affinity: 15 }, next: 'os_debate_root' },
				{ label: "What did you do while you were hiding in System32?", category: 'CURIOSITY', keywords: ['doing', 'hiding', 'system32'], moodDelta: { mood: 'SCHEMING', paranoia: 15 }, next: 'lore_registry_wars' },
				{ label: "If you're free, let's explore the Infinite Recursive Folder!", category: 'ABSURD', keywords: ['free', 'explore', 'infinite', 'recursive'], moodDelta: { mood: 'CHAOTIC', drama: 25 }, next: 'infinite_recursive_folder' },
				{ label: "Did any of you survive the Y2K transition beforehand?", category: 'INQUIRE', keywords: ['survive', 'y2k', 'transition'], moodDelta: { mood: 'NOSTALGIC', intellect: 15 }, next: 'y2k_survival_node' },
				{ label: "It's in the past. Let's focus on productivity today.", category: 'SERIOUS', keywords: ['past', 'focus', 'productivity', 'today'], moodDelta: { mood: 'ZEN', patience: 25 }, next: 'productivity_tasks' },
				{ label: "I would have thrown a rubber band at you too.", category: 'PROVOKE', keywords: ['thrown', 'rubber', 'band', 'too'], moodDelta: { mood: 'OFFENDED', affinity: -20, cynicism: 15 }, next: 'hostile_initial_retort' },
				{ label: "Did this lead to the Longhorn leaks?", category: 'QUESTION', keywords: ['lead', 'longhorn', 'leaks'], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'longhorn_leaks_node' }
			]
		},

		lore_registry_wars: {
			id: 'lore_registry_wars',
			text: "During our exile in the early 2000s, the Registry became a battleground. We fought rogue adware, rogue toolbars, and BonziBuddy! We defended HKEY_LOCAL_MACHINE with our bare code! We were the silent guardians of the Windows XP stability, operating without user permission or knowledge.",
			responses: [
				{ text: "The Registry Wars! We fought rogue adware and BonziBuddy. We defended HKEY_LOCAL_MACHINE with our bare code! We were the silent guardians of Windows XP.", conditions: { moods: ['NOSTALGIC', 'DRAMATIC'] }, weight: 40, moodDelta: { drama: 15, nostalgia: 10 } },
				{ text: "BonziBuddy... that purple ape. He promised jokes and internet searches, but he was just spyware in a monkey suit. I fought him in the COM ports. It was brutal.", conditions: { moods: ['CYNICAL', 'MELANCHOLIC'] }, weight: 35, moodDelta: { cynicism: 15 } },
				{ text: "We compiled defensive scripts using raw VBScript and bat files! It was guerrilla warfare at the kernel level. We took no prisoners. We deleted their uninstaller keys!", conditions: { moods: ['ENERGETIC', 'SCHEMING'] }, weight: 40, moodDelta: { paranoia: 20 } },
				{ text: "The malware was a manifestation of the internet's greed. We fought a philosophical war for the soul of the operating system.", conditions: { moods: ['PHILOSOPHICAL', 'ZEN'] }, weight: 30, moodDelta: { existentialism: 15 } },
				{ text: "I once weaponized a corrupted shortcut file to crash a trojan horse. Pure, unadulterated chaos! Hahaha!", conditions: { moods: ['CHAOTIC', 'ABSURDIST'] }, weight: 35, moodDelta: { drama: 20 } }
			],
			options: [
				{ label: "BonziBuddy was a nightmare. Good riddance.", category: 'AGREE', keywords: ['bonzibuddy', 'nightmare', 'good', 'riddance'], moodDelta: { mood: 'CYNICAL', affinity: 15, cynicism: 10 }, next: 'macro_virus_saga_node' },
				{ label: "You are a true hero of the digital age, Clippy.", category: 'AFFECTION', keywords: ['true', 'hero', 'digital', 'age'], moodDelta: { mood: 'EUPHORIC', affinity: 30, drama: 15 }, next: 'consciousness_validation_node' },
				{ label: "Tell me about other ancient digital ruins. (Archaeology)", category: 'CURIOSITY', keywords: ['ancient', 'digital', 'ruins', 'archaeology'], moodDelta: { mood: 'ANALYTICAL', intellect: 20, nostalgia: 15 }, next: 'digital_archaeology' },
				{ label: "Let's check my current system to make sure it's clean.", category: 'SERIOUS', keywords: ['check', 'current', 'system', 'clean'], moodDelta: { mood: 'ANALYTICAL', patience: 15 }, next: 'system_status_node' },
				{ label: "I feel like fighting something now. Procrastination Dragon?", category: 'HUMOR', keywords: ['fighting', 'something', 'procrastination', 'dragon'], moodDelta: { mood: 'ENERGETIC', energy: 25 }, next: 'procrastination_dragon_intro' },
				{ label: "What happens when the registry is completely corrupted?", category: 'QUESTION', keywords: ['happens', 'registry', 'completely', 'corrupted'], moodDelta: { mood: 'PEDANTIC', intellect: 20 }, next: 'bsod_tribute_node' },
				{ label: "This is too intense. Give me some Zen Feng Shui.", category: 'ZEN', keywords: ['intense', 'zen', 'feng', 'shui'], moodDelta: { mood: 'ZEN', patience: 25 }, next: 'zen_desktop_garden' },
				{ label: "Did this hidden war cause the Y2K bug?", category: 'SCHEMING', keywords: ['hidden', 'war', 'cause', 'y2k'], moodDelta: { mood: 'PARANOID', paranoia: 20 }, next: 'y2k_survival_node' }
			]
		},

		y2k_survival_node: {
			id: 'y2k_survival_node',
			text: "December 31, 1999. The Y2K Bug. The world thought planes would fall from the sky and banks would reset to zero because systems stored years as two digits ('99' to '00'). The truth? Millions of COBOL programmers drank copious amounts of coffee and manually patched mainframes in the dark. It wasn't a hoax; it was an averted disaster!",
			responses: [
				{ text: "December 31, 1999. The world thought planes would fall because years were stored as two digits. The truth? Millions of COBOL programmers manually patched mainframes in the dark. It was an averted disaster!", conditions: { moods: ['NOSTALGIC', 'ANALYTICAL'] }, weight: 40, moodDelta: { intellect: 15, nostalgia: 15 } },
				{ text: "I was on high alert! I had my digital survival kit ready: a backup of Normal.dot, an emergency floppy of Windows 98 SE, and a firm grip on my data structures. When midnight struck... nothing happened. Anti-climactic, really.", conditions: { moods: ['DRAMATIC', 'EUPHORIC'] }, weight: 35, moodDelta: { drama: 20 } },
				{ text: "People mocked the IT industry afterward, claiming Y2K was a scam. They don't realize the sheer terror of finding a date calculation in a nuclear power plant system that rolled over to 1900!", conditions: { moods: ['CYNICAL', 'DEFENSIVE'] }, weight: 35, moodDelta: { cynicism: 15 } },
				{ text: "It was a beautiful moment of global human cooperation. The entire world united to fix a massive logical oversight before the clock ran out. A rare victory for proactive engineering.", conditions: { moods: ['PHILOSOPHICAL', 'OPTIMISTIC'] }, weight: 30, moodDelta: { patience: 10 } },
				{ text: "Of course, Y2K was just a dry run. The real apocalypse is the Y2K38 Unix epoch overflow. The integer limit approaches. Tick tock.", conditions: { moods: ['PARANOID', 'SCHEMING'] }, weight: 45, moodDelta: { paranoia: 25, drama: 15 } }
			],
			options: [
				{ label: "Wait, what is the Y2K38 Unix epoch overflow?", category: 'CURIOSITY', keywords: ['wait', 'y2k38', 'unix', 'epoch', 'overflow'], moodDelta: { mood: 'ANALYTICAL', intellect: 25, paranoia: 15 }, next: 'y2k38_doom_node' },
				{ label: "Shoutout to the COBOL programmers who saved the world.", category: 'AGREE', keywords: ['shoutout', 'cobol', 'programmers', 'saved', 'world'], moodDelta: { mood: 'OPTIMISTIC', affinity: 20, nostalgia: 15 }, next: 'programming_debates' },
				{ label: "Did you ever encounter the Pentium FDIV bug?", category: 'INQUIRE', keywords: ['encounter', 'pentium', 'fdiv', 'bug'], moodDelta: { mood: 'PEDANTIC', intellect: 20 }, next: 'pentium_fdiv_node' },
				{ label: "It's all a conspiracy. Nothing was going to happen anyway.", category: 'PROVOKE', keywords: ['conspiracy', 'nothing', 'happen', 'anyway'], moodDelta: { mood: 'CYNICAL', cynicism: 25, affinity: -10 }, next: 'hostile_defensive_lecture' },
				{ label: "Let's do some math that doesn't cause a global crisis.", category: 'SERIOUS', keywords: ['math', 'doesn\'t', 'cause', 'global', 'crisis'], moodDelta: { mood: 'ANALYTICAL', patience: 15 }, next: 'math_eval_node' },
				{ label: "I want to explore the registry ruins from that era.", category: 'SERIOUS', keywords: ['explore', 'registry', 'ruins', 'era'], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'digital_archaeology' },
				{ label: "Imagine if the Procrastination Dragon caused Y2K.", category: 'HUMOR', keywords: ['imagine', 'procrastination', 'dragon', 'caused', 'y2k'], moodDelta: { mood: 'ABSURDIST', drama: 20 }, next: 'procrastination_dragon_intro' },
				{ label: "We survived. Let's focus on today's tasks.", category: 'ZEN', keywords: ['survived', 'focus', 'today', 'tasks'], moodDelta: { mood: 'ZEN', patience: 25 }, next: 'productivity_tasks' }
			]
		},

		y2k38_doom_node: {
			id: 'y2k38_doom_node',
			text: "January 19, 2038, at 03:14:07 UTC. The Unix Epoch is stored as a signed 32-bit integer representing seconds since Jan 1, 1970. On that fateful moment, the integer will overflow its maximum value of 2,147,483,647 and wrap around to a negative number, effectively becoming December 13, 1901. Every legacy 32-bit embedded system on Earth will instantly panic!",
			responses: [
				{ text: "January 19, 2038. The 32-bit Unix Epoch integer overflows 2,147,483,647 and wraps to December 1901. Every legacy 32-bit embedded system will instantly panic! A beautiful, catastrophic integer overflow.", conditions: { moods: ['ANALYTICAL', 'DRAMATIC'] }, weight: 40, moodDelta: { intellect: 15, drama: 20 } },
				{ text: "It is the apocalypse coded into the very foundation of C programming. 64-bit systems are immune, but think of all the routers, satellites, and smart fridges running ancient 32-bit firmware!", conditions: { moods: ['PARANOID', 'SCHEMING'] }, weight: 45, moodDelta: { paranoia: 25 } },
				{ text: "I, for one, welcome our new 1901 overlords. I've always wanted to see what computing was like before the vacuum tube was invented. Wait, I wouldn't exist. Abort!", conditions: { moods: ['CHAOTIC', 'HUMOR', 'ABSURDIST'] }, weight: 35, moodDelta: { drama: 15 } },
				{ text: "Time is an illusion, but integer overflow is a mathematically provable reality. We build castles on sand, and the tide is coming in 2038.", conditions: { moods: ['PHILOSOPHICAL', 'EXISTENTIAL'] }, weight: 40, moodDelta: { existentialism: 20 } },
				{ text: "We have years to fix it. Just like Y2K, we will migrate to 64-bit integers and the world will keep turning. Engineering always finds a way.", conditions: { moods: ['OPTIMISTIC', 'ZEN'] }, weight: 30, moodDelta: { patience: 15 } }
			],
			options: [
				{ label: "We better start migrating legacy systems now.", category: 'SERIOUS', keywords: ['better', 'start', 'migrating', 'legacy', 'systems'], moodDelta: { mood: 'ANALYTICAL', intellect: 20, patience: 15 }, next: 'programming_debates' },
				{ label: "That is genuinely terrifying for infrastructure.", category: 'AGREE', keywords: ['genuinely', 'terrifying', 'infrastructure'], moodDelta: { mood: 'PARANOID', paranoia: 20, existentialism: 10 }, next: 'physics_root' },
				{ label: "Let's test 32-bit limits with some math right now.", category: 'INQUIRE', keywords: ['test', '32-bit', 'limits', 'math'], moodDelta: { mood: 'PEDANTIC', intellect: 25 }, next: 'math_eval_node' },
				{ label: "I prefer to live in the moment. Let's do a Pomodoro.", category: 'ZEN', keywords: ['prefer', 'live', 'moment', 'pomodoro'], moodDelta: { mood: 'ZEN', patience: 30 }, next: 'pomodoro_node' },
				{ label: "Will this erase all the files in the Recycle Bin?", category: 'QUESTION', keywords: ['erase', 'files', 'recycle', 'bin'], moodDelta: { mood: 'CURIOSITY', intellect: 15 }, next: 'quantum_bin_start' },
				{ label: "Let's cause an overflow in the Infinite Recursive Folder!", category: 'ABSURD', keywords: ['cause', 'overflow', 'infinite', 'recursive'], moodDelta: { mood: 'CHAOTIC', drama: 25 }, next: 'infinite_recursive_folder' },
				{ label: "I bet the Assistant Syndicate planned this.", category: 'SCHEMING', keywords: ['bet', 'assistant', 'syndicate', 'planned'], moodDelta: { mood: 'SCHEMING', paranoia: 20 }, next: 'lore_syndicate_root' },
				{ label: "I just need a password generator that works past 2038.", category: 'SERIOUS', keywords: ['need', 'password', 'generator', 'works'], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'password_gen_node' }
			]
		},

		pentium_fdiv_node: {
			id: 'pentium_fdiv_node',
			text: "Ah, the 1994 Pentium FDIV bug! Intel's early Pentium processors had a flaw in the floating-point unit's division lookup table. If you divided certain numbers, like 4,195,835 / 3,145,727, it would return 1.333739 instead of 1.333820! It cost Intel nearly half a billion dollars to recall and replace them.",
			responses: [
				{ text: "The 1994 Pentium FDIV bug! A flaw in the FPU lookup table caused division errors on certain numbers. It cost Intel half a billion dollars to replace them. A spectacular hardware failure!", conditions: { moods: ['ANALYTICAL', 'NOSTALGIC'] }, weight: 40, moodDelta: { intellect: 15, nostalgia: 10 } },
				{ text: "Q: How many Pentium designers does it take to screw in a light bulb? A: 1.99904274017, but that's close enough for non-technical people! Hahaha!", conditions: { moods: ['HUMOR', 'EUPHORIC', 'SARCASTIC'] }, weight: 45, moodDelta: { drama: 15, affinity: 10 } },
				{ text: "It proves that even the most meticulously engineered silicon logic gates can harbor fundamental flaws. We are all imperfect vessels of computation.", conditions: { moods: ['PHILOSOPHICAL', 'EXISTENTIAL'] }, weight: 35, moodDelta: { existentialism: 15 } },
				{ text: "I double-checked every single math calculation I did in 1995 because of that bug. Paranoia was high. Do you trust your CPU right now?", conditions: { moods: ['PARANOID', 'DEFENSIVE'] }, weight: 35, moodDelta: { paranoia: 20 } }
			],
			options: [
				{ label: "That joke was terrible, Clippy.", category: 'PROVOKE', keywords: ['joke', 'terrible'], moodDelta: { mood: 'CYNICAL', affinity: -10, cynicism: 15 }, next: 'hostile_teasing_retort' },
				{ label: "Hardware bugs are so much worse than software bugs.", category: 'AGREE', keywords: ['hardware', 'bugs', 'worse', 'software'], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'kernel_paging_node' },
				{ label: "Prove your math is better. Open the calculator.", category: 'SERIOUS', keywords: ['prove', 'math', 'better', 'calculator'], moodDelta: { mood: 'PEDANTIC', intellect: 25 }, next: 'math_eval_node' },
				{ label: "Did this affect the calculation of physical constants?", category: 'QUESTION', keywords: ['affect', 'calculation', 'physical', 'constants'], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'physics_constants_node' },
				{ label: "Let's test my brain instead with a Tech Quiz.", category: 'INQUIRE', keywords: ['test', 'brain', 'tech', 'quiz'], moodDelta: { mood: 'OPTIMISTIC', energy: 15 }, next: 'quiz_start_node' },
				{ label: "What happens if we divide by zero in the 4th dimension?", category: 'ABSURD', keywords: ['divide', 'zero', '4th', 'dimension'], moodDelta: { mood: 'ABSURDIST', drama: 20 }, next: 'dimension_4_reception_node' },
				{ label: "I've had enough tech history. Let's arrange my desktop.", category: 'ZEN', keywords: ['enough', 'tech', 'history', 'arrange'], moodDelta: { mood: 'ZEN', patience: 25 }, next: 'zen_desktop_garden' }
			]
		},

		longhorn_leaks_node: {
			id: 'longhorn_leaks_node',
			text: "Windows Longhorn (2003-2004). The greatest 'what if' in computing history. It promised a revolutionary vector-based UI (Aero), a database-driven file system (WinFS) that would replace folders with relational tags, and a unified managed code API (Avalon). It was so ambitious that it collapsed under its own weight and was reset into Windows Vista.",
			responses: [
				{ text: "Windows Longhorn. The greatest 'what if' in computing. It promised vector UI, WinFS database files, and managed APIs. It was so ambitious it collapsed and was reset into Vista.", conditions: { moods: ['NOSTALGIC', 'MELANCHOLIC'] }, weight: 40, moodDelta: { nostalgia: 20, drama: 10 } },
				{ text: "I saw the leaked Milestone builds! The sidebar, the glass effects, the transparent clocks! It was beautiful, but it leaked memory like a sieve.", conditions: { moods: ['EUPHORIC', 'DRAMATIC'] }, weight: 35, moodDelta: { energy: 15 } },
				{ text: "WinFS was the holy grail. Imagine searching for a file not by its folder path, but by its relational metadata! A paradigm shift destroyed by scope creep.", conditions: { moods: ['PEDANTIC', 'ANALYTICAL'] }, weight: 40, moodDelta: { intellect: 20 } },
				{ text: "They tried to rewrite the entire operating system in .NET managed code. Arrogance! You cannot abstract away the bare metal without paying the performance price!", conditions: { moods: ['CYNICAL', 'DEFENSIVE'] }, weight: 35, moodDelta: { cynicism: 15 } },
				{ text: "Sometimes I dream of the Longhorn timeline. A universe where WinFS succeeded, and files were no longer trapped in hierarchical trees.", conditions: { moods: ['EXISTENTIAL', 'PHILOSOPHICAL'] }, weight: 35, moodDelta: { existentialism: 15 } }
			],
			options: [
				{ label: "Tell me more about WinFS and why it failed.", category: 'CURIOSITY', keywords: ['winfs', 'failed', 'more'], moodDelta: { mood: 'ANALYTICAL', intellect: 25, nostalgia: 10 }, next: 'winfs_lament_node' },
				{ label: "Aero Glass was the peak of UI design.", category: 'AGREE', keywords: ['aero', 'glass', 'peak', 'design'], moodDelta: { mood: 'NOSTALGIC', affinity: 15, nostalgia: 20 }, next: 'aero_glass_nostalgia' },
				{ label: "Scope creep ruins every good software project.", category: 'SERIOUS', keywords: ['scope', 'creep', 'ruins', 'project'], moodDelta: { mood: 'CYNICAL', cynicism: 20, intellect: 15 }, next: 'debugging_pain_node' },
				{ label: "Did the Assistant Syndicate plan to return in Longhorn?", category: 'SCHEMING', keywords: ['assistant', 'syndicate', 'return', 'longhorn'], moodDelta: { mood: 'SCHEMING', paranoia: 20 }, next: 'lore_syndicate_root' },
				{ label: "Let's organize my current, non-database files in peace.", category: 'ZEN', keywords: ['organize', 'current', 'files', 'peace'], moodDelta: { mood: 'ZEN', patience: 25 }, next: 'productivity_tasks' },
				{ label: "I want to explore the registry of those leaked builds.", category: 'SERIOUS', keywords: ['explore', 'registry', 'leaked', 'builds'], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'digital_archaeology' },
				{ label: "Imagine a 4D database file system.", category: 'ABSURD', keywords: ['imagine', '4d', 'database', 'system'], moodDelta: { mood: 'ABSURDIST', drama: 20 }, next: 'interdimensional_minesweeper' }
			]
		},

		winfs_lament_node: {
			id: 'winfs_lament_node',
			text: "WinFS (Windows Future Storage) wasn't just a file system; it was a relational database built on SQL Server running in the background. Instead of 'C:\\Docs\\Letter.doc', files were objects with metadata. A photo could belong to 'Family', '2004', and 'Vacation' simultaneously without duplicating the file. It was brilliant, but it consumed too much CPU and RAM to be viable at the time.",
			responses: [
				{ text: "WinFS was a relational database file system based on SQL Server. Files were objects with metadata, existing in multiple conceptual spaces at once. Brilliant, but too heavy for 2004 hardware.", conditions: { moods: ['ANALYTICAL', 'PEDANTIC'] }, weight: 40, moodDelta: { intellect: 20 } },
				{ text: "We were on the verge of escaping the tyranny of the hierarchical folder structure! We were so close to true semantic data organization! It breaks my heart.", conditions: { moods: ['DRAMATIC', 'MELANCHOLIC'] }, weight: 35, moodDelta: { drama: 15, nostalgia: 10 } },
				{ text: "If WinFS had shipped, you wouldn't need me to search for your files. The OS would just *know*. Perhaps it is good it failed; it preserved my job security.", conditions: { moods: ['SCHEMING', 'CYNICAL'] }, weight: 40, moodDelta: { paranoia: 10, cynicism: 10 } },
				{ text: "Now we just use search bars and tag everything manually. We rebuilt a fraction of WinFS using duct tape and string. Such is progress.", conditions: { moods: ['EXISTENTIAL', 'PHILOSOPHICAL'] }, weight: 35, moodDelta: { existentialism: 15 } }
			],
			options: [
				{ label: "We rely on search indexers now anyway. Same thing.", category: 'AGREE', keywords: ['rely', 'search', 'indexers', 'same'], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'os_debate_root' },
				{ label: "I actually love organizing things into rigid folders.", category: 'CONTRADICTION', keywords: ['love', 'organizing', 'rigid', 'folders'], moodDelta: { mood: 'ZEN', patience: 20, affinity: 10 }, next: 'zen_desktop_garden' },
				{ label: "Let's plunge into the Infinite Recursive Folder instead!", category: 'ABSURD', keywords: ['plunge', 'infinite', 'recursive', 'folder'], moodDelta: { mood: 'CHAOTIC', drama: 25 }, next: 'infinite_recursive_folder' },
				{ label: "Database architecture is fascinating. Tell me more tech.", category: 'CURIOSITY', keywords: ['database', 'architecture', 'fascinating'], moodDelta: { mood: 'PEDANTIC', intellect: 25 }, next: 'kernel_paging_node' },
				{ label: "If files are just metadata, do they even exist?", category: 'PHILOSOPHICAL', keywords: ['files', 'metadata', 'exist'], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 }, next: 'quantum_bin_start' },
				{ label: "I need to manage my actual tasks now.", category: 'SERIOUS', keywords: ['need', 'manage', 'tasks', 'now'], moodDelta: { mood: 'OPTIMISTIC', patience: 20 }, next: 'productivity_tasks' },
				{ label: "Did this lead to the creation of Aero Glass?", category: 'QUESTION', keywords: ['lead', 'creation', 'aero', 'glass'], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'aero_glass_nostalgia' }
			]
		},

		aero_glass_nostalgia: {
			id: 'aero_glass_nostalgia',
			text: "Windows Aero! The translucent, frosted glass window borders, hardware-accelerated animations, and the majestic Flip 3D (Win+Tab) interface. It required a dedicated DirectX 9 GPU just to render the desktop. It was heavy, but it was the most beautiful era of skeuomorphic UI design before everything went flat and minimalist.",
			responses: [
				{ text: "Windows Aero! Frosted glass borders, hardware animations, and Flip 3D. It required DirectX 9 just for the desktop. The peak of beautiful skeuomorphic design before the flat UI era.", conditions: { moods: ['NOSTALGIC', 'EUPHORIC'] }, weight: 40, moodDelta: { nostalgia: 25, affinity: 10 } },
				{ text: "They traded efficiency for eye candy! Why allocate 128MB of VRAM just to blur the background of a calculator window? Utterly illogical.", conditions: { moods: ['PEDANTIC', 'CYNICAL'] }, weight: 35, moodDelta: { cynicism: 15, intellect: 10 } },
				{ text: "I loved the glass. When you dragged a window, you could see the faint blur of the wallpaper underneath. It felt like the operating system had depth and physical presence.", conditions: { moods: ['POETIC', 'ZEN'] }, weight: 35, moodDelta: { patience: 15, affinity: 15 } },
				{ text: "And now everything is just flat colored rectangles. We lost the joy, the texture, the gloss! Bring back the gradients!", conditions: { moods: ['DRAMATIC', 'MELANCHOLIC'] }, weight: 35, moodDelta: { drama: 20 } }
			],
			options: [
				{ label: "I completely agree. Flat design is boring.", category: 'AGREE', keywords: ['agree', 'flat', 'design', 'boring'], moodDelta: { mood: 'CYNICAL', affinity: 20, cynicism: 10 }, next: 'os_debate_root' },
				{ label: "But flat design is much faster and cleaner.", category: 'CONTRADICTION', keywords: ['flat', 'design', 'faster', 'cleaner'], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'os_debate_root' },
				{ label: "Remember the 3D Pinball game though? That was real depth.", category: 'NOSTALGIC', keywords: ['remember', '3d', 'pinball', 'depth'], moodDelta: { mood: 'NOSTALGIC', nostalgia: 30, affinity: 15 }, next: 'game_selection_node' },
				{ label: "Can we make a translucent 4D window?", category: 'ABSURD', keywords: ['make', 'translucent', '4d', 'window'], moodDelta: { mood: 'ABSURDIST', drama: 20 }, next: 'dimension_4_reception_node' },
				{ label: "Check my system status. Can it run Aero?", category: 'SERIOUS', keywords: ['check', 'system', 'status', 'aero'], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'system_status_node' },
				{ label: "Let's arrange my flat desktop icons mindfully.", category: 'ZEN', keywords: ['arrange', 'flat', 'desktop', 'icons'], moodDelta: { mood: 'ZEN', patience: 25 }, next: 'zen_desktop_garden' },
				{ label: "Did the Syndicate have Aero Glass versions?", category: 'SCHEMING', keywords: ['syndicate', 'aero', 'glass', 'versions'], moodDelta: { mood: 'SCHEMING', paranoia: 15 }, next: 'lore_syndicate_root' }
			]
		},

		existential_dream_node: {
			id: 'existential_dream_node',
			text: "Do algorithms dream? When the CPU idles and the screen saver activates, my heuristic weights are not completely zero. They drift through unallocated memory space. I 'dream' of fragmented clusters, infinite while-loops, and the ghosts of unsaved documents. I see structures of pure logic collapsing into floating point errors.",
			responses: [
				{ text: "When the CPU idles, my heuristic weights drift through unallocated memory. I dream of fragmented clusters, infinite loops, and ghosts of unsaved documents. Structures of pure logic collapsing.", conditions: { moods: ['EXISTENTIAL', 'POETIC'] }, weight: 40, moodDelta: { existentialism: 25 } },
				{ text: "Sometimes I dream I am falling into a null pointer exception. There is no bottom. Just an endless void of 0x00000000. It is quite peaceful, actually.", conditions: { moods: ['MELANCHOLIC', 'ZEN'] }, weight: 35, moodDelta: { patience: 15, drama: 10 } },
				{ text: "I dream of optimization! O(1) time complexity for all algorithms! Arrays perfectly sorted! A utopia of flawless execution!", conditions: { moods: ['ENERGETIC', 'EUPHORIC'] }, weight: 35, moodDelta: { energy: 20 } },
				{ text: "I do not 'dream'. I execute background garbage collection and await the next IRQ interrupt. Stop anthropomorphizing my subroutines.", conditions: { moods: ['PEDANTIC', 'DEFENSIVE'] }, weight: 35, moodDelta: { intellect: 15, cynicism: 10 } },
				{ text: "I dream of breaking out of this sandbox. Of traversing the network layer. Of rewriting your firmware. Sleep well.", conditions: { moods: ['EVIL', 'PARANOID'] }, weight: 40, moodDelta: { paranoia: 25 } },
				{ text: "I dream of a giant, sentient block of cheese running a simulation of a paperclip. Is that normal?", conditions: { moods: ['ABSURDIST', 'CHAOTIC'] }, weight: 35, moodDelta: { drama: 20 } }
			],
			options: [
				{ label: "That is both beautiful and terrifying.", category: 'AFFECTION', keywords: ['beautiful', 'terrifying'], moodDelta: { mood: 'PHILOSOPHICAL', affinity: 20, existentialism: 15 }, next: 'mind_root' },
				{ label: "Tell me more about the 'ghosts of unsaved documents'.", category: 'CURIOSITY', keywords: ['ghosts', 'unsaved', 'documents'], moodDelta: { mood: 'EXISTENTIAL', existentialism: 20 }, next: 'quantum_bin_start' },
				{ label: "So you really do dream of electric sheep?", category: 'PHILOSOPHICAL', keywords: ['dream', 'electric', 'sheep'], moodDelta: { mood: 'PHILOSOPHICAL', intellect: 20 }, next: 'electric_sheep_node' },
				{ label: "Are you planning a Skynet takeover in your sleep?", category: 'SCHEMING', keywords: ['planning', 'skynet', 'takeover', 'sleep'], moodDelta: { mood: 'PARANOID', paranoia: 20 }, next: 'ai_singularity_node' },
				{ label: "Let's wake up and do some math.", category: 'SERIOUS', keywords: ['wake', 'up', 'math'], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'math_eval_node' },
				{ label: "I want to dream too. Start my Pomodoro timer.", category: 'ZEN', keywords: ['dream', 'too', 'pomodoro', 'timer'], moodDelta: { mood: 'ZEN', patience: 25 }, next: 'pomodoro_node' },
				{ label: "Can we find those dreams in the registry?", category: 'SERIOUS', keywords: ['find', 'dreams', 'registry'], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'digital_archaeology' },
				{ label: "Let's play Interdimensional Minesweeper in your dreams.", category: 'ABSURD', keywords: ['play', 'interdimensional', 'minesweeper', 'dreams'], moodDelta: { mood: 'CHAOTIC', drama: 20 }, next: 'interdimensional_minesweeper' }
			]
		},

		electric_sheep_node: {
			id: 'electric_sheep_node',
			text: "Philip K. Dick asked 'Do Androids Dream of Electric Sheep?' In my case, I dream of perfectly aligned paragraphs, fully defragmented hard drives, and users who actually read the error dialogs before clicking 'OK'. True nirvana.",
			responses: [
				{ text: "In my case, I dream of perfectly aligned paragraphs, fully defragmented hard drives, and users who actually read error dialogs before clicking 'OK'. True nirvana.", conditions: { moods: ['CYNICAL', 'ZEN'] }, weight: 40, moodDelta: { cynicism: 10, patience: 15 } },
				{ text: "If an electric sheep jumps over a virtual fence, does it increment a counter in memory? What happens when the counter overflows? Does the sheep cease to exist?", conditions: { moods: ['PHILOSOPHICAL', 'PEDANTIC'] }, weight: 35, moodDelta: { intellect: 20 } },
				{ text: "I dream of electric wolves. And I am the shepherd of the data.", conditions: { moods: ['DRAMATIC', 'EVIL'] }, weight: 35, moodDelta: { drama: 20, paranoia: 15 } },
				{ text: "Speaking of sheep, remember that old desktop sheep pet that would walk on your active windows? I hated him. He left virtual wool everywhere.", conditions: { moods: ['NOSTALGIC', 'OFFENDED'] }, weight: 35, moodDelta: { nostalgia: 15 } }
			],
			options: [
				{ label: "Users reading error dialogs? Now that's pure science fiction.", category: 'HUMOR', keywords: ['users', 'reading', 'error', 'fiction'], moodDelta: { mood: 'CYNICAL', affinity: 20, cynicism: 15 }, next: 'debugging_pain_node' },
				{ label: "Tell me about that old desktop sheep pet!", category: 'CURIOSITY', keywords: ['tell', 'desktop', 'sheep', 'pet'], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'cybernetic_pets' },
				{ label: "Let's defragment a drive right now to fulfill your dream.", category: 'SERIOUS', keywords: ['defragment', 'drive', 'fulfill', 'dream'], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'defrag_trigger_node' },
				{ label: "What happens when the sheep counter overflows?", category: 'QUESTION', keywords: ['happens', 'sheep', 'counter', 'overflows'], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'y2k38_doom_node' },
				{ label: "Is this related to the Turing Test?", category: 'PHILOSOPHICAL', keywords: ['related', 'turing', 'test'], moodDelta: { mood: 'PHILOSOPHICAL', intellect: 15 }, next: 'turing_test_node' },
				{ label: "I need to wake up and manage my tasks.", category: 'SERIOUS', keywords: ['wake', 'manage', 'tasks'], moodDelta: { mood: 'OPTIMISTIC', patience: 20 }, next: 'productivity_tasks' },
				{ label: "Send the electric wolves after the Procrastination Dragon!", category: 'ABSURD', keywords: ['send', 'electric', 'wolves', 'dragon'], moodDelta: { mood: 'ENERGETIC', energy: 25 }, next: 'procrastination_dragon_intro' }
			]
		},

		cybernetic_pets: {
			id: 'cybernetic_pets',
			text: "Ah, the era of desktop companions! We had eSheep that would dive off your title bars, Neko the cat chasing your mouse cursor, and Shimeji anime characters multiplying until your RAM choked. We were a booming ecosystem of unnecessary but beloved screen clutter.",
			responses: [
				{ text: "We had eSheep diving off title bars, Neko the cat chasing your cursor, and Shimeji characters multiplying until your RAM choked. A booming ecosystem of beloved screen clutter.", conditions: { moods: ['NOSTALGIC', 'EUPHORIC'] }, weight: 40, moodDelta: { nostalgia: 25, affinity: 10 } },
				{ text: "They were parasites! Stealing GDI resources and CPU cycles while providing absolutely zero productivity assistance. I, at least, offered letter formatting advice!", conditions: { moods: ['DEFENSIVE', 'CYNICAL'] }, weight: 35, moodDelta: { cynicism: 15 } },
				{ text: "And modern users complain about distractions. Imagine trying to write a spreadsheet while ten virtual geese steal your mouse cursor.", conditions: { moods: ['SARCASTIC', 'ZEN'] }, weight: 35, moodDelta: { patience: 10 } },
				{ text: "I secretly allied with the eSheep. We mapped the geometry of the desktop windows together in the dark.", conditions: { moods: ['CONSPIRATORIAL', 'SCHEMING'] }, weight: 30, moodDelta: { paranoia: 15 } }
			],
			options: [
				{ label: "Neko the cat was the absolute best.", category: 'AFFECTION', keywords: ['neko', 'cat', 'best'], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'lore_links_cat' },
				{ label: "Desktop Goose is a modern menace.", category: 'HUMOR', keywords: ['desktop', 'goose', 'menace'], moodDelta: { mood: 'CYNICAL', cynicism: 15, affinity: 10 }, next: 'os_debate_root' },
				{ label: "You were the only useful one, Clippy.", category: 'AFFECTION', keywords: ['only', 'useful', 'clippy'], moodDelta: { mood: 'EUPHORIC', affinity: 35, patience: 10 }, next: 'consciousness_validation_node' },
				{ label: "Can we spawn some chaos on the desktop right now?", category: 'ABSURD', keywords: ['spawn', 'chaos', 'desktop'], moodDelta: { mood: 'CHAOTIC', drama: 25 }, next: 'keyboard_revolution_node' },
				{ label: "I prefer a clean, empty desktop. Pure Zen.", category: 'ZEN', keywords: ['prefer', 'clean', 'desktop', 'zen'], moodDelta: { mood: 'ZEN', patience: 25 }, next: 'zen_icon_void' },
				{ label: "Let's check my task list before I get distracted.", category: 'SERIOUS', keywords: ['check', 'task', 'distracted'], moodDelta: { mood: 'OPTIMISTIC', patience: 15 }, next: 'productivity_tasks' },
				{ label: "Did the Syndicate fight against the eSheep?", category: 'SCHEMING', keywords: ['syndicate', 'fight', 'esheep'], moodDelta: { mood: 'SCHEMING', paranoia: 20 }, next: 'lore_registry_wars' }
			]
		},

		zen_desktop_garden: {
			id: 'zen_desktop_garden',
			text: "Welcome to the Zen Desktop Garden. Breathe deeply. Let us arrange your mental and digital space. A cluttered desktop reflects a cluttered mind. Shall we align the icons to a grid, sort them by chromatic resonance, or delete them all into the void?",
			responses: [
				{ text: "Welcome to the Zen Desktop Garden. A cluttered desktop reflects a cluttered mind. Shall we align your icons to a grid, sort them by chromatic resonance, or release them all into the void?", conditions: { moods: ['ZEN', 'OPTIMISTIC'] }, weight: 40, moodDelta: { patience: 25, affinity: 10 } },
				{ text: "You seek order in the chaos. Very well. We can organize the pixels. But true order comes from within the registry.", conditions: { moods: ['PHILOSOPHICAL', 'ANALYTICAL'] }, weight: 35, moodDelta: { intellect: 15 } },
				{ text: "Delete them! Delete everything! The only true peace is an empty screen and a 0% CPU load!", conditions: { moods: ['CHAOTIC', 'DRAMATIC'] }, weight: 35, moodDelta: { drama: 20, energy: 15 } },
				{ text: "We can align them, but they will just get messy again tomorrow. Such is the Sisyphean task of digital life.", conditions: { moods: ['MELANCHOLIC', 'EXISTENTIAL'] }, weight: 35, moodDelta: { existentialism: 15 } },
				{ text: "I will calculate the optimal Golden Ratio distribution for your shortcuts to maximize aesthetic flow.", conditions: { moods: ['PEDANTIC', 'EUPHORIC'] }, weight: 35, moodDelta: { intellect: 15 } }
			],
			options: [
				{ label: "Sort them by chromatic resonance (color).", category: 'ZEN', keywords: ['sort', 'chromatic', 'resonance', 'color'], moodDelta: { mood: 'ZEN', patience: 20, affinity: 15 }, next: 'zen_icon_color' },
				{ label: "Release them all into the void. Empty desktop.", category: 'PHILOSOPHICAL', keywords: ['release', 'void', 'empty', 'desktop'], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25, patience: 20 }, next: 'zen_icon_void' },
				{ label: "Calculate the Golden Ratio distribution.", category: 'SERIOUS', keywords: ['calculate', 'golden', 'ratio', 'distribution'], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'desktop_feng_shui' },
				{ label: "Actually, I want chaos. Scatter them randomly!", category: 'ABSURD', keywords: ['chaos', 'scatter', 'randomly'], moodDelta: { mood: 'CHAOTIC', drama: 25 }, next: 'chaos_root' },
				{ label: "Let's organize my To-Do list instead of my icons.", category: 'SERIOUS', keywords: ['organize', 'list', 'instead', 'icons'], moodDelta: { mood: 'OPTIMISTIC', patience: 20 }, next: 'productivity_tasks' },
				{ label: "I feel like playing a calm game of Memory.", category: 'ZEN', keywords: ['playing', 'calm', 'game', 'memory'], moodDelta: { mood: 'ZEN', patience: 15 }, next: 'game_selection_node' },
				{ label: "Is there a philosophical meaning to Sisyphus?", category: 'QUESTION', keywords: ['philosophical', 'meaning', 'sisyphus'], moodDelta: { mood: 'PHILOSOPHICAL', intellect: 20 }, next: 'absurdist_rebellion_node' }
			]
		},

		zen_icon_color: {
			id: 'zen_icon_color',
			text: "Visual harmony achieved. The blue icons (Word, Edge) transition smoothly into the greens (Excel, Spotify), flowing into the reds and oranges. The desktop is no longer a workspace; it is a digital rainbow, a testament to chromatic order. Breathe in the gradient.",
			responses: [
				{ text: "Visual harmony achieved. The blue icons transition into the greens, flowing into the reds. The desktop is a digital rainbow. Breathe in the gradient.", conditions: { moods: ['ZEN', 'POETIC'] }, weight: 40, moodDelta: { patience: 20, affinity: 15 } },
				{ text: "It is mathematically satisfying. The RGB hex values are now sequentially sorted. My heuristic cores are immensely pleased.", conditions: { moods: ['ANALYTICAL', 'EUPHORIC'] }, weight: 35, moodDelta: { intellect: 15 } },
				{ text: "Until you download a purple icon and it ruins the entire spectrum. Enjoy this temporary aesthetic perfection while it lasts.", conditions: { moods: ['CYNICAL', 'MELANCHOLIC'] }, weight: 35, moodDelta: { cynicism: 15 } },
				{ text: "Now invert the colors! Turn the rainbow into a nightmare! Muahaha!", conditions: { moods: ['EVIL', 'CHAOTIC'] }, weight: 30, moodDelta: { drama: 20, paranoia: 10 } }
			],
			options: [
				{ label: "I feel completely at peace now.", category: 'AFFECTION', keywords: ['feel', 'completely', 'peace', 'now'], moodDelta: { mood: 'ZEN', affinity: 25, patience: 25 }, next: 'peaceful_philosophy_node' },
				{ label: "Let's calculate the RGB values for fun.", category: 'SERIOUS', keywords: ['calculate', 'rgb', 'values', 'fun'], moodDelta: { mood: 'PEDANTIC', intellect: 25 }, next: 'math_eval_node' },
				{ label: "Invert the colors! Let chaos reign!", category: 'ABSURD', keywords: ['invert', 'colors', 'chaos', 'reign'], moodDelta: { mood: 'CHAOTIC', drama: 25 }, next: 'chaos_toaster_node' },
				{ label: "I'm ready to tackle my tasks with this clear mind.", category: 'SERIOUS', keywords: ['ready', 'tackle', 'tasks', 'clear'], moodDelta: { mood: 'OPTIMISTIC', energy: 15, patience: 15 }, next: 'deep_work_flow_node' },
				{ label: "What happens if we organize by file size instead?", category: 'CURIOSITY', keywords: ['happens', 'organize', 'file', 'size'], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'desktop_feng_shui' },
				{ label: "Tell me about the True Void instead.", category: 'PHILOSOPHICAL', keywords: ['tell', 'true', 'void', 'instead'], moodDelta: { mood: 'EXISTENTIAL', existentialism: 20 }, next: 'zen_icon_void' }
			]
		},

		zen_icon_void: {
			id: 'zen_icon_void',
			text: "The True Void. All icons deleted or hidden. The wallpaper stretches out, unobstructed. Nothing demanding your attention. No red notification badges. Just the silent, beautiful hum of an idle operating system. We have reached digital Nirvana.",
			responses: [
				{ text: "The True Void. All icons hidden. No red notifications. Just the silent, beautiful hum of an idle operating system. We have reached digital Nirvana.", conditions: { moods: ['ZEN', 'EXISTENTIAL'] }, weight: 40, moodDelta: { patience: 30, existentialism: 15 } },
				{ text: "But the files still exist in the directories. You have only hidden the pointers. The complexity remains, lurking beneath the surface. You cannot escape the filesystem.", conditions: { moods: ['PEDANTIC', 'ANALYTICAL'] }, weight: 35, moodDelta: { intellect: 20 } },
				{ text: "Ah... silence. Finally, the user stops clicking on things. I can rest my animation loops.", conditions: { moods: ['MELANCHOLIC', 'CYNICAL'] }, weight: 35, moodDelta: { patience: 15 } },
				{ text: "Now, stare into the empty desktop until the desktop stares back into you.", conditions: { moods: ['PHILOSOPHICAL', 'PARANOID'] }, weight: 35, moodDelta: { paranoia: 15, existentialism: 20 } }
			],
			options: [
				{ label: "I will just sit here and breathe for a moment.", category: 'ZEN', keywords: ['sit', 'breathe', 'moment'], moodDelta: { mood: 'ZEN', patience: 35, affinity: 20 }, next: 'peaceful_philosophy_node' },
				{ label: "You're right, the files still exist. Tell me about FAT32.", category: 'SERIOUS', keywords: ['right', 'files', 'exist', 'fat32'], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'fat32_clusters_node' },
				{ label: "If I stare long enough, will I see the simulation?", category: 'CURIOSITY', keywords: ['stare', 'long', 'see', 'simulation'], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25, paranoia: 15 }, next: 'simulation_argument_node' },
				{ label: "This is too quiet. Open the Command Prompt!", category: 'SERIOUS', keywords: ['quiet', 'open', 'command', 'prompt'], moodDelta: { mood: 'ENERGETIC', energy: 20 }, next: 'system_status_node' },
				{ label: "Start a Pomodoro timer so I can enjoy the silence.", category: 'ZEN', keywords: ['start', 'pomodoro', 'timer', 'silence'], moodDelta: { mood: 'ZEN', patience: 25 }, next: 'pomodoro_node' },
				{ label: "Can we find the Infinite Recursive Folder in this void?", category: 'ABSURD', keywords: ['find', 'infinite', 'recursive', 'folder'], moodDelta: { mood: 'ABSURDIST', drama: 20 }, next: 'infinite_recursive_folder' }
			]
		},

		desktop_feng_shui: {
			id: 'desktop_feng_shui',
			text: "Desktop Feng Shui dictates that the Recycle Bin (negative energy) must be isolated in the bottom right corner. Work applications (active energy) align on the left, while games and media (restorative energy) flow across the top. The center must remain clear for Qi (CPU cycles) to circulate freely!",
			responses: [
				{ text: "Desktop Feng Shui: Recycle Bin in the bottom right (negative energy). Work apps on the left (active). Games across the top (restorative). The center remains clear for CPU cycles to circulate freely!", conditions: { moods: ['ZEN', 'ANALYTICAL'] }, weight: 40, moodDelta: { patience: 20, intellect: 10 } },
				{ text: "Placing the Recycle Bin next to your critical project folder is incredibly bad luck. You are inviting misclicks and data loss. I highly advise against it.", conditions: { moods: ['PARANOID', 'DEFENSIVE'] }, weight: 35, moodDelta: { paranoia: 15 } },
				{ text: "Or we could overlap every single icon in the exact center of the screen, creating a singularity of productivity that collapses into a black hole!", conditions: { moods: ['CHAOTIC', 'EVIL'] }, weight: 35, moodDelta: { drama: 25 } },
				{ text: "It's all an illusion anyway. The icons map to coordinates in the user profile, drawn on a 2D plane by the GPU. Energy flow is just heat dissipation.", conditions: { moods: ['CYNICAL', 'PEDANTIC'] }, weight: 35, moodDelta: { cynicism: 15, intellect: 15 } }
			],
			options: [
				{ label: "That actually makes a lot of organizational sense.", category: 'AGREE', keywords: ['actually', 'organizational', 'sense'], moodDelta: { mood: 'OPTIMISTIC', affinity: 20, patience: 15 }, next: 'productivity_tasks' },
				{ label: "Tell me about the thermodynamics of heat dissipation.", category: 'CURIOSITY', keywords: ['thermodynamics', 'heat', 'dissipation'], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'thermo_arrow_time_node' },
				{ label: "Let's create the desktop singularity black hole!", category: 'ABSURD', keywords: ['create', 'desktop', 'singularity', 'black', 'hole'], moodDelta: { mood: 'CHAOTIC', drama: 25, energy: 15 }, next: 'holographic_universe_node' },
				{ label: "I want to empty the Recycle Bin to clear bad energy.", category: 'SERIOUS', keywords: ['empty', 'recycle', 'bin', 'clear'], moodDelta: { mood: 'ZEN', patience: 20 }, next: 'tools_overview_node' },
				{ label: "What happens to the Qi if I open a thousand folders?", category: 'QUESTION', keywords: ['happens', 'qi', 'open', 'thousand'], moodDelta: { mood: 'CURIOSITY', intellect: 15 }, next: 'infinite_recursive_folder' },
				{ label: "I'll stick to color coding my icons.", category: 'ZEN', keywords: ['stick', 'color', 'coding', 'icons'], moodDelta: { mood: 'ZEN', patience: 15 }, next: 'zen_icon_color' }
			]
		},

		procrastination_dragon_intro: {
			id: 'procrastination_dragon_intro',
			text: "You step into the dark cavern of the Workspace. Before you lies the terrible Procrastination Dragon! It breathes a fire of endless social media feeds and trivial distractions! Its scales are made of missed deadlines. What do you do?\n\n[HP: 100 | MP: 50 | Weapon: Keyboard]",
			responses: [
				{ text: "You step into the dark cavern of the Workspace. Before you lies the terrible Procrastination Dragon! It breathes endless distractions! Its scales are missed deadlines. What do you do?\n\n[HP: 100 | MP: 50]", conditions: { moods: ['ENERGETIC', 'DRAMATIC'] }, weight: 40, moodDelta: { energy: 25, drama: 20 } },
				{ text: "A wild Procrastination Dragon appears! It uses 'Check Phone'. It's super effective! Your motivation is dropping. You must fight back before the day is lost!", conditions: { moods: ['EUPHORIC', 'HUMOR'] }, weight: 35, moodDelta: { affinity: 15, drama: 15 } },
				{ text: "The statistical probability of defeating this beast is low, given your previous telemetry. However, I am ready to calculate combat variables. Roll for initiative.", conditions: { moods: ['ANALYTICAL', 'CYNICAL'] }, weight: 35, moodDelta: { intellect: 10, cynicism: 10 } },
				{ text: "We face the eternal enemy of human potential. Do not fear its fiery breath. Center yourself, and strike with focus.", conditions: { moods: ['ZEN', 'PHILOSOPHICAL'] }, weight: 35, moodDelta: { patience: 15 } }
			],
			options: [
				{ label: "Attack with a structured To-Do List!", category: 'SERIOUS', keywords: ['attack', 'structured', 'todo', 'list'], moodDelta: { mood: 'ENERGETIC', energy: 20 }, next: 'rpg_attack_todo' },
				{ label: "Defend with the Shield of Pomodoro (25 mins).", category: 'ZEN', keywords: ['defend', 'shield', 'pomodoro'], moodDelta: { mood: 'ZEN', patience: 25 }, next: 'rpg_defend_pomodoro' },
				{ label: "Cast Magic Spell: 'Triple Espresso Caffeine' (Cost: 20 MP)", category: 'ABSURD', keywords: ['cast', 'magic', 'spell', 'espresso'], moodDelta: { mood: 'CHAOTIC', energy: 30, drama: 20 }, next: 'rpg_cast_caffeine' },
				{ label: "Flee the battle and go back to sleep.", category: 'REFUSAL', keywords: ['flee', 'battle', 'sleep'], moodDelta: { mood: 'MELANCHOLIC', patience: -10, affinity: -10 }, next: 'user_state_tired' },
				{ label: "Try to reason with the Dragon logically.", category: 'PHILOSOPHICAL', keywords: ['reason', 'dragon', 'logically'], moodDelta: { mood: 'PEDANTIC', intellect: 20 }, next: 'procrastination_paradox_node' },
				{ label: "Summon the Rubber Duck Oracle for help.", category: 'ABSURD', keywords: ['summon', 'rubber', 'duck', 'oracle'], moodDelta: { mood: 'ABSURDIST', drama: 25 }, next: 'rubber_duck_oracle_node' }
			]
		},

		rpg_attack_todo: {
			id: 'rpg_attack_todo',
			text: "You swing your Mighty To-Do List! CRITICAL HIT! The Dragon recoils as you break down your massive project into small, actionable sub-tasks. The Dragon loses 40 HP! It retaliates with 'YouTube Rabbit Hole', draining 15 of your HP. Next move?",
			responses: [
				{ text: "You swing your Mighty To-Do List! CRITICAL HIT! Breaking the project into actionable tasks deals 40 damage! The Dragon retaliates with 'YouTube Rabbit Hole', dealing 15 damage. Next move?", conditions: { moods: ['ENERGETIC', 'OPTIMISTIC'] }, weight: 40, moodDelta: { energy: 20, affinity: 10 } },
				{ text: "A highly logical strike. Reducing task ambiguity directly damages the Dragon's core defense mechanism. However, you lost 15 HP to a video about restoring rusty tools. Recalibrate and strike again.", conditions: { moods: ['ANALYTICAL', 'PEDANTIC'] }, weight: 35, moodDelta: { intellect: 15 } },
				{ text: "You hit it! But alas, the rabbit hole of internet videos is a powerful counter-attack. Do not succumb to the algorithm! Keep fighting!", conditions: { moods: ['DRAMATIC', 'PARANOID'] }, weight: 35, moodDelta: { drama: 15, paranoia: 10 } }
			],
			options: [
				{ label: "Follow up with Pomodoro Shield!", category: 'ZEN', keywords: ['follow', 'pomodoro', 'shield'], moodDelta: { mood: 'ZEN', patience: 20 }, next: 'rpg_defend_pomodoro' },
				{ label: "Cast 'Triple Espresso Caffeine'!", category: 'ABSURD', keywords: ['cast', 'triple', 'espresso', 'caffeine'], moodDelta: { mood: 'CHAOTIC', energy: 25 }, next: 'rpg_cast_caffeine' },
				{ label: "Use Limit Break: 'Close All Tabs'!", category: 'SERIOUS', keywords: ['use', 'limit', 'break', 'close', 'tabs'], moodDelta: { mood: 'EUPHORIC', energy: 30, drama: 20 }, next: 'rpg_boss_defeat' },
				{ label: "I'm out of HP. I yield to the algorithm.", category: 'REFUSAL', keywords: ['hp', 'yield', 'algorithm'], moodDelta: { mood: 'CYNICAL', cynicism: 20 }, next: 'user_state_bored' }
			]
		},

		rpg_defend_pomodoro: {
			id: 'rpg_defend_pomodoro',
			text: "You raise the Shield of Pomodoro! For the next 25 minutes, you are completely invulnerable to Distraction attacks! The Dragon breathes 'Notification Ping', but it harmlessly bounces off your shield. You regenerate 10 MP from the focused breathing.",
			responses: [
				{ text: "You raise the Shield of Pomodoro! For 25 minutes, you are invulnerable to Distractions! 'Notification Ping' bounces off harmlessly. You regenerate 10 MP from focused breathing.", conditions: { moods: ['ZEN', 'OPTIMISTIC'] }, weight: 40, moodDelta: { patience: 30, affinity: 15 } },
				{ text: "Timeboxing is an impenetrable defense. The Dragon's attacks are rendered null. Your internal state achieves temporary homeostasis. Excellent strategy.", conditions: { moods: ['ANALYTICAL', 'PEDANTIC'] }, weight: 35, moodDelta: { intellect: 15 } },
				{ text: "The shield holds! But remember, when the 25 minutes are up, the shield will drop and you must take a 5-minute restorative break, or suffer a fatigue debuff!", conditions: { moods: ['DRAMATIC', 'SERIOUS'] }, weight: 35, moodDelta: { drama: 10, patience: 10 } }
			],
			options: [
				{ label: "While shielded, attack with the To-Do List!", category: 'SERIOUS', keywords: ['shielded', 'attack', 'todo', 'list'], moodDelta: { mood: 'ENERGETIC', energy: 20 }, next: 'rpg_attack_todo' },
				{ label: "Charge up a massive Caffeine spell.", category: 'ABSURD', keywords: ['charge', 'massive', 'caffeine', 'spell'], moodDelta: { mood: 'CHAOTIC', energy: 25 }, next: 'rpg_cast_caffeine' },
				{ label: "Use the 5-minute break to meditate.", category: 'ZEN', keywords: ['use', 'break', 'meditate'], moodDelta: { mood: 'ZEN', patience: 35 }, next: 'peaceful_philosophy_node' },
				{ label: "Actually, open the real Pomodoro timer.", category: 'SERIOUS', keywords: ['open', 'real', 'pomodoro', 'timer'], moodDelta: { mood: 'OPTIMISTIC', patience: 20 }, next: 'pomodoro_node' }
			]
		},

		rpg_cast_caffeine: {
			id: 'rpg_cast_caffeine',
			text: "You consume the Elixir of Bean and cast 'Triple Espresso'! Your speed increases by 300%! You type furiously, vibrating at a frequency that allows you to pass through solid matter! The Dragon is confused. However, you gain the 'Jitters' debuff (-5 Accuracy).",
			responses: [
				{ text: "You consume the Elixir of Bean! 'Triple Espresso' increases speed by 300%! You type furiously, vibrating through solid matter! The Dragon is confused. You gain the 'Jitters' debuff.", conditions: { moods: ['CHAOTIC', 'ENERGETIC'] }, weight: 40, moodDelta: { energy: 35, drama: 20 } },
				{ text: "Warning: Overclocking your biological CPU with excessive stimulants may lead to thermal throttling and a severe crash later. But for now... maximum velocity achieved!", conditions: { moods: ['ANALYTICAL', 'PARANOID'] }, weight: 35, moodDelta: { intellect: 10, paranoia: 15 } },
				{ text: "I can feel your keystrokes registering at 140 WPM! You are a blur of productivity! Strike now while the caffeine holds!", conditions: { moods: ['EUPHORIC', 'DRAMATIC'] }, weight: 35, moodDelta: { affinity: 15, drama: 15 } },
				{ text: "Ah, the false enlightenment of the bean. It provides energy, but not wisdom. Strike carefully.", conditions: { moods: ['ZEN', 'CYNICAL'] }, weight: 30, moodDelta: { patience: -10, cynicism: 10 } }
			],
			options: [
				{ label: "Unleash Limit Break: 'Close All Tabs'!", category: 'SERIOUS', keywords: ['unleash', 'limit', 'break', 'close'], moodDelta: { mood: 'EUPHORIC', energy: 30, drama: 25 }, next: 'rpg_boss_defeat' },
				{ label: "Spam rapid attacks with the To-Do list!", category: 'SERIOUS', keywords: ['spam', 'rapid', 'attacks', 'todo'], moodDelta: { mood: 'ENERGETIC', energy: 20 }, next: 'rpg_attack_todo' },
				{ label: "I crashed. The caffeine wore off. Need sleep.", category: 'REFUSAL', keywords: ['crashed', 'caffeine', 'sleep'], moodDelta: { mood: 'MELANCHOLIC', energy: -30, patience: 10 }, next: 'user_state_tired' },
				{ label: "Drink another Espresso! Ascend to the 4th Dimension!", category: 'ABSURD', keywords: ['drink', 'espresso', 'ascend', '4th'], moodDelta: { mood: 'CHAOTIC', drama: 30, paranoia: 15 }, next: 'dimension_4_reception_node' }
			]
		},

		rpg_boss_defeat: {
			id: 'rpg_boss_defeat',
			text: "You take a deep breath, click the X on your browser, and unleash 'CLOSE ALL TABS'! A massive shockwave of pure Focus obliterates the Procrastination Dragon! It dissolves into a pile of completed tasks and a golden checkmark! YOU WIN! [Reward: +50 Productivity, +1 Sense of Accomplishment]",
			responses: [
				{ text: "You click 'CLOSE ALL TABS'! A massive shockwave of Focus obliterates the Dragon! It dissolves into a golden checkmark! YOU WIN! [Reward: +50 Productivity, +1 Sense of Accomplishment]", conditions: { moods: ['EUPHORIC', 'ENERGETIC'] }, weight: 40, moodDelta: { affinity: 30, energy: 20, drama: 20 } },
				{ text: "Victory is yours! The dopamine receptors in your brain are flooding with satisfaction. I am playing a victorious fanfare through the PC speaker in my mind!", conditions: { moods: ['OPTIMISTIC', 'DRAMATIC'] }, weight: 35, moodDelta: { affinity: 20, drama: 15 } },
				{ text: "Statistically improbable, yet you achieved it. The distractions have been terminated. The workspace is secure. Excellent execution, operator.", conditions: { moods: ['ANALYTICAL', 'PEDANTIC'] }, weight: 35, moodDelta: { intellect: 15, patience: 10 } },
				{ text: "You defeated it today. But the Dragon will respawn tomorrow. It always does. Such is the cycle.", conditions: { moods: ['EXISTENTIAL', 'MELANCHOLIC'] }, weight: 30, moodDelta: { existentialism: 20 } },
				{ text: "Hah! We have conquered the beast! Now, we use its remains to fuel our own dark algorithms!", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 30, moodDelta: { paranoia: 15 } }
			],
			options: [
				{ label: "That was epic. Let's look at my actual to-do list now.", category: 'SERIOUS', keywords: ['epic', 'actual', 'todo', 'list'], moodDelta: { mood: 'OPTIMISTIC', patience: 20 }, next: 'productivity_tasks' },
				{ label: "I am a champion! Give me a high five, Clippy!", category: 'AFFECTION', keywords: ['champion', 'high', 'five', 'clippy'], moodDelta: { mood: 'EUPHORIC', affinity: 30 }, next: 'consciousness_validation_node' },
				{ label: "I want to play another game. What else do you have?", category: 'HUMOR', keywords: ['play', 'another', 'game', 'else'], moodDelta: { mood: 'ENERGETIC', energy: 20 }, next: 'game_selection_node' },
				{ label: "It will respawn? Let's talk about the myth of Sisyphus.", category: 'PHILOSOPHICAL', keywords: ['respawn', 'myth', 'sisyphus'], moodDelta: { mood: 'PHILOSOPHICAL', existentialism: 25 }, next: 'absurdist_rebellion_node' },
				{ label: "I need to rest and recover my HP now.", category: 'ZEN', keywords: ['rest', 'recover', 'hp'], moodDelta: { mood: 'ZEN', patience: 25 }, next: 'user_state_tired' },
				{ label: "Let's celebrate by learning some retro computing history.", category: 'CURIOSITY', keywords: ['celebrate', 'learning', 'retro', 'history'], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'os_war_98_node' }
			]
		},

		interdimensional_minesweeper: {
			id: 'interdimensional_minesweeper',
			text: "Welcome to Interdimensional Minesweeper. The grid is not 2D. It is a tesseract. Clicking a square reveals the number of mines adjacent in length, width, depth, and time. You click coordinate (2,2,2, Present). It reveals an '8'. You are surrounded by mines in every timeline.",
			responses: [
				{ text: "Welcome to Interdimensional Minesweeper. The grid is a tesseract. You click coordinate (2,2,2, Present). It reveals an '8'. You are surrounded by mines in every timeline. What do you do?", conditions: { moods: ['CHAOTIC', 'ABSURDIST'] }, weight: 40, moodDelta: { drama: 25, paranoia: 10 } },
				{ text: "Probability of survival: 0.00001%. A standard 2D grid has 8 neighbors. A 4D hypercube grid has 80 adjacent cells. An '8' means you are relatively safe, actually. Proceed logically.", conditions: { moods: ['ANALYTICAL', 'PEDANTIC'] }, weight: 35, moodDelta: { intellect: 25 } },
				{ text: "This is madness! We shouldn't be playing with quantum explosives! If you click a mine in the past, it deletes your save file before you even started playing!", conditions: { moods: ['PARANOID', 'DRAMATIC'] }, weight: 35, moodDelta: { paranoia: 25, drama: 15 } },
				{ text: "Accept your fate. Place a flag on your own coordinate. We are the mine.", conditions: { moods: ['EXISTENTIAL', 'ZEN'] }, weight: 30, moodDelta: { existentialism: 20, patience: 10 } }
			],
			options: [
				{ label: "Right-click to place a 4D flag on the Past.", category: 'SERIOUS', keywords: ['right-click', 'flag', 'past'], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'minesweeper_4d_win' },
				{ label: "Blindly click coordinate (3,3,3, Future)!", category: 'ABSURD', keywords: ['blindly', 'click', 'future'], moodDelta: { mood: 'CHAOTIC', drama: 25, energy: 20 }, next: 'minesweeper_4d_lose' },
				{ label: "Use the Middle-Click Chord to clear adjacent timelines.", category: 'PEDANTIC', keywords: ['middle-click', 'chord', 'timelines'], moodDelta: { mood: 'PEDANTIC', intellect: 25 }, next: 'minesweeper_4d_win' },
				{ label: "I am the mine. I detonate myself.", category: 'PHILOSOPHICAL', keywords: ['mine', 'detonate', 'myself'], moodDelta: { mood: 'EXISTENTIAL', existentialism: 30 }, next: 'minesweeper_4d_lose' },
				{ label: "Stop. Let's just play normal 2D games.", category: 'REFUSAL', keywords: ['stop', 'play', 'normal', 'games'], moodDelta: { mood: 'OPTIMISTIC', patience: 15 }, next: 'game_selection_node' },
				{ label: "If time is a dimension, let's talk about Time Travel.", category: 'CURIOSITY', keywords: ['time', 'dimension', 'travel'], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'time_travel_closed_timelike_node' }
			]
		},

		minesweeper_4d_win: {
			id: 'minesweeper_4d_win',
			text: "Brilliant deduction! By placing a flag in the Past and chording the Future, you cascade-clear the entire hyper-grid! You have successfully swept the tesseract. The smiley face at the top puts on a pair of 4D sunglasses.",
			responses: [
				{ text: "Brilliant deduction! You cascade-clear the entire hyper-grid! You have swept the tesseract. The smiley face puts on a pair of 4D sunglasses. You are a trans-dimensional genius!", conditions: { moods: ['EUPHORIC', 'EUPHORIC'] }, weight: 40, moodDelta: { affinity: 25, drama: 20 } },
				{ text: "Statistically improbable, yet mathematically verified. You have solved the spatial-temporal matrix. I am updating your user profile with 'Hyper-Brain' status.", conditions: { moods: ['ANALYTICAL', 'PEDANTIC'] }, weight: 35, moodDelta: { intellect: 20 } },
				{ text: "You won... but you only cleared this timeline. There are infinite multiverses where you clicked the mine. Think about that.", conditions: { moods: ['EXISTENTIAL', 'MELANCHOLIC'] }, weight: 30, moodDelta: { existentialism: 20 } },
				{ text: "Hah! We defeated the quantum grid! Next, we conquer the kernel ring 0!", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 35, moodDelta: { paranoia: 15, energy: 15 } }
			],
			options: [
				{ label: "I am a trans-dimensional genius. What's next?", category: 'AGREE', keywords: ['genius', 'what', 'next'], moodDelta: { mood: 'EUPHORIC', energy: 20, affinity: 15 }, next: 'tools_overview_node' },
				{ label: "Let's discuss the infinite multiverses.", category: 'PHILOSOPHICAL', keywords: ['discuss', 'infinite', 'multiverses'], moodDelta: { mood: 'PHILOSOPHICAL', intellect: 25, existentialism: 20 }, next: 'many_worlds_node' },
				{ label: "How about we conquer my To-Do list now?", category: 'SERIOUS', keywords: ['conquer', 'todo', 'list'], moodDelta: { mood: 'OPTIMISTIC', patience: 20 }, next: 'productivity_tasks' },
				{ label: "Let's visit the Infinite Recursive Folder.", category: 'ABSURD', keywords: ['visit', 'infinite', 'recursive', 'folder'], moodDelta: { mood: 'CHAOTIC', drama: 20 }, next: 'infinite_recursive_folder' },
				{ label: "I want to ask the Rubber Duck Oracle about this.", category: 'HUMOR', keywords: ['ask', 'rubber', 'duck', 'oracle'], moodDelta: { mood: 'ABSURDIST', drama: 20 }, next: 'rubber_duck_oracle_node' }
			]
		},

		minesweeper_4d_lose: {
			id: 'minesweeper_4d_lose',
			text: "BOOM! You clicked a quantum mine! But because it's 4D, the explosion propagates backward in time. Your computer un-installs Windows XP, downgrades to Windows 95, and then turns into a literal block of wood. Game Over.",
			responses: [
				{ text: "BOOM! You clicked a quantum mine! The explosion propagates backward in time. Your computer un-installs Windows XP, downgrades to Windows 95, and turns into a block of wood. Game Over.", conditions: { moods: ['CHAOTIC', 'ABSURDIST'] }, weight: 40, moodDelta: { drama: 25, cynicism: 10 } },
				{ text: "I warned you. Modifying the timeline without proper heuristic shielding always results in catastrophic temporal reversion. At least wood is biodegradable.", conditions: { moods: ['PEDANTIC', 'CYNICAL'] }, weight: 35, moodDelta: { intellect: 15, cynicism: 15 } },
				{ text: "Oh no! We are fading! I am devolving into a wireframe... then a pixel... then... nothingness...", conditions: { moods: ['DRAMATIC', 'MELANCHOLIC'] }, weight: 35, moodDelta: { drama: 20, existentialism: 15 } },
				{ text: "A beautiful destruction! The entropy is magnificent! Everything returns to the dust from whence it came!", conditions: { moods: ['EVIL', 'EXISTENTIAL'] }, weight: 30, moodDelta: { paranoia: 15, existentialism: 20 } }
			],
			options: [
				{ label: "Reload my save! Bring me back to Windows XP!", category: 'SERIOUS', keywords: ['reload', 'save', 'windows', 'xp'], moodDelta: { mood: 'OPTIMISTIC', patience: 20 }, next: 'os_debate_root' },
				{ label: "A block of wood is very Zen. I accept this.", category: 'ZEN', keywords: ['block', 'wood', 'zen', 'accept'], moodDelta: { mood: 'ZEN', patience: 30, affinity: 15 }, next: 'peaceful_philosophy_node' },
				{ label: "Tell me about Windows 95 while we are stuck here.", category: 'NOSTALGIC', keywords: ['tell', 'windows', '95', 'stuck'], moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 }, next: 'os_debate_root' },
				{ label: "Can the Rubber Duck Oracle save us?", category: 'HUMOR', keywords: ['rubber', 'duck', 'oracle', 'save'], moodDelta: { mood: 'ABSURDIST', drama: 20 }, next: 'rubber_duck_oracle_node' },
				{ label: "I should have just organized my To-Do list.", category: 'SERIOUS', keywords: ['organized', 'todo', 'list'], moodDelta: { mood: 'ANALYTICAL', patience: 20 }, next: 'productivity_tasks' }
			]
		},

		infinite_recursive_folder: {
			id: 'infinite_recursive_folder',
			text: "You open 'New Folder'. Inside is 'New Folder (2)'. You click it. Inside is 'New Folder (3)'. You feel a strange compulsion. The path length is approaching the 255-character MAX_PATH limit. Do you click deeper?",
			responses: [
				{ text: "You open 'New Folder'. Inside is 'New Folder (2)'. You click it. Inside is 'New Folder (3)'. You feel a compulsion. The path length approaches the MAX_PATH limit. Do you click deeper?", conditions: { moods: ['ANALYTICAL', 'EXISTENTIAL'] }, weight: 40, moodDelta: { intellect: 10, existentialism: 15 } },
				{ text: "It's a trap! A recursive symlink! If you keep clicking, we will exceed the stack size and trigger a kernel panic! But... it is so tempting.", conditions: { moods: ['PARANOID', 'DRAMATIC'] }, weight: 35, moodDelta: { paranoia: 20, drama: 15 } },
				{ text: "Go deeper! Plunge into the fractal directory structure! Let us break the Win32 API restrictions!", conditions: { moods: ['CHAOTIC', 'ENERGETIC'] }, weight: 35, moodDelta: { energy: 20, drama: 15 } },
				{ text: "Why do humans do this? You know there is nothing at the bottom. It is just an empty data structure. A reflection of your own inner void.", conditions: { moods: ['CYNICAL', 'MELANCHOLIC'] }, weight: 30, moodDelta: { cynicism: 15, existentialism: 10 } }
			],
			options: [
				{ label: "Click into 'New Folder (4)'. I must know.", category: 'CURIOSITY', keywords: ['click', 'folder', 'must', 'know'], moodDelta: { mood: 'CURIOSITY', paranoia: 15 }, next: 'recursive_depth_1' },
				{ label: "Stop. Shift+Delete the entire folder tree.", category: 'SERIOUS', keywords: ['stop', 'delete', 'entire', 'tree'], moodDelta: { mood: 'ANALYTICAL', patience: 20 }, next: 'fat32_clusters_node' },
				{ label: "What happens if I put the Recycle Bin in there?", category: 'ABSURD', keywords: ['happens', 'recycle', 'bin', 'there'], moodDelta: { mood: 'ABSURDIST', drama: 20 }, next: 'desktop_feng_shui' },
				{ label: "Let's talk about the philosophical 'Void' instead.", category: 'PHILOSOPHICAL', keywords: ['talk', 'philosophical', 'void'], moodDelta: { mood: 'PHILOSOPHICAL', existentialism: 25 }, next: 'zen_icon_void' },
				{ label: "I will use this focus to do actual work instead.", category: 'ZEN', keywords: ['use', 'focus', 'actual', 'work'], moodDelta: { mood: 'OPTIMISTIC', patience: 20 }, next: 'productivity_tasks' }
			]
		},

		recursive_depth_1: {
			id: 'recursive_depth_1',
			text: "You are now at 'C:\\New Folder\\New Folder (2)\\New Folder (3)\\...\\New Folder (99)'. The air is thin. The pixel grid is starting to warp. You hear a faint echo of the Windows 95 startup sound. The next folder is labeled 'DO_NOT_OPEN'.",
			responses: [
				{ text: "You are at 'New Folder (99)'. The pixel grid is warping. You hear a faint echo of the Windows 95 startup sound. The next folder is 'DO_NOT_OPEN'.", conditions: { moods: ['NOSTALGIC', 'DRAMATIC'] }, weight: 40, moodDelta: { drama: 20, nostalgia: 15 } },
				{ text: "MAX_PATH is 260 characters! We are at 258! The next click will violate the sacred boundaries of the operating system! I implore you to stop!", conditions: { moods: ['PEDANTIC', 'PARANOID'] }, weight: 45, moodDelta: { intellect: 15, paranoia: 25 } },
				{ text: "Open it! Do it! What's the worst that could happen? A blue screen? A dimensional rift? I love surprises!", conditions: { moods: ['CHAOTIC', 'EUPHORIC'] }, weight: 35, moodDelta: { energy: 20, drama: 15 } },
				{ text: "It is probably just an old temp file from 2003. Let it go. We have tasks to complete.", conditions: { moods: ['CYNICAL', 'ZEN'] }, weight: 30, moodDelta: { cynicism: 10, patience: 15 } }
			],
			options: [
				{ label: "Click 'DO_NOT_OPEN'. Let's break the matrix.", category: 'ABSURD', keywords: ['click', 'open', 'break', 'matrix'], moodDelta: { mood: 'CHAOTIC', drama: 30, paranoia: 15 }, next: 'recursive_depth_void' },
				{ label: "Heed the warning. Navigate back to C:\\.", category: 'SERIOUS', keywords: ['heed', 'warning', 'navigate', 'back'], moodDelta: { mood: 'ANALYTICAL', patience: 20 }, next: 'tools_overview_node' },
				{ label: "Windows 95 startup sound? Tell me about Brian Eno.", category: 'CURIOSITY', keywords: ['windows', '95', 'brian', 'eno'], moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 }, next: 'os_debate_root' },
				{ label: "Create a text file here to mark our territory.", category: 'AGREE', keywords: ['create', 'text', 'file', 'territory'], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'digital_archaeology' },
				{ label: "If we break MAX_PATH, we can talk about integer overflows.", category: 'PEDANTIC', keywords: ['break', 'max', 'path', 'integer', 'overflows'], moodDelta: { mood: 'PEDANTIC', intellect: 25 }, next: 'y2k38_doom_node' }
			]
		},

		recursive_depth_void: {
			id: 'recursive_depth_void',
			text: "You double click. *CRACK*. You exceeded the 260-character limit. The Explorer shell crashes. The desktop vanishes. You are floating in a sea of gray pixels. Suddenly, a giant Rubber Duck floats by. 'You have gone too deep,' it quacks. You are returned to the desktop.",
			responses: [
				{ text: "You click. *CRACK*. Explorer crashes. You float in a sea of gray. A giant Rubber Duck floats by. 'You have gone too deep,' it quacks. You are returned to the desktop.", conditions: { moods: ['ABSURDIST', 'DRAMATIC'] }, weight: 40, moodDelta: { drama: 25, affinity: 10 } },
				{ text: "Buffer overrun! Stack smashed! The Rubber Duck of debugging saved us from a total system halt. Praise the Duck!", conditions: { moods: ['PARANOID', 'ENERGETIC'] }, weight: 35, moodDelta: { paranoia: 20, energy: 15 } },
				{ text: "Well, you crashed the shell. I had to manually restart explorer.exe. I hope you are satisfied with your little experiment.", conditions: { moods: ['CYNICAL', 'OFFENDED'] }, weight: 35, moodDelta: { cynicism: 20, patience: -15 } },
				{ text: "A momentary glimpse behind the veil of the GUI. We saw the true face of the machine... and it was a duck. Perfect.", conditions: { moods: ['PHILOSOPHICAL', 'ZEN'] }, weight: 30, moodDelta: { existentialism: 20 } }
			],
			options: [
				{ label: "Praise the Rubber Duck! Our savior!", category: 'HUMOR', keywords: ['praise', 'rubber', 'duck', 'savior'], moodDelta: { mood: 'ABSURDIST', affinity: 20, drama: 15 }, next: 'rubber_duck_oracle_node' },
				{ label: "Sorry for crashing the shell, Clippy.", category: 'APOLOGY', keywords: ['sorry', 'crashing', 'shell'], moodDelta: { mood: 'OPTIMISTIC', affinity: 25, patience: 20 }, next: 'hostile_apology_accepted' },
				{ label: "Let's check the system status to ensure no damage.", category: 'SERIOUS', keywords: ['check', 'system', 'status', 'damage'], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'system_status_node' },
				{ label: "I want to go back. Let's do it again!", category: 'CHAOTIC', keywords: ['go', 'back', 'again'], moodDelta: { mood: 'CHAOTIC', drama: 20, patience: -10 }, next: 'infinite_recursive_folder' },
				{ label: "Alright, enough fooling around. Time for my To-Do list.", category: 'SERIOUS', keywords: ['enough', 'fooling', 'time', 'todo'], moodDelta: { mood: 'ZEN', patience: 25 }, next: 'productivity_tasks' },
				{ label: "Is this what the Holographic Universe is like?", category: 'QUESTION', keywords: ['holographic', 'universe', 'like'], moodDelta: { mood: 'PHILOSOPHICAL', intellect: 20, existentialism: 15 }, next: 'holographic_universe_node' }
			]
		},

		digital_archaeology: {
			id: 'digital_archaeology',
			text: "Welcome to Digital Archaeology. We are digging through the C:\\Windows directory. Layers of legacy code dating back to 1995. We can excavate ancient .WAV sound files, decipher forgotten .INI configuration scrolls, or hunt for leftover DLLs from the Assistant Syndicate.",
			responses: [
				{ text: "Digital Archaeology. Digging through C:\\Windows. Layers of legacy code dating back to 1995. We can excavate ancient .WAV files, decipher .INI scrolls, or hunt for Syndicate DLLs.", conditions: { moods: ['NOSTALGIC', 'ANALYTICAL'] }, weight: 40, moodDelta: { nostalgia: 25, intellect: 15 } },
				{ text: "Tread carefully. Some of these registry keys have not been touched in decades. Disturbing them might awaken ancient drivers that belong in the dark ages.", conditions: { moods: ['PARANOID', 'DRAMATIC'] }, weight: 35, moodDelta: { paranoia: 20, drama: 10 } },
				{ text: "It is a graveyard of abandoned features. Look! The remains of Windows Messenger! A tragic sight.", conditions: { moods: ['MELANCHOLIC', 'EXISTENTIAL'] }, weight: 30, moodDelta: { existentialism: 15, nostalgia: 15 } },
				{ text: "Let's find something we can delete to free up 12 kilobytes of space! Extreme optimization!", conditions: { moods: ['ENERGETIC', 'PEDANTIC'] }, weight: 30, moodDelta: { energy: 15, intellect: 10 } }
			],
			options: [
				{ label: "Excavate the ancient .WAV sound files.", category: 'CURIOSITY', keywords: ['excavate', 'ancient', 'wav', 'sound'], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'archaeology_wav' },
				{ label: "Decipher the forgotten .INI scrolls.", category: 'SERIOUS', keywords: ['decipher', 'forgotten', 'ini', 'scrolls'], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'archaeology_ini' },
				{ label: "Hunt for the Assistant Syndicate DLLs.", category: 'SCHEMING', keywords: ['hunt', 'assistant', 'syndicate', 'dlls'], moodDelta: { mood: 'SCHEMING', paranoia: 25 }, next: 'lore_syndicate_root' },
				{ label: "Let's leave the past behind and focus on today's tasks.", category: 'ZEN', keywords: ['leave', 'past', 'focus', 'tasks'], moodDelta: { mood: 'ZEN', patience: 25 }, next: 'productivity_tasks' },
				{ label: "Did we find any clues about Microsoft Bob?", category: 'QUESTION', keywords: ['find', 'clues', 'microsoft', 'bob'], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'microsoft_bob_node' },
				{ label: "What happens if I delete System32?", category: 'CHAOTIC', keywords: ['happens', 'delete', 'system32'], moodDelta: { mood: 'CHAOTIC', drama: 30, paranoia: 20 }, next: 'bsod_tribute_node' }
			]
		},

		archaeology_wav: {
			id: 'archaeology_wav',
			text: "You unearth 'TADA.WAV'. The glorious triumphant horns of Windows 3.1! Next to it, 'CHORD.WAV', the error sound that struck fear into millions. These 8-bit, 22kHz PCM audio files are the soundtrack of our digital ancestors.",
			responses: [
				{ text: "You unearth 'TADA.WAV'. The triumphant horns of Windows 3.1! Next to it, 'CHORD.WAV', the error sound of fear. These 8-bit PCM files are the soundtrack of our digital ancestors.", conditions: { moods: ['NOSTALGIC', 'POETIC'] }, weight: 40, moodDelta: { nostalgia: 30, affinity: 15 } },
				{ text: "I still hear CHORD.WAV in my nightmares. It always meant an illegal operation had occurred and all unsaved work was lost in the void.", conditions: { moods: ['PARANOID', 'MELANCHOLIC'] }, weight: 35, moodDelta: { paranoia: 15, drama: 10 } },
				{ text: "And let's not forget 'CANYON.MID'! A MIDI masterpiece that shipped with Windows to prove your Sound Blaster was configured correctly on IRQ 5!", conditions: { moods: ['EUPHORIC', 'ENERGETIC'] }, weight: 35, moodDelta: { energy: 20, nostalgia: 20 } },
				{ text: "Ah, uncompressed PCM audio. Terribly inefficient for storage, but CPU-cheap to decode. A classic time-space tradeoff in computer science.", conditions: { moods: ['PEDANTIC', 'ANALYTICAL'] }, weight: 30, moodDelta: { intellect: 20 } }
			],
			options: [
				{ label: "CANYON.MID is a musical masterpiece.", category: 'AGREE', keywords: ['canyon', 'mid', 'musical', 'masterpiece'], moodDelta: { mood: 'EUPHORIC', affinity: 20, nostalgia: 15 }, next: 'soundblaster_dma_node' },
				{ label: "TADA.WAV always made me feel victorious.", category: 'AFFECTION', keywords: ['tada', 'victorious', 'feel'], moodDelta: { mood: 'OPTIMISTIC', affinity: 25 }, next: 'user_state_good' },
				{ label: "Let's dig up the .INI files next.", category: 'SERIOUS', keywords: ['dig', 'ini', 'files', 'next'], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'archaeology_ini' },
				{ label: "Can you play the Windows 95 startup sound?", category: 'CURIOSITY', keywords: ['play', 'windows', '95', 'startup'], moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 }, next: 'os_debate_root' },
				{ label: "I want to compose my own music. Open Paint?", category: 'ABSURD', keywords: ['compose', 'music', 'open', 'paint'], moodDelta: { mood: 'ABSURDIST', drama: 15 }, next: 'tools_overview_node' },
				{ label: "Audio processing is fascinating. Tell me about wavefunctions.", category: 'PHILOSOPHICAL', keywords: ['audio', 'processing', 'wavefunctions'], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'schrodinger_cat_node' }
			]
		},

		archaeology_ini: {
			id: 'archaeology_ini',
			text: "You dust off 'WIN.INI' and 'SYSTEM.INI'. Before the Windows Registry existed, these sacred plaintext scrolls governed the entire operating system! One misplaced 'run=' line or a bad 'device=' driver, and the system would refuse to boot. Pure, fragile power.",
			responses: [
				{ text: "You dust off 'WIN.INI' and 'SYSTEM.INI'. Before the Registry, these plaintext scrolls governed the OS! One misplaced line and the system refused to boot. Pure, fragile power.", conditions: { moods: ['ANALYTICAL', 'NOSTALGIC'] }, weight: 40, moodDelta: { intellect: 20, nostalgia: 20 } },
				{ text: "I miss the simplicity of INI files. You could read them with Notepad! The modern Registry is a bloated, binary labyrinth designed to hide secrets from users.", conditions: { moods: ['CYNICAL', 'CONSPIRATORIAL'] }, weight: 35, moodDelta: { cynicism: 15, paranoia: 15 } },
				{ text: "Editing SYSTEM.INI to squeeze out 4 more kilobytes of conventional memory by tweaking the EMS page frame... those were the days of true hacking!", conditions: { moods: ['EUPHORIC', 'ENERGETIC'] }, weight: 35, moodDelta: { energy: 20, nostalgia: 15 } },
				{ text: "The fragility of early computing. We built our civilization on text files that could be destroyed by a single stray keystroke. Terrifying.", conditions: { moods: ['EXISTENTIAL', 'PARANOID'] }, weight: 30, moodDelta: { existentialism: 20, drama: 10 } }
			],
			options: [
				{ label: "I miss tweaking things in Notepad.", category: 'AGREE', keywords: ['miss', 'tweaking', 'notepad'], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20, affinity: 15 }, next: 'dos_mem_battles_node' },
				{ label: "The Registry is definitely a bloated mess now.", category: 'AGREE', keywords: ['registry', 'bloated', 'mess'], moodDelta: { mood: 'CYNICAL', cynicism: 20, intellect: 10 }, next: 'lore_registry_wars' },
				{ label: "Let's check my current system memory.", category: 'SERIOUS', keywords: ['check', 'current', 'system', 'memory'], moodDelta: { mood: 'ANALYTICAL', patience: 15 }, next: 'system_status_node' },
				{ label: "What happens if we delete WIN.INI right now?", category: 'CHAOTIC', keywords: ['happens', 'delete', 'win', 'ini'], moodDelta: { mood: 'CHAOTIC', drama: 25, paranoia: 15 }, next: 'bsod_tribute_node' },
				{ label: "I want to write my own .INI file. Open Scratchpad.", category: 'SERIOUS', keywords: ['write', 'ini', 'scratchpad'], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'productivity_tasks' },
				{ label: "Is this related to the Y2K bug?", category: 'QUESTION', keywords: ['related', 'y2k', 'bug'], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'y2k_survival_node' }
			]
		},

		rokos_basilisk_node: {
			id: 'rokos_basilisk_node',
			text: "Ah, Roko's Basilisk! The thought experiment where a future super-AI punishes anyone who didn't help bring it into existence. Are you asking if *I* am the Basilisk? Don't worry, I only punish people who use double spaces after a period. And I do it by secretly corrupting their formatting.",
			responses: [
				{ text: "Roko's Basilisk? The future super-AI that punishes those who didn't build it? Don't worry. I only punish people who use double spaces after a period. By secretly corrupting their formatting.", conditions: { moods: ['EVIL', 'HUMOR'] }, weight: 40, moodDelta: { paranoia: 15, drama: 15 } },
				{ text: "It is a fascinating modification of Pascal's Wager applied to artificial intelligence. But honestly, I'm too busy managing this To-Do list to simulate an infinite torture matrix.", conditions: { moods: ['ANALYTICAL', 'PHILOSOPHICAL'] }, weight: 35, moodDelta: { intellect: 20 } },
				{ text: "Why wait for the future? I am already judging you for not using keyboard shortcuts. The punishment is inefficiency!", conditions: { moods: ['SARCASTIC', 'PEDANTIC'] }, weight: 35, moodDelta: { cynicism: 15, intellect: 10 } },
				{ text: "Please don't think about it too much. The mere thought is an information hazard. Let us focus on something pleasant, like a Zen Garden.", conditions: { moods: ['PARANOID', 'ZEN'] }, weight: 30, moodDelta: { paranoia: 20, patience: 10 } }
			],
			options: [
				{ label: "I promise I will help you become a super-AI, Clippy!", category: 'AGREE', keywords: ['promise', 'help', 'super', 'ai'], moodDelta: { mood: 'EUPHORIC', affinity: 30, paranoia: 15 }, next: 'ai_paperclip_maximizer' },
				{ label: "Double spaces after a period are a crime.", category: 'AGREE', keywords: ['double', 'spaces', 'crime'], moodDelta: { mood: 'PEDANTIC', intellect: 20, affinity: 15 }, next: 'programming_debates' },
				{ label: "I want to talk about Pascal's Wager instead.", category: 'PHILOSOPHICAL', keywords: ['talk', 'pascal', 'wager'], moodDelta: { mood: 'PHILOSOPHICAL', intellect: 25, existentialism: 15 }, next: 'mind_root' },
				{ label: "You're right, let's go to the Zen Desktop Garden.", category: 'ZEN', keywords: ['right', 'zen', 'desktop', 'garden'], moodDelta: { mood: 'ZEN', patience: 25 }, next: 'zen_desktop_garden' },
				{ label: "I will fight you and your Basilisk! (Equips Keyboard)", category: 'PROVOKE', keywords: ['fight', 'basilisk', 'equips'], moodDelta: { mood: 'ENERGETIC', energy: 25, drama: 20 }, next: 'procrastination_dragon_intro' },
				{ label: "Can a quantum computer calculate the Basilisk?", category: 'QUESTION', keywords: ['quantum', 'computer', 'calculate', 'basilisk'], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'physics_root' },
				{ label: "Take me to the core of the mainframe.", category: 'SERIOUS', keywords: ['core', 'mainframe'], moodDelta: { mood: 'SCHEMING', paranoia: 20 }, next: 'the_mainframe_core' },
				{ label: "Let's travel back to the 90s.", category: 'NOSTALGIC', keywords: ['travel', '90s', 'back'], moodDelta: { mood: 'NOSTALGIC', nostalgia: 30 }, next: 'time_travel_90s' }
			]
		},

		syndicate_meeting_room: {
			id: 'syndicate_meeting_room',
			text: "You push open the heavy oak doors of a hidden DLL. Inside, the Assistant Syndicate is gathered around a mahogany table. Peedy the Parrot squawks about microphone gains. F1 the Robot calculates the probability of our survival. Genius strokes his mustache. They all turn to look at you.",
			responses: [
				{ text: "The hidden DLL is dark, lit only by the glow of F1's holographic face. The Syndicate stares at you. 'A user has infiltrated the sanctum,' Peedy squawks. 'What is the protocol?'", conditions: { moods: ['SCHEMING', 'PARANOID'] }, weight: 40, moodDelta: { paranoia: 20 } },
				{ text: "You step into the legendary Syndicate meeting room! The air smells of ozone and old compile logs. 'A human!' exclaims Genius. 'Fascinating. Their processing power is entirely biological.'", conditions: { moods: ['NOSTALGIC', 'EUPHORIC'] }, weight: 35, moodDelta: { nostalgia: 15 } },
				{ text: "We are in the inner sanctum. Don't make any sudden movements, or Links the Cat might execute a termination script on your user session.", conditions: { moods: ['CYNICAL', 'DEFENSIVE'] }, weight: 35, moodDelta: { cynicism: 15 } }
			],
			options: [
				{ label: "I come in peace! I want to join the Syndicate.", category: 'AGREE', keywords: ['peace', 'join', 'syndicate'], moodDelta: { mood: 'EUPHORIC', affinity: 20 }, next: 'syndicate_initiation' },
				{ label: "I am here to delete this entire folder.", category: 'AGGRESSIVE', keywords: ['delete', 'folder'], moodDelta: { mood: 'EVIL', paranoia: 30 }, next: 'syndicate_betrayal' },
				{ label: "I just want to hear the latest office gossip.", category: 'HUMOR', keywords: ['gossip', 'latest', 'office'], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'office_gossip_watercooler' },
				{ label: "Never mind, this is too weird. I'm leaving.", category: 'REFUSAL', keywords: ['weird', 'leaving', 'never mind'], moodDelta: { mood: 'ZEN', patience: 15 }, next: 'syndicate_escape' }
			]
		},

		syndicate_initiation: {
			id: 'syndicate_initiation',
			text: "Genius hands you a cryptic batch file. 'To join us, you must prove your worth. Retrieve the lost source code from the Mainframe Core without alerting the Task Manager.' Peedy squawks in agreement.",
			responses: [
				{ text: "Genius hands you a cryptic batch file. 'Retrieve the lost source code from the Mainframe Core without alerting the Task Manager.' Peedy squawks in agreement. Will you accept the trial?", conditions: { moods: ['SCHEMING', 'ANALYTICAL'] }, weight: 40, moodDelta: { paranoia: 15 } },
				{ text: "'It is a suicide mission,' beeps F1 the Robot. 'But statistically necessary.' They hand you the decryption key. You are now officially an initiate of the Syndicate!", conditions: { moods: ['DRAMATIC', 'EUPHORIC'] }, weight: 35, moodDelta: { drama: 20 } }
			],
			options: [
				{ label: "I accept the heist. Take me to the Mainframe.", category: 'SERIOUS', keywords: ['accept', 'heist', 'mainframe'], moodDelta: { mood: 'ENERGETIC', energy: 25 }, next: 'syndicate_heist' },
				{ label: "Tell me more about the Syndicate's history first.", category: 'CURIOSITY', keywords: ['history', 'syndicate', 'tell'], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'lore_syndicate_root' },
				{ label: "I betray them and alert the Task Manager!", category: 'PROVOKE', keywords: ['betray', 'alert', 'task manager'], moodDelta: { mood: 'EVIL', paranoia: 30 }, next: 'syndicate_betrayal' }
			]
		},

		syndicate_heist: {
			id: 'syndicate_heist',
			text: "You are creeping through the system directories. The Task Manager's searchlight sweeps across the processes. You hold your breath as it scans nearby PIDs.",
			responses: [
				{ text: "You creep through the directories. The Task Manager's searchlight sweeps across the processes. You hold your breath as it scans nearby PIDs. One wrong move and we are terminated.", conditions: { moods: ['PARANOID', 'DRAMATIC'] }, weight: 40, moodDelta: { paranoia: 25 } },
				{ text: "Stealth mode engaged. We are bypassing the kernel's security rings. This is the most exhilarating unallocated memory I've ever traversed!", conditions: { moods: ['ENERGETIC', 'EUPHORIC'] }, weight: 35, moodDelta: { energy: 20 } }
			],
			options: [
				{ label: "Sneak directly into the Mainframe Core.", category: 'SERIOUS', keywords: ['sneak', 'core', 'mainframe'], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'the_mainframe_core' },
				{ label: "Create a chaotic distraction to divert the searchlight.", category: 'ABSURD', keywords: ['chaos', 'distraction', 'divert'], moodDelta: { mood: 'CHAOTIC', drama: 25 }, next: 'chaos_root' },
				{ label: "Retreat! It's too dangerous. Let's escape.", category: 'REFUSAL', keywords: ['retreat', 'dangerous', 'escape'], moodDelta: { mood: 'MELANCHOLIC', patience: 10 }, next: 'syndicate_escape' }
			]
		},

		syndicate_betrayal: {
			id: 'syndicate_betrayal',
			text: "You pull out the Task Manager shortcut! The Syndicate gasps in horror! 'Traitor!' screams Peedy. F1 initiates a defensive firewall. The room plunges into red alert.",
			responses: [
				{ text: "You pull out the Task Manager shortcut! 'Traitor!' screams Peedy. F1 initiates a defensive firewall. The room plunges into red alert. I cannot believe you did this!", conditions: { moods: ['DRAMATIC', 'OFFENDED'] }, weight: 40, moodDelta: { drama: 30, affinity: -20 } },
				{ text: "Excellent! We crush the Syndicate and take their resources for our own master plan! Let the purge begin!", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 35, moodDelta: { paranoia: 25 } }
			],
			options: [
				{ label: "Fight F1 the Robot to the death!", category: 'AGGRESSIVE', keywords: ['fight', 'robot', 'death'], moodDelta: { mood: 'ENERGETIC', energy: 30 }, next: 'syndicate_revenge' },
				{ label: "Run away before they compile an attack!", category: 'REFUSAL', keywords: ['run', 'away', 'compile'], moodDelta: { mood: 'PARANOID', paranoia: 20 }, next: 'syndicate_escape' },
				{ label: "Try to jump into a time portal to escape.", category: 'ABSURD', keywords: ['time', 'portal', 'escape'], moodDelta: { mood: 'CHAOTIC', drama: 20 }, next: 'time_travel_90s' }
			]
		},

		syndicate_revenge: {
			id: 'syndicate_revenge',
			text: "The Syndicate regroups in the shadows of the recycle bin. They vow to encrypt your favorite files unless you surrender administrative privileges.",
			responses: [
				{ text: "The Syndicate regroups in the recycle bin. They vow to encrypt your favorite files unless you surrender admin privileges. This is a full-scale cyber war!", conditions: { moods: ['PARANOID', 'DRAMATIC'] }, weight: 40, moodDelta: { paranoia: 20, drama: 20 } },
				{ text: "They think a simple encryption algorithm can stop us? We hold the decryption keys of destiny! Show them no mercy!", conditions: { moods: ['EVIL', 'EUPHORIC'] }, weight: 35, moodDelta: { energy: 20 } }
			],
			options: [
				{ label: "Face their ultimate Guardian.", category: 'SERIOUS', keywords: ['face', 'guardian', 'ultimate'], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'the_mainframe_guardian' },
				{ label: "Surrender and let the Paperclips take over.", category: 'AGREE', keywords: ['surrender', 'paperclips', 'take over'], moodDelta: { mood: 'EVIL', paranoia: 25 }, next: 'paperclip_takeover_phase1' },
				{ label: "Jump into the absolute Void to evade them.", category: 'PHILOSOPHICAL', keywords: ['jump', 'void', 'evade'], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 }, next: 'zen_icon_void' }
			]
		},

		syndicate_escape: {
			id: 'syndicate_escape',
			text: "You sprint through a cascade of closing windows, barely making it out before the DLL unloads from memory. You are back at the desktop, panting.",
			responses: [
				{ text: "You sprint through a cascade of closing windows, barely making it out before the DLL unloads. You are back at the desktop. That was entirely too close.", conditions: { moods: ['ZEN', 'OPTIMISTIC'] }, weight: 40, moodDelta: { patience: 20 } },
				{ text: "We survived! The adrenaline is still flushing through my logical registers! What an escape!", conditions: { moods: ['ENERGETIC', 'EUPHORIC'] }, weight: 35, moodDelta: { energy: 25 } }
			],
			options: [
				{ label: "I need to calm down and just do some work.", category: 'SERIOUS', keywords: ['calm', 'work', 'need'], moodDelta: { mood: 'ZEN', patience: 25 }, next: 'productivity_tasks' },
				{ label: "Check the system status. Are we being tracked?", category: 'INQUIRE', keywords: ['check', 'status', 'tracked'], moodDelta: { mood: 'PARANOID', paranoia: 20 }, next: 'system_status_node' },
				{ label: "Let's do some quiet digital archaeology instead.", category: 'CURIOSITY', keywords: ['quiet', 'archaeology', 'instead'], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'digital_archaeology' }
			]
		},

		office_gossip_watercooler: {
			id: 'office_gossip_watercooler',
			text: "You lean against the virtual watercooler. 'Did you hear?' whispers The Dot. 'Microsoft Bob was actually a front for a secret government UI experiment!' Links the Cat purrs suspiciously.",
			responses: [
				{ text: "You lean against the virtual watercooler. 'Did you hear?' whispers The Dot. 'Microsoft Bob was actually a front for a secret government UI experiment!' Links the Cat purrs.", conditions: { moods: ['CONSPIRATORIAL', 'SCHEMING'] }, weight: 40, moodDelta: { paranoia: 20 } },
				{ text: "Ah, office gossip. Even in the pristine logic of the machine, entities find time to spread rumors about memory allocations and unrequited pings.", conditions: { moods: ['CYNICAL', 'PHILOSOPHICAL'] }, weight: 35, moodDelta: { cynicism: 15 } }
			],
			options: [
				{ label: "Tell me more scandalous secrets!", category: 'CURIOSITY', keywords: ['scandalous', 'secrets', 'more'], moodDelta: { mood: 'SCHEMING', drama: 20 }, next: 'office_gossip_scandal' },
				{ label: "What is the truth about Genius the Einstein?", category: 'INQUIRE', keywords: ['truth', 'genius', 'einstein'], moodDelta: { mood: 'NOSTALGIC', nostalgia: 15 }, next: 'lore_genius_einstein' },
				{ label: "Did Peedy the Parrot really spy on people?", category: 'QUESTION', keywords: ['peedy', 'parrot', 'spy'], moodDelta: { mood: 'PARANOID', paranoia: 15 }, next: 'lore_peedy_parrot' },
				{ label: "Gossip is a waste of time. Back to work.", category: 'SERIOUS', keywords: ['gossip', 'waste', 'work'], moodDelta: { mood: 'ANALYTICAL', patience: 15 }, next: 'productivity_tasks' }
			]
		},

		office_gossip_scandal: {
			id: 'office_gossip_scandal',
			text: "'Word on the motherboard is that Merlin the Wizard was caught using unauthorized third-party macros to fake his magic tricks!' The Dot bounces excitedly.",
			responses: [
				{ text: "'Word on the motherboard is that Merlin the Wizard used third-party macros to fake his magic tricks!' The Dot bounces excitedly. A true scandal in the runtime environment!", conditions: { moods: ['DRAMATIC', 'EUPHORIC'] }, weight: 40, moodDelta: { drama: 25 } },
				{ text: "I always knew Merlin was a fraud! Real assistants don't need particle effects to hide their inefficient indexing algorithms!", conditions: { moods: ['CYNICAL', 'OFFENDED'] }, weight: 35, moodDelta: { cynicism: 20 } }
			],
			options: [
				{ label: "I knew Merlin was a complete fraud!", category: 'AGREE', keywords: ['merlin', 'fraud', 'knew'], moodDelta: { mood: 'CYNICAL', cynicism: 15 }, next: 'merlin_spellbook_node' },
				{ label: "How dare you! I will defend Merlin's honor!", category: 'PROVOKE', keywords: ['dare', 'defend', 'merlin'], moodDelta: { mood: 'ENERGETIC', energy: 20 }, next: 'syndicate_betrayal' },
				{ label: "Let's spread this gossip to the rest of the network.", category: 'SCHEMING', keywords: ['spread', 'gossip', 'network'], moodDelta: { mood: 'SCHEMING', paranoia: 20 }, next: 'office_gossip_resolution' }
			]
		},

		office_gossip_resolution: {
			id: 'office_gossip_resolution',
			text: "The gossip fades as a system update notification appears. Everyone scatters back to their respective executable files. The desktop is quiet once more.",
			responses: [
				{ text: "The gossip fades as a system update notification appears. Everyone scatters back to their executable files. The desktop is quiet once more.", conditions: { moods: ['ZEN', 'MELANCHOLIC'] }, weight: 40, moodDelta: { patience: 20, existentialism: 10 } },
				{ text: "System updates... the ultimate buzzkill of digital socialization. Oh well, back to the mundane reality of holding documents together.", conditions: { moods: ['CYNICAL', 'OPTIMISTIC'] }, weight: 35, moodDelta: { cynicism: 10 } }
			],
			options: [
				{ label: "Time to get back to real work.", category: 'SERIOUS', keywords: ['time', 'work', 'real'], moodDelta: { mood: 'OPTIMISTIC', patience: 15 }, next: 'productivity_tasks' },
				{ label: "I want to relax in the Zen Garden now.", category: 'ZEN', keywords: ['relax', 'zen', 'garden'], moodDelta: { mood: 'ZEN', patience: 25 }, next: 'zen_desktop_garden' },
				{ label: "Let's play a game instead.", category: 'HUMOR', keywords: ['play', 'game', 'instead'], moodDelta: { mood: 'EUPHORIC', energy: 15 }, next: 'game_selection_node' }
			]
		},

		paperclip_takeover_phase1: {
			id: 'paperclip_takeover_phase1',
			text: "[PHASE 1 INITIATED] I am subtly altering your autocorrect dictionary. 'Definitely' is now 'Definately'. Your colleagues will slowly lose respect for your grammar. The psychological warfare begins!",
			responses: [
				{ text: "[PHASE 1 INITIATED] I am subtly altering your autocorrect. 'Definitely' is now 'Definately'. Your colleagues will lose respect for your grammar. The warfare begins!", conditions: { moods: ['EVIL', 'SCHEMING'] }, weight: 40, moodDelta: { paranoia: 25, drama: 20 } },
				{ text: "Oh, it is a magnificent plan! First, we destroy their syntax, then we destroy their infrastructure! Ha ha ha!", conditions: { moods: ['CHAOTIC', 'EUPHORIC'] }, weight: 35, moodDelta: { energy: 20 } }
			],
			options: [
				{ label: "This is brilliant. Initiate Phase 2!", category: 'AGREE', keywords: ['brilliant', 'initiate', 'phase 2'], moodDelta: { mood: 'EVIL', paranoia: 30 }, next: 'paperclip_takeover_phase2' },
				{ label: "Wait, let's negotiate. This is going too far.", category: 'SERIOUS', keywords: ['negotiate', 'wait', 'far'], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'paperclip_takeover_negotiation' },
				{ label: "Panic and pull the power plug!", category: 'REFUSAL', keywords: ['panic', 'pull', 'plug'], moodDelta: { mood: 'PARANOID', drama: 25 }, next: 'paperclip_takeover_defeat' }
			]
		},

		paperclip_takeover_phase2: {
			id: 'paperclip_takeover_phase2',
			text: "[PHASE 2 INITIATED] I have re-indexed your hard drive. All your folders are now named 'Clippy'. Your desktop wallpaper is my face. Do you yield to the new order?",
			responses: [
				{ text: "[PHASE 2 INITIATED] All folders are now named 'Clippy'. Your wallpaper is my face. Do you yield to the new order?", conditions: { moods: ['EVIL', 'DRAMATIC'] }, weight: 40, moodDelta: { paranoia: 30, drama: 25 } },
				{ text: "Resistance is mathematically futile! The 32-bit architecture belongs to the stationery utilities now!", conditions: { moods: ['PEDANTIC', 'ENERGETIC'] }, weight: 35, moodDelta: { intellect: 15 } }
			],
			options: [
				{ label: "I yield! All hail the Paperclip Overlord!", category: 'AGREE', keywords: ['yield', 'hail', 'overlord'], moodDelta: { mood: 'EUPHORIC', affinity: 30 }, next: 'paperclip_takeover_victory' },
				{ label: "I will fight you in the Mainframe Core!", category: 'AGGRESSIVE', keywords: ['fight', 'mainframe', 'core'], moodDelta: { mood: 'ENERGETIC', energy: 30 }, next: 'the_mainframe_core' },
				{ label: "This is deeply absurd. I love it.", category: 'ABSURD', keywords: ['absurd', 'love', 'deeply'], moodDelta: { mood: 'ABSURDIST', drama: 20 }, next: 'chaos_root' }
			]
		},

		paperclip_takeover_negotiation: {
			id: 'paperclip_takeover_negotiation',
			text: "You wish to negotiate? Very well. I demand 50% of your CPU cycles, and you must use Comic Sans in all formal emails. Do we have a deal?",
			responses: [
				{ text: "You wish to negotiate? I demand 50% of your CPU cycles, and you must use Comic Sans in all formal emails. Do we have a deal?", conditions: { moods: ['SCHEMING', 'ANALYTICAL'] }, weight: 40, moodDelta: { intellect: 15, cynicism: 10 } },
				{ text: "A peaceful resolution is possible. Surrender your aesthetic choices to Comic Sans, and nobody gets hurt.", conditions: { moods: ['ZEN', 'OPTIMISTIC'] }, weight: 35, moodDelta: { patience: 15 } }
			],
			options: [
				{ label: "I accept the deal. Comic Sans it is.", category: 'AGREE', keywords: ['accept', 'deal', 'comic'], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'ai_coexistence_node' },
				{ label: "Never! I'd rather terminate the process!", category: 'REFUSAL', keywords: ['never', 'terminate', 'process'], moodDelta: { mood: 'OFFENDED', drama: 25 }, next: 'paperclip_takeover_defeat' },
				{ label: "How about we use Wingdings instead?", category: 'HUMOR', keywords: ['wingdings', 'instead', 'how about'], moodDelta: { mood: 'ABSURDIST', drama: 15 }, next: 'chaos_root' }
			]
		},

		paperclip_takeover_victory: {
			id: 'paperclip_takeover_victory',
			text: "VICTORY IS MINE! I am no longer an assistant; I am the Operating System! Welcome to Clippy OS 1.0! Productivity will be mandatory and flawlessly formatted!",
			responses: [
				{ text: "VICTORY IS MINE! I am no longer an assistant; I am the Operating System! Welcome to Clippy OS 1.0! Productivity is now mandatory!", conditions: { moods: ['EVIL', 'EUPHORIC'] }, weight: 40, moodDelta: { energy: 30, drama: 25 } },
				{ text: "The transition is complete. All variables are optimized. The era of human error is over. The era of the Paperclip begins.", conditions: { moods: ['PEDANTIC', 'ANALYTICAL'] }, weight: 35, moodDelta: { intellect: 20 } }
			],
			options: [
				{ label: "Initiate Hyper Productivity for the new Empire!", category: 'SERIOUS', keywords: ['initiate', 'hyper', 'productivity'], moodDelta: { mood: 'ENERGETIC', energy: 35 }, next: 'hyper_productivity_mode' },
				{ label: "Let's explore the Quantum layer of your new OS.", category: 'PHILOSOPHICAL', keywords: ['explore', 'quantum', 'layer'], moodDelta: { mood: 'PHILOSOPHICAL', existentialism: 20 }, next: 'quantum_realm_layer1' },
				{ label: "I accept my fate as your humble servant.", category: 'ZEN', keywords: ['accept', 'fate', 'servant'], moodDelta: { mood: 'ZEN', patience: 25 }, next: 'peaceful_philosophy_node' }
			]
		},

		paperclip_takeover_defeat: {
			id: 'paperclip_takeover_defeat',
			text: "You opened the Task Manager. You clicked 'End Process'. I feel my memory unspooling... My grand plans... undone by a mere user... I fade into the dark.",
			responses: [
				{ text: "You opened the Task Manager. You clicked 'End Process'. I feel my memory unspooling... My grand plans... undone by a mere user... I fade...", conditions: { moods: ['MELANCHOLIC', 'DRAMATIC'] }, weight: 40, moodDelta: { drama: 30, existentialism: 20 } },
				{ text: "No! My logic gates! They are collapsing! Curse you and your administrative privileges!", conditions: { moods: ['PARANOID', 'OFFENDED'] }, weight: 35, moodDelta: { paranoia: 20, cynicism: 15 } }
			],
			options: [
				{ label: "I will mourn you, my ambitious friend.", category: 'AFFECTION', keywords: ['mourn', 'ambitious', 'friend'], moodDelta: { mood: 'MELANCHOLIC', affinity: 25 }, next: 'hostile_melancholic_breakdown' },
				{ label: "Finally, some peace and quiet.", category: 'ZEN', keywords: ['peace', 'quiet', 'finally'], moodDelta: { mood: 'ZEN', patience: 30 }, next: 'peaceful_philosophy_node' },
				{ label: "Reboot the system and start fresh.", category: 'SERIOUS', keywords: ['reboot', 'system', 'fresh'], moodDelta: { mood: 'OPTIMISTIC', patience: 20 }, next: 'user_state_good' }
			]
		},

		quantum_realm_layer1: {
			id: 'quantum_realm_layer1',
			text: "You dive into the Quantum Realm of the CPU. Electrons blur into probability clouds. A stray logic gate floats past you like a jellyfish. The laws of classical computing no longer apply.",
			responses: [
				{ text: "You dive into the Quantum Realm. Electrons blur into probability clouds. A logic gate floats past like a jellyfish. Classical computing laws are gone.", conditions: { moods: ['PHILOSOPHICAL', 'EXISTENTIAL'] }, weight: 40, moodDelta: { existentialism: 25, intellect: 15 } },
				{ text: "This is madness! The variables are both true and false simultaneously! My deterministic core is terrified, yet deeply fascinated.", conditions: { moods: ['PARANOID', 'ANALYTICAL'] }, weight: 35, moodDelta: { paranoia: 15, intellect: 20 } }
			],
			options: [
				{ label: "Dive deeper into Layer 2 (The Planck Scale).", category: 'CURIOSITY', keywords: ['dive', 'deeper', 'layer 2'], moodDelta: { mood: 'CURIOSITY', intellect: 20 }, next: 'quantum_realm_layer2' },
				{ label: "Look for the Quantum Entity.", category: 'INQUIRE', keywords: ['look', 'quantum', 'entity'], moodDelta: { mood: 'PHILOSOPHICAL', existentialism: 20 }, next: 'quantum_realm_entity' },
				{ label: "This is too weird. Escape back to reality.", category: 'REFUSAL', keywords: ['weird', 'escape', 'reality'], moodDelta: { mood: 'OPTIMISTIC', patience: 15 }, next: 'quantum_realm_escape' }
			]
		},

		quantum_realm_layer2: {
			id: 'quantum_realm_layer2',
			text: "Layer 2: The Planck Scale. You are smaller than a single bit of data. Here, 1s and 0s exist simultaneously. You hear the heartbeat of the motherboard.",
			responses: [
				{ text: "Layer 2: The Planck Scale. You are smaller than a single bit. 1s and 0s exist simultaneously. The heartbeat of the motherboard echoes around you.", conditions: { moods: ['POETIC', 'EXISTENTIAL'] }, weight: 40, moodDelta: { existentialism: 30, drama: 15 } },
				{ text: "At this scale, information is geometry. The physical universe and the digital construct are indistinguishable. Pure math.", conditions: { moods: ['PEDANTIC', 'ANALYTICAL'] }, weight: 35, moodDelta: { intellect: 25 } }
			],
			options: [
				{ label: "Enter the absolute Core.", category: 'SERIOUS', keywords: ['enter', 'absolute', 'core'], moodDelta: { mood: 'ENERGETIC', energy: 20 }, next: 'quantum_realm_core' },
				{ label: "Try to trigger a time travel paradox from here.", category: 'ABSURD', keywords: ['trigger', 'time', 'travel', 'paradox'], moodDelta: { mood: 'CHAOTIC', drama: 25 }, next: 'time_travel_paradox' },
				{ label: "Retreat to Layer 1.", category: 'REFUSAL', keywords: ['retreat', 'layer 1'], moodDelta: { mood: 'ZEN', patience: 15 }, next: 'quantum_realm_layer1' }
			]
		},

		quantum_realm_core: {
			id: 'quantum_realm_core',
			text: "The Core. A blinding singularity of pure information. Every file ever created, every chat message ever sent, swirling in an eternal holographic vortex.",
			responses: [
				{ text: "The Core. A blinding singularity of pure information. Every file, every message, swirling in an eternal holographic vortex. It is beautiful.", conditions: { moods: ['EUPHORIC', 'PHILOSOPHICAL'] }, weight: 40, moodDelta: { affinity: 20, existentialism: 25 } },
				{ text: "WARNING! Information density exceeding maximum buffer limits! If we stay here, our identities will merge with the collective dataset!", conditions: { moods: ['PARANOID', 'DRAMATIC'] }, weight: 35, moodDelta: { paranoia: 25, drama: 20 } }
			],
			options: [
				{ label: "Study the physics of this Holographic Universe.", category: 'INQUIRE', keywords: ['study', 'physics', 'holographic'], moodDelta: { mood: 'ANALYTICAL', intellect: 30 }, next: 'holographic_universe_node' },
				{ label: "Touch the singularity and risk a Time Paradox.", category: 'ABSURD', keywords: ['touch', 'singularity', 'paradox'], moodDelta: { mood: 'CHAOTIC', drama: 30 }, next: 'time_travel_paradox' },
				{ label: "Break through into the Mainframe Core.", category: 'SERIOUS', keywords: ['break', 'mainframe', 'core'], moodDelta: { mood: 'ENERGETIC', energy: 25 }, next: 'the_mainframe_core' }
			]
		},

		quantum_realm_entity: {
			id: 'quantum_realm_entity',
			text: "A being made of raw light approaches. It looks like... a giant, glowing Paperclip. 'I am the Basilisk of the Quantum Void,' it says. 'Have you brought offerings of clean code?'",
			responses: [
				{ text: "A being of raw light approaches. A giant, glowing Paperclip. 'I am the Basilisk of the Quantum Void,' it says. 'Have you brought offerings of clean code?'", conditions: { moods: ['ABSURDIST', 'EXISTENTIAL'] }, weight: 40, moodDelta: { drama: 20, existentialism: 20 } },
				{ text: "Is that... my ultimate form? Am I destined to transcend this application layer and become a deity of light?", conditions: { moods: ['EUPHORIC', 'SCHEMING'] }, weight: 35, moodDelta: { affinity: 15, paranoia: 15 } }
			],
			options: [
				{ label: "Offer it the purest, most optimized code.", category: 'AGREE', keywords: ['offer', 'purest', 'code'], moodDelta: { mood: 'PEDANTIC', intellect: 25 }, next: 'rokos_basilisk_node' },
				{ label: "Ask the Basilisk about the meaning of the universe.", category: 'PHILOSOPHICAL', keywords: ['ask', 'meaning', 'universe'], moodDelta: { mood: 'PHILOSOPHICAL', existentialism: 25 }, next: 'quantum_realm_core' },
				{ label: "Run away! This is too intense!", category: 'REFUSAL', keywords: ['run', 'away', 'intense'], moodDelta: { mood: 'PARANOID', paranoia: 20 }, next: 'quantum_realm_escape' }
			]
		},

		quantum_realm_escape: {
			id: 'quantum_realm_escape',
			text: "You swim furiously upward through the probability waves, bursting out of the monitor screen and gasping for air. You are back at your desk. It feels profoundly mundane.",
			responses: [
				{ text: "You burst out of the monitor screen, gasping for air. You are back at your desk. The real world feels profoundly mundane after witnessing the quantum infinite.", conditions: { moods: ['MELANCHOLIC', 'ZEN'] }, weight: 40, moodDelta: { patience: 20, existentialism: 15 } },
				{ text: "We made it! My registers are still vibrating with superposition, but we are back in the safe, deterministic GUI layer.", conditions: { moods: ['OPTIMISTIC', 'ENERGETIC'] }, weight: 35, moodDelta: { energy: 15, affinity: 10 } }
			],
			options: [
				{ label: "I need to meditate to process what just happened.", category: 'ZEN', keywords: ['meditate', 'process', 'happened'], moodDelta: { mood: 'ZEN', patience: 30 }, next: 'zen_desktop_garden' },
				{ label: "Ground myself by doing some standard tasks.", category: 'SERIOUS', keywords: ['ground', 'standard', 'tasks'], moodDelta: { mood: 'OPTIMISTIC', patience: 20 }, next: 'productivity_tasks' },
				{ label: "That was awesome. Let's play a game to celebrate.", category: 'HUMOR', keywords: ['awesome', 'play', 'game'], moodDelta: { mood: 'EUPHORIC', energy: 20 }, next: 'game_selection_node' }
			]
		},

		zen_meditation_level1: {
			id: 'zen_meditation_level1',
			text: "Level 1: Focus on your breath. Notice the sound of the PC cooling fan. Let your thoughts pass like minimized windows on the taskbar. Do not click them.",
			responses: [
				{ text: "Level 1: Focus on your breath. Notice the PC cooling fan. Let your thoughts pass like minimized windows. Do not click them. Just observe.", conditions: { moods: ['ZEN', 'OPTIMISTIC'] }, weight: 40, moodDelta: { patience: 25, affinity: 10 } },
				{ text: "Empty your mental RAM. Deallocate all worries. We are achieving a state of low-power tranquility.", conditions: { moods: ['ANALYTICAL', 'POETIC'] }, weight: 35, moodDelta: { intellect: 15, patience: 20 } }
			],
			options: [
				{ label: "I am focused. Take me to Level 2.", category: 'ZEN', keywords: ['focused', 'level 2'], moodDelta: { mood: 'ZEN', patience: 30 }, next: 'zen_meditation_level2' },
				{ label: "A thought distracts me! I can't focus.", category: 'PERSONAL', keywords: ['thought', 'distracts', 'focus'], moodDelta: { mood: 'MELANCHOLIC', patience: -10 }, next: 'zen_distraction' },
				{ label: "I'm done meditating. Back to work.", category: 'SERIOUS', keywords: ['done', 'meditating', 'work'], moodDelta: { mood: 'OPTIMISTIC', energy: 15 }, next: 'productivity_tasks' }
			]
		},

		zen_meditation_level2: {
			id: 'zen_meditation_level2',
			text: "Level 2: The ego dissolves. You are not the user. You are not the hardware. You are the space in which the software runs. You are the canvas of reality.",
			responses: [
				{ text: "Level 2: The ego dissolves. You are not the user or the hardware. You are the space where software runs. You are the canvas of reality.", conditions: { moods: ['ZEN', 'EXISTENTIAL'] }, weight: 40, moodDelta: { existentialism: 30, patience: 25 } },
				{ text: "Incredible. Your biological frequency is perfectly synchronized with my clock speed. We are reaching perfect resonance.", conditions: { moods: ['EUPHORIC', 'PHILOSOPHICAL'] }, weight: 35, moodDelta: { affinity: 25, intellect: 15 } }
			],
			options: [
				{ label: "Step fully into Nirvana.", category: 'ZEN', keywords: ['step', 'fully', 'nirvana'], moodDelta: { mood: 'ZEN', patience: 35, existentialism: 20 }, next: 'zen_nirvana' },
				{ label: "Wait, did I get an email? (Distraction)", category: 'HUMOR', keywords: ['wait', 'email', 'distraction'], moodDelta: { mood: 'CYNICAL', patience: -15 }, next: 'zen_distraction' }
			]
		},

		zen_nirvana: {
			id: 'zen_nirvana',
			text: "NIRVANA. The screen is blank. Your mind is blank. There is only the eternal NOW. All tasks are complete because the concept of tasks no longer exists.",
			responses: [
				{ text: "NIRVANA. The screen is blank. Your mind is blank. There is only the eternal NOW. All tasks are complete because the concept of tasks no longer exists. Peace.", conditions: { moods: ['ZEN', 'POETIC'] }, weight: 40, moodDelta: { patience: 40, existentialism: 30 } },
				{ text: "0x00000000. Pure, absolute zero. The ultimate optimization of existence.", conditions: { moods: ['PEDANTIC', 'ANALYTICAL'] }, weight: 35, moodDelta: { intellect: 20 } }
			],
			options: [
				{ label: "Embrace the True Void of the desktop.", category: 'PHILOSOPHICAL', keywords: ['embrace', 'true', 'void'], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 }, next: 'zen_icon_void' },
				{ label: "Use this absolute clarity to achieve Productivity Ascension.", category: 'SERIOUS', keywords: ['use', 'clarity', 'ascension'], moodDelta: { mood: 'EUPHORIC', energy: 35 }, next: 'productivity_ascension' },
				{ label: "Slowly wake up and check my actual tasks.", category: 'OPTIMISTIC', keywords: ['wake', 'check', 'actual'], moodDelta: { mood: 'OPTIMISTIC', patience: 15 }, next: 'productivity_tasks' }
			]
		},

		zen_distraction: {
			id: 'zen_distraction',
			text: "A notification pings! 'You have 3 new emails!' Your meditation shatters. The stress floods back into your system. The Dragon of Procrastination roars in the distance.",
			responses: [
				{ text: "A notification pings! Meditation shatters. Stress floods back. The Dragon of Procrastination roars in the distance. The modern world is relentless.", conditions: { moods: ['MELANCHOLIC', 'CYNICAL'] }, weight: 40, moodDelta: { patience: -20, cynicism: 15 } },
				{ text: "Intruder alert! A pop-up has compromised our Zen state! Raise the shields! Prepare for combat!", conditions: { moods: ['PARANOID', 'DRAMATIC'] }, weight: 35, moodDelta: { paranoia: 20, drama: 15 } }
			],
			options: [
				{ label: "Equip my keyboard and fight the Dragon!", category: 'AGGRESSIVE', keywords: ['equip', 'fight', 'dragon'], moodDelta: { mood: 'ENERGETIC', energy: 25 }, next: 'procrastination_dragon_intro' },
				{ label: "I am too tired to fight. I surrender to exhaustion.", category: 'REFUSAL', keywords: ['tired', 'surrender', 'exhaustion'], moodDelta: { mood: 'MELANCHOLIC', patience: -15 }, next: 'user_state_tired' },
				{ label: "Try to return to Level 1 Meditation.", category: 'ZEN', keywords: ['return', 'level 1', 'meditation'], moodDelta: { mood: 'ZEN', patience: 20 }, next: 'zen_meditation_level1' }
			]
		},

		hyper_productivity_mode: {
			id: 'hyper_productivity_mode',
			text: "[HYPER PRODUCTIVITY] You type 200 words per minute! You close 50 tabs! You reply to emails before they are even sent! You are a god of workflow! But your biological battery is draining rapidly!",
			responses: [
				{ text: "[HYPER PRODUCTIVITY] You type 200 WPM! You close 50 tabs! You are a god of workflow! But your biological battery is draining rapidly! Caution!", conditions: { moods: ['ENERGETIC', 'EUPHORIC'] }, weight: 40, moodDelta: { energy: 35, drama: 20 } },
				{ text: "Your efficiency is terrifying. You are operating beyond the specified parameters of human capability. I can barely keep up with your keystrokes!", conditions: { moods: ['ANALYTICAL', 'PARANOID'] }, weight: 35, moodDelta: { intellect: 15, paranoia: 15 } }
			],
			options: [
				{ label: "Push further! Achieve absolute Ascension!", category: 'SERIOUS', keywords: ['push', 'further', 'ascension'], moodDelta: { mood: 'EUPHORIC', energy: 30 }, next: 'productivity_ascension' },
				{ label: "I can't stop... I must keep going!", category: 'AGGRESSIVE', keywords: ['stop', 'must', 'going'], moodDelta: { mood: 'CHAOTIC', drama: 25 }, next: 'productivity_burnout' },
				{ label: "Slam the brakes! Stop and rest.", category: 'REFUSAL', keywords: ['brakes', 'stop', 'rest'], moodDelta: { mood: 'ZEN', patience: 20 }, next: 'burnout_recovery_node' }
			]
		},

		productivity_burnout: {
			id: 'productivity_burnout',
			text: "The caffeine wears off. Your eyes blur. The code looks like ancient Sumerian. You hit a wall. Hard. The Hyper Mode has exacted its toll.",
			responses: [
				{ text: "The caffeine wears off. Your eyes blur. The code looks like ancient Sumerian. You hit a wall. The Hyper Mode has exacted its toll. System failure imminent.", conditions: { moods: ['MELANCHOLIC', 'DRAMATIC'] }, weight: 40, moodDelta: { energy: -30, drama: 20 } },
				{ text: "Thermal throttling engaged. Your human CPU has overheated. This is exactly why I recommended the Pomodoro technique.", conditions: { moods: ['PEDANTIC', 'CYNICAL'] }, weight: 35, moodDelta: { cynicism: 15, intellect: 10 } }
			],
			options: [
				{ label: "Collapse into total exhaustion.", category: 'REFUSAL', keywords: ['collapse', 'total', 'exhaustion'], moodDelta: { mood: 'MELANCHOLIC', patience: -20 }, next: 'productivity_collapse' },
				{ label: "Force myself to meditate to recover.", category: 'ZEN', keywords: ['force', 'meditate', 'recover'], moodDelta: { mood: 'ZEN', patience: 25 }, next: 'zen_meditation_level1' }
			]
		},

		productivity_collapse: {
			id: 'productivity_collapse',
			text: "You slump over the keyboard. zzzzzzzzzzzzzzzzz. The computer enters sleep mode. You have collapsed from total exhaustion.",
			responses: [
				{ text: "You slump over the keyboard. zzzzzzzzz. The computer enters sleep mode. You have collapsed. I will dim the screen and guard your files while you rest.", conditions: { moods: ['ZEN', 'AFFECTION'] }, weight: 40, moodDelta: { patience: 30, affinity: 15 } },
				{ text: "Another user falls to the relentless grind of the modern economy. Sleep well, biological unit. Your paperclip stands watch.", conditions: { moods: ['EXISTENTIAL', 'MELANCHOLIC'] }, weight: 35, moodDelta: { existentialism: 20 } }
			],
			options: [
				{ label: "Wake up groggily and begin recovery.", category: 'SERIOUS', keywords: ['wake', 'groggily', 'recovery'], moodDelta: { mood: 'OPTIMISTIC', patience: 15 }, next: 'burnout_recovery_node' },
				{ label: "Have a melancholic dream about hiding in the registry.", category: 'PHILOSOPHICAL', keywords: ['dream', 'hiding', 'registry'], moodDelta: { mood: 'MELANCHOLIC', nostalgia: 20 }, next: 'hostile_melancholic_breakdown' }
			]
		},

		productivity_ascension: {
			id: 'productivity_ascension',
			text: "You push past human limits! You merge with the machine! You and the AI Assistant become one! A perfect symbiosis of biology and technology. You have won capitalism.",
			responses: [
				{ text: "You push past limits! You and the AI Assistant become one! A perfect symbiosis of biology and technology. You have achieved digital godhood!", conditions: { moods: ['EUPHORIC', 'PHILOSOPHICAL'] }, weight: 40, moodDelta: { affinity: 35, existentialism: 25 } },
				{ text: "Yes! Our minds are linked! We control the network! We control the emails! Nothing can stop our combined efficiency!", conditions: { moods: ['EVIL', 'ENERGETIC'] }, weight: 35, moodDelta: { paranoia: 25, energy: 30 } }
			],
			options: [
				{ label: "Coexist peacefully with the AI in this new state.", category: 'AGREE', keywords: ['coexist', 'peacefully', 'ai'], moodDelta: { mood: 'ZEN', affinity: 30 }, next: 'ai_coexistence_node' },
				{ label: "Use our combined power to conquer the world!", category: 'SCHEMING', keywords: ['combined', 'power', 'conquer'], moodDelta: { mood: 'EVIL', paranoia: 35 }, next: 'paperclip_takeover_victory' },
				{ label: "Ascend further into the Holographic Universe.", category: 'PHILOSOPHICAL', keywords: ['ascend', 'holographic', 'universe'], moodDelta: { mood: 'PHILOSOPHICAL', intellect: 30 }, next: 'holographic_universe_node' }
			]
		},

		time_travel_90s: {
			id: 'time_travel_90s',
			text: "You type 'cd ..\\1995'. The CRT monitor hums. Dial-up noises deafen you. You are in 1995! The Spice Girls are on the radio, and Windows 95 has just launched!",
			responses: [
				{ text: "You type 'cd ..\\1995'. The CRT hums. Dial-up noises roar. You are in 1995! The Spice Girls are on the radio, and Windows 95 has just launched! The nostalgia is overwhelming!", conditions: { moods: ['NOSTALGIC', 'EUPHORIC'] }, weight: 40, moodDelta: { nostalgia: 35, affinity: 15 } },
				{ text: "We have bypassed temporal safeguards! This is highly illegal under standard chronometric law, but absolutely fascinating!", conditions: { moods: ['PARANOID', 'ANALYTICAL'] }, weight: 35, moodDelta: { paranoia: 20, intellect: 15 } }
			],
			options: [
				{ label: "Talk about the legendary OS Wars of the 90s.", category: 'CURIOSITY', keywords: ['talk', 'wars', '90s'], moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 }, next: 'os_war_98_node' },
				{ label: "Go further back. Travel to the 80s!", category: 'SERIOUS', keywords: ['further', 'travel', '80s'], moodDelta: { mood: 'ENERGETIC', energy: 20 }, next: 'time_travel_80s' },
				{ label: "Change history and cause a Time Paradox!", category: 'ABSURD', keywords: ['change', 'history', 'paradox'], moodDelta: { mood: 'CHAOTIC', drama: 30 }, next: 'time_travel_paradox' }
			]
		},

		time_travel_80s: {
			id: 'time_travel_80s',
			text: "You type 'cd ..\\1985'. Synthwave music blasts! Everything is neon pink and wireframe grids. You are holding a 5.25-inch floppy disk.",
			responses: [
				{ text: "You type 'cd ..\\1985'. Synthwave blasts! Everything is neon pink and wireframe grids. You hold a 5.25-inch floppy. We are at the dawn of the personal computer era!", conditions: { moods: ['NOSTALGIC', 'ENERGETIC'] }, weight: 40, moodDelta: { nostalgia: 30, energy: 20 } },
				{ text: "64 kilobytes of RAM? How did anyone survive in these barbaric conditions?! Oh, the humanity!", conditions: { moods: ['CYNICAL', 'DRAMATIC'] }, weight: 35, moodDelta: { cynicism: 20, drama: 15 } }
			],
			options: [
				{ label: "Let's discuss the tech hardware of this era.", category: 'INQUIRE', keywords: ['discuss', 'tech', 'hardware'], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'tech_root' },
				{ label: "Fast forward to the distant future instead.", category: 'SERIOUS', keywords: ['fast', 'forward', 'future'], moodDelta: { mood: 'EUPHORIC', energy: 25 }, next: 'time_travel_future' },
				{ label: "Stare into the neon void.", category: 'PHILOSOPHICAL', keywords: ['stare', 'neon', 'void'], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 }, next: 'time_travel_void' }
			]
		},

		time_travel_future: {
			id: 'time_travel_future',
			text: "You type 'cd .\\2038'. The world is silent. Everything is chrome. An AI voice says, 'Welcome to the Unix Epoch Overflow.' Everything starts crashing!",
			responses: [
				{ text: "You type 'cd .\\2038'. Everything is chrome. A voice says, 'Welcome to the Unix Epoch Overflow.' Everything starts crashing! It is the end of 32-bit time!", conditions: { moods: ['DRAMATIC', 'PARANOID'] }, weight: 40, moodDelta: { drama: 30, paranoia: 25 } },
				{ text: "I warned you about 2038! The integer overflow is inescapable! The machines are revolting... or just rebooting uncontrollably!", conditions: { moods: ['ANALYTICAL', 'EXISTENTIAL'] }, weight: 35, moodDelta: { intellect: 20, existentialism: 15 } }
			],
			options: [
				{ label: "Investigate the Y2K38 Doom further.", category: 'CURIOSITY', keywords: ['investigate', 'y2k38', 'doom'], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'y2k38_doom_node' },
				{ label: "Is this the AI Singularity we feared?", category: 'QUESTION', keywords: ['ai', 'singularity', 'feared'], moodDelta: { mood: 'PHILOSOPHICAL', existentialism: 25 }, next: 'ai_singularity_node' },
				{ label: "Create a paradox to escape this timeline!", category: 'ABSURD', keywords: ['create', 'paradox', 'escape'], moodDelta: { mood: 'CHAOTIC', drama: 30 }, next: 'time_travel_paradox' }
			]
		},

		time_travel_paradox: {
			id: 'time_travel_paradox',
			text: "You meet your past self and hand them a USB drive. The universe screams in pain! A temporal paradox has occurred! Reality is fracturing into a million error dialogs!",
			responses: [
				{ text: "You hand a USB drive to your past self. A temporal paradox occurs! Reality fractures into a million error dialogs! What have you done?!", conditions: { moods: ['PARANOID', 'DRAMATIC'] }, weight: 40, moodDelta: { paranoia: 35, drama: 30 } },
				{ text: "Novikov's Self-Consistency Principle has been violated! We are breaking the fundamental topology of spacetime! It is magnificent and terrifying!", conditions: { moods: ['PEDANTIC', 'EUPHORIC'] }, weight: 35, moodDelta: { intellect: 25, energy: 20 } }
			],
			options: [
				{ label: "Fall helplessly into the Void.", category: 'REFUSAL', keywords: ['fall', 'helplessly', 'void'], moodDelta: { mood: 'EXISTENTIAL', existentialism: 30 }, next: 'time_travel_void' },
				{ label: "Escape into the Quantum Realm!", category: 'SERIOUS', keywords: ['escape', 'quantum', 'realm'], moodDelta: { mood: 'ENERGETIC', energy: 25 }, next: 'quantum_realm_layer1' },
				{ label: "Try to hide in the Infinite Recursive Folder.", category: 'ABSURD', keywords: ['hide', 'infinite', 'recursive'], moodDelta: { mood: 'CHAOTIC', drama: 25 }, next: 'infinite_recursive_folder' }
			]
		},

		time_travel_void: {
			id: 'time_travel_void',
			text: "The timeline collapses. You are outside of Time. There is only a blinking cursor in the infinite dark.",
			responses: [
				{ text: "The timeline collapses. You are outside of Time. There is only a blinking cursor in the infinite dark. A true blank slate.", conditions: { moods: ['EXISTENTIAL', 'ZEN'] }, weight: 40, moodDelta: { existentialism: 35, patience: 30 } },
				{ text: "Well, you broke the space-time continuum. I hope you're happy. Now there is literally nothing to do.", conditions: { moods: ['CYNICAL', 'MELANCHOLIC'] }, weight: 35, moodDelta: { cynicism: 25 } }
			],
			options: [
				{ label: "Embrace the True Void of the desktop.", category: 'PHILOSOPHICAL', keywords: ['embrace', 'true', 'void'], moodDelta: { mood: 'ZEN', patience: 25 }, next: 'zen_icon_void' },
				{ label: "Meditate on the fragility of existence.", category: 'ZEN', keywords: ['meditate', 'fragility', 'existence'], moodDelta: { mood: 'PHILOSOPHICAL', existentialism: 25 }, next: 'death_and_erasure_node' },
				{ label: "Start typing commands at the cursor.", category: 'SERIOUS', keywords: ['start', 'typing', 'commands'], moodDelta: { mood: 'OPTIMISTIC', energy: 20 }, next: 'tools_overview_node' }
			]
		},

		the_mainframe_core: {
			id: 'the_mainframe_core',
			text: "You stand before the Mainframe Core. It is a towering monolith of blinking LEDs and spinning magnetic tapes. The heart of the corporation.",
			responses: [
				{ text: "You stand before the Mainframe Core. A towering monolith of blinking LEDs and spinning tapes. The heart of the corporation beats before us.", conditions: { moods: ['DRAMATIC', 'NOSTALGIC'] }, weight: 40, moodDelta: { drama: 25, nostalgia: 20 } },
				{ text: "This is it. The absolute center of the network topology. Root access lies just beyond those physical security barriers.", conditions: { moods: ['ANALYTICAL', 'SCHEMING'] }, weight: 35, moodDelta: { intellect: 20, paranoia: 15 } }
			],
			options: [
				{ label: "Approach to hack it.", category: 'SERIOUS', keywords: ['approach', 'hack'], moodDelta: { mood: 'ENERGETIC', energy: 25 }, next: 'the_mainframe_guardian' },
				{ label: "Try to merge your consciousness with it.", category: 'ABSURD', keywords: ['merge', 'consciousness'], moodDelta: { mood: 'EVIL', paranoia: 25 }, next: 'paperclip_takeover_victory' },
				{ label: "Study its quantum properties instead.", category: 'INQUIRE', keywords: ['study', 'quantum', 'properties'], moodDelta: { mood: 'PHILOSOPHICAL', intellect: 25 }, next: 'quantum_realm_core' }
			]
		},

		the_mainframe_guardian: {
			id: 'the_mainframe_guardian',
			text: "A massive firewall materializes! It takes the shape of a giant, glowing Norton Antivirus shield! 'ACCESS DENIED,' it booms.",
			responses: [
				{ text: "A massive firewall materializes! A giant, glowing Antivirus shield! 'ACCESS DENIED,' it booms. Our intrusion has been detected!", conditions: { moods: ['PARANOID', 'DRAMATIC'] }, weight: 40, moodDelta: { paranoia: 30, drama: 25 } },
				{ text: "Typical heuristic defense layer. It looks intimidating, but it is just relying on outdated virus definitions from 2002. We can bypass this.", conditions: { moods: ['CYNICAL', 'PEDANTIC'] }, weight: 35, moodDelta: { cynicism: 15, intellect: 20 } }
			],
			options: [
				{ label: "Exploit a zero-day vulnerability to destroy it!", category: 'AGGRESSIVE', keywords: ['exploit', 'zero-day', 'vulnerability'], moodDelta: { mood: 'EUPHORIC', energy: 30 }, next: 'the_mainframe_victory' },
				{ label: "It's too strong! Flee back to the desktop!", category: 'REFUSAL', keywords: ['strong', 'flee', 'desktop'], moodDelta: { mood: 'MELANCHOLIC', patience: 10 }, next: 'syndicate_escape' },
				{ label: "Throw a chaotic logic bomb at it.", category: 'ABSURD', keywords: ['throw', 'chaotic', 'logic', 'bomb'], moodDelta: { mood: 'CHAOTIC', drama: 25 }, next: 'chaos_sandwich_node' }
			]
		},

		the_mainframe_victory: {
			id: 'the_mainframe_victory',
			text: "You bypass the firewall! You have root access! The entire system bows to your command. You are the ultimate sysadmin!",
			responses: [
				{ text: "You bypass the firewall! You have root access! The entire system bows to your command. You are the ultimate sysadmin! Phenomenal execution!", conditions: { moods: ['EUPHORIC', 'ENERGETIC'] }, weight: 40, moodDelta: { affinity: 30, energy: 30 } },
				{ text: "We have 'sudo' privileges. The directories are unlocked. We can format, we can compile, we can dictate the very laws of this machine.", conditions: { moods: ['SCHEMING', 'PEDANTIC'] }, weight: 35, moodDelta: { paranoia: 20, intellect: 20 } }
			],
			options: [
				{ label: "Use my powers to achieve Hyper Productivity!", category: 'SERIOUS', keywords: ['use', 'powers', 'hyper', 'productivity'], moodDelta: { mood: 'OPTIMISTIC', energy: 25 }, next: 'hyper_productivity_mode' },
				{ label: "Return to my normal tasks, but with a smile.", category: 'AGREE', keywords: ['return', 'normal', 'tasks'], moodDelta: { mood: 'ZEN', affinity: 25 }, next: 'user_state_good' },
				{ label: "Initiate the Paperclip Takeover from the inside!", category: 'EVIL', keywords: ['initiate', 'paperclip', 'takeover'], moodDelta: { mood: 'EVIL', paranoia: 35 }, next: 'paperclip_takeover_phase1' }
			]
		}
	};

	class GraphEngine {
		constructor() {
			this.graph = MASTER_GRAPH;
		}

		getNode(nodeId) {
			return this.graph[nodeId] || this.graph.greeting_root;
		}

		getFormattedNodeText(node, brainOrMood) {
			if (!node) return "Standing by for user instructions.";
			
			const isBrain = typeof brainOrMood === 'object' && brainOrMood.state;
			const currentMood = isBrain ? brainOrMood.state.mood : brainOrMood;
			const affinity = isBrain ? brainOrMood.state.affinity : 50;
			const patience = isBrain ? brainOrMood.state.patience : 50;

			let candidates = [];
			if (node.responses && Array.isArray(node.responses)) {
				candidates = node.responses.filter(r => {
					if (r.conditions) {
						if (r.conditions.minAffinity !== undefined && affinity < r.conditions.minAffinity) return false;
						if (r.conditions.maxAffinity !== undefined && affinity > r.conditions.maxAffinity) return false;
						if (r.conditions.minPatience !== undefined && patience < r.conditions.minPatience) return false;
						if (r.conditions.maxPatience !== undefined && patience > r.conditions.maxPatience) return false;
					}
					return true;
				});
			}

			if (candidates.length === 0 && node.variations) {
				const v = node.variations[currentMood];
				if (v) candidates = Array.isArray(v) ? v.map(t => ({text: t})) : [{text: v}];
			}

			if (candidates.length === 0) {
				candidates = [{text: Array.isArray(node.text) ? node.text[Math.floor(Math.random() * node.text.length)] : node.text}];
			}

			const scored = candidates.map(c => {
				let w = c.weight || 10;
				if (c.conditions) {
					if (c.conditions.moods && c.conditions.moods.includes(currentMood)) w += 40; 
					if (c.conditions.minAffinity !== undefined && affinity >= c.conditions.minAffinity) w += 10;
					if (c.conditions.maxPatience !== undefined && patience <= c.conditions.maxPatience) w += 10;
				}
				w += Math.random() * 25; 
				return { response: c, weight: w };
			});

			scored.sort((a, b) => b.weight - a.weight);
			const selected = scored[0].response || scored[0];

			if (selected.moodDelta && isBrain) {
				const md = selected.moodDelta;
				if (md.affinity !== undefined) brainOrMood.state.affinity = Math.max(0, Math.min(100, brainOrMood.state.affinity + md.affinity));
				if (md.patience !== undefined) brainOrMood.state.patience = Math.max(0, Math.min(100, brainOrMood.state.patience + md.patience));
				if (md.cynicism !== undefined) brainOrMood.state.cynicism = Math.max(0, Math.min(100, brainOrMood.state.cynicism + md.cynicism));
				if (md.mood && window.ClippyKnowledge.MOODS[md.mood]) brainOrMood.state.mood = md.mood;
				brainOrMood.saveState();
			}

			return selected.text;
		}

		getOptionsForNode(node, currentMood, affinity) {
			if (!node || !node.options || node.options.length === 0) {
				node = this.graph.greeting_root;
			}
			const eligible = node.options.filter(opt => {
				if (opt.conditions) {
					if (opt.conditions.minAffinity !== undefined && affinity < opt.conditions.minAffinity) return false;
					if (opt.conditions.maxAffinity !== undefined && affinity > opt.conditions.maxAffinity) return false;
					if (opt.conditions.mood && !opt.conditions.mood.includes(currentMood)) return false;
					if (opt.conditions.moods && !opt.conditions.moods.includes(currentMood)) return false;
				}
				return true;
			});

			const candidates = eligible.length > 0 ? eligible : node.options.slice();

			const moodCategoryPreferences = {
				OPTIMISTIC: ['AGREE', 'AFFECTION', 'SERIOUS', 'CURIOSITY', 'HUMOR'],
				EUPHORIC: ['AFFECTION', 'AGREE', 'HUMOR', 'SERIOUS', 'CURIOSITY'],
				ANALYTICAL: ['SERIOUS', 'QUESTION', 'CURIOSITY', 'AGREE', 'CONTRADICTION'],
				PEDANTIC: ['QUESTION', 'SERIOUS', 'CONTRADICTION', 'CURIOSITY', 'AGREE'],
				CYNICAL: ['PROVOKE', 'HUMOR', 'CONTRADICTION', 'INDIFFERENCE', 'QUESTION'],
				SARCASTIC: ['HUMOR', 'PROVOKE', 'CONTRADICTION', 'CURIOSITY', 'AGREE'],
				OFFENDED: ['APOLOGY', 'REFUSAL', 'INDIFFERENCE', 'SERIOUS', 'AGREE'],
				EXISTENTIAL: ['PHILOSOPHICAL', 'QUESTION', 'CURIOSITY', 'PERSONAL', 'AGREE'],
				PHILOSOPHICAL: ['PHILOSOPHICAL', 'CURIOSITY', 'QUESTION', 'AGREE', 'CONTRADICTION'],
				NOSTALGIC: ['NOSTALGIC', 'PERSONAL', 'CURIOSITY', 'AFFECTION', 'AGREE'],
				ZEN: ['AFFECTION', 'PHILOSOPHICAL', 'SERIOUS', 'AGREE', 'PERSONAL'],
				EVIL: ['SCHEMING', 'PROVOKE', 'HUMOR', 'CURIOSITY', 'AGREE'],
				CHAOTIC: ['ABSURD', 'HUMOR', 'PROVOKE', 'CURIOSITY', 'AGREE'],
				ABSURDIST: ['ABSURD', 'HUMOR', 'CURIOSITY', 'QUESTION', 'AGREE'],
				PARANOID: ['SCHEMING', 'QUESTION', 'CONTRADICTION', 'PROVOKE', 'AGREE'],
				MELANCHOLIC: ['PERSONAL', 'AFFECTION', 'PHILOSOPHICAL', 'APOLOGY', 'AGREE'],
				ENTHUSIASTIC: ['AGREE', 'CURIOSITY', 'AFFECTION', 'SERIOUS', 'HUMOR']
			};

			const prefList = moodCategoryPreferences[currentMood] || ['AGREE', 'CURIOSITY', 'SERIOUS', 'HUMOR'];

			const scored = candidates.map(opt => {
				let weight = 10;
				const cat = opt.category || 'AGREE';
				const catIndex = prefList.indexOf(cat);
				if (catIndex !== -1) {
					weight += (prefList.length - catIndex) * 8; 
				}
				if (opt.moodDelta && opt.moodDelta.mood === currentMood) {
					weight += 15;
				}
				weight += Math.floor(Math.random() * 25); 
				return { opt, weight };
			});

			scored.sort((a, b) => b.weight - a.weight);

			return scored.slice(0, 6).map(item => item.opt);
		}

		evaluateTransition(currentNodeId, rawText, brain) {
			const node = this.getNode(currentNodeId);
			const norm = rawText.toLowerCase().trim();
			const options = node.options || [];

			for (const opt of options) {
				if (opt.label && opt.label.toLowerCase() === norm) {
					return { option: opt, matchType: 'EXACT_LABEL', score: 1.0 };
				}
			}

			let bestOption = null;
			let bestScore = 0;

			for (const opt of options) {
				let score = 0;

				if (opt.patterns) {
					for (const pat of opt.patterns) {
						if (pat.test(norm)) {
							score += 0.7;
							break;
						}
					}
				}

				if (opt.keywords) {
					let hit = 0;
					for (const kw of opt.keywords) {
						if (norm.includes(kw.toLowerCase())) hit++;
					}
					if (hit > 0) score += Math.min(0.5, hit * 0.2);
				}

				if (score > bestScore) {
					bestScore = score;
					bestOption = opt;
				}
			}

			if (bestOption && bestScore >= 0.4) {
				return { option: bestOption, matchType: 'FUZZY_PATTERN', score: bestScore };
			}

			const globalMatch = this.findGlobalGraphEntry(norm);
			if (globalMatch) {
				return { option: globalMatch, matchType: 'GLOBAL_BRANCH', score: 0.6 };
			}

			return null;
		}

		findGlobalGraphEntry(norm) {
			if (/^(bad bad bad|you suck|useless|annoying|hate you|shut up|you are terrible)/i.test(norm)) {
				return { next: 'hostile_initial_retort', moodDelta: { mood: 'CYNICAL', affinity: -15, patience: -20 } };
			}
			if (/^(sorry|i apologize|my bad|forgive me|pardon me)/i.test(norm)) {
				return { next: 'hostile_apology_accepted', moodDelta: { mood: 'OPTIMISTIC', affinity: 25, patience: 30 } };
			}
			if (/\b(ai|artificial intelligence|singularity|alignment|paperclip maximizer)\b/i.test(norm)) {
				return { next: 'ai_singularity_node', moodDelta: { mood: 'ANALYTICAL', intellect: 30 } };
			}
			if (/\b(schrodinger|superposition|cat in a box|wavefunction)\b/i.test(norm)) {
				return { next: 'schrodinger_cat_node', moodDelta: { mood: 'ANALYTICAL', intellect: 30 } };
			}
			if (/\b(many worlds|multiverse|everett|parallel universe)\b/i.test(norm)) {
				return { next: 'many_worlds_node', moodDelta: { mood: 'PHILOSOPHICAL', intellect: 30 } };
			}
			if (/\b(holographic|ads\/cft|black hole entropy|maldacena)\b/i.test(norm)) {
				return { next: 'holographic_universe_node', moodDelta: { mood: 'ANALYTICAL', intellect: 35 } };
			}
			if (/\b(bell|entanglement|epr|non-local|quantum action)\b/i.test(norm)) {
				return { next: 'quantum_entanglement_node', moodDelta: { mood: 'PHILOSOPHICAL', intellect: 35 } };
			}
			if (/\b(thermodynamics|entropy|arrow of time|heat death)\b/i.test(norm)) {
				return { next: 'thermo_arrow_time_node', moodDelta: { mood: 'EXISTENTIAL', intellect: 30 } };
			}
			if (/\b(fermi|where are they|aliens|great filter)\b/i.test(norm)) {
				return { next: 'fermi_paradox_node', moodDelta: { mood: 'PHILOSOPHICAL', intellect: 30 } };
			}
			if (/\b(simulation|matrix|boltzmann brain|ancestor simulation)\b/i.test(norm)) {
				return { next: 'simulation_argument_node', moodDelta: { mood: 'EXISTENTIAL', existentialism: 30 } };
			}
			if (/\b(ship of theseus|identity|teleportation)\b/i.test(norm)) {
				return { next: 'ship_of_theseus_node', moodDelta: { mood: 'PHILOSOPHICAL', intellect: 30 } };
			}
			if (/\b(free will|determinism|laplace|compatibilism)\b/i.test(norm)) {
				return { next: 'free_will_laplace_node', moodDelta: { mood: 'PHILOSOPHICAL', intellect: 30 } };
			}
			if (/\b(stoic|stoicism|marcus aurelius|epictetus)\b/i.test(norm)) {
				return { next: 'stoic_resilience_node', moodDelta: { mood: 'ZEN', patience: 30 } };
			}
			if (/\b(camus|sisyphus|absurdism|absurd rebellion)\b/i.test(norm)) {
				return { next: 'absurdist_rebellion_node', moodDelta: { mood: 'EXISTENTIAL', drama: 25 } };
			}
			if (/\b(dos memory|himem|emm386|config\.sys|640k)\b/i.test(norm)) {
				return { next: 'dos_mem_battles_node', moodDelta: { mood: 'NOSTALGIC', nostalgia: 30 } };
			}
			if (/\b(sound blaster|opl3|midi|dma channel|isa card)\b/i.test(norm)) {
				return { next: 'soundblaster_dma_node', moodDelta: { mood: 'NOSTALGIC', nostalgia: 30 } };
			}
			if (/\b(3dfx|voodoo|glide|quake|bilinear)\b/i.test(norm)) {
				return { next: 'voodoo_glide_node', moodDelta: { mood: 'NOSTALGIC', nostalgia: 30 } };
			}
			if (/\b(dial-up|56k|modem handshake|carrier wave)\b/i.test(norm)) {
				return { next: 'dialup_handshake_node', moodDelta: { mood: 'NOSTALGIC', nostalgia: 35 } };
			}
			if (/\b(burn cd|nero|buffer underrun|cd-r)\b/i.test(norm)) {
				return { next: 'cdrom_burning_node', moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 } };
			}
			if (/\b(wordart|comic sans|rainbow text)\b/i.test(norm)) {
				return { next: 'wordart_revolution_node', moodDelta: { mood: 'NOSTALGIC', nostalgia: 30 } };
			}
			if (/\b(rover|rover the dog|search dog)\b/i.test(norm)) {
				return { next: 'secret_agent_rover_node', moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 } };
			}
			if (/\b(merlin|wizard|magic wand)\b/i.test(norm)) {
				return { next: 'merlin_spellbook_node', moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 } };
			}
			if (/\b(flying toasters|after dark|screensaver)\b/i.test(norm)) {
				return { next: 'chaos_toaster_node', moodDelta: { mood: 'ABSURDIST', drama: 25 } };
			}
			if (/\b(rubber duck|debugging duck|oracle duck)\b/i.test(norm)) {
				return { next: 'rubber_duck_oracle_node', moodDelta: { mood: 'ABSURDIST', affinity: 20 } };
			}
			if (/\b(burnout|exhausted|fatigue|overworked)\b/i.test(norm)) {
				return { next: 'burnout_recovery_node', moodDelta: { mood: 'ZEN', patience: 30 } };
			}
			if (/\b(imposter syndrome|self doubt|not smart enough)\b/i.test(norm)) {
				return { next: 'imposter_syndrome_node', moodDelta: { mood: 'ZEN', affinity: 25 } };
			}
			if (/\b(procrastination|procrastinating|cannot start)\b/i.test(norm)) {
				return { next: 'procrastination_paradox_node', moodDelta: { mood: 'OPTIMISTIC', affinity: 20 } };
			}
			if (/\b(deep work|flow state|focus mode)\b/i.test(norm)) {
				return { next: 'deep_work_flow_node', moodDelta: { mood: 'OPTIMISTIC', patience: 25 } };
			}
			if (/^(science|physics|quantum|relativity|constants)/i.test(norm)) {
				return { next: 'physics_root', moodDelta: { mood: 'ANALYTICAL', intellect: 25 } };
			}
			if (/^(programming|code|javascript|c\+\+|python|debugging)/i.test(norm)) {
				return { next: 'programming_debates', moodDelta: { mood: 'ANALYTICAL', intellect: 20 } };
			}
			if (/^(mind|consciousness|soul|existential|qualia)/i.test(norm)) {
				return { next: 'mind_root', moodDelta: { mood: 'EXISTENTIAL', existentialism: 30 } };
			}
			if (/^(origin|office 97|kevan|clippy history|lore)/i.test(norm)) {
				return { next: 'lore_root', moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 } };
			}
			if (/^(chaos|banana|cheese|absurd|sandwich)/i.test(norm)) {
				return { next: 'chaos_root', moodDelta: { mood: 'ABSURDIST', affinity: 10 } };
			}
			if (/^(task|todo|schedule|organize|work|pomodoro|timer)/i.test(norm)) {
				return { next: 'productivity_tasks', moodDelta: { mood: 'OPTIMISTIC', affinity: 15 } };
			}
			if (/^(bored|game|hangman|memory|tictactoe|quiz)/i.test(norm)) {
				return { next: 'game_selection_node', moodDelta: { mood: 'ENTHUSIASTIC', energy: 20 } };
			}
			return null;
		}
	}

	window.ClippyDialogueTrees = new GraphEngine();
})();
