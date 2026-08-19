class Element {
	constructor(name, parent = null) {
		if (typeof name !== 'string' || name.trim() === '') {
			throw new Error('Element name must be a non-empty string.');
		}
		this.name = name.trim();
		this.parent = parent;
		this.createdAt = new Date();
		this.modifiedAt = new Date();
		this.hidden = false;
		this.attributes = {
			archive: true,
			system: false
		};
	}

	rename(newName) {
		if (typeof newName !== 'string' || newName.trim() === '') {
			throw new Error('New name must be a non-empty string.');
		}
		const sanitized = newName.trim();
		const parent = this.parent;
		if (parent) {
			if (parent.children.has(sanitized) && sanitized.toLowerCase() !== this.name.toLowerCase()) {
				throw new Error(`An element named "${sanitized}" already exists in this folder.`);
			}
			const oldPath = this.getFullPath();
			const oldName = this.name;
			parent.children.delete(oldName);
			this.name = sanitized;
			parent.children.set(this.name, this);
			parent.modifiedAt = new Date();
			const newPath = this.getFullPath();
			const posMap = loadDesktopIconPositions();
			if (posMap[oldPath]) {
				posMap[newPath] = posMap[oldPath];
				delete posMap[oldPath];
				saveDesktopIconPositions(posMap);
			}
		} else {
			this.name = sanitized;
		}
		this.modifiedAt = new Date();
	}

	getFullPath() {
		if (!this.parent) {
			return '/';
		}
		let path = '';
		let current = this;
		while (current && current.parent) {
			path = `/${current.name}${path}`;
			current = current.parent;
		}
		return path || '/';
	}

	getDepth() {
		let depth = 0;
		let current = this;
		while (current && current.parent) {
			depth++;
			current = current.parent;
		}
		return depth;
	}

	toJSON() {
		return {
			name: this.name,
			createdAt: this.createdAt.toISOString ? this.createdAt.toISOString() : this.createdAt,
			modifiedAt: this.modifiedAt.toISOString ? this.modifiedAt.toISOString() : this.modifiedAt,
			type: this.constructor.name,
			hidden: this.hidden,
			attributes: this.attributes
		};
	}
}

