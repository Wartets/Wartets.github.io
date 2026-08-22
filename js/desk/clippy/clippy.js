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
		if (!rawText || isThinking || (window.ClippyUI && window.ClippyUI.isTyping)) return;
		window.ClippyUI.appendUserMessage(rawText);
		isThinking = true;
		window.ClippyUI.setVisualState('think');

		setTimeout(() => {
			let response = null;
			try {
				response = processDispatch(rawText);
			} catch (e) {
				response = { text: pickFrom(window.ClippyKnowledge ? window.ClippyKnowledge.FALLBACK_RESPONSES : []) };
			}
			isThinking = false;

			if (response && response.text) {
				window.ClippyUI.appendAssistantMessage(response.text, response.actions, () => {
					if (response.actionTrigger) {
						executeActionTrigger(response.actionTrigger);
					}
				});
			}
		}, 200 + Math.random() * 200);
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
		} else if (actionId === 'action_defrag') {
			startDefrag();
		} else if (actionId === 'action_trivia') {
			window.ClippyUI.appendAssistantMessage(pickFrom(window.ClippyKnowledge.TRIVIA));
		} else if (actionId === 'action_joke') {
			window.ClippyUI.appendAssistantMessage(pickFrom(window.ClippyKnowledge.JOKES));
		} else if (actionId === 'action_status') {
			window.ClippyUI.appendAssistantMessage(window.ClippySystemBridge.getSystemSpecs());
		} else if (actionId === 'action_pass') {
			const pwd = window.ClippyActivities.generatePassword(16);
			window.ClippyUI.appendAssistantMessage(`Generated Secure Password (16 chars):\n**\`${pwd}\`**`);
		}
	}

	function processDispatch(rawText) {
		const norm = rawText.toLowerCase().trim();

		if (activeGameContext === 'guess' && /^\d+$/.test(norm)) {
			handleGuessInput(parseInt(norm, 10));
			return null;
		}
		if (activeGameContext === 'hangman' && /^[a-zA-Z]$/.test(norm)) {
			handleHangmanInput(norm.toUpperCase());
			return null;
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
		if (norm === 'todo' || norm === 'todos' || norm === 'task' || norm === 'tasks' || norm === 'view to-do list') {
			renderTodoList();
			return null;
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

		if (norm.startsWith('timer ') || norm.startsWith('pomodoro') || norm.startsWith('start pomodoro timer')) {
			const match = norm.match(/\d+/);
			const mins = match ? parseInt(match[0], 10) : 25;
			startPomodoro(mins);
			return null;
		}

		if (norm.startsWith('password') || norm.startsWith('pass') || norm.includes('generate secure password')) {
			const match = norm.match(/\d+/);
			const len = match ? parseInt(match[0], 10) : 14;
			const pwd = window.ClippyActivities.generatePassword(len);
			return { text: `Generated Secure Password (${len} chars):\n**\`${pwd}\`**` };
		}

		const conv = window.ClippyActivities.parseUnitConversion(rawText);
		if (conv) {
			return { text: `Unit Conversion Result: **${conv}**` };
		}

		if (norm.startsWith('calc ') || norm.startsWith('calculate ') || /^[\d\s\+\-\*\/\(\)\.\^\%]+$/.test(norm)) {
			const exp = norm.replace(/^(calc|calculate)\s+/i, '');
			const mathRes = window.ClippyActivities.evaluateMathExpression(exp);
			if (mathRes !== null) {
				return { text: `Calculation: ${exp} = **${mathRes}**` };
			}
		}

		if (window.ClippyBrain) {
			const brainReply = window.ClippyBrain.processChat(rawText);
			if (brainReply && brainReply.text) {
				return brainReply;
			}
		}

		if (norm.includes('mail') || norm.includes('email') || norm.includes('outlook') || norm.includes('unread')) {
			const unread = window.ClippySystemBridge.getUnreadMailCount();
			return {
				text: unread > 0 ? `You have ${unread} unread message(s) waiting in Outlook Express!` : "Your inbox is completely up to date. Zero unread messages!",
				actions: [{ label: "Open Mail", onClick: () => window.ClippySystemBridge.launchApp('outlook') }]
			};
		}
		if (norm.includes('project') || norm.includes('portfolio') || norm.includes('showcase')) {
			const p = window.ClippySystemBridge.getRandomProject();
			const title = (p && p.title) ? (typeof p.title === 'object' ? (p.title.en || p.title.fr || "Project") : p.title) : "Portfolio";
			return {
				text: `Featured project showcase: "${title}".`,
				actions: [{ label: "Open Projects", onClick: () => window.ClippySystemBridge.launchApp('projects') }]
			};
		}
		if (norm.includes('recycle') || norm.includes('trash') || norm.includes('corbeille')) {
			const count = window.ClippySystemBridge.getRecycleBinCount();
			return {
				text: count > 0 ? `The Recycle Bin holds ${count} deleted item(s).` : "The Recycle Bin is completely empty.",
				actions: [
					{ label: "Open Recycle Bin", onClick: () => window.ClippySystemBridge.launchApp('recyclebin') },
					{ label: "Empty Bin", onClick: () => { window.ClippySystemBridge.emptyRecycleBin(); window.ClippyUI.appendAssistantMessage("Recycle Bin emptied successfully."); } }
				]
			};
		}
		if (norm.includes('defrag') || norm.includes('defragment')) {
			startDefrag();
			return null;
		}
		if (norm.includes('pet') || norm.includes('tamagotchi')) {
			handlePetAction('status');
			return null;
		}
		if (norm.includes('memory') || norm.includes('pairs')) {
			startMemory();
			return null;
		}
		if (norm.includes('hangman') || norm.includes('pendu')) {
			startHangman();
			return null;
		}
		if (norm.includes('tic tac toe') || norm.includes('tictactoe') || norm.includes('morpion')) {
			startTicTacToe();
			return null;
		}
		if (norm.includes('quiz') || norm.includes('trivia quiz')) {
			startQuiz();
			return null;
		}
		if (norm.includes('guess the number') || norm.includes('guess number')) {
			startGuess();
			return null;
		}
		if (norm.includes('rock paper scissors') || norm.includes('rps') || norm.includes('chifoumi')) {
			return startRPS();
		}
		if (norm.includes('joke') || norm.includes('blague')) {
			return { text: pickFrom(window.ClippyKnowledge ? window.ClippyKnowledge.JOKES : []) };
		}
		if (norm.includes('trivia') || norm.includes('fact')) {
			return { text: pickFrom(window.ClippyKnowledge ? window.ClippyKnowledge.TRIVIA : []) };
		}
		if (norm.includes('shortcut') || norm.includes('hotkey')) {
			return { text: (window.ClippyKnowledge ? window.ClippyKnowledge.SHORTCUTS : []).join('\n') };
		}
		if (norm.includes('diagnostic') || norm.includes('specs') || norm.includes('status')) {
			return { text: window.ClippySystemBridge.getSystemSpecs() };
		}

		return { text: pickFrom(window.ClippyKnowledge ? window.ClippyKnowledge.FALLBACK_RESPONSES : []) };
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
