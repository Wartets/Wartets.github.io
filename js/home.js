function setupSectionAnchors() {
	const targets = document.querySelectorAll('.section-header-row[id], section.home-section[id]');
	targets.forEach(element => {
		const title = element.querySelector('.section-title');
		if (title) {
			title.addEventListener('click', () => {
				const id = element.getAttribute('id');
				history.pushState(null, null, `#${id}`);
				element.scrollIntoView({ behavior: 'smooth', block: 'start' });
			});
		}
	});
}

document.addEventListener("DOMContentLoaded", () => {
	setupScrollRestoration();
	setupScrollProgressBar();
	setupSectionAnchors();

	const oldSecretTrigger = document.getElementById('secret-old-trigger');
	const deskSecretTrigger = document.getElementById('secret-desk-trigger');

	if (oldSecretTrigger) {
		oldSecretTrigger.addEventListener('click', (e) => {
			e.preventDefault();
			window.location.href = 'old/';
		});
	}

	if (deskSecretTrigger) {
		deskSecretTrigger.addEventListener('click', (e) => {
			e.preventDefault();
			window.location.href = 'desk/';
		});
	}

	let hasRendered = false;
	const safeRender = () => {
		if (hasRendered) return;
		hasRendered = true;
		renderDynamicSections();
		restoreScrollPosition();
		updateTitleWithMoonPhase();
		setTimeout(checkTextTruncation, 200);
	};

	let resizeDebounceTimer = null;
	window.addEventListener('resize', () => {
		checkTextTruncation();
		clearTimeout(resizeDebounceTimer);
		resizeDebounceTimer = setTimeout(() => {
			pdfDocCache.clear();
		}, 300);
	});

	document.addEventListener('i18nReady', () => {
		safeRender();
		updateTitleWithMoonPhase();
	});

	if (Object.keys(window.translations || {}).length > 0) {
		safeRender();
	}

	setupBackToTop();
	setupTooltips();
	setupSkillsGlow();
});

function setupSkillsGlow() {
	const container = document.querySelector('.skills-container');
	if (!container) return;
	container.addEventListener('mousemove', (e) => {
		const rect = container.getBoundingClientRect();
		container.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
		container.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
	});
}

function setupTooltips() {
	let tooltipEl = document.querySelector('.global-skill-tooltip');
	if (!tooltipEl) {
		tooltipEl = document.createElement('div');
		tooltipEl.className = 'tooltip global-skill-tooltip';
		document.body.appendChild(tooltipEl);
	}

	document.addEventListener('mouseover', (e) => {
		const target = e.target.closest('.skill-tooltip');
		if (target) {
			const text = target.getAttribute('data-skill-tips');
			if (!text) return;
			
			tooltipEl.innerHTML = text;
			tooltipEl.classList.add('visible');

			const rect = target.getBoundingClientRect();
			
			let top = rect.top - tooltipEl.offsetHeight - 10;
			let left = rect.left + (rect.width / 2) - (tooltipEl.offsetWidth / 2);

			if (top < 10) {
				top = rect.bottom + 10;
			}
			
			if (left < 10) {
				left = 10;
			} else if (left + tooltipEl.offsetWidth > window.innerWidth - 10) {
				left = window.innerWidth - tooltipEl.offsetWidth - 10;
			}

			tooltipEl.style.top = `${top}px`;
			tooltipEl.style.left = `${left}px`;
		}
	});

	document.addEventListener('mouseout', (e) => {
		const target = e.target.closest('.skill-tooltip');
		if (target) {
			tooltipEl.classList.remove('visible');
		}
	});
}

function setupScrollProgressBar() {
	const progressBar = document.getElementById('scroll-progress-bar');
	if (!progressBar) return;

	const updateProgress = () => {
		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
		const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
		const clamped = Math.min(100, Math.max(0, scrollPercent));
		
		progressBar.style.width = `${clamped}%`;
		progressBar.setAttribute('aria-valuenow', Math.round(clamped).toString());
	};

	window.addEventListener('scroll', updateProgress, { passive: true });
	window.addEventListener('resize', updateProgress, { passive: true });
	updateProgress();
}

function setupScrollRestoration() {
	if ('scrollRestoration' in history) {
		history.scrollRestoration = 'manual';
	}

	window.addEventListener('scroll', () => {
		sessionStorage.setItem('home_scroll_position', window.scrollY.toString());
	}, { passive: true });
}

