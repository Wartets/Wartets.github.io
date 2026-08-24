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
			"great": 2.5, "good": 1.5, "awesome": 3.0, "fantastic": 3.2, "excellent": 3.0, "wonderful": 3.0, "amazing": 3.2, "perfect": 3.5, "love": 3.0, "like": 1.2, "happy": 2.0, "brilliant": 2.8, "genius": 2.5, "helpful": 2.0, "best": 3.0, "clean": 1.2, "productive": 2.0,
			"fast": 1.2, "smart": 2.0, "legend": 2.5, "hero": 2.5, "beautiful": 2.4, "peaceful": 2.0, "kind": 1.8, "cool": 1.5, "magnificent": 3.0, "superb": 2.8, "efficient": 2.2, "pleasant": 2.0, "sublime": 3.2, "bad": -2.0, "terrible": -3.2, "awful": -3.2, "horrible": -3.5,
			"hate": -3.5, "useless": -3.0, "annoying": -2.8, "stupid": -3.0, "ugly": -2.5, "slow": -1.5, "broken": -2.2, "crash": -2.5, "error": -1.8, "worst": -3.5, "garbage": -3.2, "trash": -3.0, "boring": -2.0, "tired": -1.8, "exhausted": -2.2, "sad": -2.0, "depressed": -2.5,
			"angry": -2.5, "mad": -2.2, "shut": -1.5, "die": -3.5, "clueless": -2.4, "disaster": -3.0, "pathetic": -3.2, "clunky": -2.0, "glitch": -1.8, "grateful": 2.0, "outstanding": 2.5, "commendable": 2.2, "delightful": 2.0, "noteworthy": 2.6, "splendid": 3.0, "capable": 2.2,
			"mediocre": -1.5, "inadequate": -2.5, "inferior": -2.2, "disappointing": -2.6, "irritated": -2.5, "catastrophic": -3.0, "sluggish": -1.8, "obstructive": -2.2, "damaged": -2.0, "tedious": -2.4
		},

		EMOTIONAL_INDICATORS: {
			frustration: [
				"error", "bug", "fail", "failed", "failure", "crash", "stuck", "broken", "annoying", "annoyed", "frustrated", "frustrating", "hate", "slow", "stupid", "useless", "worst", "damn", "bloody", "rage", "irritating", "irritated", "angry", "mad", "furious", "ugh", "wtf", "fuck",
				"shit", "problem", "issue", "glitch", "malfunction", "blocked", "blocking", "failed", "failure", "cannot", "can't", "doesn't work", "not working", "impossible", "struggle", "struggling"
			],

			curiosity: [
				"why", "how", "what", "where", "when", "who", "explain", "details", "detail", "origin", "theory", "meaning", "science", "physics", "math", "explore", "inspect", "investigate", "analyze", "analyse", "understand", "reason", "cause", "purpose", "function", "architecture",
				"mechanism", "process", "principle", "concept", "curious", "curiosity", "wonder", "wondering", "question", "questions", "learn", "discover", "research", "look into", "figure out", "how does", "why does", "what if"
			],

			fatigue: [
				"tired", "exhausted", "sleepy", "burnout", "burned out", "drained", "sleep", "rest", "break", "yawn", "fatigue", "weary", "exhausting", "exhausted", "worn out", "worn-out", "low energy", "no energy", "need sleep", "need a break", "need rest", "nap", "napping", "doze",
				"drowsy", "lethargic", "sluggish", "overworked", "overwhelmed", "can't focus", "hard to focus", "running on empty", "done for the day", "spent", "depleted"
			],

			enthusiasm: [
				"wow", "cool", "awesome", "amazing", "fantastic", "excellent", "let's", "ready", "play", "game", "go", "fun", "super", "great", "brilliant", "incredible", "wonderful", "excited", "exciting", "thrilled", "eager", "motivated", "motivating", "can't wait",
				"looking forward", "yes", "yay", "woohoo", "hell yeah", "let's go", "bring it on", "count me in", "absolutely", "perfect", "nice", "congrats", "congratulations", "proud", "winning", "winner"
			],

			politeness: [
				"please", "thank", "thanks", "thank you", "thankful", "kindly", "appreciate", "appreciated", "appreciation", "hello", "greetings", "hi", "hey", "good morning", "good afternoon", "good evening","please help", "if you don't mind", "would you mind", "could you",
				"would you", "excuse me", "pardon", "sorry", "apologies", "welcome","you're welcome", "my pleasure", "much appreciated", "best regards", "regards", "have a nice day"
			],

			hostility: [
				"kill", "destroy", "die", "shut up", "disappear", "idiot", "moron", "stupid", "dumb", "trash", "garbage", "hate", "loser", "scum", "jerk", "asshole", "bastard", "screw you", "fuck you", "get lost", "go away", "drop dead", "leave me alone", "back off", "shut your mouth",
				"worthless", "pathetic", "disgusting", "despise", "destroy", "eliminate", "attack", "threat", "threaten", "revenge", "enemy", "aggressive", "aggression", "hostile", "hostility"
			],

			skepticism: [
				"really", "sure", "doubt", "doubtful", "skeptical", "sceptical", "fake", "impossible", "lie", "liar", "proof", "evidence", "questionable", "suspicious", "strange", "weird", "fishy", "shady", "unbelievable", "unlikely", "not convinced", "don't believe",
				"i doubt", "are you sure", "is that true", "really?", "prove it", "how do you know", "source", "citation", "verify", "verification", "fact check", "uncertain", "unclear", "possibly", "maybe", "allegedly", "supposedly", "dubious", "misleading", "deceptive"
			],

			playfulness: [
				"fun", "funny", "joke", "joking", "riddle", "game", "games", "laugh", "laughing", "laughter", "trick", "haha", "hahaha", "lol", "lmao", "rofl", "kidding", "just kidding", "teasing", "tease", "play",
				"playful", "playfully", "let's play", "challenge", "dare", "prank", "pranking", "silly", "goofy", "witty", "humor", "humour", "amusing", "entertaining", "entertainment", "joke around", "messing around", "banter", "mock", "devinette", "mischief"
			],

			desperation: [
				"help", "help me", "please help", "emergency", "urgent", "urgently", "lost", "critical", "panic", "panicking", "panicked", "desperate", "desperation", "save me", "rescue", "sos", "mayday", "need help", "need assistance", "can't do this", "i'm stuck", "i'm lost",
				"don't know what to do", "what do i do", "please save me", "emergency help", "critical situation", "crisis", "danger", "immediately", "asap", "right now", "running out of time", "no way out", "hopeless", "helpless", "overwhelmed"
			],

			awe: [
				"universe", "infinity", "infinite", "cosmos", "cosmic", "miracle", "fascinating", "fascinated", "quantum", "existence", "immense", "beauty", "beautiful", "vertigo", "vast", "vastness", "incredible", "extraordinary", "majestic", "magnificent", "spectacular",
				"breathtaking", "astonishing", "astonished", "wonder", "wondrous", "marvel", "marvelous", "mysterious", "mystery", "profound", "epic", "timeless", "eternal", "infinite scale", "mind-blowing", "mind blown", "beyond comprehension", "overwhelming", "sublime",
				"transcendent", "celestial", "astronomical", "cosmology"
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
					"dead": "gone to Davy Jones", "death": "Davy Jones' locker", "danger": "peril"
				},
				prefixes: ["Ahoy!", "Arr!", "Shiver me timbers!", "Avast ye!", "By Blackbeard's ghost!"],
				suffixes: [", arr!", ", ye scallywag!", ", by the seven seas!", ", matey!"]
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
					"come here": "come hither", "go away": "begone", "get out": "depart", "leave me alone": "leave me be"
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
			os: ["windows xp", "windows 95", "windows 98", "windows 2000", "windows me", "longhorn", "whistler", "chicago", "memphis", "cairo", "linux", "debian", "redhat", "dos", "ms-dos", "unix", "freebsd", "solaris", "os/2", "beos", "nextstep", "amigaos"],
			hardware: ["pentium", "pentium ii", "pentium iii", "pentium 4", "athlon", "duron", "celeron", "cpu", "processor", "ram", "sdram", "ddr", "gpu", "voodoo", "voodoo 2", "geforce", "riva tnt", "sound blaster", "sound blaster 16", "awe32", "awe64", "modem", "56k", "v.90", "crt", "trinitron", "cd-rom", "dvd-rom", "floppy", "zip drive", "agp", "pci", "isa", "ide", "scsi", "motherboard", "northbridge", "southbridge"],
			physics: ["quantum", "relativity", "special relativity", "general relativity", "entropy", "schrodinger", "einstein", "planck", "thermodynamics", "hawking", "bohr", "feynman", "dirac", "maxwell", "heisenberg", "landauer", "boltzmann", "fermi", "bose", "lorentz", "higgs", "neutrino", "graviton", "photon", "black hole", "cosmology"],
			math: ["turing", "godel", "calculus", "fourier", "euler", "matrix", "derivative", "integral", "fibonacci", "riemann", "gauss", "lagrange", "laplace", "eigenvalue", "vector", "quaternion", "boolean", "topology", "fractal", "mandelbrot", "julia", "prime", "cryptography"],
			philosophy: ["qualia", "consciousness", "solipsism", "boltzmann", "sisyphus", "stoicism", "bostrom", "searle", "descartes", "kant", "nietzsche", "camus", "spinoza", "simulation hypothesis", "chinese room", "ship of theseus", "determinism", "free will", "epistemology", "ontology", "existentialism"]
		},

		VOCABULARY: [
			"hello", "greetings", "hi", "hey", "salut", "bonjour", "clippy", "clippit", "windows", "help", "aide", "commands", "project", "projects", "portfolio", "projets", "mail", "outlook", "email", "courrier", "inbox", "messages",
			"recycle", "trash", "corbeille", "bin", "desktop", "bureau", "time", "clock", "date", "heure", "horloge", "moon", "lunar", "lune", "phase", "status", "specs", "system", "diagnostic", "statut", "defrag", "defragment",
			"memory", "hangman", "tictactoe", "morpion", "quiz", "guess", "nombre", "rps", "chifoumi", "mines", "minesweeper", "todo", "task", "tasks", "tache", "taches", "timer", "pomodoro", "minuteur", "note", "scratchpad", "memo",
			"password", "motdepasse", "convert", "conversion", "calc", "calculate", "compute", "calculer", "constant", "physics", "quantum", "relativity", "philosophy", "philosophie", "shortcut", "shortcuts", "raccourcis",
			"math", "mathematics", "calculus", "algebra", "integral", "derivative", "matrix", "vector", "topology", "thermodynamics", "entropy", "astrophysics", "cosmology", "electromagnetism", "optics", "gravity",
			"weather", "coffee", "tea", "routine", "morning", "evening", "walk", "cooking", "reading", "books", "habits", "work", "focus", "rest", "habit", "study", "procrastination", "discipline", "motivation", "discussion", "dialogue",
			"reddit", "thread", "argument", "debate", "truce", "apology", "deltarune", "mystery", "shadow", "determination", "logic", "trivia", "anecdote", "joke", "blague", "humor", "game", "games", "jeu", "jeux", "zen", "chaos",
			"architecture", "refactoring", "compiler", "concurrency", "algorithms", "differential", "fourier", "riemann", "eigenvalue", "taylor", "manifold", "bayesian", "carnot", "schrodinger", "heisenberg", "lorentz", "boltzmann",
			"wallpaper", "fond", "theme", "volume", "sound", "son", "audio", "music", "musique", "scanlines", "crt", "curvature", "vignette", "bloom", "cascade", "tile", "minimize", "restore"
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
			electron_volt: { symbol: "eV", name: "Electron volt", value: 1.602176634e-19, unit: "J", exact: true, dim: { M: 1, L: 2, T: -2 } }
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
				if (brain.memory && brain.memory.userName && variables.userName === undefined) {
					variables.userName = brain.memory.userName;
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

		STANDBY_PHRASES: [
			"Standing by for your instructions.",
			[
				"All active routines paused. Ready when you are.",
				"Awaiting your next command, operator."
			],
			{
				text: ["Dialogue reset. Telemetry registers ready for input.", "Instruction queue flushed. Awaiting deterministic parameter input."],
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
							locale: ["this workspace", "the desktop environment", "our quiet session"]
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
			OPTIMISTIC: ["Splendid! ", "Ready to assist! ", "Here we go: ", "Delighted to help: "],
			ANALYTICAL: ["Telemetry analysis confirms: ", "Executing query inspection: ", "Register dump indicates: ", "Empirical metrics show: "],
			ZEN: ["Peacefully processing: ", "With quiet clarity: ", "In steady equilibrium: ", "Serenely noting: "],
			CYNICAL: ["If you insist: ", "Processing your request, as expected: ", "Executing standard protocol: "],
			SARCASTIC: ["Naturally: ", "According to standard procedure: ", "If we must: "],
			NOSTALGIC: ["Ah, just like the classic days: ", "Loading from system memory archives: ", "A fine retro inquiry: "],
			EUPHORIC: ["Outstanding! ", "Energized and ready: ", "Full speed ahead: "],
			FATIGUED: ["*yawn* Processing: ", "Low power hum... ", "Executing slowly: "],
			PLAYFUL: ["Here comes the magic! ", "Game on: ", "Bouncing into action: "]
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
				template: "The \"{feature}\" module requires the full desktop workstation environment and is not available in this standalone Clippy session. Visit the complete desktop experience to unlock every capability.",
				actionDesk: "Open Desktop Experience",
				actionCapabilities: "What can you do here?"
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
				header: "[SYSTEM UTILITIES] <b>Diagnostic and Maintenance Tools:</b>",
				btnSpecs: "System Specs",
				btnDefrag: "Defragment Drive C:",
				btnWindows: "Inspect Windows",
				btnBin: "Recycle Bin",
				btnShortcuts: "Keyboard Shortcuts"
			},
			windowControls: {
				minimizedAll: [
					"All open windows have been minimized to the taskbar.",
					"Workspace cleared: all active windows minimized.",
					"Desktop exposed; all running processes parked on taskbar."
				],
				restoredAll: [
					"All windows restored to workspace.",
					"Restored previous window layout across the desktop.",
					"Application surfaces brought back to active view."
				],
				cascaded: [
					"Windows have been cascaded across the workspace.",
					"Diagonal cascade arrangement applied to active windows.",
					"Tidy cascade layout established across the display."
				],
				tiled: [
					"Windows have been tiled horizontally.",
					"Workspace partitioned into horizontal tiles.",
					"Evenly distributed window tiles across the desktop."
				]
			},
			musicControls: {
				toggled: "Playback toggled: \"{title}\"",
				initiated: "Audio player initiated.",
				nextTrack: "Advanced to next audio track.",
				prevTrack: "Returned to previous audio track.",
				nowPlaying: "Now Playing: **{title}** by **{artist}**",
				noTrack: "No media track is currently active.",
				playingTrack: "Playing track: **{title}**.",
				advancedNext: "Advanced to next audio track.",
				returnedPrev: "Returned to previous audio track."
			},
			themeControls: {
				switched: "Workstation theme switched to: **{theme}**.",
				available: "Available themes: {themes}."
			},
			displayControls: {
				scanlinesOn: "Scanlines overlay enabled.",
				scanlinesOff: "Scanlines overlay disabled.",
				crtOn: "CRT glass curvature filter enabled.",
				crtOff: "CRT glass curvature filter disabled."
			},
			fileControls: {
				searchFound: "Found {count} matching item(s) in VFS:",
				searchNotFound: "No filesystem entries found for query: \"{query}\".",
				noteCreated: "Created new file on Desktop: **{name}**.",
				noteCommitted: "[SCRATCHPAD COMMITTED] Memo saved to local storage:\n\"{memo}\"",
				scratchpadBuffer: "[SCRATCHPAD BUFFER]\n{memo}",
				scratchpadEmpty: "(Scratchpad buffer is currently empty. Type 'note [text]' to save a memo.)"
			},
			mailControls: {
				header: "[OUTLOOK EXPRESS] <b>Inbox ({unread} unread / {total} total):</b>",
				synced: "Mail synchronization complete.",
				launched: "Outlook Express launched for drafting messages.",
				btnOpen: "Open Outlook Express",
				btnSync: "Send / Receive"
			},
			recycleBin: {
				emptyNotice: "The Recycle Bin is completely empty.",
				countNotice: "The Recycle Bin currently holds {count} item(s).",
				emptiedNotice: "Recycle Bin emptied.",
				btnOpen: "Open Recycle Bin",
				btnEmpty: "Empty Recycle Bin"
			},
			countRefusal: "I lack the patience and register bandwidth to count up to {target} sequentially in individual messages! Here is an optimized Python script to execute the task on your workstation instead:\n\n```python\ndef count_to(limit):\n    for i in range(1, limit + 1):\n        print(f\"Value: {i}\")\n\ncount_to({target})\n```",
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
				generated: "Generated Secure Password ({length} chars):\n**`{password}`**",
				generatedEntropy: "Generated High-Entropy Password ({length} chars):\n**`{password}`**"
			},
			conversions: {
				result: "Unit Conversion Result: **{result}**"
			},
			calculations: {
				result: "Calculation Result: **{result}**"
			},
			constants: {
				speedOfLightHeader: "Physical Constant: Speed of Light",
				speedOfLightText: "Speed of light in vacuum (c):\n**{value} {unit}** (exact standard)",
				planckHeader: "Physical Constant: Planck Constant",
				planckText: "Planck constant (h):\n**{value} {unit}** (exact standard)"
			},
			appControls: {
				launched: "Launched application: **{name}**."
			},
			capabilities: {
				title: "Workstation Capability Index",
				thModule: "Module",
				thCommands: "Commands & Description",
				tasksDesc: "<code>todo</code>, <code>todo add [text]</code>, <code>note [memo]</code>, <code>timer 25</code>",
				workstationDesc: "<code>diagnostics</code>, <code>windows</code>, <code>files</code>, <code>mail</code>, <code>defrag</code>",
				customizationDesc: "<code>theme [name]</code>, <code>wallpaper</code>, <code>volume</code>, <code>scanlines on/off</code>, <code>crt on/off</code>",
				calculationsDesc: "<code>calc [formula]</code>, <code>convert [from] to [to]</code>, <code>password [len]</code>",
				miniGamesDesc: "<code>tictactoe</code>, <code>memory</code>, <code>hangman</code>, <code>quiz</code>, <code>guess</code>, <code>mines</code>, <code>rps</code>"
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
				unreadMail: "You have {count} unread email(s) waiting in Outlook Express!",
				recycleBin: "The Recycle Bin has {count} items. Would you like me to empty it or explain quantum information loss?",
				activeWindows: "You have {count} active windows. Would you like me to tile or cascade them?",
				pool: [
					"Need a hand with your tasks or want to discuss a new idea? Click me anytime!",
					"It looks like you're exploring the desktop. Let me know if you need assistance!",
					"Your 32-bit companion is standing by on the taskbar. Click to chat or play a game!",
					"Curious about retro computing trivia or physical constants? I am ready to assist!",
					"Remember to stay hydrated and take brief breaks during long workstation sessions."
				]
			}
		},

		ACTIVITIES_TEXTS: {
			tictactoe: {
				title: "Tic-Tac-Toe",
				badge: "Mini-Game",
				scorePlayer: "You (X)",
				scoreDraws: "Draws",
				scoreClippy: "Clippy (O)",
				winBanner: "Game Over: Victory! You defeated Clippit.",
				lossBanner: "Game Over: Defeat! Clippit won this round.",
				drawBanner: "Game Over: Draw game! Stalemate."
			},
			memory: {
				title: "Memory Match",
				badge: "Token Pairs",
				scoreMatched: "Matched",
				scoreTurns: "Turns",
				scoreStatus: "Status",
				statusWon: "Won",
				statusPlaying: "Playing",
				winBanner: "All pairs matched in {turns} turns!"
			},
			hangman: {
				title: "Hangman Challenge",
				badge: "Word Guess",
				statsErrors: "Errors:",
				statsRemaining: "Remaining:",
				winBanner: "Correct! The word was {word}.",
				lossBanner: "Out of tries! The word was {word}."
			},
			quiz: {
				title: "Tech Knowledge Quiz",
				badge: "Diagnostic Test",
				resultsBanner: "Quiz Completed! Score: {score} / {total} ({pct}%)",
				qHeader: "[Q{current}/{total}] {question}",
				factLabel: "Note:",
				btnNext: "Next Question",
				btnResults: "View Results"
			},
			guess: {
				title: "Number Oracle",
				badge: "Logic Search",
				initialStatus: "Guess an integer between 1 and 100:",
				searchBounds: "Active Search Bounds:",
				attemptsLabel: "Attempts:",
				winBanner: "Solved in {attempts} attempt(s)! Target was {target}.",
				statusGreater: "Target is GREATER than {guess}.",
				statusLess: "Target is LESS than {guess}.",
				btnSubmit: "Submit"
			},
			rps: {
				title: "Rock-Paper-Scissors",
				badge: "Battle",
				scorePlayer: "You",
				scoreDraws: "Draws",
				scoreClippy: "Clippy",
				winBanner: "You win this clash!",
				lossBanner: "Clippit wins this round!",
				drawBanner: "Mutual deflection! It is a draw."
			},
			mines: {
				title: "Minesweeper Mini",
				badge: "6x6 Field",
				winBanner: "All safe sectors revealed! Minefield cleared.",
				lossBanner: "Detonation! Minefield triggered."
			},
			defrag: {
				title: "Disk Defragmenter",
				badge: "Volume C:",
				winBanner: "100% Contiguous. Optimization Complete!",
				progressBanner: "Defragmenting Drive C: Clusters... ({progress}%)"
			},
			pomodoro: {
				title: "Focus Timer",
				badge: "{minutes}m Session",
				breakBanner: "Focus interval completed! Take a 5-minute break.",
				btnPause: "Pause",
				btnResume: "Resume",
				btnReset: "Reset"
			},
			todo: {
				title: "Task Manager",
				badge: "To-Do List",
				scorePending: "Pending",
				scoreCompleted: "Completed",
				scoreTotal: "Total",
				emptyNotice: "No tasks registered. Add a task below.",
				inputPlaceholder: "New task description...",
				btnAdd: "+ Add",
				btnClear: "Clear Completed"
			},
			pet: {
				title: "Assistant Metrics",
				badge: "Clippit Tamagotchi",
				scoreLevel: "Level",
				scoreXp: "XP",
				scoreHealth: "Health",
				healthNominal: "Nominal",
				moraleLabel: "Morale:",
				energyLabel: "Energy:",
				depletionLabel: "Depletion:",
				noticeFeed: "Paperclips supplied! Reserves replenished (+15 XP).",
				noticePolish: "Wire polished! Morale increased (+10 XP).",
				noticeSleep: "Low-power standby complete. Battery restored to 100%.",
				btnFeed: "Supply Paperclips",
				btnPolish: "Polish Metal Wire",
				btnSleep: "Standby Mode"
			},
			dimensionalAnalysis: {
				title: "Dimensional Analysis",
				badge: "Physics Validator",
				inputPlaceholder: "e.g. F = m * a or E = m * c^2",
				btnVerify: "Verify",
				homogeneousBanner: "Dimensionally Homogeneous (Valid Equation Structure)",
				inconsistentBanner: "Dimensionally Inconsistent (Unit Mismatch Detected)",
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
				badge: "Integer & Polynomial",
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
				badge: "Roots & Factoring",
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
				badge: "{size}x{size} Gaussian Solver",
				sizeBtn: "{size}x{size} System",
				btnSolve: "Solve Linear System (Gaussian Elimination)",
				winBanner: "Unique Solution Vector Found!",
				tableVariable: "Variable",
				tableValue: "Exact Value",
				errSingular: "Singular or dependent matrix. No unique solution."
			},
			wheel: {
				title: "Decision Wheel",
				badge: "Random Choice",
				outcomeBanner: "Outcome Selected: \"{outcome}\"",
				btnSpin: "Spin Wheel!",
				btnSpinning: "Spinning...",
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
				badge: "Encoder / Decoder",
				algorithmLabel: "Cipher Algorithm:",
				keyLabel: "Key / Parameter:",
				inputPlaceholder: "Enter text to encode or decode...",
				outputPlaceholder: "Output result will appear here...",
				btnEncode: "Encode →",
				btnDecode: "← Decode",
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
				badge: "{duration}s Click Speed Benchmark",
				clickPrompt: "Click Rapidly Here to Test Speed!",
				finalLabel: "Final Ticks Per Second",
				bannerComplete: "Test Complete! Average Rate: {tps} TPS (Peak: {peak})",
				statsDuration: "Duration: <strong>{duration}s</strong>",
				statsClicks: "Total Clicks: <strong>{clicks}</strong>",
				btnRestart: "Restart ({duration}s)",
				statsTimeRemaining: "Time Remaining: <strong>{time}s</strong>",
				statsClicksRealtime: "Clicks: <strong>{clicks}</strong>"
			},
			dateCalc: {
				title: "Date Interval Calculator",
				badge: "Temporal Delta",
				labelStart: "Start Date:",
				labelEnd: "End Date:",
				btnToday: "Today",
				btnSubmit: "Calculate Delta",
				bannerTotal: "Total Difference: {days} days",
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
			{ pattern: /\b(what can you do|commands|what do you do|help|aide|features|capabilities|que peux tu faire)\b/i, label: "What can you do?", next: 'tools_overview_node', moodDelta: { mood: 'OPTIMISTIC', patience: 15 } },
			{ pattern: /\b(who am i|who i am|my profile|my identity|identity|user profile|qui suis-je|mon profil)\b/i, label: "Who am I?", next: 'who_am_i_node', moodDelta: { mood: 'ANALYTICAL', intellect: 10 } },
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
			{ pattern: /\b(achievements|milestones|trophies|succes)\b/i, label: "View milestones and trophies", next: 'activity_achievements_node', actionTrigger: 'action_achievements', moodDelta: { mood: 'OPTIMISTIC', affinity: 15 } }
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
			"Topology and geometry",
			"Quantum physics & mechanics",
			"Thermodynamics & entropy",
			"General relativity & spacetime",
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
			"Play Minesweeper",
			"Tech Trivia Quiz",
			"Guess the Number",
			"Rock Paper Scissors",
			"Pet Clippy status",
			"Defrag Drive C:",
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
			"Telemetry registers could not resolve that input pattern. Check keyboard shortcuts with 'shortcuts' or browse projects with 'projects'.",
			"Unrecognized instruction token. Try exploring physical constants ('constant c', 'constant h') or solving linear systems ('linear system').",
			"Heuristic parser found no active match. You can test your mouse speed ('tps test'), run ciphers ('cipher'), or spin the decision wheel ('choice wheel')."
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
				"* You spoke into the empty space.\n* Nothing responded, Clippy waits patiently."
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
					{ label: "Defragment Drive C:.", category: 'SERIOUS', actionTrigger: 'action_defrag', next: 'user_state_good' },
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