class File extends Element {
	constructor(name, parent = null, content = '') {
		super(name, parent);
		this.content = content;
		this.size = new TextEncoder().encode(content).length;
		this.icon = window.ShellAssociations ? window.ShellAssociations.getIcon(this) : '../assets/images/desk/icons/File.webp';
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

	async calculateChecksum() {
		try {
			if (!window.crypto || !window.crypto.subtle) return 'N/A';
			const msgUint8 = new TextEncoder().encode(this.content || '');
			const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
			const hashArray = Array.from(new Uint8Array(hashBuffer));
			return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
		} catch (e) {
			return 'N/A';
		}
	}

	rename(newName) {
		super.rename(newName);
		if (window.ShellAssociations) {
			this.icon = window.ShellAssociations.getIcon(this);
		}
	}

	copy() {
		const newFile = new File(this.name, null, this.content);
		newFile.createdAt = new Date(this.createdAt);
		newFile.modifiedAt = new Date(this.modifiedAt);
		newFile.readOnly = this.readOnly;
		newFile.hidden = this.hidden;
		newFile.remoteUrl = this.remoteUrl;
		newFile.savedFromNotepad = this.savedFromNotepad;
		newFile.icon = this.icon;
		newFile.attributes = Object.assign({}, this.attributes);
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

	calculateSize() {
		let total = 0;
		for (const child of this.children.values()) {
			if (child instanceof Folder) {
				total += child.calculateSize();
			} else if (child instanceof File) {
				total += (child.size || 0);
			}
		}
		return total;
	}

	countItems(recursive = false) {
		if (!recursive) {
			return { files: this.listContent().filter(c => !(c instanceof Folder)).length, folders: this.listContent().filter(c => c instanceof Folder).length };
		}
		let files = 0;
		let folders = 0;
		for (const child of this.children.values()) {
			if (child instanceof Folder) {
				folders++;
				const sub = child.countItems(true);
				files += sub.files;
				folders += sub.folders;
			} else {
				files++;
			}
		}
		return { files, folders };
	}

	getAllDescendants() {
		const result = [];
		for (const child of this.children.values()) {
			result.push(child);
			if (child instanceof Folder) {
				result.push(...child.getAllDescendants());
			}
		}
		return result;
	}

	getUniqueName(baseName, extension = '') {
		let finalName = `${baseName}${extension}`;
		let counter = 1;
		while (this.children.has(finalName)) {
			finalName = `${baseName} (${counter})${extension}`;
			counter++;
		}
		return finalName;
	}

	copy() {
		const newFolder = new Folder(this.name, null);
		newFolder.createdAt = new Date(this.createdAt);
		newFolder.modifiedAt = new Date(this.modifiedAt);
		newFolder.hidden = this.hidden;
		newFolder.icon = this.icon;
		newFolder.attributes = Object.assign({}, this.attributes);
		for (const child of this.children.values()) {
			const childCopy = child.copy();
			newFolder.add(childCopy);
		}
		return newFolder;
	}

	toJSON() {
		let isInsideDynamic = false;
		let curr = this;
		while (curr) {
			if (curr.name === 'Music' || curr.name === 'PDFs') {
				isInsideDynamic = true;
				break;
			}
			curr = curr.parent;
		}
		if (isInsideDynamic && this.name !== 'Music' && this.name !== 'PDFs') {
			return {
				...super.toJSON(),
				icon: this.icon,
				isDynamicLibrary: true,
				children: []
			};
		}
		return {
			...super.toJSON(),
			icon: this.icon,
			children: Array.from(this.children.values()).filter(c => c.name !== 'Music' && c.name !== 'PDFs').map(child => child.toJSON()),
		};
	}
}

class Shortcut extends Element {
	constructor(name, parent = null, targetPath, icon) {
		super(name, parent);
		this.targetPath = targetPath;
		this.icon = icon || '../assets/images/desk/icons/Folder Closed.webp';
	}

	resolve() {
		const fsInstance = (typeof fs !== 'undefined' && fs) ? fs : window.fs;
		if (fsInstance) {
			return fsInstance.findByPath(this.targetPath);
		}
		return null;
	}

	copy() {
		const newShortcut = new Shortcut(this.name, null, this.targetPath, this.icon);
		newShortcut.createdAt = new Date(this.createdAt);
		newShortcut.modifiedAt = new Date(this.modifiedAt);
		newShortcut.hidden = this.hidden;
		newShortcut.attributes = Object.assign({}, this.attributes);
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

class ProjectFile extends Element {
	constructor(name, parent = null, projectData = {}) {
		super(name, parent);
		this.projectData = projectData;
		this.icon = projectData.icon || '../assets/images/desk/icons/File.webp';
	}

	copy() {
		const newProject = new ProjectFile(this.name, null, this.projectData);
		newProject.createdAt = new Date(this.createdAt);
		newProject.modifiedAt = new Date(this.modifiedAt);
		newProject.hidden = this.hidden;
		newProject.attributes = Object.assign({}, this.attributes);
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

class FileSystemManager {
	static typeRegistry = new Map();

	static registerType(type, constructorRef) {
		FileSystemManager.typeRegistry.set(type, constructorRef);
	}

	constructor() {
		this.root = new Folder('Desktop');
		this.clipboard = {
			mode: null,
			elements: [],
			paths: [],
			sources: []
		};
		this.undoStack = [];
		this.redoStack = [];
		this.initTypeRegistry();
	}

	initTypeRegistry() {
		FileSystemManager.registerType('Folder', Folder);
		FileSystemManager.registerType('File', File);
		FileSystemManager.registerType('Shortcut', Shortcut);
		FileSystemManager.registerType('ProjectFile', ProjectFile);
	}

	emitEvent(eventName, payload) {
		if (window.DeskEventBus) {
			window.DeskEventBus.emit(eventName, payload);
			window.DeskEventBus.emit('fs:changed', payload);
		}
	}

	exists(path) {
		return this.findByPath(path) !== null;
	}

	findByPath(path) {
		if (!path || path === '/' || path === '') {
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

		const getBaseNameAndExtension = (filename) => {
			const lastDot = filename.lastIndexOf('.');
			if (lastDot === -1 || lastDot === 0) return [filename, ''];
			return [filename.substring(0, lastDot), filename.substring(lastDot)];
		};

		let [baseName, ext] = getBaseNameAndExtension(name);
		let finalName = parentFolder.getUniqueName(baseName, ext);

		let newElement;
		if (type === 'Folder') {
			newElement = new Folder(finalName);
			if (options.icon) newElement.icon = options.icon;
		} else if (type === 'Shortcut') {
			newElement = new Shortcut(finalName, null, options.targetPath || '/', options.icon || '../assets/images/desk/icons/Folder Closed.webp');
		} else if (type === 'ProjectFile') {
			newElement = new ProjectFile(finalName, null, options.projectData || {});
		} else {
			newElement = new File(finalName, null, options.content || '');
			if (options.icon) newElement.icon = options.icon;
			else if (window.ShellAssociations) newElement.icon = window.ShellAssociations.getIcon(newElement);
		}

		parentFolder.add(newElement);
		this.undoStack.push({
			type: 'create',
			path: newElement.getFullPath(),
			elementData: newElement.toJSON()
		});
		this.redoStack = [];
		this.save();
		this.emitEvent('fs:created', { element: newElement, path: newElement.getFullPath() });

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
		if (element instanceof Folder && (element.name.toLowerCase() === 'music' || element.getFullPath() === '/Music') && window.AchievementsManager) {
			window.AchievementsManager.progress('delete_music_library', 1);
		}
		const fullPath = element.getFullPath();
		const posMap = loadDesktopIconPositions();
		if (posMap[fullPath]) {
			delete posMap[fullPath];
			saveDesktopIconPositions(posMap);
		}
		const parent = element.parent;
		const name = element.name;
		parent.remove(name);
		this.save();
		this.emitEvent('fs:deleted', { path, name });
	}

	duplicate(path) {
		const element = this.findByPath(path);
		if (!element || !element.parent) throw new Error('Cannot duplicate non-existent or root element.');
		const parent = element.parent;
		return this.copy(element.getFullPath(), parent.getFullPath());
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

		if (element.parent === destFolder) return;

		const getBaseNameAndExtension = (filename) => {
			const lastDot = filename.lastIndexOf('.');
			if (lastDot === -1 || lastDot === 0) return [filename, ''];
			return [filename.substring(0, lastDot), filename.substring(lastDot)];
		};

		const [baseName, ext] = getBaseNameAndExtension(element.name);
		const finalName = destFolder.getUniqueName(baseName, ext);

		const originalParent = element.parent;
		const originalName = element.name;
		originalParent.remove(originalName);

		element.name = finalName;
		destFolder.add(element);

		this.undoStack.push({
			type: 'move',
			fromParentPath: originalParent.getFullPath(),
			fromPath: sourcePath,
			toPath: element.getFullPath(),
			originalName,
			destName: finalName
		});
		this.redoStack = [];

		this.save();
		this.emitEvent('fs:moved', { element, sourcePath, destPath: element.getFullPath() });
	}

	copy(sourcePath, destPath) {
		const elementToCopy = this.findByPath(sourcePath);
		const destFolder = this.findByPath(destPath);

		if (!elementToCopy) throw new Error('Source element not found.');
		if (!(destFolder instanceof Folder)) throw new Error('Destination is not a folder.');

		const getBaseNameAndExtension = (filename) => {
			const lastDot = filename.lastIndexOf('.');
			if (lastDot === -1 || lastDot === 0) return [filename, ''];
			return [filename.substring(0, lastDot), filename.substring(lastDot)];
		};

		const [baseName, ext] = getBaseNameAndExtension(elementToCopy.name);
		let finalName = `Copy of ${baseName}${ext}`;
		let counter = 2;
		while (destFolder.children.has(finalName)) {
			finalName = `Copy (${counter}) of ${baseName}${ext}`;
			counter++;
		}

		const newElement = elementToCopy.copy();
		newElement.name = finalName;
		destFolder.add(newElement);
		this.undoStack.push({
			type: 'copy',
			path: newElement.getFullPath(),
			elementData: newElement.toJSON()
		});
		this.redoStack = [];
		this.save();
		this.emitEvent('fs:created', { element: newElement, path: newElement.getFullPath() });
		return newElement;
	}

	compressToZip(sourcePath, destPath = null) {
		const element = this.findByPath(sourcePath);
		if (!element || !element.parent) throw new Error('Cannot compress root or non-existent element.');
		const targetFolder = destPath ? this.findByPath(destPath) : element.parent;
		if (!(targetFolder instanceof Folder)) throw new Error('Target destination is not a valid folder.');

		const zipName = `${element.name}.zip`;
		const serializedData = JSON.stringify(element.toJSON());
		const zipFile = new File(zipName, null, serializedData);
		zipFile.icon = '../assets/images/desk/icons/Folder Closed.webp';

		const [base, ext] = [element.name, '.zip'];
		zipFile.name = targetFolder.getUniqueName(base, ext);
		targetFolder.add(zipFile);
		this.save();
		this.emitEvent('fs:created', { element: zipFile, path: zipFile.getFullPath() });
		return zipFile;
	}

	extractZip(zipFilePath, destPath = null) {
		const zipFile = this.findByPath(zipFilePath);
		if (!zipFile || !(zipFile instanceof File)) throw new Error('Invalid archive file.');
		const targetFolder = destPath ? this.findByPath(destPath) : (zipFile.parent || this.root);
		if (!(targetFolder instanceof Folder)) throw new Error('Extraction folder is invalid.');

		try {
			const parsed = JSON.parse(zipFile.content);
			const extracted = this.rehydrate(parsed, null);
			const baseName = extracted.name;
			const lastDot = baseName.lastIndexOf('.');
			const [bName, ext] = (lastDot > 0) ? [baseName.substring(0, lastDot), baseName.substring(lastDot)] : [baseName, ''];
			extracted.name = targetFolder.getUniqueName(bName, ext);
			targetFolder.add(extracted);
			this.save();
			this.emitEvent('fs:created', { element: extracted, path: extracted.getFullPath() });
			return extracted;
		} catch (e) {
			const fallbackName = targetFolder.getUniqueName('Extracted Text', '.txt');
			const txtFile = new File(fallbackName, null, zipFile.content);
			targetFolder.add(txtFile);
			this.save();
			this.emitEvent('fs:created', { element: txtFile, path: txtFile.getFullPath() });
			return txtFile;
		}
	}

	moveToRecycleBin(path) {
		const element = this.findByPath(path);
		if (!element || !element.parent) {
			throw new Error('Cannot recycle root or non-existent element.');
		}
		if (element instanceof File && element.savedFromNotepad && window.AchievementsManager) {
			window.AchievementsManager.progress('notepad_save_delete', 1);
		}
		if (element instanceof Folder && (element.name.toLowerCase() === 'music' || element.getFullPath() === '/Music') && window.AchievementsManager) {
			window.AchievementsManager.progress('delete_music_library', 1);
		}
		const originalPath = element.parent.getFullPath();
		const serialized = element.toJSON();
		element.parent.remove(element.name);

		const uid = `rb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
		const recycleItems = this.loadRecycleBinItems();
		recycleItems.push({
			uid,
			originalPath,
			deletedAt: new Date().toISOString(),
			data: serialized
		});
		this.saveRecycleBinItems(recycleItems);
		this.undoStack.push({
			type: 'recycle',
			uid,
			originalPath,
			data: serialized
		});
		this.redoStack = [];
		this.save();
		if (window.SettingsApp && typeof window.SettingsApp.playSound === 'function') {
			window.SettingsApp.playSound('recycle');
		}
		this.emitEvent('fs:recycled', { path, originalPath });
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
		const lastDot = restored.name.lastIndexOf('.');
		const [bName, ext] = (lastDot > 0 && !(restored instanceof Folder)) ? [restored.name.substring(0, lastDot), restored.name.substring(lastDot)] : [restored.name, ''];
		restored.name = destFolder.getUniqueName(bName, ext);
		destFolder.add(restored);
		items.splice(index, 1);
		this.saveRecycleBinItems(items);
		this.undoStack.push({
			type: 'restore',
			path: restored.getFullPath(),
			originalPath: item.originalPath,
			data: item.data
		});
		this.redoStack = [];
		this.save();
		if (window.SettingsApp && typeof window.SettingsApp.playSound === 'function') {
			window.SettingsApp.playSound('window');
		}
		this.emitEvent('fs:restored', { element: restored, path: restored.getFullPath() });
		return restored;
	}

	deletePermanentlyFromRecycleBin(uid) {
		const items = this.loadRecycleBinItems();
		const filtered = items.filter(item => item.uid !== uid);
		this.saveRecycleBinItems(filtered);
		if (window.SettingsApp && typeof window.SettingsApp.playSound === 'function') {
			window.SettingsApp.playSound('recycle');
		}
		this.emitEvent('fs:changed', { uid });
	}

	emptyRecycleBin() {
		const items = this.loadRecycleBinItems();
		if (items.length > 0 && window.AchievementsManager) {
			window.AchievementsManager.progress('recycle_cleaner', 1);
		}
		this.saveRecycleBinItems([]);
		if (window.SettingsApp && typeof window.SettingsApp.playSound === 'function') {
			window.SettingsApp.playSound('recycle');
		}
		this.emitEvent('fs:recycle-emptied', {});
	}

	undo() {
		if (this.undoStack.length === 0) return false;
		const op = this.undoStack.pop();
		if (op.type === 'batch') {
			for (let i = op.operations.length - 1; i >= 0; i--) {
				this.undoStack.push(op.operations[i]);
				this.undo();
			}
			return true;
		}
		if (op.type === 'desktop-layout') {
			const currentPos = loadDesktopIconPositions();
			this.redoStack.push({
				type: 'desktop-layout',
				positions: currentPos
			});
			saveDesktopIconPositions(op.positions);
			arrangeIcons('none');
			return true;
		}
		if (op.type === 'move') {
			const el = this.findByPath(op.toPath);
			const dest = this.findByPath(op.fromParentPath);
			if (el && dest instanceof Folder) {
				el.parent.remove(el.name);
				el.name = op.originalName;
				dest.add(el);
				this.redoStack.push({
					type: 'move',
					fromParentPath: op.toPath.substring(0, op.toPath.lastIndexOf('/')) || '/',
					fromPath: el.getFullPath(),
					toPath: op.toPath,
					originalName: op.originalName,
					destName: op.destName
				});
				this.save();
				this.emitEvent('fs:moved', { element: el, sourcePath: op.toPath, destPath: el.getFullPath() });
				return true;
			}
		} else if (op.type === 'create' || op.type === 'copy') {
			const el = this.findByPath(op.path);
			if (el && el.parent) {
				const parent = el.parent;
				const name = el.name;
				parent.remove(name);
				this.redoStack.push(op);
				this.save();
				this.emitEvent('fs:deleted', { path: op.path, name });
				return true;
			}
		} else if (op.type === 'recycle') {
			const items = this.loadRecycleBinItems();
			const idx = items.findIndex(i => i.uid === op.uid);
			if (idx !== -1) {
				const item = items[idx];
				let destFolder = this.findByPath(item.originalPath);
				if (!(destFolder instanceof Folder)) destFolder = this.root;
				const restored = this.rehydrate(item.data, null);
				destFolder.add(restored);
				items.splice(idx, 1);
				this.saveRecycleBinItems(items);
				this.redoStack.push({
					type: 'restore',
					path: restored.getFullPath(),
					originalPath: item.originalPath,
					data: item.data
				});
				this.save();
				this.emitEvent('fs:restored', { element: restored, path: restored.getFullPath() });
				return true;
			}
		} else if (op.type === 'restore') {
			const el = this.findByPath(op.path);
			if (el && el.parent) {
				const originalPath = el.parent.getFullPath();
				const serialized = el.toJSON();
				el.parent.remove(el.name);
				const uid = `rb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
				const recycleItems = this.loadRecycleBinItems();
				recycleItems.push({
					uid,
					originalPath,
					deletedAt: new Date().toISOString(),
					data: serialized
				});
				this.saveRecycleBinItems(recycleItems);
				this.redoStack.push({
					type: 'recycle',
					uid,
					originalPath,
					data: serialized
				});
				this.save();
				this.emitEvent('fs:recycled', { path: op.path, originalPath });
				return true;
			}
		} else if (op.type === 'rename') {
			const el = this.findByPath(op.newPath);
			if (el) {
				el.rename(op.oldName);
				this.redoStack.push({
					type: 'rename',
					oldPath: op.oldPath,
					newPath: el.getFullPath(),
					oldName: op.oldName,
					newName: op.newName
				});
				this.save();
				return true;
			}
		}
		return false;
	}

	redo() {
		if (this.redoStack.length === 0) return false;
		const op = this.redoStack.pop();
		if (op.type === 'batch') {
			for (let i = 0; i < op.operations.length; i++) {
				this.redoStack.push(op.operations[i]);
				this.redo();
			}
			return true;
		}
		if (op.type === 'desktop-layout') {
			const currentPos = loadDesktopIconPositions();
			this.undoStack.push({
				type: 'desktop-layout',
				positions: currentPos
			});
			saveDesktopIconPositions(op.positions);
			arrangeIcons('none');
			return true;
		}
		if (op.type === 'move') {
			const el = this.findByPath(op.fromPath);
			const destFolder = this.findByPath(op.fromParentPath);
			if (el && destFolder instanceof Folder) {
				this.move(el.getFullPath(), destFolder.getFullPath());
				return true;
			}
		} else if (op.type === 'create' || op.type === 'copy') {
			const parentPath = op.path.substring(0, op.path.lastIndexOf('/')) || '/';
			const parent = this.findByPath(parentPath);
			if (parent instanceof Folder) {
				const recreated = this.rehydrate(op.elementData, parent);
				parent.add(recreated);
				this.undoStack.push(op);
				this.save();
				this.emitEvent('fs:created', { element: recreated, path: recreated.getFullPath() });
				return true;
			}
		} else if (op.type === 'recycle') {
			if (op.path) {
				const el = this.findByPath(op.path);
				if (el) {
					this.moveToRecycleBin(op.path);
					return true;
				}
			}
		} else if (op.type === 'restore') {
			if (op.uid) {
				this.restoreFromRecycleBin(op.uid);
				return true;
			}
		} else if (op.type === 'rename') {
			const el = this.findByPath(op.oldPath);
			if (el) {
				el.rename(op.newName);
				this.undoStack.push(op);
				this.save();
				return true;
			}
		}
		return false;
	}

	search(query) {
		if (!query || typeof query !== 'string') return [];
		const q = query.toLowerCase().trim();
		const results = [];
		const walk = (folder) => {
			for (const child of folder.children.values()) {
				if (child.name.toLowerCase().includes(q)) {
					results.push(child);
				}
				if (child instanceof Folder) {
					walk(child);
				}
			}
		};
		walk(this.root);
		return results;
	}

	save() {
		localStorage.setItem('fileSystem', JSON.stringify(this.root.toJSON()));
	}

	load() {
		const savedData = localStorage.getItem('fileSystem');
		if (savedData) {
			try {
				const data = JSON.parse(savedData);
				this.root = this.rehydrate(data, null);
			} catch (e) {
				this.root = new Folder('Desktop');
			}
		}
	}

	rehydrate(data, parent) {
		let element;
		const ConstructorClass = FileSystemManager.typeRegistry.get(data.type) || File;
		if (data.type === 'Folder') {
			element = new ConstructorClass(data.name, parent);
			if (data.children) {
				data.children.forEach(childData => {
					const childElement = this.rehydrate(childData, element);
					element.add(childElement);
				});
			}
		} else if (data.type === 'Shortcut') {
			element = new ConstructorClass(data.name, parent, data.targetPath, data.icon);
		} else if (data.type === 'ProjectFile') {
			element = new ConstructorClass(data.name, parent, data.projectData);
		} else {
			element = new ConstructorClass(data.name, parent, data.content || '');
			element.readOnly = !!data.readOnly;
			element.remoteUrl = data.remoteUrl || null;
			element.savedFromNotepad = !!data.savedFromNotepad;
		}
		element.createdAt = new Date(data.createdAt || Date.now());
		element.modifiedAt = new Date(data.modifiedAt || Date.now());
		element.hidden = !!data.hidden;
		if (data.attributes) element.attributes = Object.assign({}, data.attributes);
		if (data.icon) {
			element.icon = data.icon;
		} else if (window.ShellAssociations) {
			element.icon = window.ShellAssociations.getIcon(element);
		}
		return element;
	}
}

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
	openCalculator: () => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('calculator') : (window.CalculatorApp ? window.CalculatorApp.open() : openCalculator())),
	openCharacterMap: () => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('charmap') : (window.CharacterMapApp ? window.CharacterMapApp.open() : null)),
	openPaint: (file) => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('paint', file) : (window.PaintApp ? window.PaintApp.open(file) : openPaint(file))),
	openSoundRecorder: (file) => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('soundrecorder', file) : (window.SoundRecorderApp ? window.SoundRecorderApp.open(file) : null)),
	openMediaPlayer: (track) => (window.MediaPlayerApp ? window.MediaPlayerApp.open(track) : null),
	openPictureViewer: (file) => (window.PictureViewerApp ? window.PictureViewerApp.open(file) : null),
	openMinesweeperGame: () => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('minesweeper') : (window.MinesweeperApp ? window.MinesweeperApp.open() : openMinesweeper())),
	openSolitaireGame: () => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('solitaire') : (window.SolitaireApp ? window.SolitaireApp.open() : openSolitaire())),
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
	openDisplaySettings: () => (window.DeskAppRegistry ? window.DeskAppRegistry.launch('display') : openDisplaySettings()),
	openAchievements: (targetId = null) => {
		if (window.DeskAppRegistry) return window.DeskAppRegistry.launch('achievements', { targetId });
		if (window.AchievementsManager) return window.AchievementsManager.open(targetId);
	},
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

