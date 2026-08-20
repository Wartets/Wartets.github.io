(function () {
	const STORAGE_KEY_GEOMETRIES = 'xp_window_geometries';
	const STORAGE_KEY_SESSION_WINDOWS = 'xp_open_windows_session_state';

	class WindowManager {
		constructor() {
			this.windows = {};
			this.detachedPopups = new Map();
			this.zIndexCounter = 100;
			this.activeWindow = null;
			this.cascadeIndex = 0;
			this.snapPreviewEl = null;
			this.snapGuideHEl = null;
			this.snapGuideVEl = null;
			this.activeSnapTarget = null;
			this.saveSessionDebounceTimer = null;
			this.isRestoringSession = false;
			this.savedGeometries = this.loadSavedGeometries();
			this.initGlobalShortcuts();
			this.initSnapPreviewElement();
			this.initSnapGuides();
		}

		loadSavedGeometries() {
			try {
				const raw = localStorage.getItem(STORAGE_KEY_GEOMETRIES);
				return raw ? JSON.parse(raw) : {};
			} catch (e) {
				return {};
			}
		}

		saveGeometries() {
			try {
				localStorage.setItem(STORAGE_KEY_GEOMETRIES, JSON.stringify(this.savedGeometries));
			} catch (e) {}
		}

		queueSaveOpenWindowsState() {
			if (this.isRestoringSession) return;
			if (this.saveSessionDebounceTimer) clearTimeout(this.saveSessionDebounceTimer);
			this.saveSessionDebounceTimer = setTimeout(() => {
				this.saveOpenWindowsState();
			}, 300);
		}

		saveOpenWindowsState() {
			if (this.isRestoringSession) return;
			try {
				const windowStates = [];
				Object.keys(this.windows).forEach(id => {
					const win = this.windows[id];
					if (!win || win.classList.contains('xp-modal-overlay') || id.startsWith('dialog-') || id.startsWith('overlay-')) return;
					const title = win.querySelector('.xp-window-header .title')?.textContent || '';
					const iconSrc = win.querySelector('.xp-window-header img')?.src || '';

					let appId = win.dataset.appId || null;
					let appArgs = null;

					try {
						if (win.dataset.appArgs) appArgs = JSON.parse(win.dataset.appArgs);
					} catch (e) {
						appArgs = win.dataset.appArgs || null;
					}

					if (!appId) {
						if (id.startsWith('window-folder-') || win.classList.contains('xp-explorer-window')) {
							appId = win.explorerState?.isRecycleBin ? 'recyclebin' : 'explorer';
							appArgs = {
								path: win.explorerState?.currentFolder?.getFullPath ? win.explorerState.currentFolder.getFullPath() : '/',
								viewMode: win.explorerState?.viewMode || 'icons'
							};
						} else if (id === 'window-paint' || id.startsWith('window-paint-')) {
							appId = 'paint';
						} else if (id === 'window-notepad' || id.startsWith('window-notepad-')) {
							appId = 'notepad';
						} else if (id === 'window-calculator') {
							appId = 'calculator';
						} else if (id === 'window-minesweeper') {
							appId = 'minesweeper';
						} else if (id === 'window-solitaire') {
							appId = 'solitaire';
						} else if (id === 'window-sound-recorder') {
							appId = 'soundrecorder';
						} else if (id === 'window-charmap') {
							appId = 'charmap';
						} else if (id === 'window-cmd' || id.startsWith('window-cmd-')) {
							appId = 'cmd';
						} else if (id === 'window-media-player') {
							appId = 'mediaplayer';
						} else if (id === 'window-internet-explorer') {
							appId = 'ie';
						} else if (id === 'window-outlook-express') {
							appId = 'outlook';
						} else if (id === 'window-achievements-vault') {
							appId = 'achievements';
						} else if (id === 'window-control-panel-properties') {
							appId = 'settings';
						} else if (id === 'window-display-properties') {
							appId = 'display';
						} else if (id === 'window-my-computer') {
							appId = 'mycomputer';
						} else if (id === 'window-network-places') {
							appId = 'network';
						} else if (id === 'window-printers-faxes') {
							appId = 'printers';
						} else if (id === 'window-search-companion') {
							appId = 'search';
						} else if (id.startsWith('window-project-') || id.startsWith('window-')) {
							appId = 'project';
							appArgs = { title };
						}
					}

					const appState = typeof win.getWindowState === 'function' ? win.getWindowState() : null;
					windowStates.push({
						id,
						appId,
						appArgs,
						appState,
						title,
						iconSrc,
						left: win.style.left,
						top: win.style.top,
						width: win.style.width,
						height: win.style.height,
						zIndex: parseInt(win.style.zIndex || '100', 10),
						opacity: win.dataset.customOpacity || win.style.opacity || '1',
						minimized: win.classList.contains('minimized'),
						maximized: win.classList.contains('maximized'),
						snapped: win.dataset.snapped || null,
						rolledUp: win.classList.contains('window-rolled-up'),
						pinned: win.classList.contains('window-always-on-top'),
						resizable: win.dataset.resizable !== 'false',
						originalLeft: win.dataset.originalLeft || null,
						originalTop: win.dataset.originalTop || null,
						originalWidth: win.dataset.originalWidth || null,
						originalHeight: win.dataset.originalHeight || null,
						restoreLeft: win.dataset.restoreLeft || null,
						restoreTop: win.dataset.restoreTop || null,
						restoreWidth: win.dataset.restoreWidth || null,
						restoreHeight: win.dataset.restoreHeight || null
					});
				});

				localStorage.setItem(STORAGE_KEY_SESSION_WINDOWS, JSON.stringify(windowStates));
			} catch (e) {}
		}

		restoreOpenWindowsState() {
			try {
				const raw = localStorage.getItem(STORAGE_KEY_SESSION_WINDOWS);
				if (!raw) return;
				const windowStates = JSON.parse(raw);
				if (!Array.isArray(windowStates) || windowStates.length === 0) return;

				this.isRestoringSession = true;
				windowStates.sort((a, b) => (a.zIndex || 100) - (b.zIndex || 100));

				windowStates.forEach(state => {
					let win = null;
					if (state.appId === 'explorer' && window.FileExplorer && typeof fs !== 'undefined' && fs) {
						const folder = state.appArgs?.path ? fs.findByPath(state.appArgs.path) : fs.root;
						win = window.FileExplorer.open(folder || fs.root, {
							viewMode: state.viewMode || state.appArgs?.viewMode || 'icons',
							restoreState: state.appState
						});
					} else if (state.appId === 'recyclebin' && window.FileExplorer) {
						win = window.FileExplorer.openRecycleBin({
							viewMode: state.viewMode || state.appArgs?.viewMode || 'details',
							restoreState: state.appState
						});
					} else if (state.appId === 'paint' && window.PaintApp) {
						win = window.PaintApp.open(state.appArgs?.path || null, { restoreState: state.appState });
					} else if (state.appId === 'notepad' && window.NotepadApp) {
						const targetFile = state.appArgs?.path && typeof fs !== 'undefined' ? fs.findByPath(state.appArgs.path) : null;
						win = window.NotepadApp.open(targetFile, { restoreState: state.appState, title: state.title });
					} else if (state.appId === 'calculator' && window.CalculatorApp) {
						win = window.CalculatorApp.open();
					} else if (state.appId === 'charmap' && window.CharacterMapApp) {
						win = window.CharacterMapApp.open();
					} else if (state.appId === 'soundrecorder' && window.SoundRecorderApp) {
						win = window.SoundRecorderApp.open(state.appArgs?.path && typeof fs !== 'undefined' ? fs.findByPath(state.appArgs.path) : null);
					} else if (state.appId === 'mediaplayer' && window.MediaPlayerApp) {
						win = window.MediaPlayerApp.open(null, { restoreState: state.appState });
					} else if (state.appId === 'pictureviewer' && window.PictureViewerApp) {
						const targetFile = state.appArgs?.path && typeof fs !== 'undefined' ? fs.findByPath(state.appArgs.path) : (state.appArgs?.path || null);
						win = window.PictureViewerApp.open(targetFile, { restoreState: state.appState });
					} else if (state.appId === 'minesweeper' && window.MinesweeperApp) {
						win = window.MinesweeperApp.open();
						if (win && typeof win.restoreSessionState === 'function' && state.appState) {
							win.restoreSessionState(state.appState);
						}
					} else if (state.appId === 'solitaire' && window.SolitaireApp) {
						win = window.SolitaireApp.open();
						if (win && window.SolitaireApp.restoreSessionState && state.appState) {
							window.SolitaireApp.restoreSessionState(state.appState);
						}
					} else if (state.appId === 'ie' && window.InternetExplorerApp) {
						win = window.InternetExplorerApp.open(state.appState?.tabs?.[0]?.currentUrl || 'about:home');
					} else if (state.appId === 'outlook' && typeof openOutlookExpress === 'function') {
						openOutlookExpress();
						win = document.getElementById('window-outlook-express');
					} else if (state.appId === 'settings' && window.SettingsApp) {
						window.SettingsApp.open(state.appState?.activeTab || 'system');
						win = document.getElementById('window-control-panel-properties');
					} else if (state.appId === 'display' && typeof openDisplaySettings === 'function') {
						openDisplaySettings(state.appState?.activeTab || 'desktop');
						win = document.getElementById('window-display-properties');
					} else if (state.appId === 'project' && typeof projects !== 'undefined') {
						const p = projects.flat().find(pr => pr && typeof pr === 'object' && ((pr.title && (pr.title.en === state.title || pr.title === state.title)) || state.title.includes(String(pr.title))));
						if (p && typeof openProjectWindow === 'function') openProjectWindow(p);
						win = document.getElementById(state.id);
					} else if (state.appId && window.DeskAppRegistry && window.DeskAppRegistry.get(state.appId)) {
						win = window.DeskAppRegistry.launch(state.appId, state.appArgs || state.appState);
					}

					if (!win && state.id) {
						win = document.getElementById(state.id);
					}

					if (win) {
						win.dataset.appId = state.appId || '';
						if (state.appArgs) win.dataset.appArgs = typeof state.appArgs === 'string' ? state.appArgs : JSON.stringify(state.appArgs);

						if (state.left) win.style.left = state.left;
						if (state.top) win.style.top = state.top;
						if (state.width) win.style.width = state.width;
						if (state.height) win.style.height = state.height;
						if (state.zIndex) {
							win.style.zIndex = String(state.zIndex);
							this.zIndexCounter = Math.max(this.zIndexCounter, state.zIndex);
						}

						if (state.opacity && state.opacity !== '1') {
							this.setOpacity(win, state.opacity);
						}

						if (state.originalLeft) win.dataset.originalLeft = state.originalLeft;
						if (state.originalTop) win.dataset.originalTop = state.originalTop;
						if (state.originalWidth) win.dataset.originalWidth = state.originalWidth;
						if (state.originalHeight) win.dataset.originalHeight = state.originalHeight;
						if (state.restoreLeft) win.dataset.restoreLeft = state.restoreLeft;
						if (state.restoreTop) win.dataset.restoreTop = state.restoreTop;
						if (state.restoreWidth) win.dataset.restoreWidth = state.restoreWidth;
						if (state.restoreHeight) win.dataset.restoreHeight = state.restoreHeight;

						if (state.pinned) {
							this.toggleAlwaysOnTop(win);
						}
						if (state.rolledUp) {
							this.toggleRollup(win);
						}
						if (state.snapped) {
							this.snap(win, state.snapped);
						} else if (state.maximized) {
							this.maximize(win);
						}
						if (state.minimized) {
							this.minimize(win, state.id);
						} else {
							this.setActive(win);
						}
					}
				});

				this.isRestoringSession = false;
				this.clampAllWindowsToWorkspace();
			} catch (e) {
				this.isRestoringSession = false;
			}
		}

		getSetting(key, fallback) {
			if (window.SettingsApp && typeof window.SettingsApp.get === 'function') {
				const val = window.SettingsApp.get(key);
				if (val !== undefined && val !== null) return val;
			}
			return fallback;
		}

		initSnapPreviewElement() {
			if (!this.snapPreviewEl) {
				this.snapPreviewEl = document.createElement('div');
				this.snapPreviewEl.id = 'xp-window-snap-preview';
				document.body.appendChild(this.snapPreviewEl);
			}
		}

		initSnapGuides() {
			if (!this.snapGuideHEl) {
				this.snapGuideHEl = document.createElement('div');
				this.snapGuideHEl.id = 'xp-snap-guide-h';
				this.snapGuideHEl.className = 'xp-snap-guide';
				document.body.appendChild(this.snapGuideHEl);
			}
			if (!this.snapGuideVEl) {
				this.snapGuideVEl = document.createElement('div');
				this.snapGuideVEl.id = 'xp-snap-guide-v';
				this.snapGuideVEl.className = 'xp-snap-guide';
				document.body.appendChild(this.snapGuideVEl);
			}
		}

		showGuide(axis, coordinate) {
			if (axis === 'h' && this.snapGuideHEl) {
				this.snapGuideHEl.style.top = `${coordinate}px`;
				this.snapGuideHEl.style.display = 'block';
			} else if (axis === 'v' && this.snapGuideVEl) {
				this.snapGuideVEl.style.left = `${coordinate}px`;
				this.snapGuideVEl.style.display = 'block';
			}
		}

		hideGuides() {
			if (this.snapGuideHEl) this.snapGuideHEl.style.display = 'none';
			if (this.snapGuideVEl) this.snapGuideVEl.style.display = 'none';
		}

		initGlobalShortcuts() {
			document.addEventListener('keydown', (e) => {
				if (!this.activeWindow || this.activeWindow.classList.contains('xp-modal-overlay')) return;
				const isEditable = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable;
				if (isEditable) return;

				if (e.altKey && e.shiftKey) {
					if (e.key === 'ArrowLeft') {
						e.preventDefault();
						this.snap(this.activeWindow, 'left');
					} else if (e.key === 'ArrowRight') {
						e.preventDefault();
						this.snap(this.activeWindow, 'right');
					} else if (e.key === 'ArrowUp') {
						e.preventDefault();
						this.maximize(this.activeWindow);
					} else if (e.key === 'ArrowDown') {
						e.preventDefault();
						if (this.activeWindow.classList.contains('maximized') || this.activeWindow.dataset.snapped) {
							this.restoreSnap(this.activeWindow);
						} else {
							this.minimize(this.activeWindow, this.activeWindow.id);
						}
					} else if (e.key === 'c' || e.key === 'C') {
						e.preventDefault();
						this.snap(this.activeWindow, 'center');
					} else if (e.key === 'p' || e.key === 'P') {
						e.preventDefault();
						this.detachToPopout(this.activeWindow, this.activeWindow.id);
					} else if (e.key === 'r' || e.key === 'R') {
						e.preventDefault();
						this.toggleRollup(this.activeWindow);
					}
				}
			});
		}

		getWorkspaceBounds() {
			const desktopEl = document.getElementById('desktop');
			if (desktopEl) {
				const rect = desktopEl.getBoundingClientRect();
				return {
					left: Math.round(rect.left),
					top: Math.round(rect.top),
					width: Math.round(rect.width),
					height: Math.round(rect.height),
					right: Math.round(rect.right),
					bottom: Math.round(rect.bottom)
				};
			}
			const isTopTaskbar = document.body.classList.contains('taskbar-position-top');
			const taskbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--xp-taskbar-height') || '36', 10);
			const top = isTopTaskbar ? taskbarHeight : 0;
			const left = 0;
			const width = window.innerWidth;
			const height = window.innerHeight - taskbarHeight;
			return { left, top, width, height, right: left + width, bottom: top + height };
		}

		clampAllWindowsToWorkspace() {
			const bounds = this.getWorkspaceBounds();
			Object.values(this.windows).forEach(win => {
				if (!win || win.classList.contains('minimized') || win.classList.contains('xp-modal-overlay') || win.classList.contains('window-detached') || win.style.display === 'none') return;
				if (win.classList.contains('maximized')) {
					win.style.left = `${bounds.left}px`;
					win.style.top = `${bounds.top}px`;
					win.style.width = `${bounds.width}px`;
					win.style.height = `${bounds.height}px`;
					return;
				}
				if (win.dataset.snapped) {
					this.snap(win, win.dataset.snapped);
					return;
				}
				const rect = win.getBoundingClientRect();
				let currentLeft = parseInt(win.style.left, 10);
				let currentTop = parseInt(win.style.top, 10);
				let currentWidth = parseInt(win.style.width, 10) || rect.width;
				let currentHeight = parseInt(win.style.height, 10) || rect.height;

				currentWidth = Math.max(160, Math.min(currentWidth, bounds.width));
				currentHeight = Math.max(80, Math.min(currentHeight, bounds.height));
				win.style.width = `${currentWidth}px`;
				win.style.height = `${currentHeight}px`;

				if (isNaN(currentLeft)) currentLeft = rect.left;
				if (isNaN(currentTop)) currentTop = rect.top;

				const maxLeft = bounds.right - 80;
				const maxTop = bounds.bottom - 40;
				const clampedLeft = Math.max(bounds.left, Math.min(currentLeft, maxLeft));
				const clampedTop = Math.max(bounds.top, Math.min(currentTop, maxTop));

				win.style.left = `${clampedLeft}px`;
				win.style.top = `${clampedTop}px`;
			});
		}

		getNextPosition(width, height, windowId = '') {
			const mode = this.getSetting('windowPlacementMode', 'smart');
			const bounds = this.getWorkspaceBounds();

			if (mode === 'remember' && windowId && this.savedGeometries[windowId]) {
				const saved = this.savedGeometries[windowId];
				if (typeof saved.x === 'number' && typeof saved.y === 'number') {
					const clampedX = Math.max(bounds.left, Math.min(saved.x, bounds.right - 80));
					const clampedY = Math.max(bounds.top, Math.min(saved.y, bounds.bottom - 40));
					return { x: clampedX, y: clampedY };
				}
			}

			if (mode === 'center') {
				const centerX = Math.max(bounds.left + 10, bounds.left + Math.round((bounds.width - width) / 2));
				const centerY = Math.max(bounds.top + 10, bounds.top + Math.round((bounds.height - height) / 2));
				return { x: centerX, y: centerY };
			}

			if (mode === 'smart') {
				const openWins = Object.values(this.windows).filter(w => !w.classList.contains('minimized') && !w.classList.contains('xp-modal-overlay') && !w.classList.contains('window-detached') && w.style.display !== 'none');
				if (openWins.length === 0) {
					return { x: bounds.left + 30, y: bounds.top + 25 };
				}

				const stepX = 40;
				const stepY = 32;
				let bestPos = { x: bounds.left + 30, y: bounds.top + 25 };
				let minOverlapArea = Infinity;

				for (let row = 0; row < 6; row++) {
					for (let col = 0; col < 8; col++) {
						const candX = bounds.left + 24 + col * stepX;
						const candY = bounds.top + 20 + row * stepY;
						if (candX + width > bounds.right - 10 || candY + height > bounds.bottom - 10) continue;

						let totalOverlap = 0;
						for (const ow of openWins) {
							const owRect = ow.getBoundingClientRect();
							const overlapW = Math.max(0, Math.min(candX + width, owRect.right) - Math.max(candX, owRect.left));
							const overlapH = Math.max(0, Math.min(candY + height, owRect.bottom) - Math.max(candY, owRect.top));
							totalOverlap += (overlapW * overlapH);
						}

						if (totalOverlap < minOverlapArea) {
							minOverlapArea = totalOverlap;
							bestPos = { x: candX, y: candY };
							if (totalOverlap === 0) break;
						}
					}
					if (minOverlapArea === 0) break;
				}

				return bestPos;
			}

			const startX = bounds.left + 24;
			const startY = bounds.top + 20;
			const step = 26;
			const maxSteps = 10;
			let posX = startX + (this.cascadeIndex % maxSteps) * step;
			let posY = startY + (this.cascadeIndex % maxSteps) * step;
			if (posX + width > bounds.right - 20 || posY + height > bounds.bottom - 40) {
				this.cascadeIndex = 0;
				posX = startX;
				posY = startY;
			}
			this.cascadeIndex++;
			return { x: Math.max(bounds.left + 10, posX), y: Math.max(bounds.top + 10, posY) };
		}

		computeDimensions(preferredWidth, preferredHeight, isCompact = false, windowId = '') {
			const bounds = this.getWorkspaceBounds();
			const mode = this.getSetting('windowPlacementMode', 'smart');

			if (mode === 'remember' && windowId && this.savedGeometries[windowId]) {
				const saved = this.savedGeometries[windowId];
				if (saved.width && saved.height) {
					return {
						width: Math.max(160, Math.min(saved.width, bounds.width * 0.98)),
						height: Math.max(100, Math.min(saved.height, bounds.height * 0.98))
					};
				}
			}

			const maxWidth = bounds.width * 0.94;
			const maxHeight = bounds.height * 0.90;
			const minW = isCompact ? 160 : Math.max(240, Math.min(preferredWidth, maxWidth));
			const minH = isCompact ? 120 : Math.max(150, Math.min(preferredHeight, maxHeight));
			const width = Math.max(minW, Math.min(preferredWidth, maxWidth));
			const height = Math.max(minH, Math.min(preferredHeight, maxHeight));
			return { width, height };
		}

		createWindow(id, title, contentHTML, initialWidth = 600, initialHeight = 400, options = {}) {
			const windowArea = document.getElementById('window-area');
			const existingWindow = document.getElementById(id);
			if (existingWindow) {
				if (existingWindow.classList.contains('window-detached')) {
					this.reattachFromPopout(existingWindow, id);
				}
				this.bringToFront(existingWindow);
				if (existingWindow.classList.contains('minimized')) {
					this.unminimize(existingWindow);
				}
				return existingWindow;
			}

			if (window.SettingsApp && window.SettingsApp.playSound) {
				window.SettingsApp.playSound('window');
			}

			const win = document.createElement('div');
			win.id = id;
			win.className = 'xp-window opening';
			win.dataset.resizable = options.resizable === false ? 'false' : 'true';

			if (options.isModal) {
				win.style.width = `${initialWidth}px`;
				win.style.height = 'auto';
				win.style.position = 'relative';
				win.style.boxShadow = '4px 4px 15px rgba(0,0,0,0.5)';
			} else if (!options.isMenu) {
				const isCompact = options.resizable === false;
				const { width, height } = this.computeDimensions(initialWidth, initialHeight, isCompact, id);
				let posX, posY;
				const bounds = this.getWorkspaceBounds();
				if (typeof options.x === 'number' && typeof options.y === 'number') {
					posX = Math.max(bounds.left + 5, Math.min(options.x, bounds.right - width - 5));
					posY = Math.max(bounds.top + 5, Math.min(options.y, bounds.bottom - height - 5));
				} else {
					const pos = this.getNextPosition(width, height, id);
					posX = pos.x;
					posY = pos.y;
				}
				win.style.width = `${width}px`;
				win.style.height = `${height}px`;
				win.style.left = `${posX}px`;
				win.style.top = `${posY}px`;
			}

			win.style.opacity = '0';
			win.style.zIndex = String(++this.zIndexCounter);

			const minimizeBtnHTML = options.isModal ? '<div class="xp-window-button minimize-btn" style="display: none;">_</div>' : '<div class="xp-window-button minimize-btn" title="Minimize">_</div>';
			const maximizeBtnHTML = (options.resizable === false || options.isModal) ? '<div class="xp-window-button maximize-btn" style="display: none;">□</div>' : '<div class="xp-window-button maximize-btn" title="Maximize">□</div>';
			const popoutBtnHTML = options.isModal ? '' : '<div class="xp-window-button popout-btn" title="Exteriorize Window (Pop Out to New Tab)">↗</div>';

			win.innerHTML = `
				<div class="xp-window-header">
					<div style="display: flex; align-items: center; overflow: hidden; flex: 1;">
						${options.iconSrc ? `<img src="${options.iconSrc}" style="width: 16px; height: 16px; margin-right: 4px; pointer-events: none;">` : ''}
						<span class="title">${title}</span>
					</div>
					<div class="xp-window-buttons">
						${popoutBtnHTML}
						${minimizeBtnHTML}
						${maximizeBtnHTML}
						<div class="xp-window-button close-btn" title="Close">X</div>
					</div>
				</div>
				<div class="xp-window-content">${contentHTML}</div>
			`;

			if (options.isModal) {
				const overlay = document.createElement('div');
				overlay.className = 'xp-modal-overlay';
				overlay.id = `overlay-${id}`;
				overlay.appendChild(win);
				document.body.appendChild(overlay);
				this.windows[id] = win;
			} else {
				if (windowArea) windowArea.appendChild(win);
				this.windows[id] = win;
				this.makeDraggable(win);
			}

			if (options.resizable !== false && !options.isModal) {
				this.makeResizable(win);
			}

			this.setupButtons(win, id);

			setTimeout(() => {
				win.classList.remove('opening');
				win.classList.add('opened');
				win.style.opacity = '1';
			}, 50);

			if (!options.isModal) {
				win.addEventListener('mousedown', (e) => {
					if (!e.target.closest('.xp-window-buttons')) {
						this.bringToFront(win);
					}
				});
				this.bringToFront(win);
				this.setActive(win);
				if (window.Taskbar) {
					window.Taskbar.addWindowButton(id, title, options.iconSrc);
				}
			}

			if (window.DeskEventBus) {
				window.DeskEventBus.emit('window:created', { id, title, win, options });
			}

			this.queueSaveOpenWindowsState();
			return win;
		}

		getTopmostWindow() {
			const openWins = Object.values(this.windows).filter(w => !w.classList.contains('minimized') && !w.classList.contains('xp-modal-overlay') && !w.classList.contains('window-detached') && w.style.display !== 'none');
			if (openWins.length === 0) return null;
			openWins.sort((a, b) => parseInt(b.style.zIndex || '0', 10) - parseInt(a.style.zIndex || '0', 10));
			return openWins[0];
		}

		calculateMagneticAlignment(dragLeft, dragTop, dragWidth, dragHeight, currentWin) {
			const threshold = 12;
			const bounds = this.getWorkspaceBounds();
			let finalLeft = dragLeft;
			let finalTop = dragTop;
			let snappedH = null;
			let snappedV = null;

			if (Math.abs(dragLeft - bounds.left) <= threshold) {
				finalLeft = bounds.left;
				snappedV = bounds.left;
			} else if (Math.abs((dragLeft + dragWidth) - bounds.right) <= threshold) {
				finalLeft = bounds.right - dragWidth;
				snappedV = bounds.right;
			}

			if (Math.abs(dragTop - bounds.top) <= threshold) {
				finalTop = bounds.top;
				snappedH = bounds.top;
			} else if (Math.abs((dragTop + dragHeight) - bounds.bottom) <= threshold) {
				finalTop = bounds.bottom - dragHeight;
				snappedH = bounds.bottom;
			}

			const otherWindows = Object.values(this.windows).filter(w => w !== currentWin && !w.classList.contains('minimized') && !w.classList.contains('xp-modal-overlay') && !w.classList.contains('window-detached') && w.style.display !== 'none');

			for (const other of otherWindows) {
				const rect = other.getBoundingClientRect();
				const vOverlap = !(dragTop + dragHeight < rect.top - threshold || dragTop > rect.bottom + threshold);
				const hOverlap = !(dragLeft + dragWidth < rect.left - threshold || dragLeft > rect.right + threshold);

				if (vOverlap) {
					if (Math.abs((dragLeft + dragWidth) - rect.left) <= threshold) {
						finalLeft = rect.left - dragWidth;
						snappedV = rect.left;
					} else if (Math.abs(dragLeft - rect.right) <= threshold) {
						finalLeft = rect.right;
						snappedV = rect.right;
					} else if (Math.abs(dragLeft - rect.left) <= threshold) {
						finalLeft = rect.left;
						snappedV = rect.left;
					} else if (Math.abs((dragLeft + dragWidth) - rect.right) <= threshold) {
						finalLeft = rect.right - dragWidth;
						snappedV = rect.right;
					}
				}

				if (hOverlap) {
					if (Math.abs((dragTop + dragHeight) - rect.top) <= threshold) {
						finalTop = rect.top - dragHeight;
						snappedH = rect.top;
					} else if (Math.abs(dragTop - rect.bottom) <= threshold) {
						finalTop = rect.bottom;
						snappedH = rect.bottom;
					} else if (Math.abs(dragTop - rect.top) <= threshold) {
						finalTop = rect.top;
						snappedH = rect.top;
					} else if (Math.abs((dragTop + dragHeight) - rect.bottom) <= threshold) {
						finalTop = rect.bottom - dragHeight;
						snappedH = rect.bottom;
					}
				}
			}

			this.hideGuides();
			if (snappedH !== null) this.showGuide('h', snappedH);
			if (snappedV !== null) this.showGuide('v', snappedV);

			return { left: finalLeft, top: finalTop };
		}

		calculateSnapRegion(clientX, clientY) {
			const enabled = this.getSetting('windowEdgeSnapping', true);
			if (!enabled) return null;

			const threshold = parseInt(this.getSetting('windowSnapThreshold', 24), 10);
			const bounds = this.getWorkspaceBounds();

			const nearLeft = clientX <= bounds.left + threshold;
			const nearRight = clientX >= bounds.right - threshold;
			const nearTop = clientY <= bounds.top + threshold;
			const nearBottom = clientY >= bounds.bottom - threshold;

			const halfW = Math.round(bounds.width / 2);
			const halfH = Math.round(bounds.height / 2);

			if (nearTop && nearLeft) {
				return { type: 'top-left', rect: { left: bounds.left, top: bounds.top, width: halfW, height: halfH } };
			}
			if (nearTop && nearRight) {
				return { type: 'top-right', rect: { left: bounds.left + halfW, top: bounds.top, width: halfW, height: halfH } };
			}
			if (nearBottom && nearLeft) {
				return { type: 'bottom-left', rect: { left: bounds.left, top: bounds.top + halfH, width: halfW, height: halfH } };
			}
			if (nearBottom && nearRight) {
				return { type: 'bottom-right', rect: { left: bounds.left + halfW, top: bounds.top + halfH, width: halfW, height: halfH } };
			}
			if (nearTop) {
				return { type: 'maximize', rect: { left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height } };
			}
			if (nearLeft) {
				return { type: 'left', rect: { left: bounds.left, top: bounds.top, width: halfW, height: bounds.height } };
			}
			if (nearRight) {
				return { type: 'right', rect: { left: bounds.left + halfW, top: bounds.top, width: halfW, height: bounds.height } };
			}

			return null;
		}

		showSnapPreview(rect) {
			if (!this.snapPreviewEl) this.initSnapPreviewElement();
			if (!this.getSetting('windowSnapPreview', true)) return;

			this.snapPreviewEl.style.left = `${rect.left}px`;
			this.snapPreviewEl.style.top = `${rect.top}px`;
			this.snapPreviewEl.style.width = `${rect.width}px`;
			this.snapPreviewEl.style.height = `${rect.height}px`;
			this.snapPreviewEl.style.display = 'block';
		}

		hideSnapPreview() {
			if (this.snapPreviewEl) {
				this.snapPreviewEl.style.display = 'none';
			}
		}

		snap(win, type) {
			if (!win || win.classList.contains('xp-modal-overlay') || win.dataset.resizable === 'false') return;
			const bounds = this.getWorkspaceBounds();
			const halfW = Math.round(bounds.width / 2);
			const halfH = Math.round(bounds.height / 2);

			if (!win.dataset.unsnappedLeft && !win.classList.contains('maximized')) {
				win.dataset.unsnappedLeft = win.style.left;
				win.dataset.unsnappedTop = win.style.top;
				win.dataset.unsnappedWidth = win.style.width;
				win.dataset.unsnappedHeight = win.style.height;
			}

			win.style.transition = 'all 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)';

			switch (type) {
				case 'left':
					win.classList.remove('maximized');
					win.style.left = `${bounds.left}px`;
					win.style.top = `${bounds.top}px`;
					win.style.width = `${halfW}px`;
					win.style.height = `${bounds.height}px`;
					win.dataset.snapped = 'left';
					break;
				case 'right':
					win.classList.remove('maximized');
					win.style.left = `${bounds.left + halfW}px`;
					win.style.top = `${bounds.top}px`;
					win.style.width = `${halfW}px`;
					win.style.height = `${bounds.height}px`;
					win.dataset.snapped = 'right';
					break;
				case 'top':
					win.classList.remove('maximized');
					win.style.left = `${bounds.left}px`;
					win.style.top = `${bounds.top}px`;
					win.style.width = `${bounds.width}px`;
					win.style.height = `${halfH}px`;
					win.dataset.snapped = 'top';
					break;
				case 'bottom':
					win.classList.remove('maximized');
					win.style.left = `${bounds.left}px`;
					win.style.top = `${bounds.top + halfH}px`;
					win.style.width = `${bounds.width}px`;
					win.style.height = `${halfH}px`;
					win.dataset.snapped = 'bottom';
					break;
				case 'top-left':
					win.classList.remove('maximized');
					win.style.left = `${bounds.left}px`;
					win.style.top = `${bounds.top}px`;
					win.style.width = `${halfW}px`;
					win.style.height = `${halfH}px`;
					win.dataset.snapped = 'top-left';
					break;
				case 'top-right':
					win.classList.remove('maximized');
					win.style.left = `${bounds.left + halfW}px`;
					win.style.top = `${bounds.top}px`;
					win.style.width = `${halfW}px`;
					win.style.height = `${halfH}px`;
					win.dataset.snapped = 'top-right';
					break;
				case 'bottom-left':
					win.classList.remove('maximized');
					win.style.left = `${bounds.left}px`;
					win.style.top = `${bounds.top + halfH}px`;
					win.style.width = `${halfW}px`;
					win.style.height = `${halfH}px`;
					win.dataset.snapped = 'bottom-left';
					break;
				case 'bottom-right':
					win.classList.remove('maximized');
					win.style.left = `${bounds.left + halfW}px`;
					win.style.top = `${bounds.top + halfH}px`;
					win.style.width = `${halfW}px`;
					win.style.height = `${halfH}px`;
					win.dataset.snapped = 'bottom-right';
					break;
				case 'center':
					this.restoreSnap(win);
					const rect = win.getBoundingClientRect();
					win.style.left = `${bounds.left + Math.max(10, Math.round((bounds.width - rect.width) / 2))}px`;
					win.style.top = `${bounds.top + Math.max(10, Math.round((bounds.height - rect.height) / 2))}px`;
					break;
				case 'maximize':
					this.maximize(win);
					break;
				case 'restore':
					this.restoreSnap(win);
					break;
			}

			setTimeout(() => {
				win.style.transition = '';
			}, 180);

			this.bringToFront(win);
		}

		restoreSnap(win) {
			if (!win) return;
			if (win.classList.contains('maximized')) {
				this.maximize(win);
				return;
			}
			if (win.dataset.unsnappedLeft) {
				win.style.transition = 'all 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)';
				win.style.left = win.dataset.unsnappedLeft;
				win.style.top = win.dataset.unsnappedTop;
				win.style.width = win.dataset.unsnappedWidth;
				win.style.height = win.dataset.unsnappedHeight;
				delete win.dataset.unsnappedLeft;
				delete win.dataset.unsnappedTop;
				delete win.dataset.unsnappedWidth;
				delete win.dataset.unsnappedHeight;
				delete win.dataset.snapped;
				setTimeout(() => {
					win.style.transition = '';
				}, 180);
			}
		}

		toggleAlwaysOnTop(win) {
			if (!win) return;
			const isPinned = win.classList.toggle('window-always-on-top');
			if (isPinned) {
				win.style.zIndex = String(40000 + (++this.zIndexCounter));
			} else {
				win.style.zIndex = String(++this.zIndexCounter);
			}
			this.setActive(win);
		}

		toggleRollup(win) {
			if (!win || win.classList.contains('xp-modal-overlay')) return;
			const isRolledUp = win.classList.toggle('window-rolled-up');
			if (isRolledUp) {
				win.dataset.preRollupHeight = win.style.height;
			} else if (win.dataset.preRollupHeight) {
				win.style.height = win.dataset.preRollupHeight;
				delete win.dataset.preRollupHeight;
			}
			this.bringToFront(win);
		}

		setOpacity(win, opacityValue) {
			if (!win) return;
			const val = Math.max(0.2, Math.min(1.0, parseFloat(opacityValue)));
			win.style.opacity = String(val);
			win.dataset.customOpacity = String(val);
		}

		detachToPopout(win, id) {
			if (!win || win.classList.contains('xp-modal-overlay') || win.classList.contains('window-detached')) return;

			const title = win.querySelector('.xp-window-header .title')?.textContent || 'Windows XP';
			const contentContainer = win.querySelector('.xp-window-content');
			if (!contentContainer) return;

			const rect = win.getBoundingClientRect();
			const w = Math.max(400, Math.round(rect.width));
			const h = Math.max(300, Math.round(rect.height));

			const popup = window.open('', `xp_popout_${id}_${Date.now()}`, `width=${w},height=${h},left=${window.screenX + 60},top=${window.screenY + 60},menubar=no,toolbar=no,location=no,status=no,resizable=yes`);
			if (!popup) {
				this.showDialog('Popup Blocked', 'Please allow popups in your browser to exteriorize this window into a separate floating tab.', 'warning');
				return;
			}

			let stylesHTML = '';
			document.querySelectorAll('link[rel="stylesheet"], style').forEach(el => {
				stylesHTML += el.outerHTML;
			});

			const bodyClass = document.body.className || 'theme-luna-blue';
			const contentCloneHTML = contentContainer.innerHTML;

			popup.document.open();
			popup.document.write(`
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<title>${title}</title>
					${stylesHTML}
					<style>
						html, body {
							margin: 0;
							padding: 0;
							width: 100vw;
							height: 100vh;
							overflow: hidden;
							background-color: var(--xp-window-bg, #ece9d8);
							font-family: 'Tahoma', Arial, sans-serif;
							display: flex;
							flex-direction: column;
						}
						#xp-popout-toolbar {
							height: 26px;
							background: linear-gradient(to bottom, #ece9d8, #dcd7c8);
							border-bottom: 1px solid #7f9db9;
							display: flex;
							align-items: center;
							justify-content: space-between;
							padding: 0 8px;
							font-size: 11px;
							user-select: none;
							flex-shrink: 0;
						}
						#xp-popout-content-host {
							flex: 1;
							overflow: auto;
							position: relative;
							background: #ffffff;
						}
					</style>
				</head>
				<body class="${bodyClass}">
					<div id="xp-popout-toolbar">
						<span style="font-weight: bold; color: #0c327d;">${title} (Exteriorized)</span>
						<button type="button" class="xp-button" id="btn-redock" style="height: 20px; font-size: 10px;">Re-dock to Desktop</button>
					</div>
					<div id="xp-popout-content-host">${contentCloneHTML}</div>
				</body>
				</html>
			`);
			popup.document.close();

			win.classList.add('window-detached');
			const taskbarBtn = document.querySelector(`.taskbar-window-btn[data-window-id="${id}"]`);
			if (taskbarBtn) {
				taskbarBtn.classList.add('detached');
				taskbarBtn.title = `${title} (External Window)`;
			}

			const redockBtn = popup.document.getElementById('btn-redock');
			if (redockBtn) {
				redockBtn.addEventListener('click', () => {
					popup.close();
				});
			}

			this.detachedPopups.set(id, popup);

			const checkClosedInterval = setInterval(() => {
				if (popup.closed) {
					clearInterval(checkClosedInterval);
					this.reattachFromPopout(win, id);
				}
			}, 600);

			if (window.DeskEventBus) {
				window.DeskEventBus.emit('window:detached', { id, win, popup });
			}
		}

		reattachFromPopout(win, id) {
			if (!win) return;
			const popup = this.detachedPopups.get(id);
			if (popup && !popup.closed) {
				try {
					popup.close();
				} catch (e) {}
			}
			this.detachedPopups.delete(id);
			win.classList.remove('window-detached');
			win.style.display = '';

			const taskbarBtn = document.querySelector(`.taskbar-window-btn[data-window-id="${id}"]`);
			if (taskbarBtn) {
				taskbarBtn.classList.remove('detached');
			}
			this.bringToFront(win);

			if (window.DeskEventBus) {
				window.DeskEventBus.emit('window:reattached', { id, win });
			}
		}

		makeDraggable(win) {
			const header = win.querySelector('.xp-window-header');
			const overlay = document.getElementById('iframe-drag-overlay');
			let isDragging = false;
			let offsetX = 0;
			let offsetY = 0;

			header.addEventListener('dblclick', (e) => {
				if (e.target.closest('.xp-window-buttons') || win.classList.contains('xp-modal-overlay')) return;
				if (win.classList.contains('window-rolled-up')) {
					this.toggleRollup(win);
					return;
				}
				const maxBtn = win.querySelector('.maximize-btn');
				if (maxBtn && maxBtn.style.display !== 'none') {
					this.maximize(win);
				}
			});

			header.addEventListener('contextmenu', (e) => {
				if (e.target.closest('.xp-window-buttons')) return;
				e.preventDefault();
				if (window.ContextMenu) {
					const items = window.ContextMenu.getWindowHeaderItems(win, win.id);
					window.ContextMenu.show(items, e.clientX, e.clientY);
				}
			});

			header.addEventListener('mousedown', (e) => {
				this.bringToFront(win);
				if (e.button !== 0 || e.target.closest('.xp-window-buttons')) return;

				if (win.classList.contains('maximized') || win.dataset.snapped) {
					const bounds = this.getWorkspaceBounds();
					const restoreW = parseInt(win.dataset.unsnappedWidth || win.dataset.restoreWidth || '640', 10);
					const restoreH = parseInt(win.dataset.unsnappedHeight || win.dataset.restoreHeight || '440', 10);

					win.classList.remove('maximized');
					delete win.dataset.snapped;
					win.style.width = `${restoreW}px`;
					win.style.height = `${restoreH}px`;

					const clickRatio = Math.max(0.1, Math.min(0.9, e.clientX / window.innerWidth));
					offsetX = Math.round(restoreW * clickRatio);
					offsetY = e.clientY - bounds.top;

					win.style.left = `${e.clientX - offsetX}px`;
					win.style.top = `${e.clientY - offsetY}px`;

					const maxBtn = win.querySelector('.maximize-btn');
					if (maxBtn) {
						maxBtn.textContent = '□';
						maxBtn.title = 'Maximize';
					}
				} else {
					const rect = win.getBoundingClientRect();
					offsetX = e.clientX - rect.left;
					offsetY = e.clientY - rect.top;
				}

				isDragging = true;
				if (overlay) overlay.style.display = 'block';
				document.body.classList.add('iframe-overlay-active');

				win.style.cursor = 'grabbing';
				win.style.transition = 'none';
			});

			const onMouseMove = (e) => {
				if (!isDragging) return;
				const bounds = this.getWorkspaceBounds();
				const winRect = win.getBoundingClientRect();

				let rawLeft = e.clientX - offsetX;
				let rawTop = e.clientY - offsetY;

				rawLeft = Math.max(bounds.left - winRect.width + 40, Math.min(rawLeft, bounds.right - 40));
				rawTop = Math.max(bounds.top, Math.min(rawTop, bounds.bottom - 30));

				const magnetic = this.calculateMagneticAlignment(rawLeft, rawTop, winRect.width, winRect.height, win);

				win.style.left = `${magnetic.left}px`;
				win.style.top = `${magnetic.top}px`;
				win.style.transform = 'none';

				const snapRegion = this.calculateSnapRegion(e.clientX, e.clientY);
				if (snapRegion) {
					this.activeSnapTarget = snapRegion;
					this.showSnapPreview(snapRegion.rect);
				} else {
					this.activeSnapTarget = null;
					this.hideSnapPreview();
				}
			};

			const onMouseUp = () => {
				if (isDragging) {
					isDragging = false;
					this.hideSnapPreview();
					this.hideGuides();
					if (overlay) overlay.style.display = 'none';
					document.body.classList.remove('iframe-overlay-active');
					win.style.cursor = 'default';
					win.style.transition = '';

					if (this.activeSnapTarget) {
						this.snap(win, this.activeSnapTarget.type);
						this.activeSnapTarget = null;
					}

					if (this.getSetting('windowRememberPositions', true) && win.id && !win.dataset.snapped && !win.classList.contains('maximized')) {
						this.savedGeometries[win.id] = {
							x: parseInt(win.style.left, 10),
							y: parseInt(win.style.top, 10),
							width: parseInt(win.style.width, 10),
							height: parseInt(win.style.height, 10)
						};
						this.saveGeometries();
					}
					this.queueSaveOpenWindowsState();
				}
			};

			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('mouseup', onMouseUp);
		}

		makeResizable(win) {
			const BORDER_SIZE = 6;
			const overlay = document.getElementById('iframe-drag-overlay');
			let isResizing = false;
			let resizeDir = '';
			let startX = 0;
			let startY = 0;
			let startWidth = 0;
			let startHeight = 0;
			let startLeft = 0;
			let startTop = 0;

			win.addEventListener('mousemove', (e) => {
				if (win.classList.contains('maximized') || win.dataset.snapped || win.classList.contains('window-rolled-up') || isResizing) {
					win.style.cursor = '';
					return;
				}

				const rect = win.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;

				const onRight = x >= rect.width - BORDER_SIZE;
				const onLeft = x <= BORDER_SIZE;
				const onBottom = y >= rect.height - BORDER_SIZE;
				const onTop = y <= BORDER_SIZE;

				if (onRight && onBottom) win.style.cursor = 'nwse-resize';
				else if (onLeft && onBottom) win.style.cursor = 'nesw-resize';
				else if (onLeft && onTop) win.style.cursor = 'nwse-resize';
				else if (onRight && onTop) win.style.cursor = 'nesw-resize';
				else if (onRight) win.style.cursor = 'ew-resize';
				else if (onLeft) win.style.cursor = 'ew-resize';
				else if (onBottom) win.style.cursor = 'ns-resize';
				else if (onTop) win.style.cursor = 'ns-resize';
				else win.style.cursor = '';
			});

			win.addEventListener('mousedown', (e) => {
				if (e.button !== 0 || win.classList.contains('maximized') || win.dataset.snapped || win.classList.contains('window-rolled-up')) return;

				const rect = win.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;

				const onRight = x >= rect.width - BORDER_SIZE;
				const onLeft = x <= BORDER_SIZE;
				const onBottom = y >= rect.height - BORDER_SIZE;
				const onTop = y <= BORDER_SIZE;

				if (!onRight && !onLeft && !onBottom && !onTop) return;

				isResizing = true;
				if (overlay) overlay.style.display = 'block';
				document.body.classList.add('iframe-overlay-active');
				document.body.style.userSelect = 'none';

				resizeDir = '';
				if (onTop) resizeDir += 'n';
				if (onBottom) resizeDir += 's';
				if (onLeft) resizeDir += 'w';
				if (onRight) resizeDir += 'e';

				startX = e.clientX;
				startY = e.clientY;
				startWidth = rect.width;
				startHeight = rect.height;
				startLeft = rect.left;
				startTop = rect.top;
			});

			const handleResize = (e) => {
				if (!isResizing) return;

				if (resizeDir.includes('e')) {
					win.style.width = `${Math.max(200, startWidth + e.clientX - startX)}px`;
				}
				if (resizeDir.includes('s')) {
					win.style.height = `${Math.max(100, startHeight + e.clientY - startY)}px`;
				}
				if (resizeDir.includes('w')) {
					const width = Math.max(200, startWidth - (e.clientX - startX));
					win.style.width = `${width}px`;
					win.style.left = `${startLeft + (startWidth - width)}px`;
				}
				if (resizeDir.includes('n')) {
					const height = Math.max(100, startHeight - (e.clientY - startY));
					win.style.height = `${height}px`;
					win.style.top = `${startTop + (startHeight - height)}px`;
				}
			};

			const stopResize = () => {
				if (!isResizing) return;
				isResizing = false;
				this.hideGuides();
				if (overlay) overlay.style.display = 'none';
				document.body.classList.remove('iframe-overlay-active');
				document.body.style.userSelect = '';

				if (this.getSetting('windowRememberPositions', true) && win.id) {
					this.savedGeometries[win.id] = {
						x: parseInt(win.style.left, 10),
						y: parseInt(win.style.top, 10),
						width: parseInt(win.style.width, 10),
						height: parseInt(win.style.height, 10)
					};
					this.saveGeometries();
				}
				this.queueSaveOpenWindowsState();
			};

			document.addEventListener('mousemove', handleResize);
			document.addEventListener('mouseup', stopResize);
		}

		setupButtons(win, id) {
			const minBtn = win.querySelector('.minimize-btn');
			const maxBtn = win.querySelector('.maximize-btn');
			const popoutBtn = win.querySelector('.popout-btn');
			const closeBtn = win.querySelector('.close-btn');

			if (minBtn) minBtn.addEventListener('click', () => this.minimize(win, id));
			if (maxBtn) maxBtn.addEventListener('click', () => this.maximize(win));
			if (popoutBtn) popoutBtn.addEventListener('click', () => this.detachToPopout(win, id));
			if (closeBtn) closeBtn.addEventListener('click', () => this.close(win, id));
		}

		setActive(win) {
			const allWindows = document.querySelectorAll('.xp-window');
			allWindows.forEach(w => {
				const header = w.querySelector('.xp-window-header');
				if (header) header.classList.add('inactive');
				w.classList.add('window-inactive');
			});

			this.activeWindow = win;
			if (win) {
				const currentHeader = win.querySelector('.xp-window-header');
				if (currentHeader) currentHeader.classList.remove('inactive');
				win.classList.remove('window-inactive');
			}

			if (window.Taskbar) {
				window.Taskbar.setActiveButton(win ? win.id : null);
			}

			if (window.DeskEventBus && win) {
				window.DeskEventBus.emit('window:focused', { id: win.id, win });
			}
		}

		bringToFront(win) {
			if (!win) return;
			const isPinned = win.classList.contains('window-always-on-top');
			const baseZ = isPinned ? 40000 : 100;
			win.style.zIndex = String(baseZ + (++this.zIndexCounter));
			this.setActive(win);
		}

		minimize(win, id) {
			if (!win) return;
			if (window.SettingsApp && window.SettingsApp.playSound) {
				window.SettingsApp.playSound('window');
			}

			win.dataset.originalLeft = win.style.left;
			win.dataset.originalTop = win.style.top;
			win.dataset.originalWidth = win.style.width;
			win.dataset.originalHeight = win.style.height;

			const taskbarBtn = document.querySelector(`.taskbar-window-btn[data-window-id="${id}"]`);
			let targetLeft = 0;
			let targetTop = window.innerHeight;
			let targetWidth = 0;
			let targetHeight = 0;

			if (taskbarBtn) {
				const taskbarRect = taskbarBtn.getBoundingClientRect();
				targetLeft = taskbarRect.left;
				targetTop = taskbarRect.top;
				targetWidth = taskbarRect.width;
				targetHeight = taskbarRect.height;
			}

			let finalized = false;
			const finalizeMinimize = () => {
				if (finalized) return;
				finalized = true;
				win.classList.add('hidden');
				win.classList.remove('minimizing');
				win.classList.add('minimized');
				const taskbarBtnElement = document.querySelector(`#taskbar-windows .taskbar-window-btn[data-window-id="${id}"]`);
				if (taskbarBtnElement) {
					taskbarBtnElement.classList.remove('active');
				}
				if (this.activeWindow === win) {
					this.activeWindow = null;
					const nextTop = this.getTopmostWindow();
					if (nextTop) this.setActive(nextTop);
				}
				if (window.DeskEventBus) {
					window.DeskEventBus.emit('window:minimized', { id, win });
				}
				this.queueSaveOpenWindowsState();
			};

			const hasAnim = !document.body.classList.contains('no-window-animations') && !document.body.classList.contains('anim-instant');
			if (!hasAnim) {
				finalizeMinimize();
				return;
			}

			win.classList.add('minimizing');
			win.style.left = `${targetLeft}px`;
			win.style.top = `${targetTop}px`;
			win.style.width = `${targetWidth}px`;
			win.style.height = `${targetHeight}px`;
			win.style.opacity = '0';
			win.style.transform = 'scale(0.1)';

			const handler = (e) => {
				if (e.target === win) {
					win.removeEventListener('transitionend', handler);
					finalizeMinimize();
				}
			};
			win.addEventListener('transitionend', handler);
			setTimeout(finalizeMinimize, 400);
		}

		unminimize(win) {
			if (!win) return;
			if (window.SettingsApp && window.SettingsApp.playSound) {
				window.SettingsApp.playSound('window');
			}
			win.classList.remove('hidden', 'minimized');

			win.style.left = win.dataset.originalLeft || '50px';
			win.style.top = win.dataset.originalTop || '50px';
			win.style.width = win.dataset.originalWidth || '600px';
			win.style.height = win.dataset.originalHeight || '400px';
			win.style.opacity = win.dataset.customOpacity || '1';
			win.style.transform = 'none';

			const hasAnim = !document.body.classList.contains('no-window-animations') && !document.body.classList.contains('anim-instant');
			if (hasAnim) {
				win.classList.add('opening');
				const handler = (e) => {
					if (e.target === win) {
						win.classList.remove('opening');
						win.removeEventListener('transitionend', handler);
					}
				};
				win.addEventListener('transitionend', handler);
				setTimeout(() => win.classList.remove('opening'), 350);
			}
			this.bringToFront(win);

			if (window.DeskEventBus) {
				window.DeskEventBus.emit('window:restored', { id: win.id, win });
			}
			this.queueSaveOpenWindowsState();
		}

		maximize(win) {
			if (!win) return;
			const maxBtn = win.querySelector('.maximize-btn');
			const bounds = this.getWorkspaceBounds();

			if (win.classList.contains('maximized')) {
				win.style.transition = 'none';
				win.style.top = win.dataset.restoreTop || `${bounds.top + 30}px`;
				win.style.left = win.dataset.restoreLeft || `${bounds.left + 30}px`;
				win.style.width = win.dataset.restoreWidth || '640px';
				win.style.height = win.dataset.restoreHeight || '440px';
				win.classList.remove('maximized');
				if (maxBtn) {
					maxBtn.textContent = '□';
					maxBtn.title = 'Maximize';
				}
				setTimeout(() => {
					win.style.transition = '';
				}, 50);
				if (window.DeskEventBus) {
					window.DeskEventBus.emit('window:restored', { id: win.id, win });
				}
			} else {
				win.dataset.restoreTop = win.style.top;
				win.dataset.restoreLeft = win.style.left;
				win.dataset.restoreWidth = win.style.width;
				win.dataset.restoreHeight = win.style.height;

				win.style.transition = 'none';
				win.style.top = `${bounds.top}px`;
				win.style.left = `${bounds.left}px`;
				win.style.width = `${bounds.width}px`;
				win.style.height = `${bounds.height}px`;
				win.style.transform = 'none';
				win.classList.add('maximized');
				if (maxBtn) {
					maxBtn.textContent = '❐';
					maxBtn.title = 'Restore Down';
				}
				if (window.AchievementsManager) {
					window.AchievementsManager.progress('maximize_window', 1);
				}
				setTimeout(() => {
					win.style.transition = '';
				}, 50);
				if (window.DeskEventBus) {
					window.DeskEventBus.emit('window:maximized', { id: win.id, win });
				}
			}
			this.queueSaveOpenWindowsState();
		}

		close(win, id) {
			if (!win) return;
			if (typeof win.beforeClose === 'function') {
				const allowClose = win.beforeClose(() => this.forceClose(win, id));
				if (allowClose === false) return;
			}
			this.forceClose(win, id);
		}

		forceClose(win, id) {
			let cleanedUp = false;
			const overlay = document.getElementById(`overlay-${id}`);
			const popup = this.detachedPopups.get(id);
			if (popup && !popup.closed) {
				try {
					popup.close();
				} catch (e) {}
				this.detachedPopups.delete(id);
			}

			const cleanup = () => {
				if (cleanedUp) return;
				cleanedUp = true;
				if (overlay) {
					overlay.remove();
				} else if (win.parentElement) {
					win.remove();
				}
				delete this.windows[id];
				if (window.Taskbar) {
					window.Taskbar.removeWindowButton(id);
				}
				if (this.activeWindow === win) {
					this.activeWindow = null;
					const nextTop = this.getTopmostWindow();
					if (nextTop) this.setActive(nextTop);
				}
				if (window.DeskEventBus) {
					window.DeskEventBus.emit('window:closed', { id });
				}
				this.queueSaveOpenWindowsState();
			};

			const hasAnim = !document.body.classList.contains('no-window-animations') && !document.body.classList.contains('anim-instant');
			if (!hasAnim || overlay) {
				cleanup();
				return;
			}

			win.classList.add('minimizing');
			win.style.opacity = '0';
			win.style.transform = 'scale(0.1)';

			const handler = (e) => {
				if (e.target === win) {
					win.removeEventListener('transitionend', handler);
					cleanup();
				}
			};
			win.addEventListener('transitionend', handler);
			setTimeout(cleanup, 400);
		}

		closeAll() {
			Object.keys(this.windows).forEach(id => {
				const win = this.windows[id];
				if (win) this.close(win, id);
			});
		}

		minimizeAll() {
			Object.keys(this.windows).forEach(id => {
				const win = this.windows[id];
				if (win && !win.classList.contains('minimized')) {
					this.minimize(win, id);
				}
			});
		}

		cascade() {
			const bounds = this.getWorkspaceBounds();
			const visibleWins = Object.values(this.windows).filter(w => !w.classList.contains('minimized') && !w.classList.contains('xp-modal-overlay') && !w.classList.contains('window-detached') && w.style.display !== 'none');
			if (visibleWins.length === 0) return;
			const offset = 26;
			visibleWins.forEach((win, idx) => {
				if (win.classList.contains('maximized')) {
					this.maximize(win);
				}
				win.style.left = `${bounds.left + offset * (idx % 10) + 20}px`;
				win.style.top = `${bounds.top + offset * (idx % 10) + 20}px`;
				this.bringToFront(win);
			});
		}

		tile(horizontal = true) {
			const visibleWins = Object.values(this.windows).filter(w => !w.classList.contains('minimized') && !w.classList.contains('xp-modal-overlay') && !w.classList.contains('window-detached') && w.style.display !== 'none');
			const count = visibleWins.length;
			if (count === 0) return;

			const bounds = this.getWorkspaceBounds();

			visibleWins.forEach((win, idx) => {
				if (win.classList.contains('maximized')) {
					this.maximize(win);
				}
				if (horizontal) {
					const h = Math.round(bounds.height / count);
					win.style.left = `${bounds.left}px`;
					win.style.top = `${bounds.top + idx * h}px`;
					win.style.width = `${bounds.width}px`;
					win.style.height = `${h}px`;
				} else {
					const w = Math.round(bounds.width / count);
					win.style.left = `${bounds.left + idx * w}px`;
					win.style.top = `${bounds.top}px`;
					win.style.width = `${w}px`;
					win.style.height = `${bounds.height}px`;
				}
				this.bringToFront(win);
			});
		}

		showDialog(title, message, type = 'info', options = {}) {
			const id = `dialog-${Date.now()}`;
			let iconSrc = '';

			if (window.SettingsApp && window.SettingsApp.playSound) {
				if (type === 'error') window.SettingsApp.playSound('error');
				else if (type === 'warning') window.SettingsApp.playSound('exclamation');
				else if (type === 'question') window.SettingsApp.playSound('question');
				else window.SettingsApp.playSound('asterisk');
			}

			switch (type) {
				case 'error':
					iconSrc = 'https://api.iconify.design/mdi/close-circle.svg?color=red';
					break;
				case 'warning':
					iconSrc = 'https://api.iconify.design/mdi/alert.svg?color=orange';
					break;
				case 'question':
					iconSrc = 'https://api.iconify.design/mdi/help-circle.svg?color=blue';
					break;
				default:
					iconSrc = 'https://api.iconify.design/mdi/information.svg?color=blue';
			}

			const buttons = options.buttons || ['OK'];
			const buttonsHTML = buttons.map(btn => `<button class="xp-button" data-result="${btn}">${btn}</button>`).join('');

			const contentHTML = `
				<div class="xp-dialog-content">
					<img src="${iconSrc}" class="xp-dialog-icon" alt="${type}">
					<div style="font-size: 11px; line-height: 1.5; align-self: center;">${message}</div>
				</div>
				<div class="xp-dialog-buttons">
					${buttonsHTML}
				</div>
			`;

			const dialog = this.createWindow(id, title, contentHTML, 350, 150, {
				resizable: false,
				isModal: true
			});

			dialog.querySelector('.xp-window-content').style.padding = '0';
			dialog.querySelector('.xp-window-content').style.display = 'flex';
			dialog.querySelector('.xp-window-content').style.flexDirection = 'column';

			const btnElements = dialog.querySelectorAll('.xp-dialog-buttons .xp-button');
			btnElements.forEach(btn => {
				btn.addEventListener('click', () => {
					const result = btn.dataset.result;
					this.close(dialog, id);
					if (options.callback) options.callback(result);
				});

				if (buttons.length === 1 || btn.dataset.result === 'Yes' || btn.dataset.result === 'OK') {
					btn.focus();
				}
			});

			return dialog;
		}
	}

	window.WindowManager = new WindowManager();
})();
