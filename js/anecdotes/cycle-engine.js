import { isDateSpecial, toISODate } from './scheduler.js';
import { mulberry32, combinedSeed } from './prng.js';

const EPOCH_UTC_MS = Date.UTC(2026, 6, 30);
const LAST_DATE_KEY = 'anecdotes_last_calculated_date';
const COUNTER_KEY = 'anecdotes_saved_general_days_counter';
const CYCLE_STATE_KEY = 'anecdotes_cycle_state';
const DAY_MS = 86400000;

function addDays(ms, days) {
	return ms + days * DAY_MS;
}

export function computeGeneralDaysCounter(todayUTCDate, registryEntries) {
	const todayMs = Date.UTC(todayUTCDate.getUTCFullYear(), todayUTCDate.getUTCMonth(), todayUTCDate.getUTCDate());
	const storedLastDate = localStorage.getItem(LAST_DATE_KEY);
	const storedCounter = parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10);

	let cursor = storedLastDate ? addDays(Date.parse(storedLastDate + 'T00:00:00Z'), 1) : EPOCH_UTC_MS;
	let counter = storedLastDate ? storedCounter : 0;

	while (cursor < todayMs) {
		const cursorDate = new Date(cursor);
		if (!isDateSpecial(registryEntries, cursorDate)) counter += 1;
		cursor = addDays(cursor, 1);
	}

	const todayIsSpecial = isDateSpecial(registryEntries, todayUTCDate);
	const finalizedCounter = counter + (todayIsSpecial ? 0 : 1);

	localStorage.setItem(LAST_DATE_KEY, toISODate(todayUTCDate));
	localStorage.setItem(COUNTER_KEY, String(finalizedCounter));

	return { counterBeforeToday: counter, todayIsSpecial };
}

function eligibleAnytimePool(registryEntries, todayISODate) {
	return registryEntries
		.filter(entry => entry.enabled !== false && entry.scheduling && entry.scheduling.type === 'anytime')
		.filter(entry => !entry.addedDate || entry.addedDate <= todayISODate)
		.sort((a, b) => a.id.localeCompare(b.id));
}

function weightedOrder(ids, seed) {
	return [...ids]
		.map(id => ({ id, weight: mulberry32(combinedSeed(String(seed), id))() }))
		.sort((a, b) => a.weight - b.weight)
		.map(item => item.id);
}

function loadCycleState() {
	try {
		const raw = localStorage.getItem(CYCLE_STATE_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch (error) {
		return null;
	}
}

function saveCycleState(state) {
	localStorage.setItem(CYCLE_STATE_KEY, JSON.stringify(state));
}

export function pickGeneralEntry(registryEntries, generalDaysCounter, todayISODate) {
	const fullPool = eligibleAnytimePool(registryEntries, todayISODate);
	if (fullPool.length === 0) return null;

	let state = loadCycleState();
	if (!state) {
		state = {
			cycleNumber: 0,
			cycleStartCounter: 0,
			lockedIds: fullPool.map(entry => entry.id)
		};
	}

	let remainder = generalDaysCounter - state.cycleStartCounter;

	while (remainder >= state.lockedIds.length) {
		state.cycleStartCounter += state.lockedIds.length;
		state.cycleNumber += 1;
		state.lockedIds = eligibleAnytimePool(registryEntries, todayISODate).map(entry => entry.id);
		remainder = generalDaysCounter - state.cycleStartCounter;
	}

	saveCycleState(state);

	const order = weightedOrder(state.lockedIds, state.cycleNumber);
	const selectedId = order[remainder];
	return fullPool.find(entry => entry.id === selectedId) || registryEntries.find(entry => entry.id === selectedId);
}

export { EPOCH_UTC_MS };
