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
			const sentiment = this.analyzeSentiment(correctedTokens);
			const entities = this.extractEntities(rawText, correctedTokens);
			const intent = this.classifyIntent(rawText, entities);
			const syntaxType = this.classifySyntax(rawText);

			return {
				raw: rawText,
				cleaned: correctedTokens.join(' '),
				tokens: correctedTokens,
				stems,
				sentiment,
				entities,
				intent,
				syntaxType
			};
		}
	}

	window.ClippyNLP = new NaturalLanguageProcessor();
})();
