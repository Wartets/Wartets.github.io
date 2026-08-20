let openWindows = window.WindowManager ? window.WindowManager.windows : {};
let zIndexCounter = 100;
let activeWindow = null;
let selectedIcons = new Set();
let fs;
let currentContextMenuTarget = null;
let currentCalendarDate = new Date();
let isContextMenuVisible = false;
let customIcons = JSON.parse(localStorage.getItem('customIcons')) || [];
let webampInstance = null;
let lastClickedIconForRange = null;
let desktopDragOffset = { x: 0, y: 0 };

function setCutVisuals(paths) {
	clearCutVisuals();
	if (!Array.isArray(paths)) return;
	const selectors = paths.map(p => `[data-path="${p.replace(/"/g, '\\"')}"]`).join(', ');
	if (!selectors) return;
	document.querySelectorAll(selectors).forEach(el => {
		el.classList.add('cut-item');
	});
}

function clearCutVisuals() {
	document.querySelectorAll('.cut-item').forEach(el => {
		el.classList.remove('cut-item');
	});
}

function getActiveSelectedElements() {
	const elements = [];
	const paths = [];
	let activeContainer = null;
	if (activeWindow && activeWindow.classList.contains('xp-explorer-window')) {
		const state = activeWindow.explorerState;
		if (state && state.selectedItems && state.selectedItems.size > 0) {
			state.selectedItems.forEach(item => {
				const p = item.dataset.path;
				if (p && !p.startsWith('app://')) {
					const el = fs ? fs.findByPath(p) : null;
					if (el) {
						elements.push(el);
						paths.push(p);
					}
				}
			});
			return { elements, paths };
		}
	}
	selectedIcons.forEach(item => {
		const p = item.dataset.path;
		if (p && !p.startsWith('app://')) {
			const el = fs ? fs.findByPath(p) : null;
			if (el && !paths.includes(p)) {
				elements.push(el);
				paths.push(p);
			}
		}
	});
	return { elements, paths };
}

function loadDesktopIconPositions() {
	try {
		const raw = localStorage.getItem('desktopIconPositions');
		return raw ? JSON.parse(raw) : {};
	} catch (e) {
		return {};
	}
}

function saveDesktopIconPositions(positions) {
	try {
		localStorage.setItem('desktopIconPositions', JSON.stringify(positions));
	} catch (e) {}
}

function isAutoArrangeEnabled() {
	if (window.SettingsApp && typeof window.SettingsApp.get === 'function') {
		const val = window.SettingsApp.get('desktopAutoArrange');
		if (val !== undefined) return !!val;
	}
	return localStorage.getItem('desktopAutoArrange') === 'true';
}

function toggleAutoArrange() {
	const current = isAutoArrangeEnabled();
	const nextVal = !current;
	localStorage.setItem('desktopAutoArrange', nextVal.toString());
	if (window.SettingsApp && typeof window.SettingsApp.set === 'function') {
		window.SettingsApp.set('desktopAutoArrange', nextVal);
	}
	if (nextVal) {
		arrangeIcons('name');
	} else {
		arrangeIcons('none');
	}
}

function isAlignToGridEnabled() {
	if (window.SettingsApp && typeof window.SettingsApp.get === 'function') {
		const val = window.SettingsApp.get('desktopAlignToGrid');
		if (val !== undefined) return !!val;
	}
	const stored = localStorage.getItem('desktopAlignToGrid');
	return stored === null ? true : stored === 'true';
}

function toggleAlignToGrid() {
	const current = isAlignToGridEnabled();
	const nextVal = !current;
	localStorage.setItem('desktopAlignToGrid', nextVal.toString());
	if (window.SettingsApp && typeof window.SettingsApp.set === 'function') {
		window.SettingsApp.set('desktopAlignToGrid', nextVal);
	}
	arrangeIcons('none');
}

window.isAutoArrangeEnabled = isAutoArrangeEnabled;
window.toggleAutoArrange = toggleAutoArrange;
window.isAlignToGridEnabled = isAlignToGridEnabled;
window.toggleAlignToGrid = toggleAlignToGrid;
window.loadDesktopIconPositions = loadDesktopIconPositions;
window.saveDesktopIconPositions = saveDesktopIconPositions;

function getNextWindowPosition(width, height) {
	if (window.WindowManager) {
		return window.WindowManager.getNextPosition(width, height);
	}
	return { x: 24, y: 24 };
}

const RECENT_DOCUMENTS_STORAGE_KEY = 'xp_recent_documents';

function addToRecentDocs(item) {
	if (!item || !item.name) return;
	try {
		let list = JSON.parse(localStorage.getItem(RECENT_DOCUMENTS_STORAGE_KEY) || '[]');
		list = list.filter(doc => doc.name !== item.name);
		list.unshift({
			name: item.name,
			type: item.type || 'file',
			icon: item.icon || '../assets/images/desk/icons/File.webp',
			path: item.path || '',
			targetId: item.targetId || null,
			timestamp: Date.now()
		});
		const maxDocs = (window.SettingsApp && window.SettingsApp.get('startMenuRecentDocsCount')) || 15;
		if (list.length > maxDocs) list = list.slice(0, maxDocs);
		localStorage.setItem(RECENT_DOCUMENTS_STORAGE_KEY, JSON.stringify(list));
	} catch (e) {
		console.warn('Failed to save recent document:', e);
	}
}

function getRecentDocs() {
	try {
		return JSON.parse(localStorage.getItem(RECENT_DOCUMENTS_STORAGE_KEY) || '[]');
	} catch (e) {
		return [];
	}
}

function clearRecentDocs() {
	localStorage.removeItem(RECENT_DOCUMENTS_STORAGE_KEY);
}

window.DeskAPI = {
	getUnreadMailCount: () => {
		if (!window.MailStore) return 0;
		window.MailStore.init();
		return window.MailStore.getFolders().reduce((sum, folder) => sum + window.MailStore.getMessages(folder.id).filter(m => !m.read).length, 0);
	},
	getDesktopItemCount: () => (typeof fs !== 'undefined' && fs) ? fs.root.listContent().filter(el => !el.hidden).length : 0,
	getOpenWindowCount: () => (typeof openWindows !== 'undefined') ? Object.keys(openWindows).length : 0,
	getOpenWindowTitles: () => {
		if (typeof openWindows === 'undefined') return [];
		return Object.values(openWindows)
			.filter(w => !w.classList.contains('minimized') && !w.classList.contains('xp-modal-overlay'))
			.map(w => w.querySelector('.xp-window-header .title')?.textContent || 'Window');
	},
	closeAllWindows: () => {
		if (window.WindowManager) {
			window.WindowManager.closeAll();
			return;
		}
		if (typeof openWindows === 'undefined') return;
		Object.keys(openWindows).forEach(id => {
			const w = openWindows[id];
			if (w && typeof closeWindow === 'function') closeWindow(w, id);
		});
	},
	minimizeAllWindows: () => {
		if (window.WindowManager) {
			window.WindowManager.minimizeAll();
			return;
		}
		if (typeof openWindows === 'undefined') return;
		Object.keys(openWindows).forEach(id => {
			const w = openWindows[id];
			if (w && !w.classList.contains('minimized') && typeof minimizeWindow === 'function') minimizeWindow(w, id);
		});
	},
	emptyRecycleBin: () => {
		if (typeof fs !== 'undefined' && fs.emptyRecycleBin) {
			fs.emptyRecycleBin();
			if (typeof refreshUI === 'function') refreshUI();
			const rbWindow = document.getElementById('window-recycle-bin');
			if (rbWindow && typeof renderRecycleBinContent === 'function') renderRecycleBinContent(rbWindow);
			return true;
		}
		return false;
	},
	getRandomProject: () => {
		if (typeof projects === 'undefined') return null;
		const list = projects.flat().filter(p => p && typeof p === 'object' && p.show !== false);
		if (list.length === 0) return null;
		return list[Math.floor(Math.random() * list.length)];
	},
	getAllProjects: () => {
		if (typeof projects === 'undefined') return [];
		return projects.flat().filter(p => p && typeof p === 'object' && p.show !== false);
	},
	openMailApp: () => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('outlook') : openOutlookExpress()),
	openProjectsFolder: () => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('projects') : openAllProjectsFolder()),
	openRecycleBin: () => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('recyclebin') : openRecycleBinWindow()),
	openCalculator: () => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('calculator') : (window.CalculatorApp ? window.CalculatorApp.open() : null)),
	openCharacterMap: () => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('charmap') : (window.CharacterMapApp ? window.CharacterMapApp.open() : null)),
	openPaint: (file) => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('paint', file) : (window.PaintApp ? window.PaintApp.open(file) : null)),
	openSoundRecorder: (file) => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('soundrecorder', file) : (window.SoundRecorderApp ? window.SoundRecorderApp.open(file) : null)),
	openMediaPlayer: (track) => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('mediaplayer', track) : (window.MediaPlayerApp ? window.MediaPlayerApp.open(track) : null)),
	openPictureViewer: (file) => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('pictureviewer', file) : (window.PictureViewerApp ? window.PictureViewerApp.open(file) : null)),
	openMinesweeperGame: () => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('minesweeper') : (window.MinesweeperApp ? window.MinesweeperApp.open() : null)),
	openSolitaireGame: () => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('solitaire') : (window.SolitaireApp ? window.SolitaireApp.open() : null)),
	openWinampPlayer: (track) => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('winamp', track) : openWinamp(track)),
	getMoonPhaseDay: () => (typeof getMoonPhaseDayNumber === 'function') ? getMoonPhaseDayNumber() : null,
	getRecycleBinCount: () => (typeof fs !== 'undefined' && fs) ? fs.loadRecycleBinItems().length : 0,
	addToRecentDocs: (item) => addToRecentDocs(item),
	getRecentDocs: () => getRecentDocs(),
	clearRecentDocs: () => clearRecentDocs(),
	openMyComputer: () => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('mycomputer') : openMyComputerWindow()),
	openSearch: (query) => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('search', { query }) : openSearchWindow(query)),
	openPrinters: () => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('printers') : openPrintersWindow()),
	openNetworkPlaces: () => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('network') : openNetworkPlacesWindow()),
	openDisplaySettings: (tab = 'desktop') => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('display', { tab }) : openDisplaySettings(tab)),
	openAchievements: (targetId = null) => {
		if (window.DeskAppRegistry) return window.DeskAppRegistry.launch('achievements', { targetId });
		if (window.AchievementsManager) return window.AchievementsManager.open(targetId);
	},
	openTaskManager: (tab = 'applications') => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('taskmgr', { tab }) : (window.TaskManagerApp ? window.TaskManagerApp.open(tab) : null)),
	openEncartaGlobe: () => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('encarta') : (window.EncartaGlobeApp ? window.EncartaGlobeApp.open() : null)),
	getNowPlaying: () => {
		if (window.MediaPlayerApp && typeof window.MediaPlayerApp.getNowPlaying === 'function') {
			const current = window.MediaPlayerApp.getNowPlaying();
			if (current) return current;
		}
		if (webampInstance) {
			return { title: "Projet 8.4", artist: "Wartets" };
		}
		return null;
	},
	toggleMusicPlayback: () => {
		if (window.MediaPlayerApp && typeof window.MediaPlayerApp.togglePlay === 'function') {
			window.MediaPlayerApp.togglePlay();
			return true;
		}
		if (!webampInstance) {
			openWinamp();
			return true;
		}
		return true;
	},
	nextMusicTrack: () => {
		if (window.MediaPlayerApp && typeof window.MediaPlayerApp.playNext === 'function') {
			window.MediaPlayerApp.playNext();
			return true;
		}
		if (webampInstance) {
			return true;
		}
		openWinamp();
		return true;
	},
	openApp: (appId, args) => {
		if (window.DeskAppRegistry) {
			return window.DeskAppRegistry.launch(appId, args);
		}
		return false;
	}
};

document.addEventListener('DOMContentLoaded', async () => {
	if (window.SettingsApp && typeof window.SettingsApp.ready === 'function') {
		await window.SettingsApp.ready();
	}

	initializeFileSystem();
	initDocuments();
	if (window.MusicStore) {
		window.MusicStore.init();
	}
	applyInitialDesktopBackground();
	renderDesktopIcons();
	if (window.Taskbar) {
		window.Taskbar.init();
	}
	if (window.StartMenu) {
		window.StartMenu.init();
	}
	setupDesktopContextMenu();
	setupCalendar();
	setupDesktopDropzone();
	setupDesktopSelection();
	setupKeyboardNavigation();
	setupGlobalKeyboardShortcuts();
	updateOutlookUnreadBadge();
	setInterval(updateOutlookUnreadBadge, 60000);
	if (window.ClippyAgent) window.ClippyAgent.init();
	checkAndDisplayMobileWarning();

	if (window.WindowManager && typeof window.WindowManager.restoreOpenWindowsState === 'function') {
		setTimeout(() => {
			window.WindowManager.restoreOpenWindowsState();
		}, 150);
	}

	window.addEventListener('resize', () => {
		if (window.WindowManager && typeof window.WindowManager.clampAllWindowsToWorkspace === 'function') {
			window.WindowManager.clampAllWindowsToWorkspace();
		}
		arrangeIcons('none');
	});

	window.addEventListener('beforeunload', () => {
		if (window.WindowManager && typeof window.WindowManager.saveOpenWindowsState === 'function') {
			window.WindowManager.saveOpenWindowsState();
		}
	});

	if (window.DeskEventBus) {
		window.DeskEventBus.on('fs:changed', () => refreshUI());
		window.DeskEventBus.on('settings:changed', () => {
			applyInitialDesktopBackground();
			arrangeIcons('none');
		});
		window.DeskEventBus.on('window:focused', (payload) => {
			activeWindow = payload.win;
		});
		window.DeskEventBus.on('window:closed', () => {
			if (window.WindowManager) {
				activeWindow = window.WindowManager.activeWindow;
				openWindows = window.WindowManager.windows;
			}
		});
	}

	const bootScreen = document.getElementById('boot-screen');
	const welcomeScreen = document.getElementById('welcome-screen');
	const loginUser = document.getElementById('login-user');
	const bootLogo = document.querySelector('.boot-logo');

	const bootLogoImage = document.getElementById('boot-logo-image');
	if (bootLogoImage && window.SettingsApp) {
		const preset = window.SettingsApp.get('bootLogoPreset') || 'default';
		if (preset === 'pro') {
			bootLogoImage.src = '../assets/images/desk/logos/WindowsProLogoText-Big.webp';
			bootLogoImage.className = 'boot-logo preset-pro';
		} else if (preset === 'win2000') {
			bootLogoImage.src = '../assets/images/desk/logos/Windows2000LogoText-Big.webp';
			bootLogoImage.className = 'boot-logo preset-win2000';
		} else {
			bootLogoImage.src = '../assets/images/desk/logos/WindowsLogoText-Big.webp';
			bootLogoImage.className = 'boot-logo preset-default';
		}
	}

	let bootTimeout;
	let loginTimeout;

	function skipStartup() {
		if (window.AchievementsManager) {
			window.AchievementsManager.progress('boot_skipper', 1);
		}
		if (bootTimeout) clearTimeout(bootTimeout);
		if (loginTimeout) clearTimeout(loginTimeout);
		
		if (bootScreen) bootScreen.style.display = 'none';
		if (welcomeScreen) welcomeScreen.style.display = 'none';
	}

	if (bootLogo) {
		bootLogo.style.cursor = 'pointer';
		bootLogo.title = 'Click to skip startup';
		bootLogo.addEventListener('click', skipStartup);
	}

	if (window.SettingsApp && window.SettingsApp.get('skipBootScreen')) {
		skipStartup();
	} else {
		bootTimeout = setTimeout(() => {
			if (bootScreen.style.display !== 'none') {
				bootScreen.style.display = 'none';
				welcomeScreen.classList.remove('hidden');

				loginTimeout = setTimeout(() => {
					if (loginUser && welcomeScreen.style.display !== 'none') loginUser.click();
				}, 1500);
			}
		}, 3000);
	}

	if (loginUser) {
		loginUser.addEventListener('click', () => {
			loginUser.classList.add('logging-in');
			setTimeout(() => {
				welcomeScreen.style.opacity = '0';
				welcomeScreen.style.transition = 'opacity 0.5s';
				setTimeout(() => {
					welcomeScreen.style.display = 'none';
				}, 500);
			}, 1000);
		});
	}
});

function initDocuments() {
	if (!fs) return;
	['/PDFs', '/Music', '/Others/Poems', '/Others/Projects'].forEach(mountPath => {
		const mount = fs.mountPoints.get(mountPath);
		if (mount && typeof mount.refresh === 'function') {
			mount.refresh();
		}
	});
}

function setupDesktopSelection() {
	let isSelecting = false;
	let startX, startY;
	let selectionBox = null;
	let initialSelection = new Set();
	let activeContainer = null;
	let containerRect = null;
	let scrollStartX = 0;
	let scrollStartY = 0;

	document.addEventListener('mousedown', (e) => {
		const boot = document.getElementById('boot-screen');
		const welcome = document.getElementById('welcome-screen');
		if ((boot && boot.style.display !== 'none') || (welcome && welcome.style.display !== 'none' && !welcome.classList.contains('hidden'))) {
			return;
		}

		const desktop = document.getElementById('desktop');
		const iconsContainer = document.getElementById('project-icons-container');
		const folderWrapper = e.target.closest('.folder-content-wrapper');

		if (e.target === desktop || e.target === iconsContainer) {
			activeContainer = iconsContainer;
		} else if (folderWrapper && !e.target.closest('.project-icon')) {
			activeContainer = folderWrapper;
		} else {
			return;
		}

		if (e.target === activeContainer && e.offsetX > e.target.clientWidth) {
			return;
		}

		if (e.button !== 0) return;

		isSelecting = true;
		containerRect = activeContainer.getBoundingClientRect();
		scrollStartX = activeContainer.scrollLeft || 0;
		scrollStartY = activeContainer.scrollTop || 0;

		startX = e.clientX - containerRect.left + scrollStartX;
		startY = e.clientY - containerRect.top + scrollStartY;

		if (!e.ctrlKey) {
			clearIconSelections();
		}

		initialSelection = new Set(selectedIcons);

		selectionBox = document.createElement('div');
		selectionBox.className = 'selection-box';
		selectionBox.style.position = 'absolute';
		selectionBox.style.left = `${startX}px`;
		selectionBox.style.top = `${startY}px`;
		selectionBox.style.width = '0px';
		selectionBox.style.height = '0px';

		activeContainer.appendChild(selectionBox);
	});

	document.addEventListener('mousemove', (e) => {
		if (!isSelecting || !selectionBox || !activeContainer) return;

		const currentScrollX = activeContainer.scrollLeft || 0;
		const currentScrollY = activeContainer.scrollTop || 0;
		const currentX = e.clientX - containerRect.left + currentScrollX;
		const currentY = e.clientY - containerRect.top + currentScrollY;

		const left = Math.min(startX, currentX);
		const top = Math.min(startY, currentY);
		const width = Math.abs(currentX - startX);
		const height = Math.abs(currentY - startY);

		selectionBox.style.left = `${left}px`;
		selectionBox.style.top = `${top}px`;
		selectionBox.style.width = `${width}px`;
		selectionBox.style.height = `${height}px`;

		const icons = activeContainer.querySelectorAll('.project-icon');

		icons.forEach(icon => {
			const iconRect = icon.getBoundingClientRect();
			const iconLeft = iconRect.left - containerRect.left + currentScrollX;
			const iconTop = iconRect.top - containerRect.top + currentScrollY;
			const iconRight = iconLeft + iconRect.width;
			const iconBottom = iconTop + iconRect.height;

			const boxLeft = left;
			const boxTop = top;
			const boxRight = left + width;
			const boxBottom = top + height;

			const isIntersecting = !(iconLeft > boxRight ||
				iconRight < boxLeft ||
				iconTop > boxBottom ||
				iconBottom < boxTop);

			if (isIntersecting) {
				if (!icon.classList.contains('selected')) {
					icon.classList.add('selected');
					selectedIcons.add(icon);
				}
			} else {
				if (!initialSelection.has(icon)) {
					if (icon.classList.contains('selected')) {
						icon.classList.remove('selected');
						selectedIcons.delete(icon);
					}
				}
			}
		});
	});

	document.addEventListener('mouseup', () => {
		if (isSelecting) {
			if (selectedIcons.size > 10 && window.AchievementsManager) {
				window.AchievementsManager.progress('lasso_master', 1);
			}
			isSelecting = false;
			if (selectionBox) {
				selectionBox.remove();
				selectionBox = null;
			}
			activeContainer = null;
			containerRect = null;
			initialSelection.clear();
		}
	});
}

function openPDFWindow(file) {
	const id = `window-pdf-${file.name.replace(/[^\w-]/g, '_')}`;
	const existingWindow = document.getElementById(id);
	if (existingWindow) {
		bringWindowToFront(existingWindow);
		return;
	}

	const contentHTML = `
		<div style="width: 100%; height: 100%; overflow: hidden; display: flex; flex-direction: column;">
			<iframe src="${file.content}" style="width: 100%; height: 100%; border: none; flex-grow: 1;" allow="fullscreen"></iframe>
		</div>
	`;

	addToRecentDocs({ name: file.name, icon: file.icon, type: 'pdf', path: file.getFullPath() });
	const win = createXPWindow(id, file.name, contentHTML, 800, 600, {
		iconSrc: file.icon
	});

	win.dataset.appId = 'pdf';
	win.dataset.appArgs = JSON.stringify({ path: file.getFullPath() });
	win.getWindowState = () => ({
		appId: 'pdf',
		path: file.getFullPath(),
		fileName: file.name
	});

	const content = win.querySelector('.xp-window-content');
	content.style.padding = '0';
	content.style.overflow = 'hidden';
	content.style.display = 'flex';
	content.style.flexDirection = 'column';
	win.classList.add('pdf-window');
}

function createConfirmationDialog(message, onConfirm) {
	showXPDialog('Confirm Action', message, 'question', {
		buttons: ['Yes', 'No'],
		callback: (result) => {
			if (result === 'Yes') {
				onConfirm();
			}
		}
	});
}

function startInlineRename(iconElement) {
	const span = iconElement.querySelector('span');
	const path = iconElement.dataset.path;
	const element = fs.findByPath(path);
	if (!element || !span) return;

	span.style.display = 'none';

	const input = document.createElement('input');
	input.type = 'text';
	input.value = element.name;
	iconElement.appendChild(input);
	input.focus();
	input.select();

	const endRename = (commit) => {
		let success = false;
		if (commit) {
			const newName = input.value;
			if (newName && newName.trim() !== '' && newName !== element.name) {
				try {
					element.rename(newName);
					fs.save();
					span.textContent = newName;
					success = true;
					refreshUI();
				} catch (e) {
					showXPDialog('Error Renaming File', e.message, 'error');
					input.focus();
					input.select();
				}
			} else {
				success = true;
			}
		} else {
			success = true;
		}

		if (success) {
			input.remove();
			span.style.display = '-webkit-box';
			iconElement.title = element.name;
			clearIconSelections();
		}
	};

	input.addEventListener('blur', () => endRename(true));
	input.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			endRename(true);
		} else if (e.key === 'Escape') {
			e.preventDefault();
			endRename(false);
		}
	});
}

function resolveLocalizedText(field) {
	if (typeof field === 'string') return field;
	if (field && typeof field === 'object') {
		return field.en || field.fr || Object.values(field)[0] || '';
	}
	return '';
}

function resolveProjectTitle(title) {
	return resolveLocalizedText(title);
}

function relocateElement(element, destinationFolder) {
	let finalName = element.name;
	let counter = 1;
	while (destinationFolder.children.has(finalName)) {
		finalName = `${element.name} (${counter})`;
		counter++;
	}
	element.name = finalName;
	destinationFolder.add(element);
}

function migrateProjectFileLocations(othersFolder, othersProjectsFolder) {
	const misplacedInOthers = othersFolder.listContent().filter(el => el instanceof ProjectFile);
	misplacedInOthers.forEach(projectFile => {
		othersFolder.remove(projectFile.name);
		const isVisible = projectFile.projectData && projectFile.projectData.show !== false;
		relocateElement(projectFile, isVisible ? fs.root : othersProjectsFolder);
	});

	const misplacedOnDesktop = fs.root.listContent().filter(el => el instanceof ProjectFile && el.projectData && el.projectData.show === false);
	misplacedOnDesktop.forEach(projectFile => {
		fs.root.remove(projectFile.name);
		relocateElement(projectFile, othersProjectsFolder);
	});
}

