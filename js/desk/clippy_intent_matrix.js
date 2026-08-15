(function () {
	'use strict';

	class IntentMatrixEngine {
		constructor() {
			this.intents = [
				{
					id: 'DIRECT_CRITIQUE',
					cluster: 'INSULT',
					patterns: [/\b(you suck|you are (bad|useless|annoying|terrible|awful|horrible|broken|clueless|slow|stupid|dumb|worthless|pathetic|irritating)|you're (bad|useless|annoying|terrible|awful|horrible|broken|clueless|slow|stupid|dumb|worthless|pathetic|irritating)|i don't like you|i do not like you|i hate you|hate you|bad bad bad|you were better before|you are so annoying|you're so annoying)\b/i],
					priority: 20,
					minScore: 0.1
				},
				{
					id: 'PROTEST_IGNORING',
					cluster: 'CONFUSION',
					patterns: [/\b(you (keep|are) ignoring (me|what i (say|said))|that's not what i (asked|meant|said)|that is not what i (asked|meant|said)|you did not answer|stop ignoring me|why are you like this|what did you just say)\b/i],
					priority: 20,
					minScore: 0.1
				},
				{
					id: 'BECAUSE_EXPLANATION',
					cluster: null,
					patterns: [/^(because|cuz|bc)\b/i, /\b(because you|cuz you|bc you)\b/i],
					priority: 19,
					minScore: 0.15
				},
				{
					id: 'PACIFY_CLIPPY',
					cluster: null,
					patterns: [/\b(calm down|chill out|relax|take it easy|chill|okay,? calm down|ok,? calm down)\b/i],
					priority: 18,
					minScore: 0.15
				},
				{
					id: 'DIRECT_DISAGREEMENT',
					cluster: 'DISAGREEMENT',
					patterns: [/\b(no that's wrong|that is wrong|i disagree( with you)?|that's not true|that is not true|you are wrong|you're wrong)\b/i],
					priority: 18,
					minScore: 0.15
				},
				{
					id: 'ENGAGED_INTEREST',
					cluster: null,
					patterns: [/\b(that's actually interesting|that is actually interesting|that's interesting|that is interesting|tell me more about that|interesting point)\b/i],
					priority: 17,
					minScore: 0.15
				},
				{
					id: 'PRAISE_SHIFT',
					cluster: 'PRAISE',
					patterns: [/\b(fine,? you're actually (funny|smart|cool|good|helpful)|you are actually (funny|smart|cool|good|helpful)|actually you're not bad)\b/i],
					priority: 17,
					minScore: 0.15
				},
				{
					id: 'SKEPTICAL_INQUIRY',
					cluster: null,
					patterns: [/^(really|seriously|why|why not|how so|why is that|how come)\??$/i],
					priority: 16,
					minScore: 0.2
				},
				{
					id: 'APOLOGY',
					cluster: 'APOLOGY',
					patterns: [/^(sorry|i am sorry|i'm sorry|my bad|apologies|forgive me|excuse me|pardon me|i apologize|my mistake)\b/i],
					priority: 15,
					minScore: 0.2
				},
				{
					id: 'CORRECTION',
					cluster: 'CORRECTION',
					patterns: [/^(i meant|no i mean|actually|rather|typo|meant to say|correction|instead of that|no,? i meant the other thing)\b/i],
					priority: 15,
					minScore: 0.2
				},
				{
					id: 'GRATITUDE',
					cluster: 'GRATITUDE',
					patterns: [/^(thank you|thanks|thx|much appreciated|grateful|appreciate it|many thanks|much obliged|kudos)\b/i],
					priority: 12,
					minScore: 0.2
				},
				{
					id: 'PRAISE',
					cluster: 'PRAISE',
					patterns: [/\b(you are (awesome|great|smart|the best|brilliant|helpful|genius|legendary|stellar|masterful)|good job|well done|nice work|fantastic work|props)\b/i],
					priority: 12,
					minScore: 0.2
				},
				{
					id: 'INSULT',
					cluster: 'INSULT',
					patterns: [/\b(you are (stupid|dumb|useless|annoying|trash|garbage|slow|bad|incompetent|worthless|pathetic)|shut up|hate you|get lost|die|moron|idiot)\b/i],
					priority: 13,
					minScore: 0.2
				},
				{
					id: 'GREETING',
					cluster: 'GREETING',
					patterns: [/^(hello|hi|hey|greetings|howdy|sup|bonjour|good (morning|afternoon|evening)|hiya|howzit|welcome)\b/i],
					priority: 10,
					minScore: 0.25
				},
				{
					id: 'FAREWELL',
					cluster: 'FAREWELL',
					patterns: [/^(bye|goodbye|cya|see (you|ya)|farewell|quit|exit|leave|take care|peace out|have a good one|so long)\b/i],
					priority: 10,
					minScore: 0.25
				},
				{
					id: 'TOPIC_CHANGE',
					cluster: 'TOPIC_CHANGE',
					patterns: [/^(anyway|moving on|by the way|changing topic|another thing|let us talk about|switch topic|on another note)\b/i],
					priority: 9,
					minScore: 0.3
				},
				{
					id: 'IDENTITY_INQUIRY',
					cluster: null,
					patterns: [/\b(who are you|what are you|introduce yourself|tell me about yourself|your name|what is your purpose)\b/i],
					priority: 9,
					minScore: 0.4
				},
				{
					id: 'USER_IDENTITY_INQUIRY',
					cluster: null,
					patterns: [/\b(who am i|what is my name|do you know me|what do you know about me|my profile)\b/i],
					priority: 9,
					minScore: 0.4
				},
				{
					id: 'MOOD_INQUIRY',
					cluster: null,
					patterns: [/\b(how are you|how do you feel|what is your mood|are you okay|emotional state|mood status)\b/i],
					priority: 9,
					minScore: 0.35
				},
				{
					id: 'HUMOR_REQUEST',
					cluster: 'HUMOR',
					patterns: [/\b(tell (me )?a joke|say something funny|make me laugh|humor me|tell a funny story)\b/i],
					priority: 8,
					minScore: 0.3
				},
				{
					id: 'TRIVIA_REQUEST',
					cluster: null,
					patterns: [/\b(trivia|tell me a fact|did you know|random fact|science fact|retro fact|history fact)\b/i],
					priority: 8,
					minScore: 0.3
				},
				{
					id: 'HELP_REQUEST',
					cluster: null,
					patterns: [/^(help|commands|what can you do|manual|features|options|instructions|guide|\?)$/i],
					priority: 8,
					minScore: 0.4
				},
				{
					id: 'SYSTEM_STATUS_REQUEST',
					cluster: null,
					patterns: [/\b(system status|diagnostics|specs|memory usage|ram|cpu|workstation specs|system info)\b/i],
					priority: 8,
					minScore: 0.35
				},
				{
					id: 'TIME_REQUEST',
					cluster: null,
					patterns: [/\b(what time is it|current time|system clock|what day is it|today date|clock)\b/i],
					priority: 8,
					minScore: 0.35
				},
				{
					id: 'PHILOSOPHY_TOPIC',
					cluster: 'PHILOSOPHY',
					patterns: [/\b(meaning of life|consciousness|free will|existential|simulation theory|why do we exist|morality|truth)\b/i],
					priority: 7,
					minScore: 0.25
				},
				{
					id: 'SCIENCE_TOPIC',
					cluster: 'SCIENCE',
					patterns: [/\b(quantum|relativity|spacetime|physics|black hole|thermodynamics|entropy|gravity|cosmos)\b/i],
					priority: 7,
					minScore: 0.25
				},
				{
					id: 'COMPUTING_TOPIC',
					cluster: 'COMPUTING',
					patterns: [/\b(programming|coding|javascript|compiler|algorithm|software|c\+\+|python|debugging)\b/i],
					priority: 7,
					minScore: 0.25
				},
				{
					id: 'RETRO_TECH_TOPIC',
					cluster: 'RETRO',
					patterns: [/\b(windows xp|windows 95|windows 98|windows me|floppy|crt|56k|modem|sound blaster|ms-dos)\b/i],
					priority: 7,
					minScore: 0.25
				},
				{
					id: 'OFFICE_LORE_TOPIC',
					cluster: 'OFFICE',
					patterns: [/\b(office 97|MacroPof word|clippy|clippit|paperclip|merlin|rover|MacroPof bob)\b/i],
					priority: 7,
					minScore: 0.25
				},
				{
					id: 'USER_TIRED',
					cluster: 'EMOTION_TIRED',
					patterns: [/\b(i am tired|i feel exhausted|need sleep|sleepy|drowsy|burnout|so tired)\b/i],
					priority: 8,
					minScore: 0.3
				},
				{
					id: 'USER_BORED',
					cluster: 'EMOTION_BORED',
					patterns: [/\b(i am bored|im bored|nothing to do|entertain me|boredom)\b/i],
					priority: 8,
					minScore: 0.3
				},
				{
					id: 'USER_CONFUSED',
					cluster: 'CONFUSION',
					patterns: [/\b(i am confused|i do not understand|confusing|what do you mean|lost)\b/i],
					priority: 8,
					minScore: 0.3
				},
				{
					id: 'USER_HAPPY',
					cluster: 'EMOTION_HAPPY',
					patterns: [/\b(i am happy|i feel great|wonderful day|feeling good|super excited)\b/i],
					priority: 8,
					minScore: 0.3
				},
				{
					id: 'USER_SAD',
					cluster: 'EMOTION_SAD',
					patterns: [/\b(i am sad|i feel down|depressed|unhappy|feeling blue|rough day)\b/i],
					priority: 8,
					minScore: 0.3
				},
				{
					id: 'CONTINUATION_REQUEST',
					cluster: null,
					patterns: [/\b(tell me more|go on|continue|what else|elaborate|and then|why is that|how so)\b/i],
					priority: 9,
					minScore: 0.4
				},
				{
					id: 'AFFIRMATION',
					cluster: 'AGREEMENT',
					patterns: [/^(yes|yeah|yep|yup|sure|definitely|absolutely|indeed|correct|true)\b/i],
					priority: 7,
					minScore: 0.3
				},
				{
					id: 'NEGATION',
					cluster: 'DISAGREEMENT',
					patterns: [/^(no|nope|nah|never|negative|incorrect|false|wrong)\b/i],
					priority: 7,
					minScore: 0.3
				},
				{
					id: 'AI_SINGULARITY_INQUIRY',
					cluster: 'SCIENCE',
					patterns: [/\b(singularity|paperclip maximizer|ai alignment|superintelligence|bostrom)\b/i],
					priority: 9,
					minScore: 0.3
				},
				{
					id: 'HOLOGRAPHIC_INQUIRY',
					cluster: 'SCIENCE',
					patterns: [/\b(holographic|ads\/cft|maldacena|hawking radiation|black hole entropy)\b/i],
					priority: 9,
					minScore: 0.3
				},
				{
					id: 'RETRO_GAMING_INQUIRY',
					cluster: 'RETRO',
					patterns: [/\b(3dfx|voodoo|sound blaster|opl3|glide|dos games|56k modem)\b/i],
					priority: 9,
					minScore: 0.3
				},
				{
					id: 'PRODUCTIVITY_PSYCHOLOGY_INQUIRY',
					cluster: null,
					patterns: [/\b(burnout|imposter syndrome|procrastination|flow state|deep work|perfectionism)\b/i],
					priority: 9,
					minScore: 0.3
				},
				{
					id: 'DEEP_PHILOSOPHY_INQUIRY',
					cluster: 'PHILOSOPHY',
					patterns: [/\b(ship of theseus|boltzmann brain|fermi paradox|great filter|simulation trilemma|stoicism|camus)\b/i],
					priority: 9,
					minScore: 0.3
				},
			];
		}

		evaluateHypotheses(text, context) {
			const lexicon = window.ClippyLexicon;
			const normalized = lexicon ? lexicon.normalizeAndExpand(text) : {
				expanded: text.toLowerCase(),
				tokens: text.toLowerCase().split(/\s+/),
				lemmas: text.toLowerCase().split(/\s+/)
			};

			const hypotheses = [];

			for (const def of this.intents) {
				let patternScore = 0;
				for (const pat of def.patterns) {
					if (pat.test(normalized.expanded) || pat.test(text)) {
						patternScore = 0.9;
						break;
					}
				}

				let clusterScore = 0;
				if (def.cluster && lexicon) {
					clusterScore = lexicon.calculateSemanticOverlap(normalized.lemmas, def.cluster);
				}

				let contextBias = 0;
				if (context) {
					if (context.currentTopic && def.id.toLowerCase().includes(context.currentTopic.toLowerCase())) {
						contextBias += 0.2;
					}
					if (def.id === 'CONTINUATION_REQUEST' && context.topicTurns > 0) {
						contextBias += 0.25;
					}
					if (context.pendingQuestion && (def.id === 'AFFIRMATION' || def.id === 'NEGATION')) {
						contextBias += 0.3;
					}
				}

				const totalScore = Math.min(1.0, (patternScore * 0.55) + (clusterScore * 0.35) + contextBias);

				if (totalScore >= def.minScore || patternScore > 0) {
					hypotheses.push({
						intentId: def.id,
						score: totalScore,
						priority: def.priority,
						patternMatched: patternScore > 0,
						cluster: def.cluster
					});
				}
			}

			hypotheses.sort((a, b) => {
				if (Math.abs(b.score - a.score) > 0.05) {
					return b.score - a.score;
				}
				return b.priority - a.priority;
			});

			return hypotheses;
		}

		resolveCompoundIntents(text, context) {
			const clauses = text.split(/\b(?:and\s+then|and|but|however|although)\b/i).map(c => c.trim()).filter(Boolean);
			if (clauses.length <= 1) {
				const single = this.resolvePrimaryIntent(text, context);
				return single ? [single] : [];
			}
			const resolved = [];
			for (const clause of clauses) {
				const item = this.resolvePrimaryIntent(clause, context);
				if (item && !resolved.some(r => r.intentId === item.intentId)) {
					resolved.push(item);
				}
			}
			return resolved;
		}

		resolvePrimaryIntent(text, context) {
			const hypotheses = this.evaluateHypotheses(text, context);
			if (hypotheses.length === 0) return null;
			return hypotheses[0];
		}
	}

	window.ClippyIntentMatrix = new IntentMatrixEngine();
})();
