(function () {
	'use strict';

	const CONTRACTIONS = {
		"ain't": "is not", "aren't": "are not", "can't": "cannot", "could've": "could have",
		"couldn't": "could not", "didn't": "did not", "doesn't": "does not", "don't": "do not",
		"hadn't": "had not", "hasn't": "has not", "haven't": "have not", "he'd": "he would",
		"he'll": "he will", "he's": "he is", "how'd": "how did", "how'll": "how will",
		"how's": "how is", "i'd": "i would", "i'll": "i will", "i'm": "i am", "i've": "i have",
		"isn't": "is not", "it'd": "it would", "it'll": "it will", "it's": "it is",
		"let's": "let us", "mightn't": "might not", "mustn't": "must not", "shan't": "shall not",
		"she'd": "she would", "she'll": "she will", "she's": "she is", "should've": "should have",
		"shouldn't": "should not", "that's": "that is", "there's": "there is", "they'd": "they would",
		"they'll": "they will", "they're": "they are", "they've": "they have", "wasn't": "was not",
		"we'd": "we would", "we'll": "we will", "we're": "we are", "we've": "we have",
		"weren't": "were not", "what'll": "what will", "what're": "what are", "what's": "what is",
		"what've": "what have", "where's": "where is", "who'd": "who would", "who'll": "who will",
		"who's": "who is", "who've": "who have", "won't": "will not", "wouldn't": "would not",
		"you'd": "you would", "you'll": "you will", "you're": "you are", "you've": "you have",
		"gonna": "going to", "wanna": "want to", "gotta": "got to", "kinda": "kind of",
		"sorta": "sort of", "lemme": "let me", "gimme": "give me", "dunno": "do not know",
		"ya": "you", "u": "you", "ur": "your", "r": "are", "plz": "please", "pls": "please",
		"thx": "thanks", "ty": "thank you", "idk": "i do not know", "imo": "in my opinion",
		"imho": "in my humble opinion", "tbh": "to be honest", "btw": "by the way",
		"fyi": "for your information", "atm": "at the moment", "omg": "oh my god",
		"sup": "what is up", "cya": "see you", "brb": "be right back", "np": "no problem",
		"w/o": "without", "w/": "with", "rly": "really", "srsly": "seriously",
		"prob": "probably", "prolly": "probably", "ngl": "not going to lie",
		"hbu": "how about you", "wbu": "what about you", "idc": "i do not care",
		"wdym": "what do you mean", "hru": "how are you", "ikr": "i know right",
		"smh": "shaking my head", "fr": "for real", "afaik": "as far as i know",
		"iirc": "if i recall correctly", "tbf": "to be fair", "rn": "right now",
		"bc": "because", "b/c": "because", "cuz": "because", "coz": "because",
		"def": "definitely", "obv": "obviously", "sec": "second", "min": "minute",
		"ppl": "people", "msg": "message", "txt": "text", "pic": "picture",
		"clippy": "clippit", "clippie": "clippit", "clipy": "clippit"
	};

	const SYNONYM_CLUSTERS = {
		GREETING: ['hello', 'hi', 'hey', 'greetings', 'salutations', 'howdy', 'welcome', 'yo', 'bonjour', 'sup', 'good morning', 'good afternoon', 'good evening', 'morning', 'afternoon', 'evening', 'hiya', 'howzit', 'aloha', 'hola', 'whats up'],
		FAREWELL: ['bye', 'goodbye', 'cya', 'farewell', 'see you', 'see ya', 'catch you later', 'take care', 'leave', 'quit', 'exit', 'so long', 'adieu', 'adios', 'signing off', 'later', 'peace out', 'have a good one', 'until next time'],
		GRATITUDE: ['thank', 'thanks', 'thank you', 'grateful', 'gratitude', 'appreciate', 'appreciated', 'props', 'cheers', 'much obliged', 'bless you', 'kudos', 'many thanks', 'indebted', 'appreciation'],
		AGREEMENT: ['yes', 'yeah', 'yep', 'yup', 'sure', 'certainly', 'definitely', 'absolutely', 'indeed', 'totally', 'affirmative', 'right', 'correct', 'true', 'agreed', 'exact', 'exactly', 'of course', 'fine', 'positive', 'precisely', 'undoubtedly', 'spot on', 'for sure', 'without a doubt'],
		DISAGREEMENT: ['no', 'nope', 'nah', 'nay', 'never', 'negative', 'incorrect', 'false', 'wrong', 'disagree', 'untrue', 'doubtful', 'hardly', 'refuse', 'deny', 'not quite', 'by no means', 'not at all', 'contrary'],
		APOLOGY: ['sorry', 'apologize', 'apologies', 'pardon', 'forgive', 'my bad', 'excuse me', 'regret', 'pardon me', 'forgive me', 'i apologize', 'pardon', 'did not mean to', 'my mistake', 'mea culpa'],
		PRAISE: ['awesome', 'great', 'brilliant', 'genius', 'smart', 'intelligent', 'amazing', 'superb', 'legend', 'legendary', 'helpful', 'useful', 'competent', 'masterful', 'excellent', 'fantastic', 'wonderful', 'flawless', 'champion', 'hero', 'stellar', 'top notch', 'solid', 'splendid', 'magnificent', 'exceptional', 'admirable', 'marvelous', 'skillful', 'insightful', 'sharp', 'gifted'],
		INSULT: ['stupid', 'dumb', 'idiot', 'moron', 'useless', 'annoying', 'hate', 'trash', 'garbage', 'worst', 'ugly', 'broken', 'slow', 'pathetic', 'clueless', 'obsolete', 'irritating', 'waste', 'lame', 'buggy', 'pointless', 'clown', 'incompetent', 'toxic', 'asinine', 'dunce', 'rubbish', 'worthless', 'horrible', 'abysmal', 'nuisance', 'dreadful'],
		CONFUSION: ['confused', 'confusing', 'unclear', 'lost', 'perplexed', 'baffled', 'mystified', 'puzzled', 'ambiguous', 'vague', 'misunderstood', 'clarify', 'explain', 'what do you mean', 'do not understand', 'cannot follow', 'disoriented'],
		INQUIRY: ['what', 'why', 'how', 'who', 'where', 'when', 'which', 'explain', 'tell me', 'describe', 'elaborate', 'clarify', 'investigate', 'analyze', 'reason', 'meaning', 'inquire', 'wonder', 'curious', 'details', 'break down'],
		HUMOR: ['joke', 'funny', 'humor', 'laugh', 'giggle', 'amuse', 'entertain', 'comedy', 'hilarious', 'witty', 'pun', 'riddle', 'chuckle', 'banter', 'jest', 'gag'],
		CREATION: ['make', 'create', 'generate', 'build', 'write', 'author', 'craft', 'produce', 'compose', 'construct', 'develop', 'invent', 'design', 'originate', 'formulate'],
		EMOTION_SAD: ['sad', 'unhappy', 'depressed', 'down', 'blue', 'gloomy', 'miserable', 'heartbroken', 'sorrow', 'grief', 'melancholy', 'lonely', 'isolated', 'hurting', 'downcast', 'crestfallen', 'despondent'],
		EMOTION_HAPPY: ['happy', 'glad', 'joyful', 'cheerful', 'delighted', 'thrilled', 'ecstatic', 'euphoric', 'excited', 'radiant', 'gleeful', 'content', 'optimistic', 'blissful', 'exuberant', 'satisfied'],
		EMOTION_ANGRY: ['angry', 'mad', 'furious', 'pissed', 'annoyed', 'enraged', 'irritated', 'frustrated', 'outraged', 'hostile', 'bitter', 'agitated', 'fuming', 'livid', 'resentful'],
		EMOTION_TIRED: ['tired', 'sleepy', 'exhausted', 'drowsy', 'fatigued', 'drained', 'weary', 'burnout', 'burnt out', 'overworked', 'lethargic', 'low energy', 'sluggish', 'spent', 'beat'],
		EMOTION_BORED: ['bored', 'boring', 'uninterested', 'tedious', 'dull', 'monotonous', 'nothing to do', 'distract me', 'entertain me', 'ennui', 'mind numbing', 'tiresome'],
		PHILOSOPHY: ['meaning', 'purpose', 'existence', 'existential', 'consciousness', 'soul', 'reality', 'truth', 'free will', 'determinism', 'qualia', 'epistemology', 'ethics', 'morality', 'simulation', 'universe', 'death', 'mortality', 'nihilism', 'stoicism', 'absurdism', 'ontology', 'metaphysics', 'teleology', 'solipsism'],
		SCIENCE: ['physics', 'quantum', 'relativity', 'astronomy', 'thermodynamics', 'mechanics', 'optics', 'particle', 'gravity', 'spacetime', 'black hole', 'entropy', 'atom', 'molecule', 'electromagnetism', 'cosmos', 'cosmology', 'energy', 'momentum', 'gravitation', 'electrodynamics', 'astrophysics'],
		COMPUTING: ['programming', 'code', 'coding', 'developer', 'algorithm', 'software', 'hardware', 'compiler', 'interpreter', 'kernel', 'memory', 'cpu', 'operating system', 'network', 'database', 'interface', 'variable', 'function', 'syntax', 'debugging', 'binary', 'hexadecimal', 'pointer', 'stack', 'heap', 'thread', 'process'],
		RETRO: ['windows 95', 'windows 98', 'windows xp', 'windows 2000', 'windows me', 'ms-dos', 'dos', 'floppy', 'crt', 'dial-up', 'modem', '56k', 'sound blaster', 'office 97', 'office 2000', 'vga', 'pentium', 'voodoo', 'agp', 'bliss', 'y2k', 'win32', 'netscape', 'winamp', 'cd-rom'],
		OFFICE: ['clippy', 'clippit', 'paperclip', 'word', 'excel', 'powerpoint', 'access', 'outlook', 'spreadsheet', 'document', 'margin', 'letter', 'memo', 'template', 'wizard', 'merlin', 'rover', 'assistant', 'frontpage', 'publisher'],
		CONTINUATION: ['more', 'continue', 'elaborate', 'go on', 'what else', 'furthermore', 'tell me more', 'next', 'keep going', 'and then', 'what happened', 'expand on that', 'give me more', 'proceed'],
		CORRECTION: ['i meant', 'no i mean', 'actually', 'rather', 'typo', 'meant to say', 'correction', 'i intended', 'what i meant', 'instead of'],
		TOPIC_CHANGE: ['anyway', 'moving on', 'by the way', 'changing topic', 'another thing', 'let us talk about', 'switch topic', 'on another note', 'speaking of which', 'different question'],
		UNCERTAINTY: ['maybe', 'perhaps', 'possibly', 'not sure', 'kinda', 'sorta', 'might be', 'could be', 'i guess', 'i suppose', 'potentially', 'unconfirmed'],
		COMPARISON: ['better', 'worse', 'different', 'similar', 'like that', 'compare', 'contrast', 'versus', 'vs', 'difference between', 'same as', 'opposite of']
	};

	const LEMMA_MAP = {
		'running': 'run', 'runs': 'run', 'ran': 'run',
		'computing': 'compute', 'computes': 'compute', 'computed': 'compute',
		'calculating': 'calculate', 'calculates': 'calculate', 'calculated': 'calculate',
		'programming': 'program', 'programs': 'program', 'programmed': 'program',
		'writing': 'write', 'writes': 'write', 'wrote': 'write', 'written': 'write',
		'talking': 'talk', 'talks': 'talk', 'talked': 'talk',
		'thinking': 'think', 'thinks': 'think', 'thought': 'think',
		'knowing': 'know', 'knows': 'know', 'knew': 'know', 'known': 'know',
		'understanding': 'understand', 'understands': 'understand', 'understood': 'understand',
		'explaining': 'explain', 'explains': 'explain', 'explained': 'explain',
		'helping': 'help', 'helps': 'help', 'helped': 'help',
		'assisting': 'assist', 'assists': 'assist', 'assisted': 'assist',
		'feeling': 'feel', 'feels': 'feel', 'felt': 'feel',
		'playing': 'play', 'plays': 'play', 'played': 'play',
		'working': 'work', 'works': 'work', 'worked': 'work',
		'opening': 'open', 'opens': 'open', 'opened': 'open',
		'closing': 'close', 'closes': 'close', 'closed': 'close',
		'starting': 'start', 'starts': 'start', 'started': 'start',
		'stopping': 'stop', 'stops': 'stop', 'stopped': 'stop',
		'remembering': 'remember', 'remembers': 'remember', 'remembered': 'remember',
		'forgetting': 'forget', 'forgets': 'forget', 'forgot': 'forget', 'forgotten': 'forget',
		'asking': 'ask', 'asks': 'ask', 'asked': 'ask',
		'guessing': 'guess', 'guesses': 'guess', 'guessed': 'guess',
		'learning': 'learn', 'learns': 'learn', 'learned': 'learn',
		'changing': 'change', 'changes': 'change', 'changed': 'change',
		'creating': 'create', 'creates': 'create', 'created': 'create',
		'deleting': 'delete', 'deletes': 'delete', 'deleted': 'delete',
		'converting': 'convert', 'converts': 'convert', 'converted': 'convert',
		'formatting': 'format', 'formats': 'format', 'formatted': 'format'
	};

	class LexiconEnrichmentEngine {
		constructor() {
			this.contractions = CONTRACTIONS;
			this.synonyms = SYNONYM_CLUSTERS;
			this.lemmas = LEMMA_MAP;
			this.knownVocabulary = this.buildVocabularyIndex();
		}

		buildVocabularyIndex() {
			const vocab = new Set();
			for (const words of Object.values(this.synonyms)) {
				words.forEach(w => vocab.add(w.toLowerCase()));
			}
			for (const [k, v] of Object.entries(this.lemmas)) {
				vocab.add(k.toLowerCase());
				vocab.add(v.toLowerCase());
			}
			return vocab;
		}

		expandContractions(text) {
			if (!text) return '';
			let result = text.toLowerCase();
			for (const [contraction, expansion] of Object.entries(this.contractions)) {
				const regex = new RegExp(`\\b${contraction.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
				result = result.replace(regex, expansion);
			}
			return result;
		}

		lemmatizeWord(word) {
			const w = word.toLowerCase().trim();
			if (this.lemmas[w]) return this.lemmas[w];
			if (w.endsWith('ing') && w.length > 5) {
				const cand = w.slice(0, -3);
				if (this.lemmas[cand]) return this.lemmas[cand];
				return cand;
			}
			if (w.endsWith('ed') && w.length > 4) {
				const cand = w.slice(0, -2);
				if (this.lemmas[cand]) return this.lemmas[cand];
				return cand;
			}
			if (w.endsWith('es') && w.length > 4) {
				const cand = w.slice(0, -2);
				if (this.lemmas[cand]) return this.lemmas[cand];
				return cand;
			}
			if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) {
				const cand = w.slice(0, -1);
				if (this.lemmas[cand]) return this.lemmas[cand];
				return cand;
			}
			return w;
		}

		lemmatizeTokens(tokens) {
			return tokens.map(t => this.lemmatizeWord(t));
		}

		levenshtein(a, b) {
			if (a === b) return 0;
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
							Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
						);
					}
				}
			}
			return matrix[b.length][a.length];
		}

		fuzzyCorrectWord(word) {
			const w = word.toLowerCase();
			if (w.length <= 3 || this.knownVocabulary.has(w)) return w;
			let bestMatch = w;
			let minDistance = 2;
			for (const cand of this.knownVocabulary) {
				if (Math.abs(cand.length - w.length) > 1) continue;
				const dist = this.levenshtein(w, cand);
				if (dist < minDistance) {
					minDistance = dist;
					bestMatch = cand;
				}
			}
			return bestMatch;
		}

		findClustersForToken(token) {
			const matches = [];
			const corrected = this.fuzzyCorrectWord(token);
			const lemma = this.lemmatizeWord(corrected);
			for (const [clusterKey, words] of Object.entries(this.synonyms)) {
				if (words.includes(token) || words.includes(corrected) || words.includes(lemma)) {
					matches.push(clusterKey);
				}
			}
			return matches;
		}

		calculateSemanticOverlap(tokens, targetClusterKey) {
			const targetWords = this.synonyms[targetClusterKey];
			if (!targetWords) return 0;
			let matchCount = 0;
			for (const t of tokens) {
				const corrected = this.fuzzyCorrectWord(t);
				const lem = this.lemmatizeWord(corrected);
				if (targetWords.includes(t) || targetWords.includes(corrected) || targetWords.includes(lem)) {
					matchCount++;
				}
			}
			return matchCount / Math.max(1, tokens.length);
		}

		normalizeAndExpand(text) {
			const expanded = this.expandContractions(text);
			const clean = expanded
				.replace(/[^a-z0-9\s'_.-]/g, ' ')
				.replace(/\s+/g, ' ')
				.trim();
			const rawTokens = clean.split(' ').filter(Boolean);
			const correctedTokens = rawTokens.map(t => this.fuzzyCorrectWord(t));
			const lemmas = this.lemmatizeTokens(correctedTokens);
			return {
				original: text,
				expanded,
				clean,
				tokens: rawTokens,
				correctedTokens,
				lemmas
			};
		}
	}

	window.ClippyLexicon = new LexiconEnrichmentEngine();
})();
