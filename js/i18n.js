document.addEventListener("DOMContentLoaded", () => {
    const defaultLang = 'en';
    let currentLang = localStorage.getItem('site_lang') || defaultLang;
    window.translations = {};

    const customLangSelector = document.getElementById('customLangSelector');
    const langCurrent = document.getElementById('langCurrent');

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
                switchLanguage(selectedLang);
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
    }

    function loadLanguage(lang) {
        fetch(`locales/${lang}.json`)
            .then(response => {
                if (!response.ok) throw new Error('Translation file not found');
                return response.json();
            })
            .then(data => {
                window.translations = data;
                applyTranslations(data);
                document.documentElement.lang = lang;
                localStorage.setItem('site_lang', lang);

                if (langCurrent) {
                    langCurrent.textContent = lang === 'fr' ? 'Français' : 'English';
                }

                const event = new CustomEvent('i18nReady', { detail: { lang } });
                document.dispatchEvent(event);
            })
            .catch(error => {
                console.error('Error loading language file:', error);
                if (lang !== 'en') loadLanguage('en');
            });
    }

    function applyTranslations(translations) {
        const elements = document.querySelectorAll('[data-i18n]');

        elements.forEach(el => {
            const keys = el.getAttribute('data-i18n').split('.');
            let value = translations;

            keys.forEach(key => {
                if (value) value = value[key];
            });

            if (value) {
                if (el.tagName === 'META') {
                    el.setAttribute('content', value);
                } else if (el.tagName === 'TITLE') {
                    document.title = value;
                } else {
                    el.innerHTML = value;
                }
            }
        });
    }

    window.switchLanguage = function(lang) {
        currentLang = lang;
        loadLanguage(lang);
    };

    window.t = function(path) {
        const keys = path.split('.');
        let value = window.translations;
        for (const key of keys) {
            if (value) value = value[key];
            else return path;
        }
        return value || path;
    };

    loadLanguage(currentLang);
});
