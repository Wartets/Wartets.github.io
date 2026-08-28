(function () {
	'use strict';

	function wireInteractiveAvatar() {
		const avatar = document.getElementById('clippy-standalone-avatar');
		const hero = document.querySelector('.clippy-standalone-hero');
		if (avatar && window.ClippyAnimator) {
			window.ClippyAnimator.registerElement(avatar);
		}
		if (hero) {
			hero.addEventListener('click', () => {
				if (!window.ClippyUI || !window.ClippyUI.isOpen) {
					if (window.ClippyAgent) window.ClippyAgent.open();
				} else if (window.ClippyAnimator && !window.ClippyAnimator.isPlayingProtectedAnimation()) {
					if (window.ClippyAudio) window.ClippyAudio.play('action');
					window.ClippyAnimator.play('GetAttention', { priority: 4, lock: true });
				}
			});
			hero.addEventListener('mouseenter', () => {
				if (window.ClippyAnimator && !window.ClippyAnimator.isPlayingProtectedAnimation()) {
					window.ClippyAnimator.playLook('down', { priority: 1 });
				}
			});
		}
	}

	function bootstrap() {
		if (!window.ClippyAgent) {
			setTimeout(bootstrap, 60);
			return;
		}
		wireInteractiveAvatar();
		window.ClippyAgent.open();
		if (window.ClippyAnimator) {
			window.ClippyAnimator.play('Greeting', { priority: 6, lock: true });
		}
	}

	if (document.readyState === 'complete' || document.readyState === 'interactive') {
		bootstrap();
	} else {
		document.addEventListener('DOMContentLoaded', bootstrap);
	}
})();