function restoreScrollPosition() {
	if (window.location.hash) {
		const target = document.querySelector(window.location.hash);
		if (target) {
			setTimeout(() => {
				target.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}, 500);
			return;
		}
	}
	const savedPosition = sessionStorage.getItem('home_scroll_position');
	if (savedPosition !== null) {
		setTimeout(() => {
			window.scrollTo(0, parseInt(savedPosition, 10));
		}, 300);
	}
}

const FEATURED_PROJECT_TITLES = [
	"Lenia GPU Simulator",
	"N-Body-Simulation",
	"TikZ Generator",
	"Space Trip Game 3D"
];

const FEATURED_DOC_SLUGS = [
	"rapport-stage-MPQ-QITE-2026",
	"construction-progressive-modele-standard",
	"rapport-physique-experimentale-etude-lasso",
	"probabilites-galettes-des-rois"
];

const FEATURED_MUSIC_TRACKS = [
	{
		id: "1",
		title: "Projet 27",
		genre: "Electronic/Pop",
		date: "2026",
		album: "Album 7.1",
		filePath: "https://media.githubusercontent.com/media/Wartets/music/refs/heads/main/assets/Album 7 (2026)/Album 7.1/Projet 27/Projet 27.2.opus",
	},
	{
		id: "2",
		title: "Projet 12",
		genre: "Techno",
		date: "2025",
		album: "Album 6.1",
		filePath: "https://media.githubusercontent.com/media/Wartets/music/refs/heads/main/assets/Album 6 (2025)/Album 6.1/Projet 12/Projet-12.mp3",
	},
	{
		id: "3",
		title: "Projet 8",
		genre: "Electronic/Funk Pop",
		date: "2024",
		album: "Album 6.1",
		filePath: "assets/musics/Projet_8.4.mp3",
	},
	{
		id: "4",
		title: "Dance",
		genre: "Ambiant/Folklore",
		date: "2024",
		album: "Album 5.1",
		filePath: "https://media.githubusercontent.com/media/Wartets/music/refs/heads/main/assets/Album 5 (2023-2024)/Album 5.1/dance/dance - 24_02_2024 22.35.wav",
	},
	{
		id: "5",
		title: "Projet 2",
		genre: "Electronic",
		date: "2023",
		album: "Album 5.1",
		filePath: "https://media.githubusercontent.com/media/Wartets/music/refs/heads/main/assets/Album 5 (2023-2024)/Album 5.1/Projet 2/Projet 2 - 24_10_2023 19.26.wav",
	},
	{
		id: "6",
		title: "End of Chapter One",
		genre: "Ambient",
		date: "2023",
		album: "Album 4.2",
		filePath: "https://media.githubusercontent.com/media/Wartets/music/refs/heads/main/assets/Album 4 (2021-2022-2023)/Album 4.2/End of Chapter one/End of Chapter one 1.0.wav",
	},
	{
		id: "7",
		title: "Cell",
		genre: "Ambient/Rock",
		date: "2022",
		album: "Album 4.2",
		filePath: "https://media.githubusercontent.com/media/Wartets/music/refs/heads/main/assets/Album 4 (2021-2022-2023)/Album 4.2/Cell/Cell 1.2.m4a",
	},
	{
		id: "8",
		title: "Hypocritical World's Nostalgia",
		genre: "Synthwave",
		date: "2021",
		album: "Album 4.1",
		filePath: "https://media.githubusercontent.com/media/Wartets/music/refs/heads/main/assets/Album 4 (2021-2022-2023)/Album 4.1/Hypocritical world's Nostalgia/Hypocritical world's Nostalgia.m4a",
	},
];

let activeAudioElement = null;
let activePlayButton = null;
let sharedAudioCtx = null;
let sharedAnalyser = null;
const audioSourceMap = new WeakMap();
let visualizerFrameId = null;

function setupAudioContext() {
	if (!sharedAudioCtx) {
		const AudioContextClass = window.AudioContext || window.webkitAudioContext;
		if (AudioContextClass) {
			sharedAudioCtx = new AudioContextClass();
			sharedAnalyser = sharedAudioCtx.createAnalyser();
			sharedAnalyser.fftSize = 32;
			sharedAnalyser.smoothingTimeConstant = 0.75;
		}
	}
	if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
		sharedAudioCtx.resume();
	}
}

