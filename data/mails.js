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

	generateProceduralEmail: function(dateKey) {
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
			if (typeof title === 'string') return title;
			if (title && typeof title === 'object') return title.en || title.fr || Object.values(title)[0] || '';
			return '';
		}

		function getProjectRepoNames() {
			try {
				if (typeof projects === 'undefined') return [];
				return projects.flat()
					.filter(p => typeof p === 'object' && p !== null && p.github && p.title)
					.map(p => resolveProjectTitle(p.title))
					.filter(Boolean);
			} catch (error) {
				return [];
			}
		}

		function getLibraryDocumentTitles() {
			try {
				if (typeof window.libraryData === 'undefined' || !window.libraryData.documents) return [];
				return window.libraryData.documents
					.filter(d => d.show !== false && d.title)
					.map(d => (d.title && typeof d.title === 'object') ? (d.title.en || d.title.fr || Object.values(d.title)[0]) : d.title)
					.filter(Boolean);
			} catch (error) {
				return [];
			}
		}

		const fallbackRepoNames = [
			"Lenia GPU Continuous Automata",
			"Symplectic N-Body Integrator",
			"2D Navier-Stokes Spectral Solver",
			"FDTD Electromagnetic Waveguide Simulator",
			"TikZ Physics Quantum Circuit Exporter",
			"Ising Model MCMC Critical Exponent Engine",
			"Rayleigh-Benard Convection Spectral Analyzer",
			"WebGPU Particle Vortex Simulator",
			"Diffraction Pattern Wavefront Synthesizer",
			"Origami Metric Tensor Deformation Engine"
		];

		const fallbackPaperTitles = [
			"Rapport de stage MPQ-QITE : Sources de photons intriques",
			"Construction progressive du modele standard en theorie quantique des champs",
			"Symplectic geometry and invariant tori in chaotic Hamiltonian dynamics",
			"Topological defects in two-dimensional continuous cellular automata",
			"Numerical investigation of turbulence cascades in forced 2D Navier-Stokes flows",
			"Etude experimentale des etats de Bell dans un guide d'onde non-lineaire"
		];

		const repoNames = getProjectRepoNames().length ? getProjectRepoNames() : fallbackRepoNames;
		const paperTitles = getLibraryDocumentTitles().length ? getLibraryDocumentTitles() : fallbackPaperTitles;

		const physicsTopics = [
			"cavity quantum electrodynamics",
			"topological insulators and Majorana modes",
			"non-equilibrium statistical mechanics",
			"quantum tomography of Bell states",
			"renormalization group flow in conformal field theories",
			"symplectic integrators for relativistic geodesics",
			"Bose-Einstein condensates in optical lattices",
			"hydrodynamic quantum analog systems",
			"path integrals on Riemannian manifolds",
			"fractional quantum Hall edge states"
		];

		const simulationKernels = [
			"compute_lenia_conv_k4<<<grid, threads, smem>>>(field_in, field_out, dt);",
			"integrate_symplectic_yoshida4_step<<<dim3(64,64), 256>>>(q_pos, p_mom, mass, G_const, N_bodies);",
			"spectral_navierstokes_fft2d_plan_execute(plan_c2c, vorticity_hat, streamfunction_hat);",
			"fdtd_pml_update_ez_hx_hy<<<blocks, threads>>>(Ez, Hx, Hy, sigma_pml, dt_eps0);",
			"ising_metropolis_checkerboard_sublattice<<<mesh, warp_size>>>(spin_lattice, temperature, rng_seed);"
		];

		const serverNodes = ["mesocentre-node04.cluster.u-paris.fr", "mpq-compute-node12.local", "inria-grid5000-talence-08", "lab-hpc-node01.in2p3.fr"];
		const instruments = ["Oxford Triton 200 Dilution Refrigerator", "Thorlabs Octavius Femtosecond Titanium:Sapphire Laser", "PicoQuant HydraHarp 400 TCSPC Module", "Andor iXon Ultra 888 EMCCD Camera", "Keysight N5183B MXG Microwave Analog Signal Generator"];
		const audioTracks = ["Phase Transition in D Minor", "Projet 27 (Fourier Resynthesis)", "Continuous Lenia Oscillations", "Cavity QED Ambient Study", "Hypocritical World Nostalgia", "Projet 12 (Modular Patch)", "Entropy Drift in C Major"];
		const colloqHalls = ["Amphitheatre Buffon", "Amphitheatre Turing", "Salle Luc Valentin (MPQ)", "Amphi Hermite (Institut Henri Poincare)", "Auditorium Pierre-Gilles de Gennes"];
		const academicReviewJournals = ["Physical Review Letters", "Journal of High Energy Physics", "Physical Review E", "Journal of Computational Physics", "Communications in Mathematical Physics", "Quantum Science and Technology"];

		const categories = [
			{
				id: "highPerformanceComputing",
				senders: [
					{ name: "Mesocentre Slurm Orchestrator", address: "slurm-daemon@cluster.u-paris.fr" },
					{ name: "NVIDIA Compute Telemetry", address: "alerts@developer.nvidia.com" },
					{ name: "MPQ Lab Computing Cluster", address: "node-admin@mpq.univ-paris-diderot.fr" },
					{ name: "Grid5000 Infrastructure", address: "operations@grid5000.fr" },
					{ name: "Open Science Grid", address: "accounting@opensciencegrid.org" }
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
								<p>Your queued batch job on cluster node <code>${node}</code> has finished executing with return code <code>0 (EXIT_SUCCESS)</code>.</p>
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
								<p>Log files and binary checkpoint tensors have been synced to your local scratch directory. You can visualize the convergence graphs directly in the analytics dashboard.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">This is an automated operational notification dispatched by the Slurm Workload Manager. No response is required.</p>
							`
						};
					},
					(rng) => {
						const repo = pick(repoNames, rng);
						const kernel = pick(simulationKernels, rng);
						const errorAddr = "0x00007FFF" + formatHex(pickInt(0x100000, 0xFFFFFF, rng), 6);
						const allocatedMb = pickInt(12400, 31800, rng);
						return {
							subject: fill("[CUDA OOM Alert] Kernel fault encountered in {repo}", { repo }),
							body: `
								<p>The GPU runtime monitor detected an unhandled device memory exception while executing the compute pipeline for <strong>${repo}</strong>.</p>
								<div style="background: #fff8f7; border-left: 4px solid #cf222e; padding: 10px 14px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px;">
									<div><strong style="color: #cf222e;">CUDA_ERROR_OUT_OF_MEMORY (Error Code 2)</strong></div>
									<div>Failed allocation: 4096 &times; 4096 &times; 128 single-precision complex tensor (${allocatedMb} MiB requested)</div>
									<div>Faulting execution pointer: ${errorAddr}</div>
									<div>Kernel signature: <code>${kernel}</code></div>
								</div>
								<p>Recommended mitigation steps:</p>
								<ul style="line-height: 1.5; font-size: 13px;">
									<li>Enable domain decomposition and distribute the spatial grid across multiple GPU ranks using <code>NCCL</code> peer-to-peer transfers.</li>
									<li>Switch internal spectral buffers from <code>Float64</code> to <code>Float32</code> mixed-precision FP16 Tensor Core arithmetic where numerical dissipation permits.</li>
									<li>Activate gradient checkpointing or intermediate buffer reuse before launching the next epoch.</li>
								</ul>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Cluster Compute Telemetry Service &bull; Universite Paris Cite HPC Infrastructure</p>
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
								<p>The nightly automated benchmarking suite has completed execution for <strong>${repo}</strong>. A significant parallelization speedup has been recorded on the current hardware matrix.</p>
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
								<p>Memory bandwidth saturation reached 82.4% of peak theoretic throughput on the WebGPU pipeline without register spilling. Full profiler traces are available in the repository benchmarking artifacts.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Automated Benchmark Suite &bull; High Performance Computing Working Group</p>
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
					{ name: "Optical Cavity Piezo Monitor", address: "piezo-servolock@physics-hardware.local" }
				],
				scenarios: [
					(rng) => {
						const tempMk = pickFloat(11.2, 16.8, 2, rng);
						const magnetTesla = pickFloat(0.0, 6.5, 3, rng);
						const pHe3 = pickFloat(142.1, 168.4, 1, rng);
						const instrument = pick(instruments, rng);
						return {
							subject: fill("[Lab Telemetry] Cryostat thermal equilibrium reached: {tempMk} mK", { tempMk }),
							body: `
								<p>The temperature stabilization servo on <strong>${instrument}</strong> reports nominal base temperature conditions in the mixing chamber.</p>
								<div style="background: #f0f8ff; border: 1px solid #b6d4fe; border-radius: 4px; padding: 12px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px; line-height: 1.6;">
									<div><strong>Mixing Chamber (RuO<sub>2</sub> sensor):</strong> ${tempMk} mK (&plusmn;0.04 mK drift / hr)</div>
									<div><strong>Still Temperature:</strong> 742.8 mK</div>
									<div><strong>4K Stage Pulse Tube:</strong> 3.21 K</div>
									<div><strong>3He/4He Still Pressure:</strong> ${pHe3} mbar</div>
									<div><strong>Superconducting Solenoid Field:</strong> B<sub>z</sub> = ${magnetTesla} T</div>
									<div><strong>Cryopump Status:</strong> Regenerated, ultra-high vacuum &lt; 1.4 &times; 10<sup>-8</sup> mbar</div>
								</div>
								<p>Optical windows are clear and thermal shielding alignment shows zero parasitic infrared leakage. The system is ready for spectroscopy and quantum state tomography acquisitions.</p>
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
								<p>The continuous acquisition run on the spontaneous parametric down-conversion (SPDC) source has completed single-photon coincidence counting.</p>
								<div style="background: #fbf0ea; border-left: 4px solid #bc4c00; padding: 10px 14px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px;">
									<div>Non-linear crystal: <strong>${crystal}</strong> (Type-II phase matching at 405 nm &rarr; 810 nm)</div>
									<div>Coincidence rate: <strong>${coincidences} pairs / second</strong></div>
									<div>Second-order correlation: <strong>g<sup>(2)</sup>(0) = ${g2Zero} &plusmn; 0.002</strong> (Strong photon anti-bunching)</div>
									<div>CHSH Bell inequality parameter: <strong style="color: #0969da;">S = ${bellS} &plusmn; 0.014</strong></div>
									<div>Violation threshold: S &gt; 2 (Exceeds classical limit by &gt; 48 &sigma;)</div>
								</div>
								<p>State tomography confirms polarization entanglement fidelity &ge; 98.4% with respect to the maximally entangled singlet state |&Psi;<sup>&minus;</sup>&rang; = (|HV&rang; &minus; |VH&rang;) / &radic;2.</p>
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
					}
				]
			},
			{
				id: "theoreticalPhysicsAndArxiv",
				senders: [
					{ name: "arXiv Mail Server", address: "no-reply@arxiv.org" },
					{ name: "Physical Review Letters", address: "prl-editorial@aps.org" },
					{ name: "Journal of Mathematical Physics", address: "jmp-alerts@aip.org" },
					{ name: "CERN Document Server", address: "cds-alerts@cern.ch" },
					{ name: "Springer Quantum", address: "alerts@springernature.com" }
				],
				scenarios: [
					(rng) => {
						const topic = pick(physicsTopics, rng);
						const arxivId1 = "2608." + String(pickInt(10000, 99999, rng));
						const arxivId2 = "2608." + String(pickInt(10000, 99999, rng));
						return {
							subject: fill("arXiv Daily Digest: quant-ph / math-ph / physics.comp-ph ({topic})", { topic }),
							body: `
								<p>Here is your tailored daily arXiv digest for <strong>quant-ph</strong>, <strong>math-ph</strong>, and <strong>physics.comp-ph</strong>:</p>
								<div style="border-top: 1px solid #d0d7de; padding: 10px 0; margin-top: 8px;">
									<div style="font-size: 13px; font-weight: bold; color: #0969da;">
										<a href="https://arxiv.org/abs/${arxivId1}" style="text-decoration: none; color: #0969da;">arXiv:${arxivId1}</a>: Emergent Gauge Fields and Solitonic Modes in Extended ${topic}
									</div>
									<div style="font-size: 11px; color: #57606a; margin: 2px 0;">Authors: M. V. Berry, C. Rovelli, A. Aspect, et al.</div>
									<p style="font-size: 12px; margin: 4px 0; color: #24292f;">We demonstrate an exact mapping between localized non-linear eigenmodes and topological soliton invariants under discrete conformal symmetry breaking...</p>
								</div>
								<div style="border-top: 1px solid #d0d7de; padding: 10px 0; margin-top: 8px;">
									<div style="font-size: 13px; font-weight: bold; color: #0969da;">
										<a href="https://arxiv.org/abs/${arxivId2}" style="text-decoration: none; color: #0969da;">arXiv:${arxivId2}</a>: High-Order Symplectic Geometric Integrators for Non-Abelian Gauge Systems
									</div>
									<div style="font-size: 11px; color: #57606a; margin: 2px 0;">Authors: J. M. Sanz-Serna, E. Hairer, C. Bossu Reaubourg, et al.</div>
									<p style="font-size: 12px; margin: 4px 0; color: #24292f;">We present an explicit multi-stage geometric integration scheme that strictly preserves Casimir invariants and total phase space volume over long-time numerical simulations...</p>
								</div>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Delivered to your inbox based on your tracked subjects: [quant-ph, math-ph, physics.comp-ph, cond-mat.mes-hall].</p>
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
								<p>We would like to invite you to act as a peer reviewer for a manuscript recently submitted to <strong>${journal}</strong>.</p>
								<div style="background: #f6f8fa; border-left: 3px solid #0969da; padding: 10px 14px; margin: 12px 0; font-size: 12px;">
									<div><strong>Manuscript ID:</strong> ${manuscriptId}</div>
									<div><strong>Title:</strong> Exact Numerical Bounds and Spectral Signatures in ${topic}</div>
									<div><strong>Track:</strong> Computational &amp; Theoretical Physics</div>
								</div>
								<p>Given your recent work and computational expertise in numerical simulations and symplectic solvers, your assessment would be invaluable to our editorial decision.</p>
								<p>Please reply within 5 business days to confirm whether you are available to evaluate this submission (standard review period: 4 weeks).</p>
								<p>Sincerely,<br>The Editorial Board<br><em>${journal}</em></p>
							`
						};
					},
					(rng) => {
						const paper = pick(paperTitles, rng);
						const citingJournal = pick(academicReviewJournals, rng);
						const year = 2026;
						return {
							subject: fill("Citation Alert: \"{paper}\" cited in {citingJournal}", { paper, citingJournal }),
							body: `
								<p>Your work has been cited in a new publication indexed in the academic literature database:</p>
								<div style="background: #f0f6ff; border: 1px solid #c8e1ff; border-radius: 4px; padding: 12px; margin: 12px 0; font-size: 12px;">
									<div style="color: #57606a;">Cited Document:</div>
									<div style="font-weight: bold; margin-bottom: 8px;">"${paper}"</div>
									<div style="color: #57606a;">Citing Article:</div>
									<div style="font-style: italic;">"Advances in Non-Linear Hamiltonian Dynamics and Discrete Lattice Solitons", <em>${citingJournal}</em> (${year}).</div>
									<div style="margin-top: 6px; font-family: monospace; font-size: 11px;">DOI: 10.1103/PhysRevLett.136.${pickInt(100000, 999999, rng)}</div>
								</div>
								<p>You can view full citation analytics and metrics from your institutional publication dashboard.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Citation Tracking Service &bull; Academic Metrics Network</p>
							`
						};
					}
				]
			},
			{
				id: "astrophysicsAndCosmology",
				senders: [
					{ name: "LIGO-Virgo-KAGRA Alert Network", address: "alerts@emfollow.ligo.org" },
					{ name: "NASA Exoplanet Archive", address: "nexsci-alerts@ipac.caltech.edu" },
					{ name: "ESA Gaia Operations", address: "gaia-processing@cosmos.esa.int" },
					{ name: "Strasbourg Astronomical Data Center", address: "simbad-bot@unistra.fr" }
				],
				scenarios: [
					(rng) => {
						const triggerId = "S2608" + formatHex(pickInt(0x1000, 0xFFFF, rng), 4);
						const ra = pickFloat(12.0, 23.9, 2, rng);
						const dec = (pickFloat(-65.0, 65.0, 2, rng) > 0 ? "+" : "") + pickFloat(-65.0, 65.0, 2, rng);
						const far = "1.42e-" + pickInt(10, 16, rng);
						const mass1 = pickFloat(28.4, 42.1, 1, rng);
						const mass2 = pickFloat(19.2, 31.8, 1, rng);
						return {
							subject: fill("[GCN Circular] LVC Gravitational Wave Trigger Alert: {triggerId}", { triggerId }),
							body: `
								<p>The LIGO-Virgo-KAGRA detector network identified a candidate gravitational-wave transient event during real-time matched filtering analysis.</p>
								<div style="background: #0d1117; color: #c9d1d9; border-radius: 4px; padding: 12px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px; line-height: 1.5;">
									<div><span style="color: #79c0ff;">TRIGGER_ID:</span> ${triggerId}</div>
									<div><span style="color: #79c0ff;">EVENT_CLASS:</span> Binary Black Hole (BBH) &gt; 99.8% probability</div>
									<div><span style="color: #79c0ff;">FALSE_ALARM_RATE:</span> ${far} Hz (1 per &gt; 100,000 years)</div>
									<div><span style="color: #79c0ff;">ESTIMATED_MASSES:</span> m1 &approx; ${mass1} M<sub>&odot;</sub>, m2 &approx; ${mass2} M<sub>&odot;</sub></div>
									<div><span style="color: #79c0ff;">SKY_LOCALIZATION:</span> RA = ${ra}h, Dec = ${dec}&deg; (90% area: 18.4 deg<sup>2</sup>)</div>
									<div><span style="color: #79c0ff;">LUMINOSITY_DISTANCE:</span> d<sub>L</sub> = ${(pickInt(420, 1850, rng))} Mpc (z &approx; 0.14)</div>
								</div>
								<p>Electromagnetic follow-up telescope coordinates and bayestar sky localization probability FITS maps are available on the GraceDB alert clearinghouse.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Gamma-ray Coordinates Network / LVC Scientific Collaboration</p>
							`
						};
					},
					(rng) => {
						const starName = "TIC-" + pickInt(1048200, 9984200, rng);
						const period = pickFloat(1.42, 14.85, 3, rng);
						const depthPpm = pickInt(240, 1820, rng);
						const radiusEarth = pickFloat(0.85, 2.45, 2, rng);
						return {
							subject: fill("TESS Alert: New Exoplanet Candidate identified ({starName})", { starName }),
							body: `
								<p>The photometric transit search pipeline flagged a periodic dip in the light curve of host star <strong>${starName}</strong>.</p>
								<div style="background: #f6f8fa; border: 1px solid #d0d7de; padding: 10px 14px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px; line-height: 1.6;">
									<div>Host Star: <strong>${starName}</strong> (Spectral Type G2V, V = 10.4 mag)</div>
									<div>Orbital Period: <strong>P = ${period} days</strong> (&plusmn;0.0001 d)</div>
									<div>Transit Depth: <strong>&delta; = ${depthPpm} ppm</strong></div>
									<div>Inferred Planetary Radius: <strong>R<sub>p</sub> = ${radiusEarth} R<sub>&oplus;</sub></strong></div>
									<div>Equilibrium Temperature: <strong>T<sub>eq</sub> &approx; ${(pickInt(280, 540, rng))} K</strong></div>
								</div>
								<p>High-resolution radial velocity spectroscopy is scheduled with the ESPRESSO spectrograph on the VLT to constrain the companion planet's dynamical mass.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">NASA Exoplanet Science Institute &bull; Caltech / IPAC</p>
							`
						};
					}
				]
			},
			{
				id: "computationalMathematicsAndSimulation",
				senders: [
					{ name: "Julia Computing Ecosystem", address: "notifications@julialang.org" },
					{ name: "Scientific Machine Learning (SciML)", address: "benchmarks@sciml.ai" },
					{ name: "Wolfram Research MathKernel", address: "kernel-daemon@wolfram.com" },
					{ name: "OpenBLAS Core Team", address: "dev@openblas.net" }
				],
				scenarios: [
					(rng) => {
						const repo = pick(repoNames, rng);
						const steps = pickInt(10, 100, rng) * 1000000;
						const energyDrift = "1." + pickInt(10, 99, rng) + "e-" + pickInt(12, 16, rng);
						const angularMomentumDrift = "3." + pickInt(10, 99, rng) + "e-" + pickInt(14, 18, rng);
						return {
							subject: fill("Symplectic Conservation Verification: {repo}", { repo }),
							body: `
								<p>The long-time numerical stability verification completed over <strong>${steps.toLocaleString()}</strong> integration steps for <strong>${repo}</strong>.</p>
								<div style="background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 4px; padding: 12px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px; line-height: 1.6;">
									<div><strong>Integrator Scheme:</strong> 4th-Order Symplectic Partitioned Runge-Kutta (Yoshida / Forest-Ruth)</div>
									<div><strong>Phase Space Dimension:</strong> 6N (N = ${(pickInt(3, 12, rng))} bodies)</div>
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
									<div>Vorticity Filaments: Stable vortex mergers observed in physical domain</div>
								</div>
								<p>Raw binary fields and kinetic energy spectrum power-law fits have been serialized to the project directory.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Computational Fluid Dynamics &amp; Spectral Methods Group</p>
							`
						};
					}
				]
			},
			{
				id: "softwareDevelopmentAndTooling",
				senders: [
					{ name: "GitHub Actions", address: "notifications@github.com" },
					{ name: "Rust Crates Registry", address: "crates-admin@rust-lang.org" },
					{ name: "WebGPU Working Group", address: "gpuweb-tracker@w3.org" },
					{ name: "LLVM Buildbot", address: "llvm-ci@llvm.org" }
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
									<p style="font-size: 12px; margin: 0; color: #57606a;">"This patch replaces the naive scalar loop with explicit SIMD intrinsics and adds an asynchronous compute pipeline descriptor for modern WebGPU hardware adapters. Benchmark shows ~4.2x speedup on large spatial domains."</p>
								</div>
								<div style="font-family: monospace; font-size: 11px; color: #1a7f37;">&check; All continuous integration tests passed (4 targets, 0 errors, 0 memory leaks).</div>
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
								<p>Version <strong>v${version}</strong> of <strong>${repo}</strong> has been tagged and compiled successfully across all release architectures.</p>
								<div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; padding: 10px 14px; margin: 12px 0; font-size: 12px;">
									<div style="font-weight: bold; color: #166534; margin-bottom: 4px;">Changelog Highlights:</div>
									<ul style="margin: 0; padding-left: 20px; line-height: 1.5;">
										<li>Optimized continuous kernel convolutions with shared memory caching.</li>
										<li>Export high-resolution simulation state to VTK / HDF5 / PNG tensor slices.</li>
										<li>Integrated interactive parameter tuning interface with real-time spectrum visualization.</li>
									</ul>
								</div>
								<p>Binaries and WebAssembly build artifacts have been published to the content delivery network.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Automated Release Bot &bull; Open Source Software Registry</p>
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
					{ name: "Overleaf Academic LaTeX", address: "notifications@overleaf.com" },
					{ name: "Bibliotheque Universitaire Grands Moulins", address: "bu.grandsmoulins@u-paris.fr" }
				],
				scenarios: [
					(rng) => {
						const hall = pick(colloqHalls, rng);
						const speaker = pick(["Prof. Alain Aspect", "Prof. Serge Haroche", "Dr. Sara Ducci", "Prof. Jean Dalibard", "Prof. Carlo Rovelli"], rng);
						const topic = pick(physicsTopics, rng);
						const time = pick(["11:00", "14:00", "16:30"], rng);
						return {
							subject: fill("Colloque de Physique: {speaker} on {topic}", { speaker, topic }),
							body: `
								<p>Bonjour,</p>
								<p>The Physics Department of Universite Paris Cite and Laboratoire MPQ are pleased to invite you to the upcoming departmental colloquium:</p>
								<div style="background: #fdf6ec; border-left: 4px solid #e6a23c; padding: 12px 16px; margin: 12px 0;">
									<div style="font-size: 14px; font-weight: bold; color: #303133;">"${topic}: From Fundamental Quantum Principles to Modern Experimental Realizations"</div>
									<div style="margin-top: 6px; font-size: 12px; color: #606266;">Speaker: <strong>${speaker}</strong></div>
									<div style="font-size: 12px; color: #606266;">Location: <strong>${hall}</strong>, Batiment Condorcet / Halle aux Farines</div>
									<div style="font-size: 12px; color: #606266;">Schedule: Thursday at <strong>${time}</strong> (followed by discussion and coffee)</div>
								</div>
								<p>Master students, PhD candidates, and laboratory researchers are warmly encouraged to attend.</p>
								<p>Cordialement,<br>Le Secretariat General de l'UFR de Physique<br>Universite Paris Cite</p>
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
								<p>Your collaborative project <strong>"${paper}"</strong> has compiled successfully on the TeX Live 2026 rendering engine.</p>
								<div style="background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 4px; padding: 10px 14px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px; line-height: 1.5;">
									<div>Document Class: revtex4-2 / aps (Two-column format)</div>
									<div>Page count: ${pages} pages (${bibEntries} BibTeX references formatted)</div>
									<div>TikZ Diagrams: 14 vectorized vector graphics rendered via PGF/TikZ</div>
									<div>Compilation Status: 0 Errors, 0 Fatal Warnings, SyncTeX mapped</div>
								</div>
								<p>All collaborators can now view the latest synchronized PDF draft in the editor workspace.</p>
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
							"Pathria & Beale - Statistical Mechanics"
						], rng);
						const barcode = "BU-GM-" + pickInt(104820, 998420, rng);
						return {
							subject: fill("BU Grands Moulins: Loan renewal confirmed ({barcode})", { barcode }),
							body: `
								<p>Bonjour Colin,</p>
								<p>Your library loan has been successfully extended for the following treatise:</p>
								<div style="background: #f0f4f8; border: 1px solid #d9e2ec; border-radius: 4px; padding: 12px; margin: 12px 0; font-size: 12px;">
									<div><strong>Title:</strong> ${book}</div>
									<div><strong>Barcode Identifier:</strong> ${barcode}</div>
									<div><strong>Location:</strong> Bibliotheque Universitaire des Grands Moulins (Etage 4 - Sciences &amp; Physique)</div>
									<div><strong>New Return Deadline:</strong> 30 days from current date</div>
								</div>
								<p>You can manage all your active loans and reservations directly from your student portal.</p>
								<p>Cordialement,<br>Service du Pret &bull; Bibliotheque des Grands Moulins</p>
							`
						};
					}
				]
			},
			{
				id: "digitalSignalProcessingAndAudio",
				senders: [
					{ name: "SoundCloud Insights", address: "stats@soundcloud.com" },
					{ name: "Audio Engineering Society", address: "aes-digest@aes.org" },
					{ name: "Faust DSP Compiler", address: "compiler@faust.grame.fr" },
					{ name: "WebAudio Developer Network", address: "dsp@webaudio-community.org" }
				],
				scenarios: [
					(rng) => {
						const track = pick(audioTracks, rng);
						const plays = pickInt(840, 6800, rng);
						const likes = pickInt(42, 380, rng);
						const reposts = pickInt(12, 94, rng);
						const topCity = pick(["Paris", "Berlin", "London", "Tokyo", "Montreal"], rng);
						return {
							subject: fill("SoundCloud Weekly Report: {plays} streams for \"{track}\"", { plays, track }),
							body: `
								<p>Your electronic and ambient compositions gained substantial listening traction over the past week.</p>
								<div style="background: #fff8f5; border: 1px solid #fed7c2; border-radius: 6px; padding: 14px; margin: 12px 0;">
									<div style="font-size: 14px; font-weight: bold; color: #ff5500; margin-bottom: 8px;">"${track}"</div>
									<div style="display: flex; gap: 20px; font-size: 12px; font-family: monospace;">
										<div><strong>Plays:</strong> ${plays.toLocaleString()}</div>
										<div><strong>Likes:</strong> ${likes}</div>
										<div><strong>Reposts:</strong> ${reposts}</div>
									</div>
									<div style="margin-top: 8px; font-size: 12px; color: #57606a;">Top listener hub: <strong>${topCity}</strong> (54% completion rate)</div>
								</div>
								<p>Keep sharing your experimental synthesis and algorithmic music projects with your audience.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">SoundCloud Creator Community Insights</p>
							`
						};
					},
					(rng) => {
						const track = pick(audioTracks, rng);
						const sampleRate = pick([44100, 48000, 96000], rng);
						const latency = pickFloat(1.2, 3.8, 2, rng);
						return {
							subject: fill("Faust DSP: Real-time synthesizer engine compiled for {track}", { track }),
							body: `
								<p>The real-time polyphonic audio DSP engine for <strong>${track}</strong> has been transpiled from Faust code to optimized C++ / WebAssembly.</p>
								<div style="background: #f6f8fa; border: 1px solid #d0d7de; padding: 10px 14px; margin: 12px 0; font-family: Consolas, monospace; font-size: 12px; line-height: 1.5;">
									<div>Audio Sample Rate: ${sampleRate} Hz (32-bit floating point)</div>
									<div>Buffer Size: 128 samples per audio quantum</div>
									<div>Round-trip Audio Latency: <strong>${latency} ms</strong></div>
									<div>Filter Topology: Non-linear Zero-Delay Feedback (ZDF) 4-pole Ladder Filter</div>
									<div>CPU Load per Voice: &lt; 0.18% of single core</div>
								</div>
								<p>Zero buffer underruns were detected during the stress testing cycle.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Faust Functional Audio Stream DSP Architecture &bull; GRAME</p>
							`
						};
					}
				]
			},
			{
				id: "scientificHistoryAndCulture",
				senders: [
					{ name: "Institut Henri Poincare", address: "annonces@ihp.fr" },
					{ name: "Royal Society Publishing", address: "archives@royalsocietypublishing.org" },
					{ name: "History of Physics Forum", address: "bulletin@physics-history.org" }
				],
				scenarios: [
					(rng) => {
						const subjectMatter = pick([
							"Poincare's Original Manuscripts on the Three-Body Problem (1889)",
							"The Centenary of the 1927 Solvay Conference on Electrons and Photons",
							"Maxwell's Mechanical Ether Models and the Genesis of Displacement Current",
							"Boltzmann's H-Theorem and the Microscopic Foundations of Irreversibility",
							"Euler-Lagrange Variational Principles across Classical and Geometric Optics"
						], rng);
						return {
							subject: fill("Archives & History: Digitized collection on {subjectMatter}", { subjectMatter }),
							body: `
								<p>The Historical Archives Department has published an open-access digitized dossier:</p>
								<div style="background: #fbfbf8; border: 1px solid #e2e0d8; border-radius: 4px; padding: 12px; margin: 12px 0;">
									<div style="font-size: 13px; font-weight: bold; color: #4a4438; margin-bottom: 6px;">${subjectMatter}</div>
									<p style="font-size: 12px; color: #5a5448; margin: 0; line-height: 1.5;">
										Featuring ultra-high resolution manuscript scans, transcribed lecture notes, and contemporary analytical commentaries on the evolution of mathematical and theoretical physics concepts.
									</p>
								</div>
								<p>All high-resolution facsimile plates are available for academic research and study in the library public repository.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Bibliotheque Henri Poincare &bull; Institut Henri Poincare (IHP), Paris</p>
							`
						};
					}
				]
			},
			{
				id: "infrastructureAndHomelab",
				senders: [
					{ name: "ZFS Storage Daemon", address: "zfs-monitor@storage.wartets.local" },
					{ name: "Private Git Service", address: "git-admin@wartets.local" },
					{ name: "WireGuard VPN Gateway", address: "gateway@vpn.wartets.net" }
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
								<p>The automated bi-weekly data integrity scrub completed successfully on pool <code>tank0</code>.</p>
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
							subject: fill("[Gitea] Backup snapshot synchronized for {repo}", { repo }),
							body: `
								<p>Automated offsite differential backup completed for repository <strong>${repo}</strong>.</p>
								<div style="background: #f6f8fa; border: 1px solid #d0d7de; padding: 10px; margin: 10px 0; font-family: Consolas, monospace; font-size: 12px;">
									<div>Commit HEAD: <code>${hash}</code> (refs/heads/main)</div>
									<div>Encrypted target: remote-cold-storage:backups/git/${repo}.bundle.gpg</div>
									<div>Deduplication ratio: 2.84x &bull; SHA-256 integrity verified</div>
								</div>
								<p>Your local working trees and computational datasets remain fully synchronized.</p>
								<p style="font-size: 11px; color: #666; margin-top: 16px;">Local Infrastructure Automated Backup Daemon</p>
							`
						};
					}
				]
			}
		];

		const rng = mulberry32(djb2("procedural-email-stream::" + String(dateKey)));
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
	}
};
