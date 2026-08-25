(function () {
	'use strict';

	class ClippyGraphEngine {
		constructor() {
			this.nodes = (window.ClippyKnowledge && window.ClippyKnowledge.DIALOGUE_NODES)
				? window.ClippyKnowledge.DIALOGUE_NODES
				: {};
		}

		getNode(nodeId) {
			if (window.ClippyTrees && window.ClippyTrees.human && window.ClippyTrees.human[nodeId]) {
				return window.ClippyTrees.human[nodeId];
			}
			const dict = (window.ClippyKnowledge && window.ClippyKnowledge.DIALOGUE_NODES) || this.nodes;
			if (dict && dict[nodeId]) return dict[nodeId];
			return dict ? dict.greeting_root : null;
		}

		getFormattedNodeText(node, brain) {
			if (!node) return "Standing by for user instructions.";
			if (window.ClippyKnowledge && typeof window.ClippyKnowledge.resolve === 'function') {
				const source = (node.responses && Array.isArray(node.responses) && node.responses.length > 0)
					? node.responses
					: (node.text !== undefined ? node.text : node);
				const resolved = window.ClippyKnowledge.resolve(source, brain);
				if (resolved && resolved.text) return resolved.text;
			}
			return typeof node.text === 'string' ? node.text : "Standing by for user instructions.";
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

			return results.map(opt => {
				let labelText = opt.label || "Continue...";
				if (currentMood === 'DELTARUNE' && !labelText.startsWith('*')) {
					labelText = `* ${labelText}`;
				}
				return {
					...opt,
					label: labelText
				};
			});
		}

		evaluateTransition(currentNodeId, rawText, brain) {
			const node = this.getNode(currentNodeId);
			const norm = (rawText || '').toLowerCase().replace(/^[*\s]+/, '').trim();
			const options = (node && Array.isArray(node.options)) ? node.options : [];

			for (const opt of options) {
				const optNorm = (opt.label || '').toLowerCase().replace(/^[*\s]+/, '').trim();
				if (optNorm === norm) {
					return { option: opt, matchType: 'EXACT_LABEL' };
				}
			}

			for (const opt of options) {
				if (opt.patterns && Array.isArray(opt.patterns)) {
					for (const pat of opt.patterns) {
						if (pat instanceof RegExp && pat.test(norm)) {
							return { option: opt, matchType: 'PATTERN' };
						}
					}
				}
			}

			for (const opt of options) {
				const optClean = (opt.label || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
				const optTokens = optClean.split(/\s+/).filter(w => w.length > 2);
				const normClean = norm.replace(/[^a-z0-9\s]/g, ' ').trim();
				const normTokens = normClean.split(/\s+/).filter(w => w.length > 2);

				if (optTokens.length > 0 && normTokens.length > 0) {
					const matchCount = optTokens.filter(t => normTokens.some(nt => nt.includes(t) || t.includes(nt))).length;
					const overlapRatio = matchCount / Math.min(optTokens.length, normTokens.length);
					if (overlapRatio >= 0.5 || (optTokens.length <= 2 && matchCount >= 1)) {
						return { option: opt, matchType: 'SEMANTIC_KEYWORD' };
					}
				}
			}

			for (const opt of options) {
				const optClean = (opt.label || '').toLowerCase().replace(/^[*\s]+/, '').trim();
				if (window.ClippyNLP && typeof window.ClippyNLP.levenshteinDistance === 'function') {
					const dist = window.ClippyNLP.levenshteinDistance(norm, optClean);
					const maxLen = Math.max(norm.length, optClean.length);
					if (maxLen > 4 && (dist / maxLen) <= 0.25) {
						return { option: opt, matchType: 'FUZZY_LEVENSHTEIN' };
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
			const entries = (window.ClippyKnowledge && window.ClippyKnowledge.GRAPH_GLOBAL_ENTRIES) || [];
			for (const entry of entries) {
				if (entry.pattern && entry.pattern.test(norm)) {
					return {
						label: entry.label,
						next: entry.next,
						actionTrigger: entry.actionTrigger,
						moodDelta: entry.moodDelta
					};
				}
			}
			return null;
		}
	}

	window.ClippyGraphEngine = new ClippyGraphEngine();
})();
