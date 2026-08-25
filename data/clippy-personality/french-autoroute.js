(function () {
	'use strict';

	window.ClippyPersonalityRegistry = window.ClippyPersonalityRegistry || { tests: {} };

	const testDefinition = {
		id: 'french-autoroute',
		title: 'French Autoroute Network Alignment',
		subtitle: 'Topological Highway & Motorway Resonance',
		description: 'Maps your travel velocity, toll-gate patience, scenic preferences, and transport logistics to France’s iconic autoroute network.',
		badge: 'Autoroute Matrix',
		archetypes: {
			a6_soleil: {
				name: 'L’Autoroute du Soleil (A6 / A7)',
				tagline: 'The legendary summer holiday migration and sun-drenched corridor',
				description: 'From Paris through Burgundy and the Rhône Valley straight to Marseille, you are the quintessential vacation artery. You embody summer migration, toll-gate patience, iconic rest stops, and warmth.',
				quote: 'Bouchon de Fourvière or not, the Mediterranean horizon is worth every kilometer.',
				traits: {
					'Holiday Momentum': 98,
					'Toll-Gate Patience': 92,
					'Scenic Transition': 89,
					'Subterranean Claustrophobia': 6
				},
				compatibility: 'La Provençale (A8), L’Autoroute de Normandie (A13)',
				incompatibility: 'Le Superpériphérique (A86)'
			},
			a1_nord: {
				name: 'L’Autoroute du Nord (A1)',
				tagline: 'Relentless freight logistics and high-density European transit',
				description: 'Connecting Paris to Lille and the northern European borders, you are the unyielding industrial workhorse. You deliver high throughput, freight efficiency, and purposeful momentum through rain or fog.',
				quote: 'Through fog and rain, the freight corridor never halts its rhythm.',
				traits: {
					'Logistical Throughput': 99,
					'Freight Endurance': 95,
					'Industrial Efficiency': 91,
					'Vacation Leisure': 5
				},
				compatibility: 'Le Superpériphérique (A86), L’Autoroute de Normandie (A13)',
				incompatibility: 'La Méridienne (A75)'
			},
			a75_meridienne: {
				name: 'La Méridienne (A75 / Viaduc de Millau)',
				tagline: 'High-altitude mountain pass, engineering marvels, and toll-free freedom',
				description: 'Climbing across the Massif Central at over 1,100 meters and soaring across the clouds on the Millau Viaduct, you value wild rugged landscapes, engineering brilliance, and toll-free independence.',
				quote: 'Why pay tolls in a crowded valley when you can soar above the clouds on the highest bridge in Europe?',
				traits: {
					'Mountain Freedom': 99,
					'Architectural Wonder': 96,
					'Toll-Free Independence': 94,
					'Urban Congestion': 2
				},
				compatibility: 'L’Autoroute du Soleil (A6 / A7), La Provençale (A8)',
				incompatibility: 'L’Autoroute du Nord (A1)'
			},
			a86_superperipherique: {
				name: 'Le Superpériphérique (A86 / Duplex)',
				tagline: 'Subterranean tunnels, intense urban hustle, and master of congestion',
				description: 'Circling the inner ring around Paris with the double-decker Duplex tunnel, you navigate dense complex traffic with razor-sharp reflexes, pragmatic grit, and urban resilience.',
				quote: 'Navigating the Duplex tunnel requires nerves of steel and exact lane discipline.',
				traits: {
					'Urban Reflexes': 98,
					'Congestion Navigation': 94,
					'Subterranean Mastery': 91,
					'Leisurely Wandering': 4
				},
				compatibility: 'L’Autoroute du Nord (A1), L’Autoroute de Normandie (A13)',
				incompatibility: 'La Méridienne (A75)'
			},
			a13_normandie: {
				name: 'L’Autoroute de Normandie (A13)',
				tagline: 'Historic toll-free pioneer and weekend escapes toward misty coastal cliffs',
				description: 'France’s historic first autoroute from 1946! Connecting Paris to Rouen and the beaches of Deauville, you embody weekend getaways, lush cider orchards, and breezy coastal freedom.',
				quote: 'Friday evening departure; Sunday sunset return with fresh sea breeze in the air.',
				traits: {
					'Weekend Escape': 96,
					'Historic Heritage': 93,
					'Coastal Affinity': 90,
					'Heavy Freight Duty': 8
				},
				compatibility: 'L’Autoroute du Soleil (A6 / A7), La Provençale (A8)',
				incompatibility: 'Le Superpériphérique (A86)'
			},
			a8_provencale: {
				name: 'La Provençale (A8 / Côte d’Azur)',
				tagline: 'Glamorous coastal twists, viaducts above the sea, and Italian gateway',
				description: 'Winding through the red Esterel mountains and overlooking the azure waters between Cannes, Nice, and Monaco, you deliver dramatic vistas, luxury speed, and Mediterranean passion.',
				quote: 'Red rock cliffs on the left, glittering azure waves on the right: pure driving drama.',
				traits: {
					'Coastal Glamour': 97,
					'Topographical Drama': 94,
					'Mediterranean Passion': 91,
					'Industrial Monotony': 3
				},
				compatibility: 'L’Autoroute du Soleil (A6 / A7), La Méridienne (A75)',
				incompatibility: 'L’Autoroute du Nord (A1)'
			}
		},
		questions: [
			{
				id: 'q1',
				text: 'What kind of journey captures your ideal driving experience?',
				variants: {
					OPTIMISTIC: 'You turn the ignition key! Where does your dream road trip lead?',
					ANALYTICAL: 'Select your preferred geographical transit route and environmental profile.'
				},
				options: [
					{ label: 'A grand summer migration heading south toward lavender fields and the warm Mediterranean coast.', scores: { a6_soleil: 3, a8_provencale: 1 } },
					{ label: 'A fast, high-density industrial run across northern plains with maximum logistical precision.', scores: { a1_nord: 3, a86_superperipherique: 1 } },
					{ label: 'An epic high-altitude mountain climb across the Massif Central soaring over the Millau Viaduct.', scores: { a75_meridienne: 3, a8_provencale: 1 } },
					{ label: 'A dynamic tactical commute navigating subterranean double-decker tunnels around the capital.', scores: { a86_superperipherique: 3, a1_nord: 1 } },
					{ label: 'A spontaneous weekend road trip toward misty Normandy cliffs, cider houses, and sea breeze.', scores: { a13_normandie: 3, a6_soleil: 1 } },
					{ label: 'Winding along breathtaking coastal cliffs between the red Esterel mountains and Monaco.', scores: { a8_provencale: 3, a6_soleil: 1 } }
				]
			},
			{
				id: 'q2',
				text: 'How do you handle highway rest stops (aires d’autoroute) during long journeys?',
				variants: {
					OPTIMISTIC: 'Time for a break on the road! What is your rest stop ritual?',
					ANALYTICAL: 'Operational pause at service area. Select your replenishment protocol.'
				},
				options: [
					{ label: 'A relaxed picnic on the grassy knoll with local saucisson, fresh baguette, and family chatter.', scores: { a6_soleil: 3, a13_normandie: 1 } },
					{ label: 'A 3-minute espresso shot at the fuel pump counter; back in the driver’s seat with zero wasted time.', scores: { a1_nord: 3, a86_superperipherique: 1 } },
					{ label: 'Stop at an observatory belvedere to gaze across deep mountain gorges and monumental viaducts.', scores: { a75_meridienne: 3, a8_provencale: 1 } },
					{ label: 'No rest stops needed; power straight through the tunnel to beat the evening congestion wave.', scores: { a86_superperipherique: 3, a1_nord: 1 } },
					{ label: 'A quiet stop under apple trees before grabbing fresh pastries at a regional Normandy farm stand.', scores: { a13_normandie: 3, a6_soleil: 1 } },
					{ label: 'A sunlit terrace overlooking the azure sea sipping an espresso with sunglasses on.', scores: { a8_provencale: 3, a6_soleil: 1 } }
				]
			},
			{
				id: 'q3',
				text: 'What is your perspective on toll booths (péages) versus free bypass routes?',
				variants: {
					OPTIMISTIC: 'Télépéage barrier ahead! What is your toll-booth philosophy?',
					ANALYTICAL: 'Toll plaza tariff evaluation: select your cost-versus-speed optimization policy.'
				},
				options: [
					{ label: 'Toll-free mountain passes with pure engineering grandeur like the A75 are the true soul of driving.', scores: { a75_meridienne: 3, a13_normandie: 1 } },
					{ label: 'Happy to pay tolls with Télépéage 30 km/h transponder for smooth, wide multi-lane sunlit highways.', scores: { a6_soleil: 3, a8_provencale: 1 } },
					{ label: 'Pay whatever it takes to enter the specialized Duplex tunnel and bypass urban gridlock.', scores: { a86_superperipherique: 3, a1_nord: 1 } },
					{ label: 'Commercial freight tolls are an operational business expense; throughput is everything.', scores: { a1_nord: 3, a86_superperipherique: 1 } },
					{ label: 'Historic free-flow sections near coastal estuaries are the most pleasant way to cruise.', scores: { a13_normandie: 3, a75_meridienne: 1 } },
					{ label: 'Tolls are part of the coastal glamour when driving past Cannes and the Riviera cliffs.', scores: { a8_provencale: 3, a6_soleil: 1 } }
				]
			},
			{
				id: 'q4',
				text: 'A sudden traffic bottleneck (bouchon) appears ahead! What is your reaction?',
				variants: {
					OPTIMISTIC: 'Red brake lights as far as the eye can see! How do you keep your cool?',
					ANALYTICAL: 'Throughput bottleneck detected on downstream segment. State your mitigation policy.'
				},
				options: [
					{ label: 'Tune into Radio 107.7 FM, roll down the windows, and enjoy the summer music playlist.', scores: { a6_soleil: 3, a13_normandie: 1 } },
					{ label: 'Recalculate alternate interchange bypasses and maintain tactical lane velocity.', scores: { a86_superperipherique: 3, a1_nord: 1 } },
					{ label: 'Maintain steady following distance in the freight lane with professional logistical calm.', scores: { a1_nord: 3, a6_soleil: 1 } },
					{ label: 'Laugh, because you are cruising on a high-altitude mountain pass with zero congestion.', scores: { a75_meridienne: 3, a13_normandie: 1 } },
					{ label: 'Take the nearest departmental road exit to wander through scenic rural countryside villages.', scores: { a13_normandie: 3, a75_meridienne: 1 } },
					{ label: 'Enjoy the view of the Mediterranean sea while creeping along the coastal cliffs in style.', scores: { a8_provencale: 3, a6_soleil: 1 } }
				]
			},
			{
				id: 'q5',
				text: 'What soundtrack or radio broadcast plays through your car speakers on the highway?',
				variants: {
					OPTIMISTIC: 'What tunes accompany your road journey?',
					ANALYTICAL: 'Select your acoustic playback protocol and travel broadcast frequency.'
				},
				options: [
					{ label: '107.7 FM traffic updates mixed with classic French summer chanson and pop hits.', scores: { a6_soleil: 3, a13_normandie: 1 } },
					{ label: 'Fast electronic beats and dynamic news updates keeping focus razor-sharp.', scores: { a1_nord: 3, a86_superperipherique: 1 } },
					{ label: 'Epic orchestral symphonies echoing the vast scale of mountains and deep canyon viaducts.', scores: { a75_meridienne: 3, a8_provencale: 1 } },
					{ label: 'High-energy podcasts and GPS alerts guiding lane changes through tunnel networks.', scores: { a86_superperipherique: 3, a1_nord: 1 } },
					{ label: 'Mellow acoustic guitar and indie folk matching misty seaside cliffs and green hills.', scores: { a13_normandie: 3, a6_soleil: 1 } },
					{ label: 'Smooth Mediterranean lounge music and Italian disco playing toward sunset.', scores: { a8_provencale: 3, a6_soleil: 1 } }
				]
			},
			{
				id: 'q6',
				text: 'What is the ultimate purpose of an extraordinary highway network?',
				variants: {
					OPTIMISTIC: 'What makes a grand autoroute truly unforgettable?',
					ANALYTICAL: 'Evaluate the primary civil engineering objective of the highway infrastructure.'
				},
				options: [
					{ label: 'Connecting millions of families to sunny holiday horizons, shared laughter, and coastal rest.', scores: { a6_soleil: 3, a8_provencale: 1 } },
					{ label: 'Powering the economic pulse and industrial supply chain across borders day and night.', scores: { a1_nord: 3, a86_superperipherique: 1 } },
					{ label: 'Demonstrating human engineering mastery that harmonizes with wild mountainous terrain.', scores: { a75_meridienne: 3, a8_provencale: 1 } },
					{ label: 'Providing indispensable subterranean arteries that keep the heart of the metropolis beating.', scores: { a86_superperipherique: 3, a1_nord: 1 } },
					{ label: 'Offering breezy, accessible weekend escapes from everyday routine toward coastal peace.', scores: { a13_normandie: 3, a6_soleil: 1 } },
					{ label: 'Transforming asphalt and concrete into a breathtaking scenic canvas along sunlit cliffs.', scores: { a8_provencale: 3, a75_meridienne: 1 } }
				]
			}
		]
	};

	window.ClippyPersonalityRegistry.tests[testDefinition.id] = testDefinition;
})();
