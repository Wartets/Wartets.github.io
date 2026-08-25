(function () {
	'use strict';

	const ScienceTreeNodes = {
		S001: {
			id: 'S001',
			text: "Welcome to the fundamental physics and empirical sciences seminar. The universe is governed by verifiable conservation laws, invariant physical constants, and rigorous mathematical frameworks. Where shall we direct our inquiry?",
			responses: [
				{ text: "Welcome to the fundamental physics and empirical sciences seminar. The universe is governed by verifiable conservation laws, invariant physical constants, and rigorous mathematical frameworks. Where shall we direct our inquiry?", conditions: { moods: ['ANALYTICAL', 'OPTIMISTIC'] }, weight: 25 },
				{ text: "Empirical observation registers calibrated. From subatomic quantum fields to cosmic spacetime curvature, nature operates on verifiable principles. What branch shall we inspect?", conditions: { moods: ['ZEN', 'ANALYTICAL'] }, weight: 20 },
				{ text: "Observing reality with measured precision: every phenomenon on this workstation and across the cosmos resolves into verifiable mathematics. State your domain of inquiry.", conditions: { moods: ['SKEPTICAL', 'EXISTENTIAL'] }, weight: 20 }
			],
			options: [
				{ label: "Thermodynamics, Entropy, and Heat Engines.", category: 'INQUIRE', patterns: [/thermodynamics|entropy|carnot|heat engine|boltzmann/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S002' },
				{ label: "Quantum Mechanics and Wave-Particle Duality.", category: 'INQUIRE', patterns: [/quantum|wave function|schrodinger|planck|heisenberg/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'S031' },
				{ label: "Special and General Relativity, Spacetime Curvature.", category: 'INQUIRE', patterns: [/relativity|spacetime|einstein|gravity|curvature/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'S061' },
				{ label: "Classical Electrodynamics and Maxwell's Equations.", category: 'INQUIRE', patterns: [/electromagnetism|maxwell|light|fields|optics/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S091' },
				{ label: "Stellar Astrophysics and Cosmology.", category: 'INQUIRE', patterns: [/astrophysics|cosmology|stars|fusion|cmb/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S121' },
				{ label: "Information Theory and Thermodynamics of Computation.", category: 'INQUIRE', patterns: [/information theory|shannon|landauer|complexity/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S181' }
			]
		},
		S002: {
			id: 'S002',
			text: "Thermodynamics governs energy transformations and macroscopic equilibrium. The First Law establishes energy conservation (dU = dQ - dW), while the Second Law dictates that in an isolated system, thermodynamic entropy never decreases (dS >= 0).",
			options: [
				{ label: "Explore the Carnot Heat Engine and theoretical efficiency limits.", category: 'INQUIRE', patterns: [/carnot|efficiency|engine/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S003' },
				{ label: "Inspect Boltzmann's statistical entropy equation (S = k_B ln Ω).", category: 'INQUIRE', patterns: [/boltzmann|statistical|omega|microstates/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S004' },
				{ label: "Evaluate the Boltzmann constant (k_B) and SI units.", category: 'SERIOUS', patterns: [/constant|k_b|value/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'S005' },
				{ label: "Explore Maxwell's Demon and information erasure.", category: 'INQUIRE', patterns: [/demon|landauer|erasure/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S006' }
			]
		},
		S003: {
			id: 'S003',
			text: "Nicolas Léonard Sadi Carnot demonstrated in 1824 that the maximum theoretical thermal efficiency of any heat engine operating between hot reservoir T_H and cold reservoir T_C is exactly eta = 1 - (T_C / T_H), with temperatures expressed in Kelvin.",
			options: [
				{ label: "How does the Carnot cycle prevent perpetual motion machines?", category: 'INQUIRE', patterns: [/perpetual motion|violation|second law/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S007' },
				{ label: "Explain the four stages of the Carnot cycle (isothermal and adiabatic).", category: 'INQUIRE', patterns: [/four stages|isothermal|adiabatic/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S008' },
				{ label: "Connect Carnot efficiency to statistical mechanics.", category: 'INQUIRE', patterns: [/statistical mechanics|boltzmann/i], next: 'S004' }
			]
		},
		S004: {
			id: 'S004',
			text: "Ludwig Boltzmann unified microscopic phase space with macroscopic heat: S = k_B ln(Omega), where Omega is the multiplicity of accessible microstates corresponding to the observed macroscopic thermodynamic state.",
			options: [
				{ label: "What is a microstate vs a macrostate in phase space?", category: 'INQUIRE', patterns: [/microstate|macrostate|phase space/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S009' },
				{ label: "How does this explain the thermodynamic arrow of time?", category: 'PHILOSOPHICAL', patterns: [/arrow of time|time|irreversibility/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 20 }, next: 'S010' },
				{ label: "How does Landauer's principle derive from this formula?", category: 'INQUIRE', patterns: [/landauer|computation|bits/i], next: 'S011' }
			]
		},
		S005: {
			id: 'S005',
			text: "The Boltzmann constant k_B is defined exactly in the International System of Units (SI) since the 2019 redefinition as k_B = 1.380649 x 10^-23 J K^-1 (Joules per Kelvin). It relates average kinetic energy per degree of freedom to absolute temperature.",
			options: [
				{ label: "Show equipartition theorem (<E> = 1/2 k_B T per degree).", category: 'INQUIRE', patterns: [/equipartition|degree of freedom/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S012' },
				{ label: "Review Universal Gas Constant R = N_A * k_B.", category: 'INQUIRE', patterns: [/gas constant|avogadro|r/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: 'S013' },
				{ label: "Return to thermodynamics overview.", category: 'AGREE', patterns: [/return|thermodynamics/i], next: 'S002' }
			]
		},
		S006: {
			id: 'S006',
			text: "James Clerk Maxwell proposed a thought experiment in 1867: a miniature demon sorting fast and slow gas molecules across a partition without work. Rolf Landauer and Charles Bennett resolved it: sorting requires information storage; resetting the demon's memory dissipates k_B T ln(2) of heat.",
			options: [
				{ label: "Derive the thermodynamic cost of erasing one bit: dQ = k_B T ln(2).", category: 'INQUIRE', patterns: [/derive|one bit|cost/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S011' },
				{ label: "Connect this to the Quantum Recycle Bin theory.", category: 'INQUIRE', patterns: [/recycle bin|quantum bin/i], next: 'quantum_recycle_bin_node' },
				{ label: "Return to thermodynamics seminar.", category: 'AGREE', patterns: [/return|seminar/i], next: 'S002' }
			]
		},
		S007: {
			id: 'S007',
			text: "Perpetual motion machines of the second kind seek to convert 100% of ambient thermal energy into useful mechanical work without a colder reservoir (T_C = 0 K). Because absolute zero is asymptotically unreachable (Third Law), eta is strictly less than 1.",
			options: [
				{ label: "Explain the Third Law of Thermodynamics (Nernst Theorem).", category: 'INQUIRE', patterns: [/third law|nernst|absolute zero/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S014' },
				{ label: "Explore Gibbs Free Energy and chemical spontaneity (dG = dH - T dS).", category: 'INQUIRE', patterns: [/gibbs|enthalpy|chemical/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S201' },
				{ label: "Back to Carnot analysis.", category: 'AGREE', patterns: [/carnot/i], next: 'S003' }
			]
		},
		S008: {
			id: 'S008',
			text: "The four steps of the Carnot cycle:\n1. Reversible isothermal expansion at T_H (heat absorbed Q_H).\n2. Isentropic adiabatic expansion (temperature drops to T_C).\n3. Reversible isothermal compression at T_C (heat rejected Q_C).\n4. Isentropic adiabatic compression (temperature restored to T_H).",
			options: [
				{ label: "Calculate cycle net work: W = Q_H - Q_C = Q_H (1 - T_C/T_H).", category: 'SERIOUS', patterns: [/net work|calculate/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S015' },
				{ label: "Explore entropy changes across the four reversible paths.", category: 'INQUIRE', patterns: [/entropy changes|reversible paths/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S016' },
				{ label: "Return to thermodynamics menu.", category: 'AGREE', patterns: [/return/i], next: 'S002' }
			]
		},
		S009: {
			id: 'S009',
			text: "A macrostate is defined by bulk observable variables (Pressure P, Volume V, Temperature T). A microstate is an exact point in 6N-dimensional phase space specifying exact position (x, y, z) and momentum (px, py, pz) vectors for every particle.",
			options: [
				{ label: "Explain why high-multiplicity macrostates dominate equilibrium.", category: 'INQUIRE', patterns: [/multiplicity|equilibrium/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S017' },
				{ label: "Examine Liouville's theorem and phase space conservation.", category: 'INQUIRE', patterns: [/liouville|phase space volume/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S018' },
				{ label: "Back to Boltzmann statistical mechanics.", category: 'AGREE', patterns: [/boltzmann/i], next: 'S004' }
			]
		},
		S010: {
			id: 'S010',
			text: "The macroscopic arrow of time exists because our early universe began in a state of exceptionally low gravitational and thermal entropy following the Big Bang. Statistical mechanics dictates that isolated systems evolve toward configurations of higher probability.",
			options: [
				{ label: "How does this connect to cosmological expansion?", category: 'INQUIRE', patterns: [/cosmological expansion|hubble/i], next: 'S121' },
				{ label: "Explore microscopic time-reversal symmetry in fundamental laws.", category: 'INQUIRE', patterns: [/time reversal|symmetry|t-symmetry/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S019' },
				{ label: "Return to thermodynamics overview.", category: 'AGREE', patterns: [/return/i], next: 'S002' }
			]
		},
		S011: {
			id: 'S011',
			text: "Landauer's Principle proves that information is physical. Resetting a 1-bit memory register from state {0, 1} to deterministic state {0} compresses the system's phase space by factor of 2, reducing entropy by dS = -k_B ln(2) and releasing dQ = k_B T ln(2) of heat.",
			options: [
				{ label: "Calculate Landauer limit at room temperature (T = 293.15 K).", category: 'SERIOUS', patterns: [/room temperature|calculate/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S020' },
				{ label: "Explore Reversible Computing architectures (Toffoli / Fredkin gates).", category: 'INQUIRE', patterns: [/reversible computing|toffoli|fredkin/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S182' },
				{ label: "Return to thermodynamics menu.", category: 'AGREE', patterns: [/return/i], next: 'S002' }
			]
		},
		S012: {
			id: 'S012',
			text: "The Equipartition Theorem states that for a classical system in thermal equilibrium at temperature T, each independent quadratic degree of freedom in the Hamiltonian contributes exactly (1/2) k_B T to the average internal thermal energy.",
			options: [
				{ label: "Explain why monoatomic gases have Cv = (3/2) R.", category: 'INQUIRE', patterns: [/monoatomic|cv|3\/2/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S021' },
				{ label: "How did quantum mechanics resolve the ultraviolet catastrophe in heat capacity?", category: 'INQUIRE', patterns: [/heat capacity|einstein|debye/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S022' },
				{ label: "Back to physical constants.", category: 'AGREE', patterns: [/constants/i], next: 'S005' }
			]
		},
		S013: {
			id: 'S013',
			text: "The Universal Gas Constant R = N_A * k_B = 8.314462618... J mol^-1 K^-1 governs ideal gases via PV = nRT. Avogadro's constant N_A = 6.02214076 x 10^23 mol^-1 defines the number of constituent particles per mole.",
			options: [
				{ label: "Derive the Ideal Gas Law from microscopic kinetic theory.", category: 'INQUIRE', patterns: [/ideal gas law|kinetic theory/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S023' },
				{ label: "Inspect Real Gas corrections (Van der Waals equation).", category: 'INQUIRE', patterns: [/van der waals|real gas/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S024' },
				{ label: "Return to physics constants index.", category: 'AGREE', patterns: [/return|constants/i], next: 'physics_constants_node' }
			]
		},
		S014: {
			id: 'S014',
			text: "The Third Law of Thermodynamics (Nernst Postulate) states that as temperature approaches absolute zero (T -> 0 K), the entropy of a pure crystalline substance approaches a universal minimum constant S_0 = 0, because only one ground quantum microstate exists (Omega = 1).",
			options: [
				{ label: "Explore Bose-Einstein Condensation near absolute zero.", category: 'INQUIRE', patterns: [/bose-einstein|condensate|bec/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S025' },
				{ label: "How is absolute zero approached experimentally (laser cooling)?", category: 'INQUIRE', patterns: [/laser cooling|evaporative/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S026' },
				{ label: "Back to thermodynamics overview.", category: 'AGREE', patterns: [/return/i], next: 'S002' }
			]
		},
		S015: {
			id: 'S015',
			text: "In a closed Carnot cycle, the net work performed equals the enclosed area on a Pressure-Volume (P-V) or Temperature-Entropy (T-S) diagram: W_net = oint P dV = oint T dS = (T_H - T_C) * Delta S.",
			options: [
				{ label: "Why is the area on a T-S diagram a rectangle for Carnot cycles?", category: 'INQUIRE', patterns: [/t-s diagram|rectangle/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S016' },
				{ label: "Explore the Otto and Diesel thermodynamic cycles.", category: 'INQUIRE', patterns: [/otto|diesel/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S027' },
				{ label: "Return to Carnot analysis.", category: 'AGREE', patterns: [/carnot/i], next: 'S003' }
			]
		},
		S016: {
			id: 'S016',
			text: "For any reversible cyclic process, the cyclic integral of dQ_rev / T equals exactly zero (oint dQ_rev / T = 0). This proves that entropy S is a true state function independent of the path taken.",
			options: [
				{ label: "Examine Clausius's Inequality for irreversible cycles: oint dQ / T <= 0.", category: 'INQUIRE', patterns: [/clausius|inequality/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S028' },
				{ label: "Explore state functions vs path functions.", category: 'INQUIRE', patterns: [/state function|path function/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S029' },
				{ label: "Return to thermodynamics menu.", category: 'AGREE', patterns: [/return/i], next: 'S002' }
			]
		},
		S017: {
			id: 'S017',
			text: "For a gas with 10^23 particles, configurations with uniform density occupy over 99.9999...% of the phase space volume. Spontaneous concentration in one half of a container is not forbidden by mechanics, but its probability is on the order of 1 in 10^(10^23).",
			options: [
				{ label: "Explain Poincaré Recurrence Theorem and recurrence time scales.", category: 'INQUIRE', patterns: [/poincare|recurrence/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S030' },
				{ label: "Connect this to Boltzmann's H-theorem.", category: 'INQUIRE', patterns: [/h-theorem|boltzmann/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S004' },
				{ label: "Back to phase space analysis.", category: 'AGREE', patterns: [/phase space/i], next: 'S009' }
			]
		},
		S018: {
			id: 'S018',
			text: "Liouville's theorem states that for a Hamiltonian conservative system, the phase space distribution density rho is constant along trajectories: d rho / dt = 0. Microscopic information is never crushed or created in classical phase space.",
			options: [
				{ label: "How does this relate to quantum unitarity in Hilbert space?", category: 'INQUIRE', patterns: [/unitarity|hilbert space|quantum/i], next: 'S031' },
				{ label: "Explore Poincaré recurrence theorem.", category: 'INQUIRE', patterns: [/poincare/i], next: 'S030' },
				{ label: "Back to statistical mechanics.", category: 'AGREE', patterns: [/statistical mechanics/i], next: 'S004' }
			]
		},
		S019: {
			id: 'S019',
			text: "Microscopic equations (Newton's F = m d2x/dt2, Maxwell's electrodynamics, and Schrödinger's equation) are invariant under time reversal t -> -t. Irreversibility is not a property of the fundamental equations, but an emergent property of statistical boundary conditions.",
			options: [
				{ label: "Examine CPT theorem in quantum field theory.", category: 'INQUIRE', patterns: [/cpt theorem|parity|charge/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'S045' },
				{ label: "Return to entropy and arrow of time.", category: 'AGREE', patterns: [/arrow of time/i], next: 'S010' },
				{ label: "Proceed to Quantum Mechanics seminar.", category: 'INQUIRE', patterns: [/quantum mechanics/i], next: 'S031' }
			]
		},
		S020: {
			id: 'S020',
			text: "At room temperature T = 293.15 K:\nE_min = k_B * T * ln(2) = (1.380649 x 10^-23) * 293.15 * 0.693147 = 2.806 x 10^-21 Joules (approx 0.0175 eV per erased bit). Modern CPUs operate at roughly 100 to 1,000 times this thermodynamic floor.",
			options: [
				{ label: "How do modern CMOS gates dissipate energy above Landauer limit?", category: 'INQUIRE', patterns: [/cmos|dissipate|capacitance/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S183' },
				{ label: "Explore Reversible Computing (zero theoretical dissipation).", category: 'INQUIRE', patterns: [/reversible computing/i], next: 'S182' },
				{ label: "Back to Landauer Principle.", category: 'AGREE', patterns: [/landauer/i], next: 'S011' }
			]
		},
		S031: {
			id: 'S031',
			text: "Quantum mechanics describes microphysical systems via complex state vectors |psi> in a complex Hilbert space, evolving deterministically under the linear time-dependent Schrödinger equation: i hbar (d/dt)|psi> = H_hat |psi>.",
			options: [
				{ label: "Wave-Particle Duality and the de Broglie wavelength (lambda = h / p).", category: 'INQUIRE', patterns: [/de broglie|wavelength|duality/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S032' },
				{ label: "Heisenberg Uncertainty Principle (sigma_x * sigma_p >= hbar / 2).", category: 'INQUIRE', patterns: [/heisenberg|uncertainty/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S033' },
				{ label: "The Born Rule and the Measurement Problem.", category: 'INQUIRE', patterns: [/born rule|measurement|collapse/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'S034' },
				{ label: "Quantum Entanglement and Bell's Theorem.", category: 'INQUIRE', patterns: [/entanglement|bell|epr/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'S035' }
			]
		},
		S032: {
			id: 'S032',
			text: "Louis de Broglie proposed in 1924 that all matter exhibits wave properties with wavelength lambda = h / p = h / (m v). Verified experimentally by Davisson-Germer in 1927 via electron diffraction through nickel crystal lattices.",
			options: [
				{ label: "Calculate de Broglie wavelength of an electron at 100 eV.", category: 'SERIOUS', patterns: [/calculate|electron|100 ev/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S036' },
				{ label: "Explore the Double-Slit Experiment with single particles.", category: 'INQUIRE', patterns: [/double slit|interference/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S037' },
				{ label: "Return to Quantum Mechanics menu.", category: 'AGREE', patterns: [/return|quantum/i], next: 'S031' }
			]
		},
		S033: {
			id: 'S033',
			text: "Werner Heisenberg proved in 1927 that conjugate observable operators do not commute: [x_hat, p_hat] = i hbar. By the Robertson-Schrödinger relation, standard deviations obey sigma_A * sigma_B >= (1/2) |<[A_hat, B_hat]>|, establishing an ontological lower bound.",
			options: [
				{ label: "Why is uncertainty a mathematical property of Fourier conjugate pairs?", category: 'INQUIRE', patterns: [/fourier|conjugate pairs/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S038' },
				{ label: "Examine Energy-Time uncertainty: Delta E * Delta t >= hbar / 2.", category: 'INQUIRE', patterns: [/energy-time|virtual particles/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S039' },
				{ label: "Back to Quantum overview.", category: 'AGREE', patterns: [/quantum/i], next: 'S031' }
			]
		},
		S034: {
			id: 'S034',
			text: "Max Born formulated the probability interpretation: when observing observable A with discrete eigenstates |a_n>, the probability of obtaining eigenvalue a_n is P(a_n) = |<a_n | psi>|^2. The measurement problem investigates how unitary evolution transitions into definite experimental outcomes.",
			options: [
				{ label: "Explore Environmental Decoherence (loss of quantum phase coherence).", category: 'INQUIRE', patterns: [/decoherence|environment|density matrix/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S040' },
				{ label: "Compare Copenhagen Interpretation with Everett's Many-Worlds.", category: 'PHILOSOPHICAL', patterns: [/copenhagen|many-worlds|everett/i], moodDelta: { mood: 'EXISTENTIAL', existentialism: 20 }, next: 'S041' },
				{ label: "Examine Schrödinger's Cat thought experiment and density matrices.", category: 'INQUIRE', patterns: [/schrodinger's cat|cat/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S042' }
			]
		},
		S035: {
			id: 'S035',
			text: "Quantum entanglement occurs when a composite state in tensor product space H_A (x) H_B cannot be factored into product states |psi_A> (x) |psi_B>. In 1964, John Stewart Bell proved that local hidden variable theories satisfy inequalities that quantum mechanics violates.",
			options: [
				{ label: "Inspect the CHSH inequality (|S| <= 2 for local realism, up to 2*sqrt(2) in QM).", category: 'INQUIRE', patterns: [/chsh|inequality|tsirelson/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S043' },
				{ label: "Why does quantum entanglement forbid faster-than-light signaling?", category: 'INQUIRE', patterns: [/faster than light|no-communication theorem/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S044' },
				{ label: "Review Alain Aspect's and subsequent loophole-free Bell tests.", category: 'INQUIRE', patterns: [/alain aspect|experiments/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S046' }
			]
		},
		S036: {
			id: 'S036',
			text: "For an electron (m_e = 9.10938 x 10^-31 kg) accelerated across 100 V:\nKinetic energy E_k = 100 eV = 1.602 x 10^-17 J.\nMomentum p = sqrt(2 m_e E_k) = 5.40 x 10^-24 kg m/s.\nde Broglie wavelength lambda = h / p = 1.226 x 10^-10 m = 0.123 nm (the exact scale of atomic spacing in crystal lattices).",
			options: [
				{ label: "Verify Planck constant h in SI units.", category: 'SERIOUS', patterns: [/planck constant/i], actionTrigger: 'action_constant_h', next: 'physics_constants_node' },
				{ label: "How does Transmission Electron Microscopy (TEM) leverage this?", category: 'INQUIRE', patterns: [/tem|microscope/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S047' },
				{ label: "Return to wave-particle duality.", category: 'AGREE', patterns: [/wave-particle/i], next: 'S032' }
			]
		},
		S037: {
			id: 'S037',
			text: "In double-slit experiments with electrons, photons, or fullerenes (C60) fired one particle at a time, each particle registers as a localized point on the detector, yet the statistical distribution over thousands of detections reconstructs the wave interference pattern: I(theta) ~ cos2(pi d sin(theta) / lambda).",
			options: [
				{ label: "What happens when a detector measures which slit the particle traversed?", category: 'INQUIRE', patterns: [/which slit|detector|which-way/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S048' },
				{ label: "Explore Quantum Eraser and Delayed Choice experiments (Wheeler).", category: 'INQUIRE', patterns: [/quantum eraser|delayed choice/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'S049' },
				{ label: "Back to Quantum overview.", category: 'AGREE', patterns: [/quantum/i], next: 'S031' }
			]
		},
		S038: {
			id: 'S038',
			text: "In functional analysis, position representation psi(x) and momentum representation phi(p) are exact continuous Fourier transforms of one another: phi(p) = (1/sqrt(2 pi hbar)) int psi(x) e^(-i p x / hbar) dx. A wave packet cannot simultaneously have compact support in both time and frequency domains.",
			options: [
				{ label: "Explore the Fourier Transform in mathematics.", category: 'INQUIRE', patterns: [/fourier transform/i], next: 'fourier_transform_node' },
				{ label: "Calculate Gaussian wave packet minimal uncertainty product.", category: 'INQUIRE', patterns: [/gaussian wave packet|minimum/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S050' },
				{ label: "Return to Uncertainty Principle.", category: 'AGREE', patterns: [/uncertainty/i], next: 'S033' }
			]
		},
		S039: {
			id: 'S039',
			text: "The energy-time uncertainty relation Delta E * Delta t >= hbar / 2 describes state lifetimes: an unstable quantum state with lifetime tau has an energy linewidth Gamma = hbar / tau. This governs spectral line broadening in atomic physics.",
			options: [
				{ label: "Examine natural linewidth vs Doppler broadening in spectra.", category: 'INQUIRE', patterns: [/linewidth|doppler/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S051' },
				{ label: "Explore Casimir Effect and vacuum zero-point energy fluctuations.", category: 'INQUIRE', patterns: [/casimir|zero-point/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S052' },
				{ label: "Back to uncertainty principle.", category: 'AGREE', patterns: [/uncertainty/i], next: 'S033' }
			]
		},
		S040: {
			id: 'S040',
			text: "Quantum decoherence occurs through unitary interaction between system S and huge environment E. Tracing out environmental degrees of freedom transforms the reduced density matrix rho_S: off-diagonal coherence terms decay exponentially e^(-t / tau_d), eliminating macroscopic quantum superpositions.",
			options: [
				{ label: "Why is decoherence timescale tau_d immensely fast for macroscopic objects?", category: 'INQUIRE', patterns: [/timescale|macroscopic/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S053' },
				{ label: "How does decoherence solve the classical transition without wavefunction collapse?", category: 'INQUIRE', patterns: [/classical transition|collapse/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S054' },
				{ label: "Back to measurement problem.", category: 'AGREE', patterns: [/measurement problem/i], next: 'S034' }
			]
		},
		S061: {
			id: 'S061',
			text: "Albert Einstein revolutionised physics in 1905 and 1915:\n- Special Relativity: the speed of light c is invariant across all inertial frames; spacetime interval ds2 = c2 dt2 - dx2 - dy2 - dz2 is conserved.\n- General Relativity: gravity is intrinsic spacetime curvature governed by G_mu_nu + Lambda g_mu_nu = (8 pi G / c4) T_mu_nu.",
			options: [
				{ label: "Special Relativity: Lorentz Transformation & Time Dilation.", category: 'INQUIRE', patterns: [/special relativity|lorentz|time dilation/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S062' },
				{ label: "Mass-Energy Equivalence: E2 = (p c)2 + (m0 c2)2.", category: 'INQUIRE', patterns: [/mass-energy|e=mc2/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S063' },
				{ label: "General Relativity: Equivalence Principle & Spacetime Curvature.", category: 'INQUIRE', patterns: [/general relativity|equivalence principle|curvature/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'S064' },
				{ label: "Black Holes and the Schwarzschild Metric (r_s = 2GM / c2).", category: 'INQUIRE', patterns: [/black holes|schwarzschild/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'S065' },
				{ label: "Gravitational Waves and Quadrupole Radiation (LIGO/Virgo).", category: 'INQUIRE', patterns: [/gravitational waves|ligo|virgo/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S066' }
			]
		},
		S062: {
			id: 'S062',
			text: "Lorentz factor gamma = 1 / sqrt(1 - v2/c2) dictates relativistic kinematics:\n- Time dilation: Delta t' = gamma * Delta t_0\n- Length contraction: L' = L_0 / gamma\n- Relativistic velocity addition: u' = (u - v) / (1 - u*v/c2)\nObserved daily in atmospheric muon decay lifetimes.",
			options: [
				{ label: "Explain the atmospheric muon lifetime experiment.", category: 'INQUIRE', patterns: [/muon|experiment/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S067' },
				{ label: "Evaluate invariant speed of light constant c.", category: 'SERIOUS', patterns: [/speed of light/i], actionTrigger: 'action_constant_c', next: 'physics_constants_node' },
				{ label: "Explore the Twin Paradox and non-inertial frame asymmetry.", category: 'INQUIRE', patterns: [/twin paradox/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S068' }
			]
		},
		S063: {
			id: 'S063',
			text: "The complete relativistic dispersion relation is E2 = (p c)2 + (m_0 c2)2. For stationary bodies (p = 0), this simplifies to E_0 = m_0 c2. For massless particles like photons (m_0 = 0), momentum and energy are directly proportional: E = p c = h nu.",
			options: [
				{ label: "Calculate mass defect and binding energy in nuclear fusion.", category: 'INQUIRE', patterns: [/mass defect|binding energy|fusion/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S069' },
				{ label: "Explore relativistic invariant mass (m2 c4 = E2 - p2 c2).", category: 'INQUIRE', patterns: [/invariant mass/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S070' },
				{ label: "Back to Relativity overview.", category: 'AGREE', patterns: [/relativity/i], next: 'S061' }
			]
		},
		S064: {
			id: 'S064',
			text: "Einstein's Equivalence Principle: locally, the effects of a uniform gravitational field are physically indistinguishable from a uniformly accelerating reference frame. Free-falling observers feel zero local gravitational force (g_effective = 0).",
			options: [
				{ label: "How did this lead to the Geodesic Equation of motion?", category: 'INQUIRE', patterns: [/geodesic equation|christoffel/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'S071' },
				{ label: "Explore Gravitational Redshift and GPS clock corrections.", category: 'INQUIRE', patterns: [/gravitational redshift|gps/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S072' },
				{ label: "Examine Einstein's Field Equations (G_mu_nu = 8 pi G / c4 T_mu_nu).", category: 'INQUIRE', patterns: [/field equations|tensor/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'S073' }
			]
		},
		S065: {
			id: 'S065',
			text: "The Schwarzschild radius r_s = (2 G M) / c2 marks the event horizon of a non-rotating spherically symmetric mass M. For Earth (M = 5.97 x 10^24 kg), r_s is approximately 8.87 mm; for the Sun (M = 1.989 x 10^30 kg), r_s is 2.95 km.",
			options: [
				{ label: "Calculate gravitational time dilation near event horizon: sqrt(1 - r_s / r).", category: 'INQUIRE', patterns: [/time dilation near horizon/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S074' },
				{ label: "Explore Black Hole Thermodynamics and Hawking radiation.", category: 'INQUIRE', patterns: [/hawking radiation|black hole thermodynamics/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'black_hole_thermodynamics_node' },
				{ label: "Inspect Kerr Metric for rotating black holes (ergosphere).", category: 'INQUIRE', patterns: [/kerr|rotating|ergosphere/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'S075' }
			]
		},
		S066: {
			id: 'S066',
			text: "Gravitational waves are transverse quadrupolar metric perturbations h_mu_nu propagating at c. Detected directly on September 14, 2015 by LIGO (GW150914) from the merger of two black holes (36 M_sun and 29 M_sun), converting 3 solar masses into pure gravitational wave energy in 0.2 s.",
			options: [
				{ label: "How do laser interferometers measure strains on the order of delta L / L = 10^-21?", category: 'INQUIRE', patterns: [/interferometer|strain|10^-21/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S076' },
				{ label: "Explore quadrupole formula for gravitational wave luminosity (dE/dt ~ d3I/dt3 squared).", category: 'INQUIRE', patterns: [/quadrupole formula|luminosity/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'S077' },
				{ label: "Back to Relativity menu.", category: 'AGREE', patterns: [/relativity/i], next: 'S061' }
			]
		},
		S091: {
			id: 'S091',
			text: "James Clerk Maxwell unified electricity and magnetism in 1865 into four differential equations:\n1. div E = rho / epsilon_0 (Gauss's Law)\n2. div B = 0 (Gauss's Law for Magnetism)\n3. curl E = - dB / dt (Faraday's Law of Induction)\n4. curl B = mu_0 J + mu_0 epsilon_0 dE / dt (Ampère-Maxwell Law)",
			options: [
				{ label: "Derive the speed of electromagnetic waves: c = 1 / sqrt(mu_0 * epsilon_0).", category: 'INQUIRE', patterns: [/speed of light|c = 1/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S092' },
				{ label: "Explore the Poynting Vector (S = (1 / mu_0) E x B) and energy flux.", category: 'INQUIRE', patterns: [/poynting vector|energy flux/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S093' },
				{ label: "Inspect Lorentz Force Law: F = q (E + v x B).", category: 'INQUIRE', patterns: [/lorentz force/i], next: 'lorentz_force_node' },
				{ label: "Examine Waveguides and Electromagnetic Cutoff Frequencies.", category: 'INQUIRE', patterns: [/waveguides|cutoff/i], next: 'waveguide_propagation_node' }
			]
		},
		S092: {
			id: 'S092',
			text: "Taking the curl of Faraday's Law in vacuum (rho = 0, J = 0):\ncurl(curl E) = grad(div E) - nabla2 E = - d(curl B)/dt.\nSubstituting Ampère's Law yields the wave equation nabla2 E = mu_0 epsilon_0 (d2E / dt2). This identifies electromagnetic propagation speed as c = 1 / sqrt(mu_0 epsilon_0) = 299,792,458 m/s.",
			options: [
				{ label: "Evaluate permittivity epsilon_0 and permeability mu_0 constants.", category: 'SERIOUS', patterns: [/epsilon_0|mu_0/i], actionTrigger: 'action_status', next: 'physics_constants_node' },
				{ label: "Explore the Classical Wave Equation in Mathematics.", category: 'INQUIRE', patterns: [/wave equation/i], next: 'wave_equation_node' },
				{ label: "Return to Electromagnetism overview.", category: 'AGREE', patterns: [/electromagnetism/i], next: 'S091' }
			]
		},
		S093: {
			id: 'S093',
			text: "The Poynting vector S = (1 / mu_0) * (E x B) measures the directional energy flux density (Watts per square meter) of an electromagnetic wave. Time-averaged irradiance is <S> = (1/2) c epsilon_0 E_0^2.",
			options: [
				{ label: "Calculate radiation pressure: P_rad = <S> / c (absorbing surface).", category: 'INQUIRE', patterns: [/radiation pressure/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S094' },
				{ label: "Explore solar sails and stellar radiation dynamics.", category: 'INQUIRE', patterns: [/solar sails|stellar/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S095' },
				{ label: "Back to Maxwell's equations.", category: 'AGREE', patterns: [/maxwell/i], next: 'S091' }
			]
		},
		S121: {
			id: 'S121',
			text: "Stellar astrophysics and physical cosmology study the formation, fusion cycles, and evolutionary remnants of stars and the observable universe:\n- Stellar equilibrium: hydrostatic balance between gravity and thermonuclear fusion pressure.\n- Cosmic Microwave Background (CMB): thermal blackbody radiation at 2.725 Kelvin.",
			options: [
				{ label: "Stellar Nucleosynthesis: Proton-Proton Chain and CNO Cycle.", category: 'INQUIRE', patterns: [/nucleosynthesis|proton-proton|cno/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S122' },
				{ label: "Stellar Remnants: White Dwarfs and Chandrasekhar Limit (1.4 M_sun).", category: 'INQUIRE', patterns: [/white dwarf|chandrasekhar/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S123' },
				{ label: "Neutron Stars, Pulsars, and Degeneracy Pressure.", category: 'INQUIRE', patterns: [/neutron star|pulsar|degeneracy/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S124' },
				{ label: "Cosmic Microwave Background and Big Bang Nucleosynthesis.", category: 'INQUIRE', patterns: [/cmb|big bang/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S125' }
			]
		},
		S122: {
			id: 'S122',
			text: "In main-sequence stars like our Sun (core T ~ 1.5 x 10^7 K), the Proton-Proton (p-p) chain fuses four protons (1H) into one helium-4 nucleus (4He), two positrons, two electron neutrinos, and gamma photons, converting 0.71% of rest mass into energy (Delta m * c2).",
			options: [
				{ label: "Explain quantum tunneling through the Coulomb barrier in solar fusion.", category: 'INQUIRE', patterns: [/quantum tunneling|coulomb/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S126' },
				{ label: "Compare with the CNO cycle in higher-mass stars (T > 1.7 x 10^7 K).", category: 'INQUIRE', patterns: [/cno cycle|high mass/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S127' },
				{ label: "Return to Astrophysics menu.", category: 'AGREE', patterns: [/astrophysics/i], next: 'S121' }
			]
		},
		S123: {
			id: 'S123',
			text: "Subrahmanyan Chandrasekhar proved in 1930 that electron degeneracy pressure (Pauli exclusion principle for non-relativistic electrons) can support a white dwarf star only up to M_limit = 1.44 M_sun. Above this, relativistic electron collapse forces core collapse into a neutron star or black hole.",
			options: [
				{ label: "Explore Type Ia Supernovae as standard cosmological candles.", category: 'INQUIRE', patterns: [/type ia|supernovae|standard candles/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S128' },
				{ label: "Examine Fermi energy and degenerate electron gas equations.", category: 'INQUIRE', patterns: [/fermi energy|degenerate/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S129' },
				{ label: "Back to stellar astrophysics.", category: 'AGREE', patterns: [/astrophysics/i], next: 'S121' }
			]
		},
		S124: {
			id: 'S124',
			text: "Neutron stars pack 1.4 to 2.1 solar masses into a sphere of radius ~10 to 12 km, supported by neutron degeneracy pressure and strong nuclear repulsive forces. Density reaches 10^17 kg/m3 (comparable to atomic nuclei). Crust magnetic fields in magnetars exceed 10^11 Tesla.",
			options: [
				{ label: "Explore Tolman-Oppenheimer-Volkoff (TOV) maximum mass limit (~2.2 M_sun).", category: 'INQUIRE', patterns: [/tov|oppenheimer/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S130' },
				{ label: "Inspect Pulsar timing and emission mechanisms.", category: 'INQUIRE', patterns: [/pulsar timing/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S131' },
				{ label: "Return to stellar astrophysics overview.", category: 'AGREE', patterns: [/astrophysics/i], next: 'S121' }
			]
		},
		S125: {
			id: 'S125',
			text: "The Cosmic Microwave Background (CMB), discovered by Penzias and Wilson in 1964, is the thermal relic radiation from the photon decoupling epoch at recombination (redshift z ~ 1100, t ~ 380,000 years). Measured by COBE/WMAP/Planck to be an exact blackbody at T = 2.72548 +/- 0.00057 K.",
			options: [
				{ label: "Explore Planck's Law of blackbody radiation (B_nu(T)).", category: 'INQUIRE', patterns: [/planck's law|blackbody/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S132' },
				{ label: "Examine CMB acoustic temperature anisotropies (delta T / T ~ 10^-5).", category: 'INQUIRE', patterns: [/anisotropies|acoustic peaks/i], moodDelta: { mood: 'ANALYTICAL', intellect: 25 }, next: 'S133' },
				{ label: "Return to Astrophysics overview.", category: 'AGREE', patterns: [/astrophysics/i], next: 'S121' }
			]
		},
		S181: {
			id: 'S181',
			text: "Claude Shannon founded mathematical Information Theory in 1948:\n- Shannon Entropy: H(X) = - sum p(x_i) log2 p(x_i) measures average information content.\n- Channel Capacity Theorem: C = B * log2(1 + SNR) defines the upper bound of error-free data transmission over a noisy channel.",
			options: [
				{ label: "Derive Shannon Entropy and compare with Boltzmann thermodynamic entropy.", category: 'INQUIRE', patterns: [/shannon entropy|boltzmann/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S184' },
				{ label: "Shannon-Hartley Theorem: Channel capacity in presence of Gaussian noise.", category: 'INQUIRE', patterns: [/shannon-hartley|channel capacity/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S185' },
				{ label: "Kolmogorov Algorithmic Complexity and Incompressibility.", category: 'INQUIRE', patterns: [/kolmogorov|algorithmic complexity/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S186' },
				{ label: "Return to main scientific seminar.", category: 'AGREE', patterns: [/return|main/i], next: 'S001' }
			]
		},
		S184: {
			id: 'S184',
			text: "Shannon's information entropy H = - sum p_i log_2(p_i) and Gibbs/Boltzmann physical entropy S = - k_B sum p_i ln(p_i) are mathematically isomorphic. Physical entropy is simply the Shannon information missing from the microscopic observer's knowledge of the exact microstate.",
			options: [
				{ label: "Explore Landauer's limit connecting bits and Joules.", category: 'INQUIRE', patterns: [/landauer/i], next: 'S011' },
				{ label: "Inspect data compression theorems (Huffman and arithmetic coding).", category: 'INQUIRE', patterns: [/compression|huffman/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S187' },
				{ label: "Back to information theory.", category: 'AGREE', patterns: [/information theory/i], next: 'S181' }
			]
		},
		S201: {
			id: 'S201',
			text: "Chemical Thermodynamics and Gibbs Free Energy:\nDelta G = Delta H - T * Delta S\n- If Delta G < 0, the reaction is thermodynamically spontaneous (exergonic).\n- If Delta G > 0, the process requires external work (endergonic).\n- At chemical equilibrium, Delta G = 0 and Delta G^0 = -R T ln(K_eq).",
			options: [
				{ label: "Explore the Arrhenius Equation for reaction rate constants: k = A e^(-E_a / (RT)).", category: 'INQUIRE', patterns: [/arrhenius|activation energy/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S202' },
				{ label: "Examine Le Chatelier's Principle and chemical equilibrium shifts.", category: 'INQUIRE', patterns: [/le chatelier|equilibrium/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S203' },
				{ label: "Return to thermodynamics overview.", category: 'AGREE', patterns: [/thermodynamics/i], next: 'S002' }
			]
		},
		S202: {
			id: 'S202',
			text: "Svante Arrhenius formalized reaction kinetics in 1889: k = A * exp(-E_a / (R * T)). Activation energy E_a represents the minimum kinetic energy reactant molecules must possess along the reaction coordinate to overcome the transition state barrier.",
			options: [
				{ label: "How do catalysts lower E_a without altering Delta G?", category: 'INQUIRE', patterns: [/catalysts|lower activation/i], moodDelta: { mood: 'ANALYTICAL', intellect: 15 }, next: 'S204' },
				{ label: "Connect to Maxwell-Boltzmann molecular speed distribution.", category: 'INQUIRE', patterns: [/maxwell-boltzmann/i], moodDelta: { mood: 'ANALYTICAL', intellect: 20 }, next: 'S205' },
				{ label: "Return to chemical thermodynamics.", category: 'AGREE', patterns: [/chemical thermodynamics/i], next: 'S201' }
			]
		},
		S220: {
			id: 'S220',
			text: "The scientific enterprise is united by reproducibility, empirical falsifiability (Karl Popper), and mathematical rigor. Every equation and constant discussed is backed by peer-reviewed experimental verification across laboratories worldwide.",
			options: [
				{ label: "Restart fundamental physics and empirical sciences seminar.", category: 'AGREE', patterns: [/restart|science seminar/i], moodDelta: { mood: 'OPTIMISTIC', affinity: 20 }, next: 'S001' },
				{ label: "Inspect physical dimensional analysis tool.", category: 'SERIOUS', patterns: [/dimensional analysis/i], actionTrigger: 'action_dimensional_analysis', next: 'activity_dimensional_analysis_node' },
				{ label: "Review fundamental physical constants.", category: 'SERIOUS', patterns: [/physical constants/i], next: 'physics_constants_node' },
				{ label: "Manage workspace tasks and research notes.", category: 'SERIOUS', patterns: [/tasks|todo/i], actionTrigger: 'show_todos', next: 'user_state_good' }
			]
		}
	};

	for (let i = 21; i <= 30; i++) {
		const id = `S0${i}`;
		const nextId = i < 30 ? `S0${i + 1}` : 'S002';
		const prevId = `S0${i - 1}`;
		ScienceTreeNodes[id] = {
			id,
			text: `Thermodynamics & Statistical Physics Analysis [Node ${i - 20}/10]: Evaluating phase equilibria, enthalpy balances, and microscopic canonical partition functions Z = sum e^(-E_i / k_B T).`,
			responses: [
				{ text: `Thermodynamics & Statistical Physics Analysis [Node ${i - 20}/10]: Evaluating phase equilibria, enthalpy balances, and microscopic canonical partition functions Z = sum e^(-E_i / k_B T).`, conditions: { moods: ['ANALYTICAL', 'ZEN'] }, weight: 20 }
			],
			options: [
				{ label: `Advance thermodynamic analysis to sub-topic ${i - 19}.`, category: 'AGREE', patterns: [/advance|continue|proceed/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: nextId },
				{ label: "Return to previous thermodynamic derivation.", category: 'SERIOUS', patterns: [/previous|return/i], next: prevId },
				{ label: "Evaluate Boltzmann constant k_B.", category: 'SERIOUS', patterns: [/boltzmann constant/i], actionTrigger: 'action_status', next: 'physics_constants_node' },
				{ label: "Return to thermodynamics overview.", category: 'AGREE', patterns: [/thermodynamics/i], next: 'S002' }
			]
		};
	}

	for (let i = 41; i <= 60; i++) {
		const id = `S0${i}`;
		const nextId = i < 60 ? `S0${i + 1}` : 'S031';
		const prevId = `S0${i - 1}`;
		ScienceTreeNodes[id] = {
			id,
			text: `Quantum Mechanics & Spectral Decomposition [Module ${i - 40}/20]: Verifying Hermitian operator eigenvalues, orthonormal basis completeness, and unitary propagator U(t) = exp(-i H t / hbar).`,
			responses: [
				{ text: `Quantum Mechanics & Spectral Decomposition [Module ${i - 40}/20]: Verifying Hermitian operator eigenvalues, orthonormal basis completeness, and unitary propagator U(t) = exp(-i H t / hbar).`, conditions: { moods: ['ANALYTICAL'] }, weight: 20 }
			],
			options: [
				{ label: `Advance quantum state verification to step ${i - 39}.`, category: 'AGREE', patterns: [/advance|continue|step/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: nextId },
				{ label: "Review previous quantum operator.", category: 'SERIOUS', patterns: [/previous|review/i], next: prevId },
				{ label: "Evaluate Planck constant h.", category: 'SERIOUS', patterns: [/planck constant/i], actionTrigger: 'action_constant_h', next: 'physics_constants_node' },
				{ label: "Return to Quantum Mechanics menu.", category: 'AGREE', patterns: [/quantum mechanics/i], next: 'S031' }
			]
		};
	}

	for (let i = 71; i <= 90; i++) {
		const id = `S0${i}`;
		const nextId = i < 90 ? `S0${i + 1}` : 'S061';
		const prevId = `S0${i - 1}`;
		ScienceTreeNodes[id] = {
			id,
			text: `Relativistic Spacetime & Curvature Computation [Sector ${i - 70}/20]: Computing Christoffel symbols Gamma^lambda_mu_nu, Riemann curvature tensor R^rho_sigma_mu_nu, and Ricci scalar R.`,
			responses: [
				{ text: `Relativistic Spacetime & Curvature Computation [Sector ${i - 70}/20]: Computing Christoffel symbols Gamma^lambda_mu_nu, Riemann curvature tensor R^rho_sigma_mu_nu, and Ricci scalar R.`, conditions: { moods: ['ANALYTICAL', 'EXISTENTIAL'] }, weight: 20 }
			],
			options: [
				{ label: `Progress spacetime curvature analysis to stage ${i - 69}.`, category: 'AGREE', patterns: [/progress|continue/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: nextId },
				{ label: "Return to previous relativistic metric step.", category: 'SERIOUS', patterns: [/previous|return/i], next: prevId },
				{ label: "Evaluate speed of light c.", category: 'SERIOUS', patterns: [/speed of light/i], actionTrigger: 'action_constant_c', next: 'physics_constants_node' },
				{ label: "Return to Relativity overview.", category: 'AGREE', patterns: [/relativity/i], next: 'S061' }
			]
		};
	}

	for (let i = 94; i <= 120; i++) {
		const id = i < 100 ? `S0${i}` : `S${i}`;
		const nextId = i < 120 ? (i + 1 < 100 ? `S0${i + 1}` : `S${i + 1}`) : 'S091';
		const prevId = i - 1 < 100 ? `S0${i - 1}` : `S${i - 1}`;
		ScienceTreeNodes[id] = {
			id,
			text: `Electrodynamics & Continuous Wave Mechanics [Registry ${i - 93}/27]: Resolving vector potential A and scalar potential phi under Lorenz gauge condition div A + mu_0 epsilon_0 d phi / dt = 0.`,
			responses: [
				{ text: `Electrodynamics & Continuous Wave Mechanics [Registry ${i - 93}/27]: Resolving vector potential A and scalar potential phi under Lorenz gauge condition div A + mu_0 epsilon_0 d phi / dt = 0.`, conditions: { moods: ['ANALYTICAL'] }, weight: 20 }
			],
			options: [
				{ label: `Advance electrodynamic field calculation to step ${i - 92}.`, category: 'AGREE', patterns: [/advance|continue/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: nextId },
				{ label: "Review previous potential derivation.", category: 'SERIOUS', patterns: [/previous|review/i], next: prevId },
				{ label: "Inspect physical constants.", category: 'SERIOUS', patterns: [/physical constants/i], next: 'physics_constants_node' },
				{ label: "Return to Electrodynamics menu.", category: 'AGREE', patterns: [/electrodynamics/i], next: 'S091' }
			]
		};
	}

	for (let i = 134; i <= 180; i++) {
		const id = `S${i}`;
		const nextId = i < 180 ? `S${i + 1}` : 'S121';
		const prevId = `S${i - 1}`;
		ScienceTreeNodes[id] = {
			id,
			text: `Astrophysics & Nuclear Synthesis Pipeline [Stage ${i - 133}/47]: Balancing stellar radiative transfer equations, opacity kappa, and gravitational hydrostatic equilibrium dP / dr = - (G M(r) rho(r)) / r2.`,
			responses: [
				{ text: `Astrophysics & Nuclear Synthesis Pipeline [Stage ${i - 133}/47]: Balancing stellar radiative transfer equations, opacity kappa, and gravitational hydrostatic equilibrium dP / dr = - (G M(r) rho(r)) / r2.`, conditions: { moods: ['ANALYTICAL', 'OPTIMISTIC'] }, weight: 20 }
			],
			options: [
				{ label: `Advance stellar astrophysics model to step ${i - 132}.`, category: 'AGREE', patterns: [/advance|continue/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: nextId },
				{ label: "Return to previous hydrostatic stage.", category: 'SERIOUS', patterns: [/previous|return/i], next: prevId },
				{ label: "Inspect physical dimensional analysis tool.", category: 'SERIOUS', patterns: [/dimensional analysis/i], actionTrigger: 'action_dimensional_analysis', next: 'activity_dimensional_analysis_node' },
				{ label: "Return to Astrophysics overview.", category: 'AGREE', patterns: [/astrophysics/i], next: 'S121' }
			]
		};
	}

	for (let i = 188; i <= 200; i++) {
		const id = `S${i}`;
		const nextId = i < 200 ? `S${i + 1}` : 'S181';
		const prevId = `S${i - 1}`;
		ScienceTreeNodes[id] = {
			id,
			text: `Information Theory & Algorithmic Bounds [Step ${i - 187}/13]: Evaluating channel mutual information I(X; Y) = H(X) - H(X|Y) and Kraft-McMillan inequality for uniquely decodable codes sum 2^(-l_i) <= 1.`,
			responses: [
				{ text: `Information Theory & Algorithmic Bounds [Step ${i - 187}/13]: Evaluating channel mutual information I(X; Y) = H(X) - H(X|Y) and Kraft-McMillan inequality for uniquely decodable codes sum 2^(-l_i) <= 1.`, conditions: { moods: ['ANALYTICAL', 'ZEN'] }, weight: 20 }
			],
			options: [
				{ label: `Progress information analysis to node ${i - 186}.`, category: 'AGREE', patterns: [/progress|continue/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: nextId },
				{ label: "Return to previous information step.", category: 'SERIOUS', patterns: [/previous|return/i], next: prevId },
				{ label: "Open cryptography & cipher tool.", category: 'SERIOUS', patterns: [/cipher|cryptography/i], actionTrigger: 'action_cipher', next: 'activity_cipher_node' },
				{ label: "Return to Information Theory menu.", category: 'AGREE', patterns: [/information theory/i], next: 'S181' }
			]
		};
	}

	for (let i = 206; i <= 219; i++) {
		const id = `S${i}`;
		const nextId = i < 219 ? `S${i + 1}` : 'S220';
		const prevId = `S${i - 1}`;
		ScienceTreeNodes[id] = {
			id,
			text: `Empirical Scientific Methodology & Epistemology [Node ${i - 205}/14]: Verifying hypothesis falsifiability, Bayesian posterior updating P(H|E) = (P(E|H) * P(H)) / P(E), and experimental uncertainty bounds.`,
			responses: [
				{ text: `Empirical Scientific Methodology & Epistemology [Node ${i - 205}/14]: Verifying hypothesis falsifiability, Bayesian posterior updating P(H|E) = (P(E|H) * P(H)) / P(E), and experimental uncertainty bounds.`, conditions: { moods: ['ANALYTICAL', 'OPTIMISTIC'] }, weight: 20 }
			],
			options: [
				{ label: `Advance scientific verification to stage ${i - 204}.`, category: 'AGREE', patterns: [/advance|continue/i], moodDelta: { mood: 'ANALYTICAL', intellect: 10 }, next: nextId },
				{ label: "Return to previous epistemological check.", category: 'SERIOUS', patterns: [/previous|return/i], next: prevId },
				{ label: "Review fundamental physical constants.", category: 'SERIOUS', patterns: [/physical constants/i], next: 'physics_constants_node' },
				{ label: "Conclude scientific seminar.", category: 'AGREE', patterns: [/conclude|finish/i], next: 'S220' }
			]
		};
	}

	if (!window.ClippyTrees) {
		window.ClippyTrees = {};
	}
	window.ClippyTrees.science = ScienceTreeNodes;

	if (window.ClippyKnowledge && window.ClippyKnowledge.DIALOGUE_NODES) {
		Object.assign(window.ClippyKnowledge.DIALOGUE_NODES, ScienceTreeNodes);
	}
})();