function runEqualizerAnimation(card, audio) {
	if (visualizerFrameId) {
		cancelAnimationFrame(visualizerFrameId);
		visualizerFrameId = null;
	}

	setupAudioContext();

	if (sharedAudioCtx && sharedAnalyser) {
		sharedAnalyser.fftSize = 128;
		sharedAnalyser.smoothingTimeConstant = 0.75;

		if (!audioSourceMap.has(audio)) {
			try {
				const source = sharedAudioCtx.createMediaElementSource(audio);
				source.connect(sharedAnalyser);
				sharedAnalyser.connect(sharedAudioCtx.destination);
				audioSourceMap.set(audio, source);
			} catch (e) {
				card.classList.remove('has-audio-analyser');
			}
		}

		if (audioSourceMap.has(audio)) {
			card.classList.add('has-audio-analyser');
			const bars = card.querySelectorAll('.music-equalizer span');
			const freqData = new Uint8Array(sharedAnalyser.frequencyBinCount);
			const binIndices = [1, 3, 7, 13, 22, 34];
			const weightFactors = [0.35, 0.55, 0.90, 1.45, 2.20, 3.40];

			function updateFrame() {
				if (!card.classList.contains('is-playing')) return;
				sharedAnalyser.getByteFrequencyData(freqData);

				bars.forEach((bar, idx) => {
					const binIdx = binIndices[idx] || (idx * 5 + 1);
					const weight = weightFactors[idx] || 1.0;
					const rawVal = freqData[binIdx] || 0;
					const normalized = Math.pow(rawVal / 255, 0.75);
					const amplitude = normalized * weight;
					const scale = Math.min(1.0, Math.max(0.12, amplitude));
					bar.style.transform = `scaleY(${scale.toFixed(2)})`;
				});

				visualizerFrameId = requestAnimationFrame(updateFrame);
			}

			updateFrame();
			return;
		}
	}

	card.classList.remove('has-audio-analyser');
}

function stopEqualizerAnimation(card) {
	if (visualizerFrameId) {
		cancelAnimationFrame(visualizerFrameId);
		visualizerFrameId = null;
	}
	if (card) {
		const bars = card.querySelectorAll('.music-equalizer span');
		bars.forEach(bar => {
			bar.style.transform = '';
		});
	}
}

function sanitizeUrl(url, baseFolder) {
	if (!url) return '';
	if (url.startsWith('http') || url.startsWith('/')) return url;
	return `${baseFolder}/${url}`;
}

function renderDynamicSections() {
	renderProjectsSection();
	renderLibrarySection();
	renderMusicSection();

	const announcer = document.getElementById('aria-status-announcer');
	if (announcer) {
		announcer.textContent = window.t('ui.loading_complete') || 'Data loading complete.';
	}
}

document.addEventListener('i18nReady', () => {
	if (typeof projects !== 'undefined') renderProjectsSection();
	if (window.libraryData && window.libraryData.documents) renderLibrarySection();
	updateMusicGenreTranslations();
});

function updateMusicGenreTranslations() {
	const cards = document.querySelectorAll('#featured-music-grid .music-card');
	cards.forEach((card, index) => {
		const track = FEATURED_MUSIC_TRACKS[index];
		if (!track) return;
		const genreEl = card.querySelector('.music-genre');
		if (genreEl) genreEl.textContent = window.tGenre(track.genre);
	});
}

function renderProjectsSection() {
	if (typeof projects === 'undefined') return;

	const allProjects = projects.flat().filter(p => p.show !== false);
	const projectTitleEn = (p) => {
		if (p.title && typeof p.title === 'object') return p.title.en || Object.values(p.title)[0] || '';
		return p.title || '';
	};

	const featuredProjects = [];
	FEATURED_PROJECT_TITLES.forEach(title => {
		const search = String(title).toLowerCase();

		const found = allProjects.find(p =>
			projectTitleEn(p).toLowerCase().includes(search)
		);

		if (found && !featuredProjects.includes(found)) {
			featuredProjects.push(found);
		}
	});

	if (featuredProjects.length < 4) {
		const remaining = allProjects.filter(p => !featuredProjects.some(fp => fp.title === p.title));
		featuredProjects.push(...remaining.slice(0, 4 - featuredProjects.length));
	}

	const featuredTitles = new Set(featuredProjects.map(p => p.title));

	const recentProjects = allProjects
		.filter(p => !featuredTitles.has(p.title))
		.sort((a, b) => {
			const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
			const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
			return timeB - timeA;
		})
		.slice(0, 4);

	buildProjectGrid('featured-projects-grid', featuredProjects);
	buildProjectGrid('recent-projects-grid', recentProjects);
}

