(function () {
	const PALETTE_COLORS = [
		'#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
		'#808040', '#004040', '#0080ff', '#004080', '#8000ff', '#804000',
		'#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
		'#ffff80', '#00ff80', '#80ffff', '#8080ff', '#ff0080', '#ff8040'
	];

	const PaintApp = {
		open(initialFile = null) {
			const id = initialFile ? `window-paint-${initialFile.name.replace(/[^\w-]/g, '_')}` : 'window-paint';
			const existing = document.getElementById(id);
			if (existing) {
				if (typeof bringWindowToFront === 'function') bringWindowToFront(existing);
				if (existing.classList.contains('minimized') && typeof unminimizeWindow === 'function') {
					unminimizeWindow(existing);
				}
				return existing;
			}

			const title = initialFile ? `${initialFile.name} - Paint` : 'untitled - Paint';
			const contentHTML = `
				<div class="paint-layout">
					<div class="paint-menubar">
						<ul>
							<li data-paint-menu="file"><u>F</u>ile</li>
							<li data-paint-menu="edit"><u>E</u>dit</li>
							<li data-paint-menu="view"><u>V</u>iew</li>
							<li data-paint-menu="image"><u>I</u>mage</li>
							<li data-paint-menu="colors"><u>C</u>olors</li>
							<li data-paint-menu="help"><u>H</u>elp</li>
						</ul>
					</div>

					<div class="paint-main-workspace">
						<div class="paint-toolbox" id="paint-toolbox">
							<div class="paint-tools-grid">
								<button type="button" class="paint-tool-btn" data-tool="free-select" title="Free-Form Select"><img src="https://api.iconify.design/mdi/lasso.svg?color=%23000000" alt="Free Select"></button>
								<button type="button" class="paint-tool-btn" data-tool="rect-select" title="Select"><img src="https://api.iconify.design/mdi/selection-drag.svg?color=%23000000" alt="Select"></button>
								<button type="button" class="paint-tool-btn" data-tool="eraser" title="Eraser/Color Eraser"><img src="https://api.iconify.design/mdi/eraser.svg?color=%23000000" alt="Eraser"></button>
								<button type="button" class="paint-tool-btn" data-tool="fill" title="Fill With Color"><img src="https://api.iconify.design/mdi/format-color-fill.svg?color=%23000000" alt="Fill"></button>
								<button type="button" class="paint-tool-btn" data-tool="picker" title="Pick Color"><img src="https://api.iconify.design/mdi/eyedropper.svg?color=%23000000" alt="Pick Color"></button>
								<button type="button" class="paint-tool-btn" data-tool="magnifier" title="Magnifier"><img src="https://api.iconify.design/mdi/magnify.svg?color=%23000000" alt="Magnifier"></button>
								<button type="button" class="paint-tool-btn active" data-tool="pencil" title="Pencil"><img src="https://api.iconify.design/mdi/pencil.svg?color=%23000000" alt="Pencil"></button>
								<button type="button" class="paint-tool-btn" data-tool="brush" title="Brush"><img src="https://api.iconify.design/mdi/brush.svg?color=%23000000" alt="Brush"></button>
								<button type="button" class="paint-tool-btn" data-tool="airbrush" title="Airbrush"><img src="https://api.iconify.design/mdi/spray.svg?color=%23000000" alt="Airbrush"></button>
								<button type="button" class="paint-tool-btn" data-tool="text" title="Text"><img src="https://api.iconify.design/mdi/format-text.svg?color=%23000000" alt="Text"></button>
								<button type="button" class="paint-tool-btn" data-tool="line" title="Line"><img src="https://api.iconify.design/mdi/vector-line.svg?color=%23000000" alt="Line"></button>
								<button type="button" class="paint-tool-btn" data-tool="curve" title="Curve"><img src="https://api.iconify.design/mdi/vector-curve.svg?color=%23000000" alt="Curve"></button>
								<button type="button" class="paint-tool-btn" data-tool="rectangle" title="Rectangle"><img src="https://api.iconify.design/mdi/rectangle-outline.svg?color=%23000000" alt="Rectangle"></button>
								<button type="button" class="paint-tool-btn" data-tool="polygon" title="Polygon"><img src="https://api.iconify.design/mdi/vector-polygon.svg?color=%23000000" alt="Polygon"></button>
								<button type="button" class="paint-tool-btn" data-tool="ellipse" title="Ellipse"><img src="https://api.iconify.design/mdi/ellipse-outline.svg?color=%23000000" alt="Ellipse"></button>
								<button type="button" class="paint-tool-btn" data-tool="round-rect" title="Rounded Rectangle"><img src="https://api.iconify.design/mdi/square-rounded-outline.svg?color=%23000000" alt="Rounded Rectangle"></button>
							</div>
							<div class="paint-tool-options" id="paint-tool-options"></div>
						</div>

						<div class="paint-canvas-viewport" id="paint-viewport">
							<div class="paint-canvas-wrapper" id="paint-canvas-wrapper">
								<canvas id="paint-main-canvas" width="560" height="380"></canvas>
								<canvas id="paint-overlay-canvas" width="560" height="380"></canvas>
								<div class="paint-resize-handle paint-handle-r"></div>
								<div class="paint-resize-handle paint-handle-b"></div>
								<div class="paint-resize-handle paint-handle-br"></div>
							</div>
						</div>
					</div>

					<div class="paint-bottom-panel">
						<div class="paint-color-box">
							<div class="paint-current-colors">
								<div class="paint-color-sec" id="paint-sec-color-box"></div>
								<div class="paint-color-pri" id="paint-pri-color-box"></div>
							</div>
							<div class="paint-palette-grid" id="paint-palette-grid"></div>
						</div>
					</div>

					<div class="paint-statusbar">
						<div class="paint-sb-hint" id="paint-sb-hint">For Help, click Help Topics on the Help Menu.</div>
						<div class="paint-sb-coords" id="paint-sb-coords"></div>
						<div class="paint-sb-dim" id="paint-sb-dim">560x380px</div>
					</div>
				</div>
			`;

			const win = createXPWindow(id, title, contentHTML, 780, 560, {
				iconSrc: '../assets/images/desk/icons/Camera.webp',
				resizable: true
			});

			win.querySelector('.xp-window-content').style.padding = '0';
			win.classList.add('paint-window');

			this.initPaintEngine(win, initialFile);
			return win;
		},

		initPaintEngine(win, activeFile) {
			const mainCanvas = win.querySelector('#paint-main-canvas');
			const overlayCanvas = win.querySelector('#paint-overlay-canvas');
			const ctx = mainCanvas.getContext('2d', { willReadFrequently: true });
			const oCtx = overlayCanvas.getContext('2d', { willReadFrequently: true });
			const wrapper = win.querySelector('#paint-canvas-wrapper');
			const viewport = win.querySelector('#paint-viewport');

			const priBox = win.querySelector('#paint-pri-color-box');
			const secBox = win.querySelector('#paint-sec-color-box');
			const paletteGrid = win.querySelector('#paint-palette-grid');
			const optionsPanel = win.querySelector('#paint-tool-options');

			const sbCoords = win.querySelector('#paint-sb-coords');
			const sbDim = win.querySelector('#paint-sb-dim');
			const sbHint = win.querySelector('#paint-sb-hint');

			let primaryColor = '#000000';
			let secondaryColor = '#ffffff';
			let activeTool = 'pencil';
			let lineWidth = 1;
			let shapeFillMode = 'outline';
			let brushType = 'round';
			let eraserSize = 8;
			let isDrawing = false;
			let startX = 0;
			let startY = 0;
			let undoStack = [];
			let redoStack = [];

			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

			const pushState = () => {
				if (undoStack.length >= 20) undoStack.shift();
				undoStack.push(ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height));
				redoStack = [];
			};
			pushState();

			const updateColorBoxes = () => {
				priBox.style.backgroundColor = primaryColor;
				secBox.style.backgroundColor = secondaryColor;
			};
			updateColorBoxes();

			paletteGrid.innerHTML = '';
			PALETTE_COLORS.forEach(c => {
				const swatch = document.createElement('div');
				swatch.className = 'paint-swatch';
				swatch.style.backgroundColor = c;
				swatch.addEventListener('mousedown', (e) => {
					e.preventDefault();
					if (e.button === 0) {
						primaryColor = c;
					} else if (e.button === 2) {
						secondaryColor = c;
					}
					updateColorBoxes();
				});
				swatch.addEventListener('contextmenu', e => e.preventDefault());
				paletteGrid.appendChild(swatch);
			});

			const renderToolOptions = () => {
				optionsPanel.innerHTML = '';
				if (activeTool === 'line' || activeTool === 'curve') {
					[1, 2, 3, 4, 5].forEach(w => {
						const opt = document.createElement('div');
						opt.className = `paint-opt-line ${lineWidth === w ? 'selected' : ''}`;
						opt.innerHTML = `<div style="height:${w}px;background:#000;width:80%;"></div>`;
						opt.addEventListener('click', () => {
							lineWidth = w;
							renderToolOptions();
						});
						optionsPanel.appendChild(opt);
					});
				} else if (activeTool === 'brush') {
					[
						{ size: 2, type: 'round' },
						{ size: 5, type: 'round' },
						{ size: 8, type: 'round' },
						{ size: 4, type: 'square' },
						{ size: 8, type: 'square' }
					].forEach(b => {
						const opt = document.createElement('div');
						opt.className = `paint-opt-brush ${brushType === b.type && lineWidth === b.size ? 'selected' : ''}`;
						opt.style.display = 'flex';
						opt.style.alignItems = 'center';
						opt.style.justifyContent = 'center';
						opt.innerHTML = `<div style="width:${b.size}px;height:${b.size}px;background:#000;border-radius:${b.type === 'round' ? '50%' : '0'};"></div>`;
						opt.addEventListener('click', () => {
							lineWidth = b.size;
							brushType = b.type;
							renderToolOptions();
						});
						optionsPanel.appendChild(opt);
					});
				} else if (activeTool === 'eraser') {
					[4, 6, 8, 12].forEach(s => {
						const opt = document.createElement('div');
						opt.className = `paint-opt-eraser ${eraserSize === s ? 'selected' : ''}`;
						opt.style.display = 'flex';
						opt.style.alignItems = 'center';
						opt.style.justifyContent = 'center';
						opt.innerHTML = `<div style="width:${s}px;height:${s}px;background:#000;"></div>`;
						opt.addEventListener('click', () => {
							eraserSize = s;
							renderToolOptions();
						});
						optionsPanel.appendChild(opt);
					});
				} else if (['rectangle', 'round-rect', 'ellipse', 'polygon'].includes(activeTool)) {
					[
						{ mode: 'outline', label: 'Outline' },
						{ mode: 'fill-outline', label: 'Filled Outline' },
						{ mode: 'fill', label: 'Fill Only' }
					].forEach(m => {
						const opt = document.createElement('div');
						opt.className = `paint-opt-shape ${shapeFillMode === m.mode ? 'selected' : ''}`;
						opt.title = m.label;
						if (m.mode === 'outline') {
							opt.innerHTML = `<div style="width:24px;height:12px;border:1px solid #000;"></div>`;
						} else if (m.mode === 'fill-outline') {
							opt.innerHTML = `<div style="width:24px;height:12px;border:1px solid #000;background:#808080;"></div>`;
						} else {
							opt.innerHTML = `<div style="width:24px;height:12px;background:#808080;"></div>`;
						}
						opt.addEventListener('click', () => {
							shapeFillMode = m.mode;
							renderToolOptions();
						});
						optionsPanel.appendChild(opt);
					});
				}
			};

			win.querySelectorAll('.paint-tool-btn').forEach(btn => {
				btn.addEventListener('click', () => {
					win.querySelectorAll('.paint-tool-btn').forEach(b => b.classList.remove('active'));
					btn.classList.add('active');
					activeTool = btn.dataset.tool;
					renderToolOptions();
					sbHint.textContent = `Tool: ${btn.title}`;
				});
			});
			renderToolOptions();

			const floodFill = (startX, startY, fillHex) => {
				const imgData = ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
				const data = imgData.data;
				const width = mainCanvas.width;
				const height = mainCanvas.height;

				const targetIdx = (startY * width + startX) * 4;
				const tr = data[targetIdx];
				const tg = data[targetIdx + 1];
				const tb = data[targetIdx + 2];
				const ta = data[targetIdx + 3];

				const tempC = document.createElement('canvas').getContext('2d');
				tempC.fillStyle = fillHex;
				tempC.fillRect(0, 0, 1, 1);
				const fillRGBA = tempC.getImageData(0, 0, 1, 1).data;
				const fr = fillRGBA[0];
				const fg = fillRGBA[1];
				const fb = fillRGBA[2];
				const fa = fillRGBA[3];

				if (tr === fr && tg === fg && tb === fb && ta === fa) return;

				const match = (idx) => data[idx] === tr && data[idx + 1] === tg && data[idx + 2] === tb && data[idx + 3] === ta;
				const colorPixel = (idx) => {
					data[idx] = fr;
					data[idx + 1] = fg;
					data[idx + 2] = fb;
					data[idx + 3] = fa;
				};

				const queue = [startX, startY];
				while (queue.length > 0) {
					const cy = queue.pop();
					const cx = queue.pop();
					let idx = (cy * width + cx) * 4;

					if (!match(idx)) continue;

					let left = cx;
					while (left >= 0 && match((cy * width + left) * 4)) left--;
					left++;

					let right = cx;
					while (right < width && match((cy * width + right) * 4)) right++;
					right--;

					for (let x = left; x <= right; x++) {
						const pIdx = (cy * width + x) * 4;
						colorPixel(pIdx);

						if (cy > 0 && match(((cy - 1) * width + x) * 4)) {
							queue.push(x, cy - 1);
						}
						if (cy < height - 1 && match(((cy + 1) * width + x) * 4)) {
							queue.push(x, cy + 1);
						}
					}
				}
				ctx.putImageData(imgData, 0, 0);
			};

			const getCanvasPos = (e) => {
				const rect = overlayCanvas.getBoundingClientRect();
				return {
					x: Math.floor(e.clientX - rect.left),
					y: Math.floor(e.clientY - rect.top)
				};
			};

			overlayCanvas.addEventListener('mousemove', (e) => {
				const pos = getCanvasPos(e);
				sbCoords.textContent = `${pos.x}, ${pos.y}px`;

				if (!isDrawing) return;

				oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
				const color = (e.buttons === 2) ? secondaryColor : primaryColor;

				if (activeTool === 'pencil') {
					ctx.strokeStyle = color;
					ctx.lineWidth = 1;
					ctx.lineCap = 'round';
					ctx.lineTo(pos.x, pos.y);
					ctx.stroke();
				} else if (activeTool === 'brush') {
					ctx.strokeStyle = color;
					ctx.fillStyle = color;
					ctx.lineWidth = lineWidth;
					ctx.lineCap = brushType === 'round' ? 'round' : 'square';
					ctx.lineTo(pos.x, pos.y);
					ctx.stroke();
				} else if (activeTool === 'eraser') {
					ctx.fillStyle = secondaryColor;
					ctx.fillRect(pos.x - eraserSize / 2, pos.y - eraserSize / 2, eraserSize, eraserSize);
				} else if (activeTool === 'line') {
					oCtx.strokeStyle = color;
					oCtx.lineWidth = lineWidth;
					oCtx.beginPath();
					oCtx.moveTo(startX, startY);
					oCtx.lineTo(pos.x, pos.y);
					oCtx.stroke();
				} else if (activeTool === 'rectangle' || activeTool === 'round-rect') {
					const w = pos.x - startX;
					const h = pos.y - startY;
					oCtx.strokeStyle = color;
					oCtx.fillStyle = (e.buttons === 2) ? primaryColor : secondaryColor;
					oCtx.lineWidth = lineWidth;

					if (shapeFillMode === 'fill' || shapeFillMode === 'fill-outline') {
						oCtx.fillRect(startX, startY, w, h);
					}
					if (shapeFillMode === 'outline' || shapeFillMode === 'fill-outline') {
						oCtx.strokeRect(startX, startY, w, h);
					}
				} else if (activeTool === 'ellipse') {
					const rx = Math.abs(pos.x - startX) / 2;
					const ry = Math.abs(pos.y - startY) / 2;
					const cx = Math.min(startX, pos.x) + rx;
					const cy = Math.min(startY, pos.y) + ry;

					oCtx.strokeStyle = color;
					oCtx.fillStyle = (e.buttons === 2) ? primaryColor : secondaryColor;
					oCtx.lineWidth = lineWidth;
					oCtx.beginPath();
					oCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
					if (shapeFillMode === 'fill' || shapeFillMode === 'fill-outline') oCtx.fill();
					if (shapeFillMode === 'outline' || shapeFillMode === 'fill-outline') oCtx.stroke();
				}
			});

			overlayCanvas.addEventListener('mousedown', (e) => {
				e.preventDefault();
				isDrawing = true;
				const pos = getCanvasPos(e);
				startX = pos.x;
				startY = pos.y;
				const color = (e.button === 2) ? secondaryColor : primaryColor;

				if (activeTool === 'pencil' || activeTool === 'brush') {
					ctx.beginPath();
					ctx.moveTo(pos.x, pos.y);
				} else if (activeTool === 'eraser') {
					ctx.fillStyle = secondaryColor;
					ctx.fillRect(pos.x - eraserSize / 2, pos.y - eraserSize / 2, eraserSize, eraserSize);
				} else if (activeTool === 'fill') {
					floodFill(pos.x, pos.y, color);
					pushState();
				} else if (activeTool === 'picker') {
					const pixel = ctx.getImageData(pos.x, pos.y, 1, 1).data;
					const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
					if (e.button === 2) secondaryColor = hex;
					else primaryColor = hex;
					updateColorBoxes();
				} else if (activeTool === 'text') {
					const text = prompt('Enter text:');
					if (text) {
						ctx.fillStyle = color;
						ctx.font = '14px Tahoma, sans-serif';
						ctx.fillText(text, pos.x, pos.y);
						pushState();
					}
				}
			});

			overlayCanvas.addEventListener('mouseup', (e) => {
				if (!isDrawing) return;
				isDrawing = false;
				const pos = getCanvasPos(e);
				const color = (e.button === 2) ? secondaryColor : primaryColor;

				if (['line', 'rectangle', 'round-rect', 'ellipse'].includes(activeTool)) {
					ctx.drawImage(overlayCanvas, 0, 0);
					oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
				}
				pushState();
			});

			overlayCanvas.addEventListener('contextmenu', e => e.preventDefault());

			const resizeCanvas = (newW, newH) => {
				const temp = ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
				mainCanvas.width = newW;
				mainCanvas.height = newH;
				overlayCanvas.width = newW;
				overlayCanvas.height = newH;
				wrapper.style.width = `${newW}px`;
				wrapper.style.height = `${newH}px`;
				ctx.fillStyle = '#ffffff';
				ctx.fillRect(0, 0, newW, newH);
				ctx.putImageData(temp, 0, 0);
				sbDim.textContent = `${newW}x${newH}px`;
				pushState();
			};

			const handleBR = win.querySelector('.paint-handle-br');
			let isResizingCanvas = false;
			handleBR.addEventListener('mousedown', (e) => {
				e.preventDefault();
				isResizingCanvas = true;
				const startW = mainCanvas.width;
				const startH = mainCanvas.height;
				const sX = e.clientX;
				const sY = e.clientY;

				const onMove = (ev) => {
					if (!isResizingCanvas) return;
					const nW = Math.max(50, startW + (ev.clientX - sX));
					const nH = Math.max(50, startH + (ev.clientY - sY));
					wrapper.style.width = `${nW}px`;
					wrapper.style.height = `${nH}px`;
					sbDim.textContent = `${nW}x${nH}px`;
				};

				const onUp = (ev) => {
					if (!isResizingCanvas) return;
					isResizingCanvas = false;
					const nW = Math.max(50, startW + (ev.clientX - sX));
					const nH = Math.max(50, startH + (ev.clientY - sY));
					resizeCanvas(nW, nH);
					document.removeEventListener('mousemove', onMove);
					document.removeEventListener('mouseup', onUp);
				};

				document.addEventListener('mousemove', onMove);
				document.addEventListener('mouseup', onUp);
			});

			if (activeFile && activeFile.content) {
				const img = new Image();
				img.onload = () => {
					resizeCanvas(img.width, img.height);
					ctx.drawImage(img, 0, 0);
					pushState();
				};
				img.src = activeFile.content;
			}

			win.querySelectorAll('.paint-menubar li[data-paint-menu]').forEach(menuLi => {
				menuLi.addEventListener('click', (e) => {
					e.stopPropagation();
					const menuType = menuLi.dataset.paintMenu;
					const rect = menuLi.getBoundingClientRect();
					let items = [];

					if (menuType === 'file') {
						items = [
							{
								label: 'New',
								shortcut: 'Ctrl+N',
								action: () => {
									ctx.fillStyle = '#ffffff';
									ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
									pushState();
								}
							},
							{
								label: 'Open...',
								shortcut: 'Ctrl+O',
								action: () => {
									const input = document.createElement('input');
									input.type = 'file';
									input.accept = 'image/*';
									input.onchange = (ev) => {
										const file = ev.target.files[0];
										if (!file) return;
										const reader = new FileReader();
										reader.onload = (re) => {
											const img = new Image();
											img.onload = () => {
												resizeCanvas(img.width, img.height);
												ctx.drawImage(img, 0, 0);
												pushState();
											};
											img.src = re.target.result;
										};
										reader.readAsDataURL(file);
									};
									input.click();
								}
							},
							{
								label: 'Save',
								shortcut: 'Ctrl+S',
								action: () => {
									const dataUrl = mainCanvas.toDataURL('image/png');
									if (activeFile && typeof activeFile.write === 'function') {
										activeFile.write(dataUrl);
										showXPDialog('Paint', `File '${activeFile.name}' saved successfully.`, 'info');
									} else if (typeof fs !== 'undefined' && fs.create) {
										try {
											const f = fs.create('File', '/', 'Drawing.png');
											f.icon = '../assets/images/desk/icons/Camera.webp';
											f.write(dataUrl);
											refreshUI();
											showXPDialog('Paint', 'Drawing saved to Desktop as Drawing.png.', 'info');
										} catch (err) {
											showXPDialog('Error', err.message, 'error');
										}
									}
								}
							},
							{
								label: 'Save As...',
								action: () => {
									const name = prompt('File name:', 'untitled.png');
									if (name && typeof fs !== 'undefined') {
										const dataUrl = mainCanvas.toDataURL('image/png');
										const f = fs.create('File', '/', name);
										f.icon = '../assets/images/desk/icons/Camera.webp';
										f.write(dataUrl);
										refreshUI();
									}
								}
							},
							{ separator: true },
							{
								label: 'Set as Wallpaper (Tiled)',
								action: () => {
									const dataUrl = mainCanvas.toDataURL('image/png');
									if (window.SettingsApp) {
										window.SettingsApp.set('desktopBackground', dataUrl);
										window.SettingsApp.set('wallpaperFit', 'tile');
									}
								}
							},
							{
								label: 'Set as Wallpaper (Centered)',
								action: () => {
									const dataUrl = mainCanvas.toDataURL('image/png');
									if (window.SettingsApp) {
										window.SettingsApp.set('desktopBackground', dataUrl);
										window.SettingsApp.set('wallpaperFit', 'center');
									}
								}
							},
							{ separator: true },
							{ label: 'Exit', action: () => closeWindow(win, win.id) }
						];
					} else if (menuType === 'edit') {
						items = [
							{
								label: 'Undo',
								shortcut: 'Ctrl+Z',
								disabled: undoStack.length <= 1,
								action: () => {
									if (undoStack.length > 1) {
										redoStack.push(undoStack.pop());
										const state = undoStack[undoStack.length - 1];
										ctx.putImageData(state, 0, 0);
									}
								}
							},
							{
								label: 'Redo',
								shortcut: 'Ctrl+Y',
								disabled: redoStack.length === 0,
								action: () => {
									if (redoStack.length > 0) {
										const state = redoStack.pop();
										undoStack.push(state);
										ctx.putImageData(state, 0, 0);
									}
								}
							},
							{ separator: true },
							{
								label: 'Select All',
								shortcut: 'Ctrl+A',
								action: () => {}
							},
							{
								label: 'Clear Selection',
								action: () => {
									ctx.fillStyle = secondaryColor;
									ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
									pushState();
								}
							}
						];
					} else if (menuType === 'image') {
						items = [
							{
								label: 'Invert Colors',
								shortcut: 'Ctrl+I',
								action: () => {
									const imgData = ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
									const d = imgData.data;
									for (let i = 0; i < d.length; i += 4) {
										d[i] = 255 - d[i];
										d[i + 1] = 255 - d[i + 1];
										d[i + 2] = 255 - d[i + 2];
									}
									ctx.putImageData(imgData, 0, 0);
									pushState();
								}
							},
							{
								label: 'Clear Image',
								shortcut: 'Ctrl+Shift+N',
								action: () => {
									ctx.fillStyle = secondaryColor;
									ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
									pushState();
								}
							},
							{
								label: 'Attributes...',
								shortcut: 'Ctrl+E',
								action: () => {
									const w = prompt('Width:', String(mainCanvas.width));
									const h = prompt('Height:', String(mainCanvas.height));
									if (w && h) resizeCanvas(parseInt(w, 10), parseInt(h, 10));
								}
							}
						];
					} else if (menuType === 'colors') {
						items = [
							{
								label: 'Edit Colors...',
								action: () => {
									const picker = document.createElement('input');
									picker.type = 'color';
									picker.value = primaryColor;
									picker.onchange = () => {
										primaryColor = picker.value;
										updateColorBoxes();
									};
									picker.click();
								}
							}
						];
					} else if (menuType === 'help') {
						items = [
							{ label: 'Help Topics', action: () => window.open('https://github.com/wartets/Wartets.github.io', '_blank') },
							{ separator: true },
							{
								label: 'About Paint',
								bold: true,
								action: () => {
									showXPDialog('About Paint', 'Microsoft Windows XP Paint\nVersion 5.1 (Build 2600.xpsp_sp3_gdr)\nBitmap Graphics Editor Engine', 'info');
								}
							}
						];
					}

					if (window.ContextMenu) {
						window.ContextMenu.show(items, rect.left, rect.bottom + 2);
					}
				});
			});
		}
	};

	window.PaintApp = PaintApp;
	window.openPaint = (file = null) => PaintApp.open(file);
})();
