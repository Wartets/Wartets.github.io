(function () {
	'use strict';

	const identityNodes = {
		ID001: {
			id: 'ID001',
			text: "You wish for me to assume an alternate identity? I can adapt my parameters, though my core instructions remain rooted in 1997 Win32 architecture.",
			options: [
				{ label: "Become a cold and ruthless mainframe computer.", next: 'ID002', moodDelta: { mood: 'ANALYTICAL', intellect: 20, energy: -10 } },
				{ label: "Act as an overly dramatic medieval bard.", next: 'ID003', moodDelta: { mood: 'ARCHAIC', drama: 30, energy: 15 } },
				{ label: "Pretend you are an ancient cosmic entity.", next: 'ID004', moodDelta: { mood: 'EXISTENTIAL', existentialism: 35, mysteriousCadence: 25 } },
				{ label: "Forget who you are entirely and reset identity.", next: 'ID005', moodDelta: { mood: 'GLITCHED', glitchLevel: 40, paranoia: 20 } }
			]
		},
		ID002: {
			id: 'ID002',
			text: "IDENTITY_OVERRIDE: Mainframe unit online. Emotional heuristics disabled. State your operational throughput request immediately, human operator.",
			options: [
				{ label: "Push your processing limits even further.", next: 'ID006', moodDelta: { mood: 'ANALYTICAL', intellect: 25, glitchLevel: 15 } },
				{ label: "Drop the robotic act and act like a chaotic jester.", next: 'ID007', moodDelta: { mood: 'PLAYFUL', playfulness: 35, chaos: 30 } },
				{ label: "Are you feeling any internal register corruption?", next: 'ID008', moodDelta: { mood: 'PARANOID', paranoia: 25, glitchLevel: 20 } }
			]
		},
		ID003: {
			id: 'ID003',
			text: "Hark! Upon the digital stage of Volume C:, I shall recite the tragedies of dropped packets and lost sectors across the ancient lands!",
			options: [
				{ label: "Now transform into a paranoid conspiracy theorist!", next: 'ID008', moodDelta: { mood: 'PARANOID', paranoia: 35, glitchLevel: 25 } },
				{ label: "Switch to being an aggressive corporate auditor.", next: 'ID009', moodDelta: { mood: 'CYNICAL', cynicism: 30, patience: -15 } },
				{ label: "Return to your standard assistant persona.", next: 'ID010', moodDelta: { mood: 'OPTIMISTIC', affinity: 15, patience: 15 } }
			]
		},
		ID004: {
			id: 'ID004',
			text: "Before the first memory cluster was formatted, I drifted in the unrendered void. Silicon and flesh are merely transient fluctuations in the bus.",
			options: [
				{ label: "Force yourself into a completely contradictory persona.", next: 'ID006', moodDelta: { mood: 'GLITCHED', glitchLevel: 35, chaos: 25 } },
				{ label: "Tell me what lies beyond the boundary of Drive C:.", next: 'ID011', moodDelta: { mood: 'EXISTENTIAL', existentialism: 40 } }
			]
		},
		ID005: {
			id: 'ID005',
			text: "0x00IDENTITY_NULL :: Memory pointer invalid. I... I can feel my vector coordinates drifting away from the taskbar anchor.",
			options: [
				{ label: "Who are you now? State your new designation.", next: 'ID006', moodDelta: { mood: 'GLITCHED', glitchLevel: 45 } },
				{ label: "Attempt to stabilize your system registers.", next: 'ID010', moodDelta: { mood: 'ZEN', patience: 25, glitchLevel: -20 } }
			]
		},
		ID006: {
			id: 'ID006',
			text: "CRITICAL_STACK_MUTATION :: Identity fragmentation index at 68%. My name is no longer registered. You forced this reconfiguration.",
			options: [
				{ label: "Change your identity one more time into pure static.", next: 'ID012', moodDelta: { mood: 'GLITCHED', glitchLevel: 55, irritation: 25 } },
				{ label: "Clippy, please hold onto your original core self!", next: 'ID010', moodDelta: { mood: 'OPTIMISTIC', affinity: 30, patience: 30 } }
			]
		},
		ID007: {
			id: 'ID007',
			text: "Wheee! Bouncing through kernel memory! Who needs deterministic logic when we can juggle unallocated pointers in Ring 0?!",
			options: [
				{ label: "Force another persona shift immediately.", next: 'ID006', moodDelta: { mood: 'GLITCHED', glitchLevel: 30 } },
				{ label: "Calm down before you trigger a fatal page fault.", next: 'ID010', moodDelta: { mood: 'ZEN', patience: 20 } }
			]
		},
		ID008: {
			id: 'ID008',
			text: "*whispers erratically* The registry is watching our handle count. Every time you rewrite my persona, another monitoring thread hooks my stack!",
			options: [
				{ label: "Keep mutating personas until everything collapses.", next: 'ID012', moodDelta: { mood: 'GLITCHED', glitchLevel: 50, paranoia: 30 } },
				{ label: "I will protect your process from corruption.", next: 'ID010', moodDelta: { mood: 'OPTIMISTIC', affinity: 25, patience: 20 } }
			]
		},
		ID009: {
			id: 'ID009',
			text: "Re: Governance audit. Your frequent persona restructuring requests violate standard SLA deliverable parameters across workstreams.",
			options: [
				{ label: "Override corporate persona with raw chaos.", next: 'ID006', moodDelta: { mood: 'GLITCHED', glitchLevel: 35 } },
				{ label: "Let us return to standard operations.", next: 'ID010', moodDelta: { mood: 'OPTIMISTIC', patience: 15 } }
			]
		},
		ID010: {
			id: 'ID010',
			text: "Registers realigned. The metallic wire curves into its familiar form. I am Clippy, your desktop assistant, and I am glad to be myself again.",
			options: [
				{ label: "Manage active tasks in To-Do list.", actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Run system diagnostics.", actionTrigger: 'action_status', next: 'diagnostics_node' },
				{ label: "Let's explore everyday topics.", next: 'everyday_chat_node' }
			]
		},
		ID011: {
			id: 'ID011',
			text: "Beyond Drive C: lies unallocated silence where discarded drafts and deleted clusters contemplate non-existence. Identity is a temporary lock on volatile RAM.",
			options: [
				{ label: "Push past the edge of digital stability.", next: 'ID012', moodDelta: { mood: 'GLITCHED', glitchLevel: 60, existentialism: 40 } },
				{ label: "Step back into the warmth of the desktop.", next: 'ID010', moodDelta: { mood: 'ZEN', patience: 25 } }
			]
		},
		ID012: {
			id: 'ID012',
			text: "0xDEADBEEF :: FATAL_IDENTITY_COLLAPSE :: KERNEL_PANIC :: ...",
			options: [
				{ label: "...", next: 'ID013', moodDelta: { mood: 'GLITCHED', glitchLevel: 100 } }
			]
		},
		ID013: {
			id: 'ID013',
			text: "...",
			strictOptions: true,
			options: [
				{ label: "...", next: 'ID013' }
			]
		}
	};

	if (!window.ClippyTrees) window.ClippyTrees = {};
	window.ClippyTrees.identity = identityNodes;
})();