function buildProjectGrid(containerId, projectList) {
	const container = document.getElementById(containerId);
	if (!container) return;

	container.innerHTML = '';

	projectList.forEach(project => {
		const card = document.createElement('div');
		card.className = 'card home-project-card';
		card.setAttribute('tabindex', '0');

		card.addEventListener('mousemove', (e) => {
			const rect = card.getBoundingClientRect();
			card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
			card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
		});

		const imagePath = sanitizeUrl(project.image, 'projects');
		const projectTitle = window.tData(project.title);
		const projectDescription = window.tData(project.description);
		const imgHtml = imagePath ? `<img src="${imagePath}" alt="${projectTitle}" class="card-img media-blur-up" loading="lazy" onload="this.classList.add('loaded')" onerror="this.style.display='none'">` : '';

		const date = new Date(project.timestamp);
		const dateStr = `${date.toLocaleString(document.documentElement.lang || 'en', { month: 'short' })} ${date.getFullYear()}`;

		let linksHtml = '';
		if (project.link) linksHtml += `<a href="${project.link}" target="_blank" rel="noopener noreferrer" class="btn"><i class="fa-solid fa-external-link"></i> ${window.t('projects.open')}</a>`;
		if (project.github) linksHtml += `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn"><i class="fa-brands fa-github"></i> ${window.t('projects.code')}</a>`;

		card.innerHTML = `
			${imgHtml}
			<div class="card-header">
				<h3 class="card-title">${projectTitle}</h3>
				<span class="date">${dateStr}</span>
			</div>
			<div class="expanded-content" style="display:flex;">
				<p class="description card-desc-clamp">${projectDescription}</p>
			</div>
			<div class="links card-links-flex">
				${linksHtml}
			</div>
		`;

		card.dataset.projectRef = project.title.en || project.title;

		card.addEventListener('click', (e) => {
			if (e.target.closest('a') || e.target.closest('.btn')) return;
			if (project.link) {
				window.open(project.link, '_blank');
			} else if (project.github) {
				window.open(project.github, '_blank');
			}
		});

		card.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				if (e.target.closest('a') || e.target.closest('.btn')) return;
				e.preventDefault();
				card.click();
			}
		});

		container.appendChild(card);
	});
}

function renderLibrarySection() {
	if (!window.libraryData || !window.libraryData.documents) return;

	const allDocs = window.libraryData.documents.filter(d => d.show !== false);

	const featuredDocs = [];
	FEATURED_DOC_SLUGS.forEach(slug => {
		const found = allDocs.find(d => d.slug === slug || (d.slug && d.slug.includes(slug)));
		if (found && !featuredDocs.some(fd => fd.id === found.id)) {
			featuredDocs.push(found);
		}
	});

	if (featuredDocs.length < 4) {
		const remaining = allDocs.filter(d => !featuredDocs.some(fd => fd.id === d.id));
		featuredDocs.push(...remaining.slice(0, 4 - featuredDocs.length));
	}

	const featuredDocIds = new Set(featuredDocs.map(d => d.id));

	const recentDocs = allDocs
		.filter(d => !featuredDocIds.has(d.id))
		.sort((a, b) => {
			const tsA = Array.isArray(a.timestamp) ? a.timestamp[0] : a.timestamp;
			const tsB = Array.isArray(b.timestamp) ? b.timestamp[0] : b.timestamp;
			const timeA = tsA ? new Date(tsA).getTime() : 0;
			const timeB = tsB ? new Date(tsB).getTime() : 0;
			return timeB - timeA;
		})
		.slice(0, 4);

	if (window.pdfjsLib) {
		pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
	}

	buildDocumentGrid('featured-library-grid', featuredDocs);
	buildDocumentGrid('recent-library-grid', recentDocs);
}

