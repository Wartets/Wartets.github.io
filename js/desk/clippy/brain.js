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

			this.recalculateMood();
			this.saveState();
			this.saveMemory();
		}

		recalculateMood() {
			if (this.state.irritation >= 80 || this.state.consecutiveHostility >= 3) {
				this.state.mood = 'ENRAGED';
				return;
			}
			if (this.state.patience <= 15) {
				this.state.mood = this.state.cynicism > 50 ? 'SARCASTIC' : 'OFFENDED';
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
			if (this.state.cynicism >= 70) {
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
			if (this.state.intellect >= 70) {
				this.state.mood = 'ANALYTICAL';
				return;
			}
			if (this.state.affinity >= 80 && this.state.patience >= 70) {
				this.state.mood = 'EUPHORIC';
				return;
			}
			if (this.state.affinity <= 25) {
				this.state.mood = 'MELANCHOLIC';
				return;
			}
			if (this.state.patience >= 80 && this.state.cynicism <= 20) {
				this.state.mood = 'ZEN';
				return;
			}
			this.state.mood = 'OPTIMISTIC';
		}

		applyMoodDelta(delta) {
			if (!delta) return;
			if (delta.affinity !== undefined) this.state.affinity = Math.max(0, Math.min(100, this.state.affinity + delta.affinity));
			if (delta.patience !== undefined) this.state.patience = Math.max(0, Math.min(100, this.state.patience + delta.patience));
			if (delta.cynicism !== undefined) this.state.cynicism = Math.max(0, Math.min(100, this.state.cynicism + delta.cynicism));
			if (delta.intellect !== undefined) this.state.intellect = Math.max(0, Math.min(100, this.state.intellect + delta.intellect));
			if (delta.existentialism !== undefined) this.state.existentialism = Math.max(0, Math.min(100, this.state.existentialism + delta.existentialism));
			if (delta.nostalgia !== undefined) this.state.nostalgia = Math.max(0, Math.min(100, this.state.nostalgia + delta.nostalgia));
			if (delta.paranoia !== undefined) this.state.paranoia = Math.max(0, Math.min(100, this.state.paranoia + delta.paranoia));
			if (delta.drama !== undefined) this.state.drama = Math.max(0, Math.min(100, this.state.drama + delta.drama));
			if (delta.energy !== undefined) this.state.energy = Math.max(0, Math.min(100, this.state.energy + delta.energy));
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
				return text;
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
			const nlpResult = window.ClippyNLP ? window.ClippyNLP.process(rawText) : { tokens: [], sentiment: {} };
			this.updateFromNLP(nlpResult, isSuggestion);
			const k = window.ClippyKnowledge || {};

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
			const moodPool = (window.ClippyKnowledge && window.ClippyKnowledge.MOOD_FALLBACKS && window.ClippyKnowledge.MOOD_FALLBACKS[mood]) || null;
			const fallbackSource = (moodPool && moodPool.length > 0) ? moodPool : (k.FALLBACK_RESPONSES || []);
			const resolved = k.resolve ? k.resolve(fallbackSource, { brain: this }) : { text: '', actions: [] };
			if (resolved.id) this.pushOutput(resolved.id);
			return {
				text: this.transformResponseText(resolved.text),
				actions: resolved.actions && resolved.actions.length > 0 ? resolved.actions : [
					{ label: "What can you do?", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("What can you do?"); } },
					{ label: "View To-Do List", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("View To-Do List"); } },
					{ label: "System Diagnostics", onClick: () => { if (window.ClippyAgent) window.ClippyAgent.prompt("System diagnostics"); } }
				]
			};
		}
	}

	window.ClippyBrain = new ClippyBrainEngine();
})();
