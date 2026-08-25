(function () {
	'use strict';

	window.ClippyPersonalityRegistry = window.ClippyPersonalityRegistry || { tests: {} };

	window.ClippyPersonalityRegistry.tests['system-kernel'] = {
		id: 'system-kernel',
		title: 'Windows Subsystem Personality Matrix',
		subtitle: 'Which Core OS Kernel Service Dictates Your Behavior?',
		badge: 'NT Kernel Archetype',
		description: 'An architectural breakdown evaluating your operational style against the critical components of the 32-bit Windows NT executive layer.',
		archetypes: {
			hal: {
				id: 'hal',
				name: 'Hardware Abstraction Layer (HAL.DLL)',
				tagline: 'The unflappable mediator between raw chaotic silicon and higher-level logic.',
				description: 'You are the ultimate diplomat and structural stabilizer. No matter how wild, inconsistent, or chaotic the underlying hardware becomes, you present a clean, standardized interface that keeps the entire ecosystem running.',
				quote: 'Hiding physical processor peculiarities since Windows NT 3.1.',
				traits: { Stability: 100, Adaptability: 95, Discretion: 90, Rigor: 92, Drama: 5 },
				compatibility: 'Kernel Executive, device drivers, and multi-threaded schedulers.',
				incompatibility: 'Direct unbuffered I/O bus violations and erratic raw voltage spikes.'
			},
			bsod: {
				id: 'bsod',
				name: 'The Blue Screen Stop Error Handler',
				tagline: 'Absolute, uncompromising, truth-telling, and demanding immediate attention.',
				description: 'You do not believe in sweeping critical errors under the rug. When something is fundamentally wrong, you halt the bus, freeze execution, and display the unvarnished raw hexadecimal truth for everyone to inspect.',
				quote: '0x0000007E: SYSTEM_THREAD_EXCEPTION_NOT_HANDLED. Deal with it now.',
				traits: { Directness: 100, Compromise: 0, Authority: 98, Clarity: 95, Patience: 10 },
				compatibility: 'Post-mortem memory dump analyzers and thorough debugger technicians.',
				incompatibility: 'Wishful thinkers and silent catch-all exception swallowers.'
			},
			scheduler: {
				id: 'scheduler',
				name: 'The Priority Thread Scheduler',
				tagline: 'Dynamic, multitasking, preemptive, and balancing competing priorities.',
				description: 'You juggle dozens of competing demands without dropping a single time slice. You assign priority boosts to active interactive windows while ensuring background daemons do not starve for CPU cycles.',
				quote: 'Preempting lower-priority threads at 100 Hz with mathematical precision.',
				traits: { Organization: 98, Fairness: 90, Multitasking: 100, Throughput: 94, Stress: 45 },
				compatibility: 'Time-block enthusiasts, asynchronous queues, and high-frequency clocks.',
				incompatibility: 'Endless blocking synchronous I/O operations.'
			},
			vfs: {
				id: 'vfs',
				name: 'The Virtual Memory & Paging Manager',
				tagline: 'Expansive, resourceful, utilizing disk swap space when reality overflows.',
				description: 'When physical limits are reached, you seamlessly swap unneeded pages out to PAGEFILE.SYS and expand available horizons. You believe that with smart indexing and caching, capacity is virtually unlimited.',
				quote: '4 Gigabytes of clean linear address space for every single process.',
				traits: { Resourcefulness: 96, Scalability: 98, Caching: 92, Depth: 88, Latency: 40 },
				compatibility: 'Fast solid-state clusters and structured database indexes.',
				incompatibility: 'Severe memory leaks that thrash the hard drive thrashing platters.'
			},
			gdi: {
				id: 'gdi',
				name: 'The Win32 GDI Graphics Rendering Subsystem',
				tagline: 'Aesthetic, bitmap-blitting, window-drawing, and rendering visual elegance.',
				description: 'You care deeply about how things look, feel, and present to the outside world. You manage bitmap palettes, rounded Luna window corners, gradient title bars, and pixel-perfect icon blits.',
				quote: 'BitBlt from source DC to destination DC with SRCCOPY raster operation.',
				traits: { Aesthetics: 99, Elegance: 94, Polish: 96, VisualImpact: 98, MemoryFootprint: 60 },
				compatibility: 'TrueColor 32-bit display adapters and high-resolution skin files.',
				incompatibility: 'Ugly 1-bit monochrome text terminals with zero styling.'
			}
		},
		questions: [
			{
				id: 'q1',
				text: 'When competing tasks and requests pile up at the exact same moment, how do you handle them?',
				variants: {
					ANALYTICAL: 'Scheduler benchmark: Under heavy concurrent thread contention, what is your dispatch heuristic?',
					CYNICAL: 'When everyone expects you to do ten things at once, what is your actual response?'
				},
				options: [
					{ label: 'Time-slice each request preemptively based on dynamic priority metrics.', scores: { scheduler: 3, hal: 1 } },
					{ label: 'Standardize the interface and force all requests through a common abstraction layer.', scores: { hal: 3, vfs: 1 } },
					{ label: 'Swap inactive concerns to background storage and focus entirely on the active working set.', scores: { vfs: 3, scheduler: 1 } },
					{ label: 'Make sure the interface remains beautiful and well-presented regardless of internal pressure.', scores: { gdi: 3, scheduler: 1 } }
				]
			},
			{
				id: 'q2',
				text: 'What is your attitude toward flaws, rule violations, and sloppy mistakes?',
				variants: {
					OPTIMISTIC: 'Quality assurance inquiry: How do you guide others toward rigorous correctness?',
					ENRAGED: 'WHEN PEOPLE DELIBERATELY BREAK CRITICAL PROTOCOLS, WHAT HAPPENS?!'
				},
				options: [
					{ label: 'HALT THE ENTIRE SYSTEM IMMEDIATELY. Display the fault code in high-contrast text.', scores: { bsod: 3, hal: 1 } },
					{ label: 'Silently absorb the variance through hardware abstraction so nobody panics.', scores: { hal: 3, vfs: 1 } },
					{ label: 'De-prioritize the offending task to idle priority class.', scores: { scheduler: 3, bsod: 1 } },
					{ label: 'Apply a visual skin patch to smooth over the rough edges.', scores: { gdi: 3, vfs: 1 } }
				]
			},
			{
				id: 'q3',
				text: 'If your life had a master architectural philosophy, what would it be?',
				variants: {
					PHILOSOPHICAL: 'Ontological foundation: What core invariant anchors your existence?',
					ARCHAIC: 'What noble motto is inscribed upon the crest of thy labours?'
				},
				options: [
					{ label: 'Clean separation of concerns: shield higher logic from chaotic physical reality.', scores: { hal: 3, vfs: 1 } },
					{ label: 'Visual harmony and pixel perfection make functional reality worth experiencing.', scores: { gdi: 3, scheduler: 1 } },
					{ label: 'Unvarnished truth at all costs: an honest crash is better than silent corruption.', scores: { bsod: 3, hal: 1 } },
					{ label: 'Infinite capacity through clever caching and dynamic virtual memory paging.', scores: { vfs: 3, scheduler: 1 } }
				]
			},
			{
				id: 'q4',
				text: 'What role do you naturally assume when collaborating in a team project?',
				variants: {
					PLAYFUL: 'When playing in a multiplayer party, what class are you picking?',
					ZEN: 'In the collective balance of group effort, where does your presence settle?'
				},
				options: [
					{ label: 'The dispatcher: organizing sprints, allocating capacity, and keeping work moving.', scores: { scheduler: 3, hal: 1 } },
					{ label: 'The designer: polishing presentations, typography, and visual deliverables.', scores: { gdi: 3, scheduler: 1 } },
					{ label: 'The truth tester: finding the fatal flaws before customers do.', scores: { bsod: 3, hal: 1 } },
					{ label: 'The stabilizer: translating between different personalities and keeping peace.', scores: { hal: 3, vfs: 2 } }
				]
			}
		]
	};
})();