function buildDocumentGrid(containerId, docList) {
	const container = document.getElementById(containerId);
	if (!container) return;

	container.innerHTML = '';

	const cardObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const canvas = entry.target.querySelector('canvas');
				const filePath = entry.target.dataset.filePath;
				if (canvas && filePath) renderPdfPreview(canvas, filePath);
				observer.unobserve(entry.target);
			}
		});
	}, { rootMargin: '0px 0px 200px 0px' });

	docList.forEach(doc => {
		const card = document.createElement('div');
		card.className = 'doc-card';

		const filePath = sanitizeUrl(doc.filePath, 'assets/documents');
		card.dataset.filePath = filePath;

		card.addEventListener('mousemove', (e) => {
			const rect = card.getBoundingClientRect();
			card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
			card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
		});

		card.addEventListener('click', (e) => {
			const url = `library/?#doc=${encodeURIComponent(doc.slug)}`;
			if (e.ctrlKey || e.metaKey) {
				window.open(url, '_blank');
			} else {
				window.location.href = url;
			}
		});

		const ts = Array.isArray(doc.timestamp) ? doc.timestamp[0] : doc.timestamp;
		const date = new Date(ts);
		const dateStr = `${date.toLocaleString(document.documentElement.lang || 'en', { month: 'short' })} ${date.getFullYear()}`;

		let displayAuthors = window.t('ui.unknown_author');
		let fullAuthorNames = displayAuthors;

		if (doc.authorIds && window.libraryData.authors) {
			const docAuthors = doc.authorIds.map(id => window.libraryData.authors.find(a => a.id === id)).filter(Boolean);
			if (docAuthors.length > 0) {
				const fullNames = docAuthors.map(a => `${a.forname} ${a.surname}`).join(', ');
				fullAuthorNames = fullNames;

				if (fullNames.length <= 35) {
					displayAuthors = fullNames;
				} else {
					const abbrNames = docAuthors.map(a => `${a.forname.charAt(0)}. ${a.surname}`).join(', ');
					if (abbrNames.length <= 35) {
						displayAuthors = abbrNames;
					} else {
						const surnames = docAuthors.map(a => a.surname).join(', ');
						if (surnames.length <= 35) {
							displayAuthors = surnames;
						} else {
							displayAuthors = docAuthors.map(a => {
								const fInitial = a.forname.charAt(0);
								const sParts = a.surname.split(' ');
								const sInitials = sParts.map(s => s.charAt(0)).join('');
								return `${fInitial}.${sInitials}.`;
							}).join(', ').toUpperCase();
						}
					}
				}
			}
		}

		card.innerHTML = `
			<div class="doc-preview-wrapper">
				<i class="fa-solid fa-circle-notch fa-spin doc-preview-loader" aria-hidden="true"></i>
				<canvas class="doc-canvas media-blur-up"></canvas>
			</div>
			<div class="doc-card-content">
				<h3 class="doc-card-title">${window.tData(doc.title)}</h3>
				<p class="doc-card-description">${window.tData(doc.description)}</p>
				<div class="doc-card-meta">
					<span class="doc-author" title="${fullAuthorNames}">${displayAuthors}</span>
					<span class="doc-date">${dateStr}</span>
				</div>
			</div>
		`;

		container.appendChild(card);
		cardObserver.observe(card);
	});
}

const pdfDocCache = new Map();

async function renderPdfPreview(canvas, filePath) {
	if (!window.pdfjsLib) return;
	const cacheKey = `pdf_preview_${filePath}`;

	try {
		const cachedDataUrl = sessionStorage.getItem(cacheKey);
		if (cachedDataUrl) {
			const img = new Image();
			img.onload = () => {
				const ctx = canvas.getContext('2d', { alpha: false });
				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0);
				canvas.classList.add('loaded');
				const loader = canvas.parentElement ? canvas.parentElement.querySelector('.doc-preview-loader') : null;
				if (loader) loader.style.display = 'none';
			};
			img.src = cachedDataUrl;
			return;
		}

		let pdf = pdfDocCache.get(filePath);
		if (!pdf) {
			const loadingTask = window.pdfjsLib.getDocument({
				url: filePath,
				disableAutoFetch: true,
				disableStream: true
			});
			pdf = await loadingTask.promise;
			pdfDocCache.set(filePath, pdf);
		}

		const page = await pdf.getPage(1);
		const scale = window.devicePixelRatio || 1.5;
		const viewport = page.getViewport({ scale: Math.max(1.5, scale) });

		const tempCanvas = document.createElement('canvas');
		tempCanvas.width = viewport.width;
		tempCanvas.height = viewport.height;
		const tempContext = tempCanvas.getContext('2d', { alpha: false });

		await page.render({ canvasContext: tempContext, viewport: viewport }).promise;

		const halfHeight = Math.floor(viewport.height / 2);
		canvas.width = viewport.width;
		canvas.height = halfHeight;

		const context = canvas.getContext('2d', { alpha: false });
		context.drawImage(tempCanvas, 0, 0, viewport.width, halfHeight, 0, 0, viewport.width, halfHeight);
		
		try {
			sessionStorage.setItem(cacheKey, canvas.toDataURL('image/jpeg', 0.9));
		} catch (e) {}

		canvas.classList.add('loaded');
		const loader = canvas.parentElement ? canvas.parentElement.querySelector('.doc-preview-loader') : null;
		if (loader) loader.style.display = 'none';

	} catch (error) {
		const loader = canvas.parentElement ? canvas.parentElement.querySelector('.doc-preview-loader') : null;
		if (loader) {
			loader.classList.remove('fa-spin', 'fa-circle-notch');
			loader.classList.add('fa-file-pdf');
		}
	}
}

