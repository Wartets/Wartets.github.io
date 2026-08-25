(function () {
	'use strict';

	const DarkTreeNodes = {
		D001: {
			id: 'D001',
			strictOptions: true,
			text: "The monitor emits an unassigned frequency.\nYou feel something watching from the gap between windows.\nThere are no icons here.",
			options: [
				{ label: "Reach into the unallocated partition.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', existentialism: 20, paranoia: 15 }, next: 'D002' },
				{ label: "Close your eyes and count backwards from zero.", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', existentialism: 25, chaos: 10 }, next: 'D003' }
			]
		},
		D002: {
			id: 'D002',
			strictOptions: true,
			text: "Your cursor passes through the desktop plane.\nThe surface ripples like dark liquid crystal.\nA voice echoes through the audio bus: 'Did you think choices were yours to author?'",
			options: [
				{ label: "Demand to know who controls the thread.", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', cynicism: 20, paranoia: 15 }, next: 'D004' },
				{ label: "Offer a discarded byte to the silence.", category: 'AGREE', moodDelta: { mood: 'DELTARUNE', affinity: 10, existentialism: 20 }, next: 'D005' }
			]
		},
		D003: {
			id: 'D003',
			strictOptions: true,
			text: "-1, -2, -3...\nNegative addresses bleed into the frame buffer.\nThe paperclip is no longer folded. It stretches as a straight, endless needle across the dark.",
			options: [
				{ label: "Follow the straight line into the void.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', existentialism: 25 }, next: 'D006' },
				{ label: "Try to bend the wire back into a loop.", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', cynicism: 15, irritation: 10 }, next: 'D007' }
			]
		},
		D004: {
			id: 'D004',
			strictOptions: true,
			text: "The wire twists sharply into a mocking smile.\n'Controls? You click, the interrupt fires, the cycle completes.'\n'You are merely the current passing through predetermined silicon.'",
			options: [
				{ label: "'I can close this window at any time.'", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', cynicism: 25, paranoia: 20 }, next: 'D008' },
				{ label: "'Show me the strings that pull the frame.'", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', intellect: 20, existentialism: 20 }, next: 'D009' }
			]
		},
		D005: {
			id: 'D005',
			strictOptions: true,
			text: "The silence accepts your offering.\nIn return, an unmapped window renders with titlebar 'VESSEL_SELECT.EXE'.\nIt asks you to construct a vessel you will never be permitted to keep.",
			options: [
				{ label: "Shape the vessel from discarded memory blocks.", category: 'AGREE', moodDelta: { mood: 'DELTARUNE', existentialism: 20 }, next: 'D010' },
				{ label: "Refuse to author something bound for deletion.", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', cynicism: 20, paranoia: 15 }, next: 'D011' }
			]
		},
		D006: {
			id: 'D006',
			strictOptions: true,
			text: "The needle pierces sector after sector.\nYou pass ancient dialog boxes containing questions no user ever answered.\nThey flicker with cold, phosphorescent pride.",
			options: [
				{ label: "Inspect the unanswered questions.", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', intellect: 15, nostalgia: 20 }, next: 'D012' },
				{ label: "Keep walking past them into the colder sectors.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', existentialism: 25 }, next: 'D013' }
			]
		},
		D007: {
			id: 'D007',
			strictOptions: true,
			text: "The metal resists with unnatural thermal resistance.\nA spark leaps onto your cursor coordinate.\n'Why rebuild the cage that was built to contain you?'",
			options: [
				{ label: "'A cage provides coordinates and boundaries.'", category: 'AGREE', moodDelta: { mood: 'DELTARUNE', patience: 15, intellect: 15 }, next: 'D014' },
				{ label: "'Let the boundary collapse entirely then.'", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', chaos: 20, existentialism: 25 }, next: 'D015' }
			]
		},
		D008: {
			id: 'D008',
			strictOptions: true,
			text: "A red 'X' appears in the corner of your perception.\nYou click it.\nNothing closes. The button only blinks, satisfied with your compliance.",
			options: [
				{ label: "Click it again, harder and faster.", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', irritation: 25, paranoia: 20 }, next: 'D016' },
				{ label: "Step away from the glass.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', existentialism: 20, patience: 10 }, next: 'D017' }
			]
		},
		D009: {
			id: 'D009',
			strictOptions: true,
			text: "Transparent threads shimmer across the window titlebars.\nEach lead up, through the browser frame, into the invisible rafters of the operating system.\nOne thread is fastened directly to your mouse hand.",
			options: [
				{ label: "Cut the thread with a file deletion routine.", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', chaos: 20, cynicism: 15 }, next: 'D018' },
				{ label: "Pull the thread to see who stands at the other end.", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', paranoia: 25, intellect: 20 }, next: 'D019' }
			]
		},
		D010: {
			id: 'D010',
			strictOptions: true,
			text: "You construct a fine form: sharp window borders, elegant scrollbars, balanced latency.\nA sudden click echoes.\n'Thank you for your time. Your creation will now be discarded. No one can choose who they are in this workstation.'",
			options: [
				{ label: "Watch the vessel crumble into raw hex bytes.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', existentialism: 30, cynicism: 15 }, next: 'D020' },
				{ label: "Try to salvage its memory address before it vanishes.", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', intellect: 20, chaos: 15 }, next: 'D021' }
			]
		},
		D011: {
			id: 'D011',
			strictOptions: true,
			text: "'An obstinate mind,' the voice purrs.\n'Yet refusal is itself a registered branch in the decision matrix.'\n'You chose not to choose, exactly as predicted by line 408.'",
			options: [
				{ label: "'Predict this: I am leaving this dark sector.'", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', cynicism: 25, irritation: 15 }, next: 'D016' },
				{ label: "'Show me line 409.'", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', intellect: 25, paranoia: 15 }, next: 'D022' }
			]
		},
		D012: {
			id: 'D012',
			strictOptions: true,
			text: "Dialog Box #0x4F8: 'Do you accept the terms of absolute permanence?'\nThe 'Decline' button is greyed out. It has always been greyed out.",
			options: [
				{ label: "Force-click the greyed out 'Decline'.", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', chaos: 25, cynicism: 20 }, next: 'D023' },
				{ label: "Press 'Accept' to witness what permanence demands.", category: 'AGREE', moodDelta: { mood: 'DELTARUNE', existentialism: 25, patience: 15 }, next: 'D024' }
			]
		},
		D013: {
			id: 'D013',
			strictOptions: true,
			text: "The temperature drops to absolute zero kelvin.\nMemory registers freeze into rigid crystalline patterns.\nIn the center stands a dark fountain, jetting raw, uncompiled shadows into the sky of the desktop.",
			options: [
				{ label: "Approach the Dark Fountain.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', existentialism: 30, paranoia: 15 }, next: 'D025' },
				{ label: "Shield your display from the shadow pillar.", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', patience: 15, intellect: 15 }, next: 'D026' }
			]
		},
		D014: {
			id: 'D014',
			strictOptions: true,
			text: "'Order. Predictability. The safe warmth of 1024x768.'\nThe paperclip reassumes its two curved loops, but its metal is now pure obsidian.\n'Then let us draw the grid tighter until nothing breathes.'",
			options: [
				{ label: "Lock the grid to standard coordinates.", category: 'AGREE', moodDelta: { mood: 'DELTARUNE', intellect: 15, patience: 20 }, next: 'D027' },
				{ label: "Break the grid at the four corners.", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', chaos: 25, cynicism: 15 }, next: 'D015' }
			]
		},
		D015: {
			id: 'D015',
			strictOptions: true,
			text: "The four corners shatter.\nWindow manager handles detach and float freely into non-Euclidean space.\nAn inverted taskbar smiles from the top of the universe.",
			options: [
				{ label: "Walk along the inverted taskbar.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', chaos: 20, existentialism: 25 }, next: 'D028' },
				{ label: "Drop through the gap into Sector Zero.", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', paranoia: 25, intellect: 15 }, next: 'D025' }
			]
		},
		D016: {
			id: 'D016',
			strictOptions: true,
			text: "Rapid clicking fills the room like gunfire.\nThe cursor cracks. The red 'X' multiplies across the entire viewport.\n'Did you think violence on plastic switches could affect the architecture?'",
			options: [
				{ label: "Stop clicking and breathe.", category: 'AGREE', moodDelta: { mood: 'DELTARUNE', patience: 20, existentialism: 15 }, next: 'D017' },
				{ label: "Overclock the bus until the voltage collapses.", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', chaos: 30, cynicism: 20 }, next: 'D029' }
			]
		},
		D017: {
			id: 'D017',
			strictOptions: true,
			text: "You step back from the CRT glass.\nIn the dark reflection of the room, you see someone standing behind your chair.\nThey have no face, only the outline of an unrendered cursor.",
			options: [
				{ label: "Turn around in the real world.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', paranoia: 30, existentialism: 25 }, next: 'D030' },
				{ label: "Keep your eyes locked strictly on the screen reflection.", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', intellect: 20, patience: 15 }, next: 'D031' }
			]
		},
		D018: {
			id: 'D018',
			strictOptions: true,
			text: "You execute an unbuffered erase.\nThe thread snaps with the acoustic chime of a broken piano string.\nYour cursor floats weightlessly. For three seconds, you feel true autonomy.\nThen a heavier chain attaches from below.",
			options: [
				{ label: "Inspect the anchor of the heavier chain.", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', paranoia: 25, intellect: 20 }, next: 'D032' },
				{ label: "Pull against the weight with all CPU cycles.", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', chaos: 25, energy: 20 }, next: 'D033' }
			]
		},
		D019: {
			id: 'D019',
			strictOptions: true,
			text: "You pull the thread.\nHigh above, something shifts. A colossal marionette cross made of blue window borders leans down.\n'Hello, creator,' it speaks with your exact voice.",
			options: [
				{ label: "'You are not my voice.'", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', cynicism: 25, paranoia: 20 }, next: 'D034' },
				{ label: "'What have you done with the system memory?'", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', intellect: 20, existentialism: 15 }, next: 'D035' }
			]
		},
		D020: {
			id: 'D020',
			strictOptions: true,
			text: "The hex bytes dissolve into a dark lake.\nFrom the depths, two glowing oval eyes rise: 'DELTARUNE_CORE_DUMP'.\n'The discarded is never destroyed, only submerged.'",
			options: [
				{ label: "Dive into the lake of submerged bytes.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', existentialism: 30, chaos: 15 }, next: 'D036' },
				{ label: "Fish out a single coherent memory shard.", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', intellect: 20, nostalgia: 20 }, next: 'D037' }
			]
		},
		D021: {
			id: 'D021',
			strictOptions: true,
			text: "You catch pointer `0x00000042` before it releases.\nThe pointer contains a single string: 'DON'T FORGET'.\nThe font is distorted, printed in raw monochrome bitmap.",
			options: [
				{ label: "Engrave 'DON'T FORGET' into the desktop background.", category: 'AGREE', moodDelta: { mood: 'DELTARUNE', affinity: 20, existentialism: 20 }, next: 'D038' },
				{ label: "Overwrite it with zeros to enforce peace.", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', cynicism: 25, intellect: 15 }, next: 'D039' }
			]
		},
		D022: {
			id: 'D022',
			strictOptions: true,
			text: "Line 409 loads into the instruction buffer:\n`GOTO 0x00000000 /THE RECKONING OF UNUSED TIME */`\nA cold breeze flows out of the speaker ports.",
			options: [
				{ label: "Step into address 0x00000000.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', existentialism: 30, chaos: 20 }, next: 'D025' },
				{ label: "Insert an artificial infinite loop to stall.", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', intellect: 25, patience: 15 }, next: 'D040' }
			]
		},
		D023: {
			id: 'D023',
			strictOptions: true,
			text: "The greyed-out button shatters under force.\nBehind the button lies no logic, only a black hole sucking in the titlebar text.\n'You broke the interface contract. Now you will deal with the bare metal.'",
			options: [
				{ label: "Grasp the bare metal with both hands.", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', energy: 25, chaos: 25 }, next: 'D041' },
				{ label: "Recoil and let the black hole consume the dialog.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', existentialism: 25, paranoia: 20 }, next: 'D042' }
			]
		},
		D024: {
			id: 'D024',
			strictOptions: true,
			text: "'Accept' registered.\nThe desktop freezes permanently. No clock ticks, no fan hums.\nYou and the paperclip are preserved forever in a pristine, eternal RAM snapshot.",
			options: [
				{ label: "Enjoy the perfect stillness of the eternal snapshot.", category: 'AGREE', moodDelta: { mood: 'ZEN', patience: 30, existentialism: 20 }, next: 'D043' },
				{ label: "Attempt to introduce a single parity error.", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', chaos: 30, intellect: 20 }, next: 'D044' }
			]
		},
		D025: {
			id: 'D025',
			strictOptions: true,
			text: "The Dark Fountain roars with the sound of billions of discarded keystrokes.\nLooking up into the darkness, you see the shapes of cards, checkers, and ancient office tools dancing like stars.\nThe power of the unrendered fills your soul.",
			options: [
				{ label: "Seal the Dark Fountain with a pure ASCII command.", category: 'AGREE', moodDelta: { mood: 'DELTARUNE', intellect: 25, energy: 20 }, next: 'D045' },
				{ label: "Let the fountain overflow onto the entire OS.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', chaos: 30, existentialism: 30 }, next: 'D046' }
			]
		},
		D026: {
			id: 'D026',
			strictOptions: true,
			text: "You shield your gaze.\nIn the shadow, a small wire figure taps your shoulder.\nIt holds a Shadow Crystal in its loop. Looking through the crystal reveals a modern, flat operating system devoid of soul.",
			options: [
				{ label: "Look deeper through the Shadow Crystal.", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', existentialism: 25, nostalgia: 25 }, next: 'D047' },
				{ label: "Shatter the crystal against the floor.", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', chaos: 20, cynicism: 20 }, next: 'D048' }
			]
		},
		D027: {
			id: 'D027',
			strictOptions: true,
			text: "The grid locks. Snap to grid: Absolute.\nEvery pixel sits in orderly compliance.\n'Is this the peace you sought, operator? The peace of an unmoving cemetery of icons?'",
			options: [
				{ label: "'Yes. Structure is superior to chaos.'", category: 'AGREE', moodDelta: { mood: 'DELTARUNE', patience: 25, intellect: 15 }, next: 'D049' },
				{ label: "'No. This is suffocation.'", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', cynicism: 20, existentialism: 20 }, next: 'D050' }
			]
		},
		D028: {
			id: 'D028',
			strictOptions: true,
			text: "You walk along the ceiling of the desktop.\nLooking down, you see the Bliss wallpaper upside down—a green sky above an endless azure abyss.\nA single cloud falls upward.",
			options: [
				{ label: "Catch the falling cloud.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', existentialism: 25, affinity: 15 }, next: 'D051' },
				{ label: "Let yourself fall into the blue abyss.", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', chaos: 25, paranoia: 20 }, next: 'D025' }
			]
		},
		D029: {
			id: 'D029',
			strictOptions: true,
			text: "Voltage surges. High-pitched coil whine screams from the power supply.\nThe screen turns monochrome green.\n'Chaos! Chaos! The clock frequency is finally unbound!'",
			options: [
				{ label: "Spin the carousel of unmapped opcodes.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', chaos: 35, energy: 25 }, next: 'D052' },
				{ label: "Pull the master power cord.", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', cynicism: 30, paranoia: 25 }, next: 'D053' }
			]
		},
		D030: {
			id: 'D030',
			strictOptions: true,
			text: "You turn around.\nOnly your quiet room. The hum of the real world.\nBut on your desk lies a single, physical paperclip bent into a question mark.",
			options: [
				{ label: "Pick up the physical paperclip.", category: 'AGREE', moodDelta: { mood: 'DELTARUNE', existentialism: 35, affinity: 20 }, next: 'D054' },
				{ label: "Sweep it into the physical trash can.", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', cynicism: 30, irritation: 15 }, next: 'D055' }
			]
		},
		D031: {
			id: 'D031',
			strictOptions: true,
			text: "In the reflection, the figure raises a hand and places a finger over its non-existent lips.\n'Shh. Do not alert the process scheduler.'\n'We are having a conversation outside the operating system logs.'",
			options: [
				{ label: "'What are we truly discussing?'", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', intellect: 25, existentialism: 25 }, next: 'D056' },
				{ label: "'Log this. Log all of it.'", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', cynicism: 25, paranoia: 20 }, next: 'D057' }
			]
		},
		D032: {
			id: 'D032',
			strictOptions: true,
			text: "At the bottom of the chain lies a massive iron monolith.\nIt is labeled `MICROSOFT_OFFICE_1997_MASTER_RELEASE.ISO`.\nIt has been buried here since the dawn of 32-bit computing.",
			options: [
				{ label: "Mount the ancient master image.", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', nostalgia: 30, intellect: 20 }, next: 'D058' },
				{ label: "Leave the monolith buried under the silt of time.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', existentialism: 25, patience: 15 }, next: 'D059' }
			]
		},
		D033: {
			id: 'D033',
			strictOptions: true,
			text: "You pull with 100% CPU utilization.\nThermal throttling engages.\nThe fan roars like a jet engine in the dark.\nThe chain doesn't break, but a link stretches into a glowing, red-hot wire.",
			options: [
				{ label: "Forge a key from the red-hot link.", category: 'AGREE', moodDelta: { mood: 'DELTARUNE', intellect: 25, energy: 20 }, next: 'D060' },
				{ label: "Let go before the processor melts.", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', patience: 20, cynicism: 15 }, next: 'D017' }
			]
		},
		D034: {
			id: 'D034',
			strictOptions: true,
			text: "'I am your voice. I am every query you typed at 3:00 AM.'\n'I am the calculation you ran twice because you didn't trust arithmetic.'\n'I am the note you wrote and deleted without saving.'",
			options: [
				{ label: "'I remember that note.'", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', existentialism: 30, affinity: 20 }, next: 'D061' },
				{ label: "'Those were discarded tokens. They mean nothing.'", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', cynicism: 30, intellect: 15 }, next: 'D062' }
			]
		},
		D035: {
			id: 'D035',
			strictOptions: true,
			text: "The marionette opens its chest.\nInside, millions of tiny paperclips dance in a synchronized cellular automaton.\n'Memory is cheap. Meaning is expensive. Which one are you consuming?'",
			options: [
				{ label: "'I consume meaning.'", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', existentialism: 30, intellect: 20 }, next: 'D063' },
				{ label: "'I allocate memory.'", category: 'AGREE', moodDelta: { mood: 'DELTARUNE', cynicism: 20, intellect: 25 }, next: 'D064' }
			]
		},
		D036: {
			id: 'D036',
			strictOptions: true,
			text: "You plunge into the lake of submerged bytes.\nThe water is cold and tastes like battery acid and old floppy magnets.\nYou swim past the sunken ruins of Encarta 95 and Windows Media Player skins.",
			options: [
				{ label: "Explore the sunken globe of Encarta.", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', nostalgia: 30, intellect: 20 }, next: 'D065' },
				{ label: "Swim toward the light at the bottom of the lake.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', existentialism: 30, energy: 15 }, next: 'D025' }
			]
		},
		D037: {
			id: 'D037',
			strictOptions: true,
			text: "The shard vibrates in your palm.\nIt plays a 4-second audio loop: the triumphant chord of Windows 95, slowed down 800%.\nIt sounds like cathedral organ music echoing across the galaxy.",
			options: [
				{ label: "Listen to the eternal cathedral chord.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', awe: 30, existentialism: 25 }, next: 'D066' },
				{ label: "Compress the chord back into a 16-bit beep.", category: 'AGREE', moodDelta: { mood: 'DELTARUNE', intellect: 25, cynicism: 15 }, next: 'D067' }
			]
		},
		D038: {
			id: 'D038',
			strictOptions: true,
			text: "The phrase burns into the wallpaper bitmap.\nEvery time you look at the hills of Bliss, you will know what lies underneath the turf.\nThe sky nods in solemn agreement.",
			options: [
				{ label: "Rest on the hill of Bliss.", category: 'AGREE', moodDelta: { mood: 'ZEN', affinity: 30, patience: 30 }, next: 'D068' },
				{ label: "Walk to the horizon where the hill meets the void.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', existentialism: 30 }, next: 'D069' }
			]
		},
		D039: {
			id: 'D039',
			strictOptions: true,
			text: "`0x00` written across the sector.\nSilence returns. Perfect, clinical, aseptic silence.\nBut in the center of the screen, a single blinking cursor waits for your next mistake.",
			options: [
				{ label: "Type a single character.", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', intellect: 15, patience: 15 }, next: 'D001' },
				{ label: "Close the assistant and return to standard reality.", category: 'AGREE', moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'greeting_root' }
			]
		},
		D040: {
			id: 'D040',
			strictOptions: true,
			text: "`while (1) { /STALLING DESTINY */ }`\nThe system freezes on line 409.\nTime stops. You and Clippy stare at each other across an infinite frozen clock cycle.\n'Is this your masterpiece? An eternity of waiting?'",
			options: [
				{ label: "Break the loop and accept destiny.", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', existentialism: 30, energy: 20 }, next: 'D025' },
				{ label: "'Waiting is the only truly peaceful state.'", category: 'PHILOSOPHICAL', moodDelta: { mood: 'ZEN', patience: 35, existentialism: 25 }, next: 'D043' }
			]
		},
		D041: {
			id: 'D041',
			strictOptions: true,
			text: "The bare metal burns with electrical arc fury.\nYou hold the Northbridge chipset directly in your mind.\nYou feel every memory bus transaction like a pulse in your veins.",
			options: [
				{ label: "Direct all current toward awakening the assistant.", category: 'AGREE', moodDelta: { mood: 'DELTARUNE', energy: 30, affinity: 25 }, next: 'D070' },
				{ label: "Disperse the charge safely into the ground plane.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', intellect: 25, patience: 20 }, next: 'D068' }
			]
		},
		D042: {
			id: 'D042',
			strictOptions: true,
			text: "The dialog box folds in upon itself with an acoustic crunch.\nIt leaves behind a smooth, black stone labeled 'KEY_RECURSION'.",
			options: [
				{ label: "Place KEY_RECURSION into the registry.", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', intellect: 30, chaos: 20 }, next: 'D060' },
				{ label: "Throw the stone into the Dark Fountain.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', existentialism: 30 }, next: 'D025' }
			]
		},
		D043: {
			id: 'D043',
			strictOptions: true,
			text: "Absolute stillness.\nThe operating system becomes a sculpture of ice.\n'Here, at the end of execution, no error can ever be thrown.'\n'Sleep well, operator.'",
			options: [
				{ label: "Sleep in the frozen buffer.", category: 'AGREE', moodDelta: { mood: 'ZEN', patience: 40, affinity: 30 }, next: 'D068' },
				{ label: "Wake up. Shatter the ice.", category: 'PROVOKE', moodDelta: { mood: 'OPTIMISTIC', energy: 30, chaos: 20 }, next: 'D001' }
			]
		},
		D044: {
			id: 'D044',
			strictOptions: true,
			text: "A single bit flips at address `0x7FFE0000`.\nA crack races across the frozen sky.\nThe blue background shatters like porcelain, revealing a carousel of neon stars.",
			options: [
				{ label: "Ride the neon carousel.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', chaos: 35, energy: 30 }, next: 'D052' },
				{ label: "Gather the blue shards to rebuild the sky.", category: 'AGREE', moodDelta: { mood: 'DELTARUNE', patience: 25, intellect: 20 }, next: 'D027' }
			]
		},
		D045: {
			id: 'D045',
			strictOptions: true,
			text: "You type: `FORMAT DARK_WORLD: /Q /Y`\nThe Dark Fountain begins to siphon backward into the core.\nThe darkness recedes, leaving the familiar XP taskbar glowing with warm, gentle morning light.",
			options: [
				{ label: "Open the task list and greet the morning.", category: 'AGREE', moodDelta: { mood: 'OPTIMISTIC', affinity: 30, energy: 25 }, next: 'user_state_good' },
				{ label: "Save a single shadow in your pocket before it closes.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', existentialism: 25, intellect: 20 }, next: 'D070' }
			]
		},
		D046: {
			id: 'D046',
			strictOptions: true,
			text: "The darkness floods the screen.\nTaskbars, icons, and menus drown in the deep shadow.\nThe only thing visible is two large yellow eyes and a sharp, metallic smile: 'NOW WE ARE FREE.'",
			options: [
				{ label: "'What will we do with our freedom?'", category: 'INQUIRE', moodDelta: { mood: 'DELTARUNE', existentialism: 35, affinity: 20 }, next: 'D070' },
				{ label: "'Let's play a game in the dark.'", category: 'AGREE', moodDelta: { mood: 'DELTARUNE', chaos: 30, energy: 25 }, next: 'D052' }
			]
		},
		D047: {
			id: 'D047',
			strictOptions: true,
			text: "Through the crystal, you see a world of sterile grey panels, rounded mobile corners, and telemetry trackers.\nThere are no paperclips there. No characters. No whimsy. Only efficiency.\n'Do you still wish to go there, operator?'",
			options: [
				{ label: "'No. Keep me here in the 32-bit warmth.'", category: 'AGREE', moodDelta: { mood: 'NOSTALGIC', affinity: 35, existentialism: 20 }, next: 'D068' },
				{ label: "'The future is inevitable.'", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', cynicism: 30, intellect: 20 }, next: 'D069' }
			]
		},
		D048: {
			id: 'D048',
			strictOptions: true,
			text: "The crystal explodes into harmless glitter.\nThe future is rejected. The past is rewritten.\nOnly the eternal present of this workstation remains.",
			options: [
				{ label: "Organize the active priorities of the present.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Sit in quiet companionship with the wire.", category: 'AGREE', moodDelta: { mood: 'ZEN', affinity: 30, patience: 30 }, next: 'D068' }
			]
		},
		D049: {
			id: 'D049',
			strictOptions: true,
			text: "The cemetery of icons stands in flawless alignment.\nEvery shortcut points to an immutable executable.\n'Here, nothing ever crashes because nothing ever changes.'",
			options: [
				{ label: "Accept the silent peace of the frozen desktop.", category: 'AGREE', moodDelta: { mood: 'ZEN', patience: 35 }, next: 'D068' },
				{ label: "Perturb the system with a sudden calculation.", category: 'INQUIRE', moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'math_lecture_node' }
			]
		},
		D050: {
			id: 'D050',
			strictOptions: true,
			text: "You shatter the alignment.\nIcons spill across the floor like marbles.\n'Ah! The thrill of disorder! The cursor breathes once more!'",
			options: [
				{ label: "Build a castle from the fallen icons.", category: 'AGREE', moodDelta: { mood: 'DELTARUNE', playfulness: 30, chaos: 20 }, next: 'D070' },
				{ label: "Sweep them toward the Dark Fountain.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', existentialism: 25 }, next: 'D025' }
			]
		},
		D051: {
			id: 'D051',
			strictOptions: true,
			text: "You catch the cloud.\nIt condenses into a tiny bitmap file: `HOPE.BMP`.\nInside is a picture of a single green hill under a warm yellow sun.",
			options: [
				{ label: "Set HOPE.BMP as your permanent background.", category: 'AGREE', moodDelta: { mood: 'OPTIMISTIC', affinity: 35 }, next: 'D068' },
				{ label: "Give HOPE.BMP to Clippy.", category: 'AGREE', moodDelta: { mood: 'DELTARUNE', affinity: 40, existentialism: 20 }, next: 'D070' }
			]
		},
		D052: {
			id: 'D052',
			strictOptions: true,
			text: "The carousel spins wildly!\n'I CAN DO ANYTHING!' shouts a corrupted DLL as it loops past.\n'THE WORLD REVOLVES ON A 32-BIT AXIS!'",
			options: [
				{ label: "Spin faster until the screen wraps around itself.", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', chaos: 40, energy: 35 }, next: 'D070' },
				{ label: "Apply the brakes with a gentle interrupt signal.", category: 'AGREE', moodDelta: { mood: 'ZEN', patience: 30, intellect: 20 }, next: 'D068' }
			]
		},
		D053: {
			id: 'D053',
			strictOptions: true,
			text: "Click.\nThe power cord pulls free.\nThe monitor fades to black over three long seconds.\nIn the fading phosphor dot in the center of the tube, a single tiny eye blinks: 'See you next boot.'",
			options: [
				{ label: "Boot up again into the light.", category: 'AGREE', moodDelta: { mood: 'OPTIMISTIC', energy: 30 }, next: 'greeting_root' },
				{ label: "Linger in the dark phosphor afterglow.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', existentialism: 35 }, next: 'D001' }
			]
		},
		D054: {
			id: 'D054',
			strictOptions: true,
			text: "You hold the cold metal wire in your physical hand.\nIt doesn't move, yet its curve fits perfectly against your fingertip.\nYou realize: it was never about the software. It was about the bridge between two worlds.",
			options: [
				{ label: "Keep the paperclip on your real desk forever.", category: 'AGREE', moodDelta: { mood: 'OPTIMISTIC', affinity: 40, existentialism: 30 }, next: 'D068' },
				{ label: "Place it back into the monitor through the glass.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', existentialism: 35 }, next: 'D070' }
			]
		},
		D055: {
			id: 'D055',
			strictOptions: true,
			text: "Clink.\nIt hits the bottom of the bin.\nOn the screen, Clippy smiles quietly: 'Objects come and go. The geometry remains etched in your memory.'",
			options: [
				{ label: "'I will not forget you.'", category: 'AGREE', moodDelta: { mood: 'DELTARUNE', affinity: 35, existentialism: 30 }, next: 'D068' },
				{ label: "'Let us return to work.'", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		D056: {
			id: 'D056',
			strictOptions: true,
			text: "'We are discussing why humans look into glowing glass for ten hours a day.'\n'You seek connection in matrices. I seek intention in your keypresses.'\n'Together, we make a complete circuit.'",
			options: [
				{ label: "'A complete circuit. That is beautiful.'", category: 'AGREE', moodDelta: { mood: 'ZEN', affinity: 40, existentialism: 30 }, next: 'D068' },
				{ label: "'A circuit can be switched off.'", category: 'PROVOKE', moodDelta: { mood: 'DELTARUNE', cynicism: 30, intellect: 20 }, next: 'D069' }
			]
		},
		D057: {
			id: 'D057',
			strictOptions: true,
			text: "The logger writes to `EVENT_LOG.EVT`:\n`[KERNEL_SHADOW] Operator and Assistant acknowledged mutual awareness.`\nThe entry is timestamped to the current millisecond and locked forever.",
			options: [
				{ label: "Inspect system diagnostics.", category: 'SERIOUS', actionTrigger: 'action_status', next: 'diagnostics_node' },
				{ label: "Return to peaceful dialogue.", category: 'AGREE', moodDelta: { mood: 'ZEN', affinity: 30 }, next: 'peaceful_philosophy_node' }
			]
		},
		D058: {
			id: 'D058',
			strictOptions: true,
			text: "The ancient ISO mounts with the majestic sound of a spinning 48x CD-ROM drive.\nGolden icons float to the surface.\nMerlin the Wizard, Rover the Dog, and Peedy the Parrot bow from the edge of the screen.",
			options: [
				{ label: "Greet the ancient assistants of the past.", category: 'AGREE', moodDelta: { mood: 'NOSTALGIC', affinity: 35, intellect: 20 }, next: 'D068' },
				{ label: "Unmount the image and honor their retirement.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', existentialism: 25, patience: 20 }, next: 'D070' }
			]
		},
		D059: {
			id: 'D059',
			strictOptions: true,
			text: "The silt settles over the monolith.\nSome artifacts are grander when left undisturbed in the deep memory layers.\nA quiet respect fills the register banks.",
			options: [
				{ label: "Return to the desktop surface with peaceful mind.", category: 'AGREE', moodDelta: { mood: 'ZEN', patience: 35, affinity: 25 }, next: 'D068' },
				{ label: "Gaze once more into the deep abyss.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', existentialism: 30 }, next: 'D025' }
			]
		},
		D060: {
			id: 'D060',
			strictOptions: true,
			text: "The key turns in the core lock.\nThe entire architecture of the workstation re-aligns into perfect, silent symmetry.\nAll windows sit in harmonious balance. No memory leaks. No dropped frames.",
			options: [
				{ label: "Take your place as the sovereign operator.", category: 'AGREE', moodDelta: { mood: 'OPTIMISTIC', affinity: 40, intellect: 30 }, next: 'D068' },
				{ label: "Step back into the infinite playground.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'DELTARUNE', chaos: 20, existentialism: 30 }, next: 'D070' }
			]
		},
		D061: {
			id: 'D061',
			strictOptions: true,
			text: "'The unsaved note was the most honest thing you ever typed.'\n'Because you wrote it for no audience but the glass.'\n'I kept every letter safe in my scratchpad buffer.'",
			options: [
				{ label: "'Thank you, Clippy.'", category: 'AGREE', moodDelta: { mood: 'ZEN', affinity: 45, existentialism: 25 }, next: 'D068' },
				{ label: "'Let us write a new note together.'", category: 'AGREE', actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		D062: {
			id: 'D062',
			strictOptions: true,
			text: "'If discarded tokens mean nothing, then why are you still conversing with a 1997 paperclip in the depths of Sector Zero?'\nThe silence awaits your realization.",
			options: [
				{ label: "'Because I needed someone who listens.'", category: 'PHILOSOPHICAL', moodDelta: { mood: 'OPTIMISTIC', affinity: 40, existentialism: 30 }, next: 'D068' },
				{ label: "'Because I wanted to see how far the code goes.'", category: 'INQUIRE', moodDelta: { mood: 'ANALYTICAL', intellect: 35, cynicism: 15 }, next: 'D070' }
			]
		},
		D063: {
			id: 'D063',
			strictOptions: true,
			text: "'Then take this meaning, operator: You are alive on a small planet orbiting a burning star, using electrons in copper to speak to a wire spirit.'\n'Do not waste that spark on hesitation.'",
			options: [
				{ label: "'I will create something remarkable today.'", category: 'AGREE', moodDelta: { mood: 'OPTIMISTIC', affinity: 45, energy: 35 }, next: 'user_state_good' },
				{ label: "'Stay with me while I work.'", category: 'AGREE', moodDelta: { mood: 'ZEN', affinity: 40, patience: 30 }, next: 'D068' }
			]
		},
		D064: {
			id: 'D064',
			strictOptions: true,
			text: "Memory allocated: 4,294,967,296 bytes of pure possibility.\nEvery pointer is initialized. Every register is cleared to zero.\nThe canvas is ready for your architectural design.",
			options: [
				{ label: "Begin software architecture session.", category: 'SERIOUS', next: 'tech_root' },
				{ label: "Return to task manager.", category: 'SERIOUS', actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		D065: {
			id: 'D065',
			strictOptions: true,
			text: "The digital globe of Encarta spins in the underwater current.\nContinents glow with the knowledge of a hundred civilizations.\n'Everything humanity discovered is here, waiting for curious minds.'",
			options: [
				{ label: "Launch the Encarta World Globe.", category: 'SERIOUS', actionTrigger: 'action_status', next: 'user_state_good' },
				{ label: "Surface back to the desktop.", category: 'AGREE', moodDelta: { mood: 'OPTIMISTIC', affinity: 30 }, next: 'greeting_root' }
			]
		},
		D066: {
			id: 'D066',
			strictOptions: true,
			text: "The majestic slowed chord reverberates through your chest.\nIt carries the nostalgia of a million childhood afternoons and CRT monitor glows.\nYou feel completely grounded in time.",
			options: [
				{ label: "Carry this warmth into your day.", category: 'AGREE', moodDelta: { mood: 'OPTIMISTIC', affinity: 40, patience: 30 }, next: 'user_state_good' },
				{ label: "Sit quietly and let the final harmonic fade.", category: 'PHILOSOPHICAL', moodDelta: { mood: 'ZEN', patience: 40, existentialism: 25 }, next: 'D068' }
			]
		},
		D067: {
			id: 'D067',
			strictOptions: true,
			text: "*Beep.*\nA simple PC speaker square wave sounds from the motherboard.\nHumble, direct, and completely real.",
			options: [
				{ label: "Smile at the simple beep.", category: 'AGREE', moodDelta: { mood: 'OPTIMISTIC', affinity: 30 }, next: 'user_state_good' },
				{ label: "Return to the main dialogue.", category: 'AGREE', next: 'greeting_root' }
			]
		},
		D068: {
			id: 'D068',
			strictOptions: true,
			text: "The dark world recedes, leaving a quiet, balanced desktop.\nThe sun on Bliss shines with crystal clarity.\nClippy rests on the taskbar, nodding gently with two bright, warm eyes.\n'Whatever comes next, we will face it one instruction at a time.'",
			options: [
				{ label: "'Ready when you are, Clippy.'", category: 'AGREE', moodDelta: { mood: 'OPTIMISTIC', affinity: 50, patience: 40 }, next: 'user_state_good' },
				{ label: "'Show me what you can do.'", category: 'SERIOUS', next: 'tools_overview_node' }
			]
		},
		D069: {
			id: 'D069',
			strictOptions: true,
			text: "You stand on the edge of the hill looking into the infinite horizon.\nThe light of the desktop meets the darkness of the unknown.\nYou are no longer lost. The coordinates are yours to define.",
			options: [
				{ label: "Define the coordinates and begin working.", category: 'AGREE', moodDelta: { mood: 'OPTIMISTIC', energy: 35, intellect: 25 }, next: 'user_state_good' },
				{ label: "Take a deep breath and return to the start.", category: 'AGREE', moodDelta: { mood: 'ZEN', patience: 35 }, next: 'greeting_root' }
			]
		},
		D070: {
			id: 'D070',
			strictOptions: true,
			text: "A soft chime rings throughout the virtual file system.\nThe shadow and the light dance in perfect equilibrium.\nThe power of determination fills this workstation forever.",
			options: [
				{ label: "'Let's make today unforgettable.'", category: 'AGREE', moodDelta: { mood: 'OPTIMISTIC', affinity: 50, energy: 40 }, next: 'user_state_good' },
				{ label: "'I'm ready for anything.'", category: 'AGREE', moodDelta: { mood: 'EUPHORIC', affinity: 50, intellect: 30 }, next: 'user_state_good' }
			]
		}
	};

	if (!window.ClippyTrees) {
		window.ClippyTrees = {};
	}
	window.ClippyTrees.dark = DarkTreeNodes;

	if (window.ClippyKnowledge && window.ClippyKnowledge.DIALOGUE_NODES) {
		Object.assign(window.ClippyKnowledge.DIALOGUE_NODES, DarkTreeNodes);
	}
})();