document.addEventListener('DOMContentLoaded', () => {
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
		window.DeskEventBus.on('settings:changed', () => arrangeIcons('none'));
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

		const resolvedSize = doc.size || doc.fileSize || (doc.filePath ? Math.floor(180000 + (Math.abs(doc.filePath.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) * 9271) % 2400000) : 245000);
		file.size = resolvedSize;
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
	fs = new FileSystemManager();
	window.fs = fs;
	fs.load();

	let musicFolder = fs.root.getByName('Music');
	if (!musicFolder) {
		musicFolder = new Folder('Music');
		musicFolder.icon = '../assets/images/desk/icons/Folder Closed.webp';
		fs.root.add(musicFolder);
	}

	let docFolder = fs.root.getByName('PDFs');
	if (!docFolder) {
		docFolder = new Folder('PDFs');
		docFolder.icon = '../assets/images/desk/icons/Folder Closed.webp';
		fs.root.add(docFolder);
	}

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
	let wpFolder = webFolder.getByName('Wallpaper');
	if (!wpFolder) {
		wpFolder = new Folder('Wallpaper');
		wpFolder.icon = '../assets/images/desk/icons/Folder Closed.webp';
		webFolder.add(wpFolder);
	}

	fetch('../data/desk-wallpaper.json')
		.then(r => r.ok ? r.json() : [])
		.then(items => {
			if (Array.isArray(items)) {
				items.forEach(item => {
					const fileName = item.filename || `${item.name}.webp`;
					if (!wpFolder.children.has(fileName)) {
						const file = new File(fileName, null, item.path);
						file.remoteUrl = item.path;
						file.icon = '../assets/images/desk/icons/Picture.webp';
						file.size = 285000;
						wpFolder.add(file);
					}
				});
				fs.save();
			}
		})
		.catch(() => {});
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
		icon: "../assets/images/desk/icons/Trash.webp",
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

	let targetX = options.x;
	let targetY = options.y;
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
	}
}

