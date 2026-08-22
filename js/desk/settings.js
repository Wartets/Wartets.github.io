(function () {
	const SETTINGS_STORAGE_KEY = 'xp_system_settings';

	let baseConfig = null;
	let currentSettings = null;
	let pendingSettings = null;
	let settingsReadyResolve = null;
	const settingsReadyPromise = new Promise(resolve => {
		settingsReadyResolve = resolve;
	});

	function buildDynamicAvatarPresets() {
		const iconMap = new Map();
		const configuredPresets = (currentSettings && Array.isArray(currentSettings.avatarPresets))
			? currentSettings.avatarPresets
			: ((baseConfig && Array.isArray(baseConfig.avatarPresets)) ? baseConfig.avatarPresets : []);

		configuredPresets.forEach(preset => {
			if (typeof preset === 'string') {
				const rawName = preset.split('/').pop().replace(/\.[^/.]+$/, '');
				const id = rawName.toLowerCase().replace(/[^\w-]/g, '-');
				iconMap.set(preset, { id, name: rawName, url: preset });
			} else if (preset && typeof preset === 'object' && preset.url) {
				iconMap.set(preset.url, preset);
			}
		});

		if (typeof fs !== 'undefined' && fs && fs.root) {
			const checkElement = (el) => {
				if (el.icon && typeof el.icon === 'string' && el.icon.includes('/icons/') && !iconMap.has(el.icon)) {
					const filename = el.icon.split('/').pop();
					const rawName = decodeURIComponent(filename).replace(/\.[^/.]+$/, '');
					iconMap.set(el.icon, {
						id: rawName.toLowerCase().replace(/[^\w-]/g, '-'),
						name: rawName,
						url: el.icon
					});
				}
				if (el.children && typeof el.children.values === 'function') {
					for (const child of el.children.values()) {
						checkElement(child);
					}
				}
			};
			checkElement(fs.root);
		}

		return Array.from(iconMap.values());
	}

	function haltSystemWithConfigError(errorMsg) {
		const screen = document.getElementById('boot-screen') || document.body;
		screen.innerHTML = `
			<div style="background-color: #000082; color: #ffffff; width: 100vw; height: 100vh; padding: 40px; box-sizing: border-box; font-family: 'Lucida Console', monospace; font-size: 14px; position: fixed; inset: 0; z-index: 9999999;">
				<p>*** STOP: 0x0000007B (INACCESSIBLE_CONFIG_INITIALIZATION_DEVICE)</p>
				<br>
				<p>A fatal initialization error occurred: Required system configuration 'data/desk-default-settings.json' could not be loaded.</p>
				<p>Details: ${errorMsg}</p>
				<br>
				<p>Check that the file exists and contains valid JSON configuration parameters.</p>
			</div>
		`;
	}

	function loadDefaultSettingsAsync() {
		fetch('../data/desk-default-settings.json')
			.then(r => {
				if (!r.ok) throw new Error(String(r.status));
				return r.json();
			})
			.then(data => {
				if (!data || typeof data !== 'object') throw new Error('Invalid JSON structure');
				baseConfig = data;
				loadSavedSettings();
				applyAllSettings();
				if (settingsReadyResolve) settingsReadyResolve(currentSettings);
			})
			.catch(() => {
				fetch('data/desk-default-settings.json')
					.then(r => {
						if (!r.ok) throw new Error(String(r.status));
						return r.json();
					})
					.then(data => {
						if (!data || typeof data !== 'object') throw new Error('Invalid JSON structure');
						baseConfig = data;
						loadSavedSettings();
						applyAllSettings();
						if (settingsReadyResolve) settingsReadyResolve(currentSettings);
					})
					.catch(fatalErr => {
						haltSystemWithConfigError(fatalErr.message || 'File not found');
					});
			});
	}

	loadDefaultSettingsAsync();


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

				const pitch = currentSettings.soundPitchMultiplier || 1.0;

				if (type === 'startup' || type === 'chord') {
					if (!currentSettings.soundEventStartup) return;
					const freqs = [311.13, 466.16, 622.25, 783.99, 932.33];
					freqs.forEach((f, idx) => {
						const osc = this.ctx.createOscillator();
						const g = this.ctx.createGain();
						osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
						osc.frequency.setValueAtTime(f * pitch, now + idx * 0.04);
						g.gain.setValueAtTime(0.001, now + idx * 0.04);
						g.gain.exponentialRampToValueAtTime(0.6, now + idx * 0.04 + 0.08);
						g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 1.2);
						osc.connect(g);
						g.connect(master);
						osc.start(now + idx * 0.04);
						osc.stop(now + idx * 0.04 + 1.25);
					});
				} else if (type === 'shutdown') {
					if (!currentSettings.soundEventShutdown) return;
					const freqs = [783.99, 622.25, 466.16, 311.13];
					freqs.forEach((f, idx) => {
						const osc = this.ctx.createOscillator();
						const g = this.ctx.createGain();
						osc.type = 'sine';
						osc.frequency.setValueAtTime(f * pitch, now + idx * 0.07);
						g.gain.setValueAtTime(0.001, now + idx * 0.07);
						g.gain.exponentialRampToValueAtTime(0.5, now + idx * 0.07 + 0.05);
						g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.9);
						osc.connect(g);
						g.connect(master);
						osc.start(now + idx * 0.07);
						osc.stop(now + idx * 0.07 + 0.95);
					});
				} else if (type === 'error' || type === 'bonk') {
					if (window.ClippySystemBridge && typeof window.ClippySystemBridge.recordTelemetryEvent === 'function') {
						window.ClippySystemBridge.recordTelemetryEvent('error_triggered');
					}
					if (!currentSettings.soundEventError) return;
					const osc = this.ctx.createOscillator();
					const g = this.ctx.createGain();
					osc.type = 'sawtooth';
					osc.frequency.setValueAtTime(160 * pitch, now);
					osc.frequency.exponentialRampToValueAtTime(80 * pitch, now + 0.18);
					g.gain.setValueAtTime(0.7, now);
					g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
					osc.connect(g);
					g.connect(master);
					osc.start(now);
					osc.stop(now + 0.22);
				} else if (type === 'asterisk' || type === 'info') {
					if (!currentSettings.soundEventAsterisk) return;
					const notes = [739.99, 1108.73];
					notes.forEach((f, i) => {
						const osc = this.ctx.createOscillator();
						const g = this.ctx.createGain();
						osc.type = 'sine';
						osc.frequency.setValueAtTime(f * pitch, now + i * 0.06);
						g.gain.setValueAtTime(0.4, now + i * 0.06);
						g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);
						osc.connect(g);
						g.connect(master);
						osc.start(now + i * 0.06);
						osc.stop(now + i * 0.06 + 0.38);
					});
				} else if (type === 'exclamation' || type === 'warning') {
					if (!currentSettings.soundEventExclamation) return;
					const notes = [587.33, 880.00];
					notes.forEach((f, i) => {
						const osc = this.ctx.createOscillator();
						const g = this.ctx.createGain();
						osc.type = 'triangle';
						osc.frequency.setValueAtTime(f * pitch, now + i * 0.08);
						g.gain.setValueAtTime(0.5, now + i * 0.08);
						g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
						osc.connect(g);
						g.connect(master);
						osc.start(now + i * 0.08);
						osc.stop(now + i * 0.08 + 0.42);
					});
				} else if (type === 'question') {
					if (!currentSettings.soundEventQuestion) return;
					const notes = [523.25, 783.99];
					notes.forEach((f, i) => {
						const osc = this.ctx.createOscillator();
						const g = this.ctx.createGain();
						osc.type = 'sine';
						osc.frequency.setValueAtTime(f * pitch, now + i * 0.07);
						g.gain.setValueAtTime(0.4, now + i * 0.07);
						g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.45);
						osc.connect(g);
						g.connect(master);
						osc.start(now + i * 0.07);
						osc.stop(now + i * 0.07 + 0.48);
					});
				} else if (type === 'click') {
					if (!currentSettings.soundEventClick) return;
					const osc = this.ctx.createOscillator();
					const g = this.ctx.createGain();
					osc.type = 'sine';
					osc.frequency.setValueAtTime(950 * pitch, now);
					osc.frequency.exponentialRampToValueAtTime(250 * pitch, now + 0.025);
					g.gain.setValueAtTime(0.3, now);
					g.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
					osc.connect(g);
					g.connect(master);
					osc.start(now);
					osc.stop(now + 0.03);
				} else if (type === 'recycle') {
					if (!currentSettings.soundEventRecycle) return;
					const osc = this.ctx.createOscillator();
					const g = this.ctx.createGain();
					osc.type = 'triangle';
					osc.frequency.setValueAtTime(320 * pitch, now);
					osc.frequency.exponentialRampToValueAtTime(60 * pitch, now + 0.28);
					g.gain.setValueAtTime(0.45, now);
					g.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
					osc.connect(g);
					g.connect(master);
					osc.start(now);
					osc.stop(now + 0.3);
				} else if (type === 'window') {
					if (!currentSettings.soundEventWindow) return;
					const osc = this.ctx.createOscillator();
					const g = this.ctx.createGain();
					osc.type = 'sine';
					osc.frequency.setValueAtTime(600 * pitch, now);
					osc.frequency.linearRampToValueAtTime(900 * pitch, now + 0.06);
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
		if (!baseConfig) return;
		try {
			const saved = window.DeskStorage ? window.DeskStorage.getItem(SETTINGS_STORAGE_KEY) : localStorage.getItem(SETTINGS_STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				currentSettings = Object.assign({}, baseConfig, parsed);
				if (baseConfig.screensaverSavers) {
					currentSettings.screensaverSavers = Object.assign({}, baseConfig.screensaverSavers, parsed.screensaverSavers || {});
				}
				if (baseConfig.trayConfig) {
					currentSettings.trayConfig = Object.assign({}, baseConfig.trayConfig, parsed.trayConfig || {});
				}
			} else {
				currentSettings = Object.assign({}, baseConfig);
			}
			const legacyHidden = window.DeskStorage ? window.DeskStorage.getItem('desktopShowHidden') : localStorage.getItem('desktopShowHidden');
			if (legacyHidden !== null) currentSettings.showHiddenFiles = legacyHidden === 'true';
			const legacyBg = window.DeskStorage ? window.DeskStorage.getItem('desktopBackground') : localStorage.getItem('desktopBackground');
			if (legacyBg) currentSettings.desktopBackground = legacyBg;
		} catch (e) {
			currentSettings = Object.assign({}, baseConfig);
		}
		pendingSettings = Object.assign({}, currentSettings);
	}

	function saveCurrentSettings() {
		try {
			const payload = JSON.stringify(currentSettings);
			if (window.DeskStorage) {
				window.DeskStorage.setItem(SETTINGS_STORAGE_KEY, payload);
				window.DeskStorage.setItem('desktopShowHidden', currentSettings.showHiddenFiles ? 'true' : 'false');
				window.DeskStorage.setItem('desktopBackground', currentSettings.desktopBackground);
			} else {
				localStorage.setItem(SETTINGS_STORAGE_KEY, payload);
				localStorage.setItem('desktopShowHidden', currentSettings.showHiddenFiles ? 'true' : 'false');
				localStorage.setItem('desktopBackground', currentSettings.desktopBackground);
			}
		} catch (e) {
			console.error('Failed to save settings:', e);
		}
	}

	function generateDisplacementMapURI(width = 256, height = 256) {
		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext('2d');
		const imgData = ctx.createImageData(width, height);
		const data = imgData.data;

		const cx = width / 2;
		const cy = height / 2;
		const maxR = Math.sqrt(cx * cx + cy * cy);

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const idx = (y * width + x) * 4;
				const nx = (x - cx) / cx;
				const ny = (y - cy) / cy;
				const r = Math.sqrt(nx * nx + ny * ny);
				const distortion = 1 + 0.35 * (r * r);

				const targetX = nx * distortion;
				const targetY = ny * distortion;

				const shiftX = (targetX - nx) * 0.5;
				const shiftY = (targetY - ny) * 0.5;

				const rVal = Math.min(255, Math.max(0, Math.round(128 + shiftX * 127)));
				const gVal = Math.min(255, Math.max(0, Math.round(128 + shiftY * 127)));

				data[idx] = rVal;
				data[idx + 1] = gVal;
				data[idx + 2] = 128;
				data[idx + 3] = 255;
			}
		}

		ctx.putImageData(imgData, 0, 0);
		return canvas.toDataURL();
	}

	function updateCRTFilters() {
		const displacementNode = document.getElementById('crt-displacement-node');
		const displacementImage = document.getElementById('crt-displacement-map-image');

		if (currentSettings.crtCurvatureEnabled && currentSettings.crtCurvatureAmount > 0) {
			document.body.classList.add('crt-curvature-active');
			document.body.style.setProperty('--crt-corner-radius', `${currentSettings.crtCornerRadius || 14}px`);
			document.body.style.setProperty('--crt-bezel-color', currentSettings.crtBezelColor || '#161616');

			if (displacementNode && displacementImage) {
				const scaleVal = Math.round(currentSettings.crtCurvatureAmount * 55);
				displacementNode.setAttribute('scale', String(scaleVal));
				if (!displacementImage.getAttribute('href') && !displacementImage.getAttribute('xlink:href')) {
					const uri = generateDisplacementMapURI();
					displacementImage.setAttribute('href', uri);
				}
				document.body.classList.toggle('crt-filter-applied', scaleVal > 0);
			}
		} else {
			document.body.classList.remove('crt-curvature-active', 'crt-filter-applied');
			if (displacementNode) displacementNode.setAttribute('scale', '0');
		}
	}

	function applyAllSettings() {
		if (!currentSettings || Object.keys(currentSettings).length === 0) {
			loadSavedSettings();
		}
		if (!currentSettings || !currentSettings.theme) return;

		document.body.classList.remove('theme-luna-blue', 'theme-royale', 'theme-silver', 'theme-olive', 'theme-classic', 'theme-zune', 'theme-noir', 'theme-matrix', 'theme-high-contrast');
		const themeClass = currentSettings.theme === 'default' ? 'theme-luna-blue' : (currentSettings.theme.startsWith('theme-') ? currentSettings.theme : `theme-${currentSettings.theme}`);
		document.body.classList.add(themeClass);

		document.body.classList.toggle('custom-colors-active', !!currentSettings.customColorsEnabled);
		if (currentSettings.customColorsEnabled) {
			document.body.style.setProperty('--xp-custom-active-title-1', currentSettings.customActiveTitle1 || '#0058ee');
			document.body.style.setProperty('--xp-custom-active-title-2', currentSettings.customActiveTitle2 || '#0057e5');
			document.body.style.setProperty('--xp-custom-inactive-title-1', currentSettings.customInactiveTitle1 || '#7697e7');
			document.body.style.setProperty('--xp-custom-inactive-title-2', currentSettings.customInactiveTitle2 || '#6882d9');
			document.body.style.setProperty('--xp-custom-title-text', currentSettings.customTitleText || '#ffffff');
			document.body.style.setProperty('--xp-custom-window-bg', currentSettings.customWindowBg || '#ece9d8');
			document.body.style.setProperty('--xp-custom-window-text', currentSettings.customWindowText || '#000000');
			document.body.style.setProperty('--xp-custom-selection-bg', currentSettings.customSelectionBg || '#316ac5');
			document.body.style.setProperty('--xp-custom-selection-text', currentSettings.customSelectionText || '#ffffff');
			document.body.style.setProperty('--xp-custom-border-color', currentSettings.customBorderColor || '#0055ea');
			document.body.style.setProperty('--xp-custom-taskbar-1', currentSettings.customTaskbar1 || '#245edc');
			document.body.style.setProperty('--xp-custom-taskbar-2', currentSettings.customTaskbar2 || '#1941a5');
			document.body.style.setProperty('--xp-custom-accent', currentSettings.customAccentColor || '#316ac5');
		}

		document.body.style.setProperty('--xp-window-radius', `${currentSettings.windowCornerRadius || 5}px`);
		document.body.style.setProperty('--xp-window-border-width', `${currentSettings.windowBorderWidth || 1}px`);
		document.body.style.setProperty('--xp-window-header-height', `${currentSettings.windowHeaderHeight || 30}px`);
		document.body.style.setProperty('--xp-window-header-align', currentSettings.windowHeaderAlign || 'left');
		document.body.style.setProperty('--xp-scrollbar-width', `${currentSettings.scrollbarWidth || 16}px`);
		document.body.style.setProperty('--xp-inactive-window-opacity', String(currentSettings.inactiveWindowOpacity || 1));

		document.body.classList.toggle('window-drag-translucent', !!currentSettings.windowDragTranslucent);

		document.body.classList.remove('font-roboto-mono', 'font-tahoma', 'font-trebuchet', 'font-sans', 'font-segoe', 'font-comic', 'font-courier', 'font-lucida', 'font-verdana', 'font-courier-prime', 'font-georgia', 'font-consolas');
		document.body.classList.add(`font-${currentSettings.fontFamily || 'roboto-mono'}`);

		document.body.classList.remove('font-scale-tiny', 'font-scale-small', 'font-scale-normal', 'font-scale-large', 'font-scale-xlarge', 'font-scale-huge');
		document.body.classList.add(`font-scale-${currentSettings.fontScale || 'normal'}`);
		document.body.classList.toggle('font-weight-bold', currentSettings.fontWeight === 'bold');
		document.body.classList.toggle('font-cleartype', !!currentSettings.fontClearType);

		document.body.classList.remove('line-height-compact', 'line-height-normal', 'line-height-relaxed');
		document.body.classList.add(`line-height-${currentSettings.fontLineHeight || 'normal'}`);

		document.body.classList.remove('text-render-precision', 'text-render-legibility');
		document.body.classList.add(currentSettings.textRenderingMode === 'geometricPrecision' ? 'text-render-precision' : 'text-render-legibility');

		const desktop = document.getElementById('desktop');
		if (desktop) {
			if (currentSettings.desktopBackgroundColor) {
				desktop.style.backgroundColor = currentSettings.desktopBackgroundColor;
			}
		}
		const fitMode = currentSettings.wallpaperFit || 'cover';
		document.body.classList.remove('wallpaper-fit-cover', 'wallpaper-fit-stretch', 'wallpaper-fit-center', 'wallpaper-fit-tile', 'wallpaper-fit-fit');
		document.body.classList.add(`wallpaper-fit-${fitMode}`);

		if (typeof applyInitialDesktopBackground === 'function') {
			applyInitialDesktopBackground();
		}

		document.body.classList.remove('icon-size-mini', 'icon-size-small', 'icon-size-normal', 'icon-size-large', 'icon-size-xlarge');
		document.body.classList.add(`icon-size-${currentSettings.iconSize || 'normal'}`);
		document.body.style.setProperty('--xp-icon-label-color', currentSettings.iconLabelColor || '#ffffff');
		document.body.style.setProperty('--xp-icon-label-bg', currentSettings.iconLabelBgColor || 'transparent');
		document.body.style.setProperty('--xp-icon-label-shadow', currentSettings.iconLabelShadow ? '1px 1px 2px rgba(0, 0, 0, 0.8)' : 'none');
		document.body.style.setProperty('--xp-icon-label-align', currentSettings.iconLabelAlign || 'center');
		document.body.style.setProperty('--xp-icon-label-lines', String(currentSettings.iconLabelLines || 2));
		document.body.style.setProperty('--xp-selection-box-border', currentSettings.selectionBoxColor || '#316ac5');
		document.body.style.setProperty('--xp-selection-box-bg', currentSettings.selectionBoxColor ? `${currentSettings.selectionBoxColor}${Math.round((currentSettings.selectionBoxOpacity || 0.3) * 255).toString(16).padStart(2, '0')}` : 'rgba(49, 106, 197, 0.3)');

		document.body.classList.toggle('icon-no-shadow', !currentSettings.iconLabelShadow);
		document.body.classList.toggle('icon-label-bg', !!currentSettings.iconBackground);
		document.body.classList.toggle('single-click-mode', !!currentSettings.singleClickOpen);
		document.body.classList.toggle('desktop-icons-hidden', !currentSettings.showDesktopIcons);

		document.body.classList.remove('cursor-default', 'cursor-classic', 'cursor-precision', 'cursor-large', 'cursor-matrix', 'cursor-inverted');
		if (currentSettings.cursorScheme && currentSettings.cursorScheme !== 'default') {
			document.body.classList.add(`cursor-${currentSettings.cursorScheme}`);
		}

		const scanlinesOverlay = document.getElementById('scanlines-overlay');
		if (scanlinesOverlay) {
			scanlinesOverlay.style.display = currentSettings.scanlinesEnabled ? 'block' : 'none';
			scanlinesOverlay.style.opacity = currentSettings.scanlinesIntensity;
		}
		document.body.classList.remove('scanlines-fine', 'scanlines-coarse', 'scanlines-speed-slow', 'scanlines-speed-fast', 'scanlines-speed-off');
		if (currentSettings.scanlinesDensity === 'fine') document.body.classList.add('scanlines-fine');
		if (currentSettings.scanlinesDensity === 'coarse') document.body.classList.add('scanlines-coarse');
		if (currentSettings.scanlinesSpeed === 'slow') document.body.classList.add('scanlines-speed-slow');
		if (currentSettings.scanlinesSpeed === 'fast') document.body.classList.add('scanlines-speed-fast');
		if (currentSettings.scanlinesSpeed === 'off') document.body.classList.add('scanlines-speed-off');

		if (desktop) {
			desktop.classList.toggle('crt-effect', !!currentSettings.vignetteEnabled);
		}
		document.body.classList.toggle('crt-flicker', !!currentSettings.crtFlicker);
		document.body.classList.toggle('crt-noise-active', !!currentSettings.crtNoise);
		document.body.classList.remove('crt-monochrome-green', 'crt-monochrome-amber', 'crt-monochrome-cyan', 'crt-monochrome-white');
		if (currentSettings.crtMonochrome === 'green') document.body.classList.add('crt-monochrome-green');
		if (currentSettings.crtMonochrome === 'amber') document.body.classList.add('crt-monochrome-amber');
		if (currentSettings.crtMonochrome === 'cyan') document.body.classList.add('crt-monochrome-cyan');
		if (currentSettings.crtMonochrome === 'white') document.body.classList.add('crt-monochrome-white');
		document.body.classList.toggle('crt-bloom', !!currentSettings.crtBloom);

		document.body.classList.remove('crt-aspect-4-3', 'crt-res-1024x768', 'crt-res-800x600', 'crt-res-640x480', 'crt-res-1280x1024', 'crt-res-1600x1200');
		if (currentSettings.crtAspectRatio === '4-3-auto') {
			document.body.classList.add('crt-aspect-4-3');
		} else if (currentSettings.crtAspectRatio === '1024x768') {
			document.body.classList.add('crt-res-1024x768');
		} else if (currentSettings.crtAspectRatio === '800x600') {
			document.body.classList.add('crt-res-800x600');
		} else if (currentSettings.crtAspectRatio === '640x480') {
			document.body.classList.add('crt-res-640x480');
		} else if (currentSettings.crtAspectRatio === '1280x1024') {
			document.body.classList.add('crt-res-1280x1024');
		} else if (currentSettings.crtAspectRatio === '1600x1200') {
			document.body.classList.add('crt-res-1600x1200');
		}

		updateCRTFilters();

		document.body.classList.toggle('no-window-animations', !currentSettings.windowAnimations);
		document.body.classList.remove('anim-instant', 'anim-fast', 'anim-normal', 'anim-slow', 'anim-cinematic');
		document.body.classList.add(`anim-${currentSettings.animationSpeed || 'normal'}`);

		document.body.classList.remove('anim-style-zoom', 'anim-style-fade', 'anim-style-glide');
		document.body.classList.add(`anim-style-${currentSettings.animationStyle || 'zoom'}`);

		document.body.classList.toggle('window-shadows-disabled', !currentSettings.windowShadows);

		document.body.classList.remove('taskbar-position-top');
		if (currentSettings.taskbarPosition === 'top') {
			document.body.classList.add('taskbar-position-top');
		}

		const taskbar = document.getElementById('taskbar');
		if (taskbar) {
			taskbar.style.opacity = currentSettings.taskbarOpacity !== undefined ? currentSettings.taskbarOpacity : 1.0;
		}

		document.body.style.setProperty('--xp-taskbar-btn-min-width', `${currentSettings.taskbarBtnMinWidth || 36}px`);
		document.body.style.setProperty('--xp-taskbar-btn-max-width', `${currentSettings.taskbarBtnMaxWidth || 155}px`);

		const startBtnText = document.querySelector('.xp-start-text');
		if (startBtnText) {
			startBtnText.textContent = currentSettings.startButtonText || 'start';
		}

		const clippyIcon = document.getElementById('clippy-taskbar-icon') || document.getElementById('tray-clippy-btn');
		if (clippyIcon) {
			clippyIcon.style.display = currentSettings.clippyEnabled ? 'inline-flex' : 'none';
		}

		const quickLaunchBar = document.getElementById('quick-launch-bar');
		if (quickLaunchBar) {
			quickLaunchBar.style.display = currentSettings.quickLaunchVisible ? 'flex' : 'none';
		}

		document.body.classList.toggle('taskbar-locked', !!currentSettings.taskbarLocked);
		document.body.classList.toggle('taskbar-autohide', !!currentSettings.taskbarAutoHide);

		document.body.classList.remove('taskbar-size-mini', 'taskbar-size-small', 'taskbar-size-medium', 'taskbar-size-large', 'taskbar-size-xlarge');
		document.body.classList.add(`taskbar-size-${currentSettings.taskbarSize || 'medium'}`);

		const profileNameEl = document.getElementById('start-menu-username-text') || document.querySelector('.start-menu-profile span');
		if (profileNameEl && currentSettings.userName) {
			profileNameEl.textContent = currentSettings.userName;
		}
		const welcomeNameEl = document.querySelector('.welcome-username');
		if (welcomeNameEl && currentSettings.userName) {
			welcomeNameEl.textContent = currentSettings.userName;
		}

		const profileImg = document.getElementById('start-menu-avatar-img') || document.querySelector('.start-menu-profile img');
		if (profileImg && currentSettings.userAvatar) {
			profileImg.src = currentSettings.userAvatar;
		}
		const welcomeImg = document.querySelector('#login-user img');
		if (welcomeImg && currentSettings.userAvatar) {
			welcomeImg.src = currentSettings.userAvatar;
		}

		const avatarFrame = document.querySelector('.xp-start-user-frame');
		if (avatarFrame) {
			avatarFrame.classList.remove('xp-start-avatar-round', 'xp-start-avatar-circle', 'xp-start-avatar-square');
			if (currentSettings.userAvatarShape === 'circle') avatarFrame.classList.add('xp-start-avatar-circle');
			else if (currentSettings.userAvatarShape === 'round') avatarFrame.classList.add('xp-start-avatar-round');
			else avatarFrame.classList.add('xp-start-avatar-square');
		}

		document.body.classList.toggle('start-search-hidden', !currentSettings.startMenuSearchVisible);

		if (typeof refreshUI === 'function' && typeof fs !== 'undefined' && fs && fs.root) {
			refreshUI();
		}
		if (window.StartMenu && typeof window.StartMenu.updateProfile === 'function') {
			window.StartMenu.updateProfile();
			window.StartMenu.updateLiveBadges();
		}
		if (window.Taskbar && typeof window.Taskbar.renderSystemTray === 'function') {
			window.Taskbar.renderSystemTray();
		}
		if (window.Taskbar && typeof window.Taskbar.updateDensity === 'function') {
			window.Taskbar.updateDensity();
		}
		if (window.WindowManager && typeof window.WindowManager.clampAllWindowsToWorkspace === 'function') {
			window.WindowManager.clampAllWindowsToWorkspace();
		}
		if (typeof arrangeIcons === 'function') {
			arrangeIcons('none');
		}
	}

	function calculateStorageUsage() {
		if (window.DeskStorage && typeof window.DeskStorage.calculateUsage === 'function') {
			return window.DeskStorage.calculateUsage();
		}
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

	function openSettingsDialog(defaultTab = 'system', options = {}) {
		const id = 'window-control-panel-properties';
		const existing = document.getElementById(id);
		if (existing) {
			if (typeof bringWindowToFront === 'function') bringWindowToFront(existing);
			if (existing.classList.contains('minimized') && typeof unminimizeWindow === 'function') {
				unminimizeWindow(existing);
			}
			switchTab(existing, defaultTab);
			return existing;
		}

		pendingSettings = { ...currentSettings };

		const contentHTML = `
			<div class="xp-tabs-container">
				<div class="xp-tabs-bar">
					<button type="button" class="xp-tab-btn" data-tab="system">General</button>
					<button type="button" class="xp-tab-btn" data-tab="desktop">Desktop & Icons</button>
					<button type="button" class="xp-tab-btn" data-tab="screensaver">Screen Saver</button>
					<button type="button" class="xp-tab-btn" data-tab="appearance">Colors & Style</button>
					<button type="button" class="xp-tab-btn" data-tab="typography">Typography</button>
					<button type="button" class="xp-tab-btn" data-tab="effects">CRT & Shaders</button>
					<button type="button" class="xp-tab-btn" data-tab="animations">Animations</button>
					<button type="button" class="xp-tab-btn" data-tab="taskbar">Taskbar & Start</button>
					<button type="button" class="xp-tab-btn" data-tab="audio">Audio Synthesizer</button>
					<button type="button" class="xp-tab-btn" data-tab="input">Mouse & Navigation</button>
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
								<label for="settings-username-input" style="width: 110px;">User Name:</label>
								<input type="text" id="settings-username-input" class="xp-input" value="${pendingSettings.userName}" style="flex: 1;">
							</div>
							<div class="xp-form-row">
								<label for="settings-userjob-input" style="width: 110px;">Title / Role:</label>
								<input type="text" id="settings-userjob-input" class="xp-input" value="${pendingSettings.userJobTitle || ''}" style="flex: 1;">
							</div>
							<div class="xp-form-row" style="margin-top: 4px;">
								<label for="settings-avatar-shape" style="width: 110px;">Frame Shape:</label>
								<select id="settings-avatar-shape" class="xp-select" style="flex: 1;">
									<option value="square">Square (Classic Windows XP)</option>
									<option value="round">Rounded Rectangle</option>
									<option value="circle">Circular Portrait</option>
								</select>
							</div>
							<div style="font-size: 11px; margin: 6px 0 4px 0;">User Account Picture:</div>
							<div class="xp-avatar-grid" id="settings-avatar-grid"></div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Start Button & Boot Logo Selection</legend>
							<div class="xp-form-row">
								<label for="settings-startbtn-caption" style="width: 130px;">Start Button Text:</label>
								<input type="text" id="settings-startbtn-caption" class="xp-input" value="${pendingSettings.startButtonText || 'start'}" style="flex: 1;">
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-boot-logo-select" style="width: 130px;">Boot Screen Logo:</label>
								<select id="settings-boot-logo-select" class="xp-select" style="flex: 1;">
									<option value="default" ${(pendingSettings.bootLogoPreset || 'default') === 'default' ? 'selected' : ''}>Windows XP Standard Edition</option>
									<option value="pro" ${pendingSettings.bootLogoPreset === 'pro' ? 'selected' : ''}>Windows XP Professional Edition</option>
									<option value="win2000" ${pendingSettings.bootLogoPreset === 'win2000' ? 'selected' : ''}>Windows 2000 Professional</option>
								</select>
							</div>
							<div class="xp-checkbox-row" style="margin-top: 6px;">
								<input type="checkbox" id="settings-skip-boot" ${pendingSettings.skipBootScreen ? 'checked' : ''}>
								<label for="settings-skip-boot">Fast boot (skip startup boot logo screen)</label>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Milestones & Quest Notifications</legend>
							<div class="xp-checkbox-row">
								<input type="checkbox" id="settings-ach-notifications-toggle" ${pendingSettings.achievementNotificationsEnabled !== false ? 'checked' : ''}>
								<label for="settings-ach-notifications-toggle">Display achievement unlock notification banners</label>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-ach-position-select" style="width: 140px;">Banner Placement:</label>
								<select id="settings-ach-position-select" class="xp-select" style="flex: 1;">
									<option value="top-left" ${(pendingSettings.achievementNotificationPosition || 'top-left') === 'top-left' ? 'selected' : ''}>Top Left Corner</option>
									<option value="top-right" ${pendingSettings.achievementNotificationPosition === 'top-right' ? 'selected' : ''}>Top Right Corner</option>
									<option value="bottom-left" ${pendingSettings.achievementNotificationPosition === 'bottom-left' ? 'selected' : ''}>Bottom Left Corner</option>
									<option value="bottom-right" ${pendingSettings.achievementNotificationPosition === 'bottom-right' ? 'selected' : ''}>Bottom Right Corner</option>
								</select>
							</div>
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
								<button type="button" class="xp-button-small" id="settings-reset-achievements-btn">Reset Trophies</button>
								<button type="button" class="xp-button-small" id="settings-empty-trash-btn">Empty Trash</button>
								<button type="button" class="xp-button-small" id="settings-reset-system-btn" style="color: #b00;">Reset Desktop</button>
							</div>
						</fieldset>
					</div>

					<div class="xp-tab-page" data-page="desktop">
						<div class="wallpaper-monitor-container" style="margin-bottom: 8px;">
							<div class="wallpaper-monitor-bezel">
								<div class="wallpaper-monitor-screen" id="settings-monitor-screen" style="background-image: ${pendingSettings.wallpaperMode === 'color' ? 'none' : `url('${pendingSettings.desktopBackground}')`}; background-color: ${pendingSettings.desktopBackgroundColor || '#004e98'};"></div>
							</div>
							<div class="wallpaper-monitor-stand"></div>
							<div class="wallpaper-monitor-base"></div>
						</div>
						<fieldset class="xp-groupbox">
							<legend>Background Picture & Color</legend>
							<div class="xp-form-row" style="margin-bottom: 6px;">
								<label for="settings-wallpaper-mode-select" style="width: 110px;">Display Mode:</label>
								<select id="settings-wallpaper-mode-select" class="xp-select" style="flex: 1;">
									<option value="picture" ${(pendingSettings.wallpaperMode || 'picture') === 'picture' ? 'selected' : ''}>Single Picture</option>
									<option value="slideshow" ${pendingSettings.wallpaperMode === 'slideshow' ? 'selected' : ''}>Wallpaper Slideshow</option>
									<option value="color" ${pendingSettings.wallpaperMode === 'color' ? 'selected' : ''}>Solid Background Color</option>
								</select>
							</div>
							<div style="display: flex; gap: 8px; align-items: flex-start;">
								<div class="xp-listbox-frame" id="settings-wallpaper-listbox">
									<div class="xp-listbox-loading">Loading wallpaper catalog...</div>
								</div>
								<div style="display: flex; flex-direction: column; gap: 6px; width: 140px;">
									<button type="button" class="xp-button-small" id="settings-btn-restore-bliss">Default Bliss</button>
									<button type="button" class="xp-button-small" id="settings-btn-open-wp-folder">Open Wallpaper Folder</button>
									<label class="xp-button-small" style="cursor: pointer; text-align: center;">
										Upload Image
										<input type="file" id="settings-wallpaper-upload" accept="image/*" style="display: none;">
									</label>
									<div class="xp-form-row" style="flex-direction: column; align-items: flex-start; margin-top: 4px;">
										<label for="settings-wallpaper-fit" style="font-size: 10px;">Position:</label>
										<select id="settings-wallpaper-fit" class="xp-select" style="width: 100%;">
											<option value="cover" ${(pendingSettings.wallpaperFit || 'cover') === 'cover' ? 'selected' : ''}>Fill Screen (Cover)</option>
											<option value="fit" ${pendingSettings.wallpaperFit === 'fit' ? 'selected' : ''}>Fit to Screen (Keep Aspect)</option>
											<option value="stretch" ${pendingSettings.wallpaperFit === 'stretch' ? 'selected' : ''}>Stretch to Window</option>
											<option value="center" ${pendingSettings.wallpaperFit === 'center' ? 'selected' : ''}>Center</option>
											<option value="tile" ${pendingSettings.wallpaperFit === 'tile' ? 'selected' : ''}>Tile</option>
										</select>
									</div>
									<div class="xp-form-row" style="flex-direction: column; align-items: flex-start;">
										<label for="settings-bg-color-picker" style="font-size: 10px;">Color fill:</label>
										<input type="color" id="settings-bg-color-picker" value="${pendingSettings.desktopBackgroundColor || '#004e98'}" style="width: 100%; height: 22px; cursor: pointer;">
									</div>
								</div>
							</div>
							<div id="settings-slideshow-panel" style="margin-top: 8px; display: ${pendingSettings.wallpaperMode === 'slideshow' ? 'flex' : 'none'}; flex-direction: column; gap: 4px; border-top: 1px dashed #aca899; padding-top: 6px;">
								<div class="xp-form-row">
									<label for="settings-slideshow-interval" style="width: 130px;">Change picture every:</label>
									<select id="settings-slideshow-interval" class="xp-select" style="flex: 1;">
										<option value="10" ${String(pendingSettings.wallpaperSlideshowInterval || '30') === '10' ? 'selected' : ''}>10 seconds</option>
										<option value="30" ${String(pendingSettings.wallpaperSlideshowInterval || '30') === '30' ? 'selected' : ''}>30 seconds</option>
										<option value="60" ${String(pendingSettings.wallpaperSlideshowInterval || '30') === '60' ? 'selected' : ''}>1 minute</option>
										<option value="300" ${String(pendingSettings.wallpaperSlideshowInterval || '30') === '300' ? 'selected' : ''}>5 minutes</option>
										<option value="900" ${String(pendingSettings.wallpaperSlideshowInterval || '30') === '900' ? 'selected' : ''}>15 minutes</option>
										<option value="1800" ${String(pendingSettings.wallpaperSlideshowInterval || '30') === '1800' ? 'selected' : ''}>30 minutes</option>
										<option value="3600" ${String(pendingSettings.wallpaperSlideshowInterval || '30') === '3600' ? 'selected' : ''}>1 hour</option>
									</select>
								</div>
								<div class="xp-form-row">
									<label for="settings-wallpaper-transition" style="width: 130px;">Transition Effect:</label>
									<select id="settings-wallpaper-transition" class="xp-select" style="flex: 1;">
										<option value="none" ${(pendingSettings.wallpaperTransition || 'none') === 'none' ? 'selected' : ''}>None (Instant Cut)</option>
										<option value="fade" ${pendingSettings.wallpaperTransition === 'fade' ? 'selected' : ''}>Crossfade</option>
										<option value="slide-left" ${pendingSettings.wallpaperTransition === 'slide-left' ? 'selected' : ''}>Slide Left</option>
										<option value="slide-right" ${pendingSettings.wallpaperTransition === 'slide-right' ? 'selected' : ''}>Slide Right</option>
										<option value="slide-up" ${pendingSettings.wallpaperTransition === 'slide-up' ? 'selected' : ''}>Slide Up</option>
										<option value="slide-down" ${pendingSettings.wallpaperTransition === 'slide-down' ? 'selected' : ''}>Slide Down</option>
										<option value="zoom-in" ${pendingSettings.wallpaperTransition === 'zoom-in' ? 'selected' : ''}>Zoom In</option>
										<option value="zoom-out" ${pendingSettings.wallpaperTransition === 'zoom-out' ? 'selected' : ''}>Zoom Out</option>
										<option value="rotate" ${pendingSettings.wallpaperTransition === 'rotate' ? 'selected' : ''}>Rotate & Zoom</option>
									</select>
								</div>
								<div class="xp-form-row">
									<label for="settings-wallpaper-trans-duration" style="width: 130px;">Transition Duration:</label>
									<select id="settings-wallpaper-trans-duration" class="xp-select" style="flex: 1;">
										<option value="0.5" ${String(pendingSettings.wallpaperTransitionDuration || '1.0') === '0.5' ? 'selected' : ''}>0.5 seconds</option>
										<option value="1.0" ${String(pendingSettings.wallpaperTransitionDuration || '1.0') === '1.0' ? 'selected' : ''}>1.0 second (Standard)</option>
										<option value="1.5" ${String(pendingSettings.wallpaperTransitionDuration || '1.0') === '1.5' ? 'selected' : ''}>1.5 seconds</option>
										<option value="2.0" ${String(pendingSettings.wallpaperTransitionDuration || '1.0') === '2.0' ? 'selected' : ''}>2.0 seconds (Slow)</option>
									</select>
								</div>
								<div class="xp-checkbox-row">
									<input type="checkbox" id="settings-slideshow-random" ${pendingSettings.wallpaperSlideshowRandom ? 'checked' : ''}>
									<label for="settings-slideshow-random">Shuffle pictures randomly</label>
								</div>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Desktop Grid Flow & Alignment</legend>
							<div class="xp-form-row">
								<label for="settings-grid-direction" style="width: 120px;">Flow Direction:</label>
								<select id="settings-grid-direction" class="xp-select" style="flex: 1;">
									<option value="top-to-bottom" ${(pendingSettings.desktopGridDirection || 'top-to-bottom') === 'top-to-bottom' ? 'selected' : ''}>Top to Bottom (Columns)</option>
									<option value="left-to-right" ${pendingSettings.desktopGridDirection === 'left-to-right' ? 'selected' : ''}>Left to Right (Rows)</option>
								</select>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-grid-origin" style="width: 120px;">Grid Corner Origin:</label>
								<select id="settings-grid-origin" class="xp-select" style="flex: 1;">
									<option value="top-left" ${(pendingSettings.desktopGridOrigin || 'top-left') === 'top-left' ? 'selected' : ''}>Top-Left Corner</option>
									<option value="top-right" ${pendingSettings.desktopGridOrigin === 'top-right' ? 'selected' : ''}>Top-Right Corner</option>
									<option value="bottom-left" ${pendingSettings.desktopGridOrigin === 'bottom-left' ? 'selected' : ''}>Bottom-Left Corner</option>
									<option value="bottom-right" ${pendingSettings.desktopGridOrigin === 'bottom-right' ? 'selected' : ''}>Bottom-Right Corner</option>
								</select>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Desktop Icons & Label Styling</legend>
							<div class="xp-checkbox-row">
								<input type="checkbox" id="settings-show-desktop-icons" ${pendingSettings.showDesktopIcons ? 'checked' : ''}>
								<label for="settings-show-desktop-icons">Show icons on the desktop</label>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-icon-size" style="width: 120px;">Icon Size:</label>
								<select id="settings-icon-size" class="xp-select" style="flex: 1;">
									<option value="mini">Mini (24x24)</option>
									<option value="small">Small (32x32)</option>
									<option value="normal">Normal (48x48)</option>
									<option value="large">Large (64x64)</option>
									<option value="xlarge">Extra Large (72x72)</option>
								</select>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-icon-label-color" style="width: 120px;">Label Text Color:</label>
								<input type="color" id="settings-icon-label-color" value="${pendingSettings.iconLabelColor || '#ffffff'}" style="width: 48px; height: 22px; cursor: pointer;">
								<span style="font-size: 10px; color: #555; margin-left: 8px;">Custom color for desktop icon captions</span>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-icon-label-align" style="width: 120px;">Label Alignment:</label>
								<select id="settings-icon-label-align" class="xp-select" style="flex: 1;">
									<option value="center">Center</option>
									<option value="left">Left Aligned</option>
								</select>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-icon-label-lines" style="width: 120px;">Max Title Lines:</label>
								<select id="settings-icon-label-lines" class="xp-select" style="flex: 1;">
									<option value="1">1 Line (Truncated)</option>
									<option value="2">2 Lines (Standard)</option>
									<option value="3">3 Lines (Extended)</option>
									<option value="6">Unlimited Full Names</option>
								</select>
							</div>
							<div class="xp-checkbox-row" style="margin-top: 6px;">
								<input type="checkbox" id="settings-icon-shadow" ${pendingSettings.iconLabelShadow ? 'checked' : ''}>
								<label for="settings-icon-shadow">Drop shadows for icon labels</label>
							</div>
							<div class="xp-checkbox-row" style="margin-top: 4px;">
								<input type="checkbox" id="settings-icon-box" ${pendingSettings.iconBackground ? 'checked' : ''}>
								<label for="settings-icon-box">Display shaded background box behind icon labels</label>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Desktop Selection Box</legend>
							<div class="xp-form-row">
								<label for="settings-selbox-color" style="width: 120px;">Selection Tint:</label>
								<input type="color" id="settings-selbox-color" value="${pendingSettings.selectionBoxColor || '#316ac5'}" style="width: 48px; height: 22px; cursor: pointer;">
								<label for="settings-selbox-opacity" style="margin-left: 12px; font-size: 11px;">Opacity:</label>
								<input type="range" id="settings-selbox-opacity" min="0.1" max="0.8" step="0.05" value="${pendingSettings.selectionBoxOpacity || 0.3}" class="xp-slider" style="flex: 1;">
							</div>
						</fieldset>
					</div>

					<div class="xp-tab-page" data-page="screensaver">
						<div class="wallpaper-monitor-container" style="margin-bottom: 6px;">
							<div class="wallpaper-monitor-bezel">
								<canvas id="settings-ss-monitor-canvas" class="wallpaper-monitor-screen" width="126" height="91" style="width:100%;height:100%;display:block;background:#000000;"></canvas>
							</div>
							<div class="wallpaper-monitor-stand"></div>
							<div class="wallpaper-monitor-base"></div>
						</div>

						<fieldset class="xp-groupbox">
							<legend>Screen Saver</legend>
							<div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
								<select id="settings-ss-select" class="xp-select" style="flex: 1;">
									<option value="xp-flying-logo" ${(pendingSettings.screensaverActive || 'xp-flying-logo') === 'xp-flying-logo' ? 'selected' : ''}>3D Flying Windows XP Logo</option>
									<option value="bubbles" ${pendingSettings.screensaverActive === 'bubbles' ? 'selected' : ''}>Bubbles (Bulles Physiques 3D)</option>
									<option value="starfield" ${pendingSettings.screensaverActive === 'starfield' ? 'selected' : ''}>Starfield Simulation</option>
									<option value="pipes" ${pendingSettings.screensaverActive === 'pipes' ? 'selected' : ''}>3D Pipes (Tubes 3D)</option>
									<option value="mystify" ${pendingSettings.screensaverActive === 'mystify' ? 'selected' : ''}>Mystify (Polygones)</option>
									<option value="bezier" ${pendingSettings.screensaverActive === 'bezier' ? 'selected' : ''}>Bouncing Curves (Bézier)</option>
									<option value="blank" ${pendingSettings.screensaverActive === 'blank' ? 'selected' : ''}>Blank Screen</option>
									<option value="random" ${pendingSettings.screensaverActive === 'random' ? 'selected' : ''}>Random (Au hasard)</option>
									<option value="none" ${pendingSettings.screensaverActive === 'none' ? 'selected' : ''}>(None)</option>
								</select>
								<button type="button" class="xp-button-small" id="settings-ss-btn-preview" ${pendingSettings.screensaverActive === 'none' ? 'disabled' : ''}>Preview</button>
							</div>
							<div class="xp-form-row">
								<label for="settings-ss-wait-input" style="width: 50px;">Wait:</label>
								<input type="number" id="settings-ss-wait-input" min="0.1" max="120" step="0.5" value="${pendingSettings.screensaverTimeoutMinutes !== undefined ? pendingSettings.screensaverTimeoutMinutes : 5}" class="xp-input" style="width: 60px;">
								<span>minutes</span>
							</div>
							<div id="settings-ss-custom-panel" class="ss-dynamic-config-panel"></div>
						</fieldset>
					</div>

					<div class="xp-tab-page" data-page="appearance">
						<div class="theme-preview-box" id="settings-theme-preview">
							<div class="theme-preview-titlebar" id="settings-theme-preview-title">Active Window Title</div>
							<div class="theme-preview-body">
								<button class="xp-button-small" type="button">OK</button>
								<span>Sample Windows XP Content</span>
							</div>
						</div>

						<fieldset class="xp-groupbox">
							<legend>Windows and Buttons Style</legend>
							<div class="xp-form-row">
								<label for="settings-theme-select" style="width: 120px;">Preset Scheme:</label>
								<select id="settings-theme-select" class="xp-select" style="flex: 1;">
									<option value="luna-blue">Windows XP style (Luna Blue)</option>
									<option value="royale">Windows Royale (Energy Blue)</option>
									<option value="silver">Windows XP (Metallic Silver)</option>
									<option value="olive">Windows XP (Olive Green)</option>
									<option value="classic">Windows Classic (98/2000)</option>
									<option value="zune">Zune / Noir (Dark Orange)</option>
									<option value="noir">Windows XP Media Center (Royale Noir)</option>
									<option value="matrix">Matrix Terminal (Green Phosphor)</option>
									<option value="high-contrast">High Contrast Black & White</option>
								</select>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Advanced Custom Color Overrides</legend>
							<div class="xp-checkbox-row">
								<input type="checkbox" id="settings-custom-colors-toggle" ${pendingSettings.customColorsEnabled ? 'checked' : ''}>
								<label for="settings-custom-colors-toggle"><strong>Enable custom palette overrides</strong></label>
							</div>
							<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-top: 8px;">
								<div class="xp-form-row">
									<label for="settings-color-active-title1" style="width: 110px;">Titlebar Top:</label>
									<input type="color" id="settings-color-active-title1" value="${pendingSettings.customActiveTitle1 || '#0058ee'}" style="width: 38px; height: 22px;">
								</div>
								<div class="xp-form-row">
									<label for="settings-color-active-title2" style="width: 110px;">Titlebar Bottom:</label>
									<input type="color" id="settings-color-active-title2" value="${pendingSettings.customActiveTitle2 || '#0057e5'}" style="width: 38px; height: 22px;">
								</div>
								<div class="xp-form-row">
									<label for="settings-color-inactive-title1" style="width: 110px;">Inactive Top:</label>
									<input type="color" id="settings-color-inactive-title1" value="${pendingSettings.customInactiveTitle1 || '#7697e7'}" style="width: 38px; height: 22px;">
								</div>
								<div class="xp-form-row">
									<label for="settings-color-inactive-title2" style="width: 110px;">Inactive Bottom:</label>
									<input type="color" id="settings-color-inactive-title2" value="${pendingSettings.customInactiveTitle2 || '#6882d9'}" style="width: 38px; height: 22px;">
								</div>
								<div class="xp-form-row">
									<label for="settings-color-window-bg" style="width: 110px;">Window Body:</label>
									<input type="color" id="settings-color-window-bg" value="${pendingSettings.customWindowBg || '#ece9d8'}" style="width: 38px; height: 22px;">
								</div>
								<div class="xp-form-row">
									<label for="settings-color-window-text" style="width: 110px;">Window Text:</label>
									<input type="color" id="settings-color-window-text" value="${pendingSettings.customWindowText || '#000000'}" style="width: 38px; height: 22px;">
								</div>
								<div class="xp-form-row">
									<label for="settings-color-selection-bg" style="width: 110px;">Selection Color:</label>
									<input type="color" id="settings-color-selection-bg" value="${pendingSettings.customSelectionBg || '#316ac5'}" style="width: 38px; height: 22px;">
								</div>
								<div class="xp-form-row">
									<label for="settings-color-border" style="width: 110px;">Window Border:</label>
									<input type="color" id="settings-color-border" value="${pendingSettings.customBorderColor || '#0055ea'}" style="width: 38px; height: 22px;">
								</div>
								<div class="xp-form-row">
									<label for="settings-color-taskbar1" style="width: 110px;">Taskbar Top:</label>
									<input type="color" id="settings-color-taskbar1" value="${pendingSettings.customTaskbar1 || '#245edc'}" style="width: 38px; height: 22px;">
								</div>
								<div class="xp-form-row">
									<label for="settings-color-taskbar2" style="width: 110px;">Taskbar Bottom:</label>
									<input type="color" id="settings-color-taskbar2" value="${pendingSettings.customTaskbar2 || '#1941a5'}" style="width: 38px; height: 22px;">
								</div>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Window Geometry & Dimensions</legend>
							<div class="xp-form-row">
								<label for="settings-corner-radius-select" style="width: 130px;">Corner Radius:</label>
								<select id="settings-corner-radius-select" class="xp-select" style="flex: 1;">
									<option value="0">0px (Sharp Classic 95/98)</option>
									<option value="3">3px (Subtle)</option>
									<option value="5">5px (Standard Windows XP)</option>
									<option value="8">8px (Modern Rounded)</option>
									<option value="12">12px (Smooth Bubble)</option>
								</select>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-border-width-select" style="width: 130px;">Border Width:</label>
								<select id="settings-border-width-select" class="xp-select" style="flex: 1;">
									<option value="1">1 Pixel (Standard XP)</option>
									<option value="2">2 Pixels (Thick)</option>
									<option value="3">3 Pixels (Chunky Retro)</option>
									<option value="4">4 Pixels (Heavy Bezel)</option>
								</select>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-header-height-slider" style="width: 130px;">Titlebar Height:</label>
								<input type="range" id="settings-header-height-slider" min="22" max="42" step="2" value="${pendingSettings.windowHeaderHeight || 30}" class="xp-slider">
								<span id="settings-header-height-val" style="font-size: 11px; width: 35px;">${pendingSettings.windowHeaderHeight || 30}px</span>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-header-align-select" style="width: 130px;">Title Alignment:</label>
								<select id="settings-header-align-select" class="xp-select" style="flex: 1;">
									<option value="left">Left Aligned</option>
									<option value="center">Centered</option>
									<option value="right">Right Aligned</option>
								</select>
							</div>
							<div class="xp-checkbox-row" style="margin-top: 6px;">
								<input type="checkbox" id="settings-window-shadows" ${pendingSettings.windowShadows ? 'checked' : ''}>
								<label for="settings-window-shadows">Display drop shadows under windows</label>
							</div>
						</fieldset>
					</div>

					<div class="xp-tab-page" data-page="typography">
						<fieldset class="xp-groupbox">
							<legend>Font Family Selection</legend>
							<div class="xp-form-row">
								<label for="settings-font-select" style="width: 120px;">Primary Font:</label>
								<select id="settings-font-select" class="xp-select" style="flex: 1;">
									<option value="roboto-mono">Roboto Mono (Terminal Tech)</option>
									<option value="tahoma">Tahoma (Original Windows XP)</option>
									<option value="trebuchet">Trebuchet MS (XP Titlebars)</option>
									<option value="segoe">Segoe UI (Windows 7/10)</option>
									<option value="verdana">Verdana (Classic Web)</option>
									<option value="courier">Courier New (Typewriter Monospace)</option>
									<option value="courier-prime">Courier Prime</option>
									<option value="lucida">Lucida Console (Classic CMD)</option>
									<option value="consolas">Consolas</option>
									<option value="georgia">Georgia Serif</option>
									<option value="sans">System Sans-Serif</option>
									<option value="comic">Comic Sans MS (Retro Whimsical)</option>
								</select>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Font Scaling & Weight</legend>
							<div class="xp-form-row">
								<label for="settings-font-scale" style="width: 120px;">Scale / DPI:</label>
								<select id="settings-font-scale" class="xp-select" style="flex: 1;">
									<option value="tiny">Tiny (75%)</option>
									<option value="small">Small (85%)</option>
									<option value="normal">Normal (100% Windows Standard)</option>
									<option value="large">Large Fonts (115%)</option>
									<option value="xlarge">Extra Large (130%)</option>
									<option value="huge">Accessibility High DPI (150%)</option>
								</select>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-font-weight" style="width: 120px;">Font Weight:</label>
								<select id="settings-font-weight" class="xp-select" style="flex: 1;">
									<option value="normal">Regular (Standard)</option>
									<option value="bold">Bold (Heavy Retro)</option>
								</select>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-font-line-height" style="width: 120px;">Line Spacing:</label>
								<select id="settings-font-line-height" class="xp-select" style="flex: 1;">
									<option value="compact">Compact (High Information Density)</option>
									<option value="normal">Standard (Normal)</option>
									<option value="relaxed">Relaxed (Easy Reading)</option>
								</select>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Text Rendering & Smoothing</legend>
							<div class="xp-checkbox-row">
								<input type="checkbox" id="settings-cleartype-toggle" ${pendingSettings.fontClearType ? 'checked' : ''}>
								<label for="settings-cleartype-toggle">Use ClearType sub-pixel font antialiasing</label>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-text-rendering-mode" style="width: 120px;">Rendering Engine:</label>
								<select id="settings-text-rendering-mode" class="xp-select" style="flex: 1;">
									<option value="optimizeLegibility">Optimize Legibility (Smooth Ligatures)</option>
									<option value="geometricPrecision">Geometric Precision (Pixel Sharp)</option>
								</select>
							</div>
						</fieldset>
					</div>

					<div class="xp-tab-page" data-page="effects">
						<div class="crt-preview-box">
							<div class="crt-preview-screen" id="settings-crt-screen-preview">
								<span>CRT MONITOR</span>
								<span style="font-size: 8px; opacity: 0.8;">Cathode Display</span>
							</div>
						</div>

						<fieldset class="xp-groupbox">
							<legend>CRT Monitor Aspect Ratio & Letterboxing</legend>
							<div class="xp-form-row">
								<label for="settings-aspect-ratio-select" style="width: 140px;">Screen Geometry:</label>
								<select id="settings-aspect-ratio-select" class="xp-select" style="flex: 1;">
									<option value="fullscreen">Full Viewport (Widescreen Stretch / Modern) [Default]</option>
									<option value="4-3-auto">4:3 Aspect Ratio (Responsive Pillarbox / Black Bars)</option>
									<option value="1600x1200">4:3 Ultra-Res (1600 x 1200 Pro Graphics)</option>
									<option value="1280x1024">5:4 Classic LCD (1280 x 1024 Workstation)</option>
									<option value="1024x768">4:3 Standard (1024 x 768 CRT Native)</option>
									<option value="800x600">4:3 SVGA (800 x 600 Retro)</option>
									<option value="640x480">4:3 VGA (640 x 480 Pure Vintage)</option>
								</select>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>CRT Glass Curvature & Barrel Distortion</legend>
							<div class="xp-checkbox-row">
								<input type="checkbox" id="settings-crt-curvature-toggle" ${pendingSettings.crtCurvatureEnabled ? 'checked' : ''}>
								<label for="settings-crt-curvature-toggle">Enable optical spherical CRT glass curvature and barrel distortion</label>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-curvature-slider" style="width: 140px;">Curvature Intensity:</label>
								<input type="range" id="settings-curvature-slider" min="0.05" max="0.5" step="0.02" value="${pendingSettings.crtCurvatureAmount}" class="xp-slider">
								<span id="settings-curvature-val" style="font-size: 11px; width: 35px;">${Math.round(pendingSettings.crtCurvatureAmount * 100)}%</span>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-corner-radius-slider" style="width: 140px;">Glass Corner Radius:</label>
								<input type="range" id="settings-corner-radius-slider" min="0" max="32" step="2" value="${pendingSettings.crtCornerRadius}" class="xp-slider">
								<span id="settings-corner-radius-val" style="font-size: 11px; width: 35px;">${pendingSettings.crtCornerRadius}px</span>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-bezel-color-select" style="width: 140px;">Bezel Enclosure:</label>
								<select id="settings-bezel-color-select" class="xp-select" style="flex: 1;">
									<option value="#161616">Charcoal Black (Sony Trinitron)</option>
									<option value="#d4cbba">Vintage Beige (IBM / Compaq)</option>
									<option value="#2a323d">Dark Slate (Dell UltraScan)</option>
								</select>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Phosphor Scanlines & Shaders</legend>
							<div class="xp-checkbox-row">
								<input type="checkbox" id="settings-scanlines-toggle" ${pendingSettings.scanlinesEnabled ? 'checked' : ''}>
								<label for="settings-scanlines-toggle">Enable scanlines overlay simulation</label>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-scanlines-slider" style="width: 140px;">Scanline Opacity:</label>
								<input type="range" id="settings-scanlines-slider" min="0.2" max="1" step="0.05" value="${pendingSettings.scanlinesIntensity}" class="xp-slider">
								<span id="settings-scanlines-val" style="font-size: 11px; width: 35px;">${Math.round(pendingSettings.scanlinesIntensity * 100)}%</span>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-scanlines-density" style="width: 140px;">Scanline Pitch:</label>
								<select id="settings-scanlines-density" class="xp-select" style="flex: 1;">
									<option value="fine">Fine Density (2px)</option>
									<option value="normal">Normal (5px)</option>
									<option value="coarse">Coarse TV Scanlines (8px)</option>
								</select>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-scanlines-speed" style="width: 140px;">Scanline Scroll:</label>
								<select id="settings-scanlines-speed" class="xp-select" style="flex: 1;">
									<option value="off">Static (No Motion)</option>
									<option value="slow">Slow Drift (35s)</option>
									<option value="normal">Standard (20s)</option>
									<option value="fast">Fast (8s)</option>
								</select>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-crt-monochrome-select" style="width: 140px;">Phosphor Tint:</label>
								<select id="settings-crt-monochrome-select" class="xp-select" style="flex: 1;">
									<option value="none">Standard Full Color RGB</option>
									<option value="green">Monochrome P1 Phosphor (Matrix Green)</option>
									<option value="amber">Monochrome P3 Phosphor (Vintage Amber)</option>
									<option value="cyan">Monochrome P4 Phosphor (Cool Cyan)</option>
									<option value="white">Paper White Monochrome (Black & White)</option>
								</select>
							</div>
							<div class="xp-checkbox-row" style="margin-top: 6px;">
								<input type="checkbox" id="settings-vignette-toggle" ${pendingSettings.vignetteEnabled ? 'checked' : ''}>
								<label for="settings-vignette-toggle">Simulate CRT screen edge vignette darkening</label>
							</div>
							<div class="xp-checkbox-row" style="margin-top: 4px;">
								<input type="checkbox" id="settings-crt-bloom-toggle" ${pendingSettings.crtBloom ? 'checked' : ''}>
								<label for="settings-crt-bloom-toggle">Enable phosphor bloom and cathode glow</label>
							</div>
							<div class="xp-checkbox-row" style="margin-top: 4px;">
								<input type="checkbox" id="settings-crt-flicker-toggle" ${pendingSettings.crtFlicker ? 'checked' : ''}>
								<label for="settings-crt-flicker-toggle">Simulate 60Hz cathode ray tube phosphor flicker</label>
							</div>
							<div class="xp-checkbox-row" style="margin-top: 4px;">
								<input type="checkbox" id="settings-crt-noise-toggle" ${pendingSettings.crtNoise ? 'checked' : ''}>
								<label for="settings-crt-noise-toggle">Simulate cathode ray analogue static noise</label>
							</div>
						</fieldset>
					</div>

					<div class="xp-tab-page" data-page="animations">
						<fieldset class="xp-groupbox">
							<legend>Window Transitions & Motion</legend>
							<div class="xp-checkbox-row">
								<input type="checkbox" id="settings-window-animations-toggle" ${pendingSettings.windowAnimations ? 'checked' : ''}>
								<label for="settings-window-animations-toggle"><strong>Animate windows when minimizing and maximizing</strong></label>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-anim-style-select" style="width: 140px;">Animation Style:</label>
								<select id="settings-anim-style-select" class="xp-select" style="flex: 1;">
									<option value="zoom">Zoom Scale (Original XP)</option>
									<option value="fade">Smooth Fade In/Out</option>
									<option value="glide">Vertical Glide Drop</option>
								</select>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-anim-speed-select" style="width: 140px;">Transition Speed:</label>
								<select id="settings-anim-speed-select" class="xp-select" style="flex: 1;">
									<option value="instant">Instant (0s - Maximum Performance)</option>
									<option value="fast">Fast Snappy (0.12s)</option>
									<option value="normal">Normal (0.25s Windows Standard)</option>
									<option value="slow">Slow Motion (0.55s)</option>
									<option value="cinematic">Cinematic Demonstration (0.95s)</option>
								</select>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Window Dragging & Focus</legend>
							<div class="xp-checkbox-row">
								<input type="checkbox" id="settings-drag-translucent-toggle" ${pendingSettings.windowDragTranslucent ? 'checked' : ''}>
								<label for="settings-drag-translucent-toggle">Show window contents translucent while dragging</label>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-inactive-opacity-slider" style="width: 140px;">Inactive Window Opacity:</label>
								<input type="range" id="settings-inactive-opacity-slider" min="0.5" max="1" step="0.05" value="${pendingSettings.inactiveWindowOpacity || 1}" class="xp-slider">
								<span id="settings-inactive-opacity-val" style="font-size: 11px; width: 35px;">${Math.round((pendingSettings.inactiveWindowOpacity || 1) * 100)}%</span>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-scrollbar-width-select" style="width: 140px;">Scrollbar Thickness:</label>
								<select id="settings-scrollbar-width-select" class="xp-select" style="flex: 1;">
									<option value="12">Thin (12px)</option>
									<option value="16">Standard (16px XP Default)</option>
									<option value="20">Thick (20px Touch/High DPI)</option>
									<option value="24">Extra Chunky (24px)</option>
								</select>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Window Management & Edge Snapping</legend>
							<div class="xp-form-row">
								<label for="settings-placement-mode-select" style="width: 150px;">Initial Placement:</label>
								<select id="settings-placement-mode-select" class="xp-select" style="flex: 1;">
									<option value="smart">Smart (Least Overlap Grid)</option>
									<option value="cascade">Cascade Diagonally</option>
									<option value="center">Centered on Screen</option>
									<option value="remember">Remember Last Position</option>
								</select>
							</div>
							<div class="xp-checkbox-row" style="margin-top: 6px;">
								<input type="checkbox" id="settings-snap-toggle" ${pendingSettings.windowEdgeSnapping !== false ? 'checked' : ''}>
								<label for="settings-snap-toggle">Enable desktop edge and corner window snapping</label>
							</div>
							<div class="xp-checkbox-row" style="margin-top: 4px;">
								<input type="checkbox" id="settings-snap-preview-toggle" ${pendingSettings.windowSnapPreview !== false ? 'checked' : ''}>
								<label for="settings-snap-preview-toggle">Show translucent snap layout ghost preview</label>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-snap-threshold-slider" style="width: 150px;">Snap Sensitivity (Margin):</label>
								<input type="range" id="settings-snap-threshold-slider" min="10" max="48" step="2" value="${pendingSettings.windowSnapThreshold || 24}" class="xp-slider">
								<span id="settings-snap-threshold-val" style="font-size: 11px; width: 35px;">${pendingSettings.windowSnapThreshold || 24}px</span>
							</div>
							<div class="xp-checkbox-row" style="margin-top: 4px;">
								<input type="checkbox" id="settings-remember-pos-toggle" ${pendingSettings.windowRememberPositions !== false ? 'checked' : ''}>
								<label for="settings-remember-pos-toggle">Remember window dimensions and positions across sessions</label>
							</div>
						</fieldset>
					</div>

					<div class="xp-tab-page" data-page="taskbar">
						<fieldset class="xp-groupbox">
							<legend>Taskbar Appearance & Placement</legend>
							<div class="xp-form-row">
								<label for="settings-taskbar-pos" style="width: 140px;">Taskbar Location:</label>
								<select id="settings-taskbar-pos" class="xp-select" style="flex: 1;">
									<option value="bottom">Bottom of Screen (Standard XP)</option>
									<option value="top">Top of Screen</option>
								</select>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-taskbar-size" style="width: 140px;">Taskbar Height:</label>
								<select id="settings-taskbar-size" class="xp-select" style="flex: 1;">
									<option value="mini">Mini (26px Extra Compact)</option>
									<option value="small">Small (30px Compact)</option>
									<option value="medium">Medium (36px Windows XP Default)</option>
									<option value="large">Large (44px Extended)</option>
									<option value="xlarge">Extra Large (52px)</option>
								</select>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-taskbar-opacity-slider" style="width: 140px;">Taskbar Opacity:</label>
								<input type="range" id="settings-taskbar-opacity-slider" min="0.3" max="1" step="0.05" value="${pendingSettings.taskbarOpacity || 1}" class="xp-slider">
								<span id="settings-taskbar-opacity-val" style="font-size: 11px; width: 35px;">${Math.round((pendingSettings.taskbarOpacity || 1) * 100)}%</span>
							</div>
							<div class="xp-checkbox-row" style="margin-top: 6px;">
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
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-balloon-duration-select" style="width: 140px;">Balloon Timeout:</label>
								<select id="settings-balloon-duration-select" class="xp-select" style="flex: 1;">
									<option value="3000">3 Seconds</option>
									<option value="6000">6 Seconds (Standard)</option>
									<option value="10000">10 Seconds</option>
									<option value="15000">15 Seconds (Long)</option>
								</select>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Start Menu Configuration</legend>
							<div class="xp-checkbox-row">
								<input type="checkbox" id="settings-start-search-toggle" ${pendingSettings.startMenuSearchVisible ? 'checked' : ''}>
								<label for="settings-start-search-toggle">Show filter search box in All Programs list</label>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-recent-docs-count-select" style="width: 160px;">Max Recent Documents:</label>
								<select id="settings-recent-docs-count-select" class="xp-select" style="flex: 1;">
									<option value="5">5 Documents</option>
									<option value="10">10 Documents</option>
									<option value="15">15 Documents (Standard)</option>
									<option value="25">25 Documents</option>
								</select>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Taskbar Window Buttons</legend>
							<div class="xp-form-row">
								<label for="settings-taskbar-density" style="width: 120px;">Grouping:</label>
								<select id="settings-taskbar-density" class="xp-select" style="flex: 1;">
									<option value="auto">Automatic (Compact when full)</option>
									<option value="compact">Always compact icons only</option>
									<option value="expanded">Never compact (Always show titles)</option>
								</select>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-btn-maxwidth-slider" style="width: 120px;">Max Button Width:</label>
								<input type="range" id="settings-btn-maxwidth-slider" min="100" max="240" step="10" value="${pendingSettings.taskbarBtnMaxWidth || 155}" class="xp-slider">
								<span id="settings-btn-maxwidth-val" style="font-size: 11px; width: 40px;">${pendingSettings.taskbarBtnMaxWidth || 155}px</span>
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
							<div class="xp-checkbox-row" style="margin-top: 4px;">
								<input type="checkbox" id="settings-clock-day" ${pendingSettings.showClockDay ? 'checked' : ''}>
								<label for="settings-clock-day">Include day of week in clock tooltip and date</label>
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

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>System Tray Notification Icons Visibility</legend>
							<div class="settings-tray-config-grid" id="settings-tray-grid"></div>
						</fieldset>
					</div>

					<div class="xp-tab-page" data-page="audio">
						<fieldset class="xp-groupbox">
							<legend>Sound Scheme & Volume Synthesizer</legend>
							<div class="xp-form-row">
								<label for="settings-sound-scheme" style="width: 110px;">Sound Scheme:</label>
								<select id="settings-sound-scheme" class="xp-select" style="flex: 1;">
									<option value="default">Windows Default (Authentic Retro Synth)</option>
									<option value="utopia">Windows Utopia</option>
									<option value="classic">Windows Classic (95/98)</option>
									<option value="none">No Sounds (Muted)</option>
								</select>
							</div>
							<div class="xp-checkbox-row" style="margin-top: 6px;">
								<input type="checkbox" id="settings-sound-toggle" ${pendingSettings.soundEnabled ? 'checked' : ''}>
								<label for="settings-sound-toggle">Play synthesized Windows XP system sound events</label>
							</div>
							<div class="xp-form-row" style="margin-top: 8px;">
								<label for="settings-volume-slider" style="width: 110px;">Master Volume:</label>
								<input type="range" id="settings-volume-slider" min="0.05" max="1" step="0.05" value="${pendingSettings.soundVolume}" class="xp-slider">
								<span id="settings-volume-val" style="font-size: 11px; width: 35px;">${Math.round(pendingSettings.soundVolume * 100)}%</span>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-sound-pitch-slider" style="width: 110px;">Frequency Pitch:</label>
								<input type="range" id="settings-sound-pitch-slider" min="0.5" max="2.0" step="0.05" value="${pendingSettings.soundPitchMultiplier || 1.0}" class="xp-slider">
								<span id="settings-sound-pitch-val" style="font-size: 11px; width: 35px;">${(pendingSettings.soundPitchMultiplier || 1.0).toFixed(2)}x</span>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Digital Media & Default Audio Player</legend>
							<div class="xp-form-row">
								<label for="settings-default-player" style="width: 140px;">Preferred Player:</label>
								<select id="settings-default-player" class="xp-select" style="flex: 1;">
									<option value="mediaplayer">Windows Media Player 9 Series</option>
									<option value="winamp">Winamp 2.9 (Classic Retro Player)</option>
								</select>
							</div>
							<div class="xp-form-row" style="margin-top: 6px;">
								<label for="settings-default-viz" style="width: 140px;">Default Visualizer:</label>
								<select id="settings-default-viz" class="xp-select" style="flex: 1;">
									<option value="albumart">Album Art Display</option>
									<option value="bars">Spectrum Bars</option>
									<option value="wave">Oscilloscope Waveform</option>
									<option value="spectrum">Radial Spectrum</option>
									<option value="particles">Starfield Particles</option>
									<option value="flame">Fire Flame</option>
								</select>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Individual System Sound Event Toggles</legend>
							<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; font-size: 11px;">
								<label class="xp-checkbox-row"><input type="checkbox" id="snd-evt-startup" ${pendingSettings.soundEventStartup ? 'checked' : ''}> Startup / Log On</label>
								<label class="xp-checkbox-row"><input type="checkbox" id="snd-evt-shutdown" ${pendingSettings.soundEventShutdown ? 'checked' : ''}> Shutdown / Log Off</label>
								<label class="xp-checkbox-row"><input type="checkbox" id="snd-evt-error" ${pendingSettings.soundEventError ? 'checked' : ''}> Critical Stop Error</label>
								<label class="xp-checkbox-row"><input type="checkbox" id="snd-evt-asterisk" ${pendingSettings.soundEventAsterisk ? 'checked' : ''}> Asterisk Information</label>
								<label class="xp-checkbox-row"><input type="checkbox" id="snd-evt-exclamation" ${pendingSettings.soundEventExclamation ? 'checked' : ''}> Warning Exclamation</label>
								<label class="xp-checkbox-row"><input type="checkbox" id="snd-evt-question" ${pendingSettings.soundEventQuestion ? 'checked' : ''}> Question Prompt</label>
								<label class="xp-checkbox-row"><input type="checkbox" id="snd-evt-click" ${pendingSettings.soundEventClick ? 'checked' : ''}> Menu & Icon Click</label>
								<label class="xp-checkbox-row"><input type="checkbox" id="snd-evt-recycle" ${pendingSettings.soundEventRecycle ? 'checked' : ''}> Recycle Bin Empty</label>
								<label class="xp-checkbox-row"><input type="checkbox" id="snd-evt-window" ${pendingSettings.soundEventWindow ? 'checked' : ''}> Window Min/Restore</label>
								<label class="xp-checkbox-row"><input type="checkbox" id="snd-evt-clippy" ${pendingSettings.clippySound ? 'checked' : ''}> Clippy Assistant</label>
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
							<legend>Mouse Cursor Scheme</legend>
							<div class="xp-form-row">
								<label for="settings-cursor-scheme-select" style="width: 120px;">Pointer Scheme:</label>
								<select id="settings-cursor-scheme-select" class="xp-select" style="flex: 1;">
									<option value="default">Windows Default (System Pointer)</option>
									<option value="classic">Windows XP Classic (Arrow & Hand)</option>
									<option value="precision">Crosshair Precision Pointer</option>
									<option value="matrix">Terminal Green Cell Pointer</option>
									<option value="large">High Contrast Large</option>
								</select>
							</div>
						</fieldset>

						<fieldset class="xp-groupbox" style="margin-top: 8px;">
							<legend>Click Item Action</legend>
							<div class="xp-checkbox-row">
								<input type="checkbox" id="settings-single-click-toggle" ${pendingSettings.singleClickOpen ? 'checked' : ''}>
								<label for="settings-single-click-toggle">Single-click to open an item (point to select / underline titles)</label>
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
							<legend>File Explorer Navigation & Attributes</legend>
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

		const bounds = (window.WindowManager && typeof window.WindowManager.getWorkspaceBounds === 'function') 
			? window.WindowManager.getWorkspaceBounds() 
			: { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight - 36, right: window.innerWidth, bottom: window.innerHeight - 36 };

		let targetX = options ? options.x : undefined;
		let targetY = options ? options.y : undefined;
		if (typeof targetX === 'number' && typeof targetY === 'number') {
			targetX = Math.max(bounds.left + 8, Math.min(targetX, bounds.right - 680 - 8));
			targetY = Math.max(bounds.top + 8, Math.min(targetY, bounds.bottom - 570 - 8));
		}

		const win = createXPWindow(id, 'Control Panel & System Settings', contentHTML, 680, 570, {
			iconSrc: '../assets/images/desk/icons/System Properties.webp',
			resizable: false,
			x: targetX,
			y: targetY
		});
		win.querySelector('.xp-window-content').style.padding = '0';

		win.getWindowState = () => {
			const activeBtn = win.querySelector('.xp-tab-btn.active');
			return {
				appId: 'settings',
				activeTab: activeBtn ? activeBtn.dataset.tab : 'system'
			};
		};

		bindSettingsDialogEvents(win, id, defaultTab);
		return win;
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

		const dynamicPresets = buildDynamicAvatarPresets();

		dynamicPresets.forEach(avatar => {
			const item = document.createElement('div');
			item.className = 'xp-avatar-item';
			if (pendingSettings.userAvatar === avatar.url) {
				item.classList.add('selected');
			}
			item.title = avatar.name;

			const img = document.createElement('img');
			img.src = avatar.url;
			img.alt = avatar.name;
			img.loading = 'lazy';
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

	function populateTrayConfigGrid(win) {
		const grid = win.querySelector('#settings-tray-grid');
		if (!grid) return;
		grid.innerHTML = '';

		const trayServices = (window.Taskbar && typeof window.Taskbar.getTrayServices === 'function')
			? window.Taskbar.getTrayServices()
			: ((currentSettings && Array.isArray(currentSettings.systemTrayServices)) ? currentSettings.systemTrayServices : []);

		const config = pendingSettings.trayConfig || {};

		trayServices.forEach(srv => {
			const srvCfg = config[srv.id] || {};
			const isEn = srvCfg.enabled !== undefined ? srvCfg.enabled : true;
			const isHid = srvCfg.hidden !== undefined ? srvCfg.hidden : !!srv.hidden;

			const row = document.createElement('div');
			row.className = 'settings-tray-item-row';

			row.innerHTML = `
				<input type="checkbox" id="tray-cfg-en-${srv.id}" ${isEn ? 'checked' : ''}>
				<img src="${srv.icon}" alt="">
				<label for="tray-cfg-en-${srv.id}" style="flex:1;">${srv.name}</label>
				<select class="xp-select" id="tray-cfg-hid-${srv.id}" style="font-size:10px;">
					<option value="false" ${!isHid ? 'selected' : ''}>Always Show</option>
					<option value="true" ${isHid ? 'selected' : ''}>Hide when inactive</option>
				</select>
			`;

			const enCheck = row.querySelector(`#tray-cfg-en-${srv.id}`);
			const hidSelect = row.querySelector(`#tray-cfg-hid-${srv.id}`);

			enCheck.addEventListener('change', () => {
				if (!pendingSettings.trayConfig) pendingSettings.trayConfig = {};
				if (!pendingSettings.trayConfig[srv.id]) pendingSettings.trayConfig[srv.id] = {};
				pendingSettings.trayConfig[srv.id].enabled = enCheck.checked;
				markDirty(win);
			});

			hidSelect.addEventListener('change', () => {
				if (!pendingSettings.trayConfig) pendingSettings.trayConfig = {};
				if (!pendingSettings.trayConfig[srv.id]) pendingSettings.trayConfig[srv.id] = {};
				pendingSettings.trayConfig[srv.id].hidden = hidSelect.value === 'true';
				markDirty(win);
			});

			grid.appendChild(row);
		});
	}

	function bindSettingsDialogEvents(win, windowId, initialTab) {
		switchTab(win, initialTab);

		const ssCanvas = win.querySelector('#settings-ss-monitor-canvas');
		const ssSelect = win.querySelector('#settings-ss-select');
		const ssPreviewBtn = win.querySelector('#settings-ss-btn-preview');
		const ssWaitInput = win.querySelector('#settings-ss-wait-input');
		const ssCustomPanel = win.querySelector('#settings-ss-custom-panel');

		const renderEmbeddedSettings = () => {
			if (!ssCustomPanel) return;
			ssCustomPanel.innerHTML = '';
			const saver = ssSelect ? ssSelect.value : (pendingSettings.screensaverActive || 'xp-flying-logo');
			if (saver === 'none' || !window.ScreenSaverManager) return;
			const targetSaver = saver === 'random' ? 'xp-flying-logo' : saver;
			window.ScreenSaverManager.renderConfigUI(ssCustomPanel, targetSaver, (updatedCfg) => {
				markDirty(win);
				if (ssCanvas && saver !== 'none') {
					window.ScreenSaverManager.updateActivePreviewConfig(ssCanvas, updatedCfg);
				}
			});
		};

		renderEmbeddedSettings();

		win.querySelectorAll('.xp-tab-btn').forEach(btn => {
			btn.addEventListener('click', () => {
				switchTab(win, btn.dataset.tab);
				SoundEngine.play('click');
				const curCanvas = win.querySelector('#settings-ss-monitor-canvas') || ssCanvas;
				if (btn.dataset.tab === 'screensaver' && window.ScreenSaverManager && curCanvas) {
					const activeSaver = ssSelect ? ssSelect.value : (pendingSettings.screensaverActive || 'xp-flying-logo');
					if (activeSaver !== 'none') {
						window.ScreenSaverManager.startPreview(curCanvas, activeSaver);
					} else {
						window.ScreenSaverManager.stopPreview(curCanvas, true);
					}
				} else if (window.ScreenSaverManager && curCanvas) {
					window.ScreenSaverManager.stopPreview(curCanvas, true);
				}
			});
		});

		populateWallpapersList(win);
		populateAvatarGrid(win);
		populateTrayConfigGrid(win);
		updateThemePreviewBox(win);

		if (ssSelect) {
			ssSelect.addEventListener('change', () => {
				pendingSettings.screensaverActive = ssSelect.value;
				pendingSettings.screensaverEnabled = ssSelect.value !== 'none';
				if (ssPreviewBtn) ssPreviewBtn.disabled = ssSelect.value === 'none';
				renderEmbeddedSettings();
				markDirty(win);
				const activeCanvas = win.querySelector('#settings-ss-monitor-canvas') || ssCanvas;
				if (window.ScreenSaverManager && activeCanvas) {
					if (ssSelect.value !== 'none') {
						window.ScreenSaverManager.startPreview(activeCanvas, ssSelect.value);
					} else {
						window.ScreenSaverManager.stopPreview(activeCanvas, true);
					}
				}
			});
		}

		if (ssPreviewBtn) {
			ssPreviewBtn.addEventListener('click', () => {
				const saver = ssSelect ? ssSelect.value : pendingSettings.screensaverActive;
				if (saver && saver !== 'none' && window.ScreenSaverManager) {
					window.ScreenSaverManager.settings.activeSaver = saver;
					window.ScreenSaverManager.start(true);
				}
			});
		}

		if (ssWaitInput) {
			ssWaitInput.addEventListener('input', () => {
				const val = parseFloat(ssWaitInput.value);
				pendingSettings.screensaverTimeoutMinutes = (!isNaN(val) && val > 0) ? val : 1;
				markDirty(win);
			});
		}

		const wpModeSelect = win.querySelector('#settings-wallpaper-mode-select');
		const slideshowPanel = win.querySelector('#settings-slideshow-panel');
		const slideshowIntervalSelect = win.querySelector('#settings-slideshow-interval');
		const slideshowRandomCheck = win.querySelector('#settings-slideshow-random');

		if (wpModeSelect) {
			wpModeSelect.addEventListener('change', () => {
				pendingSettings.wallpaperMode = wpModeSelect.value;
				if (slideshowPanel) slideshowPanel.style.display = pendingSettings.wallpaperMode === 'slideshow' ? 'flex' : 'none';
				const monitor = win.querySelector('#settings-monitor-screen');
				if (monitor) {
					monitor.style.backgroundColor = pendingSettings.desktopBackgroundColor || '#004e98';
					monitor.style.backgroundImage = pendingSettings.wallpaperMode === 'color' ? 'none' : `url('${pendingSettings.desktopBackground}')`;
				}
				markDirty(win);
			});
		}

		if (slideshowIntervalSelect) {
			slideshowIntervalSelect.addEventListener('change', () => {
				pendingSettings.wallpaperSlideshowInterval = slideshowIntervalSelect.value;
				markDirty(win);
			});
		}

		if (slideshowRandomCheck) {
			slideshowRandomCheck.addEventListener('change', () => {
				pendingSettings.wallpaperSlideshowRandom = slideshowRandomCheck.checked;
				markDirty(win);
			});
		}

		const wpTransSelect = win.querySelector('#settings-wallpaper-transition');
		if (wpTransSelect) {
			wpTransSelect.addEventListener('change', () => {
				pendingSettings.wallpaperTransition = wpTransSelect.value;
				markDirty(win);
			});
		}

		const wpTransDurSelect = win.querySelector('#settings-wallpaper-trans-duration');
		if (wpTransDurSelect) {
			wpTransDurSelect.addEventListener('change', () => {
				pendingSettings.wallpaperTransitionDuration = parseFloat(wpTransDurSelect.value);
				markDirty(win);
			});
		}

		const gridDirSelect = win.querySelector('#settings-grid-direction');
		if (gridDirSelect) {
			gridDirSelect.addEventListener('change', () => {
				pendingSettings.desktopGridDirection = gridDirSelect.value;
				markDirty(win);
			});
		}

		const gridOrigSelect = win.querySelector('#settings-grid-origin');
		if (gridOrigSelect) {
			gridOrigSelect.addEventListener('change', () => {
				pendingSettings.desktopGridOrigin = gridOrigSelect.value;
				markDirty(win);
			});
		}

		const avatarShapeSelect = win.querySelector('#settings-avatar-shape');
		if (avatarShapeSelect) {
			avatarShapeSelect.value = pendingSettings.userAvatarShape || 'square';
			avatarShapeSelect.addEventListener('change', () => {
				pendingSettings.userAvatarShape = avatarShapeSelect.value;
				markDirty(win);
			});
		}

		const startBtnCaption = win.querySelector('#settings-startbtn-caption');
		if (startBtnCaption) {
			startBtnCaption.addEventListener('input', () => {
				pendingSettings.startButtonText = startBtnCaption.value.trim() || 'start';
				markDirty(win);
			});
		}

		const customColorsToggle = win.querySelector('#settings-custom-colors-toggle');
		if (customColorsToggle) {
			customColorsToggle.addEventListener('change', () => {
				pendingSettings.customColorsEnabled = customColorsToggle.checked;
				markDirty(win);
			});
		}

		const colorPickers = [
			{ id: '#settings-color-active-title1', prop: 'customActiveTitle1' },
			{ id: '#settings-color-active-title2', prop: 'customActiveTitle2' },
			{ id: '#settings-color-inactive-title1', prop: 'customInactiveTitle1' },
			{ id: '#settings-color-inactive-title2', prop: 'customInactiveTitle2' },
			{ id: '#settings-color-window-bg', prop: 'customWindowBg' },
			{ id: '#settings-color-window-text', prop: 'customWindowText' },
			{ id: '#settings-color-selection-bg', prop: 'customSelectionBg' },
			{ id: '#settings-color-border', prop: 'customBorderColor' },
			{ id: '#settings-color-taskbar1', prop: 'customTaskbar1' },
			{ id: '#settings-color-taskbar2', prop: 'customTaskbar2' }
		];

		colorPickers.forEach(cp => {
			const el = win.querySelector(cp.id);
			if (el) {
				el.addEventListener('input', () => {
					pendingSettings[cp.prop] = el.value;
					markDirty(win);
				});
			}
		});

		const cornerRadiusSelect = win.querySelector('#settings-corner-radius-select');
		if (cornerRadiusSelect) {
			cornerRadiusSelect.value = String(pendingSettings.windowCornerRadius || 5);
			cornerRadiusSelect.addEventListener('change', () => {
				pendingSettings.windowCornerRadius = parseInt(cornerRadiusSelect.value, 10);
				markDirty(win);
			});
		}

		const headerHeightSlider = win.querySelector('#settings-header-height-slider');
		const headerHeightVal = win.querySelector('#settings-header-height-val');
		if (headerHeightSlider) {
			headerHeightSlider.addEventListener('input', () => {
				pendingSettings.windowHeaderHeight = parseInt(headerHeightSlider.value, 10);
				if (headerHeightVal) headerHeightVal.textContent = `${pendingSettings.windowHeaderHeight}px`;
				markDirty(win);
			});
		}

		const headerAlignSelect = win.querySelector('#settings-header-align-select');
		if (headerAlignSelect) {
			headerAlignSelect.value = pendingSettings.windowHeaderAlign || 'left';
			headerAlignSelect.addEventListener('change', () => {
				pendingSettings.windowHeaderAlign = headerAlignSelect.value;
				markDirty(win);
			});
		}

		const iconLabelColor = win.querySelector('#settings-icon-label-color');
		if (iconLabelColor) {
			iconLabelColor.addEventListener('input', () => {
				pendingSettings.iconLabelColor = iconLabelColor.value;
				markDirty(win);
			});
		}

		const iconLabelAlign = win.querySelector('#settings-icon-label-align');
		if (iconLabelAlign) {
			iconLabelAlign.value = pendingSettings.iconLabelAlign || 'center';
			iconLabelAlign.addEventListener('change', () => {
				pendingSettings.iconLabelAlign = iconLabelAlign.value;
				markDirty(win);
			});
		}

		const iconLabelLines = win.querySelector('#settings-icon-label-lines');
		if (iconLabelLines) {
			iconLabelLines.value = String(pendingSettings.iconLabelLines || 2);
			iconLabelLines.addEventListener('change', () => {
				pendingSettings.iconLabelLines = parseInt(iconLabelLines.value, 10);
				markDirty(win);
			});
		}

		const selboxColor = win.querySelector('#settings-selbox-color');
		const selboxOpacity = win.querySelector('#settings-selbox-opacity');
		if (selboxColor) {
			selboxColor.addEventListener('input', () => {
				pendingSettings.selectionBoxColor = selboxColor.value;
				markDirty(win);
			});
		}
		if (selboxOpacity) {
			selboxOpacity.addEventListener('input', () => {
				pendingSettings.selectionBoxOpacity = parseFloat(selboxOpacity.value);
				markDirty(win);
			});
		}

		const fontWeightSelect = win.querySelector('#settings-font-weight');
		if (fontWeightSelect) {
			fontWeightSelect.value = pendingSettings.fontWeight || 'normal';
			fontWeightSelect.addEventListener('change', () => {
				pendingSettings.fontWeight = fontWeightSelect.value;
				markDirty(win);
			});
		}

		const fontLineHeight = win.querySelector('#settings-font-line-height');
		if (fontLineHeight) {
			fontLineHeight.value = pendingSettings.fontLineHeight || 'normal';
			fontLineHeight.addEventListener('change', () => {
				pendingSettings.fontLineHeight = fontLineHeight.value;
				markDirty(win);
			});
		}

		const textRenderMode = win.querySelector('#settings-text-rendering-mode');
		if (textRenderMode) {
			textRenderMode.value = pendingSettings.textRenderingMode || 'optimizeLegibility';
			textRenderMode.addEventListener('change', () => {
				pendingSettings.textRenderingMode = textRenderMode.value;
				markDirty(win);
			});
		}

		const scanlinesDensity = win.querySelector('#settings-scanlines-density');
		if (scanlinesDensity) {
			scanlinesDensity.value = pendingSettings.scanlinesDensity || 'normal';
			scanlinesDensity.addEventListener('change', () => {
				pendingSettings.scanlinesDensity = scanlinesDensity.value;
				markDirty(win);
			});
		}

		const scanlinesSpeed = win.querySelector('#settings-scanlines-speed');
		if (scanlinesSpeed) {
			scanlinesSpeed.value = pendingSettings.scanlinesSpeed || 'normal';
			scanlinesSpeed.addEventListener('change', () => {
				pendingSettings.scanlinesSpeed = scanlinesSpeed.value;
				markDirty(win);
			});
		}

		const crtNoiseToggle = win.querySelector('#settings-crt-noise-toggle');
		if (crtNoiseToggle) {
			crtNoiseToggle.addEventListener('change', () => {
				pendingSettings.crtNoise = crtNoiseToggle.checked;
				markDirty(win);
			});
		}

		const animStyleSelect = win.querySelector('#settings-anim-style-select');
		if (animStyleSelect) {
			animStyleSelect.value = pendingSettings.animationStyle || 'zoom';
			animStyleSelect.addEventListener('change', () => {
				pendingSettings.animationStyle = animStyleSelect.value;
				markDirty(win);
			});
		}

		const animSpeedSelect = win.querySelector('#settings-anim-speed-select');
		if (animSpeedSelect) {
			animSpeedSelect.value = pendingSettings.animationSpeed || 'normal';
			animSpeedSelect.addEventListener('change', () => {
				pendingSettings.animationSpeed = animSpeedSelect.value;
				markDirty(win);
			});
		}

		const windowAnimToggle = win.querySelector('#settings-window-animations-toggle');
		if (windowAnimToggle) {
			windowAnimToggle.addEventListener('change', () => {
				pendingSettings.windowAnimations = windowAnimToggle.checked;
				markDirty(win);
			});
		}

		const dragTranslucentToggle = win.querySelector('#settings-drag-translucent-toggle');
		if (dragTranslucentToggle) {
			dragTranslucentToggle.addEventListener('change', () => {
				pendingSettings.windowDragTranslucent = dragTranslucentToggle.checked;
				markDirty(win);
			});
		}

		const inactiveOpacitySlider = win.querySelector('#settings-inactive-opacity-slider');
		const inactiveOpacityVal = win.querySelector('#settings-inactive-opacity-val');
		if (inactiveOpacitySlider) {
			inactiveOpacitySlider.addEventListener('input', () => {
				pendingSettings.inactiveWindowOpacity = parseFloat(inactiveOpacitySlider.value);
				if (inactiveOpacityVal) inactiveOpacityVal.textContent = `${Math.round(pendingSettings.inactiveWindowOpacity * 100)}%`;
				markDirty(win);
			});
		}

		const scrollbarWidthSelect = win.querySelector('#settings-scrollbar-width-select');
		if (scrollbarWidthSelect) {
			scrollbarWidthSelect.value = String(pendingSettings.scrollbarWidth || 16);
			scrollbarWidthSelect.addEventListener('change', () => {
				pendingSettings.scrollbarWidth = parseInt(scrollbarWidthSelect.value, 10);
				markDirty(win);
			});
		}

		const placementModeSelect = win.querySelector('#settings-placement-mode-select');
		if (placementModeSelect) {
			placementModeSelect.value = pendingSettings.windowPlacementMode || 'smart';
			placementModeSelect.addEventListener('change', () => {
				pendingSettings.windowPlacementMode = placementModeSelect.value;
				markDirty(win);
			});
		}

		const snapToggle = win.querySelector('#settings-snap-toggle');
		if (snapToggle) {
			snapToggle.addEventListener('change', () => {
				pendingSettings.windowEdgeSnapping = snapToggle.checked;
				markDirty(win);
			});
		}

		const snapPreviewToggle = win.querySelector('#settings-snap-preview-toggle');
		if (snapPreviewToggle) {
			snapPreviewToggle.addEventListener('change', () => {
				pendingSettings.windowSnapPreview = snapPreviewToggle.checked;
				markDirty(win);
			});
		}

		const snapThresholdSlider = win.querySelector('#settings-snap-threshold-slider');
		const snapThresholdVal = win.querySelector('#settings-snap-threshold-val');
		if (snapThresholdSlider) {
			snapThresholdSlider.addEventListener('input', () => {
				pendingSettings.windowSnapThreshold = parseInt(snapThresholdSlider.value, 10);
				if (snapThresholdVal) snapThresholdVal.textContent = `${pendingSettings.windowSnapThreshold}px`;
				markDirty(win);
			});
		}

		const rememberPosToggle = win.querySelector('#settings-remember-pos-toggle');
		if (rememberPosToggle) {
			rememberPosToggle.addEventListener('change', () => {
				pendingSettings.windowRememberPositions = rememberPosToggle.checked;
				markDirty(win);
			});
		}

		const taskbarOpacitySlider = win.querySelector('#settings-taskbar-opacity-slider');
		const taskbarOpacityVal = win.querySelector('#settings-taskbar-opacity-val');
		if (taskbarOpacitySlider) {
			taskbarOpacitySlider.addEventListener('input', () => {
				pendingSettings.taskbarOpacity = parseFloat(taskbarOpacitySlider.value);
				if (taskbarOpacityVal) taskbarOpacityVal.textContent = `${Math.round(pendingSettings.taskbarOpacity * 100)}%`;
				markDirty(win);
			});
		}

		const btnMaxWidthSlider = win.querySelector('#settings-btn-maxwidth-slider');
		const btnMaxWidthVal = win.querySelector('#settings-btn-maxwidth-val');
		if (btnMaxWidthSlider) {
			btnMaxWidthSlider.addEventListener('input', () => {
				pendingSettings.taskbarBtnMaxWidth = parseInt(btnMaxWidthSlider.value, 10);
				if (btnMaxWidthVal) btnMaxWidthVal.textContent = `${pendingSettings.taskbarBtnMaxWidth}px`;
				markDirty(win);
			});
		}

		const balloonDurationSelect = win.querySelector('#settings-balloon-duration-select');
		if (balloonDurationSelect) {
			balloonDurationSelect.value = String(pendingSettings.balloonDuration || 6000);
			balloonDurationSelect.addEventListener('change', () => {
				pendingSettings.balloonDuration = parseInt(balloonDurationSelect.value, 10);
				markDirty(win);
			});
		}

		const startSearchToggle = win.querySelector('#settings-start-search-toggle');
		if (startSearchToggle) {
			startSearchToggle.addEventListener('change', () => {
				pendingSettings.startMenuSearchVisible = startSearchToggle.checked;
				markDirty(win);
			});
		}

		const recentDocsCountSelect = win.querySelector('#settings-recent-docs-count-select');
		if (recentDocsCountSelect) {
			recentDocsCountSelect.value = String(pendingSettings.startMenuRecentDocsCount || 15);
			recentDocsCountSelect.addEventListener('change', () => {
				pendingSettings.startMenuRecentDocsCount = parseInt(recentDocsCountSelect.value, 10);
				markDirty(win);
			});
		}

		const clockDayToggle = win.querySelector('#settings-clock-day');
		if (clockDayToggle) {
			clockDayToggle.addEventListener('change', () => {
				pendingSettings.showClockDay = clockDayToggle.checked;
				markDirty(win);
			});
		}

		const soundPitchSlider = win.querySelector('#settings-sound-pitch-slider');
		const soundPitchVal = win.querySelector('#settings-sound-pitch-val');
		if (soundPitchSlider) {
			soundPitchSlider.addEventListener('input', () => {
				pendingSettings.soundPitchMultiplier = parseFloat(soundPitchSlider.value);
				if (soundPitchVal) soundPitchVal.textContent = `${pendingSettings.soundPitchMultiplier.toFixed(2)}x`;
				markDirty(win);
			});
		}

		const soundEventCheckboxes = [
			{ id: '#snd-evt-startup', prop: 'soundEventStartup' },
			{ id: '#snd-evt-shutdown', prop: 'soundEventShutdown' },
			{ id: '#snd-evt-error', prop: 'soundEventError' },
			{ id: '#snd-evt-asterisk', prop: 'soundEventAsterisk' },
			{ id: '#snd-evt-exclamation', prop: 'soundEventExclamation' },
			{ id: '#snd-evt-question', prop: 'soundEventQuestion' },
			{ id: '#snd-evt-click', prop: 'soundEventClick' },
			{ id: '#snd-evt-recycle', prop: 'soundEventRecycle' },
			{ id: '#snd-evt-window', prop: 'soundEventWindow' },
			{ id: '#snd-evt-clippy', prop: 'clippySound' }
		];

		soundEventCheckboxes.forEach(sec => {
			const el = win.querySelector(sec.id);
			if (el) {
				el.addEventListener('change', () => {
					pendingSettings[sec.prop] = el.checked;
					markDirty(win);
				});
			}
		});

		const cursorSchemeSelect = win.querySelector('#settings-cursor-scheme-select');
		if (cursorSchemeSelect) {
			cursorSchemeSelect.value = pendingSettings.cursorScheme || 'default';
			cursorSchemeSelect.addEventListener('change', () => {
				pendingSettings.cursorScheme = cursorSchemeSelect.value;
				markDirty(win);
			});
		}

		const restoreBlissBtn = win.querySelector('#settings-btn-restore-bliss');
		if (restoreBlissBtn) {
			restoreBlissBtn.addEventListener('click', () => {
				const defaultPath = (baseConfig && baseConfig.desktopBackground) || '../assets/images/desk/wallpapers/wallpaper-default.webp';
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

		const openWpFolderBtn = win.querySelector('#settings-btn-open-wp-folder');
		if (openWpFolderBtn) {
			openWpFolderBtn.addEventListener('click', () => {
				if (typeof fs !== 'undefined' && fs) {
					let wpFolder = fs.findByPath('/WINDOWS/Web/Wallpaper');
					if (!wpFolder) wpFolder = fs.root;
					if (window.FileExplorer) window.FileExplorer.open(wpFolder);
				}
			});
		}

		const userJobInput = win.querySelector('#settings-userjob-input');
		if (userJobInput) {
			userJobInput.addEventListener('input', () => {
				pendingSettings.userJobTitle = userJobInput.value.trim();
				markDirty(win);
			});
		}

		const bootLogoSelect = win.querySelector('#settings-boot-logo-select');
		if (bootLogoSelect) {
			bootLogoSelect.addEventListener('change', () => {
				pendingSettings.bootLogoPreset = bootLogoSelect.value;
				markDirty(win);
			});
		}

		const skipBootToggle = win.querySelector('#settings-skip-boot');
		if (skipBootToggle) {
			skipBootToggle.addEventListener('change', () => {
				pendingSettings.skipBootScreen = skipBootToggle.checked;
				markDirty(win);
			});
		}

		const achNotifToggle = win.querySelector('#settings-ach-notifications-toggle');
		if (achNotifToggle) {
			achNotifToggle.addEventListener('change', () => {
				pendingSettings.achievementNotificationsEnabled = achNotifToggle.checked;
				markDirty(win);
			});
		}

		const achPosSelect = win.querySelector('#settings-ach-position-select');
		if (achPosSelect) {
			achPosSelect.addEventListener('change', () => {
				pendingSettings.achievementNotificationPosition = achPosSelect.value;
				markDirty(win);
			});
		}

		const bgColorPicker = win.querySelector('#settings-bg-color-picker');
		if (bgColorPicker) {
			bgColorPicker.addEventListener('input', () => {
				pendingSettings.desktopBackgroundColor = bgColorPicker.value;
				const monitor = win.querySelector('#settings-monitor-screen');
				if (monitor) monitor.style.backgroundColor = bgColorPicker.value;
				markDirty(win);
			});
		}

		const showDesktopIconsToggle = win.querySelector('#settings-show-desktop-icons');
		if (showDesktopIconsToggle) {
			showDesktopIconsToggle.addEventListener('change', () => {
				pendingSettings.showDesktopIcons = showDesktopIconsToggle.checked;
				markDirty(win);
			});
		}

		const iconBoxToggle = win.querySelector('#settings-icon-box');
		if (iconBoxToggle) {
			iconBoxToggle.addEventListener('change', () => {
				pendingSettings.iconBackground = iconBoxToggle.checked;
				markDirty(win);
			});
		}

		const borderWidthSelect = win.querySelector('#settings-border-width-select');
		if (borderWidthSelect) {
			borderWidthSelect.value = String(pendingSettings.windowBorderWidth || 1);
			borderWidthSelect.addEventListener('change', () => {
				pendingSettings.windowBorderWidth = parseInt(borderWidthSelect.value, 10);
				markDirty(win);
			});
		}

		const windowShadowsToggle = win.querySelector('#settings-window-shadows');
		if (windowShadowsToggle) {
			windowShadowsToggle.addEventListener('change', () => {
				pendingSettings.windowShadows = windowShadowsToggle.checked;
				markDirty(win);
			});
		}

		const clearTypeToggle = win.querySelector('#settings-cleartype-toggle');
		if (clearTypeToggle) {
			clearTypeToggle.addEventListener('change', () => {
				pendingSettings.fontClearType = clearTypeToggle.checked;
				markDirty(win);
			});
		}

		const monochromeSelect = win.querySelector('#settings-crt-monochrome-select');
		if (monochromeSelect) {
			monochromeSelect.value = pendingSettings.crtMonochrome || 'none';
			monochromeSelect.addEventListener('change', () => {
				pendingSettings.crtMonochrome = monochromeSelect.value;
				markDirty(win);
			});
		}

		const crtBloomToggle = win.querySelector('#settings-crt-bloom-toggle');
		if (crtBloomToggle) {
			crtBloomToggle.addEventListener('change', () => {
				pendingSettings.crtBloom = crtBloomToggle.checked;
				markDirty(win);
			});
		}

		const taskbarPosSelect = win.querySelector('#settings-taskbar-pos');
		if (taskbarPosSelect) {
			taskbarPosSelect.value = pendingSettings.taskbarPosition || 'bottom';
			taskbarPosSelect.addEventListener('change', () => {
				pendingSettings.taskbarPosition = taskbarPosSelect.value;
				markDirty(win);
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
				pendingSettings.iconLabelShadow = iconShadowToggle.checked;
				markDirty(win);
			});
		}

		const themeSelect = win.querySelector('#settings-theme-select');
		if (themeSelect) {
			themeSelect.value = pendingSettings.theme;
			themeSelect.addEventListener('change', () => {
				pendingSettings.theme = themeSelect.value;
				try {
					const raw = window.DeskStorage ? window.DeskStorage.getItem('xp_tested_themes') : localStorage.getItem('xp_tested_themes');
					const tested = JSON.parse(raw || '[]');
					if (!tested.includes(themeSelect.value)) {
						tested.push(themeSelect.value);
						if (window.DeskStorage) window.DeskStorage.setItem('xp_tested_themes', JSON.stringify(tested));
						else localStorage.setItem('xp_tested_themes', JSON.stringify(tested));
					}
					if (window.AchievementsManager) {
						window.AchievementsManager.setProgress('themes_connoisseur', tested.length);
					}
				} catch (e) {}
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

		const aspectSelect = win.querySelector('#settings-aspect-ratio-select');
		const crtCurvatureToggle = win.querySelector('#settings-crt-curvature-toggle');
		const curvatureSlider = win.querySelector('#settings-curvature-slider');
		const curvatureVal = win.querySelector('#settings-curvature-val');
		const cornerSlider = win.querySelector('#settings-corner-radius-slider');
		const cornerVal = win.querySelector('#settings-corner-radius-val');
		const bezelSelect = win.querySelector('#settings-bezel-color-select');
		const crtScreenPreview = win.querySelector('#settings-crt-screen-preview');

		if (aspectSelect) {
			aspectSelect.value = pendingSettings.crtAspectRatio || 'fullscreen';
			aspectSelect.addEventListener('change', () => {
				pendingSettings.crtAspectRatio = aspectSelect.value;
				markDirty(win);
			});
		}

		if (crtCurvatureToggle) {
			crtCurvatureToggle.addEventListener('change', () => {
				pendingSettings.crtCurvatureEnabled = crtCurvatureToggle.checked;
				markDirty(win);
			});
		}

		if (curvatureSlider) {
			curvatureSlider.addEventListener('input', () => {
				pendingSettings.crtCurvatureAmount = parseFloat(curvatureSlider.value);
				if (curvatureVal) curvatureVal.textContent = `${Math.round(pendingSettings.crtCurvatureAmount * 100)}%`;
				markDirty(win);
			});
		}

		if (cornerSlider) {
			cornerSlider.addEventListener('input', () => {
				pendingSettings.crtCornerRadius = parseInt(cornerSlider.value, 10);
				if (cornerVal) cornerVal.textContent = `${pendingSettings.crtCornerRadius}px`;
				if (crtScreenPreview) crtScreenPreview.style.setProperty('--crt-preview-radius', `${pendingSettings.crtCornerRadius / 2}px`);
				markDirty(win);
			});
		}

		if (bezelSelect) {
			bezelSelect.value = pendingSettings.crtBezelColor || '#161616';
			bezelSelect.addEventListener('change', () => {
				pendingSettings.crtBezelColor = bezelSelect.value;
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

		const defaultPlayerSelect = win.querySelector('#settings-default-player');
		if (defaultPlayerSelect) {
			defaultPlayerSelect.value = pendingSettings.defaultAudioPlayer || 'mediaplayer';
			defaultPlayerSelect.addEventListener('change', () => {
				pendingSettings.defaultAudioPlayer = defaultPlayerSelect.value;
				markDirty(win);
			});
		}

		const defaultVizSelect = win.querySelector('#settings-default-viz');
		if (defaultVizSelect) {
			defaultVizSelect.value = pendingSettings.mediaPlayerVizPreset || 'albumart';
			defaultVizSelect.addEventListener('change', () => {
				pendingSettings.mediaPlayerVizPreset = defaultVizSelect.value;
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

		const taskbarSizeSelect = win.querySelector('#settings-taskbar-size');
		if (taskbarSizeSelect) {
			taskbarSizeSelect.value = pendingSettings.taskbarSize || 'medium';
			taskbarSizeSelect.addEventListener('change', () => {
				pendingSettings.taskbarSize = taskbarSizeSelect.value;
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

		let soundSpamCount = 0;
		let lastSoundSpamTime = 0;
		win.querySelectorAll('.sound-test-row button[data-sound]').forEach(btn => {
			btn.addEventListener('click', () => {
				const now = Date.now();
				if (now - lastSoundSpamTime < 1500) {
					soundSpamCount++;
				} else {
					soundSpamCount = 1;
				}
				lastSoundSpamTime = now;
				if (soundSpamCount >= 10 && window.AchievementsManager) {
					window.AchievementsManager.progress('soundboard_spammer', 1);
				}
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

		const showExtToggle = win.querySelector('#settings-show-ext');
		if (showExtToggle) {
			showExtToggle.addEventListener('change', () => {
				pendingSettings.showFileExtensions = showExtToggle.checked;
				markDirty(win);
			});
		}

		const exportBtn = win.querySelector('#settings-export-btn');
		if (exportBtn) {
			exportBtn.addEventListener('click', () => {
				const getVal = (k) => window.DeskStorage ? window.DeskStorage.getItem(k) : localStorage.getItem(k);
				const backupData = {
					settings: currentSettings,
					fileSystem: getVal('fileSystem') || null,
					recycleBin: getVal('recycleBinItems') || null,
					mailStore: getVal('wartets_xp_mailstore_v1') || null,
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
				reader.onload = async (event) => {
					try {
						const data = JSON.parse(event.target.result);
						const setVal = (k, v) => window.DeskStorage ? window.DeskStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v)) : localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
						if (data.settings) setVal(SETTINGS_STORAGE_KEY, data.settings);
						if (data.fileSystem) setVal('fileSystem', data.fileSystem);
						if (data.recycleBin) setVal('recycleBinItems', data.recycleBin);
						if (data.mailStore) setVal('wartets_xp_mailstore_v1', data.mailStore);
						if (window.DeskStorage) await window.DeskStorage.flush();
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

		const resetAchievementsBtn = win.querySelector('#settings-reset-achievements-btn');
		if (resetAchievementsBtn) {
			resetAchievementsBtn.addEventListener('click', () => {
				if (window.AchievementsManager && typeof window.AchievementsManager.reset === 'function') {
					window.AchievementsManager.reset(true);
				}
			});
		}

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
						callback: async (res) => {
							if (res === 'Yes') {
								if (window.AchievementsManager) window.AchievementsManager.progress('factory_reset', 1);
								const achState = window.DeskStorage ? window.DeskStorage.getItem('xp_achievements_state') : localStorage.getItem('xp_achievements_state');
								const bibCache = window.DeskStorage ? window.DeskStorage.getItem('xp_music_bib_isolated_cache') : localStorage.getItem('xp_music_bib_isolated_cache');
								if (window.DeskStorage) window.DeskStorage.clear();
								else localStorage.clear();
								if (achState) {
									if (window.DeskStorage) window.DeskStorage.setItem('xp_achievements_state', achState);
									else localStorage.setItem('xp_achievements_state', achState);
								}
								if (bibCache) {
									if (window.DeskStorage) window.DeskStorage.setItem('xp_music_bib_isolated_cache', bibCache);
									else localStorage.setItem('xp_music_bib_isolated_cache', bibCache);
								}
								if (window.DeskStorage) await window.DeskStorage.flush();
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
			if (window.AchievementsManager) {
				if (baseConfig && pendingSettings.userName !== baseConfig.userName && pendingSettings.userAvatar !== baseConfig.userAvatar) {
					window.AchievementsManager.progress('identity_crisis', 1);
				}
				if (pendingSettings.startButtonText && pendingSettings.startButtonText.toLowerCase() !== 'start') {
					window.AchievementsManager.progress('start_btn_custom', 1);
				}
				if (pendingSettings.animationSpeed === 'cinematic') {
					window.AchievementsManager.progress('cinematic_speed', 1);
				}
				if (pendingSettings.crtAspectRatio && pendingSettings.crtAspectRatio !== 'fullscreen') {
					window.AchievementsManager.progress('crt_aspect_changer', 1);
				}
				if (pendingSettings.achievementNotificationsEnabled === false && currentSettings.achievementNotificationsEnabled !== false) {
					window.AchievementsManager.progress('mute_achievements', 1);
				}
			}
			currentSettings = { ...pendingSettings };
			saveCurrentSettings();
			applyAllSettings();
			if (typeof applyInitialDesktopBackground === 'function') {
				applyInitialDesktopBackground();
			}
			if (window.ScreenSaverManager) {
				window.ScreenSaverManager.settings.activeSaver = currentSettings.screensaverActive || 'xp-flying-logo';
				window.ScreenSaverManager.settings.enabled = (currentSettings.screensaverActive !== 'none');
				window.ScreenSaverManager.settings.timeoutMinutes = currentSettings.screensaverTimeoutMinutes !== undefined ? currentSettings.screensaverTimeoutMinutes : 5;
				window.ScreenSaverManager.saveSettings();
				window.ScreenSaverManager.resetIdleTimer();
			}
			if (window.DeskEventBus) {
				window.DeskEventBus.emit('settings:changed', { settings: currentSettings });
			}
			if (applyBtn) applyBtn.disabled = true;
			SoundEngine.play('click');
		};

		if (applyBtn) applyBtn.addEventListener('click', commitChanges);

		if (okBtn) {
			okBtn.addEventListener('click', () => {
				commitChanges();
				if (window.ScreenSaverManager && ssCanvas) {
					window.ScreenSaverManager.stopPreview(ssCanvas, true);
				}
				if (typeof closeWindow === 'function') closeWindow(win, windowId);
			});
		}

		if (cancelBtn) {
			cancelBtn.addEventListener('click', () => {
				pendingSettings = { ...currentSettings };
				if (window.ScreenSaverManager && ssCanvas) {
					window.ScreenSaverManager.stopPreview(ssCanvas, true);
				}
				if (typeof closeWindow === 'function') closeWindow(win, windowId);
			});
		}

		win.beforeClose = (force) => {
			if (window.ScreenSaverManager && ssCanvas) {
				window.ScreenSaverManager.stopPreview(ssCanvas, true);
			}
			force();
		};
	}

	document.addEventListener('DOMContentLoaded', () => {
		if (currentSettings) {
			applyAllSettings();
		}
	});

	window.SettingsApp = {
		ready: () => settingsReadyPromise,
		open: (tab = 'system', options = {}) => openSettingsDialog(tab, options),
		get: (key) => {
			if (currentSettings && currentSettings[key] !== undefined) return currentSettings[key];
			if (baseConfig && baseConfig[key] !== undefined) return baseConfig[key];
			return undefined;
		},
		getAll: () => Object.assign({}, baseConfig || {}, currentSettings || {}),
		set: (key, value) => {
			if (!currentSettings) currentSettings = Object.assign({}, baseConfig || {});
			if (!pendingSettings) pendingSettings = Object.assign({}, currentSettings);
			currentSettings[key] = value;
			pendingSettings[key] = value;
			saveCurrentSettings();
			applyAllSettings();
			if (window.DeskEventBus) {
				window.DeskEventBus.emit('settings:changed', { key, value, settings: currentSettings });
			}
		},
		subscribe: (key, handler) => {
			if (!window.DeskEventBus) return () => {};
			return window.DeskEventBus.on('settings:changed', (payload) => {
				if (!key || payload.key === key) {
					handler(payload.value, payload.settings);
				}
			});
		},
		playSound: (type) => SoundEngine.play(type)
	};
})();
