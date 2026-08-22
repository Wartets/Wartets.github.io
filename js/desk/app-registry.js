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
				const raw = window.DeskStorage ? window.DeskStorage.getItem(USAGE_STORAGE_KEY) : localStorage.getItem(USAGE_STORAGE_KEY);
				return raw ? JSON.parse(raw) : {};
			} catch (e) {
				return {};
			}
		}

		saveUsageMetrics() {
			try {
				const payload = JSON.stringify(this.usageMetrics);
				if (window.DeskStorage) window.DeskStorage.setItem(USAGE_STORAGE_KEY, payload);
				else localStorage.setItem(USAGE_STORAGE_KEY, payload);
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

			if (result && result instanceof HTMLElement && window.WindowManager) {
				window.WindowManager.bringToFront(result);
				if (result.classList.contains('minimized')) {
					window.WindowManager.unminimize(result);
				}
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
				executable: 'msimn.exe',
				aliases: ['mail', 'oe', 'email', 'inbox', 'msimn', 'msimn.exe', 'open-oe'],
				handler: (args) => {
					if (typeof openOutlookExpress === 'function') return openOutlookExpress(args);
					return null;
				}
			});

			this.register({
				id: 'ie',
				name: 'Internet Explorer',
				subtitle: 'Web Browser',
				icon: '../assets/images/desk/icons/Internet Explorer.webp',
				category: 'Internet',
				executable: 'iexplore.exe',
				aliases: ['internet', 'browser', 'web', 'explore', 'iexplore', 'iexplore.exe', 'open-ie'],
				handler: (args) => {
					const url = typeof args === 'string' ? args : (args && args.url ? args.url : (args && args.path ? args.path : 'about:home'));
					if (window.InternetExplorerApp) return window.InternetExplorerApp.open(url, args);
					if (typeof openInternetExplorer === 'function') return openInternetExplorer(url, args);
					return null;
				}
			});

			this.register({
				id: 'calculator',
				name: 'Calculator',
				icon: '../assets/images/desk/icons/Calculator.webp',
				category: 'Accessories',
				executable: 'calc.exe',
				aliases: ['calc', 'calc.exe'],
				handler: (args) => {
					if (window.CalculatorApp) return window.CalculatorApp.open(args);
					else if (typeof openCalculator === 'function') return openCalculator(args);
					return null;
				}
			});

			this.register({
				id: 'paint',
				name: 'Paint',
				icon: '../assets/images/desk/icons/Paint.webp',
				category: 'Accessories',
				executable: 'mspaint.exe',
				aliases: ['mspaint', 'mspaint.exe', 'pbrush', 'pbrush.exe', 'draw'],
				handler: (args) => {
					if (window.PaintApp) return window.PaintApp.open(args);
					else if (typeof openPaint === 'function') return openPaint(args);
					return null;
				}
			});

			this.register({
				id: 'notepad',
				name: 'Notepad',
				icon: '../assets/images/desk/icons/Notepad.webp',
				category: 'Accessories',
				executable: 'notepad.exe',
				aliases: ['text', 'editor', 'notes', 'notepad.exe'],
				handler: (args) => {
					if (window.NotepadApp) {
						if (args && args.name) return window.NotepadApp.open(args);
						return window.NotepadApp.openNew(args);
					} else if (typeof openTextEditorWindow === 'function' && args) {
						return openTextEditorWindow(args);
					}
					return null;
				}
			});

			this.register({
				id: 'cmd',
				name: 'Command Prompt',
				icon: '../assets/images/desk/icons/Command Prompt.webp',
				category: 'Accessories',
				executable: 'cmd.exe',
				aliases: ['terminal', 'prompt', 'console', 'command', 'cmd.exe'],
				handler: (args) => {
					if (window.CommandPrompt) return window.CommandPrompt.open(args);
					else if (typeof processRunCommand === 'function') return processRunCommand('cmd', args);
					return null;
				}
			});

			this.register({
				id: 'soundrecorder',
				name: 'Sound Recorder',
				icon: '../assets/images/desk/icons/Music File.webp',
				category: 'Entertainment',
				executable: 'sndrec32.exe',
				aliases: ['sound-recorder', 'sndrec32', 'sndrec32.exe', 'recorder', 'voice', 'audio'],
				handler: (args) => {
					if (window.SoundRecorderApp) return window.SoundRecorderApp.open(args);
					return null;
				}
			});

			this.register({
				id: 'charmap',
				name: 'Character Map',
				icon: '../assets/images/desk/icons/List File.webp',
				category: 'System Tools',
				executable: 'charmap.exe',
				aliases: ['character-map', 'charactermap', 'symbols', 'characters', 'charmap.exe'],
				handler: (args) => {
					if (window.CharacterMapApp) return window.CharacterMapApp.open(args);
					return null;
				}
			});

			this.register({
				id: 'mediaplayer',
				name: 'Windows Media Player',
				subtitle: 'Digital Audio & Video Player',
				icon: '../assets/images/desk/icons/Video File.webp',
				category: 'Entertainment',
				executable: 'wmplayer.exe',
				aliases: ['wmp', 'wmplayer', 'media-player', 'wmplayer.exe'],
				handler: (args) => {
					if (window.MediaPlayerApp) return window.MediaPlayerApp.open(args);
					return null;
				}
			});

			this.register({
				id: 'pictureviewer',
				name: 'Picture and Fax Viewer',
				subtitle: 'Image Viewer',
				icon: '../assets/images/desk/icons/Picture.webp',
				category: 'Accessories',
				executable: 'shimgvw.dll',
				aliases: ['picview', 'photoviewer', 'shimgvw.dll'],
				handler: (args) => {
					if (window.PictureViewerApp) return window.PictureViewerApp.open(args);
					return null;
				}
			});

			this.register({
				id: 'winamp',
				name: 'Winamp Media Player',
				icon: '../assets/images/desk/icons/Winamp.webp',
				category: 'Entertainment',
				executable: 'winamp.exe',
				aliases: ['music', 'mp3', 'player', 'audio-player', 'winamp.exe'],
				handler: (args) => {
					if (typeof openWinamp === 'function') return openWinamp(args);
					return null;
				}
			});

			this.register({
				id: 'minesweeper',
				name: 'Minesweeper',
				icon: '../assets/images/desk/icons/Minesweeper.webp',
				category: 'Games',
				executable: 'winmine.exe',
				aliases: ['mine', 'mines', 'winmine', 'winmine.exe'],
				handler: (args) => {
					if (window.MinesweeperApp) return window.MinesweeperApp.open(args);
					else if (typeof openMinesweeper === 'function') return openMinesweeper(args);
					return null;
				}
			});

			this.register({
				id: 'solitaire',
				name: 'Solitaire',
				icon: '../assets/images/desk/icons/Hearts.webp',
				category: 'Games',
				executable: 'sol.exe',
				aliases: ['sol', 'cards', 'klondike', 'patience', 'sol.exe'],
				handler: (args) => {
					if (window.SolitaireApp) return window.SolitaireApp.open(args);
					else if (typeof openSolitaire === 'function') return openSolitaire(args);
					return null;
				}
			});

			this.register({
				id: 'settings',
				name: 'Control Panel',
				icon: '../assets/images/desk/icons/System Properties.webp',
				category: 'System Tools',
				executable: 'control.exe',
				aliases: ['controlpanel', 'preferences', 'config', 'control', 'control.exe', 'msconfig', 'sysdm.cpl', 'taskmgr', 'taskmgr.exe', 'regedit', 'regedit.exe'],
				handler: (args) => {
					const tab = typeof args === 'string' ? args : (args && args.tab ? args.tab : 'system');
					if (window.SettingsApp) return window.SettingsApp.open(tab, args);
					return null;
				}
			});

			this.register({
				id: 'display',
				name: 'Display & Wallpapers',
				icon: '../assets/images/desk/icons/Display.webp',
				category: 'Appearance',
				executable: 'desk.cpl',
				aliases: ['wallpaper', 'themes', 'screensaver', 'desk.cpl'],
				handler: (args) => {
					const tab = typeof args === 'string' ? args : (args && args.tab ? args.tab : 'desktop');
					if (window.SettingsApp) return window.SettingsApp.open(tab, args);
					return null;
				}
			});

			this.register({
				id: 'mycomputer',
				name: 'My Computer',
				icon: '../assets/images/desk/icons/My Computer.webp',
				category: 'System Tools',
				executable: 'explorer.exe',
				aliases: ['computer', 'explorer', 'explorer.exe', 'drives', 'my-computer'],
				handler: (args) => {
					if (typeof openMyComputerWindow === 'function') return openMyComputerWindow(args);
					if (window.FileExplorer && typeof fs !== 'undefined') return window.FileExplorer.open(fs.root, args);
					return null;
				}
			});

			this.register({
				id: 'printers',
				name: 'Printers and Faxes',
				icon: '../assets/images/desk/icons/Fax.webp',
				category: 'System Tools',
				executable: 'explorer.exe',
				aliases: ['faxes', 'printer', 'printers', 'printers-faxes'],
				handler: (args) => {
					if (typeof openPrintersWindow === 'function') return openPrintersWindow(args);
					return null;
				}
			});

			this.register({
				id: 'network',
				name: 'My Network Places',
				icon: '../assets/images/desk/icons/My Network Places.webp',
				category: 'System Tools',
				executable: 'explorer.exe',
				aliases: ['networkplaces', 'netplaces', 'shares', 'my-network-places'],
				handler: (args) => {
					if (typeof openNetworkPlacesWindow === 'function') return openNetworkPlacesWindow(args);
					return null;
				}
			});

			this.register({
				id: 'run',
				name: 'Run Command',
				icon: '../assets/images/desk/icons/Command Prompt.webp',
				category: 'System Tools',
				executable: 'run.exe',
				aliases: ['execute', 'run.exe'],
				handler: (args) => {
					if (typeof openRunDialog === 'function') return openRunDialog(args);
					return null;
				}
			});

			this.register({
				id: 'shutdown',
				name: 'Shut Down Windows',
				icon: 'https://api.iconify.design/mdi/power.svg',
				category: 'System Tools',
				executable: 'shutdown.exe',
				aliases: ['turnoff', 'poweroff', 'shutdown.exe'],
				handler: (args) => {
					if (typeof openShutdownDialog === 'function') return openShutdownDialog(args);
					return null;
				}
			});

			this.register({
				id: 'search',
				name: 'Search Companion',
				icon: '../assets/images/desk/icons/Search.webp',
				category: 'System Tools',
				executable: 'search.exe',
				aliases: ['find', 'locate'],
				handler: (args) => {
					const q = typeof args === 'string' ? args : (args && args.query ? args.query : '');
					if (typeof openSearchWindow === 'function') return openSearchWindow(q, args);
					return null;
				}
			});

			this.register({
				id: 'recyclebin',
				name: 'Recycle Bin',
				icon: '../assets/images/desk/icons/Trash.webp',
				category: 'System Tools',
				executable: 'explorer.exe',
				aliases: ['trash', 'garbage', 'bin'],
				handler: (args) => {
					if (window.FileExplorer) return window.FileExplorer.openRecycleBin(args);
					if (typeof openRecycleBinWindow === 'function') return openRecycleBinWindow(args);
					return null;
				}
			});

			this.register({
				id: 'achievements',
				name: 'Milestones & Trophies',
				subtitle: 'Desktop Quests',
				icon: '../assets/images/desk/icons/Trophy.webp',
				category: 'Entertainment',
				executable: 'achievements.exe',
				aliases: ['trophies', 'quests', 'milestones'],
				handler: (args) => {
					const id = typeof args === 'string' ? args : (args && args.targetId ? args.targetId : null);
					if (window.AchievementsManager) return window.AchievementsManager.open(id, args);
					return null;
				}
			});

			this.register({
				id: 'projects',
				name: 'My Projects',
				subtitle: 'Portfolio Works',
				icon: '../assets/images/desk/icons/Folder Open.webp',
				category: 'Portfolio Projects',
				executable: 'explorer.exe',
				aliases: ['portfolio', 'work', 'showcase', 'my-projects'],
				handler: (args) => {
					if (args && args.category && typeof openFilteredProjectsFolder === 'function') {
						return openFilteredProjectsFolder(args.category, args);
					}
					if (typeof openAllProjectsFolder === 'function') return openAllProjectsFolder(args);
					return null;
				}
			});

			this.register({
				id: 'documents',
				name: 'My Documents',
				icon: '../assets/images/desk/icons/My Profile Folder.webp',
				category: 'Accessories',
				aliases: ['mydocuments', 'my-documents', 'docs', 'pdf', 'pdfs'],
				handler: () => {
					if (typeof fs !== 'undefined' && fs) {
						const pdfs = fs.findByPath('/PDFs') || fs.root;
						if (window.FileExplorer) return window.FileExplorer.open(pdfs);
					}
					return null;
				}
			});

			this.register({
				id: 'pictures',
				name: 'My Pictures',
				icon: '../assets/images/desk/icons/Camera.webp',
				category: 'Accessories',
				aliases: ['mypictures', 'my-pictures', 'photos', 'wallpapers'],
				handler: () => {
					if (typeof fs !== 'undefined' && fs) {
						let wpFolder = fs.findByPath('/WINDOWS/Web/Wallpaper');
						if (wpFolder && window.FileExplorer) return window.FileExplorer.open(wpFolder);
					}
					if (window.DeskAppRegistry) return window.DeskAppRegistry.launch('display');
					return null;
				}
			});

			this.register({
				id: 'music',
				name: 'My Music',
				icon: '../assets/images/desk/icons/Music File.webp',
				category: 'Entertainment',
				aliases: ['mymusic', 'my-music', 'audio-library'],
				handler: () => {
					if (typeof fs !== 'undefined' && fs) {
						let musicFolder = fs.findByPath('/Music') || fs.root.getByName('Music');
						if (musicFolder && window.FileExplorer) return window.FileExplorer.open(musicFolder);
					}
					if (window.DeskAppRegistry) return window.DeskAppRegistry.launch('mediaplayer');
					return null;
				}
			});

			this.register({
				id: 'pdf',
				name: 'PDF Document Viewer',
				icon: '../assets/images/desk/icons/List File.webp',
				category: 'Accessories',
				aliases: ['acrobat', 'reader', 'pdfviewer'],
				handler: (args) => {
					if (typeof openPDFWindow === 'function') {
						if (args instanceof File || (args && args.content)) {
							return openPDFWindow(args);
						}
						if (typeof args === 'string' && typeof fs !== 'undefined' && fs) {
							const file = fs.findByPath(args);
							if (file) return openPDFWindow(file);
						}
					}
					return null;
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
				id: 'taskmgr',
				name: 'Windows Task Manager',
				icon: '../assets/images/desk/icons/System Properties.webp',
				category: 'System Tools',
				aliases: ['taskmgr.exe', 'taskmanager', 'task-manager', 'tasks', 'kill'],
				handler: (args) => {
					const tab = typeof args === 'string' ? args : (args && args.tab ? args.tab : 'applications');
					if (window.TaskManagerApp) window.TaskManagerApp.open(tab);
				}
			});

			this.register({
				id: 'encarta',
				name: 'Microsoft Encarta Virtual Globe',
				subtitle: 'World Interactive Atlas',
				icon: '../assets/images/desk/icons/Earth (fixed).webp',
				category: 'Entertainment',
				aliases: ['globe', 'map', 'worldmap', 'atlas', 'encarta.exe'],
				handler: () => {
					if (window.EncartaGlobeApp) window.EncartaGlobeApp.open();
				}
			});

			this.register({
				id: 'soundcloud',
				name: 'SoundCloud Channel',
				icon: 'https://api.iconify.design/mdi/soundcloud.svg',
				category: 'Entertainment',
				aliases: ['link-soundcloud', 'sc'],
				handler: () => {
					window.open('https://soundcloud.com/wartets', '_blank');
				}
			});

			this.register({
				id: 'youtubemusic',
				name: 'YouTube Music',
				icon: 'https://api.iconify.design/mdi/youtube.svg',
				category: 'Entertainment',
				aliases: ['link-youtube-music', 'yt'],
				handler: () => {
					window.open('https://www.youtube.com/@Wartets', '_blank');
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

			this.register({
				id: 'clippy',
				name: 'Microsoft Clippy',
				subtitle: 'Office Assistant',
				icon: '../assets/images/desk/clippy/idle.png',
				category: 'Accessories',
				aliases: ['clippit', 'assistant', 'agent', 'helper'],
				handler: () => {
					if (window.ClippyAgent && typeof window.ClippyAgent.open === 'function') {
						window.ClippyAgent.open();
					}
				}
			});
		}
	}

	window.DeskAppRegistry = new ApplicationRegistry();
	window.DeskAppRegistry.initDefaultApps();
})();
