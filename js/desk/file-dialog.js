(function () {
	const FileDialog = {
		open(options = {}) {
			const mode = options.mode || 'save';
			const title = options.title || (mode === 'save' ? 'Save As' : 'Open');
			const defaultFolder = options.defaultFolder instanceof Folder 
				? options.defaultFolder 
				: (typeof options.defaultFolder === 'string' && fs ? (fs.findByPath(options.defaultFolder) || fs.root) : fs.root);
			let currentFolder = defaultFolder;
			const defaultName = options.defaultName || (mode === 'save' ? 'untitled.png' : '');
			const filterTypes = options.filterTypes || [
				{ label: 'PNG (*.png)', ext: '.png', mime: 'image/png' },
				{ label: 'JPEG (*.jpg;*.jpeg)', ext: '.jpg', mime: 'image/jpeg' },
				{ label: 'Bitmap (*.bmp)', ext: '.bmp', mime: 'image/bmp' },
				{ label: 'All Files (*.*)', ext: '.*', mime: '*/*' }
			];

			const dialogId = `file-dialog-${Date.now()}`;
			let selectedItemPath = null;
			let selectedItemName = defaultName;

			const filterOptionsHtml = filterTypes.map((f, idx) => `<option value="${idx}">${f.label}</option>`).join('');

			const contentHTML = `
				<div class="xp-file-dialog">
					<div class="xp-fd-header">
						<div class="xp-fd-lookin-row">
							<label for="xp-fd-folder-select">${mode === 'save' ? 'Save in:' : 'Look in:'}</label>
							<div class="xp-fd-lookin-combo">
								<img src="../assets/images/desk/icons/Folder Closed.webp" class="xp-fd-lookin-icon" id="xp-fd-curr-folder-icon" alt="">
								<select id="xp-fd-folder-select" class="xp-select xp-fd-folder-dropdown"></select>
							</div>
							<div class="xp-fd-header-tools">
								<button type="button" class="xp-button-small xp-fd-btn-tool" id="xp-fd-btn-up" title="Up One Level">
									<div class="xp-tb-icon-up" style="width:14px;height:14px;"></div>
								</button>
								<button type="button" class="xp-button-small xp-fd-btn-tool" id="xp-fd-btn-newfolder" title="Create New Folder">
									<img src="../assets/images/desk/icons/Folder Closed.webp" style="width:14px;height:14px;" alt="">
								</button>
								<button type="button" class="xp-button-small xp-fd-btn-tool" id="xp-fd-btn-views" title="Views">
									<img src="https://api.iconify.design/mdi/view-grid-outline.svg?color=%23000000" style="width:14px;height:14px;" alt="">
								</button>
							</div>
						</div>
					</div>

					<div class="xp-fd-body">
						<div class="xp-fd-places-bar">
							<div class="xp-fd-place-item" data-place="recent">
								<img src="../assets/images/desk/icons/List File.webp" alt="">
								<span>My Recent Documents</span>
							</div>
							<div class="xp-fd-place-item active" data-place="desktop">
								<img src="../assets/images/desk/icons/Display.webp" alt="">
								<span>Desktop</span>
							</div>
							<div class="xp-fd-place-item" data-place="documents">
								<img src="../assets/images/desk/icons/My Profile Folder.webp" alt="">
								<span>My Documents</span>
							</div>
							<div class="xp-fd-place-item" data-place="computer">
								<img src="../assets/images/desk/icons/My Computer.webp" alt="">
								<span>My Computer</span>
							</div>
							<div class="xp-fd-place-item" data-place="network">
								<img src="../assets/images/desk/icons/My Network Places.webp" alt="">
								<span>My Network</span>
							</div>
						</div>

						<div class="xp-fd-browser-pane">
							<div class="xp-fd-files-container" id="xp-fd-files-list"></div>
						</div>
					</div>

					<div class="xp-fd-footer">
						<div class="xp-fd-fields">
							<div class="xp-fd-form-row">
								<label for="xp-fd-input-filename">File name:</label>
								<input type="text" id="xp-fd-input-filename" class="xp-input" value="${defaultName}">
							</div>
							<div class="xp-fd-form-row">
								<label for="xp-fd-select-filter">${mode === 'save' ? 'Save as type:' : 'Files of type:'}</label>
								<select id="xp-fd-select-filter" class="xp-select">
									${filterOptionsHtml}
								</select>
							</div>
						</div>
						<div class="xp-fd-actions">
							<button type="button" class="xp-button xp-fd-btn-action" id="xp-fd-btn-confirm">${mode === 'save' ? 'Save' : 'Open'}</button>
							<button type="button" class="xp-button xp-fd-btn-action" id="xp-fd-btn-cancel">Cancel</button>
						</div>
					</div>
				</div>
			`;

			const dialogWin = createXPWindow(dialogId, title, contentHTML, 560, 390, {
				iconSrc: '../assets/images/desk/icons/Folder Closed.webp',
				resizable: false,
				isModal: true
			});

			dialogWin.querySelector('.xp-window-content').style.padding = '0';
			dialogWin.querySelector('.xp-window-content').style.overflow = 'hidden';

			const folderSelectEl = dialogWin.querySelector('#xp-fd-folder-select');
			const folderIconEl = dialogWin.querySelector('#xp-fd-curr-folder-icon');
			const filesListEl = dialogWin.querySelector('#xp-fd-files-list');
			const filenameInput = dialogWin.querySelector('#xp-fd-input-filename');
			const filterSelectEl = dialogWin.querySelector('#xp-fd-select-filter');
			const btnConfirm = dialogWin.querySelector('#xp-fd-btn-confirm');
			const btnCancel = dialogWin.querySelector('#xp-fd-btn-cancel');
			const btnUp = dialogWin.querySelector('#xp-fd-btn-up');
			const btnNewFolder = dialogWin.querySelector('#xp-fd-btn-newfolder');

			let viewDisplayMode = 'list';

			function buildFolderDropdown() {
				folderSelectEl.innerHTML = '';
				const foldersList = [];

				function traverse(f, depth = 0) {
					foldersList.push({ folder: f, depth });
					f.listContent().forEach(child => {
						if (child instanceof Folder) {
							traverse(child, depth + 1);
						}
					});
				}

				if (fs && fs.root) {
					traverse(fs.root, 0);
				}

				foldersList.forEach(item => {
					const opt = document.createElement('option');
					opt.value = item.folder.getFullPath();
					opt.textContent = `${'\u00A0\u00A0'.repeat(item.depth)}${item.folder.name}`;
					if (item.folder === currentFolder) opt.selected = true;
					folderSelectEl.appendChild(opt);
				});

				if (folderIconEl) {
					folderIconEl.src = currentFolder.icon || '../assets/images/desk/icons/Folder Closed.webp';
				}
			}

			function renderFileList() {
				filesListEl.innerHTML = '';
				filesListEl.className = `xp-fd-files-container view-${viewDisplayMode}`;

				const activeFilterIdx = parseInt(filterSelectEl.value, 10) || 0;
				const activeFilter = filterTypes[activeFilterIdx] || filterTypes[0];

				const items = currentFolder.listContent();

				items.forEach(item => {
					const isDir = item instanceof Folder;
					if (!isDir && activeFilter.ext !== '.*') {
						const lower = item.name.toLowerCase();
						const exts = activeFilter.ext.split(';');
						const matched = exts.some(e => {
							const clean = e.trim().replace('*', '').toLowerCase();
							return lower.endsWith(clean);
						});
						if (!matched) return;
					}

					const row = document.createElement('div');
					row.className = 'xp-fd-item';
					row.dataset.path = item.getFullPath();
					row.dataset.name = item.name;
					row.dataset.isDir = isDir ? 'true' : 'false';

					const iconImg = document.createElement('img');
					iconImg.src = item.icon || (isDir ? '../assets/images/desk/icons/Folder Closed.webp' : '../assets/images/desk/icons/File.webp');
					iconImg.alt = '';

					const labelSpan = document.createElement('span');
					labelSpan.textContent = item.name;

					row.appendChild(iconImg);
					row.appendChild(labelSpan);

					row.addEventListener('click', () => {
						filesListEl.querySelectorAll('.xp-fd-item').forEach(el => el.classList.remove('selected'));
						row.classList.add('selected');
						selectedItemPath = item.getFullPath();
						if (!isDir) {
							selectedItemName = item.name;
							filenameInput.value = item.name;
						}
					});

					row.addEventListener('dblclick', () => {
						if (isDir) {
							currentFolder = item;
							buildFolderDropdown();
							renderFileList();
						} else {
							filenameInput.value = item.name;
							handleConfirm();
						}
					});

					filesListEl.appendChild(row);
				});
			}

			function handleConfirm() {
				let rawName = filenameInput.value.trim();
				if (!rawName) {
					showXPDialog(title, 'Please enter a valid file name.', 'error');
					return;
				}

				const activeFilterIdx = parseInt(filterSelectEl.value, 10) || 0;
				const activeFilter = filterTypes[activeFilterIdx] || filterTypes[0];

				if (mode === 'save') {
					if (!rawName.includes('.') && activeFilter.ext !== '.*') {
						const primaryExt = activeFilter.ext.split(';')[0].replace('*', '');
						rawName = `${rawName}${primaryExt}`;
					}

					const existingChild = currentFolder.getByName(rawName);
					if (existingChild) {
						showXPDialog(
							'Save As',
							`${rawName} already exists.\nDo you want to replace it?`,
							'warning',
							{
								buttons: ['Yes', 'No'],
								callback: (result) => {
									if (result === 'Yes') {
										closeWindow(dialogWin, dialogId);
										if (options.onConfirm) {
											options.onConfirm(currentFolder, rawName, existingChild, activeFilter);
										}
									}
								}
							}
						);
						return;
					}

					closeWindow(dialogWin, dialogId);
					if (options.onConfirm) {
						options.onConfirm(currentFolder, rawName, null, activeFilter);
					}
				} else {
					const existingChild = currentFolder.getByName(rawName);
					if (!existingChild) {
						showXPDialog('Open', `File '${rawName}' not found.\nPlease verify the correct file name was given.`, 'error');
						return;
					}
					closeWindow(dialogWin, dialogId);
					if (options.onConfirm) {
						options.onConfirm(currentFolder, rawName, existingChild, activeFilter);
					}
				}
			}

			folderSelectEl.addEventListener('change', () => {
				const target = fs.findByPath(folderSelectEl.value);
				if (target instanceof Folder) {
					currentFolder = target;
					buildFolderDropdown();
					renderFileList();
				}
			});

			btnUp.addEventListener('click', () => {
				if (currentFolder.parent) {
					currentFolder = currentFolder.parent;
					buildFolderDropdown();
					renderFileList();
				}
			});

			btnNewFolder.addEventListener('click', () => {
				const name = prompt('New Folder Name:', 'New Folder');
				if (name && name.trim() && fs) {
					try {
						const created = fs.create('Folder', currentFolder.getFullPath(), name.trim());
						buildFolderDropdown();
						renderFileList();
					} catch (e) {
						showXPDialog('Error', e.message, 'error');
					}
				}
			});

			dialogWin.querySelectorAll('.xp-fd-place-item').forEach(placeBtn => {
				placeBtn.addEventListener('click', () => {
					dialogWin.querySelectorAll('.xp-fd-place-item').forEach(b => b.classList.remove('active'));
					placeBtn.classList.add('active');
					const place = placeBtn.dataset.place;
					if (place === 'desktop') {
						currentFolder = fs.root;
					} else if (place === 'documents') {
						currentFolder = fs.root.getByName('PDFs') || fs.root;
					} else if (place === 'recent') {
						currentFolder = fs.root;
					} else if (place === 'computer') {
						currentFolder = fs.root;
					} else if (place === 'network') {
						currentFolder = fs.root;
					}
					buildFolderDropdown();
					renderFileList();
				});
			});

			filterSelectEl.addEventListener('change', renderFileList);

			btnConfirm.addEventListener('click', handleConfirm);
			btnCancel.addEventListener('click', () => {
				closeWindow(dialogWin, dialogId);
				if (options.onCancel) options.onCancel();
			});

			filenameInput.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') handleConfirm();
				if (e.key === 'Escape') closeWindow(dialogWin, dialogId);
			});

			buildFolderDropdown();
			renderFileList();
			filenameInput.focus();
			filenameInput.select();
		}
	};

	window.FileDialog = FileDialog;
	window.showXPFileDialog = (opts) => FileDialog.open(opts);
})();
