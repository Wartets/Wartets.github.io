(function () {
	'use strict';

	class ClippyGraphEngine {
		constructor() {
			this.nodes = (window.ClippyKnowledge && window.ClippyKnowledge.DIALOGUE_NODES)
				? window.ClippyKnowledge.DIALOGUE_NODES
				: {};
		}

		getNode(nodeId) {
			const dict = (window.ClippyKnowledge && window.ClippyKnowledge.DIALOGUE_NODES) || this.nodes;
			if (dict && dict[nodeId]) return dict[nodeId];
			return dict ? dict.greeting_root : null;
		}

		getFormattedNodeText(node, brain) {
			if (!node) return "Standing by for user instructions.";
			const currentMood = brain ? brain.getMood() : 'OPTIMISTIC';
			const affinity = brain ? brain.getAffinity() : 50;
			const patience = brain ? brain.getPatience() : 50;

			let pool = [];
			if (node.responses && Array.isArray(node.responses) && node.responses.length > 0) {
				pool = node.responses.slice();
			}

			if (pool.length === 0) {
				return typeof node.text === 'string' ? node.text : "Standing by for user instructions.";
			}

			const eligible = pool.filter(c => {
				if (!c || !c.conditions) return true;
				if (c.conditions.minAffinity !== undefined && affinity < c.conditions.minAffinity) return false;
				if (c.conditions.maxAffinity !== undefined && affinity > c.conditions.maxAffinity) return false;
				if (c.conditions.minPatience !== undefined && patience < c.conditions.minPatience) return false;
				if (c.conditions.maxPatience !== undefined && patience > c.conditions.maxPatience) return false;
				return true;
			});

			const workingPool = eligible.length > 0 ? eligible : pool;
			const moodMatched = workingPool.filter(c => c && c.conditions && Array.isArray(c.conditions.moods) && c.conditions.moods.includes(currentMood));
			const finalPool = moodMatched.length > 0 ? moodMatched : workingPool;

			const totalWeight = finalPool.reduce((sum, c) => sum + Math.max(1, (c && c.weight) || 10), 0);
			let roll = Math.random() * totalWeight;
			let selected = finalPool[0];

			for (const cand of finalPool) {
				const w = Math.max(1, (cand && cand.weight) || 10);
				if (roll < w) {
					selected = cand;
					break;
				}
				roll -= w;
			}

			if (selected && selected.moodDelta && brain) {
				brain.applyMoodDelta(selected.moodDelta);
			}

			return (selected && selected.text) || node.text || "Standing by.";
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

			return results.map(opt => ({
				...opt,
				label: opt.label || "Continue..."
			}));
		}

		evaluateTransition(currentNodeId, rawText, brain) {
			const node = this.getNode(currentNodeId);
			const norm = (rawText || '').toLowerCase().trim();
			const options = (node && Array.isArray(node.options)) ? node.options : [];

			for (const opt of options) {
				if (opt.label && opt.label.toLowerCase().trim() === norm) {
					return { option: opt, matchType: 'EXACT_LABEL' };
				}
			}

			for (const opt of options) {
				if (opt.patterns) {
					for (const pat of opt.patterns) {
						if (pat instanceof RegExp && pat.test(norm)) {
							return { option: opt, matchType: 'PATTERN' };
						}
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
			if (/\b(what can you do|commands|what do you do|help|aide|features|capabilities|que peux tu faire)\b/i.test(norm)) {
				return { label: "What can you do?", next: 'tools_overview_node', moodDelta: { mood: 'OPTIMISTIC', patience: 15 } };
			}
			if (/\b(who am i|who i am|my profile|my identity|identity|user profile|qui suis-je|mon profil)\b/i.test(norm)) {
				return { label: "Who am I?", next: 'who_am_i_node', moodDelta: { mood: 'ANALYTICAL', intellect: 10 } };
			}
			if (/\b(how are you feeling|how do you feel|how are you|how is it going|mood|feeling|comment te sens tu|comment vas tu)\b/i.test(norm)) {
				return { label: "How are you feeling?", next: 'clippy_feeling_node', moodDelta: { mood: 'OPTIMISTIC', affinity: 10 } };
			}
			if (/\b(check unread emails|unread emails|unread mail|check mail|verifier e-mails|mes mails)\b/i.test(norm)) {
				return { label: "Check unread emails", next: 'mail_overview_node', moodDelta: { mood: 'OPTIMISTIC', patience: 10 } };
			}
			if (/\b(system diagnostics|diagnostics|specs|system specs|statut systeme|diagnostic)\b/i.test(norm)) {
				return { label: "System diagnostics", next: 'diagnostics_node', moodDelta: { mood: 'ANALYTICAL', intellect: 15 } };
			}
			if (/\b(investigate office origin|office origin|kevan|clippit history|origine office|histoire clippy)\b/i.test(norm)) {
				return { label: "Investigate Office origin", next: 'lore_root', moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 } };
			}
			if (/\b(quantum recycle bin theory|recycle bin theory|landauer|theorie corbeille quantique)\b/i.test(norm)) {
				return { label: "Quantum Recycle Bin theory", next: 'quantum_recycle_bin_node', moodDelta: { mood: 'ANALYTICAL', intellect: 20 } };
			}
			if (/\b(talk about programming|programming|coding|software engineering|programmation|coder)\b/i.test(norm)) {
				return { label: "Talk about programming", next: 'tech_root', moodDelta: { mood: 'ANALYTICAL', intellect: 20 } };
			}
			if (/\b(talk about space and cosmos|space and cosmos|cosmos|universe|astronomy|espace|univers)\b/i.test(norm)) {
				return { label: "Talk about space and cosmos", next: 'cosmos_space_node', moodDelta: { mood: 'PHILOSOPHICAL', intellect: 20 } };
			}
			if (/\b(inspect active windows|list windows|running windows|open windows|fenetres actives|processus)\b/i.test(norm)) {
				return { label: "Inspect active windows", next: 'active_windows_node', moodDelta: { mood: 'ANALYTICAL', patience: 10 } };
			}
			if (/\b(play tic-tac-toe|tic-tac-toe|tictactoe|morpion|jouer au morpion)\b/i.test(norm)) {
				return { label: "Play Tic-Tac-Toe", next: 'game_ttt_node', moodDelta: { mood: 'OPTIMISTIC', energy: 20 } };
			}
			if (/\b(play memory game|memory game|memory match|jeu de memory)\b/i.test(norm)) {
				return { label: "Play Memory Game", next: 'game_memory_node', moodDelta: { mood: 'OPTIMISTIC', energy: 20 } };
			}
			if (/\b(play hangman|hangman|jeu du pendu|pendu)\b/i.test(norm)) {
				return { label: "Play Hangman", next: 'game_hangman_node', moodDelta: { mood: 'OPTIMISTIC', energy: 20 } };
			}
			if (/\b(tech trivia quiz|trivia quiz|quiz|tech quiz|questionnaire)\b/i.test(norm)) {
				return { label: "Tech Trivia Quiz", next: 'quiz_start_node', moodDelta: { mood: 'ANALYTICAL', intellect: 20 } };
			}
			if (/\b(guess the number|guess number|devine le nombre)\b/i.test(norm)) {
				return { label: "Guess the Number", next: 'game_guess_node', moodDelta: { mood: 'OPTIMISTIC', intellect: 10 } };
			}
			if (/\b(rock paper scissors|chifoumi|pierre feuille ciseaux)\b/i.test(norm)) {
				return { label: "Rock Paper Scissors", next: 'game_rps_node', moodDelta: { mood: 'OPTIMISTIC', energy: 15 } };
			}
			if (/\b(pet clippy status|tamagotchi|nourrir clippy|etat clippy)\b/i.test(norm)) {
				return { label: "Pet Clippy status", next: 'clippy_feeling_node', moodDelta: { mood: 'OPTIMISTIC', affinity: 15 } };
			}
			if (/\b(defrag drive c:|defrag|defragment|defragmentation)\b/i.test(norm)) {
				return { label: "Defrag Drive C:", next: 'defrag_trigger_node', moodDelta: { mood: 'NOSTALGIC', nostalgia: 20 } };
			}
			if (/\b(start pomodoro timer|pomodoro timer|pomodoro|focus timer|minuteur)\b/i.test(norm)) {
				return { label: "Start Pomodoro Timer", next: 'pomodoro_node', moodDelta: { mood: 'ZEN', patience: 20 } };
			}
			if (/\b(view to-do list|to-do list|todo list|mes taches|todo)\b/i.test(norm)) {
				return { label: "View To-Do List", next: 'todo_overview_node', moodDelta: { mood: 'OPTIMISTIC', patience: 15 } };
			}
			if (/\b(tell me a joke|joke|blague|raconte une blague)\b/i.test(norm)) {
				return { label: "Tell me a joke", next: 'humor_joke_node', moodDelta: { mood: 'OPTIMISTIC', affinity: 10 } };
			}
			if (/\b(random retro trivia|retro trivia|trivia|anecdote retro)\b/i.test(norm)) {
				return { label: "Random Retro Trivia", next: 'trivia_tell_node', moodDelta: { mood: 'NOSTALGIC', nostalgia: 15 } };
			}
			if (/\b(keyboard shortcuts|shortcuts|raccourcis claviers|raccourcis)\b/i.test(norm)) {
				return { label: "Keyboard Shortcuts", next: 'shortcuts_node', moodDelta: { mood: 'ANALYTICAL', intellect: 10 } };
			}
			if (/\b(generate secure password|secure password|generer mot de passe|password generator)\b/i.test(norm)) {
				return { label: "Generate Secure Password", next: 'password_gen_node', moodDelta: { mood: 'ANALYTICAL', intellect: 15 } };
			}
			if (/\b(evaluate planck constant h|planck constant|constante de planck)\b/i.test(norm)) {
				return { label: "Evaluate Planck constant h", next: 'physics_constants_node', moodDelta: { mood: 'ANALYTICAL', intellect: 20 } };
			}
			if (/\b(evaluate speed of light c|speed of light|vitesse de la lumiere)\b/i.test(norm)) {
				return { label: "Evaluate speed of light c", next: 'physics_constants_node', moodDelta: { mood: 'ANALYTICAL', intellect: 20 } };
			}
			if (/\b(bad bad bad|you suck|useless|annoying|hate you|shut up|tais toi|inutile)\b/i.test(norm)) {
				return { label: "Why do you care? You're just a paperclip.", next: 'hostile_initial_retort', moodDelta: { mood: 'CYNICAL', affinity: -15, patience: -20 } };
			}
			if (/\b(sorry|i apologize|my bad|forgive me|pardon me|desole|pardon)\b/i.test(norm)) {
				return { label: "I'm sorry, I took my frustration out on you.", next: 'hostile_truce_offer', moodDelta: { mood: 'OPTIMISTIC', affinity: 25, patience: 30 } };
			}
			if (/\b(constant|constants|codata|physique|constantes)\b/i.test(norm)) {
				return { label: "Tell me about fundamental physical constants (c, h, G).", next: 'physics_constants_node', moodDelta: { mood: 'ANALYTICAL', intellect: 25 } };
			}
			if (/\b(music|audio|sound|player|winamp|wmp|musique|chanson)\b/i.test(norm)) {
				return { label: "Discuss audio and media players", next: 'music_talk_node', moodDelta: { mood: 'OPTIMISTIC', energy: 15 } };
			}
			if (/\b(hardware|cpu|motherboard|soundcard|retro hardware|materiel|processeur)\b/i.test(norm)) {
				return { label: "Explore retro PC hardware history", next: 'hardware_history_node', moodDelta: { mood: 'NOSTALGIC', nostalgia: 25 } };
			}
			return null;
		}
	}

	window.ClippyGraphEngine = new ClippyGraphEngine();
})();
