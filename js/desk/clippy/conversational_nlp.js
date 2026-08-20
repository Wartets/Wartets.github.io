(function () {
	'use strict';

	class ClippyConversationalNLPEngine {
		constructor() {
			this.posPatterns = [
				{ type: 'DIRECT_CRITIQUE', regex: /\b(you suck|you are (bad|useless|annoying|terrible|awful|horrible|broken|clueless|slow|stupid|dumb|worthless|pathetic|irritating)|you're (bad|useless|annoying|terrible|awful|horrible|broken|clueless|slow|stupid|dumb|worthless|pathetic|irritating)|i don't like you|i do not like you|i hate you|hate you|bad bad bad|you were better before|you are so annoying|you're so annoying)\b/i },
				{ type: 'PROTEST_IGNORING', regex: /\b(you (keep|are) ignoring (me|what i (say|said))|that's not what i (asked|meant|said)|that is not what i (asked|meant|said)|you did not answer|stop ignoring me|why are you like this|why do you do this|what did you just say)\b/i },
				{ type: 'PACIFY', regex: /\b(calm down|chill out|relax|take it easy|chill|okay,? calm down|ok,? calm down)\b/i },
				{ type: 'BECAUSE_CLAUSE', regex: /^(because|cuz|bc)\b/i },
				{ type: 'DIRECT_DISAGREEMENT', regex: /\b(no that's wrong|that is wrong|i disagree|disagree with you|that's not true|that is not true|you are wrong|you're wrong)\b/i },
				{ type: 'INTEREST_ENGAGED', regex: /\b(that's actually interesting|that is actually interesting|that's interesting|that is interesting|tell me more about that|interesting point)\b/i },
				{ type: 'PRAISE_SHIFT', regex: /\b(fine,? you're actually (funny|smart|cool|good|helpful)|you are actually (funny|smart|cool|good|helpful)|actually you're not bad)\b/i },
				{ type: 'GREETING', regex: /^(hello|hi|hey|greetings|howdy|yo|good morning|good afternoon|good evening|welcome|salutations|bonjour|sup|hiya|howzit)\b/i },
				{ type: 'FAREWELL', regex: /^(bye|goodbye|cya|see you|see ya|farewell|quit|exit|leave|adieu|so long|catch you later|take care|peace out|have a good one)\b/i },
				{ type: 'APOLOGY', regex: /^(sorry|i am sorry|i'm sorry|my bad|apologies|apologize|forgive me|excuse me|pardon me|did not mean to|i apologize|my mistake)\b/i },
				{ type: 'GRATITUDE', regex: /^(thank you|thanks|thx|much appreciated|grateful|appreciate it|cheers|props|many thanks|much obliged|kudos)\b/i },
				{ type: 'AGREEMENT', regex: /^(yes|yeah|yep|yup|sure|absolutely|indeed|correct|true|exactly|definitely|right|agreed|of course|precisely|spot on|certainly)\b/i },
				{ type: 'DISAGREEMENT', regex: /^(no|nope|nah|false|incorrect|wrong|never|disagree|negative|not really|doubt it|not quite|by no means|not at all)\b/i },
				{ type: 'QUESTION_OPEN', regex: /^(what|why|how|who|where|when|which|whose|whom|tell me about|explain|describe)\b/i },
				{ type: 'QUESTION_POLAR', regex: /^(is|are|am|do|does|did|can|could|would|should|will|shall|have|has|had|may|might|must|is it|do you)\b/i },
				{ type: 'COMMAND', regex: /^(open|launch|start|run|show|display|calc|calculate|convert|set|get|close|minimize|maximize|list|clear|create|write|defrag|feed|pet|sleep|find|search|empty|restart)\b/i },
				{ type: 'SELF_DISCLOSURE', regex: /\b(i am|i feel|i think|i want|i need|i like|i love|i hate|i wish|i have|my name is|my job is|my favorite|i prefer|i believe)\b/i },
				{ type: 'USER_CHIT_CHAT', regex: /\b(how are you|how is it going|what is up|whats up|how do you do|how have you been|how are things|what is new)\b/i },
				{ type: 'CONTINUATION', regex: /^(more|continue|elaborate|go on|what else|and then|tell me more|keep going|next|what next)\b/i },
				{ type: 'CORRECTION', regex: /^(i meant|no i mean|actually|rather|typo|meant to say|correction|instead of that)\b/i },
				{ type: 'TOPIC_CHANGE', regex: /^(anyway|moving on|by the way|changing topic|another thing|let us talk about|switch topic|on another note)\b/i }
			];

			this.entityTaxonomy = {
				emotions: ['happy', 'sad', 'angry', 'confused', 'bored', 'tired', 'excited', 'anxious', 'scared', 'lonely', 'curious', 'hopeful', 'depressed', 'frustrated', 'stressed', 'relaxed'],
				tech_domains: ['windows', 'operating systems', 'hardware', 'software', 'networking', 'security', 'databases', 'algorithms', 'web', 'firmware', 'compilers', 'processors', 'memory', 'storage'],
				science_domains: ['quantum physics', 'astronomy', 'thermodynamics', 'relativity', 'mathematics', 'biology', 'chemistry', 'cosmology', 'neuroscience', 'information theory'],
				human_topics: ['philosophy', 'art', 'music', 'literature', 'history', 'ethics', 'consciousness', 'friendship', 'relationships', 'work', 'career', 'dreams', 'time', 'life', 'death', 'purpose'],
				gaming_retro: ['pinball', 'minesweeper', 'solitaire', 'retro gaming', 'dos games', 'arcade', 'floppy games', 'crt monitors', 'dial up']
			};

			this.anaphoraPointers = {
				pronouns: ['it', 'this', 'that', 'they', 'them', 'these', 'those', 'he', 'she', 'its'],
				continuations: ['tell me more', 'why is that', 'how so', 'what else', 'go on', 'elaborate', 'and then', 'what about it', 'what does that mean']
			};
		}

		normalize(text) {
			if (!text) return '';
			return text.toLowerCase().trim().replace(/['’]/g, "'");
		}

		extractTokens(text) {
			const norm = this.normalize(text);
			return norm.split(/[^a-z0-9_\-\+\*\/\^]+/).filter(Boolean);
		}

		detectSpeechActs(rawText) {
			const norm = this.normalize(rawText);
			const acts = [];
			for (const pat of this.posPatterns) {
				if (pat.regex.test(norm)) {
					acts.push(pat.type);
				}
			}
			if (norm.endsWith('?')) acts.push('QUESTION');
			if (norm.endsWith('!')) acts.push('EXCLAMATION');
			return [...new Set(acts)];
		}

		extractEntitiesAdvanced(rawText) {
			const tokens = this.extractTokens(rawText);
			const norm = this.normalize(rawText);
			const extracted = {
				emotions: [],
				techDomains: [],
				scienceDomains: [],
				humanTopics: [],
				numbers: [],
				quotedStrings: [],
				userSelfInfo: {}
			};

			const quotes = rawText.match(/"([^"]+)"|'([^']+)'/g);
			if (quotes) {
				extracted.quotedStrings = quotes.map(q => q.replace(/["']/g, '').trim());
			}

			const numMatches = rawText.match(/[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g);
			if (numMatches) {
				extracted.numbers = numMatches.map(Number).filter(n => !isNaN(n));
			}

			for (const emo of this.entityTaxonomy.emotions) {
				if (norm.includes(emo)) extracted.emotions.push(emo);
			}

			for (const td of this.entityTaxonomy.tech_domains) {
				if (norm.includes(td)) extracted.techDomains.push(td);
			}

			for (const sd of this.entityTaxonomy.science_domains) {
				if (norm.includes(sd)) extracted.scienceDomains.push(sd);
			}

			for (const ht of this.entityTaxonomy.human_topics) {
				if (norm.includes(ht)) extracted.humanTopics.push(ht);
			}

			const nameMatch = rawText.match(/(?:my name is|call me|i am called|i'm called)\s+([A-Za-z0-9_-]+)/i);
			if (nameMatch && nameMatch[1]) extracted.userSelfInfo.name = nameMatch[1];

			const jobMatch = rawText.match(/(?:i work as|i am a|i am an|my job is|my profession is)\s+([A-Za-z0-9_\s-]+)(?:\.|$|,)/i);
			if (jobMatch && jobMatch[1]) extracted.userSelfInfo.profession = jobMatch[1].trim();

			const likeMatch = rawText.match(/(?:i like|i love|i enjoy|my favorite thing is)\s+([A-Za-z0-9_\s-]+)(?:\.|$|,)/i);
			if (likeMatch && likeMatch[1]) extracted.userSelfInfo.likes = likeMatch[1].trim();

			const hateMatch = rawText.match(/(?:i hate|i dislike|i cannot stand)\s+([A-Za-z0-9_\s-]+)(?:\.|$|,)/i);
			if (hateMatch && hateMatch[1]) extracted.userSelfInfo.dislikes = hateMatch[1].trim();

			return extracted;
		}

		resolveAnaphora(rawText, lastContext) {
			const norm = this.normalize(rawText);
			const tokens = norm.split(/\s+/);
			const isContinuation = this.anaphoraPointers.continuations.some(c => norm.startsWith(c) || norm === c);
			const hasPronoun = this.anaphoraPointers.pronouns.some(p => tokens.includes(p));
			const isShortInquiry = /^(why|how|what|really|how so|why so|why not|is it|are they|and then|what about that|what about it)\??$/i.test(norm);
			const isBackReference = /\b(the previous one|what you said|as you said|like you said|that topic|earlier|the other thing|not that|the other one)\b/i.test(norm);
			const isBecause = /^(because|cuz|bc)\b/i.test(norm);
			const isShortReaction = /^(that is better|that's better|that is stupid|that's stupid|i know|exactly|nope|yes|no)\b/i.test(norm);

			if (lastContext) {
				if (isBecause && (lastContext.lastUserCritique || lastContext.lastAssistantReply || lastContext.currentTopic)) {
					return {
						resolved: true,
						topic: lastContext.currentTopic || 'EXPLANATION_FOLLOWUP',
						subject: lastContext.lastUserCritique || lastContext.lastAssistantReply,
						pendingQuestion: lastContext.pendingQuestion,
						mode: 'BECAUSE_EXPLANATION'
					};
				}
				if (isShortInquiry && (lastContext.lastAssistantReply || lastContext.currentTopic)) {
					return {
						resolved: true,
						topic: lastContext.currentTopic || 'CONTEXTUAL_INQUIRY',
						subject: lastContext.lastAssistantReply,
						pendingQuestion: lastContext.pendingQuestion,
						mode: 'INQUIRY'
					};
				}
				if (isBackReference || isContinuation || hasPronoun || isShortReaction) {
					return {
						resolved: true,
						topic: lastContext.currentTopic || 'CONVERSATION_THREAD',
						subject: lastContext.lastAssistantReply || lastContext.currentTopic,
						pendingQuestion: lastContext.pendingQuestion,
						mode: isContinuation ? 'CONTINUATION' : (isShortReaction ? 'REACTION' : 'REFERENCE')
					};
				}
			}
			return { resolved: false, topic: null, subject: null, pendingQuestion: null, mode: null };
		}
	}

	window.ClippyConversationalNLP = new ClippyConversationalNLPEngine();
})();