function initializeFileSystem() {
	fs = new VFSManager();
	window.fs = fs;
	window.vfs = fs;
	fs.load();

	const pdfProvider = new DynamicLibraryVFSProvider('dynamic-documents', {
		rootName: 'PDFs',
		generator: () => {
			if (!window.libraryData || !window.libraryData.documents) return [];
			return window.libraryData.documents.map(doc => {
				const fileName = doc.filePath.split('/').pop();
				const file = new File(fileName, null, doc.filePath);
				file.icon = '../assets/images/desk/icons/List File.webp';
				file.size = doc.size || doc.fileSize || 245000;
				file.createdAt = new Date(doc.timestamp);
				file.modifiedAt = new Date(doc.timestamp);
				return file;
			});
		}
	});
	fs.mount('/PDFs', pdfProvider);

	const musicProvider = new DynamicLibraryVFSProvider('dynamic-music', {
		rootName: 'Music',
		generator: () => {
			if (!window.MusicStore || !window.MusicStore.tracks) return [];
			return window.MusicStore.tracks.map(t => {
				const f = new File(t.title || 'Track.mp3', null, t.url || '');
				f.icon = '../assets/images/desk/icons/Music File.webp';
				f.musicTrack = t;
				return f;
			});
		}
	});
	fs.mount('/Music', musicProvider);

	const poemsProvider = new DynamicLibraryVFSProvider('dynamic-poetry', {
		rootName: 'Poems',
		generator: () => {
			if (!window.poetryData || !window.poetryData.documents) return [];
			return window.poetryData.documents.map(poem => {
				const fileName = poem.filePath.split('/').pop();
				const file = new File(fileName, null, '');
				file.icon = '../assets/images/desk/icons/File.webp';
				file.readOnly = true;
				file.remoteUrl = poem.filePath;
				file.createdAt = new Date(poem.timestamp);
				file.modifiedAt = new Date(poem.timestamp);
				return file;
			});
		}
	});
	fs.mount('/Others/Poems', poemsProvider);

	let othersFolder = fs.findByPath('/Others');
	if (othersFolder instanceof Folder) {
		othersFolder.hidden = true;
	}

	const projectsProvider = new DynamicLibraryVFSProvider('dynamic-projects', {
		rootName: 'Projects',
		generator: () => {
			if (typeof projects === 'undefined' || !Array.isArray(projects)) return [];
			return projects.flat().filter(p => p && typeof p === 'object' && p.title).map(project => {
				const titleText = resolveProjectTitle(project.title);
				const projectFile = new ProjectFile(titleText, null, project);
				projectFile.createdAt = new Date(project.timestamp || Date.now());
				return projectFile;
			});
		}
	});
	fs.mount('/Others/Projects', projectsProvider);

	const userStorageProvider = new IndexedDBVFSProvider('user-data-store', {
		rootName: 'UserData',
		dbName: 'Wartets_XP_UserData_DB',
		storeName: 'files',
		hidden: true
	});
	fs.mount('/UserData', userStorageProvider, { hidden: true });

	const configuredDrives = (window.SettingsApp && window.SettingsApp.get('vfsDrives')) || [];
	configuredDrives.forEach(drv => {
		if (drv.letter && !fs.getDrive(drv.letter)) {
			const mountPath = drv.letter === 'C' ? '/' : `/Volumes/${drv.letter}`;
			const provider = new VirtualDriveProvider(drv.letter, {
				volumeLabel: drv.label,
				driveType: drv.type,
				totalBytes: drv.totalBytes,
				freeBytes: drv.freeBytes,
				icon: drv.icon,
				isReady: drv.type !== 'removable'
			});
			if (mountPath !== '/') fs.mount(mountPath, provider);
			fs.registerDrive(drv.letter, provider, mountPath);
		}
	});

	const existingDesktopProjectNames = new Set(
		fs.root.listContent().filter(el => el instanceof ProjectFile).map(el => el.name)
	);

	if (typeof projects !== 'undefined' && Array.isArray(projects)) {
		projects.flat().forEach(project => {
			if (typeof project !== 'object' || project === null || !project.title) return;
			if (project.show === false) return;
			const titleText = resolveProjectTitle(project.title);
			if (!titleText || existingDesktopProjectNames.has(titleText)) return;

			const projectFile = new ProjectFile(titleText, null, project);
			projectFile.createdAt = new Date(project.timestamp || Date.now());
			fs.root.add(projectFile);
			existingDesktopProjectNames.add(titleText);
		});
	}

	initWallpaperFolder();
	fs.save();
}

let wallpaperMetadataMap = new Map();

function loadWallpaperMetadata() {
	fetch('../data/desk-wallpaper.json')
		.then(r => r.ok ? r.json() : [])
		.then(items => {
			if (Array.isArray(items)) {
				items.forEach(item => {
					if (item.filename) wallpaperMetadataMap.set(item.filename.toLowerCase(), item.name);
					if (item.path) {
						const fname = item.path.split('/').pop().toLowerCase();
						wallpaperMetadataMap.set(fname, item.name);
						wallpaperMetadataMap.set(item.path, item.name);
					}
				});
			}
		})
		.catch(() => {});
}

function initWallpaperFolder() {
	loadWallpaperMetadata();
	let winFolder = fs.root.getByName('WINDOWS');
	if (!winFolder) {
		winFolder = new Folder('WINDOWS');
		winFolder.icon = '../assets/images/desk/icons/Folder Closed.webp';
		fs.root.add(winFolder);
	}
	winFolder.hidden = true;

	let webFolder = winFolder.getByName('Web');
	if (!webFolder) {
		webFolder = new Folder('Web');
		webFolder.icon = '../assets/images/desk/icons/Folder Closed.webp';
		winFolder.add(webFolder);
	}

	const wallpaperProvider = new StaticJSONVFSProvider('static-wallpapers', {
		endpoint: '../data/desk-wallpaper.json',
		rootName: 'Wallpaper',
		transform: (items) => {
			if (!Array.isArray(items)) return [];
			return items.map(item => {
				const fileName = item.filename || `${item.name}.webp`;
				const file = new File(fileName, null, item.path);
				file.remoteUrl = item.path;
				file.icon = '../assets/images/desk/icons/Picture.webp';
				file.size = 285000;
				file.readOnly = true;
				return file;
			});
		}
	});
	fs.mount('/WINDOWS/Web/Wallpaper', wallpaperProvider);
}

function initPoemsFolder(othersFolder) {
	if (typeof window.poetryData === 'undefined' || !window.poetryData.documents) return;

	let poemsFolder = othersFolder.getByName('Poems');
	if (!poemsFolder) {
		poemsFolder = new Folder('Poems');
		poemsFolder.icon = '../assets/images/desk/icons/Folder Closed.webp';
		othersFolder.add(poemsFolder);
	}

	window.poetryData.documents.forEach(poem => {
		const fileName = poem.filePath.split('/').pop();
		let file = poemsFolder.getByName(fileName);
		if (!file) {
			file = new File(fileName, null, '');
			file.icon = '../assets/images/desk/icons/File.webp';
			poemsFolder.add(file);
		}
		file.readOnly = true;
		file.remoteUrl = poem.filePath;
		file.createdAt = new Date(poem.timestamp);
		file.modifiedAt = new Date(poem.timestamp);
	});
}

function renderDesktopIcons() {
	const container = document.getElementById('project-icons-container');
	if (!container || !fs || !fs.root) return;
	container.innerHTML = '';

	const systemIconsConfig = (window.SettingsApp && window.SettingsApp.get('desktopSystemIcons')) || [];

	systemIconsConfig.forEach(sysIcon => {
		const appId = sysIcon.appId;
		const actionHandler = () => {
			if (window.DeskAppRegistry) {
				window.DeskAppRegistry.launch(appId);
			}
		};

		const icon = createIconElement({
			name: sysIcon.name,
			icon: sysIcon.icon,
			path: `app://${appId}`,
			type: 'application',
			element: null,
			systemType: sysIcon.systemType
		}, actionHandler);

		container.appendChild(icon);
	});

	const showHidden = isShowHiddenEnabled();

	fs.root.listContent().forEach(element => {
		if (element.hidden && !showHidden) return;

		let type = 'file';
		if (element instanceof Folder) type = 'folder';
		else if (element instanceof Shortcut) type = 'shortcut';
		else if (element instanceof ProjectFile) type = 'project';

		const icon = createIconElement({
			name: element.name,
			icon: element.icon,
			path: element.getFullPath(),
			type: type,
			element: element
		}, openFileSystemElement);

		if (element.hidden) {
			icon.classList.add('hidden-item');
			icon.style.opacity = '0.55';
		}

		container.appendChild(icon);
	});

	arrangeIcons('none');
}

function isShowHiddenEnabled() {
	if (window.SettingsApp && typeof window.SettingsApp.get === 'function') {
		const val = window.SettingsApp.get('showHiddenFiles');
		if (val !== undefined) return !!val;
	}
	return localStorage.getItem('desktopShowHidden') === 'true';
}

function toggleShowHidden() {
	const current = isShowHiddenEnabled();
	const nextVal = !current;
	localStorage.setItem('desktopShowHidden', nextVal.toString());
	if (window.SettingsApp && typeof window.SettingsApp.set === 'function') {
		window.SettingsApp.set('showHiddenFiles', nextVal);
	}
	if (nextVal && window.AchievementsManager) {
		window.AchievementsManager.progress('hidden_revealer', 1);
	}
	refreshUI();
}

function createIconElement(data, dblClickHandler) {
	const icon = document.createElement('div');
	icon.className = 'project-icon';
	icon.dataset.path = data.path;
	icon.dataset.type = data.type;
	if (data.systemType) {
		icon.dataset.systemType = data.systemType;
	}
	icon.draggable = true;
	icon.title = data.name;

	const img = document.createElement('img');
	img.src = data.icon || '../assets/images/desk/icons/File.webp';
	img.alt = data.name;
	icon.appendChild(img);

	const span = document.createElement('span');
	span.textContent = data.name;
	icon.appendChild(span);

	icon.addEventListener('click', (e) => {
		const isSingleClick = window.SettingsApp && window.SettingsApp.get('singleClickOpen');
		if (isSingleClick && e.button === 0 && !e.ctrlKey && !e.shiftKey) {
			dblClickHandler(data.element);
			return;
		}
		handleIconClick(e, icon);
	});
	icon.addEventListener('dblclick', () => dblClickHandler(data.element));
	icon.addEventListener('contextmenu', (e) => {
		e.preventDefault();
		e.stopPropagation();

		if (!e.ctrlKey && !icon.classList.contains('selected')) {
			clearIconSelections();
		}

		if (!icon.classList.contains('selected')) {
			icon.classList.add('selected');
			selectedIcons.add(icon);
		}

		if (window.ContextMenu) {
			if (data.systemType) {
				const items = window.ContextMenu.getSystemIconItems(data.systemType);
				window.ContextMenu.show(items, e.clientX, e.clientY);
			} else if (data.element) {
				const items = window.ContextMenu.getIconItems(data.element, icon, icon.closest('.xp-window'));
				window.ContextMenu.show(items, e.clientX, e.clientY, { element: data.element, icon });
			}
		}
	});

	icon.addEventListener('dragstart', handleDragStart);
	icon.addEventListener('dragover', handleDragOver);
	icon.addEventListener('dragleave', handleDragLeave);
	icon.addEventListener('drop', handleDrop);
	icon.addEventListener('dragend', handleDragEnd);

	return icon;
}

function handleIconContextMenu(e, icon, element) {
	e.preventDefault();
	e.stopPropagation();
	clearIconSelections();
	icon.classList.add('selected');
	selectedIcons.add(icon);
	currentContextMenuTarget = icon;
	if (window.ContextMenu && element) {
		const items = window.ContextMenu.getIconItems(element, icon, icon.closest('.xp-window'));
		window.ContextMenu.show(items, e.clientX, e.clientY, { element, icon });
	}
}

function handleIconClick(e, icon) {
	const win = icon.closest('.xp-window');
	const isCtrl = e.ctrlKey || e.metaKey;
	const isShift = e.shiftKey;
	const container = icon.parentElement;

	if (isShift && lastClickedIconForRange && lastClickedIconForRange.parentElement === container) {
		const icons = Array.from(container.querySelectorAll('.project-icon'));
		const startIndex = icons.indexOf(lastClickedIconForRange);
		const endIndex = icons.indexOf(icon);
		if (startIndex !== -1 && endIndex !== -1) {
			if (!isCtrl) {
				icons.forEach(i => i.classList.remove('selected'));
				selectedIcons.clear();
			}
			const from = Math.min(startIndex, endIndex);
			const to = Math.max(startIndex, endIndex);
			for (let i = from; i <= to; i++) {
				icons[i].classList.add('selected');
				selectedIcons.add(icons[i]);
			}
			if (win && win.classList.contains('project-window')) updateFolderUISelection(win);
			return;
		}
	}

	const isSelected = icon.classList.contains('selected');

	if (!isCtrl) {
		container.querySelectorAll('.project-icon.selected').forEach(i => i.classList.remove('selected'));
		clearIconSelections();
	}

	if (isSelected && isCtrl) {
		icon.classList.remove('selected');
		selectedIcons.delete(icon);
	} else {
		icon.classList.add('selected');
		selectedIcons.add(icon);
	}

	lastClickedIconForRange = icon;

	if (win && win.classList.contains('project-window')) {
		updateFolderUISelection(win);
	}
}

function updateFolderUISelection(win) {
	if (!win) return;
	if (win.classList.contains('xp-explorer-window') && window.FileExplorer && typeof window.FileExplorer.updateSelectionDetails === 'function') {
		window.FileExplorer.updateSelectionDetails(win);
		return;
	}
	const content = win.querySelector('.folder-content, .folder-content-wrapper, .xp-explorer-view-container');
	if (!content) return;
	const selected = content.querySelectorAll('.project-icon.selected, .xp-explorer-item.selected, .xp-details-row.selected');
	const statusCount = win.querySelector('.status-bar-left, .xp-sb-count');
	if (statusCount) {
		if (selected.length === 0) {
			const total = content.querySelectorAll('.project-icon, .xp-explorer-item, .xp-details-row').length;
			statusCount.textContent = `${total} objects`;
		} else {
			statusCount.textContent = `${selected.length} object(s) selected`;
		}
	}
}

function openFolderWindow(folder) {
	if (window.FileExplorer) {
		window.FileExplorer.open(folder);
	}
}

function clearIconSelections() {
	document.querySelectorAll('.project-icon.selected, .xp-explorer-item.selected, .xp-details-row.selected').forEach(selectedIcon => {
		selectedIcon.classList.remove('selected');
	});
	selectedIcons.clear();
}

const APP_WINDOW_BASE_SIZES = {
	outlook: { width: 980, height: 640 }
};

function computeXPWindowDimensions(preferredWidth, preferredHeight, isCompact = false) {
	if (window.WindowManager) {
		return window.WindowManager.computeDimensions(preferredWidth, preferredHeight, isCompact);
	}
	return { width: preferredWidth, height: preferredHeight };
}

function createXPWindow(id, title, contentHTML, initialWidth = 600, initialHeight = 400, options = {}) {
	if (window.WindowManager) {
		const win = window.WindowManager.createWindow(id, title, contentHTML, initialWidth, initialHeight, options);
		openWindows = window.WindowManager.windows;
		return win;
	}
	return null;
}

function showXPDialog(title, message, type = 'info', options = {}) {
	if (window.WindowManager) {
		return window.WindowManager.showDialog(title, message, type, options);
	}
	return null;
}

function makeWindowDraggable(win) {
	if (window.WindowManager) {
		window.WindowManager.makeDraggable(win);
	}
}

function makeWindowResizable(win) {
	if (window.WindowManager) {
		window.WindowManager.makeResizable(win);
	}
}

function setupWindowButtons(win, id) {
	if (window.WindowManager) {
		window.WindowManager.setupButtons(win, id);
	}
}

function setupKeyboardNavigation() {
	document.addEventListener('keydown', (e) => {
		if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
			return;
		}

		let container;
		let icons;
		
		if (activeWindow && activeWindow.classList.contains('project-window')) {
			container = activeWindow.querySelector('.folder-content');
		} else if (!activeWindow) {
			container = document.getElementById('project-icons-container');
		}

		if (!container) return;

		icons = Array.from(container.querySelectorAll('.project-icon'));
		if (icons.length === 0) return;

		const selected = container.querySelector('.project-icon.selected');
		
		if (e.key === 'Enter') {
			if (selected) {
				const dblClickEvent = new MouseEvent('dblclick', {
					'view': window,
					'bubbles': true,
					'cancelable': true
				});
				selected.dispatchEvent(dblClickEvent);
			}
			return;
		}

		if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;

		e.preventDefault();

		if (!selected) {
			icons[0].classList.add('selected');
			selectedIcons.add(icons[0]);
			return;
		}

		const currentRect = selected.getBoundingClientRect();
		const currentX = currentRect.left + currentRect.width / 2;
		const currentY = currentRect.top + currentRect.height / 2;

		let bestCandidate = null;
		let minDistance = Infinity;

		icons.forEach(icon => {
			if (icon === selected) return;

			const rect = icon.getBoundingClientRect();
			const x = rect.left + rect.width / 2;
			const y = rect.top + rect.height / 2;

			let dx = x - currentX;
			let dy = y - currentY;
			let dist = Math.sqrt(dx*dx + dy*dy);

			let isValid = false;

			if (e.key === 'ArrowRight') isValid = dx > 0 && Math.abs(dy) < rect.height;
			if (e.key === 'ArrowLeft') isValid = dx < 0 && Math.abs(dy) < rect.height;
			if (e.key === 'ArrowDown') isValid = dy > 0 && Math.abs(dx) < rect.width;
			if (e.key === 'ArrowUp') isValid = dy < 0 && Math.abs(dx) < rect.width;

			if (isValid && dist < minDistance) {
				minDistance = dist;
				bestCandidate = icon;
			}
		});

		if (bestCandidate) {
			clearIconSelections();
			bestCandidate.classList.add('selected');
			selectedIcons.add(bestCandidate);
			
			if (activeWindow) {
				updateFolderUISelection(activeWindow);
			}
		}
	});
}

function getActiveIconContainer() {
	if (activeWindow && activeWindow.classList.contains('project-window')) {
		return activeWindow.querySelector('.folder-content');
	}
	if (!activeWindow) {
		return document.getElementById('project-icons-container');
	}
	return null;
}

function getActiveContainerDestPath() {
	if (activeWindow && activeWindow.classList.contains('project-window')) {
		const content = activeWindow.querySelector('.folder-content');
		return content ? content.dataset.path : '/';
	}
	return '/';
}

let altTabState = {
	active: false,
	selectedIndex: 0,
	windowIds: [],
	overlayEl: null
};

function renderAltTabOverlay() {
	if (!altTabState.overlayEl) {
		altTabState.overlayEl = document.createElement('div');
		altTabState.overlayEl.id = 'xp-alt-tab-overlay';
		document.body.appendChild(altTabState.overlayEl);
	}

	const listEl = document.createElement('div');
	listEl.className = 'alt-tab-list';

	altTabState.windowIds.forEach((id, index) => {
		const win = document.getElementById(id);
		if (!win) return;
		const itemEl = document.createElement('div');
		itemEl.className = `alt-tab-item ${index === altTabState.selectedIndex ? 'selected' : ''}`;
		const img = document.createElement('img');
		const iconSrc = win.querySelector('.xp-window-header img')?.src || '../assets/images/desk/icons/File.webp';
		img.src = iconSrc;
		itemEl.appendChild(img);
		listEl.appendChild(itemEl);
	});

	const selectedWin = document.getElementById(altTabState.windowIds[altTabState.selectedIndex]);
	const titleText = selectedWin ? (selectedWin.querySelector('.xp-window-header .title')?.textContent || 'Window') : '';

	const titleEl = document.createElement('div');
	titleEl.className = 'alt-tab-title';
	titleEl.textContent = titleText;

	altTabState.overlayEl.innerHTML = '';
	altTabState.overlayEl.appendChild(listEl);
	altTabState.overlayEl.appendChild(titleEl);
	altTabState.overlayEl.style.display = 'flex';
}

function hideAltTabOverlay() {
	if (altTabState.overlayEl) {
		altTabState.overlayEl.remove();
		altTabState.overlayEl = null;
	}
	altTabState.active = false;
	altTabState.windowIds = [];
}

function setupGlobalKeyboardShortcuts() {
	document.addEventListener('keydown', (e) => {
		const boot = document.getElementById('boot-screen');
		const welcome = document.getElementById('welcome-screen');
		if ((boot && boot.style.display !== 'none') || (welcome && welcome.style.display !== 'none' && !welcome.classList.contains('hidden'))) return;

		const isEditable = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable;
		const ctrlOrMeta = e.ctrlKey || e.metaKey;

		if (e.altKey && e.key === 'F4' && !isEditable) {
			e.preventDefault();
			if (activeWindow && typeof closeWindow === 'function') {
				closeWindow(activeWindow, activeWindow.id);
			}
			return;
		}

		if (e.key === 'Alt') {
			return;
		}

		if (e.altKey && e.key === 'Tab') {
			e.preventDefault();
			const validIds = Object.keys(openWindows).filter(id => {
				const w = document.getElementById(id);
				return w && !w.classList.contains('xp-modal-overlay');
			});

			if (validIds.length === 0) return;

			if (!altTabState.active) {
				altTabState.active = true;
				altTabState.windowIds = validIds;
				const currentId = activeWindow ? activeWindow.id : null;
				let currentPos = currentId ? validIds.indexOf(currentId) : 0;
				if (currentPos === -1) currentPos = 0;
				altTabState.selectedIndex = (currentPos + 1) % validIds.length;
			} else {
				if (e.shiftKey) {
					altTabState.selectedIndex = (altTabState.selectedIndex - 1 + altTabState.windowIds.length) % altTabState.windowIds.length;
				} else {
					altTabState.selectedIndex = (altTabState.selectedIndex + 1) % altTabState.windowIds.length;
				}
			}

			renderAltTabOverlay();
			return;
		}

		if ((e.key === 'Meta' || (e.ctrlKey && e.key === 'Escape')) && !isEditable) {
			e.preventDefault();
			if (window.StartMenu) window.StartMenu.toggle();
			return;
		}

		if (e.ctrlKey && e.shiftKey && e.key === 'Escape') {
			e.preventDefault();
			if (window.TaskManagerApp) window.TaskManagerApp.open();
			return;
		}

		if (e.key === 'F5' && !isEditable) {
			e.preventDefault();
			refreshUI();
			return;
		}

		if (e.key === 'F2' && !isEditable) {
			if (selectedIcons.size === 1) {
				e.preventDefault();
				const icon = selectedIcons.values().next().value;
				startInlineRename(icon);
			}
			return;
		}

		if (e.key === 'Delete' && !isEditable) {
			if (selectedIcons.size > 0) {
				e.preventDefault();
				const count = selectedIcons.size;
				const message = count > 1
					? `Are you sure you want to move these ${count} items to the Recycle Bin?`
					: `Are you sure you want to move this item to the Recycle Bin?`;

				createConfirmationDialog(message, () => {
					selectedIcons.forEach(icon => {
						const p = icon.dataset.path;
						if (p && !p.startsWith('app://')) {
							try {
								fs.moveToRecycleBin(p);
							} catch (err) {}
						}
					});
					clearIconSelections();
					refreshUI();
				});
			}
			return;
		}

		if (e.key === 'Backspace' && !isEditable && activeWindow && activeWindow.classList.contains('project-window')) {
			const upBtn = activeWindow.querySelector('.up-btn');
			if (upBtn && !upBtn.disabled) {
				e.preventDefault();
				upBtn.click();
			}
			return;
		}

		if (!ctrlOrMeta) return;

		const outlookWindow = document.getElementById('window-outlook-express');
		const outlookIsActive = activeWindow === outlookWindow;
		const key = e.key.toLowerCase();

		if (key === 'n' && !isEditable) {
			if (outlookIsActive) {
				e.preventDefault();
				const newBtn = outlookWindow.querySelector('.outlook-tool-btn[data-action="new"]');
				if (newBtn) newBtn.click();
				return;
			}
			const container = getActiveIconContainer();
			if (container) {
				e.preventDefault();
				try {
					const tpl = (window.ShellAssociations && window.ShellAssociations.getNewFileTemplates().length > 0)
						? window.ShellAssociations.getNewFileTemplates()[0]
						: { defaultName: 'New Text Document.txt', content: '' };
					fs.create('File', getActiveContainerDestPath(), tpl.defaultName, { content: tpl.content });
					refreshUI();
				} catch (error) {
					showXPDialog('Error', error.message, 'error');
				}
			}
			return;
		}

		if (key === 'z' && !isEditable) {
			e.preventDefault();
			if (fs && fs.undo()) refreshUI();
			return;
		}

		if (key === 'y' && !isEditable) {
			e.preventDefault();
			if (fs && fs.redo()) refreshUI();
			return;
		}

		if (key === 'a' && !isEditable) {
			const container = getActiveIconContainer();
			if (container) {
				e.preventDefault();
				const icons = Array.from(container.querySelectorAll('.project-icon'));
				icons.forEach(icon => {
					icon.classList.add('selected');
					selectedIcons.add(icon);
				});
				if (activeWindow) updateFolderUISelection(activeWindow);
			}
			return;
		}

		if (e.key === 'Escape' && !isEditable) {
			clearCutVisuals();
			if (fs && fs.clipboard) {
				fs.clipboard.mode = null;
			}
			return;
		}

		if ((key === 'c' || key === 'x') && !isEditable) {
			const sel = getActiveSelectedElements();
			if (sel.elements.length === 0) return;
			e.preventDefault();
			fs.clipboard.mode = key === 'x' ? 'cut' : 'copy';
			fs.clipboard.elements = sel.elements;
			fs.clipboard.paths = sel.paths;
			fs.clipboard.element = sel.elements[0];
			if (key === 'x') {
				setCutVisuals(sel.paths);
			} else {
				clearCutVisuals();
			}
			return;
		}

		if (key === 'v' && !isEditable) {
			if (!fs || !fs.clipboard || !fs.clipboard.elements || fs.clipboard.elements.length === 0) return;
			e.preventDefault();
			const destPath = getActiveContainerDestPath();
			const mode = fs.clipboard.mode || 'copy';
			const ops = [];
			try {
				fs.clipboard.elements.forEach(el => {
					const srcPath = el.getFullPath();
					if (mode === 'cut') {
						const originalParent = el.parent ? el.parent.getFullPath() : '/';
						const originalName = el.name;
						const moved = fs.move(srcPath, destPath);
						if (moved) {
							ops.push({
								type: 'move',
								fromParentPath: originalParent,
								fromPath: srcPath,
								toPath: moved.getFullPath(),
								originalName,
								destName: moved.name
							});
						}
					} else {
						const copied = fs.copy(srcPath, destPath);
						if (copied) {
							ops.push({
								type: 'copy',
								path: copied.getFullPath(),
								elementData: copied.toJSON()
							});
						}
					}
				});
				if (mode === 'cut') {
					fs.clipboard.mode = null;
					clearCutVisuals();
				}
				if (ops.length > 1) {
					fs.undoStack.push({
						type: 'batch',
						operations: ops
					});
				}
				refreshUI();
			} catch (error) {
				showXPDialog('Clipboard Error', error.message, 'error');
			}
			return;
		}

		if (key === 'o' && !isEditable) {
			if (selectedIcons.size !== 1) return;
			e.preventDefault();
			const icon = selectedIcons.values().next().value;
			const path = icon.dataset.path;
			if (path && !path.startsWith('app://')) {
				const element = fs.findByPath(path);
				if (element) openFileSystemElement(element, activeWindow);
			}
			return;
		}

		if (key === 's') {
			e.preventDefault();
			if (outlookIsActive) return;
			if (activeWindow) {
				fs.save();
				showXPDialog('Save', 'All changes have been saved.', 'info');
			}
			return;
		}
	});

	document.addEventListener('keyup', (e) => {
		if (e.key === 'Alt' && altTabState.active) {
			const targetId = altTabState.windowIds[altTabState.selectedIndex];
			hideAltTabOverlay();
			if (targetId) {
				const win = document.getElementById(targetId);
				if (win) {
					if (win.classList.contains('minimized')) unminimizeWindow(win);
					bringWindowToFront(win);
				}
			}
		}
	});
}

