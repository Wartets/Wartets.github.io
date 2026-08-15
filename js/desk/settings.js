/**
 * Authentic Windows XP Settings & Control Panel Engine
 * Deep system customization, retro visual styles, sound synthesis and environment maintenance
 */
(function () {
	const SETTINGS_STORAGE_KEY = 'xp_system_settings';

	const AVATAR_PRESETS = [
		{ id: 'user-1', name: 'User 1', url: '../assets/images/desk/icons/User 1.webp' },
		{ id: 'user-2', name: 'User 2', url: '../assets/images/desk/icons/User 2.webp' },
		{ id: 'earth', name: 'Earth', url: '../assets/images/desk/icons/Earth (fixed).webp' },
		{ id: 'camera', name: 'Camera', url: '../assets/images/desk/icons/Camera.webp' },
		{ id: 'chess', name: 'Chess', url: 'https://api.iconify.design/mdi/chess-knight.svg?color=%231b4b9b' },
		{ id: 'duck', name: 'Rubber Duck', url: 'https://api.iconify.design/mdi/duck.svg?color=%23e68a00' },
		{ id: 'cat', name: 'Cat', url: 'https://api.iconify.design/mdi/cat.svg?color=%232d74da' },
		{ id: 'dog', name: 'Dog', url: 'https://api.iconify.design/mdi/dog.svg?color=%238a5a36' },
		{ id: 'frog', name: 'Frog', url: 'https://api.iconify.design/mdi/emoticon-happy-outline.svg?color=%232e7d32' },
		{ id: 'butterfly', name: 'Butterfly', url: 'https://api.iconify.design/mdi/butterfly.svg?color=%239c27b0' },
		{ id: 'ball', name: 'Soccer', url: 'https://api.iconify.design/mdi/soccer.svg?color=%23333333' },
		{ id: 'guitar', name: 'Guitar', url: 'https://api.iconify.design/mdi/guitar-acoustic.svg?color=%23d84315' }
	];

	const DEFAULT_SETTINGS = {
		theme: 'luna-blue',
		fontFamily: 'roboto-mono',
		fontScale: 'normal',
		desktopBackground: '../assets/images/desk/wallpapers/wallpaper-default.webp',
		wallpaperFit: 'cover',
		iconSize: 'normal',
		iconTextShadow: true,
		iconBackground: false,
		singleClickOpen: false,
		scanlinesEnabled: true,
		scanlinesIntensity: 0.85,
		vignetteEnabled: true,
		crtFlicker: false,
		windowAnimations: true,
		animationSpeed: 'normal',
		showClockSeconds: true,
		showClockDate: true,
		clockFormat: '24h',
		dateFormat: 'dd/mm/yyyy',
		taskbarDensity: 'auto',
		taskbarLocked: true,
		taskbarAutoHide: false,
		taskbarBalloons: true,
		quickLaunchVisible: true,
		userName: 'Colin B.R.',
		userAvatar: '../assets/images/desk/icons/User 1.webp',
		clippyEnabled: true,
		clippyFrequency: 'normal',
		soundScheme: 'default',
		soundEnabled: true,
		soundVolume: 0.7,
		showHiddenFiles: false,
		showFileExtensions: true,
		doubleClickSpeed: 400,
		startMenuRecentDocs: true,
		startMenuSmallIcons: false
	};

	let currentSettings = { ...DEFAULT_SETTINGS };
	let pendingSettings = { ...DEFAULT_SETTINGS };

	const SoundEngine = {
		ctx: null,
		init() {
			if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
				const AudioCtx = window.AudioContext || window.webkitAudioContext;
				this.ctx = new AudioCtx();
			}
		},
		play(type) {
			if (!currentSettings.soundEnabled) return;
			try {
				this.init();
				if (!this.ctx) return;
				if (this.ctx.state === 'suspended') {
					this.ctx.resume();
				}
				const vol = (currentSettings.soundVolume || 0.7) * 0.25;
				const now = this.ctx.currentTime;
				const master = this.ctx.createGain();
				master.gain.setValueAtTime(vol, now);
				master.connect(this.ctx.destination);

				if (type === 'startup' || type === 'chord') {
					const freqs = [311.13, 466.16, 622.25, 783.99, 932.33];
					freqs.forEach((f, idx) => {
						const osc = this.ctx.createOscillator();
						const g = this.ctx.createGain();
						osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
						osc.frequency.setValueAtTime(f, now + idx * 0.04);
						g.gain.setValueAtTime(0.001, now + idx * 0.04);
						g.gain.exponentialRampToValueAtTime(0.6, now + idx * 0.04 + 0.08);
						g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 1.2);
						osc.connect(g);
						g.connect(master);
						osc.start(now + idx * 0.04);
						osc.stop(now + idx * 0.04 + 1.25);
					});
				} else if (type === 'shutdown') {
					const freqs = [783.99, 622.25, 466.16, 311.13];
					freqs.forEach((f, idx) => {
						const osc = this.ctx.createOscillator();
						const g = this.ctx.createGain();
						osc.type = 'sine';
						osc.frequency.setValueAtTime(f, now + idx * 0.07);
						g.gain.setValueAtTime(0.001, now + idx * 0.07);
						g.gain.exponentialRampToValueAtTime(0.5, now + idx * 0.07 + 0.05);
						g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.9);
						osc.connect(g);
						g.connect(master);
						osc.start(now + idx * 0.07);
						osc.stop(now + idx * 0.07 + 0.95);
					});
				} else if (type === 'error' || type === 'bonk') {
					const osc = this.ctx.createOscillator();
					const g = this.ctx.createGain();
					osc.type = 'sawtooth';
					osc.frequency.setValueAtTime(160, now);
					osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);
					g.gain.setValueAtTime(0.7, now);
					g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
					osc.connect(g);
					g.connect(master);
					osc.start(now);
					osc.stop(now + 0.22);
				} else if (type === 'asterisk' || type === 'info') {
					const notes = [739.99, 1108.73];
					notes.forEach((f, i) => {
						const osc = this.ctx.createOscillator();
						const g = this.ctx.createGain();
						osc.type = 'sine';
						osc.frequency.setValueAtTime(f, now + i * 0.06);
						g.gain.setValueAtTime(0.4, now + i * 0.06);
						g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);
						osc.connect(g);
						g.connect(master);
						osc.start(now + i * 0.06);
						osc.stop(now + i * 0.06 + 0.38);
					});
				} else if (type === 'exclamation' || type === 'warning') {
					const notes = [587.33, 880.00];
					notes.forEach((f, i) => {
						const osc = this.ctx.createOscillator();
						const g = this.ctx.createGain();
						osc.type = 'triangle';
						osc.frequency.setValueAtTime(f, now + i * 0.08);
						g.gain.setValueAtTime(0.5, now + i * 0.08);
						g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
						osc.connect(g);
						g.connect(master);
						osc.start(now + i * 0.08);
						osc.stop(now + i * 0.08 + 0.42);
					});
				} else if (type === 'question') {
					const notes = [523.25, 783.99];
					notes.forEach((f, i) => {
						const osc = this.ctx.createOscillator();
						const g = this.ctx.createGain();
						osc.type = 'sine';
						osc.frequency.setValueAtTime(f, now + i * 0.07);
						g.gain.setValueAtTime(0.4, now + i * 0.07);
						g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.45);
						osc.connect(g);
						g.connect(master);
						osc.start(now + i * 0.07);
						osc.stop(now + i * 0.07 + 0.48);
					});
				} else if (type === 'click') {
					const osc = this.ctx.createOscillator();
					const g = this.ctx.createGain();
					osc.type = 'sine';
					osc.frequency.setValueAtTime(950, now);
					osc.frequency.exponentialRampToValueAtTime(250, now + 0.025);
					g.gain.setValueAtTime(0.3, now);
					g.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
					osc.connect(g);
					g.connect(master);
					osc.start(now);
					osc.stop(now + 0.03);
				} else if (type === 'recycle') {
					const osc = this.ctx.createOscillator();
					const g = this.ctx.createGain();
					osc.type = 'triangle';
					osc.frequency.setValueAtTime(320, now);
					osc.frequency.exponentialRampToValueAtTime(60, now + 0.28);
					g.gain.setValueAtTime(0.45, now);
					g.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
					osc.connect(g);
					g.connect(master);
					osc.start(now);
					osc.stop(now + 0.3);
				} else if (type === 'window') {
					const osc = this.ctx.createOscillator();
					const g = this.ctx.createGain();
					osc.type = 'sine';
					osc.frequency.setValueAtTime(600, now);
					osc.frequency.linearRampToValueAtTime(900, now + 0.06);
					g.gain.setValueAtTime(0.2, now);
					g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
					osc.connect(g);
					g.connect(master);
					osc.start(now);
					osc.stop(now + 0.09);
				}
			} catch (e) {
				console.warn('Audio synthesis failed:', e);
			}
		}
	};

	function loadSavedSettings() {
		try {
			const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
			if (saved) {
				currentSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
			}
			const legacyHidden = localStorage.getItem('desktopShowHidden');
			if (legacyHidden !== null) currentSettings.showHiddenFiles = legacyHidden === 'true';
			const legacyBg = localStorage.getItem('desktopBackground');
			if (legacyBg) currentSettings.desktopBackground = legacyBg;
		} catch (e) {
			currentSettings = { ...DEFAULT_SETTINGS };
		}
		pendingSettings = { ...currentSettings };
	}

	function saveCurrentSettings() {
		try {
			localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(currentSettings));
			localStorage.setItem('desktopShowHidden', currentSettings.showHiddenFiles ? 'true' : 'false');
			localStorage.setItem('desktopBackground', currentSettings.desktopBackground);
		} catch (e) {
			console.error('Failed to save settings:', e);
		}
	}

	function applyAllSettings() {
		document.body.classList.remove('theme-luna-blue', 'theme-royale', 'theme-silver', 'theme-olive', 'theme-classic', 'theme-zune');
		const themeClass = currentSettings.theme === 'default' ? 'theme-luna-blue' : (currentSettings.theme.startsWith('theme-') ? currentSettings.theme : `theme-${currentSettings.theme}`);
		document.body.classList.add(themeClass);

		document.body.classList.remove('font-roboto-mono', 'font-tahoma', 'font-trebuchet', 'font-sans', 'font-segoe', 'font-comic');
		document.body.classList.add(`font-${currentSettings.fontFamily || 'roboto-mono'}`);

		document.body.classList.remove('font-scale-normal', 'font-scale-large', 'font-scale-xlarge');
		document.body.classList.add(`font-scale-${currentSettings.fontScale || 'normal'}`);

		const desktop = document.getElementById('desktop');
		if (desktop && currentSettings.desktopBackground) {
			desktop.style.backgroundImage = `url('${currentSettings.desktopBackground}')`;
		}
		document.body.classList.remove('wallpaper-fit-cover', 'wallpaper-fit-stretch', 'wallpaper-fit-center', 'wallpaper-fit-tile');
		document.body.classList.add(`wallpaper-fit-${currentSettings.wallpaperFit || 'cover'}`);

		document.body.classList.remove('icon-size-small', 'icon-size-normal', 'icon-size-large');
		document.body.classList.add(`icon-size-${currentSettings.iconSize || 'normal'}`);
		document.body.classList.toggle('icon-no-shadow', !currentSettings.iconTextShadow);
		document.body.classList.toggle('icon-label-bg', !!currentSettings.iconBackground);
		document.body.classList.toggle('single-click-mode', !!currentSettings.singleClickOpen);

		const scanlinesOverlay = document.getElementById('scanlines-overlay');
		if (scanlinesOverlay) {
			scanlinesOverlay.style.display = currentSettings.scanlinesEnabled ? 'block' : 'none';
			scanlinesOverlay.style.opacity = currentSettings.scanlinesIntensity;
		}
		if (desktop) {
			desktop.classList.toggle('crt-effect', !!currentSettings.vignetteEnabled);
		}
		document.body.classList.toggle('crt-flicker', !!currentSettings.crtFlicker);

		document.body.classList.toggle('no-window-animations', !currentSettings.windowAnimations);
		document.body.classList.remove('anim-fast', 'anim-slow');
		if (currentSettings.animationSpeed === 'fast') document.body.classList.add('anim-fast');
		if (currentSettings.animationSpeed === 'slow') document.body.classList.add('anim-slow');

		const clippyIcon = document.getElementById('clippy-taskbar-icon');
		if (clippyIcon) {
			clippyIcon.style.display = currentSettings.clippyEnabled ? 'flex' : 'none';
		}
		if (window.ClippyAgent && !currentSettings.clippyEnabled && window.ClippyAgent.hide) {
			window.ClippyAgent.hide();
		}

		const quickLaunchBar = document.getElementById('quick-launch-bar');
		if (quickLaunchBar) {
			quickLaunchBar.style.display = currentSettings.quickLaunchVisible ? 'flex' : 'none';
		}

		document.body.classList.toggle('taskbar-locked', !!currentSettings.taskbarLocked);
		document.body.classList.toggle('taskbar-autohide', !!currentSettings.taskbarAutoHide);

		const profileNameEl = document.querySelector('.start-menu-profile span');
		if (profileNameEl && currentSettings.userName) {
			profileNameEl.textContent = currentSettings.userName;
		}
		const welcomeNameEl = document.querySelector('.welcome-username');
		if (welcomeNameEl && currentSettings.userName) {
			welcomeNameEl.textContent = currentSettings.userName;
		}

		const profileImg = document.querySelector('.start-menu-profile img');
		if (profileImg && currentSettings.userAvatar) {
			profileImg.src = currentSettings.userAvatar;
		}
		const welcomeImg = document.querySelector('#login-user img');
		if (welcomeImg && currentSettings.userAvatar) {
			welcomeImg.src = currentSettings.userAvatar;
		}

		if (typeof refreshUI === 'function' && typeof fs !== 'undefined' && fs && fs.root) {
			refreshUI();
		}
		if (window.StartMenu && typeof window.StartMenu.updateProfile === 'function') {
			window.StartMenu.updateProfile();
			window.StartMenu.updateLiveBadges();
		}
		if (window.Taskbar && typeof window.Taskbar.updateDensity === 'function') {
			window.Taskbar.updateDensity();
		}
	}

	function calculateStorageUsage() {
		let total = 0;
		for (let i = 0; i < localStorage.length; i++) {
			const k = localStorage.key(i);
			const v = localStorage.getItem(k);
			total += (k.length + (v ? v.length : 0)) * 2;
		}
		return total;
	}

	function formatBytes(bytes) {
		if (!bytes) return '0 KB';
		return `${(bytes / 1024).toFixed(1)} KB`;
	}

	function openSettingsDialog(defaultTab = 'system') {
		const id = 'window-control-panel-properties';
		const existing = document.getElementById(id);
		if (existing) {
			if (typeof bringWindowToFront === 'function') bringWindowToFront(existing);
			if (existing.classList.contains('minimized') && typeof unminimizeWindow === 'function') {
				unminimizeWindow(existing);
			}
			switchTab(existing, defaultTab);
			return;
		}

		pendingSettings = { ...currentSettings };

		const contentHTML = `
			<div class="xp-tabs-container">
				<div class="xp-tabs-bar">
					<button type="button" class="xp-tab-btn" data-tab="system">General</button>
					<button type="button" class="xp-tab-btn" data-tab="desktop">Desktop</button>
					<button type="button" class="xp-tab-btn" data-tab="appearance">Appearance</button>
					<button type="button" class="xp-tab-btn" data-tab="effects">Effects & CRT</button>
					<button type="button" class="xp-tab-btn" data-tab="taskbar">Taskbar</button>
					<button type="button" class="xp-tab-btn" data-tab="audio">Sounds</button>
					<button type="button" class="xp-tab-btn" data-tab="input">Mouse & Nav</button>
				</div>

				<div class="xp-tab-page-wrapper">
					<div class="xp-tab-page" data-page="system">
						<div style="display: flex; gap: 14px; margin-bottom: 10px; align-items: center;">
							<img src="../assets/images/desk/icons/System Properties.webp" alt="Windows XP" style="width: 48px; height: 48px; flex-shrink: 0;">
							<div style="font-size: 11px; line-height: 1.45;">
								<strong>Microsoft Windows XP</strong><br>
								Professional Version 2002 Service Pack 3<br>
								Wartets Interactive Experience & Portfolio Engine
							</div>
						</div>

						<fieldset class="xp-groupbox">
							<legend>User Account & Identity</legend>
							<div class="xp-form-row">
								<label for="settings-username-input" style="width: 100px;">User Name:</label>
								<input type="text" id="settings-username-input" class="xp-input" value="${pendingSettings.userName}" style="flex: 1;">
							</div>
							<div style="font-size: 11px; margin: 6px 0 4px 0;">User Account Picture:</div>
							<div class="xp-avatar-grid" id="settings-avatar-grid"></div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Computer & Storage Maintenance</legend>
							<div class="xp-info-grid">
								<div>LocalStorage Usage:</div>
								<div id="settings-storage-used" style="font-weight: bold;">Calculating...</div>
								<div>Recycle Bin Contents:</div>
								<div id="settings-recycle-count">0 items</div>
								<div>Unread E-mails:</div>
								<div id="settings-unread-mails">0</div>
							</div>
							<div style="display: flex; gap: 6px; margin-top: 8px; justify-content: flex-end; flex-wrap: wrap;">
								<button type="button" class="xp-button-small" id="settings-export-btn">Backup Config (JSON)</button>
								<label class="xp-button-small" style="cursor: pointer;">
									Restore Config
									<input type="file" id="settings-import-file" accept=".json" style="display: none;">
								</label>
								<button type="button" class="xp-button-small" id="settings-empty-trash-btn">Empty Trash</button>
								<button type="button" class="xp-button-small" id="settings-reset-system-btn" style="color: #b00;">Reset Desktop</button>
							</div>
						</fieldset>
					</div>

					<div class="xp-tab-page" data-page="desktop">
						<div class="wallpaper-monitor-container" style="margin-bottom: 8px;">
							<div class="wallpaper-monitor-bezel">
								<div class="wallpaper-monitor-screen" id="settings-monitor-screen" style="background-image: url('${pendingSettings.desktopBackground}');"></div>
							</div>
							<div class="wallpaper-monitor-stand"></div>
							<div class="wallpaper-monitor-base"></div>
						</div>
						<fieldset class="xp-groupbox">
							<legend>Background Picture</legend>
							<div style="display: flex; gap: 8px; align-items: flex-start;">
								<div class="xp-listbox-frame" id="settings-wallpaper-listbox">
									<div class="xp-listbox-loading">Loading wallpaper catalog...</div>
								</div>
								<div style="display: flex; flex-direction: column; gap: 6px; width: 120px;">
									<button type="button" class="xp-button-small" id="settings-btn-restore-bliss">Default Bliss</button>
									<label class="xp-button-small" style="cursor: pointer; text-align: center;">
										Upload Image
										<input type="file" id="settings-wallpaper-upload" accept="image/*" style="display: none;">
									</label>
									<div class="xp-form-row" style="flex-direction: column; align-items: flex-start; margin-top: 4px;">
										<label for="settings-wallpaper-fit" style="font-size: 10px;">Position:</label>
										<select id="settings-wallpaper-fit" class="xp-select" style="width: 100%;">
											<option value="cover">Stretch / Cover</option>
											<option value="stretch">Fit to Window</option>
											<option value="center">Center</option>
											<option value="tile">Tile</option>
										</select>
									</div>
								</div>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-wallpaper-url-input" style="font-size: 11px;">Custom URL:</label>
								<input type="text" id="settings-wallpaper-url-input" class="xp-input" placeholder="https://example.com/image.jpg" style="flex: 1;">
								<button type="button" class="xp-button-small" id="settings-wallpaper-url-btn">Set</button>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Desktop Items</legend>
							<div style="display: flex; gap: 12px; align-items: center;">
								<div class="xp-form-row" style="margin-bottom: 0;">
									<label for="settings-icon-size">Icon Size:</label>
									<select id="settings-icon-size" class="xp-select">
										<option value="small">Small (32x32)</option>
										<option value="normal">Normal (48x48)</option>
										<option value="large">Large (64x64)</option>
									</select>
								</div>
								<div class="xp-checkbox-row" style="margin-bottom: 0;">
									<input type="checkbox" id="settings-icon-shadow" ${pendingSettings.iconTextShadow ? 'checked' : ''}>
									<label for="settings-icon-shadow">Drop shadows for icon labels</label>
								</div>
							</div>
						</fieldset>
					</div>

					<div class="xp-tab-page" data-page="appearance">
						<div class="theme-preview-box" id="settings-theme-preview">
							<div class="theme-preview-titlebar" id="settings-theme-preview-title">Active Window Title</div>
							<div class="theme-preview-body">
								<button class="xp-button-small" type="button">OK</button>
								<span>Dialog Box Text</span>
							</div>
						</div>

						<fieldset class="xp-groupbox">
							<legend>Windows and Buttons Style</legend>
							<div class="xp-form-row">
								<label for="settings-theme-select" style="width: 110px;">Color Scheme:</label>
								<select id="settings-theme-select" class="xp-select" style="flex: 1;">
									<option value="luna-blue">Windows XP style (Luna Blue)</option>
									<option value="royale">Windows Royale (Energy Blue)</option>
									<option value="silver">Windows XP (Metallic Silver)</option>
									<option value="olive">Windows XP (Olive Green)</option>
									<option value="classic">Windows Classic (98/2000)</option>
									<option value="zune">Zune / Noir (Dark Orange)</option>
								</select>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Typography & Scaling</legend>
							<div class="xp-form-row">
								<label for="settings-font-select" style="width: 110px;">Font Family:</label>
								<select id="settings-font-select" class="xp-select" style="flex: 1;">
									<option value="roboto-mono">Roboto Mono (Terminal Modern)</option>
									<option value="tahoma">Tahoma (Classic Windows XP)</option>
									<option value="trebuchet">Trebuchet MS</option>
									<option value="segoe">Segoe UI</option>
									<option value="sans">System Sans-Serif</option>
									<option value="comic">Comic Sans MS (Retro Fun)</option>
								</select>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-font-scale" style="width: 110px;">Font Size Scale:</label>
								<select id="settings-font-scale" class="xp-select" style="flex: 1;">
									<option value="normal">Normal (100%)</option>
									<option value="large">Large Fonts (115%)</option>
									<option value="xlarge">Extra Large Fonts (130%)</option>
								</select>
							</div>
						</fieldset>
					</div>

					<div class="xp-tab-page" data-page="effects">
						<fieldset class="xp-groupbox">
							<legend>Cathode Ray Tube (CRT) Display Simulation</legend>
							<div class="xp-checkbox-row">
								<input type="checkbox" id="settings-scanlines-toggle" ${pendingSettings.scanlinesEnabled ? 'checked' : ''}>
								<label for="settings-scanlines-toggle">Enable scanlines overlay simulation</label>
							</div>
							<div class="xp-form-row" style="margin-top: 8px;">
								<label for="settings-scanlines-slider">Scanline Intensity:</label>
								<input type="range" id="settings-scanlines-slider" min="0.2" max="1" step="0.05" value="${pendingSettings.scanlinesIntensity}" class="xp-slider">
								<span id="settings-scanlines-val" style="font-size: 11px; width: 35px;">${Math.round(pendingSettings.scanlinesIntensity * 100)}%</span>
							</div>
							<div class="xp-checkbox-row" style="margin-top: 8px;">
								<input type="checkbox" id="settings-vignette-toggle" ${pendingSettings.vignetteEnabled ? 'checked' : ''}>
								<label for="settings-vignette-toggle">Simulate CRT screen curvature and vignette darkening</label>
							</div>
							<div class="xp-checkbox-row" style="margin-top: 8px;">
								<input type="checkbox" id="settings-crt-flicker-toggle" ${pendingSettings.crtFlicker ? 'checked' : ''}>
								<label for="settings-crt-flicker-toggle">Simulate 60Hz cathode ray tube phosphor flicker</label>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Window Transitions & Performance</legend>
							<div class="xp-checkbox-row">
								<input type="checkbox" id="settings-anim-toggle" ${pendingSettings.windowAnimations ? 'checked' : ''}>
								<label for="settings-anim-toggle">Animate windows when minimizing, maximizing and opening</label>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-anim-speed">Animation Speed:</label>
								<select id="settings-anim-speed" class="xp-select">
									<option value="fast">Fast (Smooth 120ms)</option>
									<option value="normal">Normal (Classic XP 250ms)</option>
									<option value="slow">Slow Motion (500ms)</option>
								</select>
							</div>
						</fieldset>
					</div>

					<div class="xp-tab-page" data-page="taskbar">
						<fieldset class="xp-groupbox">
							<legend>Taskbar Appearance & Behavior</legend>
							<div class="xp-checkbox-row">
								<input type="checkbox" id="settings-taskbar-lock" ${pendingSettings.taskbarLocked ? 'checked' : ''}>
								<label for="settings-taskbar-lock">Lock the taskbar</label>
							</div>
							<div class="xp-checkbox-row" style="margin-top: 4px;">
								<input type="checkbox" id="settings-taskbar-autohide" ${pendingSettings.taskbarAutoHide ? 'checked' : ''}>
								<label for="settings-taskbar-autohide">Auto-hide the taskbar</label>
							</div>
							<div class="xp-checkbox-row" style="margin-top: 4px;">
								<input type="checkbox" id="settings-quicklaunch-toggle" ${pendingSettings.quickLaunchVisible ? 'checked' : ''}>
								<label for="settings-quicklaunch-toggle">Show Quick Launch toolbar</label>
							</div>
							<div class="xp-checkbox-row" style="margin-top: 4px;">
								<input type="checkbox" id="settings-balloons-toggle" ${pendingSettings.taskbarBalloons ? 'checked' : ''}>
								<label for="settings-balloons-toggle">Show taskbar notification balloons</label>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Taskbar Window Buttons</legend>
							<div class="xp-form-row">
								<label for="settings-taskbar-density">Grouping:</label>
								<select id="settings-taskbar-density" class="xp-select">
									<option value="auto">Automatic (Compact when full)</option>
									<option value="compact">Always compact icons only</option>
									<option value="expanded">Never compact (Always show titles)</option>
								</select>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Notification Area & Clock</legend>
							<div class="xp-checkbox-row">
								<input type="checkbox" id="settings-clock-seconds" ${pendingSettings.showClockSeconds ? 'checked' : ''}>
								<label for="settings-clock-seconds">Show seconds in taskbar clock</label>
							</div>
							<div class="xp-checkbox-row" style="margin-top: 4px;">
								<input type="checkbox" id="settings-clock-date" ${pendingSettings.showClockDate ? 'checked' : ''}>
								<label for="settings-clock-date">Show date below time in taskbar</label>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-clock-format">Time format:</label>
								<select id="settings-clock-format" class="xp-select">
									<option value="24h">24-hour clock (14:30)</option>
									<option value="12h">12-hour clock AM/PM (02:30 PM)</option>
								</select>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-date-format">Date format:</label>
								<select id="settings-date-format" class="xp-select">
									<option value="dd/mm/yyyy">DD/MM/YYYY (31/12/2001)</option>
									<option value="mm/dd/yyyy">MM/DD/YYYY (12/31/2001)</option>
									<option value="yyyy-mm-dd">YYYY-MM-DD (2001-12-31)</option>
									<option value="dd.mm.yyyy">DD.MM.YYYY (31.12.2001)</option>
								</select>
							</div>
							<div class="xp-checkbox-row" style="margin-top: 6px;">
								<input type="checkbox" id="settings-clippy-toggle" ${pendingSettings.clippyEnabled ? 'checked' : ''}>
								<label for="settings-clippy-toggle">Enable Microsoft Clippy assistant in taskbar</label>
							</div>
						</fieldset>
					</div>

					<div class="xp-tab-page" data-page="audio">
						<fieldset class="xp-groupbox">
							<legend>Sound Scheme & Volume</legend>
							<div class="xp-form-row">
								<label for="settings-sound-scheme" style="width: 100px;">Sound Scheme:</label>
								<select id="settings-sound-scheme" class="xp-select" style="flex: 1;">
									<option value="default">Windows Default</option>
									<option value="utopia">Windows Utopia</option>
									<option value="classic">Windows Classic (95/98)</option>
									<option value="none">No Sounds (Silent)</option>
								</select>
							</div>
							<div class="xp-checkbox-row" style="margin-top: 6px;">
								<input type="checkbox" id="settings-sound-toggle" ${pendingSettings.soundEnabled ? 'checked' : ''}>
								<label for="settings-sound-toggle">Play synthesized Windows XP system sound events</label>
							</div>
							<div class="xp-form-row" style="margin-top: 8px;">
								<label for="settings-volume-slider">Master Volume:</label>
								<input type="range" id="settings-volume-slider" min="0.05" max="1" step="0.05" value="${pendingSettings.soundVolume}" class="xp-slider">
								<span id="settings-volume-val" style="font-size: 11px; width: 35px;">${Math.round(pendingSettings.soundVolume * 100)}%</span>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Program Events Soundboard (Click to Test)</legend>
							<div class="sound-test-grid">
								<div class="sound-test-row"><span>Windows XP Startup / Login</span><button class="xp-button-small" data-sound="startup">Play</button></div>
								<div class="sound-test-row"><span>Windows XP Shutdown / Logoff</span><button class="xp-button-small" data-sound="shutdown">Play</button></div>
								<div class="sound-test-row"><span>Critical Stop (Bonk Error)</span><button class="xp-button-small" data-sound="error">Play</button></div>
								<div class="sound-test-row"><span>Asterisk (Information Chime)</span><button class="xp-button-small" data-sound="asterisk">Play</button></div>
								<div class="sound-test-row"><span>Exclamation (Warning Alert)</span><button class="xp-button-small" data-sound="exclamation">Play</button></div>
								<div class="sound-test-row"><span>Question Prompt</span><button class="xp-button-small" data-sound="question">Play</button></div>
								<div class="sound-test-row"><span>Recycle Bin Emptying</span><button class="xp-button-small" data-sound="recycle">Play</button></div>
								<div class="sound-test-row"><span>Navigation / Menu Click</span><button class="xp-button-small" data-sound="click">Play</button></div>
								<div class="sound-test-row"><span>Window Minimize / Restore</span><button class="xp-button-small" data-sound="window">Play</button></div>
							</div>
						</fieldset>
					</div>

					<div class="xp-tab-page" data-page="input">
						<fieldset class="xp-groupbox">
							<legend>Click Item Action</legend>
							<div class="xp-checkbox-row">
								<input type="checkbox" id="settings-single-click-toggle" ${pendingSettings.singleClickOpen ? 'checked' : ''}>
								<label for="settings-single-click-toggle">Single-click to open an item (point to select)</label>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Double-Click Speed Calibration</legend>
							<div style="font-size: 11px; margin-bottom: 4px;">Double-click the test box below to verify your double-click speed:</div>
							<div class="xp-form-row">
								<span style="font-size: 10px;">Slow</span>
								<input type="range" id="settings-dclick-slider" min="200" max="800" step="50" value="${pendingSettings.doubleClickSpeed}" class="xp-slider">
								<span style="font-size: 10px;">Fast</span>
							</div>
							<div class="dclick-test-area" id="settings-dclick-test-box">
								<img src="../assets/images/desk/icons/Folder Closed.webp" class="dclick-test-icon" id="settings-dclick-icon" alt="Test Folder">
								<div style="font-size: 10px; color: #555; margin-top: 4px;" id="settings-dclick-status">Double-click folder to open/close</div>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>File Explorer Navigation</legend>
							<div class="xp-checkbox-row">
								<input type="checkbox" id="settings-show-hidden" ${pendingSettings.showHiddenFiles ? 'checked' : ''}>
								<label for="settings-show-hidden">Show hidden files and folders</label>
							</div>
							<div class="xp-checkbox-row" style="margin-top: 4px;">
								<input type="checkbox" id="settings-show-ext" ${pendingSettings.showFileExtensions ? 'checked' : ''}>
								<label for="settings-show-ext">Hide file extensions for known file types</label>
							</div>
						</fieldset>
					</div>
				</div>

				<div class="xp-dialog-action-footer">
					<button type="button" class="xp-button" id="settings-btn-ok">OK</button>
					<button type="button" class="xp-button" id="settings-btn-cancel">Cancel</button>
					<button type="button" class="xp-button" id="settings-btn-apply" disabled>Apply</button>
				</div>
			</div>
		`;

		const win = createXPWindow(id, 'Control Panel & System Settings', contentHTML, 540, 530, {
			iconSrc: '../assets/images/desk/icons/System Properties.webp',
			resizable: false
		});
		win.querySelector('.xp-window-content').style.padding = '0';

		bindSettingsDialogEvents(win, id, defaultTab);
	}

	function switchTab(win, tabName) {
		win.querySelectorAll('.xp-tab-btn').forEach(btn => {
			btn.classList.toggle('active', btn.dataset.tab === tabName);
		});
		win.querySelectorAll('.xp-tab-page').forEach(page => {
			page.classList.toggle('active', page.dataset.page === tabName);
		});
	}

	function markDirty(win) {
		const applyBtn = win.querySelector('#settings-btn-apply');
		if (applyBtn) applyBtn.disabled = false;
	}

	function updateThemePreviewBox(win) {
		const titleEl = win.querySelector('#settings-theme-preview-title');
		if (!titleEl) return;
		const theme = pendingSettings.theme;
		if (theme === 'royale') {
			titleEl.style.background = 'linear-gradient(to right, #1d439b, #4b89e8)';
		} else if (theme === 'silver') {
			titleEl.style.background = 'linear-gradient(to right, #72757d, #c2c4c9)';
		} else if (theme === 'olive') {
			titleEl.style.background = 'linear-gradient(to right, #6c843f, #b3c788)';
		} else if (theme === 'classic') {
			titleEl.style.background = 'linear-gradient(to right, #000080, #1084d0)';
		} else if (theme === 'zune') {
			titleEl.style.background = 'linear-gradient(to right, #222222, #f35b04)';
		} else {
			titleEl.style.background = 'linear-gradient(to right, #0a246a, #a6caf0)';
		}
	}

	async function populateWallpapersList(win) {
		const listbox = win.querySelector('#settings-wallpaper-listbox');
		const monitor = win.querySelector('#settings-monitor-screen');
		if (!listbox) return;

		let wallpapers = [];
		if (typeof fetchWallpaperRegistry === 'function') {
			wallpapers = await fetchWallpaperRegistry();
		} else {
			try {
				const res = await fetch('../data/desk-wallpaper.json');
				if (res.ok) wallpapers = await res.json();
			} catch (e) {
				wallpapers = [];
			}
		}

		if (!wallpapers || wallpapers.length === 0) {
			listbox.innerHTML = '<div class="xp-listbox-item active">Default Bliss</div>';
			return;
		}

		listbox.innerHTML = '';
		wallpapers.forEach(wp => {
			const item = document.createElement('div');
			item.className = 'xp-listbox-item';
			if (wp.path === pendingSettings.desktopBackground) {
				item.classList.add('active');
			}
			item.textContent = wp.name;
			item.dataset.path = wp.path;

			item.addEventListener('click', () => {
				listbox.querySelectorAll('.xp-listbox-item').forEach(i => i.classList.remove('active'));
				item.classList.add('active');
				pendingSettings.desktopBackground = wp.path;
				if (monitor) monitor.style.backgroundImage = `url('${wp.path}')`;
				markDirty(win);
				SoundEngine.play('click');
			});

			listbox.appendChild(item);
		});
	}

	function populateAvatarGrid(win) {
		const grid = win.querySelector('#settings-avatar-grid');
		if (!grid) return;
		grid.innerHTML = '';

		AVATAR_PRESETS.forEach(avatar => {
			const item = document.createElement('div');
			item.className = 'xp-avatar-item';
			if (pendingSettings.userAvatar === avatar.url) {
				item.classList.add('selected');
			}
			item.title = avatar.name;

			const img = document.createElement('img');
			img.src = avatar.url;
			img.alt = avatar.name;
			item.appendChild(img);

			item.addEventListener('click', () => {
				grid.querySelectorAll('.xp-avatar-item').forEach(el => el.classList.remove('selected'));
				item.classList.add('selected');
				pendingSettings.userAvatar = avatar.url;
				markDirty(win);
				SoundEngine.play('click');
			});

			grid.appendChild(item);
		});
	}

	function updateStorageTabMetrics(win) {
		const storageUsedEl = win.querySelector('#settings-storage-used');
		const recycleCountEl = win.querySelector('#settings-recycle-count');
		const unreadMailsEl = win.querySelector('#settings-unread-mails');

		if (storageUsedEl) storageUsedEl.textContent = formatBytes(calculateStorageUsage());
		if (recycleCountEl && typeof fs !== 'undefined' && fs.loadRecycleBinItems) {
			recycleCountEl.textContent = `${fs.loadRecycleBinItems().length} item(s)`;
		}
		if (unreadMailsEl && window.DeskAPI && window.DeskAPI.getUnreadMailCount) {
			unreadMailsEl.textContent = String(window.DeskAPI.getUnreadMailCount());
		}
	}

	function bindSettingsDialogEvents(win, windowId, initialTab) {
		switchTab(win, initialTab);

		win.querySelectorAll('.xp-tab-btn').forEach(btn => {
			btn.addEventListener('click', () => {
				switchTab(win, btn.dataset.tab);
				SoundEngine.play('click');
			});
		});

		populateWallpapersList(win);
		populateAvatarGrid(win);
		updateThemePreviewBox(win);

		const restoreBlissBtn = win.querySelector('#settings-btn-restore-bliss');
		if (restoreBlissBtn) {
			restoreBlissBtn.addEventListener('click', () => {
				const defaultPath = DEFAULT_SETTINGS.desktopBackground;
				pendingSettings.desktopBackground = defaultPath;
				const monitor = win.querySelector('#settings-monitor-screen');
				if (monitor) monitor.style.backgroundImage = `url('${defaultPath}')`;
				const listbox = win.querySelector('#settings-wallpaper-listbox');
				if (listbox) {
					listbox.querySelectorAll('.xp-listbox-item').forEach(i => {
						i.classList.toggle('active', i.dataset.path === defaultPath);
					});
				}
				markDirty(win);
				SoundEngine.play('click');
			});
		}

		const uploadInput = win.querySelector('#settings-wallpaper-upload');
		if (uploadInput) {
			uploadInput.addEventListener('change', (e) => {
				const file = e.target.files[0];
				if (!file) return;
				const reader = new FileReader();
				reader.onload = (event) => {
					pendingSettings.desktopBackground = event.target.result;
					const monitor = win.querySelector('#settings-monitor-screen');
					if (monitor) monitor.style.backgroundImage = `url('${event.target.result}')`;
					markDirty(win);
				};
				reader.readAsDataURL(file);
			});
		}

		const urlBtn = win.querySelector('#settings-wallpaper-url-btn');
		const urlInput = win.querySelector('#settings-wallpaper-url-input');
		if (urlBtn && urlInput) {
			urlBtn.addEventListener('click', () => {
				const val = urlInput.value.trim();
				if (val) {
					pendingSettings.desktopBackground = val;
					const monitor = win.querySelector('#settings-monitor-screen');
					if (monitor) monitor.style.backgroundImage = `url('${val}')`;
					markDirty(win);
					SoundEngine.play('click');
				}
			});
		}

		const fitSelect = win.querySelector('#settings-wallpaper-fit');
		if (fitSelect) {
			fitSelect.value = pendingSettings.wallpaperFit || 'cover';
			fitSelect.addEventListener('change', () => {
				pendingSettings.wallpaperFit = fitSelect.value;
				markDirty(win);
			});
		}

		const iconSizeSelect = win.querySelector('#settings-icon-size');
		if (iconSizeSelect) {
			iconSizeSelect.value = pendingSettings.iconSize || 'normal';
			iconSizeSelect.addEventListener('change', () => {
				pendingSettings.iconSize = iconSizeSelect.value;
				markDirty(win);
			});
		}

		const iconShadowToggle = win.querySelector('#settings-icon-shadow');
		if (iconShadowToggle) {
			iconShadowToggle.addEventListener('change', () => {
				pendingSettings.iconTextShadow = iconShadowToggle.checked;
				markDirty(win);
			});
		}

		const themeSelect = win.querySelector('#settings-theme-select');
		if (themeSelect) {
			themeSelect.value = pendingSettings.theme;
			themeSelect.addEventListener('change', () => {
				pendingSettings.theme = themeSelect.value;
				updateThemePreviewBox(win);
				markDirty(win);
			});
		}

		const fontSelect = win.querySelector('#settings-font-select');
		if (fontSelect) {
			fontSelect.value = pendingSettings.fontFamily;
			fontSelect.addEventListener('change', () => {
				pendingSettings.fontFamily = fontSelect.value;
				markDirty(win);
			});
		}

		const fontScaleSelect = win.querySelector('#settings-font-scale');
		if (fontScaleSelect) {
			fontScaleSelect.value = pendingSettings.fontScale || 'normal';
			fontScaleSelect.addEventListener('change', () => {
				pendingSettings.fontScale = fontScaleSelect.value;
				markDirty(win);
			});
		}

		const scanlinesToggle = win.querySelector('#settings-scanlines-toggle');
		const scanlinesSlider = win.querySelector('#settings-scanlines-slider');
		const scanlinesVal = win.querySelector('#settings-scanlines-val');

		if (scanlinesToggle) {
			scanlinesToggle.addEventListener('change', () => {
				pendingSettings.scanlinesEnabled = scanlinesToggle.checked;
				markDirty(win);
			});
		}

		if (scanlinesSlider) {
			scanlinesSlider.addEventListener('input', () => {
				pendingSettings.scanlinesIntensity = parseFloat(scanlinesSlider.value);
				if (scanlinesVal) scanlinesVal.textContent = `${Math.round(pendingSettings.scanlinesIntensity * 100)}%`;
				markDirty(win);
			});
		}

		const vignetteToggle = win.querySelector('#settings-vignette-toggle');
		if (vignetteToggle) {
			vignetteToggle.addEventListener('change', () => {
				pendingSettings.vignetteEnabled = vignetteToggle.checked;
				markDirty(win);
			});
		}

		const crtFlickerToggle = win.querySelector('#settings-crt-flicker-toggle');
		if (crtFlickerToggle) {
			crtFlickerToggle.addEventListener('change', () => {
				pendingSettings.crtFlicker = crtFlickerToggle.checked;
				markDirty(win);
			});
		}

		const singleClickToggle = win.querySelector('#settings-single-click-toggle');
		if (singleClickToggle) {
			singleClickToggle.addEventListener('change', () => {
				pendingSettings.singleClickOpen = singleClickToggle.checked;
				markDirty(win);
			});
		}

		const soundSchemeSelect = win.querySelector('#settings-sound-scheme');
		if (soundSchemeSelect) {
			soundSchemeSelect.value = pendingSettings.soundScheme || 'default';
			soundSchemeSelect.addEventListener('change', () => {
				pendingSettings.soundScheme = soundSchemeSelect.value;
				if (soundSchemeSelect.value === 'none') {
					pendingSettings.soundEnabled = false;
					if (soundToggle) soundToggle.checked = false;
				} else {
					pendingSettings.soundEnabled = true;
					if (soundToggle) soundToggle.checked = true;
				}
				markDirty(win);
			});
		}

		const animToggle = win.querySelector('#settings-anim-toggle');
		if (animToggle) {
			animToggle.addEventListener('change', () => {
				pendingSettings.windowAnimations = animToggle.checked;
				markDirty(win);
			});
		}

		const animSpeedSelect = win.querySelector('#settings-anim-speed');
		if (animSpeedSelect) {
			animSpeedSelect.value = pendingSettings.animationSpeed || 'normal';
			animSpeedSelect.addEventListener('change', () => {
				pendingSettings.animationSpeed = animSpeedSelect.value;
				markDirty(win);
			});
		}

		const clockSecToggle = win.querySelector('#settings-clock-seconds');
		if (clockSecToggle) {
			clockSecToggle.addEventListener('change', () => {
				pendingSettings.showClockSeconds = clockSecToggle.checked;
				markDirty(win);
			});
		}

		const clockDateToggle = win.querySelector('#settings-clock-date');
		if (clockDateToggle) {
			clockDateToggle.addEventListener('change', () => {
				pendingSettings.showClockDate = clockDateToggle.checked;
				markDirty(win);
			});
		}

		const clockFormatSelect = win.querySelector('#settings-clock-format');
		if (clockFormatSelect) {
			clockFormatSelect.value = pendingSettings.clockFormat || '24h';
			clockFormatSelect.addEventListener('change', () => {
				pendingSettings.clockFormat = clockFormatSelect.value;
				markDirty(win);
			});
		}

		const dateFormatSelect = win.querySelector('#settings-date-format');
		if (dateFormatSelect) {
			dateFormatSelect.value = pendingSettings.dateFormat || 'dd/mm/yyyy';
			dateFormatSelect.addEventListener('change', () => {
				pendingSettings.dateFormat = dateFormatSelect.value;
				markDirty(win);
			});
		}

		const taskbarLockToggle = win.querySelector('#settings-taskbar-lock');
		if (taskbarLockToggle) {
			taskbarLockToggle.addEventListener('change', () => {
				pendingSettings.taskbarLocked = taskbarLockToggle.checked;
				markDirty(win);
			});
		}

		const taskbarAutoHideToggle = win.querySelector('#settings-taskbar-autohide');
		if (taskbarAutoHideToggle) {
			taskbarAutoHideToggle.addEventListener('change', () => {
				pendingSettings.taskbarAutoHide = taskbarAutoHideToggle.checked;
				markDirty(win);
			});
		}

		const taskbarBalloonsToggle = win.querySelector('#settings-balloons-toggle');
		if (taskbarBalloonsToggle) {
			taskbarBalloonsToggle.addEventListener('change', () => {
				pendingSettings.taskbarBalloons = taskbarBalloonsToggle.checked;
				markDirty(win);
			});
		}

		const quickLaunchToggle = win.querySelector('#settings-quicklaunch-toggle');
		if (quickLaunchToggle) {
			quickLaunchToggle.addEventListener('change', () => {
				pendingSettings.quickLaunchVisible = quickLaunchToggle.checked;
				markDirty(win);
			});
		}

		const densitySelect = win.querySelector('#settings-taskbar-density');
		if (densitySelect) {
			densitySelect.value = pendingSettings.taskbarDensity;
			densitySelect.addEventListener('change', () => {
				pendingSettings.taskbarDensity = densitySelect.value;
				markDirty(win);
			});
		}

		const usernameInput = win.querySelector('#settings-username-input');
		if (usernameInput) {
			usernameInput.addEventListener('input', () => {
				pendingSettings.userName = usernameInput.value.trim() || 'Wartets';
				markDirty(win);
			});
		}

		const soundToggle = win.querySelector('#settings-sound-toggle');
		const volumeSlider = win.querySelector('#settings-volume-slider');
		const volumeVal = win.querySelector('#settings-volume-val');

		if (soundToggle) {
			soundToggle.addEventListener('change', () => {
				pendingSettings.soundEnabled = soundToggle.checked;
				markDirty(win);
			});
		}

		if (volumeSlider) {
			volumeSlider.addEventListener('input', () => {
				pendingSettings.soundVolume = parseFloat(volumeSlider.value);
				if (volumeVal) volumeVal.textContent = `${Math.round(pendingSettings.soundVolume * 100)}%`;
				markDirty(win);
			});
		}

		win.querySelectorAll('.sound-test-row button[data-sound]').forEach(btn => {
			btn.addEventListener('click', () => {
				const soundType = btn.dataset.sound;
				const oldVol = currentSettings.soundVolume;
				const oldSound = currentSettings.soundEnabled;
				currentSettings.soundEnabled = true;
				currentSettings.soundVolume = pendingSettings.soundVolume;
				SoundEngine.play(soundType);
				currentSettings.soundVolume = oldVol;
				currentSettings.soundEnabled = oldSound;
			});
		});

		const clippyToggle = win.querySelector('#settings-clippy-toggle');
		if (clippyToggle) {
			clippyToggle.addEventListener('change', () => {
				pendingSettings.clippyEnabled = clippyToggle.checked;
				markDirty(win);
			});
		}

		const dclickSlider = win.querySelector('#settings-dclick-slider');
		const dclickBox = win.querySelector('#settings-dclick-test-box');
		const dclickIcon = win.querySelector('#settings-dclick-icon');
		const dclickStatus = win.querySelector('#settings-dclick-status');
		let lastClickTime = 0;
		let isOpen = false;

		if (dclickSlider) {
			dclickSlider.addEventListener('input', () => {
				pendingSettings.doubleClickSpeed = parseInt(dclickSlider.value, 10);
				markDirty(win);
			});
		}

		if (dclickBox) {
			dclickBox.addEventListener('click', () => {
				const now = Date.now();
				const interval = now - lastClickTime;
				const threshold = pendingSettings.doubleClickSpeed || 400;

				if (interval <= threshold) {
					isOpen = !isOpen;
					dclickIcon.classList.toggle('popped', isOpen);
					dclickIcon.src = isOpen 
						? '../assets/images/desk/icons/Folder Open.webp' 
						: '../assets/images/desk/icons/Folder Closed.webp';
					if (dclickStatus) dclickStatus.textContent = isOpen ? 'Folder Opened! Double-click again to close.' : 'Folder Closed!';
					SoundEngine.play('click');
					lastClickTime = 0;
				} else {
					lastClickTime = now;
				}
			});
		}

		const hiddenToggle = win.querySelector('#settings-show-hidden');
		if (hiddenToggle) {
			hiddenToggle.addEventListener('change', () => {
				pendingSettings.showHiddenFiles = hiddenToggle.checked;
				markDirty(win);
			});
		}

		const exportBtn = win.querySelector('#settings-export-btn');
		if (exportBtn) {
			exportBtn.addEventListener('click', () => {
				const backupData = {
					settings: currentSettings,
					fileSystem: localStorage.getItem('fileSystem') || null,
					recycleBin: localStorage.getItem('recycleBinItems') || null,
					mailStore: localStorage.getItem('wartets_xp_mailstore_v1') || null,
					exportedAt: new Date().toISOString()
				};
				const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `wartets-xp-backup-${Date.now()}.json`;
				a.click();
				URL.revokeObjectURL(url);
				SoundEngine.play('asterisk');
			});
		}

		const importInput = win.querySelector('#settings-import-file');
		if (importInput) {
			importInput.addEventListener('change', (e) => {
				const file = e.target.files[0];
				if (!file) return;
				const reader = new FileReader();
				reader.onload = (event) => {
					try {
						const data = JSON.parse(event.target.result);
						if (data.settings) localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(data.settings));
						if (data.fileSystem) localStorage.setItem('fileSystem', data.fileSystem);
						if (data.recycleBin) localStorage.setItem('recycleBinItems', data.recycleBin);
						if (data.mailStore) localStorage.setItem('wartets_xp_mailstore_v1', data.mailStore);
						SoundEngine.play('startup');
						location.reload();
					} catch (err) {
						if (typeof showXPDialog === 'function') {
							showXPDialog('Import Error', 'Invalid configuration file format.', 'error');
						}
					}
				};
				reader.readAsText(file);
			});
		}

		updateStorageTabMetrics(win);

		const emptyTrashBtn = win.querySelector('#settings-empty-trash-btn');
		if (emptyTrashBtn) {
			emptyTrashBtn.addEventListener('click', () => {
				if (typeof fs !== 'undefined' && fs.emptyRecycleBin) {
					fs.emptyRecycleBin();
					SoundEngine.play('recycle');
					updateStorageTabMetrics(win);
					if (typeof refreshUI === 'function') refreshUI();
					if (typeof showXPDialog === 'function') {
						showXPDialog('Recycle Bin', 'The Recycle Bin has been emptied.', 'info');
					}
				}
			});
		}

		const resetSystemBtn = win.querySelector('#settings-reset-system-btn');
		if (resetSystemBtn) {
			resetSystemBtn.addEventListener('click', () => {
				if (typeof showXPDialog === 'function') {
					showXPDialog('Reset Personal Data', 'Are you sure you want to reset all personal files, mails and system preferences to defaults?', 'warning', {
						buttons: ['Yes', 'No'],
						callback: (res) => {
							if (res === 'Yes') {
								localStorage.clear();
								SoundEngine.play('startup');
								location.reload();
							}
						}
					});
				}
			});
		}

		const applyBtn = win.querySelector('#settings-btn-apply');
		const okBtn = win.querySelector('#settings-btn-ok');
		const cancelBtn = win.querySelector('#settings-btn-cancel');

		const commitChanges = () => {
			currentSettings = { ...pendingSettings };
			saveCurrentSettings();
			applyAllSettings();
			if (applyBtn) applyBtn.disabled = true;
			SoundEngine.play('click');
		};

		if (applyBtn) applyBtn.addEventListener('click', commitChanges);

		if (okBtn) {
			okBtn.addEventListener('click', () => {
				commitChanges();
				if (typeof closeWindow === 'function') closeWindow(win, windowId);
			});
		}

		if (cancelBtn) {
			cancelBtn.addEventListener('click', () => {
				pendingSettings = { ...currentSettings };
				if (typeof closeWindow === 'function') closeWindow(win, windowId);
			});
		}
	}

	loadSavedSettings();
	document.addEventListener('DOMContentLoaded', () => {
		applyAllSettings();
	});

	window.SettingsApp = {
		open: (tab = 'system') => openSettingsDialog(tab),
		get: (key) => currentSettings[key],
		set: (key, value) => {
			currentSettings[key] = value;
			pendingSettings[key] = value;
			saveCurrentSettings();
			applyAllSettings();
		},
		playSound: (type) => SoundEngine.play(type)
	};
})();
