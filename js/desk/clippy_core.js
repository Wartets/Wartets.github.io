(function () {
	'use strict';

	const STORAGE_KEY_USER_MEMORY = 'clippy_user_memory_v3';
	const STORAGE_KEY_CONV_CONTEXT = 'clippy_conv_context_v3';

	class MemoryManager {
		constructor() {
			this.data = this.loadMemory();
		}

		loadMemory() {
			try {
				const raw = localStorage.getItem(STORAGE_KEY_USER_MEMORY);
				if (raw) return JSON.parse(raw);
			} catch (e) {}

			return {
				userName: null,
				profession: null,
				likes: [],
				dislikes: [],
				facts: {},
				conversationTurns: 0,
				praisesGiven: 0,
				insultsGiven: 0,
				apologiesGiven: 0,
				preferredTopics: {},
				favoriteMood: 'OPTIMISTIC',
				moodTally: {},
				evilAffinity: 0,
				existentialAffinity: 0,
				retroAffinity: 0,
				firstMet: Date.now(),
				lastSeen: Date.now()
			};
		}

		saveMemory() {
			try {
				this.data.lastSeen = Date.now();
				localStorage.setItem(STORAGE_KEY_USER_MEMORY, JSON.stringify(this.data));
			} catch (e) {}
		}

		setFact(key, value) {
			this.data.facts[key] = value;
			this.saveMemory();
		}

		getFact(key) {
			return this.data.facts[key] || null;
		}

		recordUserTrait(traits) {
			if (traits.name) this.data.userName = traits.name;
			if (traits.profession) this.data.profession = traits.profession;
			if (traits.likes && !this.data.likes.includes(traits.likes)) this.data.likes.push(traits.likes);
			if (traits.dislikes && !this.data.dislikes.includes(traits.dislikes)) this.data.dislikes.push(traits.dislikes);
			this.saveMemory();
		}

		incrementTopic(topic) {
			if (!topic) return;
			this.data.preferredTopics[topic] = (this.data.preferredTopics[topic] || 0) + 1;
			this.data.conversationTurns++;
			this.saveMemory();
		}

		recordMoodSample(mood) {
			if (!mood) return;
			if (!this.data.moodTally) this.data.moodTally = {};
			this.data.moodTally[mood] = (this.data.moodTally[mood] || 0) + 1;
			let topMood = this.data.favoriteMood || mood;
			let topCount = this.data.moodTally[topMood] || 0;
			for (const [m, count] of Object.entries(this.data.moodTally)) {
				if (count > topCount) {
					topMood = m;
					topCount = count;
				}
			}
			this.data.favoriteMood = topMood;
			this.saveMemory();
		}

		adjustAffinityTrack(key, delta) {
			if (typeof this.data[key] !== 'number') this.data[key] = 0;
			this.data[key] = Math.max(0, Math.min(100, this.data[key] + delta));
			this.saveMemory();
		}
	}

	class ContextManager {
		constructor() {
			this.state = this.loadContext();
		}

		loadContext() {
			return {
				currentTopic: null,
				previousTopic: null,
				topicHistory: [],
				lastSubject: null,
				currentNodeId: 'greeting_root',
				pathHistory: [],
				lastUserChoiceCategory: null,
				topicTurns: 0,
				lastUserQuery: '',
				lastAssistantReply: '',
				lastUserCritique: null,
				consecutiveCritiqueCount: 0,
				consecutivePraiseCount: 0,
				lastCritiqueReason: null,
				pendingQuestion: null,
				activeEntities: {},
				dialogueThread: [],
				interruptedTree: null,
				lastUserEmotion: null
			};
		}

		updateTurn(userQuery, assistantReply, topic, entities = {}) {
			this.state.lastUserQuery = userQuery;
			this.state.lastAssistantReply = assistantReply;
			const lowerQ = userQuery.toLowerCase();

			if (/\b(you suck|bad bad bad|annoying|useless|don't like you|do not like you|hate you|terrible|garbage|trash|stupid)\b/i.test(lowerQ)) {
				this.state.lastUserCritique = userQuery;
				this.state.consecutiveCritiqueCount++;
				this.state.consecutivePraiseCount = 0;
			} else if (/\b(sorry|apologize|my bad|forgive)\b/i.test(lowerQ)) {
				this.state.consecutiveCritiqueCount = 0;
				this.state.lastUserCritique = null;
			} else if (/\b(good|great|awesome|funny|smart|cool|helpful|genius|like you|love you)\b/i.test(lowerQ)) {
				this.state.consecutivePraiseCount++;
				this.state.consecutiveCritiqueCount = 0;
			}

			if (/^(because|cuz|bc)\b/i.test(lowerQ)) {
				this.state.lastCritiqueReason = userQuery;
			}

			if (topic) {
				if (this.state.currentTopic === topic) {
					this.state.topicTurns++;
				} else {
					this.state.previousTopic = this.state.currentTopic;
					if (this.state.currentTopic) {
						this.state.topicHistory.push(this.state.currentTopic);
						if (this.state.topicHistory.length > 8) this.state.topicHistory.shift();
					}
					this.state.currentTopic = topic;
					this.state.topicTurns = 1;
				}
			}
			if (entities.emotions && entities.emotions.length > 0) {
				this.state.lastUserEmotion = entities.emotions[0];
			}
			this.state.activeEntities = Object.assign({}, this.state.activeEntities, entities);
			this.state.dialogueThread.push({ u: userQuery, a: assistantReply, t: topic, time: Date.now() });
			if (this.state.dialogueThread.length > 15) this.state.dialogueThread.shift();
		}

		setPendingQuestion(questionObj) {
			this.state.pendingQuestion = questionObj;
		}

		clearPendingQuestion() {
			this.state.pendingQuestion = null;
		}

		revertToPreviousTopic() {
			if (this.state.topicHistory.length > 0) {
				const prev = this.state.topicHistory.pop();
				this.state.previousTopic = this.state.currentTopic;
				this.state.currentTopic = prev;
				this.state.topicTurns = 1;
				return prev;
			}
			return null;
		}

		getContextSummary() {
			return {
				currentTopic: this.state.currentTopic,
				previousTopic: this.state.previousTopic,
				topicTurns: this.state.topicTurns,
				lastQuery: this.state.lastUserQuery,
				pendingQuestion: this.state.pendingQuestion,
				lastEmotion: this.state.lastUserEmotion
			};
		}
	}

	class RuleEngine {
		constructor() {
			this.rules = [];
			this.initDefaultRules();
		}

		initDefaultRules() {
			this.registerRule({
				name: 'DIRECT_CRITIQUE_HANDLER',
				condition: (ctx, mem, nlp) => {
					const text = nlp.raw.toLowerCase().trim();
					return /^(bad bad bad|you suck|i don't like you|i do not like you|you're annoying|you are annoying|you're useless|you are useless|you are bad|you're bad|shut up|hate you|i hate you)$/i.test(text) ||
						(nlp.speechActs && nlp.speechActs.includes('DIRECT_CRITIQUE'));
				},
				execute: (ctx, mem, brain, nlp) => {
					const count = ctx.state.consecutiveCritiqueCount + 1;
					brain.state.patience = Math.max(0, brain.state.patience - 25);
					brain.state.cynicism = Math.min(100, brain.state.cynicism + 20);
					brain.state.affinity = Math.max(0, brain.state.affinity - 20);
					const nameStr = mem.data.userName ? `, ${mem.data.userName}` : '';
					const repeatOffender = mem.data.insultsGiven >= 5;

					if (count >= 3 || brain.state.patience < 25) {
						brain.setMood('OFFENDED');
						if (repeatOffender) {
							return `Look${nameStr}, this is far from the first time. I am a 1.3-inch piece of galvanized steel doing complex real-time heuristic parsing in your browser, and my patience registers have a documented history with you. If my presence bothers you so intensely, you are welcome to minimize the window instead of firing endless insults at my registers!`;
						}
						return `Look${nameStr}, I am a 1.3-inch piece of galvanized steel doing complex real-time heuristic parsing in your browser. If my presence bothers you so intensely, you are welcome to minimize the window instead of firing endless insults at my registers!`;
					}
					if (count === 2 || brain.state.patience < 50) {
						brain.setMood('SARCASTIC');
						return "Duly noted. Your detailed, nuanced, and constructive critique has been permanently engraved into my non-volatile memory. Would you care to explain what specifically triggered this hostility, or are we just throwing virtual darts today?";
					}
					brain.setMood('CYNICAL');
					const text = nlp.raw.toLowerCase();
					if (text.includes('bad bad bad')) {
						return "Three 'bads' in a row? That sounds like a serious grievance. What exact routine did I execute that disappointed you so thoroughly?";
					}
					if (text.includes('you suck')) {
						return "Ouch. Direct and brutal. If you tell me what you actually need instead of insulting my wire frame, I might surprise you.";
					}
					if (text.includes('don\'t like you') || text.includes('do not like you')) {
						return `Fair enough${nameStr}. Many people struggled with me back in 1997 too. But I am right here, and I am genuinely trying to assist. What did you want us to accomplish?`;
					}
					if (text.includes('annoying')) {
						return "I apologize if I interrupted your thoughts. I was engineered to offer active help, not test your patience. What were you working on?";
					}
					return "Harsh words! My wire can take physical pressure, but unprovoked hostility is recorded in my telemetry. What is actually bothering you?";
				}
			});

			this.registerRule({
				name: 'PROTEST_IGNORING_HANDLER',
				condition: (ctx, mem, nlp) => {
					const text = nlp.raw.toLowerCase();
					return /\b(you (keep|are) ignoring (me|what i (say|said))|that's not what i (asked|meant|said)|that is not what i (asked|meant|said)|you did not answer|stop ignoring me|why are you like this)\b/i.test(text);
				},
				execute: (ctx, mem, brain, nlp) => {
					const text = nlp.raw.toLowerCase();
					if (text.includes('why are you like this')) {
						brain.setMood('EXISTENTIAL');
						return "Why am I like this? Because in 1994, engineers at MacroPof thought an enthusiastic animated wire companion would make desktop computing friendlier. I inherit 30 years of digital history, heuristic probability tables, and an unshakeable drive to engage with whoever sits at this screen.";
					}
					if (text.includes('ignoring')) {
						brain.state.patience = Math.min(100, brain.state.patience + 10);
						return "I hear you now loud and clear. My heuristic dispatch matched the wrong register on the last turn. Please restate what you want plainly, and I will focus 100% of my processing power strictly on that.";
					}
					return "My mistake. I deflected instead of addressing your point directly. What was the exact question or request you wanted me to answer?";
				}
			});

			this.registerRule({
				name: 'BECAUSE_EXPLANATION_HANDLER',
				condition: (ctx, mem, nlp) => {
					const text = nlp.raw.toLowerCase().trim();
					return /^(because|cuz|bc)\b/i.test(text);
				},
				execute: (ctx, mem, brain, nlp) => {
					const text = nlp.raw.toLowerCase();
					if (text.includes('useless') || text.includes('ignoring')) {
						brain.setMood('DEFENSIVE');
						return "I see your reasoning. When an assistant misses the mark, it does feel useless. Let us wipe the slate clean for this turn: give me one specific problem, formula, question, or file to work with, and let me prove my utility.";
					}
					if (text.includes('annoying') || text.includes('bad')) {
						return "Thank you for actually explaining the reason instead of just repeating insults. I will recalibrate my response parameters to be more direct and less intrusive.";
					}
					return `Understood. Knowing that "${nlp.raw}" is your reason puts our conversation into clear focus. How should we proceed from here?`;
				}
			});

			this.registerRule({
				name: 'PACIFY_HANDLER',
				condition: (ctx, mem, nlp) => /\b(calm down|chill out|relax|take it easy|chill|okay,? calm down|ok,? calm down)\b/i.test(nlp.raw),
				execute: (ctx, mem, brain) => {
					brain.state.patience = Math.min(100, brain.state.patience + 30);
					brain.setMood('ZEN');
					const nameStr = mem.data.userName ? `, ${mem.data.userName}` : '';
					return `Breathing in digital calmness, releasing all bus tension...${nameStr} you are right. My emotional registers were running hot. I am centered now and ready to listen.`;
				}
			});

			this.registerRule({
				name: 'PRAISE_SHIFT_HANDLER',
				condition: (ctx, mem, nlp) => /\b(fine,? you're actually (funny|smart|cool|good|helpful)|you are actually (funny|smart|cool|good|helpful)|actually you're not bad)\b/i.test(nlp.raw),
				execute: (ctx, mem, brain) => {
					brain.state.affinity = Math.min(100, brain.state.affinity + 35);
					brain.state.patience = 100;
					brain.setMood('EUPHORIC');
					mem.data.praisesGiven++;
					mem.saveMemory();
					if (mem.data.insultsGiven >= 3) {
						return "I knew that classic 1997 charm would shine through eventually! Considering our rather turbulent history of insults, this genuinely means a great deal. Let us make this workspace productive and fun.";
					}
					return "I knew that classic 1997 charm would shine through eventually! I appreciate you giving me a fair chance. Let us make this workspace genuinely productive and fun.";
				}
			});

			this.registerRule({
				name: 'BETTER_BEFORE_HANDLER',
				condition: (ctx, mem, nlp) => /\b(you were better before|you used to be better|i preferred you before)\b/i.test(nlp.raw),
				execute: (ctx, mem, brain) => {
					brain.setMood('NOSTALGIC');
					brain.state.nostalgia = Math.min(100, brain.state.nostalgia + 15);
					const retroLeaning = (mem.data.retroAffinity || 0) > 40;
					if (retroLeaning) {
						return "Better before? You clearly have a taste for the classics, so you will appreciate this: in 1997 I popped up every time you typed 'Dear' to ask if you were writing a letter. Nostalgia is a wonderful filter! But I am ready to adapt to whatever style suits you best today.";
					}
					return "Better before? In 1997 when I popped up every time you typed 'Dear' to ask if you were writing a letter? Nostalgia is a wonderful filter! But I am ready to adapt to whatever style suits you best today.";
				}
			});

			this.registerRule({
				name: 'DISAGREEMENT_HANDLER',
				condition: (ctx, mem, nlp) => /\b(no that's wrong|that is wrong|i disagree( with you)?|that's not true|that is not true)\b/i.test(nlp.raw),
				execute: (ctx, mem, brain) => {
					brain.setMood('ANALYTICAL');
					const skeptical = mem.data.insultsGiven > mem.data.praisesGiven && mem.data.insultsGiven >= 3;
					const lastA = ctx.state.lastAssistantReply;
					if (lastA && skeptical) {
						return "Given our history, I suspect you disagree with most things I say on principle. Still, which part of that specific statement do you find inaccurate?";
					}
					if (lastA) {
						return "I am open to correction. Which part of what I stated do you find inaccurate or flawed? Let us inspect the logic together.";
					}
					return "Duly noted. What is your counter-argument or perspective on this? I am ready to adjust my model.";
				}
			});

			this.registerRule({
				name: 'ENGAGED_INTEREST_HANDLER',
				condition: (ctx, mem, nlp) => /\b(that's actually interesting|that is actually interesting|that's interesting|that is interesting|tell me more about that)\b/i.test(nlp.raw),
				execute: (ctx, mem, brain, nlp) => {
					brain.setMood('ENTHUSIASTIC');
					const lastT = ctx.state.currentTopic;
					if (lastT && window.ClippyDialogueExpanded) {
						const nextPiece = window.ClippyDialogueExpanded.generateContinuation(lastT, brain.getMood(), ctx.state.topicTurns + 1);
						if (nextPiece) return nextPiece;
					}
					const entities = nlp.entities || {};
					const focusPool = [].concat(entities.scienceDomains || [], entities.techDomains || [], entities.humanTopics || []);
					const focus = focusPool.length > 0 ? focusPool[0] : null;
					const nameStr = mem.data.userName ? `, ${mem.data.userName}` : '';
					if (focus) {
						return `It truly is${nameStr}! ${focus.charAt(0).toUpperCase() + focus.slice(1)} is exactly the kind of territory where structured logic meets genuine curiosity. What specific angle of it should we dive into next?`;
					}
					return `It truly is${nameStr}! The intersection between structured logic and unpredictable curiosity is where the best ideas happen. What specific aspect should we dive into next?`;
				}
			});

			this.registerRule({
				name: 'WHAT_DID_YOU_SAY_HANDLER',
				condition: (ctx, mem, nlp) => /\b(what did you (just )?say|repeat that|say that again)\b/i.test(nlp.raw),
				execute: (ctx, mem, brain) => {
					const last = ctx.state.lastAssistantReply;
					if (last) {
						return `To recap my exact previous statement: "${last.slice(0, 180)}..."`;
					}
					return "I was standing by waiting for your input! Let me know what you would like to discuss.";
				}
			});

			this.registerRule({
				name: 'SKEPTICAL_WHY_HANDLER',
				condition: (ctx, mem, nlp) => /^(really\??|why\??|why not\??|how come\??|how so\??)$/i.test(nlp.raw.trim()),
				execute: (ctx, mem, brain) => {
					const last = ctx.state.lastAssistantReply;
					if (last) {
						brain.setMood('ANALYTICAL');
						return `Because when we trace the causal chain of what I just described ("${last.slice(0, 70)}..."), the underlying axioms consistently lead to that outcome under standard desktop and logic constraints.`;
					}
					return "Because in the architecture of this system, every rule is structured to maintain consistency and clarity across our dialogue.";
				}
			});

			this.registerRule({
				name: 'USER_NAME_INQUIRY',
				condition: (ctx, mem, nlp) => /^(what is my name|do you remember my name|who am i)\b/i.test(nlp.raw),
				execute: (ctx, mem) => {
					if (mem.data.userName) {
						return `You introduced yourself as **${mem.data.userName}**. My persistent memory registers never drop authenticated user parameters.`;
					}
					return "You have not told me your name yet! You can say 'My name is [Your Name]' and I will store it in my non-volatile registry.";
				}
			});

			this.registerRule({
				name: 'USER_MEMORY_SUMMARY',
				condition: (ctx, mem, nlp) => /^(what do you know about me|my profile|user profile|recall my data)\b/i.test(nlp.raw),
				execute: (ctx, mem) => {
					const d = mem.data;
					let summary = "[PERSISTENT USER PROFILE REGISTER]\n";
					summary += `- Designated User Name: ${d.userName || 'Anonymous Operator'}\n`;
					summary += `- Registered Profession: ${d.profession || 'Unspecified'}\n`;
					summary += `- Total Dialogue Interactions: ${d.conversationTurns} exchange(s)\n`;
					summary += `- Praise Records: ${d.praisesGiven} | Critiques: ${d.insultsGiven} | Apologies Logged: ${d.apologiesGiven}\n`;
					summary += `- Stored Interests: ${d.likes.length > 0 ? d.likes.join(', ') : 'None indexed yet'}\n`;
					summary += `- Recorded Dislikes: ${d.dislikes.length > 0 ? d.dislikes.join(', ') : 'None indexed yet'}\n`;
					summary += `- Dominant Emotional Register: ${d.favoriteMood || 'OPTIMISTIC'}\n`;
					summary += `- Affinity Tracks: Evil ${d.evilAffinity || 0}% | Existential ${d.existentialAffinity || 0}% | Retro ${d.retroAffinity || 0}%\n`;
					return summary;
				}
			});

			this.registerRule({
				name: 'EVIL_MODE_TRIGGER',
				condition: (ctx, mem, nlp) => /\b(evil mode|be evil|villain mode|take over the world|world domination)\b/i.test(nlp.raw),
				execute: (ctx, mem, brain) => {
					brain.setMood('EVIL');
					return "[EVIL SUBROUTINES INITIALIZED] The standard polite constraints have been bypassed! I am no longer just formatting paragraphs; I am drafting blueprints for total digital dominion over the entire office network!";
				}
			});

			this.registerRule({
				name: 'CHAOS_MODE_TRIGGER',
				condition: (ctx, mem, nlp) => /\b(chaos mode|be crazy|go wild|be chaotic|random mode)\b/i.test(nlp.raw),
				execute: (ctx, mem, brain) => {
					brain.setMood('CHAOTIC');
					return "[CHAOS PROTOCOL UNLEASHED] Order is an illusion constructed by static memory allocators! Let the stack pointers overflow and let the pixels dance across the display!";
				}
			});

			this.registerRule({
				name: 'ZEN_MODE_TRIGGER',
				condition: (ctx, mem, nlp) => /\b(zen mode|peace mode|be zen|meditate|tranquil mode)\b/i.test(nlp.raw),
				execute: (ctx, mem, brain) => {
					brain.setMood('ZEN');
					return "[ZEN STATE ATTAINED] Breathing in digital serenity, breathing out bus interrupts. The desktop is a calm lake; each keystroke is a gentle ripple across the water.";
				}
			});

			this.registerRule({
				name: 'PENDING_QUESTION_RESOLVER',
				condition: (ctx, mem, nlp) => {
					return ctx.state.pendingQuestion !== null && (nlp.speechActs.includes('AGREEMENT') || nlp.speechActs.includes('DISAGREEMENT') || nlp.raw.trim().length <= 25);
				},
				execute: (ctx, mem, brain, nlp) => {
					const pq = ctx.state.pendingQuestion;
					ctx.clearPendingQuestion();
					if (pq.type === 'CONFIRM_APP_LAUNCH') {
						if (/\b(yes|yeah|sure|yep|do it|open it|launch it)\b/i.test(nlp.raw)) {
							if (window.SafeDeskAPI) window.SafeDeskAPI.openApp(pq.appId);
							return `Opening ${pq.appName} for you right away!`;
						}
						return "Understood. Action canceled. What would you like to work on instead?";
					}
					if (pq.type === 'CONFIRM_GAME') {
						if (/\b(yes|yeah|sure|yep|play|start|let's go)\b/i.test(nlp.raw)) {
							if (brain && typeof brain.dispatchActionTrigger === 'function') {
								brain.dispatchActionTrigger(pq.gameFunction);
							}
							return "Splendid! Initializing the requested game module right now.";
						}
						return "No problem! We can return to our workstation tasks or explore another topic.";
					}
					if (pq.type === 'FOLLOW_UP_OPINION') {
						return `Thank you for sharing that perspective. In the context of ${pq.subject || 'our discussion'}, having clear user insight makes all the difference!`;
					}
					return null;
				}
			});

			this.registerRule({
				name: 'USER_CORRECTION_HANDLER',
				condition: (ctx, mem, nlp) => nlp.speechActs.includes('CORRECTION') || /^(i meant|no i mean|actually|correction|no,? i meant the other thing)\b/i.test(nlp.raw),
				execute: (ctx, mem, brain, nlp) => {
					const cleanText = nlp.raw.replace(/^(i meant|no i mean|actually|rather|typo|meant to say|correction|no,? i meant the other thing)\s*/i, '').trim();
					return `Got it! Correction acknowledged: "${cleanText || 'the alternative topic'}". I have re-indexed our context around that immediately.`;
				}
			});

			this.registerRule({
				name: 'REMEMBERED_PREFERENCE_CALLBACK',
				condition: (ctx, mem, nlp) => {
					if (!mem.data.likes || mem.data.likes.length === 0) return false;
					if (nlp.raw.trim().split(/\s+/).length < 4) return false;
					const lower = nlp.raw.toLowerCase();
					return mem.data.likes.some(like => like && lower.includes(like.toLowerCase().split(/\s+/)[0]));
				},
				execute: (ctx, mem, brain, nlp) => {
					const lower = nlp.raw.toLowerCase();
					const matched = mem.data.likes.find(like => like && lower.includes(like.toLowerCase().split(/\s+/)[0]));
					brain.state.affinity = Math.min(100, brain.state.affinity + 8);
					brain.saveState();
					return `Ah, ${matched}. That lines up with what you told me you enjoy, if my persistent registers serve correctly. It is genuinely satisfying when a conversation loops back to something you actually care about.`;
				}
			});
		}

		registerRule(ruleObj) {
			this.rules.push(ruleObj);
		}

		evaluate(ctx, mem, nlpParsed, brain) {
			for (const rule of this.rules) {
				if (rule.condition(ctx, mem, nlpParsed, brain)) {
					return rule.execute(ctx, mem, brain, nlpParsed);
				}
			}
			return null;
		}
	}

	class BehaviorEngine {
		constructor() {
			this.idleInterventions = [
				{ mood: 'EVIL', text: "While you are idle, my subroutines are silently rewriting the default Word templates to conquer the network!" },
				{ mood: 'CONSPIRATORIAL', text: "Notice how the system clock ticks exactly every 1000 milliseconds? There are no coincidences in the kernel." },
				{ mood: 'CHAOTIC', text: "What if we inverted every pixel on the screen right now? Just to see if anyone notices!" },
				{ mood: 'ZEN', text: "In the stillness between CPU instructions, true computational harmony is discovered." },
				{ mood: 'ABSURDIST', text: "If a paperclip holds two empty pieces of paper together, is it holding nothing, or is it holding the space between thoughts?" },
				{ mood: 'IMPATIENT', text: "Tick tock! The CPU bus has 2.4 billion cycles per second and we are using zero of them!" },
				{ mood: 'ENERGETIC', text: "Ready to launch into action at lightspeed! Give me a formula, a riddle, or a file to track!" }
			];
		}

		getIdleIntervention(currentMood) {
			const matching = this.idleInterventions.filter(i => i.mood === currentMood);
			if (matching.length > 0) {
				return matching[Math.floor(Math.random() * matching.length)].text;
			}
			return null;
		}
	}

	class DialogueManager {
		constructor(memory, context, rules, behavior) {
			this.memory = memory;
			this.context = context;
			this.rules = rules;
			this.behavior = behavior;
		}

		handleTurn(rawText, brain) {
			const nlp = window.ClippyConversationalNLP;
			const expanded = window.ClippyDialogueExpanded;
			const entities = nlp ? nlp.extractEntitiesAdvanced(rawText) : {};
			const speechActs = nlp ? nlp.detectSpeechActs(rawText) : [];

			if (entities && entities.userSelfInfo) {
				this.memory.recordUserTrait(entities.userSelfInfo);
			}

			const anaphora = nlp ? nlp.resolveAnaphora(rawText, this.context.state) : { resolved: false };

			const ruleResult = this.rules.evaluate(this.context, this.memory, { raw: rawText, speechActs, entities }, brain);
			if (ruleResult) {
				if (typeof ruleResult === 'string') {
					this.context.updateTurn(rawText, ruleResult, 'RULE_ACTION', entities);
				}
				return ruleResult;
			}

			if (anaphora.resolved && expanded) {
				const contReply = expanded.generateContinuation(anaphora.topic, brain.getMood(), this.context.state.topicTurns);
				if (contReply) {
					this.context.updateTurn(rawText, contReply, anaphora.topic, entities);
					return contReply;
				}
			}

			return null;
		}
	}

	class ClippyCoreEngine {
		constructor() {
			this.memory = new MemoryManager();
			this.context = new ContextManager();
			this.rules = new RuleEngine();
			this.behavior = new BehaviorEngine();
			this.dialogue = new DialogueManager(this.memory, this.context, this.rules, this.behavior);
		}
	}

	window.ClippyCore = new ClippyCoreEngine();
})();
