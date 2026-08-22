(function () {
	'use strict';

	const IMAGE_BASE = '../assets/images/desk/clippy/';
	const TYPEWRITER_SPEED_MS = 14;

	const FACES = {
		IDLE: 'idle.png',
		THINK: 'think.png'
	};

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
		}

		buildPopup(onSendHandler, onActionHandler) {
			if (onSendHandler) this.onSendHandler = onSendHandler;
			if (onActionHandler) this.onActionHandler = onActionHandler;

			if (this.popupElement) return this.popupElement;

			this.popupElement = document.createElement('div');
			this.popupElement.id = 'clippy-popup';
			this.popupElement.className = 'clippy-popup hidden';
			this.popupElement.setAttribute('role', 'dialog');
			this.popupElement.setAttribute('aria-label', 'Clippy Assistant');

			this.popupElement.innerHTML = `
				<div class="clippy-popup-header">
					<div class="clippy-header-left">
						<img src="${IMAGE_BASE}${FACES.IDLE}" alt="Clippy" class="clippy-popup-avatar">
						<span class="clippy-popup-title">Clippy</span>
					</div>
					<div class="clippy-header-controls">
						<button type="button" class="clippy-header-btn clippy-sound-toggle" title="Toggle Sound">[SND]</button>
						<button type="button" class="clippy-popup-close" title="Close">&times;</button>
					</div>
				</div>
				<div class="clippy-popup-log"></div>
				<div class="clippy-suggestions-bar"></div>
				<div class="clippy-popup-input-row">
					<input type="text" class="clippy-popup-input" placeholder="Chat with Clippy or enter a command...">
					<button type="button" class="clippy-popup-send">Send</button>
				</div>
			`;

			const screenContainer = document.getElementById('screen-frame') || document.body;
			screenContainer.appendChild(this.popupElement);

			this.logElement = this.popupElement.querySelector('.clippy-popup-log');
			this.inputElement = this.popupElement.querySelector('.clippy-popup-input');
			this.faceImage = this.popupElement.querySelector('.clippy-popup-avatar');
			this.suggestionsContainer = this.popupElement.querySelector('.clippy-suggestions-bar');
			const headerHandle = this.popupElement.querySelector('.clippy-popup-header');
			const sendBtn = this.popupElement.querySelector('.clippy-popup-send');
			const closeBtn = this.popupElement.querySelector('.clippy-popup-close');
			const soundBtn = this.popupElement.querySelector('.clippy-sound-toggle');

			this.makeDraggable(this.popupElement, headerHandle);

			const suggestions = (window.ClippyKnowledge && window.ClippyKnowledge.QUICK_SUGGESTIONS) || [];
			suggestions.forEach(sug => {
				const chip = document.createElement('button');
				chip.type = 'button';
				chip.className = 'clippy-suggestion-chip';
				chip.textContent = sug;
				chip.addEventListener('click', () => {
					if (this.onSendHandler) this.onSendHandler(sug);
				});
				this.suggestionsContainer.appendChild(chip);
			});

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

			this.inputElement.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') {
					e.preventDefault();
					doSubmit();
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
			if (this.logElement) {
				this.logElement.scrollTop = this.logElement.scrollHeight;
			}
		}

		appendUserMessage(text) {
			if (!this.logElement) return;
			const row = document.createElement('div');
			row.className = 'clippy-message clippy-message-user';
			row.textContent = text;
			this.logElement.appendChild(row);
			if (this.inputElement) this.inputElement.value = '';
			this.scrollLogToBottom();
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
				clearInterval(this.currentTypeInterval);
				this.currentTypeInterval = null;
			}

			const row = document.createElement('div');
			row.className = 'clippy-message clippy-message-assistant';
			this.logElement.appendChild(row);

			this.isTyping = true;
			this.setVisualState('talk');
			let index = 0;
			const targetText = String(text || '');

			const finalizeMessage = () => {
				if (this.currentTypeInterval) {
					clearInterval(this.currentTypeInterval);
					this.currentTypeInterval = null;
				}
				row.textContent = targetText;
				this.isTyping = false;
				this.setVisualState('idle');

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
					this.logElement.appendChild(btnBar);
					this.scrollLogToBottom();
				}

				if (onComplete) onComplete();
			};

			if (targetText.length > 300) {
				finalizeMessage();
				return;
			}

			this.currentTypeInterval = setInterval(() => {
				if (index < targetText.length) {
					row.textContent += targetText.charAt(index);
					if (index % 5 === 0 && window.ClippyAudio) {
						window.ClippyAudio.play('type');
					}
					index++;
					this.scrollLogToBottom();
				} else {
					finalizeMessage();
				}
			}, TYPEWRITER_SPEED_MS);
		}

		ensureBubble() {
			if (this.bubbleElement) return this.bubbleElement;
			this.bubbleElement = document.createElement('div');
			this.bubbleElement.className = 'clippy-idle-bubble hidden';

			const iconContainer = document.getElementById('clippy-taskbar-icon');
			if (iconContainer) iconContainer.appendChild(this.bubbleElement);
			return this.bubbleElement;
		}

		hideBubble() {
			if (this.bubbleElement) this.bubbleElement.classList.add('hidden');
			if (this.bubbleHideTimer) {
				clearTimeout(this.bubbleHideTimer);
				this.bubbleHideTimer = null;
			}
		}

		showIdleBubble(text) {
			if (this.isOpen) return;
			const bubble = this.ensureBubble();
			bubble.textContent = text;
			bubble.classList.remove('hidden');
			if (window.ClippyAudio) window.ClippyAudio.play('popup');

			if (this.bubbleHideTimer) clearTimeout(this.bubbleHideTimer);
			this.bubbleHideTimer = setTimeout(() => this.hideBubble(), 8000);
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
