(function () {
	const registry = new Map();
	const newFileTemplates = [];

	const ShellAssociations = {
		init() {
			this.registerDefaults();
		},

		registerDefaults() {
			this.register(['.txt', '.text', '.log', '.ini', '.cfg', '.md', '.js', '.css', '.xml', '.csv', '.ts', '.py', '.c', '.cpp', '.h', '.sql'], {
				typeLabel: 'Text Document',
				defaultIcon: '../assets/images/desk/icons/File.webp',
				defaultApp: 'notepad',
				openHandler: (file) => {
					if (window.NotepadApp) window.NotepadApp.open(file);
				},
				openWith: [
					{
						id: 'notepad',
						name: 'Notepad',
						icon: '../assets/images/desk/icons/Notepad.webp',
						action: (file) => {
							if (window.NotepadApp) window.NotepadApp.open(file);
						}
					},
					{
						id: 'ie',
						name: 'Internet Explorer',
						icon: '../assets/images/desk/icons/Internet Explorer.webp',
						action: (file) => {
							if (window.InternetExplorerApp) window.InternetExplorerApp.open(`file://${file.getFullPath()}`);
						}
					}
				],
				newTemplate: {
					extension: '.txt',
					defaultName: 'New Text Document.txt',
					content: '',
					label: 'Text Document'
				}
			});

			this.register(['.bat', '.cmd'], {
				typeLabel: 'MS-DOS Batch File',
				defaultIcon: '../assets/images/desk/icons/Command Prompt.webp',
				defaultApp: 'cmd',
				openHandler: (file) => {
					if (window.AchievementsManager) {
						window.AchievementsManager.progress('bat_runner', 1);
					}
					if (window.CommandPrompt) {
						window.CommandPrompt.open({
							script: file.content,
							title: file.name,
							initialFolder: file.parent || (fs ? fs.root : null)
						});
					}
				},
				openWith: [
					{
						id: 'cmd',
						name: 'Command Prompt (Execute)',
						icon: '../assets/images/desk/icons/Command Prompt.webp',
						action: (file) => {
							if (window.CommandPrompt) {
								window.CommandPrompt.open({
									script: file.content,
									title: file.name,
									initialFolder: file.parent || (fs ? fs.root : null)
								});
							}
						}
					},
					{
						id: 'notepad',
						name: 'Notepad (Edit)',
						icon: '../assets/images/desk/icons/Notepad.webp',
						action: (file) => {
							if (window.NotepadApp) window.NotepadApp.open(file);
						}
					}
				],
				newTemplate: {
					extension: '.bat',
					defaultName: 'New Batch Script.bat',
					content: '@echo off\r\necho Hello, Windows XP!\r\npause\r\n',
					label: 'MS-DOS Batch File'
				}
			});

			this.register(['.png', '.jpg', '.jpeg', '.bmp', '.webp', '.gif', '.ico', '.tiff', '.tif'], {
				typeLabel: 'Image File',
				defaultIcon: '../assets/images/desk/icons/Picture.webp',
				defaultApp: 'pictureviewer',
				openHandler: (file) => {
					if (window.PictureViewerApp) {
						window.PictureViewerApp.open(file);
					} else if (window.PaintApp) {
						window.PaintApp.open(file);
					}
				},
				openWith: [
					{
						id: 'pictureviewer',
						name: 'Windows Picture and Fax Viewer',
						icon: '../assets/images/desk/icons/Picture.webp',
						action: (file) => {
							if (window.PictureViewerApp) window.PictureViewerApp.open(file);
						}
					},
					{
						id: 'paint',
						name: 'Paint',
						icon: '../assets/images/desk/icons/Paint.webp',
						action: (file) => {
							if (window.PaintApp) window.PaintApp.open(file);
						}
					},
					{
						id: 'ie',
						name: 'Internet Explorer',
						icon: '../assets/images/desk/internet-explorer.png',
						action: (file) => {
							if (window.InternetExplorerApp) window.InternetExplorerApp.open(file.remoteUrl || file.content || `file://${file.getFullPath()}`);
						}
					}
				],
				newTemplate: {
					extension: '.bmp',
					defaultName: 'New Bitmap Image.bmp',
					content: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
					label: 'Bitmap Image'
				}
			});

			this.register(['.wav', '.wave', '.mp3', '.ogg', '.m4a', '.flac', '.aif', '.aiff', '.wma', '.aac', '.alac', '.opus', '.mid', '.midi'], {
				typeLabel: 'Audio Track',
				defaultIcon: '../assets/images/desk/icons/Music File.webp',
				defaultApp: 'mediaplayer',
				openHandler: (file) => {
					const defaultPlayer = (window.SettingsApp && typeof window.SettingsApp.get === 'function')
						? (window.SettingsApp.get('defaultAudioPlayer') || 'mediaplayer')
						: 'mediaplayer';
					if (defaultPlayer === 'winamp' && typeof openWinamp === 'function') {
						openWinamp(file);
					} else if (window.MediaPlayerApp) {
						window.MediaPlayerApp.open(file);
					} else if (typeof openWinamp === 'function') {
						openWinamp(file);
					}
				},
				openWith: [
					{
						id: 'mediaplayer',
						name: 'Windows Media Player',
						icon: '../assets/images/desk/icons/Video File.webp',
						action: (file) => {
							if (window.MediaPlayerApp) window.MediaPlayerApp.open(file);
						}
					},
					{
						id: 'winamp',
						name: 'Winamp Media Player',
						icon: '../assets/images/desk/icons/Winamp.webp',
						action: (file) => {
							if (typeof openWinamp === 'function') openWinamp(file);
						}
					},
					{
						id: 'soundrecorder',
						name: 'Sound Recorder',
						icon: '../assets/images/desk/icons/Music File.webp',
						action: (file) => {
							if (window.SoundRecorderApp) window.SoundRecorderApp.open(file);
						}
					},
					{
						id: 'ie',
						name: 'Internet Explorer',
						icon: '../assets/images/desk/internet-explorer.png',
						action: (file) => {
							if (window.InternetExplorerApp) window.InternetExplorerApp.open(file.remoteUrl || file.content);
						}
					}
				],
				newTemplate: {
					extension: '.wav',
					defaultName: 'New Audio.wav',
					content: '',
					label: 'Wave Sound'
				}
			});

			this.register(['.m3u', '.pls'], {
				typeLabel: 'Media Playlist File',
				defaultIcon: '../assets/images/desk/icons/Video File.webp',
				defaultApp: 'mediaplayer',
				openHandler: (file) => {
					const defaultPlayer = (window.SettingsApp && typeof window.SettingsApp.get === 'function')
						? (window.SettingsApp.get('defaultAudioPlayer') || 'mediaplayer')
						: 'mediaplayer';
					if (defaultPlayer === 'winamp' && typeof openWinamp === 'function') {
						openWinamp(file);
					} else if (window.MediaPlayerApp) {
						window.MediaPlayerApp.open(file);
					}
				},
				openWith: [
					{
						id: 'mediaplayer',
						name: 'Windows Media Player',
						icon: '../assets/images/desk/icons/Video File.webp',
						action: (file) => {
							if (window.MediaPlayerApp) window.MediaPlayerApp.open(file);
						}
					},
					{
						id: 'winamp',
						name: 'Winamp Media Player',
						icon: '../assets/images/desk/icons/Winamp.webp',
						action: (file) => {
							if (typeof openWinamp === 'function') openWinamp(file);
						}
					},
					{
						id: 'notepad',
						name: 'Notepad',
						icon: '../assets/images/desk/icons/Notepad.webp',
						action: (file) => {
							if (window.NotepadApp) window.NotepadApp.open(file);
						}
					}
				]
			});

			this.register(['.mp4', '.avi', '.wmv', '.mkv', '.mov', '.mpg', '.webm'], {
				typeLabel: 'Video Clip',
				defaultIcon: '../assets/images/desk/icons/Video File.webp',
				defaultApp: 'mediaplayer',
				openHandler: (file) => {
					if (window.MediaPlayerApp) {
						window.MediaPlayerApp.open(file);
					} else if (window.InternetExplorerApp) {
						window.InternetExplorerApp.open(file.content || file.remoteUrl || `file://${file.getFullPath()}`);
					}
				},
				openWith: [
					{
						id: 'mediaplayer',
						name: 'Windows Media Player',
						icon: '../assets/images/desk/icons/Video File.webp',
						action: (file) => {
							if (window.MediaPlayerApp) window.MediaPlayerApp.open(file);
						}
					},
					{
						id: 'ie',
						name: 'Internet Explorer',
						icon: '../assets/images/desk/internet-explorer.png',
						action: (file) => {
							if (window.InternetExplorerApp) window.InternetExplorerApp.open(file.content || file.remoteUrl || `file://${file.getFullPath()}`);
						}
					}
				]
			});

			this.register(['.pdf'], {
				typeLabel: 'Adobe Acrobat Document',
				defaultIcon: '../assets/images/desk/icons/List File.webp',
				defaultApp: 'pdf',
				openHandler: (file) => {
					if (typeof openPDFWindow === 'function') openPDFWindow(file);
				},
				openWith: [
					{
						id: 'pdf',
						name: 'PDF Document Viewer',
						icon: '../assets/images/desk/icons/List File.webp',
						action: (file) => {
							if (typeof openPDFWindow === 'function') openPDFWindow(file);
						}
					},
					{
						id: 'ie',
						name: 'Internet Explorer',
						icon: '../assets/images/desk/internet-explorer.png',
						action: (file) => {
							if (window.InternetExplorerApp) window.InternetExplorerApp.open(file.content || file.remoteUrl);
						}
					}
				]
			});

			this.register(['.html', '.htm'], {
				typeLabel: 'HTML Document',
				defaultIcon: '../assets/images/desk/icons/Internet Explorer.webp',
				defaultApp: 'ie',
				openHandler: (file) => {
					if (window.InternetExplorerApp) window.InternetExplorerApp.open(`file://${file.getFullPath()}`);
				},
				openWith: [
					{
						id: 'ie',
						name: 'Internet Explorer',
						icon: '../assets/images/desk/icons/Internet Explorer.webp',
						action: (file) => {
							if (window.InternetExplorerApp) window.InternetExplorerApp.open(`file://${file.getFullPath()}`);
						}
					},
					{
						id: 'notepad',
						name: 'Notepad',
						icon: '../assets/images/desk/icons/Notepad.webp',
						action: (file) => {
							if (window.NotepadApp) window.NotepadApp.open(file);
						}
					}
				],
				newTemplate: {
					extension: '.html',
					defaultName: 'New Web Page.html',
					content: '<!DOCTYPE html>\r\n<html>\r\n<head>\r\n<title>Document</title>\r\n</head>\r\n<body>\r\n<h1>Hello World</h1>\r\n</body>\r\n</html>',
					label: 'HTML Document'
				}
			});

			this.register(['.zip', '.rar', '.7z'], {
				typeLabel: 'Compressed (zipped) Folder',
				defaultIcon: '../assets/images/desk/icons/Folder Closed.webp',
				defaultApp: 'zip',
				openHandler: (file) => {
					if (typeof fs !== 'undefined' && fs.extractZip) {
						fs.extractZip(file.getFullPath(), file.parent ? file.parent.getFullPath() : '/');
						if (typeof refreshUI === 'function') refreshUI();
					}
				},
				openWith: [
					{
						id: 'extract',
						name: 'Compressed Folder Extractor',
						icon: '../assets/images/desk/icons/Folder Open.webp',
						action: (file) => {
							if (typeof fs !== 'undefined' && fs.extractZip) {
								fs.extractZip(file.getFullPath(), file.parent ? file.parent.getFullPath() : '/');
								if (typeof refreshUI === 'function') refreshUI();
							}
						}
					},
					{
						id: 'notepad',
						name: 'Notepad (Binary text view)',
						icon: '../assets/images/desk/icons/Notepad.webp',
						action: (file) => {
							if (window.NotepadApp) window.NotepadApp.open(file);
						}
					}
				],
				newTemplate: {
					extension: '.zip',
					defaultName: 'New Compressed (zipped) Folder.zip',
					content: 'PK\x05\x06\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00',
					label: 'Compressed (zipped) Folder'
				}
			});

			this.register(['.json'], {
				typeLabel: 'JSON Configuration File',
				defaultIcon: '../assets/images/desk/icons/File.webp',
				defaultApp: 'notepad',
				openHandler: (file) => {
					if (window.NotepadApp) window.NotepadApp.open(file);
				},
				openWith: [
					{
						id: 'notepad',
						name: 'Notepad',
						icon: '../assets/images/desk/icons/Notepad.webp',
						action: (file) => {
							if (window.NotepadApp) window.NotepadApp.open(file);
						}
					}
				],
				newTemplate: {
					extension: '.json',
					defaultName: 'New Configuration.json',
					content: '{\n  "version": "1.0",\n  "created": "' + new Date().toISOString() + '"\n}',
					label: 'JSON Document'
				}
			});

			this.register(['.iso', '.img', '.vhd'], {
				typeLabel: 'Disc Image File',
				defaultIcon: '../assets/images/desk/icons/Disk Image File.webp',
				defaultApp: 'explorer',
				openHandler: (file) => {
					if (typeof showXPDialog === 'function') {
						showXPDialog('Disc Image', `Mounted virtual volume "${file.name}" to Drive D:.`, 'info');
					}
				}
			});
		},

		register(extensions, config) {
			const extList = Array.isArray(extensions) ? extensions : [extensions];
			extList.forEach(ext => {
				const key = ext.toLowerCase().startsWith('.') ? ext.toLowerCase() : `.${ext.toLowerCase()}`;
				registry.set(key, config);
			});

			if (config.newTemplate) {
				const exists = newFileTemplates.some(t => t.extension === config.newTemplate.extension);
				if (!exists) {
					newFileTemplates.push(config.newTemplate);
				}
			}

			if (window.DeskEventBus) {
				window.DeskEventBus.emit('association:registered', { extensions: extList, config });
			}
		},

		getExtension(filename) {
			if (!filename || typeof filename !== 'string') return '';
			const idx = filename.lastIndexOf('.');
			if (idx === -1 || idx === filename.length - 1) return '';
			return filename.substring(idx).toLowerCase();
		},

		getConfig(filename) {
			const ext = this.getExtension(filename);
			return registry.get(ext) || null;
		},

		getTypeLabel(element) {
			if (!element) return 'Unknown Item';
			if (element instanceof Folder) return 'File Folder';
			if (element instanceof Shortcut) return 'Shortcut';
			if (element instanceof ProjectFile) return 'Project Application';
			const cfg = this.getConfig(element.name);
			return cfg ? cfg.typeLabel : 'File';
		},

		getIcon(element) {
			if (!element) return '../assets/images/desk/icons/File.webp';
			if (element.icon) return element.icon;
			if (element instanceof Folder) return '../assets/images/desk/icons/Folder Closed.webp';
			if (element instanceof Shortcut) return '../assets/images/desk/icons/Folder Closed.webp';
			if (element instanceof ProjectFile) return element.projectData?.icon || '../assets/images/desk/icons/File.webp';
			const cfg = this.getConfig(element.name);
			return cfg ? cfg.defaultIcon : '../assets/images/desk/icons/File.webp';
		},

		getOpenWithHandlers(element, windowContext = null) {
			if (!element || !(element instanceof File)) return [];
			const cfg = this.getConfig(element.name);
			const handlers = [];

			if (cfg && Array.isArray(cfg.openWith)) {
				cfg.openWith.forEach(item => {
					handlers.push({
						id: item.id,
						name: item.name,
						icon: item.icon,
						action: () => item.action(element, windowContext)
					});
				});
			}

			const defaultGeneric = [
				{
					id: 'notepad',
					name: 'Notepad',
					icon: '../assets/images/desk/icons/Notepad.webp',
					action: () => {
						if (window.NotepadApp) window.NotepadApp.open(element);
					}
				},
				{
					id: 'paint',
					name: 'Paint',
					icon: '../assets/images/desk/icons/Paint.webp',
					action: () => {
						if (window.PaintApp) window.PaintApp.open(element);
					}
				},
				{
					id: 'ie',
					name: 'Internet Explorer',
					icon: '../assets/images/desk/internet-explorer.png',
					action: () => {
						if (window.InternetExplorerApp) window.InternetExplorerApp.open(`file://${element.getFullPath()}`);
					}
				}
			];

			defaultGeneric.forEach(gen => {
				if (!handlers.some(h => h.id === gen.id)) {
					handlers.push(gen);
				}
			});

			return handlers;
		},

		open(element, windowContext = null, options = {}) {
			if (!element) return;

			if (element instanceof Folder) {
				if (windowContext && windowContext.classList.contains('xp-explorer-window') && window.FileExplorer) {
					window.FileExplorer.navigateTo(element, windowContext, true);
				} else if (window.FileExplorer) {
					window.FileExplorer.open(element);
				}
				return;
			}

			if (element instanceof Shortcut) {
				const resolved = element.resolve();
				if (resolved) {
					this.open(resolved, windowContext, options);
				} else if (element.targetPath.startsWith('http://') || element.targetPath.startsWith('https://') || element.targetPath.startsWith('about:')) {
					if (window.InternetExplorerApp) {
						window.InternetExplorerApp.open(element.targetPath);
					}
				} else {
					if (typeof showXPDialog === 'function') {
						showXPDialog('Shortcut Error', 'The target of this shortcut cannot be found.', 'error');
					}
				}
				return;
			}

			if (element instanceof ProjectFile) {
				if (typeof openProjectWindow === 'function') {
					openProjectWindow(element.projectData);
				}
				return;
			}

			if (element instanceof File) {
				const cfg = this.getConfig(element.name);
				if (cfg && typeof cfg.openHandler === 'function') {
					cfg.openHandler(element, windowContext, options);
					return;
				}

				if (element.readOnly && element.remoteUrl) {
					if (typeof openReadOnlyTextWindow === 'function') {
						openReadOnlyTextWindow(element);
					}
					return;
				}

				if (window.NotepadApp) {
					window.NotepadApp.open(element);
				}
			}
		},

		getDisplayName(element) {
			if (!element) return '';
			const fullName = typeof element === 'string' ? element : element.name;
			const showExt = window.SettingsApp ? (window.SettingsApp.get('showFileExtensions') !== false) : true;
			if (showExt) return fullName;
			const cfg = this.getConfig(fullName);
			if (cfg) {
				const ext = this.getExtension(fullName);
				if (ext && fullName.toLowerCase().endsWith(ext)) {
					return fullName.substring(0, fullName.length - ext.length);
				}
			}
			return fullName;
		},

		getNewFileTemplates() {
			return newFileTemplates;
		}
	};

	ShellAssociations.init();
	window.ShellAssociations = ShellAssociations;
})();
