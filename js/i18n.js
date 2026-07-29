const defaultLang = 'en';
let currentLang = localStorage.getItem('site_lang') || defaultLang;
window.translations = {};
window.SITE_ROOT = window.SITE_ROOT || '';
window.currentSiteLang = currentLang;

function resolveKey(translations, path) {
	const keys = path.split('.');
	let value = translations;
	keys.forEach(key => {
		if (value) value = value[key];
	});
	return value;
}

function applyTranslations(translations) {
	document.querySelectorAll('[data-i18n]').forEach(el => {
		const value = resolveKey(translations, el.getAttribute('data-i18n'));
		if (!value) return;
		if (el.tagName === 'META') {
			el.setAttribute('content', value);
		} else if (el.tagName === 'TITLE') {
			document.title = value;
		} else {
			el.innerHTML = value;
		}
	});

	document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
		const value = resolveKey(translations, el.getAttribute('data-i18n-placeholder'));
		if (value) el.setAttribute('placeholder', value);
	});

	document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
		const value = resolveKey(translations, el.getAttribute('data-i18n-aria-label'));
		if (value) el.setAttribute('aria-label', value);
	});

	document.querySelectorAll('[data-i18n-title]').forEach(el => {
		const value = resolveKey(translations, el.getAttribute('data-i18n-title'));
		if (value) el.setAttribute('title', value);
	});
}

window.t = function(path) {
	const keys = path.split('.');
	let value = window.translations;
	for (const key of keys) {
		if (value) value = value[key];
		else return path;
	}
	return value || path;
};

window.tData = function(field, fallbackLang = 'en') {
	if (field === null || field === undefined) return '';
	if (typeof field === 'string') return field;
	const lang = window.currentSiteLang || defaultLang;
	return field[lang] || field[fallbackLang] || field[Object.keys(field)[0]] || '';
};

window.tTag = function(tag) {
	if (!tag) return '';
	const key = String(tag).toLowerCase();
	const dict = (window.translations && window.translations.tags) || {};
	if (dict[key]) return dict[key];
	return key.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

window.tGenre = function(genre) {
	if (!genre) return '';
	const dict = (window.translations && window.translations.genres) || {};
	return dict[genre] || genre;
};

function applyLanguageData(lang, data) {
	window.translations = data;
	window.currentSiteLang = lang;
	applyTranslations(data);
	document.documentElement.lang = lang;
	localStorage.setItem('site_lang', lang);

	const langCurrent = document.getElementById('langCurrent');
	if (langCurrent) {
		langCurrent.textContent = lang === 'fr' ? 'Français' : 'English';
	}

	const announcer = document.getElementById('aria-status-announcer');
	if (announcer) {
		announcer.textContent = lang === 'fr' ? 'Langue changée en français.' : 'Language changed to English.';
	}

	const event = new CustomEvent('i18nReady', { detail: { lang } });
	document.dispatchEvent(event);
}

function loadLanguage(lang) {
	const cacheKey = `i18n_cache_${lang}`;
	let cachedRaw = null;

	try {
		cachedRaw = sessionStorage.getItem(cacheKey);
	} catch (error) {
		cachedRaw = null;
	}

	if (cachedRaw) {
		try {
			applyLanguageData(lang, JSON.parse(cachedRaw));
		} catch (error) {
			cachedRaw = null;
		}
	}

	fetch(`${window.SITE_ROOT}locales/${lang}.json`)
		.then(response => {
			if (!response.ok) throw new Error('Translation file not found');
			return response.json();
		})
		.then(data => {
			const serialized = JSON.stringify(data);
			if (cachedRaw === serialized) return;
			try {
				sessionStorage.setItem(cacheKey, serialized);
			} catch (error) {}
			applyLanguageData(lang, data);
		})
		.catch(error => {
			console.error('Error loading language file:', error);
			if (lang !== 'en' && !cachedRaw) loadLanguage('en');
		});
}

window.switchLanguage = function(lang) {
	currentLang = lang;
	loadLanguage(lang);
};

document.addEventListener("DOMContentLoaded", () => {
	const customLangSelector = document.getElementById('customLangSelector');

	if (customLangSelector) {
		const trigger = customLangSelector.querySelector('.lang-trigger');
		const options = customLangSelector.querySelectorAll('.lang-options li');

		const toggleDropdown = (open) => {
			const isOpened = open !== undefined ? open : !customLangSelector.classList.contains('open');
			customLangSelector.classList.toggle('open', isOpened);
			if (trigger) trigger.setAttribute('aria-expanded', isOpened.toString());
		};

		if (trigger) {
			trigger.addEventListener('click', (e) => {
				e.stopPropagation();
				toggleDropdown();
			});
		}

		options.forEach(opt => {
			const selectLang = (e) => {
				const selectedLang = e.currentTarget.getAttribute('data-lang');
				window.switchLanguage(selectedLang);
				toggleDropdown(false);
			};

			opt.addEventListener('click', selectLang);
			opt.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					selectLang(e);
				}
			});
		});

		document.addEventListener('click', () => {
			toggleDropdown(false);
		});

		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && customLangSelector.classList.contains('open')) {
				toggleDropdown(false);
				if (trigger) trigger.focus();
			}
		});
	}

	loadLanguage(currentLang);
});