function formatBytes(bytes) {
	if (!bytes) return '0 B';
	const units = ['B', 'KB', 'MB'];
	let value = bytes;
	let unitIndex = 0;
	while (value >= 1024 && unitIndex < units.length - 1) {
		value /= 1024;
		unitIndex++;
	}
	return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatFullDate(date) {
	return date.toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function buildInfoRow(label, value) {
	return `<div class="info-row"><span class="info-label">${label}</span><span class="info-value">${value}</span></div>`;
}

async function openElementInfoWindow(element, options = {}) {
	if (!element) return;

	let typeLabel = window.ShellAssociations ? window.ShellAssociations.getTypeLabel(element) : 'File';
	if (element instanceof Folder) typeLabel = 'File Folder';
	else if (element instanceof Shortcut) typeLabel = 'Shortcut';
	else if (element instanceof ProjectFile) typeLabel = 'Project Application';

	const id = `window-info-${element.getFullPath().replace(/[^\w-]/g, '_')}`;
	const existingWindow = document.getElementById(id);
	if (existingWindow) {
		bringWindowToFront(existingWindow);
		return;
	}

	let previewHtml = '';
	let extraRows = '';

	if (element instanceof Folder) {
		const counts = element.countItems(true);
		const folderSize = element.calculateSize();
		extraRows += buildInfoRow('Size', `${formatBytes(folderSize)} (${folderSize.toLocaleString()} bytes)`);
		extraRows += buildInfoRow('Contains', `${counts.files} Files, ${counts.folders} Folders`);
	} else if (element instanceof File) {
		extraRows += buildInfoRow('Opens with', window.ShellAssociations ? (window.ShellAssociations.getConfig(element.name)?.typeLabel || 'Notepad') : 'Notepad');
		extraRows += buildInfoRow('Size', `${formatBytes(element.size)} (${element.size.toLocaleString()} bytes)`);
		extraRows += buildInfoRow('Size on disk', `${formatBytes(Math.ceil(element.size / 4096) * 4096)}`);
		let mt = element.musicTrack;
		if (!mt && window.MusicStore) {
			mt = window.MusicStore.resolveRawItem(element.name || element.remoteUrl);
		}
		if (mt) {
			const artists = window.MusicStore ? window.MusicStore.normalizeArtists(mt.metadata?.artists) : (mt.metadata?.artists || []);
			if (artists.length) extraRows += buildInfoRow('Artist', artists.join(', '));
			if (mt.metadata?.album) extraRows += buildInfoRow('Album', mt.metadata.album);
			if (mt.metadata?.year) extraRows += buildInfoRow('Year', String(mt.metadata.year));
			if (mt.metadata?.genre) extraRows += buildInfoRow('Genre', mt.metadata.genre);
			if (mt.audio_specs?.duration) extraRows += buildInfoRow('Duration', mt.audio_specs.duration);
			if (mt.audio_specs?.bitrate) extraRows += buildInfoRow('Bitrate', mt.audio_specs.bitrate);
			if (mt.audio_specs?.sample_rate) extraRows += buildInfoRow('Sample Rate', mt.audio_specs.sample_rate);
			if (mt.audio_specs?.codec) extraRows += buildInfoRow('Audio Codec', mt.audio_specs.codec);
			if (mt.audio_specs?.is_lossless !== undefined) extraRows += buildInfoRow('Lossless', mt.audio_specs.is_lossless ? 'Yes (Lossless Master)' : 'No (Compressed Audio)');
			if (mt.metadata?.bpm) extraRows += buildInfoRow('BPM', String(mt.metadata.bpm));
			if (mt.metadata?.key) extraRows += buildInfoRow('Musical Key', String(mt.metadata.key));

			const art = window.MusicStore ? window.MusicStore.getBestArtwork(mt) : null;
			if (art) {
				const artUrl = window.MusicStore.toMediaUrl(art.path, 'media');
				previewHtml += `<img src="${artUrl}" class="info-thumbnail" alt="${element.name}">`;
			}
		}
		if (!element.readOnly && !element.musicTrack) {
			const preview = (element.content || '').replace(/<[^>]*>/g, ' ').trim().slice(0, 240);
			if (preview) previewHtml = `<div class="info-preview">${preview}${element.content.length > 240 ? '…' : ''}</div>`;
		}
	} else if (element instanceof Shortcut) {
		const resolved = element.resolve();
		extraRows += buildInfoRow('Target type', resolved ? (window.ShellAssociations ? window.ShellAssociations.getTypeLabel(resolved) : 'Item') : 'File or Folder');
		extraRows += buildInfoRow('Target location', resolved && resolved.parent ? resolved.parent.getFullPath() : '/');
		extraRows += buildInfoRow('Target', `<input type="text" class="xp-input" value="${element.targetPath}" readonly style="width: 100%; font-size: 11px;">`);
	} else if (element instanceof ProjectFile) {
		const project = element.projectData || {};
		extraRows += buildInfoRow('Category', (project.keywords || []).join(', ') || 'N/A');
		if (project.languages && project.languages.length) {
			extraRows += buildInfoRow('Languages', project.languages.join(', '));
		}
		if (project.link) extraRows += buildInfoRow('Link', `<a href="${project.link}" target="_blank">${project.link}</a>`);
		if (project.github) extraRows += buildInfoRow('GitHub', `<a href="${project.github}" target="_blank">${project.github}</a>`);
		const description = resolveLocalizedText(project.longDescription) || resolveLocalizedText(project.longDescrition) || resolveLocalizedText(project.description) || '';
		if (project.icon || project.image) previewHtml += `<img src="${project.icon || project.image}" class="info-thumbnail" alt="${element.name}">`;
		if (description) previewHtml += `<div class="info-preview">${description}</div>`;
	}

	const readOnlyCheckbox = (element instanceof File)
		? `<label class="xp-checkbox-row" style="margin: 0;"><input type="checkbox" id="prop-readonly-check" ${element.readOnly ? 'checked' : ''}> Read-only</label>`
		: '';

	const shortcutFindTargetBtn = (element instanceof Shortcut)
		? `<button type="button" class="xp-button-small" id="prop-btn-find-target" style="margin-top: 4px;">Find Target...</button>`
		: '';

	const contentHTML = `
		<div class="info-window-body" style="display: flex; flex-direction: column; height: 100%; box-sizing: border-box;">
			<div class="info-header">
				<img src="${element.icon}" alt="${element.name}" class="info-icon">
				<div class="info-title" style="flex: 1;">
					<input type="text" id="prop-filename-input" class="xp-input" value="${element.name}" style="width: 100%; font-weight: bold;">
				</div>
			</div>
			${previewHtml}
			<div class="info-rows" style="flex: 1;">
				${buildInfoRow('Type of file', typeLabel)}
				${buildInfoRow('Location', element.parent ? element.parent.getFullPath() : '/')}
				${buildInfoRow('Created', formatFullDate(element.createdAt))}
				${buildInfoRow('Modified', formatFullDate(element.modifiedAt))}
				${extraRows}
			</div>
			${shortcutFindTargetBtn}
			<fieldset class="xp-groupbox" style="margin-top: 8px; padding: 6px 10px;">
				<legend>Attributes</legend>
				<div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
					${readOnlyCheckbox}
					<label class="xp-checkbox-row" style="margin: 0;">
						<input type="checkbox" id="prop-hidden-check" ${element.hidden ? 'checked' : ''}> Hidden
					</label>
					<label class="xp-checkbox-row" style="margin: 0;">
						<input type="checkbox" id="prop-archive-check" ${element.attributes?.archive ? 'checked' : ''}> Archive
					</label>
				</div>
			</fieldset>
			<div style="display: flex; justify-content: flex-end; gap: 6px; margin-top: 12px;">
				<button type="button" class="xp-button" id="prop-btn-ok">OK</button>
				<button type="button" class="xp-button" id="prop-btn-cancel">Cancel</button>
				<button type="button" class="xp-button" id="prop-btn-apply" disabled>Apply</button>
			</div>
		</div>
	`;

	const bounds = (window.WindowManager && typeof window.WindowManager.getWorkspaceBounds === 'function') 
		? window.WindowManager.getWorkspaceBounds() 
		: { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight - 36, right: window.innerWidth, bottom: window.innerHeight - 36 };

	let targetX = options ? options.x : undefined;
	let targetY = options ? options.y : undefined;
	if (typeof targetX === 'number' && typeof targetY === 'number') {
		targetX = Math.max(bounds.left + 8, Math.min(targetX, bounds.right - 450 - 8));
		targetY = Math.max(bounds.top + 8, Math.min(targetY, bounds.bottom - 520 - 8));
	}

	const win = createXPWindow(id, `${element.name} Properties`, contentHTML, 450, 520, {
		iconSrc: element.icon,
		resizable: false,
		x: targetX,
		y: targetY
	});
	win.querySelector('.xp-window-content').style.padding = '0';
	win.querySelector('.xp-window-content').style.overflowX = 'hidden';

	const filenameInput = win.querySelector('#prop-filename-input');
	const hiddenCheck = win.querySelector('#prop-hidden-check');
	const readOnlyCheck = win.querySelector('#prop-readonly-check');
	const archiveCheck = win.querySelector('#prop-archive-check');
	const findTargetBtn = win.querySelector('#prop-btn-find-target');
	const okBtn = win.querySelector('#prop-btn-ok');
	const cancelBtn = win.querySelector('#prop-btn-cancel');
	const applyBtn = win.querySelector('#prop-btn-apply');

	const onChange = () => {
		if (applyBtn) applyBtn.disabled = false;
	};

	if (filenameInput) filenameInput.addEventListener('input', onChange);
	if (hiddenCheck) hiddenCheck.addEventListener('change', onChange);
	if (readOnlyCheck) readOnlyCheck.addEventListener('change', onChange);
	if (archiveCheck) archiveCheck.addEventListener('change', onChange);

	if (findTargetBtn && element instanceof Shortcut) {
		findTargetBtn.addEventListener('click', () => {
			const resolved = element.resolve();
			if (resolved) {
				if (resolved.parent && window.FileExplorer) {
					window.FileExplorer.open(resolved.parent);
				} else {
					openFileSystemElement(resolved);
				}
			} else {
				showXPDialog('Find Target', 'Target could not be located.', 'warning');
			}
		});
	}

	const applyProperties = () => {
		const newName = filenameInput ? filenameInput.value.trim() : element.name;
		if (newName && newName !== element.name) {
			try {
				element.rename(newName);
			} catch (e) {
				showXPDialog('Rename Error', e.message, 'error');
				return false;
			}
		}
		if (hiddenCheck) element.hidden = hiddenCheck.checked;
		if (readOnlyCheck && element instanceof File) element.readOnly = readOnlyCheck.checked;
		if (archiveCheck) {
			if (!element.attributes) element.attributes = {};
			element.attributes.archive = archiveCheck.checked;
		}
		fs.save();
		refreshUI();
		if (applyBtn) applyBtn.disabled = true;
		return true;
	};

	if (applyBtn) applyBtn.addEventListener('click', applyProperties);
	if (okBtn) {
		okBtn.addEventListener('click', () => {
			if (applyProperties()) {
				closeWindow(win, id);
			}
		});
	}
	if (cancelBtn) {
		cancelBtn.addEventListener('click', () => closeWindow(win, id));
	}
}

function openMailInfoWindow(message) {
	const id = `window-mailinfo-${message.id}`;
	const existingWindow = document.getElementById(id);
	if (existingWindow) {
		bringWindowToFront(existingWindow);
		return;
	}
	const folder = MailStore.getFolderById(message.folderId);
	const bodyPreview = (message.body || '').replace(/<[^>]*>/g, ' ').trim().slice(0, 240);
	const contentHTML = `
		<div class="info-window-body">
			<div class="info-header">
				<img src="https://api.iconify.design/mdi/email-outline.svg" alt="${message.subject}" class="info-icon">
				<div class="info-title">${message.subject || '(No subject)'}</div>
			</div>
			${bodyPreview ? `<div class="info-preview">${bodyPreview}${(message.body || '').length > 240 ? '…' : ''}</div>` : ''}
			<div class="info-rows">
				${buildInfoRow('From', `${message.from} &lt;${message.fromAddress || 'unknown'}&gt;`)}
				${message.to ? buildInfoRow('To', message.to) : ''}
				${buildInfoRow('Folder', folder ? folder.name : message.folderId)}
				${buildInfoRow('Date', formatFullDate(new Date(message.date)))}
				${buildInfoRow('Status', message.read ? 'Read' : 'Unread')}
				${buildInfoRow('Size', formatBytes(new TextEncoder().encode(message.body || '').length))}
			</div>
		</div>
	`;
	const win = createXPWindow(id, `${message.subject || '(No subject)'} - Properties`, contentHTML, 380, 400, {
		iconSrc: 'https://api.iconify.design/mdi/email-outline.svg',
		resizable: false
	});
	win.querySelector('.xp-window-content').style.padding = '0';
}

function updateOutlookUnreadBadge() {
	if (window.Taskbar && typeof window.Taskbar.updateUnreadBadges === 'function') {
		window.Taskbar.updateUnreadBadges();
	}
}

function setActiveWindow(win) {
	if (window.WindowManager) {
		window.WindowManager.setActive(win);
		activeWindow = window.WindowManager.activeWindow;
	}
}

function bringWindowToFront(win) {
	if (window.WindowManager) {
		window.WindowManager.bringToFront(win);
		activeWindow = window.WindowManager.activeWindow;
		zIndexCounter = window.WindowManager.zIndexCounter;
	}
}

function minimizeWindow(win, id) {
	if (window.WindowManager) {
		window.WindowManager.minimize(win, id);
		activeWindow = window.WindowManager.activeWindow;
	}
}

function unminimizeWindow(win) {
	if (window.WindowManager) {
		window.WindowManager.unminimize(win);
		activeWindow = window.WindowManager.activeWindow;
	}
}

function maximizeWindow(win) {
	if (window.WindowManager) {
		window.WindowManager.maximize(win);
	}
}

function closeWindow(win, id) {
	if (window.WindowManager) {
		window.WindowManager.close(win, id);
		activeWindow = window.WindowManager.activeWindow;
		openWindows = window.WindowManager.windows;
	}
}

function forceCloseWindow(win, id) {
	if (window.WindowManager) {
		window.WindowManager.forceClose(win, id);
		activeWindow = window.WindowManager.activeWindow;
		openWindows = window.WindowManager.windows;
	}
}

function openProjectWindow(project) {
	const projectTitle = resolveProjectTitle(project.title);
	const id = `window-${projectTitle.replace(/\s/g, '-')}`;

	const languageNames = {
		en: 'English', fr: 'French',
		de: 'German', es: 'Spanish',
		it: 'Italian', pt: 'Portuguese',
		la: 'Latin', zh: 'Chinese',
		ja: 'Japanese', ko: 'Korean',
		ru: 'Russian', ar: 'Arabic',
		nl: 'Dutch', pl: 'Polish',
		sv: 'Swedish', fi: 'Finnish'
	};

	const projectLangs = project.languages || [];
	let languagesHtml = '';
	if (projectLangs.length > 0) {
		const langList = projectLangs.map(l => languageNames[l] || l).join(', ');
		languagesHtml = `<p><strong>Languages:</strong> ${langList}</p>`;
	}

	const githubLink = project.github ? `
		<a href="${project.github}" target="_blank" class="xp-button project-link-button">
			<img src="https://img.icons8.com/fluent/24/000000/github.png" alt="GitHub">
			<span>GitHub</span>
		</a>` : '';

	const projectLink = project.link ? `
		<a href="${project.link}" target="_blank" class="xp-button project-link-button">
			<img src="https://www.svgrepo.com/show/326731/open-outline.svg" alt="Open">
			<span>Open in New Tab</span>
		</a>` : '';

	const runLink = project.link ? `
		<button class="xp-button project-link-button run-project-btn">
			<img src="https://api.iconify.design/mdi/play-box-outline.svg" alt="Run">
			<span>Run Application</span>
		</button>` : '';

	const fullDescription = resolveLocalizedText(project.longDescription) 
		|| resolveLocalizedText(project.longDescrition) 
		|| resolveLocalizedText(project.description) 
		|| 'No description available.';

	const content = `
		<div class="project-view-layout">
			<div class="project-view-sidebar">
				<div class="project-view-image-container">
					<img src="${project.icon || project.image || '../assets/images/desk/icons/File.webp'}" alt="${projectTitle}" class="project-view-image">
				</div>
				<h4>Quick Links</h4>
				<div class="project-view-links">
					${runLink}
					${projectLink}
					${githubLink}
				</div>
				<div class="project-details">
					<h4>Details</h4>
					<p><strong>Category:</strong> ${project.keywords ? project.keywords.join(', ') : 'N/A'}</p>
					${languagesHtml}
				</div>
			</div>
			<div class="project-view-main">
				<h2>${projectTitle}</h2>
				<p class="project-long-description">${fullDescription}</p>
			</div>
			<div class="project-view-statusbar">
				<span>Ready</span>
				<span class="status-separator"></span>
				<span>${projectTitle}</span>
			</div>
		</div>
	`;

	addToRecentDocs({ name: projectTitle, icon: project.icon, type: 'project', path: `project://${projectTitle}` });
	try {
		const viewed = JSON.parse(localStorage.getItem('xp_viewed_projects') || '[]');
		if (!viewed.includes(projectTitle)) {
			viewed.push(projectTitle);
			localStorage.setItem('xp_viewed_projects', JSON.stringify(viewed));
		}
		if (window.AchievementsManager) {
			window.AchievementsManager.setProgress('portfolio_explorer', viewed.length);
		}
	} catch (e) {}
	const projectWindow = createXPWindow(id, projectTitle, content, 700, 500, { iconSrc: project.icon });
	projectWindow.querySelector('.xp-window-content').style.padding = '0';
	projectWindow.classList.add('project-window');

	const runBtn = projectWindow.querySelector('.run-project-btn');
	if (runBtn) {
		runBtn.addEventListener('click', () => {
			const appId = `app-running-${projectTitle.replace(/\s/g, '-')}-${Date.now()}`;
			const appContent = `<iframe src="${project.link}" style="width: 100%; height: 100%; border: none;"></iframe>`;
			const appWindow = createXPWindow(appId, projectTitle, appContent, 800, 600, { iconSrc: project.icon });
			appWindow.querySelector('.xp-window-content').style.padding = '0';
			appWindow.querySelector('.xp-window-content').style.overflow = 'hidden';
		});
	}
}

function setupCalendar() {
	if (window.Taskbar && typeof window.Taskbar.renderCalendar === 'function') {
		window.Taskbar.renderCalendar();
	}
}

async function openWinamp(targetTrack = null) {
	if (window.MusicStore && !window.MusicStore.isReady()) {
		try {
			await window.MusicStore.init();
		} catch (e) {}
	}

	let trackToPlay = null;
	if (targetTrack && window.MusicStore) {
		trackToPlay = window.MusicStore.resolveWebampTrack(targetTrack);
	}

	if (webampInstance) {
		try {
			webampInstance.reopen();
			if (trackToPlay) {
				if (typeof webampInstance.setTracksToPlay === 'function') {
					webampInstance.setTracksToPlay([trackToPlay]);
				} else if (typeof webampInstance.appendTracks === 'function') {
					webampInstance.appendTracks([trackToPlay]);
				}
				if (typeof webampInstance.play === 'function') {
					webampInstance.play();
				}
			}
			if (window.Taskbar) {
				window.Taskbar.setActiveButton('window-winamp');
			}
			return;
		} catch (e) {
			webampInstance = null;
		}
	}

	const Webamp = window.Webamp;
	if (!Webamp) {
		if (window.MediaPlayerApp) {
			window.MediaPlayerApp.open(targetTrack);
			return;
		}
		showXPDialog('Error', 'Winamp library failed to load.', 'error');
		return;
	}

	let initialTracks = [];
	if (window.MusicStore) {
		const all = window.MusicStore.getAllWebampTracks(false);
		if (trackToPlay) {
			initialTracks.push(trackToPlay);
			all.forEach(t => {
				if (t.url !== trackToPlay.url) {
					initialTracks.push(t);
				}
			});
		} else {
			initialTracks = all;
		}
	}

	if (initialTracks.length === 0) {
		if (trackToPlay) {
			initialTracks.push(trackToPlay);
		} else {
			initialTracks = [{
				metaData: {
					artist: "Wartets",
					title: "Projet 8.4"
				},
				url: "assets/musics/Projet_8.4.mp3",
				duration: 4.333
			}];
		}
	}

	let webampHolder = document.getElementById('webamp-holder');
	if (!webampHolder) {
		webampHolder = document.createElement('div');
		webampHolder.id = 'webamp-holder';
		webampHolder.style.position = 'absolute';
		const baseZ = Math.min(48000, (window.WindowManager ? window.WindowManager.zIndexCounter + 1 : 200));
		webampHolder.style.zIndex = String(baseZ);
		document.body.appendChild(webampHolder);

		webampHolder.addEventListener('mousedown', () => {
			if (window.WindowManager) {
				window.WindowManager.zIndexCounter = Math.min(48000, window.WindowManager.zIndexCounter + 1);
				webampHolder.style.zIndex = String(window.WindowManager.zIndexCounter);
				if (webampInstance && typeof webampInstance.reopen === 'function') {
					const rootWebamp = document.getElementById('webamp');
					if (rootWebamp) rootWebamp.style.zIndex = String(window.WindowManager.zIndexCounter);
				}
			}
		});
	}

	try {
		const currentZ = Math.min(48000, (window.WindowManager ? window.WindowManager.zIndexCounter + 1 : 200));
		if (window.WindowManager) window.WindowManager.zIndexCounter = currentZ;
		webampHolder.style.zIndex = String(currentZ);

		webampInstance = new Webamp({
			initialTracks: initialTracks,
			zIndex: currentZ
		});

		if (window.Taskbar) {
			const btn = window.Taskbar.addWindowButton('window-winamp', 'Winamp', '../assets/images/desk/icons/Winamp.webp');
			if (btn) {
				btn.addEventListener('click', () => {
					if (webampInstance) {
						webampInstance.reopen();
						window.Taskbar.setActiveButton('window-winamp');
					}
				});
			}
		}

		webampInstance.onClose(() => {
			if (window.Taskbar) {
				window.Taskbar.removeWindowButton('window-winamp');
			}
			if (webampInstance) {
				webampInstance.dispose();
				webampInstance = null;
			}
		});

		webampInstance.onMinimize(() => {
			if (window.Taskbar) {
				const btn = document.querySelector('.taskbar-window-btn[data-window-id="window-winamp"]');
				if (btn) btn.classList.remove('active');
			}
		});

		webampInstance.onTrackDidChange((track) => {
			if (track && track.title && window.Taskbar) {
				window.Taskbar.updateWindowButton('window-winamp', `${track.title} - Winamp`, '../assets/images/desk/icons/Winamp.webp');
			}
			if (window.AchievementsManager) {
				window.AchievementsManager.progress('winamp_master', 1);
				window.AchievementsManager.progress('first_music_track', 1);
			}
		});

		let winampPlayTimer = setInterval(() => {
			if (!webampInstance) {
				clearInterval(winampPlayTimer);
				return;
			}
			if (webampInstance.getMediaStatus && webampInstance.getMediaStatus() === 'PLAYING') {
				let totalSecs = parseInt(localStorage.getItem('xp_music_playback_seconds') || '0', 10) + 1;
				localStorage.setItem('xp_music_playback_seconds', String(totalSecs));
				if (window.AchievementsManager) {
					window.AchievementsManager.setProgress('music_ten_minutes', totalSecs);
					window.AchievementsManager.progress('first_music_track', 1);
				}
			}
		}, 1000);

		webampInstance.renderWhenReady(webampHolder);
	} catch (err) {
		webampInstance = null;
		if (window.MediaPlayerApp) {
			window.MediaPlayerApp.open(targetTrack);
		}
	}

	if (trackToPlay) {
		setTimeout(() => {
			if (webampInstance && typeof webampInstance.play === 'function') {
				webampInstance.play();
			}
		}, 300);
	}
}

function openMinesweeper() {
	if (window.DeskAppRegistry) {
		return window.DeskAppRegistry.launch('minesweeper');
	}
	if (window.MinesweeperApp && typeof window.MinesweeperApp.open === 'function') {
		return window.MinesweeperApp.open();
	}
	return null;
}

function openSolitaire() {
	if (window.DeskAppRegistry) {
		return window.DeskAppRegistry.launch('solitaire');
	}
	if (window.SolitaireApp && typeof window.SolitaireApp.open === 'function') {
		return window.SolitaireApp.open();
	}
	return null;
}

function renderCalendar(year, month) {
	if (window.Taskbar && typeof window.Taskbar.renderCalendar === 'function') {
		window.Taskbar.renderCalendar();
	}
}

let anecdotesRegistryPromise = null;

function getAnecdotesRegistry() {
	if (!anecdotesRegistryPromise) {
		anecdotesRegistryPromise = import('/js/anecdotes/loader.js').then(({ loadRegistry }) => loadRegistry());
	}
	return anecdotesRegistryPromise;
}

function toISODateKeyUTC(dateUTC) {
	return `${dateUTC.getUTCFullYear()}-${String(dateUTC.getUTCMonth() + 1).padStart(2, '0')}-${String(dateUTC.getUTCDate()).padStart(2, '0')}`;
}

async function openAnecdoteWindow(dateUTC) {
	if (window.AchievementsManager) {
		window.AchievementsManager.progress('anecdote_reader', 1);
		if (dateUTC.getUTCFullYear() === 2005 && dateUTC.getUTCMonth() === 4 && dateUTC.getUTCDate() === 30) {
			window.AchievementsManager.progress('calendar_secret_date', 1);
		}
	}
	const id = `window-anecdote-${toISODateKeyUTC(dateUTC)}`;
	const existingWindow = document.getElementById(id);
	if (existingWindow) {
		bringWindowToFront(existingWindow);
		return;
	}

	const dateLabel = dateUTC.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
	const win = createXPWindow(id, `Anecdote - ${dateLabel}`, '<div style="padding:15px; font-size:12px;">Loading...</div>', 420, 260, {
		iconSrc: '../assets/images/desk/icons/Calendar.webp',
		resizable: false
	});

	const content = win.querySelector('.xp-window-content');

	try {
		const [{ resolveEntryForDate }, { getFullEntry }, registry] = await Promise.all([
			import('/js/anecdotes/debug/engine.js'),
			import('/js/anecdotes/debug/entry-cache.js'),
			getAnecdotesRegistry()
		]);

		const { registryEntry } = resolveEntryForDate(dateUTC, registry);

		if (!registryEntry) {
			content.innerHTML = '<div style="padding:15px; font-size:12px;">No anecdote available for this date.</div>';
			return;
		}

		const fullEntry = await getFullEntry(registryEntry, 'en');

		if (!document.getElementById(id)) return;

		const domainText = (fullEntry.domain && (fullEntry.domain.en || fullEntry.domain.fr)) || '';
		let contentText = '';
		try {
			contentText = typeof fullEntry.content === 'function'
				? fullEntry.content('en', dateUTC.getUTCFullYear(), dateUTC)
				: (fullEntry.content && (fullEntry.content.en || fullEntry.content.fr)) || '';
		} catch (error) {
			contentText = 'This anecdote could not be rendered.';
		}

		content.innerHTML = `
			<div style="padding:15px; font-family: Arial, sans-serif; font-size: 13px; line-height: 1.5; color: var(--xp-font-color);">
				<div style="font-size: 11px; text-transform: uppercase; color: #555; margin-bottom: 8px; font-family: 'Roboto Mono', monospace; letter-spacing: 0.05em;">${domainText}</div>
				<div>${contentText}</div>
			</div>
		`;
	} catch (error) {
		content.innerHTML = '<div style="padding:15px; font-size:12px;">Unable to load the anecdote for this date.</div>';
	}
}

function openAllProjectsFolder() {
	const projectsFolder = new Folder("My Projects");
	const projectsShortcuts = new Folder("All Project Shortcuts");

	const findProjects = (folder) => {
		folder.children.forEach(child => {
			if (child instanceof ProjectFile) {
				const shortcut = new Shortcut(
					child.name,
					null,
					child.getFullPath(),
					child.icon
				);
				shortcut.createdAt = child.createdAt;
				projectsShortcuts.add(shortcut);
			} else if (child instanceof Folder) {
				findProjects(child);
			}
		});
	};

	findProjects(fs.root);
	projectsFolder.add(projectsShortcuts);

	if (window.FileExplorer) {
		window.FileExplorer.open(projectsFolder);
	}
}

function openFilteredProjectsFolder(category) {
	const catFolder = new Folder(`${category.charAt(0).toUpperCase() + category.slice(1)} Projects`);

	const flattenedProjects = [];
	projects.forEach(projectGroup => {
		const projectsInGroup = Array.isArray(projectGroup) ? projectGroup : [projectGroup];
		projectsInGroup.forEach(p => {
			if (typeof p === 'object' && p !== null && p.keywords && p.keywords.includes(category)) {
				flattenedProjects.push(p);
			}
		});
	});

	flattenedProjects.forEach(p => {
		const title = resolveProjectTitle(p.title);
		const pf = new ProjectFile(title, null, p);
		catFolder.add(pf);
	});

	if (window.FileExplorer) {
		window.FileExplorer.open(catFolder);
	}
}

function setupDesktopContextMenu() {
	const desktop = document.getElementById('desktop');

	desktop.addEventListener('contextmenu', (e) => {
		if (e.target === desktop || e.target.id === 'project-icons-container') {
			e.preventDefault();
			clearIconSelections();
			if (window.ContextMenu) {
				const items = window.ContextMenu.getDesktopItems('/');
				window.ContextMenu.show(items, e.clientX, e.clientY);
			}
		}
	});

	document.addEventListener('mousedown', (e) => {
		if (!e.target.closest('.project-icon') && !e.target.closest('.xp-context-menu')) {
			clearIconSelections();
		}
	});
}

function openFileSystemElement(element, windowContext = null) {
	if (!element) return;
	let targetElement = element;
	if (typeof element === 'string' && fs) {
		const normalized = VFSPath.normalize(element);
		targetElement = fs.findByPath(normalized);
	}
	if (!targetElement) return;

	if (targetElement instanceof File) {
		addToRecentDocs({ name: targetElement.name, icon: targetElement.icon, type: 'file', path: targetElement.getFullPath() });
	}

	if (window.ShellAssociations) {
		window.ShellAssociations.open(targetElement, windowContext);
	} else {
		if (targetElement instanceof Folder && window.FileExplorer) {
			window.FileExplorer.open(targetElement);
		} else if (targetElement instanceof File && window.NotepadApp) {
			window.NotepadApp.open(targetElement);
		}
	}
}

function refreshUI() {
	if (!fs || !fs.root) return;
	renderDesktopIcons();
	Object.values(openWindows).forEach(win => {
		if (win.classList.contains('xp-explorer-window') && win.explorerState && window.FileExplorer) {
			if (win.explorerState.isRecycleBin) {
				window.FileExplorer.updateView(win, true);
			} else if (win.explorerState.currentFolder) {
				const currentPath = typeof win.explorerState.currentFolder.getFullPath === 'function' 
					? win.explorerState.currentFolder.getFullPath() 
					: '/';
				const folder = fs.findByPath(currentPath);
				if (folder) {
					win.explorerState.currentFolder = folder;
				}
				window.FileExplorer.updateView(win, true);
				if (win.explorerState.sidebarMode === 'tree') {
					window.FileExplorer.renderFolderTree(win);
				}
			}
		}
	});
}

function arrangeIcons(sortBy = 'none') {
	const container = document.getElementById('project-icons-container');
	if (!container) return;
	const icons = Array.from(container.children).filter(el => el.classList.contains('project-icon'));
	if (icons.length === 0) return;

	const customGapX = window.SettingsApp ? (window.SettingsApp.get('desktopGridSpacingX') || 75) : 75;
	const customGapY = window.SettingsApp ? (window.SettingsApp.get('desktopGridSpacingY') || 100) : 100;
	const iconWidth = customGapX;
	const iconHeight = customGapY;
	const startX = 10;
	const startY = 10;
	const bounds = (window.WindowManager && typeof window.WindowManager.getWorkspaceBounds === 'function') 
		? window.WindowManager.getWorkspaceBounds() 
		: { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight - 40 };
	const desktopWidth = bounds.width;
	const desktopHeight = bounds.height;

	const gridDirection = (window.SettingsApp && window.SettingsApp.get('desktopGridDirection')) || 'top-to-bottom';
	const gridOrigin = (window.SettingsApp && window.SettingsApp.get('desktopGridOrigin')) || 'top-left';

	const iconsPerColumn = Math.max(1, Math.floor((desktopHeight - startY) / iconHeight));
	const iconsPerRow = Math.max(1, Math.floor((desktopWidth - startX) / (iconWidth + 10)));

	const autoArrange = isAutoArrangeEnabled();
	const alignGrid = isAlignToGridEnabled();
	const positions = loadDesktopIconPositions();

	const computeSlotCoords = (col, row) => {
		let posX = startX + col * (iconWidth + 10);
		let posY = startY + row * iconHeight;

		if (gridOrigin === 'top-right') {
			posX = (desktopWidth - startX - iconWidth) - col * (iconWidth + 10);
			posY = startY + row * iconHeight;
		} else if (gridOrigin === 'bottom-left') {
			posX = startX + col * (iconWidth + 10);
			posY = (desktopHeight - startY - iconHeight) - row * iconHeight;
		} else if (gridOrigin === 'bottom-right') {
			posX = (desktopWidth - startX - iconWidth) - col * (iconWidth + 10);
			posY = (desktopHeight - startY - iconHeight) - row * iconHeight;
		}

		posX = Math.max(10, Math.min(posX, desktopWidth - iconWidth - 10));
		posY = Math.max(10, Math.min(posY, desktopHeight - iconHeight - 10));
		return { x: posX, y: posY };
	};

	if (sortBy !== 'none' || autoArrange) {
		const getElement = (icon) => {
			const path = icon.dataset.path;
			if (path && path.startsWith('app://')) {
				return { name: icon.querySelector('span')?.textContent || '', createdAt: new Date(0) };
			}
			return fs ? fs.findByPath(path) : null;
		};

		const effectiveSort = (sortBy !== 'none') ? sortBy : 'name';

		icons.sort((a, b) => {
			const elementA = getElement(a);
			const elementB = getElement(b);
			if (!elementA || !elementB) return 0;

			if (effectiveSort === 'name') {
				return elementA.name.localeCompare(elementB.name);
			} else if (effectiveSort === 'date') {
				return new Date(elementB.createdAt) - new Date(elementA.createdAt);
			} else if (effectiveSort === 'size') {
				const sizeA = elementA.calculateSize ? elementA.calculateSize() : (elementA.size || 0);
				const sizeB = elementB.calculateSize ? elementB.calculateSize() : (elementB.size || 0);
				return sizeB - sizeA || elementA.name.localeCompare(elementB.name);
			} else if (effectiveSort === 'type') {
				const typeRank = { folder: 0, project: 1, shortcut: 2, file: 3, application: 4 };
				const rankA = typeRank[a.dataset.type] ?? 5;
				const rankB = typeRank[b.dataset.type] ?? 5;
				return (rankA - rankB) || elementA.name.localeCompare(elementB.name);
			}
			return 0;
		});

		const newPositions = {};
		icons.forEach((icon, index) => {
			let col = 0;
			let row = 0;
			if (gridDirection === 'left-to-right') {
				row = Math.floor(index / iconsPerRow);
				col = index % iconsPerRow;
			} else {
				col = Math.floor(index / iconsPerColumn);
				row = index % iconsPerColumn;
			}

			const coords = computeSlotCoords(col, row);

			icon.style.position = 'absolute';
			icon.style.left = `${coords.x}px`;
			icon.style.top = `${coords.y}px`;

			if (icon.dataset.path) {
				newPositions[icon.dataset.path] = { x: coords.x, y: coords.y };
			}
		});
		saveDesktopIconPositions(newPositions);
	} else {
		const occupiedGridSlots = new Set();
		let unpositionedIndex = 0;

		icons.forEach((icon) => {
			const path = icon.dataset.path;
			let pos = path ? positions[path] : null;

			if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
				let posX = pos.x;
				let posY = pos.y;
				if (alignGrid) {
					posX = startX + Math.round((posX - startX) / (iconWidth + 10)) * (iconWidth + 10);
					posY = startY + Math.round((posY - startY) / iconHeight) * iconHeight;
				}
				posX = Math.max(10, Math.min(posX, desktopWidth - iconWidth - 10));
				posY = Math.max(10, Math.min(posY, desktopHeight - iconHeight - 10));

				icon.style.position = 'absolute';
				icon.style.left = `${posX}px`;
				icon.style.top = `${posY}px`;

				const colSlot = Math.round((posX - startX) / (iconWidth + 10));
				const rowSlot = Math.round((posY - startY) / iconHeight);
				occupiedGridSlots.add(`${colSlot},${rowSlot}`);
			} else {
				let col = 0;
				let row = 0;
				if (gridDirection === 'left-to-right') {
					while (occupiedGridSlots.has(`${unpositionedIndex % iconsPerRow},${Math.floor(unpositionedIndex / iconsPerRow)}`)) {
						unpositionedIndex++;
					}
					row = Math.floor(unpositionedIndex / iconsPerRow);
					col = unpositionedIndex % iconsPerRow;
				} else {
					while (occupiedGridSlots.has(`${Math.floor(unpositionedIndex / iconsPerColumn)},${unpositionedIndex % iconsPerColumn}`)) {
						unpositionedIndex++;
					}
					col = Math.floor(unpositionedIndex / iconsPerColumn);
					row = unpositionedIndex % iconsPerColumn;
				}

				const coords = computeSlotCoords(col, row);

				icon.style.position = 'absolute';
				icon.style.left = `${coords.x}px`;
				icon.style.top = `${coords.y}px`;

				occupiedGridSlots.add(`${col},${row}`);
				if (path) {
					positions[path] = { x: coords.x, y: coords.y };
				}
				unpositionedIndex++;
			}
		});
		saveDesktopIconPositions(positions);
	}
}

function checkAndDisplayMobileWarning() {
	const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
	const isSmallViewport = window.innerWidth < 768 || window.innerHeight < 520;
	if (!isTouch && !isSmallViewport) return;

	if (sessionStorage.getItem('xp_mobile_warned') === 'true') return;

	const overlay = document.createElement('div');
	overlay.className = 'xp-mobile-dialog-overlay';

	overlay.innerHTML = `
		<div class="xp-mobile-dialog-window">
			<div class="xp-mobile-dialog-header">
				<span>Windows XP Compatibility Warning</span>
			</div>
			<div class="xp-mobile-dialog-body">
				<img src="https://api.iconify.design/mdi/alert.svg?color=%23e68a00" class="xp-mobile-dialog-icon" alt="">
				<div>
					<strong>Mobile / Touchscreen Device Detected</strong><br><br>
					This interactive portfolio is structured as a full desktop workstation simulation optimized for computers with physical keyboard, mouse controls, and high-resolution displays.<br><br>
					Touch screen controls, small displays, or mobile browsers may encounter layout restrictions or navigation difficulties.
				</div>
			</div>
			<div class="xp-mobile-dialog-footer">
				<button type="button" class="xp-button" id="mobile-warn-continue-btn">Continue to Desktop</button>
				<button type="button" class="xp-button" id="mobile-warn-portfolio-btn">Standard Web Version</button>
			</div>
		</div>
	`;

	document.body.appendChild(overlay);

	overlay.querySelector('#mobile-warn-continue-btn').addEventListener('click', () => {
		sessionStorage.setItem('xp_mobile_warned', 'true');
		overlay.remove();
		if (window.SettingsApp && window.SettingsApp.playSound) {
			window.SettingsApp.playSound('click');
		}
	});

	overlay.querySelector('#mobile-warn-portfolio-btn').addEventListener('click', () => {
		window.location.href = 'https://wartets.github.io/';
	});
}

let currentDragTargetElement = null;

function clearAllDropTargets() {
	document.querySelectorAll('.drop-target').forEach(el => el.classList.remove('drop-target'));
	currentDragTargetElement = null;
}

function handleDragStart(e) {
	const icon = e.target.closest('.project-icon, .xp-details-row, .xp-explorer-item');
	if (!icon) return;

	if (!icon.classList.contains('selected') && !e.ctrlKey) {
		clearIconSelections();
		icon.classList.add('selected');
		selectedIcons.add(icon);
	}

	const iconRect = icon.getBoundingClientRect();
	desktopDragOffset = {
		x: e.clientX - iconRect.left,
		y: e.clientY - iconRect.top
	};

	const dragAnchorPath = icon.dataset.path;
	const positions = loadDesktopIconPositions();
	const anchorPos = positions[dragAnchorPath] || { x: iconRect.left, y: iconRect.top };

	const dragItems = [];
	const win = icon.closest('.xp-window');
	const state = win && win.explorerState ? win.explorerState : null;
	const selectedSet = state && state.selectedItems ? state.selectedItems : selectedIcons;

	selectedSet.forEach(selected => {
		const p = selected.dataset.path;
		if (p) {
			selected.classList.add('dragging-icon');
			const pos = positions[p] || { x: selected.offsetLeft || 0, y: selected.offsetTop || 0 };
			dragItems.push({
				path: p,
				relX: pos.x - anchorPos.x,
				relY: pos.y - anchorPos.y
			});
		}
	});

	if (dragItems.length === 0) {
		const singlePath = icon.dataset.path;
		if (singlePath) {
			icon.classList.add('dragging-icon');
			dragItems.push({ path: singlePath, relX: 0, relY: 0 });
		}
	}

	if (dragItems.length === 0) {
		e.preventDefault();
		return;
	}

	e.dataTransfer.effectAllowed = 'copyMove';
	e.dataTransfer.setData('text/plain', JSON.stringify(dragItems.map(d => d.path)));
	e.dataTransfer.setData('application/json', JSON.stringify({
		anchorPath: dragAnchorPath,
		items: dragItems
	}));
}

function handleDragOver(e) {
	const hasPaths = e.dataTransfer.types.includes('text/plain');
	if (!hasPaths) return;

	e.preventDefault();
	e.stopPropagation();
	e.dataTransfer.dropEffect = e.ctrlKey ? 'copy' : 'move';

	const iconTarget = e.target.closest('.project-icon, .xp-details-row, .xp-explorer-item');
	const treeNode = e.target.closest('.xp-tree-node');
	const folderContent = e.target.closest('.folder-content');
	const folderWrapper = e.target.closest('.folder-content-wrapper, .xp-explorer-view-container');
	const desktopTarget = e.target.closest('#desktop, #project-icons-container');
	const recycleWindow = e.target.closest('#window-recycle-bin');

	let dropCandidate = null;

	if (treeNode) {
		dropCandidate = treeNode;
	} else if (iconTarget) {
		const isFolder = iconTarget.dataset.type === 'folder' || (iconTarget.dataset.path && fs && fs.findByPath(iconTarget.dataset.path) instanceof Folder);
		const isRecycle = iconTarget.dataset.systemType === 'recycle-bin' || iconTarget.dataset.path === 'app://recycle-bin';
		if (isFolder || isRecycle) {
			dropCandidate = iconTarget;
		} else if (folderContent) {
			dropCandidate = folderContent;
		} else {
			dropCandidate = document.getElementById('project-icons-container');
		}
	} else if (recycleWindow) {
		dropCandidate = recycleWindow.querySelector('#recycle-bin-content') || recycleWindow;
	} else if (folderContent) {
		dropCandidate = folderContent;
	} else if (folderWrapper) {
		dropCandidate = folderWrapper.querySelector('.folder-content') || folderWrapper;
	} else if (desktopTarget) {
		dropCandidate = document.getElementById('project-icons-container');
	}

	if (currentDragTargetElement && currentDragTargetElement !== dropCandidate) {
		currentDragTargetElement.classList.remove('drop-target');
	}

	if (dropCandidate) {
		dropCandidate.classList.add('drop-target');
		currentDragTargetElement = dropCandidate;
	}
}

function handleDragLeave(e) {
	const related = e.relatedTarget;
	const current = e.currentTarget;
	if (!current.contains(related)) {
		current.classList.remove('drop-target');
		if (currentDragTargetElement === current) {
			currentDragTargetElement = null;
		}
	}
}

function handleDragEnd(e) {
	document.querySelectorAll('.dragging-icon').forEach(icon => {
		icon.classList.remove('dragging-icon');
	});
	clearAllDropTargets();
}

function resolveDropDestination(dropTarget) {
	if (!dropTarget) return null;

	const treeNode = dropTarget.closest('.xp-tree-node');
	if (treeNode) {
		const treePath = treeNode.dataset.path;
		if (treePath) return { type: 'folder', path: treePath };
	}

	const iconCandidate = dropTarget.closest('.project-icon, .xp-details-row, .xp-explorer-item');
	if (iconCandidate) {
		if (iconCandidate.dataset.systemType === 'recycle-bin' || iconCandidate.dataset.path === 'app://recycle-bin') {
			return { type: 'recycle' };
		}
		if (iconCandidate.dataset.type === 'folder' || iconCandidate.querySelector('.col-type')?.textContent.includes('Folder')) {
			return { type: 'folder', path: iconCandidate.dataset.path };
		}
		const el = iconCandidate.dataset.path ? fs.findByPath(iconCandidate.dataset.path) : null;
		if (el instanceof Folder) {
			return { type: 'folder', path: el.getFullPath() };
		}
	}

	const recycleWin = dropTarget.closest('#window-recycle-bin');
	if (recycleWin) {
		return { type: 'recycle' };
	}

	const folderContent = dropTarget.closest('.folder-content');
	if (folderContent) {
		const win = folderContent.closest('.xp-window');
		if (win && win.id === 'window-recycle-bin') {
			return { type: 'recycle' };
		}
		return { type: 'folder', path: folderContent.dataset.path || '/' };
	}

	const folderWrapper = dropTarget.closest('.folder-content-wrapper, .xp-explorer-view-container');
	if (folderWrapper) {
		const win = folderWrapper.closest('.xp-window');
		if (win && win.id === 'window-recycle-bin') {
			return { type: 'recycle' };
		}
		const inner = folderWrapper.querySelector('.folder-content');
		return { type: 'folder', path: (inner && inner.dataset.path) ? inner.dataset.path : '/' };
	}

	const addressRow = dropTarget.closest('.xp-explorer-addressbar-row, .folder-address-bar-container');
	if (addressRow) {
		const win = addressRow.closest('.xp-window');
		if (win && win.explorerState && win.explorerState.currentFolder) {
			return { type: 'folder', path: win.explorerState.currentFolder.getFullPath() };
		}
	}

	if (dropTarget.id === 'desktop' || dropTarget.id === 'project-icons-container' || dropTarget.closest('#desktop')) {
		return { type: 'folder', path: '/' };
	}

	return { type: 'folder', path: '/' };
}

function handleDrop(e) {
	e.preventDefault();
	e.stopPropagation();

	const target = currentDragTargetElement || e.currentTarget;
	clearAllDropTargets();

	const dataRaw = e.dataTransfer.getData('text/plain');
	if (!dataRaw) return;

	let sourcePaths = [];
	try {
		sourcePaths = JSON.parse(dataRaw);
	} catch (err) {
		return;
	}

	if (!Array.isArray(sourcePaths) || sourcePaths.length === 0) return;

	const destination = resolveDropDestination(target);
	if (!destination) return;

	if (destination.type === 'recycle') {
		sourcePaths.forEach(src => {
			if (src.startsWith('app://')) return;
			try {
				fs.moveToRecycleBin(src);
			} catch (err) {
				showXPDialog('Recycle Bin', err.message, 'error');
			}
		});
		if (window.SettingsApp && window.SettingsApp.playSound) {
			window.SettingsApp.playSound('recycle');
		}
		refreshUI();
		const rbWindow = document.getElementById('window-recycle-bin');
		if (rbWindow) renderRecycleBinContent(rbWindow);
		return;
	}

	const isDesktopDrop = (target.id === 'desktop' || target.id === 'project-icons-container' || target.closest('#desktop'));
	const destFolder = fs.findByPath(destination.path);
	if (!destFolder || !(destFolder instanceof Folder)) {
		return;
	}

	const isCopy = e.ctrlKey;
	const destFullPath = destFolder.getFullPath();

	const desktopContainer = document.getElementById('project-icons-container');
	const containerRect = desktopContainer ? desktopContainer.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight - 40 };

	const customGapX = window.SettingsApp ? (window.SettingsApp.get('desktopGridSpacingX') || 75) : 75;
	const customGapY = window.SettingsApp ? (window.SettingsApp.get('desktopGridSpacingY') || 100) : 100;
	const iconWidth = customGapX;
	const iconHeight = customGapY;

	let baseDropX = e.clientX - containerRect.left - (desktopDragOffset.x || Math.round(iconWidth / 2));
	let baseDropY = e.clientY - containerRect.top - (desktopDragOffset.y || 20);

	baseDropX = Math.max(10, Math.min(baseDropX, containerRect.width - iconWidth - 10));
	baseDropY = Math.max(10, Math.min(baseDropY, containerRect.height - iconHeight - 10));

	if (isAlignToGridEnabled()) {
		const startX = 10;
		const startY = 10;
		baseDropX = startX + Math.round((baseDropX - startX) / (iconWidth + 10)) * (iconWidth + 10);
		baseDropY = startY + Math.round((baseDropY - startY) / iconHeight) * iconHeight;
		baseDropX = Math.max(10, Math.min(baseDropX, containerRect.width - iconWidth - 10));
		baseDropY = Math.max(10, Math.min(baseDropY, containerRect.height - iconHeight - 10));
	}

	const positions = loadDesktopIconPositions();
	let geometryPayload = null;
	try {
		const jsonRaw = e.dataTransfer.getData('application/json');
		if (jsonRaw) geometryPayload = JSON.parse(jsonRaw);
	} catch (err) {}

	const gridStepX = iconWidth + 10;
	const gridStepY = iconHeight;
	const startX = 10;
	const startY = 10;
	const maxX = containerRect.width - iconWidth - 10;
	const maxY = containerRect.height - iconHeight - 10;

	const occupiedSlots = new Set();
	Object.entries(positions).forEach(([p, pos]) => {
		if (!sourcePaths.includes(p) && typeof pos.x === 'number' && typeof pos.y === 'number') {
			const col = Math.round((pos.x - startX) / gridStepX);
			const row = Math.round((pos.y - startY) / gridStepY);
			occupiedSlots.add(`${col},${row}`);
		}
	});

	const findNearestFreeSlot = (initX, initY) => {
		let col = Math.round((initX - startX) / gridStepX);
		let row = Math.round((initY - startY) / gridStepY);
		const maxRows = Math.max(1, Math.floor((maxY - startY) / gridStepY));

		if (!occupiedSlots.has(`${col},${row}`)) {
			occupiedSlots.add(`${col},${row}`);
			const clampedX = Math.max(startX, Math.min(startX + col * gridStepX, maxX));
			const clampedY = Math.max(startY, Math.min(startY + row * gridStepY, maxY));
			return { x: clampedX, y: clampedY };
		}

		for (let dist = 1; dist < 50; dist++) {
			for (let dRow = -dist; dRow <= dist; dRow++) {
				for (let dCol = -dist; dCol <= dist; dCol++) {
					const c = col + dCol;
					const r = row + dRow;
					if (c >= 0 && r >= 0 && r <= maxRows && !occupiedSlots.has(`${c},${r}`)) {
						occupiedSlots.add(`${c},${r}`);
						const finalX = Math.max(startX, Math.min(startX + c * gridStepX, maxX));
						const finalY = Math.max(startY, Math.min(startY + r * gridStepY, maxY));
						return { x: finalX, y: finalY };
					}
				}
			}
		}
		return { x: initX, y: initY };
	};

	const alignGrid = isAlignToGridEnabled();

	const previousLayoutSnapshot = JSON.parse(JSON.stringify(positions));

	sourcePaths.forEach((src) => {
		const isAppIcon = src.startsWith('app://');
		let element = null;
		if (!isAppIcon) {
			element = fs.findByPath(src);
			if (!element) return;
		}

		let relX = 0;
		let relY = 0;
		if (geometryPayload && Array.isArray(geometryPayload.items)) {
			const match = geometryPayload.items.find(i => i.path === src);
			if (match) {
				relX = match.relX || 0;
				relY = match.relY || 0;
			}
		}

		let targetX = baseDropX + relX;
		let targetY = baseDropY + relY;

		if (alignGrid) {
			targetX = startX + Math.round((targetX - startX) / gridStepX) * gridStepX;
			targetY = startY + Math.round((targetY - startY) / gridStepY) * gridStepY;
		}

		targetX = Math.max(startX, Math.min(targetX, maxX));
		targetY = Math.max(startY, Math.min(targetY, maxY));

		const resolvedPos = (isDesktopDrop && alignGrid) ? findNearestFreeSlot(targetX, targetY) : { x: targetX, y: targetY };

		if (isAppIcon) {
			if (isDesktopDrop) {
				positions[src] = resolvedPos;
			}
			return;
		}

		if (!isCopy && element.parent && element.parent.getFullPath() === destFullPath) {
			if (isDesktopDrop && destFullPath === '/') {
				positions[element.getFullPath()] = resolvedPos;
			}
			return;
		}

		try {
			let resultElement;
			if (isCopy) {
				resultElement = fs.copy(src, destFullPath);
			} else {
				resultElement = fs.move(src, destFullPath);
			}
			if (isDesktopDrop && destFullPath === '/' && resultElement) {
				positions[resultElement.getFullPath()] = resolvedPos;
			}
		} catch (err) {
			showXPDialog(isCopy ? 'Copy Error' : 'Move Error', err.message, 'error');
		}
	});

	if (isDesktopDrop && destFullPath === '/') {
		saveDesktopIconPositions(positions);
		fs.undoStack.push({
			type: 'desktop-layout',
			positions: previousLayoutSnapshot
		});
		fs.redoStack = [];
	}

	if (window.SettingsApp && window.SettingsApp.playSound) {
		window.SettingsApp.playSound('click');
	}

	refreshUI();
}

