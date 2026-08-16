(function () {
	class WindowManager {
		constructor() {
			this.windows = {};
			this.zIndexCounter = 100;
			this.activeWindow = null;
			this.cascadeIndex = 0;
			this.baseSizes = {
				outlook: { width: 980, height: 640 }
			};
		}

		getNextPosition(width, height) {
			const startX = 24;
			const startY = 24;
			const step = 26;
			const maxSteps = 10;
			let posX = startX + (this.cascadeIndex % maxSteps) * step;
			let posY = startY + (this.cascadeIndex % maxSteps) * step;
			if (posX + width > window.innerWidth - 20 || posY + height > window.innerHeight - 60) {
				this.cascadeIndex = 0;
				posX = startX;
				posY = startY;
			}
			this.cascadeIndex++;
			return { x: Math.max(10, posX), y: Math.max(10, posY) };
		}

		computeDimensions(preferredWidth, preferredHeight, isCompact = false) {
			const availableWidth = window.innerWidth;
			const availableHeight = window.innerHeight - 40;
			const maxWidth = availableWidth * 0.92;
			const maxHeight = availableHeight * 0.88;
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

			if (options.isModal) {
				win.style.width = `${initialWidth}px`;
				win.style.height = 'auto';
				win.style.position = 'relative';
				win.style.boxShadow = '4px 4px 15px rgba(0,0,0,0.5)';
			} else if (!options.isMenu) {
				const isCompact = options.resizable === false;
				const { width, height } = this.computeDimensions(initialWidth, initialHeight, isCompact);
				const pos = this.getNextPosition(width, height);
				win.style.width = `${width}px`;
				win.style.height = `${height}px`;
				win.style.left = `${pos.x}px`;
				win.style.top = `${pos.y}px`;
			}

			win.style.opacity = '0';
			win.style.zIndex = String(++this.zIndexCounter);

			const minimizeBtnHTML = options.isModal ? '<div class="xp-window-button minimize-btn" style="display: none;">_</div>' : '<div class="xp-window-button minimize-btn" title="Minimize">_</div>';
			const maximizeBtnHTML = (options.resizable === false || options.isModal) ? '<div class="xp-window-button maximize-btn" style="display: none;">□</div>' : '<div class="xp-window-button maximize-btn" title="Maximize">□</div>';

			win.innerHTML = `
				<div class="xp-window-header">
					<div style="display: flex; align-items: center; overflow: hidden;">
						${options.iconSrc ? `<img src="${options.iconSrc}" style="width: 16px; height: 16px; margin-right: 4px; pointer-events: none;">` : ''}
						<span class="title">${title}</span>
					</div>
					<div class="xp-window-buttons">
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
				this.setActive(win);
				if (window.Taskbar) {
					window.Taskbar.addWindowButton(id, title, options.iconSrc);
				}
			}

			if (window.DeskEventBus) {
				window.DeskEventBus.emit('window:created', { id, title, win, options });
			}

			return win;
		}

		makeDraggable(win) {
			const header = win.querySelector('.xp-window-header');
			const overlay = document.getElementById('iframe-drag-overlay');
			let isDragging = false;
			let offsetX = 0;
			let offsetY = 0;

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
				if (e.target.closest('.xp-window-buttons')) return;
				if (win.classList.contains('maximized')) return;

				isDragging = true;
				if (overlay) overlay.style.display = 'block';
				document.body.classList.add('iframe-overlay-active');

				win.style.cursor = 'grabbing';
				win.style.transition = 'none';

				const rect = win.getBoundingClientRect();
				offsetX = e.clientX - rect.left;
				offsetY = e.clientY - rect.top;
			});

			const onMouseMove = (e) => {
				if (!isDragging) return;
				let newLeft = e.clientX - offsetX;
				let newTop = e.clientY - offsetY;

				const desktop = document.getElementById('desktop');
				const desktopRect = desktop ? desktop.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight - 30 };
				const winRect = win.getBoundingClientRect();

				newLeft = Math.max(desktopRect.left - winRect.width + 30, Math.min(newLeft, desktopRect.right - 30));
				newTop = Math.max(desktopRect.top, Math.min(newTop, desktopRect.bottom - 30));

				win.style.left = `${newLeft}px`;
				win.style.top = `${newTop}px`;
				win.style.transform = 'none';
			};

			const onMouseUp = () => {
				if (isDragging) {
					isDragging = false;
					if (overlay) overlay.style.display = 'none';
					document.body.classList.remove('iframe-overlay-active');
					win.style.cursor = 'default';
					win.style.transition = '';
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
				if (win.classList.contains('maximized') || isResizing) {
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
				if (win.classList.contains('maximized')) return;

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
				if (overlay) overlay.style.display = 'none';
				document.body.classList.remove('iframe-overlay-active');
				document.body.style.userSelect = '';
			};

			document.addEventListener('mousemove', handleResize);
			document.addEventListener('mouseup', stopResize);
		}

		setupButtons(win, id) {
			const minBtn = win.querySelector('.minimize-btn');
			const maxBtn = win.querySelector('.maximize-btn');
			const closeBtn = win.querySelector('.close-btn');

			if (minBtn) minBtn.addEventListener('click', () => this.minimize(win, id));
			if (maxBtn) maxBtn.addEventListener('click', () => this.maximize(win));
			if (closeBtn) closeBtn.addEventListener('click', () => this.close(win, id));
		}

		setActive(win) {
			const allWindows = document.querySelectorAll('.xp-window');
			allWindows.forEach(w => {
				const header = w.querySelector('.xp-window-header');
				if (header) header.classList.add('inactive');
			});

			this.activeWindow = win;
			const currentHeader = win ? win.querySelector('.xp-window-header') : null;
			if (currentHeader) currentHeader.classList.remove('inactive');

			if (window.Taskbar) {
				window.Taskbar.setActiveButton(win ? win.id : null);
			}

			if (window.DeskEventBus && win) {
				window.DeskEventBus.emit('window:focused', { id: win.id, win });
			}
		}

		bringToFront(win) {
			if (!win) return;
			if (parseInt(win.style.zIndex || '0', 10) < this.zIndexCounter) {
				win.style.zIndex = String(++this.zIndexCounter);
			}
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
				}
				if (window.DeskEventBus) {
					window.DeskEventBus.emit('window:minimized', { id, win });
				}
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
			win.style.opacity = '1';
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
		}

		maximize(win) {
			if (!win) return;
			const maxBtn = win.querySelector('.maximize-btn');

			if (win.classList.contains('maximized')) {
				win.style.transition = 'none';
				win.style.top = win.dataset.restoreTop;
				win.style.left = win.dataset.restoreLeft;
				win.style.width = win.dataset.restoreWidth;
				win.style.height = win.dataset.restoreHeight;
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
				win.style.top = '0';
				win.style.left = '0';
				win.style.width = '100vw';
				win.style.height = 'calc(100vh - 40px)';
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
			const cleanup = () => {
				if (cleanedUp) return;
				cleanedUp = true;
				const overlay = document.getElementById(`overlay-${id}`);
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
				}
				if (window.DeskEventBus) {
					window.DeskEventBus.emit('window:closed', { id });
				}
			};

			const hasAnim = !document.body.classList.contains('no-window-animations') && !document.body.classList.contains('anim-instant');
			if (!hasAnim) {
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
