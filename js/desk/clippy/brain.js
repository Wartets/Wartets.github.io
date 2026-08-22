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
				activeGraphNode: 'greeting_root',
				turnCount: 0,
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
				activeGraphNode: 'greeting_root',
				turnCount: 0,
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
				gamesPlayed: 0
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

		updateFromNLP(nlpResult) {
			this.state.turnCount++;
			this.state.lastInteractionTime = Date.now();
			this.memory.interactionsTotal++;

			const sentiment = nlpResult.sentiment;
			if (sentiment.isPositive) {
				this.state.affinity = Math.min(100, this.state.affinity + 4);
				this.state.patience = Math.min(100, this.state.patience + 5);
				this.state.cynicism = Math.max(0, this.state.cynicism - 3);
			} else if (sentiment.isNegative) {
				this.state.affinity = Math.max(0, this.state.affinity - 6);
				this.state.patience = Math.max(0, this.state.patience - 8);
				this.state.cynicism = Math.min(100, this.state.cynicism + 6);
			}

			if (nlpResult.entities.physics.length > 0 || nlpResult.entities.math.length > 0) {
				this.state.intellect = Math.min(100, this.state.intellect + 6);
			}
			if (nlpResult.entities.philosophy.length > 0) {
				this.state.existentialism = Math.min(100, this.state.existentialism + 8);
			}
			if (nlpResult.entities.os.length > 0) {
				this.state.nostalgia = Math.min(100, this.state.nostalgia + 6);
			}

			this.recalculateMood();
			this.saveState();
			this.saveMemory();
		}

		recalculateMood() {
			if (this.state.patience <= 15) {
				this.state.mood = this.state.cynicism > 50 ? 'SARCASTIC' : 'OFFENDED';
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
			this.circularOutputBuffer.push(text);
			if (this.circularOutputBuffer.length > 15) {
				this.circularOutputBuffer.shift();
			}
		}

		isRecentOutput(text) {
			return this.circularOutputBuffer.includes(text);
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

			const responseText = window.ClippyGraphEngine.getFormattedNodeText(nextNode, this);
			const nextOptions = window.ClippyGraphEngine.getOptionsForNode(nextNode, this.getMood(), this.getAffinity(), this.getPatience());

			return {
				text: responseText,
				options: nextOptions,
				actionTrigger: option.actionTrigger || null
			};
		}

		navigateGraphNode(nodeId, moodOverride = null, deltaOverride = null) {
			const targetNodeId = nodeId || 'greeting_root';
			this.state.activeGraphNode = targetNodeId;
			if (moodOverride) this.state.mood = moodOverride;
			if (deltaOverride) this.applyMoodDelta(deltaOverride);
			this.saveState();

			const node = window.ClippyGraphEngine ? window.ClippyGraphEngine.getNode(targetNodeId) : null;
			if (!node) return { text: "Standing by.", options: [] };

			const responseText = window.ClippyGraphEngine.getFormattedNodeText(node, this);
			const options = window.ClippyGraphEngine.getOptionsForNode(node, this.getMood(), this.getAffinity(), this.getPatience());

			return {
				text: responseText,
				options: options
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

		processChat(rawText) {
			const nlpResult = window.ClippyNLP ? window.ClippyNLP.process(rawText) : { tokens: [], sentiment: {} };
			this.updateFromNLP(nlpResult);

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

			return null;
		}
	}

	window.ClippyBrain = new ClippyBrainEngine();
})();
