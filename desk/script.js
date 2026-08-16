class Element {
	constructor(name, parent = null) {
		if (typeof name !== 'string' || name.trim() === '') {
			throw new Error('Element name must be a non-empty string.');
		}
		this.name = name;
		this.parent = parent;
		this.createdAt = new Date();
		this.modifiedAt = new Date();
		this.hidden = false;
	}

	rename(newName) {
		if (typeof newName !== 'string' || newName.trim() === '') {
			throw new Error('New name must be a non-empty string.');
		}
		const parent = this.parent;
		if (parent) {
			if (parent.children.has(newName)) {
				throw new Error(`An element named "${newName}" already exists in this folder.`);
			}
			const oldName = this.name;
			parent.children.delete(oldName);
			this.name = newName;
			parent.children.set(this.name, this);
			parent.modifiedAt = new Date();
		} else {
			this.name = newName;
		}
		this.modifiedAt = new Date();
	}

	getFullPath() {
		if (!this.parent) {
			return '/';
		}
		let path = '';
		let current = this;
		while (current.parent) {
			path = `/${current.name}${path}`;
			current = current.parent;
		}
		return path;
	}

	toJSON() {
		return {
			name: this.name,
			createdAt: this.createdAt,
			modifiedAt: this.modifiedAt,
			type: this.constructor.name,
			hidden: this.hidden
		};
	}
}

class File extends Element {
	constructor(name, parent = null, content = '') {
		super(name, parent);
		this.content = content;
		this.size = new TextEncoder().encode(content).length;
		this.icon = '../assets/images/desk/icons/File.webp';
		this.readOnly = false;
		this.remoteUrl = null;
		this.savedFromNotepad = false;
	}

	read() {
		return this.content;
	}

	write(newContent) {
		if (this.readOnly) {
			throw new Error('This file is read-only.');
		}
		this.content = newContent;
		this.size = new TextEncoder().encode(this.content).length;
		this.modifiedAt = new Date();
		if (this.parent) {
			this.parent.modifiedAt = new Date();
		}
	}

	copy() {
		const newFile = new File(this.name, null, this.content);
		newFile.createdAt = this.createdAt;
		newFile.modifiedAt = this.modifiedAt;
		newFile.readOnly = this.readOnly;
		newFile.remoteUrl = this.remoteUrl;
		newFile.savedFromNotepad = this.savedFromNotepad;
		return newFile;
	}

	toJSON() {
		return {
			...super.toJSON(),
			content: this.content,
			size: this.size,
			icon: this.icon,
			readOnly: this.readOnly,
			remoteUrl: this.remoteUrl,
			savedFromNotepad: this.savedFromNotepad,
		};
	}
}

class Folder extends Element {
	constructor(name, parent = null) {
		super(name, parent);
		this.children = new Map();
		this.icon = '../assets/images/desk/icons/Folder Closed.webp';
	}

	add(element) {
		if (this.children.has(element.name)) {
			throw new Error(`An element named "${element.name}" already exists.`);
		}
		element.parent = this;
		this.children.set(element.name, element);
		this.modifiedAt = new Date();
	}

	remove(elementName) {
		if (!this.children.has(elementName)) {
			throw new Error(`Element "${elementName}" not found.`);
		}
		const element = this.children.get(elementName);
		element.parent = null;
		this.children.delete(elementName);
		this.modifiedAt = new Date();
		return true;
	}

	getByName(name) {
		return this.children.get(name);
	}

	listContent() {
		return Array.from(this.children.values());
	}
	
	copy() {
		const newFolder = new Folder(this.name, null);
		newFolder.createdAt = this.createdAt;
		newFolder.modifiedAt = this.modifiedAt;
		newFolder.hidden = this.hidden;
		for (const child of this.children.values()) {
			const childCopy = child.copy();
			newFolder.add(childCopy);
		}
		return newFolder;
	}

	toJSON() {
		return {
			...super.toJSON(),
			icon: this.icon,
			children: Array.from(this.children.values()).map(child => child.toJSON()),
		};
	}
}

class Shortcut extends Element {
	constructor(name, parent = null, targetPath, icon) {
		super(name, parent);
		this.targetPath = targetPath;
		this.icon = icon;
	}

	copy() {
		const newShortcut = new Shortcut(this.name, null, this.targetPath, this.icon);
		newShortcut.createdAt = this.createdAt;
		newShortcut.modifiedAt = this.modifiedAt;
		return newShortcut;
	}

	toJSON() {
		return {
			...super.toJSON(),
			targetPath: this.targetPath,
			icon: this.icon,
		};
	}
}

class FileSystemManager {
	constructor() {
		this.root = new Folder('Desktop');
		this.clipboard = {
			mode: null,
			element: null
		};
	}

	findByPath(path) {
		if (path === '/') {
			return this.root;
		}
		const parts = path.split('/').filter(p => p);
		let current = this.root;
		for (const part of parts) {
			if (!(current instanceof Folder) || !current.children.has(part)) {
				return null;
			}
			current = current.getByName(part);
		}
		return current;
	}

	create(type, path, name, options = {}) {
		const parentFolder = this.findByPath(path);
		if (!(parentFolder instanceof Folder)) {
			throw new Error(`Invalid path: ${path}`);
		}
		let finalName = name;
		let counter = 1;

		const getBaseNameAndExtension = (filename) => {
			const lastDot = filename.lastIndexOf('.');
			if (lastDot === -1) return [filename, ''];
			return [filename.substring(0, lastDot), filename.substring(lastDot)];
		};

		while (parentFolder.children.has(finalName)) {
			if (type === 'File' || type === 'Shortcut') {
				const [baseName, ext] = getBaseNameAndExtension(name);
				finalName = `${baseName} (${counter})${ext}`;
			} else {
				finalName = `${name} (${counter})`;
			}
			counter++;
		}

		const newElement = type === 'Folder' ? new Folder(finalName) :
			type === 'Shortcut' ? new Shortcut(finalName, null, options.targetPath, options.icon) :
			new File(finalName);
		parentFolder.add(newElement);
		this.save();

		if (type === 'Folder' && window.AchievementsManager) {
			let depth = 0;
			let curr = newElement;
			const names = new Set();
			let hasDefault = false;
			while (curr && curr.parent) {
				depth++;
				if (curr.name.toLowerCase().startsWith('new folder')) hasDefault = true;
				names.add(curr.name.toLowerCase());
				curr = curr.parent;
			}
			if (depth >= 4 && !hasDefault && names.size >= 4) {
				window.AchievementsManager.progress('deep_folders', 1);
			}
		}
		return newElement;
	}

	delete(path) {
		const element = this.findByPath(path);
		if (!element || !element.parent) {
			throw new Error('Cannot delete root or non-existent element.');
		}
		if (element instanceof File && element.savedFromNotepad && window.AchievementsManager) {
			window.AchievementsManager.progress('notepad_save_delete', 1);
		}
		element.parent.remove(element.name);
		this.save();
	}

	move(sourcePath, destPath) {
		const element = this.findByPath(sourcePath);
		const destFolder = this.findByPath(destPath);

		if (!element || !element.parent) throw new Error('Source not found or is root.');
		if (!(destFolder instanceof Folder)) throw new Error('Destination is not a folder.');

		let checkParent = destFolder;
		while (checkParent) {
			if (checkParent === element) {
				throw new Error('Cannot move a folder into itself or one of its children.');
			}
			checkParent = checkParent.parent;
		}

		let finalName = element.name;
		let counter = 2;
		const getBaseNameAndExtension = (filename) => {
			const lastDot = filename.lastIndexOf('.');
			if (lastDot === -1) return [filename, ''];
			return [filename.substring(0, lastDot), filename.substring(lastDot)];
		};

		const originalElementName = element.name;
		while (destFolder.children.has(finalName)) {
			if (element instanceof File) {
				const [baseName, ext] = getBaseNameAndExtension(originalElementName);
				finalName = `${baseName} (${counter})${ext}`;
			} else {
				finalName = `${originalElementName} (${counter})`;
			}
			counter++;
		}
		
		const originalName = element.name;
		element.parent.remove(originalName);
		
		element.name = finalName;
		destFolder.add(element);
		
		this.save();
	}
	
	copy(sourcePath, destPath) {
		const elementToCopy = this.findByPath(sourcePath);
		const destFolder = this.findByPath(destPath);

		if (!elementToCopy) throw new Error('Source element not found.');
		if (!(destFolder instanceof Folder)) throw new Error('Destination is not a folder.');

		const getBaseNameAndExtension = (filename) => {
			const lastDot = filename.lastIndexOf('.');
			if (lastDot === -1) return [filename, ''];
			return [filename.substring(0, lastDot), filename.substring(lastDot)];
		};

		let finalName = elementToCopy.name;
		let counter = 1;
		let baseNameForCopy, extForCopy;

		if (elementToCopy instanceof File) {
			[baseNameForCopy, extForCopy] = getBaseNameAndExtension(elementToCopy.name);
		} else {
			baseNameForCopy = elementToCopy.name;
			extForCopy = '';
		}

		while (destFolder.children.has(finalName)) {
			if (counter === 1) {
				finalName = `Copy of ${baseNameForCopy}${extForCopy}`;
			} else {
				finalName = `Copy of ${baseNameForCopy} (${counter - 1})${extForCopy}`;
			}
			if (!destFolder.children.has(finalName)) break;

			finalName = `${baseNameForCopy} (${counter})${extForCopy}`;
			if (destFolder.children.has(finalName)) {
				let copyCounter = 2;
				finalName = `Copy of ${baseNameForCopy} (${copyCounter})${extForCopy}`;
				while(destFolder.children.has(finalName)) {
					copyCounter++;
					finalName = `Copy of ${baseNameForCopy} (${copyCounter})${extForCopy}`;
				}
			}
			counter++;
		}
		
		const newElement = elementToCopy.copy();
		newElement.name = finalName;
		destFolder.add(newElement);
		this.save();
		return newElement;
	}

