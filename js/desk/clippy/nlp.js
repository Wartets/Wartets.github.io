(function () {
	'use strict';

	class NaturalLanguageProcessor {
		constructor() {
			this.knowledge = window.ClippyKnowledge || {};
		}

		expandContractions(text) {
			if (!text || typeof text !== 'string') return '';
			let res = text.toLowerCase();
			const contractions = this.knowledge.CONTRACTIONS || {};
			for (const [k, v] of Object.entries(contractions)) {
				const regex = new RegExp(`\\b${k.replace("'", "['’]")}\\b`, 'gi');
				res = res.replace(regex, v);
			}
			return res;
		}

		tokenize(text) {
			const expanded = this.expandContractions(text);
			const clean = expanded.replace(/[^\w\s\+\-\*\/\^\.\,]/gi, ' ');
			return clean.split(/\s+/).filter(Boolean);
		}

		levenshteinDistance(a, b) {
			if (a.length === 0) return b.length;
			if (b.length === 0) return a.length;
			const matrix = [];
			for (let i = 0; i <= b.length; i++) matrix[i] = [i];
			for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

			for (let i = 1; i <= b.length; i++) {
				for (let j = 1; j <= a.length; j++) {
					if (b.charAt(i - 1) === a.charAt(j - 1)) {
						matrix[i][j] = matrix[i - 1][j - 1];
					} else {
						matrix[i][j] = Math.min(
							matrix[i - 1][j - 1] + 1,
							matrix[i][j - 1] + 1,
							matrix[i - 1][j] + 1
						);
					}
				}
			}
			return matrix[b.length][a.length];
		}

		correctSpelling(token) {
			if (!token || token.length < 3) return token;
			const vocab = this.knowledge.VOCABULARY || [];
			if (vocab.includes(token)) return token;

			let bestMatch = token;
			let minDistance = 2;

			for (const word of vocab) {
				const dist = this.levenshteinDistance(token, word);
				if (dist < minDistance) {
					minDistance = dist;
					bestMatch = word;
				}
			}
			return bestMatch;
		}

		stem(word) {
			if (!word || word.length < 4) return word;
			let w = word.toLowerCase();
			if (w.endsWith('ies') && w.length > 4) return w.slice(0, -3) + 'y';
			if (w.endsWith('es') && w.length > 3) return w.slice(0, -2);
			if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) return w.slice(0, -1);
			if (w.endsWith('ing') && w.length > 4) return w.slice(0, -3);
			if (w.endsWith('ed') && w.length > 3) return w.slice(0, -2);
			if (w.endsWith('ly') && w.length > 3) return w.slice(0, -2);
			return w;
		}

		analyzeSentiment(tokens) {
			const lexicon = this.knowledge.SENTIMENT_LEXICON || {};
			const negations = this.knowledge.NEGATIONS || [];
			const intensifiers = this.knowledge.INTENSIFIERS || {};
			const moderators = this.knowledge.MODERATORS || {};

			let score = 0;
			let hitCount = 0;

			for (let i = 0; i < tokens.length; i++) {
				const tok = tokens[i];
				if (lexicon[tok] !== undefined) {
					let val = lexicon[tok];
					let multiplier = 1.0;
					let isNegated = false;

					for (let j = Math.max(0, i - 3); j < i; j++) {
						const prev = tokens[j];
						if (negations.includes(prev)) {
							isNegated = !isNegated;
						}
						if (intensifiers[prev]) {
							multiplier *= intensifiers[prev];
						}
						if (moderators[prev]) {
							multiplier *= moderators[prev];
						}
					}

					if (isNegated) {
						val = -val * 0.75;
					}
					score += val * multiplier;
					hitCount++;
				}
			}

			const normalizedScore = hitCount > 0 ? score / hitCount : 0;
			return {
				score: normalizedScore,
				rawSum: score,
				hitCount: hitCount,
				isPositive: normalizedScore > 0.4,
				isNegative: normalizedScore < -0.4
			};
		}

		extractEntities(text, tokens) {
			const dicts = this.knowledge.NAMED_ENTITIES || {};
			const found = {
				os: [],
				hardware: [],
				physics: [],
				math: [],
				philosophy: []
			};

			const textLower = text.toLowerCase();
			for (const [category, list] of Object.entries(dicts)) {
				for (const item of list) {
					if (textLower.includes(item.toLowerCase())) {
						if (!found[category].includes(item)) {
							found[category].push(item);
						}
					}
				}
			}

			return found;
		}

		classifySyntax(text) {
			const trimmed = text.trim();
			if (trimmed.endsWith('?')) return 'INTERROGATIVE';
			if (trimmed.endsWith('!')) return 'EXCLAMATORY';
			if (/^(open|launch|run|close|stop|start|show|hide|clear|delete|calc|calculate|convert|set|play)\b/i.test(trimmed)) {
				return 'IMPERATIVE';
			}
			return 'DECLARATIVE';
		}

		process(rawText) {
			if (!rawText || typeof rawText !== 'string') {
				return {
					raw: '',
					cleaned: '',
					tokens: [],
					stems: [],
					sentiment: { score: 0, rawSum: 0, hitCount: 0, isPositive: false, isNegative: false },
					entities: { os: [], hardware: [], physics: [], math: [], philosophy: [] },
					syntaxType: 'DECLARATIVE'
				};
			}

			const tokens = this.tokenize(rawText);
			const correctedTokens = tokens.map(t => this.correctSpelling(t));
			const stems = correctedTokens.map(t => this.stem(t));
			const sentiment = this.analyzeSentiment(correctedTokens);
			const entities = this.extractEntities(rawText, correctedTokens);
			const syntaxType = this.classifySyntax(rawText);

			return {
				raw: rawText,
				cleaned: correctedTokens.join(' '),
				tokens: correctedTokens,
				stems,
				sentiment,
				entities,
				syntaxType
			};
		}
	}

	window.ClippyNLP = new NaturalLanguageProcessor();
})();
