import { isDateSpecial, toISODate } from './scheduler.js';
import { mulberry32, combinedSeed } from './prng.js';

const EPOCH_UTC_MS = Date.UTC(2026, 6, 30);
const STORAGE_VERSION = '2';
const VERSION_KEY = 'anecdotes_storage_version';
const LAST_DATE_KEY = 'anecdotes_last_calculated_date';
const COUNTER_KEY = 'anecdotes_saved_general_days_counter';
const DAY_MS = 86400000;

function addDays(ms, days) {
	return ms + days * DAY_MS;
}

function ensureStorageVersion() {
	const stored = localStorage.getItem(VERSION_KEY);
	if (stored === STORAGE_VERSION) return;
	localStorage.removeItem(LAST_DATE_KEY);
	localStorage.removeItem(COUNTER_KEY);
	localStorage.removeItem('anecdotes_cycle_state');
	localStorage.setItem(VERSION_KEY, STORAGE_VERSION);
}

export function computeGeneralDaysCounter(todayUTCDate, registryEntries) {
	ensureStorageVersion();

	const todayISO = toISODate(todayUTCDate);
	const todayMs = Date.UTC(todayUTCDate.getUTCFullYear(), todayUTCDate.getUTCMonth(), todayUTCDate.getUTCDate());
	const todayIsSpecial = isDateSpecial(registryEntries, todayUTCDate);
	const storedLastDate = localStorage.getItem(LAST_DATE_KEY);

	if (storedLastDate === todayISO) {
		const cachedCounter = parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10);
		return { counterBeforeToday: cachedCounter - (todayIsSpecial ? 0 : 1), todayIsSpecial };
	}

	const storedCounter = parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10);
	let cursor = storedLastDate ? addDays(Date.parse(storedLastDate + 'T00:00:00Z'), 1) : EPOCH_UTC_MS;
	let counter = storedLastDate ? storedCounter : 0;

	while (cursor < todayMs) {
		if (!isDateSpecial(registryEntries, new Date(cursor))) counter += 1;
		cursor = addDays(cursor, 1);
	}

	const finalizedCounter = counter + (todayIsSpecial ? 0 : 1);

	localStorage.setItem(LAST_DATE_KEY, todayISO);
	localStorage.setItem(COUNTER_KEY, String(finalizedCounter));

	return { counterBeforeToday: counter, todayIsSpecial };
}

function eligibleAnytimePool(registryEntries, cutoffISODate) {
	return registryEntries
		.filter(entry => entry.enabled !== false && entry.scheduling && entry.scheduling.type === 'anytime')
		.filter(entry => !entry.addedDate || entry.addedDate <= cutoffISODate)
		.sort((a, b) => a.id.localeCompare(b.id));
}

function weightedOrder(ids, seed) {
	return [...ids]
		.map(id => ({ id, weight: mulberry32(combinedSeed(String(seed), id))() }))
		.sort((a, b) => a.weight - b.weight)
		.map(item => item.id);
}

const counterCheckpoints = new Map();
const sortedCounterCheckpointKeys = [];

function recordCounterCheckpoint(counter, ms) {
	if (counterCheckpoints.has(counter)) return;
	counterCheckpoints.set(counter, ms);
	let low = 0;
	let high = sortedCounterCheckpointKeys.length;
	while (low < high) {
		const mid = (low + high) >>> 1;
		if (sortedCounterCheckpointKeys[mid] < counter) low = mid + 1;
		else high = mid;
	}
	sortedCounterCheckpointKeys.splice(low, 0, counter);
}

function nearestCounterCheckpointAtMost(targetCounter) {
	let low = 0;
	let high = sortedCounterCheckpointKeys.length - 1;
	let result = -1;
	while (low <= high) {
		const mid = (low + high) >>> 1;
		if (sortedCounterCheckpointKeys[mid] <= targetCounter) {
			result = mid;
			low = mid + 1;
		} else {
			high = mid - 1;
		}
	}
	if (result === -1) return null;
	const counter = sortedCounterCheckpointKeys[result];
	return { counter, ms: counterCheckpoints.get(counter) };
}

function isoDateAtGeneralCounter(targetCounter, registryEntries) {
	if (targetCounter <= 0) return toISODate(new Date(EPOCH_UTC_MS));

	const exactMs = counterCheckpoints.get(targetCounter);
	if (exactMs !== undefined) return toISODate(new Date(exactMs));

	const nearest = nearestCounterCheckpointAtMost(targetCounter);
	let cursor = EPOCH_UTC_MS;
	let counter = 0;
	if (nearest) {
		counter = nearest.counter;
		cursor = addDays(nearest.ms, 1);
	}

	while (counter < targetCounter) {
		if (!isDateSpecial(registryEntries, new Date(cursor))) {
			counter += 1;
			recordCounterCheckpoint(counter, cursor);
			if (counter === targetCounter) return toISODate(new Date(cursor));
		}
		cursor = addDays(cursor, 1);
	}
	return toISODate(new Date(cursor));
}

export function pickGeneralEntry(registryEntries, generalDaysCounter, todayISODate) {
	const fullPool = eligibleAnytimePool(registryEntries, todayISODate);
	if (fullPool.length === 0) return null;

	let cycleStartCounter = 0;
	let cycleNumber = 0;
	let lockedIds = eligibleAnytimePool(registryEntries, toISODate(new Date(EPOCH_UTC_MS))).map(entry => entry.id);
	if (lockedIds.length === 0) lockedIds = fullPool.map(entry => entry.id);

	let remainder = generalDaysCounter - cycleStartCounter;

	while (remainder >= lockedIds.length) {
		cycleStartCounter += lockedIds.length;
		cycleNumber += 1;
		const cutoffISODate = isoDateAtGeneralCounter(cycleStartCounter, registryEntries);
		lockedIds = eligibleAnytimePool(registryEntries, cutoffISODate).map(entry => entry.id);
		if (lockedIds.length === 0) lockedIds = fullPool.map(entry => entry.id);
		remainder = generalDaysCounter - cycleStartCounter;
	}

	const order = weightedOrder(lockedIds, cycleNumber);
	const selectedId = order[remainder];
	return registryEntries.find(entry => entry.id === selectedId) || fullPool[0];
}

export { EPOCH_UTC_MS };
