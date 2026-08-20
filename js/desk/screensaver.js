(function () {
	const STORAGE_KEY = 'xp_screensaver_settings';

	const V_WIDTH = 800;

	function isAudioPlayingGlobally() {
		if (window.MediaPlayerApp && typeof window.MediaPlayerApp.isPlaying === 'boolean' && window.MediaPlayerApp.isPlaying) return true;
		if (typeof webampInstance !== 'undefined' && webampInstance && typeof webampInstance.getMediaStatus === 'function') {
			if (webampInstance.getMediaStatus() === 'PLAYING') return true;
		}
		const mediaElements = document.querySelectorAll('audio, video');
		for (const el of mediaElements) {
			if (!el.paused && !el.ended && el.currentTime > 0) return true;
		}
		return false;
	}

	class ScreenSaverManager {
		constructor() {
			this.settings = this.loadSettings();
			this.idleTimer = null;
			this.isRunning = false;
			this.overlayEl = null;
			this.canvasEl = null;
			this.ctx = null;
			this.gl = null;
			this.animFrameId = null;
			this.activePreviewLoops = new Map();
			this.previewRegistry = new Map();
			this.initListeners();
			this.resetIdleTimer();
		}

		loadSettings() {
			const defaults = (window.SettingsApp && typeof window.SettingsApp.getAll === 'function') 
				? window.SettingsApp.getAll() 
				: {};
			const baseSavers = defaults.screensaverSavers || {};
			const baseActive = defaults.screensaverActive || 'xp-flying-logo';
			const baseTimeout = defaults.screensaverTimeoutMinutes !== undefined ? defaults.screensaverTimeoutMinutes : 5;
			const baseEnabled = defaults.screensaverEnabled !== undefined ? defaults.screensaverEnabled : true;

			try {
				const saved = localStorage.getItem(STORAGE_KEY);
				if (saved) {
					const parsed = JSON.parse(saved);
					return {
						activeSaver: parsed.activeSaver || baseActive,
						timeoutMinutes: parsed.timeoutMinutes !== undefined ? parsed.timeoutMinutes : baseTimeout,
						enabled: parsed.enabled !== undefined ? parsed.enabled : baseEnabled,
						savers: {
							...baseSavers,
							...(parsed.savers || {})
						}
					};
				}
			} catch (e) {}

			return {
				activeSaver: baseActive,
				timeoutMinutes: baseTimeout,
				enabled: baseEnabled,
				savers: JSON.parse(JSON.stringify(baseSavers))
			};
		}

		saveSettings() {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
			} catch (e) {}
		}

		initListeners() {
			const reset = (e) => {
				if (this.isRunning) {
					if (Date.now() - this.startTime < 350) return;
					if (e && e.type === 'mousemove') {
						if (this.startMouseX === null || this.startMouseY === null) {
							this.startMouseX = e.clientX;
							this.startMouseY = e.clientY;
							return;
						}
						const dist = Math.hypot(e.clientX - this.startMouseX, e.clientY - this.startMouseY);
						if (dist < 10) return;
					}
					this.stop();
				}
				this.resetIdleTimer();
			};

			window.addEventListener('mousemove', reset, { passive: true });
			window.addEventListener('mousedown', reset, { passive: true });
			window.addEventListener('keydown', reset, { passive: true });
			window.addEventListener('touchstart', reset, { passive: true });
			window.addEventListener('wheel', reset, { passive: true });
		}

		resetIdleTimer() {
			if (this.idleTimer) {
				clearTimeout(this.idleTimer);
				this.idleTimer = null;
			}
			const timeoutVal = parseFloat(this.settings.timeoutMinutes);
			if (!this.settings.enabled || isNaN(timeoutVal) || timeoutVal <= 0) return;

			const ms = Math.max(3000, Math.round(timeoutVal * 60 * 1000));
			this.idleTimer = setTimeout(() => {
				this.start(false);
			}, ms);
		}

		start(isTest = false) {
			if (this.isRunning) return;
			if (!isTest && isAudioPlayingGlobally()) {
				this.resetIdleTimer();
				return;
			}
			this.pauseAllPreviews();
			this.isRunning = true;
			this.startTime = Date.now();
			this.startMouseX = null;
			this.startMouseY = null;

			const screenFrame = document.getElementById('screen-frame') || document.body;

			this.overlayEl = document.createElement('div');
			this.overlayEl.id = 'xp-screensaver-fullscreen';
			this.overlayEl.style.position = 'absolute';
			this.overlayEl.style.inset = '0';
			this.overlayEl.style.width = '100%';
			this.overlayEl.style.height = '100%';
			this.overlayEl.style.backgroundColor = '#000000';
			this.overlayEl.style.zIndex = '999999';
			this.overlayEl.style.cursor = 'none';
			this.overlayEl.style.overflow = 'hidden';

			this.canvasEl = document.createElement('canvas');
			this.canvasEl.style.width = '100%';
			this.canvasEl.style.height = '100%';
			this.canvasEl.style.display = 'block';
			this.overlayEl.appendChild(this.canvasEl);
			screenFrame.appendChild(this.overlayEl);

			this.resizeCanvas(this.canvasEl);

			let saverId = this.settings.activeSaver || 'xp-flying-logo';
			if (saverId === 'random') {
				const available = ['xp-flying-logo', 'bubbles', 'starfield', 'pipes', 'mystify', 'bezier'];
				saverId = available[Math.floor(Math.random() * available.length)];
			}

			const saverConfig = this.getSaverConfig(saverId);
			const runnerFactory = this.getSaverRunner(saverId);

			let vWidth = V_WIDTH;
			let vHeight = Math.max(300, Math.round((this.canvasEl.height / (this.canvasEl.width || 1)) * vWidth));
			let scale = this.canvasEl.width / vWidth;

			const instance = runnerFactory.createInstance(this.canvasEl, saverConfig, vWidth, vHeight);
			this.currentRunner = instance;

			const onResize = () => {
				this.resizeCanvas(this.canvasEl);
				vHeight = Math.max(300, Math.round((this.canvasEl.height / (this.canvasEl.width || 1)) * vWidth));
				scale = this.canvasEl.width / vWidth;
				if (instance.onResize) instance.onResize(this.canvasEl, this.ctx, saverConfig, vWidth, vHeight);
			};
			window.addEventListener('resize', onResize);
			this.currentResizeHandler = onResize;

			const loop = () => {
				if (!this.isRunning) return;
				if (instance.stepAndRender) {
					instance.stepAndRender(this.canvasEl, saverConfig, vWidth, vHeight, scale);
				} else {
					if (!this.ctx) this.ctx = this.canvasEl.getContext('2d');
					if (this.ctx) {
						instance.update(this.canvasEl, this.ctx, saverConfig, vWidth, vHeight);
						this.ctx.save();
						this.ctx.setTransform(scale, 0, 0, scale, 0, 0);
						instance.render(this.canvasEl, this.ctx, saverConfig, vWidth, vHeight);
						this.ctx.restore();
					}
				}
				if (this.isRunning) {
					this.animFrameId = requestAnimationFrame(loop);
				}
			};
			this.animFrameId = requestAnimationFrame(loop);
		}

		stop() {
			if (!this.isRunning) return;
			this.isRunning = false;

			if (this.animFrameId) {
				cancelAnimationFrame(this.animFrameId);
				this.animFrameId = null;
			}
			if (this.currentResizeHandler) {
				window.removeEventListener('resize', this.currentResizeHandler);
				this.currentResizeHandler = null;
			}
			if (this.currentRunner && typeof this.currentRunner.destroy === 'function') {
				this.currentRunner.destroy();
			}
			this.currentRunner = null;

			if (this.overlayEl) {
				this.overlayEl.remove();
				this.overlayEl = null;
			}
			this.canvasEl = null;
			this.ctx = null;
			this.gl = null;
			this.resetIdleTimer();
			this.resumeAllPreviews();
		}

		clearCanvas(canvasEl) {
			if (!canvasEl) return;
			try {
				const gl = canvasEl.getContext('webgl2') || canvasEl.getContext('webgl');
				if (gl && !gl.isContextLost()) {
					gl.viewport(0, 0, canvasEl.width, canvasEl.height);
					gl.clearColor(0, 0, 0, 1);
					gl.clear(gl.COLOR_BUFFER_BIT);
					return;
				}
			} catch (e) {}
			try {
				const ctx = canvasEl.getContext('2d');
				if (ctx) {
					ctx.fillStyle = '#000000';
					ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
				}
			} catch (e) {}
		}

		resizeCanvas(canvas) {
			if (!canvas) return;
			canvas.width = canvas.clientWidth || canvas.parentElement?.clientWidth || window.innerWidth;
			canvas.height = canvas.clientHeight || canvas.parentElement?.clientHeight || window.innerHeight;
		}

		getSaverConfig(saverId) {
			if (!this.settings.savers) this.settings.savers = {};
			if (!this.settings.savers[saverId]) {
				const appSavers = (window.SettingsApp && window.SettingsApp.get('screensaverSavers')) || {};
				this.settings.savers[saverId] = JSON.parse(JSON.stringify(appSavers[saverId] || {}));
			}
			return this.settings.savers[saverId];
		}

		getSaverRunner(saverId) {
			switch (saverId) {
				case 'bubbles': return BubblesScreenSaver;
				case 'starfield': return StarfieldScreenSaver;
				case 'pipes': return PipesScreenSaver;
				case 'mystify': return MystifyScreenSaver;
				case 'bezier': return BezierScreenSaver;
				case 'blank': return BlankScreenSaver;
				default: return FlyingLogoScreenSaver;
			}
		}

		ensureCleanCanvas(canvasEl) {
			if (!canvasEl) return canvasEl;
			const target = (canvasEl.id ? document.getElementById(canvasEl.id) : null) || canvasEl;
			if (!target || !target.parentNode) return target;
			const cleanCanvas = document.createElement('canvas');
			cleanCanvas.id = target.id;
			cleanCanvas.className = target.className;
			cleanCanvas.style.cssText = target.style.cssText;
			const w = target.clientWidth || parseInt(target.getAttribute('width'), 10) || 126;
			const h = target.clientHeight || parseInt(target.getAttribute('height'), 10) || 91;
			cleanCanvas.width = w;
			cleanCanvas.height = h;
			cleanCanvas.style.width = '100%';
			cleanCanvas.style.height = '100%';
			cleanCanvas.style.display = 'block';
			target.parentNode.replaceChild(cleanCanvas, target);
			return cleanCanvas;
		}

		startPreview(canvasEl, saverId, customConfig = null) {
			if (!canvasEl) return null;
			const targetCanvas = (canvasEl.id ? document.getElementById(canvasEl.id) : null) || canvasEl;
			for (const [c, loopData] of this.activePreviewLoops.entries()) {
				if (c === targetCanvas || (c.id && targetCanvas.id && c.id === targetCanvas.id)) {
					if (loopData && typeof loopData.stop === 'function') loopData.stop();
					this.activePreviewLoops.delete(c);
				}
			}

			const freshCanvas = this.ensureCleanCanvas(targetCanvas);
			this.previewRegistry.set(freshCanvas, { saverId, customConfig });

			if (this.isRunning || saverId === 'none') {
				this.clearCanvas(freshCanvas);
				return freshCanvas;
			}

			const effectiveSaver = (saverId === 'random' || !saverId) ? 'xp-flying-logo' : saverId;
			const w = freshCanvas.width || 126;
			const h = freshCanvas.height || 91;
			const config = customConfig || this.getSaverConfig(effectiveSaver);
			const runnerFactory = this.getSaverRunner(effectiveSaver);
			const vWidth = V_WIDTH;
			const vHeight = Math.max(300, Math.round((h / (w || 1)) * vWidth));
			const scale = w / vWidth;

			const instance = runnerFactory.createInstance(freshCanvas, config, vWidth, vHeight);

			let isPreviewActive = true;
			let currentConfig = config;
			let reqId = null;

			const loopRecord = {
				canvas: freshCanvas,
				stop: () => {
					isPreviewActive = false;
					if (reqId !== null) {
						cancelAnimationFrame(reqId);
						reqId = null;
					}
					if (instance && typeof instance.destroy === 'function') {
						instance.destroy();
					}
				},
				updateConfig: (newCfg) => {
					currentConfig = newCfg;
					if (instance && typeof instance.syncConfig === 'function') {
						instance.syncConfig(newCfg, vWidth, vHeight);
					}
				}
			};

			this.activePreviewLoops.set(freshCanvas, loopRecord);

			const loop = () => {
				if (!isPreviewActive) return;
				if (instance.stepAndRender) {
					instance.stepAndRender(freshCanvas, currentConfig, vWidth, vHeight, scale);
				} else {
					const ctx = freshCanvas.getContext('2d');
					if (ctx) {
						instance.update(freshCanvas, ctx, currentConfig, vWidth, vHeight);
						ctx.save();
						ctx.setTransform(scale, 0, 0, scale, 0, 0);
						instance.render(freshCanvas, ctx, currentConfig, vWidth, vHeight);
						ctx.restore();
					}
				}
				if (isPreviewActive) {
					reqId = requestAnimationFrame(loop);
				}
			};
			reqId = requestAnimationFrame(loop);
			return freshCanvas;
		}

		pauseAllPreviews() {
			for (const [, loopData] of this.activePreviewLoops.entries()) {
				if (loopData && typeof loopData.stop === 'function') {
					loopData.stop();
				}
			}
			this.activePreviewLoops.clear();
		}

		resumeAllPreviews() {
			if (this.isRunning) return;
			const entries = Array.from(this.previewRegistry.entries());
			for (const [canvasEl, data] of entries) {
				if (document.body.contains(canvasEl) && canvasEl.offsetParent !== null) {
					this.startPreview(canvasEl, data.saverId, data.customConfig);
				} else if (!document.body.contains(canvasEl)) {
					this.previewRegistry.delete(canvasEl);
				}
			}
		}

		stopPreview(canvasEl, clearToBlack = true) {
			if (!canvasEl) return;
			let target = canvasEl;
			for (const [c, loopData] of this.activePreviewLoops.entries()) {
				if (c === canvasEl || c.id === canvasEl.id) {
					if (loopData && typeof loopData.stop === 'function') loopData.stop();
					this.activePreviewLoops.delete(c);
					target = c;
				}
			}
			for (const c of this.previewRegistry.keys()) {
				if (c === canvasEl || c.id === canvasEl.id) {
					this.previewRegistry.delete(c);
				}
			}
			if (clearToBlack) {
				this.clearCanvas(target);
			}
		}

		updateActivePreviewConfig(canvasEl, newConfig) {
			if (!canvasEl) return;
			let entry = this.activePreviewLoops.get(canvasEl);
			if (!entry) {
				for (const [c, loopData] of this.activePreviewLoops.entries()) {
					if (c.id === canvasEl.id) {
						entry = loopData;
						break;
					}
				}
			}
			if (entry && entry.updateConfig) {
				entry.updateConfig(newConfig);
			}
		}

		renderConfigUI(container, saverId, onChangeCallback) {
			if (!container) return;
			container.innerHTML = '';
			const config = this.getSaverConfig(saverId);

			let html = '';
			if (saverId === 'xp-flying-logo') {
				html = `
					<div class="ss-opt-section">
						<div class="xp-form-row">
							<label style="width: 120px;">Flight Speed:</label>
							<input type="range" class="xp-slider" data-opt="speed" min="1" max="20" step="0.5" value="${config.speed || 4}">
							<span class="ss-val" style="width: 35px;">${config.speed || 4}</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 120px;">Logo Scale:</label>
							<input type="range" class="xp-slider" data-opt="logoScale" min="0.4" max="3.0" step="0.1" value="${config.logoScale || 1.0}">
							<span class="ss-val" style="width: 35px;">${(config.logoScale || 1.0).toFixed(1)}x</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 120px;">3D Rotation Speed:</label>
							<input type="range" class="xp-slider" data-opt="rotationSpeed" min="0" max="10" step="0.5" value="${config.rotationSpeed || 3}">
							<span class="ss-val" style="width: 35px;">${config.rotationSpeed || 3}</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 120px;">Wave Distortion:</label>
							<input type="range" class="xp-slider" data-opt="waveIntensity" min="0" max="12" step="0.5" value="${config.waveIntensity || 5}">
							<span class="ss-val" style="width: 35px;">${config.waveIntensity || 5}</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 120px;">3D Bevel Depth:</label>
							<input type="range" class="xp-slider" data-opt="extrusionDepth" min="0" max="30" step="2" value="${config.extrusionDepth || 12}">
							<span class="ss-val" style="width: 35px;">${config.extrusionDepth || 12}px</span>
						</div>
						<div class="xp-checkbox-row">
							<input type="checkbox" data-opt="trailEffect" id="chk-ss-trail" ${config.trailEffect ? 'checked' : ''}>
							<label for="chk-ss-trail">Enable phosphor particle trail</label>
						</div>
						<div class="xp-checkbox-row">
							<input type="checkbox" data-opt="starfieldBackground" id="chk-ss-stars" ${config.starfieldBackground ? 'checked' : ''}>
							<label for="chk-ss-stars">Deep space starfield backdrop</label>
						</div>
					</div>
				`;
			} else if (saverId === 'bubbles') {
				html = `
					<div class="ss-opt-section">
						<div class="xp-form-row">
							<label style="width: 130px;">Bubble Count:</label>
							<input type="range" class="xp-slider" data-opt="bubbleCount" min="5" max="1500" step="5" value="${config.bubbleCount || 80}">
							<span class="ss-val" style="width: 40px;">${config.bubbleCount || 80}</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 130px;">Mean Radius:</label>
							<input type="range" class="xp-slider" data-opt="baseRadius" min="4" max="80" step="1" value="${config.baseRadius || 22}">
							<span class="ss-val" style="width: 40px;">${config.baseRadius || 22}px</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 130px;">Size Variation:</label>
							<input type="range" class="xp-slider" data-opt="radiusVariation" min="0" max="1" step="0.05" value="${config.radiusVariation !== undefined ? config.radiusVariation : 0.6}">
							<span class="ss-val" style="width: 40px;">${Math.round((config.radiusVariation !== undefined ? config.radiusVariation : 0.6) * 100)}%</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 130px;">Initial Energy (Speed):</label>
							<input type="range" class="xp-slider" data-opt="speed" min="0.5" max="15" step="0.5" value="${config.speed || 3.5}">
							<span class="ss-val" style="width: 40px;">${config.speed || 3.5}</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 130px;">Mass-Radius Ratio:</label>
							<select class="xp-select" data-opt="massExponent" style="flex: 1;">
								<option value="1" ${String(config.massExponent) === '1' ? 'selected' : ''}>Linear (~ 1D Perimeter)</option>
								<option value="2" ${String(config.massExponent) === '2' ? 'selected' : ''}>Area (~ 2D Disc Surface)</option>
								<option value="3" ${String(config.massExponent) === '3' ? 'selected' : ''}>Volume (~ 3D Sphere Density)</option>
							</select>
						</div>
						<div class="xp-form-row">
							<label style="width: 130px;">Elasticity (Bounciness):</label>
							<input type="range" class="xp-slider" data-opt="restitution" min="0.5" max="1.0" step="0.02" value="${config.restitution !== undefined ? config.restitution : 1.0}">
							<span class="ss-val" style="width: 40px;">${Math.round((config.restitution !== undefined ? config.restitution : 1.0) * 100)}%</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 130px;">Buoyancy / Gravity:</label>
							<input type="range" class="xp-slider" data-opt="gravityY" min="-1.5" max="1.5" step="0.05" value="${config.gravityY !== undefined ? config.gravityY : 0.0}">
							<span class="ss-val" style="width: 40px;">${(config.gravityY !== undefined ? config.gravityY : 0.0).toFixed(2)}</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 130px;">Color Scheme:</label>
							<select class="xp-select" data-opt="colorScheme" style="flex: 1;">
								<option value="soap" ${config.colorScheme === 'soap' ? 'selected' : ''}>Soap Bubble (Iridescent Glow)</option>
								<option value="aqua" ${config.colorScheme === 'aqua' ? 'selected' : ''}>Windows XP Royale Aqua</option>
								<option value="candy" ${config.colorScheme === 'candy' ? 'selected' : ''}>Glossy Candy Orbs</option>
								<option value="glass" ${config.colorScheme === 'glass' ? 'selected' : ''}>Clear Glass Crystal</option>
								<option value="neon" ${config.colorScheme === 'neon' ? 'selected' : ''}>Cyber Luminous Neon</option>
								<option value="matrix" ${config.colorScheme === 'matrix' ? 'selected' : ''}>Phosphor Matrix Green</option>
								<option value="monochrome" ${config.colorScheme === 'monochrome' ? 'selected' : ''}>Pearl Monochrome</option>
							</select>
						</div>
						<div class="xp-checkbox-row">
							<input type="checkbox" data-opt="specularHighlights" id="chk-ss-specular" ${config.specularHighlights !== false ? 'checked' : ''}>
							<label for="chk-ss-specular">Render curved glass specular reflections and rim lighting</label>
						</div>
					</div>
				`;
			} else if (saverId === 'starfield') {
				html = `
					<div class="ss-opt-section">
						<div class="xp-form-row">
							<label style="width: 120px;">Star Count:</label>
							<input type="range" class="xp-slider" data-opt="starCount" min="50" max="1200" step="50" value="${config.starCount || 500}">
							<span class="ss-val" style="width: 35px;">${config.starCount || 500}</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 120px;">Warp Speed:</label>
							<input type="range" class="xp-slider" data-opt="speed" min="1" max="25" step="0.5" value="${config.speed || 6}">
							<span class="ss-val" style="width: 35px;">${config.speed || 6}</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 120px;">Streak Length:</label>
							<input type="range" class="xp-slider" data-opt="streakLength" min="1" max="15" step="0.5" value="${config.streakLength || 6}">
							<span class="ss-val" style="width: 35px;">${config.streakLength || 6}</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 120px;">Color Mode:</label>
							<select class="xp-select" data-opt="colorMode" style="flex: 1;">
								<option value="white" ${config.colorMode === 'white' ? 'selected' : ''}>Monochrome White</option>
								<option value="spectral" ${config.colorMode === 'spectral' ? 'selected' : ''}>Spectral Deep Space</option>
								<option value="rainbow" ${config.colorMode === 'rainbow' ? 'selected' : ''}>Rainbow Prism</option>
								<option value="amber" ${config.colorMode === 'amber' ? 'selected' : ''}>Amber Glow</option>
							</select>
						</div>
						<div class="xp-checkbox-row">
							<input type="checkbox" data-opt="centerGlow" id="chk-ss-centerglow" ${config.centerGlow ? 'checked' : ''}>
							<label for="chk-ss-centerglow">Radial warp center flare</label>
						</div>
					</div>
				`;
			} else if (saverId === 'pipes') {
				html = `
					<div class="ss-opt-section">
						<div class="xp-form-row">
							<label style="width: 120px;">Pipe Speed:</label>
							<input type="range" class="xp-slider" data-opt="pipeSpeed" min="1" max="15" step="1" value="${config.pipeSpeed || 4}">
							<span class="ss-val" style="width: 35px;">${config.pipeSpeed || 4}</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 120px;">Max Pipes:</label>
							<input type="range" class="xp-slider" data-opt="maxPipes" min="1" max="10" step="1" value="${config.maxPipes || 5}">
							<span class="ss-val" style="width: 35px;">${config.maxPipes || 5}</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 120px;">Pipe Thickness:</label>
							<input type="range" class="xp-slider" data-opt="pipeRadius" min="4" max="24" step="2" value="${config.pipeRadius || 10}">
							<span class="ss-val" style="width: 35px;">${config.pipeRadius || 10}px</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 120px;">Joint Style:</label>
							<select class="xp-select" data-opt="jointType" style="flex: 1;">
								<option value="mixed" ${config.jointType === 'mixed' ? 'selected' : ''}>Mixed (Spheres & Elbows)</option>
								<option value="ball" ${config.jointType === 'ball' ? 'selected' : ''}>Spherical Ball Joints</option>
								<option value="elbow" ${config.jointType === 'elbow' ? 'selected' : ''}>90° Curved Elbows</option>
							</select>
						</div>
						<div class="xp-form-row">
							<label style="width: 120px;">Shading:</label>
							<select class="xp-select" data-opt="shading" style="flex: 1;">
								<option value="shiny" ${config.shading === 'shiny' ? 'selected' : ''}>Specular Metallic (XP 3D)</option>
								<option value="matte" ${config.shading === 'matte' ? 'selected' : ''}>Smooth Matte</option>
							</select>
						</div>
						<div class="xp-form-row">
							<label style="width: 120px;">Palette:</label>
							<select class="xp-select" data-opt="colorScheme" style="flex: 1;">
								<option value="classic" ${config.colorScheme === 'classic' ? 'selected' : ''}>Classic Windows XP</option>
								<option value="neon" ${config.colorScheme === 'neon' ? 'selected' : ''}>Vibrant Neon</option>
								<option value="copper" ${config.colorScheme === 'copper' ? 'selected' : ''}>Industrial Copper</option>
								<option value="candy" ${config.colorScheme === 'candy' ? 'selected' : ''}>Candy Pastel</option>
							</select>
						</div>
					</div>
				`;
			} else if (saverId === 'mystify') {
				html = `
					<div class="ss-opt-section">
						<div class="xp-form-row">
							<label style="width: 120px;">Motion Speed:</label>
							<input type="range" class="xp-slider" data-opt="speed" min="1" max="18" step="0.5" value="${config.speed || 4}">
							<span class="ss-val" style="width: 35px;">${config.speed || 4}</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 120px;">Ribbon Trails:</label>
							<input type="range" class="xp-slider" data-opt="linesCount" min="2" max="30" step="1" value="${config.linesCount || 12}">
							<span class="ss-val" style="width: 35px;">${config.linesCount || 12}</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 120px;">Polygons:</label>
							<input type="range" class="xp-slider" data-opt="polygonCount" min="1" max="6" step="1" value="${config.polygonCount || 2}">
							<span class="ss-val" style="width: 35px;">${config.polygonCount || 2}</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 120px;">Vertices / Polygon:</label>
							<input type="range" class="xp-slider" data-opt="vertexCount" min="3" max="8" step="1" value="${config.vertexCount || 4}">
							<span class="ss-val" style="width: 35px;">${config.vertexCount || 4}</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 120px;">Line Thickness:</label>
							<input type="range" class="xp-slider" data-opt="lineWidth" min="0.5" max="5" step="0.5" value="${config.lineWidth || 1.5}">
							<span class="ss-val" style="width: 35px;">${config.lineWidth || 1.5}px</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 120px;">Color Scheme:</label>
							<select class="xp-select" data-opt="colorScheme" style="flex: 1;">
								<option value="rainbow" ${config.colorScheme === 'rainbow' ? 'selected' : ''}>Rainbow Spectrum</option>
								<option value="fire" ${config.colorScheme === 'fire' ? 'selected' : ''}>Fire Glow</option>
								<option value="ocean" ${config.colorScheme === 'ocean' ? 'selected' : ''}>Ocean Blue</option>
								<option value="aurora" ${config.colorScheme === 'aurora' ? 'selected' : ''}>Aurora Green</option>
							</select>
						</div>
					</div>
				`;
			} else if (saverId === 'bezier') {
				html = `
					<div class="ss-opt-section">
						<div class="xp-form-row">
							<label style="width: 120px;">Motion Speed:</label>
							<input type="range" class="xp-slider" data-opt="speed" min="1" max="18" step="0.5" value="${config.speed || 4}">
							<span class="ss-val" style="width: 35px;">${config.speed || 4}</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 120px;">Curve Ribbons:</label>
							<input type="range" class="xp-slider" data-opt="curveCount" min="1" max="6" step="1" value="${config.curveCount || 3}">
							<span class="ss-val" style="width: 35px;">${config.curveCount || 3}</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 120px;">Segments / Trail:</label>
							<input type="range" class="xp-slider" data-opt="segments" min="5" max="50" step="2" value="${config.segments || 25}">
							<span class="ss-val" style="width: 35px;">${config.segments || 25}</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 120px;">Line Thickness:</label>
							<input type="range" class="xp-slider" data-opt="lineWidth" min="0.5" max="5" step="0.5" value="${config.lineWidth || 1.5}">
							<span class="ss-val" style="width: 35px;">${config.lineWidth || 1.5}px</span>
						</div>
						<div class="xp-form-row">
							<label style="width: 120px;">Palette:</label>
							<select class="xp-select" data-opt="colorScheme" style="flex: 1;">
								<option value="vibrant" ${config.colorScheme === 'vibrant' ? 'selected' : ''}>Vibrant Prism</option>
								<option value="aurora" ${config.colorScheme === 'aurora' ? 'selected' : ''}>Northern Lights</option>
								<option value="electric" ${config.colorScheme === 'electric' ? 'selected' : ''}>Electric Blue</option>
								<option value="sunset" ${config.colorScheme === 'sunset' ? 'selected' : ''}>Sunset Orange</option>
							</select>
						</div>
					</div>
				`;
			} else if (saverId === 'blank') {
				html = `<div style="font-size:11px;color:#555;padding:6px 0;">No configurable options for Blank Screen.</div>`;
			}

			container.innerHTML = html;

			container.querySelectorAll('[data-opt]').forEach(input => {
				const optName = input.dataset.opt;
				const updateVal = () => {
					if (input.type === 'checkbox') {
						config[optName] = input.checked;
					} else if (input.type === 'range') {
						const num = parseFloat(input.value);
						config[optName] = num;
						const valSpan = input.parentElement.querySelector('.ss-val');
						if (valSpan) valSpan.textContent = input.dataset.opt === 'logoScale' ? `${num.toFixed(1)}x` : String(num);
					} else {
						config[optName] = input.value;
					}
					this.saveSettings();
					if (typeof onChangeCallback === 'function') onChangeCallback(config);
				};
				input.addEventListener('input', updateVal);
				input.addEventListener('change', updateVal);
			});
		}
	}

	class BlankSimulation {
		constructor(canvas, config, vWidth, vHeight) {
			this.ctx = canvas.getContext('2d');
			if (this.ctx) {
				this.ctx.fillStyle = '#000000';
				this.ctx.fillRect(0, 0, vWidth, vHeight);
			}
		}
		update() {}
		render(canvas, ctx, config, vWidth, vHeight) {
			ctx.fillStyle = '#000000';
			ctx.fillRect(0, 0, vWidth, vHeight);
		}
		destroy() {
			this.ctx = null;
		}
	}

	class StarfieldSimulation {
		constructor(canvas, config, vWidth, vHeight) {
			this.maxDepth = 1200;
			this.stars = null;
			this.syncConfig(config, vWidth, vHeight);
		}

		syncConfig(config, vWidth, vHeight) {
			const count = Math.min(1200, config.starCount || 500);
			this.stars = new Float32Array(count * 6);
			for (let i = 0; i < count; i++) {
				const offset = i * 6;
				this.stars[offset] = (Math.random() - 0.5) * vWidth * 2.5;
				this.stars[offset + 1] = (Math.random() - 0.5) * vHeight * 2.5;
				this.stars[offset + 2] = Math.random() * this.maxDepth + 10;
				this.stars[offset + 3] = this.stars[offset + 2];
				this.stars[offset + 4] = Math.random() * 1.6 + 0.7;
				this.stars[offset + 5] = Math.floor(Math.random() * 5);
			}
		}

		update(canvas, ctx, config, vWidth, vHeight) {
			if (!this.stars) this.syncConfig(config, vWidth, vHeight);
			const count = this.stars.length / 6;
			const speed = (config.speed || 6) * 2.4;

			for (let i = 0; i < count; i++) {
				const offset = i * 6;
				this.stars[offset + 3] = this.stars[offset + 2];
				this.stars[offset + 2] -= speed;

				if (this.stars[offset + 2] <= 10) {
					this.stars[offset] = (Math.random() - 0.5) * vWidth * 2.5;
					this.stars[offset + 1] = (Math.random() - 0.5) * vHeight * 2.5;
					this.stars[offset + 2] = this.maxDepth;
					this.stars[offset + 3] = this.maxDepth;
				}
			}
		}

		render(canvas, ctx, config, vWidth, vHeight) {
			ctx.fillStyle = '#000000';
			ctx.fillRect(0, 0, vWidth, vHeight);

			const cx = vWidth / 2;
			const cy = vHeight / 2;
			const fov = cx;

			if (config.centerGlow) {
				const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, Math.min(vWidth, vHeight) * 0.45);
				grad.addColorStop(0, 'rgba(40, 90, 180, 0.22)');
				grad.addColorStop(0.5, 'rgba(15, 35, 90, 0.06)');
				grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
				ctx.fillStyle = grad;
				ctx.fillRect(0, 0, vWidth, vHeight);
			}

			if (!this.stars) return;
			const count = this.stars.length / 6;
			const streakMul = (config.streakLength || 6) * 0.35;
			const mode = config.colorMode || 'white';

			for (let i = 0; i < count; i++) {
				const offset = i * 6;
				const x = this.stars[offset];
				const y = this.stars[offset + 1];
				const z = this.stars[offset + 2];
				const pz = Math.min(this.maxDepth, z + (this.stars[offset + 3] - z) * streakMul);
				const size = this.stars[offset + 4];
				const cIdx = this.stars[offset + 5];

				const sx = (x / z) * fov + cx;
				const sy = (y / z) * fov + cy;
				const px = (x / pz) * fov + cx;
				const py = (y / pz) * fov + cy;

				if (sx < -20 || sx > vWidth + 20 || sy < -20 || sy > vHeight + 20) continue;

				const depthAlpha = Math.min(1, Math.max(0.1, 1 - (z / this.maxDepth)));
				const width = Math.max(0.7, (1 - z / this.maxDepth) * size * 2.0);

				ctx.beginPath();
				ctx.moveTo(px, py);
				ctx.lineTo(sx, sy);

				let strokeColor = `rgba(255, 255, 255, ${depthAlpha})`;
				if (mode === 'amber') {
					strokeColor = `rgba(255, 183, 77, ${depthAlpha})`;
				} else if (mode === 'spectral') {
					const colors = ['255, 255, 255', '162, 202, 255', '255, 224, 130', '255, 138, 128', '178, 255, 89'];
					strokeColor = `rgba(${colors[cIdx % colors.length]}, ${depthAlpha})`;
				} else if (mode === 'rainbow') {
					const hues = [0, 45, 60, 120, 195, 270, 310];
					strokeColor = `hsla(${hues[cIdx % hues.length]}, 100%, 75%, ${depthAlpha})`;
				}

				ctx.strokeStyle = strokeColor;
				ctx.lineWidth = width;
				ctx.lineCap = 'round';
				ctx.stroke();
			}
		}

		destroy() {
			this.stars = null;
		}
	}

	class FlyingLogoSimulation {
		constructor(canvas, config, vWidth, vHeight) {
			const sCount = 180;
			this.stars = new Float32Array(sCount * 4);
			for (let i = 0; i < sCount; i++) {
				const off = i * 4;
				this.stars[off] = (Math.random() - 0.5) * vWidth * 2.8;
				this.stars[off + 1] = (Math.random() - 0.5) * vHeight * 2.8;
				this.stars[off + 2] = Math.random() * 1100 + 40;
				this.stars[off + 3] = Math.random() * 1.4 + 0.6;
			}

			const maxParticles = 50;
			this.particles = new Float32Array(maxParticles * 6);
			this.pIndex = 0;

			const spd = (config.speed || 4) * 0.9;
			this.logo = {
				x: (Math.random() - 0.5) * (vWidth * 0.35),
				y: (Math.random() - 0.5) * (vHeight * 0.35),
				z: Math.random() * 300 + 400,
				vx: (Math.random() > 0.5 ? 1 : -1) * spd * 1.1,
				vy: (Math.random() > 0.5 ? 1 : -1) * spd * 0.85,
				vz: (Math.random() > 0.5 ? 1 : -1) * spd * 0.75,
				rx: 0.2,
				ry: 0.3,
				rz: 0.1,
				vrx: 0.012 * ((config.rotationSpeed || 3) / 3),
				vry: 0.018 * ((config.rotationSpeed || 3) / 3),
				vrz: 0.008 * ((config.rotationSpeed || 3) / 3)
			};
		}

		syncConfig(config) {
			const spd = (config.speed || 4) * 0.9;
			const dirX = Math.sign(this.logo.vx) || 1;
			const dirY = Math.sign(this.logo.vy) || 1;
			const dirZ = Math.sign(this.logo.vz) || 1;
			this.logo.vx = dirX * spd * 1.1;
			this.logo.vy = dirY * spd * 0.85;
			this.logo.vz = dirZ * spd * 0.75;
			const rot = (config.rotationSpeed !== undefined ? config.rotationSpeed : 3) / 3;
			this.logo.vrx = 0.012 * rot;
			this.logo.vry = 0.018 * rot;
			this.logo.vrz = 0.008 * rot;
		}

		update(canvas, ctx, config, vWidth, vHeight) {
			const sCount = this.stars.length / 4;
			const starSpeed = (config.speed || 4) * 1.1;

			for (let i = 0; i < sCount; i++) {
				const off = i * 4;
				this.stars[off + 2] -= starSpeed;
				if (this.stars[off + 2] <= 10) {
					this.stars[off] = (Math.random() - 0.5) * vWidth * 2.8;
					this.stars[off + 1] = (Math.random() - 0.5) * vHeight * 2.8;
					this.stars[off + 2] = 1100;
				}
			}

			const l = this.logo;
			l.x += l.vx;
			l.y += l.vy;
			l.z += l.vz;
			l.rx += l.vrx;
			l.ry += l.vry;
			l.rz += l.vrz;

			const minZ = 240;
			const maxZ = 850;
			if (l.z <= minZ) { l.z = minZ; l.vz = Math.abs(l.vz); }
			else if (l.z >= maxZ) { l.z = maxZ; l.vz = -Math.abs(l.vz); }

			const fov = 400;
			const projScale = fov / l.z;
			const halfW = 85 * (config.logoScale || 1.0) * projScale;
			const halfH = 65 * (config.logoScale || 1.0) * projScale;

			const screenX = l.x * projScale + vWidth / 2;
			const screenY = l.y * projScale + vHeight / 2;

			if (screenX - halfW <= 20) { l.vx = Math.abs(l.vx); }
			else if (screenX + halfW >= vWidth - 20) { l.vx = -Math.abs(l.vx); }

			if (screenY - halfH <= 20) { l.vy = Math.abs(l.vy); }
			else if (screenY + halfH >= vHeight - 20) { l.vy = -Math.abs(l.vy); }

			if (config.trailEffect !== false && this.particles) {
				const pCount = this.particles.length / 6;
				const off = this.pIndex * 6;
				this.particles[off] = screenX + (Math.random() - 0.5) * halfW;
				this.particles[off + 1] = screenY + (Math.random() - 0.5) * halfH;
				this.particles[off + 2] = (Math.random() - 0.5) * 1.5;
				this.particles[off + 3] = (Math.random() - 0.5) * 1.5;
				this.particles[off + 4] = (Math.random() * 3 + 2) * Math.max(0.6, projScale);
				this.particles[off + 5] = 0.9;
				this.pIndex = (this.pIndex + 1) % pCount;
			}

			if (this.particles) {
				const pCount = this.particles.length / 6;
				for (let i = 0; i < pCount; i++) {
					const off = i * 6;
					if (this.particles[off + 5] > 0) {
						this.particles[off] += this.particles[off + 2];
						this.particles[off + 1] += this.particles[off + 3];
						this.particles[off + 5] -= 0.03;
					}
				}
			}
		}

		render(canvas, ctx, config, vWidth, vHeight) {
			ctx.fillStyle = '#000000';
			ctx.fillRect(0, 0, vWidth, vHeight);

			const cx = vWidth / 2;
			const cy = vHeight / 2;
			const fov = 400;

			if (config.starfieldBackground !== false && this.stars) {
				const sCount = this.stars.length / 4;
				for (let i = 0; i < sCount; i++) {
					const off = i * 4;
					const z = this.stars[off + 2];
					const sx = (this.stars[off] / z) * fov + cx;
					const sy = (this.stars[off + 1] / z) * fov + cy;
					if (sx < 0 || sx >= vWidth || sy < 0 || sy >= vHeight) continue;
					const depth = Math.max(0.1, 1 - (z / 1100));
					ctx.beginPath();
					ctx.arc(sx, sy, this.stars[off + 3] * depth * 1.5, 0, Math.PI * 2);
					ctx.fillStyle = `rgba(255, 255, 255, ${depth})`;
					ctx.fill();
				}
			}

			if (config.trailEffect !== false && this.particles) {
				const pCount = this.particles.length / 6;
				const colors = ['#eb3c00', '#5ebd00', '#009fe3', '#ffb900'];
				for (let i = 0; i < pCount; i++) {
					const off = i * 6;
					const alpha = this.particles[off + 5];
					if (alpha > 0) {
						ctx.beginPath();
						ctx.arc(this.particles[off], this.particles[off + 1], this.particles[off + 4], 0, Math.PI * 2);
						ctx.fillStyle = colors[i % colors.length];
						ctx.globalAlpha = Math.max(0, alpha);
						ctx.fill();
					}
				}
				ctx.globalAlpha = 1.0;
			}

			const l = this.logo;
			const projScale = fov / l.z;
			const screenX = l.x * projScale + cx;
			const screenY = l.y * projScale + cy;
			const scale = (config.logoScale || 1.0) * projScale * 1.6;

			ctx.save();
			ctx.translate(screenX, screenY);

			const cosX = Math.cos(l.rx);
			const sinX = Math.sin(l.rx);
			const cosY = Math.cos(l.ry);
			const sinY = Math.sin(l.ry);
			const cosZ = Math.cos(l.rz);
			const sinZ = Math.sin(l.rz);

			ctx.transform(
				cosY * cosZ * scale,
				(cosX * sinZ + sinX * sinY * cosZ) * scale,
				(-cosX * sinY * cosZ + sinX * sinZ) * scale,
				cosX * cosZ * scale,
				0,
				0
			);

			const extr = config.extrusionDepth !== undefined ? config.extrusionDepth : 12;
			const wave = config.waveIntensity !== undefined ? config.waveIntensity : 5;
			const time = performance.now() * 0.003;
			const tileSize = 36;
			const gap = 5;

			const tiles = [
				{ colorTop: '#ff5722', colorBase: '#d03000', col: -1, row: -1 },
				{ colorTop: '#8bc34a', colorBase: '#4c9b00', col: 1, row: -1 },
				{ colorTop: '#03a9f4', colorBase: '#0277bd', col: -1, row: 1 },
				{ colorTop: '#ffc107', colorBase: '#e69a00', col: 1, row: 1 }
			];

			for (let e = extr; e >= 0; e -= 3) {
				const isFront = (e === 0);
				const layerAlpha = isFront ? 1.0 : Math.max(0.35, 1 - (e / extr) * 0.65);

				for (let t = 0; t < 4; t++) {
					const tile = tiles[t];
					const baseX = tile.col * (tileSize / 2 + gap / 2) + (tile.col < 0 ? -tileSize / 2 : 0);
					const baseY = tile.row * (tileSize / 2 + gap / 2) + (tile.row < 0 ? -tileSize / 2 : 0);
					const waveOffset = Math.sin(time + tile.col * 0.8 + tile.row * 0.8) * wave;
					const drawX = baseX + e * 0.45;
					const drawY = baseY + e * 0.45 + waveOffset;

					ctx.beginPath();
					const r = 4;
					ctx.moveTo(drawX + r, drawY);
					ctx.lineTo(drawX + tileSize - r, drawY);
					ctx.quadraticCurveTo(drawX + tileSize, drawY, drawX + tileSize, drawY + r);
					ctx.lineTo(drawX + tileSize, drawY + tileSize - r);
					ctx.quadraticCurveTo(drawX + tileSize, drawY + tileSize, drawX + tileSize - r, drawY + tileSize);
					ctx.lineTo(drawX + r, drawY + tileSize);
					ctx.quadraticCurveTo(drawX, drawY, drawX + r, drawY);
					ctx.closePath();

					if (isFront) {
						const grad = ctx.createLinearGradient(drawX, drawY, drawX + tileSize, drawY + tileSize);
						grad.addColorStop(0, '#ffffff');
						grad.addColorStop(0.2, tile.colorTop);
						grad.addColorStop(1, tile.colorBase);
						ctx.fillStyle = grad;
					} else {
						ctx.fillStyle = tile.colorBase;
					}
					ctx.globalAlpha = layerAlpha;
					ctx.fill();

					if (isFront) {
						ctx.lineWidth = 1.0;
						ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
						ctx.stroke();
					}
				}
			}

			ctx.globalAlpha = 1.0;
			ctx.fillStyle = '#ffffff';
			ctx.font = 'bold 14px "Trebuchet MS", "Segoe UI", Arial, sans-serif';
			ctx.textAlign = 'center';
			ctx.fillText('Windows XP', 0, tileSize + gap + 18);

			ctx.restore();
		}

		destroy() {
			this.stars = null;
			this.particles = null;
		}
	}

	class PipesSimulation {
		constructor(canvas, config, vWidth, vHeight) {
			this.vWidth = vWidth;
			this.vHeight = vHeight;
			this.cellSize = 28;
			this.totalDrawnSegments = 0;
			this.bufferCanvas = document.createElement('canvas');
			this.bufferCanvas.width = vWidth;
			this.bufferCanvas.height = vHeight;
			this.bufferCtx = this.bufferCanvas.getContext('2d');
			if (this.bufferCtx) {
				this.bufferCtx.fillStyle = '#000000';
				this.bufferCtx.fillRect(0, 0, vWidth, vHeight);
			}

			this.pipes = [];
			const count = config.maxPipes || 5;
			for (let i = 0; i < count; i++) {
				this.spawnPipe(config);
			}
		}

		onResize(canvas, ctx, config, vWidth, vHeight) {
			this.vWidth = vWidth;
			this.vHeight = vHeight;
			this.bufferCanvas.width = vWidth;
			this.bufferCanvas.height = vHeight;
			if (this.bufferCtx) {
				this.bufferCtx.fillStyle = '#000000';
				this.bufferCtx.fillRect(0, 0, vWidth, vHeight);
			}
			this.pipes = [];
			this.totalDrawnSegments = 0;
			const count = config.maxPipes || 5;
			for (let i = 0; i < count; i++) {
				this.spawnPipe(config);
			}
		}

		syncConfig(config, vWidth, vHeight) {
			this.vWidth = vWidth;
			this.vHeight = vHeight;
			const targetCount = config.maxPipes || 5;
			while (this.pipes.length < targetCount) {
				this.spawnPipe(config);
			}
			if (this.pipes.length > targetCount) {
				this.pipes.length = targetCount;
			}
		}

		spawnPipe(config) {
			const cs = this.cellSize;
			const cols = Math.max(4, Math.floor(this.vWidth / cs));
			const rows = Math.max(4, Math.floor(this.vHeight / cs));

			const schemes = {
				classic: ['#0055ea', '#cc2222', '#22aa22', '#d4a000', '#9c27b0', '#0097a7', '#e65100'],
				neon: ['#00e5ff', '#ff007f', '#76ff03', '#ffff00', '#d500f9'],
				copper: ['#b87333', '#cd7f32', '#d4af37', '#8b5a2b', '#e5aa70'],
				candy: ['#ff80ab', '#80d8ff', '#b9f6ca', '#ffe57f', '#ea80fc']
			};

			const palette = schemes[config.colorScheme] || schemes.classic;
			const color = palette[Math.floor(Math.random() * palette.length)];

			const dirs = [
				{ dx: 1, dy: 0 },
				{ dx: -1, dy: 0 },
				{ dx: 0, dy: 1 },
				{ dx: 0, dy: -1 }
			];
			const dir = dirs[Math.floor(Math.random() * dirs.length)];

			this.pipes.push({
				x: Math.floor(Math.random() * cols) * cs + cs / 2,
				y: Math.floor(Math.random() * rows) * cs + cs / 2,
				dir,
				color,
				length: 0,
				radius: (config.pipeRadius || 10)
			});
		}

		update(canvas, ctx, config, vWidth, vHeight) {
			if (!this.bufferCtx) return;

			const cs = this.cellSize;
			const speed = Math.min(6, config.pipeSpeed || 3);
			const bCtx = this.bufferCtx;
			const dirs = [
				{ dx: 1, dy: 0 },
				{ dx: -1, dy: 0 },
				{ dx: 0, dy: 1 },
				{ dx: 0, dy: -1 }
			];

			const baseSpeed = 4;
			const baseFade = 0.001;
			const fadeAmount = baseFade * (speed / baseSpeed);

			bCtx.fillStyle = `rgba(0, 0, 0, ${fadeAmount})`;
			bCtx.fillRect(0, 0, vWidth, vHeight);

			for (let step = 0; step < speed; step++) {
				for (let i = 0; i < this.pipes.length; i++) {
					const p = this.pipes[i];
					const prevX = p.x;
					const prevY = p.y;
					const r = p.radius;

					p.x += p.dir.dx * cs;
					p.y += p.dir.dy * cs;
					p.length++;
					this.totalDrawnSegments++;

					const grad = bCtx.createLinearGradient(prevX - r, prevY - r, p.x + r, p.y + r);
					grad.addColorStop(0, '#ffffff');
					grad.addColorStop(0.25, p.color);
					grad.addColorStop(0.75, p.color);
					grad.addColorStop(1, '#080808');

					bCtx.beginPath();
					bCtx.moveTo(prevX, prevY);
					bCtx.lineTo(p.x, p.y);
					bCtx.strokeStyle = (config.shading === 'matte') ? p.color : grad;
					bCtx.lineWidth = r * 2;
					bCtx.lineCap = 'round';
					bCtx.stroke();

					if (config.jointType === 'ball' || (config.jointType === 'mixed' && Math.random() < 0.4)) {
						const radGrad = bCtx.createRadialGradient(p.x - r * 0.3, p.y - r * 0.3, r * 0.15, p.x, p.y, r * 1.25);
						radGrad.addColorStop(0, '#ffffff');
						radGrad.addColorStop(0.4, p.color);
						radGrad.addColorStop(1, '#050505');
						bCtx.beginPath();
						bCtx.arc(p.x, p.y, r * 1.15, 0, Math.PI * 2);
						bCtx.fillStyle = (config.shading === 'matte') ? p.color : radGrad;
						bCtx.fill();
					}

					const atBoundary = p.x <= cs || p.x >= vWidth - cs || p.y <= cs || p.y >= vHeight - cs;
					if (atBoundary || Math.random() < 0.2) {
						const validDirs = dirs.filter(d => (d.dx !== -p.dir.dx || d.dy !== -p.dir.dy));
						p.dir = validDirs[Math.floor(Math.random() * validDirs.length)];
					}

					if (p.length > 250) {
						this.pipes.splice(i, 1);
						this.spawnPipe(config);
					}
				}
			}
		}

		render(canvas, ctx, config, vWidth, vHeight) {
			if (this.bufferCanvas) {
				ctx.drawImage(this.bufferCanvas, 0, 0, vWidth, vHeight);
			}
		}

		destroy() {
			this.bufferCanvas = null;
			this.bufferCtx = null;
			this.pipes = [];
		}
	}

	class MystifySimulation {
		constructor(canvas, config, vWidth, vHeight) {
			const count = config.polygonCount || 2;
			const vCount = config.vertexCount || 4;
			this.polygons = [];
			const spd = config.speed || 4;

			for (let p = 0; p < count; p++) {
				const points = [];
				for (let i = 0; i < vCount; i++) {
					points.push({
						x: Math.random() * (vWidth * 0.8) + vWidth * 0.1,
						y: Math.random() * (vHeight * 0.8) + vHeight * 0.1,
						vx: (Math.random() - 0.5) * spd * 1.5,
						vy: (Math.random() - 0.5) * spd * 1.5
					});
				}
				this.polygons.push({
					points,
					history: [],
					hue: Math.random() * 360
				});
			}
		}

		syncConfig(config, vWidth, vHeight) {
			const count = config.polygonCount || 2;
			const vCount = config.vertexCount || 4;
			this.polygons = [];
			const spd = config.speed || 4;

			for (let p = 0; p < count; p++) {
				const points = [];
				for (let i = 0; i < vCount; i++) {
					points.push({
						x: Math.random() * (vWidth * 0.8) + vWidth * 0.1,
						y: Math.random() * (vHeight * 0.8) + vHeight * 0.1,
						vx: (Math.random() - 0.5) * spd * 1.5,
						vy: (Math.random() - 0.5) * spd * 1.5
					});
				}
				this.polygons.push({
					points,
					history: [],
					hue: Math.random() * 360
				});
			}
		}

		update(canvas, ctx, config, vWidth, vHeight) {
			const maxHist = config.linesCount || 12;
			const cycle = config.colorCycleSpeed !== undefined ? config.colorCycleSpeed : 3;

			for (let p = 0; p < this.polygons.length; p++) {
				const poly = this.polygons[p];
				poly.hue = (poly.hue + cycle * 0.4) % 360;

				const snapshot = poly.points.map(pt => ({ x: pt.x, y: pt.y }));
				poly.history.unshift(snapshot);
				if (poly.history.length > maxHist) poly.history.pop();

				for (let i = 0; i < poly.points.length; i++) {
					const pt = poly.points[i];
					pt.x += pt.vx;
					pt.y += pt.vy;

					if (pt.x <= 0) { pt.x = 0; pt.vx = Math.abs(pt.vx); }
					else if (pt.x >= vWidth) { pt.x = vWidth; pt.vx = -Math.abs(pt.vx); }

					if (pt.y <= 0) { pt.y = 0; pt.vy = Math.abs(pt.vy); }
					else if (pt.y >= vHeight) { pt.y = vHeight; pt.vy = -Math.abs(pt.vy); }
				}
			}
		}

		render(canvas, ctx, config, vWidth, vHeight) {
			ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
			ctx.fillRect(0, 0, vWidth, vHeight);

			const lWidth = config.lineWidth || 1.5;

			for (let p = 0; p < this.polygons.length; p++) {
				const poly = this.polygons[p];
				for (let hIndex = 0; hIndex < poly.history.length; hIndex++) {
					const pts = poly.history[hIndex];
					const alpha = 1 - (hIndex / poly.history.length);

					ctx.beginPath();
					ctx.moveTo(pts[0].x, pts[0].y);
					for (let i = 1; i < pts.length; i++) {
						ctx.lineTo(pts[i].x, pts[i].y);
					}
					ctx.closePath();

					let strokeStyle = `hsla(${poly.hue + hIndex * 5}, 100%, 65%, ${alpha})`;
					if (config.colorScheme === 'fire') {
						strokeStyle = `hsla(${15 + hIndex * 3}, 100%, ${50 + hIndex * 2}%, ${alpha})`;
					} else if (config.colorScheme === 'ocean') {
						strokeStyle = `hsla(${190 + hIndex * 4}, 100%, 60%, ${alpha})`;
					} else if (config.colorScheme === 'aurora') {
						strokeStyle = `hsla(${120 + hIndex * 5}, 100%, 65%, ${alpha})`;
					}

					ctx.strokeStyle = strokeStyle;
					ctx.lineWidth = lWidth;
					ctx.stroke();
				}
			}
		}

		destroy() {
			this.polygons = [];
		}
	}

	class BezierSimulation {
		constructor(canvas, config, vWidth, vHeight) {
			const count = config.curveCount || 3;
			this.curves = [];
			const spd = config.speed || 4;

			for (let c = 0; c < count; c++) {
				this.curves.push({
					p1: { x: Math.random() * vWidth, y: Math.random() * vHeight, vx: (Math.random() - 0.5) * spd * 1.4, vy: (Math.random() - 0.5) * spd * 1.4 },
					p2: { x: Math.random() * vWidth, y: Math.random() * vHeight, vx: (Math.random() - 0.5) * spd * 1.4, vy: (Math.random() - 0.5) * spd * 1.4 },
					cp1: { x: Math.random() * vWidth, y: Math.random() * vHeight, vx: (Math.random() - 0.5) * spd * 1.6, vy: (Math.random() - 0.5) * spd * 1.6 },
					cp2: { x: Math.random() * vWidth, y: Math.random() * vHeight, vx: (Math.random() - 0.5) * spd * 1.6, vy: (Math.random() - 0.5) * spd * 1.6 },
					history: [],
					hue: Math.random() * 360
				});
			}
		}

		syncConfig(config, vWidth, vHeight) {
			const count = config.curveCount || 3;
			this.curves = [];
			const spd = config.speed || 4;

			for (let c = 0; c < count; c++) {
				this.curves.push({
					p1: { x: Math.random() * vWidth, y: Math.random() * vHeight, vx: (Math.random() - 0.5) * spd * 1.4, vy: (Math.random() - 0.5) * spd * 1.4 },
					p2: { x: Math.random() * vWidth, y: Math.random() * vHeight, vx: (Math.random() - 0.5) * spd * 1.4, vy: (Math.random() - 0.5) * spd * 1.4 },
					cp1: { x: Math.random() * vWidth, y: Math.random() * vHeight, vx: (Math.random() - 0.5) * spd * 1.6, vy: (Math.random() - 0.5) * spd * 1.6 },
					cp2: { x: Math.random() * vWidth, y: Math.random() * vHeight, vx: (Math.random() - 0.5) * spd * 1.6, vy: (Math.random() - 0.5) * spd * 1.6 },
					history: [],
					hue: Math.random() * 360
				});
			}
		}

		update(canvas, ctx, config, vWidth, vHeight) {
			const maxHist = config.segments || 25;

			for (let c = 0; c < this.curves.length; c++) {
				const cv = this.curves[c];
				cv.hue = (cv.hue + 1.2) % 360;

				cv.history.unshift({
					p1: { ...cv.p1 },
					p2: { ...cv.p2 },
					cp1: { ...cv.cp1 },
					cp2: { ...cv.cp2 }
				});
				if (cv.history.length > maxHist) cv.history.pop();

				const pts = [cv.p1, cv.p2, cv.cp1, cv.cp2];
				for (let k = 0; k < 4; k++) {
					const pt = pts[k];
					pt.x += pt.vx;
					pt.y += pt.vy;
					if (pt.x <= 0) { pt.x = 0; pt.vx = Math.abs(pt.vx); }
					else if (pt.x >= vWidth) { pt.x = vWidth; pt.vx = -Math.abs(pt.vx); }
					if (pt.y <= 0) { pt.y = 0; pt.vy = Math.abs(pt.vy); }
					else if (pt.y >= vHeight) { pt.y = vHeight; pt.vy = -Math.abs(pt.vy); }
				}
			}
		}

		render(canvas, ctx, config, vWidth, vHeight) {
			ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
			ctx.fillRect(0, 0, vWidth, vHeight);

			const lWidth = config.lineWidth || 1.5;

			for (let c = 0; c < this.curves.length; c++) {
				const cv = this.curves[c];
				for (let i = 0; i < cv.history.length; i++) {
					const crv = cv.history[i];
					const alpha = 1 - (i / cv.history.length);

					ctx.beginPath();
					ctx.moveTo(crv.p1.x, crv.p1.y);
					ctx.bezierCurveTo(crv.cp1.x, crv.cp1.y, crv.cp2.x, crv.cp2.y, crv.p2.x, crv.p2.y);

					let strokeStyle = `hsla(${cv.hue + i * 4}, 90%, 60%, ${alpha})`;
					if (config.colorScheme === 'aurora') {
						strokeStyle = `hsla(${120 + i * 3}, 100%, 65%, ${alpha})`;
					} else if (config.colorScheme === 'electric') {
						strokeStyle = `hsla(${200 + i * 2}, 100%, 70%, ${alpha})`;
					} else if (config.colorScheme === 'sunset') {
						strokeStyle = `hsla(${20 + i * 3}, 100%, 55%, ${alpha})`;
					}

					ctx.strokeStyle = strokeStyle;
					ctx.lineWidth = lWidth;
					ctx.stroke();
				}
			}
		}

		destroy() {
			this.curves = [];
		}
	}

	const BlankScreenSaver = {
		createInstance(canvas, config, vWidth, vHeight) {
			return new BlankSimulation(canvas, config, vWidth, vHeight);
		}
	};
	const StarfieldScreenSaver = {
		createInstance(canvas, config, vWidth, vHeight) {
			return new StarfieldSimulation(canvas, config, vWidth, vHeight);
		}
	};
	const FlyingLogoScreenSaver = {
		createInstance(canvas, config, vWidth, vHeight) {
			return new FlyingLogoSimulation(canvas, config, vWidth, vHeight);
		}
	};
	const PipesScreenSaver = {
		createInstance(canvas, config, vWidth, vHeight) {
			return new PipesSimulation(canvas, config, vWidth, vHeight);
		}
	};
	const MystifyScreenSaver = {
		createInstance(canvas, config, vWidth, vHeight) {
			return new MystifySimulation(canvas, config, vWidth, vHeight);
		}
	};
	const BezierScreenSaver = {
		createInstance(canvas, config, vWidth, vHeight) {
			return new BezierSimulation(canvas, config, vWidth, vHeight);
		}
	};

	class BubblesSimulation {
		constructor(canvas, config, vWidth, vHeight) {
			this.canvas = canvas;
			this.vWidth = vWidth;
			this.vHeight = vHeight;
			this.count = 0;
			this.posX = null;
			this.posY = null;
			this.velX = null;
			this.velY = null;
			this.radius = null;
			this.mass = null;
			this.invMass = null;
			this.hue = null;
			this.seed = null;
			this.gridHead = null;
			this.gridNext = null;
			this.gridCols = 0;
			this.gridRows = 0;
			this.cellSize = 50;
			this.instanceData = null;

			this.gl = null;
			this.ctx = null;
			this.isWebGL = false;
			this.glProgram = null;
			this.glBuffers = null;
			this.glLocations = null;
			this.extInstancing = null;

			try {
				const glCtx = canvas.getContext('webgl2') || canvas.getContext('webgl');
				if (glCtx) {
					this.gl = glCtx;
					this.isWebGL = true;
					this.setupWebGLShaders(glCtx);
				}
			} catch (e) {
				this.isWebGL = false;
			}

			if (!this.isWebGL) {
				this.ctx = canvas.getContext('2d');
			}

			this.reallocate(config, vWidth, vHeight);
		}

		setupWebGLShaders(gl) {
			const vsSource = `
				attribute vec2 a_quad;
				attribute vec2 a_instance_pos;
				attribute float a_instance_radius;
				attribute float a_instance_hue;
				attribute float a_instance_seed;

				uniform vec2 u_resolution;

				varying vec2 v_uv;
				varying float v_hue;
				varying float v_radius;
				varying float v_seed;

				void main() {
					v_uv = a_quad;
					v_hue = a_instance_hue;
					v_radius = a_instance_radius;
					v_seed = a_instance_seed;
					
					vec2 pixelPos = a_instance_pos + a_quad * a_instance_radius;
					vec2 clipSpace = (pixelPos / u_resolution) * 2.0 - 1.0;
					gl_Position = vec4(clipSpace.x, -clipSpace.y, 0.0, 1.0);
				}
			`;

			const fsSource = `
				precision mediump float;

				varying vec2 v_uv;
				varying float v_hue;
				varying float v_radius;
				varying float v_seed;

				uniform int u_scheme;
				uniform float u_specular;
				uniform float u_time;

				vec3 hsv2rgb(vec3 c) {
					vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
					vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
					return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
				}

				void main() {
					float distSq = dot(v_uv, v_uv);
					if (distSq > 1.0) {
						discard;
					}
					
					float dist = sqrt(distSq);
					float z = sqrt(max(0.0, 1.0 - distSq));
					vec3 normal = vec3(v_uv.x, v_uv.y, z);
					
					float edge = smoothstep(1.0, 0.93, dist);
					float fresnel = pow(1.0 - z, 2.4);
					
					vec3 lightDir1 = normalize(vec3(-0.45, -0.55, 0.7));
					vec3 lightDir2 = normalize(vec3(0.35, 0.45, 0.82));
					
					float spec1 = pow(max(0.0, dot(normal, lightDir1)), 24.0) * 1.3;
					float spec2 = pow(max(0.0, dot(normal, lightDir2)), 14.0) * 0.45;
					float spec = (spec1 + spec2) * u_specular;
					
					vec4 color = vec4(0.0);
					
					if (u_scheme == 0) {
						float phase = fract(v_hue / 360.0 + fresnel * 0.75 + normal.x * 0.2 + normal.y * 0.2 + u_time * 0.06);
						vec3 filmColor = hsv2rgb(vec3(phase, 0.85, 0.95));
						vec3 baseGlow = hsv2rgb(vec3(fract(v_hue / 360.0 + 0.5), 0.7, 0.85));
						
						vec3 rgb = mix(baseGlow * 0.35, filmColor, fresnel * 0.85 + 0.15);
						rgb += vec3(spec);
						float alpha = (fresnel * 0.75 + 0.18 + spec * 0.8) * edge;
						color = vec4(rgb, alpha);
					} else if (u_scheme == 1) {
						vec3 deepBlue = vec3(0.0, 0.22, 0.75);
						vec3 brightCyan = vec3(0.3, 0.75, 1.0);
						vec3 rgb = mix(deepBlue, brightCyan, fresnel * 0.8 + 0.2);
						rgb += vec3(spec * 1.1);
						float alpha = (fresnel * 0.75 + 0.28 + spec * 0.9) * edge;
						color = vec4(rgb, alpha);
					} else if (u_scheme == 2) {
						vec3 candyColor = hsv2rgb(vec3(fract(v_hue / 360.0), 0.9, 0.95));
						vec3 shadeColor = hsv2rgb(vec3(fract(v_hue / 360.0), 1.0, 0.4));
						vec3 rgb = mix(shadeColor, candyColor, z * 0.6 + fresnel * 0.4);
						rgb += vec3(spec * 1.2);
						float alpha = (0.65 + fresnel * 0.3 + spec * 0.5) * edge;
						color = vec4(rgb, alpha);
					} else if (u_scheme == 3) {
						vec3 glassTint = vec3(0.85, 0.92, 1.0);
						vec3 rgb = glassTint * (fresnel * 0.85 + 0.1) + vec3(spec * 1.3);
						float alpha = (fresnel * 0.65 + 0.12 + spec * 0.9) * edge;
						color = vec4(rgb, alpha);
					} else if (u_scheme == 4) {
						vec3 neonColor = hsv2rgb(vec3(fract(v_hue / 360.0), 1.0, 1.0));
						float ring = pow(dist, 4.0) * 0.9 + 0.1;
						vec3 rgb = neonColor * (ring + spec * 0.6);
						float alpha = (ring * 0.85 + spec * 0.7) * edge;
						color = vec4(rgb, alpha);
					} else if (u_scheme == 5) {
						vec3 matrixGreen = vec3(0.0, 1.0, 0.35);
						vec3 darkGreen = vec3(0.0, 0.25, 0.05);
						vec3 rgb = mix(darkGreen, matrixGreen, fresnel * 0.7 + z * 0.3) + vec3(spec * 0.8);
						float alpha = (fresnel * 0.75 + 0.25 + spec * 0.8) * edge;
						color = vec4(rgb, alpha);
					} else {
						vec3 pearl = vec3(0.9, 0.92, 0.96);
						vec3 rgb = pearl * (fresnel * 0.7 + z * 0.3) + vec3(spec * 1.2);
						float alpha = (fresnel * 0.65 + 0.3 + spec * 0.8) * edge;
						color = vec4(rgb, alpha);
					}
					
					gl_FragColor = color;
				}
			`;

			const compileShader = (type, src) => {
				const s = gl.createShader(type);
				gl.shaderSource(s, src);
				gl.compileShader(s);
				return s;
			};

			const program = gl.createProgram();
			gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vsSource));
			gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fsSource));
			gl.linkProgram(program);
			this.glProgram = program;

			const quadVerts = new Float32Array([
				-1.0, -1.0,
				1.0, -1.0,
				-1.0,  1.0,
				-1.0,  1.0,
				1.0, -1.0,
				1.0,  1.0
			]);

			const quadBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW);

			const instanceBuffer = gl.createBuffer();

			this.glBuffers = {
				quad: quadBuffer,
				instance: instanceBuffer
			};

			this.glLocations = {
				aQuad: gl.getAttribLocation(program, 'a_quad'),
				aInstancePos: gl.getAttribLocation(program, 'a_instance_pos'),
				aInstanceRadius: gl.getAttribLocation(program, 'a_instance_radius'),
				aInstanceHue: gl.getAttribLocation(program, 'a_instance_hue'),
				aInstanceSeed: gl.getAttribLocation(program, 'a_instance_seed'),
				uResolution: gl.getUniformLocation(program, 'u_resolution'),
				uScheme: gl.getUniformLocation(program, 'u_scheme'),
				uSpecular: gl.getUniformLocation(program, 'u_specular'),
				uTime: gl.getUniformLocation(program, 'u_time')
			};

			this.extInstancing = gl.getExtension('ANGLE_instanced_arrays');
		}

		reallocate(config, vWidth, vHeight) {
			this.vWidth = vWidth;
			this.vHeight = vHeight;
			const targetCount = Math.min(2500, Math.max(1, parseInt(config.bubbleCount || 80, 10)));
			if (targetCount >= 1500 && window.AchievementsManager) {
				window.AchievementsManager.progress('bubbles_max_perf', 1);
			}
			const baseR = Math.max(2, parseFloat(config.baseRadius || 22));
			const variation = Math.max(0, Math.min(1, parseFloat(config.radiusVariation !== undefined ? config.radiusVariation : 0.6)));
			const speedBase = Math.max(0.5, parseFloat(config.speed || 3.5));
			const exponent = parseInt(config.massExponent || 2, 10);

			this.count = targetCount;
			this.posX = new Float32Array(targetCount);
			this.posY = new Float32Array(targetCount);
			this.velX = new Float32Array(targetCount);
			this.velY = new Float32Array(targetCount);
			this.radius = new Float32Array(targetCount);
			this.mass = new Float32Array(targetCount);
			this.invMass = new Float32Array(targetCount);
			this.hue = new Float32Array(targetCount);
			this.seed = new Float32Array(targetCount);
			this.instanceData = new Float32Array(targetCount * 5);

			let maxR = 0;

			for (let i = 0; i < targetCount; i++) {
				const r = Math.max(2, baseR * (1 + (Math.random() * 2 - 1) * variation));
				this.radius[i] = r;
				if (r > maxR) maxR = r;

				let m = 1;
				if (exponent === 1) m = r;
				else if (exponent === 3) m = (r * r * r) / 1000;
				else m = (r * r) / 100;
				this.mass[i] = Math.max(0.01, m);
				this.invMass[i] = 1.0 / this.mass[i];

				this.posX[i] = Math.random() * Math.max(10, vWidth - r * 2) + r;
				this.posY[i] = Math.random() * Math.max(10, vHeight - r * 2) + r;

				const angle = Math.random() * Math.PI * 2;
				const spd = (0.8 + Math.random() * 0.5) * speedBase;
				this.velX[i] = Math.cos(angle) * spd;
				this.velY[i] = Math.sin(angle) * spd;
				this.hue[i] = Math.random() * 360;
				this.seed[i] = Math.random();
			}

			this.cellSize = Math.max(24, Math.ceil(maxR * 2));
			this.gridCols = Math.max(1, Math.ceil(vWidth / this.cellSize));
			this.gridRows = Math.max(1, Math.ceil(vHeight / this.cellSize));
			const totalCells = this.gridCols * this.gridRows;

			this.gridHead = new Int32Array(totalCells);
			this.gridNext = new Int32Array(targetCount);
		}

		syncConfig(config, vWidth, vHeight) {
			this.reallocate(config, vWidth, vHeight);
		}

		onResize(canvas, ctx, config, vWidth, vHeight) {
			this.reallocate(config, vWidth, vHeight);
		}

		update(config, vWidth, vHeight) {
			if (!this.posX || this.count === 0) this.reallocate(config, vWidth, vHeight);

			const count = this.count;
			const pX = this.posX;
			const pY = this.posY;
			const vX = this.velX;
			const vY = this.velY;
			const rad = this.radius;
			const invM = this.invMass;
			const seed = this.seed;
			const rest = Math.max(0.95, Math.min(1.0, config.restitution !== undefined ? parseFloat(config.restitution) : 1.0));
			const rawGravity = config.gravityY !== undefined ? parseFloat(config.gravityY) : 0.0;
			const gravY = rawGravity * 0.04;
			const speedBase = Math.max(0.5, parseFloat(config.speed || 3.5));
			const timeSec = performance.now() * 0.001;

			const gCols = this.gridCols;
			const gRows = this.gridRows;
			const cSize = this.cellSize;
			const gHead = this.gridHead;
			const gNext = this.gridNext;

			const neighborOffsetsX = [0, 1, -1, 0, 1];
			const neighborOffsetsY = [0, 0, 1, 1, 1];

			for (let i = 0; i < count; i++) {
				const wander = seed[i] * 50.0 + timeSec * 0.7 + pX[i] * 0.003 + pY[i] * 0.003;
				vX[i] += Math.cos(wander) * 0.06 * speedBase;
				vY[i] += (Math.sin(wander) * 0.06 + gravY) * speedBase;

				const curSpd = Math.hypot(vX[i], vY[i]) || 0.001;
				const targetSpd = (0.75 + seed[i] * 0.5) * speedBase;
				const spdRatio = targetSpd / curSpd;
				vX[i] += (vX[i] * spdRatio - vX[i]) * 0.04;
				vY[i] += (vY[i] * spdRatio - vY[i]) * 0.04;

				pX[i] += vX[i];
				pY[i] += vY[i];

				const r = rad[i];
				if (pX[i] - r < 0) {
					pX[i] = r;
					vX[i] = Math.abs(vX[i]) * rest;
					vY[i] += (Math.random() - 0.5) * 0.3 * speedBase;
				} else if (pX[i] + r > vWidth) {
					pX[i] = vWidth - r;
					vX[i] = -Math.abs(vX[i]) * rest;
					vY[i] += (Math.random() - 0.5) * 0.3 * speedBase;
				}

				if (pY[i] - r < 0) {
					pY[i] = r;
					vY[i] = Math.abs(vY[i]) * rest;
					vX[i] += (Math.random() - 0.5) * 0.3 * speedBase;
				} else if (pY[i] + r > vHeight) {
					pY[i] = vHeight - r;
					vY[i] = -Math.abs(vY[i]) * rest;
					vX[i] += (Math.random() - 0.5) * 0.3 * speedBase;
				}
			}

			gHead.fill(-1);
			for (let i = 0; i < count; i++) {
				let cx = Math.floor(pX[i] / cSize);
				let cy = Math.floor(pY[i] / cSize);
				if (cx < 0) cx = 0; else if (cx >= gCols) cx = gCols - 1;
				if (cy < 0) cy = 0; else if (cy >= gRows) cy = gRows - 1;
				const cellIdx = cy * gCols + cx;
				gNext[i] = gHead[cellIdx];
				gHead[cellIdx] = i;
			}

			for (let cy = 0; cy < gRows; cy++) {
				for (let cx = 0; cx < gCols; cx++) {
					const cellIdx = cy * gCols + cx;
					let i = gHead[cellIdx];
					let guardI = count;

					while (i !== -1 && --guardI >= 0) {
						let j = gNext[i];
						let guardJ = count;
						while (j !== -1 && --guardJ >= 0) {
							this.resolveCollision(i, j, pX, pY, vX, vY, rad, invM, rest, speedBase);
							j = gNext[j];
						}

						for (let n = 1; n < 5; n++) {
							const ncx = cx + neighborOffsetsX[n];
							const ncy = cy + neighborOffsetsY[n];

							if (ncx >= 0 && ncx < gCols && ncy >= 0 && ncy < gRows) {
								const nCellIdx = ncy * gCols + ncx;
								let nj = gHead[nCellIdx];
								let guardNJ = count;
								while (nj !== -1 && --guardNJ >= 0) {
									this.resolveCollision(i, nj, pX, pY, vX, vY, rad, invM, rest, speedBase);
									nj = gNext[nj];
								}
							}
						}

						i = gNext[i];
					}
				}
			}
		}

		resolveCollision(i, j, pX, pY, vX, vY, rad, invM, rest, speedBase) {
			let dx = pX[j] - pX[i];
			let dy = pY[j] - pY[i];
			let distSq = dx * dx + dy * dy;
			const rSum = rad[i] + rad[j];

			if (distSq < rSum * rSum) {
				let dist = Math.sqrt(distSq);
				let nx = 1;
				let ny = 0;

				if (dist > 0.0001) {
					nx = dx / dist;
					ny = dy / dist;
				} else {
					dist = 0.0001;
					const randAng = Math.random() * Math.PI * 2;
					nx = Math.cos(randAng);
					ny = Math.sin(randAng);
				}

				const overlap = rSum - dist;
				const totalInvMass = invM[i] + invM[j];
				const mRatio1 = invM[i] / totalInvMass;
				const mRatio2 = invM[j] / totalInvMass;

				pX[i] -= nx * overlap * mRatio1;
				pY[i] -= ny * overlap * mRatio1;
				pX[j] += nx * overlap * mRatio2;
				pY[j] += ny * overlap * mRatio2;

				const vxRel = vX[i] - vX[j];
				const vyRel = vY[i] - vY[j];
				const velAlongNormal = vxRel * nx + vyRel * ny;

				if (velAlongNormal < 0) {
					const impulseMag = -(1.0 + rest) * velAlongNormal / totalInvMass;
					vX[i] += nx * impulseMag * invM[i];
					vY[i] += ny * impulseMag * invM[i];
					vX[j] -= nx * impulseMag * invM[j];
					vY[j] -= ny * impulseMag * invM[j];

					const tx = -ny;
					const ty = nx;
					const tangKick = (Math.random() - 0.5) * 0.18 * speedBase;
					vX[i] += tx * tangKick;
					vY[i] += ty * tangKick;
					vX[j] -= tx * tangKick;
					vY[j] -= ty * tangKick;
				}
			}
		}

		stepAndRender(canvas, config, vWidth, vHeight, scale) {
			this.update(config, vWidth, vHeight);
			if (this.isWebGL && this.gl) {
				this.renderWebGL(canvas, config, vWidth, vHeight);
			} else if (this.ctx) {
				this.ctx.save();
				this.ctx.setTransform(scale, 0, 0, scale, 0, 0);
				this.renderCanvas2D(canvas, config, vWidth, vHeight);
				this.ctx.restore();
			}
		}

		renderWebGL(canvas, config, vWidth, vHeight) {
			const gl = this.gl;
			if (!this.glProgram) {
				this.setupWebGLShaders(gl);
			}
			const count = this.count;
			if (count === 0) return;

			gl.viewport(0, 0, canvas.width, canvas.height);

			const schemeNames = ['soap', 'aqua', 'candy', 'glass', 'neon', 'matrix', 'monochrome'];
			const schemeIdx = Math.max(0, schemeNames.indexOf(config.colorScheme || 'soap'));

			if (schemeIdx === 1) {
				gl.clearColor(0.01, 0.03, 0.08, 1.0);
			} else if (schemeIdx === 5) {
				gl.clearColor(0.005, 0.03, 0.005, 1.0);
			} else if (schemeIdx === 6) {
				gl.clearColor(0.025, 0.028, 0.035, 1.0);
			} else {
				gl.clearColor(0.02, 0.03, 0.05, 1.0);
			}
			gl.clear(gl.COLOR_BUFFER_BIT);

			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

			gl.useProgram(this.glProgram);

			const pX = this.posX;
			const pY = this.posY;
			const rad = this.radius;
			const hue = this.hue;
			const seed = this.seed;
			const inst = this.instanceData;

			for (let i = 0; i < count; i++) {
				const off = i * 5;
				inst[off] = pX[i];
				inst[off + 1] = pY[i];
				inst[off + 2] = rad[i];
				inst[off + 3] = hue[i];
				inst[off + 4] = seed[i];
			}

			gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffers.instance);
			gl.bufferData(gl.ARRAY_BUFFER, inst, gl.DYNAMIC_DRAW);

			const loc = this.glLocations;

			gl.uniform2f(loc.uResolution, vWidth, vHeight);
			gl.uniform1i(loc.uScheme, schemeIdx);
			gl.uniform1f(loc.uSpecular, config.specularHighlights !== false ? 1.0 : 0.0);
			gl.uniform1f(loc.uTime, performance.now() * 0.001);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffers.quad);
			gl.enableVertexAttribArray(loc.aQuad);
			gl.vertexAttribPointer(loc.aQuad, 2, gl.FLOAT, false, 0, 0);

			gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffers.instance);

			const stride = 5 * 4;
			gl.enableVertexAttribArray(loc.aInstancePos);
			gl.vertexAttribPointer(loc.aInstancePos, 2, gl.FLOAT, false, stride, 0);

			gl.enableVertexAttribArray(loc.aInstanceRadius);
			gl.vertexAttribPointer(loc.aInstanceRadius, 1, gl.FLOAT, false, stride, 2 * 4);

			gl.enableVertexAttribArray(loc.aInstanceHue);
			gl.vertexAttribPointer(loc.aInstanceHue, 1, gl.FLOAT, false, stride, 3 * 4);

			gl.enableVertexAttribArray(loc.aInstanceSeed);
			gl.vertexAttribPointer(loc.aInstanceSeed, 1, gl.FLOAT, false, stride, 4 * 4);

			if (gl.vertexAttribDivisor) {
				gl.vertexAttribDivisor(loc.aQuad, 0);
				gl.vertexAttribDivisor(loc.aInstancePos, 1);
				gl.vertexAttribDivisor(loc.aInstanceRadius, 1);
				gl.vertexAttribDivisor(loc.aInstanceHue, 1);
				gl.vertexAttribDivisor(loc.aInstanceSeed, 1);
				gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, count);
			} else if (this.extInstancing) {
				this.extInstancing.vertexAttribDivisorANGLE(loc.aQuad, 0);
				this.extInstancing.vertexAttribDivisorANGLE(loc.aInstancePos, 1);
				this.extInstancing.vertexAttribDivisorANGLE(loc.aInstanceRadius, 1);
				this.extInstancing.vertexAttribDivisorANGLE(loc.aInstanceHue, 1);
				this.extInstancing.vertexAttribDivisorANGLE(loc.aInstanceSeed, 1);
				this.extInstancing.drawArraysInstancedANGLE(gl.TRIANGLES, 0, 6, count);
			}
		}

		renderCanvas2D(canvas, config, vWidth, vHeight) {
			const ctx = this.ctx;
			const scheme = config.colorScheme || 'soap';
			const specular = config.specularHighlights !== false;

			if (scheme === 'aqua') {
				ctx.fillStyle = '#020614';
			} else if (scheme === 'matrix') {
				ctx.fillStyle = '#010801';
			} else {
				ctx.fillStyle = '#05070d';
			}
			ctx.fillRect(0, 0, vWidth, vHeight);

			const count = this.count;
			const pX = this.posX;
			const pY = this.posY;
			const rad = this.radius;
			const hues = this.hue;

			for (let i = 0; i < count; i++) {
				const x = pX[i];
				const y = pY[i];
				const r = rad[i];
				const h = hues[i];

				ctx.beginPath();
				ctx.arc(x, y, r, 0, Math.PI * 2);

				if (scheme === 'soap') {
					ctx.fillStyle = `hsla(${h}, 85%, 70%, 0.25)`;
					ctx.fill();
					ctx.strokeStyle = `hsla(${h}, 95%, 85%, 0.85)`;
					ctx.lineWidth = Math.max(1, r * 0.08);
					ctx.stroke();
				} else if (scheme === 'aqua') {
					ctx.fillStyle = 'rgba(0, 88, 238, 0.35)';
					ctx.fill();
					ctx.strokeStyle = 'rgba(115, 179, 255, 0.85)';
					ctx.lineWidth = Math.max(1, r * 0.08);
					ctx.stroke();
				} else if (scheme === 'candy') {
					const candyHues = [0, 35, 50, 120, 195, 275, 330];
					const ch = candyHues[i % candyHues.length];
					ctx.fillStyle = `hsla(${ch}, 90%, 55%, 0.55)`;
					ctx.fill();
					ctx.strokeStyle = `hsla(${ch}, 100%, 85%, 0.9)`;
					ctx.lineWidth = Math.max(1, r * 0.08);
					ctx.stroke();
				} else if (scheme === 'glass') {
					ctx.fillStyle = 'rgba(200, 225, 255, 0.15)';
					ctx.fill();
					ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
					ctx.lineWidth = Math.max(1, r * 0.06);
					ctx.stroke();
				} else if (scheme === 'neon') {
					ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
					ctx.fill();
					ctx.strokeStyle = `hsla(${h}, 100%, 55%, 1.0)`;
					ctx.lineWidth = Math.max(1.2, r * 0.09);
					ctx.stroke();
				} else if (scheme === 'matrix') {
					ctx.fillStyle = 'rgba(0, 100, 0, 0.35)';
					ctx.fill();
					ctx.strokeStyle = 'rgba(0, 255, 102, 0.9)';
					ctx.lineWidth = Math.max(1, r * 0.08);
					ctx.stroke();
				} else {
					ctx.fillStyle = 'rgba(180, 190, 205, 0.35)';
					ctx.fill();
					ctx.strokeStyle = 'rgba(235, 240, 250, 0.85)';
					ctx.lineWidth = Math.max(1, r * 0.07);
					ctx.stroke();
				}

				if (specular && r >= 4) {
					ctx.beginPath();
					ctx.ellipse(x - r * 0.35, y - r * 0.35, r * 0.24, r * 0.12, -Math.PI / 4, 0, Math.PI * 2);
					ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
					ctx.fill();

					if (r >= 12) {
						ctx.beginPath();
						ctx.ellipse(x + r * 0.3, y + r * 0.3, r * 0.14, r * 0.06, -Math.PI / 4, 0, Math.PI * 2);
						ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
						ctx.fill();
					}
				}
			}
		}

		destroy() {
			if (this.gl && this.glBuffers) {
				try {
					if (this.glBuffers.quad) this.gl.deleteBuffer(this.glBuffers.quad);
					if (this.glBuffers.instance) this.gl.deleteBuffer(this.glBuffers.instance);
					if (this.glProgram) this.gl.deleteProgram(this.glProgram);
				} catch (e) {}
			}
			this.gl = null;
			this.ctx = null;
			this.posX = null;
			this.posY = null;
			this.velX = null;
			this.velY = null;
			this.radius = null;
			this.mass = null;
			this.invMass = null;
			this.hue = null;
			this.seed = null;
			this.gridHead = null;
			this.gridNext = null;
		}
	}

	const BubblesScreenSaver = {
		createInstance(canvas, config, vWidth, vHeight) {
			return new BubblesSimulation(canvas, config, vWidth, vHeight);
		}
	};

	window.ScreenSaverManager = new ScreenSaverManager();
})();
