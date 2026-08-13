const SYNODIC_MONTH_DAYS = 29.53058867;
const REFERENCE_NEW_MOON_UTC_MS = Date.UTC(2026, 6, 14, 11, 43, 0);

const PHASE_TARGET_AGE_DAYS = {
	new: 0,
	first_quarter: SYNODIC_MONTH_DAYS / 4,
	full: SYNODIC_MONTH_DAYS / 2,
	last_quarter: (3 * SYNODIC_MONTH_DAYS) / 4
};

function moonAgeInDays(dateUTC) {
	const elapsedDays = (dateUTC.getTime() - REFERENCE_NEW_MOON_UTC_MS) / 86400000;
	let age = elapsedDays % SYNODIC_MONTH_DAYS;
	if (age < 0) age += SYNODIC_MONTH_DAYS;
	return age;
}

export function moonPhase(phaseName, toleranceDays = 0.5) {
	const targetAge = PHASE_TARGET_AGE_DAYS[phaseName];
	if (targetAge === undefined) {
		throw new Error(`Unknown moon phase "${phaseName}". Expected one of: ${Object.keys(PHASE_TARGET_AGE_DAYS).join(', ')}.`);
	}
	return (dateUTC) => {
		const age = moonAgeInDays(dateUTC);
		const rawDiff = Math.abs(age - targetAge);
		const wrappedDiff = Math.min(rawDiff, SYNODIC_MONTH_DAYS - rawDiff);
		return wrappedDiff <= toleranceDays;
	};
}

export function weekday(dayIndex) {
	if (dayIndex < 0 || dayIndex > 6) {
		throw new Error('weekday() expects an index between 0 (Sunday) and 6 (Saturday).');
	}
	return (dateUTC) => dateUTC.getUTCDay() === dayIndex;
}

export function dayOfMonthDivisibleBy(divisor) {
	if (!Number.isInteger(divisor) || divisor <= 0) {
		throw new Error('dayOfMonthDivisibleBy() expects a positive integer.');
	}
	return (dateUTC) => dateUTC.getUTCDate() % divisor === 0;
}

export function dayOfYearDivisibleBy(divisor) {
	if (!Number.isInteger(divisor) || divisor <= 0) {
		throw new Error('dayOfYearDivisibleBy() expects a positive integer.');
	}
	return (dateUTC) => {
		const startOfYear = Date.UTC(dateUTC.getUTCFullYear(), 0, 1);
		const dayOfYear = Math.floor((dateUTC.getTime() - startOfYear) / 86400000) + 1;
		return dayOfYear % divisor === 0;
	};
}

export function specificYears(years) {
	const yearSet = new Set(years);
	return (dateUTC) => yearSet.has(dateUTC.getUTCFullYear());
}

export function knownDates(isoDates) {
	const dateSet = new Set(isoDates);
	return (dateUTC) => {
		const iso = `${dateUTC.getUTCFullYear()}-${String(dateUTC.getUTCMonth() + 1).padStart(2, '0')}-${String(dateUTC.getUTCDate()).padStart(2, '0')}`;
		return dateSet.has(iso);
	};
}

export function and(...predicates) {
	return (dateUTC) => predicates.every(predicate => predicate(dateUTC));
}

export function or(...predicates) {
	return (dateUTC) => predicates.some(predicate => predicate(dateUTC));
}

export function not(predicate) {
	return (dateUTC) => !predicate(dateUTC);
}
