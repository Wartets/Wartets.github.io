(function () {
	'use strict';

	class ClippyGraphEngine {
		constructor() {
			this.nodes = (window.ClippyKnowledge && window.ClippyKnowledge.DIALOGUE_NODES)
				? window.ClippyKnowledge.DIALOGUE_NODES
				: {};
		}

		getNode(nodeId) {
			const dict = (window.ClippyKnowledge && window.ClippyKnowledge.DIALOGUE_NODES) || this.nodes;
			if (dict && dict[nodeId]) return dict[nodeId];
			return dict ? dict.greeting_root : null;
		}

		getFormattedNodeText(node, brain) {
			if (!node) return "Standing by for user instructions.";
			const currentMood = brain ? brain.getMood() : 'OPTIMISTIC';
			const affinity = brain ? brain.getAffinity() : 50;
			const patience = brain ? brain.getPatience() : 50;

			let pool = [];
			if (node.responses && Array.isArray(node.responses) && node.responses.length > 0) {
				pool = node.responses.slice();
			}

			if (pool.length === 0) {
				return typeof node.text === 'string' ? node.text : "Standing by for user instructions.";
			}

			const eligible = pool.filter(c => {
				if (!c || !c.conditions) return true;
				if (c.conditions.minAffinity !== undefined && affinity < c.conditions.minAffinity) return false;
				if (c.conditions.maxAffinity !== undefined && affinity > c.conditions.maxAffinity) return false;
				if (c.conditions.minPatience !== undefined && patience < c.conditions.minPatience) return false;
				if (c.conditions.maxPatience !== undefined && patience > c.conditions.maxPatience) return false;
				return true;
			});

			const workingPool = eligible.length > 0 ? eligible : pool;
			const moodMatched = workingPool.filter(c => c && c.conditions && Array.isArray(c.conditions.moods) && c.conditions.moods.includes(currentMood));
			const finalPool = moodMatched.length > 0 ? moodMatched : workingPool;

			const totalWeight = finalPool.reduce((sum, c) => sum + Math.max(1, (c && c.weight) || 10), 0);
			let roll = Math.random() * totalWeight;
			let selected = finalPool[0];

			for (const cand of finalPool) {
				const w = Math.max(1, (cand && cand.weight) || 10);
				if (roll < w) {
					selected = cand;
					break;
				}
				roll -= w;
			}

			if (selected && selected.moodDelta && brain) {
				brain.applyMoodDelta(selected.moodDelta);
			}

			return (selected && selected.text) || node.text || "Standing by.";
		}

		getOptionsForNode(node, currentMood, affinity, patience = 50) {
			const rootNode = this.getNode('greeting_root');
			let workingNode = node || rootNode;
			if (!workingNode || !Array.isArray(workingNode.options) || workingNode.options.length === 0) {
				workingNode = rootNode;
			}
			const universal = (window.ClippyKnowledge && window.ClippyKnowledge.UNIVERSAL_CONTINUATIONS) || [];
			if (!workingNode || !Array.isArray(workingNode.options) || workingNode.options.length === 0) {
				return universal.slice();
			}

			const eligible = workingNode.options.filter(opt => {
				if (opt && opt.conditions) {
					if (opt.conditions.minAffinity !== undefined && affinity < opt.conditions.minAffinity) return false;
					if (opt.conditions.maxAffinity !== undefined && affinity > opt.conditions.maxAffinity) return false;
					if (opt.conditions.minPatience !== undefined && patience < opt.conditions.minPatience) return false;
					if (opt.conditions.maxPatience !== undefined && patience > opt.conditions.maxPatience) return false;
					if (opt.conditions.moods && !opt.conditions.moods.includes(currentMood)) return false;
				}
				return true;
			});

			const candidates = eligible.length > 0 ? eligible : workingNode.options.slice();
			let results = candidates.slice(0, 6);

			if (results.length < 4) {
				const existingLabels = new Set(results.map(o => o.label));
				for (const u of universal) {
					if (results.length >= 4) break;
					if (!existingLabels.has(u.label)) {
						results.push(u);
						existingLabels.add(u.label);
					}
				}
			}

			return results.map(opt => ({
				...opt,
				label: opt.label || "Continue..."
			}));
		}

		evaluateTransition(currentNodeId, rawText, brain) {
			const node = this.getNode(currentNodeId);
			const norm = (rawText || '').toLowerCase().trim();
			const options = (node && Array.isArray(node.options)) ? node.options : [];

			for (const opt of options) {
				if (opt.label && opt.label.toLowerCase().trim() === norm) {
					return { option: opt, matchType: 'EXACT_LABEL' };
				}
			}

			for (const opt of options) {
				if (opt.patterns) {
					for (const pat of opt.patterns) {
						if (pat instanceof RegExp && pat.test(norm)) {
							return { option: opt, matchType: 'PATTERN' };
						}
					}
				}
			}

			const globalMatch = this.findGlobalGraphEntry(norm);
			if (globalMatch) {
				return { option: globalMatch, matchType: 'GLOBAL_ENTRY' };
			}

			return null;
		}

		findGlobalGraphEntry(norm) {
			if (/\b(what can you do|commands|what do you do|help|aide|features|capabilities)\b/i.test(norm)) {
				return { label: "What can you do?", next: 'tools_overview_node', moodDelta: { mood: 'OPTIMISTIC', patience: 15 } };
			}
			if (/\b(who am i|who i am|my profile|my identity)\b/i.test(norm)) {
				return { label: "Who am I?", next: 'greeting_root', moodDelta: { mood: 'ANALYTICAL', intellect: 10 } };
			}
			if (/\b(how are you feeling|how do you feel|how are you|how is it going)\b/i.test(norm)) {
				return { label: "How are you feeling?", next: 'greeting_root', moodDelta: { mood: 'OPTIMISTIC', affinity: 10 } };
			}
			if (/\b(bad bad bad|you suck|useless|annoying|hate you|shut up)\b/i.test(norm)) {
				return { label: "Why do you care? You're just a paperclip.", next: 'hostile_initial_retort', moodDelta: { mood: 'CYNICAL', affinity: -15, patience: -20 } };
			}
			if (/\b(sorry|i apologize|my bad|forgive me|pardon me)\b/i.test(norm)) {
				return { label: "I'm sorry, I took my frustration out on you.", next: 'hostile_truce_offer', moodDelta: { mood: 'OPTIMISTIC', affinity: 25, patience: 30 } };
			}
			if (/\b(constant|constants|codata|planck|speed of light)\b/i.test(norm)) {
				return { label: "Tell me about fundamental physical constants (c, h, G).", next: 'physics_constants_node', moodDelta: { mood: 'ANALYTICAL', intellect: 25 } };
			}
			return null;
		}
	}

	window.ClippyGraphEngine = new ClippyGraphEngine();
})();
