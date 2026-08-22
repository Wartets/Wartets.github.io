(function () {
	'use strict';

	const SystemBridge = {
		getUnreadMailCount() {
			try {
				if (window.DeskAPI && typeof window.DeskAPI.getUnreadMailCount === 'function') {
					return window.DeskAPI.getUnreadMailCount();
				}
				if (window.MailStore && typeof window.MailStore.getFolders === 'function') {
					return window.MailStore.getFolders().reduce((sum, folder) => {
						return sum + window.MailStore.getMessages(folder.id).filter(m => !m.read).length;
					}, 0);
				}
			} catch (e) {}
			return 0;
		},

		getRandomProject() {
			try {
				if (window.DeskAPI && typeof window.DeskAPI.getRandomProject === 'function') {
					return window.DeskAPI.getRandomProject();
				}
				if (typeof projects !== 'undefined' && Array.isArray(projects)) {
					const list = projects.flat().filter(p => p && typeof p === 'object' && p.show !== false);
					if (list.length > 0) return list[Math.floor(Math.random() * list.length)];
				}
			} catch (e) {}
			return null;
		},

		getAllProjects() {
			try {
				if (window.DeskAPI && typeof window.DeskAPI.getAllProjects === 'function') {
					return window.DeskAPI.getAllProjects();
				}
				if (typeof projects !== 'undefined' && Array.isArray(projects)) {
					return projects.flat().filter(p => p && typeof p === 'object' && p.show !== false);
				}
			} catch (e) {}
			return [];
		},

		getDesktopItemCount() {
			try {
				if (window.DeskAPI && typeof window.DeskAPI.getDesktopItemCount === 'function') {
					return window.DeskAPI.getDesktopItemCount();
				}
				if (typeof fs !== 'undefined' && fs && fs.root) {
					return fs.root.listContent().filter(el => !el.hidden).length;
				}
			} catch (e) {}
			return 0;
		},

		getRecycleBinCount() {
			try {
				if (window.DeskAPI && typeof window.DeskAPI.getRecycleBinCount === 'function') {
					return window.DeskAPI.getRecycleBinCount();
				}
				if (typeof fs !== 'undefined' && fs && fs.loadRecycleBinItems) {
					return fs.loadRecycleBinItems().length;
				}
			} catch (e) {}
			return 0;
		},

		emptyRecycleBin() {
			try {
				if (window.DeskAPI && typeof window.DeskAPI.emptyRecycleBin === 'function') {
					return window.DeskAPI.emptyRecycleBin();
				}
				if (typeof fs !== 'undefined' && fs && fs.emptyRecycleBin) {
					fs.emptyRecycleBin();
					if (typeof refreshUI === 'function') refreshUI();
					return true;
				}
			} catch (e) {}
			return false;
		},

		getOpenWindowCount() {
			try {
				if (window.DeskAPI && typeof window.DeskAPI.getOpenWindowCount === 'function') {
					return window.DeskAPI.getOpenWindowCount();
				}
				if (window.WindowManager && window.WindowManager.windows) {
					return Object.keys(window.WindowManager.windows).length;
				}
			} catch (e) {}
			return 0;
		},

		getOpenWindowTitles() {
			try {
				if (window.DeskAPI && typeof window.DeskAPI.getOpenWindowTitles === 'function') {
					return window.DeskAPI.getOpenWindowTitles();
				}
				if (window.WindowManager && window.WindowManager.windows) {
					return Object.values(window.WindowManager.windows)
						.filter(w => !w.classList.contains('minimized') && !w.classList.contains('xp-modal-overlay'))
						.map(w => w.querySelector('.xp-window-header .title')?.textContent || 'Window');
				}
			} catch (e) {}
			return [];
		},

		closeAllWindows() {
			try {
				if (window.DeskAPI && typeof window.DeskAPI.closeAllWindows === 'function') {
					window.DeskAPI.closeAllWindows();
					return;
				}
				if (window.WindowManager) {
					window.WindowManager.closeAll();
				}
			} catch (e) {}
		},

		minimizeAllWindows() {
			try {
				if (window.DeskAPI && typeof window.DeskAPI.minimizeAllWindows === 'function') {
					window.DeskAPI.minimizeAllWindows();
					return;
				}
				if (window.WindowManager) {
					window.WindowManager.minimizeAll();
				}
			} catch (e) {}
		},

		getMoonPhaseDay() {
			try {
				if (window.DeskAPI && typeof window.DeskAPI.getMoonPhaseDay === 'function') {
					return window.DeskAPI.getMoonPhaseDay();
				}
				if (typeof getMoonPhaseDayNumber === 'function') {
					return getMoonPhaseDayNumber();
				}
			} catch (e) {}
			return null;
		},

		getMoonPhaseLabel() {
			const day = this.getMoonPhaseDay();
			if (day === null || day === undefined) return null;
			if (day <= 2 || day >= 29) return 'New Moon';
			if (day < 9) return 'Waxing Crescent';
			if (day < 10) return 'First Quarter';
			if (day < 16) return 'Waxing Gibbous';
			if (day < 18) return 'Full Moon';
			if (day < 24) return 'Waning Gibbous';
			if (day < 25) return 'Third Quarter';
			return 'Waning Crescent';
		},

		getNowPlaying() {
			try {
				if (window.DeskAPI && typeof window.DeskAPI.getNowPlaying === 'function') {
					return window.DeskAPI.getNowPlaying();
				}
				if (window.MediaPlayerApp && typeof window.MediaPlayerApp.getNowPlaying === 'function') {
					return window.MediaPlayerApp.getNowPlaying();
				}
			} catch (e) {}
			return null;
		},

		toggleMusicPlayback() {
			try {
				if (window.DeskAPI && typeof window.DeskAPI.toggleMusicPlayback === 'function') {
					return window.DeskAPI.toggleMusicPlayback();
				}
			} catch (e) {}
			return false;
		},

		nextMusicTrack() {
			try {
				if (window.DeskAPI && typeof window.DeskAPI.nextMusicTrack === 'function') {
					return window.DeskAPI.nextMusicTrack();
				}
			} catch (e) {}
			return false;
		},

		focusWindow(windowIdOrTitle) {
			try {
				if (!windowIdOrTitle) return false;
				const win = document.getElementById(windowIdOrTitle) || Array.from(document.querySelectorAll('.xp-window')).find(w => {
					const title = w.querySelector('.xp-window-header .title')?.textContent || '';
					return title.toLowerCase().includes(String(windowIdOrTitle).toLowerCase());
				});
				if (win && window.WindowManager) {
					if (win.classList.contains('minimized')) window.WindowManager.unminimize(win);
					window.WindowManager.bringToFront(win);
					return true;
				}
			} catch (e) {}
			return false;
		},

		cascadeWindows() {
			try {
				if (window.WindowManager && typeof window.WindowManager.cascade === 'function') {
					window.WindowManager.cascade();
					return true;
				}
			} catch (e) {}
			return false;
		},

		tileWindows(horizontal = true) {
			try {
				if (window.WindowManager && typeof window.WindowManager.tile === 'function') {
					window.WindowManager.tile(horizontal);
					return true;
				}
			} catch (e) {}
			return false;
		},

		setTheme(themeName) {
			try {
				if (window.SettingsApp && typeof window.SettingsApp.set === 'function') {
					window.SettingsApp.set('theme', themeName);
					return true;
				}
			} catch (e) {}
			return false;
		},

		setWallpaper(path) {
			try {
				if (typeof window.setImageAsWallpaper === 'function') {
					window.setImageAsWallpaper(path);
					return true;
				}
			} catch (e) {}
			return false;
		},

		toggleScanlines(enabled) {
			try {
				if (window.SettingsApp && typeof window.SettingsApp.set === 'function') {
					const val = enabled !== undefined ? !!enabled : !window.SettingsApp.get('scanlinesEnabled');
					window.SettingsApp.set('scanlinesEnabled', val);
					return val;
				}
			} catch (e) {}
			return false;
		},

		toggleCrt(enabled) {
			try {
				if (window.SettingsApp && typeof window.SettingsApp.set === 'function') {
					const val = enabled !== undefined ? !!enabled : !window.SettingsApp.get('crtCurvatureEnabled');
					window.SettingsApp.set('crtCurvatureEnabled', val);
					return val;
				}
			} catch (e) {}
			return false;
		},

		searchFiles(query) {
			try {
				if (typeof fs !== 'undefined' && fs && typeof fs.search === 'function') {
					return fs.search(query);
				}
			} catch (e) {}
			return [];
		},

		listDesktopFiles() {
			try {
				if (typeof fs !== 'undefined' && fs && fs.root) {
					return fs.root.listContent().map(el => ({
						name: el.name,
						type: el instanceof Folder ? 'folder' : 'file',
						path: el.getFullPath(),
						icon: el.icon,
						size: el.size || 0,
						modifiedAt: el.modifiedAt || el.createdAt
					}));
				}
			} catch (e) {}
			return [];
		},

		readVFSFile(path) {
			try {
				if (typeof fs !== 'undefined' && fs) {
					const el = fs.findByPath(path);
					if (el && el instanceof File) {
						return el.content || '';
					}
				}
			} catch (e) {}
			return null;
		},

		createDesktopFile(name, content = '') {
			try {
				if (typeof fs !== 'undefined' && fs) {
					const f = fs.create('File', '/', name, { content });
					if (typeof refreshUI === 'function') refreshUI();
					return f;
				}
			} catch (e) {}
			return null;
		},

		deleteVFSFile(path) {
			try {
				if (typeof fs !== 'undefined' && fs) {
					fs.moveToRecycleBin(path);
					if (typeof refreshUI === 'function') refreshUI();
					return true;
				}
			} catch (e) {}
			return false;
		},

		getAchievementsSummary() {
			try {
				if (window.AchievementsManager && typeof window.AchievementsManager.getAll === 'function') {
					const list = window.AchievementsManager.getAll();
					const unlocked = list.filter(a => a.unlocked);
					return {
						total: list.length,
						unlockedCount: unlocked.length,
						percentage: list.length > 0 ? Math.round((unlocked.length / list.length) * 100) : 0,
						unlocked,
						locked: list.filter(a => !a.unlocked)
					};
				}
			} catch (e) {}
			return { total: 0, unlockedCount: 0, percentage: 0, unlocked: [], locked: [] };
		},

		getUserProfile() {
			const userName = (window.SettingsApp && window.SettingsApp.get('userName')) || 'Colin B.R.';
			const userJobTitle = (window.SettingsApp && window.SettingsApp.get('userJobTitle')) || 'Student';
			const userAvatar = (window.SettingsApp && window.SettingsApp.get('userAvatar')) || '../assets/images/desk/icons/User 1.webp';
			const avatarShape = (window.SettingsApp && window.SettingsApp.get('userAvatarShape')) || 'square';
			const theme = (window.SettingsApp && window.SettingsApp.get('theme')) || 'luna-blue';
			return { userName, userJobTitle, userAvatar, avatarShape, theme };
		},

		getMusicTracks() {
			try {
				if (window.MusicStore && Array.isArray(window.MusicStore.tracks)) {
					return window.MusicStore.tracks;
				}
			} catch (e) {}
			return [];
		},

		playTrackIndex(index) {
			try {
				if (window.MediaPlayerApp && typeof window.MediaPlayerApp.open === 'function') {
					const tracks = this.getMusicTracks();
					if (tracks[index]) {
						window.MediaPlayerApp.open(tracks[index]);
						return tracks[index];
					}
				}
			} catch (e) {}
			return null;
		},

		getAvailableWallpapers() {
			try {
				if (typeof fetchWallpaperRegistry === 'function') {
					return fetchWallpaperRegistry();
				}
			} catch (e) {}
			return Promise.resolve([]);
		},

		getSetting(key) {
			try {
				if (window.SettingsApp && typeof window.SettingsApp.get === 'function') {
					return window.SettingsApp.get(key);
				}
			} catch (e) {}
			return undefined;
		},

		setSetting(key, val) {
			try {
				if (window.SettingsApp && typeof window.SettingsApp.set === 'function') {
					window.SettingsApp.set(key, val);
					return true;
				}
			} catch (e) {}
			return false;
		},

		restoreAllWindows() {
			try {
				if (window.WindowManager && typeof window.WindowManager.restoreAll === 'function') {
					window.WindowManager.restoreAll();
					return;
				}
				if (typeof openWindows !== 'undefined') {
					Object.values(openWindows).forEach(win => {
						if (win && win.classList.contains('minimized') && typeof unminimizeWindow === 'function') {
							unminimizeWindow(win);
						}
					});
				}
			} catch (e) {}
		},

		launchApp(appId, args = {}) {
			try {
				if (window.DeskAppRegistry && typeof window.DeskAppRegistry.launch === 'function') {
					return window.DeskAppRegistry.launch(appId, args);
				}
				if (window.DeskAPI && typeof window.DeskAPI.openApp === 'function') {
					return window.DeskAPI.openApp(appId, args);
				}
			} catch (e) {}
			return false;
		},

		getSystemSpecs() {
			const nav = typeof navigator !== 'undefined' ? navigator : {};
			const mem = nav.deviceMemory ? `${nav.deviceMemory} GB Unified RAM` : '512 MB SDRAM PC-133 (Simulated)';
			const cores = nav.hardwareConcurrency ? `${nav.hardwareConcurrency} Logical Threads` : 'Intel Pentium 4 (1 Logical Thread)';
			const online = nav.onLine ? 'Connected (TCP/IP 100BASE-TX OK)' : 'Disconnected (Network Link Offline)';
			const screenRes = typeof screen !== 'undefined' ? `${screen.width}x${screen.height} (${screen.colorDepth}-bit TrueColor)` : '1024x768 (32-bit)';
			const openWins = this.getOpenWindowCount();
			const unread = this.getUnreadMailCount();
			const recycleCount = this.getRecycleBinCount();
			const desktopItems = this.getDesktopItemCount();
			const moon = this.getMoonPhaseLabel() || 'Unavailable';

			return `[WORKSTATION DIAGNOSTICS LOG]\n- Host Operating Environment: Windows XP Professional (Win32 API Emulated)\n- Network Link: ${online}\n- Display Subsystem: ${screenRes}\n- Window Manager: ${openWins} active process window(s)\n- Mail Subsystem: ${unread} unread message(s)\n- Shell Storage: ${desktopItems} desktop item(s), ${recycleCount} recycled file(s)\n- Processor Topology: ${cores}\n- Host Memory: ${mem}\n- Platform Architecture: ${nav.platform || 'Win32'}\n- Lunar Phase Metric: ${moon}`;
		},

		unlockAchievement(id, count = 1) {
			try {
				if (window.AchievementsManager && typeof window.AchievementsManager.progress === 'function') {
					window.AchievementsManager.progress(id, count);
				}
			} catch (e) {}
		}
	};

	window.ClippySystemBridge = SystemBridge;
})();
