(function () {
	const DOS_COLORS = {
		'0': '#000000',
		'1': '#000080',
		'2': '#008000',
		'3': '#008080',
		'4': '#800000',
		'5': '#800080',
		'6': '#808000',
		'7': '#c0c0c0',
		'8': '#808080',
		'9': '#0000ff',
		'a': '#00ff00',
		'b': '#00ffff',
		'c': '#ff0000',
		'd': '#ff00ff',
		'e': '#ffff00',
		'f': '#ffffff'
	};

	const SYSTEM_SPECS = [
		'Host Name:                 WARTETS-XP-PC',
		'OS Name:                   MacroPof Windows XP Professional',
		'OS Version:                5.1.2600 Service Pack 3 Build 2600',
		'OS Manufacturer:           MacroPof Corporation',
		'OS Configuration:          Standalone Workstation',
		'OS Build Type:             Multiprocessor Free',
		'Registered Owner:          Colin B.R.',
		'Registered Organization:   Wartets Interactive Studio',
		'Product ID:                76487-640-1457243-23456',
		'Original Install Date:     10/25/2001, 12:00:00 PM',
		'System Up Time:            0 Days, 8 Hours, 42 Minutes, 17 Seconds',
		'System Manufacturer:       Wartets Computer Systems',
		'System Model:              RetroWorkstation 2000',
		'System Type:               X86-based PC',
		'Processor(s):              1 Processor(s) Installed.',
		'                           [01]: x86 Family 15 Model 2 Stepping 9 GenuineIntel ~2400 Mhz',
		'BIOS Version:              American Megatrends Inc. 080011, 08/14/2002',
		'Windows Directory:         C:\\WINDOWS',
		'System Directory:          C:\\WINDOWS\\system32',
		'Boot Device:               \\Device\\HarddiskVolume1',
		'System Locale:             en-us;English (United States)',
		'Input Locale:              en-us;English (United States)',
		'Time Zone:                 (GMT+01:00) Paris, Brussels, Madrid',
		'Total Physical Memory:     1024 MB',
		'Available Physical Memory: 768 MB',
		'Virtual Memory: Max Size:  2048 MB',
		'Virtual Memory: Available: 1820 MB',
		'Network Card(s):           1 NIC(s) Installed.',
		'                           [01]: Realtek RTL8139 Family PCI Fast Ethernet NIC',
		'                                 Connection Name: Local Area Connection',
		'                                 DHCP Enabled:    Yes',
		'                                 IP address(es):  192.168.1.100'
	];

	function resolveFsFromVirtualPath(vPath, currentFolder = fs.root) {
		if (!vPath || vPath === '.' || vPath === './') return currentFolder;
		let clean = vPath.replace(/\\/g, '/').replace(/^C:/i, '');

		if (!clean.startsWith('/')) {
			clean = (currentFolder.getFullPath() + '/' + clean).replace(/\/+/g, '/');
		}

		if (clean === '/' || clean === '/Desktop' || clean === '/Documents and Settings/Colin B.R./Desktop') {
			return fs.root;
		}

		if (clean.startsWith('/Desktop/')) {
			clean = clean.slice('/Desktop'.length);
		} else if (clean.startsWith('/Documents and Settings/Colin B.R./Desktop/')) {
			clean = clean.slice('/Documents and Settings/Colin B.R./Desktop'.length);
		}

		return fs.findByPath(clean);
	}

	function formatVirtualPath(folder) {
		if (!folder || folder === fs.root) {
			return 'C:\\Documents and Settings\\Colin B.R.\\Desktop';
		}
		const full = folder.getFullPath().replace(/\//g, '\\');
		return `C:\\Documents and Settings\\Colin B.R.\\Desktop${full}`;
	}

	function padRight(str, len) {
		str = String(str);
		while (str.length < len) str += ' ';
		return str;
	}

	function padLeft(str, len) {
		str = String(str);
		while (str.length < len) str = ' ' + str;
		return str;
	}

	class TerminalInstance {
		constructor(win, options = {}) {
			this.win = win;
			this.contentEl = win.querySelector('.xp-window-content');
			this.options = options;
			this.currentFolder = options.initialFolder || fs.root;
			this.bgColor = '#000000';
			this.fgColor = '#c0c0c0';
			this.fontFamily = 'Consolas, "Lucida Console", "Courier New", monospace';
			this.fontSize = '13px';
			this.title = options.title || 'Command Prompt';
			this.promptPattern = '$P$G';
			this.history = [];
			this.historyIndex = -1;
			this.batchLabels = {};
			this.env = {
				'PROMPT': '$P$G',
				'OS': 'Windows_NT',
				'PATH': 'C:\\WINDOWS\\system32;C:\\WINDOWS;C:\\WINDOWS\\System32\\Wbem',
				'USERNAME': 'Colin B.R.',
				'USERPROFILE': 'C:\\Documents and Settings\\Colin B.R.',
				'SYSTEMROOT': 'C:\\WINDOWS',
				'COMSPEC': 'C:\\WINDOWS\\system32\\cmd.exe',
				'TEMP': 'C:\\DOCUME~1\\COLINB~1\\LOCALS~1\\Temp',
				'ERRORLEVEL': '0',
				'COMPUTERNAME': 'WARTETS-XP-PC'
			};
			this.isExecutingScript = false;
			this.isMatrixRunning = false;
			this.isStarWarsRunning = false;
			this.abortScript = false;
			this.pauseCallback = null;

			this.initDom();
			this.bindEvents();

			if (options.script) {
				this.executeBatch(options.script);
			} else {
				this.printHeader();
				this.showPrompt();
			}
		}

		initDom() {
			this.contentEl.innerHTML = '';
			this.contentEl.className = 'xp-window-content xp-cmd-container';
			this.contentEl.style.padding = '0';
			this.contentEl.style.margin = '0';
			this.contentEl.style.overflow = 'hidden';
			this.contentEl.style.backgroundColor = this.bgColor;

			this.terminalEl = document.createElement('div');
			this.terminalEl.className = 'xp-cmd-terminal';
			this.terminalEl.style.backgroundColor = this.bgColor;
			this.terminalEl.style.color = this.fgColor;
			this.terminalEl.style.fontFamily = this.fontFamily;
			this.terminalEl.style.fontSize = this.fontSize;

			this.outputEl = document.createElement('div');
			this.outputEl.className = 'xp-cmd-output';
			this.terminalEl.appendChild(this.outputEl);

			this.inputLineEl = document.createElement('div');
			this.inputLineEl.className = 'xp-cmd-input-line';

			this.promptSpan = document.createElement('span');
			this.promptSpan.className = 'xp-cmd-prompt-text';
			this.inputLineEl.appendChild(this.promptSpan);

			this.commandInput = document.createElement('input');
			this.commandInput.type = 'text';
			this.commandInput.className = 'xp-cmd-hidden-input';
			this.commandInput.spellcheck = false;
			this.commandInput.autocomplete = 'off';
			this.commandInput.autocapitalize = 'off';
			this.inputLineEl.appendChild(this.commandInput);

			this.visibleInputSpan = document.createElement('span');
			this.visibleInputSpan.className = 'xp-cmd-visible-input';
			this.inputLineEl.appendChild(this.visibleInputSpan);

			this.cursorSpan = document.createElement('span');
			this.cursorSpan.className = 'xp-cmd-cursor';
			this.cursorSpan.textContent = '_';
			this.inputLineEl.appendChild(this.cursorSpan);

			this.terminalEl.appendChild(this.inputLineEl);
			this.contentEl.appendChild(this.terminalEl);

			this.matrixCanvas = document.createElement('canvas');
			this.matrixCanvas.className = 'xp-matrix-canvas';
			this.matrixCanvas.style.display = 'none';
			this.contentEl.appendChild(this.matrixCanvas);
		}

		bindEvents() {
			this.terminalEl.addEventListener('click', () => {
				if (this.pauseCallback) {
					const cb = this.pauseCallback;
					this.pauseCallback = null;
					cb();
					return;
				}
				if (!this.isMatrixRunning && !this.isStarWarsRunning && !this.isExecutingScript) {
					this.commandInput.focus();
				}
			});

			this.commandInput.addEventListener('input', () => {
				this.visibleInputSpan.textContent = this.commandInput.value;
			});

			this.commandInput.addEventListener('keydown', (e) => {
				if (this.pauseCallback) {
					e.preventDefault();
					const cb = this.pauseCallback;
					this.pauseCallback = null;
					cb();
					return;
				}

				if (e.key === 'Enter') {
					e.preventDefault();
					const cmd = this.commandInput.value;
					this.commandInput.value = '';
					this.visibleInputSpan.textContent = '';
					if (cmd.trim()) {
						this.history.push(cmd);
						this.historyIndex = this.history.length;
					}
					this.println(`${this.getPromptString()}${cmd}`);
					this.processCommandLine(cmd);
				} else if (e.key === 'ArrowUp') {
					e.preventDefault();
					if (this.history.length > 0) {
						if (this.historyIndex > 0) this.historyIndex--;
						this.commandInput.value = this.history[this.historyIndex] || '';
						this.visibleInputSpan.textContent = this.commandInput.value;
					}
				} else if (e.key === 'ArrowDown') {
					e.preventDefault();
					if (this.history.length > 0) {
						if (this.historyIndex < this.history.length - 1) {
							this.historyIndex++;
							this.commandInput.value = this.history[this.historyIndex] || '';
						} else {
							this.historyIndex = this.history.length;
							this.commandInput.value = '';
						}
						this.visibleInputSpan.textContent = this.commandInput.value;
					}
				} else if (e.key === 'Tab') {
					e.preventDefault();
					this.handleTabCompletion();
				} else if (e.ctrlKey && e.key.toLowerCase() === 'c') {
					e.preventDefault();
					this.println('^C');
					this.abortScript = true;
					this.showPrompt();
				} else if (e.ctrlKey && e.key.toLowerCase() === 'l') {
					e.preventDefault();
					this.clearScreen();
				}
			});

			document.addEventListener('keydown', (e) => {
				if (this.isMatrixRunning) {
					e.preventDefault();
					this.stopMatrixAnimation();
					return;
				}
				if (this.isStarWarsRunning) {
					e.preventDefault();
					this.stopStarWarsAnimation();
					return;
				}
				if (this.pauseCallback && activeWindow === this.win) {
					e.preventDefault();
					const cb = this.pauseCallback;
					this.pauseCallback = null;
					cb();
				}
			});

			this.win.addEventListener('dragover', (e) => {
				e.preventDefault();
				e.stopPropagation();
			});

			this.win.addEventListener('drop', (e) => {
				e.preventDefault();
				e.stopPropagation();
				const data = e.dataTransfer.getData('text/plain');
				if (data) {
					try {
						const paths = JSON.parse(data);
						if (Array.isArray(paths) && paths.length > 0) {
							this.commandInput.value += ` "${paths[0]}"`;
							this.visibleInputSpan.textContent = this.commandInput.value;
							this.commandInput.focus();
						}
					} catch (err) {
						this.commandInput.value += ` "${data}"`;
						this.visibleInputSpan.textContent = this.commandInput.value;
					}
				}
			});

			this.win.addEventListener('contextmenu', (e) => {
				if (e.target.closest('.xp-window-header')) return;
				e.preventDefault();
				if (window.ContextMenu) {
					const items = this.getContextMenuItems();
					window.ContextMenu.show(items, e.clientX, e.clientY);
				}
			});
		}

		getContextMenuItems() {
			return [
				{
					label: 'Mark',
					action: () => {}
				},
				{
					label: 'Paste',
					action: async () => {
						try {
							const text = await navigator.clipboard.readText();
							if (text) {
								this.commandInput.value += text;
								this.visibleInputSpan.textContent = this.commandInput.value;
								this.commandInput.focus();
							}
						} catch (e) {
							showXPDialog('Clipboard', 'Unable to paste text from system clipboard.', 'warning');
						}
					}
				},
				{
					label: 'Select All',
					action: () => {}
				},
				{
					label: 'Scroll',
					action: () => {}
				},
				{ separator: true },
				{
					label: 'Clear Screen',
					action: () => this.clearScreen()
				},
				{
					label: 'Properties',
					bold: true,
					action: () => this.openPropertiesDialog()
				}
			];
		}

		openPropertiesDialog() {
			const id = `dialog-cmd-properties-${Date.now()}`;
			const content = `
				<div class="xp-tabs-container" style="padding: 6px;">
					<div class="xp-tabs-bar">
						<button type="button" class="xp-tab-btn active" data-cmd-tab="colors">Colors</button>
						<button type="button" class="xp-tab-btn" data-cmd-tab="font">Font</button>
					</div>
					<div class="xp-tab-page-wrapper" style="padding: 10px;">
						<div class="xp-tab-page active" data-cmd-page="colors">
							<fieldset class="xp-groupbox">
								<legend>Terminal Colors</legend>
								<div class="xp-form-row">
									<label style="width: 110px;">Screen Text:</label>
									<select id="cmd-opt-fg" class="xp-select" style="flex: 1;">
										<option value="a" ${this.fgColor === DOS_COLORS['a'] ? 'selected' : ''}>Green (Matrix Retro)</option>
										<option value="7" ${this.fgColor === DOS_COLORS['7'] ? 'selected' : ''}>Light Gray (Classic)</option>
										<option value="f" ${this.fgColor === DOS_COLORS['f'] ? 'selected' : ''}>Bright White</option>
										<option value="e" ${this.fgColor === DOS_COLORS['e'] ? 'selected' : ''}>Yellow</option>
										<option value="b" ${this.fgColor === DOS_COLORS['b'] ? 'selected' : ''}>Light Aqua / Cyan</option>
										<option value="c" ${this.fgColor === DOS_COLORS['c'] ? 'selected' : ''}>Light Red</option>
									</select>
								</div>
								<div class="xp-form-row" style="margin-top: 6px;">
									<label style="width: 110px;">Screen Background:</label>
									<select id="cmd-opt-bg" class="xp-select" style="flex: 1;">
										<option value="0" ${this.bgColor === DOS_COLORS['0'] ? 'selected' : ''}>Black</option>
										<option value="1" ${this.bgColor === DOS_COLORS['1'] ? 'selected' : ''}>Navy Blue</option>
										<option value="7" ${this.bgColor === DOS_COLORS['7'] ? 'selected' : ''}>White / Silver</option>
									</select>
								</div>
							</fieldset>
						</div>
						<div class="xp-tab-page" data-cmd-page="font">
							<fieldset class="xp-groupbox">
								<legend>Console Typography</legend>
								<div class="xp-form-row">
									<label style="width: 100px;">Font Face:</label>
									<select id="cmd-opt-font" class="xp-select" style="flex: 1;">
										<option value="Consolas, 'Lucida Console', monospace">Consolas / Lucida Console</option>
										<option value="'Courier New', Courier, monospace">Courier New</option>
										<option value="'Roboto Mono', monospace">Roboto Mono</option>
										<option value="'Press Start 2P', monospace">Press Start 2P (Arcade)</option>
									</select>
								</div>
								<div class="xp-form-row" style="margin-top: 6px;">
									<label style="width: 100px;">Size:</label>
									<select id="cmd-opt-size" class="xp-select" style="flex: 1;">
										<option value="11px">11px</option>
										<option value="13px" selected>13px</option>
										<option value="15px">15px</option>
										<option value="18px">18px</option>
									</select>
								</div>
							</fieldset>
						</div>
					</div>
					<div class="xp-dialog-action-footer">
						<button type="button" class="xp-button" id="cmd-opt-ok">OK</button>
						<button type="button" class="xp-button" id="cmd-opt-cancel">Cancel</button>
					</div>
				</div>
			`;

			const dlg = createXPWindow(id, 'Command Prompt Properties', content, 380, 260, {
				resizable: false,
				isModal: true,
				iconSrc: '../assets/images/desk/icons/Command Prompt.webp'
			});
			dlg.querySelector('.xp-window-content').style.padding = '0';

			dlg.querySelectorAll('.xp-tab-btn').forEach(btn => {
				btn.addEventListener('click', () => {
					dlg.querySelectorAll('.xp-tab-btn').forEach(b => b.classList.toggle('active', b === btn));
					dlg.querySelectorAll('.xp-tab-page').forEach(p => p.classList.toggle('active', p.dataset.cmdPage === btn.dataset.cmdTab));
				});
			});

			dlg.querySelector('#cmd-opt-ok').addEventListener('click', () => {
				const fgVal = dlg.querySelector('#cmd-opt-fg').value;
				const bgVal = dlg.querySelector('#cmd-opt-bg').value;
				const fontVal = dlg.querySelector('#cmd-opt-font').value;
				const sizeVal = dlg.querySelector('#cmd-opt-size').value;

				this.applyColors(bgVal, fgVal);
				this.fontFamily = fontVal;
				this.fontSize = sizeVal;
				this.terminalEl.style.fontFamily = this.fontFamily;
				this.terminalEl.style.fontSize = this.fontSize;

				closeWindow(dlg, id);
			});

			dlg.querySelector('#cmd-opt-cancel').addEventListener('click', () => {
				closeWindow(dlg, id);
			});
		}

		printHeader() {
			this.println('MacroPof Windows XP [Version 5.1.2600]');
			this.println('(C) Copyright 1985-2001 MacroPof Corp.\n');
		}

		getPromptString() {
			const vPath = formatVirtualPath(this.currentFolder);
			let p = this.promptPattern;
			p = p.replace(/\$P/gi, vPath);
			p = p.replace(/\$G/gi, '>');
			p = p.replace(/\$D/gi, new Date().toLocaleDateString());
			p = p.replace(/\$T/gi, new Date().toLocaleTimeString());
			p = p.replace(/\$V/gi, 'Windows XP [Version 5.1.2600]');
			p = p.replace(/\$N/gi, 'C:');
			p = p.replace(/\$\$/gi, '$');
			p = p.replace(/\$_/gi, '\n');
			return p;
		}

		showPrompt() {
			this.inputLineEl.style.display = 'flex';
			this.promptSpan.textContent = this.getPromptString();
			this.commandInput.value = '';
			this.visibleInputSpan.textContent = '';
			this.scrollToBottom();
			setTimeout(() => this.commandInput.focus(), 10);
		}

		hidePrompt() {
			this.inputLineEl.style.display = 'none';
		}

		println(text = '') {
			const line = document.createElement('div');
			line.className = 'xp-cmd-line';
			line.textContent = text;
			this.outputEl.appendChild(line);
			this.scrollToBottom();
		}

		printRawHtml(html) {
			const line = document.createElement('div');
			line.className = 'xp-cmd-line';
			line.innerHTML = html;
			this.outputEl.appendChild(line);
			this.scrollToBottom();
		}

		clearScreen() {
			this.outputEl.innerHTML = '';
			this.scrollToBottom();
		}

		scrollToBottom() {
			this.terminalEl.scrollTop = this.terminalEl.scrollHeight;
		}

		applyColors(bgKey, fgKey) {
			if (DOS_COLORS[bgKey]) this.bgColor = DOS_COLORS[bgKey];
			if (DOS_COLORS[fgKey]) this.fgColor = DOS_COLORS[fgKey];

			this.contentEl.style.backgroundColor = this.bgColor;
			this.terminalEl.style.backgroundColor = this.bgColor;
			this.terminalEl.style.color = this.fgColor;
			this.cursorSpan.style.color = this.fgColor;
		}

		setTitle(newTitle) {
			this.title = newTitle;
			const titleSpan = this.win.querySelector('.xp-window-header .title');
			if (titleSpan) titleSpan.textContent = newTitle;
		}

		handleTabCompletion() {
			const val = this.commandInput.value;
			const parts = val.split(' ');
			const toComplete = parts[parts.length - 1].toLowerCase();

			if (!toComplete) return;

			const children = this.currentFolder.listContent();
			const match = children.find(c => c.name.toLowerCase().startsWith(toComplete));
			if (match) {
				const isFolder = match instanceof Folder;
				parts[parts.length - 1] = match.name.includes(' ') ? `"${match.name}"` : match.name;
				this.commandInput.value = parts.join(' ') + (isFolder ? '\\' : '');
				this.visibleInputSpan.textContent = this.commandInput.value;
			}
		}

		substituteVariables(str) {
			let res = str.replace(/%([a-zA-Z0-9_]+)%/g, (match, name) => {
				const uName = name.toUpperCase();
				if (uName === 'CD') return formatVirtualPath(this.currentFolder);
				if (uName === 'DATE') return new Date().toLocaleDateString();
				if (uName === 'TIME') return new Date().toLocaleTimeString();
				if (uName === 'RANDOM') return String(Math.floor(Math.random() * 32767));
				if (this.env[uName] !== undefined) return this.env[uName];
				return match;
			});
			return res;
		}

		async processCommandLine(rawCmd) {
			let expanded = this.substituteVariables(rawCmd.trim());
			if (!expanded) {
				this.showPrompt();
				return;
			}

			const andParts = expanded.split('&&');
			if (andParts.length > 1) {
				for (const part of andParts) {
					const code = await this.executeSinglePipeline(part.trim());
					if (code !== 0) break;
				}
				this.showPrompt();
				return;
			}

			const orParts = expanded.split('||');
			if (orParts.length > 1) {
				for (const part of orParts) {
					const code = await this.executeSinglePipeline(part.trim());
					if (code === 0) break;
				}
				this.showPrompt();
				return;
			}

			const semiParts = expanded.split('&');
			if (semiParts.length > 1) {
				for (const part of semiParts) {
					await this.executeSinglePipeline(part.trim());
				}
				this.showPrompt();
				return;
			}

			await this.executeSinglePipeline(expanded);
			if (!this.isExecutingScript && !this.isMatrixRunning && !this.isStarWarsRunning) {
				this.showPrompt();
			}
		}

		async executeSinglePipeline(line) {
			if (!line) return 0;

			let redirectFile = null;
			let appendMode = false;

			if (line.includes('>>')) {
				const parts = line.split('>>');
				line = parts[0].trim();
				redirectFile = parts[1].trim().replace(/"/g, '');
				appendMode = true;
			} else if (line.includes('>')) {
				const parts = line.split('>');
				line = parts[0].trim();
				redirectFile = parts[1].trim().replace(/"/g, '');
				appendMode = false;
			}

			const pipeParts = line.split('|').map(p => p.trim());
			let pipeBuffer = '';

			for (let i = 0; i < pipeParts.length; i++) {
				const stage = pipeParts[i];
				const capturedOutput = [];
				const originalPrintln = this.println.bind(this);

				if (i < pipeParts.length - 1 || redirectFile) {
					this.println = (txt = '') => capturedOutput.push(txt);
				}

				await this.executeSingleCommand(stage, pipeBuffer);

				this.println = originalPrintln;
				pipeBuffer = capturedOutput.join('\n');
			}

			if (redirectFile) {
				try {
					let file = this.currentFolder.getByName(redirectFile);
					if (!file) {
						file = fs.create('File', this.currentFolder.getFullPath(), redirectFile);
					}
					if (file instanceof File) {
						file.write(appendMode ? (file.content + '\n' + pipeBuffer) : pipeBuffer);
						fs.save();
						if (typeof refreshUI === 'function') refreshUI();
					}
				} catch (e) {
					this.println(`Access denied or unable to write to ${redirectFile}.`);
				}
			} else if (pipeParts.length > 1) {
				if (pipeBuffer) this.println(pipeBuffer);
			}

			return parseInt(this.env['ERRORLEVEL'] || '0', 10);
		}

		async executeSingleCommand(line, stdin = '') {
			const tokens = this.parseCommandLine(line);
			if (tokens.length === 0) return;

			const cmd = tokens[0].toLowerCase();
			const args = tokens.slice(1);
			this.env['ERRORLEVEL'] = '0';

			if (window.AchievementsManager) {
				try {
					let cmdList = JSON.parse(localStorage.getItem('xp_cmd_history_executed') || '[]');
					if (!cmdList.includes(cmd)) {
						cmdList.push(cmd);
						localStorage.setItem('xp_cmd_history_executed', JSON.stringify(cmdList));
					}
					window.AchievementsManager.setProgress('cmd_master', cmdList.length);
				} catch (e) {}
			}

			switch (cmd) {
				case 'help':
				case '?':
					this.cmdHelp(args);
					break;
				case 'cls':
				case 'clear':
					this.clearScreen();
					break;
				case 'dir':
					this.cmdDir(args);
					break;
				case 'cd':
				case 'chdir':
					this.cmdCd(args);
					break;
				case 'md':
				case 'mkdir':
					this.cmdMkdir(args);
					break;
				case 'rd':
				case 'rmdir':
					this.cmdRmdir(args);
					break;
				case 'del':
				case 'erase':
					this.cmdDel(args);
					break;
				case 'copy':
					this.cmdCopy(args);
					break;
				case 'move':
					this.cmdMove(args);
					break;
				case 'ren':
				case 'rename':
					this.cmdRename(args);
					break;
				case 'type':
				case 'cat':
					this.cmdType(args);
					break;
				case 'more':
					this.cmdMore(args, stdin);
					break;
				case 'find':
					this.cmdFind(args, stdin);
					break;
				case 'findstr':
					this.cmdFindstr(args, stdin);
					break;
				case 'sort':
					this.cmdSort(args, stdin);
					break;
				case 'echo':
					this.cmdEcho(args, line);
					break;
				case 'color':
					this.cmdColor(args);
					break;
				case 'title':
					this.cmdTitle(args, line);
					break;
				case 'ver':
					this.println('\nMacroPof Windows XP [Version 5.1.2600]\n');
					break;
				case 'vol':
					this.println(' Volume in drive C has no label.');
					this.println(' Volume Serial Number is 4C28-91FA\n');
					break;
				case 'systeminfo':
					SYSTEM_SPECS.forEach(spec => this.println(spec));
					this.println();
					break;
				case 'hostname':
					this.println(this.env['COMPUTERNAME'] || 'WARTETS-XP-PC');
					break;
				case 'whoami':
					this.println(`${this.env['COMPUTERNAME'] || 'WARTETS-XP-PC'}\\${this.env['USERNAME'] || 'Colin B.R.'}`);
					break;
				case 'date':
					this.println(`The current date is: ${new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' })}`);
					break;
				case 'time':
					this.println(`The current time is: ${new Date().toLocaleTimeString('en-US', { hour12: false })}.${Math.floor(Math.random() * 90 + 10)}`);
					break;
				case 'tree':
					this.cmdTree(args);
					break;
				case 'attrib':
					this.cmdAttrib(args);
					break;
				case 'prompt':
					this.cmdPrompt(args);
					break;
				case 'pause':
					await this.cmdPause();
					break;
				case 'set':
					this.cmdSet(args);
					break;
				case 'tasklist':
					this.cmdTasklist();
					break;
				case 'taskkill':
					this.cmdTaskkill(args);
					break;
				case 'winlist':
					this.cmdWinList();
					break;
				case 'winclose':
					this.cmdWinAction(args, 'close');
					break;
				case 'winmin':
					this.cmdWinAction(args, 'minimize');
					break;
				case 'winmax':
					this.cmdWinAction(args, 'maximize');
					break;
				case 'winfocus':
					this.cmdWinAction(args, 'focus');
					break;
				case 'cascade':
					if (window.Taskbar) window.Taskbar.cascadeWindows();
					this.println('Windows cascaded.');
					break;
				case 'tileh':
					if (window.Taskbar) window.Taskbar.tileWindows(true);
					this.println('Windows tiled horizontally.');
					break;
				case 'tilev':
					if (window.Taskbar) window.Taskbar.tileWindows(false);
					this.println('Windows tiled vertically.');
					break;
				case 'showdesktop':
					if (window.Taskbar) window.Taskbar.showDesktop();
					break;
				case 'notepad':
				case 'edit':
					this.cmdNotepad(args);
					break;
				case 'touch':
					this.cmdTouch(args);
					break;
				case 'write':
					this.cmdWrite(args, false);
					break;
				case 'append':
					this.cmdWrite(args, true);
					break;
				case 'theme':
					this.cmdTheme(args);
					break;
				case 'wallpaper':
					this.cmdWallpaper(args);
					break;
				case 'sound':
					this.cmdSound(args);
					break;
				case 'clippy':
					this.cmdClippy(args);
					break;
				case 'control':
					this.cmdControl(args);
					break;
				case 'reg':
					this.cmdReg(args);
					break;
				case 'ping':
					await this.cmdPing(args);
					break;
				case 'ipconfig':
					this.cmdIpconfig(args);
					break;
				case 'tracert':
					await this.cmdTracert(args);
					break;
				case 'nslookup':
					this.cmdNslookup(args);
					break;
				case 'netstat':
					this.cmdNetstat(args);
					break;
				case 'curl':
				case 'wget':
				case 'http':
					await this.cmdCurl(args);
					break;
				case 'weather':
					this.cmdWeather(args);
					break;
				case 'telnet':
					this.cmdTelnet(args);
					break;
				case 'browser':
				case 'iexplore':
				case 'ie':
					this.cmdBrowser(args);
					break;
				case 'mail':
				case 'oe':
					this.cmdMail(args);
					break;
				case 'winamp':
					this.cmdWinamp(args);
					break;
				case 'minesweeper':
				case 'mine':
					if (window.DeskAPI) window.DeskAPI.openMinesweeperGame();
					break;
				case 'solitaire':
					showXPDialog('Solitaire', 'Klondike Solitaire loading...', 'info');
					break;
				case 'anecdote':
					this.cmdAnecdote(args);
					break;
				case 'matrix':
					this.startMatrixAnimation();
					break;
				case 'say':
					this.cmdSay(args);
					break;
				case 'beep':
					this.cmdBeep(args);
					break;
				case 'play':
					this.cmdPlay(args);
					break;
				case 'chkdsk':
					this.cmdChkdsk(args);
					break;
				case 'defrag':
					this.cmdDefrag(args);
					break;
				case 'cleanmgr':
					if (fs && fs.emptyRecycleBin) fs.emptyRecycleBin();
					this.println('Recycle bin emptied.');
					if (typeof refreshUI === 'function') refreshUI();
					break;
				case 'diskpart':
					this.cmdDiskpart();
					break;
				case 'dxdiag':
					showXPDialog('DirectX Diagnostic Tool', 'DirectX 9.0c installed.\nDirectDraw, Direct3D, AGP Texture Acceleration Enabled.', 'info');
					break;
				case 'calc':
					showXPDialog('Calculator', 'Calculator is opening...', 'info');
					break;
				case 'cmd':
					CommandPrompt.open();
					break;
				case 'start':
					this.cmdStart(args);
					break;
				case 'shutdown':
					this.cmdShutdown(args);
					break;
				case 'bsod':
					triggerBSOD();
					break;
				case 'exit':
					closeWindow(this.win, this.win.id);
					break;
				default:
					const maybeBatch = this.currentFolder.getByName(tokens[0]);
					if (maybeBatch instanceof File && (maybeBatch.name.endsWith('.bat') || maybeBatch.name.endsWith('.cmd'))) {
						await this.executeBatch(maybeBatch.content);
						return;
					}
					this.env['ERRORLEVEL'] = '9009';
					this.println(`'${tokens[0]}' is not recognized as an internal or external command,`);
					this.println('operable program or batch file.\n');
					break;
			}
		}

		parseCommandLine(line) {
			const tokens = [];
			let current = '';
			let inQuotes = false;

			for (let i = 0; i < line.length; i++) {
				const char = line[i];
				if (char === '"') {
					inQuotes = !inQuotes;
				} else if (char === ' ' && !inQuotes) {
					if (current.length > 0) {
						tokens.push(current);
						current = '';
					}
				} else {
					current += char;
				}
			}

			if (current.length > 0) {
				tokens.push(current);
			}

			return tokens;
		}

		cmdHelp(args) {
			if (window.AchievementsManager) {
				window.AchievementsManager.progress('cmd_help_spammer', 1);
			}

			if (args.length > 0) {
				const specific = args[0].toLowerCase();
				this.println(`Help for command: ${specific.toUpperCase()}`);
				this.println(`Executes Windows XP internal shell command '${specific}'.\n`);
				return;
			}

			this.println('For more information on a specific command, type HELP command-name');
			this.println('ATTRIB     Displays file attributes.');
			this.println('CD / CHDIR Displays the name of or changes the current directory.');
			this.println('CLS        Clears the screen.');
			this.println('COLOR      Sets the default console foreground and background colors.');
			this.println('COPY       Copies one or more files to another location.');
			this.println('DATE       Displays or sets the date.');
			this.println('DEL        Deletes one or more files.');
			this.println('DIR        Displays a list of files and subdirectories in a directory.');
			this.println('ECHO       Displays messages, or turns command-echoing on or off.');
			this.println('EXIT       Quits the CMD.EXE program (command interpreter).');
			this.println('FIND       Searches for a text string in a file or files.');
			this.println('FONT       Sets the console font family or size.');
			this.println('HELP       Provides Help information for Windows commands.');
			this.println('IPCONFIG   Displays all current TCP/IP network configuration values.');
			this.println('MATRIX     Runs the Matrix digital raining code simulation.');
			this.println('MD / MKDIR Creates a directory.');
			this.println('MOVE       Moves one or more files from one directory to another.');
			this.println('PAUSE      Suspends processing of a batch file and displays a message.');
			this.println('PING       Verifies IP-level connectivity to another computer.');
			this.println('PROMPT     Changes the Windows command prompt.');
			this.println('RD / RMDIR Removes a directory.');
			this.println('REN        Renames a file or files.');
			this.println('SET        Displays or sets Windows environment variables.');
			this.println('SHUTDOWN   Allows proper local machine shutdown or restart.');
			this.println('START      Starts a separate window to run a specified program.');
			this.println('SYSTEMINFO Displays machine specific properties and configuration.');
			this.println('TASKKILL   Kill or stop a running process or application.');
			this.println('TASKLIST   Displays all currently running tasks.');
			this.println('TIME       Displays or sets the system time.');
			this.println('TITLE      Sets the window title for a CMD.EXE session.');
			this.println('TREE       Graphically displays the folder structure of a drive/path.');
			this.println('TYPE       Displays the contents of a text file.');
			this.println('VER        Displays the Windows version.');
			this.println('VOL        Displays a disk volume label and serial number.\n');
		}

		cmdDir(args) {
			const showBare = args.includes('/b') || args.includes('/B');
			const showWide = args.includes('/w') || args.includes('/W');
			let target = this.currentFolder;

			const pathArg = args.find(a => !a.startsWith('/'));
			if (pathArg) {
				const resolved = resolveFsFromVirtualPath(pathArg.startsWith('/') ? pathArg : `${this.currentFolder.getFullPath()}/${pathArg}`);
				if (resolved instanceof Folder) {
					target = resolved;
				} else {
					this.println('File Not Found\n');
					return;
				}
			}

			const items = target.listContent();
			const vPath = formatVirtualPath(target);

			if (!showBare) {
				this.println(` Volume in drive C has no label.`);
				this.println(` Volume Serial Number is 4C28-91FA`);
				this.println(` Directory of ${vPath}\n`);
			}

			let totalBytes = 0;
			let fileCount = 0;
			let dirCount = 0;

			if (!showBare) {
				const now = new Date();
				const dateStr = now.toLocaleDateString() + '  ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
				this.println(`${dateStr}    <DIR>          .`);
				this.println(`${dateStr}    <DIR>          ..`);
			}

			items.forEach(item => {
				const isDir = item instanceof Folder;
				const date = item.modifiedAt || new Date();
				const dateStr = date.toLocaleDateString() + '  ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

				if (showBare) {
					this.println(item.name);
				} else if (showWide) {
					this.printRawHtml(`[${item.name}] `);
				} else {
					if (isDir) {
						dirCount++;
						this.println(`${dateStr}    <DIR>          ${item.name}`);
					} else {
						fileCount++;
						const size = item.size || 0;
						totalBytes += size;
						this.println(`${dateStr}        ${padLeft(size.toLocaleString(), 10)} ${item.name}`);
					}
				}
			});

			if (!showBare) {
				this.println(`               ${fileCount} File(s)    ${totalBytes.toLocaleString()} bytes`);
				this.println(`               ${dirCount + 2} Dir(s)   26,624,819,200 bytes free\n`);
			}
		}

		cmdCd(args) {
			if (args.length === 0) {
				this.println(formatVirtualPath(this.currentFolder) + '\n');
				return;
			}

			let target = args[0].replace(/"/g, '');

			if (target === '.' || target === '') {
				return;
			}

			if (target === '..') {
				if (this.currentFolder.parent) {
					this.currentFolder = this.currentFolder.parent;
				}
				return;
			}

			if (target === '\\' || target === '/' || target.toLowerCase() === 'c:' || target.toLowerCase() === 'c:\\') {
				this.currentFolder = fs.root;
				return;
			}

			const child = this.currentFolder.getByName(target);
			if (child instanceof Folder) {
				this.currentFolder = child;
				return;
			}

			const full = resolveFsFromVirtualPath(target.startsWith('/') || target.startsWith('C:') ? target : `${this.currentFolder.getFullPath()}/${target}`);
			if (full instanceof Folder) {
				this.currentFolder = full;
			} else {
				this.println('The system cannot find the path specified.\n');
			}
		}

		cmdMkdir(args) {
			if (args.length === 0) {
				this.println('The syntax of the command is incorrect.\n');
				return;
			}
			const name = args[0].replace(/"/g, '');
			try {
				fs.create('Folder', this.currentFolder.getFullPath(), name);
				refreshUI();
			} catch (e) {
				this.println(`A subdirectory or file ${name} already exists.\n`);
			}
		}

		cmdRmdir(args) {
			if (args.length === 0) {
				this.println('The syntax of the command is incorrect.\n');
				return;
			}
			const name = args.filter(a => !a.startsWith('/'))[0]?.replace(/"/g, '');
			const el = this.currentFolder.getByName(name);
			if (el instanceof Folder) {
				try {
					fs.delete(el.getFullPath());
					refreshUI();
				} catch (e) {
					this.println(`Unable to remove directory ${name}.\n`);
				}
			} else {
				this.println('The system cannot find the file specified.\n');
			}
		}

		cmdDel(args) {
			if (args.length === 0) {
				this.println('The syntax of the command is incorrect.\n');
				return;
			}
			const name = args.filter(a => !a.startsWith('/'))[0]?.replace(/"/g, '');
			const el = this.currentFolder.getByName(name);
			if (el && !(el instanceof Folder)) {
				try {
					fs.moveToRecycleBin(el.getFullPath());
					refreshUI();
				} catch (e) {
					this.println(`Could Not Find ${name}\n`);
				}
			} else {
				this.println(`Could Not Find ${name}\n`);
			}
		}

		cmdCopy(args) {
			if (args.length < 2) {
				this.println('The syntax of the command is incorrect.\n');
				return;
			}
			const src = args[0].replace(/"/g, '');
			const dest = args[1].replace(/"/g, '');
			const el = this.currentFolder.getByName(src);
			if (!el) {
				this.println('The system cannot find the file specified.\n');
				return;
			}
			try {
				fs.copy(el.getFullPath(), this.currentFolder.getFullPath());
				this.println('        1 file(s) copied.\n');
				refreshUI();
			} catch (e) {
				this.println(`Error copying file: ${e.message}\n`);
			}
		}

		cmdMove(args) {
			if (args.length < 2) {
				this.println('The syntax of the command is incorrect.\n');
				return;
			}
			const src = args[0].replace(/"/g, '');
			const dest = args[1].replace(/"/g, '');
			const el = this.currentFolder.getByName(src);
			const targetFolder = resolveFsFromVirtualPath(dest) || this.currentFolder;
			if (!el || !(targetFolder instanceof Folder)) {
				this.println('The system cannot find the file specified.\n');
				return;
			}
			try {
				fs.move(el.getFullPath(), targetFolder.getFullPath());
				this.println('        1 file(s) moved.\n');
				refreshUI();
			} catch (e) {
				this.println(`Error moving file: ${e.message}\n`);
			}
		}

		cmdRename(args) {
			if (args.length < 2) {
				this.println('The syntax of the command is incorrect.\n');
				return;
			}
			const oldName = args[0].replace(/"/g, '');
			const newName = args[1].replace(/"/g, '');
			const el = this.currentFolder.getByName(oldName);
			if (el) {
				try {
					el.rename(newName);
					fs.save();
					refreshUI();
				} catch (e) {
					this.println(`A duplicate file name exists, or the file cannot be found.\n`);
				}
			} else {
				this.println('The system cannot find the file specified.\n');
			}
		}

		cmdType(args) {
			if (args.length === 0) {
				this.println('The syntax of the command is incorrect.\n');
				return;
			}
			const name = args[0].replace(/"/g, '');
			const el = this.currentFolder.getByName(name);
			if (el instanceof File) {
				const plain = (el.content || '').replace(/<[^>]*>/g, '\n');
				this.println(plain);
				this.println();
			} else {
				this.println('The system cannot find the file specified.\n');
			}
		}

		cmdEcho(args, rawLine) {
			const rest = rawLine.replace(/^[eE][cC][hH][oO]\s*/, '');
			if (!rest) {
				this.println('ECHO is on.\n');
				return;
			}
			if (rest.toLowerCase() === 'off' || rest.toLowerCase() === 'on') {
				return;
			}
			this.println(rest);
		}

		cmdColor(args) {
			if (args.length === 0) {
				this.applyColors('0', '7');
				return;
			}
			const attr = args[0].toLowerCase();
			if (attr.length === 1) {
				this.applyColors('0', attr[0]);
			} else if (attr.length >= 2) {
				this.applyColors(attr[0], attr[1]);
			}
		}

		cmdTitle(args, rawLine) {
			const rest = rawLine.replace(/^[tT][iI][tT][lL][eE]\s*/, '');
			if (rest) {
				this.setTitle(rest);
			}
		}

		cmdTree(args) {
			this.println(`Folder PATH listing for volume C:`);
			this.println(`Volume serial number is 4C28-91FA`);
			this.println(formatVirtualPath(this.currentFolder));

			const printBranch = (folder, prefix = '') => {
				const children = folder.listContent().filter(c => c instanceof Folder);
				children.forEach((child, index) => {
					const isLast = index === children.length - 1;
					this.println(`${prefix}${isLast ? '└───' : '├───'}${child.name}`);
					printBranch(child, prefix + (isLast ? '    ' : '│   '));
				});
			};

			printBranch(this.currentFolder);
			this.println();
		}

		cmdTasklist() {
			this.println('Image Name                   PID Session Name        Session#    Mem Usage');
			this.println('========================= ====== ================ ======== ============');
			this.println('System Idle Process            0 Console                 0         16 K');
			this.println('System                         4 Console                 0        212 K');
			this.println('smss.exe                     368 Console                 0        388 K');
			this.println('csrss.exe                    584 Console                 0      3,240 K');
			this.println('winlogon.exe                 608 Console                 0      2,512 K');
			this.println('services.exe                 652 Console                 0      3,876 K');
			this.println('lsass.exe                    664 Console                 0      4,120 K');
			this.println('svchost.exe                  844 Console                 0      4,928 K');
			this.println('explorer.exe                1492 Console                 0     14,832 K');
			this.println('cmd.exe                     1832 Console                 0      2,416 K');

			if (typeof openWindows !== 'undefined') {
				let pid = 2000;
				Object.keys(openWindows).forEach(id => {
					const name = id.replace('window-', '') + '.exe';
					this.println(`${padRight(name.slice(0, 25), 25)} ${padLeft(pid++, 6)} Console                 0      8,192 K`);
				});
			}
			this.println();
		}

		cmdTaskkill(args) {
			if (args.length === 0) {
				this.println('ERROR: Invalid syntax.\n');
				return;
			}
			const target = args[args.length - 1];
			this.println(`SUCCESS: The process "${target}" has been terminated.\n`);
		}

		async cmdPing(args) {
			const host = args.find(a => !a.startsWith('/')) || '127.0.0.1';
			this.hidePrompt();
			this.println(`\nPinging ${host} with 32 bytes of data:\n`);

			for (let i = 0; i < 4; i++) {
				await new Promise(r => setTimeout(r, 600));
				const time = Math.floor(Math.random() * 25 + 10);
				this.println(`Reply from ${host === 'localhost' ? '127.0.0.1' : host}: bytes=32 time=${time}ms TTL=128`);
			}

			this.println(`\nPing statistics for ${host}:`);
			this.println(`    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),`);
			this.println(`Approximate round trip times in milli-seconds:`);
			this.println(`    Minimum = 12ms, Maximum = 34ms, Average = 21ms\n`);
		}

		cmdIpconfig(args) {
			this.println('\nWindows IP Configuration\n');
			this.println('Ethernet adapter Local Area Connection:');
			this.println('   Connection-specific DNS Suffix  . : localdomain');
			this.println('   IP Address. . . . . . . . . . . . : 192.168.1.100');
			this.println('   Subnet Mask . . . . . . . . . . . : 255.255.255.0');
			this.println('   Default Gateway . . . . . . . . . : 192.168.1.1\n');
		}

		cmdMore(args, stdin) {
			if (stdin) {
				this.println(stdin);
				return;
			}
			if (args.length > 0) {
				this.cmdType(args);
			}
		}

		cmdFind(args, stdin) {
			let ignoreCase = false;
			let countOnly = false;
			let query = '';
			let targetFiles = [];

			args.forEach(a => {
				if (a.toLowerCase() === '/i') ignoreCase = true;
				else if (a.toLowerCase() === '/c') countOnly = true;
				else if (!query && (a.startsWith('"') || !a.startsWith('/'))) query = a.replace(/"/g, '');
				else if (!a.startsWith('/')) targetFiles.push(a.replace(/"/g, ''));
			});

			if (!query) {
				this.println('FIND: Parameter format not correct\n');
				return;
			}

			const processText = (text, headerName = '') => {
				const lines = text.split('\n');
				let matches = 0;
				if (headerName) this.println(`---------- ${headerName.toUpperCase()}`);
				lines.forEach(l => {
					const haystack = ignoreCase ? l.toLowerCase() : l;
					const needle = ignoreCase ? query.toLowerCase() : query;
					if (haystack.includes(needle)) {
						matches++;
						if (!countOnly) this.println(l);
					}
				});
				if (countOnly) this.println(String(matches));
			};

			if (targetFiles.length === 0) {
				processText(stdin, '');
			} else {
				targetFiles.forEach(fName => {
					const el = this.currentFolder.getByName(fName);
					if (el instanceof File) {
						processText(el.content, el.name);
					} else {
						this.println(`File not found - ${fName}`);
					}
				});
			}
			this.println();
		}

		cmdFindstr(args, stdin) {
			this.cmdFind(args, stdin);
		}

		cmdSort(args, stdin) {
			let text = stdin;
			if (!text && args.length > 0) {
				const el = this.currentFolder.getByName(args[0].replace(/"/g, ''));
				if (el instanceof File) text = el.content;
			}
			if (!text) return;
			const sorted = text.split('\n').sort((a, b) => a.localeCompare(b));
			this.println(sorted.join('\n'));
		}

		cmdWinList() {
			this.println('\n Active Windows & Processes:');
			this.println(' ========================================================');
			if (typeof openWindows === 'undefined' || Object.keys(openWindows).length === 0) {
				this.println(' No application windows are currently open.');
			} else {
				Object.entries(openWindows).forEach(([id, win]) => {
					const title = win.querySelector('.xp-window-header .title')?.textContent || id;
					const state = win.classList.contains('minimized') ? 'Minimized' : (win.classList.contains('maximized') ? 'Maximized' : 'Normal');
					this.println(` [${padRight(id, 24)}] ${padRight(state, 10)} ${title}`);
				});
			}
			this.println();
		}

		cmdWinAction(args, action) {
			if (args.length === 0) {
				this.println(`Usage: win${action} <window-id or partial title>`);
				return;
			}
			const target = args.join(' ').toLowerCase();
			let matched = null;

			Object.entries(openWindows).forEach(([id, win]) => {
				const title = (win.querySelector('.xp-window-header .title')?.textContent || '').toLowerCase();
				if (id.toLowerCase().includes(target) || title.includes(target)) {
					matched = { id, win };
				}
			});

			if (!matched) {
				this.println(`Window '${target}' not found.\n`);
				return;
			}

			if (action === 'close') closeWindow(matched.win, matched.id);
			else if (action === 'minimize') minimizeWindow(matched.win, matched.id);
			else if (action === 'maximize') maximizeWindow(matched.win);
			else if (action === 'focus') {
				if (matched.win.classList.contains('minimized')) unminimizeWindow(matched.win);
				bringWindowToFront(matched.win);
			}
			this.println(`Window '${matched.id}' updated.`);
		}

		cmdNotepad(args) {
			if (args.length === 0) {
				if (window.NotepadApp) window.NotepadApp.openNew();
				return;
			}
			const name = args.join(' ').replace(/"/g, '');
			let file = this.currentFolder.getByName(name);
			if (!file) {
				file = fs.create('File', this.currentFolder.getFullPath(), name);
				if (name.endsWith('.bat') || name.endsWith('.cmd')) {
					file.icon = '../assets/images/desk/icons/Command Prompt.webp';
				}
				if (typeof refreshUI === 'function') refreshUI();
			}
			if (window.NotepadApp) window.NotepadApp.open(file);
		}

		cmdTouch(args) {
			if (args.length === 0) {
				this.println('Usage: touch <filename>');
				return;
			}
			const name = args[0].replace(/"/g, '');
			let file = this.currentFolder.getByName(name);
			if (!file) {
				file = fs.create('File', this.currentFolder.getFullPath(), name);
			}
			file.modifiedAt = new Date();
			fs.save();
			if (typeof refreshUI === 'function') refreshUI();
			this.println(`Touched ${name}.`);
		}

		cmdWrite(args, isAppend = false) {
			if (args.length < 2) {
				this.println('Usage: write/append <filename> <content text>');
				return;
			}
			const name = args[0].replace(/"/g, '');
			const content = args.slice(1).join(' ');
			let file = this.currentFolder.getByName(name);
			if (!file) {
				file = fs.create('File', this.currentFolder.getFullPath(), name);
			}
			if (file instanceof File) {
				file.write(isAppend ? (file.content + '\n' + content) : content);
				fs.save();
				if (typeof refreshUI === 'function') refreshUI();
				this.println(`Wrote to ${name}.`);
			}
		}

		cmdTheme(args) {
			const valid = ['luna-blue', 'royale', 'silver', 'olive', 'classic', 'zune'];
			if (args.length === 0) {
				const current = (window.SettingsApp && window.SettingsApp.get('theme')) || 'luna-blue';
				this.println(`Current theme: ${current}`);
				this.println(`Available: ${valid.join(', ')}`);
				return;
			}
			const chosen = args[0].toLowerCase();
			if (valid.includes(chosen)) {
				if (window.SettingsApp) window.SettingsApp.set('theme', chosen);
				this.println(`Theme applied: ${chosen}`);
			} else {
				this.println(`Invalid theme. Available: ${valid.join(', ')}`);
			}
		}

		cmdWallpaper(args) {
			if (args.length === 0) {
				const current = (window.SettingsApp && window.SettingsApp.get('desktopBackground')) || 'Default';
				this.println(`Current desktop background: ${current}`);
				return;
			}
			const wp = args.join(' ');
			if (window.SettingsApp) window.SettingsApp.set('desktopBackground', wp);
			this.println(`Desktop wallpaper set to ${wp}.`);
		}

		cmdSound(args) {
			if (args.length === 0) {
				const enabled = window.SettingsApp ? window.SettingsApp.get('soundEnabled') : true;
				const vol = window.SettingsApp ? window.SettingsApp.get('soundVolume') : 0.7;
				this.println(`Sound: ${enabled ? 'Enabled' : 'Disabled'}, Volume: ${Math.round(vol * 100)}%`);
				return;
			}
			if (args[0] === 'on' || args[0] === 'enable') {
				if (window.SettingsApp) window.SettingsApp.set('soundEnabled', true);
				this.println('System sounds enabled.');
			} else if (args[0] === 'off' || args[0] === 'mute') {
				if (window.SettingsApp) window.SettingsApp.set('soundEnabled', false);
				this.println('System sounds muted.');
			} else if (!isNaN(parseFloat(args[0]))) {
				const vol = Math.max(0, Math.min(1, parseFloat(args[0])));
				if (window.SettingsApp) window.SettingsApp.set('soundVolume', vol);
				this.println(`Volume set to ${Math.round(vol * 100)}%`);
			}
		}

		cmdClippy(args) {
			if (args.length === 0) {
				this.println('Usage: clippy [show|hide|say <message>|anim]');
				return;
			}
			const act = args[0].toLowerCase();
			if (act === 'show') {
				if (window.SettingsApp) window.SettingsApp.set('clippyEnabled', true);
				if (window.ClippyAgent && window.ClippyAgent.showTip) window.ClippyAgent.showTip();
			} else if (act === 'hide') {
				if (window.SettingsApp) window.SettingsApp.set('clippyEnabled', false);
				if (window.ClippyAgent && window.ClippyAgent.hide) window.ClippyAgent.hide();
			} else if (act === 'say') {
				const msg = args.slice(1).join(' ');
				if (window.ClippyAgent && window.ClippyAgent.showCustomMessage) window.ClippyAgent.showCustomMessage(msg);
			} else if (act === 'anim' || act === 'animate') {
				if (window.ClippyAgent && window.ClippyAgent.playRandomAnimation) window.ClippyAgent.playRandomAnimation();
			}
		}

		cmdControl(args) {
			const tab = args[0] || 'system';
			if (window.SettingsApp) window.SettingsApp.open(tab);
			this.println(`Opened Control Panel [${tab}].`);
		}

		cmdReg(args) {
			if (args.length === 0) {
				this.println('Usage: REG [QUERY | ADD | DELETE] [KEY]');
				return;
			}
			const sub = args[0].toUpperCase();
			if (sub === 'QUERY') {
				const key = args[1];
				if (!key) {
					for (let i = 0; i < localStorage.length; i++) {
						this.println(`HKEY_CURRENT_USER\\Software\\Wartets\\${localStorage.key(i)}`);
					}
				} else {
					const val = localStorage.getItem(key);
					this.println(`HKEY_CURRENT_USER\\Software\\Wartets\\${key}`);
					this.println(`    ${key}    REG_SZ    ${val || ''}`);
				}
			} else if (sub === 'ADD' && args.length >= 3) {
				const key = args[1];
				const val = args.slice(2).join(' ');
				localStorage.setItem(key, val);
				this.println('The operation completed successfully.');
			} else if (sub === 'DELETE' && args.length >= 2) {
				const key = args[1];
				localStorage.removeItem(key);
				this.println('The operation completed successfully.');
			}
		}

		async cmdTracert(args) {
			const host = args[0] || 'wartets.github.io';
			this.println(`\nTracing route to ${host} [192.168.1.1] over a maximum of 30 hops:\n`);
			const hops = [
				'  1    <1 ms    <1 ms    <1 ms  192.168.1.1',
				'  2    12 ms    11 ms    14 ms  10.0.0.1',
				'  3    18 ms    17 ms    19 ms  80.10.246.1',
				`  4    24 ms    22 ms    25 ms  ${host} [185.199.108.153]`
			];
			for (const h of hops) {
				await new Promise(r => setTimeout(r, 400));
				this.println(h);
			}
			this.println('\nTrace complete.\n');
		}

		cmdNslookup(args) {
			const host = args[0] || 'wartets.github.io';
			this.println(`Server:  resolver1.opendns.com`);
			this.println(`Address:  208.67.222.222\n`);
			this.println(`Non-authoritative answer:`);
			this.println(`Name:    ${host}`);
			this.println(`Address: 185.199.108.153\n`);
		}

		cmdNetstat(args) {
			this.println('\nActive Connections\n');
			this.println('  Proto  Local Address          Foreign Address        State');
			this.println('  TCP    192.168.1.100:1042     185.199.108.153:80     ESTABLISHED');
			this.println('  TCP    192.168.1.100:1043     185.199.108.153:443    ESTABLISHED');
			this.println('  TCP    192.168.1.100:135      0.0.0.0:0              LISTENING');
			this.println('  UDP    192.168.1.100:137      *:*');
			this.println();
		}

		async cmdCurl(args) {
			if (args.length === 0) {
				this.println('Usage: curl <url>');
				return;
			}
			const url = args[0];
			this.println(`Connecting to ${url}...`);
			try {
				const res = await fetch(url);
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				const txt = await res.text();
				this.println(txt.slice(0, 1000) + (txt.length > 1000 ? '\n...[truncated]' : ''));
			} catch (e) {
				this.println(`curl: (6) Could not resolve host or fetch resource: ${e.message}`);
			}
		}

		cmdWeather(args) {
			const city = args[0] || 'Paris';
			this.println(`\n Weather report for: ${city}`);
			this.println('      \\   /     Sunny / Clear');
			this.println('       .-.      22 °C / 71 °F');
			this.println('    ― (   ) ―   Wind: 12 km/h NW');
			this.println('       `-’      Humidity: 48%');
			this.println('      /   \\     Barometer: 1018 hPa\n');
		}

		cmdTelnet(args) {
			const host = (args[0] || '').toLowerCase();
			if (host.includes('starwars') || host.includes('blinkenlights')) {
				this.startStarWarsAnimation();
			} else {
				this.println(`Connecting to ${host}... Connection failed: Connection refused.`);
			}
		}

		startStarWarsAnimation() {
			this.isStarWarsRunning = true;
			this.hidePrompt();
			this.clearScreen();
			const frames = [
				`\n        _______________________\n       /                       \\\n      |   EPISODE IV: A NEW HOPE |\n       \\_______________________/\n\n   It is a period of civil war.\n   Rebel spaceships, striking from\n   a hidden base, have won their\n   first victory against the evil\n   Galactic Empire...\n\n   [Press any key to exit]`,
				`\n        _______________________\n       /                       \\\n      |   STAR WARS IN ASCII   |\n       \\_______________________/\n\n             === [ o ] ===\n                  /|\\\n                 / | \\\n                *  *  *\n\n   [Press any key to exit]`
			];
			let fIdx = 0;
			this.starWarsInterval = setInterval(() => {
				if (!this.isStarWarsRunning) return;
				this.clearScreen();
				this.println(frames[fIdx % frames.length]);
				fIdx++;
			}, 1200);
		}

		stopStarWarsAnimation() {
			this.isStarWarsRunning = false;
			if (this.starWarsInterval) clearInterval(this.starWarsInterval);
			this.clearScreen();
			this.println('\nConnection closed by foreign host.\n');
			this.showPrompt();
		}

		cmdBrowser(args) {
			if (typeof openInternetExplorer === 'function') openInternetExplorer();
			if (args.length > 0) {
				const ieWin = document.getElementById('window-internet-explorer');
				if (ieWin) {
					const addr = ieWin.querySelector('#ie-address-bar');
					const go = ieWin.querySelector('#ie-go-btn');
					if (addr && go) {
						addr.value = args[0];
						go.click();
					}
				}
			}
		}

		cmdMail(args) {
			if (args.length === 0) {
				if (typeof openOutlookExpress === 'function') openOutlookExpress();
				return;
			}
			if (args[0] === 'list' && window.MailStore) {
				const msgs = window.MailStore.getMessages('inbox');
				this.println(`\nInbox (${msgs.length} messages):`);
				msgs.forEach(m => {
					this.println(` [${m.read ? 'READ' : 'UNREAD'}] ${padRight(m.from, 20)} ${m.subject}`);
				});
				this.println();
			} else if (args[0] === 'send' && args.length >= 4 && window.MailStore) {
				const to = args[1];
				const subject = args[2];
				const body = args.slice(3).join(' ');
				window.MailStore.sendMessage({ to, subject, body });
				this.println(`E-mail sent to ${to}.`);
			}
		}

		cmdWinamp(args) {
			if (typeof openWinamp === 'function') openWinamp();
			this.println('Winamp media player launched.');
		}

		cmdAnecdote(args) {
			if (typeof openAnecdoteWindow === 'function') {
				openAnecdoteWindow(new Date());
				this.println("Today's anecdote window opened.");
			}
		}

		cmdSay(args) {
			const text = args.join(' ');
			if ('speechSynthesis' in window) {
				const ut = new SpeechSynthesisUtterance(text);
				window.speechSynthesis.speak(ut);
				this.println(`Spoken: "${text}"`);
			} else {
				this.println(`[TTS not supported]: ${text}`);
			}
		}

		cmdBeep(args) {
			const freq = parseFloat(args[0]) || 750;
			const dur = parseFloat(args[1]) || 200;
			if (window.SettingsApp && window.SettingsApp.playSound) {
				window.SettingsApp.playSound('click');
			}
			this.println(`Beep (${freq}Hz, ${dur}ms)`);
		}

		cmdPlay(args) {
			const type = args[0] || 'startup';
			if (window.SettingsApp && window.SettingsApp.playSound) {
				window.SettingsApp.playSound(type);
				this.println(`Sound played: ${type}`);
			}
		}

		cmdChkdsk(args) {
			this.println('\nThe type of the file system is NTFS.');
			this.println('Volume label is SYSTEM_XP.\n');
			this.println('WARNING!  F parameter not specified.');
			this.println('Running CHKDSK in read-only mode.\n');
			this.println('CHKDSK is verifying files (stage 1 of 3)...');
			this.println('File verification completed.');
			this.println('CHKDSK is verifying indexes (stage 2 of 3)...');
			this.println('Index verification completed.');
			this.println('CHKDSK is verifying security descriptors (stage 3 of 3)...');
			this.println('Security descriptor verification completed.\n');
			this.println('  41,940,000 KB total disk space.');
			this.println('  15,315,181 KB in 24,198 files.');
			this.println('   2,624,819 KB free.\n');
		}

		cmdDefrag(args) {
			this.println('\nWindows Disk Defragmenter');
			this.println('Copyright (c) 2001 MacroPof Corp. and Executive Software International, Inc.\n');
			this.println('Analysis Report for Volume (C:):');
			this.println('    Volume size                 = 40.0 GB');
			this.println('    Free space                  = 24.8 GB');
			this.println('    Total fragmentation         = 0 %');
			this.println('    File fragmentation          = 0 %\n');
			this.println('You do not need to defragment this volume.\n');
		}

		cmdDiskpart() {
			this.println('\nMacroPof DiskPart version 5.1.2600');
			this.println('Copyright (C) 1999-2001 MacroPof Corporation.\n');
			this.println('DISKPART> LIST DISK');
			this.println('  Disk ###  Status      Size     Free     Dyn  Gpt');
			this.println('  --------  ----------  -------  -------  ---  ---');
			this.println('  Disk 0    Online        40 GB      0 B          \n');
		}

		cmdSet(args) {
			if (args.length === 0) {
				Object.keys(this.env).sort().forEach(k => {
					this.println(`${k}=${this.env[k]}`);
				});
				this.println();
				return;
			}

			if (args[0].toLowerCase() === '/a') {
				const expr = args.slice(1).join('');
				const eq = expr.indexOf('=');
				if (eq !== -1) {
					const varName = expr.slice(0, eq).trim().toUpperCase();
					const mathExpr = expr.slice(eq + 1).trim();
					try {
						const evaluated = Function(`"use strict"; return (${mathExpr.replace(/[^0-9+\-*/().]/g, '')});`)();
						this.env[varName] = String(evaluated);
						this.println(String(evaluated));
					} catch (e) {
						this.println('Invalid numeric expression.');
					}
				}
				return;
			}

			const expr = args.join(' ');
			const eqIdx = expr.indexOf('=');
			if (eqIdx !== -1) {
				const key = expr.slice(0, eqIdx).trim().toUpperCase();
				const val = expr.slice(eqIdx + 1).trim();
				if (val) {
					this.env[key] = val;
				} else {
					delete this.env[key];
				}
			}
		}

		cmdStart(args) {
			if (args.length === 0) {
				CommandPrompt.open();
				return;
			}
			const app = args[0].toLowerCase();
			if (app === 'notepad') {
				NotepadApp.openNew();
			} else if (app === 'iexplore' || app === 'ie') {
				if (typeof openInternetExplorer === 'function') openInternetExplorer();
			} else if (app === 'winamp') {
				if (typeof openWinamp === 'function') openWinamp();
			} else if (app === 'calc') {
				showXPDialog('Calculator', 'Calculator is opening...', 'info');
			} else if (app === 'explorer') {
				if (window.FileExplorer) window.FileExplorer.open(this.currentFolder);
			} else if (app === 'matrix') {
				this.startMatrixAnimation();
			} else {
				const child = this.currentFolder.getByName(args[0]);
				if (child) {
					openFileSystemElement(child, this.win);
				} else {
					window.open(args[0], '_blank');
				}
			}
		}

		cmdAttrib(args) {
			const items = this.currentFolder.listContent();
			items.forEach(item => {
				const r = item.readOnly ? 'R' : ' ';
				const h = item.hidden ? 'H' : ' ';
				this.println(`A    ${r}  ${h}        ${formatVirtualPath(this.currentFolder)}\\${item.name}`);
			});
			this.println();
		}

		cmdPrompt(args) {
			if (args.length === 0) {
				this.promptPattern = '$P$G';
			} else {
				this.promptPattern = args.join(' ');
			}
		}

		async cmdPause() {
			this.hidePrompt();
			this.println('Press any key to continue . . .');
			await new Promise(resolve => {
				this.pauseCallback = resolve;
			});
			this.println();
		}

		cmdSet(args) {
			if (args.length === 0) {
				Object.keys(this.env).sort().forEach(k => {
					this.println(`${k}=${this.env[k]}`);
				});
				this.println();
				return;
			}
			const expr = args.join(' ');
			const eqIdx = expr.indexOf('=');
			if (eqIdx !== -1) {
				const key = expr.slice(0, eqIdx).trim().toUpperCase();
				const val = expr.slice(eqIdx + 1).trim();
				if (val) {
					this.env[key] = val;
				} else {
					delete this.env[key];
				}
			}
		}

		cmdFont(args) {
			if (args.length === 0) {
				this.println(`Current font: ${this.fontFamily} (${this.fontSize})\n`);
				return;
			}
			const argStr = args.join(' ').toLowerCase();
			if (argStr.includes('arcade') || argStr.includes('retro')) {
				this.fontFamily = "'Press Start 2P', monospace";
				this.fontSize = '11px';
			} else if (argStr.includes('courier')) {
				this.fontFamily = "'Courier New', monospace";
				this.fontSize = '14px';
			} else {
				this.fontFamily = "Consolas, 'Lucida Console', monospace";
				this.fontSize = '13px';
			}
			this.terminalEl.style.fontFamily = this.fontFamily;
			this.terminalEl.style.fontSize = this.fontSize;
			this.println(`Font changed to ${this.fontFamily}.\n`);
		}

		cmdFind(args) {
			if (args.length < 2) {
				this.println('FIND: Parameter format not correct\n');
				return;
			}
			const query = args[0].replace(/"/g, '').toLowerCase();
			const file = this.currentFolder.getByName(args[1].replace(/"/g, ''));
			if (file instanceof File) {
				this.println(`---------- ${file.name.toUpperCase()}`);
				const lines = (file.content || '').split('\n');
				lines.forEach(l => {
					if (l.toLowerCase().includes(query)) {
						this.println(l);
					}
				});
				this.println();
			} else {
				this.println(`File not found - ${args[1]}\n`);
			}
		}

		cmdShutdown(args) {
			openShutdownDialog();
		}

		async executeBatch(scriptContent) {
			this.isExecutingScript = true;
			this.hidePrompt();
			const lines = scriptContent.split(/\r?\n/);
			let echoOn = true;
			const labels = {};

			lines.forEach((l, idx) => {
				const trimmed = l.trim();
				if (trimmed.startsWith(':')) {
					const labelName = trimmed.slice(1).trim().toLowerCase();
					labels[labelName] = idx;
				}
			});

			let ip = 0;
			while (ip < lines.length && !this.abortScript) {
				const originalLine = lines[ip];
				let line = originalLine.trim();
				ip++;

				if (!line || line.startsWith('::') || line.toLowerCase().startsWith('rem')) {
					continue;
				}

				if (line.startsWith('@')) {
					line = line.slice(1).trim();
					if (line.toLowerCase() === 'echo off') {
						echoOn = false;
						continue;
					}
					if (line.toLowerCase() === 'echo on') {
						echoOn = true;
						continue;
					}
				}

				if (line.startsWith(':')) {
					continue;
				}

				if (echoOn) {
					this.println(`${this.getPromptString()}${line}`);
				}

				const lower = line.toLowerCase();
				if (lower.startsWith('goto ')) {
					const target = lower.slice(5).trim();
					if (labels[target] !== undefined) {
						ip = labels[target] + 1;
						await new Promise(r => setTimeout(r, 20));
						continue;
					}
				}

				if (lower === 'pause') {
					await this.cmdPause();
					continue;
				}

				if (lower === 'matrix') {
					this.startMatrixAnimation();
					break;
				}

				await this.processCommandInScript(line);
				await new Promise(r => setTimeout(r, 40));
			}

			this.isExecutingScript = false;
			if (!this.isMatrixRunning) {
				this.showPrompt();
			}
		}

		async processCommandInScript(line) {
			const tokens = this.parseCommandLine(line);
			const cmd = tokens[0].toLowerCase();
			const args = tokens.slice(1);

			if (cmd === 'echo') {
				this.cmdEcho(args, line);
			} else if (cmd === 'cls') {
				this.clearScreen();
			} else if (cmd === 'color') {
				this.cmdColor(args);
			} else if (cmd === 'title') {
				this.cmdTitle(args, line);
			} else if (cmd === 'type') {
				this.cmdType(args);
			} else if (cmd === 'dir') {
				this.cmdDir(args);
			} else if (cmd === 'cd') {
				this.cmdCd(args);
			}
		}

		startMatrixAnimation() {
			this.isMatrixRunning = true;
			this.hidePrompt();
			this.terminalEl.style.display = 'none';
			this.matrixCanvas.style.display = 'block';

			const canvas = this.matrixCanvas;
			const ctx = canvas.getContext('2d');

			const resize = () => {
				canvas.width = this.contentEl.clientWidth;
				canvas.height = this.contentEl.clientHeight;
			};
			resize();

			const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
			const fontSize = 14;
			let columns = Math.floor(canvas.width / fontSize);
			let drops = Array(columns).fill(1);

			this.matrixInterval = setInterval(() => {
				if (!this.isMatrixRunning) return;
				ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				ctx.fillStyle = '#00ff41';
				ctx.font = `${fontSize}px monospace`;

				for (let i = 0; i < drops.length; i++) {
					const text = chars.charAt(Math.floor(Math.random() * chars.length));
					ctx.fillText(text, i * fontSize, drops[i] * fontSize);

					if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
						drops[i] = 0;
					}
					drops[i]++;
				}
			}, 33);
		}

		stopMatrixAnimation() {
			this.isMatrixRunning = false;
			if (this.matrixInterval) {
				clearInterval(this.matrixInterval);
				this.matrixInterval = null;
			}
			this.matrixCanvas.style.display = 'none';
			this.terminalEl.style.display = 'block';
			this.println('\n[Matrix simulation exited]\n');
			this.showPrompt();
		}
	}

	const CommandPrompt = {
		seedMatrixEasterEgg() {
			try {
				let items = JSON.parse(localStorage.getItem('recycleBinItems') || '[]');
				const exists = items.some(i => i.data && i.data.name === 'matrix.bat');
				if (!exists) {
					items.push({
						uid: 'rb-matrix-bat-easteregg',
						originalPath: '/',
						deletedAt: '2001-10-25T12:00:00.000Z',
						data: {
							name: 'matrix.bat',
							createdAt: '2001-10-25T12:00:00.000Z',
							modifiedAt: '2001-10-25T12:00:00.000Z',
							type: 'File',
							hidden: false,
							content: '@echo off\r\ntitle The Matrix Digital Rain\r\ncolor 0a\r\ncls\r\necho ====================================================\r\necho  INITIALIZING NEURAL INTERFACE... MATRIX PROTOCOL\r\necho ====================================================\r\necho Wake up, Neo...\r\necho The Matrix has you...\r\necho Follow the white rabbit.\r\necho Knock, knock, Neo.\r\necho.\r\npause\r\nmatrix\r\n',
							size: 320,
							icon: '../assets/images/desk/icons/Command Prompt.webp',
							readOnly: false,
							remoteUrl: null
						}
					});
					localStorage.setItem('recycleBinItems', JSON.stringify(items));
				}
			} catch (e) {}
		},

		open(options = {}) {
			const id = options.id || `window-cmd-${Date.now()}`;
			const title = options.title || 'Command Prompt';
			const win = createXPWindow(id, title, '', 680, 420, {
				iconSrc: '../assets/images/desk/icons/Command Prompt.webp'
			});

			win.classList.add('xp-cmd-window');
			const terminal = new TerminalInstance(win, options);
			win.terminalInstance = terminal;
			return win;
		}
	};

	document.addEventListener('DOMContentLoaded', () => {
		CommandPrompt.seedMatrixEasterEgg();
	});

	window.CommandPrompt = CommandPrompt;
	window.processRunCommand = (cmd) => {
		const lower = cmd.trim().toLowerCase();
		if (lower === 'cmd' || lower === 'command') {
			CommandPrompt.open();
		} else if (lower === 'matrix') {
			CommandPrompt.open({ script: '@echo off\nmatrix' });
		} else if (lower === 'shutdown') {
			openShutdownDialog();
		} else if (lower === 'explorer') {
			FileExplorer.open(fs.root);
		} else if (lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('www.')) {
			openInternetExplorer();
		} else {
			CommandPrompt.open({ script: `@echo off\n${cmd}` });
		}
	};
})();