	moveToRecycleBin(path) {
		const element = this.findByPath(path);
		if (!element || !element.parent) {
			throw new Error('Cannot recycle root or non-existent element.');
		}
		if (element instanceof File && element.savedFromNotepad && window.AchievementsManager) {
			window.AchievementsManager.progress('notepad_save_delete', 1);
		}
		const originalPath = element.parent.getFullPath();
		const serialized = element.toJSON();
		element.parent.remove(element.name);

		const recycleItems = this.loadRecycleBinItems();
		recycleItems.push({
			uid: `rb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
			originalPath,
			deletedAt: new Date().toISOString(),
			data: serialized
		});
		this.saveRecycleBinItems(recycleItems);
		this.save();
	}

	loadRecycleBinItems() {
		try {
			const raw = localStorage.getItem('recycleBinItems');
			return raw ? JSON.parse(raw) : [];
		} catch (error) {
			return [];
		}
	}

	saveRecycleBinItems(items) {
		localStorage.setItem('recycleBinItems', JSON.stringify(items));
	}

	restoreFromRecycleBin(uid) {
		const items = this.loadRecycleBinItems();
		const index = items.findIndex(item => item.uid === uid);
		if (index === -1) {
			throw new Error('Item not found in Recycle Bin.');
		}
		const item = items[index];
		let destFolder = this.findByPath(item.originalPath);
		if (!(destFolder instanceof Folder)) {
			destFolder = this.root;
		}
		const restored = this.rehydrate(item.data, null);
		let finalName = restored.name;
		let counter = 1;
		while (destFolder.children.has(finalName)) {
			finalName = `${restored.name} (${counter})`;
			counter++;
		}
		restored.name = finalName;
		destFolder.add(restored);
		items.splice(index, 1);
		this.saveRecycleBinItems(items);
		this.save();
		return restored;
	}

	deletePermanentlyFromRecycleBin(uid) {
		const items = this.loadRecycleBinItems();
		const filtered = items.filter(item => item.uid !== uid);
		this.saveRecycleBinItems(filtered);
	}

	emptyRecycleBin() {
		const items = this.loadRecycleBinItems();
		if (items.length > 0 && window.AchievementsManager) {
			window.AchievementsManager.progress('recycle_cleaner', 1);
		}
		this.saveRecycleBinItems([]);
	}

	save() {
		localStorage.setItem('fileSystem', JSON.stringify(this.root.toJSON()));
	}

	load() {
		const savedData = localStorage.getItem('fileSystem');
		if (savedData) {
			const data = JSON.parse(savedData);
			this.root = this.rehydrate(data, null);
		}
	}

	rehydrate(data, parent) {
		let element;
		if (data.type === 'Folder') {
			element = new Folder(data.name, parent);
			if (data.children) {
				data.children.forEach(childData => {
					const childElement = this.rehydrate(childData, element);
					element.add(childElement);
				});
			}
		} else if (data.type === 'Shortcut') {
			element = new Shortcut(data.name, parent, data.targetPath, data.icon);
		} else if (data.type === 'ProjectFile') {
			element = new ProjectFile(data.name, parent, data.projectData);
		} else {
			element = new File(data.name, parent, data.content || '');
			element.readOnly = !!data.readOnly;
			element.remoteUrl = data.remoteUrl || null;
			element.savedFromNotepad = !!data.savedFromNotepad;
		}
		element.createdAt = new Date(data.createdAt);
		element.modifiedAt = new Date(data.modifiedAt);
		element.hidden = !!data.hidden;
		if (data.icon) {
			element.icon = data.icon;
		}
		return element;
	}
}

class ProjectFile extends Element {
	constructor(name, parent = null, projectData = {}) {
		super(name, parent);
		this.projectData = projectData;
		this.icon = projectData.icon;
	}

	copy() {
		const newProject = new ProjectFile(this.name, null, this.projectData);
		newProject.createdAt = this.createdAt;
		newProject.modifiedAt = this.modifiedAt;
		return newProject;
	}

	toJSON() {
		return {
			...super.toJSON(),
			projectData: this.projectData,
			icon: this.icon,
		};
	}
}

let openWindows = {};
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
let nextWindowCascadeIndex = 0;

function getNextWindowPosition(width, height) {
	const startX = 24;
	const startY = 24;
	const step = 26;
	const maxSteps = 10;

	let posX = startX + (nextWindowCascadeIndex % maxSteps) * step;
	let posY = startY + (nextWindowCascadeIndex % maxSteps) * step;

	if (posX + width > window.innerWidth - 20 || posY + height > window.innerHeight - 60) {
		nextWindowCascadeIndex = 0;
		posX = startX;
		posY = startY;
	}

	nextWindowCascadeIndex++;
	return { x: Math.max(10, posX), y: Math.max(10, posY) };
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
		if (list.length > 15) list = list.slice(0, 15);
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
		if (typeof openWindows === 'undefined') return;
		Object.keys(openWindows).forEach(id => {
			const w = openWindows[id];
			if (w && typeof closeWindow === 'function') closeWindow(w, id);
		});
	},
	minimizeAllWindows: () => {
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
	openMailApp: () => openOutlookExpress(),
	openProjectsFolder: () => openAllProjectsFolder(),
	openRecycleBin: () => openRecycleBinWindow(),
	openCalculator: () => (window.CalculatorApp ? window.CalculatorApp.open() : openCalculator()),
	openCharacterMap: () => (window.CharacterMapApp ? window.CharacterMapApp.open() : null),
	openPaint: (file) => (window.PaintApp ? window.PaintApp.open(file) : openPaint(file)),
	openSoundRecorder: (file) => (window.SoundRecorderApp ? window.SoundRecorderApp.open(file) : null),
	openMinesweeperGame: () => (window.MinesweeperApp ? window.MinesweeperApp.open() : openMinesweeper()),
	openSolitaireGame: () => (window.SolitaireApp ? window.SolitaireApp.open() : openSolitaire()),
	openWinampPlayer: () => openWinamp(),
	getMoonPhaseDay: () => (typeof getMoonPhaseDayNumber === 'function') ? getMoonPhaseDayNumber() : null,
	getRecycleBinCount: () => (typeof fs !== 'undefined' && fs) ? fs.loadRecycleBinItems().length : 0,
	addToRecentDocs: (item) => addToRecentDocs(item),
	getRecentDocs: () => getRecentDocs(),
	clearRecentDocs: () => clearRecentDocs(),
	openMyComputer: () => openMyComputerWindow(),
	openSearch: (query) => openSearchWindow(query),
	openPrinters: () => openPrintersWindow(),
	openNetworkPlaces: () => openNetworkPlacesWindow(),
	openDisplaySettings: () => openDisplaySettings(),
	openAchievements: (targetId = null) => {
		if (window.AchievementsManager) return window.AchievementsManager.open(targetId);
	},
	getNowPlaying: () => {
		if (webampInstance) {
			return { title: "Projet 8.4", artist: "Wartets" };
		}
		return null;
	},
	toggleMusicPlayback: () => {
		if (!webampInstance) {
			openWinamp();
			return true;
		}
		return true;
	},
	nextMusicTrack: () => {
		if (webampInstance) {
			return true;
		}
		openWinamp();
		return true;
	},
	openApp: (appId) => {
		const key = String(appId).toLowerCase();
		if (key === 'mail' || key === 'outlook' || key === 'oe') {
			if (typeof openOutlookExpress === 'function') openOutlookExpress();
		} else if (key === 'projects' || key === 'portfolio') {
			if (typeof openAllProjectsFolder === 'function') openAllProjectsFolder();
		} else if (key === 'recyclebin' || key === 'trash') {
			if (typeof openRecycleBinWindow === 'function') openRecycleBinWindow();
		} else if (key === 'calculator' || key === 'calc') {
			if (window.CalculatorApp) window.CalculatorApp.open();
		} else if (key === 'charmap' || key === 'charactermap' || key === 'characters') {
			if (window.CharacterMapApp) window.CharacterMapApp.open();
		} else if (key === 'paint' || key === 'mspaint') {
			if (window.PaintApp) window.PaintApp.open();
		} else if (key === 'minesweeper' || key === 'mine') {
			if (typeof openMinesweeper === 'function') openMinesweeper();
		} else if (key === 'solitaire' || key === 'sol' || key === 'cards' || key === 'klondike') {
			if (window.SolitaireApp) window.SolitaireApp.open();
			else if (typeof openSolitaire === 'function') openSolitaire();
		} else if (key === 'soundrecorder' || key === 'sndrec32' || key === 'recorder' || key === 'voice') {
			if (window.SoundRecorderApp) window.SoundRecorderApp.open();
		} else if (key === 'musicplayer' || key === 'winamp' || key === 'music') {
			if (typeof openWinamp === 'function') openWinamp();
		} else if (key === 'terminal' || key === 'cmd' || key === 'prompt') {
			if (window.CommandPrompt) window.CommandPrompt.open();
			else if (typeof processRunCommand === 'function') processRunCommand('cmd');
		} else if (key === 'notepad' || key === 'text') {
			if (window.NotepadApp) window.NotepadApp.openNew();
		} else if (key === 'settings' || key === 'controlpanel') {
			if (window.SettingsApp) window.SettingsApp.open('system');
		} else if (key === 'mycomputer' || key === 'computer') {
			if (typeof openMyComputerWindow === 'function') openMyComputerWindow();
		} else if (key === 'search') {
			if (typeof openSearchWindow === 'function') openSearchWindow('');
		} else if (key === 'printers') {
			if (typeof openPrintersWindow === 'function') openPrintersWindow();
		} else if (key === 'networkplaces' || key === 'network') {
			if (typeof openNetworkPlacesWindow === 'function') openNetworkPlacesWindow();
		} else if (key === 'display' || key === 'wallpaper') {
			if (typeof openDisplaySettings === 'function') openDisplaySettings();
		} else if (key === 'achievements' || key === 'trophies' || key === 'quests') {
			if (window.AchievementsManager) window.AchievementsManager.open();
		} else if (key === 'internet' || key === 'ie' || key === 'browser') {
			if (typeof openInternetExplorer === 'function') openInternetExplorer();
		}
		return true;
	}
};

document.addEventListener('DOMContentLoaded', () => {
	initializeFileSystem();
	initDocuments();
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

	const bootScreen = document.getElementById('boot-screen');
	const welcomeScreen = document.getElementById('welcome-screen');
	const loginUser = document.getElementById('login-user');
	const bootLogo = document.querySelector('.boot-logo');

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
	
	bootTimeout = setTimeout(() => {
		if (bootScreen.style.display !== 'none') {
			bootScreen.style.display = 'none';
			welcomeScreen.classList.remove('hidden');

			loginTimeout = setTimeout(() => {
				if (loginUser && welcomeScreen.style.display !== 'none') loginUser.click();
			}, 1500);
		}
	}, 3000);

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
	if (typeof window.libraryData === 'undefined' || !window.libraryData.documents) return;

	const folderName = "PDFs";
	let docFolder = fs.root.getByName(folderName);

	if (!docFolder) {
		docFolder = new Folder(folderName);
		docFolder.icon = "../assets/images/desk/icons/Folder Closed.webp";
		fs.root.add(docFolder);
	}

	window.libraryData.documents.forEach(doc => {
		const fileName = doc.filePath.split('/').pop();
		let file;

		if (docFolder.children.has(fileName)) {
			file = docFolder.getByName(fileName);
			file.write(doc.filePath);
		} else {
			file = new File(fileName, null, doc.filePath);
			file.icon = "../assets/images/desk/icons/List File.webp";
			docFolder.add(file);
		}

		file.createdAt = new Date(doc.timestamp);
		file.modifiedAt = new Date(doc.timestamp);
	});
	fs.save();
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
	fs = new FileSystemManager();
	fs.load();

	let othersFolder = fs.root.getByName('Others');
	if (!othersFolder) {
		othersFolder = new Folder('Others');
		othersFolder.icon = '../assets/images/desk/icons/Folder Closed.webp';
		fs.root.add(othersFolder);
	}
	othersFolder.hidden = true;

	let othersProjectsFolder = othersFolder.getByName('Projects');
	if (!othersProjectsFolder) {
		othersProjectsFolder = new Folder('Projects');
		othersProjectsFolder.icon = '../assets/images/desk/icons/Folder Closed.webp';
		othersFolder.add(othersProjectsFolder);
	}

	migrateProjectFileLocations(othersFolder, othersProjectsFolder);

	const existingDesktopProjectNames = new Set(
		fs.root.listContent().filter(el => el instanceof ProjectFile).map(el => el.name)
	);
	const existingHiddenProjectNames = new Set(othersProjectsFolder.listContent().map(el => el.name));

	projects.flat().forEach(project => {
		if (typeof project !== 'object' || project === null || !project.title) return;
		const titleText = resolveProjectTitle(project.title);
		if (!titleText) return;

		const isVisible = project.show !== false;
		const targetFolder = isVisible ? fs.root : othersProjectsFolder;
		const existingNames = isVisible ? existingDesktopProjectNames : existingHiddenProjectNames;

		if (existingNames.has(titleText)) return;

		const projectFile = new ProjectFile(titleText, null, project);
		projectFile.createdAt = new Date(project.timestamp || Date.now());
		targetFolder.add(projectFile);
		existingNames.add(titleText);
	});

	initPoemsFolder(othersFolder);

	fs.save();
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

	const appIcons = [{
		name: "My Computer",
		icon: "../assets/images/desk/icons/My Computer.webp",
		action: openMyComputerWindow,
		type: "system",
		systemType: "my-computer"
	}, {
		name: "Recycle Bin",
		icon: "../assets/images/desk/trash.png",
		action: openRecycleBinWindow,
		type: "system",
		systemType: "recycle-bin"
	}, {
		name: "Milestones",
		icon: "../assets/images/desk/icons/Trophy.webp",
		action: () => {
			if (window.AchievementsManager) window.AchievementsManager.open();
		},
		type: "application",
		systemType: "achievements"
	}];

	appIcons.forEach(app => {
		const icon = createIconElement({
			name: app.name,
			icon: app.icon,
			path: `app://${app.name.toLowerCase().replace(/\s/g, '-')}`,
			type: 'application',
			element: null,
			systemType: app.systemType
		}, app.action);
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
	return localStorage.getItem('desktopShowHidden') === 'true';
}

function toggleShowHidden() {
	const current = isShowHiddenEnabled();
	localStorage.setItem('desktopShowHidden', (!current).toString());
	if (!current && window.AchievementsManager) {
		window.AchievementsManager.progress('hidden_revealer', 1);
	}
	refreshUI();
}

function createIconElement(data, dblClickHandler) {
	const icon = document.createElement('div');
	icon.className = 'project-icon';
	icon.dataset.path = data.path;
	icon.dataset.type = data.type;
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

function handleIconContextMenu(e, icon, project) {
	e.preventDefault();
	clearIconSelections();
	icon.classList.add('selected');
	selectedIcons.add(icon);
	currentContextMenuTarget = icon;
	showContextMenu(e);
	updateContextMenuItems(icon);
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
	if (win.classList.contains('xp-explorer-window') && window.FileExplorer && typeof window.FileExplorer.updateSelectionState === 'function') {
		window.FileExplorer.updateSelectionState(win);
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
	document.querySelectorAll('.project-icon.selected').forEach(selectedIcon => {
		selectedIcon.classList.remove('selected');
	});
	selectedIcons.clear();
}

const APP_WINDOW_BASE_SIZES = {
	outlook: { width: 980, height: 640 }
};

function computeXPWindowDimensions(preferredWidth, preferredHeight, isCompact = false) {
	const availableWidth = window.innerWidth;
	const availableHeight = window.innerHeight - 40;
	const maxWidth = availableWidth * 0.92;
	const maxHeight = availableHeight * 0.88;
	const minW = isCompact ? 160 : Math.max(240, Math.min(preferredWidth, maxWidth));
	const minH = isCompact ? 120 : Math.max(150, Math.min(preferredHeight, maxHeight));
	const width = Math.max(minW, Math.min(preferredWidth, maxWidth));
	const height = Math.max(minH, Math.min(preferredHeight, maxHeight));
	return { width, height };
}

function createXPWindow(id, title, contentHTML, initialWidth = 600, initialHeight = 400, options = {}) {
	const windowArea = document.getElementById('window-area');
	const existingWindow = document.getElementById(id);
	if (existingWindow) {
		bringWindowToFront(existingWindow);
		if (existingWindow.classList.contains('minimized')) {
			unminimizeWindow(existingWindow);
		}
		return existingWindow;
	}

	if (window.SettingsApp && window.SettingsApp.playSound) {
		window.SettingsApp.playSound('window');
	}

	const win = document.createElement('div');
	win.id = id;
	win.className = 'xp-window opening';
	
	if (options.isModal) {
		win.style.width = `${initialWidth}px`;
		win.style.height = 'auto';
		win.style.position = 'relative';
		win.style.boxShadow = '4px 4px 15px rgba(0,0,0,0.5)';
	} else if (!options.isMenu) {
		const isCompact = options.resizable === false;
		const { width, height } = computeXPWindowDimensions(initialWidth, initialHeight, isCompact);
		const pos = getNextWindowPosition(width, height);
		win.style.width = `${width}px`;
		win.style.height = `${height}px`;
		win.style.left = `${pos.x}px`;
		win.style.top = `${pos.y}px`;
	}
	
	win.style.opacity = '0';
	win.style.zIndex = ++zIndexCounter;

	const minimizeBtnHTML = options.isModal ? '<div class="xp-window-button minimize-btn" style="display: none;">_</div>' : '<div class="xp-window-button minimize-btn" title="Minimize">_</div>';
	const maximizeBtnHTML = (options.resizable === false || options.isModal) ? '<div class="xp-window-button maximize-btn" style="display: none;">□</div>' : '<div class="xp-window-button maximize-btn" title="Maximize">□</div>';

	win.innerHTML = `
		<div class="xp-window-header">
			<div style="display: flex; align-items: center; overflow: hidden;">
				${options.iconSrc ? `<img src="${options.iconSrc}" style="width: 16px; height: 16px; margin-right: 4px; pointer-events: none;">` : ''}
				<span class="title">${title}</span>
			</div>
			<div class="xp-window-buttons">
				${minimizeBtnHTML}
				${maximizeBtnHTML}
				<div class="xp-window-button close-btn" title="Close">X</div>
			</div>
		</div>
		<div class="xp-window-content">${contentHTML}</div>
	`;

	if (options.isModal) {
		const overlay = document.createElement('div');
		overlay.className = 'xp-modal-overlay';
		overlay.id = `overlay-${id}`;
		overlay.appendChild(win);
		document.body.appendChild(overlay);
		openWindows[id] = win;
	} else {
		windowArea.appendChild(win);
		openWindows[id] = win;
		makeWindowDraggable(win);
	}
	
	if (options.resizable !== false && !options.isModal) {
		makeWindowResizable(win);
	}

	setupWindowButtons(win, id);

	setTimeout(() => {
		win.classList.remove('opening');
		win.classList.add('opened');
		win.style.opacity = '1';
	}, 50);

	if (!options.isModal) {
		win.addEventListener('mousedown', (e) => {
			if (!e.target.closest('.xp-window-buttons')) {
				bringWindowToFront(win);
			}
		});
		setActiveWindow(win);
		if (window.Taskbar) {
			window.Taskbar.addWindowButton(id, title, options.iconSrc);
		}
	}

	return win;
}

function showXPDialog(title, message, type = 'info', options = {}) {
	const id = `dialog-${Date.now()}`;
	let iconSrc = '';
	
	if (window.SettingsApp && window.SettingsApp.playSound) {
		if (type === 'error') window.SettingsApp.playSound('error');
		else if (type === 'warning') window.SettingsApp.playSound('exclamation');
		else if (type === 'question') window.SettingsApp.playSound('question');
		else window.SettingsApp.playSound('asterisk');
	}

	switch (type) {
		case 'error':
			iconSrc = 'https://api.iconify.design/mdi/close-circle.svg?color=red';
			break;
		case 'warning':
			iconSrc = 'https://api.iconify.design/mdi/alert.svg?color=orange';
			break;
		case 'question':
			iconSrc = 'https://api.iconify.design/mdi/help-circle.svg?color=blue';
			break;
		default:
			iconSrc = 'https://api.iconify.design/mdi/information.svg?color=blue';
	}

	const buttons = options.buttons || ['OK'];
	const buttonsHTML = buttons.map(btn => `<button class="xp-button" data-result="${btn}">${btn}</button>`).join('');

	const contentHTML = `
		<div class="xp-dialog-content">
			<img src="${iconSrc}" class="xp-dialog-icon" alt="${type}">
			<div style="font-size: 11px; line-height: 1.5; align-self: center;">${message}</div>
		</div>
		<div class="xp-dialog-buttons">
			${buttonsHTML}
		</div>
	`;

	const dialog = createXPWindow(id, title, contentHTML, 350, 150, { 
		resizable: false, 
		isModal: true
	});
	
	dialog.querySelector('.xp-window-content').style.padding = '0';
	dialog.querySelector('.xp-window-content').style.display = 'flex';
	dialog.querySelector('.xp-window-content').style.flexDirection = 'column';

	const btnElements = dialog.querySelectorAll('.xp-dialog-buttons .xp-button');
	btnElements.forEach(btn => {
		btn.addEventListener('click', () => {
			const result = btn.dataset.result;
			closeWindow(dialog, id);
			if (options.callback) options.callback(result);
		});
		
		if (buttons.length === 1 || btn.dataset.result === 'Yes' || btn.dataset.result === 'OK') {
			btn.focus();
		}
	});
	
	return dialog;
}

function makeWindowDraggable(win) {
	const header = win.querySelector('.xp-window-header');
	const overlay = document.getElementById('iframe-drag-overlay');
	let isDragging = false;
	let offsetX, offsetY;

	header.addEventListener('contextmenu', (e) => {
		if (e.target.closest('.xp-window-buttons')) return;
		e.preventDefault();
		if (window.ContextMenu) {
			const items = window.ContextMenu.getWindowHeaderItems(win, win.id);
			window.ContextMenu.show(items, e.clientX, e.clientY);
		}
	});

	header.addEventListener('mousedown', (e) => {
		bringWindowToFront(win);
		if (e.target.closest('.xp-window-buttons')) return;
		if (win.classList.contains('maximized')) return;

		isDragging = true;
		if (overlay) overlay.style.display = 'block';
		document.body.classList.add('iframe-overlay-active');
		
		win.style.cursor = 'grabbing';
		win.style.transition = 'none';

		const rect = win.getBoundingClientRect();
		offsetX = e.clientX - rect.left;
		offsetY = e.clientY - rect.top;
	});

	document.addEventListener('mousemove', (e) => {
		if (!isDragging) return;

		let newLeft = e.clientX - offsetX;
		let newTop = e.clientY - offsetY;

		const desktop = document.getElementById('desktop');
		const desktopRect = desktop.getBoundingClientRect();
		const winRect = win.getBoundingClientRect();

		newLeft = Math.max(desktopRect.left - winRect.width + 30, Math.min(newLeft, desktopRect.right - 30));
		newTop = Math.max(desktopRect.top, Math.min(newTop, desktopRect.bottom - 30));

		win.style.left = `${newLeft}px`;
		win.style.top = `${newTop}px`;
		win.style.transform = 'none';
	});

	document.addEventListener('mouseup', () => {
		if (isDragging) {
			isDragging = false;
			if (overlay) overlay.style.display = 'none';
			document.body.classList.remove('iframe-overlay-active');
			win.style.cursor = 'default';
			win.style.transition = '';
		}
	});
}

function makeWindowResizable(win) {
	const BORDER_SIZE = 6;
	const overlay = document.getElementById('iframe-drag-overlay');
	let isResizing = false;
	let resizeDir = '';

	win.addEventListener('mousemove', (e) => {
		if (win.classList.contains('maximized') || isResizing) {
			win.style.cursor = '';
			return;
		}

		const rect = win.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const onRight = x >= rect.width - BORDER_SIZE;
		const onLeft = x <= BORDER_SIZE;
		const onBottom = y >= rect.height - BORDER_SIZE;
		const onTop = y <= BORDER_SIZE;

		if (onRight && onBottom) win.style.cursor = 'nwse-resize';
		else if (onLeft && onBottom) win.style.cursor = 'nesw-resize';
		else if (onLeft && onTop) win.style.cursor = 'nwse-resize';
		else if (onRight && onTop) win.style.cursor = 'nesw-resize';
		else if (onRight) win.style.cursor = 'ew-resize';
		else if (onLeft) win.style.cursor = 'ew-resize';
		else if (onBottom) win.style.cursor = 'ns-resize';
		else if (onTop) win.style.cursor = 'ns-resize';
		else win.style.cursor = '';
	});

	win.addEventListener('mousedown', (e) => {
		if (win.classList.contains('maximized')) return;

		const rect = win.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const onRight = x >= rect.width - BORDER_SIZE;
		const onLeft = x <= BORDER_SIZE;
		const onBottom = y >= rect.height - BORDER_SIZE;
		const onTop = y <= BORDER_SIZE;

		if (!onRight && !onLeft && !onBottom && !onTop) return;

		isResizing = true;
		if (overlay) overlay.style.display = 'block';
		document.body.classList.add('iframe-overlay-active');
		document.body.style.userSelect = 'none';
		
		resizeDir = '';
		if (onTop) resizeDir += 'n';
		if (onBottom) resizeDir += 's';
		if (onLeft) resizeDir += 'w';
		if (onRight) resizeDir += 'e';

		const startX = e.clientX;
		const startY = e.clientY;
		const startWidth = rect.width;
		const startHeight = rect.height;
		const startLeft = rect.left;
		const startTop = rect.top;

		const handleResize = (e) => {
			if (!isResizing) return;

			if (resizeDir.includes('e')) {
				win.style.width = `${Math.max(200, startWidth + e.clientX - startX)}px`;
			}
			if (resizeDir.includes('s')) {
				win.style.height = `${Math.max(100, startHeight + e.clientY - startY)}px`;
			}
			if (resizeDir.includes('w')) {
				const width = Math.max(200, startWidth - (e.clientX - startX));
				win.style.width = `${width}px`;
				win.style.left = `${startLeft + (startWidth - width)}px`;
			}
			if (resizeDir.includes('n')) {
				const height = Math.max(100, startHeight - (e.clientY - startY));
				win.style.height = `${height}px`;
				win.style.top = `${startTop + (startHeight - height)}px`;
			}
		};

		const stopResize = () => {
			isResizing = false;
			if (overlay) overlay.style.display = 'none';
			document.body.classList.remove('iframe-overlay-active');
			document.body.style.userSelect = '';
			document.removeEventListener('mousemove', handleResize);
			document.removeEventListener('mouseup', stopResize);
		};

		document.addEventListener('mousemove', handleResize);
		document.addEventListener('mouseup', stopResize);
	});
}

function setupWindowButtons(win, id) {
	win.querySelector('.minimize-btn').addEventListener('click', () => minimizeWindow(win, id));
	win.querySelector('.maximize-btn').addEventListener('click', () => maximizeWindow(win));
	win.querySelector('.close-btn').addEventListener('click', () => closeWindow(win, id));
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
					fs.create('File', getActiveContainerDestPath(), 'New Text Document.txt');
					refreshUI();
				} catch (error) {
					showXPDialog('Error', error.message, 'error');
				}
			}
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

		if ((key === 'c' || key === 'x') && !isEditable) {
			if (selectedIcons.size === 0) return;
			const icon = selectedIcons.values().next().value;
			const path = icon.dataset.path;
			if (!path || path.startsWith('app://')) return;
			e.preventDefault();
			fs.clipboard.mode = key === 'x' ? 'cut' : 'copy';
			fs.clipboard.element = fs.findByPath(path);
			return;
		}

		if (key === 'v' && !isEditable) {
			if (!fs.clipboard.element) return;
			const container = getActiveIconContainer();
			if (!container) return;
			e.preventDefault();
			const destPath = getActiveContainerDestPath();
			try {
				const sourcePath = fs.clipboard.element.getFullPath();
				if (fs.clipboard.mode === 'cut') {
					fs.move(sourcePath, destPath);
					fs.clipboard.mode = null;
					fs.clipboard.element = null;
				} else if (fs.clipboard.mode === 'copy') {
					fs.copy(sourcePath, destPath);
				}
				refreshUI();
			} catch (error) {
				showXPDialog('Error', error.message, 'error');
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

function openElementInfoWindow(element) {
	if (!element) return;

	let type = 'File';
	if (element instanceof Folder) type = 'Folder';
	else if (element instanceof Shortcut) type = 'Shortcut';
	else if (element instanceof ProjectFile) type = 'Project';

	const id = `window-info-${element.getFullPath().replace(/[^\w-]/g, '_')}`;
	const existingWindow = document.getElementById(id);
	if (existingWindow) {
		bringWindowToFront(existingWindow);
		return;
	}

	let previewHtml = '';
	let extraRows = '';

	if (type === 'Folder') {
		extraRows += buildInfoRow('Items', String(element.listContent().length));
	} else if (type === 'File') {
		extraRows += buildInfoRow('Size', formatBytes(element.size));
		if (!element.readOnly) {
			const preview = (element.content || '').replace(/<[^>]*>/g, ' ').trim().slice(0, 240);
			if (preview) previewHtml = `<div class="info-preview">${preview}${element.content.length > 240 ? '…' : ''}</div>`;
		}
	} else if (type === 'Shortcut') {
		extraRows += buildInfoRow('Target', element.targetPath);
	} else if (type === 'Project') {
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

	const contentHTML = `
		<div class="info-window-body" style="display: flex; flex-direction: column; height: 100%; box-sizing: border-box;">
			<div class="info-header">
				<img src="${element.icon}" alt="${element.name}" class="info-icon">
				<div class="info-title">${element.name}</div>
			</div>
			${previewHtml}
			<div class="info-rows" style="flex: 1;">
				${buildInfoRow('Type', type)}
				${buildInfoRow('Location', element.parent ? element.parent.getFullPath() : '/')}
				${buildInfoRow('Created', formatFullDate(element.createdAt))}
				${buildInfoRow('Modified', formatFullDate(element.modifiedAt))}
				${extraRows}
			</div>
			<fieldset class="xp-groupbox" style="margin-top: 8px; padding: 6px 10px;">
				<legend>Attributes</legend>
				<div style="display: flex; gap: 16px; align-items: center;">
					${readOnlyCheckbox}
					<label class="xp-checkbox-row" style="margin: 0;">
						<input type="checkbox" id="prop-hidden-check" ${element.hidden ? 'checked' : ''}> Hidden
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

	const win = createXPWindow(id, `${element.name} Properties`, contentHTML, 380, 460, {
		iconSrc: element.icon,
		resizable: false
	});
	win.querySelector('.xp-window-content').style.padding = '0';

	const hiddenCheck = win.querySelector('#prop-hidden-check');
	const readOnlyCheck = win.querySelector('#prop-readonly-check');
	const okBtn = win.querySelector('#prop-btn-ok');
	const cancelBtn = win.querySelector('#prop-btn-cancel');
	const applyBtn = win.querySelector('#prop-btn-apply');

	const onChange = () => {
		if (applyBtn) applyBtn.disabled = false;
	};

	if (hiddenCheck) hiddenCheck.addEventListener('change', onChange);
	if (readOnlyCheck) readOnlyCheck.addEventListener('change', onChange);

	const applyProperties = () => {
		if (hiddenCheck) element.hidden = hiddenCheck.checked;
		if (readOnlyCheck && element instanceof File) element.readOnly = readOnlyCheck.checked;
		fs.save();
		refreshUI();
		if (applyBtn) applyBtn.disabled = true;
	};

	if (applyBtn) applyBtn.addEventListener('click', applyProperties);
	if (okBtn) {
		okBtn.addEventListener('click', () => {
			applyProperties();
			closeWindow(win, id);
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
	const allWindows = document.querySelectorAll('.xp-window');
	allWindows.forEach(w => {
		const header = w.querySelector('.xp-window-header');
		if (header) header.classList.add('inactive');
	});

	activeWindow = win;
	const currentHeader = win ? win.querySelector('.xp-window-header') : null;
	if (currentHeader) currentHeader.classList.remove('inactive');

	if (window.Taskbar) {
		window.Taskbar.setActiveButton(win ? win.id : null);
	}
}

function bringWindowToFront(win) {
	if (parseInt(win.style.zIndex) < zIndexCounter) {
		win.style.zIndex = ++zIndexCounter;
	}
	setActiveWindow(win);
}

function minimizeWindow(win, id) {
	if (window.SettingsApp && window.SettingsApp.playSound) {
		window.SettingsApp.playSound('window');
	}

	win.dataset.originalLeft = win.style.left;
	win.dataset.originalTop = win.style.top;
	win.dataset.originalWidth = win.style.width;
	win.dataset.originalHeight = win.style.height;

	const taskbarBtn = document.querySelector(`.taskbar-window-btn[data-window-id="${id}"]`);
	let targetLeft = 0;
	let targetTop = window.innerHeight;
	let targetWidth = 0;
	let targetHeight = 0;

	if (taskbarBtn) {
		const taskbarRect = taskbarBtn.getBoundingClientRect();
		targetLeft = taskbarRect.left;
		targetTop = taskbarRect.top;
		targetWidth = taskbarRect.width;
		targetHeight = taskbarRect.height;
	}

	let finalized = false;
	const finalizeMinimize = () => {
		if (finalized) return;
		finalized = true;
		win.classList.add('hidden');
		win.classList.remove('minimizing');
		win.classList.add('minimized');
		const taskbarBtnElement = document.querySelector(`#taskbar-windows .taskbar-window-btn[data-window-id="${id}"]`);
		if (taskbarBtnElement) {
			taskbarBtnElement.classList.remove('active');
		}
		if (activeWindow === win) {
			activeWindow = null;
		}
	};

	const hasAnim = !document.body.classList.contains('no-window-animations') && !document.body.classList.contains('anim-instant');
	if (!hasAnim) {
		finalizeMinimize();
		return;
	}

	win.classList.add('minimizing');
	win.style.left = `${targetLeft}px`;
	win.style.top = `${targetTop}px`;
	win.style.width = `${targetWidth}px`;
	win.style.height = `${targetHeight}px`;
	win.style.opacity = '0';
	win.style.transform = 'scale(0.1)';

	const handler = (e) => {
		if (e.target === win) {
			win.removeEventListener('transitionend', handler);
			finalizeMinimize();
		}
	};
	win.addEventListener('transitionend', handler);
	setTimeout(finalizeMinimize, 400);
}

function unminimizeWindow(win) {
	if (window.SettingsApp && window.SettingsApp.playSound) {
		window.SettingsApp.playSound('window');
	}
	win.classList.remove('hidden', 'minimized');

	win.style.left = win.dataset.originalLeft || '50px';
	win.style.top = win.dataset.originalTop || '50px';
	win.style.width = win.dataset.originalWidth || '600px';
	win.style.height = win.dataset.originalHeight || '400px';
	win.style.opacity = '1';
	win.style.transform = 'none';

	const hasAnim = !document.body.classList.contains('no-window-animations') && !document.body.classList.contains('anim-instant');
	if (hasAnim) {
		win.classList.add('opening');
		const handler = (e) => {
			if (e.target === win) {
				win.classList.remove('opening');
				win.removeEventListener('transitionend', handler);
			}
		};
		win.addEventListener('transitionend', handler);
		setTimeout(() => win.classList.remove('opening'), 350);
	}
	bringWindowToFront(win);
}

function maximizeWindow(win) {
	const maxBtn = win.querySelector('.maximize-btn');

	if (win.classList.contains('maximized')) {
		win.style.transition = 'none';
		win.style.top = win.dataset.restoreTop;
		win.style.left = win.dataset.restoreLeft;
		win.style.width = win.dataset.restoreWidth;
		win.style.height = win.dataset.restoreHeight;
		win.classList.remove('maximized');
		maxBtn.textContent = '□';
		maxBtn.title = "Maximize";
		setTimeout(() => {
			win.style.transition = '';
		}, 50);
	} else {
		win.dataset.restoreTop = win.style.top;
		win.dataset.restoreLeft = win.style.left;
		win.dataset.restoreWidth = win.style.width;
		win.dataset.restoreHeight = win.style.height;

		win.style.transition = 'none';
		win.style.top = '0';
		win.style.left = '0';
		win.style.width = '100vw';
		win.style.height = 'calc(100vh - 40px)';
		win.style.transform = 'none';
		win.classList.add('maximized');
		maxBtn.textContent = '❐';
		maxBtn.title = "Restore Down";
		if (window.AchievementsManager) {
			window.AchievementsManager.progress('maximize_window', 1);
		}
		setTimeout(() => {
			win.style.transition = '';
		}, 50);
	}
}

function closeWindow(win, id) {
	if (!win) return;
	if (typeof win.beforeClose === 'function') {
		const allowClose = win.beforeClose(() => forceCloseWindow(win, id));
		if (allowClose === false) return;
	}
	forceCloseWindow(win, id);
}

function forceCloseWindow(win, id) {
	let cleanedUp = false;
	const cleanup = () => {
		if (cleanedUp) return;
		cleanedUp = true;
		const overlay = document.getElementById(`overlay-${id}`);
		if (overlay) {
			overlay.remove();
		} else if (win.parentElement) {
			win.remove();
		}
		delete openWindows[id];
		if (window.Taskbar) {
			window.Taskbar.removeWindowButton(id);
		}
		if (activeWindow === win) {
			activeWindow = null;
		}
	};

	const hasAnim = !document.body.classList.contains('no-window-animations') && !document.body.classList.contains('anim-instant');
	if (!hasAnim) {
		cleanup();
		return;
	}

	win.classList.add('minimizing');
	win.style.opacity = '0';
	win.style.transform = 'scale(0.1)';

	const handler = (e) => {
		if (e.target === win) {
			win.removeEventListener('transitionend', handler);
			cleanup();
		}
	};
	win.addEventListener('transitionend', handler);
	setTimeout(cleanup, 400);
}

function openProjectWindow(project) {
	const projectTitle = resolveProjectTitle(project.title);
	const id = `window-${projectTitle.replace(/\s/g, '-')}`;

	const languageNames = {
		en: 'English',
		fr: 'French',
		de: 'German',
		es: 'Spanish',
		it: 'Italian',
		pt: 'Portuguese',
		la: 'Latin',
		zh: 'Chinese',
		ja: 'Japanese',
		ko: 'Korean',
		ru: 'Russian',
		ar: 'Arabic',
		nl: 'Dutch',
		pl: 'Polish',
		sv: 'Swedish'
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

function openWinamp() {
	if (webampInstance) {
		webampInstance.reopen();
		return;
	}

	const Webamp = window.Webamp;
	if (!Webamp) {
		showXPDialog('Error', 'Winamp library failed to load.', 'error');
		return;
	}

	webampInstance = new Webamp({
		initialTracks: [{
			metaData: {
				artist: "Wartets",
				title: "Projet 8.4"
			},
			url: "assets/musics/Projet_8.4.mp3",
			duration: 4.333
		}],
		zIndex: 9000
	});

	webampInstance.onClose(() => {
		webampInstance.dispose();
		webampInstance = null;
	});

	webampInstance.onMinimize(() => {
		webampInstance.dispose(); 
		webampInstance = null;
	});

	webampInstance.renderWhenReady(document.getElementById('window-area'));
}

function openMinesweeper() {
	if (window.MinesweeperApp && typeof window.MinesweeperApp.open === 'function') {
		return window.MinesweeperApp.open();
	}
}

function openSolitaire() {
	if (window.SolitaireApp && typeof window.SolitaireApp.open === 'function') {
		return window.SolitaireApp.open();
	}
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
	if (element instanceof Folder) {
		if (windowContext && windowContext.classList.contains('xp-explorer-window') && window.FileExplorer) {
			window.FileExplorer.navigateTo(element, windowContext, true);
		} else if (window.FileExplorer) {
			window.FileExplorer.open(element);
		}
	} else if (element instanceof Shortcut) {
		const target = fs.findByPath(element.targetPath);
		if (target) {
			openFileSystemElement(target, windowContext);
		} else if (element.targetPath.startsWith('http://') || element.targetPath.startsWith('https://') || element.targetPath.startsWith('about:')) {
			if (window.InternetExplorerApp) {
				window.InternetExplorerApp.open(element.targetPath);
			}
		} else if (element.targetPath.startsWith('project://')) {
			showXPDialog('Shortcut Error', 'Legacy project shortcut format is no longer supported.', 'error');
		} else {
			showXPDialog('Shortcut Error', 'The item that this shortcut refers to has been changed or moved.', 'error');
		}
	} else if (element instanceof ProjectFile) {
		openProjectWindow(element.projectData);
	} else if (element instanceof File) {
		const lowerName = element.name.toLowerCase();
		if (lowerName.endsWith('.bat') || lowerName.endsWith('.cmd')) {
			if (window.AchievementsManager) {
				window.AchievementsManager.progress('bat_runner', 1);
			}
			if (window.CommandPrompt) {
				window.CommandPrompt.open({
					script: element.content,
					title: element.name,
					initialFolder: element.parent || fs.root
				});
			}
		} else if (element.readOnly && element.remoteUrl) {
			openReadOnlyTextWindow(element);
		} else if (/\.(png|jpe?g|bmp|webp|gif)$/i.test(lowerName)) {
			if (window.PaintApp) {
				window.PaintApp.open(element);
			}
		} else if (/\.(wav|wave|mp3|ogg|m4a)$/i.test(lowerName)) {
			if (window.SoundRecorderApp) {
				window.SoundRecorderApp.open(element);
			}
		} else if (lowerName.endsWith('.pdf')) {
			openPDFWindow(element);
		} else if (lowerName.endsWith('.html') || lowerName.endsWith('.htm')) {
			if (window.InternetExplorerApp) {
				window.InternetExplorerApp.open(`file://${element.getFullPath()}`);
			}
		} else {
			openTextEditorWindow(element);
		}
	}
}

function refreshUI() {
	if (!fs || !fs.root) return;
	renderDesktopIcons();
	Object.values(openWindows).forEach(win => {
		if (win.classList.contains('xp-explorer-window') && win.explorerState && window.FileExplorer) {
			const folder = fs.findByPath(win.explorerState.currentFolder.getFullPath());
			if (folder) {
				win.explorerState.currentFolder = folder;
				window.FileExplorer.updateView(win, true);
			} else {
				closeWindow(win, win.id);
			}
		}
	});
}

function arrangeIcons(sortBy) {
	const container = document.getElementById('project-icons-container');
	const icons = Array.from(container.children);
	
	const getElement = (icon) => {
		const path = icon.dataset.path;
		if (path.startsWith('app://')) {
			return { name: icon.querySelector('span').textContent, createdAt: new Date(0) };
		}
		return fs.findByPath(path);
	};

	icons.sort((a, b) => {
		const elementA = getElement(a);
		const elementB = getElement(b);

		if (!elementA || !elementB) return 0;

		if (sortBy === 'name') {
			return elementA.name.localeCompare(elementB.name);
		} else if (sortBy === 'date') {
			return new Date(elementB.createdAt) - new Date(elementA.createdAt);
		} else if (sortBy === 'type') {
			const typeRank = { folder: 0, project: 1, shortcut: 2, file: 3, application: 4 };
			const rankA = typeRank[a.dataset.type] ?? 5;
			const rankB = typeRank[b.dataset.type] ?? 5;
			return (rankA - rankB) || elementA.name.localeCompare(elementB.name);
		}
		return 0;
	});

	const customGapX = (window.SettingsApp && window.SettingsApp.get('desktopGridSpacingX')) || 75;
	const customGapY = (window.SettingsApp && window.SettingsApp.get('desktopGridSpacingY')) || 100;
	const iconWidth = customGapX;
	const iconHeight = customGapY;
	const startX = 10;
	const startY = 10;
	
	const desktopHeight = window.innerHeight - 40;
	const iconsPerColumn = Math.max(1, Math.floor((desktopHeight - startY) / iconHeight));
	
	container.innerHTML = '';
	icons.forEach((icon, index) => {
		const col = Math.floor(index / iconsPerColumn);
		const row = index % iconsPerColumn;

		icon.style.position = 'absolute';
		icon.style.left = `${startX + col * (iconWidth + 10)}px`;
		icon.style.top = `${startY + row * iconHeight}px`;
		container.appendChild(icon);
	});
}

let currentDragTargetElement = null;

function clearAllDropTargets() {
	document.querySelectorAll('.drop-target').forEach(el => el.classList.remove('drop-target'));
	currentDragTargetElement = null;
}

function handleDragStart(e) {
	const icon = e.target.closest('.project-icon');
	if (!icon) return;

	if (!icon.classList.contains('selected') && !e.ctrlKey) {
		clearIconSelections();
		icon.classList.add('selected');
		selectedIcons.add(icon);
	}

	const pathsToDrag = [];
	selectedIcons.forEach(selected => {
		const p = selected.dataset.path;
		if (p && !p.startsWith('app://')) {
			pathsToDrag.push(p);
			selected.classList.add('dragging-icon');
		}
	});

	if (pathsToDrag.length === 0) {
		const singlePath = icon.dataset.path;
		if (singlePath && !singlePath.startsWith('app://')) {
			pathsToDrag.push(singlePath);
			icon.classList.add('dragging-icon');
		}
	}

	if (pathsToDrag.length === 0) {
		e.preventDefault();
		return;
	}

	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('text/plain', JSON.stringify(pathsToDrag));
}

function handleDragOver(e) {
	const pathsRaw = e.dataTransfer.types.includes('text/plain');
	if (!pathsRaw) return;

	e.preventDefault();
	e.stopPropagation();
	e.dataTransfer.dropEffect = 'move';

	const iconTarget = e.target.closest('.project-icon');
	const folderContent = e.target.closest('.folder-content');
	const folderWrapper = e.target.closest('.folder-content-wrapper');
	const desktopTarget = e.target.closest('#desktop, #project-icons-container');

	let dropCandidate = null;

	if (iconTarget) {
		const isFolder = iconTarget.dataset.type === 'folder';
		const isRecycle = iconTarget.dataset.systemType === 'recycle-bin';
		if (isFolder || isRecycle) {
			dropCandidate = iconTarget;
		} else if (folderContent) {
			dropCandidate = folderContent;
		} else {
			dropCandidate = document.getElementById('project-icons-container');
		}
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

	const iconCandidate = dropTarget.closest('.project-icon, .xp-details-row');
	if (iconCandidate) {
		if (iconCandidate.dataset.systemType === 'recycle-bin') {
			return { type: 'recycle' };
		}
		if (iconCandidate.dataset.type === 'folder' || iconCandidate.querySelector('.col-type')?.textContent.includes('Folder')) {
			return { type: 'folder', path: iconCandidate.dataset.path };
		}
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

	if (dropTarget.id === 'desktop' || dropTarget.id === 'project-icons-container') {
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

	const destFolder = fs.findByPath(destination.path);
	if (!destFolder || !(destFolder instanceof Folder)) {
		return;
	}

	const destFullPath = destFolder.getFullPath();

	sourcePaths.forEach(src => {
		const element = fs.findByPath(src);
		if (!element || !element.parent) return;
		if (element.parent.getFullPath() === destFullPath) return;

		try {
			fs.move(src, destFullPath);
		} catch (err) {
			showXPDialog('Move Error', err.message, 'error');
		}
	});

	if (window.SettingsApp && window.SettingsApp.playSound) {
		window.SettingsApp.playSound('click');
	}

	refreshUI();
}

function setupDesktopDropzone() {
	const desktop = document.getElementById('desktop');
	const iconsContainer = document.getElementById('project-icons-container');
	[desktop, iconsContainer].forEach(zone => {
		zone.addEventListener('dragover', handleDragOver);
		zone.addEventListener('dragleave', handleDragLeave);
		zone.addEventListener('drop', handleDrop);
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

function setImageAsWallpaper(source, fitMode = 'cover') {
	const desktop = document.getElementById('desktop');
	if (desktop) {
		desktop.style.backgroundImage = `url('${source}')`;
	}
	localStorage.setItem('desktopBackground', source);
	if (window.SettingsApp) {
		window.SettingsApp.set('desktopBackground', source);
		window.SettingsApp.set('wallpaperFit', fitMode);
	}
	if (typeof refreshUI === 'function') refreshUI();
}

const DEFAULT_DESKTOP_WALLPAPER = '../assets/images/desk/wallpapers/wallpaper-default.webp';
let desktopWallpapersRegistry = null;

const preloadedWallpapers = new Map();

function applyInitialDesktopBackground() {
	const current = localStorage.getItem('desktopBackground') || DEFAULT_DESKTOP_WALLPAPER;
	const desktop = document.getElementById('desktop');
	if (!desktop) return;

	desktop.style.backgroundImage = `url('${current}')`;
	if (!preloadedWallpapers.has(current)) {
		const img = new Image();
		img.src = current;
		img.onload = () => preloadedWallpapers.set(current, img);
		if (img.complete) preloadedWallpapers.set(current, img);
	}
}

async function fetchWallpaperRegistry() {
	if (desktopWallpapersRegistry) return desktopWallpapersRegistry;
	try {
		const response = await fetch('../data/desk-wallpaper.json');
		if (!response.ok) throw new Error(`HTTP error ${response.status}`);
		desktopWallpapersRegistry = await response.json();
		return desktopWallpapersRegistry;
	} catch (error) {
		console.error('Failed to load wallpaper registry:', error);
		return [];
	}
}

async function openDisplaySettings() {
	const id = 'window-wallpaper-manager';
	const existingWindow = document.getElementById(id);
	if (existingWindow) {
		bringWindowToFront(existingWindow);
		return;
	}

	const wallpapers = await fetchWallpaperRegistry();
	if (!wallpapers || wallpapers.length === 0) {
		showXPDialog('Error', 'Unable to load wallpaper collection.', 'error');
		return;
	}

	let currentActiveWallpaper = localStorage.getItem('desktopBackground') || DEFAULT_DESKTOP_WALLPAPER;
	let selectedWallpaperItem = wallpapers.find(item => item.path === currentActiveWallpaper) || wallpapers[0];

	const contentHTML = `
		<div class="folder-window-layout">
			<div class="folder-menu-bar">
				<ul>
					<li><u>F</u>ile</li>
					<li><u>E</u>dit</li>
					<li><u>V</u>iew</li>
					<li><u>F</u>avorites</li>
					<li><u>T</u>ools</li>
					<li><u>H</u>elp</li>
				</ul>
			</div>
			<div class="folder-toolbar">
				<div class="folder-nav-buttons">
					<button class="folder-nav-btn" disabled><img src="data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232c63c3'><path d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'/></svg>" alt="Back"></button>
					<button class="folder-nav-btn" disabled><img src="data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232c63c3'><path d='M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z'/></svg>" alt="Forward"></button>
					<button class="folder-nav-btn" disabled><img src="data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232c63c3'><path d='M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z'/></svg>" alt="Up"></button>
				</div>
				<div class="folder-toolbar-separator"></div>
				<div class="folder-address-bar-container">
					<span>Address</span>
					<input type="text" class="folder-address-bar" value="C:\\WINDOWS\\Web\\Wallpaper" readonly>
				</div>
			</div>
			<div class="folder-main-layout">
				<div class="folder-sidebar">
					<div class="sidebar-section">
						<h3>Monitor Preview</h3>
						<div class="wallpaper-monitor-container">
							<div class="wallpaper-monitor-bezel">
								<div class="wallpaper-monitor-screen" id="wallpaper-live-monitor" style="background-image: url('${selectedWallpaperItem.path}');"></div>
							</div>
							<div class="wallpaper-monitor-stand"></div>
							<div class="wallpaper-monitor-base"></div>
						</div>
					</div>
					<div class="sidebar-section">
						<h3>Wallpaper Tasks</h3>
						<ul>
							<li><a href="#" id="wallpaper-task-set"><img src="https://api.iconify.design/mdi/monitor-screenshot.svg" style="width:16px;height:16px;"><span>Set as Desktop Background</span></a></li>
							<li><a href="#" id="wallpaper-task-reset"><img src="https://api.iconify.design/mdi/backup-restore.svg" style="width:16px;height:16px;"><span>Restore Default Bliss</span></a></li>
						</ul>
					</div>
					<div class="sidebar-section">
						<h3>Details</h3>
						<div class="details-content" id="wallpaper-sidebar-details">
							<b>${selectedWallpaperItem.name}</b>
							${selectedWallpaperItem.filename}<br>
							Type: WEBP Image
						</div>
					</div>
				</div>
				<div class="folder-main-content">
					<div class="folder-content-wrapper">
						<div class="wallpaper-grid-view" id="wallpaper-grid-container"></div>
					</div>
					<div class="folder-status-bar">
						<div class="status-bar-left" id="wallpaper-status-count">${wallpapers.length} wallpaper(s)</div>
						<div class="status-bar-right">Local Intranet</div>
					</div>
				</div>
			</div>
			<div class="wallpaper-action-footer">
				<button class="xp-button" id="wallpaper-btn-ok">OK</button>
				<button class="xp-button" id="wallpaper-btn-cancel">Cancel</button>
				<button class="xp-button" id="wallpaper-btn-apply">Apply</button>
			</div>
		</div>
	`;

	const win = createXPWindow(id, 'Wallpaper', contentHTML, 760, 540, {
		iconSrc: '../assets/images/desk/icons/Display.webp'
	});
	win.querySelector('.xp-window-content').style.padding = '0';
	win.classList.add('project-window');

	const gridContainer = win.querySelector('#wallpaper-grid-container');
	const monitorPreview = win.querySelector('#wallpaper-live-monitor');
	const detailsContainer = win.querySelector('#wallpaper-sidebar-details');
	const applyBtn = win.querySelector('#wallpaper-btn-apply');
	const okBtn = win.querySelector('#wallpaper-btn-ok');
	const cancelBtn = win.querySelector('#wallpaper-btn-cancel');
	const setTaskLink = win.querySelector('#wallpaper-task-set');
	const resetTaskLink = win.querySelector('#wallpaper-task-reset');

	function updateWallpaperSelection(item) {
		selectedWallpaperItem = item;
		monitorPreview.style.backgroundImage = `url('${item.path}')`;
		try {
			const viewed = JSON.parse(localStorage.getItem('xp_previewed_wallpapers') || '[]');
			if (!viewed.includes(item.id)) {
				viewed.push(item.id);
				localStorage.setItem('xp_previewed_wallpapers', JSON.stringify(viewed));
			}
			if (window.AchievementsManager) {
				window.AchievementsManager.setProgress('wallpaper_collector', viewed.length);
			}
		} catch (e) {}
		detailsContainer.innerHTML = `
			<b>${item.name}</b>
			${item.filename}<br>
			Type: WEBP Image
		`;
		gridContainer.querySelectorAll('.wallpaper-card').forEach(card => {
			card.classList.toggle('selected', card.dataset.id === item.id);
		});
	}

	function applyWallpaperToDesktop(item) {
		const desktop = document.getElementById('desktop');
		if (desktop) {
			desktop.style.backgroundImage = `url('${item.path}')`;
		}
		localStorage.setItem('desktopBackground', item.path);
		currentActiveWallpaper = item.path;
	}

	wallpapers.forEach(item => {
		const card = document.createElement('div');
		card.className = 'wallpaper-card';
		card.dataset.id = item.id;
		if (item.id === selectedWallpaperItem.id) card.classList.add('selected');

		const frame = document.createElement('div');
		frame.className = 'wallpaper-card-thumb-frame';

		const img = document.createElement('img');
		img.src = item.path;
		img.alt = item.name;
		img.loading = 'lazy';
		frame.appendChild(img);

		const title = document.createElement('div');
		title.className = 'wallpaper-card-title';
		title.textContent = item.name;

		card.appendChild(frame);
		card.appendChild(title);

		card.addEventListener('click', () => {
			updateWallpaperSelection(item);
		});

		card.addEventListener('dblclick', () => {
			updateWallpaperSelection(item);
			applyWallpaperToDesktop(item);
		});

		card.addEventListener('contextmenu', (e) => {
			e.preventDefault();
			e.stopPropagation();
			updateWallpaperSelection(item);
			if (window.ContextMenu) {
				const items = window.ContextMenu.getWallpaperCardItems(item);
				window.ContextMenu.show(items, e.clientX, e.clientY);
			}
		});

		gridContainer.appendChild(card);
	});

	applyBtn.addEventListener('click', () => {
		applyWallpaperToDesktop(selectedWallpaperItem);
	});

	okBtn.addEventListener('click', () => {
		applyWallpaperToDesktop(selectedWallpaperItem);
		closeWindow(win, id);
	});

	cancelBtn.addEventListener('click', () => {
		closeWindow(win, id);
	});

	setTaskLink.addEventListener('click', (e) => {
		e.preventDefault();
		applyWallpaperToDesktop(selectedWallpaperItem);
	});

	resetTaskLink.addEventListener('click', (e) => {
		e.preventDefault();
		const defaultItem = wallpapers.find(w => w.path === DEFAULT_DESKTOP_WALLPAPER) || wallpapers[0];
		updateWallpaperSelection(defaultItem);
		applyWallpaperToDesktop(defaultItem);
	});
}

function openRecycleBinWindow() {
	const id = 'window-recycle-bin';
	const existingWindow = document.getElementById(id);
	if (existingWindow) {
		bringWindowToFront(existingWindow);
		renderRecycleBinContent(existingWindow);
		return;
	}

	const contentHTML = `
		<div class="folder-window-layout">
			<div class="folder-toolbar">
				<button class="folder-nav-btn" id="recycle-empty-btn" title="Empty Recycle Bin">
					<img src="https://api.iconify.design/mdi/delete-sweep-outline.svg" alt="Empty">
				</button>
				<div class="folder-toolbar-separator"></div>
				<button class="folder-nav-btn" id="recycle-restore-btn" title="Restore Selected" disabled>
					<img src="https://api.iconify.design/mdi/backup-restore.svg" alt="Restore">
				</button>
			</div>
			<div class="folder-main-content">
				<div class="folder-content-wrapper">
					<div class="folder-content" id="recycle-bin-content"></div>
				</div>
				<div class="folder-status-bar">
					<div class="status-bar-left" id="recycle-status"></div>
					<div class="status-bar-right"></div>
				</div>
			</div>
		</div>
	`;

	const win = createXPWindow(id, 'Recycle Bin', contentHTML, 600, 420, { iconSrc: '../assets/images/desk/trash.png' });
	win.querySelector('.xp-window-content').style.padding = '0';
	win.classList.add('project-window');

	win.querySelector('#recycle-empty-btn').addEventListener('click', () => {
		const items = fs.loadRecycleBinItems();
		if (items.length === 0) return;
		createConfirmationDialog(`Are you sure you want to permanently delete ${items.length} item(s)?`, () => {
			fs.emptyRecycleBin();
			renderRecycleBinContent(win);
		});
	});

	win.querySelector('#recycle-restore-btn').addEventListener('click', () => {
		const selected = win.querySelector('.project-icon.selected');
		if (!selected) return;
		try {
			fs.restoreFromRecycleBin(selected.dataset.recycleUid);
			renderRecycleBinContent(win);
			refreshUI();
		} catch (e) {
			showXPDialog('Error', e.message, 'error');
		}
	});

	renderRecycleBinContent(win);
}

function renderRecycleBinContent(win) {
	const container = win.querySelector('#recycle-bin-content');
	const statusEl = win.querySelector('#recycle-status');
	const restoreBtn = win.querySelector('#recycle-restore-btn');
	if (!container) return;

	container.innerHTML = '';
	const items = fs.loadRecycleBinItems();
	statusEl.textContent = `${items.length} item(s)`;
	if (restoreBtn) restoreBtn.disabled = true;

	items.forEach(item => {
		const icon = document.createElement('div');
		icon.className = 'project-icon';
		icon.dataset.recycleUid = item.uid;
		icon.title = `${item.data.name}\nOriginal location: ${item.originalPath}`;

		const img = document.createElement('img');
		img.src = item.data.icon || '../assets/images/desk/icons/File.webp';
		img.alt = item.data.name;
		icon.appendChild(img);

		const span = document.createElement('span');
		span.textContent = item.data.name;
		icon.appendChild(span);

		icon.addEventListener('click', () => {
			container.querySelectorAll('.project-icon.selected').forEach(el => el.classList.remove('selected'));
			icon.classList.add('selected');
			if (restoreBtn) restoreBtn.disabled = false;
		});

		icon.addEventListener('dblclick', () => {
			if (item.data.name.toLowerCase() === 'matrix.bat') {
				if (window.AchievementsManager) window.AchievementsManager.progress('matrix_recycle_run', 1);
				if (window.CommandPrompt) {
					window.CommandPrompt.open({
						script: item.data.content || '@echo off\ncolor 0a\n:loop\necho %random% %random% %random% %random%\ngoto loop',
						title: 'matrix.bat (Recycle Bin)'
					});
					return;
				}
			}
			showXPDialog(item.data.name, 'This item is in the Recycle Bin. You must restore it to open or execute it.', 'warning');
		});

		icon.addEventListener('contextmenu', (e) => {
			e.preventDefault();
			e.stopPropagation();
			container.querySelectorAll('.project-icon.selected').forEach(el => el.classList.remove('selected'));
			icon.classList.add('selected');
			if (restoreBtn) restoreBtn.disabled = false;

			if (window.ContextMenu) {
				const items = [
					{
						label: 'Restore',
						bold: true,
						action: () => {
							try {
								fs.restoreFromRecycleBin(item.uid);
								renderRecycleBinContent(win);
								refreshUI();
							} catch (err) {
								showXPDialog('Error', err.message, 'error');
							}
						}
					},
					{
						label: 'Delete Permanently',
						action: () => {
							fs.deletePermanentlyFromRecycleBin(item.uid);
							renderRecycleBinContent(win);
						}
					},
					{ separator: true },
					{
						label: 'Properties',
						action: () => {
							showXPDialog('Properties', `${item.data.name}\nOriginal location: ${item.originalPath}`, 'info');
						}
					}
				];
				window.ContextMenu.show(items, e.clientX, e.clientY);
			}
		});

		container.appendChild(icon);
	});
}

function openRunDialog() {
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
		return;
	}

	const contentHTML = `
		<div style="display: flex; flex-direction: column; padding: 15px; gap: 15px;">
			<div style="display: flex; gap: 15px; align-items: flex-start;">
				<img src="https://api.iconify.design/mdi/console-line.svg" style="width: 32px; height: 32px;" alt="Run">
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

	const runWindow = createXPWindow(id, title, contentHTML, 400, 180, { resizable: false, iconSrc: 'https://api.iconify.design/mdi/console-line.svg' });
	
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
	browseBtn.addEventListener('click', () => alert('Browse feature is not implemented.'));
	
	input.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') execute();
	});
}

function processRunCommand(command) {
	const cmd = command.trim();
	const lowerCmd = cmd.toLowerCase();
	
	if (lowerCmd === 'cmd' || lowerCmd === 'command') {
		const id = `window-cmd-${Date.now()}`;
		const content = `
			<div style="background-color: black; color: white; font-family: 'Consolas', 'Lucida Console', monospace; height: 100%; padding: 5px; overflow-y: auto;">
				<div>Mircosoft Windows XP [Version 5.1.5627]</div>
				<div>(C) Copyright 1985-2001 Mircosoft Corp.</div>
				<br>
				<div>C:\\Documents\\Wartets>${command}</div>
				<br>
				<div>'${command}' is not recognized as an internal or external command,<br>operable program or batch file.</div>
				<br>
				<div>C:\\Documents\\Wartets><span class="cursor">_</span></div>
			</div>
		`;
		createXPWindow(id, 'C:\\WINDOWS\\system32\\cmd.exe', content, 600, 350, { iconSrc: 'https://api.iconify.design/mdi/console.svg' });
	} else if (lowerCmd === 'explorer') {
		openFileSystemElement(fs.root);
	} else if (lowerCmd === 'shutdown') {
		openShutdownDialog();
	} else if (lowerCmd === 'calc' || lowerCmd === 'calculator') {
		if (window.CalculatorApp) window.CalculatorApp.open();
	} else if (lowerCmd === 'charmap' || lowerCmd === 'charactermap') {
		if (window.CharacterMapApp) window.CharacterMapApp.open();
	} else if (lowerCmd === 'mspaint' || lowerCmd === 'paint' || lowerCmd === 'pbrush') {
		if (window.PaintApp) window.PaintApp.open();
	} else if (lowerCmd === 'sndrec32' || lowerCmd === 'soundrecorder' || lowerCmd === 'sndrec') {
		if (window.SoundRecorderApp) window.SoundRecorderApp.open();
	} else if (lowerCmd === 'sol' || lowerCmd === 'solitaire' || lowerCmd === 'cards') {
		if (window.SolitaireApp) window.SolitaireApp.open();
		else if (typeof openSolitaire === 'function') openSolitaire();
	} else if (lowerCmd === 'bsod') {
		triggerBSOD();
	} else if (lowerCmd.startsWith('www.') || lowerCmd.startsWith('http://') || lowerCmd.startsWith('https://') || lowerCmd.endsWith('.com') || lowerCmd.endsWith('.org') || lowerCmd.endsWith('.net')) {
		if (window.InternetExplorerApp) {
			window.InternetExplorerApp.open(cmd);
		} else if (typeof openInternetExplorer === 'function') {
			openInternetExplorer(cmd);
		}
	} else {
		showXPDialog(command, `Cannot find '${command}'. Make sure you typed the name correctly, and then try again.`, 'error');
	}
}

function openMyComputerWindow() {
	const id = 'window-my-computer';
	const existing = document.getElementById(id);
	if (existing) {
		bringWindowToFront(existing);
		return;
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
					<button type="button" class="xp-tb-btn tb-search" id="mycomp-tb-search"><img src="https://api.iconify.design/mdi/magnify.svg?color=%231b4b9b" alt=""><span>Search</span></button>
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
								<div class="my-comp-item" id="mycomp-item-shared">
									<img src="../assets/images/desk/icons/Folder Closed (Alt).webp" alt="Shared Documents">
									<div class="my-comp-texts">
										<strong>Shared Documents</strong>
										<span>System Folder</span>
									</div>
								</div>
								<div class="my-comp-item" id="mycomp-item-userdocs">
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
								<div class="my-comp-item" id="mycomp-item-drive-c">
									<img src="https://api.iconify.design/mdi/harddisk.svg?color=%231b4b9b" alt="Drive C">
									<div class="my-comp-texts">
										<strong>Local Disk (C:)</strong>
										<span>24.8 GB free of 40.0 GB</span>
									</div>
								</div>
							</div>
						</div>

						<div class="my-comp-group">
							<div class="my-comp-group-title">Devices with Removable Storage</div>
							<div class="my-comp-grid">
								<div class="my-comp-item" id="mycomp-item-floppy">
									<img src="https://api.iconify.design/mdi/floppy.svg?color=%23555555" alt="Floppy A">
									<div class="my-comp-texts">
										<strong>3½ Floppy (A:)</strong>
										<span>3½-Inch Floppy Disk</span>
									</div>
								</div>
								<div class="my-comp-item" id="mycomp-item-cdrom">
									<img src="https://api.iconify.design/mdi/disc.svg?color=%23555555" alt="CD Drive D">
									<div class="my-comp-texts">
										<strong>CD Drive (D:) XP_SP3</strong>
										<span>Compact Disc</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="xp-explorer-statusbar">
				<div class="xp-sb-pane xp-sb-count">5 objects</div>
				<div class="xp-sb-pane xp-sb-zone"><img src="../assets/images/desk/icons/My Computer.webp" alt=""><span>Local Computer</span></div>
			</div>
		</div>
	`;

	const win = createXPWindow(id, 'My Computer', contentHTML, 720, 500, {
		iconSrc: '../assets/images/desk/icons/My Computer.webp'
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

	win.querySelector('#mycomp-item-shared').addEventListener('dblclick', () => {
		if (fs.root.getByName('PDFs')) openFolderWindow(fs.root.getByName('PDFs'));
	});
	win.querySelector('#mycomp-item-userdocs').addEventListener('dblclick', () => {
		openFolderWindow(fs.root);
	});
	win.querySelector('#mycomp-item-drive-c').addEventListener('dblclick', () => {
		openFolderWindow(fs.root);
	});
	win.querySelector('#mycomp-item-floppy').addEventListener('dblclick', () => {
		showXPDialog('Drive A:', 'Please insert a disk into drive A:.', 'error');
	});
	win.querySelector('#mycomp-item-cdrom').addEventListener('dblclick', () => {
		showXPDialog('CD Drive (D:)', 'Mircosoft Windows XP Professional SP3 Installation Media.', 'info');
	});

	win.querySelectorAll('.xp-task-header').forEach(header => {
		header.addEventListener('click', () => {
			const box = header.closest('.xp-task-box');
			if (box) box.classList.toggle('collapsed');
		});
	});
}

function openSearchWindow(initialQuery = '') {
	const id = 'window-search-companion';
	const existing = document.getElementById(id);
	if (existing) {
		bringWindowToFront(existing);
		const input = existing.querySelector('#search-input-field');
		if (input) {
			input.value = initialQuery;
			input.focus();
		}
		return;
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

	const win = createXPWindow(id, 'Search Results', contentHTML, 680, 420, {
		iconSrc: 'https://api.iconify.design/mdi/magnify.svg'
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
				const scanFolder = (folder) => {
					folder.listContent().forEach(child => {
						if (child.name.toLowerCase().includes(q)) {
							hits.push({
								name: child.name,
								category: child instanceof Folder ? 'Folder' : 'File',
								icon: child.icon,
								action: () => openFileSystemElement(child)
							});
						}
						if (child instanceof Folder) scanFolder(child);
					});
				};
				scanFolder(fs.root);
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
}

function openPrintersWindow() {
	const id = 'window-printers-faxes';
	const existing = document.getElementById(id);
	if (existing) {
		bringWindowToFront(existing);
		return;
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
					<button type="button" class="xp-tb-btn tb-search" id="printers-tb-search"><img src="https://api.iconify.design/mdi/magnify.svg?color=%231b4b9b" alt=""><span>Search</span></button>
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
								<a href="#" class="xp-task-link" id="printer-task-add"><img src="https://api.iconify.design/mdi/printer-plus.svg?color=%231b4b9b" alt=""><span>Add a printer</span></a>
								<a href="#" class="xp-task-link" id="printer-task-fax"><img src="../assets/images/desk/icons/Fax.webp" alt=""><span>Set up faxing</span></a>
								<a href="#" class="xp-task-link" id="printer-task-queue"><img src="https://api.iconify.design/mdi/printer.svg?color=%231b4b9b" alt=""><span>See what's printing</span></a>
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
								<img src="https://api.iconify.design/mdi/printer-plus.svg?color=%231b4b9b" alt="">
								<div class="xp-tile-texts">
									<strong>Add Printer</strong>
									<span>Printer Wizard</span>
								</div>
							</div>
							<div class="xp-explorer-item mode-tile printer-card-item" id="printer-item-pdf" style="cursor: pointer;">
								<img src="https://api.iconify.design/mdi/printer-check.svg?color=%232e7d32" alt="">
								<div class="xp-tile-texts">
									<strong>PDF Document Writer</strong>
									<span>0 documents in queue - Ready (Default)</span>
								</div>
							</div>
							<div class="xp-explorer-item mode-tile printer-card-item" id="printer-item-laser" style="cursor: pointer;">
								<img src="https://api.iconify.design/mdi/printer.svg?color=%23555555" alt="">
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

	const win = createXPWindow(id, 'Printers and Faxes', contentHTML, 720, 480, {
		iconSrc: '../assets/images/desk/icons/Fax.webp'
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
}

function openNetworkPlacesWindow() {
	const id = 'window-network-places';
	const existing = document.getElementById(id);
	if (existing) {
		bringWindowToFront(existing);
		return;
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
					<button type="button" class="xp-tb-btn tb-search" id="net-tb-search"><img src="https://api.iconify.design/mdi/magnify.svg?color=%231b4b9b" alt=""><span>Search</span></button>
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
								<a href="#" class="xp-task-link" id="net-task-add"><img src="https://api.iconify.design/mdi/folder-network-outline.svg?color=%231b4b9b" alt=""><span>Add a network place</span></a>
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
									<span>Mircosoft Windows Network</span>
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

	const win = createXPWindow(id, 'My Network Places', contentHTML, 740, 500, {
		iconSrc: '../assets/images/desk/icons/My Network Places.webp'
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

	win.querySelector('#net-item-entire').addEventListener('dblclick', () => showXPDialog('Entire Network', 'Scanning Mircosoft Windows Network domains... (MSHOME)', 'info'));
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
				<div class="shutdown-option" style="text-align: center; cursor: pointer; opacity: 0.7;">
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

async function openOutlookExpress() {
	const id = 'window-outlook-express';
	if (document.getElementById(id)) {
		bringWindowToFront(document.getElementById(id));
		return;
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
	const outlookWindow = createXPWindow(id, 'Outlook Express', contentHTML, APP_WINDOW_BASE_SIZES.outlook.width, APP_WINDOW_BASE_SIZES.outlook.height, { iconSrc: '../assets/images/desk/OE2001.webp' });
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
						label: 'About Mircosoft Outlook Express',
						bold: true,
						action: () => {
							showXPDialog('About Outlook Express', 'Mircosoft Outlook Express 6.0\nRunning on Windows XP Professional\nPortfolio Communications Client', 'info');
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
		const win = createXPWindow(mid, message.subject, html, 520, 380, { iconSrc: '../assets/images/desk/OE2001.webp' });
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

		const win = createXPWindow(composeId, prefill.subject ? `New Message - ${prefill.subject}` : 'New Message', content, 560, 440, { iconSrc: '../assets/images/desk/OE2001.webp' });
		win.querySelector('.xp-window-content').style.padding = '0';

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
}
