(function () {
	'use strict';

	const MANIFEST = {
		"Alert": { "file": "Alert.gif", "width": 124, "height": 93, "total_duration_ms": 2800, "category": "music" },
		"CheckingSomething": { "file": "CheckingSomething.gif", "width": 124, "height": 93, "total_duration_ms": 3200, "category": "reading" },
		"Congratulate": { "file": "Congratulate.gif", "width": 124, "height": 93, "total_duration_ms": 2600, "category": "success" },
		"EmptyTrash": { "file": "EmptyTrash.gif", "width": 124, "height": 93, "total_duration_ms": 2900, "category": "trash" },
		"Explain": { "file": "Explain.gif", "width": 124, "height": 93, "total_duration_ms": 2400, "category": "talk" },
		"GestureDown": { "file": "GestureDown.gif", "width": 124, "height": 93, "total_duration_ms": 1800, "category": "gesture" },
		"GestureLeft": { "file": "GestureLeft.gif", "width": 124, "height": 93, "total_duration_ms": 1800, "category": "gesture" },
		"GestureRight": { "file": "GestureRight.gif", "width": 124, "height": 93, "total_duration_ms": 1800, "category": "gesture" },
		"GestureUp": { "file": "GestureUp.gif", "width": 124, "height": 93, "total_duration_ms": 1800, "category": "gesture" },
		"GetArtsy": { "file": "GetArtsy.gif", "width": 124, "height": 93, "total_duration_ms": 3100, "category": "artsy" },
		"GetAttention": { "file": "GetAttention.gif", "width": 124, "height": 93, "total_duration_ms": 2200, "category": "attention" },
		"GetTechy": { "file": "GetTechy.gif", "width": 124, "height": 93, "total_duration_ms": 3000, "category": "tech" },
		"GetWizardy": { "file": "GetWizardy.gif", "width": 124, "height": 93, "total_duration_ms": 2700, "category": "wizard" },
		"GoodBye": { "file": "GoodBye.gif", "width": 124, "height": 93, "total_duration_ms": 2500, "category": "goodbye" },
		"Greeting": { "file": "Greeting.gif", "width": 124, "height": 93, "total_duration_ms": 2600, "category": "greeting" },
		"Hearing_1": { "file": "Hearing_1.gif", "width": 124, "height": 93, "total_duration_ms": 2800, "category": "music" },
		"Hide": { "file": "Hide.gif", "width": 124, "height": 93, "total_duration_ms": 1200, "category": "hide" },
		"Idle1_1": { "file": "Idle1_1.gif", "width": 124, "height": 93, "total_duration_ms": 3500, "category": "idle" },
		"IdleAtom": { "file": "IdleAtom.gif", "width": 124, "height": 93, "total_duration_ms": 3200, "category": "tech" },
		"IdleEyeBrowRaise": { "file": "IdleEyeBrowRaise.gif", "width": 124, "height": 93, "total_duration_ms": 2000, "category": "talk" },
		"IdleFingerTap": { "file": "IdleFingerTap.gif", "width": 124, "height": 93, "total_duration_ms": 2800, "category": "idle" },
		"IdleHeadScratch": { "file": "IdleHeadScratch.gif", "width": 124, "height": 93, "total_duration_ms": 2400, "category": "thinking" },
		"IdleRopePile": { "file": "IdleRopePile.gif", "width": 124, "height": 93, "total_duration_ms": 3000, "category": "fatigue" },
		"IdleSideToSide": { "file": "IdleSideToSide.gif", "width": 124, "height": 93, "total_duration_ms": 2600, "category": "idle" },
		"IdleSnooze": { "file": "IdleSnooze.gif", "width": 124, "height": 93, "total_duration_ms": 3600, "category": "fatigue" },
		"LookDown": { "file": "LookDown.gif", "width": 124, "height": 93, "total_duration_ms": 1500, "category": "look" },
		"LookDownLeft": { "file": "LookDownLeft.gif", "width": 124, "height": 93, "total_duration_ms": 1500, "category": "look" },
		"LookDownRight": { "file": "LookDownRight.gif", "width": 124, "height": 93, "total_duration_ms": 1500, "category": "look" },
		"LookLeft": { "file": "LookLeft.gif", "width": 124, "height": 93, "total_duration_ms": 1500, "category": "look" },
		"LookRight": { "file": "LookRight.gif", "width": 124, "height": 93, "total_duration_ms": 1500, "category": "look" },
		"LookUp": { "file": "LookUp.gif", "width": 124, "height": 93, "total_duration_ms": 1500, "category": "look" },
		"LookUpLeft": { "file": "LookUpLeft.gif", "width": 124, "height": 93, "total_duration_ms": 1500, "category": "look" },
		"LookUpRight": { "file": "LookUpRight.gif", "width": 124, "height": 93, "total_duration_ms": 1500, "category": "look" },
		"Print": { "file": "Print.gif", "width": 124, "height": 93, "total_duration_ms": 3200, "category": "print" },
		"Processing": { "file": "Processing.gif", "width": 124, "height": 93, "total_duration_ms": 2800, "category": "process" },
		"RestPose": { "file": "RestPose.gif", "width": 124, "height": 93, "total_duration_ms": 2000, "category": "rest" },
		"Save": { "file": "Save.gif", "width": 124, "height": 93, "total_duration_ms": 2400, "category": "save" },
		"Searching": { "file": "Searching.gif", "width": 124, "height": 93, "total_duration_ms": 3100, "category": "search" },
		"SendMail": { "file": "SendMail.gif", "width": 124, "height": 93, "total_duration_ms": 3400, "category": "mail" },
		"Show": { "file": "Show.gif", "width": 124, "height": 93, "total_duration_ms": 1400, "category": "show" },
		"Thinking": { "file": "Thinking.gif", "width": 124, "height": 93, "total_duration_ms": 3000, "category": "thinking" },
		"Wave": { "file": "Wave.gif", "width": 124, "height": 93, "total_duration_ms": 2500, "category": "attention" },
		"Writing": { "file": "Writing.gif", "width": 124, "height": 93, "total_duration_ms": 3200, "category": "write" },
		"modern-checking-something": { "file": "modern-checking-something.gif", "width": 124, "height": 93, "total_duration_ms": 3000, "category": "reading" },
		"modern-congratulate": { "file": "modern-congratulate.gif", "width": 124, "height": 93, "total_duration_ms": 2500, "category": "success" },
		"modern-empty-trash": { "file": "modern-empty-trash.gif", "width": 124, "height": 93, "total_duration_ms": 2800, "category": "trash" },
		"modern-gesture-down": { "file": "modern-gesture-down.gif", "width": 124, "height": 93, "total_duration_ms": 1800, "category": "gesture" },
		"modern-gesture-right": { "file": "modern-gesture-right.gif", "width": 124, "height": 93, "total_duration_ms": 1800, "category": "gesture" },
		"modern-gesture-to-character": { "file": "modern-gesture-to-character.gif", "width": 124, "height": 93, "total_duration_ms": 1800, "category": "gesture" },
		"modern-gesture-up": { "file": "modern-gesture-up.gif", "width": 124, "height": 93, "total_duration_ms": 1800, "category": "gesture" },
		"modern-get-artsy": { "file": "modern-get-artsy.gif", "width": 124, "height": 93, "total_duration_ms": 3000, "category": "artsy" },
		"modern-get-attention-major": { "file": "modern-get-attention-major.gif", "width": 124, "height": 93, "total_duration_ms": 2400, "category": "attention" },
		"modern-get-attention-minor": { "file": "modern-get-attention-minor.gif", "width": 124, "height": 93, "total_duration_ms": 2000, "category": "attention" },
		"modern-greeting-show": { "file": "modern-greeting-show.gif", "width": 124, "height": 93, "total_duration_ms": 2400, "category": "greeting" },
		"modern-idle-dance": { "file": "modern-idle-dance.gif", "width": 124, "height": 93, "total_duration_ms": 2800, "category": "dance" },
		"modern-listens-to-computer": { "file": "modern-listens-to-computer.gif", "width": 124, "height": 93, "total_duration_ms": 2700, "category": "music" },
		"modern-modern-begin-speaking": { "file": "modern-modern-begin-speaking.gif", "width": 124, "height": 93, "total_duration_ms": 2000, "category": "talk" },
		"modern-printing": { "file": "modern-printing.gif", "width": 124, "height": 93, "total_duration_ms": 3000, "category": "print" },
		"modern-save": { "file": "modern-save.gif", "width": 124, "height": 93, "total_duration_ms": 2400, "category": "save" },
		"modern-searching": { "file": "modern-searching.gif", "width": 124, "height": 93, "total_duration_ms": 3000, "category": "search" },
		"modern-sending-mail": { "file": "modern-sending-mail.gif", "width": 124, "height": 93, "total_duration_ms": 3000, "category": "mail" },
		"modern-thinking": { "file": "modern-thinking.gif", "width": 124, "height": 93, "total_duration_ms": 3000, "category": "thinking" },
		"modern-working-at-something": { "file": "modern-working-at-something.gif", "width": 124, "height": 93, "total_duration_ms": 2800, "category": "process" },
		"modern-writing-something": { "file": "modern-writing-something.gif", "width": 124, "height": 93, "total_duration_ms": 3000, "category": "write" }
	};

	const CLASSIC_TO_MODERN_MAP = {
		"CheckingSomething": "modern-checking-something",
		"Congratulate": "modern-congratulate",
		"EmptyTrash": "modern-empty-trash",
		"GestureDown": "modern-gesture-down",
		"GestureLeft": "modern-gesture-to-character",
		"GestureRight": "modern-gesture-right",
		"GestureUp": "modern-gesture-up",
		"GetArtsy": "modern-get-artsy",
		"GetAttention": "modern-get-attention-major",
		"Greeting": "modern-greeting-show",
		"Show": "modern-greeting-show",
		"Explain": "modern-modern-begin-speaking",
		"IdleEyeBrowRaise": "modern-modern-begin-speaking",
		"Hearing_1": "modern-listens-to-computer",
		"Alert": "modern-listens-to-computer",
		"Print": "modern-printing",
		"Processing": "modern-working-at-something",
		"Save": "modern-save",
		"Searching": "modern-searching",
		"SendMail": "modern-sending-mail",
		"Thinking": "modern-thinking",
		"GetTechy": "modern-thinking",
		"IdleAtom": "modern-thinking",
		"Wave": "modern-get-attention-minor",
		"Writing": "modern-writing-something",
		"Idle1_1": "modern-idle-dance",
		"IdleSideToSide": "modern-idle-dance"
	};

	const MOOD_ANIMATION_MAP = {
		OPTIMISTIC: {
			idle: ["IdleEyeBrowRaise", "IdleSideToSide", "Idle1_1", "Explain"],
			talk: ["Explain", "IdleEyeBrowRaise", "Wave"],
			think: ["Thinking", "CheckingSomething", "IdleHeadScratch"],
			reaction: ["Congratulate", "Wave", "GetWizardy"]
		},
		ANALYTICAL: {
			idle: ["CheckingSomething", "IdleAtom", "GetTechy", "Idle1_1"],
			talk: ["Explain", "CheckingSomething", "Processing"],
			think: ["Thinking", "GetTechy", "IdleAtom", "CheckingSomething"],
			reaction: ["GetTechy", "Processing", "CheckingSomething"]
		},
		ZEN: {
			idle: ["RestPose", "IdleFingerTap", "Idle1_1"],
			talk: ["Explain", "RestPose"],
			think: ["RestPose", "IdleFingerTap"],
			reaction: ["RestPose", "IdleFingerTap"]
		},
		CYNICAL: {
			idle: ["IdleHeadScratch", "IdleSideToSide", "Explain"],
			talk: ["Explain", "IdleSideToSide"],
			think: ["IdleHeadScratch", "Searching"],
			reaction: ["IdleSideToSide", "GetAttention"]
		},
		SARCASTIC: {
			idle: ["IdleSideToSide", "IdleHeadScratch", "Explain"],
			talk: ["Explain", "IdleEyeBrowRaise"],
			think: ["IdleHeadScratch", "Searching"],
			reaction: ["Wave", "GetAttention"]
		},
		ENRAGED: {
			idle: ["GetAttention", "Wave", "Alert"],
			talk: ["GetAttention", "Wave"],
			think: ["GetAttention", "IdleHeadScratch"],
			reaction: ["GetAttention", "Wave"]
		},
		OFFENDED: {
			idle: ["RestPose", "IdleSideToSide"],
			talk: ["Explain", "RestPose"],
			think: ["RestPose", "IdleHeadScratch"],
			reaction: ["RestPose", "GetAttention"]
		},
		FATIGUED: {
			idle: ["IdleRopePile", "IdleSnooze", "RestPose"],
			talk: ["IdleRopePile", "RestPose"],
			think: ["IdleSnooze", "IdleRopePile"],
			reaction: ["IdleSnooze", "IdleRopePile"]
		},
		PLAYFUL: {
			idle: ["GetArtsy", "Wave", "IdleSideToSide"],
			talk: ["Wave", "Explain", "GetArtsy"],
			think: ["GetArtsy", "Thinking"],
			reaction: ["Congratulate", "Wave", "GetWizardy"]
		},
		NOSTALGIC: {
			idle: ["Writing", "Hearing_1", "Greeting"],
			talk: ["Explain", "Writing"],
			think: ["CheckingSomething", "Thinking"],
			reaction: ["Greeting", "Writing"]
		},
		EUPHORIC: {
			idle: ["Congratulate", "GetWizardy", "Wave"],
			talk: ["Congratulate", "Explain", "Wave"],
			think: ["GetTechy", "Thinking"],
			reaction: ["Congratulate", "GetWizardy"]
		},
		PARANOID: {
			idle: ["Searching", "IdleSideToSide", "LookLeft", "LookRight"],
			talk: ["IdleSideToSide", "Explain"],
			think: ["Searching", "LookUpLeft", "LookUpRight"],
			reaction: ["GetAttention", "Searching"]
		},
		EXISTENTIAL: {
			idle: ["RestPose", "IdleAtom", "LookUp"],
			talk: ["RestPose", "Explain"],
			think: ["Thinking", "IdleAtom"],
			reaction: ["GetTechy", "RestPose"]
		},
		MELANCHOLIC: {
			idle: ["RestPose", "IdleRopePile", "LookDown"],
			talk: ["RestPose", "LookDown"],
			think: ["LookDown", "IdleRopePile"],
			reaction: ["RestPose", "LookDown"]
		},
		GLITCHED: {
			idle: ["IdleSideToSide", "Searching", "GetTechy"],
			talk: ["GetAttention", "Wave"],
			think: ["Thinking", "GetTechy"],
			reaction: ["GetAttention", "GetTechy"]
		},
		PIRATE: {
			idle: ["Searching", "Wave", "Explain"],
			talk: ["Explain", "Wave"],
			think: ["Searching", "LookRight"],
			reaction: ["Wave", "Congratulate"]
		},
		ARCHAIC: {
			idle: ["Writing", "GetWizardy", "Explain"],
			talk: ["Explain", "Writing"],
			think: ["CheckingSomething", "Thinking"],
			reaction: ["GetWizardy", "Writing"]
		},
		DELTARUNE: {
			idle: ["RestPose", "Searching", "Idle1_1"],
			talk: ["RestPose", "Explain"],
			think: ["Thinking", "RestPose"],
			reaction: ["RestPose", "GetAttention"]
		}
	};

	const ACTION_ANIMATION_MAP = {
		send_mail: "SendMail",
		check_mail: "CheckingSomething",
		compose_mail: "Writing",
		save_note: "Save",
		create_file: "Save",
		write_memo: "Writing",
		empty_trash: "EmptyTrash",
		search_files: "Searching",
		search: "Searching",
		print: "Print",
		diagnostics: "Processing",
		defrag: "Processing",
		game_win: "Congratulate",
		game_lose: "IdleHeadScratch",
		game_pong: "Alert",
		game_simon: "GetArtsy",
		game_ttt: "Wave",
		game_memory: "CheckingSomething",
		game_hangman: "Writing",
		game_quiz: "CheckingSomething",
		game_guess: "Thinking",
		game_rps: "Wave",
		game_mines: "Searching",
		personality_quiz: "GetWizardy",
		wheel: "GetArtsy",
		cipher: "CheckingSomething",
		tps: "Wave",
		date_calc: "CheckingSomething",
		milestone_unlock: "Congratulate",
		play_music: "Hearing_1",
		toggle_music: "Alert",
		show_clippy: "Show",
		hide_clippy: "Hide",
		goodbye: "GoodBye",
		welcome: "Greeting",
		wizard_help: "GetWizardy",
		tech_inquiry: "GetTechy",
		math_inquiry: "Thinking",
		artsy_inquiry: "GetArtsy",
		atom: "IdleAtom",
		tap: "IdleFingerTap",
		snooze: "IdleSnooze",
		fatigue: "IdleRopePile",
		gesture_down: "GestureDown",
		gesture_up: "GestureUp",
		gesture_left: "GestureLeft",
		gesture_right: "GestureRight",
		look_down: "LookDown",
		look_up: "LookUp",
		look_left: "LookLeft",
		look_right: "LookRight",
		look_down_left: "LookDownLeft",
		look_down_right: "LookDownRight",
		look_up_left: "LookUpLeft",
		look_up_right: "LookUpRight"
	};

	const PRIORITY = {
		IDLE: 0,
		LOOK: 1,
		TALK: 2,
		THINK: 3,
		REACTION: 4,
		ACTION: 5,
		CRITICAL: 6
	};

	class ClippyAnimatorController {
		constructor() {
			this.currentAnimation = 'Idle1_1';
			this.currentCategory = 'idle';
			this.currentPriority = PRIORITY.IDLE;
			this.animEndTime = 0;
			this.currentTimer = null;
			this.sequenceQueue = [];
			this.targetElements = new Set();
			this.themeStyle = 'classic';
			this.isLocked = false;
			this.lastLookTimestamp = 0;
			this.fallbackStaticPath = '../assets/images/desk/clippy/idle.png';
			this.initSettings();
			this.loadManifest();
		}

		async loadManifest() {
			if (typeof fetch !== 'function') return;
			try {
				const manifestUrl = `${this.getBaseUrl()}manifest.json`;
				const response = await fetch(manifestUrl);
				if (response.ok) {
					const data = await response.json();
					if (data && typeof data === 'object') {
						for (const [key, meta] of Object.entries(data)) {
							if (meta && meta.file) {
								MANIFEST[key] = Object.assign(MANIFEST[key] || {}, meta);
							}
						}
					}
				}
			} catch (e) {}
		}

		initSettings() {
			try {
				if (window.SettingsApp && typeof window.SettingsApp.get === 'function') {
					this.themeStyle = window.SettingsApp.get('clippyAnimationTheme') || 'classic';
				}
			} catch (e) {
				this.themeStyle = 'classic';
			}
		}

		getBaseUrl() {
			return '../assets/images/desk/clippy/gifs/';
		}

		getAnimationPath(animName) {
			const resolvedName = this.resolveAnimationName(animName);
			const meta = MANIFEST[resolvedName] || MANIFEST.Idle1_1;
			return `${this.getBaseUrl()}${meta.file}`;
		}

		resolveAnimationName(name) {
			if (!name) return 'Idle1_1';
			if (MANIFEST[name]) {
				if (this.themeStyle === 'modern') {
					return CLASSIC_TO_MODERN_MAP[name] || name;
				}
				return name;
			}
			if (this.themeStyle === 'classic') {
				for (const [classic, modern] of Object.entries(CLASSIC_TO_MODERN_MAP)) {
					if (modern === name) return classic;
				}
			}
			return MANIFEST[name] ? name : 'Idle1_1';
		}

		getAnimationDuration(animName) {
			const resolved = this.resolveAnimationName(animName);
			const meta = MANIFEST[resolved];
			return meta ? meta.total_duration_ms : 2500;
		}

		registerElement(element) {
			if (!element) return;
			this.targetElements.add(element);
			this.updateElementSource(element, this.currentAnimation);
		}

		unregisterElement(element) {
			if (!element) return;
			this.targetElements.delete(element);
		}

		setThemeStyle(style) {
			this.themeStyle = style === 'modern' ? 'modern' : 'classic';
			this.play(this.currentAnimation, { force: true });
		}

		isPlayingProtectedAnimation() {
			const now = Date.now();
			return (this.isLocked || (this.currentPriority >= PRIORITY.ACTION && now < this.animEndTime));
		}

		play(animationName, options = {}) {
			const isEnabled = (window.SettingsApp && typeof window.SettingsApp.get === 'function')
				? (window.SettingsApp.get('clippyAnimationsEnabled') !== false)
				: true;

			if (!isEnabled) {
				this.currentAnimation = 'RestPose';
				this.currentPriority = PRIORITY.IDLE;
				this.isLocked = false;
				this.targetElements.forEach(el => this.updateElementSource(el, 'RestPose', false));
				return Promise.resolve();
			}

			const priority = options.priority !== undefined ? options.priority : PRIORITY.ACTION;
			const now = Date.now();

			if (this.isLocked && !options.force) {
				return Promise.resolve();
			}

			if (now < this.animEndTime && priority < this.currentPriority && !options.force) {
				return Promise.resolve();
			}

			const targetAnim = this.resolveAnimationName(animationName);
			const duration = options.duration || this.getAnimationDuration(targetAnim);
			const isSameRunning = (this.currentAnimation === targetAnim && now < this.animEndTime && !options.force);

			this.currentAnimation = targetAnim;
			this.currentPriority = priority;
			this.animEndTime = now + duration;
			const loop = !!options.loop;

			if (options.lock) {
				this.isLocked = true;
			}

			if (this.currentTimer) {
				clearTimeout(this.currentTimer);
				this.currentTimer = null;
			}

			if (!isSameRunning || options.restart) {
				this.targetElements.forEach(el => {
					this.updateElementSource(el, targetAnim, options.restart === true);
				});
			}

			return new Promise((resolve) => {
				if (loop) {
					resolve();
					return;
				}

				this.currentTimer = setTimeout(() => {
					this.currentTimer = null;
					if (options.lock) {
						this.isLocked = false;
					}

					if (this.sequenceQueue.length > 0) {
						const nextItem = this.sequenceQueue.shift();
						this.play(nextItem.anim, nextItem.options).then(resolve);
						return;
					}

					if (typeof options.onComplete === 'function') {
						options.onComplete();
					}

					this.currentPriority = PRIORITY.IDLE;
					if (!options.persist) {
						this.playIdle();
					}
					resolve();
				}, duration);
			});
		}

		playSequence(sequence, options = {}) {
			if (!Array.isArray(sequence) || sequence.length === 0) return Promise.resolve();
			this.sequenceQueue = sequence.slice(1).map(anim => {
				if (typeof anim === 'string') return { anim, options: { ...options, priority: options.priority || PRIORITY.ACTION } };
				return anim;
			});
			const first = sequence[0];
			const firstAnim = typeof first === 'string' ? first : first.anim;
			const firstOpts = typeof first === 'string' ? { ...options, priority: options.priority || PRIORITY.ACTION } : first.options;
			return this.play(firstAnim, firstOpts);
		}

		updateElementSource(element, animName, restart = false) {
			if (!element) return;
			const isImg = element.tagName === 'IMG';
			const path = this.getAnimationPath(animName);
			if (isImg) {
				if (restart) {
					element.src = '';
					element.src = path;
				} else if (element.src !== path && !element.src.endsWith(path)) {
					element.src = path;
				}
			} else {
				element.style.backgroundImage = `url("${path}")`;
			}
		}

		playForAction(actionKey, options = {}) {
			const anim = ACTION_ANIMATION_MAP[actionKey] || 'Explain';
			return this.play(anim, options);
		}

		playForMood(mood, stateType = 'idle', options = {}) {
			const moodKey = (mood || 'OPTIMISTIC').toUpperCase();
			const config = MOOD_ANIMATION_MAP[moodKey] || MOOD_ANIMATION_MAP.OPTIMISTIC;
			const pool = config[stateType] || config.idle || ['Idle1_1'];
			const picked = pool[Math.floor(Math.random() * pool.length)];
			return this.play(picked, options);
		}

		playTalking(mood, options = {}) {
			if (this.isLocked && !options.force) return Promise.resolve();
			const now = Date.now();
			if (now < this.animEndTime && this.currentPriority >= PRIORITY.ACTION && !options.force) return Promise.resolve();
			const moodKey = (mood || (window.ClippyBrain ? window.ClippyBrain.getMood() : 'OPTIMISTIC')).toUpperCase();
			const config = MOOD_ANIMATION_MAP[moodKey] || MOOD_ANIMATION_MAP.OPTIMISTIC;
			const pool = config.talk || ['Explain', 'IdleEyeBrowRaise'];
			const picked = pool[Math.floor(Math.random() * pool.length)];
			return this.play(picked, { loop: false, persist: true, priority: PRIORITY.TALK, restart: false, ...options });
		}

		playThinking(mood, options = {}) {
			if (this.isPlayingProtectedAnimation() && !options.force) return Promise.resolve();
			if (this.isLocked && !options.force) return Promise.resolve();
			const now = Date.now();
			if (now < this.animEndTime && this.currentPriority >= PRIORITY.ACTION && !options.force) return Promise.resolve();
			const moodKey = (mood || (window.ClippyBrain ? window.ClippyBrain.getMood() : 'OPTIMISTIC')).toUpperCase();
			const config = MOOD_ANIMATION_MAP[moodKey] || MOOD_ANIMATION_MAP.OPTIMISTIC;
			const pool = config.think || ['Thinking', 'CheckingSomething'];
			const picked = pool[Math.floor(Math.random() * pool.length)];
			return this.play(picked, { loop: false, persist: true, priority: PRIORITY.THINK, restart: false, ...options });
		}

		playIdle(options = {}) {
			if (this.isPlayingProtectedAnimation() && !options.force) return Promise.resolve();
			if (this.isLocked && !options.force) return Promise.resolve();
			const now = Date.now();
			if (now < this.animEndTime && this.currentPriority > PRIORITY.IDLE && !options.force) return Promise.resolve();
			const brain = window.ClippyBrain;
			const mood = brain ? brain.getMood() : 'OPTIMISTIC';
			return this.playForMood(mood, 'idle', { loop: false, persist: true, priority: PRIORITY.IDLE, restart: false, ...options });
		}

		playGesture(direction = 'down', options = {}) {
			let anim = 'GestureDown';
			if (direction === 'up') anim = 'GestureUp';
			else if (direction === 'left') anim = 'GestureLeft';
			else if (direction === 'right') anim = 'GestureRight';
			return this.play(anim, { priority: PRIORITY.REACTION, lock: true, ...options });
		}

		playLook(direction = 'down', options = {}) {
			const now = Date.now();
			if (now - this.lastLookTimestamp < 4000 && !options.force) {
				return Promise.resolve();
			}
			if (this.isPlayingProtectedAnimation() && !options.force) {
				return Promise.resolve();
			}
			if (this.isLocked && !options.force) {
				return Promise.resolve();
			}
			if (now < this.animEndTime && this.currentPriority > PRIORITY.IDLE && !options.force) {
				return Promise.resolve();
			}
			this.lastLookTimestamp = now;
			const gazeMap = {
				down: 'LookDown',
				up: 'LookUp',
				left: 'LookLeft',
				right: 'LookRight',
				down_left: 'LookDownLeft',
				down_right: 'LookDownRight',
				up_left: 'LookUpLeft',
				up_right: 'LookUpRight'
			};
			const anim = gazeMap[direction] || 'LookDown';
			return this.play(anim, { priority: PRIORITY.LOOK, restart: false, ...options });
		}

		preloadKeyAnimations() {
			this.loadManifest();
			const keyList = [
				'Idle1_1', 'Explain', 'Thinking', 'Greeting', 'Congratulate', 'Save',
				'EmptyTrash', 'SendMail', 'Searching', 'Writing', 'RestPose',
				'Alert', 'Hearing_1', 'GetTechy', 'GetWizardy', 'GetArtsy',
				'GetAttention', 'GoodBye', 'Print', 'Processing'
			];
			const baseUrl = this.getBaseUrl();
			keyList.forEach(name => {
				const classicMeta = MANIFEST[name];
				if (classicMeta) {
					const img = new Image();
					img.src = `${baseUrl}${classicMeta.file}`;
				}
				const modernName = CLASSIC_TO_MODERN_MAP[name];
				if (modernName && MANIFEST[modernName]) {
					const mImg = new Image();
					mImg.src = `${baseUrl}${MANIFEST[modernName].file}`;
				}
			});
		}
	}

	window.ClippyAnimator = new ClippyAnimatorController();
})();
