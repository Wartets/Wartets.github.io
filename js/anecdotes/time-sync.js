const OFFSET_KEY = 'anecdotes_time_offset_ms';
const OFFSET_EXPIRY_KEY = 'anecdotes_time_offset_expiry';
const OFFSET_VALIDITY_MS = 2 * 60 * 60 * 1000;
const TIME_API_URL = 'https://worldtimeapi.org/api/timezone/Etc/UTC';

async function fetchAuthoritativeOffset() {
	const localBefore = Date.now();
	const response = await fetch(TIME_API_URL, { cache: 'no-store' });
	if (!response.ok) throw new Error('time_api_unavailable');
	const data = await response.json();
	const localAfter = Date.now();
	const localMid = (localBefore + localAfter) / 2;
	const apiTime = new Date(data.utc_datetime).getTime();
	return apiTime - localMid;
}

export async function getAuthoritativeUTCDate() {
	try {
		const cachedExpiry = parseInt(sessionStorage.getItem(OFFSET_EXPIRY_KEY) || '0', 10);
		const cachedOffset = sessionStorage.getItem(OFFSET_KEY);
		if (cachedOffset !== null && Date.now() < cachedExpiry) {
			return new Date(Date.now() + parseInt(cachedOffset, 10));
		}
		const offset = await fetchAuthoritativeOffset();
		sessionStorage.setItem(OFFSET_KEY, String(offset));
		sessionStorage.setItem(OFFSET_EXPIRY_KEY, String(Date.now() + OFFSET_VALIDITY_MS));
		return new Date(Date.now() + offset);
	} catch (error) {
		console.warn('[anecdotes] Synchronisation temporelle indisponible, repli sur l\'horloge locale.', error);
		return new Date();
	}
}

export function toUTCDateOnly(date) {
	return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
