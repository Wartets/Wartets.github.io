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
			const newTemplates = window.ShellAssociations ? window.ShellAssociations.getNewFileTemplates() : [];

			const newSubmenu = [
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
				{ separator: true }
			];

			newTemplates.forEach(tpl => {
				newSubmenu.push({
					label: tpl.label,
					icon: window.ShellAssociations ? window.ShellAssociations.getIcon({ name: tpl.defaultName }) : '../assets/images/desk/icons/File.webp',
					action: () => {
						fs.create('File', destPath, tpl.defaultName, { content: tpl.content });
						refreshUI();
					}
				});
			});

			return [
				{
					label: 'View',
					submenu: [
						{
							label: 'Extra Large Icons',
							radio: (window.SettingsApp && window.SettingsApp.get('iconSize')) === 'xlarge',
							action: () => {
								if (window.SettingsApp) window.SettingsApp.set('iconSize', 'xlarge');
							}
						},
						{
							label: 'Large Icons',
							radio: (window.SettingsApp && window.SettingsApp.get('iconSize')) === 'large',
							action: () => {
								if (window.SettingsApp) window.SettingsApp.set('iconSize', 'large');
							}
						},
						{
							label: 'Medium Icons (Normal)',
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
						},
						{ separator: true },
						{
							label: 'Show Desktop Icons',
							checked: (window.SettingsApp && window.SettingsApp.get('showDesktopIcons') !== false),
							action: () => {
								if (window.SettingsApp) {
									const curr = window.SettingsApp.get('showDesktopIcons') !== false;
									window.SettingsApp.set('showDesktopIcons', !curr);
								}
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
							action: () => arrangeIcons('size')
						},
						{
							label: 'Item Type',
							action: () => arrangeIcons('type')
						},
						{
							label: 'Modified Date',
							action: () => arrangeIcons('date')
						},
						{ separator: true },
						{
							label: 'Auto Arrange',
							checked: typeof isAutoArrangeEnabled === 'function' ? isAutoArrangeEnabled() : false,
							action: () => {
								if (typeof toggleAutoArrange === 'function') toggleAutoArrange();
							}
						},
						{
							label: 'Align to Grid',
							checked: typeof isAlignToGridEnabled === 'function' ? isAlignToGridEnabled() : true,
							action: () => {
								if (typeof toggleAlignToGrid === 'function') toggleAlignToGrid();
							}
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
				{
					label: 'Undo Move',
					shortcut: 'Ctrl+Z',
					disabled: !fs || fs.undoStack.length === 0,
					action: () => {
						if (fs && fs.undo()) refreshUI();
					}
				},
				{ separator: true },
				{
					label: isHiddenShown ? 'Hide Hidden Files' : 'Show Hidden Files',
					checked: isHiddenShown,
					action: () => toggleShowHidden()
				},
				{
					label: 'New',
					submenu: newSubmenu
				},
				{ separator: true },
				{
					label: 'Next Desktop Background',
					action: async () => {
						if (typeof fetchWallpaperRegistry === 'function') {
							const list = await fetchWallpaperRegistry();
							if (list && list.length > 0) {
								const curr = localStorage.getItem('desktopBackground');
								const idx = list.findIndex(w => w.path === curr);
								const next = list[(idx + 1) % list.length];
								if (next && window.SettingsApp) {
									window.SettingsApp.set('desktopBackground', next.path);
								}
							}
						}
					}
				},
				{
					label: 'Properties',
					bold: true,
					icon: '../assets/images/desk/icons/Display.webp',
					action: () => openDisplaySettings()
				}
			];
		},

		getRecycleBinAreaItems(win) {
			const recycleItems = (typeof fs !== 'undefined' && fs) ? fs.loadRecycleBinItems() : [];
			const state = win.explorerState;

			return [
				{
					label: 'View',
					submenu: [
						{
							label: 'Thumbnails',
							radio: state.viewMode === 'thumbnails',
							action: () => {
								state.viewMode = 'thumbnails';
								if (window.FileExplorer) window.FileExplorer.updateView(win, true);
							}
						},
						{
							label: 'Tiles',
							radio: state.viewMode === 'tiles',
							action: () => {
								state.viewMode = 'tiles';
								if (window.FileExplorer) window.FileExplorer.updateView(win, true);
							}
						},
						{
							label: 'Icons',
							radio: state.viewMode === 'icons',
							action: () => {
								state.viewMode = 'icons';
								if (window.FileExplorer) window.FileExplorer.updateView(win, true);
							}
						},
						{
							label: 'List',
							radio: state.viewMode === 'list',
							action: () => {
								state.viewMode = 'list';
								if (window.FileExplorer) window.FileExplorer.updateView(win, true);
							}
						},
						{
							label: 'Details',
							radio: state.viewMode === 'details',
							action: () => {
								state.viewMode = 'details';
								if (window.FileExplorer) window.FileExplorer.updateView(win, true);
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
								state.sortBy = 'name';
								if (window.FileExplorer) window.FileExplorer.updateView(win, true);
							}
						},
						{
							label: 'Original Location',
							action: () => {
								state.sortBy = 'location';
								if (window.FileExplorer) window.FileExplorer.updateView(win, true);
							}
						},
						{
							label: 'Date Deleted',
							action: () => {
								state.sortBy = 'deleted';
								if (window.FileExplorer) window.FileExplorer.updateView(win, true);
							}
						},
						{
							label: 'Size',
							action: () => {
								state.sortBy = 'size';
								if (window.FileExplorer) window.FileExplorer.updateView(win, true);
							}
						},
						{
							label: 'Item Type',
							action: () => {
								state.sortBy = 'type';
								if (window.FileExplorer) window.FileExplorer.updateView(win, true);
							}
						}
					]
				},
				{
					label: 'Refresh',
					shortcut: 'F5',
					icon: 'https://api.iconify.design/mdi/refresh.svg',
					action: () => {
						if (window.FileExplorer) window.FileExplorer.updateView(win, true);
					}
				},
				{ separator: true },
				{
					label: 'Empty Recycle Bin',
					disabled: recycleItems.length === 0,
					icon: 'https://api.iconify.design/mdi/delete-sweep-outline.svg',
					action: () => {
						if (recycleItems.length === 0) return;
						if (typeof createConfirmationDialog === 'function') {
							createConfirmationDialog(`Are you sure you want to permanently delete all ${recycleItems.length} items?`, () => {
								if (fs) fs.emptyRecycleBin();
								if (typeof refreshUI === 'function') refreshUI();
							});
						}
					}
				},
				{
					label: 'Paste',
					disabled: true
				},
				{ separator: true },
				{
					label: 'Properties',
					bold: true,
					action: () => {
						if (typeof showXPDialog === 'function') {
							showXPDialog('Recycle Bin Properties', `Recycle Bin is located on Local Disk (C:).\nCurrent items in bin: ${recycleItems.length}`, 'info');
						}
					}
				}
			];
		},

		getRecycleBinItemItems(item, iconEl, winContext = null) {
			return [
				{
					label: 'Restore',
					bold: true,
					action: () => {
						if (fs) {
							fs.restoreFromRecycleBin(item.uid);
							if (typeof refreshUI === 'function') refreshUI();
						}
					}
				},
				{
					label: 'Cut',
					disabled: true
				},
				{
					label: 'Delete Permanently',
					icon: 'https://api.iconify.design/mdi/delete-outline.svg',
					action: () => {
						if (typeof createConfirmationDialog === 'function') {
							createConfirmationDialog(`Are you sure you want to permanently delete '${item.name}'?`, () => {
								if (fs) fs.deletePermanentlyFromRecycleBin(item.uid);
								if (typeof refreshUI === 'function') refreshUI();
							});
						}
					}
				},
				{ separator: true },
				{
					label: 'Properties',
					action: () => {
						if (typeof showXPDialog === 'function') {
							showXPDialog(`${item.name} Properties`, `File: ${item.name}\nOriginal location: ${item.originalPath}\nDate Deleted: ${new Date(item.deletedAt).toLocaleString()}\nSize: ${Math.ceil((item.size || 0) / 1024)} KB\nType: ${item.type}`, 'info');
						}
					}
				}
			];
		},

		getFolderAreaItems(folder, win) {
			if (win && win.explorerState && win.explorerState.isRecycleBin) {
				return this.getRecycleBinAreaItems(win);
			}
			const destPath = folder.getFullPath();
			const hasClipboard = fs && fs.clipboard && fs.clipboard.element;

			return [
				{
					label: 'View',
					submenu: [
						{
							label: 'Thumbnails',
							radio: win.explorerState?.viewMode === 'thumbnails',
							action: () => {
								if (win.explorerState && window.FileExplorer) {
									win.explorerState.viewMode = 'thumbnails';
									window.FileExplorer.updateView(win, true);
								}
							}
						},
						{
							label: 'Tiles',
							radio: win.explorerState?.viewMode === 'tiles',
							action: () => {
								if (win.explorerState && window.FileExplorer) {
									win.explorerState.viewMode = 'tiles';
									window.FileExplorer.updateView(win, true);
								}
							}
						},
						{
							label: 'Icons',
							radio: (win.explorerState?.viewMode || 'icons') === 'icons',
							action: () => {
								if (win.explorerState && window.FileExplorer) {
									win.explorerState.viewMode = 'icons';
									window.FileExplorer.updateView(win, true);
								}
							}
						},
						{
							label: 'List',
							radio: win.explorerState?.viewMode === 'list',
							action: () => {
								if (win.explorerState && window.FileExplorer) {
									win.explorerState.viewMode = 'list';
									window.FileExplorer.updateView(win, true);
								}
							}
						},
						{
							label: 'Details',
							radio: win.explorerState?.viewMode === 'details',
							action: () => {
								if (win.explorerState && window.FileExplorer) {
									win.explorerState.viewMode = 'details';
									window.FileExplorer.updateView(win, true);
								}
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
								if (win.explorerState && window.FileExplorer) {
									win.explorerState.sortBy = 'name';
									window.FileExplorer.updateView(win, true);
								}
							}
						},
						{
							label: 'Date',
							action: () => {
								if (win.explorerState && window.FileExplorer) {
									win.explorerState.sortBy = 'date';
									window.FileExplorer.updateView(win, true);
								}
							}
						},
						{
							label: 'Type',
							action: () => {
								if (win.explorerState && window.FileExplorer) {
									win.explorerState.sortBy = 'type';
									window.FileExplorer.updateView(win, true);
								}
							}
						},
						{
							label: 'Size',
							action: () => {
								if (win.explorerState && window.FileExplorer) {
									win.explorerState.sortBy = 'size';
									window.FileExplorer.updateView(win, true);
								}
							}
						}
					]
				},
				{
					label: 'Refresh',
					shortcut: 'F5',
					icon: 'https://api.iconify.design/mdi/refresh.svg',
					action: () => {
						if (win.explorerState && window.FileExplorer) {
							window.FileExplorer.updateView(win, true);
						}
					}
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
							const items = container.querySelectorAll('.project-icon, .xp-explorer-item, .xp-details-row');
							items.forEach(icon => {
								icon.classList.add('selected');
								selectedIcons.add(icon);
								if (win.explorerState && win.explorerState.selectedItems) {
									win.explorerState.selectedItems.add(icon);
								}
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
			if (winContext && winContext.explorerState && winContext.explorerState.isRecycleBin) {
				return this.getRecycleBinItemItems(element, iconEl, winContext);
			}
			const isMultiple = selectedIcons.size > 1;
			const isProject = element instanceof ProjectFile;
			const isFolder = element instanceof Folder;
			const isShortcut = element instanceof Shortcut;
			const isFile = element instanceof File;
			const isImage = isFile && /\.(png|jpe?g|bmp|webp|gif)$/i.test(element.name);
			const isZip = isFile && /\.zip$/i.test(element.name);
			const isBat = isFile && (element.name.toLowerCase().endsWith('.bat') || element.name.toLowerCase().endsWith('.cmd'));

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

			const items = [];

			if (isFolder) {
				items.push({
					label: 'Open',
					bold: true,
					action: openAction
				});
				items.push({
					label: 'Explore',
					action: () => openFolderWindow(element)
				});
				items.push({
					label: 'Search...',
					icon: 'https://api.iconify.design/mdi/magnify.svg',
					action: () => {
						if (window.DeskAPI && window.DeskAPI.openSearch) window.DeskAPI.openSearch('');
					}
				});
			} else if (isProject) {
				items.push({
					label: 'Open Project Details',
					bold: true,
					action: openAction
				});
				if (element.projectData && element.projectData.link) {
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
			} else if (isShortcut) {
				items.push({
					label: 'Open',
					bold: true,
					action: openAction
				});
				items.push({
					label: 'Open File Location',
					action: () => {
						const resolved = element.resolve();
						if (resolved && resolved.parent) {
							openFolderWindow(resolved.parent);
						}
					}
				});
			} else if (isZip) {
				items.push({
					label: 'Extract All...',
					bold: true,
					icon: '../assets/images/desk/icons/Folder Open.webp',
					action: () => {
						fs.extractZip(element.getFullPath(), element.parent ? element.parent.getFullPath() : '/');
						refreshUI();
					}
				});
				items.push({
					label: 'Open',
					action: openAction
				});
			} else {
				items.push({
					label: isImage ? 'Preview / Edit' : 'Open',
					bold: true,
					action: openAction
				});

				if (isBat) {
					items.push({
						label: 'Edit',
						icon: '../assets/images/desk/icons/Notepad.webp',
						action: () => {
							if (window.NotepadApp) window.NotepadApp.open(element);
						}
					});
				}
			}

			if (isFile) {
				const openWithHandlers = window.ShellAssociations ? window.ShellAssociations.getOpenWithHandlers(element, winContext) : [];
				if (openWithHandlers.length > 0) {
					items.push({
						label: 'Open With',
						submenu: openWithHandlers.map(h => ({
							label: h.name,
							icon: h.icon,
							action: h.action
						}))
					});
				}
			}

			if (isImage) {
				items.push({
					label: 'Set as Desktop Background',
					icon: '../assets/images/desk/icons/Display.webp',
					submenu: [
						{
							label: 'Stretch / Cover',
							action: () => {
								if (typeof setImageAsWallpaper === 'function') setImageAsWallpaper(element.content || element.remoteUrl, 'cover');
							}
						},
						{
							label: 'Fit to Screen',
							action: () => {
								if (typeof setImageAsWallpaper === 'function') setImageAsWallpaper(element.content || element.remoteUrl, 'stretch');
							}
						},
						{
							label: 'Tile',
							action: () => {
								if (typeof setImageAsWallpaper === 'function') setImageAsWallpaper(element.content || element.remoteUrl, 'tile');
							}
						},
						{
							label: 'Center',
							action: () => {
								if (typeof setImageAsWallpaper === 'function') setImageAsWallpaper(element.content || element.remoteUrl, 'center');
							}
						}
					]
				});
			}

			items.push({ separator: true });

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
						label: 'Compressed (zipped) Folder',
						icon: '../assets/images/desk/icons/Folder Closed.webp',
						action: () => {
							fs.compressToZip(element.getFullPath());
							refreshUI();
						}
					},
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
						label: 'Mail Recipient',
						icon: 'https://api.iconify.design/mdi/email-outline.svg',
						action: () => {
							if (typeof openOutlookExpress === 'function') openOutlookExpress();
						}
					},
					{
						label: 'My Documents',
						icon: '../assets/images/desk/icons/My Profile Folder.webp',
						action: () => {
							const pdfs = fs.root.getByName('PDFs') || fs.root;
							fs.copy(element.getFullPath(), pdfs.getFullPath());
							refreshUI();
						}
					},
					{
						label: '3½ Floppy (A:)',
						icon: 'https://api.iconify.design/mdi/floppy.svg',
						action: () => {
							showXPDialog('Drive A:', 'Please insert a disk into drive A:.', 'error');
						}
					},
					{ separator: true },
					{
						label: 'Clipboard as Path',
						action: () => {
							if (navigator.clipboard) navigator.clipboard.writeText(element.getFullPath());
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

			items.push({
				label: 'Duplicate',
				action: () => {
					fs.duplicate(element.getFullPath());
					refreshUI();
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
						? `Are you sure you want to move these ${count} items to the Recycle Bin?`
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
					{
						label: 'Manage',
						action: () => {
							if (window.SettingsApp) window.SettingsApp.open('system');
						}
					},
					{ separator: true },
					{
						label: 'Map Network Drive...',
						action: () => {
							if (typeof showXPDialog === 'function') showXPDialog('Map Network Drive', 'Specify the drive letter and network path to mount.', 'info');
						}
					},
					{
						label: 'Disconnect Network Drive...',
						disabled: true,
						action: () => {}
					},
					{ separator: true },
					{
						label: 'Create Shortcut',
						action: () => {
							if (typeof showXPDialog === 'function') showXPDialog('Shortcut', 'Shortcut already exists on Desktop.', 'info');
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
							const count = fs ? fs.loadRecycleBinItems().length : 0;
							showXPDialog('Recycle Bin Properties', `Recycle Bin is located on Local Disk (C:).\nCurrent items in bin: ${count}`, 'info');
						}
					}
				];
			}

			if (type === 'achievements') {
				return [
					{
						label: 'Open Achievements',
						bold: true,
						action: () => {
							if (window.AchievementsManager) window.AchievementsManager.open();
						}
					},
					{
						label: 'Reset Progress',
						action: () => {
							if (window.AchievementsManager) window.AchievementsManager.reset(true);
						}
					},
					{ separator: true },
					{
						label: 'Properties',
						action: () => {
							if (window.AchievementsManager) window.AchievementsManager.open();
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
							if (window.Taskbar && typeof window.Taskbar.toggleCalendar === 'function') {
								window.Taskbar.toggleCalendar();
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
						const win = document.getElementById('window-internet-explorer');
						if (win) {
							const backBtn = win.querySelector('.tb-ie-back');
							if (backBtn && !backBtn.disabled) backBtn.click();
						}
					}
				},
				{
					label: 'Forward',
					icon: 'https://api.iconify.design/mdi/arrow-right.svg',
					action: () => {
						const win = document.getElementById('window-internet-explorer');
						if (win) {
							const fwdBtn = win.querySelector('.tb-ie-forward');
							if (fwdBtn && !fwdBtn.disabled) fwdBtn.click();
						}
					}
				},
				{ separator: true },
				{
					label: 'Set as Desktop Background',
					action: () => {
						if (typeof setImageAsWallpaper === 'function') setImageAsWallpaper(url, 'cover');
					}
				},
				{
					label: 'Copy Page Address',
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
					label: 'View Source',
					shortcut: 'Ctrl+U',
					action: () => {
						if (window.InternetExplorerApp) window.InternetExplorerApp.viewActiveTabSource();
					}
				},
				{
					label: 'Refresh',
					shortcut: 'F5',
					action: () => {
						const win = document.getElementById('window-internet-explorer');
						if (win) {
							const refreshBtn = win.querySelector('.tb-ie-refresh');
							if (refreshBtn) refreshBtn.click();
						}
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
