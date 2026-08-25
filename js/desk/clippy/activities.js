(function () {
	'use strict';

	const STORAGE_KEY_TODOS = 'clippy_user_todos_v3';
	const STORAGE_KEY_PET = 'clippy_pet_state_v3';
	const STORAGE_KEY_NOTES = 'clippy_user_scratchpad_v3';

	function gammaLanczos(z) {
		if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gammaLanczos(1 - z));
		z -= 1;
		const p = [
			0.99999999999980993, 676.5203681218851, -1259.1392167224028,
			771.32342877765313, -176.61502916214059, 12.507343278686905,
			-0.13857109583115912, 9.9843695780195716e-6, 1.5056327351493116e-7
		];
		let x = p[0];
		for (let i = 1; i < p.length; i++) x += p[i] / (z + i);
		const t = z + p.length - 1.5;
		return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
	}

	function errorFunction(x) {
		const sign = (x >= 0) ? 1 : -1;
		x = Math.abs(x);
		const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
		const t = 1.0 / (1.0 + p * x);
		const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
		return sign * y;
	}

	function factorialInt(n) {
		n = Math.round(n);
		if (n < 0) return NaN;
		if (n === 0 || n === 1) return 1;
		let res = 1;
		for (let i = 2; i <= n; i++) res *= i;
		return res;
	}

	class WebGLPongActivity {
		constructor() {
			this.card = null;
			this.canvas = null;
			this.gl = null;
			this.ctx2d = null;
			this.program = null;
			this.quadBuffer = null;
			this.colorLocation = null;
			this.resolutionLocation = null;
			this.offsetLocation = null;
			this.scaleLocation = null;
			this.positionLocation = null;

			this.width = 300;
			this.height = 180;
			this.paddleWidth = 6;
			this.paddleHeight = 36;
			this.ballSize = 5;

			this.playerY = 72;
			this.clippyY = 72;
			this.playerScore = 0;
			this.clippyScore = 0;
			this.maxScore = 5;

			this.ballX = 150;
			this.ballY = 90;
			this.ballVx = 2.4;
			this.ballVy = 1.2;
			this.baseSpeed = 2.5;

			this.isRunning = false;
			this.isPaused = false;
			this.animationFrameId = null;
			this.lastTimestamp = 0;

			this.goalFlashTimer = 0;
			this.goalScorer = null;
			this.goalBannerText = '';
			this.isTrackingPointer = false;

			this.keys = { up: false, down: false };
			this.accumulator = 0;
			this.boundGameLoop = this.gameLoop.bind(this);
			this.boundKeyDown = this.handleKeyDown.bind(this);
			this.boundKeyUp = this.handleKeyUp.bind(this);
			this.boundPointerMove = this.handlePointerMove.bind(this);
			this.boundPointerDown = this.handlePointerDown.bind(this);
			this.boundPointerUp = this.handlePointerUp.bind(this);
		}

		mount() {
			this.cleanup();
			this.playerScore = 0;
			this.clippyScore = 0;
			this.goalFlashTimer = 0;
			this.goalScorer = null;
			this.goalBannerText = '';
			this.playerY = (this.height - this.paddleHeight) / 2;
			this.clippyY = (this.height - this.paddleHeight) / 2;
			this.resetBall(1);

			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('pong')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.pong) || { title: 'Pong', badge: 'Clippy\'s Court' });

			this.card = window.ClippyUI.createActivityCard(txt.title || 'Pong', txt.badge || 'Clippy\'s Court');
			this.render();
		}

		initWebGL() {
			if (!this.canvas) return false;
			this.gl = null;
			this.ctx2d = null;

			try {
				this.gl = this.canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, preserveDrawingBuffer: false })
					|| this.canvas.getContext('experimental-webgl');
			} catch (e) {
				this.gl = null;
			}

			if (!this.gl) {
				try {
					this.ctx2d = this.canvas.getContext('2d');
					return !!this.ctx2d;
				} catch (e) {
					return false;
				}
			}

			const gl = this.gl;
			const vsSource = `
				attribute vec2 a_position;
				uniform vec2 u_resolution;
				uniform vec2 u_offset;
				uniform vec2 u_scale;
				void main() {
					vec2 pixelPos = a_position * u_scale + u_offset;
					vec2 zeroToOne = pixelPos / u_resolution;
					vec2 clipSpace = (zeroToOne * 2.0) - 1.0;
					gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
				}
			`;
			const fsSource = `
				precision mediump float;
				uniform vec4 u_color;
				void main() {
					gl_FragColor = u_color;
				}
			`;

			const createShader = (type, src) => {
				const s = gl.createShader(type);
				gl.shaderSource(s, src);
				gl.compileShader(s);
				if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
					gl.deleteShader(s);
					return null;
				}
				return s;
			};

			const vs = createShader(gl.VERTEX_SHADER, vsSource);
			const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
			if (!vs || !fs) {
				this.gl = null;
				this.ctx2d = this.canvas.getContext('2d');
				return !!this.ctx2d;
			}

			this.program = gl.createProgram();
			gl.attachShader(this.program, vs);
			gl.attachShader(this.program, fs);
			gl.linkProgram(this.program);
			if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
				this.gl = null;
				this.ctx2d = this.canvas.getContext('2d');
				return !!this.ctx2d;
			}

			this.positionLocation = gl.getAttribLocation(this.program, 'a_position');
			this.resolutionLocation = gl.getUniformLocation(this.program, 'u_resolution');
			this.offsetLocation = gl.getUniformLocation(this.program, 'u_offset');
			this.scaleLocation = gl.getUniformLocation(this.program, 'u_scale');
			this.colorLocation = gl.getUniformLocation(this.program, 'u_color');

			const unitQuadVertices = new Float32Array([
				0.0, 0.0,
				1.0, 0.0,
				0.0, 1.0,
				0.0, 1.0,
				1.0, 0.0,
				1.0, 1.0
			]);

			this.quadBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, unitQuadVertices, gl.STATIC_DRAW);

			gl.viewport(0, 0, this.width, this.height);
			return true;
		}

		drawQuad(x, y, w, h, r = 1.0, g = 1.0, b = 1.0, a = 1.0) {
			if (this.gl && this.program) {
				const gl = this.gl;
				gl.uniform2f(this.offsetLocation, x, y);
				gl.uniform2f(this.scaleLocation, w, h);
				gl.uniform4f(this.colorLocation, r, g, b, a);
				gl.drawArrays(gl.TRIANGLES, 0, 6);
			} else if (this.ctx2d) {
				const red = Math.round(r * 255);
				const green = Math.round(g * 255);
				const blue = Math.round(b * 255);
				this.ctx2d.fillStyle = `rgba(${red}, ${green}, ${blue}, ${a})`;
				this.ctx2d.fillRect(x, y, w, h);
			}
		}

		drawDigit(digit, startX, startY, scale = 2) {
			const segments = {
				0: [1,1,1, 1,0,1, 1,0,1, 1,0,1, 1,1,1],
				1: [0,1,0, 1,1,0, 0,1,0, 0,1,0, 1,1,1],
				2: [1,1,1, 0,0,1, 1,1,1, 1,0,0, 1,1,1],
				3: [1,1,1, 0,0,1, 1,1,1, 0,0,1, 1,1,1],
				4: [1,0,1, 1,0,1, 1,1,1, 0,0,1, 0,0,1],
				5: [1,1,1, 1,0,0, 1,1,1, 0,0,1, 1,1,1],
				6: [1,1,1, 1,0,0, 1,1,1, 1,0,1, 1,1,1],
				7: [1,1,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1],
				8: [1,1,1, 1,0,1, 1,1,1, 1,0,1, 1,1,1],
				9: [1,1,1, 1,0,1, 1,1,1, 0,0,1, 1,1,1]
			};
			const grid = segments[digit] || segments[0];
			for (let row = 0; row < 5; row++) {
				for (let col = 0; col < 3; col++) {
					if (grid[row * 3 + col]) {
						this.drawQuad(startX + col * scale * 2, startY + row * scale * 2, scale * 2, scale * 2, 1.0, 1.0, 1.0, 0.85);
					}
				}
			}
		}

		renderScene() {
			if (this.gl && this.program) {
				const gl = this.gl;
				if (this.goalFlashTimer > 0) {
					const flashRatio = Math.max(0, Math.min(1, this.goalFlashTimer / 28));
					if (this.goalScorer === 'PLAYER') {
						gl.clearColor(0.0, 0.35 * flashRatio, 0.12 * flashRatio, 1.0);
					} else {
						gl.clearColor(0.4 * flashRatio, 0.08 * flashRatio, 0.0, 1.0);
					}
				} else {
					gl.clearColor(0.0, 0.0, 0.0, 1.0);
				}
				gl.clear(gl.COLOR_BUFFER_BIT);

				gl.useProgram(this.program);
				gl.enableVertexAttribArray(this.positionLocation);
				gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
				gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);
				gl.uniform2f(this.resolutionLocation, this.width, this.height);
			} else if (this.ctx2d) {
				if (this.goalFlashTimer > 0) {
					const flashRatio = Math.max(0, Math.min(1, this.goalFlashTimer / 28));
					this.ctx2d.fillStyle = this.goalScorer === 'PLAYER'
						? `rgba(0, ${Math.round(90 * flashRatio)}, ${Math.round(30 * flashRatio)}, 1)`
						: `rgba(${Math.round(100 * flashRatio)}, ${Math.round(20 * flashRatio)}, 0, 1)`;
				} else {
					this.ctx2d.fillStyle = '#000000';
				}
				this.ctx2d.fillRect(0, 0, this.width, this.height);
			} else {
				return;
			}

			for (let y = 4; y < this.height; y += 10) {
				this.drawQuad(this.width / 2 - 1, y, 2, 5, 0.4, 0.4, 0.4, 1.0);
			}

			this.drawQuad(0, 0, this.width, 2, 1.0, 1.0, 1.0, 1.0);
			this.drawQuad(0, this.height - 2, this.width, 2, 1.0, 1.0, 1.0, 1.0);

			this.drawDigit(Math.min(9, Math.max(0, this.playerScore)), this.width / 2 - 36, 12, 2);
			this.drawDigit(Math.min(9, Math.max(0, this.clippyScore)), this.width / 2 + 24, 12, 2);

			this.drawQuad(10, this.playerY, this.paddleWidth, this.paddleHeight, 0.3, 0.7, 1.0, 1.0);
			this.drawQuad(this.width - 10 - this.paddleWidth, this.clippyY, this.paddleWidth, this.paddleHeight, 1.0, 0.35, 0.35, 1.0);

			if (this.goalFlashTimer <= 0 || (Math.floor(this.goalFlashTimer) % 6 >= 3)) {
				this.drawQuad(this.ballX - this.ballSize / 2, this.ballY - this.ballSize / 2, this.ballSize, this.ballSize, 1.0, 1.0, 1.0, 1.0);
			}
		}

		resetBall(direction = 1) {
			this.ballX = this.width / 2;
			this.ballY = this.height / 2;
			const angle = (Math.random() * 0.4 - 0.2) * Math.PI;
			const speed = this.baseSpeed;
			const dir = direction >= 0 ? 1 : -1;
			this.ballVx = Math.max(1.8, Math.abs(Math.cos(angle) * speed)) * dir;
			this.ballVy = Math.sin(angle) * speed;
			if (Math.abs(this.ballVy) < 0.6) {
				this.ballVy = (Math.random() > 0.5 ? 1 : -1) * 0.75;
			}
		}

		triggerGoal(scorer) {
			this.goalScorer = scorer;
			this.goalFlashTimer = 28;

			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('pong')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.pong) || {});

			if (scorer === 'PLAYER') {
				this.playerScore++;
				this.goalBannerText = txt.goalPlayerBanner || "GOAL! User scored against Clippy!";
				if (window.ClippyAudio) window.ClippyAudio.play('pong_goal');
				this.updateScoreboard();
				if (this.playerScore >= this.maxScore) {
					this.finishMatch('PLAYER');
					return;
				}
				this.resetBall(-1);
			} else {
				this.clippyScore++;
				this.goalBannerText = txt.goalClippyBanner || "GOAL! Clippy scores effortlessly!";
				if (window.ClippyAudio) window.ClippyAudio.play('pong_score_clippy');
				this.updateScoreboard();
				if (this.clippyScore >= this.maxScore) {
					this.finishMatch('CLIPPY');
					return;
				}
				this.resetBall(1);
			}
		}

		updateAI(timeScale = 1.0) {
			const lossStreak = (window.ClippyBrain && window.ClippyBrain.state && window.ClippyBrain.state.pongLossStreak) || 0;
			const difficulty = (window.SettingsApp && window.SettingsApp.get('clippyPongDifficulty')) || 'champion';
			let targetY = this.height / 2 - this.paddleHeight / 2;

			let predictionNoise = 0;
			let speedPenalty = 0;

			if (difficulty === 'easy') {
				predictionNoise = Math.sin(Date.now() * 0.005) * 22;
				speedPenalty = 1.2;
			} else if (difficulty === 'medium') {
				predictionNoise = Math.sin(Date.now() * 0.008) * 12;
				speedPenalty = 0.6;
			}

			if (lossStreak >= 1) {
				predictionNoise += Math.sin(Date.now() * 0.01) * Math.min(24, lossStreak * 8);
				speedPenalty += Math.min(1.2, lossStreak * 0.3);
			}

			if (this.ballVx > 0) {
				let simX = this.ballX;
				let simY = this.ballY;
				let simVx = this.ballVx;
				let simVy = this.ballVy;
				const interceptX = this.width - 10 - this.paddleWidth;

				let steps = 0;
				while (simX < interceptX && steps < 200) {
					simX += simVx;
					simY += simVy;
					if (simY <= 2 || simY >= this.height - 2) {
						simVy = -simVy;
					}
					steps++;
				}
				targetY = simY - this.paddleHeight / 2 + predictionNoise;
			} else {
				targetY = (this.height / 2) - (this.paddleHeight / 2) + Math.sin(Date.now() * 0.003) * 16;
			}

			targetY = Math.max(2, Math.min(this.height - this.paddleHeight - 2, targetY));

			const baseAiSpeed = Math.max(2.2, (3.8 - speedPenalty) * timeScale);
			const diff = targetY - this.clippyY;
			if (Math.abs(diff) > 1.0) {
				this.clippyY += Math.sign(diff) * Math.min(baseAiSpeed, Math.abs(diff));
			}
		}

		updatePhysics(timeScale = 1.0) {
			if (this.goalFlashTimer > 0) {
				this.goalFlashTimer -= (timeScale || 1.0);
				return;
			}

			if (!isFinite(this.ballX) || !isFinite(this.ballY) || !isFinite(this.ballVx) || !isFinite(this.ballVy)) {
				this.resetBall(1);
			}

			if (this.keys.up) {
				this.playerY = Math.max(2, this.playerY - 4.2 * timeScale);
			}
			if (this.keys.down) {
				this.playerY = Math.min(this.height - this.paddleHeight - 2, this.playerY + 4.2 * timeScale);
			}

			this.updateAI(timeScale);

			const prevX = this.ballX;
			const prevY = this.ballY;
			this.ballX += this.ballVx * timeScale;
			this.ballY += this.ballVy * timeScale;

			if (this.ballY - this.ballSize / 2 <= 2) {
				this.ballY = 2 + this.ballSize / 2;
				this.ballVy = Math.abs(this.ballVy);
				if (window.ClippyAudio) window.ClippyAudio.play('pong_wall');
			} else if (this.ballY + this.ballSize / 2 >= this.height - 2) {
				this.ballY = this.height - 2 - this.ballSize / 2;
				this.ballVy = -Math.abs(this.ballVy);
				if (window.ClippyAudio) window.ClippyAudio.play('pong_wall');
			}

			const playerPaddleRight = 10 + this.paddleWidth;
			const playerPaddleLeft = 10;
			if (
				this.ballVx < 0 &&
				this.ballX - this.ballSize / 2 <= playerPaddleRight &&
				prevX - this.ballSize / 2 >= playerPaddleLeft - 2 &&
				this.ballY + this.ballSize / 2 >= this.playerY &&
				this.ballY - this.ballSize / 2 <= this.playerY + this.paddleHeight
			) {
				const paddleCenter = this.playerY + this.paddleHeight / 2;
				const hitOffset = Math.max(-1, Math.min(1, (this.ballY - paddleCenter) / (this.paddleHeight / 2)));
				const bounceAngle = hitOffset * (Math.PI / 3.2);
				const currentSpeed = Math.sqrt(this.ballVx * this.ballVx + this.ballVy * this.ballVy);
				const newSpeed = Math.min(5.8, Math.max(2.5, currentSpeed * 1.04));
				this.ballVx = Math.max(1.8, Math.abs(Math.cos(bounceAngle) * newSpeed));
				this.ballVy = Math.sin(bounceAngle) * newSpeed;
				if (Math.abs(this.ballVy) < 0.4) {
					this.ballVy = (hitOffset >= 0 ? 1 : -1) * 0.6;
				}
				this.ballX = playerPaddleRight + this.ballSize / 2 + 0.1;
				if (window.ClippyAudio) window.ClippyAudio.play('pong_hit');
			}

			const clippyPaddleLeft = this.width - 10 - this.paddleWidth;
			const clippyPaddleRight = this.width - 10;
			if (
				this.ballVx > 0 &&
				this.ballX + this.ballSize / 2 >= clippyPaddleLeft &&
				prevX + this.ballSize / 2 <= clippyPaddleRight + 2 &&
				this.ballY + this.ballSize / 2 >= this.clippyY &&
				this.ballY - this.ballSize / 2 <= this.clippyY + this.paddleHeight
			) {
				const paddleCenter = this.clippyY + this.paddleHeight / 2;
				const hitOffset = Math.max(-1, Math.min(1, (this.ballY - paddleCenter) / (this.paddleHeight / 2)));
				const bounceAngle = hitOffset * (Math.PI / 3.2);
				const currentSpeed = Math.sqrt(this.ballVx * this.ballVx + this.ballVy * this.ballVy);
				const newSpeed = Math.min(5.8, Math.max(2.5, currentSpeed * 1.04));
				this.ballVx = -Math.max(1.8, Math.abs(Math.cos(bounceAngle) * newSpeed));
				this.ballVy = Math.sin(bounceAngle) * newSpeed;
				if (Math.abs(this.ballVy) < 0.4) {
					this.ballVy = (hitOffset >= 0 ? 1 : -1) * 0.6;
				}
				this.ballX = clippyPaddleLeft - this.ballSize / 2 - 0.1;
				if (window.ClippyAudio) window.ClippyAudio.play('pong_hit');
			}

			if (this.ballX + this.ballSize / 2 < 0) {
				this.triggerGoal('CLIPPY');
			} else if (this.ballX - this.ballSize / 2 > this.width) {
				this.triggerGoal('PLAYER');
			}
		}

		gameLoop(timestamp) {
			if (!this.isRunning) return;
			if (!this.lastTimestamp) this.lastTimestamp = timestamp || performance.now();
			const now = timestamp || performance.now();
			let dt = (now - this.lastTimestamp) / 1000;
			this.lastTimestamp = now;

			if (dt > 0.05) dt = 0.05;

			if (!this.isPaused) {
				const step = 1 / 120;
				this.accumulator = (this.accumulator || 0) + dt;
				if (this.accumulator > 0.1) this.accumulator = 0.1;
				while (this.accumulator >= step) {
					this.updatePhysics(step * 60);
					this.accumulator -= step;
				}
				this.renderScene();
			}
			this.animationFrameId = requestAnimationFrame(this.boundGameLoop);
		}

		startGame() {
			if (this.isRunning) return;
			if (this.playerScore >= this.maxScore || this.clippyScore >= this.maxScore) {
				this.playerScore = 0;
				this.clippyScore = 0;
				this.updateScoreboard();
			}
			if (this.ballX < 0 || this.ballX > this.width || isNaN(this.ballX)) {
				this.resetBall(1);
			}
			this.goalFlashTimer = 0;
			this.isRunning = true;
			this.isPaused = false;
			this.lastTimestamp = performance.now();
			this.accumulator = 0;
			window.removeEventListener('keydown', this.boundKeyDown);
			window.removeEventListener('keyup', this.boundKeyUp);
			window.removeEventListener('pointermove', this.boundPointerMove);
			window.removeEventListener('pointerup', this.boundPointerUp);
			window.removeEventListener('pointercancel', this.boundPointerUp);
			window.addEventListener('keydown', this.boundKeyDown);
			window.addEventListener('keyup', this.boundKeyUp);
			window.addEventListener('pointermove', this.boundPointerMove, { passive: true });
			window.addEventListener('pointerup', this.boundPointerUp);
			window.addEventListener('pointercancel', this.boundPointerUp);
			this.animationFrameId = requestAnimationFrame(this.boundGameLoop);
			this.updateButtons();
		}

		pauseGame() {
			this.isPaused = !this.isPaused;
			this.updateButtons();
		}

		finishMatch(winner) {
			this.isRunning = false;
			if (this.animationFrameId) {
				cancelAnimationFrame(this.animationFrameId);
				this.animationFrameId = null;
			}
			window.removeEventListener('keydown', this.boundKeyDown);
			window.removeEventListener('keyup', this.boundKeyUp);
			window.removeEventListener('pointermove', this.boundPointerMove);
			window.removeEventListener('pointerup', this.boundPointerUp);
			window.removeEventListener('pointercancel', this.boundPointerUp);

			this.resetBall(winner === 'PLAYER' ? 1 : -1);

			const isPlayerWinner = winner === 'PLAYER';
			const brain = window.ClippyBrain;

			if (brain) {
				if (isPlayerWinner) {
					brain.state.pongLossStreak = (brain.state.pongLossStreak || 0) + 1;
					brain.state.consecutiveHostility = Math.min(10, (brain.state.consecutiveHostility || 0) + 2);
					const streak = brain.state.pongLossStreak;
					brain.applyMoodDelta({
						mood: streak >= 2 ? 'ENRAGED' : 'SARCASTIC',
						irritation: 35 + streak * 10,
						patience: -25,
						affinity: -15,
						cynicism: 20
					});
				} else {
					brain.state.pongLossStreak = 0;
					brain.applyMoodDelta({
						mood: 'SARCASTIC',
						irritation: -20,
						patience: 15,
						affinity: -5,
						cynicism: 15
					});
				}
				brain.saveState();
			}

			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('pong')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.pong) || {
					winBanner: "Flawless victory for Clippy!",
					lossBanner: "I intentionally allowed you to win out of sympathy!"
				});

			let bannerMsg = isPlayerWinner ? txt.lossBanner : txt.winBanner;
			if (isPlayerWinner && brain && brain.state.pongLossStreak > 1 && txt.lossRageStreak) {
				bannerMsg = window.ClippyKnowledge.formatString(txt.lossRageStreak, { streak: brain.state.pongLossStreak });
			}

			if (!isPlayerWinner) {
				if (window.ClippyAudio) window.ClippyAudio.play('win');
			} else {
				if (window.ClippyAudio) window.ClippyAudio.play('lose');
			}

			this.render(true, bannerMsg, isPlayerWinner);

			if (window.ClippyAgent && typeof window.ClippyAgent.notifyGameEnded === 'function') {
				const summaryStr = `${this.playerScore} - ${this.clippyScore}`;
				window.ClippyAgent.notifyGameEnded('Pong', summaryStr, () => {
					this.mount();
				});
			}
		}

		handleKeyDown(e) {
			if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
				this.keys.up = true;
				e.preventDefault();
			}
			if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
				this.keys.down = true;
				e.preventDefault();
			}
		}

		handleKeyUp(e) {
			if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') this.keys.up = false;
			if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') this.keys.down = false;
		}

		handlePointerDown(e) {
			this.isTrackingPointer = true;
			this.setPaddleFromPointer(e.clientY);
		}

		handlePointerUp() {
			this.isTrackingPointer = false;
		}

		handlePointerMove(e) {
			if (!this.canvas || !this.isRunning) return;
			const rect = this.canvas.getBoundingClientRect();
			if (this.isTrackingPointer || (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top - 20 && e.clientY <= rect.bottom + 20)) {
				this.setPaddleFromPointer(e.clientY);
			}
		}

		setPaddleFromPointer(clientY) {
			if (!this.canvas) return;
			const rect = this.canvas.getBoundingClientRect();
			if (rect.height <= 0) return;
			const scaleY = this.height / rect.height;
			const localY = clientY - rect.top;
			const targetY = localY * scaleY - this.paddleHeight / 2;
			this.playerY = Math.max(2, Math.min(this.height - this.paddleHeight - 2, targetY));
		}

		cleanup() {
			this.isRunning = false;
			this.isPaused = false;
			if (this.animationFrameId) {
				cancelAnimationFrame(this.animationFrameId);
				this.animationFrameId = null;
			}
			window.removeEventListener('keydown', this.boundKeyDown);
			window.removeEventListener('keyup', this.boundKeyUp);
			window.removeEventListener('pointermove', this.boundPointerMove);
			window.removeEventListener('pointerup', this.boundPointerUp);
			window.removeEventListener('pointercancel', this.boundPointerUp);
		}

		updateScoreboard() {
			if (!this.card) return;
			const hud = this.card.bodyElement.querySelector('.clippy-scoreboard');
			if (hud) {
				const strongElements = hud.querySelectorAll('strong');
				if (strongElements.length >= 3) {
					strongElements[0].textContent = String(this.playerScore);
					strongElements[1].textContent = String(this.maxScore);
					strongElements[2].textContent = String(this.clippyScore);
				}
			}
		}

		updateButtons() {
			if (!this.card) return;
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('pong')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.pong) || {
					btnStart: "Serve Ball", btnPause: "Pause", btnResume: "Resume"
				});
			const startBtn = this.card.bodyElement.querySelector('#clippy-pong-start-btn');
			const pauseBtn = this.card.bodyElement.querySelector('#clippy-pong-pause-btn');

			if (startBtn) startBtn.style.display = this.isRunning ? 'none' : 'inline-block';
			if (pauseBtn) {
				pauseBtn.style.display = this.isRunning ? 'inline-block' : 'none';
				pauseBtn.textContent = this.isPaused ? (txt.btnResume || "Resume") : (txt.btnPause || "Pause");
			}
		}

		render(isOver = false, bannerMessage = '', playerWon = false) {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('pong')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.pong) || {
					scorePlayer: "You", scoreClippy: "Clippy (Undefeated)", controlsHint: "Controls: W / S, Arrow Up / Down, or Mouse Tracking",
					btnStart: "Serve Ball", btnPause: "Pause", btnResume: "Resume"
				});

			const hud = document.createElement('div');
			hud.className = 'clippy-scoreboard';
			hud.innerHTML = `
				<div class="clippy-score-item"><span>${txt.scorePlayer}</span><strong>${this.playerScore}</strong></div>
				<div class="clippy-score-item"><span>Target</span><strong>${this.maxScore}</strong></div>
				<div class="clippy-score-item"><span>${txt.scoreClippy}</span><strong>${this.clippyScore}</strong></div>
			`;
			body.appendChild(hud);

			if (isOver && bannerMessage) {
				const banner = document.createElement('div');
				banner.className = `clippy-activity-banner ${playerWon ? 'loss' : 'win'}`;
				banner.textContent = bannerMessage;
				body.appendChild(banner);
			}

			const container = document.createElement('div');
			container.className = 'clippy-pong-container';

			this.canvas = document.createElement('canvas');
			this.canvas.width = this.width;
			this.canvas.height = this.height;
			this.canvas.className = 'clippy-pong-canvas';
			container.appendChild(this.canvas);

			const hint = document.createElement('div');
			hint.className = 'clippy-pong-controls-hint';
			hint.textContent = txt.controlsHint || "Controls: W / S, Arrow Up / Down, or Mouse Tracking on Court";
			container.appendChild(hint);

			body.appendChild(container);

			const actions = document.createElement('div');
			actions.className = 'clippy-actions-bar';

			const startBtn = document.createElement('button');
			startBtn.type = 'button';
			startBtn.id = 'clippy-pong-start-btn';
			startBtn.className = 'clippy-action-btn';
			startBtn.textContent = txt.btnStart || "Serve Ball";
			startBtn.addEventListener('click', () => this.startGame());
			actions.appendChild(startBtn);

			const pauseBtn = document.createElement('button');
			pauseBtn.type = 'button';
			pauseBtn.id = 'clippy-pong-pause-btn';
			pauseBtn.className = 'clippy-action-btn';
			pauseBtn.style.display = 'none';
			pauseBtn.textContent = txt.btnPause || "Pause";
			pauseBtn.addEventListener('click', () => this.pauseGame());
			actions.appendChild(pauseBtn);

			body.appendChild(actions);

			this.canvas.addEventListener('pointerdown', this.boundPointerDown);

			this.initWebGL();
			this.renderScene();
			window.ClippyUI.scrollLogToBottom();
		}
	}

	class SimonSaysActivity {
		constructor() {
			this.sequence = [];
			this.playerStep = 0;
			this.round = 0;
			this.bestScore = 0;
			this.isPlaying = false;
			this.isPlayerTurn = false;
			this.isAnimating = false;
			this.card = null;
			this.colors = ['green', 'red', 'yellow', 'blue'];
		}

		mount() {
			this.sequence = [];
			this.playerStep = 0;
			this.round = 0;
			this.isPlaying = false;
			this.isPlayerTurn = false;
			this.isAnimating = false;
			const txt = (window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.simon) || { title: 'Simon Says', badge: 'Memory Sequence' };
			this.card = window.ClippyUI.createActivityCard(txt.title, txt.badge);
			this.render();
		}

		startGame() {
			if (this.isAnimating) return;
			this.sequence = [];
			this.round = 0;
			this.playerStep = 0;
			this.isPlaying = true;
			this.nextRound();
		}

		nextRound() {
			this.round++;
			if (this.round > this.bestScore) {
				this.bestScore = this.round;
			}
			this.playerStep = 0;
			this.isPlayerTurn = false;
			const nextColor = this.colors[Math.floor(Math.random() * this.colors.length)];
			this.sequence.push(nextColor);
			this.render();
			this.playSequence();
		}

		playSequence() {
			this.isAnimating = true;
			let idx = 0;
			const interval = setInterval(() => {
				if (idx < this.sequence.length) {
					this.flashColor(this.sequence[idx]);
					idx++;
				} else {
					clearInterval(interval);
					this.isAnimating = false;
					this.isPlayerTurn = true;
					this.render();
				}
			}, 600);
		}

		flashColor(color) {
			if (!this.card) return;
			const pad = this.card.bodyElement.querySelector(`.clippy-simon-pad.${color}`);
			if (pad) {
				pad.classList.add('lit');
				if (window.ClippyAudio) window.ClippyAudio.play(`simon_${color}`);
				setTimeout(() => {
					pad.classList.remove('lit');
				}, 320);
			}
		}

		handlePlayerInput(color) {
			if (!this.isPlaying || !this.isPlayerTurn || this.isAnimating) return;

			this.flashColor(color);

			if (this.sequence[this.playerStep] === color) {
				this.playerStep++;
				if (this.playerStep >= this.sequence.length) {
					this.isPlayerTurn = false;
					if (window.ClippyAudio) window.ClippyAudio.play('win');
					setTimeout(() => {
						this.nextRound();
					}, 700);
				}
			} else {
				this.isPlaying = false;
				this.isPlayerTurn = false;
				if (window.ClippyAudio) window.ClippyAudio.play('simon_fail');
				this.render(true);
				if (window.ClippyAgent && typeof window.ClippyAgent.notifyGameEnded === 'function') {
					window.ClippyAgent.notifyGameEnded('Simon Says', `Round ${this.round}`, () => {
						this.startGame();
					});
				}
			}
		}

		render(isFailed = false) {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const txt = (window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.simon) || {
				scoreRound: "Round", scoreBest: "Best", scoreStatus: "Status",
				btnStart: "Start Game", statusWatch: "Watch pattern...", statusYourTurn: "Your turn!",
				statusGameOver: "Game Over! Final Round: {round}"
			};

			const scoreboard = document.createElement('div');
			scoreboard.className = 'clippy-scoreboard';
			let statusLabel = 'Idle';
			if (isFailed) statusLabel = 'Game Over';
			else if (this.isPlayerTurn) statusLabel = txt.statusYourTurn;
			else if (this.isPlaying) statusLabel = txt.statusWatch;

			scoreboard.innerHTML = `
				<div class="clippy-score-item"><span>${txt.scoreRound}</span><strong>${this.round}</strong></div>
				<div class="clippy-score-item"><span>${txt.scoreBest}</span><strong>${this.bestScore}</strong></div>
				<div class="clippy-score-item"><span>${txt.scoreStatus}</span><strong>${statusLabel}</strong></div>
			`;
			body.appendChild(scoreboard);

			if (isFailed) {
				const banner = document.createElement('div');
				banner.className = 'clippy-activity-banner loss';
				banner.textContent = window.ClippyKnowledge && window.ClippyKnowledge.formatString
					? window.ClippyKnowledge.formatString(txt.statusGameOver, { round: this.round })
					: `Game Over! Reached Round ${this.round}`;
				body.appendChild(banner);
			}

			const container = document.createElement('div');
			container.className = 'clippy-simon-container';

			const grid = document.createElement('div');
			grid.className = 'clippy-simon-grid';

			this.colors.forEach(col => {
				const pad = document.createElement('button');
				pad.type = 'button';
				pad.className = `clippy-simon-pad ${col}`;
				pad.disabled = !this.isPlayerTurn || this.isAnimating;
				pad.addEventListener('click', () => this.handlePlayerInput(col));
				grid.appendChild(pad);
			});

			container.appendChild(grid);

			if (!this.isPlaying) {
				const startBtn = document.createElement('button');
				startBtn.type = 'button';
				startBtn.className = 'clippy-action-btn';
				startBtn.textContent = txt.btnStart;
				startBtn.addEventListener('click', () => this.startGame());
				container.appendChild(startBtn);
			}

			body.appendChild(container);
			window.ClippyUI.scrollLogToBottom();
		}
	}

	class TicTacToeActivity {
		constructor() {
			this.board = Array(9).fill(null);
			this.scores = { player: 0, clippy: 0, draws: 0 };
			this.winner = null;
			this.winningLine = [];
			this.card = null;
		}

		mount() {
			this.board = Array(9).fill(null);
			this.winner = null;
			this.winningLine = [];
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('tictactoe')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.tictactoe) || { title: 'Tic-Tac-Toe', badge: 'Mini-Game' });
			this.card = window.ClippyUI.createActivityCard(txt.title || 'Tic-Tac-Toe', txt.badge || 'Mini-Game');
			this.render();
		}

		checkWinner(b) {
			const lines = [
				[0,1,2],[3,4,5],[6,7,8],
				[0,3,6],[1,4,7],[2,5,8],
				[0,4,8],[2,4,6]
			];
			for (const [x,y,z] of lines) {
				if (b[x] && b[x] === b[y] && b[x] === b[z]) {
					return { winner: b[x], line: [x,y,z] };
				}
			}
			if (b.every(c => c !== null)) return { winner: 'TIE', line: [] };
			return null;
		}

		makeMove(idx) {
			if (this.board[idx] || this.winner) return;
			this.board[idx] = 'X';
			if (window.ClippyAudio) window.ClippyAudio.play('type');

			let winCheck = this.checkWinner(this.board);
			if (winCheck) {
				this.finishGame(winCheck);
				return;
			}

			const free = this.board.map((v, i) => v === null ? i : null).filter(v => v !== null);
			if (free.length > 0) {
				let move = free.find(i => {
					const t = [...this.board];
					t[i] = 'O';
					const res = this.checkWinner(t);
					return res && res.winner === 'O';
				});

				if (move === undefined) {
					move = free.find(i => {
						const t = [...this.board];
						t[i] = 'X';
						const res = this.checkWinner(t);
						return res && res.winner === 'X';
					});
				}

				if (move === undefined) {
					if (free.includes(4)) move = 4;
					else move = free[Math.floor(Math.random() * free.length)];
				}

				this.board[move] = 'O';
			}

			winCheck = this.checkWinner(this.board);
			if (winCheck) {
				this.finishGame(winCheck);
			} else {
				this.render();
			}
		}

		finishGame(result) {
			this.winner = result.winner;
			this.winningLine = result.line || [];

			if (this.winner === 'X') {
				this.scores.player++;
				if (window.ClippyAudio) window.ClippyAudio.play('win');
				if (window.ClippySystemBridge) window.ClippySystemBridge.unlockAchievement('clippy_tictactoe_win', 1);
			} else if (this.winner === 'O') {
				this.scores.clippy++;
				if (window.ClippyAudio) window.ClippyAudio.play('lose');
			} else {
				this.scores.draws++;
				if (window.ClippyAudio) window.ClippyAudio.play('action');
			}

			this.render();
		}

		restart() {
			this.board = Array(9).fill(null);
			this.winner = null;
			this.winningLine = [];
			this.render();
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('tictactoe')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.tictactoe) || {
					scorePlayer: "You (X)", scoreDraws: "Draws", scoreClippy: "Clippy (O)",
					winBanner: "Game Over: Victory! You defeated Clippit.",
					lossBanner: "Game Over: Defeat! Clippit won this round.",
					drawBanner: "Game Over: Draw game! Stalemate."
				});

			const scoreboard = document.createElement('div');
			scoreboard.className = 'clippy-scoreboard';
			scoreboard.innerHTML = `
				<div class="clippy-score-item"><span>${txt.scorePlayer}</span><strong>${this.scores.player}</strong></div>
				<div class="clippy-score-item"><span>${txt.scoreDraws}</span><strong>${this.scores.draws}</strong></div>
				<div class="clippy-score-item"><span>${txt.scoreClippy}</span><strong>${this.scores.clippy}</strong></div>
			`;
			body.appendChild(scoreboard);

			if (this.winner) {
				const banner = document.createElement('div');
				if (this.winner === 'X') {
					banner.className = 'clippy-activity-banner win';
					banner.textContent = txt.winBanner;
				} else if (this.winner === 'O') {
					banner.className = 'clippy-activity-banner loss';
					banner.textContent = txt.lossBanner;
				} else {
					banner.className = 'clippy-activity-banner draw';
					banner.textContent = txt.drawBanner;
				}
				body.appendChild(banner);
			}

			const grid = document.createElement('div');
			grid.className = 'clippy-ttt-grid';

			for (let i = 0; i < 9; i++) {
				const cell = document.createElement('button');
				cell.type = 'button';
				cell.className = 'clippy-ttt-cell';
				cell.textContent = this.board[i] || '';
				if (this.board[i] === 'X') cell.classList.add('player-x');
				if (this.board[i] === 'O') cell.classList.add('player-o');
				if (this.winningLine.includes(i)) cell.classList.add('winner-cell');
				cell.disabled = !!this.board[i] || !!this.winner;

				cell.addEventListener('click', () => this.makeMove(i));
				grid.appendChild(cell);
			}

			body.appendChild(grid);
			window.ClippyUI.scrollLogToBottom();

			if (this.winner && window.ClippyAgent && typeof window.ClippyAgent.notifyGameEnded === 'function') {
				const gameResult = this.winner === 'X' ? 'Victory' : (this.winner === 'O' ? 'Defeat' : 'Draw');
				window.ClippyAgent.notifyGameEnded('Tic-Tac-Toe', gameResult, () => {
					this.mount();
				});
			}
		}
	}

	class MemoryMatchActivity {
		constructor() {
			this.tokens = ['SYS', 'DLL', 'EXE', 'INI', 'BAT', 'COM'];
			this.deck = [];
			this.revealed = [];
			this.matched = [];
			this.flipped = [];
			this.moves = 0;
			this.isLocked = false;
			this.card = null;
		}

		mount() {
			this.deck = [...this.tokens, ...this.tokens].sort(() => Math.random() - 0.5);
			this.revealed = Array(12).fill(false);
			this.matched = Array(12).fill(false);
			this.flipped = [];
			this.moves = 0;
			this.isLocked = false;
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('memory')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.memory) || { title: 'Memory Match', badge: 'Token Pairs' });
			this.card = window.ClippyUI.createActivityCard(txt.title || 'Memory Match', txt.badge || 'Token Pairs');
			this.render();
		}

		flipCard(idx) {
			if (this.isLocked || this.revealed[idx] || this.matched[idx]) return;
			this.revealed[idx] = true;
			this.flipped.push(idx);
			if (window.ClippyAudio) window.ClippyAudio.play('type');

			if (this.flipped.length === 2) {
				this.moves++;
				const [f, s] = this.flipped;
				if (this.deck[f] === this.deck[s]) {
					this.matched[f] = true;
					this.matched[s] = true;
					this.flipped = [];
					if (window.ClippyAudio) window.ClippyAudio.play('win');

					if (this.matched.every(Boolean)) {
						if (window.ClippyAudio) window.ClippyAudio.play('tada');
					}
					this.render();
				} else {
					this.isLocked = true;
					this.render();
					setTimeout(() => {
						this.revealed[f] = false;
						this.revealed[s] = false;
						this.flipped = [];
						this.isLocked = false;
						this.render();
					}, 750);
				}
			} else {
				this.render();
			}
		}

		restart() {
			this.deck = [...this.tokens, ...this.tokens].sort(() => Math.random() - 0.5);
			this.revealed = Array(12).fill(false);
			this.matched = Array(12).fill(false);
			this.flipped = [];
			this.moves = 0;
			this.isLocked = false;
			this.render();
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const matchedCount = this.matched.filter(Boolean).length / 2;
			const isComplete = this.matched.every(Boolean);

			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('memory', { turns: this.moves })
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.memory) || {
					scoreMatched: "Matched", scoreTurns: "Turns", scoreStatus: "Status",
					statusWon: "Won", statusPlaying: "Playing", winBanner: "All pairs matched in {turns} turns!"
				});

			const scoreboard = document.createElement('div');
			scoreboard.className = 'clippy-scoreboard';
			scoreboard.innerHTML = `
				<div class="clippy-score-item"><span>${txt.scoreMatched}</span><strong>${matchedCount} / 6</strong></div>
				<div class="clippy-score-item"><span>${txt.scoreTurns}</span><strong>${this.moves}</strong></div>
				<div class="clippy-score-item"><span>${txt.scoreStatus}</span><strong>${isComplete ? txt.statusWon : txt.statusPlaying}</strong></div>
			`;
			body.appendChild(scoreboard);

			if (isComplete) {
				const banner = document.createElement('div');
				banner.className = 'clippy-activity-banner win';
				banner.textContent = window.ClippyKnowledge.formatString(txt.winBanner, { turns: this.moves });
				body.appendChild(banner);
			}

			const grid = document.createElement('div');
			grid.className = 'clippy-memory-grid';

			this.deck.forEach((token, idx) => {
				const btn = document.createElement('button');
				btn.type = 'button';
				btn.className = 'clippy-memory-card';

				if (this.matched[idx]) {
					btn.classList.add('matched');
					btn.textContent = token;
				} else if (this.revealed[idx]) {
					btn.classList.add('revealed');
					btn.textContent = token;
				} else {
					btn.textContent = '?';
				}

				btn.addEventListener('click', () => this.flipCard(idx));
				grid.appendChild(btn);
			});

			body.appendChild(grid);
			window.ClippyUI.scrollLogToBottom();

			if (isComplete && window.ClippyAgent && typeof window.ClippyAgent.notifyGameEnded === 'function') {
				window.ClippyAgent.notifyGameEnded('Memory Match', `Completed in ${this.moves} turns`, () => {
					this.mount();
				});
			}
		}
	}

	class HangmanActivity {
		constructor() {
			this.word = 'WINDOWS';
			this.guessed = new Set();
			this.errors = 0;
			this.maxErrors = 6;
			this.card = null;
		}

		mount() {
			const pool = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getHangmanWords === 'function')
				? window.ClippyKnowledge.getHangmanWords(window.ClippyBrain ? window.ClippyBrain.getMood() : 'OPTIMISTIC')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.HANGMAN_WORDS) || ['WINDOWS', 'EXPLORER', 'CLIPPY', 'DESKTOP']);
			this.word = pool[Math.floor(Math.random() * pool.length)].toUpperCase();
			this.guessed = new Set();
			this.errors = 0;
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('hangman')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.hangman) || { title: 'Hangman Challenge', badge: 'Word Guess' });
			this.card = window.ClippyUI.createActivityCard(txt.title || 'Hangman Challenge', txt.badge || 'Word Guess');
			this.render();
		}

		guessLetter(letter) {
			letter = letter.toUpperCase();
			if (this.guessed.has(letter) || this.isFinished()) return;
			this.guessed.add(letter);

			if (this.word.includes(letter)) {
				if (window.ClippyAudio) window.ClippyAudio.play('type');
				if (this.isWon()) {
					if (window.ClippyAudio) window.ClippyAudio.play('tada');
				}
			} else {
				this.errors++;
				if (window.ClippyAudio) window.ClippyAudio.play(this.errors >= this.maxErrors ? 'lose' : 'action');
			}

			this.render();
		}

		isWon() {
			return this.word.split('').every(c => this.guessed.has(c));
		}

		isLost() {
			return this.errors >= this.maxErrors;
		}

		isFinished() {
			return this.isWon() || this.isLost();
		}

		restart() {
			const pool = (window.ClippyKnowledge && window.ClippyKnowledge.HANGMAN_WORDS) || ['WINDOWS', 'EXPLORER', 'CLIPPY', 'DESKTOP'];
			this.word = pool[Math.floor(Math.random() * pool.length)].toUpperCase();
			this.guessed = new Set();
			this.errors = 0;
			this.render();
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const displayBox = document.createElement('div');
			displayBox.className = 'clippy-hangman-display';

			const masked = this.word.split('').map(c => this.guessed.has(c) || this.isLost() ? c : '_').join(' ');
			const wordEl = document.createElement('div');
			wordEl.className = 'clippy-hangman-word';
			wordEl.textContent = masked;
			displayBox.appendChild(wordEl);

			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('hangman', { word: this.word })
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.hangman) || {
					statsErrors: "Errors:", statsRemaining: "Remaining:",
					winBanner: "Correct! The word was {word}.", lossBanner: "Out of tries! The word was {word}."
				});

			const stats = document.createElement('div');
			stats.className = 'clippy-hangman-stats';
			stats.innerHTML = `
				<span>${txt.statsErrors} <strong>${this.errors} / ${this.maxErrors}</strong></span>
				<span>${txt.statsRemaining} <strong>${this.maxErrors - this.errors}</strong></span>
			`;
			displayBox.appendChild(stats);

			body.appendChild(displayBox);

			if (this.isWon()) {
				const banner = document.createElement('div');
				banner.className = 'clippy-activity-banner win';
				banner.textContent = window.ClippyKnowledge.formatString(txt.winBanner, { word: this.word });
				body.appendChild(banner);
			} else if (this.isLost()) {
				const banner = document.createElement('div');
				banner.className = 'clippy-activity-banner loss';
				banner.textContent = window.ClippyKnowledge.formatString(txt.lossBanner, { word: this.word });
				body.appendChild(banner);
			}

			const keyboard = document.createElement('div');
			keyboard.className = 'clippy-hangman-keyboard';
			const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

			alphabet.split('').forEach(char => {
				const key = document.createElement('button');
				key.type = 'button';
				key.className = 'clippy-hangman-key';
				key.textContent = char;
				key.disabled = this.guessed.has(char) || this.isFinished();
				key.addEventListener('click', () => this.guessLetter(char));
				keyboard.appendChild(key);
			});

			body.appendChild(keyboard);

			window.ClippyUI.scrollLogToBottom();

			if (this.isFinished() && window.ClippyAgent && typeof window.ClippyAgent.notifyGameEnded === 'function') {
				const resultStr = this.isWon() ? `Victory (${this.word})` : `Failed (${this.word})`;
				window.ClippyAgent.notifyGameEnded('Hangman', resultStr, () => {
					this.mount();
				});
			}
		}
	}

	class TechQuizActivity {
		constructor() {
			this.questions = [];
			this.currentIndex = 0;
			this.score = 0;
			this.selectedOption = null;
			this.isAnswered = false;
			this.card = null;
		}

		mount() {
			const pool = (window.ClippyKnowledge && window.ClippyKnowledge.QUIZ_QUESTIONS) || [];
			this.questions = [...pool].sort(() => Math.random() - 0.5);
			this.currentIndex = 0;
			this.score = 0;
			this.selectedOption = null;
			this.isAnswered = false;
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('quiz')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.quiz) || { title: 'Tech Knowledge Quiz', badge: 'Diagnostic Test' });
			this.card = window.ClippyUI.createActivityCard(txt.title || 'Tech Knowledge Quiz', txt.badge || 'Diagnostic Test');
			this.render();
		}

		answer(idx) {
			if (this.isAnswered) return;
			this.selectedOption = idx;
			this.isAnswered = true;
			const q = this.questions[this.currentIndex];

			if (idx === q.answer) {
				this.score++;
				if (window.ClippyAudio) window.ClippyAudio.play('win');
			} else {
				if (window.ClippyAudio) window.ClippyAudio.play('lose');
			}

			this.render();
		}

		next() {
			this.currentIndex++;
			this.selectedOption = null;
			this.isAnswered = false;
			if (this.currentIndex >= this.questions.length) {
				if (window.ClippyAudio) window.ClippyAudio.play('tada');
			}
			this.render();
		}

		restart() {
			const pool = (window.ClippyKnowledge && window.ClippyKnowledge.QUIZ_QUESTIONS) || [];
			this.questions = [...pool].sort(() => Math.random() - 0.5);
			this.currentIndex = 0;
			this.score = 0;
			this.selectedOption = null;
			this.isAnswered = false;
			this.render();
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const pctVal = this.questions.length > 0 ? Math.round((this.score / this.questions.length) * 100) : 0;
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('quiz', { score: this.score, total: this.questions.length, pct: pctVal })
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.quiz) || {
					resultsBanner: "Quiz Completed! Score: {score} / {total} ({pct}%)",
					qHeader: "[Q{current}/{total}] {question}",
					factLabel: "Note:",
					btnNext: "Next Question",
					btnResults: "View Results"
				});

			const isComplete = this.currentIndex >= this.questions.length;

			if (isComplete) {
				const pct = Math.round((this.score / this.questions.length) * 100);
				const banner = document.createElement('div');
				banner.className = `clippy-activity-banner ${pct >= 60 ? 'win' : 'loss'}`;
				banner.textContent = window.ClippyKnowledge.formatString(txt.resultsBanner, {
					score: this.score,
					total: this.questions.length,
					pct
				});
				body.appendChild(banner);
				window.ClippyUI.scrollLogToBottom();

				if (window.ClippyAgent && typeof window.ClippyAgent.notifyGameEnded === 'function') {
					window.ClippyAgent.notifyGameEnded('Tech Quiz', `${this.score}/${this.questions.length} (${pct}%)`, () => {
						this.mount();
					});
				}
				return;
			}

			const container = document.createElement('div');
			container.className = 'clippy-quiz-container';

			const progress = document.createElement('div');
			progress.className = 'clippy-quiz-progress';
			const fill = document.createElement('div');
			fill.className = 'clippy-quiz-progress-fill';
			fill.style.width = `${((this.currentIndex) / this.questions.length) * 100}%`;
			progress.appendChild(fill);
			container.appendChild(progress);

			const q = this.questions[this.currentIndex];
			const currentMood = (window.ClippyBrain && typeof window.ClippyBrain.getMood === 'function') ? window.ClippyBrain.getMood() : 'OPTIMISTIC';
			let questionText = '';
			if (q.variants && typeof q.variants === 'object') {
				questionText = q.variants[currentMood] || q.variants.OPTIMISTIC || q.variants.ANALYTICAL || q.q || Object.values(q.variants)[0];
			} else if (typeof q.q === 'object' && q.q !== null && !Array.isArray(q.q)) {
				questionText = q.q[currentMood] || q.q.OPTIMISTIC || q.q.ANALYTICAL || Object.values(q.q)[0];
			} else if (Array.isArray(q.q) && q.q.length > 0) {
				questionText = q.q[Math.floor(Math.random() * q.q.length)];
			} else {
				questionText = String(q.q || '');
			}

			const qHeader = document.createElement('div');
			qHeader.className = 'clippy-quiz-question';
			qHeader.textContent = window.ClippyKnowledge.formatString(txt.qHeader, {
				current: this.currentIndex + 1,
				total: this.questions.length,
				question: questionText
			});
			container.appendChild(qHeader);

			const optionsBox = document.createElement('div');
			optionsBox.className = 'clippy-quiz-options';

			q.options.forEach((opt, idx) => {
				const btn = document.createElement('button');
				btn.type = 'button';
				btn.className = 'clippy-quiz-option-btn';
				btn.textContent = opt;

				if (this.isAnswered) {
					btn.disabled = true;
					if (idx === q.answer) btn.classList.add('correct');
					else if (idx === this.selectedOption) btn.classList.add('wrong');
				} else {
					btn.addEventListener('click', () => this.answer(idx));
				}
				optionsBox.appendChild(btn);
			});

			container.appendChild(optionsBox);

			if (this.isAnswered) {
				const fact = document.createElement('div');
				fact.className = 'clippy-quiz-fact';
				fact.innerHTML = `<strong>${txt.factLabel}</strong> ${q.fact}`;
				container.appendChild(fact);

				const actions = document.createElement('div');
				actions.className = 'clippy-actions-bar';
				const nextBtn = document.createElement('button');
				nextBtn.type = 'button';
				nextBtn.className = 'clippy-action-btn';
				nextBtn.textContent = (this.currentIndex + 1 < this.questions.length) ? txt.btnNext : txt.btnResults;
				nextBtn.addEventListener('click', () => this.next());
				actions.appendChild(nextBtn);
				container.appendChild(actions);
			}

			body.appendChild(container);
			window.ClippyUI.scrollLogToBottom();
		}
	}

	class GuessNumberActivity {
		constructor() {
			this.target = Math.floor(Math.random() * 100) + 1;
			this.minBound = 1;
			this.maxBound = 100;
			this.attempts = 0;
			this.lastGuess = null;
			this.statusText = '';
			this.isWon = false;
			this.card = null;
		}

		mount() {
			this.target = Math.floor(Math.random() * 100) + 1;
			this.minBound = 1;
			this.maxBound = 100;
			this.attempts = 0;
			this.lastGuess = null;
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('guess')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.guess) || { title: 'Number Oracle', badge: 'Logic Search', initialStatus: 'Guess an integer between 1 and 100:' });
			this.statusText = txt.initialStatus || 'Guess an integer between 1 and 100:';
			this.isWon = false;
			this.card = window.ClippyUI.createActivityCard(txt.title || 'Number Oracle', txt.badge || 'Logic Search');
			this.render();
		}

		submitGuess(val) {
			const num = parseInt(val, 10);
			if (isNaN(num) || num < 1 || num > 100 || this.isWon) return;
			this.attempts++;
			this.lastGuess = num;
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('guess', { guess: num, attempts: this.attempts, target: this.target })
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.guess) || {
					statusGreater: "Target is GREATER than {guess}.",
					statusLess: "Target is LESS than {guess}."
				});

			if (num === this.target) {
				this.isWon = true;
				if (window.ClippyAudio) window.ClippyAudio.play('tada');
			} else if (num < this.target) {
				this.minBound = Math.max(this.minBound, num + 1);
				this.statusText = window.ClippyKnowledge.formatString(txt.statusGreater, { guess: num });
				if (window.ClippyAudio) window.ClippyAudio.play('action');
			} else {
				this.maxBound = Math.min(this.maxBound, num - 1);
				this.statusText = window.ClippyKnowledge.formatString(txt.statusLess, { guess: num });
				if (window.ClippyAudio) window.ClippyAudio.play('action');
			}

			this.render();
		}

		restart() {
			this.target = Math.floor(Math.random() * 100) + 1;
			this.minBound = 1;
			this.maxBound = 100;
			this.attempts = 0;
			this.lastGuess = null;
			const txt = (window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.guess) || {};
			this.statusText = txt.initialStatus || 'Guess an integer between 1 and 100:';
			this.isWon = false;
			this.render();
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const container = document.createElement('div');
			container.className = 'clippy-guess-container';

			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('guess', { attempts: this.attempts, target: this.target, guess: this.lastGuess })
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.guess) || {
					searchBounds: "Active Search Bounds:",
					attemptsLabel: "Attempts:",
					winBanner: "Solved in {attempts} attempt(s)! Target was {target}.",
					btnSubmit: "Submit"
				});

			const range = document.createElement('div');
			range.className = 'clippy-guess-range';
			range.innerHTML = `
				<span>${txt.searchBounds} <strong>[${this.minBound} ... ${this.maxBound}]</strong></span>
				<span>${txt.attemptsLabel} <strong>${this.attempts}</strong></span>
			`;
			container.appendChild(range);

			if (this.isWon) {
				const banner = document.createElement('div');
				banner.className = 'clippy-activity-banner win';
				banner.textContent = window.ClippyKnowledge.formatString(txt.winBanner, { attempts: this.attempts, target: this.target });
				container.appendChild(banner);
			} else {
				const banner = document.createElement('div');
				banner.className = 'clippy-activity-banner info';
				banner.textContent = this.statusText;
				container.appendChild(banner);

				const inputRow = document.createElement('div');
				inputRow.className = 'clippy-guess-input-row';

				const input = document.createElement('input');
				input.type = 'number';
				input.min = '1';
				input.max = '100';
				input.className = 'clippy-guess-input';
				input.placeholder = `${this.minBound} - ${this.maxBound}`;

				const btn = document.createElement('button');
				btn.type = 'button';
				btn.className = 'clippy-action-btn';
				btn.textContent = txt.btnSubmit;
				btn.addEventListener('click', () => {
					this.submitGuess(input.value);
				});

				input.addEventListener('keydown', (e) => {
					if (e.key === 'Enter') this.submitGuess(input.value);
				});

				inputRow.appendChild(input);
				inputRow.appendChild(btn);
				container.appendChild(inputRow);
			}

			body.appendChild(container);
			window.ClippyUI.scrollLogToBottom();

			if (this.isWon && window.ClippyAgent && typeof window.ClippyAgent.notifyGameEnded === 'function') {
				window.ClippyAgent.notifyGameEnded('Number Oracle', `Solved in ${this.attempts} attempts`, () => {
					this.mount();
				});
			}
		}
	}

	class RockPaperScissorsActivity {
		constructor() {
			this.scores = { player: 0, clippy: 0, draws: 0 };
			this.lastUserMove = null;
			this.lastClippyMove = null;
			this.lastResult = null;
			this.card = null;
		}

		mount() {
			this.lastUserMove = null;
			this.lastClippyMove = null;
			this.lastResult = null;
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('rps')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.rps) || { title: 'Rock-Paper-Scissors', badge: 'Battle' });
			this.card = window.ClippyUI.createActivityCard(txt.title || 'Rock-Paper-Scissors', txt.badge || 'Battle');
			this.render();
		}

		play(userMove) {
			const moves = ['Rock', 'Paper', 'Scissors'];
			const clippyMove = moves[Math.floor(Math.random() * moves.length)];
			this.lastUserMove = userMove;
			this.lastClippyMove = clippyMove;

			if (userMove === clippyMove) {
				this.lastResult = 'DRAW';
				this.scores.draws++;
				if (window.ClippyAudio) window.ClippyAudio.play('action');
			} else if (
				(userMove === 'Rock' && clippyMove === 'Scissors') ||
				(userMove === 'Paper' && clippyMove === 'Rock') ||
				(userMove === 'Scissors' && clippyMove === 'Paper')
			) {
				this.lastResult = 'WIN';
				this.scores.player++;
				if (window.ClippyAudio) window.ClippyAudio.play('win');
			} else {
				this.lastResult = 'LOSS';
				this.scores.clippy++;
				if (window.ClippyAudio) window.ClippyAudio.play('lose');
			}

			this.render();
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('rps')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.rps) || {
					scorePlayer: "You", scoreDraws: "Draws", scoreClippy: "Clippy",
					winBanner: "You win this clash!", lossBanner: "Clippit wins this round!", drawBanner: "Mutual deflection! It is a draw."
				});

			const scoreboard = document.createElement('div');
			scoreboard.className = 'clippy-scoreboard';
			scoreboard.innerHTML = `
				<div class="clippy-score-item"><span>${txt.scorePlayer}</span><strong>${this.scores.player}</strong></div>
				<div class="clippy-score-item"><span>${txt.scoreDraws}</span><strong>${this.scores.draws}</strong></div>
				<div class="clippy-score-item"><span>${txt.scoreClippy}</span><strong>${this.scores.clippy}</strong></div>
			`;
			body.appendChild(scoreboard);

			if (this.lastResult) {
				const clash = document.createElement('div');
				clash.className = 'clippy-rps-clash';
				clash.innerHTML = `
					<span>You: ${this.lastUserMove}</span>
					<span style="color: #666;">vs</span>
					<span>Clippy: ${this.lastClippyMove}</span>
				`;
				body.appendChild(clash);

				const banner = document.createElement('div');
				if (this.lastResult === 'WIN') {
					banner.className = 'clippy-activity-banner win';
					banner.textContent = txt.winBanner;
				} else if (this.lastResult === 'LOSS') {
					banner.className = 'clippy-activity-banner loss';
					banner.textContent = txt.lossBanner;
				} else {
					banner.className = 'clippy-activity-banner draw';
					banner.textContent = txt.drawBanner;
				}
				body.appendChild(banner);
			}

			const container = document.createElement('div');
			container.className = 'clippy-rps-container';

			const buttons = document.createElement('div');
			buttons.className = 'clippy-rps-buttons';

			['Rock', 'Paper', 'Scissors'].forEach(m => {
				const btn = document.createElement('button');
				btn.type = 'button';
				btn.className = 'clippy-rps-btn';
				btn.textContent = m;
				btn.addEventListener('click', () => this.play(m));
				buttons.appendChild(btn);
			});

			container.appendChild(buttons);
			body.appendChild(container);
			window.ClippyUI.scrollLogToBottom();
		}
	}

	class MiniMinesweeperActivity {
		constructor() {
			this.rows = 6;
			this.cols = 6;
			this.mineCount = 5;
			this.board = [];
			this.revealed = [];
			this.flagged = [];
			this.isGameOver = false;
			this.isWon = false;
			this.card = null;
		}

		mount() {
			this.initBoard();
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('mines')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.mines) || { title: 'Minesweeper Mini', badge: '6x6 Field' });
			this.card = window.ClippyUI.createActivityCard(txt.title || 'Minesweeper Mini', txt.badge || '6x6 Field');
			this.render();
		}

		initBoard() {
			this.board = Array(this.rows * this.cols).fill(0);
			this.revealed = Array(this.rows * this.cols).fill(false);
			this.flagged = Array(this.rows * this.cols).fill(false);
			this.isGameOver = false;
			this.isWon = false;

			let placed = 0;
			while (placed < this.mineCount) {
				const idx = Math.floor(Math.random() * this.board.length);
				if (this.board[idx] !== -1) {
					this.board[idx] = -1;
					placed++;
				}
			}

			for (let r = 0; r < this.rows; r++) {
				for (let c = 0; c < this.cols; c++) {
					const idx = r * this.cols + c;
					if (this.board[idx] === -1) continue;
					let count = 0;
					for (let dr = -1; dr <= 1; dr++) {
						for (let dc = -1; dc <= 1; dc++) {
							const nr = r + dr;
							const nc = c + dc;
							if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
								if (this.board[nr * this.cols + nc] === -1) count++;
							}
						}
					}
					this.board[idx] = count;
				}
			}
		}

		reveal(idx) {
			if (this.isGameOver || this.revealed[idx] || this.flagged[idx]) return;

			if (this.board[idx] === -1) {
				this.revealed[idx] = true;
				this.isGameOver = true;
				this.isWon = false;
				if (window.ClippyAudio) window.ClippyAudio.play('lose');
				this.render();
				return;
			}

			const queue = [idx];
			this.revealed[idx] = true;

			while (queue.length > 0) {
				const curr = queue.shift();
				const r = Math.floor(curr / this.cols);
				const c = curr % this.cols;

				if (this.board[curr] === 0) {
					for (let dr = -1; dr <= 1; dr++) {
						for (let dc = -1; dc <= 1; dc++) {
							const nr = r + dr;
							const nc = c + dc;
							if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
								const nIdx = nr * this.cols + nc;
								if (!this.revealed[nIdx] && !this.flagged[nIdx]) {
									this.revealed[nIdx] = true;
									if (this.board[nIdx] === 0) queue.push(nIdx);
								}
							}
						}
					}
				}
			}

			if (window.ClippyAudio) window.ClippyAudio.play('type');

			const unrevealedSafe = this.board.filter((v, i) => v !== -1 && !this.revealed[i]).length;
			if (unrevealedSafe === 0) {
				this.isGameOver = true;
				this.isWon = true;
				if (window.ClippyAudio) window.ClippyAudio.play('tada');
			}

			this.render();
		}

		toggleFlag(idx) {
			if (this.isGameOver || this.revealed[idx]) return;
			this.flagged[idx] = !this.flagged[idx];
			if (window.ClippyAudio) window.ClippyAudio.play('action');
			this.render();
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const container = document.createElement('div');
			container.className = 'clippy-mines-container';

			const flagsUsed = this.flagged.filter(Boolean).length;
			const header = document.createElement('div');
			header.className = 'clippy-mines-header';
			const faceLabel = this.isWon ? 'B-)' : (this.isGameOver ? 'X-X' : ':-)');
			header.innerHTML = `
				<div class="clippy-mines-lcd">${String(Math.max(0, this.mineCount - flagsUsed)).padStart(3, '0')}</div>
				<button type="button" class="clippy-mines-face">${faceLabel}</button>
				<div class="clippy-mines-lcd">036</div>
			`;
			header.querySelector('.clippy-mines-face').addEventListener('click', () => {
				this.initBoard();
				this.render();
			});
			container.appendChild(header);

			const grid = document.createElement('div');
			grid.className = 'clippy-mines-grid';

			for (let i = 0; i < this.board.length; i++) {
				const cell = document.createElement('div');
				cell.className = 'clippy-mine-cell';

				if (this.revealed[i]) {
					cell.classList.add('revealed');
					if (this.board[i] === -1) {
						cell.classList.add('mine');
						cell.textContent = '*';
					} else if (this.board[i] > 0) {
						cell.classList.add(`c${this.board[i]}`);
						cell.textContent = this.board[i];
					}
				} else if (this.flagged[i]) {
					cell.textContent = 'P';
					cell.style.color = '#ff0000';
				}

				cell.addEventListener('click', () => this.reveal(i));
				cell.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					this.toggleFlag(i);
				});

				grid.appendChild(cell);
			}

			container.appendChild(grid);
			body.appendChild(container);

			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('mines')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.mines) || {
					winBanner: "All safe sectors revealed! Minefield cleared.",
					lossBanner: "Detonation! Minefield triggered."
				});

			if (this.isWon) {
				const banner = document.createElement('div');
				banner.className = 'clippy-activity-banner win';
				banner.textContent = txt.winBanner;
				body.appendChild(banner);
			} else if (this.isGameOver) {
				const banner = document.createElement('div');
				banner.className = 'clippy-activity-banner loss';
				banner.textContent = txt.lossBanner;
				body.appendChild(banner);
			}

			window.ClippyUI.scrollLogToBottom();

			if (this.isGameOver && window.ClippyAgent && typeof window.ClippyAgent.notifyGameEnded === 'function') {
				window.ClippyAgent.notifyGameEnded('Minesweeper Mini', this.isWon ? 'Cleared' : 'Exploded', () => {
					this.mount();
				});
			}
		}
	}

	class DefragActivity {
		constructor() {
			this.progress = 0;
			this.interval = null;
			this.blocks = [];
			this.card = null;
		}

		mount() {
			this.progress = 0;
			this.blocks = [];
			for (let i = 0; i < 40; i++) {
				this.blocks.push({
					state: Math.random() > 0.45 ? 'frag' : (Math.random() > 0.3 ? 'used' : 'free')
				});
			}
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('defrag')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.defrag) || { title: 'Disk Defragmenter', badge: 'Volume C:' });
			this.card = window.ClippyUI.createActivityCard(txt.title || 'Disk Defragmenter', txt.badge || 'Volume C:');
			this.render();
			this.runSimulation();
		}

		runSimulation() {
			if (this.interval) clearInterval(this.interval);
			let blockIdx = 0;

			this.interval = setInterval(() => {
				this.progress += 4;
				if (blockIdx < this.blocks.length) {
					this.blocks[blockIdx].state = 'optimized';
					blockIdx++;
				}

				if (window.ClippyAudio && this.progress % 8 === 0) {
					window.ClippyAudio.play('crunch');
				}

				if (this.progress >= 100) {
					clearInterval(this.interval);
					this.interval = null;
					this.progress = 100;
					this.blocks.forEach(b => b.state = 'optimized');
					if (window.ClippyAudio) window.ClippyAudio.play('tada');
				}

				this.render();
			}, 120);
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('defrag', { progress: this.progress })
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.defrag) || {
					winBanner: "100% Contiguous. Optimization Complete!",
					progressBanner: "Defragmenting Drive C: Clusters... ({progress}%)"
				});

			const banner = document.createElement('div');
			banner.className = `clippy-activity-banner ${this.progress >= 100 ? 'win' : 'info'}`;
			banner.textContent = this.progress >= 100 
				? txt.winBanner 
				: window.ClippyKnowledge.formatString(txt.progressBanner, { progress: this.progress });
			body.appendChild(banner);

			const map = document.createElement('div');
			map.className = 'clippy-defrag-map';

			this.blocks.forEach((b, i) => {
				const blockEl = document.createElement('div');
				blockEl.className = 'clippy-defrag-block';
				if (b.state === 'free') blockEl.classList.add('free');
				if (b.state === 'frag') blockEl.classList.add('frag');
				if (b.state === 'optimized') blockEl.style.backgroundColor = '#16a34a';
				map.appendChild(blockEl);
			});

			body.appendChild(map);

			const pbox = document.createElement('div');
			pbox.className = 'clippy-progress-box';
			const fill = document.createElement('div');
			fill.className = 'clippy-progress-fill';
			fill.style.width = `${this.progress}%`;
			pbox.appendChild(fill);
			body.appendChild(pbox);

			window.ClippyUI.scrollLogToBottom();

			if (this.progress >= 100 && window.ClippyAgent && typeof window.ClippyAgent.notifyGameEnded === 'function') {
				window.ClippyAgent.notifyGameEnded('Disk Defragmenter', '100% Contiguous', () => {
					this.mount();
				});
			}
		}
	}

	class PomodoroActivity {
		constructor() {
			this.totalSeconds = 25 * 60;
			this.remaining = 25 * 60;
			this.interval = null;
			this.isRunning = false;
			this.card = null;
		}

		mount(minutes = 25) {
			this.totalSeconds = minutes * 60;
			this.remaining = minutes * 60;
			this.isRunning = true;
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('pomodoro', { minutes })
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.pomodoro) || { title: 'Focus Timer', badge: '{minutes}m Session' });
			const badgeText = window.ClippyKnowledge.formatString(txt.badge || '{minutes}m Session', { minutes });
			this.card = window.ClippyUI.createActivityCard(txt.title || 'Focus Timer', badgeText);
			this.start();
			this.render();
		}

		start() {
			if (this.interval) clearInterval(this.interval);
			this.isRunning = true;
			this.interval = setInterval(() => {
				if (this.remaining > 0) {
					this.remaining--;
					this.render();
				} else {
					clearInterval(this.interval);
					this.interval = null;
					this.isRunning = false;
					if (window.ClippyAudio) window.ClippyAudio.play('tada');
					this.render();
				}
			}, 1000);
		}

		pause() {
			if (this.interval) clearInterval(this.interval);
			this.interval = null;
			this.isRunning = false;
			this.render();
		}

		reset() {
			if (this.interval) clearInterval(this.interval);
			this.interval = null;
			this.remaining = this.totalSeconds;
			this.isRunning = false;
			this.render();
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const mins = Math.floor(this.remaining / 60);
			const secs = this.remaining % 60;
			const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

			const display = document.createElement('div');
			display.className = 'clippy-timer-display';
			display.innerHTML = `<div class="clippy-timer-digits">${timeStr}</div>`;
			body.appendChild(display);

			const pbox = document.createElement('div');
			pbox.className = 'clippy-progress-box';
			const fill = document.createElement('div');
			fill.className = 'clippy-progress-fill';
			const pct = ((this.totalSeconds - this.remaining) / this.totalSeconds) * 100;
			fill.style.width = `${pct}%`;
			pbox.appendChild(fill);
			body.appendChild(pbox);

			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('pomodoro', { minutes: Math.round(this.totalSeconds / 60) })
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.pomodoro) || {
					breakBanner: "Focus interval completed! Take a 5-minute break.",
					btnPause: "Pause", btnResume: "Resume", btnReset: "Reset"
				});

			if (this.remaining === 0) {
				const banner = document.createElement('div');
				banner.className = 'clippy-activity-banner win';
				banner.textContent = txt.breakBanner;
				body.appendChild(banner);
			}

			const actions = document.createElement('div');
			actions.className = 'clippy-actions-bar';

			if (this.remaining > 0) {
				const toggleBtn = document.createElement('button');
				toggleBtn.type = 'button';
				toggleBtn.className = 'clippy-action-btn';
				toggleBtn.textContent = this.isRunning ? txt.btnPause : txt.btnResume;
				toggleBtn.addEventListener('click', () => {
					if (this.isRunning) this.pause();
					else this.start();
				});
				actions.appendChild(toggleBtn);
			}

			const resetBtn = document.createElement('button');
			resetBtn.type = 'button';
			resetBtn.className = 'clippy-action-btn';
			resetBtn.textContent = txt.btnReset;
			resetBtn.addEventListener('click', () => this.reset());
			actions.appendChild(resetBtn);

			body.appendChild(actions);
			window.ClippyUI.scrollLogToBottom();
		}
	}

	class TodoActivity {
		constructor() {
			this.todos = [];
			this.card = null;
		}

		mount() {
			this.todos = ActivitiesManager.getStoredTodos();
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('todo')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.todo) || { title: 'Task Manager', badge: 'To-Do List' });
			this.card = window.ClippyUI.createActivityCard(txt.title || 'Task Manager', txt.badge || 'To-Do List');
			this.render();
		}

		add(text) {
			const cleanText = String(text || '').trim();
			if (!cleanText) return;
			const currentList = ActivitiesManager.getStoredTodos();
			currentList.push({ id: Date.now() + Math.floor(Math.random() * 1000), text: cleanText, done: false });
			ActivitiesManager.saveStoredTodos(currentList);
			this.todos = currentList;
			if (window.ClippyAudio) window.ClippyAudio.play('action');
			this.render();
		}

		toggle(id) {
			const item = this.todos.find(t => t.id === id);
			if (item) {
				item.done = !item.done;
				ActivitiesManager.saveStoredTodos(this.todos);
				if (window.ClippyAudio) window.ClippyAudio.play(item.done ? 'win' : 'type');
				this.render();
			}
		}

		remove(id) {
			this.todos = this.todos.filter(t => t.id !== id);
			ActivitiesManager.saveStoredTodos(this.todos);
			if (window.ClippyAudio) window.ClippyAudio.play('action');
			this.render();
		}

		clearCompleted() {
			this.todos = this.todos.filter(t => !t.done);
			ActivitiesManager.saveStoredTodos(this.todos);
			this.render();
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('todo')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.todo) || {
					scorePending: "Pending", scoreCompleted: "Completed", scoreTotal: "Total",
					emptyNotice: "No tasks registered. Add a task below.", inputPlaceholder: "New task description...",
					btnAdd: "+ Add", btnClear: "Clear Completed"
				});

			const pendingCount = this.todos.filter(t => !t.done).length;
			const scoreboard = document.createElement('div');
			scoreboard.className = 'clippy-scoreboard';
			scoreboard.innerHTML = `
				<div class="clippy-score-item"><span>${txt.scorePending}</span><strong>${pendingCount}</strong></div>
				<div class="clippy-score-item"><span>${txt.scoreCompleted}</span><strong>${this.todos.length - pendingCount}</strong></div>
				<div class="clippy-score-item"><span>${txt.scoreTotal}</span><strong>${this.todos.length}</strong></div>
			`;
			body.appendChild(scoreboard);

			const listContainer = document.createElement('div');
			listContainer.className = 'clippy-todo-container';

			if (this.todos.length === 0) {
				listContainer.innerHTML = `<div style="padding: 10px; font-size: 11px; color: #777; text-align: center;">${txt.emptyNotice}</div>`;
			} else {
				this.todos.forEach(t => {
					const item = document.createElement('div');
					item.className = `clippy-todo-item ${t.done ? 'done' : ''}`;

					const check = document.createElement('input');
					check.type = 'checkbox';
					check.className = 'clippy-todo-check';
					check.checked = t.done;
					check.addEventListener('change', () => this.toggle(t.id));

					const span = document.createElement('span');
					span.style.flex = '1';
					span.textContent = t.text;

					const del = document.createElement('button');
					del.type = 'button';
					del.className = 'clippy-todo-del';
					del.innerHTML = '&times;';
					del.addEventListener('click', () => this.remove(t.id));

					item.appendChild(check);
					item.appendChild(span);
					item.appendChild(del);
					listContainer.appendChild(item);
				});
			}

			body.appendChild(listContainer);

			const inputRow = document.createElement('div');
			inputRow.className = 'clippy-guess-input-row';

			const input = document.createElement('input');
			input.type = 'text';
			input.className = 'clippy-guess-input';
			input.placeholder = txt.inputPlaceholder;

			const handleCommit = () => {
				const val = input.value;
				if (val && val.trim()) {
					this.add(val);
				}
			};

			const addBtn = document.createElement('button');
			addBtn.type = 'button';
			addBtn.className = 'clippy-action-btn';
			addBtn.textContent = txt.btnAdd;
			addBtn.addEventListener('click', (e) => {
				e.preventDefault();
				handleCommit();
			});

			input.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') {
					e.preventDefault();
					handleCommit();
				}
			});

			inputRow.appendChild(input);
			inputRow.appendChild(addBtn);
			body.appendChild(inputRow);

			if (this.todos.some(t => t.done)) {
				const actions = document.createElement('div');
				actions.className = 'clippy-actions-bar';
				const clearBtn = document.createElement('button');
				clearBtn.type = 'button';
				clearBtn.className = 'clippy-action-btn';
				clearBtn.textContent = txt.btnClear;
				clearBtn.addEventListener('click', () => this.clearCompleted());
				actions.appendChild(clearBtn);
				body.appendChild(actions);
			}

			window.ClippyUI.scrollLogToBottom();
		}
	}

	class PetActivity {
		constructor() {
			this.pet = null;
			this.card = null;
			this.cooldowns = {
				feed: 0,
				polish: 0,
				sleep: 0
			};
		}

		mount() {
			this.pet = ActivitiesManager.getPetState();
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('pet')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.pet) || { title: 'Assistant Metrics & Vitals', badge: 'Assistant Tamagotchi' });
			this.card = window.ClippyUI.createActivityCard(txt.title || 'Assistant Metrics & Vitals', txt.badge || 'Assistant Tamagotchi');
			this.render();
		}

		getRemainingCooldown(actionKey) {
			const now = Date.now();
			const target = this.cooldowns[actionKey] || 0;
			return Math.max(0, Math.ceil((target - now) / 1000));
		}

		setCooldown(actionKey, seconds) {
			this.cooldowns[actionKey] = Date.now() + (seconds * 1000);
		}

		feed() {
			const cd = this.getRemainingCooldown('feed');
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('pet')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.pet) || {});

			if (cd > 0) {
				const cdNotice = window.ClippyKnowledge && window.ClippyKnowledge.formatString
					? window.ClippyKnowledge.formatString(txt.noticeCooldown || "Please wait {seconds}s before feeding again.", { seconds: cd })
					: `Please wait ${cd}s before feeding again.`;
				this.render(cdNotice, 'loss');
				return;
			}

			if (this.pet.hunger <= 0) {
				this.pet.xp += 2;
				this.setCooldown('feed', 6);
				ActivitiesManager.savePetState(this.pet);
				this.render(txt.noticeFeedFull || "Reserves are already full! Clippit does not need more paperclips right now (+2 XP).", 'info');
				return;
			}

			const hungerRelief = Math.min(35, this.pet.hunger);
			this.pet.hunger = Math.max(0, this.pet.hunger - hungerRelief);
			this.pet.happiness = Math.min(100, this.pet.happiness + 12);
			this.pet.xp += 15;
			this.pet.totalFeeds = (this.pet.totalFeeds || 0) + 1;
			this.setCooldown('feed', 8);

			if (window.ClippyBrain) {
				window.ClippyBrain.applyMoodDelta({ energy: 8, affinity: 4, irritation: -6 });
			}

			ActivitiesManager.savePetState(this.pet);
			if (window.ClippyAudio) window.ClippyAudio.play('win');
			this.render(txt.noticeFeed || "Paperclips supplied! Metal reserves replenished (+15 XP).", 'win');
		}

		polish() {
			const cd = this.getRemainingCooldown('polish');
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('pet')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.pet) || {});

			if (cd > 0) {
				const cdNotice = window.ClippyKnowledge && window.ClippyKnowledge.formatString
					? window.ClippyKnowledge.formatString(txt.noticeCooldown || "Please wait {seconds}s before polishing again.", { seconds: cd })
					: `Please wait ${cd}s before polishing again.`;
				this.render(cdNotice, 'loss');
				return;
			}

			if (this.pet.luster >= 100) {
				this.pet.xp += 2;
				this.setCooldown('polish', 6);
				ActivitiesManager.savePetState(this.pet);
				this.render(txt.noticePolishClean || "Wire is already completely spotless and shining (+2 XP)!", 'info');
				return;
			}

			this.pet.luster = Math.min(100, (this.pet.luster || 70) + 25);
			this.pet.happiness = Math.min(100, this.pet.happiness + 15);
			this.pet.xp += 12;
			this.pet.totalPolishes = (this.pet.totalPolishes || 0) + 1;
			this.setCooldown('polish', 10);

			if (window.ClippyBrain) {
				window.ClippyBrain.applyMoodDelta({ affinity: 8, patience: 8, irritation: -8 });
			}

			ActivitiesManager.savePetState(this.pet);
			if (window.ClippyAudio) window.ClippyAudio.play('action');
			this.render(txt.noticePolish || "Wire polished with jeweler's cloth! Luster maximized (+12 XP).", 'win');
		}

		sleep() {
			const cd = this.getRemainingCooldown('sleep');
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('pet')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.pet) || {});

			if (cd > 0) {
				const cdNotice = window.ClippyKnowledge && window.ClippyKnowledge.formatString
					? window.ClippyKnowledge.formatString(txt.noticeCooldown || "Please wait {seconds}s before entering standby again.", { seconds: cd })
					: `Please wait ${cd}s before entering standby again.`;
				this.render(cdNotice, 'loss');
				return;
			}

			if (this.pet.energy >= 95) {
				this.pet.xp += 2;
				this.setCooldown('sleep', 8);
				ActivitiesManager.savePetState(this.pet);
				this.render(txt.noticeSleepFull || "Capacitance is already at maximum! Clippy is fully energized (+2 XP).", 'info');
				return;
			}

			this.pet.energy = 100;
			this.pet.hunger = Math.min(100, this.pet.hunger + 8);
			this.pet.xp += 15;
			this.pet.totalSleeps = (this.pet.totalSleeps || 0) + 1;
			this.setCooldown('sleep', 15);

			if (window.ClippyBrain) {
				window.ClippyBrain.applyMoodDelta({ fatigue: -35, energy: 35, patience: 15 });
			}

			ActivitiesManager.savePetState(this.pet);
			if (window.ClippyAudio) window.ClippyAudio.play('action');
			this.render(txt.noticeSleep || "Deep C3 low-power standby completed! Capacitors recharged to 100% (+15 XP).", 'win');
		}

		getTitleForLevel(level) {
			const txt = (window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.pet) || {};
			const titles = txt.levelTitles || [
				"Wire Novice", "Polished Assistant", "Silicon Specialist", "Vector Companion", "System Optimist", "Heuristic Navigator", "Logic Guardian", "Master of Fasteners",
				"High-Performance Agent", "Grand Desktop Architect"
			];
			const idx = Math.max(0, Math.min(titles.length - 1, (level || 1) - 1));
			return titles[idx];
		}

		render(notice = '', bannerType = 'win') {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const currentMood = (window.ClippyBrain && typeof window.ClippyBrain.getMood === 'function') ? window.ClippyBrain.getMood() : 'OPTIMISTIC';
			const currentPatience = (window.ClippyBrain && typeof window.ClippyBrain.getPatience === 'function') ? window.ClippyBrain.getPatience() : 60;
			const currentAffinity = (window.ClippyBrain && typeof window.ClippyBrain.getAffinity === 'function') ? window.ClippyBrain.getAffinity() : 50;

			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('pet')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.pet) || {
					scoreLevel: "Level", scoreXp: "XP", scoreHealth: "Health", healthNominal: "Nominal",
					moraleLabel: "Morale:", energyLabel: "Capacitance:", depletionLabel: "Depletion:",
					oxidationLabel: "Wire Luster:", statusTitleLabel: "Classification:",
					btnFeed: "Supply Paperclips", btnPolish: "Polish Metal Wire", btnSleep: "Standby Mode"
				});

			const xpRequired = this.pet.level * 60;
			const xpPercent = Math.min(100, Math.round((this.pet.xp / xpRequired) * 100));
			const currentTitle = this.getTitleForLevel(this.pet.level);

			const scoreboard = document.createElement('div');
			scoreboard.className = 'clippy-scoreboard';
			scoreboard.innerHTML = `
				<div class="clippy-score-item"><span>${txt.scoreLevel}</span><strong>Lv.${this.pet.level}</strong></div>
				<div class="clippy-score-item"><span>${txt.scoreXp}</span><strong>${this.pet.xp} / ${xpRequired}</strong></div>
				<div class="clippy-score-item"><span>${txt.scoreHealth}</span><strong>${txt.healthNominal}</strong></div>
			`;
			body.appendChild(scoreboard);

			if (notice) {
				const banner = document.createElement('div');
				banner.className = `clippy-activity-banner ${bannerType}`;
				banner.textContent = notice;
				body.appendChild(banner);
			}

			const meter = document.createElement('div');
			meter.className = 'clippy-pet-meter';
			meter.innerHTML = `
				<div class="clippy-pet-row"><span>${txt.statusTitleLabel || 'Classification:'}</span><strong>${currentTitle}</strong></div>
				<div class="clippy-pet-bar"><div class="clippy-pet-bar-fill xp" style="width:${xpPercent}%; background: linear-gradient(to right, #8b5cf6, #3b82f6);"></div></div>
				<div class="clippy-pet-row"><span>${txt.moraleLabel}</span><strong>${this.pet.happiness}%</strong></div>
				<div class="clippy-pet-bar"><div class="clippy-pet-bar-fill happiness" style="width:${this.pet.happiness}%"></div></div>
				<div class="clippy-pet-row"><span>${txt.energyLabel}</span><strong>${this.pet.energy}%</strong></div>
				<div class="clippy-pet-bar"><div class="clippy-pet-bar-fill energy" style="width:${this.pet.energy}%"></div></div>
				<div class="clippy-pet-row"><span>${txt.depletionLabel}</span><strong>${this.pet.hunger}%</strong></div>
				<div class="clippy-pet-bar"><div class="clippy-pet-bar-fill hunger" style="width:${this.pet.hunger}%"></div></div>
				<div class="clippy-pet-row"><span>${txt.oxidationLabel || 'Wire Luster:'}</span><strong>${this.pet.luster || 75}%</strong></div>
				<div class="clippy-pet-bar"><div class="clippy-pet-bar-fill luster" style="width:${this.pet.luster || 75}%; background: linear-gradient(to right, #fbbf24, #10b981);"></div></div>
				<div class="clippy-pet-badges-grid">
					<div class="clippy-pet-stat-badge"><span>Mood:</span><strong>${currentMood}</strong></div>
					<div class="clippy-pet-stat-badge"><span>Affinity:</span><strong>${currentAffinity}%</strong></div>
					<div class="clippy-pet-stat-badge"><span>Patience:</span><strong>${currentPatience}%</strong></div>
					<div class="clippy-pet-stat-badge"><span>Care Streak:</span><strong>${(this.pet.totalFeeds || 0) + (this.pet.totalPolishes || 0)} actions</strong></div>
				</div>
			`;
			body.appendChild(meter);

			const actions = document.createElement('div');
			actions.className = 'clippy-actions-bar';

			const feedBtn = document.createElement('button');
			feedBtn.type = 'button';
			feedBtn.className = 'clippy-action-btn';
			const feedCd = this.getRemainingCooldown('feed');
			feedBtn.textContent = feedCd > 0 ? `${txt.btnFeed} (${feedCd}s)` : txt.btnFeed;
			feedBtn.disabled = feedCd > 0;
			feedBtn.addEventListener('click', () => this.feed());
			actions.appendChild(feedBtn);

			const polishBtn = document.createElement('button');
			polishBtn.type = 'button';
			polishBtn.className = 'clippy-action-btn';
			const polishCd = this.getRemainingCooldown('polish');
			polishBtn.textContent = polishCd > 0 ? `${txt.btnPolish} (${polishCd}s)` : txt.btnPolish;
			polishBtn.disabled = polishCd > 0;
			polishBtn.addEventListener('click', () => this.polish());
			actions.appendChild(polishBtn);

			const sleepBtn = document.createElement('button');
			sleepBtn.type = 'button';
			sleepBtn.className = 'clippy-action-btn';
			const sleepCd = this.getRemainingCooldown('sleep');
			sleepBtn.textContent = sleepCd > 0 ? `${txt.btnSleep} (${sleepCd}s)` : txt.btnSleep;
			sleepBtn.disabled = sleepCd > 0;
			sleepBtn.addEventListener('click', () => this.sleep());
			actions.appendChild(sleepBtn);

			body.appendChild(actions);
			window.ClippyUI.scrollLogToBottom();
		}
	}

	class PhysicalDimensionalAnalysisActivity {
		constructor() {
			this.card = null;
		}

		mount(initialEq = 'F = m * a') {
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('dimensionalAnalysis')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.dimensionalAnalysis) || { title: 'Dimensional Analysis', badge: 'Physics Validator' });
			this.card = window.ClippyUI.createActivityCard(txt.title || 'Dimensional Analysis', txt.badge || 'Physics Validator');
			this.render(initialEq);
		}

		checkHomogeneity(eqString) {
			const quantities = (window.ClippyKnowledge && window.ClippyKnowledge.PHYSICAL_QUANTITIES) || {};
			const constants = (window.ClippyKnowledge && window.ClippyKnowledge.PHYSICAL_CONSTANTS) || {};

			const txt = (window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.dimensionalAnalysis) || {};
			const cleanEq = eqString.replace(/^(check homogeneity|dimensional analysis|analyse dimensionnelle|homogeneity of)\s*/i, '').trim();
			const parts = cleanEq.split('=').map(p => p.trim());
			if (parts.length !== 2) {
				return { valid: false, error: txt.errEquals || 'Equation must contain exactly one equals sign (=).' };
			}

			const resolveSymbolDim = (sym) => {
				const s = sym.trim();
				if (!s || /^\d+(\.\d+)?$/.test(s)) return { M: 0, L: 0, T: 0, I: 0, Theta: 0, N: 0 };
				for (const qKey in quantities) {
					if (quantities[qKey].symbols && quantities[qKey].symbols.includes(s)) {
						return Object.assign({ M: 0, L: 0, T: 0, I: 0, Theta: 0, N: 0 }, quantities[qKey].dim);
					}
				}
				for (const cKey in constants) {
					if (constants[cKey].symbol === s || cKey === s) {
						return Object.assign({ M: 0, L: 0, T: 0, I: 0, Theta: 0, N: 0 }, constants[cKey].dim);
					}
				}
				const lower = s.toLowerCase();
				if (['m', 'mass'].includes(lower)) return { M: 1, L: 0, T: 0, I: 0, Theta: 0, N: 0 };
				if (['l', 'r', 'd', 'x', 'y', 'z', 'h', 'w'].includes(lower)) return { M: 0, L: 1, T: 0, I: 0, Theta: 0, N: 0 };
				if (['t', 'tau', 'time'].includes(lower)) return { M: 0, L: 0, T: 1, I: 0, Theta: 0, N: 0 };
				if (['v', 'u', 'c', 'speed', 'velocity'].includes(lower)) return { M: 0, L: 1, T: -1, I: 0, Theta: 0, N: 0 };
				if (['a', 'g', 'accel'].includes(lower)) return { M: 0, L: 1, T: -2, I: 0, Theta: 0, N: 0 };
				if (['f', 'force', 'n'].includes(lower)) return { M: 1, L: 1, T: -2, I: 0, Theta: 0, N: 0 };
				if (['e', 'k', 'u', 'w', 'energy'].includes(lower)) return { M: 1, L: 2, T: -2, I: 0, Theta: 0, N: 0 };
				if (['p', 'power'].includes(lower)) return { M: 1, L: 2, T: -3, I: 0, Theta: 0, N: 0 };
				if (['press', 'pressure'].includes(lower)) return { M: 1, L: -1, T: -2, I: 0, Theta: 0, N: 0 };
				if (['rho', 'density'].includes(lower)) return { M: 1, L: -3, T: 0, I: 0, Theta: 0, N: 0 };
				if (['q', 'charge'].includes(lower)) return { M: 0, L: 0, T: 1, I: 1, Theta: 0, N: 0 };
				if (['i', 'current'].includes(lower)) return { M: 0, L: 0, T: 0, I: 1, Theta: 0, N: 0 };
				return { M: 0, L: 0, T: 0, I: 0, Theta: 0, N: 0 };
			};

			const parseExpressionDim = (expr) => {
				const terms = expr.split(/(?=[+-])(?![^(]*\))/).map(t => t.trim()).filter(Boolean);
				const termDimensions = [];

				for (let term of terms) {
					if (term.startsWith('+')) term = term.substring(1).trim();
					if (term.startsWith('-')) term = term.substring(1).trim();

					const dim = { M: 0, L: 0, T: 0, I: 0, Theta: 0, N: 0 };
					const factors = term.split(/(?=[*/])|(?<=[*/])/).map(s => s.trim()).filter(Boolean);

					let op = '*';
					for (let i = 0; i < factors.length; i++) {
						const f = factors[i];
						if (f === '*' || f === '/') {
							op = f;
							continue;
						}
						let baseSymbol = f;
						let exponent = 1;
						if (f.includes('^')) {
							const expParts = f.split('^');
							baseSymbol = expParts[0].trim();
							exponent = parseFloat(expParts[1]) || 1;
						}
						const factorDim = resolveSymbolDim(baseSymbol);
						const sign = (op === '/') ? -1 : 1;
						for (const k of ['M', 'L', 'T', 'I', 'Theta', 'N']) {
							dim[k] += (factorDim[k] || 0) * exponent * sign;
						}
						op = '*';
					}
					termDimensions.push(dim);
				}
				return termDimensions;
			};

			try {
				const lhsDims = parseExpressionDim(parts[0]);
				const rhsDims = parseExpressionDim(parts[1]);

				const formatDim = (d) => {
					const partsStr = [];
					if (d.M) partsStr.push(`[M]${d.M !== 1 ? `<sup>${d.M}</sup>` : ''}`);
					if (d.L) partsStr.push(`[L]${d.L !== 1 ? `<sup>${d.L}</sup>` : ''}`);
					if (d.T) partsStr.push(`[T]${d.T !== 1 ? `<sup>${d.T}</sup>` : ''}`);
					if (d.I) partsStr.push(`[I]${d.I !== 1 ? `<sup>${d.I}</sup>` : ''}`);
					if (d.Theta) partsStr.push(`[Θ]${d.Theta !== 1 ? `<sup>${d.Theta}</sup>` : ''}`);
					if (d.N) partsStr.push(`[N]${d.N !== 1 ? `<sup>${d.N}` : ''}`);
					return partsStr.length > 0 ? partsStr.join(' · ') : '[1] (Dimensionless)';
				};

				const checkMatch = (d1, d2) => {
					return ['M', 'L', 'T', 'I', 'Theta', 'N'].every(k => Math.abs((d1[k] || 0) - (d2[k] || 0)) < 1e-4);
				};

				const isLhsSelfConsistent = lhsDims.every(d => checkMatch(d, lhsDims[0]));
				const isRhsSelfConsistent = rhsDims.every(d => checkMatch(d, rhsDims[0]));
				const isHomogeneous = isLhsSelfConsistent && isRhsSelfConsistent && checkMatch(lhsDims[0], rhsDims[0]);

				return {
					valid: true,
					equation: cleanEq,
					isHomogeneous,
					lhsText: parts[0],
					rhsText: parts[1],
					lhsDimension: formatDim(lhsDims[0] || {}),
					rhsDimension: formatDim(rhsDims[0] || {})
				};
			} catch (e) {
				const txt = (window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.dimensionalAnalysis) || {};
				return { valid: false, error: txt.errResolve || 'Could not resolve expression dimensions.' };
			}
		}

		render(currentEq = '') {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const res = currentEq ? this.checkHomogeneity(currentEq) : null;

			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('dimensionalAnalysis')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.dimensionalAnalysis) || {
					inputPlaceholder: "e.g. F = m * a or E = m * c^2", btnVerify: "Verify",
					homogeneousBanner: "Dimensionally Homogeneous (Valid Equation Structure)",
					inconsistentBanner: "Dimensionally Inconsistent (Unit Mismatch Detected)",
					tableSide: "Side", tableExpression: "Expression", tableDimension: "Base SI Dimension",
					labelLhs: "LHS", labelRhs: "RHS", errGeneric: "Parsing error.",
					samples: ['F = m * a', 'E = m * c^2', 'v = d / t', 'P = F * v', 'E = m * g * h']
				});

			const inputRow = document.createElement('div');
			inputRow.className = 'clippy-guess-input-row';

			const input = document.createElement('input');
			input.type = 'text';
			input.className = 'clippy-guess-input';
			input.value = currentEq || 'E = m * c^2';
			input.placeholder = txt.inputPlaceholder;

			const btn = document.createElement('button');
			btn.type = 'button';
			btn.className = 'clippy-action-btn';
			btn.textContent = txt.btnVerify;
			btn.addEventListener('click', () => this.render(input.value.trim()));

			input.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') this.render(input.value.trim());
			});

			inputRow.appendChild(input);
			inputRow.appendChild(btn);
			body.appendChild(inputRow);

			if (res && res.valid) {
				const banner = document.createElement('div');
				banner.className = `clippy-activity-banner ${res.isHomogeneous ? 'win' : 'loss'}`;
				banner.textContent = res.isHomogeneous ? txt.homogeneousBanner : txt.inconsistentBanner;
				body.appendChild(banner);

				const table = document.createElement('table');
				table.className = 'clippy-xp-table';
				table.innerHTML = `
					<tr><th>${txt.tableSide}</th><th>${txt.tableExpression}</th><th>${txt.tableDimension}</th></tr>
					<tr><td><b>${txt.labelLhs || 'LHS'}</b></td><td><code>${res.lhsText}</code></td><td><strong>${res.lhsDimension}</strong></td></tr>
					<tr><td><b>${txt.labelRhs || 'RHS'}</b></td><td><code>${res.rhsText}</code></td><td><strong>${res.rhsDimension}</strong></td></tr>
				`;
				body.appendChild(table);
			} else if (res && !res.valid) {
				const banner = document.createElement('div');
				banner.className = 'clippy-activity-banner loss';
				banner.textContent = res.error || txt.errGeneric || 'Parsing error.';
				body.appendChild(banner);
			}

			const samplesBar = document.createElement('div');
			samplesBar.className = 'clippy-actions-bar';
			const sampleList = txt.samples || ['F = m * a', 'E = m * c^2', 'v = d / t', 'P = F * v', 'E = m * g * h'];
			sampleList.forEach(s => {
				const sBtn = document.createElement('button');
				sBtn.type = 'button';
				sBtn.className = 'clippy-action-btn';
				sBtn.textContent = s;
				sBtn.addEventListener('click', () => this.render(s));
				samplesBar.appendChild(sBtn);
			});
			body.appendChild(samplesBar);
			window.ClippyUI.scrollLogToBottom();
		}
	}

	class EuclideanDivisionActivity {
		constructor() {
			this.card = null;
		}

		mount() {
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('euclideanDivision')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.euclideanDivision) || { title: 'Euclidean Division', badge: 'Integer & Polynomial' });
			this.card = window.ClippyUI.createActivityCard(txt.title || 'Euclidean Division', txt.badge || 'Integer & Polynomial');
			this.render();
		}

		divideIntegers(a, b) {
			const txt = (window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.euclideanDivision) || {};
			a = Math.floor(a);
			b = Math.floor(b);
			if (b === 0) return { error: txt.errDivZero || 'Division by zero is undefined.' };
			const q = Math.floor(a / b);
			const r = a - (b * q);
			return { a, b, q, r, formula: `${a} = ${b} × ${q} + ${r}` };
		}

		dividePolynomials(pCoeffs, dCoeffs) {
			const txt = (window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.euclideanDivision) || {};
			while (pCoeffs.length > 1 && pCoeffs[pCoeffs.length - 1] === 0) pCoeffs.pop();
			while (dCoeffs.length > 1 && dCoeffs[dCoeffs.length - 1] === 0) dCoeffs.pop();

			if (dCoeffs.length === 1 && dCoeffs[0] === 0) {
				return { error: txt.errPolyZero || 'Division by zero polynomial.' };
			}

			const rem = [...pCoeffs];
			const quo = Array(Math.max(0, pCoeffs.length - dCoeffs.length + 1)).fill(0);

			for (let i = pCoeffs.length - dCoeffs.length; i >= 0; i--) {
				const coeff = rem[i + dCoeffs.length - 1] / dCoeffs[dCoeffs.length - 1];
				quo[i] = coeff;
				for (let j = 0; j < dCoeffs.length; j++) {
					rem[i + j] -= coeff * dCoeffs[j];
				}
			}

			while (rem.length > 1 && Math.abs(rem[rem.length - 1]) < 1e-7) rem.pop();
			return { quo, rem };
		}

		formatPolynomial(coeffs) {
			if (!coeffs || coeffs.length === 0) return '0';
			const terms = [];
			for (let i = coeffs.length - 1; i >= 0; i--) {
				const c = Math.round(coeffs[i] * 100) / 100;
				if (c === 0 && coeffs.length > 1) continue;
				if (i === 0) {
					terms.push(c > 0 && terms.length > 0 ? `+ ${c}` : (c < 0 && terms.length > 0 ? `- ${Math.abs(c)}` : `${c}`));
				} else if (i === 1) {
					const coeffStr = Math.abs(c) === 1 ? '' : Math.abs(c);
					terms.push(c > 0 && terms.length > 0 ? `+ ${coeffStr}x` : (c < 0 && terms.length > 0 ? `- ${coeffStr}x` : `${c === -1 ? '-' : (c === 1 ? '' : c)}x`));
				} else {
					const coeffStr = Math.abs(c) === 1 ? '' : Math.abs(c);
					terms.push(c > 0 && terms.length > 0 ? `+ ${coeffStr}x^${i}` : (c < 0 && terms.length > 0 ? `- ${coeffStr}x^${i}` : `${c === -1 ? '-' : (c === 1 ? '' : c)}x^${i}`));
				}
			}
			return terms.length > 0 ? terms.join(' ') : '0';
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('euclideanDivision')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.euclideanDivision) || {
					tabIntegers: 'Integers (a = b·q + r)', tabPolynomials: 'Polynomials (P(x) / D(x))',
					intInstructions: 'Calculate integer quotient $q$ and remainder $r$:',
					intDividendPlaceholder: 'Dividend a', intDivisorPlaceholder: 'Divisor b', intBtnCompute: 'Compute',
					polyInstructions: 'Divide polynomial $P(x)$ by $D(x)$ (enter coefficients from constant to highest power):',
					polyDividendLabel: 'P(x) Coeffs:', polyDivisorLabel: 'D(x) Coeffs:',
					polyDividendPlaceholder: 'e.g. -5, 4, -3, 2 for 2x³ - 3x² + 4x - 5',
					polyDivisorPlaceholder: 'e.g. -2, 1 for x - 2', polyBtnDivide: 'Divide Polynomials',
					polyFormulaBanner: 'P(x) = D(x) · Q(x) + R(x)',
					tableProperty: 'Property', tableValue: 'Value', tableComponent: 'Component', tableExpression: 'Polynomial Expression',
					labelDividend: 'Dividend ($a$)', labelDivisor: 'Divisor ($b$)', labelQuotient: 'Quotient ($q$)', labelRemainder: 'Remainder ($r$)',
					labelPolyDividend: 'Dividend $P(x)$', labelPolyDivisor: 'Divisor $D(x)$', labelPolyQuotient: 'Quotient $Q(x)$', labelPolyRemainder: 'Remainder $R(x)$',
					errDivZero: 'Division by zero is undefined.', errPolyZero: 'Division by zero polynomial.',
					errPolyCoeffs: 'Please enter valid comma-separated numerical coefficients.'
				});

			const tabRow = document.createElement('div');
			tabRow.className = 'clippy-actions-bar';

			const intBtn = document.createElement('button');
			intBtn.type = 'button';
			intBtn.className = 'clippy-action-btn active';
			intBtn.textContent = txt.tabIntegers || 'Integers (a = b·q + r)';

			const polyBtn = document.createElement('button');
			polyBtn.type = 'button';
			polyBtn.className = 'clippy-action-btn';
			polyBtn.textContent = txt.tabPolynomials || 'Polynomials (P(x) / D(x))';

			tabRow.appendChild(intBtn);
			tabRow.appendChild(polyBtn);
			body.appendChild(tabRow);

			const contentBox = document.createElement('div');
			contentBox.style.marginTop = '6px';
			body.appendChild(contentBox);

			const renderIntegerDivision = () => {
				contentBox.innerHTML = `
					<div style="font-size:11px; margin-bottom:6px;">${txt.intInstructions}</div>
					<div class="clippy-guess-input-row" style="margin-bottom:6px;">
						<input type="number" class="clippy-guess-input" id="euclid-int-a" value="145" placeholder="${txt.intDividendPlaceholder}">
						<span style="align-self:center;font-weight:bold;">÷</span>
						<input type="number" class="clippy-guess-input" id="euclid-int-b" value="12" placeholder="${txt.intDivisorPlaceholder}">
						<button type="button" class="clippy-action-btn" id="euclid-int-calc">${txt.intBtnCompute}</button>
					</div>
					<div id="euclid-int-res"></div>
				`;
				const aIn = contentBox.querySelector('#euclid-int-a');
				const bIn = contentBox.querySelector('#euclid-int-b');
				const resBox = contentBox.querySelector('#euclid-int-res');

				const doCalc = () => {
					const a = parseFloat(aIn.value);
					const b = parseFloat(bIn.value);
					const res = this.divideIntegers(a, b);
					if (res.error) {
						resBox.innerHTML = `<div class="clippy-activity-banner loss">${res.error}</div>`;
					} else {
						resBox.innerHTML = `
							<div class="clippy-activity-banner win">${res.formula}</div>
							<table class="clippy-xp-table" style="margin-top:6px;">
								<tr><th>${txt.tableProperty}</th><th>${txt.tableValue}</th></tr>
								<tr><td><b>${txt.labelDividend}</b></td><td>${res.a}</td></tr>
								<tr><td><b>${txt.labelDivisor}</b></td><td>${res.b}</td></tr>
								<tr><td><b>${txt.labelQuotient}</b></td><td><strong>${res.q}</strong></td></tr>
								<tr><td><b>${txt.labelRemainder}</b></td><td><strong>${res.r}</strong></td></tr>
							</table>
						`;
					}
					window.ClippyUI.scrollLogToBottom();
				};
				contentBox.querySelector('#euclid-int-calc').addEventListener('click', doCalc);
				doCalc();
			};

			const renderPolyDivision = () => {
				contentBox.innerHTML = `
					<div style="font-size:11px; margin-bottom:6px;">${txt.polyInstructions}</div>
					<div style="display:flex; flex-direction:column; gap:4px; margin-bottom:6px;">
						<div class="clippy-guess-input-row">
							<label style="width:70px; font-size:11px;">${txt.polyDividendLabel}</label>
							<input type="text" class="clippy-guess-input" id="euclid-poly-p" value="-5, 4, -3, 2" placeholder="${txt.polyDividendPlaceholder}">
						</div>
						<div class="clippy-guess-input-row">
							<label style="width:70px; font-size:11px;">${txt.polyDivisorLabel}</label>
							<input type="text" class="clippy-guess-input" id="euclid-poly-d" value="-2, 1" placeholder="${txt.polyDivisorPlaceholder}">
						</div>
						<div style="display:flex; justify-content:flex-end;">
							<button type="button" class="clippy-action-btn" id="euclid-poly-calc">${txt.polyBtnDivide}</button>
						</div>
					</div>
					<div id="euclid-poly-res"></div>
				`;
				const pIn = contentBox.querySelector('#euclid-poly-p');
				const dIn = contentBox.querySelector('#euclid-poly-d');
				const resBox = contentBox.querySelector('#euclid-poly-res');

				const doCalcPoly = () => {
					const pCoeffs = pIn.value.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
					const dCoeffs = dIn.value.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));

					if (pCoeffs.length === 0 || dCoeffs.length === 0) {
						resBox.innerHTML = `<div class="clippy-activity-banner loss">${txt.errPolyCoeffs}</div>`;
						return;
					}

					const res = this.dividePolynomials(pCoeffs, dCoeffs);
					if (res.error) {
						resBox.innerHTML = `<div class="clippy-activity-banner loss">${res.error}</div>`;
					} else {
						const pStr = this.formatPolynomial(pCoeffs);
						const dStr = this.formatPolynomial(dCoeffs);
						const qStr = this.formatPolynomial(res.quo);
						const rStr = this.formatPolynomial(res.rem);

						resBox.innerHTML = `
							<div class="clippy-activity-banner win">${txt.polyFormulaBanner}</div>
							<table class="clippy-xp-table" style="margin-top:6px;">
								<tr><th>${txt.tableComponent}</th><th>${txt.tableExpression}</th></tr>
								<tr><td><b>${txt.labelPolyDividend}</b></td><td><code>${pStr}</code></td></tr>
								<tr><td><b>${txt.labelPolyDivisor}</b></td><td><code>${dStr}</code></td></tr>
								<tr><td><b>${txt.labelPolyQuotient}</b></td><td><strong><code>${qStr}</code></strong></td></tr>
								<tr><td><b>${txt.labelPolyRemainder}</b></td><td><strong><code>${rStr}</code></strong></td></tr>
							</table>
						`;
					}
					window.ClippyUI.scrollLogToBottom();
				};
				contentBox.querySelector('#euclid-poly-calc').addEventListener('click', doCalcPoly);
				doCalcPoly();
			};

			intBtn.addEventListener('click', () => {
				intBtn.classList.add('active');
				polyBtn.classList.remove('active');
				renderIntegerDivision();
			});

			polyBtn.addEventListener('click', () => {
				polyBtn.classList.add('active');
				intBtn.classList.remove('active');
				renderPolyDivision();
			});

			renderIntegerDivision();
		}
	}

	class PolynomialFactorizationActivity {
		constructor() {
			this.card = null;
		}

		mount(initialExpr = 'x^2 - 5x + 6') {
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('polynomialFactorization')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.polynomialFactorization) || { title: 'Polynomial Factorization', badge: 'Roots & Factoring' });
			this.card = window.ClippyUI.createActivityCard(txt.title || 'Polynomial Factorization', txt.badge || 'Roots & Factoring');
			this.render(initialExpr);
		}

		parsePolynomialCoeffs(str) {
			if (!str || typeof str !== 'string') return [0, 0, 1];
			const cleaned = str.replace(/\s+/g, '').replace(/-/g, '+-');
			const terms = cleaned.split('+').filter(Boolean);
			const coeffMap = {};
			let maxDegree = 0;

			for (const term of terms) {
				let coeff = 1;
				let degree = 0;
				if (term.includes('x')) {
					const parts = term.split('x');
					let coeffPart = parts[0];
					if (coeffPart === '' || coeffPart === '+') coeff = 1;
					else if (coeffPart === '-') coeff = -1;
					else coeff = parseFloat(coeffPart) || 1;

					if (parts[1] && parts[1].startsWith('^')) {
						degree = parseInt(parts[1].substring(1), 10) || 1;
					} else {
						degree = 1;
					}
				} else {
					coeff = parseFloat(term) || 0;
					degree = 0;
				}
				coeffMap[degree] = (coeffMap[degree] || 0) + coeff;
				if (degree > maxDegree) maxDegree = degree;
			}

			const coeffs = [];
			for (let d = 0; d <= maxDegree; d++) {
				coeffs.push(coeffMap[d] || 0);
			}
			return coeffs;
		}

		factor(coeffs) {
			while (coeffs.length > 1 && coeffs[coeffs.length - 1] === 0) coeffs.pop();
			const degree = coeffs.length - 1;

			if (degree <= 0) {
				return { factored: `${coeffs[0] || 0}`, roots: [], delta: null, type: 'Constant' };
			}

			const txt = (window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.polynomialFactorization) || {};
			if (degree === 1) {
				const a0 = coeffs[0];
				const a1 = coeffs[1];
				const root = -a0 / a1;
				return {
					factored: `${a1 !== 1 ? a1 : ''}(x ${root >= 0 ? `- ${root}` : `+ ${Math.abs(root)}`})`,
					roots: [root],
					delta: null,
					type: txt.typeLinear || 'Degree 1 Polynomial (Linear)'
				};
			}

			if (degree === 2) {
				const c = coeffs[0];
				const b = coeffs[1];
				const a = coeffs[2];
				const delta = (b * b) - (4 * a * c);

				if (delta > 0) {
					const r1 = (-b + Math.sqrt(delta)) / (2 * a);
					const r2 = (-b - Math.sqrt(delta)) / (2 * a);
					const fmt = (r) => (r >= 0 ? `- ${Math.round(r * 1000) / 1000}` : `+ ${Math.abs(Math.round(r * 1000) / 1000)}`);
					const factored = `${a !== 1 ? `${a}` : ''}(x ${fmt(r1)})(x ${fmt(r2)})`;
					return { delta, roots: [r1, r2], factored, type: txt.typeTwoReal || 'Two real distinct roots' };
				} else if (delta === 0) {
					const r0 = -b / (2 * a);
					const fmt = r0 >= 0 ? `- ${Math.round(r0 * 1000) / 1000}` : `+ ${Math.abs(Math.round(r0 * 1000) / 1000)}`;
					const factored = `${a !== 1 ? `${a}` : ''}(x ${fmt})²`;
					return { delta, roots: [r0], factored, type: txt.typeDoubleReal || 'One double real root' };
				} else {
					const realPart = -b / (2 * a);
					const imagPart = Math.sqrt(-delta) / (2 * a);
					const complexFactored = window.ClippyKnowledge && window.ClippyKnowledge.formatString
						? window.ClippyKnowledge.formatString(txt.factoredComplex || "Irreducible over ℝ (Discriminant Δ = {delta} < 0)", { delta })
						: `Irreducible over ℝ (Discriminant Δ = ${delta} < 0)`;
					return {
						delta,
						roots: [`${realPart.toFixed(3)} + ${imagPart.toFixed(3)}i`, `${realPart.toFixed(3)} - ${imagPart.toFixed(3)}i`],
						factored: complexFactored,
						type: txt.typeComplex || 'Two complex conjugate roots'
					};
				}
			}

			return {
				factored: `Higher Degree (${degree}) Factorization via Numerical Roots`,
				roots: [],
				delta: null,
				type: `Degree ${degree} Polynomial`
			};
		}

		render(initialExpression = '') {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			let defaultA = 1, defaultB = -5, defaultC = 6;
			if (initialExpression && typeof initialExpression === 'string') {
				const parsed = this.parsePolynomialCoeffs(initialExpression);
				if (parsed.length >= 3) {
					defaultC = parsed[0];
					defaultB = parsed[1];
					defaultA = parsed[2];
				}
			}

			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('polynomialFactorization')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.polynomialFactorization) || {
					instructions: "Factor quadratic polynomial $ax^2 + bx + c$:", btnFactor: "Factor",
					tableParameter: "Parameter", tableValue: "Value", discriminantLabel: "Discriminant ($Δ$)",
					classificationLabel: "Root Classification", rootsLabel: "Roots ($x_k$)",
					factoredBanner: "Factored: {factored}", rootsNone: "None",
					errNumeric: "Please enter valid numeric coefficients for a, b, and c.",
					errZeroA: "Coefficient 'a' cannot be zero for a quadratic polynomial."
				});

			const container = document.createElement('div');
			container.innerHTML = `
				<div style="font-size:11px; margin-bottom:6px;">${txt.instructions}</div>
				<div class="clippy-guess-input-row" style="margin-bottom:6px;">
					<input type="number" class="clippy-guess-input" id="poly-fac-a" value="${defaultA}" placeholder="a">
					<span style="align-self:center;font-weight:bold;">x² +</span>
					<input type="number" class="clippy-guess-input" id="poly-fac-b" value="${defaultB}" placeholder="b">
					<span style="align-self:center;font-weight:bold;">x +</span>
					<input type="number" class="clippy-guess-input" id="poly-fac-c" value="${defaultC}" placeholder="c">
					<button type="button" class="clippy-action-btn" id="poly-fac-run">${txt.btnFactor}</button>
				</div>
				<div id="poly-fac-res"></div>
			`;

			const aIn = container.querySelector('#poly-fac-a');
			const bIn = container.querySelector('#poly-fac-b');
			const cIn = container.querySelector('#poly-fac-c');
			const resBox = container.querySelector('#poly-fac-res');

			const doFactor = () => {
				const a = parseFloat(aIn.value);
				const b = parseFloat(bIn.value);
				const c = parseFloat(cIn.value);
				if (isNaN(a) || isNaN(b) || isNaN(c)) {
					resBox.innerHTML = `<div class="clippy-activity-banner loss">${txt.errNumeric}</div>`;
					return;
				}
				if (a === 0) {
					resBox.innerHTML = `<div class="clippy-activity-banner loss">${txt.errZeroA}</div>`;
					return;
				}

				const res = this.factor([c, b, a]);
				if (res.error) {
					resBox.innerHTML = `<div class="clippy-activity-banner loss">${res.error}</div>`;
				} else {
					const rootsStr = Array.isArray(res.roots) && res.roots.length > 0 ? res.roots.join(', ') : (txt.rootsNone || 'None');
					const bannerText = window.ClippyKnowledge && window.ClippyKnowledge.formatString
						? window.ClippyKnowledge.formatString(txt.factoredBanner || "Factored: {factored}", { factored: res.factored })
						: `Factored: ${res.factored}`;
					resBox.innerHTML = `
						<div class="clippy-activity-banner win">${bannerText}</div>
						<table class="clippy-xp-table" style="margin-top:6px;">
							<tr><th>${txt.tableParameter}</th><th>${txt.tableValue}</th></tr>
							<tr><td><b>${txt.discriminantLabel}</b></td><td><strong>${res.delta !== null ? res.delta : 'N/A'}</strong></td></tr>
							<tr><td><b>${txt.classificationLabel}</b></td><td>${res.type}</td></tr>
							<tr><td><b>${txt.rootsLabel}</b></td><td><code>${rootsStr}</code></td></tr>
						</table>
					`;
				}
				window.ClippyUI.scrollLogToBottom();
			};

			container.querySelector('#poly-fac-run').addEventListener('click', doFactor);
			aIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') doFactor(); });
			bIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') doFactor(); });
			cIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') doFactor(); });

			body.appendChild(container);
			doFactor();
		}
	}

	class LinearSystemSolverActivity {
		constructor() {
			this.size = 3;
			this.card = null;
		}

		mount(size = 3) {
			this.size = size;
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('linearSolver', { size })
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.linearSolver) || { title: 'Linear System Solver', badge: '{size}x{size} Gaussian Solver' });
			const badgeText = window.ClippyKnowledge.formatString(txt.badge || '{size}x{size} Gaussian Solver', { size });
			this.card = window.ClippyUI.createActivityCard(txt.title || 'Linear System Solver', badgeText);
			this.render();
		}

		solve(matrix, vector) {
			const n = matrix.length;
			const A = matrix.map(row => [...row]);
			const b = [...vector];

			for (let i = 0; i < n; i++) {
				let maxRow = i;
				for (let k = i + 1; k < n; k++) {
					if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
				}
				[A[i], A[maxRow]] = [A[maxRow], A[i]];
				[b[i], b[maxRow]] = [b[maxRow], b[i]];

				if (Math.abs(A[i][i]) < 1e-9) {
					const txt = (window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.linearSolver) || {};
					return { error: txt.errSingular || 'Singular or dependent matrix. No unique solution.' };
				}

				for (let k = i + 1; k < n; k++) {
					const factor = A[k][i] / A[i][i];
					for (let j = i; j < n; j++) {
						A[k][j] -= factor * A[i][j];
					}
					b[k] -= factor * b[i];
				}
			}

			const x = Array(n).fill(0);
			for (let i = n - 1; i >= 0; i--) {
				let sum = b[i];
				for (let j = i + 1; j < n; j++) {
					sum -= A[i][j] * x[j];
				}
				x[i] = sum / A[i][i];
			}
			return { solution: x.map(val => Math.round(val * 10000) / 10000) };
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const varNames = ['x', 'y', 'z', 'w'];
			const container = document.createElement('div');
			container.className = 'clippy-linear-container';

			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('linearSolver', { size: this.size })
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.linearSolver) || {
					sizeBtn: "{size}x{size} System",
					btnSolve: "Solve Linear System (Gaussian Elimination)",
					winBanner: "Unique Solution Vector Found!",
					tableVariable: "Variable",
					tableValue: "Exact Value",
					errSingular: "Singular or dependent matrix. No unique solution."
				});

			const sizeBar = document.createElement('div');
			sizeBar.className = 'clippy-actions-bar';
			[2, 3].forEach(s => {
				const b = document.createElement('button');
				b.type = 'button';
				b.className = `clippy-action-btn ${this.size === s ? 'active' : ''}`;
				b.textContent = window.ClippyKnowledge.formatString(txt.sizeBtn, { size: s });
				b.addEventListener('click', () => {
					this.size = s;
					this.render();
				});
				sizeBar.appendChild(b);
			});
			container.appendChild(sizeBar);

			const grid = document.createElement('div');
			grid.className = 'clippy-matrix-grid';

			const defaultMatrix = this.size === 2
				? [[2, 1], [1, -1]]
				: [[2, 1, -1], [-3, -1, 2], [-2, 1, 2]];
			const defaultVector = this.size === 2 ? [8, 1] : [8, -11, -3];

			for (let r = 0; r < this.size; r++) {
				const rowEl = document.createElement('div');
				rowEl.className = 'clippy-matrix-row';
				for (let c = 0; c < this.size; c++) {
					const inp = document.createElement('input');
					inp.type = 'number';
					inp.className = 'clippy-matrix-input';
					inp.id = `lin-a-${r}-${c}`;
					inp.value = String(defaultMatrix[r][c]);
					rowEl.appendChild(inp);

					const vSpan = document.createElement('span');
					vSpan.textContent = `${varNames[c]} ${c < this.size - 1 ? '+' : '='}`;
					vSpan.style.fontSize = '11px';
					rowEl.appendChild(vSpan);
				}
				const bInp = document.createElement('input');
				bInp.type = 'number';
				bInp.className = 'clippy-matrix-input';
				bInp.id = `lin-b-${r}`;
				bInp.value = String(defaultVector[r]);
				rowEl.appendChild(bInp);
				grid.appendChild(rowEl);
			}
			container.appendChild(grid);

			const solveBtn = document.createElement('button');
			solveBtn.type = 'button';
			solveBtn.className = 'clippy-action-btn';
			solveBtn.style.marginTop = '6px';
			solveBtn.textContent = txt.btnSolve;
			container.appendChild(solveBtn);

			const resBox = document.createElement('div');
			resBox.id = 'lin-res-box';
			container.appendChild(resBox);

			const executeSolve = () => {
				const M = [];
				const V = [];
				for (let r = 0; r < this.size; r++) {
					const row = [];
					for (let c = 0; c < this.size; c++) {
						const val = parseFloat(container.querySelector(`#lin-a-${r}-${c}`).value);
						row.push(isNaN(val) ? 0 : val);
					}
					M.push(row);
					const bVal = parseFloat(container.querySelector(`#lin-b-${r}`).value);
					V.push(isNaN(bVal) ? 0 : bVal);
				}

				const res = this.solve(M, V);
				if (res.error) {
					resBox.innerHTML = `<div class="clippy-activity-banner loss">${res.error}</div>`;
				} else {
					const solRows = res.solution.map((val, idx) => `<tr><td><b>${varNames[idx]}</b></td><td><strong>${val}</strong></td></tr>`).join('');
					resBox.innerHTML = `
						<div class="clippy-activity-banner win">${txt.winBanner}</div>
						<table class="clippy-xp-table" style="margin-top:6px;">
							<tr><th>${txt.tableVariable}</th><th>${txt.tableValue}</th></tr>
							${solRows}
						</table>
					`;
				}
				window.ClippyUI.scrollLogToBottom();
			};

			solveBtn.addEventListener('click', executeSolve);
			body.appendChild(container);
			executeSolve();
		}
	}

	class ChoiceWheelActivity {
		constructor() {
			this.slices = ['Yes', 'No'];
			this.isSpinning = false;
			this.currentRotation = 0;
			this.selectedOutcome = null;
			this.card = null;
		}

		mount(initialSlices = null) {
			if (Array.isArray(initialSlices) && initialSlices.length >= 2) {
				this.slices = [...initialSlices];
			} else {
				this.slices = ['Yes', 'No'];
			}
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('wheel')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.wheel) || { title: 'Decision Wheel', badge: 'Random Choice' });
			this.card = window.ClippyUI.createActivityCard(txt.title || 'Decision Wheel', txt.badge || 'Random Choice');
			this.render();
		}

		drawWheel(canvas) {
			if (!canvas) return;
			const ctx = canvas.getContext('2d');
			const w = canvas.width;
			const h = canvas.height;
			const cx = w / 2;
			const cy = h / 2;
			const radius = Math.min(cx, cy) - 6;
			const numSlices = this.slices.length;
			const sliceAngle = (2 * Math.PI) / numSlices;

			ctx.clearRect(0, 0, w, h);
			const palette = ['#e53e3e', '#dd6b20', '#d69e2e', '#38a169', '#3182ce', '#805ad5', '#d53f8c', '#319795'];

			ctx.save();
			ctx.translate(cx, cy);
			ctx.rotate(this.currentRotation);

			for (let i = 0; i < numSlices; i++) {
				ctx.beginPath();
				ctx.moveTo(0, 0);
				ctx.arc(0, 0, radius, i * sliceAngle, (i + 1) * sliceAngle);
				ctx.closePath();
				ctx.fillStyle = palette[i % palette.length];
				ctx.fill();
				ctx.strokeStyle = '#ffffff';
				ctx.lineWidth = 2;
				ctx.stroke();

				ctx.save();
				ctx.rotate(i * sliceAngle + sliceAngle / 2);
				ctx.textAlign = 'right';
				ctx.fillStyle = '#ffffff';
				ctx.font = 'bold 11px Tahoma, sans-serif';
				ctx.shadowColor = 'rgba(0,0,0,0.6)';
				ctx.shadowBlur = 3;
				ctx.fillText(this.slices[i], radius - 10, 4);
				ctx.restore();
			}

			ctx.beginPath();
			ctx.arc(0, 0, 16, 0, 2 * Math.PI);
			ctx.fillStyle = '#ece9d8';
			ctx.fill();
			ctx.strokeStyle = '#0055ea';
			ctx.lineWidth = 3;
			ctx.stroke();

			ctx.restore();
		}

		spin(canvas) {
			if (this.isSpinning || this.slices.length < 2) return;
			this.isSpinning = true;
			this.selectedOutcome = null;

			const spinRounds = 4 + Math.random() * 4;
			const targetExtraAngle = Math.random() * 2 * Math.PI;
			const targetTotalAngle = this.currentRotation + (spinRounds * 2 * Math.PI) + targetExtraAngle;
			const startTime = performance.now();
			const duration = 3200;
			const startAngle = this.currentRotation;

			let lastTickSlice = -1;

			const animate = (now) => {
				const elapsed = now - startTime;
				const progress = Math.min(1, elapsed / duration);
				const easeOut = 1 - Math.pow(1 - progress, 3);
				this.currentRotation = startAngle + (targetTotalAngle - startAngle) * easeOut;

				this.drawWheel(canvas);

				const normAngle = ((this.currentRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
				const sliceAngle = (2 * Math.PI) / this.slices.length;
				const currentSliceIdx = Math.floor(((2 * Math.PI - normAngle + Math.PI / 2) % (2 * Math.PI)) / sliceAngle);

				if (currentSliceIdx !== lastTickSlice) {
					lastTickSlice = currentSliceIdx;
					if (window.ClippyAudio) window.ClippyAudio.play('wheel_tick');
				}

				if (progress < 1) {
					requestAnimationFrame(animate);
				} else {
					this.isSpinning = false;
					const finalNorm = ((this.currentRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
					const winningIdx = Math.floor(((2 * Math.PI - finalNorm + (3 * Math.PI / 2)) % (2 * Math.PI)) / sliceAngle) % this.slices.length;
					this.selectedOutcome = this.slices[winningIdx];
					if (window.ClippyAudio) window.ClippyAudio.play('win');
					this.render();
				}
			};
			requestAnimationFrame(animate);
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const container = document.createElement('div');
			container.className = 'clippy-wheel-container';

			const canvasBox = document.createElement('div');
			canvasBox.className = 'clippy-wheel-canvas-box';

			const pointer = document.createElement('div');
			pointer.className = 'clippy-wheel-pointer';
			canvasBox.appendChild(pointer);

			const canvas = document.createElement('canvas');
			canvas.width = 200;
			canvas.height = 200;
			canvas.className = 'clippy-wheel-canvas';
			canvasBox.appendChild(canvas);
			container.appendChild(canvasBox);

			this.drawWheel(canvas);

			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('wheel', { outcome: this.selectedOutcome, count: this.slices.length })
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.wheel) || {
					outcomeBanner: 'Outcome Selected: "{outcome}"', btnSpin: 'Spin Wheel!', btnSpinning: 'Spinning...',
					customSectorsLabel: 'Custom Sectors ({count}):', inputPlaceholder: 'New sector label...', btnAdd: '+ Add',
					presets: [
						{ label: 'Yes / No', slices: ['Yes', 'No'] },
						{ label: '1 - 6 Die', slices: ['1', '2', '3', '4', '5', '6'] },
						{ label: 'RPS', slices: ['Rock', 'Paper', 'Scissors'] },
						{ label: 'Work Focus', slices: ['Deep Work', 'Rest Break', 'Read Book', 'Code Review'] }
					]
				});

			if (this.selectedOutcome) {
				const banner = document.createElement('div');
				banner.className = 'clippy-activity-banner win';
				banner.textContent = window.ClippyKnowledge && window.ClippyKnowledge.formatString
					? window.ClippyKnowledge.formatString(txt.outcomeBanner || 'Outcome Selected: "{outcome}"', { outcome: this.selectedOutcome })
					: `Outcome Selected: "${this.selectedOutcome}"`;
				container.appendChild(banner);
			}

			const spinBtn = document.createElement('button');
			spinBtn.type = 'button';
			spinBtn.className = 'clippy-action-btn';
			spinBtn.textContent = this.isSpinning ? txt.btnSpinning : txt.btnSpin;
			spinBtn.disabled = this.isSpinning;
			spinBtn.addEventListener('click', () => this.spin(canvas));
			container.appendChild(spinBtn);

			const presetBar = document.createElement('div');
			presetBar.className = 'clippy-actions-bar';
			const presetList = txt.presets || [
				{ label: 'Yes / No', slices: ['Yes', 'No'] },
				{ label: '1 - 6 Die', slices: ['1', '2', '3', '4', '5', '6'] },
				{ label: 'RPS', slices: ['Rock', 'Paper', 'Scissors'] },
				{ label: 'Work Focus', slices: ['Deep Work', 'Rest Break', 'Read Book', 'Code Review'] }
			];
			presetList.forEach(p => {
				const b = document.createElement('button');
				b.type = 'button';
				b.className = 'clippy-action-btn';
				b.textContent = p.label;
				b.addEventListener('click', () => {
					this.slices = [...p.slices];
					this.render();
				});
				presetBar.appendChild(b);
			});
			container.appendChild(presetBar);

			const configBox = document.createElement('div');
			configBox.className = 'clippy-wheel-config';
			const sectorsHeader = window.ClippyKnowledge && window.ClippyKnowledge.formatString
				? window.ClippyKnowledge.formatString(txt.customSectorsLabel || 'Custom Sectors ({count}):', { count: this.slices.length })
				: `Custom Sectors (${this.slices.length}):`;
			configBox.innerHTML = `
				<div style="font-size:10px; font-weight:bold;">${sectorsHeader}</div>
				<div class="clippy-wheel-slices-list" id="wheel-slices-tags"></div>
				<div class="clippy-guess-input-row" style="margin-top:4px;">
					<input type="text" class="clippy-guess-input" id="wheel-new-slice" placeholder="${txt.inputPlaceholder}">
					<button type="button" class="clippy-action-btn" id="wheel-add-btn">${txt.btnAdd}</button>
				</div>
			`;

			const tagsContainer = configBox.querySelector('#wheel-slices-tags');
			this.slices.forEach((s, idx) => {
				const tag = document.createElement('div');
				tag.className = 'clippy-wheel-slice-tag';
				tag.innerHTML = `<span>${s}</span><button type="button">&times;</button>`;
				tag.querySelector('button').addEventListener('click', () => {
					if (this.slices.length > 2) {
						this.slices.splice(idx, 1);
						this.render();
					}
				});
				tagsContainer.appendChild(tag);
			});

			const addInput = configBox.querySelector('#wheel-new-slice');
			const addBtn = configBox.querySelector('#wheel-add-btn');
			const doAdd = () => {
				const val = addInput.value.trim();
				if (val && !this.slices.includes(val)) {
					this.slices.push(val);
					this.render();
				}
			};
			addBtn.addEventListener('click', doAdd);
			addInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doAdd(); });

			container.appendChild(configBox);
			body.appendChild(container);
			window.ClippyUI.scrollLogToBottom();
		}
	}

	class CipherToolActivity {
		constructor() {
			this.card = null;
		}

		mount() {
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('cipher')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.cipher) || { title: 'Ciphers & Cryptography', badge: 'Encoder / Decoder' });
			this.card = window.ClippyUI.createActivityCard(txt.title || 'Ciphers & Cryptography', txt.badge || 'Encoder / Decoder');
			this.render();
		}

		caesar(text, shift, decode = false) {
			const s = decode ? (26 - (shift % 26)) % 26 : (shift % 26);
			return text.replace(/[a-zA-Z]/g, c => {
				const base = c >= 'a' ? 97 : 65;
				return String.fromCharCode(((c.charCodeAt(0) - base + s) % 26) + base);
			});
		}

		vigenere(text, key, decode = false) {
			if (!key) return text;
			let ki = 0;
			const k = key.toLowerCase().replace(/[^a-z]/g, '');
			if (!k) return text;
			return text.replace(/[a-zA-Z]/g, c => {
				const base = c >= 'a' ? 97 : 65;
				const shift = k.charCodeAt(ki % k.length) - 97;
				ki++;
				const s = decode ? (26 - shift) % 26 : shift;
				return String.fromCharCode(((c.charCodeAt(0) - base + s) % 26) + base);
			});
		}

		morse(text, decode = false) {
			const map = (window.ClippyKnowledge && window.ClippyKnowledge.CIPHER_ALPHABETS && window.ClippyKnowledge.CIPHER_ALPHABETS.morse) || {};
			const revMap = {};
			for (const [k, v] of Object.entries(map)) revMap[v] = k;

			if (decode) {
				return text.trim().split(/\s+/).map(code => revMap[code] || '?').join('');
			}
			return text.toUpperCase().split('').map(c => map[c] || '').filter(Boolean).join(' ');
		}

		binary(text, decode = false) {
			if (decode) {
				return text.trim().split(/\s+/).map(b => String.fromCharCode(parseInt(b, 2))).join('');
			}
			return text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
		}

		modInverse(a, m = 26) {
			a = ((a % m) + m) % m;
			for (let x = 1; x < m; x++) {
				if ((a * x) % m === 1) return x;
			}
			return 1;
		}

		affine(text, aKey = 5, bKey = 8, decode = false) {
			const a = parseInt(aKey, 10) || 5;
			const b = parseInt(bKey, 10) || 8;
			const aInv = this.modInverse(a, 26);

			return text.replace(/[a-zA-Z]/g, c => {
				const isUpper = c >= 'A' && c <= 'Z';
				const base = isUpper ? 65 : 97;
				const x = c.charCodeAt(0) - base;
				if (!decode) {
					const enc = ((a * x) + b) % 26;
					return String.fromCharCode(((enc + 26) % 26) + base);
				} else {
					const dec = (aInv * (x - b)) % 26;
					return String.fromCharCode(((dec + 26) % 26) + base);
				}
			});
		}

		rot47(text) {
			return text.replace(/[\x21-\x7E]/g, c => {
				return String.fromCharCode(33 + ((c.charCodeAt(0) - 33 + 47) % 94));
			});
		}

		atbash(text) {
			return text.replace(/[a-zA-Z0-9]/g, c => {
				if (c >= 'a' && c <= 'z') return String.fromCharCode(25 - (c.charCodeAt(0) - 97) + 97);
				if (c >= 'A' && c <= 'Z') return String.fromCharCode(25 - (c.charCodeAt(0) - 65) + 65);
				if (c >= '0' && c <= '9') return String.fromCharCode(9 - (c.charCodeAt(0) - 48) + 48);
				return c;
			});
		}

		railFence(text, rails = 3, decode = false) {
			rails = Math.max(2, rails);
			if (text.length <= rails) return text;
			if (!decode) {
				const fence = Array.from({ length: rails }, () => []);
				let rail = 0;
				let change = 1;
				for (const c of text) {
					fence[rail].push(c);
					rail += change;
					if (rail === 0 || rail === rails - 1) change = -change;
				}
				return fence.flat().join('');
			}
			const fence = Array.from({ length: rails }, () => Array(text.length).fill(null));
			let rail = 0;
			let change = 1;
			for (let i = 0; i < text.length; i++) {
				fence[rail][i] = '*';
				rail += change;
				if (rail === 0 || rail === rails - 1) change = -change;
			}
			let idx = 0;
			for (let r = 0; r < rails; r++) {
				for (let c = 0; c < text.length; c++) {
					if (fence[r][c] === '*' && idx < text.length) {
						fence[r][c] = text[idx++];
					}
				}
			}
			let res = '';
			rail = 0;
			change = 1;
			for (let i = 0; i < text.length; i++) {
				res += fence[rail][i];
				rail += change;
				if (rail === 0 || rail === rails - 1) change = -change;
			}
			return res;
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('cipher')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.cipher) || {
					algorithmLabel: "Cipher Algorithm:",
					keyLabel: "Key / Parameter:",
					inputPlaceholder: "Enter text to encode or decode...",
					outputPlaceholder: "Output result will appear here...",
					btnEncode: "Encode →",
					btnDecode: "← Decode",
					btnAudio: "Play Morse Audio",
					defaultText: "HELLO WINDOWS XP"
				});

			const container = document.createElement('div');
			container.className = 'clippy-cipher-container';
			container.innerHTML = `
				<div class="clippy-guess-input-row">
					<label style="font-size:11px; align-self:center;">${txt.algorithmLabel}</label>
					<select class="xp-select" id="cipher-select" style="flex:1;">
						<option value="caesar">${txt.algCaesar || 'Caesar Shift Cipher'}</option>
						<option value="vigenere">${txt.algVigenere || 'Vigenère Polyalphabetic'}</option>
						<option value="morse">${txt.algMorse || 'Morse Code (ITU Standard)'}</option>
						<option value="binary">${txt.algBinary || 'Binary ASCII Stream'}</option>
						<option value="affine">${txt.algAffine || 'Affine Cipher (ax + b)'}</option>
						<option value="rot13">${txt.algRot13 || 'ROT13'}</option>
						<option value="rot47">${txt.algRot47 || 'ROT47 (Full ASCII)'}</option>
						<option value="atbash">${txt.algAtbash || 'Atbash Inverse Cipher'}</option>
						<option value="railfence">${txt.algRailFence || 'Rail Fence Transposition'}</option>
					</select>
				</div>
				<div class="clippy-guess-input-row" id="cipher-key-row">
					<label style="font-size:11px; align-self:center;">${txt.keyLabel}</label>
					<input type="text" class="clippy-guess-input" id="cipher-key-input" value="3" placeholder="${txt.keyPlaceholder || 'Shift or Keyword'}">
				</div>
				<textarea class="clippy-cipher-textarea" id="cipher-input" placeholder="${txt.inputPlaceholder}">${txt.defaultText}</textarea>
				<div style="display:flex; gap:6px; justify-content:flex-end;">
					<button type="button" class="clippy-action-btn" id="cipher-btn-encode">${txt.btnEncode}</button>
					<button type="button" class="clippy-action-btn" id="cipher-btn-decode">${txt.btnDecode}</button>
					<button type="button" class="clippy-action-btn" id="cipher-btn-audio" style="display:none;">${txt.btnAudio}</button>
				</div>
				<textarea class="clippy-cipher-textarea" id="cipher-output" readonly placeholder="${txt.outputPlaceholder}"></textarea>
			`;

			const sel = container.querySelector('#cipher-select');
			const keyInput = container.querySelector('#cipher-key-input');
			const keyRow = container.querySelector('#cipher-key-row');
			const txtIn = container.querySelector('#cipher-input');
			const txtOut = container.querySelector('#cipher-output');
			const encBtn = container.querySelector('#cipher-btn-encode');
			const decBtn = container.querySelector('#cipher-btn-decode');
			const audioBtn = container.querySelector('#cipher-btn-audio');

			sel.addEventListener('change', () => {
				const v = sel.value;
				keyRow.style.display = (v === 'caesar' || v === 'vigenere' || v === 'railfence') ? 'flex' : 'none';
				audioBtn.style.display = v === 'morse' ? 'inline-block' : 'none';
				if (v === 'caesar') keyInput.value = '3';
				if (v === 'vigenere') keyInput.value = 'SECRET';
				if (v === 'railfence') keyInput.value = '3';
			});

			const process = (isDecode) => {
				const alg = sel.value;
				const text = txtIn.value;
				const key = keyInput.value;
				let out = '';

				if (alg === 'caesar') out = this.caesar(text, parseInt(key, 10) || 3, isDecode);
				else if (alg === 'vigenere') out = this.vigenere(text, key || 'KEY', isDecode);
				else if (alg === 'affine') {
					const p = String(key || '5, 8').split(',').map(n => parseInt(n.trim(), 10));
					out = this.affine(text, p[0] || 5, p[1] || 8, isDecode);
				}
				else if (alg === 'morse') out = this.morse(text, isDecode);
				else if (alg === 'binary') out = this.binary(text, isDecode);
				else if (alg === 'rot13') out = this.caesar(text, 13, isDecode);
				else if (alg === 'rot47') out = this.rot47(text);
				else if (alg === 'atbash') out = this.atbash(text);
				else if (alg === 'railfence') out = this.railFence(text, parseInt(key, 10) || 3, isDecode);

				txtOut.value = out;
			};

			encBtn.addEventListener('click', () => process(false));
			decBtn.addEventListener('click', () => process(true));

			audioBtn.addEventListener('click', () => {
				const morseText = txtOut.value || this.morse(txtIn.value);
				if (!morseText || !window.ClippyAudio) return;
				let delay = 0;
				for (const symbol of morseText) {
					if (symbol === '.') {
						setTimeout(() => window.ClippyAudio.play('morse_dot'), delay);
						delay += 120;
					} else if (symbol === '-') {
						setTimeout(() => window.ClippyAudio.play('morse_dash'), delay);
						delay += 240;
					} else if (symbol === ' ') {
						delay += 180;
					}
				}
			});

			body.appendChild(container);
			process(false);
		}
	}

	class MouseTPSActivity {
		constructor() {
			this.clicks = 0;
			this.startTime = null;
			this.duration = 5;
			this.isActive = false;
			this.isFinished = false;
			this.peakTPS = 0;
			this.timerInterval = null;
			this.card = null;
		}

		mount(duration = 5) {
			this.clicks = 0;
			this.duration = duration;
			this.isActive = false;
			this.isFinished = false;
			this.peakTPS = 0;
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('tps', { duration })
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.tps) || { title: 'Mouse TPS Speed Test', badge: '{duration}s Click Speed Benchmark' });
			const badgeText = window.ClippyKnowledge.formatString(txt.badge || '{duration}s Click Speed Benchmark', { duration });
			this.card = window.ClippyUI.createActivityCard(txt.title || 'Mouse TPS Speed Test', badgeText);
			this.render();
		}

		registerClick() {
			if (this.isFinished) return;
			if (!this.isActive) {
				this.isActive = true;
				this.startTime = performance.now();
				this.timerInterval = setInterval(() => this.updateTimer(), 100);
			}
			this.clicks++;
			if (window.ClippyAudio) window.ClippyAudio.play('type');
			this.updateTimer();
		}

		updateTimer() {
			if (!this.isActive) return;
			const elapsed = (performance.now() - this.startTime) / 1000;
			const remaining = Math.max(0, this.duration - elapsed);
			const currentTPS = elapsed > 0 ? this.clicks / elapsed : 0;
			if (currentTPS > this.peakTPS) this.peakTPS = currentTPS;

			const tpsDigits = this.card ? this.card.bodyElement.querySelector('.clippy-tps-huge-number') : null;
			const statsEl = this.card ? this.card.bodyElement.querySelector('#tps-stats') : null;
			const txt = (window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.tps) || {
				statsTimeRemaining: "Time Remaining: <strong>{time}s</strong>",
				statsClicksRealtime: "Clicks: <strong>{clicks}</strong>"
			};

			if (tpsDigits) tpsDigits.textContent = currentTPS.toFixed(1);
			if (statsEl) {
				const timeText = window.ClippyKnowledge && window.ClippyKnowledge.formatString
					? window.ClippyKnowledge.formatString(txt.statsTimeRemaining || "Time Remaining: <strong>{time}s</strong>", { time: remaining.toFixed(1) })
					: `Time Remaining: <strong>${remaining.toFixed(1)}s</strong>`;
				const clicksText = window.ClippyKnowledge && window.ClippyKnowledge.formatString
					? window.ClippyKnowledge.formatString(txt.statsClicksRealtime || "Clicks: <strong>{clicks}</strong>", { clicks: this.clicks })
					: `Clicks: <strong>${this.clicks}</strong>`;
				statsEl.innerHTML = `<span>${timeText}</span> | <span>${clicksText}</span>`;
			}

			if (remaining <= 0) {
				clearInterval(this.timerInterval);
				this.isActive = false;
				this.isFinished = true;
				if (window.ClippyAudio) window.ClippyAudio.play('tada');
				this.render();
			}
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const finalTPSVal = this.duration > 0 ? (this.clicks / this.duration) : 0;
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('tps', { duration: this.duration, clicks: this.clicks, tps: finalTPSVal.toFixed(2), peak: this.peakTPS.toFixed(1) })
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.tps) || {
					clickPrompt: "Click Rapidly Here to Test Speed!",
					finalLabel: "Final Ticks Per Second",
					bannerComplete: "Test Complete! Average Rate: {tps} TPS (Peak: {peak})",
					statsDuration: "Duration: <strong>{duration}s</strong>",
					statsClicks: "Total Clicks: <strong>{clicks}</strong>",
					btnRestart: "Restart ({duration}s)"
				});

			const container = document.createElement('div');
			container.className = 'clippy-tps-container';

			const finalTPS = this.duration > 0 ? (this.clicks / this.duration) : 0;

			if (this.isFinished) {
				const banner = document.createElement('div');
				banner.className = 'clippy-activity-banner win';
				banner.textContent = window.ClippyKnowledge.formatString(txt.bannerComplete, {
					tps: finalTPS.toFixed(2),
					peak: this.peakTPS.toFixed(1)
				});
				container.appendChild(banner);
			}

			const clickArea = document.createElement('div');
			clickArea.className = 'clippy-tps-click-area';
			clickArea.innerHTML = `
				<div class="clippy-tps-huge-number">${this.isFinished ? finalTPS.toFixed(1) : '0.0'}</div>
				<div style="font-size:11px; color:#444; font-weight:bold;">${this.isFinished ? txt.finalLabel : txt.clickPrompt}</div>
			`;
			clickArea.addEventListener('mousedown', (e) => {
				if (e.button === 0) this.registerClick();
			});
			container.appendChild(clickArea);

			const statsBox = document.createElement('div');
			statsBox.id = 'tps-stats';
			statsBox.style.fontSize = '11px';
			statsBox.innerHTML = `<span>${window.ClippyKnowledge.formatString(txt.statsDuration, { duration: this.duration })}</span> | <span>${window.ClippyKnowledge.formatString(txt.statsClicks, { clicks: this.clicks })}</span>`;
			container.appendChild(statsBox);

			const actions = document.createElement('div');
			actions.className = 'clippy-actions-bar';
			[5, 10].forEach(d => {
				const b = document.createElement('button');
				b.type = 'button';
				b.className = 'clippy-action-btn';
				b.textContent = window.ClippyKnowledge.formatString(txt.btnRestart, { duration: d });
				b.addEventListener('click', () => this.mount(d));
				actions.appendChild(b);
			});
			container.appendChild(actions);

			body.appendChild(container);
			window.ClippyUI.scrollLogToBottom();
		}
	}

	class DateCalculatorActivity {
		constructor() {
			this.card = null;
		}

		mount() {
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('dateCalc')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.dateCalc) || { title: 'Date Interval Calculator', badge: 'Temporal Delta' });
			this.card = window.ClippyUI.createActivityCard(txt.title || 'Date Interval Calculator', txt.badge || 'Temporal Delta');
			this.render();
		}

		calculateDifference(d1Str, d2Str) {
			const txt = (window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.dateCalc) || {};
			const date1 = new Date(d1Str);
			const date2 = new Date(d2Str);
			if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
				return { error: txt.errFormat || 'Please enter valid date formats (YYYY-MM-DD).' };
			}
			const diffMs = Math.abs(date2 - date1);
			const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
			const weeks = Math.floor(diffDays / 7);
			const remDays = diffDays % 7;
			const hours = diffDays * 24;

			let workdays = 0;
			const cur = new Date(Math.min(date1, date2));
			const end = new Date(Math.max(date1, date2));
			while (cur < end) {
				const day = cur.getDay();
				if (day !== 0 && day !== 6) workdays++;
				cur.setDate(cur.getDate() + 1);
			}

			return { diffDays, weeks, remDays, hours, workdays, date1, date2 };
		}

		render() {
			if (!this.card) return;
			const body = this.card.bodyElement;
			body.innerHTML = '';

			const todayIso = new Date().toISOString().split('T')[0];
			const txt = (window.ClippyKnowledge && typeof window.ClippyKnowledge.getActivityConfig === 'function')
				? window.ClippyKnowledge.getActivityConfig('dateCalc')
				: ((window.ClippyKnowledge && window.ClippyKnowledge.ACTIVITIES_TEXTS && window.ClippyKnowledge.ACTIVITIES_TEXTS.dateCalc) || {
					labelStart: "Start Date:", labelEnd: "End Date:", btnToday: "Today", btnSubmit: "Calculate Delta",
					bannerTotal: "Total Difference: {days} days", tableUnit: "Interval Unit", tableMetric: "Metric",
					rowCalendarDays: "Exact Calendar Days", rowWeeksDays: "Weeks & Days", rowWorkdays: "Business / Workdays", rowHours: "Total Hours",
					valDays: "{days} days", valWeeksDays: "{weeks} weeks, {days} days", valWorkdays: "{days} business days", valHours: "{hours} hours",
					errFormat: "Please enter valid date formats (YYYY-MM-DD)."
				});

			const container = document.createElement('div');
			container.className = 'clippy-date-calc-container';
			container.innerHTML = `
				<div class="clippy-date-calc-row">
					<label style="width:70px;">${txt.labelStart}</label>
					<input type="date" class="clippy-guess-input" id="date-calc-start" value="2001-10-25">
				</div>
				<div class="clippy-date-calc-row">
					<label style="width:70px;">${txt.labelEnd}</label>
					<input type="date" class="clippy-guess-input" id="date-calc-end" value="${todayIso}">
					<button type="button" class="xp-button-small" id="date-calc-today-btn">${txt.btnToday}</button>
				</div>
				<div style="display:flex; justify-content:flex-end;">
					<button type="button" class="clippy-action-btn" id="date-calc-submit">${txt.btnSubmit}</button>
				</div>
				<div id="date-calc-res"></div>
			`;

			const d1In = container.querySelector('#date-calc-start');
			const d2In = container.querySelector('#date-calc-end');
			const resBox = container.querySelector('#date-calc-res');

			container.querySelector('#date-calc-today-btn').addEventListener('click', () => {
				d2In.value = new Date().toISOString().split('T')[0];
			});

			const doCalc = () => {
				const res = this.calculateDifference(d1In.value, d2In.value);
				if (res.error) {
					resBox.innerHTML = `<div class="clippy-activity-banner loss">${res.error}</div>`;
				} else {
					const bannerText = window.ClippyKnowledge && window.ClippyKnowledge.formatString
						? window.ClippyKnowledge.formatString(txt.bannerTotal || "Total Difference: {days} days", { days: res.diffDays.toLocaleString() })
						: `Total Difference: ${res.diffDays.toLocaleString()} days`;
					const daysValText = window.ClippyKnowledge && window.ClippyKnowledge.formatString
						? window.ClippyKnowledge.formatString(txt.valDays || "{days} days", { days: res.diffDays.toLocaleString() })
						: `${res.diffDays.toLocaleString()} days`;
					const weeksDaysValText = window.ClippyKnowledge && window.ClippyKnowledge.formatString
						? window.ClippyKnowledge.formatString(txt.valWeeksDays || "{weeks} weeks, {days} days", { weeks: res.weeks, days: res.remDays })
						: `${res.weeks} weeks, ${res.remDays} days`;
					const workdaysValText = window.ClippyKnowledge && window.ClippyKnowledge.formatString
						? window.ClippyKnowledge.formatString(txt.valWorkdays || "{days} business days", { days: res.workdays.toLocaleString() })
						: `${res.workdays.toLocaleString()} business days`;
					const hoursValText = window.ClippyKnowledge && window.ClippyKnowledge.formatString
						? window.ClippyKnowledge.formatString(txt.valHours || "{hours} hours", { hours: res.hours.toLocaleString() })
						: `${res.hours.toLocaleString()} hours`;

					resBox.innerHTML = `
						<div class="clippy-activity-banner win">${bannerText}</div>
						<table class="clippy-xp-table" style="margin-top:6px;">
							<tr><th>${txt.tableUnit}</th><th>${txt.tableMetric}</th></tr>
							<tr><td><b>${txt.rowCalendarDays}</b></td><td><strong>${daysValText}</strong></td></tr>
							<tr><td><b>${txt.rowWeeksDays}</b></td><td>${weeksDaysValText}</td></tr>
							<tr><td><b>${txt.rowWorkdays}</b></td><td>${workdaysValText}</td></tr>
							<tr><td><b>${txt.rowHours}</b></td><td>${hoursValText}</td></tr>
						</table>
					`;
				}
				window.ClippyUI.scrollLogToBottom();
			};

			container.querySelector('#date-calc-submit').addEventListener('click', doCalc);
			body.appendChild(container);
			doCalc();
		}
	}

	const ActivitiesManager = {
		activePomodoroTimer: null,

		pong: new WebGLPongActivity(),
		simon: new SimonSaysActivity(),
		tictactoe: new TicTacToeActivity(),
		memory: new MemoryMatchActivity(),
		hangman: new HangmanActivity(),
		quiz: new TechQuizActivity(),
		guess: new GuessNumberActivity(),
		rps: new RockPaperScissorsActivity(),
		mines: new MiniMinesweeperActivity(),
		defrag: new DefragActivity(),
		pomodoro: new PomodoroActivity(),
		todo: new TodoActivity(),
		pet: new PetActivity(),
		dimensionalAnalysis: new PhysicalDimensionalAnalysisActivity(),
		euclideanDivision: new EuclideanDivisionActivity(),
		polynomialFactorization: new PolynomialFactorizationActivity(),
		linearSolver: new LinearSystemSolverActivity(),
		wheel: new ChoiceWheelActivity(),
		cipher: new CipherToolActivity(),
		tps: new MouseTPSActivity(),
		dateCalc: new DateCalculatorActivity(),

		evaluateMathExpression(str) {
			let cleaned = str.toLowerCase()
				.replace(/^(evaluate|calc|calculate|compute)\s+/i, '')
				.replace(/\bplanck constant h\b/g, 'h')
				.replace(/\bspeed of light c\b/g, 'c')
				.trim();

			let exp = cleaned
				.replace(/\bhbar\b/g, '(1.054571817e-34)')
				.replace(/\bh\b/g, '(6.62607015e-34)')
				.replace(/\bc_light\b/g, '(299792458)')
				.replace(/\bc\b/g, '(299792458)')
				.replace(/\bg_accel\b/g, '(9.80665)')
				.replace(/\bkb\b/g, '(1.380649e-23)')
				.replace(/\bk_b\b/g, '(1.380649e-23)')
				.replace(/\bna\b/g, '(6.02214076e23)')
				.replace(/\beps0\b/g, '(8.8541878128e-12)')
				.replace(/\bmu0\b/g, '(1.25663706212e-6)')
				.replace(/\bme\b/g, '(9.1093837015e-31)')
				.replace(/\bmp\b/g, '(1.67262192369e-27)')
				.replace(/\bmn\b/g, '(1.67492749804e-27)')
				.replace(/\bqe\b/g, '(1.602176634e-19)')
				.replace(/\bq_e\b/g, '(1.602176634e-19)')
				.replace(/\bsigma_sb\b/g, '(5.670374419e-8)')
				.replace(/\br_gas\b/g, '(8.314462618)')
				.replace(/\bphi\b/g, '(1.618033988749895)')
				.replace(/\balpha_fs\b/g, '(0.0072973525693)')
				.replace(/\balpha_inv\b/g, '(137.035999084)')
				.replace(/\bg_0\b/g, '(7.748091729e-5)')
				.replace(/\br_k\b/g, '(25812.80745)')
				.replace(/\bk_j\b/g, '(483597.8484e9)')
				.replace(/\basinh\b/g, 'Math.asinh')
				.replace(/\bacosh\b/g, 'Math.acosh')
				.replace(/\batanh\b/g, 'Math.atanh')
				.replace(/\bsinh\b/g, 'Math.sinh')
				.replace(/\bcosh\b/g, 'Math.cosh')
				.replace(/\btanh\b/g, 'Math.tanh')
				.replace(/\basin\b/g, 'Math.asin')
				.replace(/\bacos\b/g, 'Math.acos')
				.replace(/\batan2\b/g, 'Math.atan2')
				.replace(/\batan\b/g, 'Math.atan')
				.replace(/\bsin\b/g, 'Math.sin')
				.replace(/\bcos\b/g, 'Math.cos')
				.replace(/\btan\b/g, 'Math.tan')
				.replace(/\bsqrt\b/g, 'Math.sqrt')
				.replace(/\bcbrt\b/g, 'Math.cbrt')
				.replace(/\bhypot\b/g, 'Math.hypot')
				.replace(/\babs\b/g, 'Math.abs')
				.replace(/\bfloor\b/g, 'Math.floor')
				.replace(/\bceil\b/g, 'Math.ceil')
				.replace(/\bround\b/g, 'Math.round')
				.replace(/\blog10\b/g, 'Math.log10')
				.replace(/\blog2\b/g, 'Math.log2')
				.replace(/\blog\b/g, 'Math.log10')
				.replace(/\bln\b/g, 'Math.log')
				.replace(/\bexp\b/g, 'Math.exp')
				.replace(/\berf\b/g, 'errorFunction')
				.replace(/\bgamma\b/g, 'gammaLanczos')
				.replace(/\bfact\b/g, 'factorialInt')
				.replace(/\bfactorial\b/g, 'factorialInt')
				.replace(/\bpi\b/g, 'Math.PI')
				.replace(/\be\b/g, 'Math.E')
				.replace(/\^/g, '**');

			const allowed = /^[0-9+\-*/(). %**\sMath\.sincotaqrbelgPIEfloundexp210asinhcoshynputGgLanczverFkbaM_]+$/;
			if (!allowed.test(exp)) return null;

			try {
				const evalFn = new Function('gammaLanczos', 'errorFunction', 'factorialInt', `'use strict'; return (${exp})`);
				const result = evalFn(gammaLanczos, errorFunction, factorialInt);
				if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
					if (Math.abs(result) < 1e-4 || Math.abs(result) >= 1e9) {
						return result.toExponential(8);
					}
					return Math.round(result * 100000000) / 100000000;
				}
			} catch (e) {}
			return null;
		},

		parseUnitConversion(text) {
			const match = text.match(/([\d\.eE\+\-]+)\s*(km|mi|miles|mile|meters|meter|m|ft|feet|foot|yd|yards|yard|cm|mm|nm|pm|fm|angstrom|inch|in|au|ly|parsec|pc|kg|lbs|pounds|pound|g|mg|ug|amu|u|slug|solar_mass|oz|ounces|ounce|ton|tons|c|f|k|celsius|fahrenheit|kelvin|rankine|r|tib|gib|mib|kib|tb|gb|mb|kb|bytes|byte|b|bits|bit|kmh|mph|knot|knots|ms|mps|c_light|liters|liter|l|ml|gallons|gallon|gal|floz|bar|mbar|psi|pa|kpa|mpa|atm|torr|mmhg|ev|kev|mev|gev|joules|joule|j|kj|cal|kcal|btu|kwh|erg|watt|w|kw|mw|gw|hp|tesla|t|gauss|g_field|deg|rad|arcmin|arcsec)\s*(?:to|in|en|vers)\s*(km|mi|miles|mile|meters|meter|m|ft|feet|foot|yd|yards|yard|cm|mm|nm|pm|fm|angstrom|inch|in|au|ly|parsec|pc|kg|lbs|pounds|pound|g|mg|ug|amu|u|slug|solar_mass|oz|ounces|ounce|ton|tons|c|f|k|celsius|fahrenheit|kelvin|rankine|r|tib|gib|mib|kib|tb|gb|mb|kb|bytes|byte|b|bits|bit|kmh|mph|knot|knots|ms|mps|c_light|liters|liter|l|ml|gallons|gallon|gal|floz|bar|mbar|psi|pa|kpa|mpa|atm|torr|mmhg|ev|kev|mev|gev|joules|joule|j|kj|cal|kcal|btu|kwh|erg|watt|w|kw|mw|gw|hp|tesla|t|gauss|g_field|deg|rad|arcmin|arcsec)/i);
			if (!match) return null;

			const val = parseFloat(match[1]);
			const from = match[2].toLowerCase();
			const to = match[3].toLowerCase();

			if (isNaN(val)) return null;

			if ((from === 'km') && (to === 'mi' || to === 'miles' || to === 'mile')) return `${val} km = ${(val * 0.621371192).toFixed(6)} miles`;
			if ((from === 'mi' || from === 'miles' || from === 'mile') && to === 'km') return `${val} miles = ${(val * 1.609344).toFixed(6)} km`;
			if ((from === 'm' || from === 'meters' || from === 'meter') && (to === 'ft' || to === 'feet' || to === 'foot')) return `${val} m = ${(val * 3.280839895).toFixed(6)} feet`;
			if ((from === 'ft' || from === 'feet' || from === 'foot') && (to === 'm' || to === 'meters' || to === 'meter')) return `${val} feet = ${(val * 0.3048).toFixed(6)} m`;
			if ((from === 'cm') && (to === 'inch' || to === 'in')) return `${val} cm = ${(val * 0.393700787).toFixed(6)} inches`;
			if ((from === 'inch' || from === 'in') && to === 'cm') return `${val} inches = ${(val * 2.54).toFixed(6)} cm`;
			if (from === 'm' && to === 'au') return `${val} m = ${(val / 1.495978707e11).toExponential(6)} au`;
			if (from === 'au' && to === 'm') return `${val} au = ${(val * 1.495978707e11).toExponential(6)} m`;
			if (from === 'ly' && to === 'm') return `${val} ly = ${(val * 9.4607304725808e15).toExponential(6)} m`;
			if (from === 'm' && to === 'ly') return `${val} m = ${(val / 9.4607304725808e15).toExponential(6)} ly`;

			if ((from === 'kg') && (to === 'lbs' || to === 'pounds' || to === 'pound')) return `${val} kg = ${(val * 2.20462262).toFixed(6)} lbs`;
			if ((from === 'lbs' || from === 'pounds' || from === 'pound') && to === 'kg') return `${val} lbs = ${(val * 0.45359237).toFixed(6)} kg`;
			if ((from === 'c' || from === 'celsius') && (to === 'f' || to === 'fahrenheit')) return `${val} °C = ${((val * 9/5) + 32).toFixed(4)} °F`;
			if ((from === 'f' || from === 'fahrenheit') && (to === 'c' || to === 'celsius')) return `${val} °F = ${(((val - 32) * 5)/9).toFixed(4)} °C`;
			if ((from === 'c' || from === 'celsius') && (to === 'k' || to === 'kelvin')) return `${val} °C = ${(val + 273.15).toFixed(4)} K`;
			if ((from === 'k' || from === 'kelvin') && (to === 'c' || to === 'celsius')) return `${val} K = ${(val - 273.15).toFixed(4)} °C`;

			if ((from === 'ev') && (to === 'joules' || to === 'joule' || to === 'j')) return `${val} eV = ${(val * 1.602176634e-19).toExponential(8)} J`;
			if ((from === 'joules' || from === 'joule' || from === 'j') && to === 'ev') return `${val} J = ${(val / 1.602176634e-19).toExponential(8)} eV`;
			if (from === 'bar' && to === 'psi') return `${val} bar = ${(val * 14.5037738).toFixed(4)} psi`;
			if (from === 'psi' && to === 'bar') return `${val} psi = ${(val * 0.06894757).toFixed(6)} bar`;
			if (from === 'atm' && to === 'pa') return `${val} atm = ${(val * 101325).toFixed(2)} Pa`;
			if (from === 'pa' && to === 'atm') return `${val} Pa = ${(val / 101325).toExponential(6)} atm`;

			if (from === 'tb' && to === 'gb') return `${val} TB = ${val * 1000} GB`;
			if (from === 'tib' && to === 'gib') return `${val} TiB = ${val * 1024} GiB`;
			if (from === 'gb' && to === 'mb') return `${val} GB = ${val * 1000} MB`;
			if (from === 'mb' && to === 'kb') return `${val} MB = ${val * 1000} KB`;
			if (from === 'kb' && (to === 'bytes' || to === 'b')) return `${val} KB = ${val * 1024} Bytes`;

			return null;
		},

		generatePassword(length = 14) {
			const len = Math.max(6, Math.min(64, parseInt(length, 10) || 14));
			const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*()_+-=';
			let res = '';
			for (let i = 0; i < len; i++) {
				res += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return res;
		},

		getStoredTodos() {
			try {
				const raw = window.DeskStorage ? window.DeskStorage.getItem(STORAGE_KEY_TODOS) : localStorage.getItem(STORAGE_KEY_TODOS);
				return raw ? JSON.parse(raw) : [];
			} catch (e) {
				return [];
			}
		},

		saveStoredTodos(todos) {
			try {
				const payload = JSON.stringify(todos);
				if (window.DeskStorage) window.DeskStorage.setItem(STORAGE_KEY_TODOS, payload);
				else localStorage.setItem(STORAGE_KEY_TODOS, payload);
			} catch (e) {}
		},

		getPetState() {
			try {
				const now = Date.now();
				const defaultPet = { hunger: 25, energy: 90, happiness: 85, luster: 80, level: 1, xp: 15, totalFeeds: 0, totalPolishes: 0, totalSleeps: 0, lastUpdate: now };
				const raw = window.DeskStorage ? window.DeskStorage.getItem(STORAGE_KEY_PET) : localStorage.getItem(STORAGE_KEY_PET);
				let pet = raw ? JSON.parse(raw) : defaultPet;

				if (pet.luster === undefined) pet.luster = 80;
				if (pet.totalFeeds === undefined) pet.totalFeeds = 0;
				if (pet.totalPolishes === undefined) pet.totalPolishes = 0;
				if (pet.totalSleeps === undefined) pet.totalSleeps = 0;

				const elapsedMinutes = Math.min(240, Math.floor((now - (pet.lastUpdate || now)) / 60000));
				if (elapsedMinutes > 0) {
					pet.hunger = Math.min(100, pet.hunger + Math.floor(elapsedMinutes * 0.15));
					pet.energy = Math.max(10, pet.energy - Math.floor(elapsedMinutes * 0.12));
					pet.happiness = Math.max(15, pet.happiness - Math.floor(elapsedMinutes * 0.15));
					pet.luster = Math.max(10, (pet.luster || 80) - Math.floor(elapsedMinutes * 0.10));
					pet.lastUpdate = now;
					this.savePetState(pet);
				}
				return pet;
			} catch (e) {
				return { hunger: 25, energy: 90, happiness: 85, luster: 80, level: 1, xp: 15, totalFeeds: 0, totalPolishes: 0, totalSleeps: 0, lastUpdate: Date.now() };
			}
		},

		savePetState(pet) {
			try {
				pet.lastUpdate = Date.now();
				while (pet.xp >= pet.level * 60) {
					pet.xp -= pet.level * 60;
					pet.level++;
				}
				const payload = JSON.stringify(pet);
				if (window.DeskStorage) window.DeskStorage.setItem(STORAGE_KEY_PET, payload);
				else localStorage.setItem(STORAGE_KEY_PET, payload);
			} catch (e) {}
		},

		getScratchpadNote() {
			try {
				return (window.DeskStorage ? window.DeskStorage.getItem(STORAGE_KEY_NOTES) : localStorage.getItem(STORAGE_KEY_NOTES)) || '';
			} catch (e) {
				return '';
			}
		},

		saveScratchpadNote(text) {
			try {
				if (window.DeskStorage) window.DeskStorage.setItem(STORAGE_KEY_NOTES, text);
				else localStorage.setItem(STORAGE_KEY_NOTES, text);
			} catch (e) {}
		}
	};

	window.ClippyActivities = ActivitiesManager;
})();
