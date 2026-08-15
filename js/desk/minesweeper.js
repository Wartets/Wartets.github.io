/**
 * Windows XP Minesweeper Engine
 */
(function () {
	const STORAGE_KEY_SCORES = 'xp_minesweeper_scores';
	const STORAGE_KEY_CONFIG = 'xp_minesweeper_config';

	const PRESETS = {
		beginner: { rows: 9, cols: 9, mines: 10, label: 'Beginner', width: 202, height: 298 },
		intermediate: { rows: 16, cols: 16, mines: 40, label: 'Intermediate', width: 314, height: 410 },
		expert: { rows: 16, cols: 30, mines: 99, label: 'Expert', width: 538, height: 410 }
	};

	const DEFAULT_SCORES = {
		beginner: { time: 999, name: 'Anonymous' },
		intermediate: { time: 999, name: 'Anonymous' },
		expert: { time: 999, name: 'Anonymous' }
	};

	let gameState = {
		difficulty: 'beginner',
		rows: 9,
		cols: 9,
		minesCount: 10,
		marksEnabled: true,
		soundEnabled: true,
		grid: [],
		status: 'ready',
		minesRemaining: 10,
		timer: 0,
		timerInterval: null,
		firstClick: true,
		activeWin: null
	};

	function loadScores() {
		try {
			const saved = localStorage.getItem(STORAGE_KEY_SCORES);
			return saved ? { ...DEFAULT_SCORES, ...JSON.parse(saved) } : { ...DEFAULT_SCORES };
		} catch (e) {
			return { ...DEFAULT_SCORES };
		}
	}

	function saveScores(scores) {
		try {
			localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(scores));
		} catch (e) {}
	}

	function loadConfig() {
		try {
			const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
			return saved ? JSON.parse(saved) : { difficulty: 'beginner', marksEnabled: true, soundEnabled: true, custom: { rows: 9, cols: 9, mines: 10 } };
		} catch (e) {
			return { difficulty: 'beginner', marksEnabled: true, soundEnabled: true, custom: { rows: 9, cols: 9, mines: 10 } };
		}
	}

	function saveConfig(cfg) {
		try {
			localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(cfg));
		} catch (e) {}
	}

	function playSound(name) {
		if (!gameState.soundEnabled) return;
		if (window.SettingsApp && window.SettingsApp.playSound) {
			if (name === 'win') window.SettingsApp.playSound('startup');
			else if (name === 'lose') window.SettingsApp.playSound('error');
			else if (name === 'click') window.SettingsApp.playSound('click');
		}
	}

	function openMinesweeper() {
		const id = 'window-minesweeper';
		const existing = document.getElementById(id);
		if (existing) {
			if (typeof bringWindowToFront === 'function') bringWindowToFront(existing);
			if (existing.classList.contains('minimized') && typeof unminimizeWindow === 'function') {
				unminimizeWindow(existing);
			}
			return existing;
		}

		const cfg = loadConfig();
		gameState.difficulty = cfg.difficulty || 'beginner';
		gameState.marksEnabled = cfg.marksEnabled !== false;
		gameState.soundEnabled = cfg.soundEnabled !== false;

		applyDifficultySettings(gameState.difficulty, cfg.custom);

		const dims = getWindowDimensions();
		const contentHTML = `
			<div class="minesweeper-layout">
				<div class="minesweeper-menu-bar">
					<div class="minesweeper-menu-item" id="ms-menu-game"><u>G</u>ame</div>
					<div class="minesweeper-menu-item" id="ms-menu-help"><u>H</u>elp</div>
				</div>
				<div class="minesweeper-window-body">
					<div class="minesweeper-outer-border">
						<div class="minesweeper-header-panel">
							<div class="minesweeper-digital-display" id="ms-mines-left">010</div>
							<button type="button" class="minesweeper-face-button" id="ms-face-btn" title="Restart game">
								<span class="ms-face-icon" id="ms-face-icon">🙂</span>
							</button>
							<div class="minesweeper-digital-display" id="ms-timer">000</div>
						</div>
						<div class="minesweeper-grid-panel">
							<div class="minesweeper-board" id="ms-board"></div>
						</div>
					</div>
				</div>
			</div>
		`;

		const win = createXPWindow(id, 'Minesweeper', contentHTML, dims.width, dims.height, {
			resizable: false,
			iconSrc: '../assets/images/desk/icons/Minesweeper.webp'
		});

		win.classList.add('minesweeper-app-window');
		win.style.width = `${dims.width}px`;
		win.style.height = `${dims.height}px`;
		win.querySelector('.xp-window-content').style.padding = '0';
		win.querySelector('.xp-window-content').style.overflow = 'hidden';

		gameState.activeWin = win;
		bindWindowEvents(win);
		resetGame();

		return win;
	}

	function getWindowDimensions() {
		if (PRESETS[gameState.difficulty]) {
			return { width: PRESETS[gameState.difficulty].width, height: PRESETS[gameState.difficulty].height };
		}
		const w = Math.max(198, gameState.cols * 16 + 40);
		const h = Math.max(270, gameState.rows * 16 + 130);
		return { width: w, height: h };
	}

	function applyDifficultySettings(diff, customCfg) {
		if (PRESETS[diff]) {
			gameState.difficulty = diff;
			gameState.rows = PRESETS[diff].rows;
			gameState.cols = PRESETS[diff].cols;
			gameState.minesCount = PRESETS[diff].mines;
		} else if (diff === 'custom' && customCfg) {
			gameState.difficulty = 'custom';
			gameState.rows = Math.min(24, Math.max(9, customCfg.rows || 9));
			gameState.cols = Math.min(30, Math.max(9, customCfg.cols || 9));
			const maxMines = Math.floor((gameState.rows * gameState.cols) * 0.9);
			gameState.minesCount = Math.min(maxMines, Math.max(10, customCfg.mines || 10));
		}
	}

	function resizeCurrentWindow() {
		if (!gameState.activeWin) return;
		const dims = getWindowDimensions();
		gameState.activeWin.style.width = `${dims.width}px`;
		gameState.activeWin.style.height = `${dims.height}px`;
	}

	function bindWindowEvents(win) {
		const gameMenuBtn = win.querySelector('#ms-menu-game');
		const helpMenuBtn = win.querySelector('#ms-menu-help');
		const faceBtn = win.querySelector('#ms-face-btn');

		faceBtn.addEventListener('click', () => {
			resetGame();
			playSound('click');
		});

		gameMenuBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			const rect = gameMenuBtn.getBoundingClientRect();
			if (window.ContextMenu) {
				const items = [
					{ label: 'New', shortcut: 'F2', bold: true, action: () => resetGame() },
					{ separator: true },
					{
						label: 'Beginner',
						radio: gameState.difficulty === 'beginner',
						action: () => setDifficulty('beginner')
					},
					{
						label: 'Intermediate',
						radio: gameState.difficulty === 'intermediate',
						action: () => setDifficulty('intermediate')
					},
					{
						label: 'Expert',
						radio: gameState.difficulty === 'expert',
						action: () => setDifficulty('expert')
					},
					{
						label: 'Custom...',
						radio: gameState.difficulty === 'custom',
						action: () => openCustomDialog()
					},
					{ separator: true },
					{
						label: 'Marks (?)',
						checked: gameState.marksEnabled,
						action: () => {
							gameState.marksEnabled = !gameState.marksEnabled;
							const cfg = loadConfig();
							cfg.marksEnabled = gameState.marksEnabled;
							saveConfig(cfg);
						}
					},
					{
						label: 'Sound',
						checked: gameState.soundEnabled,
						action: () => {
							gameState.soundEnabled = !gameState.soundEnabled;
							const cfg = loadConfig();
							cfg.soundEnabled = gameState.soundEnabled;
							saveConfig(cfg);
						}
					},
					{ separator: true },
					{ label: 'Best Times...', action: () => openBestTimesDialog() },
					{ separator: true },
					{
						label: 'Exit',
						action: () => {
							if (typeof closeWindow === 'function') closeWindow(win, win.id);
						}
					}
				];
				window.ContextMenu.show(items, rect.left, rect.bottom);
			}
		});

		helpMenuBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			const rect = helpMenuBtn.getBoundingClientRect();
			if (window.ContextMenu) {
				const items = [
					{
						label: 'About Minesweeper',
						action: () => {
							showXPDialog('About Minesweeper', 'Microsoft Windows XP Minesweeper Recreation.\nAuthentic gameplay, high scores and board calibration.', 'info');
						}
					}
				];
				window.ContextMenu.show(items, rect.left, rect.bottom);
			}
		});

		win.addEventListener('keydown', (e) => {
			if (e.key === 'F2') {
				e.preventDefault();
				resetGame();
			}
		});
	}

	function setDifficulty(diff, customCfg) {
		applyDifficultySettings(diff, customCfg);
		const cfg = loadConfig();
		cfg.difficulty = diff;
		if (customCfg) cfg.custom = customCfg;
		saveConfig(cfg);
		resizeCurrentWindow();
		resetGame();
	}

	function resetGame() {
		if (!gameState.activeWin) return;
		clearInterval(gameState.timerInterval);
		gameState.timerInterval = null;
		gameState.timer = 0;
		gameState.status = 'ready';
		gameState.firstClick = true;
		gameState.minesRemaining = gameState.minesCount;

		updateFaceIcon('🙂');
		updateDigitalDisplay('#ms-mines-left', gameState.minesRemaining);
		updateDigitalDisplay('#ms-timer', 0);

		buildBoardDOM();
	}

	function updateFaceIcon(emoji) {
		if (!gameState.activeWin) return;
		const iconEl = gameState.activeWin.querySelector('#ms-face-icon');
		if (iconEl) iconEl.textContent = emoji;
	}

	function updateDigitalDisplay(selector, val) {
		if (!gameState.activeWin) return;
		const el = gameState.activeWin.querySelector(selector);
		if (!el) return;
		const clamped = Math.max(-99, Math.min(999, val));
		if (clamped < 0) {
			el.textContent = `-${String(Math.abs(clamped)).padStart(2, '0')}`;
		} else {
			el.textContent = String(clamped).padStart(3, '0');
		}
	}

	function startTimer() {
		if (gameState.timerInterval) return;
		gameState.timer = 0;
		gameState.timerInterval = setInterval(() => {
			gameState.timer++;
			if (gameState.timer > 999) gameState.timer = 999;
			updateDigitalDisplay('#ms-timer', gameState.timer);
		}, 1000);
	}

	function buildBoardDOM() {
		const boardEl = gameState.activeWin.querySelector('#ms-board');
		if (!boardEl) return;

		boardEl.innerHTML = '';
		boardEl.style.gridTemplateColumns = `repeat(${gameState.cols}, 16px)`;
		boardEl.style.gridTemplateRows = `repeat(${gameState.rows}, 16px)`;
		gameState.grid = [];

		for (let r = 0; r < gameState.rows; r++) {
			const row = [];
			for (let c = 0; c < gameState.cols; c++) {
				const cell = document.createElement('div');
				cell.className = 'ms-cell';
				cell.dataset.row = r;
				cell.dataset.col = c;

				cell.addEventListener('mousedown', (e) => handleCellMouseDown(e, r, c));
				cell.addEventListener('mouseup', (e) => handleCellMouseUp(e, r, c));
				cell.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					handleCellRightClick(r, c);
				});

				boardEl.appendChild(cell);
				row.push({
					element: cell,
					isMine: false,
					state: 'covered',
					adjacentMines: 0,
					hitMine: false
				});
			}
			gameState.grid.push(row);
		}
	}

	function populateMines(avoidR, avoidC) {
		let placed = 0;
		const totalCells = gameState.rows * gameState.cols;
		const needed = Math.min(gameState.minesCount, totalCells - 1);

		while (placed < needed) {
			const r = Math.floor(Math.random() * gameState.rows);
			const c = Math.floor(Math.random() * gameState.cols);
			if ((r === avoidR && c === avoidC) || gameState.grid[r][c].isMine) {
				continue;
			}
			gameState.grid[r][c].isMine = true;
			placed++;
		}

		for (let r = 0; r < gameState.rows; r++) {
			for (let c = 0; c < gameState.cols; c++) {
				if (gameState.grid[r][c].isMine) continue;
				let count = 0;
				for (let dr = -1; dr <= 1; dr++) {
					for (let dc = -1; dc <= 1; dc++) {
						const nr = r + dr;
						const nc = c + dc;
						if (nr >= 0 && nr < gameState.rows && nc >= 0 && nc < gameState.cols) {
							if (gameState.grid[nr][nc].isMine) count++;
						}
					}
				}
				gameState.grid[r][c].adjacentMines = count;
			}
		}
	}

	let activeMouseButtons = 0;

	function handleCellMouseDown(e, r, c) {
		if (gameState.status === 'won' || gameState.status === 'lost') return;
		activeMouseButtons = e.buttons;

		if (e.buttons === 1 || e.buttons === 3 || e.button === 1) {
			updateFaceIcon('😮');
			if (e.buttons === 3 || e.button === 1) {
				highlightNeighbors(r, c, true);
			}
		}
	}

	function handleCellMouseUp(e, r, c) {
		if (gameState.status === 'won' || gameState.status === 'lost') return;
		updateFaceIcon('🙂');
		highlightNeighbors(r, c, false);

		if (e.button === 0 && activeMouseButtons !== 3) {
			revealCell(r, c);
		} else if (activeMouseButtons === 3 || e.button === 1) {
			chordCell(r, c);
		}
		activeMouseButtons = 0;
	}

	function handleCellRightClick(r, c) {
		if (gameState.status === 'won' || gameState.status === 'lost') return;
		const cell = gameState.grid[r][c];
		if (cell.state === 'revealed') return;

		if (cell.state === 'covered') {
			cell.state = 'flagged';
			cell.element.classList.add('flagged');
			cell.element.textContent = '🚩';
			gameState.minesRemaining--;
			playSound('click');
		} else if (cell.state === 'flagged') {
			if (gameState.marksEnabled) {
				cell.state = 'question';
				cell.element.classList.remove('flagged');
				cell.element.classList.add('question');
				cell.element.textContent = '?';
			} else {
				cell.state = 'covered';
				cell.element.classList.remove('flagged');
				cell.element.textContent = '';
			}
			gameState.minesRemaining++;
			playSound('click');
		} else if (cell.state === 'question') {
			cell.state = 'covered';
			cell.element.classList.remove('question');
			cell.element.textContent = '';
			playSound('click');
		}

		updateDigitalDisplay('#ms-mines-left', gameState.minesRemaining);
	}

	function revealCell(r, c) {
		if (gameState.status === 'won' || gameState.status === 'lost') return;
		const cell = gameState.grid[r][c];
		if (cell.state === 'flagged' || cell.state === 'revealed') return;

		if (gameState.firstClick) {
			gameState.firstClick = false;
			populateMines(r, c);
			startTimer();
			gameState.status = 'playing';
		}

		if (cell.isMine) {
			cell.hitMine = true;
			gameOver(false);
			return;
		}

		cell.state = 'revealed';
		cell.element.className = 'ms-cell revealed';
		cell.element.textContent = '';

		if (cell.adjacentMines > 0) {
			cell.element.textContent = cell.adjacentMines;
			cell.element.dataset.num = cell.adjacentMines;
		} else {
			for (let dr = -1; dr <= 1; dr++) {
				for (let dc = -1; dc <= 1; dc++) {
					const nr = r + dr;
					const nc = c + dc;
					if (nr >= 0 && nr < gameState.rows && nc >= 0 && nc < gameState.cols) {
						if (gameState.grid[nr][nc].state !== 'revealed') {
							revealCell(nr, nc);
						}
					}
				}
			}
		}

		checkWinCondition();
	}

	function chordCell(r, c) {
		const cell = gameState.grid[r][c];
		if (cell.state !== 'revealed' || cell.adjacentMines === 0) return;

		let flagCount = 0;
		for (let dr = -1; dr <= 1; dr++) {
			for (let dc = -1; dc <= 1; dc++) {
				const nr = r + dr;
				const nc = c + dc;
				if (nr >= 0 && nr < gameState.rows && nc >= 0 && nc < gameState.cols) {
					if (gameState.grid[nr][nc].state === 'flagged') flagCount++;
				}
			}
		}

		if (flagCount === cell.adjacentMines) {
			for (let dr = -1; dr <= 1; dr++) {
				for (let dc = -1; dc <= 1; dc++) {
					const nr = r + dr;
					const nc = c + dc;
					if (nr >= 0 && nr < gameState.rows && nc >= 0 && nc < gameState.cols) {
						if (gameState.grid[nr][nc].state !== 'flagged' && gameState.grid[nr][nc].state !== 'revealed') {
							revealCell(nr, nc);
						}
					}
				}
			}
		}
	}

	function highlightNeighbors(r, c, activate) {
		for (let dr = -1; dr <= 1; dr++) {
			for (let dc = -1; dc <= 1; dc++) {
				const nr = r + dr;
				const nc = c + dc;
				if (nr >= 0 && nr < gameState.rows && nc >= 0 && nc < gameState.cols) {
					const neighbor = gameState.grid[nr][nc];
					if (neighbor.state === 'covered' || neighbor.state === 'question') {
						neighbor.element.classList.toggle('pressed', activate);
					}
				}
			}
		}
	}

	function checkWinCondition() {
		let unrevealedSafeCells = 0;
		for (let r = 0; r < gameState.rows; r++) {
			for (let c = 0; c < gameState.cols; c++) {
				const cell = gameState.grid[r][c];
				if (!cell.isMine && cell.state !== 'revealed') {
					unrevealedSafeCells++;
				}
			}
		}

		if (unrevealedSafeCells === 0) {
			gameOver(true);
		}
	}

	function gameOver(isWin) {
		clearInterval(gameState.timerInterval);
		gameState.status = isWin ? 'won' : 'lost';

		if (isWin) {
			updateFaceIcon('😎');
			updateDigitalDisplay('#ms-mines-left', 0);
			playSound('win');

			for (let r = 0; r < gameState.rows; r++) {
				for (let c = 0; c < gameState.cols; c++) {
					const cell = gameState.grid[r][c];
					if (cell.isMine && cell.state !== 'flagged') {
						cell.state = 'flagged';
						cell.element.className = 'ms-cell flagged';
						cell.element.textContent = '🚩';
					}
				}
			}

			handleHighScore(gameState.difficulty, gameState.timer);
		} else {
			updateFaceIcon('😵');
			playSound('lose');

			for (let r = 0; r < gameState.rows; r++) {
				for (let c = 0; c < gameState.cols; c++) {
					const cell = gameState.grid[r][c];
					if (cell.isMine) {
						if (!cell.hitMine && cell.state !== 'flagged') {
							cell.element.className = 'ms-cell revealed mine';
							cell.element.textContent = '💣';
						} else if (cell.hitMine) {
							cell.element.className = 'ms-cell revealed mine-death';
							cell.element.textContent = '💣';
						}
					} else if (cell.state === 'flagged' && !cell.isMine) {
						cell.element.className = 'ms-cell revealed mine-wrong';
						cell.element.textContent = '❌';
					}
				}
			}
		}
	}

	function handleHighScore(diff, timeTaken) {
		if (!PRESETS[diff]) return;
		const scores = loadScores();
		const currentBest = scores[diff] || { time: 999, name: 'Anonymous' };

		if (timeTaken < currentBest.time) {
			promptNewHighScore(diff, timeTaken, (name) => {
				scores[diff] = { time: timeTaken, name: name || 'Anonymous' };
				saveScores(scores);
				openBestTimesDialog();
			});
		}
	}

	function promptNewHighScore(diff, timeTaken, onDone) {
		const id = `dialog-high-score-${Date.now()}`;
		const diffLabel = PRESETS[diff]?.label || diff;
		const content = `
			<div style="padding: 12px; font-size: 11px; display: flex; flex-direction: column; gap: 8px;">
				<div>You have the fastest time for <strong>${diffLabel}</strong> level.</div>
				<div>Please type your name:</div>
				<input type="text" id="ms-winner-name" value="Anonymous" class="xp-input" style="width: 100%;">
				<div style="display: flex; justify-content: flex-end; margin-top: 6px;">
					<button type="button" class="xp-button" id="ms-winner-ok" style="min-width: 60px;">OK</button>
				</div>
			</div>
		`;

		const dlg = createXPWindow(id, 'Fastest Mine Sweepers', content, 260, 140, { isModal: true, resizable: false });
		const input = dlg.querySelector('#ms-winner-name');
		input.focus();
		input.select();

		const confirm = () => {
			const val = input.value.trim() || 'Anonymous';
			closeWindow(dlg, id);
			onDone(val);
		};

		dlg.querySelector('#ms-winner-ok').addEventListener('click', confirm);
		input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') confirm();
		});
	}

	function openBestTimesDialog() {
		const id = `dialog-best-times-${Date.now()}`;
		const scores = loadScores();
		const content = `
			<div style="padding: 12px; font-size: 11px; display: flex; flex-direction: column; gap: 10px;">
				<div style="display: grid; grid-template-columns: 90px 60px 1fr; gap: 6px; border-bottom: 1px solid #ccc; padding-bottom: 6px;">
					<strong>Difficulty</strong>
					<strong>Time</strong>
					<strong>Player</strong>
				</div>
				<div style="display: grid; grid-template-columns: 90px 60px 1fr; gap: 6px;">
					<span>Beginner:</span>
					<span>${scores.beginner.time}s</span>
					<span>${scores.beginner.name}</span>
				</div>
				<div style="display: grid; grid-template-columns: 90px 60px 1fr; gap: 6px;">
					<span>Intermediate:</span>
					<span>${scores.intermediate.time}s</span>
					<span>${scores.intermediate.name}</span>
				</div>
				<div style="display: grid; grid-template-columns: 90px 60px 1fr; gap: 6px;">
					<span>Expert:</span>
					<span>${scores.expert.time}s</span>
					<span>${scores.expert.name}</span>
				</div>
				<div style="display: flex; justify-content: space-between; margin-top: 8px;">
					<button type="button" class="xp-button" id="ms-reset-scores">Reset Scores</button>
					<button type="button" class="xp-button" id="ms-close-scores">OK</button>
				</div>
			</div>
		`;

		const dlg = createXPWindow(id, 'Fastest Mine Sweepers', content, 310, 185, { isModal: true, resizable: false });
		dlg.querySelector('#ms-close-scores').addEventListener('click', () => closeWindow(dlg, id));
		dlg.querySelector('#ms-reset-scores').addEventListener('click', () => {
			saveScores(DEFAULT_SCORES);
			closeWindow(dlg, id);
			openBestTimesDialog();
		});
	}

	function openCustomDialog() {
		const id = `dialog-custom-field-${Date.now()}`;
		const cfg = loadConfig();
		const custom = cfg.custom || { rows: 9, cols: 9, mines: 10 };

		const content = `
			<div style="padding: 12px; font-size: 11px; display: flex; flex-direction: column; gap: 8px;">
				<div class="xp-form-row">
					<label for="ms-cust-height" style="width: 70px;">Height (9-24):</label>
					<input type="number" id="ms-cust-height" class="xp-input" min="9" max="24" value="${custom.rows}" style="width: 60px;">
				</div>
				<div class="xp-form-row">
					<label for="ms-cust-width" style="width: 70px;">Width (9-30):</label>
					<input type="number" id="ms-cust-width" class="xp-input" min="9" max="30" value="${custom.cols}" style="width: 60px;">
				</div>
				<div class="xp-form-row">
					<label for="ms-cust-mines" style="width: 70px;">Mines (10-668):</label>
					<input type="number" id="ms-cust-mines" class="xp-input" min="10" max="668" value="${custom.mines}" style="width: 60px;">
				</div>
				<div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 6px;">
					<button type="button" class="xp-button" id="ms-cust-ok">OK</button>
					<button type="button" class="xp-button" id="ms-cust-cancel">Cancel</button>
				</div>
			</div>
		`;

		const dlg = createXPWindow(id, 'Custom Field', content, 230, 160, { isModal: true, resizable: false });
		const hInput = dlg.querySelector('#ms-cust-height');
		const wInput = dlg.querySelector('#ms-cust-width');
		const mInput = dlg.querySelector('#ms-cust-mines');

		dlg.querySelector('#ms-cust-cancel').addEventListener('click', () => closeWindow(dlg, id));
		dlg.querySelector('#ms-cust-ok').addEventListener('click', () => {
			const rows = Math.min(24, Math.max(9, parseInt(hInput.value, 10) || 9));
			const cols = Math.min(30, Math.max(9, parseInt(wInput.value, 10) || 9));
			const maxM = Math.floor((rows * cols) * 0.9);
			const mines = Math.min(maxM, Math.max(10, parseInt(mInput.value, 10) || 10));

			closeWindow(dlg, id);
			setDifficulty('custom', { rows, cols, mines });
		});
	}

	window.MinesweeperApp = {
		open: openMinesweeper
	};
})();
