(function () {
	const UNICODE_BLOCKS = [
		{ name: 'All', start: 0x0020, end: 0x27BF },
		{ name: 'Basic Latin', start: 0x0020, end: 0x007E },
		{ name: 'Latin-1 Supplement', start: 0x00A0, end: 0x00FF },
		{ name: 'Latin Extended-A', start: 0x0100, end: 0x017F },
		{ name: 'Latin Extended-B', start: 0x0180, end: 0x024F },
		{ name: 'IPA Extensions', start: 0x0250, end: 0x02AF },
		{ name: 'Spacing Modifier Letters', start: 0x02B0, end: 0x02FF },
		{ name: 'Combining Diacritical Marks', start: 0x0300, end: 0x036F },
		{ name: 'Greek and Coptic', start: 0x0370, end: 0x03FF },
		{ name: 'Cyrillic', start: 0x0400, end: 0x04FF },
		{ name: 'Hebrew', start: 0x0590, end: 0x05FF },
		{ name: 'Arabic', start: 0x0600, end: 0x06FF },
		{ name: 'General Punctuation', start: 0x2000, end: 0x206F },
		{ name: 'Currency Symbols', start: 0x20A0, end: 0x20CF },
		{ name: 'Letterlike Symbols', start: 0x2100, end: 0x214F },
		{ name: 'Number Forms', start: 0x2150, end: 0x218F },
		{ name: 'Arrows', start: 0x2190, end: 0x21FF },
		{ name: 'Mathematical Operators', start: 0x2200, end: 0x22FF },
		{ name: 'Miscellaneous Technical', start: 0x2300, end: 0x23FF },
		{ name: 'Box Drawing', start: 0x2500, end: 0x257F },
		{ name: 'Block Elements', start: 0x2580, end: 0x259F },
		{ name: 'Geometric Shapes', start: 0x25A0, end: 0x25FF },
		{ name: 'Miscellaneous Symbols', start: 0x2600, end: 0x26FF },
		{ name: 'Dingbats', start: 0x2700, end: 0x27BF }
	];

	const CHARACTER_NAMES = {
		0x0020: 'Space',
		0x0021: 'Exclamation Mark',
		0x0022: 'Quotation Mark',
		0x0023: 'Number Sign',
		0x0024: 'Dollar Sign',
		0x0025: 'Percent Sign',
		0x0026: 'Ampersand',
		0x0027: 'Apostrophe',
		0x0028: 'Left Parenthesis',
		0x0029: 'Right Parenthesis',
		0x002A: 'Asterisk',
		0x002B: 'Plus Sign',
		0x002C: 'Comma',
		0x002D: 'Hyphen-Minus',
		0x002E: 'Full Stop',
		0x002F: 'Solidus',
		0x003A: 'Colon',
		0x003B: 'Semicolon',
		0x003C: 'Less-Than Sign',
		0x003D: 'Equals Sign',
		0x003E: 'Greater-Than Sign',
		0x003F: 'Question Mark',
		0x0040: 'Commercial At',
		0x005B: 'Left Square Bracket',
		0x005C: 'Reverse Solidus',
		0x005D: 'Right Square Bracket',
		0x005E: 'Circumflex Accent',
		0x005F: 'Low Line',
		0x0060: 'Grave Accent',
		0x007B: 'Left Curly Bracket',
		0x007C: 'Vertical Line',
		0x007D: 'Right Curly Bracket',
		0x007E: 'Tilde',
		0x00A0: 'No-Break Space',
		0x00A1: 'Inverted Exclamation Mark',
		0x00A2: 'Cent Sign',
		0x00A3: 'Pound Sign',
		0x00A4: 'Currency Sign',
		0x00A5: 'Yen Sign',
		0x00A6: 'Broken Bar',
		0x00A7: 'Section Sign',
		0x00A8: 'Diaeresis',
		0x00A9: 'Copyright Sign',
		0x00AA: 'Feminine Ordinal Indicator',
		0x00AB: 'Left-Pointing Double Angle Quotation Mark',
		0x00AC: 'Not Sign',
		0x00AD: 'Soft Hyphen',
		0x00AE: 'Registered Sign',
		0x00AF: 'Macron',
		0x00B0: 'Degree Sign',
		0x00B1: 'Plus-Minus Sign',
		0x00B2: 'Superscript Two',
		0x00B3: 'Superscript Three',
		0x00B4: 'Acute Accent',
		0x00B5: 'Micro Sign',
		0x00B6: 'Pilcrow Sign',
		0x00B7: 'Middle Dot',
		0x00B8: 'Cedilla',
		0x00B9: 'Superscript One',
		0x00BA: 'Masculine Ordinal Indicator',
		0x00BB: 'Right-Pointing Double Angle Quotation Mark',
		0x00BC: 'Vulgar Fraction One Quarter',
		0x00BD: 'Vulgar Fraction One Half',
		0x00BE: 'Vulgar Fraction Three Quarters',
		0x00BF: 'Inverted Question Mark',
		0x00D7: 'Multiplication Sign',
		0x00DF: 'Latin Small Letter Sharp S',
		0x00F7: 'Division Sign',
		0x20AC: 'Euro Sign',
		0x2122: 'Trade Mark Sign',
		0x2190: 'Leftwards Arrow',
		0x2191: 'Upwards Arrow',
		0x2192: 'Rightwards Arrow',
		0x2193: 'Downwards Arrow',
		0x221E: 'Infinity',
		0x2248: 'Almost Equal To',
		0x2260: 'Not Equal To',
		0x2264: 'Less-Than or Equal To',
		0x2265: 'Greater-Than or Equal To',
		0x263A: 'White Smiling Face',
		0x263B: 'Black Smiling Face',
		0x2665: 'Black Heart Suit',
		0x2666: 'Black Diamond Suit',
		0x2663: 'Black Club Suit',
		0x2660: 'Black Spade Suit',
		0x266A: 'Eighth Note',
		0x266B: 'Beamed Eighth Notes'
	};

	const SYSTEM_FONTS = [
		'Arial',
		'Arial Black',
		'Comic Sans MS',
		'Courier New',
		'Franklin Gothic Medium',
		'Georgia',
		'Impact',
		'Lucida Console',
		'Lucida Sans Unicode',
		'Microsoft Sans Serif',
		'Palatino Linotype',
		'Roboto Mono',
		'Segoe UI',
		'Sylfaen',
		'Tahoma',
		'Times New Roman',
		'Trebuchet MS',
		'Verdana'
	];

	function getCharacterName(code) {
		if (CHARACTER_NAMES[code]) {
			return CHARACTER_NAMES[code];
		}
		if (code >= 0x0030 && code <= 0x0039) {
			return `Digit ${String.fromCharCode(code)}`;
		}
		if (code >= 0x0041 && code <= 0x005A) {
			return `Latin Capital Letter ${String.fromCharCode(code)}`;
		}
		if (code >= 0x0061 && code <= 0x007A) {
			return `Latin Small Letter ${String.fromCharCode(code)}`;
		}
		if (code >= 0x00C0 && code <= 0x00D6) {
			return `Latin Capital Letter with Diacritic (${String.fromCharCode(code)})`;
		}
		if (code >= 0x00D8 && code <= 0x00DE) {
			return `Latin Capital Letter (${String.fromCharCode(code)})`;
		}
		if (code >= 0x00E0 && code <= 0x00F6) {
			return `Latin Small Letter with Diacritic (${String.fromCharCode(code)})`;
		}
		if (code >= 0x00F8 && code <= 0x00FF) {
			return `Latin Small Letter (${String.fromCharCode(code)})`;
		}
		if (code >= 0x0370 && code <= 0x03FF) {
			return `Greek Letter (${String.fromCharCode(code)})`;
		}
		if (code >= 0x0400 && code <= 0x04FF) {
			return `Cyrillic Letter (${String.fromCharCode(code)})`;
		}
		if (code >= 0x0590 && code <= 0x05FF) {
			return `Hebrew Character (${String.fromCharCode(code)})`;
		}
		if (code >= 0x0600 && code <= 0x06FF) {
			return `Arabic Character (${String.fromCharCode(code)})`;
		}
		if (code >= 0x2000 && code <= 0x206F) {
			return `General Punctuation Symbol (${String.fromCharCode(code)})`;
		}
		if (code >= 0x2190 && code <= 0x21FF) {
			return `Arrow Symbol (${String.fromCharCode(code)})`;
		}
		if (code >= 0x2200 && code <= 0x22FF) {
			return `Mathematical Operator (${String.fromCharCode(code)})`;
		}
		if (code >= 0x2500 && code <= 0x257F) {
			return `Box Drawing Character (${String.fromCharCode(code)})`;
		}
		if (code >= 0x25A0 && code <= 0x25FF) {
			return `Geometric Shape (${String.fromCharCode(code)})`;
		}
		if (code >= 0x2600 && code <= 0x26FF) {
			return `Miscellaneous Symbol (${String.fromCharCode(code)})`;
		}
		if (code >= 0x2700 && code <= 0x27BF) {
			return `Dingbat Symbol (${String.fromCharCode(code)})`;
		}
		return `Character U+${code.toString(16).toUpperCase().padStart(4, '0')}`;
	}

	function getKeystrokeText(code) {
		if (code >= 32 && code <= 255) {
			return `Keystroke: Alt+0${code}`;
		}
		return '';
	}

	const CharacterMapApp = {
		open() {
			const id = 'window-character-map';
			const existing = document.getElementById(id);
			if (existing) {
				if (typeof bringWindowToFront === 'function') bringWindowToFront(existing);
				if (existing.classList.contains('minimized') && typeof unminimizeWindow === 'function') {
					unminimizeWindow(existing);
				}
				return existing;
			}

			const contentHTML = `
				<div class="charmap-layout">
					<div class="charmap-top-controls">
						<div class="charmap-form-row">
							<label for="charmap-font-select" class="charmap-label"><u>F</u>ont :</label>
							<select id="charmap-font-select" class="xp-select charmap-font-dropdown"></select>
							<button type="button" class="xp-button charmap-help-btn" id="charmap-help-btn"><u>H</u>elp</button>
						</div>
					</div>

					<div class="charmap-grid-container" id="charmap-grid-scroll-wrap" tabindex="0">
						<div class="charmap-grid" id="charmap-grid-body"></div>
						<div class="charmap-magnifier hidden" id="charmap-zoom-lens"></div>
					</div>

					<div class="charmap-selection-bar">
						<div class="charmap-selection-left">
							<label for="charmap-copy-input" class="charmap-label">Characters to <u>c</u>opy :</label>
							<input type="text" id="charmap-copy-input" class="xp-input charmap-copy-box">
						</div>
						<div class="charmap-selection-actions">
							<button type="button" class="xp-button charmap-action-btn" id="charmap-btn-select"><u>S</u>elect</button>
							<button type="button" class="xp-button charmap-action-btn" id="charmap-btn-copy"><u>C</u>opy</button>
						</div>
					</div>

					<div class="charmap-advanced-section">
						<div class="xp-checkbox-row charmap-advanced-toggle-row">
							<input type="checkbox" id="charmap-advanced-checkbox">
							<label for="charmap-advanced-checkbox"><u>A</u>dvanced view</label>
						</div>

						<div class="charmap-advanced-panel hidden" id="charmap-advanced-subpanel">
							<div class="charmap-adv-grid">
								<div class="charmap-form-row">
									<label for="charmap-charset-select" class="charmap-adv-label">Character set :</label>
									<select id="charmap-charset-select" class="xp-select charmap-adv-select">
										<option value="unicode">Unicode</option>
										<option value="western">Windows: Western</option>
										<option value="dos">DOS: United States</option>
									</select>
								</div>
								<div class="charmap-form-row">
									<label for="charmap-groupby-select" class="charmap-adv-label">Group by :</label>
									<select id="charmap-groupby-select" class="xp-select charmap-adv-select">
										<option value="all">All</option>
										<option value="subrange">Unicode Subrange</option>
									</select>
								</div>
								<div class="charmap-form-row charmap-search-row">
									<label for="charmap-search-input" class="charmap-adv-label">Search for :</label>
									<input type="text" id="charmap-search-input" class="xp-input charmap-adv-input">
									<button type="button" class="xp-button charmap-adv-btn" id="charmap-search-btn">Search</button>
									<button type="button" class="xp-button charmap-adv-btn" id="charmap-reset-btn">Reset</button>
								</div>
							</div>
						</div>
					</div>

					<div class="charmap-subrange-modal hidden" id="charmap-subrange-floating-box">
						<div class="charmap-subrange-title">Select Unicode Subrange</div>
						<div class="charmap-subrange-list" id="charmap-subrange-options"></div>
					</div>

					<div class="charmap-statusbar">
						<div class="charmap-sb-info" id="charmap-status-name"></div>
						<div class="charmap-sb-keystroke" id="charmap-status-keystroke"></div>
					</div>
				</div>
			`;

			const win = createXPWindow(id, 'Character Map', contentHTML, 500, 440, {
				iconSrc: '../assets/images/desk/icons/List File.webp',
				resizable: false
			});

			win.classList.add('charmap-window');
			win.querySelector('.xp-window-content').style.padding = '0';

			this.bindEvents(win);
			return win;
		},

		bindEvents(win) {
			const fontSelect = win.querySelector('#charmap-font-select');
			const gridBody = win.querySelector('#charmap-grid-body');
			const gridScrollWrap = win.querySelector('#charmap-grid-scroll-wrap');
			const zoomLens = win.querySelector('#charmap-zoom-lens');
			const copyInput = win.querySelector('#charmap-copy-input');
			const selectBtn = win.querySelector('#charmap-btn-select');
			const copyBtn = win.querySelector('#charmap-btn-copy');
			const helpBtn = win.querySelector('#charmap-help-btn');
			const advancedCheckbox = win.querySelector('#charmap-advanced-checkbox');
			const advancedPanel = win.querySelector('#charmap-advanced-subpanel');
			const charSetSelect = win.querySelector('#charmap-charset-select');
			const groupBySelect = win.querySelector('#charmap-groupby-select');
			const searchInput = win.querySelector('#charmap-search-input');
			const searchBtn = win.querySelector('#charmap-search-btn');
			const resetBtn = win.querySelector('#charmap-reset-btn');
			const subrangeModal = win.querySelector('#charmap-subrange-floating-box');
			const subrangeOptions = win.querySelector('#charmap-subrange-options');
			const statusName = win.querySelector('#charmap-status-name');
			const statusKeystroke = win.querySelector('#charmap-status-keystroke');

			let currentFont = 'Arial';
			let selectedCodePoint = 0x0020;
			let activeRangeStart = 0x0020;
			let activeRangeEnd = 0x024F;
			let searchQuery = '';
			let cellElementsMap = new Map();

			SYSTEM_FONTS.forEach(fontName => {
				const opt = document.createElement('option');
				opt.value = fontName;
				opt.textContent = fontName;
				if (fontName === 'Arial') opt.selected = true;
				fontSelect.appendChild(opt);
			});

			UNICODE_BLOCKS.forEach(block => {
				const opt = document.createElement('div');
				opt.className = 'charmap-subrange-item';
				opt.dataset.start = String(block.start);
				opt.dataset.end = String(block.end);
				opt.textContent = block.name;
				subrangeOptions.appendChild(opt);
			});

			const updateStatusDisplay = (code) => {
				if (code === null || code === undefined) {
					statusName.textContent = '';
					statusKeystroke.textContent = '';
					return;
				}
				const hex = code.toString(16).toUpperCase().padStart(4, '0');
				const desc = getCharacterName(code);
				statusName.textContent = `U+${hex}: ${desc}`;
				statusKeystroke.textContent = getKeystrokeText(code);
			};

			const showMagnifierAt = (cell, code) => {
				const char = String.fromCharCode(code);
				zoomLens.textContent = char;
				zoomLens.style.fontFamily = currentFont;

				const cellRect = cell.getBoundingClientRect();
				const wrapRect = gridScrollWrap.getBoundingClientRect();

				const left = cellRect.left - wrapRect.left + gridScrollWrap.scrollLeft - 8;
				const top = cellRect.top - wrapRect.top + gridScrollWrap.scrollTop - 14;

				zoomLens.style.left = `${Math.max(0, left)}px`;
				zoomLens.style.top = `${Math.max(0, top)}px`;
				zoomLens.classList.remove('hidden');
			};

			const hideMagnifier = () => {
				zoomLens.classList.add('hidden');
			};

			const selectCell = (code, focusWrap = false) => {
				selectedCodePoint = code;
				gridBody.querySelectorAll('.charmap-cell.selected').forEach(c => c.classList.remove('selected'));
				const targetCell = cellElementsMap.get(code);
				if (targetCell) {
					targetCell.classList.add('selected');
					const cellTop = targetCell.offsetTop;
					const cellBottom = cellTop + targetCell.offsetHeight;
					const wrapTop = gridScrollWrap.scrollTop;
					const wrapHeight = gridScrollWrap.clientHeight;

					if (cellTop < wrapTop) {
						gridScrollWrap.scrollTop = cellTop;
					} else if (cellBottom > wrapTop + wrapHeight) {
						gridScrollWrap.scrollTop = cellBottom - wrapHeight;
					}
				}
				updateStatusDisplay(code);
				if (focusWrap) gridScrollWrap.focus();
			};

			const renderGrid = () => {
				gridBody.innerHTML = '';
				cellElementsMap.clear();
				gridBody.style.fontFamily = currentFont;

				let codesToRender = [];

				if (searchQuery) {
					const q = searchQuery.toLowerCase();
					for (let code = 0x0020; code <= 0x27BF; code++) {
						const name = getCharacterName(code).toLowerCase();
						const hex = code.toString(16).toLowerCase();
						const char = String.fromCharCode(code).toLowerCase();
						if (name.includes(q) || hex.includes(q) || char === q) {
							codesToRender.push(code);
						}
					}
				} else {
					for (let code = activeRangeStart; code <= activeRangeEnd; code++) {
						codesToRender.push(code);
					}
				}

				if (codesToRender.length === 0) {
					const emptyNotice = document.createElement('div');
					emptyNotice.className = 'charmap-empty-notice';
					emptyNotice.textContent = 'No matching characters found.';
					gridBody.appendChild(emptyNotice);
					updateStatusDisplay(null);
					return;
				}

				codesToRender.forEach(code => {
					const cell = document.createElement('div');
					cell.className = 'charmap-cell';
					cell.dataset.code = String(code);
					cell.textContent = String.fromCharCode(code);

					if (code === selectedCodePoint) {
						cell.classList.add('selected');
					}

					cell.addEventListener('mousedown', (e) => {
						e.preventDefault();
						selectCell(code);
						showMagnifierAt(cell, code);
					});

					cell.addEventListener('mouseenter', () => {
						if (!zoomLens.classList.contains('hidden')) {
							selectCell(code);
							showMagnifierAt(cell, code);
						}
					});

					cell.addEventListener('dblclick', () => {
						copyInput.value += String.fromCharCode(code);
						copyInput.focus();
					});

					gridBody.appendChild(cell);
					cellElementsMap.set(code, cell);
				});

				if (!cellElementsMap.has(selectedCodePoint) && codesToRender.length > 0) {
					selectCell(codesToRender[0]);
				} else {
					updateStatusDisplay(selectedCodePoint);
				}
			};

			document.addEventListener('mouseup', hideMagnifier);

			gridScrollWrap.addEventListener('keydown', (e) => {
				if (!cellElementsMap.has(selectedCodePoint)) return;
				const codes = Array.from(cellElementsMap.keys());
				const currentIndex = codes.indexOf(selectedCodePoint);
				const columnsPerRow = 20;

				let newIndex = currentIndex;

				if (e.key === 'ArrowRight') {
					e.preventDefault();
					newIndex = Math.min(codes.length - 1, currentIndex + 1);
				} else if (e.key === 'ArrowLeft') {
					e.preventDefault();
					newIndex = Math.max(0, currentIndex - 1);
				} else if (e.key === 'ArrowDown') {
					e.preventDefault();
					newIndex = Math.min(codes.length - 1, currentIndex + columnsPerRow);
				} else if (e.key === 'ArrowUp') {
					e.preventDefault();
					newIndex = Math.max(0, currentIndex - columnsPerRow);
				} else if (e.key === 'PageDown') {
					e.preventDefault();
					newIndex = Math.min(codes.length - 1, currentIndex + columnsPerRow * 5);
				} else if (e.key === 'PageUp') {
					e.preventDefault();
					newIndex = Math.max(0, currentIndex - columnsPerRow * 5);
				} else if (e.key === 'Home') {
					e.preventDefault();
					newIndex = 0;
				} else if (e.key === 'End') {
					e.preventDefault();
					newIndex = codes.length - 1;
				} else if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					copyInput.value += String.fromCharCode(selectedCodePoint);
					return;
				}

				if (newIndex !== currentIndex) {
					selectCell(codes[newIndex]);
				}
			});

			fontSelect.addEventListener('change', () => {
				currentFont = fontSelect.value;
				renderGrid();
			});

			selectBtn.addEventListener('click', () => {
				copyInput.value += String.fromCharCode(selectedCodePoint);
				copyInput.focus();
			});

			copyBtn.addEventListener('click', () => {
				if (!copyInput.value) return;
				copyInput.select();
				try {
					navigator.clipboard.writeText(copyInput.value);
				} catch (err) {
					document.execCommand('copy');
				}
				if (window.SettingsApp && window.SettingsApp.playSound) {
					window.SettingsApp.playSound('click');
				}
			});

			helpBtn.addEventListener('click', () => {
				showXPDialog('Character Map Help', 'Character Map lets you select and insert special characters and symbols into any document.\n\nUse Select and Copy buttons to transfer symbols to the clipboard.', 'info');
			});

			advancedCheckbox.addEventListener('change', () => {
				const isChecked = advancedCheckbox.checked;
				advancedPanel.classList.toggle('hidden', !isChecked);
				if (!isChecked) {
					subrangeModal.classList.add('hidden');
					groupBySelect.value = 'all';
					searchQuery = '';
					searchInput.value = '';
					activeRangeStart = 0x0020;
					activeRangeEnd = 0x024F;
					renderGrid();
				}
			});

			charSetSelect.addEventListener('change', () => {
				const val = charSetSelect.value;
				if (val === 'western') {
					activeRangeStart = 0x0020;
					activeRangeEnd = 0x00FF;
				} else if (val === 'dos') {
					activeRangeStart = 0x0020;
					activeRangeEnd = 0x007E;
				} else {
					activeRangeStart = 0x0020;
					activeRangeEnd = 0x27BF;
				}
				searchQuery = '';
				searchInput.value = '';
				renderGrid();
			});

			groupBySelect.addEventListener('change', () => {
				if (groupBySelect.value === 'subrange') {
					subrangeModal.classList.remove('hidden');
				} else {
					subrangeModal.classList.add('hidden');
					activeRangeStart = 0x0020;
					activeRangeEnd = 0x27BF;
					renderGrid();
				}
			});

			subrangeOptions.addEventListener('click', (e) => {
				const item = e.target.closest('.charmap-subrange-item');
				if (!item) return;
				subrangeOptions.querySelectorAll('.charmap-subrange-item').forEach(i => i.classList.remove('selected'));
				item.classList.add('selected');
				activeRangeStart = parseInt(item.dataset.start, 10);
				activeRangeEnd = parseInt(item.dataset.end, 10);
				searchQuery = '';
				searchInput.value = '';
				renderGrid();
			});

			const executeSearch = () => {
				searchQuery = searchInput.value.trim();
				renderGrid();
			};

			searchBtn.addEventListener('click', executeSearch);
			searchInput.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') {
					e.preventDefault();
					executeSearch();
				}
			});

			resetBtn.addEventListener('click', () => {
				searchQuery = '';
				searchInput.value = '';
				renderGrid();
			});

			renderGrid();
		}
	};

	window.CharacterMapApp = CharacterMapApp;
})();
