(function () {
	const STORAGE_KEY_STATE = 'xp_achievements_state';
	const REGISTRY_URL = '../data/desk-achievements.json';
	const LOCKED_ICON = 'https://api.iconify.design/mdi/lock-question.svg?color=%23777777';

	let achievementsData = [];
	let stateCache = null;
	let initialized = false;

	const SCRAMBLE_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789!#%&*?@$';

	function scrambleText(text, seed) {
		if (!text) return '';
		let res = '';
		for (let i = 0; i < text.length; i++) {
			const char = text[i];
			if (/[a-zA-Z0-9]/.test(char)) {
				const charIndex = (char.charCodeAt(0) + i * 7 + (seed || 13)) % SCRAMBLE_CHARS.length;
				res += SCRAMBLE_CHARS[charIndex];
			} else {
				res += char;
			}
		}
		return res;
	}

	function loadSavedState() {
		if (stateCache) return stateCache;
		try {
			const raw = localStorage.getItem(STORAGE_KEY_STATE);
			stateCache = raw ? JSON.parse(raw) : {};
		} catch (e) {
			stateCache = {};
		}
		return stateCache;
	}

	function saveCurrentState() {
		try {
			localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(stateCache));
		} catch (e) {}
	}

	const AchievementsManager = {
		async init() {
			if (initialized) return;
			loadSavedState();

			try {
				const response = await fetch(REGISTRY_URL);
				if (response.ok) {
					achievementsData = await response.json();
				}
			} catch (e) {
				achievementsData = [];
			}

			initialized = true;
			this.checkInitialAchievements();
		},

		checkInitialAchievements() {
			setTimeout(() => {
				this.progress('first_boot', 1);
			}, 1200);
		},

		getAll() {
			return achievementsData.map(item => {
				const state = stateCache[item.id] || { progress: 0, unlocked: false, unlockedAt: null };
				return {
					...item,
					currentProgress: state.progress,
					unlocked: state.unlocked,
					unlockedAt: state.unlockedAt
				};
			});
		},

		setProgress(id, value) {
			if (!initialized) {
				this.init().then(() => this.setProgress(id, value));
				return;
			}

			const achievement = achievementsData.find(a => a.id === id);
			if (!achievement) return;

			if (!stateCache[id]) {
				stateCache[id] = { progress: 0, unlocked: false, unlockedAt: null };
			}

			const state = stateCache[id];
			if (state.unlocked) return;

			state.progress = Math.min(achievement.maxProgress, Math.max(0, value));

			if (state.progress >= achievement.maxProgress && !state.unlocked) {
				state.unlocked = true;
				state.unlockedAt = new Date().toISOString();
				saveCurrentState();
				this.onUnlock(achievement);
			} else {
				saveCurrentState();
			}

			this.checkMetaAchievements();
		},

		unlock(id) {
			if (!initialized) {
				this.init().then(() => this.unlock(id));
				return null;
			}
			const achievement = achievementsData.find(a => a.id === id || a.title.toLowerCase() === String(id).toLowerCase());
			if (!achievement) return null;
			if (!stateCache[achievement.id]) {
				stateCache[achievement.id] = { progress: 0, unlocked: false, unlockedAt: null };
			}
			const state = stateCache[achievement.id];
			state.progress = achievement.maxProgress;
			if (!state.unlocked) {
				state.unlocked = true;
				state.unlockedAt = new Date().toISOString();
				saveCurrentState();
				this.onUnlock(achievement);
			} else {
				saveCurrentState();
			}
			this.checkMetaAchievements();
			const win = document.getElementById('window-achievements-vault');
			if (win) this.renderWindowContent(win, achievement.id);
			return this.getById(achievement.id);
		},

		validate(id) {
			return this.unlock(id);
		},

		unlockAll() {
			if (!initialized) {
				this.init().then(() => this.unlockAll());
				return [];
			}
			achievementsData.forEach(item => {
				if (!stateCache[item.id]) {
					stateCache[item.id] = { progress: 0, unlocked: false, unlockedAt: null };
				}
				stateCache[item.id].progress = item.maxProgress;
				stateCache[item.id].unlocked = true;
				stateCache[item.id].unlockedAt = stateCache[item.id].unlockedAt || new Date().toISOString();
			});
			saveCurrentState();
			if (window.SettingsApp && window.SettingsApp.playSound) {
				window.SettingsApp.playSound('asterisk');
			}
			const win = document.getElementById('window-achievements-vault');
			if (win) this.renderWindowContent(win);
			return this.getAll();
		},

		reset(showConfirmation = false) {
			const executeReset = () => {
				stateCache = {};
				saveCurrentState();
				const win = document.getElementById('window-achievements-vault');
				if (win) this.renderWindowContent(win);
				if (window.SettingsApp && window.SettingsApp.playSound) {
					window.SettingsApp.playSound('recycle');
				}
				this.checkInitialAchievements();
			};

			if (showConfirmation && typeof showXPDialog === 'function') {
				showXPDialog('Reset Milestones', 'Are you sure you want to reset all achievement progress? All earned points and unlocked trophies will be permanently cleared.', 'warning', {
					buttons: ['Yes', 'No'],
					callback: (result) => {
						if (result === 'Yes') {
							executeReset();
						}
					}
				});
			} else {
				executeReset();
			}
		},

		list() {
			const all = this.getAll();
			if (typeof console !== 'undefined' && console.table) {
				console.table(all.map(a => ({
					ID: a.id,
					Title: a.title,
					Progress: `${a.currentProgress}/${a.maxProgress}`,
					Points: a.points,
					Unlocked: a.unlocked ? 'Yes' : 'No'
				})));
			}
			return all;
		},

		exportProgress() {
			const payload = {
				state: loadSavedState(),
				exportedAt: new Date().toISOString(),
				version: 1
			};
			const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `achievements-backup-${Date.now()}.json`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			setTimeout(() => URL.revokeObjectURL(url), 2000);
		},

		importProgress(jsonStr) {
			try {
				const data = JSON.parse(jsonStr);
				if (data && data.state && typeof data.state === 'object') {
					stateCache = data.state;
				} else if (data && typeof data === 'object') {
					stateCache = data;
				} else {
					throw new Error('Invalid structure');
				}
				saveCurrentState();
				const win = document.getElementById('window-achievements-vault');
				if (win) this.renderWindowContent(win);
				if (window.SettingsApp && window.SettingsApp.playSound) {
					window.SettingsApp.playSound('asterisk');
				}
				return true;
			} catch (e) {
				showXPDialog('Import Error', 'The selected achievements file is invalid.', 'error');
				return false;
			}
		},

		getById(id) {
			const item = achievementsData.find(a => a.id === id);
			if (!item) return null;
			const state = stateCache[item.id] || { progress: 0, unlocked: false, unlockedAt: null };
			return {
				...item,
				currentProgress: state.progress,
				unlocked: state.unlocked,
				unlockedAt: state.unlockedAt
			};
		},

		getUnlockedCount() {
			return Object.values(stateCache).filter(s => s && s.unlocked).length;
		},

		getTotalCount() {
			return achievementsData.length;
		},

		getTotalPoints() {
			return achievementsData.reduce((sum, item) => sum + (item.points || 0), 0);
		},

		getEarnedPoints() {
			return achievementsData.reduce((sum, item) => {
				const state = stateCache[item.id];
				return sum + (state && state.unlocked ? (item.points || 0) : 0);
			}, 0);
		},

		progress(id, amount = 1) {
			if (!initialized) {
				this.init().then(() => this.progress(id, amount));
				return;
			}

			const achievement = achievementsData.find(a => a.id === id);
			if (!achievement) return;

			if (!stateCache[id]) {
				stateCache[id] = { progress: 0, unlocked: false, unlockedAt: null };
			}

			const state = stateCache[id];
			if (state.unlocked) return;

			state.progress = Math.min(achievement.maxProgress, (state.progress || 0) + amount);

			if (state.progress >= achievement.maxProgress && !state.unlocked) {
				state.unlocked = true;
				state.unlockedAt = new Date().toISOString();
				saveCurrentState();
				this.onUnlock(achievement);
			} else {
				saveCurrentState();
			}

			this.checkMetaAchievements();
		},

		checkMetaAchievements() {
			const count = this.getUnlockedCount();
			if (count > 0) {
				const meta = achievementsData.find(a => a.id === 'grand_explorer');
				if (meta && (!stateCache['grand_explorer'] || !stateCache['grand_explorer'].unlocked)) {
					stateCache['grand_explorer'] = stateCache['grand_explorer'] || { progress: 0, unlocked: false, unlockedAt: null };
					stateCache['grand_explorer'].progress = Math.min(meta.maxProgress, count);
					if (stateCache['grand_explorer'].progress >= meta.maxProgress && !stateCache['grand_explorer'].unlocked) {
						stateCache['grand_explorer'].unlocked = true;
						stateCache['grand_explorer'].unlockedAt = new Date().toISOString();
						saveCurrentState();
						this.onUnlock(meta);
					} else {
						saveCurrentState();
					}
				}
			}
		},

		showNotificationToast(achievement) {
			let container = document.getElementById('achievement-toast-container');
			if (!container) {
				container = document.createElement('div');
				container.id = 'achievement-toast-container';
				container.className = 'xp-achievement-toast-container';
				const screenFrame = document.getElementById('screen-frame') || document.body;
				screenFrame.appendChild(container);
			}

			const toast = document.createElement('div');
			toast.className = 'xp-achievement-toast';
			toast.dataset.achId = achievement.id;

			const iconSrc = achievement.icon || 'https://api.iconify.design/mdi/trophy-award.svg?color=%23e68a00';

			toast.innerHTML = `
				<div class="xp-toast-header">
					<div class="xp-toast-header-title">
						<img src="../assets/images/desk/window_logo.png" alt="" class="xp-toast-flag">
						<span>Milestone Unlocked!</span>
					</div>
					<button type="button" class="xp-toast-close" title="Close">×</button>
				</div>
				<div class="xp-toast-body">
					<div class="xp-toast-icon-frame">
						<img src="${iconSrc}" alt="" class="xp-toast-icon">
						<div class="xp-toast-check">✓</div>
					</div>
					<div class="xp-toast-content">
						<div class="xp-toast-title">${achievement.title}</div>
						<div class="xp-toast-meta">
							<span class="xp-toast-pts">+${achievement.points} PTS</span>
							<span class="xp-toast-cat">[${(achievement.category || 'System').toUpperCase()}]</span>
						</div>
					</div>
				</div>
			`;

			const closeBtn = toast.querySelector('.xp-toast-close');
			const dismiss = () => {
				toast.classList.remove('visible');
				toast.classList.add('dismissing');
				setTimeout(() => toast.remove(), 390);
			};

			closeBtn.addEventListener('click', (e) => {
				e.stopPropagation();
				dismiss();
			});

			toast.addEventListener('click', () => {
				dismiss();
				this.open(achievement.id);
			});

			container.appendChild(toast);

			requestAnimationFrame(() => {
				toast.classList.add('visible');
			});

			setTimeout(() => {
				if (toast.parentElement) {
					dismiss();
				}
			}, 7000);
		},

		onUnlock(achievement) {
			if (window.SettingsApp && window.SettingsApp.playSound) {
				window.SettingsApp.playSound('asterisk');
			}

			this.showNotificationToast(achievement);

			const win = document.getElementById('window-achievements-vault');
			if (win) {
				this.renderWindowContent(win, achievement.id);
			}
		},

		open(highlightId = null) {
			const id = 'window-achievements-vault';
			const existing = document.getElementById(id);
			if (existing) {
				if (typeof bringWindowToFront === 'function') bringWindowToFront(existing);
				if (existing.classList.contains('minimized') && typeof unminimizeWindow === 'function') {
					unminimizeWindow(existing);
				}
				this.renderWindowContent(existing, highlightId);
				return existing;
			}

			const layoutMarkup = `
				<div class="xp-explorer-layout achievements-layout">
					<input type="file" id="ach-file-importer" accept=".json" style="display: none;">
					<div class="xp-explorer-menubar">
						<ul class="xp-menubar-list">
							<li class="xp-menubar-item" id="ach-menu-file"><u>F</u>ile</li>
							<li class="xp-menubar-item" id="ach-menu-view"><u>V</u>iew</li>
							<li class="xp-menubar-item" id="ach-menu-options"><u>O</u>ptions</li>
							<li class="xp-menubar-item" id="ach-menu-help"><u>H</u>elp</li>
						</ul>
						<div class="xp-menubar-brand">
							<img src="../assets/images/desk/window_logo.png" alt="XP">
						</div>
					</div>

					<div class="xp-explorer-toolbar achievements-toolbar">
						<div class="xp-tb-group">
							<button type="button" class="xp-tb-btn ach-filter-btn active" data-filter="all">
								<img src="https://api.iconify.design/mdi/trophy.svg?color=%231b4b9b" alt="">
								<span>All (<span id="ach-count-all">0</span>)</span>
							</button>
							<button type="button" class="xp-tb-btn ach-filter-btn" data-filter="unlocked">
								<img src="https://api.iconify.design/mdi/check-decagram.svg?color=%232e7d32" alt="">
								<span>Unlocked (<span id="ach-count-unlocked">0</span>)</span>
							</button>
							<button type="button" class="xp-tb-btn ach-filter-btn" data-filter="locked">
								<img src="https://api.iconify.design/mdi/lock-outline.svg?color=%23777777" alt="">
								<span>Locked (<span id="ach-count-locked">0</span>)</span>
							</button>
						</div>
						<div class="xp-tb-sep"></div>
						<div class="xp-tb-group">
							<label for="ach-search-input" style="font-size: 11px; margin-right: 2px;">Search:</label>
							<input type="text" id="ach-search-input" class="xp-input" placeholder="Filter trophies..." style="width: 140px; height: 19px;">
						</div>
						<div class="xp-tb-sep"></div>
						<div class="xp-tb-group">
							<select id="ach-sort-select" class="xp-select" style="height: 22px;">
								<option value="default">Default Order</option>
								<option value="points-desc">Highest Points</option>
								<option value="name-asc">Alphabetical (A-Z)</option>
								<option value="progress-desc">Nearest to Complete</option>
							</select>
						</div>
					</div>

					<div class="achievements-summary-banner">
						<div class="ach-summary-left">
							<div class="ach-trophy-large-icon">
								<img src="../assets/images/desk/icons/Trophy.webp" alt="Trophy">
							</div>
							<div class="ach-summary-text">
								<div class="ach-summary-title">System Milestones & Desktop Quests</div>
								<div class="ach-summary-sub" id="ach-summary-metrics">0 of 0 Completed (0%)</div>
							</div>
						</div>
						<div class="ach-summary-right">
							<div class="ach-points-counter">
								<span id="ach-points-earned">0</span> / <span id="ach-points-total">0</span> PTS
							</div>
							<div class="ach-progress-bar-container">
								<div class="ach-progress-bar-fill" id="ach-header-progress-fill" style="width: 0%;"></div>
							</div>
						</div>
					</div>

					<div class="achievements-body-container">
						<div class="achievements-list-viewport" id="ach-cards-list"></div>
					</div>

					<div class="xp-explorer-statusbar">
						<div class="xp-sb-pane xp-sb-count" id="ach-sb-count">0 items displayed</div>
						<div class="xp-sb-pane xp-sb-size" id="ach-sb-score">Score: 0 pts</div>
						<div class="xp-sb-pane xp-sb-zone"><img src="../assets/images/desk/icons/My Computer.webp" alt=""><span>Local Workstation</span></div>
					</div>
				</div>
			`;

			const win = createXPWindow(id, 'Milestones & Achievements', layoutMarkup, 740, 520, {
				iconSrc: '../assets/images/desk/icons/Trophy.webp',
				resizable: true
			});

			win.querySelector('.xp-window-content').style.padding = '0';
			this.bindWindowEvents(win);
			this.renderWindowContent(win, highlightId);
			return win;
		},

		bindWindowEvents(win) {
			const searchInput = win.querySelector('#ach-search-input');
			const sortSelect = win.querySelector('#ach-sort-select');
			const filterBtns = win.querySelectorAll('.ach-filter-btn');

			if (searchInput) {
				searchInput.addEventListener('input', () => {
					this.renderWindowContent(win);
				});
			}

			if (sortSelect) {
				sortSelect.addEventListener('change', () => {
					this.renderWindowContent(win);
				});
			}

			filterBtns.forEach(btn => {
				btn.addEventListener('click', () => {
					filterBtns.forEach(b => b.classList.remove('active'));
					btn.classList.add('active');
					this.renderWindowContent(win);
					if (window.SettingsApp && window.SettingsApp.playSound) {
						window.SettingsApp.playSound('click');
					}
				});
			});

			const fileImporter = win.querySelector('#ach-file-importer');
			if (fileImporter) {
				fileImporter.addEventListener('change', (e) => {
					const file = e.target.files[0];
					if (!file) return;
					const reader = new FileReader();
					reader.onload = (event) => {
						this.importProgress(event.target.result);
					};
					reader.readAsText(file);
				});
			}

			const fileMenu = win.querySelector('#ach-menu-file');
			if (fileMenu) {
				fileMenu.addEventListener('click', (e) => {
					e.stopPropagation();
					if (window.ContextMenu) {
						const rect = fileMenu.getBoundingClientRect();
						const items = [
							{
								label: 'Export Progress (JSON)...',
								action: () => this.exportProgress()
							},
							{
								label: 'Import Progress...',
								action: () => {
									if (fileImporter) fileImporter.click();
								}
							},
							{ separator: true },
							{
								label: 'Refresh Status',
								shortcut: 'F5',
								action: () => this.renderWindowContent(win)
							},
							{ separator: true },
							{
								label: 'Close',
								action: () => {
									if (typeof closeWindow === 'function') closeWindow(win, win.id);
								}
							}
						];
						window.ContextMenu.show(items, rect.left, rect.bottom + 2);
					}
				});
			}

			const optMenu = win.querySelector('#ach-menu-options');
			if (optMenu) {
				optMenu.addEventListener('click', (e) => {
					e.stopPropagation();
					if (window.ContextMenu) {
						const rect = optMenu.getBoundingClientRect();
						const items = [
							{ separator: true },
							{
								label: 'Reset All Achievements...',
								action: () => this.reset(true)
							}
						];
						window.ContextMenu.show(items, rect.left, rect.bottom + 2);
					}
				});
			}
		},

		renderWindowContent(win, targetHighlightId = null) {
			const listContainer = win.querySelector('#ach-cards-list');
			const searchInput = win.querySelector('#ach-search-input');
			const sortSelect = win.querySelector('#ach-sort-select');
			const activeFilterBtn = win.querySelector('.ach-filter-btn.active');
			const filterMode = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';
			const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
			const sortMode = sortSelect ? sortSelect.value : 'default';

			if (!listContainer) return;

			let list = this.getAll();

			const countAll = list.length;
			const countUnlocked = list.filter(a => a.unlocked).length;
			const countLocked = countAll - countUnlocked;
			const earnedPts = this.getEarnedPoints();
			const totalPts = this.getTotalPoints();
			const percent = countAll > 0 ? Math.round((countUnlocked / countAll) * 100) : 0;

			const countAllEl = win.querySelector('#ach-count-all');
			const countUnlEl = win.querySelector('#ach-count-unlocked');
			const countLocEl = win.querySelector('#ach-count-locked');
			const summaryMetrics = win.querySelector('#ach-summary-metrics');
			const ptsEarnedEl = win.querySelector('#ach-points-earned');
			const ptsTotalEl = win.querySelector('#ach-points-total');
			const progressFill = win.querySelector('#ach-header-progress-fill');
			const sbCount = win.querySelector('#ach-sb-count');
			const sbScore = win.querySelector('#ach-sb-score');

			if (countAllEl) countAllEl.textContent = String(countAll);
			if (countUnlEl) countUnlEl.textContent = String(countUnlocked);
			if (countLocEl) countLocEl.textContent = String(countLocked);
			if (summaryMetrics) summaryMetrics.textContent = `${countUnlocked} of ${countAll} Completed (${percent}%)`;
			if (ptsEarnedEl) ptsEarnedEl.textContent = String(earnedPts);
			if (ptsTotalEl) ptsTotalEl.textContent = String(totalPts);
			if (progressFill) progressFill.style.width = `${percent}%`;
			if (sbScore) sbScore.textContent = `Score: ${earnedPts} / ${totalPts} pts`;

			if (filterMode === 'unlocked') {
				list = list.filter(a => a.unlocked);
			} else if (filterMode === 'locked') {
				list = list.filter(a => !a.unlocked);
			}

			if (query) {
				list = list.filter(a => {
					const titleMatch = a.title.toLowerCase().includes(query);
					const descMatch = a.unlocked && a.description.toLowerCase().includes(query);
					const catMatch = a.category.toLowerCase().includes(query);
					return titleMatch || descMatch || catMatch;
				});
			}

			if (sortMode === 'points-desc') {
				list.sort((a, b) => (b.points || 0) - (a.points || 0));
			} else if (sortMode === 'name-asc') {
				list.sort((a, b) => a.title.localeCompare(b.title));
			} else if (sortMode === 'progress-desc') {
				list.sort((a, b) => {
					const ratioA = a.maxProgress > 1 ? (a.currentProgress / a.maxProgress) : (a.unlocked ? 1 : 0);
					const ratioB = b.maxProgress > 1 ? (b.currentProgress / b.maxProgress) : (b.unlocked ? 1 : 0);
					return ratioB - ratioA;
				});
			}

			if (sbCount) sbCount.textContent = `${list.length} milestone(s) listed`;

			listContainer.innerHTML = '';

			if (list.length === 0) {
				listContainer.innerHTML = `
					<div class="ach-empty-state">
						<img src="https://api.iconify.design/mdi/magnify-close.svg?color=%23777777" alt="">
						<span>No achievements matching your criteria.</span>
					</div>
				`;
				return;
			}

			list.forEach(item => {
				const card = document.createElement('div');
				card.className = `ach-card-item ${item.unlocked ? 'unlocked' : 'locked'}`;
				card.dataset.achId = item.id;

				let displayIcon = item.icon;
				if (!item.unlocked && item.hideIconWhenLocked && (item.currentProgress || 0) === 0) {
					displayIcon = LOCKED_ICON;
				}

				const isLocked = !item.unlocked;
				const displayDesc = isLocked ? scrambleText(item.description, item.id.length) : item.description;

				let progressBarHtml = '';
				if (item.maxProgress > 1) {
					const curProg = item.currentProgress || 0;
					const progPercent = Math.min(100, Math.round((curProg / item.maxProgress) * 100));
					progressBarHtml = `
						<div class="ach-card-prog-wrap">
							<div class="ach-card-prog-track">
								<div class="ach-card-prog-bar" style="width: ${progPercent}%;"></div>
							</div>
							<span class="ach-card-prog-text">${curProg} / ${item.maxProgress}</span>
						</div>
					`;
				}

				const unlockedDateStr = item.unlocked && item.unlockedAt
					? new Date(item.unlockedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
					: (isLocked ? 'Locked' : 'Unlocked');

				card.innerHTML = `
					<div class="ach-card-icon-frame">
						<img src="${displayIcon}" class="ach-card-square-img" alt="${item.title}">
						${isLocked ? '<div class="ach-lock-overlay">🔒</div>' : '<div class="ach-check-overlay">✓</div>'}
					</div>
					<div class="ach-card-content">
						<div class="ach-card-header-row">
							<strong class="ach-card-title">${item.title}</strong>
							<span class="ach-card-pts-badge">${item.points} PTS</span>
						</div>
						<div class="ach-card-desc ${isLocked ? 'scrambled-text' : ''}" title="${isLocked ? 'Description hidden until unlocked' : item.description}">
							${displayDesc}
						</div>
						${progressBarHtml}
						<div class="ach-card-footer-row">
							<span class="ach-card-category-tag">[${item.category.toUpperCase()}]</span>
							<span class="ach-card-status-label">${unlockedDateStr}</span>
						</div>
					</div>
				`;

				listContainer.appendChild(card);

				if (targetHighlightId && item.id === targetHighlightId) {
					setTimeout(() => {
						card.scrollIntoView({ behavior: 'smooth', block: 'center' });
						card.classList.add('highlight-target');
						setTimeout(() => card.classList.remove('highlight-target'), 2400);
					}, 120);
				}
			});
		}
	};

	document.addEventListener('DOMContentLoaded', () => {
		AchievementsManager.init();
	});

	window.AchievementsManager = AchievementsManager;
	window.Achievements = AchievementsManager;
	window.achievements = AchievementsManager;

	window.unlockAllAchievements = () => AchievementsManager.unlockAll();
	window.unlockAchievement = (id) => AchievementsManager.unlock(id);
	window.validateAchievement = (id) => AchievementsManager.validate(id);
	window.progressAchievement = (id, amt) => AchievementsManager.progress(id, amt);
	window.setAchievementProgress = (id, val) => AchievementsManager.setProgress(id, val);
	window.resetAchievements = (confirm = false) => AchievementsManager.reset(confirm);
	window.listAchievements = () => AchievementsManager.list();
})();
