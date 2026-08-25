(function () {
	'use strict';

	window.ClippyPersonalityRegistry = window.ClippyPersonalityRegistry || { tests: {} };

	const testDefinition = {
		id: 'animal-archetype',
		title: 'Animal Instinct & Archetype Evaluation',
		subtitle: 'Biological Behavioral & Instinct Classification',
		description: 'Maps your cognitive instincts, stress reactions, social habits, and foraging tactics to classical zoological archetypes.',
		badge: 'Fauna Alignment',
		archetypes: {
			owl: {
				name: 'The Silent Owl (Nocturnal Observer)',
				tagline: 'Hyper-focused perception and strategic patience',
				description: 'You operate with measured stillness, watching events unfold from a high vantage point before taking decisive, silent action. You value deep focus, solitude, and thorough analysis over hasty reaction.',
				quote: 'Wisdom is the reward for silence when everyone else is making noise.',
				traits: {
					'Perception & Vigilance': 94,
					'Patience Vector': 88,
					'Autonomous Solitude': 82,
					'Impulsive Energy': 18
				},
				compatibility: 'The Zen Sloth, The Deep Sea Octopus',
				incompatibility: 'The Honey Badger'
			},
			honey_badger: {
				name: 'The Honey Badger (Unyielding Defender)',
				tagline: 'Relentless resilience and fearless autonomy',
				description: 'You possess thick psychological armor and an unshakeable boundary against intimidation. When obstacles or opposition arise, you confront them directly with zero hesitation and unmatched grit.',
				quote: 'Obstacles do not block the path; they are crushed underfoot.',
				traits: {
					'Fearless Tenacity': 98,
					'Direct Confrontation': 90,
					'Defensive Armor': 86,
					'Diplomatic Restraint': 12
				},
				compatibility: 'The Alpha Wolf, The Golden Retriever',
				incompatibility: 'The Silent Owl'
			},
			golden_retriever: {
				name: 'The Golden Retriever (Empathetic Companion)',
				tagline: 'Unconditional loyalty and collaborative warmth',
				description: 'You are the social glue of any workspace. Your natural optimism, empathy, and eagerness to support colleagues foster high trust and cohesion even during demanding deadlines.',
				quote: 'No milestone is worth celebrating if you leave your team behind.',
				traits: {
					'Social Cohesion': 96,
					'Empathy & Loyalty': 92,
					'Collaborative Energy': 85,
					'Cynical Detachment': 8
				},
				compatibility: 'The Alpha Wolf, The Honey Badger',
				incompatibility: 'The Deep Sea Octopus'
			},
			octopus: {
				name: 'The Deep Sea Octopus (Adaptive Problem Solver)',
				tagline: 'Multi-threaded intellect and fluid camouflage',
				description: 'You navigate complex environments by constantly reshaping your tools and perspective. You solve intricate puzzles with quiet ingenuity and excel in decentralized, flexible setups.',
				quote: 'To overcome a rigid barrier, become fluid and find the gaps.',
				traits: {
					'Creative Fluidity': 95,
					'Decentralized Intellect': 91,
					'Tool Mastery': 87,
					'Dogmatic Rigidity': 6
				},
				compatibility: 'The Silent Owl, The Zen Sloth',
				incompatibility: 'The Alpha Wolf'
			},
			wolf: {
				name: 'The Alpha Wolf (Coordinated Strategist)',
				tagline: 'Disciplined hierarchy and relentless pack execution',
				description: 'You thrive in coordinated structures where responsibilities are crisp and everyone pulls their weight. You command respect through tactical consistency, shared hardship, and protective leadership.',
				quote: 'A pack moving in unison can take down challenges that dwarf any individual.',
				traits: {
					'Tactical Leadership': 93,
					'Pack Discipline': 91,
					'Strategic Execution': 89,
					'Chaotic Drift': 10
				},
				compatibility: 'The Golden Retriever, The Honey Badger',
				incompatibility: 'The Deep Sea Octopus'
			},
			sloth: {
				name: 'The Zen Sloth (Energy Conservationist)',
				tagline: 'Unflappable equilibrium and deliberate pacing',
				description: 'You understand that sustainable endurance beats frenetic rushing. You filter out superficial urgency, conserve cognitive energy for what truly matters, and maintain steady composure in crisis.',
				quote: 'The world rushes past in circles; the steady traveler arrives without breaking a sweat.',
				traits: {
					'Equilibrium Preservation': 97,
					'Stress Immunity': 90,
					'Deliberate Pacing': 88,
					'Artificial Urgency': 5
				},
				compatibility: 'The Silent Owl, The Deep Sea Octopus',
				incompatibility: 'The Alpha Wolf'
			}
		},
		questions: [
			{
				id: 'q1',
				text: 'An unexpected emergency disrupts your planned schedule. What is your instantaneous behavioral reflex?',
				variants: {
					OPTIMISTIC: 'A sudden roadblock drops onto your path! How do you rally your instincts?',
					ANALYTICAL: 'High-entropy disruption injected into the active routine. State your primary instinctual reaction.'
				},
				options: [
					{ label: 'Step back into quiet isolation to analyze every detail before making a single move.', scores: { owl: 3, sloth: 1 } },
					{ label: 'Charge straight at the blocker and tear through it until normal operations resume.', scores: { honey_badger: 3, wolf: 1 } },
					{ label: 'Rally the team, check on everyone’s morale, and divide the burden together.', scores: { golden_retriever: 3, wolf: 1 } },
					{ label: 'Morph your approach instantly, crafting a clever workaround from unconventional tools.', scores: { octopus: 3, owl: 1 } },
					{ label: 'Take a deep breath, refuse to panic, and address the critical item at a sustainable pace.', scores: { sloth: 3, owl: 1 } },
					{ label: 'Assign clear roles, establish tactical priorities, and enforce coordinated execution.', scores: { wolf: 3, honey_badger: 1 } }
				]
			},
			{
				id: 'q2',
				text: 'What kind of habitat and working environment allows your peak output to thrive?',
				variants: {
					OPTIMISTIC: 'Picture your dream workstation habitat! What setup fuels your spirit?',
					ANALYTICAL: 'Identify the spatial and sociological environment parameters that optimize your throughput.'
				},
				options: [
					{ label: 'A quiet, dimly lit sanctuary late at night with zero ambient interruptions.', scores: { owl: 3, octopus: 1 } },
					{ label: 'A bustling, open space where high camaraderie and mutual encouragement flow.', scores: { golden_retriever: 3, wolf: 1 } },
					{ label: 'An autonomous command center where you dictate your own direction with no micromanagement.', scores: { honey_badger: 3, octopus: 1 } },
					{ label: 'A multi-screen laboratory filled with diverse projects and modular gadgets.', scores: { octopus: 3, owl: 1 } },
					{ label: 'A structured operations room with well-defined hierarchies and reliable battle stations.', scores: { wolf: 3, golden_retriever: 1 } },
					{ label: 'A comfortable, low-stress lounge with minimal noise and plenty of herbal tea.', scores: { sloth: 3, owl: 1 } }
				]
			},
			{
				id: 'q3',
				text: 'How do you handle interpersonal confrontation or territorial disagreements?',
				variants: {
					OPTIMISTIC: 'When friction arises with a peer, what is your compass heading?',
					ANALYTICAL: 'Confrontational state detected. What arbitration algorithm does your behavioral system deploy?'
				},
				options: [
					{ label: 'Confront it head-on with raw honesty; backing down is not in your firmware.', scores: { honey_badger: 3, wolf: 1 } },
					{ label: 'Diffuse the tension with warmth, empathy, and active listening to preserve harmony.', scores: { golden_retriever: 3, sloth: 1 } },
					{ label: 'Observe silently from the perimeter until the factual contradictions dismantle themselves.', scores: { owl: 3, octopus: 1 } },
					{ label: 'Change the conversational axis subtly, slipping past the confrontation entirely.', scores: { octopus: 3, sloth: 1 } },
					{ label: 'Enforce established standards and chain of responsibility to resolve the dispute.', scores: { wolf: 3, honey_badger: 1 } },
					{ label: 'Let the agitation dissipate over time without getting emotionally invested in the drama.', scores: { sloth: 3, owl: 1 } }
				]
			},
			{
				id: 'q4',
				text: 'When hunting for a solution to a difficult technical bug, what is your primary strategy?',
				variants: {
					OPTIMISTIC: 'You are on the trail of an elusive bug! How do you track it down?',
					ANALYTICAL: 'Diagnostic evaluation of an elusive defect. Select your tracking methodology.'
				},
				options: [
					{ label: 'Dissect the system architecture piece by piece, inventing novel testing hooks on the fly.', scores: { octopus: 3, owl: 1 } },
					{ label: 'Read through system trace logs in complete darkness until the anomalous pattern clicks.', scores: { owl: 3, sloth: 1 } },
					{ label: 'Brute-force test every assumption relentlessly until the fault is battered into submission.', scores: { honey_badger: 3, wolf: 1 } },
					{ label: 'Organize a collaborative bug bash session with peers and pair-program the fix.', scores: { golden_retriever: 3, wolf: 1 } },
					{ label: 'Delegate inspection domains systematically across the team with synchronized logs.', scores: { wolf: 3, honey_badger: 1 } },
					{ label: 'Step away from the screen, take a walk, and let the answer surface naturally in stillness.', scores: { sloth: 3, owl: 1 } }
				]
			},
			{
				id: 'q5',
				text: 'What is your fundamental philosophy regarding physical and cognitive energy?',
				variants: {
					OPTIMISTIC: 'How do you keep your battery charged for the long haul?',
					ANALYTICAL: 'Energy allocation policy: identify your thermodynamic resource management rule.'
				},
				options: [
					{ label: 'Energy is precious; eliminate unnecessary movement and never rush without cause.', scores: { sloth: 3, owl: 1 } },
					{ label: 'Energy is multiplied when shared with loyal companions working for a common cause.', scores: { golden_retriever: 3, wolf: 1 } },
					{ label: 'Energy should be hoarded during daylight and unleashed with surgical precision at night.', scores: { owl: 3, octopus: 1 } },
					{ label: 'Energy is an endless furnace fueled by challenge, friction, and sheer willpower.', scores: { honey_badger: 3, wolf: 1 } },
					{ label: 'Energy flows into flexible branching paths, adapting its shape to whatever task calls.', scores: { octopus: 3, sloth: 1 } },
					{ label: 'Energy must be channeled through disciplined formations to maximize collective impact.', scores: { wolf: 3, golden_retriever: 1 } }
				]
			},
			{
				id: 'q6',
				text: 'At the conclusion of a victorious project, how do you celebrate your achievement?',
				variants: {
					OPTIMISTIC: 'Mission accomplished! How does your archetype savor the win?',
					ANALYTICAL: 'Post-milestone state transition: choose your operational celebration protocol.'
				},
				options: [
					{ label: 'Throw a festive team gathering and praise everyone who contributed.', scores: { golden_retriever: 3, wolf: 1 } },
					{ label: 'Acknowledge the milestone briefly, review the lessons learned, and prepare for the next hunt.', scores: { wolf: 3, honey_badger: 1 } },
					{ label: 'Retreat to your private branch, enjoy the quiet victory, and read a rewarding book.', scores: { owl: 3, sloth: 1 } },
					{ label: 'Dismantle your working rig immediately to build something even more experimental.', scores: { octopus: 3, owl: 1 } },
					{ label: 'Curl up in a hammock, power down all alert systems, and take a 12-hour nap.', scores: { sloth: 3, golden_retriever: 1 } },
					{ label: 'Shrug it off as expected standard performance and seek out an even tougher challenge.', scores: { honey_badger: 3, wolf: 1 } }
				]
			}
		]
	};

	window.ClippyPersonalityRegistry.tests[testDefinition.id] = testDefinition;
})();
