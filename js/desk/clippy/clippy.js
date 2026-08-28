(function () {
	'use strict';

	const IDLE_MESSAGE_INTERVAL_MS = 55000;
	const IDLE_MESSAGE_CHANCE = 0.7;

	const DESK_ONLY_ACTION_TRIGGERS = new Set([
		'action_inspect_windows',
		'action_show_desktop',
		'action_cascade_windows',
		'action_tile_windows',
		'action_check_mail',
		'action_compose_mail',
		'action_inspect_bin',
		'action_music_panel',
		'action_files_panel',
		'action_theme_panel',
		'action_wallpaper_panel',
		'action_achievements',
		'action_volume_panel',
		'action_system_tools'
	]);

	function getDeskOnlyFeatureLabel(actionId) {
		const features = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.features) || {};
		return features[actionId] || "Desktop Workstation";
	}

	let isThinking = false;
	let idleTimer = null;
	let chatMarathonTimer = null;

	function pickFrom(list) {
		if (!Array.isArray(list) || list.length === 0) return '';
		return list[Math.floor(Math.random() * list.length)];
	}

	function isDeskEnvironment() {
		return !window.ClippySystemBridge || window.ClippySystemBridge.getEnvironment() !== 'standalone';
	}

	function buildDeskOnlyResponse(featureLabel) {
		const k = window.ClippyKnowledge || {};
		const deskOnly = (k.SYSTEM_TEXTS && k.SYSTEM_TEXTS.deskOnly) || {
			template: "The \"{feature}\" module requires the full desktop workstation environment and is not available in this standalone Clippy session. Visit the complete desktop experience to unlock every capability.",
			actionDesk: "Open Desktop Experience",
			actionCapabilities: "What can you do here?"
		};
		const rawTemplate = k.resolveTextVariant ? k.resolveTextVariant(deskOnly.template, { brain: window.ClippyBrain }) : (deskOnly.template.default || deskOnly.template);
		const text = k.formatString ? k.formatString(rawTemplate, { feature: featureLabel }) : `The "${featureLabel}" module requires the full desktop environment.`;
		const deskLabel = k.resolveTextVariant ? k.resolveTextVariant(deskOnly.actionDesk, { brain: window.ClippyBrain }) : (deskOnly.actionDesk.default || deskOnly.actionDesk);
		const capLabel = k.resolveTextVariant ? k.resolveTextVariant(deskOnly.actionCapabilities, { brain: window.ClippyBrain }) : (deskOnly.actionCapabilities.default || deskOnly.actionCapabilities);
		return {
			text,
			actions: [
				{ label: deskLabel, onClick: () => { window.open('https://wartets.github.io/desk/', '_blank'); } },
				{ label: capLabel, onClick: () => handleUserInput("What can you do?") }
			]
		};
	}

	function respondDeskOnlyFeature(featureLabel) {
		const response = buildDeskOnlyResponse(featureLabel);
		window.ClippyUI.appendAssistantMessage(response.text, response.actions);
	}

	function handleUserInput(rawText, isSuggestion = false) {
		if (!rawText || isThinking) return;
		if (window.ClippyUI && window.ClippyUI.isTyping && window.ClippyUI.currentTypeInterval) {
			clearTimeout(window.ClippyUI.currentTypeInterval);
			window.ClippyUI.currentTypeInterval = null;
			window.ClippyUI.isTyping = false;
		}

		window.ClippyUI.appendUserMessage(rawText);
		isThinking = true;
		window.ClippyUI.setVisualState('think');

		setTimeout(() => {
			let response = null;
			try {
				response = processDispatch(rawText, isSuggestion);
			} catch (e) {
				const fallback = pickFrom(window.ClippyKnowledge ? window.ClippyKnowledge.FALLBACK_RESPONSES : []);
				response = { text: window.ClippyBrain ? window.ClippyBrain.transformResponseText(fallback) : fallback };
			} finally {
				isThinking = false;
			}

			if (response && response.text) {
				const formattedText = (window.ClippyBrain && !response.source) ? window.ClippyBrain.transformResponseText(response.text) : response.text;
				window.ClippyUI.appendAssistantMessage(formattedText, response.actions, () => {
					if (response.actionTrigger) {
						executeActionTrigger(response.actionTrigger);
					}
				});
				if (response.options && Array.isArray(response.options) && response.options.length > 0) {
					window.ClippyUI.updateSuggestions(response.options.map(o => o.label));
				}
			}
		}, 140 + Math.random() * 120);
	}

	function executeActionTrigger(actionId) {
		if (DESK_ONLY_ACTION_TRIGGERS.has(actionId) && !isDeskEnvironment()) {
			respondDeskOnlyFeature(getDeskOnlyFeatureLabel(actionId));
			return;
		}
		if (actionId === 'action_personality_quiz') {
			window.ClippyActivities.personalityQuiz.mount();
		} else if (actionId === 'action_personality_test_animal') {
			window.ClippyActivities.personalityQuiz.mount('animal-archetype');
		} else if (actionId === 'action_personality_test_ant') {
			window.ClippyActivities.personalityQuiz.mount('ant-colony');
		} else if (actionId === 'action_personality_test_shape') {
			window.ClippyActivities.personalityQuiz.mount('geometric-shape');
		} else if (actionId === 'action_personality_test_starwars') {
			window.ClippyActivities.personalityQuiz.mount('star-wars');
		} else if (actionId === 'action_personality_test_assistant') {
			window.ClippyActivities.personalityQuiz.mount('office-assistant');
		} else if (actionId === 'action_personality_test_os') {
			window.ClippyActivities.personalityQuiz.mount('operating-system');
		} else if (actionId === 'action_personality_test_autoroute') {
			window.ClippyActivities.personalityQuiz.mount('french-autoroute');
		} else if (actionId === 'action_personality_test_retro') {
			window.ClippyActivities.personalityQuiz.mount('retro-archetype');
		} else if (actionId === 'action_personality_test_kernel') {
			window.ClippyActivities.personalityQuiz.mount('system-kernel');
		} else if (actionId === 'action_personality_test_chaos') {
			window.ClippyActivities.personalityQuiz.mount('chaos-stapler');
		} else if (actionId === 'action_personality_test_philosophy') {
			window.ClippyActivities.personalityQuiz.mount('philosophy-temperament');
		} else if (actionId === 'action_personality_test_cyber') {
			window.ClippyActivities.personalityQuiz.mount('cyber-netrunner');
		} else if (actionId === 'timer_25') {
			if (window.ClippyAnimator) window.ClippyAnimator.play('Processing', { priority: 5, lock: true });
			window.ClippyActivities.pomodoro.mount(25);
		} else if (actionId === 'show_todos') {
			if (window.ClippyAnimator) window.ClippyAnimator.play('Writing', { priority: 5, lock: true });
			window.ClippyActivities.todo.mount();
		} else if (actionId === 'game_pong') {
			window.ClippyActivities.pong.mount();
		} else if (actionId === 'game_simon') {
			window.ClippyActivities.simon.mount();
		} else if (actionId === 'game_ttt') {
			window.ClippyActivities.tictactoe.mount();
		} else if (actionId === 'game_memory') {
			window.ClippyActivities.memory.mount();
		} else if (actionId === 'game_hangman') {
			window.ClippyActivities.hangman.mount();
		} else if (actionId === 'game_quiz') {
			window.ClippyActivities.quiz.mount();
		} else if (actionId === 'game_guess') {
			window.ClippyActivities.guess.mount();
		} else if (actionId === 'game_rps') {
			window.ClippyActivities.rps.mount();
		} else if (actionId === 'game_mines') {
			window.ClippyActivities.mines.mount();
		} else if (actionId === 'action_defrag') {
			window.ClippyActivities.defrag.mount();
		} else if (actionId === 'action_dimensional_analysis') {
			if (window.ClippyAnimator) window.ClippyAnimator.play('GetTechy', { priority: 5, lock: true });
			window.ClippyActivities.dimensionalAnalysis.mount();
		} else if (actionId === 'action_euclidean_division') {
			if (window.ClippyAnimator) window.ClippyAnimator.play('GetTechy', { priority: 5, lock: true });
			window.ClippyActivities.euclideanDivision.mount();
		} else if (actionId === 'action_polynomial_factorization') {
			if (window.ClippyAnimator) window.ClippyAnimator.play('GetTechy', { priority: 5, lock: true });
			window.ClippyActivities.polynomialFactorization.mount();
		} else if (actionId === 'action_linear_solver') {
			if (window.ClippyAnimator) window.ClippyAnimator.play('GetTechy', { priority: 5, lock: true });
			window.ClippyActivities.linearSolver.mount();
		} else if (actionId === 'action_wheel') {
			window.ClippyActivities.wheel.mount();
		} else if (actionId === 'action_cipher') {
			window.ClippyActivities.cipher.mount();
		} else if (actionId === 'action_tps') {
			window.ClippyActivities.tps.mount();
		} else if (actionId === 'action_date_calc') {
			if (window.ClippyAnimator) window.ClippyAnimator.play('CheckingSomething', { priority: 5, lock: true });
			window.ClippyActivities.dateCalc.mount();
		} else if (actionId === 'pet_status' || actionId === 'pet_feed' || actionId === 'pet_polish') {
			window.ClippyActivities.pet.mount();
		} else if (actionId === 'action_trivia') {
			if (window.ClippyAnimator) window.ClippyAnimator.play('CheckingSomething', { priority: 4, lock: true });
			const res = window.ClippyKnowledge.resolve(window.ClippyKnowledge.TRIVIA, { brain: window.ClippyBrain });
			window.ClippyUI.appendAssistantMessage(res.text, [
				{ label: "Another Trivia", onClick: () => executeActionTrigger('action_trivia') }
			]);
		} else if (actionId === 'action_joke') {
			if (window.ClippyAnimator) window.ClippyAnimator.play('Wave', { priority: 4, lock: true });
			const res = window.ClippyKnowledge.resolve(window.ClippyKnowledge.JOKES, { brain: window.ClippyBrain });
			window.ClippyUI.appendAssistantMessage(res.text, [
				{ label: "Another Joke", onClick: () => executeActionTrigger('action_joke') }
			]);
		} else if (actionId === 'action_status') {
			if (window.ClippyAnimator) window.ClippyAnimator.play('Processing', { priority: 4, lock: true });
			window.ClippyUI.appendAssistantMessage(window.ClippySystemBridge.getSystemSpecs());
		} else if (actionId === 'action_shortcuts') {
			if (window.ClippyAnimator) window.ClippyAnimator.play('CheckingSomething', { priority: 4, lock: true });
			window.ClippyUI.appendAssistantMessage((window.ClippyKnowledge ? window.ClippyKnowledge.SHORTCUTS : []).join('\n'));
		} else if (actionId === 'action_pass') {
			if (window.ClippyAnimator) window.ClippyAnimator.play('Save', { priority: 4, lock: true });
			const pwd = window.ClippyActivities.generatePassword(16);
			const rawTpl = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.password && window.ClippyKnowledge.SYSTEM_TEXTS.password.generated) || "Generated Secure Password ({length} chars):\n**`{password}`**";
			const tpl = window.ClippyKnowledge.resolveTextVariant ? window.ClippyKnowledge.resolveTextVariant(rawTpl, { brain: window.ClippyBrain, vars: { length: 16, password: pwd } }) : rawTpl;
			window.ClippyUI.appendAssistantMessage(window.ClippyKnowledge.formatString(tpl, { length: 16, password: pwd }));
		} else if (actionId === 'action_pass_24') {
			if (window.ClippyAnimator) window.ClippyAnimator.play('Save', { priority: 4, lock: true });
			const pwd = window.ClippyActivities.generatePassword(24);
			const rawTpl = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.password && window.ClippyKnowledge.SYSTEM_TEXTS.password.generatedEntropy) || "Generated High-Entropy Password ({length} chars):\n**`{password}`**";
			const tpl = window.ClippyKnowledge.resolveTextVariant ? window.ClippyKnowledge.resolveTextVariant(rawTpl, { brain: window.ClippyBrain, vars: { length: 24, password: pwd } }) : rawTpl;
			window.ClippyUI.appendAssistantMessage(window.ClippyKnowledge.formatString(tpl, { length: 24, password: pwd }));
		} else if (actionId === 'action_inspect_windows') {
			if (isDeskEnvironment()) {
				if (window.ClippyAnimator) window.ClippyAnimator.play('Searching', { priority: 4, lock: true });
				renderActiveWindowsList();
			} else {
				respondDeskOnlyFeature('Window Manager');
			}
		} else if (actionId === 'action_show_desktop') {
			if (isDeskEnvironment()) {
				window.ClippySystemBridge.minimizeAllWindows();
				const winTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.windowControls) || {};
				const msg = window.ClippyKnowledge.resolveTextVariant ? window.ClippyKnowledge.resolveTextVariant(winTexts.minimizedAll, { brain: window.ClippyBrain }) : pickFrom(winTexts.minimizedAll || ["All open windows have been minimized to the taskbar."]);
				window.ClippyUI.appendAssistantMessage(msg);
			} else {
				respondDeskOnlyFeature('Window Manager');
			}
		} else if (actionId === 'action_cascade_windows') {
			if (isDeskEnvironment()) {
				window.ClippySystemBridge.cascadeWindows();
				const winTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.windowControls) || {};
				const msg = window.ClippyKnowledge.resolveTextVariant ? window.ClippyKnowledge.resolveTextVariant(winTexts.cascaded, { brain: window.ClippyBrain }) : pickFrom(winTexts.cascaded || ["Windows arranged in cascade layout."]);
				window.ClippyUI.appendAssistantMessage(msg);
			} else {
				respondDeskOnlyFeature('Window Manager');
			}
		} else if (actionId === 'action_tile_windows') {
			if (isDeskEnvironment()) {
				window.ClippySystemBridge.tileWindows(true);
				const winTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.windowControls) || {};
				const msg = window.ClippyKnowledge.resolveTextVariant ? window.ClippyKnowledge.resolveTextVariant(winTexts.tiled, { brain: window.ClippyBrain }) : pickFrom(winTexts.tiled || ["Windows tiled horizontally across the workspace."]);
				window.ClippyUI.appendAssistantMessage(msg);
			} else {
				respondDeskOnlyFeature('Window Manager');
			}
		} else if (actionId === 'action_constant_c') {
			if (window.ClippyAnimator) window.ClippyAnimator.play('GetTechy', { priority: 4, lock: true });
			const cVal = (window.ClippyKnowledge && window.ClippyKnowledge.PHYSICAL_CONSTANTS && window.ClippyKnowledge.PHYSICAL_CONSTANTS.c) || { value: 299792458, unit: "m s^-1" };
			const rawTpl = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.constants && window.ClippyKnowledge.SYSTEM_TEXTS.constants.speedOfLightText) || "Speed of light in vacuum (c):\n**{value} {unit}** (exact standard)";
			const tpl = window.ClippyKnowledge.resolveTextVariant ? window.ClippyKnowledge.resolveTextVariant(rawTpl, { brain: window.ClippyBrain, vars: { value: cVal.value.toLocaleString(), unit: cVal.unit } }) : rawTpl;
			window.ClippyUI.appendAssistantMessage(window.ClippyKnowledge.formatString(tpl, { value: cVal.value.toLocaleString(), unit: cVal.unit }));
		} else if (actionId === 'action_constant_h') {
			if (window.ClippyAnimator) window.ClippyAnimator.play('GetTechy', { priority: 4, lock: true });
			const hVal = (window.ClippyKnowledge && window.ClippyKnowledge.PHYSICAL_CONSTANTS && window.ClippyKnowledge.PHYSICAL_CONSTANTS.h) || { value: 6.62607015e-34, unit: "J s" };
			const rawTpl = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.constants && window.ClippyKnowledge.SYSTEM_TEXTS.constants.planckText) || "Planck constant (h):\n**{value} {unit}** (exact standard)";
			const tpl = window.ClippyKnowledge.resolveTextVariant ? window.ClippyKnowledge.resolveTextVariant(rawTpl, { brain: window.ClippyBrain, vars: { value: hVal.value, unit: hVal.unit } }) : rawTpl;
			window.ClippyUI.appendAssistantMessage(window.ClippyKnowledge.formatString(tpl, { value: hVal.value, unit: hVal.unit }));
		} else if (actionId === 'action_profile') {
			renderUserProfileCard();
		} else if (actionId === 'action_achievements') {
			renderAchievementsList();
		} else if (actionId === 'action_theme_panel') {
			if (isDeskEnvironment()) {
				if (window.ClippyAnimator) window.ClippyAnimator.play('GetWizardy', { priority: 4, lock: true });
				renderThemeSelectorCard();
			} else {
				respondDeskOnlyFeature('Theme Switcher');
			}
		} else if (actionId === 'action_wallpaper_panel') {
			if (isDeskEnvironment()) {
				if (window.ClippyAnimator) window.ClippyAnimator.play('GetArtsy', { priority: 4, lock: true });
				renderWallpaperSelectorCard();
			} else {
				respondDeskOnlyFeature('Desktop Wallpapers');
			}
		} else if (actionId === 'action_music_panel') {
			if (isDeskEnvironment()) {
				if (window.ClippyAnimator) window.ClippyAnimator.play('Hearing_1', { priority: 4, lock: true });
				renderMusicPlayerController();
			} else {
				respondDeskOnlyFeature('Audio Player');
			}
		} else if (actionId === 'action_files_panel') {
			if (isDeskEnvironment()) {
				if (window.ClippyAnimator) window.ClippyAnimator.play('Searching', { priority: 4, lock: true });
				renderFileListCard('/');
			} else {
				respondDeskOnlyFeature('File System');
			}
		} else if (actionId === 'action_volume_panel') {
			if (isDeskEnvironment()) {
				if (window.ClippyAnimator) window.ClippyAnimator.play('Alert', { priority: 4, lock: true });
				renderVolumeControllerCard();
			} else {
				respondDeskOnlyFeature('Audio Volume Controller');
			}
		} else if (actionId === 'action_system_tools') {
			if (isDeskEnvironment()) {
				if (window.ClippyAnimator) window.ClippyAnimator.play('Processing', { priority: 4, lock: true });
				renderSystemToolsCard();
			} else {
				respondDeskOnlyFeature('System Diagnostics');
			}
		} else if (actionId === 'action_check_mail') {
			if (isDeskEnvironment()) {
				if (window.ClippyAnimator) window.ClippyAnimator.play('CheckingSomething', { priority: 4, lock: true });
				renderMailListCard();
			} else {
				respondDeskOnlyFeature('Outlook Express');
			}
		} else if (actionId === 'action_compose_mail') {
			if (isDeskEnvironment()) {
				if (window.ClippyAnimator) window.ClippyAnimator.play('SendMail', { priority: 5, lock: true });
				window.ClippySystemBridge.launchApp('outlook');
				const mailTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.mailControls) || {};
				window.ClippyUI.appendAssistantMessage(mailTexts.launched || "Outlook Express launched for drafting messages.");
			} else {
				respondDeskOnlyFeature('Outlook Express');
			}
		} else if (actionId === 'action_inspect_bin') {
			if (isDeskEnvironment()) {
				if (window.ClippyAnimator) window.ClippyAnimator.play('EmptyTrash', { priority: 4, lock: true });
				const count = window.ClippySystemBridge.getRecycleBinCount();
				const rbTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.recycleBin) || {};
				const msg = count > 0 
					? (window.ClippyKnowledge.formatString(rbTexts.countNotice || "The Recycle Bin currently holds {count} item(s).", { count }))
					: (rbTexts.emptyNotice || "The Recycle Bin is completely empty.");
				window.ClippyUI.appendAssistantMessage(msg, [
					{ label: rbTexts.btnOpen || "Open Recycle Bin", onClick: () => window.ClippySystemBridge.launchApp('recyclebin') },
					{ label: rbTexts.btnEmpty || "Empty Recycle Bin", onClick: () => { window.ClippySystemBridge.emptyRecycleBin(); window.ClippyUI.appendAssistantMessage(rbTexts.emptiedNotice || "Recycle Bin emptied."); } }
				]);
			} else {
				respondDeskOnlyFeature('Recycle Bin');
			}
		}
	}

	function processDispatch(rawText, isSuggestion = false) {
		const norm = rawText.toLowerCase().trim();

		if (norm === 'exit' || norm === 'quit' || norm === 'cancel' || norm === 'stop' || norm === 'menu' || norm === 'back' || norm === 'annuler' || norm === 'quitter') {
			const k = window.ClippyKnowledge || {};
			const userProf = window.ClippySystemBridge ? window.ClippySystemBridge.getUserProfile() : { userName: 'User' };
			const resolved = k.resolve ? k.resolve(k.STANDBY_PHRASES, { brain: window.ClippyBrain, vars: { userName: userProf.userName } }) : { text: "Standing by for instructions.", actions: [] };
			return {
				text: window.ClippyBrain ? window.ClippyBrain.transformResponseText(resolved.text) : resolved.text,
				actions: resolved.actions && resolved.actions.length > 0 ? resolved.actions : [
					{ label: "What can you do?", onClick: () => handleUserInput("What can you do?") },
					{ label: "View To-Do List", onClick: () => handleUserInput("View To-Do List") },
					{ label: "System Diagnostics", onClick: () => handleUserInput("System diagnostics") }
				]
			};
		}

		if (norm === 'what can you do?' || norm === 'what can you do' || norm === 'help' || norm === 'commands' || norm === 'aide' || norm === 'features') {
			const node = window.ClippyBrain ? window.ClippyBrain.navigateGraphNode('tools_overview_node') : null;
			if (node) {
				return { text: node.text, actions: window.ClippyBrain.buildGraphActions(node.options) };
			}
			const cap = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.capabilities) || {
				title: "Workstation Capability Index",
				thModule: "Module",
				thCommands: "Commands & Description",
				tasksDesc: "<code>todo</code>, <code>todo add [text]</code>, <code>note [memo]</code>, <code>timer 25</code>",
				workstationDesc: "<code>diagnostics</code>, <code>windows</code>, <code>files</code>, <code>mail</code>, <code>defrag</code>",
				customizationDesc: "<code>theme [name]</code>, <code>wallpaper</code>, <code>volume</code>, <code>scanlines on/off</code>, <code>crt on/off</code>",
				calculationsDesc: "<code>calc [formula]</code>, <code>convert [from] to [to]</code>, <code>password [len]</code>",
				miniGamesDesc: "<code>pong</code>, <code>tictactoe</code>, <code>memory</code>, <code>hangman</code>, <code>quiz</code>, <code>guess</code>, <code>mines</code>, <code>rps</code>"
			};
			return {
				text: `<div class="clippy-structured-section">
					<div class="clippy-section-title">${cap.title}</div>
					<table class="clippy-xp-table">
						<tr><th>${cap.thModule}</th><th>${cap.thCommands}</th></tr>
						<tr><td><b>Tasks</b></td><td>${cap.tasksDesc}</td></tr>
						<tr><td><b>Workstation</b></td><td>${cap.workstationDesc}</td></tr>
						<tr><td><b>Customization</b></td><td>${cap.customizationDesc}</td></tr>
						<tr><td><b>Calculations</b></td><td>${cap.calculationsDesc}</td></tr>
						<tr><td><b>Mini-Games</b></td><td>${cap.miniGamesDesc}</td></tr>
					</table>
				</div>`,
				actions: [
					{ label: "View To-Do List", onClick: () => handleUserInput("View To-Do List") },
					{ label: "Inspect active windows", onClick: () => handleUserInput("Inspect active windows") },
					{ label: "Change Wallpaper", onClick: () => handleUserInput("Change wallpaper") },
					{ label: "Check unread emails", onClick: () => handleUserInput("Check unread emails") },
					{ label: "Play Tic-Tac-Toe", onClick: () => handleUserInput("Play Tic-Tac-Toe") },
					{ label: "Play Memory Game", onClick: () => handleUserInput("Play Memory Game") },
					{ label: "Play Minesweeper", onClick: () => handleUserInput("Play Minesweeper") },
					{ label: "System Diagnostics", onClick: () => handleUserInput("System diagnostics") }
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

		if (norm === 'system diagnostics' || norm === 'specs' || norm === 'diagnostic' || norm === 'status' || norm === 'statut systeme' || norm === 'telemetry') {
			return {
				text: window.ClippySystemBridge.getSystemSpecs(),
				actions: [
					{ label: "Inspect active windows", onClick: () => handleUserInput("Inspect active windows") },
					{ label: "Check unread emails", onClick: () => handleUserInput("Check unread emails") },
					{ label: "Defrag Drive C:", onClick: () => handleUserInput("Defrag Drive C:") }
				]
			};
		}

		if (norm === 'talk about mathematics' || norm === 'mathematics' || norm === 'math' || norm === 'maths' || norm === 'calculus' || norm === 'algebra') {
			const node = window.ClippyBrain ? window.ClippyBrain.navigateGraphNode('math_lecture_node') : null;
			return node ? { text: node.text, actions: window.ClippyBrain.buildGraphActions(node.options) } : { text: "Opening mathematics seminar...", actionTrigger: 'tools_overview_node' };
		}

		if (norm === 'everyday conversation' || norm === 'chat' || norm === 'daily life' || norm === 'coffee' || norm === 'routine') {
			const node = window.ClippyBrain ? window.ClippyBrain.navigateGraphNode('everyday_chat_node') : null;
			return node ? { text: node.text, actions: window.ClippyBrain.buildGraphActions(node.options) } : { text: "Starting everyday chat...", actionTrigger: 'tools_overview_node' };
		}

		if (norm === 'quantum recycle bin theory' || norm.includes('quantum recycle bin') || norm.includes('corbeille quantique')) {
			const qPool = (window.ClippyKnowledge && window.ClippyKnowledge.TOPIC_RESPONSES && window.ClippyKnowledge.TOPIC_RESPONSES.quantum_bin) || [];
			const res = window.ClippyKnowledge.resolve(qPool, { brain: window.ClippyBrain });
			return {
				text: res.text,
				actions: res.actions && res.actions.length > 0 ? res.actions : [
					{ label: "Open Recycle Bin", onClick: () => { if (isDeskEnvironment()) window.ClippySystemBridge.launchApp('recyclebin'); else respondDeskOnlyFeature('Recycle Bin'); } },
					{ label: "Empty Recycle Bin", onClick: () => { if (isDeskEnvironment()) { window.ClippySystemBridge.emptyRecycleBin(); window.ClippyUI.appendAssistantMessage("Recycle Bin emptied."); } else { respondDeskOnlyFeature('Recycle Bin'); } } }
				]
			};
		}

		if (norm === 'talk about programming' || norm === 'programming' || norm === 'coding' || norm === 'programmation') {
			const prgPool = (window.ClippyKnowledge && window.ClippyKnowledge.TOPIC_RESPONSES && window.ClippyKnowledge.TOPIC_RESPONSES.programming) || [];
			const res = window.ClippyKnowledge.resolve(prgPool, { brain: window.ClippyBrain });
			return {
				text: res.text,
				actions: res.actions && res.actions.length > 0 ? res.actions : [
					{ label: "Open Command Prompt", onClick: () => { if (isDeskEnvironment()) window.ClippySystemBridge.launchApp('cmd'); else respondDeskOnlyFeature('Command Prompt'); } },
					{ label: "Open Projects", onClick: () => { if (isDeskEnvironment()) window.ClippySystemBridge.launchApp('projects'); else respondDeskOnlyFeature('Projects Folder'); } }
				]
			};
		}

		if (norm === 'talk about space and cosmos' || norm === 'space' || norm === 'cosmos' || norm === 'espace' || norm === 'univers') {
			const spacePool = (window.ClippyKnowledge && window.ClippyKnowledge.TOPIC_RESPONSES && window.ClippyKnowledge.TOPIC_RESPONSES.space) || [];
			const res = window.ClippyKnowledge.resolve(spacePool, { brain: window.ClippyBrain });
			return {
				text: res.text,
				actions: res.actions && res.actions.length > 0 ? res.actions : [
					{ label: "Evaluate speed of light c", onClick: () => handleUserInput("Evaluate speed of light c") },
					{ label: "Evaluate Planck constant h", onClick: () => handleUserInput("Evaluate Planck constant h") }
				]
			};
		}

		if (norm === 'an unusual conversation...' || norm === 'an unusual conversation' || norm === 'unusual conversation' || norm === 'cannot see the sun from here' || norm === 'human conversation') {
			const node = window.ClippyBrain ? window.ClippyBrain.navigateGraphNode('N001') : null;
			return node ? { text: node.text, actions: window.ClippyBrain.buildGraphActions(node.options) } : { text: "Good morning. I cannot see the sun from here.", actionTrigger: null };
		}

		if (norm === 'inspect active windows' || norm === 'active windows' || norm === 'list windows' || norm === 'open windows' || norm === 'fenetres actives') {
			return { text: "Inspecting running workspace windows...", actionTrigger: 'action_inspect_windows' };
		}

		if (norm.includes('which animal am i') || norm.includes('what animal am i') || norm.includes('animal test') || norm.includes('animal archetype') || norm.includes('spirit animal')) {
			return { text: "Initializing Animal Instinct & Archetype Evaluation...", actionTrigger: 'action_personality_test_animal' };
		}

		if (norm.includes('which ant am i') || norm.includes('what ant am i') || norm.includes('ant test') || norm.includes('ant caste') || norm.includes('myrmecology')) {
			return { text: "Initializing Myrmecology Colony Caste Alignment...", actionTrigger: 'action_personality_test_ant' };
		}

		if (norm.includes('which geometric shape am i') || norm.includes('which shape am i') || norm.includes('what shape am i') || norm.includes('shape test') || norm.includes('topology test') || norm.includes('polygon test')) {
			return { text: "Initializing Geometric Topology & Polygon Alignment...", actionTrigger: 'action_personality_test_shape' };
		}

		if (norm.includes('which star wars character am i') || norm.includes('star wars test') || norm.includes('star wars personality') || norm.includes('what star wars character')) {
			return { text: "Initializing Galactic Force & Persona Alignment...", actionTrigger: 'action_personality_test_starwars' };
		}

		if (norm.includes('which office assistant am i') || norm.includes('which clippy am i') || norm.includes('what office assistant') || norm.includes('microsoft assistant test') || norm.includes('office companion test')) {
			return { text: "Initializing Microsoft Office Assistant Archetype Evaluation...", actionTrigger: 'action_personality_test_assistant' };
		}

		if (norm.includes('which operating system am i') || norm.includes('which os am i') || norm.includes('what operating system am i') || norm.includes('os personality') || norm.includes('kernel typology')) {
			return { text: "Initializing Operating System Kernel Typology...", actionTrigger: 'action_personality_test_os' };
		}

		if (norm.includes('which french autoroute am i') || norm.includes('which autoroute am i') || norm.includes('what highway am i') || norm.includes('autoroute test') || norm.includes('french highway test') || norm.includes('quelle autoroute')) {
			return { text: "Initializing French Autoroute Network Alignment...", actionTrigger: 'action_personality_test_autoroute' };
		}

		if (norm.includes('personality test') || norm.includes('personality quiz') || norm === 'personality' || norm.includes('archetype') || norm.includes('test de personnalite') || norm.includes('quiz de personnalite')) {
			return { text: "Loading personality matrix evaluations...", actionTrigger: 'action_personality_quiz' };
		}

		if (norm === 'play pong' || norm === 'pong' || norm === 'challenge clippy to pong' || norm === 'table tennis' || norm === 'pong game' || norm === 'pong match') {
			return { text: "Initializing Pong court against Clippy...", actionTrigger: 'game_pong' };
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

		if (norm === 'play minesweeper' || norm === 'minesweeper' || norm === 'mines' || norm === 'demineur') {
			return { text: "Initializing 6x6 tactical minefield...", actionTrigger: 'game_mines' };
		}

		if (norm === 'tech trivia quiz' || norm === 'trivia quiz' || norm === 'quiz') {
			return { text: "Initializing diagnostic Tech Quiz...", actionTrigger: 'game_quiz' };
		}

		if (norm === 'guess the number' || norm === 'guess number' || norm === 'devine le nombre') {
			return { text: "Initializing Random Number Generator (1-100)...", actionTrigger: 'game_guess' };
		}

		if (norm === 'rock paper scissors' || norm === 'rps' || norm === 'chifoumi' || norm === 'pierre feuille ciseaux') {
			return { text: "Initiating Rock-Paper-Scissors module...", actionTrigger: 'game_rps' };
		}

		if (norm === 'pet clippy status' || norm === 'tamagotchi' || norm === 'etat clippy') {
			return { text: "Reading Clippy maintenance indicators...", actionTrigger: 'pet_status' };
		}

		if (norm === 'defrag drive c:' || norm === 'defrag' || norm === 'defragment' || norm === 'defragmentation') {
			return { text: "Starting Drive C: cluster optimization...", actionTrigger: 'action_defrag' };
		}

		if (norm.includes('homogeneity') || norm.includes('dimensional analysis') || norm.includes('analyse dimensionnelle') || (norm.includes('=') && !norm.startsWith('theme=') && (norm.includes('f =') || norm.includes('e =') || norm.includes('v =') || norm.includes('p =') || norm.includes('t =')))) {
			const node = window.ClippyBrain ? window.ClippyBrain.navigateGraphNode('activity_dimensional_analysis_node') : null;
			return node ? { text: node.text, actions: window.ClippyBrain.buildGraphActions(node.options), actionTrigger: 'action_dimensional_analysis' } : { text: "Initializing physical dimensional analysis...", actionTrigger: 'action_dimensional_analysis' };
		}

		if (norm.includes('euclidean division') || norm.includes('division euclidienne') || norm.includes('polynomial division') || norm.includes('quotient and remainder')) {
			const node = window.ClippyBrain ? window.ClippyBrain.navigateGraphNode('activity_euclidean_division_node') : null;
			return node ? { text: node.text, actions: window.ClippyBrain.buildGraphActions(node.options), actionTrigger: 'action_euclidean_division' } : { text: "Loading Euclidean division engine...", actionTrigger: 'action_euclidean_division' };
		}

		if (norm.includes('factor polynomial') || norm.includes('factor quadratic') || norm.startsWith('factor ') || norm.includes('factorize') || norm.includes('factoriser')) {
			const node = window.ClippyBrain ? window.ClippyBrain.navigateGraphNode('activity_polynomial_factorization_node') : null;
			return node ? { text: node.text, actions: window.ClippyBrain.buildGraphActions(node.options), actionTrigger: 'action_polynomial_factorization' } : { text: "Initializing polynomial factorization engine...", actionTrigger: 'action_polynomial_factorization' };
		}

		if (norm.includes('linear system') || norm.includes('gaussian elimination') || norm.includes('systeme lineaire') || norm.includes('solve matrix')) {
			const node = window.ClippyBrain ? window.ClippyBrain.navigateGraphNode('activity_linear_solver_node') : null;
			return node ? { text: node.text, actions: window.ClippyBrain.buildGraphActions(node.options), actionTrigger: 'action_linear_solver' } : { text: "Initializing Gaussian elimination linear solver...", actionTrigger: 'action_linear_solver' };
		}

		if (norm.includes('wheel') || norm.includes('decision wheel') || norm.includes('roue de choix') || norm.includes('roue')) {
			const node = window.ClippyBrain ? window.ClippyBrain.navigateGraphNode('activity_wheel_node') : null;
			return node ? { text: node.text, actions: window.ClippyBrain.buildGraphActions(node.options), actionTrigger: 'action_wheel' } : { text: "Priming decision choice wheel...", actionTrigger: 'action_wheel' };
		}

		if (norm.includes('cipher') || norm.includes('morse') || norm.includes('caesar') || norm.includes('vigenere') || norm.includes('encoder') || norm.includes('decoder')) {
			const node = window.ClippyBrain ? window.ClippyBrain.navigateGraphNode('activity_cipher_node') : null;
			return node ? { text: node.text, actions: window.ClippyBrain.buildGraphActions(node.options), actionTrigger: 'action_cipher' } : { text: "Initializing cryptography workbench...", actionTrigger: 'action_cipher' };
		}

		if (norm.includes('tps') || norm.includes('cps') || norm.includes('click speed') || norm.includes('mouse speed')) {
			const node = window.ClippyBrain ? window.ClippyBrain.navigateGraphNode('activity_tps_node') : null;
			return node ? { text: node.text, actions: window.ClippyBrain.buildGraphActions(node.options), actionTrigger: 'action_tps' } : { text: "Initializing mouse click speed benchmark...", actionTrigger: 'action_tps' };
		}

		if (norm.includes('date calculator') || norm.includes('days between') || norm.includes('date difference') || norm.includes('calculateur de date')) {
			const node = window.ClippyBrain ? window.ClippyBrain.navigateGraphNode('activity_date_calc_node') : null;
			return node ? { text: node.text, actions: window.ClippyBrain.buildGraphActions(node.options), actionTrigger: 'action_date_calc' } : { text: "Initializing date interval calculator...", actionTrigger: 'action_date_calc' };
		}

		if (norm === 'start pomodoro timer' || norm.startsWith('timer ') || norm.startsWith('pomodoro')) {
			const node = window.ClippyBrain ? window.ClippyBrain.navigateGraphNode('pomodoro_node') : null;
			return node ? { text: node.text, actions: window.ClippyBrain.buildGraphActions(node.options), actionTrigger: 'timer_25' } : { text: "Starting 25-minute Pomodoro timer...", actionTrigger: 'timer_25' };
		}

		if (norm === 'view to-do list' || norm === 'to-do list' || norm === 'todo list' || norm === 'todo' || norm === 'todos' || norm === 'tasks' || norm === 'mes taches') {
			return { text: "Opening task registers...", actionTrigger: 'show_todos' };
		}

		if (norm === 'tell me a joke' || norm.includes('joke') || norm.includes('blague')) {
			const res = window.ClippyKnowledge.resolve(window.ClippyKnowledge.JOKES, { brain: window.ClippyBrain });
			return {
				text: res.text,
				actions: res.actions && res.actions.length > 0 ? res.actions : [{ label: "Another Joke", onClick: () => handleUserInput("Tell me a joke") }]
			};
		}

		if (norm === 'random retro trivia' || norm === 'trivia' || norm === 'retro trivia' || norm.includes('trivia') || norm.includes('anecdote')) {
			const res = window.ClippyKnowledge.resolve(window.ClippyKnowledge.TRIVIA, { brain: window.ClippyBrain });
			return {
				text: res.text,
				actions: res.actions && res.actions.length > 0 ? res.actions : [{ label: "More Trivia", onClick: () => handleUserInput("Random Retro Trivia") }]
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
			return {
				text: `<div class="clippy-structured-section">
					<div class="clippy-section-title">Physical Constant: Planck Constant</div>
					<table class="clippy-xp-table">
						<tr><th>Property</th><th>Value</th></tr>
						<tr><td><b>Symbol</b></td><td><code>h</code></td></tr>
						<tr><td><b>Numerical Value</b></td><td><strong>6.62607015 x 10^-34</strong></td></tr>
						<tr><td><b>Unit</b></td><td>Joule-second (J s)</td></tr>
						<tr><td><b>Standard</b></td><td>CODATA Exact Standard</td></tr>
					</table>
				</div>`
			};
		}

		if (norm === 'evaluate speed of light c' || norm === 'speed of light' || norm === 'constant c') {
			return {
				text: `<div class="clippy-structured-section">
					<div class="clippy-section-title">Physical Constant: Speed of Light</div>
					<table class="clippy-xp-table">
						<tr><th>Property</th><th>Value</th></tr>
						<tr><td><b>Symbol</b></td><td><code>c</code></td></tr>
						<tr><td><b>Numerical Value</b></td><td><strong>299,792,458</strong></td></tr>
						<tr><td><b>Unit</b></td><td>Meters per second (m/s)</td></tr>
						<tr><td><b>Standard</b></td><td>CODATA Exact Standard</td></tr>
					</table>
				</div>`
			};
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

		if ((norm === 'minimize all' || norm === 'show desktop' || norm === 'hide windows' || norm === 'restore all' || norm === 'restore windows' || norm === 'cascade windows' || norm === 'cascade' || norm === 'tile windows' || norm === 'tile') && !isDeskEnvironment()) {
			return buildDeskOnlyResponse('Window Manager');
		}

		if (norm === 'minimize all' || norm === 'show desktop' || norm === 'hide windows') {
			window.ClippySystemBridge.minimizeAllWindows();
			const winTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.windowControls) || {};
			const msg = pickFrom(winTexts.minimizedAll || ["All open windows have been minimized to the taskbar."]);
			return { text: window.ClippyBrain ? window.ClippyBrain.formatWithMood(msg) : msg };
		}

		if (norm === 'restore all' || norm === 'restore windows') {
			window.ClippySystemBridge.restoreAllWindows();
			const winTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.windowControls) || {};
			const msg = pickFrom(winTexts.restoredAll || ["All windows restored to workspace."]);
			return { text: window.ClippyBrain ? window.ClippyBrain.formatWithMood(msg) : msg };
		}

		if (norm === 'cascade windows' || norm === 'cascade') {
			window.ClippySystemBridge.cascadeWindows();
			const winTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.windowControls) || {};
			const msg = pickFrom(winTexts.cascaded || ["Windows have been cascaded across the workspace."]);
			return { text: window.ClippyBrain ? window.ClippyBrain.formatWithMood(msg) : msg };
		}

		if (norm === 'tile windows' || norm === 'tile') {
			window.ClippySystemBridge.tileWindows(true);
			const winTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.windowControls) || {};
			const msg = pickFrom(winTexts.tiled || ["Windows have been tiled horizontally."]);
			return { text: window.ClippyBrain ? window.ClippyBrain.formatWithMood(msg) : msg };
		}

		if ((norm === 'play music' || norm === 'toggle music' || norm === 'resume music' || norm === 'next music track' || norm === 'next track' || norm === 'next song' || norm === 'previous music track' || norm === 'prev track' || norm === 'prev song' || norm === 'now playing' || norm === 'current song') && !isDeskEnvironment()) {
			return buildDeskOnlyResponse(getDeskOnlyFeatureLabel('action_music_panel'));
		}

		if (norm === 'play music' || norm === 'toggle music' || norm === 'resume music') {
			window.ClippySystemBridge.toggleMusicPlayback();
			const track = window.ClippySystemBridge.getNowPlaying();
			const mTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.musicControls) || {};
			const msg = track ? window.ClippyKnowledge.formatString(mTexts.toggled || 'Playback toggled: "{title}"', { title: track.title || 'Audio Track' }) : (mTexts.initiated || "Audio player initiated.");
			return {
				text: msg,
				actions: [
					{ label: "Next Track", onClick: () => { window.ClippySystemBridge.nextMusicTrack(); } },
					{ label: "Open Media Player", onClick: () => window.ClippySystemBridge.launchApp('mediaplayer') }
				]
			};
		}

		if (norm === 'next music track' || norm === 'next track' || norm === 'next song') {
			window.ClippySystemBridge.nextMusicTrack();
			const mTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.musicControls) || {};
			return { text: mTexts.nextTrack || "Advanced to next audio track." };
		}

		if (norm === 'previous music track' || norm === 'prev track' || norm === 'prev song') {
			window.ClippySystemBridge.prevMusicTrack();
			const mTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.musicControls) || {};
			return { text: mTexts.prevTrack || "Returned to previous audio track." };
		}

		if (norm === 'now playing' || norm === 'current song') {
			const track = window.ClippySystemBridge.getNowPlaying();
			const mTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.musicControls) || {};
			const text = track ? window.ClippyKnowledge.formatString(mTexts.nowPlaying || "Now Playing: **{title}** by **{artist}**", { title: track.title || 'Audio Track', artist: track.artist || 'Artist' }) : (mTexts.noTrack || "No media track is currently active.");
			return {
				text,
				actions: [{ label: "Open Media Player", onClick: () => window.ClippySystemBridge.launchApp('mediaplayer') }]
			};
		}

		if (norm.startsWith('open ') || norm.startsWith('launch ') || norm.startsWith('start ') || norm.startsWith('lancer ') || norm.startsWith('ouvre ')) {
			if (!isDeskEnvironment()) {
				return buildDeskOnlyResponse('Application Launcher');
			}
			const appTarget = norm.replace(/^(open|launch|start|lancer|ouvre)\s+/i, '').trim();
			const appAliases = {
				'calc': 'calculator', 'calculator': 'calculator', 'calculatrice': 'calculator', 'paint': 'paint', 'mspaint': 'paint', 'dessin': 'paint', 'notepad': 'notepad', 'text editor': 'notepad', 'bloc-notes': 'notepad', 'cmd': 'cmd', 'command prompt': 'cmd',
				'terminal': 'cmd', 'invite de commandes': 'cmd', 'ie': 'ie', 'internet explorer': 'ie', 'browser': 'ie', 'navigateur': 'ie', 'outlook': 'outlook', 'outlook express': 'outlook', 'mail': 'outlook', 'email': 'outlook', 'courrier': 'outlook', 'winamp': 'winamp',
				'media player': 'mediaplayer', 'windows media player': 'mediaplayer', 'wmp': 'mediaplayer', 'minesweeper': 'minesweeper', 'demineur': 'minesweeper', 'mine': 'minesweeper', 'solitaire': 'solitaire', 'sol': 'solitaire', 'cartes': 'solitaire',
				'control panel': 'settings', 'settings': 'settings', 'panneau de configuration': 'settings', 'display': 'display', 'wallpapers': 'display', 'affichage': 'display', 'my computer': 'mycomputer', 'computer': 'mycomputer', 'poste de travail': 'mycomputer',
				'recycle bin': 'recyclebin', 'trash': 'recyclebin', 'corbeille': 'recyclebin', 'achievements': 'achievements', 'trophies': 'achievements', 'milestones': 'achievements', 'succes': 'achievements', 'projects': 'projects', 'portfolio': 'projects', 'projets': 'projects',
				'sound recorder': 'soundrecorder', 'enregistreur audio': 'soundrecorder', 'character map': 'charmap', 'charmap': 'charmap', 'table des caracteres': 'charmap', 'encarta': 'encarta', 'globe': 'encarta', 'world globe': 'encarta', 'task manager': 'taskmgr',
				'taskmgr': 'taskmgr', 'gestionnaire des taches': 'taskmgr'
			};
			const targetId = appAliases[appTarget] || appTarget;
			if (window.DeskAppRegistry && window.DeskAppRegistry.get(targetId)) {
				window.DeskAppRegistry.launch(targetId);
				const appTpl = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.appControls && window.ClippyKnowledge.SYSTEM_TEXTS.appControls.launched) || "Launched application: **{name}**.";
				return { text: window.ClippyKnowledge.formatString(appTpl, { name: window.DeskAppRegistry.get(targetId).name }) };
			}
		}

		if (norm.startsWith('theme ') || norm.startsWith('set theme ') || norm.startsWith('theme=')) {
			if (!isDeskEnvironment()) {
				return buildDeskOnlyResponse('Theme Switcher');
			}
			const theme = norm.replace(/^(theme|set theme|theme=)\s*/i, '').trim();
			const validThemes = ['luna-blue', 'royale', 'silver', 'olive', 'classic', 'zune', 'noir', 'matrix', 'high-contrast'];
			const thTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.themeControls) || {};
			if (validThemes.includes(theme)) {
				window.ClippySystemBridge.setTheme(theme);
				return { text: window.ClippyKnowledge.formatString(thTexts.switched || "Workstation theme switched to: **{theme}**.", { theme }) };
			}
			return {
				text: window.ClippyKnowledge.formatString(thTexts.available || "Available themes: {themes}.", { themes: validThemes.join(', ') }),
				actions: validThemes.slice(0, 4).map(t => ({ label: t, onClick: () => { window.ClippySystemBridge.setTheme(t); window.ClippyUI.appendAssistantMessage(window.ClippyKnowledge.formatString(thTexts.switched || "Workstation theme switched to: **{theme}**.", { theme: t })); } }))
			};
		}

		if (norm === 'scanlines on' || norm === 'enable scanlines' || norm === 'scanlines off' || norm === 'disable scanlines' || norm === 'crt on' || norm === 'enable crt' || norm === 'crt off' || norm === 'disable crt') {
			if (!isDeskEnvironment()) {
				return buildDeskOnlyResponse('CRT & Display Effects');
			}
			const dTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.displayControls) || {};
			if (norm === 'scanlines on' || norm === 'enable scanlines') {
				window.ClippySystemBridge.toggleScanlines(true);
				return { text: dTexts.scanlinesOn || "Scanlines overlay enabled." };
			}
			if (norm === 'scanlines off' || norm === 'disable scanlines') {
				window.ClippySystemBridge.toggleScanlines(false);
				return { text: dTexts.scanlinesOff || "Scanlines overlay disabled." };
			}
			if (norm === 'crt on' || norm === 'enable crt') {
				window.ClippySystemBridge.toggleCrt(true);
				return { text: dTexts.crtOn || "CRT glass curvature filter enabled." };
			}
			window.ClippySystemBridge.toggleCrt(false);
			return { text: dTexts.crtOff || "CRT glass curvature filter disabled." };
		}

		if (norm.startsWith('todo add ') || norm.startsWith('task add ')) {
			const text = rawText.replace(/^(todo add|task add)\s+/i, '').trim();
			if (text) {
				const todos = window.ClippyActivities.getStoredTodos();
				todos.push({ id: Date.now(), text, done: false });
				window.ClippyActivities.saveStoredTodos(todos);
				window.ClippyActivities.todo.mount();
				return null;
			}
		}

		const fTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.fileControls) || {};

		if (norm.startsWith('note ') || norm.startsWith('scratchpad write ')) {
			const memo = rawText.replace(/^(note|scratchpad write)\s+/i, '').trim();
			if (window.ClippyAnimator) window.ClippyAnimator.playSequence(['Writing', 'Save'], { priority: 4, lock: true });
			window.ClippyActivities.saveScratchpadNote(memo);
			return { text: window.ClippyKnowledge.formatString(fTexts.noteCommitted || "[SCRATCHPAD COMMITTED] Memo saved to local storage:\n\"{memo}\"", { memo }) };
		}
		if (norm === 'note' || norm === 'scratchpad' || norm === 'open scratchpad note') {
			const memo = window.ClippyActivities.getScratchpadNote() || (fTexts.scratchpadEmpty || "(Scratchpad buffer is currently empty. Type 'note [text]' to save a memo.)");
			return { text: window.ClippyKnowledge.formatString(fTexts.scratchpadBuffer || "[SCRATCHPAD BUFFER]\n{memo}", { memo }) };
		}

		const conv = window.ClippyActivities.parseUnitConversion(rawText);
		if (conv) {
			const cTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.conversions) || {};
			const rawTpl = window.ClippyKnowledge.resolveTextVariant ? window.ClippyKnowledge.resolveTextVariant(cTexts.result, { brain: window.ClippyBrain, vars: { result: conv } }) : (cTexts.result || "Unit Conversion Result: **{result}**");
			return { text: window.ClippyKnowledge.formatString(rawTpl, { result: conv }) };
		}

		if (norm.startsWith('calc ') || norm.startsWith('calculate ') || norm.startsWith('evaluate ') || /^[\d\s\+\-\*\/\(\)\.\^\%]+$/.test(norm)) {
			const mathRes = window.ClippyActivities.evaluateMathExpression(norm);
			if (mathRes !== null) {
				const calcTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.calculations) || {};
				const rawTpl = window.ClippyKnowledge.resolveTextVariant ? window.ClippyKnowledge.resolveTextVariant(calcTexts.result, { brain: window.ClippyBrain, vars: { result: mathRes } }) : (calcTexts.result || "Calculation Result: **{result}**");
				return { text: window.ClippyKnowledge.formatString(rawTpl, { result: mathRes }) };
			}
		}

		if (norm.startsWith('find ') || norm.startsWith('search ')) {
			if (!isDeskEnvironment()) {
				return buildDeskOnlyResponse('File System Search');
			}
			const q = rawText.replace(/^(find|search)\s+/i, '').trim();
			if (q) {
				if (window.ClippyAnimator) window.ClippyAnimator.playSequence(['Searching', 'LookLeft', 'LookRight'], { priority: 4, lock: true });
				const hits = window.ClippySystemBridge.searchFiles(q);
				if (hits.length > 0) {
					return {
						text: window.ClippyKnowledge.formatString(fTexts.searchFound || "Found {count} matching item(s) in VFS:", { count: hits.length }),
						actions: hits.slice(0, 4).map(h => ({
							label: h.name,
							onClick: () => { if (window.ShellAssociations) window.ShellAssociations.open(h); }
						}))
					};
				}
				return { text: window.ClippyKnowledge.formatString(fTexts.searchNotFound || "No filesystem entries found for query: \"{query}\".", { query: q }) };
			}
		}

		if (norm.includes('project') || norm.includes('portfolio') || norm.includes('showcase') || norm.includes('projets')) {
			const p = window.ClippySystemBridge.getRandomProject();
			const title = (p && p.title) ? (typeof p.title === 'object' ? (p.title.en || p.title.fr || "Project") : p.title) : "Portfolio";
			const prjTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.projects) || {};
			if (!isDeskEnvironment()) {
				return {
					text: window.ClippyKnowledge.formatString(prjTexts.showcaseStandalone || "Featured project showcase: \"{title}\". Browse the complete interactive portfolio on the desktop experience.", { title }),
					actions: [
						{ label: prjTexts.btnVisit || "Visit Portfolio", onClick: () => { window.open('https://wartets.github.io/', '_blank'); } },
						{ label: prjTexts.btnDesk || "Open Desktop Experience", onClick: () => { window.open('https://wartets.github.io/desk/', '_blank'); } }
					]
				};
			}
			return {
				text: window.ClippyKnowledge.formatString(prjTexts.showcaseDesk || "Featured project showcase: \"{title}\".", { title }),
				actions: [
					{ label: prjTexts.btnOpenFolder || "Open Projects Folder", onClick: () => window.ClippySystemBridge.launchApp('projects') },
					{ label: prjTexts.btnView || "View Project", onClick: () => { if (typeof openProjectWindow === 'function') openProjectWindow(p); } }
				]
			};
		}

		if (window.ClippyBrain) {
			const brainReply = window.ClippyBrain.processChat(rawText, isSuggestion);
			if (brainReply && brainReply.text) {
				return brainReply;
			}
		}

		const fallbackRes = window.ClippyKnowledge.resolve(window.ClippyKnowledge.FALLBACK_RESPONSES, { brain: window.ClippyBrain });
		return {
			text: fallbackRes.text,
			actions: fallbackRes.actions && fallbackRes.actions.length > 0 ? fallbackRes.actions : [
				{ label: "What can you do?", onClick: () => handleUserInput("What can you do?") },
				{ label: "View To-Do List", onClick: () => handleUserInput("View To-Do List") },
				{ label: "Play Tic-Tac-Toe", onClick: () => handleUserInput("Play Tic-Tac-Toe") }
			]
		};
	}

	function renderUserProfileCard(targetRow = null) {
		if (!window.ClippyUI.logElement) return;
		const prof = window.ClippySystemBridge.getUserProfile();
		const ach = window.ClippySystemBridge.getAchievementsSummary();
		const row = targetRow || document.createElement('div');
		if (!targetRow) {
			row.className = 'clippy-message clippy-message-assistant';
		}
		row.innerHTML = '';

		const cTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.cards && window.ClippyKnowledge.SYSTEM_TEXTS.cards.profile) || {};
		const themeStr = window.ClippyKnowledge.formatString(cTexts.themeLabel || "Theme: {theme}", { theme: prof.theme });
		const milesStr = cTexts.milestonesLabel || "Milestones Unlocked:";

		const card = document.createElement('div');
		card.className = 'clippy-profile-card';
		const nicknameLine = prof.activeNickname ? `<div style="font-size: 11px; font-weight: bold; color: #0c2d6b; margin-top: 1px;">Title: ${prof.activeNickname}</div>` : '';
		const archetypeLine = prof.activeArchetype ? `<div style="font-size: 10px; color: #475569; font-style: italic;">Archetype: ${prof.activeArchetype}</div>` : '';
		card.innerHTML = `
			<div class="clippy-profile-header">
				<img src="${prof.userAvatar}" class="clippy-profile-avatar ${prof.avatarShape === 'circle' ? 'circle' : (prof.avatarShape === 'round' ? 'round' : '')}" alt="">
				<div class="clippy-profile-info">
					<strong>${prof.userName}</strong>
					<span>${prof.userJobTitle}</span>
					${nicknameLine}
					${archetypeLine}
					<span style="font-size: 10px; color: #555;">${themeStr}</span>
				</div>
			</div>
			<div class="clippy-profile-stats">
				<div class="clippy-profile-stat-row">
					<span>${milesStr}</span>
					<strong>${ach.unlockedCount} / ${ach.total} (${ach.percentage}%)</strong>
				</div>
				<div class="clippy-ach-progress-bar"><div class="clippy-ach-progress-fill" style="width: ${ach.percentage}%;"></div></div>
			</div>
		`;
		row.appendChild(card);

		const btnBar = document.createElement('div');
		btnBar.className = 'clippy-actions-bar';
		[
			{ label: cTexts.btnIdentity || "Change User Identity", onClick: () => { if (isDeskEnvironment()) window.ClippySystemBridge.launchApp('settings', 'system'); else respondDeskOnlyFeature('User Identity Settings'); } },
			{ label: cTexts.btnMilestones || "Open Milestones", onClick: () => { if (isDeskEnvironment()) window.ClippySystemBridge.launchApp('achievements'); else respondDeskOnlyFeature('Milestones Window'); } },
			{ label: cTexts.btnDisplay || "Display Settings", onClick: () => { if (isDeskEnvironment()) window.ClippySystemBridge.launchApp('display'); else respondDeskOnlyFeature('Display Settings'); } }
		].forEach(act => {
			const btn = document.createElement('button');
			btn.type = 'button';
			btn.className = 'clippy-action-btn';
			btn.textContent = act.label;
			btn.addEventListener('click', act.onClick);
			btnBar.appendChild(btn);
		});

		row.appendChild(btnBar);
		if (!targetRow) {
			window.ClippyUI.logElement.appendChild(row);
		}
		window.ClippyUI.scrollLogToBottom();
	}

	function renderAchievementsList(targetRow = null) {
		if (!window.ClippyUI.logElement) return;
		const ach = window.ClippySystemBridge.getAchievementsSummary();
		const row = targetRow || document.createElement('div');
		if (!targetRow) {
			row.className = 'clippy-message clippy-message-assistant';
		}
		row.innerHTML = '';

		const cTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.cards && window.ClippyKnowledge.SYSTEM_TEXTS.cards.achievements) || {};
		const summaryHdr = window.ClippyKnowledge.formatString(cTexts.summary || "[MILESTONES SUMMARY] <b>Unlocked: {unlocked} / {total} ({percentage}%)</b>", {
			unlocked: ach.unlockedCount,
			total: ach.total,
			percentage: ach.percentage
		});

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

		const container = document.createElement('div');
		container.innerHTML = `
			<div>${summaryHdr}</div>
			<div class="clippy-ach-progress-bar" style="margin: 6px 0;"><div class="clippy-ach-progress-fill" style="width: ${ach.percentage}%;"></div></div>
			<div class="clippy-ach-list">${itemsHtml || `<div style="font-size:11px; color:#666;">${cTexts.empty || 'No milestones unlocked yet. Explore the workstation!'}</div>`}</div>
		`;
		row.appendChild(container);

		const btnBar = document.createElement('div');
		btnBar.className = 'clippy-actions-bar';
		const openBtn = document.createElement('button');
		openBtn.type = 'button';
		openBtn.className = 'clippy-action-btn';
		openBtn.textContent = cTexts.btnOpen || "Open Full Milestones Window";
		openBtn.addEventListener('click', () => { if (isDeskEnvironment()) window.ClippySystemBridge.launchApp('achievements'); else respondDeskOnlyFeature('Milestones Window'); });
		btnBar.appendChild(openBtn);

		row.appendChild(btnBar);
		if (!targetRow) {
			window.ClippyUI.logElement.appendChild(row);
		}
		window.ClippyUI.scrollLogToBottom();
	}

	function renderThemeSelectorCard(targetRow = null) {
		if (!window.ClippyUI.logElement) return;
		const row = targetRow || document.createElement('div');
		if (!targetRow) {
			row.className = 'clippy-message clippy-message-assistant';
		}
		row.innerHTML = '';
		const currentTheme = window.ClippySystemBridge.getSetting('theme') || 'luna-blue';
		const themes = ['luna-blue', 'royale', 'silver', 'olive', 'classic', 'zune', 'noir', 'matrix', 'high-contrast'];
		const thTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.cards && window.ClippyKnowledge.SYSTEM_TEXTS.cards.themes) || {};
		const thCtrl = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.themeControls) || {};

		const hdr = document.createElement('div');
		hdr.innerHTML = window.ClippyKnowledge.formatString(thTexts.header || "[THEME SWITCHER] Active Theme: <b>{theme}</b>", { theme: currentTheme });
		row.appendChild(hdr);

		const grid = document.createElement('div');
		grid.className = 'clippy-actions-bar';
		themes.forEach(t => {
			const b = document.createElement('button');
			b.type = 'button';
			b.className = `clippy-action-btn ${t === currentTheme ? 'active' : ''}`;
			b.textContent = t;
			b.addEventListener('click', () => {
				window.ClippySystemBridge.setTheme(t);
				renderThemeSelectorCard(row);
			});
			grid.appendChild(b);
		});

		row.appendChild(grid);
		if (!targetRow) {
			window.ClippyUI.logElement.appendChild(row);
		}
		window.ClippyUI.scrollLogToBottom();
	}

	async function renderWallpaperSelectorCard(targetRow = null) {
		if (!window.ClippyUI.logElement) return;
		const row = targetRow || document.createElement('div');
		if (!targetRow) {
			row.className = 'clippy-message clippy-message-assistant';
		}
		row.innerHTML = '';
		const wpTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.cards && window.ClippyKnowledge.SYSTEM_TEXTS.cards.wallpapers) || {};
		row.innerHTML = `<div>${wpTexts.loading || "[DESKTOP BACKGROUNDS] Loading wallpaper catalog..."}</div>`;
		if (!targetRow) {
			window.ClippyUI.logElement.appendChild(row);
		}
		window.ClippyUI.scrollLogToBottom();

		const wallpapers = await window.ClippySystemBridge.getAvailableWallpapers();
		row.innerHTML = `<div>${wpTexts.select || "[DESKTOP BACKGROUNDS] Select a background image:"}</div>`;

		const grid = document.createElement('div');
		grid.className = 'clippy-actions-bar';
		(wallpapers || []).slice(0, 6).forEach(wp => {
			const b = document.createElement('button');
			b.type = 'button';
			b.className = 'clippy-action-btn';
			b.textContent = wp.name;
			b.addEventListener('click', () => {
				window.ClippySystemBridge.setWallpaper(wp.path);
			});
			grid.appendChild(b);
		});

		const dispBtn = document.createElement('button');
		dispBtn.type = 'button';
		dispBtn.className = 'clippy-action-btn';
		dispBtn.textContent = wpTexts.btnDisplay || "Open Display Properties...";
		dispBtn.addEventListener('click', () => window.ClippySystemBridge.launchApp('display'));
		grid.appendChild(dispBtn);

		row.appendChild(grid);
		window.ClippyUI.scrollLogToBottom();
	}

	function renderMusicPlayerController(targetRow = null) {
		if (!window.ClippyUI.logElement) return;
		const row = targetRow || document.createElement('div');
		if (!targetRow) {
			row.className = 'clippy-message clippy-message-assistant';
		}
		row.innerHTML = '';
		const track = window.ClippySystemBridge.getNowPlaying();
		const tracks = window.ClippySystemBridge.getMusicTracks();
		const mCards = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.cards && window.ClippyKnowledge.SYSTEM_TEXTS.cards.music) || {};
		const mCtrl = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.musicControls) || {};

		const trackTitle = track ? track.title : (mCards.standbyTitle || 'Audio Player Standby');
		const artistName = track ? (track.artist || mCards.defaultArtist || 'Windows XP Audio') : (mCards.noTrack || 'No track currently active');

		const card = document.createElement('div');
		card.className = 'clippy-music-card';
		card.innerHTML = `
			<div class="clippy-music-header">
				<img src="../assets/images/desk/icons/Music File.webp" style="width:24px;height:24px;" alt="">
				<div style="flex:1; overflow:hidden;">
					<strong>${trackTitle}</strong>
					<div style="font-size:10px; color:#555;">${artistName}</div>
				</div>
			</div>
		`;
		row.appendChild(card);

		const btnBar = document.createElement('div');
		btnBar.className = 'clippy-actions-bar';

		const playBtn = document.createElement('button');
		playBtn.type = 'button';
		playBtn.className = 'clippy-action-btn';
		playBtn.textContent = mCards.btnPlayPause || "Play / Pause";
		playBtn.addEventListener('click', () => {
			window.ClippySystemBridge.toggleMusicPlayback();
			renderMusicPlayerController(row);
		});
		btnBar.appendChild(playBtn);

		const nextBtn = document.createElement('button');
		nextBtn.type = 'button';
		nextBtn.className = 'clippy-action-btn';
		nextBtn.textContent = mCards.btnNext || "Next Track";
		nextBtn.addEventListener('click', () => {
			window.ClippySystemBridge.nextMusicTrack();
			renderMusicPlayerController(row);
		});
		btnBar.appendChild(nextBtn);

		if (tracks.length > 0) {
			const rndBtn = document.createElement('button');
			rndBtn.type = 'button';
			rndBtn.className = 'clippy-action-btn';
			rndBtn.textContent = mCards.btnRandom || "Play Random Track";
			rndBtn.addEventListener('click', () => {
				const rnd = Math.floor(Math.random() * tracks.length);
				window.ClippySystemBridge.playTrackIndex(rnd);
				renderMusicPlayerController(row);
			});
			btnBar.appendChild(rndBtn);
		}

		const openWmpBtn = document.createElement('button');
		openWmpBtn.type = 'button';
		openWmpBtn.className = 'clippy-action-btn';
		openWmpBtn.textContent = mCards.btnWmp || "Open Media Player";
		openWmpBtn.addEventListener('click', () => window.ClippySystemBridge.launchApp('mediaplayer'));
		btnBar.appendChild(openWmpBtn);

		const openWinampBtn = document.createElement('button');
		openWinampBtn.type = 'button';
		openWinampBtn.className = 'clippy-action-btn';
		openWinampBtn.textContent = mCards.btnWinamp || "Open Winamp";
		openWinampBtn.addEventListener('click', () => window.ClippySystemBridge.launchApp('winamp'));
		btnBar.appendChild(openWinampBtn);

		row.appendChild(btnBar);
		if (!targetRow) {
			window.ClippyUI.logElement.appendChild(row);
		}
		window.ClippyUI.scrollLogToBottom();
	}

	function renderActiveWindowsList(targetRow = null) {
		if (!window.ClippyUI.logElement) return;
		const row = targetRow || document.createElement('div');
		if (!targetRow) {
			row.className = 'clippy-message clippy-message-assistant';
		}
		row.innerHTML = '';

		const windowsMap = (window.WindowManager && window.WindowManager.windows) ? window.WindowManager.windows : {};
		const winList = Object.values(windowsMap).filter(w => !w.classList.contains('xp-modal-overlay'));
		const wTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.cards && window.ClippyKnowledge.SYSTEM_TEXTS.cards.activeWindows) || {};

		const hdr = document.createElement('div');
		hdr.innerHTML = window.ClippyKnowledge.formatString(wTexts.header || "[PROCESS INSPECTOR] <b>Active Windows ({count}):</b>", { count: winList.length });
		row.appendChild(hdr);

		if (winList.length === 0) {
			const emptyMsg = document.createElement('div');
			emptyMsg.textContent = wTexts.empty || "No active application windows on the desktop.";
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
				focusBtn.textContent = isMin ? (wTexts.btnRestore || 'Restore') : (wTexts.btnFocus || 'Focus');
				focusBtn.addEventListener('click', () => {
					window.ClippySystemBridge.focusWindow(w.id);
					renderActiveWindowsList(row);
				});
				item.appendChild(focusBtn);

				const closeBtn = document.createElement('button');
				closeBtn.type = 'button';
				closeBtn.className = 'clippy-action-btn';
				closeBtn.textContent = wTexts.btnClose || 'Close';
				closeBtn.addEventListener('click', () => {
					if (window.WindowManager) window.WindowManager.close(w, w.id);
					renderActiveWindowsList(row);
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
		minAllBtn.textContent = wTexts.btnMinAll || 'Minimize All';
		minAllBtn.addEventListener('click', () => {
			window.ClippySystemBridge.minimizeAllWindows();
			renderActiveWindowsList(row);
		});
		btnBar.appendChild(minAllBtn);

		const cascadeBtn = document.createElement('button');
		cascadeBtn.type = 'button';
		cascadeBtn.className = 'clippy-action-btn';
		cascadeBtn.textContent = wTexts.btnCascade || 'Cascade';
		cascadeBtn.addEventListener('click', () => {
			window.ClippySystemBridge.cascadeWindows();
			renderActiveWindowsList(row);
		});
		btnBar.appendChild(cascadeBtn);

		const tileBtn = document.createElement('button');
		tileBtn.type = 'button';
		tileBtn.className = 'clippy-action-btn';
		tileBtn.textContent = wTexts.btnTile || 'Tile';
		tileBtn.addEventListener('click', () => {
			window.ClippySystemBridge.tileWindows(true);
			renderActiveWindowsList(row);
		});
		btnBar.appendChild(tileBtn);

		row.appendChild(btnBar);
		if (!targetRow) {
			window.ClippyUI.logElement.appendChild(row);
		}
		window.ClippyUI.scrollLogToBottom();
	}

	function renderFileListCard(path = '/', targetRow = null) {
		if (!window.ClippyUI.logElement) return;
		const row = targetRow || document.createElement('div');
		if (!targetRow) {
			row.className = 'clippy-message clippy-message-assistant';
		}
		row.innerHTML = '';

		const files = window.ClippySystemBridge.listFiles(path);
		const fCards = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.cards && window.ClippyKnowledge.SYSTEM_TEXTS.cards.files) || {};
		const fControls = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.fileControls) || {};

		const hdr = document.createElement('div');
		hdr.innerHTML = window.ClippyKnowledge.formatString(fCards.header || "[FILE SYSTEM] <b>Directory: {path} ({count} items)</b>", { path, count: files.length });
		row.appendChild(hdr);

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
			openBtn.textContent = fCards.btnOpen || 'Open';
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
		openExplorerBtn.textContent = fCards.btnExplorer || 'Open in File Explorer';
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
		newFileBtn.textContent = fCards.btnNewNote || 'Create Text Note';
		newFileBtn.addEventListener('click', () => {
			const newF = window.ClippySystemBridge.createDesktopFile(`Note_${Date.now().toString().slice(-4)}.txt`, 'Created with Clippy');
			if (newF) {
				renderFileListCard(path, row);
			}
		});
		btnBar.appendChild(newFileBtn);

		row.appendChild(btnBar);
		if (!targetRow) {
			window.ClippyUI.logElement.appendChild(row);
		}
		window.ClippyUI.scrollLogToBottom();
	}

	function renderMailListCard(targetRow = null) {
		if (!window.ClippyUI.logElement) return;
		const row = targetRow || document.createElement('div');
		if (!targetRow) {
			row.className = 'clippy-message clippy-message-assistant';
		}
		row.innerHTML = '';

		const unreadCount = window.ClippySystemBridge.getUnreadMailCount();
		const msgs = window.ClippySystemBridge.getMailMessages('inbox');
		const mCards = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.cards && window.ClippyKnowledge.SYSTEM_TEXTS.cards.mail) || {};
		const mCtrl = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.mailControls) || {};

		const headerText = window.ClippyKnowledge.formatString
			? window.ClippyKnowledge.formatString(mCtrl.header || "[OUTLOOK EXPRESS] <b>Inbox ({unread} unread / {total} total):</b>", { unread: unreadCount, total: msgs.length })
			: `[OUTLOOK EXPRESS] <b>Inbox (${unreadCount} unread / ${msgs.length} total):</b>`;

		const hdr = document.createElement('div');
		hdr.innerHTML = headerText;
		row.appendChild(hdr);

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
				renderMailListCard(row);
			});
			listContainer.appendChild(item);
		});

		row.appendChild(listContainer);

		const btnBar = document.createElement('div');
		btnBar.className = 'clippy-actions-bar';

		const openOeBtn = document.createElement('button');
		openOeBtn.type = 'button';
		openOeBtn.className = 'clippy-action-btn';
		openOeBtn.textContent = mCards.btnOpen || 'Open Outlook Express';
		openOeBtn.addEventListener('click', () => window.ClippySystemBridge.launchApp('outlook'));
		btnBar.appendChild(openOeBtn);

		const syncBtn = document.createElement('button');
		syncBtn.type = 'button';
		syncBtn.className = 'clippy-action-btn';
		syncBtn.textContent = mCards.btnSync || 'Send / Receive';
		syncBtn.addEventListener('click', () => {
			if (window.MailStore) {
				window.MailStore.ensureDailyContent().then(() => {
					renderMailListCard(row);
				});
			}
		});
		btnBar.appendChild(syncBtn);

		row.appendChild(btnBar);
		if (!targetRow) {
			window.ClippyUI.logElement.appendChild(row);
		}
		window.ClippyUI.scrollLogToBottom();
	}

	function renderVolumeControllerCard(targetRow = null) {
		if (!window.ClippyUI.logElement) return;
		const row = targetRow || document.createElement('div');
		if (!targetRow) {
			row.className = 'clippy-message clippy-message-assistant';
		}
		row.innerHTML = '';

		const currentVol = window.ClippySystemBridge.getVolume();
		const isMuted = window.ClippySystemBridge.isMuted();
		const vCards = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.cards && window.ClippyKnowledge.SYSTEM_TEXTS.cards.volume) || {};

		const mutedNotice = isMuted ? (vCards.muted || '(Muted)') : '';
		const headerText = window.ClippyKnowledge.formatString
			? window.ClippyKnowledge.formatString(vCards.header || "[AUDIO SYNTHESIZER] Master Volume: <b>{volume}%</b> {status}", { volume: Math.round(currentVol * 100), status: mutedNotice })
			: `[AUDIO SYNTHESIZER] Master Volume: <b>${Math.round(currentVol * 100)}%</b> ${mutedNotice}`;

		const hdr = document.createElement('div');
		hdr.innerHTML = headerText;
		row.appendChild(hdr);

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
			window.ClippySystemBridge.setVolume(slider.value);
			const isMutedNow = window.ClippySystemBridge.isMuted();
			const mutedNoticeNow = isMutedNow ? (vCards.muted || '(Muted)') : '';
			const curPct = Math.round(parseFloat(slider.value) * 100);
			hdr.innerHTML = window.ClippyKnowledge.formatString
				? window.ClippyKnowledge.formatString(vCards.header || "[AUDIO SYNTHESIZER] Master Volume: <b>{volume}%</b> {status}", { volume: curPct, status: mutedNoticeNow })
				: `[AUDIO SYNTHESIZER] Master Volume: <b>${curPct}%</b> ${mutedNoticeNow}`;
			if (window.SettingsApp && window.SettingsApp.playSound) window.SettingsApp.playSound('click');
		});

		sliderRow.appendChild(slider);
		row.appendChild(sliderRow);

		const btnBar = document.createElement('div');
		btnBar.className = 'clippy-actions-bar';

		const muteBtn = document.createElement('button');
		muteBtn.type = 'button';
		muteBtn.className = 'clippy-action-btn';
		muteBtn.textContent = isMuted ? (vCards.btnUnmute || 'Unmute Audio') : (vCards.btnMute || 'Mute Audio');
		muteBtn.addEventListener('click', () => {
			window.ClippySystemBridge.toggleMute();
			renderVolumeControllerCard(row);
		});
		btnBar.appendChild(muteBtn);

		const testSndBtn = document.createElement('button');
		testSndBtn.type = 'button';
		testSndBtn.className = 'clippy-action-btn';
		testSndBtn.textContent = vCards.btnTest || 'Test Chime';
		testSndBtn.addEventListener('click', () => {
			if (window.SettingsApp && window.SettingsApp.playSound) window.SettingsApp.playSound('startup');
		});
		btnBar.appendChild(testSndBtn);

		row.appendChild(btnBar);
		if (!targetRow) {
			window.ClippyUI.logElement.appendChild(row);
		}
		window.ClippyUI.scrollLogToBottom();
	}

	function renderSystemToolsCard(targetRow = null) {
		if (!window.ClippyUI.logElement) return;
		const row = targetRow || document.createElement('div');
		if (!targetRow) {
			row.className = 'clippy-message clippy-message-assistant';
		}
		row.innerHTML = '';
		const toolsCfg = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.systemTools) || {
			header: "[SYSTEM UTILITIES] <b>Diagnostic and Maintenance Tools:</b>",
			btnSpecs: "System Specs",
			btnDefrag: "Defragment Drive C:",
			btnWindows: "Inspect Windows",
			btnBin: "Recycle Bin",
			btnShortcuts: "Keyboard Shortcuts"
		};

		row.innerHTML = `<div>${toolsCfg.header}</div>`;

		const btnBar = document.createElement('div');
		btnBar.className = 'clippy-actions-bar';
		[
			{ label: toolsCfg.btnSpecs, onClick: () => executeActionTrigger('action_status') },
			{ label: toolsCfg.btnDefrag, onClick: () => executeActionTrigger('action_defrag') },
			{ label: toolsCfg.btnWindows, onClick: () => executeActionTrigger('action_inspect_windows') },
			{ label: toolsCfg.btnBin, onClick: () => executeActionTrigger('action_inspect_bin') },
			{ label: toolsCfg.btnShortcuts, onClick: () => executeActionTrigger('action_shortcuts') }
		].forEach(act => {
			const b = document.createElement('button');
			b.type = 'button';
			b.className = 'clippy-action-btn';
			b.textContent = act.label;
			b.addEventListener('click', act.onClick);
			btnBar.appendChild(b);
		});

		row.appendChild(btnBar);
		if (!targetRow) {
			window.ClippyUI.logElement.appendChild(row);
		}
		window.ClippyUI.scrollLogToBottom();
	}

	function startIdleDaemon() {
		if (idleTimer) clearInterval(idleTimer);
		const intervalMs = (window.SettingsApp && window.SettingsApp.get('clippyProactiveInterval')) 
			? (window.SettingsApp.get('clippyProactiveInterval') * 1000) 
			: IDLE_MESSAGE_INTERVAL_MS;

		idleTimer = setInterval(() => {
			if (window.ClippyUI.isOpen) return;
			if (Math.random() > IDLE_MESSAGE_CHANCE) return;

			const unread = isDeskEnvironment() ? window.ClippySystemBridge.getUnreadMailCount() : 0;
			const openWinsCount = isDeskEnvironment() ? window.ClippySystemBridge.getOpenWindowCount() : 0;
			const recycleCount = isDeskEnvironment() ? window.ClippySystemBridge.getRecycleBinCount() : 0;

			const idleTexts = (window.ClippyKnowledge && window.ClippyKnowledge.SYSTEM_TEXTS && window.ClippyKnowledge.SYSTEM_TEXTS.idle) || {};

			if (unread > 0) {
				const msg = window.ClippyKnowledge.formatString(idleTexts.unreadMail || "You have {count} unread email(s) waiting in Outlook Express!", { count: unread });
				window.ClippyUI.showIdleBubble(msg, () => {
					window.ClippyAgent.open();
					window.ClippyAgent.prompt("Check unread emails");
				});
				return;
			}

			if (recycleCount >= 4 && Math.random() < 0.4) {
				const msg = window.ClippyKnowledge.formatString(idleTexts.recycleBin || "The Recycle Bin has {count} items. Would you like me to empty it or explain quantum information loss?", { count: recycleCount });
				window.ClippyUI.showIdleBubble(msg, () => {
					window.ClippyAgent.open();
					window.ClippyAgent.prompt("Quantum Recycle Bin theory");
				});
				return;
			}

			if (openWinsCount >= 3 && Math.random() < 0.4) {
				const msg = window.ClippyKnowledge.formatString(idleTexts.activeWindows || "You have {count} active windows. Would you like me to tile or cascade them?", { count: openWinsCount });
				window.ClippyUI.showIdleBubble(msg, () => {
					window.ClippyAgent.open();
					window.ClippyAgent.prompt("Inspect active windows");
				});
				return;
			}

			if (window.ClippyBrain && window.ClippyBrain.memory && window.ClippyBrain.memory.recentDisclosedTopic && Math.random() < 0.4) {
				const recentTopic = window.ClippyBrain.memory.recentDisclosedTopic;
				const shortenedTopic = recentTopic.length > 45 ? recentTopic.substring(0, 42) + '...' : recentTopic;
				const followUpText = `How is progress coming along with "${shortenedTopic}"? Let me know if you would like to structure tasks or take a short breather!`;
				window.ClippyUI.showIdleBubble(followUpText, () => {
					window.ClippyAgent.open();
					window.ClippyAgent.prompt("View To-Do List");
				});
				return;
			}

			const hour = new Date().getHours();
			const currentEnv = isDeskEnvironment() ? 'desk' : 'standalone';
			const currentMood = (window.ClippyBrain && typeof window.ClippyBrain.getMood === 'function') ? window.ClippyBrain.getMood() : 'OPTIMISTIC';

			if ((hour >= 22 || hour < 5) && window.ClippyKnowledge && window.ClippyKnowledge.PROACTIVE_BUBBLE_TEMPLATES && window.ClippyKnowledge.PROACTIVE_BUBBLE_TEMPLATES.user_late_night && Math.random() < 0.5) {
				const lateTemplates = window.ClippyKnowledge.PROACTIVE_BUBBLE_TEMPLATES.user_late_night;
				const chosenLate = pickFrom(lateTemplates);
				if (chosenLate && chosenLate.text) {
					window.ClippyUI.showIdleBubble(chosenLate.text, () => {
						window.ClippyAgent.open();
						if (chosenLate.prompt) window.ClippyAgent.prompt(chosenLate.prompt);
						else if (chosenLate.action) window.ClippyAgent.executeAction(chosenLate.action);
					});
					return;
				}
			}

			if (hour >= 5 && hour < 11 && window.ClippyKnowledge && window.ClippyKnowledge.PROACTIVE_BUBBLE_TEMPLATES && window.ClippyKnowledge.PROACTIVE_BUBBLE_TEMPLATES.user_early_morning && Math.random() < 0.4) {
				const morningTemplates = window.ClippyKnowledge.PROACTIVE_BUBBLE_TEMPLATES.user_early_morning;
				const chosenMorning = pickFrom(morningTemplates);
				if (chosenMorning && chosenMorning.text) {
					window.ClippyUI.showIdleBubble(chosenMorning.text, () => {
						window.ClippyAgent.open();
						if (chosenMorning.prompt) window.ClippyAgent.prompt(chosenMorning.prompt);
						else if (chosenMorning.action) window.ClippyAgent.executeAction(chosenMorning.action);
					});
					return;
				}
			}

			const idleTemplates = (window.ClippyKnowledge && window.ClippyKnowledge.PROACTIVE_BUBBLE_TEMPLATES && window.ClippyKnowledge.PROACTIVE_BUBBLE_TEMPLATES.idle_long) || [];
			if (idleTemplates.length > 0) {
				const eligible = idleTemplates.filter(t => {
					if (!t) return false;
					if (t.criteria) {
						if (t.criteria.environments && !t.criteria.environments.includes(currentEnv)) return false;
						if (t.criteria.moods && !t.criteria.moods.includes(currentMood)) return false;
					}
					if (t.environment && t.environment !== currentEnv) return false;
					if (t.environments && !t.environments.includes(currentEnv)) return false;
					return true;
				});
				const chosenList = eligible.length > 0 ? eligible : idleTemplates;
				const chosen = pickFrom(chosenList);
				const bubbleText = typeof chosen.text === 'object' && chosen.text !== null
					? ((window.ClippyKnowledge && window.ClippyKnowledge.resolveTextVariant) ? window.ClippyKnowledge.resolveTextVariant(chosen.text, { brain: window.ClippyBrain, mood: currentMood, environment: currentEnv }) : (chosen.text.default || ''))
					: String(chosen.text || '');

				if (bubbleText) {
					window.ClippyUI.showIdleBubble(bubbleText, () => {
						window.ClippyAgent.open();
						if (chosen.prompt) window.ClippyAgent.prompt(chosen.prompt);
						else if (chosen.action) window.ClippyAgent.executeAction(chosen.action);
					});
					return;
				}
			}

			if (window.ClippyAnimator) {
				window.ClippyAnimator.playForMood(currentMood, 'idle');
			}
			const idlePool = idleTexts.pool || [
				"Need a hand with your tasks or want to discuss a new idea? Click me anytime!",
				"It looks like you're exploring the desktop. Let me know if you need assistance!",
				"Your 32-bit companion is standing by on the taskbar. Click to chat or play a game!",
				"Curious about retro computing trivia or physical constants? I am ready to assist!",
				"Remember to stay hydrated and take brief breaks during long workstation sessions."
			];
			window.ClippyUI.showIdleBubble(pickFrom(idlePool));
		}, intervalMs);
	}

	function openAssistant() {
		const isFirstBuild = !window.ClippyUI.popupElement;
		window.ClippyUI.buildPopup(
			(text, isSug) => handleUserInput(text, isSug),
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
		if (window.ClippyAnimator) {
			window.ClippyAnimator.play('GoodBye', { priority: 6, lock: true }).then(() => {
				window.ClippyUI.close();
			});
		} else {
			window.ClippyUI.close();
		}
		if (chatMarathonTimer) {
			clearInterval(chatMarathonTimer);
			chatMarathonTimer = null;
		}
	}

	function renderInitialGreeting() {
		if (window.ClippyAnimator) {
			window.ClippyAnimator.play('Greeting', { priority: 5, lock: true });
		}
		if (window.ClippyBrain && typeof window.ClippyBrain.navigateGraphNode === 'function') {
			const entry = window.ClippyBrain.navigateGraphNode('greeting_root');
			const actions = window.ClippyBrain.buildGraphActions(entry.options);
			window.ClippyUI.appendAssistantMessage(entry.text, actions);
			if (entry.options && Array.isArray(entry.options) && entry.options.length > 0) {
				window.ClippyUI.updateSuggestions(entry.options.map(o => o.label));
			}
		}
	}

	function init() {
		if (window.ClippyAnimator) {
			window.ClippyAnimator.preloadKeyAnimations();
		}
		startIdleDaemon();

		window.addEventListener('offline', () => {
			const k = window.ClippyKnowledge || {};
			const res = k.resolve(k.OFFLINE_ALERTS, { brain: window.ClippyBrain });
			if (window.ClippyUI && res && res.text) {
				window.ClippyUI.showIdleBubble(res.text, () => {
					window.ClippyAgent.open();
					if (res.actionTrigger) executeActionTrigger(res.actionTrigger);
				});
			}
		});

		window.addEventListener('online', () => {
			const k = window.ClippyKnowledge || {};
			const res = k.resolve(k.ONLINE_ALERTS, { brain: window.ClippyBrain });
			if (window.ClippyUI && res && res.text) {
				window.ClippyUI.showIdleBubble(res.text);
			}
		});
	}

	function startCountSequence(targetNumber) {
		const target = Math.max(1, Math.min(12, parseInt(targetNumber, 10) || 5));
		let current = 1;
		const k = window.ClippyKnowledge || {};

		const deliverCount = () => {
			if (current > target) {
				const doneRes = k.resolve(k.COUNT_COMPLETION_PHRASES, { brain: window.ClippyBrain, vars: { target } });
				window.ClippyUI.appendAssistantMessage(doneRes.text, [
					{ label: "View To-Do List", onClick: () => handleUserInput("View To-Do List") },
					{ label: "What can you do?", onClick: () => handleUserInput("What can you do?") }
				]);
				return;
			}

			let suffix = '';
			let pauseDelay = 400 + (current * 180);
			const progressSuffs = k.COUNT_PROGRESS_PHRASES || {};
			if (current > 9 && progressSuffs.late) suffix = progressSuffs.late;
			else if (current > 6 && progressSuffs.mid) suffix = progressSuffs.mid;

			window.ClippyUI.appendAssistantMessage(`**${current}**...${suffix}`);
			current++;
			setTimeout(deliverCount, pauseDelay);
		};

		deliverCount();
	}

	function notifyGameEnded(gameTitle, resultSummary, restartCallback) {
		setTimeout(() => {
			const isWin = resultSummary && (resultSummary.toLowerCase().includes('win') || resultSummary.toLowerCase().includes('victory') || resultSummary.toLowerCase().includes('cleared') || resultSummary.toLowerCase().includes('100%'));
			if (window.ClippyAnimator) {
				if (isWin) {
					window.ClippyAnimator.play('Congratulate', { priority: 4, lock: true });
				} else {
					window.ClippyAnimator.play('IdleHeadScratch', { priority: 4, lock: true });
				}
			}
			const k = window.ClippyKnowledge || {};
			const cfg = (k.SYSTEM_TEXTS && k.SYSTEM_TEXTS.gameEnded) || {
				prompt: "Round completed in **{game}** ({result}). Would you like to play another round?",
				btnYes: "Yes, play another {game}",
				btnNo: "No, let's do something else",
				userYes: "Yes, let's play {game} again.",
				userNo: "No, let's explore other topics.",
				whatNext: "Understood! What would you like to focus on now?"
			};
			const promptText = k.formatString ? k.formatString(cfg.prompt, { game: gameTitle, result: resultSummary }) : `Round completed in **${gameTitle}**.`;
			const btnYesText = k.formatString ? k.formatString(cfg.btnYes, { game: gameTitle }) : "Play again";
			const userYesText = k.formatString ? k.formatString(cfg.userYes, { game: gameTitle }) : "Play again";

			window.ClippyUI.appendAssistantMessage(promptText, [
				{
					label: btnYesText,
					onClick: () => {
						window.ClippyUI.appendUserMessage(userYesText);
						setTimeout(() => {
							if (typeof restartCallback === 'function') restartCallback();
						}, 200);
					}
				},
				{
					label: cfg.btnNo,
					onClick: () => {
						window.ClippyUI.appendUserMessage(cfg.userNo);
						setTimeout(() => {
							window.ClippyUI.appendAssistantMessage(cfg.whatNext, [
								{ label: "View To-Do List", onClick: () => handleUserInput("View To-Do List") },
								{ label: "System Diagnostics", onClick: () => handleUserInput("System diagnostics") },
								{ label: "Tell me a joke", onClick: () => handleUserInput("Tell me a joke") },
								{ label: "What can you do?", onClick: () => handleUserInput("What can you do?") }
							]);
						}, 200);
					}
				}
			]);
		}, 400);
	}

	window.ClippyAgent = {
		init,
		open: openAssistant,
		close: closeAssistant,
		startCountSequence,
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
		notifyGameEnded,
		notify: (text) => window.ClippyUI.showIdleBubble(text),
		selectGraphOption: (opt) => {
			if (!opt || isThinking) return;
			if (window.ClippyUI && window.ClippyUI.isTyping && window.ClippyUI.currentTypeInterval) {
				clearTimeout(window.ClippyUI.currentTypeInterval);
				window.ClippyUI.currentTypeInterval = null;
				if (window.ClippyUI.activeMessageFinalizer) {
					window.ClippyUI.activeMessageFinalizer();
					window.ClippyUI.activeMessageFinalizer = null;
				}
				window.ClippyUI.isTyping = false;
			}

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
					if (result.options && Array.isArray(result.options) && result.options.length > 0) {
						window.ClippyUI.updateSuggestions(result.options.map(o => o.label));
					}
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
