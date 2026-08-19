(function () {
	const USAGE_STORAGE_KEY = 'xp_app_usage_metrics';

	class ApplicationRegistry {
		constructor() {
			this.apps = new Map();
			this.aliases = new Map();
			this.categories = new Set();
			this.usageMetrics = this.loadUsageMetrics();
		}

		loadUsageMetrics() {
			try {
				const raw = localStorage.getItem(USAGE_STORAGE_KEY);
				return raw ? JSON.parse(raw) : {};
			} catch (e) {
				return {};
			}
		}

		saveUsageMetrics() {
			try {
				localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(this.usageMetrics));
			} catch (e) {}
		}

		register(manifest) {
			if (!manifest || !manifest.id) return;
			const id = manifest.id.toLowerCase();
			const entry = {
				id,
				name: manifest.name || id,
				subtitle: manifest.subtitle || '',
				icon: manifest.icon || '../assets/images/desk/icons/File.webp',
				category: manifest.category || 'Accessories',
				pinnable: manifest.pinnable !== false,
				showInStartMenu: manifest.showInStartMenu !== false,
				showInAllPrograms: manifest.showInAllPrograms !== false,
				quickLaunchEligible: manifest.quickLaunchEligible !== false,
				aliases: Array.isArray(manifest.aliases) ? manifest.aliases.map(a => a.toLowerCase()) : [],
				verbs: manifest.verbs || {},
				handler: typeof manifest.handler === 'function' ? manifest.handler : () => null
			};

			this.apps.set(id, entry);
			this.categories.add(entry.category);

			entry.aliases.forEach(alias => {
				this.aliases.set(alias, id);
			});

			if (window.DeskEventBus) {
				window.DeskEventBus.emit('app:registered', entry);
			}
		}

		unregister(id) {
			const key = String(id).toLowerCase();
			const app = this.apps.get(key);
			if (!app) return false;
			app.aliases.forEach(alias => this.aliases.delete(alias));
			this.apps.delete(key);
			return true;
		}

		get(id) {
			if (!id) return null;
			const key = String(id).toLowerCase();
			if (this.apps.has(key)) return this.apps.get(key);
			if (this.aliases.has(key)) {
				const realId = this.aliases.get(key);
				return this.apps.get(realId) || null;
			}
			return null;
		}

		getAll() {
			return Array.from(this.apps.values());
		}

		getByCategory(category) {
			return this.getAll().filter(app => app.category.toLowerCase() === String(category).toLowerCase());
		}

		getCategories() {
			return Array.from(this.categories);
		}

		recordLaunch(id) {
			const app = this.get(id);
			if (!app) return;
			const key = app.id;
			const now = Date.now();
			if (!this.usageMetrics[key]) {
				this.usageMetrics[key] = { count: 0, lastLaunched: now };
			}
			this.usageMetrics[key].count++;
			this.usageMetrics[key].lastLaunched = now;
			this.saveUsageMetrics();

			if (window.DeskEventBus) {
				window.DeskEventBus.emit('app:launched', { id: key, metrics: this.usageMetrics[key] });
			}
		}

		getFrequentApps(limit = 6) {
			const entries = Object.keys(this.usageMetrics)
				.map(id => ({ app: this.get(id), metric: this.usageMetrics[id] }))
				.filter(item => item.app && item.app.showInStartMenu !== false);

			entries.sort((a, b) => b.metric.count - a.metric.count || b.metric.lastLaunched - a.metric.lastLaunched);
			return entries.slice(0, limit).map(item => item.app);
		}

		launch(id, args = {}) {
			const app = this.get(id);
			if (!app) return false;
			this.recordLaunch(app.id);

			if (window.DeskAPI && typeof window.DeskAPI.addToRecentDocs === 'function' && app.id !== 'settings' && app.id !== 'recyclebin') {
				window.DeskAPI.addToRecentDocs({ name: app.name, icon: app.icon, type: 'application', path: `app://${app.id}` });
			}

			if (window.DeskEventBus) {
				window.DeskEventBus.emit('app:before-launch', { id: app.id, args });
			}

			let result = null;
			if (args && args.verb && app.verbs && typeof app.verbs[args.verb] === 'function') {
				result = app.verbs[args.verb](args);
			} else {
				result = app.handler(args);
			}

			if (window.DeskEventBus) {
				window.DeskEventBus.emit('app:after-launch', { id: app.id, args, result });
			}

			return result !== false;
		}

		initDefaultApps() {
			this.register({
				id: 'outlook',
				name: 'Outlook Express',
				subtitle: 'E-mail Client',
				icon: '../assets/images/desk/icons/Mail.webp',
				category: 'Internet',
				aliases: ['mail', 'oe', 'email', 'inbox', 'msimn', 'msimn.exe'],
				handler: () => {
					if (typeof openOutlookExpress === 'function') openOutlookExpress();
				}
			});

			this.register({
				id: 'ie',
				name: 'Internet Explorer',
				subtitle: 'Web Browser',
				icon: '../assets/images/desk/icons/Internet Explorer.webp',
				category: 'Internet',
				aliases: ['internet', 'browser', 'web', 'explore', 'iexplore', 'iexplore.exe'],
				handler: (args) => {
					const url = typeof args === 'string' ? args : (args && args.url ? args.url : 'about:home');
					if (window.InternetExplorerApp) window.InternetExplorerApp.open(url);
					else if (typeof openInternetExplorer === 'function') openInternetExplorer(url);
				}
			});

			this.register({
				id: 'calculator',
				name: 'Calculator',
				icon: '../assets/images/desk/icons/Calculator.webp',
				category: 'Accessories',
				aliases: ['calc', 'calc.exe'],
				handler: () => {
					if (window.CalculatorApp) window.CalculatorApp.open();
					else if (typeof openCalculator === 'function') openCalculator();
				}
			});

			this.register({
				id: 'paint',
				name: 'Paint',
				icon: '../assets/images/desk/icons/Paint.webp',
				category: 'Accessories',
				aliases: ['mspaint', 'mspaint.exe', 'pbrush', 'pbrush.exe', 'draw'],
				handler: (args) => {
					if (window.PaintApp) window.PaintApp.open(args);
					else if (typeof openPaint === 'function') openPaint(args);
				}
			});

			this.register({
				id: 'notepad',
				name: 'Notepad',
				icon: '../assets/images/desk/icons/Notepad.webp',
				category: 'Accessories',
				aliases: ['text', 'editor', 'notes', 'notepad.exe'],
				handler: (args) => {
					if (window.NotepadApp) {
						if (args && args.name) window.NotepadApp.open(args);
						else window.NotepadApp.openNew();
					} else if (typeof openTextEditorWindow === 'function' && args) {
						openTextEditorWindow(args);
					}
				}
			});

			this.register({
				id: 'cmd',
				name: 'Command Prompt',
				icon: '../assets/images/desk/icons/Command Prompt.webp',
				category: 'Accessories',
				aliases: ['terminal', 'prompt', 'console', 'command', 'cmd.exe'],
				handler: (args) => {
					if (window.CommandPrompt) window.CommandPrompt.open(args);
					else if (typeof processRunCommand === 'function') processRunCommand('cmd');
				}
			});

			this.register({
				id: 'soundrecorder',
				name: 'Sound Recorder',
				icon: '../assets/images/desk/icons/Music File.webp',
				category: 'Entertainment',
				aliases: ['sound-recorder', 'sndrec32', 'sndrec32.exe', 'recorder', 'voice', 'audio'],
				handler: (args) => {
					if (window.SoundRecorderApp) window.SoundRecorderApp.open(args);
				}
			});

			this.register({
				id: 'charmap',
				name: 'Character Map',
				icon: '../assets/images/desk/icons/List File.webp',
				category: 'System Tools',
				aliases: ['character-map', 'charactermap', 'symbols', 'characters', 'charmap.exe'],
				handler: () => {
					if (window.CharacterMapApp) window.CharacterMapApp.open();
				}
			});

			this.register({
				id: 'winamp',
				name: 'Winamp Media Player',
				icon: '../assets/images/desk/icons/Winamp.webp',
				category: 'Entertainment',
				aliases: ['music', 'mp3', 'player', 'audio-player', 'winamp.exe'],
				handler: () => {
					if (typeof openWinamp === 'function') openWinamp();
				}
			});

			this.register({
				id: 'minesweeper',
				name: 'Minesweeper',
				icon: '../assets/images/desk/icons/Minesweeper.webp',
				category: 'Games',
				aliases: ['mine', 'mines', 'winmine', 'winmine.exe'],
				handler: () => {
					if (window.MinesweeperApp) window.MinesweeperApp.open();
					else if (typeof openMinesweeper === 'function') openMinesweeper();
				}
			});

			this.register({
				id: 'solitaire',
				name: 'Solitaire',
				icon: '../assets/images/desk/icons/Hearts.webp',
				category: 'Games',
				aliases: ['sol', 'cards', 'klondike', 'patience', 'sol.exe'],
				handler: () => {
					if (window.SolitaireApp) window.SolitaireApp.open();
					else if (typeof openSolitaire === 'function') openSolitaire();
				}
			});

			this.register({
				id: 'settings',
				name: 'Control Panel',
				icon: '../assets/images/desk/icons/System Properties.webp',
				category: 'System Tools',
				aliases: ['controlpanel', 'preferences', 'config', 'control', 'control.exe', 'msconfig', 'sysdm.cpl', 'taskmgr', 'taskmgr.exe', 'regedit', 'regedit.exe'],
				handler: (args) => {
					const tab = typeof args === 'string' ? args : (args && args.tab ? args.tab : 'system');
					if (window.SettingsApp) window.SettingsApp.open(tab);
				}
			});

			this.register({
				id: 'display',
				name: 'Display & Wallpapers',
				icon: '../assets/images/desk/icons/Display.webp',
				category: 'Appearance',
				aliases: ['wallpaper', 'themes', 'screensaver', 'desk.cpl'],
				handler: () => {
					if (typeof openDisplaySettings === 'function') openDisplaySettings();
					else if (window.SettingsApp) window.SettingsApp.open('appearance');
				}
			});

			this.register({
				id: 'mycomputer',
				name: 'My Computer',
				icon: '../assets/images/desk/icons/My Computer.webp',
				category: 'System Tools',
				aliases: ['computer', 'explorer', 'explorer.exe', 'drives'],
				handler: () => {
					if (typeof openMyComputerWindow === 'function') openMyComputerWindow();
				}
			});

			this.register({
				id: 'printers',
				name: 'Printers and Faxes',
				icon: '../assets/images/desk/icons/Fax.webp',
				category: 'System Tools',
				aliases: ['faxes', 'printer', 'printers'],
				handler: () => {
					if (typeof openPrintersWindow === 'function') openPrintersWindow();
				}
			});

			this.register({
				id: 'network',
				name: 'My Network Places',
				icon: '../assets/images/desk/icons/My Network Places.webp',
				category: 'System Tools',
				aliases: ['networkplaces', 'netplaces', 'shares'],
				handler: () => {
					if (typeof openNetworkPlacesWindow === 'function') openNetworkPlacesWindow();
				}
			});

			this.register({
				id: 'search',
				name: 'Search Companion',
				icon: '../assets/images/desk/icons/Search.webp',
				category: 'System Tools',
				aliases: ['find', 'locate'],
				handler: (args) => {
					const q = typeof args === 'string' ? args : (args && args.query ? args.query : '');
					if (typeof openSearchWindow === 'function') openSearchWindow(q);
				}
			});

			this.register({
				id: 'recyclebin',
				name: 'Recycle Bin',
				icon: '../assets/images/desk/icons/Trash.webp',
				category: 'System Tools',
				aliases: ['trash', 'garbage', 'bin'],
				handler: () => {
					if (typeof openRecycleBinWindow === 'function') openRecycleBinWindow();
				}
			});

			this.register({
				id: 'achievements',
				name: 'Milestones & Trophies',
				subtitle: 'Desktop Quests',
				icon: '../assets/images/desk/icons/Trophy.webp',
				category: 'Entertainment',
				aliases: ['trophies', 'quests', 'milestones'],
				handler: (args) => {
					const id = typeof args === 'string' ? args : (args && args.targetId ? args.targetId : null);
					if (window.AchievementsManager) window.AchievementsManager.open(id);
				}
			});

			this.register({
				id: 'projects',
				name: 'My Projects',
				subtitle: 'Portfolio Works',
				icon: '../assets/images/desk/icons/Folder Open.webp',
				category: 'Portfolio Projects',
				aliases: ['portfolio', 'work', 'showcase'],
				handler: () => {
					if (typeof openAllProjectsFolder === 'function') openAllProjectsFolder();
				}
			});

			this.register({
				id: 'todayanecdote',
				name: "Today's Anecdote",
				icon: '../assets/images/desk/icons/Calendar.webp',
				category: 'Accessories',
				aliases: ['today-anecdote', 'anecdote', 'anecdotes', 'daily'],
				handler: () => {
					if (typeof openAnecdoteWindow === 'function') openAnecdoteWindow(new Date());
				}
			});

			this.register({
				id: 'markdownpreview',
				name: 'Markdown Live Preview',
				subtitle: 'Document & Formula Typesetter',
				icon: '../assets/images/desk/icons/List File.webp',
				category: 'Accessories',
				aliases: ['markdown', 'preview', 'katex', 'math-preview'],
				handler: (args) => {
					if (window.MarkdownPreviewApp) {
						if (args && args.textarea) {
							window.MarkdownPreviewApp.open(args);
						} else if (window.NotepadApp) {
							const npWin = window.NotepadApp.open(null, { title: 'Notes.md', initialContent: '# Welcome to Markdown\n\nWrite notes, formulas like $$E = mc^2$$ and tables.' });
							if (npWin && npWin.notepadSession) {
								window.MarkdownPreviewApp.open(npWin.notepadSession);
							}
						}
					}
				}
			});
		}
	}

	window.DeskAppRegistry = new ApplicationRegistry();
	window.DeskAppRegistry.initDefaultApps();
})();
