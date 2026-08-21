(function () {
	const FAVORITES_STORAGE_KEY = 'xp_ie_favorites';
	const HISTORY_STORAGE_KEY = 'xp_ie_history';
	const SAFESEARCH_STORAGE_KEY = 'xp_ie_safesearch_pref';

	const DEFAULT_FAVORITES = [
		{ id: 'fav-msn', title: 'MSN Internet Start', url: 'about:home', icon: 'https://api.iconify.design/mdi/web.svg?color=%231b4b9b' },
		{ id: 'fav-search', title: 'Web Search & SafeSearch', url: 'about:search', icon: 'https://api.iconify.design/mdi/magnify.svg?color=%231b4b9b' },
		{ id: 'fav-projects', title: 'Portfolio Project Directory', url: 'about:projects', icon: '../assets/images/desk/icons/Folder Closed.webp' },
		{ id: 'fav-github', title: 'GitHub - Colin B.R. (Wartets)', url: 'https://github.com/wartets', icon: 'https://img.icons8.com/fluent/24/000000/github.png' },
		{ id: 'fav-wikipedia', title: 'Wikipedia - The Free Encyclopedia', url: 'https://en.wikipedia.org', icon: 'https://api.iconify.design/mdi/wikipedia.svg?color=%23333333' },
		{ id: 'fav-msdn', title: 'MSDN Architecture Reference', url: 'http://msdn.microsoft.com/', icon: '../assets/images/desk/icons/List File.webp' },
		{ id: 'fav-winupdate', title: 'Windows Update Catalog', url: 'http://windowsupdate.microsoft.com/', icon: '../assets/images/desk/icons/Activate Windows.webp' }
	];

	let ieWindowState = null;

	const InternetExplorerApp = {
		open(initialUrl = 'about:home') {
			const id = 'window-internet-explorer';
			const existingWin = document.getElementById(id);
			if (existingWin) {
				if (typeof bringWindowToFront === 'function') bringWindowToFront(existingWin);
				if (existingWin.classList.contains('minimized') && typeof unminimizeWindow === 'function') {
					unminimizeWindow(existingWin);
				}
				if (initialUrl && initialUrl !== 'about:blank') {
					this.createTab(existingWin, initialUrl, true);
				}
				return existingWin;
			}

			const contentHTML = this.buildWindowTemplate();
			const win = createXPWindow(id, 'Internet Explorer', contentHTML, 860, 580, {
				iconSrc: '../assets/images/desk/icons/Internet Explorer.webp'
			});

			win.classList.add('ie-browser-window');
			win.dataset.appId = 'ie';
			win.querySelector('.xp-window-content').style.padding = '0';

			ieWindowState = {
				tabs: [],
				activeTabId: null,
				sidebarMode: null,
				textZoom: 100,
				favorites: this.loadFavorites(),
				history: this.loadHistory()
			};

			win.getWindowState = () => ({
				appId: 'ie',
				sidebarMode: ieWindowState.sidebarMode,
				textZoom: ieWindowState.textZoom,
				activeTabId: ieWindowState.activeTabId,
				tabs: ieWindowState.tabs.map(t => ({
					id: t.id,
					title: t.title,
					currentUrl: t.currentUrl,
					history: t.history,
					historyIndex: t.historyIndex
				}))
			});

			this.bindWindowEvents(win);
			this.createTab(win, initialUrl, true);
			return win;
		},

		openUrl(url) {
			return this.open(url);
		},

		buildWindowTemplate() {
			return `
				<div class="ie-layout-root">
					<div class="ie-menubar-container">
						<ul class="ie-menubar-list">
							<li class="ie-menu-item" data-menu="file"><u>F</u>ile</li>
							<li class="ie-menu-item" data-menu="edit"><u>E</u>dit</li>
							<li class="ie-menu-item" data-menu="view"><u>V</u>iew</li>
							<li class="ie-menu-item" data-menu="favorites"><u>F</u>avorites</li>
							<li class="ie-menu-item" data-menu="tools"><u>T</u>ools</li>
							<li class="ie-menu-item" data-menu="help"><u>H</u>elp</li>
						</ul>
						<div class="ie-brand-throbber" id="ie-throbber" title="Internet Explorer">
							<div class="ie-throbber-globe"></div>
						</div>
					</div>

					<div class="ie-toolbar-standard">
						<div class="ie-tb-group">
							<button type="button" class="ie-tool-button tb-ie-back" title="Back (Alt+Left Arrow)" disabled>
								<div class="ie-icon-back"></div>
								<span>Back</span>
								<div class="ie-tb-arrow tb-ie-back-arrow"></div>
							</button>
							<button type="button" class="ie-tool-button tb-ie-forward" title="Forward (Alt+Right Arrow)" disabled>
								<div class="ie-icon-forward"></div>
								<div class="ie-tb-arrow tb-ie-forward-arrow"></div>
							</button>
							<button type="button" class="ie-tool-button tb-ie-stop" title="Stop (Esc)">
								<img src="https://api.iconify.design/mdi/close.svg?color=%23cc3333" alt="">
								<span>Stop</span>
							</button>
							<button type="button" class="ie-tool-button tb-ie-refresh" title="Refresh (F5)">
								<img src="https://api.iconify.design/mdi/refresh.svg?color=%232e7d32" alt="">
								<span>Refresh</span>
							</button>
							<button type="button" class="ie-tool-button tb-ie-home" title="Home (Alt+Home)">
								<img src="https://api.iconify.design/mdi/home.svg?color=%231b4b9b" alt="">
								<span>Home</span>
							</button>
						</div>

						<div class="ie-tb-separator"></div>

						<div class="ie-tb-group">
							<button type="button" class="ie-tool-button tb-ie-search" title="Search Companion (Ctrl+E)">
								<img src="https://api.iconify.design/mdi/magnify.svg?color=%231b4b9b" alt="">
								<span>Search</span>
							</button>
							<button type="button" class="ie-tool-button tb-ie-favorites" title="Favorites (Ctrl+I)">
								<img src="https://api.iconify.design/mdi/star.svg?color=%23e68a00" alt="">
								<span>Favorites</span>
							</button>
							<button type="button" class="ie-tool-button tb-ie-history" title="History (Ctrl+H)">
								<img src="https://api.iconify.design/mdi/history.svg?color=%231b4b9b" alt="">
								<span>History</span>
							</button>
						</div>

						<div class="ie-tb-separator"></div>

						<div class="ie-tb-group">
							<button type="button" class="ie-tool-button tb-ie-mail" title="Mail (Outlook Express)">
								<img src="../assets/images/desk/icons/Mail.webp" alt="">
								<div class="ie-tb-arrow"></div>
							</button>
							<button type="button" class="ie-tool-button tb-ie-print" title="Print (Ctrl+P)">
								<img src="../assets/images/desk/icons/Fax.webp" alt="">
								<span>Print</span>
							</button>
							<button type="button" class="ie-tool-button tb-ie-source" title="View Source in Notepad">
								<img src="../assets/images/desk/icons/Notepad.webp" alt="">
							</button>
						</div>
					</div>

					<div class="ie-address-row">
						<span class="ie-address-label">Address</span>
						<div class="ie-address-combobox">
							<img src="https://api.iconify.design/mdi/web.svg?color=%231b4b9b" class="ie-address-icon" id="ie-address-icon" alt="">
							<input type="text" class="ie-address-input" id="ie-address-input" value="about:home" spellcheck="false">
							<div class="ie-address-arrow" id="ie-address-dropdown-arrow" title="Address history">▼</div>
						</div>
						<button type="button" class="ie-go-btn" id="ie-go-button" title="Go to URL">
							<div class="ie-go-icon">➔</div>
							<span>Go</span>
						</button>
					</div>

					<div class="ie-favorites-band">
						<span class="ie-links-title">Links</span>
						<div class="ie-links-container" id="ie-quick-links-bar"></div>
					</div>

					<div class="ie-tabs-bar-container">
						<div class="ie-tabs-list" id="ie-tabs-list"></div>
						<button type="button" class="ie-tab-new-btn" id="ie-btn-new-tab" title="Open New Tab (Ctrl+T)">+</button>
						<button type="button" class="ie-quicktabs-btn" id="ie-btn-quicktabs" title="Quick Tabs (Ctrl+Q)">⊞</button>
					</div>

					<div class="ie-workspace-body">
						<div class="ie-sidebar-pane" id="ie-sidebar" style="display: none;">
							<div class="ie-sidebar-header">
								<div class="ie-sidebar-title" id="ie-sidebar-title">Favorites</div>
								<button type="button" class="ie-sidebar-close" id="ie-sidebar-close">×</button>
							</div>
							<div class="ie-sidebar-content" id="ie-sidebar-content"></div>
						</div>

						<div class="ie-workspace-splitter" id="ie-splitter" style="display: none;"></div>

						<div class="ie-viewport-container" id="ie-viewport-container"></div>
					</div>

					<div class="ie-statusbar">
						<div class="ie-sb-status" id="ie-status-text">Done</div>
						<div class="ie-sb-progress-container" id="ie-progress-container" style="display: none;">
							<div class="ie-sb-progress-bar" id="ie-progress-bar"></div>
						</div>
						<div class="ie-sb-lock" id="ie-status-lock" style="display: none;" title="SSL Encrypted Connection">
							<img src="https://api.iconify.design/mdi/lock.svg?color=%232e7d32" alt="">
						</div>
						<div class="ie-sb-zone" id="ie-status-zone">
							<img src="https://api.iconify.design/mdi/web.svg?color=%231b4b9b" id="ie-zone-icon" alt="">
							<span id="ie-zone-text">Internet</span>
						</div>
					</div>
				</div>
			`;
		},

		bindWindowEvents(win) {
			const addressInput = win.querySelector('#ie-address-input');
			const goBtn = win.querySelector('#ie-go-button');
			const addressArrow = win.querySelector('#ie-address-dropdown-arrow');
			const backBtn = win.querySelector('.tb-ie-back');
			const forwardBtn = win.querySelector('.tb-ie-forward');
			const stopBtn = win.querySelector('.tb-ie-stop');
			const refreshBtn = win.querySelector('.tb-ie-refresh');
			const homeBtn = win.querySelector('.tb-ie-home');
			const searchBtn = win.querySelector('.tb-ie-search');
			const favBtn = win.querySelector('.tb-ie-favorites');
			const histBtn = win.querySelector('.tb-ie-history');
			const mailBtn = win.querySelector('.tb-ie-mail');
			const printBtn = win.querySelector('.tb-ie-print');
			const sourceBtn = win.querySelector('.tb-ie-source');
			const newTabBtn = win.querySelector('#ie-btn-new-tab');
			const quickTabsBtn = win.querySelector('#ie-btn-quicktabs');
			const sidebarClose = win.querySelector('#ie-sidebar-close');

			const submitUrl = () => {
				const activeTab = this.getActiveTab();
				if (!activeTab) return;
				const inputVal = addressInput.value.trim();
				this.navigateTab(activeTab.id, inputVal);
			};

			goBtn.addEventListener('click', submitUrl);
			addressInput.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') submitUrl();
			});

			addressInput.addEventListener('focus', () => addressInput.select());

			addressArrow.addEventListener('click', (e) => {
				e.stopPropagation();
				this.showAddressDropdown(win, addressInput);
			});

			backBtn.addEventListener('click', (e) => {
				if (e.target.closest('.tb-ie-back-arrow')) {
					e.stopPropagation();
					this.showTabHistoryDropdown(win, backBtn, true);
					return;
				}
				const tab = this.getActiveTab();
				if (tab && tab.historyIndex > 0) {
					tab.historyIndex--;
					this.loadUrlIntoTab(tab.id, tab.history[tab.historyIndex], false);
				}
			});

			forwardBtn.addEventListener('click', (e) => {
				if (e.target.closest('.tb-ie-forward-arrow')) {
					e.stopPropagation();
					this.showTabHistoryDropdown(win, forwardBtn, false);
					return;
				}
				const tab = this.getActiveTab();
				if (tab && tab.historyIndex < tab.history.length - 1) {
					tab.historyIndex++;
					this.loadUrlIntoTab(tab.id, tab.history[tab.historyIndex], false);
				}
			});

			stopBtn.addEventListener('click', () => {
				const tab = this.getActiveTab();
				if (tab && tab.loadingTimer) {
					clearTimeout(tab.loadingTimer);
					tab.loadingTimer = null;
					this.setTabLoading(tab.id, false);
					this.setStatus(win, 'Done', 'internet');
				}
			});

			refreshBtn.addEventListener('click', () => {
				const tab = this.getActiveTab();
				if (tab) this.loadUrlIntoTab(tab.id, tab.currentUrl, false);
			});

			homeBtn.addEventListener('click', () => {
				const tab = this.getActiveTab();
				if (tab) this.navigateTab(tab.id, 'about:home');
			});

			searchBtn.addEventListener('click', () => {
				this.toggleSidebar(win, 'search');
			});

			favBtn.addEventListener('click', () => {
				this.toggleSidebar(win, 'favorites');
			});

			histBtn.addEventListener('click', () => {
				this.toggleSidebar(win, 'history');
			});

			mailBtn.addEventListener('click', (e) => {
				e.stopPropagation();
				const rect = mailBtn.getBoundingClientRect();
				const menuItems = [
					{ label: 'Read Mail', icon: '../assets/images/desk/icons/Mail.webp', action: () => { if (typeof openOutlookExpress === 'function') openOutlookExpress(); } },
					{ label: 'New Message...', icon: '../assets/images/desk/icons/File.webp', action: () => { if (typeof openOutlookExpress === 'function') openOutlookExpress(); } },
					{ separator: true },
					{ label: 'Send a Link...', action: () => { this.sendLinkByMail(); } },
					{ label: 'Send Page...', action: () => { this.sendPageByMail(); } }
				];
				if (window.ContextMenu) window.ContextMenu.show(menuItems, rect.left, rect.bottom + 2);
			});

			printBtn.addEventListener('click', () => {
				if (window.DeskAPI && window.DeskAPI.openPrinters) window.DeskAPI.openPrinters();
			});

			sourceBtn.addEventListener('click', () => {
				this.viewActiveTabSource();
			});

			newTabBtn.addEventListener('click', () => {
				this.createTab(win, 'about:home', true);
			});

			quickTabsBtn.addEventListener('click', () => {
				const activeTab = this.getActiveTab();
				if (activeTab) this.navigateTab(activeTab.id, 'about:tabs');
			});

			sidebarClose.addEventListener('click', () => {
				this.closeSidebar(win);
			});

			win.querySelectorAll('.ie-menu-item').forEach(item => {
				item.addEventListener('click', (e) => {
					e.stopPropagation();
					const menuKey = item.dataset.menu;
					const rect = item.getBoundingClientRect();
					this.openMenuBarDropdown(menuKey, win, rect.left, rect.bottom);
				});
			});

			win.addEventListener('keydown', (e) => {
				const ctrl = e.ctrlKey || e.metaKey;
				const alt = e.altKey;
				const key = e.key.toLowerCase();

				if (e.key === 'F11') {
					e.preventDefault();
					if (typeof maximizeWindow === 'function') maximizeWindow(win);
					if (window.AchievementsManager) {
						window.AchievementsManager.progress('ie_fullscreen_f11', 1);
					}
				} else if (ctrl && key === 't') {
					e.preventDefault();
					this.createTab(win, 'about:home', true);
				} else if (ctrl && key === 'w') {
					e.preventDefault();
					const activeTab = this.getActiveTab();
					if (activeTab) this.closeTab(win, activeTab.id);
				} else if (ctrl && key === 'r') {
					e.preventDefault();
					refreshBtn.click();
				} else if (ctrl && key === 'h') {
					e.preventDefault();
					histBtn.click();
				} else if (ctrl && key === 'i') {
					e.preventDefault();
					favBtn.click();
				} else if (ctrl && key === 'e') {
					e.preventDefault();
					searchBtn.click();
				} else if (ctrl && key === 'd') {
					e.preventDefault();
					this.addCurrentPageToFavorites();
				} else if (ctrl && key === 'u') {
					e.preventDefault();
					this.viewActiveTabSource();
				} else if (alt && e.key === 'Home') {
					e.preventDefault();
					homeBtn.click();
				} else if (alt && e.key === 'ArrowLeft') {
					e.preventDefault();
					backBtn.click();
				} else if (alt && e.key === 'ArrowRight') {
					e.preventDefault();
					forwardBtn.click();
				}
			});

			this.renderQuickLinksBar(win);
		},

		renderQuickLinksBar(win) {
			const container = win.querySelector('#ie-quick-links-bar');
			if (!container) return;
			container.innerHTML = '';

			const links = (window.SettingsApp && window.SettingsApp.get('internetExplorerQuickLinks')) || [
				{ name: 'MSN Start', url: 'about:home' },
				{ name: 'Web Search', url: 'about:search' },
				{ name: 'Projects Directory', url: 'about:projects' }
			];

			links.forEach(link => {
				const btn = document.createElement('button');
				btn.type = 'button';
				btn.className = 'ie-link-item';
				btn.textContent = link.name;
				btn.addEventListener('click', () => {
					const tab = this.getActiveTab();
					if (tab) this.navigateTab(tab.id, link.url);
				});
				btn.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					e.stopPropagation();
					if (window.ContextMenu) {
						const items = [
							{ label: 'Open', bold: true, action: () => { const tab = this.getActiveTab(); if (tab) this.navigateTab(tab.id, link.url); } },
							{ label: 'Open in New Tab', action: () => { this.createTab(win, link.url, true); } },
							{ label: 'Open in New Window', action: () => { InternetExplorerApp.open(link.url); } },
							{ separator: true },
							{ label: 'Copy Shortcut', action: () => navigator.clipboard.writeText(link.url) },
							{ label: 'Properties', action: () => showXPDialog('Link Properties', `Target: ${link.url}\nType: Internet Shortcut`, 'info') }
						];
						window.ContextMenu.show(items, e.clientX, e.clientY);
					}
				});
				container.appendChild(btn);
			});
		},

		createTab(win, url = 'about:home', activate = true) {
			const tabId = `tab-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
			const tab = {
				id: tabId,
				title: 'Loading...',
				currentUrl: url,
				history: [url],
				historyIndex: 0,
				loading: false,
				loadingTimer: null,
				viewportEl: null
			};

			const viewportContainer = win.querySelector('#ie-viewport-container');
			const viewportEl = document.createElement('div');
			viewportEl.className = 'ie-tab-viewport';
			viewportEl.id = `viewport-${tabId}`;
			viewportContainer.appendChild(viewportEl);
			tab.viewportEl = viewportEl;

			ieWindowState.tabs.push(tab);
			this.renderTabsBar(win);

			if (activate || ieWindowState.tabs.length === 1) {
				this.switchTab(win, tabId);
			}

			this.loadUrlIntoTab(tabId, url, false);
			return tab;
		},

		closeTab(win, tabId) {
			const index = ieWindowState.tabs.findIndex(t => t.id === tabId);
			if (index === -1) return;

			const tab = ieWindowState.tabs[index];
			if (tab.loadingTimer) clearTimeout(tab.loadingTimer);
			if (tab.viewportEl) tab.viewportEl.remove();

			ieWindowState.tabs.splice(index, 1);

			if (ieWindowState.tabs.length === 0) {
				if (typeof closeWindow === 'function') closeWindow(win, win.id);
				return;
			}

			if (ieWindowState.activeTabId === tabId) {
				const nextTab = ieWindowState.tabs[Math.max(0, index - 1)];
				this.switchTab(win, nextTab.id);
			}

			this.renderTabsBar(win);
		},

		switchTab(win, tabId) {
			const tab = ieWindowState.tabs.find(t => t.id === tabId);
			if (!tab) return;

			ieWindowState.activeTabId = tabId;

			ieWindowState.tabs.forEach(t => {
				if (t.viewportEl) {
					t.viewportEl.classList.toggle('active', t.id === tabId);
				}
			});

			this.renderTabsBar(win);
			this.updateNavigationControls(win, tab);

			const addressInput = win.querySelector('#ie-address-input');
			if (addressInput) addressInput.value = tab.currentUrl;

			const titleEl = win.querySelector('.xp-window-header .title');
			if (titleEl) titleEl.textContent = `${tab.title} - Internet Explorer`;
		},

		renderTabsBar(win) {
			const tabsListEl = win.querySelector('#ie-tabs-list');
			if (!tabsListEl) return;
			tabsListEl.innerHTML = '';

			ieWindowState.tabs.forEach(tab => {
				const tabEl = document.createElement('div');
				tabEl.className = `ie-tab-item ${tab.id === ieWindowState.activeTabId ? 'active' : ''}`;
				tabEl.dataset.tabId = tab.id;
				tabEl.title = `${tab.title}\n${tab.currentUrl}`;

				const iconImg = document.createElement('img');
				iconImg.className = 'ie-tab-icon';
				iconImg.src = tab.loading 
					? 'https://api.iconify.design/mdi/loading.svg?color=%231b4b9b' 
					: (tab.currentUrl.startsWith('https://') 
						? 'https://api.iconify.design/mdi/lock.svg?color=%232e7d32' 
						: '../assets/images/desk/icons/Internet Explorer.webp');
				if (tab.loading) iconImg.classList.add('ie-spinning');
				tabEl.appendChild(iconImg);

				const titleSpan = document.createElement('span');
				titleSpan.className = 'ie-tab-title';
				titleSpan.textContent = tab.title;
				tabEl.appendChild(titleSpan);

				const closeBtn = document.createElement('button');
				closeBtn.type = 'button';
				closeBtn.className = 'ie-tab-close-btn';
				closeBtn.textContent = '×';
				closeBtn.title = 'Close Tab (Ctrl+W)';
				closeBtn.addEventListener('click', (e) => {
					e.stopPropagation();
					this.closeTab(win, tab.id);
				});
				tabEl.appendChild(closeBtn);

				tabEl.addEventListener('click', () => {
					this.switchTab(win, tab.id);
				});

				tabEl.addEventListener('auxclick', (e) => {
					if (e.button === 1) {
						e.preventDefault();
						e.stopPropagation();
						this.closeTab(win, tab.id);
					}
				});

				tabEl.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					e.stopPropagation();
					if (window.ContextMenu) {
						const items = [
							{ label: 'New Tab', shortcut: 'Ctrl+T', action: () => this.createTab(win, 'about:home', true) },
							{ label: 'Duplicate Tab', action: () => this.createTab(win, tab.currentUrl, true) },
							{ separator: true },
							{ label: 'Refresh', shortcut: 'F5', action: () => this.loadUrlIntoTab(tab.id, tab.currentUrl, false) },
							{ label: 'Close Tab', shortcut: 'Ctrl+W', action: () => this.closeTab(win, tab.id) },
							{
								label: 'Close Other Tabs',
								disabled: ieWindowState.tabs.length <= 1,
								action: () => {
									const others = ieWindowState.tabs.filter(t => t.id !== tab.id);
									others.forEach(o => this.closeTab(win, o.id));
								}
							}
						];
						window.ContextMenu.show(items, e.clientX, e.clientY);
					}
				});

				tabsListEl.appendChild(tabEl);
			});
		},

		updateNavigationControls(win, tab) {
			const backBtn = win.querySelector('.tb-ie-back');
			const forwardBtn = win.querySelector('.tb-ie-forward');
			if (backBtn) backBtn.disabled = tab.historyIndex <= 0;
			if (forwardBtn) forwardBtn.disabled = tab.historyIndex >= tab.history.length - 1;
		},

		getActiveTab() {
			if (!ieWindowState || !ieWindowState.activeTabId) return null;
			return ieWindowState.tabs.find(t => t.id === ieWindowState.activeTabId);
		},

		navigateTab(tabId, url) {
			const tab = ieWindowState.tabs.find(t => t.id === tabId);
			if (!tab) return;
			let normalized = this.normalizeUrl(url);

			if (tab.historyIndex < tab.history.length - 1) {
				tab.history = tab.history.slice(0, tab.historyIndex + 1);
			}
			tab.history.push(normalized);
			tab.historyIndex = tab.history.length - 1;

			this.loadUrlIntoTab(tabId, normalized, true);
		},

		normalizeUrl(input) {
			const trimmed = input.trim();
			if (!trimmed) return 'about:home';
			if (trimmed.startsWith('about:') || trimmed.startsWith('file://')) return trimmed;
			
			const lower = trimmed.toLowerCase();
			if (lower === 'home' || lower === 'msn.com' || lower === 'www.msn.com') return 'about:home';
			if (lower === 'projects' || lower === 'portfolio' || lower === 'portfolio/projects') return 'about:projects';
			if (lower === 'search' || lower === 'search.msn.com') return 'about:search';
			if (lower === 'tabs') return 'about:tabs';

			if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;

			const hasDomainPattern = /^([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i.test(trimmed);
			if (hasDomainPattern) {
				return `https://${trimmed}`;
			}

			return `about:search?q=${encodeURIComponent(trimmed)}`;
		},

		loadUrlIntoTab(tabId, url, recordHistory = true) {
			const win = document.getElementById('window-internet-explorer');
			const tab = ieWindowState.tabs.find(t => t.id === tabId);
			if (!tab || !tab.viewportEl) return;

			tab.currentUrl = url;
			tab.loading = true;
			this.setTabLoading(tabId, true);
			this.setThrobberActive(win, true);
			this.setStatus(win, `Opening page ${url}...`, 'internet', true);

			if (url.toLowerCase().includes('wartets.github.io') && window.AchievementsManager) {
				window.AchievementsManager.progress('ie_visit_site', 1);
			}

			if (recordHistory) {
				this.addToHistory(url, url);
			}

			if (tab.id === ieWindowState.activeTabId && win) {
				const addressInput = win.querySelector('#ie-address-input');
				if (addressInput) addressInput.value = url;
			}

			if (tab.loadingTimer) clearTimeout(tab.loadingTimer);

			tab.loadingTimer = setTimeout(() => {
				const rendered = this.renderPageContent(url, tabId);
				tab.viewportEl.innerHTML = '';
				tab.viewportEl.appendChild(rendered.element);
				tab.title = rendered.title;
				tab.loading = false;

				this.setTabLoading(tabId, false);
				this.setThrobberActive(win, false);
				this.setStatus(win, 'Done', rendered.zone || 'internet', false);
				this.renderTabsBar(win);

				if (tab.id === ieWindowState.activeTabId && win) {
					const titleEl = win.querySelector('.xp-window-header .title');
					if (titleEl) titleEl.textContent = `${tab.title} - Internet Explorer`;
					this.updateNavigationControls(win, tab);
				}

				this.bindPageInteractiveElements(tab.viewportEl, tabId);
			}, 320);
		},

		setTabLoading(tabId, isLoading) {
			const tabEl = document.querySelector(`.ie-tab-item[data-tab-id="${tabId}"]`);
			if (!tabEl) return;
			const icon = tabEl.querySelector('.ie-tab-icon');
			if (icon) {
				icon.src = isLoading 
					? 'https://api.iconify.design/mdi/loading.svg?color=%231b4b9b' 
					: '../assets/images/desk/icons/Internet Explorer.webp';
				icon.classList.toggle('ie-spinning', isLoading);
			}
		},

		setThrobberActive(win, isActive) {
			if (!win) return;
			const throbber = win.querySelector('#ie-throbber');
			if (throbber) throbber.classList.toggle('active', isActive);
		},

		setStatus(win, text, zone = 'internet', showProgress = false) {
			if (!win) return;
			const statusText = win.querySelector('#ie-status-text');
			const progressContainer = win.querySelector('#ie-progress-container');
			const zoneText = win.querySelector('#ie-zone-text');
			const zoneIcon = win.querySelector('#ie-zone-icon');
			const lockIcon = win.querySelector('#ie-status-lock');

			if (statusText) statusText.textContent = text;
			if (progressContainer) progressContainer.style.display = showProgress ? 'flex' : 'none';

			if (zoneText) {
				if (zone === 'local') zoneText.textContent = 'Local Intranet';
				else if (zone === 'trusted') zoneText.textContent = 'Trusted Sites';
				else zoneText.textContent = 'Internet';
			}

			if (zoneIcon) {
				zoneIcon.src = zone === 'local' 
					? '../assets/images/desk/icons/My Computer.webp' 
					: 'https://api.iconify.design/mdi/web.svg?color=%231b4b9b';
			}

			const activeTab = this.getActiveTab();
			const isSecure = activeTab && activeTab.currentUrl.startsWith('https://');
			if (lockIcon) lockIcon.style.display = isSecure ? 'flex' : 'none';
		},

		renderPageContent(url, tabId) {
			const cleanUrl = url.toLowerCase();

			if (cleanUrl === 'about:home' || cleanUrl === 'http://home.msn.com/' || cleanUrl === 'http://msn.com/') {
				return { title: 'MSN.com - Internet Start Portal', element: this.buildMSNHomePage(tabId), zone: 'internet' };
			}
			if (cleanUrl.startsWith('about:search') || cleanUrl.startsWith('http://search.msn.com/')) {
				let query = '';
				try {
					const parsed = new URL(url.startsWith('about:search') ? `http://dummy.search/${url.replace('about:search', '')}` : url);
					query = parsed.searchParams.get('q') || '';
				} catch (e) {
					query = '';
				}
				return { title: query ? `${query} - MSN Search & SafeSearch` : 'MSN Search & SafeSearch Portal', element: this.buildWebSearchPage(query, tabId), zone: 'internet' };
			}
			if (cleanUrl === 'about:projects' || cleanUrl === 'http://portfolio/projects' || cleanUrl === 'http://portfolio.wartets/projects') {
				return { title: 'Portfolio Project Catalog - Colin B.R.', element: this.buildPortfolioWebDirectory(tabId), zone: 'local' };
			}
			if (cleanUrl.startsWith('http://windowsupdate.microsoft.com') || cleanUrl.startsWith('http://windowsupdate.Microsoft.com')) {
				return { title: 'Windows Update Catalog', element: this.buildWindowsUpdatePage(tabId), zone: 'trusted' };
			}
			if (cleanUrl.startsWith('http://msdn.microsoft.com') || cleanUrl.startsWith('http://msdn.wartets.dev')) {
				return { title: 'MSDN Library - Technical Architecture', element: this.buildMSDNPage(tabId), zone: 'internet' };
			}
			if (cleanUrl === 'about:tabs') {
				return { title: 'Quick Tabs Overview', element: this.buildQuickTabsView(tabId), zone: 'local' };
			}
			if (cleanUrl === 'about:blank') {
				const blank = document.createElement('div');
				blank.className = 'ie-page-blank';
				return { title: 'Blank Page', element: blank, zone: 'local' };
			}

			if (cleanUrl.startsWith('file://') || (typeof fs !== 'undefined' && fs.findByPath(url))) {
				const filePath = url.replace('file://', '');
				const file = fs.findByPath(filePath);
				if (file && file instanceof File) {
					return { title: file.name, element: this.buildLocalFilePage(file), zone: 'local' };
				}
			}

			if (url.startsWith('http://') || url.startsWith('https://')) {
				return { title: url, element: this.buildExternalWebPage(url, tabId), zone: url.startsWith('https://') ? 'trusted' : 'internet' };
			}

			return { title: 'The page cannot be displayed', element: this.buildErrorPage(url, tabId), zone: 'internet' };
		},

		buildMSNHomePage(tabId) {
			const container = document.createElement('div');
			container.className = 'ie-page-container ie-msn-portal';

			const allProjects = (typeof projects !== 'undefined') ? projects.flat().filter(p => p && p.show !== false) : [];
			const featuredProject = allProjects.find(p => p.keywords && p.keywords.includes('high-performance')) || allProjects[0];
			const unreadMails = (window.DeskAPI && window.DeskAPI.getUnreadMailCount) ? window.DeskAPI.getUnreadMailCount() : 0;

			const resolveTitle = (item) => {
				if (!item || !item.title) return '';
				if (typeof item.title === 'string') return item.title;
				return item.title.en || item.title.fr || Object.values(item.title)[0] || '';
			};

			const resolveDesc = (item) => {
				if (!item) return '';
				const target = item.longDescription || item.longDescrition || item.description || '';
				if (typeof target === 'string') return target;
				if (typeof target === 'object') return target.en || target.fr || Object.values(target)[0] || '';
				return '';
			};

			container.innerHTML = `
				<div class="ie-msn-header">
					<div class="ie-msn-logo-bar">
						<div class="ie-msn-butterfly"></div>
						<div class="ie-msn-brand">msn.</div>
						<div class="ie-msn-tagline">Welcome to Colin B.R.'s Research & Development Portal</div>
					</div>
					<div class="ie-msn-search-box">
						<span style="font-weight:bold; font-size:11px; color:#1b4b9b;">Web & Projects Search:</span>
						<input type="text" class="ie-msn-search-input" id="msn-portal-search-query" placeholder="Search keywords, simulations, mathematics...">
						<button type="button" class="xp-button" id="msn-portal-search-btn">Search</button>
					</div>
				</div>

				<div class="ie-msn-content-grid">
					<div class="ie-msn-col-main">
						<div class="ie-msn-card ie-hero-card">
							<div class="ie-card-header">PORTFOLIO SPOTLIGHT & RESEARCH OVERVIEW</div>
							<div class="ie-card-body">
								<h3 style="margin-top:0; color:#0c3b88;">Computational Physics, Mathematical Visualizations & System Simulations</h3>
								<p>Welcome to the interactive desktop workspace of <strong>Colin B.R. (Wartets)</strong>. This digital environment hosts research projects covering continuum cellular automata (Lenia GPU), Lattice Boltzmann fluid mechanics, N-body astrophysics, discrete geometry, and audio synthesis engines.</p>
								<div class="ie-hero-actions" style="margin-top:12px;">
									<a href="about:projects" class="xp-button" style="text-decoration:none;">Open Project Directory</a>
									<a href="about:search" class="xp-button" style="text-decoration:none;">Open Web Search Engine</a>
									<a href="https://github.com/wartets" target="_blank" class="xp-button" style="text-decoration:none;">GitHub Repositories</a>
								</div>
							</div>
						</div>

						${featuredProject ? `
						<div class="ie-msn-card">
							<div class="ie-card-header">FEATURED PROJECT: ${resolveTitle(featuredProject)}</div>
							<div class="ie-card-body" style="display:flex; gap:14px; align-items:center;">
								<img src="${featuredProject.icon || '../assets/images/desk/icons/File.webp'}" style="width:56px; height:56px; object-fit:contain; border:1px solid #7f9db9; padding:2px; background:#fff; flex-shrink:0;">
								<div style="flex:1;">
									<p style="margin:0 0 8px 0; font-size:12px; line-height:1.4;">${resolveDesc(featuredProject)}</p>
									<div style="display:flex; gap:8px;">
										<a href="${featuredProject.link || '#'}" target="_blank" class="ie-web-link" style="font-weight:bold;">Launch Simulation ➔</a>
										${featuredProject.github ? `<a href="${featuredProject.github}" target="_blank" class="ie-web-link">Source Code (GitHub)</a>` : ''}
									</div>
								</div>
							</div>
						</div>` : ''}

						<div class="ie-msn-card">
							<div class="ie-card-header">PROJECT DOMAINS & CHANNELS</div>
							<div class="ie-msn-links-grid">
								<a href="about:search?q=physics" class="ie-channel-link"><strong>Fluid & Wave Physics</strong><span>LBM, Turbulence, FDTD scalar propagation</span></a>
								<a href="about:search?q=simulation" class="ie-channel-link"><strong>Artificial Life & Automata</strong><span>Lenia GPU compute shaders, emergence</span></a>
								<a href="about:search?q=math" class="ie-channel-link"><strong>Discrete & Continuum Mathematics</strong><span>Fractals, splines, Huzita origami axioms</span></a>
								<a href="about:search?q=music" class="ie-channel-link"><strong>Audio & Digital Signal Processing</strong><span>High-resolution compositions & tracker synthesis</span></a>
							</div>
						</div>
					</div>

					<div class="ie-msn-col-sidebar">
						<div class="ie-msn-widget">
							<div class="ie-widget-title">Outlook Express Mailbox</div>
							<div class="ie-widget-body">
								<div>Status: <strong>${unreadMails}</strong> unread message(s)</div>
								<a href="#" id="msn-open-mail-link" class="ie-web-link" style="margin-top:6px; display:inline-block;">Open Outlook Express</a>
							</div>
						</div>

						<div class="ie-msn-widget">
							<div class="ie-widget-title">Live Web & External Services</div>
							<ul class="ie-msn-quick-list">
								<li><a href="https://github.com/wartets" target="_blank">GitHub Profile (wartets)</a></li>
								<li><a href="https://soundcloud.com/wartets" target="_blank">SoundCloud Music Library</a></li>
								<li><a href="https://www.youtube.com/@Wartets" target="_blank">YouTube Channel</a></li>
								<li><a href="https://en.wikipedia.org" target="_blank">Wikipedia Encyclopedia</a></li>
								<li><a href="about:projects">All Interactive Project Cards</a></li>
							</ul>
						</div>

						<div class="ie-msn-widget">
							<div class="ie-widget-title">SafeSearch Configuration</div>
							<div class="ie-widget-body">
								<div style="font-size:11px; color:#333; margin-bottom:6px;">Filtered Web browsing is active.</div>
								<a href="about:search" class="ie-web-link">Configure SafeSearch Settings</a>
							</div>
						</div>
					</div>
				</div>
			`;

			const searchInput = container.querySelector('#msn-portal-search-query');
			const searchBtn = container.querySelector('#msn-portal-search-btn');
			const openMail = container.querySelector('#msn-open-mail-link');

			const runSearch = () => {
				const q = searchInput.value.trim();
				this.navigateTab(tabId, `about:search?q=${encodeURIComponent(q)}`);
			};

			searchBtn.addEventListener('click', runSearch);
			searchInput.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') runSearch();
			});

			if (openMail) {
				openMail.addEventListener('click', (e) => {
					e.preventDefault();
					if (typeof openOutlookExpress === 'function') openOutlookExpress();
				});
			}

			return container;
		},

		buildWebSearchPage(query, tabId) {
			const container = document.createElement('div');
			container.className = 'ie-page-container ie-search-portal';

			const escaped = (query || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			const qLower = query.toLowerCase().trim();
			const safeSearchProvider = (window.DeskStorage ? window.DeskStorage.getItem(SAFESEARCH_STORAGE_KEY) : localStorage.getItem(SAFESEARCH_STORAGE_KEY)) || 'duckduckgo';

			let results = [];

			if (typeof projects !== 'undefined') {
				projects.flat().forEach(p => {
					if (!p || p.show === false) return;
					const title = typeof p.title === 'string' ? p.title : (p.title.en || p.title.fr || Object.values(p.title)[0] || '');
					const rawDesc = p.longDescription || p.longDescrition || p.description || '';
					const desc = typeof rawDesc === 'string' ? rawDesc : (rawDesc.en || rawDesc.fr || Object.values(rawDesc)[0] || '');
					const kw = (p.keywords || []).join(' ');
					const langs = (p.languages || []).join(' ');

					if (!qLower || title.toLowerCase().includes(qLower) || desc.toLowerCase().includes(qLower) || kw.toLowerCase().includes(qLower) || langs.toLowerCase().includes(qLower)) {
						results.push({
							title: title,
							url: p.link || `about:projects`,
							desc: desc || 'Interactive research simulation developed by Colin B.R.',
							category: (p.keywords && p.keywords[0]) ? p.keywords[0].toUpperCase() : 'PROJECT',
							icon: p.icon,
							rawProject: p
						});
					}
				});
			}

			if (qLower && typeof fs !== 'undefined') {
				const searchFolder = (folder) => {
					folder.listContent().forEach(c => {
						if (c.name.toLowerCase().includes(qLower)) {
							results.push({
								title: c.name,
								url: `file://${c.getFullPath()}`,
								desc: `Desktop filesystem element: ${c.getFullPath()}.`,
								category: c instanceof Folder ? 'FOLDER' : 'LOCAL FILE',
								icon: c.icon
							});
						}
						if (c instanceof Folder) searchFolder(c);
					});
				};
				searchFolder(fs.root);
			}

			let resultsHtml = '';
			if (results.length === 0 && qLower) {
				resultsHtml = `
					<div class="ie-search-no-results" style="padding:16px; background:#f9fbfe; border:1px solid #c5d5ec; border-radius:3px;">
						<h3 style="margin-top:0;">No local project index matches found for "<b>${escaped}</b>"</h3>
						<p>You can execute a live web SafeSearch below using filtered public search engines.</p>
					</div>
				`;
			} else {
				results.forEach(res => {
					resultsHtml += `
						<div class="ie-search-result-item">
							<div class="ie-search-result-header">
								<span class="ie-result-badge">${res.category}</span>
								<a href="${res.url}" class="ie-result-title" ${res.url.startsWith('http') ? 'target="_blank"' : ''}>${res.title}</a>
							</div>
							<div class="ie-result-url">${res.url}</div>
							<div class="ie-result-desc">${res.desc}</div>
						</div>
					`;
				});
			}

			const buildSafeUrl = (provider, term) => {
				const enc = encodeURIComponent(term);
				if (provider === 'google') return `https://www.google.com/search?q=${enc}&safe=active`;
				if (provider === 'bing') return `https://www.bing.com/search?q=${enc}&adlt=strict`;
				if (provider === 'wikipedia') return `https://en.wikipedia.org/w/index.php?search=${enc}`;
				return `https://duckduckgo.com/?q=${enc}&kp=1`;
			};

			container.innerHTML = `
				<div class="ie-search-top-bar">
					<div class="ie-search-brand">MSN <span>Search</span> & SafeSearch</div>
					<div class="ie-search-input-wrapper">
						<input type="text" class="ie-search-input" id="search-page-query" value="${escaped}" placeholder="Search projects, web documents, scientific topics...">
						<button type="button" class="xp-button" id="search-page-btn">Search Index</button>
						<button type="button" class="xp-button" id="search-web-live-btn" style="font-weight:bold;">SafeSearch Web ➔</button>
					</div>
				</div>

				<div class="ie-search-options-band">
					<div style="display:flex; align-items:center; gap:8px;">
						<label for="search-safesearch-engine" style="font-size:11px; font-weight:bold;">Web Provider:</label>
						<select id="search-safesearch-engine" class="xp-select">
							<option value="duckduckgo" ${safeSearchProvider === 'duckduckgo' ? 'selected' : ''}>DuckDuckGo (SafeSearch Enforced)</option>
							<option value="google" ${safeSearchProvider === 'google' ? 'selected' : ''}>Google (SafeSearch Strict)</option>
							<option value="bing" ${safeSearchProvider === 'bing' ? 'selected' : ''}>Bing (Strict Filtering)</option>
							<option value="wikipedia" ${safeSearchProvider === 'wikipedia' ? 'selected' : ''}>Wikipedia Encyclopedia</option>
						</select>
					</div>
					<div style="font-size:11px; color:#555;">
						${qLower ? `Local matching records: <b>${results.length}</b>` : 'Type keywords to filter projects or explore the live web.'}
					</div>
				</div>

				${qLower ? `
				<div class="ie-search-live-banner">
					<span>Looking for live web results for "<b>${escaped}</b>"?</span>
					<a href="${buildSafeUrl(safeSearchProvider, qLower)}" target="_blank" class="ie-web-link" id="search-direct-link" style="font-weight:bold;">Open External SafeSearch in New Tab ➔</a>
				</div>` : ''}

				<div class="ie-search-results-list">
					${resultsHtml}
				</div>
			`;

			const queryInput = container.querySelector('#search-page-query');
			const searchBtn = container.querySelector('#search-page-btn');
			const webLiveBtn = container.querySelector('#search-web-live-btn');
			const engineSelect = container.querySelector('#search-safesearch-engine');

			engineSelect.addEventListener('change', () => {
				if (window.DeskStorage) window.DeskStorage.setItem(SAFESEARCH_STORAGE_KEY, engineSelect.value);
				else localStorage.setItem(SAFESEARCH_STORAGE_KEY, engineSelect.value);
				const directLink = container.querySelector('#search-direct-link');
				if (directLink && queryInput.value.trim()) {
					directLink.href = buildSafeUrl(engineSelect.value, queryInput.value.trim());
				}
			});

			const runLocalSearch = () => {
				const nextQ = queryInput.value.trim();
				this.navigateTab(tabId, `about:search?q=${encodeURIComponent(nextQ)}`);
			};

			const runWebLiveSearch = () => {
				const nextQ = queryInput.value.trim() || 'physics simulations';
				const targetUrl = buildSafeUrl(engineSelect.value, nextQ);
				this.navigateTab(tabId, targetUrl);
			};

			searchBtn.addEventListener('click', runLocalSearch);
			webLiveBtn.addEventListener('click', runWebLiveSearch);

			queryInput.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') runLocalSearch();
			});

			return container;
		},

		buildExternalWebPage(url, tabId) {
			const container = document.createElement('div');
			container.className = 'ie-page-container ie-external-web-container';
			container.style.cssText = 'display: flex; flex-direction: column; width: 100%; height: 100%; overflow: hidden; background: #ffffff;';

			const infoBar = document.createElement('div');
			infoBar.className = 'ie-infobar';
			infoBar.innerHTML = `
				<img src="https://api.iconify.design/mdi/information.svg?color=%231b4b9b" class="ie-infobar-icon" alt="">
				<span class="ie-infobar-text">Viewing live external web resource: <b>${url}</b>. If this page restricts iframe embedding, <a href="${url}" target="_blank" class="ie-infobar-link">click here to open in a new window</a>.</span>
				<button type="button" class="ie-infobar-close" title="Close Information Bar">×</button>
			`;

			const closeBtn = infoBar.querySelector('.ie-infobar-close');
			closeBtn.addEventListener('click', () => infoBar.remove());

			const iframe = document.createElement('iframe');
			iframe.className = 'ie-external-frame';
			iframe.src = url;
			iframe.style.cssText = 'flex: 1; width: 100%; height: 100%; border: none; background: #ffffff;';
			iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-modals');
			iframe.setAttribute('allow', 'fullscreen; clipboard-read; clipboard-write');

			container.appendChild(infoBar);
			container.appendChild(iframe);
			return container;
		},

		buildWindowsUpdatePage(tabId) {
			const container = document.createElement('div');
			container.className = 'ie-page-container ie-winupdate-portal';

			container.innerHTML = `
				<div class="ie-winupdate-header">
					<img src="https://api.iconify.design/mdi/shield-sync-outline.svg?color=%232e7d32" style="width:40px; height:40px;">
					<div>
						<h2>Microsoft Windows Update</h2>
						<span>Windows XP Professional Service Pack 3 Catalog</span>
					</div>
				</div>

				<div class="ie-winupdate-body">
					<div class="ie-winupdate-banner">
						<strong>Your computer is up to date!</strong>
						<p>No critical security updates or Service Pack components are currently required for your installation.</p>
					</div>

					<h3>Installed Updates & Patches</h3>
					<table class="ie-winupdate-table">
						<thead>
							<tr><th>KB Article</th><th>Description</th><th>Installed Date</th><th>Status</th></tr>
						</thead>
						<tbody>
							<tr><td>KB973688</td><td>Security Update for Windows XP (Luna Theme Engine)</td><td>2002-04-12</td><td>Installed</td></tr>
							<tr><td>KB958644</td><td>Vulnerability in Server Service Security Fix</td><td>2002-03-01</td><td>Installed</td></tr>
							<tr><td>KB946648</td><td>Internet Explorer 6.0 Cumulative Security Hotfix</td><td>2002-02-18</td><td>Installed</td></tr>
							<tr><td>SP3-936929</td><td>Windows XP Service Pack 3 Complete Rollup</td><td>2001-10-25</td><td>Installed</td></tr>
						</tbody>
					</table>
				</div>
			`;
			return container;
		},

		buildMSDNPage(tabId) {
			const container = document.createElement('div');
			container.className = 'ie-page-container ie-msdn-portal';

			container.innerHTML = `
				<div class="ie-msdn-top">
					<div class="ie-msdn-logo">MSDN Library</div>
					<div class="ie-msdn-nav">Architecture & Technical Reference Catalog</div>
				</div>
				<div class="ie-msdn-layout">
					<div class="ie-msdn-tree">
						<div class="ie-msdn-node active">Wartets Core Portfolio</div>
						<div class="ie-msdn-node">├─ Desktop Window Manager</div>
						<div class="ie-msdn-node">├─ Audio Synthesis Engine</div>
						<div class="ie-msdn-node">├─ FileSystem Virtual Memory</div>
						<div class="ie-msdn-node">├─ Canvas Simulation Shaders</div>
						<div class="ie-msdn-node">└─ Outlook MailStore Protocol</div>
					</div>
					<div class="ie-msdn-article">
						<h2>Microsoft Windows XP Web Architecture</h2>
						<p>The desktop environment simulates a complete Windows XP workstation running directly inside the browser using modern vanilla JavaScript, WebAudio API, HTML5 Canvas, and flexible CSS variable theme matrices.</p>
						<h3>Key Design Principles</h3>
						<ul>
							<li><b>Modular Component Separation:</b> Explorer, Taskbar, Notepad, Paint, Calculator, Minesweeper, MailStore, and Internet Explorer exist as independent lifecycle subsystems.</li>
							<li><b>Multi-Layer State Persistence:</b> LocalStorage stores directory hierarchies, recycle bin queues, mailbox archives, and display metrics.</li>
							<li><b>Authentic Graphic Fidelity:</b> CRT curvature displacement mapping, scanline oscillators, and pixel-matched Luna/Royale styling.</li>
						</ul>
					</div>
				</div>
			`;
			return container;
		},

		buildRetroNewsPage(tabId) {
			const container = document.createElement('div');
			container.className = 'ie-page-container ie-news-portal';

			container.innerHTML = `
				<div class="ie-news-header">
					<h1>THE RETRO CHRONICLE</h1>
					<div>Global Information, Cyber Technology & Science - Edition 2001</div>
				</div>
				<div class="ie-news-grid">
					<div class="ie-news-main">
						<h2>Personal Computing Enters New Era with High-Res GUI Desktops</h2>
						<p class="ie-news-lead">Millions of users worldwide transition to 32-bit visual styles with drop shadows, alpha blending and rich audio feedback.</p>
						<p>The rapid acceleration of web technologies and client-side processing enables complex scientific visualizations and interactive simulations directly on desktop terminals.</p>
					</div>
					<div class="ie-news-side">
						<div class="ie-news-item">
							<h4>Web Search Engines Transform Information Access</h4>
							<p>Indexing billions of documents, search algorithms like Wartex enable instant query resolution.</p>
						</div>
						<div class="ie-news-item">
							<h4>Digital Audio Formats Revolutionize Music</h4>
							<p>Compressed high-fidelity audio trackers and media players empower bedroom producers and researchers.</p>
						</div>
					</div>
				</div>
			`;
			return container;
		},

		buildPortfolioWebDirectory(tabId) {
			const container = document.createElement('div');
			container.className = 'ie-page-container ie-directory-portal';

			const allProjects = (typeof projects !== 'undefined') ? projects.flat().filter(p => p && p.show !== false) : [];

			const resolveTitle = (item) => {
				if (!item || !item.title) return '';
				if (typeof item.title === 'string') return item.title;
				return item.title.en || item.title.fr || Object.values(item.title)[0] || '';
			};

			const resolveDesc = (item) => {
				if (!item) return '';
				const target = item.longDescription || item.longDescrition || item.description || '';
				if (typeof target === 'string') return target;
				if (typeof target === 'object') return target.en || target.fr || Object.values(target)[0] || '';
				return '';
			};

			const categories = [
				{ id: 'sim', name: 'Physics & Fluid Dynamics', filter: p => p.keywords && (p.keywords.includes('physics') || p.keywords.includes('fluid-dynamics') || p.keywords.includes('simulation')) },
				{ id: 'math', name: 'Mathematics & Algorithmic Geometry', filter: p => p.keywords && (p.keywords.includes('math') || p.keywords.includes('fractals') || p.keywords.includes('cellular-automata')) },
				{ id: 'tools', name: 'Engineering Tools & Compilers', filter: p => p.keywords && (p.keywords.includes('tool') || p.keywords.includes('latex') || p.keywords.includes('c++')) },
				{ id: 'games', name: 'Interactive Graphics & Games', filter: p => p.keywords && (p.keywords.includes('game') || p.keywords.includes('3d') || p.keywords.includes('arcade')) },
				{ id: 'audio', name: 'Audio Signal Processing & Music', filter: p => p.keywords && p.keywords.includes('music') }
			];

			let sectionsHtml = '';

			categories.forEach(cat => {
				const catProjects = allProjects.filter(cat.filter);
				if (catProjects.length === 0) return;

				let cardsHtml = '';
				catProjects.forEach(p => {
					const title = resolveTitle(p);
					const desc = resolveDesc(p);
					const kwBadges = (p.keywords || []).slice(0, 4).map(k => `<span class="ie-dir-badge">${k}</span>`).join(' ');

					cardsHtml += `
						<div class="ie-dir-card">
							<img src="${p.icon || '../assets/images/desk/icons/File.webp'}" class="ie-dir-card-img" alt="">
							<div class="ie-dir-card-body">
								<h4>${title}</h4>
								<p>${desc}</p>
								<div class="ie-dir-badges-row">${kwBadges}</div>
								<div class="ie-dir-actions">
									<a href="${p.link || '#'}" target="_blank" class="xp-button-small ie-launch-project-btn" style="text-decoration:none;">Launch Project</a>
									${p.github ? `<a href="${p.github}" target="_blank" class="xp-button-small" style="text-decoration:none;">GitHub</a>` : ''}
								</div>
							</div>
						</div>
					`;
				});

				sectionsHtml += `
					<div class="ie-dir-section">
						<h3 class="ie-dir-section-title">${cat.name} (${catProjects.length})</h3>
						<div class="ie-dir-grid">
							${cardsHtml}
						</div>
					</div>
				`;
			});

			container.innerHTML = `
				<div style="padding:16px; max-width: 1040px; margin: 0 auto;">
					<div class="ie-dir-header">
						<h1 style="margin:0 0 6px 0; color:#0c3b88; font-size:22px;">Colin B.R. — Interactive Project Directory</h1>
						<p style="margin:0 0 14px 0; font-size:12px; color:#444; line-height:1.45;">Comprehensive catalog of open-source simulations, scientific modeling tools, mathematical visualizers, and digital engines.</p>
					</div>
					${sectionsHtml}
				</div>
			`;
			return container;
		},

		buildQuickTabsView(tabId) {
			const container = document.createElement('div');
			container.className = 'ie-page-container ie-quicktabs-overview';

			let thumbsHtml = '';
			ieWindowState.tabs.forEach(t => {
				thumbsHtml += `
					<div class="ie-qtab-card ${t.id === ieWindowState.activeTabId ? 'active' : ''}" data-target-tab="${t.id}">
						<div class="ie-qtab-header">
							<span>${t.title}</span>
							<button type="button" class="ie-qtab-close" data-close-tab="${t.id}">×</button>
						</div>
						<div class="ie-qtab-preview">
							<span>${t.currentUrl}</span>
						</div>
					</div>
				`;
			});

			container.innerHTML = `
				<div style="padding:16px;">
					<h2>Quick Tabs (All Open Tabs)</h2>
					<div class="ie-qtabs-grid">
						${thumbsHtml}
					</div>
				</div>
			`;

			container.querySelectorAll('.ie-qtab-card').forEach(card => {
				card.addEventListener('click', (e) => {
					if (e.target.closest('.ie-qtab-close')) return;
					const targetId = card.dataset.targetTab;
					const win = document.getElementById('window-internet-explorer');
					if (win) this.switchTab(win, targetId);
				});
			});

			container.querySelectorAll('.ie-qtab-close').forEach(btn => {
				btn.addEventListener('click', (e) => {
					e.stopPropagation();
					const targetId = btn.dataset.closeTab;
					const win = document.getElementById('window-internet-explorer');
					if (win) this.closeTab(win, targetId);
				});
			});

			return container;
		},

		buildLocalFilePage(file) {
			const container = document.createElement('div');
			container.className = 'ie-page-container ie-local-file-view';

			const isHtml = file.name.toLowerCase().endsWith('.html') || file.name.toLowerCase().endsWith('.htm');
			if (isHtml) {
				container.innerHTML = file.content || '';
			} else {
				container.innerHTML = `
					<div style="padding:16px; font-family:'Lucida Console',monospace; font-size:12px; white-space:pre-wrap; background:#fff; color:#000;">
						${(file.content || '').replace(/</g, '&lt;')}
					</div>
				`;
			}
			return container;
		},

		buildErrorPage(url, tabId) {
			const container = document.createElement('div');
			container.className = 'ie-page-container ie-error-page';

			container.innerHTML = `
				<div class="ie-error-content">
					<h1>The page cannot be displayed</h1>
					<p>The page you are looking for is currently unavailable. The Web site might be experiencing technical difficulties, or you may need to adjust your browser settings.</p>
					<hr>
					<p>Please try the following:</p>
					<ul>
						<li>Click the <a href="#" id="err-refresh-link"><b>Refresh</b></a> button, or try again later.</li>
						<li>If you typed the page address in the Address bar, make sure that it is spelled correctly.</li>
						<li>To search for available destinations, open <a href="http://wartex.search/" class="ie-web-link"><b>Wartex Web Search</b></a>.</li>
						<li>Return to the <a href="about:home" class="ie-web-link"><b>MSN Internet Start</b></a> home portal.</li>
					</ul>
					<div style="margin-top:16px;">
						<button type="button" class="xp-button" id="err-diagnose-btn">Diagnose Connection Problems</button>
					</div>
					<hr style="margin-top:20px;">
					<div style="font-size:11px; color:#555;">
						Cannot find server or DNS Error<br>
						Internet Explorer
					</div>
				</div>
			`;

			const refreshLink = container.querySelector('#err-refresh-link');
			const diagnoseBtn = container.querySelector('#err-diagnose-btn');

			if (refreshLink) {
				refreshLink.addEventListener('click', (e) => {
					e.preventDefault();
					this.loadUrlIntoTab(tabId, url, false);
				});
			}

			if (diagnoseBtn) {
				diagnoseBtn.addEventListener('click', () => {
					showXPDialog('Network Diagnostics', 'Windows Network Diagnostics checked the simulated connection.\nLocal Area Connection: 100.0 Mbps Connected\nGateway: 192.168.1.1 OK\nExternal URL cannot be routed inside local sandboxed desktop environment.', 'info');
				});
			}

			return container;
		},

		bindPageInteractiveElements(viewportEl, tabId) {
			const win = document.getElementById('window-internet-explorer');

			viewportEl.querySelectorAll('a[href]').forEach(link => {
				link.addEventListener('click', (e) => {
					const href = link.getAttribute('href');
					if (link.classList.contains('ie-launch-project-btn') || link.textContent.trim().toLowerCase().includes('launch') || (href && href.startsWith('http') && link.closest('.ie-dir-card'))) {
						if (window.AchievementsManager) {
							window.AchievementsManager.progress('ie_launch_project', 1);
						}
					}
					if (href.startsWith('#')) return;
					if (link.getAttribute('target') === '_blank') return;

					e.preventDefault();
					this.navigateTab(tabId, href);
				});

				link.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					e.stopPropagation();
					const href = link.getAttribute('href');
					if (window.ContextMenu) {
						const items = [
							{ label: 'Open', bold: true, action: () => { this.navigateTab(tabId, href); } },
							{ label: 'Open in New Tab', action: () => { this.createTab(win, href, true); } },
							{ label: 'Open in New Window', action: () => { InternetExplorerApp.open(href); } },
							{ separator: true },
							{ label: 'Save Target As...', action: () => { this.downloadLinkTarget(href); } },
							{ label: 'Copy Shortcut', action: () => { navigator.clipboard.writeText(href); } },
							{ label: 'Add to Favorites...', action: () => { this.addFavorite(link.textContent || href, href); } },
							{ separator: true },
							{ label: 'Properties', action: () => { showXPDialog('Link Properties', `Target URL: ${href}\nProtocol: Hypertext Transfer Protocol`, 'info'); } }
						];
						window.ContextMenu.show(items, e.clientX, e.clientY);
					}
				});
			});

			viewportEl.querySelectorAll('img').forEach(img => {
				img.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					e.stopPropagation();
					const src = img.getAttribute('src');
					if (window.ContextMenu) {
						const items = [
							{ label: 'Open Image in New Tab', action: () => { this.createTab(win, src, true); } },
							{ label: 'Save Picture As...', action: () => { this.downloadImage(src); } },
							{ label: 'Set as Desktop Background', bold: true, action: () => { if (typeof setImageAsWallpaper === 'function') setImageAsWallpaper(src, 'cover'); } },
							{ label: 'Copy Image Address', action: () => { navigator.clipboard.writeText(src); } },
							{ separator: true },
							{ label: 'Properties', action: () => { showXPDialog('Picture Properties', `Source: ${src}\nDimensions: ${img.naturalWidth || 100}x${img.naturalHeight || 100} pixels`, 'info'); } }
						];
						window.ContextMenu.show(items, e.clientX, e.clientY);
					}
				});
			});

			viewportEl.addEventListener('contextmenu', (e) => {
				if (e.target.closest('a') || e.target.closest('img')) return;
				e.preventDefault();
				const tab = this.getActiveTab();
				if (!tab) return;
				if (window.ContextMenu) {
					const items = [
						{ label: 'Back', disabled: tab.historyIndex <= 0, action: () => { if (tab.historyIndex > 0) { tab.historyIndex--; this.loadUrlIntoTab(tab.id, tab.history[tab.historyIndex], false); } } },
						{ label: 'Forward', disabled: tab.historyIndex >= tab.history.length - 1, action: () => { if (tab.historyIndex < tab.history.length - 1) { tab.historyIndex++; this.loadUrlIntoTab(tab.id, tab.history[tab.historyIndex], false); } } },
						{ separator: true },
						{ label: 'Save Page As...', action: () => { this.saveCurrentPage(); } },
						{ label: 'Set as Desktop Background', action: () => { if (typeof setImageAsWallpaper === 'function') setImageAsWallpaper(tab.currentUrl, 'cover'); } },
						{ separator: true },
						{ label: 'Select All', shortcut: 'Ctrl+A', action: () => { document.execCommand('selectAll'); } },
						{ label: 'Create Shortcut on Desktop', action: () => { this.createDesktopShortcut(tab.title, tab.currentUrl); } },
						{ label: 'Add to Favorites...', shortcut: 'Ctrl+D', action: () => { this.addCurrentPageToFavorites(); } },
						{ label: 'View Source', shortcut: 'Ctrl+U', action: () => { this.viewActiveTabSource(); } },
						{ separator: true },
						{ label: 'Refresh', shortcut: 'F5', action: () => { this.loadUrlIntoTab(tab.id, tab.currentUrl, false); } },
						{ label: 'Properties', action: () => { showXPDialog('Page Properties', `Title: ${tab.title}\nAddress: ${tab.currentUrl}\nZone: Internet\nEncoding: UTF-8`, 'info'); } }
					];
					window.ContextMenu.show(items, e.clientX, e.clientY);
				}
			});
		},

		showAddressDropdown(win, inputEl) {
			const rect = inputEl.getBoundingClientRect();
			const historyUrls = this.loadHistory().slice(0, 10);
			const items = historyUrls.map(h => ({
				label: h.url,
				icon: 'https://api.iconify.design/mdi/web.svg?color=%231b4b9b',
				action: () => {
					const activeTab = this.getActiveTab();
					if (activeTab) this.navigateTab(activeTab.id, h.url);
				}
			}));

			if (items.length > 0 && window.ContextMenu) {
				window.ContextMenu.show(items, rect.left, rect.bottom + 2);
			}
		},

		showTabHistoryDropdown(win, buttonEl, isBack = true) {
			const tab = this.getActiveTab();
			if (!tab) return;
			const rect = buttonEl.getBoundingClientRect();
			const items = [];

			if (isBack) {
				for (let i = tab.historyIndex - 1; i >= 0; i--) {
					const u = tab.history[i];
					items.push({
						label: u,
						action: () => {
							tab.historyIndex = i;
							this.loadUrlIntoTab(tab.id, u, false);
						}
					});
				}
			} else {
				for (let i = tab.historyIndex + 1; i < tab.history.length; i++) {
					const u = tab.history[i];
					items.push({
						label: u,
						action: () => {
							tab.historyIndex = i;
							this.loadUrlIntoTab(tab.id, u, false);
						}
					});
				}
			}

			if (items.length > 0 && window.ContextMenu) {
				window.ContextMenu.show(items, rect.left, rect.bottom + 2);
			}
		},

		toggleSidebar(win, mode) {
			const sidebar = win.querySelector('#ie-sidebar');
			const splitter = win.querySelector('#ie-splitter');
			const titleEl = win.querySelector('#ie-sidebar-title');
			const contentEl = win.querySelector('#ie-sidebar-content');

			if (ieWindowState.sidebarMode === mode && sidebar.style.display !== 'none') {
				this.closeSidebar(win);
				return;
			}

			ieWindowState.sidebarMode = mode;
			sidebar.style.display = 'flex';
			splitter.style.display = 'block';

			if (mode === 'favorites') {
				titleEl.textContent = 'Favorites';
				this.renderFavoritesSidebar(contentEl, win);
			} else if (mode === 'history') {
				titleEl.textContent = 'History';
				this.renderHistorySidebar(contentEl, win);
			} else if (mode === 'search') {
				titleEl.textContent = 'Search Companion';
				this.renderSearchSidebar(contentEl, win);
			}
		},

		closeSidebar(win) {
			const sidebar = win.querySelector('#ie-sidebar');
			const splitter = win.querySelector('#ie-splitter');
			if (sidebar) sidebar.style.display = 'none';
			if (splitter) splitter.style.display = 'none';
			ieWindowState.sidebarMode = null;
		},

		renderFavoritesSidebar(container, win) {
			container.innerHTML = `
				<div style="padding:6px; border-bottom:1px solid #aca899; display:flex; gap:6px;">
					<button type="button" class="xp-button-small" id="ie-fav-add-btn">Add to Favorites...</button>
					<button type="button" class="xp-button-small" id="ie-fav-org-btn">Organize...</button>
				</div>
				<div class="ie-tree-pane" id="ie-fav-tree"></div>
			`;

			const tree = container.querySelector('#ie-fav-tree');
			const addBtn = container.querySelector('#ie-fav-add-btn');
			const orgBtn = container.querySelector('#ie-fav-org-btn');

			addBtn.addEventListener('click', () => this.addCurrentPageToFavorites());
			orgBtn.addEventListener('click', () => {
				showXPDialog('Organize Favorites', 'Favorites can be managed, sorted and bookmarked across browser sessions.', 'info');
			});

			const favorites = this.loadFavorites();
			favorites.forEach(fav => {
				const row = document.createElement('div');
				row.className = 'ie-tree-item';
				row.innerHTML = `
					<img src="${fav.icon || 'https://api.iconify.design/mdi/star.svg?color=%23e68a00'}" class="ie-tree-icon">
					<span>${fav.title}</span>
				`;
				row.addEventListener('click', () => {
					const tab = this.getActiveTab();
					if (tab) this.navigateTab(tab.id, fav.url);
				});
				row.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					e.stopPropagation();
					if (window.ContextMenu) {
						const items = [
							{ label: 'Open', bold: true, action: () => { const tab = this.getActiveTab(); if (tab) this.navigateTab(tab.id, fav.url); } },
							{ label: 'Open in New Tab', action: () => { this.createTab(win, fav.url, true); } },
							{ separator: true },
							{ label: 'Delete', action: () => { this.removeFavorite(fav.id); this.renderFavoritesSidebar(container, win); } },
							{ label: 'Properties', action: () => { showXPDialog('Favorite Properties', `Title: ${fav.title}\nURL: ${fav.url}`, 'info'); } }
						];
						window.ContextMenu.show(items, e.clientX, e.clientY);
					}
				});
				tree.appendChild(row);
			});
		},

		renderHistorySidebar(container, win) {
			container.innerHTML = `
				<div style="padding:6px; border-bottom:1px solid #aca899; display:flex; justify-content:space-between; align-items:center;">
					<span style="font-size:11px; font-weight:bold;">View By Date:</span>
					<button type="button" class="xp-button-small" id="ie-hist-clear-btn">Clear History</button>
				</div>
				<div class="ie-tree-pane" id="ie-hist-tree"></div>
			`;

			const tree = container.querySelector('#ie-hist-tree');
			const clearBtn = container.querySelector('#ie-hist-clear-btn');

			clearBtn.addEventListener('click', () => {
				if (window.DeskStorage) window.DeskStorage.removeItem(HISTORY_STORAGE_KEY);
				else localStorage.removeItem(HISTORY_STORAGE_KEY);
				ieWindowState.history = [];
				this.renderHistorySidebar(container, win);
			});

			const history = this.loadHistory();
			if (history.length === 0) {
				tree.innerHTML = '<div style="padding:10px; font-size:11px; color:#666;">(History is empty)</div>';
				return;
			}

			history.forEach(item => {
				const row = document.createElement('div');
				row.className = 'ie-tree-item';
				row.innerHTML = `
					<img src="https://api.iconify.design/mdi/web.svg?color=%231b4b9b" class="ie-tree-icon">
					<div style="overflow:hidden; text-overflow:ellipsis;">
						<div style="font-weight:bold;">${item.title || item.url}</div>
						<div style="font-size:10px; color:#555;">${item.url}</div>
					</div>
				`;
				row.addEventListener('click', () => {
					const tab = this.getActiveTab();
					if (tab) this.navigateTab(tab.id, item.url);
				});
				tree.appendChild(row);
			});
		},

		renderSearchSidebar(container, win) {
			container.innerHTML = `
				<div style="padding:10px; display:flex; flex-direction:column; gap:8px;">
					<div style="display:flex; align-items:center; gap:8px;">
						<img src="https://api.iconify.design/mdi/dog.svg?color=%23e68a00" style="width:32px; height:32px;">
						<div style="font-size:11px;">What are you looking for?</div>
					</div>
					<input type="text" id="ie-side-search-input" class="xp-input" placeholder="Type search words...">
					<button type="button" class="xp-button" id="ie-side-search-btn">Search</button>
				</div>
			`;

			const input = container.querySelector('#ie-side-search-input');
			const btn = container.querySelector('#ie-side-search-btn');

			const exec = () => {
				const q = input.value.trim();
				const tab = this.getActiveTab();
				if (tab) this.navigateTab(tab.id, `http://wartex.search/?q=${encodeURIComponent(q)}`);
			};

			btn.addEventListener('click', exec);
			input.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') exec();
			});
		},

		openMenuBarDropdown(menuKey, win, x, y) {
			const activeTab = this.getActiveTab();
			let items = [];

			if (menuKey === 'file') {
				items = [
					{
						label: 'New',
						submenu: [
							{ label: 'Tab', shortcut: 'Ctrl+T', action: () => this.createTab(win, 'about:home', true) },
							{ label: 'Window', shortcut: 'Ctrl+N', action: () => InternetExplorerApp.open('about:home') },
							{ label: 'Message...', icon: '../assets/images/desk/icons/File.webp', action: () => { if (typeof openOutlookExpress === 'function') openOutlookExpress(); } }
						]
					},
					{ label: 'Open...', shortcut: 'Ctrl+O', action: () => this.promptOpenUrl() },
					{ label: 'Save As...', action: () => this.saveCurrentPage() },
					{ separator: true },
					{ label: 'Print...', shortcut: 'Ctrl+P', action: () => { if (window.DeskAPI && window.DeskAPI.openPrinters) window.DeskAPI.openPrinters(); } },
					{ label: 'Send', submenu: [
						{ label: 'Page by E-mail...', action: () => this.sendPageByMail() },
						{ label: 'Link by E-mail...', action: () => this.sendLinkByMail() },
						{ label: 'Shortcut to Desktop', action: () => { if (activeTab) this.createDesktopShortcut(activeTab.title, activeTab.currentUrl); } }
					] },
					{ label: 'Properties', action: () => { if (activeTab) showXPDialog('Page Properties', `Title: ${activeTab.title}\nURL: ${activeTab.currentUrl}`, 'info'); } },
					{ separator: true },
					{ label: 'Close Tab', shortcut: 'Ctrl+W', action: () => { if (activeTab) this.closeTab(win, activeTab.id); } }
				];
			} else if (menuKey === 'edit') {
				items = [
					{ label: 'Cut', shortcut: 'Ctrl+X', disabled: true, action: () => {} },
					{ label: 'Copy', shortcut: 'Ctrl+C', action: () => document.execCommand('copy') },
					{ label: 'Paste', shortcut: 'Ctrl+V', disabled: true, action: () => {} },
					{ separator: true },
					{ label: 'Select All', shortcut: 'Ctrl+A', action: () => document.execCommand('selectAll') }
				];
			} else if (menuKey === 'view') {
				items = [
					{
						label: 'Toolbars',
						submenu: [
							{ label: 'Standard Buttons', checked: true, action: () => {} },
							{ label: 'Address Bar', checked: true, action: () => {} },
							{ label: 'Links Bar', checked: true, action: () => {} }
						]
					},
					{
						label: 'Explorer Bar',
						submenu: [
							{ label: 'Search', shortcut: 'Ctrl+E', checked: ieWindowState.sidebarMode === 'search', action: () => this.toggleSidebar(win, 'search') },
							{ label: 'Favorites', shortcut: 'Ctrl+I', checked: ieWindowState.sidebarMode === 'favorites', action: () => this.toggleSidebar(win, 'favorites') },
							{ label: 'History', shortcut: 'Ctrl+H', checked: ieWindowState.sidebarMode === 'history', action: () => this.toggleSidebar(win, 'history') }
						]
					},
					{ separator: true },
					{ label: 'Stop', shortcut: 'Esc', action: () => { const tab = this.getActiveTab(); if (tab && tab.loadingTimer) { clearTimeout(tab.loadingTimer); this.setTabLoading(tab.id, false); } } },
					{ label: 'Refresh', shortcut: 'F5', action: () => { if (activeTab) this.loadUrlIntoTab(activeTab.id, activeTab.currentUrl, false); } },
					{ separator: true },
					{
						label: 'Text Size',
						submenu: [
							{ label: 'Largest', radio: ieWindowState.textZoom === 130, action: () => this.setTextZoom(win, 130) },
							{ label: 'Larger', radio: ieWindowState.textZoom === 115, action: () => this.setTextZoom(win, 115) },
							{ label: 'Medium', radio: ieWindowState.textZoom === 100, action: () => this.setTextZoom(win, 100) },
							{ label: 'Smaller', radio: ieWindowState.textZoom === 85, action: () => this.setTextZoom(win, 85) },
							{ label: 'Smallest', radio: ieWindowState.textZoom === 70, action: () => this.setTextZoom(win, 70) }
						]
					},
					{ label: 'Source', shortcut: 'Ctrl+U', action: () => this.viewActiveTabSource() },
					{ label: 'Full Screen', shortcut: 'F11', action: () => { 
						if (typeof maximizeWindow === 'function') maximizeWindow(win);
						if (window.AchievementsManager) window.AchievementsManager.progress('ie_fullscreen_f11', 1);
					} }
				];
			} else if (menuKey === 'favorites') {
				const favs = this.loadFavorites();
				const favItems = favs.map(f => ({
					label: f.title,
					action: () => { if (activeTab) this.navigateTab(activeTab.id, f.url); }
				}));
				items = [
					{ label: 'Add to Favorites...', shortcut: 'Ctrl+D', action: () => this.addCurrentPageToFavorites() },
					{ label: 'Organize Favorites...', action: () => this.toggleSidebar(win, 'favorites') },
					{ separator: true },
					...favItems
				];
			} else if (menuKey === 'tools') {
				items = [
					{
						label: 'Mail and News',
						submenu: [
							{ label: 'Read Mail', action: () => { if (typeof openOutlookExpress === 'function') openOutlookExpress(); } },
							{ label: 'New Message...', action: () => { if (typeof openOutlookExpress === 'function') openOutlookExpress(); } }
						]
					},
					{ label: 'Synchronize All...', action: () => showXPDialog('Synchronize', 'Offline web pages are synchronized.', 'info') },
					{ label: 'Windows Update', action: () => { if (activeTab) this.navigateTab(activeTab.id, 'http://windowsupdate.Microsoft.com/'); } },
					{ separator: true },
					{ label: 'Internet Options...', bold: true, action: () => { if (window.SettingsApp) window.SettingsApp.open('system'); } }
				];
			} else if (menuKey === 'help') {
				items = [
					{ label: 'Contents and Index', action: () => window.open('https://github.com/wartets/Wartets.github.io', '_blank') },
					{ separator: true },
					{
						label: 'About Internet Explorer',
						bold: true,
						action: () => {
							showXPDialog('About Internet Explorer', 'Internet Explorer 6.0 SP3\nCipher Strength: 128-bit\nProduct ID: 55736-640-0000106-23589\nCustom Windows XP Desktop Web Browser Engine', 'info');
						}
					}
				];
			}

			if (window.ContextMenu) {
				window.ContextMenu.show(items, x, y);
			}
		},

		setTextZoom(win, zoomPercent) {
			ieWindowState.textZoom = zoomPercent;
			const viewportContainer = win.querySelector('#ie-viewport-container');
			if (viewportContainer) {
				viewportContainer.style.fontSize = `${zoomPercent}%`;
			}
		},

		promptOpenUrl() {
			const activeTab = this.getActiveTab();
			if (!activeTab) return;
			const current = activeTab.currentUrl;
			const url = prompt('Type the Internet address of a document or Web page, and Internet Explorer will open it for you:', current);
			if (url) this.navigateTab(activeTab.id, url);
		},

		saveCurrentPage() {
			const activeTab = this.getActiveTab();
			if (!activeTab) return;
			if (window.FileDialog) {
				window.FileDialog.open({
					mode: 'save',
					title: 'Save Web Page',
					defaultName: `${activeTab.title.replace(/[^\w-]/g, '_')}.html`,
					filterTypes: [
						{ label: 'Web Page, HTML only (*.html;*.htm)', ext: '.html', mime: 'text/html' },
						{ label: 'Text File (*.txt)', ext: '.txt', mime: 'text/plain' }
					],
					onConfirm: (folder, fileName) => {
						if (fs && folder) {
							fs.create('File', folder.getFullPath(), fileName);
							const created = folder.getByName(fileName);
							if (created) {
								created.write(activeTab.viewportEl ? activeTab.viewportEl.innerHTML : '');
							}
							if (typeof refreshUI === 'function') refreshUI();
							showXPDialog('Save As', `Web page saved successfully as '${fileName}'.`, 'info');
						}
					}
				});
			}
		},

		createDesktopShortcut(title, url) {
			if (typeof fs !== 'undefined' && fs.create) {
				fs.create('Shortcut', '/', `${title} - Shortcut`, {
					targetPath: url,
					icon: '../assets/images/desk/icons/Internet Explorer.webp'
				});
				if (typeof refreshUI === 'function') refreshUI();
				showXPDialog('Create Shortcut', `A shortcut to '${title}' has been placed on your Desktop.`, 'info');
			}
		},

		addCurrentPageToFavorites() {
			const activeTab = this.getActiveTab();
			if (!activeTab) return;
			this.addFavorite(activeTab.title, activeTab.currentUrl);
		},

		addFavorite(title, url) {
			const favs = this.loadFavorites();
			const newFav = {
				id: `fav-${Date.now()}`,
				title: title || url,
				url: url,
				icon: url.startsWith('https://') 
					? 'https://api.iconify.design/mdi/lock.svg?color=%232e7d32' 
					: 'https://api.iconify.design/mdi/web.svg?color=%231b4b9b'
			};
			favs.push(newFav);
			const payload = JSON.stringify(favs);
			if (window.DeskStorage) window.DeskStorage.setItem(FAVORITES_STORAGE_KEY, payload);
			else localStorage.setItem(FAVORITES_STORAGE_KEY, payload);
			ieWindowState.favorites = favs;
			showXPDialog('Add Favorite', `"${newFav.title}" has been added to your Favorites list.`, 'info');
		},

		removeFavorite(id) {
			let favs = this.loadFavorites();
			favs = favs.filter(f => f.id !== id);
			const payload = JSON.stringify(favs);
			if (window.DeskStorage) window.DeskStorage.setItem(FAVORITES_STORAGE_KEY, payload);
			else localStorage.setItem(FAVORITES_STORAGE_KEY, payload);
			ieWindowState.favorites = favs;
		},

		loadFavorites() {
			try {
				const raw = window.DeskStorage ? window.DeskStorage.getItem(FAVORITES_STORAGE_KEY) : localStorage.getItem(FAVORITES_STORAGE_KEY);
				return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_FAVORITES));
			} catch (e) {
				return JSON.parse(JSON.stringify(DEFAULT_FAVORITES));
			}
		},

		loadHistory() {
			try {
				const raw = window.DeskStorage ? window.DeskStorage.getItem(HISTORY_STORAGE_KEY) : localStorage.getItem(HISTORY_STORAGE_KEY);
				return raw ? JSON.parse(raw) : [];
			} catch (e) {
				return [];
			}
		},

		addToHistory(url, title) {
			let hist = this.loadHistory();
			hist = hist.filter(h => h.url !== url);
			hist.unshift({ url, title: title || url, timestamp: Date.now() });
			if (hist.length > 50) hist = hist.slice(0, 50);
			const payload = JSON.stringify(hist);
			if (window.DeskStorage) window.DeskStorage.setItem(HISTORY_STORAGE_KEY, payload);
			else localStorage.setItem(HISTORY_STORAGE_KEY, payload);
			if (ieWindowState) ieWindowState.history = hist;
		},

		loadGuestbook() {
			try {
				const raw = localStorage.getItem(GUESTBOOK_STORAGE_KEY);
				return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_GUESTBOOK_ENTRIES));
			} catch (e) {
				return JSON.parse(JSON.stringify(DEFAULT_GUESTBOOK_ENTRIES));
			}
		},

		addGuestbookEntry(entry) {
			const gb = this.loadGuestbook();
			gb.unshift(entry);
			localStorage.setItem(GUESTBOOK_STORAGE_KEY, JSON.stringify(gb));
		},

		viewActiveTabSource() {
			const activeTab = this.getActiveTab();
			if (!activeTab || !activeTab.viewportEl) return;
			const sourceHtml = activeTab.viewportEl.innerHTML;
			if (window.AchievementsManager) {
				window.AchievementsManager.progress('ie_view_source', 1);
			}
			if (window.NotepadApp) {
				const virtualFile = new File(`${activeTab.title} - Source.html`, null, sourceHtml);
				window.NotepadApp.open(virtualFile, { readOnly: true });
			}
		},

		sendLinkByMail() {
			const activeTab = this.getActiveTab();
			if (!activeTab) return;
			if (typeof openOutlookExpress === 'function') {
				openOutlookExpress();
				showXPDialog('Outlook Express', `New email prepared with link to: ${activeTab.currentUrl}`, 'info');
			}
		},

		sendPageByMail() {
			const activeTab = this.getActiveTab();
			if (!activeTab) return;
			if (typeof openOutlookExpress === 'function') {
				openOutlookExpress();
				showXPDialog('Outlook Express', `New email prepared with content of: ${activeTab.title}`, 'info');
			}
		},

		downloadLinkTarget(url) {
			const a = document.createElement('a');
			a.href = url;
			a.download = url.split('/').pop() || 'download.html';
			document.body.appendChild(a);
			a.click();
			a.remove();
		},

		downloadImage(src) {
			const a = document.createElement('a');
			a.href = src;
			a.download = src.split('/').pop() || 'image.png';
			document.body.appendChild(a);
			a.click();
			a.remove();
		}
	};

	window.InternetExplorerApp = InternetExplorerApp;
	window.openInternetExplorer = (url) => InternetExplorerApp.open(url);
})();
