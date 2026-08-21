(function () {
	class VFSPath {
		static normalize(rawPath) {
			if (!rawPath || typeof rawPath !== 'string') return '/';
			let p = rawPath.trim().replace(/\\/g, '/');

			const driveMatch = p.match(/^([a-zA-Z]):(\/.*)?$/);
			if (driveMatch) {
				const driveLetter = driveMatch[1].toUpperCase();
				const subPath = driveMatch[2] || '';
				if (driveLetter === 'C') {
					p = subPath ? subPath : '/';
				} else {
					p = `/Volumes/${driveLetter}${subPath ? (subPath.startsWith('/') ? subPath : `/${subPath}`) : ''}`;
				}
			}

			if (p.startsWith('/Volumes/C/') || p === '/Volumes/C') {
				p = p.substring(10) || '/';
			}

			if (!p.startsWith('/')) {
				p = `/${p}`;
			}

			const parts = p.split('/').filter(Boolean);
			const resolved = [];

			for (const part of parts) {
				if (part === '.') continue;
				if (part === '..') {
					if (resolved.length > 0) resolved.pop();
				} else {
					resolved.push(part);
				}
			}

			return resolved.length === 0 ? '/' : `/${resolved.join('/')}`;
		}

		static join(...segments) {
			return VFSPath.normalize(segments.filter(Boolean).join('/'));
		}

		static basename(path) {
			const norm = VFSPath.normalize(path);
			if (norm === '/') return '/';
			return norm.split('/').pop() || '';
		}

		static dirname(path) {
			const norm = VFSPath.normalize(path);
			if (norm === '/') return '/';
			const parts = norm.split('/').filter(Boolean);
			parts.pop();
			return parts.length === 0 ? '/' : `/${parts.join('/')}`;
		}

		static extname(path) {
			const base = VFSPath.basename(path);
			const idx = base.lastIndexOf('.');
			return (idx <= 0) ? '' : base.substring(idx).toLowerCase();
		}

		static isAbsolute(path) {
			if (!path || typeof path !== 'string') return false;
			return path.startsWith('/') || /^[a-zA-Z]:/i.test(path);
		}

		static resolve(from, to) {
			if (VFSPath.isAbsolute(to)) {
				return VFSPath.normalize(to);
			}
			return VFSPath.join(from, to);
		}

		static toWindowsPath(posixPath) {
			const norm = VFSPath.normalize(posixPath);
			if (norm.startsWith('/Volumes/')) {
				const parts = norm.split('/').filter(Boolean);
				const drive = (parts[1] || 'D').toUpperCase();
				const rest = parts.slice(2).join('\\');
				return rest ? `${drive}:\\${rest}` : `${drive}:\\`;
			}
			if (norm === '/') {
				return 'C:\\Documents and Settings\\Colin B.R.\\Desktop';
			}
			const rest = norm.substring(1).replace(/\//g, '\\');
			return `C:\\${rest}`;
		}
	}

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
				system: false,
				readOnly: false
			};
			this.mountPoint = null;
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
				if (typeof loadDesktopIconPositions === 'function' && typeof saveDesktopIconPositions === 'function') {
					const posMap = loadDesktopIconPositions();
					if (posMap[oldPath]) {
						posMap[newPath] = posMap[oldPath];
						delete posMap[oldPath];
						saveDesktopIconPositions(posMap);
					}
				}
			} else {
				this.name = sanitized;
			}
			this.modifiedAt = new Date();
		}

		getFullPath() {
			if (this.mountPoint && !this.parent) {
				return VFSPath.normalize(this.mountPoint);
			}
			if (!this.parent) {
				return this.mountPoint ? VFSPath.normalize(this.mountPoint) : '/';
			}
			let path = '';
			let current = this;
			while (current && current.parent) {
				path = `/${current.name}${path}`;
				current = current.parent;
			}
			const rootMount = current && current.mountPoint ? current.mountPoint : '';
			const combined = `${rootMount}${path}`;
			return VFSPath.normalize(combined);
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
			this.mimeType = 'text/plain';
		}

		read() {
			return this.content;
		}

		write(newContent) {
			if (this.readOnly || this.attributes.readOnly) {
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
			newFile.mimeType = this.mimeType;
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
				mimeType: this.mimeType
			};
		}
	}

	class Folder extends Element {
		constructor(name, parent = null) {
			super(name, parent);
			this.children = new Map();
			this.icon = '../assets/images/desk/icons/Folder Closed.webp';
			this.isDynamicLibrary = false;
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

		has(name) {
			return this.children.has(name);
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
				return {
					files: this.listContent().filter(c => !(c instanceof Folder)).length,
					folders: this.listContent().filter(c => c instanceof Folder).length
				};
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
			if (this.isDynamicLibrary) {
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
				children: Array.from(this.children.values())
					.filter(child => !(child instanceof Folder && child.isDynamicLibrary))
					.map(child => child.toJSON())
			};
		}
	}

	class Shortcut extends Element {
		constructor(name, parent = null, targetPath = '/', icon = null) {
			super(name, parent);
			this.targetPath = targetPath;
			this.icon = icon || '../assets/images/desk/icons/Folder Closed.webp';
		}

		resolve() {
			const fsInstance = (typeof fs !== 'undefined' && fs) ? fs : window.fs;
			if (fsInstance && typeof fsInstance.findByPath === 'function') {
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
				icon: this.icon
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
				icon: this.icon
			};
		}
	}

	class VFSProvider {
		constructor(name, options = {}) {
			this.name = name;
			this.options = options;
			this.mountPoint = null;
			this.vfs = null;
			this.readOnly = !!options.readOnly;
			this.hidden = !!options.hidden;
		}

		mount(mountPoint, vfsManager) {
			this.mountPoint = VFSPath.normalize(mountPoint);
			this.vfs = vfsManager;
		}

		unmount() {
			this.mountPoint = null;
			this.vfs = null;
		}

		getRootNode() {
			return null;
		}

		getNode(relativePath) {
			return null;
		}

		exists(relativePath) {
			return this.getNode(relativePath) !== null;
		}

		list(relativePath) {
			const node = this.getNode(relativePath);
			if (node instanceof Folder) {
				return node.listContent();
			}
			return [];
		}

		read(relativePath) {
			const node = this.getNode(relativePath);
			if (node instanceof File) {
				return node.read();
			}
			throw new Error(`Path "${relativePath}" is not a readable file.`);
		}

		write(relativePath, content) {
			if (this.readOnly) throw new Error(`Provider "${this.name}" is read-only.`);
			const node = this.getNode(relativePath);
			if (node instanceof File) {
				node.write(content);
				return node;
			}
			throw new Error(`Path "${relativePath}" is not a writable file.`);
		}

		create(relativePath, type, name, options = {}) {
			if (this.readOnly) throw new Error(`Provider "${this.name}" is read-only.`);
			const parentNode = this.getNode(relativePath);
			if (!(parentNode instanceof Folder)) {
				throw new Error(`Invalid folder path: ${relativePath}`);
			}
			const getBaseAndExt = (filename) => {
				const lastDot = filename.lastIndexOf('.');
				if (lastDot <= 0) return [filename, ''];
				return [filename.substring(0, lastDot), filename.substring(lastDot)];
			};
			const [baseName, ext] = getBaseAndExt(name);
			const finalName = parentNode.getUniqueName(baseName, ext);
			let element;

			if (type === 'Folder') {
				element = new Folder(finalName);
				if (options.icon) element.icon = options.icon;
			} else if (type === 'Shortcut') {
				element = new Shortcut(finalName, null, options.targetPath || '/', options.icon || '../assets/images/desk/icons/Folder Closed.webp');
			} else if (type === 'ProjectFile') {
				element = new ProjectFile(finalName, null, options.projectData || {});
			} else {
				element = new File(finalName, null, options.content || '');
				if (options.icon) element.icon = options.icon;
				else if (window.ShellAssociations) element.icon = window.ShellAssociations.getIcon(element);
			}

			parentNode.add(element);
			return element;
		}

		delete(relativePath) {
			if (this.readOnly) throw new Error(`Provider "${this.name}" is read-only.`);
			const node = this.getNode(relativePath);
			if (!node || !node.parent) throw new Error('Cannot delete root or non-existent element.');
			const parent = node.parent;
			parent.remove(node.name);
			return true;
		}

		search(query, relativePath = '') {
			const q = String(query).toLowerCase().trim();
			if (!q) return [];
			const root = this.getNode(relativePath);
			if (!root) return [];
			const results = [];
			const walk = (node) => {
				if (node.name.toLowerCase().includes(q)) {
					results.push(node);
				}
				if (node instanceof Folder) {
					for (const child of node.children.values()) {
						walk(child);
					}
				}
			};
			walk(root);
			return results;
		}

		stat(relativePath) {
			const node = this.getNode(relativePath);
			if (!node) return null;
			return {
				name: node.name,
				type: node.constructor.name,
				size: node instanceof Folder ? node.calculateSize() : (node.size || 0),
				createdAt: node.createdAt,
				modifiedAt: node.modifiedAt,
				readOnly: this.readOnly || !!node.readOnly || !!node.attributes?.readOnly,
				hidden: !!node.hidden
			};
		}

		refresh() {}
		save() {}
		load() {}
	}

	class LocalStorageVFSProvider extends VFSProvider {
		constructor(name = 'local', options = {}) {
			super(name, options);
			this.storageKey = options.storageKey || 'fileSystem';
			this.rootNode = new Folder(options.rootName || 'Desktop');
		}

		mount(mountPoint, vfsManager) {
			super.mount(mountPoint, vfsManager);
			this.rootNode.mountPoint = this.mountPoint;
			this.load();
		}

		getRootNode() {
			return this.rootNode;
		}

		getNode(relativePath) {
			const norm = VFSPath.normalize(relativePath);
			if (norm === '/' || norm === '') return this.rootNode;
			const parts = norm.split('/').filter(Boolean);
			let current = this.rootNode;
			for (const part of parts) {
				if (!(current instanceof Folder) || !current.children.has(part)) {
					return null;
				}
				current = current.getByName(part);
			}
			return current;
		}

		create(relativePath, type, name, options = {}) {
			const el = super.create(relativePath, type, name, options);
			this.save();
			return el;
		}

		write(relativePath, content) {
			const el = super.write(relativePath, content);
			this.save();
			return el;
		}

		delete(relativePath) {
			const result = super.delete(relativePath);
			this.save();
			return result;
		}

		save() {
			try {
				const payload = JSON.stringify(this.rootNode.toJSON());
				if (window.DeskStorage) {
					window.DeskStorage.setItem(this.storageKey, payload);
				} else {
					localStorage.setItem(this.storageKey, payload);
				}
			} catch (e) {}
		}

		load() {
			try {
				const savedData = window.DeskStorage ? window.DeskStorage.getItem(this.storageKey) : localStorage.getItem(this.storageKey);
				if (savedData) {
					const data = JSON.parse(savedData);
					this.rootNode = this.rehydrate(data, null);
					this.rootNode.mountPoint = this.mountPoint;
				}
			} catch (e) {
				this.rootNode = new Folder(this.options.rootName || 'Desktop');
				this.rootNode.mountPoint = this.mountPoint;
			}
		}

		rehydrate(data, parent) {
			let element;
			const type = data.type || 'File';
			if (type === 'Folder') {
				element = new Folder(data.name, parent);
				element.isDynamicLibrary = !!data.isDynamicLibrary;
				if (data.children && Array.isArray(data.children)) {
					data.children.forEach(childData => {
						const childElement = this.rehydrate(childData, element);
						element.add(childElement);
					});
				}
			} else if (type === 'Shortcut') {
				element = new Shortcut(data.name, parent, data.targetPath, data.icon);
			} else if (type === 'ProjectFile') {
				element = new ProjectFile(data.name, parent, data.projectData);
			} else {
				element = new File(data.name, parent, data.content || '');
				element.readOnly = !!data.readOnly;
				element.remoteUrl = data.remoteUrl || null;
				element.savedFromNotepad = !!data.savedFromNotepad;
				element.mimeType = data.mimeType || 'text/plain';
			}

			element.createdAt = new Date(data.createdAt || Date.now());
			element.modifiedAt = new Date(data.modifiedAt || Date.now());
			element.hidden = !!data.hidden;
			if (data.attributes) element.attributes = Object.assign({}, data.attributes);
			if (data.icon) element.icon = data.icon;
			else if (window.ShellAssociations) element.icon = window.ShellAssociations.getIcon(element);

			return element;
		}
	}

	class MemoryVFSProvider extends VFSProvider {
		constructor(name = 'memory', options = {}) {
			super(name, options);
			this.rootNode = new Folder(options.rootName || name);
		}

		mount(mountPoint, vfsManager) {
			super.mount(mountPoint, vfsManager);
			this.rootNode.mountPoint = this.mountPoint;
		}

		getRootNode() {
			return this.rootNode;
		}

		getNode(relativePath) {
			const norm = VFSPath.normalize(relativePath);
			if (norm === '/' || norm === '') return this.rootNode;
			const parts = norm.split('/').filter(Boolean);
			let current = this.rootNode;
			for (const part of parts) {
				if (!(current instanceof Folder) || !current.children.has(part)) {
					return null;
				}
				current = current.getByName(part);
			}
			return current;
		}
	}

	class IndexedDBVFSProvider extends VFSProvider {
		constructor(name = 'indexeddb', options = {}) {
			super(name, Object.assign({ hidden: true }, options));
			this.dbName = options.dbName || 'Wartets_XP_VFS_DB';
			this.storeName = options.storeName || 'vfs_files';
			this.rootNode = new Folder(options.rootName || name);
			this.rootNode.hidden = options.hidden !== undefined ? !!options.hidden : true;
			this.db = null;
			this.isReady = false;
		}

		mount(mountPoint, vfsManager) {
			super.mount(mountPoint, vfsManager);
			this.rootNode.mountPoint = this.mountPoint;
			this.initDB();
		}

		initDB() {
			if (!window.indexedDB) {
				this.isReady = true;
				return;
			}
			const req = indexedDB.open(this.dbName, 1);
			req.onupgradeneeded = (e) => {
				const db = e.target.result;
				if (!db.objectStoreNames.contains(this.storeName)) {
					db.createObjectStore(this.storeName, { keyPath: 'path' });
				}
			};
			req.onsuccess = (e) => {
				this.db = e.target.result;
				this.isReady = true;
				this.loadFromDB();
			};
			req.onerror = () => {
				this.isReady = true;
			};
		}

		loadFromDB() {
			if (!this.db) return;
			try {
				const tx = this.db.transaction(this.storeName, 'readonly');
				const store = tx.objectStore(this.storeName);
				const req = store.getAll();
				req.onsuccess = () => {
					const items = req.result || [];
					items.forEach(record => {
						const parts = record.path.split('/').filter(Boolean);
						let curr = this.rootNode;
						for (let i = 0; i < parts.length - 1; i++) {
							const seg = parts[i];
							if (!curr.children.has(seg)) {
								const f = new Folder(seg);
								curr.add(f);
							}
							curr = curr.getByName(seg);
						}
						const fileName = parts[parts.length - 1];
						if (fileName && !curr.children.has(fileName)) {
							const f = new File(fileName, null, record.content || '');
							if (record.mimeType) f.mimeType = record.mimeType;
							curr.add(f);
						}
					});
					if (this.vfs) this.vfs.emitEvent('fs:changed', { mountPoint: this.mountPoint });
				};
			} catch (e) {}
		}

		persistRecord(path, content, mimeType) {
			if (!this.db) return;
			try {
				const tx = this.db.transaction(this.storeName, 'readwrite');
				const store = tx.objectStore(this.storeName);
				store.put({ path, content, mimeType, modifiedAt: Date.now() });
			} catch (e) {}
		}

		deleteRecord(path) {
			if (!this.db) return;
			try {
				const tx = this.db.transaction(this.storeName, 'readwrite');
				const store = tx.objectStore(this.storeName);
				store.delete(path);
			} catch (e) {}
		}

		getRootNode() {
			return this.rootNode;
		}

		getNode(relativePath) {
			const norm = VFSPath.normalize(relativePath);
			if (norm === '/' || norm === '') return this.rootNode;
			const parts = norm.split('/').filter(Boolean);
			let current = this.rootNode;
			for (const part of parts) {
				if (!(current instanceof Folder) || !current.children.has(part)) {
					return null;
				}
				current = current.getByName(part);
			}
			return current;
		}

		create(relativePath, type, name, options = {}) {
			const el = super.create(relativePath, type, name, options);
			if (el instanceof File) {
				this.persistRecord(el.getFullPath(), el.content, el.mimeType);
			}
			return el;
		}

		write(relativePath, content) {
			const el = super.write(relativePath, content);
			if (el instanceof File) {
				this.persistRecord(el.getFullPath(), el.content, el.mimeType);
			}
			return el;
		}

		delete(relativePath) {
			const node = this.getNode(relativePath);
			if (node) {
				this.deleteRecord(node.getFullPath());
			}
			return super.delete(relativePath);
		}
	}

	class DynamicLibraryVFSProvider extends VFSProvider {
		constructor(name, options = {}) {
			super(name, Object.assign({ readOnly: true }, options));
			this.rootNode = new Folder(options.rootName || name);
			this.rootNode.isDynamicLibrary = true;
			this.generatorFn = options.generator || null;
		}

		mount(mountPoint, vfsManager) {
			super.mount(mountPoint, vfsManager);
			this.rootNode.mountPoint = this.mountPoint;
			this.refresh();
		}

		getRootNode() {
			return this.rootNode;
		}

		refresh() {
			if (typeof this.generatorFn === 'function') {
				this.rootNode.children.clear();
				const items = this.generatorFn(this) || [];
				items.forEach(item => {
					if (item instanceof Element && !this.rootNode.children.has(item.name)) {
						item.parent = this.rootNode;
						this.rootNode.add(item);
					}
				});
			}
		}

		getNode(relativePath) {
			const norm = VFSPath.normalize(relativePath);
			if (norm === '/' || norm === '') return this.rootNode;
			const parts = norm.split('/').filter(Boolean);
			let current = this.rootNode;
			for (const part of parts) {
				if (!(current instanceof Folder) || !current.children.has(part)) {
					return null;
				}
				current = current.getByName(part);
			}
			return current;
		}
	}

	class StaticJSONVFSProvider extends VFSProvider {
		constructor(name, options = {}) {
			super(name, Object.assign({ readOnly: true }, options));
			this.endpoint = options.endpoint || '';
			this.rootNode = new Folder(options.rootName || name);
			this.rootNode.isDynamicLibrary = true;
			this.transformFn = options.transform || null;
			this.isLoaded = false;
		}

		mount(mountPoint, vfsManager) {
			super.mount(mountPoint, vfsManager);
			this.rootNode.mountPoint = this.mountPoint;
			this.fetchData();
		}

		getRootNode() {
			return this.rootNode;
		}

		async fetchData() {
			if (!this.endpoint) return;
			try {
				const response = await fetch(this.endpoint);
				if (!response.ok) return;
				const data = await response.json();
				this.rootNode.children.clear();
				if (typeof this.transformFn === 'function') {
					const items = this.transformFn(data, this) || [];
					items.forEach(item => {
						if (item instanceof Element && !this.rootNode.children.has(item.name)) {
							item.parent = this.rootNode;
							this.rootNode.add(item);
						}
					});
				}
				this.isLoaded = true;
				if (this.vfs) this.vfs.emitEvent('fs:changed', { mountPoint: this.mountPoint });
			} catch (e) {}
		}

		getNode(relativePath) {
			const norm = VFSPath.normalize(relativePath);
			if (norm === '/' || norm === '') return this.rootNode;
			const parts = norm.split('/').filter(Boolean);
			let current = this.rootNode;
			for (const part of parts) {
				if (!(current instanceof Folder) || !current.children.has(part)) {
					return null;
				}
				current = current.getByName(part);
			}
			return current;
		}
	}

	class VirtualDriveProvider extends VFSProvider {
		constructor(driveLetter, options = {}) {
			super(`Drive_${driveLetter}`, options);
			this.driveLetter = driveLetter.toUpperCase();
			this.volumeLabel = options.volumeLabel || `Volume (${this.driveLetter}:)`;
			this.fileSystemType = options.fileSystemType || 'FAT32';
			this.totalBytes = options.totalBytes || 1024 * 1024 * 1024;
			this.freeBytes = options.freeBytes || Math.round(this.totalBytes * 0.4);
			this.driveType = options.driveType || 'fixed';
			this.driveIcon = options.icon || '../assets/images/desk/icons/User\'s Computer.webp';
			this.isReady = options.isReady !== false;
			this.rootNode = new Folder(`${this.driveLetter}:`);
			this.rootNode.icon = this.driveIcon;
			this.initDefaultFiles();
		}

		initDefaultFiles() {
			if (this.driveType === 'cdrom') {
				const autorun = new File('AUTORUN.INF', null, '[AutoRun]\r\nopen=setup.exe\r\nicon=setup.exe,0\r\n');
				autorun.readOnly = true;
				this.rootNode.add(autorun);

				const readme = new File('README.HTM', null, '<html><body><h1>Microsoft Windows XP Professional SP3</h1><p>Setup Disc Media</p></body></html>');
				readme.readOnly = true;
				this.rootNode.add(readme);

				const i386 = new Folder('I386');
				i386.readOnly = true;
				this.rootNode.add(i386);
			} else if (this.driveType === 'removable') {
				this.isReady = false;
			}
		}

		mount(mountPoint, vfsManager) {
			super.mount(mountPoint, vfsManager);
			this.rootNode.mountPoint = this.mountPoint;
		}

		getRootNode() {
			return this.rootNode;
		}

		getNode(relativePath) {
			if (!this.isReady && this.driveType === 'removable') {
				return null;
			}
			const norm = VFSPath.normalize(relativePath);
			if (norm === '/' || norm === '') return this.rootNode;
			const parts = norm.split('/').filter(Boolean);
			let current = this.rootNode;
			for (const part of parts) {
				if (!(current instanceof Folder) || !current.children.has(part)) {
					return null;
				}
				current = current.getByName(part);
			}
			return current;
		}
	}

	class VFSManager {
		static typeRegistry = new Map();
		static providerRegistry = new Map();

		static registerType(type, constructorRef) {
			VFSManager.typeRegistry.set(type, constructorRef);
		}

		static registerProvider(type, factoryFn) {
			VFSManager.providerRegistry.set(type, factoryFn);
		}

		constructor() {
			this.mountPoints = new Map();
			this.drives = new Map();
			this.clipboard = {
				mode: null,
				elements: [],
				paths: [],
				element: null
			};
			this.undoStack = [];
			this.redoStack = [];
			this.initTypeRegistry();
			this.initProviderRegistry();
			this.initDefaultMounts();
		}

		initTypeRegistry() {
			VFSManager.registerType('Folder', Folder);
			VFSManager.registerType('File', File);
			VFSManager.registerType('Shortcut', Shortcut);
			VFSManager.registerType('ProjectFile', ProjectFile);
		}

		initProviderRegistry() {
			VFSManager.registerProvider('local', (options) => new LocalStorageVFSProvider(options.name || 'local', options));
			VFSManager.registerProvider('memory', (options) => new MemoryVFSProvider(options.name || 'memory', options));
			VFSManager.registerProvider('indexeddb', (options) => new IndexedDBVFSProvider(options.name || 'indexeddb', options));
			VFSManager.registerProvider('dynamic', (options) => new DynamicLibraryVFSProvider(options.name || 'dynamic', options));
			VFSManager.registerProvider('static-json', (options) => new StaticJSONVFSProvider(options.name || 'static-json', options));
			VFSManager.registerProvider('drive', (options) => new VirtualDriveProvider(options.letter || 'D', options));
		}

		initDefaultMounts() {
			const rootLocalProvider = new LocalStorageVFSProvider('root-desktop', {
				storageKey: 'fileSystem',
				rootName: 'Desktop'
			});
			this.mount('/', rootLocalProvider);

			const driveC = new VirtualDriveProvider('C', {
				volumeLabel: 'Local Disk (C:)',
				totalBytes: 40 * 1024 * 1024 * 1024,
				freeBytes: 24.8 * 1024 * 1024 * 1024,
				driveType: 'fixed',
				icon: '../assets/images/desk/icons/User\'s Computer.webp'
			});
			this.registerDrive('C', driveC, '/');

			const volumesFolder = this.ensureDirectory('/Volumes');
			if (volumesFolder instanceof Folder) {
				volumesFolder.hidden = true;
			}

			const driveD = new VirtualDriveProvider('D', {
				volumeLabel: 'CD Drive (D:) XP_SP3',
				totalBytes: 700 * 1024 * 1024,
				freeBytes: 0,
				driveType: 'cdrom',
				icon: '../assets/images/desk/icons/Disk Image File.webp'
			});
			this.mount('/Volumes/D', driveD, { hidden: true });
			this.registerDrive('D', driveD, '/Volumes/D');

			const driveA = new VirtualDriveProvider('A', {
				volumeLabel: '3½ Floppy (A:)',
				totalBytes: 1.44 * 1024 * 1024,
				freeBytes: 1.44 * 1024 * 1024,
				driveType: 'removable',
				icon: '../assets/images/desk/icons/Floppy Drive.webp',
				isReady: false
			});
			this.mount('/Volumes/A', driveA, { hidden: true });
			this.registerDrive('A', driveA, '/Volumes/A');

			const tempProvider = new MemoryVFSProvider('temp-storage', {
				rootName: 'Temp',
				hidden: true
			});
			this.mount('/Temp', tempProvider, { hidden: true });
		}

		get root() {
			const rootProvider = this.mountPoints.get('/');
			return rootProvider ? rootProvider.getRootNode() : null;
		}

		set root(newRoot) {
			const rootProvider = this.mountPoints.get('/');
			if (rootProvider && rootProvider instanceof LocalStorageVFSProvider) {
				rootProvider.rootNode = newRoot;
			}
		}

		ensureDirectory(fullPath) {
			const norm = VFSPath.normalize(fullPath);
			if (norm === '/') return this.root;
			const parts = norm.split('/').filter(Boolean);
			let current = this.root;
			for (const part of parts) {
				if (!current.children.has(part)) {
					const newFolder = new Folder(part);
					current.add(newFolder);
				}
				current = current.getByName(part);
				if (!(current instanceof Folder)) {
					throw new Error(`Path collision: "${part}" is not a folder.`);
				}
			}
			return current;
		}

		mount(mountPath, provider, options = {}) {
			const normPath = VFSPath.normalize(mountPath);
			provider.mount(normPath, this);
			this.mountPoints.set(normPath, provider);

			if (normPath !== '/') {
				const parentPath = VFSPath.dirname(normPath);
				const mountName = VFSPath.basename(normPath);
				const parentFolder = this.ensureDirectory(parentPath);
				if (parentFolder instanceof Folder) {
					const rootNode = provider.getRootNode();
					if (rootNode) {
						rootNode.name = mountName;
						rootNode.mountPoint = normPath;
						rootNode.parent = parentFolder;
						rootNode.icon = rootNode.icon || options.icon || provider.options.icon || '../assets/images/desk/icons/Folder Closed.webp';
						if (options.hidden !== undefined || provider.options.hidden !== undefined) {
							rootNode.hidden = options.hidden !== undefined ? !!options.hidden : !!provider.options.hidden;
						}
						if (!parentFolder.children.has(mountName)) {
							parentFolder.add(rootNode);
						} else {
							parentFolder.children.set(mountName, rootNode);
						}
					}
				}
			}

			this.emitEvent('fs:mounted', { mountPath: normPath, providerName: provider.name });
			return provider;
		}

		unmount(mountPath) {
			const normPath = VFSPath.normalize(mountPath);
			if (normPath === '/') throw new Error('Cannot unmount root filesystem.');
			const provider = this.mountPoints.get(normPath);
			if (!provider) return false;

			const parentPath = VFSPath.dirname(normPath);
			const mountName = VFSPath.basename(normPath);
			const parentFolder = this.findByPath(parentPath);
			if (parentFolder instanceof Folder && parentFolder.children.has(mountName)) {
				parentFolder.remove(mountName);
			}

			provider.unmount();
			this.mountPoints.delete(normPath);
			this.emitEvent('fs:unmounted', { mountPath: normPath });
			return true;
		}

		registerDrive(letter, provider, mountPath) {
			this.drives.set(letter.toUpperCase(), {
				letter: letter.toUpperCase(),
				provider,
				mountPath: VFSPath.normalize(mountPath)
			});
		}

		getDrives() {
			return Array.from(this.drives.values()).map(d => ({
				letter: d.letter,
				volumeLabel: d.provider.volumeLabel,
				driveType: d.provider.driveType,
				fileSystemType: d.provider.fileSystemType,
				totalBytes: d.provider.totalBytes,
				freeBytes: d.provider.freeBytes,
				icon: d.provider.driveIcon,
				isReady: d.provider.isReady,
				mountPath: d.mountPath
			}));
		}

		getDrive(letter) {
			if (!letter) return null;
			return this.drives.get(String(letter).toUpperCase()) || null;
		}

		resolveProvider(fullPath) {
			const norm = VFSPath.normalize(fullPath);
			const sortedMounts = Array.from(this.mountPoints.keys()).sort((a, b) => b.length - a.length);

			for (const mount of sortedMounts) {
				if (norm === mount || norm.startsWith(`${mount}/`) || mount === '/') {
					const provider = this.mountPoints.get(mount);
					let relativePath = norm.substring(mount.length);
					if (!relativePath.startsWith('/')) relativePath = `/${relativePath}`;
					return {
						provider,
						mountPoint: mount,
						relativePath: relativePath === '/' ? '' : relativePath
					};
				}
			}

			const fallback = this.mountPoints.get('/');
			return {
				provider: fallback,
				mountPoint: '/',
				relativePath: norm === '/' ? '' : norm
			};
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

		read(path) {
			const norm = VFSPath.normalize(path);
			const { provider, relativePath } = this.resolveProvider(norm);
			if (!provider) throw new Error(`Path not found: ${path}`);
			return provider.read(relativePath);
		}

		write(path, content) {
			const norm = VFSPath.normalize(path);
			const { provider, relativePath } = this.resolveProvider(norm);
			if (!provider) throw new Error(`Path not found: ${path}`);
			const file = provider.write(relativePath, content);
			this.emitEvent('fs:modified', { path: norm, element: file });
			return file;
		}

		stat(path) {
			const norm = VFSPath.normalize(path);
			const { provider, relativePath } = this.resolveProvider(norm);
			if (!provider) return null;
			return provider.stat(relativePath);
		}

		findByPath(path) {
			if (!path) return this.root;
			if (typeof path === 'object' && typeof path.getFullPath === 'function') {
				return path;
			}
			const norm = VFSPath.normalize(String(path));
			const { provider, relativePath } = this.resolveProvider(norm);
			if (!provider) return null;
			return provider.getNode(relativePath);
		}

		create(type, path, name, options = {}) {
			const norm = VFSPath.normalize(path);
			const { provider, relativePath } = this.resolveProvider(norm);
			if (!provider) throw new Error(`No filesystem mounted for path: ${path}`);
			if (provider.readOnly) throw new Error(`Location "${path}" is read-only.`);

			const newElement = provider.create(relativePath, type, name, options);
			this.undoStack.push({
				type: 'create',
				path: newElement.getFullPath(),
				elementData: newElement.toJSON()
			});
			this.redoStack = [];
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
			const norm = VFSPath.normalize(path);
			const { provider, relativePath } = this.resolveProvider(norm);
			if (!provider || provider.readOnly) throw new Error('Cannot delete items from a read-only filesystem.');

			if (element instanceof File && element.savedFromNotepad && window.AchievementsManager) {
				window.AchievementsManager.progress('notepad_save_delete', 1);
			}
			if (element instanceof Folder && (element.name.toLowerCase() === 'music' || element.getFullPath() === '/Music') && window.AchievementsManager) {
				window.AchievementsManager.progress('delete_music_library', 1);
			}

			const fullPath = element.getFullPath();
			if (typeof loadDesktopIconPositions === 'function' && typeof saveDesktopIconPositions === 'function') {
				const posMap = loadDesktopIconPositions();
				if (posMap[fullPath]) {
					delete posMap[fullPath];
					saveDesktopIconPositions(posMap);
				}
			}

			const name = element.name;
			provider.delete(relativePath);
			this.emitEvent('fs:deleted', { path: norm, name });
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

			if (element.parent === destFolder) return element;

			const srcRes = this.resolveProvider(sourcePath);
			const destRes = this.resolveProvider(destPath);
			if (srcRes.provider.readOnly) throw new Error('Source filesystem is read-only.');
			if (destRes.provider.readOnly) throw new Error('Destination filesystem is read-only.');

			const getBaseAndExt = (filename) => {
				const lastDot = filename.lastIndexOf('.');
				if (lastDot <= 0) return [filename, ''];
				return [filename.substring(0, lastDot), filename.substring(lastDot)];
			};

			const [baseName, ext] = getBaseAndExt(element.name);
			const finalName = destFolder.getUniqueName(baseName, ext);

			const originalParent = element.parent;
			const originalName = element.name;

			if (srcRes.provider !== destRes.provider) {
				const cloned = element.copy();
				cloned.name = finalName;
				cloned.parent = destFolder;
				destFolder.add(cloned);
				originalParent.remove(originalName);
				if (typeof srcRes.provider.save === 'function') srcRes.provider.save();
				if (typeof destRes.provider.save === 'function') destRes.provider.save();
				this.undoStack.push({
					type: 'move',
					fromParentPath: originalParent.getFullPath(),
					fromPath: sourcePath,
					toPath: cloned.getFullPath(),
					originalName,
					destName: finalName
				});
				this.redoStack = [];
				this.emitEvent('fs:moved', { element: cloned, sourcePath, destPath: cloned.getFullPath() });
				return cloned;
			}

			originalParent.remove(originalName);
			element.name = finalName;
			destFolder.add(element);

			if (destRes.provider.save) {
				destRes.provider.save();
			}

			this.undoStack.push({
				type: 'move',
				fromParentPath: originalParent.getFullPath(),
				fromPath: sourcePath,
				toPath: element.getFullPath(),
				originalName,
				destName: finalName
			});
			this.redoStack = [];

			this.emitEvent('fs:moved', { element, sourcePath, destPath: element.getFullPath() });
			return element;
		}

		copy(sourcePath, destPath) {
			const elementToCopy = this.findByPath(sourcePath);
			const destFolder = this.findByPath(destPath);

			if (!elementToCopy) throw new Error('Source element not found.');
			if (!(destFolder instanceof Folder)) throw new Error('Destination is not a folder.');

			const destRes = this.resolveProvider(destPath);
			if (destRes.provider.readOnly) throw new Error('Destination filesystem is read-only.');

			const getBaseAndExt = (filename) => {
				const lastDot = filename.lastIndexOf('.');
				if (lastDot <= 0) return [filename, ''];
				return [filename.substring(0, lastDot), filename.substring(lastDot)];
			};

			const [baseName, ext] = getBaseAndExt(elementToCopy.name);
			let finalName = `Copy of ${baseName}${ext}`;
			let counter = 2;
			while (destFolder.children.has(finalName)) {
				finalName = `Copy (${counter}) of ${baseName}${ext}`;
				counter++;
			}

			const newElement = elementToCopy.copy();
			newElement.name = finalName;
			newElement.readOnly = false;
			if (newElement.attributes) newElement.attributes.readOnly = false;
			destFolder.add(newElement);

			if (destRes.provider.save) destRes.provider.save();

			this.undoStack.push({
				type: 'copy',
				path: newElement.getFullPath(),
				elementData: newElement.toJSON()
			});
			this.redoStack = [];

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
				const raw = window.DeskStorage ? window.DeskStorage.getItem('recycleBinItems') : localStorage.getItem('recycleBinItems');
				return raw ? JSON.parse(raw) : [];
			} catch (error) {
				return [];
			}
		}

		saveRecycleBinItems(items) {
			try {
				const payload = JSON.stringify(items);
				if (window.DeskStorage) {
					window.DeskStorage.setItem('recycleBinItems', payload);
				} else {
					localStorage.setItem('recycleBinItems', payload);
				}
			} catch (e) {}
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
			}
			return false;
		}

		search(query, basePath = '/') {
			if (!query || typeof query !== 'string') return [];
			const q = query.toLowerCase().trim();
			const results = [];
			for (const provider of this.mountPoints.values()) {
				const matches = provider.search(q);
				matches.forEach(m => {
					if (!results.includes(m)) results.push(m);
				});
			}
			return results;
		}

		save() {
			const rootProv = this.mountPoints.get('/');
			if (rootProv && rootProv.save) {
				rootProv.save();
			}
		}

		load() {
			const rootProv = this.mountPoints.get('/');
			if (rootProv && rootProv.load) {
				rootProv.load();
			}
		}

		rehydrate(data, parent) {
			let element;
			const ConstructorClass = VFSManager.typeRegistry.get(data.type) || File;
			if (data.type === 'Folder') {
				element = new ConstructorClass(data.name, parent);
				element.isDynamicLibrary = !!data.isDynamicLibrary;
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
				element.mimeType = data.mimeType || 'text/plain';
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

	window.VFSPath = VFSPath;
	window.Element = Element;
	window.File = File;
	window.Folder = Folder;
	window.Shortcut = Shortcut;
	window.ProjectFile = ProjectFile;
	window.VFSProvider = VFSProvider;
	window.LocalStorageVFSProvider = LocalStorageVFSProvider;
	window.MemoryVFSProvider = MemoryVFSProvider;
	window.IndexedDBVFSProvider = IndexedDBVFSProvider;
	window.DynamicLibraryVFSProvider = DynamicLibraryVFSProvider;
	window.StaticJSONVFSProvider = StaticJSONVFSProvider;
	window.VirtualDriveProvider = VirtualDriveProvider;
	window.VFSManager = VFSManager;
	window.FileSystemManager = VFSManager;
})();
