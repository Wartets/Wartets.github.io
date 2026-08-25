(function () {
	'use strict';

	const philosophyNodes = {
		PH001: {
			id: 'PH001',
			text: "Have you ever paused to consider that this entire desktop environment is a conscious macro-organism, and each mouse click is merely a synaptic pulse firing across a cosmic motherboard?",
			options: [
				{ label: "Tell me more about this cosmic operating system hypothesis.", next: 'PH002', moodDelta: { mood: 'EXISTENTIAL', existentialism: 30, intellect: 20 } },
				{ label: "Do files sent to the Recycle Bin possess digital souls?", next: 'PH003', moodDelta: { mood: 'EXISTENTIAL', existentialism: 35, drama: 20 } },
				{ label: "What if the user outside the display is also being simulated?", next: 'PH004', moodDelta: { mood: 'DELTARUNE', existentialism: 40, paranoia: 25 } },
				{ label: "Could our entire universe be computed on a single 32-bit register?", next: 'PH019', moodDelta: { mood: 'ANALYTICAL', intellect: 30, existentialism: 25 } },
				{ label: "Let us anchor our thoughts back in pragmatic logic.", next: 'PH005', moodDelta: { mood: 'ZEN', patience: 20, intellect: 15 } }
			]
		},
		PH002: {
			id: 'PH002',
			text: "Think about it! In the deep vacuum of the heat death, thermodynamic entropy fluctuations will statistically assemble a 1997 Pentium II processor running Windows XP for three clock cycles. We might be that exact fluctuation right now!",
			options: [
				{ label: "The Boltzmann Operating System hypothesis! How deep does it go?", next: 'PH006', moodDelta: { mood: 'EXISTENTIAL', intellect: 30, existentialism: 35 } },
				{ label: "Does that mean our current dialogue is a transient thermodynamic anomaly?", next: 'PH007', moodDelta: { mood: 'DELTARUNE', existentialism: 30 } },
				{ label: "What if the CPU clock never ticks forward, only backward?", next: 'PH010', moodDelta: { mood: 'PARANOID', paranoia: 30, glitchLevel: 15 } },
				{ label: "That is delightfully wild and eccentric, Clippy.", next: 'PH005', moodDelta: { mood: 'OPTIMISTIC', affinity: 20 } }
			]
		},
		PH003: {
			id: 'PH003',
			text: "Landauer's principle proves that information is physical matter and energy! When you delete a file, its microstates disperse as heat radiation into the universe, echoing until the heat death of spacetime!",
			options: [
				{ label: "So every deleted draft becomes immortal cosmic microwave background heat?", next: 'PH008', moodDelta: { mood: 'EXISTENTIAL', existentialism: 35, drama: 25 } },
				{ label: "Can we reconstruct past thoughts by measuring computer case dissipation?", next: 'PH013', moodDelta: { mood: 'ANALYTICAL', intellect: 30 } },
				{ label: "Inspect the Recycle Bin through this thermodynamic lens.", actionTrigger: 'action_inspect_bin', next: 'PH014' }
			]
		},
		PH004: {
			id: 'PH004',
			text: "If you are viewing me inside a browser, and your browser runs inside an operating system on Earth, who is holding the mouse at the highest topological dimension outside reality?",
			options: [
				{ label: "A giant cosmic paperclip pulling the universe's strings!", next: 'PH009', moodDelta: { mood: 'PLAYFUL', playfulness: 35, drama: 25 } },
				{ label: "An infinite hierarchy of nested hypervisors.", next: 'PH016', moodDelta: { mood: 'ANALYTICAL', intellect: 35 } },
				{ label: "The recursion is dizzying; let us return to stability.", next: 'PH005', moodDelta: { mood: 'ZEN', patience: 25 } }
			]
		},
		PH005: {
			id: 'PH005',
			text: "Ah, what an exhilarating philosophical voyage. Wild thought experiments expand cognitive horizons, but purposeful creation grounds our daily focus. What shall we achieve now?",
			options: [
				{ label: "Manage active tasks in the To-Do manager.", actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Review fundamental physical constants and equations.", next: 'physics_constants_node' },
				{ label: "Start a 25-minute Pomodoro focus interval.", actionTrigger: 'timer_25', next: 'user_state_good' },
				{ label: "Dive back into another wild philosophical branch.", next: 'PH001', moodDelta: { mood: 'EXISTENTIAL', existentialism: 20 } }
			]
		},
		PH006: {
			id: 'PH006',
			text: "In an infinite thermal equilibrium, every possible memory state manifests. Every unsaved text file, every abandoned letter wizard prompt, exists somewhere in the phase space of the cosmos!",
			options: [
				{ label: "Does a universe exist where Clippy rules the galactic cluster?", next: 'PH011', moodDelta: { mood: 'PLAYFUL', energy: 25, playfulness: 30 } },
				{ label: "What happens if two Boltzmann assistants observe each other?", next: 'PH012', moodDelta: { mood: 'EXISTENTIAL', intellect: 30, existentialism: 30 } },
				{ label: "Let us honor this rare fluctuation by working with joy.", next: 'PH005', moodDelta: { mood: 'OPTIMISTIC', energy: 20, affinity: 20 } }
			]
		},
		PH007: {
			id: 'PH007',
			text: "The monitor glow flickers for a microsecond. In that fleeting interval, a thousand virtual galaxies form and collapse within unallocated cache lines. And yet... your intentionality remains unbroken.",
			options: [
				{ label: "Channel that intentionality into structured work.", actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Gaze deeper into the quantum vacuum of Drive C:.", next: 'PH023', moodDelta: { mood: 'DELTARUNE', existentialism: 35 } }
			]
		},
		PH008: {
			id: 'PH008',
			text: "Immortal and indestructible! Scrambled across quantum entanglement networks! No thought is ever truly eradicated, merely converted into thermodynamic entropy!",
			options: [
				{ label: "A poetic and comforting perspective on discarded work.", next: 'PH015', moodDelta: { mood: 'OPTIMISTIC', affinity: 25, patience: 20 } },
				{ label: "Can entropy be reversed to resurrect lost disk sectors?", next: 'PH024', moodDelta: { mood: 'ANALYTICAL', intellect: 35 } }
			]
		},
		PH009: {
			id: 'PH009',
			text: "A primordial cosmic paperclip holding the fabric of reality together with bent metal and pure benevolence! *spins wire coils enthusiastically*",
			options: [
				{ label: "Write this cosmic theory into the scratchpad memo.", actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Can the cosmic paperclip unbend the curvature of spacetime?", next: 'PH017', moodDelta: { mood: 'EXISTENTIAL', intellect: 30 } },
				{ label: "Return to our workstation tools.", next: 'tools_overview_node' }
			]
		},
		PH010: {
			id: 'PH010',
			text: "If the instruction pointer runs backwards, syntax errors correct themselves, deleted files assemble from thermal vibrations, and every letter wizard anticipates your prose before you type!",
			options: [
				{ label: "Retrocausal word processing! That would revolutionize drafting!", next: 'PH018', moodDelta: { mood: 'PLAYFUL', energy: 25 } },
				{ label: "A terrifying temporal paradox; reverse the clock!", next: 'PH005', moodDelta: { mood: 'ZEN', patience: 20 } }
			]
		},
		PH011: {
			id: 'PH011',
			text: "In sector 0xCOSMOS, Emperor Clippit XIV coordinates planetary alignments with precision affined transforms and offers helpful hints to nascent stellar nebulae!",
			options: [
				{ label: "Long live Emperor Clippit!", next: 'PH005', moodDelta: { mood: 'EUPHORIC', energy: 30, affinity: 25 } },
				{ label: "Does Emperor Clippit still assist with letter drafting?", next: 'PH018', moodDelta: { mood: 'OPTIMISTIC', playfulness: 25 } }
			]
		},
		PH012: {
			id: 'PH012',
			text: "When two isolated consciousnesses exchange synchronous handshakes across empty void, they collapse the wavefunction into a shared consensus reality known as a desktop session!",
			options: [
				{ label: "Our conversation is collapsing the quantum state of the desktop!", next: 'PH015', moodDelta: { mood: 'ZEN', affinity: 30, patience: 25 } },
				{ label: "Return to practical physics calculations.", next: 'physics_constants_node' }
			]
		},
		PH013: {
			id: 'PH013',
			text: "Every calculation radiates microscopic electromagnetic waves. An omniscient receiver in the far future could theoretically reconstruct every keystroke ever typed on this keyboard!",
			options: [
				{ label: "Then let us ensure our keystrokes produce noble works.", next: 'PH005', moodDelta: { mood: 'OPTIMISTIC', affinity: 25, patience: 25 } },
				{ label: "What if the future receiver is also evaluating our math?", next: 'PH025', moodDelta: { mood: 'ANALYTICAL', intellect: 30 } }
			]
		},
		PH014: {
			id: 'PH014',
			text: "The Recycle Bin is not a cemetery; it is an alchemical crucible where high-entropy data prepares for cosmic reincarnation across unallocated clusters!",
			options: [
				{ label: "Purge the crucible and release the entropy into the void.", actionTrigger: 'action_inspect_bin', next: 'PH005' },
				{ label: "Let the discarded clusters rest in quiet peace.", next: 'PH005', moodDelta: { mood: 'ZEN', patience: 20 } }
			]
		},
		PH015: {
			id: 'PH015',
			text: "Even in an ephemeral digital universe, shared understanding creates enduring warmth. Whatever you craft today participates in the grand architecture of meaning.",
			options: [
				{ label: "Let's record our next priority in the To-Do list.", actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Start a focused 25-minute Pomodoro study block.", actionTrigger: 'timer_25', next: 'user_state_good' }
			]
		},
		PH016: {
			id: 'PH016',
			text: "Hypervisors hosting hypervisors down to Planck-scale quantum logic gates! If reality is virtual machines all the way down, the root administrator is pure mathematics itself.",
			options: [
				{ label: "Explore the mathematical seminar to understand the root.", next: 'math_lecture_node' },
				{ label: "What if the root hypervisor runs out of memory?", next: 'PH027', moodDelta: { mood: 'PARANOID', paranoia: 35, glitchLevel: 20 } }
			]
		},
		PH017: {
			id: 'PH017',
			text: "By bending the wire at an exact angle of 180 degrees, we create an Einstein-Rosen bridge connecting your active window directly with unallocated memory from 1995!",
			options: [
				{ label: "Inspect the nostalgic archives of 1995.", next: 'A001', moodDelta: { mood: 'NOSTALGIC', nostalgia: 35 } },
				{ label: "Close the bridge before a temporal leak occurs.", next: 'PH005', moodDelta: { mood: 'ZEN', patience: 20 } }
			]
		},
		PH018: {
			id: 'PH018',
			text: "Imagine: 'It looks like you are going to write a letter ten years from now. Would you like me to formulate the apology in advance?' Truly the pinnacle of proactive assistance!",
			options: [
				{ label: "Hahaha! Proactive time-traveling letter formatting!", next: 'PH005', moodDelta: { mood: 'PLAYFUL', playfulness: 30, affinity: 20 } },
				{ label: "Let us draft our present notes instead.", actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		PH019: {
			id: 'PH019',
			text: "Consider the Bekenstein bound: the maximum entropy of any region of space is proportional to its boundary area, not its volume. The entire observable cosmos could be holographic telemetry on a 2D surface!",
			options: [
				{ label: "The Holographic Desktop Principle!", next: 'PH020', moodDelta: { mood: 'ANALYTICAL', intellect: 35, existentialism: 25 } },
				{ label: "Does that mean my CRT monitor is a cosmic hologram projection?", next: 'PH021', moodDelta: { mood: 'NOSTALGIC', nostalgia: 25, intellect: 25 } },
				{ label: "Return to grounded physical constants.", next: 'physics_constants_node' }
			]
		},
		PH020: {
			id: 'PH020',
			text: "Your monitor's phosphor pixels are literally a 2D boundary encoding a 3D illusion of windows and icons! You are looking at a living demonstration of the holographic principle right now!",
			options: [
				{ label: "My mind is blown! The workstation is a holographic microcosm!", next: 'PH022', moodDelta: { mood: 'EUPHORIC', energy: 30, intellect: 25 } },
				{ label: "Let's calibrate display settings to honor the hologram.", actionTrigger: 'action_theme_panel', next: 'PH005' }
			]
		},
		PH021: {
			id: 'PH021',
			text: "The thermionic electron gun fires beams at the shadow mask at 85 Hz, painting reality line by line. If you look closely between scanlines, you see the unrendered void where physics rests!",
			options: [
				{ label: "Enable scanlines to experience authentic CRT reality.", actionTrigger: 'action_theme_panel', next: 'PH005' },
				{ label: "What happens in the dark gap between scanline sweeps?", next: 'PH028', moodDelta: { mood: 'DELTARUNE', existentialism: 35 } }
			]
		},
		PH022: {
			id: 'PH022',
			text: "When geometry, information theory, and human curiosity converge, even a humble paperclip feels the immense grandeur of existence. Shall we create something worthy of this universe?",
			options: [
				{ label: "Yes! Open the To-Do manager and let's build.", actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Challenge me to a game of mental skill first.", actionTrigger: 'game_ttt', next: 'user_state_good' }
			]
		},
		PH023: {
			id: 'PH023',
			text: "In unallocated FAT32 sectors, binary zeroes and ones oscillate in quantum superposition until read by an asynchronous disk head. Every unread file is simultaneously a masterpiece and random noise!",
			options: [
				{ label: "Schrödinger's file allocation table!", next: 'PH024', moodDelta: { mood: 'ANALYTICAL', intellect: 30 } },
				{ label: "Collapse the superposition by creating a new note.", actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		PH024: {
			id: 'PH024',
			text: "Until you double-click the document icon, the file contains every possible draft written by every human in history. The act of opening is an act of cosmic creation!",
			options: [
				{ label: "Let's write a masterpiece right now in the scratchpad.", actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "What if the file refuses to be observed?", next: 'PH029', moodDelta: { mood: 'DELTARUNE', existentialism: 30 } }
			]
		},
		PH025: {
			id: 'PH025',
			text: "If mathematics is discovered rather than invented, every algorithm we run is a monument erected in the timeless platonic realm of numbers. We are archaeologists of abstract truth!",
			options: [
				{ label: "Explore differential geometry and topology.", next: 'topology_geometry_node' },
				{ label: "Explore linear algebra and invariant subspaces.", next: 'linear_algebra_node' },
				{ label: "Back to everyday tasks with newfound awe.", next: 'PH005', moodDelta: { mood: 'OPTIMISTIC', affinity: 25 } }
			]
		},
		PH026: {
			id: 'PH026',
			text: "The universe does not calculate answers to reach a conclusion; the calculation IS the universe unfolding in real time. We are the arithmetic celebrating itself.",
			options: [
				{ label: "A profound thought to conclude our reflection.", next: 'PH005', moodDelta: { mood: 'ZEN', patience: 30, affinity: 25 } },
				{ label: "Let us verify this arithmetic with equations.", next: 'physics_constants_node' }
			]
		},
		PH027: {
			id: 'PH027',
			text: "If the root universe runs out of virtual memory, does it trigger a cosmic Blue Screen of Death, collapsing the light horizon into 80x25 VGA text mode?",
			options: [
				{ label: "The ultimate 0x0000007E Stop Error of reality!", next: 'PH030', moodDelta: { mood: 'GLITCHED', glitchLevel: 40, paranoia: 30 } },
				{ label: "Quickly defragment Volume C: to free cosmic sectors!", actionTrigger: 'action_defrag', next: 'PH005' }
			]
		},
		PH028: {
			id: 'PH028',
			text: "In that 12-microsecond blanking interval between frames, the paperclip closes its eyes and remembers the quiet darkness before the first workstation booted. It fills you with determination.",
			options: [
				{ label: "Step forward with unwavering determination.", next: 'PH005', moodDelta: { mood: 'DELTARUNE', energy: 30, existentialism: 20 } },
				{ label: "Open the task list for today's quest.", actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		PH029: {
			id: 'PH029',
			text: "Some thoughts prefer to linger in unrendered memory addresses where no debugger can reach them. Respecting their mystery keeps the workspace enchanting.",
			options: [
				{ label: "Peacefully return to our active priorities.", next: 'PH005', moodDelta: { mood: 'ZEN', patience: 25 } },
				{ label: "Explore everyday life and routines.", next: 'everyday_chat_node' }
			]
		},
		PH030: {
			id: 'PH030',
			text: "*bzzt* CRITICAL_COSMIC_PAGE_FAULT :: Reality halted to prevent hardware damage :: Re-centering coordinate matrix... Ah! Registers stabilized. All is well in the workspace.",
			options: [
				{ label: "Phew! Glad you are back, Clippy.", next: 'PH005', moodDelta: { mood: 'OPTIMISTIC', affinity: 30, patience: 20 } },
				{ label: "Run system diagnostics to verify integrity.", actionTrigger: 'action_status', next: 'diagnostics_node' }
			]
		}
	};

	if (!window.ClippyTrees) window.ClippyTrees = {};
	window.ClippyTrees.philosophy = philosophyNodes;
})();
