window.mailData = {
	folders: [
		{ id: "inbox", name: "Inbox" },
		{ id: "outbox", name: "Outbox" },
		{ id: "sent", name: "Sent Items" },
		{ id: "drafts", name: "Drafts" },
		{ id: "deleted", name: "Deleted Items" },
		{ id: "spam", name: "Spam" }
	],

	fixedEmails: [
		{
			id: 1,
			folder: "Inbox",
			from: "System Administrator",
			fromAddress: "notifications@github.com",
			subject: "Welcome to your portfolio!",
			date: "2026-08-13 10:00",
			read: false,
			body: `
				<p>Hello Wartets,</p>
				<p>Welcome to your interactive Windows XP portfolio. This is a demonstration of the Outlook Express application.</p>
				<p>You can click on different emails in the list to see their content displayed here in the preview pane.</p>
				<p>Best regards,<br>The Developer</p>
			`
		},
		{
			id: 2,
			folder: "Inbox",
			from: "System Administrator",
			fromAddress: "admin@wartets-security.local",
			subject: "Security Alert: New Login",
			date: "2024-05-19 15:30",
			read: true,
			body: "<p>A new device has logged into your account. If this was not you, please secure your account immediately.</p>"
		},
		{
			id: 3,
			folder: "Inbox",
			from: "SoundCloud",
			fromAddress: "no-reply@soundcloud.com",
			subject: "Your weekly stats are here",
			date: "2024-05-18 08:45",
			read: true,
			body: "<p>You got 1,234 plays this week! Keep up the great work.</p>"
		},
		{
			id: 4,
			folder: "Inbox",
			from: "Université Paris Cité",
			fromAddress: "scolarite@u-paris.fr",
			subject: "Confirmation d'inscription pédagogique",
			date: "2026-07-02 09:15",
			read: true,
			body: `
				<p>Bonjour Colin Bossu Réaubourg,</p>
				<p>Votre inscription pédagogique pour l'année universitaire à venir a bien été enregistrée par les services de scolarité.</p>
				<p>Vous pouvez dès à présent consulter votre emploi du temps provisoire depuis votre espace étudiant.</p>
				<p>Cordialement,<br>La scolarité de l'UFR de Physique</p>
			`
		},
		{
			id: 5,
			folder: "Inbox",
			from: "Overleaf",
			fromAddress: "notifications@overleaf.com",
			subject: "Vous avez été invité à collaborer sur un projet",
			date: "2026-06-11 17:42",
			read: false,
			body: `
				<p>Un collaborateur vous a ajouté au projet Overleaf "Rapport de stage MPQ-QITE".</p>
				<p>Vous pouvez désormais éditer ce document en temps réel avec les autres membres du projet.</p>
				<p>Ouvrez Overleaf pour commencer à collaborer.</p>
			`
		},
		{
			id: 100,
			folder: "Spam",
			from: "Milfeuille.com",
			fromAddress: "newsletter@milfeuille.com",
			subject: "Rencontrez votre douceur parfaite",
			date: "2026-02-19 09:12",
			read: true,
			body: `
				<div style="font-family: sans-serif; color: #333;">
					<h2 style="color: #d63384; margin: 0 0 8px 0;">Salut beauté,</h2>
					<p>Vous méritez le plus délicat des plaisirs - et nous l'avons trouvé pour vous. Milfeuille est le nouveau site de rencontres où les coeurs sensibles rencontrent des gourmands charmants.</p>
					<p style="background: #fff0f6; padding: 8px; border-radius: 6px;">Créez votre profil en 2 minutes et recevez des messages de personnes prêtes à partager pâtisseries et câlins. <a href="https://wartets.github.io/Milfeuille/" target="_blank">Découvrir Milfeuille</a></p>
					<p>Inscrivez-vous maintenant et obtenez <strong>1 mois gratuit</strong> de visibilité premium - seulement pour nos nouvelles membres.</p>
					<p style="margin-top: 12px;">Bisous sucrés,<br><em>L'équipe Milfeuille</em></p>
				</div>
			`
		}
	],

	generateProceduralEmail: function(dateKey, offsetIndex = 0) {
		function djb2(str) {
			let hash = 5381;
			for (let i = 0; i < str.length; i++) {
				hash = ((hash << 5) + hash) + str.charCodeAt(i);
				hash |= 0;
			}
			return hash >>> 0;
		}

		function mulberry32(seed) {
			let a = seed >>> 0;
			return function() {
				a |= 0;
				a = (a + 0x6D2B79F5) | 0;
				let t = Math.imul(a ^ (a >>> 15), 1 | a);
				t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
				return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
			};
		}

		function pick(array, rng) {
			return array[Math.floor(rng() * array.length)];
		}

		function pickInt(min, max, rng) {
			return min + Math.floor(rng() * (max - min + 1));
		}

		function pickFloat(min, max, decimals, rng) {
			const val = min + rng() * (max - min);
			return val.toFixed(decimals);
		}

		function pickMultiple(array, count, rng) {
			const clone = array.slice();
			const result = [];
			const n = Math.min(count, clone.length);
			for (let i = 0; i < n; i++) {
				const idx = Math.floor(rng() * clone.length);
				result.push(clone.splice(idx, 1)[0]);
			}
			return result;
		}

		function formatHex(num, len) {
			return num.toString(16).toUpperCase().padStart(len, "0");
		}

		function fill(template, vars) {
			return template.replace(/\{(\w+)\}/g, (match, key) => (key in vars) ? String(vars[key]) : match);
		}

		function resolveProjectTitle(title) {
			if (typeof title === "string") return title;
			if (title && typeof title === "object") return title.en || title.fr || Object.values(title)[0] || "";
			return "";
		}

		function getProjectRepoNames() {
			try {
				if (typeof projects === "undefined") return [];
				return projects.flat()
					.filter(p => typeof p === "object" && p !== null && p.github && p.title)
					.map(p => resolveProjectTitle(p.title))
					.filter(Boolean);
			} catch (error) {
				return [];
			}
		}

		function getLibraryDocumentTitles() {
			try {
				if (typeof window.libraryData === "undefined" || !window.libraryData.documents) return [];
				return window.libraryData.documents
					.filter(d => d.show !== false && d.title)
					.map(d => (d.title && typeof d.title === "object") ? (d.title.en || d.title.fr || Object.values(d.title)[0]) : d.title)
					.filter(Boolean);
			} catch (error) {
				return [];
			}
		}

		const fallbackRepoNames = [
			"Lenia GPU Simulator",
			"Turbulence Simulation",
			"TikZ Generator",
			"N-Body-Simulation",
			"FDTD Wave Simulator",
			"Diffusion-Limited Aggregation",
			"Computational Chemistry",
			"Origami Axiomatic Fold Engine",
			"2D Navier-Stokes Lattice Boltzmann Solver",
			"Symplectic Hamiltonian Integrator",
			"WebGPU Non-Linear Wavepacket Simulator"
		];

		const fallbackPaperTitles = [
			"Entangled Photon Pair Generation in Periodically Poled Waveguides",
			"Symplectic Invariants and KAM Tori Stability in Chaotic N-Body Dynamics",
			"Continuous Morphogenesis and Soliton Collisions in Extended Lenia Automata",
			"Two-Dimensional Kraichnan Turbulence Cascades via Lattice Boltzmann Method",
			"Exact Gauge Invariance Preservation in Discrete Non-Abelian Field Solvers",
			"Quantum State Tomography of Polarized Biphotons in Integrated Nanophotonics"
		];

		const repoNames = getProjectRepoNames().length ? getProjectRepoNames() : fallbackRepoNames;
		const paperTitles = getLibraryDocumentTitles().length ? getLibraryDocumentTitles() : fallbackPaperTitles;

		const physicsTopics = [
			"cavity quantum electrodynamics",
			"topological insulators and Majorana edge states",
			"non-equilibrium statistical mechanics",
			"quantum state tomography of Bell states",
			"renormalization group flow in quantum field theories",
			"symplectic integrators for relativistic geodesics",
			"Bose-Einstein condensates in optical lattices",
			"hydrodynamic quantum analog systems",
			"path integrals on curved Riemannian manifolds",
			"fractional quantum Hall edge excitations",
			"spontaneous parametric down-conversion in nonlinear crystals",
			"continuous cellular automata and non-equilibrium steady states",
			"enstrophy cascades in 2D forced Navier-Stokes turbulence",
			"thin-plate spline surface interpolation on Riemannian manifolds",
			"Pound-Drever-Hall laser stabilization in high-finesse optical cavities"
		];

		const simulationKernels = [
			"compute_lenia_convolution_multichannel_fp32<<<grid, threads, smem>>>(field_in, field_out, kernel_weights, dt);",
			"integrate_symplectic_forest_ruth_step<<<dim3(64, 64), 256>>>(q_coords, p_momenta, masses, gravitational_const, body_count);",
			"lattice_boltzmann_d2q9_collide_stream<<<blocks, threads>>>(distribution_functions, macroscopic_density, velocity_field, tau_relaxation);",
			"fdtd_wave_pml_mur_absorbing_step<<<dim3(128, 128), 128>>>(electric_field_ez, magnetic_hx, magnetic_hy, conductivity_sigma, dt_over_eps0);",
			"reaction_diffusion_gray_scott_laplacian<<<grid_size, workgroup_size>>>(u_concentration, v_concentration, feed_rate, kill_rate, diffusion_u, diffusion_v);",
			"ising_metropolis_checkerboard_spin_flip<<<lattice_mesh, warp_size>>>(spin_tensor, coupling_j, external_h, inverse_temp_beta, rng_state);"
		];

		const serverNodes = [
			"mesocentre-node04.cluster.u-paris.fr",
			"mpq-compute-node12.local",
			"inria-grid5000-talence-08.hpc.fr",
			"lab-condorcet-hpc01.u-paris.fr",
			"mpq-gpu-cluster-a100.paris7.fr",
			"cern-openstack-batch-node44.cern.ch"
		];

		const instruments = [
			"Oxford Triton 200 Dilution Refrigerator",
			"Thorlabs Octavius Femtosecond Titanium:Sapphire Laser System",
			"PicoQuant HydraHarp 400 TCSPC Module",
			"Andor iXon Ultra 888 Back-Illuminated EMCCD Camera",
			"Keysight N5183B MXG Microwave Analog Signal Generator",
			"Single Quantum Eos Closed-Cycle SNSPD Multichannel Detection Rack",
			"HighFinesse WSU-30 Optical High-Precision Wavemeter"
		];

		const audioTracks = [
			"Phase Transition in D Minor",
			"Projet 27 (Fourier Resynthesis)",
			"Continuous Lenia Oscillations",
			"Cavity QED Ambient Study",
			"Hypocritical World Nostalgia",
			"Projet 12 (Modular Patch)",
			"Entropy Drift in C Major",
			"Hamiltonian Flow on Symplectic Torus",
			"Wavepacket Dispersion in Phase Space"
		];

		const colloqHalls = [
			"Amphitheatre Buffon (Batiment Buffon)",
			"Amphitheatre Turing (Batiment Sophie Germain)",
			"Salle Luc Valentin (Laboratoire MPQ, Batiment Condorcet)",
			"Amphitheatre Hermite (Institut Henri Poincare)",
			"Auditorium Pierre-Gilles de Gennes (ESPCI Paris)"
		];

		const academicReviewJournals = [
			"Physical Review Letters",
			"Journal of High Energy Physics",
			"Physical Review E",
			"Journal of Computational Physics",
			"Communications in Mathematical Physics",
			"Quantum Science and Technology",
			"Optics Express",
			"Physical Review A",
			"SIAM Journal on Scientific Computing"
		];

		const categories = [
			{
				id: "highPerformanceComputing",
				senders: [
					{ name: "Mesocentre Slurm Orchestrator", address: "slurm-daemon@cluster.u-paris.fr" },
					{ name: "NVIDIA Compute Architecture Telemetry", address: "alerts@developer.nvidia.com" },
					{ name: "MPQ Lab Computing Cluster", address: "node-admin@mpq.univ-paris-diderot.fr" },
					{ name: "Grid5000 Infrastructure Operations", address: "operations@grid5000.fr" },
					{ name: "Open Science Grid Consortium", address: "accounting@opensciencegrid.org" },
					{ name: "Khronos WebGPU Architecture Tracker", address: "compute-perf@khronos.org" }
				],
				scenarios: [
					(rng) => {
						const repo = pick(repoNames, rng);
						const jobId = pickInt(1048200, 9948200, rng);
						const node = pick(serverNodes, rng);
						const runtimeSec = pickInt(4200, 86400, rng);
						const hours = Math.floor(runtimeSec / 3600);
						const mins = Math.floor((runtimeSec % 3600) / 60);
						const vramGb = pickFloat(14.2, 78.4, 2, rng);
						const tflops = pickFloat(18.5, 142.0, 1, rng);
						const residual = pickFloat(1.0, 9.9, 2, rng) + "e-" + pickInt(8, 14, rng);
						return {
							subject: fill("[SLURM] Job {jobId} COMPLETED: {repo}", { jobId, repo }),
							body: `
								<p>Your queued batch job on cluster node <code>${node}</code> has completed execution with status code <code>0 (EXIT_SUCCESS)</code>.</p>
								<div style="background: #f4f6f8; border: 1px solid #d0d7de; border-radius: 4px; padding: 12px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px; line-height: 1.6;">
									<div><strong>Job ID:</strong> ${jobId}</div>
									<div><strong>Target Task:</strong> ${repo} (CUDA compute capability 8.9 / SM_89)</div>
									<div><strong>Partition:</strong> gpu_a100_long</div>
									<div><strong>Elapsed Wallclock:</strong> ${hours}h ${mins}m ${(runtimeSec % 60)}s</div>
									<div><strong>Peak Device Memory:</strong> ${vramGb} GiB / 80.0 GiB</div>
									<div><strong>Sustained FP32 Throughput:</strong> ${tflops} TFLOPS</div>
									<div><strong>Final Hamiltonian L2 Residual:</strong> &Delta;H/H<sub>0</sub> = ${residual}</div>
									<div><strong>Output Checkpoint:</strong> /mnt/storage/checkpoints/run_${jobId}.h5 (Integrity checksum verified)</div>
								</div>
								<p>Binary checkpoints and serialized tensor states have been mirrored to your scratch directory. You can inspect convergence metrics in the dashboard.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Slurm Workload Manager &bull; Universite Paris Cite HPC Infrastructure</p>
							`
						};
					},
					(rng) => {
						const repo = pick(repoNames, rng);
						const kernel = pick(simulationKernels, rng);
						const errorAddr = "0x00007FFF" + formatHex(pickInt(0x100000, 0xFFFFFF, rng), 6);
						const allocatedMb = pickInt(12400, 31800, rng);
						return {
							subject: fill("[CUDA OOM Alert] Device memory fault in {repo}", { repo }),
							body: `
								<p>The GPU runtime monitor encountered an unhandled out-of-memory exception during buffer allocation for <strong>${repo}</strong>.</p>
								<div style="background: #fff8f7; border-left: 4px solid #cf222e; padding: 10px 14px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px;">
									<div><strong style="color: #cf222e;">CUDA_ERROR_OUT_OF_MEMORY (Error Code 2)</strong></div>
									<div>Failed allocation: 4096 &times; 4096 &times; 128 single-precision complex tensor (${allocatedMb} MiB requested)</div>
									<div>Faulting execution pointer: ${errorAddr}</div>
									<div>Kernel signature: <code>${kernel}</code></div>
								</div>
								<p>Recommended mitigation steps:</p>
								<ul style="line-height: 1.5; font-size: 13px;">
									<li>Enable domain decomposition and distribute spatial tiles across GPU ranks using NCCL direct transfers.</li>
									<li>Switch internal spectral buffers from Float64 to mixed-precision FP16 Tensor Core arithmetic where physical dissipation permits.</li>
									<li>Activate gradient checkpointing or intermediate buffer reuse before launching the next compute run.</li>
								</ul>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Cluster Compute Telemetry Service &bull; High Performance Computing Group</p>
							`
						};
					},
					(rng) => {
						const repo = pick(repoNames, rng);
						const speedup = pickFloat(3.8, 14.6, 2, rng);
						const openmpTime = pickFloat(124.5, 480.2, 1, rng);
						const webgpuTime = (openmpTime / parseFloat(speedup)).toFixed(1);
						return {
							subject: fill("Scaling Benchmark: WebGPU vs OpenMP for {repo}", { repo }),
							body: `
								<p>The automated parallel benchmarking suite completed execution for <strong>${repo}</strong> across the target compute matrix.</p>
								<table style="width: 100%; border-collapse: collapse; font-family: Consolas, monospace; font-size: 12px; margin: 12px 0;">
									<thead>
										<tr style="background: #eaeef2; text-align: left;">
											<th style="padding: 6px 10px; border: 1px solid #d0d7de;">Backend Architecture</th>
											<th style="padding: 6px 10px; border: 1px solid #d0d7de;">Grid Dimension</th>
											<th style="padding: 6px 10px; border: 1px solid #d0d7de;">Execution Time</th>
											<th style="padding: 6px 10px; border: 1px solid #d0d7de;">Speedup</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td style="padding: 6px 10px; border: 1px solid #d0d7de;">OpenMP (16 Threads, AVX-512)</td>
											<td style="padding: 6px 10px; border: 1px solid #d0d7de;">2048 &times; 2048 &times; 64</td>
											<td style="padding: 6px 10px; border: 1px solid #d0d7de;">${openmpTime} ms / step</td>
											<td style="padding: 6px 10px; border: 1px solid #d0d7de;">1.00&times; (Baseline)</td>
										</tr>
										<tr style="background: #f6f8fa;">
											<td style="padding: 6px 10px; border: 1px solid #d0d7de;">WebGPU Compute Shader (WGSL)</td>
											<td style="padding: 6px 10px; border: 1px solid #d0d7de;">2048 &times; 2048 &times; 64</td>
											<td style="padding: 6px 10px; border: 1px solid #d0d7de;">${webgpuTime} ms / step</td>
											<td style="padding: 6px 10px; border: 1px solid #d0d7de; font-weight: bold; color: #1a7f37;">${speedup}&times;</td>
										</tr>
									</tbody>
								</table>
								<p>VRAM bandwidth saturation reached 84.6% of theoretical peak on the WebGPU pipeline with zero register spilling detected.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Automated Benchmark Suite &bull; High Performance Computing Working Group</p>
							`
						};
					},
					(rng) => {
						const repo = pick(repoNames, rng);
						const occupancy = pickFloat(88.4, 98.2, 1, rng);
						const regCount = pickInt(28, 48, rng);
						const smemBytes = pickInt(16, 48, rng) * 1024;
						return {
							subject: fill("Roofline Profiler Report: Kernel occupancy for {repo}", { repo }),
							body: `
								<p>NVIDIA Nsight Compute completed deep kernel profiling on the main integration loop for <strong>${repo}</strong>.</p>
								<div style="background: #f0f7ff; border: 1px solid #c8e1ff; border-radius: 4px; padding: 12px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px;">
									<div>Theoretical Warp Occupancy: <strong>${occupancy}%</strong></div>
									<div>Registers Per Thread: <strong>${regCount}</strong> (Limit: 64)</div>
									<div>Dynamic Shared Memory: <strong>${smemBytes} bytes</strong> per thread block</div>
									<div>Memory Hierarchy Status: L1 cache hit rate 92.4%, L2 throughput 1.84 TB/s</div>
									<div>Roofline Bound: Compute-bound in 2D spatial convolution phases</div>
								</div>
								<p>All memory access patterns exhibit coalesced 128-byte transactions across active warps.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Hardware Performance Profiling Subsystem</p>
							`
						};
					}
				]
			},
			{
				id: "quantumOpticsAndLab",
				senders: [
					{ name: "MPQ Cryogenic Telemetry", address: "cryo-monitor@mpq.univ-paris-diderot.fr" },
					{ name: "Photonics Laboratory DAQ", address: "spdc-instrumentation@optics-core.org" },
					{ name: "Dilution Fridge Control Daemon", address: "fridge-telemetry@lab.paris7.fr" },
					{ name: "Optical Cavity Piezo Monitor", address: "piezo-servolock@physics-hardware.local" },
					{ name: "Single-Photon Detector Network", address: "snspd-control@mpq.cnrs.fr" }
				],
				scenarios: [
					(rng) => {
						const tempMk = pickFloat(11.2, 16.8, 2, rng);
						const magnetTesla = pickFloat(0.0, 6.5, 3, rng);
						const pHe3 = pickFloat(142.1, 168.4, 1, rng);
						const instrument = pick(instruments, rng);
						return {
							subject: fill("[Lab Telemetry] Cryostat thermal equilibrium: {tempMk} mK", { tempMk }),
							body: `
								<p>The temperature stabilization servo on <strong>${instrument}</strong> reports nominal base temperature in the mixing chamber.</p>
								<div style="background: #f0f8ff; border: 1px solid #b6d4fe; border-radius: 4px; padding: 12px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px; line-height: 1.6;">
									<div><strong>Mixing Chamber (RuO<sub>2</sub> sensor):</strong> ${tempMk} mK (&plusmn;0.04 mK drift / hr)</div>
									<div><strong>Still Temperature:</strong> 742.8 mK</div>
									<div><strong>4K Stage Pulse Tube:</strong> 3.21 K</div>
									<div><strong>3He/4He Still Pressure:</strong> ${pHe3} mbar</div>
									<div><strong>Superconducting Solenoid Field:</strong> B<sub>z</sub> = ${magnetTesla} T</div>
									<div><strong>Cryopump Status:</strong> Ultra-high vacuum &lt; 1.4 &times; 10<sup>-8</sup> mbar</div>
								</div>
								<p>Optical ports are clear and thermal radiation shielding shows zero parasitic infrared leakage. The apparatus is ready for spectroscopic acquisitions.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Laboratoire Materiaux et Phenomenes Quantiques (MPQ) &bull; UMR 7162 CNRS / Universite Paris Cite</p>
							`
						};
					},
					(rng) => {
						const coincidences = pickInt(12400, 48200, rng);
						const g2Zero = pickFloat(0.012, 0.048, 3, rng);
						const bellS = pickFloat(2.68, 2.82, 3, rng);
						const crystal = pick(["Periodically Poled KTiOPO4 (PPKTP)", "Beta-Barium Borate (BBO)", "Periodically Poled Lithium Niobate (PPLN)"], rng);
						return {
							subject: fill("SPDC Entangled Photons: Bell Parameter S = {bellS}", { bellS }),
							body: `
								<p>The continuous single-photon coincidence counting run on the spontaneous parametric down-conversion (SPDC) source has completed.</p>
								<div style="background: #fbf0ea; border-left: 4px solid #bc4c00; padding: 10px 14px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px;">
									<div>Non-linear crystal: <strong>${crystal}</strong> (Type-II phase matching at 405 nm &rarr; 810 nm)</div>
									<div>Coincidence rate: <strong>${coincidences} pairs / second</strong></div>
									<div>Second-order correlation: <strong>g<sup>(2)</sup>(0) = ${g2Zero} &plusmn; 0.002</strong> (Single-photon anti-bunching verified)</div>
									<div>CHSH Bell inequality parameter: <strong style="color: #0969da;">S = ${bellS} &plusmn; 0.014</strong></div>
									<div>Classical threshold violation: S &gt; 2 (Exceeds classical boundary by &gt; 48 &sigma;)</div>
								</div>
								<p>Quantum state tomography confirms polarization entanglement fidelity &ge; 98.4% relative to the singlet state |&Psi;<sup>&minus;</sup>&rang; = (|HV&rang; &minus; |VH&rang;) / &radic;2.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Quantum Information &amp; Nanophotonics Division &bull; MPQ Paris</p>
							`
						};
					},
					(rng) => {
						const driftMhz = pickFloat(3.4, 18.2, 1, rng);
						const cavityFinesse = pickInt(42000, 98000, rng);
						return {
							subject: fill("[Notice] Optical cavity lock drift compensated (+{driftMhz} MHz)", { driftMhz }),
							body: `
								<p>The Pound-Drever-Hall (PDH) laser frequency stabilization servo engaged automatic piezoelectric correction to compensate for ambient thermal drift.</p>
								<div style="background: #f6f8fa; border: 1px solid #d0d7de; padding: 10px; margin: 10px 0; font-family: Consolas, monospace; font-size: 12px;">
									<div>High-finesse Fabry-Perot cavity: F = ${cavityFinesse}</div>
									<div>Detected resonance offset: &Delta;&nu; = +${driftMhz} MHz</div>
									<div>Piezo servo feedback: Corrected within 240 &mu;s</div>
									<div>Residual laser linewidth: &delta;&nu; &lt; 1.2 kHz</div>
								</div>
								<p>Single-mode coupling into the polarization-maintaining fiber remains nominal at 84% transmission efficiency.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Instrumentation Automation Daemon &bull; Optics Lab Core</p>
							`
						};
					},
					(rng) => {
						const visibility = pickFloat(96.2, 99.1, 1, rng);
						const delayPs = pickFloat(0.12, 0.48, 2, rng);
						return {
							subject: fill("Hong-Ou-Mandel Interference: Visibility V = {visibility}%", { visibility }),
							body: `
								<p>Two-photon quantum interference characterization on the 50:50 fiber beam splitter has converged with high visibility.</p>
								<div style="background: #f6fdf7; border: 1px solid #bbf7d0; border-radius: 4px; padding: 12px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px;">
									<div>HOM Dip Visibility: <strong>V = ${visibility}%</strong></div>
									<div>Coincidence Minimum: Delay offset &Delta;&tau; = ${delayPs} ps</div>
									<div>Photon Indistinguishability: |&lang;&psi;<sub>1</sub>|&psi;<sub>2</sub>&rang;|<sup>2</sup> &gt; 0.98</div>
									<div>Detector Jitter: &lt; 35 ps FWHM on SNSPD channels</div>
								</div>
								<p>Spatial, spectral, and temporal mode matching between the two arms confirms high photon indistinguishability.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Nanophotonics Measurement Suite &bull; MPQ Paris</p>
							`
						};
					}
				]
			},
			{
				id: "theoreticalPhysicsAndArxiv",
				senders: [
					{ name: "arXiv Mail Server", address: "no-reply@arxiv.org" },
					{ name: "Physical Review Letters", address: "prl-editorial@aps.org" },
					{ name: "Journal of High Energy Physics", address: "jhep-alerts@sissa.it" },
					{ name: "Communications in Mathematical Physics", address: "cmp-alerts@springernature.com" },
					{ name: "Physical Review E", address: "pre-editorial@aps.org" },
					{ name: "CERN Document Server", address: "cds-alerts@cern.ch" }
				],
				scenarios: [
					(rng) => {
						const topic = pick(physicsTopics, rng);
						const arxivId1 = "2608." + String(pickInt(10000, 99999, rng));
						const arxivId2 = "2608." + String(pickInt(10000, 99999, rng));
						return {
							subject: fill("arXiv Daily Digest: quant-ph / math-ph / physics.comp-ph ({topic})", { topic }),
							body: `
								<p>Here is your tailored daily arXiv digest for tracked categories <strong>quant-ph</strong>, <strong>math-ph</strong>, and <strong>physics.comp-ph</strong>:</p>
								<div style="border-top: 1px solid #d0d7de; padding: 10px 0; margin-top: 8px;">
									<div style="font-size: 13px; font-weight: bold; color: #0969da;">
										<a href="https://arxiv.org/abs/${arxivId1}" style="text-decoration: none; color: #0969da;">arXiv:${arxivId1}</a>: Emergent Gauge Fields and Solitonic Modes in Extended ${topic}
									</div>
									<div style="font-size: 11px; color: #57606a; margin: 2px 0;">Authors: M. V. Berry, C. Rovelli, A. Aspect, et al.</div>
									<p style="font-size: 12px; margin: 4px 0; color: #24292f;">We demonstrate an exact mapping between localized non-linear eigenmodes and topological soliton invariants under discrete conformal symmetry breaking across multi-dimensional lattices.</p>
								</div>
								<div style="border-top: 1px solid #d0d7de; padding: 10px 0; margin-top: 8px;">
									<div style="font-size: 13px; font-weight: bold; color: #0969da;">
										<a href="https://arxiv.org/abs/${arxivId2}" style="text-decoration: none; color: #0969da;">arXiv:${arxivId2}</a>: High-Order Symplectic Geometric Integrators for Non-Abelian Gauge Systems
									</div>
									<div style="font-size: 11px; color: #57606a; margin: 2px 0;">Authors: J. M. Sanz-Serna, E. Hairer, C. Bossu Reaubourg, et al.</div>
									<p style="font-size: 12px; margin: 4px 0; color: #24292f;">We present an explicit multi-stage geometric integration scheme that strictly preserves Casimir invariants and total phase space volume over long-time numerical simulations.</p>
								</div>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Delivered based on your filter criteria: [quant-ph, math-ph, physics.comp-ph, cond-mat.mes-hall].</p>
							`
						};
					},
					(rng) => {
						const journal = pick(academicReviewJournals, rng);
						const manuscriptId = "PRL-2026-" + pickInt(10480, 99480, rng);
						const topic = pick(physicsTopics, rng);
						return {
							subject: fill("Invitation to Review for {journal} ({manuscriptId})", { journal, manuscriptId }),
							body: `
								<p>Dear Colleague,</p>
								<p>We would like to invite you to serve as a peer reviewer for a manuscript submitted to <strong>${journal}</strong>.</p>
								<div style="background: #f6f8fa; border-left: 3px solid #0969da; padding: 10px 14px; margin: 12px 0; font-size: 12px;">
									<div><strong>Manuscript ID:</strong> ${manuscriptId}</div>
									<div><strong>Title:</strong> Exact Numerical Bounds and Spectral Invariants in ${topic}</div>
									<div><strong>Subject Area:</strong> Computational &amp; Theoretical Physics</div>
								</div>
								<p>Given your research contributions in numerical modeling and symplectic dynamical systems, your assessment would provide significant guidance for our editorial decision.</p>
								<p>Please confirm your availability within 5 business days.</p>
								<p>Sincerely,<br>The Editorial Board<br><em>${journal}</em></p>
							`
						};
					},
					(rng) => {
						const paper = pick(paperTitles, rng);
						const citingJournal = pick(academicReviewJournals, rng);
						const year = 2026;
						const doiSuffix = pickInt(100000, 999999, rng);
						return {
							subject: fill("Citation Alert: \"{paper}\" cited in {citingJournal}", { paper, citingJournal }),
							body: `
								<p>Your research paper has been cited in a new publication indexed in the academic literature database:</p>
								<div style="background: #f0f6ff; border: 1px solid #c8e1ff; border-radius: 4px; padding: 12px; margin: 12px 0; font-size: 12px;">
									<div style="color: #57606a;">Cited Document:</div>
									<div style="font-weight: bold; margin-bottom: 8px;">"${paper}"</div>
									<div style="color: #57606a;">Citing Article:</div>
									<div style="font-style: italic;">"Advances in Non-Linear Hamiltonian Dynamics and Discrete Lattice Solitons", <em>${citingJournal}</em> (${year}).</div>
									<div style="margin-top: 6px; font-family: monospace; font-size: 11px;">DOI: 10.1103/PhysRevLett.136.${doiSuffix}</div>
								</div>
								<p>Full citation analytics and bibliometric impact metrics are accessible from your author dashboard.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Academic Metrics Network &bull; Clarivate / CrossRef</p>
							`
						};
					}
				]
			},
			{
				id: "astrophysicsAndCosmology",
				senders: [
					{ name: "LIGO-Virgo-KAGRA Alert Network", address: "alerts@emfollow.ligo.org" },
					{ name: "NASA Exoplanet Science Institute", address: "nexsci-alerts@ipac.caltech.edu" },
					{ name: "ESA Gaia Science Operations", address: "gaia-processing@cosmos.esa.int" },
					{ name: "Strasbourg Astronomical Data Center", address: "simbad-bot@unistra.fr" },
					{ name: "James Webb Space Telescope Operations", address: "jwst-alerts@stsci.edu" }
				],
				scenarios: [
					(rng) => {
						const triggerId = "S2608" + formatHex(pickInt(0x1000, 0xFFFF, rng), 4);
						const ra = pickFloat(12.0, 23.9, 2, rng);
						const dec = (pickFloat(-65.0, 65.0, 2, rng) > 0 ? "+" : "") + pickFloat(-65.0, 65.0, 2, rng);
						const far = "1.42e-" + pickInt(10, 16, rng);
						const mass1 = pickFloat(28.4, 42.1, 1, rng);
						const mass2 = pickFloat(19.2, 31.8, 1, rng);
						const distMpc = pickInt(420, 1850, rng);
						return {
							subject: fill("[GCN Circular] LVC Gravitational Wave Trigger: {triggerId}", { triggerId }),
							body: `
								<p>The LIGO-Virgo-KAGRA detector network identified a candidate gravitational-wave transient event during real-time matched filtering analysis.</p>
								<div style="background: #0d1117; color: #c9d1d9; border-radius: 4px; padding: 12px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px; line-height: 1.5;">
									<div><span style="color: #79c0ff;">TRIGGER_ID:</span> ${triggerId}</div>
									<div><span style="color: #79c0ff;">EVENT_CLASS:</span> Binary Black Hole (BBH) &gt; 99.8% probability</div>
									<div><span style="color: #79c0ff;">FALSE_ALARM_RATE:</span> ${far} Hz (1 per &gt; 100,000 years)</div>
									<div><span style="color: #79c0ff;">ESTIMATED_MASSES:</span> m1 &approx; ${mass1} M<sub>&odot;</sub>, m2 &approx; ${mass2} M<sub>&odot;</sub></div>
									<div><span style="color: #79c0ff;">SKY_LOCALIZATION:</span> RA = ${ra}h, Dec = ${dec}&deg; (90% area: 18.4 deg<sup>2</sup>)</div>
									<div><span style="color: #79c0ff;">LUMINOSITY_DISTANCE:</span> d<sub>L</sub> = ${distMpc} Mpc (z &approx; 0.14)</div>
								</div>
								<p>Electromagnetic follow-up telescope coordinates and bayestar sky localization probability FITS maps are available on GraceDB.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Gamma-ray Coordinates Network &bull; LVC Scientific Collaboration</p>
							`
						};
					},
					(rng) => {
						const starName = "TIC-" + pickInt(1048200, 9984200, rng);
						const period = pickFloat(1.42, 14.85, 3, rng);
						const depthPpm = pickInt(240, 1820, rng);
						const radiusEarth = pickFloat(0.85, 2.45, 2, rng);
						const teq = pickInt(280, 540, rng);
						return {
							subject: fill("TESS Alert: New Exoplanet Candidate in {starName}", { starName }),
							body: `
								<p>The photometric transit search pipeline flagged a periodic dip in the light curve of host star <strong>${starName}</strong>.</p>
								<div style="background: #f6f8fa; border: 1px solid #d0d7de; padding: 10px 14px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px; line-height: 1.6;">
									<div>Host Star: <strong>${starName}</strong> (Spectral Type G2V, V = 10.4 mag)</div>
									<div>Orbital Period: <strong>P = ${period} days</strong> (&plusmn;0.0001 d)</div>
									<div>Transit Depth: <strong>&delta; = ${depthPpm} ppm</strong></div>
									<div>Inferred Planetary Radius: <strong>R<sub>p</sub> = ${radiusEarth} R<sub>&oplus;</sub></strong></div>
									<div>Equilibrium Temperature: <strong>T<sub>eq</sub> &approx; ${teq} K</strong></div>
								</div>
								<p>High-resolution radial velocity spectroscopy has been scheduled with ESPRESSO on the VLT to determine the companion mass.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">NASA Exoplanet Science Institute &bull; Caltech / IPAC</p>
							`
						};
					},
					(rng) => {
						const target = "G347." + pickInt(10, 99, rng) + "+0.2";
						const redshift = pickFloat(4.8, 8.2, 2, rng);
						return {
							subject: fill("[JWST NIRSpec] High-redshift Lyman-break Galaxy Candidate at z = {redshift}", { redshift }),
							body: `
								<p>Spectroscopic reduction of deep-field NIRSpec data confirmed an emission line doublet for target <strong>${target}</strong>.</p>
								<div style="background: #0b132b; color: #e0e1dd; border-radius: 4px; padding: 12px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px;">
									<div>Target Identifier: ${target}</div>
									<div>Spectroscopic Redshift: <strong>z = ${redshift} &plusmn; 0.02</strong></div>
									<div>Rest-frame UV Continuum Slope: &beta; = -2.42</div>
									<div>Inferred Star Formation Rate: ~24 M<sub>&odot;</sub> / yr</div>
									<div>Instrument Mode: Prism / Clear (0.6 &ndash; 5.3 &mu;m)</div>
								</div>
								<p>Calibrated 1D and 2D FITS spectral cubes have been pushed to the MAST astronomical archive.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Space Telescope Science Institute &bull; JWST Science Operations</p>
							`
						};
					}
				]
			},
			{
				id: "computationalMathematicsAndSimulation",
				senders: [
					{ name: "Scientific Machine Learning (SciML)", address: "benchmarks@sciml.ai" },
					{ name: "Julia Computing Ecosystem", address: "notifications@julialang.org" },
					{ name: "Wolfram Research MathKernel", address: "kernel-daemon@wolfram.com" },
					{ name: "OpenBLAS Core Team", address: "dev@openblas.net" },
					{ name: "SIAM Computational Physics", address: "editor@siam.org" }
				],
				scenarios: [
					(rng) => {
						const repo = pick(repoNames, rng);
						const steps = pickInt(10, 100, rng) * 1000000;
						const energyDrift = "1." + pickInt(10, 99, rng) + "e-" + pickInt(12, 16, rng);
						const angularMomentumDrift = "3." + pickInt(10, 99, rng) + "e-" + pickInt(14, 18, rng);
						const bodies = pickInt(3, 12, rng);
						return {
							subject: fill("Symplectic Conservation Verification: {repo}", { repo }),
							body: `
								<p>Long-time numerical stability verification completed over <strong>${steps.toLocaleString()}</strong> integration steps for <strong>${repo}</strong>.</p>
								<div style="background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 4px; padding: 12px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px; line-height: 1.6;">
									<div><strong>Integrator Scheme:</strong> 4th-Order Symplectic Partitioned Runge-Kutta (Yoshida / Forest-Ruth)</div>
									<div><strong>Phase Space Dimension:</strong> 6N (N = ${bodies} interacting bodies)</div>
									<div><strong>Relative Energy Drift:</strong> |&Delta;E / E<sub>0</sub>| = ${energyDrift}</div>
									<div><strong>Angular Momentum Invariant:</strong> |&Delta;L / L<sub>0</sub>| = ${angularMomentumDrift}</div>
									<div><strong>Poincare Map Crossings:</strong> Non-ergodic invariant KAM tori confirmed intact.</div>
								</div>
								<p>No secular drift was observed in the first integrals of motion, confirming strict preservation of the symplectic 2-form &omega; = &sum; dp<sub>i</sub> &and; dq<sub>i</sub>.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">SciML DifferentialEquations.jl Benchmarking Infrastructure</p>
							`
						};
					},
					(rng) => {
						const repo = pick(repoNames, rng);
						const resolution = pick(["1024x1024", "2048x2048", "4096x4096"], rng);
						const reynolds = pickInt(12000, 65000, rng);
						return {
							subject: fill("Spectral Navier-Stokes Solver: Enstrophy Cascade (Re = {reynolds})", { reynolds }),
							body: `
								<p>The pseudo-spectral 2D turbulence solver reached statistical steady-state for <strong>${repo}</strong> on a spatial resolution grid of <strong>${resolution}</strong>.</p>
								<div style="background: #eef9ff; border: 1px solid #b6e3ff; padding: 10px 14px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px;">
									<div>Reynolds Number: <strong>Re = ${reynolds}</strong></div>
									<div>Energy Spectrum Slope: <strong>E(k) &prop; k<sup>&minus;3.04</sup></strong> (Matches Kraichnan enstrophy cascade theory)</div>
									<div>Dealiasing Algorithm: <strong>2/3-rule Fourier truncation filter</strong></div>
									<div>Vorticity Filaments: Coherent vortex mergers observed in physical domain</div>
								</div>
								<p>Raw binary fields and kinetic energy spectrum power-law fits have been serialized to the project directory.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Computational Fluid Dynamics &amp; Spectral Methods Group</p>
							`
						};
					},
					(rng) => {
						const speciesCount = pickInt(120, 540, rng);
						const lyapunov = pickFloat(0.014, 0.082, 3, rng);
						return {
							subject: "Lenia Continuous Automata: Morphospace discovery update",
							body: `
								<p>The automated parameter space exploration daemon identified stable localized soliton solutions across continuous kernel configurations.</p>
								<div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 4px; padding: 12px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px;">
									<div>Identified Stable Species: <strong>${speciesCount}</strong></div>
									<div>Largest Lyapunov Exponent: <strong>&lambda;<sub>max</sub> = +${lyapunov}</strong> (Weakly chaotic persistent orbit)</div>
									<div>Kernel Topologies: Multimodal Gaussian rings with multichannel coupling</div>
									<div>Barycenter Drift: Steady translational locomotion at v &approx; 0.14 cells / time step</div>
								</div>
								<p>Species genome vectors and phase portraits have been exported to the simulation library.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Artificial Life &amp; Emergent Systems Laboratory</p>
							`
						};
					}
				]
			},
			{
				id: "softwareDevelopmentAndTooling",
				senders: [
					{ name: "GitHub Actions Automation", address: "notifications@github.com" },
					{ name: "Rust Crates Registry", address: "crates-admin@rust-lang.org" },
					{ name: "WebGPU Working Group", address: "gpuweb-tracker@w3.org" },
					{ name: "LLVM Buildbot Infrastructure", address: "llvm-ci@llvm.org" },
					{ name: "WebAssembly Community Group", address: "wasm-tools@w3.org" }
				],
				scenarios: [
					(rng) => {
						const repo = pick(repoNames, rng);
						const prNum = pickInt(14, 280, rng);
						const contributor = pick(["quant-physicist-42", "alex-wavefront", "simd-optimizer", "julia-numerics-fan"], rng);
						return {
							subject: fill("[{repo}] Pull Request #{prNum}: Vectorized AVX-512 & WebGPU backend", { repo, prNum }),
							body: `
								<p>A new pull request was submitted on <strong>${repo}</strong> by <code>@${contributor}</code>:</p>
								<div style="background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 6px; padding: 12px; margin: 12px 0;">
									<div style="font-weight: bold; font-size: 13px; margin-bottom: 6px;">PR #${prNum}: Implement direct WebGPU buffer mapping and AVX-512 FMA vector intrinsics</div>
									<p style="font-size: 12px; margin: 0; color: #57606a;">"This patch replaces the scalar convolution loop with explicit SIMD intrinsics and adds an asynchronous compute pipeline descriptor for modern WebGPU hardware adapters. Benchmark exhibits ~4.2x speedup on large spatial domains."</p>
								</div>
								<div style="font-family: monospace; font-size: 11px; color: #1a7f37;">All continuous integration tests passed (4 target architectures, 0 errors, 0 memory leaks).</div>
								<p style="margin-top: 12px;">You can review, comment, or merge this pull request from the repository management interface.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">GitHub Notifications &bull; ${repo}</p>
							`
						};
					},
					(rng) => {
						const repo = pick(repoNames, rng);
						const vMajor = pickInt(1, 3, rng);
						const vMinor = pickInt(0, 9, rng);
						const vPatch = pickInt(0, 12, rng);
						const version = `${vMajor}.${vMinor}.${vPatch}`;
						return {
							subject: fill("Release published: {repo} v{version}", { repo, version }),
							body: `
								<p>Version <strong>v${version}</strong> of <strong>${repo}</strong> has been tagged and compiled across all target deployment targets.</p>
								<div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; padding: 10px 14px; margin: 12px 0; font-size: 12px;">
									<div style="font-weight: bold; color: #166534; margin-bottom: 4px;">Changelog Highlights:</div>
									<ul style="margin: 0; padding-left: 20px; line-height: 1.5;">
										<li>Optimized continuous kernel convolutions with shared memory caching.</li>
										<li>Export high-resolution simulation state to VTK / HDF5 / PNG tensor slices.</li>
										<li>Integrated interactive parameter tuning interface with real-time spectrum visualization.</li>
									</ul>
								</div>
								<p>Binaries and WebAssembly build artifacts have been published to the static distribution endpoints.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Automated Release Bot &bull; Open Source Software Registry</p>
							`
						};
					},
					(rng) => {
						const repo = pick(repoNames, rng);
						const wasmKb = pickInt(180, 420, rng);
						const gzipKb = (wasmKb * 0.34).toFixed(1);
						return {
							subject: fill("[Wasm-Opt] Binary size reduction: {repo}", { repo }),
							body: `
								<p>Binary optimization pipeline finished executing <code>wasm-opt -O4 --converge</code> for <strong>${repo}</strong>.</p>
								<div style="background: #f6f8fa; border: 1px solid #d0d7de; padding: 10px 14px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px;">
									<div>Raw WebAssembly Binary: ${wasmKb} KiB</div>
									<div>Brotli/Gzip Compressed: <strong>${gzipKb} KiB</strong></div>
									<div>Dead Code Elimination: 14 unreferenced math subroutines pruned</div>
									<div>SIMD-128 Instruction Support: Enabled and verified</div>
								</div>
								<p>The bundle is ready for client-side execution in modern web environments.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Binary Optimization Toolchain</p>
							`
						};
					}
				]
			},
			{
				id: "academicAndUniversity",
				senders: [
					{ name: "UFR de Physique - Universite Paris Cite", address: "scolarite.physique@u-paris.fr" },
					{ name: "Laboratoire MPQ Direction", address: "direction@mpq.univ-paris-diderot.fr" },
					{ name: "Overleaf Academic Publishing", address: "notifications@overleaf.com" },
					{ name: "Bibliotheque Universitaire Grands Moulins", address: "bu.grandsmoulins@u-paris.fr" },
					{ name: "Master MPQ Secretariat", address: "master.mpq@u-paris.fr" }
				],
				scenarios: [
					(rng) => {
						const hall = pick(colloqHalls, rng);
						const speaker = pick(["Prof. Alain Aspect", "Prof. Serge Haroche", "Dr. Sara Ducci", "Prof. Jean Dalibard", "Prof. Carlo Rovelli"], rng);
						const topic = pick(physicsTopics, rng);
						const time = pick(["11:00", "14:00", "16:30"], rng);
						return {
							subject: fill("Physics Department Colloquium: {speaker} on {topic}", { speaker, topic }),
							body: `
								<p>Dear student,</p>
								<p>The Physics Department of Universite Paris Cite and Laboratoire MPQ are pleased to announce the upcoming departmental colloquium:</p>
								<div style="background: #fdf6ec; border-left: 4px solid #e6a23c; padding: 12px 16px; margin: 12px 0;">
									<div style="font-size: 14px; font-weight: bold; color: #303133;">"${topic}: From Fundamental Quantum Principles to Modern Experimental Realizations"</div>
									<div style="margin-top: 6px; font-size: 12px; color: #606266;">Speaker: <strong>${speaker}</strong></div>
									<div style="font-size: 12px; color: #606266;">Location: <strong>${hall}</strong>, Batiment Condorcet / Halle aux Farines</div>
									<div style="font-size: 12px; color: #606266;">Schedule: Thursday at <strong>${time}</strong> (followed by scientific discussion)</div>
								</div>
								<p>Master students, doctoral researchers, and faculty members are invited to participate.</p>
								<p>Best regards,<br>Secretariat General de l'UFR de Physique<br>Universite Paris Cite</p>
							`
						};
					},
					(rng) => {
						const paper = pick(paperTitles, rng);
						const pages = pickInt(18, 48, rng);
						const bibEntries = pickInt(34, 82, rng);
						return {
							subject: fill("[Overleaf] LaTeX document compiled: \"{paper}\"", { paper }),
							body: `
								<p>Your collaborative project <strong>"${paper}"</strong> compiled successfully on TeX Live 2026.</p>
								<div style="background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 4px; padding: 10px 14px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px; line-height: 1.5;">
									<div>Document Class: revtex4-2 / aps (Two-column format)</div>
									<div>Page count: ${pages} pages (${bibEntries} BibTeX references formatted)</div>
									<div>TikZ Diagrams: 14 vectorized vector graphics rendered via PGF/TikZ</div>
									<div>Compilation Status: 0 Errors, 0 Fatal Warnings, SyncTeX mapped</div>
								</div>
								<p>Collaborators can view the latest synchronized PDF draft in the editor workspace.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Overleaf Collaborative Academic Publishing</p>
							`
						};
					},
					(rng) => {
						const book = pick([
							"Landau & Lifshitz - Course of Theoretical Physics: Quantum Mechanics (Vol. 3)",
							"Cohen-Tannoudji, Diu & Laloe - Quantum Mechanics (Volumes I & II)",
							"J. D. Jackson - Classical Electrodynamics (3rd Edition)",
							"S. Weinberg - The Quantum Theory of Fields (Vol. 1: Foundations)",
							"Arnold - Mathematical Methods of Classical Mechanics",
							"Pathria & Beale - Statistical Mechanics",
							"Nakahara - Geometry, Topology and Physics (2nd Edition)"
						], rng);
						const barcode = "BU-GM-" + pickInt(104820, 998420, rng);
						return {
							subject: fill("BU Grands Moulins: Loan renewal confirmed ({barcode})", { barcode }),
							body: `
								<p>Hello Colin,</p>
								<p>Your library loan has been renewed for the following academic work:</p>
								<div style="background: #f0f4f8; border: 1px solid #d9e2ec; border-radius: 4px; padding: 12px; margin: 12px 0; font-size: 12px;">
									<div><strong>Title:</strong> ${book}</div>
									<div><strong>Barcode:</strong> ${barcode}</div>
									<div><strong>Location:</strong> Bibliotheque Universitaire des Grands Moulins (Floor 4 - Physics &amp; Mathematics)</div>
									<div><strong>New Due Date:</strong> 30 days from current date</div>
								</div>
								<p>You can manage your current loans and requests via your university student portal.</p>
								<p>Best regards,<br>Circulation Desk &bull; Bibliotheque des Grands Moulins</p>
							`
						};
					}
				]
			},
			{
				id: "digitalSignalProcessingAndAudio",
				senders: [
					{ name: "SoundCloud Creator Insights", address: "stats@soundcloud.com" },
					{ name: "Audio Engineering Society", address: "aes-digest@aes.org" },
					{ name: "Faust DSP Compiler Core", address: "compiler@faust.grame.fr" },
					{ name: "WebAudio Community Group", address: "dsp@webaudio-community.org" }
				],
				scenarios: [
					(rng) => {
						const track = pick(audioTracks, rng);
						const plays = pickInt(840, 6800, rng);
						const likes = pickInt(42, 380, rng);
						const reposts = pickInt(12, 94, rng);
						const topCity = pick(["Paris", "Berlin", "London", "Tokyo", "Montreal"], rng);
						return {
							subject: fill("SoundCloud Weekly Stats: {plays} plays for \"{track}\"", { plays, track }),
							body: `
								<p>Your electronic and ambient compositions received substantial listener engagement over the past week.</p>
								<div style="background: #fff8f5; border: 1px solid #fed7c2; border-radius: 6px; padding: 14px; margin: 12px 0;">
									<div style="font-size: 14px; font-weight: bold; color: #ff5500; margin-bottom: 8px;">"${track}"</div>
									<div style="display: flex; gap: 20px; font-size: 12px; font-family: monospace;">
										<div><strong>Plays:</strong> ${plays.toLocaleString()}</div>
										<div><strong>Likes:</strong> ${likes}</div>
										<div><strong>Reposts:</strong> ${reposts}</div>
									</div>
									<div style="margin-top: 8px; font-size: 12px; color: #57606a;">Top listener region: <strong>${topCity}</strong> (54% completion rate)</div>
								</div>
								<p>Keep exploring experimental sound design and algorithmic synthesis architectures.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">SoundCloud Creator Community</p>
							`
						};
					},
					(rng) => {
						const track = pick(audioTracks, rng);
						const sampleRate = pick([44100, 48000, 96000], rng);
						const latency = pickFloat(1.2, 3.8, 2, rng);
						return {
							subject: fill("Faust DSP: Real-time synthesis engine transpiled for {track}", { track }),
							body: `
								<p>The polyphonic DSP engine for <strong>${track}</strong> was transpiled from Faust functional code to optimized C++ / WebAssembly.</p>
								<div style="background: #f6f8fa; border: 1px solid #d0d7de; padding: 10px 14px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px; line-height: 1.5;">
									<div>Audio Sample Rate: ${sampleRate} Hz (32-bit floating point)</div>
									<div>Buffer Size: 128 samples per audio quantum</div>
									<div>Round-trip Audio Latency: <strong>${latency} ms</strong></div>
									<div>Filter Topology: Non-linear Zero-Delay Feedback (ZDF) 4-pole Ladder Filter</div>
									<div>CPU Load per Voice: &lt; 0.18% of single core</div>
								</div>
								<p>Zero buffer underruns were detected during the real-time audio benchmark.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Faust Functional Audio Stream DSP Architecture &bull; GRAME</p>
							`
						};
					}
				]
			},
			{
				id: "scientificHistoryAndCulture",
				senders: [
					{ name: "Institut Henri Poincare Archives", address: "annonces@ihp.fr" },
					{ name: "Royal Society Publishing", address: "archives@royalsocietypublishing.org" },
					{ name: "History of Science Forum", address: "bulletin@physics-history.org" },
					{ name: "Académie des Sciences", address: "archives@academie-sciences.fr" }
				],
				scenarios: [
					(rng) => {
						const subjectMatter = pick([
							"Poincare's Original Memoir on the Three-Body Problem (1889)",
							"The Centenary of the 1927 Solvay Conference on Electrons and Photons",
							"Maxwell's Mechanical Ether Models and the Genesis of Displacement Current (1865)",
							"Boltzmann's H-Theorem and the Microscopic Foundations of Irreversibility (1872)",
							"Euler-Lagrange Variational Principles across Classical and Wave Optics",
							"Emmy Noether's Invariant Variational Problems and Conservation Laws (1918)",
							"Paul Dirac's Relativistic Wave Equation of the Electron (1928)"
						], rng);
						return {
							subject: fill("Historical Archives: Digitized manuscript on {subjectMatter}", { subjectMatter }),
							body: `
								<p>The Historical Archives Department has released an open-access digitized dossier:</p>
								<div style="background: #fbfbf8; border: 1px solid #e2e0d8; border-radius: 4px; padding: 12px; margin: 12px 0;">
									<div style="font-size: 13px; font-weight: bold; color: #4a4438; margin-bottom: 6px;">${subjectMatter}</div>
									<p style="font-size: 12px; color: #5a5448; margin: 0; line-height: 1.5;">
										Includes high-resolution manuscript scans, transcribed original equations, and critical commentary tracing the development of foundational mathematical and theoretical physics concepts.
									</p>
								</div>
								<p>High-resolution facsimile plates are available for research in the digital library repository.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Bibliotheque Henri Poincare &bull; Institut Henri Poincare (IHP), Paris</p>
							`
						};
					}
				]
			},
			{
				id: "infrastructureAndHomelab",
				senders: [
					{ name: "OpenZFS Storage Subsystem", address: "zfs-monitor@storage.wartets.local" },
					{ name: "Private Git Infrastructure", address: "git-admin@wartets.local" },
					{ name: "WireGuard Mesh Gateway", address: "gateway@vpn.wartets.net" },
					{ name: "Proxmox VE Cluster Node", address: "pve-daemon@node01.wartets.local" }
				],
				scenarios: [
					(rng) => {
						const scannedTb = pickFloat(2.8, 8.4, 2, rng);
						const rateMB = pickInt(380, 720, rng);
						const hours = pickInt(1, 4, rng);
						const mins = pickInt(10, 55, rng);
						return {
							subject: "ZFS Pool Status: Scrub finished on pool 'tank0' (0 errors)",
							body: `
								<p>The automated data integrity scrub completed successfully on storage pool <code>tank0</code>.</p>
								<div style="background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 4px; padding: 10px 14px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px; line-height: 1.5;">
									<div>Pool State: <strong>ONLINE</strong></div>
									<div>Scrubbed: ${scannedTb} TiB in ${hours}h ${mins}m with an average throughput of ${rateMB} MB/s</div>
									<div>Read Errors: <strong>0</strong></div>
									<div>Write Errors: <strong>0</strong></div>
									<div>Checksum Inconsistencies: <strong>0 (Clean parity)</strong></div>
									<div>Datasets: /tank0/research, /tank0/simulations, /tank0/archives</div>
								</div>
								<p>All cryptographic Fletcher4 checksums match block allocation tables across the mirror vdev array.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">OpenZFS Storage Subsystem &bull; Homelab Node</p>
							`
						};
					},
					(rng) => {
						const repo = pick(repoNames, rng);
						const hash = formatHex(pickInt(0x1000000, 0xFFFFFFF, rng), 7).toLowerCase();
						return {
							subject: fill("[Git Snapshot] Offsite backup synchronized for {repo}", { repo }),
							body: `
								<p>Automated offsite differential backup completed for repository <strong>${repo}</strong>.</p>
								<div style="background: #f6f8fa; border: 1px solid #d0d7de; padding: 10px; margin: 10px 0; font-family: Consolas, monospace; font-size: 12px;">
									<div>Commit HEAD: <code>${hash}</code> (refs/heads/main)</div>
									<div>Encrypted target: remote-cold-storage:backups/git/${repo}.bundle.gpg</div>
									<div>Deduplication ratio: 2.84x &bull; SHA-256 integrity verified</div>
								</div>
								<p>Local working trees and computational datasets remain fully synchronized.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Automated Backup Daemon &bull; Local Infrastructure</p>
							`
						};
					}
				]
			}
		];

		const rng = mulberry32(djb2("procedural-email-stream::" + String(dateKey) + "::" + String(offsetIndex)));
		const category = pick(categories, rng);
		const sender = pick(category.senders, rng);
		const scenario = pick(category.scenarios, rng);
		const result = scenario(rng);

		return {
			from: sender.name,
			fromAddress: sender.address,
			subject: result.subject,
			body: result.body
		};
	},

	generateDailyBatch: function(dateKey, count = 2) {
		const emails = [];
		for (let i = 0; i < count; i++) {
			emails.push(this.generateProceduralEmail(dateKey, i));
		}
		return emails;
	}
};
