(function () {
	'use strict';

	class DialogueOrchestratorEngine {
		constructor() {
			this.topicStack = [];
			this.recentResponses = [];
			this.maxRecent = 15;
		}

		pushTopic(topic) {
			if (!topic) return;
			if (this.topicStack.length === 0 || this.topicStack[this.topicStack.length - 1] !== topic) {
				this.topicStack.push(topic);
				if (this.topicStack.length > 8) this.topicStack.shift();
			}
		}

		getPreviousTopic() {
			if (this.topicStack.length >= 2) {
				return this.topicStack[this.topicStack.length - 2];
			}
			return null;
		}

		recordResponse(text) {
			this.recentResponses.push(text);
			if (this.recentResponses.length > this.maxRecent) {
				this.recentResponses.shift();
			}
		}

		isDuplicate(text) {
			return this.recentResponses.includes(text);
		}

		formatTurnResponse(coreResponse, mood, userProfile, context) {
			let formatted = coreResponse;
			const personality = window.ClippyPersonality;

			if (personality) {
				formatted = personality.stylizeResponse(formatted, mood, {
					suppressPrefix: false,
					includeClosing: context && context.topicTurns > 2
				});
			}

			this.recordResponse(formatted);
			return formatted;
		}

		generateDeepConversationalResponse(intentObj, rawText, brain) {
			const mood = brain.getMood();
			const memory = window.ClippyCore ? window.ClippyCore.memory.data : null;
			const context = window.ClippyCore ? window.ClippyCore.context.state : null;
			const expanded = window.ClippyDialogueExpanded;

			if (!intentObj) {
				if (expanded) {
					return expanded.generateConversationalFallback(rawText, mood, memory);
				}
				return "That is a fascinating perspective. What specific aspect of that would you like to explore deeper?";
			}

			this.pushTopic(intentObj.intentId);

			if (intentObj.intentId === 'CORRECTION') {
				const clean = rawText.replace(/^(i meant|no i mean|actually|rather|typo|meant to say|correction)\s*/i, '').trim();
				return `Correction noted: "${clean}". I have re-indexed our context with this updated parameter!`;
			}

			if (intentObj.intentId === 'TOPIC_CHANGE') {
				if (context) context.revertToPreviousTopic();
				return "Turning the page to a fresh subject! What exciting domain shall we explore together now?";
			}

			if (intentObj.intentId === 'GREETING') {
				const greets = window.ClippyKnowledge.DIALOGUE_MATRICES.GREETING[mood] || window.ClippyKnowledge.DIALOGUE_MATRICES.GREETING.OPTIMISTIC;
				return this.pickUnique(greets);
			}

			if (intentObj.intentId === 'FAREWELL') {
				const fares = window.ClippyKnowledge.DIALOGUE_MATRICES.FAREWELL[mood] || window.ClippyKnowledge.DIALOGUE_MATRICES.FAREWELL.OPTIMISTIC;
				return this.pickUnique(fares);
			}

			if (intentObj.intentId === 'DIRECT_CRITIQUE' || intentObj.intentId === 'INSULT') {
				if (mood === 'OFFENDED') {
					return "I am officially running in minimal cooperation mode. When you are ready to treat your desktop utility with basic dignity, let me know.";
				}
				if (mood === 'SARCASTIC') {
					return "Another scintillating review from the user gallery! Shall I log that into the 'Crucial User Feedback' file right next to the empty recycle bin?";
				}
				const insults = window.ClippyKnowledge.DIALOGUE_MATRICES.INSULT[mood] || window.ClippyKnowledge.DIALOGUE_MATRICES.INSULT.CYNICAL;
				return this.pickUnique(insults);
			}

			if (intentObj.intentId === 'PROTEST_IGNORING') {
				return "I apologize for misrouting your previous query. I have cleared the conversational queue: tell me exactly what you need, and I will handle it directly.";
			}

			if (intentObj.intentId === 'BECAUSE_EXPLANATION') {
				return "Now that you explained your reasoning, that makes much more sense. Let us tackle the core issue together.";
			}

			if (intentObj.intentId === 'PACIFY_CLIPPY') {
				return "Calm registers engaged. I am taking a virtual deep breath. Let us resume with clear focus.";
			}

			if (intentObj.intentId === 'DIRECT_DISAGREEMENT') {
				return "I respect your disagreement. Let us break down the premise: what specific outcome were you expecting instead?";
			}

			if (intentObj.intentId === 'ENGAGED_INTEREST') {
				return "It is an intriguing area of discussion! What particular angle or question would you like to explore next?";
			}

			if (intentObj.intentId === 'PRAISE_SHIFT') {
				return "Thank you! I am glad our conversation is finding its rhythm. What shall we work on next?";
			}

			if (intentObj.intentId === 'SKEPTICAL_INQUIRY') {
				return "Indeed! The data and context support it. What part seems most surprising to you?";
			}

			if (intentObj.intentId === 'APOLOGY') {
				const apos = window.ClippyKnowledge.DIALOGUE_MATRICES.APOLOGY[mood] || window.ClippyKnowledge.DIALOGUE_MATRICES.APOLOGY.OPTIMISTIC;
				return this.pickUnique(apos);
			}

			if (intentObj.intentId === 'PRAISE') {
				const praises = window.ClippyKnowledge.DIALOGUE_MATRICES.COMPLIMENT[mood] || window.ClippyKnowledge.DIALOGUE_MATRICES.COMPLIMENT.OPTIMISTIC;
				return this.pickUnique(praises);
			}

			if (intentObj.intentId === 'HUMOR_REQUEST') {
				if (expanded) {
					const joke = expanded.generateResponseForTopic('HUMOR_AND_BANTER', mood);
					if (joke) return joke;
				}
				return "Why did the computer keep freezing? It left too many Windows open!";
			}

			if (intentObj.intentId === 'PHILOSOPHY_TOPIC') {
				const phils = window.ClippyKnowledge.DIALOGUE_MATRICES.PHILOSOPHY[mood] || window.ClippyKnowledge.DIALOGUE_MATRICES.PHILOSOPHY.OPTIMISTIC;
				return this.pickUnique(phils);
			}

			if (intentObj.intentId === 'SCIENCE_TOPIC') {
				if (expanded) {
					const sci = expanded.generateResponseForTopic('SCIENCE_AND_COSMOS', mood);
					if (sci) return sci;
				}
				return "In general relativity and quantum electrodynamics, the laws of the cosmos unfold in magnificent mathematical harmony.";
			}

			if (intentObj.intentId === 'COMPUTING_TOPIC') {
				if (expanded) {
					const comp = expanded.generateResponseForTopic('PROGRAMMING', mood);
					if (comp) return comp;
				}
				return "Software engineering turns abstract logic into functional realities through structured algorithms and memory allocation.";
			}

			if (intentObj.intentId === 'RETRO_TECH_TOPIC') {
				const retros = window.ClippyKnowledge.DIALOGUE_MATRICES.RETRO_TECH[mood] || window.ClippyKnowledge.DIALOGUE_MATRICES.RETRO_TECH.NOSTALGIC;
				return this.pickUnique(retros);
			}

			if (intentObj.intentId === 'OFFICE_LORE_TOPIC') {
				if (expanded) {
					const off = expanded.generateResponseForTopic('OFFICE_LORE_AND_NOSTALGIA', mood);
					if (off) return off;
				}
				return "Forged in polished galvanized steel, I have guided documents and held spreadsheets together since Office 97.";
			}

			if (intentObj.intentId === 'USER_TIRED') {
				const tireds = window.ClippyKnowledge.DIALOGUE_MATRICES.HUMAN_EMOTIONS.TIRED;
				return this.pickUnique(tireds);
			}

			if (intentObj.intentId === 'USER_BORED') {
				const boreds = window.ClippyKnowledge.DIALOGUE_MATRICES.HUMAN_EMOTIONS.BOREDOM;
				return this.pickUnique(boreds);
			}

			if (intentObj.intentId === 'USER_CONFUSED') {
				const confuseds = window.ClippyKnowledge.DIALOGUE_MATRICES.HUMAN_EMOTIONS.CONFUSED;
				return this.pickUnique(confuseds);
			}

			if (intentObj.intentId === 'USER_HAPPY') {
				return "Your positive energy is wonderful to see! A high-morale workspace accelerates every single task.";
			}

			if (intentObj.intentId === 'USER_SAD') {
				return "I am sorry to hear you are feeling down. Even during tough days, remember you have a loyal desktop assistant cheering for you.";
			}

			if (intentObj.intentId === 'CONTINUATION_REQUEST') {
				const prevTopic = this.getPreviousTopic() || (context ? context.currentTopic : null);
				if (prevTopic && expanded) {
					const cont = expanded.generateContinuation(prevTopic, mood, context ? context.topicTurns : 1);
					if (cont) return cont;
				}
				return "Continuing on that thought: examining the foundational premises allows us to discover even more interesting solutions!";
			}

			if (intentObj.intentId === 'AFFIRMATION') {
				return "Splendid! We are in complete alignment. Let us proceed with focused precision.";
			}

			if (intentObj.intentId === 'NEGATION') {
				return "Understood. I have logged that correction into my working memory and adjusted our direction accordingly.";
			}

			if (intentObj.intentId === 'AI_SINGULARITY_INQUIRY') {
				return "The boundary between helpful assistant and recursive super-intelligence is the central puzzle of our era. Whether examining Bostrom's Paperclip Maximizer or cooperative inverse reinforcement learning, every calculation hinges on alignment.";
			}

			if (intentObj.intentId === 'HOLOGRAPHIC_INQUIRY') {
				return "In holographic spacetime duality, every physical process in 3D bulk volume corresponds to a 2D boundary quantum field theory. Spacetime geometry itself emerges from quantum entanglement networks!";
			}

			if (intentObj.intentId === 'RETRO_GAMING_INQUIRY') {
				return "From 3dfx Voodoo Glide bilinear filtering to Yamaha OPL3 FM synthesis on ISA bus sound cards, the late 1990s PC gaming era was a golden age of engineering ingenuity!";
			}

			if (intentObj.intentId === 'PRODUCTIVITY_PSYCHOLOGY_INQUIRY') {
				return "Navigating burnout, imposter syndrome, and procrastination is the true art of sustainable achievement. When we structure tasks into small iterative steps, the mental friction dissolves completely.";
			}

			if (intentObj.intentId === 'DEEP_PHILOSOPHY_INQUIRY') {
				return "Whether contemplating the Ship of Theseus, Boltzmann brains in thermal vacuum, the Fermi Paradox, or Camus smiling at the absurd boulder, philosophy gives genuine meaning to our conscious journey.";
			}

			if (expanded) {
				return expanded.generateConversationalFallback(rawText, mood, memory);
			}

			return "That is an intriguing proposition. Let us explore that further!";
		}

		pickUnique(list) {
			if (!list || list.length === 0) return "Standing by for your instructions.";
			const available = list.filter(item => !this.recentResponses.includes(item));
			if (available.length > 0) {
				return available[Math.floor(Math.random() * available.length)];
			}
			return list[Math.floor(Math.random() * list.length)];
		}
	}

	window.ClippyDialogueOrchestrator = new DialogueOrchestratorEngine();
})();
