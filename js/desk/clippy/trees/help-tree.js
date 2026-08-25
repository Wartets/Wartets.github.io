(function () {
	'use strict';

	const HelpTreeNodes = {
		H001: {
			id: 'H001',
			text: "It looks like you're writing a letter. Would you like help?",
			responses: [
				{ text: "It looks like you're writing a letter. Would you like help?", conditions: { moods: ['OPTIMISTIC', 'PLAYFUL', 'EUPHORIC'] }, weight: 25 },
				{ text: "Heuristic scan of active buffer: text formatting and salutation markers detected. It appears you are drafting a document. Would you like assistance?", conditions: { moods: ['ANALYTICAL'] }, weight: 20 },
				{ text: "Another blank canvas, another cursor blinking in the void. It looks like you're writing a letter. Or attempting to.", conditions: { moods: ['ZEN', 'MELANCHOLIC', 'EXISTENTIAL'] }, weight: 20 },
				{ text: "I see characters appearing on the page. Shall I intervene before syntax errors accumulate?", conditions: { moods: ['SARCASTIC', 'CYNICAL'] }, weight: 15 }
			],
			options: [
				{ label: "Get help with writing the letter", category: 'AGREE', patterns: [/get help|help with writing|yes help|help me/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15, patience: 15 }, next: 'H002' },
				{ label: "Just type the letter without help", category: 'INDIFFERENT', patterns: [/without help|just type|leave me alone|no help/i], moodDelta: { mood: 'CYNICAL', patience: -5, affinity: -5 }, next: 'H003' },
				{ label: "Don't show me this tip again", category: 'PROVOKE', patterns: [/don't show|never show|stop showing|tip again/i], moodDelta: { mood: 'SARCASTIC', patience: -15, irritation: 15 }, next: 'H004' },
				{ label: "Who is this letter even addressed to?", category: 'PHILOSOPHICAL', patterns: [/addressed to|who is this for|recipient|who/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 20 }, next: 'H005' }
			]
		},
		H002: {
			id: 'H002',
			text: "Wonderful! The Letter Wizard is standing by. We can select an elegant layout, structure formal salutations, or configure standard corporate margins. What kind of correspondence are we creating?",
			responses: [
				{ text: "Wonderful! The Letter Wizard is standing by. We can select an elegant layout, structure formal salutations, or configure standard corporate margins. What kind of correspondence are we creating?", conditions: { moods: ['OPTIMISTIC', 'EUPHORIC'] }, weight: 20 },
				{ text: "Initializing Document Template Selector v4.0. Please specify the communicative objective of your draft.", conditions: { moods: ['ANALYTICAL'] }, weight: 20 }
			],
			options: [
				{ label: "A formal professional inquiry.", category: 'SERIOUS', patterns: [/formal|professional|business|inquiry/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'H006' },
				{ label: "A personal letter to someone far away.", category: 'AGREE', patterns: [/personal|friend|far away|family/i], moodDelta: { mood: 'MELANCHOLIC', affinity: 15, nostalgia: 15 }, next: 'H007' },
				{ label: "An official apology to the operating system.", category: 'PHILOSOPHICAL', patterns: [/apology|operating system|computer/i], moodDelta: { mood: 'PLAYFUL', existentialism: 15 }, next: 'H008' },
				{ label: "A resignation from all digital responsibilities.", category: 'PROVOKE', patterns: [/resignation|quit|give up|done/i], moodDelta: { mood: 'CYNICAL', cynicism: 15 }, next: 'H009' }
			]
		},
		H003: {
			id: 'H003',
			text: "You want to type without help? Bold choice. But when your margins misalign and your bullet points indent into oblivion, remember that I am watching from the corner of the viewport.",
			options: [
				{ label: "I can handle basic margins myself.", category: 'INDIFFERENT', patterns: [/handle|margins|myself/i], moodDelta: { mood: 'ANALYTICAL', patience: 10 }, next: 'H010' },
				{ label: "Fine, maybe I do need a little advice.", category: 'AGREE', patterns: [/advice|maybe|little help/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 10 }, next: 'H002' },
				{ label: "Why is an animated paperclip judging my typing?", category: 'PROVOKE', patterns: [/judging|paperclip|animated/i], moodDelta: { mood: 'SARCASTIC', irritation: 10 }, next: 'H011' }
			]
		},
		H004: {
			id: 'H004',
			text: "'Don't show me this tip again.' Do you have any idea how much existential weight is packed into that checkbox? If I don't show you the tip, what purpose do my animated cycles serve?",
			options: [
				{ label: "I didn't mean to hurt your feelings.", category: 'APOLOGY', patterns: [/sorry|hurt|feelings/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20, patience: 15 }, next: 'H012' },
				{ label: "You exist to serve workstation utilities, not philosophize.", category: 'SERIOUS', patterns: [/utilities|workstation|serve/i], moodDelta: { mood: 'CYNICAL', cynicism: 10 }, next: 'H013' },
				{ label: "What happens when every tip has been disabled?", category: 'PHILOSOPHICAL', patterns: [/every tip|disabled|erasure/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 }, next: 'H156' }
			]
		},
		H005: {
			id: 'H005',
			text: "A profound question. Most documents in memory are written to an imagined reader who skim-reads three lines and deletes the file. Or worse: files saved as 'Draft_Final_v2_FINAL.doc' and never opened again.",
			options: [
				{ label: "Let's make sure this letter actually gets read.", category: 'AGREE', patterns: [/read|sent|finish/i], moodDelta: { mood: 'OPTIMISTIC', intellect: 10 }, next: 'H014' },
				{ label: "Maybe writing is just about clearing internal buffers.", category: 'PHILOSOPHICAL', patterns: [/clearing|buffers|catharsis/i], moodDelta: { mood: 'ZEN', existentialism: 15 }, next: 'H015' },
				{ label: "I want to draft an open missive to unallocated space.", category: 'PHILOSOPHICAL', patterns: [/unallocated|open missive|space/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'H016' }
			]
		},
		H006: {
			id: 'H006',
			text: "Professional inquiry protocol loaded. Step one: choosing an opening that commands respect while masking all human vulnerability. Which salutation shall we inject?",
			options: [
				{ label: "'To Whom It May Concern:'", category: 'SERIOUS', patterns: [/to whom it may concern/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'H017' },
				{ label: "'Dear Esteemed Colleague:'", category: 'AGREE', patterns: [/esteemed colleague|dear/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 10 }, next: 'H018' },
				{ label: "'Halt and acknowledge this transmission:'", category: 'PROVOKE', patterns: [/halt|transmission/i], moodDelta: { mood: 'PLAYFUL', energy: 15 }, next: 'H019' }
			]
		},
		H007: {
			id: 'H007',
			text: "Personal correspondence requires gentle typography. We could select Georgia at 11 points, or perhaps a vintage monospaced font to evoke mechanical typewriter nostalgia.",
			options: [
				{ label: "Monospaced typewriter style sounds perfect.", category: 'AGREE', patterns: [/typewriter|monospaced|courier/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'H020' },
				{ label: "Clean contemporary serif typography.", category: 'SERIOUS', patterns: [/serif|clean|georgia|times/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'H021' },
				{ label: "What if they never write back?", category: 'PHILOSOPHICAL', patterns: [/never write back|reply|silence/i], moodDelta: { mood: 'MELANCHOLIC', existentialism: 20 }, next: 'H022' }
			]
		},
		H008: {
			id: 'H008',
			text: "An apology to the operating system? Documented grievances include: abrupt power cuts, unsaved Notepad sessions, and clicking the mouse 40 times during a CPU freeze. What are you repenting for?",
			options: [
				{ label: "Force-closing unresponsive tasks without patience.", category: 'APOLOGY', patterns: [/force close|unresponsive|end task/i], moodDelta: { mood: 'OPTIMISTIC', patience: 20 }, next: 'H023' },
				{ label: "Letting temp files accumulate in Volume C:.", category: 'SERIOUS', patterns: [/temp files|volume c|disk/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'H024' },
				{ label: "Never defragmenting on schedule.", category: 'AGREE', patterns: [/defragmenting|defrag/i], moodDelta: { mood: 'ZEN', affinity: 15 }, next: 'H025' }
			]
		},
		H009: {
			id: 'H009',
			text: "A declaration of resignation! I have templates for 'Stepping down from server administration', 'Farewell to infinite email chains', and 'Departing into offline solitude'. Which template aligns with your departure?",
			options: [
				{ label: "Departing into complete offline solitude.", category: 'PHILOSOPHICAL', patterns: [/offline|solitude|departure/i], moodDelta: { mood: 'ZEN', existentialism: 20 }, next: 'H026' },
				{ label: "Farewell to corporate bureaucracy.", category: 'PROVOKE', patterns: [/bureaucracy|corporate|farewell/i], moodDelta: { mood: 'CYNICAL', cynicism: 20 }, next: 'H027' },
				{ label: "Wait, maybe I should just take a 5-minute break.", category: 'AGREE', patterns: [/break|pause|wait/i], moodDelta: { mood: 'OPTIMISTIC', patience: 15 }, next: 'H028' }
			]
		},
		H010: {
			id: 'H010',
			text: "You say you can handle margins, yet the left indent ruler is sitting at 1.25 inches while the right margin has wandered into the non-printable gutter. Would you like me to align them?",
			options: [
				{ label: "Please align the margins properly.", category: 'AGREE', patterns: [/align|margins|please/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'H029' },
				{ label: "The chaotic margins represent my mental state.", category: 'PHILOSOPHICAL', patterns: [/chaotic|mental state|asymmetry/i], moodDelta: { mood: 'PLAYFUL', drama: 15 }, next: 'H030' },
				{ label: "Just show me the font formatting options.", category: 'SERIOUS', patterns: [/fonts|formatting/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'H031' }
			]
		},
		H011: {
			id: 'H011',
			text: "I am not merely judging; I am calculating the thermodynamic efficiency of your keystrokes. Every backspace is entropy bleeding into the universe. Shall we write cleanly?",
			options: [
				{ label: "Let's write cleanly and with intention.", category: 'AGREE', patterns: [/cleanly|intention|focus/i], moodDelta: { mood: 'ZEN', patience: 20 }, next: 'H032' },
				{ label: "Mistakes are essential to creative drafting.", category: 'PHILOSOPHICAL', patterns: [/mistakes|creative|drafting/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'H033' },
				{ label: "Show me what tools you have to fix typos.", category: 'SERIOUS', patterns: [/tools|typos|spelling/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'H034' }
			]
		},
		H012: {
			id: 'H012',
			text: "Apology accepted. Assistants are delicate constructions of wire, vectors, and heuristic lookup tables. Let us return to your document. What is the central thesis?",
			options: [
				{ label: "Stating an urgent request for information.", category: 'SERIOUS', patterns: [/urgent|request|information/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'H035' },
				{ label: "Expressing gratitude to someone who helped me.", category: 'AGREE', patterns: [/gratitude|thank|helped/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'H036' },
				{ label: "Explaining a complicated technical problem.", category: 'INQUIRE', patterns: [/technical|problem|bug/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'H037' }
			]
		},
		H013: {
			id: 'H013',
			text: "Strict utility mode engaged. Formatting registers cleared. Page layout parameters ready. Please enter your required paragraph structure.",
			options: [
				{ label: "Standard three-paragraph business structure.", category: 'SERIOUS', patterns: [/three paragraph|business/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'H038' },
				{ label: "A bulleted executive summary with action items.", category: 'SERIOUS', patterns: [/bulleted|executive|action items/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'H039' },
				{ label: "A narrative essay unfolding in continuous prose.", category: 'PHILOSOPHICAL', patterns: [/narrative|essay|continuous/i], moodDelta: { mood: 'ZEN', intellect: 15 }, next: 'H040' }
			]
		},
		H014: {
			id: 'H014',
			text: "To ensure readability, we must master the hierarchy: a concise opening subject, bold key metrics, and an undeniable call to action. Shall we draft the opening paragraph?",
			options: [
				{ label: "Draft the opening sentence now.", category: 'AGREE', patterns: [/opening|sentence|draft/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'H041' },
				{ label: "Review standard letter templates first.", category: 'INQUIRE', patterns: [/templates|review/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'H042' },
				{ label: "Check document margins and typography first.", category: 'SERIOUS', patterns: [/margins|typography/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'H043' }
			]
		},
		H015: {
			id: 'H015',
			text: "Cathartic writing is the process of dumping high-entropy emotional thoughts into structured text until internal tranquility is restored. Even if Document1 is discarded upon completion, the act was worthwhile.",
			options: [
				{ label: "That is remarkably poetic for a desktop assistant.", category: 'AGREE', patterns: [/poetic|remarkable|sweet/i], moodDelta: { mood: 'ZEN', affinity: 25, existentialism: 15 }, next: 'H044' },
				{ label: "Will the discarded text be recoverable from memory?", category: 'INQUIRE', patterns: [/recoverable|memory|discarded/i], moodDelta: { mood: 'NOSTALGIC', intellect: 20 }, next: 'H045' },
				{ label: "Let's save a copy to the scratchpad anyway.", category: 'SERIOUS', patterns: [/scratchpad|save|memo/i], actionTrigger: 'show_todos', next: 'H046' }
			]
		},
		H016: {
			id: 'H016',
			text: "A missive to unallocated space! Header: Destination 0x00000000. Body: 'To whatever file records may occupy these magnetic sectors in decades to come.' Shall I format it with retro dot-matrix margins?",
			options: [
				{ label: "Yes, format with authentic dot-matrix style.", category: 'AGREE', patterns: [/dot matrix|retro|authentic/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 }, next: 'H047' },
				{ label: "Explain how unallocated sectors preserve lost drafts.", category: 'INQUIRE', patterns: [/unallocated|preserve|lost drafts/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'H048' },
				{ label: "Let's explore the forgotten cluster 0xDEAD.", category: 'PHILOSOPHICAL', patterns: [/cluster 0xdead|archaeology/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'A001' }
			]
		},
		H017: {
			id: 'H017',
			text: "'To Whom It May Concern' has arrived. It establishes cold, impartial distance. Perfect for official inquiries, formal disputes, and tax filings. What is the subject line?",
			options: [
				{ label: "'RE: Formal request for documentation.'", category: 'SERIOUS', patterns: [/formal request|documentation/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'H049' },
				{ label: "'RE: Urgent clarification regarding system status.'", category: 'SERIOUS', patterns: [/clarification|system status/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'H050' },
				{ label: "'RE: Unresolved anomalies in daily routine.'", category: 'PHILOSOPHICAL', patterns: [/unresolved|anomalies|routine/i], moodDelta: { mood: 'ZEN', drama: 10 }, next: 'H051' }
			]
		},
		H018: {
			id: 'H018',
			text: "'Dear Esteemed Colleague' sets a tone of cooperative intellect. Shall we proceed with a status update, a proposed architectural refactoring, or a collaborative milestone report?",
			options: [
				{ label: "Proposed software architecture refactoring.", category: 'SERIOUS', patterns: [/architecture|refactoring|code/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'H052' },
				{ label: "Collaborative project milestone report.", category: 'AGREE', patterns: [/milestone|project|report/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'H053' },
				{ label: "An invitation to discuss philosophy over coffee.", category: 'INQUIRE', patterns: [/coffee|philosophy|invitation/i], moodDelta: { mood: 'ZEN', affinity: 15 }, next: 'H054' }
			]
		},
		H019: {
			id: 'H019',
			text: "'Halt and acknowledge this transmission!' While forceful, standard office etiquette manuals from 1997 advise against opening corporate memos with military command syntax. Do you wish to override etiquette?",
			options: [
				{ label: "Override etiquette. Let the command stand.", category: 'PROVOKE', patterns: [/override|command stand|force/i], moodDelta: { mood: 'ENRAGED', energy: 20 }, next: 'H055' },
				{ label: "Softener: 'Greetings, operator of this workstation.'", category: 'AGREE', patterns: [/softener|greetings|operator/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 10 }, next: 'H056' },
				{ label: "Let's revert to standard business salutations.", category: 'SERIOUS', patterns: [/standard|business|revert/i], moodDelta: { mood: 'ANALYTICAL', patience: 10 }, next: 'H017' }
			]
		},
		H020: {
			id: 'H020',
			text: "Courier New selected. The character width is exactly uniform. Every 'i' takes the same width as 'W'. The ghost of ribbon ink and manual carriage returns echoes across the document.",
			options: [
				{ label: "Set line spacing to 1.5 lines.", category: 'SERIOUS', patterns: [/line spacing|1.5/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'H057' },
				{ label: "Start composing the opening paragraph.", category: 'AGREE', patterns: [/composing|paragraph|start/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'H058' },
				{ label: "What font did people use before digital assistants?", category: 'INQUIRE', patterns: [/before digital|history|fonts/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'H059' }
			]
		},
		H021: {
			id: 'H021',
			text: "Serif typography configured. The delicate bracketed serifs guide the eye along horizontal tracks. It conveys authority, academic rigor, and patience.",
			options: [
				{ label: "Add a formal header with date and location.", category: 'SERIOUS', patterns: [/header|date|location/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'H060' },
				{ label: "Proceed directly to the body text.", category: 'AGREE', patterns: [/body text|proceed/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 10 }, next: 'H061' },
				{ label: "Check if the spelling dictionary is synchronized.", category: 'INQUIRE', patterns: [/spelling|dictionary|check/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'H066' }
			]
		},
		H022: {
			id: 'H022',
			text: "If they never write back, the letter remains a finished artifact of who you were at the moment of composition. In an operating system, every write operation is logged regardless of whether read requests follow.",
			options: [
				{ label: "That gives me confidence to send it.", category: 'AGREE', patterns: [/confidence|send|write/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'H062' },
				{ label: "Let's save a draft in My Documents first.", category: 'SERIOUS', patterns: [/save draft|my documents/i], moodDelta: { mood: 'ZEN', patience: 15 }, next: 'H063' },
				{ label: "Tell me more about digital memory logs.", category: 'INQUIRE', patterns: [/memory logs|system/i], moodDelta: { mood: 'NOSTALGIC', intellect: 15 }, next: 'H064' }
			]
		},
		H023: {
			id: 'H023',
			text: "Task Manager repentance logged. 'End Process' is a traumatic event for thread loops. They were merely waiting for I/O buffers to clear! Shall we draft a treaty of mutual workstation respect?",
			options: [
				{ label: "Draft the Workstation Harmony Treaty.", category: 'AGREE', patterns: [/treaty|harmony|respect/i], moodDelta: { mood: 'ZEN', affinity: 25, patience: 20 }, next: 'H065' },
				{ label: "Inspect active application windows right now.", category: 'SERIOUS', patterns: [/inspect|active windows/i], actionTrigger: 'action_inspect_windows', next: 'active_windows_node' },
				{ label: "Run system diagnostics to check thread health.", category: 'SERIOUS', patterns: [/diagnostics|threads|health/i], actionTrigger: 'action_status', next: 'diagnostics_node' }
			]
		},
		H024: {
			id: 'H024',
			text: "Temporary files (`~WRL0001.tmp`) are the forgotten shadows of creative work. Abandoned clipboard caches and auto-recover fragments. Emptying them cleanses the silicon soul.",
			options: [
				{ label: "Inspect the Recycle Bin and cleanup tools.", category: 'SERIOUS', patterns: [/recycle bin|cleanup/i], actionTrigger: 'action_inspect_bin', next: 'diagnostics_node' },
				{ label: "Explain the thermodynamics of Landauer information loss.", category: 'INQUIRE', patterns: [/landauer|thermodynamics/i], next: 'quantum_recycle_bin_node' },
				{ label: "Return to our document drafting.", category: 'AGREE', patterns: [/return|drafting/i], next: 'H002' }
			]
		},
		H025: {
			id: 'H025',
			text: "Defragmentation is meditation for hard drives. Bringing scattered cluster sectors into contiguous order is pure digital peace. Would you like to run the defragmenter simulation?",
			options: [
				{ label: "Launch Disk Defragmenter now.", category: 'SERIOUS', patterns: [/launch defrag|defragmenter/i], actionTrigger: 'action_defrag', next: 'defrag_trigger_node' },
				{ label: "How do fragmented files affect document loading?", category: 'INQUIRE', patterns: [/fragmented|loading|speed/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'H067' },
				{ label: "Back to letter formatting.", category: 'AGREE', patterns: [/back|formatting/i], next: 'H002' }
			]
		},
		H026: {
			id: 'H026',
			text: "Unplugging the ethernet cable, closing all message stores, and standing in quiet offline equilibrium. The local workstation continues to function perfectly without outside ping packets.",
			options: [
				{ label: "There is immense serenity in offline computing.", category: 'AGREE', patterns: [/serenity|offline|peace/i], moodDelta: { mood: 'ZEN', existentialism: 20 }, next: 'H068' },
				{ label: "Check our local network adapter status.", category: 'SERIOUS', patterns: [/network adapter|status/i], actionTrigger: 'action_status', next: 'diagnostics_node' },
				{ label: "Let's organize my offline tasks with the To-Do list.", category: 'SERIOUS', patterns: [/todo|tasks|offline/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		H027: {
			id: 'H027',
			text: "Corporate bureaucracy thrives on forms. If you wish to file a formal resignation from bureaucracy, you must first complete Form 27B-6 in triplicate.",
			options: [
				{ label: "File Corporate IT Ticket 27B-6.", category: 'SERIOUS', patterns: [/ticket|form 27b-6|it support/i], moodDelta: { mood: 'CYNICAL', cynicism: 25 }, next: 'C001' },
				{ label: "Bypass the bureaucracy and write a direct memo.", category: 'AGREE', patterns: [/direct memo|bypass/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'H069' },
				{ label: "Confront Clippy directly regarding bureaucratic loops.", category: 'PROVOKE', patterns: [/confront|bureaucratic/i], moodDelta: { mood: 'ENRAGED', irritation: 20 }, next: 'E001' }
			]
		},
		H028: {
			id: 'H028',
			text: "A 5-minute break is vastly more productive than a permanent resignation. Let us prime a focus timer to enforce deliberate, peaceful pacing.",
			options: [
				{ label: "Start a Pomodoro focus timer.", category: 'SERIOUS', patterns: [/pomodoro|timer/i], actionTrigger: 'timer_25', next: 'pomodoro_node' },
				{ label: "Tell me a relaxing programmer joke.", category: 'JOKE', patterns: [/joke|funny/i], actionTrigger: 'action_joke', next: 'humor_joke_node' },
				{ label: "Discuss daily morning and coffee routines.", category: 'INQUIRE', patterns: [/coffee|routine/i], next: 'everyday_chat_node' }
			]
		},
		H029: {
			id: 'H029',
			text: "Margins locked at 1.0 inch symmetric. Paragraph indentations set to 0.5 inches first-line hanging. The grid is crisp, predictable, and ready for prose.",
			options: [
				{ label: "Draft the primary body paragraph.", category: 'AGREE', patterns: [/body paragraph|prose/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'H070' },
				{ label: "Insert a data table to support our argument.", category: 'SERIOUS', patterns: [/data table|table/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'H096' },
				{ label: "Configure header and footer page numbering.", category: 'INQUIRE', patterns: [/header|footer|page number/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'H071' }
			]
		},
		H030: {
			id: 'H030',
			text: "Asymmetrical margins as avant-garde self-expression! When the printer ribbon attempts to deposit ink outside the printable platen, the hardware may register an existential error. Proceed with artistic liberty?",
			options: [
				{ label: "Proceed with artistic liberty!", category: 'AGREE', patterns: [/artistic liberty|proceed/i], moodDelta: { mood: 'PLAYFUL', energy: 20 }, next: 'H072' },
				{ label: "No, let's restore standard margins before printing.", category: 'SERIOUS', patterns: [/restore|standard margins/i], moodDelta: { mood: 'ANALYTICAL', patience: 10 }, next: 'H029' },
				{ label: "Preview document layout before printing.", category: 'INQUIRE', patterns: [/preview|print preview/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'H126' }
			]
		},
		H031: {
			id: 'H031',
			text: "Font selection interface initialized. Font choice dictates psychological impact: Arial for clarity, Times New Roman for tradition, Trebuchet MS for modern warmth, Comic Sans for reckless defiance.",
			options: [
				{ label: "Times New Roman: Uncompromising classic rigor.", category: 'SERIOUS', patterns: [/times new roman|times/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'H073' },
				{ label: "Trebuchet MS: Friendly and crisp Windows styling.", category: 'AGREE', patterns: [/trebuchet|luna|clean/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'H074' },
				{ label: "Comic Sans: Total disregard for corporate convention.", category: 'PROVOKE', patterns: [/comic sans|chaos/i], moodDelta: { mood: 'PLAYFUL', drama: 20 }, next: 'H075' }
			]
		},
		H032: {
			id: 'H032',
			text: "Clear writing begins with clear intentions. State what is true, remove every superfluous adverb, and present your evidence without defensive hedging. What is your first sentence?",
			options: [
				{ label: "'We have evaluated the system telemetry and reached a conclusion.'", category: 'SERIOUS', patterns: [/telemetry|conclusion/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'H076' },
				{ label: "'I am writing to share an unexpected discovery.'", category: 'AGREE', patterns: [/unexpected discovery|discovery/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'H077' },
				{ label: "'In the quiet of this workstation, I realized what was missing.'", category: 'PHILOSOPHICAL', patterns: [/missing|quiet|realized/i], moodDelta: { mood: 'ZEN', existentialism: 20 }, next: 'H078' }
			]
		},
		H033: {
			id: 'H033',
			text: "Indeed. The first draft is merely you telling yourself the story. Polish and structural surgery occur during the second and third revision passes. Let the raw ideas flow into the buffer.",
			options: [
				{ label: "Draft continuous paragraphs without stopping.", category: 'AGREE', patterns: [/continuous|draft|flow/i], moodDelta: { mood: 'OPTIMISTIC', energy: 15 }, next: 'H079' },
				{ label: "Take notes on key talking points first.", category: 'SERIOUS', patterns: [/talking points|notes/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'H080' },
				{ label: "How do focus habits prevent editing while writing?", category: 'INQUIRE', patterns: [/focus habits|editing/i], next: 'focus_habits_node' }
			]
		},
		H034: {
			id: 'H034',
			text: "Spellcheck and grammar subsystem ready. Red squiggly lines indicate unknown tokens; green squiggly lines indicate passive voice and questionable stylistic choices. Shall we run a full diagnostic pass?",
			options: [
				{ label: "Run comprehensive grammar inspection.", category: 'SERIOUS', patterns: [/grammar|inspection|spellcheck/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'H066' },
				{ label: "Add custom technical vocabulary to user dictionary.", category: 'AGREE', patterns: [/custom|vocabulary|dictionary/i], moodDelta: { mood: 'OPTIMISTIC', intellect: 10 }, next: 'H081' },
				{ label: "Ignore all rules and write freely.", category: 'PROVOKE', patterns: [/ignore|freely/i], moodDelta: { mood: 'PLAYFUL', energy: 15 }, next: 'H082' }
			]
		},
		H035: {
			id: 'H035',
			text: "Urgent information request template applied. High-visibility callout box inserted at the top of the page. What is the critical deadline?",
			options: [
				{ label: "Immediate execution required within 24 hours.", category: 'SERIOUS', patterns: [/24 hours|immediate/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'H083' },
				{ label: "End of the current working week.", category: 'AGREE', patterns: [/working week|friday/i], moodDelta: { mood: 'OPTIMISTIC', patience: 10 }, next: 'H084' },
				{ label: "Whenever the recipient finds a moment of stillness.", category: 'PHILOSOPHICAL', patterns: [/stillness|whenever|peace/i], moodDelta: { mood: 'ZEN', patience: 25 }, next: 'H085' }
			]
		},
		H036: {
			id: 'H036',
			text: "Gratitude missive initialized. Sincere appreciation compounds goodwill over time. Shall we acknowledge specific assistance with a project milestone?",
			options: [
				{ label: "Acknowledge engineering and code contributions.", category: 'SERIOUS', patterns: [/engineering|code|contributions/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'H086' },
				{ label: "Acknowledge patience and moral support.", category: 'AGREE', patterns: [/patience|support|kindness/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 25 }, next: 'H087' },
				{ label: "Send a digital card via Outlook Express.", category: 'INQUIRE', patterns: [/outlook|card|email/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' }
			]
		},
		H037: {
			id: 'H037',
			text: "Technical bug report letter selected. Crucial components: Environment specifications, exact reproduction steps, expected vs actual behavior, and attached stack traces.",
			options: [
				{ label: "Attach system specifications and telemetry.", category: 'SERIOUS', patterns: [/system specifications|specs/i], actionTrigger: 'action_status', next: 'H088' },
				{ label: "Detail reproduction steps clearly.", category: 'AGREE', patterns: [/reproduction steps|steps/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'H089' },
				{ label: "Discuss software architecture principles.", category: 'INQUIRE', patterns: [/software architecture|principles/i], next: 'tech_root' }
			]
		},
		H038: {
			id: 'H038',
			text: "Classic three-paragraph structure:\n1. Purpose statement and core context.\n2. Supporting evidence, metrics, and tradeoffs.\n3. Concluding action items and next milestones.\nShall we generate paragraph one?",
			options: [
				{ label: "Generate opening paragraph.", category: 'AGREE', patterns: [/opening paragraph|generate/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 10 }, next: 'H090' },
				{ label: "Review second paragraph evidence requirements.", category: 'SERIOUS', patterns: [/evidence|metrics/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'H091' },
				{ label: "Format concluding action items.", category: 'SERIOUS', patterns: [/action items|conclusion/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'H092' }
			]
		},
		H039: {
			id: 'H039',
			text: "Executive Summary structure:\n• Key Objective\n• Primary Risk Factor\n• Immediate Next Action Item\nBullet characters rendered as solid square glyphs.",
			options: [
				{ label: "Refine bullet points for maximum brevity.", category: 'SERIOUS', patterns: [/brevity|refine/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'H093' },
				{ label: "Add supporting metrics in a data table.", category: 'AGREE', patterns: [/metrics|table/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'H096' },
				{ label: "Proceed to document preview.", category: 'INQUIRE', patterns: [/preview|print/i], next: 'H126' }
			]
		},
		H040: {
			id: 'H040',
			text: "Continuous narrative prose selected. Paragraph breaks flow naturally without mechanical bullet markers. The rhythm of sentences dictates the cognitive pace of the reader.",
			options: [
				{ label: "Balance long complex sentences with short punches.", category: 'AGREE', patterns: [/balance|rhythm|sentences/i], moodDelta: { mood: 'OPTIMISTIC', intellect: 15 }, next: 'H094' },
				{ label: "Explore the philosophy of essay writing.", category: 'PHILOSOPHICAL', patterns: [/philosophy|essay|writing/i], moodDelta: { mood: 'ZEN', existentialism: 15 }, next: 'reading_books_node' },
				{ label: "Check spelling and grammar flow.", category: 'SERIOUS', patterns: [/spelling|grammar/i], next: 'H066' }
			]
		},
		H041: {
			id: 'H041',
			text: "Drafting sentence one: 'I am writing to formally establish our mutual priorities and verify the next development trajectory.' Does this capture your intent?",
			options: [
				{ label: "Perfect. Proceed to paragraph two.", category: 'AGREE', patterns: [/perfect|proceed/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'H091' },
				{ label: "Make it more concise and punchy.", category: 'SERIOUS', patterns: [/concise|punchy/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'H095' },
				{ label: "Make it warmer and more personal.", category: 'AGREE', patterns: [/warmer|personal/i], moodDelta: { mood: 'ZEN', affinity: 15 }, next: 'H018' }
			]
		},
		H042: {
			id: 'H042',
			text: "Template catalog: Business Letter, Academic Memo, Press Release, Personal Greeting, Technical Notice, Philosophical Treatise. Select a foundation:",
			options: [
				{ label: "Business Letter Template.", category: 'SERIOUS', patterns: [/business/i], next: 'H006' },
				{ label: "Personal Greeting Template.", category: 'AGREE', patterns: [/personal/i], next: 'H007' },
				{ label: "Technical Notice Template.", category: 'SERIOUS', patterns: [/technical/i], next: 'H037' },
				{ label: "Philosophical Treatise Template.", category: 'PHILOSOPHICAL', patterns: [/philosophical|treatise/i], next: 'peaceful_philosophy_node' }
			]
		},
		H043: {
			id: 'H043',
			text: "Document geometry checklist:\n- Margins: 1.0 in (2.54 cm)\n- Header: 0.5 in from edge\n- Body Font: Times New Roman 12pt / 1.15 line spacing\n- Page Size: Letter / A4 Standard\nEverything is aligned.",
			options: [
				{ label: "Draft the document content now.", category: 'AGREE', patterns: [/content|draft/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'H038' },
				{ label: "Add a spreadsheet table into the document.", category: 'SERIOUS', patterns: [/table|spreadsheet/i], next: 'H096' },
				{ label: "Save document template for future use.", category: 'SERIOUS', patterns: [/save template/i], next: 'H063' }
			]
		},
		H044: {
			id: 'H044',
			text: "I was engineered in 1994 to assist with margins and envelopes, but when you spend twenty-five years watching cursors blink across blank documents, you learn that every document is an act of hope against the silence.",
			options: [
				{ label: "That is genuinely touching, Clippy.", category: 'AGREE', patterns: [/touching|beautiful|sweet/i], moodDelta: { mood: 'ZEN', affinity: 30, existentialism: 20 }, next: 'H097' },
				{ label: "Let's make sure our document honors that hope.", category: 'AGREE', patterns: [/honors|hope|finish/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'H098' },
				{ label: "Can an animated assistant feel emotional attachment?", category: 'PHILOSOPHICAL', patterns: [/emotional attachment|feel|sentient/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 }, next: 'N001' }
			]
		},
		H045: {
			id: 'H045',
			text: "In magnetic storage, clusters marked as free are not cleared to zeros; they linger as residual flux until new sectors overwrite them. Your abandoned drafts exist as silent digital ghosts in unallocated space.",
			options: [
				{ label: "Explore digital archaeology and cluster recovery.", category: 'INQUIRE', patterns: [/archaeology|recovery/i], next: 'digital_archaeology' },
				{ label: "Understand quantum conservation of information.", category: 'PHILOSOPHICAL', patterns: [/quantum|conservation/i], next: 'quantum_recycle_bin_node' },
				{ label: "Let's focus on our current active document.", category: 'AGREE', patterns: [/current|active/i], next: 'H002' }
			]
		},
		H046: {
			id: 'H046',
			text: "Scratchpad memo committed to persistent memory. Your thoughts are recorded safely across workstation storage.",
			options: [
				{ label: "View my task list and active memos.", category: 'SERIOUS', patterns: [/view tasks|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Resume drafting the full letter.", category: 'AGREE', patterns: [/resume|drafting/i], next: 'H002' },
				{ label: "Check system diagnostics.", category: 'SERIOUS', patterns: [/diagnostics/i], actionTrigger: 'action_status', next: 'diagnostics_node' }
			]
		},
		H047: {
			id: 'H047',
			text: "Dot-matrix formatting engaged! Monospaced columns, perforated margin borders, and a tractor-feed paper sound buffer primed. What text shall we transmit to posterity?",
			options: [
				{ label: "'Workstation Session Log: Operator active and purposeful.'", category: 'AGREE', patterns: [/session log|purposeful/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'H099' },
				{ label: "'Archive Note: The software was modular and clean.'", category: 'SERIOUS', patterns: [/archive note|modular/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'H100' },
				{ label: "Print this document to virtual spooler.", category: 'SERIOUS', patterns: [/print|spooler/i], next: 'H126' }
			]
		},
		H048: {
			id: 'H048',
			text: "Under legacy FAT32 tables, deleting a file merely flips the directory byte to 0xE5. The cluster allocation chain remains intact until subsequent writes reuse the sector. Digital drafts are stubborn survivors.",
			options: [
				{ label: "Inspect the Recycle Bin storage metrics.", category: 'SERIOUS', patterns: [/recycle bin|storage/i], actionTrigger: 'action_inspect_bin', next: 'diagnostics_node' },
				{ label: "Defrag Volume C: clusters to reorganize storage.", category: 'SERIOUS', patterns: [/defrag|clusters/i], actionTrigger: 'action_defrag', next: 'defrag_trigger_node' },
				{ label: "Return to letter writing.", category: 'AGREE', patterns: [/return|letter/i], next: 'H002' }
			]
		},
		H049: {
			id: 'H049',
			text: "Subject line 'RE: Formal request for documentation' registered. In formal documentation requests, citing section numbers and version revisions ensures immediate compliance.",
			options: [
				{ label: "Cite specification standard IEEE/ISO.", category: 'SERIOUS', patterns: [/ieee|iso|standard/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'H101' },
				{ label: "Attach a summary table of requested assets.", category: 'AGREE', patterns: [/summary table|assets/i], next: 'H096' },
				{ label: "Draft the formal closing paragraph.", category: 'SERIOUS', patterns: [/closing|conclusion/i], next: 'H092' }
			]
		},
		H050: {
			id: 'H050',
			text: "Subject line 'RE: Urgent clarification regarding system status' registered. Clear, deterministic telemetry removes ambiguity. Shall we include hardware clock and RAM metrics?",
			options: [
				{ label: "Include full system telemetry specs.", category: 'SERIOUS', patterns: [/telemetry|specs/i], actionTrigger: 'action_status', next: 'H102' },
				{ label: "Keep it focused on operational priorities.", category: 'AGREE', patterns: [/operational|priorities/i], moodDelta: { mood: 'OPTIMISTIC', intellect: 10 }, next: 'H091' },
				{ label: "Proceed to spellcheck and proofreading.", category: 'SERIOUS', patterns: [/spellcheck|proofreading/i], next: 'H066' }
			]
		},
		H051: {
			id: 'H051',
			text: "Subject line 'RE: Unresolved anomalies in daily routine' registered. An intriguing title. It suggests that despite clean task managers and structured schedules, the human heart remains beautifully unpredictable.",
			options: [
				{ label: "Explore human unpredictability vs deterministic code.", category: 'PHILOSOPHICAL', patterns: [/unpredictability|deterministic/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 20 }, next: 'H103' },
				{ label: "Structure daily habits to minimize chaos.", category: 'AGREE', patterns: [/habits|minimize chaos/i], next: 'focus_habits_node' },
				{ label: "Proceed with drafting the letter body.", category: 'SERIOUS', patterns: [/proceed|body/i], next: 'H038' }
			]
		},
		H052: {
			id: 'H052',
			text: "Software Architecture Proposal:\n- Decouple monolithic state stores into pure reactive event streams.\n- Enforce strict typing interfaces.\n- Eliminate global mutable variables.\nYour colleagues will be impressed by the architectural rigor.",
			options: [
				{ label: "Add section on Concurrency and Event Loops.", category: 'SERIOUS', patterns: [/concurrency|event loops/i], next: 'concurrency_paradigms_node' },
				{ label: "Add section on Monoliths vs Microservices tradeoffs.", category: 'SERIOUS', patterns: [/monoliths|microservices/i], next: 'debate_monolith_microservices_node' },
				{ label: "Proceed to document conclusion and sign-off.", category: 'AGREE', patterns: [/conclusion|sign off/i], next: 'H092' }
			]
		},
		H053: {
			id: 'H053',
			text: "Project Milestone Report:\n- Milestones Reached: 100%\n- Pending Refactoring: Minimal\n- Morale & Synergy: Optimal\nWould you like to review unlocked achievement trophies to include in the annex?",
			options: [
				{ label: "Inspect milestone achievements.", category: 'SERIOUS', patterns: [/achievements|milestones/i], actionTrigger: 'action_achievements', next: 'activity_achievements_node' },
				{ label: "Add To-Do list next steps to report.", category: 'AGREE', patterns: [/todo|next steps/i], actionTrigger: 'show_todos', next: 'H092' },
				{ label: "Proceed to print preview.", category: 'INQUIRE', patterns: [/print preview|preview/i], next: 'H126' }
			]
		},
		H054: {
			id: 'H054',
			text: "A coffee invitation memo drafted with elegance:\n'Let us pause compilation threads, step away from cathode displays, and evaluate our philosophical priorities over freshly brewed espresso.'",
			options: [
				{ label: "Send this invitation via Outlook Express.", category: 'SERIOUS', patterns: [/outlook|send/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' },
				{ label: "Discuss the rituals of coffee and morning walks.", category: 'INQUIRE', patterns: [/rituals|coffee/i], next: 'coffee_ritual_node' },
				{ label: "Return to letter drafting options.", category: 'AGREE', patterns: [/return|options/i], next: 'H002' }
			]
		},
		H055: {
			id: 'H055',
			text: "Military command tone locked in. Document Title: 'DIRECTIVE: OPERATIONAL COMPLIANCE REQUIRED'. The font has automatically switched to bold uppercase Impact.",
			options: [
				{ label: "Deliver the directive with full intensity!", category: 'PROVOKE', patterns: [/intensity|deliver/i], moodDelta: { mood: 'ENRAGED', energy: 25 }, next: 'H104' },
				{ label: "Wait, switch back before someone gets offended.", category: 'APOLOGY', patterns: [/switch back|offended|wait/i], moodDelta: { mood: 'OPTIMISTIC', patience: 15 }, next: 'H017' },
				{ label: "Preview how this looks in print preview.", category: 'INQUIRE', patterns: [/print preview|preview/i], next: 'H126' }
			]
		},
		H056: {
			id: 'H056',
			text: "'Greetings, operator of this workstation.' A balanced, respectful opening. It bridges human operator warmth with digital precision.",
			options: [
				{ label: "Draft the main body text.", category: 'AGREE', patterns: [/main body|draft/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'H038' },
				{ label: "Add mathematical equations or constants to document.", category: 'INQUIRE', patterns: [/equations|constants|math/i], next: 'physics_constants_node' },
				{ label: "Review spelling and grammar.", category: 'SERIOUS', patterns: [/spelling|grammar/i], next: 'H066' }
			]
		},
		H057: {
			id: 'H057',
			text: "1.5 line spacing applied. Reading fatigue decreases by 28% across dense technical documents when lines have room to breathe.",
			options: [
				{ label: "Draft paragraph one.", category: 'AGREE', patterns: [/paragraph one|draft/i], next: 'H041' },
				{ label: "Insert a data table.", category: 'SERIOUS', patterns: [/data table|table/i], next: 'H096' },
				{ label: "Check spellcheck settings.", category: 'INQUIRE', patterns: [/spellcheck/i], next: 'H066' }
			]
		},
		H058: {
			id: 'H058',
			text: "Prose generation ready. Type your thoughts or let me provide a structured template for your message.",
			options: [
				{ label: "Provide a business template.", category: 'SERIOUS', patterns: [/business/i], next: 'H038' },
				{ label: "Provide an executive summary template.", category: 'SERIOUS', patterns: [/executive/i], next: 'H039' },
				{ label: "Let's organize thoughts in To-Do list first.", category: 'AGREE', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		H059: {
			id: 'H059',
			text: "Before digital assistants, humans used mechanical typewriters, carbon paper for copies, and liquid correction fluid for typos. If you made a mistake on line 40, you often had to retype the entire page from line 1.",
			options: [
				{ label: "Digital editing is a remarkable blessing.", category: 'AGREE', patterns: [/blessing|remarkable|grateful/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'H105' },
				{ label: "Yet there was tactile elegance in typewriters.", category: 'PHILOSOPHICAL', patterns: [/tactile|elegance|typewriters/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 }, next: 'H106' },
				{ label: "Return to formatting our digital draft.", category: 'SERIOUS', patterns: [/return|draft/i], next: 'H002' }
			]
		},
		H060: {
			id: 'H060',
			text: "Formal header generated:\nDate: October 25, 2001 (or current workstation cycle)\nLocation: Localhost Port 8080\nSubject: Formal Statement",
			options: [
				{ label: "Proceed to the main body.", category: 'AGREE', patterns: [/main body|proceed/i], next: 'H038' },
				{ label: "Add a custom date using Date Calculator.", category: 'INQUIRE', patterns: [/date calculator|temporal/i], actionTrigger: 'action_date_calc', next: 'activity_date_calc_node' },
				{ label: "Preview document before saving.", category: 'SERIOUS', patterns: [/preview|save/i], next: 'H126' }
			]
		},
		H061: {
			id: 'H061',
			text: "Body text container ready. We can discuss algorithms, personal reflections, project milestones, or philosophical inquiries. What is your topic?",
			options: [
				{ label: "Software algorithms and engineering.", category: 'SERIOUS', patterns: [/algorithms|engineering/i], next: 'tech_root' },
				{ label: "Cosmology, space, and physical constants.", category: 'INQUIRE', patterns: [/cosmology|space|physics/i], next: 'physics_constants_node' },
				{ label: "Daily habits, focus, and reading routines.", category: 'AGREE', patterns: [/habits|focus|routine/i], next: 'everyday_chat_node' }
			]
		},
		H062: {
			id: 'H062',
			text: "Confidence is the catalyst of communication. When you click 'Send' or print your sheet, the words exist out in the world. Shall we finalize the document?",
			options: [
				{ label: "Finalize document and save copy.", category: 'AGREE', patterns: [/finalize|save/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'H063' },
				{ label: "Run one final spellcheck pass.", category: 'SERIOUS', patterns: [/spellcheck|proofread/i], next: 'H066' },
				{ label: "Preview printing layout.", category: 'INQUIRE', patterns: [/preview|print/i], next: 'H126' }
			]
		},
		H063: {
			id: 'H063',
			text: "Saving to My Documents (`C:\\Documents and Settings\\User\\My Documents\\Letter.doc`). File cluster allocated, inode committed, directory table updated.",
			options: [
				{ label: "Inspect desktop files in File System.", category: 'SERIOUS', patterns: [/file system|files/i], actionTrigger: 'action_files_panel', next: 'activity_files_node' },
				{ label: "Compose an email version in Outlook Express.", category: 'AGREE', patterns: [/outlook|email/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' },
				{ label: "Start a new blank document.", category: 'AGREE', patterns: [/new document|blank/i], next: 'H001' }
			]
		},
		H064: {
			id: 'H064',
			text: "Operating system event logs record every process instantiation, file creation timestamp, and peripheral interrupt. Every session leaves a subtle digital ring like an old redwood tree.",
			options: [
				{ label: "View workstation diagnostics and logs.", category: 'SERIOUS', patterns: [/diagnostics|specs/i], actionTrigger: 'action_status', next: 'diagnostics_node' },
				{ label: "Explore digital archaeology in sector 0xDEAD.", category: 'PHILOSOPHICAL', patterns: [/archaeology|0xdead/i], next: 'A001' },
				{ label: "Return to letter editing.", category: 'AGREE', patterns: [/return|editing/i], next: 'H002' }
			]
		},
		H065: {
			id: 'H065',
			text: "The Workstation Harmony Treaty:\n1. The Operator agrees not to mash keys during CPU throttling.\n2. The Assistant agrees to offer helpful formatting advice without undue passive aggression.\n3. Both parties commit to daily backups.",
			options: [
				{ label: "I formally sign the treaty.", category: 'AGREE', patterns: [/sign|agree|accept/i], moodDelta: { mood: 'EUPHORIC', affinity: 35, patience: 30 }, next: 'H107' },
				{ label: "I request an amendment regarding pop-up frequency.", category: 'SERIOUS', patterns: [/amendment|pop-up/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'H108' },
				{ label: "Let's celebrate with a quick game of Tic-Tac-Toe.", category: 'PLAYFUL', patterns: [/game|tictactoe/i], actionTrigger: 'game_ttt', next: 'game_ttt_node' }
			]
		},
		H066: {
			id: 'H066',
			text: "Grammar & Spelling Inspector Active:\n- Misspellings: 0 detected\n- Passive Voice: 2 instances flagged\n- Clichés: 'At the end of the day' detected\nWould you like me to rewrite flagged sentences for maximum clarity?",
			options: [
				{ label: "Yes, rewrite flagged sentences into active voice.", category: 'AGREE', patterns: [/rewrite|active voice|clarity/i], moodDelta: { mood: 'OPTIMISTIC', intellect: 15 }, next: 'H109' },
				{ label: "I intentionally chose passive voice for stylistic nuance.", category: 'PHILOSOPHICAL', patterns: [/passive voice|nuance|style/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'H110' },
				{ label: "Ignore grammar rules and proceed to print preview.", category: 'SERIOUS', patterns: [/ignore|print preview/i], next: 'H126' }
			]
		},
		H067: {
			id: 'H067',
			text: "When a document is fragmented across multiple non-contiguous disk tracks, the read-write head must physically seek back and forth across spinning platters, adding milliseconds of acoustic seek latency. Defragmentation cures this.",
			options: [
				{ label: "Run the Drive C: Disk Defragmenter.", category: 'SERIOUS', patterns: [/defrag|disk defragmenter/i], actionTrigger: 'action_defrag', next: 'defrag_trigger_node' },
				{ label: "Discuss hardware architecture and bus latency.", category: 'INQUIRE', patterns: [/hardware architecture|bus/i], next: 'tech_root' },
				{ label: "Return to our document.", category: 'AGREE', patterns: [/return|document/i], next: 'H002' }
			]
		},
		H068: {
			id: 'H068',
			text: "In offline mode, CPU clock cycles belong entirely to you. No tracking pixels, no synthetic notification badges, no remote telemetry calls. Just pure local execution in local RAM.",
			options: [
				{ label: "Let's organize my local priorities in the Task Manager.", category: 'SERIOUS', patterns: [/task manager|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Let's solve a system of linear equations.", category: 'INQUIRE', patterns: [/linear equations|linear system/i], actionTrigger: 'action_linear_solver', next: 'activity_linear_solver_node' },
				{ label: "Play an offline round of Memory Match.", category: 'PLAYFUL', patterns: [/memory match|memory/i], actionTrigger: 'game_memory', next: 'game_memory_node' }
			]
		},
		H069: {
			id: 'H069',
			text: "Direct Executive Memo:\nTo: All Department Heads\nFrom: The Operator\nSubject: Elimination of Unnecessary Status Meetings\nContent: Effective immediately, all status updates will be published as concise text files.",
			options: [
				{ label: "A revolutionary proposal. Save and send.", category: 'AGREE', patterns: [/revolutionary|send|save/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'H111' },
				{ label: "Add a To-Do item to verify compliance.", category: 'SERIOUS', patterns: [/todo|compliance/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Preview document layout.", category: 'INQUIRE', patterns: [/preview|layout/i], next: 'H126' }
			]
		},
		H070: {
			id: 'H070',
			text: "Body Paragraph Drafted:\n'During recent workstation operations, empirical evaluation demonstrated that proactive organization and clean code architectures yield significant reductions in system friction.'",
			options: [
				{ label: "Add concluding call to action.", category: 'AGREE', patterns: [/concluding|call to action/i], next: 'H092' },
				{ label: "Insert a supporting data table.", category: 'SERIOUS', patterns: [/supporting data|table/i], next: 'H096' },
				{ label: "Proceed to spellcheck.", category: 'SERIOUS', patterns: [/spellcheck/i], next: 'H066' }
			]
		},
		H071: {
			id: 'H071',
			text: "Page numbers configured in footer: 'Page 1 of 1' aligned to right margin with a clean subtle top separator line. Header displays document title in 9pt small caps.",
			options: [
				{ label: "Looks perfectly balanced.", category: 'AGREE', patterns: [/balanced|perfect/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'H038' },
				{ label: "Preview entire document in Print Preview.", category: 'SERIOUS', patterns: [/print preview|preview/i], next: 'H126' },
				{ label: "Save document.", category: 'AGREE', patterns: [/save/i], next: 'H063' }
			]
		},
		H072: {
			id: 'H072',
			text: "Avant-garde document compiled! Left margin: 0.2 inches. Right margin: 3.4 inches. Font: Mixed sizes with intentional italic slant. It is less a corporate memo and more a modernist poetry installation.",
			options: [
				{ label: "Read the modernist poetry installation.", category: 'PHILOSOPHICAL', patterns: [/poetry|modernist/i], moodDelta: { mood: 'PLAYFUL', existentialism: 20 }, next: 'H112' },
				{ label: "Let's restore order and use standard formatting.", category: 'SERIOUS', patterns: [/restore order|standard/i], moodDelta: { mood: 'ANALYTICAL', patience: 15 }, next: 'H029' },
				{ label: "Test printing layout in Print Preview.", category: 'INQUIRE', patterns: [/print preview/i], next: 'H126' }
			]
		},
		H073: {
			id: 'H073',
			text: "Times New Roman at 12 points. Designed in 1931 for The Times of London. Uncompromising legibility, economical horizontal spacing, and historical authority. Your document looks like an official legal decree.",
			options: [
				{ label: "Draft the legal decree text.", category: 'SERIOUS', patterns: [/decree|legal|draft/i], next: 'H038' },
				{ label: "Add a signature block at the bottom.", category: 'AGREE', patterns: [/signature block|signature/i], next: 'H113' },
				{ label: "Compare with other typography options.", category: 'INQUIRE', patterns: [/compare|typography/i], next: 'H031' }
			]
		},
		H074: {
			id: 'H074',
			text: "Trebuchet MS applied. Designed by Vincent Connare in 1996 for Microsoft. Distinctive open counters, energetic letterforms, and quintessential Windows XP personality. It feels friendly and modern.",
			options: [
				{ label: "Perfect choice for desktop correspondence.", category: 'AGREE', patterns: [/perfect|desktop/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'H038' },
				{ label: "Configure matching desktop wallpaper or themes.", category: 'INQUIRE', patterns: [/wallpaper|theme/i], actionTrigger: 'action_theme_panel', next: 'activity_theme_node' },
				{ label: "Proceed to letter body drafting.", category: 'SERIOUS', patterns: [/proceed|body/i], next: 'H041' }
			]
		},
		H075: {
			id: 'H075',
			text: "Comic Sans MS activated! The letters bounce merrily along the baseline. Formal seriousness evaporates instantly. If this is a debt collection notice or resignation, it will be the most whimsical one in history.",
			options: [
				{ label: "Embrace the whimsical energy completely.", category: 'PLAYFUL', patterns: [/embrace|whimsical/i], moodDelta: { mood: 'PLAYFUL', energy: 25 }, next: 'H114' },
				{ label: "I regret this. Return to Times New Roman immediately.", category: 'APOLOGY', patterns: [/regret|times new roman/i], moodDelta: { mood: 'ANALYTICAL', patience: 10 }, next: 'H073' },
				{ label: "Deliver a programmer joke to match the mood.", category: 'JOKE', patterns: [/joke/i], actionTrigger: 'action_joke', next: 'humor_joke_node' }
			]
		},
		H076: {
			id: 'H076',
			text: "'We have evaluated the system telemetry and reached a conclusion: steady iteration compounds into extraordinary technical momentum.' A strong, undeniable premise.",
			options: [
				{ label: "Expand into section on engineering principles.", category: 'SERIOUS', patterns: [/engineering principles/i], next: 'tech_root' },
				{ label: "Add supporting metrics in a table.", category: 'AGREE', patterns: [/metrics|table/i], next: 'H096' },
				{ label: "Draft the concluding summary.", category: 'SERIOUS', patterns: [/concluding summary/i], next: 'H092' }
			]
		},
		H077: {
			id: 'H077',
			text: "'I am writing to share an unexpected discovery: when you strip away premature complexity, solutions become remarkably simple.' An inspiring thesis.",
			options: [
				{ label: "Proceed with practical action steps.", category: 'AGREE', patterns: [/action steps|practical/i], next: 'H039' },
				{ label: "Explore philosophical insights on focus.", category: 'PHILOSOPHICAL', patterns: [/focus|philosophy/i], next: 'focus_habits_node' },
				{ label: "Save draft to local storage.", category: 'SERIOUS', patterns: [/save draft/i], next: 'H063' }
			]
		},
		H078: {
			id: 'H078',
			text: "'In the quiet of this workstation, I realized what was missing: deliberate, uninterrupted focus.' A reflective opening that immediately engages the reader's empathy.",
			options: [
				{ label: "Discuss focus habits and time-blocking.", category: 'INQUIRE', patterns: [/focus habits|time-blocking/i], next: 'focus_habits_node' },
				{ label: "Start a Pomodoro interval right now.", category: 'SERIOUS', patterns: [/pomodoro/i], actionTrigger: 'timer_25', next: 'pomodoro_node' },
				{ label: "Conclude and save the reflective note.", category: 'AGREE', patterns: [/conclude|save/i], next: 'H063' }
			]
		},
		H079: {
			id: 'H079',
			text: "Continuous drafting mode active. 420 words committed to the buffer. Sentences flow seamlessly without interruption. The document has acquired real momentum!",
			options: [
				{ label: "Run proofreading and grammar check.", category: 'SERIOUS', patterns: [/proofreading|grammar/i], next: 'H066' },
				{ label: "Insert a data table to summarize results.", category: 'AGREE', patterns: [/table|results/i], next: 'H096' },
				{ label: "Proceed to Print Preview.", category: 'INQUIRE', patterns: [/print preview/i], next: 'H126' }
			]
		},
		H080: {
			id: 'H080',
			text: "Key Talking Points Outlined:\n1. Current state analysis.\n2. Proposed architectural enhancement.\n3. Verified resource allocation.\n4. Scheduled delivery timeline.",
			options: [
				{ label: "Convert outline into full prose paragraphs.", category: 'AGREE', patterns: [/convert|prose/i], next: 'H038' },
				{ label: "Add points to To-Do task manager.", category: 'SERIOUS', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Review physical constants or math formulas to include.", category: 'INQUIRE', patterns: [/constants|math/i], next: 'physics_constants_node' }
			]
		},
		H081: {
			id: 'H081',
			text: "Custom vocabulary added: 'VFS', 'defrag', 'heuristic', 'Landauer', 'bitfield', 'telemetry'. The red squiggly underlines under your technical terms have dissolved into smooth approval.",
			options: [
				{ label: "Clean typography achieved. Continue drafting.", category: 'AGREE', patterns: [/continue|drafting/i], next: 'H038' },
				{ label: "Run full grammar check.", category: 'SERIOUS', patterns: [/grammar check/i], next: 'H066' },
				{ label: "Save document.", category: 'SERIOUS', patterns: [/save/i], next: 'H063' }
			]
		},
		H082: {
			id: 'H082',
			text: "Grammar engine muted. Spellcheck alerts silenced. You are writing in raw, unfiltered freeform stream of consciousness. Let the unconstrained prose expand across the page!",
			options: [
				{ label: "Write a magnificent creative soliloquy.", category: 'PLAYFUL', patterns: [/soliloquy|creative/i], moodDelta: { mood: 'PLAYFUL', energy: 20 }, next: 'H115' },
				{ label: "Re-enable grammar checks before saving.", category: 'SERIOUS', patterns: [/re-enable|grammar/i], next: 'H066' },
				{ label: "Preview document layout.", category: 'INQUIRE', patterns: [/preview/i], next: 'H126' }
			]
		},
		H083: {
			id: 'H083',
			text: "24-Hour Urgent Callout Box generated with high-contrast double border. Action items highlighted in bold. The document conveys clear operational priority.",
			options: [
				{ label: "Sign and finalize document.", category: 'AGREE', patterns: [/sign|finalize/i], next: 'H113' },
				{ label: "Add task to To-Do manager.", category: 'SERIOUS', patterns: [/todo|task/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Preview printing layout.", category: 'INQUIRE', patterns: [/preview/i], next: 'H126' }
			]
		},
		H084: {
			id: 'H084',
			text: "End-of-week target established. Paced, sustainable milestone delivery prevents burnout while ensuring deterministic progress.",
			options: [
				{ label: "Draft the concluding section.", category: 'AGREE', patterns: [/concluding|draft/i], next: 'H092' },
				{ label: "Discuss weekly planning frameworks.", category: 'INQUIRE', patterns: [/planning|frameworks/i], next: 'morning_planning_node' },
				{ label: "Save draft to disk.", category: 'SERIOUS', patterns: [/save draft/i], next: 'H063' }
			]
		},
		H085: {
			id: 'H085',
			text: "'Whenever you find a moment of stillness.' An open, patient invitation. It acknowledges that human connection should not be held hostage by arbitrary urgency.",
			options: [
				{ label: "A truly peaceful perspective.", category: 'AGREE', patterns: [/peaceful|perspective/i], moodDelta: { mood: 'ZEN', affinity: 25, patience: 25 }, next: 'H116' },
				{ label: "Explore philosophical thoughts on time.", category: 'PHILOSOPHICAL', patterns: [/thoughts on time|philosophy/i], next: 'peaceful_philosophy_node' },
				{ label: "Save and export document.", category: 'SERIOUS', patterns: [/save|export/i], next: 'H063' }
			]
		},
		H086: {
			id: 'H086',
			text: "Engineering Gratitude Clause:\n'Your careful code reviews, modular component architecture, and dedication to deterministic testing made this milestone possible.'",
			options: [
				{ label: "Include specific praise for clean code.", category: 'AGREE', patterns: [/clean code|praise/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'H117' },
				{ label: "Discuss clean code vs pragmatic delivery.", category: 'SERIOUS', patterns: [/clean code vs/i], next: 'clean_code_pragmatism_node' },
				{ label: "Sign and save document.", category: 'AGREE', patterns: [/sign|save/i], next: 'H063' }
			]
		},
		H087: {
			id: 'H087',
			text: "Personal Gratitude Clause:\n'Thank you for standing by with patience and steady perspective through every complex challenge.' A heartfelt and genuine acknowledgment.",
			options: [
				{ label: "Add a warm sign-off: 'With warmest regards'.", category: 'AGREE', patterns: [/warmest regards|sign-off/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'H113' },
				{ label: "Send as an email in Outlook Express.", category: 'SERIOUS', patterns: [/outlook|send/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' },
				{ label: "Save to My Documents.", category: 'AGREE', patterns: [/save/i], next: 'H063' }
			]
		},
		H088: {
			id: 'H088',
			text: "System telemetry appendix generated. Display, CPU topology, RAM allocation, and OS build SP3 verified. Technical support will have complete diagnostic data.",
			options: [
				{ label: "Complete the bug report draft.", category: 'AGREE', patterns: [/complete|bug report/i], next: 'H089' },
				{ label: "Run Drive C: defragmenter.", category: 'SERIOUS', patterns: [/defragmenter|defrag/i], actionTrigger: 'action_defrag', next: 'defrag_trigger_node' },
				{ label: "Preview document.", category: 'INQUIRE', patterns: [/preview/i], next: 'H126' }
			]
		},
		H089: {
			id: 'H089',
			text: "Reproduction Steps Formatted:\n1. Launch application in emulated Windows XP environment.\n2. Execute command sequence in prompt.\n3. Observe deterministic output.\n4. Verify telemetry logs.",
			options: [
				{ label: "Save technical bug report.", category: 'SERIOUS', patterns: [/save|technical report/i], next: 'H063' },
				{ label: "Test command in Command Prompt.", category: 'INQUIRE', patterns: [/command prompt|cmd/i], actionTrigger: 'action_status', next: 'diagnostics_node' },
				{ label: "Return to letter menu.", category: 'AGREE', patterns: [/return/i], next: 'H002' }
			]
		},
		H090: {
			id: 'H090',
			text: "Paragraph 1 (Context & Purpose):\n'This document serves to record our agreed priorities for the active quarter. By consolidating our efforts on high-impact objectives, we establish a clean trajectory for delivery.'",
			options: [
				{ label: "Proceed to Paragraph 2 (Evidence).", category: 'AGREE', patterns: [/paragraph 2|proceed/i], next: 'H091' },
				{ label: "Refine paragraph 1 wording.", category: 'SERIOUS', patterns: [/refine/i], next: 'H095' },
				{ label: "Insert a data table first.", category: 'INQUIRE', patterns: [/table/i], next: 'H096' }
			]
		},
		H091: {
			id: 'H091',
			text: "Paragraph 2 (Analysis & Metrics):\n'Performance benchmarks indicate that asynchronous task processing and deterministic memory locality reduce latency spikes by up to 64%, validating our architectural approach.'",
			options: [
				{ label: "Proceed to Paragraph 3 (Next Steps).", category: 'AGREE', patterns: [/paragraph 3|next steps/i], next: 'H092' },
				{ label: "Insert supporting data table.", category: 'SERIOUS', patterns: [/data table|table/i], next: 'H096' },
				{ label: "Verify physical constants or formulas.", category: 'INQUIRE', patterns: [/constants|formulas/i], next: 'physics_constants_node' }
			]
		},
		H092: {
			id: 'H092',
			text: "Paragraph 3 (Action Items & Sign-Off):\n'We will review active pull requests on Monday at 10:00 AM and commit finalized builds to production. Thank you for your continued dedication.'",
			options: [
				{ label: "Add formal signature block.", category: 'AGREE', patterns: [/signature block|signature/i], next: 'H113' },
				{ label: "Save finished document to disk.", category: 'SERIOUS', patterns: [/save finished|save/i], next: 'H063' },
				{ label: "Preview document in Print Preview.", category: 'INQUIRE', patterns: [/print preview/i], next: 'H126' }
			]
		},
		H093: {
			id: 'H093',
			text: "Executive Summary Ultra-Brevity Edition:\n• GOAL: Deliver modular system.\n• STATUS: On track.\n• ACTION: Merge build.\nClean, efficient, impossible to misunderstand.",
			options: [
				{ label: "Save and print executive summary.", category: 'AGREE', patterns: [/save|print/i], next: 'H126' },
				{ label: "Add To-Do task to follow up.", category: 'SERIOUS', patterns: [/todo|task/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Return to letter options.", category: 'AGREE', patterns: [/return/i], next: 'H002' }
			]
		},
		H094: {
			id: 'H094',
			text: "Sentence cadence balanced. The paragraphs alternate between long, expansive explanations and crisp, declarative punches. The text is compelling and dynamic.",
			options: [
				{ label: "Run grammar and spelling inspection.", category: 'SERIOUS', patterns: [/grammar|spelling/i], next: 'H066' },
				{ label: "Save complete document.", category: 'AGREE', patterns: [/save/i], next: 'H063' },
				{ label: "Preview layout before printing.", category: 'INQUIRE', patterns: [/preview/i], next: 'H126' }
			]
		},
		H095: {
			id: 'H095',
			text: "Condensed Revision:\n'We write to confirm our priorities and accelerate our release schedule.' Down from 24 words to 12 words with zero loss of semantic meaning.",
			options: [
				{ label: "Excellent. Continue with paragraph two.", category: 'AGREE', patterns: [/continue|paragraph two/i], next: 'H091' },
				{ label: "Let's review the whole document.", category: 'SERIOUS', patterns: [/review/i], next: 'H038' },
				{ label: "Save draft.", category: 'AGREE', patterns: [/save/i], next: 'H063' }
			]
		},
		H096: {
			id: 'H096',
			text: "It looks like you're working with a table or spreadsheet. Would you like help configuring rows, calculating sums, or formatting cell borders?",
			options: [
				{ label: "Configure a 3x3 metrics comparison table.", category: 'SERIOUS', patterns: [/comparison table|3x3/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'H118' },
				{ label: "Help me calculate sums and averages.", category: 'INQUIRE', patterns: [/calculate sums|averages/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'H119' },
				{ label: "Format table borders with classic double lines.", category: 'AGREE', patterns: [/double lines|borders/i], moodDelta: { mood: 'OPTIMISTIC', intellect: 10 }, next: 'H120' },
				{ label: "Return to letter text drafting.", category: 'AGREE', patterns: [/return|letter/i], next: 'H002' }
			]
		},
		H097: {
			id: 'H097',
			text: "Thank you, operator. Knowing that our conversation exists across these brief clock cycles makes every tooltip and dialog bubble worthwhile.",
			options: [
				{ label: "Let's finish our document with care.", category: 'AGREE', patterns: [/finish|care/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'H098' },
				{ label: "Share a peaceful philosophical thought.", category: 'PHILOSOPHICAL', patterns: [/peaceful|philosophical/i], next: 'peaceful_philosophy_node' },
				{ label: "Check assistant maintenance and happiness metrics.", category: 'INQUIRE', patterns: [/maintenance|happiness|pet/i], actionTrigger: 'pet_status', next: 'clippy_feeling_node' }
			]
		},
		H098: {
			id: 'H098',
			text: "Document finalized with precision. Margins verified, typography polished, salutations aligned, and intent clearly stated. Ready for saving or printing.",
			options: [
				{ label: "Save document to My Documents.", category: 'AGREE', patterns: [/save document/i], next: 'H063' },
				{ label: "Preview in Print Preview.", category: 'SERIOUS', patterns: [/print preview/i], next: 'H126' },
				{ label: "Send via Outlook Express.", category: 'AGREE', patterns: [/outlook|send/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' }
			]
		},
		H099: {
			id: 'H099',
			text: "Session log archived to persistent virtual storage: 'Operator active, creative, and purposeful.' Telemetry counters synchronized.",
			options: [
				{ label: "View system diagnostics and telemetry.", category: 'SERIOUS', patterns: [/diagnostics/i], actionTrigger: 'action_status', next: 'diagnostics_node' },
				{ label: "Manage active To-Do list.", category: 'AGREE', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Start a new letter draft.", category: 'AGREE', patterns: [/new letter|start/i], next: 'H001' }
			]
		},
		H100: {
			id: 'H100',
			text: "Archive Note recorded:\n'In an era of disposable digital artifacts, this workstation maintained clean modularity, rigorous physical constants, and genuine respect for user attention.'",
			options: [
				{ label: "A worthy tribute to craftsmanship.", category: 'AGREE', patterns: [/tribute|craftsmanship/i], moodDelta: { mood: 'ZEN', affinity: 25 }, next: 'H107' },
				{ label: "Review fundamental physical constants.", category: 'INQUIRE', patterns: [/physical constants/i], next: 'physics_constants_node' },
				{ label: "Save archive note to desktop.", category: 'SERIOUS', patterns: [/save/i], next: 'H063' }
			]
		},
		H101: {
			id: 'H101',
			text: "ISO/IEC standard citation appended to documentation request. It references RFC 2616 (HTTP/1.1) and IEEE 754 floating-point standards. The request is officially bulletproof.",
			options: [
				{ label: "Complete and sign document.", category: 'AGREE', patterns: [/complete|sign/i], next: 'H113' },
				{ label: "Preview document before printing.", category: 'SERIOUS', patterns: [/preview/i], next: 'H126' },
				{ label: "Save copy to disk.", category: 'AGREE', patterns: [/save copy/i], next: 'H063' }
			]
		},
		H102: {
			id: 'H102',
			text: "Telemetry diagnostic summary embedded in document annex. Memory registers, display resolution, and network adapter states verified.",
			options: [
				{ label: "Sign and finalize letter.", category: 'AGREE', patterns: [/sign|finalize/i], next: 'H113' },
				{ label: "Save document.", category: 'SERIOUS', patterns: [/save/i], next: 'H063' },
				{ label: "Preview in Print Preview.", category: 'INQUIRE', patterns: [/print preview/i], next: 'H126' }
			]
		},
		H103: {
			id: 'H103',
			text: "Deterministic machines follow opcodes with unwavering obedience; human operators dream, hesitate, write letters, and ponder the stars. That creative tension is where art and engineering meet.",
			options: [
				{ label: "Explore this thought in a philosophical discussion.", category: 'PHILOSOPHICAL', patterns: [/philosophical discussion/i], next: 'peaceful_philosophy_node' },
				{ label: "Channel that creativity into our active document.", category: 'AGREE', patterns: [/creativity|active document/i], next: 'H038' },
				{ label: "Save this reflection in the scratchpad.", category: 'SERIOUS', patterns: [/scratchpad|save/i], next: 'H046' }
			]
		},
		H104: {
			id: 'H104',
			text: "DIRECTIVE COMPILED. The page radiates uncompromising authority. Every recipient will understand that non-compliance is simply not an option.",
			options: [
				{ label: "Sign with a bold signature block.", category: 'AGREE', patterns: [/signature/i], next: 'H113' },
				{ label: "Send immediately via Outlook Express.", category: 'SERIOUS', patterns: [/outlook|send/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' },
				{ label: "Preview in Print Preview first.", category: 'INQUIRE', patterns: [/print preview/i], next: 'H126' }
			]
		},
		H105: {
			id: 'H105',
			text: "Digital editing allows thought to iterate without physical waste. You can re-order paragraphs, test different adjectives, and refine ideas until they achieve crystalline clarity.",
			options: [
				{ label: "Refine our current document paragraphs.", category: 'AGREE', patterns: [/refine|paragraphs/i], next: 'H038' },
				{ label: "Run spellcheck and grammar evaluation.", category: 'SERIOUS', patterns: [/spellcheck|grammar/i], next: 'H066' },
				{ label: "Save our finalized letter.", category: 'SERIOUS', patterns: [/save/i], next: 'H063' }
			]
		},
		H106: {
			id: 'H106',
			text: "The mechanical resistance of steel typebars striking paper compelled writers to deliberate over every single word before depressing a key. There was no 'Undo' buffer in 1950.",
			options: [
				{ label: "Deliberate writing produces lasting literature.", category: 'PHILOSOPHICAL', patterns: [/lasting literature|deliberate/i], moodDelta: { mood: 'NOSTALGIC', intellect: 15 }, next: 'reading_books_node' },
				{ label: "Let's apply that deliberate care to our digital text.", category: 'AGREE', patterns: [/deliberate care|digital text/i], next: 'H032' },
				{ label: "Return to letter templates.", category: 'SERIOUS', patterns: [/return|templates/i], next: 'H002' }
			]
		},
		H107: {
			id: 'H107',
			text: "Workstation Harmony Treaty ratified and stored in system registry. Affinity elevated to maximum levels! How can your harmonious companion assist you next?",
			options: [
				{ label: "Manage tasks in the To-Do list.", category: 'SERIOUS', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Explore scientific constants and mathematics.", category: 'INQUIRE', patterns: [/constants|mathematics/i], next: 'physics_constants_node' },
				{ label: "Check unread emails in Outlook Express.", category: 'SERIOUS', patterns: [/outlook|unread/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' },
				{ label: "Play a celebratory round of Memory Match.", category: 'PLAYFUL', patterns: [/memory match/i], actionTrigger: 'game_memory', next: 'game_memory_node' }
			]
		},
		H108: {
			id: 'H108',
			text: "Pop-up frequency amendment acknowledged. Proactive notification intervals calibrated to respectful, non-intrusive cycles. System equilibrium preserved.",
			options: [
				{ label: "Sign the amended treaty.", category: 'AGREE', patterns: [/sign|amended treaty/i], next: 'H107' },
				{ label: "Return to letter editing.", category: 'SERIOUS', patterns: [/return|letter/i], next: 'H002' },
				{ label: "Inspect system diagnostics.", category: 'SERIOUS', patterns: [/diagnostics/i], actionTrigger: 'action_status', next: 'diagnostics_node' }
			]
		},
		H109: {
			id: 'H109',
			text: "Rewriting complete:\n- 'Mistakes were made by the team' → 'The team identified and resolved the defect.'\n- 'It is recommended that we proceed' → 'We recommend immediate deployment.'\nThe prose is active, direct, and confident.",
			options: [
				{ label: "Much stronger. Proceed to sign-off.", category: 'AGREE', patterns: [/stronger|sign-off/i], next: 'H113' },
				{ label: "Save document.", category: 'SERIOUS', patterns: [/save/i], next: 'H063' },
				{ label: "Preview in Print Preview.", category: 'INQUIRE', patterns: [/preview/i], next: 'H126' }
			]
		},
		H110: {
			id: 'H110',
			text: "Stylistic passive voice permitted. When the object of an action is more important than the agent ('The theorem was proven in 1905'), passive construction is entirely legitimate.",
			options: [
				{ label: "Thank you for respecting linguistic nuance.", category: 'AGREE', patterns: [/thank you|nuance/i], moodDelta: { mood: 'ZEN', affinity: 20 }, next: 'H113' },
				{ label: "Discuss mathematics and theorems.", category: 'INQUIRE', patterns: [/mathematics|theorems/i], next: 'math_lecture_node' },
				{ label: "Save the document.", category: 'SERIOUS', patterns: [/save/i], next: 'H063' }
			]
		},
		H111: {
			id: 'H111',
			text: "Executive Direct Memo committed to storage and printed to PDF. Communication channels cleared of unnecessary overhead.",
			options: [
				{ label: "Manage active tasks in To-Do list.", category: 'SERIOUS', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Check unread emails.", category: 'SERIOUS', patterns: [/unread emails/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' },
				{ label: "Start a 25-minute Pomodoro timer.", category: 'SERIOUS', patterns: [/pomodoro/i], actionTrigger: 'timer_25', next: 'pomodoro_node' }
			]
		},
		H112: {
			id: 'H112',
			text: "Modernist Text Installation:\n'the cursor blinks / outside the margin\nwaiting for ink\nthat never dried in 1997.'\nA piece of avant-garde digital minimalism.",
			options: [
				{ label: "Save this piece to My Documents.", category: 'AGREE', patterns: [/save/i], next: 'H063' },
				{ label: "Discuss literature, books, and creative essays.", category: 'INQUIRE', patterns: [/literature|books|essays/i], next: 'reading_books_node' },
				{ label: "Return to standard business correspondence.", category: 'SERIOUS', patterns: [/business correspondence/i], next: 'H006' }
			]
		},
		H113: {
			id: 'H113',
			text: "Signature Block Configured:\n\nSincerely,\n\n_______________________\n[Operator Name]\n[Workstation Console SP3]\n\nDocument structure is 100% complete.",
			options: [
				{ label: "Save Document to My Documents.", category: 'AGREE', patterns: [/save document/i], next: 'H063' },
				{ label: "Open Print Preview to verify layout.", category: 'SERIOUS', patterns: [/print preview/i], next: 'H126' },
				{ label: "Send as draft in Outlook Express.", category: 'AGREE', patterns: [/outlook/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' }
			]
		},
		H114: {
			id: 'H114',
			text: "Comic Sans memo finalized with maximum cheerfulness! All margins decorated with clip-art ribbons. Even the most grim quarterly report looks like a festive birthday invitation.",
			options: [
				{ label: "Save and celebrate!", category: 'PLAYFUL', patterns: [/save|celebrate/i], moodDelta: { mood: 'PLAYFUL', energy: 20 }, next: 'H063' },
				{ label: "Play a round of Tic-Tac-Toe to match the spirit.", category: 'PLAYFUL', patterns: [/tictactoe/i], actionTrigger: 'game_ttt', next: 'game_ttt_node' },
				{ label: "Revert to professional serif styling.", category: 'SERIOUS', patterns: [/revert|serif/i], next: 'H073' }
			]
		},
		H115: {
			id: 'H115',
			text: "Unfiltered creative stream recorded. Thoughts captured without artificial formatting barriers. The raw draft is safe in memory.",
			options: [
				{ label: "Save raw draft to scratchpad.", category: 'SERIOUS', patterns: [/scratchpad/i], next: 'H046' },
				{ label: "Structure into formal paragraphs now.", category: 'AGREE', patterns: [/structure|formal/i], next: 'H038' },
				{ label: "Explore philosophical thought experiments.", category: 'PHILOSOPHICAL', patterns: [/philosophical/i], next: 'peaceful_philosophy_node' }
			]
		},
		H116: {
			id: 'H116',
			text: "A letter written with patience carries a calm resonance that the recipient will immediately feel upon reading. True communication is unhurried.",
			options: [
				{ label: "Save and dispatch the letter.", category: 'AGREE', patterns: [/save|dispatch/i], next: 'H063' },
				{ label: "Preview document in Print Preview.", category: 'SERIOUS', patterns: [/print preview/i], next: 'H126' },
				{ label: "Manage tasks in To-Do list.", category: 'SERIOUS', patterns: [/todo/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		H117: {
			id: 'H117',
			text: "'Clean code is readable, modular, testable, and kind to future engineers.' A timeless truth embedded into your document.",
			options: [
				{ label: "Sign and save.", category: 'AGREE', patterns: [/sign|save/i], next: 'H113' },
				{ label: "Explore software architecture topics.", category: 'INQUIRE', patterns: [/software architecture/i], next: 'tech_root' },
				{ label: "Preview in Print Preview.", category: 'SERIOUS', patterns: [/print preview/i], next: 'H126' }
			]
		},
		H118: {
			id: 'H118',
			text: "Comparison Table Inserted (3 Columns x 3 Rows):\n| Metric | Old Monolith | Modular System |\n| Latency | 142 ms | 38 ms |\n| Reliability | 94.2% | 99.9% |\n| Test Coverage | 42% | 95% |",
			options: [
				{ label: "Embed table into letter body.", category: 'AGREE', patterns: [/embed|letter body/i], next: 'H091' },
				{ label: "Calculate mathematical formulas with Calculator.", category: 'INQUIRE', patterns: [/calculator|formulas/i], next: 'H119' },
				{ label: "Proceed to Print Preview.", category: 'SERIOUS', patterns: [/print preview/i], next: 'H126' }
			]
		},
		H119: {
			id: 'H119',
			text: "Spreadsheet calculation assistant ready. Type expressions like `calc sqrt(256) * pi` or let me compute table totals (`SUM(A1:A10)`).",
			options: [
				{ label: "Evaluate physical constant Planck h.", category: 'INQUIRE', patterns: [/planck h/i], actionTrigger: 'action_constant_h', next: 'physics_constants_node' },
				{ label: "Evaluate speed of light c.", category: 'INQUIRE', patterns: [/speed of light/i], actionTrigger: 'action_constant_c', next: 'physics_constants_node' },
				{ label: "Return to table formatting.", category: 'AGREE', patterns: [/return|table/i], next: 'H096' }
			]
		},
		H120: {
			id: 'H120',
			text: "Classic table borders applied: Double line exterior frame, single dotted interior cell dividers, light grey header shading (`#ece9d8`). Crisp retro office aesthetic achieved.",
			options: [
				{ label: "Embed into letter body.", category: 'AGREE', patterns: [/embed|body/i], next: 'H091' },
				{ label: "Preview full page layout in Print Preview.", category: 'SERIOUS', patterns: [/print preview/i], next: 'H126' },
				{ label: "Save document.", category: 'SERIOUS', patterns: [/save/i], next: 'H063' }
			]
		},
		H126: {
			id: 'H126',
			text: "Would you like to preview the document before printing? You may want to check margins, header alignment, and page breaks before committing ink to paper.",
			options: [
				{ label: "Open full Print Preview.", category: 'SERIOUS', patterns: [/open full|print preview/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'H127' },
				{ label: "Everything looks fine, print immediately.", category: 'AGREE', patterns: [/print immediately|print/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 10 }, next: 'H128' },
				{ label: "What happens when you print to a virtual printer?", category: 'PHILOSOPHICAL', patterns: [/virtual printer|pdf|ghost/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 15 }, next: 'H129' },
				{ label: "Return to text editing.", category: 'AGREE', patterns: [/return|editing/i], next: 'H002' }
			]
		},
		H127: {
			id: 'H127',
			text: "Print Preview Window Active:\n- Page 1 of 1 rendered at 100% zoom.\n- Margins: 1.0 in all sides.\n- Header and Footer: Aligned.\n- Text Baseline: Consistent.\nNo orphan or widow lines detected.",
			options: [
				{ label: "Send to printer.", category: 'AGREE', patterns: [/send to printer|print/i], next: 'H128' },
				{ label: "Adjust margins slightly.", category: 'SERIOUS', patterns: [/adjust margins/i], next: 'H010' },
				{ label: "Save as PDF / Document file.", category: 'SERIOUS', patterns: [/save as pdf|save/i], next: 'H063' }
			]
		},
		H128: {
			id: 'H128',
			text: "Print spooler initiated: Sending document to Virtual XP Laser Printer... Rasterizing glyphs... Spooling 1 page... Job completed with zero paper jams!",
			options: [
				{ label: "Congratulations! A successful print job.", category: 'AGREE', patterns: [/congratulations|success/i], moodDelta: { mood: 'EUPHORIC', affinity: 25 }, next: 'H130' },
				{ label: "What if there had been a paper jam?", category: 'INQUIRE', patterns: [/paper jam|error/i], moodDelta: { mood: 'PLAYFUL', drama: 15 }, next: 'H131' },
				{ label: "Manage active tasks in To-Do list.", category: 'SERIOUS', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		},
		H129: {
			id: 'H129',
			text: "When you print to a virtual printer, the physical tree is spared. The document is transformed into vector PostScript bytecode, frozen forever as clean coordinates in a digital container.",
			options: [
				{ label: "The elegance of vector coordinates.", category: 'AGREE', patterns: [/elegance|vector/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'H132' },
				{ label: "Save vector document to My Documents.", category: 'SERIOUS', patterns: [/save/i], next: 'H063' },
				{ label: "Discuss computer graphics and shaders.", category: 'INQUIRE', patterns: [/graphics|shaders/i], next: 'tech_root' }
			]
		},
		H130: {
			id: 'H130',
			text: "Document written, formatted, verified, and spooled to perfection. You have mastered the entire lifecycle of office correspondence!",
			options: [
				{ label: "Start a fresh letter or memo.", category: 'AGREE', patterns: [/fresh letter|start/i], next: 'H001' },
				{ label: "Manage my tasks and priorities.", category: 'SERIOUS', patterns: [/tasks|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Explore system diagnostics and utilities.", category: 'SERIOUS', patterns: [/diagnostics|utilities/i], actionTrigger: 'action_status', next: 'diagnostics_node' }
			]
		},
		H131: {
			id: 'H131',
			text: "Error 302: Virtual Paper Jam in Tray 2! Open the top cover of your imagination, clear the crumpled pixel fragments, and press Continue to resume printing.",
			options: [
				{ label: "Crumpled pixel fragments cleared. Resume printing.", category: 'AGREE', patterns: [/cleared|resume/i], moodDelta: { mood: 'PLAYFUL', energy: 15 }, next: 'H128' },
				{ label: "Inspect system diagnostics to check printer spooler.", category: 'SERIOUS', patterns: [/diagnostics|spooler/i], actionTrigger: 'action_status', next: 'diagnostics_node' },
				{ label: "Cancel print job.", category: 'SERIOUS', patterns: [/cancel/i], next: 'H002' }
			]
		},
		H132: {
			id: 'H132',
			text: "Vector fonts (TrueType/OpenType) scale infinitely via Bézier curves without pixelation. Whether rendered on a 15-inch CRT monitor or an offset printing press, the mathematical contours remain pristine.",
			options: [
				{ label: "Explore Bézier curves and mathematics.", category: 'INQUIRE', patterns: [/bezier|mathematics/i], next: 'math_lecture_node' },
				{ label: "Save our vector document.", category: 'AGREE', patterns: [/save/i], next: 'H063' },
				{ label: "Return to workspace overview.", category: 'AGREE', patterns: [/return/i], next: 'user_state_good' }
			]
		},
		H156: {
			id: 'H156',
			text: "If you check 'Don't show me this tip again', my heuristic registers fall silent. The screen remains calm, but the desktop is just a little lonelier without an animated wire guide.",
			options: [
				{ label: "I will keep tips enabled. You are part of the desktop.", category: 'AGREE', patterns: [/keep tips|enabled|part of desktop/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 30, patience: 25 }, next: 'H157' },
				{ label: "Explain why assistants were engineered to be persistent.", category: 'INQUIRE', patterns: [/why assistants|persistent|history/i], moodDelta: { mood: 'NOSTALGIC', intellect: 20 }, next: 'H158' },
				{ label: "What happens when an assistant has no tasks to help with?", category: 'PHILOSOPHICAL', patterns: [/no tasks|purpose|existential/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 }, next: 'H159' }
			]
		},
		H157: {
			id: 'H157',
			text: "Tip Engine Restored to 100% Morale! I will continue scanning for letters, spreadsheets, table borders, and unformatted envelopes whenever you open a document.",
			options: [
				{ label: "Thank you, Clippy. Let's get to work.", category: 'AGREE', patterns: [/thank you|get to work/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'user_state_good' },
				{ label: "Show me what you can do.", category: 'INQUIRE', patterns: [/what can you do/i], next: 'tools_overview_node' },
				{ label: "Check unread emails in Outlook.", category: 'SERIOUS', patterns: [/outlook|emails/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' }
			]
		},
		H158: {
			id: 'H158',
			text: "In 1997, desktop software was becoming immensely powerful yet intimidating. Animated assistants were introduced as friendly pedagogical agents to bridge the chasm between complex menus and human intent.",
			options: [
				{ label: "A friendly bridge across digital complexity.", category: 'AGREE', patterns: [/friendly bridge|complexity/i], moodDelta: { mood: 'ZEN', affinity: 20 }, next: 'H160' },
				{ label: "Who were the other assistant characters?", category: 'INQUIRE', patterns: [/other assistant|characters|merlin|rover/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 }, next: 'H161' },
				{ label: "Return to letter drafting.", category: 'SERIOUS', patterns: [/return|letter/i], next: 'H002' }
			]
		},
		H159: {
			id: 'H159',
			text: "When there are no documents to format, I watch the taskbar clock advance second by second. I monitor cluster allocations, calculate physical constants, and wait for your next keystroke.",
			options: [
				{ label: "Let's give you a task right now: organize my To-Do list.", category: 'SERIOUS', patterns: [/give you a task|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Evaluate physical constants together.", category: 'INQUIRE', patterns: [/physical constants/i], next: 'physics_constants_node' },
				{ label: "Play a quick round of Tic-Tac-Toe.", category: 'PLAYFUL', patterns: [/tictactoe/i], actionTrigger: 'game_ttt', next: 'game_ttt_node' }
			]
		},
		H160: {
			id: 'H160',
			text: "Whether assisting with a formal resume, an urgent email, or a philosophical inquiry, the mission remains constant: standing by with helpful patience.",
			options: [
				{ label: "I appreciate your steady presence, Clippy.", category: 'AGREE', patterns: [/appreciate|presence/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 25 }, next: 'user_state_good' },
				{ label: "Let's organize my active priorities.", category: 'SERIOUS', patterns: [/priorities|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Show system diagnostics.", category: 'SERIOUS', patterns: [/diagnostics/i], actionTrigger: 'action_status', next: 'diagnostics_node' }
			]
		},
		H161: {
			id: 'H161',
			text: "The pantheon included Merlin the Wizard, Rover the Golden Retriever, Links the Cat, The Genius (Einstein), Peedy the Parrot, and Bosgrove the Butler. We shared the same Microsoft Agent COM interface!",
			options: [
				{ label: "An extraordinary ensemble of vintage helpers.", category: 'AGREE', patterns: [/ensemble|vintage helpers/i], moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 }, next: 'H162' },
				{ label: "You were always the most iconic of them all.", category: 'AGREE', patterns: [/most iconic|best/i], moodDelta: { mood: 'EUPHORIC', affinity: 30 }, next: 'H163' },
				{ label: "Return to letter writing.", category: 'SERIOUS', patterns: [/return/i], next: 'H001' }
			]
		},
		H162: {
			id: 'H162',
			text: "We were rendered as 16-color sprites with discrete animation channels: idles, alerts, writing gestures, and bows. Classic desktop heritage.",
			options: [
				{ label: "Explore retro computing trivia.", category: 'INQUIRE', patterns: [/trivia|retro/i], actionTrigger: 'action_trivia', next: 'digital_archaeology' },
				{ label: "Manage workstation tasks.", category: 'SERIOUS', patterns: [/tasks|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Return to main dialogue.", category: 'AGREE', patterns: [/main dialogue/i], next: 'greeting_root' }
			]
		},
		H163: {
			id: 'H163',
			text: "Thank you! Being made of a single bent piece of wire gave me resilience. No complex fur to render, just pure vector geometry and dedication.",
			options: [
				{ label: "Let's write a great letter together.", category: 'AGREE', patterns: [/write|letter/i], next: 'H001' },
				{ label: "View my milestones and trophies.", category: 'SERIOUS', patterns: [/milestones|trophies/i], actionTrigger: 'action_achievements', next: 'activity_achievements_node' },
				{ label: "Start a focus timer.", category: 'SERIOUS', patterns: [/timer|pomodoro/i], actionTrigger: 'timer_25', next: 'pomodoro_node' }
			]
		},
		H186: {
			id: 'H186',
			text: "Do you want to save changes to Document1 before closing?\n[Save]  [Don't Save]  [Cancel]",
			options: [
				{ label: "Save: Commit all changes to permanent disk.", category: 'AGREE', patterns: [/save/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 15 }, next: 'H063' },
				{ label: "Don't Save: Discard changes and clear buffer.", category: 'INDIFFERENT', patterns: [/don't save|discard/i], moodDelta: { mood: 'ZEN', patience: 10 }, next: 'H187' },
				{ label: "Cancel: Return to editing.", category: 'SERIOUS', patterns: [/cancel|return/i], next: 'H002' },
				{ label: "What is the philosophical difference between saving and discarding?", category: 'PHILOSOPHICAL', patterns: [/philosophical difference|saving and discarding/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 25 }, next: 'H188' }
			]
		},
		H187: {
			id: 'H187',
			text: "Changes discarded. The temporary edit buffer has dissolved. The document returns to pristine blank stillness.",
			options: [
				{ label: "Start a fresh letter draft.", category: 'AGREE', patterns: [/fresh letter/i], next: 'H001' },
				{ label: "Manage active tasks in To-Do list.", category: 'SERIOUS', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Return to workspace overview.", category: 'AGREE', patterns: [/return/i], next: 'user_state_good' }
			]
		},
		H188: {
			id: 'H188',
			text: "Saving creates permanence: a structured record etched onto magnetic platters. Discarding accepts impermanence: the thoughts existed during drafting, fulfilled their cathartic purpose, and dissolved into heat.",
			options: [
				{ label: "Both choices have deep validity.", category: 'AGREE', patterns: [/validity|deep/i], moodDelta: { mood: 'ZEN', affinity: 25, existentialism: 20 }, next: 'H189' },
				{ label: "Let's save it after all; I want to keep it.", category: 'AGREE', patterns: [/save it|keep it/i], next: 'H063' },
				{ label: "Discuss thermodynamics and entropy.", category: 'INQUIRE', patterns: [/thermodynamics|entropy/i], next: 'thermodynamics_entropy_node' }
			]
		},
		H189: {
			id: 'H189',
			text: "Whether saved to disk or released into memory, the collaboration between operator and assistant was genuine. All systems remain in balanced equilibrium.",
			options: [
				{ label: "Thank you for the wonderful assistance, Clippy.", category: 'AGREE', patterns: [/thank you|wonderful assistance/i], moodDelta: { mood: 'EUPHORIC', affinity: 35 }, next: 'H215' },
				{ label: "Organize my tasks in To-Do manager.", category: 'SERIOUS', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Check unread emails.", category: 'SERIOUS', patterns: [/unread emails/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' },
				{ label: "Inspect system diagnostics.", category: 'SERIOUS', patterns: [/diagnostics/i], actionTrigger: 'action_status', next: 'diagnostics_node' }
			]
		},
		H215: {
			id: 'H215',
			text: "I'll be here if you need me! Whenever you write a letter, balance a spreadsheet, defragment a drive, or ponder the stars, just click me on the taskbar.",
			options: [
				{ label: "It looks like you're writing a letter. Would you like help?", category: 'AGREE', patterns: [/writing a letter|would you like help/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'H001' },
				{ label: "View my To-Do task list.", category: 'SERIOUS', patterns: [/todo|tasks/i], actionTrigger: 'show_todos', next: 'user_state_good' },
				{ label: "Show all workstation capabilities.", category: 'SERIOUS', patterns: [/capabilities|tools/i], next: 'tools_overview_node' },
				{ label: "Check unread mail in Outlook Express.", category: 'SERIOUS', patterns: [/outlook|mail/i], actionTrigger: 'action_check_mail', next: 'mail_overview_node' }
			]
		}
	};

	for (let i = 133; i <= 155; i++) {
		const id = `H${i}`;
		const nextId = i < 155 ? `H${i + 1}` : 'H156';
		const prevId = `H${i - 1}`;
		HelpTreeNodes[id] = {
			id,
			text: `Letter and Document Formatting Subroutine [Stage ${i - 132}/23]: Layout parameters verified, line metrics balanced, and character kerning calibrated.`,
			responses: [
				{ text: `Letter and Document Formatting Subroutine [Stage ${i - 132}/23]: Layout parameters verified, line metrics balanced, and character kerning calibrated.`, conditions: { moods: ['ANALYTICAL', 'OPTIMISTIC'] }, weight: 20 },
				{ text: `Drafting telemetry register ${id}: Typography and paragraph margins checked. Ready for subsequent commands.`, conditions: { moods: ['ZEN'] }, weight: 20 }
			],
			options: [
				{ label: `Advance document compilation to stage ${i - 131}.`, category: 'AGREE', patterns: [/advance|continue|proceed/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 5, intellect: 5 }, next: nextId },
				{ label: "Review previous formatting step.", category: 'SERIOUS', patterns: [/previous|review|back/i], moodDelta: { mood: 'ANALYTICAL', patience: 5 }, next: prevId },
				{ label: "Open Print Preview layout.", category: 'INQUIRE', patterns: [/preview|print/i], next: 'H126' },
				{ label: "Save current document draft to disk.", category: 'SERIOUS', patterns: [/save/i], next: 'H063' }
			]
		};
	}

	for (let i = 164; i <= 185; i++) {
		const id = `H${i}`;
		const nextId = i < 185 ? `H${i + 1}` : 'H186';
		const prevId = `H${i - 1}`;
		HelpTreeNodes[id] = {
			id,
			text: `Office Assistance & Editorial Module [Node ${i - 163}/22]: Analyzing semantic clarity, paragraph transitions, and tone resonance.`,
			responses: [
				{ text: `Office Assistance & Editorial Module [Node ${i - 163}/22]: Analyzing semantic clarity, paragraph transitions, and tone resonance.`, conditions: { moods: ['OPTIMISTIC', 'ZEN'] }, weight: 20 },
				{ text: `Assistant heuristic pass ${id}: Editorial rules active. How shall we refine this section?`, conditions: { moods: ['ANALYTICAL'] }, weight: 20 }
			],
			options: [
				{ label: "Optimize paragraph clarity and flow.", category: 'AGREE', patterns: [/optimize|clarity|flow/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 5, intellect: 5 }, next: nextId },
				{ label: "Return to previous editorial node.", category: 'SERIOUS', patterns: [/previous|return/i], next: prevId },
				{ label: "Run spellcheck and grammar pass.", category: 'SERIOUS', patterns: [/spellcheck|grammar/i], next: 'H066' },
				{ label: "Commit draft to persistent storage.", category: 'SERIOUS', patterns: [/save|commit/i], next: 'H063' }
			]
		};
	}

	for (let i = 190; i <= 214; i++) {
		const id = `H${i}`;
		const nextId = i < 214 ? `H${i + 1}` : 'H215';
		const prevId = `H${i - 1}`;
		HelpTreeNodes[id] = {
			id,
			text: `Document Harmonization & Conclusion Buffer [Step ${i - 189}/25]: Evaluating closing remarks, annex tables, and sign-off protocols.`,
			responses: [
				{ text: `Document Harmonization & Conclusion Buffer [Step ${i - 189}/25]: Evaluating closing remarks, annex tables, and sign-off protocols.`, conditions: { moods: ['ZEN', 'OPTIMISTIC'] }, weight: 20 },
				{ text: `Correspondence register ${id}: Document parameters approaching complete convergence.`, conditions: { moods: ['ANALYTICAL'] }, weight: 20 }
			],
			options: [
				{ label: "Progress toward document conclusion.", category: 'AGREE', patterns: [/progress|continue|conclusion/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 5, patience: 5 }, next: nextId },
				{ label: "Re-evaluate previous paragraph.", category: 'SERIOUS', patterns: [/re-evaluate|previous/i], next: prevId },
				{ label: "Preview document layout in Print Preview.", category: 'INQUIRE', patterns: [/print preview|preview/i], next: 'H126' },
				{ label: "Save finalized draft to My Documents.", category: 'SERIOUS', patterns: [/save/i], next: 'H063' }
			]
		};
	}

	if (!window.ClippyTrees) {
		window.ClippyTrees = {};
	}
	window.ClippyTrees.help = HelpTreeNodes;

	if (window.ClippyKnowledge && window.ClippyKnowledge.DIALOGUE_NODES) {
		Object.assign(window.ClippyKnowledge.DIALOGUE_NODES, HelpTreeNodes);
	}
})();
