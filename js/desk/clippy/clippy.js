(function () {
	'use strict';

	const IDLE_MESSAGE_INTERVAL_MS = 55000;
	const IDLE_MESSAGE_CHANCE = 0.7;

	let isThinking = false;
	let idleTimer = null;
	let activeGameContext = null;
	let gameState = {};
	let chatMarathonTimer = null;

	function pickFrom(list) {
		if (!Array.isArray(list) || list.length === 0) return '';
		return list[Math.floor(Math.random() * list.length)];
	}

	function handleUserInput(rawText) {
		if (!rawText || isThinking) return;
		if (window.ClippyUI && window.ClippyUI.isTyping && window.ClippyUI.currentTypeInterval) {
			clearInterval(window.ClippyUI.currentTypeInterval);
			window.ClippyUI.currentTypeInterval = null;
			window.ClippyUI.isTyping = false;
		}

		window.ClippyUI.appendUserMessage(rawText);
		isThinking = true;
		window.ClippyUI.setVisualState('think');

		setTimeout(() => {
			let response = null;
			try {
				response = processDispatch(rawText);
			} catch (e) {
				response = { text: pickFrom(window.ClippyKnowledge ? window.ClippyKnowledge.FALLBACK_RESPONSES : []) };
			} finally {
				isThinking = false;
			}

			if (response && response.text) {
				window.ClippyUI.appendAssistantMessage(response.text, response.actions, () => {
					if (response.actionTrigger) {
						executeActionTrigger(response.actionTrigger);
					}
				});
			}
		}, 140 + Math.random() * 120);
	}

	function executeActionTrigger(actionId) {
		if (actionId === 'timer_25') {
			startPomodoro(25);
		} else if (actionId === 'show_todos') {
			renderTodoList();
		} else if (actionId === 'game_ttt') {
			startTicTacToe();
		} else if (actionId === 'game_memory') {
			startMemory();
		} else if (actionId === 'game_hangman') {
			startHangman();
		} else if (actionId === 'game_quiz') {
			startQuiz();
		} else if (actionId === 'game_guess') {
			startGuess();
		} else if (actionId === 'game_rps') {
			const rps = startRPS();
			window.ClippyUI.appendAssistantMessage(rps.text, rps.actions);
		} else if (actionId === 'action_defrag') {
			startDefrag();
		} else if (actionId === 'action_trivia') {
			window.ClippyUI.appendAssistantMessage(pickFrom(window.ClippyKnowledge.TRIVIA), [
				{ label: "Another Trivia", onClick: () => executeActionTrigger('action_trivia') }
			]);
		} else if (actionId === 'action_joke') {
			window.ClippyUI.appendAssistantMessage(pickFrom(window.ClippyKnowledge.JOKES), [
				{ label: "Another Joke", onClick: () => executeActionTrigger('action_joke') }
			]);
		} else if (actionId === 'action_status') {
			window.ClippyUI.appendAssistantMessage(window.ClippySystemBridge.getSystemSpecs());
		} else if (actionId === 'action_shortcuts') {
			window.ClippyUI.appendAssistantMessage((window.ClippyKnowledge ? window.ClippyKnowledge.SHORTCUTS : []).join('\n'));
		} else if (actionId === 'action_pass') {
			const pwd = window.ClippyActivities.generatePassword(16);
			window.ClippyUI.appendAssistantMessage(`Generated Secure Password (16 chars):\n**\`${pwd}\`**`);
		} else if (actionId === 'action_pass_24') {
			const pwd = window.ClippyActivities.generatePassword(24);
			window.ClippyUI.appendAssistantMessage(`Generated High-Entropy Password (24 chars):\n**\`${pwd}\`**`);
		} else if (actionId === 'action_inspect_windows') {
			renderActiveWindowsList();
		} else if (actionId === 'action_show_desktop') {
			window.ClippySystemBridge.minimizeAllWindows();
			window.ClippyUI.appendAssistantMessage("All open windows have been minimized to the taskbar.");
		} else if (actionId === 'action_cascade_windows') {
			window.ClippySystemBridge.cascadeWindows();
			window.ClippyUI.appendAssistantMessage("Windows arranged in cascade layout.");
		} else if (actionId === 'action_tile_windows') {
			window.ClippySystemBridge.tileWindows(true);
			window.ClippyUI.appendAssistantMessage("Windows tiled horizontally across the workspace.");
		} else if (actionId === 'action_constant_c') {
			window.ClippyUI.appendAssistantMessage("Speed of light in vacuum (c):\n**299,792,458 m/s** (exact standard)");
		} else if (actionId === 'action_constant_h') {
			window.ClippyUI.appendAssistantMessage("Planck constant (h):\n**6.62607015 x 10^-34 J s** (exact standard)");
		} else if (actionId === 'action_profile') {
			renderUserProfileCard();
		} else if (actionId === 'action_achievements') {
			renderAchievementsList();
		} else if (actionId === 'action_theme_panel') {
			renderThemeSelectorCard();
		} else if (actionId === 'action_wallpaper_panel') {
			renderWallpaperSelectorCard();
		} else if (actionId === 'action_music_panel') {
			renderMusicPlayerController();
		} else if (actionId === 'action_files_panel') {
			renderFileListCard('/');
		} else if (actionId === 'action_volume_panel') {
			renderVolumeControllerCard();
		} else if (actionId === 'action_system_tools') {
			renderSystemToolsCard();
		} else if (actionId === 'action_check_mail') {
			renderMailListCard();
		} else if (actionId === 'action_compose_mail') {
			window.ClippySystemBridge.launchApp('outlook');
			window.ClippyUI.appendAssistantMessage("Outlook Express launched for drafting messages.");
		} else if (actionId === 'pet_status') {
			handlePetAction('status');
		} else if (actionId === 'pet_feed') {
			handlePetAction('feed');
		} else if (actionId === 'pet_polish') {
			handlePetAction('pet');
		} else if (actionId === 'action_inspect_bin') {
			const count = window.ClippySystemBridge.getRecycleBinCount();
			window.ClippyUI.appendAssistantMessage(count > 0 ? `The Recycle Bin currently holds ${count} item(s).` : "The Recycle Bin is completely empty.", [
				{ label: "Open Recycle Bin", onClick: () => window.ClippySystemBridge.launchApp('recyclebin') },
				{ label: "Empty Recycle Bin", onClick: () => { window.ClippySystemBridge.emptyRecycleBin(); window.ClippyUI.appendAssistantMessage("Recycle Bin emptied."); } }
			]);
		}
	}

	function processDispatch(rawText) {
		const norm = rawText.toLowerCase().trim();

		if (norm === 'exit' || norm === 'quit' || norm === 'cancel' || norm === 'stop' || norm === 'menu' || norm === 'back' || norm === 'annuler' || norm === 'quitter') {
			activeGameContext = null;
			gameState = {};
			return {
				text: "Active session stopped. Standing by for instructions.",
				actions: [
					{ label: "What can you do?", onClick: () => handleUserInput("What can you do?") },
					{ label: "View To-Do List", onClick: () => handleUserInput("View To-Do List") },
					{ label: "System Diagnostics", onClick: () => handleUserInput("System diagnostics") }
				]
			};
		}

		if (activeGameContext === 'guess' && /^\d+$/.test(norm)) {
			handleGuessInput(parseInt(norm, 10));
			return null;
		}
		if (activeGameContext === 'hangman' && /^[a-zA-Z]$/.test(norm)) {
			handleHangmanInput(norm.toUpperCase());
			return null;
		}

		if (norm === 'what can you do?' || norm === 'what can you do' || norm === 'help' || norm === 'commands' || norm === 'aide' || norm === 'features') {
			return {
				text: "Here is what my system integration can execute:\n- Task & Project Management (`todo`, `projects`)\n- Focus & Scratchpad (`timer 25`, `note [text]`)\n- System Settings (`theme [name]`, `wallpaper`, `volume`, `scanlines`, `crt`)\n- Mail & Diagnostics (`mail`, `diagnostics`, `windows`, `files`)\n- Games & Entertainment (`tictactoe`, `memory`, `hangman`, `quiz`, `guess`, `music`, `joke`)\n- Utilities (`calc [math]`, `convert [unit]`, `pass [length]`)",
				actions: [
					{ label: "View To-Do List", onClick: () => handleUserInput("View To-Do List") },
					{ label: "System Diagnostics", onClick: () => handleUserInput("System diagnostics") },
					{ label: "Play Tic-Tac-Toe", onClick: () => handleUserInput("Play Tic-Tac-Toe") },
					{ label: "Inspect active windows", onClick: () => handleUserInput("Inspect active windows") },
					{ label: "Change Wallpaper", onClick: () => handleUserInput("Change wallpaper") },
					{ label: "Check unread emails", onClick: () => handleUserInput("Check unread emails") }
				]
			};
		}

		if (norm === 'who am i?' || norm === 'who am i' || norm === 'my profile' || norm === 'identity' || norm === 'qui suis-je' || norm === 'mon profil') {
			return { text: "Inspecting workstation user identity...", actionTrigger: 'action_profile' };
		}

		if (norm === 'how are you feeling?' || norm === 'how are you feeling' || norm === 'how are you' || norm === 'how do you feel' || norm === 'comment te sens tu') {
			return { text: "Analyzing assistant state and battery metrics...", actionTrigger: 'pet_status' };
		}

		if (norm === 'check unread emails' || norm === 'unread emails' || norm === 'unread mail' || norm === 'check mail') {
			return { text: "Retrieving messages from Outlook Express store...", actionTrigger: 'action_check_mail' };
		}

		if (norm === 'system diagnostics' || norm === 'specs' || norm === 'diagnostic' || norm === 'status' || norm === 'statut systeme') {
			return { text: window.ClippySystemBridge.getSystemSpecs() };
		}

		if (norm === 'investigate office origin' || norm.includes('office origin') || norm.includes('origine office')) {
			return {
				text: "Clippit was designed in 1994 by Kevan J. Atteberry on a Mac workstation. Introduced in Office 97, he held documents, letters, and resumes together across millions of PCs.",
				actions: [
					{ label: "Random Retro Trivia", onClick: () => handleUserInput("Random Retro Trivia") },
					{ label: "Keyboard Shortcuts", onClick: () => handleUserInput("Keyboard Shortcuts") }
				]
			};
		}

		if (norm === 'quantum recycle bin theory' || norm.includes('quantum recycle bin') || norm.includes('corbeille quantique')) {
			return {
				text: "Landauer's principle indicates that bit erasure has a thermodynamic cost (k_B * T * ln 2). Erased files persist in virtual unallocated clusters until overwritten.",
				actions: [
					{ label: "Open Recycle Bin", onClick: () => window.ClippySystemBridge.launchApp('recyclebin') },
					{ label: "Empty Recycle Bin", onClick: () => { window.ClippySystemBridge.emptyRecycleBin(); window.ClippyUI.appendAssistantMessage("Recycle Bin emptied."); } }
				]
			};
		}

		if (norm === 'talk about programming' || norm === 'programming' || norm === 'coding' || norm === 'programmation') {
			return {
				text: "This workstation executes modular Win32 simulation architecture, VFS layers, dynamic Window management, and synthesized audio.",
				actions: [
					{ label: "Open Command Prompt", onClick: () => window.ClippySystemBridge.launchApp('cmd') },
					{ label: "Open Projects", onClick: () => window.ClippySystemBridge.launchApp('projects') }
				]
			};
		}

		if (norm === 'talk about space and cosmos' || norm === 'space' || norm === 'cosmos' || norm === 'espace' || norm === 'univers') {
			return {
				text: "The observable universe is 93 billion light-years in diameter. Space is rich with cosmological phenomena, dark energy, and relativistic speeds.",
				actions: [
					{ label: "Evaluate speed of light c", onClick: () => handleUserInput("Evaluate speed of light c") },
					{ label: "Evaluate Planck constant h", onClick: () => handleUserInput("Evaluate Planck constant h") }
				]
			};
		}

		if (norm === 'inspect active windows' || norm === 'active windows' || norm === 'list windows' || norm === 'open windows' || norm === 'fenetres actives') {
			return { text: "Inspecting running workspace windows...", actionTrigger: 'action_inspect_windows' };
		}

		if (norm === 'play tic-tac-toe' || norm === 'tic-tac-toe' || norm === 'tictactoe' || norm === 'morpion') {
			return { text: "Preparing Tic-Tac-Toe challenge grid...", actionTrigger: 'game_ttt' };
		}

		if (norm === 'play memory game' || norm === 'memory game' || norm === 'memory' || norm === 'jeu de memory') {
			return { text: "Loading 12-token memory match grid...", actionTrigger: 'game_memory' };
		}

		if (norm === 'play hangman' || norm === 'hangman' || norm === 'jeu du pendu' || norm === 'pendu') {
			return { text: "Loading computing dictionary into Hangman...", actionTrigger: 'game_hangman' };
		}

		if (norm === 'tech trivia quiz' || norm === 'trivia quiz' || norm === 'quiz') {
			return { text: "Initializing diagnostic Tech Quiz...", actionTrigger: 'game_quiz' };
		}

		if (norm === 'guess the number' || norm === 'guess number' || norm === 'devine le nombre') {
			return { text: "Initializing Random Number Generator (1-100)...", actionTrigger: 'game_guess' };
		}

		if (norm === 'rock paper scissors' || norm === 'rps' || norm === 'chifoumi' || norm === 'pierre feuille ciseaux') {
			return startRPS();
		}

		if (norm === 'pet clippy status' || norm === 'tamagotchi' || norm === 'etat clippy') {
			return { text: "Reading Clippy maintenance indicators...", actionTrigger: 'pet_status' };
		}

		if (norm === 'defrag drive c:' || norm === 'defrag' || norm === 'defragment' || norm === 'defragmentation') {
			return { text: "Starting Drive C: cluster optimization...", actionTrigger: 'action_defrag' };
		}

		if (norm === 'start pomodoro timer' || norm.startsWith('timer ') || norm.startsWith('pomodoro')) {
			const match = norm.match(/\d+/);
			const mins = match ? parseInt(match[0], 10) : 25;
			startPomodoro(mins);
			return null;
		}

		if (norm === 'view to-do list' || norm === 'to-do list' || norm === 'todo list' || norm === 'todo' || norm === 'todos' || norm === 'tasks' || norm === 'mes taches') {
			return { text: "Opening task registers...", actionTrigger: 'show_todos' };
		}

		if (norm === 'tell me a joke' || norm.includes('joke') || norm.includes('blague')) {
			return {
				text: pickFrom(window.ClippyKnowledge ? window.ClippyKnowledge.JOKES : []),
				actions: [{ label: "Another Joke", onClick: () => handleUserInput("Tell me a joke") }]
			};
		}

		if (norm === 'random retro trivia' || norm === 'trivia' || norm === 'retro trivia' || norm.includes('trivia') || norm.includes('anecdote')) {
			return {
				text: pickFrom(window.ClippyKnowledge ? window.ClippyKnowledge.TRIVIA : []),
				actions: [{ label: "More Trivia", onClick: () => handleUserInput("Random Retro Trivia") }]
			};
		}

		if (norm === 'keyboard shortcuts' || norm === 'shortcuts' || norm.includes('raccourcis')) {
			return { text: (window.ClippyKnowledge ? window.ClippyKnowledge.SHORTCUTS : []).join('\n') };
		}

		if (norm === 'generate secure password' || norm.startsWith('password') || norm.startsWith('pass') || norm.includes('mot de passe')) {
			const match = norm.match(/\d+/);
			const len = match ? parseInt(match[0], 10) : 16;
			const pwd = window.ClippyActivities.generatePassword(len);
			return { text: `Generated Secure Password (${len} chars):\n**\`${pwd}\`**` };
		}

		if (norm === 'evaluate planck constant h' || norm === 'planck constant' || norm === 'constant h') {
			return { text: "Planck constant (h):\n**6.62607015 x 10^-34 J s** (CODATA exact standard)" };
		}

		if (norm === 'evaluate speed of light c' || norm === 'speed of light' || norm === 'constant c') {
			return { text: "Speed of light in vacuum (c):\n**299,792,458 m/s** (CODATA exact standard)" };
		}

		if (norm === 'achievements' || norm === 'milestones' || norm === 'trophies' || norm === 'succes' || norm === 'trophees') {
			return { text: "Loading achievement log...", actionTrigger: 'action_achievements' };
		}

		if (norm === 'wallpapers' || norm === 'wallpaper' || norm === 'change wallpaper' || norm === 'fond d ecran') {
			return { text: "Loading desktop wallpapers...", actionTrigger: 'action_wallpaper_panel' };
		}

		if (norm === 'music' || norm === 'audio player' || norm === 'music player' || norm === 'musique') {
			return { text: "Accessing media playback engine...", actionTrigger: 'action_music_panel' };
		}

		if (norm === 'files' || norm === 'file manager' || norm === 'fichiers' || norm === 'documents') {
			return { text: "Browsing desktop virtual filesystem...", actionTrigger: 'action_files_panel' };
		}

		if (norm === 'volume' || norm === 'sound' || norm === 'audio' || norm === 'son') {
			return { text: "Accessing audio synthesizer controller...", actionTrigger: 'action_volume_panel' };
		}

		if (norm === 'minimize all' || norm === 'show desktop' || norm === 'hide windows') {
			window.ClippySystemBridge.minimizeAllWindows();
			return { text: "All windows have been minimized to the taskbar." };
		}

		if (norm === 'restore all' || norm === 'restore windows') {
			window.ClippySystemBridge.restoreAllWindows();
			return { text: "All windows restored to workspace." };
		}

		if (norm === 'cascade windows' || norm === 'cascade') {
			window.ClippySystemBridge.cascadeWindows();
			return { text: "Windows have been cascaded across the workspace." };
		}

		if (norm === 'tile windows' || norm === 'tile') {
			window.ClippySystemBridge.tileWindows(true);
			return { text: "Windows have been tiled horizontally." };
		}

		if (norm === 'play music' || norm === 'toggle music' || norm === 'resume music') {
			window.ClippySystemBridge.toggleMusicPlayback();
			const track = window.ClippySystemBridge.getNowPlaying();
			return {
				text: track ? `Playback toggled: "${track.title || 'Audio Track'}"` : "Audio player initiated.",
				actions: [
					{ label: "Next Track", onClick: () => { window.ClippySystemBridge.nextMusicTrack(); } },
					{ label: "Open Media Player", onClick: () => window.ClippySystemBridge.launchApp('mediaplayer') }
				]
			};
		}

		if (norm === 'next music track' || norm === 'next track' || norm === 'next song') {
			window.ClippySystemBridge.nextMusicTrack();
			return { text: "Advanced to next audio track." };
		}

		if (norm === 'previous music track' || norm === 'prev track' || norm === 'prev song') {
			window.ClippySystemBridge.prevMusicTrack();
			return { text: "Returned to previous audio track." };
		}

		if (norm === 'now playing' || norm === 'current song') {
			const track = window.ClippySystemBridge.getNowPlaying();
			return {
				text: track ? `Now Playing: **${track.title || 'Audio Track'}** by **${track.artist || 'Artist'}**` : "No media track is currently active.",
				actions: [{ label: "Open Media Player", onClick: () => window.ClippySystemBridge.launchApp('mediaplayer') }]
			};
		}

		if (norm.startsWith('open ') || norm.startsWith('launch ') || norm.startsWith('start ') || norm.startsWith('lancer ') || norm.startsWith('ouvre ')) {
			const appTarget = norm.replace(/^(open|launch|start|lancer|ouvre)\s+/i, '').trim();
			const appAliases = {
				'calc': 'calculator', 'calculator': 'calculator', 'calculatrice': 'calculator',
				'paint': 'paint', 'mspaint': 'paint', 'dessin': 'paint',
				'notepad': 'notepad', 'text editor': 'notepad', 'bloc-notes': 'notepad',
				'cmd': 'cmd', 'command prompt': 'cmd', 'terminal': 'cmd', 'invite de commandes': 'cmd',
				'ie': 'ie', 'internet explorer': 'ie', 'browser': 'ie', 'navigateur': 'ie',
				'outlook': 'outlook', 'outlook express': 'outlook', 'mail': 'outlook', 'email': 'outlook', 'courrier': 'outlook',
				'winamp': 'winamp',
				'media player': 'mediaplayer', 'windows media player': 'mediaplayer', 'wmp': 'mediaplayer',
				'minesweeper': 'minesweeper', 'demineur': 'minesweeper', 'mine': 'minesweeper',
				'solitaire': 'solitaire', 'sol': 'solitaire', 'cartes': 'solitaire',
				'control panel': 'settings', 'settings': 'settings', 'panneau de configuration': 'settings',
				'display': 'display', 'wallpapers': 'display', 'affichage': 'display',
				'my computer': 'mycomputer', 'computer': 'mycomputer', 'poste de travail': 'mycomputer',
				'recycle bin': 'recyclebin', 'trash': 'recyclebin', 'corbeille': 'recyclebin',
				'achievements': 'achievements', 'trophies': 'achievements', 'milestones': 'achievements', 'succes': 'achievements',
				'projects': 'projects', 'portfolio': 'projects', 'projets': 'projects',
				'sound recorder': 'soundrecorder', 'enregistreur audio': 'soundrecorder',
				'character map': 'charmap', 'charmap': 'charmap', 'table des caracteres': 'charmap',
				'encarta': 'encarta', 'globe': 'encarta', 'world globe': 'encarta',
				'task manager': 'taskmgr', 'taskmgr': 'taskmgr', 'gestionnaire des taches': 'taskmgr'
			};
			const targetId = appAliases[appTarget] || appTarget;
			if (window.DeskAppRegistry && window.DeskAppRegistry.get(targetId)) {
				window.DeskAppRegistry.launch(targetId);
				return { text: `Launched application: **${window.DeskAppRegistry.get(targetId).name}**.` };
			}
		}

		if (norm.startsWith('theme ') || norm.startsWith('set theme ') || norm.startsWith('theme=')) {
			const theme = norm.replace(/^(theme|set theme|theme=)\s*/i, '').trim();
			const validThemes = ['luna-blue', 'royale', 'silver', 'olive', 'classic', 'zune', 'noir', 'matrix', 'high-contrast'];
			if (validThemes.includes(theme)) {
				window.ClippySystemBridge.setTheme(theme);
				return { text: `Theme updated to: **${theme}**.` };
			}
			return {
				text: `Available themes: ${validThemes.join(', ')}.`,
				actions: validThemes.slice(0, 4).map(t => ({ label: t, onClick: () => { window.ClippySystemBridge.setTheme(t); window.ClippyUI.appendAssistantMessage(`Theme set to ${t}.`); } }))
			};
		}

		if (norm === 'scanlines on' || norm === 'enable scanlines') {
			window.ClippySystemBridge.toggleScanlines(true);
			return { text: "Scanlines overlay enabled." };
		}
		if (norm === 'scanlines off' || norm === 'disable scanlines') {
			window.ClippySystemBridge.toggleScanlines(false);
			return { text: "Scanlines overlay disabled." };
		}
		if (norm === 'crt on' || norm === 'enable crt') {
			window.ClippySystemBridge.toggleCrt(true);
			return { text: "CRT glass curvature filter enabled." };
		}
		if (norm === 'crt off' || norm === 'disable crt') {
			window.ClippySystemBridge.toggleCrt(false);
			return { text: "CRT glass curvature filter disabled." };
		}

		if (norm.startsWith('todo add ') || norm.startsWith('task add ')) {
			const text = rawText.replace(/^(todo add|task add)\s+/i, '').trim();
			if (text) {
				const todos = window.ClippyActivities.getStoredTodos();
				todos.push({ id: Date.now(), text, done: false });
				window.ClippyActivities.saveStoredTodos(todos);
				renderTodoList();
				return null;
			}
		}
		if (norm === 'todo clear' || norm === 'clear todos') {
			window.ClippyActivities.saveStoredTodos([]);
			return { text: "All tasks have been cleared from your list." };
		}

		if (norm.startsWith('note ') || norm.startsWith('scratchpad write ')) {
			const memo = rawText.replace(/^(note|scratchpad write)\s+/i, '').trim();
			window.ClippyActivities.saveScratchpadNote(memo);
			return { text: `[SCRATCHPAD COMMITTED] Memo saved to local storage:\n"${memo}"` };
		}
		if (norm === 'note' || norm === 'scratchpad' || norm === 'open scratchpad note') {
			const memo = window.ClippyActivities.getScratchpadNote() || "(Scratchpad buffer is currently empty. Type 'note [text]' to save a memo.)";
			return { text: `[SCRATCHPAD BUFFER]\n${memo}` };
		}

		const conv = window.ClippyActivities.parseUnitConversion(rawText);
		if (conv) {
			return { text: `Unit Conversion Result: **${conv}**` };
		}

		if (norm.startsWith('calc ') || norm.startsWith('calculate ') || norm.startsWith('evaluate ') || /^[\d\s\+\-\*\/\(\)\.\^\%]+$/.test(norm)) {
			const mathRes = window.ClippyActivities.evaluateMathExpression(norm);
			if (mathRes !== null) {
				return { text: `Calculation Result: **${mathRes}**` };
			}
		}

		if (norm.startsWith('find ') || norm.startsWith('search ')) {
			const q = rawText.replace(/^(find|search)\s+/i, '').trim();
			if (q) {
				const hits = window.ClippySystemBridge.searchFiles(q);
				if (hits.length > 0) {
					return {
						text: `Found ${hits.length} matching item(s) in VFS:`,
						actions: hits.slice(0, 4).map(h => ({
							label: h.name,
							onClick: () => { if (window.ShellAssociations) window.ShellAssociations.open(h); }
						}))
					};
				}
				return { text: `No filesystem entries found for query: "${q}".` };
			}
		}

		if (norm.includes('project') || norm.includes('portfolio') || norm.includes('showcase') || norm.includes('projets')) {
			const p = window.ClippySystemBridge.getRandomProject();
			const title = (p && p.title) ? (typeof p.title === 'object' ? (p.title.en || p.title.fr || "Project") : p.title) : "Portfolio";
			return {
				text: `Featured project showcase: "${title}".`,
				actions: [
					{ label: "Open Projects Folder", onClick: () => window.ClippySystemBridge.launchApp('projects') },
					{ label: "View Project", onClick: () => { if (typeof openProjectWindow === 'function') openProjectWindow(p); } }
				]
			};
		}

		if (window.ClippyBrain) {
			const brainReply = window.ClippyBrain.processChat(rawText);
			if (brainReply && brainReply.text) {
				return brainReply;
			}
		}

		return {
			text: pickFrom(window.ClippyKnowledge ? window.ClippyKnowledge.FALLBACK_RESPONSES : []),
			actions: [
				{ label: "What can you do?", onClick: () => handleUserInput("What can you do?") },
				{ label: "View To-Do List", onClick: () => handleUserInput("View To-Do List") },
				{ label: "System Diagnostics", onClick: () => handleUserInput("System diagnostics") },
				{ label: "Play Tic-Tac-Toe", onClick: () => handleUserInput("Play Tic-Tac-Toe") }
			]
		};
	}

	function renderUserProfileCard() {
		if (!window.ClippyUI.logElement) return;
		const prof = window.ClippySystemBridge.getUserProfile();
		const ach = window.ClippySystemBridge.getAchievementsSummary();
		const row = document.createElement('div');
		row.className = 'clippy-message clippy-message-assistant';

		row.innerHTML = `
			<div class="clippy-profile-card">
				<div class="clippy-profile-header">
					<img src="${prof.userAvatar}" class="clippy-profile-avatar ${prof.avatarShape === 'circle' ? 'circle' : (prof.avatarShape === 'round' ? 'round' : '')}" alt="">
					<div class="clippy-profile-info">
						<strong>${prof.userName}</strong>
						<span>${prof.userJobTitle}</span>
						<span style="font-size: 10px; color: #555;">Theme: ${prof.theme}</span>
					</div>
				</div>
				<div class="clippy-profile-stats">
					<div class="clippy-profile-stat-row">
						<span>Milestones Unlocked:</span>
						<strong>${ach.unlockedCount} / ${ach.total} (${ach.percentage}%)</strong>
					</div>
					<div class="clippy-ach-progress-bar"><div class="clippy-ach-progress-fill" style="width: ${ach.percentage}%;"></div></div>
				</div>
			</div>
		`;

		const btnBar = document.createElement('div');
		btnBar.className = 'clippy-actions-bar';
		[
			{ label: "Change User Identity", onClick: () => window.ClippySystemBridge.launchApp('settings', 'system') },
			{ label: "Open Milestones", onClick: () => window.ClippySystemBridge.launchApp('achievements') },
			{ label: "Display Settings", onClick: () => window.ClippySystemBridge.launchApp('display') }
		].forEach(act => {
			const btn = document.createElement('button');
			btn.type = 'button';
			btn.className = 'clippy-action-btn';
			btn.textContent = act.label;
			btn.addEventListener('click', act.onClick);
			btnBar.appendChild(btn);
		});

		row.appendChild(btnBar);
		window.ClippyUI.logElement.appendChild(row);
		window.ClippyUI.scrollLogToBottom();
	}

	function renderAchievementsList() {
		if (!window.ClippyUI.logElement) return;
		const ach = window.ClippySystemBridge.getAchievementsSummary();
		const row = document.createElement('div');
		row.className = 'clippy-message clippy-message-assistant';

		let itemsHtml = '';
		const sampleList = ach.unlocked.slice(0, 4);
		sampleList.forEach(a => {
			itemsHtml += `
				<div class="clippy-ach-item unlocked">
					<img src="${a.icon || '../assets/images/desk/icons/Trophy.webp'}" alt="">
					<div style="flex:1;">
						<strong>${a.title}</strong>
						<div style="font-size:10px; color:#444;">${a.description}</div>
					</div>
				</div>
			`;
		});

		row.innerHTML = `
			<div>[MILESTONES SUMMARY] <b>Unlocked: ${ach.unlockedCount} / ${ach.total} (${ach.percentage}%)</b></div>
			<div class="clippy-ach-progress-bar" style="margin: 6px 0;"><div class="clippy-ach-progress-fill" style="width: ${ach.percentage}%;"></div></div>
			<div class="clippy-ach-list">${itemsHtml || '<div style="font-size:11px; color:#666;">No milestones unlocked yet. Explore the workstation!</div>'}</div>
		`;

		const btnBar = document.createElement('div');
		btnBar.className = 'clippy-actions-bar';
		const openBtn = document.createElement('button');
		openBtn.type = 'button';
		openBtn.className = 'clippy-action-btn';
		openBtn.textContent = "Open Full Milestones Window";
		openBtn.addEventListener('click', () => window.ClippySystemBridge.launchApp('achievements'));
		btnBar.appendChild(openBtn);

		row.appendChild(btnBar);
		window.ClippyUI.logElement.appendChild(row);
		window.ClippyUI.scrollLogToBottom();
	}

	function renderThemeSelectorCard() {
		if (!window.ClippyUI.logElement) return;
		const row = document.createElement('div');
		row.className = 'clippy-message clippy-message-assistant';
		const currentTheme = window.ClippySystemBridge.getSetting('theme') || 'luna-blue';
		const themes = ['luna-blue', 'royale', 'silver', 'olive', 'classic', 'zune', 'noir', 'matrix', 'high-contrast'];

		row.innerHTML = `<div>[THEME SWITCHER] Active Theme: <b>${currentTheme}</b></div>`;
		const grid = document.createElement('div');
		grid.className = 'clippy-actions-bar';
		themes.forEach(t => {
			const b = document.createElement('button');
			b.type = 'button';
			b.className = `clippy-action-btn ${t === currentTheme ? 'active' : ''}`;
			b.textContent = t;
			b.addEventListener('click', () => {
				window.ClippySystemBridge.setTheme(t);
				window.ClippyUI.appendAssistantMessage(`Workstation theme switched to: **${t}**.`);
			});
			grid.appendChild(b);
		});

		row.appendChild(grid);
		window.ClippyUI.logElement.appendChild(row);
		window.ClippyUI.scrollLogToBottom();
	}

	async function renderWallpaperSelectorCard() {
		if (!window.ClippyUI.logElement) return;
		const row = document.createElement('div');
		row.className = 'clippy-message clippy-message-assistant';
		row.innerHTML = `<div>[DESKTOP BACKGROUNDS] Loading wallpaper catalog...</div>`;
		window.ClippyUI.logElement.appendChild(row);
		window.ClippyUI.scrollLogToBottom();

		const wallpapers = await window.ClippySystemBridge.getAvailableWallpapers();
		row.innerHTML = `<div>[DESKTOP BACKGROUNDS] Select a background image:</div>`;

		const grid = document.createElement('div');
		grid.className = 'clippy-actions-bar';
		(wallpapers || []).slice(0, 6).forEach(wp => {
			const b = document.createElement('button');
			b.type = 'button';
			b.className = 'clippy-action-btn';
			b.textContent = wp.name;
			b.addEventListener('click', () => {
				window.ClippySystemBridge.setWallpaper(wp.path);
				window.ClippyUI.appendAssistantMessage(`Desktop wallpaper set to: **${wp.name}**.`);
			});
			grid.appendChild(b);
		});

		const dispBtn = document.createElement('button');
		dispBtn.type = 'button';
		dispBtn.className = 'clippy-action-btn';
		dispBtn.textContent = "Open Display Properties...";
		dispBtn.addEventListener('click', () => window.ClippySystemBridge.launchApp('display'));
		grid.appendChild(dispBtn);

		row.appendChild(grid);
		window.ClippyUI.scrollLogToBottom();
	}

	function renderMusicPlayerController() {
		if (!window.ClippyUI.logElement) return;
		const row = document.createElement('div');
		row.className = 'clippy-message clippy-message-assistant';
		const track = window.ClippySystemBridge.getNowPlaying();
		const tracks = window.ClippySystemBridge.getMusicTracks();

		row.innerHTML = `
			<div class="clippy-music-card">
				<div class="clippy-music-header">
					<img src="../assets/images/desk/icons/Music File.webp" style="width:24px;height:24px;" alt="">
					<div style="flex:1; overflow:hidden;">
						<strong>${track ? track.title : 'Audio Player Standby'}</strong>
						<div style="font-size:10px; color:#555;">${track ? (track.artist || 'Windows XP Audio') : 'No track currently active'}</div>
					</div>
				</div>
			</div>
		`;

		const btnBar = document.createElement('div');
		btnBar.className = 'clippy-actions-bar';

		const playBtn = document.createElement('button');
		playBtn.type = 'button';
		playBtn.className = 'clippy-action-btn';
		playBtn.textContent = "Play / Pause";
		playBtn.addEventListener('click', () => {
			window.ClippySystemBridge.toggleMusicPlayback();
			const now = window.ClippySystemBridge.getNowPlaying();
			window.ClippyUI.appendAssistantMessage(now ? `Playback toggled: "${now.title}"` : "Audio player initiated.");
		});
		btnBar.appendChild(playBtn);

		const nextBtn = document.createElement('button');
		nextBtn.type = 'button';
		nextBtn.className = 'clippy-action-btn';
		nextBtn.textContent = "Next Track";
		nextBtn.addEventListener('click', () => {
			window.ClippySystemBridge.nextMusicTrack();
			window.ClippyUI.appendAssistantMessage("Advanced to next track.");
		});
		btnBar.appendChild(nextBtn);

		if (tracks.length > 0) {
			const rndBtn = document.createElement('button');
			rndBtn.type = 'button';
			rndBtn.className = 'clippy-action-btn';
			rndBtn.textContent = "Play Random Track";
			rndBtn.addEventListener('click', () => {
				const rnd = Math.floor(Math.random() * tracks.length);
				window.ClippySystemBridge.playTrackIndex(rnd);
				window.ClippyUI.appendAssistantMessage(`Playing track: **${tracks[rnd].title || 'Track'}**.`);
			});
			btnBar.appendChild(rndBtn);
		}

		const openWmpBtn = document.createElement('button');
		openWmpBtn.type = 'button';
		openWmpBtn.className = 'clippy-action-btn';
		openWmpBtn.textContent = "Open Media Player";
		openWmpBtn.addEventListener('click', () => window.ClippySystemBridge.launchApp('mediaplayer'));
		btnBar.appendChild(openWmpBtn);

		const openWinampBtn = document.createElement('button');
		openWinampBtn.type = 'button';
		openWinampBtn.className = 'clippy-action-btn';
		openWinampBtn.textContent = "Open Winamp";
		openWinampBtn.addEventListener('click', () => window.ClippySystemBridge.launchApp('winamp'));
		btnBar.appendChild(openWinampBtn);

		row.appendChild(btnBar);
		window.ClippyUI.logElement.appendChild(row);
		window.ClippyUI.scrollLogToBottom();
	}

	function renderActiveWindowsList() {
		if (!window.ClippyUI.logElement) return;
		const row = document.createElement('div');
		row.className = 'clippy-message clippy-message-assistant';

		const windowsMap = (window.WindowManager && window.WindowManager.windows) ? window.WindowManager.windows : {};
		const winList = Object.values(windowsMap).filter(w => !w.classList.contains('xp-modal-overlay'));

		const hdr = document.createElement('div');
		hdr.innerHTML = `[PROCESS INSPECTOR] <b>Active Windows (${winList.length}):</b>`;
		row.appendChild(hdr);

		if (winList.length === 0) {
			const emptyMsg = document.createElement('div');
			emptyMsg.textContent = "No active application windows on the desktop.";
			row.appendChild(emptyMsg);
		} else {
			const listContainer = document.createElement('div');
			listContainer.className = 'clippy-win-list';

			winList.forEach(w => {
				const item = document.createElement('div');
				item.className = 'clippy-win-item';
				const title = w.querySelector('.xp-window-header .title')?.textContent || 'Window';
				const icon = w.querySelector('.xp-window-header img')?.src || '../assets/images/desk/icons/File.webp';
				const isMin = w.classList.contains('minimized');

				item.innerHTML = `
					<img src="${icon}" class="clippy-win-icon" alt="">
					<span class="clippy-win-title">${title} ${isMin ? '(Minimized)' : ''}</span>
				`;

				const focusBtn = document.createElement('button');
				focusBtn.type = 'button';
				focusBtn.className = 'clippy-action-btn';
				focusBtn.textContent = isMin ? 'Restore' : 'Focus';
				focusBtn.addEventListener('click', () => {
					window.ClippySystemBridge.focusWindow(w.id);
				});
				item.appendChild(focusBtn);

				const closeBtn = document.createElement('button');
				closeBtn.type = 'button';
				closeBtn.className = 'clippy-action-btn';
				closeBtn.textContent = 'Close';
				closeBtn.addEventListener('click', () => {
					if (window.WindowManager) window.WindowManager.close(w, w.id);
					renderActiveWindowsList();
				});
				item.appendChild(closeBtn);

				listContainer.appendChild(item);
			});

			row.appendChild(listContainer);
		}

		const btnBar = document.createElement('div');
		btnBar.className = 'clippy-actions-bar';

		const minAllBtn = document.createElement('button');
		minAllBtn.type = 'button';
		minAllBtn.className = 'clippy-action-btn';
		minAllBtn.textContent = 'Minimize All';
		minAllBtn.addEventListener('click', () => {
			window.ClippySystemBridge.minimizeAllWindows();
			window.ClippyUI.appendAssistantMessage("All windows minimized.");
		});
		btnBar.appendChild(minAllBtn);

		const cascadeBtn = document.createElement('button');
		cascadeBtn.type = 'button';
		cascadeBtn.className = 'clippy-action-btn';
		cascadeBtn.textContent = 'Cascade';
		cascadeBtn.addEventListener('click', () => {
			window.ClippySystemBridge.cascadeWindows();
			window.ClippyUI.appendAssistantMessage("Windows cascaded.");
		});
		btnBar.appendChild(cascadeBtn);

		const tileBtn = document.createElement('button');
		tileBtn.type = 'button';
		tileBtn.className = 'clippy-action-btn';
		tileBtn.textContent = 'Tile';
		tileBtn.addEventListener('click', () => {
			window.ClippySystemBridge.tileWindows(true);
			window.ClippyUI.appendAssistantMessage("Windows tiled horizontally.");
		});
		btnBar.appendChild(tileBtn);

		row.appendChild(btnBar);
		window.ClippyUI.logElement.appendChild(row);
		window.ClippyUI.scrollLogToBottom();
	}

	function renderFileListCard(path = '/') {
		if (!window.ClippyUI.logElement) return;
		const row = document.createElement('div');
		row.className = 'clippy-message clippy-message-assistant';

		const files = window.ClippySystemBridge.listFiles(path);
		row.innerHTML = `<div>[FILE SYSTEM] <b>Directory: ${path} (${files.length} items)</b></div>`;

		const listContainer = document.createElement('div');
		listContainer.className = 'clippy-file-list';

		files.slice(0, 8).forEach(f => {
			const item = document.createElement('div');
			item.className = 'clippy-file-item';
			item.innerHTML = `
				<img src="${f.icon || '../assets/images/desk/icons/File.webp'}" class="clippy-file-icon" alt="">
				<span class="clippy-file-name" title="${f.name}">${f.name}</span>
			`;
			const openBtn = document.createElement('button');
			openBtn.type = 'button';
			openBtn.className = 'clippy-action-btn';
			openBtn.textContent = 'Open';
			openBtn.addEventListener('click', () => {
				if (typeof fs !== 'undefined' && fs) {
					const el = fs.findByPath(f.path);
					if (el && typeof openFileSystemElement === 'function') openFileSystemElement(el);
				}
			});
			item.appendChild(openBtn);
			listContainer.appendChild(item);
		});

		row.appendChild(listContainer);

		const btnBar = document.createElement('div');
		btnBar.className = 'clippy-actions-bar';

		const openExplorerBtn = document.createElement('button');
		openExplorerBtn.type = 'button';
		openExplorerBtn.className = 'clippy-action-btn';
		openExplorerBtn.textContent = 'Open in File Explorer';
		openExplorerBtn.addEventListener('click', () => {
			if (window.FileExplorer && typeof fs !== 'undefined') {
				const folder = fs.findByPath(path) || fs.root;
				window.FileExplorer.open(folder);
			}
		});
		btnBar.appendChild(openExplorerBtn);

		const newFileBtn = document.createElement('button');
		newFileBtn.type = 'button';
		newFileBtn.className = 'clippy-action-btn';
		newFileBtn.textContent = 'Create Text Note';
		newFileBtn.addEventListener('click', () => {
			const newF = window.ClippySystemBridge.createDesktopFile(`Note_${Date.now().toString().slice(-4)}.txt`, 'Created with Clippy');
			if (newF) window.ClippyUI.appendAssistantMessage(`Created new file on Desktop: **${newF.name}**.`);
		});
		btnBar.appendChild(newFileBtn);

		row.appendChild(btnBar);
		window.ClippyUI.logElement.appendChild(row);
		window.ClippyUI.scrollLogToBottom();
	}

	function renderMailListCard() {
		if (!window.ClippyUI.logElement) return;
		const row = document.createElement('div');
		row.className = 'clippy-message clippy-message-assistant';

		const unreadCount = window.ClippySystemBridge.getUnreadMailCount();
		const msgs = window.ClippySystemBridge.getMailMessages('inbox');

		row.innerHTML = `
			<div>[OUTLOOK EXPRESS] <b>Inbox (${unreadCount} unread / ${msgs.length} total):</b></div>
		`;

		const listContainer = document.createElement('div');
		listContainer.className = 'clippy-mail-list';

		msgs.slice(0, 4).forEach(m => {
			const item = document.createElement('div');
			item.className = `clippy-mail-item ${m.read ? 'read' : 'unread'}`;
			item.innerHTML = `
				<div class="clippy-mail-header">
					<strong>${m.from}</strong>
					<span class="clippy-mail-date">${new Date(m.date).toLocaleDateString()}</span>
				</div>
				<div class="clippy-mail-subj">${m.subject}</div>
			`;
			item.addEventListener('click', () => {
				window.ClippySystemBridge.markMailRead(m.id, true);
				window.ClippySystemBridge.launchApp('outlook');
			});
			listContainer.appendChild(item);
		});

		row.appendChild(listContainer);

		const btnBar = document.createElement('div');
		btnBar.className = 'clippy-actions-bar';

		const openOeBtn = document.createElement('button');
		openOeBtn.type = 'button';
		openOeBtn.className = 'clippy-action-btn';
		openOeBtn.textContent = 'Open Outlook Express';
		openOeBtn.addEventListener('click', () => window.ClippySystemBridge.launchApp('outlook'));
		btnBar.appendChild(openOeBtn);

		const syncBtn = document.createElement('button');
		syncBtn.type = 'button';
		syncBtn.className = 'clippy-action-btn';
		syncBtn.textContent = 'Send / Receive';
		syncBtn.addEventListener('click', () => {
			if (window.MailStore) {
				window.MailStore.ensureDailyContent().then(() => {
					renderMailListCard();
					window.ClippyUI.appendAssistantMessage("Mail synchronization complete.");
				});
			}
		});
		btnBar.appendChild(syncBtn);

		row.appendChild(btnBar);
		window.ClippyUI.logElement.appendChild(row);
		window.ClippyUI.scrollLogToBottom();
	}

	function renderVolumeControllerCard() {
		if (!window.ClippyUI.logElement) return;
		const row = document.createElement('div');
		row.className = 'clippy-message clippy-message-assistant';

		const currentVol = window.ClippySystemBridge.getVolume();
		const isMuted = window.ClippySystemBridge.isMuted();

		row.innerHTML = `
			<div>[AUDIO SYNTHESIZER] Master Volume: <b>${Math.round(currentVol * 100)}%</b> ${isMuted ? '(Muted)' : ''}</div>
		`;

		const sliderRow = document.createElement('div');
		sliderRow.className = 'clippy-slider-control';

		const slider = document.createElement('input');
		slider.type = 'range';
		slider.min = '0';
		slider.max = '1';
		slider.step = '0.05';
		slider.value = String(currentVol);
		slider.className = 'xp-slider';
		slider.style.flex = '1';

		slider.addEventListener('input', () => {
			const setVol = window.ClippySystemBridge.setVolume(slider.value);
			if (window.SettingsApp && window.SettingsApp.playSound) window.SettingsApp.playSound('click');
		});

		sliderRow.appendChild(slider);
		row.appendChild(sliderRow);

		const btnBar = document.createElement('div');
		btnBar.className = 'clippy-actions-bar';

		const muteBtn = document.createElement('button');
		muteBtn.type = 'button';
		muteBtn.className = 'clippy-action-btn';
		muteBtn.textContent = isMuted ? 'Unmute Audio' : 'Mute Audio';
		muteBtn.addEventListener('click', () => {
			const muted = window.ClippySystemBridge.toggleMute();
			renderVolumeControllerCard();
		});
		btnBar.appendChild(muteBtn);

		const testSndBtn = document.createElement('button');
		testSndBtn.type = 'button';
		testSndBtn.className = 'clippy-action-btn';
		testSndBtn.textContent = 'Test Chime';
		testSndBtn.addEventListener('click', () => {
			if (window.SettingsApp && window.SettingsApp.playSound) window.SettingsApp.playSound('startup');
		});
		btnBar.appendChild(testSndBtn);

		row.appendChild(btnBar);
		window.ClippyUI.logElement.appendChild(row);
		window.ClippyUI.scrollLogToBottom();
	}

	function renderSystemToolsCard() {
		if (!window.ClippyUI.logElement) return;
		const row = document.createElement('div');
		row.className = 'clippy-message clippy-message-assistant';

		row.innerHTML = `<div>[SYSTEM TOOLS] Quick launch diagnostic and administrative utilities:</div>`;

		const btnBar = document.createElement('div');
		btnBar.className = 'clippy-actions-bar';

		[
			{ label: 'Control Panel', appId: 'settings' },
			{ label: 'Task Manager', appId: 'taskmgr' },
			{ label: 'Command Prompt', appId: 'cmd' },
			{ label: 'Display Properties', appId: 'display' },
			{ label: 'My Computer', appId: 'mycomputer' },
			{ label: 'Defrag Volume C:', action: () => startDefrag() }
		].forEach(item => {
			const b = document.createElement('button');
			b.type = 'button';
			b.className = 'clippy-action-btn';
			b.textContent = item.label;
			b.addEventListener('click', () => {
				if (item.appId) window.ClippySystemBridge.launchApp(item.appId);
				else if (item.action) item.action();
			});
			btnBar.appendChild(b);
		});

		row.appendChild(btnBar);
		window.ClippyUI.logElement.appendChild(row);
		window.ClippyUI.scrollLogToBottom();
	}

	function startTicTacToe() {
		activeGameContext = 'ttt';
		gameState = {
			board: Array(9).fill(null),
			winner: null
		};
		renderTicTacToeView("Select a cell to play (X):");
	}

	function checkTTTWinner(b) {
		const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
		for (const [x,y,z] of lines) {
			if (b[x] && b[x] === b[y] && b[x] === b[z]) return b[x];
		}
		if (b.every(c => c !== null)) return 'TIE';
		return null;
	}

	function renderTicTacToeView(statusText) {
		if (!window.ClippyUI.logElement) return;
		const row = document.createElement('div');
		row.className = 'clippy-message clippy-message-assistant';

		const lbl = document.createElement('div');
		lbl.textContent = `[Tic-Tac-Toe] ${statusText}`;
		row.appendChild(lbl);

		const grid = document.createElement('div');
		grid.className = 'clippy-ttt-grid';

		for (let i = 0; i < 9; i++) {
			const btn = document.createElement('button');
			btn.type = 'button';
			btn.className = 'clippy-ttt-cell';
			btn.textContent = gameState.board[i] || '';
			btn.disabled = !!gameState.board[i] || !!gameState.winner;

			btn.addEventListener('click', () => {
				if (gameState.board[i] || gameState.winner) return;
				gameState.board[i] = 'X';
				let winner = checkTTTWinner(gameState.board);
				if (winner) {
					finishTTT(winner);
					return;
				}

				const free = gameState.board.map((v, idx) => v === null ? idx : null).filter(v => v !== null);
				if (free.length > 0) {
					let move = free.find(idx => {
						const test = [...gameState.board];
						test[idx] = 'O';
						return checkTTTWinner(test) === 'O';
					});
					if (move === undefined) {
						move = free.find(idx => {
							const test = [...gameState.board];
							test[idx] = 'X';
							return checkTTTWinner(test) === 'X';
						});
					}
					if (move === undefined) move = pickFrom(free);
					gameState.board[move] = 'O';
				}

				winner = checkTTTWinner(gameState.board);
				if (winner) finishTTT(winner);
				else renderTicTacToeView("Your turn (X):");
			});
			grid.appendChild(btn);
		}

		row.appendChild(grid);
		window.ClippyUI.logElement.appendChild(row);
		window.ClippyUI.scrollLogToBottom();
	}

	function finishTTT(winner) {
		gameState.winner = winner;
		activeGameContext = null;
		if (winner === 'X') {
			if (window.ClippyAudio) window.ClippyAudio.play('win');
			window.ClippySystemBridge.unlockAchievement('clippy_tictactoe_win', 1);
			window.ClippyUI.appendAssistantMessage("[VICTORY] You defeated the decision heuristic!", [
				{ label: "Play Again", onClick: () => startTicTacToe() }
			]);
		} else if (winner === 'O') {
			if (window.ClippyAudio) window.ClippyAudio.play('lose');
			window.ClippyUI.appendAssistantMessage("[DEFEAT] Clippit wins this round!", [
				{ label: "Rematch", onClick: () => startTicTacToe() }
			]);
		} else {
			window.ClippyUI.appendAssistantMessage("[DRAW] Stalemate reached.", [
				{ label: "Play Again", onClick: () => startTicTacToe() }
			]);
		}
	}

	function startMemory() {
		activeGameContext = 'memory';
		const tokens = ['SYS', 'DLL', 'EXE', 'INI', 'BAT', 'COM'];
		const deck = [...tokens, ...tokens].sort(() => Math.random() - 0.5);

		gameState = {
			deck,
			revealed: Array(12).fill(false),
			matched: Array(12).fill(false),
			flipped: [],
			lock: false
		};
		renderMemoryView("Match the 6 paired system tokens:");
	}

	function renderMemoryView(statusText) {
		if (!window.ClippyUI.logElement) return;
		const row = document.createElement('div');
		row.className = 'clippy-message clippy-message-assistant';

		const lbl = document.createElement('div');
		lbl.textContent = `[Memory Match] ${statusText}`;
		row.appendChild(lbl);

		const grid = document.createElement('div');
		grid.className = 'clippy-memory-grid';

		gameState.deck.forEach((card, idx) => {
			const cardBtn = document.createElement('button');
			cardBtn.type = 'button';
			cardBtn.className = 'clippy-memory-card';

			if (gameState.matched[idx]) {
				cardBtn.classList.add('matched');
				cardBtn.textContent = card;
			} else if (gameState.revealed[idx]) {
				cardBtn.classList.add('revealed');
				cardBtn.textContent = card;
			} else {
				cardBtn.textContent = '?';
			}

			cardBtn.addEventListener('click', () => {
				if (gameState.lock || gameState.revealed[idx] || gameState.matched[idx]) return;
				gameState.revealed[idx] = true;
				gameState.flipped.push(idx);

				if (gameState.flipped.length === 2) {
					const [f, s] = gameState.flipped;
					if (gameState.deck[f] === gameState.deck[s]) {
						gameState.matched[f] = true;
						gameState.matched[s] = true;
						gameState.flipped = [];
						if (window.ClippyAudio) window.ClippyAudio.play('win');

						if (gameState.matched.every(m => m)) {
							activeGameContext = null;
							if (window.ClippyAudio) window.ClippyAudio.play('tada');
							window.ClippyUI.appendAssistantMessage("[SUCCESS] All token pairs matched!", [
								{ label: "Play Again", onClick: () => startMemory() }
							]);
							return;
						}
						renderMemoryView("Pair matched! Select next token:");
					} else {
						gameState.lock = true;
						setTimeout(() => {
							gameState.revealed[f] = false;
							gameState.revealed[s] = false;
							gameState.flipped = [];
							gameState.lock = false;
							renderMemoryView("Tokens hidden. Select first card:");
						}, 800);
					}
				} else {
					renderMemoryView("Select second card:");
				}
			});
			grid.appendChild(cardBtn);
		});

		row.appendChild(grid);
		window.ClippyUI.logElement.appendChild(row);
		window.ClippyUI.scrollLogToBottom();
	}

	function startHangman() {
		activeGameContext = 'hangman';
		const words = (window.ClippyKnowledge && window.ClippyKnowledge.HANGMAN_WORDS) || ["WINDOWS"];
		gameState = {
			word: pickFrom(words),
			guessed: new Set(),
			errors: 0,
			maxErrors: 6
		};
		renderHangmanStatus();
	}

	function renderHangmanStatus() {
		const masked = gameState.word.split('').map(c => gameState.guessed.has(c) ? c : '_').join(' ');
		const tries = gameState.maxErrors - gameState.errors;
		window.ClippyUI.appendAssistantMessage(`[Hangman]\nWord: ${masked}\nTries left: ${tries}/${gameState.maxErrors}\nEnter a single letter:`);
	}

	function handleHangmanInput(letter) {
		if (gameState.guessed.has(letter)) {
			window.ClippyUI.appendAssistantMessage(`Letter '${letter}' already tested.`);
			return;
		}
		gameState.guessed.add(letter);
		if (gameState.word.includes(letter)) {
			if (gameState.word.split('').every(c => gameState.guessed.has(c))) {
				activeGameContext = null;
				if (window.ClippyAudio) window.ClippyAudio.play('tada');
				window.ClippyUI.appendAssistantMessage(`[VICTORY] Target word confirmed: **${gameState.word}**!`, [
					{ label: "Play Again", onClick: () => startHangman() }
				]);
			} else {
				renderHangmanStatus();
			}
		} else {
			gameState.errors++;
			if (gameState.errors >= gameState.maxErrors) {
				activeGameContext = null;
				if (window.ClippyAudio) window.ClippyAudio.play('lose');
				window.ClippyUI.appendAssistantMessage(`[DEFEAT] The word was **${gameState.word}**.`, [
					{ label: "Try Again", onClick: () => startHangman() }
				]);
			} else {
				renderHangmanStatus();
			}
		}
	}

	function startQuiz() {
		activeGameContext = 'quiz';
		const pool = (window.ClippyKnowledge && window.ClippyKnowledge.QUIZ_QUESTIONS) || [];
		gameState = {
			index: 0,
			score: 0,
			questions: [...pool].sort(() => Math.random() - 0.5)
		};
		askNextQuiz();
	}

	function askNextQuiz() {
		const qData = gameState.questions[gameState.index];
		const actions = qData.options.map((opt, idx) => ({
			label: opt,
			onClick: () => {
				if (idx === qData.answer) {
					gameState.score++;
					if (window.ClippyAudio) window.ClippyAudio.play('win');
					window.ClippyUI.appendAssistantMessage(`[CORRECT] ${qData.fact}`);
				} else {
					if (window.ClippyAudio) window.ClippyAudio.play('lose');
					window.ClippyUI.appendAssistantMessage(`[INCORRECT] The correct answer was: "${qData.options[qData.answer]}".\n${qData.fact}`);
				}

				gameState.index++;
				if (gameState.index < gameState.questions.length) {
					setTimeout(askNextQuiz, 1000);
				} else {
					activeGameContext = null;
					if (window.ClippyAudio) window.ClippyAudio.play('tada');
					window.ClippyUI.appendAssistantMessage(`[QUIZ COMPLETE] Final score: **${gameState.score} / ${gameState.questions.length}** points!`, [
						{ label: "Try Again", onClick: () => startQuiz() }
					]);
				}
			}
		}));

		window.ClippyUI.appendAssistantMessage(`Question ${gameState.index + 1}/${gameState.questions.length}:\n**${qData.q}**`, actions);
	}

	function startGuess() {
		activeGameContext = 'guess';
		gameState = {
			target: Math.floor(Math.random() * 100) + 1,
			attempts: 0
		};
		window.ClippyUI.appendAssistantMessage("[Random Value Generator] I have chosen an integer between 1 and 100. Enter your numerical guess:");
	}

	function handleGuessInput(num) {
		if (isNaN(num) || num < 1 || num > 100) {
			window.ClippyUI.appendAssistantMessage("Please enter an integer between 1 and 100.");
			return;
		}
		gameState.attempts++;
		if (num === gameState.target) {
			activeGameContext = null;
			if (window.ClippyAudio) window.ClippyAudio.play('tada');
			window.ClippyUI.appendAssistantMessage(`[TARGET ACQUIRED] Exact match **${gameState.target}** identified in ${gameState.attempts} attempt(s)!`, [
				{ label: "Play Again", onClick: () => startGuess() }
			]);
		} else if (num < gameState.target) {
			window.ClippyUI.appendAssistantMessage(`Target is GREATER than ${num}. (Attempt count: ${gameState.attempts})`);
		} else {
			window.ClippyUI.appendAssistantMessage(`Target is LESS than ${num}. (Attempt count: ${gameState.attempts})`);
		}
	}

	function startRPS() {
		return {
			text: "[Rock-Paper-Scissors Challenge] Select your move:",
			actions: [
				{ label: "Rock", onClick: () => playRPSMove('rock') },
				{ label: "Paper", onClick: () => playRPSMove('paper') },
				{ label: "Scissors", onClick: () => playRPSMove('scissors') }
			]
		};
	}

	function playRPSMove(userMove) {
		const moves = ['rock', 'paper', 'scissors'];
		const clippyMove = pickFrom(moves);
		let res = "";

		if (userMove === clippyMove) {
			res = `We both chose ${userMove}. It is a draw!`;
		} else if (
			(userMove === 'rock' && clippyMove === 'scissors') ||
			(userMove === 'paper' && clippyMove === 'rock') ||
			(userMove === 'scissors' && clippyMove === 'paper')
		) {
			if (window.ClippyAudio) window.ClippyAudio.play('win');
			res = `You chose ${userMove} and I chose ${clippyMove}. You win!`;
		} else {
			if (window.ClippyAudio) window.ClippyAudio.play('lose');
			res = `You chose ${userMove} and I chose ${clippyMove}. I win this round!`;
		}

		window.ClippyUI.appendAssistantMessage(res, [
			{ label: "Play Again", onClick: () => startRPS() }
		]);
	}

	function handlePetAction(act) {
		const pet = window.ClippyActivities.getPetState();
		if (act === 'feed') {
			pet.hunger = Math.max(0, pet.hunger - 40);
			pet.happiness = Math.min(100, pet.happiness + 15);
			pet.xp += 15;
			window.ClippyActivities.savePetState(pet);
			if (window.ClippyAudio) window.ClippyAudio.play('win');
			window.ClippyUI.appendAssistantMessage("[MAINTENANCE] Consumed polished paperclip reserves. (+15 XP)", [
				{ label: "View Status", onClick: () => handlePetAction('status') }
			]);
		} else if (act === 'pet') {
			pet.happiness = Math.min(100, pet.happiness + 25);
			pet.xp += 10;
			window.ClippyActivities.savePetState(pet);
			if (window.ClippyAudio) window.ClippyAudio.play('action');
			window.ClippyUI.appendAssistantMessage("[AFFIRMATION] Metal wire polished. Morale optimized. (+10 XP)", [
				{ label: "View Status", onClick: () => handlePetAction('status') }
			]);
		} else if (act === 'sleep') {
			pet.energy = 100;
			pet.hunger = Math.min(100, pet.hunger + 10);
			pet.xp += 10;
			window.ClippyActivities.savePetState(pet);
			if (window.ClippyAudio) window.ClippyAudio.play('action');
			window.ClippyUI.appendAssistantMessage("[STANDBY] Entered low-power mode. Energy replenished to 100%.", [
				{ label: "View Status", onClick: () => handlePetAction('status') }
			]);
		} else {
			if (!window.ClippyUI.logElement) return;
			const row = document.createElement('div');
			row.className = 'clippy-message clippy-message-assistant';

			const hdr = document.createElement('div');
			hdr.innerHTML = `[ASSISTANT METRICS] <b>Clippit Status</b> — Level ${pet.level} (XP: ${pet.xp} / ${pet.level * 50})`;
			row.appendChild(hdr);

			const meter = document.createElement('div');
			meter.className = 'clippy-pet-meter';
			meter.innerHTML = `
				<div class="clippy-pet-row"><span>Morale:</span><span>${pet.happiness}%</span></div>
				<div class="clippy-pet-bar"><div class="clippy-pet-bar-fill happiness" style="width:${pet.happiness}%"></div></div>
				<div class="clippy-pet-row"><span>Energy Reserve:</span><span>${pet.energy}%</span></div>
				<div class="clippy-pet-bar"><div class="clippy-pet-bar-fill energy" style="width:${pet.energy}%"></div></div>
				<div class="clippy-pet-row"><span>Depletion / Hunger:</span><span>${pet.hunger}%</span></div>
				<div class="clippy-pet-bar"><div class="clippy-pet-bar-fill hunger" style="width:${pet.hunger}%"></div></div>
			`;
			row.appendChild(meter);

			const btnBar = document.createElement('div');
			btnBar.className = 'clippy-actions-bar';
			[
				{ label: "Supply Paperclips", act: 'feed' },
				{ label: "Polish Wire", act: 'pet' },
				{ label: "Standby Mode", act: 'sleep' }
			].forEach(a => {
				const b = document.createElement('button');
				b.type = 'button';
				b.className = 'clippy-action-btn';
				b.textContent = a.label;
				b.addEventListener('click', () => handlePetAction(a.act));
				btnBar.appendChild(b);
			});

			row.appendChild(btnBar);
			window.ClippyUI.logElement.appendChild(row);
			window.ClippyUI.scrollLogToBottom();
		}
	}

	function startDefrag() {
		if (!window.ClippyUI.logElement) return;
		const row = document.createElement('div');
		row.className = 'clippy-message clippy-message-assistant';

		const label = document.createElement('div');
		label.textContent = "Disk Defragmenter (Volume C: Optimizing clusters...)";
		row.appendChild(label);

		const map = document.createElement('div');
		map.className = 'clippy-defrag-map';
		const blocks = [];
		for (let i = 0; i < 40; i++) {
			const b = document.createElement('div');
			b.className = 'clippy-defrag-block' + (Math.random() > 0.45 ? ' frag' : (Math.random() > 0.3 ? '' : ' free'));
			map.appendChild(b);
			blocks.push(b);
		}
		row.appendChild(map);

		const bar = document.createElement('div');
		bar.className = 'clippy-progress-box';
		const fill = document.createElement('div');
		fill.className = 'clippy-progress-fill';
		bar.appendChild(fill);
		row.appendChild(bar);

		window.ClippyUI.logElement.appendChild(row);
		window.ClippyUI.scrollLogToBottom();

		let progress = 0;
		let blockIndex = 0;

		const interval = setInterval(() => {
			progress += 5;
			if (blockIndex < blocks.length) {
				blocks[blockIndex].className = 'clippy-defrag-block';
				if (blockIndex + 1 < blocks.length) {
					blocks[blockIndex + 1].className = 'clippy-defrag-block active';
				}
				blockIndex++;
			}

			if (window.ClippyAudio) window.ClippyAudio.play('crunch');
			fill.style.width = `${Math.min(100, progress)}%`;

			if (progress >= 100) {
				clearInterval(interval);
				blocks.forEach(b => b.className = 'clippy-defrag-block');
				if (window.ClippyAudio) window.ClippyAudio.play('tada');
				label.textContent = "[STATUS: COMPLETE] Defragmentation finished. 100% contiguous cluster allocation on Volume C:.";
			}
		}, 130);
	}

	function renderTodoList() {
		const todos = window.ClippyActivities.getStoredTodos();
		if (todos.length === 0) {
			window.ClippyUI.appendAssistantMessage("[TASK MANAGER] Task register is empty. You can register an entry by typing 'todo add [Task description]'.", [
				{ label: "Add Sample Task", onClick: () => handleUserInput("todo add Test Windows XP features") }
			]);
			return;
		}

		if (!window.ClippyUI.logElement) return;
		const row = document.createElement('div');
		row.className = 'clippy-message clippy-message-assistant';

		const label = document.createElement('div');
		label.innerHTML = `[TASK MANAGER] <b>Desktop Task List (${todos.filter(t => !t.done).length} pending):</b>`;
		row.appendChild(label);

		const container = document.createElement('div');
		container.className = 'clippy-todo-container';

		todos.forEach((t) => {
			const item = document.createElement('div');
			item.className = `clippy-todo-item ${t.done ? 'done' : ''}`;

			const check = document.createElement('input');
			check.type = 'checkbox';
			check.className = 'clippy-todo-check';
			check.checked = t.done;
			check.addEventListener('change', () => {
				t.done = check.checked;
				window.ClippyActivities.saveStoredTodos(todos);
				item.className = `clippy-todo-item ${t.done ? 'done' : ''}`;
				if (window.ClippyAudio) window.ClippyAudio.play(t.done ? 'win' : 'action');
			});

			const span = document.createElement('span');
			span.style.flexGrow = '1';
			span.textContent = t.text;

			const del = document.createElement('button');
			del.type = 'button';
			del.className = 'clippy-todo-del';
			del.innerHTML = '&times;';
			del.title = 'Delete Task';
			del.addEventListener('click', () => {
				const updated = window.ClippyActivities.getStoredTodos().filter(x => x.id !== t.id);
				window.ClippyActivities.saveStoredTodos(updated);
				renderTodoList();
			});

			item.appendChild(check);
			item.appendChild(span);
			item.appendChild(del);
			container.appendChild(item);
		});

		row.appendChild(container);

		const btnBar = document.createElement('div');
		btnBar.className = 'clippy-actions-bar';

		const clearBtn = document.createElement('button');
		clearBtn.type = 'button';
		clearBtn.className = 'clippy-action-btn';
		clearBtn.textContent = 'Clear All';
		clearBtn.addEventListener('click', () => handleUserInput('todo clear'));
		btnBar.appendChild(clearBtn);

		const addBtn = document.createElement('button');
		addBtn.type = 'button';
		addBtn.className = 'clippy-action-btn';
		addBtn.textContent = '+ Add Task';
		addBtn.addEventListener('click', () => {
			if (window.ClippyUI.inputElement) {
				window.ClippyUI.inputElement.value = "todo add ";
				window.ClippyUI.inputElement.focus();
			}
		});
		btnBar.appendChild(addBtn);

		row.appendChild(btnBar);
		window.ClippyUI.logElement.appendChild(row);
		window.ClippyUI.scrollLogToBottom();
	}

	function startPomodoro(minutes = 25) {
		if (window.ClippyActivities.activePomodoroTimer) {
			clearInterval(window.ClippyActivities.activePomodoroTimer);
			window.ClippyActivities.activePomodoroTimer = null;
		}

		let secondsLeft = minutes * 60;
		window.ClippyUI.appendAssistantMessage(`[TIMER INITIALIZED] Focus countdown initiated for ${minutes} minute(s).`);

		window.ClippyActivities.activePomodoroTimer = setInterval(() => {
			secondsLeft -= 10;
			if (secondsLeft <= 0) {
				clearInterval(window.ClippyActivities.activePomodoroTimer);
				window.ClippyActivities.activePomodoroTimer = null;
				if (window.ClippyAudio) window.ClippyAudio.play('tada');
				window.ClippyUI.showIdleBubble("[TIMER ELAPSED] Focus period complete. Recommended break: 5 minutes.");
				window.ClippyUI.appendAssistantMessage("[TIMER EXPIRED] Work interval complete. Please take a 5-minute rest cycle.");
			}
		}, 10000);
	}

	function generateIdleMessage() {
		const unread = window.ClippySystemBridge.getUnreadMailCount();
		const currentMood = window.ClippyBrain ? window.ClippyBrain.getMood() : 'OPTIMISTIC';
		const candidates = [];

		if (unread > 0) candidates.push(`You have ${unread} unread email(s) waiting in Outlook!`);
		const recycleCount = window.ClippySystemBridge.getRecycleBinCount();
		if (recycleCount > 0) candidates.push(`Recycle Bin contains ${recycleCount} deleted item(s).`);
		const openWins = window.ClippySystemBridge.getOpenWindowCount();
		if (openWins > 2) candidates.push(`You have ${openWins} open windows active on desktop.`);
		const moon = window.ClippySystemBridge.getMoonPhaseLabel();
		if (moon) candidates.push(`The moon phase tonight is ${moon}.`);

		candidates.push("Need a hand with your tasks or want to discuss a new idea? Click me anytime!");
		candidates.push("Want to play Memory Match, Hangman, or Tic-Tac-Toe?");

		return pickFrom(candidates);
	}

	function startIdleDaemon() {
		if (idleTimer) clearInterval(idleTimer);
		idleTimer = setInterval(() => {
			if (window.ClippyUI.isOpen) return;
			if (Math.random() > IDLE_MESSAGE_CHANCE) return;
			window.ClippyUI.showIdleBubble(generateIdleMessage());
		}, IDLE_MESSAGE_INTERVAL_MS);
	}

	function openAssistant() {
		const isFirstBuild = !window.ClippyUI.popupElement;
		window.ClippyUI.buildPopup(
			(text) => handleUserInput(text),
			(action) => executeActionTrigger(action)
		);
		window.ClippyUI.open();

		if (!chatMarathonTimer) {
			chatMarathonTimer = setInterval(() => {
				if (window.ClippyUI.isOpen && window.AchievementsManager) {
					window.AchievementsManager.progress('clippy_chat_marathon', 1);
				}
			}, 1000);
		}

		if (isFirstBuild && window.ClippyUI.logElement && window.ClippyUI.logElement.children.length === 0) {
			renderInitialGreeting();
		}
	}

	function closeAssistant() {
		window.ClippyUI.close();
		if (chatMarathonTimer) {
			clearInterval(chatMarathonTimer);
			chatMarathonTimer = null;
		}
	}

	function renderInitialGreeting() {
		if (window.ClippyBrain && typeof window.ClippyBrain.navigateGraphNode === 'function') {
			const entry = window.ClippyBrain.navigateGraphNode('greeting_root');
			const actions = window.ClippyBrain.buildGraphActions(entry.options);
			window.ClippyUI.appendAssistantMessage(entry.text, actions);
		}
	}

	function init() {
		startIdleDaemon();
	}

	window.ClippyAgent = {
		init,
		open: openAssistant,
		close: closeAssistant,
		toggle: () => {
			if (window.ClippyUI.isOpen) closeAssistant();
			else openAssistant();
		},
		say: (message, actions = null) => {
			openAssistant();
			window.ClippyUI.appendAssistantMessage(message, actions);
		},
		prompt: (command) => {
			openAssistant();
			handleUserInput(command);
		},
		queuePrompt: (command) => {
			openAssistant();
			handleUserInput(command);
		},
		executeAction: (actionId) => {
			openAssistant();
			executeActionTrigger(actionId);
		},
		notify: (text) => window.ClippyUI.showIdleBubble(text),
		selectGraphOption: (opt) => {
			if (!opt || isThinking || (window.ClippyUI && window.ClippyUI.isTyping)) return;
			const userLabel = opt.label || "Continue...";
			window.ClippyUI.appendUserMessage(userLabel);
			isThinking = true;
			window.ClippyUI.setVisualState('think');

			setTimeout(() => {
				let result = null;
				try {
					result = window.ClippyBrain.navigateGraphOption(opt);
				} catch (e) {
					result = null;
				}
				isThinking = false;

				if (result && result.text) {
					const actions = window.ClippyBrain.buildGraphActions(result.options);
					window.ClippyUI.appendAssistantMessage(result.text, actions, () => {
						if (result.actionTrigger) {
							executeActionTrigger(result.actionTrigger);
						}
					});
				}
			}, 160 + Math.random() * 140);
		}
	};

	if (document.readyState === 'complete' || document.readyState === 'interactive') {
		setTimeout(init, 100);
	} else {
		document.addEventListener('DOMContentLoaded', init);
	}
})();
