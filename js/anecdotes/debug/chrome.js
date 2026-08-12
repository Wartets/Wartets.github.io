export function initScrollProgressBar() {
	const progressBar = document.getElementById('scroll-progress-bar');
	if (!progressBar) return;

	const update = () => {
		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
		const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
		const clamped = Math.min(100, Math.max(0, scrollPercent));
		progressBar.style.width = `${clamped}%`;
		progressBar.setAttribute('aria-valuenow', Math.round(clamped).toString());
	};

	window.addEventListener('scroll', update, { passive: true });
	window.addEventListener('resize', update, { passive: true });
	update();
}

export function initBackToTop() {
	const btn = document.getElementById('backToTop');
	if (!btn) return;

	window.addEventListener('scroll', () => {
		if (window.scrollY > 400) btn.classList.add('visible');
		else btn.classList.remove('visible');
	}, { passive: true });

	btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
