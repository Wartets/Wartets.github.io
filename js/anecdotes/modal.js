let lastFocusedElement = null;
let activeModal = null;

function getFocusableElements(container) {
	return Array.from(container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'));
}

function trapFocus(event) {
	if (!activeModal || event.key !== 'Tab') return;
	const focusable = getFocusableElements(activeModal);
	if (focusable.length === 0) return;
	const first = focusable[0];
	const last = focusable[focusable.length - 1];
	if (event.shiftKey && document.activeElement === first) {
		event.preventDefault();
		last.focus();
	} else if (!event.shiftKey && document.activeElement === last) {
		event.preventDefault();
		first.focus();
	}
}

function preventTouchScroll(event) {
	if (activeModal && !activeModal.contains(event.target)) {
		event.preventDefault();
	}
}

function handleKeydown(event) {
	if (event.key === 'Escape') closeModal();
	trapFocus(event);
}

export function openModal(modalElement, triggerElement) {
	lastFocusedElement = triggerElement || document.activeElement;
	activeModal = modalElement;

	const main = document.getElementById('main-content') || document.querySelector('main');
	if (main) main.setAttribute('aria-hidden', 'true');

	document.body.style.overflow = 'hidden';
	document.body.style.touchAction = 'none';
	document.addEventListener('touchmove', preventTouchScroll, { passive: false });
	document.addEventListener('keydown', handleKeydown);

	modalElement.classList.add('is-open');
	modalElement.setAttribute('aria-hidden', 'false');

	const focusable = getFocusableElements(modalElement);
	if (focusable.length > 0) focusable[0].focus();
	else modalElement.focus();
}

export function closeModal() {
	if (!activeModal) return;

	const main = document.getElementById('main-content') || document.querySelector('main');
	if (main) main.removeAttribute('aria-hidden');

	document.body.style.overflow = '';
	document.body.style.touchAction = '';
	document.removeEventListener('touchmove', preventTouchScroll);
	document.removeEventListener('keydown', handleKeydown);

	activeModal.classList.remove('is-open');
	activeModal.setAttribute('aria-hidden', 'true');
	activeModal = null;

	if (lastFocusedElement) {
		if (lastFocusedElement.hasAttribute('aria-expanded')) {
			lastFocusedElement.setAttribute('aria-expanded', 'false');
		}
		if (typeof lastFocusedElement.focus === 'function') {
			lastFocusedElement.focus();
		}
	}
	lastFocusedElement = null;
}

export function isModalOpen() {
	return activeModal !== null;
}