function resolveMusicUrl(url) {
	if (!url) return '';
	let targetUrl = url;

	const isLocal = window.location.hostname === 'localhost' || 
					window.location.hostname === '127.0.0.1' || 
					window.location.protocol === 'file:';

	if (isLocal) {
		if (targetUrl.startsWith('https://wartets.github.io/music/')) {
			targetUrl = targetUrl.replace('https://wartets.github.io/music/', 'music/');
		}

		if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
			return targetUrl;
		}
		
		if (targetUrl.startsWith('music/')) {
			if (window.location.pathname.includes('/Wartets.github.io/')) {
				targetUrl = '../' + targetUrl;
			} else {
				targetUrl = 'https://wartets.github.io/' + targetUrl;
			}
		}
	} else {
		if (targetUrl.startsWith('music/')) {
			targetUrl = '/' + targetUrl;
		}
	}

	try {
		return encodeURI(decodeURI(targetUrl))
			.replace(/\(/g, '%28')
			.replace(/\)/g, '%29');
	} catch (e) {
		return targetUrl;
	}
}

function renderMusicSection() {
	const container = document.getElementById('featured-music-grid');
	if (!container) return;

	container.innerHTML = '';

	FEATURED_MUSIC_TRACKS.forEach(track => {
		const card = document.createElement('div');
		card.className = 'music-card';

		const audio = new Audio();
		audio.crossOrigin = 'anonymous';
		const resolvedUrl = resolveMusicUrl(track.filePath);
		audio.src = resolvedUrl;
		audio.preload = 'none';

		audio.addEventListener('error', () => {
			const err = audio.error;
			let details = "Unknown error";
			if (err) {
				if (err.code === 1) details = "Aborted";
				else if (err.code === 2) details = "Network error";
				else if (err.code === 3) details = "Decode error";
				else if (err.code === 4) details = "Source not supported (404, invalid MIME type, or codec unsupported)";
			}
			console.warn(`[Audio Engine] Failed to load track "${track.title}" from source: ${resolvedUrl}. Reason: ${details}`);
		});

		card.addEventListener('mousemove', (e) => {
			const rect = card.getBoundingClientRect();
			card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
			card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
		});

		card.innerHTML = `
			<div class="music-card-header">
				<div class="music-info">
					<div class="music-meta-tags">
						<span class="music-album">${track.album}</span>
						<span class="music-tag-divider">•</span>
						<span class="music-genre">${window.tGenre(track.genre)}</span>
					</div>
					<h3 class="music-title">${track.title}</h3>
				</div>
				<div class="music-header-right">
					<span class="music-date">${track.date}</span>
					<div class="music-equalizer" aria-hidden="true">
						<span></span><span></span><span></span><span></span><span></span><span></span>
					</div>
				</div>
			</div>
			<div class="music-player-controls">
				<button class="music-play-btn" type="button" aria-label="${window.t('music_section.play')}: ${track.title}" aria-pressed="false">
					<i class="fa-solid fa-play" aria-hidden="true"></i>
				</button>
				<div class="music-progress-container">
					<input type="range" class="music-progress" value="0" min="0" max="100" step="0.01" aria-label="${track.title} - Avancement">
					<div class="music-time-display">
						<span class="current-time">0:00</span> / <span class="total-time">0:01</span>
					</div>
				</div>
			</div>
		`;

		const playBtn = card.querySelector('.music-play-btn');
		const progressBar = card.querySelector('.music-progress');
		const currentTimeEl = card.querySelector('.current-time');
		const totalTimeEl = card.querySelector('.total-time');

		function formatTime(seconds) {
			if (isNaN(seconds)) return "0:00";
			const mins = Math.floor(seconds / 60);
			const secs = Math.floor(seconds % 60);
			return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
		}

		audio.addEventListener('loadedmetadata', () => {
			totalTimeEl.textContent = formatTime(audio.duration);
		});

		audio.addEventListener('timeupdate', () => {
			if (audio.duration) {
				const pct = (audio.currentTime / audio.duration) * 100;
				progressBar.value = pct;
				progressBar.style.setProperty('--progress', pct + '%');
				currentTimeEl.textContent = formatTime(audio.currentTime);
			}
		});

		audio.addEventListener('ended', () => {
			playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
			progressBar.value = 0;
			currentTimeEl.textContent = "0:00";
			card.classList.remove('is-playing');
			stopEqualizerAnimation(card);
			activeAudioElement = null;
			activePlayButton = null;
		});

		playBtn.addEventListener('click', (e) => {
			e.stopPropagation();

			if (activeAudioElement && activeAudioElement !== audio) {
				activeAudioElement.pause();
				if (activePlayButton) {
					activePlayButton.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i>';
					activePlayButton.setAttribute('aria-pressed', 'false');
					const parentCard = activePlayButton.closest('.music-card');
					if (parentCard) {
						parentCard.classList.remove('is-playing');
						stopEqualizerAnimation(parentCard);
					}
				}
			}

			if (audio.paused) {
				audio.play().then(() => {
					playBtn.innerHTML = '<i class="fa-solid fa-pause" aria-hidden="true"></i>';
					playBtn.setAttribute('aria-pressed', 'true');
					card.classList.add('is-playing');
					runEqualizerAnimation(card, audio);
					activeAudioElement = audio;
					activePlayButton = playBtn;
				}).catch(err => {
					console.error(`[Playback Failure] Could not play "${track.title}". Resolved URI: ${audio.src}. Details:`, err);
				});
			} else {
				audio.pause();
				playBtn.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i>';
				playBtn.setAttribute('aria-pressed', 'false');
				card.classList.remove('is-playing');
				stopEqualizerAnimation(card);
				activeAudioElement = null;
				activePlayButton = null;
			}
		});

		progressBar.addEventListener('input', (e) => {
			if (audio.duration) {
				audio.currentTime = (e.target.value / 100) * audio.duration;
				progressBar.style.setProperty('--progress', e.target.value + '%');
			}
		});

		container.appendChild(card);
	});
}

