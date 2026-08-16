(function () {
	function getAudioContext() {
		if (!SoundRecorderApp.audioCtx) {
			const AudioContextClass = window.AudioContext || window.webkitAudioContext;
			if (AudioContextClass) {
				SoundRecorderApp.audioCtx = new AudioContextClass();
			}
		}
		if (SoundRecorderApp.audioCtx && SoundRecorderApp.audioCtx.state === 'suspended') {
			SoundRecorderApp.audioCtx.resume();
		}
		return SoundRecorderApp.audioCtx;
	}

	function audioBufferToWav(buffer) {
		const numChannels = buffer.numberOfChannels;
		const sampleRate = buffer.sampleRate;
		const format = 1;
		const bitDepth = 16;
		const bytesPerSample = bitDepth / 8;
		const blockAlign = numChannels * bytesPerSample;
		const length = buffer.length;
		const byteLength = length * blockAlign;
		const wavBuffer = new ArrayBuffer(44 + byteLength);
		const view = new DataView(wavBuffer);

		function writeString(offset, string) {
			for (let i = 0; i < string.length; i++) {
				view.setUint8(offset + i, string.charCodeAt(i));
			}
		}

		writeString(0, 'RIFF');
		view.setUint32(4, 36 + byteLength, true);
		writeString(8, 'WAVE');
		writeString(12, 'fmt ');
		view.setUint32(16, 16, true);
		view.setUint16(20, format, true);
		view.setUint16(22, numChannels, true);
		view.setUint32(24, sampleRate, true);
		view.setUint32(28, sampleRate * blockAlign, true);
		view.setUint16(32, blockAlign, true);
		view.setUint16(34, bitDepth, true);
		writeString(36, 'data');
		view.setUint32(40, byteLength, true);

		let offset = 44;
		for (let i = 0; i < length; i++) {
			for (let channel = 0; channel < numChannels; channel++) {
				let sample = buffer.getChannelData(channel)[i];
				sample = Math.max(-1, Math.min(1, sample));
				const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
				view.setInt16(offset, intSample, true);
				offset += 2;
			}
		}
		return wavBuffer;
	}

	function arrayBufferToDataUrl(buffer, mimeType = 'audio/wav') {
		const bytes = new Uint8Array(buffer);
		let binary = '';
		const len = bytes.byteLength;
		for (let i = 0; i < len; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return `data:${mimeType};base64,${btoa(binary)}`;
	}

	async function decodeAudioDataUrl(dataUrl, audioCtx) {
		let arrayBuffer;
		if (dataUrl.startsWith('data:')) {
			const parts = dataUrl.split(',');
			const binary = atob(parts[1]);
			const bytes = new Uint8Array(binary.length);
			for (let i = 0; i < binary.length; i++) {
				bytes[i] = binary.charCodeAt(i);
			}
			arrayBuffer = bytes.buffer;
		} else {
			const response = await fetch(dataUrl);
			arrayBuffer = await response.arrayBuffer();
		}
		return await audioCtx.decodeAudioData(arrayBuffer);
	}

	function createEmptyBuffer(audioCtx, duration = 0, sampleRate = 44100, channels = 2) {
		const frames = Math.max(1, Math.floor(duration * sampleRate));
		return audioCtx.createBuffer(channels, frames, sampleRate);
	}

	function cloneAudioBuffer(audioCtx, buffer) {
		if (!buffer) return null;
		const clone = audioCtx.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
		for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
			clone.copyToChannel(buffer.getChannelData(ch), ch);
		}
		return clone;
	}

	const SoundRecorderApp = {
		audioCtx: null,

		open(file = null, options = {}) {
			const id = `window-sound-recorder-${Date.now()}`;
			const initialFileName = file ? file.name : 'Sound';
			const winTitle = `${initialFileName} - Sound Recorder`;

			const contentHTML = `
				<div class="sound-recorder-layout">
					<div class="folder-menu-bar sndrec-menubar">
						<ul>
							<li data-snd-menu="file"><u>F</u>ile</li>
							<li data-snd-menu="edit"><u>E</u>dit</li>
							<li data-snd-menu="effects">E<u>f</u>fects</li>
							<li data-snd-menu="help"><u>H</u>elp</li>
						</ul>
					</div>

					<div class="sndrec-display-row">
						<div class="sndrec-time-box">
							<span class="sndrec-time-label">Position:</span>
							<span class="sndrec-time-val" id="sndrec-pos-val">0.00 sec.</span>
						</div>

						<div class="sndrec-scope-container">
							<canvas class="sndrec-scope-canvas" id="sndrec-canvas" width="130" height="54"></canvas>
						</div>

						<div class="sndrec-time-box" style="text-align: right;">
							<span class="sndrec-time-label">Length:</span>
							<span class="sndrec-time-val" id="sndrec-len-val">0.00 sec.</span>
						</div>
					</div>

					<div class="sndrec-slider-row">
						<input type="range" class="xp-slider sndrec-slider" id="sndrec-seek-slider" min="0" max="1000" value="0" step="1">
					</div>

					<div class="sndrec-controls-row">
						<button type="button" class="sndrec-btn" id="sndrec-btn-start" title="Seek To Start">
							<div class="sndrec-icon-start"></div>
						</button>
						<button type="button" class="sndrec-btn" id="sndrec-btn-end" title="Seek To End">
							<div class="sndrec-icon-end"></div>
						</button>
						<button type="button" class="sndrec-btn" id="sndrec-btn-play" title="Play">
							<div class="sndrec-icon-play"></div>
						</button>
						<button type="button" class="sndrec-btn" id="sndrec-btn-stop" title="Stop">
							<div class="sndrec-icon-stop"></div>
						</button>
						<button type="button" class="sndrec-btn sndrec-btn-rec" id="sndrec-btn-record" title="Record">
							<div class="sndrec-icon-rec"></div>
						</button>
					</div>
				</div>
			`;

			const win = createXPWindow(id, winTitle, contentHTML, 320, 195, {
				iconSrc: '../assets/images/desk/icons/Music File.webp',
				resizable: false
			});
			win.querySelector('.xp-window-content').style.padding = '0';

			this.initInstance(win, file);
			return win;
		},

		initInstance(win, initialFile) {
			const posValEl = win.querySelector('#sndrec-pos-val');
			const lenValEl = win.querySelector('#sndrec-len-val');
			const seekSlider = win.querySelector('#sndrec-seek-slider');
			const canvas = win.querySelector('#sndrec-canvas');
			const ctx2d = canvas.getContext('2d');

			const btnStart = win.querySelector('#sndrec-btn-start');
			const btnEnd = win.querySelector('#sndrec-btn-end');
			const btnPlay = win.querySelector('#sndrec-btn-play');
			const btnStop = win.querySelector('#sndrec-btn-stop');
			const btnRecord = win.querySelector('#sndrec-btn-record');

			let audioBuffer = null;
			let revertSnapshot = null;
			let currentFile = initialFile;
			let isDirty = false;

			let currentTime = 0;
			let isPlaying = false;
			let isRecording = false;

			let activeSourceNode = null;
			let playbackStartTime = 0;
			let playbackStartOffset = 0;

			let mediaStream = null;
			let recordProcessor = null;
			let recordSource = null;
			let recordedSamplesL = [];
			let recordedSamplesR = [];
			let recordStartTime = 0;

			let animationFrameId = null;
			let analyserNode = null;

			const formatTime = (seconds) => `${Math.max(0, seconds).toFixed(2)} sec.`;

			const updateWindowTitle = () => {
				const titleEl = win.querySelector('.xp-window-header .title');
				const base = currentFile ? currentFile.name : 'Sound';
				if (titleEl) {
					titleEl.textContent = `${base} - Sound Recorder`;
				}
			};

			const updateUIState = () => {
				const duration = audioBuffer ? audioBuffer.duration : 0;
				posValEl.textContent = formatTime(currentTime);
				lenValEl.textContent = formatTime(duration);

				if (!isPlaying && !isRecording) {
					seekSlider.max = String(Math.max(0.01, duration));
					seekSlider.value = String(currentTime);
				}

				btnStart.disabled = currentTime <= 0 || isRecording;
				btnEnd.disabled = currentTime >= duration || isRecording || duration <= 0;
				btnPlay.disabled = duration <= 0 || isPlaying || isRecording;
				btnStop.disabled = !isPlaying && !isRecording;
				btnRecord.disabled = isPlaying;
			};

			const drawWaveform = () => {
				const width = canvas.width;
				const height = canvas.height;
				const midY = height / 2;

				ctx2d.fillStyle = '#000000';
				ctx2d.fillRect(0, 0, width, height);

				ctx2d.strokeStyle = '#003300';
				ctx2d.lineWidth = 1;
				ctx2d.beginPath();
				ctx2d.moveTo(0, midY);
				ctx2d.lineTo(width, midY);
				ctx2d.stroke();

				ctx2d.strokeStyle = '#004400';
				for (let x = 10; x < width; x += 12) {
					ctx2d.beginPath();
					ctx2d.moveTo(x, midY - 3);
					ctx2d.lineTo(x, midY + 3);
					ctx2d.stroke();
				}

				if (isRecording && analyserNode) {
					const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
					analyserNode.getByteTimeDomainData(dataArray);

					ctx2d.strokeStyle = '#00ff00';
					ctx2d.lineWidth = 1.5;
					ctx2d.beginPath();

					const sliceWidth = width / dataArray.length;
					let x = 0;
					for (let i = 0; i < dataArray.length; i++) {
						const v = dataArray[i] / 128.0;
						const y = (v * height) / 2;
						if (i === 0) ctx2d.moveTo(x, y);
						else ctx2d.lineTo(x, y);
						x += sliceWidth;
					}
					ctx2d.stroke();
					return;
				}

				if (isPlaying && audioBuffer) {
					const channelData = audioBuffer.getChannelData(0);
					const sampleRate = audioBuffer.sampleRate;
					const currentSample = Math.floor(currentTime * sampleRate);
					const windowSize = Math.floor(sampleRate * 0.04);
					const start = Math.max(0, currentSample - Math.floor(windowSize / 2));
					const end = Math.min(channelData.length, start + windowSize);

					ctx2d.strokeStyle = '#00ff00';
					ctx2d.lineWidth = 1.5;
					ctx2d.beginPath();

					const range = Math.max(1, end - start);
					for (let i = 0; i < range; i++) {
						const sample = channelData[start + i] || 0;
						const x = (i / range) * width;
						const y = midY - sample * (midY - 4);
						if (i === 0) ctx2d.moveTo(x, y);
						else ctx2d.lineTo(x, y);
					}
					ctx2d.stroke();
					return;
				}

				if (audioBuffer && audioBuffer.length > 0) {
					const channelData = audioBuffer.getChannelData(0);
					const currentSample = Math.floor(currentTime * audioBuffer.sampleRate);
					const windowSize = Math.floor(audioBuffer.sampleRate * 0.03);
					const start = Math.max(0, currentSample - Math.floor(windowSize / 2));
					const end = Math.min(channelData.length, start + windowSize);

					ctx2d.strokeStyle = '#00bb00';
					ctx2d.lineWidth = 1.2;
					ctx2d.beginPath();
					const range = Math.max(1, end - start);
					for (let i = 0; i < range; i++) {
						const sample = channelData[start + i] || 0;
						const x = (i / range) * width;
						const y = midY - sample * (midY - 4);
						if (i === 0) ctx2d.moveTo(x, y);
						else ctx2d.lineTo(x, y);
					}
					ctx2d.stroke();
					return;
				}

				ctx2d.strokeStyle = '#00ff00';
				ctx2d.lineWidth = 1.5;
				ctx2d.beginPath();
				ctx2d.moveTo(0, midY);
				ctx2d.lineTo(width, midY);
				ctx2d.stroke();
			};

			const tick = () => {
				if (isPlaying) {
					const ctx = getAudioContext();
					if (ctx) {
						currentTime = playbackStartOffset + (ctx.currentTime - playbackStartTime);
						if (currentTime >= audioBuffer.duration) {
							currentTime = audioBuffer.duration;
							stopPlayback();
						}
					}
				} else if (isRecording) {
					const ctx = getAudioContext();
					if (ctx) {
						currentTime = (performance.now() - recordStartTime) / 1000;
					}
				}
				updateUIState();
				drawWaveform();
				animationFrameId = requestAnimationFrame(tick);
			};

			const startPlayback = () => {
				if (!audioBuffer || audioBuffer.duration <= 0) return;
				const ctx = getAudioContext();
				if (!ctx) return;

				if (currentTime >= audioBuffer.duration) {
					currentTime = 0;
				}

				activeSourceNode = ctx.createBufferSource();
				activeSourceNode.buffer = audioBuffer;
				activeSourceNode.connect(ctx.destination);

				playbackStartTime = ctx.currentTime;
				playbackStartOffset = currentTime;

				activeSourceNode.onended = () => {
					if (isPlaying) {
						stopPlayback();
					}
				};

				activeSourceNode.start(0, currentTime);
				isPlaying = true;
				updateUIState();
			};

			const stopPlayback = () => {
				if (activeSourceNode) {
					try {
						activeSourceNode.stop();
						activeSourceNode.disconnect();
					} catch (e) {}
					activeSourceNode = null;
				}
				isPlaying = false;
				updateUIState();
			};

			const startRecording = async () => {
				const ctx = getAudioContext();
				if (!ctx) return;

				stopPlayback();

				recordedSamplesL = [];
				recordedSamplesR = [];
				recordStartTime = performance.now();
				isRecording = true;
				isDirty = true;

				analyserNode = ctx.createAnalyser();
				analyserNode.fftSize = 256;

				try {
					mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
					recordSource = ctx.createMediaStreamSource(mediaStream);
					recordProcessor = ctx.createScriptProcessor(4096, 2, 2);

					recordSource.connect(analyserNode);
					analyserNode.connect(recordProcessor);
					recordProcessor.connect(ctx.destination);

					recordProcessor.onaudioprocess = (e) => {
						if (!isRecording) return;
						const left = e.inputBuffer.getChannelData(0);
						const right = e.inputBuffer.numberOfChannels > 1 ? e.inputBuffer.getChannelData(1) : left;
						for (let i = 0; i < left.length; i++) {
							recordedSamplesL.push(left[i]);
							recordedSamplesR.push(right[i]);
						}
					};
				} catch (err) {
					recordProcessor = ctx.createScriptProcessor(4096, 1, 1);
					let phase = 0;
					recordProcessor.onaudioprocess = () => {
						if (!isRecording) return;
						for (let i = 0; i < 4096; i++) {
							phase += 0.05;
							const s = Math.sin(phase) * 0.15 + (Math.random() - 0.5) * 0.05;
							recordedSamplesL.push(s);
							recordedSamplesR.push(s);
						}
					};
					recordProcessor.connect(ctx.destination);
				}

				updateUIState();
			};

			const stopRecording = () => {
				if (!isRecording) return;
				isRecording = false;

				if (recordProcessor) {
					try {
						recordProcessor.disconnect();
					} catch (e) {}
					recordProcessor = null;
				}
				if (recordSource) {
					try {
						recordSource.disconnect();
					} catch (e) {}
					recordSource = null;
				}
				if (mediaStream) {
					mediaStream.getTracks().forEach(t => t.stop());
					mediaStream = null;
				}
				analyserNode = null;

				const ctx = getAudioContext();
				const sampleCount = recordedSamplesL.length;
				if (ctx && sampleCount > 0) {
					const newBuffer = ctx.createBuffer(2, sampleCount, ctx.sampleRate);
					newBuffer.copyToChannel(new Float32Array(recordedSamplesL), 0);
					newBuffer.copyToChannel(new Float32Array(recordedSamplesR), 1);
					audioBuffer = newBuffer;
					currentTime = audioBuffer.duration;
				}

				updateUIState();
			};

			const loadFileContent = async (fileObj) => {
				if (!fileObj || !fileObj.content) {
					const ctx = getAudioContext();
					audioBuffer = createEmptyBuffer(ctx, 0);
					revertSnapshot = cloneAudioBuffer(ctx, audioBuffer);
					updateUIState();
					return;
				}
				const ctx = getAudioContext();
				try {
					audioBuffer = await decodeAudioDataUrl(fileObj.content, ctx);
					revertSnapshot = cloneAudioBuffer(ctx, audioBuffer);
					currentTime = 0;
					isDirty = false;
					updateWindowTitle();
					updateUIState();
				} catch (e) {
					showXPDialog('Sound Recorder', 'Unable to decode audio format.', 'error');
				}
			};

			const saveCurrentFile = (targetFolder, filename) => {
				if (!audioBuffer) return;
				const wavData = audioBufferToWav(audioBuffer);
				const dataUrl = arrayBufferToDataUrl(wavData, 'audio/wav');

				if (currentFile && currentFile.parent) {
					currentFile.content = dataUrl;
					currentFile.size = wavData.byteLength;
					currentFile.modifiedAt = new Date();
					fs.save();
					isDirty = false;
					revertSnapshot = cloneAudioBuffer(getAudioContext(), audioBuffer);
					refreshUI();
					return;
				}

				const folder = targetFolder || fs.root;
				const fileCreated = fs.create('File', folder.getFullPath(), filename);
				fileCreated.content = dataUrl;
				fileCreated.size = wavData.byteLength;
				fileCreated.icon = '../assets/images/desk/icons/Music File.webp';
				fileCreated.modifiedAt = new Date();
				currentFile = fileCreated;
				isDirty = false;
				revertSnapshot = cloneAudioBuffer(getAudioContext(), audioBuffer);
				fs.save();
				refreshUI();
				updateWindowTitle();
			};

			btnStart.addEventListener('click', () => {
				if (isRecording) return;
				stopPlayback();
				currentTime = 0;
				updateUIState();
			});

			btnEnd.addEventListener('click', () => {
				if (isRecording) return;
				stopPlayback();
				if (audioBuffer) {
					currentTime = audioBuffer.duration;
				}
				updateUIState();
			});

			btnPlay.addEventListener('click', () => {
				if (isPlaying) stopPlayback();
				else startPlayback();
			});

			btnStop.addEventListener('click', () => {
				if (isPlaying) stopPlayback();
				if (isRecording) stopRecording();
			});

			btnRecord.addEventListener('click', () => {
				if (!isRecording) startRecording();
			});

			seekSlider.addEventListener('input', () => {
				if (isRecording) return;
				if (isPlaying) stopPlayback();
				currentTime = parseFloat(seekSlider.value);
				updateUIState();
			});

			const handleMenuAction = (action) => {
				const ctx = getAudioContext();
				if (!ctx) return;

				if (action === 'new') {
					stopPlayback();
					stopRecording();
					audioBuffer = createEmptyBuffer(ctx, 0);
					revertSnapshot = cloneAudioBuffer(ctx, audioBuffer);
					currentFile = null;
					currentTime = 0;
					isDirty = false;
					updateWindowTitle();
					updateUIState();
				} else if (action === 'open') {
					stopPlayback();
					stopRecording();
					if (window.showXPFileDialog) {
						window.showXPFileDialog({
							mode: 'open',
							title: 'Open Sound File',
							filterTypes: [
								{ label: 'Wave Sounds (*.wav)', ext: '.wav', mime: 'audio/wav' },
								{ label: 'All Files (*.*)', ext: '.*', mime: '*/*' }
							],
							onConfirm: (folder, name, foundFile) => {
								if (foundFile) {
									currentFile = foundFile;
									loadFileContent(foundFile);
								}
							}
						});
					}
				} else if (action === 'save') {
					if (currentFile) {
						saveCurrentFile(currentFile.parent, currentFile.name);
					} else {
						handleMenuAction('save-as');
					}
				} else if (action === 'save-as') {
					if (window.showXPFileDialog) {
						window.showXPFileDialog({
							mode: 'save',
							title: 'Save As',
							defaultName: currentFile ? currentFile.name : 'Sound.wav',
							filterTypes: [
								{ label: 'Wave Sounds (*.wav)', ext: '.wav', mime: 'audio/wav' }
							],
							onConfirm: (folder, name) => {
								saveCurrentFile(folder, name);
							}
						});
					}
				} else if (action === 'revert') {
					if (revertSnapshot) {
						stopPlayback();
						stopRecording();
						audioBuffer = cloneAudioBuffer(ctx, revertSnapshot);
						currentTime = 0;
						isDirty = false;
						updateUIState();
					}
				} else if (action === 'properties') {
					const channels = audioBuffer ? audioBuffer.numberOfChannels : 0;
					const rate = audioBuffer ? audioBuffer.sampleRate : 0;
					const dur = audioBuffer ? audioBuffer.duration.toFixed(2) : '0.00';
					const bytes = audioBuffer ? audioBuffer.length * channels * 2 : 0;
					showXPDialog(
						'Properties for Sound',
						`Format: PCM 16 Bit\nChannels: ${channels === 2 ? 'Stereo' : 'Mono'}\nSample Rate: ${rate} Hz\nAudio Size: ${Math.ceil(bytes / 1024)} KB\nLength: ${dur} sec.`,
						'info'
					);
				} else if (action === 'exit') {
					closeWindow(win, win.id);
				} else if (action === 'increase-volume') {
					if (!audioBuffer) return;
					for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
						const data = audioBuffer.getChannelData(ch);
						for (let i = 0; i < data.length; i++) {
							data[i] = Math.max(-1, Math.min(1, data[i] * 1.25));
						}
					}
					isDirty = true;
					updateUIState();
				} else if (action === 'decrease-volume') {
					if (!audioBuffer) return;
					for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
						const data = audioBuffer.getChannelData(ch);
						for (let i = 0; i < data.length; i++) {
							data[i] = data[i] * 0.8;
						}
					}
					isDirty = true;
					updateUIState();
				} else if (action === 'increase-speed') {
					if (!audioBuffer || audioBuffer.length <= 2) return;
					const newLen = Math.floor(audioBuffer.length / 2);
					const newBuffer = ctx.createBuffer(audioBuffer.numberOfChannels, newLen, audioBuffer.sampleRate);
					for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
						const src = audioBuffer.getChannelData(ch);
						const dst = newBuffer.getChannelData(ch);
						for (let i = 0; i < newLen; i++) {
							dst[i] = src[i * 2] || 0;
						}
					}
					audioBuffer = newBuffer;
					currentTime = Math.min(currentTime / 2, audioBuffer.duration);
					isDirty = true;
					updateUIState();
				} else if (action === 'decrease-speed') {
					if (!audioBuffer || audioBuffer.length <= 0) return;
					const newLen = audioBuffer.length * 2;
					const newBuffer = ctx.createBuffer(audioBuffer.numberOfChannels, newLen, audioBuffer.sampleRate);
					for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
						const src = audioBuffer.getChannelData(ch);
						const dst = newBuffer.getChannelData(ch);
						for (let i = 0; i < newLen; i++) {
							const srcIdx = Math.floor(i / 2);
							dst[i] = src[srcIdx] || 0;
						}
					}
					audioBuffer = newBuffer;
					currentTime = Math.min(currentTime * 2, audioBuffer.duration);
					isDirty = true;
					updateUIState();
				} else if (action === 'add-echo') {
					if (!audioBuffer || audioBuffer.length <= 0) return;
					const delaySamples = Math.floor(audioBuffer.sampleRate * 0.22);
					const newLen = audioBuffer.length + delaySamples;
					const newBuffer = ctx.createBuffer(audioBuffer.numberOfChannels, newLen, audioBuffer.sampleRate);
					for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
						const src = audioBuffer.getChannelData(ch);
						const dst = newBuffer.getChannelData(ch);
						for (let i = 0; i < newLen; i++) {
							const direct = src[i] || 0;
							const echo = i >= delaySamples ? (src[i - delaySamples] || 0) * 0.45 : 0;
							dst[i] = Math.max(-1, Math.min(1, direct + echo));
						}
					}
					audioBuffer = newBuffer;
					isDirty = true;
					updateUIState();
				} else if (action === 'reverse') {
					if (!audioBuffer || audioBuffer.length <= 0) return;
					for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
						audioBuffer.getChannelData(ch).reverse();
					}
					isDirty = true;
					updateUIState();
				} else if (action === 'delete-before') {
					if (!audioBuffer) return;
					const startSample = Math.floor(currentTime * audioBuffer.sampleRate);
					const newLen = Math.max(1, audioBuffer.length - startSample);
					const newBuffer = ctx.createBuffer(audioBuffer.numberOfChannels, newLen, audioBuffer.sampleRate);
					for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
						const src = audioBuffer.getChannelData(ch);
						const dst = newBuffer.getChannelData(ch);
						for (let i = 0; i < newLen; i++) {
							dst[i] = src[startSample + i] || 0;
						}
					}
					audioBuffer = newBuffer;
					currentTime = 0;
					isDirty = true;
					updateUIState();
				} else if (action === 'delete-after') {
					if (!audioBuffer) return;
					const endSample = Math.max(1, Math.min(audioBuffer.length, Math.floor(currentTime * audioBuffer.sampleRate)));
					const newBuffer = ctx.createBuffer(audioBuffer.numberOfChannels, endSample, audioBuffer.sampleRate);
					for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
						const src = audioBuffer.getChannelData(ch);
						const dst = newBuffer.getChannelData(ch);
						for (let i = 0; i < endSample; i++) {
							dst[i] = src[i] || 0;
						}
					}
					audioBuffer = newBuffer;
					currentTime = Math.min(currentTime, audioBuffer.duration);
					isDirty = true;
					updateUIState();
				} else if (action === 'insert-file') {
					if (window.showXPFileDialog) {
						window.showXPFileDialog({
							mode: 'open',
							title: 'Insert File',
							filterTypes: [{ label: 'Wave Sounds (*.wav)', ext: '.wav', mime: 'audio/wav' }],
							onConfirm: async (folder, name, f) => {
								if (f && f.content) {
									const insBuf = await decodeAudioDataUrl(f.content, ctx);
									const insertSample = Math.floor(currentTime * audioBuffer.sampleRate);
									const newLen = (audioBuffer ? audioBuffer.length : 0) + insBuf.length;
									const newBuffer = ctx.createBuffer(Math.max(audioBuffer ? audioBuffer.numberOfChannels : 1, insBuf.numberOfChannels), newLen, ctx.sampleRate);
									for (let ch = 0; ch < newBuffer.numberOfChannels; ch++) {
										const dst = newBuffer.getChannelData(ch);
										const srcOrig = audioBuffer ? audioBuffer.getChannelData(Math.min(ch, audioBuffer.numberOfChannels - 1)) : new Float32Array(0);
										const srcIns = insBuf.getChannelData(Math.min(ch, insBuf.numberOfChannels - 1));
										for (let i = 0; i < insertSample; i++) dst[i] = srcOrig[i] || 0;
										for (let i = 0; i < insBuf.length; i++) dst[insertSample + i] = srcIns[i] || 0;
										for (let i = insertSample; i < srcOrig.length; i++) dst[i + insBuf.length] = srcOrig[i] || 0;
									}
									audioBuffer = newBuffer;
									isDirty = true;
									updateUIState();
								}
							}
						});
					}
				} else if (action === 'mix-file') {
					if (window.showXPFileDialog) {
						window.showXPFileDialog({
							mode: 'open',
							title: 'Mix with File',
							filterTypes: [{ label: 'Wave Sounds (*.wav)', ext: '.wav', mime: 'audio/wav' }],
							onConfirm: async (folder, name, f) => {
								if (f && f.content && audioBuffer) {
									const mixBuf = await decodeAudioDataUrl(f.content, ctx);
									const mixStart = Math.floor(currentTime * audioBuffer.sampleRate);
									const newLen = Math.max(audioBuffer.length, mixStart + mixBuf.length);
									const newBuffer = ctx.createBuffer(Math.max(audioBuffer.numberOfChannels, mixBuf.numberOfChannels), newLen, ctx.sampleRate);
									for (let ch = 0; ch < newBuffer.numberOfChannels; ch++) {
										const dst = newBuffer.getChannelData(ch);
										const srcOrig = audioBuffer.getChannelData(Math.min(ch, audioBuffer.numberOfChannels - 1));
										const srcMix = mixBuf.getChannelData(Math.min(ch, mixBuf.numberOfChannels - 1));
										for (let i = 0; i < newLen; i++) {
											const o = srcOrig[i] || 0;
											const m = (i >= mixStart && i < mixStart + mixBuf.length) ? (srcMix[i - mixStart] || 0) : 0;
											dst[i] = Math.max(-1, Math.min(1, (o + m) * 0.7));
										}
									}
									audioBuffer = newBuffer;
									isDirty = true;
									updateUIState();
								}
							}
						});
					}
				} else if (action === 'audio-properties') {
					if (window.SettingsApp) window.SettingsApp.open('audio');
				} else if (action === 'about') {
					showXPDialog('About Sound Recorder', 'Mircosoft Sound Recorder\nVersion 5.1 (Build 2600.xpsp_sp3_gdr)\nAudio Recording and Waveform Editor Utility', 'info');
				}
			};

			win.querySelectorAll('.sndrec-menubar li[data-snd-menu]').forEach(menuLi => {
				menuLi.addEventListener('click', (e) => {
					e.stopPropagation();
					const menuType = menuLi.dataset.sndMenu;
					const rect = menuLi.getBoundingClientRect();
					const hasBuffer = !!(audioBuffer && audioBuffer.length > 0);
					let items = [];

					if (menuType === 'file') {
						items = [
							{ label: 'New', shortcut: 'Ctrl+N', action: () => handleMenuAction('new') },
							{ label: 'Open...', shortcut: 'Ctrl+O', action: () => handleMenuAction('open') },
							{ label: 'Save', shortcut: 'Ctrl+S', action: () => handleMenuAction('save') },
							{ label: 'Save As...', action: () => handleMenuAction('save-as') },
							{ label: 'Revert...', disabled: !isDirty || !revertSnapshot, action: () => handleMenuAction('revert') },
							{ separator: true },
							{ label: 'Properties', action: () => handleMenuAction('properties') },
							{ separator: true },
							{ label: 'Exit', action: () => handleMenuAction('exit') }
						];
					} else if (menuType === 'edit') {
						items = [
							{ label: 'Insert File...', action: () => handleMenuAction('insert-file') },
							{ label: 'Mix with File...', disabled: !hasBuffer, action: () => handleMenuAction('mix-file') },
							{ separator: true },
							{ label: 'Delete Before Current Position', disabled: !hasBuffer || currentTime <= 0, action: () => handleMenuAction('delete-before') },
							{ label: 'Delete After Current Position', disabled: !hasBuffer || currentTime >= (audioBuffer ? audioBuffer.duration : 0), action: () => handleMenuAction('delete-after') },
							{ separator: true },
							{ label: 'Audio Properties', action: () => handleMenuAction('audio-properties') }
						];
					} else if (menuType === 'effects') {
						items = [
							{ label: 'Increase Volume (by 25%)', disabled: !hasBuffer, action: () => handleMenuAction('increase-volume') },
							{ label: 'Decrease Volume', disabled: !hasBuffer, action: () => handleMenuAction('decrease-volume') },
							{ separator: true },
							{ label: 'Increase Speed (by 100%)', disabled: !hasBuffer, action: () => handleMenuAction('increase-speed') },
							{ label: 'Decrease Speed', disabled: !hasBuffer, action: () => handleMenuAction('decrease-speed') },
							{ separator: true },
							{ label: 'Add Echo', disabled: !hasBuffer, action: () => handleMenuAction('add-echo') },
							{ label: 'Reverse', disabled: !hasBuffer, action: () => handleMenuAction('reverse') }
						];
					} else if (menuType === 'help') {
						items = [
							{ label: 'Help Topics', action: () => window.open('https://github.com/wartets/Wartets.github.io', '_blank') },
							{ separator: true },
							{ label: 'About Sound Recorder', bold: true, action: () => handleMenuAction('about') }
						];
					}

					if (window.ContextMenu) {
						window.ContextMenu.show(items, rect.left, rect.bottom + 2);
					}
				});
			});

			win.beforeClose = (finalize) => {
				stopPlayback();
				stopRecording();
				if (animationFrameId) cancelAnimationFrame(animationFrameId);
				if (isDirty) {
					showXPDialog(
						'Sound Recorder',
						`The sound in '${currentFile ? currentFile.name : 'Sound'}' has changed.\nDo you want to save the changes?`,
						'question',
						{
							buttons: ['Yes', 'No', 'Cancel'],
							callback: (res) => {
								if (res === 'Yes') {
									handleMenuAction('save');
									finalize();
								} else if (res === 'No') {
									finalize();
								}
							}
						}
					);
					return false;
				}
				return true;
			};

			if (initialFile) {
				loadFileContent(initialFile);
			} else {
				const ctx = getAudioContext();
				audioBuffer = createEmptyBuffer(ctx, 0);
				revertSnapshot = cloneAudioBuffer(ctx, audioBuffer);
				updateUIState();
			}

			animationFrameId = requestAnimationFrame(tick);
		}
	};

	window.SoundRecorderApp = SoundRecorderApp;
})();
