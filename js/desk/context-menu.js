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

				if (item.checked) {
					const check = document.createElement('span');
					check.className = 'xp-menu-check';
					check.textContent = '✓';
					li.appendChild(check);
				} else if (item.radio) {
					const radio = document.createElement('span');
					radio.className = 'xp-menu-check';
					radio.textContent = '●';
					li.appendChild(radio);
				} else if (item.icon) {
					const iconContainer = document.createElement('span');
					iconContainer.className = 'xp-menu-icon';
					const img = document.createElement('img');
					img.src = item.icon;
					img.alt = '';
					iconContainer.appendChild(img);
					li.appendChild(iconContainer);
				}

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

					li.addEventListener('mouseleave', () => {
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
							icon: '../assets/images/desk/icons/Folder Closed.webp',
							action: () => {
								fs.create('Folder', destPath, 'New Folder');
								refreshUI();
							}
						},
						{
							label: 'Shortcut',
							icon: '../assets/images/desk/icons/Folder Closed.webp',
							action: () => {
								fs.create('Shortcut', destPath, 'New Shortcut', {
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
								fs.create('File', destPath, 'New Text Document.txt');
								refreshUI();
							}
						},
						{
							label: 'Wave Sound Document',
							icon: '../assets/images/desk/icons/Music File.webp',
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
					icon: '../assets/images/desk/icons/Display.webp',
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
							action: () => renderFolderContent(folder, win.querySelector('.folder-content'), win)
						},
						{
							label: 'Date',
							action: () => renderFolderContent(folder, win.querySelector('.folder-content'), win)
						},
						{
							label: 'Type',
							action: () => renderFolderContent(folder, win.querySelector('.folder-content'), win)
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
							icon: '../assets/images/desk/icons/Folder Closed.webp',
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
									icon: '../assets/images/desk/icons/Folder Closed.webp'
								});
								refreshUI();
							}
						},
						{
							label: 'Text Document',
							icon: '../assets/images/desk/icons/File.webp',
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
			const isImage = isFile && /\.(png|jpe?g|bmp|webp|gif)$/i.test(element.name);

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

			const isBat = isFile && (element.name.toLowerCase().endsWith('.bat') || element.name.toLowerCase().endsWith('.cmd'));

			const items = [
				{
					label: isFolder ? 'Open' : (isImage ? 'Edit with Paint' : (isProject ? 'Open Project Details' : 'Open')),
					bold: true,
					icon: isImage ? '../assets/images/desk/icons/Paint.webp' : null,
					action: openAction
				}
			];

			if (isImage) {
				items.push({
					label: 'Set as Desktop Background',
					submenu: [
						{
							label: 'Stretch / Cover',
							action: () => {
								if (typeof setImageAsWallpaper === 'function') setImageAsWallpaper(element.content, 'cover');
							}
						},
						{
							label: 'Tile',
							action: () => {
								if (typeof setImageAsWallpaper === 'function') setImageAsWallpaper(element.content, 'tile');
							}
						},
						{
							label: 'Center',
							action: () => {
								if (typeof setImageAsWallpaper === 'function') setImageAsWallpaper(element.content, 'center');
							}
						}
					]
				});
			}

			if (isFile || isProject) {
				items.push({
					label: 'Save to Local Disk (Download)...',
					icon: 'https://api.iconify.design/mdi/download.svg?color=%231b4b9b',
					action: () => {
						if (typeof downloadFileSystemElement === 'function') {
							downloadFileSystemElement(element);
						}
					}
				});
			}

			if (isBat) {
				items.push({
					label: 'Edit',
					icon: '../assets/images/desk/icons/Notepad.webp',
					action: () => {
						if (window.NotepadApp) {
							window.NotepadApp.open(element);
						}
					}
				});
			}

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
				label: 'Pin to Quick Launch',
				icon: 'https://api.iconify.design/mdi/pin-outline.svg?color=%231b4b9b',
				action: () => {
					if (window.Taskbar && window.Taskbar.addQuickLaunchItem) {
						window.Taskbar.addQuickLaunchItem({
							name: element.name,
							icon: element.icon,
							action: 'open-path',
							path: element.getFullPath()
						});
					}
				}
			});

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
						label: 'Quick Launch',
						action: () => {
							if (window.Taskbar && window.Taskbar.addQuickLaunchItem) {
								window.Taskbar.addQuickLaunchItem({
									name: element.name,
									icon: element.icon,
									action: 'open-path',
									path: element.getFullPath()
								});
							}
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

		getSystemIconItems(type) {
			if (type === 'my-computer') {
				return [
					{
						label: 'Open',
						bold: true,
						action: () => {
							if (window.DeskAPI && window.DeskAPI.openMyComputer) window.DeskAPI.openMyComputer();
						}
					},
					{
						label: 'Explore',
						action: () => {
							if (window.DeskAPI && window.DeskAPI.openMyComputer) window.DeskAPI.openMyComputer();
						}
					},
					{
						label: 'Search...',
						icon: 'https://api.iconify.design/mdi/magnify.svg',
						action: () => {
							if (window.DeskAPI && window.DeskAPI.openSearch) window.DeskAPI.openSearch('');
						}
					},
					{ separator: true },
					{
						label: 'Manage',
						action: () => {
							if (window.SettingsApp) window.SettingsApp.open('system');
						}
					},
					{ separator: true },
					{
						label: 'Create Shortcut',
						action: () => {
							if (typeof showXPDialog === 'function') showXPDialog('Shortcut', 'Shortcut already placed on Desktop.', 'info');
						}
					},
					{ separator: true },
					{
						label: 'Properties',
						bold: true,
						action: () => {
							if (window.SettingsApp) window.SettingsApp.open('system');
						}
					}
				];
			}

			if (type === 'recycle-bin') {
				const recycleCount = (typeof fs !== 'undefined' && fs.loadRecycleBinItems) ? fs.loadRecycleBinItems().length : 0;
				return [
					{
						label: 'Open',
						bold: true,
						action: () => {
							if (typeof openRecycleBinWindow === 'function') openRecycleBinWindow();
						}
					},
					{
						label: 'Explore',
						action: () => {
							if (typeof openRecycleBinWindow === 'function') openRecycleBinWindow();
						}
					},
					{
						label: 'Empty Recycle Bin',
						disabled: recycleCount === 0,
						icon: 'https://api.iconify.design/mdi/delete-sweep-outline.svg',
						action: () => {
							if (recycleCount === 0) return;
							createConfirmationDialog(`Are you sure you want to permanently delete all ${recycleCount} items?`, () => {
								if (typeof fs !== 'undefined' && fs.emptyRecycleBin) fs.emptyRecycleBin();
								if (window.SettingsApp && window.SettingsApp.playSound) window.SettingsApp.playSound('recycle');
								refreshUI();
							});
						}
					},
					{ separator: true },
					{
						label: 'Create Shortcut',
						action: () => {
							if (typeof showXPDialog === 'function') showXPDialog('Shortcut', 'Shortcut already exists.', 'info');
						}
					},
					{ separator: true },
					{
						label: 'Properties',
						bold: true,
						action: () => {
							if (window.SettingsApp) window.SettingsApp.open('system');
						}
					}
				];
			}

			return [];
		},

		getStartButtonItems() {
			return [
				{
					label: 'Open',
					bold: true,
					action: () => {
						if (window.StartMenu) window.StartMenu.open();
					}
				},
				{
					label: 'Explore',
					action: () => {
						if (typeof openAllProjectsFolder === 'function') openAllProjectsFolder();
					}
				},
				{
					label: 'Search...',
					icon: 'https://api.iconify.design/mdi/magnify.svg',
					action: () => {
						if (window.DeskAPI && window.DeskAPI.openSearch) window.DeskAPI.openSearch('');
					}
				},
				{ separator: true },
				{
					label: 'Properties',
					action: () => {
						if (window.SettingsApp) window.SettingsApp.open('taskbar');
					}
				}
			];
		},

		getQuickLaunchBarItems() {
			const isLocked = window.SettingsApp ? !!window.SettingsApp.get('taskbarLocked') : true;

			return [
				{
					label: 'Open Quick Launch Folder',
					action: () => {
						if (typeof openFolderWindow === 'function' && typeof fs !== 'undefined') {
							openFolderWindow(fs.root);
						}
					}
				},
				{
					label: 'Reset Default Quick Launch Icons',
					action: () => {
						if (window.Taskbar && window.Taskbar.resetQuickLaunchDefaults) {
							window.Taskbar.resetQuickLaunchDefaults();
						}
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

		getQuickLaunchItemItems(itemId, appName, itemData = null, itemIndex = 0) {
			const items = [];
			const qlList = (window.Taskbar && window.Taskbar.getQuickLaunchItems) ? window.Taskbar.getQuickLaunchItems() : [];

			items.push({
				label: `Open ${appName}`,
				bold: true,
				action: () => {
					const el = document.getElementById(itemId);
					if (el) el.click();
				}
			});

			items.push({ separator: true });

			if (itemIndex > 0) {
				items.push({
					label: 'Move Left',
					icon: 'https://api.iconify.design/mdi/arrow-left.svg?color=%231b4b9b',
					action: () => {
						if (window.Taskbar && window.Taskbar.moveQuickLaunchItem) {
							window.Taskbar.moveQuickLaunchItem(itemIndex, itemIndex - 1);
						}
					}
				});
			}

			if (itemIndex < qlList.length - 1) {
				items.push({
					label: 'Move Right',
					icon: 'https://api.iconify.design/mdi/arrow-right.svg?color=%231b4b9b',
					action: () => {
						if (window.Taskbar && window.Taskbar.moveQuickLaunchItem) {
							window.Taskbar.moveQuickLaunchItem(itemIndex, itemIndex + 1);
						}
					}
				});
			}

			items.push({
				label: 'Remove from Quick Launch',
				icon: 'https://api.iconify.design/mdi/delete-outline.svg?color=%23cc3333',
				action: () => {
					if (window.Taskbar && window.Taskbar.removeQuickLaunchItem) {
						window.Taskbar.removeQuickLaunchItem(itemId);
					}
				}
			});

			items.push({ separator: true });

			items.push({
				label: 'Properties',
				action: () => {
					if (itemData && itemData.path && typeof fs !== 'undefined') {
						const el = fs.findByPath(itemData.path);
						if (el) {
							openElementInfoWindow(el);
							return;
						}
					}
					if (window.SettingsApp) window.SettingsApp.open('taskbar');
				}
			});

			return items;
		},

		getTrayItems(trayId) {
			if (trayId === 'volume') {
				const isMuted = window.SettingsApp ? !window.SettingsApp.get('soundEnabled') : false;
				return [
					{
						label: 'Open Volume Control',
						bold: true,
						action: () => {
							if (window.SettingsApp) window.SettingsApp.open('audio');
						}
					},
					{
						label: 'Adjust Audio Properties',
						action: () => {
							if (window.SettingsApp) window.SettingsApp.open('audio');
						}
					},
					{ separator: true },
					{
						label: 'Mute Master Audio',
						checked: isMuted,
						action: () => {
							if (window.SettingsApp) window.SettingsApp.set('soundEnabled', isMuted);
						}
					}
				];
			}

			if (trayId === 'security') {
				return [
					{
						label: 'Open Windows Security Center',
						bold: true,
						action: () => {
							if (window.Taskbar && window.Taskbar.showSecurityAlertsPopup) window.Taskbar.showSecurityAlertsPopup();
						}
					},
					{ separator: true },
					{
						label: 'Security Settings...',
						action: () => {
							if (window.SettingsApp) window.SettingsApp.open('system');
						}
					}
				];
			}

			if (trayId === 'hardware') {
				return [
					{
						label: 'Safely Remove USB Mass Storage Device',
						bold: true,
						action: () => {
							if (window.Taskbar && window.Taskbar.showSafelyRemoveHardwareDialog) window.Taskbar.showSafelyRemoveHardwareDialog();
						}
					},
					{ separator: true },
					{
						label: 'Hardware Properties...',
						action: () => {
							if (window.SettingsApp) window.SettingsApp.open('system');
						}
					}
				];
			}

			if (trayId === 'update') {
				return [
					{
						label: 'Check for Updates Now',
						bold: true,
						action: () => {
							if (window.Taskbar && window.Taskbar.showWindowsUpdateDialog) window.Taskbar.showWindowsUpdateDialog();
						}
					},
					{ separator: true },
					{
						label: 'Automatic Updates Settings...',
						action: () => {
							if (window.SettingsApp) window.SettingsApp.open('system');
						}
					}
				];
			}

			if (trayId === 'power') {
				return [
					{
						label: 'Power Meter',
						bold: true,
						action: () => {
							if (window.Taskbar && window.Taskbar.showPowerMeterPopup) window.Taskbar.showPowerMeterPopup();
						}
					},
					{ separator: true },
					{
						label: 'Adjust Power Properties...',
						action: () => {
							if (window.SettingsApp) window.SettingsApp.open('system');
						}
					}
				];
			}

			if (trayId === 'lang') {
				const currentLang = (window.SettingsApp && window.SettingsApp.get('systemLanguage')) || 'EN';
				return [
					{
						label: 'English (United States)',
						radio: currentLang === 'EN',
						action: () => {
							if (window.SettingsApp) window.SettingsApp.set('systemLanguage', 'EN');
							if (window.Taskbar && window.Taskbar.renderSystemTray) window.Taskbar.renderSystemTray();
						}
					},
					{
						label: 'Français (France)',
						radio: currentLang === 'FR',
						action: () => {
							if (window.SettingsApp) window.SettingsApp.set('systemLanguage', 'FR');
							if (window.Taskbar && window.Taskbar.renderSystemTray) window.Taskbar.renderSystemTray();
						}
					}
				];
			}

			if (trayId === 'network') {
				return [
					{
						label: 'Status',
						bold: true,
						action: () => {
							if (window.Taskbar && window.Taskbar.showNetworkStatusDialog) {
								window.Taskbar.showNetworkStatusDialog();
							}
						}
					},
					{
						label: 'Repair',
						action: () => {
							if (typeof showXPDialog === 'function') {
								showXPDialog('Network Repair', 'Windows has renewed the IP address and cleared DNS caches.', 'info');
							}
						}
					},
					{ separator: true },
					{
						label: 'Open Network Connections',
						action: () => {
							if (window.DeskAPI && window.DeskAPI.openNetworkPlaces) window.DeskAPI.openNetworkPlaces();
						}
					}
				];
			}

			if (trayId === 'clippy') {
				const isEnabled = window.SettingsApp ? !!window.SettingsApp.get('clippyEnabled') : true;
				return [
					{
						label: 'Animate Assistant',
						bold: true,
						action: () => {
							if (window.ClippyAgent && window.ClippyAgent.showTip) window.ClippyAgent.showTip();
						}
					},
					{
						label: 'Options & Frequency',
						action: () => {
							if (window.SettingsApp) window.SettingsApp.open('taskbar');
						}
					},
					{ separator: true },
					{
						label: isEnabled ? 'Hide Clippy' : 'Show Clippy',
						action: () => {
							if (window.SettingsApp) window.SettingsApp.set('clippyEnabled', !isEnabled);
						}
					}
				];
			}

			if (trayId === 'clock') {
				return [
					{
						label: 'Adjust Date/Time',
						bold: true,
						action: () => {
							const calendarPopup = document.getElementById('calendar-popup');
							if (calendarPopup) {
								if (typeof renderCalendar === 'function' && typeof currentCalendarDate !== 'undefined') {
									renderCalendar(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth());
								}
								calendarPopup.classList.remove('hidden');
							}
						}
					},
					{
						label: 'Customize Notifications...',
						action: () => {
							if (window.SettingsApp) window.SettingsApp.open('taskbar');
						}
					}
				];
			}

			return [];
		},

		getWindowHeaderItems(win, id) {
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
		},

		getEditorItems(editorElement, isReadOnly = false) {
			return [
				{
					label: 'Undo',
					shortcut: 'Ctrl+Z',
					disabled: isReadOnly,
					action: () => {
						document.execCommand('undo');
					}
				},
				{ separator: true },
				{
					label: 'Cut',
					shortcut: 'Ctrl+X',
					disabled: isReadOnly,
					action: () => {
						document.execCommand('cut');
					}
				},
				{
					label: 'Copy',
					shortcut: 'Ctrl+C',
					action: () => {
						document.execCommand('copy');
					}
				},
				{
					label: 'Paste',
					shortcut: 'Ctrl+V',
					disabled: isReadOnly,
					action: () => {
						document.execCommand('paste');
					}
				},
				{
					label: 'Delete',
					shortcut: 'Del',
					disabled: isReadOnly,
					action: () => {
						document.execCommand('delete');
					}
				},
				{ separator: true },
				{
					label: 'Select All',
					shortcut: 'Ctrl+A',
					action: () => {
						if (editorElement && typeof editorElement.select === 'function') {
							editorElement.select();
						} else {
							document.execCommand('selectAll');
						}
					}
				}
			];
		},

		getIEAreaItems(url = '') {
			return [
				{
					label: 'Back',
					icon: 'https://api.iconify.design/mdi/arrow-left.svg',
					action: () => {
						const iframe = document.getElementById('ie-iframe');
						if (iframe && iframe.contentWindow) iframe.contentWindow.history.back();
					}
				},
				{
					label: 'Forward',
					icon: 'https://api.iconify.design/mdi/arrow-right.svg',
					action: () => {
						const iframe = document.getElementById('ie-iframe');
						if (iframe && iframe.contentWindow) iframe.contentWindow.history.forward();
					}
				},
				{ separator: true },
				{
					label: 'Set as Desktop Background',
					action: () => {
						if (window.SettingsApp && url) window.SettingsApp.set('desktopBackground', url);
					}
				},
				{
					label: 'Copy Background',
					action: () => {
						navigator.clipboard.writeText(url);
					}
				},
				{ separator: true },
				{
					label: 'Select All',
					shortcut: 'Ctrl+A',
					action: () => {
						document.execCommand('selectAll');
					}
				},
				{
					label: 'Refresh',
					shortcut: 'F5',
					action: () => {
						const iframe = document.getElementById('ie-iframe');
						if (iframe && iframe.contentWindow) iframe.contentWindow.location.reload();
					}
				},
				{ separator: true },
				{
					label: 'Properties',
					action: () => {
						if (typeof showXPDialog === 'function') {
							showXPDialog('Properties', `Address: ${url || 'about:home'}\nType: HTML Document\nZone: Internet Zone`, 'info');
						}
					}
				}
			];
		},

		getWallpaperCardItems(item) {
			return [
				{
					label: 'Set as Desktop Background',
					bold: true,
					action: () => {
						if (window.SettingsApp && item.path) window.SettingsApp.set('desktopBackground', item.path);
					}
				},
				{
					label: 'Preview',
					action: () => {
						if (typeof createXPWindow === 'function') {
							createXPWindow(`wp-preview-${item.id}`, item.name, `<img src="${item.path}" style="width:100%;height:100%;object-fit:contain;">`, 600, 420);
						}
					}
				},
				{ separator: true },
				{
					label: 'Properties',
					action: () => {
						if (typeof showXPDialog === 'function') {
							showXPDialog(item.name, `File: ${item.filename}\nType: WEBP Image\nLocation: C:\\WINDOWS\\Web\\Wallpaper`, 'info');
						}
					}
				}
			];
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