function forceCloseWindow(win, id) {
	if (window.WindowManager) {
		window.WindowManager.forceClose(win, id);
		activeWindow = window.WindowManager.activeWindow;
	}
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
	if (!element) return;
	let targetElement = element;
	if (typeof element === 'string' && fs) {
		targetElement = fs.findByPath(element);
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

	const customGapX = (window.SettingsApp && window.SettingsApp.get('desktopGridSpacingX')) || 75;
	const customGapY = (window.SettingsApp && window.SettingsApp.get('desktopGridSpacingY')) || 100;
	const iconWidth = customGapX;
	const iconHeight = customGapY;
	const startX = 10;
	const startY = 10;
	const desktopHeight = window.innerHeight - 40;
	const iconsPerColumn = Math.max(1, Math.floor((desktopHeight - startY) / iconHeight));

	const autoArrange = isAutoArrangeEnabled();
	const alignGrid = isAlignToGridEnabled();
	const positions = loadDesktopIconPositions();

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
			const col = Math.floor(index / iconsPerColumn);
			const row = index % iconsPerColumn;
			const posX = startX + col * (iconWidth + 10);
			const posY = startY + row * iconHeight;

			icon.style.position = 'absolute';
			icon.style.left = `${posX}px`;
			icon.style.top = `${posY}px`;

			if (icon.dataset.path) {
				newPositions[icon.dataset.path] = { x: posX, y: posY };
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
				posX = Math.max(10, Math.min(posX, window.innerWidth - iconWidth - 10));
				posY = Math.max(10, Math.min(posY, desktopHeight - iconHeight - 10));

				icon.style.position = 'absolute';
				icon.style.left = `${posX}px`;
				icon.style.top = `${posY}px`;

				const colSlot = Math.round((posX - startX) / (iconWidth + 10));
				const rowSlot = Math.round((posY - startY) / iconHeight);
				occupiedGridSlots.add(`${colSlot},${rowSlot}`);
			} else {
				while (occupiedGridSlots.has(`${Math.floor(unpositionedIndex / iconsPerColumn)},${unpositionedIndex % iconsPerColumn}`)) {
					unpositionedIndex++;
				}
				const col = Math.floor(unpositionedIndex / iconsPerColumn);
				const row = unpositionedIndex % iconsPerColumn;
				const posX = startX + col * (iconWidth + 10);
				const posY = startY + row * iconHeight;

				icon.style.position = 'absolute';
				icon.style.left = `${posX}px`;
				icon.style.top = `${posY}px`;

				occupiedGridSlots.add(`${col},${row}`);
				if (path) {
					positions[path] = { x: posX, y: posY };
				}
				unpositionedIndex++;
			}
		});
		saveDesktopIconPositions(positions);
	}
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

	const customGapX = (window.SettingsApp && window.SettingsApp.get('desktopGridSpacingX')) || 75;
	const customGapY = (window.SettingsApp && window.SettingsApp.get('desktopGridSpacingY')) || 100;
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
	if (window.AchievementsManager && (source.includes('artwork') || source.includes('/music/') || source.includes('track_artwork') || source.includes('album_artwork'))) {
		window.AchievementsManager.progress('artwork_wallpaper', 1);
	}
	if (typeof refreshUI === 'function') refreshUI();
}

