(function () {
	'use strict';

	class ClippyAudioSynthesizer {
		constructor() {
			this.ctx = null;
			this.enabled = true;
		}

		initContext() {
			if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
				const AudioCtx = window.AudioContext || window.webkitAudioContext;
				this.ctx = new AudioCtx();
			}
			if (this.ctx && this.ctx.state === 'suspended') {
				this.ctx.resume();
			}
		}

		setEnabled(state) {
			this.enabled = !!state;
		}

		isEnabled() {
			return this.enabled;
		}

		play(type) {
			if (!this.enabled) return;
			try {
				this.initContext();
				if (!this.ctx) return;
				const now = this.ctx.currentTime;

				if (type === 'type') {
					const osc = this.ctx.createOscillator();
					const gain = this.ctx.createGain();
					osc.connect(gain);
					gain.connect(this.ctx.destination);
					osc.type = 'sine';
					osc.frequency.setValueAtTime(520 + Math.random() * 180, now);
					gain.gain.setValueAtTime(0.015, now);
					gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
					osc.start(now);
					osc.stop(now + 0.025);
				} else if (type === 'popup') {
					const osc = this.ctx.createOscillator();
					const gain = this.ctx.createGain();
					osc.connect(gain);
					gain.connect(this.ctx.destination);
					osc.type = 'sine';
					osc.frequency.setValueAtTime(360, now);
					osc.frequency.exponentialRampToValueAtTime(720, now + 0.14);
					gain.gain.setValueAtTime(0.045, now);
					gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
					osc.start(now);
					osc.stop(now + 0.14);
				} else if (type === 'action') {
					const osc = this.ctx.createOscillator();
					const gain = this.ctx.createGain();
					osc.connect(gain);
					gain.connect(this.ctx.destination);
					osc.type = 'triangle';
					osc.frequency.setValueAtTime(587.33, now);
					osc.frequency.setValueAtTime(880.00, now + 0.06);
					gain.gain.setValueAtTime(0.035, now);
					gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
					osc.start(now);
					osc.stop(now + 0.14);
				} else if (type === 'crunch') {
					const osc = this.ctx.createOscillator();
					const gain = this.ctx.createGain();
					osc.connect(gain);
					gain.connect(this.ctx.destination);
					osc.type = 'square';
					osc.frequency.setValueAtTime(120 + Math.random() * 80, now);
					gain.gain.setValueAtTime(0.02, now);
					gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
					osc.start(now);
					osc.stop(now + 0.04);
				} else if (type === 'win') {
					[523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
						const osc = this.ctx.createOscillator();
						const gain = this.ctx.createGain();
						osc.connect(gain);
						gain.connect(this.ctx.destination);
						osc.type = 'triangle';
						osc.frequency.setValueAtTime(freq, now + idx * 0.06);
						gain.gain.setValueAtTime(0.045, now + idx * 0.06);
						gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.12);
						osc.start(now + idx * 0.06);
						osc.stop(now + idx * 0.06 + 0.12);
					});
				} else if (type === 'lose') {
					[440, 370, 311, 220, 164.81].forEach((freq, idx) => {
						const osc = this.ctx.createOscillator();
						const gain = this.ctx.createGain();
						osc.connect(gain);
						gain.connect(this.ctx.destination);
						osc.type = 'sawtooth';
						osc.frequency.setValueAtTime(freq, now + idx * 0.08);
						gain.gain.setValueAtTime(0.025, now + idx * 0.08);
						gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.14);
						osc.start(now + idx * 0.08);
						osc.stop(now + idx * 0.08 + 0.14);
					});
				} else if (type === 'tada') {
					[440, 554.37, 659.25, 880, 1108.73].forEach((freq, idx) => {
						const osc = this.ctx.createOscillator();
						const gain = this.ctx.createGain();
						osc.connect(gain);
						gain.connect(this.ctx.destination);
						osc.type = 'sine';
						osc.frequency.setValueAtTime(freq, now + idx * 0.08);
						gain.gain.setValueAtTime(0.045, now + idx * 0.08);
						gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.16);
						osc.start(now + idx * 0.08);
						osc.stop(now + idx * 0.08 + 0.16);
					});
				}
			} catch (e) {}
		}
	}

	window.ClippyAudio = new ClippyAudioSynthesizer();
})();
