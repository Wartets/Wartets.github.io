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

document.addEventListener('DOMContentLoaded', () => {
	updateFaviconToMoonPhase();
	updateFooterYear();
});
