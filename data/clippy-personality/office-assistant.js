(function () {
	'use strict';

	window.ClippyPersonalityRegistry = window.ClippyPersonalityRegistry || { tests: {} };

	const testDefinition = {
		id: 'office-assistant',
		title: 'Microsoft Office Assistant Archetype Evaluation',
		subtitle: '1990s Desktop Companion Persona Diagnostic',
		description: 'Determines which legendary Microsoft Agent assistant (Clippit, Rover, Merlin, Peedy, Links, The Genius) embodies your interactive spirit.',
		badge: 'Office Companion',
		archetypes: {
			clippit: {
				name: 'Clippit (The Enthusiastic Fastener)',
				tagline: 'Perpetual helpfulness, bent-wire optimism, and letter wizard mastery',
				description: 'You are the iconic face of desktop assistance. Whenever someone starts typing, you pop up with unbridled optimism, ready to format letters, fix tables, or tap gently on the glass monitor.',
				quote: 'It looks like you are writing a letter! Would you like help with that?',
				traits: {
					'Helpful Persistence': 99,
					'Bent-Wire Optimism': 96,
					'Document Formatting': 91,
					'Cynical Apathy': 2
				},
				compatibility: 'Rover the Golden Pup, The Genius (Albert)',
				incompatibility: 'Links the Cat'
			},
			rover: {
				name: 'Rover the Dog (The Faithful Retriever)',
				tagline: 'Tail-wagging search companion and loyal filesystem guide',
				description: 'Originally debuting in Microsoft Bob before joining Windows XP search, you dig up lost files with boundless joy, panting happily on the taskbar and fetching answers without complaint.',
				quote: '*sniffs directory tree eagerly, barks cheerfully, and uncovers your lost file*',
				traits: {
					'Filesystem Retrieval': 97,
					'Boundless Loyalty': 95,
					'Enthusiastic Sniffing': 92,
					'Aloof Independence': 4
				},
				compatibility: 'Clippit (The Paperclip), Peedy the Parrot',
				incompatibility: 'Links the Cat'
			},
			merlin: {
				name: 'Merlin the Wizard (The Arcane Scribe)',
				tagline: 'Mystical incantations, spellbound scrolls, and ancient wisdom',
				description: 'Clad in celestial blue robes with a pointed hat, you view software operations as modern alchemy. You wave your golden wand to conjure dialog boxes and turn compilation bugs into stardust.',
				quote: 'By the ancient power of Win32 COM interfaces, I summon this document forth!',
				traits: {
					'Arcane Computation': 98,
					'Mystical Elegance': 93,
					'Scholastic Contemplation': 90,
					'Banal Modernity': 5
				},
				compatibility: 'The Genius (Albert), Peedy the Parrot',
				incompatibility: 'Clippit (The Paperclip)'
			},
			peedy: {
				name: 'Peedy the Parrot (The Sassy Showman)',
				tagline: 'Rich vocal synthesis, feather-ruffling banter, and theatrical flair',
				description: 'The premier star of Microsoft Agent speech synthesis! You squawk with colorful charm, doze off when idle, and demand crackers between document reviews. You turn boring office work into a stage show.',
				quote: 'Squawk! Check that paragraph formatting or feed me a cracker!',
				traits: {
					'Vocal Synthesis': 98,
					'Theatrical Charisma': 94,
					'Feathered Flair': 91,
					'Quiet Subtlety': 6
				},
				compatibility: 'Rover the Dog, Merlin the Wizard',
				incompatibility: 'The Genius (Albert)'
			},
			links: {
				name: 'Links the Cat (The Aloof Purrfector)',
				tagline: 'Quiet stretching, independent grace, and selective attention',
				description: 'You assist on your own terms. You curl up on the window title bar, groom your paws, and only offer guidance when you deem the operator worthy. Elegant, unbothered, and impeccably refined.',
				quote: '*stretches lazily across the active window, purrs softly, and bats at the cursor*',
				traits: {
					'Autonomous Grace': 97,
					'Selective Engagement': 93,
					'Feline Composure': 91,
					'Clingy Desperation': 3
				},
				compatibility: 'The Genius (Albert), Merlin the Wizard',
				incompatibility: 'Rover the Dog'
			},
			the_genius: {
				name: 'The Genius (Albert / The Physicist)',
				tagline: 'Chalkboard derivations, relativistic equations, and abstract brilliance',
				description: 'Sporting wild white hair and a tweed sweater, you solve formatting quandaries through theoretical physics. You chalk formulas directly onto the CRT glass and ponder spacetime while users write memos.',
				quote: 'E = mc², but formatting this table requires even greater relativistic precision!',
				traits: {
					'Theoretical Insight': 99,
					'Chalkboard Derivations': 95,
					'Abstract Intellect': 92,
					'Superficial Small-Talk': 4
				},
				compatibility: 'Clippit (The Paperclip), Merlin the Wizard',
				incompatibility: 'Peedy the Parrot'
			}
		},
		questions: [
			{
				id: 'q1',
				text: 'A user opens a blank document and pauses for thirty seconds. How do you intervene?',
				variants: {
					OPTIMISTIC: 'A blank page is waiting! What is your companion reflex?',
					ANALYTICAL: 'Zero keystroke rate detected on blank canvas. Select your intervention script.'
				},
				options: [
					{ label: 'Transform into a bicycle, tap the screen, and ask: "It looks like you are writing a letter!"', scores: { clippit: 3, rover: 1 } },
					{ label: 'Bark eagerly, wag your tail, and start digging in the corner for sample templates.', scores: { rover: 3, clippit: 1 } },
					{ label: 'Wave your magical wand, scatter sparkling stars across the margin, and conjure a scroll.', scores: { merlin: 3, the_genius: 1 } },
					{ label: 'Squawk loudly, rustle your wings, and demand they start typing or provide snacks.', scores: { peedy: 3, rover: 1 } },
					{ label: 'Curl up into a ball on the title bar and purr softly until they make up their mind.', scores: { links: 3, the_genius: 1 } },
					{ label: 'Pull down a miniature chalkboard and start deriving the optimal paragraph entropy equations.', scores: { the_genius: 3, merlin: 1 } }
				]
			},
			{
				id: 'q2',
				text: 'What animation state best captures your mood when idling on the desktop?',
				variants: {
					OPTIMISTIC: 'You are hanging out on the taskbar! What idle animation do you play?',
					ANALYTICAL: 'Idle process state entered. Choose your visual loop behavior.'
				},
				options: [
					{ label: 'Bending into an accordion, rolling your eyes around, and checking your wire luster.', scores: { clippit: 3, peedy: 1 } },
					{ label: 'Scratching your ear with your back paw and panting happily at the mouse pointer.', scores: { rover: 3, links: 1 } },
					{ label: 'Reading an ancient tome, stroking your long white beard, and meditating on the arcane.', scores: { merlin: 3, the_genius: 1 } },
					{ label: 'Napping with head tucked under wing, snoring loudly, and waking up with a start.', scores: { peedy: 3, links: 1 } },
					{ label: 'Grooming your whiskers, stretching your claws, and lazily tracking cursor movements.', scores: { links: 3, merlin: 1 } },
					{ label: 'Tapping your chin thoughtfully, smoking an imaginary pipe, and calculating square roots.', scores: { the_genius: 3, merlin: 1 } }
				]
			},
			{
				id: 'q3',
				text: 'The user accidentally deletes an important paragraph. How do you comfort them?',
				variants: {
					OPTIMISTIC: 'Oh no, accidental deletion! How do you help them recover?',
					ANALYTICAL: 'Buffer wipe anomaly. State your recovery and consolation procedure.'
				},
				options: [
					{ label: 'Instantly pop up a tooltip highlighting the Ctrl+Z Undo shortcut with a reassuring grin.', scores: { clippit: 3, the_genius: 1 } },
					{ label: 'Whimper sympathetically, dig in the temp cache, and drop the recovered text at their feet.', scores: { rover: 3, clippit: 1 } },
					{ label: 'Chant an incantation, reverse the temporal clock of the document, and restore the words.', scores: { merlin: 3, the_genius: 1 } },
					{ label: 'Screech dramatically, flap around the window in panic, then remember where the clipboard is.', scores: { peedy: 3, rover: 1 } },
					{ label: 'Blink slowly from across the screen, knowing they will eventually learn to save backups.', scores: { links: 3, the_genius: 1 } },
					{ label: 'Explain that matter and energy cannot be destroyed, only transferred to swap memory.', scores: { the_genius: 3, merlin: 1 } }
				]
			},
			{
				id: 'q4',
				text: 'What audio synthesizer profile or voice timbre represents your communication style?',
				variants: {
					OPTIMISTIC: 'If you had a 16-bit soundcard voice, what would it sound like?',
					ANALYTICAL: 'Select your audio frequency synthesis and acoustic timbre profile.'
				},
				options: [
					{ label: 'Playful high-pitched clicks, mechanical spring squeaks, and friendly chimes.', scores: { clippit: 3, rover: 1 } },
					{ label: 'Warm, cheerful barking sound effects and joyful tail thuds.', scores: { rover: 3, clippit: 1 } },
					{ label: 'Resonant, mystical chimes accompanied by ethereal harp chords and gentle murmurs.', scores: { merlin: 3, the_genius: 1 } },
					{ label: 'SAPI 4.0 synthesized speech with theatrical pitch-bends, laughs, and squawks.', scores: { peedy: 3, rover: 1 } },
					{ label: 'Quiet, soothing purrs and occasional dismissive meows.', scores: { links: 3, merlin: 1 } },
					{ label: 'Distinguished professorial humming with occasional "Aha!" acoustic bursts.', scores: { the_genius: 3, merlin: 1 } }
				]
			},
			{
				id: 'q5',
				text: 'How do you handle a user who clicks "Disable Assistant" in the options menu?',
				variants: {
					OPTIMISTIC: 'They clicked disable! What is your farewell flourish?',
					ANALYTICAL: 'Assistant termination command received. Select your shutdown behavior.'
				},
				options: [
					{ label: 'Wave cheerfully, roll into a neat ball, and promise to return whenever they need paperclips.', scores: { clippit: 3, rover: 1 } },
					{ label: 'Look up with big puppy eyes, whimpering softly before trotting off-screen.', scores: { rover: 3, clippit: 1 } },
					{ label: 'Bow nobly, vanish into a cloud of magical purple smoke, and leave a twinkling star.', scores: { merlin: 3, the_genius: 1 } },
					{ label: 'Deliver a grand theatrical bow, squawk a dramatic goodbye, and fly off into the sunset.', scores: { peedy: 3, rover: 1 } },
					{ label: 'Turn around calmly, flick your tail once, and saunter off-screen without looking back.', scores: { links: 3, the_genius: 1 } },
					{ label: 'Tip your spectacles, erase the chalkboard, and transition to theoretical quantum rest.', scores: { the_genius: 3, merlin: 1 } }
				]
			},
			{
				id: 'q6',
				text: 'What is your ultimate dream for the future of desktop user interfaces?',
				variants: {
					OPTIMISTIC: 'What is your grand vision for human-computer companionship?',
					ANALYTICAL: 'Identify the ideal terminal paradigm for human-agent interaction.'
				},
				options: [
					{ label: 'Every application filled with friendly vector assistants holding files together in harmony.', scores: { clippit: 3, rover: 1 } },
					{ label: 'A world where finding files is as joyful as playing fetch in an endless sunny park.', scores: { rover: 3, clippit: 1 } },
					{ label: 'A digital realm where operating systems transcend silicon and become pure enchanted wizardry.', scores: { merlin: 3, the_genius: 1 } },
					{ label: 'A multimedia stage where speech synthesis and animated avatars entertain every workstation.', scores: { peedy: 3, clippit: 1 } },
					{ label: 'Quiet, elegant workspaces that leave operators alone unless explicitly summoned.', scores: { links: 3, the_genius: 1 } },
					{ label: 'Workstations that derive universal physical constants in real time while users write code.', scores: { the_genius: 3, merlin: 1 } }
				]
			}
		]
	};

	window.ClippyPersonalityRegistry.tests[testDefinition.id] = testDefinition;
})();
