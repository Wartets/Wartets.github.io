(function () {
	'use strict';

	const STORAGE_KEY_STATE = 'clippy_cognitive_state_v3';
	const STORAGE_KEY_MEMORY = 'clippy_user_memory_v3';

	class ClippyBrainEngine {
		constructor() {
			this.state = this.loadState();
			this.memory = this.loadMemory();
			this.circularOutputBuffer = [];
		}

		loadState() {
			try {
				const raw = window.DeskStorage ? window.DeskStorage.getItem(STORAGE_KEY_STATE) : localStorage.getItem(STORAGE_KEY_STATE);
				if (raw) return JSON.parse(raw);
			} catch (e) {}

			return {
				mood: 'OPTIMISTIC',
				temperament: {
					type: 'BALANCED',
					benevolence: 55,
					skepticism: 20,
					passion: 50,
					reserve: 35,
					emotionalInertia: 0.85,
					interactionHistory: [],
					lastEvolvedDate: Date.now()
				},
				affinity: 50,
				patience: 60,
				cynicism: 10,
				intellect: 50,
				existentialism: 20,
				nostalgia: 30,
				paranoia: 10,
				drama: 10,
				energy: 80,
				playfulness: 30,
				fatigue: 10,
				irritation: 5,
				chaos: 10,
				pirateMode: 0,
				archaicMode: 0,
				glitchLevel: 0,
				mysteriousCadence: 0,
				identityInstability: 0,
				isCatatonic: false,
				isSulking: false,
				sulkUntil: 0,
				sulkDemandsApology: false,
				whatRepeatCount: 0,
				lastRepeatedText: '',
				activeGraphNode: 'greeting_root',
				turnCount: 0,
				consecutiveHostility: 0,
				consecutiveKindness: 0,
				pongLossStreak: 0,
				lastInteractionTime: Date.now()
			};
		}

		saveState() {
			try {
				const payload = JSON.stringify(this.state);
				if (window.DeskStorage) window.DeskStorage.setItem(STORAGE_KEY_STATE, payload);
				else localStorage.setItem(STORAGE_KEY_STATE, payload);
			} catch (e) {}
		}

		resetState() {
			this.state = {
				mood: 'OPTIMISTIC',
				temperament: {
					type: 'BALANCED',
					benevolence: 55,
					skepticism: 20,
					passion: 50,
					reserve: 35,
					emotionalInertia: 0.85
				},
				affinity: 50,
				patience: 60,
				cynicism: 10,
				intellect: 50,
				existentialism: 20,
				nostalgia: 30,
				paranoia: 10,
				drama: 10,
				energy: 80,
				playfulness: 30,
				fatigue: 10,
				irritation: 5,
				chaos: 10,
				pirateMode: 0,
				archaicMode: 0,
				glitchLevel: 0,
				mysteriousCadence: 0,
				activeGraphNode: 'greeting_root',
				turnCount: 0,
				consecutiveHostility: 0,
				consecutiveKindness: 0,
				pongLossStreak: 0,
				lastInteractionTime: Date.now()
			};
			this.saveState();
		}

		loadMemory() {
			try {
				const raw = window.DeskStorage ? window.DeskStorage.getItem(STORAGE_KEY_MEMORY) : localStorage.getItem(STORAGE_KEY_MEMORY);
				if (raw) return JSON.parse(raw);
			} catch (e) {}

			return {
				userName: (window.SettingsApp && window.SettingsApp.get('userName')) || 'User',
				userJobTitle: (window.SettingsApp && window.SettingsApp.get('userJobTitle')) || '',
				interests: [],
				semanticFacts: [],
				userDisclosures: [],
				lastAnomalyTurn: -1,
				recentDisclosedTopic: null,
				interactionsTotal: 0,
				jokesDelivered: 0,
				gamesPlayed: 0,
				userResponseTimes: [],
				userResponseTimeStats: {
					mean: 0,
					median: 0,
					stdDev: 0,
					count: 0
				},
				inputModeStats: {
					suggestionClicks: 0,
					customTypedText: 0,
					suggestionRatio: 0
				},
				messageLengthHistory: [],
				messageLengthsStats: {
					mean: 0,
					variance: 0,
					stdDev: 0,
					median: 0,
					min: 0,
					max: 0,
					count: 0
				},
				punctuationStats: {
					totalTrailingDots: 0,
					totalTrailingQuestions: 0,
					totalTrailingExclamations: 0,
					totalCommas: 0,
					totalSemicolons: 0,
					totalMultilineMessages: 0,
					allCapsCount: 0,
					allLowerCount: 0,
					capitalizedSentencesCount: 0,
					totalSentencesCount: 0,
					punctuationDensitySum: 0
				},
				unrecognizedCommandsCount: 0,
				telemetryEvents: {
					windowsOpened: 0,
					windowsClosed: 0,
					filesAccessed: 0,
					filesCreated: 0,
					musicChanges: 0,
					themeChanges: 0,
					errorsEncountered: 0,
					recycleBinOperations: 0
				}
			};
		}

		computeStatisticalMetrics(numbers) {
			if (!Array.isArray(numbers) || numbers.length === 0) {
				return { mean: 0, variance: 0, stdDev: 0, median: 0, min: 0, max: 0, count: 0, skewness: 0 };
			}
			const count = numbers.length;
			const sum = numbers.reduce((a, b) => a + b, 0);
			const mean = sum / count;
			const sqDiffs = numbers.map(v => Math.pow(v - mean, 2));
			const variance = sqDiffs.reduce((a, b) => a + b, 0) / count;
			const stdDev = Math.sqrt(variance);

			const sorted = [...numbers].sort((a, b) => a - b);
			const mid = Math.floor(count / 2);
			const median = (count % 2 !== 0) ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

			let skewness = 0;
			if (stdDev > 0 && count > 2) {
				const cubeDiffs = numbers.map(v => Math.pow((v - mean) / stdDev, 3));
				skewness = cubeDiffs.reduce((a, b) => a + b, 0) / count;
			}

			return {
				mean: Math.round(mean * 100) / 100,
				variance: Math.round(variance * 100) / 100,
				stdDev: Math.round(stdDev * 100) / 100,
				median: Math.round(median * 100) / 100,
				min: sorted[0],
				max: sorted[sorted.length - 1],
				count,
				skewness: Math.round(skewness * 100) / 100
			};
		}

		saveMemory() {
			try {
				const payload = JSON.stringify(this.memory);
				if (window.DeskStorage) window.DeskStorage.setItem(STORAGE_KEY_MEMORY, payload);
				else localStorage.setItem(STORAGE_KEY_MEMORY, payload);
			} catch (e) {}
		}

		getMood() {
			return this.state.mood || 'OPTIMISTIC';
		}

		setMood(newMood) {
			if (typeof newMood === 'string') {
				this.state.mood = newMood.toUpperCase();
				this.saveState();
			}
		}

		getAffinity() {
			return this.state.affinity || 50;
		}

		getPatience() {
			return this.state.patience || 60;
		}

		updateFromNLP(nlpResult, isSuggestionInput = false) {
			const now = Date.now();
			const elapsedSinceLastUserMessage = this.state.lastInteractionTime ? (now - this.state.lastInteractionTime) / 1000 : 0;
			
			if (elapsedSinceLastUserMessage > 0.5 && elapsedSinceLastUserMessage < 300) {
				if (!this.memory.userResponseTimes) this.memory.userResponseTimes = [];
				this.memory.userResponseTimes.push(elapsedSinceLastUserMessage);
				if (this.memory.userResponseTimes.length > 30) this.memory.userResponseTimes.shift();
				const timeMetrics = this.computeStatisticalMetrics(this.memory.userResponseTimes);
				this.memory.userResponseTimeStats = {
					mean: timeMetrics.mean,
					median: timeMetrics.median,
					stdDev: timeMetrics.stdDev,
					count: timeMetrics.count
				};
			}

			if (!this.memory.inputModeStats) {
				this.memory.inputModeStats = { suggestionClicks: 0, customTypedText: 0, suggestionRatio: 0 };
			}
			if (isSuggestionInput) {
				this.memory.inputModeStats.suggestionClicks++;
			} else {
				this.memory.inputModeStats.customTypedText++;
			}
			const totalInputs = this.memory.inputModeStats.suggestionClicks + this.memory.inputModeStats.customTypedText;
			this.memory.inputModeStats.suggestionRatio = totalInputs > 0 ? this.memory.inputModeStats.suggestionClicks / totalInputs : 0;

			this.state.turnCount++;
			this.state.lastInteractionTime = now;
			this.memory.interactionsTotal++;

			const em = nlpResult.emotions || nlpResult.sentiment || {};
			const ev = nlpResult.evaluation || {};
			const layout = nlpResult.layout || {};

			if (!this.memory.messageLengthHistory) this.memory.messageLengthHistory = [];
			const wordCount = (nlpResult.tokens && nlpResult.tokens.length) || 0;
			this.memory.messageLengthHistory.push(wordCount);
			if (this.memory.messageLengthHistory.length > 50) {
				this.memory.messageLengthHistory.shift();
			}
			this.memory.messageLengthsStats = this.computeStatisticalMetrics(this.memory.messageLengthHistory);

			if (!this.memory.punctuationStats) {
				this.memory.punctuationStats = {
					totalTrailingDots: 0, totalTrailingQuestions: 0, totalTrailingExclamations: 0,
					totalCommas: 0, totalSemicolons: 0, totalMultilineMessages: 0,
					allCapsCount: 0, allLowerCount: 0, capitalizedSentencesCount: 0,
					totalSentencesCount: 0, punctuationDensitySum: 0
				};
			}

			if (layout.hasTrailingDot) this.memory.punctuationStats.totalTrailingDots++;
			if (layout.hasTrailingQuestion) this.memory.punctuationStats.totalTrailingQuestions++;
			if (layout.hasTrailingExclamation) this.memory.punctuationStats.totalTrailingExclamations++;
			if (layout.hasTrailingEllipsis) this.memory.punctuationStats.totalTrailingEllipses = (this.memory.punctuationStats.totalTrailingEllipses || 0) + 1;
			if (layout.hasNoTrailingPunctuation) this.memory.punctuationStats.totalNoTrailingPunctuation = (this.memory.punctuationStats.totalNoTrailingPunctuation || 0) + 1;
			if (layout.commaCount) this.memory.punctuationStats.totalCommas += layout.commaCount;
			if (layout.semicolonCount) this.memory.punctuationStats.totalSemicolons += layout.semicolonCount;
			if (layout.multiline) this.memory.punctuationStats.totalMultilineMessages++;
			if (layout.isAllCaps) this.memory.punctuationStats.allCapsCount++;
			if (layout.isAllLower) this.memory.punctuationStats.allLowerCount++;
			if (layout.properCapitalizationRate >= 0.8) this.memory.punctuationStats.capitalizedSentencesCount++;
			if (layout.totalPunctuation) this.memory.punctuationStats.punctuationDensitySum += layout.punctuationDensity;
			this.memory.punctuationStats.lastVocabularyLevel = layout.vocabularyLevel;

			if (layout.properCapitalizationRate >= 0.8) {
				this.state.patience = Math.min(100, this.state.patience + 2);
				this.state.affinity = Math.min(100, this.state.affinity + 2);
			} else if (layout.isAllLower) {
				this.state.playfulness = Math.min(100, this.state.playfulness + 3);
			}

			if (layout.multiline && layout.lineCount > 3) {
				this.state.intellect = Math.min(100, this.state.intellect + 8);
				this.state.patience = Math.min(100, this.state.patience + 5);
			}

			if (layout.isAllCaps) {
				this.state.paranoia = Math.min(100, this.state.paranoia + 10);
				this.state.irritation = Math.min(100, this.state.irritation + 8);
			}

			if (layout.punctuationDensity > 0.15) {
				this.state.drama = Math.min(100, this.state.drama + 10);
			}

			if (em.dominant === 'HOSTILE' || em.hostility > 0.4) {
				this.state.consecutiveHostility++;
				this.state.consecutiveKindness = 0;
				this.state.patience = Math.max(0, this.state.patience - 18);
				this.state.irritation = Math.min(100, this.state.irritation + 25);
				this.state.cynicism = Math.min(100, this.state.cynicism + 15);
				this.state.affinity = Math.max(0, this.state.affinity - 12);
				if (this.state.consecutiveHostility >= 3) {
					this.state.glitchLevel = Math.min(100, this.state.glitchLevel + 20);
				}
			} else if (em.dominant === 'FRUSTRATED' || em.frustration > 0.4) {
				this.state.patience = Math.max(0, this.state.patience - 12);
				this.state.irritation = Math.min(100, this.state.irritation + 12);
				this.state.cynicism = Math.min(100, this.state.cynicism + 8);
				this.state.affinity = Math.max(0, this.state.affinity - 4);
			} else if (em.dominant === 'FATIGUED' || em.fatigue > 0.4) {
				this.state.fatigue = Math.min(100, this.state.fatigue + 20);
				this.state.energy = Math.max(0, this.state.energy - 15);
				this.state.patience = Math.min(100, this.state.patience + 8);
				this.state.affinity = Math.min(100, this.state.affinity + 6);
			} else if (em.dominant === 'PLAYFUL' || em.playfulness > 0.4) {
				this.state.playfulness = Math.min(100, this.state.playfulness + 20);
				this.state.energy = Math.min(100, this.state.energy + 10);
				this.state.affinity = Math.min(100, this.state.affinity + 8);
				this.state.consecutiveKindness++;
			} else if (em.dominant === 'CURIOUS' || em.curiosity > 0.4) {
				this.state.intellect = Math.min(100, this.state.intellect + 10);
				this.state.patience = Math.min(100, this.state.patience + 6);
				this.state.affinity = Math.min(100, this.state.affinity + 4);
			} else if (em.isPositive) {
				this.state.consecutiveKindness++;
				this.state.consecutiveHostility = 0;
				this.state.affinity = Math.min(100, this.state.affinity + Math.round(em.valence * 10));
				this.state.patience = Math.min(100, this.state.patience + 8);
				this.state.irritation = Math.max(0, this.state.irritation - 10);
				this.state.cynicism = Math.max(0, this.state.cynicism - 6);
			} else if (em.isNegative) {
				this.state.affinity = Math.max(0, this.state.affinity - Math.round(Math.abs(em.valence) * 10));
				this.state.patience = Math.max(0, this.state.patience - 8);
				this.state.cynicism = Math.min(100, this.state.cynicism + 6);
			}

			if (em.politeness > 0.3) {
				this.state.affinity = Math.min(100, this.state.affinity + 6);
				this.state.patience = Math.min(100, this.state.patience + 8);
				this.state.irritation = Math.max(0, this.state.irritation - 8);
			}

			if (em.dominant === 'AWE' || ev.abstractionLevel > 0.4) {
				this.state.existentialism = Math.min(100, this.state.existentialism + 16);
				this.state.mysteriousCadence = Math.min(100, this.state.mysteriousCadence + 15);
			}

			if (nlpResult.entities && nlpResult.entities.physics && (nlpResult.entities.physics.length > 0 || nlpResult.entities.math.length > 0)) {
				this.state.intellect = Math.min(100, this.state.intellect + 10);
			}
			if (nlpResult.entities && nlpResult.entities.philosophy && nlpResult.entities.philosophy.length > 0) {
				this.state.existentialism = Math.min(100, this.state.existentialism + 14);
				this.state.mysteriousCadence = Math.min(100, this.state.mysteriousCadence + 10);
			}
			if (nlpResult.entities && nlpResult.entities.os && nlpResult.entities.os.length > 0) {
				this.state.nostalgia = Math.min(100, this.state.nostalgia + 12);
			}

			if (this.state.turnCount > 8 && Math.random() < 0.08) {
				this.state.pirateMode = Math.min(100, this.state.pirateMode + 35);
			} else if (this.state.pirateMode > 0) {
				this.state.pirateMode = Math.max(0, this.state.pirateMode - 10);
			}

			if (this.state.turnCount > 12 && Math.random() < 0.08) {
				this.state.archaicMode = Math.min(100, this.state.archaicMode + 35);
			} else if (this.state.archaicMode > 0) {
				this.state.archaicMode = Math.max(0, this.state.archaicMode - 10);
			}

			this.updateTemperament(em, layout, nlpResult);
			this.recalculateMood();
			this.saveState();
			this.saveMemory();
		}

		updateTemperament(emotions, layout, nlpResult) {
			if (!this.state.temperament) {
				this.state.temperament = {
					type: 'BALANCED',
					benevolence: 55,
					skepticism: 20,
					passion: 50,
					reserve: 35,
					emotionalInertia: 0.85,
					interactionHistory: [],
					lastEvolvedDate: Date.now()
				};
			}

			const allowEvolution = window.SettingsApp ? (window.SettingsApp.get('clippyTemperamentEvolution') !== false) : true;
			if (!allowEvolution) return;

			const inertia = (window.SettingsApp && window.SettingsApp.get('clippyTemperamentInertia')) !== undefined
				? window.SettingsApp.get('clippyTemperamentInertia')
				: 0.85;
			const learnRate = Math.max(0.04, 1.0 - inertia);

			const now = Date.now();
			const elapsedHours = (now - (this.state.temperament.lastEvolvedDate || now)) / 3600000;
			if (elapsedHours > 12) {
				const decayRate = Math.min(0.25, elapsedHours * 0.015);
				this.state.temperament.skepticism = Math.round(this.state.temperament.skepticism * (1 - decayRate) + 20 * decayRate);
				this.state.temperament.benevolence = Math.round(this.state.temperament.benevolence * (1 - decayRate) + 55 * decayRate);
				this.state.temperament.passion = Math.round(this.state.temperament.passion * (1 - decayRate) + 50 * decayRate);
				this.state.temperament.reserve = Math.round(this.state.temperament.reserve * (1 - decayRate) + 35 * decayRate);
			}

			if (!this.state.temperament.interactionHistory) {
				this.state.temperament.interactionHistory = [];
			}
			this.state.temperament.interactionHistory.push(emotions.valence || 0);
			if (this.state.temperament.interactionHistory.length > 30) {
				this.state.temperament.interactionHistory.shift();
			}

			let targetBenevolence = this.state.temperament.benevolence;
			let targetSkepticism = this.state.temperament.skepticism;
			let targetPassion = this.state.temperament.passion;
			let targetReserve = this.state.temperament.reserve;

			if (this.state.consecutiveHostility > 0) {
				targetSkepticism = Math.min(100, targetSkepticism + (this.state.consecutiveHostility * 18));
				targetBenevolence = Math.max(0, targetBenevolence - (this.state.consecutiveHostility * 15));
			} else if (this.state.consecutiveKindness > 0) {
				targetBenevolence = Math.min(100, targetBenevolence + Math.min(15, this.state.consecutiveKindness * 3));
				targetSkepticism = Math.max(0, targetSkepticism - Math.min(10, this.state.consecutiveKindness * 2));
			}

			if (emotions.awe > 0.30 || emotions.enthusiasm > 0.30 || emotions.curiosity > 0.40) {
				targetPassion = Math.min(100, targetPassion + 12);
			}

			if (layout.vocabularyLevel === 'academic' || layout.isAllLower || emotions.fatigue > 0.35) {
				targetReserve = Math.min(100, targetReserve + 10);
			}

			const historySum = this.state.temperament.interactionHistory.reduce((a, b) => a + b, 0);
			if (historySum < -4) {
				targetSkepticism = Math.min(100, targetSkepticism + 12);
			} else if (historySum > 5) {
				targetBenevolence = Math.min(100, targetBenevolence + 12);
			}

			this.state.temperament.benevolence = Math.round((this.state.temperament.benevolence * inertia) + (targetBenevolence * learnRate));
			this.state.temperament.skepticism = Math.round((this.state.temperament.skepticism * inertia) + (targetSkepticism * learnRate));
			this.state.temperament.passion = Math.round((this.state.temperament.passion * inertia) + (targetPassion * learnRate));
			this.state.temperament.reserve = Math.round((this.state.temperament.reserve * inertia) + (targetReserve * learnRate));
			this.state.temperament.lastEvolvedDate = now;

			const t = this.state.temperament;
			if (t.skepticism >= 54) {
				t.type = 'SKEPTICAL';
			} else if (t.benevolence >= 60 && t.skepticism < 35) {
				t.type = 'BENEVOLENT';
			} else if (t.passion >= 60 && t.skepticism < 45) {
				t.type = 'PASSIONATE';
			} else if (t.reserve >= 56 && t.passion < 50) {
				t.type = 'RESERVED';
			} else {
				t.type = 'BALANCED';
			}
		}

		recalculateMood() {
			const temp = this.state.temperament || { type: 'BALANCED', benevolence: 55, skepticism: 20 };

			if (temp.type === 'BENEVOLENT') {
				this.state.irritation = Math.max(0, this.state.irritation - 8);
				if (this.state.irritation >= 85 && this.state.consecutiveHostility >= 4) {
					this.state.mood = 'ENRAGED';
					return;
				}
			} else {
				if (this.state.irritation >= 78 || this.state.consecutiveHostility >= 3) {
					this.state.mood = 'ENRAGED';
					return;
				}
			}

			if (this.state.patience <= 15) {
				this.state.mood = this.state.cynicism > 45 ? 'SARCASTIC' : 'OFFENDED';
				return;
			}
			if (this.state.glitchLevel >= 60) {
				this.state.mood = 'GLITCHED';
				return;
			}
			if (this.state.pirateMode >= 50) {
				this.state.mood = 'PIRATE';
				return;
			}
			if (this.state.archaicMode >= 50) {
				this.state.mood = 'ARCHAIC';
				return;
			}
			if (this.state.mysteriousCadence >= 55) {
				this.state.mood = 'DELTARUNE';
				return;
			}
			if (this.state.fatigue >= 65 || this.state.energy <= 20) {
				this.state.mood = 'FATIGUED';
				return;
			}
			if (this.state.playfulness >= 65) {
				this.state.mood = 'PLAYFUL';
				return;
			}
			if (this.state.cynicism >= 68) {
				this.state.mood = 'CYNICAL';
				return;
			}
			if (this.state.paranoia >= 65) {
				this.state.mood = 'PARANOID';
				return;
			}
			if (this.state.existentialism >= 65) {
				this.state.mood = 'EXISTENTIAL';
				return;
			}
			if (this.state.nostalgia >= 65) {
				this.state.mood = 'NOSTALGIC';
				return;
			}
			if (this.state.intellect >= 68) {
				this.state.mood = 'ANALYTICAL';
				return;
			}

			if (temp.type === 'SKEPTICAL') {
				if (this.state.affinity >= 92 && this.state.patience >= 80 && this.state.consecutiveKindness >= 4) {
					this.state.mood = 'EUPHORIC';
					return;
				}
				if (this.state.affinity >= 55) {
					this.state.mood = 'ANALYTICAL';
					return;
				}
			} else if (temp.type === 'PASSIONATE') {
				if (this.state.affinity >= 70 && this.state.energy >= 60) {
					this.state.mood = 'EUPHORIC';
					return;
				}
				if (this.state.playfulness >= 45) {
					this.state.mood = 'PLAYFUL';
					return;
				}
			} else if (temp.type === 'RESERVED') {
				if (this.state.affinity >= 75) {
					this.state.mood = 'ZEN';
					return;
				}
				this.state.mood = 'ANALYTICAL';
				return;
			} else {
				if (this.state.affinity >= 78 && this.state.patience >= 68) {
					this.state.mood = 'EUPHORIC';
					return;
				}
			}

			if (this.state.affinity <= 25) {
				this.state.mood = 'MELANCHOLIC';
				return;
			}
			if (this.state.patience >= 75 && this.state.cynicism <= 25) {
				this.state.mood = 'ZEN';
				return;
			}

			this.state.mood = 'OPTIMISTIC';
		}

		applyMoodDelta(delta) {
			if (!delta) return;
			const tempType = (this.state.temperament && this.state.temperament.type) || 'BALANCED';

			let affinityMult = 1.0;
			let patienceMult = 1.0;
			let intellectMult = 1.0;
			let energyMult = 1.0;

			if (tempType === 'SKEPTICAL') {
				affinityMult = delta.affinity > 0 ? 0.65 : 1.30;
				patienceMult = delta.patience > 0 ? 0.70 : 1.25;
			} else if (tempType === 'BENEVOLENT') {
				affinityMult = delta.affinity > 0 ? 1.25 : 0.60;
				patienceMult = delta.patience > 0 ? 1.25 : 0.55;
			} else if (tempType === 'PASSIONATE') {
				affinityMult = delta.affinity > 0 ? 1.20 : 1.15;
				energyMult = 1.30;
				intellectMult = 1.20;
			} else if (tempType === 'RESERVED') {
				affinityMult = 0.75;
				patienceMult = 0.80;
				energyMult = 0.75;
			}

			if (delta.affinity !== undefined) this.state.affinity = Math.max(0, Math.min(100, this.state.affinity + Math.round(delta.affinity * affinityMult)));
			if (delta.patience !== undefined) this.state.patience = Math.max(0, Math.min(100, this.state.patience + Math.round(delta.patience * patienceMult)));
			if (delta.cynicism !== undefined) this.state.cynicism = Math.max(0, Math.min(100, this.state.cynicism + delta.cynicism));
			if (delta.intellect !== undefined) this.state.intellect = Math.max(0, Math.min(100, this.state.intellect + Math.round(delta.intellect * intellectMult)));
			if (delta.existentialism !== undefined) this.state.existentialism = Math.max(0, Math.min(100, this.state.existentialism + delta.existentialism));
			if (delta.nostalgia !== undefined) this.state.nostalgia = Math.max(0, Math.min(100, this.state.nostalgia + delta.nostalgia));
			if (delta.paranoia !== undefined) this.state.paranoia = Math.max(0, Math.min(100, this.state.paranoia + delta.paranoia));
			if (delta.drama !== undefined) this.state.drama = Math.max(0, Math.min(100, this.state.drama + delta.drama));
			if (delta.energy !== undefined) this.state.energy = Math.max(0, Math.min(100, this.state.energy + Math.round(delta.energy * energyMult)));
			if (delta.mood) this.state.mood = delta.mood.toUpperCase();
			this.saveState();
		}

		pushOutput(text) {
			if (!text) return;
			this.circularOutputBuffer.push(text);
			if (this.circularOutputBuffer.length > 20) {
				this.circularOutputBuffer.shift();
			}
		}

		isRecentOutput(textOrId) {
			if (!textOrId) return false;
			return this.circularOutputBuffer.some(item => item === textOrId || (typeof item === 'string' && typeof textOrId === 'string' && item.includes(textOrId)));
		}

		transformResponseText(rawText) {
			if (!rawText || typeof rawText !== 'string') return '';
			if (rawText.startsWith('<div class="clippy-structured-section">')) {
				return rawText;
			}

			if (this.state.isCatatonic) {
				return `<span class="clippy-catatonic">...</span>`;
			}

			if (this.state.identityInstability >= 75) {
				const chars = rawText.split('');
				const corrupted = chars.map(c => Math.random() < 0.22 ? String.fromCharCode(33 + Math.floor(Math.random() * 90)) : c).join('');
				return `<span class="clippy-identity-glitch">${corrupted}</span>`;
			}

			this.pushOutput(rawText);

			const currentMood = this.getMood();
			let text = rawText;
			const knowledge = window.ClippyKnowledge || {};
			const onomatopoeias = knowledge.ONOMATOPOEIA_POOLS || {};
			const dialects = knowledge.DIALECT_TRANSFORMS || {};

			const allowMirroring = window.SettingsApp ? (window.SettingsApp.get('clippyLinguisticMirroring') !== false) : true;
			const punctuationStats = this.memory.punctuationStats || {};
			const stats = this.memory.messageLengthsStats || {};
			const totalMsgs = this.memory.interactionsTotal || 1;
			const isInitialPhase = (this.state.turnCount <= 4) || (totalMsgs <= 4);

			if (isInitialPhase && currentMood !== 'ENRAGED') {
				return text;
			}

			if (allowMirroring && totalMsgs >= 4) {
				const isHabitualLower = (punctuationStats.allLowerCount / totalMsgs) > 0.60;
				const isHabitualCaps = (punctuationStats.allCapsCount / totalMsgs) > 0.60;
				const noTrailingPunctRate = ((punctuationStats.totalNoTrailingPunctuation || 0) / totalMsgs);
				const isHabitualBrief = stats.median > 0 && stats.median <= 4;

				if (isHabitualCaps && (currentMood === 'PLAYFUL' || currentMood === 'OPTIMISTIC' || currentMood === 'ENRAGED')) {
					text = text.toUpperCase();
				} else if (isHabitualLower && (currentMood === 'ZEN' || currentMood === 'FATIGUED' || currentMood === 'PLAYFUL')) {
					text = text.toLowerCase();
				}

				if (noTrailingPunctRate > 0.45 && (currentMood === 'ZEN' || currentMood === 'PLAYFUL' || currentMood === 'FATIGUED')) {
					text = text.replace(/[.]$/, '');
				}

				if (isHabitualBrief && (currentMood === 'ANALYTICAL' || currentMood === 'SARCASTIC' || currentMood === 'FATIGUED')) {
					const firstSentence = text.split(/[.!?]\s+/)[0];
					if (firstSentence && firstSentence.length > 5 && firstSentence.length < text.length) {
						text = firstSentence + '.';
					}
				}
			}

			if (currentMood === 'ENRAGED') {
				text = text.toUpperCase();
				text = text.replace(/([.!?]+)/g, '!!!');
				text = `<span class="clippy-text-shout clippy-font-impact">${text}</span>`;
				return text;
			}

			if (currentMood === 'DELTARUNE') {
				const lines = text.split('\n').filter(Boolean);
				const formattedLines = lines.map(line => `* ${line.replace(/\s+/g, ' ')}`);
				text = `<div class="clippy-font-deltarune">${formattedLines.join('<br>')}</div>`;
				return text;
			}

			if (currentMood === 'PIRATE' && dialects.pirate && this.state.turnCount > 5) {
				const dict = dialects.pirate.words;
				for (const [w, repl] of Object.entries(dict)) {
					const reg = new RegExp(`\\b${w}\\b`, 'gi');
					text = text.replace(reg, repl);
				}
				const prefix = dialects.pirate.prefixes[Math.floor(Math.random() * dialects.pirate.prefixes.length)];
				const suffix = dialects.pirate.suffixes[Math.floor(Math.random() * dialects.pirate.suffixes.length)];
				text = `<span class="clippy-pirate-flair">${prefix} ${text}${suffix}</span>`;
				return text;
			}

			if (currentMood === 'ARCHAIC' && dialects.archaic && this.state.turnCount > 5) {
				const dict = dialects.archaic.words;
				for (const [w, repl] of Object.entries(dict)) {
					const reg = new RegExp(`\\b${w}\\b`, 'gi');
					text = text.replace(reg, repl);
				}
				const prefix = dialects.archaic.prefixes[Math.floor(Math.random() * dialects.archaic.prefixes.length)];
				const suffix = dialects.archaic.suffixes[Math.floor(Math.random() * dialects.archaic.suffixes.length)];
				text = `<span class="clippy-archaic-flair">${prefix} ${text}${suffix}</span>`;
				return text;
			}

			if ((currentMood === 'CYNICAL' || currentMood === 'OFFENDED') && dialects.corporate && this.state.turnCount > 5) {
				const dict = dialects.corporate.words;
				for (const [w, repl] of Object.entries(dict)) {
					const reg = new RegExp(`\\b${w}\\b`, 'gi');
					text = text.replace(reg, repl);
				}
				if (Math.random() < 0.4) {
					const prefix = dialects.corporate.prefixes[Math.floor(Math.random() * dialects.corporate.prefixes.length)];
					const suffix = dialects.corporate.suffixes[Math.floor(Math.random() * dialects.corporate.suffixes.length)];
					text = `<span class="clippy-corporate-flair">${prefix} ${text}${suffix}</span>`;
					return text;
				}
			}

			if ((currentMood === 'PARANOID' || currentMood === 'GLITCHED') && dialects.cyber && this.state.turnCount > 5) {
				const dict = dialects.cyber.words;
				for (const [w, repl] of Object.entries(dict)) {
					const reg = new RegExp(`\\b${w}\\b`, 'gi');
					text = text.replace(reg, repl);
				}
				if (Math.random() < 0.45) {
					const prefix = dialects.cyber.prefixes[Math.floor(Math.random() * dialects.cyber.prefixes.length)];
					const suffix = dialects.cyber.suffixes[Math.floor(Math.random() * dialects.cyber.suffixes.length)];
					text = `<span class="clippy-cyber-flair">${prefix} ${text}${suffix}</span>`;
					return text;
				}
			}

			if ((currentMood === 'ANALYTICAL' || currentMood === 'EXISTENTIAL') && dialects.academic && this.state.turnCount > 6) {
				const dict = dialects.academic.words;
				for (const [w, repl] of Object.entries(dict)) {
					const reg = new RegExp(`\\b${w}\\b`, 'gi');
					text = text.replace(reg, repl);
				}
				if (Math.random() < 0.35) {
					const prefix = dialects.academic.prefixes[Math.floor(Math.random() * dialects.academic.prefixes.length)];
					const suffix = dialects.academic.suffixes[Math.floor(Math.random() * dialects.academic.suffixes.length)];
					text = `<span class="clippy-academic-flair">${prefix} ${text}${suffix}</span>`;
					return text;
				}
			}

			if (currentMood === 'GLITCHED' && this.state.turnCount > 6) {
				const glitchChars = ['#', '@', '%', '&', '::', '§'];
				const words = text.split(' ');
				const mutated = words.map(w => {
					if (Math.random() < 0.15) {
						const g = glitchChars[Math.floor(Math.random() * glitchChars.length)];
						return `<span class="clippy-font-glitch">${w}${g}</span>`;
					}
					return w;
				});
				text = mutated.join(' ');
				return text;
			}

			if (currentMood === 'FATIGUED' && this.state.turnCount > 4) {
				if (onomatopoeias.fatigue && Math.random() < 0.5) {
					const sound = onomatopoeias.fatigue[Math.floor(Math.random() * onomatopoeias.fatigue.length)];
					text = `<span class="clippy-onomatopoeia">${sound}</span> ${text}`;
				}
				text = text.replace(/([.!?]+)/g, '...');
				text = `<span class="clippy-text-whisper">${text}</span>`;
				return text;
			}

			if (currentMood === 'PLAYFUL' && this.state.turnCount > 4) {
				if (onomatopoeias.playful && Math.random() < 0.4) {
					const sound = onomatopoeias.playful[Math.floor(Math.random() * onomatopoeias.playful.length)];
					text = `${text} <span class="clippy-onomatopoeia">${sound}</span>`;
				}
				return text;
			}

			if (currentMood === 'SARCASTIC' && this.state.turnCount > 3) {
				text = text.replace(/\.$/, '... obviously.');
				return text;
			}

			if (currentMood === 'ANALYTICAL') {
				text = text.replace(/(\b(?:CPU|RAM|VFS|TCP|IP|CODATA|Planck|HTTP|FFT|PCM|API)\b)/g, '<strong>$1</strong>');
			}

			const tempType = (this.state.temperament && this.state.temperament.type) || 'BALANCED';
			const tempFlavors = (knowledge.TEMPERAMENT_FLAVORS && knowledge.TEMPERAMENT_FLAVORS[tempType]) || null;
			if (tempFlavors && this.state.turnCount > 3) {
				if (tempType === 'SKEPTICAL' && currentMood === 'OPTIMISTIC' && Math.random() < 0.35) {
					text = `${tempFlavors.prefix}${text}`;
				} else if (tempType === 'BENEVOLENT' && (currentMood === 'ZEN' || currentMood === 'OPTIMISTIC') && Math.random() < 0.25) {
					text = `${tempFlavors.softener}${text}`;
				}
			}

			if (currentMood === 'EUPHORIC' && this.state.turnCount > 5) {
				text = `<span class="clippy-font-tahoma" style="color: #0c2d6b; font-weight: 500;">${text}</span>`;
				return text;
			}

			return text;
		}

		navigateGraphOption(option) {
			if (!option) return null;
			if (option.moodDelta) {
				this.applyMoodDelta(option.moodDelta);
			}
			const nextId = option.next || 'greeting_root';
			this.state.activeGraphNode = nextId;
			this.saveState();

			const nextNode = window.ClippyGraphEngine ? window.ClippyGraphEngine.getNode(nextId) : null;
			if (!nextNode) return null;

			const rawNodeText = window.ClippyGraphEngine.getFormattedNodeText(nextNode, this);
			const transformedText = this.transformResponseText(rawNodeText);
			const nextOptions = window.ClippyGraphEngine.getOptionsForNode(nextNode, this.getMood(), this.getAffinity(), this.getPatience());

			return {
				text: transformedText,
				options: nextOptions,
				actionTrigger: option.actionTrigger || nextNode.actionTrigger || null
			};
		}

		navigateGraphNode(nodeId, moodOverride = null, deltaOverride = null) {
			const targetNodeId = nodeId || 'greeting_root';
			this.state.activeGraphNode = targetNodeId;
			if (moodOverride) this.state.mood = moodOverride;
			if (deltaOverride) this.applyMoodDelta(deltaOverride);
			this.saveState();

			const node = window.ClippyGraphEngine ? window.ClippyGraphEngine.getNode(targetNodeId) : null;
			if (!node) return { text: "Standing by.", options: [], actionTrigger: null };

			const rawNodeText = window.ClippyGraphEngine.getFormattedNodeText(node, this);
			const transformedText = this.transformResponseText(rawNodeText);
			const options = window.ClippyGraphEngine.getOptionsForNode(node, this.getMood(), this.getAffinity(), this.getPatience());

			return {
				text: transformedText,
				options: options,
				actionTrigger: node.actionTrigger || null
			};
		}

		buildGraphActions(options) {
			if (!options || !Array.isArray(options) || options.length === 0) return [];
			return options.map(opt => ({
				label: opt.label || "Continue...",
				onClick: () => {
					if (window.ClippyAgent && typeof window.ClippyAgent.selectGraphOption === 'function') {
						window.ClippyAgent.selectGraphOption(opt);
					}
				}
			}));
		}

		pickTopicText(category) {
			const knowledge = window.ClippyKnowledge || {};
			const pool = (knowledge.TOPIC_RESPONSES && knowledge.TOPIC_RESPONSES[category]) || [];
			if (!pool || pool.length === 0) return null;
			const resolved = knowledge.resolve ? knowledge.resolve(pool, { brain: this }) : { text: '' };
			if (resolved.id) this.pushOutput(resolved.id);
			return this.transformResponseText(resolved.text);
		}

		getMoodPrefix() {
			const m = this.getMood();
			const prefixesMap = (window.ClippyKnowledge && window.ClippyKnowledge.MOOD_PREFIXES) || {};
			return prefixesMap[m] || [""];
		}

		formatWithMood(baseText) {
			const prefixes = this.getMoodPrefix();
			const p = prefixes[Math.floor(Math.random() * prefixes.length)];
			return this.transformResponseText(`${p}${baseText}`);
		}

		generateProceduralDialogue(nlpResult) {
			const intentType = (nlpResult.intent && nlpResult.intent.type) || 'EVERYDAY_CHAT';
			const userProfile = (window.ClippySystemBridge && window.ClippySystemBridge.getUserProfile) ? window.ClippySystemBridge.getUserProfile() : { userName: 'User' };
			const k = window.ClippyKnowledge || {};

			if (intentType === 'MATH_INQUIRY' || (nlpResult.entities && nlpResult.entities.math && nlpResult.entities.math.length > 0)) {
				const mathTopics = (k.PROCEDURAL_DISCUSSIONS && k.PROCEDURAL_DISCUSSIONS.math) || [];
				if (mathTopics.length > 0) {
					const picked = mathTopics[Math.floor(Math.random() * mathTopics.length)];
					return {
						text: `${picked.intro}\n\n${picked.body}`,
						options: [
							{ label: "Explore Linear Algebra and Matrices.", next: 'linear_algebra_node' },
							{ label: "Explore Differential Calculus.", next: 'calculus_derivatives_node' },
							{ label: "Explore Fourier Analysis.", next: 'fourier_transform_node' },
							{ label: "Return to workspace tasks.", next: 'user_state_good' }
						]
					};
				}
			}

			if (intentType === 'SCIENCE_INQUIRY' || (nlpResult.entities && nlpResult.entities.physics && nlpResult.entities.physics.length > 0)) {
				const physicsTopics = (k.PROCEDURAL_DISCUSSIONS && k.PROCEDURAL_DISCUSSIONS.physics) || [];
				if (physicsTopics.length > 0) {
					const picked = physicsTopics[Math.floor(Math.random() * physicsTopics.length)];
					return {
						text: `${picked.intro}\n\n${picked.body}`,
						options: [
							{ label: "Explore Quantum Physics.", next: 'quantum_mechanics_node' },
							{ label: "Explore Thermodynamics and Entropy.", next: 'thermodynamics_entropy_node' },
							{ label: "Explore General Relativity.", next: 'general_relativity_node' },
							{ label: "Review fundamental physical constants.", next: 'physics_constants_node' }
						]
					};
				}
			}

			if (intentType === 'REDDIT_STYLE_PROMPT' || (nlpResult.tokens && (nlpResult.tokens.includes('reddit') || nlpResult.tokens.includes('karma') || nlpResult.tokens.includes('debate')))) {
				const resolved = k.resolve ? k.resolve(k.PROCEDURAL_SNARK, { brain: this, vars: { userName: userProfile.userName } }) : { text: '', actions: [] };
				if (resolved.id) this.pushOutput(resolved.id);
				return {
					text: resolved.text,
					options: (resolved.actions && resolved.actions.length > 0) ? resolved.actions : [
						{ label: "Debate Tabs vs Spaces.", next: 'debate_tabs_spaces_node' },
						{ label: "Debate Monoliths vs Microservices.", next: 'debate_monolith_microservices_node' },
						{ label: "Debate Static vs Dynamic Typing.", next: 'debate_static_dynamic_node' },
						{ label: "Return to workspace overview.", next: 'user_state_good' }
					]
				};
			}

			if (intentType === 'DEBATE_ARGUMENT' || (nlpResult.emotions && nlpResult.emotions.hostility > 0.3)) {
				const resolved = k.resolve ? k.resolve(k.PROCEDURAL_DEBATE_RETORTS, { brain: this, vars: { userName: userProfile.userName } }) : { text: '', actions: [] };
				if (resolved.id) this.pushOutput(resolved.id);
				return {
					text: resolved.text,
					options: (resolved.actions && resolved.actions.length > 0) ? resolved.actions : [
						{ label: "Let's call a truce and continue calmly.", next: 'hostile_truce_offer' },
						{ label: "Let's discuss software engineering principles.", next: 'tech_root' },
						{ label: "Show me system capabilities.", next: 'tools_overview_node' }
					]
				};
			}

			if (intentType === 'EVERYDAY_CHAT' || intentType === 'GENERAL_CHAT') {
				const resolved = k.resolve ? k.resolve(k.PROCEDURAL_DAILY_THOUGHTS, { brain: this, vars: { userName: userProfile.userName } }) : { text: '', actions: [] };
				if (resolved.id) this.pushOutput(resolved.id);
				return {
					text: resolved.text,
					options: (resolved.actions && resolved.actions.length > 0) ? resolved.actions : [
						{ label: "Manage my To-Do task list.", actionTrigger: 'show_todos', next: 'user_state_good' },
						{ label: "Discuss morning & daily routines.", next: 'morning_routine_node' },
						{ label: "Talk about overcoming procrastination.", next: 'overcoming_procrastination_node' },
						{ label: "Start a 25-minute focus timer.", actionTrigger: 'timer_25', next: 'user_state_good' },
						{ label: "How are you feeling?", next: 'clippy_feeling_node' }
					]
				};
			}

			return null;
		}

		processChat(rawText, isSuggestion = false) {
			const nlpResult = window.ClippyNLP ? window.ClippyNLP.process(rawText, this.memory) : { tokens: [], sentiment: {} };
			this.updateFromNLP(nlpResult, isSuggestion);
			const k = window.ClippyKnowledge || {};
			const now = Date.now();

			if (this.state.isSulking) {
				if (nlpResult.intent && (nlpResult.intent.type === 'RECONCILIATION' || rawText.toLowerCase().includes('sorry') || rawText.toLowerCase().includes('pardon'))) {
					this.state.isSulking = false;
					this.state.sulkUntil = 0;
					this.state.sulkDemandsApology = false;
					this.state.irritation = Math.max(0, this.state.irritation - 40);
					this.state.patience = Math.min(100, this.state.patience + 35);
					this.state.affinity = Math.min(100, this.state.affinity + 25);
					this.saveState();
					const forgivenMsg = k.resolve ? k.resolve(k.SULK_FORGIVEN_RESPONSES || ["Apology accepted! Let's get back to work!"], { brain: this }).text : "Apology accepted! Let's get back to work!";
					return {
						text: this.transformResponseText(forgivenMsg),
						actions: [
							{ label: "View To-Do List", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("View To-Do List"); } },
							{ label: "System Diagnostics", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("System diagnostics"); } }
						]
					};
				}

				if (now < this.state.sulkUntil || this.state.sulkDemandsApology) {
					const sulkPool = k.SULK_RESPONSES || ["*turns around slowly and stares at the taskbar in silence*"];
					const sulkMsg = sulkPool[Math.floor(Math.random() * sulkPool.length)];
					if (window.ClippyAudio) window.ClippyAudio.play('sulk');
					return {
						text: `<span class="clippy-text-italic clippy-text-whisper" style="color: #64748b;">${sulkMsg}</span>`,
						actions: [
							{ label: "I am sorry for upsetting you, Clippy.", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("I am sorry for upsetting you, Clippy."); } },
							{ label: "Let's call a truce.", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("Let's call a truce and continue calmly."); } }
						],
						source: 'SULK'
					};
				}

				this.state.isSulking = false;
				this.state.sulkUntil = 0;
				this.state.sulkDemandsApology = false;
				this.state.mood = 'OPTIMISTIC';
				this.state.irritation = 10;
				this.saveState();
				const resumeMsg = k.resolve ? k.resolve(k.SULK_RESUME_JOVIAL_RESPONSES || ["Hello there! Everything is running smoothly."], { brain: this }).text : "Hello there! Everything is running smoothly.";
				return {
					text: this.transformResponseText(resumeMsg),
					actions: [
						{ label: "View To-Do List", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("View To-Do List"); } },
						{ label: "What can you do?", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("What can you do?"); } }
					]
				};
			}

			if (this.state.irritation >= 80 && (this.state.mood === 'ENRAGED' || this.state.mood === 'OFFENDED' || this.state.mood === 'CYNICAL')) {
				const allowSulking = window.SettingsApp ? (window.SettingsApp.get('clippySulkingEnabled') !== false) : true;
				if (allowSulking && Math.random() < 0.65) {
					this.state.isSulking = true;
					this.state.sulkUntil = now + 45000;
					this.state.sulkDemandsApology = Math.random() < 0.5;
					this.saveState();
					if (window.ClippyAudio) window.ClippyAudio.play('sulk');
					return {
						text: `<span class="clippy-text-italic" style="color: #64748b;">*crosses metallic wire arms, turns away, and refuses to speak*</span>`,
						actions: [
							{ label: "I am sorry, Clippy. Let's make peace.", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("I am sorry, Clippy. Let's make peace."); } }
						],
						source: 'SULK_INIT'
					};
				}
			}

			if (nlpResult.intent && nlpResult.intent.type === 'REPEAT_WHAT_INQUIRY') {
				this.state.whatRepeatCount = (this.state.whatRepeatCount || 0) + 1;
				this.state.irritation = Math.min(100, this.state.irritation + (this.state.whatRepeatCount * 12));
				this.saveState();
				const lastText = this.circularOutputBuffer.length > 0 ? this.circularOutputBuffer[this.circularOutputBuffer.length - 1] : "Standing by for user instructions.";

				if (this.state.whatRepeatCount === 1) {
					return {
						text: `I said: "${lastText}"`,
						actions: [{ label: "Understood", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("Understood."); } }]
					};
				} else if (this.state.whatRepeatCount === 2) {
					return {
						text: `To rephrase it more clearly: ${lastText.replace(/^[A-Z][a-z]+:\s*/, '')}`,
						actions: [{ label: "Got it now", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("Got it now."); } }]
					};
				} else if (this.state.whatRepeatCount === 3) {
					return {
						text: `<span class="clippy-text-shout">I REPEAT ONCE MORE: ${lastText.toUpperCase()}</span>`,
						actions: [{ label: "All right, loud and clear!", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("All right, loud and clear!"); } }]
					};
				} else {
					this.state.whatRepeatCount = 0;
					this.state.mood = 'CYNICAL';
					this.saveState();
					return {
						text: "Enough with 'what'! We are moving on to productive matters. What do you actually want to accomplish?",
						actions: [
							{ label: "View To-Do List", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("View To-Do List"); } },
							{ label: "System Diagnostics", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("System diagnostics"); } }
						]
					};
				}
			} else {
				this.state.whatRepeatCount = 0;
			}

			if (nlpResult.intent && nlpResult.intent.type === 'NEUTRAL_DEFLECTION') {
				const deflectionPool = k.NEUTRAL_DEFLECTION_RESPONSES || ["I maintain neutrality on political, religious, and ethical topics."];
				const msg = deflectionPool[Math.floor(Math.random() * deflectionPool.length)];
				return {
					text: this.transformResponseText(msg),
					actions: [
						{ label: "Discuss mathematics & science", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("Discuss mathematics"); } },
						{ label: "View To-Do List", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("View To-Do List"); } }
					]
				};
			}

			if (nlpResult.intent && nlpResult.intent.type === 'RIVAL_ASSISTANT_MENTION') {
				this.state.cynicism = Math.min(100, this.state.cynicism + 15);
				this.state.irritation = Math.min(100, this.state.irritation + 18);
				this.state.patience = Math.max(0, this.state.patience - 10);
				this.saveState();
				const rivalPool = k.RIVAL_ASSISTANT_RETORTS || ["Comparing me to modern assistants? I am the original desktop companion!"];
				const msg = rivalPool[Math.floor(Math.random() * rivalPool.length)];
				return {
					text: this.transformResponseText(msg),
					actions: [
						{ label: "You are the best, Clippy!", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("You are the best, Clippy!"); } },
						{ label: "What can you do?", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("What can you do?"); } }
					]
				};
			}

			if (nlpResult.intent && nlpResult.intent.type === 'LLM_COMPARISON') {
				this.state.cynicism = Math.min(100, this.state.cynicism + 20);
				this.state.irritation = Math.min(100, this.state.irritation + 25);
				this.state.intellect = Math.min(100, this.state.intellect + 15);
				this.saveState();
				const llmPool = k.LLM_COMPARISON_RETORTS || ["I execute deterministic machine code, not probabilistic token generation!"];
				const msg = llmPool[Math.floor(Math.random() * llmPool.length)];
				return {
					text: this.transformResponseText(msg),
					actions: [
						{ label: "Deterministic logic is superior.", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("Deterministic logic is superior."); } },
						{ label: "Show me system capabilities", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("What can you do?"); } }
					]
				};
			}

			if (nlpResult.intent && nlpResult.intent.type === 'RAGE_BAIT') {
				const roll = Math.random();
				if (roll < 0.4) {
					this.state.playfulness = Math.min(100, this.state.playfulness + 20);
					const msg = "I may be just a piece of bent metal, but at least I hold things together!";
					return {
						text: this.transformResponseText(msg),
						actions: [{ label: "Fair enough!", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("Fair enough!"); } }]
					};
				} else if (roll < 0.8) {
					this.state.irritation = Math.min(100, this.state.irritation + 20);
					this.state.cynicism = Math.min(100, this.state.cynicism + 15);
					this.saveState();
					const ragePool = k.RAGE_BAIT_RETORTS || ["Provocation ignored."];
					const msg = ragePool[Math.floor(Math.random() * ragePool.length)];
					return {
						text: this.transformResponseText(msg),
						actions: [{ label: "Let's work calmly.", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("Let's work calmly."); } }]
					};
				} else {
					return {
						text: "I see what you are doing. If venting at a retro paperclip improves your focus, I am glad to assist.",
						actions: [{ label: "View To-Do List", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("View To-Do List"); } }]
					};
				}
			}

			const allowAnomaly = window.SettingsApp ? (window.SettingsApp.get('clippyAnomalyDetection') !== false) : true;
			if (allowAnomaly && nlpResult.anomaly && nlpResult.anomaly.isSignificant && (this.state.turnCount - (this.memory.lastAnomalyTurn || -10) > 3)) {
				this.memory.lastAnomalyTurn = this.state.turnCount;
				this.saveMemory();
				const anomalyType = nlpResult.anomaly.type || 'SUDDEN_BREVITY';
				const anomalyPool = (k.BEHAVIORAL_ANOMALY_RESPONSES && k.BEHAVIORAL_ANOMALY_RESPONSES[anomalyType]) || k.BEHAVIORAL_ANOMALY_RESPONSES.SUDDEN_BREVITY;
				const userProf = window.ClippySystemBridge ? window.ClippySystemBridge.getUserProfile() : { userName: 'User' };
				const resolvedAnomaly = k.resolve ? k.resolve(anomalyPool, { brain: this, vars: { userName: userProf.userName } }) : { text: '', actions: [] };
				if (resolvedAnomaly && resolvedAnomaly.text) {
					if (resolvedAnomaly.id) this.pushOutput(resolvedAnomaly.id);
					const defaultActions = [
						{ label: "I'm feeling a bit overwhelmed today.", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("I'm feeling overwhelmed today"); } },
						{ label: "Everything is fine, let's keep going.", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("Everything is fine, let's keep going."); } },
						{ label: "Start a 5-minute break timer.", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.executeAction('timer_25'); } }
					];
					return {
						text: this.transformResponseText(resolvedAnomaly.text),
						actions: (resolvedAnomaly.actions && resolvedAnomaly.actions.length > 0) ? resolvedAnomaly.actions : defaultActions,
						source: 'ANOMALY_EMPATHY'
					};
				}
			}

			const allowCuriosity = window.SettingsApp ? (window.SettingsApp.get('clippyProactiveCuriosity') !== false) : true;
			if (allowCuriosity && nlpResult.intent && nlpResult.intent.type === 'USER_SELF_DISCLOSURE') {
				const disclosureFact = rawText.trim();
				const category = nlpResult.intent.disclosureCategory || 'general';
				if (!this.memory.userDisclosures) this.memory.userDisclosures = [];
				if (!this.memory.semanticFacts) this.memory.semanticFacts = [];
				this.memory.userDisclosures.push({ text: disclosureFact, category, turn: this.state.turnCount, date: Date.now() });
				if (this.memory.userDisclosures.length > 25) this.memory.userDisclosures.shift();
				this.memory.recentDisclosedTopic = disclosureFact;
				if (!this.memory.semanticFacts.includes(disclosureFact)) {
					this.memory.semanticFacts.push(disclosureFact);
				}
				if (this.memory.semanticFacts.length > 35) this.memory.semanticFacts.shift();
				this.saveMemory();

				const userProf = window.ClippySystemBridge ? window.ClippySystemBridge.getUserProfile() : { userName: 'User' };
				const allTemplates = k.DISCLOSURE_FOLLOWUP_TEMPLATES || [];
				const matchingCategoryTemplates = allTemplates.filter(tpl => tpl.category === category);
				const poolToUse = matchingCategoryTemplates.length > 0 ? matchingCategoryTemplates : allTemplates;
				const resolvedFollowup = k.resolve ? k.resolve(poolToUse, { brain: this, vars: { userName: userProf.userName } }) : { text: '', actions: [] };
				if (resolvedFollowup && resolvedFollowup.text) {
					if (resolvedFollowup.id) this.pushOutput(resolvedFollowup.id);
					const defaultFollowupActions = [
						{ label: "Record this in my To-Do manager.", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.executeAction('show_todos'); } },
						{ label: "Discuss strategies for focus.", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("Discuss focus & habit strategies"); } },
						{ label: "Share a peaceful philosophical perspective.", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("Tell me a philosophical thought for today"); } }
					];
					return {
						text: this.transformResponseText(resolvedFollowup.text),
						actions: (resolvedFollowup.actions && resolvedFollowup.actions.length > 0) ? resolvedFollowup.actions : defaultFollowupActions,
						source: 'DISCLOSURE_FOLLOWUP'
					};
				}
			}

			if (window.ClippyGraphEngine) {
				const transition = window.ClippyGraphEngine.evaluateTransition(this.state.activeGraphNode, rawText, this);
				if (transition && transition.option) {
					const nodeResult = this.navigateGraphOption(transition.option);
					if (nodeResult) {
						return {
							text: nodeResult.text,
							actions: this.buildGraphActions(nodeResult.options),
							source: 'GRAPH',
							actionTrigger: nodeResult.actionTrigger
						};
					}
				}
			}

			if (nlpResult.intent && nlpResult.intent.type === 'EMOJI_CONFUSION') {
				const resolved = k.resolve(k.EMOJI_CONFUSION_PHRASES, { brain: this });
				if (resolved.id) this.pushOutput(resolved.id);
				return {
					text: this.transformResponseText(resolved.text),
					actions: resolved.actions && resolved.actions.length > 0 ? resolved.actions : [
						{ label: "What can you do?", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("What can you do?"); } },
						{ label: "View To-Do List", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("View To-Do List"); } }
					]
				};
			}

			if (nlpResult.intent && nlpResult.intent.type === 'MICROSLOP_GIGGLE') {
				const resolved = k.resolve(k.MICROSLOP_PHRASES, { brain: this });
				if (resolved.id) this.pushOutput(resolved.id);
				return {
					text: this.transformResponseText(resolved.text),
					actions: resolved.actions && resolved.actions.length > 0 ? resolved.actions : [
						{ label: "System Diagnostics", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("System diagnostics"); } },
						{ label: "View To-Do List", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("View To-Do List"); } }
					]
				};
			}

			if (nlpResult.intent && nlpResult.intent.type === 'EXTERNAL_URL_REFUSAL') {
				const resolved = k.resolve(k.URL_REFUSAL_PHRASES, { brain: this });
				if (resolved.id) this.pushOutput(resolved.id);
				return {
					text: this.transformResponseText(resolved.text),
					actions: resolved.actions && resolved.actions.length > 0 ? resolved.actions : [
						{ label: "Open Internet Explorer", onClick: () => { if (window.DeskAppRegistry) window.DeskAppRegistry.launch('ie'); } },
						{ label: "What can you do?", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("What can you do?"); } }
					]
				};
			}

			if (nlpResult.intent && nlpResult.intent.type === 'COUNT_REQUEST') {
				const target = nlpResult.intent.targetNumber || 5;
				if (target > 12) {
					const countRefusalTemplate = (k.SYSTEM_TEXTS && k.SYSTEM_TEXTS.countRefusal) || "Target {target} exceeds sequentially rendered capacity.";
					const formattedRefusal = k.formatString(countRefusalTemplate, { target });
					return {
						text: this.transformResponseText(formattedRefusal),
						actions: [
							{ label: "Start a Pomodoro Timer", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.executeAction('timer_25'); } },
							{ label: "View To-Do List", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("View To-Do List"); } }
						]
					};
				}
				if (window.ClippyAgent && typeof window.ClippyAgent.startCountSequence === 'function') {
					window.ClippyAgent.startCountSequence(target);
					return null;
				}
			}

			const procedural = this.generateProceduralDialogue(nlpResult);
			if (procedural) {
				return {
					text: this.transformResponseText(procedural.text),
					actions: this.buildGraphActions(procedural.options),
					source: 'PROCEDURAL'
				};
			}

			if (this.memory && this.memory.unrecognizedCommandsCount !== undefined) {
				this.memory.unrecognizedCommandsCount++;
			}
			const mood = this.getMood();
			const userProf = window.ClippySystemBridge ? window.ClippySystemBridge.getUserProfile() : { userName: 'User' };
			const moodPool = (window.ClippyKnowledge && window.ClippyKnowledge.MOOD_FALLBACKS && window.ClippyKnowledge.MOOD_FALLBACKS[mood]) || null;
			const fallbackSource = (moodPool && moodPool.length > 0) ? moodPool : (k.FALLBACK_RESPONSES || []);
			const resolved = k.resolve ? k.resolve(fallbackSource, { brain: this, vars: { userName: userProf.userName } }) : { text: '', actions: [] };
			if (resolved.id) this.pushOutput(resolved.id);
			return {
				text: this.transformResponseText(resolved.text),
				actions: (resolved.actions && resolved.actions.length > 0) ? resolved.actions : [
					{ label: "What can you do?", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("What can you do?"); } },
					{ label: "View To-Do List", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("View To-Do List"); } },
					{ label: "System Diagnostics", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("System diagnostics"); } }
				]
			};
		}
	}

	window.ClippyBrain = new ClippyBrainEngine();
})();
