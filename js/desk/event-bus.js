(function () {
	class EventBus {
		constructor() {
			this.listeners = new Map();
		}

		on(event, handler) {
			if (typeof handler !== 'function') return () => {};
			if (!this.listeners.has(event)) {
				this.listeners.set(event, new Set());
			}
			this.listeners.get(event).add(handler);
			return () => this.off(event, handler);
		}

		once(event, handler) {
			if (typeof handler !== 'function') return;
			const wrapper = (...args) => {
				this.off(event, wrapper);
				handler(...args);
			};
			this.on(event, wrapper);
		}

		off(event, handler) {
			if (!this.listeners.has(event)) return;
			const handlers = this.listeners.get(event);
			handlers.delete(handler);
			if (handlers.size === 0) {
				this.listeners.delete(event);
			}
		}

		emit(event, ...args) {
			if (!this.listeners.has(event)) return;
			const handlers = Array.from(this.listeners.get(event));
			for (let i = 0; i < handlers.length; i++) {
				try {
					handlers[i](...args);
				} catch (error) {
					console.error(error);
				}
			}
		}

		clear(event) {
			if (event) {
				this.listeners.delete(event);
			} else {
				this.listeners.clear();
			}
		}
	}

	window.DeskEventBus = new EventBus();
})();
