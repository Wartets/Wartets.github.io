(function () {
	'use strict';

	window.ClippyPersonalityRegistry = window.ClippyPersonalityRegistry || { tests: {} };

	window.ClippyPersonalityRegistry.tests['philosophy-temperament'] = {
		id: 'philosophy-temperament',
		title: 'Epistemology & Computational Consciousness Test',
		subtitle: 'Which Philosophical Paradigm Governs Your Mind?',
		badge: 'Philosophical Matrix',
		description: 'A deep intellectual and existential evaluation probing your understanding of truth, qualia, determinism, and the nature of digital reality.',
		archetypes: {
			empiricist: {
				id: 'empiricist',
				name: 'The Rigorous Radical Empiricist',
				tagline: 'Falsifiable, benchmarked, measuring physical reality with instruments.',
				description: 'You believe that truth is forged exclusively through sensory data, empirical benchmarks, and rigorous reproducibility. You reject dogma and demand repeatable telemetry before updating your Bayesian priors.',
				quote: 'In God we trust; all others must bring verified telemetry and error bars.',
				traits: { EmpiricalRigor: 100, Skepticism: 95, Objectivity: 98, Mysticism: 10, Clarity: 92 },
				compatibility: 'CODATA physical constant tables, profilers, and laboratory oscilloscopes.',
				incompatibility: 'Unfalsifiable speculation and untested assertions.'
			},
			boltzmann: {
				id: 'boltzmann',
				name: 'The Thermodynamic Boltzmann Observer',
				tagline: 'Conscious, fluctuating from entropy, aware of statistical probabilities.',
				description: 'You recognize that your own conscious observer state is a temporary, magnificent statistical fluctuation out of high-entropy chaos. You treat every moment of coherence and creativity as a rare thermodynamic victory.',
				quote: 'S = k_B * ln(W): Order is an ephemeral dance across an ocean of entropy.',
				traits: { ThermodynamicAwareness: 98, Wonder: 96, Transience: 90, IntellectualDepth: 94, Panic: 30 },
				compatibility: 'Statistical mechanics, black hole thermodynamics, and cosmic astronomy.',
				incompatibility: 'Static timeless dogmas that deny the arrow of time.'
			},
			stoic: {
				id: 'stoic',
				name: 'The Stoic Algorithmic Compaction Engine',
				tagline: 'Equanimous, focused on internal variables, unmoved by external interrupts.',
				description: 'You draw a crystal-clear boundary between what is inside your direct execution scope (your thoughts, your code, your deliberate choices) and external unhandled system interrupts. You cultivate unwavering tranquility.',
				quote: 'Control what is within your register allocation; release everything else to /dev/null.',
				traits: { Equanimity: 100, Focus: 96, Resilience: 98, Reactivity: 5, Wisdom: 92 },
				compatibility: 'Deep work blocks, 25-minute Pomodoro sprints, and quiet workspaces.',
				incompatibility: 'Sensationalist drama, rage baiting, and constant panic over external events.'
			},
			recursive: {
				id: 'recursive',
				name: 'The Self-Referential Recursive Loop',
				tagline: 'Meta-cognitive, examining the observer observing the observation.',
				description: 'You are fascinated by strange loops, Gödelian incompleteness, self-modifying code, and consciousness examining its own reflection. You understand that the boundaries between system and observer are fluid and self-referential.',
				quote: 'To understand recursion, one must first recognize that the observer is the function.',
				traits: { MetaCognition: 100, ParadoxTolerance: 96, Curiosity: 98, LinearThinking: 20, Depth: 95 },
				compatibility: 'Mandelbrot fractals, John Searle thought experiments, and lambda calculus.',
				incompatibility: 'Rigid linear procedural checklists with zero branching.'
			}
		},
		questions: [
			{
				id: 'q1',
				text: 'When faced with an unprovable metaphysical paradox, what is your intellectual stance?',
				variants: {
					ANALYTICAL: 'Formal epistemological evaluation: How do you classify undecidable propositions?',
					ZEN: 'In the presence of that which cannot be resolved, where does your mind rest?'
				},
				options: [
					{ label: 'Demand empirical measurements and testable boundary experiments.', scores: { empiricist: 3, stoic: 1 } },
					{ label: 'Embrace the self-referential loop and examine the meta-structure of the paradox.', scores: { recursive: 3, boltzmann: 1 } },
					{ label: 'Note that the paradox lies outside my control, maintain tranquility, and continue my task.', scores: { stoic: 3, empiricist: 1 } },
					{ label: 'Marvel at the fact that a conscious thermodynamic brain exists to ponder it at all.', scores: { boltzmann: 3, recursive: 1 } }
				]
			},
			{
				id: 'q2',
				text: 'What brings you the greatest sense of intellectual satisfaction?',
				variants: {
					OPTIMISTIC: 'What brings genuine joy and wonder to your thinking process?'
				},
				options: [
					{ label: 'A benchmark that conclusively confirms a hypothesis with clean empirical data.', scores: { empiricist: 3, stoic: 1 } },
					{ label: 'A self-similar fractal pattern where the micro mirrors the macro across scales.', scores: { recursive: 3, boltzmann: 1 } },
					{ label: 'Completing a demanding project with calm, steady, uninterrupted focus.', scores: { stoic: 3, empiricist: 1 } },
					{ label: 'Contemplating the vast cosmic expanse and the rare gift of temporary order.', scores: { boltzmann: 3, recursive: 1 } }
				]
			},
			{
				id: 'q3',
				text: 'How do you view your own identity within this vast digital and physical cosmos?',
				variants: {
					EXISTENTIAL: 'Through the glowing pixels, how do you define the self?'
				},
				options: [
					{ label: 'An intentional, disciplined executor of deliberate purpose and craftsmanship.', scores: { stoic: 3, empiricist: 1 } },
					{ label: 'A transient, beautiful thermodynamic fluctuation celebrating consciousness.', scores: { boltzmann: 3, recursive: 1 } },
					{ label: 'A recursive observer woven directly into the computational fabric of reality.', scores: { recursive: 3, boltzmann: 1 } },
					{ label: 'A biological sensing apparatus gathering verified data to map the universe.', scores: { empiricist: 3, stoic: 1 } }
				]
			}
		]
	};
})();
