(function () {
	'use strict';

	window.ClippyPersonalityRegistry = window.ClippyPersonalityRegistry || { tests: {} };

	window.ClippyPersonalityRegistry.tests['cyber-netrunner'] = {
		id: 'cyber-netrunner',
		title: 'Cyber Netrunner & Daemon Protocol Alignment',
		subtitle: 'Which Cybernetic Matrix Subroutine Governs Your Uplink?',
		badge: 'Matrix Grid Daemon',
		description: 'A tactical cyberpunk classification determining your netrunning specialization, encryption protocol, and digital intrusion archetype.',
		archetypes: {
			ghost: {
				id: 'ghost',
				name: 'The 0x00 Zero-Day Ghost Daemon',
				tagline: 'Silent, encrypted, passing through firewalls without triggering packet logs.',
				description: 'You leave zero residual logs in the memory buffer. You operate with total discretion, piercing through layered security perimeters while remaining completely invisible to diagnostic sniffers.',
				quote: 'Port 80 closed. Trace route scrubbed. 0 bytes leaked to telemetry.',
				traits: { Stealth: 100, Encryption: 98, Precision: 95, Visibility: 5, Intrusion: 92 },
				compatibility: 'Encrypted onion tunnels, null pointer traps, and air-gapped workstations.',
				incompatibility: 'Noisy telemetry trackers and unencrypted broadcast networks.'
			},
			icebreaker: {
				id: 'icebreaker',
				name: 'The High-Voltage ICE Breaker Program',
				tagline: 'Aggressive, brute-forcing encryption keys, and shattering security gates.',
				description: 'When barriers stand in your path, you do not look for subtle workarounds. You inject raw voltage, compile optimized machine opcode, and smash through defensive matrices with unstoppable brute force.',
				quote: 'Root privilege obtained. Security daemon terminated via SIGKILL -9.',
				traits: { Power: 100, Velocity: 96, Breakthrough: 98, Subtlety: 10, Tenacity: 94 },
				compatibility: 'Overclocked multi-core rigs and high-throughput bus pipelines.',
				incompatibility: 'Gentle diplomatic negotiations and passive waiting queues.'
			},
			sniffer: {
				id: 'sniffer',
				name: 'The Deep Packet Inspection Spectre',
				tagline: 'Observant, dissecting incoming byte headers, and mapping the entire network topography.',
				description: 'You see every packet, header, and handshake flowing across the bus. Nothing escapes your analytical radar; you reconstruct complex architectures simply by observing traffic patterns from afar.',
				quote: 'Promiscuous mode enabled: parsing TCP streams in promiscuous promiscuity.',
				traits: { Observation: 100, Insight: 98, Analysis: 96, Patience: 90, Discretion: 85 },
				compatibility: 'Wireshark packet captures, routing tables, and diagnostic analyzers.',
				incompatibility: 'Blind reckless actions with zero reconnaissance.'
			},
			coredaemon: {
				id: 'coredaemon',
				name: 'The Sovereign Kernel Core Daemon',
				tagline: 'Architectural, holding master encryption keys, and running at Ring 0 privilege.',
				description: 'You are the ultimate authority in the matrix. You manage memory pages, isolate process threads, enforce security privileges, and maintain structural integrity across the entire cyberspace grid.',
				quote: 'Ring 0 privilege affirmed. Kernel state locked and verified.',
				traits: { Authority: 100, Architecture: 98, Resilience: 96, Security: 99, Integrity: 95 },
				compatibility: 'Protected Mode page tables, secure boot loaders, and deterministic kernels.',
				incompatibility: 'Corrupt memory leaks and unauthorized privilege escalations.'
			}
		},
		questions: [
			{
				id: 'q1',
				text: 'When encountering a heavily fortified system firewall, what is your primary tactical approach?',
				variants: {
					ANALYTICAL: 'Intrusion vector analysis: What is your primary exploit payload against hardened defenses?'
				},
				options: [
					{ label: 'Slip silently through an unmonitored side-channel without triggering a single alert.', scores: { ghost: 3, sniffer: 1 } },
					{ label: 'Unleash high-frequency brute force opcodes and smash through the security gate.', scores: { icebreaker: 3, coredaemon: 1 } },
					{ label: 'Intercept and analyze packet headers until the structural vulnerability is exposed.', scores: { sniffer: 3, ghost: 1 } },
					{ label: 'Assert master Ring 0 supervisory privilege and command the firewall to disarm.', scores: { coredaemon: 3, icebreaker: 1 } }
				]
			},
			{
				id: 'q2',
				text: 'What represents your greatest technological asset in a high-stakes environment?',
				variants: {
					PLAYFUL: 'Pick your ultimate cyber perk for the upcoming digital heist!'
				},
				options: [
					{ label: 'Complete invisibility and untraceable cryptographic signatures.', scores: { ghost: 3, sniffer: 1 } },
					{ label: 'Overwhelming execution power that pulverizes any computational bottleneck.', scores: { icebreaker: 3, coredaemon: 1 } },
					{ label: 'Total situational awareness and deep packet telemetry across all nodes.', scores: { sniffer: 3, ghost: 1 } },
					{ label: 'Master supervisory control and deterministic architectural dominance.', scores: { coredaemon: 3, icebreaker: 1 } }
				]
			},
			{
				id: 'q3',
				text: 'How do you operate when an unexpected system probe scans your active terminal?',
				variants: {
					PARANOID: '*flickers* Port scan detected! What defensive protocol is deployed?'
				},
				options: [
					{ label: 'Ghost into unallocated memory addresses and return zero response bytes.', scores: { ghost: 3, sniffer: 1 } },
					{ label: 'Trace the probe back to its source IP and dispatch a counter-intrusion payload.', scores: { icebreaker: 3, sniffer: 1 } },
					{ label: 'Capture every packet of the probe and analyze the opponent\'s signature.', scores: { sniffer: 3, ghost: 1 } },
					{ label: 'Enforce kernel security ring boundaries and quarantine the probe thread immediately.', scores: { coredaemon: 3, ghost: 1 } }
				]
			}
		]
	};
})();
