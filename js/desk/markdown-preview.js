(function () {
	class MarkdownParser {
		static parse(markdown) {
			if (!markdown) return '';
			let text = markdown;

			const mathBlocks = [];
			text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
				const id = `___MATH_BLOCK_${mathBlocks.length}___`;
				mathBlocks.push(formula.trim());
				return id;
			});

			const mathInlines = [];
			text = text.replace(/\$([^\$\n]+?)\$/g, (match, formula) => {
				const id = `___MATH_INLINE_${mathInlines.length}___`;
				mathInlines.push(formula.trim());
				return id;
			});

			const codeBlocks = [];
			text = text.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
				const id = `___CODE_BLOCK_${codeBlocks.length}___`;
				codeBlocks.push({ lang: lang || 'text', code: this.escapeHtml(code) });
				return id;
			});

			text = this.escapeHtmlExceptSpecial(text);

			text = text.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
			text = text.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
			text = text.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
			text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
			text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>');
			text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>');

			text = text.replace(/^---$/gim, '<hr>');
			text = text.replace(/^\*\*\*$/gim, '<hr>');

			text = text.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

			text = text.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
			text = text.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
			text = text.replace(/\*(.*?)\*/gim, '<em>$1</em>');
			text = text.replace(/~~(.*?)~~/gim, '<del>$1</del>');
			text = text.replace(/==(.*?)==/gim, '<mark>$1</mark>');

			text = text.replace(/`([^`]+)`/gim, '<code>$1</code>');

			text = text.replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" style="max-width:100%; border:1px solid #aca899; padding:2px; background:#fff;">');
			text = text.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" style="color:#0055ea; text-decoration:underline;">$1</a>');

			text = text.replace(/^- \[ \] (.*$)/gim, '<div class="markdown-task-row"><input type="checkbox" disabled class="markdown-task-checkbox"> $1</div>');
			text = text.replace(/^- \[x\] (.*$)/gim, '<div class="markdown-task-row"><input type="checkbox" checked disabled class="markdown-task-checkbox"> <del>$1</del></div>');

			text = text.replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>');
			text = text.replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>');
			text = text.replace(/<\/ul>\s*<ul>/gim, '');

			text = text.replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>');
			text = text.replace(/<\/ol>\s*<ol>/gim, '');

			text = this.parseTables(text);

			text = text.replace(/\n\n+/g, '</p><p>');
			text = `<p>${text}</p>`;
			text = text.replace(/<p><\/(ul|ol|blockquote|table|h1|h2|h3|h4|h5|h6|hr|pre|div)>/g, '</$1>');
			text = text.replace(/<(ul|ol|blockquote|table|h1|h2|h3|h4|h5|h6|hr|pre|div)><p>/g, '<$1>');
			text = text.replace(/<p><(ul|ol|blockquote|table|h1|h2|h3|h4|h5|h6|hr|pre|div)/g, '<$1');
			text = text.replace(/<\/(ul|ol|blockquote|table|h1|h2|h3|h4|h5|h6|hr|pre|div)><\/p>/g, '</$1>');

			codeBlocks.forEach((cb, i) => {
				const replacement = `<pre><code class="language-${cb.lang}">${cb.code}</code></pre>`;
				text = text.replace(`___CODE_BLOCK_${i}___`, replacement);
			});

			mathBlocks.forEach((formula, i) => {
				let rendered = '';
				if (window.katex && typeof window.katex.renderToString === 'function') {
					try {
						rendered = window.katex.renderToString(formula, { displayMode: true, throwOnError: false });
					} catch (e) {
						rendered = `<div class="katex-display math-fallback">$$ ${this.escapeHtml(formula)} $$</div>`;
					}
				} else {
					rendered = `<div class="katex-display math-fallback">$$ ${this.escapeHtml(formula)} $$</div>`;
				}
				text = text.replace(`___MATH_BLOCK_${i}___`, rendered);
			});

			mathInlines.forEach((formula, i) => {
				let rendered = '';
				if (window.katex && typeof window.katex.renderToString === 'function') {
					try {
						rendered = window.katex.renderToString(formula, { displayMode: false, throwOnError: false });
					} catch (e) {
						rendered = `<span class="katex math-fallback">$ ${this.escapeHtml(formula)} $</span>`;
					}
				} else {
					rendered = `<span class="katex math-fallback">$ ${this.escapeHtml(formula)} $</span>`;
				}
				text = text.replace(`___MATH_INLINE_${i}___`, rendered);
			});

			return text;
		}

		static escapeHtml(str) {
			return String(str)
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#039;');
		}

		static escapeHtmlExceptSpecial(str) {
			return String(str)
				.replace(/&/g, '&amp;')
				.replace(/<(?!___)/g, '&lt;')
				.replace(/(?<!___)>/g, '&gt;');
		}

		static parseTables(text) {
			const tableRegex = /((?:\|.+?\|+\r?\n)+)/g;
			return text.replace(tableRegex, (tableText) => {
				const lines = tableText.trim().split('\n').map(l => l.trim()).filter(Boolean);
				if (lines.length < 2) return tableText;

				const headerLine = lines[0];
				const separatorLine = lines[1];
				if (!separatorLine.includes('---')) return tableText;

				const headers = headerLine.split('|').map(s => s.trim()).filter(s => s.length > 0);
				let html = '<table><thead><tr>';
				headers.forEach(h => {
					html += `<th>${h}</th>`;
				});
				html += '</tr></thead><tbody>';

				for (let i = 2; i < lines.length; i++) {
					const rowCells = lines[i].split('|').map(s => s.trim()).filter(s => s.length > 0);
					if (rowCells.length > 0) {
						html += '<tr>';
						headers.forEach((_, idx) => {
							html += `<td>${rowCells[idx] || ''}</td>`;
						});
						html += '</tr>';
					}
				}
				html += '</tbody></table>';
				return html;
			});
		}
	}

	const MarkdownPreviewApp = {
		activeWindows: new Map(),

		open(notepadSession) {
			if (!notepadSession) return null;
			const sessionWinId = notepadSession.win.id;
			const previewId = `window-markdown-preview-${sessionWinId}`;

			const existing = document.getElementById(previewId);
			if (existing) {
				if (typeof bringWindowToFront === 'function') bringWindowToFront(existing);
				this.updateContent(existing, notepadSession);
				return existing;
			}

			const rawTitle = notepadSession.file ? notepadSession.file.name : (notepadSession.options.title || 'Untitled.md');
			const contentHTML = this.buildWindowTemplate();

			const win = createXPWindow(previewId, `${rawTitle} - Markdown Live Preview`, contentHTML, 680, 520, {
				iconSrc: '../assets/images/desk/icons/List File.webp'
			});

			win.classList.add('markdown-preview-window');
			win.dataset.appId = 'markdown-preview';
			win.dataset.sessionWinId = sessionWinId;

			this.activeWindows.set(sessionWinId, win);
			this.bindWindowEvents(win, notepadSession);
			this.updateContent(win, notepadSession);

			return win;
		},

		buildWindowTemplate() {
			return `
				<div class="markdown-preview-layout">
					<div class="folder-menu-bar">
						<ul>
							<li data-action="md-menu-file"><u>F</u>ile</li>
							<li data-action="md-menu-export"><u>E</u>xport</li>
							<li data-action="md-menu-view"><u>V</u>iew</li>
							<li data-action="md-menu-help"><u>H</u>elp</li>
						</ul>
					</div>
					<div class="markdown-preview-toolbar">
						<button type="button" class="xp-button-small" id="md-btn-pdf" title="Export as PDF document">
							<img src="../assets/images/desk/icons/List File.webp" style="width:14px; height:14px; margin-right:4px;">
							<span>Export PDF</span>
						</button>
						<button type="button" class="xp-button-small" id="md-btn-img" title="Export as Image (PNG)">
							<img src="../assets/images/desk/icons/Picture.webp" style="width:14px; height:14px; margin-right:4px;">
							<span>Export Image</span>
						</button>
						<button type="button" class="xp-button-small" id="md-btn-html" title="Export as Standalone HTML">
							<img src="../assets/images/desk/icons/Internet Explorer.webp" style="width:14px; height:14px; margin-right:4px;">
							<span>Save HTML</span>
						</button>
						<div class="folder-toolbar-separator"></div>
						<button type="button" class="xp-button-small" id="md-btn-print" title="Print document (Ctrl+P)">
							<img src="../assets/images/desk/icons/Fax.webp" style="width:14px; height:14px; margin-right:4px;">
							<span>Print</span>
						</button>
						<button type="button" class="xp-button-small" id="md-btn-refresh" title="Force re-render (F5)">
							<img src="https://api.iconify.design/mdi/refresh.svg?color=%231b4b9b" style="width:14px; height:14px;">
						</button>
					</div>
					<div class="markdown-preview-viewport" id="md-preview-body-container">
						<div class="markdown-rendered-body" id="md-rendered-content"></div>
					</div>
					<div class="folder-status-bar">
						<div class="status-bar-left" id="md-sb-words">0 words - 0 characters</div>
						<div class="status-bar-left" id="md-sb-equations">0 math equation(s)</div>
						<div class="status-bar-right" id="md-sb-speed">Render: 0ms</div>
					</div>
				</div>
			`;
		},

		bindWindowEvents(win, notepadSession) {
			const bodyContainer = win.querySelector('#md-preview-body-container');
			const btnPdf = win.querySelector('#md-btn-pdf');
			const btnImg = win.querySelector('#md-btn-img');
			const btnHtml = win.querySelector('#md-btn-html');
			const btnPrint = win.querySelector('#md-btn-print');
			const btnRefresh = win.querySelector('#md-btn-refresh');

			btnPdf.addEventListener('click', () => this.exportDirectPDF(notepadSession));
			btnImg.addEventListener('click', () => this.exportDirectImage(notepadSession));
			btnHtml.addEventListener('click', () => this.exportDirectHTML(notepadSession));
			btnPrint.addEventListener('click', () => this.printPreview(win));
			btnRefresh.addEventListener('click', () => this.updateContent(win, notepadSession));

			win.querySelectorAll('.folder-menu-bar li[data-action]').forEach(item => {
				item.addEventListener('click', (e) => {
					e.stopPropagation();
					const act = item.dataset.action;
					const rect = item.getBoundingClientRect();
					this.openMenu(act, win, notepadSession, rect.left, rect.bottom + 2);
				});
			});

			win.beforeClose = () => {
				this.activeWindows.delete(notepadSession.win.id);
				return true;
			};
		},

		updateContent(win, notepadSession) {
			const t0 = performance.now();
			const renderedContainer = win.querySelector('#md-rendered-content');
			if (!renderedContainer || !notepadSession || !notepadSession.textarea) return;

			const rawMarkdown = notepadSession.textarea.value;
			const parsedHTML = MarkdownParser.parse(rawMarkdown);
			renderedContainer.innerHTML = parsedHTML;

			const t1 = performance.now();
			const elapsed = Math.max(1, Math.round(t1 - t0));

			const wordCount = rawMarkdown.trim() ? rawMarkdown.trim().split(/\s+/).length : 0;
			const charCount = rawMarkdown.length;
			const mathCount = (rawMarkdown.match(/\$/g) || []).length / 2;

			const sbWords = win.querySelector('#md-sb-words');
			const sbEquations = win.querySelector('#md-sb-equations');
			const sbSpeed = win.querySelector('#md-sb-speed');

			if (sbWords) sbWords.textContent = `${wordCount.toLocaleString()} word(s) - ${charCount.toLocaleString()} character(s)`;
			if (sbEquations) sbEquations.textContent = `${Math.floor(mathCount)} math equation(s)`;
			if (sbSpeed) sbSpeed.textContent = `Render: ${elapsed}ms`;

			const currentTitle = notepadSession.file ? notepadSession.file.name : (notepadSession.options.title || 'Untitled.md');
			const winTitle = win.querySelector('.xp-window-header .title');
			if (winTitle) winTitle.textContent = `${currentTitle} - Markdown Live Preview`;
		},

		openMenu(menuType, win, notepadSession, x, y) {
			let items = [];

			if (menuType === 'md-menu-file') {
				items = [
					{ label: 'Save Markdown Source (Notepad)', shortcut: 'Ctrl+S', action: () => notepadSession.save() },
					{ separator: true },
					{ label: 'Print Document...', shortcut: 'Ctrl+P', action: () => this.printPreview(win) },
					{ label: 'Close Preview', action: () => closeWindow(win, win.id) }
				];
			} else if (menuType === 'md-menu-export') {
				items = [
					{ label: 'Export as PDF Document...', icon: '../assets/images/desk/icons/List File.webp', bold: true, action: () => this.exportDirectPDF(notepadSession) },
					{ label: 'Export as High-Res Image (PNG)...', icon: '../assets/images/desk/icons/Picture.webp', action: () => this.exportDirectImage(notepadSession) },
					{ label: 'Export as Standalone HTML...', icon: '../assets/images/desk/icons/Internet Explorer.webp', action: () => this.exportDirectHTML(notepadSession) }
				];
			} else if (menuType === 'md-menu-view') {
				items = [
					{ label: 'Refresh Preview', shortcut: 'F5', action: () => this.updateContent(win, notepadSession) }
				];
			} else if (menuType === 'md-menu-help') {
				items = [
					{ label: 'About Markdown & KaTeX Engine', bold: true, action: () => showXPDialog('Markdown Engine', 'Windows XP Markdown Live Preview with KaTeX typesetting support for mathematical physics and note-taking.', 'info') }
				];
			}

			if (window.ContextMenu) {
				window.ContextMenu.show(items, x, y);
			}
		},

		printPreview(win) {
			const rendered = win.querySelector('#md-rendered-content');
			if (!rendered) return;
			const printWin = window.open('', '_blank');
			if (!printWin) {
				showXPDialog('Print Error', 'Please allow popups to print.', 'error');
				return;
			}
			printWin.document.write(`
				<!DOCTYPE html>
				<html>
				<head>
					<title>Print Document</title>
					<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
					<style>
						body { font-family: Arial, sans-serif; padding: 30px; color: #000; line-height: 1.6; }
						table { border-collapse: collapse; width: 100%; margin: 12px 0; }
						th, td { border: 1px solid #888; padding: 6px 8px; }
						th { background: #eee; }
						pre { background: #f4f4f4; padding: 10px; border: 1px solid #ccc; font-family: monospace; }
						blockquote { border-left: 4px solid #0055ea; padding-left: 12px; margin: 10px 0; }
					</style>
				</head>
				<body>
					${rendered.innerHTML}
					<script>
						window.onload = function() { window.print(); window.close(); };
					</script>
				</body>
				</html>
			`);
			printWin.document.close();
		},

		exportDirectPDF(notepadSession) {
			const defaultName = notepadSession.file 
				? notepadSession.file.name.replace(/\.[^/.]+$/, '.pdf') 
				: 'Document.pdf';

			const rawMarkdown = notepadSession.textarea.value;
			const parsedHTML = MarkdownParser.parse(rawMarkdown);

			if (window.FileDialog) {
				window.FileDialog.open({
					mode: 'save',
					title: 'Export PDF Document',
					defaultName: defaultName,
					filterTypes: [
						{ label: 'PDF Document (*.pdf)', ext: '.pdf', mime: 'application/pdf' },
						{ label: 'All Files (*.*)', ext: '.*', mime: '*/*' }
					],
					onConfirm: (folder, fileName) => {
						if (fs && folder) {
							const destFolder = folder;
							let pdfFile = destFolder.getByName(fileName);
							if (!pdfFile) {
								pdfFile = fs.create('File', destFolder.getFullPath(), fileName);
							}
							pdfFile.write(parsedHTML);
							pdfFile.icon = '../assets/images/desk/icons/List File.webp';
							fs.save();
							if (typeof refreshUI === 'function') refreshUI();
						}

						const printWin = window.open('', '_blank');
						if (printWin) {
							printWin.document.write(`
								<!DOCTYPE html>
								<html>
								<head>
									<title>${fileName}</title>
									<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
									<style>
										body { font-family: Arial, sans-serif; padding: 40px; color: #000; line-height: 1.6; }
										table { border-collapse: collapse; width: 100%; margin: 12px 0; }
										th, td { border: 1px solid #888; padding: 6px 8px; }
										th { background: #eee; }
										pre { background: #f4f4f4; padding: 10px; border: 1px solid #ccc; font-family: monospace; }
										blockquote { border-left: 4px solid #0055ea; padding-left: 12px; margin: 10px 0; }
									</style>
								</head>
								<body>
									${parsedHTML}
									<script>
										window.onload = function() { window.print(); };
									</script>
								</body>
								</html>
							`);
							printWin.document.close();
						}

						showXPDialog('Export Complete', `Document successfully exported to '${fileName}'.`, 'info');
					}
				});
			}
		},

		async exportDirectImage(notepadSession) {
			const defaultName = notepadSession.file 
				? notepadSession.file.name.replace(/\.[^/.]+$/, '.png') 
				: 'Document_Snapshot.png';

			const rawMarkdown = notepadSession.textarea.value;
			const parsedHTML = MarkdownParser.parse(rawMarkdown);

			const renderNode = document.createElement('div');
			renderNode.style.cssText = 'position: fixed; left: -9999px; top: 0; width: 800px; background: #ffffff; padding: 30px; font-family: Arial, sans-serif; color: #000; box-sizing: border-box;';
			renderNode.className = 'markdown-rendered-body';
			renderNode.innerHTML = parsedHTML;
			document.body.appendChild(renderNode);

			let dataUrl = '';
			if (typeof window.html2canvas === 'function') {
				try {
					const canvas = await window.html2canvas(renderNode, { backgroundColor: '#ffffff', scale: 2 });
					dataUrl = canvas.toDataURL('image/png');
				} catch (e) {
					dataUrl = '';
				}
			}

			if (!dataUrl) {
				const canvas = document.createElement('canvas');
				canvas.width = 800;
				canvas.height = 1000;
				const ctx = canvas.getContext('2d');
				ctx.fillStyle = '#ffffff';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = '#000000';
				ctx.font = '14px Arial';
				ctx.fillText(notepadSession.textarea.value.substring(0, 500), 20, 40);
				dataUrl = canvas.toDataURL('image/png');
			}

			renderNode.remove();

			if (window.FileDialog) {
				window.FileDialog.open({
					mode: 'save',
					title: 'Export Rendered Image (PNG)',
					defaultName: defaultName,
					filterTypes: [
						{ label: 'PNG Image (*.png)', ext: '.png', mime: 'image/png' },
						{ label: 'All Files (*.*)', ext: '.*', mime: '*/*' }
					],
					onConfirm: (folder, fileName) => {
						if (fs && folder) {
							let imgFile = folder.getByName(fileName);
							if (!imgFile) {
								imgFile = fs.create('File', folder.getFullPath(), fileName);
							}
							imgFile.write(dataUrl);
							imgFile.icon = '../assets/images/desk/icons/Picture.webp';
							fs.save();
							if (typeof refreshUI === 'function') refreshUI();
						}

						const downloadAnchor = document.createElement('a');
						downloadAnchor.href = dataUrl;
						downloadAnchor.download = fileName;
						document.body.appendChild(downloadAnchor);
						downloadAnchor.click();
						downloadAnchor.remove();

						showXPDialog('Export Image', `High-resolution PNG image saved as '${fileName}'.`, 'info');
					}
				});
			}
		},

		exportDirectHTML(notepadSession) {
			const defaultName = notepadSession.file 
				? notepadSession.file.name.replace(/\.[^/.]+$/, '.html') 
				: 'Document.html';

			const rawMarkdown = notepadSession.textarea.value;
			const parsedHTML = MarkdownParser.parse(rawMarkdown);

			const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>${defaultName}</title>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
	<style>
		body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; padding: 40px; color: #111; line-height: 1.6; max-width: 860px; margin: auto; }
		table { border-collapse: collapse; width: 100%; margin: 16px 0; }
		th, td { border: 1px solid #ccc; padding: 8px 12px; }
		th { background: #f4f4f4; }
		pre { background: #0f1622; color: #00ff66; padding: 14px; border-radius: 4px; font-family: Consolas, monospace; overflow-x: auto; }
		code { background: #f0f0f0; padding: 2px 5px; border-radius: 3px; font-family: Consolas, monospace; color: #c7254e; }
		pre code { background: transparent; color: inherit; padding: 0; }
		blockquote { border-left: 4px solid #0055ea; padding: 8px 16px; margin: 16px 0; background: #f8faff; color: #444; }
	</style>
</head>
<body>
${parsedHTML}
</body>
</html>`;

			if (window.FileDialog) {
				window.FileDialog.open({
					mode: 'save',
					title: 'Export Standalone HTML',
					defaultName: defaultName,
					filterTypes: [
						{ label: 'HTML Document (*.html)', ext: '.html', mime: 'text/html' },
						{ label: 'All Files (*.*)', ext: '.*', mime: '*/*' }
					],
					onConfirm: (folder, fileName) => {
						if (fs && folder) {
							let htmlFile = folder.getByName(fileName);
							if (!htmlFile) {
								htmlFile = fs.create('File', folder.getFullPath(), fileName);
							}
							htmlFile.write(fullHTML);
							htmlFile.icon = '../assets/images/desk/icons/Internet Explorer.webp';
							fs.save();
							if (typeof refreshUI === 'function') refreshUI();
						}

						const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
						const url = URL.createObjectURL(blob);
						const a = document.createElement('a');
						a.href = url;
						a.download = fileName;
						document.body.appendChild(a);
						a.click();
						a.remove();
						setTimeout(() => URL.revokeObjectURL(url), 2000);

						showXPDialog('Export HTML', `HTML document saved as '${fileName}'.`, 'info');
					}
				});
			}
		}
	};

	if (window.DeskEventBus) {
		window.DeskEventBus.on('notepad:content-changed', (payload) => {
			if (!payload || !payload.session) return;
			const previewWin = MarkdownPreviewApp.activeWindows.get(payload.session.win.id);
			if (previewWin) {
				MarkdownPreviewApp.updateContent(previewWin, payload.session);
			}
		});
	}

	window.MarkdownPreviewApp = MarkdownPreviewApp;
})();
