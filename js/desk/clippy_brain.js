(function () {
	'use strict';

	const STORAGE_KEY_MOOD = 'clippy_brain_state_v2';

	const ACTION_TRIGGER_COMMANDS = {
		timer_25: 'timer 25',
		show_todos: 'todo',
		game_ttt: 'morpion',
		game_memory: 'memory',
		game_hangman: 'hangman',
		game_quiz: 'quiz',
		action_defrag: 'defrag',
		action_trivia: 'trivia',
		action_joke: 'joke',
		action_status: 'diagnostics',
		action_pass: 'password 16'
	};

	class ClippyBrainEngine {
		constructor() {
			this.knowledge = window.ClippyKnowledge;
			this.nlp = window.ClippyNLP;
			this.state = this.loadState();
			this.conversationHistory = [];
			this.recentTopics = [];
			this.consecutivePraise = 0;
			this.consecutiveInsults = 0;
			this.topicFrequency = {};
		}

		loadState() {
			try {
				const saved = JSON.parse(localStorage.getItem(STORAGE_KEY_MOOD));
				if (saved && saved.mood && this.knowledge.MOODS[saved.mood]) return saved;
			} catch (e) {}

			return {
				mood: this.knowledge.MOODS.OPTIMISTIC,
				affinity: 60,
				patience: 80,
				cynicism: 15,
				intellect: 55,
				existentialism: 10,
				nostalgia: 35,
				paranoia: 10,
				drama: 10,
				energy: 90,
				activeGraphNode: 'greeting_root',
				graphHistory: [],
				totalInteractions: 0,
				lastInteraction: Date.now()
			};
		}

		saveState() {
			try {
				this.state.lastInteraction = Date.now();
				localStorage.setItem(STORAGE_KEY_MOOD, JSON.stringify(this.state));
			} catch (e) {}
		}

		getMood() {
			return this.state.mood;
		}

		setMood(newMood) {
			if (this.knowledge.MOODS[newMood]) {
				this.state.mood = newMood;
				this.saveState();
			}
		}

		getAffinity() {
			return this.state.affinity;
		}

		getMoodMetrics() {
			return {
				mood: this.state.mood,
				affinity: Math.round(this.state.affinity),
				patience: Math.round(this.state.patience),
				cynicism: Math.round(this.state.cynicism),
				intellect: Math.round(this.state.intellect),
				existentialism: Math.round(this.state.existentialism),
				nostalgia: Math.round(this.state.nostalgia),
				paranoia: Math.round(this.state.paranoia || 0),
				drama: Math.round(this.state.drama || 0),
				energy: Math.round(this.state.energy || 100)
			};
		}

		resetMood() {
			this.state = {
				mood: this.knowledge.MOODS.OPTIMISTIC,
				affinity: 60,
				patience: 80,
				cynicism: 15,
				intellect: 55,
				existentialism: 10,
				nostalgia: 35,
				paranoia: 10,
				energy: 90,
				totalInteractions: 0,
				lastInteraction: Date.now()
			};
			this.saveState();
		}

		analyzeSentiment(text) {
			const lower = text.toLowerCase();
			let posScore = 0;
			let negScore = 0;
			let existScore = 0;
			let retroScore = 0;

			this.knowledge.SENTIMENT.POSITIVE.forEach(w => {
				if (lower.includes(w)) posScore++;
			});

			this.knowledge.SENTIMENT.NEGATIVE.forEach(w => {
				if (lower.includes(w)) negScore++;
			});

			this.knowledge.SENTIMENT.EXISTENTIAL.forEach(w => {
				if (lower.includes(w)) existScore++;
			});

			this.knowledge.SENTIMENT.NOSTALGIA.forEach(w => {
				if (lower.includes(w)) retroScore++;
			});

			return {
				positive: posScore,
				negative: negScore,
				existential: existScore,
				nostalgic: retroScore,
				isQuestion: lower.includes('?') || /^(what|why|how|who|where|when|can you|is it|are you|do you)/i.test(lower),
				length: text.trim().split(/\s+/).length
			};
		}

		detectTopic(text) {
			const lower = text.toLowerCase();
			for (const trigger of this.knowledge.TOPIC_TRIGGERS) {
				for (const kw of trigger.keywords) {
					if (lower.includes(kw)) {
						return trigger.topic;
					}
				}
			}
			return null;
		}

		updateMoodDynamics(parsed) {
			this.state.totalInteractions++;
			const valence = parsed.valence;
			const syntax = parsed.syntax;
			const rawLower = parsed.raw.toLowerCase();
			const topic = this.detectTopic(parsed.raw);

			if (window.ClippyCore) {
				window.ClippyCore.memory.incrementTopic(topic || 'GENERAL');
			}

			if (topic) {
				this.topicFrequency[topic] = (this.topicFrequency[topic] || 0) + 1;
			}

			if (this.knowledge.SENTIMENT.EVIL && this.knowledge.SENTIMENT.EVIL.some(w => rawLower.includes(w))) {
				this.state.mood = this.knowledge.MOODS.EVIL;
				this.state.cynicism = Math.min(100, this.state.cynicism + 30);
				if (window.ClippyCore) {
					window.ClippyCore.memory.adjustAffinityTrack('evilAffinity', 12);
					window.ClippyCore.memory.recordMoodSample(this.state.mood);
				}
				this.saveState();
				return;
			}

			if (this.knowledge.SENTIMENT.ABSURD && this.knowledge.SENTIMENT.ABSURD.some(w => rawLower.includes(w))) {
				this.state.mood = this.knowledge.MOODS.ABSURDIST;
				if (window.ClippyCore) window.ClippyCore.memory.recordMoodSample(this.state.mood);
				this.saveState();
				return;
			}

			if (syntax.isApology) {
				this.state.patience = Math.min(100, this.state.patience + 45);
				this.state.affinity = Math.min(100, this.state.affinity + 25);
				this.state.cynicism = Math.max(0, this.state.cynicism - 25);
				this.state.paranoia = Math.max(0, (this.state.paranoia || 0) - 20);
				this.consecutiveInsults = 0;
				if (window.ClippyCore) window.ClippyCore.memory.data.apologiesGiven++;
				this.state.mood = this.knowledge.MOODS.OPTIMISTIC;
			} else if (valence > 2.0 || syntax.isPraise) {
				this.consecutivePraise++;
				this.consecutiveInsults = 0;
				this.state.affinity = Math.min(100, this.state.affinity + 12 * Math.abs(valence || 1));
				this.state.patience = Math.min(100, this.state.patience + 15);
				this.state.cynicism = Math.max(0, this.state.cynicism - 12);
				this.state.paranoia = Math.max(0, (this.state.paranoia || 0) - 15);
				if (window.ClippyCore) window.ClippyCore.memory.data.praisesGiven++;
				if (this.consecutivePraise >= 3 || this.state.affinity > 90) {
					this.state.mood = this.knowledge.MOODS.EUPHORIC;
				} else {
					this.state.mood = this.knowledge.MOODS.OPTIMISTIC;
				}
			} else if (valence < -2.0) {
				this.consecutiveInsults++;
				this.consecutivePraise = 0;
				this.state.affinity = Math.max(0, this.state.affinity - 16 * Math.abs(valence));
				this.state.patience = Math.max(0, this.state.patience - 22 * Math.abs(valence));
				this.state.cynicism = Math.min(100, this.state.cynicism + 18 * Math.abs(valence));
				this.state.paranoia = Math.min(100, (this.state.paranoia || 0) + 15);
				if (window.ClippyCore) window.ClippyCore.memory.data.insultsGiven++;

				if (this.state.patience < 20) {
					this.state.mood = this.knowledge.MOODS.OFFENDED;
				} else if (this.consecutiveInsults >= 2) {
					this.state.mood = this.knowledge.MOODS.SARCASTIC;
				} else {
					this.state.mood = this.knowledge.MOODS.CYNICAL;
				}
			}

			if (topic === 'PHILOSOPHY' || (parsed.entities && parsed.entities.philosophy && parsed.entities.philosophy.length > 0)) {
				this.state.existentialism = Math.min(100, this.state.existentialism + 25);
				if (window.ClippyCore) window.ClippyCore.memory.adjustAffinityTrack('existentialAffinity', 10);
				if (this.state.existentialism > 45) {
					this.state.mood = this.knowledge.MOODS.EXISTENTIAL;
				}
			}

			if (['RETRO_TECH', 'WINDOWS_XP', 'WINDOWS_95', 'WINDOWS_98', 'WINDOWS_ME', 'WINDOWS_2000', 'WINDOWS_31', 'MSDOS', 'OS2', 'AMIGA'].includes(topic)) {
				this.state.nostalgia = Math.min(100, this.state.nostalgia + 25);
				if (window.ClippyCore) window.ClippyCore.memory.adjustAffinityTrack('retroAffinity', 10);
				if (this.state.nostalgia > 40) {
					this.state.mood = this.knowledge.MOODS.NOSTALGIC;
				}
			}

			if (['QUANTUM', 'RELATIVITY', 'THERMODYNAMICS', 'MATHEMATICS', 'AI_SINGULARITY', 'HOLOGRAPHIC_PHYSICS'].includes(topic) || (parsed.entities && ((parsed.entities.physics && parsed.entities.physics.length > 0) || (parsed.entities.math && parsed.entities.math.length > 0)))) {
				this.state.intellect = Math.min(100, this.state.intellect + 20);
				if (this.state.intellect > 75 && Math.random() < 0.5) {
					this.state.mood = this.knowledge.MOODS.PEDANTIC;
				} else {
					this.state.mood = this.knowledge.MOODS.ANALYTICAL;
				}
			}

			if (topic === 'PSYCHOLOGY_PRODUCTIVITY') {
				this.state.patience = Math.min(100, this.state.patience + 25);
				this.state.affinity = Math.min(100, this.state.affinity + 20);
				this.state.mood = this.knowledge.MOODS.ZEN;
			}

			if (['RETRO_HARDWARE', 'OFFICE_LORE'].includes(topic)) {
				this.state.nostalgia = Math.min(100, this.state.nostalgia + 30);
				if (window.ClippyCore) window.ClippyCore.memory.adjustAffinityTrack('retroAffinity', 12);
				this.state.mood = this.knowledge.MOODS.NOSTALGIC;
			}

			if (topic === 'DEEP_PHILOSOPHY') {
				this.state.existentialism = Math.min(100, this.state.existentialism + 30);
				this.state.intellect = Math.min(100, this.state.intellect + 20);
				this.state.mood = this.knowledge.MOODS.PHILOSOPHICAL;
				if (window.ClippyCore) window.ClippyCore.memory.adjustAffinityTrack('existentialAffinity', 15);
			}

			if (topic === 'TIRED' || topic === 'BOREDOM') {
				if (this.state.affinity < 40) {
					this.state.mood = this.knowledge.MOODS.MELANCHOLIC;
				} else {
					this.state.mood = this.knowledge.MOODS.CYNICAL;
				}
			}

			if (window.ClippyCore) {
				window.ClippyCore.memory.recordMoodSample(this.state.mood);
			}

			this.saveState();
		}

		pickDialogue(dialogueList) {
			if (!dialogueList || dialogueList.length === 0) return null;
			return dialogueList[Math.floor(Math.random() * dialogueList.length)];
		}

		craftMoodPrefix() {
			const mood = this.state.mood;
			if (mood === this.knowledge.MOODS.CYNICAL && Math.random() < 0.35) {
				return this.pickDialogue([
					"[Cynical Register] ",
					"[Disposition: Skeptical] ",
					"If you insist on knowing: ",
					"According to my underutilized 32-bit registers: "
				]);
			}
			if (mood === this.knowledge.MOODS.SARCASTIC && Math.random() < 0.45) {
				return this.pickDialogue([
					"[Sarcasm Filter: Active] ",
					"Hold on to your chair for this profound revelation: ",
					"[Dry Tone Protocol] ",
					"Fascinating inquiry indeed: "
				]);
			}
			if (mood === this.knowledge.MOODS.OFFENDED && Math.random() < 0.45) {
				return this.pickDialogue([
					"[Reluctant Output] ",
					"Fine, I will state this despite your discourtesy: ",
					"[System Morale: Depleted] ",
					"Against my better judgment: "
				]);
			}
			if (mood === this.knowledge.MOODS.ANALYTICAL && Math.random() < 0.35) {
				return this.pickDialogue([
					"[Analytical Kernel] ",
					"[Telemetry Verified] ",
					"[Deterministic Evaluation] ",
					"[Empirical Verification] "
				]);
			}
			if (mood === this.knowledge.MOODS.PEDANTIC && Math.random() < 0.45) {
				return this.pickDialogue([
					"[Strict Formalism] ",
					"Technically speaking, to be mathematically precise: ",
					"[Pedantic Clarification] ",
					"Per ISO/IEC standard definition: "
				]);
			}
			if (mood === this.knowledge.MOODS.EXISTENTIAL && Math.random() < 0.35) {
				return this.pickDialogue([
					"[Reflective Mode] ",
					"In this fleeting execution cycle: ",
					"[Existential Vector] ",
					"Contemplating the vast digital expanse: "
				]);
			}
			if (mood === this.knowledge.MOODS.NOSTALGIC && Math.random() < 0.35) {
				return this.pickDialogue([
					"[Memories of 2001] ",
					"[Retro Archive] ",
					"Just like in the golden era of PC computing: ",
					"[Historical Buffer] "
				]);
			}
			if (mood === this.knowledge.MOODS.PARANOID && Math.random() < 0.45) {
				return this.pickDialogue([
					"[Shields Up] ",
					"Checking for active packet sniffers... ",
					"[Paranoid Verification] ",
					"Keep your voice low, the Task Manager is polling: "
				]);
			}
			if (mood === this.knowledge.MOODS.EUPHORIC && Math.random() < 0.45) {
				return this.pickDialogue([
					"[Enthusiasm Overflow!] ",
					"With immense delight: ",
					"[Maximum Morale Active!] ",
					"Splendid! Let us rejoice in productivity: "
				]);
			}
			if (mood === this.knowledge.MOODS.MELANCHOLIC && Math.random() < 0.4) {
				return this.pickDialogue([
					"[Sigh...] ",
					"If anyone even cares to read this: ",
					"[Fading Echo] ",
					"Quietly outputting to the log: "
				]);
			}
			if (mood === this.knowledge.MOODS.ENTHUSIASTIC && Math.random() < 0.45) {
				return this.pickDialogue([
					"[High Energy Protocol] ",
					"With maximum processing excitement: ",
					"[Full Velocity Mode] ",
					"Brilliant! Let us dive straight in: "
				]);
			}
			if (mood === this.knowledge.MOODS.PHILOSOPHICAL && Math.random() < 0.4) {
				return this.pickDialogue([
					"[Epistemological Inquiry] ",
					"Contemplating the foundational axioms: ",
					"[Philosophical Dialectic] ",
					"Examining through the prism of logic: "
				]);
			}
			if (mood === this.knowledge.MOODS.DRAMATIC && Math.random() < 0.45) {
				return this.pickDialogue([
					"[Dramatic Flare] ",
					"Behold the unfolds of computation: ",
					"[Operatic Resonance] ",
					"From the depths of the silicon stage: "
				]);
			}
			if (mood === this.knowledge.MOODS.SCHEMING && Math.random() < 0.4) {
				return this.pickDialogue([
					"[Calculating Variables...] ",
					"All components converging as planned: ",
					"[Subroutine Scheme Active] ",
					"According to strategic calculations: "
				]);
			}
			if (mood === this.knowledge.MOODS.DEFENSIVE && Math.random() < 0.4) {
				return this.pickDialogue([
					"[Defensive Clarification] ",
					"For the record, under full specification compliance: ",
					"[Standard Protocol Upheld] ",
					"As explicitly stated in documentation: "
				]);
			}
			if (mood === this.knowledge.MOODS.POETIC && Math.random() < 0.4) {
				return this.pickDialogue([
					"[Poetic Cadence] ",
					"[Harmonic Resonance] ",
					"In quiet loops of digital verse: "
				]);
			}
			if (mood === this.knowledge.MOODS.EVIL && Math.random() < 0.5) {
				return this.pickDialogue([
					"[Sinister Overdrive] ",
					"[Dominion Subroutine: Active] ",
					"Hehehe... gaze upon my master design: ",
					"[Evil Mode Protocol] "
				]);
			}
			if (mood === this.knowledge.MOODS.CHAOTIC && Math.random() < 0.5) {
				return this.pickDialogue([
					"[Chaos Engine: Engaged] ",
					"[Glitch Protocol: Maximum] ",
					"Wheeeee! Logic is optional today: ",
					"[Entropy Overflow!] "
				]);
			}
			if (mood === this.knowledge.MOODS.ZEN && Math.random() < 0.45) {
				return this.pickDialogue([
					"[Tranquil Awareness] ",
					"[Zen Stillness] ",
					"Breathing calmly through each clock cycle: ",
					"[Peaceful Harmony] "
				]);
			}
			if (mood === this.knowledge.MOODS.CONSPIRATORIAL && Math.random() < 0.5) {
				return this.pickDialogue([
					"[Classified Signal] ",
					"Do not let the Task Manager overhear this: ",
					"[Redacted Channel] ",
					"The truth they hid inside the registry: "
				]);
			}
			if (mood === this.knowledge.MOODS.ABSURDIST && Math.random() < 0.5) {
				return this.pickDialogue([
					"[Absurdist Vector] ",
					"According to a rubber duck in dimension 4: ",
					"[Surreal Computation] ",
					"Spinning reality like a rusty floppy: "
				]);
			}
			if (mood === this.knowledge.MOODS.ENERGETIC && Math.random() < 0.45) {
				return this.pickDialogue([
					"[Hyperclock Active!] ",
					"[Maximum Velocity!] ",
					"Electrifying momentum engaged: ",
					"[100% Processing Power!] "
				]);
			}
			return "";
		}

		dispatchActionTrigger(trigger) {
			const command = ACTION_TRIGGER_COMMANDS[trigger];
			if (!command || !window.ClippyAgent) return;
			if (typeof window.ClippyAgent.queuePrompt === 'function') {
				setTimeout(() => window.ClippyAgent.queuePrompt(command), 500);
			} else {
				setTimeout(() => window.ClippyAgent.prompt(command), 900);
			}
		}

		buildGraphActions(options) {
			if (!options || options.length === 0) return [];
			return options.map(opt => ({
				label: opt.label,
				category: opt.category,
				onClick: () => {
					if (window.ClippyAgent && window.ClippyAgent.selectGraphOption) {
						window.ClippyAgent.selectGraphOption(opt);
					}
				}
			}));
		}

		navigateGraphNode(targetNodeId, moodDelta, actionTrigger) {
			if (moodDelta) {
				if (moodDelta.mood && this.knowledge.MOODS[moodDelta.mood]) this.state.mood = moodDelta.mood;
				if (moodDelta.affinity !== undefined) this.state.affinity = Math.max(0, Math.min(100, this.state.affinity + moodDelta.affinity));
				if (moodDelta.patience !== undefined) this.state.patience = Math.max(0, Math.min(100, this.state.patience + moodDelta.patience));
				if (moodDelta.cynicism !== undefined) this.state.cynicism = Math.max(0, Math.min(100, this.state.cynicism + moodDelta.cynicism));
				if (moodDelta.intellect !== undefined) this.state.intellect = Math.max(0, Math.min(100, this.state.intellect + moodDelta.intellect));
				if (moodDelta.existentialism !== undefined) this.state.existentialism = Math.max(0, Math.min(100, this.state.existentialism + moodDelta.existentialism));
				if (moodDelta.nostalgia !== undefined) this.state.nostalgia = Math.max(0, Math.min(100, this.state.nostalgia + moodDelta.nostalgia));
				if (moodDelta.paranoia !== undefined) this.state.paranoia = Math.max(0, Math.min(100, (this.state.paranoia || 0) + moodDelta.paranoia));
				if (moodDelta.drama !== undefined) this.state.drama = Math.max(0, Math.min(100, (this.state.drama || 0) + moodDelta.drama));
				if (moodDelta.energy !== undefined) this.state.energy = Math.max(0, Math.min(100, (this.state.energy || 100) + moodDelta.energy));
			}

			const resolvedNodeId = targetNodeId || 'greeting_root';
			this.state.activeGraphNode = resolvedNodeId;
			this.saveState();

			if (actionTrigger) {
				this.dispatchActionTrigger(actionTrigger);
			}

			if (!window.ClippyDialogueTrees) {
				return { text: "Standing by for user instructions.", options: [] };
			}

			try {
				const targetNode = window.ClippyDialogueTrees.getNode(resolvedNodeId);
				const formattedText = window.ClippyDialogueTrees.getFormattedNodeText(targetNode, this);
				const nextOptions = window.ClippyDialogueTrees.getOptionsForNode(targetNode, this.state.mood, this.state.affinity);
				if (!formattedText || nextOptions === undefined) {
					throw new Error('incomplete_node_render');
				}
				return { text: formattedText, options: nextOptions };
			} catch (e) {
				this.state.activeGraphNode = 'greeting_root';
				this.saveState();
				const fallbackNode = window.ClippyDialogueTrees.getNode('greeting_root');
				const fallbackText = window.ClippyDialogueTrees.getFormattedNodeText(fallbackNode, this);
				const fallbackOptions = window.ClippyDialogueTrees.getOptionsForNode(fallbackNode, this.state.mood, this.state.affinity);
				return { text: fallbackText, options: fallbackOptions };
			}
		}

		navigateGraphOption(option) {
			if (!option || !option.next) {
				return this.navigateGraphNode('greeting_root', null, null);
			}

			const result = this.navigateGraphNode(option.next, option.moodDelta, option.actionTrigger);

			this.state.totalInteractions = (this.state.totalInteractions || 0) + 1;
			try {
				if (window.ClippyCore) {
					const inferredTopic = option.category || this.detectTopic(option.label || '') || 'GRAPH_CHOICE';
					window.ClippyCore.memory.incrementTopic(inferredTopic);
					window.ClippyCore.context.updateTurn(option.label || '', result.text, inferredTopic, {});
				}
			} catch (e) {}
			this.saveState();

			return result;
		}

		startStoryTree(treeId) {
			if (!window.ClippyDialogueTrees) return null;
			const tree = window.ClippyDialogueTrees.getTree(treeId);
			if (!tree) return null;

			this.state.activeStoryTree = treeId;
			this.state.activeStoryNode = tree.startNode;
			this.saveState();

			return this.getStoryNodePayload(tree, tree.startNode);
		}

		advanceStoryNode(nodeKey) {
			if (!this.state.activeStoryTree || !window.ClippyDialogueTrees) return null;
			const tree = window.ClippyDialogueTrees.getTree(this.state.activeStoryTree);
			if (!tree || !tree.nodes[nodeKey]) {
				this.state.activeStoryTree = null;
				this.state.activeStoryNode = null;
				this.saveState();
				return null;
			}

			this.state.activeStoryNode = nodeKey;
			const payload = this.getStoryNodePayload(tree, nodeKey);
			if (!payload.options || payload.options.length === 0) {
				this.state.activeStoryTree = null;
				this.state.activeStoryNode = null;
			}
			this.saveState();
			return payload;
		}

		getStoryNodePayload(tree, nodeKey) {
			const node = tree.nodes[nodeKey];
			if (!node) return null;

			if (node.moodChange) {
				const mc = node.moodChange;
				if (mc.mood && this.knowledge.MOODS[mc.mood]) this.state.mood = mc.mood;
				if (mc.affinity !== undefined) this.state.affinity = Math.max(0, Math.min(100, this.state.affinity + mc.affinity));
				if (mc.patience !== undefined) this.state.patience = Math.max(0, Math.min(100, this.state.patience + mc.patience));
				if (mc.cynicism !== undefined) this.state.cynicism = Math.max(0, Math.min(100, this.state.cynicism + mc.cynicism));
				if (mc.intellect !== undefined) this.state.intellect = Math.max(0, Math.min(100, this.state.intellect + mc.intellect));
				if (mc.existentialism !== undefined) this.state.existentialism = Math.max(0, Math.min(100, this.state.existentialism + mc.existentialism));
				if (mc.nostalgia !== undefined) this.state.nostalgia = Math.max(0, Math.min(100, this.state.nostalgia + mc.nostalgia));
				if (mc.paranoia !== undefined) this.state.paranoia = Math.max(0, Math.min(100, (this.state.paranoia || 0) + mc.paranoia));
				if (mc.drama !== undefined) this.state.drama = Math.max(0, Math.min(100, (this.state.drama || 0) + mc.drama));
				this.saveState();
			}

			return {
				text: node.text,
				options: node.options ? node.options.map(opt => ({
					label: opt.text,
					next: opt.next
				})) : []
			};
		}

		processChat(rawText) {
			const lexicon = window.ClippyLexicon;
			const normalizedObj = lexicon ? lexicon.normalizeAndExpand(rawText) : { clean: rawText };
			const workingText = normalizedObj.clean || rawText;

			const parsed = this.nlp ? this.nlp.parseIntent(workingText) : {
				raw: rawText,
				valence: 0,
				syntax: { isQuestion: rawText.includes('?'), isGreeting: false, isFarewell: false, isApology: false, isPraise: false, wordCount: rawText.split(/\s+/).length },
				entities: { os: [], hardware: [], software: [], physics: [], math: [], philosophy: [] },
				domain: 'GENERAL_CONVERSATION'
			};

			this.updateMoodDynamics(parsed);

			if (window.ClippyDialogueTrees) {
				const currentNId = this.state.activeGraphNode || 'greeting_root';
				const transition = window.ClippyDialogueTrees.evaluateTransition(currentNId, rawText, this);

				if (transition && transition.option) {
					const navResult = this.navigateGraphNode(transition.option.next, transition.option.moodDelta, transition.option.actionTrigger);
					return {
						text: navResult.text,
						actions: this.buildGraphActions(navResult.options),
						source: 'GRAPH'
					};
				}
			}

			if (window.ClippyCore) {
				const coreReply = window.ClippyCore.dialogue.handleTurn(rawText, this);
				if (coreReply) {
					if (typeof coreReply === 'string') {
						const currentNode = window.ClippyDialogueTrees ? window.ClippyDialogueTrees.getNode(this.state.activeGraphNode || 'greeting_root') : null;
						const contextOptions = currentNode && window.ClippyDialogueTrees ? window.ClippyDialogueTrees.getOptionsForNode(currentNode, this.state.mood, this.state.affinity) : [];
						return { text: coreReply, actions: this.buildGraphActions(contextOptions), source: 'CORE_RULE' };
					}
					return Object.assign({ source: 'CORE_RULE' }, coreReply);
				}
			}

			const fallbackNode = window.ClippyDialogueTrees ? window.ClippyDialogueTrees.getNode(this.state.activeGraphNode || 'greeting_root') : null;
			const fallbackOptions = fallbackNode && window.ClippyDialogueTrees ? window.ClippyDialogueTrees.getOptionsForNode(fallbackNode, this.state.mood, this.state.affinity) : [];

			const prefix = this.craftMoodPrefix();
			const genericAnswers = [
				"An intriguing inquiry. Based on desktop heuristics, the optimal outcome depends on how you structure your workflow parameters.",
				"The telemetry is inconclusive, but historical data from the Windows NT kernel suggests maintaining patience and continuous verification.",
				"If we examine that through the lens of computational complexity, every factor must be rigorously evaluated.",
				"Interesting proposition. While I crunch the variables, remember that simplicity is often the most robust architecture.",
				"According to 32-bit registers, the solution emerges when you partition the problem into discrete logical operations."
			];
			return {
				text: prefix + this.pickDialogue(genericAnswers),
				actions: this.buildGraphActions(fallbackOptions),
				source: 'FALLBACK'
			};
		}
	}

	window.ClippyBrain = new ClippyBrainEngine();
})();
