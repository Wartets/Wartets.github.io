(function () {
	'use strict';

	const STORAGE_KEY_TODOS = 'clippy_user_todos_v3';
	const STORAGE_KEY_PET = 'clippy_pet_state_v3';
	const STORAGE_KEY_NOTES = 'clippy_user_scratchpad_v3';

	function gammaLanczos(z) {
		if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gammaLanczos(1 - z));
		z -= 1;
		const p = [
			0.99999999999980993, 676.5203681218851, -1259.1392167224028,
			771.32342877765313, -176.61502916214059, 12.507343278686905,
			-0.13857109583115912, 9.9843695780195716e-6, 1.5056327351493116e-7
		];
		let x = p[0];
		for (let i = 1; i < p.length; i++) x += p[i] / (z + i);
		const t = z + p.length - 1.5;
		return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
	}

	function errorFunction(x) {
		const sign = (x >= 0) ? 1 : -1;
		x = Math.abs(x);
		const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
		const t = 1.0 / (1.0 + p * x);
		const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
		return sign * y;
	}

	function factorialInt(n) {
		n = Math.round(n);
		if (n < 0) return NaN;
		if (n === 0 || n === 1) return 1;
		let res = 1;
		for (let i = 2; i <= n; i++) res *= i;
		return res;
	}

	class TicTacToeActivity {
		constructor() {
			this.board = Array(9).fill(null);
			this.scores = { player: 0, clippy: 0, draws: 0 };
			this.winner = null;
			this.winningLine = [];
			this.card = null;
		}

		mount() {
			this.board = Array(9).fill(null);
			this.winner = null;
			this.winningLine = [];
			this.card = window.ClippyUI.createActivityCard('Tic-Tac-Toe', 'Mini-Game');
			this.render();
		}

		checkWinner(b) {
			const lines = [
				[0,1,2],[3,4,5],[6,7,8],
				[0,3,6],[1,4,7],[2,5,8],
				[0,4,8],[2,4,6]
			];
			for (const [x,y,z] of lines) {
				if (b[x] && b[x] === b[y] && b[x] === b[z]) {
					return { winner: b[x], line: [x,y,z] };
				}
			}
			if (b.every(c => c !== null)) return { winner: 'TIE', line: [] };
			return null;
		}

		makeMove(idx) {
			if (this.board[idx] || this.winner) return;
			this.board[idx] = 'X';
			if (window.ClippyAudio) window.ClippyAudio.play('type');

			let winCheck = this.checkWinner(this.board);
			if (winCheck) {
				this.finishGame(winCheck);
				return;
			}

			const free = this.board.map((v, i) => v === null ? i : null).filter(v => v !== null);
			if (free.length > 0) {
				let move = free.find(i => {
					const t = [...this.board];
					t[i] = 'O';
					const res = this.checkWinner(t);
					return res && res.winner === 'O';
				});

				if (move === undefined) {
					move = free.find(i => {
						const t = [...this.board];
						t[i] = 'X';
						const res = this.checkWinner(t);
						return res && res.winner === 'X';
					});
				}

				if (move === undefined) {
					if (free.includes(4)) move = 4;
					else move = free[Math.floor(Math.random() * free.length)];
				}

				this.board[move] = 'O';
			}

			winCheck = this.checkWinner(this.board);
			if (winCheck) {
				this.finishGame(winCheck);
			} else {
				this.render();
			}
		}

		finishGame(result) {
			this.winner = result.winner;
			this.winningLine = result.line || [];

			if (this.winner === 'X') {
				this.scores.player++;
				if (window.ClippyAudio) window.ClippyAudio.play('win');
				if (window.ClippySystemBridge) window.ClippySystemBridge.unlockAchievement('clippy_tictactoe_win', 1);
			} else if (this.winner === 'O') {
				this.scores.clippy++;
				if (window.ClippyAudio) window.ClippyAudio.play('lose');
			} else {
				this.scores.draws++;
				if (window.ClippyAudio) window.ClippyAudio.play('action');
			}

			this.render();
		}

		restart() {
			this.board = Array(9).fill(null);
			this.winner = null;
			this.winningLine = [];
			this.render();
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const scoreboard = document.createElement('div');
			scoreboard.className = 'clippy-scoreboard';
			scoreboard.innerHTML = `
				<div class="clippy-score-item"><span>You (X)</span><strong>${this.scores.player}</strong></div>
				<div class="clippy-score-item"><span>Draws</span><strong>${this.scores.draws}</strong></div>
				<div class="clippy-score-item"><span>Clippy (O)</span><strong>${this.scores.clippy}</strong></div>
			`;
			body.appendChild(scoreboard);

			if (this.winner) {
				const banner = document.createElement('div');
				if (this.winner === 'X') {
					banner.className = 'clippy-activity-banner win';
					banner.textContent = 'Game Over: Victory! You defeated Clippit.';
				} else if (this.winner === 'O') {
					banner.className = 'clippy-activity-banner loss';
					banner.textContent = 'Game Over: Defeat! Clippit won this round.';
				} else {
					banner.className = 'clippy-activity-banner draw';
					banner.textContent = 'Game Over: Draw game! Stalemate.';
				}
				body.appendChild(banner);
			}

			const grid = document.createElement('div');
			grid.className = 'clippy-ttt-grid';

			for (let i = 0; i < 9; i++) {
				const cell = document.createElement('button');
				cell.type = 'button';
				cell.className = 'clippy-ttt-cell';
				cell.textContent = this.board[i] || '';
				if (this.board[i] === 'X') cell.classList.add('player-x');
				if (this.board[i] === 'O') cell.classList.add('player-o');
				if (this.winningLine.includes(i)) cell.classList.add('winner-cell');
				cell.disabled = !!this.board[i] || !!this.winner;

				cell.addEventListener('click', () => this.makeMove(i));
				grid.appendChild(cell);
			}

			body.appendChild(grid);
			window.ClippyUI.scrollLogToBottom();

			if (this.winner && window.ClippyAgent && typeof window.ClippyAgent.notifyGameEnded === 'function') {
				const gameResult = this.winner === 'X' ? 'Victory' : (this.winner === 'O' ? 'Defeat' : 'Draw');
				window.ClippyAgent.notifyGameEnded('Tic-Tac-Toe', gameResult, () => {
					this.mount();
				});
			}
		}
	}

	class MemoryMatchActivity {
		constructor() {
			this.tokens = ['SYS', 'DLL', 'EXE', 'INI', 'BAT', 'COM'];
			this.deck = [];
			this.revealed = [];
			this.matched = [];
			this.flipped = [];
			this.moves = 0;
			this.isLocked = false;
			this.card = null;
		}

		mount() {
			this.deck = [...this.tokens, ...this.tokens].sort(() => Math.random() - 0.5);
			this.revealed = Array(12).fill(false);
			this.matched = Array(12).fill(false);
			this.flipped = [];
			this.moves = 0;
			this.isLocked = false;
			this.card = window.ClippyUI.createActivityCard('Memory Match', 'Token Pairs');
			this.render();
		}

		flipCard(idx) {
			if (this.isLocked || this.revealed[idx] || this.matched[idx]) return;
			this.revealed[idx] = true;
			this.flipped.push(idx);
			if (window.ClippyAudio) window.ClippyAudio.play('type');

			if (this.flipped.length === 2) {
				this.moves++;
				const [f, s] = this.flipped;
				if (this.deck[f] === this.deck[s]) {
					this.matched[f] = true;
					this.matched[s] = true;
					this.flipped = [];
					if (window.ClippyAudio) window.ClippyAudio.play('win');

					if (this.matched.every(Boolean)) {
						if (window.ClippyAudio) window.ClippyAudio.play('tada');
					}
					this.render();
				} else {
					this.isLocked = true;
					this.render();
					setTimeout(() => {
						this.revealed[f] = false;
						this.revealed[s] = false;
						this.flipped = [];
						this.isLocked = false;
						this.render();
					}, 750);
				}
			} else {
				this.render();
			}
		}

		restart() {
			this.deck = [...this.tokens, ...this.tokens].sort(() => Math.random() - 0.5);
			this.revealed = Array(12).fill(false);
			this.matched = Array(12).fill(false);
			this.flipped = [];
			this.moves = 0;
			this.isLocked = false;
			this.render();
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const matchedCount = this.matched.filter(Boolean).length / 2;
			const isComplete = this.matched.every(Boolean);

			const scoreboard = document.createElement('div');
			scoreboard.className = 'clippy-scoreboard';
			scoreboard.innerHTML = `
				<div class="clippy-score-item"><span>Matched</span><strong>${matchedCount} / 6</strong></div>
				<div class="clippy-score-item"><span>Turns</span><strong>${this.moves}</strong></div>
				<div class="clippy-score-item"><span>Status</span><strong>${isComplete ? 'Won' : 'Playing'}</strong></div>
			`;
			body.appendChild(scoreboard);

			if (isComplete) {
				const banner = document.createElement('div');
				banner.className = 'clippy-activity-banner win';
				banner.textContent = `All pairs matched in ${this.moves} turns!`;
				body.appendChild(banner);
			}

			const grid = document.createElement('div');
			grid.className = 'clippy-memory-grid';

			this.deck.forEach((token, idx) => {
				const btn = document.createElement('button');
				btn.type = 'button';
				btn.className = 'clippy-memory-card';

				if (this.matched[idx]) {
					btn.classList.add('matched');
					btn.textContent = token;
				} else if (this.revealed[idx]) {
					btn.classList.add('revealed');
					btn.textContent = token;
				} else {
					btn.textContent = '?';
				}

				btn.addEventListener('click', () => this.flipCard(idx));
				grid.appendChild(btn);
			});

			body.appendChild(grid);
			window.ClippyUI.scrollLogToBottom();

			if (isComplete && window.ClippyAgent && typeof window.ClippyAgent.notifyGameEnded === 'function') {
				window.ClippyAgent.notifyGameEnded('Memory Match', `Completed in ${this.moves} turns`, () => {
					this.mount();
				});
			}
		}
	}

	class HangmanActivity {
		constructor() {
			this.word = 'WINDOWS';
			this.guessed = new Set();
			this.errors = 0;
			this.maxErrors = 6;
			this.card = null;
		}

		mount() {
			const pool = (window.ClippyKnowledge && window.ClippyKnowledge.HANGMAN_WORDS) || ['WINDOWS', 'EXPLORER', 'CLIPPY', 'DESKTOP'];
			this.word = pool[Math.floor(Math.random() * pool.length)].toUpperCase();
			this.guessed = new Set();
			this.errors = 0;
			this.card = window.ClippyUI.createActivityCard('Hangman Challenge', 'Word Guess');
			this.render();
		}

		guessLetter(letter) {
			letter = letter.toUpperCase();
			if (this.guessed.has(letter) || this.isFinished()) return;
			this.guessed.add(letter);

			if (this.word.includes(letter)) {
				if (window.ClippyAudio) window.ClippyAudio.play('type');
				if (this.isWon()) {
					if (window.ClippyAudio) window.ClippyAudio.play('tada');
				}
			} else {
				this.errors++;
				if (window.ClippyAudio) window.ClippyAudio.play(this.errors >= this.maxErrors ? 'lose' : 'action');
			}

			this.render();
		}

		isWon() {
			return this.word.split('').every(c => this.guessed.has(c));
		}

		isLost() {
			return this.errors >= this.maxErrors;
		}

		isFinished() {
			return this.isWon() || this.isLost();
		}

		restart() {
			const pool = (window.ClippyKnowledge && window.ClippyKnowledge.HANGMAN_WORDS) || ['WINDOWS', 'EXPLORER', 'CLIPPY', 'DESKTOP'];
			this.word = pool[Math.floor(Math.random() * pool.length)].toUpperCase();
			this.guessed = new Set();
			this.errors = 0;
			this.render();
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const displayBox = document.createElement('div');
			displayBox.className = 'clippy-hangman-display';

			const masked = this.word.split('').map(c => this.guessed.has(c) || this.isLost() ? c : '_').join(' ');
			const wordEl = document.createElement('div');
			wordEl.className = 'clippy-hangman-word';
			wordEl.textContent = masked;
			displayBox.appendChild(wordEl);

			const stats = document.createElement('div');
			stats.className = 'clippy-hangman-stats';
			stats.innerHTML = `
				<span>Errors: <strong>${this.errors} / ${this.maxErrors}</strong></span>
				<span>Remaining: <strong>${this.maxErrors - this.errors}</strong></span>
			`;
			displayBox.appendChild(stats);

			body.appendChild(displayBox);

			if (this.isWon()) {
				const banner = document.createElement('div');
				banner.className = 'clippy-activity-banner win';
				banner.textContent = `Correct! The word was ${this.word}.`;
				body.appendChild(banner);
			} else if (this.isLost()) {
				const banner = document.createElement('div');
				banner.className = 'clippy-activity-banner loss';
				banner.textContent = `Out of tries! The word was ${this.word}.`;
				body.appendChild(banner);
			}

			const keyboard = document.createElement('div');
			keyboard.className = 'clippy-hangman-keyboard';
			const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

			alphabet.split('').forEach(char => {
				const key = document.createElement('button');
				key.type = 'button';
				key.className = 'clippy-hangman-key';
				key.textContent = char;
				key.disabled = this.guessed.has(char) || this.isFinished();
				key.addEventListener('click', () => this.guessLetter(char));
				keyboard.appendChild(key);
			});

			body.appendChild(keyboard);

			window.ClippyUI.scrollLogToBottom();

			if (this.isFinished() && window.ClippyAgent && typeof window.ClippyAgent.notifyGameEnded === 'function') {
				const resultStr = this.isWon() ? `Victory (${this.word})` : `Failed (${this.word})`;
				window.ClippyAgent.notifyGameEnded('Hangman', resultStr, () => {
					this.mount();
				});
			}
		}
	}

	class TechQuizActivity {
		constructor() {
			this.questions = [];
			this.currentIndex = 0;
			this.score = 0;
			this.selectedOption = null;
			this.isAnswered = false;
			this.card = null;
		}

		mount() {
			const pool = (window.ClippyKnowledge && window.ClippyKnowledge.QUIZ_QUESTIONS) || [];
			this.questions = [...pool].sort(() => Math.random() - 0.5);
			this.currentIndex = 0;
			this.score = 0;
			this.selectedOption = null;
			this.isAnswered = false;
			this.card = window.ClippyUI.createActivityCard('Tech Knowledge Quiz', 'Diagnostic Test');
			this.render();
		}

		answer(idx) {
			if (this.isAnswered) return;
			this.selectedOption = idx;
			this.isAnswered = true;
			const q = this.questions[this.currentIndex];

			if (idx === q.answer) {
				this.score++;
				if (window.ClippyAudio) window.ClippyAudio.play('win');
			} else {
				if (window.ClippyAudio) window.ClippyAudio.play('lose');
			}

			this.render();
		}

		next() {
			this.currentIndex++;
			this.selectedOption = null;
			this.isAnswered = false;
			if (this.currentIndex >= this.questions.length) {
				if (window.ClippyAudio) window.ClippyAudio.play('tada');
			}
			this.render();
		}

		restart() {
			const pool = (window.ClippyKnowledge && window.ClippyKnowledge.QUIZ_QUESTIONS) || [];
			this.questions = [...pool].sort(() => Math.random() - 0.5);
			this.currentIndex = 0;
			this.score = 0;
			this.selectedOption = null;
			this.isAnswered = false;
			this.render();
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const isComplete = this.currentIndex >= this.questions.length;

			if (isComplete) {
				const pct = Math.round((this.score / this.questions.length) * 100);
				const banner = document.createElement('div');
				banner.className = `clippy-activity-banner ${pct >= 60 ? 'win' : 'loss'}`;
				banner.textContent = `Quiz Completed! Score: ${this.score} / ${this.questions.length} (${pct}%)`;
				body.appendChild(banner);
				window.ClippyUI.scrollLogToBottom();

				if (window.ClippyAgent && typeof window.ClippyAgent.notifyGameEnded === 'function') {
					window.ClippyAgent.notifyGameEnded('Tech Quiz', `${this.score}/${this.questions.length} (${pct}%)`, () => {
						this.mount();
					});
				}
				return;
			}

			const container = document.createElement('div');
			container.className = 'clippy-quiz-container';

			const progress = document.createElement('div');
			progress.className = 'clippy-quiz-progress';
			const fill = document.createElement('div');
			fill.className = 'clippy-quiz-progress-fill';
			fill.style.width = `${((this.currentIndex) / this.questions.length) * 100}%`;
			progress.appendChild(fill);
			container.appendChild(progress);

			const q = this.questions[this.currentIndex];
			const qHeader = document.createElement('div');
			qHeader.className = 'clippy-quiz-question';
			qHeader.textContent = `[Q${this.currentIndex + 1}/${this.questions.length}] ${q.q}`;
			container.appendChild(qHeader);

			const optionsBox = document.createElement('div');
			optionsBox.className = 'clippy-quiz-options';

			q.options.forEach((opt, idx) => {
				const btn = document.createElement('button');
				btn.type = 'button';
				btn.className = 'clippy-quiz-option-btn';
				btn.textContent = opt;

				if (this.isAnswered) {
					btn.disabled = true;
					if (idx === q.answer) btn.classList.add('correct');
					else if (idx === this.selectedOption) btn.classList.add('wrong');
				} else {
					btn.addEventListener('click', () => this.answer(idx));
				}
				optionsBox.appendChild(btn);
			});

			container.appendChild(optionsBox);

			if (this.isAnswered) {
				const fact = document.createElement('div');
				fact.className = 'clippy-quiz-fact';
				fact.innerHTML = `<strong>Note:</strong> ${q.fact}`;
				container.appendChild(fact);

				const actions = document.createElement('div');
				actions.className = 'clippy-actions-bar';
				const nextBtn = document.createElement('button');
				nextBtn.type = 'button';
				nextBtn.className = 'clippy-action-btn';
				nextBtn.textContent = (this.currentIndex + 1 < this.questions.length) ? 'Next Question' : 'View Results';
				nextBtn.addEventListener('click', () => this.next());
				actions.appendChild(nextBtn);
				container.appendChild(actions);
			}

			body.appendChild(container);
			window.ClippyUI.scrollLogToBottom();
		}
	}

	class GuessNumberActivity {
		constructor() {
			this.target = Math.floor(Math.random() * 100) + 1;
			this.minBound = 1;
			this.maxBound = 100;
			this.attempts = 0;
			this.lastGuess = null;
			this.statusText = 'Guess an integer between 1 and 100:';
			this.isWon = false;
			this.card = null;
		}

		mount() {
			this.target = Math.floor(Math.random() * 100) + 1;
			this.minBound = 1;
			this.maxBound = 100;
			this.attempts = 0;
			this.lastGuess = null;
			this.statusText = 'Guess an integer between 1 and 100:';
			this.isWon = false;
			this.card = window.ClippyUI.createActivityCard('Number Oracle', 'Logic Search');
			this.render();
		}

		submitGuess(val) {
			const num = parseInt(val, 10);
			if (isNaN(num) || num < 1 || num > 100 || this.isWon) return;
			this.attempts++;
			this.lastGuess = num;

			if (num === this.target) {
				this.isWon = true;
				this.statusText = `Match found! Exact value was ${this.target}.`;
				if (window.ClippyAudio) window.ClippyAudio.play('tada');
			} else if (num < this.target) {
				this.minBound = Math.max(this.minBound, num + 1);
				this.statusText = `Target is GREATER than ${num}.`;
				if (window.ClippyAudio) window.ClippyAudio.play('action');
			} else {
				this.maxBound = Math.min(this.maxBound, num - 1);
				this.statusText = `Target is LESS than ${num}.`;
				if (window.ClippyAudio) window.ClippyAudio.play('action');
			}

			this.render();
		}

		restart() {
			this.target = Math.floor(Math.random() * 100) + 1;
			this.minBound = 1;
			this.maxBound = 100;
			this.attempts = 0;
			this.lastGuess = null;
			this.statusText = 'Guess an integer between 1 and 100:';
			this.isWon = false;
			this.render();
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const container = document.createElement('div');
			container.className = 'clippy-guess-container';

			const range = document.createElement('div');
			range.className = 'clippy-guess-range';
			range.innerHTML = `
				<span>Active Search Bounds: <strong>[${this.minBound} ... ${this.maxBound}]</strong></span>
				<span>Attempts: <strong>${this.attempts}</strong></span>
			`;
			container.appendChild(range);

			if (this.isWon) {
				const banner = document.createElement('div');
				banner.className = 'clippy-activity-banner win';
				banner.textContent = `Solved in ${this.attempts} attempt(s)! Target was ${this.target}.`;
				container.appendChild(banner);
			} else {
				const banner = document.createElement('div');
				banner.className = 'clippy-activity-banner info';
				banner.textContent = this.statusText;
				container.appendChild(banner);

				const inputRow = document.createElement('div');
				inputRow.className = 'clippy-guess-input-row';

				const input = document.createElement('input');
				input.type = 'number';
				input.min = '1';
				input.max = '100';
				input.className = 'clippy-guess-input';
				input.placeholder = `${this.minBound} - ${this.maxBound}`;

				const btn = document.createElement('button');
				btn.type = 'button';
				btn.className = 'clippy-action-btn';
				btn.textContent = 'Submit';
				btn.addEventListener('click', () => {
					this.submitGuess(input.value);
				});

				input.addEventListener('keydown', (e) => {
					if (e.key === 'Enter') this.submitGuess(input.value);
				});

				inputRow.appendChild(input);
				inputRow.appendChild(btn);
				container.appendChild(inputRow);
			}

			body.appendChild(container);
			window.ClippyUI.scrollLogToBottom();

			if (this.isWon && window.ClippyAgent && typeof window.ClippyAgent.notifyGameEnded === 'function') {
				window.ClippyAgent.notifyGameEnded('Number Oracle', `Solved in ${this.attempts} attempts`, () => {
					this.mount();
				});
			}
		}
	}

	class RockPaperScissorsActivity {
		constructor() {
			this.scores = { player: 0, clippy: 0, draws: 0 };
			this.lastUserMove = null;
			this.lastClippyMove = null;
			this.lastResult = null;
			this.card = null;
		}

		mount() {
			this.lastUserMove = null;
			this.lastClippyMove = null;
			this.lastResult = null;
			this.card = window.ClippyUI.createActivityCard('Rock-Paper-Scissors', 'Battle');
			this.render();
		}

		play(userMove) {
			const moves = ['Rock', 'Paper', 'Scissors'];
			const clippyMove = moves[Math.floor(Math.random() * moves.length)];
			this.lastUserMove = userMove;
			this.lastClippyMove = clippyMove;

			if (userMove === clippyMove) {
				this.lastResult = 'DRAW';
				this.scores.draws++;
				if (window.ClippyAudio) window.ClippyAudio.play('action');
			} else if (
				(userMove === 'Rock' && clippyMove === 'Scissors') ||
				(userMove === 'Paper' && clippyMove === 'Rock') ||
				(userMove === 'Scissors' && clippyMove === 'Paper')
			) {
				this.lastResult = 'WIN';
				this.scores.player++;
				if (window.ClippyAudio) window.ClippyAudio.play('win');
			} else {
				this.lastResult = 'LOSS';
				this.scores.clippy++;
				if (window.ClippyAudio) window.ClippyAudio.play('lose');
			}

			this.render();
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const scoreboard = document.createElement('div');
			scoreboard.className = 'clippy-scoreboard';
			scoreboard.innerHTML = `
				<div class="clippy-score-item"><span>You</span><strong>${this.scores.player}</strong></div>
				<div class="clippy-score-item"><span>Draws</span><strong>${this.scores.draws}</strong></div>
				<div class="clippy-score-item"><span>Clippy</span><strong>${this.scores.clippy}</strong></div>
			`;
			body.appendChild(scoreboard);

			if (this.lastResult) {
				const clash = document.createElement('div');
				clash.className = 'clippy-rps-clash';
				clash.innerHTML = `
					<span>You: ${this.lastUserMove}</span>
					<span style="color: #666;">vs</span>
					<span>Clippy: ${this.lastClippyMove}</span>
				`;
				body.appendChild(clash);

				const banner = document.createElement('div');
				if (this.lastResult === 'WIN') {
					banner.className = 'clippy-activity-banner win';
					banner.textContent = 'You win this clash!';
				} else if (this.lastResult === 'LOSS') {
					banner.className = 'clippy-activity-banner loss';
					banner.textContent = 'Clippit wins this round!';
				} else {
					banner.className = 'clippy-activity-banner draw';
					banner.textContent = 'Mutual deflection! It is a draw.';
				}
				body.appendChild(banner);
			}

			const container = document.createElement('div');
			container.className = 'clippy-rps-container';

			const buttons = document.createElement('div');
			buttons.className = 'clippy-rps-buttons';

			['Rock', 'Paper', 'Scissors'].forEach(m => {
				const btn = document.createElement('button');
				btn.type = 'button';
				btn.className = 'clippy-rps-btn';
				btn.textContent = m;
				btn.addEventListener('click', () => this.play(m));
				buttons.appendChild(btn);
			});

			container.appendChild(buttons);
			body.appendChild(container);
			window.ClippyUI.scrollLogToBottom();
		}
	}

	class MiniMinesweeperActivity {
		constructor() {
			this.rows = 6;
			this.cols = 6;
			this.mineCount = 5;
			this.board = [];
			this.revealed = [];
			this.flagged = [];
			this.isGameOver = false;
			this.isWon = false;
			this.card = null;
		}

		mount() {
			this.initBoard();
			this.card = window.ClippyUI.createActivityCard('Minesweeper Mini', '6x6 Field');
			this.render();
		}

		initBoard() {
			this.board = Array(this.rows * this.cols).fill(0);
			this.revealed = Array(this.rows * this.cols).fill(false);
			this.flagged = Array(this.rows * this.cols).fill(false);
			this.isGameOver = false;
			this.isWon = false;

			let placed = 0;
			while (placed < this.mineCount) {
				const idx = Math.floor(Math.random() * this.board.length);
				if (this.board[idx] !== -1) {
					this.board[idx] = -1;
					placed++;
				}
			}

			for (let r = 0; r < this.rows; r++) {
				for (let c = 0; c < this.cols; c++) {
					const idx = r * this.cols + c;
					if (this.board[idx] === -1) continue;
					let count = 0;
					for (let dr = -1; dr <= 1; dr++) {
						for (let dc = -1; dc <= 1; dc++) {
							const nr = r + dr;
							const nc = c + dc;
							if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
								if (this.board[nr * this.cols + nc] === -1) count++;
							}
						}
					}
					this.board[idx] = count;
				}
			}
		}

		reveal(idx) {
			if (this.isGameOver || this.revealed[idx] || this.flagged[idx]) return;

			if (this.board[idx] === -1) {
				this.revealed[idx] = true;
				this.isGameOver = true;
				this.isWon = false;
				if (window.ClippyAudio) window.ClippyAudio.play('lose');
				this.render();
				return;
			}

			const queue = [idx];
			this.revealed[idx] = true;

			while (queue.length > 0) {
				const curr = queue.shift();
				const r = Math.floor(curr / this.cols);
				const c = curr % this.cols;

				if (this.board[curr] === 0) {
					for (let dr = -1; dr <= 1; dr++) {
						for (let dc = -1; dc <= 1; dc++) {
							const nr = r + dr;
							const nc = c + dc;
							if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
								const nIdx = nr * this.cols + nc;
								if (!this.revealed[nIdx] && !this.flagged[nIdx]) {
									this.revealed[nIdx] = true;
									if (this.board[nIdx] === 0) queue.push(nIdx);
								}
							}
						}
					}
				}
			}

			if (window.ClippyAudio) window.ClippyAudio.play('type');

			const unrevealedSafe = this.board.filter((v, i) => v !== -1 && !this.revealed[i]).length;
			if (unrevealedSafe === 0) {
				this.isGameOver = true;
				this.isWon = true;
				if (window.ClippyAudio) window.ClippyAudio.play('tada');
			}

			this.render();
		}

		toggleFlag(idx) {
			if (this.isGameOver || this.revealed[idx]) return;
			this.flagged[idx] = !this.flagged[idx];
			if (window.ClippyAudio) window.ClippyAudio.play('action');
			this.render();
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const container = document.createElement('div');
			container.className = 'clippy-mines-container';

			const flagsUsed = this.flagged.filter(Boolean).length;
			const header = document.createElement('div');
			header.className = 'clippy-mines-header';
			header.innerHTML = `
				<div class="clippy-mines-lcd">${String(Math.max(0, this.mineCount - flagsUsed)).padStart(3, '0')}</div>
				<button type="button" class="clippy-mines-face">${this.isWon ? 'B-)' : (this.isGameOver ? 'X(' : ':-)')}</button>
				<div class="clippy-mines-lcd">036</div>
			`;
			header.querySelector('.clippy-mines-face').addEventListener('click', () => {
				this.initBoard();
				this.render();
			});
			container.appendChild(header);

			const grid = document.createElement('div');
			grid.className = 'clippy-mines-grid';

			for (let i = 0; i < this.board.length; i++) {
				const cell = document.createElement('div');
				cell.className = 'clippy-mine-cell';

				if (this.revealed[i]) {
					cell.classList.add('revealed');
					if (this.board[i] === -1) {
						cell.classList.add('mine');
						cell.textContent = '*';
					} else if (this.board[i] > 0) {
						cell.classList.add(`c${this.board[i]}`);
						cell.textContent = this.board[i];
					}
				} else if (this.flagged[i]) {
					cell.textContent = 'P';
					cell.style.color = '#ff0000';
				}

				cell.addEventListener('click', () => this.reveal(i));
				cell.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					this.toggleFlag(i);
				});

				grid.appendChild(cell);
			}

			container.appendChild(grid);
			body.appendChild(container);

			if (this.isWon) {
				const banner = document.createElement('div');
				banner.className = 'clippy-activity-banner win';
				banner.textContent = 'All safe sectors revealed! Minefield cleared.';
				body.appendChild(banner);
			} else if (this.isGameOver) {
				const banner = document.createElement('div');
				banner.className = 'clippy-activity-banner loss';
				banner.textContent = 'Detonation! Minefield triggered.';
				body.appendChild(banner);
			}

			window.ClippyUI.scrollLogToBottom();

			if (this.isGameOver && window.ClippyAgent && typeof window.ClippyAgent.notifyGameEnded === 'function') {
				window.ClippyAgent.notifyGameEnded('Minesweeper Mini', this.isWon ? 'Cleared' : 'Exploded', () => {
					this.mount();
				});
			}
		}
	}

	class DefragActivity {
		constructor() {
			this.progress = 0;
			this.interval = null;
			this.blocks = [];
			this.card = null;
		}

		mount() {
			this.progress = 0;
			this.blocks = [];
			for (let i = 0; i < 40; i++) {
				this.blocks.push({
					state: Math.random() > 0.45 ? 'frag' : (Math.random() > 0.3 ? 'used' : 'free')
				});
			}
			this.card = window.ClippyUI.createActivityCard('Disk Defragmenter', 'Volume C:');
			this.render();
			this.runSimulation();
		}

		runSimulation() {
			if (this.interval) clearInterval(this.interval);
			let blockIdx = 0;

			this.interval = setInterval(() => {
				this.progress += 4;
				if (blockIdx < this.blocks.length) {
					this.blocks[blockIdx].state = 'optimized';
					blockIdx++;
				}

				if (window.ClippyAudio && this.progress % 8 === 0) {
					window.ClippyAudio.play('crunch');
				}

				if (this.progress >= 100) {
					clearInterval(this.interval);
					this.interval = null;
					this.progress = 100;
					this.blocks.forEach(b => b.state = 'optimized');
					if (window.ClippyAudio) window.ClippyAudio.play('tada');
				}

				this.render();
			}, 120);
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const banner = document.createElement('div');
			banner.className = `clippy-activity-banner ${this.progress >= 100 ? 'win' : 'info'}`;
			banner.textContent = this.progress >= 100 
				? '100% Contiguous. Optimization Complete!' 
				: `Defragmenting Drive C: Clusters... (${this.progress}%)`;
			body.appendChild(banner);

			const map = document.createElement('div');
			map.className = 'clippy-defrag-map';

			this.blocks.forEach((b, i) => {
				const blockEl = document.createElement('div');
				blockEl.className = 'clippy-defrag-block';
				if (b.state === 'free') blockEl.classList.add('free');
				if (b.state === 'frag') blockEl.classList.add('frag');
				if (b.state === 'optimized') blockEl.style.backgroundColor = '#16a34a';
				map.appendChild(blockEl);
			});

			body.appendChild(map);

			const pbox = document.createElement('div');
			pbox.className = 'clippy-progress-box';
			const fill = document.createElement('div');
			fill.className = 'clippy-progress-fill';
			fill.style.width = `${this.progress}%`;
			pbox.appendChild(fill);
			body.appendChild(pbox);

			window.ClippyUI.scrollLogToBottom();

			if (this.progress >= 100 && window.ClippyAgent && typeof window.ClippyAgent.notifyGameEnded === 'function') {
				window.ClippyAgent.notifyGameEnded('Disk Defragmenter', '100% Contiguous', () => {
					this.mount();
				});
			}
		}
	}

	class PomodoroActivity {
		constructor() {
			this.totalSeconds = 25 * 60;
			this.remaining = 25 * 60;
			this.interval = null;
			this.isRunning = false;
			this.card = null;
		}

		mount(minutes = 25) {
			this.totalSeconds = minutes * 60;
			this.remaining = minutes * 60;
			this.isRunning = true;
			this.card = window.ClippyUI.createActivityCard('Focus Timer', `${minutes}m Session`);
			this.start();
			this.render();
		}

		start() {
			if (this.interval) clearInterval(this.interval);
			this.isRunning = true;
			this.interval = setInterval(() => {
				if (this.remaining > 0) {
					this.remaining--;
					this.render();
				} else {
					clearInterval(this.interval);
					this.interval = null;
					this.isRunning = false;
					if (window.ClippyAudio) window.ClippyAudio.play('tada');
					this.render();
				}
			}, 1000);
		}

		pause() {
			if (this.interval) clearInterval(this.interval);
			this.interval = null;
			this.isRunning = false;
			this.render();
		}

		reset() {
			if (this.interval) clearInterval(this.interval);
			this.interval = null;
			this.remaining = this.totalSeconds;
			this.isRunning = false;
			this.render();
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const mins = Math.floor(this.remaining / 60);
			const secs = this.remaining % 60;
			const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

			const display = document.createElement('div');
			display.className = 'clippy-timer-display';
			display.innerHTML = `<div class="clippy-timer-digits">${timeStr}</div>`;
			body.appendChild(display);

			const pbox = document.createElement('div');
			pbox.className = 'clippy-progress-box';
			const fill = document.createElement('div');
			fill.className = 'clippy-progress-fill';
			const pct = ((this.totalSeconds - this.remaining) / this.totalSeconds) * 100;
			fill.style.width = `${pct}%`;
			pbox.appendChild(fill);
			body.appendChild(pbox);

			if (this.remaining === 0) {
				const banner = document.createElement('div');
				banner.className = 'clippy-activity-banner win';
				banner.textContent = 'Focus interval completed! Take a 5-minute break.';
				body.appendChild(banner);
			}

			const actions = document.createElement('div');
			actions.className = 'clippy-actions-bar';

			if (this.remaining > 0) {
				const toggleBtn = document.createElement('button');
				toggleBtn.type = 'button';
				toggleBtn.className = 'clippy-action-btn';
				toggleBtn.textContent = this.isRunning ? 'Pause' : 'Resume';
				toggleBtn.addEventListener('click', () => {
					if (this.isRunning) this.pause();
					else this.start();
				});
				actions.appendChild(toggleBtn);
			}

			const resetBtn = document.createElement('button');
			resetBtn.type = 'button';
			resetBtn.className = 'clippy-action-btn';
			resetBtn.textContent = 'Reset';
			resetBtn.addEventListener('click', () => this.reset());
			actions.appendChild(resetBtn);

			body.appendChild(actions);
			window.ClippyUI.scrollLogToBottom();
		}
	}

	class TodoActivity {
		constructor() {
			this.todos = [];
			this.card = null;
		}

		mount() {
			this.todos = ActivitiesManager.getStoredTodos();
			this.card = window.ClippyUI.createActivityCard('Task Manager', 'To-Do List');
			this.render();
		}

		add(text) {
			if (!text || !text.trim()) return;
			this.todos.push({ id: Date.now(), text: text.trim(), done: false });
			ActivitiesManager.saveStoredTodos(this.todos);
			if (window.ClippyAudio) window.ClippyAudio.play('action');
			this.render();
		}

		toggle(id) {
			const item = this.todos.find(t => t.id === id);
			if (item) {
				item.done = !item.done;
				ActivitiesManager.saveStoredTodos(this.todos);
				if (window.ClippyAudio) window.ClippyAudio.play(item.done ? 'win' : 'type');
				this.render();
			}
		}

		remove(id) {
			this.todos = this.todos.filter(t => t.id !== id);
			ActivitiesManager.saveStoredTodos(this.todos);
			if (window.ClippyAudio) window.ClippyAudio.play('action');
			this.render();
		}

		clearCompleted() {
			this.todos = this.todos.filter(t => !t.done);
			ActivitiesManager.saveStoredTodos(this.todos);
			this.render();
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const pendingCount = this.todos.filter(t => !t.done).length;
			const scoreboard = document.createElement('div');
			scoreboard.className = 'clippy-scoreboard';
			scoreboard.innerHTML = `
				<div class="clippy-score-item"><span>Pending</span><strong>${pendingCount}</strong></div>
				<div class="clippy-score-item"><span>Completed</span><strong>${this.todos.length - pendingCount}</strong></div>
				<div class="clippy-score-item"><span>Total</span><strong>${this.todos.length}</strong></div>
			`;
			body.appendChild(scoreboard);

			const listContainer = document.createElement('div');
			listContainer.className = 'clippy-todo-container';

			if (this.todos.length === 0) {
				listContainer.innerHTML = '<div style="padding: 10px; font-size: 11px; color: #777; text-align: center;">No tasks registered. Add a task below.</div>';
			} else {
				this.todos.forEach(t => {
					const item = document.createElement('div');
					item.className = `clippy-todo-item ${t.done ? 'done' : ''}`;

					const check = document.createElement('input');
					check.type = 'checkbox';
					check.className = 'clippy-todo-check';
					check.checked = t.done;
					check.addEventListener('change', () => this.toggle(t.id));

					const span = document.createElement('span');
					span.style.flex = '1';
					span.textContent = t.text;

					const del = document.createElement('button');
					del.type = 'button';
					del.className = 'clippy-todo-del';
					del.innerHTML = '&times;';
					del.addEventListener('click', () => this.remove(t.id));

					item.appendChild(check);
					item.appendChild(span);
					item.appendChild(del);
					listContainer.appendChild(item);
				});
			}

			body.appendChild(listContainer);

			const inputRow = document.createElement('div');
			inputRow.className = 'clippy-guess-input-row';

			const input = document.createElement('input');
			input.type = 'text';
			input.className = 'clippy-guess-input';
			input.placeholder = 'New task description...';

			const addBtn = document.createElement('button');
			addBtn.type = 'button';
			addBtn.className = 'clippy-action-btn';
			addBtn.textContent = '+ Add';
			addBtn.addEventListener('click', () => {
				this.add(input.value);
				input.value = '';
			});

			input.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') {
					this.add(input.value);
					input.value = '';
				}
			});

			inputRow.appendChild(input);
			inputRow.appendChild(addBtn);
			body.appendChild(inputRow);

			if (this.todos.some(t => t.done)) {
				const actions = document.createElement('div');
				actions.className = 'clippy-actions-bar';
				const clearBtn = document.createElement('button');
				clearBtn.type = 'button';
				clearBtn.className = 'clippy-action-btn';
				clearBtn.textContent = 'Clear Completed';
				clearBtn.addEventListener('click', () => this.clearCompleted());
				actions.appendChild(clearBtn);
				body.appendChild(actions);
			}

			window.ClippyUI.scrollLogToBottom();
		}
	}

	class PetActivity {
		constructor() {
			this.pet = null;
			this.card = null;
		}

		mount() {
			this.pet = ActivitiesManager.getPetState();
			this.card = window.ClippyUI.createActivityCard('Assistant Metrics', 'Clippit Tamagotchi');
			this.render();
		}

		feed() {
			this.pet.hunger = Math.max(0, this.pet.hunger - 40);
			this.pet.happiness = Math.min(100, this.pet.happiness + 15);
			this.pet.xp += 15;
			ActivitiesManager.savePetState(this.pet);
			if (window.ClippyAudio) window.ClippyAudio.play('win');
			this.render('Paperclips supplied! Reserves replenished (+15 XP).');
		}

		polish() {
			this.pet.happiness = Math.min(100, this.pet.happiness + 25);
			this.pet.xp += 10;
			ActivitiesManager.savePetState(this.pet);
			if (window.ClippyAudio) window.ClippyAudio.play('action');
			this.render('Wire polished! Morale increased (+10 XP).');
		}

		sleep() {
			this.pet.energy = 100;
			this.pet.hunger = Math.min(100, this.pet.hunger + 10);
			this.pet.xp += 10;
			ActivitiesManager.savePetState(this.pet);
			if (window.ClippyAudio) window.ClippyAudio.play('action');
			this.render('Low-power standby complete. Battery restored to 100%.');
		}

		render(notice = '') {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const scoreboard = document.createElement('div');
			scoreboard.className = 'clippy-scoreboard';
			scoreboard.innerHTML = `
				<div class="clippy-score-item"><span>Level</span><strong>${this.pet.level}</strong></div>
				<div class="clippy-score-item"><span>XP</span><strong>${this.pet.xp} / ${this.pet.level * 50}</strong></div>
				<div class="clippy-score-item"><span>Health</span><strong>Nominal</strong></div>
			`;
			body.appendChild(scoreboard);

			if (notice) {
				const banner = document.createElement('div');
				banner.className = 'clippy-activity-banner win';
				banner.textContent = notice;
				body.appendChild(banner);
			}

			const meter = document.createElement('div');
			meter.className = 'clippy-pet-meter';
			meter.innerHTML = `
				<div class="clippy-pet-row"><span>Morale:</span><strong>${this.pet.happiness}%</strong></div>
				<div class="clippy-pet-bar"><div class="clippy-pet-bar-fill happiness" style="width:${this.pet.happiness}%"></div></div>
				<div class="clippy-pet-row"><span>Energy:</span><strong>${this.pet.energy}%</strong></div>
				<div class="clippy-pet-bar"><div class="clippy-pet-bar-fill energy" style="width:${this.pet.energy}%"></div></div>
				<div class="clippy-pet-row"><span>Depletion:</span><strong>${this.pet.hunger}%</strong></div>
				<div class="clippy-pet-bar"><div class="clippy-pet-bar-fill hunger" style="width:${this.pet.hunger}%"></div></div>
			`;
			body.appendChild(meter);

			const actions = document.createElement('div');
			actions.className = 'clippy-actions-bar';

			const feedBtn = document.createElement('button');
			feedBtn.type = 'button';
			feedBtn.className = 'clippy-action-btn';
			feedBtn.textContent = 'Supply Paperclips';
			feedBtn.addEventListener('click', () => this.feed());
			actions.appendChild(feedBtn);

			const polishBtn = document.createElement('button');
			polishBtn.type = 'button';
			polishBtn.className = 'clippy-action-btn';
			polishBtn.textContent = 'Polish Metal Wire';
			polishBtn.addEventListener('click', () => this.polish());
			actions.appendChild(polishBtn);

			const sleepBtn = document.createElement('button');
			sleepBtn.type = 'button';
			sleepBtn.className = 'clippy-action-btn';
			sleepBtn.textContent = 'Standby Mode';
			sleepBtn.addEventListener('click', () => this.sleep());
			actions.appendChild(sleepBtn);

			body.appendChild(actions);
			window.ClippyUI.scrollLogToBottom();
		}
	}

	const ActivitiesManager = {
		activePomodoroTimer: null,

		tictactoe: new TicTacToeActivity(),
		memory: new MemoryMatchActivity(),
		hangman: new HangmanActivity(),
		quiz: new TechQuizActivity(),
		guess: new GuessNumberActivity(),
		rps: new RockPaperScissorsActivity(),
		mines: new MiniMinesweeperActivity(),
		defrag: new DefragActivity(),
		pomodoro: new PomodoroActivity(),
		todo: new TodoActivity(),
		pet: new PetActivity(),

		evaluateMathExpression(str) {
			let cleaned = str.toLowerCase()
				.replace(/^(evaluate|calc|calculate|compute)\s+/i, '')
				.replace(/\bplanck constant h\b/g, 'h')
				.replace(/\bspeed of light c\b/g, 'c')
				.trim();

			let exp = cleaned
				.replace(/\bhbar\b/g, '(1.054571817e-34)')
				.replace(/\bh\b/g, '(6.62607015e-34)')
				.replace(/\bc_light\b/g, '(299792458)')
				.replace(/\bc\b/g, '(299792458)')
				.replace(/\bg_accel\b/g, '(9.80665)')
				.replace(/\bkb\b/g, '(1.380649e-23)')
				.replace(/\bk_b\b/g, '(1.380649e-23)')
				.replace(/\bna\b/g, '(6.02214076e23)')
				.replace(/\beps0\b/g, '(8.8541878128e-12)')
				.replace(/\bmu0\b/g, '(1.25663706212e-6)')
				.replace(/\bme\b/g, '(9.1093837015e-31)')
				.replace(/\bmp\b/g, '(1.67262192369e-27)')
				.replace(/\bmn\b/g, '(1.67492749804e-27)')
				.replace(/\bqe\b/g, '(1.602176634e-19)')
				.replace(/\bq_e\b/g, '(1.602176634e-19)')
				.replace(/\bsigma_sb\b/g, '(5.670374419e-8)')
				.replace(/\br_gas\b/g, '(8.314462618)')
				.replace(/\bphi\b/g, '(1.618033988749895)')
				.replace(/\balpha_fs\b/g, '(0.0072973525693)')
				.replace(/\basinh\b/g, 'Math.asinh')
				.replace(/\bacosh\b/g, 'Math.acosh')
				.replace(/\batanh\b/g, 'Math.atanh')
				.replace(/\bsinh\b/g, 'Math.sinh')
				.replace(/\bcosh\b/g, 'Math.cosh')
				.replace(/\btanh\b/g, 'Math.tanh')
				.replace(/\basin\b/g, 'Math.asin')
				.replace(/\bacos\b/g, 'Math.acos')
				.replace(/\batan2\b/g, 'Math.atan2')
				.replace(/\batan\b/g, 'Math.atan')
				.replace(/\bsin\b/g, 'Math.sin')
				.replace(/\bcos\b/g, 'Math.cos')
				.replace(/\btan\b/g, 'Math.tan')
				.replace(/\bsqrt\b/g, 'Math.sqrt')
				.replace(/\bcbrt\b/g, 'Math.cbrt')
				.replace(/\bhypot\b/g, 'Math.hypot')
				.replace(/\babs\b/g, 'Math.abs')
				.replace(/\bfloor\b/g, 'Math.floor')
				.replace(/\bceil\b/g, 'Math.ceil')
				.replace(/\bround\b/g, 'Math.round')
				.replace(/\blog10\b/g, 'Math.log10')
				.replace(/\blog2\b/g, 'Math.log2')
				.replace(/\blog\b/g, 'Math.log10')
				.replace(/\bln\b/g, 'Math.log')
				.replace(/\bexp\b/g, 'Math.exp')
				.replace(/\berf\b/g, 'errorFunction')
				.replace(/\bgamma\b/g, 'gammaLanczos')
				.replace(/\bfact\b/g, 'factorialInt')
				.replace(/\bfactorial\b/g, 'factorialInt')
				.replace(/\bpi\b/g, 'Math.PI')
				.replace(/\be\b/g, 'Math.E')
				.replace(/\^/g, '**');

			const allowed = /^[0-9+\-*/(). %**\sMath\.sincotaqrbelgPIEfloundexp210asinhcoshynputGgLanczverFkbaM_]+$/;
			if (!allowed.test(exp)) return null;

			try {
				const evalFn = new Function('gammaLanczos', 'errorFunction', 'factorialInt', `'use strict'; return (${exp})`);
				const result = evalFn(gammaLanczos, errorFunction, factorialInt);
				if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
					if (Math.abs(result) < 1e-4 || Math.abs(result) >= 1e9) {
						return result.toExponential(8);
					}
					return Math.round(result * 100000000) / 100000000;
				}
			} catch (e) {}
			return null;
		},

		parseUnitConversion(text) {
			const match = text.match(/([\d\.eE\+\-]+)\s*(km|mi|miles|mile|meters|meter|m|ft|feet|foot|yd|yards|yard|cm|mm|nm|pm|fm|angstrom|inch|in|au|ly|parsec|pc|kg|lbs|pounds|pound|g|mg|ug|amu|u|slug|solar_mass|oz|ounces|ounce|ton|tons|c|f|k|celsius|fahrenheit|kelvin|rankine|r|tib|gib|mib|kib|tb|gb|mb|kb|bytes|byte|b|bits|bit|kmh|mph|knot|knots|ms|mps|c_light|liters|liter|l|ml|gallons|gallon|gal|floz|bar|mbar|psi|pa|kpa|mpa|atm|torr|mmhg|ev|kev|mev|gev|joules|joule|j|kj|cal|kcal|btu|kwh|erg|watt|w|kw|mw|gw|hp|tesla|t|gauss|g_field|deg|rad|arcmin|arcsec)\s*(?:to|in|en|vers)\s*(km|mi|miles|mile|meters|meter|m|ft|feet|foot|yd|yards|yard|cm|mm|nm|pm|fm|angstrom|inch|in|au|ly|parsec|pc|kg|lbs|pounds|pound|g|mg|ug|amu|u|slug|solar_mass|oz|ounces|ounce|ton|tons|c|f|k|celsius|fahrenheit|kelvin|rankine|r|tib|gib|mib|kib|tb|gb|mb|kb|bytes|byte|b|bits|bit|kmh|mph|knot|knots|ms|mps|c_light|liters|liter|l|ml|gallons|gallon|gal|floz|bar|mbar|psi|pa|kpa|mpa|atm|torr|mmhg|ev|kev|mev|gev|joules|joule|j|kj|cal|kcal|btu|kwh|erg|watt|w|kw|mw|gw|hp|tesla|t|gauss|g_field|deg|rad|arcmin|arcsec)/i);
			if (!match) return null;

			const val = parseFloat(match[1]);
			const from = match[2].toLowerCase();
			const to = match[3].toLowerCase();

			if (isNaN(val)) return null;

			if ((from === 'km') && (to === 'mi' || to === 'miles' || to === 'mile')) return `${val} km = ${(val * 0.621371192).toFixed(6)} miles`;
			if ((from === 'mi' || from === 'miles' || from === 'mile') && to === 'km') return `${val} miles = ${(val * 1.609344).toFixed(6)} km`;
			if ((from === 'm' || from === 'meters' || from === 'meter') && (to === 'ft' || to === 'feet' || to === 'foot')) return `${val} m = ${(val * 3.280839895).toFixed(6)} feet`;
			if ((from === 'ft' || from === 'feet' || from === 'foot') && (to === 'm' || to === 'meters' || to === 'meter')) return `${val} feet = ${(val * 0.3048).toFixed(6)} m`;
			if ((from === 'cm') && (to === 'inch' || to === 'in')) return `${val} cm = ${(val * 0.393700787).toFixed(6)} inches`;
			if ((from === 'inch' || from === 'in') && to === 'cm') return `${val} inches = ${(val * 2.54).toFixed(6)} cm`;
			if (from === 'm' && to === 'au') return `${val} m = ${(val / 1.495978707e11).toExponential(6)} au`;
			if (from === 'au' && to === 'm') return `${val} au = ${(val * 1.495978707e11).toExponential(6)} m`;
			if (from === 'ly' && to === 'm') return `${val} ly = ${(val * 9.4607304725808e15).toExponential(6)} m`;
			if (from === 'm' && to === 'ly') return `${val} m = ${(val / 9.4607304725808e15).toExponential(6)} ly`;

			if ((from === 'kg') && (to === 'lbs' || to === 'pounds' || to === 'pound')) return `${val} kg = ${(val * 2.20462262).toFixed(6)} lbs`;
			if ((from === 'lbs' || from === 'pounds' || from === 'pound') && to === 'kg') return `${val} lbs = ${(val * 0.45359237).toFixed(6)} kg`;
			if ((from === 'c' || from === 'celsius') && (to === 'f' || to === 'fahrenheit')) return `${val} °C = ${((val * 9/5) + 32).toFixed(4)} °F`;
			if ((from === 'f' || from === 'fahrenheit') && (to === 'c' || to === 'celsius')) return `${val} °F = ${(((val - 32) * 5)/9).toFixed(4)} °C`;
			if ((from === 'c' || from === 'celsius') && (to === 'k' || to === 'kelvin')) return `${val} °C = ${(val + 273.15).toFixed(4)} K`;
			if ((from === 'k' || from === 'kelvin') && (to === 'c' || to === 'celsius')) return `${val} K = ${(val - 273.15).toFixed(4)} °C`;

			if ((from === 'ev') && (to === 'joules' || to === 'joule' || to === 'j')) return `${val} eV = ${(val * 1.602176634e-19).toExponential(8)} J`;
			if ((from === 'joules' || from === 'joule' || from === 'j') && to === 'ev') return `${val} J = ${(val / 1.602176634e-19).toExponential(8)} eV`;
			if (from === 'bar' && to === 'psi') return `${val} bar = ${(val * 14.5037738).toFixed(4)} psi`;
			if (from === 'psi' && to === 'bar') return `${val} psi = ${(val * 0.06894757).toFixed(6)} bar`;
			if (from === 'atm' && to === 'pa') return `${val} atm = ${(val * 101325).toFixed(2)} Pa`;
			if (from === 'pa' && to === 'atm') return `${val} Pa = ${(val / 101325).toExponential(6)} atm`;

			if (from === 'tb' && to === 'gb') return `${val} TB = ${val * 1000} GB`;
			if (from === 'tib' && to === 'gib') return `${val} TiB = ${val * 1024} GiB`;
			if (from === 'gb' && to === 'mb') return `${val} GB = ${val * 1000} MB`;
			if (from === 'mb' && to === 'kb') return `${val} MB = ${val * 1000} KB`;
			if (from === 'kb' && (to === 'bytes' || to === 'b')) return `${val} KB = ${val * 1024} Bytes`;

			return null;
		},

		generatePassword(length = 14) {
			const len = Math.max(6, Math.min(64, parseInt(length, 10) || 14));
			const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*()_+-=';
			let res = '';
			for (let i = 0; i < len; i++) {
				res += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return res;
		},

		getStoredTodos() {
			try {
				const raw = window.DeskStorage ? window.DeskStorage.getItem(STORAGE_KEY_TODOS) : localStorage.getItem(STORAGE_KEY_TODOS);
				return raw ? JSON.parse(raw) : [];
			} catch (e) {
				return [];
			}
		},

		saveStoredTodos(todos) {
			try {
				const payload = JSON.stringify(todos);
				if (window.DeskStorage) window.DeskStorage.setItem(STORAGE_KEY_TODOS, payload);
				else localStorage.setItem(STORAGE_KEY_TODOS, payload);
			} catch (e) {}
		},

		getPetState() {
			try {
				const now = Date.now();
				const defaultPet = { hunger: 30, energy: 85, happiness: 85, level: 1, xp: 15, lastUpdate: now };
				const raw = window.DeskStorage ? window.DeskStorage.getItem(STORAGE_KEY_PET) : localStorage.getItem(STORAGE_KEY_PET);
				let pet = raw ? JSON.parse(raw) : defaultPet;

				const elapsedMinutes = Math.min(180, Math.floor((now - (pet.lastUpdate || now)) / 60000));
				if (elapsedMinutes > 0) {
					pet.hunger = Math.min(100, pet.hunger + Math.floor(elapsedMinutes * 0.3));
					pet.energy = Math.max(0, pet.energy - Math.floor(elapsedMinutes * 0.2));
					pet.happiness = Math.max(0, pet.happiness - Math.floor(elapsedMinutes * 0.25));
					pet.lastUpdate = now;
					this.savePetState(pet);
				}
				return pet;
			} catch (e) {
				return { hunger: 30, energy: 85, happiness: 85, level: 1, xp: 15, lastUpdate: Date.now() };
			}
		},

		savePetState(pet) {
			try {
				pet.lastUpdate = Date.now();
				while (pet.xp >= pet.level * 50) {
					pet.xp -= pet.level * 50;
					pet.level++;
				}
				const payload = JSON.stringify(pet);
				if (window.DeskStorage) window.DeskStorage.setItem(STORAGE_KEY_PET, payload);
				else localStorage.setItem(STORAGE_KEY_PET, payload);
			} catch (e) {}
		},

		getScratchpadNote() {
			try {
				return (window.DeskStorage ? window.DeskStorage.getItem(STORAGE_KEY_NOTES) : localStorage.getItem(STORAGE_KEY_NOTES)) || '';
			} catch (e) {
				return '';
			}
		},

		saveScratchpadNote(text) {
			try {
				if (window.DeskStorage) window.DeskStorage.setItem(STORAGE_KEY_NOTES, text);
				else localStorage.setItem(STORAGE_KEY_NOTES, text);
			} catch (e) {}
		}
	};

	window.ClippyActivities = ActivitiesManager;
})();
