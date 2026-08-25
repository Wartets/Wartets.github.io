(function () {
	'use strict';

	window.ClippyPersonalityRegistry = window.ClippyPersonalityRegistry || { tests: {} };

	const testDefinition = {
		id: 'star-wars',
		title: 'Galactic Force & Persona Alignment',
		subtitle: 'Space Opera Character Matrix',
		description: 'Evaluates your Force resonance, tactical doctrine, moral pragmatism, and loyalty under galactic pressure.',
		badge: 'Galactic Persona',
		archetypes: {
			master_yoda: {
				name: 'Grand Master Yoda (The Contemplative Sage)',
				tagline: 'Centuries of patience and luminous Force mastery',
				description: 'Small in stature yet profound in spirit, you look past superficial physical appearances to grasp deep fundamental truths. You teach through patience, riddles, and self-mastery.',
				quote: 'Size matters not. Look at me. Judge me by my size, do you?',
				traits: {
					'Force Attunement': 99,
					'Contemplative Wisdom': 94,
					'Subversive Humility': 89,
					'Impulsive Aggression': 5
				},
				compatibility: 'Master Obi-Wan Kenobi, The Astromech Hero (R2-D2)',
				incompatibility: 'The Chosen One (Anakin)'
			},
			anakin_vader: {
				name: 'The Chosen One (Anakin Skywalker / Vader)',
				tagline: 'Boundless raw power and intense passionate drive',
				description: 'You possess unmatched natural potential and passionate conviction. You refuse to accept limitations, pushing past conventional boundaries to protect those you care about at any cost.',
				quote: 'You underestimate my power!',
				traits: {
					'Raw Kinetic Potential': 98,
					'Passionate Intensity': 95,
					'Direct Intervention': 90,
					'Stoic Detachment': 8
				},
				compatibility: 'The Astromech Hero (R2-D2), The Smuggler (Han Solo)',
				incompatibility: 'Grand Master Yoda'
			},
			obi_wan: {
				name: 'Master Obi-Wan Kenobi (The High Ground Guardian)',
				tagline: 'Soresu defensive mastery and principled negotiation',
				description: 'You are the quintessential Jedi Master: patient, witty, disciplined, and steadfast in the face of tragedy. You hold the moral high ground and turn enemy overconfidence into your greatest asset.',
				quote: 'In my experience, there is no such thing as luck.',
				traits: {
					'Defensive Mastery (Soresu)': 96,
					'Diplomatic Wit': 92,
					'Unwavering Duty': 90,
					'Selfish Ambition': 6
				},
				compatibility: 'Grand Master Yoda, The Astromech Hero (R2-D2)',
				incompatibility: 'Grand Admiral Thrawn'
			},
			han_solo: {
				name: 'The Smuggler (Han Solo)',
				tagline: 'Pragmatic improvisation and heroic skepticism',
				description: 'You pretend to care only about credits and survival, but when the galaxy is on the line, you fly the Millennium Falcon straight into the firefight. You make the Kessel Run in less than twelve parsecs.',
				quote: 'Never tell me the odds!',
				traits: {
					'Tactical Improvisation': 96,
					'Calculated Bravado': 91,
					'Underdog Loyalty': 89,
					'Dogmatic Ritualism': 4
				},
				compatibility: 'The Astromech Hero (R2-D2), The Chosen One (Anakin)',
				incompatibility: 'Grand Admiral Thrawn'
			},
			admiral_thrawn: {
				name: 'Grand Admiral Thrawn (The Master Tactician)',
				tagline: 'Artistic deduction and flawless strategic synthesis',
				description: 'You defeat adversaries not through brute force, but by analyzing their philosophy, art, and cognitive biases. You are calm, impeccably polite, and always five moves ahead.',
				quote: 'To defeat an enemy, you must know them. Not simply their battle tactics, but their history, philosophy, art.',
				traits: {
					'Strategic Synthesis': 98,
					'Analytical Deduction': 96,
					'Composed Precision': 92,
					'Emotional Volatility': 4
				},
				compatibility: 'The Astromech Hero (R2-D2), Master Obi-Wan Kenobi',
				incompatibility: 'The Smuggler (Han Solo)'
			},
			r2_d2: {
				name: 'The Astromech Hero (R2-D2)',
				tagline: 'Indispensable technical genius and fearless loyalty',
				description: 'Armed with a scomp link, jet boosters, and a sassy binary whistle, you quietly save the entire galaxy in every critical moment while the organics argue in the corridor.',
				quote: '*cheerful determined binary trills and electro-shock sparks*',
				traits: {
					'System Override': 99,
					'Fearless Utility': 95,
					'Unshakable Loyalty': 93,
					'Superficial Vanity': 2
				},
				compatibility: 'The Smuggler (Han Solo), Master Obi-Wan Kenobi',
				incompatibility: 'Grand Admiral Thrawn'
			}
		},
		questions: [
			{
				id: 'q1',
				text: 'A planetary blockade traps your ship in orbit. What is your flight plan?',
				variants: {
					OPTIMISTIC: 'Star destroyers on the radar! How do you break the blockade?',
					ANALYTICAL: 'Hostile orbital blockade detected. Select your tactical escape vector.'
				},
				options: [
					{ label: 'Fly straight into the asteroid field; let manual piloting reflexes outrun the odds.', scores: { han_solo: 3, anakin_vader: 1 } },
					{ label: 'Jack into the ship’s hyperdrive computer directly, bypassing security protocols in seconds.', scores: { r2_d2: 3, han_solo: 1 } },
					{ label: 'Analyze the enemy flagship’s defensive vector gaps and execute a precise surgical bypass.', scores: { admiral_thrawn: 3, obi_wan: 1 } },
					{ label: 'Engage full sublight thrusters and lead a daring starfighter dive directly through the command deck.', scores: { anakin_vader: 3, han_solo: 1 } },
					{ label: 'Use diplomatic channels or mental influence to create confusion among the picket fleet.', scores: { obi_wan: 3, master_yoda: 1 } },
					{ label: 'Close your eyes, reach into the living Force, and guide the vessel through the unseen path.', scores: { master_yoda: 3, obi_wan: 1 } }
				]
			},
			{
				id: 'q2',
				text: 'What lightsaber combat form or tactical doctrine matches your martial philosophy?',
				variants: {
					OPTIMISTIC: 'Ignite your lightsaber! What combat form defines your blade?',
					ANALYTICAL: 'Select your preferred lightsaber form or combat engagement heuristic.'
				},
				options: [
					{ label: 'Form III (Soresu): Impenetrable defensive resilience that waits for the opponent to exhaust themselves.', scores: { obi_wan: 3, master_yoda: 1 } },
					{ label: 'Form IV (Ataru): Acrobatic, high-velocity kinetic strikes that defy expectations of size and age.', scores: { master_yoda: 3, anakin_vader: 1 } },
					{ label: 'Form V (Djem So): Overwhelming counter-attack force that turns enemy strikes into crushing blows.', scores: { anakin_vader: 3, han_solo: 1 } },
					{ label: 'Fast-draw heavy blaster pistol from the hip before the enemy even finishes igniting their blade.', scores: { han_solo: 3, r2_d2: 1 } },
					{ label: 'Multi-spectrum astromech gadgets: oil slicks, arc welders, and emergency fire extinguishers.', scores: { r2_d2: 3, han_solo: 1 } },
					{ label: 'Three-dimensional tactical encirclement supported by disciplined crossfire and air superiority.', scores: { admiral_thrawn: 3, obi_wan: 1 } }
				]
			},
			{
				id: 'q3',
				text: 'How do you handle a student, apprentice, or junior colleague who is struggling?',
				variants: {
					OPTIMISTIC: 'A padawan is facing doubt! How do you guide their journey?',
					ANALYTICAL: 'Subordinate learning deficiency observed. Select your instructional protocol.'
				},
				options: [
					{ label: 'Speak in evocative parables, challenge their assumptions, and make them lift rocks in a swamp.', scores: { master_yoda: 3, obi_wan: 1 } },
					{ label: 'Offer calm, patient encouragement, gentle teasing, and lead by unwavering personal example.', scores: { obi_wan: 3, master_yoda: 1 } },
					{ label: 'Show them how to push past their fear and unleash their full, unbridled inner strength.', scores: { anakin_vader: 3, han_solo: 1 } },
					{ label: 'Give them the wrench, put them in the pilot seat, and let them learn through real turbulence.', scores: { han_solo: 3, r2_d2: 1 } },
					{ label: 'Examine their psychological baseline and craft a tailored simulation that turns weakness into asset.', scores: { admiral_thrawn: 3, obi_wan: 1 } },
					{ label: 'Beep encouragingly, fix their broken code silently in the background, and roll forward.', scores: { r2_d2: 3, master_yoda: 1 } }
				]
			},
			{
				id: 'q4',
				text: 'What is your core view regarding "Destiny" versus "Choice"?',
				variants: {
					OPTIMISTIC: 'Does the Force control your destiny, or do you forge your own path?',
					ANALYTICAL: 'Determinism versus agency evaluation in galactic state dynamics.'
				},
				options: [
					{ label: 'The Force binds the galaxy together; we must listen to its will and maintain cosmic balance.', scores: { master_yoda: 3, obi_wan: 1 } },
					{ label: 'Destiny is an obstacle for those too weak to shape their own fate with sufficient power.', scores: { anakin_vader: 3, admiral_thrawn: 1 } },
					{ label: 'We have a duty to stand for honor and justice, regardless of what prophecy decrees.', scores: { obi_wan: 3, master_yoda: 1 } },
					{ label: 'Mystical mumbo-jumbo doesn’t guide my life; a good blaster and fast engines do.', scores: { han_solo: 3, r2_d2: 1 } },
					{ label: 'Outcomes are governed by cultural, psychological, and logistical variables, not destiny.', scores: { admiral_thrawn: 3, obi_wan: 1 } },
					{ label: 'Just keep the ship flying, the doors open, and the trash compactors shut off.', scores: { r2_d2: 3, han_solo: 1 } }
				]
			},
			{
				id: 'q5',
				text: 'You are offered immense power that requires crossing ethical boundaries. What do you do?',
				variants: {
					OPTIMISTIC: 'The dark side whispers easy shortcuts! How do you answer?',
					ANALYTICAL: 'High-utility power offered with ethical boundary breach. State your choice.'
				},
				options: [
					{ label: 'Reject it outright. The quick and easy path leads only to suffering and spiritual ruin.', scores: { master_yoda: 3, obi_wan: 1 } },
					{ label: 'Consider it if it is the only possible way to save the people you love from destruction.', scores: { anakin_vader: 3, han_solo: 1 } },
					{ label: 'Stand firm on the high ground; compromising virtue compromises the entire cause.', scores: { obi_wan: 3, master_yoda: 1 } },
					{ label: 'Pass. Absolute power sounds like way too many meetings and constant assassination attempts.', scores: { han_solo: 3, r2_d2: 1 } },
					{ label: 'Study the mechanism dispassionately to understand how your opponents might wield it.', scores: { admiral_thrawn: 3, obi_wan: 1 } },
					{ label: 'Shock the power conduit with an electric probe and roll out of the room whistling.', scores: { r2_d2: 3, han_solo: 1 } }
				]
			},
			{
				id: 'q6',
				text: 'When all hope seems lost in the final hour, what sparks your resurgence?',
				variants: {
					OPTIMISTIC: 'The Death Star is charging its laser! What reignites your flame?',
					ANALYTICAL: 'Terminal scenario with zero predicted win probability. Identify your resurgence trigger.'
				},
				options: [
					{ label: 'Luminous beings are we, not this crude matter. The Force will be with you, always.', scores: { master_yoda: 3, obi_wan: 1 } },
					{ label: 'Refusing to surrender; summoning every ounce of passion to break the impossible barrier.', scores: { anakin_vader: 3, han_solo: 1 } },
					{ label: 'Unshakable trust in your friends, your training, and the enduring light of truth.', scores: { obi_wan: 3, master_yoda: 1 } },
					{ label: 'Turning the ship around and diving straight into the trench with twin blasters firing.', scores: { han_solo: 3, anakin_vader: 1 } },
					{ label: 'The satisfaction of watching your contingency plan execute with flawless precision.', scores: { admiral_thrawn: 3, obi_wan: 1 } },
					{ label: 'Overriding the blast doors at the exact second to let your allies escape.', scores: { r2_d2: 3, han_solo: 1 } }
				]
			}
		]
	};

	window.ClippyPersonalityRegistry.tests[testDefinition.id] = testDefinition;
})();
