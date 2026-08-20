(function () {
	let startMenuEl = null;
	let startButtonEl = null;
	let taskbarStartButtonEl = null;
	let allProgramsBtnEl = null;
	let activeFlyouts = [];
	let flyoutCloseTimeout = null;

	const StartMenu = {
		isOpen: false,

		init() {
			startMenuEl = document.getElementById('start-menu');
			startButtonEl = document.getElementById('start-button');
			taskbarStartButtonEl = document.getElementById('taskbar-start-button');

			if (!startMenuEl) return;

			this.render();
			this.bindEvents();
			this.updateProfile();
			this.updateLiveBadges();

			this.renderFrequentApps();

			if (window.DeskEventBus) {
				window.DeskEventBus.on('settings:changed', () => {
					this.updateProfile();
				});
				window.DeskEventBus.on('mail:received', () => {
					this.updateLiveBadges();
				});
				window.DeskEventBus.on('mail:read', () => {
					this.updateLiveBadges();
				});
				window.DeskEventBus.on('app:launched', () => {
					this.renderFrequentApps();
				});
			}
		},

		render() {
			const userName = (window.SettingsApp && window.SettingsApp.get('userName')) || 'Colin B.R.';
			const userAvatar = (window.SettingsApp && window.SettingsApp.get('userAvatar')) || '../assets/images/desk/icons/User 1.webp';
			const avatarShape = (window.SettingsApp && window.SettingsApp.get('userAvatarShape')) || 'square';
			const shapeClass = avatarShape === 'circle' ? 'xp-start-avatar-circle' : (avatarShape === 'round' ? 'xp-start-avatar-round' : 'xp-start-avatar-square');
			const pinnedKeys = (window.SettingsApp && window.SettingsApp.get('startMenuPinnedApps')) || ['achievements', 'ie', 'outlook'];
			const rightItemsConfig = (window.SettingsApp && window.SettingsApp.get('startMenuRightItems')) || [];

			let pinnedHTML = '';
			pinnedKeys.forEach(key => {
				const app = window.DeskAppRegistry ? window.DeskAppRegistry.get(key) : null;
				if (app) {
					pinnedHTML += `
						<div class="xp-start-item xp-start-pinned" data-action="open-${app.id}">
							<img src="${app.icon}" class="xp-start-item-icon" alt="${app.name}">
							<div class="xp-start-item-texts">
								<strong class="xp-start-title">${app.name}</strong>
								<span class="xp-start-subtitle">${app.subtitle || ''}</span>
							</div>
							${app.id === 'outlook' ? '<span id="start-menu-mail-badge" class="xp-start-badge hidden">0</span>' : ''}
						</div>
					`;
				}
			});

			let rightColHTML = '';
			rightItemsConfig.forEach(item => {
				if (item.divider) {
					rightColHTML += '<div class="xp-start-divider right-divider"></div>';
					return;
				}
				const flyoutAttr = item.flyout ? `class="xp-start-item xp-start-right-item has-flyout" id="start-${item.id}-trigger"` : 'class="xp-start-item xp-start-right-item"';
				const arrowHTML = item.flyout ? '<span class="xp-start-flyout-arrow">►</span>' : '';
				const nameHTML = item.bold ? `<strong>${item.name}</strong>` : item.name;
				rightColHTML += `
					<div ${flyoutAttr} data-action="${item.action || ''}">
						<img src="${item.icon}" class="xp-start-item-icon" alt="${item.name}">
						<span class="xp-start-title">${nameHTML}</span>
						${arrowHTML}
					</div>
				`;
			});

			startMenuEl.innerHTML = `
				<div class="xp-start-header" id="start-menu-profile-header" title="Click to change user account picture and settings">
					<div class="xp-start-user-frame ${shapeClass}">
						<img src="${userAvatar}" alt="${userName}" class="xp-start-avatar" id="start-menu-avatar-img">
					</div>
					<span class="xp-start-username" id="start-menu-username-text">${userName}</span>
				</div>

				<div class="xp-start-body">
					<div class="xp-start-left-column">
						<div class="xp-start-pinned-section">
							${pinnedHTML}
						</div>

						<div class="xp-start-divider"></div>

						<div class="xp-start-frequent-section"></div>

						<div class="xp-start-divider"></div>

						<div class="xp-start-all-programs" id="xp-start-all-programs-btn">
							<span>All Programs</span>
							<span class="xp-start-all-programs-arrow">►</span>
						</div>
					</div>

					<div class="xp-start-right-column">
						${rightColHTML}
					</div>
				</div>

				<div class="xp-start-footer">
					<button type="button" class="xp-start-footer-btn" data-action="log-off" title="Log off session">
						<img src="https://api.iconify.design/mdi/logout.svg" alt="Log Off">
						<span>Log Off</span>
					</button>
					<button type="button" class="xp-start-footer-btn" data-action="turn-off" title="Shut down computer">
						<img src="https://api.iconify.design/mdi/power.svg" alt="Turn Off">
						<span>Turn Off Computer</span>
					</button>
				</div>
			`;

			allProgramsBtnEl = document.getElementById('xp-start-all-programs-btn');
		},

		bindEvents() {
			const toggleHandler = (e) => {
				e.stopPropagation();
				this.toggle();
			};

			if (startButtonEl) startButtonEl.addEventListener('click', toggleHandler);
			if (taskbarStartButtonEl) taskbarStartButtonEl.addEventListener('click', toggleHandler);

			document.addEventListener('mousedown', (e) => {
				if (!this.isOpen) return;
				const isInsideMenu = startMenuEl.contains(e.target);
				const isInsideStartBtn = (startButtonEl && startButtonEl.contains(e.target)) || (taskbarStartButtonEl && taskbarStartButtonEl.contains(e.target));
				const isInsideFlyout = e.target.closest('.xp-start-flyout-menu');

				if (!isInsideMenu && !isInsideStartBtn && !isInsideFlyout) {
					this.close();
				}
			});

			document.addEventListener('keydown', (e) => {
				if (e.key === 'Escape' && this.isOpen) {
					this.close();
				}
			});

			const headerEl = document.getElementById('start-menu-profile-header');
			if (headerEl) {
				headerEl.addEventListener('click', (e) => {
					e.stopPropagation();
					this.close();
					if (window.SettingsApp) {
						window.SettingsApp.open('system');
					}
				});
			}

			startMenuEl.addEventListener('click', (e) => {
				const item = e.target.closest('[data-action]');
				if (item && !item.classList.contains('disabled')) {
					const action = item.dataset.action;
					this.handleAction(action);
				}
			});

			startMenuEl.addEventListener('contextmenu', (e) => {
				const item = e.target.closest('.xp-start-item');
				if (!item) return;
				e.preventDefault();
				e.stopPropagation();
				const title = item.querySelector('.xp-start-title')?.textContent || 'Program';
				const action = item.dataset.action;
				if (window.ContextMenu) {
					const items = [
						{
							label: `Open ${title}`,
							bold: true,
							action: () => {
								if (action) this.handleAction(action);
							}
						},
						{
							label: 'Pin to Start menu',
							disabled: item.classList.contains('xp-start-pinned'),
							action: () => {}
						},
						{ separator: true },
						{
							label: 'Create Shortcut on Desktop',
							action: () => {
								if (typeof fs !== 'undefined' && fs.create) {
									fs.create('Shortcut', '/', `${title} - Shortcut`, {
										targetPath: '/',
										icon: item.querySelector('img')?.src || '../assets/images/desk/icons/File.webp'
									});
									if (typeof refreshUI === 'function') refreshUI();
								}
							}
						},
						{ separator: true },
						{
							label: 'Properties',
							action: () => {
								if (window.SettingsApp) window.SettingsApp.open('system');
							}
						}
					];
					window.ContextMenu.show(items, e.clientX, e.clientY);
				}
			});

			this.setupAllProgramsFlyout();
			this.setupRecentDocumentsFlyout();
			this.setupControlPanelFlyout();
			this.setupSearchFlyout();
		},

		setupAllProgramsFlyout() {
			if (!allProgramsBtnEl) return;
			let flyout = null;

			const closeAllPrograms = () => {
				if (flyout) {
					this.closeFlyout(flyout);
					flyout = null;
				}
				allProgramsBtnEl.classList.remove('active');
			};

			const toggleAllProgramsFlyout = () => {
				if (flyout) {
					closeAllPrograms();
					return;
				}

				this.closeOtherFlyouts('all-programs');
				allProgramsBtnEl.classList.add('active');

				flyout = document.createElement('div');
				flyout.className = 'xp-start-flyout-menu xp-start-flyout-all-programs';
				flyout.dataset.flyoutId = 'all-programs';

				const categories = this.getProjectCategories();
				let categoriesHtml = '';

				categories.forEach(cat => {
					categoriesHtml += `
						<div class="xp-start-flyout-item has-sub" data-category="${cat.name}">
							<img src="${cat.icon}" class="xp-start-item-icon" alt="">
							<span class="xp-start-title">${cat.label}</span>
							<span class="xp-start-flyout-arrow">►</span>
						</div>
					`;
				});

				const appCategories = window.DeskAppRegistry ? window.DeskAppRegistry.getCategories() : ['Accessories', 'Games', 'Entertainment', 'System Tools'];
				let appCategorySubmenusHtml = '';

				appCategories.forEach(catName => {
					if (catName === 'Portfolio Projects' || catName === 'Internet') return;
					const subKey = catName.toLowerCase().replace(/[^\w-]/g, '-');
					appCategorySubmenusHtml += `
						<div class="xp-start-flyout-item has-sub" data-sub="${subKey}" data-cat-name="${catName}">
							<img src="../assets/images/desk/icons/Folder Closed.webp" class="xp-start-item-icon" alt="">
							<span class="xp-start-title">${catName}</span>
							<span class="xp-start-flyout-arrow">►</span>
						</div>
					`;
				});

				flyout.innerHTML = `
					<div class="xp-start-search-box">
						<img src="https://api.iconify.design/mdi/magnify.svg?color=%23555555" style="width: 14px; height: 14px;" alt="">
						<input type="text" class="xp-start-search-input" id="xp-start-all-search" placeholder="Filter applications...">
					</div>
					<div id="xp-start-all-programs-list">
						<div class="xp-start-flyout-item" data-action="my-projects">
							<img src="../assets/images/desk/icons/Folder Open.webp" class="xp-start-item-icon" alt="">
							<span class="xp-start-title"><strong>All Project Shortcuts</strong></span>
						</div>
						<div class="xp-start-divider"></div>
						${appCategorySubmenusHtml}
						<div class="xp-start-divider"></div>
						<div class="xp-start-flyout-category-header">Portfolio Projects</div>
						${categoriesHtml}
						<div class="xp-start-divider"></div>
						<div class="xp-start-flyout-item" data-action="open-ie">
							<img src="../assets/images/desk/icons/Internet Explorer.webp" class="xp-start-item-icon" alt="">
							<span class="xp-start-title">Internet Explorer</span>
						</div>
						<div class="xp-start-flyout-item" data-action="open-outlook">
							<img src="../assets/images/desk/icons/Mail.webp" class="xp-start-item-icon" alt="">
							<span class="xp-start-title">Outlook Express</span>
						</div>
						<div class="xp-start-flyout-item" data-action="open-winamp">
							<img src="../assets/images/desk/icons/Winamp.webp" class="xp-start-item-icon" alt="">
							<span class="xp-start-title">Winamp</span>
						</div>
					</div>
				`;

				document.body.appendChild(flyout);
				this.positionFlyout(allProgramsBtnEl, flyout);
				activeFlyouts.push(flyout);

				const searchInput = flyout.querySelector('#xp-start-all-search');
				if (searchInput) {
					searchInput.focus();
					searchInput.addEventListener('input', () => {
						const term = searchInput.value.toLowerCase().trim();
						const items = flyout.querySelectorAll('.xp-start-flyout-item');
						items.forEach(item => {
							const title = (item.querySelector('.xp-start-title')?.textContent || '').toLowerCase();
							item.style.display = (!term || title.includes(term)) ? 'flex' : 'none';
						});
					});
				}

				flyout.addEventListener('click', (e) => {
					const actItem = e.target.closest('[data-action]');
					if (actItem) {
						this.handleAction(actItem.dataset.action);
						return;
					}
					const catItem = e.target.closest('[data-category]');
					if (catItem) {
						const catName = catItem.dataset.category;
						if (typeof openFilteredProjectsFolder === 'function') {
							openFilteredProjectsFolder(catName);
							this.close();
						}
					}
				});

				flyout.querySelectorAll('.xp-start-flyout-item.has-sub').forEach(subTrigger => {
					let nestedFlyout = null;

					subTrigger.addEventListener('mouseenter', () => {
						this.closeNestedFlyouts(flyout);
						nestedFlyout = document.createElement('div');
						nestedFlyout.className = 'xp-start-flyout-menu xp-start-flyout-nested';
						nestedFlyout.dataset.parentFlyout = 'all-programs';

						const catName = subTrigger.dataset.catName;
						const catKey = subTrigger.dataset.category;

						if (catName && window.DeskAppRegistry) {
							const categoryApps = window.DeskAppRegistry.getByCategory(catName);
							let appsHtml = '';
							categoryApps.forEach(app => {
								appsHtml += `
									<div class="xp-start-flyout-item" data-action="open-${app.id}">
										<img src="${app.icon}" class="xp-start-item-icon" alt="">
										<span class="xp-start-title">${app.name}</span>
									</div>
								`;
							});
							nestedFlyout.innerHTML = appsHtml;
						} else if (catKey) {
							const categoryProjects = this.getProjectsByCategory(catKey);
							let prjHtml = `
								<div class="xp-start-flyout-item" data-category-open="${catKey}">
									<img src="../assets/images/desk/icons/Folder Open.webp" class="xp-start-item-icon" alt="">
									<span class="xp-start-title"><strong>Open Folder (${catKey})</strong></span>
								</div>
								<div class="xp-start-divider"></div>
							`;
							categoryProjects.forEach(p => {
								const pTitle = this.resolveProjectTitle(p.title);
								prjHtml += `
									<div class="xp-start-flyout-item xp-start-project-item" data-type="project" data-project-id="${pTitle}">
										<img src="${p.icon || '../assets/images/desk/icons/File.webp'}" class="xp-start-item-icon xp-start-project-icon" alt="">
										<span class="xp-start-title">${pTitle}</span>
									</div>
								`;
							});
							nestedFlyout.innerHTML = prjHtml;
						}

						document.body.appendChild(nestedFlyout);
						this.positionFlyout(subTrigger, nestedFlyout);
						activeFlyouts.push(nestedFlyout);

						nestedFlyout.addEventListener('click', (ev) => {
							const prjEl = ev.target.closest('[data-project-id]');
							if (prjEl) {
								const prjName = prjEl.dataset.projectId;
								const prj = (typeof projects !== 'undefined') ? projects.flat().find(p => this.resolveProjectTitle(p.title) === prjName) : null;
								if (prj && typeof openProjectWindow === 'function') {
									openProjectWindow(prj);
									this.close();
								}
								return;
							}
							const catOpen = ev.target.closest('[data-category-open]');
							if (catOpen && typeof openFilteredProjectsFolder === 'function') {
								openFilteredProjectsFolder(catOpen.dataset.categoryOpen);
								this.close();
								return;
							}
							const act = ev.target.closest('[data-action]');
							if (act) {
								this.handleAction(act.dataset.action);
							}
						});
					});
				});
			};

			allProgramsBtnEl.addEventListener('click', (e) => {
				e.stopPropagation();
				toggleAllProgramsFlyout();
			});
		},

		setupRecentDocumentsFlyout() {
			const trigger = document.getElementById('start-recent-docs-trigger');
			if (!trigger) return;
			let flyout = null;

			trigger.addEventListener('mouseenter', () => {
				if (flyout) return;
				this.closeOtherFlyouts('recent-docs');

				flyout = document.createElement('div');
				flyout.className = 'xp-start-flyout-menu';
				flyout.dataset.flyoutId = 'recent-docs';

				const recentDocs = (window.DeskAPI && window.DeskAPI.getRecentDocs) ? window.DeskAPI.getRecentDocs() : [];
				let html = '';

				if (!recentDocs || recentDocs.length === 0) {
					html = '<div class="xp-start-flyout-item disabled"><span class="xp-start-title">(Empty)</span></div>';
				} else {
					recentDocs.forEach(doc => {
						html += `
							<div class="xp-start-flyout-item" data-recent-name="${doc.name}" data-recent-type="${doc.type}" data-recent-path="${doc.path || ''}">
								<img src="${doc.icon || '../assets/images/desk/icons/File.webp'}" class="xp-start-item-icon" alt="">
								<span class="xp-start-title">${doc.name}</span>
							</div>
						`;
					});
					html += '<div class="xp-start-clear-recents" id="start-clear-recent-btn">Clear Recent Documents</div>';
				}

				flyout.innerHTML = html;
				document.body.appendChild(flyout);
				this.positionFlyout(trigger, flyout);
				activeFlyouts.push(flyout);

				flyout.addEventListener('click', (e) => {
					const clearBtn = e.target.closest('#start-clear-recent-btn');
					if (clearBtn) {
						if (window.DeskAPI && window.DeskAPI.clearRecentDocs) window.DeskAPI.clearRecentDocs();
						this.closeFlyout(flyout);
						flyout = null;
						return;
					}
					const row = e.target.closest('[data-recent-name]');
					if (row) {
						const name = row.dataset.recentName;
						const type = row.dataset.recentType;
						const path = row.dataset.recentPath;
						this.close();

						if (type === 'project') {
							const prj = (typeof projects !== 'undefined') ? projects.flat().find(p => this.resolveProjectTitle(p.title) === name) : null;
							if (prj && typeof openProjectWindow === 'function') openProjectWindow(prj);
						} else if (path && typeof fs !== 'undefined') {
							const el = fs.findByPath(path);
							if (el && typeof openFileSystemElement === 'function') openFileSystemElement(el);
						}
					}
				});
			});

			trigger.addEventListener('mouseleave', () => {
				flyoutCloseTimeout = setTimeout(() => {
					if (flyout && !flyout.matches(':hover') && !trigger.matches(':hover')) {
						this.closeFlyout(flyout);
						flyout = null;
					}
				}, 220);
			});
		},

		setupControlPanelFlyout() {
			const trigger = document.getElementById('start-control-panel-trigger');
			if (!trigger) return;
			let flyout = null;

			trigger.addEventListener('mouseenter', () => {
				if (flyout) return;
				this.closeOtherFlyouts('control-panel-flyout');

				flyout = document.createElement('div');
				flyout.className = 'xp-start-flyout-menu';
				flyout.dataset.flyoutId = 'control-panel-flyout';

				flyout.innerHTML = `
					<div class="xp-start-flyout-item" data-tab-action="system">
						<img src="../assets/images/desk/icons/User Accounts.webp" class="xp-start-item-icon" alt="">
						<span class="xp-start-title">User Accounts & Identity</span>
					</div>
					<div class="xp-start-flyout-item" data-tab-action="desktop">
						<img src="../assets/images/desk/icons/Monitor.webp" class="xp-start-item-icon" alt="">
						<span class="xp-start-title">Desktop & Wallpapers</span>
					</div>
					<div class="xp-start-flyout-item" data-tab-action="appearance">
						<img src="../assets/images/desk/icons/Display.webp" class="xp-start-item-icon" alt="">
						<span class="xp-start-title">Themes & Appearance</span>
					</div>
					<div class="xp-start-flyout-item" data-tab-action="effects">
						<img src="../assets/images/desk/icons/Display.webp" class="xp-start-item-icon" alt="">
						<span class="xp-start-title">CRT & Visual Effects</span>
					</div>
					<div class="xp-start-flyout-item" data-tab-action="taskbar">
						<img src="../assets/images/desk/icons/User Personalization.webp" class="xp-start-item-icon" alt="">
						<span class="xp-start-title">Taskbar & Start Menu</span>
					</div>
					<div class="xp-start-flyout-item" data-tab-action="audio">
						<img src="../assets/images/desk/icons/Sounds, Speech, and Audio Devices.webp" class="xp-start-item-icon" alt="">
						<span class="xp-start-title">Sounds & Audio Events</span>
					</div>
					<div class="xp-start-flyout-item" data-tab-action="input">
						<img src="../assets/images/desk/icons/System Properties.webp" class="xp-start-item-icon" alt="">
						<span class="xp-start-title">Mouse & Folder Options</span>
					</div>
				`;

				document.body.appendChild(flyout);
				this.positionFlyout(trigger, flyout);
				activeFlyouts.push(flyout);

				flyout.addEventListener('click', (e) => {
					const tabItem = e.target.closest('[data-tab-action]');
					if (tabItem) {
						const tab = tabItem.dataset.tabAction;
						this.close();
						if (window.SettingsApp) window.SettingsApp.open(tab);
					}
				});
			});

			trigger.addEventListener('mouseleave', () => {
				flyoutCloseTimeout = setTimeout(() => {
					if (flyout && !flyout.matches(':hover') && !trigger.matches(':hover')) {
						this.closeFlyout(flyout);
						flyout = null;
					}
				}, 220);
			});
		},

		setupSearchFlyout() {
			const trigger = document.getElementById('start-search-trigger');
			if (!trigger) return;
			let flyout = null;

			trigger.addEventListener('mouseenter', () => {
				if (flyout) return;
				this.closeOtherFlyouts('search-flyout');

				flyout = document.createElement('div');
				flyout.className = 'xp-start-flyout-menu';
				flyout.dataset.flyoutId = 'search-flyout';

				flyout.innerHTML = `
					<div class="xp-start-flyout-item" data-search-target="files">
						<img src="../assets/images/desk/icons/Folder Search.webp" class="xp-start-item-icon" alt="">
						<span class="xp-start-title">For Files or Folders...</span>
					</div>
					<div class="xp-start-flyout-item" data-search-target="projects">
						<img src="../assets/images/desk/icons/Search.webp" class="xp-start-item-icon" alt="">
						<span class="xp-start-title">For Portfolio Projects...</span>
					</div>
					<div class="xp-start-flyout-item" data-search-target="web">
						<img src="../assets/images/desk/icons/Internet Explorer.webp" class="xp-start-item-icon" alt="">
						<span class="xp-start-title">On the Internet (Web Search)...</span>
					</div>
				`;

				document.body.appendChild(flyout);
				this.positionFlyout(trigger, flyout);
				activeFlyouts.push(flyout);

				flyout.addEventListener('click', (e) => {
					const item = e.target.closest('[data-search-target]');
					if (item) {
						const target = item.dataset.searchTarget;
						this.close();
						if (target === 'web' && typeof openInternetExplorer === 'function') {
							openInternetExplorer();
						} else if (window.DeskAPI && window.DeskAPI.openSearch) {
							window.DeskAPI.openSearch('');
						}
					}
				});
			});

			trigger.addEventListener('mouseleave', () => {
				flyoutCloseTimeout = setTimeout(() => {
					if (flyout && !flyout.matches(':hover') && !trigger.matches(':hover')) {
						this.closeFlyout(flyout);
						flyout = null;
					}
				}, 220);
			});
		},

		positionFlyout(anchorEl, flyoutEl) {
			const anchorRect = anchorEl.getBoundingClientRect();
			const flyoutRect = flyoutEl.getBoundingClientRect();

			let x = anchorRect.right + 2;
			let y = anchorRect.top - 4;

			if (x + flyoutRect.width > window.innerWidth) {
				x = anchorRect.left - flyoutRect.width - 2;
			}

			if (y + flyoutRect.height > window.innerHeight - 40) {
				y = Math.max(10, window.innerHeight - 40 - flyoutRect.height);
			}

			flyoutEl.style.left = `${Math.max(4, x)}px`;
			flyoutEl.style.top = `${Math.max(4, y)}px`;
			flyoutEl.style.zIndex = '100005';
		},

		closeFlyout(flyout) {
			if (!flyout) return;
			flyout.remove();
			activeFlyouts = activeFlyouts.filter(f => f !== flyout);
		},

		closeNestedFlyouts(parentFlyout) {
			activeFlyouts.filter(f => f.classList.contains('xp-start-flyout-nested')).forEach(f => f.remove());
			activeFlyouts = activeFlyouts.filter(f => !f.classList.contains('xp-start-flyout-nested'));
		},

		closeOtherFlyouts(keepId) {
			activeFlyouts.filter(f => f.dataset.flyoutId !== keepId).forEach(f => f.remove());
			activeFlyouts = activeFlyouts.filter(f => f.dataset.flyoutId === keepId);
		},

		closeAllFlyouts() {
			activeFlyouts.forEach(f => f.remove());
			activeFlyouts = [];
		},

		getProjectCategories() {
			if (typeof projects === 'undefined') return [];
			const categoriesMap = new Map();
			projects.flat().forEach(p => {
				if (p && p.show !== false && p.keywords && Array.isArray(p.keywords)) {
					p.keywords.forEach(kw => {
						if (!categoriesMap.has(kw)) {
							categoriesMap.set(kw, {
								name: kw,
								label: kw.charAt(0).toUpperCase() + kw.slice(1),
								icon: p.icon || '../assets/images/desk/icons/Folder Closed.webp'
							});
						}
					});
				}
			});
			return Array.from(categoriesMap.values()).sort((a, b) => a.label.localeCompare(b.label));
		},

		getProjectsByCategory(category) {
			if (typeof projects === 'undefined') return [];
			return projects.flat().filter(p => p && p.show !== false && p.keywords && p.keywords.includes(category));
		},

		resolveProjectTitle(title) {
			if (typeof title === 'string') return title;
			if (title && typeof title === 'object') {
				return title.en || title.fr || Object.values(title)[0] || '';
			}
			return '';
		},

		handleAction(action) {
			this.close();

			if (window.SettingsApp && window.SettingsApp.playSound) {
				window.SettingsApp.playSound('click');
			}

			const normalizedAppId = action.replace(/^(open-|link-)/, '');

			if (window.DeskAppRegistry && (window.DeskAppRegistry.get(normalizedAppId) || window.DeskAppRegistry.get(action))) {
				window.DeskAppRegistry.launch(window.DeskAppRegistry.get(normalizedAppId) ? normalizedAppId : action);
				return;
			}

			if (action === 'turn-off') {
				if (window.AchievementsManager) window.AchievementsManager.progress('turn_off_action', 1);
				if (typeof openShutdownDialog === 'function') openShutdownDialog();
				return;
			}

			if (action === 'log-off') {
				if (typeof showXPDialog === 'function') {
					showXPDialog('Log Off Windows', 'Are you sure you want to log off?', 'question', {
						buttons: ['Log Off', 'Cancel'],
						callback: (res) => {
							if (res === 'Log Off') {
								const welcome = document.getElementById('welcome-screen');
								if (welcome) {
									welcome.classList.remove('hidden');
									welcome.style.opacity = '1';
									welcome.style.display = 'flex';
								}
							}
						}
					});
				}
				return;
			}

			if (action === 'help') {
				window.open('https://github.com/wartets/Wartets.github.io', '_blank');
				return;
			}

			if (action === 'control-panel') {
				if (window.DeskAppRegistry) window.DeskAppRegistry.launch('settings', 'system');
				return;
			}

			if (action === 'my-documents') {
				if (window.DeskAppRegistry) window.DeskAppRegistry.launch('documents');
				return;
			}

			if (action === 'my-pictures') {
				if (window.DeskAppRegistry) window.DeskAppRegistry.launch('pictures');
				return;
			}

			if (action === 'my-music') {
				if (window.DeskAppRegistry) window.DeskAppRegistry.launch('music');
				return;
			}

			if (action === 'my-computer') {
				if (window.DeskAppRegistry) window.DeskAppRegistry.launch('mycomputer');
				return;
			}

			if (action === 'my-network-places') {
				if (window.DeskAppRegistry) window.DeskAppRegistry.launch('network');
				return;
			}

			if (action === 'printers-faxes') {
				if (window.DeskAppRegistry) window.DeskAppRegistry.launch('printers');
				return;
			}
		},

		updateProfile() {
			const userName = (window.SettingsApp && window.SettingsApp.get('userName')) || 'Colin B.R.';
			const userAvatar = (window.SettingsApp && window.SettingsApp.get('userAvatar')) || '../assets/images/desk/icons/User 1.webp';

			const usernameEl = document.getElementById('start-menu-username-text');
			const avatarEl = document.getElementById('start-menu-avatar-img');

			if (usernameEl) usernameEl.textContent = userName;
			if (avatarEl) avatarEl.src = userAvatar;
		},

		renderFrequentApps() {
			if (!startMenuEl) return;
			const container = startMenuEl.querySelector('.xp-start-frequent-section');
			if (!container) return;

			let apps = [];
			if (window.DeskAppRegistry) {
				apps = window.DeskAppRegistry.getFrequentApps(8);
			}

			if (apps.length === 0 && window.DeskAppRegistry) {
				const defaults = ['winamp', 'calculator', 'paint', 'minesweeper', 'notepad', 'cmd', 'display', 'todayanecdote'];
				apps = defaults.map(id => window.DeskAppRegistry.get(id)).filter(Boolean);
			}

			container.innerHTML = '';
			apps.forEach(app => {
				const item = document.createElement('div');
				item.className = 'xp-start-item';
				item.dataset.action = `open-${app.id}`;
				item.innerHTML = `
					<img src="${app.icon}" class="xp-start-item-icon" alt="${app.name}">
					<div class="xp-start-item-texts">
						<span class="xp-start-title">${app.name}</span>
					</div>
				`;
				container.appendChild(item);
			});
		},

		updateLiveBadges() {
			if (!window.DeskAPI) return;
			const unread = window.DeskAPI.getUnreadMailCount();
			const badge = document.getElementById('start-menu-mail-badge');
			if (badge) {
				if (unread > 0) {
					badge.textContent = unread > 5 ? '5+' : String(unread);
					badge.classList.remove('hidden');
				} else {
					badge.classList.add('hidden');
				}
			}
		},

		open() {
			if (!startMenuEl) return;
			if (window.AchievementsManager) {
				window.AchievementsManager.progress('start_menu_open', 1);
			}
			startMenuEl.style.zIndex = '100005';
			startMenuEl.classList.remove('hidden');
			if (startButtonEl) startButtonEl.classList.add('active');
			if (taskbarStartButtonEl) taskbarStartButtonEl.classList.add('active');
			this.isOpen = true;
			this.updateLiveBadges();
			this.updateProfile();

			if (window.SettingsApp && window.SettingsApp.playSound) {
				window.SettingsApp.playSound('click');
			}
			if (window.Taskbar && typeof window.Taskbar.hideWindowPreview === 'function') {
				window.Taskbar.hideWindowPreview();
			}
		},

		close() {
			if (!startMenuEl) return;
			startMenuEl.classList.add('hidden');
			if (startButtonEl) startButtonEl.classList.remove('active');
			if (taskbarStartButtonEl) taskbarStartButtonEl.classList.remove('active');
			this.closeAllFlyouts();
			this.isOpen = false;
		},

		toggle() {
			if (this.isOpen) {
				this.close();
			} else {
				this.open();
			}
		}
	};

	window.StartMenu = StartMenu;
})();
