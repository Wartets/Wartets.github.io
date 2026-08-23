(function () {
	'use strict';

	function bootstrap() {
		if (!window.ClippyAgent) {
			setTimeout(bootstrap, 60);
			return;
		}
		window.ClippyAgent.open();
	}

	if (document.readyState === 'complete' || document.readyState === 'interactive') {
		bootstrap();
	} else {
		document.addEventListener('DOMContentLoaded', bootstrap);
	}
})();
