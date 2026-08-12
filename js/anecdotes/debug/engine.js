import { resolveSpecialEntry, isDateSpecial, toISODate } from '../scheduler.js';
import { pickGeneralEntry, EPOCH_UTC_MS } from '../cycle-engine.js';

const DAY_MS = 86400000;

function addDays(ms, days) {
	return ms + days * DAY_MS;
}

export function computeGeneralIndexForDate(targetDateUTC, registryEntries) {
	const targetMs = Date.UTC(targetDateUTC.getUTCFullYear(), targetDateUTC.getUTCMonth(), targetDateUTC.getUTCDate());
	let cursor = EPOCH_UTC_MS;
	let counter = 0;
	while (cursor < targetMs) {
		if (!isDateSpecial(registryEntries, new Date(cursor))) counter += 1;
		cursor = addDays(cursor, 1);
	}
	return counter;
}

export function resolveEntryForDate(dateUTC, registryEntries) {
	const specialEntry = resolveSpecialEntry(registryEntries, dateUTC);
	if (specialEntry) {
		return { registryEntry: specialEntry, isSpecial: true };
	}
	const referenceISODate = toISODate(dateUTC);
	const counterBeforeDate = computeGeneralIndexForDate(dateUTC, registryEntries);
	const generalEntry = pickGeneralEntry(registryEntries, counterBeforeDate, referenceISODate);
	return { registryEntry: generalEntry, isSpecial: false };
}