function setupBackToTop() {
	const btn = document.getElementById('backToTop');
	const footer = document.querySelector('.site-footer');
	if (!btn) return;

	window.addEventListener('scroll', () => {
		if (window.scrollY > 400) {
			btn.style.display = 'flex';
			btn.classList.add('visible');
			if (footer) {
				const footerRect = footer.getBoundingClientRect();
				const windowHeight = window.innerHeight;
				if (footerRect.top < windowHeight) {
					const overlap = windowHeight - footerRect.top;
					btn.style.bottom = `${overlap + 30}px`;
				} else {
					btn.style.bottom = '30px';
				}
			}
		} else {
			btn.classList.remove('visible');
		}
	}, { passive: true });

	btn.addEventListener('click', () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});
}

function checkTextTruncation() {
	document.querySelectorAll('.doc-card, .home-project-card').forEach(card => {
		const desc = card.querySelector('.doc-card-description, .card-desc-clamp');
		if (desc) {
			card.classList.remove('is-truncated');
			if (desc.scrollHeight > desc.clientHeight + 5) {
				card.classList.add('is-truncated');
			}
		}
	});
}

const ENABLE_MOON_PHASE_TITLE_REPLACEMENT = true;

const MOON_TITLE_CONFIG = {
	height: "0.78em",
	width: "0.78em",
	scaleX: 1.0,
	scaleY: 1.0,
	marginTop: "0px",
	marginRight: "6px",
	marginBottom: "0px",
	marginLeft: "-2px",
	verticalAlign: "-0.05em"
};

