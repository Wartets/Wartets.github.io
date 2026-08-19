(function () {
	let activeCalcInstance = null;

	const CalculatorApp = {
		open() {
			const id = 'window-calculator';
			const existing = document.getElementById(id);
			if (existing) {
				if (typeof bringWindowToFront === 'function') bringWindowToFront(existing);
				if (existing.classList.contains('minimized') && typeof unminimizeWindow === 'function') {
					unminimizeWindow(existing);
				}
				return existing;
			}

			const contentHTML = `
				<div class="calc-layout">
					<div class="calc-menubar">
						<ul>
							<li data-calc-menu="edit"><u>E</u>dit</li>
							<li data-calc-menu="view"><u>V</u>iew</li>
							<li data-calc-menu="help"><u>H</u>elp</li>
						</ul>
					</div>
					<div class="calc-body">
						<div class="calc-display-frame">
							<input type="text" class="calc-display" id="calc-display" value="0." readonly>
						</div>
						<div class="calc-top-row">
							<div class="calc-mem-indicator" id="calc-mem-box"></div>
							<button type="button" class="calc-btn calc-btn-red calc-btn-wide" id="calc-btn-backspace">Backspace</button>
							<button type="button" class="calc-btn calc-btn-red calc-btn-wide" id="calc-btn-ce">CE</button>
							<button type="button" class="calc-btn calc-btn-red calc-btn-wide" id="calc-btn-c">C</button>
						</div>
						<div class="calc-main-grid">
							<button type="button" class="calc-btn calc-btn-red" data-op="mc">MC</button>
							<button type="button" class="calc-btn calc-btn-blue" data-num="7">7</button>
							<button type="button" class="calc-btn calc-btn-blue" data-num="8">8</button>
							<button type="button" class="calc-btn calc-btn-blue" data-num="9">9</button>
							<button type="button" class="calc-btn calc-btn-red" data-op="/">/</button>
							<button type="button" class="calc-btn calc-btn-blue" data-op="sqrt">sqrt</button>

							<button type="button" class="calc-btn calc-btn-red" data-op="mr">MR</button>
							<button type="button" class="calc-btn calc-btn-blue" data-num="4">4</button>
							<button type="button" class="calc-btn calc-btn-blue" data-num="5">5</button>
							<button type="button" class="calc-btn calc-btn-blue" data-num="6">6</button>
							<button type="button" class="calc-btn calc-btn-red" data-op="*">*</button>
							<button type="button" class="calc-btn calc-btn-blue" data-op="%">%</button>

							<button type="button" class="calc-btn calc-btn-red" data-op="ms">MS</button>
							<button type="button" class="calc-btn calc-btn-blue" data-num="1">1</button>
							<button type="button" class="calc-btn calc-btn-blue" data-num="2">2</button>
							<button type="button" class="calc-btn calc-btn-blue" data-num="3">3</button>
							<button type="button" class="calc-btn calc-btn-red" data-op="-">-</button>
							<button type="button" class="calc-btn calc-btn-blue" data-op="recip">1/x</button>

							<button type="button" class="calc-btn calc-btn-red" data-op="mplus">M+</button>
							<button type="button" class="calc-btn calc-btn-blue" data-num="0">0</button>
							<button type="button" class="calc-btn calc-btn-blue" data-op="neg">+/-</button>
							<button type="button" class="calc-btn calc-btn-blue" data-op="dot">.</button>
							<button type="button" class="calc-btn calc-btn-red" data-op="+">+</button>
							<button type="button" class="calc-btn calc-btn-red" data-op="=">=</button>
						</div>
					</div>
				</div>
			`;

			const win = createXPWindow(id, 'Calculator', contentHTML, 260, 245, {
				iconSrc: 'https://api.iconify.design/mdi/calculator.svg?color=%231b4b9b',
				resizable: false
			});

			win.querySelector('.xp-window-content').style.padding = '0';
			win.classList.add('calc-window');

			win.dataset.appId = 'calculator';
			this.initCalculatorEngine(win);
			return win;
		},

		initCalculatorEngine(win) {
			const display = win.querySelector('#calc-display');
			const memBox = win.querySelector('#calc-mem-box');

			let currentVal = '0';
			let storedVal = null;
			let pendingOp = null;
			let isNewEntry = true;
			let memoryVal = 0;
			let hasMemory = false;

			const updateDisplay = () => {
				let text = currentVal;
				if (!text.includes('.') && text !== 'Error' && text !== 'Cannot divide by zero') {
					display.value = text + '.';
				} else {
					display.value = text;
				}
				memBox.textContent = hasMemory ? 'M' : '';
			};

			const playClick = () => {
				if (window.SettingsApp && window.SettingsApp.playSound) {
					window.SettingsApp.playSound('click');
				}
			};

			const clearAll = () => {
				currentVal = '0';
				storedVal = null;
				pendingOp = null;
				isNewEntry = true;
				updateDisplay();
			};

			const clearEntry = () => {
				currentVal = '0';
				isNewEntry = true;
				updateDisplay();
			};

			const inputDigit = (digit) => {
				playClick();
				if (isNewEntry) {
					currentVal = digit;
					isNewEntry = false;
				} else {
					if (currentVal.replace('-', '').replace('.', '').length >= 16) return;
					if (currentVal === '0') {
						currentVal = digit;
					} else {
						currentVal += digit;
					}
				}
				updateDisplay();
			};

			const inputDecimal = () => {
				playClick();
				if (isNewEntry) {
					currentVal = '0.';
					isNewEntry = false;
				} else if (!currentVal.includes('.')) {
					currentVal += '.';
				}
				updateDisplay();
			};

			const inputBackspace = () => {
				playClick();
				if (isNewEntry || currentVal === 'Error') return;
				if (currentVal.length > 1) {
					currentVal = currentVal.slice(0, -1);
					if (currentVal === '-' || currentVal === '-0') currentVal = '0';
				} else {
					currentVal = '0';
					isNewEntry = true;
				}
				updateDisplay();
			};

			const negate = () => {
				playClick();
				if (currentVal === '0' || currentVal === 'Error') return;
				if (currentVal.startsWith('-')) {
					currentVal = currentVal.substring(1);
				} else {
					currentVal = '-' + currentVal;
				}
				updateDisplay();
			};

			const executeOp = (a, b, op) => {
				const numA = parseFloat(a);
				const numB = parseFloat(b);
				let res = 0;
				switch (op) {
					case '+':
						res = numA + numB;
						if (window.AchievementsManager) {
							window.AchievementsManager.progress('calc_addition', 1);
						}
						break;
					case '-': res = numA - numB; break;
					case '*': res = numA * numB; break;
					case '/':
						if (numB === 0) return 'Cannot divide by zero';
						res = numA / numB;
						break;
					default: return b;
				}
				const rounded = parseFloat(res.toPrecision(12));
				return String(rounded);
			};

			const handleOperator = (op) => {
				playClick();
				if (currentVal === 'Error' || currentVal === 'Cannot divide by zero') return;

				if (storedVal !== null && pendingOp !== null && !isNewEntry) {
					const result = executeOp(storedVal, currentVal, pendingOp);
					currentVal = result;
					storedVal = result;
					updateDisplay();
					if (result === 'Cannot divide by zero') {
						storedVal = null;
						pendingOp = null;
						return;
					}
				} else {
					storedVal = currentVal;
				}

				pendingOp = op;
				isNewEntry = true;
			};

			const handleEquals = () => {
				playClick();
				if (storedVal === null || pendingOp === null) return;
				const result = executeOp(storedVal, currentVal, pendingOp);
				currentVal = result;
				storedVal = null;
				pendingOp = null;
				isNewEntry = true;
				updateDisplay();
			};

			const handleUnary = (type) => {
				playClick();
				if (currentVal === 'Error' || currentVal === 'Cannot divide by zero') return;
				const val = parseFloat(currentVal);

				if (type === 'sqrt') {
					if (val < 0) {
						currentVal = 'Error';
					} else {
						currentVal = String(parseFloat(Math.sqrt(val).toPrecision(12)));
					}
				} else if (type === 'recip') {
					if (val === 0) {
						currentVal = 'Cannot divide by zero';
					} else {
						currentVal = String(parseFloat((1 / val).toPrecision(12)));
					}
				} else if (type === '%') {
					if (storedVal !== null) {
						const base = parseFloat(storedVal);
						currentVal = String(parseFloat((base * (val / 100)).toPrecision(12)));
					} else {
						currentVal = '0';
					}
				}
				isNewEntry = true;
				updateDisplay();
			};

			const handleMemory = (action) => {
				playClick();
				const val = parseFloat(currentVal) || 0;
				switch (action) {
					case 'mc':
						memoryVal = 0;
						hasMemory = false;
						break;
					case 'mr':
						currentVal = String(memoryVal);
						isNewEntry = true;
						break;
					case 'ms':
						memoryVal = val;
						hasMemory = (val !== 0);
						isNewEntry = true;
						break;
					case 'mplus':
						memoryVal += val;
						hasMemory = (memoryVal !== 0);
						isNewEntry = true;
						break;
				}
				updateDisplay();
			};

			win.getWindowState = () => ({
				currentVal,
				storedVal,
				pendingOp,
				memoryVal,
				hasMemory
			});

			win.querySelectorAll('.calc-btn[data-num]').forEach(btn => {
				btn.addEventListener('click', () => inputDigit(btn.dataset.num));
			});

			win.querySelectorAll('.calc-btn[data-op]').forEach(btn => {
				btn.addEventListener('click', () => {
					const op = btn.dataset.op;
					if (['+', '-', '*', '/'].includes(op)) {
						handleOperator(op);
					} else if (op === '=') {
						handleEquals();
					} else if (op === 'dot') {
						inputDecimal();
					} else if (op === 'neg') {
						negate();
					} else if (['sqrt', 'recip', '%'].includes(op)) {
						handleUnary(op);
					} else if (['mc', 'mr', 'ms', 'mplus'].includes(op)) {
						handleMemory(op);
					}
				});
			});

			win.querySelector('#calc-btn-backspace').addEventListener('click', inputBackspace);
			win.querySelector('#calc-btn-ce').addEventListener('click', clearEntry);
			win.querySelector('#calc-btn-c').addEventListener('click', clearAll);

			const onKeyDown = (e) => {
				if (typeof activeWindow === 'undefined' || activeWindow !== win) return;
				if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
					navigator.clipboard.writeText(currentVal);
					return;
				}
				if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
					navigator.clipboard.readText().then(text => {
						const num = parseFloat(text.trim());
						if (!isNaN(num)) {
							currentVal = String(num);
							isNewEntry = true;
							updateDisplay();
						}
					}).catch(() => {});
					return;
				}

				if (e.key >= '0' && e.key <= '9') {
					e.preventDefault();
					inputDigit(e.key);
				} else if (e.key === '.' || e.key === ',') {
					e.preventDefault();
					inputDecimal();
				} else if (['+', '-', '*', '/'].includes(e.key)) {
					e.preventDefault();
					handleOperator(e.key);
				} else if (e.key === 'Enter' || e.key === '=') {
					e.preventDefault();
					handleEquals();
				} else if (e.key === 'Backspace') {
					e.preventDefault();
					inputBackspace();
				} else if (e.key === 'Escape') {
					e.preventDefault();
					clearAll();
				} else if (e.key === 'Delete') {
					e.preventDefault();
					clearEntry();
				} else if (e.key === '%') {
					e.preventDefault();
					handleUnary('%');
				} else if (e.key === '@') {
					e.preventDefault();
					handleUnary('sqrt');
				} else if (e.key === 'r' || e.key === 'R') {
					e.preventDefault();
					handleUnary('recip');
				} else if (e.key === 'F9') {
					e.preventDefault();
					negate();
				}
			};

			document.addEventListener('keydown', onKeyDown);

			win.addEventListener('transitionend', () => {
				if (win.classList.contains('minimized') || !document.body.contains(win)) {
					document.removeEventListener('keydown', onKeyDown);
				}
			});

			win.querySelectorAll('.calc-menubar li[data-calc-menu]').forEach(menuLi => {
				menuLi.addEventListener('click', (e) => {
					e.stopPropagation();
					const menuType = menuLi.dataset.calcMenu;
					const rect = menuLi.getBoundingClientRect();
					let items = [];

					if (menuType === 'edit') {
						items = [
							{
								label: 'Copy',
								shortcut: 'Ctrl+C',
								action: () => {
									navigator.clipboard.writeText(currentVal);
								}
							},
							{
								label: 'Paste',
								shortcut: 'Ctrl+V',
								action: () => {
									navigator.clipboard.readText().then(text => {
										const num = parseFloat(text.trim());
										if (!isNaN(num)) {
											currentVal = String(num);
											isNewEntry = true;
											updateDisplay();
										}
									}).catch(() => {});
								}
							}
						];
					} else if (menuType === 'view') {
						items = [
							{ label: 'Standard', checked: true, action: () => {} },
							{ label: 'Scientific', checked: false, disabled: true, action: () => {} },
							{ separator: true },
							{ label: 'Digit Grouping', checked: false, disabled: true, action: () => {} }
						];
					} else if (menuType === 'help') {
						items = [
							{ label: 'Help Topics', action: () => window.open('https://github.com/wartets/Wartets.github.io', '_blank') },
							{ separator: true },
							{
								label: 'About Calculator',
								bold: true,
								action: () => {
									showXPDialog('About Calculator', 'Microsoft Windows XP Calculator\nVersion 5.1 (Build 2600.xpsp_sp3_gdr)\nStandard Numeric Engine', 'info');
								}
							}
						];
					}

					if (window.ContextMenu) {
						window.ContextMenu.show(items, rect.left, rect.bottom + 2);
					}
				});
			});

			updateDisplay();
		}
	};

	window.CalculatorApp = CalculatorApp;
	window.openCalculator = () => CalculatorApp.open();
})();
