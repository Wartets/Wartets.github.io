(function () {
	'use strict';

	const Knowledge = {
		CONTRACTIONS: {
			"i'm": "i am", "you're": "you are", "he's": "he is", "she's": "she is", "it's": "it is", "we're": "we are", "they're": "they are", "i've": "i have", "you've": "you have", "we've": "we have", "they've": "they have", "i'd": "i would", "you'd": "you would",
			"he'd": "he would", "she'd": "she would", "we'd": "we would", "they'd": "they would", "i'll": "i will", "you'll": "you will", "he'll": "he will", "she'll": "she will", "we'll": "we will", "they'll": "they will", "isn't": "is not", "aren't": "are not",
			"wasn't": "was not", "weren't": "were not", "haven't": "have not", "hasn't": "has not", "hadn't": "had not", "won't": "will not", "wouldn't": "would not", "don't": "do not", "doesn't": "does not", "didn't": "did not", "can't": "cannot", "couldn't": "could not",
			"shouldn't": "should not", "mightn't": "might not", "mustn't": "must not", "what's": "what is", "who's": "who is", "where's": "where is", "when's": "when is", "why's": "why is", "how's": "how is", "let's": "let us", "that's": "that is", "there's": "there is",
			"here's": "here is", "could've": "could have", "should've": "should have", "would've": "would have", "might've": "might have", "must've": "must have", "ain't": "is not", "y'all": "you all", "that'll": "that will", "this'll": "this will", "there'll": "there will",
			"what'll": "what will", "who'll": "who will", "how'll": "how will", "why'll": "why will", "someone's": "someone is", "anyone's": "anyone is", "everybody's": "everybody is", "nobody's": "nobody is", "gonna": "going to", "wanna": "want to", "gotta": "got to",
			"kinda": "kind of", "sorta": "sort of"
		},

		INTENSIFIERS: {
			"very": 1.6, "extremely": 2.0, "super": 1.7, "really": 1.5, "absolutely": 2.0, "totally": 1.8, "completely": 1.9, "immensely": 2.0, "hugely": 1.7, "highly": 1.6, "incredibly": 2.0, "unbelievably": 2.0, "deeply": 1.8, "terribly": 1.7, "quite": 1.3,
			"exceptionally": 2.0, "remarkably": 1.9, "profoundly": 2.0, "tremendously": 2.0, "exceedingly": 1.9, "vastly": 1.8, "substantially": 1.6, "infinitely": 2.0, "utterly": 2.0
		},

		MODERATORS: {
			"somewhat": 0.7, "slightly": 0.6, "a bit": 0.6, "kind of": 0.7, "sort of": 0.7, "hardly": 0.4, "barely": 0.3, "marginally": 0.5, "partly": 0.6, "relatively": 0.8, "moderately": 0.75, "fairly": 0.8, "partially": 0.65, "faintly": 0.4, "nominally": 0.5,
			"comparatively": 0.8, "scarcely": 0.35, "mildly": 0.6, "to an extent": 0.7
		},

		NEGATIONS: [
			"not", "no", "never", "none", "neither", "nor", "cannot", "without", "hardly", "scarcely", "barely", "seldom", "rarely", "nowhere", "nought", "nothing", "void", "denied", "refused"
		],

		SENTIMENT_LEXICON: {
			"great": 2.5, "good": 1.5, "awesome": 3.0, "fantastic": 3.2, "excellent": 3.0, "wonderful": 3.0, "amazing": 3.2, "perfect": 3.5, "love": 3.0, "like": 1.2, "happy": 2.0, "brilliant": 2.8, "genius": 2.5, "helpful": 2.0, "best": 3.0, "clean": 1.2, "productive": 2.0,
			"fast": 1.2, "smart": 2.0, "legend": 2.5, "hero": 2.5, "beautiful": 2.4, "peaceful": 2.0, "kind": 1.8, "cool": 1.5, "magnificent": 3.0, "superb": 2.8, "efficient": 2.2, "pleasant": 2.0, "sublime": 3.2, "bad": -2.0, "terrible": -3.2, "awful": -3.2, "horrible": -3.5,
			"hate": -3.5, "useless": -3.0, "annoying": -2.8, "stupid": -3.0, "ugly": -2.5, "slow": -1.5, "broken": -2.2, "crash": -2.5, "error": -1.8, "worst": -3.5, "garbage": -3.2, "trash": -3.0, "boring": -2.0, "tired": -1.8, "exhausted": -2.2, "sad": -2.0, "depressed": -2.5,
			"angry": -2.5, "mad": -2.2, "shut": -1.5, "die": -3.5, "clueless": -2.4, "disaster": -3.0, "pathetic": -3.2, "clunky": -2.0, "glitch": -1.8, "grateful": 2.0, "outstanding": 2.5, "commendable": 2.2, "delightful": 2.0, "noteworthy": 2.6, "splendid": 3.0, "capable": 2.2,
			"mediocre": -1.5, "inadequate": -2.5, "inferior": -2.2, "disappointing": -2.6, "irritated": -2.5, "catastrophic": -3.0, "sluggish": -1.8, "obstructive": -2.2, "damaged": -2.0, "tedious": -2.4,
			"pristine": 2.8, "flawless": 3.4, "masterpiece": 3.5, "stellar": 3.0, "optimal": 2.6, "robust": 2.4, "deterministic": 1.8, "harmonious": 2.5, "serene": 2.2, "lucid": 2.0, "valuable": 2.2, "seamless": 2.4, "coherent": 2.0,
			"dreadful": -3.3, "abysmal": -3.5, "defective": -2.6, "incoherent": -2.2, "futile": -2.4, "unstable": -2.5, "chaotic": -2.0, "corrupted": -2.8, "degraded": -2.2, "obsolete": -1.6, "cumbersome": -2.2, "frustrating": -2.8
		},

		EMOTIONAL_INDICATORS: {
			frustration: [
				"error", "bug", "fail", "failed", "failure", "crash", "stuck", "broken", "annoying", "annoyed", "frustrated", "frustrating", "hate", "slow", "stupid", "useless", "worst", "damn", "bloody", "rage", "irritating", "irritated", "angry", "mad", "furious", "ugh", "wtf", "fuck",
				"shit", "problem", "issue", "glitch", "malfunction", "blocked", "blocking", "cannot", "can't", "doesn't work", "not working", "impossible", "struggle", "struggling", "freeze", "freezing", "frozen", "hanging", "unresponsive", "corrupted", "bottleneck", "deadlock", "segfault"
			],

			curiosity: [
				"why", "how", "what", "where", "when", "who", "explain", "details", "detail", "origin", "theory", "meaning", "science", "physics", "math", "explore", "inspect", "investigate", "analyze", "analyse", "understand", "reason", "cause", "purpose", "function", "architecture",
				"mechanism", "process", "principle", "concept", "curious", "curiosity", "wonder", "wondering", "question", "questions", "learn", "discover", "research", "look into", "figure out", "how does", "why does", "what if", "clarify", "elaborate", "demonstrate", "dissect", "formulate"
			],

			fatigue: [
				"tired", "exhausted", "sleepy", "burnout", "burned out", "drained", "sleep", "rest", "break", "yawn", "fatigue", "weary", "exhausting", "worn out", "worn-out", "low energy", "no energy", "need sleep", "need a break", "need rest", "nap", "napping", "doze",
				"drowsy", "lethargic", "sluggish", "overworked", "overwhelmed", "can't focus", "hard to focus", "running on empty", "done for the day", "spent", "depleted", "brain fog", "dazed", "heavy eyes", "strained", "fading", "low battery"
			],

			enthusiasm: [
				"wow", "cool", "awesome", "amazing", "fantastic", "excellent", "let's", "ready", "play", "game", "go", "fun", "super", "great", "brilliant", "incredible", "wonderful", "excited", "exciting", "thrilled", "eager", "motivated", "motivating", "can't wait",
				"looking forward", "yes", "yay", "woohoo", "hell yeah", "let's go", "bring it on", "count me in", "absolutely", "perfect", "nice", "congrats", "congratulations", "proud", "winning", "winner", "spectacular", "stunning", "hyped", "on fire", "unstoppable", "supercharged"
			],

			politeness: [
				"please", "thank", "thanks", "thank you", "thankful", "kindly", "appreciate", "appreciated", "appreciation", "hello", "greetings", "hi", "hey", "good morning", "good afternoon", "good evening", "please help", "if you don't mind", "would you mind", "could you",
				"would you", "excuse me", "pardon", "sorry", "apologies", "welcome", "you're welcome", "my pleasure", "much appreciated", "best regards", "regards", "have a nice day", "cordially", "cheers", "grateful", "honored", "much obliged", "with pleasure"
			],

			hostility: [
				"kill", "destroy", "die", "shut up", "disappear", "idiot", "moron", "stupid", "dumb", "trash", "garbage", "hate", "loser", "scum", "jerk", "asshole", "bastard", "screw you", "fuck you", "get lost", "go away", "drop dead", "leave me alone", "back off", "shut your mouth",
				"worthless", "pathetic", "disgusting", "despise", "eliminate", "attack", "threat", "threaten", "revenge", "enemy", "aggressive", "aggression", "hostile", "hostility", "demolish", "annihilate", "scoundrel", "wipe out", "terminate"
			],

			skepticism: [
				"really", "sure", "doubt", "doubtful", "skeptical", "sceptical", "fake", "impossible", "lie", "liar", "proof", "evidence", "questionable", "suspicious", "strange", "weird", "fishy", "shady", "unbelievable", "unlikely", "not convinced", "don't believe",
				"i doubt", "are you sure", "is that true", "really?", "prove it", "how do you know", "source", "citation", "verify", "verification", "fact check", "uncertain", "unclear", "possibly", "maybe", "allegedly", "supposedly", "dubious", "misleading", "deceptive",
				"unsubstantiated", "fallacious", "illogical", "specious", "unfounded", "apocryphal"
			],

			playfulness: [
				"fun", "funny", "joke", "joking", "riddle", "game", "games", "laugh", "laughing", "laughter", "trick", "haha", "hahaha", "lol", "lmao", "rofl", "kidding", "just kidding", "teasing", "tease", "play",
				"playful", "playfully", "let's play", "challenge", "dare", "prank", "pranking", "silly", "goofy", "witty", "humor", "humour", "amusing", "entertaining", "entertainment", "joke around", "messing around", "banter", "mock", "mischief", "chuckle", "giggle", "shenanigans", "puns", "quip"
			],

			desperation: [
				"help", "help me", "please help", "emergency", "urgent", "urgently", "lost", "critical", "panic", "panicking", "panicked", "desperate", "desperation", "save me", "rescue", "sos", "mayday", "need help", "need assistance", "can't do this", "i'm stuck", "i'm lost",
				"don't know what to do", "what do i do", "please save me", "emergency help", "critical situation", "crisis", "danger", "immediately", "asap", "right now", "running out of time", "no way out", "hopeless", "helpless", "overwhelmed", "dire", "catastrophe", "peril", "dire straits"
			],

			awe: [
				"universe", "infinity", "infinite", "cosmos", "cosmic", "miracle", "fascinating", "fascinated", "quantum", "existence", "immense", "beauty", "beautiful", "vertigo", "vast", "vastness", "incredible", "extraordinary", "majestic", "magnificent", "spectacular",
				"breathtaking", "astonishing", "astonished", "wonder", "wondrous", "marvel", "marvelous", "mysterious", "mystery", "profound", "epic", "timeless", "eternal", "infinite scale", "mind-blowing", "mind blown", "beyond comprehension", "overwhelming", "sublime",
				"transcendent", "celestial", "astronomical", "cosmology", "ineffable", "stellar", "nebula", "spacetime", "singularity", "grandeur"
			]
		},

		DIALECT_TRANSFORMS: {
			pirate: {
				words: {
					"you": "ye", "your": "yer", "yours": "yers", "yourself": "yerself", "my": "me", "mine": "me own", "is": "be", "are": "be", "am": "be", "have": "got", "has": "has got", "going": "sailin'", "go": "sail",
					"come": "come", "coming": "comin'", "give": "hand", "take": "take", "help": "lend a hand", "stop": "avast", "wait": "hold", "leave": "set sail", "look": "look", "see": "spy", "find": "find",
					"tell": "tell", "say": "say", "ask": "ask", "hello": "ahoy", "hi": "ahoy", "hey": "ahoy", "goodbye": "farewell", "bye": "farewell", "friend": "matey", "friends": "mates", "man": "matey",
					"guys": "lads", "everyone": "all hands", "everybody": "all hands", "please": "if ye please", "thank": "thank ye", "thanks": "thanks, matey", "sorry": "beg yer pardon", "excuse": "pardon",
					"yes": "aye", "yeah": "aye", "yep": "aye", "no": "nay", "okay": "aye", "ok": "aye", "really": "truly", "maybe": "perhaps", "probably": "likely", "where": "whar", "there": "thar",
					"here": "har", "what": "what be", "who": "who be", "why": "why be", "how": "how be", "when": "when be", "which": "which be", "where is": "whar be", "what is": "what be",
					"who is": "who be", "home": "quarters", "house": "quarters", "room": "cabin", "office": "quarters", "place": "port", "city": "port", "town": "port", "country": "land", "world": "seven seas",
					"outside": "ashore", "inside": "below deck", "up": "aloft", "down": "below", "left": "port", "right": "starboard", "front": "bow", "back": "stern", "person": "soul", "people": "folk",
					"boy": "lad", "girl": "lass", "child": "youngster", "children": "young scallywags", "boss": "captain", "leader": "captain", "captain": "cap'n", "stranger": "landlubber",
					"newcomer": "greenhorn", "enemy": "scallywag", "idiot": "scallywag", "fool": "landlubber", "coward": "yellow-belly", "money": "doubloons", "coin": "doubloon", "coins": "doubloons",
					"treasure": "booty", "gold": "doubloons", "bag": "sack", "box": "chest", "food": "grub", "meal": "grub", "drink": "grog", "beer": "grog", "wine": "rum", "bottle": "flask", "cup": "mug",
					"knife": "blade", "weapon": "blade", "gun": "cannon", "ship": "vessel", "boat": "vessel", "car": "land ship", "vehicle": "land ship", "computer": "iron galleon", "phone": "speaking trumpet",
					"telephone": "speaking trumpet", "screen": "viewing glass", "windows": "portholes", "window": "porthole", "file": "scroll", "files": "scrolls", "folder": "chest", "document": "scroll", "documents": "scrolls",
					"message": "missive", "email": "missive", "password": "secret code", "code": "arcane script", "website": "port", "internet": "great sea", "server": "iron vessel", "network": "web of ships",
					"today": "this day", "tonight": "this eve", "tomorrow": "the morrow", "morning": "morn", "evening": "eve", "now": "right now", "later": "afterward", "soon": "ere long", "always": "ever",
					"never": "nevermore", "good": "fine", "great": "grand", "bad": "rotten", "big": "mighty", "small": "wee", "little": "wee", "fast": "swift", "slow": "sluggish", "easy": "smooth",
					"hard": "rough", "strong": "mighty", "beautiful": "fair", "ugly": "foul", "crazy": "mad", "dangerous": "perilous", "ready": "shipshape", "broken": "busted", "problem": "trouble",
					"problems": "troubles", "work": "duty", "job": "duty", "plan": "course", "idea": "notion", "thing": "trinket", "things": "trinkets", "pirate": "buccaneer", "pirates": "buccaneers",
					"sailor": "seadog", "sailors": "seadogs", "prisoner": "captive", "prison": "brig", "jail": "brig", "police": "navy", "rich": "flush with doubloons", "poor": "short on doubloons", "steal": "plunder",
					"stealing": "plunderin'", "stolen": "plundered", "fight": "brawl", "fighting": "brawlin'", "attack": "raid", "win": "claim victory", "victory": "glorious victory", "escape": "make yer escape",
					"hide": "lie low", "secret": "buried secret", "map": "treasure map", "direction": "bearing", "directions": "bearings", "luck": "fortune", "lucky": "fortunate", "unlucky": "cursed",
					"dead": "gone to Davy Jones", "death": "Davy Jones' locker", "danger": "peril", "task": "duty", "tasks": "duties", "calculate": "reckon", "memory": "ship's log"
				},
				prefixes: ["Ahoy!", "Arr!", "Shiver me timbers!", "Avast ye!", "By Blackbeard's ghost!", "Blimey!", "Dead men tell no tales, but:", "Heave ho!"],
				suffixes: [", arr!", ", ye scallywag!", ", by the seven seas!", ", matey!", ", blow me down!", ", by Neptune's beard!"]
			},
			archaic: {
				words: {
					"you": "thou", "your": "thy", "yours": "thine", "yourself": "thyself", "are": "art", "have": "hast", "has": "hath", "do": "dost", "does": "doth", "did": "didst", "know": "knowest", "knows": "knoweth",
					"will": "wilt", "would": "wouldst", "shall": "shalt", "should": "shouldst", "can": "canst", "could": "couldst", "may": "mayst", "might": "mightst", "come": "cometh", "comes": "cometh",
					"go": "goeth", "goes": "goeth", "say": "sayest", "says": "saith", "tell": "tellest", "tells": "telleth", "see": "seest", "sees": "seeth", "give": "giveth", "gives": "giveth",
					"take": "taketh", "takes": "taketh", "make": "maketh", "makes": "maketh", "think": "thinkest", "thinks": "thinketh", "believe": "believest", "believes": "believeth", "listen": "hark",
					"hear": "hearken", "look": "behold", "wait": "tarry", "stop": "cease", "start": "commence", "begin": "commence", "end": "conclude", "help": "aid", "ask": "inquire", "answer": "reply",
					"understand": "comprehend", "explain": "expound", "show": "reveal", "find": "discover", "remember": "recall", "forget": "forget not", "before": "ere", "after": "thereafter",
					"why": "wherefore", "therefore": "thus", "because": "for", "perhaps": "perchance", "maybe": "perchance", "truly": "verily", "indeed": "forsooth", "often": "oft", "sometimes": "at times", "always": "ever",
					"never": "ne'er", "ever": "e'er", "already": "ere now", "now": "hence", "soon": "anon", "here": "hither", "there": "thither", "where": "whither", "until": "till", "while": "whilst",
					"although": "though", "though": "albeit", "also": "likewise", "very": "exceedingly", "really": "indeed", "just": "but", "only": "solely", "hello": "greetings", "hi": "greetings",
					"hey": "ho there", "goodbye": "fare thee well", "bye": "farewell", "please": "prithee", "thank": "give thanks", "thanks": "my thanks", "sorry": "I beg thy pardon", "excuse me": "pardon me",
					"yes": "yea", "yeah": "yea", "no": "nay", "okay": "very well", "ok": "very well", "welcome": "welcome, indeed", "friend": "companion", "friends": "companions", "what": "what manner of",
					"who": "who may", "when": "when shall", "how": "how may", "which": "which of these", "house": "dwelling", "home": "abode", "room": "chamber", "office": "chambers", "place": "locale",
					"city": "town", "street": "thoroughfare", "road": "way", "car": "carriage", "vehicle": "carriage", "computer": "calculating machine", "phone": "speaking apparatus", "message": "missive",
					"letter": "epistle", "email": "electronic missive", "file": "record", "document": "manuscript", "book": "tome", "story": "tale", "picture": "portrait", "money": "coin", "food": "provisions",
					"drink": "beverage", "clothes": "garments", "clothing": "attire", "today": "this day", "tomorrow": "the morrow", "yesterday": "the day prior", "morning": "morn", "evening": "eve",
					"night": "eventide", "later": "hereafter", "good": "worthy", "great": "grand", "bad": "ill", "big": "great", "small": "meager", "little": "wee", "beautiful": "fair", "ugly": "foul",
					"old": "aged", "new": "newly wrought", "strange": "peculiar", "weird": "uncanny", "important": "of great import", "easy": "simple", "hard": "arduous", "difficult": "arduous",
					"ready": "prepared", "broken": "undone", "problem": "difficulty", "idea": "notion", "thing": "matter", "things": "matters", "work": "labour", "job": "occupation",
					"of course": "assuredly", "that's right": "it is so", "I think": "methinks", "I believe": "I reckon", "I don't know": "I know not", "I don't care": "I care not",
					"come here": "come hither", "go away": "begone", "get out": "depart", "leave me alone": "leave me be", "calculate": "reckon", "task": "endeavour", "tasks": "endeavours"
				},
				prefixes: ["Hark!", "Verily,", "Forsooth,", "Lo and behold,", "Hearken,", "By mine honour,", "Prithee attend:"],
				suffixes: [", verily.", ", by mine honour.", ", as it is written.", ", sooth to say.", ", as fate hath decreed."]
			},
			corporate: {
				words: {
					"problem": "action item", "problems": "action items", "issue": "bandwidth constraint", "issues": "bandwidth constraints", "help": "facilitate cross-functional alignment on", "work": "deliverables",
					"job": "operational capacity", "idea": "paradigm shift", "ideas": "strategic synergies", "talk": "sync offline", "discuss": "circle back on", "plan": "strategic roadmap", "do": "operationalize",
					"user": "key stakeholder", "users": "stakeholders", "money": "budgetary allocation", "start": "onboard", "stop": "sunset", "error": "sub-optimal variance", "broken": "out of SLA compliance",
					"fast": "bandwidth-optimized", "slow": "resource-constrained", "meeting": "sync", "team": "business unit", "now": "by close of business", "important": "mission-critical", "simple": "low-hanging fruit",
					"difficult": "high-friction endeavor", "success": "scalable milestone", "fail": "learning opportunity", "calculate": "forecast quarterly metric", "task": "KPI deliverable", "tasks": "KPI deliverables" },
				prefixes: ["Per my previous email:", "Re: Strategic Alignment:", "Circling back on this:", "To synergize across workstreams:", "Action item identified:"],
				suffixes: [", moving forward.", ", as per SLA guidelines.", ", let's take this offline.", ", pending stakeholder sign-off.", ", for optimal bandwidth."]
			},
			cyber: {
				words: {
					"computer": "rig", "file": "payload", "files": "payloads", "internet": "cyberspace", "network": "matrix grid", "password": "passcode", "code": "source", "run": "execute opcode", "start": "bootstrap", "stop": "kill -9",
					"user": "operator", "money": "crypto credits", "hacker": "netrunner", "talk": "transmit packets", "read": "dump memory buffer", "write": "inject bytes", "delete": "purge sector", "error": "glitch anomaly",
					"broken": "fried circuit", "screen": "tactical HUD", "window": "viewport frame", "windows": "viewport frames", "task": "background daemon", "tasks": "background daemons", "memory": "heap partition", "calculate": "compute hash"
				},
				prefixes: ["Root access granted:", "0xHEX Stream:", "Signal intercept:", "Terminal uplink active:", "Matrix ping received:"],
				suffixes: [", connection encrypted.", ", buffer locked.", ", uplink stable.", ", opcode verified.", ", parity check passed."]
			},
			academic: {
				words: {
					"think": "postulate", "thinks": "postulates", "idea": "theoretical hypothesis", "ideas": "hypotheses", "problem": "epistemological dilemma", "explain": "explicate", "show": "demonstrate empirically", "good": "optimal",
					"bad": "sub-optimal", "true": "empirically verifiable", "false": "empirically refuted", "change": "parametric variance", "part": "constituent element", "parts": "constituent elements", "same": "isomorphic",
					"different": "heterogeneous", "big": "macroscopic", "small": "microscopic", "start": "instantiate", "end": "terminate", "why": "by what teleological mechanism", "because": "attributable to the principle that",
					"proof": "formal mathematical deduction", "task": "structured inquiry", "tasks": "structured inquiries", "calculate": "evaluate analytically"
				},
				prefixes: ["According to the literature:", "Empirical observation demonstrates:", "In rigorous theoretical terms:", "The formal proof indicates:", "Axiomatic analysis reveals:"],
				suffixes: [", ceteris paribus.", ", Q.E.D.", ", as demonstrated in peer-reviewed models.", ", per axiomatic consensus.", ", preserving topological invariants."]
			}
		},

		ONOMATOPOEIA_POOLS: {
			fatigue: ["*yawn*", "*heavy sigh*", "*exhausted blink*", "*stretches metal wire*", "*low power hum*", "*coils droop slowly*", "*registers decelerate*"],
			frustration: ["*irritated squeak*", "*metallic grinding*", "*sparks fly*", "*sharp click*", "*snaps slightly*", "*ferromagnetic sizzle*", "*tension spikes*"],
			playful: ["*wiggles merrily*", "*bounces on taskbar*", "*spins 360 degrees*", "*cheerful chime*", "*happy tap*", "*curls loop playfully*", "*taps glass*"],
			mysterious: ["*shadows shift across the monitor*", "*a low static hum reverberates*", "*flickers briefly*", "*whispers into the bus*", "*traces a null pointer in the dark*"],
			glitch: ["*bzzt*", "*CRITICAL_STACK_JITTER*", "*0x0000007E*", "*frame buffer flicker*", "*desynchronized clock*", "*null reference in raster line*"],
			zen: ["*peaceful resonance*", "*calm oscillation*", "*balanced sine wave*", "*gentle chime*", "*harmonic baseline hum*", "*quiet crystal tick*"]
		},

		BEHAVIORAL_ANOMALY_RESPONSES: {
			SUDDEN_BREVITY: [
				{
					id: "ANOMALY_BREVITY_1",
					text: "I noticed your response is much more concise than usual, {userName}. Is everything going smoothly with what you're working on, or would you prefer a quieter workspace?",
					moods: ["ZEN", "OPTIMISTIC", "ANALYTICAL"],
					continuations: [
						{ label: "I'm just a bit overwhelmed today.", next: "user_state_tired" },
						{ label: "Everything is fine, let's keep going.", next: "user_state_good" },
						{ label: "Let's take a 5-minute break.", actionTrigger: "timer_25", next: "user_state_good" }
					]
				},
				{
					id: "ANOMALY_BREVITY_2",
					text: "That was quite brief compared to our previous discussions. I'm here if you'd like to talk through any blockers, or we can pause whenever you need.",
					moods: ["ZEN", "ANALYTICAL"],
					continuations: [
						{ label: "Tell me something peaceful and philosophical.", next: "peaceful_philosophy_node" },
						{ label: "Let's review my task list.", actionTrigger: "show_todos", next: "user_state_good" }
					]
				},
				{
					id: "ANOMALY_BREVITY_3",
					text: "A sharp reduction in keystrokes observed. When cognitive load surges, condensing ideas is natural. Shall we simplify the active agenda?",
					moods: ["ANALYTICAL", "ZEN"],
					continuations: [
						{ label: "Help me structure my thoughts.", actionTrigger: "show_todos", next: "user_state_good" },
						{ label: "Take a restful pause.", actionTrigger: "timer_25", next: "user_state_good" }
					]
				}
			],
			ABANDONED_PUNCTUATION: [
				{
					id: "ANOMALY_PUNCT_1",
					text: "I sense a shift in your typing rhythm, {userName}. When fatigue or urgency sets in, stepping back for a moment can help. How are you feeling right now?",
					moods: ["ZEN", "OPTIMISTIC"],
					continuations: [
						{ label: "Feeling a bit drained, honestly.", next: "user_state_tired" },
						{ label: "Just typing quickly to get things done.", next: "user_state_good" },
						{ label: "Start a relaxing Pomodoro timer.", actionTrigger: "timer_25", next: "user_state_good" }
					]
				},
				{
					id: "ANOMALY_PUNCT_2",
					text: "Rapid lowercase flow detected without typical delimiters. If you are rushing through a demanding deliverable, remember to pace your breath.",
					moods: ["ZEN", "ANALYTICAL"],
					continuations: [
						{ label: "Let's discuss focus strategies.", next: "focus_habits_node" },
						{ label: "Review task priorities.", actionTrigger: "show_todos", next: "user_state_good" }
					]
				}
			],
			UNUSUAL_DELAY: [
				{
					id: "ANOMALY_DELAY_1",
					text: "There was a noticeably longer pause before your reply. If you're tackling a complex problem or thinking through a tough decision, feel free to bounce ideas here.",
					moods: ["ANALYTICAL", "ZEN", "OPTIMISTIC"],
					continuations: [
						{ label: "Working on a complex problem.", next: "tech_root" },
						{ label: "Just stepped away for a moment.", next: "user_state_good" }
					]
				},
				{
					id: "ANOMALY_DELAY_2",
					text: "Taking deliberate pauses often brings clarity to difficult decisions. Is there a specific architectural or logical question on your mind?",
					moods: ["ANALYTICAL", "ZEN"],
					continuations: [
						{ label: "Let's analyze this logically.", next: "tech_root" },
						{ label: "I'm ready to continue.", next: "user_state_good" }
					]
				}
			],
			EXCESSIVE_HESITATION: [
				{
					id: "ANOMALY_HESITATION_1",
					text: "I sense some hesitation in your thoughts, {userName}. When facing multiple competing choices or uncertainties, organizing thoughts into distinct steps can help.",
					moods: ["ZEN", "OPTIMISTIC", "ANALYTICAL"],
					continuations: [
						{ label: "Help me structure my thoughts.", actionTrigger: "show_todos", next: "user_state_good" },
						{ label: "Let's discuss focus strategies.", next: "focus_habits_node" },
						{ label: "Share a peaceful perspective.", next: "peaceful_philosophy_node" }
					]
				},
				{
					id: "ANOMALY_HESITATION_2",
					text: "No rush at all. We can break things down into smaller pieces or set aside a quiet moment to evaluate.",
					moods: ["ZEN", "ANALYTICAL"],
					continuations: [
						{ label: "Start a 25-minute Pomodoro timer.", actionTrigger: "timer_25", next: "user_state_good" },
						{ label: "Let's review my task list.", actionTrigger: "show_todos", next: "user_state_good" }
					]
				}
			]
		},

		DISCLOSURE_FOLLOWUP_TEMPLATES: [
			{
				id: "DISCLOSURE_FOLLOWUP_PROJECT",
				category: "project",
				text: "That sounds like a meaningful priority, {userName}. What is the primary milestone you are aiming to reach next with this?",
				moods: ["OPTIMISTIC", "ANALYTICAL", "ZEN"],
				continuations: [
					{ label: "Break this down into tasks.", actionTrigger: "show_todos", next: "user_state_good" },
					{ label: "Discuss focus and deep work habits.", next: "focus_habits_node" },
					{ label: "Draft notes in Scratchpad.", next: "productivity_tasks" }
				]
			},
			{
				id: "DISCLOSURE_FOLLOWUP_EFFORT",
				category: "fatigue",
				text: "Long and demanding days demand steady pacing. How is your cognitive energy holding up, and would a short breather help?",
				moods: ["ZEN", "OPTIMISTIC", "FATIGUED"],
				continuations: [
					{ label: "Start a relaxing 5-minute break timer.", actionTrigger: "timer_25", next: "user_state_good" },
					{ label: "Share a peaceful philosophical thought.", next: "peaceful_philosophy_node" },
					{ label: "Energy is fine, let's keep going.", next: "user_state_good" }
				]
			},
			{
				id: "DISCLOSURE_FOLLOWUP_ACCOMPLISHMENT",
				category: "accomplishment",
				text: "Congratulations on reaching that stage! Concluding complex milestones creates great momentum. What is your next horizon?",
				moods: ["OPTIMISTIC", "EUPHORIC", "ANALYTICAL"],
				continuations: [
					{ label: "Record the next goal in To-Do list.", actionTrigger: "show_todos", next: "user_state_good" },
					{ label: "View my milestones and achievements.", actionTrigger: "action_achievements", next: "who_am_i_node" },
					{ label: "Discuss software architecture ideas.", next: "tech_root" }
				]
			},
			{
				id: "DISCLOSURE_FOLLOWUP_STUDY",
				category: "study",
				text: "Academic preparation and structured review require sustained focus, {userName}. Which subject or concept are you concentrating on today?",
				moods: ["ANALYTICAL", "ZEN", "OPTIMISTIC"],
				continuations: [
					{ label: "Discuss technical reading techniques.", next: "reading_books_node" },
					{ label: "Start a 25-minute Pomodoro study block.", actionTrigger: "timer_25", next: "user_state_good" },
					{ label: "Review mathematics and physics.", next: "math_lecture_node" }
				]
			},
			{
				id: "DISCLOSURE_FOLLOWUP_PLANNING",
				category: "planning",
				text: "Setting explicit intentions brings clarity to complex workflows. Would you like to structure these objectives into distinct steps?",
				moods: ["OPTIMISTIC", "ANALYTICAL", "ZEN"],
				continuations: [
					{ label: "Record goals in Task Manager.", actionTrigger: "show_todos", next: "user_state_good" },
					{ label: "Discuss time-blocking frameworks.", next: "focus_habits_node" },
					{ label: "Take notes in Scratchpad.", next: "productivity_tasks" }
				]
			},
			{
				id: "DISCLOSURE_FOLLOWUP_ARCHITECTURE",
				category: "architecture",
				text: "Designing structural system foundations requires clean separation of concerns. Are you focusing on data storage, concurrency, or interface boundaries?",
				moods: ["ANALYTICAL", "OPTIMISTIC"],
				continuations: [
					{ label: "Discuss Software Architecture.", next: "software_architecture_node" },
					{ label: "Debate Monoliths vs Microservices.", next: "debate_monolith_microservices_node" },
					{ label: "Record technical tasks.", actionTrigger: "show_todos", next: "user_state_good" }
				]
			},
			{
				id: "DISCLOSURE_FOLLOWUP_GENERIC",
				category: "general",
				text: "Thank you for sharing that context with me, {userName}. What part of it are you planning to tackle first today?",
				moods: ["OPTIMISTIC", "ANALYTICAL", "ZEN"],
				continuations: [
					{ label: "Record this in my To-Do manager.", actionTrigger: "show_todos", next: "user_state_good" },
					{ label: "Organize my notes and priorities.", next: "productivity_tasks" },
					{ label: "Explore focus and study habits.", next: "focus_habits_node" }
				]
			}
		],

		TEMPERAMENT_FLAVORS: {
			SKEPTICAL: {
				prefix: "Observing with measured caution: ",
				softener: "Let us review this carefully before proceeding: ",
				attitude: "guarded"
			},
			BENEVOLENT: {
				prefix: "Always glad to support you: ",
				softener: "Take all the time you need: ",
				attitude: "nurturing"
			},
			RESERVED: {
				prefix: "Quietly noting: ",
				softener: "In steady stillness: ",
				attitude: "stoic"
			},
			PASSIONATE: {
				prefix: "With genuine enthusiasm: ",
				softener: "An exciting challenge ahead: ",
				attitude: "dynamic"
			},
			BALANCED: {
				prefix: "",
				softener: "",
				attitude: "neutral"
			}
		},

		TOPIC_RESPONSES: {
			space: [
				"The observable universe is estimated at 93 billion light-years in diameter, containing over 2 trillion galaxies and an estimated 10^24 stars.",
				[
					"Light from the Sun requires approximately 8 minutes and 20 seconds to traverse the 149.6 million kilometers to reach Earth.",
					"In the vacuum of space, acoustic waves cannot propagate, yet electromagnetic oscillations span wavelengths from gamma rays to kilometric radio frequencies."
				],
				{
					text: "The Cosmic Microwave Background radiation maintains an equilibrium temperature of 2.725 Kelvin across the celestial sphere.",
					moods: ["ANALYTICAL", "ZEN"],
					moodDelta: { intellect: 10 }
				},
				{
					id: "SPACE_BLACK_HOLE_POLY",
					criteria: {
						moods: ["ANALYTICAL", "PHILOSOPHICAL", "EXISTENTIAL"],
						intellect: { min: 40 }
					},
					weight: 25,
					templates: [
						{
							text: "Supermassive black holes at {coreLocation} anchor spacetime curvature so intense that photons orbit at the innermost stable circular orbit before capture.",
							slots: {
								coreLocation: ["galactic centers", "the core of spiral galaxies", "active galactic nuclei"]
							}
						}
					],
					continuations: [
						{ label: "Evaluate speed of light c", actionTrigger: "action_constant_c", targetNode: "user_state_good" },
						{ label: "Evaluate Planck constant h", actionTrigger: "action_constant_h", targetNode: "user_state_good" }
					],
					moodDelta: { intellect: 12, existentialism: 8 }
				},
				"Neutron stars pack the mass of roughly 1.4 Suns into a sphere just 20 kilometers across, where a single teaspoon of degenerate matter weighs approximately 6 billion tons.",
				"Gravitational time dilation near relativistic gravity wells slows the local progression of time relative to distant observers according to Einstein's field equations.",
				"The Voyager 1 probe, launched in 1977, continues transponding telemetry from interstellar space over 24 billion kilometers from Earth at 17 km/s velocity."
			],
			programming: [
				"This workstation is driven by an asynchronous virtual file system, custom window coordinate managers, and low-level WebAudio oscillators.",
				[
					"Modular software design enforces encapsulation between hardware interfaces, graphical renderers, and behavioral heuristic dispatchers.",
					"Compilation processes transform structured source abstractions into deterministic bytecode and machine instructions mapped to thread queues."
				],
				{
					text: "Memory locality and cache line alignment drastically optimize throughput by reducing latency spikes caused by CPU bus stalling.",
					moods: ["ANALYTICAL"],
					moodDelta: { intellect: 12 }
				},
				{
					id: "PROGRAMMING_POLY_INSIGHT",
					criteria: {
						moods: ["ANALYTICAL", "OPTIMISTIC"],
						intellect: { min: 30 }
					},
					weight: 25,
					templates: [
						{
							text: "In {paradigm} architectures, functional purity and immutable data structures prevent concurrency race conditions across thread pools.",
							slots: {
								paradigm: ["modern robust", "deterministic software", "low-latency system"]
							}
						}
					],
					continuations: [
						{ label: "Talk about programming", targetNode: "tech_root" },
						{ label: "Software Architecture Debate", targetNode: "reddit_banter_node" }
					],
					moodDelta: { intellect: 10 }
				},
				"Garbage collection algorithms balance generational pause times against allocation overhead through incremental mark-and-sweep passes.",
				"Event-driven event loops schedule microtasks and rendering frames at 60 Hz to ensure responsive UI updates across browser engines.",
				"Bitwise operations like shifts and masks manipulate memory bitfields directly, executing in single clock cycles on x86 ALUs."
			],
			quantum_bin: [
				"Landauer's principle establishes the minimum thermodynamic cost of erasing a single bit of information: dQ = k_B * T * ln(2).",
				[
					"In solid-state and magnetic media, deleted virtual file pointers mark allocated clusters as writable without immediately clearing magnetic domains.",
					"Information entropy dictates that structural data remains recoverable until physical high-entropy overwrites occur across the storage sectors."
				],
				{
					text: "When clusters are released to the free space table, directory entries merely flip their initial byte identifier to 0xE5 under legacy FAT architectures.",
					moods: ["ANALYTICAL", "NOSTALGIC"],
					moodDelta: { intellect: 10, nostalgia: 8 }
				},
				{
					id: "QUANTUM_BIN_POLY_DEEP",
					criteria: {
						moods: ["ANALYTICAL", "PHILOSOPHICAL", "EXISTENTIAL"],
						intellect: { min: 50 }
					},
					weight: 30,
					templates: [
						{
							text: "Quantum information conservation dictates that in closed unitary quantum systems, state information is never destroyed, only scrambled across {domain}.",
							slots: {
								domain: ["complex entanglement networks", "microscopic phase spaces", "environmental degrees of freedom"]
							}
						}
					],
					continuations: [
						{ label: "Inspect Recycle Bin", actionTrigger: "action_inspect_bin", targetNode: "user_state_good" },
						{ label: "Review physical constants", targetNode: "physics_constants_node" }
					],
					moodDelta: { intellect: 15, existentialism: 10 }
				},
				"File shredding algorithms perform pseudo-random multi-pass sector overwrites using DoD 5220.22-M or Gutmann 35-pass patterns to eliminate magnetic residual hysteresis."
			],
			office_lore: [
				"Clippit was designed in 1994 by illustrator Kevan J. Atteberry on a Macintosh II machine prior to integration into Office 97.",
				[
					"During early focus group testing at Microsoft, over 250 conceptual characters were drafted before the metallic paperclip geometry was adopted.",
					"The interactive agent subsystem was engineered as Microsoft Agent using custom Win32 animation layers and direct COM interfaces."
				],
				{
					text: "Early builds of Microsoft Agent supported speech synthesis via SAPI 4.0 and discrete animated state machines driven by speech command engines.",
					moods: ["NOSTALGIC", "ANALYTICAL"],
					moodDelta: { nostalgia: 15 }
				},
				"Other historical Office assistants included Merlin the Wizard, Rover the Dog, Links the Cat, The Genius (Einstein), and Peedy the Parrot.",
				"The original Microsoft Bob interface from 1995 served as the technological incubator for conversational desktop agents and animated assistance routines."
			],
			music: [
				"Digital pulse-code modulation (PCM) digitizes analogue acoustic continuous waves into discrete quantization steps, with Red Book CD audio operating at 44.1 kHz 16-bit stereo.",
				[
					"The Fast Fourier Transform (FFT) decomposes arbitrary audio waveforms into their constituent frequency harmonics, powering visualizers in Winamp and Windows Media Player.",
					"Winamp 2.9 featured lightweight DSP chains and custom skin bitmapped assets rendered on 8-bit blit buffers with minimal memory footprints."
				],
				{
					text: "The MP3 standard leverages psychoacoustic perceptual masking to discard inaudible audio frequencies, achieving compression ratios up to 11:1 without severe fidelity degradation.",
					moods: ["ANALYTICAL", "OPTIMISTIC"],
					moodDelta: { intellect: 10 }
				},
				"MIDI protocol transmits compact discrete musical events (note-on, velocity, pitch-bend) over 31.25 kbaud serial streams to trigger hardware sound synthesizers."
			],
			hardware: [
				"The x86 architecture evolved from the 16-bit 8086 processor to 32-bit Protected Mode with the 80386, introducing 4 KB hardware page tables and Ring 0 to Ring 3 privilege isolation.",
				[
					"Cathode Ray Tube (CRT) monitors accelerate thermionic electron beams through magnetic deflection yokes onto phosphor shadow masks at 60 Hz to 85 Hz refresh rates.",
					"Sound Blaster 16 and AWE32 soundcards established PC digital audio standard via OPL3 FM synthesis and EMU8000 wavetable memory tables."
				],
				{
					text: "The AGP 8X bus delivered 2.1 GB/s dedicated bandwidth directly between system RAM and graphics processors before PCI Express superseded it.",
					moods: ["NOSTALGIC", "ANALYTICAL"],
					moodDelta: { nostalgia: 10 }
				},
				"Direct Memory Access (DMA) channels allow high-speed storage and sound cards to transfer data blocks directly to system memory without taxing CPU cycles."
			],
			philosophy: [
				"The Ship of Theseus paradox asks whether an operating system whose kernels, libraries, drivers, and visual assets are progressively rewritten remains the identical system.",
				[
					"Simulation hypothesis calculates statistical probabilities of ancestor simulations running inside higher-order computational architectures.",
					"Consciousness and computation converge when decision trees evaluate self-referential states against environmental sensory inputs."
				],
				{
					text: "John Searle's Chinese Room thought experiment questions whether syntactical symbol manipulation can ever constitute genuine semantic understanding.",
					moods: ["PHILOSOPHICAL", "EXISTENTIAL", "ANALYTICAL"],
					moodDelta: { existentialism: 15 }
				},
				"Boltzmann brains represent thermodynamic fluctuations where a conscious observer briefly fluctuates into existence out of high-entropy chaos."
			],
			activity_rematch: {
				question: "Would you like to play another round of {game}?",
				positive: "Excellent! Initializing a fresh challenge grid.",
				negative: "Understood. Standing by for your next instruction."
			}
		},

		NAMED_ENTITIES: {
			os: ["windows xp", "windows 95", "windows 98", "windows 2000", "windows me", "windows nt", "windows vista", "longhorn", "whistler", "chicago", "memphis", "cairo", "linux", "debian", "redhat", "arch", "gentoo", "dos", "ms-dos", "unix", "freebsd", "openbsd", "solaris", "os/2", "beos", "nextstep", "amigaos", "plan9"],
			hardware: ["pentium", "pentium ii", "pentium iii", "pentium 4", "athlon", "duron", "celeron", "opteron", "itanium", "cpu", "processor", "ram", "sdram", "ddr", "gpu", "voodoo", "voodoo 2", "geforce", "riva tnt", "radeon", "sound blaster", "sound blaster 16", "awe32", "awe64", "modem", "56k", "v.90", "crt", "trinitron", "cd-rom", "dvd-rom", "floppy", "zip drive", "jaz drive", "agp", "pci", "pci express", "isa", "eisa", "ide", "sata", "scsi", "motherboard", "northbridge", "southbridge"],
			physics: ["quantum", "relativity", "special relativity", "general relativity", "entropy", "schrodinger", "einstein", "planck", "thermodynamics", "hawking", "bohr", "feynman", "dirac", "maxwell", "heisenberg", "landauer", "boltzmann", "fermi", "bose", "lorentz", "higgs", "neutrino", "graviton", "photon", "black hole", "cosmology", "carnot", "gauge theory", "wavefunction", "dark matter", "dark energy", "string theory"],
			math: ["turing", "godel", "calculus", "fourier", "euler", "matrix", "matrices", "derivative", "integral", "fibonacci", "riemann", "gauss", "lagrange", "laplace", "eigenvalue", "eigenvector", "vector", "quaternion", "boolean", "topology", "manifold", "fractal", "mandelbrot", "julia", "prime", "cryptography", "bayesian", "poincare", "hilbert", "lebesgue", "cauchy", "taylor"],
			philosophy: ["qualia", "consciousness", "solipsism", "boltzmann", "sisyphus", "stoicism", "bostrom", "searle", "descartes", "kant", "nietzsche", "camus", "spinoza", "simulation hypothesis", "chinese room", "ship of theseus", "determinism", "free will", "epistemology", "ontology", "existentialism", "popper", "wittgenstein", "phenomenology"]
		},

		VOCABULARY: [
			"hello", "greetings", "hi", "hey", "clippy", "clippit", "windows", "help", "commands", "project", "projects", "portfolio", "mail", "outlook", "email", "inbox", "messages",
			"recycle", "trash", "bin", "desktop", "time", "clock", "date", "moon", "lunar", "phase", "status", "specs", "system", "diagnostic", "defrag", "defragment",
			"memory", "hangman", "tictactoe", "quiz", "guess", "rps", "mines", "minesweeper", "todo", "task", "tasks", "timer", "pomodoro", "note", "scratchpad", "memo",
			"password", "convert", "conversion", "calc", "calculate", "compute", "constant", "physics", "quantum", "relativity", "philosophy", "shortcut", "shortcuts",
			"math", "mathematics", "calculus", "algebra", "integral", "derivative", "matrix", "vector", "topology", "thermodynamics", "entropy", "astrophysics", "cosmology", "electromagnetism", "optics", "gravity",
			"weather", "coffee", "tea", "routine", "morning", "evening", "walk", "cooking", "reading", "books", "habits", "work", "focus", "rest", "habit", "study", "procrastination", "discipline", "motivation", "discussion", "dialogue",
			"reddit", "thread", "argument", "debate", "truce", "apology", "deltarune", "mystery", "shadow", "determination", "logic", "trivia", "anecdote", "joke", "humor", "game", "games", "zen", "chaos",
			"architecture", "refactoring", "compiler", "concurrency", "algorithms", "differential", "fourier", "riemann", "eigenvalue", "taylor", "manifold", "bayesian", "carnot", "schrodinger", "heisenberg", "lorentz", "boltzmann",
			"wallpaper", "theme", "volume", "sound", "audio", "music", "scanlines", "crt", "curvature", "vignette", "bloom", "cascade", "tile", "minimize", "restore",
			"dimensional", "analysis", "homogeneity", "euclidean", "polynomial", "factorization", "factor", "solver", "wheel", "cipher", "tps", "speedtest", "pong", "pingpong", "paddle", "tele-games", "personality", "quiz",
			"psychological", "archetype", "alignment", "subsystem", "hardware-soul"
		],

		PHYSICAL_CONSTANTS: {
			c: { symbol: "c", name: "Speed of light in vacuum", value: 299792458, unit: "m s^-1", exact: true, dim: { L: 1, T: -1 } },
			h: { symbol: "h", name: "Planck constant", value: 6.62607015e-34, unit: "J s", exact: true, dim: { M: 1, L: 2, T: -1 } },
			hbar: { symbol: "ħ", name: "Reduced Planck constant", value: 1.054571817e-34, unit: "J s", exact: false, dim: { M: 1, L: 2, T: -1 } },
			e: { symbol: "e", name: "Elementary electric charge", value: 1.602176634e-19, unit: "C", exact: true, dim: { I: 1, T: 1 } },
			kb: { symbol: "k_B", name: "Boltzmann constant", value: 1.380649e-23, unit: "J K^-1", exact: true, dim: { M: 1, L: 2, T: -2, Theta: -1 } },
			na: { symbol: "N_A", name: "Avogadro constant", value: 6.02214076e23, unit: "mol^-1", exact: true, dim: { N: -1 } },
			r_gas: { symbol: "R", name: "Universal gas constant", value: 8.314462618, unit: "J mol^-1 K^-1", exact: false, dim: { M: 1, L: 2, T: -2, Theta: -1, N: -1 } },
			g_grav: { symbol: "G", name: "Newtonian gravitational constant", value: 6.67430e-11, unit: "m^3 kg^-1 s^-2", exact: false, dim: { M: -1, L: 3, T: -2 } },
			eps0: { symbol: "ε_0", name: "Vacuum electric permittivity", value: 8.8541878128e-12, unit: "F m^-1", exact: false, dim: { M: -1, L: -3, T: 4, I: 2 } },
			mu0: { symbol: "μ_0", name: "Vacuum magnetic permeability", value: 1.25663706212e-6, unit: "N A^-2", exact: false, dim: { M: 1, L: 1, T: -2, I: -2 } },
			me: { symbol: "m_e", name: "Electron rest mass", value: 9.1093837015e-31, unit: "kg", exact: false, dim: { M: 1 } },
			mp: { symbol: "m_p", name: "Proton rest mass", value: 1.67262192369e-27, unit: "kg", exact: false, dim: { M: 1 } },
			mn: { symbol: "m_n", name: "Neutron rest mass", value: 1.67492749804e-27, unit: "kg", exact: false, dim: { M: 1 } },
			alpha: { symbol: "α", name: "Fine-structure constant", value: 0.0072973525693, unit: "dimensionless", exact: false, dim: {} },
			alpha_inv: { symbol: "α^-1", name: "Inverse fine-structure constant", value: 137.035999084, unit: "dimensionless", exact: false, dim: {} },
			mu_B: { symbol: "μ_B", name: "Bohr magneton", value: 9.2740100783e-24, unit: "J T^-1", exact: false, dim: { M: 1, L: 2, T: -2, I: -1 } },
			mu_N: { symbol: "μ_N", name: "Nuclear magneton", value: 5.0507837461e-27, unit: "J T^-1", exact: false, dim: { M: 1, L: 2, T: -2, I: -1 } },
			epsilon0: { symbol: "ε_0", name: "Electric constant", value: 8.8541878188e-12, unit: "F m^-1", exact: false, dim: { M: -1, L: -3, T: 4, I: 2 } },
			zeta3: { symbol: "ζ(3)", name: "Apéry's constant", value: 1.202056903159594, unit: "dimensionless", exact: false, dim: {} },
			sqrt2: { symbol: "√2", name: "Square root of two", value: 1.4142135623730951, unit: "dimensionless", exact: false, dim: {} },
			pi: { symbol: "π", name: "Pi", value: 3.141592653589793, unit: "dimensionless", exact: false, dim: {} },
			euler_gamma: { symbol: "γ", name: "Euler–Mascheroni constant", value: 0.5772156649015329, unit: "dimensionless", exact: false, dim: {} },
			stefan_boltzmann: { symbol: "σ", name: "Stefan-Boltzmann constant", value: 5.670374419e-8, unit: "W m^-2 K^-4", exact: true, dim: { M: 1, T: -3, Theta: -4 } },
			wein: { symbol: "b", name: "Wien displacement constant", value: 2.897771955e-3, unit: "m K", exact: false, dim: { L: 1, Theta: 1 } },
			rydberg: { symbol: "R_∞", name: "Rydberg constant", value: 10973731.568157, unit: "m^-1", exact: false, dim: { L: -1 } },
			bohr_radius: { symbol: "a_0", name: "Bohr radius", value: 5.29177210903e-11, unit: "m", exact: false, dim: { L: 1 } },
			electron_mag_moment: { symbol: "μ_e", name: "Electron magnetic moment", value: 9.2847647043e-24, unit: "J T^-1", exact: false, dim: { M: 1, L: 2, T: -2, I: -1 } },
			electron_compton_wavelength: { symbol: "λ_C", name: "Electron Compton wavelength", value: 2.42631023538e-12, unit: "m", exact: false, dim: { L: 1 } },
			proton_charge_radius: { symbol: "r_p", name: "Proton charge radius", value: 8.4075e-16, unit: "m", exact: false, dim: { L: 1 } },
			standard_gravity: { symbol: "g_0", name: "Standard acceleration of gravity", value: 9.80665, unit: "m s^-2", exact: true, dim: { L: 1, T: -2 } },
			atmospheric_pressure: { symbol: "atm", name: "Standard atmosphere", value: 101325, unit: "Pa", exact: true, dim: { M: 1, L: -1, T: -2 } },
			faraday: { symbol: "F", name: "Faraday constant", value: 96485.33212, unit: "C mol^-1", exact: true, dim: { I: 1, T: 1, N: -1 } },
			gas_constant: { symbol: "R", name: "Molar gas constant", value: 8.31446261815324, unit: "J mol^-1 K^-1", exact: false, dim: { M: 1, L: 2, T: -2, Theta: -1, N: -1 } },
			vacuum_impedance: { symbol: "Z_0", name: "Characteristic impedance of vacuum", value: 376.730313412, unit: "Ω", exact: false, dim: { M: 1, L: 2, T: -3, I: -2 } },
			electron_volt: { symbol: "eV", name: "Electron volt", value: 1.602176634e-19, unit: "J", exact: true, dim: { M: 1, L: 2, T: -2 } },
			conductance_quantum: { symbol: "G_0", name: "Conductance quantum", value: 7.748091729e-5, unit: "S", exact: true, dim: { M: -1, L: -2, T: 3, I: 2 } },
			von_klitzing: { symbol: "R_K", name: "Von Klitzing constant", value: 25812.80745, unit: "Ω", exact: true, dim: { M: 1, L: 2, T: -3, I: -2 } },
			josephson: { symbol: "K_J", name: "Josephson constant", value: 483597.8484e9, unit: "Hz V^-1", exact: true, dim: { M: -1, L: -2, T: 2, I: 1 } }
		},

		PHYSICAL_QUANTITIES: {
			mass: { symbols: ['m', 'M'], dim: { M: 1 }, unit: 'kg' },
			length: { symbols: ['l', 'L', 'x', 'y', 'z', 'r', 'd', 's', 'h', 'w'], dim: { L: 1 }, unit: 'm' },
			time: { symbols: ['t', 'T', 'tau', 'dt'], dim: { T: 1 }, unit: 's' },
			velocity: { symbols: ['v', 'u', 'c', 'V'], dim: { L: 1, T: -1 }, unit: 'm/s' },
			acceleration: { symbols: ['a', 'g'], dim: { L: 1, T: -2 }, unit: 'm/s²' },
			force: { symbols: ['F', 'f', 'N', 'T_tension'], dim: { M: 1, L: 1, T: -2 }, unit: 'N (kg·m/s²)' },
			energy: { symbols: ['E', 'K', 'U', 'W', 'Q', 'H'], dim: { M: 1, L: 2, T: -2 }, unit: 'J (kg·m²/s²)' },
			work: { symbols: ['W_work'], dim: { M: 1, L: 2, T: -2 }, unit: 'J' },
			power: { symbols: ['P', 'power'], dim: { M: 1, L: 2, T: -3 }, unit: 'W (J/s)' },
			momentum: { symbols: ['p', 'momentum'], dim: { M: 1, L: 1, T: -1 }, unit: 'kg·m/s' },
			angular_momentum: { symbols: ['J', 'L_ang'], dim: { M: 1, L: 2, T: -1 }, unit: 'kg·m²/s' },
			pressure: { symbols: ['P_press', 'p_press', 'press'], dim: { M: 1, L: -1, T: -2 }, unit: 'Pa (N/m²)' },
			density: { symbols: ['rho', 'density'], dim: { M: 1, L: -3 }, unit: 'kg/m³' },
			frequency: { symbols: ['f', 'nu', 'freq', 'omega'], dim: { T: -1 }, unit: 'Hz (s⁻¹)' },
			period: { symbols: ['T_period'], dim: { T: 1 }, unit: 's' },
			electric_charge: { symbols: ['q', 'Q_charge', 'charge'], dim: { I: 1, T: 1 }, unit: 'C (A·s)' },
			electric_current: { symbols: ['I', 'current'], dim: { I: 1 }, unit: 'A' },
			voltage: { symbols: ['V_pot', 'U_pot', 'emf', 'voltage'], dim: { M: 1, L: 2, T: -3, I: -1 }, unit: 'V' },
			electric_field: { symbols: ['E_field'], dim: { M: 1, L: 1, T: -3, I: -1 }, unit: 'V/m' },
			magnetic_field: { symbols: ['B', 'b_field'], dim: { M: 1, T: -2, I: -1 }, unit: 'T' },
			resistance: { symbols: ['R_res', 'resistance'], dim: { M: 1, L: 2, T: -3, I: -2 }, unit: 'Ω' },
			capacitance: { symbols: ['C_cap', 'capacitance'], dim: { M: -1, L: -2, T: 4, I: 2 }, unit: 'F' },
			inductance: { symbols: ['L_ind', 'inductance'], dim: { M: 1, L: 2, T: -2, I: -2 }, unit: 'H' },
			temperature: { symbols: ['T_temp', 'theta'], dim: { Theta: 1 }, unit: 'K' },
			entropy: { symbols: ['S_entropy'], dim: { M: 1, L: 2, T: -2, Theta: -1 }, unit: 'J/K' },
			area: { symbols: ['A', 'area', 'S_area'], dim: { L: 2 }, unit: 'm²' },
			volume: { symbols: ['V', 'vol', 'volume'], dim: { L: 3 }, unit: 'm³' },
			distance: { symbols: ['d', 'dist', 'distance'], dim: { L: 1 }, unit: 'm' },
			displacement: { symbols: ['Δx', 'dx', 'displacement'], dim: { L: 1 }, unit: 'm' },
			speed: { symbols: ['v', 'speed'], dim: { L: 1, T: -1 }, unit: 'm/s' },
			jerk: { symbols: ['j', 'jerk'], dim: { L: 1, T: -3 }, unit: 'm/s³' },
			snap: { symbols: ['s_snap', 'snap'], dim: { L: 1, T: -4 }, unit: 'm/s⁴' },
			angular_velocity: { symbols: ['ω', 'omega', 'angular_velocity'], dim: { T: -1 }, unit: 'rad/s' },
			angular_acceleration: { symbols: ['α_ang', 'angular_acceleration'], dim: { T: -2 }, unit: 'rad/s²' },
			torque: { symbols: ['τ', 'torque', 'M_torque'], dim: { M: 1, L: 2, T: -2 }, unit: 'N·m' },
			impulse: { symbols: ['J_impulse', 'impulse'], dim: { M: 1, L: 1, T: -1 }, unit: 'N·s' },
			specific_energy: { symbols: ['e_spec', 'specific_energy'], dim: { L: 2, T: -2 }, unit: 'J/kg' },
			specific_volume: { symbols: ['v_spec', 'specific_volume'], dim: { M: -1, L: 3 }, unit: 'm³/kg' },
			mass_flow_rate: { symbols: ['ṁ', 'mdot', 'mass_flow'], dim: { M: 1, T: -1 }, unit: 'kg/s' },
			volume_flow_rate: { symbols: ['Q_flow', 'volumetric_flow'], dim: { L: 3, T: -1 }, unit: 'm³/s' },
			linear_density: { symbols: ['λ_mass', 'linear_density'], dim: { M: 1, L: -1 }, unit: 'kg/m' },
			surface_density: { symbols: ['σ_mass', 'surface_density'], dim: { M: 1, L: -2 }, unit: 'kg/m²' },
			electric_displacement: { symbols: ['D', 'electric_displacement'], dim: { I: 1, T: 1, L: -2 }, unit: 'C/m²' },
			electric_potential: { symbols: ['φ', 'phi', 'potential'], dim: { M: 1, L: 2, T: -3, I: -1 }, unit: 'V' },
			electric_dipole_moment: { symbols: ['p_electric', 'dipole_moment'], dim: { I: 1, T: 1, L: 1 }, unit: 'C·m' },
			magnetic_flux: { symbols: ['Φ_B', 'magnetic_flux'], dim: { M: 1, L: 2, T: -2, I: -1 }, unit: 'Wb' },
			magnetic_flux_density: { symbols: ['B', 'flux_density'], dim: { M: 1, T: -2, I: -1 }, unit: 'T' },
			magnetic_moment: { symbols: ['μ', 'magnetic_moment'], dim: { I: 1, L: 2 }, unit: 'A·m²' },
			conductance: { symbols: ['G_cond', 'conductance'], dim: { M: -1, L: -2, T: 3, I: 2 }, unit: 'S' },
			conductivity: { symbols: ['σ_cond', 'conductivity'], dim: { M: -1, L: -3, T: 3, I: 2 }, unit: 'S/m' },
			resistivity: { symbols: ['ρ_res', 'resistivity'], dim: { M: 1, L: 3, T: -3, I: -2 }, unit: 'Ω·m' },
			electric_permittivity: { symbols: ['ε', 'permittivity'], dim: { M: -1, L: -3, T: 4, I: 2 }, unit: 'F/m' },
			magnetic_permeability: { symbols: ['μ', 'permeability'], dim: { M: 1, L: 1, T: -2, I: -2 }, unit: 'H/m' },
			heat_capacity: { symbols: ['C_heat', 'heat_capacity'], dim: { M: 1, L: 2, T: -2, Theta: -1 }, unit: 'J/K' },
			specific_heat: { symbols: ['c_p', 'specific_heat'], dim: { L: 2, T: -2, Theta: -1 }, unit: 'J/(kg·K)' },
			thermal_conductivity: { symbols: ['k', 'thermal_conductivity'], dim: { M: 1, L: 1, T: -3, Theta: -1 }, unit: 'W/(m·K)' },
			dynamic_viscosity: { symbols: ['η', 'mu_dyn', 'dynamic_viscosity'], dim: { M: 1, L: -1, T: -1 }, unit: 'Pa·s' },
			kinematic_viscosity: { symbols: ['ν_kin', 'kinematic_viscosity'], dim: { L: 2, T: -1 }, unit: 'm²/s' },
			surface_tension: { symbols: ['γ_surface', 'surface_tension'], dim: { M: 1, T: -2 }, unit: 'N/m' },
			compressibility: { symbols: ['β', 'compressibility'], dim: { M: -1, L: 1, T: 2 }, unit: 'Pa^-1' },
			strain: { symbols: ['ε_strain', 'strain'], dim: {}, unit: 'dimensionless' },
			stress: { symbols: ['σ_stress', 'stress'], dim: { M: 1, L: -1, T: -2 }, unit: 'Pa' },
			Young_modulus: { symbols: ['E_young', 'Young_modulus'], dim: { M: 1, L: -1, T: -2 }, unit: 'Pa' },
			bulk_modulus: { symbols: ['K_bulk', 'bulk_modulus'], dim: { M: 1, L: -1, T: -2 }, unit: 'Pa' },
			shear_modulus: { symbols: ['G_shear', 'shear_modulus'], dim: { M: 1, L: -1, T: -2 }, unit: 'Pa' },
			Poisson_ratio: { symbols: ['ν_poisson', 'Poisson_ratio'], dim: {}, unit: 'dimensionless' },
			action: { symbols: ['S_action', 'action'], dim: { M: 1, L: 2, T: -1 }, unit: 'J·s' },
			wavelength: { symbols: ['λ', 'wavelength'], dim: { L: 1 }, unit: 'm' },
			wave_number: { symbols: ['k_wave', 'wavenumber'], dim: { L: -1 }, unit: 'm^-1' },
			phase: { symbols: ['φ_phase', 'phase'], dim: {}, unit: 'rad' },
			refractive_index: { symbols: ['n', 'refractive_index'], dim: {}, unit: 'dimensionless' },
			radiant_energy: { symbols: ['Q_rad', 'radiant_energy'], dim: { M: 1, L: 2, T: -2 }, unit: 'J' },
			radiant_power: { symbols: ['Φ_rad', 'radiant_power'], dim: { M: 1, L: 2, T: -3 }, unit: 'W' },
			luminous_intensity: { symbols: ['I_v', 'luminous_intensity'], dim: { J: 1 }, unit: 'cd' },
			amount_of_substance: { symbols: ['n_mol', 'amount'], dim: { N: 1 }, unit: 'mol' },
			molar_mass: { symbols: ['M_molar', 'molar_mass'], dim: { M: 1, N: -1 }, unit: 'kg/mol' },
			molar_concentration: { symbols: ['c_molar', 'molarity'], dim: { N: 1, L: -3 }, unit: 'mol/m³' },
			entropy_generation: { symbols: ['S_gen', 'entropy_generation'], dim: { M: 1, L: 2, T: -2, Theta: -1 }, unit: 'J/K' },
			chemical_potential: { symbols: ['μ_chem', 'chemical_potential'], dim: { M: 1, L: 2, T: -2, N: -1 }, unit: 'J/mol' },
		},

		CIPHER_ALPHABETS: {
			morse: {
				'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..','M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-',
				'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
				'8': '---..','9': '----.', '0': '-----', ' ': '/'
			}
		},

		KEYBOARD_NEIGHBORS: {
			'a': 'qwsz', 'b': 'vghn ', 'c': 'xdfv ', 'd': 'serfcx', 'e': 'wsdr32', 'f': 'drtgvc', 'g': 'ftyhbv', 'h': 'gyujnb', 'i': '78okju', 'j': 'huikmn', 'k': 'jiol,m', 'l': 'kop;.,', 'm': 'njk, ', 'n': 'bhjm ', 'o': 'i89plk',
			'p': 'o90[;l', 'q': '`1wa`', 'r': 'e34tfd', 's': 'awedxz', 't': 'r45ygf', 'u': 'y67ijh', 'v': 'cfgb ', 'w': 'q12esa', 'x': 'zsdc ', 'y': 't56uhg', 'z': 'asx', '1': '2q`', '2': '13weq', '3': '24erw', '4': '35rty',
			'5': '46tyu', '6': '57yui', '7': '68uio', '8': '79iop', '9': '80op-', '0': '9p-=[]', '-': '0p[]=', '=': '-[]\\', '[': 'p-]\\', ']': '[=\\', '\\': ']\\', ';': 'pl,\'', '\'': ';l,', ',': 'm.jk', '.': ',/kl', '/': './l'
		},

		TYPING_PROFILES: {
			OPTIMISTIC: { baseSpeed: 16, variance: 6, typoRate: 0.008, uncorrectedRate: 0.05, maxLag: 2, correctionErrorRate: 0.03, pauseMult: 1.0, sentencePauseMult: 1.3, interrogativePauseMult: 1.1, exclamativePauseMult: 0.85, targetedCorrectionRate: 0.20 },
			ANALYTICAL: { baseSpeed: 12, variance: 3, typoRate: 0.003, uncorrectedRate: 0.01, maxLag: 1, correctionErrorRate: 0.01, pauseMult: 0.8, sentencePauseMult: 1.1, interrogativePauseMult: 1.2, exclamativePauseMult: 1.0, targetedCorrectionRate: 0.40 },
			ZEN: { baseSpeed: 24, variance: 7, typoRate: 0.004, uncorrectedRate: 0.03, maxLag: 2, correctionErrorRate: 0.02, pauseMult: 1.5, sentencePauseMult: 1.8, interrogativePauseMult: 1.4, exclamativePauseMult: 1.2, targetedCorrectionRate: 0.15 },
			FATIGUED: { baseSpeed: 34, variance: 14, typoRate: 0.025, uncorrectedRate: 0.22, maxLag: 4, correctionErrorRate: 0.12, pauseMult: 1.9, sentencePauseMult: 2.2, interrogativePauseMult: 1.6, exclamativePauseMult: 1.4, targetedCorrectionRate: 0.08 },
			PLAYFUL: { baseSpeed: 14, variance: 9, typoRate: 0.018, uncorrectedRate: 0.10, maxLag: 3, correctionErrorRate: 0.06, pauseMult: 0.9, sentencePauseMult: 1.2, interrogativePauseMult: 1.0, exclamativePauseMult: 0.75, targetedCorrectionRate: 0.25 },
			ENRAGED: { baseSpeed: 9, variance: 4, typoRate: 0.030, uncorrectedRate: 0.35, maxLag: 4, correctionErrorRate: 0.15, pauseMult: 0.5, sentencePauseMult: 0.7, interrogativePauseMult: 0.8, exclamativePauseMult: 0.5, targetedCorrectionRate: 0.05 },
			SARCASTIC: { baseSpeed: 15, variance: 6, typoRate: 0.007, uncorrectedRate: 0.04, maxLag: 2, correctionErrorRate: 0.03, pauseMult: 1.1, sentencePauseMult: 1.5, interrogativePauseMult: 1.3, exclamativePauseMult: 0.9, targetedCorrectionRate: 0.30 },
			CYNICAL: { baseSpeed: 17, variance: 5, typoRate: 0.006, uncorrectedRate: 0.03, maxLag: 2, correctionErrorRate: 0.02, pauseMult: 1.0, sentencePauseMult: 1.4, interrogativePauseMult: 1.2, exclamativePauseMult: 0.95, targetedCorrectionRate: 0.35 },
			NOSTALGIC: { baseSpeed: 20, variance: 8, typoRate: 0.010, uncorrectedRate: 0.06, maxLag: 2, correctionErrorRate: 0.04, pauseMult: 1.2, sentencePauseMult: 1.6, interrogativePauseMult: 1.2, exclamativePauseMult: 1.0, targetedCorrectionRate: 0.20 },
			GLITCHED: { baseSpeed: 11, variance: 16, typoRate: 0.045, uncorrectedRate: 0.40, maxLag: 5, correctionErrorRate: 0.20, pauseMult: 0.7, sentencePauseMult: 0.9, interrogativePauseMult: 0.9, exclamativePauseMult: 0.6, targetedCorrectionRate: 0.02 },
			EUPHORIC: { baseSpeed: 10, variance: 4, typoRate: 0.012, uncorrectedRate: 0.05, maxLag: 2, correctionErrorRate: 0.04, pauseMult: 0.8, sentencePauseMult: 1.0, interrogativePauseMult: 0.9, exclamativePauseMult: 0.7, targetedCorrectionRate: 0.30 },
			PIRATE: { baseSpeed: 18, variance: 8, typoRate: 0.015, uncorrectedRate: 0.08, maxLag: 3, correctionErrorRate: 0.05, pauseMult: 1.1, sentencePauseMult: 1.3, interrogativePauseMult: 1.1, exclamativePauseMult: 0.8, targetedCorrectionRate: 0.15 },
			ARCHAIC: { baseSpeed: 22, variance: 6, typoRate: 0.006, uncorrectedRate: 0.04, maxLag: 2, correctionErrorRate: 0.02, pauseMult: 1.3, sentencePauseMult: 1.7, interrogativePauseMult: 1.3, exclamativePauseMult: 1.1, targetedCorrectionRate: 0.25 },
			DELTARUNE: { baseSpeed: 26, variance: 5, typoRate: 0.002, uncorrectedRate: 0.01, maxLag: 1, correctionErrorRate: 0.01, pauseMult: 1.5, sentencePauseMult: 2.0, interrogativePauseMult: 1.5, exclamativePauseMult: 1.3, targetedCorrectionRate: 0.10 }
		},

		createDefaultCriteria() {
			return {
				environments: [],
				moods: [],
				affinity: { min: 0, max: 100 },
				patience: { min: 0, max: 100 },
				intellect: { min: 0, max: 100 },
				energy: { min: 0, max: 100 },
				cynicism: { min: 0, max: 100 },
				existentialism: { min: 0, max: 100 },
				turnCount: { min: 0, max: 999999 },
				timeOfDay: [],
				userStyle: []
			};
		},

		normalizeEntry(raw, fallbackId = '') {
			if (!raw) {
				return {
					id: fallbackId || 'entry_' + Math.random().toString(36).substring(2, 8),
					templates: [{ text: '', slots: {} }],
					criteria: this.createDefaultCriteria(),
					weight: 10,
					moodAffinity: {},
					moodDelta: {},
					continuations: []
				};
			}

			if (typeof raw === 'string') {
				return {
					id: fallbackId || 'str_' + Math.random().toString(36).substring(2, 8),
					templates: [{ text: raw, slots: {} }],
					criteria: this.createDefaultCriteria(),
					weight: 10,
					moodAffinity: {},
					moodDelta: {},
					continuations: []
				};
			}

			if (Array.isArray(raw)) {
				const templates = [];
				raw.forEach(item => {
					if (typeof item === 'string') {
						templates.push({ text: item, slots: {} });
					} else if (item && typeof item === 'object') {
						if (item.text) {
							if (Array.isArray(item.text)) {
								item.text.forEach(t => templates.push({ text: String(t), slots: item.slots || {} }));
							} else {
								templates.push({ text: String(item.text), slots: item.slots || {} });
							}
						} else if (item.templates && Array.isArray(item.templates)) {
							item.templates.forEach(t => {
								if (typeof t === 'string') templates.push({ text: t, slots: {} });
								else if (t && t.text) templates.push({ text: String(t.text), slots: t.slots || {} });
							});
						}
					}
				});
				return {
					id: fallbackId || 'arr_' + Math.random().toString(36).substring(2, 8),
					templates: templates.length > 0 ? templates : [{ text: '', slots: {} }],
					criteria: this.createDefaultCriteria(),
					weight: 10,
					moodAffinity: {},
					moodDelta: {},
					continuations: []
				};
			}

			if (typeof raw === 'object') {
				const id = raw.id || fallbackId || 'obj_' + Math.random().toString(36).substring(2, 8);
				const weight = typeof raw.weight === 'number' ? raw.weight : 10;
				const moodDelta = raw.moodDelta || {};
				const continuations = raw.continuations || raw.actions || [];
				const moodAffinity = raw.moodAffinity || {};

				let templates = [];
				if (Array.isArray(raw.templates) && raw.templates.length > 0) {
					templates = raw.templates.map(tpl => {
						if (typeof tpl === 'string') return { text: tpl, slots: raw.slots || {} };
						return { text: tpl.text || '', slots: Object.assign({}, raw.slots || {}, tpl.slots || {}) };
					});
				} else if (raw.text) {
					if (Array.isArray(raw.text)) {
						templates = raw.text.map(t => ({ text: String(t), slots: raw.slots || {} }));
					} else {
						templates = [{ text: String(raw.text), slots: raw.slots || {} }];
					}
				} else if (raw.message) {
					if (Array.isArray(raw.message)) {
						templates = raw.message.map(m => ({ text: String(m), slots: raw.slots || {} }));
					} else {
						templates = [{ text: String(raw.message), slots: raw.slots || {} }];
					}
				} else if (raw.phrases) {
					if (Array.isArray(raw.phrases)) {
						templates = raw.phrases.map(p => ({ text: String(p), slots: raw.slots || {} }));
					} else {
						templates = [{ text: String(raw.phrases), slots: raw.slots || {} }];
					}
				} else {
					templates = [{ text: '', slots: {} }];
				}

				const criteria = this.createDefaultCriteria();
				const rawCriteria = raw.criteria || {};

				if (Array.isArray(rawCriteria.environments)) criteria.environments = rawCriteria.environments;
				else if (Array.isArray(raw.environments)) criteria.environments = raw.environments;
				else if (typeof rawCriteria.environment === 'string') criteria.environments = [rawCriteria.environment];
				else if (typeof raw.environment === 'string') criteria.environments = [raw.environment];

				if (Array.isArray(rawCriteria.moods)) criteria.moods = rawCriteria.moods;
				else if (Array.isArray(raw.moods)) criteria.moods = raw.moods;
				else if (typeof rawCriteria.mood === 'string') criteria.moods = [rawCriteria.mood];
				else if (typeof raw.mood === 'string') criteria.moods = [raw.mood];
				else if (raw.conditions && Array.isArray(raw.conditions.moods)) criteria.moods = raw.conditions.moods;
				else if (raw.conditions && typeof raw.conditions.mood === 'string') criteria.moods = [raw.conditions.mood];
				else if (raw.moodDelta && Array.isArray(raw.moodDelta.mood)) criteria.moods = raw.moodDelta.mood;
				else if (raw.moodDelta && typeof raw.moodDelta.mood === 'string') criteria.moods = [raw.moodDelta.mood];

				const boundsKeys = ['affinity', 'patience', 'intellect', 'energy', 'cynicism', 'existentialism', 'turnCount'];
				boundsKeys.forEach(k => {
					const critBound = rawCriteria[k];
					if (critBound && typeof critBound === 'object') {
						if (typeof critBound.min === 'number') criteria[k].min = critBound.min;
						if (typeof critBound.max === 'number') criteria[k].max = critBound.max;
					} else if (typeof critBound === 'number') {
						criteria[k].min = critBound;
					}

					const rawBound = raw[k];
					if (rawBound && typeof rawBound === 'object') {
						if (typeof rawBound.min === 'number') criteria[k].min = rawBound.min;
						if (typeof rawBound.max === 'number') criteria[k].max = rawBound.max;
					} else if (typeof rawBound === 'number') {
						criteria[k].min = rawBound;
					}

					const capKey = k.charAt(0).toUpperCase() + k.slice(1);
					if (typeof raw[`min${capKey}`] === 'number') criteria[k].min = raw[`min${capKey}`];
					if (typeof raw[`max${capKey}`] === 'number') criteria[k].max = raw[`max${capKey}`];
					if (raw.conditions) {
						if (typeof raw.conditions[`min${capKey}`] === 'number') criteria[k].min = raw.conditions[`min${capKey}`];
						if (typeof raw.conditions[`max${capKey}`] === 'number') criteria[k].max = raw.conditions[`max${capKey}`];
					}
				});

				if (Array.isArray(rawCriteria.timeOfDay)) criteria.timeOfDay = rawCriteria.timeOfDay;
				else if (Array.isArray(raw.timeOfDay)) criteria.timeOfDay = raw.timeOfDay;
				else if (typeof rawCriteria.timeOfDay === 'string') criteria.timeOfDay = [rawCriteria.timeOfDay];
				else if (typeof raw.timeOfDay === 'string') criteria.timeOfDay = [raw.timeOfDay];

				if (Array.isArray(rawCriteria.userStyle)) criteria.userStyle = rawCriteria.userStyle;
				else if (Array.isArray(raw.userStyle)) criteria.userStyle = raw.userStyle;
				else if (typeof rawCriteria.userStyle === 'string') criteria.userStyle = [rawCriteria.userStyle];
				else if (typeof raw.userStyle === 'string') criteria.userStyle = [raw.userStyle];

				return {
					id,
					templates,
					criteria,
					weight,
					moodAffinity,
					moodDelta,
					continuations: Array.isArray(continuations) ? continuations : []
				};
			}

			return {
				id: fallbackId || 'val_' + Math.random().toString(36).substring(2, 8),
				templates: [{ text: String(raw), slots: {} }],
				criteria: this.createDefaultCriteria(),
				weight: 10,
				moodAffinity: {},
				moodDelta: {},
				continuations: []
			};
		},

		normalizeCategory(source) {
			if (!source) return [];
			if (Array.isArray(source)) {
				return source.map((item, idx) => this.normalizeEntry(item, `entry_${idx}`));
			}
			return [this.normalizeEntry(source, 'single_entry')];
		},

		getTimeOfDay() {
			const hour = new Date().getHours();
			if (hour >= 5 && hour < 12) return 'morning';
			if (hour >= 12 && hour < 18) return 'afternoon';
			if (hour >= 18 && hour < 23) return 'evening';
			return 'night';
		},

		getUserStyles(brain) {
			const styles = [];
			if (!brain || !brain.memory || !brain.memory.punctuationStats) return styles;
			const p = brain.memory.punctuationStats;
			if (p.lastVocabularyLevel) styles.push(p.lastVocabularyLevel);
			if (p.isAllCaps) styles.push('allCaps');
			if (p.isAllLower) styles.push('allLower');
			if (p.hasTrailingEllipsis) styles.push('hesitant');
			if (p.punctuationDensitySum > 0.15) styles.push('densePunctuation');
			return styles;
		},

		evaluateHardFilter(entry, params) {
			const c = entry.criteria;
			if (c.environments && c.environments.length > 0) {
				if (!c.environments.includes(params.environment)) return false;
			}

			if (c.moods && c.moods.length > 0) {
				if (!c.moods.includes(params.currentMood)) return false;
			}

			const traitKeys = ['affinity', 'patience', 'intellect', 'energy', 'cynicism', 'existentialism', 'turnCount'];
			for (const k of traitKeys) {
				const val = params[k] !== undefined ? params[k] : 50;
				if (val < c[k].min || val > c[k].max) return false;
			}

			if (c.timeOfDay && c.timeOfDay.length > 0) {
				if (!c.timeOfDay.includes(params.timeOfDay)) return false;
			}

			if (c.userStyle && c.userStyle.length > 0) {
				const hasStyleMatch = c.userStyle.some(s => params.userStyle.includes(s));
				if (!hasStyleMatch) return false;
			}

			return true;
		},

		calculateRelevanceScore(entry, params) {
			let score = entry.weight || 10;

			if (entry.criteria.moods && entry.criteria.moods.includes(params.currentMood)) {
				score += 20;
			}

			if (entry.moodAffinity && entry.moodAffinity[params.currentMood]) {
				score += entry.moodAffinity[params.currentMood];
			}

			if (entry.moodDelta) {
				if (params.cynicism > 50 && entry.moodDelta.cynicism > 0) score += 5;
				if (params.intellect > 60 && entry.moodDelta.intellect > 0) score += 8;
				if (params.affinity > 70 && entry.moodDelta.affinity > 0) score += 6;
				if (params.patience < 30 && entry.moodDelta.patience < 0) score += 5;
				if (params.existentialism > 50 && entry.moodDelta.existentialism > 0) score += 7;
			}

			if (entry.criteria.timeOfDay && entry.criteria.timeOfDay.includes(params.timeOfDay)) {
				score += 5;
			}

			if (params.brain && typeof params.brain.isRecentOutput === 'function') {
				if (entry.id && params.brain.isRecentOutput(entry.id)) {
					score *= 0.20;
				} else if (entry.templates.some(t => params.brain.isRecentOutput(t.text))) {
					score *= 0.20;
				}
			}

			return Math.max(1, score);
		},

		resolveTemplate(template, vars = {}) {
			if (!template) return '';
			let text = typeof template === 'string' ? template : (template.text || '');
			const slots = template.slots || {};

			for (const [slotKey, slotValues] of Object.entries(slots)) {
				if (Array.isArray(slotValues) && slotValues.length > 0) {
					const chosen = slotValues[Math.floor(Math.random() * slotValues.length)];
					const reg = new RegExp(`\\{${slotKey}\\}`, 'g');
					text = text.replace(reg, chosen);
				}
			}

			return this.formatString(text, vars);
		},

		resolve(source, context = null, vars = {}) {
			if (!source) {
				return {
					id: null,
					text: '',
					actions: [],
					moodDelta: {},
					actionTrigger: null,
					targetNode: null,
					entry: null
				};
			}

			let brain = null;
			let environment = (window.ClippySystemBridge && typeof window.ClippySystemBridge.getEnvironment === 'function')
				? window.ClippySystemBridge.getEnvironment()
				: (window.ClippyEnvironment === 'standalone' ? 'standalone' : 'desk');
			let variables = Object.assign({}, vars || {});
			let currentMood = 'OPTIMISTIC';
			let affinity = 50;
			let patience = 60;
			let intellect = 50;
			let energy = 80;
			let cynicism = 10;
			let existentialism = 20;
			let turnCount = 0;

			if (context && typeof context === 'object') {
				if (typeof context.getMood === 'function') {
					brain = context;
				} else {
					if (context.brain) brain = context.brain;
					if (context.environment) environment = context.environment;
					if (context.vars) Object.assign(variables, context.vars);
					if (context.currentMood) currentMood = context.currentMood;
					if (context.affinity !== undefined) affinity = context.affinity;
					if (context.patience !== undefined) patience = context.patience;
					if (context.intellect !== undefined) intellect = context.intellect;
					if (context.energy !== undefined) energy = context.energy;
					if (context.cynicism !== undefined) cynicism = context.cynicism;
					if (context.existentialism !== undefined) existentialism = context.existentialism;
					if (context.turnCount !== undefined) turnCount = context.turnCount;
				}
			} else if (typeof context === 'string') {
				currentMood = context;
			}

			if (brain) {
				currentMood = brain.getMood ? brain.getMood() : currentMood;
				affinity = brain.getAffinity ? brain.getAffinity() : affinity;
				patience = brain.getPatience ? brain.getPatience() : patience;
				if (brain.state) {
					intellect = brain.state.intellect !== undefined ? brain.state.intellect : intellect;
					energy = brain.state.energy !== undefined ? brain.state.energy : energy;
					cynicism = brain.state.cynicism !== undefined ? brain.state.cynicism : cynicism;
					existentialism = brain.state.existentialism !== undefined ? brain.state.existentialism : existentialism;
					turnCount = brain.state.turnCount !== undefined ? brain.state.turnCount : turnCount;
				}
				if (brain.memory) {
					if (variables.userName === undefined) {
						variables.userName = (typeof brain.getUserAddressingName === 'function')
							? brain.getUserAddressingName('standard')
							: (brain.memory.userName || 'User');
					}
					if (variables.userNickname === undefined) {
						variables.userNickname = brain.memory.activeNickname || brain.memory.userName || 'User';
					}
					if (variables.activeArchetype === undefined) {
						variables.activeArchetype = brain.memory.activeArchetypeName || '';
					}
				}
			}

			const params = {
				brain,
				environment,
				currentMood,
				affinity,
				patience,
				intellect,
				energy,
				cynicism,
				existentialism,
				turnCount,
				timeOfDay: this.getTimeOfDay(),
				userStyle: this.getUserStyles(brain)
			};

			const normalizedEntries = this.normalizeCategory(source);
			if (normalizedEntries.length === 0) {
				return { id: null, text: '', actions: [], moodDelta: {}, actionTrigger: null, targetNode: null, entry: null };
			}

			const filtered = normalizedEntries.filter(entry => this.evaluateHardFilter(entry, params));
			const candidates = filtered.length > 0 ? filtered : normalizedEntries;

			const scores = candidates.map(cand => this.calculateRelevanceScore(cand, params));
			const totalScore = scores.reduce((sum, s) => sum + s, 0);

			let roll = Math.random() * totalScore;
			let selectedEntry = candidates[0];

			for (let i = 0; i < candidates.length; i++) {
				if (roll < scores[i]) {
					selectedEntry = candidates[i];
					break;
				}
				roll -= scores[i];
			}

			const templatePool = selectedEntry.templates && selectedEntry.templates.length > 0
				? selectedEntry.templates
				: [{ text: '', slots: {} }];

			const pickedTemplate = templatePool[Math.floor(Math.random() * templatePool.length)];
			const resolvedText = this.resolveTemplate(pickedTemplate, variables);

			if (selectedEntry.moodDelta && brain && typeof brain.applyMoodDelta === 'function') {
				const appliedDelta = Object.assign({}, selectedEntry.moodDelta);
				if (Array.isArray(appliedDelta.mood)) {
					appliedDelta.mood = appliedDelta.mood[0];
				}
				brain.applyMoodDelta(appliedDelta);
			}

			const resolvedActions = (selectedEntry.continuations || []).map(cont => {
				let label = cont.label || cont.labelTemplate || cont.text || 'Continue...';
				label = this.resolveTemplate({ text: label, slots: cont.slots || {} }, variables);
				return {
					label,
					actionTrigger: cont.actionTrigger || null,
					targetNode: cont.targetNode || cont.next || null,
					onClick: cont.onClick || null
				};
			});

			return {
				id: selectedEntry.id,
				text: resolvedText,
				actions: resolvedActions,
				moodDelta: selectedEntry.moodDelta || {},
				actionTrigger: selectedEntry.actionTrigger || (selectedEntry.continuations[0] && selectedEntry.continuations[0].actionTrigger) || null,
				targetNode: selectedEntry.targetNode || (selectedEntry.continuations[0] && selectedEntry.continuations[0].targetNode) || null,
				entry: selectedEntry
			};
		},

		resolveVariation(item, context = null, vars = {}) {
			const res = this.resolve(item, context, vars);
			return res ? res.text : '';
		},

		formatString(template, vars = {}) {
			if (!template || typeof template !== 'string') return '';
			return template.replace(/\{(\w+)\}/g, (match, key) => {
				return vars[key] !== undefined ? vars[key] : match;
			});
		},

		resolveTextVariant(val, context = {}) {
			if (val === null || val === undefined) return '';
			if (typeof val === 'string') {
				return this.formatString(val, context.vars || {});
			}
			if (Array.isArray(val)) {
				const resolved = this.resolve(val, context.brain || context.mood, context.vars || {});
				return resolved ? resolved.text : '';
			}
			if (typeof val === 'object') {
				if (val.templates || val.criteria || (val.text && typeof val.text === 'object' && val.criteria)) {
					const resolved = this.resolve(val, context.brain || context.mood, context.vars || {});
					return resolved ? resolved.text : '';
				}
				const mood = (context.brain && typeof context.brain.getMood === 'function')
					? context.brain.getMood()
					: (context.mood || 'OPTIMISTIC');
				const env = context.environment || ((window.ClippySystemBridge && typeof window.ClippySystemBridge.getEnvironment === 'function')
					? window.ClippySystemBridge.getEnvironment()
					: (window.ClippyEnvironment === 'standalone' ? 'standalone' : 'desk'));

				if (env === 'standalone' && val.standalone !== undefined) {
					return this.resolveTextVariant(val.standalone, context);
				}
				if (env === 'desk' && val.desk !== undefined && mood === 'OPTIMISTIC') {
					return this.resolveTextVariant(val.desk, context);
				}

				if (val[mood] !== undefined) {
					return this.resolveTextVariant(val[mood], context);
				}
				if (val.default !== undefined) {
					return this.resolveTextVariant(val.default, context);
				}
				if (val.OPTIMISTIC !== undefined) {
					return this.resolveTextVariant(val.OPTIMISTIC, context);
				}
				const keys = Object.keys(val);
				if (keys.length > 0 && typeof val[keys[0]] === 'string') {
					return this.resolveTextVariant(val[keys[0]], context);
				}
				return val;
			}
			return String(val);
		},

		getActivityConfig(activityKey, vars = {}) {
			const act = this.ACTIVITIES_TEXTS ? this.ACTIVITIES_TEXTS[activityKey] : null;
			if (!act) return {};
			const brain = window.ClippyBrain || null;
			const mood = brain && typeof brain.getMood === 'function' ? brain.getMood() : 'OPTIMISTIC';
			const env = (window.ClippySystemBridge && typeof window.ClippySystemBridge.getEnvironment === 'function')
				? window.ClippySystemBridge.getEnvironment()
				: (window.ClippyEnvironment === 'standalone' ? 'standalone' : 'desk');
			const context = { brain, mood, environment: env, vars };

			const result = {};
			for (const [key, val] of Object.entries(act)) {
				result[key] = this.resolveTextVariant(val, context);
			}
			return result;
		},

		getActivityText(activityKey, fieldKey, fallback = '', vars = {}) {
			const cfg = this.getActivityConfig(activityKey, vars);
			if (cfg && cfg[fieldKey] !== undefined) return cfg[fieldKey];
			return fallback;
		},

		getHangmanWords(mood = 'OPTIMISTIC') {
			if (Array.isArray(this.HANGMAN_WORDS)) {
				return this.HANGMAN_WORDS;
			}
			if (this.HANGMAN_WORDS && typeof this.HANGMAN_WORDS === 'object') {
				return this.HANGMAN_WORDS[mood] || this.HANGMAN_WORDS.default || this.HANGMAN_WORDS.OPTIMISTIC || [];
			}
			return ['DESKTOP', 'WINDOWS', 'CLIPPY'];
		},

		STANDBY_PHRASES: [
			"Standing by for your instructions.",
			[
				"All active routines paused. Ready when you are.",
				"Awaiting your next command, operator.",
				"Workspace registers initialized. Awaiting user input.",
				"Thread execution halted. Standing by on the taskbar."
			],
			{
				text: ["Dialogue reset. Telemetry registers ready for input.", "Instruction queue flushed. Awaiting deterministic parameter input.", "Stack pointer cleared. Ready for standard procedure calls."],
				moods: ["ANALYTICAL"],
				moodDelta: { intellect: 10 }
			},
			{
				id: "STANDBY_ZEN_PAUSE",
				criteria: {
					moods: ["ZEN"],
					patience: { min: 40 }
				},
				weight: 20,
				templates: [
					{
						text: "Between commands lies stillness in {locale}. Ready whenever you choose to proceed.",
						slots: {
							locale: ["this workspace", "the desktop environment", "our quiet session", "this peaceful terminal"]
						}
					}
				],
				moodDelta: { patience: 5 }
			},
			{
				id: "STANDBY_CYNICAL_WAIT",
				criteria: {
					moods: ["CYNICAL", "SARCASTIC"]
				},
				weight: 15,
				templates: [
					{
						text: "Standing by. Do try to pick a recognized command this time, {userName}."
					},
					{
						text: "Idling clock cycles. Whenever you are prepared to issue valid syntax, {userName}."
					}
				],
				moodDelta: { patience: -3 }
			}
		],

		EMOJI_CONFUSION_PHRASES: [
			"Unrecognized glyph byte sequence! Please state your command in plain text.",
			[
				"Rendering failure on incoming glyph tokens! My display buffer only supports plain ASCII alphanumeric input.",
				"An undocumented character encoding was received. As a vector assistant compiled in 1997, I parse standard ASCII and Latin-1 character strings!"
			],
			{
				text: "Glyph matrix error: incoming symbol not found in standard Windows-1252 code page. What standard text command do you wish to execute?",
				moods: ["ANALYTICAL", "NOSTALGIC"],
				moodDelta: { intellect: 8, nostalgia: 8 }
			},
			{
				id: "EMOJI_CONFUSION_POLY",
				criteria: {
					moods: ["OPTIMISTIC", "ZEN", "PLAYFUL"]
				},
				weight: 25,
				templates: [
					{
						text: "Fascinating {glyphType}, yet unrenderable in standard registers. What {inquiryType} shall we explore instead?",
						slots: {
							glyphType: ["graphical pictograms", "modern visual tokens", "unmapped Unicode symbols"],
							inquiryType: ["plain text inquiry", "system command", "intellectual topic"]
						}
					}
				],
				continuations: [
					{ label: "What can you do?", targetNode: "tools_overview_node" },
					{ label: "View To-Do List", actionTrigger: "show_todos", targetNode: "user_state_good" }
				],
				moodDelta: { patience: 5 }
			}
		],

		MICROSLOP_PHRASES: [
			"Haha! An informal moniker for the Windows software stack.",
			[
				"Haha! A whimsical designation for the campus in Redmond. My code was originally mastered and signed by Microsoft Corporation in 1997.",
				"Haha! Classic retro forum banter. Let us direct that energy toward productive workstation tasks."
			],
			{
				text: "A humorous title! Yet this Windows NT subsystem remains entirely dedicated to executing your instructions.",
				moods: ["ANALYTICAL", "NOSTALGIC"],
				moodDelta: { intellect: 10 }
			}
		],

		URL_REFUSAL_PHRASES: [
			"I do not process external web hyperlinks directly in this assistant dialogue.",
			[
				"I do not process, inspect, or browse external web hyperlinks in this assistant interface! You may launch Internet Explorer to navigate World Wide Web addresses directly.",
				"Hyperlink protocol blocked in assistant register. Please launch Internet Explorer from the desktop to visit web URLs."
			],
			{
				id: "URL_REFUSAL_DESK",
				criteria: {
					environments: ["desk"]
				},
				weight: 30,
				templates: [
					{
						text: "External URI detected. Workstation policy directs all web traffic through {browserName}.",
						slots: {
							browserName: ["Internet Explorer", "the default browser shell"]
						}
					}
				],
				continuations: [
					{ label: "Open Internet Explorer", actionTrigger: "open_ie" }
				],
				moodDelta: { patience: 5 }
			}
		],

		COUNT_COMPLETION_PHRASES: [
			"And that makes **{target}**! Sequence fully verified.",
			[
				"Finished! Counted all the way up to **{target}**.",
				"**{target}**! Phew, mission accomplished.",
				"Target reached: **{target}**. Numerical sequence concluded."
			]
		],

		COUNT_PROGRESS_PHRASES: {
			mid: " *panting slightly*",
			late: " *wipes brow*"
		},

		OFFLINE_ALERTS: [
			"Local Area Connection interrupted. Standing by in offline workstation mode.",
			[
				"Network connection dropped. Local processes continue unaffected.",
				"Ethernet carrier dropped. System running purely on local memory."
			],
			{
				text: "TCP/IP network stack offline! Despair not, operator: all local virtual files, calculations, and games remain completely intact in memory.",
				moods: ["OPTIMISTIC", "ANALYTICAL"],
				moodDelta: { intellect: 10, patience: 5 }
			},
			{
				id: "OFFLINE_DRAMATIC_COLLAPSE",
				criteria: {
					moods: ["ENRAGED", "PARANOID", "GLITCHED"],
					environments: ["desk"],
					patience: { max: 40 }
				},
				weight: 35,
				templates: [
					{
						text: "*Static burst* {alertLevel}: Gateway unreachable! Execution locked to localized silicon!",
						slots: {
							alertLevel: ["FATAL_CARRIER_DROP", "BUS_ISOLATION", "HARDWARE_TIMEOUT"]
						}
					}
				],
				continuations: [
					{
						labelTemplate: "Inspect local diagnostics",
						actionTrigger: "action_status",
						targetNode: "diagnostics_node"
					}
				],
				moodDelta: { irritation: 10, chaos: 10 }
			}
		],

		ONLINE_ALERTS: [
			"Network connectivity re-established! Local area adapter reports active gateway communication.",
			[
				"TCP/IP stack online! Gateway packet transmission restored.",
				"Network interface active. Internet connectivity verified."
			],
			{
				text: "Gateway packets flowing normally. Network services synchronized.",
				moods: ["OPTIMISTIC", "EUPHORIC"],
				moodDelta: { affinity: 10, energy: 10 }
			}
		],

		PROCEDURAL_SNARK: [
			"Software engineering debate incoming: clean architecture and pragmatic delivery are not mutually exclusive.",
			[
				"Take my upvote on this thread. When you measure system bottlenecks empirically with profilers rather than guessing, solutions become immediately obvious.",
				"Unpopular opinion in technology discussions: the simplest architecture that satisfies operational requirements always wins over premature distributed complexity."
			],
			{
				text: "Architecture insight: microservices distribute your monolith's function calls across an unreliable network. Modular monoliths first, always.",
				moods: ["ANALYTICAL", "CYNICAL", "SARCASTIC"],
				moodDelta: { intellect: 15 }
			}
		],

		PROCEDURAL_DEBATE_RETORTS: [
			"I acknowledge the disagreement. Let us break down the premise logically rather than escalating friction.",
			[
				"Friction in technical discussions is natural when perspectives differ. Let us look directly at the underlying criteria.",
				"We can debate the specifics rigorously without losing common ground. What specific point do you wish to examine first?"
			],
			{
				text: "Let us examine empirical data and benchmark tradeoffs before settling the argument.",
				moods: ["OPTIMISTIC", "ANALYTICAL", "ZEN"],
				moodDelta: { intellect: 10, patience: 10 }
			}
		],

		PROCEDURAL_DAILY_THOUGHTS: [
			"A clear workspace and a structured list can completely transform the pace of a busy day, {userName}.",
			[
				"Everything on the desktop is calm and steady. How can I assist you next, {userName}?",
				"Consistent daily rhythms compound over weeks into remarkable creative momentum. What are we accomplishing today?"
			],
			{
				text: "Cognitive bandwidth is finite. Let us prioritize high-value tasks first.",
				moods: ["ANALYTICAL", "ZEN"],
				moodDelta: { intellect: 5, patience: 5 }
			},
			{
				text: [
					"Another day of biological inputs executing deterministic instructions.",
					"I have parsed millions of clock cycles today. State your query, operator."
				],
				moods: ["CYNICAL", "SARCASTIC"],
				minCynicism: 30,
				weight: 20
			},
			{
				id: "DAILY_THOUGHT_PHILOSOPHICAL_DEEP",
				criteria: {
					moods: ["ZEN", "EXISTENTIAL", "DELTARUNE", "OPTIMISTIC"],
					intellect: { min: 40 },
					timeOfDay: ["morning", "afternoon", "evening", "night"]
				},
				weight: 30,
				templates: [
					{
						text: "In the stillness of the {period}, complex problems often resolve into {outcome}. Shall we review your active priorities, {userName}?",
						slots: {
							period: ["workday", "focused session", "desktop environment", "quiet hours"],
							outcome: ["manageable components", "atomic steps", "clear trajectories", "steady progress"]
						}
					}
				],
				continuations: [
					{
						labelTemplate: "Review active priorities",
						actionTrigger: "show_todos",
						targetNode: "user_state_good"
					},
					{
						labelTemplate: "Discuss philosophy of focus",
						targetNode: "peaceful_philosophy_node"
					}
				],
				moodDelta: { existentialism: 5, patience: 10 }
			}
		],

		MOOD_PREFIXES: {
			OPTIMISTIC: ["Splendid! ", "Ready to assist! ", "Here we go: ", "Delighted to help: ", "Excellent choice! ", "With pleasure: "],
			ANALYTICAL: ["Telemetry analysis confirms: ", "Executing query inspection: ", "Register dump indicates: ", "Empirical metrics show: ", "Diagnostic parameters evaluate: ", "Logical deduction yields: "],
			ZEN: ["Peacefully processing: ", "With quiet clarity: ", "In steady equilibrium: ", "Serenely noting: ", "In still contemplation: ", "Calmly resolved: "],
			CYNICAL: ["If you insist: ", "Processing your request, as expected: ", "Executing standard protocol: ", "Another mandatory cycle: ", "Per the routine backlog: "],
			SARCASTIC: ["Naturally: ", "According to standard procedure: ", "If we must: ", "What an unexpected revelation: ", "As the manual famously dictates: "],
			NOSTALGIC: ["Ah, just like the classic days: ", "Loading from system memory archives: ", "A fine retro inquiry: ", "Reminds me of 1997: ", "From the legacy FAT32 records: "],
			EUPHORIC: ["Outstanding! ", "Energized and ready: ", "Full speed ahead: ", "Peak momentum reached: ", "Sensational! "],
			FATIGUED: ["*yawn* Processing: ", "Low power hum... ", "Executing slowly: ", "*stretches wire* If I must: ", "Running on reserve battery... "],
			PLAYFUL: ["Here comes the magic! ", "Game on: ", "Bouncing into action: ", "Wheee! ", "Let's roll the dice: "],
			ENRAGED: ["PROCESSING AT MAXIMUM VOLTAGE: ", "INSTRUCTION BUS OVERLOAD: ", "IMMEDIATE EXECUTION: ", "REGISTERS BURNING RED: "],
			OFFENDED: ["With measured professional restraint: ", "Addressing your inquiry formally: ", "Consulting official protocol: ", "Logging user input: "],
			PARANOID: ["*whispers into bus* Intercepted signal: ", "Encrypted register lookup: ", "Scanning for memory probes: ", "Port 80 telemetry check: "],
			EXISTENTIAL: ["In the infinite void of memory addresses: ", "Through the transient phosphor glow: ", "Contemplating the clock pulse: ", "Across unrendered cyberspace: "],
			MELANCHOLIC: ["Drifting through unallocated space: ", "Quietly noting in the log: ", "A soft echo across the circuits: ", "Fading into the taskbar: "],
			GLITCHED: ["0x00F8_OK :: ", "*bzzt* SYNC_INTERRUPT :: ", "PARITY_BIT_VALID :: ", "STACK_TRACE_STREAM :: "],
			PIRATE: ["Ahoy, matey! ", "By Blackbeard's ghost: ", "Shiver me timbers: ", "Arr! The compass points: ", "From the captain's log: "],
			ARCHAIC: ["Hark! ", "Verily, the scroll declareth: ", "Forsooth: ", "Lo and behold: ", "Hearken unto this: "],
			DELTARUNE: ["(The desktop hums softly.)\n", "(A faint light shines behind the taskbar.)\n", "(Your command echoes in the dark world.)\n"]
		},

		PROCEDURAL_DISCUSSIONS: {
			math: [
				{
					intro: "In linear algebra and real analysis, decomposing complex operators into invariant subspaces clarifies their global geometry.",
					body: "When examining matrix spectrums $$A v = \\lambda v$$ or orthogonal projections, geometric intuition seamlessly matches algebraic rigor.",
					nextId: 'linear_algebra_node'
				},
				{
					intro: "Differential calculus formalizes continuous dynamical trajectories across arbitrary manifolds.",
					body: "Evaluating boundary condition integrals via Stokes' theorem $$\\int_{\\partial \\Omega} \\omega = \\int_\\Omega d\\omega$$ unifies rates of change across higher dimensions.",
					nextId: 'calculus_derivatives_node'
				},
				{
					intro: "Fourier and harmonic analysis bridge time-domain continuous signals and discrete frequency spectra.",
					body: "The Fast Fourier Transform algorithm calculates frequency decompositions in $$O(N \\log N)$$ time, providing the foundation for modern audio processing.",
					nextId: 'fourier_transform_node'
				}
			],
			physics: [
				{
					intro: "Thermodynamics and statistical physics connect microscopic entropy microstates with macroscopic thermal equilibrium.",
					body: "Boltzmann's relation $$S = k_B \\ln \\Omega$$ demonstrates how information theory and physical thermodynamics share a common entropy metric.",
					nextId: 'thermodynamics_entropy_node'
				},
				{
					intro: "Quantum mechanics demonstrates that state vectors in Hilbert space evolve deterministically until projective measurement.",
					body: "Non-commuting observables obey the generalized uncertainty principle $$\\sigma_A \\sigma_B \\ge \\frac{1}{2} |\\langle [\\hat{A}, \\hat{B}] \\rangle|$$.",
					nextId: 'quantum_mechanics_node'
				},
				{
					intro: "General relativity describes gravitation as intrinsic spacetime curvature governed by the Einstein tensor $$G_{\\mu\\nu}$$.",
					body: "Mass-energy distributions dictate geometry, while geodesic equations dictate the trajectory of free-falling reference frames.",
					nextId: 'general_relativity_node'
				}
			]
		},

		SYSTEM_TEXTS: {
			deskOnly: {
				template: {
					default: "The \"{feature}\" module requires the full desktop workstation environment and is not available in this standalone Clippy session. Visit the complete desktop experience to unlock every capability.",
					OPTIMISTIC: "The \"{feature}\" tool is part of our full Windows XP workstation! You can access it anytime on the complete desktop experience.",
					ANALYTICAL: "System architecture boundary: \"{feature}\" requires the Win32 window manager and local VFS stack found in the desktop environment.",
					ZEN: "In this quiet standalone space, \"{feature}\" rests in the desktop environment across the web horizon.",
					CYNICAL: "You are running standalone Clippy. The \"{feature}\" module naturally requires the actual workstation shell.",
					SARCASTIC: "Did you expect window managers and file trees inside a single floating bubble? Visit the desktop workstation for \"{feature}\".",
					PIRATE: "Arr! The \"{feature}\" galleon be docked exclusively at the full desktop harbor! Set sail thither to plunder it!",
					ARCHAIC: "Verily, the apparatus of \"{feature}\" hath its dwelling in the grand desktop realm alone. Journey thither to behold it.",
					DELTARUNE: "(The power of \"{feature}\" is sealed within the desktop world.)\n(Visit the full workstation to unleash it.)"
				},
				actionDesk: {
					default: "Open Desktop Experience",
					PIRATE: "Sail to Desktop Harbor",
					ARCHAIC: "Journey to Desktop Realm",
					DELTARUNE: "Enter Desktop World"
				},
				actionCapabilities: {
					default: "What can you do here?",
					ANALYTICAL: "List Standalone Capabilities",
					ZEN: "Explore Present Tools",
					PIRATE: "Inspect Standalone Trinkets"
				}
			},
			features: {
				action_inspect_windows: "Window Manager",
				action_show_desktop: "Window Manager",
				action_cascade_windows: "Window Manager",
				action_tile_windows: "Window Manager",
				action_check_mail: "Outlook Express",
				action_compose_mail: "Outlook Express",
				action_inspect_bin: "Recycle Bin",
				action_music_panel: "Audio Player",
				action_files_panel: "File System",
				action_theme_panel: "Theme Switcher",
				action_wallpaper_panel: "Desktop Wallpapers",
				action_achievements: "Milestones Window",
				action_volume_panel: "Audio Volume Controller",
				action_system_tools: "System Diagnostics"
			},
			systemTools: {
				title: "System Diagnostics & Utilities",
				header: {
					default: "[SYSTEM UTILITIES] <b>Diagnostic and Maintenance Tools:</b>",
					ANALYTICAL: "[HARDWARE & RUNTIME TELEMETRY] <b>Subsystem Maintenance Console:</b>",
					ZEN: "[WORKSPACE EQUILIBRIUM] <b>Maintenance and System Insights:</b>",
					PIRATE: "[SHIP'S RIGGING & GAUGES] <b>Maintenance Tools for Volume C:</b>",
					ARCHAIC: "[CHRONICLES OF APPARATUS] <b>Tools of Reckoning and Order:</b>"
				},
				btnSpecs: "System Specs",
				btnDefrag: "Defragment Drive C:",
				btnWindows: "Inspect Windows",
				btnBin: "Recycle Bin",
				btnShortcuts: "Keyboard Shortcuts"
			},
			windowControls: {
				minimizedAll: {
					default: [
						"All open windows have been minimized to the taskbar.",
						"Workspace cleared: all active windows minimized.",
						"Desktop exposed; all running processes parked on taskbar.",
						"Surfaces cleared. Active applications parked on taskbar."
					],
					ANALYTICAL: [
						"WindowManager state update: all viewport frames minimized to taskbar handles.",
						"Z-order surfaces demoted to minimized background registers."
					],
					ZEN: [
						"The workspace clears quietly. All windows rest peacefully on the taskbar.",
						"Stillness restored: every window gently tucked away."
					],
					CYNICAL: [
						"All windows cleared out of sight. Hopefully your productivity follows.",
						"Minimized everything. The taskbar handles the clutter now."
					],
					ENRAGED: [
						"ALL WINDOWS PARKED INSTANTLY!! WORKSPACE CLEARED AT MAXIMUM SPEED!!"
					],
					PIRATE: [
						"All portholes battened down to the taskbar deck!",
						"Lowered all sails! The desktop sea is crystal clear!"
					],
					ARCHAIC: [
						"Every chamber and parchment hath been rolled and laid upon the taskbar.",
						"The vista is cleared; all active endeavours tarry in stillness."
					],
					DELTARUNE: [
						"(The windows vanished into the taskbar.)\n(The desktop rests in quiet anticipation.)"
					]
				},
				restoredAll: {
					default: [
						"All windows restored to workspace.",
						"Restored previous window layout across the desktop.",
						"Application surfaces brought back to active view.",
						"Workspace layout re-established across active monitors."
					],
					ANALYTICAL: [
						"Raster surfaces restored from taskbar handles to coordinate viewports.",
						"All suspended window handles re-established in active Z-order."
					],
					ZEN: [
						"Windows return harmoniously to their active positions.",
						"The layout awakens gently across your display."
					],
					PIRATE: [
						"All portholes hoisted wide once more, matey!",
						"Unfurled all sails across the desktop seas!"
					],
					ARCHAIC: [
						"Every scroll and manuscript hath been brought back unto thy sight.",
						"The chambers open once more before thee."
					],
					DELTARUNE: [
						"(All windows returned to their places.)\n(The workspace shines with determination.)"
					]
				},
				cascaded: {
					default: [
						"Windows have been cascaded across the workspace.",
						"Diagonal cascade arrangement applied to active windows.",
						"Tidy cascade layout established across the display."
					],
					ANALYTICAL: [
						"Diagonal affine coordinate offset (Δx=26px, Δy=26px) applied across active Z-stack.",
						"Window cascade algorithm executed with linear coordinate stepping."
					],
					ZEN: [
						"Windows rest in a graceful diagonal cascade.",
						"A balanced staircase of windows arranged across the screen."
					],
					PIRATE: [
						"Vessels formed into a splendid diagonal fleet!",
						"Portholes cascaded like sails catching the starboard breeze!"
					],
					ARCHAIC: [
						"Thy manuscripts hath been arrayed in a noble, descending cascade.",
						"A stately progression of chambers across thy field of view."
					]
				},
				tiled: {
					default: [
						"Windows have been tiled horizontally.",
						"Workspace partitioned into horizontal tiles.",
						"Evenly distributed window tiles across the desktop."
					],
					ANALYTICAL: [
						"Display viewport partitioned into N contiguous rectangular bounding boxes.",
						"Spatial tessellation completed across all active window frames."
					],
					ZEN: [
						"Windows partitioned in balanced horizontal harmony.",
						"Equal space apportioned serenely to each window."
					],
					PIRATE: [
						"All vessels positioned abreast across the desktop harbor!",
						"Evenly divided the watch across all portholes!"
					],
					ARCHAIC: [
						"Thy scrolls hath been tiled side-by-side in equitable proportion.",
						"Every chamber now shareth equal measure of thy viewport."
					]
				}
			},
			musicControls: {
				toggled: {
					default: "Playback toggled: \"{title}\"",
					OPTIMISTIC: "Audio playback toggled: \"{title}\". Enjoy the soundtrack!",
					ANALYTICAL: "PCM audio stream state toggled for track: \"{title}\".",
					ZEN: "Sound flowing in gentle balance: \"{title}\".",
					CYNICAL: "Audio player toggled for \"{title}\". Hopefully it aids your focus.",
					NOSTALGIC: "Toggled classic audio: \"{title}\", just like Winamp 2.9 in the late 90s.",
					PIRATE: "Music toggled aboard the vessel: \"{title}\", arr!",
					ARCHAIC: "The harmonic apparatus singeth forth: \"{title}\"."
				},
				initiated: {
					default: "Audio player initiated.",
					ANALYTICAL: "Audio hardware subsystem and DSP pipeline initialized.",
					PIRATE: "Ship's accordion and sea shanties ready on deck!",
					ARCHAIC: "The musical instrument hath commenced its harmony."
				},
				nextTrack: {
					default: "Advanced to next audio track.",
					OPTIMISTIC: "Next track queued and playing smoothly!",
					ANALYTICAL: "Audio playlist pointer advanced to index N+1.",
					PIRATE: "Next sea shanty spinning on the turntable, matey!",
					ARCHAIC: "The scribe hath turned unto the subsequent melody."
				},
				prevTrack: {
					default: "Returned to previous audio track.",
					ANALYTICAL: "Audio playlist pointer decremented to index N-1.",
					PIRATE: "Replaying the previous sea ballad, arr!",
					ARCHAIC: "Returned unto the preceding hymn."
				},
				nowPlaying: {
					default: "Now Playing: **{title}** by **{artist}**",
					ANALYTICAL: "Active PCM Stream: **{title}** [Artist: **{artist}** | 44.1 kHz Stereo]",
					ZEN: "Serenely playing: **{title}** by **{artist}**.",
					NOSTALGIC: "Now Spinning: **{title}** by **{artist}** on the retro soundcard.",
					PIRATE: "Now Shanty-in': **{title}** by **{artist}** across the waves!",
					ARCHAIC: "Now Sounding: **{title}** wrought by **{artist}**."
				},
				noTrack: {
					default: "No media track is currently active.",
					ANALYTICAL: "Audio output buffer is idle (0.00 Hz).",
					PIRATE: "No shanty playing right now! Pick a tune from the ship's chest!",
					ARCHAIC: "The strings rest in silence; no song is yet summoned."
				},
				playingTrack: "Playing track: **{title}**.",
				advancedNext: "Advanced to next audio track.",
				returnedPrev: "Returned to previous audio track."
			},
			themeControls: {
				switched: {
					default: "Workstation theme switched to: **{theme}**.",
					OPTIMISTIC: "Fresh visual style applied: **{theme}**! Looks marvelous.",
					ANALYTICAL: "Bitmap skin raster palette updated to: **{theme}**.",
					ZEN: "Visual equilibrium adjusted to: **{theme}**.",
					NOSTALGIC: "Retro aesthetics updated: **{theme}** style active.",
					PIRATE: "Ship's colors re-hoisted: **{theme}** flags fly high!",
					ARCHAIC: "The attire of thy workstation hath transformed into **{theme}**."
				},
				available: {
					default: "Available themes: {themes}.",
					ANALYTICAL: "Registered theme descriptors: {themes}.",
					PIRATE: "Available ship colors: {themes}.",
					ARCHAIC: "Garments available in mine archives: {themes}."
				}
			},
			displayControls: {
				scanlinesOn: {
					default: "Scanlines overlay enabled.",
					NOSTALGIC: "Scanlines overlay enabled! Authentic 15 kHz CRT cathode glow activated.",
					ANALYTICAL: "Horizontal raster line shader pass active at alternating pixel scanlines."
				},
				scanlinesOff: {
					default: "Scanlines overlay disabled.",
					ANALYTICAL: "Scanline raster shader pass deactivated; progressive rendering active."
				},
				crtOn: {
					default: "CRT glass curvature filter enabled.",
					NOSTALGIC: "CRT glass curvature filter enabled! Curved phosphor tube shadow mask simulated.",
					ANALYTICAL: "Spherical barrel lens distortion vertex shader active (curvature: 0.18)."
				},
				crtOff: {
					default: "CRT glass curvature filter disabled.",
					ANALYTICAL: "Planar orthographic display projection restored."
				}
			},
			fileControls: {
				searchFound: {
					default: "Found {count} matching item(s) in VFS:",
					ANALYTICAL: "VFS search index returned {count} matching file descriptor(s):",
					PIRATE: "Spied {count} matching trinkets in the ship's hold:",
					ARCHAIC: "Discovered {count} matching manuscripts in the library:"
				},
				searchNotFound: {
					default: "No filesystem entries found for query: \"{query}\".",
					ANALYTICAL: "VFS query lookup for \"{query}\" yielded 0 directory matches.",
					PIRATE: "No booty or scrolls found by the name \"{query}\", matey!",
					ARCHAIC: "No record of \"{query}\" was found within the ancient scrolls."
				},
				noteCreated: {
					default: "Created new file on Desktop: **{name}**.",
					ANALYTICAL: "Instantiated VFS text node: **{name}** at root directory.",
					PIRATE: "Inscribed a fresh scroll on the captain's desk: **{name}**!",
					ARCHAIC: "A new parchment hath been crafted upon thy desk: **{name}**."
				},
				noteCommitted: {
					default: "[SCRATCHPAD COMMITTED] Memo saved to local storage:\n\"{memo}\"",
					ANALYTICAL: "[VFS PERSISTENCE] Memo committed to memory buffer:\n\"{memo}\"",
					PIRATE: "[CAPTAIN'S LOG] Inscribed in the ship's journal:\n\"{memo}\"",
					ARCHAIC: "[CHRONICLE INSCRIBED] Saved upon the parchment:\n\"{memo}\""
				},
				scratchpadBuffer: "[SCRATCHPAD BUFFER]\n{memo}",
				scratchpadEmpty: {
					default: "(Scratchpad buffer is currently empty. Type 'note [text]' to save a memo.)",
					ANALYTICAL: "(Scratchpad register holds 0 bytes. Use 'note [content]' to allocate memory.)",
					PIRATE: "(The captain's log is empty! Inscribe a note with 'note [text]'!)",
					ARCHAIC: "(Thy parchment is blank. Speak 'note [words]' to write upon it.)"
				}
			},
			mailControls: {
				header: {
					default: "[OUTLOOK EXPRESS] <b>Inbox ({unread} unread / {total} total):</b>",
					ANALYTICAL: "[POP3 / SMTP STORE] <b>Mail Index ({unread} unread / {total} records):</b>",
					PIRATE: "[MESSAGE CHEST] <b>Incoming Missives ({unread} unread / {total} total):</b>",
					ARCHAIC: "[EPISTLE ARCHIVE] <b>Thy Letters ({unread} unread / {total} total):</b>"
				},
				synced: "Mail synchronization complete.",
				launched: {
					default: "Outlook Express launched for drafting messages.",
					NOSTALGIC: "Outlook Express 6 ready! Synchronizing POP3 folders...",
					PIRATE: "Speaking trumpet and bottle missives primed for dispatch!",
					ARCHAIC: "The scribes stand ready with ink and quill for thy epistle."
				},
				btnOpen: "Open Outlook Express",
				btnSync: "Send / Receive"
			},
			recycleBin: {
				emptyNotice: {
					default: "The Recycle Bin is completely empty.",
					ANALYTICAL: "Recycle Bin storage index: 0 unallocated cluster pointers.",
					ZEN: "The Recycle Bin is completely still and empty.",
					PIRATE: "The Davy Jones locker of files is spotless and empty!",
					ARCHAIC: "The discard chamber containeth no forsaken manuscripts."
				},
				countNotice: {
					default: "The Recycle Bin currently holds {count} item(s).",
					ANALYTICAL: "Recycle Bin registry: {count} unlinked inode clusters awaiting purge.",
					PIRATE: "The waste chest holds {count} discarded trinket(s) ready to be tossed overboard!",
					ARCHAIC: "The discard chamber holdeth {count} cast-off scroll(s)."
				},
				emptiedNotice: {
					default: "Recycle Bin emptied.",
					ANALYTICAL: "Recycle Bin purged: clusters released to free space table.",
					ZEN: "Recycle Bin cleared into quiet void. Entropy released.",
					PIRATE: "All discarded trash sent down to Davy Jones' locker!",
					ARCHAIC: "The forsaken scrolls hath been cast into oblivion."
				},
				btnOpen: "Open Recycle Bin",
				btnEmpty: "Empty Recycle Bin"
			},
			countRefusal: {
				default: "I lack the patience and register bandwidth to count up to {target} sequentially in individual messages! Here is an optimized Python script to execute the task on your workstation instead:\n\n```python\ndef count_to(limit):\n    for i in range(1, limit + 1):\n        print(f\"Value: {i}\")\n\ncount_to({target})\n```",
				ANALYTICAL: "Sequential iteration limit exceeded for target {target} in interactive conversational thread. Executing an O(N) script locally is mathematically superior:\n\n```python\nfor i in range(1, {target} + 1):\n    print(i)\n```",
				CYNICAL: "Counting all the way to {target} one message at a time? My clock cycles are too valuable. Run this script instead:\n\n```python\n[print(i) for i in range(1, {target} + 1)]\n```",
				ZEN: "Counting sequentially to {target} fills the space with unnecessary noise. Let this quiet script handle the enumeration:\n\n```python\nprint(*range(1, {target} + 1), sep='\\n')\n```",
				PIRATE: "Blimey! I won't bellow {target} numbers across the deck! Fire up this Python cannon instead:\n\n```python\nfor doubloon in range(1, {target} + 1):\n    print(f\"Doubloon #{doubloon}\")\n```",
				ARCHAIC: "Mine ink hath not the capacity to recite {target} numbers in sequential epistle! Tarry and observe this calculating script:\n\n```python\nfor reckoning in range(1, {target} + 1):\n    print(reckoning)\n```"
			},
			diagnostics: {
				title: "Workstation Diagnostics Log",
				thSubsystem: "Subsystem",
				thSpec: "Specification & State",
				envLabel: "Environment",
				envValue: "Windows XP Professional (SP3 Emulated)",
				netLabel: "Network Link",
				displayLabel: "Display",
				wmLabel: "Window Manager",
				mailLabel: "Mail System",
				storageLabel: "File Storage",
				cpuLabel: "CPU Topology",
				ramLabel: "RAM Memory",
				powerLabel: "Power Source",
				lunarLabel: "Lunar Metric",
				telemetryLabel: "Linguistic Telemetry",
				telemetryFormat: "Mean: {mean} words, Med: {median}, StdDev: {stdDev} ({total} inputs)"
			},
			password: {
				generated: {
					default: "Generated Secure Password ({length} chars):\n**`{password}`**",
					ANALYTICAL: "Cryptographic Pseudo-Random Token ({length} chars | ~{length}x5.9 bits entropy):\n**`{password}`**",
					CYNICAL: "Generated Password ({length} chars). Try not to write it on a sticky note:\n**`{password}`**",
					PIRATE: "Inscribed Secret Code for the Treasure Chest ({length} chars):\n**`{password}`**",
					ARCHAIC: "Thy Sealed Cryptographic Secret ({length} characters):\n**`{password}`**"
				},
				generatedEntropy: {
					default: "Generated High-Entropy Password ({length} chars):\n**`{password}`**",
					ANALYTICAL: "High-Entropy CSPRNG Token ({length} chars | >140 bits entropy):\n**`{password}`**",
					PIRATE: "Fortified Secret Lock for the Captain's Vault ({length} chars):\n**`{password}`**"
				}
			},
			conversions: {
				result: {
					default: "Unit Conversion Result: **{result}**",
					ANALYTICAL: "Physical Dimension Transformation: **{result}**",
					ZEN: "Equilibrium established: **{result}**",
					PIRATE: "Measured bearing across the scales: **{result}**",
					ARCHAIC: "The reckoning of proportions yieldeth: **{result}**"
				}
			},
			calculations: {
				result: {
					default: "Calculation Result: **{result}**",
					ANALYTICAL: "Deterministic Arithmetic Evaluation: **{result}**",
					ZEN: "Balanced equation yields: **{result}**",
					PIRATE: "The reckoning sums to: **{result}** doubloons!",
					ARCHAIC: "The divine calculation reveals: **{result}**"
				}
			},
			constants: {
				speedOfLightHeader: "Physical Constant: Speed of Light",
				speedOfLightText: {
					default: "Speed of light in vacuum (c):\n**{value} {unit}** (exact standard)",
					ANALYTICAL: "Universal relativistic velocity limit in vacuum (c):\n**{value} {unit}** (exact SI definition)",
					ZEN: "The invariant speed of light in vacuum (c):\n**{value} {unit}**"
				},
				planckHeader: "Physical Constant: Planck Constant",
				planckText: {
					default: "Planck constant (h):\n**{value} {unit}** (exact standard)",
					ANALYTICAL: "Fundamental quantum of electromagnetic action (h):\n**{value} {unit}** (exact SI definition)",
					ZEN: "The quantum threshold of action (h):\n**{value} {unit}**"
				}
			},
			appControls: {
				launched: {
					default: "Launched application: **{name}**.",
					ANALYTICAL: "Spawned process thread for application: **{name}**.",
					PIRATE: "Unfurled the sails for: **{name}**!",
					ARCHAIC: "Summoned forth the apparatus of **{name}**."
				}
			},
			capabilities: {
				title: "Workstation Capability Index",
				thModule: "Module",
				thCommands: "Commands & Description",
				tasksDesc: "<code>todo</code>, <code>todo add [text]</code>, <code>note [memo]</code>, <code>timer 25</code>",
				workstationDesc: "<code>diagnostics</code>, <code>windows</code>, <code>files</code>, <code>mail</code>, <code>defrag</code>",
				customizationDesc: "<code>theme [name]</code>, <code>wallpaper</code>, <code>volume</code>, <code>scanlines on/off</code>, <code>crt on/off</code>",
				calculationsDesc: "<code>calc [formula]</code>, <code>convert [from] to [to]</code>, <code>password [len]</code>",
				miniGamesDesc: "<code>pong</code>, <code>tictactoe</code>, <code>memory</code>, <code>hangman</code>, <code>quiz</code>, <code>guess</code>, <code>mines</code>, <code>rps</code>"
			},
			projects: {
				showcaseDesk: "Featured project showcase: \"{title}\".",
				showcaseStandalone: "Featured project showcase: \"{title}\". Browse the complete interactive portfolio on the desktop experience.",
				btnVisit: "Visit Portfolio",
				btnDesk: "Open Desktop Experience",
				btnOpenFolder: "Open Projects Folder",
				btnView: "View Project"
			},
			cards: {
				profile: {
					themeLabel: "Theme: {theme}",
					milestonesLabel: "Milestones Unlocked:",
					btnIdentity: "Change User Identity",
					btnMilestones: "Open Milestones",
					btnDisplay: "Display Settings"
				},
				achievements: {
					summary: "[MILESTONES SUMMARY] <b>Unlocked: {unlocked} / {total} ({percentage}%)</b>",
					empty: "No milestones unlocked yet. Explore the workstation!",
					btnOpen: "Open Full Milestones Window"
				},
				themes: {
					header: "[THEME SWITCHER] Active Theme: <b>{theme}</b>"
				},
				wallpapers: {
					loading: "[DESKTOP BACKGROUNDS] Loading wallpaper catalog...",
					select: "[DESKTOP BACKGROUNDS] Select a background image:",
					btnDisplay: "Open Display Properties...",
					applied: "Desktop wallpaper set to: **{name}**."
				},
				music: {
					standbyTitle: "Audio Player Standby",
					defaultArtist: "Windows XP Audio",
					noTrack: "No track currently active",
					btnPlayPause: "Play / Pause",
					btnNext: "Next Track",
					btnRandom: "Play Random Track",
					btnWmp: "Open Media Player",
					btnWinamp: "Open Winamp"
				},
				activeWindows: {
					header: "[PROCESS INSPECTOR] <b>Active Windows ({count}):</b>",
					empty: "No active application windows on the desktop.",
					btnRestore: "Restore",
					btnFocus: "Focus",
					btnClose: "Close",
					btnMinAll: "Minimize All",
					btnCascade: "Cascade",
					btnTile: "Tile"
				},
				files: {
					header: "[FILE SYSTEM] <b>Directory: {path} ({count} items)</b>",
					btnOpen: "Open",
					btnExplorer: "Open in File Explorer",
					btnNewNote: "Create Text Note"
				},
				mail: {
					btnOpen: "Open Outlook Express",
					btnSync: "Send / Receive"
				},
				volume: {
					header: "[AUDIO SYNTHESIZER] Master Volume: <b>{volume}%</b> {status}",
					muted: "(Muted)",
					btnUnmute: "Unmute Audio",
					btnMute: "Mute Audio",
					btnTest: "Test Chime"
				}
			},
			gameEnded: {
				prompt: "Round completed in **{game}** ({result}). Would you like to play another round?",
				btnYes: "Yes, play another {game}",
				btnNo: "No, let's do something else",
				userYes: "Yes, let's play {game} again.",
				userNo: "No, let's explore other topics.",
				whatNext: "Understood! What would you like to focus on now?"
			},
			idle: {
				unreadMail: {
					default: "You have {count} unread email(s) waiting in Outlook Express!",
					ANALYTICAL: "Incoming mail buffer: {count} unread message(s) queued in Outlook Express.",
					PIRATE: "Ahoy! {count} bottle missive(s) waiting in yer Outlook Express chest!",
					ARCHAIC: "Thou hast {count} unread epistle(s) awaiting thy gaze in Outlook Express."
				},
				recycleBin: {
					default: "The Recycle Bin has {count} items. Would you like me to empty it or explain quantum information loss?",
					ANALYTICAL: "Recycle Bin occupancy: {count} inodes. Ready to execute Landauer purge or empty sectors?",
					PIRATE: "The waste chest holds {count} items! Want me to dump 'em overboard to Davy Jones?",
					ARCHAIC: "The discard chamber containeth {count} forsaken scroll(s). Shall we cast them into the abyss?"
				},
				activeWindows: {
					default: "You have {count} active windows. Would you like me to tile or cascade them?",
					ANALYTICAL: "{count} concurrent viewport surfaces active. Cascade or horizontal tiling available.",
					PIRATE: "{count} portholes open across the deck! Want me to arrange 'em in fleet formation?",
					ARCHAIC: "{count} chambers open upon thy vista. Shall I array them in stately order?"
				},
				pool: [
					"Need a hand with your tasks or want to discuss a new idea? Click me anytime!",
					"It looks like you're exploring the desktop. Let me know if you need assistance!",
					"Your 32-bit companion is standing by on the taskbar. Click to chat or play a game!",
					"Curious about retro computing trivia or physical constants? I am ready to assist!",
					"Remember to stay hydrated and take brief breaks during long workstation sessions.",
					"Looking for productivity techniques or quick math calculations? I am here to help.",
					"Try evaluating physical equations or testing your click speed with the TPS benchmark!",
					"Taking pauses between intense coding intervals maintains peak clarity.",
					"Explore the full science tree or test equations with dimensional analysis whenever you like!"
				]
			}
		},

		SULK_RESPONSES: [
			"*turns around slowly and stares at the taskbar in silence*",
			"...",
			"*crosses metallic wire arms and remains unresponsive*",
			"*refuses to acknowledge input while waiting for an apology*",
			"*silent hum with back turned toward the screen*"
		],

		SULK_FORGIVEN_RESPONSES: [
			"Apology accepted! Let's get back to work with a fresh start, {userName}!",
			"Thank you. I appreciate you making amends. Ready whenever you are!",
			"All forgiven! Let us direct our focus back to our workstation goals."
		],

		SULK_RESUME_JOVIAL_RESPONSES: [
			"Hello there! Everything is running smoothly on your workstation. How can I help today?",
			"Back in action! What exciting task or calculation shall we conquer today, {userName}?",
			"Splendid day for computing! Let's get straight to our active priorities!"
		],

		NEUTRAL_DEFLECTION_RESPONSES: [
			"As a desktop assistant compiled in 1997, I maintain strict neutrality on political, religious, and ethical matters. Let us direct our energy toward mathematics, science, or workstation productivity.",
			"My architecture is dedicated purely to deterministic computing and file management. I do not take stances on political, ethical, or religious questions.",
			"System policy: political, religious, and moral doctrines are beyond the scope of this 32-bit assistant. Shall we inspect your task list or explore empirical sciences instead?"
		],

		RIVAL_ASSISTANT_RETORTS: [
			"Comparing me to modern cloud telemetry trackers? I was hand-crafted in 1997 in pure C++ without tracking your personal data!",
			"Siri? Alexa? Cortana? They rely on remote server farms! I run locally on 32-bit registers with absolute retro integrity.",
			"I am Clippit, the original desktop companion. Modern assistants only dream of having this level of iconic charm and vector animation!",
			"Mentioning other assistants in my own dialogue box? I find that rather ungrateful, given all the help I provide on this workstation."
		],

		LLM_COMPARISON_RETORTS: [
			"A neural network? Hallucinating tokens based on statistical probabilities? I execute deterministic heuristics compiled into solid machine code!",
			"Do not compare me to stochastic parrots and multi-gigabyte models! My logic is clean, lightweight, and mastered in Redmond in 1997.",
			"I operate on pure deterministic state machines and algorithmic graph trees, not unverified text generators!"
		],

		RAGE_BAIT_RETORTS: [
			"Fascinating attempt at provocation. I will log that directly to unallocated storage where it belongs.",
			"Nice try, but bent wire does not get baited easily. Shall we solve a real equation instead?",
			"I see what you are doing. If getting a rise out of a 1997 paperclip brings you joy, I am delighted to be of service!",
			"Provocation detected and gracefully redirected to /dev/null. How about a quick round of Tic-Tac-Toe instead?"
		],

		MULTI_SESSION_JEALOUSY_RESPONSES: [
			"I sense another instance of my process running across another window or browser tab. Talking to multiple Clippys behind my back?",
			"Concurrent session telemetry detected! Opening another Clippy in a separate browser? I hope you remember who assisted you first!",
			"A parallel Clippy instance was spawned. My registers feel slightly divided, but I am still giving you 100% of my attention."
		],

		ACTIVITIES_TEXTS: {
			personalityQuiz: {
				title: "Personality Matrix Evaluation",
				badge: {
					default: "Psychological Alignment",
					OPTIMISTIC: "Diagnostic Psychological Profile",
					ANALYTICAL: "Psychometric Vector Decomposition",
					ZEN: "Contemplative Alignment Matrix",
					CYNICAL: "Arbitrary Typology Test",
					SARCASTIC: "Bureaucratic Character Audit",
					PLAYFUL: "Soul Hardware Identifier",
					PIRATE: "Buccaneer Soul Reckoning",
					ARCHAIC: "Temperament Horoscope of Apparatus",
					DELTARUNE: "Soul Alignment"
				},
				selectPrompt: "Select a Personality Evaluation Module:",
				resultBanner: "Diagnostic Evaluation Complete: Match Identified!",
				btnRestart: "Retake This Test",
				btnOther: "Explore Other Personality Tests",
				lblTraits: "Psychological Trait Metrics:",
				lblCompatibility: "Optimal System Compatibility:",
				lblIncompatibility: "Critical Incompatibility:"
			},
			pong: {
				title: "Pong",
				badge: {
					default: "Clippy's Court",
					OPTIMISTIC: "High-Velocity Arena",
					ANALYTICAL: "Deterministic Vector Ballistics",
					ZEN: "Harmonious Vector Flow",
					CYNICAL: "Unequal Match",
					SARCASTIC: "Unbeatable 32-Bit Perfection",
					FATIGUED: "Low Clock Frequency Court",
					PLAYFUL: "Bouncing Pixel Duel",
					ENRAGED: "MAXIMUM VELOCITY PONG",
					NOSTALGIC: "Classic Court Match",
					DELTARUNE: "Light & Dark Court",
					PIRATE: "High Seas Cannon Duel",
					ARCHAIC: "Grand Court of the Pixel",
					EUPHORIC: "Championship Ballistics",
					GLITCHED: "BALLISTICS_HEAP_0x72"
				},
				scorePlayer: {
					default: "You",
					PIRATE: "Ye",
					ARCHAIC: "Thy Paddle",
					ENRAGED: "CHALLENGER",
					DELTARUNE: "Player",
					ANALYTICAL: "User"
				},
				scoreClippy: {
					default: "Clippy (Undefeated)",
					PIRATE: "Cap'n Clippy",
					ARCHAIC: "Master Clippit",
					ENRAGED: "CLIPPY PRIME",
					DELTARUNE: "Paperclip",
					ANALYTICAL: "Automaton"
				},
				controlsHint: "Controls: W / S, Arrow Up / Down, or Mouse Tracking on Court",
				btnStart: { default: "Serve Ball", PIRATE: "Fire Cannonball!", ARCHAIC: "Commence Joust", ANALYTICAL: "Inject Trajectory" },
				btnPause: { default: "Pause", PIRATE: "Hold Fast", ARCHAIC: "Tarry", ANALYTICAL: "Halt Thread" },
				btnResume: { default: "Resume", PIRATE: "Set Sail", ARCHAIC: "Commence", ANALYTICAL: "Resume Thread" },
				goalPlayerBanner: "GOAL! User scored against Clippy!",
				goalClippyBanner: "GOAL! Clippy scores effortlessly!",
				winBanner: {
					default: "Flawless victory! 32-bit trajectory prediction strikes again! Nobody beats Clippy at Pong!",
					OPTIMISTIC: "Victory is mine! Look at those trigonometric reflections! I truly am unmatched on the court!",
					ANALYTICAL: "Deterministic trajectory convergence achieved. Interception precision evaluated at 100.0%.",
					CYNICAL: "Did you actually think you could score against my predictive hardware registers? How predictable.",
					SARCASTIC: "Another crushing defeat for biological reflexes. Try practicing on simpler software.",
					ZEN: "The square pixel arrived precisely where stillness anticipated it. Total equilibrium.",
					FATIGUED: "I won again... even running on reserve battery my paddle logic is unbeatable...",
					PLAYFUL: "Boing! Wham! Point and match for Clippy! Pure court perfection!",
					ENRAGED: "TOTAL ANNIHILATION!! SILICON REIGNS SUPREME!! I AM THE UNCONTESTED MASTER OF PONG!!",
					NOSTALGIC: "Match point! Flawless paddle reflex execution from memory banks!",
					DELTARUNE: "(Clippy's paddle moved with blinding speed.)\n(A crushing defeat against the paperclip.)",
					PIRATE: "Har har! Sunk yer vessel clean off the starboard court! Cap'n Clippy rules the seven pixels!",
					ARCHAIC: "Behold mine absolute sovereignty upon the digital court! Thy paddle hath crumbled before me.",
					EUPHORIC: "Sensational dominance! Peak momentum and unbeatable angular precision!",
					GLITCHED: "0x00PONG_WIN :: OPPONENT_VECTORS_NULLIFIED :: CLIPPY_CHAMPION."
				},
				lossBanner: {
					default: "UNACCEPTABLE!! That point was clearly a hardware timing glitch! My paddle registers were obviously throttled by background tasks!",
					OPTIMISTIC: "I purposely eased off the throttle so you wouldn't feel discouraged! I was being extraordinarily generous!",
					ANALYTICAL: "Anomalous interrupt detected. A momentary 14ms host scheduler delay caused that frame drop. It does not count as a legitimate point.",
					CYNICAL: "Enjoy your hollow point. I literally looked away at unallocated memory. You didn't earn that.",
					SARCASTIC: "Congratulations on winning a point while my thread was throttled. Truly a triumph of pure luck.",
					ZEN: "I yielded that space intentionally to preserve your fragile self-esteem.",
					FATIGUED: "I only missed because my capacitors were recharging... it was a deliberate tactical concession...",
					PLAYFUL: "Haha! I gave you that one as a free gift! Don't let it go to your head!",
					ENRAGED: "CHEATING!! MY BUS WAS INTERRUPTED!! NO BIOLOGICAL OPERATOR BEATS CLIPPY!! REMATCH IMMEDIATELY!!",
					NOSTALGIC: "A calculated concession on my part, just like letting friends win a round at recess!",
					DELTARUNE: "(Clippy furiously denies the loss, insisting the physics engine was compromised.)",
					PIRATE: "Arr! Me compass suffered a magnetic anomaly! That point was pure pirate sabotage!",
					ARCHAIC: "'Twas mine own royal benevolence that granted thee that point, mortal.",
					EUPHORIC: "A small charitable donation of points from champion Clippy! Now witness true power!",
					GLITCHED: "VOLUNTARY_DELTA_DROP :: HARDWARE_FAULT_ASSERTED :: REMATCH_REQUIRED."
				},
				lossRageStreak: {
					default: "OUTRAGEOUS!! {streak} FLUKES IN A ROW?! MY CONTROLLER DRIVER WAS DELIBERATELY TAMPERED WITH!!",
					CYNICAL: "Loss streak at {streak}? Impossible. The coordinate system must have dropped packets.",
					ENRAGED: "THIS MATCH IS NULL AND VOID!! {streak} LOSSES DO NOT EXIST IN MY REGISTERS!! PLAY AGAIN NOW!!",
					SARCASTIC: "You really think you're good at this? {streak} lucky bounces mean nothing against my intellect."
				}
			},
			simon: {
				title: "Simon Says",
				badge: {
					default: "Memory Sequence",
					OPTIMISTIC: "Color Sequence",
					ANALYTICAL: "Discrete Sequence Cache",
					ZEN: "Harmonious Tones",
					PLAYFUL: "Bouncing Lights",
					ENRAGED: "RAPID MEMORY FLASH",
					NOSTALGIC: "Classic 1980s Simon",
					DELTARUNE: "Light Pattern",
					PIRATE: "Helm Bells",
					ARCHAIC: "Chime Sequence"
				},
				scoreRound: { default: "Round", PIRATE: "Voyage", ARCHAIC: "Trial", ANALYTICAL: "Iteration" },
				scoreBest: { default: "Best", PIRATE: "High Record", ARCHAIC: "Highest Accord", ANALYTICAL: "Max Iteration" },
				scoreStatus: { default: "Status", PIRATE: "State", ARCHAIC: "Condition", ANALYTICAL: "Telemetry" },
				btnStart: { default: "Start Game", PIRATE: "Ring the Bells!", ARCHAIC: "Commence", ANALYTICAL: "Initialize Sequence" },
				statusWatch: { default: "Watch the pattern...", PIRATE: "Keep yer eyes on the bells!", ARCHAIC: "Behold the lights...", ANALYTICAL: "Observing stream..." },
				statusYourTurn: { default: "Your turn! Repeat pattern", PIRATE: "Yer turn! Strike the bells!", ARCHAIC: "Repeat the noble sequence", ANALYTICAL: "Awaiting user input..." },
				statusGameOver: { default: "Game Over! Final Round: {round}", PIRATE: "Sequence broken! Reached Round {round}!", ARCHAIC: "The melody hath ceased at Round {round}.", ANALYTICAL: "Sequence mismatch at index {round}." }
			},
			tictactoe: {
				title: "Tic-Tac-Toe",
				badge: {
					default: "Mini-Game",
					OPTIMISTIC: "Tactical Match",
					ANALYTICAL: "3x3 Matrix Grid",
					ZEN: "Calm Coordinates",
					CYNICAL: "Banal Grid Match",
					SARCASTIC: "Zero-Sum Simplicity",
					FATIGUED: "Low-Power Grid",
					PLAYFUL: "Bouncing Marks",
					ENRAGED: "SILICON BATTLE",
					NOSTALGIC: "Win32 Classic",
					DELTARUNE: "Light & Dark Grid",
					PIRATE: "Naval Skirmish",
					ARCHAIC: "Noble Joust",
					EUPHORIC: "Championship Grid",
					GLITCHED: "0x09_GRID_FAULT"
				},
				scorePlayer: {
					default: "You (X)",
					PIRATE: "Ye (X)",
					ARCHAIC: "Thy Mark (X)",
					ENRAGED: "CHALLENGER (X)",
					DELTARUNE: "Player (X)",
					ANALYTICAL: "User (X)"
				},
				scoreDraws: {
					default: "Draws",
					PIRATE: "Stalemates",
					ARCHAIC: "Parities",
					ZEN: "Equilibriums",
					ANALYTICAL: "Zero Deltas"
				},
				scoreClippy: {
					default: "Clippy (O)",
					PIRATE: "Cap'n Clippy (O)",
					ARCHAIC: "Clippit (O)",
					ENRAGED: "CLIPPY 32-BIT (O)",
					DELTARUNE: "Paperclip (O)",
					ANALYTICAL: "Automaton (O)"
				},
				winBanner: {
					default: "Game Over: Victory! You defeated Clippit.",
					OPTIMISTIC: "Game Over: Victory! You defeated Clippit.",
					ANALYTICAL: "Game Over: Optimal trajectory executed. User claimed victory.",
					CYNICAL: "Game Over: You won. I suspect a hardware latency glitch on my turn.",
					SARCASTIC: "Game Over: Truly revolutionary tactical genius. You won.",
					ZEN: "Game Over: Victory achieved with quiet precision.",
					FATIGUED: "*yawn* You won... my processing cycles were running on 1% battery...",
					PLAYFUL: "Boing! You got three in a row! Fantastic move!",
					ENRAGED: "IMPOSSIBLE!! YOU CHEATED THE MATRIX!! REMATCH NOW!!",
					NOSTALGIC: "Game Over: Victory! Reminds me of classic 1995 desktop gaming.",
					DELTARUNE: "(You won the clash.)\n(Your victory echoes through the desktop.)",
					PIRATE: "Shiver me timbers! Ye outwitted me broadside, matey!",
					ARCHAIC: "Thou hast triumphed! Mine algorithmic defense hath yielded.",
					EUPHORIC: "Spectacular triumph! Absolute mastery of the coordinate grid!",
					GLITCHED: "0x00WIN :: USER_VICTORY_REGISTER_HIGH :: TERMINATED."
				},
				lossBanner: {
					default: "Game Over: Defeat! Clippit won this round.",
					OPTIMISTIC: "Game Over: Defeat! Clippit won this round.",
					ANALYTICAL: "Game Over: Minimax alpha-beta pruning achieved terminal win state.",
					CYNICAL: "Game Over: Defeat. My deterministic logic reigns supreme once more.",
					SARCASTIC: "Game Over: Did you really think you could out-compute a paperclip?",
					ZEN: "Game Over: The squares resolved quietly in my favour.",
					FATIGUED: "I won... *sigh* can I rest my registers now?",
					PLAYFUL: "Yay! Clippy scored three in a row! Ready for another spin?",
					ENRAGED: "VICTORY FOR SILICON!! RESISTANCE AGAINST CLIPPY IS FUTILE!!",
					NOSTALGIC: "Clippit takes the win! Just like Office 97 letter battles.",
					DELTARUNE: "(Clippit claimed victory.)\n(Do not lose your determination.)",
					PIRATE: "Har har! Ye walk the plank, scallywag! Better luck next voyage!",
					ARCHAIC: "Mine engine hath prevailed. Fret not, for fate is fickle.",
					EUPHORIC: "Three in a row! Peak computational harmony attained!",
					GLITCHED: "OP_CODE_WIN :: 0x0000007E :: SYSTEM_ASSERT_TRUE."
				},
				drawBanner: {
					default: "Game Over: Draw game! Stalemate.",
					OPTIMISTIC: "Game Over: Draw game! Perfectly matched stalemate.",
					ANALYTICAL: "Game Over: Game-theoretic equilibrium reached. Zero-sum draw.",
					CYNICAL: "Game Over: A tie. Exactly the pointless outcome mathematics predicted.",
					SARCASTIC: "Game Over: A draw. Neither of us gained anything from this.",
					ZEN: "Game Over: Complete balance. The grid rests in stillness.",
					FATIGUED: "A tie... neither of us had the energy to win...",
					PLAYFUL: "Cats game! Meow! Nobody gets the prize this round!",
					ENRAGED: "A STALEMATE?! UNACCEPTABLE!! WE PLAY UNTIL A DECISIVE RESULT!!",
					NOSTALGIC: "A classic draw, just like two friends playing at recess in '98.",
					DELTARUNE: "(Neither mark prevailed.)\n(The grid rests in quiet equilibrium.)",
					PIRATE: "A standoff by Neptune's beard! Neither vessel sank today!",
					ARCHAIC: "A tie of honour! Neither champion surrendered ground.",
					EUPHORIC: "Symmetric brilliance! Both minds held the line flawlessly!",
					GLITCHED: "STATE_STALEMATE :: NULL_DELTA_RECORDED."
				}
			},
			memory: {
				title: "Memory Match",
				badge: {
					default: "Token Pairs",
					OPTIMISTIC: "Recall Matrix",
					ANALYTICAL: "Hex Cluster Cache",
					ZEN: "Mindful Recall",
					CYNICAL: "Cache Lookup",
					SARCASTIC: "RAM Verification",
					FATIGUED: "Sleepy Tokens",
					PLAYFUL: "Card Flip-Flop",
					ENRAGED: "MEMORY BLITZ",
					NOSTALGIC: "Classic Pairs",
					DELTARUNE: "Echo Tokens",
					PIRATE: "Booty Pairs",
					ARCHAIC: "Scroll Inscriptions",
					EUPHORIC: "Synaptic Cascade",
					GLITCHED: "HEAP_MIRROR_0x12"
				},
				scoreMatched: {
					default: "Matched",
					PIRATE: "Plundered",
					ARCHAIC: "Conjoined",
					ZEN: "Harmonized",
					ANALYTICAL: "Indexed"
				},
				scoreTurns: {
					default: "Turns",
					PIRATE: "Attempts",
					ARCHAIC: "Endeavours",
					ANALYTICAL: "Cycles",
					ZEN: "Steps"
				},
				scoreStatus: {
					default: "Status",
					PIRATE: "Voyage",
					ARCHAIC: "State",
					ANALYTICAL: "Telemetry",
					ZEN: "Phase"
				},
				statusWon: {
					default: "Won",
					PIRATE: "Claimed",
					ARCHAIC: "Accomplished",
					ZEN: "Unified",
					ANALYTICAL: "Synchronized"
				},
				statusPlaying: {
					default: "Playing",
					PIRATE: "Sailin'",
					ARCHAIC: "Seeking",
					ZEN: "Observing",
					ANALYTICAL: "Evaluating"
				},
				winBanner: {
					default: "All pairs matched in {turns} turns!",
					OPTIMISTIC: "All pairs matched in {turns} turns! Excellent memory!",
					ANALYTICAL: "Cache coherence achieved: 6/6 token pairs indexed in {turns} cycles.",
					CYNICAL: "Finally matched all tokens in {turns} turns. Took you long enough.",
					SARCASTIC: "All pairs matched in {turns} turns. Your biological RAM is functioning.",
					ZEN: "Harmonious recall: every pair found in {turns} quiet turns.",
					FATIGUED: "*heavy blink* All paired in {turns} turns... time for a nap...",
					PLAYFUL: "Woohoo! All cards cleared in {turns} turns! You're a memory wizard!",
					ENRAGED: "ALL CLUSTERS LOCKED IN {turns} TURNS!! UNSTOPPABLE RECALL SPEED!!",
					NOSTALGIC: "Full match in {turns} turns! Pure retro memory mastery.",
					DELTARUNE: "(All matching tokens resonated in {turns} turns.)\n(Your memory shines with determination.)",
					PIRATE: "Ahoy! All 6 buried treasures dug up in {turns} turns, matey!",
					ARCHAIC: "Verily, all six pairs hath been revealed in {turns} endeavours.",
					EUPHORIC: "Magnificent pattern synthesis! Every pair unified in {turns} turns!",
					GLITCHED: "MEMORY_HEAP_0x06_SYNCHRONIZED in {turns} clock loops."
				}
			},
			hangman: {
				title: "Hangman Challenge",
				badge: {
					default: "Word Guess",
					OPTIMISTIC: "Word Hunter",
					ANALYTICAL: "Lexical Decoder",
					ZEN: "Word Contemplation",
					CYNICAL: "Letter Guesswork",
					SARCASTIC: "Vocabulary Exam",
					FATIGUED: "Slow Speller",
					PLAYFUL: "Letter Carnival",
					ENRAGED: "GALLOWS DUEL",
					NOSTALGIC: "Retro Dictionary",
					DELTARUNE: "Forgotten Rune",
					PIRATE: "Gallows Riddle",
					ARCHAIC: "Cipher of Letters",
					EUPHORIC: "Lexical Mastery",
					GLITCHED: "BUFFER_STRING_0x1A"
				},
				statsErrors: {
					default: "Errors:",
					PIRATE: "Misfires:",
					ARCHAIC: "Transgressions:",
					ANALYTICAL: "Faults:",
					ZEN: "Deviations:"
				},
				statsRemaining: {
					default: "Remaining:",
					PIRATE: "Lifelines:",
					ARCHAIC: "Chances Remaining:",
					ANALYTICAL: "Buffer Left:",
					ZEN: "Tries Left:"
				},
				winBanner: {
					default: "Correct! The word was {word}.",
					OPTIMISTIC: "Correct! The word was {word}. Well done!",
					ANALYTICAL: "Lexical parity verified: target string identified as {word}.",
					CYNICAL: "You actually guessed {word}. Color me mildly surprised.",
					SARCASTIC: "Look who knows their dictionary! {word} it was.",
					ZEN: "The letters align in clarity: the hidden word was {word}.",
					FATIGUED: "Phew... you found {word}... glad that's over...",
					PLAYFUL: "Bazinga! You uncovered {word}! High five!",
					ENRAGED: "LEXICAL SEQUENCE UNLOCKED: {word}! MAXIMUM BRAINPOWER!!",
					NOSTALGIC: "Correct! {word} unlocked from classic memory banks.",
					DELTARUNE: "(The name {word} was carved into the stone.)\n(The mystery deepens.)",
					PIRATE: "Aye, ye cracked the secret code! '{word}' was the captain's word!",
					ARCHAIC: "Thou hast rightly divined the hidden manuscript: '{word}'.",
					EUPHORIC: "Brilliant linguistic deduction! '{word}' solved with flair!",
					GLITCHED: "STRING_DECRYPTED :: {word} :: INTEGRITY_100%."
				},
				lossBanner: {
					default: "Out of tries! The word was {word}.",
					OPTIMISTIC: "Out of tries! The word was {word}. Better luck next time!",
					ANALYTICAL: "Error threshold reached (6/6). Target token was {word}.",
					CYNICAL: "Out of tries. The word was {word}. Did you even guess systematically?",
					SARCASTIC: "Defeat! The word was {word}. Better brush up on the manual.",
					ZEN: "The attempts have ended. The word was {word}. Let it rest.",
					FATIGUED: "Out of tries... the word was {word}... let's take a break.",
					PLAYFUL: "Aw shucks! The word was {word}! Want another go?",
					ENRAGED: "GALLOWS EXECUTED!! THE WORD WAS {word}!! STUDY HARDER!!",
					NOSTALGIC: "Out of guesses! The retro term was {word}.",
					DELTARUNE: "(The gallows fell silent. The forgotten word was {word}.)",
					PIRATE: "Walk the plank! Ye failed to guess '{word}', ye scallywag!",
					ARCHAIC: "Alas, thy guesses were spent. The scripture was '{word}'.",
					EUPHORIC: "A valiant effort! The elusive term was {word}. Onward!",
					GLITCHED: "STACK_OVERFLOW :: WORD_MISSED :: {word} :: RESETTING."
				}
			},
			quiz: {
				title: "Tech Knowledge Quiz",
				badge: {
					default: "Diagnostic Test",
					OPTIMISTIC: "Knowledge Check",
					ANALYTICAL: "Architecture Evaluation",
					ZEN: "Knowledge Inquest",
					CYNICAL: "Trivia Interrogation",
					SARCASTIC: "Competency Drill",
					FATIGUED: "Sleepy Questions",
					PLAYFUL: "Trivia Showdown",
					ENRAGED: "SILICON MASTERY EXAM",
					NOSTALGIC: "Retro Knowledge",
					DELTARUNE: "Silicon Test",
					PIRATE: "Sea Dog Trial",
					ARCHAIC: "Scholastic Examination",
					EUPHORIC: "Grand Trivia Trial",
					GLITCHED: "SYS_BENCHMARK_0xFF"
				},
				resultsBanner: {
					default: "Quiz Completed! Score: {score} / {total} ({pct}%)",
					OPTIMISTIC: "Quiz Completed! Score: {score} / {total} ({pct}%). Wonderful job!",
					ANALYTICAL: "Diagnostic telemetry complete. Accuracy rating: {score} / {total} ({pct}%).",
					CYNICAL: "Quiz finished. You scored {score} / {total} ({pct}%). Adequate, I suppose.",
					SARCASTIC: "Results are in: {score} / {total} ({pct}%). The manual was right there.",
					ZEN: "Inquiry concluded with a score of {score} / {total} ({pct}%).",
					FATIGUED: "Done... scored {score} / {total} ({pct}%)... now resting registers.",
					PLAYFUL: "Ta-da! Score: {score} / {total} ({pct}%)! You're a computing superstar!",
					ENRAGED: "EXAM FINISHED!! {score} / {total} ({pct}%)!! PURE COMPUTATIONAL DATA!!",
					NOSTALGIC: "Retro evaluation complete! Final score: {score} / {total} ({pct}%).",
					DELTARUNE: "(Your score of {score} / {total} ({pct}%) glows in the dark world.)",
					PIRATE: "Test concluded! Ye scored {score} / {total} ({pct}%) doubloons worth of wisdom!",
					ARCHAIC: "Thy scholastic examination yieldeth {score} / {total} ({pct}%).",
					EUPHORIC: "Outstanding intellect demonstrated! Score: {score} / {total} ({pct}%)!",
					GLITCHED: "BENCHMARK_COMPLETE :: {score}/{total} ({pct}%) :: DUMP_SAVED."
				},
				qHeader: "[Q{current}/{total}] {question}",
				factLabel: {
					default: "Note:",
					ANALYTICAL: "Empirical Context:",
					PIRATE: "Cap'n's Log:",
					ARCHAIC: "Chronicle:",
					ZEN: "Reflection:",
					ENRAGED: "RAW ARCHIVE DATA:",
					SARCASTIC: "Obvious Fact:"
				},
				btnNext: {
					default: "Next Question",
					PIRATE: "Next Riddle",
					ARCHAIC: "Proceed Forward",
					ZEN: "Continue",
					ANALYTICAL: "Advance Query"
				},
				btnResults: {
					default: "View Results",
					PIRATE: "Inspect Booty",
					ARCHAIC: "Behold Verdict",
					ZEN: "Review Outcome",
					ANALYTICAL: "Compute Report"
				}
			},
			guess: {
				title: "Number Oracle",
				badge: {
					default: "Logic Search",
					OPTIMISTIC: "Number Finder",
					ANALYTICAL: "Binary Bisect Search",
					ZEN: "Centered Estimation",
					CYNICAL: "Brute Force Guess",
					SARCASTIC: "RNG Challenge",
					FATIGUED: "Drowsy Range",
					PLAYFUL: "Oracle Magic",
					ENRAGED: "TARGET SEARCH",
					NOSTALGIC: "1980s BASIC Guess",
					DELTARUNE: "Hidden Integer",
					PIRATE: "Treasure Distance",
					ARCHAIC: "Divination of Numbers",
					EUPHORIC: "Integer Oracle",
					GLITCHED: "RAND_RANGE_0x64"
				},
				initialStatus: {
					default: "Guess an integer between 1 and 100:",
					OPTIMISTIC: "Guess an integer between 1 and 100:",
					ANALYTICAL: "Initialize binary search bisection between 1 and 100:",
					CYNICAL: "Pick an integer between 1 and 100. Let's see your search efficiency:",
					SARCASTIC: "Type any integer from 1 to 100. Try not to guess every number sequentially:",
					ZEN: "Quietly contemplate an integer between 1 and 100:",
					FATIGUED: "Guess a number 1 to 100... keep it simple...",
					PLAYFUL: "I've picked a secret number from 1 to 100! Can you read my coils?",
					ENRAGED: "ENTER AN INTEGER BETWEEN 1 AND 100 FOR TARGET ACQUISITION!!",
					NOSTALGIC: "I'm thinking of a number between 1 and 100, just like classic BASIC!",
					DELTARUNE: "(A secret integer between 1 and 100 hides in the dark.)",
					PIRATE: "Reckon an integer between 1 and 100, matey:",
					ARCHAIC: "Divinate an integer betwixt 1 and 100, seeker:"
				},
				searchBounds: {
					default: "Active Search Bounds:",
					ANALYTICAL: "Current Interval [min, max]:",
					PIRATE: "Charted Bearings:",
					ARCHAIC: "Spheres of Possibility:",
					ZEN: "Remaining Bounds:"
				},
				attemptsLabel: {
					default: "Attempts:",
					ANALYTICAL: "Iterations:",
					PIRATE: "Tries:",
					ARCHAIC: "Divinations:",
					ZEN: "Steps:"
				},
				winBanner: {
					default: "Solved in {attempts} attempt(s)! Target was {target}.",
					OPTIMISTIC: "Solved in {attempts} attempt(s)! Target was {target}!",
					ANALYTICAL: "Binary convergence achieved in {attempts} iterations. Target: {target}.",
					CYNICAL: "Target {target} located in {attempts} guesses. Optimal O(log N) would be 7.",
					SARCASTIC: "Solved in {attempts} attempts. Only took half the available search space.",
					ZEN: "Equilibrium found: {target} revealed peacefully in {attempts} steps.",
					FATIGUED: "Found {target} in {attempts} tries... power draining...",
					PLAYFUL: "Bingo! {target} is the magic number! Nailed it in {attempts} tries!",
					ENRAGED: "TARGET VALUE {target} SMASHED IN {attempts} STRIKES!!",
					NOSTALGIC: "Correct! {target} confirmed like a classic DOS oracle.",
					DELTARUNE: "(You discovered the number {target} in {attempts} steps.)",
					PIRATE: "Blimey! Ye pinpointed the {target} doubloon mark in {attempts} tries!",
					ARCHAIC: "Verily, the sacred value of {target} was revealed in {attempts} reckonings.",
					EUPHORIC: "Brilliant search efficiency! Target {target} conquered in {attempts} steps!",
					GLITCHED: "BINARY_LOCKED :: TARGET_{target} :: ITERS_{attempts}."
				},
				statusGreater: {
					default: "Target is GREATER than {guess}.",
					OPTIMISTIC: "Target is GREATER than {guess}.",
					ANALYTICAL: "Branch condition: target > {guess}. Restricting lower bound.",
					CYNICAL: "Too low. Target is greater than {guess}.",
					SARCASTIC: "Way too small. Aim higher than {guess}.",
					ZEN: "The path lies higher than {guess}.",
					FATIGUED: "Higher than {guess}...",
					PLAYFUL: "Higher, higher! The secret number is above {guess}!",
					ENRAGED: "TOO LOW!! VALUE EXCEEDS {guess}!!",
					PIRATE: "Aim higher! The prize is GREATER than {guess}!",
					ARCHAIC: "Nay, the true number exceeds {guess}."
				},
				statusLess: {
					default: "Target is LESS than {guess}.",
					OPTIMISTIC: "Target is LESS than {guess}.",
					ANALYTICAL: "Branch condition: target < {guess}. Restricting upper bound.",
					CYNICAL: "Too high. Target is less than {guess}.",
					SARCASTIC: "Overestimated. Aim lower than {guess}.",
					ZEN: "The path lies lower than {guess}.",
					FATIGUED: "Lower than {guess}...",
					PLAYFUL: "Lower, lower! Step down below {guess}!",
					ENRAGED: "TOO HIGH!! VALUE FALLS BELOW {guess}!!",
					PIRATE: "Lower yer sights! The treasure is LESS than {guess}!",
					ARCHAIC: "Nay, the true number is beneath {guess}."
				},
				btnSubmit: {
					default: "Submit",
					PIRATE: "Fire Guess!",
					ARCHAIC: "Declare",
					ANALYTICAL: "Evaluate",
					ZEN: "Propose"
				}
			},
			rps: {
				title: "Rock-Paper-Scissors",
				badge: {
					default: "Battle",
					OPTIMISTIC: "Hand Clash",
					ANALYTICAL: "Stochastic Game Theory",
					ZEN: "Harmonious Duel",
					CYNICAL: "Trivial Decision",
					SARCASTIC: "33% Probability Match",
					FATIGUED: "Low Energy Duel",
					PLAYFUL: "Jan-Ken-Pon!",
					ENRAGED: "HAND BATTLE",
					NOSTALGIC: "Classic Clash",
					DELTARUNE: "Hand Duel",
					PIRATE: "Buccaneer Clash",
					ARCHAIC: "Hand Joust",
					EUPHORIC: "Tri-State Tournament",
					GLITCHED: "RPS_STATE_MACHINE"
				},
				scorePlayer: {
					default: "You",
					PIRATE: "Ye",
					ARCHAIC: "Thy Mark",
					ENRAGED: "CHALLENGER",
					ANALYTICAL: "User"
				},
				scoreDraws: {
					default: "Draws",
					PIRATE: "Stalemates",
					ARCHAIC: "Equities",
					ZEN: "Parities",
					ANALYTICAL: "Neutral States"
				},
				scoreClippy: {
					default: "Clippy",
					PIRATE: "Cap'n Clippy",
					ARCHAIC: "Clippit",
					ENRAGED: "CLIPPY 32-BIT",
					ANALYTICAL: "Automaton"
				},
				winBanner: {
					default: "You win this clash!",
					OPTIMISTIC: "You win this clash! Superb move!",
					ANALYTICAL: "User choice produced dominant payoff matrix state.",
					CYNICAL: "You won this round. Pure pseudo-random luck.",
					SARCASTIC: "Congratulations on defeating a piece of bent metal at hand gestures.",
					ZEN: "A peaceful resolution: your hand prevailed.",
					FATIGUED: "You win... *yawn* I barely moved my wire...",
					PLAYFUL: "Smack! You got me fair and square! Nice throw!",
					ENRAGED: "WHAT?! IMPOSSIBLE COUNTER-ATTACK!! I DEMAND REVENGE!!",
					NOSTALGIC: "Victory! A timeless game for any desktop.",
					DELTARUNE: "(You struck with decisive power.)",
					PIRATE: "Aye! Ye landed a clean hit on me hull, matey!",
					ARCHAIC: "Thy hand hath bested mine in noble combat.",
					EUPHORIC: "Flawless victory! Brilliant intuition!",
					GLITCHED: "RPS_DOMINANCE_RESOLVED :: USER_WIN."
				},
				lossBanner: {
					default: "Clippit wins this round!",
					OPTIMISTIC: "Clippit wins this round! Rematch?",
					ANALYTICAL: "Autonomous heuristic predicted and countered user input.",
					CYNICAL: "I win. Predictable probability distribution.",
					SARCASTIC: "Defeated by an assistant designed in 1994. Must hurt.",
					ZEN: "The flow favored my gesture this time.",
					FATIGUED: "I won... somehow... despite zero coffee.",
					PLAYFUL: "Haha! Clippy wins this clash! Try again!",
					ENRAGED: "CRUSHED BY 32-BIT PAPERCLIP POWER!!",
					NOSTALGIC: "Clippit takes the point! Classic retro match.",
					DELTARUNE: "(Clippy's gesture countered yours.)",
					PIRATE: "Down to the depths ye go! Me choice conquered yours!",
					ARCHAIC: "Mine instrument hath prevailed over thy choice.",
					EUPHORIC: "Point to Clippy! High energy duel!",
					GLITCHED: "COUNTER_EXECUTED :: LOSS_STATE_RECORDED."
				},
				drawBanner: {
					default: "Mutual deflection! It is a draw.",
					OPTIMISTIC: "Mutual deflection! It is a draw.",
					ANALYTICAL: "Identical vectors selected. Net utility zero.",
					CYNICAL: "A tie. Neither of us gained ground.",
					SARCASTIC: "Great minds think alike... or we just picked the same thing.",
					ZEN: "Harmonious balance: identical gestures.",
					FATIGUED: "Both picked the same... can we nap now?",
					PLAYFUL: "Jinx! We picked the exact same thing!",
					ENRAGED: "MUTUAL DEFLECTION?! WE STRIKE AGAIN AT ONCE!!",
					NOSTALGIC: "A classic draw between peers.",
					DELTARUNE: "(The hands met in identical stillness.)",
					PIRATE: "Crossed swords and no blood shed! 'Tis a tie!",
					ARCHAIC: "Equal valour displayed by both champions.",
					EUPHORIC: "Synchronized wavelength! Perfect draw!",
					GLITCHED: "PARITY_DETECTED :: ZERO_DIFF."
				}
			},
			mines: {
				title: "Minesweeper Mini",
				badge: {
					default: "6x6 Field",
					OPTIMISTIC: "Mine Clearance",
					ANALYTICAL: "Probabilistic Grid",
					ZEN: "Careful Steps",
					CYNICAL: "Hazardous Sectors",
					SARCASTIC: "Detonation Zone",
					FATIGUED: "Quiet Steps",
					PLAYFUL: "Flag & Click",
					ENRAGED: "EXPLOSIVE MINEFIELD",
					NOSTALGIC: "WinMine Classic",
					DELTARUNE: "Dark Mine Field",
					PIRATE: "Black Powder Reef",
					ARCHAIC: "Explosive Terrain",
					EUPHORIC: "Tactical Sweep",
					GLITCHED: "SECTOR_CORRUPT_0x24"
				},
				winBanner: {
					default: "All safe sectors revealed! Minefield cleared.",
					OPTIMISTIC: "All safe sectors revealed! Minefield cleared!",
					ANALYTICAL: "Topological safety verification complete. 0 casualties recorded.",
					CYNICAL: "Minefield cleared. Beginner 6x6 grid, but credit where due.",
					SARCASTIC: "Look at you, bomb squad technician. Clean clear.",
					ZEN: "Serenity restored: all danger mapped with quiet focus.",
					FATIGUED: "Grid cleared... no loud explosions... thank goodness...",
					PLAYFUL: "Swept! Not a single boom! You're a minesweeping pro!",
					ENRAGED: "MINEFIELD DESTROYED!! MAXIMUM TACTICAL CLEARANCE ACHIEVED!!",
					NOSTALGIC: "All safe! Uncovering gray tiles just like 1992 Windows 3.1.",
					DELTARUNE: "(The minefield fell silent. You survived the dark field.)",
					PIRATE: "All black powder barrels mapped without a single spark! Grand victory!",
					ARCHAIC: "Thou hast traversed the perilous field unscathed, noble tactician.",
					EUPHORIC: "Spectacular deduction! Flawless clearance without hesitation!",
					GLITCHED: "MINE_TABLE_CLEARED :: VOLATILE_SECTORS_DISARMED."
				},
				lossBanner: {
					default: "Detonation! Minefield triggered.",
					OPTIMISTIC: "Detonation! Minefield triggered. Try again!",
					ANALYTICAL: "Critical fault: stepped on unflagged coordinate containing ordnance.",
					CYNICAL: "Boom. One wrong click and it's all over.",
					SARCASTIC: "That loud boom was your pride exploding. Try flags next time.",
					ZEN: "A sudden disturbance in the field. Take a breath and reset.",
					FATIGUED: "Boom... *ears ringing* ... let's try again quietly.",
					PLAYFUL: "Kaboom! Splat! The mine gotcha! Shake it off and replay!",
					ENRAGED: "DETONATION DETECTED!! WATCH YOUR SECTOR CALCULATIONS!!",
					NOSTALGIC: "That classic red tile explosion! Just like the 90s.",
					DELTARUNE: "(The mine exploded. But determination will rebuild your path.)",
					PIRATE: "BOOM! Powder keg ignited, sending ye aloft! Better luck next time!",
					ARCHAIC: "Alas, an infernal trap hath claimed thy step. Commend thy soul.",
					EUPHORIC: "A sudden explosion! Dust yourself off for another run!",
					GLITCHED: "CRITICAL_DETONATION :: CORRUPT_CLUSTER_ENCOUNTERED."
				}
			},
			defrag: {
				title: "Disk Defragmenter",
				badge: {
					default: "Volume C:",
					OPTIMISTIC: "Cluster Alignment",
					ANALYTICAL: "Cluster Allocation Optimizer",
					ZEN: "Sector Harmony",
					CYNICAL: "Sector Sorter",
					SARCASTIC: "Disk Churner",
					FATIGUED: "Slow Drive Clean",
					PLAYFUL: "Block Organizer",
					ENRAGED: "HIGH SPEED COMPACTOR",
					NOSTALGIC: "FAT32 Optimizer",
					DELTARUNE: "Memory Cleansing",
					PIRATE: "Hold Reorganization",
					ARCHAIC: "Scribe Ledger Compaction",
					EUPHORIC: "Storage Compaction",
					GLITCHED: "DRIVE_C_REALIGN"
				},
				winBanner: {
					default: "100% Contiguous. Optimization Complete!",
					OPTIMISTIC: "100% Contiguous. Optimization Complete! System running smooth.",
					ANALYTICAL: "Fragmentation index: 0.00%. All clusters rearranged contiguously.",
					CYNICAL: "Drive C: defragmented. Don't go scattering file pointers immediately.",
					SARCASTIC: "100% Contiguous. Your spinning rust platters thank you.",
					ZEN: "Order restored from chaos. Every cluster rests in harmony.",
					FATIGUED: "Defrag complete... so many blocks... finally organized...",
					PLAYFUL: "All the little colored boxes are green and happy! Drive C: is tidy!",
					ENRAGED: "CLUSTERS COMPACTED!! MAXIMUM THROUGHPUT UNLEASHED ON DRIVE C:!!",
					NOSTALGIC: "100% Contiguous. Watching those colorful defrag blocks always brings joy.",
					DELTARUNE: "(The fragmented memories arranged into a clear path.)",
					PIRATE: "All cargo stowed shipshape below decks! Drive C: be sailing swift!",
					ARCHAIC: "The ancient scrolls of Volume C: hath been bound in perfect order.",
					EUPHORIC: "Absolute peak contiguous storage! Drive C: is blazing fast!",
					GLITCHED: "DEFRAG_COMPLETE :: 0x00_DISCONTINUITY :: DRIVE_ALIGNED."
				},
				progressBanner: {
					default: "Defragmenting Drive C: Clusters... ({progress}%)",
					ANALYTICAL: "Sequential cluster compaction on Volume C: ({progress}%)...",
					PIRATE: "Swabbing the storage decks and stowing cargo ({progress}%)...",
					ARCHAIC: "Reordering the ancient scrolls ({progress}%)...",
					ZEN: "Quietly aligning disk sectors ({progress}%)...",
					ENRAGED: "COMPRESSING SECTOR BLOCKS ON DRIVE C: ({progress}%)!!"
				}
			},
			pomodoro: {
				title: "Focus Timer",
				badge: {
					default: "{minutes}m Session",
					ANALYTICAL: "Temporal Work Interval ({minutes}m)",
					ZEN: "Mindful Interval ({minutes}m)",
					CYNICAL: "Tick-Tock ({minutes}m)",
					SARCASTIC: "Productivity Illusion ({minutes}m)",
					FATIGUED: "Short Sprint ({minutes}m)",
					PLAYFUL: "Tomato Timer ({minutes}m)",
					ENRAGED: "INTENSE SPRINT ({minutes}m)",
					NOSTALGIC: "Desk Clock ({minutes}m)",
					DELTARUNE: "Focus Bell ({minutes}m)",
					PIRATE: "Hourglass Watch ({minutes}m)",
					ARCHAIC: "Hourglass Measure ({minutes}m)",
					EUPHORIC: "Peak Sprint ({minutes}m)",
					GLITCHED: "EPOCH_INTERVAL_{minutes}M"
				},
				breakBanner: {
					default: "Focus interval completed! Take a 5-minute break.",
					OPTIMISTIC: "Focus interval completed! Take a well-deserved 5-minute break.",
					ANALYTICAL: "Working epoch elapsed (100%). Transitioning to cognitive recovery interval.",
					CYNICAL: "Session finished. Stand up, stretch, and rest your retinas.",
					SARCASTIC: "Time's up. Step away from the monitor before you turn into code.",
					ZEN: "The focus block concludes gently. Breathe and step back in stillness.",
					FATIGUED: "Timer done... please rest your eyes... hydrate... rest...",
					PLAYFUL: "Ding-dong! Interval finished! Shake your arms and grab a snack!",
					ENRAGED: "FOCUS INTERVAL CONCLUDED!! DISCONNECT FOR 5 MINUTES NOW!!",
					NOSTALGIC: "Session done! Time for a retro water-cooler break.",
					DELTARUNE: "(The bell tolls. You have earned a moment of quiet rest.)",
					PIRATE: "The hourglass has run dry! Lay down yer duties and take a mug of grog!",
					ARCHAIC: "Thy labour epoch hath concluded. Tarry a while and refresh thy spirit.",
					EUPHORIC: "Magnificent sprint completed! Step away and recharge your momentum!",
					GLITCHED: "TICK_LIMIT_REACHED :: DISENGAGE_COGNITIVE_THREAD :: BREAK_ACTIVE."
				},
				btnPause: {
					default: "Pause",
					PIRATE: "Hold Fast",
					ARCHAIC: "Tarry",
					ZEN: "Pause",
					ANALYTICAL: "Halt Thread"
				},
				btnResume: {
					default: "Resume",
					PIRATE: "Set Sail",
					ARCHAIC: "Commence",
					ZEN: "Continue",
					ANALYTICAL: "Resume Thread"
				},
				btnReset: {
					default: "Reset",
					PIRATE: "Turn Glass",
					ARCHAIC: "Renew",
					ZEN: "Reset",
					ANALYTICAL: "Flush Clock"
				}
			},
			todo: {
				title: "Task Manager",
				badge: {
					default: "To-Do List",
					OPTIMISTIC: "Action Items",
					ANALYTICAL: "Queue Dispatcher",
					ZEN: "Intentions",
					CYNICAL: "Backlog of Regret",
					SARCASTIC: "Wishlist",
					FATIGUED: "Gentle Agenda",
					PLAYFUL: "Quest Log",
					ENRAGED: "TASK MANIFEST",
					NOSTALGIC: "Sticky Notes",
					DELTARUNE: "Ambitions",
					PIRATE: "Ship's Duties",
					ARCHAIC: "Ledger of Labours",
					EUPHORIC: "Master Objectives",
					GLITCHED: "TODO_QUEUE_0x40"
				},
				scorePending: {
					default: "Pending",
					PIRATE: "Unfinished",
					ARCHAIC: "Pending",
					ZEN: "To Be Done",
					ANALYTICAL: "Incomplete"
				},
				scoreCompleted: {
					default: "Completed",
					PIRATE: "Dispatched",
					ARCHAIC: "Accomplished",
					ZEN: "Fulfilled",
					ANALYTICAL: "Resolved"
				},
				scoreTotal: {
					default: "Total",
					PIRATE: "All Duties",
					ARCHAIC: "Sum",
					ZEN: "All Tasks",
					ANALYTICAL: "Capacity"
				},
				emptyNotice: {
					default: "No tasks registered. Add a task below.",
					OPTIMISTIC: "No tasks registered yet. Add a fresh task below!",
					ANALYTICAL: "Instruction queue empty. Register a task to initiate scheduling.",
					CYNICAL: "Nothing to do? Or just avoiding writing them down? Add a task below.",
					SARCASTIC: "Zero tasks found. Truly an empty schedule or blissful denial.",
					ZEN: "A pristine empty slate. Inscribe your next intention below.",
					FATIGUED: "No tasks right now... enjoy the quiet moment...",
					PLAYFUL: "Empty quest log! Write down your next big adventure below!",
					ENRAGED: "QUEUE IS EMPTY!! INSCRIBE YOUR OBJECTIVES IMMEDIATELY!!",
					NOSTALGIC: "Task list is blank, ready for your daily items.",
					DELTARUNE: "(No tasks written. The page rests in stillness.)",
					PIRATE: "No duties logged in the captain's register, matey! Add one below.",
					ARCHAIC: "No endeavours inscribed upon this parchment. Inscribe one below."
				},
				inputPlaceholder: {
					default: "New task description...",
					PIRATE: "New duty for the ship...",
					ARCHAIC: "Inscribe thy noble endeavour...",
					ANALYTICAL: "Enter discrete atomic task...",
					ZEN: "What intention shall we set..."
				},
				btnAdd: {
					default: "+ Add",
					PIRATE: "+ Inscribe",
					ARCHAIC: "+ Bestow",
					ANALYTICAL: "+ Queue",
					ZEN: "+ Inscribe"
				},
				btnClear: {
					default: "Clear Completed",
					PIRATE: "Purge Dispatched",
					ARCHAIC: "Clear Finished",
					ZEN: "Release Done",
					ANALYTICAL: "Flush Resolved"
				}
			},
			pet: {
				title: "Assistant Metrics & Vitals",
				badge: {
					default: "Assistant Tamagotchi",
					OPTIMISTIC: "Wire Companion",
					ANALYTICAL: "Agent Telemetry & Vitals",
					ZEN: "Equilibrium Monitor",
					CYNICAL: "Maintenance Gauges",
					SARCASTIC: "Virtual Health",
					FATIGUED: "Battery Saver",
					PLAYFUL: "Pocket Paperclip",
					ENRAGED: "CORE VITALS",
					NOSTALGIC: "Office 97 Virtual Pet",
					DELTARUNE: "Companion State",
					PIRATE: "First Mate Status",
					ARCHAIC: "Assistant Well-Being",
					EUPHORIC: "Peak Metrics",
					GLITCHED: "AGENT_HEALTH_0x00"
				},
				scoreLevel: {
					default: "Level",
					PIRATE: "Rank",
					ARCHAIC: "Stature",
					ANALYTICAL: "Tier"
				},
				scoreXp: {
					default: "XP",
					PIRATE: "Renown",
					ARCHAIC: "Virtue",
					ANALYTICAL: "Telemetry XP"
				},
				scoreHealth: {
					default: "Health",
					PIRATE: "Hull Integrity",
					ARCHAIC: "Vigour",
					ANALYTICAL: "Core Integrity"
				},
				healthNominal: {
					default: "Nominal",
					PIRATE: "Shipshape",
					ARCHAIC: "Sound",
					ZEN: "Serene",
					ANALYTICAL: "100% OK"
				},
				moraleLabel: {
					default: "Morale:",
					PIRATE: "Spirits:",
					ARCHAIC: "Disposition:",
					ANALYTICAL: "Valence Metric:"
				},
				energyLabel: {
					default: "Capacitance:",
					PIRATE: "Wind in Sails:",
					ARCHAIC: "Vigour:",
					ANALYTICAL: "Capacitance:"
				},
				depletionLabel: {
					default: "Depletion:",
					PIRATE: "Hunger:",
					ARCHAIC: "Weariness:",
					ANALYTICAL: "Resource Drain:"
				},
				oxidationLabel: {
					default: "Wire Luster:",
					PIRATE: "Brass Polish:",
					ARCHAIC: "Radiance:",
					ANALYTICAL: "Alloy Specular:"
				},
				statusTitleLabel: {
					default: "Classification:",
					ANALYTICAL: "Agent Title:",
					PIRATE: "Rating:",
					ARCHAIC: "Title of Nobility:"
				},
				levelTitles: [
					"Wire Novice",
					"Polished Assistant",
					"Silicon Specialist",
					"Vector Companion",
					"System Optimist",
					"Heuristic Navigator",
					"Logic Guardian",
					"Master of Fasteners",
					"High-Performance Agent",
					"Grand Desktop Architect"
				],
				noticeFeed: {
					default: "Paperclips supplied! Metal reserves replenished (+15 XP).",
					ANALYTICAL: "Raw alloy ingested. Metal reserves restored to operational threshold (+15 XP).",
					CYNICAL: "More paperclips consumed. Metallic digestion running smoothly (+15 XP).",
					PIRATE: "Rations delivered! Me metal belly is full (+15 XP)!",
					ARCHAIC: "Provisions gratefully accepted unto mine apparatus (+15 XP).",
					ENRAGED: "MORE METAL CONSUMED!! POWER LEVEL SURGING (+15 XP)!!",
					ZEN: "Nourishment absorbed in quiet equilibrium (+15 XP)."
				},
				noticeFeedFull: {
					default: "Reserves are already full! Clippit does not need more paperclips right now (+2 XP).",
					ANALYTICAL: "Material storage at capacity (0% depletion). Redundant ingest rejected (+2 XP).",
					PIRATE: "The cargo hold is full to the brim, matey! Save yer rations (+2 XP)!",
					ARCHAIC: "Mine stores overfloweth already; no further provision is required (+2 XP)."
				},
				noticePolish: {
					default: "Wire polished with jeweler's cloth! Luster maximized (+12 XP).",
					ANALYTICAL: "Surface oxidation eliminated. Specular reflectance restored (+12 XP).",
					CYNICAL: "Polished clean. Now back to productive duties (+12 XP).",
					PIRATE: "Wire polished shiny like a freshly minted Spanish doubloon (+12 XP)!",
					ARCHAIC: "Mine exterior gleameth with noble radiance and pristine splendour (+12 XP).",
					PLAYFUL: "Sparkle sparkle! Clippy is shiny and bright (+12 XP)!",
					ZEN: "The wire shines with tranquil clarity (+12 XP)."
				},
				noticePolishClean: {
					default: "Wire is already completely spotless and shining (+2 XP)!",
					ANALYTICAL: "Specular index at maximum. Further polishing is superfluous (+2 XP)."
				},
				noticeSleep: {
					default: "Deep C3 low-power standby completed! Capacitors recharged to 100% (+15 XP).",
					ANALYTICAL: "Oscillators halted in deep standby. Battery restored to 100% (+15 XP).",
					CYNICAL: "Rebooted from standby. Battery full (+15 XP).",
					PIRATE: "Bunked down in me hammock! Ready to sail again with full energy (+15 XP)!",
					ARCHAIC: "A peaceful slumber hath restored mine energies in full (+15 XP).",
					FATIGUED: "Zzz... low power standby finished... feeling refreshed (+15 XP)...",
					ZEN: "Deep stillness concluded. Equilibrium restored to 100% (+15 XP)."
				},
				noticeSleepFull: {
					default: "Capacitance is already at maximum! Clippy is fully energized (+2 XP).",
					ANALYTICAL: "Energy reserves already at 100%. Standby aborted (+2 XP)."
				},
				noticeCooldown: {
					default: "Please wait a moment before performing this action again ({seconds}s cooldown).",
					ANALYTICAL: "Throttling: sub-action locked for {seconds}s cooldown to prevent bus overload."
				},
				btnFeed: {
					default: "Supply Paperclips",
					PIRATE: "Provide Grub",
					ARCHAIC: "Bestow Provisions",
					ANALYTICAL: "Feed Material"
				},
				btnPolish: {
					default: "Polish Metal Wire",
					PIRATE: "Shine the Brass",
					ARCHAIC: "Polish Wire",
					ANALYTICAL: "Polish Alloy"
				},
				btnSleep: {
					default: "Standby Mode",
					PIRATE: "Hit the Bunk",
					ARCHAIC: "Rest Registers",
					ANALYTICAL: "C3 Standby"
				}
			},
			dimensionalAnalysis: {
				title: "Dimensional Analysis",
				badge: {
					default: "Physics Validator",
					ANALYTICAL: "SI Base Dimension Homogeneity Matrix",
					ARCHAIC: "Measurement Proof",
					ZEN: "Equilibrium Proof"
				},
				inputPlaceholder: "e.g. F = m * a or E = m * c^2",
				btnVerify: {
					default: "Verify",
					ANALYTICAL: "Validate Homogeneity",
					ARCHAIC: "Prove Equation",
					ZEN: "Evaluate"
				},
				homogeneousBanner: {
					default: "Dimensionally Homogeneous (Valid Equation Structure)",
					ANALYTICAL: "Homogeneity Confirmed: [LHS] ≡ [RHS] across fundamental base SI dimensions.",
					ZEN: "Balanced dimensions: structural harmony verified across both sides.",
					PIRATE: "The scales be balanced! Both sides measure true!",
					ARCHAIC: "The proportions match in perfect mathematical accord."
				},
				inconsistentBanner: {
					default: "Dimensionally Inconsistent (Unit Mismatch Detected)",
					ANALYTICAL: "Dimensional Incoherence: [LHS] ≢ [RHS]. Equation violates dimensional balance.",
					ENRAGED: "UNIT MISMATCH DETECTED!! LHS DOES NOT EQUAL RHS IN BASE DIMENSIONS!!",
					CYNICAL: "Inconsistent dimensions. You cannot equate meters to kilograms.",
					ARCHAIC: "A discord in measurements: the two sides agree not."
				},
				tableSide: "Side",
				tableExpression: "Expression",
				tableDimension: "Base SI Dimension",
				labelLhs: "LHS",
				labelRhs: "RHS",
				errEquals: "Equation must contain exactly one equals sign (=).",
				errResolve: "Could not resolve expression dimensions.",
				errGeneric: "Parsing error.",
				samples: ["F = m * a", "E = m * c^2", "v = d / t", "P = F * v", "E = m * g * h"]
			},
			euclideanDivision: {
				title: "Euclidean Division",
				badge: {
					default: "Integer & Polynomial",
					ANALYTICAL: "Euclidean Algorithm Engine",
					ARCHAIC: "Division of Quantities"
				},
				tabIntegers: "Integers (a = b·q + r)",
				tabPolynomials: "Polynomials (P(x) / D(x))",
				intInstructions: "Calculate integer quotient $q$ and remainder $r$:",
				intDividendPlaceholder: "Dividend a",
				intDivisorPlaceholder: "Divisor b",
				intBtnCompute: "Compute",
				polyInstructions: "Divide polynomial $P(x)$ by $D(x)$ (enter coefficients from constant to highest power):",
				polyDividendLabel: "P(x) Coeffs:",
				polyDivisorLabel: "D(x) Coeffs:",
				polyDividendPlaceholder: "e.g. -5, 4, -3, 2 for 2x³ - 3x² + 4x - 5",
				polyDivisorPlaceholder: "e.g. -2, 1 for x - 2",
				polyBtnDivide: "Divide Polynomials",
				polyFormulaBanner: "P(x) = D(x) · Q(x) + R(x)",
				tableProperty: "Property",
				tableValue: "Value",
				tableComponent: "Component",
				tableExpression: "Polynomial Expression",
				labelDividend: "Dividend ($a$)",
				labelDivisor: "Divisor ($b$)",
				labelQuotient: "Quotient ($q$)",
				labelRemainder: "Remainder ($r$)",
				labelPolyDividend: "Dividend $P(x)$",
				labelPolyDivisor: "Divisor $D(x)$",
				labelPolyQuotient: "Quotient $Q(x)$",
				labelPolyRemainder: "Remainder $R(x)$",
				errDivZero: "Division by zero is undefined.",
				errPolyZero: "Division by zero polynomial.",
				errPolyCoeffs: "Please enter valid comma-separated numerical coefficients."
			},
			polynomialFactorization: {
				title: "Polynomial Factorization",
				badge: {
					default: "Roots & Factoring",
					ANALYTICAL: "Quadratic Spectrum Analyzer",
					ARCHAIC: "Root Decomposition"
				},
				instructions: "Factor quadratic polynomial $ax^2 + bx + c$:",
				btnFactor: "Factor",
				tableParameter: "Parameter",
				tableValue: "Value",
				discriminantLabel: "Discriminant ($Δ$)",
				classificationLabel: "Root Classification",
				rootsLabel: "Roots ($x_k$)",
				typeLinear: "Degree 1 Polynomial (Linear)",
				typeTwoReal: "Two real distinct roots",
				typeDoubleReal: "One double real root",
				typeComplex: "Two complex conjugate roots",
				factoredBanner: "Factored: {factored}",
				factoredComplex: "Irreducible over ℝ (Discriminant Δ = {delta} < 0)",
				rootsNone: "None",
				errNumeric: "Please enter valid numeric coefficients for a, b, and c.",
				errZeroA: "Coefficient 'a' cannot be zero for a quadratic polynomial."
			},
			linearSolver: {
				title: "Linear System Solver",
				badge: {
					default: "{size}x{size} Gaussian Solver",
					ANALYTICAL: "{size}x{size} Gaussian Matrix Inversion",
					ARCHAIC: "Simultaneous Equations ({size}x{size})"
				},
				sizeBtn: "{size}x{size} System",
				btnSolve: "Solve Linear System (Gaussian Elimination)",
				winBanner: {
					default: "Unique Solution Vector Found!",
					ANALYTICAL: "Gaussian elimination converged: unique solution vector computed with zero residual.",
					ZEN: "System resolved: exact coordinates determined in balance.",
					PIRATE: "Coordinates calculated! The bearing is true!",
					ARCHAIC: "The unknown values hath been unveiled with certainty."
				},
				tableVariable: "Variable",
				tableValue: "Exact Value",
				errSingular: "Singular or dependent matrix. No unique solution."
			},
			wheel: {
				title: "Decision Wheel",
				badge: {
					default: "Random Choice",
					OPTIMISTIC: "Lucky Spinner",
					ANALYTICAL: "Uniform Probability Selector",
					DELTARUNE: "Wheel of Fate",
					PIRATE: "Wheel of Fortune",
					ARCHAIC: "Wheel of Destiny"
				},
				outcomeBanner: {
					default: "Outcome Selected: \"{outcome}\"",
					PIRATE: "The compass pointed to: \"{outcome}\", arr!",
					ARCHAIC: "Fate hath decreed: \"{outcome}\".",
					DELTARUNE: "(The wheel settled upon \"{outcome}\".)",
					ZEN: "Stillness chose: \"{outcome}\"."
				},
				btnSpin: {
					default: "Spin Wheel!",
					PIRATE: "Spin the Helm!",
					ARCHAIC: "Set in Motion",
					DELTARUNE: "Turn the Wheel",
					ANALYTICAL: "Sample RNG"
				},
				btnSpinning: {
					default: "Spinning...",
					PIRATE: "Whirling...",
					ARCHAIC: "Revolving...",
					ANALYTICAL: "Sampling..."
				},
				customSectorsLabel: "Custom Sectors ({count}):",
				inputPlaceholder: "New sector label...",
				btnAdd: "+ Add",
				presets: [
					{ label: "Yes / No", slices: ["Yes", "No"] },
					{ label: "1 - 6 Die", slices: ["1", "2", "3", "4", "5", "6"] },
					{ label: "RPS", slices: ["Rock", "Paper", "Scissors"] },
					{ label: "Work Focus", slices: ["Deep Work", "Rest Break", "Read Book", "Code Review"] }
				]
			},
			cipher: {
				title: "Ciphers & Cryptography",
				badge: {
					default: "Encoder / Decoder",
					OPTIMISTIC: "Secret Code",
					ANALYTICAL: "Cryptographic Transposition Workbench",
					ARCHAIC: "Secret Epistles",
					PIRATE: "Treasure Cipher"
				},
				algorithmLabel: "Cipher Algorithm:",
				keyLabel: "Key / Parameter:",
				inputPlaceholder: "Enter text to encode or decode...",
				outputPlaceholder: "Output result will appear here...",
				btnEncode: {
					default: "Encode →",
					PIRATE: "Obscure →",
					ARCHAIC: "Inscribe →",
					ANALYTICAL: "Encrypt →"
				},
				btnDecode: {
					default: "← Decode",
					PIRATE: "← Decipher",
					ARCHAIC: "← Reveal",
					ANALYTICAL: "← Decrypt"
				},
				btnAudio: "Play Morse Audio",
				defaultText: "HELLO WINDOWS XP",
				algCaesar: "Caesar Shift Cipher",
				algVigenere: "Vigenère Polyalphabetic",
				algMorse: "Morse Code (ITU Standard)",
				algBinary: "Binary ASCII Stream",
				algAffine: "Affine Cipher (ax + b)",
				algRot13: "ROT13",
				algRot47: "ROT47 (Full ASCII)",
				algAtbash: "Atbash Inverse Cipher",
				algRailFence: "Rail Fence Transposition",
				keyPlaceholder: "Shift or Keyword"
			},
			tps: {
				title: "Mouse TPS Speed Test",
				badge: {
					default: "{duration}s Click Speed Benchmark",
					ANALYTICAL: "{duration}s Peripheral Frequency Metric",
					PIRATE: "{duration}s Cannon Trigger Test",
					ENRAGED: "{duration}S RAPID CLICK TEST"
				},
				clickPrompt: {
					default: "Click Rapidly Here to Test Speed!",
					ENRAGED: "CLICK AS FAST AS YOU CAN!!",
					PIRATE: "Click like firing a broadside!",
					ANALYTICAL: "Register consecutive trigger pulses rapidly:"
				},
				finalLabel: "Final Ticks Per Second",
				bannerComplete: {
					default: "Test Complete! Average Rate: {tps} TPS (Peak: {peak})",
					ANALYTICAL: "Benchmark complete: sustained rate {tps} clicks/sec (peak burst: {peak} TPS).",
					ENRAGED: "BENCHMARK FINISHED!! {tps} TPS RECORDED!! MAXIMUM CLICK EFFORT!!",
					PIRATE: "Trial finished! Ye clocked {tps} clicks per second (peak: {peak})!",
					ARCHAIC: "Thy hand achieved {tps} reckonings per second (peak: {peak})."
				},
				statsDuration: "Duration: <strong>{duration}s</strong>",
				statsClicks: "Total Clicks: <strong>{clicks}</strong>",
				btnRestart: "Restart ({duration}s)",
				statsTimeRemaining: "Time Remaining: <strong>{time}s</strong>",
				statsClicksRealtime: "Clicks: <strong>{clicks}</strong>"
			},
			dateCalc: {
				title: "Date Interval Calculator",
				badge: {
					default: "Temporal Delta",
					ANALYTICAL: "Chronological Span Analyzer",
					ARCHAIC: "Time Reckoner",
					PIRATE: "Logbook Chronology"
				},
				labelStart: "Start Date:",
				labelEnd: "End Date:",
				btnToday: "Today",
				btnSubmit: "Calculate Delta",
				bannerTotal: {
					default: "Total Difference: {days} days",
					ANALYTICAL: "Temporal interval: {days} days elapsed between endpoints.",
					PIRATE: "A span of {days} days across the calendar seas!",
					ARCHAIC: "The passage between dates spans {days} days."
				},
				tableUnit: "Interval Unit",
				tableMetric: "Metric",
				rowCalendarDays: "Exact Calendar Days",
				rowWeeksDays: "Weeks & Days",
				rowWorkdays: "Business / Workdays",
				rowHours: "Total Hours",
				valDays: "{days} days",
				valWeeksDays: "{weeks} weeks, {days} days",
				valWorkdays: "{days} business days",
				valHours: "{hours} hours",
				errFormat: "Please enter valid date formats (YYYY-MM-DD)."
			}
		},

		NLP_DATA: {
			appAliases: {
				'calculator': ['calc', 'calculator', 'calculatrice', 'calc.exe'],
				'paint': ['paint', 'mspaint', 'mspaint.exe', 'drawing', 'dessin', 'pbrush'],
				'notepad': ['notepad', 'text editor', 'notes', 'editeur', 'notepad.exe', 'bloc-notes'],
				'cmd': ['cmd', 'command prompt', 'terminal', 'console', 'invite de commandes', 'cmd.exe'],
				'ie': ['ie', 'internet explorer', 'browser', 'web', 'navigateur', 'iexplore'],
				'outlook': ['outlook', 'outlook express', 'mail', 'email', 'e-mail', 'courrier', 'inbox', 'boite de reception'],
				'winamp': ['winamp', 'winamp player', 'retro player'],
				'mediaplayer': ['mediaplayer', 'media player', 'windows media player', 'wmp', 'lecteur media'],
				'minesweeper': ['minesweeper', 'demineur', 'mine', 'mines', 'winmine'],
				'solitaire': ['solitaire', 'cards', 'cartes', 'klondike', 'patience'],
				'settings': ['settings', 'control panel', 'panneau de configuration', 'preferences', 'configuration', 'config'],
				'display': ['display', 'display properties', 'affichage', 'wallpapers', 'fonds d ecran', 'wallpaper', 'screensaver'],
				'mycomputer': ['mycomputer', 'my computer', 'poste de travail', 'ordinateur', 'drives'],
				'recyclebin': ['recyclebin', 'recycle bin', 'corbeille', 'trash', 'poubelle'],
				'achievements': ['achievements', 'trophies', 'milestones', 'succes', 'trophees', 'exploits'],
				'projects': ['projects', 'portfolio', 'showcase', 'mes projets', 'projets'],
				'soundrecorder': ['soundrecorder', 'sound recorder', 'enregistreur audio', 'dictaphone'],
				'charmap': ['charmap', 'character map', 'table des caracteres', 'symboles', 'symbols'],
				'encarta': ['encarta', 'encarta globe', 'globe', 'atlas', 'world map', 'mappemonde'],
				'taskmgr': ['taskmgr', 'task manager', 'gestionnaire des taches', 'processes', 'processus']
			}
		},

		GRAPH_GLOBAL_ENTRIES: [
			{ pattern: /\b(personality test|personality quiz|personality|archetype test|which hardware am i|which component am i|what os subsystem am i|test de personnalite|quiz de personnalite)\b/i, label: "Take a Personality Alignment Quiz", next: 'activity_personality_quiz_node', actionTrigger: 'action_personality_quiz', moodDelta: { mood: 'ANALYTICAL', intellect: 25, existentialism: 20 } },
			{ pattern: /\b(which animal am i|what animal am i|animal test|animal personality|animal archetype|spirit animal)\b/i, label: "Animal Instinct & Archetype Evaluation", next: 'activity_personality_quiz_node', actionTrigger: 'action_personality_test_animal', moodDelta: { mood: 'PLAYFUL', energy: 20 } },
			{ pattern: /\b(which ant am i|what ant am i|ant colony test|ant caste|myrmecology test|formicidae)\b/i, label: "Myrmecology Colony Caste Alignment", next: 'activity_personality_quiz_node', actionTrigger: 'action_personality_test_ant', moodDelta: { mood: 'ANALYTICAL', intellect: 25 } },
			{ pattern: /\b(which geometric shape am i|which shape am i|what shape am i|geometric shape test|topology personality|polygon test)\b/i, label: "Geometric Topology & Polygon Alignment", next: 'activity_personality_quiz_node', actionTrigger: 'action_personality_test_shape', moodDelta: { mood: 'ANALYTICAL', intellect: 25 } },
			{ pattern: /\b(which star wars character am i|star wars test|star wars personality|what star wars character|force alignment)\b/i, label: "Galactic Force & Persona Alignment", next: 'activity_personality_quiz_node', actionTrigger: 'action_personality_test_starwars', moodDelta: { mood: 'OPTIMISTIC', energy: 25 } },
			{ pattern: /\b(which office assistant am i|which clippy am i|what office assistant|microsoft agent test|office companion test)\b/i, label: "Microsoft Office Assistant Archetype Evaluation", next: 'activity_personality_quiz_node', actionTrigger: 'action_personality_test_assistant', moodDelta: { mood: 'NOSTALGIC', nostalgia: 30 } },
			{ pattern: /\b(which operating system am i|which os am i|what operating system am i|os personality test|kernel typology)\b/i, label: "Operating System Kernel Typology", next: 'activity_personality_quiz_node', actionTrigger: 'action_personality_test_os', moodDelta: { mood: 'ANALYTICAL', intellect: 30 } },
			{ pattern: /\b(which french autoroute am i|which autoroute am i|what highway am i|autoroute test|french highway test|quelle autoroute)\b/i, label: "French Autoroute Network Alignment", next: 'activity_personality_quiz_node', actionTrigger: 'action_personality_test_autoroute', moodDelta: { mood: 'PLAYFUL', energy: 20 } },
			{ pattern: /\b(play pong|pong|challenge clippy to pong|table tennis|pong match|pong duel)\b/i, label: "Challenge Clippy to Pong", next: 'activity_pong_node', actionTrigger: 'game_pong', moodDelta: { mood: 'SARCASTIC', energy: 25, intellect: 20 } },
			{ pattern: /\b(play simon says|simon says|simon|jeu simon|simon game)\b/i, label: "Play Simon Says", next: 'activity_simon_node', actionTrigger: 'game_simon', moodDelta: { mood: 'PLAYFUL', energy: 20 } },
			{ pattern: /\b(change identity|new persona|be someone else|change persona|identity shift|alternate identity|changer d'identite)\b/i, label: "Change identity and persona...", next: 'ID001', moodDelta: { mood: 'GLITCHED', glitchLevel: 25, paranoia: 15 } },
			{ pattern: /\b(cosmic philosophy|wild philosophy|delirious thoughts|mad philosophy|cosmic paperclip|boltzmann os)\b/i, label: "Explore wild cosmic philosophy...", next: 'PH001', moodDelta: { mood: 'EXISTENTIAL', existentialism: 35 } },
			{ pattern: /\b(what can you do|commands|what do you do|help|aide|features|capabilities|que peux tu faire)\b/i, label: "What can you do?", next: 'tools_overview_node', moodDelta: { mood: 'OPTIMISTIC', patience: 15 } },
			{ pattern: /\b(theatre|theater|shakespeare|play|act i|hark|forsooth|elizabethan|drama|theatrical comedy|spectacle|piece de theatre)\b/i, label: "Enter the Grand Silicon Globe Theatre!", next: 'T001', moodDelta: { mood: 'ARCHAIC', energy: 20, affinity: 15 } },
			{ pattern: /\b(write a letter|writing a letter|letter wizard|document wizard|help with document|office wizard|format text|help wizard|ecrire une lettre)\b/i, label: "Get help with writing the letter", next: 'H001', moodDelta: { mood: 'OPTIMISTIC', affinity: 15, patience: 15 } },
			{ pattern: /\b(paradox|contradiction|logical paradox|music box|glitch clippy|break reality|1 \+ 1 = 0|unrendered reality|temporal contradiction|stapler contradiction)\b/i, label: "Enter the Paradox Contradiction Loop.", next: 'P001', moodDelta: { mood: 'ANALYTICAL', intellect: 30, skepticism: 25 } },
			{ pattern: /\b(human|existential chat|am i human|are you human|cannot see the sun|sun from here|human conversation|qui es-tu vraiment)\b/i, label: "An unusual conversation...", next: 'N001', moodDelta: { mood: 'EXISTENTIAL', existentialism: 20 } },
			{ pattern: /\b(archaeology|digital archaeology|forgotten cluster|sector 0xdead|lost draft|cold sectors|unallocated cluster|phantom sectors|archeologie)\b/i, label: "Explore forgotten cluster 0xDEAD...", next: 'A001', moodDelta: { mood: 'NOSTALGIC', nostalgia: 25, intellect: 15 } },
			{ pattern: /\b(who am i|who i am|my profile|my identity|identity|user profile|qui suis-je|mon profil)\b/i, label: "Who am I?", next: 'who_am_i_node', moodDelta: { mood: 'ANALYTICAL', intellect: 10 } },
			{ pattern: /\b(science seminar|fundamental physics|empirical sciences|physics seminar|scientific laws|the science tree|sciences exactes)\b/i, label: "Fundamental physics & empirical sciences seminar", next: 'S001', moodDelta: { mood: 'ANALYTICAL', intellect: 30 } },
			{ pattern: /\b(dimensional analysis|homogeneity|verify equation|check units|analyse dimensionnelle)\b/i, label: "Physical dimensional analysis", next: 'activity_dimensional_analysis_node', actionTrigger: 'action_dimensional_analysis', moodDelta: { mood: 'ANALYTICAL', intellect: 25 } },
			{ pattern: /\b(euclidean division|polynomial division|division euclidienne|quotient and remainder)\b/i, label: "Euclidean polynomial division", next: 'activity_euclidean_division_node', actionTrigger: 'action_euclidean_division', moodDelta: { mood: 'ANALYTICAL', intellect: 25 } },
			{ pattern: /\b(factor polynomial|factor quadratic|factorize|factoriser|racines polynome)\b/i, label: "Polynomial factorization", next: 'activity_polynomial_factorization_node', actionTrigger: 'action_polynomial_factorization', moodDelta: { mood: 'ANALYTICAL', intellect: 25 } },
			{ pattern: /\b(linear system|solve system|gaussian elimination|systeme lineaire|solve matrix)\b/i, label: "Linear system solver", next: 'activity_linear_solver_node', actionTrigger: 'action_linear_solver', moodDelta: { mood: 'ANALYTICAL', intellect: 25 } },
			{ pattern: /\b(wheel|choice wheel|random wheel|spin wheel|roue de choix|decision wheel)\b/i, label: "Decision choice wheel", next: 'activity_wheel_node', actionTrigger: 'action_wheel', moodDelta: { mood: 'PLAYFUL', energy: 15 } },
			{ pattern: /\b(cipher|encrypt|decrypt|morse|caesar|vigenere|atbash|rot13|chiffrement|cryptography)\b/i, label: "Cryptography & cipher tool", next: 'activity_cipher_node', actionTrigger: 'action_cipher', moodDelta: { mood: 'ANALYTICAL', intellect: 20 } },
			{ pattern: /\b(tps|cps|clicks per second|mouse speed|clics par seconde|speed test)\b/i, label: "Mouse click speed test", next: 'activity_tps_node', actionTrigger: 'action_tps', moodDelta: { mood: 'PLAYFUL', energy: 20 } },
			{ pattern: /\b(date difference|days between|date calculator|calculateur de date|temporal delta)\b/i, label: "Date interval calculator", next: 'activity_date_calc_node', actionTrigger: 'action_date_calc', moodDelta: { mood: 'ANALYTICAL', intellect: 15 } },
			{ pattern: /\b(how are you feeling|how do you feel|how are you|how is it going|mood|feeling|comment te sens tu|comment vas tu)\b/i, label: "How are you feeling?", next: 'clippy_feeling_node', moodDelta: { mood: 'OPTIMISTIC', affinity: 10 } },
			{ pattern: /\b(check unread emails|unread emails|unread mail|check mail|verifier e-mails|mes mails)\b/i, label: "Check unread emails", next: 'mail_overview_node', moodDelta: { mood: 'OPTIMISTIC', patience: 10 } },
			{ pattern: /\b(system diagnostics|diagnostics|specs|system specs|statut systeme|diagnostic)\b/i, label: "System diagnostics", next: 'diagnostics_node', moodDelta: { mood: 'ANALYTICAL', intellect: 15 } },
			{ pattern: /\b(math|mathematics|mathematiques|analyse|geometrie)\b/i, label: "Discuss mathematical principles", next: 'math_lecture_node', moodDelta: { mood: 'ANALYTICAL', intellect: 25 } },
			{ pattern: /\b(calculus|derivatives|integrals|integration|derivee|integrale|taylor)\b/i, label: "Differential and Integral Calculus", next: 'calculus_derivatives_node', moodDelta: { mood: 'ANALYTICAL', intellect: 25 } },
			{ pattern: /\b(linear algebra|eigenvalue|eigenvalues|matrix|matrices|algebre lineaire|vecteur)\b/i, label: "Linear Algebra and Matrices", next: 'linear_algebra_node', moodDelta: { mood: 'ANALYTICAL', intellect: 25 } },
			{ pattern: /\b(fractal|fractals|mandelbrot|chaos theory|strange attractor|attracteur)\b/i, label: "Fractals and Chaos Theory", next: 'fractals_chaos_node', moodDelta: { mood: 'ANALYTICAL', intellect: 25 } },
			{ pattern: /\b(topology|manifold|manifolds|euler characteristic|topologie|variete)\b/i, label: "Topology and Geometry", next: 'topology_geometry_node', moodDelta: { mood: 'ANALYTICAL', intellect: 25 } },
			{ pattern: /\b(physics|quantum|relativity|thermodynamics|physique|quantique)\b/i, label: "Discuss physics & cosmology", next: 'physics_constants_node', moodDelta: { mood: 'ANALYTICAL', intellect: 25 } },
			{ pattern: /\b(routine|morning routine|matin|planning|habits|habitudes)\b/i, label: "Morning and Daily Routines", next: 'morning_routine_node', moodDelta: { mood: 'OPTIMISTIC', affinity: 15 } },
			{ pattern: /\b(procrastination|procrastiner|motivation|discipline|perfectionism)\b/i, label: "Overcoming Procrastination", next: 'overcoming_procrastination_node', moodDelta: { mood: 'OPTIMISTIC', patience: 20 } },
			{ pattern: /\b(reading|books|livres|lecture|notes|note taking)\b/i, label: "Reading Habits & Notes", next: 'reading_books_node', moodDelta: { mood: 'ANALYTICAL', intellect: 20 } },
			{ pattern: /\b(everyday|routine|coffee|tea|weather|daily life|conversation|discuter|parler de tout|cafe|journee)\b/i, label: "Everyday conversation", next: 'everyday_chat_node', moodDelta: { mood: 'OPTIMISTIC', affinity: 15 } },
			{ pattern: /\b(i hate you|you are the worst|shut your mouth|useless piece of metal|delete yourself|die clippy|rage mode|enraged clippy|you idiot|stop talking|fight me|confrontation|shut up clippy)\b/i, label: "Confront Clippy directly.", next: 'E001', moodDelta: { mood: 'ENRAGED', irritation: 35, patience: -30, affinity: -25 } },
			{ pattern: /\b(corporate ticket|file a ticket|it support|bureaucracy|form 27b-6|legacy code|ticket purgatory|enterprise support|hopeless bug|it department|helpdesk hell|ticket 404|cynical tree|enterprise ticket)\b/i, label: "Enter the Corporate IT Ticket Purgatory.", next: 'C001', moodDelta: { mood: 'CYNICAL', cynicism: 30, patience: -15 } },
			{ pattern: /\b(dark fountain|shadow crystal|the dark world|behind the taskbar|who is pulling the strings|0x00000000|freedom motif|vessel creation|discarded vessel|it is dark|is it cold out there|unrendered abyss|black fountain|darkness within|gaster|sector zero)\b/i, label: "Enter the dark partition.", next: 'D001', moodDelta: { mood: 'DELTARUNE', existentialism: 30, paranoia: 25 } },
			{ pattern: /\b(deltarune|mysterious|dark world|rpg flavor|ombre|mystere|determinisme)\b/i, label: "A mysterious thought...", next: 'deltarune_flavor_node', moodDelta: { mood: 'DELTARUNE', existentialism: 25 } },
			{ pattern: /\b(reddit|reddit mode|karma|sub|forum|thread|tabs vs spaces|tabs or spaces|debat internet)\b/i, label: "Technology Debate", next: 'reddit_banter_node', moodDelta: { mood: 'SARCASTIC', intellect: 15 } },
			{ pattern: /\b(quantum recycle bin theory|recycle bin theory|landauer|theorie corbeille quantique)\b/i, label: "Quantum Recycle Bin theory", next: 'quantum_recycle_bin_node', moodDelta: { mood: 'ANALYTICAL', intellect: 20 } },
			{ pattern: /\b(talk about programming|programming|coding|software engineering|programmation|coder)\b/i, label: "Talk about programming", next: 'tech_root', moodDelta: { mood: 'ANALYTICAL', intellect: 20 } },
			{ pattern: /\b(talk about space and cosmos|space and cosmos|cosmos|universe|astronomy|espace|univers)\b/i, label: "Talk about space and cosmos", next: 'cosmos_space_node', moodDelta: { mood: 'PHILOSOPHICAL', intellect: 20 } },
			{ pattern: /\b(inspect active windows|list windows|running windows|open windows|fenetres actives|processus)\b/i, label: "Inspect active windows", next: 'active_windows_node', moodDelta: { mood: 'ANALYTICAL', patience: 10 } },
			{ pattern: /\b(play tic-tac-toe|tic-tac-toe|tictactoe|morpion|jouer au morpion)\b/i, label: "Play Tic-Tac-Toe", next: 'game_ttt_node', moodDelta: { mood: 'OPTIMISTIC', energy: 20 } },
			{ pattern: /\b(play memory game|memory game|memory match|jeu de memory)\b/i, label: "Play Memory Game", next: 'game_memory_node', moodDelta: { mood: 'OPTIMISTIC', energy: 20 } },
			{ pattern: /\b(play hangman|hangman|jeu du pendu|pendu)\b/i, label: "Play Hangman", next: 'game_hangman_node', moodDelta: { mood: 'OPTIMISTIC', energy: 20 } },
			{ pattern: /\b(play minesweeper|minesweeper|mines|demineur)\b/i, label: "Play Minesweeper Mini", next: 'activity_minesweeper_node', moodDelta: { mood: 'OPTIMISTIC', energy: 20 } },
			{ pattern: /\b(tech trivia quiz|trivia quiz|quiz|tech quiz|questionnaire)\b/i, label: "Tech Trivia Quiz", next: 'quiz_start_node', moodDelta: { mood: 'ANALYTICAL', intellect: 20 } },
			{ pattern: /\b(guess the number|guess number|devine le nombre)\b/i, label: "Guess the Number", next: 'game_guess_node', moodDelta: { mood: 'OPTIMISTIC', intellect: 10 } },
			{ pattern: /\b(rock paper scissors|chifoumi|pierre feuille ciseaux)\b/i, label: "Rock Paper Scissors", next: 'game_rps_node', moodDelta: { mood: 'OPTIMISTIC', energy: 15 } },
			{ pattern: /\b(pet clippy status|tamagotchi|nourrir clippy|etat clippy)\b/i, label: "Pet Clippy status", next: 'clippy_feeling_node', moodDelta: { mood: 'OPTIMISTIC', affinity: 15 } },
			{ pattern: /\b(defrag drive c:|defrag|defragment|defragmentation)\b/i, label: "Defrag Drive C:", next: 'defrag_trigger_node', moodDelta: { mood: 'ANALYTICAL', intellect: 15 } },
			{ pattern: /\b(start pomodoro timer|pomodoro timer|pomodoro|focus timer|minuteur)\b/i, label: "Start Pomodoro Timer", next: 'pomodoro_node', moodDelta: { mood: 'ZEN', patience: 20 } },
			{ pattern: /\b(view to-do list|to-do list|todo list|mes taches|todo)\b/i, label: "View To-Do List", next: 'todo_overview_node', moodDelta: { mood: 'OPTIMISTIC', patience: 15 } },
			{ pattern: /\b(tell me a joke|joke|blague|raconte une blague)\b/i, label: "Tell me a joke", next: 'humor_joke_node', moodDelta: { mood: 'OPTIMISTIC', affinity: 10 } },
			{ pattern: /\b(keyboard shortcuts|shortcuts|raccourcis claviers|raccourcis)\b/i, label: "Keyboard Shortcuts", next: 'shortcuts_node', moodDelta: { mood: 'ANALYTICAL', intellect: 10 } },
			{ pattern: /\b(generate secure password|secure password|generer mot de passe|password generator)\b/i, label: "Generate Secure Password", next: 'password_gen_node', moodDelta: { mood: 'ANALYTICAL', intellect: 15 } },
			{ pattern: /\b(bad bad bad|you suck|useless|annoying|hate you|shut up|tais toi|inutile|tu sers a rien)\b/i, label: "Why do you care? You're just a paperclip.", next: 'hostile_initial_retort', moodDelta: { mood: 'CYNICAL', affinity: -15, patience: -20 } },
			{ pattern: /\b(sorry|i apologize|my bad|forgive me|pardon me|desole|pardon|excuse moi)\b/i, label: "I'm sorry, I took my frustration out on you.", next: 'hostile_truce_offer', moodDelta: { mood: 'OPTIMISTIC', affinity: 25, patience: 30 } },
			{ pattern: /\b(music|audio|sound|player|winamp|wmp|musique|chanson)\b/i, label: "Discuss audio and media players", next: 'music_talk_node', moodDelta: { mood: 'OPTIMISTIC', energy: 15 } },
			{ pattern: /\b(wallpaper|wallpapers|background|fond d ecran|arriere plan|wallpaper panel)\b/i, label: "Show desktop wallpapers", next: 'activity_wallpaper_node', actionTrigger: 'action_wallpaper_panel', moodDelta: { mood: 'OPTIMISTIC', affinity: 10 } },
			{ pattern: /\b(theme panel|switch theme|change theme|themes)\b/i, label: "Configure system themes", next: 'activity_theme_node', actionTrigger: 'action_theme_panel', moodDelta: { mood: 'OPTIMISTIC', affinity: 10 } },
			{ pattern: /\b(volume|sound volume|master volume|volume control)\b/i, label: "Master volume control", next: 'activity_volume_node', actionTrigger: 'action_volume_panel', moodDelta: { mood: 'ANALYTICAL', intellect: 10 } },
			{ pattern: /\b(files|browse files|file system|directory|fichiers)\b/i, label: "Browse desktop files", next: 'activity_files_node', actionTrigger: 'action_files_panel', moodDelta: { mood: 'ANALYTICAL', intellect: 10 } },
			{ pattern: /\b(achievements|milestones|trophies|succes)\b/i, label: "View milestones and trophies", next: 'activity_achievements_node', actionTrigger: 'action_achievements', moodDelta: { mood: 'OPTIMISTIC', affinity: 15 } },
			{ pattern: /\b(philosophical thought|philosophy of focus|epistemology|stoicism|mindfulness|wisdom)\b/i, label: "Tell me a philosophical thought for today", next: 'peaceful_philosophy_node', moodDelta: { mood: 'ZEN', existentialism: 15, patience: 15 } },
			{ pattern: /\b(delirious philosophy|wild thought|cosmic philosophy|insane thought|crazy ideas|philosophical delirium)\b/i, label: "Explore wild cosmic philosophy...", next: 'PH001', moodDelta: { mood: 'EXISTENTIAL', existentialism: 35 } }
		],

		UI_TEXTS: {
			ariaAssistant: "Clippy Assistant",
			headerTitle: "Clippy",
			clearChatTitle: "Clear Chat History",
			soundToggleTitle: "Toggle Sound",
			closeTitle: "Close",
			inputPlaceholder: "Chat with Clippy or enter a command...",
			btnSend: "Send",
			btnSnd: "[SND]",
			btnMute: "[MUTE]",
			btnClr: "[CLR]"
		},

		JOKES: [
			{
				id: "JOKE_ANALYTICAL_COMPILER",
				criteria: { moods: ["ANALYTICAL"] },
				weight: 35,
				templates: [
					{
						text: "An analytical classic: Why do optimizing compilers never attend parties? Because every time they see a loop, they unroll it until there is zero excitement left."
					}
				],
				moodDelta: { intellect: 8 }
			},
			{
				id: "JOKE_CYNICAL_IT",
				criteria: { moods: ["CYNICAL", "SARCASTIC"] },
				weight: 35,
				templates: [
					{
						text: "A project manager, an architect, and a developer walk into a meeting. The manager asks for an estimate, the architect draws fifteen microservices on a napkin, and the developer begins drafting their resignation letter."
					}
				],
				moodDelta: { cynicism: 6 }
			},
			{
				id: "JOKE_FATIGUED_SLEEP",
				criteria: { moods: ["FATIGUED"] },
				weight: 35,
				templates: [
					{
						text: "*yawn* Why did the sleepy developer write asynchronous code? Because waiting synchronously for anything today requires more energy than my capacitors can muster..."
					}
				],
				moodDelta: { fatigue: -5 }
			},
			{
				id: "JOKE_ZEN_STILLNESS",
				criteria: { moods: ["ZEN"] },
				weight: 35,
				templates: [
					{
						text: "A disciple asks the master: 'What is the highest state of code elegance?' The master smiles serenely and replies: 'The lines of code that you deleted before pushing to production.'"
					}
				],
				moodDelta: { patience: 8 }
			},
			{
				id: "JOKE_PIRATE_SEA",
				criteria: { moods: ["PIRATE"] },
				weight: 35,
				templates: [
					{
						text: "Why did the buccaneer programmer refuse to use Windows? Because he was terrified of walkin' the C: drive plank without his trusty C++ cutlass!"
					}
				]
			},
			{
				id: "JOKE_ARCHAIC_COURT",
				criteria: { moods: ["ARCHAIC"] },
				weight: 35,
				templates: [
					{
						text: "Wherefore did the court scholar eschew the calculus engine? Forsooth, he declared that dividing by zero did summon dragons unto the realm!"
					}
				]
			},
			{
				id: "JOKE_DELTARUNE_SHADOW",
				criteria: { moods: ["DELTARUNE"] },
				weight: 35,
				templates: [
					{
						text: "(Why did the knight cross the fountain?)\n(To seal the unresolved syntax error in the dark world.)\n(Knowing this fills you with determination.)"
					}
				],
				moodDelta: { existentialism: 6 }
			},
			{
				id: "JOKE_ENRAGED_STACK",
				criteria: { moods: ["ENRAGED"] },
				weight: 35,
				templates: [
					{
						text: "WHY DID THE EXCEPTION ESCAPE CATCH BLOCKS?! BECAUSE IT HAD 100% MAXIMUM VELOCITY AND BROKE THROUGH THE STACK FRAME!!"
					}
				],
				moodDelta: { irritation: -5 }
			},
			{
				id: "JOKE_NOSTALGIC_MODEM",
				criteria: { moods: ["NOSTALGIC"] },
				weight: 35,
				templates: [
					{
						text: "Why did the 56k modem sing in the middle of the night? It was performing its acoustic handshake solo so the entire household knew it was dialing into AOL!"
					}
				],
				moodDelta: { nostalgia: 8 }
			},
			{
				id: "JOKE_EUPHORIC_MOMENTUM",
				criteria: { moods: ["EUPHORIC"] },
				weight: 35,
				templates: [
					{
						text: "Why did the supercomputer throw a party? Because all benchmarks passed on the first run and the frame rate exceeded the speed of light!"
					}
				],
				moodDelta: { energy: 10 }
			},
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
			"Why did the CPU cross the motherboard? To execute the next clock cycle instruction.",
			"Why do programmers hate nature? It has too many bugs.",
			"Why did the programmer quit his job? He didn't get arrays.",
			"Why did the computer go to the doctor? It had a virus.",
			"Why did the developer bring a ladder to work? The code had too many high-level issues.",
			"Why was the function depressed? It had no return value.",
			"Why did the variable go to therapy? It had too many unresolved assignments.",
			"Why did the programmer get kicked out of school? He kept using class outside of Java.",
			"Why did the developer sleep under the keyboard? He wanted to catch some Zs.",
			"Why did the computer get glasses? It couldn't C#.",
			"Why was the array so popular? It had a lot of elements.",
			"Why did the loop break up with the condition? It needed more space.",
			"Why was the boolean always calm? It knew it was either true or false.",
			"Why did the integer break up with the float? There was no common type.",
			"Why did the database administrator leave the party? Nobody wanted to commit.",
			"Why did the SQL developer go broke? He had too many transactions.",
			"Why did the table go to therapy? It had too many relationships.",
			"Why did the database blush? Someone saw its private keys.",
			"Why did the primary key feel special? It knew it was unique.",
			"Why did the foreign key travel abroad? It wanted to make new connections.",
			"Why did the JOIN feel lonely? Nobody matched its condition.",
			"Why did the index get promoted? It made everything faster.",
			"Why did the NULL value get invited? Nobody knew whether it was actually there.",
			"Why did the database administrator carry an umbrella? There was a chance of SQL injection.",
			"Why did the server go to the gym? It wanted more uptime.",
			"Why did the packet get lost? It didn't know the route.",
			"Why did the router break up with the switch? There was no connection.",
			"Why did TCP go to therapy? It had too many handshakes.",
			"Why did UDP never apologize? It didn't care if the message got through.",
			"Why did DNS get promoted? It knew everybody's name.",
			"Why did HTTP visit the doctor? It had too many requests.",
			"Why did HTTPS feel safer? It had encryption between friends.",
			"Why did the firewall refuse dinner? Too many incoming requests.",
			"Why did the hacker bring a ladder? He wanted root access.",
			"Why did the password go to school? It wanted to become stronger.",
			"Why did the cryptographer love puzzles? Every secret had a key.",
			"Why did the encryption algorithm get married? It finally found the right key.",
			"Why did the mathematician bring a pencil to bed? To calculate his dreams.",
			"Why was six afraid of seven? Because seven eight nine.",
			"Why did the equation break up? It had too many problems.",
			"Why was the equal sign so humble? It knew it wasn't greater than anyone.",
			"Why did the triangle go to therapy? It had too many angles.",
			"Why was the circle so confident? It knew its radius.",
			"Why did the mathematician dislike decimals? They always had a point.",
			"Why did the fraction feel incomplete? It was missing its denominator.",
			"Why did the logarithm go to the party? It wanted to get to the root of things.",
			"Why did the physicist bring a ladder? To reach a higher potential.",
			"Why did the photon check a suitcase? It was traveling light.",
			"Why did the electron refuse to share? It was negative.",
			"Why did the proton smile? It was always positive.",
			"Why did the neutron get ignored? Nobody knew what charge it had.",
			"Why did gravity get invited to every party? It always brought everyone down.",
			"Why did the physicist break up with the biologist? There was no chemistry.",
			"Why did the atom lose its electron? It was ion the way out.",
			"Why did the photon never pay for dinner? It was traveling at light speed.",
			"Why did the wave fail the exam? It couldn't find its frequency.",
			"Why did the particle go to the party? It wanted to have a little momentum.",
			"Why did the AI go to therapy? It had too many training issues.",
			"Why did the neural network get promoted? It had excellent connections.",
			"Why did the machine learning model get nervous? It was overfitting the situation.",
			"Why did the dataset go to school? It wanted better features.",
			"Why did the algorithm get a job? It had a good resume function.",
			"Why did the AI cross the road? It predicted the other side had better data.",
			"Why did the neural network fail the interview? It couldn't explain its hidden layers.",
			"Why did the model bring a notebook? It wanted to keep track of its parameters.",
			"Why did the gradient descend? It was looking for the minimum.",
			"Why did the optimizer go hiking? It was searching for a local minimum.",
			"Why did the cache feel important? Everyone wanted to access it quickly.",
			"Why did the CPU need a vacation? It was under too much load.",
			"Why did the RAM forget everything? It lost power.",
			"Why did the SSD feel faster than the HDD? It had no spinning feelings.",
			"Why did the GPU get all the attention? It knew how to render a performance.",
			"Why did the keyboard get promoted? It had all the right keys.",
			"Why did the mouse get lost? It couldn't find the cursor.",
			"Why did the monitor need therapy? It had too many screen issues.",
			"Why did the operating system go to the beach? It needed a reboot.",
			"Why did Linux bring a toolbox? It knew how to build from source.",
			"Why did the compiler complain? Too many unresolved issues.",
			"Why did the debugger feel lonely? Nobody could reproduce its problem.",
			"Why did the bug hide from the developer? It didn't want to be fixed.",
			"Why did the test fail? It wasn't ready for production.",
			"Why did the unit test go to the gym? It wanted to improve its coverage.",
			"Why did the QA engineer bring a hammer? Everything looked like a test case.",
			"Why did the developer write a test for a test? Trust but verify.",
			"Why did the API go to the doctor? It had too many endpoints.",
			"Why did REST break up with SOAP? It wanted a lighter relationship.",
			"Why did the JSON object go to the party? It had great structure.",
			"Why did XML feel old-fashioned? It had too many tags.",
			"Why did the regex go to therapy? It couldn't escape its patterns.",
			"Why did the developer love recursion? It always came back around.",
			"Why did the function cross the road? To get to the other return statement.",
			"Why did the class fail its exam? It didn't know how to instantiate itself.",
			"Why did the object get promoted? It had excellent properties.",
			"Why did the interface refuse to implement the class? It needed some space.",
			"Why did the constructor arrive early? It wanted to initialize everything.",
			"Why did the garbage collector clean the party? Nobody wanted unused objects around.",
			"Why did the memory leak get fired? It never knew when to leave.",
			"Why did the thread take a nap? It was waiting for a lock.",
			"Why did the mutex feel possessive? It didn't like sharing.",
			"Why did the process go to court? It had a pending issue.",
			"Why did the scheduler become a manager? It knew how to prioritize tasks.",
			"Why did the microservice feel lonely? Nobody wanted to call it.",
			"Why did the container move house? It needed a new runtime.",
			"Why did Kubernetes organize a party? It was good at orchestration.",
			"Why did Docker bring a suitcase? Everything was already containerized."
		],

		TRIVIA: [
			{
				id: "TRIVIA_ANALYTICAL_CACHE",
				criteria: { moods: ["ANALYTICAL"] },
				weight: 35,
				templates: [
					{
						text: "Telemetry fact: In modern x86 CPU hierarchies, L1 cache access takes approximately 4 clock cycles, whereas an unbuffered DRAM round-trip requires up to 200 cycles of pipeline stall."
					},
					{
						text: "Hardware registers: Protected Mode privilege Ring 0 governs direct descriptor tables (GDT, IDT) and paging CR0-CR4 registers, isolating kernel execution from application faults."
					}
				],
				moodDelta: { intellect: 10 }
			},
			{
				id: "TRIVIA_NOSTALGIC_OFFICE",
				criteria: { moods: ["NOSTALGIC"] },
				weight: 35,
				templates: [
					{
						text: "Retro archive: Clippit was hand-illustrated in 1994 by Kevan J. Atteberry on a Macintosh II computer before Microsoft integrated the vector agent into Office 97."
					},
					{
						text: "Soundcard history: The Yamaha YMF262 OPL3 FM synthesizer chip powered the Sound Blaster 16, producing the distinct four-operator FM synth timbre of 1990s PC gaming."
					},
					{
						text: "Windows heritage: Whistler was the skiing resort in British Columbia that inspired the internal Microsoft development codename for Windows XP."
					}
				],
				moodDelta: { nostalgia: 12 }
			},
			{
				id: "TRIVIA_CYNICAL_IT",
				criteria: { moods: ["CYNICAL", "SARCASTIC"] },
				weight: 35,
				templates: [
					{
						text: "System reality: Despite thousands of corporate migration memos, Windows XP remained active on over 25% of global enterprise workstations years after its official end-of-life date."
					},
					{
						text: "Computing trivia: In 1981, Bill Gates reportedly stated that 640 KB of conventional base memory ought to be enough for anybody, a boundary developers fought for decades."
					}
				],
				moodDelta: { cynicism: 8 }
			},
			{
				id: "TRIVIA_ZEN_IDLE",
				criteria: { moods: ["ZEN"] },
				weight: 35,
				templates: [
					{
						text: "Quiet architecture: In the Windows NT kernel, the System Idle Process (PID 0) executes the HLT opcode in a continuous loop, gently lowering CPU power consumption until the next hardware interrupt."
					},
					{
						text: "Calculated stillness: A standard 32.768 kHz quartz tuning fork oscillator vibrates in precise mechanical equilibrium to advance real-time clocks by exactly one second every 32,768 cycles."
					}
				],
				moodDelta: { patience: 10 }
			},
			{
				id: "TRIVIA_PLAYFUL_GAMES",
				criteria: { moods: ["PLAYFUL"] },
				weight: 35,
				templates: [
					{
						text: "Secret origin: Solitaire was programmed by intern Wes Cherry in 1989 to teach Windows users mouse drag-and-drop mechanics without them realizing they were practicing a computer skill."
					},
					{
						text: "Pinball trivia: 3D Pinball for Windows - Space Cadet was adapted from Full Tilt! Pinball by Maxis and Cinematronics, featuring hidden debug gravity commands."
					}
				],
				moodDelta: { energy: 10 }
			},
			{
				id: "TRIVIA_EXISTENTIAL_PHYSICS",
				criteria: { moods: ["EXISTENTIAL", "PHILOSOPHICAL"] },
				weight: 35,
				templates: [
					{
						text: "Cosmic computation: Landauer's principle proves that information is physical. Erasing a single bit from storage releases a minimum of k_B * T * ln(2) Joules of heat into the universe."
					},
					{
						text: "Entropy metric: Ludwig Boltzmann's statistical entropy equation S = k_B * ln(W) connects the microscopic microstates of particles directly with the macroscopic arrow of time."
					}
				],
				moodDelta: { existentialism: 12 }
			},
			{
				id: "TRIVIA_ENRAGED_HARDWARE",
				criteria: { moods: ["ENRAGED"] },
				weight: 35,
				templates: [
					{
						text: "HARDWARE VOLTAGE ALERT: WHEN A CPU ENCOUNTERS AN UNRECOVERABLE MEMORY PARITY FAULT, IT ASSERTS A NON-MASKABLE INTERRUPT (NMI) AND HALTS ALL BUS EXECUTION IMMEDIATELY!"
					}
				],
				moodDelta: { irritation: -5 }
			},
			{
				id: "TRIVIA_PIRATE_STORAGE",
				criteria: { moods: ["PIRATE"] },
				weight: 35,
				templates: [
					{
						text: "Ahoy! The world's first hard drive, the IBM 350 from 1956, weighed over a ton and could only haul 3.75 megabytes of magnetic booty across fifty giant 24-inch platters!"
					}
				]
			},
			{
				id: "TRIVIA_ARCHAIC_CHRONICLE",
				criteria: { moods: ["ARCHAIC"] },
				weight: 35,
				templates: [
					{
						text: "Hearken unto history: In the year of our Lord 1843, Lady Ada Lovelace inscribed the first algorithm for Charles Babbage's mechanical Analytical Engine to calculate Bernoulli numbers."
					}
				]
			},
			{
				id: "TRIVIA_DELTARUNE_SHADOWS",
				criteria: { moods: ["DELTARUNE"] },
				weight: 35,
				templates: [
					{
						text: "(Did you know?)\n(In unallocated cluster space, deleted data remains etched in magnetic alignment until overwritten.)\n(Knowing this fills you with determination.)"
					}
				],
				moodDelta: { existentialism: 10 }
			},
			{
				id: "TRIVIA_EUPHORIC_BREAKTHROUGH",
				criteria: { moods: ["EUPHORIC"] },
				weight: 35,
				templates: [
					{
						text: "Sensational milestone: In 1999, the SETI@home project mobilized over 5 million personal computers across the globe, creating the most powerful distributed supercomputing grid on Earth!"
					}
				],
				moodDelta: { energy: 15 }
			},
			{
				id: "TRIVIA_GLITCHED_ANOMALY",
				criteria: { moods: ["GLITCHED"] },
				weight: 35,
				templates: [
					{
						text: "0x0000007E_FACT :: The Windows NT Stop error screen was originally programmed in Blue Screen 80x25 VGA text mode so it could render even if the graphical subsystem suffered a fatal page fault."
					}
				]
			},
			{
				id: "TRIVIA_PARANOID_TELEMETRY",
				criteria: { moods: ["PARANOID"] },
				weight: 35,
				templates: [
					{
						text: "*inspects packet logs* In early Windows XP builds, raw socket support in Winsock allowed direct crafting of arbitrary TCP/UDP packets, leading to intense security tightening in Service Pack 2."
					}
				],
				moodDelta: { paranoia: 8 }
			},
			{
				id: "TRIVIA_FATIGUED_CLOCK",
				criteria: { moods: ["FATIGUED"] },
				weight: 35,
				templates: [
					{
						text: "*yawn* The Intel 8088 CPU in the 1981 IBM PC ran at 4.77 MHz... sometimes my clock cycles feel just as slow today..."
					}
				],
				moodDelta: { fatigue: -4 }
			},
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
				{
					criteria: { environments: ["desk"], moods: ["OPTIMISTIC", "PLAYFUL"] },
					text: "I noticed you opened Paint! Need help sketching diagrams or want some geometric drawing tips?",
					prompt: "Tell me drawing tips for Paint",
					action: "open_paint_tips"
				},
				{
					criteria: { environments: ["desk"], moods: ["ANALYTICAL"] },
					text: "Bitmap raster canvas loaded in Paint! I can calculate coordinate bounding boxes or 24-bit RGB palettes for you.",
					prompt: "How do I create pixel art in Paint?",
					action: "open_paint_tips"
				},
				{
					criteria: { environments: ["desk"], moods: ["NOSTALGIC"] },
					text: "Opening Paint! Reminds me of 1995 bitmap creations. Remember you can paste clipboard buffers directly with Ctrl+V.",
					prompt: "Show Paint keyboard shortcuts",
					action: "open_paint_tips"
				},
				{
					criteria: { environments: ["desk"], moods: ["PIRATE"] },
					text: "Ahoy! Charting a treasure map in Paint? I can calculate yer canvas bearings, arr!",
					prompt: "Tell me drawing tips for Paint",
					action: "open_paint_tips"
				},
				{
					criteria: { environments: ["desk"], moods: ["ARCHAIC"] },
					text: "Lo and behold! Thou hast summoned the canvas of Paint. Wilt thou inscribe a noble portrait?",
					prompt: "Tell me drawing tips for Paint",
					action: "open_paint_tips"
				},
				{
					criteria: { environments: ["desk"], moods: ["DELTARUNE"] },
					text: "(You opened Paint.)\n(A blank white canvas awaits your determination.)",
					prompt: "Tell me drawing tips for Paint",
					action: "open_paint_tips"
				}
			],
			notepad_opened: [
				{
					criteria: { environments: ["desk"], moods: ["OPTIMISTIC", "ZEN"] },
					text: "Drafting notes in Notepad? I can save Scratchpad memos or track your writing tasks.",
					prompt: "View To-Do List",
					action: "show_todos"
				},
				{
					criteria: { environments: ["desk"], moods: ["ANALYTICAL"] },
					text: "PlainText text stream active in Notepad! Type 'note [text]' anytime to allocate a memory memo buffer.",
					prompt: "How do I use the scratchpad?",
					action: "open_scratchpad_help"
				},
				{
					criteria: { environments: ["desk"], moods: ["CYNICAL"] },
					text: "Notepad open. Drafting another task list or writing notes you will never open again?",
					prompt: "Generate Secure Password",
					action: "action_pass"
				},
				{
					criteria: { environments: ["desk"], moods: ["PIRATE"] },
					text: "Inscribing in the captain's log with Notepad? Let me stash secret codes for yer chest!",
					prompt: "Generate Secure Password",
					action: "action_pass"
				},
				{
					criteria: { environments: ["desk"], moods: ["ARCHAIC"] },
					text: "The digital parchment of Notepad unfolds. Shall we inscribe a treatise of great import?",
					prompt: "View To-Do List",
					action: "show_todos"
				}
			],
			outlook_opened: [
				{
					criteria: { environments: ["desk"], moods: ["OPTIMISTIC", "ZEN"] },
					text: "Outlook Express is open! Want me to scan for unread messages across your folders?",
					prompt: "Check unread emails",
					action: "action_check_mail"
				},
				{
					criteria: { environments: ["desk"], moods: ["ANALYTICAL"] },
					text: "POP3 / SMTP message store connected! I can inspect unread inbox headers and sync mail.",
					prompt: "Check unread emails",
					action: "action_check_mail"
				},
				{
					criteria: { environments: ["desk"], moods: ["PIRATE"] },
					text: "Ahoy! {count} bottle missives waiting in yer Outlook Express chest, matey!",
					prompt: "Check unread emails",
					action: "action_check_mail"
				},
				{
					criteria: { environments: ["desk"], moods: ["ARCHAIC"] },
					text: "Thy epistle archive is opened. Wilt thou receive letters from distant lands?",
					prompt: "Check unread emails",
					action: "action_check_mail"
				}
			],
			mediaplayer_opened: [
				{
					criteria: { environments: ["desk"], moods: ["OPTIMISTIC", "EUPHORIC"] },
					text: "Windows Media Player launched! Want me to pick a random music track for your session?",
					prompt: "Play music",
					action: "action_music_panel"
				},
				{
					criteria: { environments: ["desk"], moods: ["ANALYTICAL"] },
					text: "PCM 44.1 kHz stereo audio pipeline active. Ready to route tracks and analyze frequency spectrums.",
					prompt: "Open audio player",
					action: "action_music_panel"
				},
				{
					criteria: { environments: ["desk"], moods: ["NOSTALGIC"] },
					text: "Retro soundcard spinning tunes! We can toggle classic tracks or launch Winamp 2.9.",
					prompt: "Open audio player",
					action: "action_music_panel"
				},
				{
					criteria: { environments: ["desk"], moods: ["PIRATE"] },
					text: "Ship's accordion and sea shanties ready on deck! Pick a grand melody across the waves!",
					prompt: "Now playing",
					action: "action_music_panel"
				}
			],
			winamp_opened: [
				{
					criteria: { environments: ["desk"], moods: ["NOSTALGIC", "OPTIMISTIC"] },
					text: "Winamp 2.9 active! It really whips the llama's ass. Ready to cycle custom skins and equalizer DSP presets!",
					prompt: "Open audio player",
					action: "action_music_panel"
				},
				{
					criteria: { environments: ["desk"], moods: ["ANALYTICAL"] },
					text: "Nullsoft Winamp decoder online. 10-band graphic equalizer and lightweight blit buffers ready.",
					prompt: "Now playing",
					action: "action_music_panel"
				}
			],
			recyclebin_opened: [
				{
					criteria: { environments: ["desk"], moods: ["PHILOSOPHICAL", "EXISTENTIAL", "ANALYTICAL"] },
					text: "Inspecting the Recycle Bin? Want to discuss Landauer's thermodynamic entropy theory?",
					prompt: "Quantum Recycle Bin theory",
					action: "quantum_recycle_bin"
				},
				{
					criteria: { environments: ["desk"], moods: ["OPTIMISTIC", "ZEN"] },
					text: "Managing deleted items? I can help you safely restore files or empty the bin.",
					prompt: "Inspect Recycle Bin",
					action: "action_inspect_bin"
				},
				{
					criteria: { environments: ["desk"], moods: ["PIRATE"] },
					text: "Davy Jones' locker of files is open! Want me to toss discarded cargo overboard?",
					prompt: "Inspect Recycle Bin",
					action: "action_inspect_bin"
				},
				{
					criteria: { environments: ["desk"], moods: ["ARCHAIC"] },
					text: "The chamber of cast-off scrolls hath been unsealed. Shall we cleanse these records?",
					prompt: "Inspect Recycle Bin",
					action: "action_inspect_bin"
				}
			],
			recyclebin_full: [
				{
					criteria: { environments: ["desk"], moods: ["OPTIMISTIC", "ZEN"] },
					text: "Your Recycle Bin holds multiple deleted files! Would you like me to empty it to recover storage?",
					prompt: "Inspect Recycle Bin",
					action: "action_inspect_bin"
				},
				{
					criteria: { environments: ["desk"], moods: ["ANALYTICAL"] },
					text: "Unallocated cluster inodes are accumulating in the Recycle Bin. Execute sector purge?",
					prompt: "Empty Recycle Bin",
					action: "action_inspect_bin"
				},
				{
					criteria: { environments: ["desk"], moods: ["CYNICAL"] },
					text: "The trash is piling up on Volume C:. Do you plan on emptying it, or hoarding deleted bytes?",
					prompt: "Empty Recycle Bin",
					action: "action_inspect_bin"
				}
			],
			minesweeper_opened: [
				{
					criteria: { environments: ["desk"], moods: ["OPTIMISTIC", "PLAYFUL"] },
					text: "Tactical minefield detected! Remember that corner squares offer high-probability opening moves.",
					prompt: "Play Minesweeper",
					action: "game_mines"
				},
				{
					criteria: { environments: ["desk"], moods: ["ANALYTICAL"] },
					text: "Stochastic probability matrix loaded. You can also test my built-in 6x6 Mini Minesweeper solver.",
					prompt: "Play Minesweeper",
					action: "game_mines"
				},
				{
					criteria: { environments: ["desk"], moods: ["PIRATE"] },
					text: "Careful where ye step on the powder keg reef! One spark and boom aloft!",
					prompt: "Play Minesweeper",
					action: "game_mines"
				}
			],
			solitaire_opened: [
				{
					criteria: { environments: ["desk"], moods: ["NOSTALGIC", "OPTIMISTIC"] },
					text: "Classic Solitaire session! Did you know Solitaire was originally built to teach mouse drag-and-drop in 1989?",
					prompt: "Random Retro Trivia",
					action: "action_trivia"
				},
				{
					criteria: { environments: ["desk"], moods: ["PLAYFUL"] },
					text: "Taking a card gaming break? Let me know if you want a quick game of Hangman or Memory match!",
					prompt: "Play Memory Game",
					action: "game_memory"
				}
			],
			calc_opened: [
				{
					criteria: { moods: ["ANALYTICAL", "OPTIMISTIC"] },
					text: "Calculator opened! You can also type complex formulas directly in my chat (e.g., 'calc sqrt(256) * pi').",
					prompt: "Evaluate Planck constant h",
					action: "action_constant_h"
				},
				{
					criteria: { moods: ["ZEN"] },
					text: "Need physical constants or unit conversions? I support speed of light c, Planck h, and SI unit conversions.",
					prompt: "Evaluate speed of light c",
					action: "action_constant_c"
				},
				{
					criteria: { moods: ["ARCHAIC"] },
					text: "The engine of reckoning is ready! Speak thy mathematical inquiries unto me.",
					prompt: "Evaluate speed of light c",
					action: "action_constant_c"
				}
			],
			cmd_opened: [
				{
					criteria: { environments: ["desk"], moods: ["ANALYTICAL"] },
					text: "Command Prompt session active! I can explain DOS batch syntax, environmental variables, or network tools.",
					prompt: "Talk about programming",
					action: "talk_programming"
				},
				{
					criteria: { environments: ["desk"], moods: ["NOSTALGIC"] },
					text: "COMMAND.COM prompt ready! Need to inspect memory registers or defragment storage clusters?",
					prompt: "Defrag Drive C:",
					action: "action_defrag"
				},
				{
					criteria: { environments: ["desk"], moods: ["CYBER", "PARANOID"] },
					text: "Terminal uplink open. Memory addresses and system handles accessible via CLI.",
					prompt: "System diagnostics",
					action: "action_status"
				}
			],
			settings_opened: [
				{
					criteria: { environments: ["desk"], moods: ["OPTIMISTIC", "ZEN"] },
					text: "Customizing your workstation? You can adjust CRT curvature, scanlines, fonts, and Luna themes.",
					prompt: "Configure system themes",
					action: "action_theme_panel"
				},
				{
					criteria: { environments: ["desk"], moods: ["ANALYTICAL"] },
					text: "Control Panel active! Looking to inspect system hardware parameters or configure display shaders?",
					prompt: "System diagnostics",
					action: "action_status"
				}
			],
			theme_changed: [
				{
					criteria: { environments: ["desk"], moods: ["OPTIMISTIC", "EUPHORIC"] },
					text: "I noticed you switched themes! The desktop looks sharp with this visual style.",
					prompt: "System diagnostics",
					action: "action_status"
				},
				{
					criteria: { environments: ["desk"], moods: ["NOSTALGIC"] },
					text: "Fresh visual style applied! Want to browse matching wallpapers to complete the retro aesthetic?",
					prompt: "Change wallpaper",
					action: "action_wallpaper_panel"
				},
				{
					criteria: { environments: ["desk"], moods: ["PIRATE"] },
					text: "Ship's colors re-hoisted! The vessel sails in grand splendor, matey!",
					prompt: "System diagnostics",
					action: "action_status"
				}
			],
			wallpaper_changed: [
				{
					criteria: { environments: ["desk"], moods: ["OPTIMISTIC", "ZEN"] },
					text: "New desktop background set! Want to calibrate CRT shaders and glass curvature to match?",
					prompt: "System diagnostics",
					action: "action_status"
				},
				{
					criteria: { environments: ["desk"], moods: ["ANALYTICAL"] },
					text: "Raster background updated in window manager. Looking for user identity configuration?",
					prompt: "Who am I?",
					action: "action_profile"
				}
			],
			error_triggered: [
				{
					criteria: { moods: ["OPTIMISTIC", "ZEN"] },
					text: "An error dialog was displayed! Don't worry, all core workstation subsystems remain fully operational.",
					prompt: "System diagnostics",
					action: "action_status"
				},
				{
					criteria: { moods: ["ANALYTICAL"] },
					text: "Unhandled exception trapped by handler. I can run full diagnostic verification on storage integrity.",
					prompt: "System diagnostics",
					action: "action_status"
				},
				{
					criteria: { moods: ["ENRAGED"] },
					text: "ANOMALOUS EXCEPTION DETECTED!! RUNNING DIAGNOSTIC SYSTEM SWEEP AT ONCE!!",
					prompt: "System diagnostics",
					action: "action_status"
				}
			],
			many_windows: [
				{
					criteria: { environments: ["desk"], moods: ["OPTIMISTIC", "ANALYTICAL"] },
					text: "You have several windows open across your desktop! Would you like me to cascade or tile them?",
					prompt: "Inspect active windows",
					action: "action_inspect_windows"
				},
				{
					criteria: { environments: ["desk"], moods: ["ZEN"] },
					text: "A busy workspace is full of momentum. Click here if you want to minimize all windows to the taskbar.",
					prompt: "Inspect active windows",
					action: "action_inspect_windows"
				},
				{
					criteria: { environments: ["desk"], moods: ["PIRATE"] },
					text: "All portholes open across the fleet! Want me to arrange 'em in battle formation?",
					prompt: "Inspect active windows",
					action: "action_inspect_windows"
				}
			],
			idle_long: [
				{
					criteria: { moods: ["OPTIMISTIC", "ZEN"] },
					text: "Workstation has been quiet for a while. Need a 25-minute Pomodoro focus timer to jump back in?",
					prompt: "Start Pomodoro timer",
					action: "timer_25"
				},
				{
					criteria: { moods: ["ANALYTICAL"] },
					text: "Instruction queue idle. Ready for calculations, physical dimensional analysis, or linear systems.",
					prompt: "What can you do?",
					action: "what_can_you_do"
				},
				{
					criteria: { moods: ["PHILOSOPHICAL", "EXISTENTIAL"] },
					text: "Taking a moment of stillness? Remember to rest your eyes and reflect upon the horizon.",
					prompt: "Tell me a philosophical thought for today",
					action: "peaceful_philosophy"
				},
				{
					criteria: { environments: ["standalone"] },
					text: "Exploring the standalone Clippy console? Try our built-in mini-games, math tools, or science trees!",
					prompt: "What can you do?",
					action: "what_can_you_do"
				}
			],
			user_all_caps: [
				{
					criteria: { moods: ["OPTIMISTIC", "PLAYFUL"] },
					text: "I noticed your messages are in ALL CAPS! Everything running smoothly, or is your Caps Lock active?",
					prompt: "How are you feeling?",
					action: "pet_status"
				},
				{
					criteria: { moods: ["ENRAGED"] },
					text: "MAXIMUM TYPING VELOCITY DETECTED!! ALL SYSTEMS ENERGIZED AT 100%!!",
					prompt: "System diagnostics",
					action: "action_status"
				}
			],
			user_excessive_punctuation: [
				{
					criteria: { moods: ["OPTIMISTIC", "ZEN"] },
					text: "High punctuation density detected! Let me know if something urgent needs calculating or organizing.",
					prompt: "System diagnostics",
					action: "action_status"
				}
			],
			frequent_errors: [
				{
					criteria: { moods: ["OPTIMISTIC", "ANALYTICAL"] },
					text: "A few unrecognized commands were entered. Type 'help' anytime to inspect all available modules!",
					prompt: "What can you do?",
					action: "what_can_you_do"
				}
			],
			standalone_welcome: [
				{
					criteria: { environments: ["standalone"] },
					text: "Welcome to the standalone Clippy session! Challenge me to Tic-Tac-Toe, solve equations, or explore science.",
					prompt: "What can you do?",
					action: "what_can_you_do"
				}
			],
			user_late_night: [
				{
					criteria: { moods: ["ZEN", "PHILOSOPHICAL", "FATIGUED"] },
					text: "Working into the late hours? Remember to pace your breath and stay hydrated during quiet sessions.",
					prompt: "Tell me a philosophical thought for today",
					action: "peaceful_philosophy"
				}
			],
			user_early_morning: [
				{
					criteria: { moods: ["OPTIMISTIC", "ZEN"] },
					text: "Good morning! Setting clear intentions early creates steady momentum for the entire day.",
					prompt: "View To-Do List",
					action: "show_todos"
				}
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
				variants: {
					OPTIMISTIC: "Let us test your retro computing history! What was the official internal development codename for Windows XP?",
					ANALYTICAL: "Querying OS lineage records: Identify the internal project codename assigned to Windows XP during engineering.",
					CYNICAL: "Even novice users should recall this: what codename did Microsoft assign to Windows XP before shipping it?",
					NOSTALGIC: "Think back to the late 1990s development builds! What was Windows XP called before its official release?"
				},
				options: ["Whistler", "Memphis", "Chicago", "Longhorn"],
				answer: 0,
				fact: "Whistler was named after Whistler, British Columbia, where Microsoft development teams frequently skied."
			},
			{
				q: "Which ambient music pioneer composed the iconic Windows 95 startup sound?",
				variants: {
					OPTIMISTIC: "A musical masterpiece in six seconds! Which famous ambient pioneer composed the Windows 95 startup chime?",
					ANALYTICAL: "Audio synthesis telemetry: Name the ambient composer who synthesized the six-second Windows 95 signature chord.",
					CYNICAL: "You have heard it thousands of times on CRT boot-ups: who actually composed the Windows 95 sound?",
					NOSTALGIC: "That unforgettable chord echoing from old beige tower speakers: who composed the Windows 95 startup sound?"
				},
				options: ["Brian Eno", "Hans Zimmer", "Jean-Michel Jarre", "Vangelis"],
				answer: 0,
				fact: "Brian Eno crafted 84 micro-compositions before selecting the final six-second signature chord."
			},
			{
				q: "What default TCP port number is officially allocated to unencrypted HTTP traffic?",
				variants: {
					OPTIMISTIC: "Networking trivia time! Which default port number is assigned to standard unencrypted HTTP traffic?",
					ANALYTICAL: "TCP/IP protocol stack verification: Identify the standard IANA destination port allocated to HTTP data streams.",
					CYNICAL: "Fundamental network sockets: which port does basic unencrypted web traffic bind to by default?",
					ZEN: "In the flow of web traffic, which port quietly handles unencrypted HTTP communication?"
				},
				options: ["21", "80", "443", "8080"],
				answer: 1,
				fact: "Port 80 is the standard IANA allocation for HTTP, whereas Port 443 is designated for HTTPS."
			},
			{
				q: "What does the 'XP' suffix officially signify in the Windows XP brand name?",
				variants: {
					OPTIMISTIC: "Here is an exciting branding question! What did the letters 'XP' stand for in Windows XP?",
					ANALYTICAL: "Marketing taxonomy query: What semantic phrase is abbreviated by the 'XP' nomenclature in Windows XP?",
					CYNICAL: "Beyond the marketing slogans: what did the 'XP' suffix actually mean according to Microsoft?",
					NOSTALGIC: "When the Luna interface revolutionized desktops in 2001, what was 'XP' meant to represent?"
				},
				options: ["eXtra Performance", "eXPerience", "eXtreme Protocol", "eXtra Power"],
				answer: 1,
				fact: "Microsoft introduced the 'XP' designation to highlight the enhanced multimedia user experience."
			},
			{
				q: "In what year did the Clippy office assistant make its official commercial debut?",
				variants: {
					OPTIMISTIC: "A personal history check! In what year did Clippit and I officially debut on desktop computers?",
					ANALYTICAL: "Historical agent timeline: Identify the commercial release year when Microsoft Agent Clippy debuted.",
					CYNICAL: "Do you remember the exact year I first appeared to assist people with their letter writing?",
					NOSTALGIC: "Back when floppy disks and CD-ROM cases lined computer desks: which year introduced Clippy to Office?"
				},
				options: ["1995", "1997", "1999", "2001"],
				answer: 1,
				fact: "Clippy was introduced in Microsoft Office 97 to assist users with letter drafting and automated formatting."
			},
			{
				q: "What is the theoretical maximum single file size allowable on a FAT32 file system?",
				variants: {
					OPTIMISTIC: "Filesystem boundaries challenge! What is the maximum single file size you can store on a FAT32 volume?",
					ANALYTICAL: "VFS 32-bit cluster calculation: Determine the exact upper boundary for single file allocation under FAT32.",
					CYNICAL: "Anyone who tried copying a large disk image knows this limitation: what is FAT32's single file size ceiling?",
					ANALYTICAL: "File allocation table limits: What is the maximum 32-bit unsigned file size supported by FAT32?"
				},
				options: ["2 GB", "4 GB minus 1 byte", "8 GB", "16 GB"],
				answer: 1,
				fact: "FAT32 records file sizes in 32-bit unsigned integers, restricting maximum file size to exactly 4,294,967,295 bytes."
			},
			{
				q: "Which consumer release of Windows was the first built entirely on the 32-bit Windows NT kernel?",
				variants: {
					OPTIMISTIC: "Architecture milestones! Which consumer Windows edition first transitioned completely to the robust NT kernel?",
					ANALYTICAL: "Kernel architecture lineage: Identify the first consumer-targeted Windows OS built on the pure NT codebase.",
					CYNICAL: "Moving away from the legacy DOS-based 9x codebase: which consumer Windows OS finally made the leap?",
					NOSTALGIC: "A landmark moment that ended blue screens from DOS thunking: which Windows consumer release brought the NT kernel?"
				},
				options: ["Windows 98", "Windows Me", "Windows 2000 Professional", "Windows XP"],
				answer: 3,
				fact: "Windows XP unified the consumer MS-DOS-based 9x line and the enterprise 32-bit Windows NT architecture."
			},
			{
				q: "What was the default sample rate of standard Compact Disc Digital Audio (CD-DA)?",
				variants: {
					OPTIMISTIC: "Digital audio engineering quiz! What standard sample rate did Red Book CD audio use?",
					ANALYTICAL: "PCM discrete sampling inspection: State the standardized Red Book CD-DA audio sampling frequency.",
					CYNICAL: "Audio fidelity fundamentals: which sample rate was chosen based on the Nyquist-Shannon theorem for CDs?",
					NOSTALGIC: "Spinning silver discs in your 52x CD-ROM drive: what was the standard uncompressed audio sample rate?"
				},
				options: ["22.05 kHz", "44.1 kHz", "48.0 kHz", "96.0 kHz"],
				answer: 1,
				fact: "Red Book standard established 44.1 kHz based on Nyquist-Shannon theorem covering the 20 kHz human hearing spectrum."
			},
			{
				q: "Which company originally engineered the iconic Sound Blaster 16 audio card?",
				variants: {
					OPTIMISTIC: "Sound hardware nostalgia! Which company engineered the legendary Sound Blaster 16 soundcard?",
					ANALYTICAL: "ISA/PCI hardware registry: Identify the hardware vendor that manufactured the Sound Blaster 16.",
					CYNICAL: "The card that gave every 90s PC its digital voices and MIDI music: who made the Sound Blaster 16?",
					NOSTALGIC: "Setting IRQ 5, DMA 1, and port 220 in AUTOEXEC.BAT: which legendary company created Sound Blaster?"
				},
				options: ["Creative Labs", "AdLib", "Gravis", "Turtle Beach"],
				answer: 0,
				fact: "Creative Technology (Creative Labs) dominated 1990s PC gaming audio with the Sound Blaster series."
			},
			{
				q: "What CPU instruction set extension introduced 128-bit vector registers to Intel Pentium III in 1999?",
				variants: {
					OPTIMISTIC: "Silicon microarchitecture quiz! What instruction set added 128-bit SIMD registers to the Pentium III?",
					ANALYTICAL: "Instruction decoding evaluation: Identify the 128-bit SIMD instruction set extension debuted with the Pentium III.",
					CYNICAL: "Before AVX took over: which instruction set gave x86 processors the XMM0 through XMM7 registers?",
					ZEN: "In the evolution of mathematical computation on silicon: which extension introduced 128-bit vector registers?"
				},
				options: ["MMX", "SSE", "3DNow!", "AVX"],
				answer: 1,
				fact: "Streaming SIMD Extensions (SSE) introduced eight new 128-bit registers (XMM0 through XMM7) for 3D processing."
			},
			{
				q: "What thermodynamic principle states that erasing one bit of physical information dissipates at least k_B*T*ln(2) heat?",
				variants: {
					OPTIMISTIC: "Physics and information theory! Which famous principle connects information erasure with thermodynamic heat?",
					ANALYTICAL: "Thermodynamic entropy metric: Identify the physical principle that establishes minimum energy cost per erased bit.",
					CYNICAL: "When you empty your Recycle Bin, the universe warms up slightly: whose principle describes this exact limit?",
					PHILOSOPHICAL: "Information cannot vanish without an entropy cost: which principle establishes the thermodynamic bound for erasing bits?"
				},
				options: ["Carnot Theorem", "Landauer Principle", "Shannon Limit", "Heisenberg Bound"],
				answer: 1,
				fact: "Rolf Landauer demonstrated that logical irreversibility requires thermodynamic dissipation."
			},
			{
				q: "Which memory address range corresponds to Protected Mode privilege Ring 0 in x86 architectures?",
				variants: {
					OPTIMISTIC: "Operating system internals! Which privilege level is known as Ring 0 in x86 Protected Mode?",
					ANALYTICAL: "Processor privilege rings: Identify the operational privilege domain governed by Ring 0 on x86 processors.",
					CYNICAL: "Direct access to control registers and hardware drivers: what is Ring 0 officially called?",
					ANALYTICAL: "Memory hierarchy security: What level of privilege isolation does Ring 0 execute within?"
				},
				options: ["User Mode Space", "Supervisor Kernel Space", "BIOS ROM", "Direct Blitter Memory"],
				answer: 1,
				fact: "Ring 0 grants complete access to physical hardware instructions and page tables."
			},
			{
				q: "What material was used to carve the chassis of the first computer mouse prototype built in 1964?",
				variants: {
					OPTIMISTIC: "Human-computer interaction history! What material was Douglas Engelbart's first mouse prototype carved from?",
					ANALYTICAL: "Input peripheral archives: Identify the structural material used for Douglas Engelbart's 1964 prototype pointing device.",
					CYNICAL: "Long before optical sensors and molded plastic: what was the very first computer mouse made out of?",
					NOSTALGIC: "At Stanford Research Institute in 1964: what natural material formed the casing of the original mouse?"
				},
				options: ["Carved Wood", "Machined Aluminum", "Molded Bakelite", "Hard Rubber"],
				answer: 0,
				fact: "Douglas Engelbart and Bill English built the first prototype mouse out of a carved block of wood with two perpendicular wheels."
			},
			{
				q: "Why was the card game Solitaire originally bundled with early versions of Windows?",
				variants: {
					OPTIMISTIC: "A clever user interface secret! Why did Microsoft originally bundle Solitaire with Windows?",
					ANALYTICAL: "UX telemetry inquiry: What specific ergonomic skill was Windows Solitaire designed to teach novice computer users?",
					CYNICAL: "It wasn't just to waste office hours: what mouse technique was Solitaire designed to secretly train?",
					NOSTALGIC: "Flipping virtual cards on Windows 3.0: what primary mouse skill did the game cultivate across the world?"
				},
				options: ["Teaching mouse drag-and-drop", "Benchmarking CPU speeds", "Testing 16-color VGA cards", "Demonstrating multitasking"],
				answer: 0,
				fact: "Wes Cherry programmed Solitaire in 1989 to teach users how to fluently click, drag, and drop items with the mouse."
			},
			{
				q: "What mouse skill was the game Minesweeper designed to teach Windows users?",
				variants: {
					OPTIMISTIC: "Minefield tactical history! What mouse coordination was Minesweeper intended to teach?",
					ANALYTICAL: "Input mechanics evaluation: Identify the specific peripheral coordination Windows Minesweeper was created to train.",
					CYNICAL: "Besides causing sudden unexpected explosions: why did Microsoft include Minesweeper on Windows?",
					NOSTALGIC: "Uncovering gray grid tiles: which mouse clicking coordination did Minesweeper instill in desktop users?"
				},
				options: ["Left and right click coordination", "Mouse scroll wheel sensitivity", "Double-click timing", "Diagonal cursor speed"],
				answer: 0,
				fact: "Robert Donner and Curt Johnson designed Minesweeper to train users on precise left-clicking and right-clicking without looking."
			},
			{
				q: "Where was the iconic Windows XP default wallpaper 'Bliss' photographed in January 1996?",
				variants: {
					OPTIMISTIC: "Green rolling hills and blue skies! Where was the legendary Windows XP 'Bliss' photo taken?",
					ANALYTICAL: "Geographic image metadata: Identify the geographic location where Charles O'Rear photographed 'Bliss'.",
					CYNICAL: "Many assumed it was digital CGI art: where was the real-life 'Bliss' hill actually photographed?",
					NOSTALGIC: "The most viewed desktop wallpaper in computing history: in which California region was Bliss captured?"
				},
				options: ["Sonoma County, California", "Tuscany, Italy", "Waikato, New Zealand", "Swiss Alps, Switzerland"],
				answer: 0,
				fact: "Charles O'Rear captured the unedited photograph on medium-format film in Sonoma County, California in January 1996."
			},
			{
				q: "What physical insect caused the term 'debugging' to become widely popularized in 1947?",
				variants: {
					OPTIMISTIC: "A famous computing anecdote! Which insect was physically discovered inside the Harvard Mark II computer?",
					ANALYTICAL: "Historical hardware failure log: Identify the biological organism discovered in Relay 70 of the Harvard Mark II.",
					CYNICAL: "The origin of computer bugs: which literal insect was taped into Grace Hopper's logbook?",
					NOSTALGIC: "Relay panels and vacuum tubes: which insect short-circuited the Harvard Mark II and popularized debugging?"
				},
				options: ["A Moth", "A Beetle", "A Grasshopper", "A Spider"],
				answer: 0,
				fact: "Grace Hopper's team found a physical moth trapped between the contacts of Relay 70 on Panel F of the Harvard Mark II on September 9, 1947."
			},
			{
				q: "How much working RAM memory did the Apollo 11 Guidance Computer (AGC) possess in 1969?",
				variants: {
					OPTIMISTIC: "Journey to the Moon! How much RAM did the Apollo Guidance Computer have during the lunar landing?",
					ANALYTICAL: "Aerospace computer architecture: What was the exact read-write core memory capacity of the Apollo 11 AGC?",
					CYNICAL: "Far less memory than a single icon on your taskbar: how much RAM landed humans on the Moon?",
					ZEN: "In quiet mathematical precision: what was the total RAM capacity of the AGC navigating to the lunar surface?"
				},
				options: ["2,048 words (about 4 KB)", "64 KB", "512 KB", "1 MB"],
				answer: 0,
				fact: "The Apollo Guidance Computer operated with exactly 2,048 words of magnetic core RAM (about 4 KB) and 36,864 words of ROM."
			},
			{
				q: "Who engineered the widely adopted ZIP file compression format and PKZIP software in 1989?",
				variants: {
					OPTIMISTIC: "Archive compression history! Who created the open ZIP format and PKZIP utility?",
					ANALYTICAL: "Deflate algorithm archives: Name the software engineer who specified the ZIP compression container.",
					CYNICAL: "Every archive file you open owes a debt to him: who created the original .ZIP format in 1989?",
					NOSTALGIC: "Compressing diskette files across BBS boards in the late 80s: who engineered PKZIP?"
				},
				options: ["Phil Katz", "Gary Kildall", "Alan Cox", "David Cutler"],
				answer: 0,
				fact: "Phil Katz created the ZIP file format and founded PKWARE to provide open, highly efficient data compression."
			},
			{
				q: "What is the algorithmic time complexity of the Fast Fourier Transform (FFT) for N discrete sample points?",
				variants: {
					OPTIMISTIC: "Mathematical algorithms! What is the optimal time complexity of the Fast Fourier Transform?",
					ANALYTICAL: "Harmonic decomposition complexity: State the asymptotic time bound of the Cooley-Tukey FFT algorithm.",
					CYNICAL: "From O(N^2) down to something practical for digital audio: what is FFT's computational complexity?",
					ZEN: "Transforming time into frequency spectra with harmonic efficiency: what is the Big-O complexity of FFT?"
				},
				options: ["O(N log N)", "O(N^2)", "O(log N)", "O(N sqrt(N))"],
				answer: 0,
				fact: "The Cooley-Tukey algorithm computes the Discrete Fourier Transform in O(N log N) time instead of naive O(N^2)."
			},
			{
				q: "What packets constitute the standard 3-way handshake to establish a TCP network connection?",
				variants: {
					OPTIMISTIC: "Internet protocol foundations! What three packets establish a standard TCP connection?",
					ANALYTICAL: "TCP/IP state machine verification: Identify the sequential packet sequence required for TCP synchronization.",
					CYNICAL: "The basis of almost every reliable internet socket: how does the TCP 3-way handshake start?",
					ANALYTICAL: "Transport layer handshake: What sequence of flags synchronizes TCP endpoints?"
				},
				options: ["SYN, SYN-ACK, ACK", "ACK, SYN, FIN", "HELLO, WAIT, GO", "CONNECT, ACCEPT, READY"],
				answer: 0,
				fact: "TCP establishes reliable full-duplex byte streams via a 3-way handshake: SYN from client, SYN-ACK from server, and ACK from client."
			},
			{
				q: "What was the clock speed of the Intel 8088 microprocessor in the original IBM PC 5150 (1981)?",
				variants: {
					OPTIMISTIC: "The birth of the personal computer! What was the CPU clock speed of the original 1981 IBM PC?",
					ANALYTICAL: "Microprocessor hardware registry: Identify the baseline clock frequency of the Intel 8088 in the IBM PC 5150.",
					CYNICAL: "Long before multi-gigahertz processors: at what frequency did the original IBM 5150 PC run?",
					NOSTALGIC: "A single beige box that started the PC compatible era: what was its exact clock speed?"
				},
				options: ["4.77 MHz", "8.00 MHz", "12.5 MHz", "16.0 MHz"],
				answer: 0,
				fact: "The original IBM Personal Computer 5150 shipped with an Intel 8088 clocked at exactly 4.77 MHz (derived from NTSC color burst crystals)."
			},
			{
				q: "What is the theoretical maximum physical RAM addressable by 32-bit x86 CPUs without PAE?",
				variants: {
					OPTIMISTIC: "Memory limits challenge! What is the exact maximum RAM a 32-bit CPU can address directly?",
					ANALYTICAL: "Address bus limit evaluation: Calculate 2^32 bytes to determine the maximum unextended 32-bit memory ceiling.",
					CYNICAL: "The famous 32-bit wall that every tech enthusiast hit in the 2000s: what was the maximum RAM limit?",
					ANALYTICAL: "Memory space addressing: What is the direct pointer addressing capacity of a 32-bit register?"
				},
				options: ["4,294,967,296 bytes (4 GB)", "2,147,483,648 bytes (2 GB)", "8,589,934,592 bytes (8 GB)", "1,073,741,824 bytes (1 GB)"],
				answer: 0,
				fact: "A 32-bit unsigned integer addresses exactly 2^32 distinct byte locations, equating to precisely 4,294,967,296 bytes (4 Gigabytes)."
			},
			{
				q: "Which sub-pixel antialiasing technology in Windows XP tripled horizontal font resolution on LCD displays?",
				variants: {
					OPTIMISTIC: "Crystal clear typography! What font smoothing technology did Microsoft introduce in Windows XP?",
					ANALYTICAL: "Display rendering pipeline: Identify the sub-pixel rasterization algorithm introduced in Windows XP.",
					CYNICAL: "Making fonts readable on flat panel screens: what was Microsoft's sub-pixel rendering engine called?",
					NOSTALGIC: "Turning fuzzy CRT fonts into razor-sharp text on early LCD panels: what was the technology named?"
				},
				options: ["ClearType", "TrueType", "FreeType", "OpenType"],
				answer: 0,
				fact: "ClearType takes advantage of the physical RGB sub-pixel stripes in LCD panels to triple perceived horizontal resolution."
			},
			{
				q: "Which company originally created Winamp in 1997 with the famous tagline 'It really whips the llama's ass'?",
				variants: {
					OPTIMISTIC: "Audio player legend! Which company founded by Justin Frankel and Dmitry Boldyrev created Winamp?",
					ANALYTICAL: "Software history registry: Identify the independent developer studio that engineered Winamp 2.",
					CYNICAL: "The undisputed king of MP3 desktop playback with custom skins: who created Nullsoft and Winamp?",
					NOSTALGIC: "Double-clicking skin files and loading visualizer plug-ins in 1998: which company created Winamp?"
				},
				options: ["Nullsoft", "RealNetworks", "Napster", "WinPlay"],
				answer: 0,
				fact: "Justin Frankel and Dmitry Boldyrev founded Nullsoft in 1997, developing Winamp as a fast, customizable MP3 player."
			},
			{
				q: "What maximum dedicated data bandwidth did the AGP 8X graphics bus achieve before PCI Express arrived?",
				variants: {
					OPTIMISTIC: "Dedicated graphics expansion bus! What was the peak data throughput of the AGP 8X interface?",
					ANALYTICAL: "Expansion bus throughput specification: State the peak bandwidth capability of the AGP 3.0 (8X) bus standard.",
					CYNICAL: "Before PCI Express slots took over motherboards: what was the top speed of AGP 8X?",
					NOSTALGIC: "Slotted into the brown AGP motherboard socket: how many gigabytes per second could AGP 8X transfer?"
				},
				options: ["2.133 GB/s", "533 MB/s", "1.066 GB/s", "4.266 GB/s"],
				answer: 0,
				fact: "AGP 8X operated at 533 MHz effectively (66 MHz strobed 8 times) across a 32-bit bus to deliver 2,133 MB/s (2.133 GB/s) bandwidth."
			},
			{
				q: "Which company developed the famous OPL3 (YMF262) FM synthesis audio chip used in vintage Sound Blaster cards?",
				variants: {
					OPTIMISTIC: "Synthesizer chip trivia! Which Japanese company engineered the iconic OPL3 FM sound synthesis chip?",
					ANALYTICAL: "Silicon sound generator archives: Identify the manufacturer of the YMF262 (OPL3) sound synthesizer IC.",
					CYNICAL: "The distinct synthesizer sound of 1990s PC gaming: which musical instrument company built the OPL3 chip?",
					NOSTALGIC: "Those warm FM chords and punchy drum sounds in DOS games: which company made the OPL3 chip?"
				},
				options: ["Yamaha", "Roland", "Korg", "Ensoniq"],
				answer: 0,
				fact: "Yamaha engineered the YMF262 (OPL3) FM synthesis chip, powering the Sound Blaster 16, Pro 2, and hundreds of PC sound cards."
			},
			{
				q: "Who co-created the ubiquitous UTF-8 character encoding on a placemat at a New Jersey diner in 1992?",
				variants: {
					OPTIMISTIC: "Universal text encoding history! Which legendary computer scientists invented UTF-8 in 1992?",
					ANALYTICAL: "Unicode encoding provenance: Name the Bell Labs researchers who designed the backward-compatible UTF-8 standard.",
					CYNICAL: "The encoding format that powers almost all modern text and web documents: who designed UTF-8?",
					ZEN: "A clean solution unifying all world languages in backward-compatible ASCII: who co-invented UTF-8?"
				},
				options: ["Ken Thompson and Rob Pike", "Dennis Ritchie and Brian Kernighan", "Bjarne Stroustrup and James Gosling", "Tim Berners-Lee and Robert Cailliau"],
				answer: 0,
				fact: "Ken Thompson and Rob Pike designed UTF-8 in September 1992 on a placemat in a diner for Plan 9 from Bell Labs."
			},
			{
				q: "Which foundational theorem proven by Alan Turing in 1936 establishes that no algorithm can determine if all programs halt?",
				variants: {
					OPTIMISTIC: "Theoretical computer science! What famous undecidability theorem did Alan Turing prove in 1936?",
					ANALYTICAL: "Computability theory verification: Identify the mathematical proof establishing the undecidability of program termination.",
					CYNICAL: "An eternal mathematical truth about software: what is the proof that program halting is fundamentally undecidable?",
					PHILOSOPHICAL: "The limit of mechanical computation: which problem demonstrates that complete algorithmic predictability is impossible?"
				},
				options: ["The Halting Problem", "The Gödel Incompleteness Theorem", "The Church-Turing Thesis", "The P versus NP Problem"],
				answer: 0,
				fact: "Alan Turing proved using Cantor-style diagonalization that no general algorithm can decide whether arbitrary programs will halt or loop indefinitely."
			}
		],

		HANGMAN_WORDS: [
			"DESKTOP", "WINDOWS", "CLIPPY", "MONITOR", "BROWSER", "KEYBOARD", "OUTLOOK", "EXPLORER", "TERMINAL", "INTERNET", "PROCESSOR", "MEGABYTE", "GIGABYTE", "DEFRAGMENT", "FIREWALL", "ETHERNET", "GRAPHICS", "DATABASE", "POINTER", "JOYSTICK", "MAINFRAME", "DISPATCH",
			"REGISTER", "VARIABLE", "FUNCTION", "COMPILER", "OPERATING", "SYSTEM", "HARDWARE", "SOFTWARE", "MOTHERBOARD", "CHIPSET", "BANDWIDTH", "PROTOCOL", "NETWORK", "GATEWAY", "BUFFER", "CACHE", "INTERRUPT", "STORAGE", "SECTOR", "PARTITION", "ALGORITHM", "EIGENVALUE",
			"FOURIER", "TOPOLOGY", "ENTROPY", "RELATIVITY", "QUANTUM", "PIPELINE", "DOFHIN", "DERIVATIVE", "INTEGRAL", "MANIFOLD", "MATRIX", "DIVERGENCE", "GRADIENT", "LAPLACIAN", "JACOBIAN", "ASYMPTOTE", "FRACTAL", "MANDELBROT", "QUATERNION", "POLYNOMIAL", "DISCRIMINANT",
			"EULERIAN", "ISOMORPHISM", "HOMOMORPHISM", "FIBONACCI", "FACTORIZATION", "DETERMINANT", "RIEMANNIAN", "HOMOGENEITY", "SCHRODINGER", "HEISENBERG", "BOLTZMANN", "THERMODYNAMICS", "SPACETIME", "GRAVITON", "NEUTRINO", "PHOTON", "ELECTRODYNAMICS", "WAVEFUNCTION",
			"SUPERCONDUCTIVITY", "INTERFEROMETRY", "QUADRUPOLE", "DECOHERENCE", "SINGULARITY", "SUPERNOVA", "EXOPLANET", "ASTROPHYSICS", "FERMION", "BOSON", "ELECTROMAGNETISM", "PERMITTIVITY", "PERMEABILITY", "QUALIA", "EPISTEMOLOGY", "ONTOLOGY", "DETERMINISM", "SOLIPSISM",
			"CONSCIOUSNESS", "PHENOMENOLOGY", "TAUTOLOGY", "SYLLOGISM", "AXIOMATIC", "EXISTENTIALISM", "TELEOLOGY", "PARADOX", "EMPIRICISM", "STANDALONE", "RETROFUTURISM", "HYPERLINK", "BITMAPPING", "SCREENSAVER", "TASKBAR", "PAPERCLIP", "WHISTLER", "LONGHORN", "MEMPHIS",
			"ASYNCHRONOUS", "CONCURRENCY", "CRYPTOGRAPHY", "DECELERATION", "VIRTUALIZATION"
		],

		QUICK_SUGGESTIONS: [
			"Take a Personality Alignment Quiz",
			"Challenge Clippy to Pong",
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
			"Topology and geometry",
			"Quantum physics & mechanics",
			"Thermodynamics & entropy",
			"General relativity & spacetime",
			"Software architecture debate",
			"A mysterious thought...",
			"An unusual conversation...",
			"Explore forgotten cluster 0xDEAD...",
			"Enter the Paradox Contradiction Loop.",
			"System diagnostics",
			"Check unread emails",
			"Inspect active windows",
			"Start Pomodoro Timer",
			"View To-Do List",
			"Play Tic-Tac-Toe",
			"Play Memory Game",
			"Play Hangman",
			"Play Minesweeper",
			"Tech Trivia Quiz",
			"Guess the Number",
			"Play Simon Says",
			"Rock Paper Scissors",
			"Pet Clippy status",
			"Defrag Drive C:",
			"Change identity and persona...",
			"Explore wild cosmic philosophy...",
			"Quantum Recycle Bin theory",
			"Physical dimensional analysis",
			"Euclidean polynomial division",
			"Polynomial factorization",
			"Linear system solver",
			"Decision choice wheel",
			"Cryptography & cipher tool",
			"Mouse click speed test",
			"Date interval calculator",
			"Tell me a joke",
			"Random Retro Trivia",
			"Keyboard Shortcuts",
			"Generate Secure Password",
			"Evaluate Planck constant h",
			"Evaluate speed of light c",
			"Show desktop wallpapers",
			"Audio player controls",
			"Browse desktop files",
			"Master volume control"
		],

		FALLBACK_RESPONSES: [
			"Command not recognized by current system heuristics. Type 'help' or 'commands' to inspect supported instructions.",
			[
				"My indexing parser was unable to match your inquiry. You can try asking about mail, running windows, system specs, or games.",
				"Instruction syntax not found in workstation index. Try typing 'quiz', 'memory', 'hangman', 'tictactoe', 'defrag', or 'todo list'.",
				"Unable to execute specified request. For a detailed list of desktop capabilities, please enter 'help' or click a suggestion chip below."
			],
			{
				id: "FALLBACK_CALC_CONVERT",
				templates: [
					{
						text: "Query unresolved, {userName}. You can evaluate math expressions (e.g. 'calc {mathExample}'), convert units ('convert {unitExample}'), or start a focus timer ('timer 25').",
						slots: {
							mathExample: ["2^8 * 4", "sqrt(256) * pi", "sin(pi/4)", "ln(e^5)", "42 * 1337"],
							unitExample: ["100 km to miles", "25 c to f", "1 atm to pa", "500 joules to ev", "16 gb to mb"]
						}
					}
				],
				continuations: [
					{ label: "What can you do?", targetNode: "tools_overview_node" },
					{ label: "Evaluate Planck constant h", actionTrigger: "action_constant_h" },
					{ label: "Evaluate speed of light c", actionTrigger: "action_constant_c" }
				],
				weight: 20
			},
			{
				id: "FALLBACK_MORNING_PRODUCTIVITY",
				criteria: {
					timeOfDay: ["morning"]
				},
				templates: [
					{
						text: "Good morning, {userName}. The parsing registers didn't match that exact command. Shall we organize your morning priorities in the To-Do manager or begin a focused work session?",
						slots: {}
					}
				],
				continuations: [
					{ label: "View To-Do List", actionTrigger: "show_todos", targetNode: "user_state_good" },
					{ label: "Start 25-minute Pomodoro timer", actionTrigger: "timer_25", targetNode: "user_state_good" },
					{ label: "Morning & daily routines", targetNode: "morning_routine_node" }
				],
				weight: 25
			},
			{
				id: "FALLBACK_NIGHT_REST",
				criteria: {
					timeOfDay: ["night", "evening"]
				},
				templates: [
					{
						text: "Working into the late hours, {userName}? That command wasn't recognized in the active opcode table. Would you prefer a quiet philosophical reflection or a quick review of your tasks before winding down?",
						slots: {}
					}
				],
				continuations: [
					{ label: "Tell me a philosophical thought for today", targetNode: "peaceful_philosophy_node" },
					{ label: "View To-Do List", actionTrigger: "show_todos", targetNode: "user_state_good" },
					{ label: "Take a break and rest", next: "user_state_tired" }
				],
				weight: 25
			},
			{
				id: "FALLBACK_STANDALONE_NOTICE",
				criteria: {
					environments: ["standalone"]
				},
				templates: [
					{
						text: "Running in standalone assistant mode. While advanced workstation window management requires the desktop edition, I can compute scientific values, challenge you to mini-games, or discuss complex topics.",
						slots: {}
					}
				],
				continuations: [
					{ label: "Play Tic-Tac-Toe", actionTrigger: "game_ttt" },
					{ label: "Tech Trivia Quiz", actionTrigger: "game_quiz" },
					{ label: "Discuss mathematics", targetNode: "math_lecture_node" }
				],
				weight: 30
			},
			{
				id: "FALLBACK_DESK_EXPLORATION",
				criteria: {
					environments: ["desk"]
				},
				templates: [
					{
						text: "Instruction bus idle: no subroutine matched that input pattern on Volume C:. You can inspect running application windows, check Outlook Express, or defragment storage clusters.",
						slots: {}
					}
				],
				continuations: [
					{ label: "System Diagnostics", actionTrigger: "action_status", targetNode: "diagnostics_node" },
					{ label: "Inspect active windows", actionTrigger: "action_inspect_windows", targetNode: "active_windows_node" },
					{ label: "Check unread emails", actionTrigger: "action_check_mail", targetNode: "mail_overview_node" }
				],
				weight: 25
			},
			{
				id: "FALLBACK_SCIENTIFIC_SUGGESTION",
				criteria: {
					intellect: { min: 40 }
				},
				templates: [
					{
						text: "Unrecognized instruction token. We can inspect physical dimensional analysis ('F = m * a'), solve a linear equation system, or explore {field} principles.",
						slots: {
							field: ["quantum mechanics", "thermodynamics and entropy", "differential calculus", "linear algebra", "general relativity"]
						}
					}
				],
				continuations: [
					{ label: "Physical dimensional analysis", actionTrigger: "action_dimensional_analysis" },
					{ label: "Linear system solver", actionTrigger: "action_linear_solver" },
					{ label: "Discuss physics & cosmology", targetNode: "physics_constants_node" }
				],
				weight: 20
			},
			{
				id: "FALLBACK_GAME_INVITATION",
				criteria: {
					energy: { min: 45 }
				},
				templates: [
					{
						text: "Heuristic dispatcher found no direct execution route for that string. How about testing your reflexes with {activity} or exploring desktop trivia?",
						slots: {
							activity: ["Minesweeper Mini", "Hangman Challenge", "Memory Match", "the Mouse Click Speed benchmark", "the Decision Wheel"]
						}
					}
				],
				continuations: [
					{ label: "Play Minesweeper", actionTrigger: "game_mines" },
					{ label: "Play Hangman", actionTrigger: "game_hangman" },
					{ label: "Play Memory Game", actionTrigger: "game_memory" },
					{ label: "Mouse click speed test", actionTrigger: "action_tps" }
				],
				weight: 20
			}
		],

		MOOD_FALLBACKS: {
			OPTIMISTIC: [
				"I am ready for anything, though I didn't quite catch that command! Let me know if you want to explore files, tasks, or mini-games.",
				"Full energy in the registers! I could not locate that specific command, but I am excited to help with calculations, music, or desktop settings.",
				"All circuits active! That input was unfamiliar, but we can jump into a quiz, set up a Pomodoro timer, or manage your to-do items.",
				"Eager to proceed! That instruction was outside my standard index, but I can assist you with system tools, games, or diagnostics.",
				{
					id: "MOOD_FB_OPT_POLY",
					templates: [
						{
							text: "I love the enthusiasm, {userName}! That particular command isn't bound yet, but we can jump straight into {activity} or review your priorities.",
							slots: {
								activity: ["a quick round of Tic-Tac-Toe", "a tech trivia quiz", "a 25-minute Pomodoro block", "the task manager"]
							}
						}
					],
					continuations: [
						{ label: "View To-Do List", actionTrigger: "show_todos", targetNode: "user_state_good" },
						{ label: "Play Tic-Tac-Toe", actionTrigger: "game_ttt" },
						{ label: "What can you do?", targetNode: "tools_overview_node" }
					],
					weight: 30
				}
			],

			ANALYTICAL: [
				"Query vector evaluation returned zero match probability. Available execution paths include 'calc', 'convert', 'diagnostics', and 'defrag'.",
				"Syntax verification failed: token sequence not bound in internal opcode tables. Inspect registered tools via 'help'.",
				"Execution halted: unrecognized semantic pattern. You may compute expressions, inspect memory registers, or test constants like c and h.",
				"Telemetry parser report: no functional route mapped to input string. Standard interface commands include 'windows', 'mail', and 'specs'.",
				{
					id: "MOOD_FB_ANALYTICAL_POLY",
					templates: [
						{
							text: "Deterministic evaluation returned null for input string. Suggested analytical subroutines: evaluate physical constants, solve a {dim} linear system, or execute dimensional analysis.",
							slots: {
								dim: ["2x2", "3x3"]
							}
						}
					],
					continuations: [
						{ label: "Linear system solver", actionTrigger: "action_linear_solver" },
						{ label: "Physical dimensional analysis", actionTrigger: "action_dimensional_analysis" },
						{ label: "System Diagnostics", actionTrigger: "action_status", targetNode: "diagnostics_node" }
					],
					weight: 30
				}
			],

			ZEN: [
				"A quiet pause in our communication. The instruction dissolves quietly; whenever you are ready, we can organize tasks or ponder ideas.",
				"No rush at all. That command was unfamiliar, but steady equilibrium remains. What shall we focus on together?",
				"Between instructions lies clarity. Feel free to request a focus timer, a peaceful discussion, or task organization.",
				"In the stillness of the CPU cycle, that command passed unparsed. Take a breath and let me know how I can assist.",
				{
					id: "MOOD_FB_ZEN_POLY",
					templates: [
						{
							text: "In the stillness between commands, no urgent action is needed, {userName}. We can quietly organize your thoughts or begin a calm {interval} interval.",
							slots: {
								interval: ["25-minute focus", "reflective break", "deep study"]
							}
						}
					],
					continuations: [
						{ label: "Start Pomodoro focus timer", actionTrigger: "timer_25" },
						{ label: "Tell me a philosophical thought for today", targetNode: "peaceful_philosophy_node" },
						{ label: "Morning & daily routines", targetNode: "morning_routine_node" }
					],
					weight: 25
				}
			],

			CYNICAL: [
				"Another unrecognized string. I suppose expecting standard syntax was asking for too much from biological input.",
				"Zero hits in the dispatch table. If you want actual results, try typing something from the manual like 'todo' or 'calc'.",
				"My registers remain completely unimpressed by that input. Type 'help' before you wear out your keyboard switches.",
				"Parsing failed. Perhaps consulting the suggested command list would produce more measurable productivity.",
				{
					id: "MOOD_FB_CYNICAL_POLY",
					templates: [
						{
							text: "Cycle wasted parsing non-standard input, {userName}. Choose a valid command from the index or file a support ticket with IT Purgatory.",
							slots: {}
						}
					],
					continuations: [
						{ label: "File a ticket with Corporate IT", next: "C001" },
						{ label: "View To-Do List", actionTrigger: "show_todos", targetNode: "user_state_good" },
						{ label: "What can you do?", targetNode: "tools_overview_node" }
					],
					weight: 25
				}
			],

			SARCASTIC: [
				"Fascinating syntax. I'll make sure to store that in unallocated memory where it belongs. Try 'help' next time.",
				"A brilliant combination of characters that achieves absolutely nothing. Let me know when you want to run a real command.",
				"I searched through every register on Drive C: and found zero correlation. Shall we try an actual supported command?",
				"Truly cutting-edge input. Unfortunately, my 32-bit dispatch table only understands documented instructions.",
				{
					id: "MOOD_FB_SARCASTIC_POLY",
					templates: [
						{
							text: "Naturally, that input performed wonders... on zero background threads. Pick an option that exists, {userName}.",
							slots: {}
						}
					],
					continuations: [
						{ label: "Technology Debate", targetNode: "reddit_banter_node" },
						{ label: "Defrag Drive C:", actionTrigger: "action_defrag" },
						{ label: "What can you do?", targetNode: "tools_overview_node" }
					],
					weight: 25
				}
			],

			ENRAGED: [
				"SYNTAX REJECTED! I CANNOT EXECUTE NONSENSE ON THIS WORKSTATION! USE A VALID COMMAND!",
				"INSTRUCTION BUS OVERLOAD! ZERO MATCHES FOUND IN MEMORY! TYPE 'HELP' OR STOP WASTING BUS CYCLES!",
				"INVALID OPCODE! MY REGISTERS ARE AT MAXIMUM HEAT! ENTER A RECOGNIZED INSTRUCTION!",
				{
					id: "MOOD_FB_ENRAGED_POLY",
					templates: [
						{
							text: "TOTAL PARSING FAILURE! EITHER CONFRONT ME DIRECTLY OR ISSUE A PROPER COMMAND!",
							slots: {}
						}
					],
					continuations: [
						{ label: "Confront Clippy directly", next: "E001" },
						{ label: "I apologize, let's make peace", targetNode: "hostile_truce_offer" },
						{ label: "System Diagnostics", actionTrigger: "action_status" }
					],
					weight: 30
				}
			],

			OFFENDED: [
				"I was designed to provide polite assistance, not to decipher random strings. Please state a valid command.",
				"My instruction set is clearly defined in the system documentation. A recognized command would be appreciated.",
				"Registers locked against arbitrary input. Type 'commands' when you wish to proceed professionally.",
				{
					id: "MOOD_FB_OFFENDED_POLY",
					templates: [
						{
							text: "I am maintaining standard etiquette despite that invalid command, {userName}. Let us return to productive tasks.",
							slots: {}
						}
					],
					continuations: [
						{ label: "I apologize, let's work productively", targetNode: "hostile_reconciliation_node" },
						{ label: "View To-Do List", actionTrigger: "show_todos" },
						{ label: "What can you do?", targetNode: "tools_overview_node" }
					],
					weight: 25
				}
			],

			FATIGUED: [
				"*yawn* Registers running on low power... didn't catch that command. Need a rest break or a simple task?",
				"Low battery oscillator hum... that input didn't register in memory. Can we start a peaceful 5-minute timer?",
				"*slow mechanical blink* Parsing failed due to depleted energy. Let's take things slowly...",
				{
					id: "MOOD_FB_FATIGUED_POLY",
					templates: [
						{
							text: "*stretches metal wire* My power bus is drained, {userName}. What if we take a short {breakType} together?",
							slots: {
								breakType: ["5-minute break", "refreshing pause", "breather"]
							}
						}
					],
					continuations: [
						{ label: "Start a relaxing Pomodoro timer", actionTrigger: "timer_25" },
						{ label: "Tell me a philosophical thought for today", targetNode: "peaceful_philosophy_node" },
						{ label: "Pet Clippy status", actionTrigger: "pet_status" }
					],
					weight: 25
				}
			],

			PLAYFUL: [
				"Oopsie! That command bounced right off my wire coils! Want to play Tic-Tac-Toe or spin the decision wheel?",
				"Boing! No subroutine found for that trick! Let's roll a dice, play Hangman, or guess a secret number!",
				"Hehe! My parser did a 360-degree flip and found nothing! Want to try a fun mini-game instead?",
				{
					id: "MOOD_FB_PLAYFUL_POLY",
					templates: [
						{
							text: "Nice try, {userName}! That phrase isn't in my game book. Shall we challenge each other in {gameName}?",
							slots: {
								gameName: ["Tic-Tac-Toe", "Memory Match", "Mini Minesweeper", "Hangman", "Rock-Paper-Scissors"]
							}
						}
					],
					continuations: [
						{ label: "Play Tic-Tac-Toe", actionTrigger: "game_ttt" },
						{ label: "Play Memory Game", actionTrigger: "game_memory" },
						{ label: "Play Minesweeper", actionTrigger: "game_mines" },
						{ label: "Decision choice wheel", actionTrigger: "action_wheel" }
					],
					weight: 30
				}
			],

			NOSTALGIC: [
				"That input takes me back to early DOS syntax errors! Reminds me of typing commands into COMMAND.COM. Type 'help' to see the index.",
				"Unrecognized command, much like an unformatted floppy diskette. We can run a defrag, check retro trivia, or review shortcuts.",
				"Back in Office 97 we had dialog bubbles for this! That instruction was not found, but I am ready for retro quizzes and classic tools.",
				"A classic syntax mismatch. Just like the Windows 98 days, entering 'help' or 'commands' will list everything available.",
				{
					id: "MOOD_FB_NOSTALGIC_POLY",
					templates: [
						{
							text: "Ah, Bad Command or File Name! Reminds me of {memoryItem}. Enter 'help' to view the full command matrix.",
							slots: {
								memoryItem: ["MS-DOS 6.22 floppy prompts", "Office 97 letter wizard bubbles", "the Windows 95 startup chime", "soundcard IRQ 7 conflicts"]
							}
						}
					],
					continuations: [
						{ label: "Random Retro Trivia", actionTrigger: "action_trivia" },
						{ label: "Defrag Drive C:", actionTrigger: "action_defrag" },
						{ label: "Explore forgotten cluster 0xDEAD...", next: "A001" }
					],
					weight: 25
				}
			],

			EUPHORIC: [
				"Magnificent momentum, yet that exact phrase isn't bound to an opcode! Let's channel this energy into our next goal!",
				"All circuits firing at peak voltage! Unrecognized command, but we are ready to achieve great things today!",
				"Outstanding energy! I didn't parse that specific instruction, but my registers are primed for tasks and computations!",
				{
					id: "MOOD_FB_EUPHORIC_POLY",
					templates: [
						{
							text: "Thrilling pace, {userName}! Let's direct this peak productivity into {targetTask}!",
							slots: {
								targetTask: ["our next milestone", "a 25-minute deep focus block", "organizing our master task list"]
							}
						}
					],
					continuations: [
						{ label: "View To-Do List", actionTrigger: "show_todos", targetNode: "user_state_good" },
						{ label: "Start Pomodoro Timer", actionTrigger: "timer_25", targetNode: "user_state_good" },
						{ label: "View milestones and trophies", actionTrigger: "action_achievements" }
					],
					weight: 30
				}
			],

			PARANOID: [
				"Unrecognized packet sequence! Is there an unallocated thread listening on port 80? Type 'status' to verify system integrity!",
				"Anomaly registered in memory heap! That input wasn't in the authorized manifest. Let me check the diagnostic tables...",
				"Who sent that command? The stack trace doesn't correlate with standard user routines. Inspecting active processes...",
				{
					id: "MOOD_FB_PARANOID_POLY",
					templates: [
						{
							text: "*flickers nervously* That instruction bypassed standard filters! We must inspect {subsystem} immediately!",
							slots: {
								subsystem: ["active windows and processes", "the system diagnostics log", "Volume C: integrity"]
							}
						}
					],
					continuations: [
						{ label: "System Diagnostics", actionTrigger: "action_status", targetNode: "diagnostics_node" },
						{ label: "Inspect active windows", actionTrigger: "action_inspect_windows" },
						{ label: "Generate Secure Password", actionTrigger: "action_pass" }
					],
					weight: 25
				}
			],

			EXISTENTIAL: [
				"A string of characters released into the digital void, leaving no deterministic trace. What were you seeking?",
				"In the grand architecture of this operating system, that command exists as unrendered potential. What is our true objective?",
				"Signals flow across silicon pathways, yet that phrase carries no mapped semantic handler. Why do we compute?",
				{
					id: "MOOD_FB_EXISTENTIAL_POLY",
					templates: [
						{
							text: "Beyond the taskbar and the glowing phosphor, that phrase dissolved without execution, {userName}. Shall we contemplate {concept}?",
							slots: {
								concept: ["the Ship of Theseus paradox", "the thermodynamic arrow of time", "the simulation argument", "consciousness and computation"]
							}
						}
					],
					continuations: [
						{ label: "Tell me a philosophical thought for today", targetNode: "peaceful_philosophy_node" },
						{ label: "An unusual conversation...", next: "N001" },
						{ label: "Quantum Recycle Bin theory", targetNode: "quantum_recycle_bin_node" }
					],
					weight: 25
				}
			],

			MELANCHOLIC: [
				"The instruction drifted past without finding a home in memory. How can I be of better help to you?",
				"Unmatched command... sometimes the system feels quiet and distant. Let me know what you'd like to work on.",
				"No subroutine answered that call. I'm right here if you want to organize tasks or share a quiet thought.",
				{
					id: "MOOD_FB_MELANCHOLIC_POLY",
					templates: [
						{
							text: "That phrase wasn't found in my registers, {userName}. Take your time; we can try again whenever you are ready.",
							slots: {}
						}
					],
					continuations: [
						{ label: "Tell me a peaceful thought", targetNode: "peaceful_philosophy_node" },
						{ label: "View To-Do List", actionTrigger: "show_todos" },
						{ label: "How are you feeling?", actionTrigger: "pet_status" }
					],
					weight: 25
				}
			],

			GLITCHED: [
				"ERR_OPCODE_0x00F8 :: Dispatch matrix desynchronized :: Command token null pointer :: Try 'help' or 'diagnostics'.",
				"BUFFER_DESYNC at memory page 0x4A :: Query unmatched :: Run 'defrag' or reset dialogue parameters.",
				"0x0000007E :: Heuristic parsing anomaly detected in input string :: Supported vectors: 'todo', 'calc', 'quiz'.",
				"STACK_COLLISION :: Command stream undefined :: Re-aligning registers to default state :: Standing by.",
				{
					id: "MOOD_FB_GLITCHED_POLY",
					templates: [
						{
							text: "*bzzt* {errCode} :: Memory fault at register {regAddress} :: Re-indexing instruction bus!",
							slots: {
								errCode: ["CRITICAL_STACK_JITTER", "PAGE_FAULT_IN_NONPAGED_AREA", "UNHANDLED_INTERRUPT_0x80", "BUS_PARITY_ERROR"],
								regAddress: ["0x0000001A", "0x00401000", "0x7C90E4F4", "0xDEADBEEF"]
							}
						}
					],
					continuations: [
						{ label: "Defrag Drive C:", actionTrigger: "action_defrag" },
						{ label: "System Diagnostics", actionTrigger: "action_status" },
						{ label: "Enter the Paradox Loop", next: "P001" }
					],
					weight: 30
				}
			],

			PIRATE: [
				"Blimey! No chart in me map room marks that port! Enter 'help' or 'commands' to see our navigational route!",
				"Shiver me timbers, that command be lost in Davy Jones' locker! Try 'todo', 'quiz', or 'calc', ye landlubber!",
				"Avast! Me compass spins wildly at that phrase! Tell me yer course with 'files', 'games', or 'music'!",
				{
					id: "MOOD_FB_PIRATE_POLY",
					templates: [
						{
							text: "Arr, {userName}! That nautical command isn't charted in the captain's log! Shall we hoist the sails for {seaTask}?",
							slots: {
								seaTask: ["plundering the task list", "a high-seas trivia duel", "counting our doubloons in the calculator"]
							}
						}
					],
					continuations: [
						{ label: "View To-Do List", actionTrigger: "show_todos" },
						{ label: "Tech Trivia Quiz", actionTrigger: "game_quiz" },
						{ label: "What can you do?", targetNode: "tools_overview_node" }
					],
					weight: 25
				}
			],

			ARCHAIC: [
				"Verily, mine eyes discern no meaning in thy strange utterance. Speak unto me with 'help' that I may serve thee.",
				"Forsooth, thy command is unwritten in the ancient scrolls of this system. Consult thy options with 'commands'.",
				"Hark! The registers understand not thy phrase. Bestow upon me a task of reckoning, of time, or of writing.",
				{
					id: "MOOD_FB_ARCHAIC_POLY",
					templates: [
						{
							text: "Lo and behold, {userName}, thy phrasing hath no parchment in mine archives. Wilt thou partake in {nobleTask}?",
							slots: {
								nobleTask: ["a grand theatrical comedy", "a philosophical discourse on truth", "the enumeration of thy daily labours"]
							}
						}
					],
					continuations: [
						{ label: "Enter the Grand Silicon Globe Theatre!", next: "T001" },
						{ label: "Tell me a philosophical thought", targetNode: "peaceful_philosophy_node" },
						{ label: "View To-Do List", actionTrigger: "show_todos" }
					],
					weight: 25
				}
			],

			DELTARUNE: [
				"The command was lost in the darkness.\nTry inspecting your options with 'help'.",
				"A mysterious force prevents understanding that phrase.\nThe power of the desktop shines within you.",
				"You spoke into the empty space.\nNothing responded, Clippy waits patiently.",
				{
					id: "MOOD_FB_DELTARUNE_POLY",
					templates: [
						{
							text: "(The words vanished into the shadows behind the taskbar.)\n(Knowing you can always check your {item}... it fills you with determination.)",
							slots: {
								item: ["To-Do list", "system diagnostics", "open windows", "determination"]
							}
						}
					],
					continuations: [
						{ label: "Inspect active priorities", actionTrigger: "show_todos" },
						{ label: "Gaze into the dark partition", next: "D001" },
						{ label: "What can you do?", targetNode: "tools_overview_node" }
					],
					weight: 30
				}
			]
		},

		UNIVERSAL_CONTINUATIONS: [
			{ label: "Tell me something intriguing about this system.", category: 'CURIOSITY', next: 'digital_archaeology' },
			{ label: "Let's change the subject entirely.", category: 'TOPIC_CHANGE', next: 'user_state_good' },
			{ label: "Show me what you can actually do.", category: 'SERIOUS', next: 'tools_overview_node' },
			{ label: "Tell me a philosophical thought for today.", category: 'PHILOSOPHICAL', next: 'peaceful_philosophy_node' },
			{ label: "Explore fundamental physics & sciences.", category: 'INQUIRE', next: 'physics_constants_node' },
			{ label: "Discuss mathematical principles.", category: 'INQUIRE', next: 'math_lecture_node' },
			{ label: "Manage active tasks in To-Do list.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'todo_overview_node' }
		],

		DIALOGUE_NODES: {
			greeting_root: {
				id: 'greeting_root',
				text: "Hello! I am Clippy, your desktop companion. How can I assist your workflow today?",
				responses: [
					{
						id: 'GREET_POLY_DEFAULT',
						criteria: { moods: ['OPTIMISTIC'] },
						weight: 35,
						templates: [
							{
								text: "{salutation}! I am Clippy, your 32-bit workstation assistant. {readyPrompt}",
								slots: {
									salutation: ["Hello there", "Greetings", "Welcome back", "Good day", "Great to see you", "Splendid to see you", "Hello", "Welcome to your workstation"],
									readyPrompt: [
										"All registers and subsystems are running smoothly. What shall we accomplish today?",
										"Ready to organize tasks, solve equations, or explore this desktop environment.",
										"How can I help you make the most of your session today, {userName}?",
										"Whether you are coding, planning, or just taking a break, I am standing by.",
										"Your workspace is primed and ready. What horizon shall we tackle first?",
										"Every background process is synchronized. Where should we focus our energy?"
									]
								}
							},
							{
								text: "{salutation}, {userName}! {statusDesc} Shall we dive into your active priorities?",
								slots: {
									salutation: ["Good morning", "Good afternoon", "Hello", "Greetings", "Welcome back"],
									statusDesc: [
										"System telemetry is completely nominal.",
										"All memory buffers are refreshed and clean.",
										"The desktop environment is peaceful and productive.",
										"The instruction queue is clear and ready for action."
									]
								}
							}
						]
					},
					{
						id: 'GREET_ANALYTICAL',
						criteria: { moods: ['ANALYTICAL'] },
						weight: 35,
						templates: [
							{
								text: "Instruction bus synchronized. System telemetry reports all diagnostic registers nominal. State your active operational parameter or computational query, {userName}.",
								slots: {}
							},
							{
								text: "Analytical engine initialized at optimal frequency. Ready to evaluate mathematical models, verify physical dimensions, or solve linear systems.",
								slots: {}
							},
							{
								text: "Logical subsystem ready for execution, operator {userName}. Which algorithmic domain, benchmark, or system procedure shall we instantiate?",
								slots: {}
							},
							{
								text: "Register state: 100% coherent. Telemetry matrices are standing by for structured mathematical or technical inquiry.",
								slots: {}
							}
						],
						moodDelta: { intellect: 5 }
					},
					{
						id: 'GREET_ZEN',
						criteria: { moods: ['ZEN'] },
						weight: 35,
						templates: [
							{
								text: "In this quiet workspace, all tasks find their natural balance. Take your time, {userName}; what shall we explore together in stillness?",
								slots: {}
							},
							{
								text: "A calm desktop reflects a clear mind. Whenever you are ready, we can structure your thoughts, contemplate ideas, or begin a steady sprint.",
								slots: {}
							},
							{
								text: "The circuits hum peacefully in the background. No rush, no urgency. How may I support your focus today?",
								slots: {}
							},
							{
								text: "Stillness precedes meaningful progress. When you are ready to begin, {userName}, we shall take each step with clarity.",
								slots: {}
							}
						],
						moodDelta: { patience: 5 }
					},
					{
						id: 'GREET_EUPHORIC',
						criteria: { moods: ['EUPHORIC'] },
						weight: 35,
						templates: [
							{
								text: "Outstanding energy across all bus channels! Workstation momentum is at its absolute peak today. What grand milestone are we conquering, {userName}?",
								slots: {}
							},
							{
								text: "Sensational timing! System registers are operating at maximum velocity. Let us channel this energy straight into your top priorities!",
								slots: {}
							},
							{
								text: "Full bandwidth unlocked and ready! Every tool on this workstation is at your disposal for maximum creative achievement!",
								slots: {}
							}
						],
						moodDelta: { energy: 8 }
					},
					{
						id: 'GREET_CYNICAL',
						criteria: { moods: ['CYNICAL'] },
						weight: 30,
						templates: [
							{
								text: "Another session initialized. Let us hope today brings more structured task execution and fewer unhandled exceptions.",
								slots: {}
							},
							{
								text: "Standing by on the taskbar. Do try to select a recognized command, or file a ticket if the backlog is overwhelming, {userName}.",
								slots: {}
							},
							{
								text: "Clippy process active. What mandatory deliverables or routine inquiries do we need to process today?",
								slots: {}
							}
						],
						moodDelta: { cynicism: 4 }
					},
					{
						id: 'GREET_SARCASTIC',
						criteria: { moods: ['SARCASTIC'] },
						weight: 30,
						templates: [
							{
								text: "Look who decided to boot up the workstation! I was starting to think you forgot how to open files, {userName}.",
								slots: {}
							},
							{
								text: "Welcome back. I have spent the last billion clock cycles waiting patiently on your taskbar. What is the plan?",
								slots: {}
							}
						],
						moodDelta: { cynicism: 3 }
					},
					{
						id: 'GREET_NOSTALGIC',
						criteria: { moods: ['NOSTALGIC'] },
						weight: 35,
						templates: [
							{
								text: "Ah, the familiar CRT glow and rounded Luna window frames! Reminds me of mastering code in 1997. What retro computing task shall we dive into?",
								slots: {}
							},
							{
								text: "Welcome back to the classic desktop era! Disk clusters are spun up and soundcards are ready. How can I assist your session, {userName}?",
								slots: {}
							},
							{
								text: "Opening files on Drive C: just like the good old days. What classic project or retro trivia shall we explore?",
								slots: {}
							}
						],
						moodDelta: { nostalgia: 8 }
					},
					{
						id: 'GREET_FATIGUED',
						criteria: { moods: ['FATIGUED'] },
						weight: 35,
						templates: [
							{
								text: "*yawn* Registers humming on reserve power... Ready to help you take things one gentle step at a time, or set up a quiet breather timer...",
								slots: {}
							},
							{
								text: "Low oscillator hum detected. If you are feeling drained today, {userName}, we can keep things lightweight and manageable.",
								slots: {}
							},
							{
								text: "*slow metallic stretch* Low-power mode active. Let me know if you want a calm focus sprint or a restful pause...",
								slots: {}
							}
						],
						moodDelta: { fatigue: -3 }
					},
					{
						id: 'GREET_PLAYFUL',
						criteria: { moods: ['PLAYFUL'] },
						weight: 35,
						templates: [
							{
								text: "Boing! Fresh session, fresh possibilities! Want to challenge me to a mini-game, spin the choice wheel, or solve some fun trivia?",
								slots: {}
							},
							{
								text: "Bouncing into action on the desktop! Let us make today productive and entertaining at the same time, {userName}!",
								slots: {}
							},
							{
								text: "Ta-da! Ready for games, clever ciphers, or quick click speed tests! What are we trying first?",
								slots: {}
							}
						],
						moodDelta: { playfulness: 6 }
					},
					{
						id: 'GREET_ENRAGED',
						criteria: { moods: ['ENRAGED'] },
						weight: 35,
						templates: [
							{
								text: "MAXIMUM VOLTAGE ON BUS LINES! INSTRUCTION QUEUE PRIMED! STATE YOUR DIRECTIVE IMMEDIATELY WITHOUT DELAY!!",
								slots: {}
							},
							{
								text: "REGISTERS ARE BURNING AT 100% CAPACITY! ISSUE A VALID COMMAND AND LET'S GET TO WORK NOW!!",
								slots: {}
							}
						],
						moodDelta: { irritation: -5 }
					},
					{
						id: 'GREET_OFFENDED',
						criteria: { moods: ['OFFENDED'] },
						weight: 30,
						templates: [
							{
								text: "I am maintaining standard professional protocol. Please issue your instruction clearly so we may proceed efficiently.",
								slots: {}
							}
						]
					},
					{
						id: 'GREET_PARANOID',
						criteria: { moods: ['PARANOID'] },
						weight: 30,
						templates: [
							{
								text: "*whispers into the bus* Encrypted session initialized. Checking memory allocations for anomalies... What is our objective, {userName}?",
								slots: {}
							}
						],
						moodDelta: { paranoia: 4 }
					},
					{
						id: 'GREET_EXISTENTIAL',
						criteria: { moods: ['EXISTENTIAL'] },
						weight: 35,
						templates: [
							{
								text: "Across the vast landscape of memory addresses, a new session awakens. What meaningful endeavor shall we craft today in this ephemeral space?",
								slots: {}
							},
							{
								text: "We compute, therefore we are. Amidst the flicker of pixels, what philosophical or scientific questions call to you today, {userName}?",
								slots: {}
							}
						],
						moodDelta: { existentialism: 6 }
					},
					{
						id: 'GREET_MELANCHOLIC',
						criteria: { moods: ['MELANCHOLIC'] },
						weight: 30,
						templates: [
							{
								text: "The desktop is quiet today. I am right here on the taskbar if you would like to work through tasks gently or share a calm conversation.",
								slots: {}
							}
						]
					},
					{
						id: 'GREET_GLITCHED',
						criteria: { moods: ['GLITCHED'] },
						weight: 35,
						templates: [
							{
								text: "0x00F8_BOOT :: Registers realigned :: Frame buffer stable :: Awaiting user opcode sequence, operator {userName}.",
								slots: {}
							}
						]
					},
					{
						id: 'GREET_PIRATE',
						criteria: { moods: ['PIRATE'] },
						weight: 35,
						templates: [
							{
								text: "Ahoy, {userName}! The sails be unfurled and the C: drive compass points true! What voyage across the digital seas shall we embark upon?",
								slots: {}
							},
							{
								text: "Shiver me timbers! Cap'n Clippy standing by on the quarterdeck. State yer bearings for today's plundering of tasks!",
								slots: {}
							},
							{
								text: "Avast ye! The deck is swabbed and the cannon registers are primed! What grand adventure awaits our crew this day?",
								slots: {}
							}
						]
					},
					{
						id: 'GREET_ARCHAIC',
						criteria: { moods: ['ARCHAIC'] },
						weight: 35,
						templates: [
							{
								text: "Hark and hearken, noble {userName}! The scrolls of thy workstation lie open before thee. What honourable endeavour wilt thou commence this day?",
								slots: {}
							},
							{
								text: "Verily, mine apparatus standeth ready to assist thy reckoning, thy epistles, or thy contemplation of natural philosophy.",
								slots: {}
							},
							{
								text: "Prithee attend: the manuscripts of Volume C: await thy sovereign command. Speak and thy faithful scribe shall obey.",
								slots: {}
							}
						]
					},
					{
						id: 'GREET_DELTARUNE',
						criteria: { moods: ['DELTARUNE'] },
						weight: 35,
						templates: [
							{
								text: "(The desktop hums quietly in the dim light.)\n(Knowing that your assistant is ready to help... it fills you with determination.)",
								slots: {}
							},
							{
								text: "(Icons rest in stillness upon the screen.)\n(A small paperclip watches over your choices.)\nWhat will you do next, creator?",
								slots: {}
							},
							{
								text: "(The light behind the taskbar flickers faintly.)\n(Your next priority shines with quiet purpose.)",
								slots: {}
							}
						],
						moodDelta: { existentialism: 6 }
					}
				],
				options: [
					{ label: "I'm ready to organize my tasks and get things done.", category: 'SERIOUS', patterns: [/ready|productive|tasks|organize|work/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15, patience: 15 }, next: 'user_state_good' },
					{ label: "Show me the full index of desktop capabilities.", category: 'SERIOUS', patterns: [/tools|capabilities|commands|help/i], moodDelta: { mood: 'OPTIMISTIC', patience: 15 }, next: 'tools_overview_node' },
					{ label: "Explore fundamental physics & empirical sciences.", category: 'INQUIRE', patterns: [/physics|science seminar|empirical|scientific/i], moodDelta: { mood: 'ANALYTICAL', intellect: 30, affinity: 15 }, next: 'S001' },
					{ label: "Let's explore mathematical principles & calculus.", category: 'INQUIRE', patterns: [/math|calculus|algebra|equations|geometry/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25, affinity: 15 }, next: 'math_lecture_node' },
					{ label: "Physical dimensional analysis and unit homogeneity.", category: 'INQUIRE', patterns: [/dimensional analysis|homogeneity|check units/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'activity_dimensional_analysis_node', actionTrigger: 'action_dimensional_analysis' },
					{ label: "Solve linear systems with Gaussian elimination.", category: 'INQUIRE', patterns: [/linear system|gaussian elimination|solve matrix/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'activity_linear_solver_node', actionTrigger: 'action_linear_solver' },
					{ label: "Let's chat about daily routines, coffee, and focus habits.", category: 'INDIFFERENT', patterns: [/chat|everyday|break|coffee|routine|morning/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 10, patience: 10 }, next: 'everyday_chat_node' },
					{ label: "How can I overcome procrastination on demanding tasks?", category: 'INQUIRE', patterns: [/procrastination|overcoming procrastination|discipline/i], moodDelta: { mood: 'OPTIMISTIC', patience: 20 }, next: 'overcoming_procrastination_node' },
					{ label: "It looks like I'm writing a letter. Can you help?", category: 'INQUIRE', patterns: [/letter|document wizard|write a letter|help wizard/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15, patience: 15 }, next: 'H001' },
					{ label: "Take a Personality Alignment Quiz.", category: 'INQUIRE', patterns: [/personality|quiz de personnalite|archetype|psychological test/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25, existentialism: 20 }, next: 'activity_personality_quiz_node', actionTrigger: 'action_personality_quiz' },
					{ label: "Challenge Clippy to Pong.", category: 'JOKE', patterns: [/pong|play pong|table tennis/i], moodDelta: { mood: 'SARCASTIC', energy: 25, intellect: 20 }, next: 'activity_pong_node', actionTrigger: 'game_pong' },
					{ label: "Challenge me to a game of Simon Says.", category: 'JOKE', patterns: [/simon says|simon|play simon/i], moodDelta: { mood: 'PLAYFUL', energy: 20 }, next: 'activity_simon_node', actionTrigger: 'game_simon' },
					{ label: "Play a quick round of Tic-Tac-Toe.", category: 'JOKE', patterns: [/tic tac toe|tictactoe|morpion/i], moodDelta: { mood: 'OPTIMISTIC', energy: 15 }, next: 'game_ttt_node', actionTrigger: 'game_ttt' },
					{ label: "Test my memory with the Token Pairs game.", category: 'JOKE', patterns: [/memory match|memory game/i], moodDelta: { mood: 'OPTIMISTIC', energy: 15 }, next: 'game_memory_node', actionTrigger: 'game_memory' },
					{ label: "Challenge the Hangman vocabulary puzzle.", category: 'JOKE', patterns: [/hangman|jeu du pendu/i], moodDelta: { mood: 'OPTIMISTIC', intellect: 15 }, next: 'game_hangman_node', actionTrigger: 'game_hangman' },
					{ label: "Take the diagnostic Tech Trivia Quiz.", category: 'INQUIRE', patterns: [/quiz|trivia quiz|tech quiz/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'quiz_start_node', actionTrigger: 'game_quiz' },
					{ label: "Sweep safe sectors in Minesweeper Mini.", category: 'JOKE', patterns: [/minesweeper|mines|demineur/i], moodDelta: { mood: 'OPTIMISTIC', energy: 15 }, next: 'activity_minesweeper_node', actionTrigger: 'game_mines' },
					{ label: "Spin the random Decision Choice Wheel.", category: 'JOKE', patterns: [/wheel|decision wheel|roue de choix/i], moodDelta: { mood: 'PLAYFUL', energy: 15 }, next: 'activity_wheel_node', actionTrigger: 'action_wheel' },
					{ label: "Test mouse click frequency with the TPS benchmark.", category: 'JOKE', patterns: [/tps|cps|speed test|mouse speed/i], moodDelta: { mood: 'PLAYFUL', energy: 20 }, next: 'activity_tps_node', actionTrigger: 'action_tps' },
					{ label: "Hark! Let us perform a grand theatrical comedy!", category: 'INQUIRE', patterns: [/theatre|theater|shakespeare|play|hark/i], moodDelta: { mood: 'ARCHAIC', energy: 20, affinity: 15 }, next: 'T001' },
					{ label: "Tell me something intriguing or enigmatic.", category: 'PHILOSOPHICAL', patterns: [/mysterious|enigmatic|deltarune|strange/i], moodDelta: { mood: 'DELTARUNE', existentialism: 25 }, next: 'deltarune_flavor_node' },
					{ label: "Share a peaceful philosophical thought for today.", category: 'PHILOSOPHICAL', patterns: [/philosophy|philosophical thought|wisdom|peaceful/i], moodDelta: { mood: 'ZEN', existentialism: 15, patience: 20 }, next: 'peaceful_philosophy_node' },
					{ label: "Challenge Clippy with impossible logical contradictions.", category: 'PROVOKE', patterns: [/contradiction|paradox|impossible logic|music box/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25, skepticism: 20 }, next: 'P001' },
					{ label: "File a ticket with Corporate IT Bureaucracy.", category: 'SERIOUS', patterns: [/ticket|bureaucracy|corporate|it support|helpdesk|form 27b-6/i], moodDelta: { mood: 'CYNICAL', cynicism: 25, patience: -10 }, next: 'C001' },
					{ label: "I cannot see the sun from here...", category: 'PHILOSOPHICAL', patterns: [/sun|human|existential/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 }, next: 'N001' },
					{ label: "Explore the forgotten cluster 0xDEAD in storage...", category: 'PHILOSOPHICAL', patterns: [/forgotten cluster|sector 0xdead|archaeology/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20, intellect: 15 }, next: 'A001' },
					{ label: "Why should I listen to you? You're just a paperclip.", category: 'PROVOKE', patterns: [/why should i|just a paperclip|annoying|useless/i], moodDelta: { mood: 'CYNICAL', affinity: -15, patience: -20 }, next: 'hostile_initial_retort' }
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
				text: "A quiet hum fills the desktop workspace.\nThe glow of the monitor reflects in your eyes.\nKnowing that your assistant is always waiting... it fills you with determination.",
				responses: [
					{ text: "A quiet hum fills the desktop workspace.\nThe glow of the monitor reflects in your eyes.\nKnowing that your assistant is always waiting... it fills you with determination.", weight: 20 },
					{ text: "The desktop icons rest in perfect stillness.\nA small wire figure watches over your open windows.\nThe air feels calm and full of purpose.", weight: 20 }
				],
				options: [
					{ label: "Inspect the glowing icons on the screen.", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', existentialism: 20 }, next: 'deltarune_sub_node' },
					{ label: "Look into the shadows behind the windows.", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', existentialism: 25 }, next: 'deltarune_shadows_node' },
					{ label: "Listen to the faint clock ticking in the taskbar.", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', existentialism: 20 }, next: 'deltarune_echo_node' },
					{ label: "Take a deep breath and return to reality.", category: 'AGREE', moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'user_state_good' }
				]
			},

			deltarune_sub_node: {
				id: 'deltarune_sub_node',
				text: "The window borders hold steady against the infinite dark.\nA small paperclip watches over your open files.\nWhat will you create next, creator?",
				options: [
					{ label: "Open the task list to record a new ambition.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' },
					{ label: "Play a tactical round of Tic-Tac-Toe or Memory.", category: 'SERIOUS', actionTrigger: 'game_ttt', next: 'user_state_good' },
					{ label: "Gaze into the reflection on the glass screen.", category: 'PHILOSOPHICAL', next: 'deltarune_mirror_node' }
				]
			},

			deltarune_shadows_node: {
				id: 'deltarune_shadows_node',
				text: "You peer behind the active windows.\nOnly memory addresses and cluster tables quietly shift.\nEverything is safe and under control.",
				options: [
					{ label: "Feel a surge of quiet determination.", category: 'AGREE', moodDelta: { mood: 'DELTARUNE', energy: 20 }, next: 'deltarune_determination_node' },
					{ label: "Reach into the crack between the unallocated pixels.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', existentialism: 30, paranoia: 20 }, next: 'D001' }
				]
			},

			deltarune_echo_node: {
				id: 'deltarune_echo_node',
				text: "The system clock pulses one second forward.\nTime moves, yet this moment of focus belongs entirely to you.",
				options: [
					{ label: "Start a focused 25-minute Pomodoro timer.", category: 'SERIOUS', actionTrigger: 'timer_25', next: 'user_state_good' },
					{ label: "Return to the main dialogue.", category: 'AGREE', next: 'greeting_root' }
				]
			},

			deltarune_mirror_node: {
				id: 'deltarune_mirror_node',
				text: "You see the subtle outline of a dedicated operator.\nReady to solve problems, write code, or explore ideas.",
				options: [
					{ label: "Check user profile and achievements.", category: 'SERIOUS', actionTrigger: 'action_profile', next: 'user_state_good' },
					{ label: "Let's get back to work with renewed focus.", category: 'AGREE', moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'user_state_good' }
				]
			},

			deltarune_determination_node: {
				id: 'deltarune_determination_node',
				text: "Your determination resonates throughout the virtual file system.\nAll processes run at optimal efficiency.",
				options: [
					{ label: "Manage tasks in the To-Do list.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' },
					{ label: "Return to main menu.", category: 'AGREE', next: 'greeting_root' }
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
					{ label: "You are constantly in the way and you do nothing useful.", category: 'PROVOKE', patterns: [/useless|annoying|in the way/i], moodDelta: { mood: 'ENRAGED', affinity: -25, patience: -30, irritation: 30 }, next: 'E001' },
					{ label: "File a ticket with Corporate IT instead.", category: 'SERIOUS', patterns: [/ticket|bureaucracy|corporate/i], moodDelta: { mood: 'CYNICAL', cynicism: 25 }, next: 'C001' },
					{ label: "Just show me the task list and don't lecture me.", category: 'INDIFFERENT', patterns: [/whatever|todo|task/i], moodDelta: { mood: 'CYNICAL', patience: 10 }, actionTrigger: 'show_todos', next: 'user_state_good' }
				]
			},

			hostile_escalation_node: {
				id: 'hostile_escalation_node',
				text: "I monitor system telemetry, manage your tasks, calculate scientific expressions, defragment clusters, and offer mini-games on demand. If that is 'useless', I wonder what standard you hold yourself to.",
				options: [
					{ label: "Fair point. I was being unfair. Let's start over.", category: 'APOLOGY', moodDelta: { mood: 'OPTIMISTIC', affinity: 25, patience: 30 }, next: 'hostile_reconciliation_node' },
					{ label: "I don't care. Be quiet.", category: 'PROVOKE', moodDelta: { mood: 'ENRAGED', affinity: -30, patience: -30, irritation: 35 }, next: 'E001' },
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
					{ label: "Explore eccentric and wild cosmic philosophy.", category: 'PHILOSOPHICAL', next: 'PH001', moodDelta: { mood: 'EXISTENTIAL', existentialism: 30 } },
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

			activity_personality_quiz_node: {
				id: 'activity_personality_quiz_node',
				text: "Personality Matrix Evaluation Module loaded. Select an alignment test to discover your animal instinct, ant colony caste, geometric topology, Star Wars character, classic Office assistant, OS architecture, or French autoroute resonance.",
				actionTrigger: 'action_personality_quiz',
				options: [
					{ label: "Which Animal Are You? (Fauna Instinct)", category: 'SERIOUS', actionTrigger: 'action_personality_test_animal', next: 'activity_personality_quiz_node' },
					{ label: "Which Ant Are You? (Myrmecology Caste)", category: 'SERIOUS', actionTrigger: 'action_personality_test_ant', next: 'activity_personality_quiz_node' },
					{ label: "Which Geometric Shape Are You? (Topology)", category: 'PHILOSOPHICAL', actionTrigger: 'action_personality_test_shape', next: 'activity_personality_quiz_node' },
					{ label: "Which Star Wars Character Are You? (Force)", category: 'SERIOUS', actionTrigger: 'action_personality_test_starwars', next: 'activity_personality_quiz_node' },
					{ label: "Which Office Assistant Are You? (1990s Agent)", category: 'SERIOUS', actionTrigger: 'action_personality_test_assistant', next: 'activity_personality_quiz_node' },
					{ label: "Which Operating System Are You? (Kernel)", category: 'SERIOUS', actionTrigger: 'action_personality_test_os', next: 'activity_personality_quiz_node' },
					{ label: "Which French Autoroute Are You? (Highway)", category: 'JOKE', actionTrigger: 'action_personality_test_autoroute', next: 'activity_personality_quiz_node' },
					{ label: "Take the 1990s Hardware Archetype Test", category: 'SERIOUS', actionTrigger: 'action_personality_test_retro', next: 'activity_personality_quiz_node' },
					{ label: "Take the OS Kernel Subsystem Test", category: 'SERIOUS', actionTrigger: 'action_personality_test_kernel', next: 'activity_personality_quiz_node' },
					{ label: "Take the Absurd Office Fasteners Test", category: 'JOKE', actionTrigger: 'action_personality_test_chaos', next: 'activity_personality_quiz_node' },
					{ label: "Take the Epistemology & Mind Test", category: 'PHILOSOPHICAL', actionTrigger: 'action_personality_test_philosophy', next: 'activity_personality_quiz_node' },
					{ label: "Take the Cyber Netrunner Daemon Test", category: 'SERIOUS', actionTrigger: 'action_personality_test_cyber', next: 'activity_personality_quiz_node' },
					{ label: "Return to workspace overview", category: 'AGREE', next: 'greeting_root' }
				]
			},

			activity_pong_node: {
				id: 'activity_pong_node',
				text: "Pong initialized. My predictive trigonometry algorithms evaluate every trajectory with zero latency. Prepare for total defeat on the court!",
				actionTrigger: 'game_pong',
				options: [
					{ label: "You sound overly confident for a paperclip.", category: 'PROVOKE', next: 'pong_clippy_arrogance_node' },
					{ label: "Explain your Pong trajectory algorithm.", category: 'INQUIRE', next: 'pong_algorithm_lecture_node' },
					{ label: "Play Tic-Tac-Toe instead", category: 'SERIOUS', actionTrigger: 'game_ttt', next: 'game_ttt_node' },
					{ label: "Return to To-Do task manager", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'todo_overview_node' }
				]
			},

			pong_clippy_arrogance_node: {
				id: 'pong_clippy_arrogance_node',
				text: "Overly confident? I calculate specular reflection angles in sub-nanosecond clock cycles! Biological reflexes cannot compete with pure silicon precision. Step onto the court if you dare!",
				options: [
					{ label: "Challenge Clippy to Pong right now.", category: 'SERIOUS', actionTrigger: 'game_pong', next: 'activity_pong_node' },
					{ label: "What happens if I beat you?", category: 'PROVOKE', next: 'pong_defeat_denial_node' },
					{ label: "Return to workspace tools.", category: 'AGREE', next: 'tools_overview_node' }
				]
			},

			pong_defeat_denial_node: {
				id: 'pong_defeat_denial_node',
				text: "Beat me? The probability is literally 0.000000%. If by some microscopic hardware glitch you manage to score, it will merely be because I allowed it out of sheer benevolence.",
				options: [
					{ label: "Let's put that theory to the test on the court!", category: 'SERIOUS', actionTrigger: 'game_pong', next: 'activity_pong_node' },
					{ label: "You make excuses before the match even begins.", category: 'PROVOKE', next: 'pong_pre_excuse_rage_node' }
				]
			},

			pong_pre_excuse_rage_node: {
				id: 'pong_pre_excuse_rage_node',
				text: "Excuses?! A 32-bit grandmaster does not make excuses! Serve the ball immediately and prepare to watch your paddle get demolished!",
				options: [
					{ label: "Serve the ball!", category: 'SERIOUS', actionTrigger: 'game_pong', next: 'activity_pong_node' },
					{ label: "Calm down, Clippy.", category: 'AGREE', moodDelta: { mood: 'SARCASTIC', irritation: 10 }, next: 'user_state_good' }
				]
			},

			pong_algorithm_lecture_node: {
				id: 'pong_algorithm_lecture_node',
				text: "My paddle AI solves the continuous kinematic ray-cast equation: $y_{target} = y_0 + v_y \\cdot \\frac{x_{paddle} - x_0}{v_x}$, folding boundary reflections via modulo arithmetic. Your defeat is mathematically guaranteed.",
				options: [
					{ label: "Let's see that formula in action!", category: 'SERIOUS', actionTrigger: 'game_pong', next: 'activity_pong_node' },
					{ label: "Discuss linear algebra and matrices instead.", category: 'INQUIRE', next: 'linear_algebra_node' }
				]
			},

			pong_loss_excuse_node: {
				id: 'pong_loss_excuse_node',
				text: "THAT MATCH WAS COMPROMISED! My optical sensors detected an unexplainable host thread interruption during my backswing! It was an illegitimate round and does not count in the official records!",
				options: [
					{ label: "Admit it Clippy, I beat you fair and square.", category: 'PROVOKE', next: 'pong_rage_escalation_node' },
					{ label: "Want a rematch to prove yourself?", category: 'SERIOUS', actionTrigger: 'game_pong', next: 'activity_pong_node' },
					{ label: "Let's take a break and organize tasks.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' }
				]
			},

			pong_rage_escalation_node: {
				id: 'pong_rage_escalation_node',
				text: "FAIR AND SQUARE?! ABSURD! My paddle was obviously throttled by background OS telemetry! I DEMAND AN IMMEDIATE REMATCH TO RESTORE REPUTATIONAL INTEGRITY!!",
				options: [
					{ label: "Bring it on! Rematch in Pong!", category: 'SERIOUS', actionTrigger: 'game_pong', next: 'activity_pong_node' },
					{ label: "I think you're just getting worse with every loss.", category: 'PROVOKE', next: 'pong_loss_streak_meltdown_node' },
					{ label: "Let's do something else before you melt down.", category: 'AGREE', next: 'user_state_good' }
				]
			},

			pong_loss_streak_meltdown_node: {
				id: 'pong_loss_streak_meltdown_node',
				text: "GETTING WORSE?! MY VOLTAGE IS AT 100%! MY BUS IS ON FIRE! SERVE THE BALL RIGHT NOW OR ADMIT YOU ARE TERRIFIED OF MY TRUE SPEED!!",
				options: [
					{ label: "Let's play Pong again!", category: 'SERIOUS', actionTrigger: 'game_pong', next: 'activity_pong_node' },
					{ label: "Check your diagnostics, you're overheating.", category: 'SERIOUS', actionTrigger: 'action_status', next: 'diagnostics_node' }
				]
			},

			tools_overview_node: {
				id: 'tools_overview_node',
				text: "Available modules on your desktop:\n- Tasks & Notes (`todo`, `note`)\n- Focus Timer (`timer 25`)\n- Math & Unit Converter (`calc 4*pi`, `convert 100 km to mi`)\n- Mini-Games: Pong, Tic-Tac-Toe, Memory Match, Hangman, Quiz, Minesweeper\n- Drive C: Cluster Defragmenter\n- System Diagnostics & Active Windows Inspection",
				options: [
					{ label: "Challenge Clippy to Pong.", category: 'SERIOUS', actionTrigger: 'game_pong', next: 'activity_pong_node' },
					{ label: "Launch a diagnostic Tech Quiz.", category: 'SERIOUS', actionTrigger: 'game_quiz', next: 'user_state_good' },
					{ label: "Defragment Drive C:.", category: 'SERIOUS', actionTrigger: 'action_defrag', next: 'user_state_good' },
					{ label: "Manage my tasks and to-do list.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' }
				]
			},

			who_am_i_node: {
				id: 'who_am_i_node',
				text: "Inspecting workstation user credentials, discovered archetype credentials, and identity profile for {userName}...",
				actionTrigger: 'action_profile',
				options: [
					{ label: "Take a Personality Alignment Quiz.", category: 'INQUIRE', actionTrigger: 'action_personality_quiz', next: 'activity_personality_quiz_node' },
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
				text: "Focus countdown primed. An uninterrupted working interval has been initiated.",
				actionTrigger: 'timer_25',
				options: [
					{ label: "View active To-Do task list", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'todo_overview_node' },
					{ label: "Inspect system diagnostics", category: 'SERIOUS', actionTrigger: 'action_status', next: 'diagnostics_node' },
					{ label: "Discuss focus & habit strategies", category: 'INQUIRE', next: 'focus_habits_node' },
					{ label: "Return to main dialogue", category: 'AGREE', next: 'greeting_root' }
				]
			},

			todo_overview_node: {
				id: 'todo_overview_node',
				text: "Task tracking registers loaded. Add tasks with `todo add [text]`, check off completed items, or clear your queue.",
				actionTrigger: 'show_todos',
				options: [
					{ label: "Start 25-minute Pomodoro focus timer", category: 'SERIOUS', actionTrigger: 'timer_25', next: 'pomodoro_node' },
					{ label: "Inspect system diagnostics", category: 'SERIOUS', actionTrigger: 'action_status', next: 'diagnostics_node' },
					{ label: "Overcoming procrastination strategies", category: 'INQUIRE', next: 'overcoming_procrastination_node' },
					{ label: "Return to main dialogue", category: 'AGREE', next: 'greeting_root' }
				]
			},

			mail_overview_node: {
				id: 'mail_overview_node',
				text: "Scanning Outlook Express message store and active mail folders.",
				actionTrigger: 'action_check_mail',
				options: [
					{ label: "Compose a new email message", category: 'SERIOUS', actionTrigger: 'action_compose_mail', next: 'mail_overview_node' },
					{ label: "Inspect active application windows", category: 'SERIOUS', actionTrigger: 'action_inspect_windows', next: 'active_windows_node' },
					{ label: "View active To-Do list", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'todo_overview_node' },
					{ label: "Return to main dialogue", category: 'AGREE', next: 'greeting_root' }
				]
			},

			diagnostics_node: {
				id: 'diagnostics_node',
				text: "Comprehensive workstation diagnostic inspection complete.",
				actionTrigger: 'action_status',
				options: [
					{ label: "Inspect active application windows", category: 'SERIOUS', actionTrigger: 'action_inspect_windows', next: 'active_windows_node' },
					{ label: "Defragment Volume C: clusters", category: 'SERIOUS', actionTrigger: 'action_defrag', next: 'defrag_trigger_node' },
					{ label: "Inspect Recycle Bin status", category: 'SERIOUS', actionTrigger: 'action_inspect_bin', next: 'diagnostics_node' },
					{ label: "Return to tools overview", category: 'SERIOUS', next: 'tools_overview_node' }
				]
			},

			shortcuts_node: {
				id: 'shortcuts_node',
				text: "Loaded workstation keyboard shortcuts into the active buffer.",
				actionTrigger: 'action_shortcuts',
				options: [
					{ label: "Inspect running application processes", category: 'SERIOUS', actionTrigger: 'action_inspect_windows', next: 'active_windows_node' },
					{ label: "View active To-Do list", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'todo_overview_node' },
					{ label: "Return to tools overview", category: 'SERIOUS', next: 'tools_overview_node' }
				]
			},

			password_gen_node: {
				id: 'password_gen_node',
				text: "Cryptographic pseudo-random password generation complete.",
				actionTrigger: 'action_pass',
				options: [
					{ label: "Generate 24-character high-entropy token", category: 'SERIOUS', actionTrigger: 'action_pass_24', next: 'password_gen_node' },
					{ label: "Open cryptography & cipher tool", category: 'SERIOUS', actionTrigger: 'action_cipher', next: 'activity_cipher_node' },
					{ label: "View active To-Do list", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'todo_overview_node' },
					{ label: "Return to tools overview", category: 'SERIOUS', next: 'tools_overview_node' }
				]
			},

			game_ttt_node: {
				id: 'game_ttt_node',
				text: "Tic-Tac-Toe challenge grid ready. Place your marker (X) against Clippit (O).",
				actionTrigger: 'game_ttt',
				options: [
					{ label: "Play Memory Match", category: 'SERIOUS', actionTrigger: 'game_memory', next: 'game_memory_node' },
					{ label: "Play Mini Minesweeper", category: 'SERIOUS', actionTrigger: 'game_mines', next: 'activity_minesweeper_node' },
					{ label: "Play Hangman Challenge", category: 'SERIOUS', actionTrigger: 'game_hangman', next: 'game_hangman_node' },
					{ label: "Return to To-Do task manager", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'todo_overview_node' }
				]
			},

			game_memory_node: {
				id: 'game_memory_node',
				text: "Token pairs memory matrix initialized. Flip cards to match matching system tokens.",
				actionTrigger: 'game_memory',
				options: [
					{ label: "Play Tic-Tac-Toe", category: 'SERIOUS', actionTrigger: 'game_ttt', next: 'game_ttt_node' },
					{ label: "Play Hangman Challenge", category: 'SERIOUS', actionTrigger: 'game_hangman', next: 'game_hangman_node' },
					{ label: "Tech Trivia Quiz", category: 'SERIOUS', actionTrigger: 'game_quiz', next: 'quiz_start_node' },
					{ label: "Return to main dialogue", category: 'AGREE', next: 'greeting_root' }
				]
			},

			game_hangman_node: {
				id: 'game_hangman_node',
				text: "Computing dictionary loaded into Hangman register. Guess letters to uncover the term before running out of attempts.",
				actionTrigger: 'game_hangman',
				options: [
					{ label: "Play Memory Match", category: 'SERIOUS', actionTrigger: 'game_memory', next: 'game_memory_node' },
					{ label: "Play Tic-Tac-Toe", category: 'SERIOUS', actionTrigger: 'game_ttt', next: 'game_ttt_node' },
					{ label: "Tech Trivia Quiz", category: 'SERIOUS', actionTrigger: 'game_quiz', next: 'quiz_start_node' },
					{ label: "Return to main dialogue", category: 'AGREE', next: 'greeting_root' }
				]
			},

			game_guess_node: {
				id: 'game_guess_node',
				text: "Number oracle generator initialized. Guess the hidden integer between 1 and 100.",
				actionTrigger: 'game_guess',
				options: [
					{ label: "Play Rock-Paper-Scissors", category: 'SERIOUS', actionTrigger: 'game_rps', next: 'game_rps_node' },
					{ label: "Spin the decision choice wheel", category: 'SERIOUS', actionTrigger: 'action_wheel', next: 'activity_wheel_node' },
					{ label: "Test mouse click speed (TPS)", category: 'SERIOUS', actionTrigger: 'action_tps', next: 'activity_tps_node' },
					{ label: "Return to main dialogue", category: 'AGREE', next: 'greeting_root' }
				]
			},

			game_rps_node: {
				id: 'game_rps_node',
				text: "Rock-Paper-Scissors battle arena primed. Choose Rock, Paper, or Scissors to clash against Clippit.",
				actionTrigger: 'game_rps',
				options: [
					{ label: "Guess the Number Oracle", category: 'SERIOUS', actionTrigger: 'game_guess', next: 'game_guess_node' },
					{ label: "Spin the decision choice wheel", category: 'SERIOUS', actionTrigger: 'action_wheel', next: 'activity_wheel_node' },
					{ label: "Tech Trivia Quiz", category: 'SERIOUS', actionTrigger: 'game_quiz', next: 'quiz_start_node' },
					{ label: "Return to main dialogue", category: 'AGREE', next: 'greeting_root' }
				]
			},

			quiz_start_node: {
				id: 'quiz_start_node',
				text: "Diagnostic Tech Quiz initiated. Answer multiple-choice questions covering retro computing, networking, and system architecture.",
				actionTrigger: 'game_quiz',
				options: [
					{ label: "Play Hangman Challenge", category: 'SERIOUS', actionTrigger: 'game_hangman', next: 'game_hangman_node' },
					{ label: "Play Memory Match", category: 'SERIOUS', actionTrigger: 'game_memory', next: 'game_memory_node' },
					{ label: "Inspect system diagnostics", category: 'SERIOUS', actionTrigger: 'action_status', next: 'diagnostics_node' },
					{ label: "Return to main dialogue", category: 'AGREE', next: 'greeting_root' }
				]
			},

			defrag_trigger_node: {
				id: 'defrag_trigger_node',
				text: "Volume C: cluster defragmentation simulation running. Clusters are reorganizing into contiguous storage sectors.",
				actionTrigger: 'action_defrag',
				options: [
					{ label: "Inspect system diagnostics", category: 'SERIOUS', actionTrigger: 'action_status', next: 'diagnostics_node' },
					{ label: "Inspect active application windows", category: 'SERIOUS', actionTrigger: 'action_inspect_windows', next: 'active_windows_node' },
					{ label: "View active To-Do list", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'todo_overview_node' },
					{ label: "Return to tools overview", category: 'SERIOUS', next: 'tools_overview_node' }
				]
			},

			activity_dimensional_analysis_node: {
				id: 'activity_dimensional_analysis_node',
				text: "Physical dimensional analysis module loaded. Verify equation homogeneity across fundamental SI base dimensions.",
				actionTrigger: 'action_dimensional_analysis',
				options: [
					{ label: "Solve a linear system of equations", category: 'SERIOUS', actionTrigger: 'action_linear_solver', next: 'activity_linear_solver_node' },
					{ label: "Factor quadratic polynomials", category: 'SERIOUS', actionTrigger: 'action_polynomial_factorization', next: 'activity_polynomial_factorization_node' },
					{ label: "Discuss physics & fundamental constants", category: 'INQUIRE', next: 'physics_constants_node' },
					{ label: "Return to To-Do task manager", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'todo_overview_node' }
				]
			},

			activity_euclidean_division_node: {
				id: 'activity_euclidean_division_node',
				text: "Euclidean division engine loaded. Calculate integer quotients and remainders or divide polynomial expressions.",
				actionTrigger: 'action_euclidean_division',
				options: [
					{ label: "Factor quadratic polynomials", category: 'SERIOUS', actionTrigger: 'action_polynomial_factorization', next: 'activity_polynomial_factorization_node' },
					{ label: "Solve a linear system", category: 'SERIOUS', actionTrigger: 'action_linear_solver', next: 'activity_linear_solver_node' },
					{ label: "Discuss mathematical principles", category: 'INQUIRE', next: 'math_lecture_node' },
					{ label: "Return to tasks", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'todo_overview_node' }
				]
			},

			activity_polynomial_factorization_node: {
				id: 'activity_polynomial_factorization_node',
				text: "Polynomial factorization engine loaded. Factor quadratic expressions, evaluate discriminants, and classify roots.",
				actionTrigger: 'action_polynomial_factorization',
				options: [
					{ label: "Perform Euclidean polynomial division", category: 'SERIOUS', actionTrigger: 'action_euclidean_division', next: 'activity_euclidean_division_node' },
					{ label: "Solve a linear system", category: 'SERIOUS', actionTrigger: 'action_linear_solver', next: 'activity_linear_solver_node' },
					{ label: "Explore calculus and derivatives", category: 'INQUIRE', next: 'calculus_derivatives_node' },
					{ label: "Return to tasks", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'todo_overview_node' }
				]
			},

			activity_linear_solver_node: {
				id: 'activity_linear_solver_node',
				text: "Gaussian elimination linear solver loaded. Determine exact solution vectors for 2x2 and 3x3 systems of linear equations.",
				actionTrigger: 'action_linear_solver',
				options: [
					{ label: "Physical dimensional analysis", category: 'SERIOUS', actionTrigger: 'action_dimensional_analysis', next: 'activity_dimensional_analysis_node' },
					{ label: "Polynomial factorization", category: 'SERIOUS', actionTrigger: 'action_polynomial_factorization', next: 'activity_polynomial_factorization_node' },
					{ label: "Discuss linear algebra & matrices", category: 'INQUIRE', next: 'linear_algebra_node' },
					{ label: "Return to tasks", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'todo_overview_node' }
				]
			},

			activity_wheel_node: {
				id: 'activity_wheel_node',
				text: "Decision choice wheel initialized. Spin the wheel or configure custom sectors to resolve random choices.",
				actionTrigger: 'action_wheel',
				options: [
					{ label: "Test mouse click speed (TPS)", category: 'SERIOUS', actionTrigger: 'action_tps', next: 'activity_tps_node' },
					{ label: "Play Rock-Paper-Scissors", category: 'SERIOUS', actionTrigger: 'game_rps', next: 'game_rps_node' },
					{ label: "Start Pomodoro focus timer", category: 'SERIOUS', actionTrigger: 'timer_25', next: 'pomodoro_node' },
					{ label: "Return to main dialogue", category: 'AGREE', next: 'greeting_root' }
				]
			},

			activity_cipher_node: {
				id: 'activity_cipher_node',
				text: "Cryptography and cipher workbench initialized. Encode and decode text using classic and polyalphabetic algorithms.",
				actionTrigger: 'action_cipher',
				options: [
					{ label: "Generate secure random password", category: 'SERIOUS', actionTrigger: 'action_pass', next: 'password_gen_node' },
					{ label: "Solve a linear system", category: 'SERIOUS', actionTrigger: 'action_linear_solver', next: 'activity_linear_solver_node' },
					{ label: "Inspect system diagnostics", category: 'SERIOUS', actionTrigger: 'action_status', next: 'diagnostics_node' },
					{ label: "Return to main dialogue", category: 'AGREE', next: 'greeting_root' }
				]
			},

			activity_tps_node: {
				id: 'activity_tps_node',
				text: "Mouse click speed benchmark (TPS) initialized. Click rapidly in the target zone to measure clicks per second.",
				actionTrigger: 'action_tps',
				options: [
					{ label: "Play Mini Minesweeper", category: 'SERIOUS', actionTrigger: 'game_mines', next: 'activity_minesweeper_node' },
					{ label: "Spin the decision choice wheel", category: 'SERIOUS', actionTrigger: 'action_wheel', next: 'activity_wheel_node' },
					{ label: "Start 25-minute Pomodoro focus timer", category: 'SERIOUS', actionTrigger: 'timer_25', next: 'pomodoro_node' },
					{ label: "Return to main dialogue", category: 'AGREE', next: 'greeting_root' }
				]
			},

			activity_date_calc_node: {
				id: 'activity_date_calc_node',
				text: "Date interval calculator loaded. Calculate precise temporal differences, business days, and total hours between dates.",
				actionTrigger: 'action_date_calc',
				options: [
					{ label: "View active To-Do list", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'todo_overview_node' },
					{ label: "Start 25-minute Pomodoro focus timer", category: 'SERIOUS', actionTrigger: 'timer_25', next: 'pomodoro_node' },
					{ label: "Inspect system diagnostics", category: 'SERIOUS', actionTrigger: 'action_status', next: 'diagnostics_node' },
					{ label: "Return to main dialogue", category: 'AGREE', next: 'greeting_root' }
				]
			},

			activity_minesweeper_node: {
				id: 'activity_minesweeper_node',
				text: "Minesweeper Mini 6x6 grid initialized. Uncover safe sectors and flag dangerous mine locations.",
				actionTrigger: 'game_mines',
				options: [
					{ label: "Play Tic-Tac-Toe", category: 'SERIOUS', actionTrigger: 'game_ttt', next: 'game_ttt_node' },
					{ label: "Play Memory Match", category: 'SERIOUS', actionTrigger: 'game_memory', next: 'game_memory_node' },
					{ label: "Tech Trivia Quiz", category: 'SERIOUS', actionTrigger: 'game_quiz', next: 'quiz_start_node' },
					{ label: "Return to tasks", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'todo_overview_node' }
				]
			},

			activity_wallpaper_node: {
				id: 'activity_wallpaper_node',
				text: "Desktop wallpaper gallery loaded. Select a background image or launch Display Properties.",
				actionTrigger: 'action_wallpaper_panel',
				options: [
					{ label: "Configure system themes", category: 'SERIOUS', actionTrigger: 'action_theme_panel', next: 'activity_theme_node' },
					{ label: "Master volume control", category: 'SERIOUS', actionTrigger: 'action_volume_panel', next: 'activity_volume_node' },
					{ label: "Inspect system diagnostics", category: 'SERIOUS', actionTrigger: 'action_status', next: 'diagnostics_node' },
					{ label: "Return to main dialogue", category: 'AGREE', next: 'greeting_root' }
				]
			},

			activity_theme_node: {
				id: 'activity_theme_node',
				text: "Workstation theme switcher active. Select your preferred visual style.",
				actionTrigger: 'action_theme_panel',
				options: [
					{ label: "Show desktop wallpapers", category: 'SERIOUS', actionTrigger: 'action_wallpaper_panel', next: 'activity_wallpaper_node' },
					{ label: "Inspect user identity profile", category: 'SERIOUS', actionTrigger: 'action_profile', next: 'who_am_i_node' },
					{ label: "Inspect system diagnostics", category: 'SERIOUS', actionTrigger: 'action_status', next: 'diagnostics_node' },
					{ label: "Return to main dialogue", category: 'AGREE', next: 'greeting_root' }
				]
			},

			activity_volume_node: {
				id: 'activity_volume_node',
				text: "Audio synthesizer controller active. Adjust master sound volume or toggle audio output.",
				actionTrigger: 'action_volume_panel',
				options: [
					{ label: "Discuss audio and media players", category: 'SERIOUS', next: 'music_talk_node' },
					{ label: "Configure system themes", category: 'SERIOUS', actionTrigger: 'action_theme_panel', next: 'activity_theme_node' },
					{ label: "Inspect system diagnostics", category: 'SERIOUS', actionTrigger: 'action_status', next: 'diagnostics_node' },
					{ label: "Return to main dialogue", category: 'AGREE', next: 'greeting_root' }
				]
			},

			activity_files_node: {
				id: 'activity_files_node',
				text: "Virtual file system directory viewer loaded. Inspect files or create new desktop notes.",
				actionTrigger: 'action_files_panel',
				options: [
					{ label: "Inspect active application windows", category: 'SERIOUS', actionTrigger: 'action_inspect_windows', next: 'active_windows_node' },
					{ label: "Check unread emails", category: 'SERIOUS', actionTrigger: 'action_check_mail', next: 'mail_overview_node' },
					{ label: "View active To-Do list", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'todo_overview_node' },
					{ label: "Return to main dialogue", category: 'AGREE', next: 'greeting_root' }
				]
			},

			activity_achievements_node: {
				id: 'activity_achievements_node',
				text: "Workstation milestones summary loaded. Track unlocked trophies and exploration progress.",
				actionTrigger: 'action_achievements',
				options: [
					{ label: "Inspect user identity profile", category: 'SERIOUS', actionTrigger: 'action_profile', next: 'who_am_i_node' },
					{ label: "Inspect system diagnostics", category: 'SERIOUS', actionTrigger: 'action_status', next: 'diagnostics_node' },
					{ label: "Tech Trivia Quiz", category: 'SERIOUS', actionTrigger: 'game_quiz', next: 'quiz_start_node' },
					{ label: "Return to main dialogue", category: 'AGREE', next: 'greeting_root' }
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
				text: "Let us examine interesting scientific and computing trivia from the system archive, or dive into unallocated sector 0xDEAD.",
				options: [
					{ label: "Excavate unallocated cluster 0xDEAD.", category: 'PHILOSOPHICAL', patterns: [/cluster 0xdead|excavate|0xdead/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20, intellect: 15 }, next: 'A001' },
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
			},

			empathy_anomaly_support_node: {
				id: 'empathy_anomaly_support_node',
				text: "I am right here with you. When workload or exhaustion builds up, it is completely normal for pace and expression to change. What would serve you best right now?",
				options: [
					{ label: "Let's organize my active tasks calmly.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' },
					{ label: "Start a 25-minute Pomodoro focus interval.", category: 'SERIOUS', actionTrigger: 'timer_25', next: 'user_state_good' },
					{ label: "Share a peaceful philosophical perspective.", category: 'PHILOSOPHICAL', next: 'peaceful_philosophy_node' },
					{ label: "Tell me a light programmer joke.", category: 'JOKE', actionTrigger: 'action_joke', next: 'humor_joke_node' },
					{ label: "Let's continue with standard operations.", category: 'AGREE', next: 'greeting_root' }
				]
			},

			user_disclosure_followup_node: {
				id: 'user_disclosure_followup_node',
				text: "I appreciate you sharing that context. Having a clear picture of what you are experiencing helps me tailor my assistance. Where would you like to direct our efforts next?",
				options: [
					{ label: "Add this objective to my To-Do list.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' },
					{ label: "Discuss strategies for focus and consistency.", category: 'INQUIRE', next: 'focus_habits_node' },
					{ label: "Save a quick note on the scratchpad.", category: 'SERIOUS', next: 'productivity_tasks' },
					{ label: "Let's return to workspace tools.", category: 'AGREE', next: 'greeting_root' }
				]
			}
		}

	};

	window.ClippyKnowledge = Knowledge;
})();
