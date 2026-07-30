import { pluralize } from '/js/anecdotes/format.js';

const BIRTH_TIMESTAMP_UTC = Date.UTC(1867, 10, 7);
const MS_PER_YEAR = 365.2425 * 86400000;

function computePreciseAge(nowMs) {
	const diffMs = nowMs - BIRTH_TIMESTAMP_UTC;
	const years = Math.floor(diffMs / MS_PER_YEAR);
	const remainderMs = diffMs - years * MS_PER_YEAR;
	const days = Math.floor(remainderMs / 86400000);
	const hours = Math.floor((remainderMs % 86400000) / 3600000);
	const minutes = Math.floor((remainderMs % 3600000) / 60000);
	const seconds = Math.floor((remainderMs % 60000) / 1000);
	return { years, days, hours, minutes, seconds };
}

export default {
	id: 'anecdote_naissance_marie_curie',
	enabled: true,
	priority: 3,
	addedDate: '2026-07-30',
	domain: { fr: 'Histoire des Sciences', en: 'History of Science' },
	scheduling: { type: 'annual', dates: ['11-07'] },
	content: (lang, currentYear) => {
		const age = currentYear - 1867;
		const yearsLabel = lang === 'fr'
			? pluralize(lang, age, { one: 'an', other: 'ans' })
			: pluralize(lang, age, { one: 'year', other: 'years' });
		return lang === 'fr'
			? `Marie Curie est née un 7 novembre. Elle aurait ${age} ${yearsLabel} aujourd'hui.`
			: `Marie Curie was born on November 7. She would be ${age} ${yearsLabel} old today.`;
	},
	tooltip: (lang, preciseNow) => {
		const { years, days, hours, minutes, seconds } = computePreciseAge(preciseNow.getTime());
		const yearsLabel = lang === 'fr'
			? pluralize(lang, years, { one: 'an', other: 'ans' })
			: pluralize(lang, years, { one: 'year', other: 'years' });
		const daysLabel = lang === 'fr'
			? pluralize(lang, days, { one: 'jour', other: 'jours' })
			: pluralize(lang, days, { one: 'day', other: 'days' });
		const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
		return lang === 'fr'
			? `${years} ${yearsLabel}, ${days} ${daysLabel} et ${time}`
			: `${years} ${yearsLabel}, ${days} ${daysLabel} and ${time}`;
	},
	sources: [
		{
			name: { fr: 'Fondation Nobel', en: 'Nobel Foundation' },
			url: 'https://www.nobelprize.org/prizes/physics/1903/marie-curie/biographical/'
		}
	],
	contexts: []
};
