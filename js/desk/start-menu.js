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
		},

		render() {
			const userName = (window.SettingsApp && window.SettingsApp.get('userName')) || 'Colin B.R.';
			const userAvatar = (window.SettingsApp && window.SettingsApp.get('userAvatar')) || '../assets/images/desk/icons/User 1.webp';
			const avatarShape = (window.SettingsApp && window.SettingsApp.get('userAvatarShape')) || 'square';
			const shapeClass = avatarShape === 'circle' ? 'xp-start-avatar-circle' : (avatarShape === 'round' ? 'xp-start-avatar-round' : 'xp-start-avatar-square');

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
							<div class="xp-start-item xp-start-pinned" data-action="open-achievements">
								<img src="../assets/images/desk/icons/Trophy.webp" class="xp-start-item-icon" alt="Achievements">
								<div class="xp-start-item-texts">
									<strong class="xp-start-title">Milestones & Trophies</strong>
									<span class="xp-start-subtitle">Desktop Quests</span>
								</div>
							</div>
							<div class="xp-start-item xp-start-pinned" data-action="open-ie">
								<img src="../assets/images/desk/internet-explorer.png" class="xp-start-item-icon" alt="Internet">
								<div class="xp-start-item-texts">
									<strong class="xp-start-title">Internet</strong>
									<span class="xp-start-subtitle">Internet Explorer</span>
								</div>
							</div>
							<div class="xp-start-item xp-start-pinned" data-action="open-outlook">
								<img src="../assets/images/desk/OE2001.webp" class="xp-start-item-icon" alt="E-mail">
								<div class="xp-start-item-texts">
									<strong class="xp-start-title">E-mail</strong>
									<span class="xp-start-subtitle">Outlook Express</span>
								</div>
								<span id="start-menu-mail-badge" class="xp-start-badge hidden">0</span>
							</div>
						</div>

						<div class="xp-start-divider"></div>

						<div class="xp-start-frequent-section">
							<div class="xp-start-item" data-action="open-winamp">
								<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Winamp-logo.svg/960px-Winamp-logo.svg.png" class="xp-start-item-icon" alt="Winamp">
								<div class="xp-start-item-texts">
									<span class="xp-start-title">Winamp Media Player</span>
								</div>
							</div>
							<div class="xp-start-item" data-action="open-calculator">
								<img src="../assets/images/desk/icons/Calculator.webp" class="xp-start-item-icon" alt="Calculator">
								<div class="xp-start-item-texts">
									<span class="xp-start-title">Calculator</span>
								</div>
							</div>
							<div class="xp-start-item" data-action="open-paint">
								<img src="../assets/images/desk/icons/Paint.webp" class="xp-start-item-icon" alt="Paint">
								<div class="xp-start-item-texts">
									<span class="xp-start-title">Paint</span>
								</div>
							</div>
							<div class="xp-start-item" data-action="open-minesweeper">
								<img src="../assets/images/desk/icons/Minesweeper.webp" class="xp-start-item-icon" alt="Minesweeper">
								<div class="xp-start-item-texts">
									<span class="xp-start-title">Minesweeper</span>
								</div>
							</div>
							<div class="xp-start-item" data-action="new-text-document">
								<img src="../assets/images/desk/icons/Notepad.webp" class="xp-start-item-icon" alt="Notepad">
								<div class="xp-start-item-texts">
									<span class="xp-start-title">Notepad</span>
								</div>
							</div>
							<div class="xp-start-item" data-action="open-cmd">
								<img src="../assets/images/desk/icons/Command Prompt.webp" class="xp-start-item-icon" alt="Command Prompt">
								<div class="xp-start-item-texts">
									<span class="xp-start-title">Command Prompt</span>
								</div>
							</div>
							<div class="xp-start-item" data-action="control-panel-appearance">
								<img src="../assets/images/desk/icons/Display.webp" class="xp-start-item-icon" alt="Appearance">
								<div class="xp-start-item-texts">
									<span class="xp-start-title">Wallpaper & Themes</span>
								</div>
							</div>
							<div class="xp-start-item" data-action="open-today-anecdote">
								<img src="https://api.iconify.design/mdi/calendar-star.svg" class="xp-start-item-icon" alt="Daily Anecdote">
								<div class="xp-start-item-texts">
									<span class="xp-start-title">Today's Anecdote</span>
								</div>
							</div>
						</div>

						<div class="xp-start-divider"></div>

						<div class="xp-start-all-programs" id="xp-start-all-programs-btn">
							<span>All Programs</span>
							<span class="xp-start-all-programs-arrow">►</span>
						</div>
					</div>

					<div class="xp-start-right-column">
						<div class="xp-start-item xp-start-right-item" data-action="my-documents">
							<img src="../assets/images/desk/icons/My Profile Folder.webp" class="xp-start-item-icon" alt="My Documents">
							<span class="xp-start-title"><strong>My Documents</strong></span>
						</div>
						<div class="xp-start-item xp-start-right-item" data-action="my-pictures">
							<img src="../assets/images/desk/icons/Camera.webp" class="xp-start-item-icon" alt="My Pictures">
							<span class="xp-start-title"><strong>My Pictures</strong></span>
						</div>
						<div class="xp-start-item xp-start-right-item" data-action="my-music">
							<img src="../assets/images/desk/icons/Music File.webp" class="xp-start-item-icon" alt="My Music">
							<span class="xp-start-title"><strong>My Music</strong></span>
						</div>
						<div class="xp-start-item xp-start-right-item" data-action="my-computer">
							<img src="../assets/images/desk/icons/My Computer.webp" class="xp-start-item-icon" alt="My Computer">
							<span class="xp-start-title"><strong>My Computer</strong></span>
						</div>
						<div class="xp-start-item xp-start-right-item" data-action="my-network-places">
							<img src="../assets/images/desk/icons/My Network Places.webp" class="xp-start-item-icon" alt="My Network Places">
							<span class="xp-start-title">My Network Places</span>
						</div>

						<div class="xp-start-divider right-divider"></div>

						<div class="xp-start-item xp-start-right-item has-flyout" id="start-control-panel-trigger" data-action="control-panel">
							<img src="../assets/images/desk/icons/System Properties.webp" class="xp-start-item-icon" alt="Control Panel">
							<span class="xp-start-title">Control Panel</span>
							<span class="xp-start-flyout-arrow">►</span>
						</div>
						<div class="xp-start-item xp-start-right-item" data-action="printers-faxes">
							<img src="../assets/images/desk/icons/Fax.webp" class="xp-start-item-icon" alt="Printers">
							<span class="xp-start-title">Printers and Faxes</span>
						</div>
						<div class="xp-start-item xp-start-right-item has-flyout" id="start-recent-docs-trigger">
							<img src="../assets/images/desk/icons/List File.webp" class="xp-start-item-icon" alt="Recent Documents">
							<span class="xp-start-title">My Recent Documents</span>
							<span class="xp-start-flyout-arrow">►</span>
						</div>

						<div class="xp-start-divider right-divider"></div>

						<div class="xp-start-item xp-start-right-item" data-action="help">
							<img src="../assets/images/desk/icons/User Support.webp" class="xp-start-item-icon" alt="Help">
							<span class="xp-start-title">Help and Support</span>
						</div>
						<div class="xp-start-item xp-start-right-item has-flyout" id="start-search-trigger" data-action="search">
							<img src="https://api.iconify.design/mdi/magnify.svg" class="xp-start-item-icon" alt="Search">
							<span class="xp-start-title">Search</span>
							<span class="xp-start-flyout-arrow">►</span>
						</div>
						<div class="xp-start-item xp-start-right-item" data-action="run">
							<img src="https://api.iconify.design/mdi/console-line.svg" class="xp-start-item-icon" alt="Run">
							<span class="xp-start-title">Run...</span>
						</div>
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
										icon: item.querySelector('img')?.src || 'https://img.icons8.com/fluency/48/file.png'
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
						<div class="xp-start-flyout-item has-sub" data-sub="accessories">
							<img src="../assets/images/desk/icons/Folder Closed.webp" class="xp-start-item-icon" alt="">
							<span class="xp-start-title">Accessories</span>
							<span class="xp-start-flyout-arrow">►</span>
						</div>
						<div class="xp-start-flyout-item has-sub" data-sub="games">
							<img src="../assets/images/desk/icons/Game Controller.webp" class="xp-start-item-icon" alt="">
							<span class="xp-start-title">Games</span>
							<span class="xp-start-flyout-arrow">►</span>
						</div>
						<div class="xp-start-flyout-item has-sub" data-sub="media">
							<img src="../assets/images/desk/icons/Music File.webp" class="xp-start-item-icon" alt="">
							<span class="xp-start-title">Entertainment</span>
							<span class="xp-start-flyout-arrow">►</span>
						</div>
						<div class="xp-start-flyout-item has-sub" data-sub="system-tools">
							<img src="../assets/images/desk/icons/System Properties.webp" class="xp-start-item-icon" alt="">
							<span class="xp-start-title">System Tools</span>
							<span class="xp-start-flyout-arrow">►</span>
						</div>
						<div class="xp-start-divider"></div>
						<div class="xp-start-flyout-category-header">Portfolio Projects</div>
						${categoriesHtml}
						<div class="xp-start-divider"></div>
						<div class="xp-start-flyout-item" data-action="open-ie">
							<img src="../assets/images/desk/internet-explorer.png" class="xp-start-item-icon" alt="">
							<span class="xp-start-title">Internet Explorer</span>
						</div>
						<div class="xp-start-flyout-item" data-action="open-outlook">
							<img src="../assets/images/desk/OE2001.webp" class="xp-start-item-icon" alt="">
							<span class="xp-start-title">Outlook Express</span>
						</div>
						<div class="xp-start-flyout-item" data-action="open-winamp">
							<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Winamp-logo.svg/960px-Winamp-logo.svg.png" class="xp-start-item-icon" alt="">
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

						const subKey = subTrigger.dataset.sub;
						const catKey = subTrigger.dataset.category;

						if (subKey === 'accessories') {
							nestedFlyout.innerHTML = `
								<div class="xp-start-flyout-item" data-action="open-calculator">
									<img src="../assets/images/desk/icons/Calculator.webp" class="xp-start-item-icon" alt="">
									<span class="xp-start-title">Calculator</span>
								</div>
								<div class="xp-start-flyout-item" data-action="open-paint">
									<img src="../assets/images/desk/icons/Paint.webp" class="xp-start-item-icon" alt="">
									<span class="xp-start-title">Paint</span>
								</div>
								<div class="xp-start-flyout-item" data-action="open-sound-recorder">
									<img src="../assets/images/desk/icons/Music File.webp" class="xp-start-item-icon" alt="">
									<span class="xp-start-title">Sound Recorder</span>
								</div>
								<div class="xp-start-flyout-item" data-action="open-charmap">
									<img src="https://api.iconify.design/mdi/format-font.svg?color=%231b4b9b" class="xp-start-item-icon" alt="">
									<span class="xp-start-title">Character Map</span>
								</div>
								<div class="xp-start-flyout-item" data-action="new-text-document">
									<img src="../assets/images/desk/icons/File.webp" class="xp-start-item-icon" alt="">
									<span class="xp-start-title">Notepad</span>
								</div>
								<div class="xp-start-flyout-item" data-action="open-cmd">
									<img src="../assets/images/desk/icons/Command Prompt.webp" class="xp-start-item-icon" alt="">
									<span class="xp-start-title">Command Prompt</span>
								</div>
								<div class="xp-start-flyout-item" data-action="open-today-anecdote">
									<img src="https://api.iconify.design/mdi/calendar-star.svg" class="xp-start-item-icon" alt="">
									<span class="xp-start-title">Daily Anecdotes</span>
								</div>
								<div class="xp-start-flyout-item" data-action="my-documents">
									<img src="../assets/images/desk/icons/List File.webp" class="xp-start-item-icon" alt="">
									<span class="xp-start-title">PDF Documents Archive</span>
								</div>
							`;
						} else if (subKey === 'games') {
							nestedFlyout.innerHTML = `
								<div class="xp-start-flyout-item" data-action="open-minesweeper">
									<img src="../assets/images/desk/icons/Minesweeper.webp" class="xp-start-item-icon" alt="">
									<span class="xp-start-title">Minesweeper</span>
								</div>
								<div class="xp-start-flyout-item" data-action="open-solitaire">
									<img src="../assets/images/desk/icons/Hearts.webp" class="xp-start-item-icon" alt="">
									<span class="xp-start-title">Solitaire</span>
								</div>
							`;
						} else if (subKey === 'media') {
							nestedFlyout.innerHTML = `
								<div class="xp-start-flyout-item" data-action="open-winamp">
									<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Winamp-logo.svg/960px-Winamp-logo.svg.png" class="xp-start-item-icon" alt="">
									<span class="xp-start-title">Winamp Media Player</span>
								</div>
								<div class="xp-start-flyout-item" data-action="link-soundcloud">
									<img src="https://api.iconify.design/mdi/soundcloud.svg" class="xp-start-item-icon" alt="">
									<span class="xp-start-title">SoundCloud Channel</span>
								</div>
								<div class="xp-start-flyout-item" data-action="link-youtube-music">
									<img src="https://api.iconify.design/mdi/youtube.svg" class="xp-start-item-icon" alt="">
									<span class="xp-start-title">YouTube Music</span>
								</div>
							`;
						} else if (subKey === 'system-tools') {
							nestedFlyout.innerHTML = `
								<div class="xp-start-flyout-item" data-action="control-panel">
									<img src="../assets/images/desk/icons/System Properties.webp" class="xp-start-item-icon" alt="">
									<span class="xp-start-title">Control Panel</span>
								</div>
								<div class="xp-start-flyout-item" data-action="recycle-bin">
									<img src="../assets/images/desk/trash.png" class="xp-start-item-icon" alt="">
									<span class="xp-start-title">Recycle Bin</span>
								</div>
								<div class="xp-start-flyout-item" data-action="my-computer">
									<img src="../assets/images/desk/icons/My Computer.webp" class="xp-start-item-icon" alt="">
									<span class="xp-start-title">System Properties</span>
								</div>
							`;
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
									<div class="xp-start-flyout-item" data-project-id="${pTitle}">
										<img src="${p.icon || 'https://img.icons8.com/fluency/48/file.png'}" class="xp-start-item-icon" alt="">
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
								<img src="${doc.icon || 'https://img.icons8.com/fluency/48/file.png'}" class="xp-start-item-icon" alt="">
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
						<img src="https://api.iconify.design/mdi/folder-search-outline.svg" class="xp-start-item-icon" alt="">
						<span class="xp-start-title">For Files or Folders...</span>
					</div>
					<div class="xp-start-flyout-item" data-search-target="projects">
						<img src="https://api.iconify.design/mdi/magnify.svg" class="xp-start-item-icon" alt="">
						<span class="xp-start-title">For Portfolio Projects...</span>
					</div>
					<div class="xp-start-flyout-item" data-search-target="web">
						<img src="../assets/images/desk/internet-explorer.png" class="xp-start-item-icon" alt="">
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
								icon: p.icon || 'https://img.icons8.com/fluent/48/folder-invoices.png'
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

			const directApp = window.DeskAppRegistry ? window.DeskAppRegistry.get(action.replace(/^(open-|link-)/, '')) : null;
			if (directApp) {
				window.DeskAppRegistry.launch(directApp.id);
				return;
			}

			switch (action) {
				case 'open-achievements':
					if (window.AchievementsManager) window.AchievementsManager.open();
					break;
				case 'open-ie':
					if (typeof openInternetExplorer === 'function') openInternetExplorer();
					break;
				case 'open-outlook':
					if (typeof openOutlookExpress === 'function') openOutlookExpress();
					break;
				case 'open-calculator':
					if (window.CalculatorApp) window.CalculatorApp.open();
					break;
				case 'open-charmap':
					if (window.CharacterMapApp) window.CharacterMapApp.open();
					break;
				case 'open-paint':
					if (window.PaintApp) window.PaintApp.open();
					break;
				case 'open-sound-recorder':
					if (window.SoundRecorderApp) window.SoundRecorderApp.open();
					break;
				case 'open-winamp':
					if (typeof openWinamp === 'function') openWinamp();
					break;
				case 'open-minesweeper':
					if (typeof openMinesweeper === 'function') openMinesweeper();
					break;
				case 'open-solitaire':
					if (window.SolitaireApp) {
						window.SolitaireApp.open();
					} else if (typeof openSolitaire === 'function') {
						openSolitaire();
					}
					break;
				case 'my-projects':
					if (typeof openAllProjectsFolder === 'function') openAllProjectsFolder();
					break;
				case 'my-documents':
					if (typeof fs !== 'undefined') {
						const pdfs = fs.root.getByName('PDFs') || fs.root;
						if (typeof openFolderWindow === 'function') openFolderWindow(pdfs);
					}
					break;
				case 'my-pictures':
					if (typeof openDisplaySettings === 'function') openDisplaySettings();
					break;
				case 'my-music':
					if (typeof openWinamp === 'function') openWinamp();
					break;
				case 'my-computer':
					if (window.DeskAPI && window.DeskAPI.openMyComputer) {
						window.DeskAPI.openMyComputer();
					}
					break;
				case 'my-network-places':
					if (window.DeskAPI && window.DeskAPI.openNetworkPlaces) {
						window.DeskAPI.openNetworkPlaces();
					}
					break;
				case 'printers-faxes':
					if (window.DeskAPI && window.DeskAPI.openPrinters) {
						window.DeskAPI.openPrinters();
					}
					break;
				case 'search':
					if (window.DeskAPI && window.DeskAPI.openSearch) {
						window.DeskAPI.openSearch('');
					}
					break;
				case 'recycle-bin':
					if (typeof openRecycleBinWindow === 'function') openRecycleBinWindow();
					break;
				case 'new-text-document':
					if (window.NotepadApp) {
						window.NotepadApp.openNew();
					} else if (typeof fs !== 'undefined') {
						try {
							const newFile = fs.create('File', '/', 'New Document.txt');
							if (typeof openTextEditorWindow === 'function') openTextEditorWindow(newFile);
							if (typeof refreshUI === 'function') refreshUI();
						} catch (e) {
							if (typeof showXPDialog === 'function') showXPDialog('Error', e.message, 'error');
						}
					}
					break;
				case 'control-panel':
					if (window.SettingsApp) {
						window.SettingsApp.open('system');
					} else if (typeof openDisplaySettings === 'function') {
						openDisplaySettings();
					}
					break;
				case 'control-panel-appearance':
					if (window.SettingsApp) {
						window.SettingsApp.open('appearance');
					} else if (typeof openDisplaySettings === 'function') {
						openDisplaySettings();
					}
					break;
				case 'open-today-anecdote':
					if (typeof openAnecdoteWindow === 'function') {
						openAnecdoteWindow(new Date());
					}
					break;
				case 'open-cmd':
					if (typeof processRunCommand === 'function') processRunCommand('cmd');
					break;
				case 'run':
					if (typeof openRunDialog === 'function') openRunDialog();
					break;
				case 'turn-off':
					if (window.AchievementsManager) window.AchievementsManager.progress('turn_off_action', 1);
					if (typeof openShutdownDialog === 'function') openShutdownDialog();
					break;
				case 'log-off':
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
					break;
				case 'help':
					window.open('https://github.com/wartets/Wartets.github.io', '_blank');
					break;
				case 'link-soundcloud':
					window.open('https://soundcloud.com/wartets', '_blank');
					break;
				case 'link-youtube-music':
					window.open('https://www.youtube.com/@Wartets', '_blank');
					break;
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
