(function () {
	let activePlayerWindow = null;
	let currentAudioElement = null;
	let currentVideoElement = null;
	let animationFrameId = null;

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

	const VISUALIZATIONS = ['albumart', 'bars', 'wave', 'spectrum', 'particles'];

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
			const win = createXPWindow(id, 'Windows Media Player', contentHTML, 800, 530, {
				iconSrc: '../assets/images/desk/icons/Video File.webp',
				resizable: true
			});

			win.classList.add('wmp-window');
			win.querySelector('.xp-window-content').style.padding = '0';
			activePlayerWindow = win;

			this.bindPlayerEvents(win);

			if (target) {
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
							<span>Windows Media Player</span>
						</div>
					</div>

					<div class="wmp-main-workspace">
						<div class="wmp-screen-area">
							<div class="wmp-artwork-overlay" id="wmp-artwork-backdrop"></div>
							<div class="wmp-video-container" style="display: none;">
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
							<div class="wmp-playlist-list-wrap">
								<ul class="wmp-playlist-items" id="wmp-playlist-items"></ul>
							</div>
							<div class="wmp-playlist-footer">
								<button type="button" class="xp-button-small" id="wmp-pl-clear-btn">Clear</button>
								<button type="button" class="xp-button-small" id="wmp-pl-add-btn">Add More...</button>
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
								<button type="button" class="wmp-tool-btn" id="wmp-btn-stop" title="Stop">
									<div class="wmp-icon-stop"></div>
								</button>
								<button type="button" class="wmp-tool-btn" id="wmp-btn-next" title="Next Track (Ctrl+F)">
									<div class="wmp-icon-next"></div>
								</button>
							</div>

							<div class="wmp-btn-cluster-center">
								<button type="button" class="wmp-toggle-btn" id="wmp-btn-shuffle" title="Turn Shuffle On/Off">
									<img src="https://api.iconify.design/mdi/shuffle-variant.svg?color=%231b4b9b" alt="">
									<span>Shuffle</span>
								</button>
								<button type="button" class="wmp-toggle-btn" id="wmp-btn-repeat" title="Repeat Mode">
									<img src="https://api.iconify.design/mdi/repeat.svg?color=%231b4b9b" alt="">
									<span id="wmp-repeat-label">Repeat: Off</span>
								</button>
								<button type="button" class="wmp-toggle-btn" id="wmp-btn-viz" title="Change Visualization">
									<img src="https://api.iconify.design/mdi/chart-bell-curve-cumulative.svg?color=%231b4b9b" alt="">
									<span id="wmp-viz-label">Viz: Album Art</span>
								</button>
							</div>

							<div class="wmp-btn-cluster-right">
								<button type="button" class="wmp-tool-btn" id="wmp-btn-mute" title="Mute Volume">
									<div class="wmp-icon-vol" id="wmp-vol-icon-shape"></div>
								</button>
								<input type="range" id="wmp-volume-slider" min="0" max="1" step="0.05" value="0.8" class="wmp-slider wmp-vol-slider" title="Volume">
								<button type="button" class="wmp-toggle-btn active" id="wmp-btn-toggle-playlist" title="Show/Hide Playlist Pane">
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
			const togglePlBtn = win.querySelector('#wmp-btn-toggle-playlist');
			const searchInput = win.querySelector('#wmp-playlist-search');
			const clearPlBtn = win.querySelector('#wmp-pl-clear-btn');
			const addPlBtn = win.querySelector('#wmp-pl-add-btn');

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
					particles: 'Particles'
				};
				win.querySelector('#wmp-viz-label').textContent = `Viz: ${labelMap[currentVisualization] || 'Bars'}`;
				this.updateVisualizationModeUI(win);
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
			});
			video.addEventListener('play', () => {
				isPlaying = true;
				this.updatePlayStateUI(win, true);
			});

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

			this.updateVisualizationModeUI(win);
		},

		updateVisualizationModeUI(win) {
			const canvas = win.querySelector('#wmp-visualizer-canvas');
			const artStage = win.querySelector('#wmp-albumart-stage');
			if (!canvas || !artStage) return;

			if (currentVisualization === 'albumart') {
				canvas.style.display = 'none';
				artStage.style.display = 'flex';
			} else {
				canvas.style.display = 'block';
				artStage.style.display = 'none';
			}
		},

		getActiveMedia() {
			const activeTrack = currentPlaylist[currentTrackIndex];
			if (activeTrack && activeTrack.isVideo) {
				return currentVideoElement;
			}
			return currentAudioElement;
		},

		async loadDefaultLibrary() {
			if (window.MusicStore) {
				const primaries = await window.MusicStore.init();
				if (primaries && primaries.length > 0) {
					this.setPlaylist(primaries.map(p => this.normalizeTrack(p)), 0, false);
				}
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
			const videoBox = activePlayerWindow.querySelector('.wmp-video-container');
			const visualizerBox = activePlayerWindow.querySelector('.wmp-visualizer-container');
			const sbStatus = activePlayerWindow.querySelector('#wmp-sb-status');

			this.updateTrackInfoUI(activePlayerWindow, track);
			if (sbStatus) sbStatus.textContent = `Connecting: ${track.title}`;

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
					video.play().then(() => {
						isPlaying = true;
						if (sbStatus) sbStatus.textContent = 'Playing';
						this.updatePlayStateUI(activePlayerWindow, true);
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

			audio.pause();
			audio.removeAttribute('crossorigin');
			audio.src = url;
			audio.volume = isMuted ? 0 : currentVolume;
			audio.muted = isMuted;
			audio.load();

			const playPromise = audio.play();
			if (playPromise !== undefined) {
				playPromise.then(() => {
					isPlaying = true;
					this._isRecovering = false;
					if (sbStatus) sbStatus.textContent = 'Playing';
					this.updatePlayStateUI(activePlayerWindow, true);
					this.startVisualizer(activePlayerWindow);
				}).catch((err) => {
					if (err && err.name !== 'AbortError') {
						this.handlePlaybackError(activePlayerWindow);
					}
				});
			}
		},

		togglePlay() {
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

				li.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					e.stopPropagation();
					if (window.ContextMenu) {
						const menuItems = [
							{ label: 'Play Now', bold: true, action: () => this.playIndex(realIndex) },
							{ separator: true },
							{ label: 'Remove from Playlist', action: () => {
								currentPlaylist.splice(realIndex, 1);
								if (currentTrackIndex === realIndex) {
									this.playIndex(Math.min(realIndex, currentPlaylist.length - 1));
								} else if (currentTrackIndex > realIndex) {
									currentTrackIndex--;
								}
								this.renderPlaylist(win);
							}},
							{ label: 'Clear Entire Playlist', action: () => {
								currentPlaylist = [];
								this.stop();
								this.renderPlaylist(win);
							}}
						];
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
			const particles = [];
			for (let i = 0; i < 48; i++) {
				particles.push({
					x: Math.random() * 400,
					y: Math.random() * 300,
					vx: (Math.random() - 0.5) * 2,
					vy: (Math.random() - 0.5) * 2,
					radius: Math.random() * 3 + 1,
					hue: Math.random() * 60 + 190
				});
			}

			const renderLoop = () => {
				if (!activePlayerWindow || !document.getElementById(activePlayerWindow.id)) {
					return;
				}
				if (currentVisualization === 'albumart') {
					animationFrameId = requestAnimationFrame(renderLoop);
					return;
				}

				const width = canvas.clientWidth || 400;
				const height = canvas.clientHeight || 280;
				if (canvas.width !== width || canvas.height !== height) {
					canvas.width = width;
					canvas.height = height;
				}

				ctx.clearRect(0, 0, width, height);

				const freqData = new Uint8Array(64);
				if (isPlaying) {
					for (let i = 0; i < 64; i++) {
						const freq1 = Math.sin(phase * 1.5 + i * 0.25) * 45;
						const freq2 = Math.cos(phase * 0.8 + i * 0.12) * 35;
						const freq3 = Math.sin(phase * 2.2 + i * 0.4) * 25;
						freqData[i] = Math.max(10, Math.min(250, 90 + freq1 + freq2 + freq3));
					}
				}

				phase += 0.05;

				if (currentVisualization === 'bars') {
					const barCount = 32;
					const barWidth = width / barCount - 2;
					for (let i = 0; i < barCount; i++) {
						const val = (freqData[i] || 0) / 255;
						const barHeight = Math.max(4, val * (height * 0.75));
						const x = i * (barWidth + 2);
						const y = height - barHeight - 10;

						const grad = ctx.createLinearGradient(0, y, 0, height);
						grad.addColorStop(0, '#00d2ff');
						grad.addColorStop(0.5, '#0055ff');
						grad.addColorStop(1, '#001166');

						ctx.fillStyle = grad;
						ctx.fillRect(x, y, barWidth, barHeight);

						ctx.fillStyle = '#ffffff';
						ctx.fillRect(x, y - 2, barWidth, 1.5);
					}
				} else if (currentVisualization === 'wave') {
					ctx.beginPath();
					ctx.lineWidth = 2.5;
					ctx.strokeStyle = '#00f0ff';
					const sliceWidth = width / 64;
					let x = 0;
					for (let i = 0; i < 64; i++) {
						const v = (freqData[i] || 128) / 128.0;
						const y = (v * height) / 2;
						if (i === 0) ctx.moveTo(x, y);
						else ctx.lineTo(x, y);
						x += sliceWidth;
					}
					ctx.stroke();
				} else if (currentVisualization === 'spectrum') {
					const cx = width / 2;
					const cy = height / 2;
					const radius = Math.min(width, height) * 0.28;
					ctx.beginPath();
					ctx.arc(cx, cy, radius, 0, Math.PI * 2);
					ctx.strokeStyle = 'rgba(0, 160, 255, 0.4)';
					ctx.lineWidth = 2;
					ctx.stroke();

					for (let i = 0; i < 32; i++) {
						const angle = (i / 32) * Math.PI * 2;
						const val = (freqData[i] || 0) / 255;
						const r2 = radius + val * 60;
						const x1 = cx + Math.cos(angle) * radius;
						const y1 = cy + Math.sin(angle) * radius;
						const x2 = cx + Math.cos(angle) * r2;
						const y2 = cy + Math.sin(angle) * r2;

						ctx.beginPath();
						ctx.moveTo(x1, y1);
						ctx.lineTo(x2, y2);
						ctx.strokeStyle = `hsl(${200 + i * 3}, 100%, 65%)`;
						ctx.lineWidth = 3;
						ctx.stroke();
					}
				} else if (currentVisualization === 'particles') {
					particles.forEach((p, idx) => {
						const energy = (freqData[idx % 32] || 50) / 255;
						p.x += p.vx * (1 + energy * 2);
						p.y += p.vy * (1 + energy * 2);
						if (p.x < 0) p.x = width;
						if (p.x > width) p.x = 0;
						if (p.y < 0) p.y = height;
						if (p.y > height) p.y = 0;

						ctx.beginPath();
						ctx.arc(p.x, p.y, p.radius * (1 + energy), 0, Math.PI * 2);
						ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, ${0.5 + energy * 0.5})`;
						ctx.shadowBlur = 8;
						ctx.shadowColor = '#00aaff';
						ctx.fill();
						ctx.shadowBlur = 0;
					});
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
					{ label: 'Save Playlist As...', action: () => showXPDialog('Save Playlist', 'Current playlist saved to Library.', 'info') },
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
					{ separator: true },
					{
						label: 'Visualizations',
						submenu: [
							{ label: 'Album Art View', radio: currentVisualization === 'albumart', action: () => { currentVisualization = 'albumart'; this.updateVisualizationModeUI(win); win.querySelector('#wmp-viz-label').textContent = 'Viz: Album Art'; } },
							{ label: 'Spectrum Bars', radio: currentVisualization === 'bars', action: () => { currentVisualization = 'bars'; this.updateVisualizationModeUI(win); win.querySelector('#wmp-viz-label').textContent = 'Viz: Bars'; } },
							{ label: 'Oscilloscope Waveform', radio: currentVisualization === 'wave', action: () => { currentVisualization = 'wave'; this.updateVisualizationModeUI(win); win.querySelector('#wmp-viz-label').textContent = 'Viz: Waveform'; } },
							{ label: 'Radial Spectrum', radio: currentVisualization === 'spectrum', action: () => { currentVisualization = 'spectrum'; this.updateVisualizationModeUI(win); win.querySelector('#wmp-viz-label').textContent = 'Viz: Spectrum'; } },
							{ label: 'Starfield Particles', radio: currentVisualization === 'particles', action: () => { currentVisualization = 'particles'; this.updateVisualizationModeUI(win); win.querySelector('#wmp-viz-label').textContent = 'Viz: Particles'; } }
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
					{ label: 'Options...', action: () => { if (window.SettingsApp) window.SettingsApp.open('audio'); } }
				];
			} else if (menuType === 'help') {
				items = [
					{ label: 'About Windows Media Player', bold: true, action: () => {
						showXPDialog('About Windows Media Player', 'Windows Media Player 9 Series\nVersion 9.00.00.2980\nMircosoft Corporation', 'info');
					}}
				];
			}

			if (window.ContextMenu) {
				window.ContextMenu.show(items, x, y);
			}
		}
	};

	window.MediaPlayerApp = MediaPlayerApp;
})();