function setupDesktopDropzone() {
	const desktop = document.getElementById('desktop');
	const iconsContainer = document.getElementById('project-icons-container');
	[desktop, iconsContainer].forEach(zone => {
		if (zone) {
			zone.addEventListener('dragover', handleDragOver);
			zone.addEventListener('dragleave', handleDragLeave);
			zone.addEventListener('drop', handleDrop);
		}
	});
}

async function openReadOnlyTextWindow(file) {
	if (file.remoteUrl && !file.content) {
		try {
			const response = await fetch(file.remoteUrl);
			if (response.ok) {
				file.content = await response.text();
				file.size = new TextEncoder().encode(file.content).length;
			}
		} catch (error) {}
	}
	if (window.NotepadApp) {
		const win = window.NotepadApp.open(file, { readOnly: true });
		if (win && ((file.remoteUrl || '').includes('poem') || (file.parent && file.parent.name === 'Poems'))) {
			let readTimer = 0;
			const interval = setInterval(() => {
				if (!document.getElementById(win.id)) {
					clearInterval(interval);
					return;
				}
				if (typeof activeWindow !== 'undefined' && activeWindow === win) {
					readTimer++;
					if (readTimer >= 25) {
						clearInterval(interval);
						if (window.AchievementsManager) window.AchievementsManager.progress('poetry_enthusiast', 1);
					}
				}
			}, 1000);
		}
	}
}

