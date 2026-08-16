(function () {
	const STORAGE_KEY_OPTIONS = 'xp_solitaire_options';
	const STORAGE_KEY_STATS = 'xp_solitaire_stats';

	const SUITS = {
		HEARTS: { id: 'hearts', symbol: '♥', color: 'red', name: 'Hearts' },
		DIAMONDS: { id: 'diamonds', symbol: '♦', color: 'red', name: 'Diamonds' },
		CLUBS: { id: 'clubs', symbol: '♣', color: 'black', name: 'Clubs' },
		SPADES: { id: 'spades', symbol: '♠', color: 'black', name: 'Spades' }
	};

	const SUIT_LIST = [SUITS.HEARTS, SUITS.DIAMONDS, SUITS.CLUBS, SUITS.SPADES];

	const RANKS = [
		{ value: 1, label: 'A', name: 'Ace' },
		{ value: 2, label: '2', name: '2' },
		{ value: 3, label: '3', name: '3' },
		{ value: 4, label: '4', name: '4' },
		{ value: 5, label: '5', name: '5' },
		{ value: 6, label: '6', name: '6' },
		{ value: 7, label: '7', name: '7' },
		{ value: 8, label: '8', name: '8' },
		{ value: 9, label: '9', name: '9' },
		{ value: 10, label: '10', name: '10' },
		{ value: 11, label: 'J', name: 'Jack' },
		{ value: 12, label: 'Q', name: 'Queen' },
		{ value: 13, label: 'K', name: 'King' }
	];

	const CARDBACKS = [
		{ id: 'classic-blue', name: 'Classic Blue Pattern', className: 'back-classic-blue' },
		{ id: 'castle', name: 'Haunted Castle', className: 'back-castle' },
		{ id: 'beach', name: 'Tropical Paradise', className: 'back-beach' },
		{ id: 'hand', name: 'Hand of Cards', className: 'back-hand' },
		{ id: 'robot', name: 'Retro Automaton', className: 'back-robot' },
		{ id: 'fish', name: 'Reef Aquarium', className: 'back-fish' }
	];

	let activeSession = null;

	const SolitaireEngine = {
		open() {
			const windowId = 'window-solitaire';
			const existingWindow = document.getElementById(windowId);
			if (existingWindow) {
				if (typeof bringWindowToFront === 'function') bringWindowToFront(existingWindow);
				if (existingWindow.classList.contains('minimized') && typeof unminimizeWindow === 'function') {
					unminimizeWindow(existingWindow);
				}
				return existingWindow;
			}

			const options = this.loadOptions();
			const layoutMarkup = this.generateLayoutMarkup();
			const win = createXPWindow(windowId, 'Solitaire', layoutMarkup, 680, 520, {
				iconSrc: '../assets/images/desk/icons/Hearts.webp',
				resizable: true
			});

			win.classList.add('solitaire-window');
			const contentContainer = win.querySelector('.xp-window-content');
			if (contentContainer) contentContainer.style.padding = '0';

			this.initSession(win, options);
			return win;
		},

		loadOptions() {
			try {
				const raw = localStorage.getItem(STORAGE_KEY_OPTIONS);
				if (raw) {
					return Object.assign({
						drawMode: 1,
						scoring: 'standard',
						timed: true,
						statusBar: true,
						cardBack: 'classic-blue',
						vegasCumulative: false,
						victoryAnimation: 'random'
					}, JSON.parse(raw));
				}
			} catch (e) {}

			return {
				drawMode: 1,
				scoring: 'standard',
				timed: true,
				statusBar: true,
				cardBack: 'classic-blue',
				vegasCumulative: false,
				victoryAnimation: 'random'
			};
		},

		saveOptions(options) {
			try {
				localStorage.setItem(STORAGE_KEY_OPTIONS, JSON.stringify(options));
			} catch (e) {}
		},

		loadStatistics() {
			try {
				const raw = localStorage.getItem(STORAGE_KEY_STATS);
				if (raw) {
					return JSON.parse(raw);
				}
			} catch (e) {}
			return {
				played: 0,
				won: 0,
				highScore: 0,
				bestTime: 0,
				vegasTotal: 0
			};
		},

		saveStatistics(stats) {
			try {
				localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
			} catch (e) {}
		},

		generateLayoutMarkup() {
			return `
				<div class="solitaire-layout" id="sol-root">
					<div class="solitaire-menubar">
						<ul>
							<li data-action="menu-game"><u>G</u>ame</li>
							<li data-action="menu-help"><u>H</u>elp</li>
						</ul>
					</div>

					<div class="solitaire-board" id="sol-board">
						<div class="solitaire-top-row">
							<div class="solitaire-deck-area">
								<div class="solitaire-slot empty-stock" id="sol-slot-stock" title="Stock Pile"></div>
								<div class="solitaire-slot" id="sol-slot-waste" title="Waste Pile"></div>
							</div>
							<div class="solitaire-foundations-area">
								<div class="solitaire-slot empty-foundation" id="sol-f-0" data-f-idx="0">♥</div>
								<div class="solitaire-slot empty-foundation" id="sol-f-1" data-f-idx="1">♦</div>
								<div class="solitaire-slot empty-foundation" id="sol-f-2" data-f-idx="2">♣</div>
								<div class="solitaire-slot empty-foundation" id="sol-f-3" data-f-idx="3">♠</div>
							</div>
						</div>

						<div class="solitaire-tableau-row" id="sol-tableau">
							<div class="solitaire-column" data-col="0"></div>
							<div class="solitaire-column" data-col="1"></div>
							<div class="solitaire-column" data-col="2"></div>
							<div class="solitaire-column" data-col="3"></div>
							<div class="solitaire-column" data-col="4"></div>
							<div class="solitaire-column" data-col="5"></div>
							<div class="solitaire-column" data-col="6"></div>
						</div>
					</div>

					<div class="solitaire-statusbar" id="sol-statusbar">
						<div class="solitaire-sb-pane solitaire-sb-score">Score: <span id="sol-sb-score">0</span></div>
						<div class="solitaire-sb-pane solitaire-sb-time">Time: <span id="sol-sb-time">0</span></div>
						<div class="solitaire-sb-pane solitaire-sb-deals">Draw: <span id="sol-sb-draw">1</span></div>
						<div class="solitaire-sb-pane solitaire-sb-status" id="sol-sb-status">Ready</div>
					</div>
				</div>
			`;
		},

		initSession(win, options) {
			this.stopVictoryAnimation();
			if (activeSession && activeSession.timerInterval) {
				clearInterval(activeSession.timerInterval);
			}
			if (activeSession && activeSession.autoCompleteInterval) {
				clearInterval(activeSession.autoCompleteInterval);
			}

			activeSession = {
				win: win,
				options: options,
				deck: [],
				stock: [],
				waste: [],
				foundations: [[], [], [], []],
				tableau: [[], [], [], [], [], [], []],
				history: [],
				score: options.scoring === 'vegas' ? -52 : 0,
				timeElapsed: 0,
				timerInterval: null,
				gameStarted: false,
				passesCount: 0,
				selectedCardData: null,
				dragState: null,
				isWon: false,
				autoCompleting: false,
				autoCompleteInterval: null,
				winAnimationId: null,
				spriteCache: new Map()
			};

			this.bindMenuCommands(win);
			this.bindGlobalKeyboard(win);
			this.bindBoardInteractions(win);
			this.startNewDeal();
		},

		stopVictoryAnimation() {
			if (!activeSession) return;
			if (activeSession.winAnimationId) {
				cancelAnimationFrame(activeSession.winAnimationId);
				activeSession.winAnimationId = null;
			}
			if (activeSession.win) {
				const existingCanvas = activeSession.win.querySelector('.solitaire-win-canvas');
				if (existingCanvas) existingCanvas.remove();
			}
		},

		buildFullShuffledDeck() {
			const deck = [];
			let id = 1;
			SUIT_LIST.forEach(suit => {
				RANKS.forEach(rank => {
					deck.push({
						id: `c_${id++}`,
						suit: suit.id,
						suitSymbol: suit.symbol,
						color: suit.color,
						rank: rank.value,
						rankLabel: rank.label,
						faceUp: false
					});
				});
			});

			for (let i = deck.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				const temp = deck[i];
				deck[i] = deck[j];
				deck[j] = temp;
			}

			return deck;
		},

		startNewDeal() {
			if (!activeSession) return;
			this.stopVictoryAnimation();
			if (activeSession.timerInterval) clearInterval(activeSession.timerInterval);
			if (activeSession.autoCompleteInterval) clearInterval(activeSession.autoCompleteInterval);

			const existingAutoBtn = activeSession.win.querySelector('#sol-btn-autocomplete');
			if (existingAutoBtn) existingAutoBtn.remove();

			const stats = this.loadStatistics();
			stats.played++;
			this.saveStatistics(stats);

			const fullDeck = this.buildFullShuffledDeck();

			activeSession.deck = fullDeck;
			activeSession.stock = [];
			activeSession.waste = [];
			activeSession.foundations = [[], [], [], []];
			activeSession.tableau = [[], [], [], [], [], [], []];
			activeSession.history = [];
			activeSession.score = activeSession.options.scoring === 'vegas' ? -52 : 0;
			activeSession.timeElapsed = 0;
			activeSession.gameStarted = false;
			activeSession.passesCount = 0;
			activeSession.selectedCardData = null;
			activeSession.isWon = false;
			activeSession.autoCompleting = false;

			let cardPointer = 0;
			for (let col = 0; col < 7; col++) {
				for (let row = 0; row <= col; row++) {
					const card = fullDeck[cardPointer++];
					card.faceUp = (row === col);
					activeSession.tableau[col].push(card);
				}
			}

			while (cardPointer < fullDeck.length) {
				const card = fullDeck[cardPointer++];
				card.faceUp = false;
				activeSession.stock.push(card);
			}

			this.renderFullBoard();
			this.updateStatusBar();

			const sb = activeSession.win.querySelector('#sol-statusbar');
			if (sb) sb.style.display = activeSession.options.statusBar ? 'flex' : 'none';
		},

		canAutoComplete() {
			if (!activeSession || activeSession.isWon || activeSession.autoCompleting) return false;
			if (activeSession.stock.length > 0 || activeSession.waste.length > 0) return false;

			let totalTableauCards = 0;
			for (let col = 0; col < 7; col++) {
				const pile = activeSession.tableau[col];
				for (let i = 0; i < pile.length; i++) {
					if (!pile[i].faceUp) return false;
					totalTableauCards++;
				}
			}

			return totalTableauCards > 0;
		},

		triggerAutoComplete() {
			if (!this.canAutoComplete()) return;
			activeSession.autoCompleting = true;

			const btn = activeSession.win.querySelector('#sol-btn-autocomplete');
			if (btn) btn.remove();

			this.startClock();

			activeSession.autoCompleteInterval = setInterval(() => {
				let moved = false;

				for (let col = 0; col < 7; col++) {
					const pile = activeSession.tableau[col];
					if (pile.length === 0) continue;
					const card = pile[pile.length - 1];

					for (let fIdx = 0; fIdx < 4; fIdx++) {
						if (this.isFoundationMoveValid(card, fIdx)) {
							const sourceLoc = { type: 'tableau', col: col, index: pile.length - 1 };
							const destLoc = { type: 'foundation', index: fIdx };
							this.applyCardMovement(sourceLoc, destLoc, [card]);
							moved = true;
							break;
						}
					}
					if (moved) break;
				}

				if (!moved || activeSession.isWon) {
					clearInterval(activeSession.autoCompleteInterval);
					activeSession.autoCompleteInterval = null;
					activeSession.autoCompleting = false;
					this.verifyVictoryState();
				}
			}, 90);
		},

		updateAutoCompleteButton() {
			if (!activeSession || !activeSession.win) return;
			const board = activeSession.win.querySelector('#sol-board');
			if (!board) return;

			let btn = board.querySelector('#sol-btn-autocomplete');

			if (this.canAutoComplete()) {
				if (!btn) {
					btn = document.createElement('button');
					btn.type = 'button';
					btn.id = 'sol-btn-autocomplete';
					btn.className = 'solitaire-autocomplete-btn';
					btn.innerHTML = '<span>⚡ Auto-Complete</span>';
					btn.onclick = (e) => {
						e.stopPropagation();
						this.triggerAutoComplete();
					};
					board.appendChild(btn);
				}
			} else {
				if (btn) btn.remove();
			}
		},

		startClock() {
			if (activeSession.gameStarted) return;
			activeSession.gameStarted = true;
			if (!activeSession.options.timed) return;

			activeSession.timerInterval = setInterval(() => {
				activeSession.timeElapsed++;
				const timeLabel = activeSession.win.querySelector('#sol-sb-time');
				if (timeLabel) timeLabel.textContent = String(activeSession.timeElapsed);

				if (activeSession.options.scoring === 'standard' && activeSession.timeElapsed % 10 === 0 && activeSession.score > 2) {
					activeSession.score = Math.max(0, activeSession.score - 2);
					this.updateStatusBar();
				}
			}, 1000);
		},

		snapshotHistory() {
			const cloneCard = (c) => ({ ...c });
			const snapshot = {
				stock: activeSession.stock.map(cloneCard),
				waste: activeSession.waste.map(cloneCard),
				foundations: activeSession.foundations.map(f => f.map(cloneCard)),
				tableau: activeSession.tableau.map(t => t.map(cloneCard)),
				score: activeSession.score,
				passesCount: activeSession.passesCount
			};
			activeSession.history.push(snapshot);
			if (activeSession.history.length > 50) {
				activeSession.history.shift();
			}
		},

		executeUndo() {
			if (!activeSession || activeSession.history.length === 0 || activeSession.isWon) return;
			const state = activeSession.history.pop();
			activeSession.stock = state.stock;
			activeSession.waste = state.waste;
			activeSession.foundations = state.foundations;
			activeSession.tableau = state.tableau;
			activeSession.passesCount = state.passesCount;

			if (activeSession.options.scoring === 'standard') {
				activeSession.score = Math.max(0, state.score - 2);
			} else {
				activeSession.score = state.score;
			}

			activeSession.selectedCardData = null;
			this.renderFullBoard();
			this.updateStatusBar();

			if (window.SettingsApp && window.SettingsApp.playSound) {
				window.SettingsApp.playSound('click');
			}
		},

		triggerStockDraw() {
			this.startClock();
			this.snapshotHistory();

			if (activeSession.stock.length > 0) {
				const takeCount = Math.min(activeSession.options.drawMode, activeSession.stock.length);
				for (let i = 0; i < takeCount; i++) {
					const card = activeSession.stock.pop();
					card.faceUp = true;
					activeSession.waste.push(card);
				}
			} else {
				if (activeSession.waste.length === 0) return;

				if (activeSession.options.scoring === 'vegas') {
					if (activeSession.options.drawMode === 1) {
						return;
					}
					if (activeSession.options.drawMode === 3 && activeSession.passesCount >= 2) {
						return;
					}
				}

				while (activeSession.waste.length > 0) {
					const card = activeSession.waste.pop();
					card.faceUp = false;
					activeSession.stock.push(card);
				}

				activeSession.passesCount++;

				if (activeSession.options.scoring === 'standard') {
					if (activeSession.options.drawMode === 1) {
						activeSession.score = Math.max(0, activeSession.score - 100);
					} else if (activeSession.passesCount > 3) {
						activeSession.score = Math.max(0, activeSession.score - 20);
					}
				}
			}

			activeSession.selectedCardData = null;
			this.renderFullBoard();
			this.updateStatusBar();

			if (window.SettingsApp && window.SettingsApp.playSound) {
				window.SettingsApp.playSound('click');
			}
		},

		getCardBackClass() {
			const backId = activeSession.options.cardBack || 'classic-blue';
			const match = CARDBACKS.find(c => c.id === backId);
			return match ? match.className : 'back-classic-blue';
		},

		createCardElement(card, loc) {
			const el = document.createElement('div');
			el.className = `solitaire-card ${card.color} ${card.faceUp ? 'face-up' : `face-down ${this.getCardBackClass()}`}`;
			el.id = card.id;
			el.dataset.cardId = card.id;
			el.dataset.srcType = loc.type;
			if (loc.index !== undefined) el.dataset.srcIndex = String(loc.index);
			if (loc.col !== undefined) el.dataset.srcCol = String(loc.col);

			if (card.faceUp) {
				el.innerHTML = `
					<div class="solitaire-card-corner-top">
						<span>${card.rankLabel}</span>
						<span class="solitaire-card-suit-small">${card.suitSymbol}</span>
					</div>
					<div class="solitaire-card-center">${card.suitSymbol}</div>
					<div class="solitaire-card-corner-bottom">
						<span>${card.rankLabel}</span>
						<span class="solitaire-card-suit-small">${card.suitSymbol}</span>
					</div>
				`;
			}

			return el;
		},

		renderFullBoard() {
			if (!activeSession || !activeSession.win) return;
			const board = activeSession.win.querySelector('#sol-board');
			if (!board) return;

			const stockSlot = board.querySelector('#sol-slot-stock');
			stockSlot.innerHTML = '';
			if (activeSession.stock.length > 0) {
				const topStock = activeSession.stock[activeSession.stock.length - 1];
				const el = this.createCardElement(topStock, { type: 'stock' });
				stockSlot.appendChild(el);
			}

			const wasteSlot = board.querySelector('#sol-slot-waste');
			wasteSlot.innerHTML = '';
			if (activeSession.waste.length > 0) {
				if (activeSession.options.drawMode === 3) {
					const count = activeSession.waste.length;
					const start = Math.max(0, count - 3);
					for (let i = start; i < count; i++) {
						const c = activeSession.waste[i];
						const el = this.createCardElement(c, { type: 'waste', index: i });
						const offset = (i - start) * 16;
						el.style.left = `${offset}px`;
						el.style.zIndex = String(i + 1);
						wasteSlot.appendChild(el);
					}
				} else {
					const topWaste = activeSession.waste[activeSession.waste.length - 1];
					const el = this.createCardElement(topWaste, { type: 'waste', index: activeSession.waste.length - 1 });
					wasteSlot.appendChild(el);
				}
			}

			for (let fIdx = 0; fIdx < 4; fIdx++) {
				const fSlot = board.querySelector(`#sol-f-${fIdx}`);
				fSlot.innerHTML = '';
				const fCards = activeSession.foundations[fIdx];
				if (fCards.length > 0) {
					const topF = fCards[fCards.length - 1];
					const el = this.createCardElement(topF, { type: 'foundation', index: fIdx });
					fSlot.appendChild(el);
				} else {
					const defSuit = SUIT_LIST[fIdx].symbol;
					fSlot.textContent = defSuit;
				}
			}

			for (let col = 0; col < 7; col++) {
				const colContainer = board.querySelector(`.solitaire-column[data-col="${col}"]`);
				colContainer.innerHTML = '';
				const columnCards = activeSession.tableau[col];

				let topPx = 0;
				columnCards.forEach((card, rIdx) => {
					const el = this.createCardElement(card, { type: 'tableau', col: col, index: rIdx });
					el.style.top = `${topPx}px`;
					el.style.zIndex = String(rIdx + 1);
					colContainer.appendChild(el);
					topPx += card.faceUp ? 18 : 6;
				});
			}

			if (activeSession.selectedCardData) {
				const selectedId = activeSession.selectedCardData.card.id;
				const selEl = board.querySelector(`.solitaire-card[data-card-id="${selectedId}"]`);
				if (selEl) selEl.classList.add('selected');
			}

			this.updateAutoCompleteButton();
		},

		bindBoardInteractions(win) {
			const board = win.querySelector('#sol-board');
			if (!board) return;

			let dragContainer = null;
			let isMouseDown = false;
			let startX = 0;
			let startY = 0;
			let isDragging = false;
			let grabbedCards = [];
			let grabbedSource = null;
			let dragOffsetLeft = 0;
			let dragOffsetTop = 0;
			let hiddenSourceElements = [];
			let lastTapTime = 0;
			let lastTapCardId = null;

			const onPointerDown = (e) => {
				if (e.button !== 0 || activeSession.isWon || activeSession.autoCompleting) return;

				const stockTarget = e.target.closest('#sol-slot-stock');
				if (stockTarget) {
					e.preventDefault();
					this.triggerStockDraw();
					return;
				}

				const cardEl = e.target.closest('.solitaire-card');
				if (!cardEl) {
					const colEl = e.target.closest('.solitaire-column');
					const fEl = e.target.closest('.solitaire-slot[data-f-idx]');

					if (activeSession.selectedCardData) {
						if (colEl) {
							const colIdx = parseInt(colEl.dataset.col, 10);
							if (this.isTableauMoveValid(activeSession.selectedCardData.card, colIdx)) {
								const stack = this.extractStackFromSource(activeSession.selectedCardData);
								this.applyCardMovement(activeSession.selectedCardData, { type: 'tableau', col: colIdx }, stack);
								activeSession.selectedCardData = null;
								return;
							}
						} else if (fEl) {
							const fIdx = parseInt(fEl.dataset.fIdx, 10);
							if (this.isFoundationMoveValid(activeSession.selectedCardData.card, fIdx)) {
								const stack = [activeSession.selectedCardData.card];
								this.applyCardMovement(activeSession.selectedCardData, { type: 'foundation', index: fIdx }, stack);
								activeSession.selectedCardData = null;
								return;
							}
						}
						activeSession.selectedCardData = null;
						this.renderFullBoard();
					}
					return;
				}

				const srcType = cardEl.dataset.srcType;
				const cardId = cardEl.dataset.cardId;
				const cardLookup = this.locateCardById(cardId);
				if (!cardLookup) return;

				if (!cardLookup.card.faceUp) {
					if (srcType === 'tableau') {
						const col = cardLookup.location.col;
						const idx = cardLookup.location.index;
						const pile = activeSession.tableau[col];
						if (idx === pile.length - 1) {
							this.startClock();
							this.snapshotHistory();
							pile[idx].faceUp = true;
							if (activeSession.options.scoring === 'standard') activeSession.score += 5;
							this.renderFullBoard();
							this.updateStatusBar();
							if (window.SettingsApp && window.SettingsApp.playSound) {
								window.SettingsApp.playSound('click');
							}
						}
					}
					return;
				}

				const now = Date.now();
				if (lastTapCardId === cardId && (now - lastTapTime) < 350) {
					lastTapCardId = null;
					lastTapTime = 0;
					isMouseDown = false;
					isDragging = false;
					grabbedCards = [];
					grabbedSource = null;
					activeSession.selectedCardData = null;
					this.executeSmartAutoMove(cardLookup);
					return;
				}
				lastTapCardId = cardId;
				lastTapTime = now;

				if (srcType === 'waste') {
					const wasteCount = activeSession.waste.length;
					if (cardLookup.location.index !== wasteCount - 1) return;
					grabbedCards = [cardLookup.card];
					grabbedSource = { type: 'waste', card: cardLookup.card, index: cardLookup.location.index };
				} else if (srcType === 'foundation') {
					grabbedCards = [cardLookup.card];
					grabbedSource = { type: 'foundation', index: cardLookup.location.index, card: cardLookup.card };
				} else if (srcType === 'tableau') {
					const col = cardLookup.location.col;
					const idx = cardLookup.location.index;
					const pile = activeSession.tableau[col];
					grabbedCards = pile.slice(idx);
					grabbedSource = { type: 'tableau', col: col, index: idx, card: cardLookup.card, count: grabbedCards.length };
				}

				isMouseDown = true;
				isDragging = false;
				startX = e.clientX;
				startY = e.clientY;

				const cardRect = cardEl.getBoundingClientRect();
				dragOffsetLeft = e.clientX - cardRect.left;
				dragOffsetTop = e.clientY - cardRect.top;
			};

			const onPointerMove = (e) => {
				if (!isMouseDown || !grabbedSource) return;

				const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
				if (!isDragging && dist > 3) {
					isDragging = true;
					hiddenSourceElements = [];

					if (grabbedSource.type === 'tableau') {
						const colContainer = board.querySelector(`.solitaire-column[data-col="${grabbedSource.col}"]`);
						if (colContainer) {
							const domCards = Array.from(colContainer.children);
							for (let i = grabbedSource.index; i < domCards.length; i++) {
								domCards[i].classList.add('hidden-drag-source');
								hiddenSourceElements.push(domCards[i]);
							}
						}
					} else if (grabbedSource.type === 'waste') {
						const wasteSlot = board.querySelector('#sol-slot-waste');
						if (wasteSlot && wasteSlot.lastElementChild) {
							wasteSlot.lastElementChild.classList.add('hidden-drag-source');
							hiddenSourceElements.push(wasteSlot.lastElementChild);
						}
					} else if (grabbedSource.type === 'foundation') {
						const fSlot = board.querySelector(`#sol-f-${grabbedSource.index}`);
						if (fSlot && fSlot.lastElementChild) {
							fSlot.lastElementChild.classList.add('hidden-drag-source');
							hiddenSourceElements.push(fSlot.lastElementChild);
						}
					}

					dragContainer = document.createElement('div');
					dragContainer.className = 'solitaire-drag-container';

					let stackTop = 0;
					grabbedCards.forEach((c) => {
						const ghost = this.createCardElement(c, { type: 'drag' });
						ghost.style.top = `${stackTop}px`;
						ghost.style.left = '0px';
						dragContainer.appendChild(ghost);
						stackTop += 18;
					});

					document.body.appendChild(dragContainer);
				}

				if (isDragging && dragContainer) {
					dragContainer.style.left = `${e.clientX - dragOffsetLeft}px`;
					dragContainer.style.top = `${e.clientY - dragOffsetTop}px`;
				}
			};

			const onPointerUp = (e) => {
				if (!isMouseDown) return;
				isMouseDown = false;

				if (isDragging && dragContainer) {
					dragContainer.remove();
					dragContainer = null;
					isDragging = false;

					hiddenSourceElements.forEach(el => el.classList.remove('hidden-drag-source'));
					hiddenSourceElements = [];

					const dropPoint = { x: e.clientX, y: e.clientY };
					const destination = this.resolveDropTarget(dropPoint, grabbedCards[0]);

					if (destination) {
						this.applyCardMovement(grabbedSource, destination, grabbedCards);
					} else {
						this.renderFullBoard();
					}
					grabbedCards = [];
					grabbedSource = null;
					return;
				}

				if (!isDragging && grabbedSource) {
					hiddenSourceElements.forEach(el => el.classList.remove('hidden-drag-source'));
					hiddenSourceElements = [];
					this.handleCardClickAndSelection(grabbedSource);
					grabbedCards = [];
					grabbedSource = null;
				}
			};

			board.addEventListener('mousedown', onPointerDown);
			document.addEventListener('mousemove', onPointerMove);
			document.addEventListener('mouseup', onPointerUp);

			board.addEventListener('dblclick', (e) => {
				if (activeSession.isWon || activeSession.autoCompleting) return;
				const cardEl = e.target.closest('.solitaire-card.face-up');
				if (!cardEl) return;
				const cardLookup = this.locateCardById(cardEl.dataset.cardId);
				if (!cardLookup) return;
				this.executeSmartAutoMove(cardLookup);
			});
		},

		handleCardClickAndSelection(source) {
			if (!activeSession.selectedCardData) {
				activeSession.selectedCardData = source;
				this.renderFullBoard();
				return;
			}

			const prev = activeSession.selectedCardData;
			if (prev.card.id === source.card.id) {
				activeSession.selectedCardData = null;
				this.renderFullBoard();
				return;
			}

			if (source.type === 'tableau') {
				const targetCol = source.col;
				if (this.isTableauMoveValid(prev.card, targetCol)) {
					const movingStack = this.extractStackFromSource(prev);
					this.applyCardMovement(prev, { type: 'tableau', col: targetCol }, movingStack);
					activeSession.selectedCardData = null;
					return;
				}
			} else if (source.type === 'foundation') {
				const targetFIdx = source.index;
				if (prev.card && this.isFoundationMoveValid(prev.card, targetFIdx)) {
					const movingStack = [prev.card];
					this.applyCardMovement(prev, { type: 'foundation', index: targetFIdx }, movingStack);
					activeSession.selectedCardData = null;
					return;
				}
			}

			activeSession.selectedCardData = source;
			this.renderFullBoard();
		},

		extractStackFromSource(source) {
			if (source.type === 'waste') {
				return [source.card];
			}
			if (source.type === 'foundation') {
				return [source.card];
			}
			if (source.type === 'tableau') {
				const pile = activeSession.tableau[source.col];
				return pile.slice(source.index);
			}
			return [source.card];
		},

		executeSmartAutoMove(cardLookup) {
			if (!cardLookup || !cardLookup.card || !cardLookup.card.faceUp) return;
			const card = cardLookup.card;
			const loc = cardLookup.location;

			const movingStack = this.extractStackFromSource({
				type: loc.type,
				col: loc.col,
				index: loc.index,
				card: card
			});

			if (movingStack.length === 1) {
				for (let fIdx = 0; fIdx < 4; fIdx++) {
					if (this.isFoundationMoveValid(card, fIdx)) {
						this.applyCardMovement(loc, { type: 'foundation', index: fIdx }, [card]);
						return;
					}
				}
			}

			let bestTableauCol = -1;
			let bestScore = -Infinity;

			for (let col = 0; col < 7; col++) {
				if (loc.type === 'tableau' && loc.col === col) continue;

				if (this.isTableauMoveValid(card, col)) {
					const targetPile = activeSession.tableau[col];
					let moveScore = 10;

					if (loc.type === 'tableau') {
						const srcPile = activeSession.tableau[loc.col];
						if (loc.index > 0 && !srcPile[loc.index - 1].faceUp) {
							moveScore += 100;
						}
					} else if (loc.type === 'waste') {
						moveScore += 70;
					}

					if (targetPile.length > 0) {
						moveScore += 30;
						moveScore += targetPile.length;
					} else {
						if (card.rank === 13) {
							if (loc.type === 'tableau' && loc.index === 0) {
								moveScore = -100;
							} else {
								moveScore += 20;
							}
						}
					}

					if (moveScore > bestScore) {
						bestScore = moveScore;
						bestTableauCol = col;
					}
				}
			}

			if (bestTableauCol !== -1 && bestScore > 0) {
				this.applyCardMovement(loc, { type: 'tableau', col: bestTableauCol }, movingStack);
			}
		},

		resolveDropTarget(point, cardToDrop) {
			const board = activeSession.win.querySelector('#sol-board');
			if (!board) return null;

			for (let fIdx = 0; fIdx < 4; fIdx++) {
				const fEl = board.querySelector(`#sol-f-${fIdx}`);
				if (fEl) {
					const rect = fEl.getBoundingClientRect();
					if (point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom + 10) {
						if (this.isFoundationMoveValid(cardToDrop, fIdx)) {
							return { type: 'foundation', index: fIdx };
						}
					}
				}
			}

			for (let col = 0; col < 7; col++) {
				const colEl = board.querySelector(`.solitaire-column[data-col="${col}"]`);
				if (colEl) {
					const rect = colEl.getBoundingClientRect();
					if (point.x >= rect.left - 6 && point.x <= rect.right + 6 && point.y >= rect.top - 10 && point.y <= rect.bottom + 150) {
						if (this.isTableauMoveValid(cardToDrop, col)) {
							return { type: 'tableau', col: col };
						}
					}
				}
			}

			return null;
		},

		isFoundationMoveValid(card, fIdx) {
			const pile = activeSession.foundations[fIdx];
			if (pile.length === 0) {
				return card.rank === 1;
			}
			const topCard = pile[pile.length - 1];
			return card.suit === topCard.suit && card.rank === topCard.rank + 1;
		},

		isTableauMoveValid(card, col) {
			const pile = activeSession.tableau[col];
			if (pile.length === 0) {
				return card.rank === 13;
			}
			const topCard = pile[pile.length - 1];
			if (!topCard.faceUp) return false;
			return card.color !== topCard.color && card.rank === topCard.rank - 1;
		},

		applyCardMovement(source, destination, cards) {
			this.startClock();
			this.snapshotHistory();

			if (source.type === 'waste') {
				activeSession.waste.pop();
			} else if (source.type === 'foundation') {
				activeSession.foundations[source.index].pop();
			} else if (source.type === 'tableau') {
				const pile = activeSession.tableau[source.col];
				pile.splice(source.index, cards.length);
				if (pile.length > 0 && !pile[pile.length - 1].faceUp) {
					pile[pile.length - 1].faceUp = true;
					if (activeSession.options.scoring === 'standard') {
						activeSession.score += 5;
					}
				}
			}

			if (destination.type === 'foundation') {
				activeSession.foundations[destination.index].push(cards[0]);
				if (activeSession.options.scoring === 'standard') {
					activeSession.score += 10;
				} else if (activeSession.options.scoring === 'vegas') {
					activeSession.score += 5;
				}
			} else if (destination.type === 'tableau') {
				cards.forEach(c => activeSession.tableau[destination.col].push(c));
				if (activeSession.options.scoring === 'standard') {
					if (source.type === 'waste') {
						activeSession.score += 5;
					} else if (source.type === 'foundation') {
						activeSession.score = Math.max(0, activeSession.score - 15);
					}
				}
			}

			activeSession.selectedCardData = null;
			this.renderFullBoard();
			this.updateStatusBar();

			if (window.SettingsApp && window.SettingsApp.playSound) {
				window.SettingsApp.playSound('click');
			}

			this.verifyVictoryState();
		},

		locateCardById(cardId) {
			if (activeSession.waste.length > 0) {
				const w = activeSession.waste[activeSession.waste.length - 1];
				if (w.id === cardId) return { card: w, location: { type: 'waste', index: activeSession.waste.length - 1 } };
			}

			for (let f = 0; f < 4; f++) {
				const fCards = activeSession.foundations[f];
				if (fCards.length > 0) {
					const c = fCards[fCards.length - 1];
					if (c.id === cardId) return { card: c, location: { type: 'foundation', index: f } };
				}
			}

			for (let col = 0; col < 7; col++) {
				const colCards = activeSession.tableau[col];
				for (let r = 0; r < colCards.length; r++) {
					if (colCards[r].id === cardId) {
						return { card: colCards[r], location: { type: 'tableau', col: col, index: r } };
					}
				}
			}

			return null;
		},

		verifyVictoryState() {
			const totalFoundation = activeSession.foundations.reduce((sum, f) => sum + f.length, 0);
			if (totalFoundation === 52) {
				this.triggerVictorySequence();
			}
		},

		getCardSprite(rankVal, rankLabel, suitSymbol, color) {
			const spriteKey = `${rankVal}_${suitSymbol}_${color}`;
			if (activeSession.spriteCache && activeSession.spriteCache.has(spriteKey)) {
				return activeSession.spriteCache.get(spriteKey);
			}

			const canvas = document.createElement('canvas');
			const w = 72;
			const h = 96;
			const r = 4;
			canvas.width = w;
			canvas.height = h;
			const ctx = canvas.getContext('2d');

			ctx.beginPath();
			ctx.moveTo(r, 0);
			ctx.lineTo(w - r, 0);
			ctx.quadraticCurveTo(w, 0, w, r);
			ctx.lineTo(w, h - r);
			ctx.quadraticCurveTo(w, h, w - r, h);
			ctx.lineTo(r, h);
			ctx.quadraticCurveTo(0, h, 0, h - r);
			ctx.lineTo(0, r);
			ctx.quadraticCurveTo(0, 0, r, 0);
			ctx.closePath();

			ctx.fillStyle = '#ffffff';
			ctx.fill();
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#222222';
			ctx.stroke();

			const textColor = color === 'red' ? '#d00000' : '#000000';
			ctx.fillStyle = textColor;

			ctx.font = 'bold 11px Arial, Tahoma, sans-serif';
			ctx.textAlign = 'left';
			ctx.textBaseline = 'top';
			ctx.fillText(rankLabel, 4, 3);
			ctx.font = '10px Arial, Tahoma, sans-serif';
			ctx.fillText(suitSymbol, 4, 15);

			ctx.save();
			ctx.translate(w, h);
			ctx.rotate(Math.PI);
			ctx.font = 'bold 11px Arial, Tahoma, sans-serif';
			ctx.fillText(rankLabel, 4, 3);
			ctx.font = '10px Arial, Tahoma, sans-serif';
			ctx.fillText(suitSymbol, 4, 15);
			ctx.restore();

			ctx.font = '24px Arial, Tahoma, sans-serif';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(suitSymbol, w / 2, h / 2 + 1);

			if (activeSession.spriteCache) {
				activeSession.spriteCache.set(spriteKey, canvas);
			}
			return canvas;
		},

		triggerVictorySequence() {
			activeSession.isWon = true;
			this.stopVictoryAnimation();
			if (activeSession.timerInterval) clearInterval(activeSession.timerInterval);
			if (activeSession.autoCompleteInterval) clearInterval(activeSession.autoCompleteInterval);

			const btn = activeSession.win.querySelector('#sol-btn-autocomplete');
			if (btn) btn.remove();

			const stats = this.loadStatistics();
			stats.won++;
			if (activeSession.options.timed && activeSession.timeElapsed > 0) {
				const bonus = Math.max(0, Math.floor(700000 / activeSession.timeElapsed));
				activeSession.score += bonus;
			}
			if (activeSession.score > stats.highScore) {
				stats.highScore = activeSession.score;
			}
			if (stats.bestTime === 0 || activeSession.timeElapsed < stats.bestTime) {
				stats.bestTime = activeSession.timeElapsed;
			}
			if (activeSession.options.scoring === 'vegas') {
				stats.vegasTotal += activeSession.score;
			}
			this.saveStatistics(stats);
			this.updateStatusBar();

			if (window.SettingsApp && window.SettingsApp.playSound) {
				window.SettingsApp.playSound('startup');
			}

			const board = activeSession.win.querySelector('#sol-board');
			if (!board) return;

			const canvas = document.createElement('canvas');
			canvas.className = 'solitaire-win-canvas';
			canvas.width = board.clientWidth;
			canvas.height = board.clientHeight;
			board.appendChild(canvas);

			canvas.addEventListener('click', () => {
				this.stopVictoryAnimation();
				showXPDialog('Solitaire', `Game Complete!\nFinal Score: ${activeSession.score}\nTime: ${activeSession.timeElapsed}s`, 'info');
			});

			let mode = activeSession.options.victoryAnimation || 'bouncing';
			if (mode === 'random') {
				const modes = ['bouncing', 'fountain', 'fireworks', 'spiral'];
				mode = modes[Math.floor(Math.random() * modes.length)];
			}

			try {
				const seen = JSON.parse(localStorage.getItem('xp_solitaire_seen_anims') || '[]');
				if (!seen.includes(mode)) {
					seen.push(mode);
					localStorage.setItem('xp_solitaire_seen_anims', JSON.stringify(seen));
				}
				if (window.AchievementsManager) {
					window.AchievementsManager.setProgress('solitaire_animations', seen.length);
				}
			} catch (e) {}

			if (mode === 'fireworks') {
				this.runFireworksAnimation(canvas, board);
			} else if (mode === 'spiral') {
				this.runVortexSpiralAnimation(canvas, board);
			} else if (mode === 'fountain') {
				this.runFountainAnimation(canvas, board);
			} else {
				this.runBouncingCascadeAnimation(canvas, board);
			}
		},

		runBouncingCascadeAnimation(canvas, board) {
			const ctx = canvas.getContext('2d');
			const bRect = board.getBoundingClientRect();
			const cardsQueue = [];

			for (let f = 0; f < 4; f++) {
				const fEl = board.querySelector(`#sol-f-${f}`);
				const rect = fEl ? fEl.getBoundingClientRect() : null;
				const startX = rect ? (rect.left - bRect.left) : (340 + f * 84);
				const startY = rect ? (rect.top - bRect.top) : 12;
				const suit = SUIT_LIST[f];

				for (let rank = 13; rank >= 1; rank--) {
					const rankDef = RANKS[rank - 1];
					const sprite = this.getCardSprite(rank, rankDef.label, suit.symbol, suit.color);
					cardsQueue.push({
						sprite: sprite,
						startX: startX,
						startY: startY,
						x: startX,
						y: startY,
						vx: (Math.random() * 4 + 2) * (f < 2 ? -1 : 1),
						vy: -(Math.random() * 3 + 1.5),
						gravity: 0.65,
						bounce: -0.84
					});
				}
			}

			let currentCardIndex = 0;
			const cardW = 72;
			const cardH = 96;

			const renderFrame = () => {
				if (!activeSession || !activeSession.isWon) return;

				if (currentCardIndex < cardsQueue.length) {
					const card = cardsQueue[currentCardIndex];
					ctx.drawImage(card.sprite, Math.round(card.x), Math.round(card.y));

					card.x += card.vx;
					card.y += card.vy;
					card.vy += card.gravity;

					if (card.y + cardH >= canvas.height) {
						card.y = canvas.height - cardH;
						card.vy *= card.bounce;
						if (Math.abs(card.vy) < 1.2) card.vy = 0;
					}

					if (card.x <= -cardW || card.x >= canvas.width + cardW || (card.y >= canvas.height - cardH && Math.abs(card.vy) < 0.1)) {
						currentCardIndex++;
					}
				}

				if (currentCardIndex < cardsQueue.length) {
					activeSession.winAnimationId = requestAnimationFrame(renderFrame);
				} else {
					activeSession.winAnimationId = null;
					showXPDialog('Solitaire', `Congratulations! You won the game!\nFinal Score: ${activeSession.score}\nTime: ${activeSession.timeElapsed}s`, 'info');
				}
			};

			activeSession.winAnimationId = requestAnimationFrame(renderFrame);
		},

		runFountainAnimation(canvas, board) {
			const ctx = canvas.getContext('2d');
			const bRect = board.getBoundingClientRect();
			const streams = [[], [], [], []];

			for (let f = 0; f < 4; f++) {
				const fEl = board.querySelector(`#sol-f-${f}`);
				const rect = fEl ? fEl.getBoundingClientRect() : null;
				const startX = rect ? (rect.left - bRect.left) : (340 + f * 84);
				const startY = rect ? (rect.top - bRect.top) : 12;
				const suit = SUIT_LIST[f];

				for (let rank = 13; rank >= 1; rank--) {
					const rankDef = RANKS[rank - 1];
					const sprite = this.getCardSprite(rank, rankDef.label, suit.symbol, suit.color);
					streams[f].push({
						sprite: sprite,
						x: startX,
						y: startY,
						vx: (Math.random() * 5 + 2) * (f < 2 ? -1 : 1),
						vy: -(Math.random() * 4 + 2),
						gravity: 0.65,
						bounce: -0.82
					});
				}
			}

			const streamIndices = [0, 0, 0, 0];
			const cardW = 72;
			const cardH = 96;

			const renderFrame = () => {
				if (!activeSession || !activeSession.isWon) return;

				let anyActive = false;

				for (let f = 0; f < 4; f++) {
					const idx = streamIndices[f];
					if (idx < streams[f].length) {
						anyActive = true;
						const card = streams[f][idx];
						ctx.drawImage(card.sprite, Math.round(card.x), Math.round(card.y));

						card.x += card.vx;
						card.y += card.vy;
						card.vy += card.gravity;

						if (card.y + cardH >= canvas.height) {
							card.y = canvas.height - cardH;
							card.vy *= card.bounce;
							if (Math.abs(card.vy) < 1.2) card.vy = 0;
						}

						if (card.x <= -cardW || card.x >= canvas.width + cardW || (card.y >= canvas.height - cardH && Math.abs(card.vy) < 0.1)) {
							streamIndices[f]++;
						}
					}
				}

				if (anyActive) {
					activeSession.winAnimationId = requestAnimationFrame(renderFrame);
				} else {
					activeSession.winAnimationId = null;
					showXPDialog('Solitaire', `Congratulations! You won the game!\nFinal Score: ${activeSession.score}\nTime: ${activeSession.timeElapsed}s`, 'info');
				}
			};

			activeSession.winAnimationId = requestAnimationFrame(renderFrame);
		},

		runFireworksAnimation(canvas, board) {
			const ctx = canvas.getContext('2d');
			const burstCards = [];
			const centerX = canvas.width / 2 - 36;
			const centerY = canvas.height / 2 - 48;
			let count = 0;

			for (let f = 0; f < 4; f++) {
				const suit = SUIT_LIST[f];
				for (let rank = 13; rank >= 1; rank--) {
					const rankDef = RANKS[rank - 1];
					const sprite = this.getCardSprite(rank, rankDef.label, suit.symbol, suit.color);
					const angle = (Math.PI * 2 / 52) * count;
					const speed = (count % 4 + 2) * 2.2;
					burstCards.push({
						sprite: sprite,
						x: centerX,
						y: centerY,
						vx: Math.cos(angle) * speed,
						vy: Math.sin(angle) * speed - 4,
						gravity: 0.35,
						bounce: -0.8,
						active: false,
						delay: Math.floor(count / 4) * 6
					});
					count++;
				}
			}

			let frame = 0;
			const cardW = 72;
			const cardH = 96;

			const renderFrame = () => {
				if (!activeSession || !activeSession.isWon) return;
				frame++;

				let allFinished = true;

				burstCards.forEach(card => {
					if (frame >= card.delay) {
						card.active = true;
					}

					if (card.active) {
						ctx.drawImage(card.sprite, Math.round(card.x), Math.round(card.y));

						card.x += card.vx;
						card.y += card.vy;
						card.vy += card.gravity;

						if (card.y + cardH >= canvas.height) {
							card.y = canvas.height - cardH;
							card.vy *= card.bounce;
							card.vx *= 0.96;
							if (Math.abs(card.vy) < 0.8) card.vy = 0;
						}

						if (card.x <= -cardW || card.x >= canvas.width + cardW) {
							card.active = false;
						} else {
							allFinished = false;
						}
					} else if (frame < card.delay) {
						allFinished = false;
					}
				});

				if (!allFinished && frame < 360) {
					activeSession.winAnimationId = requestAnimationFrame(renderFrame);
				} else {
					activeSession.winAnimationId = null;
					showXPDialog('Solitaire', `Congratulations! You won the game!\nFinal Score: ${activeSession.score}\nTime: ${activeSession.timeElapsed}s`, 'info');
				}
			};

			activeSession.winAnimationId = requestAnimationFrame(renderFrame);
		},

		runVortexSpiralAnimation(canvas, board) {
			const ctx = canvas.getContext('2d');
			const allCards = [];
			let count = 0;

			for (let f = 0; f < 4; f++) {
				const suit = SUIT_LIST[f];
				for (let rank = 13; rank >= 1; rank--) {
					const rankDef = RANKS[rank - 1];
					const sprite = this.getCardSprite(rank, rankDef.label, suit.symbol, suit.color);
					allCards.push({
						sprite: sprite,
						index: count,
						fIndex: f,
						x: 0,
						y: 0
					});
					count++;
				}
			}

			let frame = 0;
			const totalFrames = 320;
			const centerX = canvas.width / 2 - 36;
			const centerY = canvas.height / 2 - 48;
			const maxRadius = Math.min(canvas.width, canvas.height) * 0.42;

			const renderFrame = () => {
				if (!activeSession || !activeSession.isWon) return;
				frame++;

				const angleBase = frame * 0.04;
				const currentCard = allCards[frame % allCards.length];
				const currentAngle = angleBase + (currentCard.index * 0.22);
				const radius = maxRadius * (0.4 + 0.6 * Math.sin(frame * 0.02));

				currentCard.x = centerX + Math.cos(currentAngle) * radius;
				currentCard.y = centerY + Math.sin(currentAngle) * (radius * 0.6);

				ctx.drawImage(currentCard.sprite, Math.round(currentCard.x), Math.round(currentCard.y));

				if (frame < totalFrames) {
					activeSession.winAnimationId = requestAnimationFrame(renderFrame);
				} else {
					activeSession.winAnimationId = null;
					showXPDialog('Solitaire', `Congratulations! You won the game!\nFinal Score: ${activeSession.score}\nTime: ${activeSession.timeElapsed}s`, 'info');
				}
			};

			activeSession.winAnimationId = requestAnimationFrame(renderFrame);
		},

		updateStatusBar() {
			if (!activeSession || !activeSession.win) return;
			const scoreEl = activeSession.win.querySelector('#sol-sb-score');
			const timeEl = activeSession.win.querySelector('#sol-sb-time');
			const drawEl = activeSession.win.querySelector('#sol-sb-draw');
			const statusEl = activeSession.win.querySelector('#sol-sb-status');

			if (scoreEl) {
				if (activeSession.options.scoring === 'none') {
					scoreEl.parentElement.style.display = 'none';
				} else {
					scoreEl.parentElement.style.display = 'flex';
					scoreEl.textContent = activeSession.options.scoring === 'vegas' 
						? (activeSession.score < 0 ? `-$${Math.abs(activeSession.score)}` : `$${activeSession.score}`)
						: String(activeSession.score);
				}
			}

			if (timeEl) {
				if (!activeSession.options.timed) {
					timeEl.parentElement.style.display = 'none';
				} else {
					timeEl.parentElement.style.display = 'flex';
					timeEl.textContent = String(activeSession.timeElapsed);
				}
			}

			if (drawEl) drawEl.textContent = String(activeSession.options.drawMode);
			if (statusEl) {
				statusEl.textContent = activeSession.isWon ? 'Game Won!' : (activeSession.gameStarted ? 'Playing' : 'Ready');
			}
		},

		bindGlobalKeyboard(win) {
			win.addEventListener('keydown', (e) => {
				if (e.key === 'F2') {
					e.preventDefault();
					this.startNewDeal();
				} else if (e.ctrlKey && e.key.toLowerCase() === 'z') {
					e.preventDefault();
					this.executeUndo();
				}
			});
		},

		bindMenuCommands(win) {
			win.querySelectorAll('.solitaire-menubar li').forEach(li => {
				li.onclick = (e) => {
					e.stopPropagation();
					const rect = li.getBoundingClientRect();
					const act = li.dataset.action;
					if (act === 'menu-game') {
						this.displayGameMenu(rect.left, rect.bottom + 2);
					} else if (act === 'menu-help') {
						this.displayHelpMenu(rect.left, rect.bottom + 2);
					}
				};
			});
		},

		displayGameMenu(x, y) {
			if (!window.ContextMenu) return;
			const items = [
				{ label: 'Deal', shortcut: 'F2', bold: true, action: () => this.startNewDeal() },
				{ label: 'Undo', shortcut: 'Ctrl+Z', disabled: activeSession.history.length === 0 || activeSession.isWon, action: () => this.executeUndo() },
				{
					label: 'Auto Complete',
					disabled: !this.canAutoComplete(),
					action: () => this.triggerAutoComplete()
				},
				{ separator: true },
				{ label: 'Deck...', action: () => this.showCardBackSelectorDialog() },
				{ label: 'Options...', action: () => this.showOptionsDialog() },
				{ label: 'Statistics...', action: () => this.showStatisticsDialog() },
				{ separator: true },
				{ label: 'Exit', action: () => { if (typeof closeWindow === 'function') closeWindow(activeSession.win, activeSession.win.id); } }
			];
			window.ContextMenu.show(items, x, y);
		},

		displayHelpMenu(x, y) {
			if (!window.ContextMenu) return;
			const items = [
				{
					label: 'Contents and Rules',
					action: () => {
						showXPDialog('Solitaire Rules', 'Object of the Game:\nBuild four stacks of cards, one for each suit, in ascending rank from Ace to King in the foundations.\n\nTableau Columns:\nCards must be stacked in descending order with alternating colors (Red on Black, Black on Red).\n\nOnly Kings can fill an empty tableau column.', 'info');
					}
				},
				{ separator: true },
				{
					label: 'About Solitaire',
					bold: true,
					action: () => {
						showXPDialog('About Solitaire', 'Mircosoft Windows XP Solitaire\nKlondike Edition 5.1\nAuthentic Desktop Card Simulator Engine', 'info');
					}
				}
			];
			window.ContextMenu.show(items, x, y);
		},

		showCardBackSelectorDialog() {
			const id = 'dialog-sol-cardback';
			const existing = document.getElementById(id);
			if (existing) return;

			let pickedBack = activeSession.options.cardBack || 'classic-blue';

			let htmlGrid = '';
			CARDBACKS.forEach(cb => {
				const isSel = cb.id === pickedBack;
				htmlGrid += `
					<div class="solitaire-cardback-option ${isSel ? 'selected' : ''}" data-cb-id="${cb.id}">
						<div class="solitaire-cardback-thumb solitaire-card face-down ${cb.className}"></div>
						<span style="font-size:11px; text-align:center;">${cb.name}</span>
					</div>
				`;
			});

			const contentHTML = `
				<div style="padding:12px; display:flex; flex-direction:column; gap:10px; font-family:'Tahoma',sans-serif; font-size:11px;">
					<div>Select a card back design for the deck:</div>
					<div class="solitaire-cardbacks-grid" id="sol-cb-grid">
						${htmlGrid}
					</div>
					<div style="display:flex; justify-content:flex-end; gap:6px; margin-top:8px;">
						<button type="button" class="xp-button" id="sol-cb-btn-ok">OK</button>
						<button type="button" class="xp-button" id="sol-cb-btn-cancel">Cancel</button>
					</div>
				</div>
			`;

			const dlg = createXPWindow(id, 'Select Card Back', contentHTML, 380, 310, {
				iconSrc: '../assets/images/desk/icons/Hearts.webp',
				resizable: false,
				isModal: true
			});

			const grid = dlg.querySelector('#sol-cb-grid');
			grid.querySelectorAll('.solitaire-cardback-option').forEach(el => {
				el.onclick = () => {
					grid.querySelectorAll('.solitaire-cardback-option').forEach(o => o.classList.remove('selected'));
					el.classList.add('selected');
					pickedBack = el.dataset.cbId;
					if (window.SettingsApp && window.SettingsApp.playSound) {
						window.SettingsApp.playSound('click');
					}
				};
			});

			dlg.querySelector('#sol-cb-btn-ok').onclick = () => {
				activeSession.options.cardBack = pickedBack;
				this.saveOptions(activeSession.options);
				this.renderFullBoard();
				closeWindow(dlg, id);
			};

			dlg.querySelector('#sol-cb-btn-cancel').onclick = () => {
				closeWindow(dlg, id);
			};
		},

		showOptionsDialog() {
			const id = 'dialog-sol-options';
			const existing = document.getElementById(id);
			if (existing) return;

			const cur = activeSession.options;
			const winAnim = cur.victoryAnimation || 'random';

			const contentHTML = `
				<div style="padding:14px; display:flex; flex-direction:column; gap:10px; font-family:'Tahoma',sans-serif; font-size:11px;">
					<fieldset class="xp-groupbox">
						<legend>Draw</legend>
						<label class="xp-checkbox-row"><input type="radio" name="sol_opt_draw" value="1" ${cur.drawMode === 1 ? 'checked' : ''}> Draw One</label>
						<label class="xp-checkbox-row"><input type="radio" name="sol_opt_draw" value="3" ${cur.drawMode === 3 ? 'checked' : ''}> Draw Three</label>
					</fieldset>

					<fieldset class="xp-groupbox">
						<legend>Scoring</legend>
						<label class="xp-checkbox-row"><input type="radio" name="sol_opt_score" value="standard" ${cur.scoring === 'standard' ? 'checked' : ''}> Standard</label>
						<label class="xp-checkbox-row"><input type="radio" name="sol_opt_score" value="vegas" ${cur.scoring === 'vegas' ? 'checked' : ''}> Vegas</label>
						<label class="xp-checkbox-row"><input type="radio" name="sol_opt_score" value="none" ${cur.scoring === 'none' ? 'checked' : ''}> None</label>
					</fieldset>

					<fieldset class="xp-groupbox">
						<legend>Options</legend>
						<label class="xp-checkbox-row"><input type="checkbox" id="sol_opt_timed" ${cur.timed ? 'checked' : ''}> Timed game</label>
						<label class="xp-checkbox-row"><input type="checkbox" id="sol_opt_status" ${cur.statusBar ? 'checked' : ''}> Status bar</label>
						<label class="xp-checkbox-row"><input type="checkbox" id="sol_opt_vegas_cum" ${cur.vegasCumulative ? 'checked' : ''}> Cumulative score (Vegas)</label>
					</fieldset>

					<fieldset class="xp-groupbox">
						<legend>Victory Animation</legend>
						<div class="xp-form-row">
							<label for="sol_opt_anim" style="width: 110px;">Animation:</label>
							<select id="sol_opt_anim" class="xp-select" style="flex: 1;">
								<option value="random" ${winAnim === 'random' ? 'selected' : ''}>Random Selection</option>
								<option value="bouncing" ${winAnim === 'bouncing' ? 'selected' : ''}>Classic Cascade Waterfall</option>
								<option value="fountain" ${winAnim === 'fountain' ? 'selected' : ''}>Quad Foundation Cascade</option>
								<option value="fireworks" ${winAnim === 'fireworks' ? 'selected' : ''}>Radial Burst Cascade</option>
								<option value="spiral" ${winAnim === 'spiral' ? 'selected' : ''}>Wave Ribbon Stream</option>
							</select>
						</div>
					</fieldset>

					<div style="display:flex; justify-content:flex-end; gap:6px; margin-top:6px;">
						<button type="button" class="xp-button" id="sol_opt_btn_ok">OK</button>
						<button type="button" class="xp-button" id="sol_opt_btn_cancel">Cancel</button>
					</div>
				</div>
			`;

			const dlg = createXPWindow(id, 'Options', contentHTML, 340, 420, {
				iconSrc: '../assets/images/desk/icons/Hearts.webp',
				resizable: false,
				isModal: true
			});

			dlg.querySelector('#sol_opt_btn_ok').onclick = () => {
				const drawMode = parseInt(dlg.querySelector('input[name="sol_opt_draw"]:checked').value, 10);
				const scoring = dlg.querySelector('input[name="sol_opt_score"]:checked').value;
				const timed = dlg.querySelector('#sol_opt_timed').checked;
				const statusBar = dlg.querySelector('#sol_opt_status').checked;
				const vegasCumulative = dlg.querySelector('#sol_opt_vegas_cum').checked;
				const victoryAnimation = dlg.querySelector('#sol_opt_anim').value;

				const restartRequired = (drawMode !== cur.drawMode || scoring !== cur.scoring);

				activeSession.options.drawMode = drawMode;
				activeSession.options.scoring = scoring;
				activeSession.options.timed = timed;
				activeSession.options.statusBar = statusBar;
				activeSession.options.vegasCumulative = vegasCumulative;
				activeSession.options.victoryAnimation = victoryAnimation;

				const sb = activeSession.win.querySelector('#sol-statusbar');
				if (sb) sb.style.display = statusBar ? 'flex' : 'none';

				this.saveOptions(activeSession.options);
				closeWindow(dlg, id);

				if (restartRequired) {
					this.startNewDeal();
				}
			};

			dlg.querySelector('#sol_opt_btn_cancel').onclick = () => {
				closeWindow(dlg, id);
			};
		},

		showStatisticsDialog() {
			const stats = this.loadStatistics();
			const winPercent = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
			const vegasStr = stats.vegasTotal < 0 ? `-$${Math.abs(stats.vegasTotal)}` : `$${stats.vegasTotal}`;

			const contentHTML = `
				<div style="padding:14px; display:flex; flex-direction:column; gap:10px; font-family:'Tahoma',sans-serif; font-size:11px;">
					<div class="xp-info-grid">
						<div>Games Played:</div><div><strong>${stats.played}</strong></div>
						<div>Games Won:</div><div><strong>${stats.won}</strong> (${winPercent}%)</div>
						<div>High Score:</div><div><strong>${stats.highScore}</strong></div>
						<div>Best Time:</div><div><strong>${stats.bestTime > 0 ? `${stats.bestTime}s` : 'N/A'}</strong></div>
						<div>Vegas Cumulative:</div><div><strong>${vegasStr}</strong></div>
					</div>
					<div style="display:flex; justify-content:space-between; margin-top:8px;">
						<button type="button" class="xp-button-small" id="sol-stats-reset">Reset</button>
						<button type="button" class="xp-button" id="sol-stats-ok">OK</button>
					</div>
				</div>
			`;

			const dlg = createXPWindow('dialog-sol-stats', 'Solitaire Statistics', contentHTML, 300, 210, {
				iconSrc: '../assets/images/desk/icons/Hearts.webp',
				resizable: false,
				isModal: true
			});

			dlg.querySelector('#sol-stats-reset').onclick = () => {
				this.saveStatistics({ played: 0, won: 0, highScore: 0, bestTime: 0, vegasTotal: 0 });
				closeWindow(dlg, 'dialog-sol-stats');
				this.showStatisticsDialog();
			};

			dlg.querySelector('#sol-stats-ok').onclick = () => {
				closeWindow(dlg, 'dialog-sol-stats');
			};
		},

		cheatWin(animationType) {
			this.open();
			if (!activeSession) return;

			this.stopVictoryAnimation();
			if (activeSession.timerInterval) clearInterval(activeSession.timerInterval);
			if (activeSession.autoCompleteInterval) clearInterval(activeSession.autoCompleteInterval);

			activeSession.stock = [];
			activeSession.waste = [];
			activeSession.tableau = [[], [], [], [], [], [], []];
			activeSession.foundations = [[], [], [], []];

			for (let f = 0; f < 4; f++) {
				const suit = SUIT_LIST[f];
				for (let rank = 1; rank <= 13; rank++) {
					const rankDef = RANKS[rank - 1];
					activeSession.foundations[f].push({
						id: `c_${suit.id}_${rank}`,
						suit: suit.id,
						suitSymbol: suit.symbol,
						color: suit.color,
						rank: rank,
						rankLabel: rankDef.label,
						faceUp: true
					});
				}
			}

			const animMap = {
				cascade: 'bouncing',
				bouncing: 'bouncing',
				waterfall: 'bouncing',
				classic: 'bouncing',
				fountain: 'fountain',
				quad: 'fountain',
				volcano: 'fountain',
				fireworks: 'fireworks',
				burst: 'fireworks',
				radial: 'fireworks',
				spiral: 'spiral',
				vortex: 'spiral',
				wave: 'spiral',
				stream: 'spiral',
				ribbon: 'spiral',
				random: 'random'
			};

			let selectedAnim = 'random';
			if (typeof animationType === 'string') {
				const key = animationType.toLowerCase().trim();
				if (animMap[key]) {
					selectedAnim = animMap[key];
				}
			}

			activeSession.options.victoryAnimation = selectedAnim;
			activeSession.score = 7500;
			if (activeSession.timeElapsed === 0) activeSession.timeElapsed = 42;

			this.renderFullBoard();
			this.updateStatusBar();
			this.triggerVictorySequence();
		}
	};

	window.SolitaireApp = SolitaireEngine;
	window.openSolitaire = () => SolitaireEngine.open();
	window.cheatSolitaire = (anim) => SolitaireEngine.cheatWin(anim);
	window.winSolitaire = (anim) => SolitaireEngine.cheatWin(anim);
	window.solitaireCheat = (anim) => SolitaireEngine.cheatWin(anim);
})();
