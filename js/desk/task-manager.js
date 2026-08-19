(function () {
	let taskMgrInterval = null;
	let cpuHistory = new Array(60).fill(12);
	let memHistory = new Array(60).fill(180);
	let netHistory = new Array(60).fill(2);
	let currentCpuUsage = 14;
	let currentMemUsageMB = 192;
	let currentCommitLimitMB = 2048;
	let processMetricsCache = new Map();
	let baseSystemBootTime = Date.now() - 3600000 * 4;

	const SYSTEM_PROCESSES = [
		{ name: 'System', pid: 4, user: 'SYSTEM', cpu: 0.8, mem: 240, desc: 'NT Kernel & System', critical: true, icon: '../assets/images/desk/icons/System Properties.webp' },
		{ name: 'smss.exe', pid: 440, user: 'SYSTEM', cpu: 0.0, mem: 480, desc: 'Session Manager Subsystem', critical: true, icon: '../assets/images/desk/icons/System Properties.webp' },
		{ name: 'csrss.exe', pid: 512, user: 'SYSTEM', cpu: 0.4, mem: 3420, desc: 'Client Server Runtime Process', critical: true, icon: '../assets/images/desk/icons/System Properties.webp' },
		{ name: 'winlogon.exe', pid: 536, user: 'SYSTEM', cpu: 0.1, mem: 4180, desc: 'Windows Logon Application', critical: true, icon: '../assets/images/desk/icons/User Accounts.webp' },
		{ name: 'services.exe', pid: 584, user: 'SYSTEM', cpu: 0.3, mem: 3820, desc: 'Services and Controller app', critical: true, icon: '../assets/images/desk/icons/System Properties.webp' },
		{ name: 'lsass.exe', pid: 596, user: 'SYSTEM', cpu: 0.2, mem: 5640, desc: 'LSA Shell (Export Version)', critical: true, icon: '../assets/images/desk/icons/User Support.webp' },
		{ name: 'svchost.exe', pid: 748, user: 'SYSTEM', cpu: 0.5, mem: 14200, desc: 'Generic Host Process for Win32 Services', critical: false, icon: '../assets/images/desk/icons/System Properties.webp' },
		{ name: 'svchost.exe', pid: 824, user: 'NETWORK SERVICE', cpu: 0.1, mem: 4890, desc: 'Generic Host Process for Win32 Services', critical: false, icon: '../assets/images/desk/icons/Network Computers.webp' },
		{ name: 'svchost.exe', pid: 912, user: 'LOCAL SERVICE', cpu: 0.1, mem: 3950, desc: 'Generic Host Process for Win32 Services', critical: false, icon: '../assets/images/desk/icons/System Properties.webp' },
		{ name: 'spoolsv.exe', pid: 1044, user: 'SYSTEM', cpu: 0.0, mem: 4620, desc: 'Print Spooler Service', critical: false, icon: '../assets/images/desk/icons/Printer.webp' },
		{ name: 'explorer.exe', pid: 1480, user: 'Colin B.R.', cpu: 1.8, mem: 24800, desc: 'Windows Explorer Shell', critical: false, isExplorer: true, icon: '../assets/images/desk/icons/Folder Closed.webp' },
		{ name: 'taskmgr.exe', pid: 2140, user: 'Colin B.R.', cpu: 0.9, mem: 6240, desc: 'Windows Task Manager', critical: false, icon: '../assets/images/desk/icons/System Properties.webp' },
		{ name: 'alg.exe', pid: 1288, user: 'LOCAL SERVICE', cpu: 0.0, mem: 3410, desc: 'Application Layer Gateway Service', critical: false, icon: '../assets/images/desk/icons/Network Computers.webp' }
	];

	function getProcessIconForApp(appId) {
		const mapping = {
			'notepad': '../assets/images/desk/icons/Notepad.webp',
			'paint': '../assets/images/desk/icons/Paint.webp',
			'calculator': '../assets/images/desk/icons/Calculator.webp',
			'cmd': '../assets/images/desk/icons/Command Prompt.webp',
			'charmap': '../assets/images/desk/icons/List File.webp',
			'soundrecorder': '../assets/images/desk/icons/Music File.webp',
			'mediaplayer': '../assets/images/desk/icons/Video File.webp',
			'winamp': '../assets/images/desk/icons/Winamp.webp',
			'minesweeper': '../assets/images/desk/icons/Minesweeper.webp',
			'solitaire': '../assets/images/desk/icons/Hearts.webp',
			'ie': '../assets/images/desk/icons/Internet Explorer.webp',
			'outlook': '../assets/images/desk/icons/Mail.webp',
			'settings': '../assets/images/desk/icons/System Properties.webp',
			'display': '../assets/images/desk/icons/Display.webp',
			'mycomputer': '../assets/images/desk/icons/My Computer.webp',
			'network': '../assets/images/desk/icons/My Network Places.webp',
			'printers': '../assets/images/desk/icons/Fax.webp',
			'search': '../assets/images/desk/icons/Search.webp',
			'recyclebin': '../assets/images/desk/icons/Trash.webp',
			'achievements': '../assets/images/desk/icons/Trophy.webp',
			'encarta': '../assets/images/desk/icons/Earth (fixed).webp'
		};
		return mapping[appId] || '../assets/images/desk/icons/File.webp';
	}

	function mapAppIdToExecutable(appId, winId) {
		const mapping = {
			'notepad': 'notepad.exe',
			'paint': 'mspaint.exe',
			'calculator': 'calc.exe',
			'cmd': 'cmd.exe',
			'charmap': 'charmap.exe',
			'soundrecorder': 'sndrec32.exe',
			'mediaplayer': 'wmplayer.exe',
			'winamp': 'winamp.exe',
			'minesweeper': 'winmine.exe',
			'solitaire': 'sol.exe',
			'ie': 'iexplore.exe',
			'outlook': 'msimn.exe',
			'settings': 'control.exe',
			'display': 'desk.cpl',
			'mycomputer': 'explorer.exe',
			'network': 'explorer.exe',
			'printers': 'explorer.exe',
			'search': 'search.exe',
			'recyclebin': 'explorer.exe',
			'achievements': 'achievements.exe',
			'encarta': 'encarta.exe'
		};
		return mapping[appId] || `${(winId || 'app').replace(/^window-/, '')}.exe`;
	}

	const TaskManagerApp = {
		activeTab: 'applications',
		updateSpeedMs: 1000,
		isPaused: false,
		alwaysOnTop: false,
		selectedTaskRow: null,
		selectedProcessPid: null,

		open(initialTab = 'applications') {
			const id = 'window-task-manager';
			const existingWin = document.getElementById(id);
			if (existingWin) {
				if (typeof bringWindowToFront === 'function') bringWindowToFront(existingWin);
				if (existingWin.classList.contains('minimized') && typeof unminimizeWindow === 'function') {
					unminimizeWindow(existingWin);
				}
				this.switchTab(existingWin, initialTab);
				return existingWin;
			}

			const contentHTML = this.buildWindowTemplate();
			const win = createXPWindow(id, 'Windows Task Manager', contentHTML, 480, 470, {
				iconSrc: '../assets/images/desk/icons/System Properties.webp',
				resizable: true
			});

			win.classList.add('xp-taskmgr-window');
			win.dataset.appId = 'taskmgr';
			win.querySelector('.xp-window-content').style.padding = '0';
			win.querySelector('.xp-window-content').style.overflow = 'hidden';

			this.bindEvents(win);
			this.switchTab(win, initialTab);
			this.startTelemetryLoop(win);

			win.beforeClose = (force) => {
				if (taskMgrInterval) {
					clearInterval(taskMgrInterval);
					taskMgrInterval = null;
				}
				force();
			};

			return win;
		},

		buildWindowTemplate() {
			return `
				<div class="xp-taskmgr-layout">
					<div class="xp-taskmgr-menubar">
						<ul class="xp-menubar-list">
							<li class="xp-menubar-item" data-tm-menu="file"><u>F</u>ile</li>
							<li class="xp-menubar-item" data-tm-menu="options"><u>O</u>ptions</li>
							<li class="xp-menubar-item" data-tm-menu="view"><u>V</u>iew</li>
							<li class="xp-menubar-item" data-tm-menu="windows"><u>W</u>indows</li>
							<li class="xp-menubar-item" data-tm-menu="shutdown"><u>S</u>hut Down</li>
							<li class="xp-menubar-item" data-tm-menu="help"><u>H</u>elp</li>
						</ul>
					</div>

					<div class="xp-taskmgr-tabs-header">
						<button type="button" class="xp-tab-btn active" data-tab="applications">Applications</button>
						<button type="button" class="xp-tab-btn" data-tab="processes">Processes</button>
						<button type="button" class="xp-tab-btn" data-tab="performance">Performance</button>
						<button type="button" class="xp-tab-btn" data-tab="networking">Networking</button>
						<button type="button" class="xp-tab-btn" data-tab="users">Users</button>
					</div>

					<div class="xp-taskmgr-body">
						<div class="xp-taskmgr-page active" data-page="applications">
							<div class="xp-taskmgr-table-frame" id="tm-apps-table-frame">
								<div class="xp-taskmgr-list-header apps-cols">
									<div class="tm-th" data-col="task">Task</div>
									<div class="tm-th" data-col="status">Status</div>
								</div>
								<div class="xp-taskmgr-list-body" id="tm-apps-list"></div>
							</div>
							<div class="xp-taskmgr-actions-row">
								<button type="button" class="xp-button" id="tm-btn-end-task" disabled>End Task</button>
								<button type="button" class="xp-button" id="tm-btn-switch-to" disabled>Switch To</button>
								<button type="button" class="xp-button" id="tm-btn-new-task">New Task...</button>
							</div>
						</div>

						<div class="xp-taskmgr-page" data-page="processes">
							<div class="xp-taskmgr-table-frame" id="tm-proc-table-frame">
								<div class="xp-taskmgr-list-header proc-cols">
									<div class="tm-th" data-col="image">Image Name</div>
									<div class="tm-th" data-col="pid">PID</div>
									<div class="tm-th" data-col="user">User Name</div>
									<div class="tm-th" data-col="cpu">CPU</div>
									<div class="tm-th" data-col="mem">Mem Usage</div>
									<div class="tm-th" data-col="desc">Description</div>
								</div>
								<div class="xp-taskmgr-list-body" id="tm-proc-list"></div>
							</div>
							<div class="xp-taskmgr-proc-bottom">
								<label class="xp-checkbox-row">
									<input type="checkbox" id="tm-proc-show-all-users" checked>
									<span>Show processes from all users</span>
								</label>
								<button type="button" class="xp-button" id="tm-btn-end-process" disabled>End Process</button>
							</div>
						</div>

						<div class="xp-taskmgr-page" data-page="performance">
							<div class="xp-perf-grid">
								<div class="xp-perf-box">
									<div class="xp-perf-box-title">CPU Usage</div>
									<div class="xp-perf-meter-wrapper">
										<div class="xp-perf-gauge-frame">
											<div class="xp-perf-gauge-fill" id="tm-cpu-gauge-bar" style="height: 12%;"></div>
											<div class="xp-perf-gauge-grid"></div>
										</div>
										<div class="xp-perf-numeric-val" id="tm-cpu-numeric-val">12%</div>
									</div>
								</div>

								<div class="xp-perf-box">
									<div class="xp-perf-box-title">CPU Usage History</div>
									<div class="xp-perf-canvas-wrap">
										<canvas class="xp-perf-history-canvas" id="tm-cpu-history-canvas" width="220" height="74"></canvas>
									</div>
								</div>

								<div class="xp-perf-box">
									<div class="xp-perf-box-title">PF Usage</div>
									<div class="xp-perf-meter-wrapper">
										<div class="xp-perf-gauge-frame">
											<div class="xp-perf-gauge-fill mem-fill" id="tm-mem-gauge-bar" style="height: 18%;"></div>
											<div class="xp-perf-gauge-grid"></div>
										</div>
										<div class="xp-perf-numeric-val" id="tm-mem-numeric-val">192 MB</div>
									</div>
								</div>

								<div class="xp-perf-box">
									<div class="xp-perf-box-title">Page File Usage History</div>
									<div class="xp-perf-canvas-wrap">
										<canvas class="xp-perf-history-canvas" id="tm-mem-history-canvas" width="220" height="74"></canvas>
									</div>
								</div>
							</div>

							<div class="xp-perf-stats-grid">
								<fieldset class="xp-groupbox">
									<legend>Totals</legend>
									<div class="xp-perf-stat-row"><span>Handles</span><strong id="tm-stat-handles">6420</strong></div>
									<div class="xp-perf-stat-row"><span>Threads</span><strong id="tm-stat-threads">382</strong></div>
									<div class="xp-perf-stat-row"><span>Processes</span><strong id="tm-stat-processes">24</strong></div>
								</fieldset>

								<fieldset class="xp-groupbox">
									<legend>Commit Charge (K)</legend>
									<div class="xp-perf-stat-row"><span>Total</span><strong id="tm-stat-commit-total">196608</strong></div>
									<div class="xp-perf-stat-row"><span>Limit</span><strong id="tm-stat-commit-limit">2097152</strong></div>
									<div class="xp-perf-stat-row"><span>Peak</span><strong id="tm-stat-commit-peak">384920</strong></div>
								</fieldset>

								<fieldset class="xp-groupbox">
									<legend>Physical Memory (K)</legend>
									<div class="xp-perf-stat-row"><span>Total</span><strong>1048052</strong></div>
									<div class="xp-perf-stat-row"><span>Available</span><strong id="tm-stat-phys-avail">851444</strong></div>
									<div class="xp-perf-stat-row"><span>System Cache</span><strong>245810</strong></div>
								</fieldset>

								<fieldset class="xp-groupbox">
									<legend>Kernel Memory (K)</legend>
									<div class="xp-perf-stat-row"><span>Total</span><strong>48200</strong></div>
									<div class="xp-perf-stat-row"><span>Paged</span><strong>32180</strong></div>
									<div class="xp-perf-stat-row"><span>Nonpaged</span><strong>16020</strong></div>
								</fieldset>
							</div>
						</div>

						<div class="xp-taskmgr-page" data-page="networking">
							<div class="xp-perf-box" style="flex: 1; display: flex; flex-direction: column;">
								<div class="xp-perf-box-title">Local Area Connection Network History</div>
								<div class="xp-perf-canvas-wrap" style="flex: 1; min-height: 140px;">
									<canvas class="xp-perf-history-canvas" id="tm-net-history-canvas" width="440" height="150"></canvas>
								</div>
								<div class="xp-net-adapter-row">
									<span>Adapter Name: Realtek RTL8139 Family PCI Fast Ethernet NIC</span>
									<span id="tm-net-util-val">Network Util: 2.1% (100 Mbps)</span>
								</div>
							</div>
						</div>

						<div class="xp-taskmgr-page" data-page="users">
							<div class="xp-taskmgr-table-frame" style="height: 100%;">
								<div class="xp-taskmgr-list-header users-cols">
									<div class="tm-th">User</div>
									<div class="tm-th">ID</div>
									<div class="tm-th">Status</div>
									<div class="tm-th">Client Name</div>
									<div class="tm-th">Session</div>
								</div>
								<div class="xp-taskmgr-list-body" id="tm-users-list">
									<div class="xp-tm-row users-cols selected">
										<div><img src="../assets/images/desk/icons/User 1.webp" class="tm-row-icon"><span>Colin B.R.</span></div>
										<div>0</div>
										<div>Active</div>
										<div>Console</div>
										<div>Console</div>
									</div>
								</div>
							</div>
							<div class="xp-taskmgr-actions-row">
								<button type="button" class="xp-button" id="tm-btn-disconnect-user">Disconnect</button>
								<button type="button" class="xp-button" id="tm-btn-logoff-user">Logoff</button>
							</div>
						</div>
					</div>

					<div class="xp-taskmgr-statusbar">
						<div class="xp-sb-pane" id="tm-sb-proc-count">Processes: 18</div>
						<div class="xp-sb-pane" id="tm-sb-cpu-usage">CPU Usage: 14%</div>
						<div class="xp-sb-pane" id="tm-sb-commit-charge">Commit Charge: 192M / 2048M</div>
					</div>
				</div>
			`;
		},

		bindEvents(win) {
			const tabs = win.querySelectorAll('.xp-taskmgr-tabs-header .xp-tab-btn');
			tabs.forEach(btn => {
				btn.addEventListener('click', () => {
					this.switchTab(win, btn.dataset.tab);
				});
			});

			const endTaskBtn = win.querySelector('#tm-btn-end-task');
			const switchToBtn = win.querySelector('#tm-btn-switch-to');
			const newTaskBtn = win.querySelector('#tm-btn-new-task');
			const endProcessBtn = win.querySelector('#tm-btn-end-process');

			if (endTaskBtn) {
				endTaskBtn.addEventListener('click', () => {
					if (!this.selectedTaskRow) return;
					const winId = this.selectedTaskRow.dataset.windowId;
					if (winId) {
						const targetWin = document.getElementById(winId);
						if (targetWin && typeof closeWindow === 'function') {
							closeWindow(targetWin, winId);
						}
					}
					this.selectedTaskRow = null;
					this.renderApplications(win);
				});
			}

			if (switchToBtn) {
				switchToBtn.addEventListener('click', () => {
					if (!this.selectedTaskRow) return;
					const winId = this.selectedTaskRow.dataset.windowId;
					if (winId) {
						const targetWin = document.getElementById(winId);
						if (targetWin) {
							if (targetWin.classList.contains('minimized') && typeof unminimizeWindow === 'function') {
								unminimizeWindow(targetWin);
							}
							if (typeof bringWindowToFront === 'function') {
								bringWindowToFront(targetWin);
							}
						}
					}
				});
			}

			if (newTaskBtn) {
				newTaskBtn.addEventListener('click', () => {
					if (typeof openRunDialog === 'function') openRunDialog();
				});
			}

			if (endProcessBtn) {
				endProcessBtn.addEventListener('click', () => {
					if (this.selectedProcessPid === null) return;
					this.terminateProcess(win, this.selectedProcessPid);
				});
			}

			const logoffUserBtn = win.querySelector('#tm-btn-logoff-user');
			if (logoffUserBtn) {
				logoffUserBtn.addEventListener('click', () => {
					const welcome = document.getElementById('welcome-screen');
					if (welcome) {
						welcome.classList.remove('hidden');
						welcome.style.opacity = '1';
						welcome.style.display = 'flex';
					}
				});
			}

			const disconnectUserBtn = win.querySelector('#tm-btn-disconnect-user');
			if (disconnectUserBtn) {
				disconnectUserBtn.addEventListener('click', () => {
					showXPDialog('Disconnect Windows', 'Terminal session 0 (Console) disconnected.', 'info');
				});
			}

			win.querySelectorAll('.xp-menubar-item').forEach(menuItem => {
				menuItem.addEventListener('click', (e) => {
					e.stopPropagation();
					const menuKey = menuItem.dataset.tmMenu;
					const rect = menuItem.getBoundingClientRect();
					this.openMenuBarDropdown(menuKey, win, rect.left, rect.bottom);
				});
			});
		},

		switchTab(win, tabName) {
			this.activeTab = tabName;
			win.querySelectorAll('.xp-taskmgr-tabs-header .xp-tab-btn').forEach(btn => {
				btn.classList.toggle('active', btn.dataset.tab === tabName);
			});
			win.querySelectorAll('.xp-taskmgr-page').forEach(page => {
				page.classList.toggle('active', page.dataset.page === tabName);
			});

			if (tabName === 'applications') {
				this.renderApplications(win);
			} else if (tabName === 'processes') {
				this.renderProcesses(win);
			} else if (tabName === 'performance') {
				this.renderPerformanceGraphs(win);
			} else if (tabName === 'networking') {
				this.renderNetworkingGraph(win);
			}
		},

		renderApplications(win) {
			const listContainer = win.querySelector('#tm-apps-list');
			const endTaskBtn = win.querySelector('#tm-btn-end-task');
			const switchToBtn = win.querySelector('#tm-btn-switch-to');
			if (!listContainer) return;

			const openWins = (window.WindowManager ? Object.values(window.WindowManager.windows) : Object.values(openWindows || {})).filter(w => {
				return w && !w.classList.contains('xp-modal-overlay') && w.id !== 'window-task-manager' && !w.id.startsWith('dialog-');
			});

			listContainer.innerHTML = '';

			if (openWins.length === 0) {
				listContainer.innerHTML = '<div class="tm-empty-row">(No active applications running)</div>';
				if (endTaskBtn) endTaskBtn.disabled = true;
				if (switchToBtn) switchToBtn.disabled = true;
				return;
			}

			openWins.forEach(targetWin => {
				const title = targetWin.querySelector('.xp-window-header .title')?.textContent || 'Window Application';
				const iconSrc = targetWin.querySelector('.xp-window-header img')?.src || '../assets/images/desk/icons/File.webp';
				const isHung = targetWin.dataset.notResponding === 'true';

				const row = document.createElement('div');
				row.className = 'xp-tm-row apps-cols';
				row.dataset.windowId = targetWin.id;
				if (this.selectedTaskRow && this.selectedTaskRow.dataset.windowId === targetWin.id) {
					row.classList.add('selected');
				}

				row.innerHTML = `
					<div>
						<img src="${iconSrc}" class="tm-row-icon" alt="">
						<span>${title}</span>
					</div>
					<div>${isHung ? '<span style="color:#cc0000; font-weight:bold;">Not Responding</span>' : 'Running'}</div>
				`;

				row.addEventListener('click', () => {
					listContainer.querySelectorAll('.xp-tm-row').forEach(r => r.classList.remove('selected'));
					row.classList.add('selected');
					this.selectedTaskRow = row;
					if (endTaskBtn) endTaskBtn.disabled = false;
					if (switchToBtn) switchToBtn.disabled = false;
				});

				row.addEventListener('dblclick', () => {
					if (switchToBtn) switchToBtn.click();
				});

				row.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					e.stopPropagation();
					listContainer.querySelectorAll('.xp-tm-row').forEach(r => r.classList.remove('selected'));
					row.classList.add('selected');
					this.selectedTaskRow = row;
					if (endTaskBtn) endTaskBtn.disabled = false;
					if (switchToBtn) switchToBtn.disabled = false;

					if (window.ContextMenu) {
						const items = [
							{ label: 'Switch To', bold: true, action: () => { switchToBtn.click(); } },
							{ label: 'Bring To Front', action: () => { if (typeof bringWindowToFront === 'function') bringWindowToFront(targetWin); } },
							{ label: 'Minimize', action: () => { if (typeof minimizeWindow === 'function') minimizeWindow(targetWin, targetWin.id); } },
							{ label: 'Maximize', action: () => { if (typeof maximizeWindow === 'function') maximizeWindow(targetWin); } },
							{ separator: true },
							{ label: 'End Task', action: () => { endTaskBtn.click(); } },
							{ separator: true },
							{ label: 'Go To Process', action: () => { this.switchTab(win, 'processes'); } }
						];
						window.ContextMenu.show(items, e.clientX, e.clientY);
					}
				});

				listContainer.appendChild(row);
			});
		},

		getAllProcesses() {
			const activeList = [...SYSTEM_PROCESSES];
			const openWins = (window.WindowManager ? Object.values(window.WindowManager.windows) : Object.values(openWindows || {})).filter(w => {
				return w && !w.classList.contains('xp-modal-overlay') && w.id !== 'window-task-manager' && !w.id.startsWith('dialog-');
			});

			openWins.forEach((w, index) => {
				const appId = w.dataset.appId || 'app';
				const exeName = mapAppIdToExecutable(appId, w.id);
				const icon = getProcessIconForApp(appId);
				const pid = 3100 + index * 48;
				let cached = processMetricsCache.get(pid);
				if (!cached) {
					cached = {
						cpu: (Math.random() * 2.8 + 0.2),
						mem: Math.round(12000 + Math.random() * 26000)
					};
					processMetricsCache.set(pid, cached);
				}

				activeList.push({
					name: exeName,
					pid,
					user: 'Colin B.R.',
					cpu: cached.cpu,
					mem: cached.mem,
					desc: w.querySelector('.xp-window-header .title')?.textContent || 'User Application',
					critical: false,
					windowId: w.id,
					icon
				});
			});

			return activeList;
		},

		renderProcesses(win) {
			const listContainer = win.querySelector('#tm-proc-list');
			const endProcBtn = win.querySelector('#tm-btn-end-process');
			const showAllUsersCheck = win.querySelector('#tm-proc-show-all-users');
			if (!listContainer) return;

			let processes = this.getAllProcesses();
			if (showAllUsersCheck && !showAllUsersCheck.checked) {
				processes = processes.filter(p => p.user === 'Colin B.R.');
			}

			listContainer.innerHTML = '';

			processes.forEach(proc => {
				const row = document.createElement('div');
				row.className = 'xp-tm-row proc-cols';
				row.dataset.pid = String(proc.pid);
				if (this.selectedProcessPid === proc.pid) {
					row.classList.add('selected');
				}

				const formattedMem = `${Math.round(proc.mem / 1024).toLocaleString()} K`;
				const formattedCpu = proc.cpu < 0.1 ? '00' : String(Math.round(proc.cpu)).padStart(2, '0');

				row.innerHTML = `
					<div>
						<img src="${proc.icon || '../assets/images/desk/icons/System Properties.webp'}" class="tm-row-icon" alt="">
						<span>${proc.name}</span>
					</div>
					<div>${proc.pid}</div>
					<div>${proc.user}</div>
					<div>${formattedCpu}</div>
					<div style="text-align: right; padding-right: 8px;">${formattedMem}</div>
					<div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${proc.desc || ''}</div>
				`;

				row.addEventListener('click', () => {
					listContainer.querySelectorAll('.xp-tm-row').forEach(r => r.classList.remove('selected'));
					row.classList.add('selected');
					this.selectedProcessPid = proc.pid;
					if (endProcBtn) endProcBtn.disabled = false;
				});

				row.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					e.stopPropagation();
					listContainer.querySelectorAll('.xp-tm-row').forEach(r => r.classList.remove('selected'));
					row.classList.add('selected');
					this.selectedProcessPid = proc.pid;
					if (endProcBtn) endProcBtn.disabled = false;

					if (window.ContextMenu) {
						const items = [
							{ label: 'End Process', bold: true, action: () => { this.terminateProcess(win, proc.pid); } },
							{ label: 'End Process Tree', action: () => { this.terminateProcess(win, proc.pid); } },
							{ separator: true },
							{ label: 'Debug', action: () => { showXPDialog('Dr. Watson Post-Mortem Debugger', 'No attached debugger found in system registry.', 'error'); } },
							{
								label: 'Set Priority',
								submenu: [
									{ label: 'Realtime', radio: false, action: () => {} },
									{ label: 'High', radio: false, action: () => {} },
									{ label: 'AboveNormal', radio: false, action: () => {} },
									{ label: 'Normal', radio: true, action: () => {} },
									{ label: 'BelowNormal', radio: false, action: () => {} },
									{ label: 'Low', radio: false, action: () => {} }
								]
							}
						];
						window.ContextMenu.show(items, e.clientX, e.clientY);
					}
				});

				listContainer.appendChild(row);
			});
		},

		terminateProcess(win, pid) {
			const all = this.getAllProcesses();
			const target = all.find(p => p.pid === pid);
			if (!target) return;

			if (target.critical) {
				showXPDialog(
					'Unable to Terminate Process',
					`This is a critical system process. Windows cannot terminate '${target.name}'.\nTerminating this process may cause system instability or immediate shutdown.`,
					'error',
					{
						buttons: ['OK', 'Force Kill (Crash System)'],
						callback: (res) => {
							if (res === 'Force Kill (Crash System)') {
								this.triggerSystemCrash(target.name);
							}
						}
					}
				);
				return;
			}

			if (target.isExplorer) {
				showXPDialog(
					'Warning',
					'Terminating explorer.exe will close the Windows shell and desktop icons.\nDo you want to proceed?',
					'warning',
					{
						buttons: ['Yes', 'No'],
						callback: (res) => {
							if (res === 'Yes') {
								this.simulateShellRestart();
							}
						}
					}
				);
				return;
			}

			showXPDialog(
				'Task Manager Warning',
				`WARNING: Terminating a process can cause undesired results including loss of data and system instability. The process will not be given the chance to save its state or data before it is terminated.\n\nAre you sure you want to terminate ${target.name}?`,
				'warning',
				{
					buttons: ['Yes', 'No'],
					callback: (res) => {
						if (res === 'Yes') {
							if (target.windowId) {
								const w = document.getElementById(target.windowId);
								if (w && typeof closeWindow === 'function') {
									closeWindow(w, target.windowId);
								}
							}
							processMetricsCache.delete(pid);
							this.selectedProcessPid = null;
							this.renderProcesses(win);
							this.renderApplications(win);
							if (window.SettingsApp && window.SettingsApp.playSound) {
								window.SettingsApp.playSound('recycle');
							}
						}
					}
				}
			);
		},

		simulateShellRestart() {
			const desktop = document.getElementById('desktop');
			const taskbar = document.getElementById('taskbar');
			if (desktop) desktop.style.display = 'none';
			if (taskbar) taskbar.style.display = 'none';

			if (window.SettingsApp && window.SettingsApp.playSound) {
				window.SettingsApp.playSound('error');
			}

			setTimeout(() => {
				if (desktop) desktop.style.display = '';
				if (taskbar) taskbar.style.display = '';
				if (typeof refreshUI === 'function') refreshUI();
				if (window.SettingsApp && window.SettingsApp.playSound) {
					window.SettingsApp.playSound('startup');
				}
			}, 2400);
		},

		triggerSystemCrash(processName) {
			const overlay = document.createElement('div');
			overlay.style.position = 'fixed';
			overlay.style.inset = '0';
			overlay.style.background = '#000082';
			overlay.style.color = '#ffffff';
			overlay.style.fontFamily = "'Lucida Console', monospace";
			overlay.style.fontSize = '14px';
			overlay.style.zIndex = '9999999';
			overlay.style.padding = '40px';
			overlay.style.boxSizing = 'border-box';
			overlay.style.cursor = 'none';

			overlay.innerHTML = `
				<div style="background: #a8a8a8; color: #000082; display: inline-block; padding: 2px 8px; font-weight: bold; margin-bottom: 20px;">Windows</div>
				<p>A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36.</p>
				<p>The system process <strong>${processName}</strong> was forcibly killed by the user, leading to kernel panic.</p>
				<br>
				<p>* Press any key to terminate the current session and restart Windows.</p>
				<p>* Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</p>
				<br>
				<p style="text-align: center; margin-top: 40px;">Press any key to continue _</p>
			`;

			document.body.appendChild(overlay);

			const restart = () => {
				location.reload();
			};

			document.addEventListener('keydown', restart, { once: true });
			document.addEventListener('click', restart, { once: true });
		},

		renderPerformanceGraphs(win) {
			const cpuCanvas = win.querySelector('#tm-cpu-history-canvas');
			const memCanvas = win.querySelector('#tm-mem-history-canvas');
			if (!cpuCanvas || !memCanvas) return;

			this.drawPerformanceChart(cpuCanvas, cpuHistory, '#00ff00', '#004400', 100);
			this.drawPerformanceChart(memCanvas, memHistory, '#00ff00', '#004400', currentCommitLimitMB);

			const cpuGaugeBar = win.querySelector('#tm-cpu-gauge-bar');
			const cpuNum = win.querySelector('#tm-cpu-numeric-val');
			const memGaugeBar = win.querySelector('#tm-mem-gauge-bar');
			const memNum = win.querySelector('#tm-mem-numeric-val');

			if (cpuGaugeBar) cpuGaugeBar.style.height = `${currentCpuUsage}%`;
			if (cpuNum) cpuNum.textContent = `${currentCpuUsage}%`;
			if (memGaugeBar) memGaugeBar.style.height = `${Math.round((currentMemUsageMB / currentCommitLimitMB) * 100)}%`;
			if (memNum) memNum.textContent = `${currentMemUsageMB} MB`;

			const procList = this.getAllProcesses();
			const statHandles = win.querySelector('#tm-stat-handles');
			const statThreads = win.querySelector('#tm-stat-threads');
			const statProc = win.querySelector('#tm-stat-processes');
			const statCommitTotal = win.querySelector('#tm-stat-commit-total');
			const statPhysAvail = win.querySelector('#tm-stat-phys-avail');

			if (statHandles) statHandles.textContent = String(5400 + procList.length * 120);
			if (statThreads) statThreads.textContent = String(320 + procList.length * 8);
			if (statProc) statProc.textContent = String(procList.length);
			if (statCommitTotal) statCommitTotal.textContent = String(currentMemUsageMB * 1024);
			if (statPhysAvail) statPhysAvail.textContent = String(Math.max(124000, 1048052 - currentMemUsageMB * 1024));
		},

		renderNetworkingGraph(win) {
			const netCanvas = win.querySelector('#tm-net-history-canvas');
			const netUtilVal = win.querySelector('#tm-net-util-val');
			if (!netCanvas) return;

			const currentNet = netHistory[netHistory.length - 1] || 1.8;
			if (netUtilVal) netUtilVal.textContent = `Network Util: ${currentNet.toFixed(1)}% (100 Mbps)`;
			this.drawPerformanceChart(netCanvas, netHistory, '#ff0000', '#440000', 100);
		},

		drawPerformanceChart(canvas, dataPoints, strokeColor, gridColor, maxValue = 100) {
			const ctx = canvas.getContext('2d');
			const w = canvas.width;
			const h = canvas.height;

			ctx.fillStyle = '#000000';
			ctx.fillRect(0, 0, w, h);

			ctx.strokeStyle = gridColor;
			ctx.lineWidth = 1;

			const stepX = 14;
			const stepY = 12;

			ctx.beginPath();
			for (let x = 0; x < w; x += stepX) {
				ctx.moveTo(x + 0.5, 0);
				ctx.lineTo(x + 0.5, h);
			}
			for (let y = 0; y < h; y += stepY) {
				ctx.moveTo(0, y + 0.5);
				ctx.lineTo(w, y + 0.5);
			}
			ctx.stroke();

			ctx.strokeStyle = strokeColor;
			ctx.lineWidth = 1.5;
			ctx.beginPath();

			const dx = w / (dataPoints.length - 1);
			dataPoints.forEach((val, i) => {
				const x = i * dx;
				const y = h - (val / maxValue) * (h - 4) - 2;
				if (i === 0) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			});
			ctx.stroke();
		},

		startTelemetryLoop(win) {
			if (taskMgrInterval) clearInterval(taskMgrInterval);

			taskMgrInterval = setInterval(() => {
				if (this.isPaused || !document.getElementById('window-task-manager')) return;

				const procList = this.getAllProcesses();
				let simulatedCpu = 2.0;
				let simulatedMem = 110;

				procList.forEach(p => {
					const delta = (Math.random() - 0.49) * 0.8;
					p.cpu = Math.max(0, Math.min(25, p.cpu + delta));
					simulatedCpu += p.cpu;
					simulatedMem += (p.mem / 1024);
				});

				currentCpuUsage = Math.max(2, Math.min(99, Math.round(simulatedCpu)));
				currentMemUsageMB = Math.round(simulatedMem);

				cpuHistory.shift();
				cpuHistory.push(currentCpuUsage);

				memHistory.shift();
				memHistory.push(currentMemUsageMB);

				netHistory.shift();
				netHistory.push(Math.max(0.2, Math.min(60, (netHistory[netHistory.length - 1] || 1) + (Math.random() - 0.48) * 1.5)));

				const sbProc = win.querySelector('#tm-sb-proc-count');
				const sbCpu = win.querySelector('#tm-sb-cpu-usage');
				const sbCommit = win.querySelector('#tm-sb-commit-charge');

				if (sbProc) sbProc.textContent = `Processes: ${procList.length}`;
				if (sbCpu) sbCpu.textContent = `CPU Usage: ${currentCpuUsage}%`;
				if (sbCommit) sbCommit.textContent = `Commit Charge: ${currentMemUsageMB}M / ${currentCommitLimitMB}M`;

				if (this.activeTab === 'performance') {
					this.renderPerformanceGraphs(win);
				} else if (this.activeTab === 'networking') {
					this.renderNetworkingGraph(win);
				} else if (this.activeTab === 'processes') {
					this.renderProcesses(win);
				} else if (this.activeTab === 'applications') {
					this.renderApplications(win);
				}
			}, this.updateSpeedMs);
		},

		openMenuBarDropdown(menuKey, win, x, y) {
			let items = [];

			if (menuKey === 'file') {
				items = [
					{ label: 'New Task (Run...)', action: () => { if (typeof openRunDialog === 'function') openRunDialog(); } },
					{ separator: true },
					{ label: 'Exit Task Manager', action: () => { if (typeof closeWindow === 'function') closeWindow(win, win.id); } }
				];
			} else if (menuKey === 'options') {
				items = [
					{
						label: 'Always on Top',
						checked: this.alwaysOnTop,
						action: () => {
							this.alwaysOnTop = !this.alwaysOnTop;
							if (window.WindowManager) window.WindowManager.toggleAlwaysOnTop(win);
						}
					},
					{ label: 'Minimize on Use', checked: false, action: () => {} },
					{ label: 'Hide When Minimized', checked: false, action: () => {} }
				];
			} else if (menuKey === 'view') {
				items = [
					{
						label: 'Update Speed',
						submenu: [
							{ label: 'High (0.5s)', radio: this.updateSpeedMs === 500, action: () => { this.updateSpeedMs = 500; this.startTelemetryLoop(win); } },
							{ label: 'Normal (1s)', radio: this.updateSpeedMs === 1000, action: () => { this.updateSpeedMs = 1000; this.startTelemetryLoop(win); } },
							{ label: 'Low (2s)', radio: this.updateSpeedMs === 2000, action: () => { this.updateSpeedMs = 2000; this.startTelemetryLoop(win); } },
							{ label: 'Paused', radio: this.isPaused, action: () => { this.isPaused = !this.isPaused; } }
						]
					},
					{ separator: true },
					{ label: 'Refresh Now', shortcut: 'F5', action: () => { this.renderPerformanceGraphs(win); } },
					{ label: 'Select Columns...', action: () => { showXPDialog('Select Columns', 'PID, CPU, Mem Usage, User Name, Description columns active.', 'info'); } }
				];
			} else if (menuKey === 'shutdown') {
				items = [
					{ label: 'Stand By', action: () => { const w = document.getElementById('welcome-screen'); if (w) { w.classList.remove('hidden'); w.style.opacity = '1'; w.style.display = 'flex'; } } },
					{ label: 'Hibernate', action: () => { showXPDialog('Hibernate', 'System state saved to hiberfil.sys.', 'info'); } },
					{ label: 'Turn Off', action: () => { if (typeof openShutdownDialog === 'function') openShutdownDialog(); } },
					{ label: 'Restart', action: () => location.reload() },
					{ separator: true },
					{ label: 'Log Off Colin B.R.', action: () => { const w = document.getElementById('welcome-screen'); if (w) { w.classList.remove('hidden'); w.style.opacity = '1'; w.style.display = 'flex'; } } }
				];
			} else if (menuKey === 'help') {
				items = [
					{ label: 'Task Manager Help Topics', action: () => window.open('https://github.com/wartets/Wartets.github.io', '_blank') },
					{ separator: true },
					{ label: 'About Task Manager', bold: true, action: () => { showXPDialog('About Task Manager', 'Windows Task Manager Version 5.1\nProcess and Telemetry Telecommunications Subsystem', 'info'); } }
				];
			}

			if (window.ContextMenu && items.length > 0) {
				window.ContextMenu.show(items, x, y);
			}
		}
	};

	window.TaskManagerApp = TaskManagerApp;
	window.openTaskManager = (tab) => TaskManagerApp.open(tab);
})();
