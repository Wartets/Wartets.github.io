/**
 * Authentic Windows XP Taskbar Engine
 * Highly extensible, modular taskbar with quick launch, system tray, and clock integration.
 */
(function () {
	let taskbarEl = null;
	let startBtnEl = null;
	let quickLaunchEl = null;
	let windowsContainerEl = null;
	let systemTrayEl = null;
	let clockEl = null;
	let taskbarMenuEl = null;
	let buttonMenuEl = null;
	let volumePopupEl = null;
	let previewPopupEl = null;
	let balloonContainerEl = null;
	let trayChevronEl = null;
	let trayHiddenGroupEl = null;
	let volumeSliderEl = null;
	let volumeMuteEl = null;

	let isTrayExpanded = false;
	let clockInterval = null;
	let flashingButtons = new Map();
	let previewHoverTimeout = null;
	let customTrayIcons = new Map();

	const Taskbar = {
		init() {
			taskbarEl = document.getElementById('taskbar');
			if (!taskbarEl) return;

			startBtnEl = document.getElementById('taskbar-start-button');
			quickLaunchEl = document.getElementById('quick-launch-bar');
			windowsContainerEl = document.getElementById('taskbar-windows');
			systemTrayEl = document.getElementById('taskbar-system-tray');
			clockEl = document.getElementById('taskbar-clock');
			trayChevronEl = document.getElementById('tray-chevron-btn');
			trayHiddenGroupEl = document.getElementById('tray-hidden-icons');
			volumePopupEl = document.getElementById('taskbar-volume-popup');
			volumeSliderEl = document.getElementById('taskbar-volume-slider');
			volumeMuteEl = document.getElementById('taskbar-volume-mute');

			this.createDomElements();
			this.createContextMenus();
			this.bindEvents();
			this.initClock();
			this.updateDensity();
			this.updateUnreadBadges();
		},

		createDomElements() {
			if (!previewPopupEl) {
				previewPopupEl = document.createElement('div');
				previewPopupEl.id = 'taskbar-window-preview';
				previewPopupEl.className = 'xp-taskbar-preview hidden';
				document.body.appendChild(previewPopupEl);
			}

			if (!balloonContainerEl) {
				balloonContainerEl = document.createElement('div');
				balloonContainerEl.id = 'taskbar-balloon-container';
				balloonContainerEl.className = 'xp-taskbar-balloon-container';
				document.body.appendChild(balloonContainerEl);
			}
		},

		createContextMenus() {},

		bindEvents() {
			const showDesktopBtn = document.getElementById('show-desktop-icon');
			if (showDesktopBtn) {
				showDesktopBtn.addEventListener('click', (e) => {
					e.stopPropagation();
					this.showDesktop();
				});
			}

			const settingsLaunch = document.getElementById('quick-launch-settings');
			if (settingsLaunch) {
				settingsLaunch.addEventListener('click', () => {
					if (window.SettingsApp) window.SettingsApp.open('system');
				});
			}

			const ieLaunch = document.getElementById('quick-launch-ie');
			if (ieLaunch) {
				ieLaunch.addEventListener('click', () => {
					if (typeof openInternetExplorer === 'function') openInternetExplorer();
				});
			}

			const oeLaunch = document.getElementById('quick-launch-oe');
			if (oeLaunch) {
				oeLaunch.addEventListener('click', () => {
					if (typeof openOutlookExpress === 'function') openOutlookExpress();
				});
			}

			const winampLaunch = document.getElementById('quick-launch-winamp');
			if (winampLaunch) {
				winampLaunch.addEventListener('click', () => {
					if (typeof openWinamp === 'function') openWinamp();
				});
			}

			const mineLaunch = document.getElementById('quick-launch-mine');
			if (mineLaunch) {
				mineLaunch.addEventListener('click', () => {
					if (typeof openMinesweeper === 'function') openMinesweeper();
				});
			}

			if (trayChevronEl) {
				trayChevronEl.addEventListener('click', (e) => {
					e.stopPropagation();
					this.toggleTrayExpansion();
				});
			}

			const trayVolumeBtn = document.getElementById('tray-volume-btn');
			if (trayVolumeBtn) {
				trayVolumeBtn.addEventListener('click', (e) => {
					e.stopPropagation();
					this.toggleVolumePopup(e);
				});
			}

			const trayNetworkBtn = document.getElementById('tray-network-btn');
			if (trayNetworkBtn) {
				trayNetworkBtn.addEventListener('click', (e) => {
					e.stopPropagation();
					if (window.DeskAPI && window.DeskAPI.openNetworkPlaces) {
						window.DeskAPI.openNetworkPlaces();
					}
				});
			}

			const trayMailBtn = document.getElementById('tray-mail-btn');
			if (trayMailBtn) {
				trayMailBtn.addEventListener('click', (e) => {
					e.stopPropagation();
					if (typeof openOutlookExpress === 'function') openOutlookExpress();
				});
			}

			if (clockEl) {
				clockEl.addEventListener('click', (e) => {
					e.stopPropagation();
					const calendarPopup = document.getElementById('calendar-popup');
					if (calendarPopup) {
						const isHidden = calendarPopup.classList.contains('hidden');
						if (isHidden && typeof renderCalendar === 'function' && typeof currentCalendarDate !== 'undefined') {
							renderCalendar(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth());
						}
						calendarPopup.classList.toggle('hidden');
					}
				});
			}

			if (taskbarEl) {
				taskbarEl.addEventListener('contextmenu', (e) => {
					if (e.target.closest('.taskbar-window-btn') || e.target.closest('#taskbar-start-button')) return;
					e.preventDefault();
					if (window.ContextMenu) {
						const items = window.ContextMenu.getTaskbarItems();
						window.ContextMenu.show(items, e.clientX, e.clientY);
					}
				});
			}

			document.addEventListener('mousedown', (e) => {
				if (volumePopupEl && !volumePopupEl.contains(e.target) && !e.target.closest('#tray-volume-btn')) {
					volumePopupEl.classList.add('hidden');
				}
			});

			if (volumeSliderEl) {
				volumeSliderEl.addEventListener('input', () => {
					const vol = parseFloat(volumeSliderEl.value);
					if (window.SettingsApp) {
						window.SettingsApp.set('soundVolume', vol);
						window.SettingsApp.playSound('click');
					}
				});
			}

			if (volumeMuteEl) {
				volumeMuteEl.addEventListener('change', () => {
					const isMuted = volumeMuteEl.checked;
					if (window.SettingsApp) {
						window.SettingsApp.set('soundEnabled', !isMuted);
					}
					const volImg = document.querySelector('#tray-volume-btn img');
					if (volImg) {
						volImg.src = isMuted 
							? 'https://api.iconify.design/mdi/volume-mute.svg?color=%23ffffff' 
							: 'https://api.iconify.design/mdi/volume-high.svg?color=%23ffffff';
					}
				});
			}

			window.addEventListener('resize', () => {
				this.updateDensity();
			});
		},

		initClock() {
			if (clockInterval) clearInterval(clockInterval);
			const update = () => {
				if (!clockEl) return;
				const now = new Date();
				const is12h = window.SettingsApp ? (window.SettingsApp.get('clockFormat') === '12h') : false;
				const showSeconds = window.SettingsApp ? window.SettingsApp.get('showClockSeconds') : true;

				let hoursNum = now.getHours();
				let ampm = '';
				if (is12h) {
					ampm = hoursNum >= 12 ? ' PM' : ' AM';
					hoursNum = hoursNum % 12 || 12;
				}
				const hours = String(hoursNum).padStart(2, '0');
				const minutes = String(now.getMinutes()).padStart(2, '0');
				const seconds = String(now.getSeconds()).padStart(2, '0');
				
				clockEl.textContent = showSeconds ? `${hours}:${minutes}:${seconds}${ampm}` : `${hours}:${minutes}${ampm}`;
				clockEl.title = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
			};
			update();
			clockInterval = setInterval(update, 1000);
		},

		addWindowButton(id, title, iconSrc) {
			if (!windowsContainerEl) return null;
			let btn = windowsContainerEl.querySelector(`.taskbar-window-btn[data-window-id="${id}"]`);
			if (btn) {
				this.updateWindowButton(id, title, iconSrc);
				return btn;
			}

			btn = document.createElement('div');
			btn.className = 'taskbar-window-btn active';
			btn.dataset.windowId = id;
			btn.title = title;

			const iconImg = document.createElement('img');
			iconImg.className = 'taskbar-btn-icon';
			iconImg.src = iconSrc || 'https://img.icons8.com/fluency/48/file.png';
			iconImg.alt = '';

			const labelSpan = document.createElement('span');
			labelSpan.className = 'taskbar-btn-text';
			labelSpan.textContent = title;

			btn.appendChild(iconImg);
			btn.appendChild(labelSpan);
			windowsContainerEl.appendChild(btn);

			btn.addEventListener('click', (e) => {
				e.stopPropagation();
				this.handleWindowButtonClick(id);
			});

			btn.addEventListener('auxclick', (e) => {
				if (e.button === 1) {
					e.preventDefault();
					e.stopPropagation();
					const win = document.getElementById(id);
					if (win && typeof closeWindow === 'function') {
						closeWindow(win, id);
					}
				}
			});

			btn.addEventListener('mouseenter', () => {
				clearTimeout(previewHoverTimeout);
				previewHoverTimeout = setTimeout(() => {
					this.showWindowPreview(id, btn);
				}, 450);
			});

			btn.addEventListener('mouseleave', () => {
				clearTimeout(previewHoverTimeout);
				this.hideWindowPreview();
			});

			btn.addEventListener('contextmenu', (e) => {
				e.preventDefault();
				e.stopPropagation();
				this.hideWindowPreview();
				if (window.ContextMenu) {
					const items = window.ContextMenu.getTaskbarButtonItems(id);
					window.ContextMenu.show(items, e.clientX, e.clientY);
				}
			});

			this.updateDensity();
			return btn;
		},

		removeWindowButton(id) {
			if (!windowsContainerEl) return;
			const btn = windowsContainerEl.querySelector(`.taskbar-window-btn[data-window-id="${id}"]`);
			if (btn) {
				btn.remove();
			}
			if (flashingButtons.has(id)) {
				clearInterval(flashingButtons.get(id));
				flashingButtons.delete(id);
			}
			this.updateDensity();
		},

		updateWindowButton(id, title, iconSrc) {
			if (!windowsContainerEl) return;
			const btn = windowsContainerEl.querySelector(`.taskbar-window-btn[data-window-id="${id}"]`);
			if (!btn) return;

			btn.title = title;
			const textEl = btn.querySelector('.taskbar-btn-text');
			if (textEl) textEl.textContent = title;

			const iconEl = btn.querySelector('.taskbar-btn-icon');
			if (iconEl && iconSrc) iconEl.src = iconSrc;
		},

		setActiveButton(id) {
			if (!windowsContainerEl) return;
			windowsContainerEl.querySelectorAll('.taskbar-window-btn').forEach(btn => {
				const isCurrent = btn.dataset.windowId === id;
				btn.classList.toggle('active', isCurrent);
			});
			if (id && flashingButtons.has(id)) {
				clearInterval(flashingButtons.get(id));
				flashingButtons.delete(id);
				const activeBtn = windowsContainerEl.querySelector(`.taskbar-window-btn[data-window-id="${id}"]`);
				if (activeBtn) activeBtn.classList.remove('flashing');
			}
		},

		flashWindowButton(id) {
			if (!windowsContainerEl || flashingButtons.has(id)) return;
			const btn = windowsContainerEl.querySelector(`.taskbar-window-btn[data-window-id="${id}"]`);
			if (!btn || btn.classList.contains('active')) return;

			let isFlashing = true;
			const interval = setInterval(() => {
				isFlashing = !isFlashing;
				btn.classList.toggle('flashing', isFlashing);
			}, 500);

			flashingButtons.set(id, interval);
		},

		handleWindowButtonClick(id) {
			const win = document.getElementById(id);
			if (!win) return;

			if (win.classList.contains('minimized')) {
				if (typeof unminimizeWindow === 'function') unminimizeWindow(win);
				if (typeof bringWindowToFront === 'function') bringWindowToFront(win);
			} else if (typeof activeWindow !== 'undefined' && activeWindow === win) {
				if (typeof minimizeWindow === 'function') minimizeWindow(win, id);
			} else {
				if (typeof bringWindowToFront === 'function') bringWindowToFront(win);
			}
		},

		showWindowPreview(id, buttonEl) {
			const win = document.getElementById(id);
			if (!win || !previewPopupEl) return;

			const title = win.querySelector('.xp-window-header .title')?.textContent || 'Window';
			const icon = win.querySelector('.xp-window-header img')?.src || 'https://img.icons8.com/fluency/48/file.png';

			previewPopupEl.innerHTML = `
				<div class="xp-preview-header">
					<img src="${icon}" alt="">
					<span>${title}</span>
				</div>
				<div class="xp-preview-body">
					<div class="xp-preview-placeholder">
						<span>${win.classList.contains('minimized') ? '(Minimized Window)' : 'Click to bring to focus'}</span>
					</div>
				</div>
			`;

			previewPopupEl.classList.remove('hidden');
			const btnRect = buttonEl.getBoundingClientRect();
			const prevRect = previewPopupEl.getBoundingClientRect();

			let left = btnRect.left + (btnRect.width / 2) - (prevRect.width / 2);
			if (left < 4) left = 4;
			if (left + prevRect.width > window.innerWidth - 4) left = window.innerWidth - prevRect.width - 4;

			previewPopupEl.style.left = `${left}px`;
			previewPopupEl.style.top = `${btnRect.top - prevRect.height - 6}px`;
		},

		hideWindowPreview() {
			if (previewPopupEl) previewPopupEl.classList.add('hidden');
		},

		showBalloon(title, message, iconSrc = 'https://api.iconify.design/mdi/information.svg?color=%23245edc', duration = 6000, onClick = null) {
			if (window.SettingsApp && !window.SettingsApp.get('taskbarBalloons')) return;
			if (!balloonContainerEl) this.createDomElements();

			const balloon = document.createElement('div');
			balloon.className = 'xp-taskbar-balloon';
			balloon.innerHTML = `
				<div class="xp-balloon-header">
					<div style="display:flex;align-items:center;gap:4px;">
						<img src="${iconSrc}" class="xp-balloon-icon" alt="">
						<strong>${title}</strong>
					</div>
					<button class="xp-balloon-close" type="button">×</button>
				</div>
				<div class="xp-balloon-body">${message}</div>
			`;

			if (window.SettingsApp && window.SettingsApp.playSound) {
				window.SettingsApp.playSound('asterisk');
			}

			const removeBalloon = () => {
				balloon.classList.add('fading');
				setTimeout(() => balloon.remove(), 250);
			};

			balloon.querySelector('.xp-balloon-close').addEventListener('click', (e) => {
				e.stopPropagation();
				removeBalloon();
			});

			if (onClick) {
				balloon.addEventListener('click', () => {
					removeBalloon();
					onClick();
				});
			}

			balloonContainerEl.appendChild(balloon);

			if (duration > 0) {
				setTimeout(() => {
					if (balloon.parentElement) removeBalloon();
				}, duration);
			}
		},

		registerTrayIcon(id, options) {
			if (customTrayIcons.has(id)) {
				this.removeTrayIcon(id);
			}
			const iconItem = document.createElement('div');
			iconItem.className = 'tray-icon-item';
			iconItem.id = `tray-custom-${id}`;
			iconItem.title = options.title || id;

			const img = document.createElement('img');
			img.src = options.icon;
			img.alt = options.title || id;
			iconItem.appendChild(img);

			if (options.onClick) {
				iconItem.addEventListener('click', (e) => {
					e.stopPropagation();
					options.onClick(e);
				});
			}
			if (options.onContextMenu) {
				iconItem.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					e.stopPropagation();
					options.onContextMenu(e);
				});
			}

			if (options.hidden && trayHiddenGroupEl) {
				trayHiddenGroupEl.appendChild(iconItem);
			} else if (systemTrayEl) {
				const clock = document.getElementById('taskbar-clock');
				systemTrayEl.insertBefore(iconItem, clock);
			}

			customTrayIcons.set(id, iconItem);
			return iconItem;
		},

		removeTrayIcon(id) {
			const item = customTrayIcons.get(id);
			if (item) {
				item.remove();
				customTrayIcons.delete(id);
			}
		},

		showDesktop() {
			if (typeof openWindows === 'undefined') return;
			const windows = Object.values(openWindows);
			const allMinimized = windows.every(w => w.classList.contains('minimized'));

			windows.forEach(win => {
				if (allMinimized) {
					if (typeof unminimizeWindow === 'function') unminimizeWindow(win);
				} else {
					if (!win.classList.contains('minimized') && typeof minimizeWindow === 'function') {
						minimizeWindow(win, win.id);
					}
				}
			});
		},

		cascadeWindows() {
			if (typeof openWindows === 'undefined') return;
			const visibleWins = Object.values(openWindows).filter(w => !w.classList.contains('minimized') && !w.classList.contains('xp-modal-overlay'));
			let offset = 20;
			visibleWins.forEach((win, idx) => {
				if (win.classList.contains('maximized') && typeof maximizeWindow === 'function') {
					maximizeWindow(win);
				}
				win.style.left = `${offset * idx + 20}px`;
				win.style.top = `${offset * idx + 20}px`;
				if (typeof bringWindowToFront === 'function') bringWindowToFront(win);
			});
		},

		tileWindows(horizontal = true) {
			if (typeof openWindows === 'undefined') return;
			const visibleWins = Object.values(openWindows).filter(w => !w.classList.contains('minimized') && !w.classList.contains('xp-modal-overlay'));
			const count = visibleWins.length;
			if (count === 0) return;

			const screenW = window.innerWidth;
			const screenH = window.innerHeight - 30;

			visibleWins.forEach((win, idx) => {
				if (win.classList.contains('maximized') && typeof maximizeWindow === 'function') {
					maximizeWindow(win);
				}
				if (horizontal) {
					const h = screenH / count;
					win.style.left = '0px';
					win.style.top = `${idx * h}px`;
					win.style.width = `${screenW}px`;
					win.style.height = `${h}px`;
				} else {
					const w = screenW / count;
					win.style.left = `${idx * w}px`;
					win.style.top = '0px';
					win.style.width = `${w}px`;
					win.style.height = `${screenH}px`;
				}
				if (typeof bringWindowToFront === 'function') bringWindowToFront(win);
			});
		},

		toggleTrayExpansion() {
			if (!trayHiddenGroupEl || !trayChevronEl) return;
			isTrayExpanded = !isTrayExpanded;
			trayHiddenGroupEl.classList.toggle('hidden', !isTrayExpanded);
			trayChevronEl.classList.toggle('expanded', isTrayExpanded);
		},

		toggleVolumePopup(e) {
			if (!volumePopupEl) return;
			const isHidden = volumePopupEl.classList.contains('hidden');
			if (isHidden) {
				volumePopupEl.classList.remove('hidden');
				const rect = volumePopupEl.getBoundingClientRect();
				const anchorRect = e.currentTarget.getBoundingClientRect();
				volumePopupEl.style.left = `${Math.max(5, anchorRect.left - rect.width / 2 + 10)}px`;
				volumePopupEl.style.top = `${window.innerHeight - 30 - rect.height - 4}px`;
			} else {
				volumePopupEl.classList.add('hidden');
			}
		},

		updateDensity() {
			if (!windowsContainerEl) return;
			const buttons = Array.from(windowsContainerEl.children);
			const count = buttons.length;
			const containerWidth = windowsContainerEl.clientWidth;

			const densityPref = (window.SettingsApp && window.SettingsApp.get('taskbarDensity')) || 'auto';

			if (densityPref === 'compact') {
				windowsContainerEl.classList.add('compact');
			} else if (densityPref === 'expanded') {
				windowsContainerEl.classList.remove('compact');
			} else {
				const neededWidth = count * 155;
				windowsContainerEl.classList.toggle('compact', neededWidth > containerWidth && count > 4);
			}
		},

		updateUnreadBadges() {
			const badge = document.getElementById('outlook-unread-badge');
			const trayMailBtn = document.getElementById('tray-mail-btn');
			if (!window.DeskAPI) return;

			const count = window.DeskAPI.getUnreadMailCount();
			if (badge) {
				if (count > 0) {
					badge.textContent = count > 5 ? '5+' : String(count);
					badge.classList.remove('hidden');
				} else {
					badge.classList.add('hidden');
				}
			}

			if (trayMailBtn) {
				trayMailBtn.style.display = count > 0 ? 'inline-flex' : 'none';
				trayMailBtn.title = `${count} unread e-mail message(s)`;
			}
		}
	};

	window.Taskbar = Taskbar;
})();
