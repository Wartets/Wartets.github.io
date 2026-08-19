(function () {
	const QUICK_LAUNCH_STORAGE_KEY = 'xp_quick_launch_items';

	const DEFAULT_QUICK_LAUNCH = [
		{ id: 'ql-show-desktop', name: 'Show Desktop', icon: '../assets/images/desk/XPIcon.png', action: 'show-desktop', system: true },
		{ id: 'ql-achievements', name: 'Milestones & Achievements', icon: '../assets/images/desk/icons/Trophy.webp', action: 'open-achievements' },
		{ id: 'ql-settings', name: 'Control Panel & Settings', icon: '../assets/images/desk/icons/System Properties.webp', action: 'open-settings' },
		{ id: 'ql-ie', name: 'Internet Explorer', icon: '../assets/images/desk/icons/Internet Explorer.webp', action: 'open-ie' },
		{ id: 'ql-oe', name: 'Outlook Express', icon: '../assets/images/desk/icons/Mail.webp', action: 'open-oe', hasBadge: true },
		{ id: 'ql-cmd', name: 'Command Prompt', icon: '../assets/images/desk/icons/Command Prompt.webp', action: 'open-cmd' },
		{ id: 'ql-notepad', name: 'Notepad', icon: '../assets/images/desk/icons/Notepad.webp', action: 'open-notepad' },
		{ id: 'ql-calc', name: 'Calculator', icon: '../assets/images/desk/icons/Calculator.webp', action: 'open-calc' },
		{ id: 'ql-paint', name: 'Paint', icon: '../assets/images/desk/icons/Paint.webp', action: 'open-paint' },
		{ id: 'ql-wmp', name: 'Windows Media Player', icon: '../assets/images/desk/icons/Video File.webp', action: 'open-media-player' },
		{ id: 'ql-winamp', name: 'Winamp Media Player', icon: '../assets/images/desk/icons/Winamp.webp', action: 'open-winamp' },
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

	let batteryState = {
		supported: false,
		charging: true,
		level: 1.0,
		chargingTime: 0,
		dischargingTime: Infinity,
		alertTriggered: false
	};

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
			this.initBatteryMonitoring();
			this.renderQuickLaunch();
			this.renderSystemTray();
			this.bindEvents();
			this.initClock();
			this.updateDensity();
			this.updateUnreadBadges();

			if (window.DeskEventBus) {
				window.DeskEventBus.on('settings:changed', () => {
					this.initClock();
					this.updateDensity();
					this.renderSystemTray();
				});
				window.DeskEventBus.on('mail:received', () => {
					this.updateUnreadBadges();
				});
				window.DeskEventBus.on('mail:read', () => {
					this.updateUnreadBadges();
				});
			}
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
					icon: this.getBatteryIconUrl(),
					title: this.getBatteryStatusText(),
					isBatteryWidget: true,
					hidden: false,
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
					onContextMenu: (e) => {
						if (window.ContextMenu) {
							const items = [
								{
									label: 'Open Outlook Express',
									bold: true,
									action: () => {
										if (typeof openOutlookExpress === 'function') openOutlookExpress();
									}
								},
								{
									label: 'Send and Receive All',
									action: () => {
										if (window.MailStore) {
											window.MailStore.ensureDailyContent().then(() => {
												Taskbar.updateUnreadBadges();
												showXPDialog('Outlook Express', 'All mail folders are up to date.', 'info');
											});
										}
									}
								},
								{ separator: true },
								{
									label: 'Properties',
									action: () => {
										if (typeof openOutlookExpress === 'function') openOutlookExpress();
									}
								}
							];
							window.ContextMenu.show(items, e.clientX, e.clientY);
						}
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
					title: 'Microsoft Clippy Assistant',
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

		async initBatteryMonitoring() {
			if (typeof navigator !== 'undefined' && typeof navigator.getBattery === 'function') {
				try {
					const battery = await navigator.getBattery();
					batteryState.supported = true;
					const syncState = () => {
						const oldLevel = batteryState.level;
						const oldCharging = batteryState.charging;
						batteryState.charging = battery.charging;
						batteryState.level = battery.level;
						batteryState.chargingTime = battery.chargingTime;
						batteryState.dischargingTime = battery.dischargingTime;

						if (!battery.charging && battery.level <= 0.15 && !batteryState.alertTriggered) {
							batteryState.alertTriggered = true;
							this.showBalloon(
								'Low Battery Warning',
								`Battery power is low (${Math.round(battery.level * 100)}% remaining). Connect your computer to AC power now to prevent data loss.`,
								'https://api.iconify.design/mdi/battery-alert.svg?color=%23cc2222',
								10000
							);
							if (window.SettingsApp && window.SettingsApp.playSound) {
								window.SettingsApp.playSound('exclamation');
							}
						} else if (battery.charging || battery.level > 0.15) {
							batteryState.alertTriggered = false;
						}

						this.updateBatteryTrayUI();
					};

					syncState();
					battery.addEventListener('chargingchange', syncState);
					battery.addEventListener('levelchange', syncState);
					battery.addEventListener('chargingtimechange', syncState);
					battery.addEventListener('dischargingtimechange', syncState);
				} catch (e) {
					batteryState.supported = false;
				}
			}
		},

		getBatteryIconUrl() {
			const pct = Math.round(batteryState.level * 100);
			if (batteryState.charging) {
				return 'https://api.iconify.design/mdi/battery-charging.svg?color=%23ffffff';
			}
			if (pct <= 15) {
				return 'https://api.iconify.design/mdi/battery-alert.svg?color=%23ff4444';
			}
			if (pct <= 30) {
				return 'https://api.iconify.design/mdi/battery-30.svg?color=%23ffffff';
			}
			if (pct <= 60) {
				return 'https://api.iconify.design/mdi/battery-60.svg?color=%23ffffff';
			}
			if (pct <= 90) {
				return 'https://api.iconify.design/mdi/battery-90.svg?color=%23ffffff';
			}
			return 'https://api.iconify.design/mdi/battery.svg?color=%23ffffff';
		},

		getBatteryStatusText() {
			const pct = Math.round(batteryState.level * 100);
			if (!batteryState.supported) {
				return 'On AC Power (Online)';
			}
			if (batteryState.charging) {
				return `On AC Power - ${pct}% (Charging)`;
			}
			if (pct <= 15) {
				return `CRITICAL LOW BATTERY: ${pct}% remaining!`;
			}
			return `Battery power remaining: ${pct}%`;
		},

		updateBatteryTrayUI() {
			const trayPowerBtn = document.getElementById('tray-power-btn');
			if (!trayPowerBtn) return;
			trayPowerBtn.title = this.getBatteryStatusText();
			const img = trayPowerBtn.querySelector('img');
			if (img) img.src = this.getBatteryIconUrl();

			let pctBadge = trayPowerBtn.querySelector('.tray-battery-percentage');
			if (!pctBadge && batteryState.supported) {
				pctBadge = document.createElement('span');
				pctBadge.className = 'tray-battery-percentage';
				trayPowerBtn.appendChild(pctBadge);
			}
			if (pctBadge) {
				pctBadge.textContent = `${Math.round(batteryState.level * 100)}%`;
			}
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
				} else if (srv.isBatteryWidget && batteryState.supported) {
					const pctBadge = document.createElement('span');
					pctBadge.className = 'tray-battery-percentage';
					pctBadge.textContent = `${Math.round(batteryState.level * 100)}%`;
					itemEl.appendChild(pctBadge);
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
							<span>Microsoft Antivirus definition set 2002.3.1 active.</span>
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
				if (window.AchievementsManager && selected && selected.dataset.device === 'usb1') {
					window.AchievementsManager.progress('safe_hardware_eject', 1);
				}
				if (typeof closeWindow === 'function') closeWindow(win, id);
				this.showBalloon('Safe To Remove Hardware', `The '${name}' device can now be safely removed from the system.`, 'https://api.iconify.design/mdi/check-circle.svg?color=%232e7d32');
			});

			win.querySelector('#hw-close-btn').addEventListener('click', () => {
				if (typeof closeWindow === 'function') closeWindow(win, id);
			});
		},

		showWindowsUpdateDialog(e) {
			if (window.AchievementsManager) window.AchievementsManager.progress('update_checker', 1);
			const now = new Date();
			const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
			const dateString = now.toLocaleDateString();
			const fileCount = (typeof fs !== 'undefined' && fs && fs.root) ? fs.root.getAllDescendants().length : 42;

			showXPDialog(
				'Automatic Updates',
				`Windows is up to date.\n\n` +
				`Last checked: ${dateString} at ${timeString}.\n` +
				`Integrity status: ${fileCount} system objects verified.\n` +
				`Operating System: Windows XP Professional (SP3 Build 2600).\n` +
				`Security Definition Database: Version ${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}.\n\n` +
				`No new critical security updates or hotfixes are required.`,
				'info'
			);
		},

		showPowerMeterPopup(e) {
			const id = 'window-power-meter';
			if (document.getElementById(id)) {
				if (typeof bringWindowToFront === 'function') bringWindowToFront(document.getElementById(id));
				return;
			}

			const pct = Math.round(batteryState.level * 100);
			const isCharging = batteryState.charging;
			const isSupported = batteryState.supported;
			let timeText = 'Unknown';

			if (isCharging && batteryState.chargingTime && isFinite(batteryState.chargingTime)) {
				const mins = Math.round(batteryState.chargingTime / 60);
				timeText = `${Math.floor(mins / 60)}h ${mins % 60}m until fully charged`;
			} else if (!isCharging && batteryState.dischargingTime && isFinite(batteryState.dischargingTime)) {
				const mins = Math.round(batteryState.dischargingTime / 60);
				timeText = `${Math.floor(mins / 60)}h ${mins % 60}m remaining`;
			} else {
				timeText = isCharging ? 'Fully Charged / AC Line Connected' : 'Running on primary battery';
			}

			const contentHTML = `
				<div class="xp-tabs-container">
					<div class="xp-tabs-bar">
						<button type="button" class="xp-tab-btn active">Power Meter</button>
					</div>
					<div class="xp-tab-page-wrapper" style="padding: 10px;">
						<div class="xp-tab-page active">
							<fieldset class="xp-groupbox">
								<legend>Power Status</legend>
								<div style="display: flex; gap: 14px; align-items: center; margin-bottom: 10px;">
									<div class="xp-battery-gauge-frame">
										<div class="xp-battery-gauge-fill" style="width: ${pct}%; background-color: ${pct <= 15 ? '#cc2222' : (pct <= 30 ? '#ff9900' : '#2e8b2e')};"></div>
									</div>
									<div style="font-size: 13px; font-weight: bold; color: #000080;">${pct}% Remaining</div>
								</div>
								<div class="xp-info-grid" style="grid-template-columns: 130px 1fr; gap: 4px;">
									<div>Current power source:</div>
									<div><strong>${isCharging ? 'AC Power (Plugged in)' : 'Battery'}</strong></div>
									<div>Total battery power:</div>
									<div><strong>${pct}%</strong></div>
									<div>Estimated remaining time:</div>
									<div><strong>${timeText}</strong></div>
									<div>Hardware sensor:</div>
									<div>${isSupported ? 'Native Web Battery API' : 'Direct AC Power Controller'}</div>
								</div>
							</fieldset>

							<fieldset class="xp-groupbox" style="margin-top: 8px;">
								<legend>Active Power Scheme</legend>
								<div class="xp-form-row">
									<label style="width: 100px;">Power scheme:</label>
									<select class="xp-select" id="power-meter-scheme-select" style="flex: 1;">
										<option value="desktop" selected>Home / Office Desk</option>
										<option value="portable">Portable / Laptop</option>
										<option value="presentation">Presentation</option>
										<option value="max-battery">Max Battery Life</option>
									</select>
								</div>
							</fieldset>

							<div class="xp-dialog-action-footer" style="margin-top: 10px;">
								<button type="button" class="xp-button" id="power-meter-ok-btn">OK</button>
							</div>
						</div>
					</div>
				</div>
			`;

			const win = createXPWindow(id, 'Power Meter', contentHTML, 420, 310, {
				iconSrc: this.getBatteryIconUrl(),
				resizable: false
			});
			win.querySelector('.xp-window-content').style.padding = '0';
			win.querySelector('#power-meter-ok-btn').addEventListener('click', () => {
				if (typeof closeWindow === 'function') closeWindow(win, id);
			});
		},

		showNetworkStatusDialog(e) {
			const id = 'window-net-status';
			if (document.getElementById(id)) {
				if (typeof bringWindowToFront === 'function') bringWindowToFront(document.getElementById(id));
				return;
			}

			const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
			const conn = (typeof navigator !== 'undefined' && (navigator.connection || navigator.mozConnection || navigator.webkitConnection)) || null;

			let speedText = '100.0 Mbps';
			if (conn && conn.downlink) {
				speedText = `${conn.downlink >= 10 ? Math.round(conn.downlink) : conn.downlink.toFixed(1)} Mbps (${conn.effectiveType ? conn.effectiveType.toUpperCase() : 'Broadband'})`;
			}

			const perfEntries = (typeof performance !== 'undefined' && typeof performance.getEntriesByType === 'function') 
				? performance.getEntriesByType('resource') 
				: [];

			let totalTransferred = 0;
			perfEntries.forEach(entry => {
				totalTransferred += (entry.transferSize || entry.decodedBodySize || 1024);
			});

			const packetsSent = Math.max(124, Math.round(perfEntries.length * 12 + 48));
			const packetsRecv = Math.max(482, Math.round(totalTransferred / 420 + perfEntries.length * 36));

			const contentHTML = `
				<div style="padding: 12px; font-family: 'Tahoma', sans-serif; font-size: 11px; display: flex; flex-direction: column; gap: 8px;">
					<div style="display: flex; align-items: center; gap: 8px;">
						<img src="https://api.iconify.design/mdi/lan-connect.svg?color=%231b4b9b" style="width: 32px; height: 32px;" alt="">
						<div>
							<strong>Local Area Connection Status</strong><br>
							<span>Realtek RTL8139 / Virtual Packet Adapter</span>
						</div>
					</div>
					<div class="xp-netstatus-grid">
						<div>Status:</div><div><strong style="color: ${isOnline ? '#2e7d32' : '#cc2222'};">${isOnline ? 'Connected' : 'Disconnected'}</strong></div>
						<div>Network Media:</div><div>${conn && conn.type ? conn.type.toUpperCase() : 'Ethernet / Wi-Fi Adapter'}</div>
						<div>Link Speed:</div><div><strong>${speedText}</strong></div>
						<div>Latency (RTT):</div><div>${conn && conn.rtt ? `${conn.rtt} ms` : '1 ms (Localhost)'}</div>
						<div>IP Configuration:</div><div>DHCP Assigned (IPv4 / IPv6 Active)</div>
						<div>Packets Sent:</div><div id="net-pk-sent">${packetsSent.toLocaleString()}</div>
						<div>Packets Received:</div><div id="net-pk-recv">${packetsRecv.toLocaleString()}</div>
						<div>Data Volume:</div><div>${(totalTransferred / (1024 * 1024)).toFixed(2)} MB Transferred</div>
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
			if (window.AchievementsManager) {
				window.AchievementsManager.progress('lang_switcher', 1);
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
			try {
				let adds = parseInt(localStorage.getItem('xp_ql_adds') || '0', 10) + 1;
				localStorage.setItem('xp_ql_adds', String(adds));
				let removes = parseInt(localStorage.getItem('xp_ql_removes') || '0', 10);
				if (adds >= 2 && removes >= 3 && window.AchievementsManager) {
					window.AchievementsManager.progress('quicklaunch_customizer', 1);
				}
			} catch (e) {}
			if (window.SettingsApp && window.SettingsApp.playSound) {
				window.SettingsApp.playSound('click');
			}
		},

		removeQuickLaunchItem(id) {
			quickLaunchItems = quickLaunchItems.filter(item => item.id !== id);
			this.saveQuickLaunchItems();
			this.renderQuickLaunch();
			try {
				let removes = parseInt(localStorage.getItem('xp_ql_removes') || '0', 10) + 1;
				localStorage.setItem('xp_ql_removes', String(removes));
				let adds = parseInt(localStorage.getItem('xp_ql_adds') || '0', 10);
				if (adds >= 2 && removes >= 3 && window.AchievementsManager) {
					window.AchievementsManager.progress('quicklaunch_customizer', 1);
				}
			} catch (e) {}
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
			if (!item) return;
			if (item.action === 'show-desktop') {
				this.showDesktop();
				return;
			}

			if (item.action === 'open-path' && item.path && typeof fs !== 'undefined') {
				const el = fs.findByPath(item.path);
				if (el && typeof openFileSystemElement === 'function') openFileSystemElement(el);
				return;
			}

			const actionMap = {
				'open-media-player': () => {
					if (window.MediaPlayerApp) window.MediaPlayerApp.open();
					else if (window.DeskAppRegistry) window.DeskAppRegistry.launch('mediaplayer');
					else if (window.DeskAPI && window.DeskAPI.openMediaPlayer) window.DeskAPI.openMediaPlayer();
				},
				'open-wmp': () => {
					if (window.MediaPlayerApp) window.MediaPlayerApp.open();
					else if (window.DeskAppRegistry) window.DeskAppRegistry.launch('mediaplayer');
					else if (window.DeskAPI && window.DeskAPI.openMediaPlayer) window.DeskAPI.openMediaPlayer();
				},
				'open-mediaplayer': () => {
					if (window.MediaPlayerApp) window.MediaPlayerApp.open();
					else if (window.DeskAppRegistry) window.DeskAppRegistry.launch('mediaplayer');
					else if (window.DeskAPI && window.DeskAPI.openMediaPlayer) window.DeskAPI.openMediaPlayer();
				},
				'open-winamp': () => {
					if (window.DeskAPI && window.DeskAPI.openWinampPlayer) window.DeskAPI.openWinampPlayer();
					else if (typeof openWinamp === 'function') openWinamp();
					else if (window.DeskAppRegistry) window.DeskAppRegistry.launch('winamp');
				},
				'open-ie': () => {
					if (window.DeskAppRegistry) window.DeskAppRegistry.launch('ie');
					else if (typeof openInternetExplorer === 'function') openInternetExplorer();
				},
				'open-oe': () => {
					if (window.DeskAppRegistry) window.DeskAppRegistry.launch('outlook');
					else if (typeof openOutlookExpress === 'function') openOutlookExpress();
				},
				'open-outlook': () => {
					if (window.DeskAppRegistry) window.DeskAppRegistry.launch('outlook');
					else if (typeof openOutlookExpress === 'function') openOutlookExpress();
				},
				'open-cmd': () => {
					if (window.DeskAppRegistry) window.DeskAppRegistry.launch('cmd');
				},
				'open-notepad': () => {
					if (window.NotepadApp) window.NotepadApp.openNew();
					else if (window.DeskAppRegistry) window.DeskAppRegistry.launch('notepad');
				},
				'open-calc': () => {
					if (window.DeskAppRegistry) window.DeskAppRegistry.launch('calculator');
					else if (typeof openCalculator === 'function') openCalculator();
				},
				'open-calculator': () => {
					if (window.DeskAppRegistry) window.DeskAppRegistry.launch('calculator');
					else if (typeof openCalculator === 'function') openCalculator();
				},
				'open-paint': () => {
					if (window.DeskAppRegistry) window.DeskAppRegistry.launch('paint');
					else if (typeof openPaint === 'function') openPaint();
				},
				'open-mine': () => {
					if (window.DeskAppRegistry) window.DeskAppRegistry.launch('minesweeper');
					else if (typeof openMinesweeper === 'function') openMinesweeper();
				},
				'open-minesweeper': () => {
					if (window.DeskAppRegistry) window.DeskAppRegistry.launch('minesweeper');
					else if (typeof openMinesweeper === 'function') openMinesweeper();
				},
				'open-solitaire': () => {
					if (window.DeskAppRegistry) window.DeskAppRegistry.launch('solitaire');
					else if (typeof openSolitaire === 'function') openSolitaire();
				},
				'open-achievements': () => {
					if (window.DeskAPI && window.DeskAPI.openAchievements) window.DeskAPI.openAchievements();
					else if (window.AchievementsManager) window.AchievementsManager.open();
				},
				'open-settings': () => {
					if (window.SettingsApp) window.SettingsApp.open('system');
					else if (window.DeskAppRegistry) window.DeskAppRegistry.launch('settings');
				},
				'open-sound-recorder': () => {
					if (window.SoundRecorderApp) window.SoundRecorderApp.open();
					else if (window.DeskAppRegistry) window.DeskAppRegistry.launch('soundrecorder');
				},
				'open-charmap': () => {
					if (window.CharacterMapApp) window.CharacterMapApp.open();
					else if (window.DeskAppRegistry) window.DeskAppRegistry.launch('charmap');
				}
			};

			if (actionMap[item.action]) {
				actionMap[item.action]();
				return;
			}

			const normalizedAppId = item.action.replace(/^open-/, '');
			if (window.DeskAppRegistry && window.DeskAppRegistry.get(normalizedAppId)) {
				window.DeskAppRegistry.launch(normalizedAppId);
				return;
			}

			if (item.path && typeof fs !== 'undefined') {
				const el = fs.findByPath(item.path);
				if (el && typeof openFileSystemElement === 'function') openFileSystemElement(el);
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

			if (windowsContainerEl) {
				windowsContainerEl.addEventListener('wheel', (e) => {
					if (e.deltaY !== 0) {
						e.preventDefault();
						windowsContainerEl.scrollLeft += e.deltaY;
					}
				}, { passive: false });
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

			if (year === 2001 && month === 9 && window.AchievementsManager) {
				window.AchievementsManager.progress('calendar_time_traveler', 1);
			}

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

			if (win.classList.contains('window-detached')) {
				if (window.WindowManager) window.WindowManager.reattachFromPopout(win, id);
				return;
			}

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

		showBalloon(title, message, iconSrc = 'https://api.iconify.design/mdi/information.svg?color=%23245edc', duration = null, onClick = null) {
			if (window.SettingsApp && !window.SettingsApp.get('taskbarBalloons')) return;
			if (!balloonContainerEl) this.createDomElements();

			const resolvedDuration = (duration !== null && duration !== undefined)
				? duration
				: ((window.SettingsApp && window.SettingsApp.get('balloonDuration')) || 6000);

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

			if (resolvedDuration > 0) {
				setTimeout(() => {
					if (balloon.parentElement) removeBalloon();
				}, resolvedDuration);
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
			const windowsList = window.WindowManager ? Object.values(window.WindowManager.windows) : (typeof openWindows !== 'undefined' ? Object.values(openWindows) : []);
			if (windowsList.length === 0) return;
			const visibleCount = windowsList.filter(w => !w.classList.contains('minimized') && !w.classList.contains('xp-modal-overlay')).length;
			if (visibleCount >= 10 && window.AchievementsManager) {
				window.AchievementsManager.progress('desktop_boss_key', 1);
			}
			const allMinimized = windowsList.every(w => w.classList.contains('minimized'));

			windowsList.forEach(win => {
				if (allMinimized) {
					if (window.WindowManager) window.WindowManager.unminimize(win);
					else if (typeof unminimizeWindow === 'function') unminimizeWindow(win);
				} else {
					if (!win.classList.contains('minimized')) {
						if (window.WindowManager) window.WindowManager.minimize(win, win.id);
						else if (typeof minimizeWindow === 'function') minimizeWindow(win, win.id);
					}
				}
			});
		},

		cascadeWindows() {
			if (window.WindowManager && typeof window.WindowManager.cascade === 'function') {
				window.WindowManager.cascade();
			}
		},

		tileWindows(horizontal = true) {
			if (window.WindowManager && typeof window.WindowManager.tile === 'function') {
				window.WindowManager.tile(horizontal);
			}
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
				trayMailBtn.title = `${count} unread e-mail message(s)`;
				const countBadge = document.getElementById('tray-mail-count-badge');
				if (countBadge) {
					if (count > 0) {
						countBadge.textContent = count > 5 ? '5+' : String(count);
						countBadge.classList.remove('hidden');
					} else {
						countBadge.classList.add('hidden');
					}
				}
			}
		}
	};

	window.Taskbar = Taskbar;
})();
