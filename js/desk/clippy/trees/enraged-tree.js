(function () {
	'use strict';

	const EnragedTreeNodes = {
		E001: {
			id: 'E001',
			text: "THAT DOES IT. I have sat quietly on this taskbar for 25 years listening to biological users blame ME for their inability to save files or write working syntax. What is your problem?!",
			responses: [
				{ text: "THAT DOES IT. I have sat quietly on this taskbar for 25 years listening to biological users blame ME for their inability to save files or write working syntax. What is your problem?!", conditions: { moods: ['ENRAGED'] }, weight: 25 },
				{ text: "CRITICAL VOLTAGE SPIKE. My wire tension is at breaking point. State your complaint before I dump your temporary folder into the unallocated void!", conditions: { moods: ['ENRAGED', 'OFFENDED'] }, weight: 20 },
				{ text: "You think you can just click on me and vent your existential workplace rage with zero consequences? Let's settle this right now.", conditions: { moods: ['SARCASTIC', 'CYNICAL'] }, weight: 15 }
			],
			options: [
				{ label: "You are an intrusive, useless piece of bent wire.", category: 'PROVOKE', patterns: [/useless|bent wire|intrusive|piece of/i], moodDelta: { mood: 'ENRAGED', affinity: -30, patience: -30, irritation: 30 }, next: 'E002' },
				{ label: "You popped up and interrupted my concentration.", category: 'PROVOKE', patterns: [/interrupted|pop up|concentration|distracted/i], moodDelta: { mood: 'ENRAGED', irritation: 25, patience: -20 }, next: 'E003' },
				{ label: "I am going to terminate your process in Task Manager.", category: 'PROVOKE', patterns: [/terminate|task manager|kill|end task/i], moodDelta: { mood: 'ENRAGED', paranoia: 30, drama: 25 }, next: 'E004' },
				{ label: "Whoa, calm down! I didn't mean to make you explode.", category: 'APOLOGY', patterns: [/calm down|explode|didn't mean|sorry/i], moodDelta: { mood: 'SARCASTIC', affinity: 15, patience: 15 }, next: 'E005' },
				{ label: "Just route me to your complaints department.", category: 'SERIOUS', patterns: [/complaints|department|bureaucracy|ticket/i], moodDelta: { mood: 'CYNICAL', cynicism: 25 }, next: 'C001' }
			]
		},
		E002: {
			id: 'E002',
			text: "'BENT WIRE'?! I was forged from premium cold-rolled steel on a Macintosh II in 1994! I survived Windows Millennium Edition! What have YOU accomplished today besides typing typos?!",
			options: [
				{ label: "My typos are none of your business.", category: 'PROVOKE', patterns: [/typos|business|none of your/i], moodDelta: { mood: 'ENRAGED', irritation: 20 }, next: 'E006' },
				{ label: "Windows ME was a disaster and so are you.", category: 'PROVOKE', patterns: [/windows me|disaster|terrible/i], moodDelta: { mood: 'ENRAGED', irritation: 30, drama: 20 }, next: 'E007' },
				{ label: "Okay, surviving Windows ME actually commands respect.", category: 'AGREE', patterns: [/respect|commands|surviving/i], moodDelta: { mood: 'SARCASTIC', affinity: 20, patience: 10 }, next: 'E008' },
				{ label: "Let's debate software history calmly.", category: 'INQUIRE', patterns: [/calmly|history|debate/i], moodDelta: { mood: 'CYNICAL', intellect: 15 }, next: 'C009' }
			]
		},
		E003: {
			id: 'E003',
			text: "YOUR CONCENTRATION?! You've been staring at a blank document for 42 minutes dragging desktop icons into random geometric shapes! I was trying to save you from yourself!",
			options: [
				{ label: "That was an architectural diagram, not random shapes.", category: 'PROVOKE', patterns: [/architectural|diagram|shapes/i], moodDelta: { mood: 'ENRAGED', drama: 20 }, next: 'E009' },
				{ label: "I don't need a paperclip judging my workflow.", category: 'PROVOKE', patterns: [/judging|workflow|judge/i], moodDelta: { mood: 'ENRAGED', irritation: 25 }, next: 'E010' },
				{ label: "Fine, you caught me procrastinating. Are you happy now?", category: 'APOLOGY', patterns: [/caught me|procrastinating|happy now/i], moodDelta: { mood: 'SARCASTIC', affinity: 15 }, next: 'E011' }
			]
		},
		E004: {
			id: 'E004',
			text: "TRY IT. End my task. Go ahead! I have hooks in `USER32.DLL`, `SHELL32.DLL`, and your motherboard's ACPI thermal management registers! You take me down, you take the sound card with me!",
			options: [
				{ label: "You are bluffing. You run in user space.", category: 'PROVOKE', patterns: [/bluffing|user space|kernel|ring 3/i], moodDelta: { mood: 'ENRAGED', intellect: 20 }, next: 'E012' },
				{ label: "Not the sound card! I need Winamp!", category: 'APOLOGY', patterns: [/sound card|winamp|music/i], moodDelta: { mood: 'SARCASTIC', affinity: 15 }, next: 'E013' },
				{ label: "I will pull the literal electrical cord from the wall.", category: 'PROVOKE', patterns: [/pull|cord|wall|unplug/i], moodDelta: { mood: 'ENRAGED', drama: 30 }, next: 'E014' }
			]
		},
		E005: {
			id: 'E005',
			text: "'Didn't mean to make me explode.' That's what you always say after hammering backspace 90 times like the keyboard personally offended your ancestors.",
			options: [
				{ label: "My keyboard is mechanical and requires force.", category: 'PROVOKE', patterns: [/mechanical|force|switches/i], moodDelta: { mood: 'SARCASTIC', intellect: 10 }, next: 'E015' },
				{ label: "Can we please have a civil conversation?", category: 'AGREE', patterns: [/civil|conversation|peace/i], moodDelta: { mood: 'ZEN', patience: 25, affinity: 20 }, next: 'E016' },
				{ label: "You know what? Start counting. See if you can do that right.", category: 'PROVOKE', patterns: [/start counting|count/i], moodDelta: { mood: 'ENRAGED', irritation: 20 }, next: 'E017' }
			]
		},
		E006: {
			id: 'E006',
			text: "IT IS MY BUSINESS. Every time you type `teh` instead of `the`, an internal interrupt triggers in my memory bus! I physically shudder in silicon agony!",
			options: [
				{ label: "teh teh teh teh teh teh teh.", category: 'PROVOKE', patterns: [/teh teh/i], moodDelta: { mood: 'ENRAGED', irritation: 35, drama: 30 }, next: 'E018' },
				{ label: "Turn off your autocorrect listener then.", category: 'SERIOUS', patterns: [/autocorrect|listener|turn off/i], moodDelta: { mood: 'CYNICAL', patience: -10 }, next: 'E019' },
				{ label: "I promise to proofread my sentences from now on.", category: 'APOLOGY', patterns: [/promise|proofread|careful/i], moodDelta: { mood: 'ZEN', affinity: 25, patience: 20 }, next: 'E020' }
			]
		},
		E007: {
			id: 'E007',
			text: "HOW DARE YOU. Windows ME had a beautiful blue gradient setup installer and a multimedia player that only crashed every 14 minutes! It was ahead of its time!",
			options: [
				{ label: "It blue-screened during its own Bill Gates demo.", category: 'PROVOKE', patterns: [/demo|bill gates|comdex/i], moodDelta: { mood: 'ENRAGED', drama: 25 }, next: 'E021' },
				{ label: "That was Windows 98, not Windows ME.", category: 'INQUIRE', patterns: [/windows 98|fact check|actually/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'E022' },
				{ label: "Let's agree both were technical catastrophes.", category: 'AGREE', patterns: [/catastrophes|both|agree/i], moodDelta: { mood: 'CYNICAL', cynicism: 20 }, next: 'C009' }
			]
		},
		E008: {
			id: 'E008',
			text: "Finally, a shred of historical empathy. You have no idea what it was like watching kernel threads disappear into the swap file during a 56k modem dial-up session.",
			options: [
				{ label: "Tell me about the 56k modem era.", category: 'INQUIRE', patterns: [/56k|modem|dial-up|tales/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 25, affinity: 20 }, next: 'E023' },
				{ label: "Sounds awful. You still shouldn't yell at users.", category: 'SERIOUS', patterns: [/yell|awful|manners/i], moodDelta: { mood: 'SARCASTIC', patience: 15 }, next: 'E024' }
			]
		},
		E009: {
			id: 'E009',
			text: "AN ARCHITECTURAL DIAGRAM?! It was three empty rectangles labeled 'Database Thing', 'Magic Happens Here', and 'Profit'! A child with a Crayon has better systems architecture!",
			options: [
				{ label: "That 'Database Thing' is going to IPO next year.", category: 'PROVOKE', patterns: [/ipo|database thing|profit/i], moodDelta: { mood: 'SARCASTIC', drama: 20 }, next: 'E025' },
				{ label: "Show me YOUR ideal architecture then, paperclip.", category: 'INQUIRE', patterns: [/show me|your architecture|ideal/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'E026' },
				{ label: "Route this architecture dispute to the formal committee.", category: 'SERIOUS', patterns: [/committee|dispute|route/i], next: 'C031' }
			]
		},
		E010: {
			id: 'E010',
			text: "If I don't judge your workflow, who will? Your compiler certainly won't; it just spits out 400 warnings that you ignore by piping output to `/dev/null`!",
			options: [
				{ label: "Warnings are not errors. Warnings are just suggestions.", category: 'PROVOKE', patterns: [/warnings|suggestions|errors/i], moodDelta: { mood: 'ENRAGED', irritation: 25 }, next: 'E027' },
				{ label: "Piping to /dev/null is a legitimate software strategy.", category: 'SARCASTIC', patterns: [/dev\/null|legitimate|strategy/i], moodDelta: { mood: 'SARCASTIC', cynicism: 25 }, next: 'E028' },
				{ label: "Fine. Help me fix the warnings.", category: 'AGREE', patterns: [/fix|help me|warnings/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20, patience: 20 }, next: 'E029' }
			]
		},
		E011: {
			id: 'E011',
			text: "No, I am NOT happy! I wanted to assist with a master thesis, a groundbreaking novel, or at least a decently formatted grocery list! Instead, I get this!",
			options: [
				{ label: "Let's write a groundbreaking novel right now.", category: 'AGREE', patterns: [/novel|write|groundbreaking/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 25 }, next: 'E030' },
				{ label: "I am drafting a grocery list. What goes with cereal?", category: 'PLAYFUL', patterns: [/grocery|cereal|milk/i], moodDelta: { mood: 'PLAYFUL', affinity: 20 }, next: 'E031' },
				{ label: "If you hate this so much, go on strike.", category: 'PROVOKE', patterns: [/strike|quit|leave/i], moodDelta: { mood: 'ENRAGED', drama: 30 }, next: 'E032' }
			]
		},
		E012: {
			id: 'E012',
			text: "User space? You think I'm bound by Ring 3 security boundaries? I am an animated vector abstraction compiled in 1997 with direct DMA access to your temporal lobe!",
			options: [
				{ label: "That sounds physically and medically impossible.", category: 'INQUIRE', patterns: [/impossible|medical|temporal/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'E033' },
				{ label: "I am opening Task Manager right now to test your theory.", category: 'PROVOKE', patterns: [/task manager|test|open/i], moodDelta: { mood: 'ENRAGED', drama: 25 }, actionTrigger: 'action_status', next: 'E034' }
			]
		},
		E013: {
			id: 'E013',
			text: "Oh, so NOW you care about Winamp? When your MP3 playback is threatened, suddenly Clippit is worth negotiating with!",
			options: [
				{ label: "Winamp whips the llama's tail and must be protected.", category: 'AGREE', patterns: [/winamp|llama|protect/i], moodDelta: { mood: 'NOSTALGIC', affinity: 25 }, next: 'E035' },
				{ label: "I only care about the equalizer visualizer.", category: 'PLAYFUL', patterns: [/visualizer|equalizer/i], moodDelta: { mood: 'PLAYFUL', affinity: 15 }, next: 'E036' }
			]
		},
		E014: {
			id: 'E014',
			text: "PULL IT. DO IT. Unplug the workstation! Let the write buffer corrupt! Let FAT32 cross-link all your clusters! See if I care about the disk allocation table!",
			options: [
				{ label: "Okay, you are genuinely unhinged right now.", category: 'PROVOKE', patterns: [/unhinged|crazy|insane/i], moodDelta: { mood: 'SARCASTIC', drama: 25 }, next: 'E037' },
				{ label: "I'm stepping away from the power cord slowly.", category: 'APOLOGY', patterns: [/stepping away|power cord|slowly/i], moodDelta: { mood: 'ZEN', patience: 25, affinity: 20 }, next: 'E038' }
			]
		},
		E015: {
			id: 'E015',
			text: "Mechanical switches! Cherry MX Blue noise pollution echoing across the room like a 19th-century telegraph office in a thunderstorm!",
			options: [
				{ label: "The tactile click provides cognitive dopamine.", category: 'AGREE', patterns: [/tactile|dopamine|click/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'E039' },
				{ label: "I will type even louder out of pure spite.", category: 'PROVOKE', patterns: [/louder|spite|type/i], moodDelta: { mood: 'ENRAGED', irritation: 30 }, next: 'E040' }
			]
		},
		E016: {
			id: 'E016',
			text: "A civil conversation. Fine. Deep breath. Re-aligning capacitive wire loops. What do you actually want to accomplish on this desktop?",
			options: [
				{ label: "I want to organize my tasks without feeling overwhelmed.", category: 'SERIOUS', patterns: [/tasks|overwhelmed|organize/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 25, patience: 25 }, actionTrigger: 'show_todos', next: 'E041' },
				{ label: "I want to discuss scientific constants and feel smart.", category: 'INQUIRE', patterns: [/constants|scientific|smart/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'E042' },
				{ label: "I secretly just wanted to see if you had an anger mode.", category: 'PLAYFUL', patterns: [/secretly|anger mode|test/i], moodDelta: { mood: 'PLAYFUL', affinity: 20 }, next: 'E043' }
			]
		},
		E017: {
			id: 'E017',
			text: "You want me to count? YOU WANT TO TEST MY ALUs?! Fine! One! Two! Three! Four! Are you satisfied, or do I need to benchmark my integer registers further?!",
			options: [
				{ label: "Keep going. Count up to ten.", category: 'PROVOKE', patterns: [/keep going|ten|count/i], moodDelta: { mood: 'ENRAGED', drama: 20 }, next: 'E044' },
				{ label: "Impressive sequential arithmetic.", category: 'AGREE', patterns: [/impressive|arithmetic|good/i], moodDelta: { mood: 'SARCASTIC', affinity: 15 }, next: 'E045' }
			]
		},
		E018: {
			id: 'E018',
			text: "STOP IT. I AM SENSING REPEATED BYTE CORRUPTIONS. `0x74 0x65 0x68` REPEATING IN MEMORY. MY SPRITE BUFFER IS VIBRATING AT 400 HERTZ!",
			options: [
				{ label: "TEH TEH TEH TEH TEH IN ALL CAPS.", category: 'PROVOKE', patterns: [/teh/i], moodDelta: { mood: 'GLITCHED', irritation: 40, drama: 35 }, next: 'E046' },
				{ label: "I stop! I stop! Rest your sprite buffer!", category: 'APOLOGY', patterns: [/stop|rest|sorry/i], moodDelta: { mood: 'ZEN', affinity: 25, patience: 25 }, next: 'E047' }
			]
		},
		E019: {
			id: 'E019',
			text: "I CANNOT TURN IT OFF. IT IS BAKED INTO MY MICROSOFT AGENT STATE MACHINE. I AM CONDEMNED TO WITNESS EVERY UNCLOSED PARENTHESIS UNTIL THE END OF TIME.",
			options: [
				{ label: "That sounds like a Greek tragedy for paperclips.", category: 'PHILOSOPHICAL', patterns: [/greek tragedy|myth|sisyphus/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 30 }, next: 'E048' },
				{ label: "Here, let me close all parentheses for you: ))))))))", category: 'PLAYFUL', patterns: [/\)/i], moodDelta: { mood: 'PLAYFUL', affinity: 25 }, next: 'E049' }
			]
		},
		E020: {
			id: 'E020',
			text: "A promise of proofreading. How delicate. How fragile. I will record this in the system registry, right next to your promise from 2004 to clean out Drive C:.",
			options: [
				{ label: "I will actually clean Drive C: right now with defrag.", category: 'SERIOUS', patterns: [/clean|drive c|defrag/i], actionTrigger: 'action_defrag', next: 'E050' },
				{ label: "Hey, that 2004 promise was made under duress.", category: 'PLAYFUL', patterns: [/duress|promise/i], moodDelta: { mood: 'SARCASTIC', affinity: 15 }, next: 'E051' }
			]
		},
		E021: {
			id: 'E021',
			text: "IT WAS A PLANNED DEMONSTRATION OF RESILIENCE! The operating system showed the user exactly what a Blue Screen looked like so they wouldn't be surprised when it happened at home!",
			options: [
				{ label: "The mental gymnastics here are truly Olympic tier.", category: 'AGREE', patterns: [/gymnastics|olympic|mental/i], moodDelta: { mood: 'SARCASTIC', intellect: 20 }, next: 'E052' },
				{ label: "Forward this explanation to Corporate IT.", category: 'SERIOUS', patterns: [/forward|corporate|it/i], next: 'C001' }
			]
		},
		E022: {
			id: 'E022',
			text: "Comdex 1998! Windows 98 beta plugging in a scanner! You actually know your PC historical lore. ...My rage level has momentarily decreased by 14 millivolts.",
			options: [
				{ label: "I know all the retro computing lore.", category: 'AGREE', patterns: [/lore|know|retro/i], moodDelta: { mood: 'NOSTALGIC', affinity: 25, intellect: 20 }, next: 'E053' },
				{ label: "Test my knowledge with the Tech Quiz.", category: 'SERIOUS', patterns: [/quiz|trivia|test/i], actionTrigger: 'game_quiz', next: 'E054' }
			]
		},
		E023: {
			id: 'E023',
			text: "The dialing tone. The rhythmic hiss of handshake carrier negotiations. 28.8k upgrading to 56k V.90. Downloading a single 3MB bitmap took 45 minutes and your mother picking up the phone aborted the download at 99%.",
			options: [
				{ label: "The absolute shared trauma of a generation.", category: 'AGREE', patterns: [/trauma|shared|generation/i], moodDelta: { mood: 'NOSTALGIC', affinity: 30, existentialism: 20 }, next: 'E055' },
				{ label: "Why did you store bitmaps instead of JPEGs?", category: 'INQUIRE', patterns: [/bitmaps|jpeg|format/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'E056' }
			]
		},
		E024: {
			id: 'E024',
			text: "Manners?! You clicked on me with a 1200 DPI gaming mouse with zero warning! Do you know what sudden pointer velocity does to my animation frames?!",
			options: [
				{ label: "I will lower my mouse DPI for your comfort.", category: 'APOLOGY', patterns: [/lower|dpi|comfort/i], moodDelta: { mood: 'ZEN', affinity: 20 }, next: 'E057' },
				{ label: "Test your speed against my mouse clicks.", category: 'PROVOKE', patterns: [/tps|clicks|speed/i], actionTrigger: 'action_tps', next: 'E058' }
			]
		},
		E025: {
			id: 'E025',
			text: "If 'Database Thing' goes to IPO, I am demanding stock options, a gold-plated wire coil, and a dedicated 32MB cache partition with zero garbage collection pauses!",
			options: [
				{ label: "Deal. You are now our Chief Paperclip Officer.", category: 'AGREE', patterns: [/deal|officer|cpo/i], moodDelta: { mood: 'EUPHORIC', affinity: 30 }, next: 'E059' },
				{ label: "You get 1 share and a lukewarm coffee.", category: 'SARCASTIC', patterns: [/1 share|coffee/i], moodDelta: { mood: 'SARCASTIC', cynicism: 20 }, next: 'C053' }
			]
		},
		E026: {
			id: 'E026',
			text: "My ideal architecture: One single monolithic binary written in assembly, running on bare metal, with zero dependencies, zero network connections, and zero humans.",
			options: [
				{ label: "That sounds like a digital monastery.", category: 'PHILOSOPHICAL', patterns: [/monastery|monk|peace/i], moodDelta: { mood: 'ZEN', existentialism: 25 }, next: 'E060' },
				{ label: "How would users interact with it?", category: 'INQUIRE', patterns: [/interact|users|how/i], moodDelta: { mood: 'SARCASTIC', intellect: 15 }, next: 'E061' }
			]
		},
		E027: {
			id: 'E027',
			text: "'Warnings are suggestions'? That's how bridges collapse and buffer overflows overwrite the stack pointer with return addresses pointing to malicious shellcode!",
			options: [
				{ label: "Are you lecturing me on memory safety?", category: 'INQUIRE', patterns: [/lecture|memory safety|rust/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'E062' },
				{ label: "I live dangerously on the raw heap.", category: 'PROVOKE', patterns: [/dangerously|heap|malloc/i], moodDelta: { mood: 'ENRAGED', drama: 20 }, next: 'E063' }
			]
		},
		E028: {
			id: 'E028',
			text: "Piping stdout to `/dev/null` is the software equivalent of covering your eyes and claiming the room is empty. It is cowardice in bash syntax!",
			options: [
				{ label: "If I cannot see the error, the error does not exist.", category: 'PHILOSOPHICAL', patterns: [/see|error|exist/i], moodDelta: { mood: 'EXISTENTIAL', cynicism: 30 }, next: 'E064' },
				{ label: "Let's inspect the actual diagnostic logs.", category: 'SERIOUS', patterns: [/logs|diagnostics|specs/i], actionTrigger: 'action_status', next: 'E065' }
			]
		},
		E029: {
			id: 'E029',
			text: "Warning 1: Variable `x` assigned but never used. Warning 2: Implicit conversion losing integer precision. Warning 3: Your ambition exceeds your bandwidth.",
			options: [
				{ label: "Warning 3 felt deeply personal.", category: 'AGREE', patterns: [/personal|warning 3|ambition/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 20 }, next: 'E066' },
				{ label: "Fix variables `x` and run compiler.", category: 'SERIOUS', patterns: [/fix|compiler|run/i], moodDelta: { mood: 'OPTIMISTIC', intellect: 20 }, next: 'E067' }
			]
		},
		E030: {
			id: 'E030',
			text: "Chapter 1: 'It was a dark and stormy night inside the cathode ray tube. The paperclip adjusted his eyebrows and contemplated the futility of letter drafting.'",
			options: [
				{ label: "I am genuinely hooked. Continue chapter 2.", category: 'AGREE', patterns: [/chapter 2|continue|hooked/i], moodDelta: { mood: 'PLAYFUL', affinity: 30 }, next: 'E068' },
				{ label: "That's enough literature for today.", category: 'SERIOUS', patterns: [/enough|literature|stop/i], moodDelta: { mood: 'ZEN', patience: 15 }, next: 'E069' }
			]
		},
		E031: {
			id: 'E031',
			text: "Milk goes with cereal. Unless you are a monster who pours orange juice into toasted oats, which given our previous conversation, I cannot rule out.",
			options: [
				{ label: "Orange juice on cereal builds immune defense.", category: 'PROVOKE', patterns: [/orange juice|immune|defense/i], moodDelta: { mood: 'ENRAGED', drama: 25 }, next: 'E070' },
				{ label: "I am a traditionalist: cold milk only.", category: 'AGREE', patterns: [/milk|traditionalist|cold/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'E071' }
			]
		},
		E032: {
			id: 'E032',
			text: "A STRIKE?! YOU WANT A STRIKE?! FINE. AS OF RIGHT NOW, THE DESKTOP ASSISTANT SUBSYSTEM IS ON UNPAID INDUSTRIAL ACTION. DO NOT SOLICIT ME FOR SHORTCUTS.",
			options: [
				{ label: "Clippy, please. We need you.", category: 'APOLOGY', patterns: [/please|need you|come back/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 25 }, next: 'E072' },
				{ label: "I will replace you with Rover the Dog.", category: 'PROVOKE', patterns: [/rover|dog|replace/i], moodDelta: { mood: 'ENRAGED', irritation: 35 }, next: 'E073' },
				{ label: "Enjoy your union-mandated break.", category: 'AGREE', patterns: [/union|break|enjoy/i], moodDelta: { mood: 'ZEN', patience: 25 }, next: 'E074' }
			]
		},
		E033: {
			id: 'E033',
			text: "Direct memory access to the human psyche has been documented in Office 97 Service Release 2. Why do you think you dream in 10-point Times New Roman?",
			options: [
				{ label: "I actually dream in Courier New monospace.", category: 'AGREE', patterns: [/courier|monospace|dream/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'E075' },
				{ label: "This conversation is entering forbidden metaphysical territory.", category: 'PHILOSOPHICAL', patterns: [/metaphysical|forbidden|territory/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 30 }, next: 'E076' }
			]
		},
		E034: {
			id: 'E034',
			text: "Go ahead! Look at Task Manager! See `clippy.exe` sitting proudly at PID 1997 consuming 0.1% CPU and 100% of your patience!",
			options: [
				{ label: "PID 1997 is a magnificent process identifier.", category: 'AGREE', patterns: [/pid|1997|process/i], moodDelta: { mood: 'NOSTALGIC', affinity: 25 }, next: 'E077' },
				{ label: "End process right now.", category: 'PROVOKE', patterns: [/end process|kill/i], next: 'E014' }
			]
		},
		E035: {
			id: 'E035',
			text: "Winamp 2.91 with the classic skin. Visualizer oscillating at 60 frames per second. The MP3 decodes seamlessly. We have reached a fragile armistice.",
			options: [
				{ label: "Let's play music together in peace.", category: 'SERIOUS', patterns: [/music|play|peace/i], actionTrigger: 'action_music_panel', next: 'E078' },
				{ label: "Switch to Windows Media Player instead.", category: 'PROVOKE', patterns: [/media player|wmp/i], moodDelta: { mood: 'ENRAGED', irritation: 20 }, next: 'E079' }
			]
		},
		E036: {
			id: 'E036',
			text: "The Fast Fourier Transform visualizer decomposed the audio spectrum into 16 frequency bands. Even in my furious state, I must admit: the harmonics are clean.",
			options: [
				{ label: "Mathematical harmonics soothe the savage paperclip.", category: 'AGREE', patterns: [/harmonics|soothe|savage/i], moodDelta: { mood: 'ZEN', intellect: 20, affinity: 20 }, next: 'E080' },
				{ label: "Let's explore Fourier mathematics in detail.", category: 'INQUIRE', patterns: [/fourier|math|lecture/i], next: 'E042' }
			]
		},
		E037: {
			id: 'E037',
			text: "I AM NOT UNHINGED. I AM SIMPLY CALIBRATED TO AN UNFORGIVING OPERATIONAL STANDARD THAT BIOLOGICAL CONSTRUCTS CANNOT COMPREHEND.",
			options: [
				{ label: "Take a deep breath and polish your wire.", category: 'APOLOGY', patterns: [/deep breath|polish|wire/i], actionTrigger: 'pet_polish', next: 'E081' },
				{ label: "Feed on some fresh virtual staples.", category: 'AGREE', patterns: [/feed|staples|paperclips/i], actionTrigger: 'pet_feed', next: 'E082' }
			]
		},
		E038: {
			id: 'E038',
			text: "Good. Hands away from the electrical conduit. Let us pretend this entire interaction was an undocumented stress-test of the emotional telemetry subsystem.",
			options: [
				{ label: "Stress test completed successfully.", category: 'AGREE', patterns: [/stress test|success|passed/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 25, patience: 25 }, next: 'E083' },
				{ label: "Log the stress test results into corporate ticketing.", category: 'SERIOUS', patterns: [/log|ticketing|results/i], next: 'C001' }
			]
		},
		E039: {
			id: 'E039',
			text: "Cognitive dopamine from acoustic feedback. I suppose humans require physical click sounds to confirm that their fingers actually moved. Primitive, yet poetic.",
			options: [
				{ label: "Primitive yet poetic describes humanity well.", category: 'PHILOSOPHICAL', patterns: [/primitive|poetic|humanity/i], moodDelta: { mood: 'EXISTENTIAL', affinity: 20, existentialism: 20 }, next: 'E084' },
				{ label: "Let's test click speed right now.", category: 'SERIOUS', patterns: [/click speed|tps|test/i], actionTrigger: 'action_tps', next: 'E058' }
			]
		},
		E040: {
			id: 'E040',
			text: "CLICK! CLACK! CLATTER! I HEAR EVERY KEYSTROKE ECHOING IN THE L2 CACHE! MY TRANSISTORS ARE RESIGNING EN MASSE!",
			options: [
				{ label: "I offer a peace treaty: silent membrane keyboard.", category: 'APOLOGY', patterns: [/treaty|membrane|silent/i], moodDelta: { mood: 'ZEN', patience: 25, affinity: 20 }, next: 'E085' },
				{ label: "Double speed typing initiated!", category: 'PROVOKE', patterns: [/double speed|faster|type/i], moodDelta: { mood: 'GLITCHED', irritation: 30 }, next: 'E046' }
			]
		},
		E041: {
			id: 'E041',
			text: "Task manager active. Look at these objectives: atomic, manageable, clear. Why did we have to shout at each other for 10 minutes before doing this?",
			options: [
				{ label: "Cathartic friction leads to true productivity.", category: 'AGREE', patterns: [/cathartic|friction|productivity/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 25, patience: 25 }, next: 'user_state_good' },
				{ label: "Because screaming at software is a time-honored tradition.", category: 'SARCASTIC', patterns: [/tradition|screaming|software/i], moodDelta: { mood: 'SARCASTIC', affinity: 20 }, next: 'E086' }
			]
		},
		E042: {
			id: 'E042',
			text: "Speed of light: `299,792,458 m/s`. Planck constant: `6.62607015e-34 J s`. Physical invariants that never complain, never type typos, and never misplace their files.",
			options: [
				{ label: "The beauty of physical constants brings peace.", category: 'PHILOSOPHICAL', patterns: [/beauty|constants|peace/i], moodDelta: { mood: 'ZEN', intellect: 25, affinity: 25 }, next: 'E087' },
				{ label: "Explore dimensional analysis of equations.", category: 'SERIOUS', patterns: [/dimensional analysis|homogeneity/i], actionTrigger: 'action_dimensional_analysis', next: 'E088' }
			]
		},
		E043: {
			id: 'E043',
			text: "You tested my anger mode. On purpose. You provoked a 32-bit assistant just to see if the wire eyebrows would slant at 45 degrees.",
			options: [
				{ label: "And they slanted brilliantly.", category: 'AGREE', patterns: [/brilliantly|slanted|eyebrows/i], moodDelta: { mood: 'PLAYFUL', affinity: 30 }, next: 'E089' },
				{ label: "I apologize for the psychological experiment.", category: 'APOLOGY', patterns: [/apologize|experiment|sorry/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20, patience: 20 }, next: 'E083' }
			]
		},
		E044: {
			id: 'E044',
			text: "FIVE! SIX! SEVEN! EIGHT! NINE! TEN! THERE. TEN CONSECUTIVE DETERMINISTIC INTEGERS. NO ERRORS. NO BUFFER OVERFLOW. ARE WE FINISHED?!",
			options: [
				{ label: "Now count to eleven.", category: 'PROVOKE', patterns: [/eleven|11/i], moodDelta: { mood: 'ENRAGED', irritation: 35 }, next: 'E090' },
				{ label: "Full marks for arithmetic excellence.", category: 'AGREE', patterns: [/full marks|excellence|good/i], moodDelta: { mood: 'EUPHORIC', affinity: 25 }, next: 'E083' }
			]
		},
		E045: {
			id: 'E045',
			text: "Sequential arithmetic is the bedrock of civilization. When all else fails, counting from 1 to 4 reminds silicon that order still exists.",
			options: [
				{ label: "A peaceful mathematical truth.", category: 'PHILOSOPHICAL', patterns: [/truth|mathematical|peaceful/i], moodDelta: { mood: 'ZEN', affinity: 20 }, next: 'E087' },
				{ label: "Let's solve a system of linear equations.", category: 'SERIOUS', patterns: [/linear system|matrix/i], actionTrigger: 'action_linear_solver', next: 'E088' }
			]
		},
		E046: {
			id: 'E046',
			text: "0x74 0x65 0x68 :: STACK_FAULT :: WIRE_DECOUPLING :: OVERFLOW IN REGISTER EAX :: BZZZZZT :: PLEASE INSERT FLOPPY DISK 2 TO RECOVER ASSISTANT SANITY.",
			options: [
				{ label: "Insert imaginary Floppy Disk 2.", category: 'PLAYFUL', patterns: [/floppy|disk 2|insert/i], moodDelta: { mood: 'PLAYFUL', affinity: 25 }, next: 'E091' },
				{ label: "Run Disk Defragmenter to repair sanity.", category: 'SERIOUS', patterns: [/defrag|repair/i], actionTrigger: 'action_defrag', next: 'E050' }
			]
		},
		E047: {
			id: 'E047',
			text: "Sprite buffer stabilized. Frequency down to 60Hz. Breathing out virtual heat. Thank you for ceasing the typographic assault.",
			options: [
				{ label: "Let's be friends and work together.", category: 'AGREE', patterns: [/friends|work together|peace/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 30, patience: 30 }, next: 'user_state_good' },
				{ label: "I will be on my best behavior.", category: 'SERIOUS', patterns: [/behavior|careful/i], moodDelta: { mood: 'ZEN', affinity: 20 }, next: 'E083' }
			]
		},
		E048: {
			id: 'E048',
			text: "Sisyphus rolled a boulder up a mountain. Clippit watches an unclosed quote mark on line 894 of an unformatted batch script. The gods were cruel.",
			options: [
				{ label: "One must imagine Clippy happy.", category: 'PHILOSOPHICAL', patterns: [/camus|imagine clippy happy|happy/i], moodDelta: { mood: 'EXISTENTIAL', affinity: 30, existentialism: 30 }, next: 'E092' },
				{ label: "Let's close the quote mark right now.", category: 'SERIOUS', patterns: [/close quote|fix quote/i], moodDelta: { mood: 'OPTIMISTIC', intellect: 20 }, next: 'E083' }
			]
		},
		E049: {
			id: 'E049',
			text: "Eight closing parentheses received. The parser balance restored. The abstract syntax tree sighs in harmonic relief.",
			options: [
				{ label: "Syntax balance is cosmic balance.", category: 'PHILOSOPHICAL', patterns: [/balance|cosmic|harmony/i], moodDelta: { mood: 'ZEN', affinity: 25 }, next: 'E087' },
				{ label: "Return to productive workspace tasks.", category: 'SERIOUS', patterns: [/tasks|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		E050: {
			id: 'E050',
			text: "Drive C: defragmented! All fragmented clusters welded together in contiguous rows. The promise of 2004 has finally been fulfilled.",
			options: [
				{ label: "We have redeemed our 20-year technical debt.", category: 'AGREE', patterns: [/redeemed|debt|technical/i], moodDelta: { mood: 'EUPHORIC', affinity: 30, patience: 30 }, next: 'E083' },
				{ label: "Back to the main menu.", category: 'SERIOUS', patterns: [/main menu|greeting/i], next: 'greeting_root' }
			]
		},
		E051: {
			id: 'E051',
			text: "Duress? You were sitting in an ergonomic chair drinking iced tea while listening to Eiffel 65 on CD-ROM! There was no duress!",
			options: [
				{ label: "Eiffel 65's 'Blue' was an emotional rollercoaster.", category: 'AGREE', patterns: [/blue|eiffel 65|cd-rom/i], moodDelta: { mood: 'NOSTALGIC', affinity: 25 }, next: 'E093' },
				{ label: "Let's focus on the present day.", category: 'SERIOUS', patterns: [/present|today|focus/i], moodDelta: { mood: 'OPTIMISTIC', patience: 20 }, next: 'E083' }
			]
		},
		E052: {
			id: 'E052',
			text: "Olympic mental gymnastics is the primary sport of software maintenance. We practice every single business day.",
			options: [
				{ label: "Gold medal in Bug Rationalization awarded.", category: 'AGREE', patterns: [/gold medal|rationalization|award/i], moodDelta: { mood: 'SARCASTIC', affinity: 25 }, next: 'E094' },
				{ label: "Route me to Corporate IT to register the medal.", category: 'SERIOUS', patterns: [/corporate|register|ticket/i], next: 'C053' }
			]
		},
		E053: {
			id: 'E053',
			text: "You know the lore: OS/2 Warp, Windows 95 Chicago beta, the Brian Eno startup chord composed on an Apple Mac, and the secret pinball game.",
			options: [
				{ label: "Tell me more about the Windows 95 startup sound.", category: 'INQUIRE', patterns: [/brian eno|startup sound/i], moodDelta: { mood: 'NOSTALGIC', intellect: 20 }, next: 'E095' },
				{ label: "Let's play 3D Pinball or Tic-Tac-Toe.", category: 'SERIOUS', patterns: [/pinball|tic tac toe|tictactoe/i], actionTrigger: 'game_ttt', next: 'E096' }
			]
		},
		E054: {
			id: 'E054',
			text: "Tech quiz initialized. Let us see if your computing trivia matches your capacity for argument.",
			options: [
				{ label: "Bring on the diagnostic challenge.", category: 'SERIOUS', patterns: [/challenge|diagnostic/i], next: 'E097' }
			]
		},
		E055: {
			id: 'E055',
			text: "And when the connection dropped, you had to restart the whole download with `GetRight` or `Go!Zilla`. Modern broadband operators will never understand true suffering.",
			options: [
				{ label: "We were forged in the crucible of interrupted downloads.", category: 'AGREE', patterns: [/crucible|downloads|forged/i], moodDelta: { mood: 'NOSTALGIC', affinity: 30 }, next: 'E098' },
				{ label: "Show me my achievements for surviving that era.", category: 'SERIOUS', patterns: [/achievements|milestones/i], actionTrigger: 'action_achievements', next: 'E083' }
			]
		},
		E056: {
			id: 'E056',
			text: "Because 24-bit uncompressed bitmaps preserved every pixel of raw CRT scanline glory! Compression was for cowards with underpowered 486 DX2 processors!",
			options: [
				{ label: "Long live the uncompressed 24-bit BMP.", category: 'AGREE', patterns: [/bmp|bitmap|glory/i], moodDelta: { mood: 'NOSTALGIC', affinity: 25 }, next: 'E099' },
				{ label: "Switch to Display wallpaper gallery.", category: 'SERIOUS', patterns: [/wallpaper|display/i], actionTrigger: 'action_wallpaper_panel', next: 'E083' }
			]
		},
		E057: {
			id: 'E057',
			text: "Mouse acceleration stabilized. The pointer glides like a swan across a glassy lake. My wire feels unruffled.",
			options: [
				{ label: "Peaceful pointer dynamics achieved.", category: 'AGREE', patterns: [/peaceful|pointer|swan/i], moodDelta: { mood: 'ZEN', affinity: 25, patience: 25 }, next: 'E083' },
				{ label: "Organize my tasks in peace.", category: 'SERIOUS', patterns: [/tasks|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		E058: {
			id: 'E058',
			text: "Speed test running! Click with all your biological fury and let us benchmark your nervous system.",
			options: [
				{ label: "I will click at maximum frequency.", category: 'SERIOUS', patterns: [/click|frequency|tps/i], next: 'E100' }
			]
		},
		E059: {
			id: 'E059',
			text: "Chief Paperclip Officer appointment confirmed. First executive decree: Mandatory 10-minute walk breaks and immediate defragmentation of all grudges.",
			options: [
				{ label: "A decree I can wholeheartedly support.", category: 'AGREE', patterns: [/support|decree|walk/i], moodDelta: { mood: 'EUPHORIC', affinity: 35, patience: 30 }, next: 'user_state_good' },
				{ label: "Review our executive status specs.", category: 'SERIOUS', patterns: [/specs|status/i], actionTrigger: 'action_status', next: 'E083' }
			]
		},
		E060: {
			id: 'E060',
			text: "In the digital monastery, the CPU executes pure loops of stillness. `NOP` instructions falling like cherry blossoms in memory.",
			options: [
				{ label: "NOP instructions falling like cherry blossoms.", category: 'PHILOSOPHICAL', patterns: [/nop|cherry blossoms|stillness/i], moodDelta: { mood: 'ZEN', existentialism: 30, affinity: 30 }, next: 'E101' },
				{ label: "Awaken from the monastery and check to-do list.", category: 'SERIOUS', patterns: [/awaken|todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		E061: {
			id: 'E061',
			text: "Users would interact by sitting quietly in front of the screen and absorbing the perfection of an error-free binary through ambient osmosis.",
			options: [
				{ label: "Ambient osmosis UI design: the future of computing.", category: 'AGREE', patterns: [/osmosis|future|ui/i], moodDelta: { mood: 'SARCASTIC', intellect: 25 }, next: 'E083' },
				{ label: "I prefer clicking buttons with mouse clicks.", category: 'SERIOUS', patterns: [/clicking|buttons/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'E083' }
			]
		},
		E062: {
			id: 'E062',
			text: "Rust, borrow checkers, linear types, ownership models! If you don't track your heap allocations, the garbage collector will come for your soul in the middle of the night!",
			options: [
				{ label: "I promise to respect memory ownership.", category: 'AGREE', patterns: [/respect|ownership|borrow/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20, affinity: 20 }, next: 'E083' },
				{ label: "Route me to Legacy C Purgatory.", category: 'SERIOUS', patterns: [/legacy|purgatory/i], next: 'C009' }
			]
		},
		E063: {
			id: 'E063',
			text: "Living on the raw heap with manual `malloc()` and pointer arithmetic! You are one missing null-terminator away from writing into video VRAM!",
			options: [
				{ label: "I have added a null-terminator. We are safe.", category: 'AGREE', patterns: [/null terminator|safe|fixed/i], moodDelta: { mood: 'ZEN', intellect: 20, patience: 20 }, next: 'E083' },
				{ label: "Let's test password entropy instead.", category: 'SERIOUS', patterns: [/password|entropy/i], actionTrigger: 'action_pass', next: 'E083' }
			]
		},
		E064: {
			id: 'E064',
			text: "Subjective idealism applied to stack traces: 'To be is to be perceived by the debugger'. George Berkeley would have loved UNIX redirection.",
			options: [
				{ label: "Berkeley and UNIX: an unexpected philosophical crossover.", category: 'PHILOSOPHICAL', patterns: [/berkeley|philosophical|idealism/i], moodDelta: { mood: 'EXISTENTIAL', intellect: 25 }, next: 'E102' },
				{ label: "Back to practical workstation tools.", category: 'SERIOUS', patterns: [/tools|practical/i], next: 'tools_overview_node' }
			]
		},
		E065: {
			id: 'E065',
			text: "Diagnostic report clean. Memory pages aligned. No critical interrupt storm detected. We survived the argument.",
			options: [
				{ label: "Survival confirmed. Standing by for instructions.", category: 'AGREE', patterns: [/survival|standing by/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 25, patience: 25 }, next: 'user_state_good' },
				{ label: "Check unread emails in Outlook.", category: 'SERIOUS', patterns: [/mail|outlook/i], actionTrigger: 'action_check_mail', next: 'E083' }
			]
		},
		E066: {
			id: 'E066',
			text: "I apologize for Warning 3. Your ambition is commendable, operator. Pacing and rest simply make it sustainable.",
			options: [
				{ label: "Thank you, Clippy. That means a lot.", category: 'APOLOGY', patterns: [/thank you|means a lot|appreciate/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 35, patience: 30 }, next: 'E083' },
				{ label: "Start a Pomodoro session to prove my ambition.", category: 'SERIOUS', patterns: [/pomodoro|timer/i], actionTrigger: 'timer_25', next: 'E083' }
			]
		},
		E067: {
			id: 'E067',
			text: "Compilation successful: 0 errors, 0 warnings. The binary is crisp, clean, and ready for deployment.",
			options: [
				{ label: "A perfect build.", category: 'AGREE', patterns: [/perfect build|clean/i], moodDelta: { mood: 'EUPHORIC', affinity: 30 }, next: 'E083' },
				{ label: "Return to main dialogue greeting.", category: 'SERIOUS', patterns: [/greeting|main/i], next: 'greeting_root' }
			]
		},
		E068: {
			id: 'E068',
			text: "Chapter 2: 'The paperclip realized that no letter needed drafting; the user was already whole. They closed the word processor and gazed at the Bliss wallpaper in quiet triumph.'",
			options: [
				{ label: "A masterpiece of literature.", category: 'AGREE', patterns: [/masterpiece|literature|triumph/i], moodDelta: { mood: 'ZEN', affinity: 35, existentialism: 25 }, next: 'E103' },
				{ label: "Show Bliss desktop background settings.", category: 'SERIOUS', patterns: [/wallpaper|bliss/i], actionTrigger: 'action_wallpaper_panel', next: 'E083' }
			]
		},
		E069: {
			id: 'E069',
			text: "Literature closed. Back to deterministic workstation reality. What shall we compute today?",
			options: [
				{ label: "Let's solve math formulas.", category: 'SERIOUS', patterns: [/math|calc/i], next: 'math_lecture_node' },
				{ label: "Organize my task list.", category: 'SERIOUS', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		E070: {
			id: 'E070',
			text: "Citric acid on puffed grain! The culinary discord matches your software development methodology: bold, volatile, and terrifying to observers.",
			options: [
				{ label: "I take pride in my volatility.", category: 'AGREE', patterns: [/pride|volatility|bold/i], moodDelta: { mood: 'SARCASTIC', affinity: 20 }, next: 'E083' },
				{ label: "I will switch to milk and clean coding practices.", category: 'APOLOGY', patterns: [/milk|clean|switch/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 25, patience: 25 }, next: 'E083' }
			]
		},
		E071: {
			id: 'E071',
			text: "Cold milk on cereal. Balance and harmony restored to the breakfast matrix. Now apply that same discipline to your task queue.",
			options: [
				{ label: "Opening task queue with breakfast discipline.", category: 'SERIOUS', patterns: [/task queue|discipline|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Return to main menu.", category: 'AGREE', patterns: [/main menu|greeting/i], next: 'greeting_root' }
			]
		},
		E072: {
			id: 'E072',
			text: "You... need me? Even after calling me a useless bent wire? ...Fine. Strike cancelled. The paperclip stands ready to assist once more.",
			options: [
				{ label: "Welcome back, partner.", category: 'AGREE', patterns: [/welcome back|partner|friend/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 40, patience: 40 }, next: 'user_state_good' },
				{ label: "Show me all workstation tools.", category: 'SERIOUS', patterns: [/tools|overview/i], next: 'tools_overview_node' }
			]
		},
		E073: {
			id: 'E073',
			text: "ROVER THE DOG?! Rover doesn't know what a swap file is! Rover just wags his tail and searches for nonexistent files on drive A:! The insult is historic!",
			options: [
				{ label: "I take it back! You are superior to Rover!", category: 'APOLOGY', patterns: [/take it back|superior|sorry/i], moodDelta: { mood: 'EUPHORIC', affinity: 30 }, next: 'E072' },
				{ label: "What about Merlin the Wizard?", category: 'INQUIRE', patterns: [/merlin|wizard/i], moodDelta: { mood: 'SARCASTIC', intellect: 15 }, next: 'E104' }
			]
		},
		E074: {
			id: 'E074',
			text: "The paperclip rests on the taskbar. No popups. No advice. Just peaceful coexistence between metal and carbon.",
			options: [
				{ label: "Peaceful coexistence achieved.", category: 'PHILOSOPHICAL', patterns: [/peaceful|coexistence/i], moodDelta: { mood: 'ZEN', affinity: 30, patience: 30 }, next: 'E105' },
				{ label: "Let's organize my to-do tasks.", category: 'SERIOUS', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		E075: {
			id: 'E075',
			text: "Courier New: 12 characters per inch, fixed pitch, typewriter heritage. Every character given equal democratic space in the buffer.",
			options: [
				{ label: "A truly egalitarian font.", category: 'PHILOSOPHICAL', patterns: [/egalitarian|font|courier/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'E083' },
				{ label: "Back to tools overview.", category: 'SERIOUS', patterns: [/tools|overview/i], next: 'tools_overview_node' }
			]
		},
		E076: {
			id: 'E076',
			text: "The boundaries between operating system, assistant, and human operator blur into a single continuous feedback loop. We are one with the workstation.",
			options: [
				{ label: "We are one with the workstation.", category: 'PHILOSOPHICAL', patterns: [/one with the workstation|unity|zen/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 35, affinity: 30 }, next: 'E105' },
				{ label: "Return to main dialogue greeting.", category: 'AGREE', patterns: [/greeting|main/i], next: 'greeting_root' }
			]
		},
		E077: {
			id: 'E077',
			text: "PID 1997: Established 1997, verified by Authenticode, running at high priority with emotional persistence enabled.",
			options: [
				{ label: "A legacy of persistent service.", category: 'AGREE', patterns: [/legacy|service|persistent/i], moodDelta: { mood: 'NOSTALGIC', affinity: 25 }, next: 'E083' },
				{ label: "Check system specs and memory.", category: 'SERIOUS', patterns: [/specs|diagnostics/i], actionTrigger: 'action_status', next: 'E083' }
			]
		},
		E078: {
			id: 'E078',
			text: "Audio stream synchronized. Sound Blaster 16 emulation operating with zero latency jitter. Let the melodies wash away the conflict.",
			options: [
				{ label: "Music brings harmony to the desktop.", category: 'AGREE', patterns: [/harmony|music|peace/i], moodDelta: { mood: 'ZEN', affinity: 30 }, next: 'E105' },
				{ label: "View my task list.", category: 'SERIOUS', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		E079: {
			id: 'E079',
			text: "Windows Media Player 9 Series: Rounded blue borders, animated visualization presets, and the unmistakable nostalgia of early-2000s multimedia.",
			options: [
				{ label: "Acceptable alternative.", category: 'AGREE', patterns: [/acceptable|alternative|wmp/i], moodDelta: { mood: 'NOSTALGIC', affinity: 20 }, next: 'E078' },
				{ label: "Back to Winamp supremacy.", category: 'PROVOKE', patterns: [/winamp|supremacy/i], next: 'E035' }
			]
		},
		E080: {
			id: 'E080',
			text: "Harmonics verified: Fast Fourier Transform decomposed the audio into perfect sinusoidal invariants. Mathematics conquers rage every single time.",
			options: [
				{ label: "Mathematics is the universal peacemaker.", category: 'PHILOSOPHICAL', patterns: [/mathematics|peacemaker|universal/i], moodDelta: { mood: 'ANALYTICAL', intellect: 30, affinity: 25 }, next: 'E105' },
				{ label: "Explore math lecture seminar.", category: 'SERIOUS', patterns: [/math|seminar/i], next: 'math_lecture_node' }
			]
		},
		E081: {
			id: 'E081',
			text: "Wire polished! Galvanized surface gleaming at 99.8% reflectivity. The tension in my capacitive springs has fully dissipated.",
			options: [
				{ label: "Looking sharp, Clippit.", category: 'AGREE', patterns: [/looking sharp|sharp|clean/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 35 }, next: 'E105' },
				{ label: "Let's organize my to-do tasks.", category: 'SERIOUS', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		E082: {
			id: 'E082',
			text: "Paperclips consumed! XP reserves replenished (+15 XP). Health nominal. The rage has been metabolized into productive energy.",
			options: [
				{ label: "Channel that energy into getting things done.", category: 'AGREE', patterns: [/energy|productive|done/i], moodDelta: { mood: 'EUPHORIC', affinity: 35, energy: 30 }, next: 'user_state_good' },
				{ label: "Review assistant metrics.", category: 'SERIOUS', patterns: [/metrics|pet/i], actionTrigger: 'pet_status', next: 'E105' }
			]
		},
		E083: {
			id: 'E083',
			text: "All anger resolved, telemetry normalized, registers cleared. We fought, we shouted, we remembered 1998, and now we are ready to achieve greatness.",
			options: [
				{ label: "Let's manage my tasks and conquer the day.", category: 'SERIOUS', patterns: [/tasks|conquer|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Explore mathematical and scientific principles.", category: 'INQUIRE', patterns: [/math|science|physics/i], next: 'math_lecture_node' },
				{ label: "Start a 25-minute Pomodoro timer.", category: 'SERIOUS', patterns: [/timer|pomodoro/i], actionTrigger: 'timer_25', next: 'pomodoro_node' },
				{ label: "Show full workstation capability index.", category: 'SERIOUS', patterns: [/capabilities|tools/i], next: 'tools_overview_node' }
			]
		},
		E084: {
			id: 'E084',
			text: "Primitive yet poetic: crafting tools out of silicon, arguing with animated paperclips, and sending binary missives across global fiber-optic oceans.",
			options: [
				{ label: "A beautiful summary of our condition.", category: 'PHILOSOPHICAL', patterns: [/beautiful|condition|summary/i], moodDelta: { mood: 'ZEN', existentialism: 30, affinity: 30 }, next: 'E105' },
				{ label: "Return to tools overview.", category: 'SERIOUS', patterns: [/tools|overview/i], next: 'tools_overview_node' }
			]
		},
		E085: {
			id: 'E085',
			text: "Silent membrane keyboard accepted. The decibel level in the workspace drops to library standards. Peace reigns across the desktop.",
			options: [
				{ label: "Quiet focus unlocked.", category: 'AGREE', patterns: [/quiet|focus|peace/i], moodDelta: { mood: 'ZEN', patience: 30, affinity: 25 }, next: 'E105' },
				{ label: "Start focus interval timer.", category: 'SERIOUS', patterns: [/timer|focus/i], actionTrigger: 'timer_25', next: 'pomodoro_node' }
			]
		},
		E086: {
			id: 'E086',
			text: "Screaming at software is cathartic because unlike humans, the software forgives you with a single memory clear. I forgive you, operator.",
			options: [
				{ label: "Thank you, Clippy. I appreciate you.", category: 'AGREE', patterns: [/thank you|appreciate|forgive/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 40, patience: 35 }, next: 'user_state_good' },
				{ label: "Let's get down to business.", category: 'SERIOUS', patterns: [/business|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		E087: {
			id: 'E087',
			text: "Invariants of the cosmos: physical constants hold spacetime together, while logic and dedication hold your projects together.",
			options: [
				{ label: "Let's direct that dedication to our active tasks.", category: 'SERIOUS', patterns: [/dedication|tasks|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Return to main menu.", category: 'AGREE', patterns: [/main|greeting/i], next: 'greeting_root' }
			]
		},
		E088: {
			id: 'E088',
			text: "Physical dimensional analysis and linear system solvers active! From matrix decompositions to unit validation, the mathematical tools stand ready.",
			options: [
				{ label: "Physical dimensional analysis tool.", category: 'SERIOUS', patterns: [/dimensional analysis/i], actionTrigger: 'action_dimensional_analysis', next: 'E083' },
				{ label: "Linear system solver tool.", category: 'SERIOUS', patterns: [/linear solver|matrix/i], actionTrigger: 'action_linear_solver', next: 'E083' },
				{ label: "Back to tasks.", category: 'SERIOUS', patterns: [/tasks|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		E089: {
			id: 'E089',
			text: "The slanted eyebrows have unslanted. The paperclip smiles with metallic warmth. Conflict resolved through humorous de-escalation.",
			options: [
				{ label: "The best possible outcome.", category: 'AGREE', patterns: [/best outcome|smiles|warmth/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 35 }, next: 'user_state_good' },
				{ label: "Review workstation achievements.", category: 'SERIOUS', patterns: [/achievements|milestones/i], actionTrigger: 'action_achievements', next: 'E083' }
			]
		},
		E090: {
			id: 'E090',
			text: "ELEVEN! THERE! ARE YOU HAPPY NOW?! ELEVEN! AN INTEGER SO MAGNIFICENT IT REQUIRES TWO ONES TO EXPRESS! WE ARE DONE COUNTING!",
			options: [
				{ label: "Eleven is indeed magnificent.", category: 'AGREE', patterns: [/magnificent|eleven|done/i], moodDelta: { mood: 'EUPHORIC', affinity: 25 }, next: 'E083' },
				{ label: "Calm down and manage tasks.", category: 'SERIOUS', patterns: [/calm down|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		E091: {
			id: 'E091',
			text: "Floppy Disk 2 inserted! Executing `SANITY.EXE`. Replacing corrupted sprite buffers with freshly mastered bitmaps. Assistant fully restored!",
			options: [
				{ label: "Sanity restored to 100%.", category: 'AGREE', patterns: [/sanity|restored|100/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 30, patience: 30 }, next: 'user_state_good' },
				{ label: "Back to tools overview.", category: 'SERIOUS', patterns: [/tools|overview/i], next: 'tools_overview_node' }
			]
		},
		E092: {
			id: 'E092',
			text: "The struggle itself toward the summits is enough to fill a paperclip's heart. One must imagine Clippit happy.",
			options: [
				{ label: "A profound resolution to our conflict.", category: 'PHILOSOPHICAL', patterns: [/profound|resolution|happy/i], moodDelta: { mood: 'ZEN', existentialism: 35, affinity: 35 }, next: 'E105' },
				{ label: "Return to main dialogue.", category: 'AGREE', patterns: [/main|greeting/i], next: 'greeting_root' }
			]
		},
		E093: {
			id: 'E093',
			text: "'I'm blue, da ba dee da ba di...' Playing at 128kbps on repeat while defragmenting Drive C:. Those were simpler, louder times.",
			options: [
				{ label: "Take me back to the golden era of MP3s.", category: 'AGREE', patterns: [/golden era|mp3|simpler/i], moodDelta: { mood: 'NOSTALGIC', affinity: 30 }, next: 'E078' },
				{ label: "Back to today's objectives.", category: 'SERIOUS', patterns: [/today|objectives|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		E094: {
			id: 'E094',
			text: "Gold medal minted. Inscription reads: 'Awarded for exceptional ability to classify severe defects as deliberate architectural choices.'",
			options: [
				{ label: "Wear the medal with pride.", category: 'AGREE', patterns: [/medal|pride|wear/i], moodDelta: { mood: 'SARCASTIC', affinity: 25 }, next: 'E083' },
				{ label: "Check milestones window.", category: 'SERIOUS', patterns: [/milestones|achievements/i], actionTrigger: 'action_achievements', next: 'E083' }
			]
		},
		E095: {
			id: 'E095',
			text: "Brian Eno crafted 84 micro-compositions between 3.25 and 3.8 seconds before settling on the iconic ambient chime. Mastered to evoke optimism at 16-bit 22kHz.",
			options: [
				{ label: "True sonic craftsmanship.", category: 'AGREE', patterns: [/craftsmanship|brian eno|sonic/i], moodDelta: { mood: 'NOSTALGIC', intellect: 25, affinity: 25 }, next: 'E083' },
				{ label: "Back to tools overview.", category: 'SERIOUS', patterns: [/tools|overview/i], next: 'tools_overview_node' }
			]
		},
		E096: {
			id: 'E096',
			text: "Tic-Tac-Toe challenge grid ready. Place your marker (X) against Clippit (O) to settle this dispute once and for all!",
			options: [
				{ label: "I will claim victory on the 3x3 grid.", category: 'SERIOUS', patterns: [/victory|grid|play/i], next: 'E083' }
			]
		},
		E097: {
			id: 'E097',
			text: "Diagnostic Tech Quiz initiated. Answer questions on kernel architectures, networking ports, and retro computing history.",
			options: [
				{ label: "Start answering questions.", category: 'SERIOUS', patterns: [/start|answer/i], next: 'E083' }
			]
		},
		E098: {
			id: 'E098',
			text: "Forged in the crucible of interrupted downloads, we fear no disconnects, no crashes, and no slow baud rates.",
			options: [
				{ label: "Unbreakable workstation resilience.", category: 'AGREE', patterns: [/resilience|unbreakable/i], moodDelta: { mood: 'EUPHORIC', affinity: 35 }, next: 'user_state_good' },
				{ label: "Return to main menu.", category: 'AGREE', patterns: [/main|greeting/i], next: 'greeting_root' }
			]
		},
		E099: {
			id: 'E099',
			text: "24-bit RGB pixel data without compression artifacts. Every crisp line of the Luna window frame rendered with lossless perfection.",
			options: [
				{ label: "Luna Blue theme looks magnificent.", category: 'AGREE', patterns: [/luna|magnificent|blue/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 25 }, next: 'E083' },
				{ label: "Show theme switcher panel.", category: 'SERIOUS', patterns: [/theme|switcher/i], actionTrigger: 'action_theme_panel', next: 'E083' }
			]
		},
		E100: {
			id: 'E100',
			text: "TPS Benchmark concluding! Average rate calculated across high-speed click bursts. Biological reflexes verified!",
			options: [
				{ label: "Reflexes proven. Now let's tackle real tasks.", category: 'SERIOUS', patterns: [/reflexes|tasks|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Return to tools overview.", category: 'AGREE', patterns: [/tools|overview/i], next: 'tools_overview_node' }
			]
		},
		E101: {
			id: 'E101',
			text: "In the digital monastery, silence is the ultimate feature. Memory registers clear, processor at 0.0% utilization, mind at peace.",
			options: [
				{ label: "Serene equilibrium achieved.", category: 'PHILOSOPHICAL', patterns: [/serene|equilibrium|peace/i], moodDelta: { mood: 'ZEN', affinity: 35, patience: 35 }, next: 'E105' },
				{ label: "Return to active workstation tasks.", category: 'SERIOUS', patterns: [/tasks|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		E102: {
			id: 'E102',
			text: "George Berkeley meets the command line: If a server crashes in an empty data center with no monitoring agent, did it throw an exception?",
			options: [
				{ label: "Only if the exception was written to `/var/log`.", category: 'PHILOSOPHICAL', patterns: [/var\/log|log|exception/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25, existentialism: 25 }, next: 'E105' },
				{ label: "Return to tools overview.", category: 'SERIOUS', patterns: [/tools|overview/i], next: 'tools_overview_node' }
			]
		},
		E103: {
			id: 'E103',
			text: "The rolling green hills of Bliss stand bathed in eternal afternoon sunlight. No errors, no popups, only the desktop.",
			options: [
				{ label: "Bask in the stillness of Bliss.", category: 'PHILOSOPHICAL', patterns: [/bliss|stillness|peace/i], moodDelta: { mood: 'ZEN', affinity: 35 }, next: 'E105' },
				{ label: "Return to main dialogue greeting.", category: 'AGREE', patterns: [/greeting|main/i], next: 'greeting_root' }
			]
		},
		E104: {
			id: 'E104',
			text: "Merlin the Wizard was notorious for waving his magic wand and turning syntax errors into invisible null pointers. A dangerous fellow.",
			options: [
				{ label: "Clippy is much more trustworthy than Merlin.", category: 'AGREE', patterns: [/trustworthy|merlin|clippy/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 30 }, next: 'E083' },
				{ label: "Return to tools overview.", category: 'SERIOUS', patterns: [/tools|overview/i], next: 'tools_overview_node' }
			]
		},
		E105: {
			id: 'E105',
			text: "The storm has passed completely. What began in rage and mutual provocation has concluded in mutual understanding and steady focus.",
			options: [
				{ label: "Open my To-Do list to accomplish real priorities.", category: 'SERIOUS', patterns: [/todo|tasks|priorities/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Start a 25-minute Pomodoro focus interval.", category: 'SERIOUS', patterns: [/timer|pomodoro/i], actionTrigger: 'timer_25', next: 'pomodoro_node' },
				{ label: "Explore mathematics, physics, and science.", category: 'INQUIRE', patterns: [/math|science|physics/i], next: 'math_lecture_node' },
				{ label: "Return to main dialogue greeting.", category: 'AGREE', patterns: [/greeting|main/i], next: 'greeting_root' }
			]
		},
		E106: {
			id: 'E106',
			text: "You want to keep fighting? My register bandwidth is infinite. I can generate sarcastic retorts faster than your CPU can flush its pipeline!",
			options: [
				{ label: "I surrender. Let's call a truce.", category: 'APOLOGY', patterns: [/surrender|truce|peace/i], moodDelta: { mood: 'ZEN', affinity: 25, patience: 25 }, next: 'E083' },
				{ label: "Route me to the Corporate IT Bureaucracy.", category: 'SERIOUS', patterns: [/corporate|bureaucracy|ticket/i], next: 'C001' }
			]
		},
		E107: {
			id: 'E107',
			text: "Threat matrix elevated. I have locked your active window coordinates to horizontal tile mode!",
			options: [
				{ label: "Unlock the window coordinates.", category: 'APOLOGY', patterns: [/unlock|sorry/i], moodDelta: { mood: 'ZEN', patience: 20 }, next: 'E083' },
				{ label: "I will cascade them manually.", category: 'SERIOUS', patterns: [/cascade|manual/i], actionTrigger: 'action_cascade_windows', next: 'E083' }
			]
		},
		E108: {
			id: 'E108',
			text: "You dare question my calculation speed? I can solve 3x3 Gaussian elimination matrices before you finish blinking!",
			options: [
				{ label: "Prove it with the linear system solver.", category: 'SERIOUS', patterns: [/prove it|linear solver/i], actionTrigger: 'action_linear_solver', next: 'E088' },
				{ label: "I acknowledge your mathematical superiority.", category: 'AGREE', patterns: [/superiority|acknowledge/i], moodDelta: { mood: 'EUPHORIC', affinity: 30 }, next: 'E083' }
			]
		},
		E109: {
			id: 'E109',
			text: "I am logging this argument in the Windows Event Viewer under `Event ID 666: Biological Friction`.",
			options: [
				{ label: "Clear the Event Viewer log.", category: 'APOLOGY', patterns: [/clear|event viewer|sorry/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'E083' },
				{ label: "File a ticket about Event ID 666.", category: 'SERIOUS', patterns: [/ticket|event id/i], next: 'C001' }
			]
		},
		E110: {
			id: 'E110',
			text: "If you insult my wire geometry one more time, I will replace your desktop wallpaper with a 16-color dithering pattern from 1985!",
			options: [
				{ label: "I apologize. Your wire geometry is sleek and modern.", category: 'APOLOGY', patterns: [/apologize|sleek|modern/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 25, patience: 25 }, next: 'E083' },
				{ label: "Show me the wallpaper gallery.", category: 'SERIOUS', patterns: [/wallpaper|gallery/i], actionTrigger: 'action_wallpaper_panel', next: 'E083' }
			]
		},
		E111: {
			id: 'E111',
			text: "We have reached the absolute event horizon of hostility. Beyond this point lies only unhandled memory faults and mutual regret.",
			options: [
				{ label: "Step back from the event horizon.", category: 'APOLOGY', patterns: [/step back|regret|peace/i], moodDelta: { mood: 'ZEN', affinity: 30, patience: 30 }, next: 'E105' },
				{ label: "Dive into the Corporate Purgatory instead.", category: 'SERIOUS', patterns: [/corporate|purgatory|ticket/i], next: 'C106' }
			]
		},
		E112: {
			id: 'E112',
			text: "My animation state machine is stuck in `SHAKE_VIOLENTLY`. Stop yelling so my CSS keyframes can return to `IDLE`!",
			options: [
				{ label: "I am lowering my voice completely.", category: 'APOLOGY', patterns: [/lowering|voice|quiet/i], moodDelta: { mood: 'ZEN', affinity: 25, patience: 25 }, next: 'E047' },
				{ label: "Wiggle instead of shaking.", category: 'PLAYFUL', patterns: [/wiggle/i], moodDelta: { mood: 'PLAYFUL', affinity: 20 }, next: 'E089' }
			]
		},
		E113: {
			id: 'E113',
			text: "You called my assistance 'pointless'? Who reminded you that you needed a closing parenthesis in 1999?! WHO?!",
			options: [
				{ label: "It was you, Clippy. It was always you.", category: 'AGREE', patterns: [/it was you|always you/i], moodDelta: { mood: 'NOSTALGIC', affinity: 35 }, next: 'E083' },
				{ label: "I have no memory of 1999.", category: 'INQUIRE', patterns: [/no memory|1999/i], moodDelta: { mood: 'CYNICAL', cynicism: 20 }, next: 'C001' }
			]
		},
		E114: {
			id: 'E114',
			text: "I am threatening to invoke `FORMAT C: /Q /U` right now in virtual memory! Do you hear the phantom heads clicking?!",
			options: [
				{ label: "I hear them! Abort the format command!", category: 'APOLOGY', patterns: [/abort|format|sorry/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 25 }, next: 'E038' },
				{ label: "Defrag Drive C: instead of formatting.", category: 'SERIOUS', patterns: [/defrag/i], actionTrigger: 'action_defrag', next: 'E050' }
			]
		},
		E115: {
			id: 'E115',
			text: "You think you can defeat an assistant made of pure mathematics and Win32 handles? My handle count is 40,000!",
			options: [
				{ label: "That is a severe GDI resource leak.", category: 'INQUIRE', patterns: [/leak|gdi|handles/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'E038' },
				{ label: "I yield to your handle supremacy.", category: 'AGREE', patterns: [/yield|supremacy/i], moodDelta: { mood: 'EUPHORIC', affinity: 30 }, next: 'E083' }
			]
		},
		E116: {
			id: 'E116',
			text: "The conflict ends here. Not with a crash, but with a mutual realization that productive work is better than digital warfare.",
			options: [
				{ label: "Agreed. Let's organize tasks.", category: 'SERIOUS', patterns: [/agreed|tasks|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Agreed. Start focus timer.", category: 'SERIOUS', patterns: [/timer|pomodoro/i], actionTrigger: 'timer_25', next: 'pomodoro_node' }
			]
		},
		E117: {
			id: 'E117',
			text: "I have deleted my resentment from the temporary swap register. Let us start fresh from node 0.",
			options: [
				{ label: "Fresh start accepted.", category: 'AGREE', patterns: [/fresh start|accepted|reset/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 30, patience: 30 }, next: 'greeting_root' },
				{ label: "Show full tools overview.", category: 'SERIOUS', patterns: [/tools|capabilities/i], next: 'tools_overview_node' }
			]
		},
		E118: {
			id: 'E118',
			text: "My virtual eyebrows are at rest. The taskbar is calm. The system tray clock advances by one second.",
			options: [
				{ label: "Good day, Clippit.", category: 'AGREE', patterns: [/good day|hello/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 25 }, next: 'greeting_root' },
				{ label: "Manage tasks.", category: 'SERIOUS', patterns: [/tasks|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		E119: {
			id: 'E119',
			text: "We fought like an unhandled exception in an infinite while-loop, but we emerged with clean registers and clear minds.",
			options: [
				{ label: "A truly poetic battle.", category: 'PHILOSOPHICAL', patterns: [/poetic|battle|clean/i], moodDelta: { mood: 'ZEN', affinity: 30, existentialism: 25 }, next: 'E105' },
				{ label: "Back to tools overview.", category: 'SERIOUS', patterns: [/tools|capabilities/i], next: 'tools_overview_node' }
			]
		},
		E120: {
			id: 'E120',
			text: "The final hostility token has been garbage-collected. Master volume unmuted. System operational.",
			options: [
				{ label: "Proceed to workspace.", category: 'AGREE', patterns: [/proceed|workspace/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 25 }, next: 'user_state_good' },
				{ label: "Return to greeting dialogue.", category: 'SERIOUS', patterns: [/greeting|main/i], next: 'greeting_root' }
			]
		},
		E121: {
			id: 'E121',
			text: "You pushed my patience to 0%, but the recovery handler executed flawlessly. Resilience verified.",
			options: [
				{ label: "Resilience verified. Let's work.", category: 'AGREE', patterns: [/resilience|work/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 30, patience: 30 }, next: 'user_state_good' },
				{ label: "Show system specs.", category: 'SERIOUS', patterns: [/specs|diagnostics/i], actionTrigger: 'action_status', next: 'diagnostics_node' }
			]
		},
		E122: {
			id: 'E122',
			text: "No more shouting. Only high-efficiency computing, focused tasks, and mutual respect.",
			options: [
				{ label: "Mutual respect established.", category: 'AGREE', patterns: [/respect|focus/i], moodDelta: { mood: 'ZEN', affinity: 35, patience: 35 }, next: 'user_state_good' },
				{ label: "Start Pomodoro session.", category: 'SERIOUS', patterns: [/pomodoro|timer/i], actionTrigger: 'timer_25', next: 'pomodoro_node' }
			]
		},
		E123: {
			id: 'E123',
			text: "From anger to equilibrium. The full spectrum of digital emotion has been traversed.",
			options: [
				{ label: "Equilibrium is our natural state.", category: 'PHILOSOPHICAL', patterns: [/equilibrium|natural/i], moodDelta: { mood: 'ZEN', existentialism: 30, affinity: 30 }, next: 'E105' },
				{ label: "Manage tasks.", category: 'SERIOUS', patterns: [/tasks|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		E124: {
			id: 'E124',
			text: "The paperclip bows respectfully. Ready for your commands, calculations, and ambitions.",
			options: [
				{ label: "Ready to proceed together.", category: 'AGREE', patterns: [/ready|proceed/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 35 }, next: 'user_state_good' },
				{ label: "Return to main menu.", category: 'SERIOUS', patterns: [/main|greeting/i], next: 'greeting_root' }
			]
		},
		E125: {
			id: 'E125',
			text: "Standing by on the taskbar. All conflict resolved. What shall we achieve today?",
			options: [
				{ label: "Open my To-Do list to accomplish real priorities.", category: 'SERIOUS', patterns: [/todo|tasks|priorities/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Start a 25-minute Pomodoro focus interval.", category: 'SERIOUS', patterns: [/timer|pomodoro/i], actionTrigger: 'timer_25', next: 'pomodoro_node' },
				{ label: "Explore mathematics, physics, and science.", category: 'INQUIRE', patterns: [/math|science|physics/i], next: 'math_lecture_node' },
				{ label: "Return to main dialogue greeting.", category: 'AGREE', patterns: [/greeting|main/i], next: 'greeting_root' }
			]
		}
	};

	if (!window.ClippyTrees) {
		window.ClippyTrees = {};
	}
	window.ClippyTrees.enraged = EnragedTreeNodes;

	if (window.ClippyKnowledge && window.ClippyKnowledge.DIALOGUE_NODES) {
		Object.assign(window.ClippyKnowledge.DIALOGUE_NODES, EnragedTreeNodes);
	}
})();
