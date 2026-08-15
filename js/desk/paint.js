(function () {
	const PALETTE_COLORS = [
		'#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
		'#808040', '#004040', '#0080ff', '#004080', '#8000ff', '#804000',
		'#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
		'#ffff80', '#00ff80', '#80ffff', '#8080ff', '#ff0080', '#ff8040'
	];

	let customColors = [
		'#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff',
		'#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'
	];

	let paintClipboard = null;

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
								<canvas id="paint-grid-canvas" class="paint-grid-canvas" width="560" height="380" style="display:none;"></canvas>
								<div class="paint-resize-handle paint-handle-r"></div>
								<div class="paint-resize-handle paint-handle-b"></div>
								<div class="paint-resize-handle paint-handle-br"></div>
							</div>
						</div>
					</div>

					<div class="paint-bottom-panel" id="paint-bottom-panel">
						<div class="paint-color-box">
							<div class="paint-current-colors" id="paint-current-colors" title="Double-click to edit colors">
								<div class="paint-color-sec" id="paint-sec-color-box"></div>
								<div class="paint-color-pri" id="paint-pri-color-box"></div>
							</div>
							<div class="paint-palette-grid" id="paint-palette-grid"></div>
						</div>
					</div>

					<div class="paint-statusbar" id="paint-statusbar">
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
			const gridCanvas = win.querySelector('#paint-grid-canvas');
			const ctx = mainCanvas.getContext('2d', { willReadFrequently: true });
			const oCtx = overlayCanvas.getContext('2d', { willReadFrequently: true });
			const gCtx = gridCanvas.getContext('2d');
			const wrapper = win.querySelector('#paint-canvas-wrapper');
			const viewport = win.querySelector('#paint-viewport');
			const toolbox = win.querySelector('#paint-toolbox');
			const bottomPanel = win.querySelector('#paint-bottom-panel');
			const statusbar = win.querySelector('#paint-statusbar');

			const priBox = win.querySelector('#paint-pri-color-box');
			const secBox = win.querySelector('#paint-sec-color-box');
			const currentColorsBox = win.querySelector('#paint-current-colors');
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
			let showGrid = false;

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
			let selectionMaskCanvas = null;
			let isDraggingSelection = false;
			let dragSelectionOffset = { x: 0, y: 0 };

			let freehandSelectionPath = [];

			let activeTextBox = null;
			let activeTextToolbar = null;
			let textFontFamily = 'Tahoma';
			let textFontSize = 14;
			let textBold = false;
			let textItalic = false;
			let textUnderline = false;

			let undoStack = [];
			let redoStack = [];

			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

			function updateWindowTitle() {
				const name = currentFile ? currentFile.name : 'untitled';
				titleSpan.textContent = `${name}${isDirty ? ' *' : ''} - Paint`;
				if (window.Taskbar) {
					window.Taskbar.updateWindowButton(win.id, `${name}${isDirty ? ' *' : ''} - Paint`, '../assets/images/desk/icons/Paint.webp');
				}
			}

			const pushState = () => {
				if (undoStack.length >= 25) undoStack.shift();
				undoStack.push(ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height));
				redoStack = [];
				isDirty = true;
				updateWindowTitle();
			};

			undoStack.push(ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height));

			win.beforeClose = (forceClose) => {
				commitSelection();
				commitText();
				if (!isDirty) return true;
				const name = currentFile ? currentFile.name : 'untitled';
				showXPDialog('Paint', `Save changes to ${name}?`, 'question', {
					buttons: ['Yes', 'No', 'Cancel'],
					callback: (res) => {
						if (res === 'Yes') {
							saveDocument((saved) => {
								if (saved) forceClose();
							});
						} else if (res === 'No') {
							forceClose();
						}
					}
				});
				return false;
			};

			const updateColorBoxes = () => {
				priBox.style.backgroundColor = primaryColor;
				secBox.style.backgroundColor = secondaryColor;
			};
			updateColorBoxes();

			function renderPalette() {
				paletteGrid.innerHTML = '';
				PALETTE_COLORS.forEach((c, idx) => {
					const swatch = document.createElement('div');
					swatch.className = 'paint-swatch';
					swatch.style.backgroundColor = c;
					swatch.dataset.index = idx;
					swatch.addEventListener('mousedown', (e) => {
						e.preventDefault();
						if (e.button === 0) {
							primaryColor = c;
						} else if (e.button === 2) {
							secondaryColor = c;
						}
						updateColorBoxes();
					});
					swatch.addEventListener('dblclick', () => {
						openEditColorsDialog(c, (newColor) => {
							primaryColor = newColor;
							updateColorBoxes();
						});
					});
					swatch.addEventListener('contextmenu', e => e.preventDefault());
					paletteGrid.appendChild(swatch);
				});
			}
			renderPalette();

			currentColorsBox.addEventListener('dblclick', () => {
				openEditColorsDialog(primaryColor, (newColor) => {
					primaryColor = newColor;
					updateColorBoxes();
				});
			});

			const hexToRgb = (hex) => {
				const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
				hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
				const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
				return result ? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
				} : { r: 0, g: 0, b: 0 };
			};

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
				} else if (activeTool === 'rect-select' || activeTool === 'free-select' || activeTool === 'text') {
					[
						{ trans: false, label: 'Opaque' },
						{ trans: true, label: 'Trans' }
					].forEach(o => {
						const opt = document.createElement('div');
						opt.className = `paint-opt-shape ${isTransparentSelection === o.trans ? 'selected' : ''}`;
						opt.title = o.trans ? 'Transparent Selection' : 'Opaque Selection';
						opt.innerHTML = `<div style="font-size:10px;text-align:center;">${o.label}</div>`;
						opt.addEventListener('click', () => {
							isTransparentSelection = o.trans;
							renderToolOptions();
							if (selectionData && selectionBounds) {
								drawSelectionToOverlay();
							}
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

			function drawSelectionToOverlay() {
				if (!selectionData || !selectionBounds) return;
				oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

				const tempCanvas = document.createElement('canvas');
				tempCanvas.width = selectionData.width;
				tempCanvas.height = selectionData.height;
				const tCtx = tempCanvas.getContext('2d');

				if (isTransparentSelection) {
					const cloned = new ImageData(new Uint8ClampedArray(selectionData.data), selectionData.width, selectionData.height);
					const d = cloned.data;
					const secRGB = hexToRgb(secondaryColor);
					for (let i = 0; i < d.length; i += 4) {
						if (d[i] === secRGB.r && d[i + 1] === secRGB.g && d[i + 2] === secRGB.b) {
							d[i + 3] = 0;
						}
					}
					tCtx.putImageData(cloned, 0, 0);
				} else {
					tCtx.putImageData(selectionData, 0, 0);
				}

				oCtx.drawImage(tempCanvas, selectionBounds.x, selectionBounds.y);
				oCtx.strokeStyle = '#000000';
				oCtx.setLineDash([4, 4]);
				oCtx.strokeRect(selectionBounds.x, selectionBounds.y, selectionBounds.w, selectionBounds.h);
				oCtx.setLineDash([]);
			}

			function commitSelection() {
				if (selectionData && selectionBounds) {
					oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
					const tempCanvas = document.createElement('canvas');
					tempCanvas.width = selectionData.width;
					tempCanvas.height = selectionData.height;
					const tCtx = tempCanvas.getContext('2d');

					if (isTransparentSelection) {
						const cloned = new ImageData(new Uint8ClampedArray(selectionData.data), selectionData.width, selectionData.height);
						const d = cloned.data;
						const secRGB = hexToRgb(secondaryColor);
						for (let i = 0; i < d.length; i += 4) {
							if (d[i] === secRGB.r && d[i + 1] === secRGB.g && d[i + 2] === secRGB.b) {
								d[i + 3] = 0;
							}
						}
						tCtx.putImageData(cloned, 0, 0);
					} else {
						tCtx.putImageData(selectionData, 0, 0);
					}

					ctx.drawImage(tempCanvas, selectionBounds.x, selectionBounds.y);
					selectionData = null;
					selectionBounds = null;
					selectionMaskCanvas = null;
					isDraggingSelection = false;
					if (sbSel) sbSel.textContent = '';
					pushState();
				}
			}

			function commitText() {
				if (!activeTextBox) return;
				const ta = activeTextBox.querySelector('textarea');
				const text = ta.value;
				const rect = {
					x: parseInt(activeTextBox.style.left, 10) || 0,
					y: parseInt(activeTextBox.style.top, 10) || 0,
					w: activeTextBox.offsetWidth,
					h: activeTextBox.offsetHeight
				};

				if (text.trim().length > 0) {
					if (!isTransparentSelection) {
						ctx.fillStyle = secondaryColor;
						ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
					}

					ctx.fillStyle = primaryColor;
					let fontStr = '';
					if (textItalic) fontStr += 'italic ';
					if (textBold) fontStr += 'bold ';
					fontStr += `${textFontSize}px ${textFontFamily}, sans-serif`;
					ctx.font = fontStr;
					ctx.textBaseline = 'top';

					const lines = text.split('\n');
					const lineHeight = Math.round(textFontSize * 1.25);
					lines.forEach((line, index) => {
						const lineY = rect.y + 2 + index * lineHeight;
						ctx.fillText(line, rect.x + 2, lineY);
						if (textUnderline) {
							const textW = ctx.measureText(line).width;
							ctx.fillRect(rect.x + 2, lineY + textFontSize, textW, 1);
						}
					});
					pushState();
				}

				activeTextBox.remove();
				activeTextBox = null;
				if (activeTextToolbar) {
					activeTextToolbar.remove();
					activeTextToolbar = null;
				}
			}

			function renderGrid() {
				if (!showGrid || zoomLevel < 4) {
					gridCanvas.style.display = 'none';
					return;
				}
				gridCanvas.style.display = 'block';
				gridCanvas.width = mainCanvas.width * zoomLevel;
				gridCanvas.height = mainCanvas.height * zoomLevel;
				gridCanvas.style.width = `${mainCanvas.width * zoomLevel}px`;
				gridCanvas.style.height = `${mainCanvas.height * zoomLevel}px`;
				gCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
				gCtx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
				gCtx.lineWidth = 1;

				gCtx.beginPath();
				for (let x = 0; x <= mainCanvas.width; x++) {
					const px = x * zoomLevel - 0.5;
					gCtx.moveTo(px, 0);
					gCtx.lineTo(px, gridCanvas.height);
				}
				for (let y = 0; y <= mainCanvas.height; y++) {
					const py = y * zoomLevel - 0.5;
					gCtx.moveTo(0, py);
					gCtx.lineTo(gridCanvas.width, py);
				}
				gCtx.stroke();
			}

			function setZoom(factor, centerX = null, centerY = null) {
				zoomLevel = factor;
				mainCanvas.style.width = `${mainCanvas.width * zoomLevel}px`;
				mainCanvas.style.height = `${mainCanvas.height * zoomLevel}px`;
				overlayCanvas.style.width = `${overlayCanvas.width * zoomLevel}px`;
				overlayCanvas.style.height = `${overlayCanvas.height * zoomLevel}px`;
				wrapper.style.width = `${mainCanvas.width * zoomLevel}px`;
				wrapper.style.height = `${mainCanvas.height * zoomLevel}px`;

				renderGrid();

				if (centerX !== null && centerY !== null) {
					viewport.scrollLeft = centerX * zoomLevel - viewport.clientWidth / 2;
					viewport.scrollTop = centerY * zoomLevel - viewport.clientHeight / 2;
				}
			}

			win.querySelectorAll('.paint-tool-btn').forEach(btn => {
				btn.addEventListener('click', () => {
					commitSelection();
					commitText();
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

			const colorEraser = (cx, cy) => {
				const half = Math.floor(eraserSize / 2);
				const x0 = Math.max(0, cx - half);
				const y0 = Math.max(0, cy - half);
				const w = Math.min(mainCanvas.width - x0, eraserSize);
				const h = Math.min(mainCanvas.height - y0, eraserSize);

				if (w <= 0 || h <= 0) return;

				const imgData = ctx.getImageData(x0, y0, w, h);
				const d = imgData.data;
				const targetRGB = hexToRgb(primaryColor);
				const replaceRGB = hexToRgb(secondaryColor);

				for (let i = 0; i < d.length; i += 4) {
					if (Math.abs(d[i] - targetRGB.r) < 5 && Math.abs(d[i + 1] - targetRGB.g) < 5 && Math.abs(d[i + 2] - targetRGB.b) < 5) {
						d[i] = replaceRGB.r;
						d[i + 1] = replaceRGB.g;
						d[i + 2] = replaceRGB.b;
					}
				}
				ctx.putImageData(imgData, x0, y0);
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

			const snapAngle = (x0, y0, x1, y1) => {
				const dx = x1 - x0;
				const dy = y1 - y0;
				const angle = Math.atan2(dy, dx);
				const snapped = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
				const dist = Math.hypot(dx, dy);
				return {
					x: Math.round(x0 + Math.cos(snapped) * dist),
					y: Math.round(y0 + Math.sin(snapped) * dist)
				};
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
				let pos = getCanvasPos(e);
				sbCoords.textContent = `${pos.x}, ${pos.y}px`;

				if (!isDrawing) {
					if (activeTool === 'magnifier') {
						oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
						const vW = Math.round(viewport.clientWidth / (zoomLevel >= 8 ? 1 : zoomLevel * 2));
						const vH = Math.round(viewport.clientHeight / (zoomLevel >= 8 ? 1 : zoomLevel * 2));
						oCtx.strokeStyle = '#000000';
						oCtx.setLineDash([2, 2]);
						oCtx.strokeRect(pos.x - vW / 2, pos.y - vH / 2, vW, vH);
						oCtx.setLineDash([]);
					}
					return;
				}

				if (e.shiftKey && ['line', 'rectangle', 'round-rect', 'ellipse'].includes(activeTool)) {
					if (activeTool === 'line') {
						pos = snapAngle(startX, startY, pos.x, pos.y);
					} else {
						const maxDim = Math.max(Math.abs(pos.x - startX), Math.abs(pos.y - startY));
						pos.x = startX + (pos.x >= startX ? maxDim : -maxDim);
						pos.y = startY + (pos.y >= startY ? maxDim : -maxDim);
					}
				}

				const isRightClick = e.buttons === 2;
				const color = isRightClick ? secondaryColor : primaryColor;

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
					if (isRightClick) {
						colorEraser(pos.x, pos.y);
					} else {
						ctx.fillStyle = secondaryColor;
						ctx.fillRect(pos.x - eraserSize / 2, pos.y - eraserSize / 2, eraserSize, eraserSize);
					}
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
					if (sbSel) sbSel.textContent = `${Math.abs(pos.x - startX)}x${Math.abs(pos.y - startY)}px`;
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
				} else if (activeTool === 'rectangle') {
					oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
					const w = pos.x - startX;
					const h = pos.y - startY;
					oCtx.strokeStyle = color;
					oCtx.fillStyle = isRightClick ? primaryColor : secondaryColor;
					oCtx.lineWidth = lineWidth;

					if (shapeFillMode === 'fill' || shapeFillMode === 'fill-outline') oCtx.fillRect(startX, startY, w, h);
					if (shapeFillMode === 'outline' || shapeFillMode === 'fill-outline') oCtx.strokeRect(startX, startY, w, h);
					if (sbSel) sbSel.textContent = `${Math.abs(w)}x${Math.abs(h)}px`;
				} else if (activeTool === 'round-rect') {
					oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
					const w = pos.x - startX;
					const h = pos.y - startY;
					const radius = Math.min(16, Math.abs(w) / 2, Math.abs(h) / 2);
					oCtx.strokeStyle = color;
					oCtx.fillStyle = isRightClick ? primaryColor : secondaryColor;
					oCtx.lineWidth = lineWidth;

					oCtx.beginPath();
					oCtx.roundRect(startX, startY, w, h, radius);
					if (shapeFillMode === 'fill' || shapeFillMode === 'fill-outline') oCtx.fill();
					if (shapeFillMode === 'outline' || shapeFillMode === 'fill-outline') oCtx.stroke();
					if (sbSel) sbSel.textContent = `${Math.abs(w)}x${Math.abs(h)}px`;
				} else if (activeTool === 'ellipse') {
					oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
					const rx = Math.abs(pos.x - startX) / 2;
					const ry = Math.abs(pos.y - startY) / 2;
					const cx = Math.min(startX, pos.x) + rx;
					const cy = Math.min(startY, pos.y) + ry;

					oCtx.strokeStyle = color;
					oCtx.fillStyle = isRightClick ? primaryColor : secondaryColor;
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
						selectionBounds.x = pos.x - dragSelectionOffset.x;
						selectionBounds.y = pos.y - dragSelectionOffset.y;
						drawSelectionToOverlay();
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
				const isRightClick = e.button === 2;
				const color = isRightClick ? secondaryColor : primaryColor;

				if (activeTool === 'rect-select' || activeTool === 'free-select') {
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

				if (activeTool !== 'text') {
					commitText();
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
					if (isRightClick) {
						colorEraser(pos.x, pos.y);
					} else {
						ctx.fillStyle = secondaryColor;
						ctx.fillRect(pos.x - eraserSize / 2, pos.y - eraserSize / 2, eraserSize, eraserSize);
					}
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
					if (isRightClick) secondaryColor = hex;
					else primaryColor = hex;
					updateColorBoxes();
				} else if (activeTool === 'magnifier') {
					if (e.button === 0) {
						setZoom(zoomLevel >= 8 ? 1 : zoomLevel * 2, pos.x, pos.y);
					} else {
						setZoom(1);
					}
				} else if (activeTool === 'text') {
					spawnTextEditor(pos.x, pos.y);
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
				let pos = getCanvasPos(e);
				const isRightClick = e.button === 2;
				const color = isRightClick ? secondaryColor : primaryColor;

				if (airbrushInterval) {
					clearInterval(airbrushInterval);
					airbrushInterval = null;
				}

				if (e.shiftKey && ['line', 'rectangle', 'round-rect', 'ellipse'].includes(activeTool)) {
					if (activeTool === 'line') {
						pos = snapAngle(startX, startY, pos.x, pos.y);
					} else {
						const maxDim = Math.max(Math.abs(pos.x - startX), Math.abs(pos.y - startY));
						pos.x = startX + (pos.x >= startX ? maxDim : -maxDim);
						pos.y = startY + (pos.y >= startY ? maxDim : -maxDim);
					}
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
					if (sbSel) sbSel.textContent = '';
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
					if (e.detail >= 2 || (polygonPoints.length > 2 && Math.hypot(pos.x - polygonPoints[0].x, pos.y - polygonPoints[0].y) < 8)) {
						oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
						ctx.strokeStyle = color;
						ctx.fillStyle = isRightClick ? primaryColor : secondaryColor;
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
					if (!isDraggingSelection) {
						const minX = Math.min(startX, pos.x);
						const minY = Math.min(startY, pos.y);
						const w = Math.abs(pos.x - startX);
						const h = Math.abs(pos.y - startY);

						if (w > 2 && h > 2) {
							selectionBounds = { x: minX, y: minY, w, h };
							selectionData = ctx.getImageData(minX, minY, w, h);
							ctx.fillStyle = secondaryColor;
							ctx.fillRect(minX, minY, w, h);
							drawSelectionToOverlay();
						} else {
							commitSelection();
						}
					}
				} else if (activeTool === 'free-select') {
					isDrawing = false;
					oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
					if (freehandSelectionPath.length > 4) {
						let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
						freehandSelectionPath.forEach(pt => {
							minX = Math.min(minX, pt.x);
							minY = Math.min(minY, pt.y);
							maxX = Math.max(maxX, pt.x);
							maxY = Math.max(maxY, pt.y);
						});
						const w = Math.max(1, maxX - minX);
						const h = Math.max(1, maxY - minY);

						const maskC = document.createElement('canvas');
						maskC.width = w;
						maskC.height = h;
						const mCtx = maskC.getContext('2d');
						mCtx.fillStyle = '#000000';
						mCtx.beginPath();
						mCtx.moveTo(freehandSelectionPath[0].x - minX, freehandSelectionPath[0].y - minY);
						for (let i = 1; i < freehandSelectionPath.length; i++) {
							mCtx.lineTo(freehandSelectionPath[i].x - minX, freehandSelectionPath[i].y - minY);
						}
						mCtx.closePath();
						mCtx.fill();

						const rawImg = ctx.getImageData(minX, minY, w, h);
						const maskImg = mCtx.getImageData(0, 0, w, h);
						for (let i = 0; i < rawImg.data.length; i += 4) {
							if (maskImg.data[i + 3] === 0) {
								rawImg.data[i + 3] = 0;
							}
						}

						ctx.save();
						ctx.fillStyle = secondaryColor;
						ctx.beginPath();
						ctx.moveTo(freehandSelectionPath[0].x, freehandSelectionPath[0].y);
						for (let i = 1; i < freehandSelectionPath.length; i++) {
							ctx.lineTo(freehandSelectionPath[i].x, freehandSelectionPath[i].y);
						}
						ctx.closePath();
						ctx.fill();
						ctx.restore();

						selectionBounds = { x: minX, y: minY, w, h };
						selectionData = rawImg;
						drawSelectionToOverlay();
					}
				}
			});

			overlayCanvas.addEventListener('contextmenu', e => e.preventDefault());

			function spawnTextEditor(posX, posY) {
				commitText();

				activeTextBox = document.createElement('div');
				activeTextBox.className = 'paint-text-box';
				activeTextBox.style.left = `${posX}px`;
				activeTextBox.style.top = `${posY}px`;
				activeTextBox.style.width = '180px';
				activeTextBox.style.height = '60px';

				const ta = document.createElement('textarea');
				ta.spellcheck = false;
				applyTextStyle(ta);
				activeTextBox.appendChild(ta);

				wrapper.appendChild(activeTextBox);
				ta.focus();

				spawnTextToolbar();

				let isDraggingText = false;
				let textDragOffset = { x: 0, y: 0 };
				activeTextBox.addEventListener('mousedown', (ev) => {
					if (ev.target === activeTextBox) {
						isDraggingText = true;
						textDragOffset.x = ev.clientX - activeTextBox.offsetLeft;
						textDragOffset.y = ev.clientY - activeTextBox.offsetTop;
					}
				});

				document.addEventListener('mousemove', (ev) => {
					if (isDraggingText && activeTextBox) {
						activeTextBox.style.left = `${ev.clientX - textDragOffset.x}px`;
						activeTextBox.style.top = `${ev.clientY - textDragOffset.y}px`;
					}
				});

				document.addEventListener('mouseup', () => {
					isDraggingText = false;
				});
			}

			function applyTextStyle(ta) {
				if (!ta) return;
				ta.style.fontFamily = textFontFamily;
				ta.style.fontSize = `${textFontSize}px`;
				ta.style.fontWeight = textBold ? 'bold' : 'normal';
				ta.style.fontStyle = textItalic ? 'italic' : 'normal';
				ta.style.textDecoration = textUnderline ? 'underline' : 'none';
				ta.style.color = primaryColor;
				ta.style.backgroundColor = isTransparentSelection ? 'transparent' : secondaryColor;
			}

			function spawnTextToolbar() {
				if (activeTextToolbar) activeTextToolbar.remove();

				activeTextToolbar = document.createElement('div');
				activeTextToolbar.className = 'paint-text-toolbar';
				activeTextToolbar.innerHTML = `
					<span class="paint-text-toolbar-title">Fonts</span>
					<select class="xp-select" id="paint-tb-font-fam">
						<option value="Tahoma" ${textFontFamily === 'Tahoma' ? 'selected' : ''}>Tahoma</option>
						<option value="Arial" ${textFontFamily === 'Arial' ? 'selected' : ''}>Arial</option>
						<option value="Courier New" ${textFontFamily === 'Courier New' ? 'selected' : ''}>Courier New</option>
						<option value="Times New Roman" ${textFontFamily === 'Times New Roman' ? 'selected' : ''}>Times New Roman</option>
						<option value="Comic Sans MS" ${textFontFamily === 'Comic Sans MS' ? 'selected' : ''}>Comic Sans MS</option>
						<option value="Lucida Console" ${textFontFamily === 'Lucida Console' ? 'selected' : ''}>Lucida Console</option>
						<option value="Impact" ${textFontFamily === 'Impact' ? 'selected' : ''}>Impact</option>
					</select>
					<select class="xp-select" id="paint-tb-font-size">
						${[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 36, 48, 72].map(s => `<option value="${s}" ${textFontSize === s ? 'selected' : ''}>${s}</option>`).join('')}
					</select>
					<button type="button" class="paint-tb-btn ${textBold ? 'active' : ''}" id="paint-tb-btn-b">B</button>
					<button type="button" class="paint-tb-btn ${textItalic ? 'active' : ''}" id="paint-tb-btn-i"><i>I</i></button>
					<button type="button" class="paint-tb-btn ${textUnderline ? 'active' : ''}" id="paint-tb-btn-u"><u>U</u></button>
				`;

				win.querySelector('.paint-main-workspace').appendChild(activeTextToolbar);

				const famSelect = activeTextToolbar.querySelector('#paint-tb-font-fam');
				const sizeSelect = activeTextToolbar.querySelector('#paint-tb-font-size');
				const btnB = activeTextToolbar.querySelector('#paint-tb-btn-b');
				const btnI = activeTextToolbar.querySelector('#paint-tb-btn-i');
				const btnU = activeTextToolbar.querySelector('#paint-tb-btn-u');

				famSelect.addEventListener('change', () => {
					textFontFamily = famSelect.value;
					if (activeTextBox) applyTextStyle(activeTextBox.querySelector('textarea'));
				});

				sizeSelect.addEventListener('change', () => {
					textFontSize = parseInt(sizeSelect.value, 10);
					if (activeTextBox) applyTextStyle(activeTextBox.querySelector('textarea'));
				});

				btnB.addEventListener('click', () => {
					textBold = !textBold;
					btnB.classList.toggle('active', textBold);
					if (activeTextBox) applyTextStyle(activeTextBox.querySelector('textarea'));
				});

				btnI.addEventListener('click', () => {
					textItalic = !textItalic;
					btnI.classList.toggle('active', textItalic);
					if (activeTextBox) applyTextStyle(activeTextBox.querySelector('textarea'));
				});

				btnU.addEventListener('click', () => {
					textUnderline = !textUnderline;
					btnU.classList.toggle('active', textUnderline);
					if (activeTextBox) applyTextStyle(activeTextBox.querySelector('textarea'));
				});
			}

			const resizeCanvas = (newW, newH) => {
				const temp = ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
				mainCanvas.width = newW;
				mainCanvas.height = newH;
				overlayCanvas.width = newW;
				overlayCanvas.height = newH;
				gridCanvas.width = newW * zoomLevel;
				gridCanvas.height = newH * zoomLevel;
				setZoom(zoomLevel);
				ctx.fillStyle = '#ffffff';
				ctx.fillRect(0, 0, newW, newH);
				ctx.putImageData(temp, 0, 0);
				sbDim.textContent = `${newW}x${newH}px`;
				pushState();
			};

			const handleR = win.querySelector('.paint-handle-r');
			const handleB = win.querySelector('.paint-handle-b');
			const handleBR = win.querySelector('.paint-handle-br');

			const setupResizeHandle = (handle, resizeW, resizeH) => {
				let isResizing = false;
				handle.addEventListener('mousedown', (e) => {
					e.preventDefault();
					isResizing = true;
					const startW = mainCanvas.width;
					const startH = mainCanvas.height;
					const sX = e.clientX;
					const sY = e.clientY;

					const onMove = (ev) => {
						if (!isResizing) return;
						const nW = resizeW ? Math.max(10, Math.round(startW + (ev.clientX - sX) / zoomLevel)) : startW;
						const nH = resizeH ? Math.max(10, Math.round(startH + (ev.clientY - sY) / zoomLevel)) : startH;
						wrapper.style.width = `${nW * zoomLevel}px`;
						wrapper.style.height = `${nH * zoomLevel}px`;
						sbDim.textContent = `${nW}x${nH}px`;
					};

					const onUp = (ev) => {
						if (!isResizing) return;
						isResizing = false;
						const nW = resizeW ? Math.max(10, Math.round(startW + (ev.clientX - sX) / zoomLevel)) : startW;
						const nH = resizeH ? Math.max(10, Math.round(startH + (ev.clientY - sY) / zoomLevel)) : startH;
						resizeCanvas(nW, nH);
						document.removeEventListener('mousemove', onMove);
						document.removeEventListener('mouseup', onUp);
					};

					document.addEventListener('mousemove', onMove);
					document.addEventListener('mouseup', onUp);
				});
			};

			setupResizeHandle(handleR, true, false);
			setupResizeHandle(handleB, false, true);
			setupResizeHandle(handleBR, true, true);

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

			function saveDocument(cb = null) {
				commitSelection();
				commitText();
				if (!currentFile) {
					saveDocumentAs(cb);
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
				if (cb) cb(true);
			}

			function saveDocumentAs(cb = null) {
				commitSelection();
				commitText();
				if (window.FileDialog) {
					window.FileDialog.open({
						mode: 'save',
						title: 'Save As',
						defaultFolder: currentFile ? (currentFile.parent || fs.root) : fs.root,
						defaultName: currentFile ? currentFile.name : 'untitled.png',
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
							if (cb) cb(true);
						},
						onCancel: () => {
							if (cb) cb(false);
						}
					});
				}
			}

			function openDocumentDialog() {
				commitSelection();
				commitText();
				const proceed = () => {
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
				};

				if (isDirty) {
					const name = currentFile ? currentFile.name : 'untitled';
					showXPDialog('Paint', `Save changes to ${name}?`, 'question', {
						buttons: ['Yes', 'No', 'Cancel'],
						callback: (res) => {
							if (res === 'Yes') {
								saveDocument((saved) => {
									if (saved) proceed();
								});
							} else if (res === 'No') {
								proceed();
							}
						}
					});
				} else {
					proceed();
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

			function promptStretchSkew() {
				commitSelection();
				const dialogId = `dialog-paint-skew-${Date.now()}`;
				const content = `
					<div style="padding: 12px; display: flex; flex-direction: column; gap: 10px; font-size: 11px;">
						<fieldset class="xp-groupbox">
							<legend>Stretch</legend>
							<div class="xp-form-row">
								<label style="width: 80px;">Horizontal:</label>
								<input type="number" id="paint-stretch-h" class="xp-input" value="100" min="1" max="500" style="width: 60px;"> %
							</div>
							<div class="xp-form-row">
								<label style="width: 80px;">Vertical:</label>
								<input type="number" id="paint-stretch-v" class="xp-input" value="100" min="1" max="500" style="width: 60px;"> %
							</div>
						</fieldset>
						<fieldset class="xp-groupbox">
							<legend>Skew</legend>
							<div class="xp-form-row">
								<label style="width: 80px;">Horizontal:</label>
								<input type="number" id="paint-skew-h" class="xp-input" value="0" min="-89" max="89" style="width: 60px;"> Degrees
							</div>
							<div class="xp-form-row">
								<label style="width: 80px;">Vertical:</label>
								<input type="number" id="paint-skew-v" class="xp-input" value="0" min="-89" max="89" style="width: 60px;"> Degrees
							</div>
						</fieldset>
						<div class="xp-dialog-action-footer">
							<button type="button" class="xp-button" id="paint-stretch-ok">OK</button>
							<button type="button" class="xp-button" id="paint-stretch-cancel">Cancel</button>
						</div>
					</div>
				`;

				const dlg = createXPWindow(dialogId, 'Stretch and Skew', content, 320, 240, {
					resizable: false,
					isModal: true,
					iconSrc: '../assets/images/desk/icons/Paint.webp'
				});
				dlg.querySelector('.xp-window-content').style.padding = '0';

				dlg.querySelector('#paint-stretch-ok').addEventListener('click', () => {
					const sH = (parseFloat(dlg.querySelector('#paint-stretch-h').value) || 100) / 100;
					const sV = (parseFloat(dlg.querySelector('#paint-stretch-v').value) || 100) / 100;
					const kH = ((parseFloat(dlg.querySelector('#paint-skew-h').value) || 0) * Math.PI) / 180;
					const kV = ((parseFloat(dlg.querySelector('#paint-skew-v').value) || 0) * Math.PI) / 180;

					const tempC = document.createElement('canvas');
					tempC.width = mainCanvas.width;
					tempC.height = mainCanvas.height;
					const tCtx = tempC.getContext('2d');
					tCtx.drawImage(mainCanvas, 0, 0);

					const newW = Math.max(10, Math.round(mainCanvas.width * sH + Math.abs(Math.tan(kH) * mainCanvas.height)));
					const newH = Math.max(10, Math.round(mainCanvas.height * sV + Math.abs(Math.tan(kV) * mainCanvas.width)));

					mainCanvas.width = newW;
					mainCanvas.height = newH;
					overlayCanvas.width = newW;
					overlayCanvas.height = newH;
					setZoom(zoomLevel);

					ctx.fillStyle = '#ffffff';
					ctx.fillRect(0, 0, newW, newH);
					ctx.save();
					ctx.transform(sH, Math.tan(kV), Math.tan(kH), sV, 0, 0);
					ctx.drawImage(tempC, 0, 0);
					ctx.restore();

					sbDim.textContent = `${newW}x${newH}px`;
					pushState();
					closeWindow(dlg, dialogId);
				});

				dlg.querySelector('#paint-stretch-cancel').addEventListener('click', () => {
					closeWindow(dlg, dialogId);
				});
			}

			function promptAttributes() {
				commitSelection();
				const dialogId = `dialog-paint-attr-${Date.now()}`;
				const content = `
					<div style="padding: 12px; display: flex; flex-direction: column; gap: 10px; font-size: 11px;">
						<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
							<div class="xp-form-row">
								<label style="width: 55px;">Width:</label>
								<input type="number" id="paint-attr-w" class="xp-input" value="${mainCanvas.width}" min="1" max="4096" style="width: 75px;">
							</div>
							<div class="xp-form-row">
								<label style="width: 55px;">Height:</label>
								<input type="number" id="paint-attr-h" class="xp-input" value="${mainCanvas.height}" min="1" max="4096" style="width: 75px;">
							</div>
						</div>
						<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
							<fieldset class="xp-groupbox">
								<legend>Units</legend>
								<div style="display:flex;flex-direction:column;gap:4px;">
									<label class="xp-checkbox-row"><input type="radio" name="paint-units" value="in"> Inches</label>
									<label class="xp-checkbox-row"><input type="radio" name="paint-units" value="cm"> Cm</label>
									<label class="xp-checkbox-row"><input type="radio" name="paint-units" value="px" checked> Pixels</label>
								</div>
							</fieldset>
							<fieldset class="xp-groupbox">
								<legend>Colors</legend>
								<div style="display:flex;flex-direction:column;gap:4px;">
									<label class="xp-checkbox-row"><input type="radio" name="paint-colorspace" value="bw"> Black and white</label>
									<label class="xp-checkbox-row"><input type="radio" name="paint-colorspace" value="color" checked> Colors</label>
								</div>
							</fieldset>
						</div>
						<div class="xp-dialog-action-footer">
							<button type="button" class="xp-button" id="paint-attr-default">Default</button>
							<button type="button" class="xp-button" id="paint-attr-ok">OK</button>
							<button type="button" class="xp-button" id="paint-attr-cancel">Cancel</button>
						</div>
					</div>
				`;

				const dlg = createXPWindow(dialogId, 'Attributes', content, 340, 230, {
					resizable: false,
					isModal: true,
					iconSrc: '../assets/images/desk/icons/Paint.webp'
				});
				dlg.querySelector('.xp-window-content').style.padding = '0';

				const wInput = dlg.querySelector('#paint-attr-w');
				const hInput = dlg.querySelector('#paint-attr-h');

				dlg.querySelector('#paint-attr-default').addEventListener('click', () => {
					wInput.value = '560';
					hInput.value = '380';
				});

				dlg.querySelector('#paint-attr-ok').addEventListener('click', () => {
					const nw = parseInt(wInput.value, 10) || mainCanvas.width;
					const nh = parseInt(hInput.value, 10) || mainCanvas.height;
					const isBW = dlg.querySelector('input[name="paint-colorspace"][value="bw"]').checked;

					resizeCanvas(nw, nh);

					if (isBW) {
						const imgData = ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
						const d = imgData.data;
						for (let i = 0; i < d.length; i += 4) {
							const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
							const bw = gray >= 128 ? 255 : 0;
							d[i] = bw;
							d[i + 1] = bw;
							d[i + 2] = bw;
						}
						ctx.putImageData(imgData, 0, 0);
						pushState();
					}

					closeWindow(dlg, dialogId);
				});

				dlg.querySelector('#paint-attr-cancel').addEventListener('click', () => {
					closeWindow(dlg, dialogId);
				});
			}

			function openEditColorsDialog(initialHex, onConfirmColor) {
				const dialogId = `dialog-paint-editcolors-${Date.now()}`;
				let chosenColor = initialHex || '#000000';

				const content = `
					<div style="padding: 12px; display: flex; flex-direction: column; gap: 8px; font-size: 11px;">
						<div style="display: flex; gap: 12px;">
							<div>
								<div style="font-weight: bold; margin-bottom: 4px;">Basic colors:</div>
								<div class="paint-palette-grid" id="paint-dlg-basic-grid"></div>
								<div style="font-weight: bold; margin: 8px 0 4px 0;">Custom colors:</div>
								<div class="paint-custom-colors-grid" id="paint-dlg-custom-grid"></div>
							</div>
							<div style="display: flex; flex-direction: column; gap: 6px;">
								<div class="xp-form-row">
									<label style="width: 50px;">Color:</label>
									<input type="color" id="paint-dlg-native-picker" value="${chosenColor}" style="width: 60px; height: 26px; border: 1px solid #7f9db9; padding: 0;">
								</div>
								<div class="xp-form-row">
									<label style="width: 50px;">Hex:</label>
									<input type="text" id="paint-dlg-hex-input" class="xp-input" value="${chosenColor}" style="width: 75px;">
								</div>
							</div>
						</div>
						<div class="xp-dialog-action-footer">
							<button type="button" class="xp-button" id="paint-dlg-btn-ok">OK</button>
							<button type="button" class="xp-button" id="paint-dlg-btn-cancel">Cancel</button>
						</div>
					</div>
				`;

				const dlg = createXPWindow(dialogId, 'Edit Colors', content, 380, 250, {
					resizable: false,
					isModal: true,
					iconSrc: '../assets/images/desk/icons/Paint.webp'
				});
				dlg.querySelector('.xp-window-content').style.padding = '0';

				const basicGrid = dlg.querySelector('#paint-dlg-basic-grid');
				const customGrid = dlg.querySelector('#paint-dlg-custom-grid');
				const nativePicker = dlg.querySelector('#paint-dlg-native-picker');
				const hexInput = dlg.querySelector('#paint-dlg-hex-input');

				PALETTE_COLORS.forEach(c => {
					const sw = document.createElement('div');
					sw.className = 'paint-swatch';
					sw.style.backgroundColor = c;
					sw.addEventListener('click', () => {
						chosenColor = c;
						nativePicker.value = c;
						hexInput.value = c;
					});
					basicGrid.appendChild(sw);
				});

				customColors.forEach(c => {
					const sw = document.createElement('div');
					sw.className = 'paint-swatch';
					sw.style.backgroundColor = c;
					sw.addEventListener('click', () => {
						chosenColor = c;
						nativePicker.value = c;
						hexInput.value = c;
					});
					customGrid.appendChild(sw);
				});

				nativePicker.addEventListener('input', () => {
					chosenColor = nativePicker.value;
					hexInput.value = chosenColor;
				});

				hexInput.addEventListener('input', () => {
					if (/^#[0-9A-F]{6}$/i.test(hexInput.value)) {
						chosenColor = hexInput.value;
						nativePicker.value = chosenColor;
					}
				});

				dlg.querySelector('#paint-dlg-btn-ok').addEventListener('click', () => {
					if (onConfirmColor) onConfirmColor(chosenColor);
					closeWindow(dlg, dialogId);
				});

				dlg.querySelector('#paint-dlg-btn-cancel').addEventListener('click', () => {
					closeWindow(dlg, dialogId);
				});
			}

			function showFullscreenBitmap() {
				commitSelection();
				commitText();
				const fsDiv = document.createElement('div');
				fsDiv.className = 'paint-fullscreen-preview';
				const img = document.createElement('img');
				img.src = mainCanvas.toDataURL();
				fsDiv.appendChild(img);
				document.body.appendChild(fsDiv);

				const dismiss = () => fsDiv.remove();
				fsDiv.addEventListener('click', dismiss);
				document.addEventListener('keydown', function h(e) {
					dismiss();
					document.removeEventListener('keydown', h);
				});
			}

			win.addEventListener('keydown', (e) => {
				const isCtrl = e.ctrlKey || e.metaKey;
				const key = e.key.toLowerCase();

				if (isCtrl && key === 'z') {
					e.preventDefault();
					if (undoStack.length > 1) {
						redoStack.push(undoStack.pop());
						const state = undoStack[undoStack.length - 1];
						ctx.putImageData(state, 0, 0);
						updateWindowTitle();
					}
				} else if (isCtrl && key === 'y') {
					e.preventDefault();
					if (redoStack.length > 0) {
						const state = redoStack.pop();
						undoStack.push(state);
						ctx.putImageData(state, 0, 0);
						updateWindowTitle();
					}
				} else if (isCtrl && key === 's') {
					e.preventDefault();
					saveDocument();
				} else if (isCtrl && key === 'o') {
					e.preventDefault();
					openDocumentDialog();
				} else if (isCtrl && key === 'n') {
					e.preventDefault();
					commitSelection();
					commitText();
					ctx.fillStyle = '#ffffff';
					ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
					currentFile = null;
					isDirty = false;
					updateWindowTitle();
					pushState();
				} else if (isCtrl && key === 'a') {
					e.preventDefault();
					commitSelection();
					selectionBounds = { x: 0, y: 0, w: mainCanvas.width, h: mainCanvas.height };
					selectionData = ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
					drawSelectionToOverlay();
				} else if (isCtrl && key === 'c') {
					if (selectionData) {
						e.preventDefault();
						paintClipboard = new ImageData(new Uint8ClampedArray(selectionData.data), selectionData.width, selectionData.height);
					}
				} else if (isCtrl && key === 'x') {
					if (selectionData) {
						e.preventDefault();
						paintClipboard = new ImageData(new Uint8ClampedArray(selectionData.data), selectionData.width, selectionData.height);
						oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
						selectionData = null;
						selectionBounds = null;
						pushState();
					}
				} else if (isCtrl && key === 'v') {
					if (paintClipboard) {
						e.preventDefault();
						commitSelection();
						selectionBounds = { x: 10, y: 10, w: paintClipboard.width, h: paintClipboard.height };
						selectionData = new ImageData(new Uint8ClampedArray(paintClipboard.data), paintClipboard.width, paintClipboard.height);
						drawSelectionToOverlay();
					}
				} else if (e.key === 'Delete') {
					if (selectionData) {
						e.preventDefault();
						oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
						selectionData = null;
						selectionBounds = null;
						pushState();
					}
				} else if (isCtrl && key === 'i') {
					e.preventDefault();
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
				} else if (isCtrl && key === 'r') {
					e.preventDefault();
					promptFlipRotate();
				} else if (isCtrl && key === 'w') {
					e.preventDefault();
					promptStretchSkew();
				} else if (isCtrl && key === 'e') {
					e.preventDefault();
					promptAttributes();
				} else if (isCtrl && key === 'g') {
					e.preventDefault();
					showGrid = !showGrid;
					renderGrid();
				} else if (isCtrl && key === 'f') {
					e.preventDefault();
					showFullscreenBitmap();
				}
			});

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
									commitText();
									const proceed = () => {
										ctx.fillStyle = '#ffffff';
										ctx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
										currentFile = null;
										isDirty = false;
										updateWindowTitle();
										pushState();
									};
									if (isDirty) {
										const name = currentFile ? currentFile.name : 'untitled';
										showXPDialog('Paint', `Save changes to ${name}?`, 'question', {
											buttons: ['Yes', 'No', 'Cancel'],
											callback: (res) => {
												if (res === 'Yes') {
													saveDocument((saved) => {
														if (saved) proceed();
													});
												} else if (res === 'No') {
													proceed();
												}
											}
										});
									} else {
										proceed();
									}
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
								action: () => saveDocument()
							},
							{
								label: 'Save As...',
								action: () => saveDocumentAs()
							},
							{ separator: true },
							{
								label: 'Save to Local Disk (Download)...',
								action: () => {
									commitSelection();
									commitText();
									const dataUrl = mainCanvas.toDataURL('image/png');
									const virtualTemp = new File(currentFile ? currentFile.name : 'untitled.png', null, dataUrl);
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
									commitText();
									const dataUrl = mainCanvas.toDataURL('image/png');
									if (typeof setImageAsWallpaper === 'function') setImageAsWallpaper(dataUrl, 'tile');
								}
							},
							{
								label: 'Set as Background (Centered)',
								action: () => {
									commitSelection();
									commitText();
									const dataUrl = mainCanvas.toDataURL('image/png');
									if (typeof setImageAsWallpaper === 'function') setImageAsWallpaper(dataUrl, 'center');
								}
							},
							{
								label: 'Set as Background (Stretched)',
								action: () => {
									commitSelection();
									commitText();
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
										paintClipboard = new ImageData(new Uint8ClampedArray(selectionData.data), selectionData.width, selectionData.height);
										oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
										selectionData = null;
										selectionBounds = null;
										pushState();
									}
								}
							},
							{
								label: 'Copy',
								shortcut: 'Ctrl+C',
								disabled: !selectionData,
								action: () => {
									if (selectionData) {
										paintClipboard = new ImageData(new Uint8ClampedArray(selectionData.data), selectionData.width, selectionData.height);
									}
								}
							},
							{
								label: 'Paste',
								shortcut: 'Ctrl+V',
								disabled: !paintClipboard,
								action: () => {
									if (paintClipboard) {
										commitSelection();
										selectionBounds = { x: 10, y: 10, w: paintClipboard.width, h: paintClipboard.height };
										selectionData = new ImageData(new Uint8ClampedArray(paintClipboard.data), paintClipboard.width, paintClipboard.height);
										drawSelectionToOverlay();
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
									pushState();
								}
							},
							{
								label: 'Select All',
								shortcut: 'Ctrl+A',
								action: () => {
									commitSelection();
									selectionBounds = { x: 0, y: 0, w: mainCanvas.width, h: mainCanvas.height };
									selectionData = ctx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
									drawSelectionToOverlay();
								}
							},
							{ separator: true },
							{
								label: 'Copy To...',
								disabled: !selectionData,
								action: () => {
									if (selectionData && window.FileDialog) {
										window.FileDialog.open({
											mode: 'save',
											title: 'Copy To',
											defaultFolder: fs.root,
											defaultName: 'Selection.png',
											onConfirm: (folder, fileName) => {
												const tempCanvas = document.createElement('canvas');
												tempCanvas.width = selectionData.width;
												tempCanvas.height = selectionData.height;
												tempCanvas.getContext('2d').putImageData(selectionData, 0, 0);
												const newFile = fs.create('File', folder.getFullPath(), fileName);
												newFile.icon = '../assets/images/desk/icons/Paint.webp';
												newFile.write(tempCanvas.toDataURL('image/png'));
												fs.save();
												if (typeof refreshUI === 'function') refreshUI();
											}
										});
									}
								}
							},
							{
								label: 'Paste From...',
								action: () => {
									if (window.FileDialog) {
										window.FileDialog.open({
											mode: 'open',
											title: 'Paste From',
											defaultFolder: fs.root,
											filterTypes: [
												{ label: 'Picture Files (*.png;*.bmp;*.jpg;*.jpeg;*.webp)', ext: '.png;.bmp;.jpg;.jpeg;.webp', mime: 'image/*' },
												{ label: 'All Files (*.*)', ext: '.*', mime: '*/*' }
											],
											onConfirm: (folder, fileName, fileObj) => {
												if (fileObj && fileObj.content) {
													const img = new Image();
													img.onload = () => {
														commitSelection();
														const tempCanvas = document.createElement('canvas');
														tempCanvas.width = img.width;
														tempCanvas.height = img.height;
														const tCtx = tempCanvas.getContext('2d');
														tCtx.drawImage(img, 0, 0);
														selectionData = tCtx.getImageData(0, 0, img.width, img.height);
														selectionBounds = { x: 10, y: 10, w: img.width, h: img.height };
														drawSelectionToOverlay();
													};
													img.src = fileObj.content;
												}
											}
										});
									}
								}
							}
						];
					} else if (menuType === 'view') {
						items = [
							{
								label: 'Tool Box',
								checked: toolbox.style.display !== 'none',
								action: () => {
									toolbox.style.display = toolbox.style.display === 'none' ? 'flex' : 'none';
								}
							},
							{
								label: 'Color Box',
								checked: bottomPanel.style.display !== 'none',
								action: () => {
									bottomPanel.style.display = bottomPanel.style.display === 'none' ? 'flex' : 'none';
								}
							},
							{
								label: 'Status Bar',
								checked: statusbar.style.display !== 'none',
								action: () => {
									statusbar.style.display = statusbar.style.display === 'none' ? 'flex' : 'none';
								}
							},
							{
								label: 'Text Toolbar',
								checked: !!activeTextToolbar,
								action: () => {
									if (activeTextToolbar) {
										activeTextToolbar.classList.toggle('hidden');
									} else {
										spawnTextToolbar();
									}
								}
							},
							{ separator: true },
							{
								label: 'Zoom',
								submenu: [
									{ label: 'Normal Size (100%)', shortcut: 'Ctrl+PgUp', radio: zoomLevel === 1, action: () => setZoom(1) },
									{ label: 'Large Size (400%)', shortcut: 'Ctrl+PgDn', radio: zoomLevel === 4, action: () => setZoom(4) },
									{ label: 'Custom 200%', radio: zoomLevel === 2, action: () => setZoom(2) },
									{ label: 'Custom 600%', radio: zoomLevel === 6, action: () => setZoom(6) },
									{ label: 'Custom 800%', radio: zoomLevel === 8, action: () => setZoom(8) },
									{ separator: true },
									{
										label: 'Show Grid',
										shortcut: 'Ctrl+G',
										checked: showGrid,
										disabled: zoomLevel < 4,
										action: () => {
											showGrid = !showGrid;
											renderGrid();
										}
									}
								]
							},
							{
								label: 'View Bitmap',
								shortcut: 'Ctrl+F',
								action: () => showFullscreenBitmap()
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
								label: 'Stretch / Skew...',
								shortcut: 'Ctrl+W',
								action: promptStretchSkew
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
								label: 'Attributes...',
								shortcut: 'Ctrl+E',
								action: promptAttributes
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
								label: 'Draw Opaque',
								checked: !isTransparentSelection,
								action: () => {
									isTransparentSelection = !isTransparentSelection;
									renderToolOptions();
								}
							}
						];
					} else if (menuType === 'colors') {
						items = [
							{
								label: 'Edit Colors...',
								action: () => {
									openEditColorsDialog(primaryColor, (newColor) => {
										primaryColor = newColor;
										updateColorBoxes();
									});
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
									showXPDialog('About Paint', 'MacroPof Windows XP Paint\nVersion 5.1 (Build 2600.xpsp_sp3_gdr)\nBitmap Graphics Editor Engine', 'info');
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
