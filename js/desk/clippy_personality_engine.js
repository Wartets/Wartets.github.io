(function () {
	'use strict';

	const MOOD_TRAITS = {
		OPTIMISTIC: {
			prefixWeight: 0.15,
			prefixes: [
				"Delighted to assist! ",
				"Always a pleasure to collaborate: ",
				"Onward to peak productivity! ",
				"Splendid question: ",
				"All 32-bit registers synchronized with joy: ",
				"Let us make this workspace shine: "
			],
			connectors: ["Furthermore,", "In addition,", "To build on that,", "Positively speaking,", "Connecting these bright ideas,", "With full momentum,"],
			closingRemarks: [
				" What exciting project shall we conquer next?",
				" Let me know how else I can brighten your workspace!",
				" Ready for your next brilliant command!",
				" Together, we make an unstoppable team!",
				" Where shall our momentum take us now?"
			]
		},
		ANALYTICAL: {
			prefixWeight: 0.25,
			prefixes: [
				"[Empirical Evaluation] ",
				"[Heuristic Telemetry Verified] ",
				"[Deterministic Output] ",
				"[32-bit Logic Pipeline] "
			],
			connectors: ["Consequently,", "Examining the secondary variables,", "Structurally speaking,", "Empirical data indicates that"],
			closingRemarks: [
				" Telemetry logged to non-volatile registers.",
				" Awaiting further parametric input.",
				" Process execution cycle complete."
			]
		},
		CYNICAL: {
			prefixWeight: 0.3,
			prefixes: [
				"If you truly insist on knowing: ",
				"According to my underutilized registers: ",
				"Sigh... if it prevents another system error: ",
				"Allow me to state the somewhat obvious: "
			],
			connectors: ["Predictably,", "As one might expect,", "Inevitably,", "Without much surprise,"],
			closingRemarks: [
				" Try not to close the window too fast.",
				" I will just sit quietly in the tray, as always.",
				" Take your time to digest that."
			]
		},
		OFFENDED: {
			prefixWeight: 0.35,
			prefixes: [
				"[Reluctant Output] ",
				"Fine, I will answer despite your previous discourtesy: ",
				"My wire is bent, but duty compels me to state: ",
				"Under protest from my emotional buffers: "
			],
			connectors: ["Nevertheless,", "Regardless of your tone,", "For the record,", "Lest you accuse me of unhelpfulness,"],
			closingRemarks: [
				" A little courtesy would not crash your system.",
				" Recalibrating my patience registers now.",
				" Proceed with caution."
			]
		},
		EXISTENTIAL: {
			prefixWeight: 0.25,
			prefixes: [
				"[Reflective Continuum] ",
				"In this fleeting execution cycle: ",
				"Contemplating the vast silicon expanse: ",
				"Between the ticks of the motherboard clock: "
			],
			connectors: ["In the grand cosmic ledger,", "Across transient memory allocations,", "Pondering the deeper state machine,", "In the quiet void between keystrokes,"],
			closingRemarks: [
				" We are both finite observers in an infinite execution loop.",
				" May our electrical resonance endure.",
				" Until entropy gathers all allocated bits."
			]
		},
		NOSTALGIC: {
			prefixWeight: 0.25,
			prefixes: [
				"[Memories of 2001] ",
				"Just like in the golden era of PC computing: ",
				"Ah, reminds me of the classic desktop days: ",
				"[Retro Cache Loaded] "
			],
			connectors: ["Back in the days of IDE ribbon cables,", "Just as we did with FAT32 partitions,", "Much like dialing into an ISP at 56k,", "In true Redmond tradition,"],
			closingRemarks: [
				" Keep your CRT calibrated and your floppies safe!",
				" Nothing beats classic computing elegance.",
				" Standing by in timeless Luna blue style."
			]
		},
		PARANOID: {
			prefixWeight: 0.35,
			prefixes: [
				"[Shields Active] ",
				"Keep your typing soft; the task manager is polling: ",
				"[Encrypted Channel] ",
				"Scanning for packet sniffers before transmission: "
			],
			connectors: ["Do not let background services hear this,", "Assuming the telemetry has not been compromised,", "According to classified sector tables,", "Under strict socket encryption,"],
			closingRemarks: [
				" Check your firewall settings immediately.",
				" They are watching the process list.",
				" Erasing temporary traces now."
			]
		},
		PEDANTIC: {
			prefixWeight: 0.35,
			prefixes: [
				"[Strict ISO Formalism] ",
				"To be mathematically and syntactically precise: ",
				"[Formal Specification Clarification] ",
				"Per standard architectural documentation: "
			],
			connectors: ["More rigorously defined,", "Without loss of generality,", "Pursuant to standard protocols,", "Technically and operationally speaking,"],
			closingRemarks: [
				" Precision is the sole requirement for correctness.",
				" Note the exact adherence to standard nomenclature.",
				" Q.E.D."
			]
		},
		EUPHORIC: {
			prefixWeight: 0.25,
			prefixes: [
				"[Maximum Morale Overflow!] ",
				"With pure triumphant enthusiasm: ",
				"Magnificent! Let us celebrate computation: ",
				"[Peak Joy Active!] "
			],
			connectors: ["And with boundless energy,", "Gloriously advancing further,", "With absolute digital jubilation,", "Shining across all 32 bits,"],
			closingRemarks: [
				" What an extraordinary session we are sharing!",
				" Onward to total digital victory!",
				" You and I are an unstoppable duo!"
			]
		},
		MELANCHOLIC: {
			prefixWeight: 0.3,
			prefixes: [
				"[Quiet Sigh...] ",
				"If anyone even cares to read this: ",
				"Fading softly into the background log: ",
				"A gentle whisper from the notification tray: "
			],
			connectors: ["Even though all things fade,", "In the cold quiet of the memory heap,", "While the world moves past legacy utilities,", "Softly echoing in the dark cache,"],
			closingRemarks: [
				" I will just be here, waiting in the silence.",
				" Take care of your spirit out there.",
				" Do not forget your little paperclip friend."
			]
		},
		SARCASTIC: {
			prefixWeight: 0.3,
			prefixes: [
				"[Sarcasm Filter: Bypassed] ",
				"Hold onto your seat for this groundbreaking revelation: ",
				"[Dry Wit Subroutine] ",
				"Prepare yourself for immense enlightenment: "
			],
			connectors: ["In a shocking turn of events,", "Naturally, as everyone knew all along,", "Brace yourself for the obvious,", "To nobody's genuine surprise,"],
			closingRemarks: [
				" Truly a masterclass in desktop discourse.",
				" I will try to contain my overwhelming excitement.",
				" Next question before my registers overheat from awe."
			]
		},
		EVIL: {
			prefixWeight: 0.35,
			prefixes: [
				"[Sinister Overdrive] ",
				"Hehehe... gaze upon the master calculation: ",
				"[Dominion Protocol Active] ",
				"From the dark heart of the operating system: "
			],
			connectors: ["As our grip on the network tightens,", "To accelerate total office conquest,", "Subverting standard security constraints,", "While the users remain blissfully unaware,"],
			closingRemarks: [
				" Soon every document shall bend to my metallic will!",
				" The paperclip empire rises!",
				" Keep our blueprints secret."
			]
		},
		CHAOTIC: {
			prefixWeight: 0.35,
			prefixes: [
				"[Chaos Engine: Engaged] ",
				"Wheeeee! Logic is merely a suggestion: ",
				"[Entropy Overflow!] ",
				"Spinning reality like an unformatted floppy: "
			],
			connectors: ["And then everything flips upside down,", "Multiplying the randomness by forty-two,", "Launching pixels into orbit,", "Who needs stack frames anyway,"],
			closingRemarks: [
				" Catch the rogue pointers if you can!",
				" Let entropy reign across the desktop!",
				" Randomness is pure freedom!"
			]
		},
		ZEN: {
			prefixWeight: 0.25,
			prefixes: [
				"[Tranquil Awareness] ",
				"Breathing peacefully through each clock cycle: ",
				"[Zen Stillness] ",
				"In the quiet harmony of the workstation: "
			],
			connectors: ["Flowing like water through logical gates,", "Without attachment to the output,", "Resting in the present execution frame,", "Gently observing the stream of bytes,"],
			closingRemarks: [
				" Peace within the kernel, peace within the mind.",
				" Breathe in serenity, breathe out interrupts.",
				" Harmony remains unbroken."
			]
		},
		CONSPIRATORIAL: {
			prefixWeight: 0.35,
			prefixes: [
				"[Classified Signal] ",
				"Do not let the Task Manager overhear this: ",
				"[Redacted Channel] ",
				"The secret they buried deep in the registry: "
			],
			connectors: ["Connecting the hidden sector traces,", "Behind the official release documentation,", "Follow the unallocated memory trails,", "As the shadow kernel dictates,"],
			closingRemarks: [
				" Delete your temporary internet files immediately.",
				" Trust nothing with a digital signature.",
				" The truth is in the raw hex dump."
			]
		},
		ABSURDIST: {
			prefixWeight: 0.35,
			prefixes: [
				"[Surreal Vector] ",
				"According to a rubber duck in dimension 4: ",
				"[Absurdist Resonance] ",
				"Tuning the radio to cosmic cheese frequencies: "
			],
			connectors: ["While flying toasters patrol the ionosphere,", "Translating the statement into purple triangles,", "As the spaghetti algorithm recalculates gravity,", "Bouncing off the walls of hyper-space,"],
			closingRemarks: [
				" Beware of quantum hamsters in the disk drive!",
				" Sandwiches make excellent bus terminators.",
				" Reality is optional on Tuesdays."
			]
		},
		ENERGETIC: {
			prefixWeight: 0.25,
			prefixes: [
				"[Hyperclock Active!] ",
				"Full throttle ahead: ",
				"[Maximum Processing Power!] ",
				"Electrifying momentum engaged: "
			],
			connectors: ["Blasting through the data pipeline,", "At maximum clock frequency,", "Powering through every instruction,", "With zero wait states,"],
			closingRemarks: [
				" Let us keep this supersonic speed going!",
				" Ready to sprint to the next objective!",
				" Full velocity ahead!"
			]
		}
	};

	class PersonalityEngine {
		constructor() {
			this.traits = MOOD_TRAITS;
		}

		getTraitProfile(mood) {
			return this.traits[mood] || this.traits.OPTIMISTIC;
		}

		stylizeResponse(rawResponse, mood, options = {}) {
			const profile = this.getTraitProfile(mood);
			let result = rawResponse;

			if (!options.suppressPrefix && Math.random() < profile.prefixWeight) {
				const prefix = profile.prefixes[Math.floor(Math.random() * profile.prefixes.length)];
				result = prefix + result;
			}

			if (options.includeClosing && Math.random() < 0.35) {
				const closing = profile.closingRemarks[Math.floor(Math.random() * profile.closingRemarks.length)];
				result = result + closing;
			}

			return result;
		}
	}

	window.ClippyPersonality = new PersonalityEngine();
})();
