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

			activeMenu = this.createMenuElement(items, { ...context, x, y }, 0);
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
							label: 'Grid Direction',
							submenu: [
								{
									label: 'Top to Bottom (Columns)',
									radio: (window.SettingsApp && window.SettingsApp.get('desktopGridDirection')) !== 'left-to-right',
									action: () => {
										if (window.SettingsApp) window.SettingsApp.set('desktopGridDirection', 'top-to-bottom');
										arrangeIcons('none');
									}
								},
								{
									label: 'Left to Right (Rows)',
									radio: (window.SettingsApp && window.SettingsApp.get('desktopGridDirection')) === 'left-to-right',
									action: () => {
										if (window.SettingsApp) window.SettingsApp.set('desktopGridDirection', 'left-to-right');
										arrangeIcons('none');
									}
								}
							]
						},
						{
							label: 'Grid Origin Corner',
							submenu: [
								{
									label: 'Top-Left',
									radio: ((window.SettingsApp && window.SettingsApp.get('desktopGridOrigin')) || 'top-left') === 'top-left',
									action: () => {
										if (window.SettingsApp) window.SettingsApp.set('desktopGridOrigin', 'top-left');
										arrangeIcons('none');
									}
								},
								{
									label: 'Top-Right',
									radio: (window.SettingsApp && window.SettingsApp.get('desktopGridOrigin')) === 'top-right',
									action: () => {
										if (window.SettingsApp) window.SettingsApp.set('desktopGridOrigin', 'top-right');
										arrangeIcons('none');
									}
								},
								{
									label: 'Bottom-Left',
									radio: (window.SettingsApp && window.SettingsApp.get('desktopGridOrigin')) === 'bottom-left',
									action: () => {
										if (window.SettingsApp) window.SettingsApp.set('desktopGridOrigin', 'bottom-left');
										arrangeIcons('none');
									}
								},
								{
									label: 'Bottom-Right',
									radio: (window.SettingsApp && window.SettingsApp.get('desktopGridOrigin')) === 'bottom-right',
									action: () => {
										if (window.SettingsApp) window.SettingsApp.set('desktopGridOrigin', 'bottom-right');
										arrangeIcons('none');
									}
								}
							]
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
					disabled: !fs || !fs.clipboard || !fs.clipboard.elements || fs.clipboard.elements.length === 0,
					action: () => {
						if (!fs.clipboard.elements || fs.clipboard.elements.length === 0) return;
						const mode = fs.clipboard.mode || 'copy';
						const ops = [];
						fs.clipboard.elements.forEach(el => {
							const sourcePath = el.getFullPath();
							if (mode === 'cut') {
								const origParent = el.parent ? el.parent.getFullPath() : '/';
								const origName = el.name;
								const moved = fs.move(sourcePath, destPath);
								if (moved) {
									ops.push({
										type: 'move',
										fromParentPath: origParent,
										fromPath: sourcePath,
										toPath: moved.getFullPath(),
										originalName: origName,
										destName: moved.name
									});
								}
							} else {
								const copied = fs.copy(sourcePath, destPath);
								if (copied) {
									ops.push({
										type: 'copy',
										path: copied.getFullPath(),
										elementData: copied.toJSON()
									});
								}
							}
						});
						if (mode === 'cut') {
							fs.clipboard.mode = null;
							if (typeof clearCutVisuals === 'function') clearCutVisuals();
						}
						if (ops.length > 1) {
							fs.undoStack.push({ type: 'batch', operations: ops });
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
					disabled: ((window.SettingsApp && window.SettingsApp.get('wallpaperMode')) || localStorage.getItem('wallpaperMode') || 'picture') !== 'slideshow',
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
					action: (ctx) => {
						if (typeof openDisplaySettings === 'function') openDisplaySettings('desktop', ctx);
					}
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
					disabled: !fs || !fs.clipboard || !fs.clipboard.elements || fs.clipboard.elements.length === 0,
					action: () => {
						if (!fs.clipboard.elements || fs.clipboard.elements.length === 0) return;
						const mode = fs.clipboard.mode || 'copy';
						const ops = [];
						fs.clipboard.elements.forEach(el => {
							const sourcePath = el.getFullPath();
							if (mode === 'cut') {
								const origParent = el.parent ? el.parent.getFullPath() : '/';
								const origName = el.name;
								const moved = fs.move(sourcePath, destPath);
								if (moved) {
									ops.push({
										type: 'move',
										fromParentPath: origParent,
										fromPath: sourcePath,
										toPath: moved.getFullPath(),
										originalName: origName,
										destName: moved.name
									});
								}
							} else {
								const copied = fs.copy(sourcePath, destPath);
								if (copied) {
									ops.push({
										type: 'copy',
										path: copied.getFullPath(),
										elementData: copied.toJSON()
									});
								}
							}
						});
						if (mode === 'cut') {
							fs.clipboard.mode = null;
							if (typeof clearCutVisuals === 'function') clearCutVisuals();
						}
						if (ops.length > 1) {
							fs.undoStack.push({ type: 'batch', operations: ops });
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
					action: (ctx) => {
						if (typeof openElementInfoWindow === 'function') openElementInfoWindow(folder, ctx);
					}
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
							label: 'Fill Screen (Cover)',
							action: () => {
								if (typeof setImageAsWallpaper === 'function') setImageAsWallpaper(element.content || element.remoteUrl, 'cover');
							}
						},
						{
							label: 'Fit (Keep Aspect)',
							action: () => {
								if (typeof setImageAsWallpaper === 'function') setImageAsWallpaper(element.content || element.remoteUrl, 'fit');
							}
						},
						{
							label: 'Stretch to Screen',
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
						icon: '../assets/images/desk/icons/Mail.webp',
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
						icon: '../assets/images/desk/icons/Floppy Drive.webp',
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
					const sel = typeof getActiveSelectedElements === 'function' ? getActiveSelectedElements() : { elements: [element], paths: [element.getFullPath()] };
					fs.clipboard.mode = 'cut';
					fs.clipboard.elements = sel.elements.length > 0 ? sel.elements : [element];
					fs.clipboard.paths = sel.paths.length > 0 ? sel.paths : [element.getFullPath()];
					fs.clipboard.element = fs.clipboard.elements[0];
					if (typeof setCutVisuals === 'function') setCutVisuals(fs.clipboard.paths);
				}
			});

			items.push({
				label: 'Copy',
				shortcut: 'Ctrl+C',
				action: () => {
					const sel = typeof getActiveSelectedElements === 'function' ? getActiveSelectedElements() : { elements: [element], paths: [element.getFullPath()] };
					fs.clipboard.mode = 'copy';
					fs.clipboard.elements = sel.elements.length > 0 ? sel.elements : [element];
					fs.clipboard.paths = sel.paths.length > 0 ? sel.paths : [element.getFullPath()];
					fs.clipboard.element = fs.clipboard.elements[0];
					if (typeof clearCutVisuals === 'function') clearCutVisuals();
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
				action: (ctx) => {
					if (typeof openElementInfoWindow === 'function') openElementInfoWindow(element, ctx);
				}
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
			const isPinned = win.classList.contains('window-always-on-top');
			const isRolledUp = win.classList.contains('window-rolled-up');
			const isResizable = win.dataset.resizable !== 'false' && !win.classList.contains('xp-modal-overlay');

			return [
				{
					label: 'Restore',
					bold: isMin || isMax || !!win.dataset.snapped,
					disabled: !isMin && !isMax && !win.dataset.snapped,
					action: () => {
						if (isMin && typeof unminimizeWindow === 'function') unminimizeWindow(win);
						else if (isMax && typeof maximizeWindow === 'function') maximizeWindow(win);
						else if (win.dataset.snapped && window.WindowManager) window.WindowManager.restoreSnap(win);
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
					disabled: isMax || isMin || !isResizable,
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
					disabled: isMax || !isResizable,
					action: () => {
						if (!isMax && typeof maximizeWindow === 'function') maximizeWindow(win);
						if (typeof bringWindowToFront === 'function') bringWindowToFront(win);
					}
				},
				{ separator: true },
				{
					label: 'Pop Out to Floating Window',
					icon: 'https://api.iconify.design/mdi/open-in-new.svg?color=%231b4b9b',
					action: () => {
						if (window.WindowManager) window.WindowManager.detachToPopout(win, id);
					}
				},
				{
					label: isRolledUp ? 'Unroll Window' : 'Roll Up (Shade Window)',
					checked: isRolledUp,
					action: () => {
						if (window.WindowManager) window.WindowManager.toggleRollup(win);
					}
				},
				{
					label: 'Transparency',
					submenu: [
						{ label: '100% (Solid)', radio: !win.dataset.customOpacity || win.dataset.customOpacity === '1', action: () => { if (window.WindowManager) window.WindowManager.setOpacity(win, 1.0); } },
						{ label: '90%', radio: win.dataset.customOpacity === '0.9', action: () => { if (window.WindowManager) window.WindowManager.setOpacity(win, 0.9); } },
						{ label: '75%', radio: win.dataset.customOpacity === '0.75', action: () => { if (window.WindowManager) window.WindowManager.setOpacity(win, 0.75); } },
						{ label: '50% (Translucent)', radio: win.dataset.customOpacity === '0.5', action: () => { if (window.WindowManager) window.WindowManager.setOpacity(win, 0.5); } }
					]
				},
				{ separator: true },
				{
					label: 'Snap & Layout',
					disabled: isMin || !isResizable,
					submenu: [
						{
							label: 'Left Half (50%)',
							icon: 'https://api.iconify.design/mdi/dock-left.svg?color=%231b4b9b',
							action: () => {
								if (window.WindowManager) window.WindowManager.snap(win, 'left');
							}
						},
						{
							label: 'Right Half (50%)',
							icon: 'https://api.iconify.design/mdi/dock-right.svg?color=%231b4b9b',
							action: () => {
								if (window.WindowManager) window.WindowManager.snap(win, 'right');
							}
						},
						{
							label: 'Top Half (50%)',
							icon: 'https://api.iconify.design/mdi/dock-top.svg?color=%231b4b9b',
							action: () => {
								if (window.WindowManager) window.WindowManager.snap(win, 'top');
							}
						},
						{
							label: 'Bottom Half (50%)',
							icon: 'https://api.iconify.design/mdi/dock-bottom.svg?color=%231b4b9b',
							action: () => {
								if (window.WindowManager) window.WindowManager.snap(win, 'bottom');
							}
						},
						{ separator: true },
						{
							label: 'Top-Left Corner',
							action: () => {
								if (window.WindowManager) window.WindowManager.snap(win, 'top-left');
							}
						},
						{
							label: 'Top-Right Corner',
							action: () => {
								if (window.WindowManager) window.WindowManager.snap(win, 'top-right');
							}
						},
						{
							label: 'Bottom-Left Corner',
							action: () => {
								if (window.WindowManager) window.WindowManager.snap(win, 'bottom-left');
							}
						},
						{
							label: 'Bottom-Right Corner',
							action: () => {
								if (window.WindowManager) window.WindowManager.snap(win, 'bottom-right');
							}
						},
						{ separator: true },
						{
							label: 'Center Window',
							action: () => {
								if (window.WindowManager) window.WindowManager.snap(win, 'center');
							}
						}
					]
				},
				{
					label: 'Always on Top',
					checked: isPinned,
					action: () => {
						if (window.WindowManager) window.WindowManager.toggleAlwaysOnTop(win);
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
					shortcut: 'Ctrl+Shift+Esc',
					action: () => {
						if (window.TaskManagerApp) window.TaskManagerApp.open('applications');
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
			const isPinned = win.classList.contains('window-always-on-top');
			const isDetached = win.classList.contains('window-detached');
			const isResizable = win.dataset.resizable !== 'false' && !win.classList.contains('xp-modal-overlay');

			return [
				{
					label: isDetached ? 'Re-dock to Desktop' : 'Restore',
					bold: isMin || isDetached,
					disabled: !isMin && !isMax && !isDetached && !win.dataset.snapped,
					action: () => {
						if (isDetached && window.WindowManager) {
							window.WindowManager.reattachFromPopout(win, id);
						} else {
							if (isMin && typeof unminimizeWindow === 'function') unminimizeWindow(win);
							else if (isMax && typeof maximizeWindow === 'function') maximizeWindow(win);
							else if (win.dataset.snapped && window.WindowManager) window.WindowManager.restoreSnap(win);
							if (typeof bringWindowToFront === 'function') bringWindowToFront(win);
						}
					}
				},
				{
					label: 'Center and Focus Window',
					action: () => {
						if (win.classList.contains('minimized') && typeof unminimizeWindow === 'function') {
							unminimizeWindow(win);
						}
						if (window.WindowManager) {
							window.WindowManager.snap(win, 'center');
							window.WindowManager.bringToFront(win);
						}
					}
				},
				{
					label: 'Pop Out to Standalone Window',
					disabled: isDetached,
					icon: 'https://api.iconify.design/mdi/open-in-new.svg?color=%231b4b9b',
					action: () => {
						if (window.WindowManager) window.WindowManager.detachToPopout(win, id);
					}
				},
				{
					label: 'Minimize',
					disabled: isMin || isDetached,
					action: () => {
						if (typeof minimizeWindow === 'function') minimizeWindow(win, id);
					}
				},
				{
					label: 'Maximize',
					disabled: isMax || isDetached || !isResizable,
					action: () => {
						if (!isMax && typeof maximizeWindow === 'function') maximizeWindow(win);
						if (typeof bringWindowToFront === 'function') bringWindowToFront(win);
					}
				},
				{ separator: true },
				{
					label: 'Snap & Layout',
					disabled: isMin || isDetached || !isResizable,
					submenu: [
						{
							label: 'Left Half',
							action: () => {
								if (window.WindowManager) window.WindowManager.snap(win, 'left');
							}
						},
						{
							label: 'Right Half',
							action: () => {
								if (window.WindowManager) window.WindowManager.snap(win, 'right');
							}
						},
						{
							label: 'Top Half',
							action: () => {
								if (window.WindowManager) window.WindowManager.snap(win, 'top');
							}
						},
						{
							label: 'Bottom Half',
							action: () => {
								if (window.WindowManager) window.WindowManager.snap(win, 'bottom');
							}
						},
						{ separator: true },
						{
							label: 'Center Window',
							action: () => {
								if (window.WindowManager) window.WindowManager.snap(win, 'center');
							}
						}
					]
				},
				{
					label: 'Always on Top',
					checked: isPinned,
					disabled: isDetached,
					action: () => {
						if (window.WindowManager) window.WindowManager.toggleAlwaysOnTop(win);
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

		getMediaPlayerScreenItems(mediaPlayerApp, activeTrack, win) {
			const isCurrentlyPlaying = activeTrack && mediaPlayerApp && mediaPlayerApp.isPlaying;
			const isVideo = activeTrack && activeTrack.isVideo;

			return [
				{
					label: isCurrentlyPlaying ? 'Pause' : 'Play',
					bold: true,
					action: () => mediaPlayerApp.togglePlay()
				},
				{
					label: 'Stop',
					action: () => mediaPlayerApp.stop()
				},
				{ separator: true },
				{
					label: 'Previous Track',
					shortcut: 'Ctrl+B',
					action: () => mediaPlayerApp.playPrevious()
				},
				{
					label: 'Next Track',
					shortcut: 'Ctrl+F',
					action: () => mediaPlayerApp.playNext()
				},
				{ separator: true },
				{
					label: 'Visualizations',
					submenu: [
						{
							label: 'Album Art Stage',
							radio: mediaPlayerApp.currentVisualization === 'albumart',
							action: () => {
								mediaPlayerApp.currentVisualization = 'albumart';
								mediaPlayerApp.updateVisualizationModeUI(win);
								const lbl = win.querySelector('#wmp-viz-label');
								if (lbl) lbl.textContent = 'Viz: Album Art';
							}
						},
						{
							label: 'Spectrum Bars',
							radio: mediaPlayerApp.currentVisualization === 'bars',
							action: () => {
								mediaPlayerApp.currentVisualization = 'bars';
								mediaPlayerApp.updateVisualizationModeUI(win);
								const lbl = win.querySelector('#wmp-viz-label');
								if (lbl) lbl.textContent = 'Viz: Bars';
							}
						},
						{
							label: 'Oscilloscope Waveform',
							radio: mediaPlayerApp.currentVisualization === 'wave',
							action: () => {
								mediaPlayerApp.currentVisualization = 'wave';
								mediaPlayerApp.updateVisualizationModeUI(win);
								const lbl = win.querySelector('#wmp-viz-label');
								if (lbl) lbl.textContent = 'Viz: Waveform';
							}
						},
						{
							label: 'Radial Spectrum',
							radio: mediaPlayerApp.currentVisualization === 'spectrum',
							action: () => {
								mediaPlayerApp.currentVisualization = 'spectrum';
								mediaPlayerApp.updateVisualizationModeUI(win);
								const lbl = win.querySelector('#wmp-viz-label');
								if (lbl) lbl.textContent = 'Viz: Spectrum';
							}
						},
						{
							label: 'Starfield Particles',
							radio: mediaPlayerApp.currentVisualization === 'particles',
							action: () => {
								mediaPlayerApp.currentVisualization = 'particles';
								mediaPlayerApp.updateVisualizationModeUI(win);
								const lbl = win.querySelector('#wmp-viz-label');
								if (lbl) lbl.textContent = 'Viz: Particles';
							}
						},
						{
							label: 'Fire Flame',
							radio: mediaPlayerApp.currentVisualization === 'flame',
							action: () => {
								mediaPlayerApp.currentVisualization = 'flame';
								mediaPlayerApp.updateVisualizationModeUI(win);
								const lbl = win.querySelector('#wmp-viz-label');
								if (lbl) lbl.textContent = 'Viz: Fire Flame';
							}
						}
					]
				},
				{
					label: 'Enhancements',
					submenu: [
						{
							label: 'Graphic Equalizer...',
							action: () => {
								const btn = win.querySelector('#wmp-btn-enhancements');
								if (btn && !mediaPlayerApp.isEnhancementsOpen) btn.click();
								const eqTab = win.querySelector('.wmp-enh-tab-btn[data-enh-tab="eq"]');
								if (eqTab) eqTab.click();
							}
						},
						{
							label: 'SRS WOW Effects...',
							action: () => {
								const btn = win.querySelector('#wmp-btn-enhancements');
								if (btn && !mediaPlayerApp.isEnhancementsOpen) btn.click();
								const srsTab = win.querySelector('.wmp-enh-tab-btn[data-enh-tab="srs"]');
								if (srsTab) srsTab.click();
							}
						},
						{
							label: 'Play Speed & Balance...',
							action: () => {
								const btn = win.querySelector('#wmp-btn-enhancements');
								if (btn && !mediaPlayerApp.isEnhancementsOpen) btn.click();
								const speedTab = win.querySelector('.wmp-enh-tab-btn[data-enh-tab="speed"]');
								if (speedTab) speedTab.click();
							}
						},
						{
							label: 'Video Settings...',
							action: () => {
								const btn = win.querySelector('#wmp-btn-enhancements');
								if (btn && !mediaPlayerApp.isEnhancementsOpen) btn.click();
								const videoTab = win.querySelector('.wmp-enh-tab-btn[data-enh-tab="video"]');
								if (videoTab) videoTab.click();
							}
						}
					]
				},
				{
					label: 'Video Aspect Ratio',
					visible: !!isVideo,
					submenu: [
						{
							label: 'Automatic Fit',
							radio: mediaPlayerApp.videoAspectRatio === 'auto',
							action: () => {
								mediaPlayerApp.videoAspectRatio = 'auto';
								mediaPlayerApp.applyVideoFilters(win.querySelector('#wmp-video-player'));
							}
						},
						{
							label: '4:3 Standard Television',
							radio: mediaPlayerApp.videoAspectRatio === '4:3',
							action: () => {
								mediaPlayerApp.videoAspectRatio = '4:3';
								mediaPlayerApp.applyVideoFilters(win.querySelector('#wmp-video-player'));
							}
						},
						{
							label: '16:9 Widescreen Cinema',
							radio: mediaPlayerApp.videoAspectRatio === '16:9',
							action: () => {
								mediaPlayerApp.videoAspectRatio = '16:9';
								mediaPlayerApp.applyVideoFilters(win.querySelector('#wmp-video-player'));
							}
						},
						{
							label: 'Stretch to Screen',
							radio: mediaPlayerApp.videoAspectRatio === 'stretch',
							action: () => {
								mediaPlayerApp.videoAspectRatio = 'stretch';
								mediaPlayerApp.applyVideoFilters(win.querySelector('#wmp-video-player'));
							}
						}
					]
				},
				{ separator: true },
				{
					label: 'Shuffle',
					checked: !!mediaPlayerApp.isShuffle,
					action: () => {
						const btn = win.querySelector('#wmp-btn-shuffle');
						if (btn) btn.click();
					}
				},
				{
					label: 'Repeat Mode',
					submenu: [
						{
							label: 'Off',
							radio: mediaPlayerApp.repeatMode === 'off',
							action: () => {
								mediaPlayerApp.repeatMode = 'off';
								win.querySelector('#wmp-repeat-label').textContent = 'Repeat: OFF';
								win.querySelector('#wmp-btn-repeat').classList.remove('active');
							}
						},
						{
							label: 'Repeat All',
							radio: mediaPlayerApp.repeatMode === 'all',
							action: () => {
								mediaPlayerApp.repeatMode = 'all';
								win.querySelector('#wmp-repeat-label').textContent = 'Repeat: ALL';
								win.querySelector('#wmp-btn-repeat').classList.add('active');
							}
						},
						{
							label: 'Repeat Current Track',
							radio: mediaPlayerApp.repeatMode === 'one',
							action: () => {
								mediaPlayerApp.repeatMode = 'one';
								win.querySelector('#wmp-repeat-label').textContent = 'Repeat: ONE';
								win.querySelector('#wmp-btn-repeat').classList.add('active');
							}
						}
					]
				},
				{
					label: 'Playlist Pane',
					checked: !!mediaPlayerApp.isPlaylistVisible,
					action: () => {
						const btn = win.querySelector('#wmp-btn-toggle-playlist');
						if (btn) btn.click();
					}
				},
				{
					label: 'Full Screen',
					action: () => {
						if (typeof maximizeWindow === 'function') maximizeWindow(win);
					}
				},
				{ separator: true },
				{
					label: 'Properties',
					bold: true,
					disabled: !activeTrack,
					action: () => {
						if (!activeTrack) return;
						if (activeTrack.raw instanceof File) {
							openElementInfoWindow(activeTrack.raw);
							return;
						}
						const artists = activeTrack.artist || 'Wartets';
						const album = activeTrack.album || 'Windows Media Library';
						const dur = activeTrack.duration || '00:00';
						const msg = `Title: ${activeTrack.title}\nArtist: ${artists}\nAlbum: ${album}\nDuration: ${dur}\nType: ${activeTrack.isVideo ? 'Video Clip' : 'Audio Track'}\nLocation: ${activeTrack.url}`;
						showXPDialog(`${activeTrack.title} Properties`, msg, 'info');
					}
				}
			];
		},

		getMediaPlayerPlaylistItemItems(track, realIndex, mediaPlayerApp, win) {
			const playlist = (mediaPlayerApp && mediaPlayerApp.currentPlaylist) || [];
			const isCurrent = realIndex === mediaPlayerApp?.currentTrackIndex;
			return [
				{
					label: 'Play',
					bold: true,
					action: () => mediaPlayerApp.playIndex(realIndex)
				},
				{
					label: 'Play in Winamp',
					icon: '../assets/images/desk/icons/Winamp.webp',
					action: () => {
						if (typeof openWinamp === 'function') openWinamp(track);
					}
				},
				{ separator: true },
				{
					label: 'Move Up',
					disabled: realIndex <= 0,
					action: () => {
						if (playlist.length > 1 && realIndex > 0) {
							const moved = playlist.splice(realIndex, 1)[0];
							playlist.splice(realIndex - 1, 0, moved);
							if (mediaPlayerApp.currentTrackIndex === realIndex) mediaPlayerApp.currentTrackIndex--;
							mediaPlayerApp.renderPlaylist(win);
						}
					}
				},
				{
					label: 'Move Down',
					disabled: realIndex >= playlist.length - 1,
					action: () => {
						if (playlist.length > 1 && realIndex < playlist.length - 1) {
							const moved = playlist.splice(realIndex, 1)[0];
							playlist.splice(realIndex + 1, 0, moved);
							if (mediaPlayerApp.currentTrackIndex === realIndex) mediaPlayerApp.currentTrackIndex++;
							mediaPlayerApp.renderPlaylist(win);
						}
					}
				},
				{
					label: 'Find in File Explorer',
					icon: '../assets/images/desk/icons/Folder Open.webp',
					action: () => {
						if (typeof fs !== 'undefined' && fs) {
							let target = fs.findByPath(`/Music/${track.title}`);
							if (!target) target = fs.root.getByName('Music') || fs.root;
							if (window.FileExplorer) window.FileExplorer.open(target instanceof Folder ? target : target.parent || fs.root);
						}
					}
				},
				{ separator: true },
				{
					label: 'Remove from Playlist',
					action: () => {
						if (playlist.length > 0) {
							playlist.splice(realIndex, 1);
							if (mediaPlayerApp.currentTrackIndex === realIndex) {
								if (playlist.length > 0) {
									mediaPlayerApp.playIndex(Math.min(realIndex, playlist.length - 1));
								} else {
									mediaPlayerApp.stop();
								}
							} else if (mediaPlayerApp.currentTrackIndex > realIndex) {
								mediaPlayerApp.currentTrackIndex--;
							}
							mediaPlayerApp.renderPlaylist(win);
						}
					}
				},
				{
					label: 'Clear Playlist',
					action: () => {
						mediaPlayerApp.currentPlaylist = [];
						mediaPlayerApp.stop();
						mediaPlayerApp.renderPlaylist(win);
					}
				},
				{ separator: true },
				{
					label: 'Properties',
					bold: isCurrent,
					action: () => {
						if (track && track.raw instanceof File) {
							openElementInfoWindow(track.raw);
							return;
						}
						const artists = track?.artist || 'Wartets';
						const album = track?.album || 'Windows Media Library';
						const dur = track?.duration || '00:00';
						const msg = `Title: ${track?.title || 'Unknown'}\nArtist: ${artists}\nAlbum: ${album}\nDuration: ${dur}\nLocation: ${track?.url || ''}`;
						showXPDialog(`${track?.title || 'Track'} Properties`, msg, 'info');
					}
				}
			];
		},

		getPictureViewerItems(viewerApp, currentImage, win) {
			return [
				{
					label: 'Actual Size (100%)',
					bold: true,
					action: () => viewerApp.setZoom(1.0)
				},
				{
					label: 'Best Fit',
					action: () => viewerApp.fitToWindow(win)
				},
				{
					label: 'Zoom In (+)',
					shortcut: '+',
					icon: 'https://api.iconify.design/mdi/magnify-plus-outline.svg',
					action: () => viewerApp.setZoom(viewerApp.currentZoom * 1.25)
				},
				{
					label: 'Zoom Out (-)',
					shortcut: '-',
					icon: 'https://api.iconify.design/mdi/magnify-minus-outline.svg',
					action: () => viewerApp.setZoom(viewerApp.currentZoom / 1.25)
				},
				{ separator: true },
				{
					label: 'Rotate Clockwise (90°)',
					shortcut: 'Ctrl+K',
					icon: 'https://api.iconify.design/mdi/rotate-right.svg',
					action: () => {
						viewerApp.currentRotation = (viewerApp.currentRotation + 90) % 360;
						viewerApp.applyTransform();
					}
				},
				{
					label: 'Rotate Counterclockwise (90°)',
					shortcut: 'Ctrl+L',
					icon: 'https://api.iconify.design/mdi/rotate-left.svg',
					action: () => {
						viewerApp.currentRotation = (viewerApp.currentRotation - 90 + 360) % 360;
						viewerApp.applyTransform();
					}
				},
				{
					label: viewerApp.isSlideshow ? 'Stop Slide Show' : 'Start Slide Show',
					shortcut: 'F11',
					icon: 'https://api.iconify.design/mdi/presentation-play.svg',
					action: () => viewerApp.toggleSlideshow(win)
				},
				{ separator: true },
				{
					label: 'Set as Desktop Background',
					icon: '../assets/images/desk/icons/Display.webp',
					submenu: [
						{
							label: 'Fill Screen (Cover)',
							action: () => {
								if (typeof window.setImageAsWallpaper === 'function') window.setImageAsWallpaper(currentImage.src, 'cover');
								else if (window.SettingsApp) window.SettingsApp.set('desktopBackground', currentImage.src);
								if (typeof showXPDialog === 'function') showXPDialog('Desktop Background', `"${currentImage.name}" is now set as desktop wallpaper.`, 'info');
							}
						},
						{
							label: 'Fit (Keep Aspect)',
							action: () => {
								if (typeof window.setImageAsWallpaper === 'function') window.setImageAsWallpaper(currentImage.src, 'fit');
								else if (window.SettingsApp) window.SettingsApp.set('desktopBackground', currentImage.src);
								if (typeof showXPDialog === 'function') showXPDialog('Desktop Background', `"${currentImage.name}" is now set as desktop wallpaper.`, 'info');
							}
						},
						{
							label: 'Stretch to Screen',
							action: () => {
								if (typeof window.setImageAsWallpaper === 'function') window.setImageAsWallpaper(currentImage.src, 'stretch');
								else if (window.SettingsApp) window.SettingsApp.set('desktopBackground', currentImage.src);
								if (typeof showXPDialog === 'function') showXPDialog('Desktop Background', `"${currentImage.name}" is now set as desktop wallpaper.`, 'info');
							}
						},
						{
							label: 'Tile',
							action: () => {
								if (typeof window.setImageAsWallpaper === 'function') window.setImageAsWallpaper(currentImage.src, 'tile');
								else if (window.SettingsApp) window.SettingsApp.set('desktopBackground', currentImage.src);
								if (typeof showXPDialog === 'function') showXPDialog('Desktop Background', `"${currentImage.name}" is now set as desktop wallpaper.`, 'info');
							}
						},
						{
							label: 'Center',
							action: () => {
								if (typeof window.setImageAsWallpaper === 'function') window.setImageAsWallpaper(currentImage.src, 'center');
								else if (window.SettingsApp) window.SettingsApp.set('desktopBackground', currentImage.src);
								if (typeof showXPDialog === 'function') showXPDialog('Desktop Background', `"${currentImage.name}" is now set as desktop wallpaper.`, 'info');
							}
						}
					]
				},
				{
					label: 'Edit in Paint',
					icon: '../assets/images/desk/icons/Paint.webp',
					action: () => {
						if (window.PaintApp) {
							window.PaintApp.open(currentImage.fileObj || currentImage.src);
						}
					}
				},
				{
					label: 'Save Copy As...',
					shortcut: 'Ctrl+S',
					icon: 'https://api.iconify.design/mdi/content-save-outline.svg',
					action: () => {
						const a = document.createElement('a');
						a.href = currentImage.src;
						a.download = currentImage.name;
						document.body.appendChild(a);
						a.click();
						a.remove();
					}
				},
				{
					label: 'Print...',
					shortcut: 'Ctrl+P',
					icon: 'https://api.iconify.design/mdi/printer.svg',
					action: () => {
						const pWin = window.open('', '_blank');
						if (pWin) {
							pWin.document.write(`<html><head><title>${currentImage.name}</title></head><body style="margin:0;display:flex;align-items:center;justify-content:center;"><img src="${currentImage.src}" style="max-width:100%;height:auto;" onload="window.print();window.close();"></body></html>`);
							pWin.document.close();
						}
					}
				},
				{ separator: true },
				{
					label: 'Open File Location',
					icon: '../assets/images/desk/icons/Folder Open.webp',
					action: () => {
						if (currentImage.parent && window.FileExplorer) {
							window.FileExplorer.open(currentImage.parent);
						}
					}
				},
				{
					label: 'Delete',
					shortcut: 'Del',
					icon: 'https://api.iconify.design/mdi/delete-outline.svg',
					action: () => {
						if (!currentImage.fileObj) return;
						createConfirmationDialog(`Are you sure you want to move '${currentImage.name}' to the Recycle Bin?`, () => {
							try {
								if (fs) fs.moveToRecycleBin(currentImage.fileObj.getFullPath());
								viewerApp.currentFolderImages.splice(viewerApp.currentImageIndex, 1);
								if (viewerApp.currentFolderImages.length === 0) {
									closeWindow(win, win.id);
								} else {
									viewerApp.currentImageIndex = Math.min(viewerApp.currentImageIndex, viewerApp.currentFolderImages.length - 1);
									viewerApp.displayImage(win, viewerApp.currentFolderImages[viewerApp.currentImageIndex]);
								}
								if (typeof refreshUI === 'function') refreshUI();
							} catch (e) {
								showXPDialog('Error', e.message, 'error');
							}
						});
					}
				},
				{ separator: true },
				{
					label: 'Properties',
					bold: true,
					action: () => {
						if (currentImage.fileObj instanceof File) {
							openElementInfoWindow(currentImage.fileObj);
							return;
						}
						const imgEl = win.querySelector('#picview-image-el');
						const dims = imgEl && imgEl.naturalWidth ? `${imgEl.naturalWidth} x ${imgEl.naturalHeight} pixels` : 'Unknown';
						const msg = `File Name: ${currentImage.name}\nDimensions: ${dims}\nLocation: ${currentImage.src}`;
						showXPDialog(`${currentImage.name} Properties`, msg, 'info');
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
