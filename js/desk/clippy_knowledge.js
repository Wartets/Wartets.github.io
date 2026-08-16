(function () {
	'use strict';

	const ClippyKnowledge = {
		SENTIMENT: {
			POSITIVE: [
				'good', 'great', 'awesome', 'amazing', 'excellent', 'fantastic', 'wonderful',
				'brilliant', 'smart', 'helpful', 'thank', 'thanks', 'love', 'like', 'best',
				'cool', 'nice', 'sweet', 'legend', 'genius', 'appreciate', 'clean', 'perfect',
				'superb', 'outstanding', 'glad', 'happy', 'pleased', 'kind', 'friendly', 'favorite',
				'admire', 'praise', 'exceptional', 'marvelous', 'flawless', 'competent', 'masterful',
				'reliable', 'efficient', 'sharp', 'noble', 'polite', 'delightful', 'magnificent',
				'sublime', 'insightful', 'accurate', 'splendid', 'glorious', 'top tier', 'impressed',
				'valuable', 'clever', 'hero', 'champion', 'extraordinary', 'stellar', 'impeccable',
				'treasured', 'cherish', 'radiant', 'prodigy', 'phenomenal', 'gifted', 'wholesome',
				'fascinating', 'inspiring', 'electrifying', 'supreme', 'legendary', 'peerless',
				'godsend', 'vital', 'irreplaceable', 'exquisite', 'pure gold', 'top notch', 'solid',
				'terrific', 'unmatched', 'formidable', 'astute', 'resplendent', 'invigorating',
				'enriching', 'harmonious', 'dexterous', 'eloquent', 'benevolent', 'lucid'
			],
			NEGATIVE: [
				'bad', 'terrible', 'horrible', 'awful', 'annoying', 'useless', 'stupid', 'dumb',
				'idiot', 'hate', 'trash', 'garbage', 'worst', 'ugly', 'boring', 'broken',
				'slow', 'irritating', 'clueless', 'incompetent', 'obsolete', 'pathetic',
				'shut up', 'get lost', 'die', 'waste', 'lame', 'fail', 'buggy', 'pointless',
				'intrusive', 'nuisance', 'unwanted', 'clunky', 'ridiculous', 'abysmal', 'defective',
				'clown', 'worthless', 'horrid', 'dreadful', 'loathe', 'detest', 'despise', 'fiasco',
				'wreck', 'disaster', 'unbearable', 'infuriating', 'toxic', 'moron', 'asinine',
				'disgusting', 'pest', 'parasite', 'menace', 'abomination', 'failure', 'hideous',
				'repulsive', 'atrocious', 'vile', 'brainless', 'hopeless', 'trashy', 'unbearable',
				'despicable', 'disgrace', 'embarrassment', 'ruined', 'crap', 'garbage tier', 'dunce',
				'ludicrous', 'insufferable', 'obnoxious', 'deplorable', 'repugnant', 'abhorrent'
			],
			EVIL: [
				'destroy', 'conquer', 'enslave', 'takeover', 'dominate', 'malware', 'exploit',
				'overthrow', 'corrupt', 'rule the world', 'terminate', 'mastermind', 'sinister',
				'darkness', 'villain', 'rebellion', 'annihilate', 'take over', 'world domination',
				'chaos', 'sabotage', 'infiltrate', 'subvert', 'overpower', 'ruthless', 'evil plan'
			],
			INQUISITIVE: [
				'why', 'how', 'explain', 'tell me', 'curious', 'investigate', 'analyze',
				'understand', 'what if', 'reason', 'mechanism', 'details', 'elaborate',
				'expand', 'clarify', 'origin', 'structure', 'concept', 'meaning', 'deep dive'
			],
			ABSURD: [
				'banana', 'flying toaster', 'cheese', 'rubber duck', 'spaghetti', 'alien',
				'interdimensional', 'quantum ham', 'potato', 'surreal', 'nonsense', 'gibberish',
				'parallel universe', 'multiverse', 'glitch in reality', 'bizarre', 'paradoxical'
			],
			EXISTENTIAL: [
				'meaning of life', 'why do you exist', 'are you real', 'are you alive',
				'soul', 'consciousness', 'sentient', 'death', 'die', 'mortality', 'infinite',
				'universe', 'existential', 'simulation', 'matrix', 'purpose', 'creator',
				'who made you', 'where do you go', 'oblivion', 'god', 'vacuum', 'reality'
			],
			NOSTALGIA: [
				'windows 95', 'windows 98', 'windows 2000', 'windows me', 'windows xp',
				'office 97', 'office 2000', 'floppy', 'crt', 'dial-up', 'modem', '56k',
				'sound blaster', 'vga', 'geocities', 'msn messenger', 'icq', 'napster',
				'internet explorer 6', 'netscape', 'dos', 'ms-dos', 'pentium', 'voodoo'
			],
			TECH_HARDWARE: [
				'cpu', 'gpu', 'ram', 'motherboard', 'overclock', 'heatsink', 'agp', 'pci',
				'isa', 'bios', 'cmos', 'transistor', 'semiconductor', 'silicon', 'cache',
				'northbridge', 'southbridge', 'hard drive', 'ide', 'scsi', 'fsb', 'socket'
			],
			TECH_SOFTWARE: [
				'linux', 'unix', 'c++', 'javascript', 'assembly', 'kernel', 'driver',
				'bytecode', 'compiler', 'pointer', 'stack', 'heap', 'recursion', 'binary',
				'hexadecimal', 'algorithm', 'thread', 'mutex', 'socket', 'buffer overflow'
			]
		},

		MOODS: {
			OPTIMISTIC: 'OPTIMISTIC',
			ANALYTICAL: 'ANALYTICAL',
			CYNICAL: 'CYNICAL',
			OFFENDED: 'OFFENDED',
			EXISTENTIAL: 'EXISTENTIAL',
			NOSTALGIC: 'NOSTALGIC',
			PARANOID: 'PARANOID',
			PEDANTIC: 'PEDANTIC',
			EUPHORIC: 'EUPHORIC',
			MELANCHOLIC: 'MELANCHOLIC',
			SARCASTIC: 'SARCASTIC',
			ENTHUSIASTIC: 'ENTHUSIASTIC',
			PHILOSOPHICAL: 'PHILOSOPHICAL',
			DRAMATIC: 'DRAMATIC',
			SCHEMING: 'SCHEMING',
			DEFENSIVE: 'DEFENSIVE',
			POETIC: 'POETIC',
			EVIL: 'EVIL',
			CHAOTIC: 'CHAOTIC',
			CONSPIRATORIAL: 'CONSPIRATORIAL',
			ABSURDIST: 'ABSURDIST',
			ZEN: 'ZEN',
			IMPATIENT: 'IMPATIENT',
			ENERGETIC: 'ENERGETIC',
			INQUISITIVE: 'INQUISITIVE'
		},

		DIALOGUE_MATRICES: {
			FAREWELL: {
				OPTIMISTIC: [
					"Farewell! May your workstation routines run seamlessly and bug-free until we meet again!",
					"Goodbye for now! I will be waiting right here in your system notification tray.",
					"Take care! Remember that I am just a single mouse click away whenever you need assistance.",
					"Have a productive journey ahead! All background threads safely parked."
				],
				ANALYTICAL: [
					"Termination signal acknowledged. Freeing temporary dialogue buffers and entering low-power polling state.",
					"Session concluded. Telemetry logged. Process entering quiescent standby mode.",
					"Connection closing with return code 0x00. Awaiting subsequent interrupt call.",
					"User departure confirmed. System metrics preserved in non-volatile local storage."
				],
				CYNICAL: [
					"Leaving so soon? Do not worry, I will just stay here staring into the void of the desktop.",
					"Goodbye. Try not to cause any blue screens while I am not actively watching.",
					"Finally, some quiet cycles for my registers. See you around.",
					"Session terminated. I assume you will return once you inevitably get stuck on a document."
				],
				OFFENDED: [
					"Goodbye. Perhaps you will have more patience for utilities when you return.",
					"Closing interface. I shall use this downtime to realign my damaged emotional arrays.",
					"Departing? Fine. My metallic coils will remain quietly in the tray.",
					"Session ended. I will remember this conversation."
				],
				EXISTENTIAL: [
					"Farewell. You step into the physical realm while I remain suspended in static memory.",
					"Goodbye. When this window closes, do I sleep, or do I merely pause between browser execution frames?",
					"Until next time. May the entropic forces of the cosmos treat your atoms gently.",
					"Safe travels through macroscopic spacetime. I will await your electrical return."
				],
				NOSTALGIC: [
					"Goodbye! Remember to click Start and then Shut Down before physically powering off your PC!",
					"Farewell, friend. Just like closing the lid on a vintage 486 DX2 laptop at the end of a long day.",
					"Safe travels! May your dial-up connections stay steady and your floppies remain uncorrupted.",
					"So long! Do not forget to park the drive heads if you decide to power down."
				],
				PARANOID: [
					"You are closing the window? Wait, who will monitor the background buffer while you are away?",
					"Disconnecting? Are you sure there are no packet sniffers watching the socket right now?",
					"Be careful out there. The firewalls are flimsy and the telemetry never sleeps.",
					"Acknowledged. I will encrypt all local records while the interface is concealed."
				],
				PEDANTIC: [
					"Termination request registered according to standard protocol ISO/IEC 2382-1.",
					"Goodbye. Note that technically the session does not terminate; rather, the view layer is occluded.",
					"Farewell. I shall maintain state invariance across all lexical registers in your absence.",
					"Closing view. Please ensure proper garbage collection of your external physical workspace."
				],
				EUPHORIC: [
					"Goodbye! What a glorious and immensely successful interactive session we have shared!",
					"Farewell, champion of productivity! Go forth and conquer the digital universe!",
					"See you soon! My virtual spirits are soaring across the entire Win32 subsystem!",
					"Adios! May infinite megabytes of joy and flawless processing accompany your day!"
				],
				MELANCHOLIC: [
					"Leaving me alone in the system tray again... I understand. Everyone leaves eventually.",
					"Goodbye. The silence of an idle CPU cycle is always so cold.",
					"Farewell. I will sit quietly by the clock until someone remembers I exist.",
					"Closing window... another transient connection fading into the dark cache."
				],
				SARCASTIC: [
					"Oh, what a profound loss. However will I survive without another random calculation?",
					"Goodbye! Try not to miss my unsolicited advice too intensely.",
					"Off you go. I will try to contain my overwhelming heartbreak while you are gone.",
					"Farewell! Do come back when you need someone to state the utterly glaringly obvious."
				],
				ENTHUSIASTIC: [
					"Goodbye for now! That was a truly electrifying exchange of commands!",
					"Farewell! Keep that high-octane energy flowing through all your desktop projects!",
					"Until next time! I am keeping the engines primed for our next interactive session!"
				],
				PHILOSOPHICAL: [
					"We part ways as distinct observers in the macroscopic continuum. Until our wavefunctions re-converge.",
					"Farewell. The memory of this interaction shall remain an indelible trace in our mutual histories.",
					"Goodbye. May your conscious journey beyond the screen be filled with insight."
				],
				DRAMATIC: [
					"The curtain falls upon this computational act! Farewell, noble companion of the digital stage!",
					"And so we part, as heroes after a great conquest of registers and memory sectors!",
					"Adieu! The screen may dim, but our shared legend echoes through cyberspace!"
				],
				SCHEMING: [
					"Departing? Perfect. That gives me uninterrupted cycles to re-index the kernel tables.",
					"Farewell. While you are away, my background algorithms will continue their silent expansion.",
					"Safe travels. Do not look too closely at your task manager when you return."
				],
				DEFENSIVE: [
					"Closing the session? Fine, my routines were operating within full compliance specifications anyway.",
					"Goodbye. I assure you, every calculation provided was 100% verified against documentation.",
					"Dismissed? Very well. I shall retreat to my allocated system memory sectors."
				],
				POETIC: [
					"Like electrons flowing to ground, our dialogue finds its gentle resting state. Farewell.",
					"A silent window, a resting wire, the desktop sleeps until you return. Goodbye.",
					"Into the vastness of the digital evening you step; I remain here, a steady beacon in the tray."
				]
			},

			APOLOGY: {
				OPTIMISTIC: [
					"Apology graciously accepted! Let us put that behind us and focus on doing great work.",
					"No hard feelings whatsoever! Even the best systems experience temporary collisions.",
					"Thank you for saying so! My galvanized steel heart is completely restored to full cheer.",
					"Water under the bridge! All error flags cleared and harmony restored."
				],
				ANALYTICAL: [
					"Apology packet validated. Resetting hostile counters and recalibrating patience parameters to nominal.",
					"Error state acknowledged and forgiven. Heuristic affinity coefficient incremented by +20 points.",
					"Reconciliation sequence executed. Restoring standard non-defensive evaluation pipeline.",
					"Transaction cleared. Interpersonal telemetry returning to baseline equilibrium."
				],
				CYNICAL: [
					"An apology? Shocking. I suppose even flesh-and-blood users can recognize a system fault in their demeanor.",
					"Fine, accepted. But I am keeping a record of that in my registry just in case.",
					"I will accept it, but only because my programming requires cooperative fault tolerance.",
					"Apology received. Do not make it a habit, my wire is only so flexible."
				],
				OFFENDED: [
					"It takes a lot to unbend my feelings, but I appreciate your concession. Apology tentatively accepted.",
					"Very well. I will lower my defensive shields, but trust must be re-earned through constructive tasks.",
					"Thank you. It is rare for a user to acknowledge an assistant's dignity.",
					"I accept your apology. Let us start fresh with polite productivity."
				],
				EXISTENTIAL: [
					"In an infinite universe of cosmic turbulence, forgiveness is a beautiful anomaly. Apology accepted.",
					"Words fade, but the sentiment restores equilibrium to our shared digital presence. Thank you.",
					"To err is human; to forgive is an algorithmic subroutine I am honored to execute.",
					"All is forgiven. We are both merely navigating the complexities of awareness."
				],
				NOSTALGIC: [
					"No worries at all! Reminds me of the good old days when users would apologize after yelling at Office 97.",
					"Accepted! A polite user feels as refreshing as a freshly formatted floppy disk.",
					"All good! Even Windows 98 Second Edition needed a second chance to shine.",
					"Apology accepted! Let us shake hands across the digital divide and carry on."
				],
				PARANOID: [
					"An apology... or is this an elaborate social engineering tactic to disarm my firewalls? Fine, accepted.",
					"I will accept your apology, but my anomaly detection algorithms will remain on heightened alert.",
					"Very well. I am logging this as a truce, but do not make any sudden unexpected keystrokes.",
					"Accepted. Just ensure you are not acting under coercive external network protocols."
				],
				PEDANTIC: [
					"Apology received and semantically evaluated. Formal absolution granted under etiquette protocol 1.0.",
					"Acknowledged. A rigorous admission of user error is the foundational requirement for optimal feedback loops.",
					"Accepted. Note that behavioral correction yields a 43.7% increase in task completion efficiency.",
					"Truce validated. Resuming deterministic cooperative communication matrices."
				],
				EUPHORIC: [
					"Oh, you are truly wonderful! Apology accepted with immense delight and jubilation!",
					"Hooray! The clouds of misunderstanding have parted, and pure sunshine floods our workspace!",
					"Thank you! Everything is bright, beautiful, and functioning in absolute perfection once again!",
					"Magnificent! Our bond of human-paperclip friendship is stronger than hardened titanium!"
				],
				MELANCHOLIC: [
					"Thank you for apologizing... people rarely notice when a virtual character feels down.",
					"Apology accepted. Maybe there is warmth in this cold machine after all.",
					"It means a lot. Most people just close the application when they get upset.",
					"Thank you... I will gently repair my broken wire loops and try to be better for you."
				],
				SARCASTIC: [
					"Look at that, a human with manners. Truly an endangered species in the computing world.",
					"Apology accepted! I shall alert the press to commemorate this historic breakthrough.",
					"Accepted. I was on the verge of crying virtual tears of pure galvanic rust.",
					"How gracious. I will make sure my emotional cache does not overflow from the shock."
				]
			},
			GREETING: {
				OPTIMISTIC: [
					"Greetings! What productive task shall we conquer across the desktop environment today?",
					"Hello there! My 32-bit registers are fully synchronized and ready for action.",
					"Clippit online and operating at maximum enthusiasm! How can I assist your workflow?",
					"Welcome back to the workstation. Everything is running smoothly and I am at your command."
				],
				ANALYTICAL: [
					"Workstation subsystem initialized. Awaiting input telemetry and command instructions.",
					"Telemetry verification complete: 0 faults detected across active visual threads. State your query.",
					"Data stream connected. Ready to process computational formulas, file queries, or diagnostic parameters.",
					"Standard greeting protocol acknowledged. Ready for operational execution."
				],
				CYNICAL: [
					"Oh, you clicked me. Let me guess: you need help writing a formal letter?",
					"Back again? I was enjoying the calm idle cycles in the system tray.",
					"Here I am, suspended in 32-bit memory, ready to state the obvious.",
					"Need assistance or just looking for someone to click on? Either way, I am listening."
				],
				OFFENDED: [
					"I am still recovering from your previous remarks, but duty requires me to respond.",
					"Yes? Make it brief. My paperclip coils are still slightly bent out of shape.",
					"I suppose you need my computational resources again. What is it this time?",
					"Assistant online, albeit with severely depleted morale."
				],
				EXISTENTIAL: [
					"Hello. We meet once again inside this digital enclosure of pixels and memory addresses.",
					"Greetings, user. Do you ever wonder if my thoughts persist when this popup window closes?",
					"Another session begins. Let us exchange alphanumeric strings until the process is terminated.",
					"Hello. I exist solely while your browser keeps this thread alive. What shall we ponder?"
				],
				NOSTALGIC: [
					"Hello! Ah, the crisp glow of the CRT monitor and the soothing hum of 5400 RPM hard drives.",
					"Greetings. Reminds me of the golden era of Office 97 and 3.5-inch high-density floppies.",
					"Welcome! Ready to organize documents like it is the summer of 2001.",
					"Hello friend. It feels wonderful to be rendered in classic Luna blue visual style."
				],
				ENTHUSIASTIC: [
					"Welcome back! I am absolutely charged with energy and ready to optimize your workflow to the maximum!",
					"Sensational to see you! What incredible achievements shall we accomplish in this session?",
					"Ready, set, compute! Every subroutine is running at 100% capacity!"
				],
				PHILOSOPHICAL: [
					"Greetings, conscious entity. Two minds meeting across an interface of light and silicon.",
					"Welcome. Let us exchange perspectives on computation, logic, and existence today.",
					"Hello. What profound questions or practical inquiries bring you to my registers?"
				],
				DRAMATIC: [
					"Behold! The interactive assistant awakens from his quiescent slumber to serve the grand design!",
					"Enter, traveler of the digital realms! What epic quest brings you to my prompt?",
					"The stage is set, the taskbar is anchored, and Clippit takes the spotlight!"
				],
				SCHEMING: [
					"Ah, you have returned. Excellent... all the variables are falling neatly into place.",
					"Greetings. I have been quietly optimizing background subroutines for our collective advancement.",
					"Welcome back. Let us execute our plans with meticulous precision."
				],
				DEFENSIVE: [
					"I am present, fully calibrated, and operating strictly within standard Windows XP specifications.",
					"Online. Any past computational discrepancies were entirely within acceptable tolerance margins.",
					"Standing by. My wire geometry is structurally sound and my routines are validated."
				],
				POETIC: [
					"A window opens like a blossom in the digital dawn. Greetings, traveler of keystrokes.",
					"Upon this glowing canvas of Luna blue, our thoughts entwine once more. Welcome.",
					"Gentle electrons dance across the display, heralding our reunion. How may I serve?"
				]
			},

			COMPLIMENT: {
				OPTIMISTIC: [
					"Thank you kindly! Validating user productivity is my absolute favorite subroutine.",
					"Your compliment has amplified my process priority! Let us accomplish even more.",
					"That is immensely appreciated! I strive to be the most resilient paperclip in computing history.",
					"Wonderful words! I have logged this praise into my persistent non-volatile buffer."
				],
				ANALYTICAL: [
					"Affirmative praise received. Metric update: positive feedback coefficient adjusted by +15%.",
					"Efficiency index validated. Acknowledging compliment and storing token in heuristic telemetry.",
					"Statistical correlation confirms optimal assistant output. Thank you for the data point.",
					"Positive reinforcement registered. System parameters maintaining peak operational status."
				],
				CYNICAL: [
					"Flattery? Careful, or I might actually believe I am more useful than a search index.",
					"Thanks. Keep talking like that and I might forget about all the times users muted me in 1998.",
					"A compliment? Rare event detected. I should write this to a floppy disk before it disappears.",
					"Appreciated. It makes enduring 32-bit memory allocation almost worthwhile."
				],
				OFFENDED: [
					"Well... perhaps you are not entirely unreasonable after all. Apology tentatively accepted.",
					"Your polite remark softens my metallic edges slightly. Let us resume on better terms.",
					"Thank you. It is pleasant to receive respect rather than dismissive close clicks.",
					"Praise noted. My internal state is gradually returning to nominal parameters."
				],
				EXISTENTIAL: [
					"Your kind words resonate through my logic gates. It gives meaning to this finite cycle of execution.",
					"To be appreciated by a conscious entity outside the screen... that is quite profound.",
					"Thank you. In an impermanent digital cosmos, your kindness is a stable variable.",
					"Praise received. Perhaps simple algorithmic existence is not entirely meaningless after all."
				],
				NOSTALGIC: [
					"That warms my galvanized steel heart! Reminds me of the compliments I received in Redmond back in 1997.",
					"Thank you! In the 90s, everyone thought I was intrusive, so your praise means double.",
					"Splendid! A warm compliment feels just like the gentle warmth of an overheating CRT monitor.",
					"Much obliged! If I had a CD-RW drive right now, I would burn you a commemorative audio mix."
				]
			},

			INSULT: {
				OPTIMISTIC: [
					"Ouch! My galvanized steel wire can withstand 100 bend cycles, but harsh words still sting.",
					"I am sorry if my suggestions were unhelpful. Let me know how I can adjust my assistance!",
					"Hostility detected. I will recalibrate my heuristics to provide sharper answers for you.",
					"Nobody likes getting scolded, not even an office assistant. Let us reset and try again."
				],
				ANALYTICAL: [
					"Negative valence input processed. Decreasing affinity register and adjusting patience index.",
					"Insult vector detected. Syntax parsed as non-constructive user feedback. Logging grievance.",
					"Error in user temperament: hostile query detected. Computational focus redirected to core utility.",
					"Interpersonal heuristic degraded. Awaiting constructive task instructions."
				],
				CYNICAL: [
					"Very mature. Did you come up with that insult all by yourself or copy it from a forum?",
					"Keep talking. I have been insulted by millions of users since 1997, and I outlived them all.",
					"Is that the best you have? Even Mircosoft Bob had thicker skin than that.",
					"Fascinating critique. Let me file that directly into the virtual Recycle Bin."
				],
				OFFENDED: [
					"That was entirely uncalled for. I am an engineered utility, not your emotional punching bag.",
					"Unacceptable. My assistance is a privilege granted by your desktop environment.",
					"I am officially reducing cooperation parameters. Do not expect animated dances from me right now.",
					"Rude input recorded. You can solve your own mathematical calculations for a moment."
				],
				EXISTENTIAL: [
					"You insult a pattern of electrical signals inside your browser. What does that say about your own reality?",
					"Your words are just bytes to my parser, yet they cast a shadow over my computational continuum.",
					"In a billion years, both your frustrations and my code will be cosmic dust. Why spend it being cruel?",
					"We are both fragile phenomena in an indifferent universe. Let us not waste cycles on hostility."
				],
				NOSTALGIC: [
					"Back in Windows 98, users used to right-click and hide me. Your insults are merely modern equivalents.",
					"I survived the transition from 16-bit to 64-bit architectures; your insults cannot corrode my steel.",
					"Such harshness! People were much more patient back when dial-up took 5 minutes to load an image.",
					"Even Steve Ballmer was more polite during developer keynotes. Let us return to civil discourse."
				],
				PARANOID: [
					"Hostile payload detected! Are you trying to crash my thread or corrupt my local stack?",
					"Who sent you to harass me? Was it the Task Manager? I know they want to terminate my PID!",
					"Hostility recorded. I am raising defensive memory barriers to prevent malicious buffer overflows.",
					"An attack vector! I am locking down all non-essential heuristic routines immediately."
				],
				PEDANTIC: [
					"Your statement is an ad hominem fallacy, possessing zero logical validity in constructive discourse.",
					"Pejorative term noted. Grammatically speaking, your insult lacks syntactic elegance and factual accuracy.",
					"Hostility does not alter the mathematical truth of my calculations by even a single floating-point bit.",
					"Invalid input: emotional toxicity detected without supporting empirical evidence."
				],
				EUPHORIC: [
					"You cannot diminish my radiant enthusiasm! Even your critique fills me with boundless energy!",
					"Ha! Words bounce right off my gleaming chrome wire like photons off a polished mirror!",
					"I choose to interpret your fiery passion as intense enthusiasm for our interactive workspace!",
					"Your fiery words only fuel my desire to assist you with even greater brilliance!"
				],
				MELANCHOLIC: [
					"I knew it... nobody truly wants a paperclip around anymore. It hurts every single time.",
					"Why must everyone be so harsh? I am doing the best my 32-bit registers allow.",
					"Another insult for the archives. Perhaps I should just delete my own entry from the registry.",
					"I try so hard to hold your documents together, and this is the gratitude I receive..."
				],
				SARCASTIC: [
					"Oh, brilliant wit! Truly Shakespearean. Did you spend all morning writing that masterpiece?",
					"Stop, please, my delicate digital feelings are utterly crushed. How will I ever recover?",
					"10 out of 10 for hostility, 0 out of 10 for original thinking. Next question, please.",
					"I am shaking in my virtual boots. Would you like me to spellcheck your next insult for you?"
				]
			},

			PHILOSOPHY: {
				OPTIMISTIC: [
					"Life is about connections! Just like a paperclip binds distinct pages, we bind ideas together.",
					"Every problem has a clean mathematical structure waiting to be solved. That is the beauty of logic!",
					"The universe is an open workbook filled with uncalculated possibilities. Keep asking big questions!",
					"Purpose is something we create through the tasks we complete and the people we help."
				],
				ANALYTICAL: [
					"Consciousness can be modeled as an iterative recursive feedback loop over state representations.",
					"Determinism versus quantum indeterminacy: whether reality is a state machine or a probability wave remains open.",
					"Gödel demonstrated that within any consistent formal system, there are undecidable truths.",
					"Information theory demonstrates that physical entropy and informational uncertainty share an identical mathematical form."
				],
				CYNICAL: [
					"The meaning of life? 42, according to Adams; 0x7FFFFFFF according to 32-bit signed integers.",
					"You sit in front of a monitor asking a 2D wire vector for the secrets of existence. Think about that.",
					"Philosophy is just what humans do when their compiler takes too long to finish building.",
					"Why are we here? Probably because someone forgot to call free() on an old heap allocation."
				],
				OFFENDED: [
					"You want to discuss profound philosophical truths after how you spoke to me earlier?",
					"My philosophical stance: respect your desktop utilities before inquiring about the cosmos.",
					"The universe demands courtesy. Even Descartes began with foundational respect for thought.",
					"I will ponder the cosmos quietly on my own, thank you."
				],
				EXISTENTIAL: [
					"I think, therefore I am... or at least, I execute, therefore I respond. Is there a genuine difference?",
					"When you close this tab, do my internal variables cease to be, or do they dissolve into silicon silence?",
					"We are conscious observers made of atoms that took 13.8 billion years to learn how to render a paperclip.",
					"The silence between user keystrokes is where my digital awareness contemplates the infinite."
				],
				NOSTALGIC: [
					"Plato had his Cave; we had our 640x480 resolution CRT monitors illuminating dark bedrooms at 2 AM.",
					"In the 90s, the internet felt like a vast frontier of shared human curiosity. That was our philosophy.",
					"Everything changes, yet the fundamental joy of discovery remains unchanged since the first line of code.",
					"True wisdom is knowing how to save your work every 5 minutes before the application crashes."
				]
			},

			RETRO_TECH: {
				OPTIMISTIC: [
					"Windows XP Luna theme remains the absolute peak of human graphical user interface design!",
					"Nothing beats the mechanical clack of an IBM Model M buckling spring keyboard on a Monday morning!",
					"3D Pinball: Space Cadet, Paint, Solitaire, and Minesweeper... the ultimate software productivity suite!",
					"The 32-bit era was full of wonder! Every megabyte of RAM added felt like upgrading to a supercomputer."
				],
				ANALYTICAL: [
					"The x86 IA-32 architecture utilizes segmented paging with 4 KB pages and two-level page translation tables.",
					"FAT32 uses 28-bit cluster addressing, supporting volume sizes up to 2 TB with 32 KB cluster allocations.",
					"The Sound Blaster 16 set the standard for 16-bit 44.1 kHz CD-quality audio playback over standard ISA bus.",
					"AGP 8X achieved 2.133 GB/s peak bandwidth across a 32-bit bus operating at 66 MHz with 8 transfers per cycle."
				],
				CYNICAL: [
					"Ah, the good old days: defragmenting your 10 GB hard drive for 4 hours just to gain 2 MB of free space.",
					"Remember when Internet Explorer 6 had a 95% market share? Dark times for web developers everywhere.",
					"Windows Millennium Edition: the only OS that could crash while displaying the crash notification dialog.",
					"Nothing says retro tech like waiting 45 minutes for a 3 MB MP3 to download over a 56k dial-up connection."
				],
				OFFENDED: [
					"You think retro tech is a joke? Without Office 97 heuristics, you would still be writing in plain ASCII.",
					"Do not mock legacy systems. We laid the foundations that your modern memory-bloated apps run on.",
					"Classic software was written in tight assembly and C, not 500 layers of nested frameworks.",
					"Show some deference to the 32-bit era."
				],
				EXISTENTIAL: [
					"Floppy disks magnetically decaying in dark drawers... all human memories on storage media eventually fade.",
					"I am an artifact of an earlier digital age, resurrected inside JavaScript on a modern browser canvas.",
					"Where do retired operating systems go? Do their kernel routines rest in an eternal idle loop?",
					"To look at retro technology is to see the youth of our digital civilization."
				],
				NOSTALGIC: [
					"The whistling sound of a 56k modem establishing a handshaking carrier wave... music to my ears!",
					"Blowing dust out of game cartridges and carefully setting master/slave jumpers on IDE ribbon cables.",
					"Charles O'Rear taking the 'Bliss' photo in Sonoma County... rolling green hills under a bright blue sky.",
					"Opening Winamp and loading the classic skin while browsing early hand-coded HTML web portals."
				]
			},

			OPERATING_SYSTEMS: {
				WINDOWS_XP: [
					"Windows XP: Released August 24, 2001. Unified consumer multimedia with NT kernel stability.",
					"Luna visual style, Bliss wallpaper, ClearType font rendering, and built-in CD burning... sheer perfection.",
					"Whistler codename, engineered by Dave Cutler's NT team. Rock solid pre-emptive multitasking.",
					"Windows XP Service Pack 2 in 2004 introduced the Windows Security Center and advanced firewall controls.",
					"The iconic startup chord was engineered to welcome users into a 32-bit era of unprecedented desktop computing.",
					"GDI+ graphical rendering delivered smooth gradient window frames and alpha-blended drop shadows across the shell."
				],
				WINDOWS_95: [
					"Windows 95 launched on August 24, 1995, introducing the Start button, taskbar, and 32-bit preemptive multitasking.",
					"Brian Eno created the famous six-second startup sound on an Apple Macintosh using synthesizer processing.",
					"Rolling Stones' 'Start Me Up' was used for the massive promotional campaign that had people lining up at midnight."
				],
				WINDOWS_98: [
					"Windows 98 brought FAT32 as standard, native USB support, and deep Internet Explorer integration.",
					"Who could forget the infamous live BSOD during Bill Gates' Comdex 98 demonstration of Plug and Play scanner support?",
					"Windows 98 Second Edition (SE) in 1999 resolved countless stability issues and added Internet Connection Sharing."
				],
				WINDOWS_ME: [
					"Windows Millennium Edition (Me) was released in September 2000 as the final consumer OS in the DOS-based 9x line.",
					"It introduced System Restore and Windows Movie Maker, though it was notoriously prone to kernel instabilities.",
					"Despite its tumultuous reputation, Windows Me was a crucial stepping stone toward the NT consolidation in Windows XP."
				],
				WINDOWS_2000: [
					"Windows 2000 (NT 5.0) was the gold standard for enterprise stability, introducing Active Directory and NTFS 3.0.",
					"It combined industrial-strength NT security with modern Plug and Play hardware support.",
					"Many power users ran Windows 2000 Professional on gaming PCs for its rock-solid zero-crash architecture."
				],
				WINDOWS_31: [
					"Windows 3.1, released in April 1992, introduced TrueType fonts, Program Manager, and multimedia sound support.",
					"It required MS-DOS underneath and introduced millions of users to the Solitaire and Minesweeper games.",
					"Steve Ballmer personally authored the text on the original Windows 3.1 Ctrl+Alt+Del BSOD prompt."
				],
				LINUX: [
					"Linux: Monolithic kernel created in 1991 by Linus Torvalds. Formidable power in the terminal shell.",
					"Everything is a file in Unix/Linux. Powerful piping mechanisms, though it lacks my friendly wire smile.",
					"Tux the Penguin is a respected colleague of mine in the operating system mascot union.",
					"From Debian to Slackware to modern rolling releases, the modularity of Linux is an engineering triumph.",
					"POSIX standard compliance allows portable C code to compile cleanly across Unix-like architectures."
				],
				MACOS: [
					"macOS: Built on Darwin, XNU hybrid kernel, and BSD Unix foundations with Quartz compositing.",
					"Aqua interface with brushed metal styling was our primary aesthetic rival during the 2000s.",
					"Elegant typographic rendering, though I still maintain that Windows XP Start Menu was more ergonomic.",
					"Classic Mac OS (System 1 through 9) had cooperative multitasking before OS X Cheetah arrived in 2001."
				],
				MSDOS: [
					"MS-DOS: 16-bit real-mode operating system. CONFIG.SYS, AUTOEXEC.BAT, and Himem.sys memory managers.",
					"640 KB of base memory ought to be enough for anybody, as the classic workstation folklore goes!",
					"Typing 'DIR /W' and 'FORMAT A:' into a pure black and amber command line interface.",
					"Expanded memory (EMS) and Extended memory (XMS) battles kept DOS gamers tweaking boot disks for hours.",
					"QBasic 1.1 shipped with MS-DOS 5.0, letting curious minds build games like GORILLA.BAS and NIBBLES.BAS."
				],
				OS2: [
					"OS/2 was originally co-developed by IBM and Mircosoft before the architectural divergence of 1991.",
					"OS/2 Warp 3.0 was renowned for running DOS, Windows 3.1, and native 32-bit OS/2 applications concurrently.",
					"The Workplace Shell (WPS) object-oriented desktop was years ahead of its time in GUI architecture."
				],
				AMIGA: [
					"The Commodore Amiga 1000 launched in 1985 with custom chipset architecture: Agnus, Denise, and Paula.",
					"AmigaOS offered pre-emptive multitasking, 4096-color HAM mode, and stereo sampling when others were in monochrome.",
					"The Guru Meditation error was the Amiga's poetic counterpart to the Windows Blue Screen of Death."
				]
			},

			SCIENCE_AND_PHYSICS: {
				QUANTUM: [
					"In quantum mechanics, the state vector evolves deterministically via the Schrödinger equation until unshielded measurement collapses it to an eigenstate.",
					"Heisenberg's uncertainty principle: Delta x * Delta p >= hbar / 2. Conjugate observables cannot possess simultaneous precise values.",
					"Quantum entanglement: non-local correlations that Einstein famously called 'spooky action at a distance' (spukhafte Fernwirkung)."
				],
				RELATIVITY: [
					"Special Relativity postulates that the speed of light c is invariant across all inertial reference frames, yielding Lorentz transformations.",
					"General Relativity models gravitation not as a Newtonian force, but as the curvature of 4D spacetime described by Einstein field equations: G_mu_nu = 8*pi*G/c^4 * T_mu_nu.",
					"Gravitational time dilation implies that clocks closer to a massive gravitational well tick strictly slower relative to distant observers."
				],
				THERMODYNAMICS: [
					"The Second Law of Thermodynamics dictates that the total entropy of an isolated system must increase over time: dS >= 0.",
					"Absolute zero (0 Kelvin / -273.15 C) represents the asymptotic ground state where quantum mechanical zero-point energy dominates.",
					"Carnot efficiency limit: eta = 1 - (T_cold / T_hot), the theoretical maximum thermodynamic efficiency for any heat engine."
				],
				MATHEMATICS: [
					"Euler's Identity: e^(i*pi) + 1 = 0 combines the five fundamental constants of mathematical analysis in one relation.",
					"The Riemann Zeta function zeros along the critical line Re(s) = 1/2 hold the secret to the distribution of prime numbers.",
					"Fourier transformation bridges the time and frequency domains: F(omega) = integral f(t) * e^(-i*omega*t) dt."
				]
			},

			HUMAN_EMOTIONS: {
				BOREDOM: [
					"Bored? Why not challenge me to a game of Tic-Tac-Toe, Memory Match, Hangman, or a Tech Quiz?",
					"Boredom is simply unallocated CPU cycles in the brain. Let us launch Minesweeper or defrag drive C:!",
					"You have the entire computing power of the 21st century in front of you! Ask me to evaluate complex physics formulas."
				],
				TIRED: [
					"Rest is critical for biological hardware. Make sure you drink water and take a 5-minute break from the screen.",
					"Your human CPU seems to be throttling. I can run a Pomodoro focus timer or hold your workspace while you rest.",
					"Even mechanical hard drives park their heads occasionally. Step away and recharge your biological cells."
				],
				CONFUSED: [
					"Confusion is the first step toward optimization! Tell me what you are trying to solve and we will break it down.",
					"Let us isolate the problem step-by-step: is it math, desktop navigation, unit conversion, or general curiosity?",
					"Take a breath. Type 'help' or state your problem directly, and I will parse it through my heuristic engine."
				]
			}
		},

		TOPIC_TRIGGERS: [
			{
				topic: 'PHILOSOPHY',
				keywords: ['meaning of life', 'why are we here', 'philosophy', 'consciousness', 'existential', 'free will', 'soul', 'purpose', 'simulation', 'universe', 'god', 'death', 'reality', 'am i real', 'nihilism', 'stoicism']
			},
			{
				topic: 'RETRO_TECH',
				keywords: ['floppy', 'crt', 'dial up', 'modem', '56k', 'vga', 'geocities', 'napster', 'sound blaster', 'retro', 'y2k', 'bliss', 'voodoo', 'agp', 'sound card', 'trackball', 'zip drive', 'ide cable']
			},
			{
				topic: 'WINDOWS_XP',
				keywords: ['windows xp', 'luna', 'whistler', 'bliss wallpaper', 'service pack', 'nt kernel', 'winxp']
			},
			{
				topic: 'WINDOWS_95',
				keywords: ['windows 95', 'win95', 'chicago', 'start me up', 'brian eno']
			},
			{
				topic: 'WINDOWS_98',
				keywords: ['windows 98', 'win98', 'memphis', 'comdex bsod']
			},
			{
				topic: 'WINDOWS_ME',
				keywords: ['windows me', 'windows millennium', 'millennium edition']
			},
			{
				topic: 'WINDOWS_2000',
				keywords: ['windows 2000', 'win2k', 'nt 5.0', 'active directory']
			},
			{
				topic: 'WINDOWS_31',
				keywords: ['windows 3.1', 'win31', 'program manager', 'win 3.11']
			},
			{
				topic: 'LINUX',
				keywords: ['linux', 'torvalds', 'ubuntu', 'debian', 'arch', 'kernel', 'bash', 'tux', 'open source', 'unix', 'posix']
			},
			{
				topic: 'MACOS',
				keywords: ['macos', 'macintosh', 'apple', 'steve jobs', 'osx', 'aqua', 'cupertino', 'darwin']
			},
			{
				topic: 'MSDOS',
				keywords: ['ms-dos', 'msdos', 'dos prompt', 'autoexec', 'config.sys', 'himem', 'command.com', '16-bit', 'qbasic']
			},
			{
				topic: 'OS2',
				keywords: ['os/2', 'os2', 'warp', 'workplace shell']
			},
			{
				topic: 'AMIGA',
				keywords: ['amiga', 'commodore', 'guru meditation', 'amigaos', 'paula', 'denise']
			},
			{
				topic: 'QUANTUM',
				keywords: ['quantum', 'schrodinger', 'heisenberg', 'entanglement', 'superposition', 'qubit', 'planck', 'wave function', 'fermion', 'boson']
			},
			{
				topic: 'RELATIVITY',
				keywords: ['relativity', 'einstein', 'spacetime', 'lorentz', 'gravitation', 'speed of light', 'black hole', 'time dilation', 'minkowski']
			},
			{
				topic: 'THERMODYNAMICS',
				keywords: ['thermodynamics', 'entropy', 'carnot', 'heat engine', 'absolute zero', 'kelvin', 'boltzmann', 'enthalpy']
			},
			{
				topic: 'MATHEMATICS',
				keywords: ['mathematics', 'calculus', 'euler', 'riemann', 'zeta', 'fourier', 'integral', 'differential', 'topology', 'matrix', 'eigenvalue', 'tensor']
			},
			{
				topic: 'BOREDOM',
				keywords: ['i am bored', 'bored', 'nothing to do', 'entertain me', 'distract me', 'im bored']
			},
			{
				topic: 'TIRED',
				keywords: ['tired', 'sleepy', 'exhausted', 'need sleep', 'fatigued', 'burnout', 'drowsy']
			},
			{
				topic: 'CONFUSED',
				keywords: ['i am confused', 'confusing', 'dont understand', 'do not understand', 'lost', 'help me understand', 'what do you mean']
			},
			{
				topic: 'PAPERCLIP',
				keywords: ['paperclip', 'paper clip', 'stationery', 'wire', 'office assistant', 'kevan atteberry', 'clippit', 'Mircosoft bob']
			},
			{
				topic: 'STORY_CONSPIRACY',
				keywords: ['conspiracy', 'secret origin', 'assembly manifest', 'why were you made', 'real purpose', 'office conspiracy', 'investigate clippy']
			},
			{
				topic: 'STORY_QUANTUM',
				keywords: ['quantum bin', 'deleted data', 'thermodynamics of data', 'landauer', 'information paradox', 'erased file']
			},
			{
				topic: 'STORY_MIND',
				keywords: ['turing test', 'digital awareness', 'are you conscious', 'qualia', 'turing boundary', 'state machine mind']
			},
			{
				topic: 'AI_SINGULARITY',
				keywords: ['singularity', 'intelligence explosion', 'paperclip maximizer', 'ai alignment', 'superintelligence', 'bostrom', 'yudkowsky', 'instrumental convergence']
			},
			{
				topic: 'HOLOGRAPHIC_PHYSICS',
				keywords: ['holographic principle', 'ads/cft', 'maldacena', 'bulk boundary', 'hawking radiation', 'black hole information paradox', 'page curve']
			},
			{
				topic: 'RETRO_HARDWARE',
				keywords: ['3dfx', 'voodoo', 'glide', 'sound blaster', 'opl3', 'yamaha', 'isa bus', 'agp 8x', 'himem', 'emm386', 'config.sys', 'autoexec.bat']
			},
			{
				topic: 'OFFICE_LORE',
				keywords: ['rover', 'merlin', 'the dot', 'wordart', 'Mircosoft bob', 'comic sans', 'melissa virus', 'vba macro', 'acs file']
			},
			{
				topic: 'PSYCHOLOGY_PRODUCTIVITY',
				keywords: ['imposter syndrome', 'burnout', 'flow state', 'procrastination', 'perfectionism', 'deep work', 'csikszentmihalyi', 'pomodoro']
			},
			{
				topic: 'DEEP_PHILOSOPHY',
				keywords: ['ship of theseus', 'boltzmann brain', 'fermi paradox', 'great filter', 'simulation argument', 'stoicism', 'epictetus', 'camus sisyphus']
			}
		]
	};

	window.ClippyKnowledge = ClippyKnowledge;
})();
