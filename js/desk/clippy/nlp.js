(function () {
	'use strict';

	class NaturalLanguageProcessor {
		constructor() {
			this.knowledge = window.ClippyKnowledge || {};
			this.appAliases = {
				'calculator': ['calc', 'calculator', 'calculatrice', 'calc.exe'],
				'paint': ['paint', 'mspaint', 'mspaint.exe', 'drawing', 'dessin', 'pbrush'],
				'notepad': ['notepad', 'text editor', 'notes', 'editeur', 'notepad.exe'],
				'cmd': ['cmd', 'command prompt', 'terminal', 'console', 'invite de commandes', 'cmd.exe'],
				'ie': ['ie', 'internet explorer', 'browser', 'web', 'navigateur', 'iexplore'],
				'outlook': ['outlook', 'outlook express', 'mail', 'email', 'e-mail', 'courrier', 'inbox', 'boite de reception'],
				'winamp': ['winamp', 'winamp player', 'retro player'],
				'mediaplayer': ['mediaplayer', 'media player', 'windows media player', 'wmp', 'lecteur media'],
				'minesweeper': ['minesweeper', 'demineur', 'mine', 'mines', 'winmine'],
				'solitaire': ['solitaire', 'cards', 'cartes', 'klondike', 'patience'],
				'settings': ['settings', 'control panel', 'panneau de configuration', 'preferences', 'configuration', 'config'],
				'display': ['display', 'display properties', 'affichage', 'wallpapers', 'fonds d ecran', 'wallpaper', 'screensaver'],
				'mycomputer': ['mycomputer', 'my computer', 'poste de travail', 'ordinateur', 'drives'],
				'recyclebin': ['recyclebin', 'recycle bin', 'corbeille', 'trash', 'poubelle'],
				'achievements': ['achievements', 'trophies', 'milestones', 'succes', 'trophees', 'exploits'],
				'projects': ['projects', 'portfolio', 'showcase', 'mes projets', 'projets'],
				'soundrecorder': ['soundrecorder', 'sound recorder', 'enregistreur audio', 'dictaphone'],
				'charmap': ['charmap', 'character map', 'table des caracteres', 'symboles', 'symbols'],
				'encarta': ['encarta', 'encarta globe', 'globe', 'atlas', 'world map', 'mappemonde'],
				'taskmgr': ['taskmgr', 'task manager', 'gestionnaire des taches', 'processes', 'processus']
			};
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

		analyzeEmotionalState(rawText, tokens) {
			const lexicon = this.knowledge.SENTIMENT_LEXICON || {};
			const indicators = this.knowledge.EMOTIONAL_INDICATORS || {};
			const negations = this.knowledge.NEGATIONS || [];
			const intensifiers = this.knowledge.INTENSIFIERS || {};
			const moderators = this.knowledge.MODERATORS || {};

			let sentimentScore = 0;
			let hitCount = 0;

			for (let i = 0; i < tokens.length; i++) {
				const tok = tokens[i];
				if (lexicon[tok] !== undefined) {
					let val = lexicon[tok];
					let multiplier = 1.0;
					let isNegated = false;

					for (let j = Math.max(0, i - 3); j < i; j++) {
						const prev = tokens[j];
						if (negations.includes(prev)) isNegated = !isNegated;
						if (intensifiers[prev]) multiplier *= intensifiers[prev];
						if (moderators[prev]) multiplier *= moderators[prev];
					}

					if (isNegated) val = -val * 0.85;
					sentimentScore += val * multiplier;
					hitCount++;
				}
			}

			const normalizedValence = hitCount > 0 ? Math.max(-1, Math.min(1, (sentimentScore / hitCount) / 3.0)) : 0;

			let counts = {
				frustration: 0, curiosity: 0, fatigue: 0, enthusiasm: 0,
				politeness: 0, hostility: 0, skepticism: 0, playfulness: 0,
				desperation: 0, awe: 0
			};

			tokens.forEach(tok => {
				for (const [key, wordList] of Object.entries(indicators)) {
					if (Array.isArray(wordList) && wordList.includes(tok)) {
						counts[key] = (counts[key] || 0) + 1;
					}
				}
			});

			const exclamationCount = (rawText.match(/!/g) || []).length;
			const questionCount = (rawText.match(/\?/g) || []).length;
			const suspensionCount = (rawText.match(/\.{3,}/g) || []).length;
			const isAllCaps = rawText.length > 4 && rawText === rawText.toUpperCase() && /[A-Z]/.test(rawText);
			const repeatedCharMatch = /(.)\1{2,}/.test(rawText);

			let arousal = 0.25;
			if (exclamationCount > 0) arousal += Math.min(0.4, exclamationCount * 0.15);
			if (isAllCaps) arousal += 0.35;
			if (repeatedCharMatch) arousal += 0.15;
			if (counts.enthusiasm > 0 || counts.frustration > 0 || counts.hostility > 0) arousal += 0.2;
			arousal = Math.max(0, Math.min(1.0, arousal));

			const frustrationLevel = Math.min(1.0, (counts.frustration * 0.3) + (isAllCaps ? 0.35 : 0) + (normalizedValence < -0.3 ? 0.25 : 0));
			const hostilityLevel = Math.min(1.0, (counts.hostility * 0.4) + (isAllCaps && normalizedValence < -0.2 ? 0.3 : 0));
			const curiosityLevel = Math.min(1.0, (counts.curiosity * 0.3) + (questionCount > 0 ? 0.25 : 0));
			const fatigueLevel = Math.min(1.0, (counts.fatigue * 0.4) + (suspensionCount > 0 && arousal < 0.4 ? 0.25 : 0));
			const politenessLevel = Math.min(1.0, counts.politeness * 0.35);
			const skepticismLevel = Math.min(1.0, (counts.skepticism * 0.35) + (questionCount > 1 ? 0.2 : 0));
			const playfulnessLevel = Math.min(1.0, (counts.playfulness * 0.35) + (exclamationCount > 0 && normalizedValence > 0 ? 0.2 : 0));
			const desperationLevel = Math.min(1.0, (counts.desperation * 0.4) + (exclamationCount > 1 && normalizedValence < 0 ? 0.3 : 0));
			const aweLevel = Math.min(1.0, (counts.awe * 0.35) + (normalizedValence > 0.4 ? 0.2 : 0));

			let dominantEmotion = 'NEUTRAL';
			let maxScore = 0.2;

			const candidates = [
				{ name: 'HOSTILE', score: hostilityLevel },
				{ name: 'FRUSTRATED', score: frustrationLevel },
				{ name: 'DESPERATE', score: desperationLevel },
				{ name: 'FATIGUED', score: fatigueLevel },
				{ name: 'SKEPTICAL', score: skepticismLevel },
				{ name: 'CURIOUS', score: curiosityLevel },
				{ name: 'PLAYFUL', score: playfulnessLevel },
				{ name: 'AWE', score: aweLevel },
				{ name: 'POSITIVE', score: normalizedValence > 0.3 ? normalizedValence : 0 },
				{ name: 'NEGATIVE', score: normalizedValence < -0.3 ? Math.abs(normalizedValence) : 0 }
			];

			candidates.forEach(c => {
				if (c.score > maxScore) {
					maxScore = c.score;
					dominantEmotion = c.name;
				}
			});

			return {
				valence: normalizedValence,
				arousal: arousal,
				frustration: frustrationLevel,
				hostility: hostilityLevel,
				curiosity: curiosityLevel,
				fatigue: fatigueLevel,
				politeness: politenessLevel,
				skepticism: skepticismLevel,
				playfulness: playfulnessLevel,
				desperation: desperationLevel,
				awe: aweLevel,
				dominant: dominantEmotion,
				isPositive: normalizedValence > 0.2,
				isNegative: normalizedValence < -0.2,
				isUrgent: isAllCaps || desperationLevel > 0.6 || frustrationLevel > 0.75,
				isSuspicious: skepticismLevel > 0.5,
				isExhausted: fatigueLevel > 0.55
			};
		}

		evaluateTextLayoutAndPunctuation(rawText, tokens) {
			const trimmed = rawText.trim();
			const charLength = trimmed.length;
			const lines = rawText.split(/\r\n|\r|\n/);
			const lineCount = lines.length;
			const multiline = lineCount > 1;

			const hasTrailingDot = /\.\s*$/.test(trimmed);
			const hasTrailingQuestion = /\?\s*$/.test(trimmed);
			const hasTrailingExclamation = /!\s*$/.test(trimmed);
			const hasTrailingEllipsis = /\.{3,}\s*$/.test(trimmed);

			const commaCount = (rawText.match(/,/g) || []).length;
			const semicolonCount = (rawText.match(/;/g) || []).length;
			const colonCount = (rawText.match(/:/g) || []).length;
			const quoteCount = (rawText.match(/["'«»]/g) || []).length;
			const parenthesisCount = (rawText.match(/[()\[\]{}]/g) || []).length;
			const periodCount = (rawText.match(/\./g) || []).length;
			const exclamationCount = (rawText.match(/!/g) || []).length;
			const questionCount = (rawText.match(/\?/g) || []).length;
			const totalPunctuation = commaCount + semicolonCount + colonCount + quoteCount + parenthesisCount + periodCount + exclamationCount + questionCount;

			const punctuationDensity = charLength > 0 ? totalPunctuation / charLength : 0;

			let uppercaseLetterCount = 0;
			let lowercaseLetterCount = 0;
			for (let i = 0; i < rawText.length; i++) {
				const c = rawText[i];
				if (c >= 'A' && c <= 'Z') uppercaseLetterCount++;
				else if (c >= 'a' && c <= 'z') lowercaseLetterCount++;
			}
			const totalLetters = uppercaseLetterCount + lowercaseLetterCount;
			const uppercaseRatio = totalLetters > 0 ? uppercaseLetterCount / totalLetters : 0;
			const isAllCaps = totalLetters > 3 && uppercaseRatio > 0.85;
			const isAllLower = totalLetters > 3 && uppercaseRatio === 0;

			const sentenceStarts = trimmed.split(/(?<=[.!?])\s+/);
			let capitalizedSentencesCount = 0;
			sentenceStarts.forEach(s => {
				const firstChar = s.trim().charAt(0);
				if (firstChar >= 'A' && firstChar <= 'Z') capitalizedSentencesCount++;
			});
			const properCapitalizationRate = sentenceStarts.length > 0 ? capitalizedSentencesCount / sentenceStarts.length : 0;

			const avgWordLength = tokens.length > 0 ? tokens.reduce((sum, t) => sum + t.length, 0) / tokens.length : 0;

			return {
				charLength,
				lineCount,
				multiline,
				hasTrailingDot,
				hasTrailingQuestion,
				hasTrailingExclamation,
				hasTrailingEllipsis,
				commaCount,
				semicolonCount,
				colonCount,
				totalPunctuation,
				punctuationDensity,
				uppercaseRatio,
				isAllCaps,
				isAllLower,
				properCapitalizationRate,
				avgWordLength
			};
		}

		evaluateStatementComplexity(tokens, entities, emotions, layout) {
			const wordCount = tokens.length;
			const uniqueCount = new Set(tokens).size;
			const lexicalDiversity = wordCount > 0 ? uniqueCount / wordCount : 0;
			let entityHits = 0;
			for (const cat in entities) {
				if (Array.isArray(entities[cat])) entityHits += entities[cat].length;
				else if (entities[cat]) entityHits += 1;
			}
			const complexityScore = Math.min(1.0, (wordCount * 0.03) + (lexicalDiversity * 0.3) + (entityHits * 0.15) + (layout ? layout.avgWordLength * 0.05 : 0));
			const abstractionLevel = (entities.philosophy.length * 0.35) + (entities.physics.length * 0.3) + (entities.math.length * 0.25);

			return {
				wordCount,
				lexicalDiversity,
				entityHits,
				complexityScore,
				abstractionLevel: Math.min(1.0, abstractionLevel),
				isDeepInquiry: complexityScore > 0.6 || abstractionLevel > 0.4
			};
		}

		extractEntities(text, tokens) {
			const dicts = this.knowledge.NAMED_ENTITIES || {};
			const found = {
				os: [],
				hardware: [],
				physics: [],
				math: [],
				philosophy: [],
				app: null,
				theme: null,
				action: null
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

			for (const [appId, aliases] of Object.entries(this.appAliases)) {
				for (const alias of aliases) {
					const reg = new RegExp(`\\b${alias.replace('.', '\\.')}\\b`, 'i');
					if (reg.test(textLower)) {
						found.app = appId;
						break;
					}
				}
				if (found.app) break;
			}

			const themes = ['luna-blue', 'royale', 'silver', 'olive', 'classic', 'zune', 'noir', 'matrix', 'high-contrast'];
			for (const t of themes) {
				if (textLower.includes(t)) {
					found.theme = t;
					break;
				}
			}

			return found;
		}

		classifyIntent(rawText, entities) {
			const norm = rawText.toLowerCase().trim();

			if (/^(exit|quit|cancel|stop|menu|back|annuler|quitter)\b/i.test(norm)) {
				return { type: 'CANCEL', confidence: 1.0 };
			}

			if (/^(open|launch|start|demarre|ouvre|lancer|ouvrir)\b/i.test(norm) || entities.app) {
				return { type: 'APP_LAUNCH', targetApp: entities.app, confidence: 0.9 };
			}

			if (/^(theme|set theme|changer de theme)\b/i.test(norm) || entities.theme) {
				return { type: 'THEME_CHANGE', targetTheme: entities.theme, confidence: 0.9 };
			}

			if (/\b(wallpaper|wallpapers|background|fond d ecran|arriere-plan)\b/i.test(norm)) {
				return { type: 'WALLPAPER_CONTROL', confidence: 0.85 };
			}

			if (/\b(music|song|track|audio|chanson|musique|mp3)\b/i.test(norm)) {
				return { type: 'MEDIA_CONTROL', confidence: 0.85 };
			}

			if (/\b(mail|email|e-mail|courrier|inbox|messages|message)\b/i.test(norm)) {
				return { type: 'MAIL_CONTROL', confidence: 0.85 };
			}

			if (/\b(window|windows|fenetre|fenetres|process|taches|processes)\b/i.test(norm)) {
				return { type: 'WINDOW_CONTROL', confidence: 0.85 };
			}

			if (/\b(file|files|folder|folders|fichier|fichiers|dossier|dossiers|vfs)\b/i.test(norm)) {
				return { type: 'FILE_CONTROL', confidence: 0.85 };
			}

			if (/\b(todo|task|tasks|tache|taches|liste)\b/i.test(norm)) {
				return { type: 'TODO_CONTROL', confidence: 0.9 };
			}

			if (/\b(note|memo|scratchpad|bloc-notes)\b/i.test(norm)) {
				return { type: 'NOTE_CONTROL', confidence: 0.9 };
			}

			if (/\b(timer|pomodoro|minuteur|chrono)\b/i.test(norm)) {
				return { type: 'TIMER_CONTROL', confidence: 0.9 };
			}

			if (/\b(calc|calculate|evaluate|compute|calculer)\b/i.test(norm) || /^[\d\s\+\-\*\/\(\)\.\^\%]+$/.test(norm)) {
				return { type: 'CALC_CONTROL', confidence: 0.95 };
			}

			if (/\b(convert|conversion|vers|into|en)\b/i.test(norm)) {
				return { type: 'UNIT_CONVERT', confidence: 0.9 };
			}

			if (/\b(joke|blague|humour|funny)\b/i.test(norm)) {
				return { type: 'JOKE_REQUEST', confidence: 0.95 };
			}

			if (/\b(trivia|fact|anecdote|histoire|histoire retro)\b/i.test(norm)) {
				return { type: 'TRIVIA_REQUEST', confidence: 0.9 };
			}

			if (/\b(game|play|jeu|jouer|tictactoe|morpion|memory|hangman|pendu|quiz)\b/i.test(norm)) {
				return { type: 'GAME_CONTROL', confidence: 0.9 };
			}

			if (/\b(diagnostics|diagnostic|specs|specs systeme|status|statut|specs)\b/i.test(norm)) {
				return { type: 'DIAGNOSTICS', confidence: 0.95 };
			}

			if (/\b(who am i|qui suis-je|mon profil|profile|identity|identite)\b/i.test(norm)) {
				return { type: 'USER_PROFILE', confidence: 0.95 };
			}

			return { type: 'GENERAL_CHAT', confidence: 0.5 };
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
					entities: { os: [], hardware: [], physics: [], math: [], philosophy: [], app: null, theme: null, action: null },
					intent: { type: 'GENERAL_CHAT', confidence: 0.5 },
					syntaxType: 'DECLARATIVE'
				};
			}

			const tokens = this.tokenize(rawText);
			const correctedTokens = tokens.map(t => this.correctSpelling(t));
			const stems = correctedTokens.map(t => this.stem(t));
			const layout = this.evaluateTextLayoutAndPunctuation(rawText, correctedTokens);
			const emotions = this.analyzeEmotionalState(rawText, correctedTokens);
			const entities = this.extractEntities(rawText, correctedTokens);
			const evaluation = this.evaluateStatementComplexity(correctedTokens, entities, emotions, layout);
			const intent = this.classifyIntent(rawText, entities);
			const syntaxType = this.classifySyntax(rawText);

			return {
				raw: rawText,
				cleaned: correctedTokens.join(' '),
				tokens: correctedTokens,
				stems,
				layout,
				sentiment: emotions,
				emotions: emotions,
				evaluation: evaluation,
				entities,
				intent,
				syntaxType
			};
		}
	}

	window.ClippyNLP = new NaturalLanguageProcessor();
})();
