export function formatNumber(value, lang) {
	return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US').format(value);
}

export function formatDate(dateObj, lang, options = { day: 'numeric', month: 'long' }) {
	return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', options).format(dateObj);
}

export function pluralize(lang, value, forms) {
	const rules = new Intl.PluralRules(lang === 'fr' ? 'fr-FR' : 'en-US');
	const category = rules.select(value);
	return forms[category] || forms.other;
}

export function nbsp(text) {
	return text
		.replace(/\s([?!:;»])/g, '\u00A0$1')
		.replace(/(«)\s/g, '$1\u00A0');
}

export function frenchTypography(text, lang) {
	return lang === 'fr' ? nbsp(text) : text;
}
