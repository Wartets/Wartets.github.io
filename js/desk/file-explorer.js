(function () {
	const VIEW_MODES = ['thumbnails', 'tiles', 'icons', 'list', 'details'];

	const FileExplorer = {
		open(folder, initialOptions = {}) {
			if (!folder) return null;
			let targetFolder = null;
			if (typeof folder === 'string') {
				targetFolder = fs ? fs.findByPath(folder) : null;
			} else {
				targetFolder = folder;
			}
			if (!targetFolder || !(targetFolder instanceof Folder)) return null;

			const windowId = initialOptions.newWindow 
				? `window-folder-${targetFolder.getFullPath().replace(/[^\w-]/g, '_')}-${Date.now()}`
				: `window-folder-${targetFolder.getFullPath().replace(/[^\w-]/g, '_')}`;

			const existingWin = document.getElementById(windowId);
			if (existingWin && !initialOptions.newWindow) {
				if (typeof bringWindowToFront === 'function') bringWindowToFront(existingWin);
				if (existingWin.classList.contains('minimized') && typeof unminimizeWindow === 'function') {
					unminimizeWindow(existingWin);
				}
				this.navigateTo(targetFolder, existingWin, true);
				return existingWin;
			}

			const title = targetFolder.name;
			const contentHTML = this.buildWindowTemplate(targetFolder);
			const win = createXPWindow(windowId, title, contentHTML, 780, 520, {
				iconSrc: targetFolder.icon || '../assets/images/desk/icons/Folder Closed.webp'
			});

			win.classList.add('project-window');
			win.classList.add('xp-explorer-window');
			win.querySelector('.xp-window-content').style.padding = '0';

			win.explorerState = {
				currentFolder: targetFolder,
				history: [targetFolder.getFullPath()],
				historyIndex: 0,
				viewMode: initialOptions.viewMode || 'icons',
				sidebarMode: 'tasks',
				sortBy: 'name',
				sortAsc: true,
				selectedItems: new Set()
			};

			this.bindWindowEvents(win);
			this.updateView(win, false);
			return win;
		},

		buildWindowTemplate(folder) {
			return `
				<div class="xp-explorer-layout">
					<div class="xp-explorer-menubar">
						<ul class="xp-menubar-list">
							<li class="xp-menubar-item" data-menu="file"><u>F</u>ile</li>
							<li class="xp-menubar-item" data-menu="edit"><u>E</u>dit</li>
							<li class="xp-menubar-item" data-menu="view"><u>V</u>iew</li>
							<li class="xp-menubar-item" data-menu="favorites"><u>F</u>avorites</li>
							<li class="xp-menubar-item" data-menu="tools"><u>T</u>ools</li>
							<li class="xp-menubar-item" data-menu="help"><u>H</u>elp</li>
						</ul>
						<div class="xp-menubar-brand">
							<img src="../assets/images/desk/window_logo.png" alt="XP">
						</div>
					</div>

					<div class="xp-explorer-toolbar">
						<div class="xp-tb-group xp-tb-nav">
							<button type="button" class="xp-tb-btn xp-tb-btn-labeled tb-back" title="Back" disabled>
								<div class="xp-tb-icon-back"></div>
								<span>Back</span>
								<div class="xp-tb-drop-arrow tb-back-arrow" title="History"></div>
							</button>
							<button type="button" class="xp-tb-btn tb-forward" title="Forward" disabled>
								<div class="xp-tb-icon-forward"></div>
								<div class="xp-tb-drop-arrow tb-forward-arrow" title="History"></div>
							</button>
							<button type="button" class="xp-tb-btn tb-up" title="Up One Level">
								<div class="xp-tb-icon-up"></div>
							</button>
						</div>

						<div class="xp-tb-sep"></div>

						<div class="xp-tb-group">
							<button type="button" class="xp-tb-btn xp-tb-btn-labeled tb-search" title="Search for Files or Folders">
								<img src="https://api.iconify.design/mdi/magnify.svg?color=%231b4b9b" alt="">
								<span>Search</span>
							</button>
							<button type="button" class="xp-tb-btn xp-tb-btn-labeled tb-folders" title="Show or Hide the Folders Tree">
								<img src="../assets/images/desk/icons/Folder Closed.webp" alt="">
								<span>Folders</span>
							</button>
						</div>

						<div class="xp-tb-sep"></div>

						<div class="xp-tb-group">
							<button type="button" class="xp-tb-btn tb-cut" title="Cut (Ctrl+X)">
								<img src="https://api.iconify.design/mdi/content-cut.svg?color=%231b4b9b" alt="">
							</button>
							<button type="button" class="xp-tb-btn tb-copy" title="Copy (Ctrl+C)">
								<img src="https://api.iconify.design/mdi/content-copy.svg?color=%231b4b9b" alt="">
							</button>
							<button type="button" class="xp-tb-btn tb-paste" title="Paste (Ctrl+V)">
								<img src="https://api.iconify.design/mdi/content-paste.svg?color=%231b4b9b" alt="">
							</button>
							<button type="button" class="xp-tb-btn tb-delete" title="Delete (Del)">
								<img src="https://api.iconify.design/mdi/delete-outline.svg?color=%23cc3333" alt="">
							</button>
						</div>

						<div class="xp-tb-sep"></div>

						<div class="xp-tb-group">
							<button type="button" class="xp-tb-btn xp-tb-btn-labeled tb-views" title="Change View Mode">
								<img src="https://api.iconify.design/mdi/view-grid-outline.svg?color=%231b4b9b" alt="">
								<div class="xp-tb-drop-arrow"></div>
							</button>
						</div>
					</div>

					<div class="xp-explorer-addressbar-row">
						<span class="xp-address-label">Address</span>
						<div class="xp-address-combo">
							<img src="../assets/images/desk/icons/Folder Closed.webp" class="xp-address-icon" alt="">
							<input type="text" class="xp-address-input" value="${folder.getFullPath()}">
							<div class="xp-address-dropdown-arrow" title="Address Bar Locations">▼</div>
						</div>
						<button type="button" class="xp-address-go-btn" title="Go to Address">
							<div class="xp-go-icon">➔</div>
							<span>Go</span>
						</button>
					</div>

					<div class="xp-explorer-body">
						<div class="xp-explorer-sidebar">
							<div class="xp-sidebar-tasks-view">
								<div class="xp-task-box xp-tasks-file">
									<div class="xp-task-header">
										<span>File and Folder Tasks</span>
										<button type="button" class="xp-task-chevron"></button>
									</div>
									<div class="xp-task-content" id="xp-task-content-actions"></div>
								</div>

								<div class="xp-task-box xp-tasks-places">
									<div class="xp-task-header">
										<span>Other Places</span>
										<button type="button" class="xp-task-chevron"></button>
									</div>
									<div class="xp-task-content">
										<a href="#" class="xp-task-link" data-place="desktop"><img src="../assets/images/desk/icons/Display.webp" alt=""><span>Desktop</span></a>
										<a href="#" class="xp-task-link" data-place="my-documents"><img src="../assets/images/desk/icons/My Profile Folder.webp" alt=""><span>My Documents</span></a>
										<a href="#" class="xp-task-link" data-place="my-computer"><img src="../assets/images/desk/icons/My Computer.webp" alt=""><span>My Computer</span></a>
										<a href="#" class="xp-task-link" data-place="my-network"><img src="../assets/images/desk/icons/My Network Places.webp" alt=""><span>My Network Places</span></a>
										<a href="#" class="xp-task-link" data-place="recycle-bin"><img src="../assets/images/desk/trash.png" alt=""><span>Recycle Bin</span></a>
									</div>
								</div>

								<div class="xp-task-box xp-tasks-details">
									<div class="xp-task-header">
										<span>Details</span>
										<button type="button" class="xp-task-chevron"></button>
									</div>
									<div class="xp-task-content xp-task-details-body"></div>
								</div>
							</div>

							<div class="xp-sidebar-tree-view" style="display: none;">
								<div class="xp-tree-header">
									<span>Folders</span>
									<button type="button" class="xp-tree-close">×</button>
								</div>
								<div class="xp-tree-content"></div>
							</div>
						</div>

						<div class="xp-explorer-splitter"></div>

						<div class="xp-explorer-main">
							<div class="xp-explorer-view-container">
								<div class="folder-content xp-file-grid" data-path="${folder.getFullPath()}"></div>
							</div>
						</div>
					</div>

					<div class="xp-explorer-statusbar">
						<div class="xp-sb-pane xp-sb-count">0 objects</div>
						<div class="xp-sb-pane xp-sb-size">0 KB</div>
						<div class="xp-sb-pane xp-sb-zone">
							<img src="../assets/images/desk/icons/My Computer.webp" alt="">
							<span>My Computer</span>
						</div>
					</div>
				</div>
			`;
		},

		bindWindowEvents(win) {
			const state = win.explorerState;
			const backBtn = win.querySelector('.tb-back');
			const forwardBtn = win.querySelector('.tb-forward');
			const upBtn = win.querySelector('.tb-up');
			const searchBtn = win.querySelector('.tb-search');
			const foldersBtn = win.querySelector('.tb-folders');
			const viewsBtn = win.querySelector('.tb-views');
			const addressInput = win.querySelector('.xp-address-input');
			const addressGoBtn = win.querySelector('.xp-address-go-btn');
			const addressArrow = win.querySelector('.xp-address-dropdown-arrow');
			const contentContainer = win.querySelector('.folder-content');
			const viewContainer = win.querySelector('.xp-explorer-view-container');
			const sidebar = win.querySelector('.xp-explorer-sidebar');
			const splitter = win.querySelector('.xp-explorer-splitter');
			const treeView = win.querySelector('.xp-sidebar-tree-view');
			const tasksView = win.querySelector('.xp-sidebar-tasks-view');

			backBtn.addEventListener('click', (e) => {
				if (e.target.closest('.tb-back-arrow')) {
					e.stopPropagation();
					this.showHistoryDropdown(win, backBtn, true);
					return;
				}
				if (state.historyIndex > 0) {
					state.historyIndex--;
					const targetPath = state.history[state.historyIndex];
					const folder = fs.findByPath(targetPath);
					if (folder) this.navigateTo(folder, win, false);
				}
			});

			forwardBtn.addEventListener('click', (e) => {
				if (e.target.closest('.tb-forward-arrow')) {
					e.stopPropagation();
					this.showHistoryDropdown(win, forwardBtn, false);
					return;
				}
				if (state.historyIndex < state.history.length - 1) {
					state.historyIndex++;
					const targetPath = state.history[state.historyIndex];
					const folder = fs.findByPath(targetPath);
					if (folder) this.navigateTo(folder, win, false);
				}
			});

			upBtn.addEventListener('click', () => {
				if (state.currentFolder && state.currentFolder.parent) {
					this.navigateTo(state.currentFolder.parent, win, true);
				}
			});

			searchBtn.addEventListener('click', () => {
				if (window.DeskAPI && window.DeskAPI.openSearch) {
					window.DeskAPI.openSearch('');
				}
			});

			foldersBtn.addEventListener('click', () => {
				if (state.sidebarMode === 'tree') {
					state.sidebarMode = 'tasks';
					treeView.style.display = 'none';
					tasksView.style.display = 'flex';
					foldersBtn.classList.remove('active');
				} else {
					state.sidebarMode = 'tree';
					tasksView.style.display = 'none';
					treeView.style.display = 'flex';
					foldersBtn.classList.add('active');
					this.renderFolderTree(win);
				}
			});

			const treeCloseBtn = win.querySelector('.xp-tree-close');
			if (treeCloseBtn) {
				treeCloseBtn.addEventListener('click', () => {
					state.sidebarMode = 'tasks';
					treeView.style.display = 'none';
					tasksView.style.display = 'flex';
					foldersBtn.classList.remove('active');
				});
			}

			viewsBtn.addEventListener('click', (e) => {
				e.stopPropagation();
				const rect = viewsBtn.getBoundingClientRect();
				const menuItems = VIEW_MODES.map(mode => ({
					label: mode.charAt(0).toUpperCase() + mode.slice(1),
					radio: state.viewMode === mode,
					action: () => {
						state.viewMode = mode;
						this.updateView(win, false);
					}
				}));
				if (window.ContextMenu) {
					window.ContextMenu.show(menuItems, rect.left, rect.bottom + 2);
				}
			});

			if (addressArrow) {
				addressArrow.addEventListener('click', (e) => {
					e.stopPropagation();
					const rect = addressInput.getBoundingClientRect();
					const locations = [
						{
							label: 'Desktop',
							icon: '../assets/images/desk/icons/Display.webp',
							action: () => this.navigateTo(fs.root, win, true)
						},
						{
							label: 'My Documents',
							icon: '../assets/images/desk/icons/My Profile Folder.webp',
							action: () => {
								const pdfs = fs.root.getByName('PDFs') || fs.root;
								this.navigateTo(pdfs, win, true);
							}
						},
						{
							label: 'My Computer',
							icon: '../assets/images/desk/icons/My Computer.webp',
							action: () => {
								if (window.DeskAPI && window.DeskAPI.openMyComputer) window.DeskAPI.openMyComputer();
							}
						},
						{
							label: 'Local Disk (C:)',
							icon: 'https://api.iconify.design/mdi/harddisk.svg?color=%231b4b9b',
							action: () => this.navigateTo(fs.root, win, true)
						},
						{
							label: 'My Network Places',
							icon: '../assets/images/desk/icons/My Network Places.webp',
							action: () => {
								if (window.DeskAPI && window.DeskAPI.openNetworkPlaces) window.DeskAPI.openNetworkPlaces();
							}
						},
						{
							label: 'Recycle Bin',
							icon: '../assets/images/desk/trash.png',
							action: () => {
								if (typeof openRecycleBinWindow === 'function') openRecycleBinWindow();
							}
						}
					];
					if (window.ContextMenu) {
						window.ContextMenu.show(locations, rect.left, rect.bottom + 2);
					}
				});
			}

			const cutBtn = win.querySelector('.tb-cut');
			const copyBtn = win.querySelector('.tb-copy');
			const pasteBtn = win.querySelector('.tb-paste');
			const deleteBtn = win.querySelector('.tb-delete');

			cutBtn.addEventListener('click', () => {
				const selected = Array.from(state.selectedItems);
				if (selected.length > 0) {
					const el = fs.findByPath(selected[0].dataset.path);
					if (el) {
						fs.clipboard.mode = 'cut';
						fs.clipboard.element = el;
					}
				}
			});

			copyBtn.addEventListener('click', () => {
				const selected = Array.from(state.selectedItems);
				if (selected.length > 0) {
					const el = fs.findByPath(selected[0].dataset.path);
					if (el) {
						fs.clipboard.mode = 'copy';
						fs.clipboard.element = el;
					}
				}
			});

			pasteBtn.addEventListener('click', () => {
				if (fs && fs.clipboard && fs.clipboard.element) {
					const dest = state.currentFolder.getFullPath();
					const src = fs.clipboard.element.getFullPath();
					try {
						if (fs.clipboard.mode === 'cut') {
							fs.move(src, dest);
							fs.clipboard.mode = null;
							fs.clipboard.element = null;
						} else {
							fs.copy(src, dest);
						}
						refreshUI();
					} catch (e) {
						showXPDialog('Error', e.message, 'error');
					}
				}
			});

			deleteBtn.addEventListener('click', () => {
				const count = state.selectedItems.size;
				if (count === 0) return;
				const message = count > 1
					? `Are you sure you want to move these ${count} items to the Recycle Bin?`
					: `Are you sure you want to move this item to the Recycle Bin?`;

				createConfirmationDialog(message, () => {
					state.selectedItems.forEach(icon => {
						const p = icon.dataset.path;
						if (p && !p.startsWith('app://')) {
							try {
								fs.moveToRecycleBin(p);
							} catch (err) {}
						}
					});
					state.selectedItems.clear();
					refreshUI();
				});
			});

			const handleAddressSubmit = () => {
				let targetPath = addressInput.value.trim();
				if (!targetPath.startsWith('/')) {
					if (targetPath.toLowerCase() === 'desktop' || targetPath.toLowerCase() === 'c:\\' || targetPath.toLowerCase() === 'c:') {
						targetPath = '/';
					} else {
						targetPath = '/' + targetPath;
					}
				}
				const folder = fs.findByPath(targetPath);
				if (folder instanceof Folder) {
					this.navigateTo(folder, win, true);
				} else {
					showXPDialog('Address Bar', `Cannot find '${addressInput.value}'. Check the spelling and try again.`, 'error');
					addressInput.value = state.currentFolder.getFullPath();
				}
			};

			addressInput.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') handleAddressSubmit();
			});
			addressGoBtn.addEventListener('click', handleAddressSubmit);

			win.querySelectorAll('.xp-menubar-item').forEach(menuItem => {
				menuItem.addEventListener('click', (e) => {
					e.stopPropagation();
					const menuType = menuItem.dataset.menu;
					const rect = menuItem.getBoundingClientRect();
					this.openMenuBarDropdown(menuType, win, rect.left, rect.bottom);
				});
			});

			win.querySelectorAll('.xp-task-header').forEach(header => {
				header.addEventListener('click', () => {
					const box = header.closest('.xp-task-box');
					box.classList.toggle('collapsed');
				});
			});

			win.querySelector('.xp-tasks-places').addEventListener('click', (e) => {
				const link = e.target.closest('.xp-task-link');
				if (!link) return;
				e.preventDefault();
				const place = link.dataset.place;
				if (place === 'desktop') {
					this.navigateTo(fs.root, win, true);
				} else if (place === 'my-documents') {
					const pdfs = fs.root.getByName('PDFs') || fs.root;
					this.navigateTo(pdfs, win, true);
				} else if (place === 'my-computer') {
					if (window.DeskAPI && window.DeskAPI.openMyComputer) window.DeskAPI.openMyComputer();
				} else if (place === 'my-network') {
					if (window.DeskAPI && window.DeskAPI.openNetworkPlaces) window.DeskAPI.openNetworkPlaces();
				} else if (place === 'recycle-bin') {
					if (typeof openRecycleBinWindow === 'function') openRecycleBinWindow();
				}
			});

			let isResizingSidebar = false;
			splitter.addEventListener('mousedown', (e) => {
				e.preventDefault();
				isResizingSidebar = true;
				document.body.style.userSelect = 'none';
				const startX = e.clientX;
				const startWidth = sidebar.getBoundingClientRect().width;

				const onMouseMove = (ev) => {
					if (!isResizingSidebar) return;
					const newW = Math.max(120, Math.min(380, startWidth + (ev.clientX - startX)));
					sidebar.style.width = `${newW}px`;
				};

				const onMouseUp = () => {
					isResizingSidebar = false;
					document.body.style.userSelect = '';
					document.removeEventListener('mousemove', onMouseMove);
					document.removeEventListener('mouseup', onMouseUp);
				};

				document.addEventListener('mousemove', onMouseMove);
				document.addEventListener('mouseup', onMouseUp);
			});

			contentContainer.addEventListener('contextmenu', (e) => {
				e.preventDefault();
				e.stopPropagation();
				if (e.target === contentContainer || e.target === viewContainer) {
					clearIconSelections();
					state.selectedItems.clear();
					this.updateSelectionDetails(win);
					if (window.ContextMenu) {
						const items = window.ContextMenu.getFolderAreaItems(state.currentFolder, win);
						window.ContextMenu.show(items, e.clientX, e.clientY);
					}
				}
			});

			viewContainer.addEventListener('click', (e) => {
				if (e.target === viewContainer || e.target === contentContainer) {
					clearIconSelections();
					state.selectedItems.clear();
					this.updateSelectionDetails(win);
				}
			});

			[contentContainer, viewContainer].forEach(zone => {
				zone.addEventListener('dragover', handleDragOver);
				zone.addEventListener('dragleave', handleDragLeave);
				zone.addEventListener('drop', handleDrop);
			});
		},

		showHistoryDropdown(win, buttonEl, isBack = true) {
			const state = win.explorerState;
			const rect = buttonEl.getBoundingClientRect();
			const items = [];

			if (isBack) {
				for (let i = state.historyIndex - 1; i >= 0; i--) {
					const path = state.history[i];
					const folder = fs.findByPath(path);
					items.push({
						label: folder ? folder.name : path,
						action: () => {
							state.historyIndex = i;
							if (folder) this.navigateTo(folder, win, false);
						}
					});
				}
			} else {
				for (let i = state.historyIndex + 1; i < state.history.length; i++) {
					const path = state.history[i];
					const folder = fs.findByPath(path);
					items.push({
						label: folder ? folder.name : path,
						action: () => {
							state.historyIndex = i;
							if (folder) this.navigateTo(folder, win, false);
						}
					});
				}
			}

			if (items.length > 0 && window.ContextMenu) {
				window.ContextMenu.show(items, rect.left, rect.bottom + 2);
			}
		},

		openMenuBarDropdown(menuType, win, x, y) {
			const state = win.explorerState;
			const currentFolder = state.currentFolder;
			const hasSelection = state.selectedItems.size > 0;
			const hasClipboard = fs && fs.clipboard && fs.clipboard.element;

			let items = [];

			if (menuType === 'file') {
				items = [
					{
						label: 'New',
						submenu: [
							{
								label: 'Folder',
								icon: '../assets/images/desk/icons/Folder Closed.webp',
								action: () => {
									fs.create('Folder', currentFolder.getFullPath(), 'New Folder');
									refreshUI();
								}
							},
							{
								label: 'Shortcut',
								icon: '../assets/images/desk/icons/Folder Closed.webp',
								action: () => {
									fs.create('Shortcut', currentFolder.getFullPath(), 'New Shortcut', {
										targetPath: '/',
										icon: '../assets/images/desk/icons/Folder Closed.webp'
									});
									refreshUI();
								}
							},
							{
								label: 'Text Document',
								icon: '../assets/images/desk/icons/File.webp',
								action: () => {
									fs.create('File', currentFolder.getFullPath(), 'New Text Document.txt');
									refreshUI();
								}
							},
							{
								label: 'Wave Sound Document',
								icon: '../assets/images/desk/icons/Music File.webp',
								action: () => {
									fs.create('File', currentFolder.getFullPath(), 'New Audio.wav');
									refreshUI();
								}
							}
						]
					},
					{
						label: 'Open in New Window',
						action: () => {
							FileExplorer.open(currentFolder, { newWindow: true });
						}
					},
					{ separator: true },
					{
						label: 'Create Shortcut',
						disabled: !hasSelection,
						action: () => {
							state.selectedItems.forEach(icon => {
								const el = fs.findByPath(icon.dataset.path);
								if (el) {
									fs.create('Shortcut', currentFolder.getFullPath(), `Shortcut to ${el.name}`, {
										targetPath: el.getFullPath(),
										icon: el.icon
									});
								}
							});
							refreshUI();
						}
					},
					{
						label: 'Delete',
						disabled: !hasSelection,
						action: () => {
							const delBtn = win.querySelector('.tb-delete');
							if (delBtn) delBtn.click();
						}
					},
					{
						label: 'Rename',
						disabled: state.selectedItems.size !== 1,
						action: () => {
							const icon = Array.from(state.selectedItems)[0];
							if (icon) startInlineRename(icon);
						}
					},
					{
						label: 'Properties',
						bold: true,
						action: () => {
							if (hasSelection) {
								const icon = Array.from(state.selectedItems)[0];
								const el = fs.findByPath(icon.dataset.path);
								if (el) openElementInfoWindow(el);
							} else {
								openElementInfoWindow(currentFolder);
							}
						}
					},
					{ separator: true },
					{
						label: 'Close',
						action: () => closeWindow(win, win.id)
					}
				];
			} else if (menuType === 'edit') {
				items = [
					{
						label: 'Undo',
						shortcut: 'Ctrl+Z',
						disabled: true,
						action: () => {}
					},
					{ separator: true },
					{
						label: 'Cut',
						shortcut: 'Ctrl+X',
						disabled: !hasSelection,
						action: () => {
							const cutBtn = win.querySelector('.tb-cut');
							if (cutBtn) cutBtn.click();
						}
					},
					{
						label: 'Copy',
						shortcut: 'Ctrl+C',
						disabled: !hasSelection,
						action: () => {
							const copyBtn = win.querySelector('.tb-copy');
							if (copyBtn) copyBtn.click();
						}
					},
					{
						label: 'Paste',
						shortcut: 'Ctrl+V',
						disabled: !hasClipboard,
						action: () => {
							const pasteBtn = win.querySelector('.tb-paste');
							if (pasteBtn) pasteBtn.click();
						}
					},
					{
						label: 'Paste Shortcut',
						disabled: !hasClipboard,
						action: () => {
							if (fs && fs.clipboard && fs.clipboard.element) {
								const el = fs.clipboard.element;
								fs.create('Shortcut', currentFolder.getFullPath(), `${el.name} - Shortcut`, {
									targetPath: el.getFullPath(),
									icon: el.icon
								});
								refreshUI();
							}
						}
					},
					{ separator: true },
					{
						label: 'Select All',
						shortcut: 'Ctrl+A',
						action: () => {
							const icons = win.querySelectorAll('.project-icon, .xp-details-row');
							icons.forEach(i => {
								i.classList.add('selected');
								state.selectedItems.add(i);
							});
							this.updateSelectionDetails(win);
						}
					},
					{
						label: 'Invert Selection',
						action: () => {
							const icons = win.querySelectorAll('.project-icon, .xp-details-row');
							icons.forEach(i => {
								if (state.selectedItems.has(i)) {
									i.classList.remove('selected');
									state.selectedItems.delete(i);
								} else {
									i.classList.add('selected');
									state.selectedItems.add(i);
								}
							});
							this.updateSelectionDetails(win);
						}
					}
				];
			} else if (menuType === 'view') {
				items = [
					{
						label: 'Toolbars',
						submenu: [
							{ label: 'Standard Buttons', checked: true, action: () => {} },
							{ label: 'Address Bar', checked: true, action: () => {} },
							{ separator: true },
							{ label: 'Lock the Toolbars', checked: true, action: () => {} }
						]
					},
					{
						label: 'Explorer Bar',
						submenu: [
							{
								label: 'Search',
								checked: false,
								action: () => {
									if (window.DeskAPI && window.DeskAPI.openSearch) window.DeskAPI.openSearch('');
								}
							},
							{
								label: 'Folders',
								checked: state.sidebarMode === 'tree',
								action: () => {
									const foldersBtn = win.querySelector('.tb-folders');
									if (foldersBtn) foldersBtn.click();
								}
							}
						]
					},
					{ separator: true },
					{
						label: 'Thumbnails',
						radio: state.viewMode === 'thumbnails',
						action: () => { state.viewMode = 'thumbnails'; this.updateView(win, false); }
					},
					{
						label: 'Tiles',
						radio: state.viewMode === 'tiles',
						action: () => { state.viewMode = 'tiles'; this.updateView(win, false); }
					},
					{
						label: 'Icons',
						radio: state.viewMode === 'icons',
						action: () => { state.viewMode = 'icons'; this.updateView(win, false); }
					},
					{
						label: 'List',
						radio: state.viewMode === 'list',
						action: () => { state.viewMode = 'list'; this.updateView(win, false); }
					},
					{
						label: 'Details',
						radio: state.viewMode === 'details',
						action: () => { state.viewMode = 'details'; this.updateView(win, false); }
					},
					{ separator: true },
					{
						label: 'Arrange Icons By',
						submenu: [
							{ label: 'Name', radio: state.sortBy === 'name', action: () => { state.sortBy = 'name'; this.updateView(win, false); } },
							{ label: 'Size', radio: state.sortBy === 'size', action: () => { state.sortBy = 'size'; this.updateView(win, false); } },
							{ label: 'Type', radio: state.sortBy === 'type', action: () => { state.sortBy = 'type'; this.updateView(win, false); } },
							{ label: 'Modified', radio: state.sortBy === 'date', action: () => { state.sortBy = 'date'; this.updateView(win, false); } },
							{ separator: true },
							{ label: 'Ascending', radio: state.sortAsc, action: () => { state.sortAsc = true; this.updateView(win, false); } },
							{ label: 'Descending', radio: !state.sortAsc, action: () => { state.sortAsc = false; this.updateView(win, false); } }
						]
					},
					{ separator: true },
					{
						label: 'Refresh',
						shortcut: 'F5',
						action: () => this.updateView(win, false)
					}
				];
			} else if (menuType === 'favorites') {
				items = [
					{ label: 'Add to Favorites...', action: () => showXPDialog('Favorites', `"${currentFolder.name}" has been added to your favorites list.`, 'info') },
					{ label: 'Organize Favorites...', action: () => showXPDialog('Favorites', 'Manage folder bookmarks.', 'info') },
					{ separator: true },
					{ label: 'Desktop', icon: '../assets/images/desk/icons/Display.webp', action: () => this.navigateTo(fs.root, win, true) },
					{ label: 'My Documents', icon: '../assets/images/desk/icons/My Profile Folder.webp', action: () => this.navigateTo(fs.root.getByName('PDFs') || fs.root, win, true) },
					{ label: 'My Computer', icon: '../assets/images/desk/icons/My Computer.webp', action: () => { if (window.DeskAPI && window.DeskAPI.openMyComputer) window.DeskAPI.openMyComputer(); } },
					{ label: 'My Network Places', icon: '../assets/images/desk/icons/My Network Places.webp', action: () => { if (window.DeskAPI && window.DeskAPI.openNetworkPlaces) window.DeskAPI.openNetworkPlaces(); } }
				];
			} else if (menuType === 'tools') {
				items = [
					{ label: 'Map Network Drive...', action: () => showXPDialog('Map Network Drive', 'Specify the drive letter and folder path to connect.', 'info') },
					{ label: 'Disconnect Network Drive...', disabled: true, action: () => {} },
					{ separator: true },
					{ label: 'Folder Options...', action: () => { if (window.SettingsApp) window.SettingsApp.open('input'); } }
				];
			} else if (menuType === 'help') {
				items = [
					{ label: 'Help and Support Center', action: () => window.open('https://github.com/wartets/Wartets.github.io', '_blank') },
					{ separator: true },
					{ label: 'About Windows XP', bold: true, action: () => { if (window.SettingsApp) window.SettingsApp.open('system'); } }
				];
			}

			if (window.ContextMenu) {
				window.ContextMenu.show(items, x, y);
			}
		},

		navigateTo(folder, win, pushHistory = true) {
			if (!folder || !(folder instanceof Folder)) return;
			const state = win.explorerState;
			state.currentFolder = folder;
			state.selectedItems.clear();

			if (pushHistory) {
				const currentPath = folder.getFullPath();
				if (state.historyIndex < state.history.length - 1) {
					state.history = state.history.slice(0, state.historyIndex + 1);
				}
				if (state.history[state.history.length - 1] !== currentPath) {
					state.history.push(currentPath);
					state.historyIndex = state.history.length - 1;
				}
			}

			this.updateView(win, false);
			if (state.sidebarMode === 'tree') {
				this.renderFolderTree(win);
			}
		},

		updateView(win, keepSelection = false) {
			const state = win.explorerState;
			const folder = state.currentFolder;
			const contentContainer = win.querySelector('.folder-content');
			const titleEl = win.querySelector('.xp-window-header .title');
			const addressInput = win.querySelector('.xp-address-input');
			const backBtn = win.querySelector('.tb-back');
			const forwardBtn = win.querySelector('.tb-forward');
			const upBtn = win.querySelector('.tb-up');

			if (titleEl) titleEl.textContent = folder.name;
			if (addressInput) addressInput.value = folder.getFullPath();
			contentContainer.dataset.path = folder.getFullPath();

			backBtn.disabled = state.historyIndex <= 0;
			forwardBtn.disabled = state.historyIndex >= state.history.length - 1;
			upBtn.disabled = !folder.parent;

			if (!keepSelection) {
				state.selectedItems.clear();
			}

			if (window.AchievementsManager && state.viewMode) {
				try {
					let tested = JSON.parse(localStorage.getItem('xp_tested_view_modes') || '[]');
					if (!tested.includes(state.viewMode)) {
						tested.push(state.viewMode);
						localStorage.setItem('xp_tested_view_modes', JSON.stringify(tested));
					}
					window.AchievementsManager.setProgress('explorer_view_modes', tested.length);
				} catch (e) {}
			}

			contentContainer.className = `folder-content xp-file-grid view-${state.viewMode}`;
			contentContainer.innerHTML = '';

			const showHidden = isShowHiddenEnabled();
			let items = folder.listContent().filter(item => !item.hidden || showHidden);

			items.sort((a, b) => {
				let result = 0;
				if (state.sortBy === 'name') {
					result = a.name.localeCompare(b.name);
				} else if (state.sortBy === 'date') {
					result = new Date(a.modifiedAt) - new Date(b.modifiedAt);
				} else if (state.sortBy === 'size') {
					const sA = a.size || 0;
					const sB = b.size || 0;
					result = sA - sB;
				} else if (state.sortBy === 'type') {
					const tA = a.constructor.name;
					const tB = b.constructor.name;
					result = tA.localeCompare(tB) || a.name.localeCompare(b.name);
				}
				return state.sortAsc ? result : -result;
			});

			if (state.viewMode === 'details') {
				this.renderDetailsView(win, items, contentContainer);
			} else {
				items.forEach(el => {
					const iconEl = this.createExplorerIcon(el, win);
					contentContainer.appendChild(iconEl);
				});
			}

			this.updateSelectionDetails(win);
		},

		renderDetailsView(win, items, container) {
			const state = win.explorerState;
			const table = document.createElement('div');
			table.className = 'xp-details-table';

			const getSortGlyph = (col) => {
				if (state.sortBy !== col) return '';
				return state.sortAsc ? ' ▲' : ' ▼';
			};

			const header = document.createElement('div');
			header.className = 'xp-details-header-row';
			header.innerHTML = `
				<div class="xp-details-th col-name" data-sort="name"><span>Name${getSortGlyph('name')}</span></div>
				<div class="xp-details-th col-size" data-sort="size"><span>Size${getSortGlyph('size')}</span></div>
				<div class="xp-details-th col-type" data-sort="type"><span>Type${getSortGlyph('type')}</span></div>
				<div class="xp-details-th col-modified" data-sort="date"><span>Date Modified${getSortGlyph('date')}</span></div>
			`;

			header.querySelectorAll('.xp-details-th').forEach(th => {
				th.addEventListener('click', () => {
					const col = th.dataset.sort;
					if (state.sortBy === col) {
						state.sortAsc = !state.sortAsc;
					} else {
						state.sortBy = col;
						state.sortAsc = true;
					}
					this.updateView(win, true);
				});
			});

			table.appendChild(header);

			items.forEach(el => {
				const row = document.createElement('div');
				row.className = 'xp-details-row';
				row.dataset.path = el.getFullPath();

				let typeStr = 'File';
				if (el instanceof Folder) typeStr = 'File Folder';
				else if (el instanceof Shortcut) typeStr = 'Shortcut';
				else if (el instanceof ProjectFile) typeStr = 'Project File';

				const sizeStr = el.size !== undefined && !(el instanceof Folder) ? `${Math.ceil(el.size / 1024)} KB` : '';
				const modStr = el.modifiedAt ? el.modifiedAt.toLocaleString() : '';

				row.innerHTML = `
					<div class="xp-details-td col-name">
						<img src="${el.icon || '../assets/images/desk/icons/File.webp'}" alt="">
						<span>${el.name}</span>
					</div>
					<div class="xp-details-td col-size">${sizeStr}</div>
					<div class="xp-details-td col-type">${typeStr}</div>
					<div class="xp-details-td col-modified">${modStr}</div>
				`;

				row.addEventListener('click', (e) => {
					this.handleItemSelection(row, win, e);
				});

				row.addEventListener('dblclick', () => {
					openFileSystemElement(el, win);
				});

				row.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					e.stopPropagation();
					if (!row.classList.contains('selected')) {
						this.handleItemSelection(row, win, { ctrlKey: false, shiftKey: false });
					}
					if (window.ContextMenu) {
						const menuItems = window.ContextMenu.getIconItems(el, row, win);
						window.ContextMenu.show(menuItems, e.clientX, e.clientY);
					}
				});

				table.appendChild(row);
			});

			container.appendChild(table);
		},

		createExplorerIcon(element, win) {
			const state = win.explorerState;
			const icon = document.createElement('div');
			icon.className = 'project-icon xp-explorer-item';
			icon.dataset.path = element.getFullPath();
			icon.draggable = true;
			icon.title = element.name;

			let type = 'file';
			if (element instanceof Folder) type = 'folder';
			else if (element instanceof Shortcut) type = 'shortcut';
			else if (element instanceof ProjectFile) type = 'project';
			icon.dataset.type = type;

			if (state.viewMode === 'thumbnails') {
				icon.classList.add('mode-thumbnail');
				const thumbFrame = document.createElement('div');
				thumbFrame.className = 'xp-thumb-frame';
				const img = document.createElement('img');
				img.src = element.icon || '../assets/images/desk/icons/File.webp';
				img.alt = element.name;
				thumbFrame.appendChild(img);
				icon.appendChild(thumbFrame);

				const label = document.createElement('span');
				label.textContent = element.name;
				icon.appendChild(label);
			} else if (state.viewMode === 'tiles') {
				icon.classList.add('mode-tile');
				const img = document.createElement('img');
				img.src = element.icon || '../assets/images/desk/icons/File.webp';
				img.alt = element.name;
				icon.appendChild(img);

				const texts = document.createElement('div');
				texts.className = 'xp-tile-texts';
				const titleSpan = document.createElement('strong');
				titleSpan.textContent = element.name;
				const subSpan = document.createElement('span');
				subSpan.textContent = element instanceof Folder ? 'Folder' : `${Math.ceil((element.size || 0) / 1024)} KB`;
				texts.appendChild(titleSpan);
				texts.appendChild(subSpan);
				icon.appendChild(texts);
			} else {
				const img = document.createElement('img');
				img.src = element.icon || '../assets/images/desk/icons/File.webp';
				img.alt = element.name;
				icon.appendChild(img);

				const span = document.createElement('span');
				span.textContent = element.name;
				icon.appendChild(span);
			}

			icon.addEventListener('click', (e) => {
				this.handleItemSelection(icon, win, e);
			});

			icon.addEventListener('dblclick', () => {
				openFileSystemElement(element, win);
			});

			icon.addEventListener('contextmenu', (e) => {
				e.preventDefault();
				e.stopPropagation();
				if (!icon.classList.contains('selected')) {
					this.handleItemSelection(icon, win, { ctrlKey: false, shiftKey: false });
				}
				if (window.ContextMenu) {
					const items = window.ContextMenu.getIconItems(element, icon, win);
					window.ContextMenu.show(items, e.clientX, e.clientY);
				}
			});

			icon.addEventListener('dragstart', handleDragStart);
			icon.addEventListener('dragover', handleDragOver);
			icon.addEventListener('dragleave', handleDragLeave);
			icon.addEventListener('drop', handleDrop);
			icon.addEventListener('dragend', handleDragEnd);

			return icon;
		},

		handleItemSelection(itemEl, win, e) {
			const state = win.explorerState;
			const isCtrl = e.ctrlKey || e.metaKey;
			const isShift = e.shiftKey;
			const container = win.querySelector('.folder-content');
			const allItems = Array.from(container.querySelectorAll('.xp-explorer-item, .xp-details-row'));

			if (!isCtrl && !isShift) {
				allItems.forEach(i => i.classList.remove('selected'));
				state.selectedItems.clear();
				itemEl.classList.add('selected');
				state.selectedItems.add(itemEl);
			} else if (isCtrl) {
				if (state.selectedItems.has(itemEl)) {
					itemEl.classList.remove('selected');
					state.selectedItems.delete(itemEl);
				} else {
					itemEl.classList.add('selected');
					state.selectedItems.add(itemEl);
				}
			} else if (isShift && state.selectedItems.size > 0) {
				const firstSelected = Array.from(state.selectedItems)[0];
				const idx1 = allItems.indexOf(firstSelected);
				const idx2 = allItems.indexOf(itemEl);
				const min = Math.min(idx1, idx2);
				const max = Math.max(idx1, idx2);
				allItems.forEach(i => i.classList.remove('selected'));
				state.selectedItems.clear();
				for (let i = min; i <= max; i++) {
					allItems[i].classList.add('selected');
					state.selectedItems.add(allItems[i]);
				}
			}

			this.updateSelectionDetails(win);
		},

		updateSelectionDetails(win) {
			const state = win.explorerState;
			const selectedCount = state.selectedItems.size;
			const totalCount = state.currentFolder.listContent().length;

			const sbCount = win.querySelector('.xp-sb-count');
			const sbSize = win.querySelector('.xp-sb-size');
			const detailsBody = win.querySelector('.xp-task-details-body');
			const actionsContainer = win.querySelector('#xp-task-content-actions');

			if (selectedCount === 0) {
				if (sbCount) sbCount.textContent = `${totalCount} objects`;
				if (sbSize) {
					let totalBytes = 0;
					state.currentFolder.listContent().forEach(c => { totalBytes += (c.size || 0); });
					sbSize.textContent = `${Math.ceil(totalBytes / 1024)} KB`;
				}
				if (detailsBody) {
					detailsBody.innerHTML = `
						<div class="xp-details-name"><b>${state.currentFolder.name}</b></div>
						<div class="xp-details-type">File Folder</div>
						<div class="xp-details-modified">Date Modified: ${state.currentFolder.modifiedAt.toLocaleDateString()}</div>
					`;
				}
				if (actionsContainer) {
					actionsContainer.innerHTML = `
						<a href="#" class="xp-task-link" data-action="new-folder"><img src="../assets/images/desk/icons/Folder Closed.webp" alt=""><span>Make a new folder</span></a>
						<a href="#" class="xp-task-link" data-action="publish"><img src="../assets/images/desk/icons/Earth (fixed).webp" alt=""><span>Publish this folder to the Web</span></a>
						<a href="#" class="xp-task-link" data-action="share"><img src="../assets/images/desk/icons/Folder Closed (Alt).webp" alt=""><span>Share this folder</span></a>
					`;
				}
			} else if (selectedCount === 1) {
				const itemEl = Array.from(state.selectedItems)[0];
				const el = fs.findByPath(itemEl.dataset.path);
				if (sbCount) sbCount.textContent = `1 object selected`;
				if (sbSize && el) sbSize.textContent = el.size !== undefined ? `${Math.ceil(el.size / 1024)} KB` : '';
				if (detailsBody && el) {
					let typeName = 'File';
					if (el instanceof Folder) typeName = 'File Folder';
					else if (el instanceof Shortcut) typeName = 'Shortcut';
					else if (el instanceof ProjectFile) typeName = 'Project Application';
					else typeName = 'Text Document';

					const sizeLine = el.size !== undefined && !(el instanceof Folder) ? `<div>Size: ${Math.ceil(el.size / 1024)} KB</div>` : '';
					const previewImg = el.icon || '../assets/images/desk/icons/File.webp';

					detailsBody.innerHTML = `
						<div class="xp-details-preview-frame"><img src="${previewImg}" alt=""></div>
						<div class="xp-details-name"><b>${el.name}</b></div>
						<div class="xp-details-type">${typeName}</div>
						${sizeLine}
						<div class="xp-details-modified">Modified: ${el.modifiedAt.toLocaleDateString()}</div>
					`;
				}
				if (actionsContainer && el) {
					const isFolder = el instanceof Folder;
					const isProject = el instanceof ProjectFile;
					let playAction = '';
					if (isProject && el.projectData && el.projectData.link) {
						playAction = `<a href="#" class="xp-task-link" data-action="run"><img src="https://api.iconify.design/mdi/play-box-outline.svg" alt=""><span>Run application</span></a>`;
					}

					actionsContainer.innerHTML = `
						${playAction}
						<a href="#" class="xp-task-link" data-action="rename"><img src="../assets/images/desk/icons/File.webp" alt=""><span>Rename this ${isFolder ? 'folder' : 'file'}</span></a>
						<a href="#" class="xp-task-link" data-action="move"><img src="https://api.iconify.design/mdi/folder-move-outline.svg" alt=""><span>Move this ${isFolder ? 'folder' : 'file'}</span></a>
						<a href="#" class="xp-task-link" data-action="copy"><img src="https://api.iconify.design/mdi/content-copy.svg" alt=""><span>Copy this ${isFolder ? 'folder' : 'file'}</span></a>
						<a href="#" class="xp-task-link" data-action="email"><img src="https://api.iconify.design/mdi/email-outline.svg" alt=""><span>E-mail this file</span></a>
						<a href="#" class="xp-task-link" data-action="delete"><img src="https://api.iconify.design/mdi/delete-outline.svg" alt=""><span>Delete this ${isFolder ? 'folder' : 'file'}</span></a>
					`;
				}
			} else {
				if (sbCount) sbCount.textContent = `${selectedCount} objects selected`;
				let selBytes = 0;
				state.selectedItems.forEach(i => {
					const el = fs.findByPath(i.dataset.path);
					if (el && el.size) selBytes += el.size;
				});
				if (sbSize) sbSize.textContent = `${Math.ceil(selBytes / 1024)} KB`;
				if (detailsBody) {
					detailsBody.innerHTML = `
						<div class="xp-details-name"><b>${selectedCount} items selected.</b></div>
						<div>Total size: ${Math.ceil(selBytes / 1024)} KB</div>
					`;
				}
				if (actionsContainer) {
					actionsContainer.innerHTML = `
						<a href="#" class="xp-task-link" data-action="move"><img src="https://api.iconify.design/mdi/folder-move-outline.svg" alt=""><span>Move the selected items</span></a>
						<a href="#" class="xp-task-link" data-action="copy"><img src="https://api.iconify.design/mdi/content-copy.svg" alt=""><span>Copy the selected items</span></a>
						<a href="#" class="xp-task-link" data-action="email"><img src="https://api.iconify.design/mdi/email-outline.svg" alt=""><span>E-mail the selected items</span></a>
						<a href="#" class="xp-task-link" data-action="delete"><img src="https://api.iconify.design/mdi/delete-outline.svg" alt=""><span>Delete the selected items</span></a>
					`;
				}
			}

			if (actionsContainer) {
				actionsContainer.querySelectorAll('.xp-task-link').forEach(link => {
					link.addEventListener('click', (e) => {
						e.preventDefault();
						const act = link.dataset.action;
						if (act === 'new-folder') {
							try {
								fs.create('Folder', state.currentFolder.getFullPath(), 'New Folder');
								refreshUI();
							} catch (err) {
								showXPDialog('Error', err.message, 'error');
							}
						} else if (act === 'rename') {
							const icon = Array.from(state.selectedItems)[0];
							if (icon) startInlineRename(icon);
						} else if (act === 'delete') {
							const delBtn = win.querySelector('.tb-delete');
							if (delBtn) delBtn.click();
						} else if (act === 'copy') {
							const copyBtn = win.querySelector('.tb-copy');
							if (copyBtn) copyBtn.click();
						} else if (act === 'move') {
							const cutBtn = win.querySelector('.tb-cut');
							if (cutBtn) cutBtn.click();
						} else if (act === 'run') {
							const icon = Array.from(state.selectedItems)[0];
							const el = fs.findByPath(icon.dataset.path);
							if (el && el.projectData) {
								const title = resolveProjectTitle(el.projectData.title);
								const appId = `app-running-${title.replace(/\s/g, '-')}-${Date.now()}`;
								const appContent = `<iframe src="${el.projectData.link}" style="width: 100%; height: 100%; border: none;"></iframe>`;
								const appWin = createXPWindow(appId, title, appContent, 800, 600, { iconSrc: el.projectData.icon });
								appWin.querySelector('.xp-window-content').style.padding = '0';
								appWin.querySelector('.xp-window-content').style.overflow = 'hidden';
							}
						} else if (act === 'email') {
							if (typeof openOutlookExpress === 'function') openOutlookExpress();
						} else if (act === 'publish' || act === 'share') {
							showXPDialog('Web Publishing Wizard', 'This feature requires an active network connection to MSN or an FTP host.', 'info');
						}
					});
				});
			}
		},

		renderFolderTree(win) {
			const treeContainer = win.querySelector('.xp-tree-content');
			if (!treeContainer || !fs) return;
			treeContainer.innerHTML = '';

			const buildNode = (folder, depth = 0) => {
				const node = document.createElement('div');
				node.className = 'xp-tree-node';
				node.dataset.path = folder.getFullPath();
				node.dataset.type = 'folder';
				node.style.paddingLeft = `${depth * 14 + 4}px`;

				const hasSubfolders = folder.listContent().some(c => c instanceof Folder);
				const isCurrent = win.explorerState.currentFolder === folder;

				const expandBtn = document.createElement('span');
				expandBtn.className = `xp-tree-expander ${hasSubfolders ? 'expandable' : 'leaf'}`;
				expandBtn.textContent = hasSubfolders ? '+' : '';

				const iconImg = document.createElement('img');
				iconImg.src = folder.icon || '../assets/images/desk/icons/Folder Closed.webp';
				iconImg.alt = '';

				const label = document.createElement('span');
				label.className = `xp-tree-label ${isCurrent ? 'active' : ''}`;
				label.textContent = folder.name;

				node.appendChild(expandBtn);
				node.appendChild(iconImg);
				node.appendChild(label);
				treeContainer.appendChild(node);

				const childContainer = document.createElement('div');
				childContainer.className = 'xp-tree-children hidden';
				treeContainer.appendChild(childContainer);

				expandBtn.addEventListener('click', (e) => {
					e.stopPropagation();
					if (!hasSubfolders) return;
					const isExpanded = !childContainer.classList.contains('hidden');
					if (isExpanded) {
						childContainer.classList.add('hidden');
						expandBtn.textContent = '+';
					} else {
						childContainer.classList.remove('hidden');
						expandBtn.textContent = '-';
						if (childContainer.children.length === 0) {
							folder.listContent().filter(c => c instanceof Folder).forEach(sub => {
								const subNode = buildNode(sub, depth + 1);
								childContainer.appendChild(subNode);
							});
						}
					}
				});

				label.addEventListener('click', () => {
					this.navigateTo(folder, win, true);
				});

				node.addEventListener('dragover', handleDragOver);
				node.addEventListener('dragleave', handleDragLeave);
				node.addEventListener('drop', handleDrop);

				return node;
			};

			buildNode(fs.root, 0);
		}
	};

	window.FileExplorer = FileExplorer;
	window.openFolderWindow = (folder) => FileExplorer.open(folder);
})();
