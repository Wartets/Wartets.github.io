(function () {
	'use strict';

	window.ClippyPersonalityRegistry = window.ClippyPersonalityRegistry || { tests: {} };

	const testDefinition = {
		id: 'ant-colony',
		title: 'Myrmecology Colony Caste Alignment',
		subtitle: 'Formicidae Superorganism Role Assessment',
		description: 'Evaluates your specialization, pheromone signaling, collective coordination, and foraging behavior within the superorganism.',
		badge: 'Colony Caste',
		archetypes: {
			major_soldier: {
				name: 'The Major Soldier (Megacephala)',
				tagline: 'Heavy chitin armor and crushing perimeter defense',
				description: 'Equipped with oversized mandibular strength and heavy cephalic plates, you guard colony thresholds and crush dense obstacles that would overwhelm ordinary workers. You are the frontline vanguard.',
				quote: 'None shall breach the nest tunnel while my mandibles hold the entrance.',
				traits: {
					'Chitinous Resilience': 96,
					'Breach Interception': 92,
					'Perimeter Defense': 88,
					'Pheromone Subtle Nuance': 15
				},
				compatibility: 'The Scout Forager, The Foundress Queen',
				incompatibility: 'The Fungus Farmer'
			},
			forager: {
				name: 'The Scout Forager (Tandem Runner)',
				tagline: 'High-risk exploration and dynamic pheromone trail blazing',
				description: 'You operate far beyond the comfort of the chamber, navigating unpredictable terrain to discover rich caloric resources. You lay down exploratory trails and guide cohorts with swift tactile taps.',
				quote: 'Beyond the nest entrance lies the infinite harvest.',
				traits: {
					'Exploration Radius': 95,
					'Pheromone Trail Precision': 90,
					'Risk Endurance': 86,
					'Chamber Sedentary Rest': 10
				},
				compatibility: 'The Weaver Architect, The Major Soldier',
				incompatibility: 'The Brood Nurse'
			},
			nurse_worker: {
				name: 'The Brood Nurse (Alimentary Caretaker)',
				tagline: 'Micro-climate regulation and tender larva sustenance',
				description: 'You are the beating heart of colony continuity. You maintain the brood chambers at optimal humidity, groom developing larvae, and distribute vital royal jelly with selfless dedication.',
				quote: 'The strength of tomorrow’s swarm depends on the care given in the dark today.',
				traits: {
					'Micro-climate Attunement': 94,
					'Trophallaxis Sharing': 91,
					'Colony Dedication': 89,
					'External Combat Appetite': 8
				},
				compatibility: 'The Foundress Queen, The Fungus Farmer',
				incompatibility: 'The Scout Forager'
			},
			leafcutter_farmer: {
				name: 'The Fungus Farmer (Atta Agronomist)',
				tagline: 'Bio-engineering synthesis and symbiotic ecosystem cultivation',
				description: 'You do not consume raw foliage directly; you harvest substrate to nourish vast subterranean fungal gardens. You are an engineer of complex closed-loop agricultural systems.',
				quote: 'We do not merely consume nature; we cultivate symbiotic empires beneath the earth.',
				traits: {
					'Systemic Agronomy': 97,
					'Substrate Optimization': 92,
					'Complex Bio-processing': 89,
					'Impulsive Solo Wandering': 12
				},
				compatibility: 'The Weaver Architect, The Brood Nurse',
				incompatibility: 'The Major Soldier'
			},
			weaver_architect: {
				name: 'The Weaver Architect (Oecophylla Canopy Engineer)',
				tagline: 'Cooperative tensile construction and silk-bound canopy nests',
				description: 'You link your legs together with nestmates to pull giant leaves into alignment, using living silk to stitch canopy palaces high above the forest floor. You excel in tensile collaborative engineering.',
				quote: 'When thousands pull as one living chain, the whole canopy bends to our architecture.',
				traits: {
					'Tensile Coordination': 95,
					'Structural Innovation': 93,
					'Canopy Spatial Mastery': 87,
					'Isolated Subterranean Stasis': 14
				},
				compatibility: 'The Scout Forager, The Fungus Farmer',
				incompatibility: 'The Foundress Queen'
			},
			queen_founder: {
				name: 'The Foundress Queen (Gynoid Sovereign)',
				tagline: 'Centennial demographic patience and genetic colony blueprint',
				description: 'You carry the foundational blueprint of the entire superorganism within you. After a single nuptial flight, you dig deep into the earth and patiently birth a thriving civilization across decades.',
				quote: 'Patience measured in seasons turns a single chamber into a million-worker empire.',
				traits: {
					'Demographic Strategy': 98,
					'Sovereign Endurance': 92,
					'Generational Vision': 90,
					'Peripheral Skirmishing': 6
				},
				compatibility: 'The Brood Nurse, The Major Soldier',
				incompatibility: 'The Weaver Architect'
			}
		},
		questions: [
			{
				id: 'q1',
				text: 'A competitor colony is discovered near your primary foraging corridor. How do you respond?',
				variants: {
					OPTIMISTIC: 'Rival scouts detected near our supply line! How do we handle the encounter?',
					ANALYTICAL: 'Territorial boundary conflict identified in Sector 4. State your tactical protocol.'
				},
				options: [
					{ label: 'Position heavily armored units at the chokepoint and prepare to crush any incursions.', scores: { major_soldier: 3, queen_founder: 1 } },
					{ label: 'Map alternate detour paths and lay high-potency pheromone trails to bypass the contested zone.', scores: { forager: 3, weaver_architect: 1 } },
					{ label: 'Fortify internal brood chambers and safeguard young workers from external stress.', scores: { nurse_worker: 3, queen_founder: 1 } },
					{ label: 'Accelerate internal agricultural yields so the colony does not rely on contested ground.', scores: { leafcutter_farmer: 3, nurse_worker: 1 } },
					{ label: 'Assemble canopy chains to build elevated walkways high above the enemy’s patrol lines.', scores: { weaver_architect: 3, forager: 1 } },
					{ label: 'Calculate the long-term attrition rate and patiently allow demographic momentum to prevail.', scores: { queen_founder: 3, major_soldier: 1 } }
				]
			},
			{
				id: 'q2',
				text: 'What is your preferred mode of communication when coordinating tasks with peers?',
				variants: {
					OPTIMISTIC: 'How do you transmit signals across your workspace swarm?',
					ANALYTICAL: 'Select your preferred biological messaging and telemetry bandwidth medium.'
				},
				options: [
					{ label: 'High-potency trail pheromones that guide everyone directly to the goal with zero ambiguity.', scores: { forager: 3, weaver_architect: 1 } },
					{ label: 'Direct tactile antennae tapping and rapid head-butts to command immediate attention.', scores: { major_soldier: 3, forager: 1 } },
					{ label: 'Gentle trophallaxis fluid sharing, transmitting nutritional and hormonal status seamlessly.', scores: { nurse_worker: 3, queen_founder: 1 } },
					{ label: 'Subtle bio-chemical moisture cues embedded directly into the fungal farming beds.', scores: { leafcutter_farmer: 3, nurse_worker: 1 } },
					{ label: 'Coordinated vibrational drumming through leaf surfaces to synchronize tensile movement.', scores: { weaver_architect: 3, forager: 1 } },
					{ label: 'Invariable royal pheromone emissions that establish global peace and purposeful harmony.', scores: { queen_founder: 3, nurse_worker: 1 } }
				]
			},
			{
				id: 'q3',
				text: 'During a severe resource drought, how do you sustain your operational productivity?',
				variants: {
					OPTIMISTIC: 'Resources are running lean! How does your caste keep the colony thriving?',
					ANALYTICAL: 'Negative caloric variance in external supply. Select your survival strategy.'
				},
				options: [
					{ label: 'Harvest specialized fungal cultivars carefully preserved in deep humidity-controlled vaults.', scores: { leafcutter_farmer: 3, nurse_worker: 1 } },
					{ label: 'Extend exploratory foraging radius by 500% to locate untouched peripheral bounty.', scores: { forager: 3, weaver_architect: 1 } },
					{ label: 'Ration metabolic intake strictly, guarding the inner reserves with unwavering presence.', scores: { major_soldier: 3, queen_founder: 1 } },
					{ label: 'Redistribute stored nutrients evenly to ensure the next generation survives unharmed.', scores: { nurse_worker: 3, leafcutter_farmer: 1 } },
					{ label: 'Restructure nest architecture to capture ambient morning dew and optimal thermal drafts.', scores: { weaver_architect: 3, leafcutter_farmer: 1 } },
					{ label: 'Draw upon long-term fat body reserves in calm subterranean stillness until rain returns.', scores: { queen_founder: 3, sloth: 1 } }
				]
			},
			{
				id: 'q4',
				text: 'What brings you the deepest sense of accomplishment in a collaborative endeavor?',
				variants: {
					OPTIMISTIC: 'What makes you proud to be part of the superorganism?',
					ANALYTICAL: 'Identify the peak utility metric that satisfies your objective function.'
				},
				options: [
					{ label: 'Witnessing an intricate multi-tiered architectural nest assembled from thousands of living links.', scores: { weaver_architect: 3, leafcutter_farmer: 1 } },
					{ label: 'Securing the nest against a dangerous predator through sheer defensive grit.', scores: { major_soldier: 3, forager: 1 } },
					{ label: 'Blazing the definitive trail that allows thousands of workers to haul immense riches home.', scores: { forager: 3, weaver_architect: 1 } },
					{ label: 'Watching healthy new workers emerge from pupae ready to serve the colony.', scores: { nurse_worker: 3, queen_founder: 1 } },
					{ label: 'Maintaining a perfectly balanced fungal garden producing optimal yields week after week.', scores: { leafcutter_farmer: 3, nurse_worker: 1 } },
					{ label: 'Establishing a thriving, self-sustaining dynasty that will endure across decades.', scores: { queen_founder: 3, major_soldier: 1 } }
				]
			},
			{
				id: 'q5',
				text: 'How do you react when an unexpected physical barrier blocks the primary tunnel?',
				variants: {
					OPTIMISTIC: 'Tunnel cave-in ahead! What is your engineering response?',
					ANALYTICAL: 'Physical obstruction in primary transmission conduit. State your clearing procedure.'
				},
				options: [
					{ label: 'Apply massive mandibular torque to shatter the obstruction into transportable gravel.', scores: { major_soldier: 3, forager: 1 } },
					{ label: 'Scout out a subterranean detour route in minutes and mark it with fresh chemical markers.', scores: { forager: 3, weaver_architect: 1 } },
					{ label: 'Form a living chain with fellow workers to haul and cantilever the debris out of the shaft.', scores: { weaver_architect: 3, leafcutter_farmer: 1 } },
					{ label: 'Shield and evacuate the delicate brood specimens to deeper, safer gallery levels.', scores: { nurse_worker: 3, queen_founder: 1 } },
					{ label: 'Incorporate the rock debris into moisture retention retaining walls for the fungal beds.', scores: { leafcutter_farmer: 3, weaver_architect: 1 } },
					{ label: 'Remain steady in the royal chamber; trust the caste system to resolve the blockage.', scores: { queen_founder: 3, nurse_worker: 1 } }
				]
			},
			{
				id: 'q6',
				text: 'What is your core perspective on individuality versus the collective whole?',
				variants: {
					OPTIMISTIC: 'Where do you fit into the grand design of the colony?',
					ANALYTICAL: 'Evaluate the utility ratio between autonomous nodes and the macro-system.'
				},
				options: [
					{ label: 'The superorganism is everything; my highest glory is fulfilling my specialized caste role flawlessly.', scores: { nurse_worker: 3, major_soldier: 1 } },
					{ label: 'I am the pioneering edge; my individual courage expands the horizons of the whole nest.', scores: { forager: 3, weaver_architect: 1 } },
					{ label: 'I am the living shield; without my steadfast defense, the colony cannot exist.', scores: { major_soldier: 3, queen_founder: 1 } },
					{ label: 'I am the ecosystem engine; synthesis and cultivation sustain every beating heart in the dark.', scores: { leafcutter_farmer: 3, nurse_worker: 1 } },
					{ label: 'I am the structural bridge; collective unity transforms individual weakness into monumental form.', scores: { weaver_architect: 3, forager: 1 } },
					{ label: 'I am the sovereign continuity; generations flow through my patience and determination.', scores: { queen_founder: 3, major_soldier: 1 } }
				]
			}
		]
	};

	window.ClippyPersonalityRegistry.tests[testDefinition.id] = testDefinition;
})();
