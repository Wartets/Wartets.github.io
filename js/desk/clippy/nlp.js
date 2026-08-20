(function () {
	'use strict';

	class ClippyNLPEngine {
		constructor() {
			this.stopwords = new Set([
				'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
				'any', 'are', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below',
				'between', 'both', 'but', 'by', 'could', 'did', 'do', 'does', 'doing', 'down',
				'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have', 'having',
				'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i',
				'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most',
				'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only',
				'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same',
				'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs',
				'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through',
				'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when',
				'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your',
				'yours', 'yourself', 'yourselves'
			]);

			this.negations = new Set([
				'not', 'no', 'never', 'neither', 'nor', 'none', 'nobody', 'nothing',
				'nowhere', 'hardly', 'scarcely', 'barely', 'cannot', "can't", "don't",
				"doesn't", "didn't", "won't", "wouldn't", "shouldn't", "couldn't",
				"isn't", "aren't", "wasn't", "weren't", "hasn't", "haven't", "hadn't"
			]);

			this.intensifiers = {
				'very': 1.6, 'extremely': 2.0, 'super': 1.8, 'insanely': 2.2,
				'immensely': 2.0, 'hugely': 1.8, 'totally': 1.7, 'completely': 1.7,
				'utterly': 2.0, 'absolutely': 2.0, 'deeply': 1.6, 'really': 1.5,
				'quite': 1.3, 'exceptionally': 1.9, 'terribly': 1.8, 'tremendously': 2.0
			};

			this.diminishers = {
				'slightly': 0.5, 'somewhat': 0.6, 'barely': 0.3, 'hardly': 0.2,
				'little': 0.5, 'minor': 0.6, 'kind of': 0.7, 'sort of': 0.7
			};

			this.valenceLexicon = {
				'excellent': 3.0, 'outstanding': 3.0, 'brilliant': 2.8, 'superb': 2.8,
				'great': 2.2, 'awesome': 2.5, 'fantastic': 2.6, 'wonderful': 2.6,
				'good': 1.6, 'nice': 1.4, 'sweet': 1.5, 'perfect': 3.0,
				'amazing': 2.5, 'genius': 2.8, 'helpful': 2.0, 'smart': 1.9,
				'legend': 2.5, 'beautiful': 2.0, 'clean': 1.4, 'love': 2.7,
				'like': 1.2, 'appreciate': 2.0, 'thank': 1.8, 'thanks': 1.8,
				'pleasant': 1.5, 'fascinating': 2.2, 'informative': 1.8, 'friendly': 1.8,
				'cool': 1.5, 'fun': 1.7, 'entertaining': 1.8, 'best': 2.5,
				'masterpiece': 3.0, 'precious': 2.0, 'glad': 1.6, 'happy': 2.0,
				'admirable': 2.2, 'flawless': 3.0, 'splendid': 2.6, 'magnificent': 2.8,
				'noble': 2.0, 'insightful': 2.4, 'reliable': 2.1, 'efficient': 2.2,
				'exceptional': 2.7, 'terrific': 2.4, 'super': 2.0, 'delightful': 2.3,
				'terrible': -2.8, 'horrible': -3.0, 'awful': -2.8, 'abysmal': -3.0,
				'bad': -1.8, 'worst': -3.0, 'stupid': -2.5, 'dumb': -2.4,
				'idiot': -2.8, 'moron': -2.9, 'useless': -2.6, 'annoying': -2.2,
				'irritating': -2.1, 'trash': -2.7, 'garbage': -2.7, 'hate': -2.8,
				'ugly': -2.0, 'broken': -1.8, 'slow': -1.4, 'boring': -1.7,
				'clueless': -2.3, 'pathetic': -2.7, 'obsolete': -1.8, 'lame': -2.0,
				'buggy': -1.9, 'fail': -2.2, 'failure': -2.4, 'waste': -2.2,
				'pointless': -2.0, 'unhelpful': -2.2, 'clunky': -1.6, 'intrusive': -2.0,
				'disaster': -2.7, 'fiasco': -2.5, 'nuisance': -2.3, 'defective': -2.1,
				'incompetent': -2.6, 'dreadful': -2.7, 'detest': -2.8, 'loathe': -2.9,
				'worthless': -2.8, 'asinine': -2.7, 'infuriating': -2.6, 'toxic': -2.5
			};
		}

		tokenize(rawText) {
			if (!rawText) return [];
			return rawText
				.toLowerCase()
				.replace(/[^a-z0-9\s'_.-]/g, ' ')
				.split(/\s+/)
				.filter(Boolean);
		}

		stem(word) {
			if (word.length <= 3) return word;
			let w = word.toLowerCase();
			if (w.endsWith('sses')) return w.slice(0, -2);
			if (w.endsWith('ies')) return w.slice(0, -3) + 'y';
			if (w.endsWith('ss')) return w;
			if (w.endsWith('s')) return w.slice(0, -1);
			if (w.endsWith('eed')) return w.slice(0, -1);
			if ((w.endsWith('ed') || w.endsWith('ing')) && w.length > 5) {
				const base = w.endsWith('ed') ? w.slice(0, -2) : w.slice(0, -3);
				if (base.endsWith('at') || base.endsWith('bl') || base.endsWith('iz')) return base + 'e';
				return base;
			}
			if (w.endsWith('ly') && w.length > 4) return w.slice(0, -2);
			if (w.endsWith('ment') && w.length > 6) return w.slice(0, -4);
			if (w.endsWith('ness') && w.length > 6) return w.slice(0, -4);
			if (w.endsWith('tion') && w.length > 6) return w.slice(0, -3);
			return w;
		}

		analyzeSyntax(rawText) {
			const trimmed = rawText.trim();
			const lower = trimmed.toLowerCase();
			const tokens = this.tokenize(rawText);
			const stems = tokens.map(t => this.stem(t));

			const isQuestion = trimmed.endsWith('?') || /^(what|why|how|who|where|when|which|is|are|can|could|would|should|do|does|did|will|shall|am|may|might|tell me|explain|describe)\b/i.test(lower);
			const isExclamation = trimmed.endsWith('!') || /^(wow|omg|hey|whoa|yay|hurray|damn|crap|incredible|unbelievable)\b/i.test(lower);
			const isCommand = /^(open|launch|run|show|display|calc|calculate|convert|set|get|close|minimize|maximize|play|start|stop|toggle|find|search|list|clear|create|make|write|defrag|feed|pet|sleep|restart|reset|empty)\b/i.test(lower);
			const isGreeting = /^(hello|hi|hey|greetings|morning|afternoon|evening|good\s+(day|morning|afternoon|evening)|howdy|yo|salut|welcome|hiya|sup)\b/i.test(lower);
			const isFarewell = /^(bye|goodbye|cya|see\s+(ya|you)|farewell|quit|exit|leave|adieu|so\s+long|take\s+care|later)\b/i.test(lower);
			const isApology = /^(sorry|i\s+am\s+sorry|my\s+bad|apologies|apologize|forgive\s+me|excuse\s+me|pardon\s+me|did\s+not\s+mean\s+to)\b/i.test(lower);
			const isPraise = /^(good\s+job|well\s+done|nice\s+work|you\s+are\s+(great|awesome|smart|the\s+best|helpful|genius|legendary)|thanks|thank\s+you|much\s+appreciated|props)\b/i.test(lower);
			const isAgreement = /^(yes|yeah|yep|yup|sure|definitely|absolutely|indeed|correct|true|agreed|of\s+course|spot\s+on)\b/i.test(lower);
			const isDisagreement = /^(no|nope|nah|never|negative|incorrect|false|wrong|disagree|doubtful)\b/i.test(lower);
			const isContinuation = /^(more|continue|elaborate|go\s+on|what\s+else|and\s+then|tell\s+me\s+more|keep\s+going|next)\b/i.test(lower);
			const isCorrection = /^(i\s+meant|no\s+i\s+mean|actually|rather|typo|meant\s+to\s+say|correction)\b/i.test(lower);

			const clauses = trimmed.split(/\b(?:and\s+then|and|but|however|although|or|while|yet)\b/i).map(c => c.trim()).filter(Boolean);

			let sentenceType = 'STATEMENT';
			if (isQuestion) sentenceType = 'QUESTION';
			else if (isCommand) sentenceType = 'COMMAND';
			else if (isExclamation) sentenceType = 'EXCLAMATION';
			else if (isFarewell) sentenceType = 'FAREWELL';
			else if (isAgreement) sentenceType = 'AGREEMENT';
			else if (isDisagreement) sentenceType = 'DISAGREEMENT';

			return {
				tokens,
				stems,
				isQuestion,
				isExclamation,
				isCommand,
				isGreeting,
				isFarewell,
				isApology,
				isPraise,
				isAgreement,
				isDisagreement,
				isContinuation,
				isCorrection,
				clauses,
				isCompound: clauses.length > 1,
				sentenceType,
				wordCount: tokens.length,
				charCount: rawText.length
			};
		}

		evaluateEmotionalValence(tokens) {
			let valence = 0;
			let intensity = 1.0;
			let negated = false;
			let negationCounter = 0;

			const text = tokens.join(' ');
			if (/\b(bad bad bad|you suck|you're useless|you are useless|you're annoying|you are annoying|i don't like you)\b/i.test(text)) {
				valence -= 6.0;
			}

			for (let i = 0; i < tokens.length; i++) {
				const token = tokens[i];

				if (this.negations.has(token)) {
					negated = true;
					negationCounter = 3;
					continue;
				}

				if (this.intensifiers[token]) {
					intensity = this.intensifiers[token];
					continue;
				}

				if (this.diminishers[token]) {
					intensity = this.diminishers[token];
					continue;
				}

				if (this.valenceLexicon[token] !== undefined) {
					let score = this.valenceLexicon[token] * intensity;
					if (negated) {
						score = -score * 0.85;
					}
					valence += score;
					intensity = 1.0;
				}

				if (negationCounter > 0) {
					negationCounter--;
					if (negationCounter === 0) negated = false;
				}
			}

			return Math.max(-10, Math.min(10, valence));
		}

		extractEntities(rawText, tokens) {
			const entities = {
				numbers: [],
				os: [],
				hardware: [],
				software: [],
				physics: [],
				math: [],
				philosophy: [],
				temporal: [],
				apps: []
			};

			const lower = rawText.toLowerCase();

			const numMatches = rawText.match(/[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g);
			if (numMatches) entities.numbers = numMatches.map(Number).filter(n => !isNaN(n));

			const osKeywords = ['windows xp', 'windows 95', 'windows 98', 'windows me', 'windows 2000', 'windows 3.1', 'windows nt', 'ms-dos', 'dos', 'linux', 'unix', 'macos', 'macintosh', 'os/2', 'amiga'];
			osKeywords.forEach(os => {
				if (lower.includes(os)) entities.os.push(os);
			});

			const hwKeywords = ['cpu', 'gpu', 'ram', 'motherboard', 'floppy', 'crt', 'monitor', 'hard drive', 'pentium', 'agp', 'pci', 'sound blaster', 'vga', 'modem', '56k', 'cache', 'bios', 'transistor'];
			hwKeywords.forEach(hw => {
				if (lower.includes(hw)) entities.hardware.push(hw);
			});

			const swKeywords = ['paint', 'notepad', 'minesweeper', 'outlook', 'internet explorer', 'word', 'office 97', 'office 2000', 'winamp', 'terminal', 'cmd', 'explorer', 'pinball'];
			swKeywords.forEach(sw => {
				if (lower.includes(sw)) entities.software.push(sw);
			});

			const physKeywords = ['quantum', 'relativity', 'schrodinger', 'heisenberg', 'einstein', 'spacetime', 'entropy', 'thermodynamics', 'planck', 'gravity', 'speed of light', 'black hole', 'boson', 'fermion'];
			physKeywords.forEach(pk => {
				if (lower.includes(pk)) entities.physics.push(pk);
			});

			const mathKeywords = ['calculus', 'derivative', 'integral', 'fourier', 'euler', 'riemann', 'matrix', 'tensor', 'topology', 'eigenvalue', 'algebra', 'gamma', 'factorial'];
			mathKeywords.forEach(mk => {
				if (lower.includes(mk)) entities.math.push(mk);
			});

			const philKeywords = ['meaning of life', 'consciousness', 'existential', 'free will', 'soul', 'purpose', 'simulation', 'universe', 'god', 'death', 'mortality', 'reality'];
			philKeywords.forEach(ph => {
				if (lower.includes(ph)) entities.philosophy.push(ph);
			});

			return entities;
		}

		parseIntent(rawText) {
			const syntax = this.analyzeSyntax(rawText);
			const valence = this.evaluateEmotionalValence(syntax.tokens);
			const entities = this.extractEntities(rawText, syntax.tokens);
			const lower = rawText.toLowerCase();

			let domain = 'GENERAL_CONVERSATION';
			let confidence = 0.5;

			if (syntax.isGreeting) {
				domain = 'GREETING';
				confidence = 0.95;
			} else if (syntax.isFarewell) {
				domain = 'FAREWELL';
				confidence = 0.95;
			} else if (syntax.isApology) {
				domain = 'APOLOGY';
				confidence = 0.92;
			} else if (syntax.isPraise || (valence > 2.0 && syntax.wordCount <= 6)) {
				domain = 'PRAISE';
				confidence = 0.9;
			} else if (valence < -2.0 && syntax.wordCount <= 8) {
				domain = 'HOSTILITY';
				confidence = 0.9;
			} else if (entities.physics.length > 0) {
				domain = 'PHYSICS';
				confidence = 0.85;
			} else if (entities.math.length > 0) {
				domain = 'MATHEMATICS';
				confidence = 0.85;
			} else if (entities.os.length > 0) {
				domain = 'OPERATING_SYSTEMS';
				confidence = 0.88;
			} else if (entities.hardware.length > 0) {
				domain = 'HARDWARE';
				confidence = 0.82;
			} else if (entities.philosophy.length > 0) {
				domain = 'PHILOSOPHY';
				confidence = 0.88;
			} else if (/^(tell me a joke|joke|humor|make me laugh|funny)/i.test(lower)) {
				domain = 'JOKE';
				confidence = 0.95;
			} else if (/^(trivia|did you know|random fact|science fact|history fact)/i.test(lower)) {
				domain = 'TRIVIA';
				confidence = 0.95;
			} else if (/^(help|commands|what can you do|manual|features|options|\?)$/i.test(lower)) {
				domain = 'HELP';
				confidence = 0.98;
			} else if (/^(how are you|how do you feel|what is your mood|mood status|mood metrics|emotional state)/i.test(lower)) {
				domain = 'MOOD_INQUIRY';
				confidence = 0.96;
			}

			return {
				raw: rawText,
				syntax,
				valence,
				entities,
				domain,
				confidence
			};
		}
	}

	window.ClippyNLP = new ClippyNLPEngine();
})();
