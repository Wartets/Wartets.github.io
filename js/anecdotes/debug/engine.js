import { resolveSpecialEntry, isDateSpecial, toISODate } from '../scheduler.js';
import { pickGeneralEntry, EPOCH_UTC_MS } from '../cycle-engine.js';

const DAY_MS = 86400000;

const dateCounterCache = new Map();
const sortedDateCheckpointKeys = [];

function addDays(ms, days) {
	return ms + days * DAY_MS;
}

function recordDateCheckpoint(ms, counter) {
	if (dateCounterCache.has(ms)) return;
	dateCounterCache.set(ms, counter);
	let low = 0;
	let high = sortedDateCheckpointKeys.length;
	while (low < high) {
		const mid = (low + high) >>> 1;
		if (sortedDateCheckpointKeys[mid] < ms) low = mid + 1;
		else high = mid;
	}
	sortedDateCheckpointKeys.splice(low, 0, ms);
}

function nearestDateCheckpointAtMost(targetMs) {
	let low = 0;
	let high = sortedDateCheckpointKeys.length - 1;
	let result = -1;
	while (low <= high) {
		const mid = (low + high) >>> 1;
		if (sortedDateCheckpointKeys[mid] <= targetMs) {
			result = mid;
			low = mid + 1;
		} else {
			high = mid - 1;
		}
	}
	if (result === -1) return null;
	const ms = sortedDateCheckpointKeys[result];
	return { ms, counter: dateCounterCache.get(ms) };
}

export function computeGeneralIndexForDate(targetDateUTC, registryEntries) {
	const targetMs = Date.UTC(targetDateUTC.getUTCFullYear(), targetDateUTC.getUTCMonth(), targetDateUTC.getUTCDate());
	if (targetMs <= EPOCH_UTC_MS) return 0;

	const exact = dateCounterCache.get(targetMs);
	if (exact !== undefined) return exact;

	const nearest = nearestDateCheckpointAtMost(targetMs);
	let cursor = EPOCH_UTC_MS;
	let counter = 0;
	if (nearest) {
		cursor = nearest.ms;
		counter = nearest.counter;
	}

	while (cursor < targetMs) {
		if (!isDateSpecial(registryEntries, new Date(cursor))) counter += 1;
		cursor = addDays(cursor, 1);
		recordDateCheckpoint(cursor, counter);
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
