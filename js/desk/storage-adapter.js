(function () {
	const DB_NAME = 'Wartets_XP_Storage_DB';
	const DB_VERSION = 1;
	const STORE_NAME = 'keyval_store';

	class IndexedDBStorageAdapter {
		constructor() {
			this.db = null;
			this.isReady = false;
			this.readyPromise = null;
			this.cache = new Map();
			this.pendingWrites = new Map();
			this.pendingDeletes = new Set();
			this.flushTimer = null;
			this.flushDebounceMs = 50;
			this.hasIndexedDB = typeof window !== 'undefined' && !!window.indexedDB;
			this.init();
		}

		init() {
			this.readyPromise = new Promise((resolve) => {
				this.hydrateFromLocalStorage();
				if (!this.hasIndexedDB) {
					this.isReady = true;
					resolve();
					return;
				}
				try {
					const request = indexedDB.open(DB_NAME, DB_VERSION);
					request.onupgradeneeded = (event) => {
						const db = event.target.result;
						if (!db.objectStoreNames.contains(STORE_NAME)) {
							db.createObjectStore(STORE_NAME, { keyPath: 'key' });
						}
					};
					request.onsuccess = (event) => {
						this.db = event.target.result;
						this.hydrateFromIndexedDB().then(() => {
							this.isReady = true;
							resolve();
						}).catch(() => {
							this.isReady = true;
							resolve();
						});
					};
					request.onerror = () => {
						this.isReady = true;
						resolve();
					};
				} catch (e) {
					this.isReady = true;
					resolve();
				}
			});
		}

		ready() {
			return this.readyPromise;
		}

		hydrateFromLocalStorage() {
			try {
				if (typeof localStorage === 'undefined') return;
				for (let i = 0; i < localStorage.length; i++) {
					const key = localStorage.key(i);
					if (key) {
						this.cache.set(key, localStorage.getItem(key));
					}
				}
			} catch (e) {}
		}

		async hydrateFromIndexedDB() {
			if (!this.db) return;
			return new Promise((resolve, reject) => {
				try {
					const transaction = this.db.transaction(STORE_NAME, 'readonly');
					const store = transaction.objectStore(STORE_NAME);
					const request = store.getAll();
					request.onsuccess = () => {
						const results = request.result || [];
						const idbKeys = new Set();
						results.forEach(record => {
							if (record && record.key !== undefined) {
								this.cache.set(record.key, record.value);
								idbKeys.add(record.key);
							}
						});
						for (const [key, val] of this.cache.entries()) {
							if (!idbKeys.has(key)) {
								this.pendingWrites.set(key, val);
							}
						}
						if (this.pendingWrites.size > 0) {
							this.scheduleFlush();
						}
						resolve();
					};
					request.onerror = () => reject(request.error);
				} catch (e) {
					reject(e);
				}
			});
		}

		getItem(key) {
			if (this.cache.has(key)) {
				return this.cache.get(key);
			}
			try {
				if (typeof localStorage !== 'undefined') {
					const val = localStorage.getItem(key);
					if (val !== null) {
						this.cache.set(key, val);
						return val;
					}
				}
			} catch (e) {}
			return null;
		}

		setItem(key, value) {
			const strVal = String(value);
			this.cache.set(key, strVal);
			this.pendingDeletes.delete(key);
			this.pendingWrites.set(key, strVal);

			try {
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem(key, strVal);
				}
			} catch (e) {}

			this.scheduleFlush();
		}

		removeItem(key) {
			this.cache.delete(key);
			this.pendingWrites.delete(key);
			this.pendingDeletes.add(key);

			try {
				if (typeof localStorage !== 'undefined') {
					localStorage.removeItem(key);
				}
			} catch (e) {}

			this.scheduleFlush();
		}

		clear() {
			this.cache.clear();
			this.pendingWrites.clear();
			this.pendingDeletes.clear();

			try {
				if (typeof localStorage !== 'undefined') {
					localStorage.clear();
				}
			} catch (e) {}

			if (this.db) {
				try {
					const transaction = this.db.transaction(STORE_NAME, 'readwrite');
					const store = transaction.objectStore(STORE_NAME);
					store.clear();
				} catch (e) {}
			}
		}

		scheduleFlush() {
			if (this.flushTimer) return;
			this.flushTimer = setTimeout(() => {
				this.flushTimer = null;
				this.flush();
			}, this.flushDebounceMs);
		}

		async flush() {
			if (!this.db) return;
			if (this.pendingWrites.size === 0 && this.pendingDeletes.size === 0) return;

			const writes = new Map(this.pendingWrites);
			const deletes = new Set(this.pendingDeletes);
			this.pendingWrites.clear();
			this.pendingDeletes.clear();

			return new Promise((resolve) => {
				try {
					const transaction = this.db.transaction(STORE_NAME, 'readwrite');
					const store = transaction.objectStore(STORE_NAME);

					deletes.forEach(key => {
						store.delete(key);
					});

					writes.forEach((value, key) => {
						store.put({ key, value, modifiedAt: Date.now() });
					});

					transaction.oncomplete = () => resolve();
					transaction.onerror = () => resolve();
					transaction.onabort = () => resolve();
				} catch (e) {
					resolve();
				}
			});
		}

		calculateUsage() {
			let totalBytes = 0;
			for (const [key, value] of this.cache.entries()) {
				totalBytes += (key.length + (value ? value.length : 0)) * 2;
			}
			return totalBytes;
		}

		getAll() {
			const obj = {};
			for (const [key, value] of this.cache.entries()) {
				obj[key] = value;
			}
			return obj;
		}

		async exportSnapshot() {
			await this.flush();
			return this.getAll();
		}

		async importSnapshot(data) {
			if (!data || typeof data !== 'object') return false;
			this.clear();
			Object.keys(data).forEach(k => {
				if (data[k] !== undefined && data[k] !== null) {
					this.setItem(k, typeof data[k] === 'string' ? data[k] : JSON.stringify(data[k]));
				}
			});
			await this.flush();
			return true;
		}
	}

	window.DeskStorage = new IndexedDBStorageAdapter();
})();
