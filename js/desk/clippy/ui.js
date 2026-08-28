(function () {
	'use strict';

	const IMAGE_BASE = '../assets/images/desk/clippy/';
	const CHAT_STORAGE_KEY = 'clippy_chat_history_v3';

	const FACES = {
		IDLE: 'idle.png',
		THINK: 'think.png'
	};

	function escapeHtml(str) {
		return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}

	function parseMarkdown(text) {
		if (!text || typeof text !== 'string') return '';
		if (text.startsWith('<div class="clippy-structured-section">') || text.startsWith('<table class="clippy-xp-table">') || text.startsWith('<div class="clippy-activity-card">')) {
			return text;
		}

		let html = text;

		const preservedBlocks = [];
		html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
			const placeholder = `__PRESERVED_BLOCK_${preservedBlocks.length}__`;
			preservedBlocks.push(`<pre><code class="language-${lang}">${escapeHtml(code.trim())}</code></pre>`);
			return placeholder;
		});

		html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
			const placeholder = `__PRESERVED_BLOCK_${preservedBlocks.length}__`;
			let rendered = '';
			if (window.katex) {
				try {
					rendered = window.katex.renderToString(math.trim(), { displayMode: true, throwOnError: false });
				} catch (e) {
					rendered = `<div class="katex-display-box"><code>$$${escapeHtml(math.trim())}$$</code></div>`;
				}
			} else {
				rendered = `<div class="katex-display-box"><code>$$${escapeHtml(math.trim())}$$</code></div>`;
			}
			preservedBlocks.push(rendered);
			return placeholder;
		});

		html = html.replace(/\$([^\$\n]+?)\$/g, (match, math) => {
			const placeholder = `__PRESERVED_BLOCK_${preservedBlocks.length}__`;
			let rendered = '';
			if (window.katex) {
				try {
					rendered = window.katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
				} catch (e) {
					rendered = `<code class="katex-inline-box">$${escapeHtml(math.trim())}$</code>`;
				}
			} else {
				rendered = `<code class="katex-inline-box">$${escapeHtml(math.trim())}$</code>`;
			}
			preservedBlocks.push(rendered);
			return placeholder;
		});

		html = html.replace(/`([^`\n]+)`/g, (match, code) => {
			const placeholder = `__PRESERVED_BLOCK_${preservedBlocks.length}__`;
			preservedBlocks.push(`<code>${escapeHtml(code)}</code>`);
			return placeholder;
		});

		html = html.replace(/<span\s+class="([^"]+)">([\s\S]*?)<\/span>/gi, (match, cls, inner) => {
			const placeholder = `__PRESERVED_BLOCK_${preservedBlocks.length}__`;
			preservedBlocks.push(`<span class="${cls}">${inner}</span>`);
			return placeholder;
		});

		html = html.replace(/<div\s+class="([^"]+)">([\s\S]*?)<\/div>/gi, (match, cls, inner) => {
			const placeholder = `__PRESERVED_BLOCK_${preservedBlocks.length}__`;
			preservedBlocks.push(`<div class="${cls}">${inner}</div>`);
			return placeholder;
		});

		html = html.replace(/\b([a-zA-Z0-9_\(\)]+)\^(\d+|[a-zA-Z]|\{[^}]+\})/g, (match, base, exp) => {
			const cleanExp = exp.startsWith('{') && exp.endsWith('}') ? exp.slice(1, -1) : exp;
			return `${base}<sup>${cleanExp}</sup>`;
		});

		html = html.replace(/\b([a-zA-Z0-9_]+)_(\d+|[a-zA-Z]|\{[^}]+\})/g, (match, base, sub) => {
			const cleanSub = sub.startsWith('{') && sub.endsWith('}') ? sub.slice(1, -1) : sub;
			return `${base}<sub>${cleanSub}</sub>`;
		});

		html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
		html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
		html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
		html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
		html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
		html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

		html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
		html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
		html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

		html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
		html = html.replace(/^(-{3,}|\*{3,}|_{3,})$/gim, '<hr>');

		html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

		html = html.replace(/^(?:[\t ]*[-*] (.*(?:\n[\t ]+.*)*))+/gim, (match) => {
			const items = match.trim().split(/\n[\t ]*[-*] /).map(s => s.replace(/^[-*] /, '').trim());
			return `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
		});

		html = html.replace(/\n\n/g, '<br><br>');
		html = html.replace(/\n/g, '<br>');

		preservedBlocks.forEach((blockHtml, idx) => {
			html = html.replace(`__PRESERVED_BLOCK_${idx}__`, blockHtml);
		});

		return html;
	}

	class ClippyViewController {
		constructor() {
			this.popupElement = null;
			this.logElement = null;
			this.inputElement = null;
			this.faceImage = null;
			this.bubbleElement = null;
			this.suggestionsContainer = null;
			this.isOpen = false;
			this.isTyping = false;
			this.bubbleHideTimer = null;
			this.onSendHandler = null;
			this.onActionHandler = null;
			this.inputHistory = [];
			this.historyIndex = -1;
			this.currentDraft = '';
		}

		buildPopup(onSendHandler, onActionHandler) {
			if (onSendHandler) this.onSendHandler = onSendHandler;
			if (onActionHandler) this.onActionHandler = onActionHandler;

			if (this.popupElement) return this.popupElement;

			const uiTexts = (window.ClippyKnowledge && window.ClippyKnowledge.UI_TEXTS) || {
				ariaAssistant: "Clippy Assistant",
				headerTitle: "Clippy",
				clearChatTitle: "Clear Chat History",
				soundToggleTitle: "Toggle Sound",
				closeTitle: "Close",
				inputPlaceholder: "Chat with Clippy or enter a command...",
				btnSend: "Send",
				btnSnd: "[SND]",
				btnMute: "[MUTE]",
				btnClr: "[CLR]"
			};

			this.popupElement = document.createElement('div');
			this.popupElement.id = 'clippy-popup';
			this.popupElement.className = 'clippy-popup hidden';
			this.popupElement.setAttribute('role', 'dialog');
			this.popupElement.setAttribute('aria-label', uiTexts.ariaAssistant);

			this.popupElement.innerHTML = `
				<div class="clippy-popup-header">
					<div class="clippy-header-left">
						<img src="${IMAGE_BASE}${FACES.IDLE}" alt="${uiTexts.headerTitle}" class="clippy-popup-avatar">
						<span class="clippy-popup-title">${uiTexts.headerTitle}</span>
					</div>
					<div class="clippy-header-controls">
						<button type="button" class="clippy-header-btn clippy-clear-chat" title="${uiTexts.clearChatTitle}">${uiTexts.btnClr}</button>
						<button type="button" class="clippy-header-btn clippy-sound-toggle" title="${uiTexts.soundToggleTitle}">${uiTexts.btnSnd}</button>
						<button type="button" class="clippy-popup-close" title="${uiTexts.closeTitle}">&times;</button>
					</div>
				</div>
				<div class="clippy-popup-log"></div>
				<div class="clippy-suggestions-bar"></div>
				<div class="clippy-popup-input-row">
					<input type="text" class="clippy-popup-input" placeholder="${uiTexts.inputPlaceholder}">
					<button type="button" class="clippy-popup-send">${uiTexts.btnSend}</button>
				</div>
			`;

			const screenContainer = document.getElementById('screen-frame') || document.body;
			screenContainer.appendChild(this.popupElement);

			this.logElement = this.popupElement.querySelector('.clippy-popup-log');
			this.inputElement = this.popupElement.querySelector('.clippy-popup-input');
			this.faceImage = this.popupElement.querySelector('.clippy-popup-avatar');
			this.suggestionsContainer = this.popupElement.querySelector('.clippy-suggestions-bar');

			if (window.ClippyAnimator && this.faceImage) {
				window.ClippyAnimator.registerElement(this.faceImage);
			}
			const headerHandle = this.popupElement.querySelector('.clippy-popup-header');
			const sendBtn = this.popupElement.querySelector('.clippy-popup-send');
			const closeBtn = this.popupElement.querySelector('.clippy-popup-close');
			const soundBtn = this.popupElement.querySelector('.clippy-sound-toggle');
			const clearBtn = this.popupElement.querySelector('.clippy-clear-chat');

			if (clearBtn) {
				clearBtn.addEventListener('click', () => {
					this.clearHistory();
				});
			}

			this.loadChatHistory();

			if (window.ClippyEnvironment === 'standalone') {
				headerHandle.style.cursor = 'default';
			} else {
				this.makeDraggable(this.popupElement, headerHandle);
			}

			this.renderSuggestions();

			soundBtn.addEventListener('click', () => {
				if (window.ClippyAudio) {
					const nextState = !window.ClippyAudio.isEnabled();
					window.ClippyAudio.setEnabled(nextState);
					soundBtn.textContent = nextState ? '[SND]' : '[MUTE]';
				}
			});

			const doSubmit = () => {
				if (!this.inputElement) return;
				const val = this.inputElement.value.trim();
				if (val && this.onSendHandler) {
					this.onSendHandler(val);
				}
			};

			sendBtn.addEventListener('click', doSubmit);

			this.inputElement.addEventListener('input', () => {
				if (this.historyIndex === -1) {
					this.currentDraft = this.inputElement.value;
				}
				if (window.ClippyAnimator && !window.ClippyAnimator.isPlayingProtectedAnimation() && this.inputElement.value.trim().length === 1) {
					window.ClippyAnimator.playLook('down', { priority: 1, restart: false });
				}
			});

			this.inputElement.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') {
					e.preventDefault();
					doSubmit();
				} else if (e.key === 'ArrowUp') {
					if (this.inputHistory.length === 0) return;
					e.preventDefault();
					if (this.historyIndex === -1) {
						this.currentDraft = this.inputElement.value;
						this.historyIndex = this.inputHistory.length - 1;
					} else if (this.historyIndex > 0) {
						this.historyIndex--;
					}
					if (this.historyIndex >= 0 && this.historyIndex < this.inputHistory.length) {
						this.inputElement.value = this.inputHistory[this.historyIndex];
						setTimeout(() => {
							this.inputElement.selectionStart = this.inputElement.selectionEnd = this.inputElement.value.length;
						}, 0);
					}
				} else if (e.key === 'ArrowDown') {
					if (this.historyIndex === -1) return;
					e.preventDefault();
					if (this.historyIndex < this.inputHistory.length - 1) {
						this.historyIndex++;
						this.inputElement.value = this.inputHistory[this.historyIndex];
					} else {
						this.historyIndex = -1;
						this.inputElement.value = this.currentDraft || '';
					}
					setTimeout(() => {
						this.inputElement.selectionStart = this.inputElement.selectionEnd = this.inputElement.value.length;
					}, 0);
				}
			});

			closeBtn.addEventListener('click', () => this.close());

			document.addEventListener('keydown', (e) => {
				if (e.key === 'Escape' && this.isOpen) this.close();
			});

			return this.popupElement;
		}

		makeDraggable(element, handle) {
			let posX = 0, posY = 0, mouseX = 0, mouseY = 0;
			handle.style.cursor = 'move';

			const dragMouseDown = (e) => {
				e.preventDefault();
				mouseX = e.clientX;
				mouseY = e.clientY;
				document.addEventListener('mouseup', closeDragElement);
				document.addEventListener('mousemove', elementDrag);
			};

			const elementDrag = (e) => {
				e.preventDefault();
				posX = mouseX - e.clientX;
				posY = mouseY - e.clientY;
				mouseX = e.clientX;
				mouseY = e.clientY;
				const maxTop = Math.max(0, window.innerHeight - element.offsetHeight - 36);
				const maxLeft = Math.max(0, window.innerWidth - element.offsetWidth - 4);
				element.style.top = Math.max(4, Math.min(maxTop, element.offsetTop - posY)) + "px";
				element.style.left = Math.max(4, Math.min(maxLeft, element.offsetLeft - posX)) + "px";
				element.style.bottom = 'auto';
				element.style.right = 'auto';
			};

			const closeDragElement = () => {
				document.removeEventListener('mouseup', closeDragElement);
				document.removeEventListener('mousemove', elementDrag);
			};

			handle.addEventListener('mousedown', dragMouseDown);
		}

		setVisualState(state) {
			if (!this.faceImage) return;
			this.faceImage.classList.remove('clippy-anim-nod', 'clippy-anim-think', 'clippy-anim-wiggle', 'clippy-anim-shake');

			if (window.ClippyAnimator) {
				if (state === 'talk' || state === 'happy') {
					window.ClippyAnimator.playTalking();
				} else if (state === 'think' || state === 'alert') {
					window.ClippyAnimator.playThinking();
				} else if (state === 'write') {
					window.ClippyAnimator.playForAction('compose_mail', { priority: 3 });
				} else {
					window.ClippyAnimator.playIdle();
				}
				return;
			}

			if (state === 'think' || state === 'alert') {
				this.faceImage.src = `${IMAGE_BASE}${FACES.THINK}`;
				this.faceImage.classList.add(state === 'think' ? 'clippy-anim-think' : 'clippy-anim-shake');
			} else {
				this.faceImage.src = `${IMAGE_BASE}${FACES.IDLE}`;
				if (state === 'talk' || state === 'happy') this.faceImage.classList.add('clippy-anim-nod');
				else if (state === 'surprise' || state === 'write') this.faceImage.classList.add('clippy-anim-wiggle');
			}
		}

		scrollLogToBottom() {
			if (!this.logElement) return;
			requestAnimationFrame(() => {
				if (this.logElement) this.logElement.scrollTop = this.logElement.scrollHeight;
			});
		}

		saveChatHistory() {
			if (!this.logElement) return;
			try {
				const messages = [];
				const rows = this.logElement.querySelectorAll('.clippy-message');
				rows.forEach(r => {
					if (r.classList.contains('clippy-message-user')) {
						messages.push({ role: 'user', html: r.innerHTML });
					} else if (r.classList.contains('clippy-message-assistant')) {
						messages.push({ role: 'assistant', html: r.innerHTML });
					}
				});
				const payload = JSON.stringify(messages.slice(-30));
				if (window.DeskStorage) window.DeskStorage.setItem(CHAT_STORAGE_KEY, payload);
				else localStorage.setItem(CHAT_STORAGE_KEY, payload);
			} catch (e) {}
		}

		loadChatHistory() {
			if (!this.logElement) return;
			try {
				const raw = window.DeskStorage ? window.DeskStorage.getItem(CHAT_STORAGE_KEY) : localStorage.getItem(CHAT_STORAGE_KEY);
				if (!raw) return;
				const messages = JSON.parse(raw);
				if (Array.isArray(messages) && messages.length > 0) {
					this.logElement.innerHTML = '';
					messages.forEach(m => {
						const row = document.createElement('div');
						row.className = `clippy-message clippy-message-${m.role}`;
						row.innerHTML = m.html;
						this.logElement.appendChild(row);
					});
					this.scrollLogToBottom();
				}
			} catch (e) {}
		}

		clearHistory() {
			if (this.logElement) {
				this.logElement.innerHTML = '';
			}
			if (window.DeskStorage) window.DeskStorage.removeItem(CHAT_STORAGE_KEY);
			else localStorage.removeItem(CHAT_STORAGE_KEY);
			if (window.ClippyBrain && typeof window.ClippyBrain.navigateGraphNode === 'function') {
				const entry = window.ClippyBrain.navigateGraphNode('greeting_root');
				const actions = window.ClippyBrain.buildGraphActions(entry.options);
				this.appendAssistantMessage(entry.text, actions);
			}
		}

		appendUserMessage(text) {
			if (!this.logElement) return;
			if (text && typeof text === 'string') {
				const trimmed = text.trim();
				if (trimmed && (this.inputHistory.length === 0 || this.inputHistory[this.inputHistory.length - 1] !== trimmed)) {
					this.inputHistory.push(trimmed);
					if (this.inputHistory.length > 50) this.inputHistory.shift();
				}
			}
			this.historyIndex = -1;
			this.currentDraft = '';
			const row = document.createElement('div');
			row.className = 'clippy-message clippy-message-user';
			row.innerHTML = parseMarkdown(text);
			this.logElement.appendChild(row);
			if (this.inputElement) this.inputElement.value = '';
			this.pruneOldActionBars(3);
			this.scrollLogToBottom();
			this.saveChatHistory();
		}

		pruneOldActionBars(keepLatestCount = 3) {
			if (!this.logElement) return;
			const actionBars = Array.from(this.logElement.querySelectorAll('.clippy-actions-bar'));
			if (actionBars.length <= keepLatestCount) return;
			const barsToHide = actionBars.slice(0, actionBars.length - keepLatestCount);
			barsToHide.forEach(bar => {
				bar.classList.add('clippy-actions-stale');
			});
		}

		createActivityCard(title, badgeText = 'Activity') {
			if (!this.logElement) return null;
			const row = document.createElement('div');
			row.className = 'clippy-message clippy-message-assistant';

			const card = document.createElement('div');
			card.className = 'clippy-activity-card';

			const header = document.createElement('div');
			header.className = 'clippy-activity-header';
			header.innerHTML = `
				<span>${title}</span>
				<span class="clippy-activity-badge">${badgeText}</span>
			`;

			const body = document.createElement('div');
			body.className = 'clippy-activity-body';

			card.appendChild(header);
			card.appendChild(body);
			row.appendChild(card);

			this.logElement.appendChild(row);
			this.scrollLogToBottom();

			return {
				messageRow: row,
				cardContainer: card,
				headerElement: header,
				bodyElement: body
			};
		}

		appendAssistantMessage(text, actions = null, onComplete = null) {
			if (!this.logElement) return;
			if (this.currentTypeInterval) {
				clearTimeout(this.currentTypeInterval);
				this.currentTypeInterval = null;
				if (this.activeMessageFinalizer) {
					this.activeMessageFinalizer();
					this.activeMessageFinalizer = null;
				}
			}

			const messageContainer = document.createElement('div');
			messageContainer.className = 'clippy-assistant-wrapper';

			const row = document.createElement('div');
			row.className = 'clippy-message clippy-message-assistant';
			messageContainer.appendChild(row);
			this.logElement.appendChild(messageContainer);

			this.isTyping = true;
			this.setVisualState('talk');
			const targetText = String(text || '');
			const parsedTarget = parseMarkdown(targetText);

			const attachActions = () => {
				if (actions && Array.isArray(actions) && actions.length > 0) {
					const btnBar = document.createElement('div');
					btnBar.className = 'clippy-actions-bar';
					actions.forEach(act => {
						const actBtn = document.createElement('button');
						actBtn.type = 'button';
						actBtn.className = 'clippy-action-btn';
						actBtn.textContent = act.label;
						actBtn.addEventListener('click', () => {
							if (window.ClippyAudio) window.ClippyAudio.play('action');
							if (act.onClick) act.onClick();
						});
						btnBar.appendChild(actBtn);
					});
					messageContainer.appendChild(btnBar);
					this.pruneOldActionBars(3);
					this.scrollLogToBottom();
				} else {
					this.pruneOldActionBars(3);
				}
			};

			let isFinalized = false;
			const finalizeMessage = (renderedContent) => {
				if (isFinalized) return;
				isFinalized = true;
				if (this.currentTypeInterval) {
					clearTimeout(this.currentTypeInterval);
					this.currentTypeInterval = null;
				}
				this.activeMessageFinalizer = null;
				row.innerHTML = renderedContent;
				this.isTyping = false;
				if (!window.ClippyAnimator || !window.ClippyAnimator.isPlayingProtectedAnimation()) {
					this.setVisualState('idle');
				}
				attachActions();
				this.saveChatHistory();
				this.scrollLogToBottom();
				if (onComplete) onComplete();
			};

			this.activeMessageFinalizer = () => finalizeMessage(parsedTarget);

			if (parsedTarget.length > 400 || parsedTarget.includes('<table') || parsedTarget.includes('clippy-activity-card') || parsedTarget.includes('clippy-profile-card')) {
				finalizeMessage(parsedTarget);
				return;
			}

			const tokens = [];
			let cursor = 0;
			while (cursor < parsedTarget.length) {
				if (parsedTarget.substring(cursor).startsWith('<span class="katex') || parsedTarget.substring(cursor).startsWith('<div class="katex') || parsedTarget.substring(cursor).startsWith('<pre><code')) {
					const endToken = parsedTarget.substring(cursor).startsWith('<pre><code') ? '</code></pre>' : (parsedTarget.substring(cursor).startsWith('<div') ? '</div>' : '</span>');
					const closeIdx = parsedTarget.indexOf(endToken, cursor);
					if (closeIdx !== -1) {
						const fullBlock = parsedTarget.substring(cursor, closeIdx + endToken.length);
						tokens.push({ type: 'atomic', value: fullBlock });
						cursor = closeIdx + endToken.length;
						continue;
					}
				}
				if (parsedTarget[cursor] === '<') {
					const closeIdx = parsedTarget.indexOf('>', cursor);
					if (closeIdx !== -1) {
						tokens.push({ type: 'tag', value: parsedTarget.substring(cursor, closeIdx + 1) });
						cursor = closeIdx + 1;
						continue;
					}
				}
				if (parsedTarget[cursor] === '&') {
					const closeIdx = parsedTarget.indexOf(';', cursor);
					if (closeIdx !== -1 && closeIdx - cursor <= 10) {
						tokens.push({ type: 'entity', value: parsedTarget.substring(cursor, closeIdx + 1) });
						cursor = closeIdx + 1;
						continue;
					}
				}
				tokens.push({ type: 'char', value: parsedTarget[cursor] });
				cursor++;
			}

			const mood = window.ClippyBrain ? window.ClippyBrain.getMood() : 'OPTIMISTIC';
			const profiles = (window.ClippyKnowledge && window.ClippyKnowledge.TYPING_PROFILES) || {};
			const profile = profiles[mood] || profiles.OPTIMISTIC || {
				baseSpeed: 16, variance: 6, typoRate: 0.008, uncorrectedRate: 0.05, maxLag: 2, correctionErrorRate: 0.03, pauseMult: 1.0
			};

			const memory = window.ClippyBrain ? window.ClippyBrain.memory : null;
			const brainState = window.ClippyBrain ? window.ClippyBrain.state : null;
			const now = Date.now();
			const timeElapsedSinceLast = brainState && brainState.lastInteractionTime ? Math.max(0, (now - brainState.lastInteractionTime) / 1000) : 0;
			const totalDiscussionTurns = brainState ? (brainState.turnCount || 0) : 0;
			const userAvgResponseTime = (memory && memory.userResponseTimeStats && memory.userResponseTimeStats.median) || 4.0;
			const suggestionPreference = (memory && memory.inputModeStats && memory.inputModeStats.suggestionRatio) || 0.5;

			const charTokens = tokens.filter(t => t.type === 'char');
			const charCount = charTokens.length;
			const wordCount = charTokens.filter(t => t.value === ' ').length + 1;
			const sentenceMatches = targetText.match(/[^.!?]+[.!?]+(\s|$)/g) || [targetText];
			const sentenceCount = Math.max(1, sentenceMatches.length);

			let dynamicBaseSpeed = profile.baseSpeed;
			if (charCount > 180) dynamicBaseSpeed *= 0.82;
			else if (charCount < 35) dynamicBaseSpeed *= 1.18;

			if (wordCount > 30) dynamicBaseSpeed *= 0.88;
			else if (wordCount < 8) dynamicBaseSpeed *= 1.10;

			if (sentenceCount > 3) dynamicBaseSpeed *= 0.90;
			if (totalDiscussionTurns > 12) dynamicBaseSpeed *= 0.94;
			if (timeElapsedSinceLast > 90) dynamicBaseSpeed *= 1.12;

			if (userAvgResponseTime < 2.5) dynamicBaseSpeed *= 0.85;
			else if (userAvgResponseTime > 15) dynamicBaseSpeed *= 1.15;

			if (suggestionPreference > 0.7) dynamicBaseSpeed *= 0.92;
			else if (suggestionPreference < 0.3) dynamicBaseSpeed *= 1.05;

			const keyboardNeighbors = (window.ClippyKnowledge && window.ClippyKnowledge.KEYBOARD_NEIGHBORS) || {};

			let currentTokenIndex = 0;
			let accumulatedHtml = '';
			let pendingCorrectionQueue = null;

			const typeNext = () => {
				if (pendingCorrectionQueue) {
					const step = pendingCorrectionQueue.shift();
					if (step) {
						accumulatedHtml = step.html;
						row.innerHTML = accumulatedHtml;
						if (step.sound && window.ClippyAudio) window.ClippyAudio.play(step.sound);
						this.scrollLogToBottom();
						this.currentTypeInterval = setTimeout(typeNext, step.delay);
						return;
					}
					pendingCorrectionQueue = null;
				}

				if (currentTokenIndex >= tokens.length) {
					finalizeMessage(parsedTarget);
					return;
				}

				const token = tokens[currentTokenIndex];

				if (token.type === 'tag' || token.type === 'atomic' || token.type === 'entity') {
					accumulatedHtml += token.value;
					currentTokenIndex++;
					row.innerHTML = accumulatedHtml;
					this.scrollLogToBottom();
					this.currentTypeInterval = setTimeout(typeNext, 4);
					return;
				}

				const char = token.value;
				const lower = char.toLowerCase();

				const shouldTriggerTypo = Math.random() < profile.typoRate && keyboardNeighbors[lower] && currentTokenIndex > 4 && currentTokenIndex < tokens.length - 6;

				if (shouldTriggerTypo) {
					const neighbors = keyboardNeighbors[lower];
					const wrongChar = neighbors.charAt(Math.floor(Math.random() * neighbors.length));
					const typedWrong = (char === char.toUpperCase()) ? wrongChar.toUpperCase() : wrongChar;

					const isUncorrected = Math.random() < profile.uncorrectedRate;
					if (isUncorrected) {
						accumulatedHtml += typedWrong;
						currentTokenIndex++;
						row.innerHTML = accumulatedHtml;
						if (window.ClippyAudio) window.ClippyAudio.play('type');
						this.scrollLogToBottom();
						this.currentTypeInterval = setTimeout(typeNext, dynamicBaseSpeed);
						return;
					}

					const isTargetedCorrection = Math.random() < (profile.targetedCorrectionRate || 0.20);
					const lag = isTargetedCorrection ? 0 : Math.min(profile.maxLag || 3, Math.floor(Math.random() * (profile.maxLag || 3)) + 1);
					const futureChars = [];
					for (let f = 1; f <= lag && (currentTokenIndex + f) < tokens.length; f++) {
						if (tokens[currentTokenIndex + f].type === 'char') {
							futureChars.push(tokens[currentTokenIndex + f].value);
						}
					}

					const queue = [];
					let tempHtml = accumulatedHtml + typedWrong;
					queue.push({ html: tempHtml, delay: dynamicBaseSpeed, sound: 'type' });

					futureChars.forEach(fc => {
						tempHtml += fc;
						queue.push({ html: tempHtml, delay: dynamicBaseSpeed * 0.95, sound: 'type' });
					});

					const hesitationDelay = 140 + Math.random() * 180;
					queue.push({ html: tempHtml, delay: hesitationDelay, sound: null });

					if (isTargetedCorrection && futureChars.length === 0) {
						tempHtml = accumulatedHtml;
						queue.push({ html: tempHtml, delay: 60, sound: 'backspace' });
					} else {
						for (let b = 0; b < futureChars.length + 1; b++) {
							tempHtml = tempHtml.slice(0, -1);
							queue.push({ html: tempHtml, delay: 45 + Math.random() * 30, sound: 'backspace' });
						}
					}

					const makeCorrectionTypo = Math.random() < (profile.correctionErrorRate || 0.04);
					if (makeCorrectionTypo) {
						const secondWrong = neighbors.charAt(Math.floor(Math.random() * neighbors.length));
						tempHtml += secondWrong;
						queue.push({ html: tempHtml, delay: dynamicBaseSpeed + 20, sound: 'type' });
						tempHtml = tempHtml.slice(0, -1);
						queue.push({ html: tempHtml, delay: 55, sound: 'backspace' });
					}

					tempHtml += char;
					queue.push({ html: tempHtml, delay: dynamicBaseSpeed + 35, sound: 'type' });

					pendingCorrectionQueue = queue;
					currentTokenIndex++;
					typeNext();
					return;
				}

				accumulatedHtml += char;
				currentTokenIndex++;
				row.innerHTML = accumulatedHtml;

				let delay = dynamicBaseSpeed + (Math.random() * (profile.variance * 2) - profile.variance);

				const sentPause = profile.sentencePauseMult || 1.3;
				const qPause = profile.interrogativePauseMult || 1.2;
				const exPause = profile.exclamativePauseMult || 0.85;

				if (char === '.' || char === '…') delay += 170 * profile.pauseMult * sentPause;
				else if (char === '?') delay += 160 * profile.pauseMult * qPause;
				else if (char === '!') delay += 130 * profile.pauseMult * exPause;
				else if (char === ',' || char === ';' || char === ':') delay += 85 * profile.pauseMult;
				else if (char === ' ') delay += 22 * profile.pauseMult;

				if (currentTokenIndex % 2 === 0 && window.ClippyAudio) {
					window.ClippyAudio.play('type');
				}
				this.scrollLogToBottom();

				this.currentTypeInterval = setTimeout(typeNext, Math.max(3, delay));
			};

			typeNext();
		}

		ensureBubble() {
			if (this.bubbleElement) return this.bubbleElement;
			this.bubbleElement = document.createElement('div');
			this.bubbleElement.className = 'clippy-idle-bubble hidden';

			const anchorContainer = document.getElementById('clippy-taskbar-icon') || document.querySelector('.clippy-standalone-hero') || document.body;
			anchorContainer.appendChild(this.bubbleElement);
			return this.bubbleElement;
		}

		hideBubble() {
			if (this.bubbleElement) this.bubbleElement.classList.add('hidden');
			if (this.bubbleHideTimer) {
				clearTimeout(this.bubbleHideTimer);
				this.bubbleHideTimer = null;
			}
		}

		showIdleBubble(text, onClickAction = null, customAnimation = null) {
			if (this.isOpen) return;
			const bubble = this.ensureBubble();
			bubble.innerHTML = '';

			const contentSpan = document.createElement('span');
			contentSpan.textContent = text;
			contentSpan.style.cursor = 'pointer';
			bubble.appendChild(contentSpan);

			const closeBtn = document.createElement('button');
			closeBtn.type = 'button';
			closeBtn.className = 'clippy-idle-bubble-close';
			closeBtn.innerHTML = '&times;';
			closeBtn.title = 'Dismiss';
			closeBtn.addEventListener('click', (e) => {
				e.stopPropagation();
				this.hideBubble();
			});
			bubble.appendChild(closeBtn);

			bubble.classList.remove('hidden');
			if (window.ClippyAnimator) {
				if (customAnimation) {
					window.ClippyAnimator.play(customAnimation, { priority: 4, lock: true });
				} else if (!window.ClippyAnimator.isPlayingProtectedAnimation()) {
					window.ClippyAnimator.play('GetAttention', { priority: 3, lock: true });
				}
			}
			if (window.ClippyAudio) window.ClippyAudio.play('popup');

			const executeBubble = () => {
				this.hideBubble();
				if (typeof onClickAction === 'function') {
					onClickAction();
				} else if (window.ClippyAgent) {
					window.ClippyAgent.open();
				}
			};

			contentSpan.onclick = executeBubble;

			if (this.bubbleHideTimer) clearTimeout(this.bubbleHideTimer);
			this.bubbleHideTimer = setTimeout(() => this.hideBubble(), 9500);
		}

		open() {
			if (!this.popupElement) {
				this.buildPopup();
			}
			this.popupElement.classList.remove('hidden');
			this.isOpen = true;
			this.hideBubble();
			if (window.ClippyAudio) window.ClippyAudio.play('popup');
			setTimeout(() => {
				if (this.inputElement) this.inputElement.focus();
			}, 50);
		}

		renderSuggestions(customSuggestions = null) {
			if (!this.suggestionsContainer) return;
			this.suggestionsContainer.innerHTML = '';
			const maxCount = (window.SettingsApp && window.SettingsApp.get('clippyMaxSuggestions')) || 8;
			const shouldRandomize = (window.SettingsApp && window.SettingsApp.get('clippySuggestionsRandomize') !== false);
			const fullPool = customSuggestions || (window.ClippyKnowledge && window.ClippyKnowledge.QUICK_SUGGESTIONS) || [];
			
			let selectedPool = [];
			if (customSuggestions) {
				selectedPool = customSuggestions.slice(0, maxCount);
			} else if (shouldRandomize) {
				selectedPool = [...fullPool].sort(() => Math.random() - 0.5).slice(0, maxCount);
			} else {
				selectedPool = fullPool.slice(0, maxCount);
			}

			selectedPool.forEach(sug => {
				const chip = document.createElement('button');
				chip.type = 'button';
				chip.className = 'clippy-suggestion-chip';
				chip.textContent = sug;
				chip.addEventListener('click', () => {
					if (this.onSendHandler) this.onSendHandler(sug, true);
				});
				this.suggestionsContainer.appendChild(chip);
			});
		}

		updateSuggestions(customList) {
			this.renderSuggestions(customList);
		}

		close() {
			if (this.popupElement) this.popupElement.classList.add('hidden');
			this.isOpen = false;
			this.setVisualState('idle');
		}

		toggle() {
			if (this.isOpen) this.close();
			else this.open();
		}
	}

	window.ClippyUI = new ClippyViewController();
})();
