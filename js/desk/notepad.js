/* Windows XP Notepad Engine */
(function () {
	const DEFAULT_FONT_SETTINGS = {
		family: "'Lucida Console', 'Courier New', monospace",
		size: 13,
		bold: false,
		italic: false
	};

	let fontSettings = { ...DEFAULT_FONT_SETTINGS };

	class NotepadSession {
		constructor(win, file = null, options = {}) {
			this.win = win;
			this.file = file;
			this.options = options;
			this.isReadOnly = !!options.readOnly || (file ? !!file.readOnly : false);
			this.isWordWrap = options.wordWrap !== undefined ? !!options.wordWrap : true;
			this.showStatusBar = options.showStatusBar !== undefined ? !!options.showStatusBar : true;
			this.initialContent = file ? (file.content || '') : (options.initialContent || '');
			this.isDirty = false;
			this.undoStack = [];
			this.redoStack = [];

			this.initDom();
			this.bindEvents();
			this.updateTitle();
			this.updateStatusBar();
		}

		initDom() {
			const contentEl = this.win.querySelector('.xp-window-content');
			contentEl.innerHTML = '';
			contentEl.style.padding = '0';
			contentEl.style.overflow = 'hidden';
			contentEl.style.display = 'flex';
			contentEl.style.flexDirection = 'column';

			this.layoutEl = document.createElement('div');
			this.layoutEl.className = 'notepad-layout';

			this.menuBarEl = document.createElement('div');
			this.menuBarEl.className = 'notepad-menubar';
			this.menuBarEl.innerHTML = `
				<ul>
					<li data-action="menu-file"><u>F</u>ile</li>
					<li data-action="menu-edit"><u>E</u>dit</li>
					<li data-action="menu-format">F<u>o</u>rmat</li>
					<li data-action="menu-view"><u>V</u>iew</li>
					<li data-action="menu-run"><u>R</u>un</li>
					<li data-action="menu-help"><u>H</u>elp</li>
				</ul>
			`;
			this.layoutEl.appendChild(this.menuBarEl);

			if (this.isReadOnly) {
				const banner = document.createElement('div');
				banner.className = 'notepad-readonly-banner';
				banner.textContent = 'This file is opened in Read-Only mode. Changes cannot be saved to disk.';
				this.layoutEl.appendChild(banner);
			}

			this.containerEl = document.createElement('div');
			this.containerEl.className = 'notepad-textarea-container';

			this.textarea = document.createElement('textarea');
			this.textarea.className = `notepad-textarea ${this.isWordWrap ? 'wrap-enabled' : ''}`;
			this.textarea.spellcheck = false;
			this.textarea.value = this.initialContent;
			if (this.isReadOnly) {
				this.textarea.readOnly = true;
			}

			this.applyFontStyles();
			this.containerEl.appendChild(this.textarea);
			this.layoutEl.appendChild(this.containerEl);

			this.statusBarEl = document.createElement('div');
			this.statusBarEl.className = 'notepad-statusbar';
			this.statusBarEl.style.display = this.showStatusBar ? 'flex' : 'none';
			this.statusBarEl.innerHTML = `
				<div class="notepad-sb-cell notepad-sb-pos">Ln 1, Col 1</div>
				<div class="notepad-sb-cell notepad-sb-info">0 characters</div>
				<div class="notepad-sb-cell notepad-sb-encoding">Windows (ANSI)</div>
			`;
			this.layoutEl.appendChild(this.statusBarEl);

			contentEl.appendChild(this.layoutEl);
		}

		applyFontStyles() {
			this.textarea.style.fontFamily = fontSettings.family;
			this.textarea.style.fontSize = `${fontSettings.size}px`;
			this.textarea.style.fontWeight = fontSettings.bold ? 'bold' : 'normal';
			this.textarea.style.fontStyle = fontSettings.italic ? 'italic' : 'normal';
		}

		bindEvents() {
			this.win.beforeClose = (forceClose) => {
				if (!this.isDirty) return true;
				const currentName = this.file ? this.file.name : (this.options.title || 'Untitled');
				showXPDialog('Notepad', `Do you want to save changes to ${currentName}?`, 'question', {
					buttons: ['Yes', 'No', 'Cancel'],
					callback: (res) => {
						if (res === 'Yes') {
							if (this.save()) forceClose();
						} else if (res === 'No') {
							forceClose();
						}
					}
				});
				return false;
			};

			this.textarea.addEventListener('input', () => {
				if (!this.isDirty) {
					this.isDirty = true;
					this.updateTitle();
				}
				this.updateStatusBar();
			});

			const updateCursorPos = () => this.updateStatusBar();
			this.textarea.addEventListener('keyup', updateCursorPos);
			this.textarea.addEventListener('click', updateCursorPos);
			this.textarea.addEventListener('select', updateCursorPos);

			this.textarea.addEventListener('keydown', (e) => {
				if (e.key === 'Tab') {
					e.preventDefault();
					const start = this.textarea.selectionStart;
					const end = this.textarea.selectionEnd;
					this.textarea.value = this.textarea.value.substring(0, start) + '\t' + this.textarea.value.substring(end);
					this.textarea.selectionStart = this.textarea.selectionEnd = start + 1;
					this.textarea.dispatchEvent(new Event('input'));
				} else if (e.key === 'F5') {
					e.preventDefault();
					this.insertDateTime();
				} else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
					e.preventDefault();
					this.save();
				} else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
					e.preventDefault();
					NotepadApp.openNew();
				} else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
					e.preventDefault();
					this.showOpenPrompt();
				} else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
					e.preventDefault();
					this.showFindDialog();
				} else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
					e.preventDefault();
					this.showReplaceDialog();
				} else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
					e.preventDefault();
					this.showGoToDialog();
				} else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r') {
					e.preventDefault();
					this.runInCommandPrompt();
				}
			});

			this.menuBarEl.querySelectorAll('li[data-action]').forEach(item => {
				item.addEventListener('click', (e) => {
					e.stopPropagation();
					const action = item.dataset.action;
					const rect = item.getBoundingClientRect();
					this.openMenuDropdown(action, rect.left, rect.bottom);
				});
			});

			this.textarea.addEventListener('contextmenu', (e) => {
				e.preventDefault();
				if (window.ContextMenu) {
					const items = window.ContextMenu.getEditorItems(this.textarea, this.isReadOnly);
					window.ContextMenu.show(items, e.clientX, e.clientY);
				}
			});

			setTimeout(() => this.textarea.focus(), 50);
		}

		updateTitle() {
			const name = this.file ? this.file.name : (this.options.title || 'Untitled');
			const titleText = `${name}${this.isDirty ? ' *' : ''} - Notepad`;
			const titleEl = this.win.querySelector('.xp-window-header .title');
			if (titleEl) titleEl.textContent = titleText;
			if (window.Taskbar) {
				window.Taskbar.updateWindowButton(this.win.id, titleText, '../assets/images/desk/icons/Notepad.webp');
			}
		}

		updateStatusBar() {
			if (!this.showStatusBar) return;
			const val = this.textarea.value;
			const pos = this.textarea.selectionStart || 0;
			const textBefore = val.substring(0, pos);
			const lines = textBefore.split('\n');
			const lineNum = lines.length;
			const colNum = lines[lines.length - 1].length + 1;

			const posCell = this.statusBarEl.querySelector('.notepad-sb-pos');
			const infoCell = this.statusBarEl.querySelector('.notepad-sb-info');

			if (posCell) posCell.textContent = `Ln ${lineNum}, Col ${colNum}`;
			if (infoCell) infoCell.textContent = `${val.length} character(s) - ${lines.length} line(s)`;
		}

		insertDateTime() {
			const now = new Date();
			const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
			const dateString = now.toLocaleDateString();
			const stamp = `${timeString} ${dateString}`;

			const start = this.textarea.selectionStart;
			const end = this.textarea.selectionEnd;
			const val = this.textarea.value;
			this.textarea.value = val.substring(0, start) + stamp + val.substring(end);
			this.textarea.selectionStart = this.textarea.selectionEnd = start + stamp.length;
			this.textarea.dispatchEvent(new Event('input'));
		}

		save() {
			if (this.isReadOnly) {
				showXPDialog('Notepad', 'This document is read-only and cannot be modified.', 'warning');
				return false;
			}

			if (!this.file) {
				return this.saveAs();
			}

			try {
				this.file.write(this.textarea.value);
				fs.save();
				this.isDirty = false;
				this.updateTitle();
				if (window.SettingsApp && window.SettingsApp.playSound) {
					window.SettingsApp.playSound('click');
				}
				if (typeof refreshUI === 'function') refreshUI();
				return true;
			} catch (e) {
				showXPDialog('Notepad', `Unable to save file: ${e.message}`, 'error');
				return false;
			}
		}

		saveAs() {
			if (window.FileDialog) {
				const currentName = this.file ? this.file.name : (this.options.title || 'Untitled.txt');
				window.FileDialog.open({
					mode: 'save',
					title: 'Save As',
					defaultFolder: this.file ? (this.file.parent || fs.root) : fs.root,
					defaultName: currentName,
					filterTypes: [
						{ label: 'Text Documents (*.txt)', ext: '.txt', mime: 'text/plain' },
						{ label: 'Batch Scripts (*.bat;*.cmd)', ext: '.bat;.cmd', mime: 'text/plain' },
						{ label: 'All Files (*.*)', ext: '.*', mime: '*/*' }
					],
					onConfirm: (folder, fileName, existingFile, filter) => {
						try {
							let targetFile = existingFile;
							if (!targetFile) {
								targetFile = fs.create('File', folder.getFullPath(), fileName);
							}
							targetFile.write(this.textarea.value);
							if (fileName.toLowerCase().endsWith('.bat') || fileName.toLowerCase().endsWith('.cmd')) {
								targetFile.icon = '../assets/images/desk/icons/Command Prompt.webp';
							} else {
								targetFile.icon = '../assets/images/desk/icons/File.webp';
							}
							fs.save();

							this.file = targetFile;
							this.isDirty = false;
							this.updateTitle();
							if (typeof refreshUI === 'function') refreshUI();
							if (window.DeskAPI) {
								window.DeskAPI.addToRecentDocs({
									name: targetFile.name,
									icon: targetFile.icon,
									type: 'file',
									path: targetFile.getFullPath()
								});
							}
						} catch (e) {
							showXPDialog('Save As', `Could not save file: ${e.message}`, 'error');
						}
					}
				});
			}
		}

		showOpenPrompt() {
			const proceedOpen = () => {
				if (window.FileDialog) {
					window.FileDialog.open({
						mode: 'open',
						title: 'Open',
						defaultFolder: this.file ? (this.file.parent || fs.root) : fs.root,
						filterTypes: [
							{ label: 'Text Documents (*.txt)', ext: '.txt', mime: 'text/plain' },
							{ label: 'Batch Scripts (*.bat;*.cmd)', ext: '.bat;.cmd', mime: 'text/plain' },
							{ label: 'All Files (*.*)', ext: '.*', mime: '*/*' }
						],
						onConfirm: (folder, fileName, fileObj) => {
							if (fileObj && fileObj instanceof File) {
								NotepadApp.open(fileObj);
							}
						}
					});
				}
			};

			if (this.isDirty) {
				const currentName = this.file ? this.file.name : (this.options.title || 'Untitled');
				showXPDialog('Notepad', `Do you want to save changes to ${currentName}?`, 'question', {
					buttons: ['Yes', 'No', 'Cancel'],
					callback: (res) => {
						if (res === 'Yes') {
							if (this.save()) proceedOpen();
						} else if (res === 'No') {
							proceedOpen();
						}
					}
				});
			} else {
				proceedOpen();
			}
		}

		showFindDialog() {
			const dialogId = `dialog-notepad-find-${Date.now()}`;
			const content = `
				<div style="padding: 12px; display: flex; flex-direction: column; gap: 10px;">
					<div class="xp-form-row">
						<label style="width: 70px;">Find what:</label>
						<input type="text" id="np-find-text" class="xp-input" style="flex: 1;">
					</div>
					<div style="display: flex; justify-content: space-between; align-items: center;">
						<label class="xp-checkbox-row" style="margin: 0;">
							<input type="checkbox" id="np-find-matchcase"> Match case
						</label>
						<div style="display: flex; gap: 8px;">
							<label class="xp-checkbox-row"><input type="radio" name="np-find-dir" value="up"> Up</label>
							<label class="xp-checkbox-row"><input type="radio" name="np-find-dir" value="down" checked> Down</label>
						</div>
					</div>
					<div class="xp-dialog-action-footer">
						<button type="button" class="xp-button" id="np-find-next">Find Next</button>
						<button type="button" class="xp-button" id="np-find-cancel">Cancel</button>
					</div>
				</div>
			`;

			const dlg = createXPWindow(dialogId, 'Find', content, 380, 160, {
				resizable: false,
				isModal: true,
				iconSrc: '../assets/images/desk/icons/Notepad.webp'
			});
			dlg.querySelector('.xp-window-content').style.padding = '0';

			const input = dlg.querySelector('#np-find-text');
			input.focus();

			dlg.querySelector('#np-find-next').addEventListener('click', () => {
				const query = input.value;
				if (!query) return;
				const matchCase = dlg.querySelector('#np-find-matchcase').checked;
				const val = this.textarea.value;
				const curPos = this.textarea.selectionStart || 0;

				let source = matchCase ? val : val.toLowerCase();
				let search = matchCase ? query : query.toLowerCase();

				let idx = source.indexOf(search, curPos + 1);
				if (idx === -1) {
					idx = source.indexOf(search, 0);
				}

				if (idx !== -1) {
					this.textarea.focus();
					this.textarea.setSelectionRange(idx, idx + query.length);
					this.updateStatusBar();
				} else {
					showXPDialog('Notepad', `Cannot find "${query}"`, 'info');
				}
			});

			dlg.querySelector('#np-find-cancel').addEventListener('click', () => {
				closeWindow(dlg, dialogId);
			});
		}

		showReplaceDialog() {
			const dialogId = `dialog-notepad-replace-${Date.now()}`;
			const content = `
				<div style="padding: 12px; display: flex; flex-direction: column; gap: 8px;">
					<div class="xp-form-row">
						<label style="width: 90px;">Find what:</label>
						<input type="text" id="np-rep-find" class="xp-input" style="flex: 1;">
					</div>
					<div class="xp-form-row">
						<label style="width: 90px;">Replace with:</label>
						<input type="text" id="np-rep-with" class="xp-input" style="flex: 1;">
					</div>
					<div class="xp-checkbox-row" style="margin-top: 4px;">
						<input type="checkbox" id="np-rep-case">
						<label for="np-rep-case">Match case</label>
					</div>
					<div class="xp-dialog-action-footer">
						<button type="button" class="xp-button" id="np-rep-btn-next">Find Next</button>
						<button type="button" class="xp-button" id="np-rep-btn-one">Replace</button>
						<button type="button" class="xp-button" id="np-rep-btn-all">Replace All</button>
						<button type="button" class="xp-button" id="np-rep-btn-cancel">Cancel</button>
					</div>
				</div>
			`;

			const dlg = createXPWindow(dialogId, 'Replace', content, 420, 200, {
				resizable: false,
				isModal: true,
				iconSrc: '../assets/images/desk/icons/Notepad.webp'
			});
			dlg.querySelector('.xp-window-content').style.padding = '0';

			const findInput = dlg.querySelector('#np-rep-find');
			const repInput = dlg.querySelector('#np-rep-with');
			findInput.focus();

			dlg.querySelector('#np-rep-btn-all').addEventListener('click', () => {
				const query = findInput.value;
				if (!query) return;
				const repWith = repInput.value;
				const matchCase = dlg.querySelector('#np-rep-case').checked;

				if (matchCase) {
					this.textarea.value = this.textarea.value.split(query).join(repWith);
				} else {
					const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
					this.textarea.value = this.textarea.value.replace(regex, repWith);
				}
				this.textarea.dispatchEvent(new Event('input'));
				closeWindow(dlg, dialogId);
			});

			dlg.querySelector('#np-rep-btn-cancel').addEventListener('click', () => {
				closeWindow(dlg, dialogId);
			});
		}

		showGoToDialog() {
			const dialogId = `dialog-notepad-goto-${Date.now()}`;
			const lines = this.textarea.value.split('\n');

			const content = `
				<div style="padding: 12px; display: flex; flex-direction: column; gap: 8px;">
					<div class="xp-form-row">
						<label style="width: 90px;">Line number:</label>
						<input type="number" id="np-goto-line" class="xp-input" min="1" max="${lines.length}" value="1" style="flex: 1;">
					</div>
					<div class="xp-dialog-action-footer">
						<button type="button" class="xp-button" id="np-goto-ok">Go To</button>
						<button type="button" class="xp-button" id="np-goto-cancel">Cancel</button>
					</div>
				</div>
			`;

			const dlg = createXPWindow(dialogId, 'Go To Line', content, 300, 130, {
				resizable: false,
				isModal: true,
				iconSrc: '../assets/images/desk/icons/Notepad.webp'
			});
			dlg.querySelector('.xp-window-content').style.padding = '0';

			const lineInput = dlg.querySelector('#np-goto-line');
			lineInput.focus();
			lineInput.select();

			const doGoTo = () => {
				const target = parseInt(lineInput.value, 10);
				if (target >= 1 && target <= lines.length) {
					let pos = 0;
					for (let i = 0; i < target - 1; i++) {
						pos += lines[i].length + 1;
					}
					this.textarea.focus();
					this.textarea.setSelectionRange(pos, pos);
					this.updateStatusBar();
					closeWindow(dlg, dialogId);
				}
			};

			dlg.querySelector('#np-goto-ok').addEventListener('click', doGoTo);
			dlg.querySelector('#np-goto-cancel').addEventListener('click', () => closeWindow(dlg, dialogId));
			lineInput.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') doGoTo();
			});
		}

		showFontDialog() {
			const dialogId = `dialog-notepad-font-${Date.now()}`;
			const content = `
				<div style="padding: 12px; display: flex; flex-direction: column; gap: 10px;">
					<div style="display: grid; grid-template-columns: 1fr 1fr 80px; gap: 8px;">
						<div class="xp-form-row" style="flex-direction: column; align-items: flex-start;">
							<label>Font:</label>
							<select id="np-font-fam" class="xp-select" size="5" style="width: 100%; height: 90px;">
								<option value="'Lucida Console', monospace" ${fontSettings.family.includes('Lucida') ? 'selected' : ''}>Lucida Console</option>
								<option value="Consolas, monospace" ${fontSettings.family.includes('Consolas') ? 'selected' : ''}>Consolas</option>
								<option value="'Courier New', monospace" ${fontSettings.family.includes('Courier') ? 'selected' : ''}>Courier New</option>
								<option value="Tahoma, sans-serif" ${fontSettings.family.includes('Tahoma') ? 'selected' : ''}>Tahoma</option>
								<option value="Arial, sans-serif" ${fontSettings.family.includes('Arial') ? 'selected' : ''}>Arial</option>
								<option value="'Press Start 2P', monospace" ${fontSettings.family.includes('Press Start') ? 'selected' : ''}>Press Start 2P</option>
							</select>
						</div>
						<div class="xp-form-row" style="flex-direction: column; align-items: flex-start;">
							<label>Font style:</label>
							<select id="np-font-style" class="xp-select" size="5" style="width: 100%; height: 90px;">
								<option value="regular" ${!fontSettings.bold && !fontSettings.italic ? 'selected' : ''}>Regular</option>
								<option value="italic" ${!fontSettings.bold && fontSettings.italic ? 'selected' : ''}>Italic</option>
								<option value="bold" ${fontSettings.bold && !fontSettings.italic ? 'selected' : ''}>Bold</option>
								<option value="bolditalic" ${fontSettings.bold && fontSettings.italic ? 'selected' : ''}>Bold Italic</option>
							</select>
						</div>
						<div class="xp-form-row" style="flex-direction: column; align-items: flex-start;">
							<label>Size:</label>
							<select id="np-font-size" class="xp-select" size="5" style="width: 100%; height: 90px;">
								<option value="10" ${fontSettings.size === 10 ? 'selected' : ''}>10</option>
								<option value="11" ${fontSettings.size === 11 ? 'selected' : ''}>11</option>
								<option value="12" ${fontSettings.size === 12 ? 'selected' : ''}>12</option>
								<option value="13" ${fontSettings.size === 13 ? 'selected' : ''}>13</option>
								<option value="14" ${fontSettings.size === 14 ? 'selected' : ''}>14</option>
								<option value="16" ${fontSettings.size === 16 ? 'selected' : ''}>16</option>
								<option value="18" ${fontSettings.size === 18 ? 'selected' : ''}>18</option>
								<option value="20" ${fontSettings.size === 20 ? 'selected' : ''}>20</option>
							</select>
						</div>
					</div>
					<fieldset class="xp-groupbox">
						<legend>Sample</legend>
						<div id="np-font-preview" style="height: 45px; display: flex; align-items: center; justify-content: center; background: #fff; border: 1px inset #fff;">AaBbYyZz</div>
					</fieldset>
					<div class="xp-dialog-action-footer">
						<button type="button" class="xp-button" id="np-font-ok">OK</button>
						<button type="button" class="xp-button" id="np-font-cancel">Cancel</button>
					</div>
				</div>
			`;

			const dlg = createXPWindow(dialogId, 'Font', content, 420, 270, {
				resizable: false,
				isModal: true,
				iconSrc: '../assets/images/desk/icons/Notepad.webp'
			});
			dlg.querySelector('.xp-window-content').style.padding = '0';

			const famSelect = dlg.querySelector('#np-font-fam');
			const styleSelect = dlg.querySelector('#np-font-style');
			const sizeSelect = dlg.querySelector('#np-font-size');
			const preview = dlg.querySelector('#np-font-preview');

			const updatePreview = () => {
				preview.style.fontFamily = famSelect.value;
				preview.style.fontSize = `${sizeSelect.value}px`;
				preview.style.fontWeight = styleSelect.value.includes('bold') ? 'bold' : 'normal';
				preview.style.fontStyle = styleSelect.value.includes('italic') ? 'italic' : 'normal';
			};

			famSelect.addEventListener('change', updatePreview);
			styleSelect.addEventListener('change', updatePreview);
			sizeSelect.addEventListener('change', updatePreview);
			updatePreview();

			dlg.querySelector('#np-font-ok').addEventListener('click', () => {
				fontSettings.family = famSelect.value;
				fontSettings.size = parseInt(sizeSelect.value, 10);
				fontSettings.bold = styleSelect.value.includes('bold');
				fontSettings.italic = styleSelect.value.includes('italic');
				this.applyFontStyles();
				closeWindow(dlg, dialogId);
			});

			dlg.querySelector('#np-font-cancel').addEventListener('click', () => {
				closeWindow(dlg, dialogId);
			});
		}

		runInCommandPrompt() {
			if (window.CommandPrompt) {
				const script = this.textarea.value;
				const title = this.file ? this.file.name : 'Notepad Script Runner';
				window.CommandPrompt.open({
					script: script,
					title: title,
					initialFolder: (this.file && this.file.parent) ? this.file.parent : fs.root
				});
			}
		}

		openMenuDropdown(menuType, x, y) {
			let items = [];

			if (menuType === 'menu-file') {
				items = [
					{
						label: 'New',
						shortcut: 'Ctrl+N',
						action: () => {
							if (this.isDirty) {
								const currentName = this.file ? this.file.name : (this.options.title || 'Untitled');
								showXPDialog('Notepad', `Do you want to save changes to ${currentName}?`, 'question', {
									buttons: ['Yes', 'No', 'Cancel'],
									callback: (res) => {
										if (res === 'Yes') {
											if (this.save()) NotepadApp.openNew();
										} else if (res === 'No') {
											NotepadApp.openNew();
										}
									}
								});
							} else {
								NotepadApp.openNew();
							}
						}
					},
					{
						label: 'Open...',
						shortcut: 'Ctrl+O',
						action: () => this.showOpenPrompt()
					},
					{
						label: 'Save',
						shortcut: 'Ctrl+S',
						disabled: this.isReadOnly,
						action: () => this.save()
					},
					{
						label: 'Save As...',
						disabled: this.isReadOnly,
						action: () => this.saveAs()
					},
					{ separator: true },
					{
						label: 'Page Setup...',
						action: () => showXPDialog('Page Setup', 'Margins: 0.75 in (Left/Right), 1.0 in (Top/Bottom)\nOrientation: Portrait', 'info')
					},
					{
						label: 'Print...',
						shortcut: 'Ctrl+P',
						action: () => window.print()
					},
					{ separator: true },
					{
						label: 'Exit',
						action: () => {
							if (this.isDirty) {
								showXPDialog('Notepad', `Do you want to save changes to ${this.file ? this.file.name : 'Untitled'}?`, 'question', {
									buttons: ['Yes', 'No', 'Cancel'],
									callback: (res) => {
										if (res === 'Yes') {
											if (this.save()) closeWindow(this.win, this.win.id);
										} else if (res === 'No') {
											closeWindow(this.win, this.win.id);
										}
									}
								});
							} else {
								closeWindow(this.win, this.win.id);
							}
						}
					}
				];
			} else if (menuType === 'menu-edit') {
				items = [
					{
						label: 'Undo',
						shortcut: 'Ctrl+Z',
						disabled: this.isReadOnly,
						action: () => document.execCommand('undo')
					},
					{ separator: true },
					{
						label: 'Cut',
						shortcut: 'Ctrl+X',
						disabled: this.isReadOnly,
						action: () => document.execCommand('cut')
					},
					{
						label: 'Copy',
						shortcut: 'Ctrl+C',
						action: () => document.execCommand('copy')
					},
					{
						label: 'Paste',
						shortcut: 'Ctrl+V',
						disabled: this.isReadOnly,
						action: () => document.execCommand('paste')
					},
					{
						label: 'Delete',
						shortcut: 'Del',
						disabled: this.isReadOnly,
						action: () => document.execCommand('delete')
					},
					{ separator: true },
					{
						label: 'Find...',
						shortcut: 'Ctrl+F',
						action: () => this.showFindDialog()
					},
					{
						label: 'Replace...',
						shortcut: 'Ctrl+H',
						disabled: this.isReadOnly,
						action: () => this.showReplaceDialog()
					},
					{
						label: 'Go To...',
						shortcut: 'Ctrl+G',
						action: () => this.showGoToDialog()
					},
					{ separator: true },
					{
						label: 'Select All',
						shortcut: 'Ctrl+A',
						action: () => {
							this.textarea.focus();
							this.textarea.select();
						}
					},
					{
						label: 'Time/Date',
						shortcut: 'F5',
						action: () => this.insertDateTime()
					}
				];
			} else if (menuType === 'menu-format') {
				items = [
					{
						label: 'Word Wrap',
						checked: this.isWordWrap,
						action: () => {
							this.isWordWrap = !this.isWordWrap;
							this.textarea.classList.toggle('wrap-enabled', this.isWordWrap);
						}
					},
					{
						label: 'Font...',
						action: () => this.showFontDialog()
					}
				];
			} else if (menuType === 'menu-view') {
				items = [
					{
						label: 'Status Bar',
						checked: this.showStatusBar,
						action: () => {
							this.showStatusBar = !this.showStatusBar;
							this.statusBarEl.style.display = this.showStatusBar ? 'flex' : 'none';
						}
					}
				];
			} else if (menuType === 'menu-run') {
				items = [
					{
						label: 'Run in Command Prompt',
						shortcut: 'Ctrl+R',
						bold: true,
						icon: '../assets/images/desk/icons/Command Prompt.webp',
						action: () => this.runInCommandPrompt()
					},
					{ separator: true },
					{
						label: 'Save and Run as Batch (.bat)',
						action: () => {
							this.save();
							this.runInCommandPrompt();
						}
					}
				];
			} else if (menuType === 'menu-help') {
				items = [
					{
						label: 'Help Topics',
						action: () => showXPDialog('Notepad Help', 'Windows XP Notepad\nUse this text editor to view or edit plain text files (.txt) and batch script files (.bat).', 'info')
					},
					{ separator: true },
					{
						label: 'About Notepad',
						bold: true,
						action: () => {
							showXPDialog('About Notepad', 'MacroPof Windows XP Notepad\nVersion 5.1 (Build 2600.xpsp_sp3_gdr)\nCopyright (C) 1985-2001 MacroPof Corporation.', 'info');
						}
					}
				];
			}

			if (window.ContextMenu) {
				window.ContextMenu.show(items, x, y);
			}
		}
	}

	const NotepadApp = {
		open(file = null, options = {}) {
			const id = file 
				? `window-notepad-${file.getFullPath().replace(/[^\w-]/g, '_')}`
				: `window-notepad-${Date.now()}`;

			const existing = document.getElementById(id);
			if (existing) {
				if (typeof bringWindowToFront === 'function') bringWindowToFront(existing);
				if (existing.classList.contains('minimized') && typeof unminimizeWindow === 'function') {
					unminimizeWindow(existing);
				}
				return existing;
			}

			const title = file ? file.name : (options.title || 'Untitled');
			const win = createXPWindow(id, `${title} - Notepad`, '', 640, 440, {
				iconSrc: '../assets/images/desk/icons/Notepad.webp'
			});

			win.classList.add('notepad-window');
			const session = new NotepadSession(win, file, options);
			win.notepadSession = session;

			if (file && window.DeskAPI) {
				window.DeskAPI.addToRecentDocs({
					name: file.name,
					icon: '../assets/images/desk/icons/Notepad.webp',
					type: 'file',
					path: file.getFullPath()
				});
			}

			return win;
		},

		openNew(initialContent = '', initialTitle = 'Untitled.txt') {
			return this.open(null, { initialContent, title: initialTitle });
		}
	};

	window.NotepadApp = NotepadApp;
	window.openTextEditorWindow = (file) => NotepadApp.open(file);
})();
