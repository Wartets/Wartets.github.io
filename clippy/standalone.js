(function () {
	'use strict';

	function wireReopenHandle() {
		const hero = document.querySelector('.clippy-standalone-hero');
		if (!hero) return;
		hero.addEventListener('click', () => {
			if (window.ClippyAgent && (!window.ClippyUI || !window.ClippyUI.isOpen)) {
				window.ClippyAgent.open();
			}
		});
	}

	function bootstrap() {
		if (!window.ClippyAgent) {
			setTimeout(bootstrap, 60);
			return;
		}
		wireReopenHandle();
		window.ClippyAgent.open();
	}

	if (document.readyState === 'complete' || document.readyState === 'interactive') {
		bootstrap();
	} else {
		document.addEventListener('DOMContentLoaded', bootstrap);
	}
})();
