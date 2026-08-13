const CACHE_VERSION = 'wartets-cache-v1';

const PRECACHE_URLS = [
	'/',
	'/index.html',
	'/manifest.json',
	'/offline.html',
	'/css/home.css',
	'/css/project.css',
	'/css/library.css',
	'/css/poetry.css',
	'/css/anecdotes.css',
	'/js/site-commons.js',
	'/js/i18n.js',
	'/js/home.js',
	'/data/projects.js',
	'/data/library.js',
	'/locales/en.json',
	'/locales/fr.json',
	'/assets/images/browser-icon.png',
	'/assets/images/app-icon.jpg'
];

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_VERSION)
			.then(cache => cache.addAll(PRECACHE_URLS))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys()
			.then(keys => Promise.all(keys.filter(key => key !== CACHE_VERSION).map(key => caches.delete(key))))
			.then(() => self.clients.claim())
	);
});

function isNavigationRequest(request) {
	if (request.mode === 'navigate') return true;
	const acceptHeader = request.headers.get('accept');
	return request.method === 'GET' && acceptHeader !== null && acceptHeader.includes('text/html');
}

async function networkFirstForNavigation(request) {
	try {
		const response = await fetch(request);
		const cache = await caches.open(CACHE_VERSION);
		cache.put(request, response.clone());
		return response;
	} catch (error) {
		const cached = await caches.match(request);
		if (cached) return cached;
		const offline = await caches.match('/offline.html');
		if (offline) return offline;
		return Response.error();
	}
}

async function staleWhileRevalidate(request) {
	const cache = await caches.open(CACHE_VERSION);
	const cached = await cache.match(request);
	const networkFetch = fetch(request).then(response => {
		if (response && response.status === 200 && response.type === 'basic') {
			cache.put(request, response.clone());
		}
		return response;
	}).catch(() => cached);
	return cached || networkFetch;
}

self.addEventListener('fetch', event => {
	const request = event.request;
	if (request.method !== 'GET') return;

	const requestUrl = new URL(request.url);
	if (requestUrl.origin !== self.location.origin) return;

	if (isNavigationRequest(request)) {
		event.respondWith(networkFirstForNavigation(request));
		return;
	}

	event.respondWith(staleWhileRevalidate(request));
});
