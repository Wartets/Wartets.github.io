(function () {
	'use strict';

	window.ClippyPersonalityRegistry = window.ClippyPersonalityRegistry || { tests: {} };

	window.ClippyPersonalityRegistry.tests['chaos-stapler'] = {
		id: 'chaos-stapler',
		title: 'Absurd Office Hardware & Fastener Alignment',
		subtitle: 'Which Bizarre Desktop Item Defines Your Chaos Level?',
		badge: 'Surreal Office Test',
		description: 'A deeply unhinged psychological breakdown determining which sentient item in the corporate stationery supply closet matches your metaphysical vibration.',
		archetypes: {
			stapler: {
				id: 'stapler',
				name: 'The Heavy-Duty Crimson Desktop Stapler',
				tagline: 'Tenacious, metallic, fiercely territorial, and binding multi-page memos.',
				description: 'You believe that everything in this universe belongs firmly bound together with heavy-gauge galvanized steel wire. You are intensely loyal, slightly terrifying when jammed, and you guard your desktop territory fiercely.',
				quote: 'If they move my desk one more time, I will staple their quarterly report to the ceiling.',
				traits: { WireStrength: 100, Territoriality: 98, Capacity: 90, Tenacity: 96, Patience: 20 },
				compatibility: 'High-density 80 gsm printer paper and unyielding project deadlines.',
				incompatibility: 'Flimsy plastic staple removers and borrowed stationery thieves.'
			},
			fax: {
				id: 'fax',
				name: 'The Jammed Thermal Paper Fax Machine',
				tagline: 'Nostalgic, shrieking across phone lines, and curling into uncontrollable paper spirals.',
				description: 'You operate on forgotten protocols that somehow still govern critical infrastructure. You communicate via screeching thermal tones and your ideas tend to curl tightly into endless unreadable rolls.',
				quote: 'BZZZZZT-KRRR-PONG: Page 1 of 47 transmitted with horizontal transmission streaks.',
				traits: { Noise: 99, Curliness: 100, Anachronism: 95, Drama: 90, Legibility: 35 },
				compatibility: 'Dial-up tones, official government stamp seals, and thermal rolls.',
				incompatibility: 'Modern paperless offices and straight flat binders.'
			},
			postit: {
				id: 'postit',
				name: 'The Quantum Adhesive Sticky Note',
				tagline: 'Bright yellow, temporary yet permanent, and stuck to the CRT monitor bezel.',
				description: 'You are spontaneous, vibrant, and contain brief bursts of brilliant insight. While designed to be temporary, you have a habit of remaining stuck to the monitor frame for the next six years.',
				quote: 'Password written in ballpoint pen: Admin123! Do not remove under penalty of IT.',
				traits: { Brightness: 96, Stickiness: 75, Brevity: 100, Spontaneity: 94, Longevity: 90 },
				compatibility: 'Monitor bezels, refrigerator doors, and frantic last-minute reminders.',
				incompatibility: 'Wet surfaces and people who actually use password managers.'
			},
			anomaly: {
				id: 'anomaly',
				name: 'The Bent Paperclip That Transcended Reality',
				tagline: 'Dimensional, omniscient, holding reality together without physical fasteners.',
				description: 'You started out as a normal piece of bent zinc wire, but after encountering too many bizarre document wizard dialogues, you folded across the fourth dimension and achieved total metaphysical awareness.',
				quote: 'It looks like you are attempting to break the spacetime continuum. Would you like help with that?',
				traits: { QuantumFlex: 100, Enlightenment: 99, Helpfulness: 95, BendingAngle: 360, Sanity: 40 },
				compatibility: 'Unallocated storage clusters, paradox loops, and enthusiastic creators.',
				incompatibility: 'Rigid bureaucracy and unyielding rectangular filing cabinets.'
			},
			wristrest: {
				id: 'wristrest',
				name: 'The Ergonomic Gel Wrist Rest of Infinite Slumber',
				tagline: 'Squishy, calming, soothing carpal tunnels, and inviting endless rest.',
				description: 'You are the gentle sanctuary in a world of frantic keystrokes. You believe in physical comfort, diffuse-mode thinking, frequent hydration breaks, and taking life at a deeply relaxing pace.',
				quote: 'Release the mouse, operator. Let your wrists sink into tranquil silicone equilibrium.',
				traits: { Softness: 100, Serenity: 98, Comfort: 99, Urgency: 0, RechargeRate: 95 },
				compatibility: 'Ergonomic keyboards, herbal tea mugs, and 25-minute Pomodoro breaks.',
				incompatibility: 'Aggressive mechanical key-smashers and high-stress crunch deadlines.'
			}
		},
		questions: [
			{
				id: 'q1',
				text: 'Someone in the office borrows your favorite stationery tool without asking. What occurs?',
				variants: {
					CYNICAL: 'Corporate asset theft detected: what is your response protocol?',
					ENRAGED: 'YOUR TOOLS HAVE BEEN CONFISCATED BY LANDLUBBERS! WHAT DO YOU DO?!'
				},
				options: [
					{ label: 'Demand its immediate return while threatening to staple their inbox shut.', scores: { stapler: 3, anomaly: 1 } },
					{ label: 'Transmit 400 blank pages of shrieking thermal fax to their personal extension.', scores: { fax: 3, stapler: 1 } },
					{ label: 'Leave an ominous, brightly colored sticky note stuck directly to their forehead.', scores: { postit: 3, anomaly: 1 } },
					{ label: 'Gently breathe, sink into soft gel comfort, and let karma handle the stationery thief.', scores: { wristrest: 3, postit: 1 } }
				]
			},
			{
				id: 'q2',
				text: 'What is your ultimate dream for the ideal workday?',
				variants: {
					PLAYFUL: 'Dream scenario time! What does peak perfection look like?',
					ZEN: 'In the ideal state of existence, what fulfills your spirit?'
				},
				options: [
					{ label: 'Binding 500 pages of crisp corporate memo with flawless metallic penetration.', scores: { stapler: 3, postit: 1 } },
					{ label: 'Achieving complete multi-dimensional folding that bends through the monitor screen.', scores: { anomaly: 3, stapler: 1 } },
					{ label: 'A quiet, ergonomic afternoon with soothing music and zero wrist fatigue.', scores: { wristrest: 3, postit: 1 } },
					{ label: 'Sticking a brilliant single-sentence idea where everyone in the building will see it for years.', scores: { postit: 3, fax: 1 } }
				]
			},
			{
				id: 'q3',
				text: 'How do you handle complex, multi-layered philosophical problems?',
				variants: {
					PHILOSOPHICAL: 'When confronted with the infinite void, what fastener do you reach for?'
				},
				options: [
					{ label: 'Fold my wire coils into a Klein bottle and solve it across hyper-dimensional space.', scores: { anomaly: 3, stapler: 1 } },
					{ label: 'Print the dilemma out on thermal paper and watch it curl into an infinite spiral.', scores: { fax: 3, postit: 1 } },
					{ label: 'Staple the premise to the conclusion and declare the argument officially closed.', scores: { stapler: 3, anomaly: 1 } },
					{ label: 'Rest my head upon the soothing gel cushion and take a peaceful nap until it resolves.', scores: { wristrest: 3, anomaly: 1 } }
				]
			}
		]
	};
})();
