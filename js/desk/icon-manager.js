(function () {
	const STORAGE_KEY_OVERRIDES = 'xp_icon_overrides';
	const DEFAULT_ICON_PATH = '../assets/images/desk/icons/File.webp';
	const BASE_ICON_DIR = '../assets/images/desk/icons/';
	const CATALOG_URL = '../data/desk-icons.json';

	class IconManagerService {
		constructor() {
			this.catalog = new Map();
			this.aliases = new Map();
			this.themes = new Map();
			this.customOverrides = new Map();
			this.activeTheme = 'default';
			this.initialized = false;
			this.isLoaded = false;

			this.readyPromise = new Promise((resolve) => {
				this.readyResolve = resolve;
			});

			this.initBuiltinFallback();
		}

		initBuiltinFallback() {
		}

		async init() {
			if (this.initialized) return this.readyPromise;
			this.initialized = true;

			this.loadSavedOverrides();

			try {
				let response = await fetch(CATALOG_URL);
				if (!response.ok) {
					response = await fetch('data/desk-icons.json');
				}
				if (response.ok) {
					const data = await response.json();
					this.hydrateFromJSON(data);
				}
			} catch (e) {}

			this.isLoaded = true;
			this.readyResolve(true);

			if (window.DeskEventBus) {
				window.DeskEventBus.on('settings:changed', (payload) => {
					if (payload && payload.key === 'iconTheme') {
						this.setTheme(payload.value, false);
					}
				});
			}

			return this.readyPromise;
		}

		ready() {
			return this.readyPromise;
		}

		hydrateFromJSON(data) {
			if (!data) return;
			const basePath = data.basePath || BASE_ICON_DIR;

			if (Array.isArray(data.icons)) {
				data.icons.forEach(entry => {
					let url = entry.url;
					if (!url && entry.file) {
						url = entry.file.startsWith('http') || entry.file.startsWith('/') || entry.file.startsWith('../')
							? entry.file
							: `${basePath}${entry.file}`;
					}
					const record = {
						id: entry.id,
						name: entry.name || entry.id,
						category: entry.category || 'general',
						url: url || DEFAULT_ICON_PATH,
						filename: entry.file || (url ? url.split('/').pop() : '')
					};

					this.catalog.set(record.id, record);
					if (record.filename) {
						this.catalog.set(record.filename.toLowerCase(), record);
					}
					if (record.url) {
						this.catalog.set(record.url.toLowerCase(), record);
					}
					if (record.name) {
						this.catalog.set(record.name.toLowerCase(), record);
					}
				});
			}

			if (data.aliases && typeof data.aliases === 'object') {
				Object.entries(data.aliases).forEach(([alias, target]) => {
					this.aliases.set(alias.toLowerCase(), target.toLowerCase());
				});
			}

			if (data.themes && typeof data.themes === 'object') {
				Object.entries(data.themes).forEach(([themeKey, themeData]) => {
					this.themes.set(themeKey, themeData);
				});
			}
		}

		loadSavedOverrides() {
			try {
				const raw = window.DeskStorage ? window.DeskStorage.getItem(STORAGE_KEY_OVERRIDES) : localStorage.getItem(STORAGE_KEY_OVERRIDES);
				if (raw) {
					const data = JSON.parse(raw);
					if (typeof data === 'object' && data !== null) {
						Object.entries(data).forEach(([k, v]) => {
							this.customOverrides.set(k, v);
						});
					}
				}
			} catch (e) {}

			if (window.SettingsApp && typeof window.SettingsApp.get === 'function') {
				const themeSetting = window.SettingsApp.get('iconTheme');
				if (themeSetting) {
					this.activeTheme = themeSetting;
				}
			}
		}

		saveOverrides() {
			try {
				const obj = {};
				for (const [key, val] of this.customOverrides.entries()) {
					obj[key] = val;
				}
				const payload = JSON.stringify(obj);
				if (window.DeskStorage) window.DeskStorage.setItem(STORAGE_KEY_OVERRIDES, payload);
				else localStorage.setItem(STORAGE_KEY_OVERRIDES, payload);
			} catch (e) {}
		}

		normalizeKey(key) {
			if (!key || typeof key !== 'string') return 'file';
			let clean = key.trim().toLowerCase();
			if (clean.startsWith('app://')) {
				clean = clean.substring(6);
			}
			if (this.aliases.has(clean)) {
				clean = this.aliases.get(clean);
			}
			return clean;
		}

		resolveCatalogEntry(key) {
			if (!key) return null;
			const clean = this.normalizeKey(key);
			if (this.catalog.has(clean)) {
				return this.catalog.get(clean);
			}
			const basename = key.split('/').pop().toLowerCase();
			if (this.catalog.has(basename)) {
				return this.catalog.get(basename);
			}
			return null;
		}

		get(identifier, fallbackUrl = DEFAULT_ICON_PATH) {
			if (!identifier) return fallbackUrl;

			if (this.customOverrides.has(identifier)) {
				return this.customOverrides.get(identifier);
			}

			const norm = this.normalizeKey(identifier);
			if (this.customOverrides.has(norm)) {
				return this.customOverrides.get(norm);
			}

			const themeObj = this.themes.get(this.activeTheme);
			if (themeObj && themeObj.overrides && themeObj.overrides[norm]) {
				const over = themeObj.overrides[norm];
				const rec = this.resolveCatalogEntry(over);
				return rec ? rec.url : over;
			}

			const entry = this.resolveCatalogEntry(identifier);
			if (entry) {
				return entry.url;
			}

			if (typeof identifier === 'string' && (
				identifier.startsWith('http://') ||
				identifier.startsWith('https://') ||
				identifier.startsWith('data:') ||
				identifier.startsWith('/') ||
				identifier.startsWith('../') ||
				identifier.startsWith('./') ||
				identifier.startsWith('assets/')
			)) {
				return identifier;
			}

			return fallbackUrl;
		}

		getSystemIcon(systemType, fallbackUrl = DEFAULT_ICON_PATH) {
			return this.get(systemType, fallbackUrl);
		}

		getAppIcon(appId, fallbackUrl = DEFAULT_ICON_PATH) {
			return this.get(appId, fallbackUrl);
		}

		getFileIcon(fileOrName, fallbackUrl = DEFAULT_ICON_PATH) {
			if (!fileOrName) return fallbackUrl;
			if (typeof fileOrName === 'object') {
				if (fileOrName.icon) return this.get(fileOrName.icon, fallbackUrl);
				if (fileOrName instanceof window.Folder) return this.get('folder', fallbackUrl);
				if (fileOrName instanceof window.Shortcut) return this.get(fileOrName.icon || 'folder', fallbackUrl);
				if (fileOrName instanceof window.ProjectFile) {
					return fileOrName.projectData?.icon ? this.get(fileOrName.projectData.icon) : this.get('file', fallbackUrl);
				}
			}
			const filename = typeof fileOrName === 'string' ? fileOrName : (fileOrName.name || '');
			if (window.ShellAssociations) {
				const cfg = window.ShellAssociations.getConfig(filename);
				if (cfg && cfg.defaultIcon) {
					return this.get(cfg.defaultIcon, fallbackUrl);
				}
			}
			return this.get('file', fallbackUrl);
		}

		getAllIcons(category = null) {
			const list = Array.from(new Set(Array.from(this.catalog.values()))).filter(item => item && item.id);
			if (category && category !== 'all') {
				return list.filter(item => item.category === category);
			}
			return list;
		}

		getAvatarIcons() {
			return this.getAllIcons().filter(item => {
				const u = item.url || '';
				return u.endsWith('.webp') && !u.startsWith('http');
			});
		}

		getCategories() {
			const cats = new Set();
			this.catalog.forEach(item => {
				if (item.category) cats.add(item.category);
			});
			return Array.from(cats);
		}

		getThemes() {
			return Array.from(this.themes.values());
		}

		setTheme(themeId, emitEvent = true) {
			if (!this.themes.has(themeId) && themeId !== 'default') return false;
			this.activeTheme = themeId;
			if (window.SettingsApp && typeof window.SettingsApp.set === 'function') {
				window.SettingsApp.set('iconTheme', themeId);
			}
			if (emitEvent && window.DeskEventBus) {
				window.DeskEventBus.emit('icons:theme-changed', { themeId });
				window.DeskEventBus.emit('icons:changed');
			}
			if (typeof refreshUI === 'function') {
				refreshUI();
			}
			return true;
		}

		setCustomIcon(targetKey, iconUrl) {
			if (!targetKey || !iconUrl) return;
			this.customOverrides.set(targetKey, iconUrl);
			this.saveOverrides();
			if (window.DeskEventBus) {
				window.DeskEventBus.emit('icons:override-changed', { targetKey, iconUrl });
				window.DeskEventBus.emit('icons:changed');
			}
			if (typeof refreshUI === 'function') {
				refreshUI();
			}
		}

		resetCustomIcon(targetKey) {
			if (this.customOverrides.has(targetKey)) {
				this.customOverrides.delete(targetKey);
				this.saveOverrides();
				if (window.DeskEventBus) {
					window.DeskEventBus.emit('icons:override-changed', { targetKey, iconUrl: null });
					window.DeskEventBus.emit('icons:changed');
				}
				if (typeof refreshUI === 'function') {
					refreshUI();
				}
			}
		}

		resetAllCustomIcons() {
			this.customOverrides.clear();
			this.saveOverrides();
			if (window.DeskEventBus) {
				window.DeskEventBus.emit('icons:changed');
			}
			if (typeof refreshUI === 'function') {
				refreshUI();
			}
		}

		openChangeIconDialog(options = {}) {
			const currentIcon = options.currentIcon ? this.get(options.currentIcon) : DEFAULT_ICON_PATH;
			const targetTitle = options.title || 'Change Icon';
			const dialogId = `dialog-change-icon-${Date.now()}`;
			let selectedUrl = currentIcon;
			let selectedId = null;

			const categories = this.getCategories();
			let categoryOptionsHtml = `<option value="all">All Categories</option>`;
			categories.forEach(cat => {
				const catLabel = cat.charAt(0).toUpperCase() + cat.slice(1);
				categoryOptionsHtml += `<option value="${cat}">${catLabel}</option>`;
			});

			const contentHTML = `
				<div class="xp-change-icon-layout">
					<div class="xp-change-icon-header">
						<label for="xp-icon-source-input">Look for icons in this resource:</label>
						<div class="xp-change-icon-source-row">
							<input type="text" id="xp-icon-source-input" class="xp-input" value="C:\\WINDOWS\\system32\\shell32.dll" readonly style="flex:1;">
							<button type="button" class="xp-button-small" id="xp-icon-browse-btn">Browse...</button>
							<input type="file" id="xp-icon-file-input" accept="image/*" style="display:none;">
						</div>
					</div>

					<div class="xp-change-icon-filter-row">
						<label for="xp-icon-cat-filter" style="font-size:11px;">Category:</label>
						<select id="xp-icon-cat-filter" class="xp-select" style="flex:1;">
							${categoryOptionsHtml}
						</select>
						<label for="xp-icon-search-input" style="font-size:11px; margin-left:6px;">Search:</label>
						<input type="text" id="xp-icon-search-input" class="xp-input" placeholder="Filter..." style="width:120px;">
					</div>

					<div class="xp-change-icon-grid-frame">
						<div class="xp-change-icon-grid" id="xp-change-icon-list"></div>
					</div>

					<div class="xp-change-icon-preview-row">
						<div class="xp-change-icon-preview-box">
							<img src="${currentIcon}" id="xp-icon-selection-preview" alt="">
						</div>
						<div class="xp-change-icon-preview-text">
							<strong id="xp-icon-preview-name">Current Icon</strong>
							<span id="xp-icon-preview-details">Select an icon from the list above</span>
						</div>
						<button type="button" class="xp-button-small" id="xp-icon-restore-default-btn" style="margin-left:auto;">Restore Default</button>
					</div>

					<div class="xp-dialog-action-footer">
						<button type="button" class="xp-button" id="xp-icon-dialog-ok">OK</button>
						<button type="button" class="xp-button" id="xp-icon-dialog-cancel">Cancel</button>
					</div>
				</div>
			`;

			const dialogWin = (typeof createXPWindow === 'function')
				? createXPWindow(dialogId, targetTitle, contentHTML, 520, 460, {
					resizable: false,
					isModal: true,
					iconSrc: this.get('display')
				})
				: null;

			if (!dialogWin) return null;

			dialogWin.querySelector('.xp-window-content').style.padding = '0';
			dialogWin.querySelector('.xp-window-content').style.overflow = 'hidden';

			const gridEl = dialogWin.querySelector('#xp-change-icon-list');
			const catSelectEl = dialogWin.querySelector('#xp-icon-cat-filter');
			const searchInputEl = dialogWin.querySelector('#xp-icon-search-input');
			const previewImgEl = dialogWin.querySelector('#xp-icon-selection-preview');
			const previewNameEl = dialogWin.querySelector('#xp-icon-preview-name');
			const previewDetailsEl = dialogWin.querySelector('#xp-icon-preview-details');
			const btnOk = dialogWin.querySelector('#xp-icon-dialog-ok');
			const btnCancel = dialogWin.querySelector('#xp-icon-dialog-cancel');
			const btnBrowse = dialogWin.querySelector('#xp-icon-browse-btn');
			const fileInput = dialogWin.querySelector('#xp-icon-file-input');
			const btnRestoreDefault = dialogWin.querySelector('#xp-icon-restore-default-btn');
			const sourceInput = dialogWin.querySelector('#xp-icon-source-input');

			const renderGrid = () => {
				if (!gridEl) return;
				gridEl.innerHTML = '';

				const activeCategory = catSelectEl.value;
				const filterTerm = searchInputEl.value.toLowerCase().trim();

				let filtered = this.getAllIcons(activeCategory);
				if (filterTerm) {
					filtered = filtered.filter(item => item.name.toLowerCase().includes(filterTerm) || item.id.includes(filterTerm));
				}

				filtered.forEach(iconItem => {
					const itemEl = document.createElement('div');
					itemEl.className = 'xp-icon-picker-cell';
					if (iconItem.url === selectedUrl || iconItem.id === selectedId) {
						itemEl.classList.add('selected');
					}
					itemEl.title = `${iconItem.name} (${iconItem.category})`;

					const img = document.createElement('img');
					img.src = iconItem.url;
					img.alt = iconItem.name;
					img.loading = 'lazy';
					itemEl.appendChild(img);

					itemEl.addEventListener('click', () => {
						gridEl.querySelectorAll('.xp-icon-picker-cell').forEach(c => c.classList.remove('selected'));
						itemEl.classList.add('selected');
						selectedUrl = iconItem.url;
						selectedId = iconItem.id;
						previewImgEl.src = selectedUrl;
						previewNameEl.textContent = iconItem.name;
						previewDetailsEl.textContent = `Category: ${iconItem.category} | File: ${iconItem.filename || ''}`;
					});

					itemEl.addEventListener('dblclick', () => {
						confirmSelection();
					});

					gridEl.appendChild(itemEl);
				});
			};

			const confirmSelection = () => {
				if (typeof closeWindow === 'function') closeWindow(dialogWin, dialogId);
				if (typeof options.onSelect === 'function') {
					options.onSelect(selectedUrl, selectedId);
				}
			};

			catSelectEl.addEventListener('change', renderGrid);
			searchInputEl.addEventListener('input', renderGrid);

			btnBrowse.addEventListener('click', () => fileInput.click());
			fileInput.addEventListener('change', (e) => {
				const file = e.target.files[0];
				if (!file) return;
				const reader = new FileReader();
				reader.onload = (event) => {
					selectedUrl = event.target.result;
					selectedId = `custom-user-${Date.now()}`;
					sourceInput.value = file.name;
					previewImgEl.src = selectedUrl;
					previewNameEl.textContent = file.name;
					previewDetailsEl.textContent = 'User custom image';
					gridEl.querySelectorAll('.xp-icon-picker-cell').forEach(c => c.classList.remove('selected'));
				};
				reader.readAsDataURL(file);
			});

			btnRestoreDefault.addEventListener('click', () => {
				const defaultResolved = options.defaultIcon ? this.get(options.defaultIcon) : DEFAULT_ICON_PATH;
				selectedUrl = defaultResolved;
				selectedId = null;
				sourceInput.value = 'C:\\WINDOWS\\system32\\shell32.dll';
				previewImgEl.src = selectedUrl;
				previewNameEl.textContent = 'Default System Icon';
				previewDetailsEl.textContent = 'Standard Windows XP icon';
				renderGrid();
			});

			btnOk.addEventListener('click', confirmSelection);
			btnCancel.addEventListener('click', () => {
				if (typeof closeWindow === 'function') closeWindow(dialogWin, dialogId);
				if (typeof options.onCancel === 'function') options.onCancel();
			});

			renderGrid();
			return dialogWin;
		}
	}

	window.DeskIconManager = new IconManagerService();
	window.IconManager = window.DeskIconManager;
})();
