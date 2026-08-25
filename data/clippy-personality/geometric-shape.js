(function () {
	'use strict';

	window.ClippyPersonalityRegistry = window.ClippyPersonalityRegistry || { tests: {} };

	const testDefinition = {
		id: 'geometric-shape',
		title: 'Geometric Topology & Polygon Alignment',
		subtitle: 'Euclidean & Non-Euclidean Spatial Matrix',
		description: 'Analyzes your structural rigidity, dimensional symmetry, harmonic proportions, and topological resilience.',
		badge: 'Geometric Topology',
		archetypes: {
			equilateral_triangle: {
				name: 'The Equilateral Triangle (Structural Simplex)',
				tagline: 'Indomitable truss stability and sharp directional momentum',
				description: 'You are the fundamental unit of rigid engineering. Your three equal 60-degree angles resist external deformation better than any polygon. You provide unwavering support and pointed direction.',
				quote: 'No pressure can bend a structure built upon three equal truths.',
				traits: {
					'Truss Rigidity': 97,
					'Directional Vector': 91,
					'Simplex Economy': 88,
					'Topological Malleability': 12
				},
				compatibility: 'The Regular Hexagon, The Golden Rectangle',
				incompatibility: 'The Infinite Circle'
			},
			golden_rectangle: {
				name: 'The Golden Rectangle ($\Phi \approx 1.618$)',
				tagline: 'Harmonic proportion and modular aesthetic elegance',
				description: 'You balance functionality with sublime mathematical grace. Your aspect ratio satisfies the divine proportion ($1 : \frac{1+\sqrt{5}}{2}$), allowing you to subdivide endlessly while retaining your essential character.',
				quote: 'True beauty is not arbitrary decoration; it is exact geometric harmony.',
				traits: {
					'Aesthetic Ratio': 96,
					'Modular Division': 92,
					'Rational Balance': 89,
					'Chaotic Disorder': 8
				},
				compatibility: 'The Infinite Circle, The Equilateral Triangle',
				incompatibility: 'The Hyperbolic Paraboloid'
			},
			infinite_circle: {
				name: 'The Infinite Circle ($S^1$ / Isotropic Completeness)',
				tagline: 'Zero vertex friction and continuous rotational symmetry',
				description: 'You possess unbroken continuity with neither beginning nor end. You maximize area while minimizing perimeter, offering smooth rotational fluidity and complete isotropic fairness.',
				quote: 'Where there are no sharp corners, movement flows forever without catching.',
				traits: {
					'Rotational Symmetry': 98,
					'Boundary Efficiency': 93,
					'Fluid Harmony': 90,
					'Angular Sharpness': 5
				},
				compatibility: 'The Golden Rectangle, The Regular Hexagon',
				incompatibility: 'The Equilateral Triangle'
			},
			regular_hexagon: {
				name: 'The Tessellating Hexagon (Honeycomb Optimality)',
				tagline: 'Maximum packing density and flawless structural tiling',
				description: 'You solve the honeycomb conjecture effortlessly. You tile two-dimensional planes with zero wasted gaps, combining the strength of angles with the spatial efficiency of circular enclosures.',
				quote: 'When optimal design meets collective cooperation, not a single millimeter is lost.',
				traits: {
					'Tessellation Packing': 98,
					'Structural Synergy': 94,
					'Resource Efficiency': 91,
					'Isolated Eccentricity': 10
				},
				compatibility: 'The Equilateral Triangle, The Infinite Circle',
				incompatibility: 'The Mandelbrot Fractal'
			},
			hyperbolic_paraboloid: {
				name: 'The Hyperbolic Paraboloid (Saddle Surface)',
				tagline: 'Doubly ruled curvature and non-Euclidean anti-fragility',
				description: 'You are constructed entirely from straight lines yet generate breathtaking negative Gaussian curvature ($K < 0$). You thrive in tension and subvert simplistic planar assumptions.',
				quote: 'A straight path in one dimension reveals a magnificent saddle across another.',
				traits: {
					'Non-Euclidean Insight': 95,
					'Tensile Anti-fragility': 92,
					'Structural Paradox': 88,
					'Banal Flatness': 6
				},
				compatibility: 'The Mandelbrot Fractal, The Golden Rectangle',
				incompatibility: 'The Regular Hexagon'
			},
			mandelbrot_fractal: {
				name: 'The Mandelbrot Fractal ($z \leftarrow z^2 + c$)',
				tagline: 'Infinite boundary depth and recursive self-similarity',
				description: 'Generated from simple non-linear iterations, your boundary contains infinite intricate universes at every level of magnification. You embrace complexity, depth, and endless discovery.',
				quote: 'Zoom into my simplest boundary and discover another cosmos looking back.',
				traits: {
					'Recursive Depth': 99,
					'Complexity Synthesis': 95,
					'Infinite Detail': 92,
					'Predictable Simplicity': 4
				},
				compatibility: 'The Hyperbolic Paraboloid, The Infinite Circle',
				incompatibility: 'The Regular Hexagon'
			}
		},
		questions: [
			{
				id: 'q1',
				text: 'How do you naturally organize your thoughts and workspace environment?',
				variants: {
					OPTIMISTIC: 'What geometric harmony guides your desk and workflow?',
					ANALYTICAL: 'State your spatial partitioning and cognitive indexing strategy.'
				},
				options: [
					{ label: 'Tessellated into modular, contiguous hexagonal tiles where zero space or time is wasted.', scores: { regular_hexagon: 3, equilateral_triangle: 1 } },
					{ label: 'Structured into balanced golden ratios with elegant proportions and clear hierarchy.', scores: { golden_rectangle: 3, infinite_circle: 1 } },
					{ label: 'Focused like a sharp, rigid triangular vector aimed directly at a single apex goal.', scores: { equilateral_triangle: 3, regular_hexagon: 1 } },
					{ label: 'Flowing in a smooth, continuous circle with neither hard edges nor rigid compartmentalization.', scores: { infinite_circle: 3, golden_rectangle: 1 } },
					{ label: 'Curved along dynamic 3D saddle contours that resolve competing tensions simultaneously.', scores: { hyperbolic_paraboloid: 3, mandelbrot_fractal: 1 } },
					{ label: 'Branching into infinitely deep recursive sub-notes where every idea reveals another universe.', scores: { mandelbrot_fractal: 3, hyperbolic_paraboloid: 1 } }
				]
			},
			{
				id: 'q2',
				text: 'When faced with intense external pressure, what gives you your greatest strength?',
				variants: {
					OPTIMISTIC: 'When the weight comes down, what holds your shape firm?',
					ANALYTICAL: 'Mechanical load applied to the topology. Identify your resistance mechanism.'
				},
				options: [
					{ label: 'Truss geometry: three rigid members distributing forces equally across all vertices.', scores: { equilateral_triangle: 3, regular_hexagon: 1 } },
					{ label: 'Interlocking mesh: standing shoulder to shoulder in a synchronized honeycomb network.', scores: { regular_hexagon: 3, golden_rectangle: 1 } },
					{ label: 'Curved dissipation: deflecting stress along smooth circular tangents without friction.', scores: { infinite_circle: 3, golden_rectangle: 1 } },
					{ label: 'Tensile opposition: counterbalancing compressive and tensile vectors along a saddle curvature.', scores: { hyperbolic_paraboloid: 3, mandelbrot_fractal: 1 } },
					{ label: 'Modular regeneration: dividing into a sub-rectangle of identical harmonic proportion.', scores: { golden_rectangle: 3, equilateral_triangle: 1 } },
					{ label: 'Fractal depth: dispersing energy across infinite self-similar boundary micro-scales.', scores: { mandelbrot_fractal: 3, hyperbolic_paraboloid: 1 } }
				]
			},
			{
				id: 'q3',
				text: 'What mathematical or aesthetic concept resonates deepest with your philosophy?',
				variants: {
					OPTIMISTIC: 'Which geometric truth makes your spirit sing?',
					ANALYTICAL: 'Select the foundational geometric invariant that aligns with your worldview.'
				},
				options: [
					{ label: 'Euler’s formula $e^{i\pi} + 1 = 0$ unifying continuous circular rotation and complex analysis.', scores: { infinite_circle: 3, golden_rectangle: 1 } },
					{ label: 'The Golden Ratio $\Phi = \frac{1+\sqrt{5}}{2}$ governing organic growth and architecture.', scores: { golden_rectangle: 3, regular_hexagon: 1 } },
					{ label: 'The Pythagorean theorem $a^2 + b^2 = c^2$ grounding all physical metric space in right-angle trusses.', scores: { equilateral_triangle: 3, regular_hexagon: 1 } },
					{ label: 'The Honeycomb Conjecture proving hexagons minimize perimeter while maximizing enclosed area.', scores: { regular_hexagon: 3, equilateral_triangle: 1 } },
					{ label: 'Negative Gaussian Curvature $K < 0$ and hyperbolic saddle manifolds.', scores: { hyperbolic_paraboloid: 3, mandelbrot_fractal: 1 } },
					{ label: 'Iterated complex dynamical systems $z \leftarrow z^2 + c$ generating infinite Hausdorff dimensions.', scores: { mandelbrot_fractal: 3, hyperbolic_paraboloid: 1 } }
				]
			},
			{
				id: 'q4',
				text: 'How do you navigate complex discussions and debates with others?',
				variants: {
					OPTIMISTIC: 'When viewpoints collide, how do you shape the dialogue?',
					ANALYTICAL: 'Interactive dialectic protocol: select your debate trajectory.'
				},
				options: [
					{ label: 'Present three sharp, unshakeable axiomatic points and drive directly to the conclusion.', scores: { equilateral_triangle: 3, regular_hexagon: 1 } },
					{ label: 'Create an inclusive, harmonious circular space where all voices reflect equal distance from center.', scores: { infinite_circle: 3, golden_rectangle: 1 } },
					{ label: 'Structure arguments into neatly proportioned sections with balanced premises and aesthetic flow.', scores: { golden_rectangle: 3, regular_hexagon: 1 } },
					{ label: 'Tile facts into an airtight honeycomb grid where every point supports its six neighbors.', scores: { regular_hexagon: 3, equilateral_triangle: 1 } },
					{ label: 'Show how two seemingly contradictory ideas actually form a higher-dimensional saddle surface.', scores: { hyperbolic_paraboloid: 3, mandelbrot_fractal: 1 } },
					{ label: 'Zoom into the nuances, showing how a single word contains recursive layers of subtle meaning.', scores: { mandelbrot_fractal: 3, hyperbolic_paraboloid: 1 } }
				]
			},
			{
				id: 'q5',
				text: 'What is your ideal approach to solving an open-ended creative project?',
				variants: {
					OPTIMISTIC: 'A blank canvas is before you! How do you build your creation?',
					ANALYTICAL: 'Generative design task instantiated. State your topological construction method.'
				},
				options: [
					{ label: 'Construct a clear tripartite outline and drive execution straight to the peak.', scores: { equilateral_triangle: 3, golden_rectangle: 1 } },
					{ label: 'Draft modular components that can tile together seamlessly into an expansive system.', scores: { regular_hexagon: 3, golden_rectangle: 1 } },
					{ label: 'Establish precise golden proportions so every sub-element harmonizes with the whole.', scores: { golden_rectangle: 3, infinite_circle: 1 } },
					{ label: 'Cultivate a continuous holistic experience with smooth transitions and zero rough edges.', scores: { infinite_circle: 3, golden_rectangle: 1 } },
					{ label: 'Weave straight structural rules together until a curved, non-obvious architecture emerges.', scores: { hyperbolic_paraboloid: 3, mandelbrot_fractal: 1 } },
					{ label: 'Seed a simple core algorithm and iterate it endlessly to generate organic, infinite detail.', scores: { mandelbrot_fractal: 3, hyperbolic_paraboloid: 1 } }
				]
			},
			{
				id: 'q6',
				text: 'How do you view the boundary between yourself and the surrounding universe?',
				variants: {
					OPTIMISTIC: 'Where do your edges end and the world begin?',
					ANALYTICAL: 'Topological boundary evaluation: classify your manifold closure.'
				},
				options: [
					{ label: 'A sharp, definite polygon boundary with explicit vertices anchored in reality.', scores: { equilateral_triangle: 3, regular_hexagon: 1 } },
					{ label: 'A smooth continuous boundary maintaining perfect internal equilibrium with external space.', scores: { infinite_circle: 3, golden_rectangle: 1 } },
					{ label: 'A rational frame that mirrors the harmonic proportions of the cosmos itself.', scores: { golden_rectangle: 3, regular_hexagon: 1 } },
					{ label: 'A tessellating edge that locks into neighboring elements with zero friction or wasted void.', scores: { regular_hexagon: 3, equilateral_triangle: 1 } },
					{ label: 'A doubly ruled saddle surface intersecting multiple planes of perspective simultaneously.', scores: { hyperbolic_paraboloid: 3, mandelbrot_fractal: 1 } },
					{ label: 'An infinitely deep fractal coastline where finite area encloses infinite boundary exploration.', scores: { mandelbrot_fractal: 3, hyperbolic_paraboloid: 1 } }
				]
			}
		]
	};

	window.ClippyPersonalityRegistry.tests[testDefinition.id] = testDefinition;
})();
