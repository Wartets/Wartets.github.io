(function () {
	'use strict';

	window.ClippyPersonalityRegistry = window.ClippyPersonalityRegistry || { tests: {} };

	window.ClippyPersonalityRegistry.tests['retro-archetype'] = {
		id: 'retro-archetype',
		title: '1990s Hardware Archetype Test',
		subtitle: 'Which Classic Desktop Component Embodies Your Soul?',
		badge: 'Retro Hardware Matrix',
		description: 'A diagnostic psychological evaluation mapping your cognitive traits to vintage personal computer hardware architectures from the beige computing era.',
		archetypes: {
			crt: {
				id: 'crt',
				name: 'The 17-inch Trinitron CRT Monitor',
				tagline: 'Warm, luminous, heavy, and operating at a consistent 85 Hz refresh rate.',
				description: 'You possess immense presence, warmth, and uncompressed depth of character. While you may be difficult to move once settled in place, your fidelity and phosphor glow make you utterly indispensable.',
				quote: 'No input latency, pure magnetic deflection, and a degaussing sound that clears the room.',
				traits: { Luster: 88, Persistence: 94, Weight: 98, Radiance: 92, Volatility: 35 },
				compatibility: 'High-end Sound Blaster 16 soundcards and dual-speed CD-ROM drives.',
				incompatibility: 'Flimsy folding tables and unshielded audio speakers.'
			},
			modem: {
				id: 'modem',
				name: 'The 56k V.90 Dial-Up Modem',
				tagline: 'Loud, persistent, highly communicative, and impossible to ignore.',
				description: 'You insist on clear handshakes and transparent protocols. When you speak, everyone hears your distinct frequencies, and your determination can overcome even the noisiest analog transmission lines.',
				quote: 'Baud rates may vary, but carrier synchronization is a sacred covenant.',
				traits: { Luster: 65, Persistence: 99, Audibility: 100, Bandwidth: 25, Charisma: 82 },
				compatibility: 'Direct twisted-pair copper wiring and patient conversationalists.',
				incompatibility: 'Family members lifting the landline phone mid-download.'
			},
			floppy: {
				id: 'floppy',
				name: 'The 3.5-inch 1.44 MB Floppy Diskette',
				tagline: 'Compact, protective, metallic-shuttered, and strictly bounded.',
				description: 'You believe in concise essentials and reliable physical write-protect tabs. You do not waste bandwidth on unnecessary fluff; every single byte you carry is chosen with deliberate intention.',
				quote: '1,474,560 bytes of structured magnetic truth behind a sliding metal spring.',
				traits: { Luster: 72, Persistence: 78, Portability: 96, Density: 30, Reliability: 80 },
				compatibility: 'Bootable DOS emergency rescue disks and student presentations.',
				incompatibility: 'Refrigerators with strong door magnets and humid environments.'
			},
			mouse: {
				id: 'mouse',
				name: 'The PS/2 Mechanical Ball Mouse',
				tagline: 'Grounded, tactile, responsive to directional friction, and fond of regular cleaning.',
				description: 'You believe in physical contact, mechanical feedback, and steady calibration. You navigate obstacles methodically and perform best when your internal rubberized sphere is kept free of dust.',
				quote: 'Two optical encoder wheels and an inverted sphere rule the graphical viewport.',
				traits: { Luster: 55, Persistence: 86, Tactility: 98, Precision: 75, Maintenance: 90 },
				compatibility: 'Smooth neoprene mousepads with stitched edges.',
				incompatibility: 'Felt table surfaces covered in cat hair and lint.'
			},
			soundblaster: {
				id: 'soundblaster',
				name: 'The Sound Blaster 16 DSP Audio Card',
				tagline: 'Harmonic, polyphonic, FM-synthesizing, and master of IRQ 5.',
				description: 'You bring melody, vibrancy, and rich sensory depth to every environment. You easily translate technical abstractions into expressive symphonies of four-operator FM synth.',
				quote: 'SET BLASTER=A220 I5 D1 H5 P330 T6 is not just a config line, it is a lifestyle.',
				traits: { Luster: 95, Persistence: 80, Harmony: 100, Complexity: 85, Expressiveness: 96 },
				compatibility: 'MIDI synthesizers and vintage wavetable daughterboards.',
				incompatibility: 'Silent motherboard piezo buzzers and IRQ conflict storms.'
			},
			pentium: {
				id: 'pentium',
				name: 'The 200 MHz Pentium MMX Processor',
				tagline: 'Fast, calculated, highly pipelined, and running hot under full load.',
				description: 'You are focused entirely on high-throughput execution, parallel scalar pipelines, and immediate problem-solving. When challenges emerge, you branch-predict your way through before others notice.',
				quote: 'Dual integer execution pipelines and 57 dedicated SIMD vector opcodes.',
				traits: { Luster: 90, Persistence: 92, Velocity: 98, Thermals: 85, Decisiveness: 95 },
				compatibility: 'Aluminum heatsinks with screaming 40mm cooling fans.',
				incompatibility: 'Passive cooling radiators and memory bus bottlenecks.'
			}
		},
		questions: [
			{
				id: 'q1',
				text: 'When an unexpected crisis or error dialog interrupts your workflow, what is your primary instinct?',
				variants: {
					ANALYTICAL: 'Diagnostic evaluation: When a runtime interrupt or page fault occurs, what is your default interrupt handling routine?',
					ZEN: 'In the calm stillness of a sudden disturbance, how does your internal state respond?',
					CYNICAL: 'When the inevitable crash arrives, what standard coping mechanism do you deploy?'
				},
				options: [
					{ label: 'Emit an unmistakable high-frequency alert so everyone understands the exact situation.', scores: { modem: 3, soundblaster: 1 } },
					{ label: 'Maintain absolute visual presence, absorb the shock, and radiate calm persistence.', scores: { crt: 3, floppy: 1 } },
					{ label: 'Engage dual-pipeline speculative execution to calculate a resolution in microseconds.', scores: { pentium: 3, soundblaster: 1 } },
					{ label: 'Physically inspect the internal mechanisms, clean the rollers, and re-calibrate from zero.', scores: { mouse: 3, floppy: 2 } }
				]
			},
			{
				id: 'q2',
				text: 'How do you prefer to communicate important thoughts to those around you?',
				variants: {
					OPTIMISTIC: 'Expressive transmission check! How do you love sharing your ideas with teammates?',
					PIRATE: 'How do ye hail other vessels across the wide digital seas, matey?',
					ARCHAIC: 'By what manner of epistle or proclamation dost thou convey thy sovereign thoughts?'
				},
				options: [
					{ label: 'Through rich acoustic frequencies, melodic harmonies, and structured polyphony.', scores: { soundblaster: 3, modem: 1 } },
					{ label: 'Through an intense analog negotiation handshake that cannot be interrupted.', scores: { modem: 3, crt: 1 } },
					{ label: 'By handing over a strictly formatted, write-protected 1.44 MB physical record.', scores: { floppy: 3, pentium: 1 } },
					{ label: 'Through precise, tactile coordinates and direct point-and-click physical gestures.', scores: { mouse: 3, crt: 1 } }
				]
			},
			{
				id: 'q3',
				text: 'What is your ideal workspace environment for peak productivity?',
				variants: {
					ANALYTICAL: 'Telemetry bounds: Specify your preferred thermodynamic and spatial workstation conditions.',
					ZEN: 'In what sanctuary does your cognitive energy find effortless harmony?'
				},
				options: [
					{ label: 'A solid oak desk capable of supporting 25 kilograms of pure cathode glass.', scores: { crt: 3, mouse: 1 } },
					{ label: 'A dedicated copper landline socket with zero background line static.', scores: { modem: 3, soundblaster: 1 } },
					{ label: 'A high-airflow case with active heat dissipation and optimal bus voltages.', scores: { pentium: 3, soundblaster: 1 } },
					{ label: 'A neat plastic organizer caddy with labeled 3.5-inch color-coded sleeves.', scores: { floppy: 3, mouse: 1 } }
				]
			},
			{
				id: 'q4',
				text: 'When interacting with people who move slowly or lack precision, how do you feel?',
				variants: {
					CYNICAL: 'Dealing with resource-constrained operators: what is your internal assessment?',
					PLAYFUL: 'When someone drops the ball in a game, what is your reaction?'
				},
				options: [
					{ label: 'I pipeline their queue for them and execute instructions in parallel.', scores: { pentium: 3, crt: 1 } },
					{ label: 'I offer acoustic guidance and synthesize cheerful feedback loops.', scores: { soundblaster: 3, floppy: 1 } },
					{ label: 'I require a brief cleaning pause to remove lint from my internal rollers.', scores: { mouse: 3, crt: 1 } },
					{ label: 'I re-dial the carrier signal until parity checks pass with zero dropped packets.', scores: { modem: 3, pentium: 1 } }
				]
			},
			{
				id: 'q5',
				text: 'What is your core personal philosophy regarding memory and knowledge retention?',
				variants: {
					PHILOSOPHICAL: 'Epistemological query: What constitutes permanent truth in physical reality?',
					DELTARUNE: '(How do you preserve the light against the creeping dark?)'
				},
				options: [
					{ label: 'Truth is what you can fit in exactly 1,440 kilobytes and slide behind a metal latch.', scores: { floppy: 3, mouse: 1 } },
					{ label: 'Memory is an ongoing electromagnetic glow that leaves phosphor traces in the dark.', scores: { crt: 3, soundblaster: 1 } },
					{ label: 'Knowledge is dynamic clock speed and immediate arithmetic execution.', scores: { pentium: 3, modem: 1 } },
					{ label: 'Memory is a continuous acoustic song passed across transmission channels.', scores: { soundblaster: 3, modem: 2 } }
				]
			}
		]
	};
})();
