function getMoonPhaseDayNumber() {
	const synodicMonth = 29.53058867;
	const knownNewMoon = new Date('2026-07-14T11:43:00Z').getTime();
	const diff = (Date.now() - knownNewMoon) / 86400000;
	let age = diff % synodicMonth;
	if (age < 0) age += synodicMonth;
	return Math.max(1, Math.min(30, Math.floor(age) + 1));
}

function getMoonPhaseImagePath(basePath = '/assets/images/moon_phases/') {
	return `${basePath}${getMoonPhaseDayNumber().toString().padStart(2, '0')}.png`;
}

function updateFaviconToMoonPhase(basePath) {
	const link = document.querySelector("link[rel='icon']");
	if (link) link.href = getMoonPhaseImagePath(basePath);
}

function updateFooterYear() {
	const yearEl = document.getElementById('current-year');
	if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function initNavTools() {
	const navTools = document.querySelector('.nav-tools');
	if (!navTools) return;

	const trigger = navTools.querySelector('.nav-tools-trigger');
	const searchInput = navTools.querySelector('#searchInput');
	const CLOSE_DELAY = 550;
	let closeTimer = null;
	let isPointerInside = false;

	function clearCloseTimer() {
		if (closeTimer) {
			clearTimeout(closeTimer);
			closeTimer = null;
		}
	}

	function onWidthTransitionEnd(event) {
		if (event.propertyName !== 'width') return;
		if (navTools.classList.contains('is-open')) {
			navTools.classList.add('is-settled');
		}
	}

	function openTools() {
		clearCloseTimer();
		if (navTools.classList.contains('is-open')) return;
		navTools.classList.add('is-open');
		if (trigger) trigger.setAttribute('aria-expanded', 'true');
	}

	function hasActiveContent() {
		if (searchInput && searchInput.value.trim().length > 0) return true;
		if (navTools.querySelector('.filter-part.open')) return true;
		if (navTools.contains(document.activeElement) && document.activeElement !== document.body) return true;
		return false;
	}

	function closeTools(force) {
		clearCloseTimer();
		if (!force && hasActiveContent()) return;
		navTools.classList.remove('is-settled');
		navTools.classList.remove('is-open');
		if (trigger) trigger.setAttribute('aria-expanded', 'false');
	}

	function scheduleClose() {
		clearCloseTimer();
		closeTimer = setTimeout(() => {
			if (!isPointerInside) closeTools(false);
		}, CLOSE_DELAY);
	}

	navTools.addEventListener('transitionend', onWidthTransitionEnd);

	navTools.addEventListener('mouseenter', () => {
		isPointerInside = true;
		openTools();
	});

	navTools.addEventListener('mouseleave', () => {
		isPointerInside = false;
		scheduleClose();
	});

	navTools.addEventListener('focusin', openTools);

	navTools.addEventListener('focusout', () => {
		requestAnimationFrame(() => {
			if (!navTools.contains(document.activeElement)) {
				scheduleClose();
			}
		});
	});

	if (trigger) {
		trigger.addEventListener('click', () => {
			if (navTools.classList.contains('is-open')) {
				closeTools(true);
			} else {
				openTools();
				if (searchInput) searchInput.focus();
			}
		});
	}

	if (searchInput) {
		searchInput.addEventListener('input', () => {
			if (searchInput.value.trim().length > 0) openTools();
		});
	}

	document.addEventListener('click', (event) => {
		if (!navTools.contains(event.target)) {
			closeTools(false);
		}
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && navTools.classList.contains('is-open') && !hasActiveContent()) {
			closeTools(true);
		}
	});

	if (searchInput && searchInput.value.trim().length > 0) {
		navTools.classList.add('is-open', 'is-settled');
		if (trigger) trigger.setAttribute('aria-expanded', 'true');
	}
}

function initSitePreload() {
	if (!('requestIdleCallback' in window)) {
		window.requestIdleCallback = function(callback) {
			return setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 15 }), 200);
		};
	}

	const alreadyPrefetched = new Set();

	function prefetchUrl(url) {
		if (!url || alreadyPrefetched.has(url)) return;
		alreadyPrefetched.add(url);
		const link = document.createElement('link');
		link.rel = 'prefetch';
		link.href = url;
		document.head.appendChild(link);
	}

	function resolveInternalTargets() {
		const root = window.SITE_ROOT || '';
		return ['', 'index.html', 'projects/', 'library/', 'music/', 'poetry/']
			.map(path => {
				try {
					return new URL(root + path, window.location.href).href;
				} catch (error) {
					return null;
				}
			})
			.filter(Boolean);
	}

	function prefetchVisibleLinks() {
		document.querySelectorAll('a[href]').forEach(anchor => {
			const href = anchor.getAttribute('href');
			if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
			let absoluteUrl;
			try {
				absoluteUrl = new URL(href, window.location.href);
			} catch (error) {
				return;
			}
			if (absoluteUrl.origin !== window.location.origin) return;
			if (absoluteUrl.href === window.location.href) return;
			prefetchUrl(absoluteUrl.href);
		});
	}

	requestIdleCallback(() => {
		resolveInternalTargets().forEach(prefetchUrl);
		prefetchVisibleLinks();
	}, { timeout: 3000 });
}

function registerServiceWorker() {
	if (!('serviceWorker' in navigator)) return;
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js').catch(() => {});
	});
}

document.addEventListener('DOMContentLoaded', () => {
	updateFaviconToMoonPhase();
	updateFooterYear();
	initNavTools();
	initSitePreload();
	registerServiceWorker();
});
