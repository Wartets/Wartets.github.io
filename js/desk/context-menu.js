(function () {
	let activeMenu = null;
	let subMenuTimeout = null;

	const ContextMenu = {
		init() {
			document.addEventListener('mousedown', (e) => {
				if (activeMenu && !e.target.closest('.xp-context-menu')) {
					this.close();
				}
			});

			document.addEventListener('keydown', (e) => {
				if (e.key === 'Escape' && activeMenu) {
					this.close();
				}
			});

			window.addEventListener('blur', () => this.close());
			window.addEventListener('resize', () => this.close());
		},

		isOpen() {
			return !!activeMenu;
		},

		close() {
			if (subMenuTimeout) {
				clearTimeout(subMenuTimeout);
				subMenuTimeout = null;
			}
			document.querySelectorAll('.xp-context-menu').forEach(menu => menu.remove());
			activeMenu = null;
		},

		show(items, x, y, context = {}) {
			this.close();
			if (!items || items.length === 0) return;

			activeMenu = this.createMenuElement(items, context, 0);
			document.body.appendChild(activeMenu);
			this.positionMenu(activeMenu, x, y);
		},

		createMenuElement(items, context, level = 0) {
			const menu = document.createElement('div');
			menu.className = 'xp-context-menu';
			menu.dataset.level = level;
			menu.style.zIndex = String(100000 + level * 10);

			const ul = document.createElement('ul');

			items.forEach(item => {
				if (item.separator) {
					const sep = document.createElement('li');
					sep.className = 'separator';
					ul.appendChild(sep);
					return;
				}

				if (item.visible === false) return;

				const li = document.createElement('li');
				li.className = 'xp-menu-item';
				if (item.disabled) li.classList.add('disabled');
				if (item.bold) li.classList.add('default-action');

				const iconContainer = document.createElement('span');
				iconContainer.className = 'xp-menu-icon';
				if (item.checked) {
					iconContainer.innerHTML = '✓';
				} else if (item.radio) {
					iconContainer.innerHTML = '●';
				} else if (item.icon) {
					const img = document.createElement('img');
					img.src = item.icon;
					img.alt = '';
					iconContainer.appendChild(img);
				}
				li.appendChild(iconContainer);

				const label = document.createElement('span');
				label.className = 'xp-menu-label';
				label.textContent = item.label;
				li.appendChild(label);

				if (item.shortcut) {
					const sc = document.createElement('span');
					sc.className = 'xp-menu-shortcut';
					sc.textContent = item.shortcut;
					li.appendChild(sc);
				}

				if (item.submenu && item.submenu.length > 0) {
					li.classList.add('has-submenu');
					const arrow = document.createElement('span');
					arrow.className = 'xp-menu-arrow';
					arrow.textContent = '►';
					li.appendChild(arrow);

					let openSubMenu = null;

					li.addEventListener('mouseenter', () => {
						if (subMenuTimeout) clearTimeout(subMenuTimeout);
						subMenuTimeout = setTimeout(() => {
							this.closeSubmenusAbove(level);
							if (item.disabled) return;
							openSubMenu = this.createMenuElement(item.submenu, context, level + 1);
							document.body.appendChild(openSubMenu);
							const rect = li.getBoundingClientRect();
							this.positionSubMenu(openSubMenu, rect);
						}, 120);
					});

					li.addEventListener('mouseleave', (e) => {
						if (subMenuTimeout) clearTimeout(subMenuTimeout);
						subMenuTimeout = setTimeout(() => {
							if (openSubMenu && !openSubMenu.matches(':hover') && !li.matches(':hover')) {
								openSubMenu.remove();
								openSubMenu = null;
							}
						}, 250);
					});
				} else {
					li.addEventListener('mouseenter', () => {
						if (subMenuTimeout) clearTimeout(subMenuTimeout);
						this.closeSubmenusAbove(level);
					});

					li.addEventListener('click', (e) => {
						if (item.disabled) return;
						e.stopPropagation();
						this.close();
						if (window.SettingsApp && window.SettingsApp.playSound) {
							window.SettingsApp.playSound('click');
						}
						if (typeof item.action === 'function') {
							item.action(context);
						}
					});
				}

				ul.appendChild(li);
			});

			menu.appendChild(ul);
			return menu;
		},

		closeSubmenusAbove(level) {
			document.querySelectorAll(`.xp-context-menu[data-level]`).forEach(m => {
				if (parseInt(m.dataset.level, 10) > level) {
					m.remove();
				}
			});
		},

		positionMenu(menu, x, y) {
			menu.style.left = '0px';
			menu.style.top = '0px';
			const rect = menu.getBoundingClientRect();
			let posX = x;
			let posY = y;

			if (posX + rect.width > window.innerWidth - 4) {
				posX = Math.max(4, window.innerWidth - rect.width - 4);
			}
			if (posY + rect.height > window.innerHeight - 34) {
				posY = Math.max(4, window.innerHeight - 34 - rect.height);
			}

			menu.style.left = `${Math.max(4, posX)}px`;
			menu.style.top = `${Math.max(4, posY)}px`;
		},

		positionSubMenu(subMenu, parentRect) {
			subMenu.style.left = '0px';
			subMenu.style.top = '0px';
			const rect = subMenu.getBoundingClientRect();

			let posX = parentRect.right - 2;
			let posY = parentRect.top - 2;

			if (posX + rect.width > window.innerWidth - 4) {
				posX = Math.max(4, parentRect.left - rect.width + 2);
			}
			if (posY + rect.height > window.innerHeight - 34) {
				posY = Math.max(4, window.innerHeight - 34 - rect.height);
			}

			subMenu.style.left = `${Math.max(4, posX)}px`;
			subMenu.style.top = `${Math.max(4, posY)}px`;
		},

		getDesktopItems(destPath = '/') {
			const hasClipboard = fs && fs.clipboard && fs.clipboard.element;
			const isHiddenShown = typeof isShowHiddenEnabled === 'function' ? isShowHiddenEnabled() : false;
			const currentFit = (window.SettingsApp && window.SettingsApp.get('wallpaperFit')) || 'cover';
			const currentTheme = (window.SettingsApp && window.SettingsApp.get('theme')) || 'luna-blue';

			return [
				{
					label: 'View',
					submenu: [
						{
							label: 'Large Icons',
							radio: (window.SettingsApp && window.SettingsApp.get('iconSize')) === 'large',
							action: () => {
								if (window.SettingsApp) window.SettingsApp.set('iconSize', 'large');
							}
						},
						{
							label: 'Medium Icons',
							radio: (window.SettingsApp && window.SettingsApp.get('iconSize')) === 'normal',
							action: () => {
								if (window.SettingsApp) window.SettingsApp.set('iconSize', 'normal');
							}
						},
						{
							label: 'Classic Small Icons',
							radio: (window.SettingsApp && window.SettingsApp.get('iconSize')) === 'small',
							action: () => {
								if (window.SettingsApp) window.SettingsApp.set('iconSize', 'small');
							}
						}
					]
				},
				{
					label: 'Arrange Icons By',
					submenu: [
						{
							label: 'Name',
							action: () => arrangeIcons('name')
						},
						{
							label: 'Size',
							action: () => arrangeIcons('type')
						},
						{
							label: 'Type',
							action: () => arrangeIcons('type')
						},
						{
							label: 'Modified Date',
							action: () => arrangeIcons('date')
						},
						{ separator: true },
						{
							label: 'Auto Arrange',
							checked: true,
							action: () => arrangeIcons('none')
						},
						{
							label: 'Align to Grid',
							checked: true,
							action: () => arrangeIcons('none')
						}
					]
				},
				{
					label: 'Refresh',
					shortcut: 'F5',
					icon: 'https://api.iconify.design/mdi/refresh.svg',
					action: () => refreshUI()
				},
				{ separator: true },
				{
					label: 'Paste',
					shortcut: 'Ctrl+V',
					disabled: !hasClipboard,
					action: () => {
						if (!fs.clipboard.element) return;
						const sourcePath = fs.clipboard.element.getFullPath();
						if (fs.clipboard.mode === 'cut') {
							fs.move(sourcePath, destPath);
							fs.clipboard.mode = null;
							fs.clipboard.element = null;
						} else {
							fs.copy(sourcePath, destPath);
						}
						refreshUI();
					}
				},
				{
					label: 'Paste Shortcut',
					disabled: !hasClipboard,
					action: () => {
						if (!fs.clipboard.element) return;
						const el = fs.clipboard.element;
						fs.create('Shortcut', destPath, `${el.name} - Shortcut`, {
							targetPath: el.getFullPath(),
							icon: el.icon
						});
						refreshUI();
					}
				},
				{ separator: true },
				{
					label: isHiddenShown ? 'Hide Hidden Items' : 'Show Hidden Items',
					checked: isHiddenShown,
					action: () => toggleShowHidden()
				},
				{
					label: 'New',
					submenu: [
						{
							label: 'Folder',
							icon: 'https://img.icons8.com/fluent/48/folder-invoices.png',
							action: () => {
								fs.create('Folder', destPath, 'New Folder');
								refreshUI();
							}
						},
						{
							label: 'Shortcut',
							icon: 'https://api.iconify.design/mdi/share-outline.svg',
							action: () => {
								fs.create('Shortcut', destPath, 'New Shortcut', {
									targetPath: '/',
									icon: 'https://img.icons8.com/fluent/48/folder-invoices.png'
								});
								refreshUI();
							}
						},
						{
							label: 'Text Document',
							icon: 'https://img.icons8.com/color/48/txt.png',
							action: () => {
								const newFile = fs.create('File', destPath, 'New Text Document.txt');
								refreshUI();
							}
						},
						{
							label: 'Wave Sound Document',
							icon: 'https://api.iconify.design/mdi/volume-high.svg',
							action: () => {
								fs.create('File', destPath, 'New Audio.wav');
								refreshUI();
							}
						}
					]
				},
				{ separator: true },
				{
					label: 'Display Properties',
					bold: true,
					icon: 'https://img.icons8.com/fluent/48/paint-palette.png',
					action: () => openDisplaySettings()
				}
			];
		},

		getFolderAreaItems(folder, win) {
			const destPath = folder.getFullPath();
			const hasClipboard = fs && fs.clipboard && fs.clipboard.element;

			return [
				{
					label: 'View',
					submenu: [
						{
							label: 'Icons',
							radio: (win.dataset.viewMode || 'icons') === 'icons',
							action: () => {
								win.dataset.viewMode = 'icons';
								renderFolderContent(folder, win.querySelector('.folder-content'), win);
							}
						},
						{
							label: 'Details',
							radio: win.dataset.viewMode === 'details',
							action: () => {
								win.dataset.viewMode = 'details';
								renderFolderContent(folder, win.querySelector('.folder-content'), win);
							}
						}
					]
				},
				{
					label: 'Arrange Icons By',
					submenu: [
						{
							label: 'Name',
							action: () => {
								renderFolderContent(folder, win.querySelector('.folder-content'), win);
							}
						},
						{
							label: 'Date',
							action: () => {
								renderFolderContent(folder, win.querySelector('.folder-content'), win);
							}
						},
						{
							label: 'Type',
							action: () => {
								renderFolderContent(folder, win.querySelector('.folder-content'), win);
							}
						}
					]
				},
				{
					label: 'Refresh',
					shortcut: 'F5',
					icon: 'https://api.iconify.design/mdi/refresh.svg',
					action: () => renderFolderContent(folder, win.querySelector('.folder-content'), win)
				},
				{ separator: true },
				{
					label: 'Paste',
					shortcut: 'Ctrl+V',
					disabled: !hasClipboard,
					action: () => {
						if (!fs.clipboard.element) return;
						const sourcePath = fs.clipboard.element.getFullPath();
						if (fs.clipboard.mode === 'cut') {
							fs.move(sourcePath, destPath);
							fs.clipboard.mode = null;
							fs.clipboard.element = null;
						} else {
							fs.copy(sourcePath, destPath);
						}
						refreshUI();
					}
				},
				{
					label: 'Paste Shortcut',
					disabled: !hasClipboard,
					action: () => {
						if (!fs.clipboard.element) return;
						const el = fs.clipboard.element;
						fs.create('Shortcut', destPath, `${el.name} - Shortcut`, {
							targetPath: el.getFullPath(),
							icon: el.icon
						});
						refreshUI();
					}
				},
				{
					label: 'Select All',
					shortcut: 'Ctrl+A',
					action: () => {
						const container = win.querySelector('.folder-content');
						if (container) {
							container.querySelectorAll('.project-icon').forEach(icon => {
								icon.classList.add('selected');
								selectedIcons.add(icon);
							});
							updateFolderUISelection(win);
						}
					}
				},
				{ separator: true },
				{
					label: 'New',
					submenu: [
						{
							label: 'Folder',
							icon: 'https://img.icons8.com/fluent/48/folder-invoices.png',
							action: () => {
								fs.create('Folder', destPath, 'New Folder');
								refreshUI();
							}
						},
						{
							label: 'Shortcut',
							action: () => {
								fs.create('Shortcut', destPath, 'New Shortcut', {
									targetPath: '/',
									icon: 'https://img.icons8.com/fluent/48/folder-invoices.png'
								});
								refreshUI();
							}
						},
						{
							label: 'Text Document',
							icon: 'https://img.icons8.com/color/48/txt.png',
							action: () => {
								fs.create('File', destPath, 'New Text Document.txt');
								refreshUI();
							}
						}
					]
				},
				{ separator: true },
				{
					label: 'Properties',
					bold: true,
					action: () => openElementInfoWindow(folder)
				}
			];
		},

		getIconItems(element, iconEl, winContext = null) {
			const isMultiple = selectedIcons.size > 1;
			const isProject = element instanceof ProjectFile;
			const isFolder = element instanceof Folder;
			const isFile = element instanceof File;
			const isShortcut = element instanceof Shortcut;

			const openAction = () => {
				if (isMultiple) {
					selectedIcons.forEach(icon => {
						const el = fs.findByPath(icon.dataset.path);
						if (el) openFileSystemElement(el, winContext);
					});
				} else {
					openFileSystemElement(element, winContext);
				}
			};

			const items = [
				{
					label: isFolder ? 'Open' : (isProject ? 'Open Project Details' : 'Open'),
					bold: true,
					action: openAction
				}
			];

			if (isFolder) {
				items.push({
					label: 'Explore',
					action: () => openFolderWindow(element)
				});
			}

			if (isProject && element.projectData && element.projectData.link) {
				items.push({
					label: 'Run Application',
					icon: 'https://api.iconify.design/mdi/play-box-outline.svg',
					action: () => {
						const p = element.projectData;
						const title = resolveProjectTitle(p.title);
						const appId = `app-running-${title.replace(/\s/g, '-')}-${Date.now()}`;
						const appContent = `<iframe src="${p.link}" style="width: 100%; height: 100%; border: none;"></iframe>`;
						const appWin = createXPWindow(appId, title, appContent, 800, 600, { iconSrc: p.icon });
						appWin.querySelector('.xp-window-content').style.padding = '0';
						appWin.querySelector('.xp-window-content').style.overflow = 'hidden';
					}
				});
			}

			items.push({ separator: true });

			items.push({
				label: 'Send To',
				submenu: [
					{
						label: 'Desktop (create shortcut)',
						action: () => {
							fs.create('Shortcut', '/', `${element.name} - Shortcut`, {
								targetPath: element.getFullPath(),
								icon: element.icon
							});
							refreshUI();
						}
					},
					{
						label: 'My Documents',
						action: () => {
							const pdfs = fs.root.getByName('PDFs');
							if (pdfs) {
								fs.copy(element.getFullPath(), pdfs.getFullPath());
								refreshUI();
							}
						}
					},
					{
						label: 'Mail Recipient',
						icon: 'https://api.iconify.design/mdi/email-outline.svg',
						action: () => {
							if (typeof openOutlookExpress === 'function') openOutlookExpress();
						}
					}
				]
			});

			items.push({ separator: true });

			items.push({
				label: 'Cut',
				shortcut: 'Ctrl+X',
				action: () => {
					fs.clipboard.mode = 'cut';
					fs.clipboard.element = element;
				}
			});

			items.push({
				label: 'Copy',
				shortcut: 'Ctrl+C',
				action: () => {
					fs.clipboard.mode = 'copy';
					fs.clipboard.element = element;
				}
			});

			items.push({ separator: true });

			items.push({
				label: 'Create Shortcut',
				action: () => {
					const parentPath = element.parent ? element.parent.getFullPath() : '/';
					fs.create('Shortcut', parentPath, `Shortcut to ${element.name}`, {
						targetPath: element.getFullPath(),
						icon: element.icon
					});
					refreshUI();
				}
			});

			items.push({
				label: 'Delete',
				shortcut: 'Del',
				icon: 'https://api.iconify.design/mdi/delete-outline.svg',
				action: () => {
					const count = selectedIcons.size;
					const message = count > 1
						? `Are you sure you want to move ${count} items to the Recycle Bin?`
						: `Are you sure you want to move '${element.name}' to the Recycle Bin?`;

					createConfirmationDialog(message, () => {
						if (count > 1) {
							selectedIcons.forEach(icon => {
								try {
									fs.moveToRecycleBin(icon.dataset.path);
								} catch (e) {}
							});
						} else {
							fs.moveToRecycleBin(element.getFullPath());
						}
						refreshUI();
					});
				}
			});

			items.push({
				label: 'Rename',
				shortcut: 'F2',
				disabled: isMultiple,
				action: () => startInlineRename(iconEl)
			});

			items.push({ separator: true });

			items.push({
				label: 'Properties',
				bold: true,
				action: () => openElementInfoWindow(element)
			});

			return items;
		},

		getTaskbarItems() {
			const isLocked = window.SettingsApp ? !!window.SettingsApp.get('taskbarLocked') : true;
			const isQuickLaunch = window.SettingsApp ? !!window.SettingsApp.get('quickLaunchVisible') : true;

			return [
				{
					label: 'Toolbars',
					submenu: [
						{
							label: 'Quick Launch',
							checked: isQuickLaunch,
							action: () => {
								if (window.SettingsApp) window.SettingsApp.set('quickLaunchVisible', !isQuickLaunch);
							}
						}
					]
				},
				{ separator: true },
				{
					label: 'Cascade Windows',
					action: () => {
						if (window.Taskbar && window.Taskbar.cascadeWindows) window.Taskbar.cascadeWindows();
					}
				},
				{
					label: 'Tile Windows Horizontally',
					action: () => {
						if (window.Taskbar && window.Taskbar.tileWindows) window.Taskbar.tileWindows(true);
					}
				},
				{
					label: 'Tile Windows Vertically',
					action: () => {
						if (window.Taskbar && window.Taskbar.tileWindows) window.Taskbar.tileWindows(false);
					}
				},
				{
					label: 'Show the Desktop',
					action: () => {
						if (window.Taskbar && window.Taskbar.showDesktop) window.Taskbar.showDesktop();
					}
				},
				{ separator: true },
				{
					label: 'Task Manager',
					action: () => {
						if (window.SettingsApp) window.SettingsApp.open('system');
					}
				},
				{ separator: true },
				{
					label: 'Lock the Taskbar',
					checked: isLocked,
					action: () => {
						if (window.SettingsApp) window.SettingsApp.set('taskbarLocked', !isLocked);
					}
				},
				{
					label: 'Properties',
					bold: true,
					action: () => {
						if (window.SettingsApp) window.SettingsApp.open('taskbar');
					}
				}
			];
		},

		getTaskbarButtonItems(id) {
			const win = document.getElementById(id);
			if (!win) return [];
			const isMin = win.classList.contains('minimized');
			const isMax = win.classList.contains('maximized');

			return [
				{
					label: 'Restore',
					bold: isMin,
					disabled: !isMin && !isMax,
					action: () => {
						if (isMin && typeof unminimizeWindow === 'function') unminimizeWindow(win);
						else if (isMax && typeof maximizeWindow === 'function') maximizeWindow(win);
						if (typeof bringWindowToFront === 'function') bringWindowToFront(win);
					}
				},
				{
					label: 'Move',
					disabled: isMax || isMin,
					action: () => {
						if (typeof bringWindowToFront === 'function') bringWindowToFront(win);
					}
				},
				{
					label: 'Size',
					disabled: isMax || isMin,
					action: () => {
						if (typeof bringWindowToFront === 'function') bringWindowToFront(win);
					}
				},
				{
					label: 'Minimize',
					disabled: isMin,
					action: () => {
						if (typeof minimizeWindow === 'function') minimizeWindow(win, id);
					}
				},
				{
					label: 'Maximize',
					disabled: isMax,
					action: () => {
						if (!isMax && typeof maximizeWindow === 'function') maximizeWindow(win);
						if (typeof bringWindowToFront === 'function') bringWindowToFront(win);
					}
				},
				{ separator: true },
				{
					label: 'Close',
					bold: true,
					shortcut: 'Alt+F4',
					action: () => {
						if (typeof closeWindow === 'function') closeWindow(win, id);
					}
				}
			];
		}
	};

	document.addEventListener('DOMContentLoaded', () => {
		ContextMenu.init();
	});

	window.ContextMenu = ContextMenu;
})();
