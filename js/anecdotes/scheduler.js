import { mulberry32, combinedSeed } from './prng.js';

function isLeapYear(year) {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function toMMDD(date) {
	const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
	const dd = String(date.getUTCDate()).padStart(2, '0');
	return `${mm}-${dd}`;
}

function toISODate(date) {
	return `${date.getUTCFullYear()}-${toMMDD(date)}`;
}

function mmddValue(mmdd) {
	const [m, d] = mmdd.split('-').map(Number);
	return m * 100 + d;
}

function isWithinPeriod(mmdd, start, end) {
	const value = mmddValue(mmdd);
	const startValue = mmddValue(start);
	const endValue = mmddValue(end);
	if (startValue <= endValue) return value >= startValue && value <= endValue;
	return value >= startValue || value <= endValue;
}

const TIER_BY_TYPE = { specific_date: 3, annual: 2, period: 1 };

export function resolveSpecialEntry(registryEntries, dateUTC) {
	const year = dateUTC.getUTCFullYear();
	const mmdd = toMMDD(dateUTC);
	const isoDate = toISODate(dateUTC);
	const candidates = [];

	registryEntries.forEach(entry => {
		if (entry.enabled === false) return;
		const scheduling = entry.scheduling;
		if (!scheduling || scheduling.type === 'anytime') return;

		if (scheduling.type === 'specific_date' && scheduling.dates.includes(isoDate)) {
			candidates.push(entry);
		} else if (scheduling.type === 'annual') {
			scheduling.dates.forEach(d => {
				if (d === '02-29' && !isLeapYear(year)) return;
				if (d === mmdd) candidates.push(entry);
			});
		} else if (scheduling.type === 'period' && scheduling.dates.length === 2) {
			if (isWithinPeriod(mmdd, scheduling.dates[0], scheduling.dates[1])) candidates.push(entry);
		}
	});

	if (candidates.length === 0) return null;

	const maxTier = Math.max(...candidates.map(c => TIER_BY_TYPE[c.scheduling.type]));
	let tierCandidates = candidates.filter(c => TIER_BY_TYPE[c.scheduling.type] === maxTier);
	if (tierCandidates.length === 1) return tierCandidates[0];

	const minPriority = Math.min(...tierCandidates.map(c => c.priority ?? 10));
	tierCandidates = tierCandidates.filter(c => (c.priority ?? 10) === minPriority);
	if (tierCandidates.length === 1) return tierCandidates[0];

	const sortedById = [...tierCandidates].sort((a, b) => a.id.localeCompare(b.id));
	const asciiSum = sortedById.reduce((sum, c) => sum + c.id.split('').reduce((s, ch) => s + ch.charCodeAt(0), 0), 0);
	const seed = combinedSeed(String(year), String(asciiSum));
	const rng = mulberry32(seed);
	const index = Math.floor(rng() * sortedById.length);
	return sortedById[index];
}

export function isDateSpecial(registryEntries, dateUTC) {
	return resolveSpecialEntry(registryEntries, dateUTC) !== null;
}

export { isLeapYear, toMMDD, toISODate };