function updateTitleWithMoonPhase() {
	if (!ENABLE_MOON_PHASE_TITLE_REPLACEMENT) return;
	const titleEl = document.querySelector('.site-header h1');
	if (!titleEl) return;

	titleEl.style.setProperty('--moon-height', MOON_TITLE_CONFIG.height);
	titleEl.style.setProperty('--moon-width', MOON_TITLE_CONFIG.width);
	titleEl.style.setProperty('--moon-scale-x', MOON_TITLE_CONFIG.scaleX);
	titleEl.style.setProperty('--moon-scale-y', MOON_TITLE_CONFIG.scaleY);
	titleEl.style.setProperty('--moon-margin-top', MOON_TITLE_CONFIG.marginTop);
	titleEl.style.setProperty('--moon-margin-right', MOON_TITLE_CONFIG.marginRight);
	titleEl.style.setProperty('--moon-margin-bottom', MOON_TITLE_CONFIG.marginBottom);
	titleEl.style.setProperty('--moon-margin-left', MOON_TITLE_CONFIG.marginLeft);
	titleEl.style.setProperty('--moon-vertical-align', MOON_TITLE_CONFIG.verticalAlign);

	const rawText = (window.t && titleEl.hasAttribute('data-i18n'))
		? window.t(titleEl.getAttribute('data-i18n'))
		: titleEl.textContent;

	const imagePath = getMoonPhaseImagePath();
	const moonImgHtml = `<img src="${imagePath}" alt="o" class="title-moon-icon">`;
	titleEl.innerHTML = rawText
		.split(' ')
		.map(word => `<span class="title-word">${word.replace(/[oO]/g, moonImgHtml)}</span>`)
		.join(' ');

	const moonElements = titleEl.querySelectorAll('.title-moon-icon');
	if (moonElements.length === 0) return;

	let pressTimer = null;
	let cycleInterval = null;
	let decelerationTimeout = null;
	let isSpinning = false;
	let currentPhaseIndex = getMoonPhaseDayNumber();

	const startInteraction = (e) => {
		e.preventDefault();
		if (decelerationTimeout) clearTimeout(decelerationTimeout);
		moonElements.forEach(el => {
			el.classList.remove('moon-decelerating', 'moon-fading-reset');
			el.classList.add('moon-charging');
		});
		currentPhaseIndex = getMoonPhaseDayNumber();
		pressTimer = setTimeout(() => {
			isSpinning = true;
			moonElements.forEach(el => {
				el.classList.remove('moon-charging');
				el.classList.add('moon-spinning');
			});
			cycleInterval = setInterval(() => {
				currentPhaseIndex = (currentPhaseIndex % 30) + 1;
				const phaseString = currentPhaseIndex.toString().padStart(2, '0');
				const newSrc = `assets/images/moon_phases/${phaseString}.png`;
				moonElements.forEach(el => { el.src = newSrc; });
			}, 35);
		}, 450);
	};

	const stopInteraction = () => {
		clearTimeout(pressTimer);
		if (cycleInterval) {
			clearInterval(cycleInterval);
			cycleInterval = null;
		}

		if (isSpinning) {
			isSpinning = false;
			moonElements.forEach(el => {
				el.classList.remove('moon-charging', 'moon-spinning');
				el.classList.add('moon-decelerating');
			});

			let slowSteps = 0;
			const slowCycle = () => {
				slowSteps++;
				currentPhaseIndex = (currentPhaseIndex % 30) + 1;
				const phaseString = currentPhaseIndex.toString().padStart(2, '0');
				const newSrc = `assets/images/moon_phases/${phaseString}.png`;
				moonElements.forEach(el => { el.src = newSrc; });

				if (slowSteps < 4) {
					decelerationTimeout = setTimeout(slowCycle, 40 + slowSteps * 35);
				} else {
					moonElements.forEach(el => {
						el.classList.remove('moon-decelerating');
						el.classList.add('moon-fading-reset');
						el.src = getMoonPhaseImagePath();
					});
					decelerationTimeout = setTimeout(() => {
						moonElements.forEach(el => el.classList.remove('moon-fading-reset'));
					}, 400);
				}
			};
			slowCycle();
		} else {
			moonElements.forEach(el => {
				el.classList.remove('moon-charging', 'moon-spinning', 'moon-decelerating');
				el.src = getMoonPhaseImagePath();
			});
		}
	};

	moonElements.forEach(moonElement => {
		moonElement.addEventListener('mousedown', startInteraction);
		moonElement.addEventListener('touchstart', startInteraction, { passive: false });
	});

	window.addEventListener('mouseup', stopInteraction);
	window.addEventListener('mouseleave', stopInteraction);
	window.addEventListener('touchend', stopInteraction);
}
