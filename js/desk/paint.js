(function () {
	const PALETTE_COLORS = [
		'#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
		'#808040', '#004040', '#0080ff', '#004080', '#8000ff', '#804000',
		'#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
		'#ffff80', '#00ff80', '#80ffff', '#8080ff', '#ff0080', '#ff8040'
	];

	const PaintApp = {
		open(initialFile = null) {
			const id = initialFile ? `window-paint-${initialFile.getFullPath().replace(/[^\w-]/g, '_')}` : 'window-paint';
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
						<div class="paint-sb-sel" id="paint-sb-sel"></div>
						<div class="paint-sb-dim" id="paint-sb-dim">560x380px</div>
					</div>
				</div>
			`;

			const win = createXPWindow(id, title, contentHTML, 780, 560, {
				iconSrc: '../assets/images/desk/icons/Paint.webp',
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
			const sbSel = win.querySelector('#paint-sb-sel');
			const sbDim = win.querySelector('#paint-sb-dim');
			const sbHint = win.querySelector('#paint-sb-hint');
			const titleSpan = win.querySelector('.xp-window-header .title');

			let currentFile = activeFile;
			let isDirty = false;

			let primaryColor = '#000000';
			let secondaryColor = '#ffffff';
			let activeTool = 'pencil';
			let lineWidth = 1;
			let shapeFillMode = 'outline';
			let brushType = 'round';
			let brushSize = 4;
			let eraserSize = 8;
			let sprayDensity = 25;
			let sprayRadius = 10;
			let airbrushInterval = null;
			let zoomLevel = 1;
			let isTransparentSelection = false;

			let isDrawing = false;
			let startX = 0;
			let startY = 0;
			let lastX = 0;
			let lastY = 0;

			let curveStep = 0;
			let curveStart = { x: 0, y: 0 };
			let curveEnd = { x: 0, y: 0 };
			let curveControl1 = { x: 0, y: 0 };

			let polygonPoints = [];
			let isBuildingPolygon = false;

			let selectionData = null;
			let selectionBounds = null;
			let isDraggingSelection = false;
			let dragSelectionOffset = { x: 0, y: 0 };

			let freehandSelectionPath = [];

			let undoStack = [];
			let redoStack = [];

			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

			function updateWindowTitle() {
				const name = currentFile ? currentFile.name : 'untitled';
				titleSpan.textContent = `${name}${isDirty ? '*' : ''} - Paint`;
			}

			const pushState = () => {
				if (undoStack.length >= 20) undoStack.shift();
				undoStack.push(ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height));
				redoStack = [];
				isDirty = true;
				updateWindowTitle();
			};

			undoStack.push(ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height));

			const updateColorBoxes = () => {
				priBox.style.backgroundColor = primaryColor;
				secBox.style.backgroundColor = secondaryColor;
			};
			updateColorBoxes();

			function renderPalette() {
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
			}
			renderPalette();

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
						{ size: 9, type: 'round' },
						{ size: 4, type: 'square' },
						{ size: 8, type: 'square' },
						{ size: 6, type: 'slash-right' },
						{ size: 6, type: 'slash-left' }
					].forEach(b => {
						const opt = document.createElement('div');
						opt.className = `paint-opt-brush ${brushType === b.type && brushSize === b.size ? 'selected' : ''}`;
						opt.style.display = 'flex';
						opt.style.alignItems = 'center';
						opt.style.justifyContent = 'center';

						let inner = `<div style="width:${b.size}px;height:${b.size}px;background:#000;border-radius:${b.type === 'round' ? '50%' : '0'};"></div>`;
						if (b.type === 'slash-right') {
							inner = `<div style="width:2px;height:8px;background:#000;transform:rotate(45deg);"></div>`;
						} else if (b.type === 'slash-left') {
							inner = `<div style="width:2px;height:8px;background:#000;transform:rotate(-45deg);"></div>`;
						}

						opt.innerHTML = inner;
						opt.addEventListener('click', () => {
							brushSize = b.size;
							brushType = b.type;
							renderToolOptions();
						});
						optionsPanel.appendChild(opt);
					});
				} else if (activeTool === 'airbrush') {
					[
						{ rad: 6, den: 15, label: 'Small' },
						{ rad: 10, den: 25, label: 'Medium' },
						{ rad: 16, den: 40, label: 'Large' }
					].forEach(a => {
						const opt = document.createElement('div');
						opt.className = `paint-opt-brush ${sprayRadius === a.rad ? 'selected' : ''}`;
						opt.style.display = 'flex';
						opt.style.alignItems = 'center';
						opt.style.justifyContent = 'center';
						opt.innerHTML = `<div style="width:${a.rad}px;height:${a.rad}px;border:1px dotted #000;border-radius:50%;"></div>`;
						opt.addEventListener('click', () => {
							sprayRadius = a.rad;
							sprayDensity = a.den;
							renderToolOptions();
						});
						optionsPanel.appendChild(opt);
					});
				} else if (activeTool === 'eraser') {
					[4, 6, 8, 12, 16].forEach(s => {
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
				} else if (activeTool === 'magnifier') {
					[1, 2, 4, 6, 8].forEach(z => {
						const opt = document.createElement('div');
						opt.className = `paint-opt-line ${zoomLevel === z ? 'selected' : ''}`;
						opt.textContent = `${z}x`;
						opt.style.fontSize = '10px';
						opt.style.fontWeight = 'bold';
						opt.addEventListener('click', () => {
							setZoom(z);
							renderToolOptions();
						});
						optionsPanel.appendChild(opt);
					});
				} else if (activeTool === 'rect-select' || activeTool === 'free-select') {
					[
						{ trans: false, icon: 'https://api.iconify.design/mdi/checkbox-blank-outline.svg' },
						{ trans: true, icon: 'https://api.iconify.design/mdi/checkbox-intermediate.svg' }
					].forEach(o => {
						const opt = document.createElement('div');
						opt.className = `paint-opt-shape ${isTransparentSelection === o.trans ? 'selected' : ''}`;
						opt.title = o.trans ? 'Transparent Selection' : 'Opaque Selection';
						opt.innerHTML = `<div style="font-size:10px;text-align:center;">${o.trans ? 'Trans' : 'Opaque'}</div>`;
						opt.addEventListener('click', () => {
							isTransparentSelection = o.trans;
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

			function commitSelection() {
				if (selectionData && selectionBounds) {
					ctx.drawImage(overlayCanvas, 0, 0);
					oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
					selectionData = null;
					selectionBounds = null;
					isDraggingSelection = false;
					if (sbSel) sbSel.textContent = '';
					pushState();
				}
			}

			win.querySelectorAll('.paint-tool-btn').forEach(btn => {
				btn.addEventListener('click', () => {
					commitSelection();
					win.querySelectorAll('.paint-tool-btn').forEach(b => b.classList.remove('active'));
					btn.classList.add('active');
					activeTool = btn.dataset.tool;
					curveStep = 0;
					isBuildingPolygon = false;
					polygonPoints = [];
					renderToolOptions();
					sbHint.textContent = `Tool: ${btn.title}`;
				});
			});
			renderToolOptions();

			function setZoom(factor) {
				zoomLevel = factor;
				mainCanvas.style.width = `${mainCanvas.width * zoomLevel}px`;
				mainCanvas.style.height = `${mainCanvas.height * zoomLevel}px`;
				overlayCanvas.style.width = `${overlayCanvas.width * zoomLevel}px`;
				overlayCanvas.style.height = `${overlayCanvas.height * zoomLevel}px`;
				wrapper.style.width = `${mainCanvas.width * zoomLevel}px`;
				wrapper.style.height = `${mainCanvas.height * zoomLevel}px`;
			}

			const floodFill = (targetX, targetY, fillHex) => {
				const imgData = ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
				const data = imgData.data;
				const width = mainCanvas.width;
				const height = mainCanvas.height;

				const targetIdx = (targetY * width + targetX) * 4;
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

				const queue = [targetX, targetY];
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

			const sprayAirbrush = (cx, cy, color) => {
				ctx.fillStyle = color;
				for (let i = 0; i < sprayDensity; i++) {
					const angle = Math.random() * Math.PI * 2;
					const radius = Math.random() * sprayRadius;
					const x = Math.floor(cx + Math.cos(angle) * radius);
					const y = Math.floor(cy + Math.sin(angle) * radius);
					if (x >= 0 && x < mainCanvas.width && y >= 0 && y < mainCanvas.height) {
						ctx.fillRect(x, y, 1, 1);
					}
				}
			};

			const drawBrushStroke = (x1, y1, x2, y2, color) => {
				ctx.fillStyle = color;
				ctx.strokeStyle = color;
				ctx.lineWidth = brushSize;
				ctx.lineCap = brushType === 'round' ? 'round' : 'butt';

				if (brushType === 'round') {
					ctx.beginPath();
					ctx.moveTo(x1, y1);
					ctx.lineTo(x2, y2);
					ctx.stroke();
				} else if (brushType === 'square') {
					const dist = Math.hypot(x2 - x1, y2 - y1);
					const steps = Math.max(1, Math.floor(dist));
					for (let i = 0; i <= steps; i++) {
						const x = x1 + (x2 - x1) * (i / steps);
						const y = y1 + (y2 - y1) * (i / steps);
						ctx.fillRect(Math.floor(x - brushSize / 2), Math.floor(y - brushSize / 2), brushSize, brushSize);
					}
				} else if (brushType === 'slash-right' || brushType === 'slash-left') {
					const dist = Math.hypot(x2 - x1, y2 - y1);
					const steps = Math.max(1, Math.floor(dist));
					const angle = brushType === 'slash-right' ? Math.PI / 4 : -Math.PI / 4;
					const dx = Math.cos(angle) * (brushSize / 2);
					const dy = Math.sin(angle) * (brushSize / 2);

					for (let i = 0; i <= steps; i++) {
						const x = x1 + (x2 - x1) * (i / steps);
						const y = y1 + (y2 - y1) * (i / steps);
						ctx.beginPath();
						ctx.moveTo(x - dx, y - dy);
						ctx.lineTo(x + dx, y + dy);
						ctx.stroke();
					}
				}
			};

			const getCanvasPos = (e) => {
				const rect = overlayCanvas.getBoundingClientRect();
				const scaleX = overlayCanvas.width / rect.width;
				const scaleY = overlayCanvas.height / rect.height;
				return {
					x: Math.floor((e.clientX - rect.left) * scaleX),
					y: Math.floor((e.clientY - rect.top) * scaleY)
				};
			};

			overlayCanvas.addEventListener('mousemove', (e) => {
				const pos = getCanvasPos(e);
				sbCoords.textContent = `${pos.x}, ${pos.y}px`;

				if (!isDrawing) return;

				const color = (e.buttons === 2) ? secondaryColor : primaryColor;

				if (activeTool === 'pencil') {
					ctx.strokeStyle = color;
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(lastX, lastY);
					ctx.lineTo(pos.x, pos.y);
					ctx.stroke();
					lastX = pos.x;
					lastY = pos.y;
				} else if (activeTool === 'brush') {
					drawBrushStroke(lastX, lastY, pos.x, pos.y, color);
					lastX = pos.x;
					lastY = pos.y;
				} else if (activeTool === 'eraser') {
					ctx.fillStyle = secondaryColor;
					ctx.fillRect(pos.x - eraserSize / 2, pos.y - eraserSize / 2, eraserSize, eraserSize);
					lastX = pos.x;
					lastY = pos.y;
				} else if (activeTool === 'airbrush') {
					lastX = pos.x;
					lastY = pos.y;
				} else if (activeTool === 'line') {
					oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
					oCtx.strokeStyle = color;
					oCtx.lineWidth = lineWidth;
					oCtx.beginPath();
					oCtx.moveTo(startX, startY);
					oCtx.lineTo(pos.x, pos.y);
					oCtx.stroke();
				} else if (activeTool === 'curve') {
					oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
					oCtx.strokeStyle = color;
					oCtx.lineWidth = lineWidth;
					oCtx.beginPath();
					if (curveStep === 1) {
						oCtx.moveTo(curveStart.x, curveStart.y);
						oCtx.lineTo(pos.x, pos.y);
					} else if (curveStep === 2) {
						oCtx.moveTo(curveStart.x, curveStart.y);
						oCtx.quadraticCurveTo(pos.x, pos.y, curveEnd.x, curveEnd.y);
					} else if (curveStep === 3) {
						oCtx.moveTo(curveStart.x, curveStart.y);
						oCtx.bezierCurveTo(curveControl1.x, curveControl1.y, pos.x, pos.y, curveEnd.x, curveEnd.y);
					}
					oCtx.stroke();
				} else if (activeTool === 'rectangle' || activeTool === 'round-rect') {
					oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
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
					if (sbSel) sbSel.textContent = `${Math.abs(w)}x${Math.abs(h)}px`;
				} else if (activeTool === 'ellipse') {
					oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
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
					if (sbSel) sbSel.textContent = `${Math.round(rx * 2)}x${Math.round(ry * 2)}px`;
				} else if (activeTool === 'polygon') {
					oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
					oCtx.strokeStyle = color;
					oCtx.lineWidth = lineWidth;
					oCtx.beginPath();
					if (polygonPoints.length > 0) {
						oCtx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
						for (let i = 1; i < polygonPoints.length; i++) {
							oCtx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
						}
						oCtx.lineTo(pos.x, pos.y);
					}
					oCtx.stroke();
				} else if (activeTool === 'rect-select') {
					if (isDraggingSelection && selectionData) {
						oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
						const curX = pos.x - dragSelectionOffset.x;
						const curY = pos.y - dragSelectionOffset.y;
						oCtx.putImageData(selectionData, curX, curY);
						oCtx.strokeStyle = '#000';
						oCtx.setLineDash([4, 4]);
						oCtx.strokeRect(curX, curY, selectionData.width, selectionData.height);
						oCtx.setLineDash([]);
						selectionBounds.x = curX;
						selectionBounds.y = curY;
					} else {
						oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
						const w = pos.x - startX;
						const h = pos.y - startY;
						oCtx.strokeStyle = '#000000';
						oCtx.setLineDash([4, 4]);
						oCtx.strokeRect(startX, startY, w, h);
						oCtx.setLineDash([]);
						if (sbSel) sbSel.textContent = `${Math.abs(w)}x${Math.abs(h)}px`;
					}
				} else if (activeTool === 'free-select') {
					freehandSelectionPath.push(pos);
					oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
					oCtx.strokeStyle = '#000000';
					oCtx.setLineDash([3, 3]);
					oCtx.beginPath();
					oCtx.moveTo(freehandSelectionPath[0].x, freehandSelectionPath[0].y);
					for (let i = 1; i < freehandSelectionPath.length; i++) {
						oCtx.lineTo(freehandSelectionPath[i].x, freehandSelectionPath[i].y);
					}
					oCtx.stroke();
					oCtx.setLineDash([]);
				}
			});

			overlayCanvas.addEventListener('mousedown', (e) => {
				e.preventDefault();
				const pos = getCanvasPos(e);
				startX = pos.x;
				startY = pos.y;
				lastX = pos.x;
				lastY = pos.y;
				const color = (e.button === 2) ? secondaryColor : primaryColor;

				if (activeTool === 'rect-select') {
					if (selectionBounds && pos.x >= selectionBounds.x && pos.x <= selectionBounds.x + selectionBounds.w && pos.y >= selectionBounds.y && pos.y <= selectionBounds.y + selectionBounds.h) {
						isDraggingSelection = true;
						dragSelectionOffset.x = pos.x - selectionBounds.x;
						dragSelectionOffset.y = pos.y - selectionBounds.y;
						isDrawing = true;
						return;
					} else {
						commitSelection();
					}
				} else {
					commitSelection();
				}

				isDrawing = true;

				if (activeTool === 'pencil') {
					ctx.strokeStyle = color;
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(pos.x, pos.y);
					ctx.lineTo(pos.x, pos.y);
					ctx.stroke();
				} else if (activeTool === 'brush') {
					drawBrushStroke(pos.x, pos.y, pos.x, pos.y, color);
				} else if (activeTool === 'eraser') {
					ctx.fillStyle = secondaryColor;
					ctx.fillRect(pos.x - eraserSize / 2, pos.y - eraserSize / 2, eraserSize, eraserSize);
				} else if (activeTool === 'airbrush') {
					sprayAirbrush(pos.x, pos.y, color);
					airbrushInterval = setInterval(() => {
						sprayAirbrush(lastX, lastY, color);
					}, 25);
				} else if (activeTool === 'fill') {
					floodFill(pos.x, pos.y, color);
					pushState();
				} else if (activeTool === 'picker') {
					const pixel = ctx.getImageData(pos.x, pos.y, 1, 1).data;
					const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
					if (e.button === 2) secondaryColor = hex;
					else primaryColor = hex;
					updateColorBoxes();
				} else if (activeTool === 'magnifier') {
					if (e.button === 0) {
						setZoom(zoomLevel >= 8 ? 1 : zoomLevel * 2);
					} else {
						setZoom(1);
					}
				} else if (activeTool === 'text') {
					spawnTextEditor(pos.x, pos.y, color);
				} else if (activeTool === 'curve') {
					if (curveStep === 0) {
						curveStart = { x: pos.x, y: pos.y };
						curveStep = 1;
					} else if (curveStep === 2) {
						curveControl1 = { x: pos.x, y: pos.y };
					}
				} else if (activeTool === 'polygon') {
					if (!isBuildingPolygon) {
						isBuildingPolygon = true;
						polygonPoints = [{ x: pos.x, y: pos.y }];
					} else {
						polygonPoints.push({ x: pos.x, y: pos.y });
					}
				} else if (activeTool === 'free-select') {
					freehandSelectionPath = [{ x: pos.x, y: pos.y }];
				}
			});

			overlayCanvas.addEventListener('mouseup', (e) => {
				if (!isDrawing) return;
				const pos = getCanvasPos(e);
				const color = (e.button === 2) ? secondaryColor : primaryColor;

				if (airbrushInterval) {
					clearInterval(airbrushInterval);
					airbrushInterval = null;
				}

				if (['pencil', 'brush', 'eraser', 'airbrush'].includes(activeTool)) {
					isDrawing = false;
					pushState();
					return;
				}

				if (activeTool === 'line') {
					ctx.drawImage(overlayCanvas, 0, 0);
					oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
					isDrawing = false;
					pushState();
				} else if (activeTool === 'curve') {
					if (curveStep === 1) {
						curveEnd = { x: pos.x, y: pos.y };
						curveStep = 2;
						isDrawing = false;
					} else if (curveStep === 2) {
						curveStep = 3;
						isDrawing = false;
					} else if (curveStep === 3) {
						ctx.drawImage(overlayCanvas, 0, 0);
						oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
						curveStep = 0;
						isDrawing = false;
						pushState();
					}
				} else if (['rectangle', 'round-rect', 'ellipse'].includes(activeTool)) {
					ctx.drawImage(overlayCanvas, 0, 0);
					oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
					isDrawing = false;
					if (sbSel) sbSel.textContent = '';
					pushState();
				} else if (activeTool === 'polygon') {
					isDrawing = false;
					if (e.detail >= 2 || (polygonPoints.length > 2 && Math.hypot(pos.x - polygonPoints[0].x, pos.y - polygonPoints[0].y) < 6)) {
						oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
						ctx.strokeStyle = color;
						ctx.fillStyle = (e.button === 2) ? primaryColor : secondaryColor;
						ctx.lineWidth = lineWidth;
						ctx.beginPath();
						ctx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
						for (let i = 1; i < polygonPoints.length; i++) {
							ctx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
						}
						ctx.closePath();
						if (shapeFillMode === 'fill' || shapeFillMode === 'fill-outline') ctx.fill();
						if (shapeFillMode === 'outline' || shapeFillMode === 'fill-outline') ctx.stroke();
						isBuildingPolygon = false;
						polygonPoints = [];
						pushState();
					}
				} else if (activeTool === 'rect-select') {
					isDrawing = false;
					if (isDraggingSelection) {
						isDraggingSelection = false;
					} else {
						const minX = Math.min(startX, pos.x);
						const minY = Math.min(startY, pos.y);
						const w = Math.abs(pos.x - startX);
						const h = Math.abs(pos.y - startY);

						if (w > 2 && h > 2) {
							selectionBounds = { x: minX, y: minY, w, h };
							selectionData = ctx.getImageData(minX, minY, w, h);
							ctx.fillStyle = secondaryColor;
							ctx.fillRect(minX, minY, w, h);

							oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
							oCtx.putImageData(selectionData, minX, minY);
							oCtx.strokeStyle = '#000';
							oCtx.setLineDash([4, 4]);
							oCtx.strokeRect(minX, minY, w, h);
							oCtx.setLineDash([]);
						} else {
							commitSelection();
						}
					}
				} else if (activeTool === 'free-select') {
					isDrawing = false;
					oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
				}
			});

			overlayCanvas.addEventListener('contextmenu', e => e.preventDefault());

			function spawnTextEditor(posX, posY, color) {
				const existingText = win.querySelector('.paint-text-textarea');
				if (existingText) existingText.remove();

				const ta = document.createElement('textarea');
				ta.className = 'paint-text-textarea';
				ta.style.left = `${posX}px`;
				ta.style.top = `${posY}px`;
				ta.style.color = color;
				ta.style.font = '14px Tahoma, sans-serif';

				wrapper.appendChild(ta);
				ta.focus();

				const finishText = () => {
					const text = ta.value;
					if (text) {
						ctx.fillStyle = color;
						ctx.font = '14px Tahoma, sans-serif';
						const lines = text.split('\n');
						lines.forEach((line, idx) => {
							ctx.fillText(line, posX + 2, posY + 14 + idx * 16);
						});
						pushState();
					}
					ta.remove();
				};

				ta.addEventListener('blur', finishText);
				ta.addEventListener('keydown', (e) => {
					if (e.key === 'Escape') ta.remove();
				});
			}

			const resizeCanvas = (newW, newH) => {
				const temp = ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
				mainCanvas.width = newW;
				mainCanvas.height = newH;
				overlayCanvas.width = newW;
				overlayCanvas.height = newH;
				setZoom(zoomLevel);
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
					const nW = Math.max(50, Math.round(startW + (ev.clientX - sX) / zoomLevel));
					const nH = Math.max(50, Math.round(startH + (ev.clientY - sY) / zoomLevel));
					wrapper.style.width = `${nW * zoomLevel}px`;
					wrapper.style.height = `${nH * zoomLevel}px`;
					sbDim.textContent = `${nW}x${nH}px`;
				};

				const onUp = (ev) => {
					if (!isResizingCanvas) return;
					isResizingCanvas = false;
					const nW = Math.max(50, Math.round(startW + (ev.clientX - sX) / zoomLevel));
					const nH = Math.max(50, Math.round(startH + (ev.clientY - sY) / zoomLevel));
					resizeCanvas(nW, nH);
					document.removeEventListener('mousemove', onMove);
					document.removeEventListener('mouseup', onUp);
				};

				document.addEventListener('mousemove', onMove);
				document.addEventListener('mouseup', onUp);
			});

			function loadImageDataUrl(dataUrl) {
				const img = new Image();
				img.onload = () => {
					resizeCanvas(img.width, img.height);
					ctx.drawImage(img, 0, 0);
					undoStack = [];
					redoStack = [];
					undoStack.push(ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height));
					isDirty = false;
					updateWindowTitle();
				};
				img.src = dataUrl;
			}

			if (currentFile && currentFile.content) {
				loadImageDataUrl(currentFile.content);
			}

			function saveDocument() {
				commitSelection();
				if (!currentFile) {
					saveDocumentAs();
					return;
				}
				const dataUrl = mainCanvas.toDataURL('image/png');
				currentFile.write(dataUrl);
				currentFile.icon = '../assets/images/desk/icons/Paint.webp';
				fs.save();
				isDirty = false;
				updateWindowTitle();
				if (typeof refreshUI === 'function') refreshUI();
				if (window.SettingsApp && window.SettingsApp.playSound) window.SettingsApp.playSound('asterisk');
			}

			function saveDocumentAs() {
				commitSelection();
				if (window.FileDialog) {
					window.FileDialog.open({
						mode: 'save',
						title: 'Save As',
						defaultFolder: currentFile ? (currentFile.parent || fs.root) : fs.root,
						defaultName: currentFile ? currentFile.name : 'Drawing.png',
						filterTypes: [
							{ label: 'PNG (*.png)', ext: '.png', mime: 'image/png' },
							{ label: 'Bitmap 24-bit (*.bmp)', ext: '.bmp', mime: 'image/bmp' },
							{ label: 'JPEG Image (*.jpg;*.jpeg)', ext: '.jpg', mime: 'image/jpeg' }
						],
						onConfirm: (folder, fileName, existingFile, filter) => {
							const format = filter.ext === '.jpg' ? 'image/jpeg' : 'image/png';
							const dataUrl = mainCanvas.toDataURL(format);

							if (existingFile) {
								existingFile.write(dataUrl);
								existingFile.icon = '../assets/images/desk/icons/Paint.webp';
								currentFile = existingFile;
							} else {
								const newFile = fs.create('File', folder.getFullPath(), fileName);
								newFile.icon = '../assets/images/desk/icons/Paint.webp';
								newFile.write(dataUrl);
								currentFile = newFile;
							}
							fs.save();
							isDirty = false;
							updateWindowTitle();
							if (typeof refreshUI === 'function') refreshUI();
							if (window.SettingsApp && window.SettingsApp.playSound) window.SettingsApp.playSound('asterisk');
						}
					});
				}
			}

			function openDocumentDialog() {
				if (window.FileDialog) {
					window.FileDialog.open({
						mode: 'open',
						title: 'Open',
						defaultFolder: currentFile ? (currentFile.parent || fs.root) : fs.root,
						filterTypes: [
							{ label: 'All Picture Files (*.png;*.bmp;*.jpg;*.jpeg;*.webp)', ext: '.png;.bmp;.jpg;.jpeg;.webp', mime: 'image/*' },
							{ label: 'PNG (*.png)', ext: '.png', mime: 'image/png' },
							{ label: 'Bitmap (*.bmp)', ext: '.bmp', mime: 'image/bmp' },
							{ label: 'All Files (*.*)', ext: '.*', mime: '*/*' }
						],
						onConfirm: (folder, fileName, fileObj) => {
							if (fileObj && fileObj.content) {
								currentFile = fileObj;
								loadImageDataUrl(fileObj.content);
							}
						}
					});
				}
			}

			function promptFlipRotate() {
				commitSelection();
				showXPDialog('Flip and Rotate', `
					<div style="display:flex;flex-direction:column;gap:8px;font-size:11px;">
						<label><input type="radio" name="paint-flip" value="horiz" checked> Flip horizontal</label>
						<label><input type="radio" name="paint-flip" value="vert"> Flip vertical</label>
						<label><input type="radio" name="paint-flip" value="rot90"> Rotate by angle 90°</label>
						<label><input type="radio" name="paint-flip" value="rot180"> Rotate by angle 180°</label>
						<label><input type="radio" name="paint-flip" value="rot270"> Rotate by angle 270°</label>
					</div>
				`, 'question', {
					buttons: ['OK', 'Cancel'],
					callback: (res) => {
						if (res !== 'OK') return;
						const sel = document.querySelector('input[name="paint-flip"]:checked');
						if (!sel) return;
						const val = sel.value;

						const tempC = document.createElement('canvas');
						tempC.width = mainCanvas.width;
						tempC.height = mainCanvas.height;
						const tCtx = tempC.getContext('2d');
						tCtx.drawImage(mainCanvas, 0, 0);

						if (val === 'horiz') {
							ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
							ctx.save();
							ctx.scale(-1, 1);
							ctx.drawImage(tempC, -mainCanvas.width, 0);
							ctx.restore();
						} else if (val === 'vert') {
							ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
							ctx.save();
							ctx.scale(1, -1);
							ctx.drawImage(tempC, 0, -mainCanvas.height);
							ctx.restore();
						} else if (val === 'rot90' || val === 'rot270') {
							const nw = mainCanvas.height;
							const nh = mainCanvas.width;
							mainCanvas.width = nw;
							mainCanvas.height = nh;
							overlayCanvas.width = nw;
							overlayCanvas.height = nh;
							setZoom(zoomLevel);
							ctx.save();
							if (val === 'rot90') {
								ctx.translate(nw, 0);
								ctx.rotate(Math.PI / 2);
							} else {
								ctx.translate(0, nh);
								ctx.rotate(-Math.PI / 2);
							}
							ctx.drawImage(tempC, 0, 0);
							ctx.restore();
						} else if (val === 'rot180') {
							ctx.save();
							ctx.translate(mainCanvas.width, mainCanvas.height);
							ctx.rotate(Math.PI);
							ctx.drawImage(tempC, 0, 0);
							ctx.restore();
						}
						pushState();
					}
				});
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
									commitSelection();
									ctx.fillStyle = '#ffffff';
									ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
									currentFile = null;
									isDirty = false;
									updateWindowTitle();
									pushState();
								}
							},
							{
								label: 'Open...',
								shortcut: 'Ctrl+O',
								action: openDocumentDialog
							},
							{
								label: 'Save',
								shortcut: 'Ctrl+S',
								action: saveDocument
							},
							{
								label: 'Save As...',
								action: saveDocumentAs
							},
							{ separator: true },
							{
								label: 'Save to Local Disk (Download)...',
								action: () => {
									commitSelection();
									const dataUrl = mainCanvas.toDataURL('image/png');
									const virtualTemp = new File(currentFile ? currentFile.name : 'Drawing.png', null, dataUrl);
									if (typeof downloadFileSystemElement === 'function') {
										downloadFileSystemElement(virtualTemp);
									}
								}
							},
							{ separator: true },
							{
								label: 'Set as Background (Tiled)',
								action: () => {
									commitSelection();
									const dataUrl = mainCanvas.toDataURL('image/png');
									if (typeof setImageAsWallpaper === 'function') setImageAsWallpaper(dataUrl, 'tile');
								}
							},
							{
								label: 'Set as Background (Centered)',
								action: () => {
									commitSelection();
									const dataUrl = mainCanvas.toDataURL('image/png');
									if (typeof setImageAsWallpaper === 'function') setImageAsWallpaper(dataUrl, 'center');
								}
							},
							{
								label: 'Set as Background (Stretched)',
								action: () => {
									commitSelection();
									const dataUrl = mainCanvas.toDataURL('image/png');
									if (typeof setImageAsWallpaper === 'function') setImageAsWallpaper(dataUrl, 'cover');
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
										updateWindowTitle();
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
										updateWindowTitle();
									}
								}
							},
							{ separator: true },
							{
								label: 'Cut',
								shortcut: 'Ctrl+X',
								disabled: !selectionData,
								action: () => {
									if (selectionData) {
										oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
										pushState();
									}
								}
							},
							{
								label: 'Copy',
								shortcut: 'Ctrl+C',
								disabled: !selectionData,
								action: () => {}
							},
							{
								label: 'Paste',
								shortcut: 'Ctrl+V',
								disabled: !selectionData,
								action: () => {
									if (selectionData) {
										oCtx.putImageData(selectionData, 10, 10);
										selectionBounds = { x: 10, y: 10, w: selectionData.width, h: selectionData.height };
									}
								}
							},
							{
								label: 'Clear Selection',
								shortcut: 'Del',
								disabled: !selectionData,
								action: () => {
									oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
									selectionData = null;
									selectionBounds = null;
								}
							},
							{
								label: 'Select All',
								shortcut: 'Ctrl+A',
								action: () => {
									selectionBounds = { x: 0, y: 0, w: mainCanvas.width, h: mainCanvas.height };
									selectionData = ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
									oCtx.strokeStyle = '#000';
									oCtx.setLineDash([4, 4]);
									oCtx.strokeRect(0, 0, mainCanvas.width, mainCanvas.height);
									oCtx.setLineDash([]);
								}
							}
						];
					} else if (menuType === 'view') {
						items = [
							{
								label: 'Zoom',
								submenu: [
									{ label: 'Normal Size (100%)', radio: zoomLevel === 1, action: () => setZoom(1) },
									{ label: 'Large Size (400%)', radio: zoomLevel === 4, action: () => setZoom(4) },
									{ label: 'Custom 200%', radio: zoomLevel === 2, action: () => setZoom(2) },
									{ label: 'Custom 800%', radio: zoomLevel === 8, action: () => setZoom(8) }
								]
							}
						];
					} else if (menuType === 'image') {
						items = [
							{
								label: 'Flip / Rotate...',
								shortcut: 'Ctrl+R',
								action: promptFlipRotate
							},
							{
								label: 'Invert Colors',
								shortcut: 'Ctrl+I',
								action: () => {
									commitSelection();
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
									commitSelection();
									ctx.fillStyle = secondaryColor;
									ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
									pushState();
								}
							},
							{
								label: 'Attributes...',
								shortcut: 'Ctrl+E',
								action: () => {
									commitSelection();
									const w = prompt('Width in pixels:', String(mainCanvas.width));
									const h = prompt('Height in pixels:', String(mainCanvas.height));
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
