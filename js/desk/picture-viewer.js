(function () {
	let activeViewerWindow = null;
	let currentImageFile = null;
	let currentFolderImages = [];
	let currentImageIndex = 0;
	let currentZoom = 1.0;
	let currentRotation = 0;
	let isPanning = false;
	let panStartX = 0;
	let panStartY = 0;
	let panOffsetX = 0;
	let panOffsetY = 0;
	let slideshowTimer = null;
	let isSlideshow = false;

	const PictureViewerApp = {
		open(targetFile = null, options = {}) {
			if (!targetFile) return null;

			const resolved = this.resolveTarget(targetFile);
			if (!resolved) return null;

			currentImageFile = resolved;
			this.scanFolderImages(resolved);

			const id = 'window-picture-fax-viewer';
			const existing = document.getElementById(id);

			if (existing) {
				if (typeof bringWindowToFront === 'function') bringWindowToFront(existing);
				if (existing.classList.contains('minimized') && typeof unminimizeWindow === 'function') {
					unminimizeWindow(existing);
				}
				this.displayImage(existing, resolved);
				return existing;
			}

			const title = `${resolved.name} - Windows Picture and Fax Viewer`;
			const contentHTML = this.buildViewerTemplate();
			const win = createXPWindow(id, title, contentHTML, 720, 520, {
				iconSrc: '../assets/images/desk/icons/Camera.webp',
				resizable: true
			});

			win.classList.add('picview-window');
			win.querySelector('.xp-window-content').style.padding = '0';
			activeViewerWindow = win;

			this.bindViewerEvents(win);
			this.displayImage(win, resolved);

			win.beforeClose = () => {
				this.stopSlideshow();
				activeViewerWindow = null;
				return true;
			};

			return win;
		},

		resolveTarget(target) {
			if (target instanceof File || (target && typeof target === 'object' && target.name)) {
				return {
					name: target.name,
					src: target.remoteUrl || target.content || '',
					parent: target.parent || null,
					fileObj: target
				};
			}
			if (typeof target === 'string') {
				const name = target.split('/').pop();
				return {
					name: name,
					src: target,
					parent: null,
					fileObj: null
				};
			}
			return null;
		},

		scanFolderImages(current) {
			currentFolderImages = [current];
			currentImageIndex = 0;

			if (current.parent && typeof current.parent.listContent === 'function') {
				const siblings = current.parent.listContent();
				const imageSiblings = siblings.filter(el => {
					if (!(el instanceof File)) return false;
					return /\.(png|jpe?g|bmp|webp|gif|ico|tiff?)$/i.test(el.name);
				});

				if (imageSiblings.length > 0) {
					currentFolderImages = imageSiblings.map(el => ({
						name: el.name,
						src: el.remoteUrl || el.content || '',
						parent: el.parent,
						fileObj: el
					}));
					currentImageIndex = currentFolderImages.findIndex(img => img.name === current.name);
					if (currentImageIndex === -1) currentImageIndex = 0;
				}
			}
		},

		buildViewerTemplate() {
			return `
				<div class="picview-layout">
					<div class="picview-viewport" id="picview-viewport">
						<div class="picview-stage" id="picview-stage">
							<img src="" id="picview-image-el" class="picview-main-image" alt="Viewer Image" draggable="false">
						</div>
					</div>

					<div class="picview-toolbar-container">
						<div class="picview-toolbar-strip">
							<button type="button" class="picview-tool-btn" id="pv-btn-prev" title="Previous Image (Left Arrow)">
								<div class="pv-icon-prev"></div>
							</button>
							<button type="button" class="picview-tool-btn" id="pv-btn-next" title="Next Image (Right Arrow)">
								<div class="pv-icon-next"></div>
							</button>

							<div class="pv-toolbar-sep"></div>

							<button type="button" class="picview-tool-btn" id="pv-btn-best-fit" title="Best Fit (Ctrl+B)">
								<img src="https://api.iconify.design/mdi/arrow-expand-all.svg?color=%231b4b9b" alt="">
							</button>
							<button type="button" class="picview-tool-btn" id="pv-btn-actual-size" title="Actual Size (Ctrl+A)">
								<img src="https://api.iconify.design/mdi/magnify-scan.svg?color=%231b4b9b" alt="">
							</button>
							<button type="button" class="picview-tool-btn" id="pv-btn-slideshow" title="Start Slide Show (F11)">
								<img src="https://api.iconify.design/mdi/presentation-play.svg?color=%231b4b9b" alt="">
							</button>

							<div class="pv-toolbar-sep"></div>

							<button type="button" class="picview-tool-btn" id="pv-btn-zoom-in" title="Zoom In (+)">
								<img src="https://api.iconify.design/mdi/magnify-plus-outline.svg?color=%231b4b9b" alt="">
							</button>
							<button type="button" class="picview-tool-btn" id="pv-btn-zoom-out" title="Zoom Out (-)">
								<img src="https://api.iconify.design/mdi/magnify-minus-outline.svg?color=%231b4b9b" alt="">
							</button>

							<div class="pv-toolbar-sep"></div>

							<button type="button" class="picview-tool-btn" id="pv-btn-rot-ccw" title="Rotate Counterclockwise (Ctrl+L)">
								<img src="https://api.iconify.design/mdi/rotate-left.svg?color=%231b4b9b" alt="">
							</button>
							<button type="button" class="picview-tool-btn" id="pv-btn-rot-cw" title="Rotate Clockwise (Ctrl+K)">
								<img src="https://api.iconify.design/mdi/rotate-right.svg?color=%231b4b9b" alt="">
							</button>

							<div class="pv-toolbar-sep"></div>

							<button type="button" class="picview-tool-btn" id="pv-btn-delete" title="Delete Image (Del)">
								<img src="https://api.iconify.design/mdi/delete-outline.svg?color=%23cc3333" alt="">
							</button>
							<button type="button" class="picview-tool-btn" id="pv-btn-print" title="Print Image (Ctrl+P)">
								<img src="https://api.iconify.design/mdi/printer.svg?color=%231b4b9b" alt="">
							</button>
							<button type="button" class="picview-tool-btn" id="pv-btn-save" title="Save Copy As (Ctrl+S)">
								<img src="https://api.iconify.design/mdi/content-save-outline.svg?color=%231b4b9b" alt="">
							</button>
							<button type="button" class="picview-tool-btn" id="pv-btn-wallpaper" title="Set as Desktop Background">
								<img src="../assets/images/desk/icons/Display.webp" alt="">
							</button>
						</div>
					</div>

					<div class="picview-statusbar">
						<div class="pv-sb-item" id="pv-sb-file-info">Loading...</div>
						<div class="pv-sb-item" id="pv-sb-zoom-info">100%</div>
						<div class="pv-sb-item" id="pv-sb-index-info">1 / 1</div>
					</div>
				</div>
			`;
		},

		bindViewerEvents(win) {
			const imgEl = win.querySelector('#picview-image-el');
			const viewport = win.querySelector('#picview-viewport');
			const stage = win.querySelector('#picview-stage');

			const prevBtn = win.querySelector('#pv-btn-prev');
			const nextBtn = win.querySelector('#pv-btn-next');
			const bestFitBtn = win.querySelector('#pv-btn-best-fit');
			const actualSizeBtn = win.querySelector('#pv-btn-actual-size');
			const zoomInBtn = win.querySelector('#pv-btn-zoom-in');
			const zoomOutBtn = win.querySelector('#pv-btn-zoom-out');
			const rotCwBtn = win.querySelector('#pv-btn-rot-cw');
			const rotCcwBtn = win.querySelector('#pv-btn-rot-ccw');
			const deleteBtn = win.querySelector('#pv-btn-delete');
			const printBtn = win.querySelector('#pv-btn-print');
			const saveBtn = win.querySelector('#pv-btn-save');
			const wpBtn = win.querySelector('#pv-btn-wallpaper');
			const slideBtn = win.querySelector('#pv-btn-slideshow');

			prevBtn.addEventListener('click', () => this.navigate(-1));
			nextBtn.addEventListener('click', () => this.navigate(1));

			zoomInBtn.addEventListener('click', () => this.setZoom(currentZoom * 1.25));
			zoomOutBtn.addEventListener('click', () => this.setZoom(currentZoom / 1.25));
			actualSizeBtn.addEventListener('click', () => this.setZoom(1.0));
			bestFitBtn.addEventListener('click', () => this.fitToWindow(win));

			rotCwBtn.addEventListener('click', () => {
				currentRotation = (currentRotation + 90) % 360;
				this.applyTransform();
			});
			rotCcwBtn.addEventListener('click', () => {
				currentRotation = (currentRotation - 90 + 360) % 360;
				this.applyTransform();
			});

			deleteBtn.addEventListener('click', () => {
				const current = currentFolderImages[currentImageIndex];
				if (!current || !current.fileObj) return;
				createConfirmationDialog(`Are you sure you want to move '${current.name}' to the Recycle Bin?`, () => {
					try {
						if (fs) fs.moveToRecycleBin(current.fileObj.getFullPath());
						currentFolderImages.splice(currentImageIndex, 1);
						if (currentFolderImages.length === 0) {
							closeWindow(win, win.id);
						} else {
							currentImageIndex = Math.min(currentImageIndex, currentFolderImages.length - 1);
							this.displayImage(win, currentFolderImages[currentImageIndex]);
						}
						if (typeof refreshUI === 'function') refreshUI();
					} catch (e) {
						showXPDialog('Error', e.message, 'error');
					}
				});
			});

			printBtn.addEventListener('click', () => {
				const current = currentFolderImages[currentImageIndex];
				if (!current) return;
				const printWin = window.open('', '_blank');
				if (printWin) {
					printWin.document.write(`<html><head><title>${current.name}</title></head><body style="margin:0;display:flex;align-items:center;justify-content:center;"><img src="${current.src}" style="max-width:100%;height:auto;" onload="window.print();window.close();"></body></html>`);
					printWin.document.close();
				}
			});

			saveBtn.addEventListener('click', () => {
				const current = currentFolderImages[currentImageIndex];
				if (!current) return;
				const a = document.createElement('a');
				a.href = current.src;
				a.download = current.name;
				document.body.appendChild(a);
				a.click();
				a.remove();
			});

			wpBtn.addEventListener('click', () => {
				const current = currentFolderImages[currentImageIndex];
				if (!current) return;
				if (typeof setImageAsWallpaper === 'function') {
					setImageAsWallpaper(current.src, 'cover');
					showXPDialog('Desktop Wallpaper', `"${current.name}" has been set as your desktop background.`, 'info');
				}
			});

			slideBtn.addEventListener('click', () => this.toggleSlideshow(win));

			viewport.addEventListener('wheel', (e) => {
				e.preventDefault();
				if (e.deltaY < 0) {
					this.setZoom(currentZoom * 1.15);
				} else {
					this.setZoom(currentZoom / 1.15);
				}
			}, { passive: false });

			viewport.addEventListener('mousedown', (e) => {
				if (e.button !== 0) return;
				isPanning = true;
				panStartX = e.clientX - panOffsetX;
				panStartY = e.clientY - panOffsetY;
				viewport.style.cursor = 'grabbing';
			});

			window.addEventListener('mousemove', (e) => {
				if (!isPanning) return;
				panOffsetX = e.clientX - panStartX;
				panOffsetY = e.clientY - panStartY;
				this.applyTransform();
			});

			window.addEventListener('mouseup', () => {
				if (isPanning) {
					isPanning = false;
					viewport.style.cursor = 'grab';
				}
			});

			document.addEventListener('keydown', (e) => {
				if (!activeViewerWindow || document.activeElement.tagName === 'INPUT') return;
				if (e.key === 'ArrowLeft') {
					this.navigate(-1);
				} else if (e.key === 'ArrowRight') {
					this.navigate(1);
				} else if (e.key === '+' || e.key === '=') {
					this.setZoom(currentZoom * 1.25);
				} else if (e.key === '-') {
					this.setZoom(currentZoom / 1.25);
				} else if (e.key === 'F11') {
					e.preventDefault();
					this.toggleSlideshow(activeViewerWindow);
				}
			});
		},

		displayImage(win, imageItem) {
			if (!imageItem || !win) return;

			currentImageFile = imageItem;
			currentZoom = 1.0;
			currentRotation = 0;
			panOffsetX = 0;
			panOffsetY = 0;

			const titleEl = win.querySelector('.xp-window-header .title');
			if (titleEl) titleEl.textContent = `${imageItem.name} - Windows Picture and Fax Viewer`;

			const imgEl = win.querySelector('#picview-image-el');
			const sbFile = win.querySelector('#pv-sb-file-info');
			const sbIndex = win.querySelector('#pv-sb-index-info');
			const prevBtn = win.querySelector('#pv-btn-prev');
			const nextBtn = win.querySelector('#pv-btn-next');

			let attemptedFallback = false;
			imgEl.onload = () => {
				if (sbFile) sbFile.textContent = `${imageItem.name} (${imgEl.naturalWidth} x ${imgEl.naturalHeight} pixels)`;
				this.fitToWindow(win);
			};

			imgEl.onerror = () => {
				if (!attemptedFallback) {
					attemptedFallback = true;
					if (imageItem.src.includes('media.githubusercontent.com')) {
						imgEl.src = imageItem.src.replace('https://media.githubusercontent.com/media/Wartets/music/refs/heads/main/', 'https://raw.githubusercontent.com/Wartets/music/main/');
						return;
					}
					if (imageItem.src.includes('raw.githubusercontent.com')) {
						imgEl.src = imageItem.src.replace('https://raw.githubusercontent.com/Wartets/music/main/', 'https://cdn.jsdelivr.net/gh/Wartets/music@main/');
						return;
					}
				}
				if (sbFile) sbFile.textContent = `${imageItem.name} (Image unavailable)`;
			};

			imgEl.src = imageItem.src;

			if (sbIndex) sbIndex.textContent = `${currentImageIndex + 1} / ${currentFolderImages.length}`;
			if (prevBtn) prevBtn.disabled = currentFolderImages.length <= 1;
			if (nextBtn) nextBtn.disabled = currentFolderImages.length <= 1;

			this.applyTransform();
		},

		navigate(delta) {
			if (currentFolderImages.length <= 1 || !activeViewerWindow) return;
			currentImageIndex = (currentImageIndex + delta + currentFolderImages.length) % currentFolderImages.length;
			this.displayImage(activeViewerWindow, currentFolderImages[currentImageIndex]);
		},

		setZoom(zoomVal) {
			currentZoom = Math.max(0.1, Math.min(zoomVal, 8.0));
			this.applyTransform();
			if (activeViewerWindow) {
				const sbZoom = activeViewerWindow.querySelector('#pv-sb-zoom-info');
				if (sbZoom) sbZoom.textContent = `${Math.round(currentZoom * 100)}%`;
			}
		},

		fitToWindow(win) {
			const viewport = win.querySelector('#picview-viewport');
			const img = win.querySelector('#picview-image-el');
			if (!viewport || !img || !img.naturalWidth) return;

			const vpWidth = viewport.clientWidth - 40;
			const vpHeight = viewport.clientHeight - 40;
			const scaleX = vpWidth / img.naturalWidth;
			const scaleY = vpHeight / img.naturalHeight;
			const fitScale = Math.min(1.0, scaleX, scaleY);

			panOffsetX = 0;
			panOffsetY = 0;
			this.setZoom(fitScale > 0 ? fitScale : 1.0);
		},

		applyTransform() {
			if (!activeViewerWindow) return;
			const stage = activeViewerWindow.querySelector('#picview-stage');
			if (stage) {
				stage.style.transform = `translate(${panOffsetX}px, ${panOffsetY}px) scale(${currentZoom}) rotate(${currentRotation}deg)`;
			}
		},

		toggleSlideshow(win) {
			if (isSlideshow) {
				this.stopSlideshow();
			} else {
				this.startSlideshow(win);
			}
		},

		startSlideshow(win) {
			isSlideshow = true;
			const slideBtn = win.querySelector('#pv-btn-slideshow');
			if (slideBtn) slideBtn.classList.add('active');
			slideshowTimer = setInterval(() => {
				this.navigate(1);
			}, 3000);
		},

		stopSlideshow() {
			isSlideshow = false;
			if (slideshowTimer) {
				clearInterval(slideshowTimer);
				slideshowTimer = null;
			}
			if (activeViewerWindow) {
				const slideBtn = activeViewerWindow.querySelector('#pv-btn-slideshow');
				if (slideBtn) slideBtn.classList.remove('active');
			}
		}
	};

	window.PictureViewerApp = PictureViewerApp;
})();