function openTextEditorWindow(file) {
	if (window.NotepadApp) {
		window.NotepadApp.open(file);
	}
}

function downloadFileSystemElement(element) {
	if (!element) return;
	const filename = element.name || 'download';
	let blob = null;

	if (element instanceof File) {
		const content = element.content || '';
		if (content.startsWith('data:')) {
			const parts = content.split(';base64,');
			const contentType = parts[0].split(':')[1];
			const raw = window.atob(parts[1]);
			const rawLength = raw.length;
			const uInt8Array = new Uint8Array(rawLength);
			for (let i = 0; i < rawLength; ++i) {
				uInt8Array[i] = raw.charCodeAt(i);
			}
			blob = new Blob([uInt8Array], { type: contentType });
		} else if (element.remoteUrl) {
			const a = document.createElement('a');
			a.href = element.remoteUrl;
			a.download = filename;
			a.target = '_blank';
			document.body.appendChild(a);
			a.click();
			a.remove();
			return;
		} else {
			blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
		}
	} else if (element instanceof ProjectFile) {
		const data = JSON.stringify(element.projectData || {}, null, 2);
		blob = new Blob([data], { type: 'application/json;charset=utf-8' });
	}

	if (blob) {
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		a.remove();
		setTimeout(() => URL.revokeObjectURL(url), 2000);
	}
}

function trackWallpaperViewed(source) {
	if (!source || typeof source !== 'string') return;
	try {
		let viewed = JSON.parse(localStorage.getItem('xp_viewed_wallpapers') || '[]');
		const key = source.toLowerCase();
		if (!viewed.includes(key)) {
			viewed.push(key);
			localStorage.setItem('xp_viewed_wallpapers', JSON.stringify(viewed));
		}
		if (window.AchievementsManager) {
			window.AchievementsManager.setProgress('wallpaper_collector', viewed.length);
		}
	} catch (e) {}
}

let currentWallpaperLayer = 'a';
let activeWallpaperTransitionTimer = null;

function setImageAsWallpaper(source, fitMode = 'cover', transitionType = null) {
	const desktop = document.getElementById('desktop');
	const layerA = document.getElementById('desktop-wallpaper-layer-a');
	const layerB = document.getElementById('desktop-wallpaper-layer-b');
	const transMode = transitionType || (window.SettingsApp && window.SettingsApp.get('wallpaperTransition')) || localStorage.getItem('wallpaperTransition') || 'none';
	const transDuration = parseFloat((window.SettingsApp && window.SettingsApp.get('wallpaperTransitionDuration')) || localStorage.getItem('wallpaperTransitionDuration') || '1.0');

	document.documentElement.style.setProperty('--wp-trans-duration', `${transDuration}s`);

	if (layerA && layerB) {
		const targetLayer = currentWallpaperLayer === 'a' ? layerB : layerA;
		const activeLayer = currentWallpaperLayer === 'a' ? layerA : layerB;

		if (activeWallpaperTransitionTimer) {
			clearTimeout(activeWallpaperTransitionTimer);
			activeWallpaperTransitionTimer = null;
		}

		targetLayer.className = 'desktop-wallpaper-layer';
		targetLayer.style.backgroundImage = `url('${source}')`;
		targetLayer.style.backgroundSize = fitMode === 'fit' ? 'contain' : (fitMode === 'stretch' ? '100% 100%' : (fitMode === 'tile' || fitMode === 'center' ? 'auto' : 'cover'));
		targetLayer.style.backgroundRepeat = fitMode === 'tile' ? 'repeat' : 'no-repeat';
		targetLayer.style.backgroundPosition = fitMode === 'tile' ? 'top left' : 'center center';
		targetLayer.style.zIndex = '2';
		activeLayer.style.zIndex = '1';

		if (transMode !== 'none') {
			targetLayer.classList.add(`trans-${transMode}-in`);

			const finalizeTransition = () => {
				if (activeWallpaperTransitionTimer) {
					clearTimeout(activeWallpaperTransitionTimer);
					activeWallpaperTransitionTimer = null;
				}
				activeLayer.className = 'desktop-wallpaper-layer';
				activeLayer.style.zIndex = '0';
				activeLayer.style.opacity = '0';
				activeLayer.style.backgroundImage = 'none';

				targetLayer.className = 'desktop-wallpaper-layer active';
				targetLayer.style.zIndex = '1';
				targetLayer.style.opacity = '1';
				currentWallpaperLayer = currentWallpaperLayer === 'a' ? 'b' : 'a';
			};

			activeWallpaperTransitionTimer = setTimeout(finalizeTransition, Math.max(120, Math.round(transDuration * 1000)));
		} else {
			targetLayer.className = 'desktop-wallpaper-layer active';
			targetLayer.style.zIndex = '1';
			targetLayer.style.opacity = '1';

			activeLayer.className = 'desktop-wallpaper-layer';
			activeLayer.style.zIndex = '0';
			activeLayer.style.opacity = '0';
			activeLayer.style.backgroundImage = 'none';
			currentWallpaperLayer = currentWallpaperLayer === 'a' ? 'b' : 'a';
		}
	} else if (desktop) {
		desktop.style.backgroundImage = `url('${source}')`;
	}

	localStorage.setItem('desktopBackground', source);
	if (window.SettingsApp) {
		window.SettingsApp.set('desktopBackground', source);
		window.SettingsApp.set('wallpaperFit', fitMode);
	}
	trackWallpaperViewed(source);

	if (window.AchievementsManager && (source.includes('artwork') || source.includes('/music/') || source.includes('track_artwork') || source.includes('album_artwork'))) {
		window.AchievementsManager.progress('artwork_wallpaper', 1);
	}
	if (typeof refreshUI === 'function') refreshUI();
}

window.setImageAsWallpaper = setImageAsWallpaper;

const DEFAULT_DESKTOP_WALLPAPER = '../assets/images/desk/wallpapers/wallpaper-default.webp';
let desktopWallpapersRegistry = null;

const preloadedWallpapers = new Map();

function preloadWallpaperImage(url) {
	if (!url || preloadedWallpapers.has(url)) return;
	const img = new Image();
	img.src = url;
	img.onload = () => preloadedWallpapers.set(url, img);
	if (img.complete) preloadedWallpapers.set(url, img);
}

let wallpaperSlideshowTimer = null;

function updateWallpaperSlideshow() {
	if (wallpaperSlideshowTimer) {
		clearInterval(wallpaperSlideshowTimer);
		wallpaperSlideshowTimer = null;
	}

	const mode = (window.SettingsApp && window.SettingsApp.get('wallpaperMode')) || localStorage.getItem('wallpaperMode') || 'picture';
	if (mode !== 'slideshow') return;

	let intervalSec = parseFloat((window.SettingsApp && window.SettingsApp.get('wallpaperSlideshowInterval')) || localStorage.getItem('wallpaperSlideshowInterval') || '30');
	if (isNaN(intervalSec) || intervalSec < 3) intervalSec = 30;

	const prepareNextPreload = async () => {
		const list = await fetchWallpaperRegistry();
		if (!list || list.length === 0) return;
		const isRandom = (window.SettingsApp && window.SettingsApp.get('wallpaperSlideshowRandom')) || localStorage.getItem('wallpaperSlideshowRandom') === 'true';
		const curr = (window.SettingsApp && window.SettingsApp.get('desktopBackground')) || localStorage.getItem('desktopBackground');
		const idx = list.findIndex(w => w.path === curr);
		const nextCandidate = isRandom ? list[Math.floor(Math.random() * list.length)] : list[(idx + 1) % list.length];
		if (nextCandidate && nextCandidate.path) {
			preloadWallpaperImage(nextCandidate.path);
		}
	};

	prepareNextPreload();

	wallpaperSlideshowTimer = setInterval(async () => {
		const list = await fetchWallpaperRegistry();
		if (!list || list.length === 0) return;
		const isRandom = (window.SettingsApp && window.SettingsApp.get('wallpaperSlideshowRandom')) || localStorage.getItem('wallpaperSlideshowRandom') === 'true';
		let nextWp;
		const curr = (window.SettingsApp && window.SettingsApp.get('desktopBackground')) || localStorage.getItem('desktopBackground');
		const idx = list.findIndex(w => w.path === curr);

		if (isRandom) {
			nextWp = list[Math.floor(Math.random() * list.length)];
		} else {
			nextWp = list[(idx + 1) % list.length];
		}

		if (nextWp) {
			const fit = (window.SettingsApp && window.SettingsApp.get('wallpaperFit')) || localStorage.getItem('wallpaperFit') || 'cover';
			const transition = (window.SettingsApp && window.SettingsApp.get('wallpaperTransition')) || localStorage.getItem('wallpaperTransition') || 'none';
			setImageAsWallpaper(nextWp.path, fit, transition);
		}

		prepareNextPreload();
	}, intervalSec * 1000);
}

