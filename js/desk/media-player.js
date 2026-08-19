(function () {
	let activePlayerWindow = null;
	let currentAudioElement = null;
	let currentVideoElement = null;
	let animationFrameId = null;

	let audioCtx = null;
	let mediaSourceNode = null;
	let eqFilters = [];
	let pannerNode = null;
	let bassGainNode = null;
	let masterGainNode = null;
	let analyserNode = null;
	let audioNodeConnected = false;

	let currentPlaylist = [];
	let currentTrackIndex = -1;
	let currentCandidateIndex = 0;
	let isPlaying = false;
	let isMuted = false;
	let currentVolume = 0.8;
	let isShuffle = false;
	let repeatMode = 'off';
	let currentVisualization = 'albumart';
	let isPlaylistVisible = true;
	let isEnhancementsOpen = false;
	let activeEnhancementTab = 'eq';
	let isEqEnabled = true;
	let currentEqPreset = 'Flat';
	let playbackSpeed = 1.0;
	let stereoBalance = 0;
	let srsWowAmount = 0.3;
	let trubassAmount = 0.3;
	let isSrsEnabled = false;

	let videoAspectRatio = 'auto';
	let videoBrightness = 100;
	let videoContrast = 100;
	let videoSaturation = 100;

	const EQ_FREQUENCIES = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
	const EQ_PRESETS = {
		'Flat': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		'Rock': [4.5, 3.0, 1.5, 0, -1.0, -0.5, 1.5, 3.0, 4.0, 4.5],
		'Pop': [-1.5, -0.5, 2.0, 3.5, 4.0, 3.0, 1.0, -0.5, -1.0, -1.5],
		'Jazz': [3.0, 2.0, 1.0, 2.0, -1.5, -1.5, 0, 1.5, 2.5, 3.5],
		'Classical': [4.0, 3.0, 2.5, 2.0, -1.0, -1.0, 0, 2.0, 3.0, 3.5],
		'Techno': [5.0, 4.0, 2.0, 0, -2.0, 0, 2.5, 4.0, 4.5, 4.0],
		'Full Bass': [7.0, 6.0, 5.0, 3.0, 1.0, 0, -1.0, -2.0, -3.0, -4.0],
		'Full Treble': [-4.0, -3.0, -2.0, -1.0, 0, 1.5, 4.0, 6.0, 7.0, 8.0],
		'Vocal': [-2.0, -3.0, -1.0, 2.0, 4.5, 4.5, 3.0, 1.0, 0, -1.0],
		'Club': [0, 0, 2.0, 3.0, 3.0, 3.0, 2.0, 0, 0, 0]
	};
	let currentEqGains = [...EQ_PRESETS['Flat']];

	const VISUALIZATIONS = ['albumart', 'bars', 'wave', 'spectrum', 'particles', 'flame'];

	function formatTime(seconds) {
		if (!seconds || isNaN(seconds) || seconds < 0) return '00:00';
		const sec = Math.floor(seconds);
		const m = Math.floor(sec / 60);
		const s = sec % 60;
		const h = Math.floor(m / 60);
		const remM = m % 60;
		if (h > 0) {
			return `${String(h).padStart(2, '0')}:${String(remM).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
		}
		return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
	}

	const MediaPlayerApp = {
		open(target = null, options = {}) {
			const id = 'window-media-player';
			const existing = document.getElementById(id);

			if (existing) {
				if (typeof bringWindowToFront === 'function') bringWindowToFront(existing);
				if (existing.classList.contains('minimized') && typeof unminimizeWindow === 'function') {
					unminimizeWindow(existing);
				}
				if (target) {
					this.loadAndPlay(target, options);
				}
				return existing;
			}

			const contentHTML = this.buildPlayerTemplate();
			const win = createXPWindow(id, 'Windows Media Player', contentHTML, 840, 560, {
				iconSrc: '../assets/images/desk/icons/Video File.webp',
				resizable: true
			});

			win.classList.add('wmp-window');
			win.dataset.appId = 'mediaplayer';
			win.querySelector('.xp-window-content').style.padding = '0';
			activePlayerWindow = win;

			win.getWindowState = () => ({
				appId: 'mediaplayer',
				currentPlaylist: currentPlaylist.map(t => ({
					id: t.id,
					title: t.title,
					artist: t.artist,
					album: t.album,
					year: t.year,
					genre: t.genre,
					duration: t.duration,
					url: t.url,
					candidates: t.candidates,
					artwork: t.artwork,
					isVideo: t.isVideo
				})),
				currentTrackIndex,
				currentTime: this.getActiveMedia() ? this.getActiveMedia().currentTime : 0,
				currentVolume,
				isMuted,
				isShuffle,
				repeatMode,
				currentVisualization,
				isPlaylistVisible,
				isEnhancementsOpen,
				activeEnhancementTab,
				isEqEnabled,
				currentEqPreset,
				currentEqGains,
				playbackSpeed,
				stereoBalance,
				srsWowAmount,
				trubassAmount,
				isSrsEnabled,
				videoAspectRatio
			});

			this.bindPlayerEvents(win);

			if (options.restoreState) {
				const st = options.restoreState;
				if (Array.isArray(st.currentPlaylist) && st.currentPlaylist.length > 0) {
					currentPlaylist = st.currentPlaylist;
					currentTrackIndex = st.currentTrackIndex !== undefined ? st.currentTrackIndex : 0;
					if (typeof st.currentVolume === 'number') currentVolume = st.currentVolume;
					if (typeof st.isMuted === 'boolean') isMuted = st.isMuted;
					if (typeof st.isShuffle === 'boolean') isShuffle = st.isShuffle;
					if (st.repeatMode) repeatMode = st.repeatMode;
					if (st.currentVisualization) currentVisualization = st.currentVisualization;
					if (typeof st.isPlaylistVisible === 'boolean') isPlaylistVisible = st.isPlaylistVisible;
					if (typeof st.isEnhancementsOpen === 'boolean') isEnhancementsOpen = st.isEnhancementsOpen;
					if (st.activeEnhancementTab) activeEnhancementTab = st.activeEnhancementTab;
					if (Array.isArray(st.currentEqGains)) currentEqGains = [...st.currentEqGains];
					if (st.currentEqPreset) currentEqPreset = st.currentEqPreset;
					if (typeof st.playbackSpeed === 'number') playbackSpeed = st.playbackSpeed;
					if (typeof st.stereoBalance === 'number') stereoBalance = st.stereoBalance;
					if (st.videoAspectRatio) videoAspectRatio = st.videoAspectRatio;

					this.renderPlaylist(win);
					if (currentPlaylist[currentTrackIndex]) {
						this.updateTrackInfoUI(win, currentPlaylist[currentTrackIndex]);
						this.playIndex(currentTrackIndex);
						setTimeout(() => {
							const media = this.getActiveMedia();
							if (media && typeof st.currentTime === 'number') {
								media.currentTime = st.currentTime;
							}
						}, 200);
					}
				} else {
					this.loadDefaultLibrary();
				}
			} else if (target) {
				this.loadAndPlay(target, options);
			} else {
				this.loadDefaultLibrary();
			}

			win.beforeClose = () => {
				this.stop();
				if (animationFrameId) {
					cancelAnimationFrame(animationFrameId);
					animationFrameId = null;
				}
				activePlayerWindow = null;
				return true;
			};

			return win;
		},

		buildPlayerTemplate() {
			return `
				<div class="wmp-layout">
					<div class="wmp-menubar">
						<ul class="wmp-menu-list">
							<li class="wmp-menu-item" data-wmp-menu="file"><u>F</u>ile</li>
							<li class="wmp-menu-item" data-wmp-menu="view"><u>V</u>iew</li>
							<li class="wmp-menu-item" data-wmp-menu="play"><u>P</u>lay</li>
							<li class="wmp-menu-item" data-wmp-menu="tools"><u>T</u>ools</li>
							<li class="wmp-menu-item" data-wmp-menu="help"><u>H</u>elp</li>
						</ul>
						<div class="wmp-brand-logo">
							<img src="../assets/images/desk/icons/Video File.webp" alt="">
							<span>Windows Media Player 9 Series</span>
						</div>
					</div>

					<div class="wmp-main-workspace">
						<div class="wmp-screen-area" id="wmp-screen-area">
							<div class="wmp-artwork-overlay" id="wmp-artwork-backdrop"></div>
							<div class="wmp-video-container" id="wmp-video-box" style="display: none;">
								<video id="wmp-video-player" playsinline></video>
							</div>
							<div class="wmp-visualizer-container" id="wmp-viz-box">
								<canvas id="wmp-visualizer-canvas"></canvas>
								<div class="wmp-albumart-stage" id="wmp-albumart-stage">
									<div class="wmp-art-frame">
										<img src="../assets/images/desk/icons/Music File.webp" id="wmp-art-img" class="wmp-art-img" alt="Artwork">
									</div>
									<div class="wmp-art-meta">
										<div class="wmp-art-title" id="wmp-art-title">No Track Selected</div>
										<div class="wmp-art-artist" id="wmp-art-artist">Windows Media Player 9 Series</div>
										<div class="wmp-art-album" id="wmp-art-album">Local Media Library</div>
									</div>
								</div>
								<div class="wmp-screen-hud">
									<div class="wmp-hud-title" id="wmp-hud-title">Windows Media Player</div>
									<div class="wmp-hud-artist" id="wmp-hud-artist">Ready</div>
								</div>
							</div>

							<div class="wmp-enhancements-drawer" id="wmp-enhancements-drawer" style="display: none;">
								<div class="wmp-enh-header">
									<div class="wmp-enh-tabs">
										<button type="button" class="wmp-enh-tab-btn active" data-enh-tab="eq">Graphic Equalizer</button>
										<button type="button" class="wmp-enh-tab-btn" data-enh-tab="srs">SRS WOW Effects</button>
										<button type="button" class="wmp-enh-tab-btn" data-enh-tab="speed">Play Speed & Balance</button>
										<button type="button" class="wmp-enh-tab-btn" data-enh-tab="video">Video Settings</button>
									</div>
									<button type="button" class="wmp-enh-close" id="wmp-enh-close" title="Close Enhancements">×</button>
								</div>
								<div class="wmp-enh-body" id="wmp-enh-body-eq">
									<div class="wmp-eq-toolbar">
										<label class="xp-checkbox-row" style="margin: 0;"><input type="checkbox" id="wmp-eq-toggle" checked> Equalizer On</label>
										<select id="wmp-eq-preset-select" class="xp-select" style="margin-left: 12px; font-size: 11px;"></select>
										<button type="button" class="xp-button-small" id="wmp-eq-reset-btn" style="margin-left: 6px;">Reset</button>
									</div>
									<div class="wmp-eq-sliders-grid" id="wmp-eq-sliders-container"></div>
								</div>
								<div class="wmp-enh-body" id="wmp-enh-body-srs" style="display: none;">
									<div class="wmp-srs-panel">
										<label class="xp-checkbox-row"><input type="checkbox" id="wmp-srs-toggle"> Turn On SRS WOW Effects</label>
										<div class="xp-form-row" style="margin-top: 6px;">
											<label style="width: 120px;">TruBass Boost:</label>
											<input type="range" id="wmp-srs-trubass" min="0" max="1" step="0.05" value="0.3" class="xp-slider">
										</div>
										<div class="xp-form-row" style="margin-top: 6px;">
											<label style="width: 120px;">WOW Ambience:</label>
											<input type="range" id="wmp-srs-ambience" min="0" max="1" step="0.05" value="0.3" class="xp-slider">
										</div>
									</div>
								</div>
								<div class="wmp-enh-body" id="wmp-enh-body-speed" style="display: none;">
									<div class="wmp-speed-panel">
										<div class="xp-form-row">
											<label style="width: 110px;">Playback Speed:</label>
											<input type="range" id="wmp-speed-slider" min="0.5" max="2.0" step="0.25" value="1.0" class="xp-slider">
											<span id="wmp-speed-val" style="font-size: 11px; width: 45px;">1.0x</span>
										</div>
										<div class="xp-form-row" style="margin-top: 8px;">
											<label style="width: 110px;">Stereo Balance:</label>
											<span style="font-size: 10px;">L</span>
											<input type="range" id="wmp-balance-slider" min="-1" max="1" step="0.1" value="0" class="xp-slider">
											<span style="font-size: 10px;">R</span>
											<button type="button" class="xp-button-small" id="wmp-balance-center" style="margin-left: 6px;">Center</button>
										</div>
									</div>
								</div>
								<div class="wmp-enh-body" id="wmp-enh-body-video" style="display: none;">
									<div class="wmp-video-enh-panel">
										<div class="xp-form-row">
											<label style="width: 100px;">Aspect Ratio:</label>
											<select id="wmp-aspect-select" class="xp-select" style="flex: 1;">
												<option value="auto">Automatic Fit</option>
												<option value="4:3">4:3 Standard Television</option>
												<option value="16:9">16:9 Widescreen Cinema</option>
												<option value="stretch">Stretch to Screen</option>
											</select>
										</div>
										<div class="xp-form-row" style="margin-top: 6px;">
											<label style="width: 100px;">Brightness:</label>
											<input type="range" id="wmp-vid-bright" min="50" max="150" value="100" class="xp-slider">
										</div>
										<div class="xp-form-row" style="margin-top: 6px;">
											<label style="width: 100px;">Contrast:</label>
											<input type="range" id="wmp-vid-contrast" min="50" max="150" value="100" class="xp-slider">
										</div>
										<div class="xp-form-row" style="margin-top: 6px;">
											<label style="width: 100px;">Saturation:</label>
											<input type="range" id="wmp-vid-sat" min="0" max="200" value="100" class="xp-slider">
										</div>
									</div>
								</div>
							</div>
						</div>

						<div class="wmp-playlist-sidebar" id="wmp-playlist-sidebar">
							<div class="wmp-playlist-header">
								<div class="wmp-playlist-title-row">
									<strong>Now Playing</strong>
									<span id="wmp-playlist-count" class="wmp-playlist-badge">0 items</span>
								</div>
								<div class="wmp-playlist-search-box">
									<input type="text" id="wmp-playlist-search" placeholder="Search playlist..." class="wmp-search-input">
								</div>
							</div>
							<div class="wmp-playlist-list-wrap" id="wmp-playlist-drop-zone">
								<ul class="wmp-playlist-items" id="wmp-playlist-items"></ul>
							</div>
							<div class="wmp-playlist-footer">
								<button type="button" class="xp-button-small" id="wmp-pl-presets-btn">Quick Lists</button>
								<button type="button" class="xp-button-small" id="wmp-pl-add-btn">Add Track...</button>
								<button type="button" class="xp-button-small" id="wmp-pl-clear-btn">Clear</button>
							</div>
						</div>
					</div>

					<div class="wmp-control-panel">
						<div class="wmp-scrubber-row">
							<span class="wmp-time-text" id="wmp-time-current">00:00</span>
							<div class="wmp-track-slider-wrap">
								<input type="range" id="wmp-seek-bar" min="0" max="100" value="0" step="0.1" class="wmp-slider">
							</div>
							<span class="wmp-time-text" id="wmp-time-duration">00:00</span>
						</div>

						<div class="wmp-buttons-row">
							<div class="wmp-btn-cluster-left">
								<button type="button" class="wmp-tool-btn" id="wmp-btn-prev" title="Previous Track (Ctrl+B)">
									<div class="wmp-icon-prev"></div>
								</button>
								<button type="button" class="wmp-tool-btn wmp-btn-primary" id="wmp-btn-play" title="Play / Pause (Space)">
									<div class="wmp-icon-play" id="wmp-play-icon-shape"></div>
								</button>
								<button type="button" class="wmp-tool-btn" id="wmp-btn-stop" title="Stop (Ctrl+S)">
									<div class="wmp-icon-stop"></div>
								</button>
								<button type="button" class="wmp-tool-btn" id="wmp-btn-next" title="Next Track (Ctrl+F)">
									<div class="wmp-icon-next"></div>
								</button>
							</div>

							<div class="wmp-btn-cluster-center">
								<button type="button" class="wmp-toggle-btn" id="wmp-btn-shuffle" title="Turn Shuffle On/Off (Ctrl+H)">
									<img src="https://api.iconify.design/mdi/shuffle-variant.svg?color=%231b4b9b" alt="">
									<span>Shuffle</span>
								</button>
								<button type="button" class="wmp-toggle-btn" id="wmp-btn-repeat" title="Repeat Mode (Ctrl+T)">
									<img src="https://api.iconify.design/mdi/repeat.svg?color=%231b4b9b" alt="">
									<span id="wmp-repeat-label">Repeat: Off</span>
								</button>
								<button type="button" class="wmp-toggle-btn" id="wmp-btn-viz" title="Change Visualization">
									<img src="https://api.iconify.design/mdi/chart-bell-curve-cumulative.svg?color=%231b4b9b" alt="">
									<span id="wmp-viz-label">Viz: Album Art</span>
								</button>
								<button type="button" class="wmp-toggle-btn" id="wmp-btn-enhancements" title="Equalizer & Audio Enhancements (Ctrl+E)">
									<img src="https://api.iconify.design/mdi/tune-vertical.svg?color=%231b4b9b" alt="">
									<span>Enhancements</span>
								</button>
							</div>

							<div class="wmp-btn-cluster-right">
								<button type="button" class="wmp-tool-btn" id="wmp-btn-mute" title="Mute Volume (Ctrl+M)">
									<div class="wmp-icon-vol" id="wmp-vol-icon-shape"></div>
								</button>
								<input type="range" id="wmp-volume-slider" min="0" max="1" step="0.05" value="0.8" class="wmp-slider wmp-vol-slider" title="Volume">
								<button type="button" class="wmp-toggle-btn active" id="wmp-btn-toggle-playlist" title="Show/Hide Playlist Pane (Ctrl+L)">
									<img src="https://api.iconify.design/mdi/playlist-music.svg?color=%231b4b9b" alt="">
									<span>Playlist</span>
								</button>
							</div>
						</div>
					</div>

					<div class="wmp-statusbar">
						<div class="wmp-sb-status" id="wmp-sb-status">Ready</div>
						<div class="wmp-sb-info" id="wmp-sb-specs">Audio: 44.1kHz Stereo</div>
					</div>

					<audio id="wmp-audio-player" preload="metadata"></audio>
				</div>
			`;
		},

		initAudioContext(audioEl) {
			if (audioCtx && mediaSourceNode) return;
			try {
				const AudioContextClass = window.AudioContext || window.webkitAudioContext;
				if (!AudioContextClass) return;
				audioCtx = new AudioContextClass();

				analyserNode = audioCtx.createAnalyser();
				analyserNode.fftSize = 256;
				analyserNode.smoothingTimeConstant = 0.8;

				masterGainNode = audioCtx.createGain();
				masterGainNode.gain.value = isMuted ? 0 : currentVolume;

				bassGainNode = audioCtx.createGain();
				bassGainNode.gain.value = 1.0;

				if (audioCtx.createStereoPanner) {
					pannerNode = audioCtx.createStereoPanner();
					pannerNode.pan.value = stereoBalance;
				}

				eqFilters = EQ_FREQUENCIES.map((freq, idx) => {
					const filter = audioCtx.createBiquadFilter();
					if (idx === 0) filter.type = 'lowshelf';
					else if (idx === EQ_FREQUENCIES.length - 1) filter.type = 'highshelf';
					else filter.type = 'peaking';
					filter.frequency.value = freq;
					filter.gain.value = isEqEnabled ? currentEqGains[idx] : 0;
					return filter;
				});

				mediaSourceNode = audioCtx.createMediaElementSource(audioEl);

				let previousNode = mediaSourceNode;
				for (let i = 0; i < eqFilters.length; i++) {
					previousNode.connect(eqFilters[i]);
					previousNode = eqFilters[i];
				}

				if (pannerNode) {
					previousNode.connect(pannerNode);
					previousNode = pannerNode;
				}

				previousNode.connect(bassGainNode);
				bassGainNode.connect(masterGainNode);
				masterGainNode.connect(analyserNode);
				analyserNode.connect(audioCtx.destination);

				audioNodeConnected = true;
			} catch (e) {
				audioNodeConnected = false;
			}
		},

		applyEqualizerSettings() {
			if (!eqFilters || eqFilters.length === 0) return;
			eqFilters.forEach((filter, idx) => {
				filter.gain.value = isEqEnabled ? (currentEqGains[idx] || 0) : 0;
			});
		},

		applyEnhancementEffects() {
			if (pannerNode && audioCtx) {
				pannerNode.pan.setValueAtTime(stereoBalance, audioCtx.currentTime);
			}
			if (bassGainNode && audioCtx) {
				const boost = isSrsEnabled ? (1.0 + trubassAmount * 1.5) : 1.0;
				bassGainNode.gain.setValueAtTime(boost, audioCtx.currentTime);
			}
			const activeMedia = this.getActiveMedia();
			if (activeMedia) {
				activeMedia.playbackRate = playbackSpeed;
			}
		},

		applyVideoFilters(videoEl) {
			if (!videoEl) return;
			videoEl.style.filter = `brightness(${videoBrightness}%) contrast(${videoContrast}%) saturate(${videoSaturation}%)`;
			videoEl.style.objectFit = videoAspectRatio === 'stretch' ? 'fill' : (videoAspectRatio === 'auto' ? 'contain' : 'contain');
			if (videoAspectRatio === '4:3') videoEl.style.aspectRatio = '4 / 3';
			else if (videoAspectRatio === '16:9') videoEl.style.aspectRatio = '16 / 9';
			else videoEl.style.aspectRatio = 'auto';
		},

		bindPlayerEvents(win) {
			const audio = win.querySelector('#wmp-audio-player');
			const video = win.querySelector('#wmp-video-player');
			currentAudioElement = audio;
			currentVideoElement = video;

			const playBtn = win.querySelector('#wmp-btn-play');
			const stopBtn = win.querySelector('#wmp-btn-stop');
			const prevBtn = win.querySelector('#wmp-btn-prev');
			const nextBtn = win.querySelector('#wmp-btn-next');
			const seekBar = win.querySelector('#wmp-seek-bar');
			const volSlider = win.querySelector('#wmp-volume-slider');
			const muteBtn = win.querySelector('#wmp-btn-mute');
			const shuffleBtn = win.querySelector('#wmp-btn-shuffle');
			const repeatBtn = win.querySelector('#wmp-btn-repeat');
			const vizBtn = win.querySelector('#wmp-btn-viz');
			const enhBtn = win.querySelector('#wmp-btn-enhancements');
			const enhDrawer = win.querySelector('#wmp-enhancements-drawer');
			const enhClose = win.querySelector('#wmp-enh-close');
			const togglePlBtn = win.querySelector('#wmp-btn-toggle-playlist');
			const searchInput = win.querySelector('#wmp-playlist-search');
			const clearPlBtn = win.querySelector('#wmp-pl-clear-btn');
			const addPlBtn = win.querySelector('#wmp-pl-add-btn');
			const presetsBtn = win.querySelector('#wmp-pl-presets-btn');
			const screenArea = win.querySelector('#wmp-screen-area');

			const savedVol = (window.SettingsApp && typeof window.SettingsApp.get === 'function')
				? window.SettingsApp.get('soundVolume')
				: 0.8;
			currentVolume = (savedVol !== undefined && savedVol !== null) ? parseFloat(savedVol) : 0.8;
			const soundEnabled = (window.SettingsApp && typeof window.SettingsApp.get === 'function')
				? window.SettingsApp.get('soundEnabled')
				: true;
			isMuted = (soundEnabled === false);

			volSlider.value = String(currentVolume);
			if (audio) {
				audio.volume = isMuted ? 0 : currentVolume;
				audio.muted = isMuted;
			}
			if (video) {
				video.volume = isMuted ? 0 : currentVolume;
				video.muted = isMuted;
			}
			this.updateMuteUI(win);

			this.renderEqualizerUI(win);

			playBtn.addEventListener('click', () => this.togglePlay());
			stopBtn.addEventListener('click', () => this.stop());
			prevBtn.addEventListener('click', () => this.playPrevious());
			nextBtn.addEventListener('click', () => this.playNext());

			let isSeeking = false;
			seekBar.addEventListener('mousedown', () => { isSeeking = true; });
			seekBar.addEventListener('input', () => {
				const activeMedia = this.getActiveMedia();
				if (activeMedia && activeMedia.duration) {
					const targetTime = (parseFloat(seekBar.value) / 100) * activeMedia.duration;
					win.querySelector('#wmp-time-current').textContent = formatTime(targetTime);
				}
			});
			seekBar.addEventListener('change', () => {
				const activeMedia = this.getActiveMedia();
				if (activeMedia && activeMedia.duration) {
					activeMedia.currentTime = (parseFloat(seekBar.value) / 100) * activeMedia.duration;
				}
				isSeeking = false;
			});

			volSlider.addEventListener('input', () => {
				currentVolume = parseFloat(volSlider.value);
				if (audio) audio.volume = isMuted ? 0 : currentVolume;
				if (video) video.volume = isMuted ? 0 : currentVolume;
				if (masterGainNode && audioCtx) {
					masterGainNode.gain.setValueAtTime(isMuted ? 0 : currentVolume, audioCtx.currentTime);
				}
				if (currentVolume > 0 && isMuted) {
					isMuted = false;
					if (audio) audio.muted = false;
					if (video) video.muted = false;
					this.updateMuteUI(win);
				}
				if (window.SettingsApp && typeof window.SettingsApp.set === 'function') {
					window.SettingsApp.set('soundVolume', currentVolume);
				}
			});

			muteBtn.addEventListener('click', () => {
				isMuted = !isMuted;
				if (audio) audio.muted = isMuted;
				if (video) video.muted = isMuted;
				if (masterGainNode && audioCtx) {
					masterGainNode.gain.setValueAtTime(isMuted ? 0 : currentVolume, audioCtx.currentTime);
				}
				if (window.SettingsApp && typeof window.SettingsApp.set === 'function') {
					window.SettingsApp.set('soundEnabled', !isMuted);
				}
				this.updateMuteUI(win);
			});

			shuffleBtn.addEventListener('click', () => {
				isShuffle = !isShuffle;
				shuffleBtn.classList.toggle('active', isShuffle);
			});

			repeatBtn.addEventListener('click', () => {
				if (repeatMode === 'off') repeatMode = 'all';
				else if (repeatMode === 'all') repeatMode = 'one';
				else repeatMode = 'off';
				win.querySelector('#wmp-repeat-label').textContent = `Repeat: ${repeatMode.toUpperCase()}`;
				repeatBtn.classList.toggle('active', repeatMode !== 'off');
			});

			vizBtn.addEventListener('click', () => {
				const nextIdx = (VISUALIZATIONS.indexOf(currentVisualization) + 1) % VISUALIZATIONS.length;
				currentVisualization = VISUALIZATIONS[nextIdx];
				const labelMap = {
					albumart: 'Album Art',
					bars: 'Bars',
					wave: 'Waveform',
					spectrum: 'Spectrum',
					particles: 'Particles',
					flame: 'Fire Flame'
				};
				win.querySelector('#wmp-viz-label').textContent = `Viz: ${labelMap[currentVisualization] || 'Bars'}`;
				this.updateVisualizationModeUI(win);
			});

			enhBtn.addEventListener('click', () => {
				isEnhancementsOpen = !isEnhancementsOpen;
				enhDrawer.style.display = isEnhancementsOpen ? 'flex' : 'none';
				enhBtn.classList.toggle('active', isEnhancementsOpen);
			});

			if (enhClose) {
				enhClose.addEventListener('click', () => {
					isEnhancementsOpen = false;
					enhDrawer.style.display = 'none';
					enhBtn.classList.remove('active');
				});
			}

			win.querySelectorAll('.wmp-enh-tab-btn').forEach(tabBtn => {
				tabBtn.addEventListener('click', () => {
					const tabKey = tabBtn.dataset.enhTab;
					activeEnhancementTab = tabKey;
					win.querySelectorAll('.wmp-enh-tab-btn').forEach(b => b.classList.toggle('active', b === tabBtn));
					win.querySelectorAll('.wmp-enh-body').forEach(body => {
						body.style.display = body.id === `wmp-enh-body-${tabKey}` ? 'flex' : 'none';
					});
				});
			});

			togglePlBtn.addEventListener('click', () => {
				isPlaylistVisible = !isPlaylistVisible;
				const plPane = win.querySelector('#wmp-playlist-sidebar');
				plPane.style.display = isPlaylistVisible ? 'flex' : 'none';
				togglePlBtn.classList.toggle('active', isPlaylistVisible);
			});

			searchInput.addEventListener('input', () => {
				this.renderPlaylist(win, searchInput.value.trim().toLowerCase());
			});

			if (clearPlBtn) {
				clearPlBtn.addEventListener('click', () => {
					currentPlaylist = [];
					this.stop();
					this.renderPlaylist(win);
				});
			}

			if (addPlBtn) {
				addPlBtn.addEventListener('click', () => {
					if (window.FileExplorer && fs) {
						window.FileExplorer.open(fs.root.getByName('Music') || fs.root);
					}
				});
			}

			if (presetsBtn) {
				presetsBtn.addEventListener('click', (e) => {
					e.stopPropagation();
					const rect = presetsBtn.getBoundingClientRect();
					const items = [
						{ label: 'All Library Tracks', bold: true, action: () => this.loadDefaultLibrary() },
						{ separator: true },
						{ label: 'Singles Collection', action: () => this.filterLibraryByFolder('single') },
						{ label: 'Sort: Alphabetical Title', action: () => this.sortCurrentPlaylist('title') },
						{ label: 'Sort: Artist Name', action: () => this.sortCurrentPlaylist('artist') },
						{ label: 'Sort: Duration', action: () => this.sortCurrentPlaylist('duration') },
						{ separator: true },
						{ label: 'Export Playlist (.m3u)', action: () => this.exportPlaylistM3U() }
					];
					if (window.ContextMenu) {
						window.ContextMenu.show(items, rect.left, rect.top - 180);
					}
				});
			}

			screenArea.addEventListener('dblclick', (e) => {
				if (e.target.closest('.wmp-enhancements-drawer')) return;
				if (typeof maximizeWindow === 'function') maximizeWindow(win);
			});

			const onScreenContextMenu = (e) => {
				if (e.target.closest('.wmp-enhancements-drawer') || e.target.closest('button') || e.target.closest('input')) return;
				e.preventDefault();
				e.stopPropagation();
				if (window.ContextMenu) {
					const activeTrack = currentPlaylist[currentTrackIndex] || null;
					const items = window.ContextMenu.getMediaPlayerScreenItems(this, activeTrack, win);
					window.ContextMenu.show(items, e.clientX, e.clientY);
				}
			};

			screenArea.addEventListener('contextmenu', onScreenContextMenu);
			const vizBox = win.querySelector('#wmp-viz-box');
			if (vizBox) vizBox.addEventListener('contextmenu', onScreenContextMenu);
			const vidBox = win.querySelector('#wmp-video-box');
			if (vidBox) vidBox.addEventListener('contextmenu', onScreenContextMenu);
			const artStage = win.querySelector('#wmp-albumart-stage');
			if (artStage) artStage.addEventListener('contextmenu', onScreenContextMenu);

			const dropZone = win.querySelector('#wmp-playlist-drop-zone');
			if (dropZone) {
				dropZone.addEventListener('dragover', (e) => {
					e.preventDefault();
					e.stopPropagation();
					dropZone.classList.add('wmp-drop-active');
				});
				dropZone.addEventListener('dragleave', (e) => {
					if (!dropZone.contains(e.relatedTarget)) {
						dropZone.classList.remove('wmp-drop-active');
					}
				});
				dropZone.addEventListener('drop', (e) => {
					e.preventDefault();
					e.stopPropagation();
					dropZone.classList.remove('wmp-drop-active');
					const raw = e.dataTransfer.getData('text/plain');
					if (raw && typeof fs !== 'undefined') {
						try {
							const paths = JSON.parse(raw);
							if (Array.isArray(paths)) {
								paths.forEach(p => {
									const el = fs.findByPath(p);
									if (el) this.appendTrack(el);
								});
							}
						} catch (err) {}
					}
				});
			}

			this.bindEnhancementFormControls(win);

			const onTimeUpdate = (el) => {
				if (isSeeking) return;
				const cur = el.currentTime || 0;
				const dur = el.duration || 0;
				win.querySelector('#wmp-time-current').textContent = formatTime(cur);
				if (dur > 0) {
					win.querySelector('#wmp-time-duration').textContent = formatTime(dur);
					seekBar.value = String((cur / dur) * 100);
				} else {
					seekBar.value = '0';
				}
			};

			audio.addEventListener('timeupdate', () => onTimeUpdate(audio));
			video.addEventListener('timeupdate', () => onTimeUpdate(video));

			const onMediaEnded = () => {
				if (repeatMode === 'one') {
					const activeMedia = this.getActiveMedia();
					if (activeMedia) {
						activeMedia.currentTime = 0;
						activeMedia.play();
					}
					return;
				}
				this.playNext();
			};

			audio.addEventListener('ended', onMediaEnded);
			video.addEventListener('ended', onMediaEnded);

			audio.addEventListener('play', () => {
				isPlaying = true;
				this._isRecovering = false;
				this.updatePlayStateUI(win, true);
				this.startVisualizer(win);
				if (window.AchievementsManager) {
					window.AchievementsManager.progress('first_music_track', 1);
				}
			});
			video.addEventListener('play', () => {
				isPlaying = true;
				this.updatePlayStateUI(win, true);
				if (window.AchievementsManager) {
					window.AchievementsManager.progress('first_music_track', 1);
				}
			});

			let playbackAccumulatorTimer = setInterval(() => {
				if (isPlaying && activePlayerWindow && document.getElementById(activePlayerWindow.id)) {
					let totalSecs = parseInt(localStorage.getItem('xp_music_playback_seconds') || '0', 10) + 1;
					localStorage.setItem('xp_music_playback_seconds', String(totalSecs));
					if (window.AchievementsManager) {
						window.AchievementsManager.setProgress('music_ten_minutes', totalSecs);
					}
				}
			}, 1000);

			audio.addEventListener('playing', () => {
				isPlaying = true;
				this._isRecovering = false;
				const sbStatus = win.querySelector('#wmp-sb-status');
				if (sbStatus) sbStatus.textContent = 'Playing';
				this.updatePlayStateUI(win, true);
			});

			audio.addEventListener('pause', () => {
				isPlaying = false;
				this.updatePlayStateUI(win, false);
			});
			video.addEventListener('pause', () => {
				isPlaying = false;
				this.updatePlayStateUI(win, false);
			});

			audio.addEventListener('error', () => {
				if (audio.currentSrc && audio.currentSrc !== window.location.href && !audio.paused) {
					this.handlePlaybackError(win);
				}
			});
			video.addEventListener('error', () => {
				if (video.currentSrc && video.currentSrc !== window.location.href) {
					this.handlePlaybackError(win);
				}
			});

			audio.addEventListener('loadedmetadata', () => {
				if (audio.duration && !isNaN(audio.duration)) {
					const durStr = formatTime(audio.duration);
					const timeDur = win.querySelector('#wmp-time-duration');
					if (timeDur) timeDur.textContent = durStr;
				}
			});
			video.addEventListener('loadedmetadata', () => {
				if (video.duration && !isNaN(video.duration)) {
					const durStr = formatTime(video.duration);
					const timeDur = win.querySelector('#wmp-time-duration');
					if (timeDur) timeDur.textContent = durStr;
				}
			});

			win.querySelectorAll('.wmp-menu-item').forEach(item => {
				item.addEventListener('click', (e) => {
					e.stopPropagation();
					const mType = item.dataset.wmpMenu;
					const rect = item.getBoundingClientRect();
					this.openMenuBar(mType, win, rect.left, rect.bottom);
				});
			});

			win.addEventListener('keydown', (e) => {
				if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
				if (e.code === 'Space') {
					e.preventDefault();
					this.togglePlay();
				} else if (e.ctrlKey && e.code === 'KeyB') {
					e.preventDefault();
					this.playPrevious();
				} else if (e.ctrlKey && e.code === 'KeyF') {
					e.preventDefault();
					this.playNext();
				} else if (e.ctrlKey && e.code === 'KeyS') {
					e.preventDefault();
					this.stop();
				} else if (e.ctrlKey && e.code === 'KeyM') {
					e.preventDefault();
					muteBtn.click();
				} else if (e.ctrlKey && e.code === 'KeyH') {
					e.preventDefault();
					shuffleBtn.click();
				} else if (e.ctrlKey && e.code === 'KeyT') {
					e.preventDefault();
					repeatBtn.click();
				} else if (e.ctrlKey && e.code === 'KeyE') {
					e.preventDefault();
					enhBtn.click();
				} else if (e.ctrlKey && e.code === 'KeyL') {
					e.preventDefault();
					togglePlBtn.click();
				} else if (e.key === 'ArrowRight') {
					const activeMedia = this.getActiveMedia();
					if (activeMedia && activeMedia.duration) {
						activeMedia.currentTime = Math.min(activeMedia.duration, activeMedia.currentTime + 5);
					}
				} else if (e.key === 'ArrowLeft') {
					const activeMedia = this.getActiveMedia();
					if (activeMedia) {
						activeMedia.currentTime = Math.max(0, activeMedia.currentTime - 5);
					}
				}
			});

			this.updateVisualizationModeUI(win);
		},

		renderEqualizerUI(win) {
			const container = win.querySelector('#wmp-eq-sliders-container');
			const presetSelect = win.querySelector('#wmp-eq-preset-select');
			if (!container || !presetSelect) return;

			presetSelect.innerHTML = '';
			Object.keys(EQ_PRESETS).forEach(presetName => {
				const opt = document.createElement('option');
				opt.value = presetName;
				opt.textContent = presetName;
				if (presetName === currentEqPreset) opt.selected = true;
				presetSelect.appendChild(opt);
			});
			const customOpt = document.createElement('option');
			customOpt.value = 'Custom';
			customOpt.textContent = 'Custom';
			if (currentEqPreset === 'Custom') customOpt.selected = true;
			presetSelect.appendChild(customOpt);

			container.innerHTML = '';
			EQ_FREQUENCIES.forEach((freq, idx) => {
				const label = freq >= 1000 ? `${freq / 1000}k` : `${freq}`;
				const col = document.createElement('div');
				col.className = 'wmp-eq-col';
				const currentGain = currentEqGains[idx] || 0;
				col.innerHTML = `
					<span class="wmp-eq-gain-val" id="wmp-eq-gain-${idx}">${currentGain > 0 ? '+' : ''}${currentGain}dB</span>
					<div class="wmp-eq-slider-wrapper">
						<input type="range" class="wmp-eq-slider" orient="vertical" min="-12" max="12" step="0.5" value="${currentGain}" data-band="${idx}">
					</div>
					<span class="wmp-eq-freq-label">${label}</span>
				`;

				const slider = col.querySelector('input');
				slider.addEventListener('input', () => {
					currentEqGains[idx] = parseFloat(slider.value);
					const valSpan = col.querySelector(`#wmp-eq-gain-${idx}`);
					if (valSpan) valSpan.textContent = `${currentEqGains[idx] > 0 ? '+' : ''}${currentEqGains[idx]}dB`;
					currentEqPreset = 'Custom';
					presetSelect.value = 'Custom';
					this.applyEqualizerSettings();
					if (window.AchievementsManager) {
						window.AchievementsManager.progress('equalizer_tuner', 1);
					}
				});

				container.appendChild(col);
			});
		},

		bindEnhancementFormControls(win) {
			const eqToggle = win.querySelector('#wmp-eq-toggle');
			const presetSelect = win.querySelector('#wmp-eq-preset-select');
			const resetBtn = win.querySelector('#wmp-eq-reset-btn');
			const srsToggle = win.querySelector('#wmp-srs-toggle');
			const trubassSlider = win.querySelector('#wmp-srs-trubass');
			const ambienceSlider = win.querySelector('#wmp-srs-ambience');
			const speedSlider = win.querySelector('#wmp-speed-slider');
			const speedVal = win.querySelector('#wmp-speed-val');
			const balanceSlider = win.querySelector('#wmp-balance-slider');
			const balanceCenter = win.querySelector('#wmp-balance-center');
			const aspectSelect = win.querySelector('#wmp-aspect-select');
			const vidBright = win.querySelector('#wmp-vid-bright');
			const vidContrast = win.querySelector('#wmp-vid-contrast');
			const vidSat = win.querySelector('#wmp-vid-sat');
			const video = win.querySelector('#wmp-video-player');

			if (eqToggle) {
				eqToggle.addEventListener('change', () => {
					isEqEnabled = eqToggle.checked;
					this.applyEqualizerSettings();
				});
			}

			if (presetSelect) {
				presetSelect.addEventListener('change', () => {
					const preset = presetSelect.value;
					if (EQ_PRESETS[preset]) {
						currentEqGains = [...EQ_PRESETS[preset]];
						currentEqPreset = preset;
						win.querySelectorAll('.wmp-eq-slider').forEach((sl, idx) => {
							sl.value = String(currentEqGains[idx]);
							const valSpan = win.querySelector(`#wmp-eq-gain-${idx}`);
							if (valSpan) valSpan.textContent = `${currentEqGains[idx] > 0 ? '+' : ''}${currentEqGains[idx]}dB`;
						});
						this.applyEqualizerSettings();
					}
				});
			}

			if (resetBtn) {
				resetBtn.addEventListener('click', () => {
					currentEqGains = [...EQ_PRESETS['Flat']];
					currentEqPreset = 'Flat';
					presetSelect.value = 'Flat';
					win.querySelectorAll('.wmp-eq-slider').forEach((sl, idx) => {
						sl.value = '0';
						const valSpan = win.querySelector(`#wmp-eq-gain-${idx}`);
						if (valSpan) valSpan.textContent = '0dB';
					});
					this.applyEqualizerSettings();
				});
			}

			if (srsToggle) {
				srsToggle.addEventListener('change', () => {
					isSrsEnabled = srsToggle.checked;
					this.applyEnhancementEffects();
				});
			}

			if (trubassSlider) {
				trubassSlider.addEventListener('input', () => {
					trubassAmount = parseFloat(trubassSlider.value);
					this.applyEnhancementEffects();
				});
			}

			if (ambienceSlider) {
				ambienceSlider.addEventListener('input', () => {
					srsWowAmount = parseFloat(ambienceSlider.value);
					this.applyEnhancementEffects();
				});
			}

			if (speedSlider) {
				speedSlider.addEventListener('input', () => {
					playbackSpeed = parseFloat(speedSlider.value);
					if (speedVal) speedVal.textContent = `${playbackSpeed.toFixed(2)}x`;
					this.applyEnhancementEffects();
				});
			}

			if (balanceSlider) {
				balanceSlider.addEventListener('input', () => {
					stereoBalance = parseFloat(balanceSlider.value);
					this.applyEnhancementEffects();
				});
			}

			if (balanceCenter) {
				balanceCenter.addEventListener('click', () => {
					stereoBalance = 0;
					if (balanceSlider) balanceSlider.value = '0';
					this.applyEnhancementEffects();
				});
			}

			if (aspectSelect) {
				aspectSelect.addEventListener('change', () => {
					videoAspectRatio = aspectSelect.value;
					this.applyVideoFilters(video);
				});
			}

			const updateVid = () => {
				videoBrightness = parseInt(vidBright.value, 10);
				videoContrast = parseInt(vidContrast.value, 10);
				videoSaturation = parseInt(vidSat.value, 10);
				this.applyVideoFilters(video);
			};

			if (vidBright) vidBright.addEventListener('input', updateVid);
			if (vidContrast) vidContrast.addEventListener('input', updateVid);
			if (vidSat) vidSat.addEventListener('input', updateVid);
		},

		updateVisualizationModeUI(win) {
			const canvas = win.querySelector('#wmp-visualizer-canvas');
			const artStage = win.querySelector('#wmp-albumart-stage');
			if (!canvas || !artStage) return;

			const labelMap = {
				albumart: 'Album Art',
				bars: 'Bars',
				wave: 'Waveform',
				spectrum: 'Spectrum',
				particles: 'Particles',
				flame: 'Fire Flame'
			};
			const vizLbl = win.querySelector('#wmp-viz-label');
			if (vizLbl) {
				vizLbl.textContent = `Viz: ${labelMap[currentVisualization] || 'Bars'}`;
			}

			if (currentVisualization === 'albumart') {
				canvas.style.display = 'none';
				artStage.style.display = 'flex';
			} else {
				canvas.style.display = 'block';
				artStage.style.display = 'none';
				this.startVisualizer(win);
			}
		},

		getActiveMedia() {
			const activeTrack = currentPlaylist[currentTrackIndex];
			if (activeTrack && activeTrack.isVideo) {
				return currentVideoElement;
			}
			return currentAudioElement;
		},

		getNowPlaying() {
			if (currentTrackIndex >= 0 && currentPlaylist[currentTrackIndex]) {
				const t = currentPlaylist[currentTrackIndex];
				return {
					title: t.title,
					artist: t.artist,
					album: t.album,
					isPlaying: isPlaying
				};
			}
			return null;
		},

		async loadDefaultLibrary() {
			if (window.MusicStore) {
				const primaries = await window.MusicStore.init();
				if (primaries && primaries.length > 0) {
					this.setPlaylist(primaries.map(p => this.normalizeTrack(p)), 0, false);
				}
			}
		},

		filterLibraryByFolder(folderQuery) {
			if (!window.MusicStore) return;
			const primaries = window.MusicStore.getPrimaries() || [];
			const filtered = primaries.filter(p => {
				const isSingle = window.MusicStore.isSingleTrack(p);
				if (folderQuery === 'single') return isSingle;
				return !isSingle;
			});
			if (filtered.length > 0) {
				this.setPlaylist(filtered.map(p => this.normalizeTrack(p)), 0, true);
			}
		},

		sortCurrentPlaylist(criteria) {
			if (!currentPlaylist || currentPlaylist.length === 0) return;
			const active = currentPlaylist[currentTrackIndex];
			currentPlaylist.sort((a, b) => {
				if (criteria === 'title') return a.title.localeCompare(b.title);
				if (criteria === 'artist') return a.artist.localeCompare(b.artist);
				if (criteria === 'duration') return (a.duration || '').localeCompare(b.duration || '');
				return 0;
			});
			if (active) {
				currentTrackIndex = currentPlaylist.indexOf(active);
			}
			if (activePlayerWindow) {
				this.renderPlaylist(activePlayerWindow);
			}
		},

		exportPlaylistM3U() {
			if (!currentPlaylist || currentPlaylist.length === 0) return;
			let m3u = '#EXTM3U\r\n';
			currentPlaylist.forEach(t => {
				m3u += `#EXTINF:-1,${t.artist} - ${t.title}\r\n${t.url}\r\n`;
			});
			const blob = new Blob([m3u], { type: 'audio/x-mpegurl;charset=utf-8' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'NowPlaying.m3u';
			document.body.appendChild(a);
			a.click();
			a.remove();
		},

		appendTrack(item) {
			const normalized = this.normalizeTrack(item);
			if (!normalized) return;
			currentPlaylist.push(normalized);
			if (activePlayerWindow) {
				this.renderPlaylist(activePlayerWindow);
			}
			if (currentPlaylist.length === 1) {
				this.playIndex(0);
			}
		},

		normalizeTrack(target) {
			if (!target) return null;

			if (target.file && target.metadata) {
				const isVid = /\.(mp4|avi|wmv|mkv|mov|mpg|webm)$/i.test(target.file.name || '');
				const artists = window.MusicStore ? window.MusicStore.normalizeArtists(target.metadata.artists) : (target.metadata.artists || []);
				const artistStr = artists.length > 0 ? artists.join(', ') : (target.metadata.album_artist || 'Wartets');
				const titleStr = target.logic?.track_name || target.metadata.title || target.file.name.replace(/\.[^/.]+$/, '');
				const candidates = window.MusicStore ? window.MusicStore.buildAudioCandidates(target) : [window.MusicStore ? window.MusicStore.toMediaUrl(target.file.path, 'media') : target.file.path];
				const url = candidates[0] || '';
				const bestArt = window.MusicStore ? window.MusicStore.getBestArtwork(target) : null;
				const artUrl = bestArt ? (window.MusicStore ? window.MusicStore.toMediaUrl(bestArt.path, 'media') : bestArt.path) : null;

				return {
					id: target.logic?.hash_sha256 || target.file.path,
					title: titleStr,
					artist: artistStr,
					album: target.metadata.album || '',
					year: target.metadata.year || '',
					genre: target.metadata.genre || '',
					duration: target.audio_specs?.duration || '00:00',
					url: url,
					candidates: candidates,
					artwork: artUrl,
					isVideo: isVid,
					raw: target
				};
			}

			if (target instanceof File || (target && typeof target === 'object' && target.name)) {
				const isVid = /\.(mp4|avi|wmv|mkv|mov|mpg|webm)$/i.test(target.name || '');
				if (target.musicTrack) {
					return this.normalizeTrack(target.musicTrack);
				}
				if (window.MusicStore) {
					const matched = window.MusicStore.resolveRawItem(target.remoteUrl || target.name);
					if (matched) {
						return this.normalizeTrack(matched);
					}
				}
				const nameOnly = target.name.replace(/\.[^/.]+$/, '');
				const parentName = target.parent ? target.parent.name : '';
				const rawUrl = target.remoteUrl || target.content || '';
				const candidates = target.remoteUrl ? [target.remoteUrl] : [];
				return {
					id: target.getFullPath ? target.getFullPath() : target.name,
					title: nameOnly,
					artist: 'Wartets',
					album: parentName,
					year: '',
					genre: '',
					duration: '00:00',
					url: rawUrl,
					candidates: candidates,
					artwork: null,
					isVideo: isVid,
					raw: target
				};
			}

			if (typeof target === 'string') {
				const isVid = /\.(mp4|avi|wmv|mkv|mov|mpg|webm)$/i.test(target);
				const baseName = target.split('/').pop().replace(/\.[^/.]+$/, '');
				const candidates = window.MusicStore ? window.MusicStore.buildAudioCandidates({ file: { path: target } }) : [target];
				return {
					id: target,
					title: baseName,
					artist: 'Wartets',
					album: '',
					year: '',
					genre: '',
					duration: '00:00',
					url: candidates[0] || target,
					candidates: candidates,
					artwork: null,
					isVideo: isVid,
					raw: null
				};
			}

			return target;
		},

		loadAndPlay(target, options = {}) {
			const normalized = this.normalizeTrack(target);
			if (!normalized) return;

			if (options.playlist && Array.isArray(options.playlist)) {
				const pl = options.playlist.map(t => this.normalizeTrack(t)).filter(Boolean);
				const idx = pl.findIndex(t => t.url === normalized.url || t.id === normalized.id);
				this.setPlaylist(pl, idx >= 0 ? idx : 0, true);
				return;
			}

			const existingIdx = currentPlaylist.findIndex(t => t.url === normalized.url || t.id === normalized.id);
			if (existingIdx !== -1) {
				this.playIndex(existingIdx);
			} else {
				currentPlaylist.unshift(normalized);
				this.setPlaylist(currentPlaylist, 0, true);
			}
		},

		setPlaylist(tracks, startIndex = 0, autoplay = true) {
			currentPlaylist = tracks || [];
			currentTrackIndex = Math.max(0, Math.min(startIndex, currentPlaylist.length - 1));
			if (activePlayerWindow) {
				this.renderPlaylist(activePlayerWindow);
				if (currentPlaylist[currentTrackIndex]) {
					this.updateTrackInfoUI(activePlayerWindow, currentPlaylist[currentTrackIndex]);
				}
			}
			if (currentPlaylist.length > 0 && autoplay) {
				this.playIndex(currentTrackIndex);
			}
		},

		updateTrackInfoUI(win, track) {
			if (!win || !track) return;
			const hudTitle = win.querySelector('#wmp-hud-title');
			const hudArtist = win.querySelector('#wmp-hud-artist');
			const artImg = win.querySelector('#wmp-art-img');
			const artTitle = win.querySelector('#wmp-art-title');
			const artArtist = win.querySelector('#wmp-art-artist');
			const artAlbum = win.querySelector('#wmp-art-album');
			const sbSpecs = win.querySelector('#wmp-sb-specs');
			const timeDur = win.querySelector('#wmp-time-duration');
			const backdrop = win.querySelector('#wmp-artwork-backdrop');

			if (hudTitle) hudTitle.textContent = track.title;
			if (hudArtist) hudArtist.textContent = `${track.artist} • ${track.album || 'Windows Media'}`;
			if (artTitle) artTitle.textContent = track.title;
			if (artArtist) artArtist.textContent = track.artist;
			if (artAlbum) artAlbum.textContent = track.album ? `${track.album}${track.year ? ` (${track.year})` : ''}` : 'Windows Media Library';
			if (timeDur && track.duration && track.duration !== '00:00') timeDur.textContent = track.duration;

			if (sbSpecs) {
				sbSpecs.textContent = track.isVideo
					? 'Video Clip / MPEG-4'
					: `Audio: ${track.raw?.audio_specs?.codec || 'FLAC / MP3'} • ${track.raw?.audio_specs?.sample_rate || '44.1 kHz'}`;
			}

			const artworkSrc = track.artwork || '../assets/images/desk/icons/Music File.webp';
			if (artImg) artImg.src = artworkSrc;

			if (backdrop) {
				if (track.artwork) {
					backdrop.style.backgroundImage = `url('${track.artwork}')`;
					backdrop.classList.add('visible');
				} else {
					backdrop.style.backgroundImage = 'none';
					backdrop.classList.remove('visible');
				}
			}
		},

		playIndex(index) {
			if (index < 0 || index >= currentPlaylist.length) return;
			currentTrackIndex = index;
			currentCandidateIndex = 0;
			this._isRecovering = false;
			const track = currentPlaylist[currentTrackIndex];
			if (!track || !activePlayerWindow) return;

			const audio = activePlayerWindow.querySelector('#wmp-audio-player');
			const video = activePlayerWindow.querySelector('#wmp-video-player');
			const videoBox = activePlayerWindow.querySelector('#wmp-video-box');
			const visualizerBox = activePlayerWindow.querySelector('#wmp-viz-box');
			const sbStatus = activePlayerWindow.querySelector('#wmp-sb-status');

			this.updateTrackInfoUI(activePlayerWindow, track);
			if (sbStatus) sbStatus.textContent = `Connecting: ${track.title}`;

			if (typeof addToRecentDocs === 'function') {
				addToRecentDocs({
					name: track.title,
					type: track.isVideo ? 'video' : 'music',
					icon: track.artwork || '../assets/images/desk/icons/Music File.webp',
					path: track.url
				});
			}

			if (track.isVideo) {
				if (audio) {
					audio.pause();
					audio.src = '';
				}
				if (videoBox) videoBox.style.display = 'flex';
				if (visualizerBox) visualizerBox.style.display = 'none';
				if (video) {
					video.src = track.url;
					video.volume = isMuted ? 0 : currentVolume;
					video.muted = isMuted;
					this.applyVideoFilters(video);
					video.play().then(() => {
						isPlaying = true;
						if (sbStatus) sbStatus.textContent = 'Playing';
						this.updatePlayStateUI(activePlayerWindow, true);
						if (window.AchievementsManager) {
							window.AchievementsManager.progress('video_watcher', 1);
						}
					}).catch(() => {
						if (sbStatus) sbStatus.textContent = 'Ready';
						this.updatePlayStateUI(activePlayerWindow, false);
					});
				}
			} else {
				if (video) {
					video.pause();
					video.src = '';
				}
				if (videoBox) videoBox.style.display = 'none';
				if (visualizerBox) visualizerBox.style.display = 'flex';

				const candidates = (track.candidates && track.candidates.length > 0)
					? track.candidates
					: [track.url];
				this.playCandidate(candidates[0]);
			}

			this.highlightPlaylistRow(activePlayerWindow);

			if (window.DeskEventBus) {
				window.DeskEventBus.emit('mediaplayer:trackchanged', { track, index });
			}
		},

		playCandidate(url) {
			if (!activePlayerWindow || !url) return;
			const audio = activePlayerWindow.querySelector('#wmp-audio-player');
			const sbStatus = activePlayerWindow.querySelector('#wmp-sb-status');
			if (!audio) return;

			this.initAudioContext(audio);
			if (audioCtx && audioCtx.state === 'suspended') {
				audioCtx.resume();
			}

			audio.pause();
			audio.removeAttribute('crossorigin');
			audio.src = url;
			audio.volume = isMuted ? 0 : currentVolume;
			audio.muted = isMuted;
			audio.playbackRate = playbackSpeed;
			audio.load();

			const playPromise = audio.play();
			if (playPromise !== undefined) {
				playPromise.then(() => {
					isPlaying = true;
					this._isRecovering = false;
					if (sbStatus) sbStatus.textContent = 'Playing';
					this.updatePlayStateUI(activePlayerWindow, true);
					this.applyEqualizerSettings();
					this.applyEnhancementEffects();
					this.startVisualizer(activePlayerWindow);
					if (window.AchievementsManager) {
						window.AchievementsManager.progress('music_enthusiast', 1);
					}
				}).catch((err) => {
					if (err && err.name !== 'AbortError') {
						this.handlePlaybackError(activePlayerWindow);
					}
				});
			}
		},

		togglePlay() {
			if (!currentPlaylist || currentPlaylist.length === 0) {
				const sbStatus = activePlayerWindow ? activePlayerWindow.querySelector('#wmp-sb-status') : null;
				if (sbStatus) sbStatus.textContent = 'Playlist is empty. Add a track to begin playback.';
				return;
			}
			const activeMedia = this.getActiveMedia();
			if (!activeMedia) return;

			if (currentTrackIndex === -1 && currentPlaylist.length > 0) {
				this.playIndex(0);
				return;
			}

			if (!activeMedia.src || activeMedia.src === '' || activeMedia.src === window.location.href) {
				this.playIndex(currentTrackIndex >= 0 ? currentTrackIndex : 0);
				return;
			}

			if (audioCtx && audioCtx.state === 'suspended') {
				audioCtx.resume();
			}

			if (activeMedia.paused) {
				const p = activeMedia.play();
				if (p !== undefined) {
					p.catch(() => {
						this.handlePlaybackError(activePlayerWindow);
					});
				}
			} else {
				activeMedia.pause();
			}
		},

		stop() {
			const audio = currentAudioElement;
			const video = currentVideoElement;
			if (audio) {
				audio.pause();
				audio.currentTime = 0;
			}
			if (video) {
				video.pause();
				video.currentTime = 0;
			}
			if (activePlayerWindow) {
				const seekBar = activePlayerWindow.querySelector('#wmp-seek-bar');
				const timeCur = activePlayerWindow.querySelector('#wmp-time-current');
				const sbStatus = activePlayerWindow.querySelector('#wmp-sb-status');
				if (seekBar) seekBar.value = '0';
				if (timeCur) timeCur.textContent = '00:00';
				if (sbStatus) sbStatus.textContent = 'Stopped';
				this.updatePlayStateUI(activePlayerWindow, false);
			}
		},

		playNext() {
			if (currentPlaylist.length === 0) return;
			let nextIdx = currentTrackIndex + 1;
			if (isShuffle) {
				nextIdx = Math.floor(Math.random() * currentPlaylist.length);
			} else if (nextIdx >= currentPlaylist.length) {
				if (repeatMode === 'all') nextIdx = 0;
				else {
					this.stop();
					return;
				}
			}
			this.playIndex(nextIdx);
		},

		playPrevious() {
			if (currentPlaylist.length === 0) return;
			const activeMedia = this.getActiveMedia();
			if (activeMedia && activeMedia.currentTime > 3) {
				activeMedia.currentTime = 0;
				return;
			}
			let prevIdx = currentTrackIndex - 1;
			if (prevIdx < 0) {
				prevIdx = currentPlaylist.length - 1;
			}
			this.playIndex(prevIdx);
		},

		handlePlaybackError(win) {
			if (this._isRecovering) return;
			this._isRecovering = true;

			const track = currentPlaylist[currentTrackIndex];
			if (!track) {
				this._isRecovering = false;
				return;
			}

			const candidates = (track.candidates && track.candidates.length > 0) ? track.candidates : [track.url];
			currentCandidateIndex++;

			if (currentCandidateIndex < candidates.length) {
				const nextUrl = candidates[currentCandidateIndex];
				setTimeout(() => {
					this._isRecovering = false;
					this.playCandidate(nextUrl);
				}, 100);
				return;
			}

			this._isRecovering = false;
			const sbStatus = win ? win.querySelector('#wmp-sb-status') : null;
			if (sbStatus) sbStatus.textContent = 'Playback error: media file could not be decoded.';
			this.updatePlayStateUI(win, false);
			isPlaying = false;
		},

		updatePlayStateUI(win, isNowPlaying) {
			const playIcon = win.querySelector('#wmp-play-icon-shape');
			const sbStatus = win.querySelector('#wmp-sb-status');
			if (playIcon) {
				if (isNowPlaying) {
					playIcon.className = 'wmp-icon-pause';
				} else {
					playIcon.className = 'wmp-icon-play';
				}
			}
			if (sbStatus && (sbStatus.textContent === 'Playing' || sbStatus.textContent === 'Paused' || sbStatus.textContent === 'Stopped')) {
				sbStatus.textContent = isNowPlaying ? 'Playing' : 'Paused';
			}
		},

		updateMuteUI(win) {
			const volIcon = win.querySelector('#wmp-vol-icon-shape');
			if (volIcon) {
				volIcon.className = isMuted ? 'wmp-icon-vol-muted' : 'wmp-icon-vol';
			}
		},

		renderPlaylist(win, filterQuery = '') {
			const listEl = win.querySelector('#wmp-playlist-items');
			const countBadge = win.querySelector('#wmp-playlist-count');
			if (!listEl) return;

			listEl.innerHTML = '';
			const filtered = currentPlaylist.filter(t => {
				if (!filterQuery) return true;
				const matchT = t.title.toLowerCase().includes(filterQuery);
				const matchA = t.artist.toLowerCase().includes(filterQuery);
				const matchAl = (t.album || '').toLowerCase().includes(filterQuery);
				return matchT || matchA || matchAl;
			});

			if (countBadge) {
				countBadge.textContent = `${currentPlaylist.length} item(s)`;
			}

			filtered.forEach(track => {
				const realIndex = currentPlaylist.indexOf(track);
				const li = document.createElement('li');
				li.className = `wmp-playlist-row ${realIndex === currentTrackIndex ? 'active' : ''}`;
				li.dataset.index = String(realIndex);
				li.draggable = true;

				li.innerHTML = `
					<div class="wmp-pl-col-idx">${realIndex + 1}</div>
					<div class="wmp-pl-col-title">
						<strong>${track.title}</strong>
						<span>${track.artist}</span>
					</div>
					<div class="wmp-pl-col-dur">${track.duration || '--:--'}</div>
				`;

				li.addEventListener('dblclick', () => {
					this.playIndex(realIndex);
				});

				li.addEventListener('dragstart', (e) => {
					e.dataTransfer.effectAllowed = 'move';
					e.dataTransfer.setData('text/wmp-track-index', String(realIndex));
					li.classList.add('wmp-pl-dragging');
				});

				li.addEventListener('dragover', (e) => {
					e.preventDefault();
					li.classList.add('wmp-pl-dragover');
				});

				li.addEventListener('dragleave', () => {
					li.classList.remove('wmp-pl-dragover');
				});

				li.addEventListener('drop', (e) => {
					e.preventDefault();
					e.stopPropagation();
					li.classList.remove('wmp-pl-dragover');
					const fromIdx = parseInt(e.dataTransfer.getData('text/wmp-track-index'), 10);
					if (!isNaN(fromIdx) && fromIdx !== realIndex) {
						const moved = currentPlaylist.splice(fromIdx, 1)[0];
						currentPlaylist.splice(realIndex, 0, moved);
						if (currentTrackIndex === fromIdx) currentTrackIndex = realIndex;
						else if (fromIdx < currentTrackIndex && realIndex >= currentTrackIndex) currentTrackIndex--;
						else if (fromIdx > currentTrackIndex && realIndex <= currentTrackIndex) currentTrackIndex++;
						this.renderPlaylist(win);
					}
				});

				li.addEventListener('dragend', () => {
					li.classList.remove('wmp-pl-dragging');
					win.querySelectorAll('.wmp-playlist-row').forEach(r => r.classList.remove('wmp-pl-dragover'));
				});

				li.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					e.stopPropagation();
					if (window.ContextMenu) {
						const menuItems = window.ContextMenu.getMediaPlayerPlaylistItemItems(track, realIndex, this, win);
						window.ContextMenu.show(menuItems, e.clientX, e.clientY);
					}
				});

				listEl.appendChild(li);
			});
		},

		highlightPlaylistRow(win) {
			const rows = win.querySelectorAll('.wmp-playlist-row');
			rows.forEach(r => {
				const idx = parseInt(r.dataset.index, 10);
				r.classList.toggle('active', idx === currentTrackIndex);
			});
		},

		startVisualizer(win) {
			const canvas = win.querySelector('#wmp-visualizer-canvas');
			if (!canvas) return;
			const ctx = canvas.getContext('2d');

			let phase = 0;
			const barCount = 32;
			const barPeaks = new Float32Array(barCount);
			const freqData = new Uint8Array(64);
			const timeDomainData = new Uint8Array(64);
			const particles = [];
			for (let i = 0; i < 45; i++) {
				particles.push({
					x: Math.random() * 500,
					y: Math.random() * 350,
					vx: (Math.random() - 0.5) * 2.0,
					vy: (Math.random() - 0.5) * 2.0,
					baseRadius: Math.random() * 2.5 + 1.5,
					hue: Math.random() * 50 + 190
				});
			}

			const renderLoop = () => {
				if (!activePlayerWindow || !document.getElementById(activePlayerWindow.id)) {
					animationFrameId = null;
					return;
				}

				if (currentVisualization === 'albumart') {
					const artFrame = win.querySelector('.wmp-art-frame');
					if (artFrame && isPlaying) {
						let bass = 0;
						if (analyserNode && audioNodeConnected) {
							analyserNode.getByteFrequencyData(freqData);
							bass = (freqData[0] + freqData[1] + freqData[2] + freqData[3]) / 4;
						}
						if (bass === 0) {
							bass = (Math.sin(phase * 3.5) * 0.5 + 0.5) * 170;
						}
						const scale = 1 + (bass / 255) * 0.055;
						artFrame.style.transform = `scale(${scale.toFixed(3)})`;
					}
					phase += 0.04;
					animationFrameId = requestAnimationFrame(renderLoop);
					return;
				}

				const width = canvas.clientWidth || 400;
				const height = canvas.clientHeight || 280;
				if (canvas.width !== width || canvas.height !== height) {
					canvas.width = width;
					canvas.height = height;
				}

				ctx.fillStyle = '#030813';
				ctx.fillRect(0, 0, width, height);

				let hasRealSignal = false;
				if (isPlaying && analyserNode && audioNodeConnected) {
					analyserNode.getByteFrequencyData(freqData);
					analyserNode.getByteTimeDomainData(timeDomainData);
					for (let i = 0; i < 16; i++) {
						if (freqData[i] > 2) {
							hasRealSignal = true;
							break;
						}
					}
				}

				if (isPlaying && !hasRealSignal) {
					const activeMedia = this.getActiveMedia();
					const curTime = activeMedia ? (activeMedia.currentTime || 0) : 0;
					const beat1 = Math.pow(Math.sin(curTime * 4.2), 4);
					const beat2 = Math.pow(Math.sin(curTime * 8.4 + 1.2), 2);
					for (let i = 0; i < 64; i++) {
						const freqRatio = i / 64;
						const waveA = Math.sin(phase * 3.2 + i * 0.35) * 45;
						const waveB = Math.cos(phase * 2.1 + i * 0.55) * 35;
						const waveC = Math.sin(phase * 5.5 + i * 0.2) * 30 * beat1;
						const bassPeak = (1 - freqRatio) * (140 * beat1 + 40 * beat2);
						const trebleSpark = freqRatio * (60 + Math.sin(phase * 9 + i) * 30);
						const finalVal = Math.max(8, Math.min(255, 60 + waveA + waveB + waveC + bassPeak + trebleSpark));
						freqData[i] = Math.floor(finalVal);
						timeDomainData[i] = Math.floor(128 + Math.sin(phase * 4.0 + i * 0.3) * (30 + beat1 * 35));
					}
				} else if (!isPlaying) {
					for (let i = 0; i < 64; i++) {
						freqData[i] = Math.max(0, freqData[i] * 0.85);
						timeDomainData[i] = 128;
					}
				}

				phase += 0.05;

				if (currentVisualization === 'bars') {
					const gap = 3;
					const barW = Math.max(2, (width - (barCount + 1) * gap) / barCount);
					for (let i = 0; i < barCount; i++) {
						const val = (freqData[i] || 0) / 255;
						const targetH = Math.max(3, val * (height * 0.82));
						const x = gap + i * (barW + gap);
						const y = height - targetH - 8;

						if (targetH > barPeaks[i]) {
							barPeaks[i] = targetH;
						} else {
							barPeaks[i] = Math.max(0, barPeaks[i] - 2.2);
						}

						const grad = ctx.createLinearGradient(0, y, 0, height);
						grad.addColorStop(0, '#00f6ff');
						grad.addColorStop(0.3, '#0088ff');
						grad.addColorStop(0.7, '#0033cc');
						grad.addColorStop(1, '#001144');

						ctx.fillStyle = grad;
						ctx.fillRect(x, y, barW, targetH);

						ctx.fillStyle = '#ffffff';
						ctx.fillRect(x, height - barPeaks[i] - 10, barW, 2);
					}
				} else if (currentVisualization === 'wave') {
					ctx.beginPath();
					ctx.lineWidth = 2.5;
					ctx.strokeStyle = '#00f0ff';
					ctx.shadowBlur = 10;
					ctx.shadowColor = '#00aaff';
					const sliceW = width / 63;
					for (let i = 0; i < 64; i++) {
						const v = (timeDomainData[i] || 128) / 128.0;
						const y = (v * height) / 2;
						const x = i * sliceW;
						if (i === 0) ctx.moveTo(x, y);
						else ctx.lineTo(x, y);
					}
					ctx.stroke();
					ctx.shadowBlur = 0;
				} else if (currentVisualization === 'spectrum') {
					const cx = width / 2;
					const cy = height / 2;
					const baseR = Math.min(width, height) * 0.26;

					ctx.beginPath();
					ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
					ctx.strokeStyle = 'rgba(0, 190, 255, 0.45)';
					ctx.lineWidth = 2;
					ctx.stroke();

					for (let i = 0; i < barCount; i++) {
						const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
						const val = (freqData[i] || 0) / 255;
						const r2 = baseR + val * (Math.min(width, height) * 0.32);
						const x1 = cx + Math.cos(angle) * baseR;
						const y1 = cy + Math.sin(angle) * baseR;
						const x2 = cx + Math.cos(angle) * r2;
						const y2 = cy + Math.sin(angle) * r2;

						ctx.beginPath();
						ctx.moveTo(x1, y1);
						ctx.lineTo(x2, y2);
						ctx.strokeStyle = `hsl(${180 + i * 5}, 100%, 65%)`;
						ctx.lineWidth = 3.5;
						ctx.lineCap = 'round';
						ctx.stroke();
					}
				} else if (currentVisualization === 'particles') {
					const bassEnergy = ((freqData[0] || 0) + (freqData[1] || 0) + (freqData[2] || 0)) / 765;
					particles.forEach((p, idx) => {
						const energy = (freqData[idx % barCount] || 40) / 255;
						p.x += p.vx * (1 + energy * 3.5 + bassEnergy * 2.5);
						p.y += p.vy * (1 + energy * 3.5 + bassEnergy * 2.5);
						if (p.x < 0) p.x = width;
						if (p.x > width) p.x = 0;
						if (p.y < 0) p.y = height;
						if (p.y > height) p.y = 0;

						ctx.beginPath();
						ctx.arc(p.x, p.y, p.baseRadius * (1 + energy * 1.8), 0, Math.PI * 2);
						ctx.fillStyle = `hsla(${p.hue}, 95%, 65%, ${0.4 + energy * 0.6})`;
						ctx.shadowBlur = 8;
						ctx.shadowColor = '#00e1ff';
						ctx.fill();
						ctx.shadowBlur = 0;
					});
				} else if (currentVisualization === 'flame') {
					const colW = width / barCount;
					for (let i = 0; i < barCount; i++) {
						const val = (freqData[i] || 0) / 255;
						const barH = val * height * 0.88;
						const x = i * colW;
						const y = height - barH;

						const grad = ctx.createLinearGradient(0, y, 0, height);
						grad.addColorStop(0, '#ffff55');
						grad.addColorStop(0.25, '#ff8800');
						grad.addColorStop(0.65, '#dd1100');
						grad.addColorStop(1, '#220000');

						ctx.fillStyle = grad;
						ctx.fillRect(x + 1, y, colW - 2, barH);
					}
				}

				animationFrameId = requestAnimationFrame(renderLoop);
			};

			if (!animationFrameId) {
				animationFrameId = requestAnimationFrame(renderLoop);
			}
		},

		openMenuBar(menuType, win, x, y) {
			let items = [];
			if (menuType === 'file') {
				items = [
					{ label: 'Open File...', shortcut: 'Ctrl+O', action: () => {
						if (window.FileExplorer && fs) {
							window.FileExplorer.open(fs.root.getByName('Music') || fs.root);
						}
					}},
					{ label: 'Open URL...', shortcut: 'Ctrl+U', action: () => {
						const url = prompt('Enter media URL (audio/video):');
						if (url) this.loadAndPlay(url);
					}},
					{ separator: true },
					{ label: 'Save Playlist As (.m3u)...', action: () => this.exportPlaylistM3U() },
					{ separator: true },
					{ label: 'Exit', action: () => closeWindow(win, win.id) }
				];
			} else if (menuType === 'view') {
				items = [
					{ label: 'Full Screen', shortcut: 'Alt+Enter', action: () => maximizeWindow(win) },
					{ label: 'Playlist Pane', checked: isPlaylistVisible, action: () => {
						const btn = win.querySelector('#wmp-btn-toggle-playlist');
						if (btn) btn.click();
					}},
					{ label: 'Enhancements Drawer', checked: isEnhancementsOpen, action: () => {
						const btn = win.querySelector('#wmp-btn-enhancements');
						if (btn) btn.click();
					}},
					{ separator: true },
					{
						label: 'Visualizations',
						submenu: [
							{ label: 'Album Art View', radio: currentVisualization === 'albumart', action: () => { currentVisualization = 'albumart'; this.updateVisualizationModeUI(win); win.querySelector('#wmp-viz-label').textContent = 'Viz: Album Art'; } },
							{ label: 'Spectrum Bars', radio: currentVisualization === 'bars', action: () => { currentVisualization = 'bars'; this.updateVisualizationModeUI(win); win.querySelector('#wmp-viz-label').textContent = 'Viz: Bars'; } },
							{ label: 'Oscilloscope Waveform', radio: currentVisualization === 'wave', action: () => { currentVisualization = 'wave'; this.updateVisualizationModeUI(win); win.querySelector('#wmp-viz-label').textContent = 'Viz: Waveform'; } },
							{ label: 'Radial Spectrum', radio: currentVisualization === 'spectrum', action: () => { currentVisualization = 'spectrum'; this.updateVisualizationModeUI(win); win.querySelector('#wmp-viz-label').textContent = 'Viz: Spectrum'; } },
							{ label: 'Starfield Particles', radio: currentVisualization === 'particles', action: () => { currentVisualization = 'particles'; this.updateVisualizationModeUI(win); win.querySelector('#wmp-viz-label').textContent = 'Viz: Particles'; } },
							{ label: 'Fire Flame', radio: currentVisualization === 'flame', action: () => { currentVisualization = 'flame'; this.updateVisualizationModeUI(win); win.querySelector('#wmp-viz-label').textContent = 'Viz: Fire Flame'; } }
						]
					}
				];
			} else if (menuType === 'play') {
				items = [
					{ label: isPlaying ? 'Pause' : 'Play', shortcut: 'Space', bold: true, action: () => this.togglePlay() },
					{ label: 'Stop', shortcut: 'Ctrl+S', action: () => this.stop() },
					{ separator: true },
					{ label: 'Previous', shortcut: 'Ctrl+B', action: () => this.playPrevious() },
					{ label: 'Next', shortcut: 'Ctrl+F', action: () => this.playNext() },
					{ separator: true },
					{ label: 'Shuffle', checked: isShuffle, action: () => {
						isShuffle = !isShuffle;
						const btn = win.querySelector('#wmp-btn-shuffle');
						if (btn) btn.classList.toggle('active', isShuffle);
					}},
					{ label: 'Repeat', checked: repeatMode !== 'off', action: () => {
						const btn = win.querySelector('#wmp-btn-repeat');
						if (btn) btn.click();
					}}
				];
			} else if (menuType === 'tools') {
				items = [
					{ label: 'Graphic Equalizer...', action: () => {
						const btn = win.querySelector('#wmp-btn-enhancements');
						if (btn && !isEnhancementsOpen) btn.click();
						const eqTab = win.querySelector('.wmp-enh-tab-btn[data-enh-tab="eq"]');
						if (eqTab) eqTab.click();
					}},
					{ label: 'SRS WOW Effects...', action: () => {
						const btn = win.querySelector('#wmp-btn-enhancements');
						if (btn && !isEnhancementsOpen) btn.click();
						const srsTab = win.querySelector('.wmp-enh-tab-btn[data-enh-tab="srs"]');
						if (srsTab) srsTab.click();
					}},
					{ label: 'Play Speed & Balance Settings...', action: () => {
						const btn = win.querySelector('#wmp-btn-enhancements');
						if (btn && !isEnhancementsOpen) btn.click();
						const speedTab = win.querySelector('.wmp-enh-tab-btn[data-enh-tab="speed"]');
						if (speedTab) speedTab.click();
					}},
					{ separator: true },
					{ label: 'System Audio Properties...', action: () => { if (window.SettingsApp) window.SettingsApp.open('audio'); } }
				];
			} else if (menuType === 'help') {
				items = [
					{ label: 'About Windows Media Player', bold: true, action: () => {
						showXPDialog('About Windows Media Player', 'Windows Media Player 9 Series\nVersion 9.00.00.2980\nMicrosoft Corporation', 'info');
					}}
				];
			}

			if (window.ContextMenu) {
				window.ContextMenu.show(items, x, y);
			}
		}
	};

	Object.defineProperties(MediaPlayerApp, {
		currentPlaylist: {
			get: () => currentPlaylist,
			set: (val) => { currentPlaylist = Array.isArray(val) ? val : []; }
		},
		currentTrackIndex: {
			get: () => currentTrackIndex,
			set: (val) => { currentTrackIndex = typeof val === 'number' ? val : -1; }
		},
		isPlaying: {
			get: () => isPlaying
		},
		isEnhancementsOpen: {
			get: () => isEnhancementsOpen,
			set: (val) => { isEnhancementsOpen = !!val; }
		},
		isPlaylistVisible: {
			get: () => isPlaylistVisible,
			set: (val) => { isPlaylistVisible = !!val; }
		},
		currentVisualization: {
			get: () => currentVisualization,
			set: (val) => { currentVisualization = val; }
		},
		repeatMode: {
			get: () => repeatMode,
			set: (val) => { repeatMode = val; }
		},
		isShuffle: {
			get: () => isShuffle,
			set: (val) => { isShuffle = !!val; }
		},
		videoAspectRatio: {
			get: () => videoAspectRatio,
			set: (val) => { videoAspectRatio = val; }
		}
	});

	window.MediaPlayerApp = MediaPlayerApp;
})();