window.setImageAsWallpaper = setImageAsWallpaper;

const DEFAULT_DESKTOP_WALLPAPER = '../assets/images/desk/wallpapers/wallpaper-default.webp';
let desktopWallpapersRegistry = null;

const preloadedWallpapers = new Map();

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

	wallpaperSlideshowTimer = setInterval(async () => {
		const list = await fetchWallpaperRegistry();
		if (!list || list.length === 0) return;
		const isRandom = (window.SettingsApp && window.SettingsApp.get('wallpaperSlideshowRandom')) || localStorage.getItem('wallpaperSlideshowRandom') === 'true';
		let nextWp;
		if (isRandom) {
			nextWp = list[Math.floor(Math.random() * list.length)];
		} else {
			const curr = (window.SettingsApp && window.SettingsApp.get('desktopBackground')) || localStorage.getItem('desktopBackground');
			const idx = list.findIndex(w => w.path === curr);
			nextWp = list[(idx + 1) % list.length];
		}
		if (nextWp) {
			const fit = (window.SettingsApp && window.SettingsApp.get('wallpaperFit')) || localStorage.getItem('wallpaperFit') || 'cover';
			setImageAsWallpaper(nextWp.path, fit);
		}
	}, intervalSec * 1000);
}

function applyInitialDesktopBackground() {
	const mode = (window.SettingsApp && window.SettingsApp.get('wallpaperMode')) || localStorage.getItem('wallpaperMode') || 'picture';
	const bgColor = (window.SettingsApp && window.SettingsApp.get('desktopBackgroundColor')) || localStorage.getItem('desktopBackgroundColor') || '#004e98';
	const current = (window.SettingsApp && window.SettingsApp.get('desktopBackground')) || localStorage.getItem('desktopBackground') || DEFAULT_DESKTOP_WALLPAPER;
	const fit = (window.SettingsApp && window.SettingsApp.get('wallpaperFit')) || localStorage.getItem('wallpaperFit') || 'cover';

	const desktop = document.getElementById('desktop');
	if (!desktop) return;

	desktop.style.backgroundColor = bgColor;
	if (mode === 'color') {
		desktop.style.backgroundImage = 'none';
	} else {
		desktop.style.backgroundImage = `url('${current}')`;
		if (!preloadedWallpapers.has(current)) {
			const img = new Image();
			img.src = current;
			img.onload = () => preloadedWallpapers.set(current, img);
			if (img.complete) preloadedWallpapers.set(current, img);
		}
	}

	document.body.classList.remove('wallpaper-fit-cover', 'wallpaper-fit-stretch', 'wallpaper-fit-center', 'wallpaper-fit-tile', 'wallpaper-fit-fit');
	document.body.classList.add(`wallpaper-fit-${fit}`);

	if (fit === 'stretch') {
		desktop.style.backgroundSize = '100% 100%';
		desktop.style.backgroundRepeat = 'no-repeat';
		desktop.style.backgroundPosition = '0 0';
	} else if (fit === 'fit') {
		desktop.style.backgroundSize = 'contain';
		desktop.style.backgroundRepeat = 'no-repeat';
		desktop.style.backgroundPosition = 'center center';
	} else if (fit === 'center') {
		desktop.style.backgroundSize = 'auto';
		desktop.style.backgroundRepeat = 'no-repeat';
		desktop.style.backgroundPosition = 'center center';
	} else if (fit === 'tile') {
		desktop.style.backgroundSize = 'auto';
		desktop.style.backgroundRepeat = 'repeat';
		desktop.style.backgroundPosition = 'top left';
	} else {
		desktop.style.backgroundSize = 'cover';
		desktop.style.backgroundRepeat = 'no-repeat';
		desktop.style.backgroundPosition = 'center center';
	}

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

async function openDisplaySettings(initialTab = 'desktop', options = {}) {
	const id = 'window-display-properties';
	const existingWindow = document.getElementById(id);
	if (existingWindow) {
		bringWindowToFront(existingWindow);
		const tabBtn = existingWindow.querySelector(`.xp-tab-btn[data-tab="${initialTab}"]`);
		if (tabBtn) tabBtn.click();
		return;
	}

	const bounds = (window.WindowManager && typeof window.WindowManager.getWorkspaceBounds === 'function') 
		? window.WindowManager.getWorkspaceBounds() 
		: { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight - 36, right: window.innerWidth, bottom: window.innerHeight - 36 };

	let targetX = options.x;
	let targetY = options.y;
	if (typeof targetX === 'number' && typeof targetY === 'number') {
		targetX = Math.max(bounds.left + 8, Math.min(targetX, bounds.right - 470 - 8));
		targetY = Math.max(bounds.top + 8, Math.min(targetY, bounds.bottom - 520 - 8));
	}

	let currentBg = (window.SettingsApp && window.SettingsApp.get('desktopBackground')) || localStorage.getItem('desktopBackground') || DEFAULT_DESKTOP_WALLPAPER;
	let currentFit = (window.SettingsApp && window.SettingsApp.get('wallpaperFit')) || localStorage.getItem('wallpaperFit') || 'cover';
	let currentMode = (window.SettingsApp && window.SettingsApp.get('wallpaperMode')) || localStorage.getItem('wallpaperMode') || 'picture';
	let currentBgColor = (window.SettingsApp && window.SettingsApp.get('desktopBackgroundColor')) || localStorage.getItem('desktopBackgroundColor') || '#004e98';
	let currentInterval = (window.SettingsApp && window.SettingsApp.get('wallpaperSlideshowInterval')) || localStorage.getItem('wallpaperSlideshowInterval') || '30';
	let currentRandom = (window.SettingsApp && window.SettingsApp.get('wallpaperSlideshowRandom')) || localStorage.getItem('wallpaperSlideshowRandom') === 'true';

	let selectedWallpaperPath = currentBg;
	let selectedFit = currentFit;
	let selectedMode = currentMode;
	let selectedBgColor = currentBgColor;
	let selectedInterval = currentInterval;
	let selectedRandom = currentRandom;

	const ssSettings = window.ScreenSaverManager ? window.ScreenSaverManager.settings : { activeSaver: 'xp-flying-logo', timeoutMinutes: 5, enabled: true };
	let currentSSEnabled = ssSettings.enabled !== false;
	let currentSS = currentSSEnabled ? (ssSettings.activeSaver || 'xp-flying-logo') : 'none';
	let currentSSTimeout = ssSettings.timeoutMinutes !== undefined ? ssSettings.timeoutMinutes : 5;

	const contentHTML = `
		<div class="xp-tabs-container">
			<div class="xp-tabs-bar">
				<button type="button" class="xp-tab-btn active" data-tab="desktop">Desktop</button>
				<button type="button" class="xp-tab-btn" data-tab="screensaver">Screen Saver</button>
			</div>

			<div class="xp-tab-page-wrapper">
				<div class="xp-tab-page active" data-page="desktop">
					<div class="wallpaper-monitor-container" style="margin-bottom: 6px;">
						<div class="wallpaper-monitor-bezel">
							<div class="wallpaper-monitor-screen" id="disp-monitor-preview" style="background-image: ${selectedMode === 'color' ? 'none' : `url('${selectedWallpaperPath}')`}; background-color: ${selectedBgColor};"></div>
						</div>
						<div class="wallpaper-monitor-stand"></div>
						<div class="wallpaper-monitor-base"></div>
					</div>

					<fieldset class="xp-groupbox">
						<legend>Background Selection</legend>
						<div class="xp-form-row" style="margin-bottom: 6px;">
							<label for="disp-wallpaper-mode" style="width: 80px;">Mode:</label>
							<select id="disp-wallpaper-mode" class="xp-select" style="flex: 1;">
								<option value="picture" ${selectedMode === 'picture' ? 'selected' : ''}>Single Picture</option>
								<option value="slideshow" ${selectedMode === 'slideshow' ? 'selected' : ''}>Wallpaper Slideshow</option>
								<option value="color" ${selectedMode === 'color' ? 'selected' : ''}>Solid Background Color</option>
							</select>
						</div>
						<div style="display: flex; gap: 8px; align-items: flex-start;">
							<div class="xp-listbox-frame" id="disp-wp-listbox" style="height: 110px;"></div>
							<div style="display: flex; flex-direction: column; gap: 6px; width: 145px;">
								<button type="button" class="xp-button-small" id="disp-btn-browse-folder">Open Wallpaper Folder</button>
								<button type="button" class="xp-button-small" id="disp-btn-restore-bliss">Default Bliss</button>
								<div class="xp-form-row" style="flex-direction: column; align-items: flex-start; margin-top: 2px;">
									<label for="disp-select-fit" style="font-size: 10px;">Position:</label>
									<select id="disp-select-fit" class="xp-select" style="width: 100%;">
										<option value="cover" ${selectedFit === 'cover' ? 'selected' : ''}>Fill Screen (Cover)</option>
										<option value="fit" ${selectedFit === 'fit' ? 'selected' : ''}>Fit (Keep Aspect)</option>
										<option value="stretch" ${selectedFit === 'stretch' ? 'selected' : ''}>Stretch to Screen</option>
										<option value="center" ${selectedFit === 'center' ? 'selected' : ''}>Center</option>
										<option value="tile" ${selectedFit === 'tile' ? 'selected' : ''}>Tile</option>
									</select>
								</div>
								<div class="xp-form-row" style="align-items: center; margin-top: 2px;">
									<label for="disp-color-picker" style="font-size: 10px; width: 55px;">Color:</label>
									<input type="color" id="disp-color-picker" value="${selectedBgColor}" style="width: 60px; height: 20px; cursor: pointer;">
								</div>
							</div>
						</div>
						<div id="disp-slideshow-panel" style="margin-top: 8px; display: ${selectedMode === 'slideshow' ? 'flex' : 'none'}; flex-direction: column; gap: 4px; border-top: 1px dashed #aca899; padding-top: 6px;">
							<div class="xp-form-row">
								<label for="disp-slideshow-interval" style="width: 120px;">Change picture every:</label>
								<select id="disp-slideshow-interval" class="xp-select" style="flex: 1;">
									<option value="10" ${String(selectedInterval) === '10' ? 'selected' : ''}>10 seconds</option>
									<option value="30" ${String(selectedInterval) === '30' ? 'selected' : ''}>30 seconds</option>
									<option value="60" ${String(selectedInterval) === '60' ? 'selected' : ''}>1 minute</option>
									<option value="300" ${String(selectedInterval) === '300' ? 'selected' : ''}>5 minutes</option>
									<option value="900" ${String(selectedInterval) === '900' ? 'selected' : ''}>15 minutes</option>
									<option value="1800" ${String(selectedInterval) === '1800' ? 'selected' : ''}>30 minutes</option>
									<option value="3600" ${String(selectedInterval) === '3600' ? 'selected' : ''}>1 hour</option>
								</select>
							</div>
							<div class="xp-checkbox-row">
								<input type="checkbox" id="disp-slideshow-random" ${selectedRandom ? 'checked' : ''}>
								<label for="disp-slideshow-random">Shuffle pictures randomly</label>
							</div>
						</div>
					</fieldset>
				</div>

				<div class="xp-tab-page" data-page="screensaver">
					<div class="wallpaper-monitor-container" style="margin-bottom: 6px;">
						<div class="wallpaper-monitor-bezel">
							<canvas id="disp-ss-monitor-canvas" class="wallpaper-monitor-screen" width="126" height="91" style="width:100%;height:100%;display:block;background:#000000;"></canvas>
						</div>
						<div class="wallpaper-monitor-stand"></div>
						<div class="wallpaper-monitor-base"></div>
					</div>

					<fieldset class="xp-groupbox">
						<legend>Screen Saver</legend>
						<div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
							<select id="disp-ss-select" class="xp-select" style="flex: 1;">
								<option value="xp-flying-logo" ${currentSS === 'xp-flying-logo' ? 'selected' : ''}>3D Flying Windows XP Logo</option>
								<option value="bubbles" ${currentSS === 'bubbles' ? 'selected' : ''}>Bubbles (Bulles Physiques 3D)</option>
								<option value="starfield" ${currentSS === 'starfield' ? 'selected' : ''}>Starfield Simulation</option>
								<option value="pipes" ${currentSS === 'pipes' ? 'selected' : ''}>3D Pipes (Tubes 3D)</option>
								<option value="mystify" ${currentSS === 'mystify' ? 'selected' : ''}>Mystify (Polygones)</option>
								<option value="bezier" ${currentSS === 'bezier' ? 'selected' : ''}>Bouncing Curves (Bézier)</option>
								<option value="blank" ${currentSS === 'blank' ? 'selected' : ''}>Blank Screen</option>
								<option value="random" ${currentSS === 'random' ? 'selected' : ''}>Random (Au hasard)</option>
								<option value="none" ${currentSS === 'none' ? 'selected' : ''}>(None)</option>
							</select>
							<button type="button" class="xp-button-small" id="disp-ss-btn-preview" ${currentSS === 'none' ? 'disabled' : ''}>Preview</button>
						</div>
						<div class="xp-form-row">
							<label for="disp-ss-wait-input" style="width: 50px;">Wait:</label>
							<input type="number" id="disp-ss-wait-input" min="0.1" max="120" step="0.5" value="${currentSSTimeout}" class="xp-input" style="width: 60px;">
							<span>minutes</span>
						</div>
						<div id="disp-ss-custom-settings-panel" class="ss-dynamic-config-panel"></div>
					</fieldset>
				</div>
			</div>

			<div class="xp-dialog-action-footer">
				<button type="button" class="xp-button" id="disp-btn-ok">OK</button>
				<button type="button" class="xp-button" id="disp-btn-cancel">Cancel</button>
				<button type="button" class="xp-button" id="disp-btn-apply" disabled>Apply</button>
			</div>
		</div>
	`;

	const win = createXPWindow(id, 'Display Properties', contentHTML, 470, 520, {
		iconSrc: '../assets/images/desk/icons/Display.webp',
		resizable: false,
		x: targetX,
		y: targetY
	});
	win.querySelector('.xp-window-content').style.padding = '0';
	win.querySelector('.xp-window-content').style.overflowX = 'hidden';

	win.getWindowState = () => {
		const activeBtn = win.querySelector('.xp-tab-btn.active');
		return {
			appId: 'display',
			activeTab: activeBtn ? activeBtn.dataset.tab : 'desktop'
		};
	};

	const tabBtns = win.querySelectorAll('.xp-tab-btn');
	const tabPages = win.querySelectorAll('.xp-tab-page');
	const applyBtn = win.querySelector('#disp-btn-apply');
	const okBtn = win.querySelector('#disp-btn-ok');
	const cancelBtn = win.querySelector('#disp-btn-cancel');
	const wpListbox = win.querySelector('#disp-wp-listbox');
	const monitorPreview = win.querySelector('#disp-monitor-preview');
	const selectFit = win.querySelector('#disp-select-fit');
	const modeSelect = win.querySelector('#disp-wallpaper-mode');
	const colorPicker = win.querySelector('#disp-color-picker');
	const slideshowPanel = win.querySelector('#disp-slideshow-panel');
	const slideshowInterval = win.querySelector('#disp-slideshow-interval');
	const slideshowRandom = win.querySelector('#disp-slideshow-random');

	const ssSelect = win.querySelector('#disp-ss-select');
	const ssCanvas = win.querySelector('#disp-ss-monitor-canvas');
	const ssPreviewBtn = win.querySelector('#disp-ss-btn-preview');
	const ssWaitInput = win.querySelector('#disp-ss-wait-input');
	const ssCustomPanel = win.querySelector('#disp-ss-custom-settings-panel');

	const markDirty = () => {
		if (applyBtn) applyBtn.disabled = false;
	};

	const renderEmbeddedScreensaverSettings = () => {
		if (!ssCustomPanel) return;
		ssCustomPanel.innerHTML = '';
		if (currentSS === 'none' || !window.ScreenSaverManager) return;
		const targetSaver = currentSS === 'random' ? 'xp-flying-logo' : currentSS;
		window.ScreenSaverManager.renderConfigUI(ssCustomPanel, targetSaver, (updatedCfg) => {
			markDirty();
			if (ssCanvas && currentSS !== 'none') {
				window.ScreenSaverManager.updateActivePreviewConfig(ssCanvas, updatedCfg);
			}
		});
	};

	renderEmbeddedScreensaverSettings();

	const refreshWallpaperList = async () => {
		const wallpapers = await fetchWallpaperRegistry();
		wpListbox.innerHTML = '';
		wallpapers.forEach(item => {
			const row = document.createElement('div');
			row.className = 'xp-listbox-item';
			if (item.path === selectedWallpaperPath) row.classList.add('active');
			row.textContent = item.name;
			row.addEventListener('click', () => {
				wpListbox.querySelectorAll('.xp-listbox-item').forEach(r => r.classList.remove('active'));
				row.classList.add('active');
				selectedWallpaperPath = item.path;
				if (selectedMode !== 'color') {
					monitorPreview.style.backgroundImage = `url('${item.path}')`;
				}
				markDirty();
			});
			wpListbox.appendChild(row);
		});
	};

	refreshWallpaperList();

	const updateMonitorScreen = () => {
		monitorPreview.style.backgroundColor = selectedBgColor;
		if (selectedMode === 'color') {
			monitorPreview.style.backgroundImage = 'none';
		} else {
			monitorPreview.style.backgroundImage = `url('${selectedWallpaperPath}')`;
		}
	};

	tabBtns.forEach(btn => {
		btn.addEventListener('click', () => {
			tabBtns.forEach(b => b.classList.toggle('active', b === btn));
			tabPages.forEach(p => p.classList.toggle('active', p.dataset.page === btn.dataset.tab));
			if (btn.dataset.tab === 'screensaver' && window.ScreenSaverManager && ssCanvas) {
				if (currentSS !== 'none') {
					window.ScreenSaverManager.startPreview(ssCanvas, currentSS);
				} else {
					window.ScreenSaverManager.stopPreview(ssCanvas, true);
				}
			} else if (window.ScreenSaverManager && ssCanvas) {
				window.ScreenSaverManager.stopPreview(ssCanvas, true);
			}
		});
	});

	if (initialTab && initialTab !== 'desktop') {
		const targetTab = win.querySelector(`.xp-tab-btn[data-tab="${initialTab}"]`);
		if (targetTab) targetTab.click();
	}

	modeSelect.addEventListener('change', () => {
		selectedMode = modeSelect.value;
		slideshowPanel.style.display = selectedMode === 'slideshow' ? 'flex' : 'none';
		updateMonitorScreen();
		markDirty();
	});

	colorPicker.addEventListener('input', () => {
		selectedBgColor = colorPicker.value;
		updateMonitorScreen();
		markDirty();
	});

	selectFit.addEventListener('change', () => {
		selectedFit = selectFit.value;
		markDirty();
	});

	slideshowInterval.addEventListener('change', () => {
		selectedInterval = slideshowInterval.value;
		markDirty();
	});

	slideshowRandom.addEventListener('change', () => {
		selectedRandom = slideshowRandom.checked;
		markDirty();
	});

	win.querySelector('#disp-btn-browse-folder').addEventListener('click', () => {
		if (fs) {
			let wpFolder = fs.findByPath('/WINDOWS/Web/Wallpaper');
			if (!wpFolder) wpFolder = fs.root;
			if (window.FileExplorer) window.FileExplorer.open(wpFolder);
		}
	});

	win.querySelector('#disp-btn-restore-bliss').addEventListener('click', () => {
		selectedWallpaperPath = DEFAULT_DESKTOP_WALLPAPER;
		selectedMode = 'picture';
		modeSelect.value = 'picture';
		slideshowPanel.style.display = 'none';
		updateMonitorScreen();
		wpListbox.querySelectorAll('.xp-listbox-item').forEach(r => {
			r.classList.toggle('active', r.textContent === 'Windows XP Bliss' || r.textContent === 'Bliss');
		});
		markDirty();
	});

	ssSelect.addEventListener('change', () => {
		currentSS = ssSelect.value;
		if (ssPreviewBtn) ssPreviewBtn.disabled = currentSS === 'none';
		renderEmbeddedScreensaverSettings();
		markDirty();
		const currentCanvas = win.querySelector('#disp-ss-monitor-canvas') || ssCanvas;
		if (window.ScreenSaverManager && currentCanvas) {
			if (currentSS !== 'none') {
				window.ScreenSaverManager.startPreview(currentCanvas, currentSS);
			} else {
				window.ScreenSaverManager.stopPreview(currentCanvas, true);
			}
		}
	});

	if (ssPreviewBtn) {
		ssPreviewBtn.addEventListener('click', () => {
			if (currentSS !== 'none' && window.ScreenSaverManager) {
				window.ScreenSaverManager.settings.activeSaver = currentSS;
				window.ScreenSaverManager.start(true);
			}
		});
	}

	ssWaitInput.addEventListener('input', () => {
		const val = parseFloat(ssWaitInput.value);
		currentSSTimeout = (!isNaN(val) && val > 0) ? val : 1;
		markDirty();
	});

	const saveChanges = () => {
		if (window.SettingsApp) {
			window.SettingsApp.set('wallpaperMode', selectedMode);
			window.SettingsApp.set('desktopBackgroundColor', selectedBgColor);
			window.SettingsApp.set('wallpaperSlideshowInterval', selectedInterval);
			window.SettingsApp.set('wallpaperSlideshowRandom', selectedRandom);
			window.SettingsApp.set('desktopBackground', selectedWallpaperPath);
			window.SettingsApp.set('wallpaperFit', selectedFit);
		} else {
			localStorage.setItem('wallpaperMode', selectedMode);
			localStorage.setItem('desktopBackgroundColor', selectedBgColor);
			localStorage.setItem('wallpaperSlideshowInterval', String(selectedInterval));
			localStorage.setItem('wallpaperSlideshowRandom', String(selectedRandom));
			localStorage.setItem('desktopBackground', selectedWallpaperPath);
			localStorage.setItem('wallpaperFit', selectedFit);
		}

		applyInitialDesktopBackground();

		if (window.ScreenSaverManager) {
			window.ScreenSaverManager.settings.activeSaver = currentSS;
			window.ScreenSaverManager.settings.enabled = (currentSS !== 'none');
			window.ScreenSaverManager.settings.timeoutMinutes = currentSSTimeout;
			window.ScreenSaverManager.saveSettings();
			window.ScreenSaverManager.resetIdleTimer();
		}
		if (applyBtn) applyBtn.disabled = true;
	};

	applyBtn.addEventListener('click', saveChanges);
	okBtn.addEventListener('click', () => {
		saveChanges();
		if (window.ScreenSaverManager && ssCanvas) {
			window.ScreenSaverManager.stopPreview(ssCanvas);
		}
		closeWindow(win, id);
	});
	cancelBtn.addEventListener('click', () => {
		if (window.ScreenSaverManager && ssCanvas) {
			window.ScreenSaverManager.stopPreview(ssCanvas);
		}
		closeWindow(win, id);
	});

	if (window.DeskEventBus) {
		const unsub = window.DeskEventBus.on('fs:changed', () => refreshWallpaperList());
		win.beforeClose = (force) => {
			unsub();
			if (window.ScreenSaverManager && ssCanvas) {
				window.ScreenSaverManager.stopPreview(ssCanvas);
			}
			force();
		};
	}
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

	const runWindow = createXPWindow(id, title, contentHTML, 400, 180, { resizable: false, iconSrc: '../assets/images/desk/icons/Command Prompt.webp' });
	
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
	const raw = command.trim();
	if (!raw) return;
	const parts = raw.split(/\s+/);
	const cmd = parts[0];
	const lowerCmd = cmd.toLowerCase();
	const args = raw.substring(cmd.length).trim();

	if (lowerCmd === 'shutdown') {
		openShutdownDialog();
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

	const aliases = {
		'mspaint': 'paint',
		'pbrush': 'paint',
		'paint': 'paint',
		'calc': 'calculator',
		'calculator': 'calculator',
		'winmine': 'minesweeper',
		'minesweeper': 'minesweeper',
		'sol': 'solitaire',
		'solitaire': 'solitaire',
		'sndrec32': 'soundrecorder',
		'soundrecorder': 'soundrecorder',
		'charmap': 'charmap',
		'wmplayer': 'mediaplayer',
		'wmp': 'mediaplayer',
		'mediaplayer': 'mediaplayer',
		'winamp': 'winamp',
		'iexplore': 'ie',
		'ie': 'ie',
		'msimn': 'outlook',
		'outlook': 'outlook',
		'mail': 'outlook',
		'cmd': 'cmd',
		'command': 'cmd',
		'notepad': 'notepad',
		'write': 'notepad',
		'wordpad': 'notepad',
		'photoviewer': 'pictureviewer',
		'shimgvw': 'pictureviewer',
		'explorer': 'explorer',
		'control': 'settings',
		'cleanmgr': 'recyclebin',
		'recyclebin': 'recyclebin',
		'clippy': 'clippy'
	};
	const resolvedApp = aliases[lowerCmd] || lowerCmd;

	if (resolvedApp === 'clippy') {
		if (window.ClippyAgent && typeof window.ClippyAgent.open === 'function') {
			window.ClippyAgent.open();
			if (args) window.ClippyAgent.prompt(args);
			return;
		}
	}

	if (window.DeskAppRegistry && window.DeskAppRegistry.get(resolvedApp)) {
		let launchArgs = args || undefined;
		if (args && (resolvedApp === 'notepad' || resolvedApp === 'paint' || resolvedApp === 'pictureviewer' || resolvedApp === 'soundrecorder')) {
			let filePath = args.replace(/\\/g, '/');
			if (filePath.startsWith('C:/') || filePath.startsWith('c:/')) filePath = filePath.substring(2);
			if (fs && fs.exists(filePath)) launchArgs = fs.findByPath(filePath);
		}
		window.DeskAppRegistry.launch(resolvedApp, launchArgs);
		return;
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
									<img src="../assets/images/desk/icons/User's Computer.webp" alt="Drive C">
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
									<img src="../assets/images/desk/icons/Floppy Drive.webp" alt="Floppy A">
									<div class="my-comp-texts">
										<strong>3½ Floppy (A:)</strong>
										<span>3½-Inch Floppy Disk</span>
									</div>
								</div>
								<div class="my-comp-item" id="mycomp-item-cdrom">
									<img src="../assets/images/desk/icons/Disk Image File.webp" alt="CD Drive D">
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
		showXPDialog('CD Drive (D:)', 'Microsoft Windows XP Professional SP3 Installation Media.', 'info');
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
		iconSrc: '../assets/images/desk/icons/Search.webp'
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
	const outlookWindow = createXPWindow(id, 'Outlook Express', contentHTML, APP_WINDOW_BASE_SIZES.outlook.width, APP_WINDOW_BASE_SIZES.outlook.height, { iconSrc: '../assets/images/desk/icons/Mail.webp' });
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
}
