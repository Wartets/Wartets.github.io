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
		return newElement;
	}

	delete(path) {
		const element = this.findByPath(path);
		if (!element || !element.parent) {
			throw new Error('Cannot delete root or non-existent element.');
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
	getRandomProject: () => {
		if (typeof projects === 'undefined') return null;
		const list = projects.flat().filter(p => p && typeof p === 'object' && p.show !== false);
		if (list.length === 0) return null;
		return list[Math.floor(Math.random() * list.length)];
	},
	openMailApp: () => openOutlookExpress(),
	openProjectsFolder: () => openAllProjectsFolder(),
	openRecycleBin: () => openRecycleBinWindow(),
	openMinesweeperGame: () => (window.MinesweeperApp ? window.MinesweeperApp.open() : openMinesweeper()),
	openWinampPlayer: () => openWinamp(),
	getMoonPhaseDay: () => (typeof getMoonPhaseDayNumber === 'function') ? getMoonPhaseDayNumber() : null,
	getRecycleBinCount: () => (typeof fs !== 'undefined' && fs) ? fs.loadRecycleBinItems().length : 0,
	addToRecentDocs: (item) => addToRecentDocs(item),
	getRecentDocs: () => getRecentDocs(),
	clearRecentDocs: () => clearRecentDocs(),
	openMyComputer: () => openMyComputerWindow(),
	openSearch: (query) => openSearchWindow(query),
	openPrinters: () => openPrintersWindow(),
	openNetworkPlaces: () => openNetworkPlacesWindow()
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

function resolveProjectTitle(title) {
	if (typeof title === 'string') return title;
	if (title && typeof title === 'object') {
		return title.en || title.fr || Object.values(title)[0] || '';
	}
	return '';
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

	icon.addEventListener('click', (e) => handleIconClick(e, icon));
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
		const description = project.description || project.longDescription || project.longDescrition || '';
		if (project.icon) previewHtml += `<img src="${project.icon}" class="info-thumbnail" alt="${element.name}">`;
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
	win.classList.add('minimizing');
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

	win.style.left = `${targetLeft}px`;
	win.style.top = `${targetTop}px`;
	win.style.width = `${targetWidth}px`;
	win.style.height = `${targetHeight}px`;
	win.style.opacity = '0';
	win.style.transform = 'scale(0.1)';

	win.addEventListener('transitionend', function handler() {
		win.classList.add('hidden');
		win.classList.remove('minimizing');
		win.classList.add('minimized');
		win.removeEventListener('transitionend', handler);
	});

	const taskbarBtnElement = document.querySelector(`#taskbar-windows .taskbar-window-btn[data-window-id="${id}"]`);
	if (taskbarBtnElement) {
		taskbarBtnElement.classList.remove('active');
	}
	if (activeWindow === win) {
		activeWindow = null;
	}
}

function unminimizeWindow(win) {
	if (window.SettingsApp && window.SettingsApp.playSound) {
		window.SettingsApp.playSound('window');
	}
	win.classList.remove('hidden', 'minimized');
	win.classList.add('opening');

	win.style.left = win.dataset.originalLeft;
	win.style.top = win.dataset.originalTop;
	win.style.width = win.dataset.originalWidth;
	win.style.height = win.dataset.originalHeight;
	win.style.opacity = '1';
	win.style.transform = 'none';

	win.addEventListener('transitionend', function handler() {
		win.classList.remove('opening');
		win.removeEventListener('transitionend', handler);
	});
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
		setTimeout(() => {
			win.style.transition = '';
		}, 50);
	}
}

function closeWindow(win, id) {
	win.classList.add('minimizing');
	win.style.opacity = '0';
	win.style.transform = 'scale(0.1)';

	win.addEventListener('transitionend', function handler() {
		const overlay = document.getElementById(`overlay-${id}`);
		if (overlay) {
			overlay.remove();
		} else {
			win.remove();
		}
		
		delete openWindows[id];
		if (window.Taskbar) {
			window.Taskbar.removeWindowButton(id);
		}
		if (activeWindow === win) {
			activeWindow = null;
		}
		win.removeEventListener('transitionend', handler);
	});
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

	const projectLink = `
		<a href="${project.link}" target="_blank" class="xp-button project-link-button">
			<img src="https://www.svgrepo.com/show/326731/open-outline.svg" alt="Open">
			<span>Open in New Tab</span>
		</a>`;

	const runLink = `
		<button class="xp-button project-link-button run-project-btn">
			<img src="https://api.iconify.design/mdi/play-box-outline.svg" alt="Run">
			<span>Run Application</span>
		</button>`;

	const content = `
		<div class="project-view-layout">
			<div class="project-view-sidebar">
				<div class="project-view-image-container">
					<img src="${project.icon}" alt="${project.title}" class="project-view-image">
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
				<p class="project-long-description">${project.longDescription || project.longDescrition || project.description || 'No description available.'}</p>
			</div>
			<div class="project-view-statusbar">
				<span>Ready</span>
				<span class="status-separator"></span>
				<span>${projectTitle}</span>
			</div>
		</div>
	`;

	addToRecentDocs({ name: projectTitle, icon: project.icon, type: 'project', path: `project://${projectTitle}` });
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
	const prevButton = document.getElementById('calendar-prev');
	const nextButton = document.getElementById('calendar-next');
	const todayFooter = document.getElementById('calendar-footer');

	prevButton.addEventListener('click', () => {
		currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
		renderCalendar(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth());
	});

	nextButton.addEventListener('click', () => {
		currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
		renderCalendar(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth());
	});
	
	todayFooter.addEventListener('click', () => {
		currentCalendarDate = new Date();
		renderCalendar(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth());
	});
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

function renderCalendar(year, month) {
	const monthYearEl = document.getElementById('calendar-month-year');
	const gridEl = document.getElementById('calendar-grid');
	const todayDateEl = document.getElementById('calendar-today-date');

	gridEl.innerHTML = '';

	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	monthYearEl.textContent = `${monthNames[month]} ${year}`;

	const today = new Date();
	todayDateEl.textContent = `Today: ${today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;


	const firstDayOfMonth = new Date(year, month, 1);
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const startDayOfWeek = firstDayOfMonth.getDay();

	for (let i = 0; i < startDayOfWeek; i++) {
		const emptyCell = document.createElement('div');
		gridEl.appendChild(emptyCell);
	}

	for (let day = 1; day <= daysInMonth; day++) {
		const dayCell = document.createElement('div');
		dayCell.className = 'calendar-day';
		dayCell.textContent = day;

		const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
		if (isToday) {
			dayCell.classList.add('today');
		}

		const isSelectable = year === today.getFullYear() && month === today.getMonth() && day <= today.getDate();
		if (isSelectable) {
			dayCell.classList.add('selectable');
			dayCell.title = 'View the anecdote scheduled for this day';
			dayCell.addEventListener('click', () => {
				openAnecdoteWindow(new Date(Date.UTC(year, month, day)));
			});
		}
		
		gridEl.appendChild(dayCell);
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
	const id = `window-anecdote-${toISODateKeyUTC(dateUTC)}`;
	const existingWindow = document.getElementById(id);
	if (existingWindow) {
		bringWindowToFront(existingWindow);
		return;
	}

	const dateLabel = dateUTC.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
	const win = createXPWindow(id, `Anecdote - ${dateLabel}`, '<div style="padding:15px; font-size:12px;">Loading...</div>', 420, 260, {
		iconSrc: 'https://api.iconify.design/mdi/calendar-star.svg',
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
		} else if (element.targetPath.startsWith('project://')) {
			showXPDialog('Shortcut Error', 'Legacy project shortcut format is no longer supported.', 'error');
		} else {
			showXPDialog('Shortcut Error', 'The item that this shortcut refers to has been changed or moved.', 'error');
		}
	} else if (element instanceof ProjectFile) {
		openProjectWindow(element.projectData);
	} else if (element instanceof File) {
		const lowerName = element.name.toLowerCase();
		if (element.readOnly && element.remoteUrl) {
			openReadOnlyTextWindow(element);
		} else if (lowerName.endsWith('.pdf')) {
			openPDFWindow(element);
		} else if (lowerName.endsWith('.html') || lowerName.endsWith('.htm')) {
			openInternetExplorer();
			const ieWindow = document.getElementById('window-internet-explorer');
			if (ieWindow) {
				const iframe = ieWindow.querySelector('iframe');
				const addressBar = ieWindow.querySelector('#ie-address-bar');
				const homePage = ieWindow.querySelector('#ie-homepage');
				
				homePage.style.display = 'none';
				iframe.style.display = 'block';
				
				let contentUrl = element.content; 
				if (!contentUrl.startsWith('http') && !contentUrl.startsWith('data:')) {
					contentUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(element.content);
				}
				
				iframe.src = contentUrl;
				addressBar.value = element.name;
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

	const iconWidth = 75;
	const iconHeight = 100;
	const startX = 10;
	const startY = 10;
	
	const desktopHeight = window.innerHeight - 40;
	const iconsPerColumn = Math.floor((desktopHeight - startY) / iconHeight);
	
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

	if (dropTarget.classList.contains('project-icon')) {
		if (dropTarget.dataset.systemType === 'recycle-bin') {
			return { type: 'recycle' };
		}
		if (dropTarget.dataset.type === 'folder') {
			return { type: 'folder', path: dropTarget.dataset.path };
		}
	}

	if (dropTarget.classList.contains('folder-content')) {
		const win = dropTarget.closest('.xp-window');
		if (win && win.id === 'window-recycle-bin') {
			return { type: 'recycle' };
		}
		return { type: 'folder', path: dropTarget.dataset.path || '/' };
	}

	if (dropTarget.classList.contains('folder-content-wrapper')) {
		const win = dropTarget.closest('.xp-window');
		if (win && win.id === 'window-recycle-bin') {
			return { type: 'recycle' };
		}
		const inner = dropTarget.querySelector('.folder-content');
		return { type: 'folder', path: (inner && inner.dataset.path) ? inner.dataset.path : '/' };
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
	const id = `window-file-${file.getFullPath().replace(/[^\w-]/g, '_')}`;
	const existingWindow = document.getElementById(id);
	if (existingWindow) {
		bringWindowToFront(existingWindow);
		return;
	}

	const content = `
		<div class="notepad-layout">
			<div class="notepad-readonly-banner">This file is read-only and cannot be modified.</div>
			<div class="notepad-editor-container">
				<textarea class="readonly-notepad-textarea" readonly>Loading...</textarea>
			</div>
		</div>
	`;

	const win = createXPWindow(id, `${file.name} - Notepad`, content, 620, 480, {
		iconSrc: file.icon
	});
	win.querySelector('.xp-window-content').style.padding = '0';

	const textarea = win.querySelector('.readonly-notepad-textarea');
	textarea.style.width = '100%';
	textarea.style.height = '100%';
	textarea.style.boxSizing = 'border-box';
	textarea.style.border = 'none';
	textarea.style.resize = 'none';
	textarea.style.fontFamily = "'Times New Roman', serif";
	textarea.style.fontSize = '16px';
	textarea.style.padding = '12px 15px';
	textarea.style.outline = 'none';

	let readOnlyWarningActive = false;
	const showReadOnlyWarning = () => {
		if (readOnlyWarningActive) return;
		readOnlyWarningActive = true;
		showXPDialog('Read-Only File', `"${file.name}" is read-only. Changes cannot be saved.`, 'warning', {
			callback: () => {
				readOnlyWarningActive = false;
			}
		});
	};

	textarea.addEventListener('keydown', (e) => {
		const allowedKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown', 'Tab', 'Shift', 'Control', 'Alt', 'Meta'];
		const isCopy = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c';
		const isSelectAll = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a';
		if (allowedKeys.includes(e.key) || isCopy || isSelectAll) return;
		e.preventDefault();
		showReadOnlyWarning();
	});

	textarea.addEventListener('paste', (e) => {
		e.preventDefault();
		showReadOnlyWarning();
	});

	textarea.addEventListener('beforeinput', (e) => {
		if (e.inputType && e.inputType.startsWith('insert')) {
			e.preventDefault();
			showReadOnlyWarning();
		}
	});

	textarea.addEventListener('contextmenu', (e) => {
		e.preventDefault();
		if (window.ContextMenu) {
			const items = window.ContextMenu.getEditorItems(textarea, true);
			window.ContextMenu.show(items, e.clientX, e.clientY);
		}
	});

	try {
		const response = await fetch(file.remoteUrl);
		if (!response.ok) throw new Error('Network response was not ok.');
		const text = await response.text();
		if (document.getElementById(id)) {
			textarea.value = text;
			file.content = text;
			file.size = new TextEncoder().encode(text).length;
		}
	} catch (error) {
		if (document.getElementById(id)) {
			textarea.value = 'Unable to load this document.';
		}
	}
}

function openTextEditorWindow(file) {
	const id = `window-file-${file.getFullPath().replace(/[^\w-]/g, '_')}`;
	const existingWindow = document.getElementById(id);
	if (existingWindow) {
		bringWindowToFront(existingWindow);
		return;
	}

	const uniqueId = `editor-${Date.now()}`;
	const content = `
		<div class="notepad-layout">
			<div id="toolbar-${uniqueId}" class="notepad-toolbar">
				<span class="ql-formats">
					<select class="ql-font"></select>
					<select class="ql-size"></select>
				</span>
				<span class="ql-formats">
					<button class="ql-bold"></button>
					<button class="ql-italic"></button>
					<button class="ql-underline"></button>
					<button class="ql-strike"></button>
				</span>
				<span class="ql-formats">
					<select class="ql-color"></select>
					<select class="ql-background"></select>
				</span>
				<span class="ql-formats">
					<button class="ql-script" value="sub"></button>
					<button class="ql-script" value="super"></button>
				</span>
				<span class="ql-formats">
					<button class="ql-header" value="1"></button>
					<button class="ql-header" value="2"></button>
					<button class="ql-blockquote"></button>
					<button class="ql-code-block"></button>
				</span>
				<span class="ql-formats">
					<button class="ql-list" value="ordered"></button>
					<button class="ql-list" value="bullet"></button>
					<button class="ql-indent" value="-1"></button>
					<button class="ql-indent" value="+1"></button>
				</span>
				<span class="ql-formats">
					<select class="ql-align"></select>
				</span>
				<span class="ql-formats">
					<button class="ql-link"></button>
					<button class="ql-image"></button>
				</span>
				<span class="ql-formats">
					<button class="ql-clean"></button>
				</span>
			</div>
			<div class="notepad-editor-container">
				<div id="${uniqueId}"></div>
			</div>
		</div>
	`;
	const win = createXPWindow(id, `${file.name} - Notepad`, content, 700, 500, {
		iconSrc: file.icon
	});
	win.querySelector('.xp-window-content').style.padding = '0';

	const quill = new Quill(`#${uniqueId}`, {
		modules: {
			toolbar: `#toolbar-${uniqueId}`
		},
		theme: 'snow'
	});

	const initialContent = file.read();
	if (initialContent) {
		quill.clipboard.dangerouslyPasteHTML(0, initialContent);
	}

	let saveTimeout;
	quill.on('text-change', () => {
		clearTimeout(saveTimeout);
		saveTimeout = setTimeout(() => {
			file.write(quill.root.innerHTML);
			fs.save();
		}, 500);
	});

	quill.root.addEventListener('contextmenu', (e) => {
		e.preventDefault();
		if (window.ContextMenu) {
			const items = window.ContextMenu.getEditorItems(quill.root, false);
			window.ContextMenu.show(items, e.clientX, e.clientY);
		}
	});
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
			try {
				fs.restoreFromRecycleBin(item.uid);
				renderRecycleBinContent(win);
				refreshUI();
			} catch (e) {
				showXPDialog('Error', e.message, 'error');
			}
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
				<div>Microsoft Windows XP [Version 5.1.5627]</div>
				<div>(C) Copyright 1985-2001 Microsoft Corp.</div>
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
	} else if (lowerCmd === 'calc') {
		showXPDialog('Run', 'Calculator is not installed.', 'warning');
	} else if (lowerCmd === 'bsod') {
		triggerBSOD();
	} else if (lowerCmd.startsWith('www.') || lowerCmd.startsWith('http://') || lowerCmd.startsWith('https://') || lowerCmd.endsWith('.com') || lowerCmd.endsWith('.org') || lowerCmd.endsWith('.net')) {
		openInternetExplorer();
		const ieWindow = document.getElementById('window-internet-explorer');
		if (ieWindow) {
			const iframe = ieWindow.querySelector('iframe');
			const addressBar = ieWindow.querySelector('#ie-address-bar');
			const homePage = ieWindow.querySelector('#ie-homepage');
			if (iframe && addressBar) {
				homePage.style.display = 'none';
				iframe.style.display = 'block';
				let url = cmd;
				if (!url.startsWith('http://') && !url.startsWith('https://')) {
					url = 'https://' + url;
				}
				iframe.src = url;
				addressBar.value = url;
			}
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
		<div class="folder-window-layout">
			<div class="folder-menu-bar">
				<ul><li><u>F</u>ile</li><li><u>E</u>dit</li><li><u>V</u>iew</li><li><u>F</u>avorites</li><li><u>T</u>ools</li><li><u>H</u>elp</li></ul>
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
					<input type="text" class="folder-address-bar" value="My Computer" readonly>
				</div>
			</div>
			<div class="folder-main-layout">
				<div class="folder-sidebar">
					<div class="sidebar-section">
						<h3>System Tasks</h3>
						<ul>
							<li><a href="#" id="mycomp-task-info"><span>View system information</span></a></li>
							<li><a href="#" id="mycomp-task-ctrl"><span>Change a setting</span></a></li>
						</ul>
					</div>
					<div class="sidebar-section">
						<h3>Other Places</h3>
						<ul>
							<li><a href="#" id="mycomp-place-network"><span>My Network Places</span></a></li>
							<li><a href="#" id="mycomp-place-docs"><span>My Documents</span></a></li>
							<li><a href="#" id="mycomp-place-projects"><span>My Projects</span></a></li>
						</ul>
					</div>
					<div class="sidebar-section details">
						<h3>Details</h3>
						<div class="details-content">
							<b>My Computer</b><br>
							System Folder
						</div>
					</div>
				</div>
				<div class="folder-main-content" style="padding: 12px; overflow-y: auto;">
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
	`;

	const win = createXPWindow(id, 'My Computer', contentHTML, 680, 480, {
		iconSrc: '../assets/images/desk/icons/My Computer.webp'
	});
	win.querySelector('.xp-window-content').style.padding = '0';

	win.querySelector('#mycomp-task-info').addEventListener('click', (e) => {
		e.preventDefault();
		if (window.SettingsApp) window.SettingsApp.open('system');
	});
	win.querySelector('#mycomp-task-ctrl').addEventListener('click', (e) => {
		e.preventDefault();
		if (window.SettingsApp) window.SettingsApp.open('system');
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
		showXPDialog('CD Drive (D:)', 'Microsoft Windows XP Professional SP3 Installation Media.', 'info');
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
					const title = (typeof p.title === 'string') ? p.title : (p.title?.en || p.title?.fr || '');
					const desc = p.description || p.longDescription || '';
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
		<div class="folder-window-layout">
			<div class="folder-toolbar">
				<button class="folder-nav-btn" disabled><img src="data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232c63c3'><path d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'/></svg>" alt="Back"></button>
			</div>
			<div style="padding: 15px; display: flex; flex-wrap: wrap; gap: 16px; background: #ffffff; height: 100%; box-sizing: border-box;">
				<div class="my-comp-item" style="flex-direction: column; width: 110px; text-align: center;" id="printer-add-wizard">
					<img src="https://api.iconify.design/mdi/printer-plus.svg?color=%231b4b9b" style="width: 40px; height: 40px;" alt="">
					<span style="font-size: 11px; margin-top: 4px;">Add Printer</span>
				</div>
				<div class="my-comp-item" style="flex-direction: column; width: 110px; text-align: center;">
					<img src="https://api.iconify.design/mdi/printer.svg?color=%232e7d32" style="width: 40px; height: 40px;" alt="">
					<span style="font-size: 11px; margin-top: 4px; font-weight: bold;">PDF Document Writer (Default)</span>
				</div>
				<div class="my-comp-item" style="flex-direction: column; width: 110px; text-align: center;">
					<img src="https://api.iconify.design/mdi/fax.svg?color=%23555555" style="width: 40px; height: 40px;" alt="">
					<span style="font-size: 11px; margin-top: 4px;">Fax</span>
				</div>
			</div>
		</div>
	`;

	const win = createXPWindow(id, 'Printers and Faxes', contentHTML, 520, 320, {
		iconSrc: 'https://api.iconify.design/mdi/printer.svg'
	});
	win.querySelector('.xp-window-content').style.padding = '0';

	win.querySelector('#printer-add-wizard').addEventListener('dblclick', () => {
		showXPDialog('Add Printer Wizard', 'The wizard could not detect any plug and play parallel or USB printer connected.', 'warning');
	});
}

function openNetworkPlacesWindow() {
	const id = 'window-network-places';
	const existing = document.getElementById(id);
	if (existing) {
		bringWindowToFront(existing);
		return;
	}

	const links = [
		{ name: 'GitHub Profile', url: 'https://github.com/wartets', icon: 'https://img.icons8.com/fluent/48/000000/github.png' },
		{ name: 'SoundCloud Music', url: 'https://soundcloud.com/wartets', icon: 'https://api.iconify.design/mdi/soundcloud.svg?color=%23ff5500' },
		{ name: 'YouTube Channel', url: 'https://www.youtube.com/@Wartets', icon: 'https://api.iconify.design/mdi/youtube.svg?color=%23cc0000' },
		{ name: 'Live Portfolio Web', url: 'https://wartets.github.io/', icon: 'https://img.icons8.com/fluent/48/domain.png' }
	];

	let linksHtml = '';
	links.forEach(l => {
		linksHtml += `
			<div class="my-comp-item" data-url="${l.url}" style="padding: 10px; width: 220px;">
				<img src="${l.icon}" alt="">
				<div class="my-comp-texts">
					<strong>${l.name}</strong>
					<span>External Network Link</span>
				</div>
			</div>
		`;
	});

	const contentHTML = `
		<div class="folder-window-layout">
			<div style="padding: 15px; display: flex; flex-wrap: wrap; gap: 12px; background: #ffffff; height: 100%; box-sizing: border-box;">
				${linksHtml}
			</div>
		</div>
	`;

	const win = createXPWindow(id, 'My Network Places', contentHTML, 540, 340, {
		iconSrc: '../assets/images/desk/icons/My Network Places.webp'
	});
	win.querySelector('.xp-window-content').style.padding = '0';

	win.querySelectorAll('.my-comp-item[data-url]').forEach(item => {
		item.addEventListener('dblclick', () => {
			window.open(item.dataset.url, '_blank');
		});
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

const IE_EASTER_EGG_HOSTS = {
	'geocities.wartets': () => `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Colin's Homepage</title><style>
		body{background:#000080;color:#00ff00;font-family:'Comic Sans MS',cursive;text-align:center;padding:30px;}
		h1{color:#ffff00;text-shadow:2px 2px #ff00ff;}
		marquee{color:#ff0000;font-weight:bold;}
		.badge{display:inline-block;margin:4px;padding:4px 8px;background:#fff;color:#000;border:2px outset #ccc;font-size:11px;}
	</style></head><body>
		<h1>Welcome to Colin's Homepage!</h1>
		<marquee>Under construction since 1999! Best viewed at 800x600!</marquee>
		<p>Hit counter: 005627</p>
		<div class="badge">Netscape Now!</div>
		<div class="badge">Made with Notepad</div>
		<p>Sign my guestbook!</p>
	</body></html>`,
	'wartex.search': () => buildIESearchPage('')
};

function normalizeIEHost(input) {
	let value = input.trim();
	if (!value.startsWith('http://') && !value.startsWith('https://') && !value.startsWith('about:')) {
		value = 'https://' + value;
	}
	try {
		return new URL(value).hostname.replace(/^www\./, '');
	} catch (error) {
		return null;
	}
}

function buildIEErrorPage(url) {
	return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Verdana,sans-serif;background:#fff;color:#000;padding:40px;} h1{font-size:20px;} .url{color:#0000cc;} hr{margin:20px 0;}</style></head><body>
		<h1>The page cannot be displayed</h1>
		<p>The page you are looking for is currently unavailable. The web site might be experiencing technical difficulties, or you may need to adjust your browser settings.</p>
		<p class="url">${url}</p>
		<hr>
		<p>Please try the following:</p>
		<ul>
			<li>Open the <b>geocities.wartets</b> home page, and then look for links to the information you want.</li>
			<li>Click the Refresh button, or try again later.</li>
		</ul>
		<p><i>Cannot find server or DNS Error</i><br>Internet Explorer</p>
	</body></html>`;
}

function buildIESearchPage(query) {
	const escaped = (query || '').replace(/</g, '&lt;');
	return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
		body{font-family:Arial,sans-serif;background:#fff;color:#000;padding:20px;}
		.logo{font-size:32px;font-weight:bold;color:#3b88fd;margin-bottom:20px;}
		.logo span{color:#245edc;}
		.result{margin-bottom:16px;}
		.result a{color:#0000cc;font-size:14px;text-decoration:none;}
		.result a:hover{text-decoration:underline;}
		.result .desc{color:#333;font-size:12px;}
		.result .link-url{color:#009933;font-size:11px;}
	</style></head><body>
		<div class="logo">Wart<span>ex</span></div>
		<p>Results for "<b>${escaped}</b>"</p>
		<div class="result"><a href="#">Wartets - Personal Portfolio</a><div class="link-url">wartets.github.io</div><div class="desc">Interactive simulations, physics research, software engineering, and digital creations.</div></div>
		<div class="result"><a href="#">Why can't I access the real internet?</a><div class="link-url">wartex.help/sandbox</div><div class="desc">This browser is a sandboxed recreation running inside a portfolio site. External sites cannot be reached.</div></div>
		<div class="result"><a href="#">GeoCities Revival - Personal Homepages</a><div class="link-url">geocities.wartets</div><div class="desc">Browse the archive of retro personal home pages.</div></div>
	</body></html>`;
}

function openInternetExplorer() {
	const id = 'window-internet-explorer';
	if (document.getElementById(id)) {
		bringWindowToFront(document.getElementById(id));
		return;
	}

	const contentHTML = `
		<div class="ie-window-layout">
			<div class="ie-toolbar">
				<button class="ie-nav-btn" id="ie-back" title="Back" disabled><img src="https://api.iconify.design/mdi/arrow-left.svg?color=%23888888" alt="Back"></button>
				<button class="ie-nav-btn" id="ie-forward" title="Forward" disabled><img src="https://api.iconify.design/mdi/arrow-right.svg?color=%23888888" alt="Forward"></button>
				<button class="ie-nav-btn" id="ie-stop" title="Stop"><img src="https://api.iconify.design/mdi/close.svg" alt="Stop"></button>
				<button class="ie-nav-btn" id="ie-refresh" title="Refresh"><img src="https://api.iconify.design/mdi/refresh.svg" alt="Refresh"></button>
				<button class="ie-nav-btn" id="ie-home" title="Home"><img src="https://api.iconify.design/mdi/home.svg" alt="Home"></button>
			</div>
			<div class="ie-address-bar-container">
				<span>Address</span>
				<input type="text" id="ie-address-bar" value="about:home">
				<button id="ie-go-btn">Go</button>
			</div>
			<div class="ie-favorites-bar">
				<button type="button" class="ie-fav-btn" data-fav="geocities.wartets">GeoCities Archive</button>
				<button type="button" class="ie-fav-btn" data-fav="wartex.search">Wartex Search</button>
			</div>
			<div class="ie-content-area">
				<iframe id="ie-iframe" src="about:blank" sandbox="allow-scripts allow-same-origin allow-forms"></iframe>
				<div id="ie-homepage" class="ie-homepage-content">
					<img src="internet-explorer.png" alt="Internet Explorer">
					<h1>Welcome to Internet Explorer</h1>
					<p>Type a web address in the Address bar and click Go.</p>
				</div>
			</div>
		</div>
	`;

	const ieWindow = createXPWindow(id, 'Internet Explorer', contentHTML, 600, 400, { iconSrc: '../assets/images/desk/internet-explorer.png' });
	ieWindow.querySelector('.xp-window-content').style.padding = '0';

	const iframe = ieWindow.querySelector('#ie-iframe');
	const addressBar = ieWindow.querySelector('#ie-address-bar');
	const goBtn = ieWindow.querySelector('#ie-go-btn');
	const homePage = ieWindow.querySelector('#ie-homepage');

	const backBtn = ieWindow.querySelector('#ie-back');
	const forwardBtn = ieWindow.querySelector('#ie-forward');
	const stopBtn = ieWindow.querySelector('#ie-stop');
	const refreshBtn = ieWindow.querySelector('#ie-refresh');
	const homeBtn = ieWindow.querySelector('#ie-home');

	function navigateTo(url) {
		homePage.style.display = 'none';
		iframe.style.display = 'block';

		if (url === 'about:home') {
			showHome();
			return;
		}

		const rawQuery = url.trim();
		const host = normalizeIEHost(rawQuery);

		if (host && IE_EASTER_EGG_HOSTS[host]) {
			iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(IE_EASTER_EGG_HOSTS[host]());
			addressBar.value = `http://${host}/`;
			return;
		}

		if (!rawQuery.includes('.') || rawQuery.includes(' ')) {
			iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(buildIESearchPage(rawQuery));
			addressBar.value = `http://wartex.search/?q=${encodeURIComponent(rawQuery)}`;
			return;
		}

		iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(buildIEErrorPage(host ? `http://${host}/` : rawQuery));
		addressBar.value = host ? `http://${host}/` : rawQuery;
	}

	function showHome() {
		iframe.src = 'about:blank';
		iframe.style.display = 'none';
		homePage.style.display = 'flex';
		addressBar.value = 'about:home';
	}

	goBtn.addEventListener('click', () => navigateTo(addressBar.value));
	addressBar.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') navigateTo(addressBar.value);
	});

	ieWindow.querySelectorAll('.ie-fav-btn').forEach(btn => {
		btn.addEventListener('click', () => navigateTo(btn.dataset.fav));
	});

	backBtn.addEventListener('click', () => iframe.contentWindow.history.back());
	forwardBtn.addEventListener('click', () => iframe.contentWindow.history.forward());
	stopBtn.addEventListener('click', () => iframe.contentWindow.stop());
	refreshBtn.addEventListener('click', () => {
		if (iframe.style.display !== 'none') iframe.contentWindow.location.reload();
	});
	homeBtn.addEventListener('click', showHome);

	iframe.addEventListener('load', () => {
		try {
			addressBar.value = iframe.contentWindow.location.href;
			if (iframe.contentWindow.history.length > 1) {
				backBtn.disabled = false;
				backBtn.querySelector('img').src = "https://api.iconify.design/mdi/arrow-left.svg";
			} else {
				backBtn.disabled = true;
				backBtn.querySelector('img').src = "https://api.iconify.design/mdi/arrow-left.svg?color=%23888888";
			}
		} catch (e) {
		}
	});

	ieWindow.querySelector('.ie-content-area').addEventListener('contextmenu', (e) => {
		e.preventDefault();
		if (window.ContextMenu) {
			const items = window.ContextMenu.getIEAreaItems(addressBar.value);
			window.ContextMenu.show(items, e.clientX, e.clientY);
		}
	});

	showHome();
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
			<div class="folder-menu-bar">
				<ul><li><u>F</u>ile</li><li><u>E</u>dit</li><li><u>V</u>iew</li><li><u>T</u>ools</li><li><u>M</u>essage</li><li><u>H</u>elp</li></ul>
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
