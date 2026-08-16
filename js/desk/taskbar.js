/**
 * Authentic Windows XP Taskbar Engine
 * Highly extensible, modular taskbar with quick launch, system tray, and clock integration.
 */
(function () {
	const QUICK_LAUNCH_STORAGE_KEY = 'xp_quick_launch_items';

	const DEFAULT_QUICK_LAUNCH = [
		{ id: 'ql-show-desktop', name: 'Show Desktop', icon: '../assets/images/desk/XPIcon.png', action: 'show-desktop', system: true },
		{ id: 'ql-settings', name: 'Control Panel & Settings', icon: '../assets/images/desk/icons/System Properties.webp', action: 'open-settings' },
		{ id: 'ql-ie', name: 'Internet Explorer', icon: '../assets/images/desk/internet-explorer.png', action: 'open-ie' },
		{ id: 'ql-oe', name: 'Outlook Express', icon: '../assets/images/desk/OE2001.webp', action: 'open-oe', hasBadge: true },
		{ id: 'ql-cmd', name: 'Command Prompt', icon: '../assets/images/desk/icons/Command Prompt.webp', action: 'open-cmd' },
		{ id: 'ql-notepad', name: 'Notepad', icon: '../assets/images/desk/icons/Notepad.webp', action: 'open-notepad' },
		{ id: 'ql-calc', name: 'Calculator', icon: '../assets/images/desk/icons/Calculator.webp', action: 'open-calc' },
		{ id: 'ql-paint', name: 'Paint', icon: '../assets/images/desk/icons/Paint.webp', action: 'open-paint' },
		{ id: 'ql-winamp', name: 'Winamp Media Player', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Winamp-logo.svg/960px-Winamp-logo.svg.png', action: 'open-winamp' },
		{ id: 'ql-mine', name: 'Minesweeper', icon: '../assets/images/desk/icons/Minesweeper.webp', action: 'open-mine' },
	];

	let taskbarEl = null;
	let startBtnEl = null;
	let quickLaunchEl = null;
	let windowsContainerEl = null;
	let systemTrayEl = null;
	let clockEl = null;
	let volumePopupEl = null;
	let calendarPopupEl = null;
	let previewPopupEl = null;
	let balloonContainerEl = null;
	let trayChevronEl = null;
	let trayHiddenGroupEl = null;

	let isTrayExpanded = false;
	let clockInterval = null;
	let flashingButtons = new Map();
	let previewHoverTimeout = null;
	let customTrayIcons = new Map();
	let quickLaunchItems = [];
	let draggedQlId = null;
	let calendarCurrentDate = new Date();

	const Taskbar = {
		init() {
			taskbarEl = document.getElementById('taskbar');
			if (!taskbarEl) return;

			startBtnEl = document.getElementById('taskbar-start-button');
			quickLaunchEl = document.getElementById('quick-launch-bar');
			windowsContainerEl = document.getElementById('taskbar-windows');
			systemTrayEl = document.getElementById('taskbar-system-tray');

			this.loadQuickLaunchItems();
			this.createDomElements();
			this.renderQuickLaunch();
			this.renderSystemTray();
			this.bindEvents();
			this.initClock();
			this.updateDensity();
			this.updateUnreadBadges();
		},

		getTrayServices() {
			const lang = (window.SettingsApp && window.SettingsApp.get('systemLanguage')) || 'EN';
			return [
				{
					id: 'security',
					name: 'Windows Security Center',
					icon: 'https://api.iconify.design/mdi/shield-check.svg?color=%2355aa55',
					title: 'Your computer is protected: Firewall and Antivirus active',
					hidden: true,
					onClick: (e) => this.showSecurityAlertsPopup(e),
					onContextMenu: (e) => {
						if (window.ContextMenu) {
							window.ContextMenu.show(window.ContextMenu.getTrayItems('security'), e.clientX, e.clientY);
						}
					}
				},
				{
					id: 'hardware',
					name: 'Safely Remove Hardware',
					icon: 'https://api.iconify.design/mdi/usb.svg?color=%23ffffff',
					title: 'Safely Remove Hardware and Eject Media',
					hidden: true,
					onClick: (e) => this.showSafelyRemoveHardwareDialog(e),
					onContextMenu: (e) => {
						if (window.ContextMenu) {
							window.ContextMenu.show(window.ContextMenu.getTrayItems('hardware'), e.clientX, e.clientY);
						}
					}
				},
				{
					id: 'update',
					name: 'Automatic Updates',
					icon: 'https://api.iconify.design/mdi/shield-sync-outline.svg?color=%23ffcc00',
					title: 'Automatic Updates are configured and active',
					hidden: true,
					onClick: (e) => this.showWindowsUpdateDialog(e),
					onContextMenu: (e) => {
						if (window.ContextMenu) {
							window.ContextMenu.show(window.ContextMenu.getTrayItems('update'), e.clientX, e.clientY);
						}
					}
				},
				{
					id: 'power',
					name: 'Power Meter',
					icon: 'https://api.iconify.design/mdi/battery-charging.svg?color=%23ffffff',
					title: 'On AC Power - Battery remaining: 98% (Fully Charged)',
					hidden: true,
					onClick: (e) => this.showPowerMeterPopup(e),
					onContextMenu: (e) => {
						if (window.ContextMenu) {
							window.ContextMenu.show(window.ContextMenu.getTrayItems('power'), e.clientX, e.clientY);
						}
					}
				},
				{
					id: 'network',
					name: 'Local Area Connection',
					icon: 'https://api.iconify.design/mdi/lan-connect.svg?color=%23ffffff',
					title: 'Local Area Connection - Speed: 100.0 Mbps - Status: Connected',
					hidden: false,
					onClick: (e) => this.showNetworkStatusDialog(e),
					onContextMenu: (e) => {
						if (window.ContextMenu) {
							window.ContextMenu.show(window.ContextMenu.getTrayItems('network'), e.clientX, e.clientY);
						}
					}
				},
				{
					id: 'mail',
					name: 'Outlook Express Mail Notifier',
					icon: 'https://api.iconify.design/mdi/email-outline.svg?color=%23ffffff',
					title: 'Outlook Express - Mail Notifications',
					hidden: false,
					onClick: () => {
						if (typeof openOutlookExpress === 'function') openOutlookExpress();
					},
					onContextMenu: () => {
						if (typeof openOutlookExpress === 'function') openOutlookExpress();
					}
				},
				{
					id: 'volume',
					name: 'Volume Control',
					icon: 'https://api.iconify.design/mdi/volume-high.svg?color=%23ffffff',
					title: 'Volume',
					hidden: false,
					onClick: (e) => this.toggleVolumePopup(e),
					onContextMenu: (e) => {
						if (window.ContextMenu) {
							window.ContextMenu.show(window.ContextMenu.getTrayItems('volume'), e.clientX, e.clientY);
						}
					}
				},
				{
					id: 'lang',
					name: 'Language Bar',
					isTextBadge: true,
					textBadge: lang,
					title: `Keyboard Language: ${lang === 'FR' ? 'French (France)' : 'English (United States)'}`,
					hidden: false,
					onClick: () => this.toggleLanguage(),
					onContextMenu: (e) => {
						if (window.ContextMenu) {
							window.ContextMenu.show(window.ContextMenu.getTrayItems('lang'), e.clientX, e.clientY);
						}
					}
				},
				{
					id: 'clippy',
					name: 'Clippy Assistant',
					icon: '../assets/images/desk/clippy/idle.png',
					title: 'MacroPof Clippy Assistant',
					hidden: false,
					onClick: () => {
						if (window.ClippyAgent && typeof window.ClippyAgent.toggle === 'function') {
							window.ClippyAgent.toggle();
						}
					},
					onContextMenu: (e) => {
						if (window.ContextMenu) {
							window.ContextMenu.show(window.ContextMenu.getTrayItems('clippy'), e.clientX, e.clientY);
						}
					}
				}
			];
		},

		renderSystemTray() {
			if (!systemTrayEl) return;
			systemTrayEl.innerHTML = '';

			const chevronBtn = document.createElement('button');
			chevronBtn.type = 'button';
			chevronBtn.id = 'tray-chevron-btn';
			chevronBtn.className = `tray-chevron ${isTrayExpanded ? 'expanded' : ''}`;
			chevronBtn.title = 'Show hidden notification icons';
			chevronBtn.innerHTML = '<span class="tray-chevron-arrow">&lt;</span>';
			chevronBtn.addEventListener('click', (e) => {
				e.stopPropagation();
				this.toggleTrayExpansion();
			});
			systemTrayEl.appendChild(chevronBtn);
			trayChevronEl = chevronBtn;

			const hiddenGroup = document.createElement('div');
			hiddenGroup.id = 'tray-hidden-icons';
			hiddenGroup.className = `tray-hidden-icons ${isTrayExpanded ? '' : 'hidden'}`;
			systemTrayEl.appendChild(hiddenGroup);
			trayHiddenGroupEl = hiddenGroup;

			const services = this.getTrayServices();
			const config = (window.SettingsApp && window.SettingsApp.get('trayConfig')) || {};

			services.forEach(srv => {
				const srvCfg = config[srv.id] || {};
				if (srvCfg.enabled === false) return;

				const isHidden = srvCfg.hidden !== undefined ? srvCfg.hidden : srv.hidden;
				const itemEl = document.createElement('div');
				itemEl.className = 'tray-icon-item';
				itemEl.id = srv.id === 'clippy' ? 'clippy-taskbar-icon' : `tray-${srv.id}-btn`;
				itemEl.title = srv.title;

				if (srv.isTextBadge) {
					const badge = document.createElement('span');
					badge.className = 'tray-lang-indicator';
					badge.id = 'tray-lang-badge';
					badge.textContent = srv.textBadge;
					itemEl.appendChild(badge);
				} else {
					const img = document.createElement('img');
					img.src = srv.icon;
					img.alt = srv.name;
					itemEl.appendChild(img);
				}

				if (srv.id === 'mail') {
					const countBadge = document.createElement('span');
					countBadge.className = 'tray-icon-badge hidden';
					countBadge.id = 'tray-mail-count-badge';
					itemEl.appendChild(countBadge);
				}

				if (srv.onClick) {
					itemEl.addEventListener('click', (e) => {
						e.stopPropagation();
						srv.onClick(e);
					});
				}

				if (srv.onContextMenu) {
					itemEl.addEventListener('contextmenu', (e) => {
						e.preventDefault();
						e.stopPropagation();
						srv.onContextMenu(e);
					});
				}

				if (isHidden) {
					hiddenGroup.appendChild(itemEl);
				} else {
					systemTrayEl.appendChild(itemEl);
				}
			});

			clockEl = document.createElement('div');
			clockEl.id = 'taskbar-clock';
			clockEl.title = 'Date and Time';
			clockEl.addEventListener('click', (e) => {
				e.stopPropagation();
				this.toggleCalendar(e);
			});
			clockEl.addEventListener('contextmenu', (e) => {
				e.preventDefault();
				e.stopPropagation();
				if (window.ContextMenu) {
					window.ContextMenu.show(window.ContextMenu.getTrayItems('clock'), e.clientX, e.clientY);
				}
			});
			systemTrayEl.appendChild(clockEl);
			this.initClock();
		},

		showSecurityAlertsPopup(e) {
			const id = 'window-security-center';
			if (document.getElementById(id)) {
				if (typeof bringWindowToFront === 'function') bringWindowToFront(document.getElementById(id));
				return;
			}

			const contentHTML = `
				<div style="padding: 12px; font-family: 'Tahoma', sans-serif; font-size: 11px; display: flex; flex-direction: column; gap: 10px;">
					<div style="display: flex; align-items: center; gap: 10px;">
						<img src="https://api.iconify.design/mdi/shield-check.svg?color=%232e7d32" style="width: 38px; height: 38px;" alt="">
						<div>
							<strong>Windows Security Center</strong><br>
							<span style="color: #2e7d32; font-weight: bold;">Your computer is fully protected</span>
						</div>
					</div>
					<div class="xp-security-status-card">
						<img src="https://api.iconify.design/mdi/firewall.svg?color=%232e7d32" alt="">
						<div>
							<strong>Firewall</strong><br>
							<span>Windows Firewall is active and monitoring inbound connections.</span>
						</div>
					</div>
					<div class="xp-security-status-card">
						<img src="https://api.iconify.design/mdi/shield-sync-outline.svg?color=%232e7d32" alt="">
						<div>
							<strong>Automatic Updates</strong><br>
							<span>Scheduled to automatically check and download critical fixes.</span>
						</div>
					</div>
					<div class="xp-security-status-card">
						<img src="https://api.iconify.design/mdi/virus-outline.svg?color=%232e7d32" alt="">
						<div>
							<strong>Virus Protection</strong><br>
							<span>MacroPof Antivirus definition set 2002.3.1 active.</span>
						</div>
					</div>
					<div style="display: flex; justify-content: flex-end;">
						<button class="xp-button" id="sec-center-ok-btn">OK</button>
					</div>
				</div>
			`;

			const win = createXPWindow(id, 'Windows Security Center', contentHTML, 420, 310, {
				iconSrc: 'https://api.iconify.design/mdi/shield-check.svg?color=%232e7d32',
				resizable: false
			});
			win.querySelector('.xp-window-content').style.padding = '0';
			win.querySelector('#sec-center-ok-btn').addEventListener('click', () => {
				if (typeof closeWindow === 'function') closeWindow(win, id);
			});
		},

		showSafelyRemoveHardwareDialog(e) {
			const id = 'window-safe-remove-hw';
			if (document.getElementById(id)) {
				if (typeof bringWindowToFront === 'function') bringWindowToFront(document.getElementById(id));
				return;
			}

			const contentHTML = `
				<div style="padding: 12px; font-family: 'Tahoma', sans-serif; font-size: 11px; display: flex; flex-direction: column; gap: 8px;">
					<div>Select the device you want to unplug or eject, and then click Stop:</div>
					<div class="xp-hardware-list" id="hw-devices-list">
						<div class="xp-hardware-item selected" data-device="usb1">
							<img src="https://api.iconify.design/mdi/usb-flash-drive.svg?color=%231b4b9b" alt="">
							<span>USB Mass Storage Device - Kingston DataTraveler 2.0 (Drive E:)</span>
						</div>
						<div class="xp-hardware-item" data-device="usb2">
							<img src="https://api.iconify.design/mdi/harddisk.svg?color=%231b4b9b" alt="">
							<span>External Portable Hard Drive (Drive F:)</span>
						</div>
					</div>
					<div style="display: flex; justify-content: flex-end; gap: 6px; margin-top: 4px;">
						<button class="xp-button" id="hw-stop-btn">Stop</button>
						<button class="xp-button" id="hw-close-btn">Close</button>
					</div>
				</div>
			`;

			const win = createXPWindow(id, 'Safely Remove Hardware', contentHTML, 440, 240, {
				iconSrc: 'https://api.iconify.design/mdi/usb.svg?color=%23ffffff',
				resizable: false
			});
			win.querySelector('.xp-window-content').style.padding = '0';

			const list = win.querySelector('#hw-devices-list');
			list.querySelectorAll('.xp-hardware-item').forEach(item => {
				item.addEventListener('click', () => {
					list.querySelectorAll('.xp-hardware-item').forEach(i => i.classList.remove('selected'));
					item.classList.add('selected');
				});
			});

			win.querySelector('#hw-stop-btn').addEventListener('click', () => {
				const selected = list.querySelector('.xp-hardware-item.selected');
				const name = selected ? selected.querySelector('span').textContent : 'USB Device';
				if (typeof closeWindow === 'function') closeWindow(win, id);
				this.showBalloon('Safe To Remove Hardware', `The '${name}' device can now be safely removed from the system.`, 'https://api.iconify.design/mdi/check-circle.svg?color=%232e7d32');
			});

			win.querySelector('#hw-close-btn').addEventListener('click', () => {
				if (typeof closeWindow === 'function') closeWindow(win, id);
			});
		},

		showWindowsUpdateDialog(e) {
			showXPDialog('Automatic Updates', 'Windows is up to date.\nLast checked: Today at 03:00 AM.\nNo new security updates are required.', 'info');
		},

		showPowerMeterPopup(e) {
			showXPDialog('Power Meter', 'Power status: AC Power Online\nBattery capacity: 98% (Fully Charged)\nPower scheme: Home/Office Desk', 'info');
		},

		showNetworkStatusDialog(e) {
			const id = 'window-net-status';
			if (document.getElementById(id)) {
				if (typeof bringWindowToFront === 'function') bringWindowToFront(document.getElementById(id));
				return;
			}

			const contentHTML = `
				<div style="padding: 12px; font-family: 'Tahoma', sans-serif; font-size: 11px; display: flex; flex-direction: column; gap: 8px;">
					<div style="display: flex; align-items: center; gap: 8px;">
						<img src="https://api.iconify.design/mdi/lan-connect.svg?color=%231b4b9b" style="width: 32px; height: 32px;" alt="">
						<div>
							<strong>Local Area Connection Status</strong><br>
							<span>Realtek RTL8139 Family Fast Ethernet NIC</span>
						</div>
					</div>
					<div class="xp-netstatus-grid">
						<div>Status:</div><div><strong>Connected</strong></div>
						<div>Duration:</div><div>14:32:05</div>
						<div>Speed:</div><div>100.0 Mbps</div>
						<div>IP Address:</div><div>192.168.1.42</div>
						<div>Subnet Mask:</div><div>255.255.255.0</div>
						<div>Packets Sent:</div><div id="net-pk-sent">28,419</div>
						<div>Packets Recv:</div><div id="net-pk-recv">94,182</div>
					</div>
					<div style="display: flex; justify-content: flex-end; gap: 6px;">
						<button class="xp-button" id="net-repair-btn">Repair</button>
						<button class="xp-button" id="net-close-btn">Close</button>
					</div>
				</div>
			`;

			const win = createXPWindow(id, 'Local Area Connection Status', contentHTML, 360, 290, {
				iconSrc: 'https://api.iconify.design/mdi/lan-connect.svg?color=%231b4b9b',
				resizable: false
			});
			win.querySelector('.xp-window-content').style.padding = '0';

			win.querySelector('#net-repair-btn').addEventListener('click', () => {
				showXPDialog('Network Repair', 'Windows has renewed the IP address and cleared the local DNS cache.', 'info');
			});

			win.querySelector('#net-close-btn').addEventListener('click', () => {
				if (typeof closeWindow === 'function') closeWindow(win, id);
			});
		},

		toggleLanguage() {
			const currentLang = (window.SettingsApp && window.SettingsApp.get('systemLanguage')) || 'EN';
			const newLang = currentLang === 'EN' ? 'FR' : 'EN';
			if (window.SettingsApp) {
				window.SettingsApp.set('systemLanguage', newLang);
			}
			const badge = document.getElementById('tray-lang-badge');
			if (badge) badge.textContent = newLang;
			this.showBalloon('Language Bar', `Input locale switched to: ${newLang === 'FR' ? 'French (France)' : 'English (United States)'}`, 'https://api.iconify.design/mdi/keyboard.svg?color=%231b4b9b', 3000);
		},

		loadQuickLaunchItems() {
			try {
				const saved = localStorage.getItem(QUICK_LAUNCH_STORAGE_KEY);
				if (saved) {
					quickLaunchItems = JSON.parse(saved);
				} else {
					quickLaunchItems = JSON.parse(JSON.stringify(DEFAULT_QUICK_LAUNCH));
				}
			} catch (e) {
				quickLaunchItems = JSON.parse(JSON.stringify(DEFAULT_QUICK_LAUNCH));
			}
		},

		saveQuickLaunchItems() {
			try {
				localStorage.setItem(QUICK_LAUNCH_STORAGE_KEY, JSON.stringify(quickLaunchItems));
			} catch (e) {}
		},

		getQuickLaunchItems() {
			return quickLaunchItems;
		},

		addQuickLaunchItem(item) {
			if (!item || !item.name) return;
			const newItem = {
				id: item.id || `ql-custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
				name: item.name,
				icon: item.icon || '../assets/images/desk/icons/File.webp',
				action: item.action || 'open-path',
				path: item.path || null,
				hasBadge: !!item.hasBadge
			};
			quickLaunchItems.push(newItem);
			this.saveQuickLaunchItems();
			this.renderQuickLaunch();
			if (window.SettingsApp && window.SettingsApp.playSound) {
				window.SettingsApp.playSound('click');
			}
		},

		removeQuickLaunchItem(id) {
			quickLaunchItems = quickLaunchItems.filter(item => item.id !== id);
			this.saveQuickLaunchItems();
			this.renderQuickLaunch();
			if (window.SettingsApp && window.SettingsApp.playSound) {
				window.SettingsApp.playSound('recycle');
			}
		},

		moveQuickLaunchItem(fromIndex, toIndex) {
			if (fromIndex < 0 || fromIndex >= quickLaunchItems.length || toIndex < 0 || toIndex >= quickLaunchItems.length) return;
			const item = quickLaunchItems.splice(fromIndex, 1)[0];
			quickLaunchItems.splice(toIndex, 0, item);
			this.saveQuickLaunchItems();
			this.renderQuickLaunch();
		},

		resetQuickLaunchDefaults() {
			quickLaunchItems = JSON.parse(JSON.stringify(DEFAULT_QUICK_LAUNCH));
			this.saveQuickLaunchItems();
			this.renderQuickLaunch();
		},

		renderQuickLaunch() {
			if (!quickLaunchEl) return;
			quickLaunchEl.innerHTML = '';

			const handle = document.createElement('div');
			handle.className = 'quick-launch-handle';
			handle.title = 'Quick Launch';
			quickLaunchEl.appendChild(handle);

			quickLaunchItems.forEach((item, index) => {
				const wrapper = document.createElement('div');
				wrapper.className = 'quick-launch-icon-wrapper';
				wrapper.id = item.id;
				wrapper.title = item.name;
				wrapper.draggable = true;
				wrapper.dataset.index = String(index);
				wrapper.dataset.qlId = item.id;

				const img = document.createElement('img');
				img.src = item.icon;
				img.alt = item.name;
				img.className = 'quick-launch-icon';
				wrapper.appendChild(img);

				if (item.hasBadge || item.action === 'open-oe') {
					const badge = document.createElement('span');
					badge.className = 'quick-launch-badge hidden';
					badge.id = `ql-badge-${item.id}`;
					wrapper.appendChild(badge);
				}

				wrapper.addEventListener('click', (e) => {
					e.stopPropagation();
					this.executeQuickLaunchItem(item);
				});

				wrapper.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					e.stopPropagation();
					if (window.ContextMenu) {
						const menuItems = window.ContextMenu.getQuickLaunchItemItems(item.id, item.name, item, index);
						window.ContextMenu.show(menuItems, e.clientX, e.clientY);
					}
				});

				let longPressTimeout = null;
				wrapper.addEventListener('mousedown', (e) => {
					if (e.button !== 0) return;
					longPressTimeout = setTimeout(() => {
						wrapper.classList.add('ql-reorder-active');
					}, 400);
				});
				const cancelLongPress = () => {
					if (longPressTimeout) {
						clearTimeout(longPressTimeout);
						longPressTimeout = null;
					}
					wrapper.classList.remove('ql-reorder-active');
				};
				wrapper.addEventListener('mouseup', cancelLongPress);
				wrapper.addEventListener('mouseleave', cancelLongPress);

				wrapper.addEventListener('dragstart', (e) => {
					draggedQlId = item.id;
					e.dataTransfer.effectAllowed = 'move';
					e.dataTransfer.setData('text/quicklaunch-id', item.id);
					e.dataTransfer.setData('text/quicklaunch-index', String(index));
					wrapper.classList.add('ql-dragging');
				});

				wrapper.addEventListener('dragover', (e) => {
					e.preventDefault();
					e.stopPropagation();
					e.dataTransfer.dropEffect = 'move';
					const rect = wrapper.getBoundingClientRect();
					const isAfter = (e.clientX - rect.left) > (rect.width / 2);
					wrapper.classList.toggle('ql-drop-after', isAfter);
					wrapper.classList.toggle('ql-drop-before', !isAfter);
				});

				wrapper.addEventListener('dragleave', () => {
					wrapper.classList.remove('ql-drop-after', 'ql-drop-before');
				});

				wrapper.addEventListener('drop', (e) => {
					e.preventDefault();
					e.stopPropagation();
					wrapper.classList.remove('ql-drop-after', 'ql-drop-before');

					const qlSourceIndex = e.dataTransfer.getData('text/quicklaunch-index');
					if (qlSourceIndex !== '') {
						const fromIdx = parseInt(qlSourceIndex, 10);
						const rect = wrapper.getBoundingClientRect();
						const isAfter = (e.clientX - rect.left) > (rect.width / 2);
						let toIdx = index;
						if (isAfter && fromIdx < toIdx) toIdx = index;
						else if (isAfter && fromIdx > toIdx) toIdx = index + 1;
						else if (!isAfter && fromIdx > toIdx) toIdx = index;
						else if (!isAfter && fromIdx < toIdx) toIdx = Math.max(0, index - 1);
						Taskbar.moveQuickLaunchItem(fromIdx, toIdx);
						return;
					}

					const fsRaw = e.dataTransfer.getData('text/plain');
					if (fsRaw) {
						try {
							const paths = JSON.parse(fsRaw);
							if (Array.isArray(paths) && paths.length > 0 && typeof fs !== 'undefined') {
								paths.forEach(p => {
									const el = fs.findByPath(p);
									if (el) {
										Taskbar.addQuickLaunchItem({
											name: el.name,
											icon: el.icon,
											action: 'open-path',
											path: el.getFullPath()
										});
									}
								});
							}
						} catch (err) {}
					}
				});

				wrapper.addEventListener('dragend', () => {
					draggedQlId = null;
					wrapper.classList.remove('ql-dragging');
					document.querySelectorAll('.quick-launch-icon-wrapper').forEach(w => {
						w.classList.remove('ql-drop-after', 'ql-drop-before');
					});
				});

				quickLaunchEl.appendChild(wrapper);
			});

			this.updateUnreadBadges();
		},

		executeQuickLaunchItem(item) {
			const action = item.action;
			switch (action) {
				case 'show-desktop':
					this.showDesktop();
					break;
				case 'open-ie':
					if (typeof openInternetExplorer === 'function') openInternetExplorer();
					break;
				case 'open-oe':
					if (typeof openOutlookExpress === 'function') openOutlookExpress();
					break;
				case 'open-cmd':
					if (window.CommandPrompt) window.CommandPrompt.open();
					else if (typeof processRunCommand === 'function') processRunCommand('cmd');
					break;
				case 'open-notepad':
					if (window.NotepadApp) window.NotepadApp.openNew();
					break;
				case 'open-calc':
					if (window.CalculatorApp) window.CalculatorApp.open();
					break;
				case 'open-paint':
					if (window.PaintApp) window.PaintApp.open();
					break;
				case 'open-winamp':
					if (typeof openWinamp === 'function') openWinamp();
					break;
				case 'open-mine':
					if (typeof openMinesweeper === 'function') openMinesweeper();
					break;
				case 'open-settings':
					if (window.SettingsApp) window.SettingsApp.open('system');
					break;
				case 'open-path':
					if (item.path && typeof fs !== 'undefined') {
						const el = fs.findByPath(item.path);
						if (el && typeof openFileSystemElement === 'function') openFileSystemElement(el);
					}
					break;
				default:
					if (item.path && typeof fs !== 'undefined') {
						const el = fs.findByPath(item.path);
						if (el && typeof openFileSystemElement === 'function') openFileSystemElement(el);
					}
					break;
			}
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

			if (!volumePopupEl) {
				volumePopupEl = document.createElement('div');
				volumePopupEl.id = 'taskbar-volume-popup';
				volumePopupEl.className = 'xp-volume-popup hidden';
				volumePopupEl.innerHTML = `
					<div class="xp-volume-header">Volume</div>
					<div class="xp-volume-label">Master</div>
					<div class="xp-volume-body">
						<div class="xp-volume-ticks">
							<div class="xp-volume-tick"></div>
							<div class="xp-volume-tick"></div>
							<div class="xp-volume-tick"></div>
							<div class="xp-volume-tick"></div>
							<div class="xp-volume-tick"></div>
						</div>
						<input type="range" id="taskbar-volume-slider" min="0" max="1" step="0.05" value="0.7" orient="vertical" class="xp-vertical-slider">
					</div>
					<div class="xp-volume-footer">
						<label><input type="checkbox" id="taskbar-volume-mute"> Mute</label>
					</div>
				`;
				document.body.appendChild(volumePopupEl);
			}

			if (!calendarPopupEl) {
				calendarPopupEl = document.createElement('div');
				calendarPopupEl.id = 'calendar-popup';
				calendarPopupEl.className = 'hidden';
				calendarPopupEl.innerHTML = `
					<div id="calendar-header">
						<button type="button" class="calendar-nav-btn" id="calendar-prev">&lt;</button>
						<span id="calendar-month-year"></span>
						<button type="button" class="calendar-nav-btn" id="calendar-next">&gt;</button>
					</div>
					<div id="calendar-days-header">
						<div>Su</div>
						<div>Mo</div>
						<div>Tu</div>
						<div>We</div>
						<div>Th</div>
						<div>Fr</div>
						<div>Sa</div>
					</div>
					<div id="calendar-grid"></div>
					<div id="calendar-footer">
						<span id="calendar-today-date"></span>
					</div>
				`;
				document.body.appendChild(calendarPopupEl);
				this.bindCalendarEvents();
			}
		},

		createContextMenus() {},

		bindEvents() {
			if (startBtnEl) {
				startBtnEl.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					e.stopPropagation();
					if (window.ContextMenu) {
						const items = window.ContextMenu.getStartButtonItems();
						window.ContextMenu.show(items, e.clientX, e.clientY);
					}
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
				trayVolumeBtn.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					e.stopPropagation();
					if (window.ContextMenu) {
						const items = window.ContextMenu.getTrayItems('volume');
						window.ContextMenu.show(items, e.clientX, e.clientY);
					}
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
				trayNetworkBtn.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					e.stopPropagation();
					if (window.ContextMenu) {
						const items = window.ContextMenu.getTrayItems('network');
						window.ContextMenu.show(items, e.clientX, e.clientY);
					}
				});
			}

			const trayMailBtn = document.getElementById('tray-mail-btn');
			if (trayMailBtn) {
				trayMailBtn.addEventListener('click', (e) => {
					e.stopPropagation();
					if (typeof openOutlookExpress === 'function') openOutlookExpress();
				});
				trayMailBtn.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					e.stopPropagation();
					if (typeof openOutlookExpress === 'function') openOutlookExpress();
				});
			}

			const clippyTrayIcon = document.getElementById('clippy-taskbar-icon');
			if (clippyTrayIcon) {
				clippyTrayIcon.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					e.stopPropagation();
					if (window.ContextMenu) {
						const items = window.ContextMenu.getTrayItems('clippy');
						window.ContextMenu.show(items, e.clientX, e.clientY);
					}
				});
			}

			if (clockEl) {
				clockEl.addEventListener('click', (e) => {
					e.stopPropagation();
					this.toggleCalendar(e);
				});
				clockEl.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					e.stopPropagation();
					if (window.ContextMenu) {
						const items = window.ContextMenu.getTrayItems('clock');
						window.ContextMenu.show(items, e.clientX, e.clientY);
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

			if (quickLaunchEl) {
				quickLaunchEl.addEventListener('contextmenu', (e) => {
					if (e.target.closest('.quick-launch-icon-wrapper')) return;
					e.preventDefault();
					e.stopPropagation();
					if (window.ContextMenu) {
						const items = window.ContextMenu.getQuickLaunchBarItems();
						window.ContextMenu.show(items, e.clientX, e.clientY);
					}
				});

				quickLaunchEl.addEventListener('dragover', (e) => {
					e.preventDefault();
					e.stopPropagation();
					quickLaunchEl.classList.add('ql-drop-target-active');
				});

				quickLaunchEl.addEventListener('dragleave', (e) => {
					if (!quickLaunchEl.contains(e.relatedTarget)) {
						quickLaunchEl.classList.remove('ql-drop-target-active');
					}
				});

				quickLaunchEl.addEventListener('drop', (e) => {
					quickLaunchEl.classList.remove('ql-drop-target-active');
					const fsRaw = e.dataTransfer.getData('text/plain');
					if (fsRaw) {
						try {
							const paths = JSON.parse(fsRaw);
							if (Array.isArray(paths) && paths.length > 0 && typeof fs !== 'undefined') {
								paths.forEach(p => {
									const el = fs.findByPath(p);
									if (el) {
										Taskbar.addQuickLaunchItem({
											name: el.name,
											icon: el.icon,
											action: 'open-path',
											path: el.getFullPath()
										});
									}
								});
							}
						} catch (err) {}
					}
				});
			}

			document.addEventListener('mousedown', (e) => {
				if (volumePopupEl && !volumePopupEl.contains(e.target) && !e.target.closest('#tray-volume-btn')) {
					volumePopupEl.classList.add('hidden');
				}
				if (calendarPopupEl && !calendarPopupEl.contains(e.target) && !e.target.closest('#taskbar-clock')) {
					calendarPopupEl.classList.add('hidden');
				}
			});

			const volumeSlider = volumePopupEl.querySelector('#taskbar-volume-slider');
			const volumeMute = volumePopupEl.querySelector('#taskbar-volume-mute');

			if (volumeSlider) {
				volumeSlider.addEventListener('input', () => {
					const vol = parseFloat(volumeSlider.value);
					if (window.SettingsApp) {
						window.SettingsApp.set('soundVolume', vol);
						window.SettingsApp.playSound('click');
					}
				});
			}

			if (volumeMute) {
				volumeMute.addEventListener('change', () => {
					const isMuted = volumeMute.checked;
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

		bindCalendarEvents() {
			if (!calendarPopupEl) return;
			const prevBtn = calendarPopupEl.querySelector('#calendar-prev');
			const nextBtn = calendarPopupEl.querySelector('#calendar-next');
			const footerBtn = calendarPopupEl.querySelector('#calendar-footer');

			prevBtn.addEventListener('click', (e) => {
				e.stopPropagation();
				calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1);
				this.renderCalendar();
			});

			nextBtn.addEventListener('click', (e) => {
				e.stopPropagation();
				calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1);
				this.renderCalendar();
			});

			footerBtn.addEventListener('click', (e) => {
				e.stopPropagation();
				calendarCurrentDate = new Date();
				this.renderCalendar();
			});
		},

		toggleCalendar(e) {
			if (!calendarPopupEl) return;
			const isHidden = calendarPopupEl.classList.contains('hidden');
			if (isHidden) {
				calendarCurrentDate = new Date();
				this.renderCalendar();
				calendarPopupEl.classList.remove('hidden');

				const rect = calendarPopupEl.getBoundingClientRect();
				const clockRect = clockEl.getBoundingClientRect();
				let left = clockRect.right - rect.width;
				if (left < 6) left = 6;
				calendarPopupEl.style.left = `${left}px`;
				calendarPopupEl.style.top = `${window.innerHeight - 38 - rect.height}px`;
			} else {
				calendarPopupEl.classList.add('hidden');
			}
		},

		renderCalendar() {
			if (!calendarPopupEl) return;
			const year = calendarCurrentDate.getFullYear();
			const month = calendarCurrentDate.getMonth();

			const monthYearEl = calendarPopupEl.querySelector('#calendar-month-year');
			const gridEl = calendarPopupEl.querySelector('#calendar-grid');
			const todayDateEl = calendarPopupEl.querySelector('#calendar-today-date');

			gridEl.innerHTML = '';
			const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			monthYearEl.textContent = `${monthNames[month]} ${year}`;

			const today = new Date();
			todayDateEl.textContent = `Today: ${today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;

			const firstDayOfMonth = new Date(year, month, 1);
			const daysInMonth = new Date(year, month + 1, 0).getDate();
			const startDayOfWeek = firstDayOfMonth.getDay();

			for (let i = 0; i < startDayOfWeek; i++) {
				const emptyCell = document.createElement('div');
				gridEl.appendChild(emptyCell);
			}

			for (let day = 1; day <= daysInMonth; day++) {
				const dayCell = document.createElement('div');
				dayCell.className = 'calendar-day';
				dayCell.textContent = String(day);

				const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
				if (isToday) {
					dayCell.classList.add('today');
				}

				const isSelectable = year === today.getFullYear() && month === today.getMonth() && day <= today.getDate();
				if (isSelectable) {
					dayCell.classList.add('selectable');
					dayCell.title = 'View the anecdote scheduled for this day';
					dayCell.addEventListener('click', () => {
						if (typeof openAnecdoteWindow === 'function') {
							openAnecdoteWindow(new Date(Date.UTC(year, month, day)));
						}
					});
				}

				gridEl.appendChild(dayCell);
			}
		},

		initClock() {
			if (clockInterval) clearInterval(clockInterval);
			const update = () => {
				if (!clockEl) return;
				const now = new Date();
				const is12h = window.SettingsApp ? (window.SettingsApp.get('clockFormat') === '12h') : false;
				const showSeconds = window.SettingsApp ? (window.SettingsApp.get('showClockSeconds') !== false) : true;
				const showDate = window.SettingsApp ? (window.SettingsApp.get('showClockDate') !== false) : true;
				const showDay = window.SettingsApp ? (window.SettingsApp.get('showClockDay') !== false) : true;
				const dateFormat = window.SettingsApp ? (window.SettingsApp.get('dateFormat') || 'dd/mm/yyyy') : 'dd/mm/yyyy';

				let hoursNum = now.getHours();
				let ampm = '';
				if (is12h) {
					ampm = hoursNum >= 12 ? ' PM' : ' AM';
					hoursNum = hoursNum % 12 || 12;
				}
				const hours = String(hoursNum).padStart(2, '0');
				const minutes = String(now.getMinutes()).padStart(2, '0');
				const seconds = String(now.getSeconds()).padStart(2, '0');
				const timeStr = showSeconds ? `${hours}:${minutes}:${seconds}${ampm}` : `${hours}:${minutes}${ampm}`;

				const day = String(now.getDate()).padStart(2, '0');
				const month = String(now.getMonth() + 1).padStart(2, '0');
				const year = String(now.getFullYear());
				const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
				const dayPrefix = showDay ? `${dayNames[now.getDay()]} ` : '';

				let dateStr = '';
				if (dateFormat === 'mm/dd/yyyy') {
					dateStr = `${dayPrefix}${month}/${day}/${year}`;
				} else if (dateFormat === 'yyyy-mm-dd') {
					dateStr = `${dayPrefix}${year}-${month}-${day}`;
				} else if (dateFormat === 'dd.mm.yyyy') {
					dateStr = `${dayPrefix}${day}.${month}.${year}`;
				} else {
					dateStr = `${dayPrefix}${day}/${month}/${year}`;
				}

				if (showDate) {
					clockEl.innerHTML = `<span class="taskbar-clock-time">${timeStr}</span><span class="taskbar-clock-date">${dateStr}</span>`;
				} else {
					clockEl.innerHTML = `<span class="taskbar-clock-time">${timeStr}</span>`;
				}

				clockEl.title = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
			};
			update();
			clockInterval = setInterval(update, 1000);
		},

		initClock() {
			if (clockInterval) clearInterval(clockInterval);
			const update = () => {
				if (!clockEl) return;
				const now = new Date();
				const is12h = window.SettingsApp ? (window.SettingsApp.get('clockFormat') === '12h') : false;
				const showSeconds = window.SettingsApp ? (window.SettingsApp.get('showClockSeconds') !== false) : true;
				const showDate = window.SettingsApp ? (window.SettingsApp.get('showClockDate') !== false) : true;
				const showDay = window.SettingsApp ? (window.SettingsApp.get('showClockDay') !== false) : true;
				const dateFormat = window.SettingsApp ? (window.SettingsApp.get('dateFormat') || 'dd/mm/yyyy') : 'dd/mm/yyyy';

				let hoursNum = now.getHours();
				let ampm = '';
				if (is12h) {
					ampm = hoursNum >= 12 ? ' PM' : ' AM';
					hoursNum = hoursNum % 12 || 12;
				}
				const hours = String(hoursNum).padStart(2, '0');
				const minutes = String(now.getMinutes()).padStart(2, '0');
				const seconds = String(now.getSeconds()).padStart(2, '0');
				const timeStr = showSeconds ? `${hours}:${minutes}:${seconds}${ampm}` : `${hours}:${minutes}${ampm}`;

				const day = String(now.getDate()).padStart(2, '0');
				const month = String(now.getMonth() + 1).padStart(2, '0');
				const year = String(now.getFullYear());
				const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
				const dayPrefix = showDay ? `${dayNames[now.getDay()]} ` : '';

				let dateStr = '';
				if (dateFormat === 'mm/dd/yyyy') {
					dateStr = `${dayPrefix}${month}/${day}/${year}`;
				} else if (dateFormat === 'yyyy-mm-dd') {
					dateStr = `${dayPrefix}${year}-${month}-${day}`;
				} else if (dateFormat === 'dd.mm.yyyy') {
					dateStr = `${dayPrefix}${day}.${month}.${year}`;
				} else {
					dateStr = `${dayPrefix}${day}/${month}/${year}`;
				}

				if (showDate) {
					clockEl.innerHTML = `<span class="taskbar-clock-time">${timeStr}</span><span class="taskbar-clock-date">${dateStr}</span>`;
				} else {
					clockEl.innerHTML = `<span class="taskbar-clock-time">${timeStr}</span>`;
				}

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
			iconImg.src = iconSrc || '../assets/images/desk/icons/File.webp';
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
			const icon = win.querySelector('.xp-window-header img')?.src || '../assets/images/desk/icons/File.webp';

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
				const slider = volumePopupEl.querySelector('#taskbar-volume-slider');
				const mute = volumePopupEl.querySelector('#taskbar-volume-mute');
				if (slider && window.SettingsApp) slider.value = String(window.SettingsApp.get('soundVolume') || 0.7);
				if (mute && window.SettingsApp) mute.checked = !window.SettingsApp.get('soundEnabled');

				volumePopupEl.classList.remove('hidden');
				const rect = volumePopupEl.getBoundingClientRect();
				const anchorRect = e.currentTarget.getBoundingClientRect();
				volumePopupEl.style.left = `${Math.max(5, anchorRect.left - rect.width / 2 + 10)}px`;
				volumePopupEl.style.top = `${window.innerHeight - 36 - rect.height - 4}px`;
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
			const trayMailBtn = document.getElementById('tray-mail-btn');
			if (!window.DeskAPI) return;

			const count = window.DeskAPI.getUnreadMailCount();

			quickLaunchItems.forEach(item => {
				if (item.action === 'open-oe' || item.hasBadge) {
					const badge = document.getElementById(`ql-badge-${item.id}`);
					if (badge) {
						if (count > 0) {
							badge.textContent = count > 5 ? '5+' : String(count);
							badge.classList.remove('hidden');
						} else {
							badge.classList.add('hidden');
						}
					}
				}
			});

			if (trayMailBtn) {
				trayMailBtn.style.display = count > 0 ? 'inline-flex' : 'none';
				trayMailBtn.title = `${count} unread e-mail message(s)`;
			}
		}
	};

	window.Taskbar = Taskbar;
})();
