(function () {
	'use strict';

	window.ClippyPersonalityRegistry = window.ClippyPersonalityRegistry || { tests: {} };

	const testDefinition = {
		id: 'operating-system',
		title: 'Operating System Kernel Typology',
		subtitle: 'Architecture, Scheduler & Memory Subsystem Alignment',
		description: 'Determines which legendary OS architecture (Windows XP, MS-DOS, Debian Linux, Plan 9, BeOS, OS/2 Warp) matches your cognitive execution loop.',
		badge: 'OS Architecture',
		archetypes: {
			windows_xp: {
				name: 'Windows XP Professional (NT 5.1 / Whistler)',
				tagline: 'Luna blue warmth, pre-emptive stability, and iconic retro dominance',
				description: 'The golden synthesis of consumer charm and enterprise 32-bit NT kernel stability. You bring rounded borders, Bliss wallpapers, ClearType fonts, and unmatched multi-tasking familiarity to every endeavor.',
				quote: 'Welcome back. All services, soundcards, and Luna visual styles are operating at 100%.',
				traits: {
					'Desktop Dominance': 98,
					'Visual Familiarity': 94,
					'Pre-emptive Multitasking': 91,
					'Minimalist Asceticism': 8
				},
				compatibility: 'BeOS (The Multi-Threader), MS-DOS 6.22',
				incompatibility: 'Plan 9 from Bell Labs'
			},
			ms_dos: {
				name: 'MS-DOS 6.22 (The Bare-Metal Workhorse)',
				tagline: 'Direct hardware interrupts, 640 KB conventional grit, and zero abstraction fluff',
				description: 'You do not hide behind bloated window managers. You boot in two seconds directly into `C:\\>` with AUTOEXEC.BAT and CONFIG.SYS precision. You talk straight to memory registers and demand exact syntax.',
				quote: 'Bad command or file name. Press any key to continue.',
				traits: {
					'Bare-Metal Speed': 99,
					'Deterministic Simplicity': 95,
					'Conventional Memory Mastery': 92,
					'Multitasking Luxury': 2
				},
				compatibility: 'OS/2 Warp 4, Windows XP Professional',
				incompatibility: 'Debian GNU/Linux (Stable)'
			},
			debian_linux: {
				name: 'Debian GNU/Linux (The Immutable Sovereign)',
				tagline: 'Rock-solid package stability, free software dogma, and multi-year uptime',
				description: 'You prioritize verifiable reliability over shiny transient trends. Your dependency graphs are impeccably resolved, your daemon processes run for years without rebooting, and you build from source with pride.',
				quote: 'Uptime: 1428 days. Upgrades verified against cryptographic checksums.',
				traits: {
					'Uptime Stability': 99,
					'Package Integrity': 95,
					'Philosophical Purity': 92,
					'Commercial Compromise': 4
				},
				compatibility: 'Plan 9 from Bell Labs, BeOS (The Multi-Threader)',
				incompatibility: 'Windows XP Professional'
			},
			plan_9: {
				name: 'Plan 9 from Bell Labs (The Distributed Visionary)',
				tagline: 'Everything is a file namespace, 9P protocol purity, and UTF-8 origin',
				description: 'Created by the legendary inventors of Unix and C, you view computation as composable per-process namespaces across networks. You co-invented UTF-8 on a diner placemat and live decades ahead of your time.',
				quote: 'Everything is a file. Every network is a namespace. Simplicity is distributed.',
				traits: {
					'Namespace Elegance': 99,
					'Protocol Purity (9P)': 96,
					'Distributed Cohesion': 93,
					'Mainstream Monopolies': 3
				},
				compatibility: 'Debian GNU/Linux (Stable), BeOS (The Multi-Threader)',
				incompatibility: 'Windows XP Professional'
			},
			beos: {
				name: 'BeOS (The Media OS Multi-Threader)',
				tagline: 'Pervasive micro-threads, 64-bit journaling BFS, and zero-latency multimedia',
				description: 'Ahead of its era in 1995, every single window, sound channel, and database attribute ran on its own dedicated pre-emptive thread. You deliver blazing audio-video throughput with yellow title tabs.',
				quote: 'Why lock a single CPU core when every pixel can breathe on its own thread?',
				traits: {
					'Pervasive Multithreading': 99,
					'Low-Latency Media': 95,
					'Database BFS Innovation': 91,
					'Legacy Inertia': 6
				},
				compatibility: 'Windows XP Professional, Plan 9 from Bell Labs',
				incompatibility: 'MS-DOS 6.22'
			},
			os2_warp: {
				name: 'OS/2 Warp 4 (The Object Desktop Titan)',
				tagline: 'Workplace Shell object paradigm and crash-proof DOS virtualization',
				description: 'The sophisticated corporate powerhouse with the object-oriented Workplace Shell. You ran better DOS than DOS, better Windows than Windows, and still quietly power critical ATMs around the globe.',
				quote: 'A crash in one subsystem shall never bring down the Workplace Shell.',
				traits: {
					'Object-Oriented Desktop': 96,
					'Virtual Isolation': 93,
					'Corporate Longevity': 90,
					'Consumer Marketing': 10
				},
				compatibility: 'MS-DOS 6.22, Debian GNU/Linux (Stable)',
				incompatibility: 'BeOS (The Multi-Threader)'
			}
		},
		questions: [
			{
				id: 'q1',
				text: 'An unhandled exception occurs in a background process. How does your kernel react?',
				variants: {
					OPTIMISTIC: 'A glitch in the background! How does your OS keep running?',
					ANALYTICAL: 'Fault trapped at Ring 3 privilege level. State kernel exception handler response.'
				},
				options: [
					{ label: 'Display a friendly blue dialog, log the error report, and keep every other window running smoothly.', scores: { windows_xp: 3, beos: 1 } },
					{ label: 'Halt the CPU immediately with a blinking cursor; memory corruption shall not be tolerated.', scores: { ms_dos: 3, debian_linux: 1 } },
					{ label: 'Log the stack trace to `/var/log/syslog`, isolate the PID, and restart the systemd service in 2ms.', scores: { debian_linux: 3, plan_9: 1 } },
					{ label: 'Drop the dead file descriptor from the process namespace; other nodes never notice.', scores: { plan_9: 3, debian_linux: 1 } },
					{ label: 'The thread terminates cleanly while fifty other concurrent media threads play video uninterrupted.', scores: { beos: 3, windows_xp: 1 } },
					{ label: 'Workplace Shell object boundary absorbs the fault; virtual memory protects the core ledger.', scores: { os2_warp: 3, ms_dos: 1 } }
				]
			},
			{
				id: 'q2',
				text: 'What visual appearance and user interface philosophy inspires your desktop?',
				variants: {
					OPTIMISTIC: 'What visual style defines your ideal digital workstation?',
					ANALYTICAL: 'Identify your target graphical window manager and rendering paradigm.'
				},
				options: [
					{ label: 'Rounded blue Luna title bars, rich 32-bit icons, and the green rolling hills of Bliss.', scores: { windows_xp: 3, beos: 1 } },
					{ label: 'Monochrome 80x25 green-phosphor text mode with blinking cursor and zero graphic latency.', scores: { ms_dos: 3, debian_linux: 1 } },
					{ label: 'Minimalist tiling window manager or headless terminal with ASCII status bars.', scores: { debian_linux: 3, plan_9: 1 } },
					{ label: 'Rio clean mouse-driven typography where terminal windows are navigable file buffers.', scores: { plan_9: 3, debian_linux: 1 } },
					{ label: 'Iconic yellow title tabs nestled on window shoulders with ultra-smooth 60fps animations.', scores: { beos: 3, windows_xp: 1 } },
					{ label: 'Object-oriented Workplace Shell where documents, printers, and disks are real COM objects.', scores: { os2_warp: 3, ms_dos: 1 } }
				]
			},
			{
				id: 'q3',
				text: 'How do you structure files, storage, and organizational namespaces?',
				variants: {
					OPTIMISTIC: 'How do you organize your files across the system volume?',
					ANALYTICAL: 'Select your preferred virtual file system architecture and metadata indexing model.'
				},
				options: [
					{ label: 'Hierarchical NTFS with drive letters (C:, D:), My Documents shortcuts, and FAT32 compatibility.', scores: { windows_xp: 3, ms_dos: 1 } },
					{ label: 'Flat 8.3 filename conventions in root directories with direct cluster allocation tables.', scores: { ms_dos: 3, os2_warp: 1 } },
					{ label: 'Standard Filesystem Hierarchy Standard (FHS) rooted at `/` with strict permissions and symlinks.', scores: { debian_linux: 3, plan_9: 1 } },
					{ label: 'Universal 9P synthetic filesystems where network nodes, graphics, and processes are all file paths.', scores: { plan_9: 3, debian_linux: 1 } },
					{ label: '64-bit Be File System (BFS) with live database indexing and custom query-based folder views.', scores: { beos: 3, windows_xp: 1 } },
					{ label: 'High Performance File System (HPFS) with extended attributes and object containment.', scores: { os2_warp: 3, ms_dos: 1 } }
				]
			},
			{
				id: 'q4',
				text: 'What is your core philosophy on software updates and backwards compatibility?',
				variants: {
					OPTIMISTIC: 'How do you treat old legacy software versus cutting-edge updates?',
					ANALYTICAL: 'State your package stability, ABI preservation, and legacy compatibility policy.'
				},
				options: [
					{ label: 'Preserve flawless compatibility for 16-bit DOS games and 32-bit Win32 apps simultaneously.', scores: { windows_xp: 3, os2_warp: 1 } },
					{ label: 'If it ran on an Intel 8088 in 1981, it must run bit-for-bit identical today with zero changes.', scores: { ms_dos: 3, os2_warp: 1 } },
					{ label: 'Rigorous peer review and frozen stable cycles; zero breaking regressions permitted in production.', scores: { debian_linux: 3, plan_9: 1 } },
					{ label: 'Design protocols so orthogonal and clean that backward compatibility is mathematically trivial.', scores: { plan_9: 3, debian_linux: 1 } },
					{ label: 'Break legacy bottlenecks without fear to unlock raw multi-threaded hardware potential.', scores: { beos: 3, windows_xp: 1 } },
					{ label: 'Encapsulate legacy subsystems inside dedicated virtual machines with independent memory.', scores: { os2_warp: 3, ms_dos: 1 } }
				]
			},
			{
				id: 'q5',
				text: 'How do you handle audio, video, and multimedia data streams?',
				variants: {
					OPTIMISTIC: 'How do you spin tunes and process multimedia on your rig?',
					ANALYTICAL: 'Select your digital signal processing, PCM buffer, and audio codec pipeline.'
				},
				options: [
					{ label: 'DirectSound hardware acceleration, Windows Media Player visualizers, and Winamp 2.9 skins.', scores: { windows_xp: 3, beos: 1 } },
					{ label: 'Direct OPL3 FM synthesizer chip manipulation on Sound Blaster Port 220 IRQ 5.', scores: { ms_dos: 3, os2_warp: 1 } },
					{ label: 'ALSA and PulseAudio pipelines routed through command-line utilities and JACK servers.', scores: { debian_linux: 3, plan_9: 1 } },
					{ label: 'Streaming raw uncompressed audio bytes directly through `/dev/audio` file pipes.', scores: { plan_9: 3, debian_linux: 1 } },
					{ label: 'Pervasive Media Kit delivering sub-millisecond audio latency and multi-channel hardware blits.', scores: { beos: 3, windows_xp: 1 } },
					{ label: 'MMPM/2 multimedia extensions with object-oriented sound control folders.', scores: { os2_warp: 3, ms_dos: 1 } }
				]
			},
			{
				id: 'q6',
				text: 'What is the ultimate measure of a computer system’s greatness?',
				variants: {
					OPTIMISTIC: 'What makes an operating system truly legendary?',
					ANALYTICAL: 'Define the definitive operational metric for computing architecture excellence.'
				},
				options: [
					{ label: 'Empowering hundreds of millions of human beings to create, play, and work every single day.', scores: { windows_xp: 3, beos: 1 } },
					{ label: 'Giving the programmer raw, unfiltered access to every silicon byte with zero bureaucracy.', scores: { ms_dos: 3, debian_linux: 1 } },
					{ label: 'Unyielding freedom, total user ownership, and cryptographic reproducibility.', scores: { debian_linux: 3, plan_9: 1 } },
					{ label: 'Conceptual elegance so profound that hardware, networks, and software become one idea.', scores: { plan_9: 3, debian_linux: 1 } },
					{ label: 'Fluid, responsive performance where the interface never stutters, drops a frame, or stalls.', scores: { beos: 3, windows_xp: 1 } },
					{ label: 'Rock-solid enterprise architecture that quietly keeps world financial logistics running.', scores: { os2_warp: 3, ms_dos: 1 } }
				]
			}
		]
	};

	window.ClippyPersonalityRegistry.tests[testDefinition.id] = testDefinition;
})();