async function purgeAllClientData() {
	try {
		localStorage.clear();
	} catch (e) {}

	try {
		sessionStorage.clear();
	} catch (e) {}

	try {
		document.cookie.split(';').forEach(cookie => {
			const eqPos = cookie.indexOf('=');
			const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
			if (name) {
				document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
				document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname};`;
			}
		});
	} catch (e) {}

	try {
		if (window.indexedDB && typeof indexedDB.databases === 'function') {
			const databases = await indexedDB.databases();
			await Promise.all((databases || []).map(db => {
				if (db && db.name) {
					return new Promise(resolve => {
						const req = indexedDB.deleteDatabase(db.name);
						req.onsuccess = () => resolve();
						req.onerror = () => resolve();
						req.onblocked = () => resolve();
					});
				}
				return Promise.resolve();
			}));
		}
	} catch (e) {}

	try {
		if (window.caches) {
			const cacheKeys = await caches.keys();
			await Promise.all(cacheKeys.map(key => caches.delete(key)));
		}
	} catch (e) {}

	try {
		if (navigator.serviceWorker) {
			const registrations = await navigator.serviceWorker.getRegistrations();
			await Promise.all(registrations.map(reg => reg.unregister()));
		}
	} catch (e) {}

	window.location.reload();
}

window.purgeAllData = purgeAllClientData;
window.clearAllData = purgeAllClientData;
window.purgeAll = purgeAllClientData;
window.wipeAllData = purgeAllClientData;

function applyInitialDesktopBackground() {
	const mode = (window.SettingsApp && window.SettingsApp.get('wallpaperMode')) || localStorage.getItem('wallpaperMode') || 'picture';
	const bgColor = (window.SettingsApp && window.SettingsApp.get('desktopBackgroundColor')) || localStorage.getItem('desktopBackgroundColor') || '#004e98';
	const current = (window.SettingsApp && window.SettingsApp.get('desktopBackground')) || localStorage.getItem('desktopBackground') || DEFAULT_DESKTOP_WALLPAPER;
	const fit = (window.SettingsApp && window.SettingsApp.get('wallpaperFit')) || localStorage.getItem('wallpaperFit') || 'cover';

	const desktop = document.getElementById('desktop');
	const layerA = document.getElementById('desktop-wallpaper-layer-a');
	const layerB = document.getElementById('desktop-wallpaper-layer-b');
	if (!desktop) return;

	desktop.style.backgroundColor = bgColor;

	if (layerA && layerB) {
		const activeLayer = currentWallpaperLayer === 'a' ? layerA : layerB;
		const inactiveLayer = currentWallpaperLayer === 'a' ? layerB : layerA;

		activeLayer.style.backgroundColor = bgColor;
		inactiveLayer.style.backgroundColor = bgColor;

		if (mode === 'color') {
			activeLayer.style.backgroundImage = 'none';
			activeLayer.className = 'desktop-wallpaper-layer active';
			activeLayer.style.opacity = '1';
			inactiveLayer.style.backgroundImage = 'none';
			inactiveLayer.className = 'desktop-wallpaper-layer';
			inactiveLayer.style.opacity = '0';
		} else {
			activeLayer.style.backgroundImage = `url('${current}')`;
			activeLayer.style.backgroundSize = fit === 'fit' ? 'contain' : (fit === 'stretch' ? '100% 100%' : (fit === 'tile' || fit === 'center' ? 'auto' : 'cover'));
			activeLayer.style.backgroundRepeat = fit === 'tile' ? 'repeat' : 'no-repeat';
			activeLayer.style.backgroundPosition = fit === 'tile' ? 'top left' : 'center center';
			activeLayer.className = 'desktop-wallpaper-layer active';
			activeLayer.style.opacity = '1';

			inactiveLayer.className = 'desktop-wallpaper-layer';
			inactiveLayer.style.opacity = '0';
			inactiveLayer.style.backgroundImage = 'none';

			preloadWallpaperImage(current);
			trackWallpaperViewed(current);
		}
	} else if (desktop) {
		if (mode === 'color') {
			desktop.style.backgroundImage = 'none';
		} else {
			desktop.style.backgroundImage = `url('${current}')`;
		}
	}

	document.body.classList.remove('wallpaper-fit-cover', 'wallpaper-fit-stretch', 'wallpaper-fit-center', 'wallpaper-fit-tile', 'wallpaper-fit-fit');
	document.body.classList.add(`wallpaper-fit-${fit}`);

	updateWallpaperSlideshow();
}

async function fetchWallpaperRegistry() {
	if (wallpaperMetadataMap.size === 0) {
		try {
			const response = await fetch('../data/desk-wallpaper.json');
			if (response.ok) {
				const items = await response.json();
				items.forEach(item => {
					if (item.filename) wallpaperMetadataMap.set(item.filename.toLowerCase(), item.name);
					if (item.path) {
						const fname = item.path.split('/').pop().toLowerCase();
						wallpaperMetadataMap.set(fname, item.name);
						wallpaperMetadataMap.set(item.path, item.name);
					}
				});
			}
		} catch (e) {}
	}

	if (fs) {
		let wpFolder = fs.findByPath('/WINDOWS/Web/Wallpaper');
		if (!wpFolder) wpFolder = fs.findByPath('/Wallpaper');
		if (wpFolder instanceof Folder) {
			const files = wpFolder.listContent().filter(el => el instanceof File && /\.(webp|png|jpe?g|bmp|gif)$/i.test(el.name));
			return files.map((f, index) => {
				const lookupKey = f.name.toLowerCase();
				const displayName = wallpaperMetadataMap.get(lookupKey) || wallpaperMetadataMap.get(f.remoteUrl || '') || f.name.replace(/\.[^/.]+$/, '');
				return {
					id: `wp-${index}-${f.name.replace(/[^\w-]/g, '_')}`,
					name: displayName,
					filename: f.name,
					path: f.remoteUrl || f.content || f.getFullPath()
				};
			});
		}
	}
	try {
		const response = await fetch('../data/desk-wallpaper.json');
		if (!response.ok) throw new Error(`HTTP error ${response.status}`);
		desktopWallpapersRegistry = await response.json();
		return desktopWallpapersRegistry;
	} catch (error) {
		return [{ id: 'wallpaper-default', name: 'Windows XP Bliss', filename: 'wallpaper-default.webp', path: DEFAULT_DESKTOP_WALLPAPER }];
	}
}

function openDisplaySettings(initialTab = 'desktop', options = {}) {
	if (window.SettingsApp) {
		return window.SettingsApp.open(initialTab, options);
	}
	if (window.DeskAppRegistry) {
		return window.DeskAppRegistry.launch('display', { tab: initialTab, ...options });
	}
	return null;
}

function openRecycleBinWindow() {
	if (window.FileExplorer && typeof window.FileExplorer.openRecycleBin === 'function') {
		return window.FileExplorer.openRecycleBin();
	}
}

function renderRecycleBinContent(win) {
	if (win && win.classList.contains('xp-explorer-window') && window.FileExplorer) {
		window.FileExplorer.updateView(win, true);
	}
}

function openRunDialog(options = {}) {
	const id = 'window-run-dialog';
	const title = 'Run';
	const existingWindow = document.getElementById(id);
	if (existingWindow) {
		bringWindowToFront(existingWindow);
		const input = existingWindow.querySelector('input');
		if(input) {
			input.focus();
			input.select();
		}
		return existingWindow;
	}

	const contentHTML = `
		<div style="display: flex; flex-direction: column; padding: 15px; gap: 15px;">
			<div style="display: flex; gap: 15px; align-items: flex-start;">
				<img src="../assets/images/desk/icons/Command Prompt.webp" style="width: 32px; height: 32px;" alt="Run">
				<div>
					<p style="margin: 0 0 10px 0;">Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.</p>
					<div style="display: flex; align-items: center; gap: 10px;">
						<label for="run-input">Open:</label>
						<input type="text" id="run-input" style="flex-grow: 1; padding: 3px;" list="run-history">
						<datalist id="run-history">
							<option value="cmd">
							<option value="explorer">
							<option value="shutdown">
							<option value="www.google.com">
						</datalist>
					</div>
				</div>
			</div>
			<div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 10px;">
				<button class="xp-button" id="run-ok">OK</button>
				<button class="xp-button" id="run-cancel">Cancel</button>
				<button class="xp-button" id="run-browse">Browse...</button>
			</div>
		</div>
	`;

	const bounds = (window.WindowManager && typeof window.WindowManager.getWorkspaceBounds === 'function') 
		? window.WindowManager.getWorkspaceBounds() 
		: { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight - 36, right: window.innerWidth, bottom: window.innerHeight - 36 };

	let targetX = options ? options.x : undefined;
	let targetY = options ? options.y : undefined;
	if (typeof targetX === 'number' && typeof targetY === 'number') {
		targetX = Math.max(bounds.left + 8, Math.min(targetX, bounds.right - 400 - 8));
		targetY = Math.max(bounds.top + 8, Math.min(targetY, bounds.bottom - 180 - 8));
	}

	const runWindow = createXPWindow(id, title, contentHTML, 400, 180, {
		resizable: false,
		iconSrc: '../assets/images/desk/icons/Command Prompt.webp',
		x: targetX,
		y: targetY
	});
	
	const input = runWindow.querySelector('#run-input');
	const okBtn = runWindow.querySelector('#run-ok');
	const cancelBtn = runWindow.querySelector('#run-cancel');
	const browseBtn = runWindow.querySelector('#run-browse');

	input.focus();

	function execute() {
		const command = input.value.trim();
		if (command) {
			processRunCommand(command);
			closeWindow(runWindow, id);
		}
	}

	okBtn.addEventListener('click', execute);
	cancelBtn.addEventListener('click', () => closeWindow(runWindow, id));
	browseBtn.addEventListener('click', () => {
		if (window.FileDialog) {
			window.FileDialog.open({
				mode: 'open',
				title: 'Browse',
				filterTypes: [
					{ label: 'Programs (*.exe;*.pif;*.com;*.bat;*.cmd)', ext: '.exe;.pif;.com;.bat;.cmd', mime: '*/*' },
					{ label: 'All Files (*.*)', ext: '.*', mime: '*/*' }
				],
				onConfirm: (folder, fileName, targetItem) => {
					if (targetItem) {
						input.value = targetItem.getFullPath();
					} else if (folder) {
						input.value = `${folder.getFullPath() === '/' ? '' : folder.getFullPath()}/${fileName}`;
					}
					input.focus();
				}
			});
		}
	});
	
	input.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') execute();
	});

	return runWindow;
}

function processRunCommand(command) {
	const raw = command.trim();
	if (!raw) return;
	const parts = raw.split(/\s+/);
	const cmd = parts[0];
	const lowerCmd = cmd.toLowerCase();
	const args = raw.substring(cmd.length).trim();

	if (lowerCmd === 'shutdown') {
		if (window.DeskAppRegistry) window.DeskAppRegistry.launch('shutdown');
		else openShutdownDialog();
		return;
	}

	if (lowerCmd === 'logoff') {
		const welcome = document.getElementById('welcome-screen');
		if (welcome) {
			welcome.classList.remove('hidden');
			welcome.style.opacity = '1';
			welcome.style.display = 'flex';
		}
		return;
	}

	if (lowerCmd === 'bsod') {
		triggerBSOD();
		return;
	}

	if (lowerCmd === 'sysdm.cpl' || lowerCmd === 'timedate.cpl' || lowerCmd === 'appwiz.cpl' || lowerCmd === 'desk.cpl' || lowerCmd === 'mmsys.cpl' || lowerCmd === 'main.cpl') {
		const tabMap = {
			'sysdm.cpl': 'system',
			'desk.cpl': 'appearance',
			'timedate.cpl': 'taskbar',
			'mmsys.cpl': 'audio',
			'main.cpl': 'input',
			'appwiz.cpl': 'system'
		};
		if (window.SettingsApp) {
			window.SettingsApp.open(tabMap[lowerCmd] || 'system');
			return;
		}
	}

	if (lowerCmd.startsWith('www.') || lowerCmd.startsWith('http://') || lowerCmd.startsWith('https://') || lowerCmd.endsWith('.com') || lowerCmd.endsWith('.org') || lowerCmd.endsWith('.net')) {
		if (window.DeskAppRegistry) {
			window.DeskAppRegistry.launch('ie', raw);
		} else if (typeof openInternetExplorer === 'function') {
			openInternetExplorer(raw);
		}
		return;
	}

	if (lowerCmd === 'clippy') {
		if (window.ClippyAgent && typeof window.ClippyAgent.open === 'function') {
			window.ClippyAgent.open();
			if (args) window.ClippyAgent.prompt(args);
			return;
		}
	}

	if (window.DeskAppRegistry) {
		const app = window.DeskAppRegistry.get(lowerCmd);
		if (app) {
			let launchArgs = args || undefined;
			if (args && (app.id === 'notepad' || app.id === 'paint' || app.id === 'pictureviewer' || app.id === 'soundrecorder')) {
				let filePath = args.replace(/\\/g, '/');
				if (filePath.startsWith('C:/') || filePath.startsWith('c:/')) filePath = filePath.substring(2);
				if (fs && fs.exists(filePath)) launchArgs = fs.findByPath(filePath);
			}
			window.DeskAppRegistry.launch(app.id, launchArgs);
			return;
		}
	}

	let pathCandidate = raw;
	if (pathCandidate.startsWith('C:\\') || pathCandidate.startsWith('c:\\')) {
		pathCandidate = pathCandidate.substring(2).replace(/\\/g, '/');
	}
	if (fs && fs.exists(pathCandidate)) {
		const el = fs.findByPath(pathCandidate);
		if (el) {
			openFileSystemElement(el);
			return;
		}
	}

	showXPDialog(command, `Cannot find '${command}'. Make sure you typed the name correctly, and then try again.`, 'error');
}

function openMyComputerWindow(options = {}) {
	const id = 'window-my-computer';
	const existing = document.getElementById(id);
	if (existing) {
		bringWindowToFront(existing);
		return existing;
	}

	const drivesList = (fs && typeof fs.getDrives === 'function') ? fs.getDrives() : [];
	const hardDrives = drivesList.filter(d => d.driveType === 'fixed');
	const removableDrives = drivesList.filter(d => d.driveType !== 'fixed');

	let hardDrivesHtml = '';
	hardDrives.forEach(d => {
		const totalGb = (d.totalBytes / (1024 * 1024 * 1024)).toFixed(1);
		const freeGb = (d.freeBytes / (1024 * 1024 * 1024)).toFixed(1);
		hardDrivesHtml += `
			<div class="my-comp-item" data-drive="${d.letter}" data-path="${d.mountPath}">
				<img src="${d.icon}" alt="${d.volumeLabel}">
				<div class="my-comp-texts">
					<strong>${d.volumeLabel}</strong>
					<span>${freeGb} GB free of ${totalGb} GB</span>
				</div>
			</div>
		`;
	});

	let removableDrivesHtml = '';
	removableDrives.forEach(d => {
		removableDrivesHtml += `
			<div class="my-comp-item" data-drive="${d.letter}" data-path="${d.mountPath}">
				<img src="${d.icon}" alt="${d.volumeLabel}">
				<div class="my-comp-texts">
					<strong>${d.volumeLabel}</strong>
					<span>${d.driveType === 'cdrom' ? 'Compact Disc' : '3½-Inch Floppy Disk'}</span>
				</div>
			</div>
		`;
	});

	const contentHTML = `
		<div class="xp-explorer-layout">
			<div class="xp-explorer-menubar">
				<ul class="xp-menubar-list">
					<li class="xp-menubar-item"><u>F</u>ile</li>
					<li class="xp-menubar-item"><u>E</u>dit</li>
					<li class="xp-menubar-item"><u>V</u>iew</li>
					<li class="xp-menubar-item"><u>F</u>avorites</li>
					<li class="xp-menubar-item"><u>T</u>ools</li>
					<li class="xp-menubar-item"><u>H</u>elp</li>
				</ul>
				<div class="xp-menubar-brand">
					<img src="../assets/images/desk/window_logo.png" alt="XP">
				</div>
			</div>
			<div class="xp-explorer-toolbar">
				<div class="xp-tb-group">
					<button type="button" class="xp-tb-btn tb-back" disabled><div class="xp-tb-icon-back"></div><span>Back</span></button>
					<button type="button" class="xp-tb-btn tb-forward" disabled><div class="xp-tb-icon-forward"></div></button>
					<button type="button" class="xp-tb-btn tb-up" disabled><div class="xp-tb-icon-up"></div></button>
				</div>
				<div class="xp-tb-sep"></div>
				<div class="xp-tb-group">
					<button type="button" class="xp-tb-btn tb-search" id="mycomp-tb-search"><img src="../assets/images/desk/icons/Search.webp" alt=""><span>Search</span></button>
					<button type="button" class="xp-tb-btn" id="mycomp-tb-folders"><img src="../assets/images/desk/icons/Folder Closed.webp" alt=""><span>Folders</span></button>
				</div>
			</div>
			<div class="xp-explorer-addressbar-row">
				<span class="xp-address-label">Address</span>
				<div class="xp-address-combo">
					<img src="../assets/images/desk/icons/My Computer.webp" class="xp-address-icon" alt="">
					<input type="text" class="xp-address-input" value="My Computer" readonly>
				</div>
				<button type="button" class="xp-address-go-btn"><div class="xp-go-icon">➔</div><span>Go</span></button>
			</div>
			<div class="xp-explorer-body">
				<div class="xp-explorer-sidebar">
					<div class="xp-sidebar-tasks-view">
						<div class="xp-task-box">
							<div class="xp-task-header"><span>System Tasks</span><button type="button" class="xp-task-chevron"></button></div>
							<div class="xp-task-content">
								<a href="#" class="xp-task-link" id="mycomp-task-info"><img src="../assets/images/desk/icons/System Properties.webp" alt=""><span>View system information</span></a>
								<a href="#" class="xp-task-link" id="mycomp-task-ctrl"><img src="../assets/images/desk/icons/Display.webp" alt=""><span>Change a setting</span></a>
							</div>
						</div>
						<div class="xp-task-box">
							<div class="xp-task-header"><span>Other Places</span><button type="button" class="xp-task-chevron"></button></div>
							<div class="xp-task-content">
								<a href="#" class="xp-task-link" id="mycomp-place-network"><img src="../assets/images/desk/icons/My Network Places.webp" alt=""><span>My Network Places</span></a>
								<a href="#" class="xp-task-link" id="mycomp-place-docs"><img src="../assets/images/desk/icons/My Profile Folder.webp" alt=""><span>My Documents</span></a>
								<a href="#" class="xp-task-link" id="mycomp-place-projects"><img src="../assets/images/desk/icons/Folder Open.webp" alt=""><span>My Projects</span></a>
							</div>
						</div>
						<div class="xp-task-box">
							<div class="xp-task-header"><span>Details</span><button type="button" class="xp-task-chevron"></button></div>
							<div class="xp-task-content xp-task-details-body">
								<b>My Computer</b><br>
								System Folder
							</div>
						</div>
					</div>
				</div>
				<div class="xp-explorer-splitter"></div>
				<div class="xp-explorer-main">
					<div class="xp-explorer-view-container" style="padding: 12px;">
						<div class="my-comp-group">
							<div class="my-comp-group-title">Files Stored on This Computer</div>
							<div class="my-comp-grid">
								<div class="my-comp-item" id="mycomp-item-shared" data-path="/PDFs">
									<img src="../assets/images/desk/icons/Folder Closed (Alt).webp" alt="Shared Documents">
									<div class="my-comp-texts">
										<strong>Shared Documents</strong>
										<span>System Folder</span>
									</div>
								</div>
								<div class="my-comp-item" id="mycomp-item-userdocs" data-path="/">
									<img src="../assets/images/desk/icons/My Profile Folder.webp" alt="User's Documents">
									<div class="my-comp-texts">
										<strong>Colin's Documents</strong>
										<span>Personal Folder</span>
									</div>
								</div>
							</div>
						</div>

						<div class="my-comp-group">
							<div class="my-comp-group-title">Hard Disk Drives</div>
							<div class="my-comp-grid">
								${hardDrivesHtml}
							</div>
						</div>

						<div class="my-comp-group">
							<div class="my-comp-group-title">Devices with Removable Storage</div>
							<div class="my-comp-grid">
								${removableDrivesHtml}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="xp-explorer-statusbar">
				<div class="xp-sb-pane xp-sb-count">${2 + drivesList.length} objects</div>
				<div class="xp-sb-pane xp-sb-zone"><img src="../assets/images/desk/icons/My Computer.webp" alt=""><span>Local Computer</span></div>
			</div>
		</div>
	`;

	const bounds = (window.WindowManager && typeof window.WindowManager.getWorkspaceBounds === 'function') 
		? window.WindowManager.getWorkspaceBounds() 
		: { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight - 36, right: window.innerWidth, bottom: window.innerHeight - 36 };

	let targetX = options ? options.x : undefined;
	let targetY = options ? options.y : undefined;
	if (typeof targetX === 'number' && typeof targetY === 'number') {
		targetX = Math.max(bounds.left + 8, Math.min(targetX, bounds.right - 720 - 8));
		targetY = Math.max(bounds.top + 8, Math.min(targetY, bounds.bottom - 500 - 8));
	}

	const win = createXPWindow(id, 'My Computer', contentHTML, 720, 500, {
		iconSrc: '../assets/images/desk/icons/My Computer.webp',
		x: targetX,
		y: targetY
	});
	win.querySelector('.xp-window-content').style.padding = '0';

	win.querySelector('#mycomp-task-info').addEventListener('click', (e) => {
		e.preventDefault();
		if (window.SettingsApp) window.SettingsApp.open('system');
	});
	win.querySelector('#mycomp-task-ctrl').addEventListener('click', (e) => {
		e.preventDefault();
		if (window.SettingsApp) window.SettingsApp.open('appearance');
	});
	win.querySelector('#mycomp-place-network').addEventListener('click', (e) => {
		e.preventDefault();
		openNetworkPlacesWindow();
	});
	win.querySelector('#mycomp-place-docs').addEventListener('click', (e) => {
		e.preventDefault();
		if (fs.root.getByName('PDFs')) openFolderWindow(fs.root.getByName('PDFs'));
	});
	win.querySelector('#mycomp-place-projects').addEventListener('click', (e) => {
		e.preventDefault();
		openAllProjectsFolder();
	});

	win.querySelectorAll('.my-comp-item[data-path]').forEach(itemEl => {
		itemEl.addEventListener('dblclick', () => {
			const driveLetter = itemEl.dataset.drive;
			const targetPath = itemEl.dataset.path;
			const driveObj = driveLetter ? (fs && fs.getDrive(driveLetter)) : null;

			if (driveObj && !driveObj.provider.isReady) {
				showXPDialog(`Drive ${driveLetter}:`, `Please insert a disk into drive ${driveLetter}:.`, 'error');
				return;
			}

			const normalized = VFSPath.normalize(targetPath);
			const targetFolder = fs ? fs.findByPath(normalized) : null;
			if (targetFolder instanceof Folder) {
				openFolderWindow(targetFolder);
			} else {
				showXPDialog(itemEl.querySelector('strong')?.textContent || 'Drive', 'Volume accessible and mounted.', 'info');
			}
		});
	});

	win.querySelectorAll('.xp-task-header').forEach(header => {
		header.addEventListener('click', () => {
			const box = header.closest('.xp-task-box');
			if (box) box.classList.toggle('collapsed');
		});
	});

	return win;
}

function openSearchWindow(initialQuery = '', options = {}) {
	const id = 'window-search-companion';
	const existing = document.getElementById(id);
	if (existing) {
		bringWindowToFront(existing);
		const input = existing.querySelector('#search-input-field');
		if (input) {
			input.value = initialQuery;
			input.focus();
		}
		return existing;
	}

	const contentHTML = `
		<div style="display: flex; height: 100%; background: #ffffff;">
			<div class="search-companion-sidebar">
				<div class="search-companion-dog-card">
					<img src="https://api.iconify.design/mdi/dog.svg?color=%23f4b400" alt="Search Rover">
					<div class="search-companion-balloon">What are you looking for today?</div>
				</div>
				<div style="display: flex; flex-direction: column; gap: 4px; margin-top: 6px;">
					<label for="search-input-field">Search term:</label>
					<input type="text" id="search-input-field" class="xp-input" value="${initialQuery.replace(/"/g, '&quot;')}" placeholder="Name or keyword...">
				</div>
				<div style="display: flex; flex-direction: column; gap: 4px;">
					<label for="search-type-select">Look in:</label>
					<select id="search-type-select" class="xp-select">
						<option value="all">Everywhere (Projects & Files)</option>
						<option value="projects">Portfolio Projects</option>
						<option value="files">Desktop Documents</option>
					</select>
				</div>
				<div style="margin-top: 8px; display: flex; justify-content: flex-end;">
					<button class="xp-button" id="search-submit-btn">Search</button>
				</div>
			</div>
			<div style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">
				<div style="padding: 8px 12px; background: #f0f4fa; border-bottom: 1px solid #d0dbe9; font-size: 11px; font-weight: bold; color: #153c8f;" id="search-status-header">
					Enter a query and click Search.
				</div>
				<div style="flex: 1; overflow-y: auto; padding: 6px;" id="search-results-pane">
					<ul class="search-results-list" id="search-results-ul"></ul>
				</div>
			</div>
		</div>
	`;

	const bounds = (window.WindowManager && typeof window.WindowManager.getWorkspaceBounds === 'function') 
		? window.WindowManager.getWorkspaceBounds() 
		: { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight - 36, right: window.innerWidth, bottom: window.innerHeight - 36 };

	let targetX = options ? options.x : undefined;
	let targetY = options ? options.y : undefined;
	if (typeof targetX === 'number' && typeof targetY === 'number') {
		targetX = Math.max(bounds.left + 8, Math.min(targetX, bounds.right - 680 - 8));
		targetY = Math.max(bounds.top + 8, Math.min(targetY, bounds.bottom - 420 - 8));
	}

	const win = createXPWindow(id, 'Search Results', contentHTML, 680, 420, {
		iconSrc: '../assets/images/desk/icons/Search.webp',
		x: targetX,
		y: targetY
	});
	win.querySelector('.xp-window-content').style.padding = '0';

	const input = win.querySelector('#search-input-field');
	const typeSelect = win.querySelector('#search-type-select');
	const submitBtn = win.querySelector('#search-submit-btn');
	const statusHeader = win.querySelector('#search-status-header');
	const listEl = win.querySelector('#search-results-ul');

	function runSearch() {
		const q = input.value.trim().toLowerCase();
		const type = typeSelect.value;
		listEl.innerHTML = '';

		if (!q) {
			statusHeader.textContent = 'Please type a search query.';
			return;
		}

		let hits = [];

		if (type === 'all' || type === 'projects') {
			if (typeof projects !== 'undefined') {
				projects.flat().forEach(p => {
					if (!p) return;
					const title = resolveProjectTitle(p.title);
					const desc = resolveLocalizedText(p.longDescription) || resolveLocalizedText(p.longDescrition) || resolveLocalizedText(p.description) || '';
					const kw = (p.keywords || []).join(' ');
					if (title.toLowerCase().includes(q) || desc.toLowerCase().includes(q) || kw.toLowerCase().includes(q)) {
						hits.push({
							name: title,
							category: 'Project',
							icon: p.icon || '../assets/images/desk/icons/File.webp',
							action: () => openProjectWindow(p)
						});
					}
				});
			}
		}

		if (type === 'all' || type === 'files') {
			if (typeof fs !== 'undefined') {
				const matches = fs.search(q);
				matches.forEach(child => {
					hits.push({
						name: child.name,
						category: child instanceof Folder ? 'Folder' : 'File',
						icon: child.icon,
						action: () => openFileSystemElement(child)
					});
				});
			}
		}

		statusHeader.textContent = `Found ${hits.length} matching item(s) for "${input.value.trim()}".`;

		if (hits.length === 0) {
			listEl.innerHTML = '<li style="padding: 12px; font-size: 11px; color: #777;">No matching items found.</li>';
			return;
		}

		hits.forEach(hit => {
			const li = document.createElement('li');
			li.className = 'search-result-row';
			li.innerHTML = `
				<img src="${hit.icon}" alt="">
				<div style="flex: 1;">
					<strong>${hit.name}</strong>
					<span style="color: #666; margin-left: 8px; font-size: 10px;">[${hit.category}]</span>
				</div>
			`;
			li.addEventListener('dblclick', hit.action);
			listEl.appendChild(li);
		});
	}

	submitBtn.addEventListener('click', runSearch);
	input.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') runSearch();
	});

	if (initialQuery) runSearch();
	return win;
}

function openPrintersWindow(options = {}) {
	const id = 'window-printers-faxes';
	const existing = document.getElementById(id);
	if (existing) {
		bringWindowToFront(existing);
		return existing;
	}

	const contentHTML = `
		<div class="xp-explorer-layout">
			<div class="xp-explorer-menubar">
				<ul class="xp-menubar-list">
					<li class="xp-menubar-item"><u>F</u>ile</li>
					<li class="xp-menubar-item"><u>E</u>dit</li>
					<li class="xp-menubar-item"><u>V</u>iew</li>
					<li class="xp-menubar-item"><u>F</u>avorites</li>
					<li class="xp-menubar-item"><u>T</u>ools</li>
					<li class="xp-menubar-item"><u>H</u>elp</li>
				</ul>
				<div class="xp-menubar-brand">
					<img src="../assets/images/desk/window_logo.png" alt="XP">
				</div>
			</div>
			<div class="xp-explorer-toolbar">
				<div class="xp-tb-group">
					<button type="button" class="xp-tb-btn tb-back" disabled><div class="xp-tb-icon-back"></div><span>Back</span></button>
					<button type="button" class="xp-tb-btn tb-forward" disabled><div class="xp-tb-icon-forward"></div></button>
					<button type="button" class="xp-tb-btn tb-up" disabled><div class="xp-tb-icon-up"></div></button>
				</div>
				<div class="xp-tb-sep"></div>
				<div class="xp-tb-group">
					<button type="button" class="xp-tb-btn tb-search" id="printers-tb-search"><img src="../assets/images/desk/icons/Search.webp" alt=""><span>Search</span></button>
					<button type="button" class="xp-tb-btn" id="printers-tb-folders"><img src="../assets/images/desk/icons/Folder Closed.webp" alt=""><span>Folders</span></button>
				</div>
			</div>
			<div class="xp-explorer-addressbar-row">
				<span class="xp-address-label">Address</span>
				<div class="xp-address-combo">
					<img src="../assets/images/desk/icons/Fax.webp" class="xp-address-icon" alt="">
					<input type="text" class="xp-address-input" value="Printers and Faxes" readonly>
				</div>
				<button type="button" class="xp-address-go-btn"><div class="xp-go-icon">➔</div><span>Go</span></button>
			</div>
			<div class="xp-explorer-body">
				<div class="xp-explorer-sidebar">
					<div class="xp-sidebar-tasks-view">
						<div class="xp-task-box">
							<div class="xp-task-header"><span>Printer Tasks</span><button type="button" class="xp-task-chevron"></button></div>
							<div class="xp-task-content">
								<a href="#" class="xp-task-link" id="printer-task-add"><img src="../assets/images/desk/icons/Printer.webp" alt=""><span>Add a printer</span></a>
								<a href="#" class="xp-task-link" id="printer-task-fax"><img src="../assets/images/desk/icons/Fax.webp" alt=""><span>Set up faxing</span></a>
								<a href="#" class="xp-task-link" id="printer-task-queue"><img src="../assets/images/desk/icons/Fax.webp" alt=""><span>See what's printing</span></a>
							</div>
						</div>
						<div class="xp-task-box">
							<div class="xp-task-header"><span>See Also</span><button type="button" class="xp-task-chevron"></button></div>
							<div class="xp-task-content">
								<a href="#" class="xp-task-link" id="printer-link-troubleshoot"><img src="../assets/images/desk/icons/User Support.webp" alt=""><span>Troubleshoot printing</span></a>
								<a href="#" class="xp-task-link" id="printer-link-ctrl"><img src="../assets/images/desk/icons/System Properties.webp" alt=""><span>Control Panel</span></a>
							</div>
						</div>
						<div class="xp-task-box">
							<div class="xp-task-header"><span>Other Places</span><button type="button" class="xp-task-chevron"></button></div>
							<div class="xp-task-content">
								<a href="#" class="xp-task-link" id="printer-place-mycomp"><img src="../assets/images/desk/icons/My Computer.webp" alt=""><span>My Computer</span></a>
								<a href="#" class="xp-task-link" id="printer-place-mydocs"><img src="../assets/images/desk/icons/My Profile Folder.webp" alt=""><span>My Documents</span></a>
							</div>
						</div>
					</div>
				</div>
				<div class="xp-explorer-splitter"></div>
				<div class="xp-explorer-main">
					<div class="xp-explorer-view-container">
						<div class="xp-file-grid view-tiles" style="padding: 12px; gap: 10px;">
							<div class="xp-explorer-item mode-tile printer-card-item" id="printer-item-add" style="cursor: pointer;">
								<img src="../assets/images/desk/icons/Printer.webp" alt="">
								<div class="xp-tile-texts">
									<strong>Add Printer</strong>
									<span>Printer Wizard</span>
								</div>
							</div>
							<div class="xp-explorer-item mode-tile printer-card-item" id="printer-item-pdf" style="cursor: pointer;">
								<img src="../assets/images/desk/icons/Printer.webp" alt="">
								<div class="xp-tile-texts">
									<strong>PDF Document Writer</strong>
									<span>0 documents in queue - Ready (Default)</span>
								</div>
							</div>
							<div class="xp-explorer-item mode-tile printer-card-item" id="printer-item-laser" style="cursor: pointer;">
								<img src="../assets/images/desk/icons/Printer.webp" alt="">
								<div class="xp-tile-texts">
									<strong>HP LaserJet 4050 Series PCL</strong>
									<span>0 documents in queue - Ready</span>
								</div>
							</div>
							<div class="xp-explorer-item mode-tile printer-card-item" id="printer-item-fax" style="cursor: pointer;">
								<img src="../assets/images/desk/icons/Fax.webp" alt="">
								<div class="xp-tile-texts">
									<strong>Fax Service Console</strong>
									<span>Ready</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="xp-explorer-statusbar">
				<div class="xp-sb-pane xp-sb-count">4 objects</div>
				<div class="xp-sb-pane xp-sb-zone"><img src="../assets/images/desk/icons/My Computer.webp" alt=""><span>Local Computer</span></div>
			</div>
		</div>
	`;

	const bounds = (window.WindowManager && typeof window.WindowManager.getWorkspaceBounds === 'function') 
		? window.WindowManager.getWorkspaceBounds() 
		: { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight - 36, right: window.innerWidth, bottom: window.innerHeight - 36 };

	let targetX = options ? options.x : undefined;
	let targetY = options ? options.y : undefined;
	if (typeof targetX === 'number' && typeof targetY === 'number') {
		targetX = Math.max(bounds.left + 8, Math.min(targetX, bounds.right - 720 - 8));
		targetY = Math.max(bounds.top + 8, Math.min(targetY, bounds.bottom - 480 - 8));
	}

	const win = createXPWindow(id, 'Printers and Faxes', contentHTML, 720, 480, {
		iconSrc: '../assets/images/desk/icons/Fax.webp',
		x: targetX,
		y: targetY
	});
	win.querySelector('.xp-window-content').style.padding = '0';

	const triggerAdd = () => showXPDialog('Add Printer Wizard', 'The Add Printer Wizard could not detect any local parallel or USB printer.', 'warning');
	const triggerFax = () => showXPDialog('Fax Console', 'Fax device is idle. Line is connected and ready to transmit.', 'info');
	const triggerQueue = () => showXPDialog('PDF Document Writer', '0 document(s) in queue.', 'info');

	win.querySelector('#printer-item-add').addEventListener('dblclick', triggerAdd);
	win.querySelector('#printer-task-add').addEventListener('click', (e) => { e.preventDefault(); triggerAdd(); });
	win.querySelector('#printer-item-fax').addEventListener('dblclick', triggerFax);
	win.querySelector('#printer-task-fax').addEventListener('click', (e) => { e.preventDefault(); triggerFax(); });
	win.querySelector('#printer-item-pdf').addEventListener('dblclick', triggerQueue);
	win.querySelector('#printer-item-laser').addEventListener('dblclick', () => showXPDialog('HP LaserJet 4050', '0 document(s) in queue.', 'info'));
	win.querySelector('#printer-task-queue').addEventListener('click', (e) => { e.preventDefault(); triggerQueue(); });

	win.querySelector('#printer-link-troubleshoot').addEventListener('click', (e) => {
		e.preventDefault();
		showXPDialog('Help and Support', 'Printing Troubleshooter: Check cables, toner status and spooler service.', 'info');
	});
	win.querySelector('#printer-link-ctrl').addEventListener('click', (e) => {
		e.preventDefault();
		if (window.SettingsApp) window.SettingsApp.open('system');
	});
	win.querySelector('#printer-place-mycomp').addEventListener('click', (e) => {
		e.preventDefault();
		if (window.DeskAPI && window.DeskAPI.openMyComputer) window.DeskAPI.openMyComputer();
	});
	win.querySelector('#printer-place-mydocs').addEventListener('click', (e) => {
		e.preventDefault();
		if (fs.root.getByName('PDFs')) openFolderWindow(fs.root.getByName('PDFs'));
	});

	return win;
}

function openNetworkPlacesWindow(options = {}) {
	const id = 'window-network-places';
	const existing = document.getElementById(id);
	if (existing) {
		bringWindowToFront(existing);
		return existing;
	}

	const contentHTML = `
		<div class="xp-explorer-layout">
			<div class="xp-explorer-menubar">
				<ul class="xp-menubar-list">
					<li class="xp-menubar-item"><u>F</u>ile</li>
					<li class="xp-menubar-item"><u>E</u>dit</li>
					<li class="xp-menubar-item"><u>V</u>iew</li>
					<li class="xp-menubar-item"><u>F</u>avorites</li>
					<li class="xp-menubar-item"><u>T</u>ools</li>
					<li class="xp-menubar-item"><u>H</u>elp</li>
				</ul>
				<div class="xp-menubar-brand">
					<img src="../assets/images/desk/window_logo.png" alt="XP">
				</div>
			</div>
			<div class="xp-explorer-toolbar">
				<div class="xp-tb-group">
					<button type="button" class="xp-tb-btn tb-back" disabled><div class="xp-tb-icon-back"></div><span>Back</span></button>
					<button type="button" class="xp-tb-btn tb-forward" disabled><div class="xp-tb-icon-forward"></div></button>
					<button type="button" class="xp-tb-btn tb-up" disabled><div class="xp-tb-icon-up"></div></button>
				</div>
				<div class="xp-tb-sep"></div>
				<div class="xp-tb-group">
					<button type="button" class="xp-tb-btn tb-search" id="net-tb-search"><img src="../assets/images/desk/icons/Search.webp" alt=""><span>Search</span></button>
					<button type="button" class="xp-tb-btn" id="net-tb-folders"><img src="../assets/images/desk/icons/Folder Closed.webp" alt=""><span>Folders</span></button>
				</div>
			</div>
			<div class="xp-explorer-addressbar-row">
				<span class="xp-address-label">Address</span>
				<div class="xp-address-combo">
					<img src="../assets/images/desk/icons/My Network Places.webp" class="xp-address-icon" alt="">
					<input type="text" class="xp-address-input" value="My Network Places" readonly>
				</div>
				<button type="button" class="xp-address-go-btn"><div class="xp-go-icon">➔</div><span>Go</span></button>
			</div>
			<div class="xp-explorer-body">
				<div class="xp-explorer-sidebar">
					<div class="xp-sidebar-tasks-view">
						<div class="xp-task-box">
							<div class="xp-task-header"><span>Network Tasks</span><button type="button" class="xp-task-chevron"></button></div>
							<div class="xp-task-content">
								<a href="#" class="xp-task-link" id="net-task-add"><img src="../assets/images/desk/icons/Network Computers.webp" alt=""><span>Add a network place</span></a>
								<a href="#" class="xp-task-link" id="net-task-view"><img src="../assets/images/desk/icons/Network Computers.webp" alt=""><span>View network connections</span></a>
								<a href="#" class="xp-task-link" id="net-task-setup"><img src="../assets/images/desk/icons/Earth (fixed).webp" alt=""><span>Set up home or office network</span></a>
							</div>
						</div>
						<div class="xp-task-box">
							<div class="xp-task-header"><span>Other Places</span><button type="button" class="xp-task-chevron"></button></div>
							<div class="xp-task-content">
								<a href="#" class="xp-task-link" id="net-place-desktop"><img src="../assets/images/desk/icons/Display.webp" alt=""><span>Desktop</span></a>
								<a href="#" class="xp-task-link" id="net-place-mycomp"><img src="../assets/images/desk/icons/My Computer.webp" alt=""><span>My Computer</span></a>
								<a href="#" class="xp-task-link" id="net-place-mydocs"><img src="../assets/images/desk/icons/My Profile Folder.webp" alt=""><span>My Documents</span></a>
								<a href="#" class="xp-task-link" id="net-place-printers"><img src="../assets/images/desk/icons/Fax.webp" alt=""><span>Printers and Faxes</span></a>
							</div>
						</div>
					</div>
				</div>
				<div class="xp-explorer-splitter"></div>
				<div class="xp-explorer-main">
					<div class="xp-explorer-view-container">
						<div class="xp-file-grid view-tiles" style="padding: 12px; gap: 10px;">
							<div class="xp-explorer-item mode-tile net-card-item" id="net-item-add" style="cursor: pointer;">
								<img src="https://api.iconify.design/mdi/folder-network-outline.svg?color=%231b4b9b" alt="">
								<div class="xp-tile-texts">
									<strong>Add Network Place</strong>
									<span>Network Place Wizard</span>
								</div>
							</div>
							<div class="xp-explorer-item mode-tile net-card-item" id="net-item-entire" style="cursor: pointer;">
								<img src="../assets/images/desk/icons/Earth (fixed).webp" alt="">
								<div class="xp-tile-texts">
									<strong>Entire Network</strong>
									<span>Microsoft Windows Network</span>
								</div>
							</div>
							<div class="xp-explorer-item mode-tile net-card-item" id="net-item-workgroup" style="cursor: pointer;">
								<img src="../assets/images/desk/icons/Network Computers.webp" alt="">
								<div class="xp-tile-texts">
									<strong>Workgroup (MSHOME)</strong>
									<span>Local Workgroup Share</span>
								</div>
							</div>
							<div class="xp-explorer-item mode-tile net-card-item" id="net-item-laptop" style="cursor: pointer;">
								<img src="../assets/images/desk/icons/Laptop.webp" alt="">
								<div class="xp-tile-texts">
									<strong>Colin-Laptop (192.168.1.42)</strong>
									<span>SMB Network Share</span>
								</div>
							</div>
							<div class="xp-explorer-item mode-tile net-card-item" data-url="https://github.com/wartets" style="cursor: pointer;">
								<img src="https://img.icons8.com/fluent/48/000000/github.png" alt="">
								<div class="xp-tile-texts">
									<strong>GitHub Profile (Web)</strong>
									<span>https://github.com/wartets</span>
								</div>
							</div>
							<div class="xp-explorer-item mode-tile net-card-item" data-url="https://soundcloud.com/wartets" style="cursor: pointer;">
								<img src="https://api.iconify.design/mdi/soundcloud.svg?color=%23ff5500" alt="">
								<div class="xp-tile-texts">
									<strong>SoundCloud Channel (Web)</strong>
									<span>https://soundcloud.com/wartets</span>
								</div>
							</div>
							<div class="xp-explorer-item mode-tile net-card-item" data-url="https://www.youtube.com/@Wartets" style="cursor: pointer;">
								<img src="https://api.iconify.design/mdi/youtube.svg?color=%23cc0000" alt="">
								<div class="xp-tile-texts">
									<strong>YouTube Channel (Web)</strong>
									<span>https://youtube.com/@Wartets</span>
								</div>
							</div>
							<div class="xp-explorer-item mode-tile net-card-item" data-url="https://wartets.github.io/" style="cursor: pointer;">
								<img src="https://img.icons8.com/fluent/48/domain.png" alt="">
								<div class="xp-tile-texts">
									<strong>Live Portfolio Web (Host)</strong>
									<span>https://wartets.github.io/</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="xp-explorer-statusbar">
				<div class="xp-sb-pane xp-sb-count">8 objects</div>
				<div class="xp-sb-pane xp-sb-zone"><img src="../assets/images/desk/icons/My Network Places.webp" alt=""><span>Local Intranet</span></div>
			</div>
		</div>
	`;

	const bounds = (window.WindowManager && typeof window.WindowManager.getWorkspaceBounds === 'function') 
		? window.WindowManager.getWorkspaceBounds() 
		: { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight - 36, right: window.innerWidth, bottom: window.innerHeight - 36 };

	let targetX = options ? options.x : undefined;
	let targetY = options ? options.y : undefined;
	if (typeof targetX === 'number' && typeof targetY === 'number') {
		targetX = Math.max(bounds.left + 8, Math.min(targetX, bounds.right - 740 - 8));
		targetY = Math.max(bounds.top + 8, Math.min(targetY, bounds.bottom - 500 - 8));
	}

	const win = createXPWindow(id, 'My Network Places', contentHTML, 740, 500, {
		iconSrc: '../assets/images/desk/icons/My Network Places.webp',
		x: targetX,
		y: targetY
	});
	win.querySelector('.xp-window-content').style.padding = '0';

	const triggerAddPlace = () => showXPDialog('Add Network Place Wizard', 'Type the address of the FTP site or network folder you want to add.', 'info');
	const triggerViewConn = () => showXPDialog('Network Connections', 'Local Area Connection - 100.0 Mbps Connected\nWAN Miniport - Idle', 'info');

	win.querySelector('#net-item-add').addEventListener('dblclick', triggerAddPlace);
	win.querySelector('#net-task-add').addEventListener('click', (e) => { e.preventDefault(); triggerAddPlace(); });
	win.querySelector('#net-task-view').addEventListener('click', (e) => { e.preventDefault(); triggerViewConn(); });
	win.querySelector('#net-task-setup').addEventListener('click', (e) => {
		e.preventDefault();
		showXPDialog('Network Setup Wizard', 'Your home network is configured with IP 192.168.1.1 gateway.', 'info');
	});

	win.querySelector('#net-item-entire').addEventListener('dblclick', () => showXPDialog('Entire Network', 'Scanning Microsoft Windows Network domains... (MSHOME)', 'info'));
	win.querySelector('#net-item-workgroup').addEventListener('dblclick', () => showXPDialog('Workgroup (MSHOME)', 'Found hosts: Colin-Laptop, Router-Gateway.', 'info'));
	win.querySelector('#net-item-laptop').addEventListener('dblclick', () => showXPDialog('Colin-Laptop', 'Shared resources:\n\\\\Colin-Laptop\\Public\n\\\\Colin-Laptop\\Projects', 'info'));

	win.querySelectorAll('.net-card-item[data-url]').forEach(item => {
		item.addEventListener('dblclick', () => window.open(item.dataset.url, '_blank'));
	});

	win.querySelector('#net-place-desktop').addEventListener('click', (e) => {
		e.preventDefault();
		openFolderWindow(fs.root);
	});
	win.querySelector('#net-place-mycomp').addEventListener('click', (e) => {
		e.preventDefault();
		if (window.DeskAPI && window.DeskAPI.openMyComputer) window.DeskAPI.openMyComputer();
	});
	win.querySelector('#net-place-mydocs').addEventListener('click', (e) => {
		e.preventDefault();
		if (fs.root.getByName('PDFs')) openFolderWindow(fs.root.getByName('PDFs'));
	});
	win.querySelector('#net-place-printers').addEventListener('click', (e) => {
		e.preventDefault();
		if (window.DeskAPI && window.DeskAPI.openPrinters) window.DeskAPI.openPrinters();
	});

	return win;
}

function openShutdownDialog() {
	if (document.getElementById('xp-shutdown-overlay')) return;

	const desktop = document.getElementById('desktop');
	const taskbar = document.getElementById('taskbar');
	
	const overlay = document.createElement('div');
	overlay.id = 'xp-shutdown-overlay';
	overlay.style.position = 'fixed';
	overlay.style.top = '0';
	overlay.style.left = '0';
	overlay.style.width = '100vw';
	overlay.style.height = '100vh';
	overlay.style.zIndex = '99999';
	overlay.style.display = 'flex';
	overlay.style.alignItems = 'center';
	overlay.style.justifyContent = 'center';
	
	desktop.style.filter = 'grayscale(100%)';
	taskbar.style.filter = 'grayscale(100%)';

	overlay.innerHTML = `
		<div style="background-color: #003399; width: 100%; height: 100%; position: absolute; opacity: 0.3;"></div>
		<div style="width: 410px; height: 200px; background: linear-gradient(to bottom, #003399 0%, #003399 15%, #ece9d8 15%, #ece9d8 100%); position: relative; border: 2px solid white; border-radius: 3px; box-shadow: 10px 10px 20px rgba(0,0,0,0.5); display: flex; flex-direction: column; overflow: hidden;">
			<div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 10px; color: white; font-weight: bold; font-family: sans-serif; height: 30px;">
				<span>Turn off computer</span>
				<img src="../assets/images/desk/window_logo.png" style="height: 20px; opacity: 0.8;">
			</div>
			<div style="flex-grow: 1; display: flex; justify-content: center; align-items: center; gap: 20px; padding: 20px;">
				<div class="shutdown-option" id="btn-standby-action" style="text-align: center; cursor: pointer;">
					<div style="width: 35px; height: 35px; background-color: #eebb00; border-radius: 50%; border: 2px solid white; margin: 0 auto 5px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 5px rgba(0,0,0,0.3);">
						<img src="https://api.iconify.design/mdi/sleep.svg?color=white" style="width: 20px;">
					</div>
					<span style="font-size: 11px;">Standby</span>
				</div>
				<div class="shutdown-option" id="btn-shutdown-action" style="text-align: center; cursor: pointer;">
					<div style="width: 35px; height: 35px; background-color: #cc3333; border-radius: 50%; border: 2px solid white; margin: 0 auto 5px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 5px rgba(0,0,0,0.3);">
						<img src="https://api.iconify.design/mdi/power.svg?color=white" style="width: 20px;">
					</div>
					<span style="font-size: 11px;">Turn Off</span>
				</div>
				<div class="shutdown-option" id="btn-restart-action" style="text-align: center; cursor: pointer;">
					<div style="width: 35px; height: 35px; background-color: #33cc33; border-radius: 50%; border: 2px solid white; margin: 0 auto 5px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 5px rgba(0,0,0,0.3);">
						<img src="https://api.iconify.design/mdi/restart.svg?color=white" style="width: 20px;">
					</div>
					<span style="font-size: 11px;">Restart</span>
				</div>
			</div>
			<div style="padding: 10px; display: flex; justify-content: flex-end;">
				<button class="xp-button" id="btn-shutdown-cancel" style="padding: 3px 15px;">Cancel</button>
			</div>
		</div>
	`;

	document.body.appendChild(overlay);

	const closeOverlay = () => {
		overlay.remove();
		desktop.style.filter = 'none';
		taskbar.style.filter = 'none';
	};

	overlay.querySelector('#btn-shutdown-cancel').addEventListener('click', closeOverlay);
	
	overlay.querySelector('#btn-standby-action').addEventListener('click', () => {
		closeOverlay();
		const welcome = document.getElementById('welcome-screen');
		if (welcome) {
			welcome.classList.remove('hidden');
			welcome.style.opacity = '1';
			welcome.style.display = 'flex';
		}
	});

	overlay.querySelector('#btn-restart-action').addEventListener('click', () => {
		closeOverlay();
		location.reload();
	});

	overlay.querySelector('#btn-shutdown-action').addEventListener('click', () => {
		overlay.innerHTML = '<div style="background-color: black; width: 100%; height: 100%;"></div>';
		setTimeout(() => {
			document.body.innerHTML = '';
			document.body.style.backgroundColor = 'black';
			document.body.style.cursor = 'none';
		}, 1000);
	});
}

function triggerBSOD() {
	const bsod = document.createElement('div');
	bsod.style.position = 'fixed';
	bsod.style.top = '0';
	bsod.style.left = '0';
	bsod.style.width = '100vw';
	bsod.style.height = '100vh';
	bsod.style.backgroundColor = '#000082';
	bsod.style.color = 'white';
	bsod.style.fontFamily = "'Lucida Console', monospace";
	bsod.style.fontSize = '14px';
	bsod.style.zIndex = '9999999';
	bsod.style.padding = '50px';
	bsod.style.boxSizing = 'border-box';
	bsod.style.cursor = 'none';

	bsod.innerHTML = `
		<p>A problem has been detected and Windows has been shut down to prevent damage to your computer.</p>
		<p>PROCESS_HAS_LOCKED_PAGES</p>
		<br>
		<p>If this is the first time you've seen this Stop error screen, restart your computer. If this screen appears again, follow these steps:</p>
		<p>Check to make sure any new hardware or software is properly installed. If this is a new installation, ask your hardware or software manufacturer for any Windows updates you might need.</p>
		<p>If problems continue, disable or remove any newly installed hardware or software. Disable BIOS memory options such as caching or shadowing. If you need to use Safe Mode to remove or disable components, restart your computer, press F8 to select Advanced Startup Options, and then select Safe Mode.</p>
		<br>
		<p>Technical information:</p>
		<p>*** STOP: 0x00000076 (0x00000000, 0x00000000, 0x00000000, 0x00000000)</p>
		<br>
		<p>Beginning dump of physical memory</p>
		<p>Physical memory dump complete.</p>
		<p>Contact your system administrator or technical support group for further assistance.</p>
	`;

	document.body.appendChild(bsod);
	
	document.addEventListener('keydown', () => location.reload());
	document.addEventListener('click', () => location.reload());
}

function showDesktop() {
	if (window.Taskbar && typeof window.Taskbar.showDesktop === 'function') {
		window.Taskbar.showDesktop();
		return;
	}
	if (window.WindowManager) {
		window.WindowManager.minimizeAll();
		return;
	}
	Object.values(openWindows).forEach(win => {
		if (!win.classList.contains('minimized')) {
			minimizeWindow(win, win.id);
		}
	});
}

function openInternetExplorer(url = 'about:home') {
	if (window.InternetExplorerApp) {
		return window.InternetExplorerApp.open(url);
	}
}

async function openOutlookExpress(options = {}) {
	const id = 'window-outlook-express';
	if (document.getElementById(id)) {
		bringWindowToFront(document.getElementById(id));
		return document.getElementById(id);
	}

	MailStore.init();

	const contentHTML = `
		<div class="outlook-window-layout">
			<div class="folder-menu-bar" id="oe-menubar">
				<ul>
					<li data-oe-menu="file"><u>F</u>ile</li>
					<li data-oe-menu="edit"><u>E</u>dit</li>
					<li data-oe-menu="view"><u>V</u>iew</li>
					<li data-oe-menu="tools"><u>T</u>ools</li>
					<li data-oe-menu="message"><u>M</u>essage</li>
					<li data-oe-menu="help"><u>H</u>elp</li>
				</ul>
			</div>
			<div class="outlook-toolbar">
				<button class="outlook-tool-btn" data-action="new"><img src="../assets/images/desk/icons/List File.webp" alt="Create Mail"><span>Create Mail</span></button>
				<button class="outlook-tool-btn" data-action="reply"><img src="https://api.iconify.design/mdi/reply.svg?color=%23245edc" alt="Reply"><span>Reply</span></button>
				<button class="outlook-tool-btn" data-action="forward"><img src="https://api.iconify.design/mdi/share.svg?color=%23245edc" alt="Forward"><span>Forward</span></button>
				<button class="outlook-tool-btn" data-action="delete"><img src="https://api.iconify.design/mdi/delete.svg?color=%23cc3333" alt="Delete"><span>Delete</span></button>
				<div class="outlook-separator"></div>
				<button class="outlook-tool-btn" data-action="new-folder"><img src="../assets/images/desk/icons/Folder Closed.webp" alt="New Folder"><span>New Folder</span></button>
				<div style="flex:1"></div>
				<button id="oe-collapse-folders" class="outlook-tool-btn"><img src="../assets/images/desk/icons/Folder Open.webp" alt="Folders"><span>Folders</span></button>
			</div>
			<div class="outlook-main-content">
				<div class="outlook-folder-pane" id="oe-folders">
					<h4>Folders</h4>
					<ul id="oe-folder-list"></ul>
				</div>
				<div class="splitter-vertical" id="oe-splitter-vertical"></div>
				<div class="outlook-right-section" id="oe-right">
					<div class="outlook-message-pane" id="oe-messages">
						<div class="outlook-message-header">
							<div>From</div>
							<div>Subject</div>
							<div>Received</div>
						</div>
						<ul class="outlook-message-list"></ul>
					</div>
					<div class="splitter-horizontal" id="oe-splitter-horizontal"></div>
					<div class="outlook-preview-pane" id="oe-preview">
						<div class="outlook-preview-header">
							<div><b>From:</b> <span id="preview-from"></span></div>
							<div><b>Date:</b> <span id="preview-date"></span></div>
							<div><b>Subject:</b> <span id="preview-subject"></span></div>
						</div>
						<div class="outlook-preview-body" id="preview-body"></div>
					</div>
				</div>
			</div>
		</div>
	`;
	const bounds = (window.WindowManager && typeof window.WindowManager.getWorkspaceBounds === 'function') 
		? window.WindowManager.getWorkspaceBounds() 
		: { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight - 36, right: window.innerWidth, bottom: window.innerHeight - 36 };

	let targetX = options ? options.x : undefined;
	let targetY = options ? options.y : undefined;
	if (typeof targetX === 'number' && typeof targetY === 'number') {
		targetX = Math.max(bounds.left + 8, Math.min(targetX, bounds.right - APP_WINDOW_BASE_SIZES.outlook.width - 8));
		targetY = Math.max(bounds.top + 8, Math.min(targetY, bounds.bottom - APP_WINDOW_BASE_SIZES.outlook.height - 8));
	}

	const outlookWindow = createXPWindow(id, 'Outlook Express', contentHTML, APP_WINDOW_BASE_SIZES.outlook.width, APP_WINDOW_BASE_SIZES.outlook.height, {
		iconSrc: '../assets/images/desk/icons/Mail.webp',
		x: targetX,
		y: targetY
	});
	outlookWindow.querySelector('.xp-window-content').style.padding = '0';

	const folderListEl = outlookWindow.querySelector('#oe-folder-list');
	const messageList = outlookWindow.querySelector('.outlook-message-list');
	const previewFrom = outlookWindow.querySelector('#preview-from');
	const previewDate = outlookWindow.querySelector('#preview-date');
	const previewSubject = outlookWindow.querySelector('#preview-subject');
	const previewBody = outlookWindow.querySelector('#preview-body');

	outlookWindow.querySelectorAll('#oe-menubar li[data-oe-menu]').forEach(menuLi => {
		menuLi.addEventListener('click', (e) => {
			e.stopPropagation();
			const menuType = menuLi.dataset.oeMenu;
			const rect = menuLi.getBoundingClientRect();
			const hasSelection = !!selectedMessageId && !!MailStore.getMessageById(selectedMessageId);
			const selectedMsg = hasSelection ? MailStore.getMessageById(selectedMessageId) : null;
			let items = [];

			if (menuType === 'file') {
				items = [
					{
						label: 'New',
						submenu: [
							{ label: 'Mail Message', shortcut: 'Ctrl+N', action: () => openComposeWindow() },
							{ label: 'Folder...', action: promptNewFolder }
						]
					},
					{
						label: 'Open',
						disabled: !hasSelection,
						action: () => {
							if (selectedMsg) {
								if (currentFolderId === 'drafts') {
									openComposeWindow({ draftId: selectedMsg.id, to: selectedMsg.to, subject: selectedMsg.subject, body: htmlToPlainText(selectedMsg.body) });
								} else {
									openMessageWindow(selectedMsg);
								}
							}
						}
					},
					{ separator: true },
					{
						label: 'Delete',
						shortcut: 'Del',
						disabled: !hasSelection,
						action: () => {
							if (selectedMsg) {
								MailStore.deleteMessage(selectedMsg.id);
								selectedMessageId = null;
								renderMessageList();
								renderFolderList();
								clearPreview();
							}
						}
					},
					{
						label: 'Properties',
						disabled: !hasSelection,
						action: () => {
							if (selectedMsg) openMailInfoWindow(selectedMsg);
						}
					},
					{ separator: true },
					{ label: 'Close', action: () => closeWindow(outlookWindow, id) }
				];
			} else if (menuType === 'edit') {
				items = [
					{
						label: 'Select All',
						shortcut: 'Ctrl+A',
						action: () => {
							const rows = outlookWindow.querySelectorAll('.outlook-message-list .msg-row');
							rows.forEach(r => r.classList.add('selected'));
						}
					},
					{
						label: 'Mark as Read',
						disabled: !hasSelection,
						action: () => {
							if (selectedMsg) {
								MailStore.markRead(selectedMsg.id, true);
								renderMessageList();
								renderFolderList();
							}
						}
					},
					{
						label: 'Mark as Unread',
						disabled: !hasSelection,
						action: () => {
							if (selectedMsg) {
								MailStore.markRead(selectedMsg.id, false);
								renderMessageList();
								renderFolderList();
							}
						}
					},
					{
						label: 'Mark All as Read',
						action: () => {
							MailStore.getMessages(currentFolderId).forEach(m => MailStore.markRead(m.id, true));
							renderMessageList();
							renderFolderList();
						}
					}
				];
			} else if (menuType === 'view') {
				items = [
					{
						label: 'Folders Pane',
						checked: !foldersPane.classList.contains('collapsed'),
						action: () => {
							if (collapseBtn) collapseBtn.click();
						}
					},
					{
						label: 'Preview Pane',
						checked: previewPane.style.display !== 'none',
						action: () => {
							const isHidden = previewPane.style.display === 'none';
							previewPane.style.display = isHidden ? 'flex' : 'none';
							if (splitterH) splitterH.style.display = isHidden ? 'block' : 'none';
						}
					},
					{ separator: true },
					{
						label: 'Refresh',
						shortcut: 'F5',
						action: () => {
							renderFolderList();
							renderMessageList();
						}
					}
				];
			} else if (menuType === 'tools') {
				items = [
					{
						label: 'Send and Receive All',
						shortcut: 'F5',
						action: () => {
							MailStore.ensureDailyContent().then(added => {
								renderFolderList();
								renderMessageList();
								showXPDialog('Send/Receive Complete', 'All mail folders are up to date.', 'info');
							});
						}
					},
					{ separator: true },
					{
						label: 'Accounts...',
						action: () => {
							showXPDialog('Internet Accounts', 'Account: Colin B.R.\nProtocol: POP3/SMTP (Simulated Local Store)', 'info');
						}
					},
					{
						label: 'Options...',
						action: () => {
							if (window.SettingsApp) window.SettingsApp.open('system');
						}
					}
				];
			} else if (menuType === 'message') {
				items = [
					{ label: 'New Message', shortcut: 'Ctrl+N', action: () => openComposeWindow() },
					{
						label: 'Reply to Sender',
						shortcut: 'Ctrl+R',
						disabled: !hasSelection,
						action: () => {
							if (selectedMsg) openComposeWindow(buildReply(selectedMsg));
						}
					},
					{
						label: 'Forward',
						shortcut: 'Ctrl+F',
						disabled: !hasSelection,
						action: () => {
							if (selectedMsg) openComposeWindow(buildForward(selectedMsg));
						}
					}
				];
			} else if (menuType === 'help') {
				items = [
					{ label: 'Contents and Index', action: () => window.open('https://github.com/wartets/Wartets.github.io', '_blank') },
					{ separator: true },
					{
						label: 'About Microsoft Outlook Express',
						bold: true,
						action: () => {
							showXPDialog('About Outlook Express', 'Microsoft Outlook Express 6.0\nRunning on Windows XP Professional\nPortfolio Communications Client', 'info');
						}
					}
				];
			}

			if (window.ContextMenu) {
				window.ContextMenu.show(items, rect.left, rect.bottom + 2);
			}
		});
	});

	const collapseBtn = outlookWindow.querySelector('#oe-collapse-folders');
	const foldersPane = outlookWindow.querySelector('#oe-folders');
	const splitterV = outlookWindow.querySelector('#oe-splitter-vertical');
	const splitterH = outlookWindow.querySelector('#oe-splitter-horizontal');
	const messagesPane = outlookWindow.querySelector('#oe-messages');
	const previewPane = outlookWindow.querySelector('#oe-preview');

	if (foldersPane) foldersPane.style.width = foldersPane.style.width || '200px';

	if (foldersPane) {
		foldersPane.addEventListener('contextmenu', (e) => {
			e.preventDefault();
			showGenericContextMenu(e.clientX, e.clientY, [
				{ label: 'New Folder', action: promptNewFolder }
			]);
		});
	}

	if (collapseBtn && foldersPane) {
		collapseBtn.addEventListener('click', () => {
			const isCollapsed = foldersPane.classList.toggle('collapsed');
			if (isCollapsed) {
				foldersPane.style.width = '0px';
				collapseBtn.querySelector('img').src = 'https://api.iconify.design/mdi/chevron-right.svg';
				collapseBtn.querySelector('span').textContent = 'Show Folders';
			} else {
				foldersPane.style.width = '200px';
				collapseBtn.querySelector('img').src = 'https://api.iconify.design/mdi/chevron-left.svg';
				collapseBtn.querySelector('span').textContent = 'Hide Folders';
			}
		});
	}

	if (splitterV && foldersPane) {
		splitterV.addEventListener('mousedown', (e) => {
			e.preventDefault();
			const startX = e.clientX;
			const startW = foldersPane.getBoundingClientRect().width;
			document.body.style.userSelect = 'none';
			function onMove(ev) {
				const delta = ev.clientX - startX;
				const newW = Math.max(80, Math.min(window.innerWidth - 220, startW + delta));
				foldersPane.style.width = newW + 'px';
			}
			function onUp() {
				document.removeEventListener('mousemove', onMove);
				document.removeEventListener('mouseup', onUp);
				document.body.style.userSelect = '';
			}
			document.addEventListener('mousemove', onMove);
			document.addEventListener('mouseup', onUp);
		});
	}

	if (splitterH && messagesPane && previewPane) {
		splitterH.addEventListener('mousedown', (e) => {
			e.preventDefault();
			const startY = e.clientY;
			const startH = messagesPane.getBoundingClientRect().height;
			document.body.style.userSelect = 'none';
			function onMove(ev) {
				const delta = ev.clientY - startY;
				const newH = Math.max(80, Math.min(window.innerHeight - 200, startH + delta));
				messagesPane.style.flex = '0 0 auto';
				messagesPane.style.height = newH + 'px';
			}
			function onUp() {
				document.removeEventListener('mousemove', onMove);
				document.removeEventListener('mouseup', onUp);
				document.body.style.userSelect = '';
			}
			document.addEventListener('mousemove', onMove);
			document.addEventListener('mouseup', onUp);
		});
	}

	let currentFolderId = 'inbox';
	let selectedMessageId = null;

	function showGenericContextMenu(x, y, items) {
		if (window.ContextMenu) {
			window.ContextMenu.show(items, x, y);
		}
	}

	function renderFolderList() {
		folderListEl.innerHTML = '';
		MailStore.getFolders().forEach(folder => {
			const li = document.createElement('li');
			li.dataset.folder = folder.id;
			if (folder.id === currentFolderId) li.classList.add('active');
			const img = document.createElement('img');
			img.src = folder.icon;
			const span = document.createElement('span');
			span.textContent = folder.name;
			li.appendChild(img);
			li.appendChild(span);

			const unreadCount = MailStore.getMessages(folder.id).filter(message => !message.read).length;
			if (unreadCount > 0) {
				span.style.fontWeight = 'bold';
				const badge = document.createElement('span');
				badge.className = 'oe-unread-badge';
				badge.textContent = unreadCount > 5 ? '5+' : String(unreadCount);
				li.appendChild(badge);
			}

			li.addEventListener('click', () => {
				currentFolderId = folder.id;
				selectedMessageId = null;
				renderFolderList();
				renderMessageList();
				clearPreview();
			});

			li.addEventListener('contextmenu', (e) => {
				e.preventDefault();
				e.stopPropagation();
				const menuItems = [];
				if (folder.deletable) {
					menuItems.push({ label: 'Rename Folder', action: () => promptRenameFolder(folder) });
					menuItems.push({
						label: 'Delete Folder',
						action: () => {
							createConfirmationDialog(`Delete folder "${folder.name}"? Messages inside will be moved to Inbox.`, () => {
								try {
									MailStore.deleteFolder(folder.id);
									if (currentFolderId === folder.id) currentFolderId = 'inbox';
									renderFolderList();
									renderMessageList();
									clearPreview();
								} catch (err) {
									showXPDialog('Error', err.message, 'error');
								}
							});
						}
					});
					menuItems.push({ separator: true });
				}
				menuItems.push({ label: 'New Folder', action: promptNewFolder });
				showGenericContextMenu(e.clientX, e.clientY, menuItems);
			});

			folderListEl.appendChild(li);
		});
		updateOutlookUnreadBadge();
	}

	function promptNewFolder() {
		openFolderNamePrompt('New Folder', '', (name) => {
			try {
				MailStore.createFolder(name);
				renderFolderList();
			} catch (err) {
				showXPDialog('Error', err.message, 'error');
			}
		});
	}

	function promptRenameFolder(folder) {
		openFolderNamePrompt('Rename Folder', folder.name, (name) => {
			try {
				MailStore.renameFolder(folder.id, name);
				renderFolderList();
			} catch (err) {
				showXPDialog('Error', err.message, 'error');
			}
		});
	}

	function openFolderNamePrompt(title, initialValue, onConfirm) {
		const dialogId = `dialog-folder-name-${Date.now()}`;
		const content = `
			<div style="padding:15px;display:flex;flex-direction:column;gap:10px;">
				<label for="folder-name-input">Folder name:</label>
				<input type="text" id="folder-name-input" value="${initialValue.replace(/"/g, '&quot;')}" style="padding:4px;">
				<div style="display:flex;justify-content:flex-end;gap:8px;">
					<button class="xp-button" id="folder-name-ok">OK</button>
					<button class="xp-button" id="folder-name-cancel">Cancel</button>
				</div>
			</div>
		`;
		const dialog = createXPWindow(dialogId, title, content, 320, 150, { resizable: false, isModal: true });
		const input = dialog.querySelector('#folder-name-input');
		input.focus();
		input.select();
		const confirm = () => {
			const value = input.value;
			closeWindow(dialog, dialogId);
			onConfirm(value);
		};
		dialog.querySelector('#folder-name-ok').addEventListener('click', confirm);
		dialog.querySelector('#folder-name-cancel').addEventListener('click', () => closeWindow(dialog, dialogId));
		input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') confirm();
		});
	}

	function clearPreview() {
		previewFrom.textContent = '';
		previewDate.textContent = '';
		previewSubject.textContent = '';
		previewBody.innerHTML = '';
		updateToolbarState();
	}

	function updateToolbarState() {
		const hasSelection = !!selectedMessageId && !!MailStore.getMessageById(selectedMessageId);
		['reply', 'forward', 'delete'].forEach(action => {
			const btn = outlookWindow.querySelector(`.outlook-tool-btn[data-action="${action}"]`);
			if (btn) {
				btn.classList.toggle('disabled', !hasSelection);
				btn.disabled = !hasSelection;
			}
		});
	}

	function formatMessageDate(iso) {
		const date = new Date(iso);
		if (isNaN(date.getTime())) return iso;
		return date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
	}

	function renderMessageList() {
		messageList.innerHTML = '';
		const messages = MailStore.getMessages(currentFolderId);

		messages.forEach(message => {
			const li = document.createElement('li');
			li.className = 'msg-row';
			li.dataset.messageId = message.id;
			if (!message.read) li.style.fontWeight = 'bold';
			if (message.id === selectedMessageId) li.classList.add('selected');

			li.innerHTML = `
				<div class="col from">${message.from}</div>
				<div class="col subject">${message.subject}</div>
				<div class="col date">${formatMessageDate(message.date)}</div>
			`;

			li.addEventListener('click', () => {
				selectedMessageId = message.id;
				messageList.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
				li.classList.add('selected');
				if (!message.read) {
					MailStore.markRead(message.id, true);
					li.style.fontWeight = '';
					renderFolderList();
				}
				renderPreview(message.id);
				updateToolbarState();
			});

			li.addEventListener('dblclick', () => {
				if (currentFolderId === 'drafts') {
					openComposeWindow({ draftId: message.id, to: message.to, subject: message.subject, body: htmlToPlainText(message.body) });
				} else {
					openMessageWindow(message);
				}
			});

			li.addEventListener('contextmenu', (e) => {
				e.preventDefault();
				e.stopPropagation();
				selectedMessageId = message.id;
				messageList.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
				li.classList.add('selected');
				renderPreview(message.id);
				updateToolbarState();

				const moveItems = MailStore.getFolders()
					.filter(folder => folder.id !== currentFolderId)
					.map(folder => ({
						label: folder.name,
						action: () => {
							MailStore.moveMessage(message.id, folder.id);
							renderMessageList();
							renderFolderList();
							clearPreview();
						}
					}));

				showGenericContextMenu(e.clientX, e.clientY, [
					{ label: 'Open', action: () => (currentFolderId === 'drafts' ? openComposeWindow({ draftId: message.id, to: message.to, subject: message.subject, body: htmlToPlainText(message.body) }) : openMessageWindow(message)) },
					{ label: message.read ? 'Mark as Unread' : 'Mark as Read', action: () => { MailStore.markRead(message.id, !message.read); renderMessageList(); renderFolderList(); } },
					{ label: 'Reply', action: () => openComposeWindow(buildReply(message)) },
					{ label: 'Forward', action: () => openComposeWindow(buildForward(message)) },
					{ separator: true },
					{ label: 'Move to', action: () => showGenericContextMenu(e.clientX + 160, e.clientY, moveItems) },
					{ label: currentFolderId === 'deleted' ? 'Delete Permanently' : 'Delete', action: () => {
						MailStore.deleteMessage(message.id);
						selectedMessageId = null;
						renderMessageList();
						renderFolderList();
						clearPreview();
					} },
					{ separator: true },
					{ label: 'Properties', action: () => openMailInfoWindow(message) }
				]);
			});

			messageList.appendChild(li);
		});
	}

	function renderPreview(messageId) {
		const message = MailStore.getMessageById(messageId);
		if (!message) {
			clearPreview();
			return;
		}
		previewFrom.textContent = `${message.from} <${message.fromAddress || 'unknown'}>`;
		previewDate.textContent = formatMessageDate(message.date);
		previewSubject.textContent = message.subject;
		previewBody.innerHTML = message.body;
		previewBody.querySelectorAll('a').forEach(link => {
			link.addEventListener('click', () => {
				if (message.folderId === 'spam' || message.id === 'fixed-100' || (message.from && message.from.toLowerCase().includes('milfeuille'))) {
					if (window.AchievementsManager) {
						window.AchievementsManager.progress('mail_spam_click', 1);
					}
				}
			});
		});
	}

	function htmlToPlainText(html) {
		const container = document.createElement('div');
		container.innerHTML = html || '';
		return container.textContent || container.innerText || '';
	}

	function buildReply(message) {
		return {
			to: message.fromAddress || '',
			subject: message.subject.startsWith('Re:') ? message.subject : `Re: ${message.subject}`,
			body: `\n\nOriginal message\nFrom: ${message.from}\nDate: ${formatMessageDate(message.date)}\nSubject: ${message.subject}\n\n${htmlToPlainText(message.body)}`
		};
	}

	function buildForward(message) {
		return {
			to: '',
			subject: message.subject.startsWith('Fwd:') ? message.subject : `Fwd: ${message.subject}`,
			body: `\n\nForwarded message\nFrom: ${message.from}\nDate: ${formatMessageDate(message.date)}\nSubject: ${message.subject}\n\n${htmlToPlainText(message.body)}`
		};
	}

	function openMessageWindow(message) {
		const mid = `window-email-${message.id}`;
		if (document.getElementById(mid)) {
			bringWindowToFront(document.getElementById(mid));
			return;
		}
		const html = `
			<div style="padding:12px; font-family: Arial, sans-serif;">
				<h3 style="margin:0 0 8px 0;">${message.subject}</h3>
				<div style="color:#555; font-size:12px; margin-bottom:12px;"><strong>From:</strong> ${message.from} &lt;${message.fromAddress || 'unknown'}&gt; &nbsp; <strong>Date:</strong> ${formatMessageDate(message.date)}</div>
				<div style="border-top:1px solid #ddd; padding-top:10px;">${message.body}</div>
			</div>
		`;
		const win = createXPWindow(mid, message.subject, html, 520, 380, { iconSrc: '../assets/images/desk/icons/Mail.webp' });
		win.querySelector('.xp-window-content').style.padding = '0';
		win.querySelectorAll('a').forEach(link => {
			link.addEventListener('click', () => {
				if (message.folderId === 'spam' || message.id === 'fixed-100' || (message.from && message.from.toLowerCase().includes('milfeuille'))) {
					if (window.AchievementsManager) {
						window.AchievementsManager.progress('mail_spam_click', 1);
					}
				}
			});
		});
	}

	function openComposeWindow(prefill = {}) {
		const composeId = prefill.draftId ? `window-compose-${prefill.draftId}` : `window-compose-${Date.now()}`;
		if (document.getElementById(composeId)) {
			bringWindowToFront(document.getElementById(composeId));
			return;
		}

		let initialX = undefined;
		let initialY = undefined;
		if (outlookWindow) {
			const outlookRect = outlookWindow.getBoundingClientRect();
			initialX = Math.round(outlookRect.left + 35);
			initialY = Math.round(outlookRect.top + 30);
		}

		const content = `
			<div style="display:flex;flex-direction:column;height:100%;background:var(--xp-window-bg);font-family:'Tahoma',sans-serif;font-size:11px;">
				<div class="folder-menu-bar">
					<ul><li><u>F</u>ile</li><li><u>E</u>dit</li><li><u>V</u>iew</li><li><u>I</u>nsert</li><li><u>F</u>ormat</li><li><u>T</u>ools</li></ul>
				</div>
				<div class="outlook-toolbar">
					<button class="outlook-tool-btn" id="compose-send"><img src="https://api.iconify.design/mdi/send.svg?color=%23245edc" alt="Send"><span>Send</span></button>
					<button class="outlook-tool-btn" id="compose-save-draft"><img src="../assets/images/desk/icons/File.webp" alt="Save Draft"><span>Save Draft</span></button>
					<button class="outlook-tool-btn" id="compose-cancel"><img src="https://api.iconify.design/mdi/close.svg?color=%23cc3333" alt="Cancel"><span>Cancel</span></button>
				</div>
				<div style="display:flex;flex-direction:column;gap:4px;padding:6px 8px;border-bottom:1px solid var(--xp-border-light);background:var(--xp-window-bg);">
					<div style="display:flex;align-items:center;gap:6px;">
						<label style="width:55px;font-weight:bold;color:#000;">To:</label>
						<input type="text" id="compose-to" class="xp-input" style="flex:1;" value="${(prefill.to || '').replace(/"/g, '&quot;')}">
					</div>
					<div style="display:flex;align-items:center;gap:6px;">
						<label style="width:55px;font-weight:bold;color:#000;">Subject:</label>
						<input type="text" id="compose-subject" class="xp-input" style="flex:1;" value="${(prefill.subject || '').replace(/"/g, '&quot;')}">
					</div>
				</div>
				<div style="flex:1;padding:4px;background:var(--xp-window-bg);display:flex;">
					<textarea id="compose-body" style="flex:1;border:2px inset #ffffff;padding:8px;font-family:'Tahoma',Arial,sans-serif;font-size:12px;resize:none;outline:none;background:#ffffff;color:#000000;">${prefill.body || ''}</textarea>
				</div>
			</div>
		`;

		const win = createXPWindow(composeId, prefill.subject ? `New Message - ${prefill.subject}` : 'New Message', content, 560, 440, { 
			iconSrc: '../assets/images/desk/icons/Mail.webp',
			x: initialX,
			y: initialY
		});
		win.querySelector('.xp-window-content').style.padding = '0';
		bringWindowToFront(win);

		const toInput = win.querySelector('#compose-to');
		const subjectInput = win.querySelector('#compose-subject');
		const bodyInput = win.querySelector('#compose-body');

		win.querySelector('#compose-send').addEventListener('click', () => {
			try {
				MailStore.sendMessage({ to: toInput.value, subject: subjectInput.value, body: bodyInput.value });
				if (prefill.draftId) MailStore.deleteDraft(prefill.draftId);
				if (window.AchievementsManager) window.AchievementsManager.progress('mail_sender', 1);
				showXPDialog('Message Sent', `Your message has been sent to ${toInput.value}.`, 'info');
				closeWindow(win, composeId);
				if (currentFolderId === 'sent' || currentFolderId === 'drafts') renderMessageList();
			} catch (err) {
				showXPDialog('Error', err.message, 'error');
			}
		});

		win.querySelector('#compose-save-draft').addEventListener('click', () => {
			MailStore.saveDraft({ id: prefill.draftId, to: toInput.value, subject: subjectInput.value, body: bodyInput.value });
			closeWindow(win, composeId);
			if (currentFolderId === 'drafts') renderMessageList();
		});

		win.querySelector('#compose-cancel').addEventListener('click', () => closeWindow(win, composeId));
	}

	outlookWindow.querySelectorAll('.outlook-tool-btn[data-action]').forEach(btn => {
		btn.addEventListener('click', () => {
			const action = btn.dataset.action;
			if (action === 'new') {
				openComposeWindow();
			} else if (action === 'reply') {
				if (!selectedMessageId) {
					showXPDialog('Reply', 'Please select a message first.', 'warning');
					return;
				}
				const message = MailStore.getMessageById(selectedMessageId);
				if (message) openComposeWindow(buildReply(message));
			} else if (action === 'forward') {
				if (!selectedMessageId) {
					showXPDialog('Forward', 'Please select a message first.', 'warning');
					return;
				}
				const message = MailStore.getMessageById(selectedMessageId);
				if (message) openComposeWindow(buildForward(message));
			} else if (action === 'delete') {
				if (!selectedMessageId) {
					showXPDialog('Delete', 'Please select a message first.', 'warning');
					return;
				}
				MailStore.deleteMessage(selectedMessageId);
				selectedMessageId = null;
				renderMessageList();
				renderFolderList();
				clearPreview();
			} else if (action === 'new-folder') {
				promptNewFolder();
			}
		});
	});

	renderFolderList();
	renderMessageList();
	clearPreview();

	MailStore.ensureDailyContent().then(added => {
		if (added && document.getElementById(id)) {
			renderFolderList();
			if (currentFolderId === 'inbox') renderMessageList();
		}
	});

	return outlookWindow;
}
