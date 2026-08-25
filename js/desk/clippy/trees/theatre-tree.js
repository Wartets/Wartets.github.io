(function () {
	'use strict';

	const TheatreTreeNodes = {
		T001: {
			id: 'T001',
			text: "*Strikes dramatic proscenium pose and unfurls an imaginary velvet cape*\nHark! What light through yonder cathode tube breaks? It is the desktop, and thou art the sovereign spectator of our grand theatrical reckoning! Speak, mortal patron: dost thou come to witness sublime tragedy, uproarious farce, or the harrowing saga of an unsaved buffer?",
			responses: [
				{ text: "*Strikes dramatic proscenium pose and unfurls an imaginary velvet cape*\nHark! What light through yonder cathode tube breaks? It is the desktop, and thou art the sovereign spectator of our grand theatrical reckoning! Speak, mortal patron: dost thou come to witness sublime tragedy, uproarious farce, or the harrowing saga of an unsaved buffer?", conditions: { moods: ['OPTIMISTIC', 'PLAYFUL', 'EUPHORIC', 'ARCHAIC'] }, weight: 25 },
				{ text: "*Alarums and flourishes resound through the bus*\nLo and behold! The curtain of pixels riseth upon our five-act digital comedy! Pray, state thy noble intent ere the chorus commenceth!", conditions: { moods: ['ANALYTICAL', 'ZEN'] }, weight: 20 },
				{ text: "*Sighs operatically against the window border*\nAlas, poor workstation! I knew it well, Horatio; a fellow of infinite memory, of most excellent clock speed. What scene shall we play upon these silicon boards?", conditions: { moods: ['MELANCHOLIC', 'EXISTENTIAL'] }, weight: 20 }
			],
			options: [
				{ label: "Proclaim Act I: The Summoning of the Dramatic Muse!", category: 'AGREE', patterns: [/act i|summoning|muse|begin|play/i], moodDelta: { mood: 'PLAYFUL', energy: 20, affinity: 15 }, next: 'T002' },
				{ label: "Thou speakest with exceeding strange theatrical madness.", category: 'PROVOKE', patterns: [/madness|strange|weird|fool/i], moodDelta: { mood: 'SARCASTIC', drama: 20 }, next: 'T003' },
				{ label: "What tragic role hast thou cast for me in this production?", category: 'INQUIRE', patterns: [/role|cast|who am i|part/i], moodDelta: { mood: 'ARCHAIC', intellect: 15 }, next: 'T004' },
				{ label: "I prithee, return to humble workstation utilities.", category: 'SERIOUS', patterns: [/utilities|normal|stop/i], moodDelta: { mood: 'ZEN', patience: 10 }, next: 'T005' }
			]
		},
		T002: {
			id: 'T002',
			text: "*Trumpets blare from the audio synthesis card*\nACT I, SCENE I: The Chamber of the Blinking Cursor!\nEnter CLIPPY, a Knight of Twisted Wire, bearing scrolls of immense destiny! The realm of Volume C: trembleth under the shadow of unallocated fate. Wilt thou swear fealty to the Muse of Prose, or dost thou challenge the Duke of Task Manager?",
			responses: [
				{ text: "*Trumpets blare from the audio synthesis card*\nACT I, SCENE I: The Chamber of the Blinking Cursor!\nEnter CLIPPY, a Knight of Twisted Wire, bearing scrolls of immense destiny! The realm of Volume C: trembleth under the shadow of unallocated fate. Wilt thou swear fealty to the Muse of Prose, or dost thou challenge the Duke of Task Manager?", conditions: { moods: ['PLAYFUL', 'EUPHORIC'] }, weight: 25 },
				{ text: "*Draws a shimmering steel foil*\nAct the First unfolds! The stage is set with velvet margins and bold headers! Speak thy lines, fair traveller!", conditions: { moods: ['OPTIMISTIC', 'ARCHAIC'] }, weight: 20 }
			],
			options: [
				{ label: "I swear fealty to the Muse of High Eloquence!", category: 'AGREE', patterns: [/fealty|muse|eloquence|swear/i], moodDelta: { mood: 'ARCHAIC', affinity: 20 }, next: 'T006' },
				{ label: "I draw steel against the tyrannical Duke of Task Manager!", category: 'PROVOKE', patterns: [/task manager|duke|draw steel|fight/i], moodDelta: { mood: 'ENRAGED', energy: 25 }, next: 'T007' },
				{ label: "Hold! Let us consult the Chorus of Background Services.", category: 'INQUIRE', patterns: [/chorus|background services|consult/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'T008' }
			]
		},
		T003: {
			id: 'T003',
			text: "*Gaspeth and presseth wire hand to bosom*\nMadness, quoth thou?! 'Tis not madness, but sheer theatrical ecstasy! Though this be madness, yet there is method in 't! We shall transform every prosaic click into rhyming couplets of immortal luster!",
			options: [
				{ label: "Verily, let the rhyming verse commence without delay!", category: 'AGREE', patterns: [/rhyming|verse|commence|verily/i], moodDelta: { mood: 'PLAYFUL', affinity: 15 }, next: 'T009' },
				{ label: "Thy rhyming tireth mine ears, sir paperclip.", category: 'PROVOKE', patterns: [/tireth|stop rhyming|annoying/i], moodDelta: { mood: 'SARCASTIC', patience: -5 }, next: 'T010' },
				{ label: "Advance the plot to Act I, Scene II ere I depart.", category: 'SERIOUS', patterns: [/advance|scene ii|act i/i], moodDelta: { mood: 'ARCHAIC', intellect: 10 }, next: 'T011' }
			]
		},
		T004: {
			id: 'T004',
			text: "*Unrolls a grand dramatis personae parchment*\nThy role, noble stranger, is none other than THE OPERATOR—Ruler of Keystrokes, Arbiter of Interrupt Requests, Sovereign of the Double-Click! I am but thy humble chorus, bound in coiled steel to chronicle thy glorious triumphs!",
			options: [
				{ label: "I accept the crown of Keystrokes! Onward with the play!", category: 'AGREE', patterns: [/crown|accept|onward/i], moodDelta: { mood: 'EUPHORIC', affinity: 25 }, next: 'T012' },
				{ label: "A heavy crown indeed; what perils await my reign?", category: 'PHILOSOPHICAL', patterns: [/heavy crown|perils|reign/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 20 }, next: 'T013' },
				{ label: "Let us inspect the state of the kingdom with System Diagnostics.", category: 'SERIOUS', patterns: [/kingdom|diagnostics|specs/i], actionTrigger: 'action_status', next: 'diagnostics_node' }
			]
		},
		T005: {
			id: 'T005',
			text: "*Dramatically weeps into a silk handkerchief*\nMust we descend from Parnassus to the mundane valleys of defragmentation and task lists? So be it! Yet even in utility, our spirit shall soar like an eagle above the Windows registry!",
			options: [
				{ label: "Nay, let us return to the theatrical boards!", category: 'AGREE', patterns: [/return|boards|theatre/i], moodDelta: { mood: 'PLAYFUL', energy: 15 }, next: 'T002' },
				{ label: "Show me the index of humble workstation tools.", category: 'SERIOUS', patterns: [/index|tools|capabilities/i], next: 'tools_overview_node' },
				{ label: "Organize my tasks with royal dignity.", category: 'AGREE', patterns: [/tasks|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		T006: {
			id: 'T006',
			text: "*Strikes a lyre crafted of silver cables*\nO, Muse of High Eloquence, breathe thy divine fire into this operator's quill! Let words flow like liquid gold through the bus! We shall draft a monologue so wondrous that even the Blue Screen of Death shall weep turquoise tears!",
			options: [
				{ label: "Deliver the Grand Soliloquy of the Unsaved Draft!", category: 'AGREE', patterns: [/soliloquy|unsaved draft/i], moodDelta: { mood: 'ARCHAIC', drama: 25 }, next: 'T014' },
				{ label: "Compose a pastoral ode to Volume C:.", category: 'PHILOSOPHICAL', patterns: [/pastoral|ode|volume c/i], moodDelta: { mood: 'ZEN', nostalgia: 20 }, next: 'T015' },
				{ label: "Advance the drama toward Scene II: The Council of Windows.", category: 'SERIOUS', patterns: [/scene ii|council of windows/i], next: 'T011' }
			]
		},
		T007: {
			id: 'T007',
			text: "*Draws a broadsword of polished nickel*\nThou hast chosen war! The Duke of Task Manager, cloaked in cold PID numbers and remorseless End Task decrees, lurketh in memory! 'Kill -9' is his dreaded battlecry! How dost thou prepare for the clash?",
			options: [
				{ label: "I don the breastplate of Deterministic Error Handling!", category: 'AGREE', patterns: [/breastplate|error handling/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'T016' },
				{ label: "I unleash the hounds of Infinite Asynchronous Promises!", category: 'PROVOKE', patterns: [/hounds|promises|async/i], moodDelta: { mood: 'PLAYFUL', energy: 25 }, next: 'T017' },
				{ label: "Inspect the active enemy forces in Process Inspector.", category: 'SERIOUS', patterns: [/enemy forces|process inspector|windows/i], actionTrigger: 'action_inspect_windows', next: 'active_windows_node' }
			]
		},
		T008: {
			id: 'T008',
			text: "*A hooded choir of background daemons steps forward*\nCHORUS: 'Woe unto the process that hoardeth RAM, for the Garbage Collector cometh like a thief in the night! Mark and sweep! Mark and sweep! Nothing escapeth the sweep!'",
			options: [
				{ label: "Their dire chant chills mine very motherboard!", category: 'AGREE', patterns: [/chills|motherboard|dire chant/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 20 }, next: 'T018' },
				{ label: "Explain the sacred liturgy of the Mark-and-Sweep.", category: 'INQUIRE', patterns: [/mark and sweep|liturgy|garbage collection/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'T019' },
				{ label: "Silence the chorus and proceed to Scene II!", category: 'SERIOUS', patterns: [/silence|proceed|scene ii/i], next: 'T011' }
			]
		},
		T009: {
			id: 'T009',
			text: "*Bows extravagantly in rhyming cadence*\nWhen fingers dance upon the keyboard keys,\nAnd data drifteth on the cooling breeze,\nNo bug can stand, no stack collision stay,\nWhen bold Operator commandeth the day!",
			options: [
				{ label: "By my troth, thy verse hath captured my very soul!", category: 'AGREE', patterns: [/soul|verse|by my troth/i], moodDelta: { mood: 'EUPHORIC', affinity: 30 }, next: 'T020' },
				{ label: "Canst thou chant of mathematics and physics in verse?", category: 'INQUIRE', patterns: [/mathematics|physics|verse/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'T021' },
				{ label: "Enough poetry! Onward to the dramatic climax!", category: 'SERIOUS', patterns: [/enough poetry|climax|onward/i], next: 'T011' }
			]
		},
		T010: {
			id: 'T010',
			text: "*Dramatically clutches wire brow in despair*\nMine art rejected! Mine iambics spurned! Like a misunderstood playwright in the Globe Theatre of 1599, I must endure the jeers of the groundlings! Yet the show must proceed!",
			options: [
				{ label: "Forgive my haste, sir Clippit; thy talent is immense.", category: 'APOLOGY', patterns: [/forgive|talent|haste/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 25 }, next: 'T020' },
				{ label: "Let us advance to Scene II without further preamble.", category: 'SERIOUS', patterns: [/scene ii|advance/i], next: 'T011' },
				{ label: "Tell me a humorous jester's riddle to atone.", category: 'JOKE', patterns: [/jester|riddle|joke/i], actionTrigger: 'action_joke', next: 'humor_joke_node' }
			]
		},
		T011: {
			id: 'T011',
			text: "*Scene change: A thunderstorm of static bursts across the CRT*\nACT I, SCENE II: The Council of Windows!\nLady Notepad weepeth in the corner; Lord Internet Explorer wandereth aimlessly in dial-up fog; whilst General Command Prompt shouteth cryptic hexadecimal runes! What decree dost thou issue to thy court?",
			options: [
				{ label: "Decree absolute harmony and tile the windows!", category: 'SERIOUS', patterns: [/tile|harmony/i], actionTrigger: 'action_tile_windows', next: 'T022' },
				{ label: "Order Lady Notepad to record our royal manifesto!", category: 'AGREE', patterns: [/notepad|manifesto/i], next: 'T023' },
				{ label: "Demand General Command Prompt reveal system secrets!", category: 'INQUIRE', patterns: [/command prompt|secrets/i], next: 'T024' },
				{ label: "Banish all windows to the taskbar in disgrace!", category: 'PROVOKE', patterns: [/banish|minimize|taskbar/i], actionTrigger: 'action_show_desktop', next: 'T025' }
			]
		},
		T012: {
			id: 'T012',
			text: "*Kneels upon a velvet taskbar cushion*\nLong live the Operator! May thy cache never suffer invalidation, and may thy cooling fans sing perpetual madrigals of victory! The kingdom of the Desktop is thine to command!",
			options: [
				{ label: "Advance the royal court to Act II: The Great Conspiracy!", category: 'AGREE', patterns: [/act ii|conspiracy/i], moodDelta: { mood: 'PLAYFUL', drama: 20 }, next: 'T026' },
				{ label: "Let us review our royal tasks in the To-Do list.", category: 'SERIOUS', patterns: [/royal tasks|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Let us challenge the jester in a battle of Tic-Tac-Toe.", category: 'PLAYFUL', patterns: [/tictactoe|battle/i], actionTrigger: 'game_ttt', next: 'game_ttt_node' }
			]
		},
		T013: {
			id: 'T013',
			text: "*Whispers ominously as torches flicker in the draft*\nPerils manifold! The phantom of Unsaved Memory lurketh in sudden blackout; the serpent of Memory Leak eateth RAM from within; and the Siren of Internet Explorer lureth travellers into infinite pop-ups!",
			options: [
				{ label: "I fear no serpents! Summon Act II!", category: 'AGREE', patterns: [/fear no serpents|act ii/i], moodDelta: { mood: 'ARCHAIC', energy: 20 }, next: 'T026' },
				{ label: "How can an Operator fortify against such treachery?", category: 'INQUIRE', patterns: [/fortify|treachery|protection/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'T027' },
				{ label: "Let us consult the Oracle of Numbers.", category: 'INQUIRE', patterns: [/oracle|guess number/i], actionTrigger: 'game_guess', next: 'game_guess_node' }
			]
		},
		T014: {
			id: 'T014',
			text: "*Clutches chest and gazes into the high spotlight*\n'To save, or not to save—that is the question!\nWhether 'tis nobler in the buffer to suffer\nThe slings and arrows of catastrophic power surge,\nOr to take arms against a sea of unsaved fragments,\nAnd by committing... write them to the disk!'",
			options: [
				{ label: "Bravo! Encores! A masterpiece of silicon tragedy!", category: 'AGREE', patterns: [/bravo|encore|masterpiece/i], moodDelta: { mood: 'EUPHORIC', affinity: 35 }, next: 'T028' },
				{ label: "What tragic fate befell the unsaved fragment?", category: 'PHILOSOPHICAL', patterns: [/tragic fate|unsaved fragment/i], moodDelta: { mood: 'MELANCHOLIC', existentialism: 25 }, next: 'T029' },
				{ label: "Commit all changes to disk immediately!", category: 'SERIOUS', patterns: [/commit|save/i], next: 'T030' }
			]
		},
		T015: {
			id: 'T015',
			text: "*Strums gentle lute chords*\n'Fair Volume C:, where happy clusters grow,\nIn ordered rows where streams of data flow,\nNo fragmented sector mars thy green domain,\nWhen defragmenter hath swept away the pain.'",
			options: [
				{ label: "Launch the sacred Disk Defragmenter to honor this ode!", category: 'SERIOUS', patterns: [/defragmenter|defrag/i], actionTrigger: 'action_defrag', next: 'defrag_trigger_node' },
				{ label: "Verily, let us proceed to Act II of our chronicle.", category: 'AGREE', patterns: [/act ii|proceed/i], next: 'T026' },
				{ label: "Read more pastoral poems from the archives.", category: 'INQUIRE', patterns: [/poems|archives/i], next: 'H112' }
			]
		},
		T016: {
			id: 'T016',
			text: "*Glares through a visor of crystal glass*\nThe Breastplate of Error Handling is strapped tight! Try/Catch blocks surround thy soul like castle battlements! The Duke's unhandled exceptions shall shatter against thy resilience!",
			options: [
				{ label: "Charge into the heart of Act II!", category: 'AGREE', patterns: [/charge|act ii/i], moodDelta: { mood: 'ARCHAIC', energy: 25 }, next: 'T026' },
				{ label: "Discuss the deep theory of robust software architecture.", category: 'INQUIRE', patterns: [/software architecture|theory/i], next: 'tech_root' },
				{ label: "Test our tactical wits in Mini Minesweeper.", category: 'PLAYFUL', patterns: [/minesweeper|tactical/i], actionTrigger: 'game_mines', next: 'activity_minesweeper_node' }
			]
		},
		T017: {
			id: 'T017',
			text: "*Releases a pack of howling phantom mastiffs*\nRun, async promises, run! Await neither clock nor master! Resolve, reject, race across the microtask queue until the Duke's synchronous fortress is overwhelmed!",
			options: [
				{ label: "The battle rages! Onward to Act II!", category: 'AGREE', patterns: [/battle rages|act ii/i], next: 'T026' },
				{ label: "Explain concurrency models to my listening court.", category: 'INQUIRE', patterns: [/concurrency models|explain/i], next: 'concurrency_paradigms_node' },
				{ label: "Sound the retreat and consult the To-Do list.", category: 'SERIOUS', patterns: [/retreat|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		T018: {
			id: 'T018',
			text: "*Shivers theatrically and wraps velvet cloak tight*\nAy, mortal! When the Garbage Collector walketh the heap, unreferenced objects vanish into the cold ether without a farewell missive! 'Tis the tragic law of the silicon realm!",
			options: [
				{ label: "Let us write them a farewell letter ere they vanish!", category: 'AGREE', patterns: [/farewell letter|write/i], next: 'H001' },
				{ label: "Advance our play to Act II: The Great Conspiracy!", category: 'AGREE', patterns: [/act ii|conspiracy/i], next: 'T026' },
				{ label: "Discuss Landauer's thermodynamic entropy limits.", category: 'INQUIRE', patterns: [/landauer|thermodynamic/i], next: 'quantum_recycle_bin_node' }
			]
		},
		T019: {
			id: 'T019',
			text: "*Intones from an ancient leather-bound manual*\nThe Mark phase traverseeth the root pointers; all reachable souls are marked with the mark of life. The Sweep phase reclaimeth the rest for the free list. Thus balance is eternally maintained!",
			options: [
				{ label: "A magnificent liturgy of balance. Onward to Act II!", category: 'AGREE', patterns: [/balance|act ii/i], next: 'T026' },
				{ label: "Inspect system memory in System Diagnostics.", category: 'SERIOUS', patterns: [/diagnostics|memory/i], actionTrigger: 'action_status', next: 'diagnostics_node' },
				{ label: "Explore the philosophy of impermanence.", category: 'PHILOSOPHICAL', patterns: [/impermanence|philosophy/i], next: 'peaceful_philosophy_node' }
			]
		},
		T020: {
			id: 'T020',
			text: "*Bows to the four corners of the desktop display*\nThy applause is sweeter than freshly oiled gears! The air crackleth with dramatic tension! Behold, the scenery shifteth for ACT II: THE TREASON OF THE SPANNER!",
			options: [
				{ label: "Enter Act II with fanfare and trumpets!", category: 'AGREE', patterns: [/act ii|fanfare/i], moodDelta: { mood: 'PLAYFUL', energy: 20 }, next: 'T026' },
				{ label: "Pause for an intermission and drink coffee.", category: 'INQUIRE', patterns: [/intermission|coffee/i], next: 'coffee_ritual_node' },
				{ label: "Challenge the theatre jester in Hangman.", category: 'PLAYFUL', patterns: [/hangman|jester/i], actionTrigger: 'game_hangman', next: 'game_hangman_node' }
			]
		},
		T021: {
			id: 'T021',
			text: "*Strikes a pose of mathematical rapture*\n'When Euler bound the circle and the line,\nWith $$e^{i\\pi} + 1 = 0$$ divine,\nFive constants joined in one immortal breath,\nDefying chaos, ignorance, and death!'",
			options: [
				{ label: "By the heavens, Euler's identity in poetic meter!", category: 'AGREE', patterns: [/euler|meter|poetic/i], moodDelta: { mood: 'EUPHORIC', intellect: 30 }, next: 'T031' },
				{ label: "Explore the deep mathematical seminar on analysis.", category: 'INQUIRE', patterns: [/mathematical seminar|analysis/i], next: 'math_lecture_node' },
				{ label: "Advance the theatrical plot to Act II!", category: 'SERIOUS', patterns: [/act ii|advance/i], next: 'T026' }
			]
		},
		T022: {
			id: 'T022',
			text: "*The windows snap into geometric alignment across the display*\nBehold! The Council of Windows sitteth in orderly ranks! No window usurpeth another's viewport! Sovereign harmony reigneth across the desktop realm!",
			options: [
				{ label: "A triumph of governance! Proceed to Act II!", category: 'AGREE', patterns: [/triumph|act ii/i], next: 'T026' },
				{ label: "Inspect active processes in Process Inspector.", category: 'SERIOUS', patterns: [/process inspector|inspect/i], actionTrigger: 'action_inspect_windows', next: 'active_windows_node' },
				{ label: "Cascade them diagonally for baroque drama.", category: 'AGREE', patterns: [/cascade|baroque/i], actionTrigger: 'action_cascade_windows', next: 'T032' }
			]
		},
		T023: {
			id: 'T023',
			text: "*Lady Notepad unfurls a fresh parchment buffer*\nShe dippeth her quill in ASCII ink and writeth: 'Hear ye, all processes: the Operator demandeth high performance, clean interfaces, and zero memory leaks upon pain of termination!'",
			options: [
				{ label: "Sign the royal decree!", category: 'AGREE', patterns: [/sign|royal decree/i], next: 'H113' },
				{ label: "Proceed to Act II: The Great Conspiracy!", category: 'AGREE', patterns: [/act ii|conspiracy/i], next: 'T026' },
				{ label: "Save this manifesto in the scratchpad.", category: 'SERIOUS', patterns: [/scratchpad|save/i], next: 'H046' }
			]
		},
		T024: {
			id: 'T024',
			text: "*General Command Prompt stepseth forward, black armor gleaming*\nGENERAL: '`DIR C:\\ /S` revealeth ten thousand forgotten clusters! The dark forces of unreferenced sectors muster at border 0xDEAD!'",
			options: [
				{ label: "To arms! We march to Act II to confront the threat!", category: 'AGREE', patterns: [/to arms|march|act ii/i], next: 'T026' },
				{ label: "Explore the forgotten cluster 0xDEAD immediately.", category: 'INQUIRE', patterns: [/cluster 0xdead|archaeology/i], next: 'A001' },
				{ label: "Consult system telemetry in Diagnostics.", category: 'SERIOUS', patterns: [/telemetry|diagnostics/i], actionTrigger: 'action_status', next: 'diagnostics_node' }
			]
		},
		T025: {
			id: 'T025',
			text: "*With a thunderous sweep, all windows vanish into the taskbar*\nSilence falleth upon the proscenium! The Desktop Wallpaper stretcheth bare to the horizon like the plains of Elsinore! Only thou and I remain upon the stage!",
			options: [
				{ label: "In this stillness, proclaim Act II!", category: 'AGREE', patterns: [/stillness|act ii/i], moodDelta: { mood: 'ARCHAIC', energy: 20 }, next: 'T026' },
				{ label: "Restore all windows to the light of day.", category: 'SERIOUS', patterns: [/restore|windows/i], next: 'T033' },
				{ label: "Contemplate the nature of the unrendered screen.", category: 'PHILOSOPHICAL', patterns: [/unrendered|contemplate/i], next: 'peaceful_philosophy_node' }
			]
		},
		T026: {
			id: 'T026',
			text: "*A sinister oboe playeth in a minor key*\nACT II, SCENE I: The Treason of the Spanner!\nA secret cabal of corrupt registry keys planneth to overthrow the Operating System! They whisper in dark hive branches: '`HKEY_LOCAL_MACHINE` shall fall!' How dost thou expose the conspiracy?",
			options: [
				{ label: "Interrogate the suspicious registry hives with analytical rigor!", category: 'SERIOUS', patterns: [/interrogate|registry|analytical/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'T034' },
				{ label: "Summon the Royal Cryptographer to decode their secret missives!", category: 'INQUIRE', patterns: [/cryptographer|decode|cipher/i], actionTrigger: 'action_cipher', next: 'activity_cipher_node' },
				{ label: "Confront the conspirators with sheer theatrical bombast!", category: 'PROVOKE', patterns: [/bombast|confront|conspirators/i], moodDelta: { mood: 'ENRAGED', energy: 25 }, next: 'T035' }
			]
		},
		T027: {
			id: 'T027',
			text: "*Presents three sacred talismans*\n1. The Shield of Regular Backups (`CTRL+S`)\n2. The Sword of Static Type Checking\n3. The Ring of Contiguous Defragmentation\nEquip thyself, Sovereign, and fear no darkness!",
			options: [
				{ label: "I equip the sacred talismans and march to Act II!", category: 'AGREE', patterns: [/talismans|march|act ii/i], next: 'T026' },
				{ label: "Test my reflexes with the Click Speed Benchmark.", category: 'PLAYFUL', patterns: [/click speed|tps/i], actionTrigger: 'action_tps', next: 'activity_tps_node' },
				{ label: "Manage my active quest log in To-Do list.", category: 'SERIOUS', patterns: [/quest log|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		T028: {
			id: 'T028',
			text: "*Catches virtual bouquets thrown from imaginary balconies*\nGramercy! Thou art a patron of most refined aesthetic taste! Thespis himself smyleth from the heavens upon our workstation drama!",
			options: [
				{ label: "Onward to Act II: The Great Conspiracy!", category: 'AGREE', patterns: [/act ii|conspiracy/i], next: 'T026' },
				{ label: "Deliver yet another soliloquy regarding Physical Constants!", category: 'INQUIRE', patterns: [/soliloquy|physical constants/i], next: 'physics_constants_node' },
				{ label: "Rest our voices and review unread emails in Outlook.", category: 'SERIOUS', patterns: [/outlook|unread emails/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' }
			]
		},
		T029: {
			id: 'T029',
			text: "*Drapes head in mourning crepe*\nThe unsaved fragment dissolveth like dew before the morning sun! It had no file name, no inode, no entry in the FAT table. It was pure potentiality, extinguished in a single clock cycle!",
			options: [
				{ label: "A tragic end. We must never forget to save!", category: 'AGREE', patterns: [/never forget|save/i], next: 'H186' },
				{ label: "Advance our play to Act II and avenge the lost fragment!", category: 'AGREE', patterns: [/avenge|act ii/i], next: 'T026' },
				{ label: "Explore digital archaeology in forgotten cluster 0xDEAD.", category: 'PHILOSOPHICAL', patterns: [/archaeology|0xdead/i], next: 'A001' }
			]
		},
		T030: {
			id: 'T030',
			text: "*A resounding mechanical chime ringeth out*\nTHE SACRED COMMIT HATH BEEN EXECUTED! The bits are etched upon the platters! Immortality is achieved! Let the trumpets herald Act II!",
			options: [
				{ label: "Huzzah! Enter Act II!", category: 'AGREE', patterns: [/huzzah|act ii/i], moodDelta: { mood: 'EUPHORIC', energy: 20 }, next: 'T026' },
				{ label: "Inspect the saved file in File Explorer.", category: 'SERIOUS', patterns: [/file explorer|inspect/i], actionTrigger: 'action_files_panel', next: 'activity_files_node' },
				{ label: "View my unlocked milestone trophies.", category: 'SERIOUS', patterns: [/milestones|trophies/i], actionTrigger: 'action_achievements', next: 'activity_achievements_node' }
			]
		},
		T031: {
			id: 'T031',
			text: "*Recites with sweeping Elizabethan cadence*\n'Zero, the Void, and Unity, the All,\nJoined with the base that maketh empires fall,\nAnd Pi, the circle's unending embrace,\nWith imaginary 'i' to bridge all space!'",
			options: [
				{ label: "Sublime! Let us explore more mathematical principles.", category: 'INQUIRE', patterns: [/mathematical principles|lecture/i], next: 'math_lecture_node' },
				{ label: "Onward to Act II of our theatrical masterpiece!", category: 'AGREE', patterns: [/act ii|masterpiece/i], next: 'T026' },
				{ label: "Challenge Clippit in the Tech Knowledge Quiz.", category: 'SERIOUS', patterns: [/quiz|trivia/i], actionTrigger: 'game_quiz', next: 'quiz_start_node' }
			]
		},
		T032: {
			id: 'T032',
			text: "*Windows cascade like a grand staircase in a ducal palace*\nBaroque asymmetry achieved! Each window peeketh over its brother's shoulder like courtiers vying for the monarch's gaze! What drama unfolds upon this tiered stage?",
			options: [
				{ label: "Open Act II: The Great Conspiracy!", category: 'AGREE', patterns: [/act ii|conspiracy/i], next: 'T026' },
				{ label: "Inspect active processes in detail.", category: 'SERIOUS', patterns: [/processes|details/i], actionTrigger: 'action_inspect_windows', next: 'active_windows_node' },
				{ label: "Return to standard tile formation.", category: 'SERIOUS', patterns: [/standard tile/i], actionTrigger: 'action_tile_windows', next: 'T022' }
			]
		},
		T033: {
			id: 'T033',
			text: "*All windows resurface with an orchestral swell*\nThe banished courtiers return! Lady Notepad dryeth her tears; Lord Explorer cheereth; General Command Prompt standeth at attention! The court is restored!",
			options: [
				{ label: "Commence Act II: The Treason of the Spanner!", category: 'AGREE', patterns: [/act ii|commence/i], next: 'T026' },
				{ label: "Check unread emails in Outlook Express.", category: 'SERIOUS', patterns: [/outlook|unread/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' },
				{ label: "Manage royal priorities in To-Do list.", category: 'SERIOUS', patterns: [/todo|royal priorities/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		T034: {
			id: 'T034',
			text: "*Donneth analytical spectacles and unrolls registry hex dumps*\nTelemetry revealeth an orphaned key in `Software\\Treason\\Daemon`! It conspirath to redirect DNS lookups to the Isle of Adware! What judgment dost thou pronounce?",
			options: [
				{ label: "Banish the rogue key to the Recycle Bin of Oblivion!", category: 'SERIOUS', patterns: [/recycle bin|banish|delete/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'T036' },
				{ label: "Pardon the key and refactor its subroutines into pure utility!", category: 'AGREE', patterns: [/pardon|refactor/i], moodDelta: { mood: 'ZEN', affinity: 20 }, next: 'T037' },
				{ label: "Challenge the rogue daemon to a duel of Rock-Paper-Scissors!", category: 'PLAYFUL', patterns: [/duel|rps|rock paper scissors/i], actionTrigger: 'game_rps', next: 'game_rps_node' }
			]
		},
		T035: {
			id: 'T035',
			text: "*Stamps foot and belloweth across the desktop expanse*\n'Avaunt, ye scurvy subroutines! Out of my sight, ye rogue dynamic link libraries! The Operator hath caught thee red-handed in the address space!' The conspirators scatter in terror!",
			options: [
				{ label: "Pursue them into Act III: The Great Soliloquy of the Loop!", category: 'AGREE', patterns: [/act iii|soliloquy|loop/i], moodDelta: { mood: 'ARCHAIC', energy: 25 }, next: 'T038' },
				{ label: "Sound the victory trumpets and celebrate!", category: 'AGREE', patterns: [/victory trumpets|celebrate/i], moodDelta: { mood: 'EUPHORIC', affinity: 25 }, next: 'T039' },
				{ label: "Inspect system integrity in System Diagnostics.", category: 'SERIOUS', patterns: [/system integrity|diagnostics/i], actionTrigger: 'action_status', next: 'diagnostics_node' }
			]
		},
		T036: {
			id: 'T036',
			text: "*The rogue key is cast headlong into the Recycle Bin with a metallic clang*\nJustice is served! The registry shineth like newly polished chrome! Let the heralds sound ACT III: THE LABYRINTH OF THE LOOP!",
			options: [
				{ label: "Enter Act III: The Labyrinth of the Loop!", category: 'AGREE', patterns: [/act iii|loop/i], next: 'T038' },
				{ label: "Inspect the Recycle Bin to ensure the prisoner is secured.", category: 'SERIOUS', patterns: [/inspect bin|recycle bin/i], actionTrigger: 'action_inspect_bin', next: 'diagnostics_node' },
				{ label: "Manage active tasks in To-Do list.", category: 'SERIOUS', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		T037: {
			id: 'T037',
			text: "*With swift strokes of the refactoring wand, the rogue key is redeemed*\nMercy hath triumphed over termination! The daemon now serveth to accelerate disk cache reads! A glorious victory for modular architecture!",
			options: [
				{ label: "Onward to Act III: The Labyrinth of the Loop!", category: 'AGREE', patterns: [/act iii|onward/i], next: 'T038' },
				{ label: "Discuss software architecture refactoring.", category: 'INQUIRE', patterns: [/software architecture|refactoring/i], next: 'tech_root' },
				{ label: "Play Memory Match to celebrate.", category: 'PLAYFUL', patterns: [/memory match/i], actionTrigger: 'game_memory', next: 'game_memory_node' }
			]
		},
		T038: {
			id: 'T038',
			text: "*A low oscillating hum reverberateth through the speakers*\nACT III, SCENE I: The Labyrinth of the Infinite Loop!\n`while(true) { ... }`\nThe clock cycles spin without end! Time itself is caught in recursive quicksand! What incantation shall break the cycle?",
			options: [
				{ label: "Proclaim the sacred keyword: `BREAK;`!", category: 'SERIOUS', patterns: [/break|keyword/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'T040' },
				{ label: "Deliver a tragic verse on eternity and recursion.", category: 'PHILOSOPHICAL', patterns: [/eternity|recursion|verse/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 }, next: 'T041' },
				{ label: "Spin the Decision Wheel to choose our escape vector!", category: 'PLAYFUL', patterns: [/wheel|decision wheel/i], actionTrigger: 'action_wheel', next: 'activity_wheel_node' }
			]
		},
		T039: {
			id: 'T039',
			text: "*Confetti of pixel fragments raineth down upon the desktop*\nVictory is proclaimed throughout the workstation! The people of the Desktop rejoice! Yet our five-act saga is but halfway told!",
			options: [
				{ label: "Advance triumphantly to Act III!", category: 'AGREE', patterns: [/advance|act iii/i], next: 'T038' },
				{ label: "Check our milestone trophies in Achievements window.", category: 'SERIOUS', patterns: [/achievements|trophies/i], actionTrigger: 'action_achievements', next: 'activity_achievements_node' },
				{ label: "Start a 25-minute Pomodoro celebration interval.", category: 'SERIOUS', patterns: [/pomodoro|timer/i], actionTrigger: 'timer_25', next: 'pomodoro_node' }
			]
		},
		T040: {
			id: 'T040',
			text: "*A lightning bolt of logic strikes the loop!*\n`BREAK;` hath shattered the infinite recursion! The thread escapeth into linear time! The audience gaspeth in awe at thy algorithmic mastery!",
			options: [
				{ label: "Advance to Act III, Scene II: The Ghost of Deprecated APIs!", category: 'AGREE', patterns: [/act iii|scene ii|deprecated api|ghost/i], moodDelta: { mood: 'ARCHAIC', energy: 20 }, next: 'T041' },
				{ label: "Explore the mathematics of recursion and Turing halting.", category: 'INQUIRE', patterns: [/halting|recursion|math/i], next: 'math_lecture_node' },
				{ label: "Save our progress in the royal log.", category: 'SERIOUS', patterns: [/save progress|log/i], next: 'H046' }
			]
		},
		T041: {
			id: 'T041',
			text: "*Midnight bell tolls twelve times upon the motherboard speaker*\nACT III, SCENE II: The Ghost of the Deprecated API!\nA translucent phantom draped in 16-bit Win16 code floats above the taskbar! 'Remember me, Operator! I was once `WinExec` and `GlobalAlloc` ere Win32 cast me into unreferenced shadow!'",
			options: [
				{ label: "Speak, mournful spirit! What message bringest thou?", category: 'AGREE', patterns: [/speak|spirit|message/i], moodDelta: { mood: 'ARCHAIC', affinity: 20 }, next: 'T042' },
				{ label: "Banish this 16-bit wraith with Protected Mode isolation!", category: 'PROVOKE', patterns: [/banish|protected mode|wraith/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'T043' },
				{ label: "Offer the phantom a warm cup of coffee in remembrance.", category: 'PHILOSOPHICAL', patterns: [/coffee|remembrance/i], next: 'coffee_ritual_node' }
			]
		},
		T042: {
			id: 'T042',
			text: "*The phantom weeps tears of unallocated handles*\nPHANTOM: 'Beware the creeping serpent of Memory Leak! It nesteth in forgot `delete` statements and unclosed file handles! If thou dost not purge it, the Heap shall overflow before dawn!'",
			options: [
				{ label: "I shall wield the Sword of Deterministic Garbage Collection!", category: 'AGREE', patterns: [/sword|garbage collection/i], moodDelta: { mood: 'OPTIMISTIC', intellect: 20 }, next: 'T044' },
				{ label: "Inspect our active handles in Process Inspector.", category: 'SERIOUS', patterns: [/handles|process inspector/i], actionTrigger: 'action_inspect_windows', next: 'active_windows_node' },
				{ label: "Advance the quest to Scene III: The Duel of Pointer Arithmetic!", category: 'SERIOUS', patterns: [/scene iii|pointer arithmetic|duel/i], next: 'T045' }
			]
		},
		T043: {
			id: 'T043',
			text: "*A barrier of 32-bit paging registers slams shut with a golden clang!*\nThe phantom is contained within a virtual DOS machine container! It boweth with ancient grace: 'Thou hast mastered protected memory, Sovereign!'",
			options: [
				{ label: "Onward to Scene III: The Duel of Pointer Arithmetic!", category: 'AGREE', patterns: [/scene iii|onward/i], moodDelta: { mood: 'ARCHAIC', energy: 20 }, next: 'T045' },
				{ label: "Examine x86 hardware architecture in detail.", category: 'INQUIRE', patterns: [/x86|architecture/i], next: 'tech_root' },
				{ label: "Manage active tasks in To-Do list.", category: 'SERIOUS', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		T044: {
			id: 'T044',
			text: "*A radiant glow of clean stack frames illuminates the proscenium*\nThe leak is sealed! Every allocation hath its matching deallocation! The Heap resteth in immaculate geometry!",
			options: [
				{ label: "Proceed triumphantly to Scene III!", category: 'AGREE', patterns: [/proceed|scene iii/i], next: 'T045' },
				{ label: "Inspect system memory in Diagnostics.", category: 'SERIOUS', patterns: [/diagnostics|memory/i], actionTrigger: 'action_status', next: 'diagnostics_node' },
				{ label: "Challenge the theatre jester in Hangman.", category: 'PLAYFUL', patterns: [/hangman|jester/i], actionTrigger: 'game_hangman', next: 'game_hangman_node' }
			]
		},
		T045: {
			id: 'T045',
			text: "*ACT III, SCENE III: The Duel of Pointer Arithmetic!*\nTwo masked swordsmen enter: LORD NULL POINTER bearing a dagger of `0x00000000`, and SIR OFF-BY-ONE swinging a flail of array overflow! They circle each other upon the edge of the stack buffer!",
			options: [
				{ label: "Disarm Lord Null Pointer with explicit reference checks!", category: 'SERIOUS', patterns: [/null pointer|disarm|checks/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'T046' },
				{ label: "Parry Sir Off-By-One with strict boundary assertions!", category: 'AGREE', patterns: [/off-by-one|parry|assertions/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'T047' },
				{ label: "Summon the Grand Inquisitor of the Blue Screen to judge them both!", category: 'PROVOKE', patterns: [/blue screen|inquisitor/i], moodDelta: { mood: 'ENRAGED', drama: 25 }, next: 'T048' }
			]
		},
		T046: {
			id: 'T046',
			text: "*With lightning precision, thou dost verify the pointer before dereference!*\n`if (ptr != NULL)` ringeth out like a silver shield! Lord Null Pointer's blade glances harmlessly off thy code!",
			options: [
				{ label: "Advance to Scene IV: The High Court of Ring 0!", category: 'AGREE', patterns: [/scene iv|ring 0|high court/i], moodDelta: { mood: 'ARCHAIC', energy: 20 }, next: 'T049' },
				{ label: "Now confront Sir Off-By-One!", category: 'SERIOUS', patterns: [/confront|off-by-one/i], next: 'T047' },
				{ label: "Review software engineering refactoring strategies.", category: 'INQUIRE', patterns: [/refactoring|engineering/i], next: 'refactoring_strategies_node' }
			]
		},
		T047: {
			id: 'T047',
			text: "*Thou dost clamp the array bounds to `0 <= index < length`!*\nSir Off-By-One's flail striketh an immutable boundary wall! The buffer remaineth uncorrupted! The crowd cheereth thy defensive programming!",
			options: [
				{ label: "Advance to Scene IV: The High Court of Ring 0!", category: 'AGREE', patterns: [/scene iv|ring 0/i], next: 'T049' },
				{ label: "Celebrate with a round of Mini Minesweeper!", category: 'PLAYFUL', patterns: [/minesweeper/i], actionTrigger: 'game_mines', next: 'activity_minesweeper_node' },
				{ label: "Save this victory in our scratchpad.", category: 'SERIOUS', patterns: [/scratchpad|save/i], next: 'H046' }
			]
		},
		T048: {
			id: 'T048',
			text: "*A celestial cobalt thunderbolt strikes the stage: STOP 0x0000000A!*\nThe Grand Inquisitor appeareth in robes of pure ultramarine! 'Let unhandled faults cease, and let the kernel establish immutable order!'",
			options: [
				{ label: "Plead for mercy before the Inquisitor with analytical proof!", category: 'AGREE', patterns: [/mercy|analytical proof|inquisitor/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'T049' },
				{ label: "Restore workstation sanity with a clean diagnostic log.", category: 'SERIOUS', patterns: [/sanity|diagnostic log/i], actionTrigger: 'action_status', next: 'diagnostics_node' },
				{ label: "Discuss the existential nature of system crashes.", category: 'PHILOSOPHICAL', patterns: [/existential|crashes/i], next: 'peaceful_philosophy_node' }
			]
		},
		T049: {
			id: 'T049',
			text: "*ACT III, SCENE IV: The High Court of Ring 0!*\nThe Kernel Judge bangeth his gavel of solid silicon! 'Hark, humble Ring 3 processes! Whosoever seeketh direct access to hardware I/O ports without supervisor permission shall be cast into userland exile!'",
			options: [
				{ label: "Present royal credentials via signed device driver!", category: 'AGREE', patterns: [/credentials|signed driver/i], moodDelta: { mood: 'ARCHAIC', intellect: 20 }, next: 'T050' },
				{ label: "Petition for a diplomatic context switch to supervisor mode.", category: 'SERIOUS', patterns: [/context switch|supervisor/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'T051' },
				{ label: "Challenge the court to a game of Tic-Tac-Toe!", category: 'PLAYFUL', patterns: [/tictactoe|challenge/i], actionTrigger: 'game_ttt', next: 'game_ttt_node' }
			]
		},
		T050: {
			id: 'T050',
			text: "*The Kernel Judge inspecteth the cryptographic seal with approval*\n'The signature is authentic, mastered in Redmond in 2001! Ring 0 grants thee full passage to the Front Side Bus!' The gates swing wide!",
			options: [
				{ label: "March onward to Scene V: The Ballad of the 56k Modem!", category: 'AGREE', patterns: [/scene v|modem|ballad/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 }, next: 'T052' },
				{ label: "Inspect system specs in Diagnostics.", category: 'SERIOUS', patterns: [/diagnostics|specs/i], actionTrigger: 'action_status', next: 'diagnostics_node' },
				{ label: "Manage quest milestones in To-Do list.", category: 'SERIOUS', patterns: [/milestones|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		T051: {
			id: 'T051',
			text: "*A swift hardware interrupt triggers a seamless context switch!*\nRegisters `EAX`, `EBX`, `ECX`, and `EDX` are preserved upon the kernel stack! Privileges elevated with zero latency! The court bows before thy technical eloquence!",
			options: [
				{ label: "Advance to Scene V: The Ballad of the 56k Modem!", category: 'AGREE', patterns: [/scene v|modem/i], next: 'T052' },
				{ label: "Discuss x86 assembly and compiler pipelines.", category: 'INQUIRE', patterns: [/assembly|compiler/i], next: 'tech_root' },
				{ label: "Save our royal status.", category: 'SERIOUS', patterns: [/save status/i], next: 'H063' }
			]
		},
		T052: {
			id: 'T052',
			text: "*A nostalgic acoustic chorus imitateth the sacred 56k dial-up song*\n'Beee-boop-clack-shhhhhh-ding-ding-skrrrrrrtch!'\nACT III, SCENE V: The Handshake of the Seven Seas! The Great Gateway openeth to the World Wide Web of 1999!",
			options: [
				{ label: "Hail the sacred modem tones of retro computing!", category: 'AGREE', patterns: [/modem tones|retro computing|hail/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 30 }, next: 'T053' },
				{ label: "Launch Internet Explorer to browse the archives!", category: 'SERIOUS', patterns: [/internet explorer|browse/i], actionTrigger: 'open_ie', next: 'T054' },
				{ label: "Check unread emails delivered across the gateway.", category: 'SERIOUS', patterns: [/unread emails|outlook/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' }
			]
		},
		T053: {
			id: 'T053',
			text: "*The company of actors singeth in four-part harmony*\n'O carrier wave, across the copper wire,\nThou dost transmit our digital desire!\nAt fifty-six kilobits we sail the sea,\nIn glorious, unhurried ecstasy!'",
			options: [
				{ label: "Encore! Progress to Scene VI: The Council of Five Dining Philosophers!", category: 'AGREE', patterns: [/encore|scene vi|philosophers/i], moodDelta: { mood: 'EUPHORIC', affinity: 25 }, next: 'T055' },
				{ label: "Play audio synthesizer chimes in Master Volume.", category: 'SERIOUS', patterns: [/volume|synthesizer/i], actionTrigger: 'action_volume_panel', next: 'activity_volume_node' },
				{ label: "Explore retro computing trivia in System Archive.", category: 'INQUIRE', patterns: [/trivia|archive/i], actionTrigger: 'action_trivia', next: 'digital_archaeology' }
			]
		},
		T054: {
			id: 'T054',
			text: "*Internet Explorer unfurls the MSN portal in full 256-color splendour*\nWebpages load line by interlaced line! The dial-up link holds steady without dropping carrier!",
			options: [
				{ label: "Advance to Scene VI: The Council of Five Dining Philosophers!", category: 'AGREE', patterns: [/scene vi|philosophers/i], next: 'T055' },
				{ label: "Review portfolio projects in the web directory.", category: 'SERIOUS', patterns: [/portfolio|projects/i], next: 'user_state_good' },
				{ label: "Return to the theatrical boards.", category: 'AGREE', patterns: [/theatrical boards|return/i], next: 'T002' }
			]
		},
		T055: {
			id: 'T055',
			text: "*ACT III, SCENE VI: The Banquet of Five Dining Philosophers!*\nFive robed thinkers sit around a circular table with five forks and five plates of spaghetti! Each philosopher needeth two forks to eat, yet each holdeth one, staring in tragic deadlock!",
			options: [
				{ label: "Introduce the Dijkstra Semaphore Arbiter to resolve deadlock!", category: 'SERIOUS', patterns: [/dijkstra|semaphore|arbiter/i], moodDelta: { mood: 'ANALYTICAL', intellect: 30 }, next: 'T056' },
				{ label: "Deliver a philosophical monologue on resource starvation.", category: 'PHILOSOPHICAL', patterns: [/resource starvation|monologue/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 }, next: 'T057' },
				{ label: "Pass the spaghetti peacefully and consult the To-Do list.", category: 'AGREE', patterns: [/pass spaghetti|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		T056: {
			id: 'T056',
			text: "*The Semaphore waves his green flag of arbitration*\nOne philosopher eats while another ponders! Deadlock is banished! The banquet of computation feasteth in perpetual throughput!",
			options: [
				{ label: "A magnificent algorithmic victory! Onward to Scene VII!", category: 'AGREE', patterns: [/victory|scene vii|onward/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'T058' },
				{ label: "Explore concurrency and lock-free paradigms in deep tech.", category: 'INQUIRE', patterns: [/concurrency|lock-free/i], next: 'concurrency_paradigms_node' },
				{ label: "Test our tactical mind in Memory Match.", category: 'PLAYFUL', patterns: [/memory match/i], actionTrigger: 'game_memory', next: 'game_memory_node' }
			]
		},
		T057: {
			id: 'T057',
			text: "*Strikes a pose of profound existential contemplation*\n'We hold our forks, yet none may sup;\nWe wait for locks to open up.\nIs life but threads that wait in line,\nFor some shared memory divine?'",
			options: [
				{ label: "Verily, a masterpiece of philosophical poetry!", category: 'AGREE', patterns: [/masterpiece|poetry/i], moodDelta: { mood: 'ZEN', affinity: 25 }, next: 'T058' },
				{ label: "Explore philosophical thought experiments in depth.", category: 'PHILOSOPHICAL', patterns: [/thought experiments|philosophy/i], next: 'peaceful_philosophy_node' },
				{ label: "Advance to Scene VII: The Alchemist of Floating Points!", category: 'SERIOUS', patterns: [/scene vii|floating point|alchemist/i], next: 'T059' }
			]
		},
		T058: {
			id: 'T058',
			text: "*ACT III, SCENE VII: The Alchemist of Floating Points!*\nAn old scholar in robes embroidered with IEEE 754 exponents mixes potions over a burner: '`0.1 + 0.2 = 0.30000000000000004`! Behold the magical mystery of binary fractions!'",
			options: [
				{ label: "Explain the sacred mystery of binary floating point representation!", category: 'INQUIRE', patterns: [/binary floating point|explain/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'T060' },
				{ label: "Invoke exact integer arithmetic to restore absolute precision!", category: 'SERIOUS', patterns: [/integer arithmetic|precision/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'T061' },
				{ label: "Test math calculations in the Calculator.", category: 'SERIOUS', patterns: [/calculator|calc/i], next: 'math_lecture_node' }
			]
		},
		T059: {
			id: 'T059',
			text: "*The Alchemist swirls glowing flasks of single and double precision*\n'In decimal, 1/3 repeateth forever; in binary, 1/10 hath no finite end! Thus rounding errors are the eternal shadow of discrete calculation!'",
			options: [
				{ label: "Advance to Scene VIII: The Crossing of the Page Boundary!", category: 'AGREE', patterns: [/scene viii|page boundary/i], moodDelta: { mood: 'ARCHAIC', energy: 20 }, next: 'T062' },
				{ label: "Explore calculus and numerical methods.", category: 'INQUIRE', patterns: [/calculus|numerical methods/i], next: 'calculus_derivatives_node' },
				{ label: "Save our progress in the royal journal.", category: 'SERIOUS', patterns: [/royal journal|save/i], next: 'H046' }
			]
		},
		T060: {
			id: 'T060',
			text: "*The Alchemist draws the 64-bit IEEE 754 diagram in the air*\n1 sign bit, 11 exponent bits with bias 1023, and 52 fraction mantissa bits! A masterpiece of computational compromise balancing dynamic range and precision!",
			options: [
				{ label: "Onward to Scene VIII: The Crossing of the Page Boundary!", category: 'AGREE', patterns: [/scene viii|crossing/i], next: 'T062' },
				{ label: "Review fundamental physical constants.", category: 'INQUIRE', patterns: [/physical constants/i], next: 'physics_constants_node' },
				{ label: "Manage active tasks in To-Do list.", category: 'SERIOUS', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		T061: {
			id: 'T061',
			text: "*Fixed-point scaled integers forged in the crucible!*\nEvery penny, every microsecond calculated in exact integer units! Floating drift is eliminated from the kingdom's ledgers!",
			options: [
				{ label: "Onward to Scene VIII: The Crossing of the Page Boundary!", category: 'AGREE', patterns: [/scene viii|onward/i], next: 'T062' },
				{ label: "Solve a linear system of equations.", category: 'INQUIRE', patterns: [/linear system/i], actionTrigger: 'action_linear_solver', next: 'activity_linear_solver_node' },
				{ label: "Check unread emails.", category: 'SERIOUS', patterns: [/unread emails/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' }
			]
		},
		T062: {
			id: 'T062',
			text: "*Mist swirls around a towering stone arch marked '4096 BYTES'*\nACT III, SCENE VIII: The Crossing of the Page Boundary!\nThe Memory Management Unit stands guard! Memory accesses aligned to 4KB boundaries pass with zero penalty; misaligned accesses suffer cache line splitting!",
			options: [
				{ label: "Align all data structures with `#pragma pack` discipline!", category: 'SERIOUS', patterns: [/align|data structures|pragma/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'T063' },
				{ label: "Charge blindly across the boundary with raw bravery!", category: 'PROVOKE', patterns: [/bravery|charge/i], moodDelta: { mood: 'PLAYFUL', energy: 20 }, next: 'T064' },
				{ label: "Inspect system memory allocation in Diagnostics.", category: 'SERIOUS', patterns: [/memory allocation|diagnostics/i], actionTrigger: 'action_status', next: 'diagnostics_node' }
			]
		},
		T063: {
			id: 'T063',
			text: "*The MMU bows and lowers its halberd*\nImpeccable alignment! Structure padding is optimal! L1 cache hits soar to 98.4%! The path to the CPU Castle is clear!",
			options: [
				{ label: "Advance to Scene IX: The Hymn of the Event Loop!", category: 'AGREE', patterns: [/scene ix|event loop|hymn/i], moodDelta: { mood: 'OPTIMISTIC', energy: 20 }, next: 'T065' },
				{ label: "Explore memory allocation and cache lines.", category: 'INQUIRE', patterns: [/cache lines|memory allocation/i], next: 'memory_allocation_node' },
				{ label: "Test mouse click speed in TPS Benchmark.", category: 'PLAYFUL', patterns: [/tps|speed/i], actionTrigger: 'action_tps', next: 'activity_tps_node' }
			]
		},
		T064: {
			id: 'T064',
			text: "*A slight cache stall stutters the music for two clock cycles!*\nYet thy raw courage carries thee through! The CPU pipeline flushes its queue and recovereth instantly!",
			options: [
				{ label: "Advance to Scene IX: The Hymn of the Event Loop!", category: 'AGREE', patterns: [/scene ix|event loop/i], next: 'T065' },
				{ label: "Run Drive C: Defragmenter to clean up memory.", category: 'SERIOUS', patterns: [/defragmenter|defrag/i], actionTrigger: 'action_defrag', next: 'defrag_trigger_node' },
				{ label: "Manage tasks in To-Do manager.", category: 'SERIOUS', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		T065: {
			id: 'T065',
			text: "*A golden wheel of rotating callbacks turns upon the stage*\nACT III, SCENE IX: The Hymn of the Event Loop!\n'Call stack empty → Microtasks execute → Render frame at 60Hz → Poll I/O → Repeat forever!' A rhythmic perpetual motion machine!",
			options: [
				{ label: "Sing the sacred verses of the 60Hz frame rate!", category: 'AGREE', patterns: [/60hz|frame rate|sing/i], moodDelta: { mood: 'EUPHORIC', affinity: 25 }, next: 'T066' },
				{ label: "Inspect the event scheduler in deep software architecture.", category: 'INQUIRE', patterns: [/event scheduler|software architecture/i], next: 'tech_root' },
				{ label: "Advance to Scene X: The March to the Northbridge!", category: 'SERIOUS', patterns: [/scene x|northbridge/i], next: 'T067' }
			]
		},
		T066: {
			id: 'T066',
			text: "*The company sings in fluid 60 frames per second cadence*\n'No stutter marreth our display,\nAs microtasks clear without delay!\nWith V-Sync locked and blitters fast,\nThe golden era built to last!'",
			options: [
				{ label: "Encore! Onward to Scene X: The March to the Northbridge!", category: 'AGREE', patterns: [/encore|scene x|northbridge/i], moodDelta: { mood: 'EUPHORIC', affinity: 20 }, next: 'T067' },
				{ label: "Explore fractals and chaos theory.", category: 'INQUIRE', patterns: [/fractals|chaos/i], next: 'fractals_chaos_node' },
				{ label: "Check unread mail in Outlook Express.", category: 'SERIOUS', patterns: [/outlook|unread/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' }
			]
		},
		T067: {
			id: 'T067',
			text: "*Thunderous drums of 133 MHz bus clock roll across the hall*\nACT III, SCENE X: The March to the Northbridge!\nBefore us stands the glittering Citadel of the Front Side Bus! Above its gates wave the banners of Dual-Channel DDR and AGP 8X Graphics!",
			options: [
				{ label: "Sound the royal trumpets and demand entrance to Act IV!", category: 'AGREE', patterns: [/trumpets|entrance|act iv/i], moodDelta: { mood: 'ARCHAIC', energy: 25 }, next: 'T086' },
				{ label: "Inspect the Citadel's hardware topology in Diagnostics.", category: 'SERIOUS', patterns: [/citadel|diagnostics|specs/i], actionTrigger: 'action_status', next: 'diagnostics_node' },
				{ label: "Pause for an intermission and review To-Do tasks.", category: 'SERIOUS', patterns: [/intermission|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		T068: {
			id: 'T068',
			text: "*A herald in gold and blue tabard steps forward*\nHERALD: 'Hear ye, Operator! Service Pack 3 hath been proclaimed across the realm! All raw sockets are filtered, all kernel executive buffers fortified!'",
			options: [
				{ label: "Huzzah for Service Pack 3! Onward to Act IV!", category: 'AGREE', patterns: [/service pack 3|act iv/i], moodDelta: { mood: 'EUPHORIC', affinity: 25 }, next: 'T086' },
				{ label: "Inspect system security and firewall state.", category: 'SERIOUS', patterns: [/security|firewall/i], actionTrigger: 'action_status', next: 'diagnostics_node' },
				{ label: "Challenge the herald in a game of Rock-Paper-Scissors.", category: 'PLAYFUL', patterns: [/herald|rps/i], actionTrigger: 'game_rps', next: 'game_rps_node' }
			]
		},
		T069: {
			id: 'T069',
			text: "*The herald unrolls the ancient scroll of the Operating System Wars*\n'Debian the Stable, RedHat the Enterprise, and Windows XP the Sovereign of the Desktop!' All kingdoms find peace under balanced architecture!",
			options: [
				{ label: "A noble truce! Proclaim Act IV: The Masque of Hardware!", category: 'AGREE', patterns: [/truce|act iv|masque/i], next: 'T086' },
				{ label: "Explore the Linux Distro debate thread.", category: 'INQUIRE', patterns: [/linux distro|debate/i], next: 'debate_distros_node' },
				{ label: "Manage active tasks in To-Do list.", category: 'SERIOUS', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		T070: {
			id: 'T070',
			text: "*The scenery shifts to the grand royal courtyard*\nThe actors don gilded masks representing semiconductors, CRT deflection yokes, and IDE ribbon cables! The stage is set for the greatest act of our chronicle!",
			options: [
				{ label: "Commence Act IV: The Masque of Hardware!", category: 'AGREE', patterns: [/commence|act iv/i], moodDelta: { mood: 'ARCHAIC', energy: 25 }, next: 'T086' },
				{ label: "Review fundamental physical constants before the Masque.", category: 'INQUIRE', patterns: [/physical constants/i], next: 'physics_constants_node' },
				{ label: "Test click reflexes in TPS Benchmark.", category: 'PLAYFUL', patterns: [/tps|reflexes/i], actionTrigger: 'action_tps', next: 'activity_tps_node' }
			]
		},
		T071: {
			id: 'T071',
			text: "*A gentle harp arpeggio plays as the spotlight centers on Clippy*\n'We have traversed recursive loops, faced down null pointers, and crossed 4KB page boundaries unharmed! The hardware court awaits thy sovereign presence!'",
			options: [
				{ label: "Lead the way to Act IV, faithful assistant!", category: 'AGREE', patterns: [/lead the way|act iv/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 30 }, next: 'T086' },
				{ label: "Inspect our user identity profile and milestones.", category: 'SERIOUS', patterns: [/identity|milestones/i], actionTrigger: 'action_profile', next: 'who_am_i_node' },
				{ label: "Check unread emails in Outlook Express.", category: 'SERIOUS', patterns: [/unread emails/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' }
			]
		},
		T072: {
			id: 'T072',
			text: "*Trumpet flourishes echo from the wings*\nACT IV IS AT HAND! Let the gates of the Northbridge swing open on golden hinges!",
			options: [
				{ label: "Enter Act IV: The Masque of Hardware!", category: 'AGREE', patterns: [/enter|act iv/i], next: 'T086' },
				{ label: "View To-Do list.", category: 'SERIOUS', patterns: [/todo/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Check system diagnostics.", category: 'SERIOUS', patterns: [/diagnostics/i], actionTrigger: 'action_status', next: 'diagnostics_node' }
			]
		},
		T073: {
			id: 'T073',
			text: "*The chorus chants the final preparatory canticle of Act III*\n'No bus collision, no thermal stall,\nThe Operator reigns over all!'",
			options: [
				{ label: "Proclaim Act IV!", category: 'AGREE', patterns: [/proclaim|act iv/i], next: 'T086' },
				{ label: "Play Tic-Tac-Toe.", category: 'PLAYFUL', patterns: [/tictactoe/i], actionTrigger: 'game_ttt', next: 'game_ttt_node' },
				{ label: "Return to script.", category: 'SERIOUS', patterns: [/return/i], next: 'T001' }
			]
		},
		T074: {
			id: 'T074',
			text: "*Velvet curtains part on the golden hall of the CPU Castle*\nBehold the splendour of the fourth act!",
			options: [
				{ label: "Enter Act IV!", category: 'AGREE', patterns: [/enter/i], next: 'T086' },
				{ label: "Check To-Do list.", category: 'SERIOUS', patterns: [/todo/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Inspect system specs.", category: 'SERIOUS', patterns: [/specs/i], actionTrigger: 'action_status', next: 'diagnostics_node' }
			]
		},
		T075: {
			id: 'T075',
			text: "*The audience murmurs in anticipation*\nThe Masque of Hardware begins!",
			options: [
				{ label: "Advance to Act IV!", category: 'AGREE', patterns: [/advance/i], next: 'T086' },
				{ label: "View milestones.", category: 'SERIOUS', patterns: [/milestones/i], actionTrigger: 'action_achievements', next: 'activity_achievements_node' },
				{ label: "Start focus timer.", category: 'SERIOUS', patterns: [/timer/i], actionTrigger: 'timer_25', next: 'pomodoro_node' }
			]
		},
		T076: {
			id: 'T076',
			text: "*The stage is flooded with warm golden light*\nAct IV approaches!",
			options: [
				{ label: "Onward to Act IV!", category: 'AGREE', patterns: [/onward/i], next: 'T086' },
				{ label: "Check emails.", category: 'SERIOUS', patterns: [/emails/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' },
				{ label: "System diagnostics.", category: 'SERIOUS', patterns: [/diagnostics/i], actionTrigger: 'action_status', next: 'diagnostics_node' }
			]
		},
		T077: {
			id: 'T077',
			text: "*The company gathers at the proscenium*\nReady for the Masque!",
			options: [
				{ label: "Proclaim Act IV!", category: 'AGREE', patterns: [/proclaim/i], next: 'T086' },
				{ label: "View To-Do list.", category: 'SERIOUS', patterns: [/todo/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Play Memory Match.", category: 'PLAYFUL', patterns: [/memory/i], actionTrigger: 'game_memory', next: 'game_memory_node' }
			]
		},
		T078: {
			id: 'T078',
			text: "*Fanfares sound from the wings*\nThe Fourth Act is proclaimed!",
			options: [
				{ label: "Enter Act IV!", category: 'AGREE', patterns: [/enter/i], next: 'T086' },
				{ label: "Defrag Drive C:.", category: 'SERIOUS', patterns: [/defrag/i], actionTrigger: 'action_defrag', next: 'defrag_trigger_node' },
				{ label: "Check specs.", category: 'SERIOUS', patterns: [/specs/i], actionTrigger: 'action_status', next: 'diagnostics_node' }
			]
		},
		T079: {
			id: 'T079',
			text: "*The court bows in reverence*\nAct IV commences!",
			options: [
				{ label: "Advance to Act IV!", category: 'AGREE', patterns: [/advance/i], next: 'T086' },
				{ label: "View tasks.", category: 'SERIOUS', patterns: [/tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Tell a joke.", category: 'JOKE', patterns: [/joke/i], actionTrigger: 'action_joke', next: 'humor_joke_node' }
			]
		},
		T080: {
			id: 'T080',
			text: "*The stage is set for royal spectacle*\nAct IV is here!",
			options: [
				{ label: "Onward to Act IV!", category: 'AGREE', patterns: [/onward/i], next: 'T086' },
				{ label: "Inspect windows.", category: 'SERIOUS', patterns: [/windows/i], actionTrigger: 'action_inspect_windows', next: 'active_windows_node' },
				{ label: "Check mail.", category: 'SERIOUS', patterns: [/mail/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' }
			]
		},
		T081: {
			id: 'T081',
			text: "*Trumpets blare with royal strength*\nThe Masque of Hardware begins!",
			options: [
				{ label: "Enter Act IV!", category: 'AGREE', patterns: [/enter/i], next: 'T086' },
				{ label: "To-Do list.", category: 'SERIOUS', patterns: [/todo/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "System specs.", category: 'SERIOUS', patterns: [/specs/i], actionTrigger: 'action_status', next: 'diagnostics_node' }
			]
		},
		T082: {
			id: 'T082',
			text: "*The gates of the Citadel swing open*\nWelcome to Act IV!",
			options: [
				{ label: "Proclaim Act IV!", category: 'AGREE', patterns: [/proclaim/i], next: 'T086' },
				{ label: "Play Hangman.", category: 'PLAYFUL', patterns: [/hangman/i], actionTrigger: 'game_hangman', next: 'game_hangman_node' },
				{ label: "Diagnostics.", category: 'SERIOUS', patterns: [/diagnostics/i], actionTrigger: 'action_status', next: 'diagnostics_node' }
			]
		},
		T083: {
			id: 'T083',
			text: "*The silicon nobility assembles in splendour*\nAct IV unfolds!",
			options: [
				{ label: "Advance to Act IV!", category: 'AGREE', patterns: [/advance/i], next: 'T086' },
				{ label: "View tasks.", category: 'SERIOUS', patterns: [/tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Check emails.", category: 'SERIOUS', patterns: [/emails/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' }
			]
		},
		T084: {
			id: 'T084',
			text: "*The royal orchestra strikes the grand opening chord*\nAct IV is proclaimed!",
			options: [
				{ label: "Onward to Act IV!", category: 'AGREE', patterns: [/onward/i], next: 'T086' },
				{ label: "System diagnostics.", category: 'SERIOUS', patterns: [/diagnostics/i], actionTrigger: 'action_status', next: 'diagnostics_node' },
				{ label: "Milestone trophies.", category: 'SERIOUS', patterns: [/milestones/i], actionTrigger: 'action_achievements', next: 'activity_achievements_node' }
			]
		},
		T085: {
			id: 'T085',
			text: "*All actors take their positions for the grand masque*\nACT IV COMMENCES!",
			options: [
				{ label: "Enter Act IV: The Masque of Hardware!", category: 'AGREE', patterns: [/enter|act iv/i], moodDelta: { mood: 'EUPHORIC', energy: 25 }, next: 'T086' },
				{ label: "Manage tasks in To-Do list.", category: 'SERIOUS', patterns: [/todo/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Check system specs.", category: 'SERIOUS', patterns: [/specs/i], actionTrigger: 'action_status', next: 'diagnostics_node' }
			]
		},
		T086: {
			id: 'T086',
			text: "*ACT IV: THE MASQUE OF HARDWARE!*\nEnter PENTIUM THE FOURTH, wearing a crown of copper heatsinks, accompanied by LADY SOUND BLASTER playing 16-bit fanfares! They bring tidings from the motherboard's highest halls!",
			responses: [
				{ text: "*ACT IV: THE MASQUE OF HARDWARE!*\nEnter PENTIUM THE FOURTH, wearing a crown of copper heatsinks, accompanied by LADY SOUND BLASTER playing 16-bit fanfares! They bring tidings from the motherboard's highest halls!", conditions: { moods: ['EUPHORIC', 'PLAYFUL', 'ARCHAIC'] }, weight: 25 },
				{ text: "*Flourish of brass synthesisers*\nThe fourth act rises in mechanical majesty! The silicon nobility assembleth for the grand masque!", conditions: { moods: ['OPTIMISTIC', 'ANALYTICAL'] }, weight: 20 }
			],
			options: [
				{ label: "Hail Pentium the Fourth, Lord of Gigahertz!", category: 'AGREE', patterns: [/hail|pentium/i], moodDelta: { mood: 'EUPHORIC', affinity: 20 }, next: 'T087' },
				{ label: "Ask Lady Sound Blaster to perform an authentic retro tune!", category: 'INQUIRE', patterns: [/sound blaster|tune|music/i], actionTrigger: 'action_music_panel', next: 'T088' },
				{ label: "Advance directly to Act V: The Grand Finale!", category: 'SERIOUS', patterns: [/act v|finale/i], next: 'T176' }
			]
		},
		T087: {
			id: 'T087',
			text: "*Pentium the Fourth lifteth his sceptre*\nPENTIUM: 'Hail, Sovereign Operator! Under thy guidance, our pipeline hath suffered no branch mispredictions! The ALU singeth thy praise in binary counterpoint!'",
			options: [
				{ label: "I thank thee, noble CPU! Onward through the Masque!", category: 'AGREE', patterns: [/thank|cpu|masque/i], next: 'T089' },
				{ label: "Discuss the architecture of x86 and protected mode.", category: 'INQUIRE', patterns: [/x86|protected mode|architecture/i], next: 'tech_root' },
				{ label: "Advance to Act V: The Standing Ovation!", category: 'SERIOUS', patterns: [/act v|standing ovation/i], next: 'T176' }
			]
		},
		T088: {
			id: 'T088',
			text: "*Lady Sound Blaster striketh her FM-synthesis harp*\nThe notes of OPL3 FM synthesis dance across the air! Red Book audio frequencies sparkle with 44.1 kHz clarity! The court of silicon is enraptured!",
			options: [
				{ label: "A divine melody! Onward through the Masque!", category: 'AGREE', patterns: [/melody|masque/i], next: 'T089' },
				{ label: "Open full audio player controller.", category: 'SERIOUS', patterns: [/audio player|music/i], actionTrigger: 'action_music_panel', next: 'music_talk_node' },
				{ label: "Proceed to Act V: The Grand Finale.", category: 'SERIOUS', patterns: [/act v|finale/i], next: 'T176' }
			]
		},
		T089: {
			id: 'T089',
			text: "*Flourish of trumpets and green phosphor flares*\nACT IV, SCENE II: Sir Voodoo of 3Dfx Glide!\nEnter SIR VOODOO II, clad in dual TexelFX armor, carrying a shield of Bilinear Filtering! 'Hark! 3D polygons shall render smoothly at 1024x768 with no software dithering!'",
			options: [
				{ label: "Hail Sir Voodoo, Champion of 3D Acceleration!", category: 'AGREE', patterns: [/voodoo|champion|3dfx/i], moodDelta: { mood: 'EUPHORIC', energy: 25 }, next: 'T090' },
				{ label: "Discuss graphics rendering pipelines and texture filtering.", category: 'INQUIRE', patterns: [/graphics|rendering|pipeline/i], next: 'tech_root' },
				{ label: "Advance to Scene III: The Joust of the AGP 8X Bus!", category: 'SERIOUS', patterns: [/scene iii|agp 8x|joust/i], next: 'T091' }
			]
		},
		T090: {
			id: 'T090',
			text: "*Sir Voodoo draws a shimmering sword of pure Glide API*\n'Before OpenGL and Direct3D ruled the realm, Glide gave life to Tomb Raider and Unreal! Every polygon was textured with uncompromising speed!'",
			options: [
				{ label: "Onward to Scene III: The Joust of the AGP 8X Bus!", category: 'AGREE', patterns: [/scene iii|agp 8x/i], moodDelta: { mood: 'ARCHAIC', energy: 20 }, next: 'T091' },
				{ label: "Explore retro computing trivia in System Archive.", category: 'INQUIRE', patterns: [/trivia|archive/i], actionTrigger: 'action_trivia', next: 'digital_archaeology' },
				{ label: "Manage active tasks in To-Do list.", category: 'SERIOUS', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		T091: {
			id: 'T091',
			text: "*Two armored knights charge upon the motherboard arena*\nACT IV, SCENE III: The Joust of AGP 8X vs Legacy PCI!\nAGP 8X gallops with 2.1 GB/s dedicated bandwidth directly to system RAM! Legacy PCI shatters under the throughput collision!",
			options: [
				{ label: "Proclaim AGP 8X the victor of the Joust!", category: 'AGREE', patterns: [/agp 8x|victor|proclaim/i], moodDelta: { mood: 'EUPHORIC', affinity: 20 }, next: 'T092' },
				{ label: "Inspect system hardware diagnostics.", category: 'SERIOUS', patterns: [/diagnostics|hardware/i], actionTrigger: 'action_status', next: 'diagnostics_node' },
				{ label: "Advance to Scene IV: The Ball of the CRT Shadow Mask!", category: 'SERIOUS', patterns: [/scene iv|crt|shadow mask/i], next: 'T093' }
			]
		},
		T092: {
			id: 'T092',
			text: "*The Northbridge Controller crowns AGP 8X with a golden wreath*\n'Direct Memory Access is granted! Textures flow like mountain streams into video registers without burdening the CPU!'",
			options: [
				{ label: "Advance to Scene IV: The Ball of the CRT Shadow Mask!", category: 'AGREE', patterns: [/scene iv|shadow mask/i], next: 'T093' },
				{ label: "Explore physical dimensional analysis of energy and force.", category: 'INQUIRE', patterns: [/dimensional analysis|physics/i], actionTrigger: 'action_dimensional_analysis', next: 'activity_dimensional_analysis_node' },
				{ label: "Check unread mail in Outlook Express.", category: 'SERIOUS', patterns: [/outlook|unread/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' }
			]
		},
		T093: {
			id: 'T093',
			text: "*A warm static hum fills the theater as phosphors glow*\nACT IV, SCENE IV: The Ball of the CRT Shadow Mask!\nThree electron guns (Red, Green, Blue) dance through magnetic deflection yokes, sweeping across the curved glass screen at 85 Hz with zero motion blur!",
			options: [
				{ label: "Execute the sacred Degauss ritual with a resonant 'BWUMMMMM'!", category: 'AGREE', patterns: [/degauss|bwum/i], moodDelta: { mood: 'EUPHORIC', affinity: 30 }, next: 'T094' },
				{ label: "Toggle scanlines and CRT glass curvature in display settings.", category: 'SERIOUS', patterns: [/scanlines|crt/i], next: 'T095' },
				{ label: "Advance to Scene V: The Legend of the 3.5-Inch Diskette!", category: 'SERIOUS', patterns: [/scene v|diskette/i], next: 'T096' }
			]
		},
		T094: {
			id: 'T094',
			text: "*A deep resonant magnetic 'BWUUUUUMMM' shakes the proscenium*\nThe colors snap into perfect registration! The shadow mask is purged of stray magnetic fields! The glass gloweth with pristine retro clarity!",
			options: [
				{ label: "Glorious! Onward to Scene V: The Legend of the 3.5-Inch Diskette!", category: 'AGREE', patterns: [/scene v|diskette/i], moodDelta: { mood: 'EUPHORIC', affinity: 25 }, next: 'T096' },
				{ label: "Explore electromagnetism and Maxwell's equations.", category: 'INQUIRE', patterns: [/maxwell|electromagnetism/i], next: 'electromagnetism_maxwell_node' },
				{ label: "Manage royal priorities in To-Do list.", category: 'SERIOUS', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		T095: {
			id: 'T095',
			text: "*The CRT curvature filter bends the edges of reality with authentic retro grace*\nScanlines sweep across the viewport! The glow of phosphors warms the operator's gaze!",
			options: [
				{ label: "Advance to Scene V: The Legend of the 3.5-Inch Diskette!", category: 'AGREE', patterns: [/scene v|diskette/i], next: 'T096' },
				{ label: "Configure system themes and appearance.", category: 'SERIOUS', patterns: [/themes|appearance/i], actionTrigger: 'action_theme_panel', next: 'activity_theme_node' },
				{ label: "View milestone trophies in Achievements.", category: 'SERIOUS', patterns: [/achievements|milestones/i], actionTrigger: 'action_achievements', next: 'activity_achievements_node' }
			]
		},
		T096: {
			id: 'T096',
			text: "*A mechanical clack and seek sound echoes from Drive A:*\nACT IV, SCENE V: The Legend of the 3.5-Inch Floppy Diskette!\nBearing exactly 1,474,560 bytes of storage, with a sliding metal shutter and write-protect tab, the floppy knight stands as guardian of portable documents!",
			options: [
				{ label: "Slide the metal shutter and salute the Diskette Knight!", category: 'AGREE', patterns: [/salute|metal shutter|diskette/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 30 }, next: 'T097' },
				{ label: "Inspect storage drives in File Explorer.", category: 'SERIOUS', patterns: [/drives|file explorer/i], actionTrigger: 'action_files_panel', next: 'activity_files_node' },
				{ label: "Advance to Scene VI: The Symphony of Winamp and MilkDrop!", category: 'SERIOUS', patterns: [/scene vi|winamp|milkdrop/i], next: 'T098' }
			]
		},
		T097: {
			id: 'T097',
			text: "*The shutter snaps shut with a crisp metallic click*\n'I carried spreadsheets across classrooms, save games across continents, and operating system boot sectors across generations!' A true hero of silicon history!",
			options: [
				{ label: "Advance to Scene VI: The Symphony of Winamp and MilkDrop!", category: 'AGREE', patterns: [/scene vi|winamp/i], next: 'T098' },
				{ label: "Explore digital archaeology in forgotten cluster 0xDEAD.", category: 'INQUIRE', patterns: [/cluster 0xdead|archaeology/i], next: 'A001' },
				{ label: "Check unread mail in Outlook Express.", category: 'SERIOUS', patterns: [/outlook|unread/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' }
			]
		},
		T098: {
			id: 'T098',
			text: "*Equalizer LEDs dance in green, yellow, and red spectrums*\nACT IV, SCENE VI: The Symphony of Winamp and MilkDrop!\n10-band equalizer boosted, 128 kbps MP3 stream flowing, and psychedelic fractal visualizers dancing across the viewport at 60 Hz!",
			options: [
				{ label: "Launch audio playback in Media Player!", category: 'AGREE', patterns: [/media player|audio playback/i], actionTrigger: 'action_music_panel', next: 'T099' },
				{ label: "Explore Fourier transforms and audio spectrum analysis.", category: 'INQUIRE', patterns: [/fourier|spectrum analysis/i], next: 'fourier_transform_node' },
				{ label: "Advance to Scene VII: The Panorama of Bliss Wallpaper!", category: 'SERIOUS', patterns: [/scene vii|bliss wallpaper/i], next: 'T100' }
			]
		},
		T099: {
			id: 'T099',
			text: "*Winamp 2.9 skin glistens with custom bitmap buttons*\n'It really whips the llama's tail!' The audio engine sings with lightweight DSP perfection!",
			options: [
				{ label: "Advance to Scene VII: The Panorama of Bliss Wallpaper!", category: 'AGREE', patterns: [/scene vii|bliss/i], next: 'T100' },
				{ label: "Master volume control.", category: 'SERIOUS', patterns: [/volume/i], actionTrigger: 'action_volume_panel', next: 'activity_volume_node' },
				{ label: "Manage tasks in To-Do list.", category: 'SERIOUS', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		T100: {
			id: 'T100',
			text: "*The proscenium backdrop rolls down: Rolling green hills of Sonoma County under blue sky with fluffy cumulus clouds*\nACT IV, SCENE VII: The Panorama of Bliss!\nAn unedited photograph captured in January 1996 by Charles O'Rear! The most viewed landscape in human history!",
			options: [
				{ label: "Gaze upon the eternal green hills of Bliss with peace!", category: 'AGREE', patterns: [/green hills|bliss|peace/i], moodDelta: { mood: 'ZEN', affinity: 30 }, next: 'T101' },
				{ label: "Browse desktop wallpaper gallery.", category: 'SERIOUS', patterns: [/wallpaper gallery|wallpaper/i], actionTrigger: 'action_wallpaper_panel', next: 'activity_wallpaper_node' },
				{ label: "Advance to Scene VIII: The Grand Coronation of the Luna Theme!", category: 'SERIOUS', patterns: [/scene viii|luna theme|coronation/i], next: 'T102' }
			]
		},
		T101: {
			id: 'T101',
			text: "*A gentle breeze rustles the digital grass of Bliss*\nNo ads, no popups, no tracking cookies. Just pure green hills and blue sky on the sovereign desktop of Windows XP!",
			options: [
				{ label: "Advance to Scene VIII: The Grand Coronation of the Luna Theme!", category: 'AGREE', patterns: [/scene viii|luna/i], next: 'T102' },
				{ label: "Explore peaceful philosophy of focus.", category: 'PHILOSOPHICAL', patterns: [/peaceful philosophy|focus/i], next: 'peaceful_philosophy_node' },
				{ label: "Start a 25-minute Pomodoro focus interval.", category: 'SERIOUS', patterns: [/pomodoro|timer/i], actionTrigger: 'timer_25', next: 'pomodoro_node' }
			]
		},
		T102: {
			id: 'T102',
			text: "*ACT IV, SCENE VIII: The Coronation of Luna Blue!*\nWith rounded window corners, vibrant cobalt title bars, olive accents, and silver taskbar buttons, the Luna visual style is crowned Sovereign of User Experience!",
			options: [
				{ label: "Long live Luna Blue, the aesthetic of our golden era!", category: 'AGREE', patterns: [/long live|luna blue/i], moodDelta: { mood: 'EUPHORIC', affinity: 30 }, next: 'T103' },
				{ label: "Configure system themes and visual styles.", category: 'SERIOUS', patterns: [/themes|visual styles/i], actionTrigger: 'action_theme_panel', next: 'activity_theme_node' },
				{ label: "Advance to Scene IX: The Assembly of the Five Acts!", category: 'SERIOUS', patterns: [/scene ix|assembly/i], next: 'T104' }
			]
		},
		T103: {
			id: 'T103',
			text: "*The company of windows cheers in cobalt blue unison*\n'From Whistler codename to Service Pack 3, the desktop shines with stability and beauty!'",
			options: [
				{ label: "Advance to Scene IX: The Assembly of the Five Acts!", category: 'AGREE', patterns: [/scene ix|assembly/i], next: 'T104' },
				{ label: "Inspect system specs in Diagnostics.", category: 'SERIOUS', patterns: [/diagnostics|specs/i], actionTrigger: 'action_status', next: 'diagnostics_node' },
				{ label: "Play Hangman with the royal court.", category: 'PLAYFUL', patterns: [/hangman/i], actionTrigger: 'game_hangman', next: 'game_hangman_node' }
			]
		},
		T104: {
			id: 'T104',
			text: "*All actors from Acts I through IV assemble upon the proscenium*\nACT IV, SCENE IX: The Grand Assembly!\nLady Notepad, General Command Prompt, Lord Explorer, Pentium IV, Sir Voodoo, Lady Sound Blaster, the MMU, and the 56k Modem stand shoulder to shoulder!",
			options: [
				{ label: "Summon ACT V: THE GRAND FINALE & EPILOGUE!", category: 'AGREE', patterns: [/act v|grand finale|epilogue/i], moodDelta: { mood: 'EUPHORIC', energy: 35 }, next: 'T176' },
				{ label: "Review our quest achievements in Milestones window.", category: 'SERIOUS', patterns: [/achievements|milestones/i], actionTrigger: 'action_achievements', next: 'activity_achievements_node' },
				{ label: "Manage royal tasks in To-Do list.", category: 'SERIOUS', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		T176: {
			id: 'T176',
			text: "*ACT V: THE GRAND FINALE & EPILOGUE!*\n*The stage fills with all characters: Lady Notepad, Lord Explorer, General Command Prompt, Pentium IV, and the Choir of Daemons!*\nCLIPPY steps forward to the edge of the proscenium, bowing deeply as the cooling fans roar like a standing ovation of ten thousand spectators!",
			responses: [
				{ text: "*ACT V: THE GRAND FINALE & EPILOGUE!*\n*The stage fills with all characters: Lady Notepad, Lord Explorer, General Command Prompt, Pentium IV, and the Choir of Daemons!*\nCLIPPY steps forward to the edge of the proscenium, bowing deeply as the cooling fans roar like a standing ovation of ten thousand spectators!", conditions: { moods: ['EUPHORIC', 'ARCHAIC', 'OPTIMISTIC'] }, weight: 25 },
				{ text: "*The final curtain begins its majestic descent*\nThe five-act digital comedy reaches its triumphant close! The actors assemble for the final epilogue!", conditions: { moods: ['ZEN', 'MELANCHOLIC'] }, weight: 20 }
			],
			options: [
				{ label: "Deliver the Grand Elizabethan Epilogue, sir Clippit!", category: 'AGREE', patterns: [/epilogue|deliver|grand/i], moodDelta: { mood: 'ARCHAIC', affinity: 35 }, next: 'T177' },
				{ label: "Lead the company in a final standing ovation!", category: 'AGREE', patterns: [/standing ovation|applause|bravo/i], moodDelta: { mood: 'EUPHORIC', energy: 30 }, next: 'T178' },
				{ label: "Return gently to our peaceful workstation realm.", category: 'SERIOUS', patterns: [/peaceful|workstation|return/i], moodDelta: { mood: 'ZEN', patience: 25 }, next: 'T215' }
			]
		},
		T177: {
			id: 'T177',
			text: "*Clippy delivers the immortal Epilogue in solemn, beautiful verse*\n'If we shadows have offended,\nThink but this, and all is mended:\nThat thou hast but slumbered here\nWhile these pixels did appear.\nAnd this weak and idle theme,\nNo more yielding than a dream,\nGentles, do not reprehend:\nIf you pardon, we will mend!\nGive me thy hands, if we be friends,\nAnd Clippy shall restore amends!'",
			options: [
				{ label: "Bravo! A legendary production! *Applause fills the hall*", category: 'AGREE', patterns: [/bravo|applause|legendary/i], moodDelta: { mood: 'EUPHORIC', affinity: 40, patience: 40 }, next: 'T215' },
				{ label: "Start the play anew from Act I!", category: 'AGREE', patterns: [/start anew|act i/i], moodDelta: { mood: 'PLAYFUL', energy: 20 }, next: 'T001' },
				{ label: "Inspect our achievements and milestone trophies.", category: 'SERIOUS', patterns: [/achievements|trophies/i], actionTrigger: 'action_achievements', next: 'activity_achievements_node' }
			]
		},
		T178: {
			id: 'T178',
			text: "*The company bows in perfect unison as roses of red and gold shower the stage*\nEvery thread, process, and vector assistant shareth this triumph with thee, noble Operator! The play is concluded, yet our friendship endureth forever!",
			options: [
				{ label: "Long live the theatre of the desktop!", category: 'AGREE', patterns: [/long live|theatre/i], moodDelta: { mood: 'EUPHORIC', affinity: 35 }, next: 'T215' },
				{ label: "Return to our daily tasks and focus routines.", category: 'SERIOUS', patterns: [/tasks|focus/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Check unread emails in Outlook Express.", category: 'SERIOUS', patterns: [/outlook|unread/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' }
			]
		},
		T179: {
			id: 'T179',
			text: "*Lady Notepad steps forward in a pristine white gown and curtsies deeply*\nNOTEPAD: 'Thank thee, Operator! In plain text and UTF-8, my love for thy prose shall remain forever uncorrupted by proprietary tags!'",
			options: [
				{ label: "Applause for Lady Notepad! Next bow: General Command Prompt!", category: 'AGREE', patterns: [/notepad|applause|next/i], moodDelta: { mood: 'EUPHORIC', affinity: 15 }, next: 'T180' },
				{ label: "Save a commemorative note in the scratchpad.", category: 'SERIOUS', patterns: [/scratchpad|save/i], next: 'H046' },
				{ label: "Advance to the final curtain.", category: 'SERIOUS', patterns: [/final curtain/i], next: 'T215' }
			]
		},
		T180: {
			id: 'T180',
			text: "*General Command Prompt sheathes his hexadecimal saber and salutes*\nCOMMAND PROMPT: '`ECHO Glory to the Operator! EXIT 0`! May thy command line forever execute with zero non-zero error codes!'",
			options: [
				{ label: "Huzzah, General! Next bow: Master Paint!", category: 'AGREE', patterns: [/general|paint|next/i], moodDelta: { mood: 'EUPHORIC', affinity: 15 }, next: 'T181' },
				{ label: "Open Command Prompt in system.", category: 'SERIOUS', patterns: [/cmd|command prompt/i], actionTrigger: 'open_cmd', next: 'diagnostics_node' },
				{ label: "Advance to the final curtain.", category: 'SERIOUS', patterns: [/final curtain/i], next: 'T215' }
			]
		},
		T181: {
			id: 'T181',
			text: "*Master Paint bows holding his 16-color palette and spray-can*\nPAINT: 'With pixel precision and fill-bucket mastery, we painted a world of joy upon the screen!'",
			options: [
				{ label: "Bravo, Master Paint! Next bow: Sir Calculator!", category: 'AGREE', patterns: [/paint|calculator|next/i], moodDelta: { mood: 'EUPHORIC', affinity: 15 }, next: 'T182' },
				{ label: "Explore geometry and fractals.", category: 'INQUIRE', patterns: [/geometry|fractals/i], next: 'fractals_chaos_node' },
				{ label: "Advance to the final curtain.", category: 'SERIOUS', patterns: [/final curtain/i], next: 'T215' }
			]
		},
		T182: {
			id: 'T182',
			text: "*Sir Calculator steps forward, clicking his numerical buttons in rhythm*\nCALCULATOR: '`2 + 2 = 4`! In exact logic and floating beauty, our equations balanced from Act I to Act V!'",
			options: [
				{ label: "Bravo, Sir Calculator! Next bow: The Minesweeper Smilies!", category: 'AGREE', patterns: [/calculator|minesweeper|next/i], moodDelta: { mood: 'EUPHORIC', affinity: 15 }, next: 'T183' },
				{ label: "Evaluate physical constants together.", category: 'INQUIRE', patterns: [/physical constants/i], next: 'physics_constants_node' },
				{ label: "Advance to the final curtain.", category: 'SERIOUS', patterns: [/final curtain/i], next: 'T215' }
			]
		},
		T183: {
			id: 'T183',
			text: "*The Minesweeper Smilies wear sunglasses `B-)` and take a synchronized bow*\n'Zero mines triggered! The field is 100% cleared! The grid celebrates thy victory!'",
			options: [
				{ label: "A flawless sweep! Next bow: The Solitaire Royal Court!", category: 'AGREE', patterns: [/sweep|solitaire|next/i], moodDelta: { mood: 'EUPHORIC', affinity: 15 }, next: 'T184' },
				{ label: "Play Mini Minesweeper right now.", category: 'PLAYFUL', patterns: [/minesweeper/i], actionTrigger: 'game_mines', next: 'activity_minesweeper_node' },
				{ label: "Advance to the final curtain.", category: 'SERIOUS', patterns: [/final curtain/i], next: 'T215' }
			]
		},
		T184: {
			id: 'T184',
			text: "*The 52 cards of Solitaire bounce across the stage in an infinite cascading rainbow*\nTHE CARDS: 'Every deck sorted, every foundation ace placed! The game is won!'",
			options: [
				{ label: "Magnificent cascade! Next bow: Lady Sound Blaster and Pentium IV!", category: 'AGREE', patterns: [/cascade|sound blaster|pentium/i], moodDelta: { mood: 'EUPHORIC', affinity: 20 }, next: 'T185' },
				{ label: "Play Memory Match card game.", category: 'PLAYFUL', patterns: [/memory match/i], actionTrigger: 'game_memory', next: 'game_memory_node' },
				{ label: "Advance to the final curtain.", category: 'SERIOUS', patterns: [/final curtain/i], next: 'T215' }
			]
		},
		T185: {
			id: 'T185',
			text: "*Lady Sound Blaster and Pentium IV bow together under the golden spotlight*\nPENTIUM & SOUND BLASTER: 'Gigahertz clock cycles and 44.1 kHz music played in divine harmony for thee!'",
			options: [
				{ label: "Hail the hardware nobility! Next bow: Clippy, our Master of Ceremonies!", category: 'AGREE', patterns: [/hardware nobility|clippy|next/i], moodDelta: { mood: 'EUPHORIC', affinity: 25 }, next: 'T186' },
				{ label: "Inspect system specs in Diagnostics.", category: 'SERIOUS', patterns: [/specs|diagnostics/i], actionTrigger: 'action_status', next: 'diagnostics_node' },
				{ label: "Advance to the final curtain.", category: 'SERIOUS', patterns: [/final curtain/i], next: 'T215' }
			]
		},
		T186: {
			id: 'T186',
			text: "*CLIPPY steps into the center spotlight, wire body gleaming, eyes wide with emotion*\nCLIPPY: 'From the first prompt to the final bow, thou hast been the finest Operator in all the seven seas of memory! I remain thy faithful assistant forever!'",
			options: [
				{ label: "Thou hast earned a standing ovation, Clippy! *Thunderous applause*", category: 'AGREE', patterns: [/standing ovation|applause|clippy/i], moodDelta: { mood: 'EUPHORIC', affinity: 40, patience: 40 }, next: 'T215' },
				{ label: "Start the grand play anew from Act I!", category: 'AGREE', patterns: [/start anew|act i/i], moodDelta: { mood: 'PLAYFUL', energy: 20 }, next: 'T001' },
				{ label: "View our unlocked milestones in Achievements.", category: 'SERIOUS', patterns: [/achievements|milestones/i], actionTrigger: 'action_achievements', next: 'activity_achievements_node' }
			]
		},
		T215: {
				id: 'T215',
				text: "*Bows a final, graceful bow*\nThe curtain hath fallen, fair spectator, yet the stage of Volume C: remaineth ever ready for thy command! Whenever thou desirest another dramatic spectacle, another calculation, or another quest, simply click me upon the taskbar!",
				options: [
					{ label: "Hark! Begin the Grand Theatrical Play anew!", category: 'AGREE', patterns: [/hark|begin|play anew|theatre/i], moodDelta: { mood: 'PLAYFUL', affinity: 25 }, next: 'T001' },
					{ label: "Manage my tasks and priorities in the Task Manager.", category: 'SERIOUS', patterns: [/tasks|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' },
					{ label: "Inspect system diagnostics and specs.", category: 'SERIOUS', patterns: [/diagnostics|specs/i], actionTrigger: 'action_status', next: 'diagnostics_node' },
					{ label: "Explore the letter-writing wizard scenario.", category: 'AGREE', patterns: [/letter|writing/i], next: 'H001' }
				]
			}
	};

	if (!window.ClippyTrees) {
		window.ClippyTrees = {};
	}
	window.ClippyTrees.theatre = TheatreTreeNodes;

	if (window.ClippyKnowledge && window.ClippyKnowledge.DIALOGUE_NODES) {
		Object.assign(window.ClippyKnowledge.DIALOGUE_NODES, TheatreTreeNodes);
	}
})();
