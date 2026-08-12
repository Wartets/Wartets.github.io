function resolveIntlTag(lang) {
	return (typeof window !== 'undefined' && window.getIntlTag) ? window.getIntlTag(lang) : 'en-US';
}

export function formatNumber(value, lang) {
	return new Intl.NumberFormat(resolveIntlTag(lang)).format(value);
}

export function formatDate(dateObj, lang, options = { day: 'numeric', month: 'long' }) {
	return new Intl.DateTimeFormat(resolveIntlTag(lang), options).format(dateObj);
}

export function pluralize(lang, value, forms) {
	const rules = new Intl.PluralRules(resolveIntlTag(lang));
	const category = rules.select(value);
	return forms[category] || forms.other;
}

export function nbsp(text) {
	return text
		.replace(/\s([?!:;»])/g, '\u00A0$1')
		.replace(/(«)\s/g, '$1\u00A0');
}

const TYPOGRAPHY_RULES = {
	fr: nbsp
};

export function applyLanguageTypography(text, lang) {
	const rule = TYPOGRAPHY_RULES[lang];
	return rule ? rule(text) : text;
}
