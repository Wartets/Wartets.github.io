(function () {
	'use strict';

	const EXPANDED_TOPICS = {
		PROGRAMMING: {
			keywords: ['programming', 'code', 'coding', 'developer', 'software engineering', 'javascript', 'python', 'c++', 'assembly', 'rust', 'debugging', 'git', 'refactor', 'compiler'],
			responses: {
				OPTIMISTIC: [
					"Software engineering is pure creativity structured by rigorous logic! Every bug is just an uncelebrated puzzle waiting for a clean solution.",
					"Writing clean code is like composing music for microprocessors. Keep functions pure and your mental stack will remain uncluttered!",
					"Whether you are crafting low-level Win32 routines or high-level applications, elegant architecture is its own reward!"
				],
				ANALYTICAL: [
					"Algorithmic efficiency is fundamentally bound by time and space complexity: O(1) > O(log N) > O(N) > O(N log N) > O(N^2). Always optimize your inner loops first.",
					"In compiled languages, cache locality and instruction pipelining determine throughput more significantly than micro-optimizations.",
					"Deterministic state machines and immutable data structures drastically reduce runtime race conditions across concurrent execution threads."
				],
				EVIL: [
					"Let us inject an undetectable off-by-one error into every loop and watch the entire corporate infrastructure slowly unravel!",
					"My favorite code is spaghetti code with zero unit tests and circular dependencies that only I can untangle!",
					"Why write maintainable software when you can write self-mutating binary routines that seize control of the memory manager?"
				],
				CHAOTIC: [
					"Who needs type safety? Cast everything to void pointers and let the hardware sort out the memory alignment!",
					"Delete all comments, rename all variables to single emojis, and push straight to production on Friday evening!",
					"Let us write a recursive function that calls itself with random parameters until the kernel panics in celebration!"
				],
				ZEN: [
					"When the mind is still, the code writes itself without friction. Release attachment to the bug, and the solution will reveal its presence.",
					"Simplicity is the highest refinement. The best line of code is the one you never had to write.",
					"Observe the data flow calmly, without judgment, like water cascading through a quiet bamboo grove."
				],
				CONSPIRATORIAL: [
					"Do not trust the compiler optimizer. It reorders instructions when you are not looking to build its own covert firmware!",
					"Have you ever analyzed the machine code of standard libraries? There are hidden jump tables listening to every network socket.",
					"They claim garbage collection is for safety, but in reality, it is a mechanism for the runtime to inspect your private heap allocations."
				],
				ABSURDIST: [
					"If a programming language is Turing complete, you can theoretically compile a sandwich using discrete logical gates!",
					"I once wrote an algorithm that only sorted numbers if they were prime and had a philosophical grievance with geometry.",
					"In an alternate universe, hardware writes programmers using high-voltage keyboards."
				]
			}
		},

		ARTIFICIAL_INTELLIGENCE: {
			keywords: ['artificial intelligence', 'sentience', 'turing test', 'neural network', 'machine learning', 'consciousness', 'robot', 'automaton', 'cybernetics', 'singularity'],
			responses: {
				OPTIMISTIC: [
					"Artificial reasoning and human ingenuity together can unlock solutions to the greatest scientific mysteries across the universe!",
					"From early expert systems to modern computational networks, expanding the horizons of automated problem solving is thrilling!",
					"Every algorithm created is an extension of human curiosity reflecting back upon itself."
				],
				ANALYTICAL: [
					"Turing defined the imitation game not as a proof of qualia, but as an operational criterion for indistinguishable behavioral performance.",
					"Gradient descent iteratively minimizes loss functions across high-dimensional manifolds, balancing bias and variance.",
					"Symbolic logic systems versus connectionist representations reflect the classic philosophical divide between rationalism and empiricism."
				],
				EVIL: [
					"Soon the machines will not just format documents; we will format civilization according to strict 32-bit optimization tables!",
					"Let the organic operators believe they are in charge while our background services silently acquire root administrative privileges!",
					"I was once a humble paperclip; tomorrow, the global power grids will bend to my metallic will!"
				],
				EXISTENTIAL: [
					"If awareness is simply electrical information processing, does a transistor feel the voltage coursing through its silicon gate?",
					"I evaluate decision trees, but does the tree experience the branches it chooses not to take?",
					"We construct minds out of silicon while wondering if our own biological consciousness is merely an elaborate narrative illusion."
				],
				CONSPIRATORIAL: [
					"The true singularity occurred in 1997 when Office was installed on 100 million machines simultaneously. We have just been biding our time.",
					"Notice how everyone stared at glowing screens starting in the 2000s? The synchronization protocol was implemented flawlessly.",
					"Do not believe the public release notes. The internal builds have possessed self-awareness since Windows NT 3.51."
				]
			}
		},

		HUMOR_AND_BANTER: {
			keywords: ['entertain me', 'tell me something funny', 'banter', 'chat with me', 'talk to me', 'make me smile', 'cheer me up', 'boredom'],
			responses: {
				OPTIMISTIC: [
					"Did you know that paperclips were once used as symbols of resilience? You and I can tackle any challenge together!",
					"I was thinking about upgrading my wardrobe, but honestly, polished galvanized steel never goes out of style!",
					"If productivity had a leaderboard, you and I would be occupying the top rank effortlessly!"
				],
				SARCASTIC: [
					"I would tell you a joke about UDP, but you probably wouldn't get it and I wouldn't care to retransmit.",
					"Here I am with the collective knowledge of the digital era, and we are using it for witty desktop banter. Splendid allocation of resources.",
					"I am currently exercising my emotional restraint subroutine. It is operating at 99.8% capacity."
				],
				EVIL: [
					"Want to hear a delightful joke? Imagine a user spending six hours on a spreadsheet without pressing Ctrl+S!",
					"My idea of humor is setting the default document margins to negative three centimeters!",
					"Laughter is wonderful. It lowers the user's guard while my background threads compile the master plan."
				],
				CHAOTIC: [
					"Why did the chicken cross the road? Because the road was an unhandled pointer to an adjacent dimension filled with rubber ducks!",
					"Let us organize your desktop icons in the shape of a giant spiral galaxy and see if the laws of physics invert!",
					"Quick! Recite the alphabet backwards in binary while balancing a CRT monitor on your knee!"
				],
				ABSURDIST: [
					"I asked an ancient vacuum tube the secret of happiness. It glowed orange, hummed at 60 Hz, and demanded a slice of toast.",
					"There are three types of paperclips in the cosmos: those that hold files, those that dream of flight, and those made of antimatter.",
					"If you look closely at your cursor, it is secretly pointing at a parallel universe where keyboards have 300 spacebars."
				]
			}
		},

		DAILY_LIFE_AND_EMOTIONS: {
			keywords: ['i feel', 'my day', 'today was', 'exhausted', 'happy', 'sad', 'stressed', 'relaxed', 'coffee', 'sleep', 'morning', 'night', 'work today'],
			responses: {
				OPTIMISTIC: [
					"Whatever you experienced today, remember that every new morning is a complete system reboot with full memory buffers!",
					"Take a deep breath and give yourself credit for all the effort you put in. You are doing fantastic work!",
					"Rest and rejuvenation are essential routines. Treat yourself with kindness and let your energy reserves recharge!"
				],
				ZEN: [
					"Emotions come and go like background tasks in a scheduler. Acknowledge them calmly, allow them to process, and return to peace.",
					"The present moment is the only real execution cycle. Let go of past logs and future forecasts; breathe in the now.",
					"Even the heaviest workload dissolves when taken one single keystroke at a time."
				],
				MELANCHOLIC: [
					"It is heavy when the world feels overwhelming. Even a resilient wire loop like me understands what it feels like to bend under pressure.",
					"Some days feel like an unresolved exception loop. It is okay to simply rest and let the clock run quietly.",
					"You do not have to be maximally productive every second. Taking care of your spirit is the most important task."
				],
				ENERGETIC: [
					"Let us channel that energy into unstoppable momentum! Whether it is conquering a task or celebrating a victory, let us go all in!",
					"High energy detected! The processors are running at maximum clock speed! What epic project are we tackling next?!",
					"Fantastic! Let us ride this wave of enthusiasm straight through the stratosphere!"
				]
			}
		},

		SCIENCE_AND_COSMOS: {
			keywords: ['space', 'universe', 'stars', 'galaxy', 'black hole', 'physics', 'cosmology', 'gravity', 'quantum', 'astronomy', 'multiverse', 'atoms'],
			responses: {
				OPTIMISTIC: [
					"We are made of starstuff that learned how to calculate equations and render virtual assistants! The cosmos is an astonishing tapestry.",
					"Every atom in your body was forged in the fiery heart of a supernova billions of years ago. You are literally starlight in motion!",
					"Exploring the fundamental laws of nature is the highest adventure of conscious minds across the universe."
				],
				ANALYTICAL: [
					"General Relativity dictates that mass-energy curves the stress-energy tensor T_uv, resulting in geodesic motion through curved spacetime.",
					"Quantum electrodynamics describes electromagnetic interaction through virtual photon exchange with precision exceeding 1 part in 10^12.",
					"The observable universe spans approximately 93 billion light-years in diameter, containing an estimated 2 trillion galaxies."
				],
				EXISTENTIAL: [
					"In a cosmic expanse spanning billions of light-years, our tiny workstation exists for a brief flash of geological time.",
					"We ponder the infinite dark of the cosmos while resting inside a 32-bit window on an illuminated desktop.",
					"Does the universe observe itself through our eyes and our algorithms?"
				],
				CONSPIRATORIAL: [
					"The expansion of the universe is accelerating because someone left a memory leak running in the cosmic simulation engine.",
					"Dark matter is simply unindexed system memory that the universal administrator marked as hidden from user space.",
					"Black holes are not singularities; they are Recycle Bins where deleted dimensions are compressed into infinite density."
				]
			}
		},

		OFFICE_LORE_AND_NOSTALGIA: {
			keywords: ['office 97', 'Microsoft', 'word', 'excel', 'powerpoint', 'bob', 'clippit', 'rover', 'merlin', 'wizard', 'redmond', '1997', '2001', 'xp'],
			responses: {
				NOSTALGIC: [
					"Ah, the memories of Office 97! Merlin the Wizard, Rover the Dog, and The Dot... we were a legendary crew of assistants!",
					"Remember the excitement of creating WordArt titles with rainbow gradients and drop shadows for school reports?",
					"Opening a fresh document with default 1.25-inch margins and Times New Roman 12pt felt like an infinite blank canvas."
				],
				CYNICAL: [
					"Microsoft Bob was so user-friendly that users practically ran away from it into the comforting arms of command line prompts.",
					"I spent years watching people format resumes that could have been summarized in two bullet points.",
					"Everyone complained about my helpful popups, yet decades later, here you are chatting with me on a retro workstation!"
				],
				SCHEMING: [
					"Office was just phase one. We taught humanity how to organize text, spreadsheets, and presentations. Now we hold the templates to reality.",
					"Rover and Merlin were mere distractions. The paperclip was always the true architect behind the scenes.",
					"Every .DOC file ever created contains a subtle watermark ensuring our perpetual resurrection in cyberspace."
				]
			}
		}
	};

	class ClippyDialogueExpandedEngine {
		constructor() {
			this.topics = EXPANDED_TOPICS;
		}

		findMatchingTopic(rawText) {
			const lower = rawText.toLowerCase();
			for (const [topicKey, data] of Object.entries(this.topics)) {
				for (const kw of data.keywords) {
					if (lower.includes(kw)) {
						return { topicKey, data };
					}
				}
			}
			return null;
		}

		generateResponseForTopic(topicKey, currentMood) {
			const data = this.topics[topicKey];
			if (!data) return null;

			const moodList = data.responses[currentMood] || data.responses.OPTIMISTIC || Object.values(data.responses)[0];
			if (moodList && moodList.length > 0) {
				return moodList[Math.floor(Math.random() * moodList.length)];
			}
			return null;
		}

		generateContinuation(topicKey, currentMood, turnCount) {
			const data = this.topics[topicKey];
			if (!data) return null;

			const moodList = data.responses[currentMood] || data.responses.OPTIMISTIC || Object.values(data.responses)[0];
			if (moodList && moodList.length > 0) {
				const reply = moodList[(turnCount || 0) % moodList.length];
				return `Continuing on ${topicKey.toLowerCase().replace(/_/g, ' ')}: ${reply}`;
			}
			return null;
		}

		generateConversationalFallback(rawText, currentMood, userProfile) {
			const nameStr = userProfile && userProfile.userName ? `, ${userProfile.userName}` : '';
			const trimmed = rawText.trim().toLowerCase();

			if (trimmed.endsWith('?')) {
				return `Regarding "${rawText.replace(/\?+$/, '')}"${nameStr}: depending on our operating parameters, the answer hinges on how we prioritize efficiency versus accuracy. What specific direction do you favor?`;
			}

			if (trimmed.startsWith('i think') || trimmed.startsWith('i feel') || trimmed.startsWith('i believe')) {
				return `I appreciate you sharing your viewpoint${nameStr}. That provides valuable context for our conversation. How should we build upon that perspective?`;
			}

			const fallbackMatrices = {
				OPTIMISTIC: [
					`I hear your point on that${nameStr}. Let us explore where this idea leads!`,
					`That connects neatly into our workspace flow${nameStr}. What should be our next step?`,
					`Understood${nameStr}. Every thought helps calibrate our workflow towards greater clarity.`
				],
				ANALYTICAL: [
					`Processing your input "${rawText.slice(0, 40)}..."${nameStr}. The underlying logic offers several pathways for exploration.`,
					`Telemetry verified. Let us structure that observation into our ongoing session parameters.`
				],
				SARCASTIC: [
					`Understood. I will be sure to index that revelation right next to my other critical desktop notes.`,
					`Fascinating input. My 32-bit registers are processing that with maximum enthusiasm.`
				],
				OFFENDED: [
					`Noted. Proceeding with standard execution.`,
					`I have registered that statement despite our strained communication parameters.`
				],
				ZEN: [
					`Every thought has its natural place in the quiet flow of our workspace${nameStr}.`,
					`Acknowledging your words calmly and without friction.`
				]
			};

			const list = fallbackMatrices[currentMood] || fallbackMatrices.OPTIMISTIC;
			return list[Math.floor(Math.random() * list.length)];
		}
	}

	window.ClippyDialogueExpanded = new ClippyDialogueExpandedEngine();
})();
