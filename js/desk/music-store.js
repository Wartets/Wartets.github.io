(function () {
	const PRIMARY_BIB_URL = 'https://raw.githubusercontent.com/Wartets/music/main/musicBib.json';
	const FALLBACK_BIB_URL = 'https://raw.githubusercontent.com/Wartets/music/refs/heads/main/musicBib.json';
	const MEDIA_BASE_URL = 'https://media.githubusercontent.com/media/Wartets/music/refs/heads/main/';
	const CDN_BASE_URL = 'https://cdn.jsdelivr.net/gh/Wartets/music@main/';
	const RAW_BASE_URL = 'https://raw.githubusercontent.com/Wartets/music/main/';
	const STORAGE_CACHE_KEY = 'xp_music_bib_cache';
	const SEPARATORS_RE = /\s*(?:;|\||\\\\|\/|,|\bfeat\.?\b|\bfeaturing\b|\bft\.?\b)\s*/i;
	const EXT_QUALITY = { wav: 8, aiff: 7, aif: 7, flac: 7, alac: 6, m4a: 5, aac: 5, mp3: 4, ogg: 3, wma: 2 };
	const UNSUPPORTED_CODEC_RE = /(alac|ape|wvpack|tta|tak)/i;

	let rawBibData = null;
	let libraryPrimaries = [];
	let versionToPrimaryMap = {};
	let rawItemsMap = new Map();
	let isInitialized = false;
	let initPromise = null;

	function toMediaUrl(relativePath, mode = 'media') {
		if (!relativePath) return '';
		if (/^https?:\/\//i.test(relativePath)) return relativePath;
		const cleanPath = relativePath.replace(/\\/g, '/').replace(/^\/+/, '');
		const encoded = cleanPath.split('/').filter(Boolean).map(seg => encodeURIComponent(seg)).join('/');
		if (mode === 'cdn') return `${CDN_BASE_URL}${encoded}`;
		if (mode === 'raw') return `${RAW_BASE_URL}${encoded}`;
		return `${MEDIA_BASE_URL}${encoded}`;
	}

	function isSingleTrack(track) {
		if (!track) return false;
		if (track.logic && track.logic.is_single === true) return true;
		const path = (track.file?.path || track.file?.dir || '').replace(/\\/g, '/').toLowerCase();
		if (path.startsWith('assets/single/') || path.startsWith('assets/singles/') || path.startsWith('single/') || path.startsWith('singles/') || path.includes('/single/') || path.includes('/singles/')) return true;
		const group = (track.logic?.hierarchy?.group || '').toLowerCase();
		if (group === 'single' || group === 'singles') return true;
		const folder = (track.logic?.hierarchy?.folder || '').toLowerCase();
		if (folder === 'single' || folder === 'singles') return true;
		return false;
	}

	function findArtworkInList(list) {
		if (!Array.isArray(list) || list.length === 0) return null;
		const exact = list.find(img => {
			const base = (img.name || img.path || '').split('/').pop().toLowerCase();
			return /^artwork\.[a-z0-9]+$/i.test(base) || base === 'artwork';
		});
		return exact || list[0] || null;
	}

	function buildAudioCandidates(trackItem) {
		if (!trackItem || !trackItem.file || !trackItem.file.path) return [];
		const candidates = [];
		const addCandidate = (path) => {
			if (!path) return;
			const mediaUrl = toMediaUrl(path, 'media');
			const rawUrl = toMediaUrl(path, 'raw');
			const cdnUrl = toMediaUrl(path, 'cdn');
			if (mediaUrl && !candidates.includes(mediaUrl)) candidates.push(mediaUrl);
			if (rawUrl && !candidates.includes(rawUrl)) candidates.push(rawUrl);
			if (cdnUrl && !candidates.includes(cdnUrl)) candidates.push(cdnUrl);
		};

		const processItem = (item) => {
			if (!item || !item.file || !item.file.path) return;
			const relPath = item.file.path.replace(/\\/g, '/');
			const ext = (item.file.ext || '').toLowerCase();
			if (ext === 'm4a' && !/_compatible_aac\.m4a$/i.test(relPath)) {
				const compatPath = relPath.replace(/\.m4a$/i, '_compatible_aac.m4a');
				addCandidate(compatPath);
			}
			addCandidate(relPath);
		};

		processItem(trackItem);

		if (Array.isArray(trackItem.versions)) {
			trackItem.versions.forEach(ver => {
				if (ver && ver !== trackItem) {
					processItem(ver);
				}
			});
		}

		return candidates;
	}

	function normalizeEpochToSeconds(value) {
		if (!value || !Number.isFinite(value) || value <= 0) return 0;
		return value > 1_000_000_000_000 ? Math.floor(value / 1000) : Math.floor(value);
	}

	function parseDuration(durationStr) {
		if (!durationStr) return 0;
		const normalized = String(durationStr).trim();
		if (!normalized) return 0;
		if (/^\d+(\.\d+)?$/.test(normalized)) return Math.max(0, Math.floor(parseFloat(normalized)));
		const cleaned = normalized.replace(/[^0-9:.]/g, '');
		const parts = cleaned.split(':').map(p => p.trim()).filter(Boolean);
		if (!parts.length || parts.some(p => Number.isNaN(Number(p)))) return 0;
		let total = 0, mult = 1;
		for (let i = parts.length - 1; i >= 0; i--) {
			total += parseFloat(parts[i]) * mult;
			mult *= 60;
		}
		return Math.max(0, Math.floor(total));
	}

	function parseNumberLike(value) {
		if (!value) return 0;
		const m = String(value).match(/(\d+(\.\d+)?)/);
		return m ? Number(m[1]) : 0;
	}

	function splitArtistText(value) {
		const normalized = String(value || '').trim();
		if (!normalized) return [];
		return normalized.split(SEPARATORS_RE).map(s => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
	}

	function normalizeArtists(raw) {
		const seen = new Set();
		const result = [];
		const push = (name) => {
			const key = name.toLocaleLowerCase();
			if (!seen.has(key)) {
				seen.add(key);
				result.push(name);
			}
		};
		if (Array.isArray(raw)) raw.forEach(entry => splitArtistText(String(entry || '')).forEach(push));
		else if (typeof raw === 'string') splitArtistText(raw).forEach(push);
		return result;
	}

	function parseGenres(genre) {
		if (!genre) return [];
		return String(genre).split(' / ').map(g => g.trim()).filter(Boolean);
	}

	function extractVersionSegments(label) {
		const semver = label.match(/(?:^|[^\d])v?(\d+(?:\.\d+){1,5})(?:[^\d]|$)/i);
		if (semver) return semver[1].split('.').map(Number).filter(Number.isFinite);
		const simple = label.match(/(?:version|ver|v)\s*(\d+)\b/i) || label.match(/\b(\d+)\s*$/);
		if (simple) {
			const n = Number(simple[1]);
			if (Number.isFinite(n)) return [n];
		}
		return null;
	}

	function compareSegmentsDesc(a, b) {
		const len = Math.max(a.length, b.length);
		for (let i = 0; i < len; i++) {
			const av = a[i] || 0, bv = b[i] || 0;
			if (av !== bv) return bv - av;
		}
		return 0;
	}

	function extractDateMs(label) {
		let m = label.match(/(\d{4})[-_/.](\d{1,2})[-_/.](\d{1,2})(?:[ T_-]?(\d{1,2})[:._-]?(\d{1,2})?(?:[:._-]?(\d{1,2}))?)?/);
		if (m) {
			const [, y, mo, d, hh, mi, ss] = m;
			const ms = new Date(+y, +mo - 1, +d, +(hh || 0), +(mi || 0), +(ss || 0)).getTime();
			if (!Number.isNaN(ms)) return ms;
		}
		m = label.match(/(\d{1,2})[-_/.](\d{1,2})[-_/.](\d{4})(?:[ T_-]?(\d{1,2})[:._-]?(\d{1,2})?(?:[:._-]?(\d{1,2}))?)?/);
		if (m) {
			const [, d, mo, y, hh, mi, ss] = m;
			const ms = new Date(+y, +mo - 1, +d, +(hh || 0), +(mi || 0), +(ss || 0)).getTime();
			if (!Number.isNaN(ms)) return ms;
		}
		return null;
	}

	function getQualityScore(track) {
		const ext = (track.file?.ext || '').toLowerCase();
		const extScore = EXT_QUALITY[ext] || 0;
		const losslessScore = track.audio_specs?.is_lossless ? 1000 : 0;
		const sampleRateScore = parseNumberLike(track.audio_specs?.sample_rate);
		const bitrateScore = parseNumberLike(track.audio_specs?.bitrate);
		const codec = String(track.audio_specs?.codec || '').toLowerCase();
		const unsupportedPenalty = UNSUPPORTED_CODEC_RE.test(codec) ? 200_000 : 0;
		return extScore * 10_000 + losslessScore + sampleRateScore + bitrateScore - unsupportedPenalty;
	}

	function compareTrackVersions(a, b) {
		const aLabel = `${a.logic?.version_name || ''} ${a.file?.name || ''}`.trim();
		const bLabel = `${b.logic?.version_name || ''} ${b.file?.name || ''}`.trim();

		const aSeg = extractVersionSegments(aLabel);
		const bSeg = extractVersionSegments(bLabel);
		if (aSeg && bSeg) {
			const c = compareSegmentsDesc(aSeg, bSeg);
			if (c !== 0) return c;
		} else if (aSeg || bSeg) {
			return aSeg ? -1 : 1;
		}

		const aDate = extractDateMs(aLabel), bDate = extractDateMs(bLabel);
		if (aDate && bDate && aDate !== bDate) return bDate - aDate;
		if (aDate || bDate) return aDate ? -1 : 1;

		const c1 = normalizeEpochToSeconds(b.file?.epoch_created) - normalizeEpochToSeconds(a.file?.epoch_created);
		if (c1 !== 0) return c1;

		const c2 = normalizeEpochToSeconds(b.file?.epoch_modified) - normalizeEpochToSeconds(a.file?.epoch_modified);
		if (c2 !== 0) return c2;

		const c3 = getQualityScore(b) - getQualityScore(a);
		if (c3 !== 0) return c3;

		const c4 = (b.file?.size_bytes || 0) - (a.file?.size_bytes || 0);
		if (c4 !== 0) return c4;

		return (a.logic?.version_name || '').localeCompare(b.logic?.version_name || '');
	}

	function mergeArtistsFromVersions(primary, sorted) {
		const seen = new Set((primary.metadata?.artists || []).map(a => a.toLowerCase()));
		const merged = [...(primary.metadata?.artists || [])];
		for (let i = 1; i < sorted.length; i++) {
			for (const artist of (sorted[i].metadata?.artists || [])) {
				const key = artist.toLowerCase();
				if (!seen.has(key)) {
					seen.add(key);
					merged.push(artist);
				}
			}
		}
		if (!primary.metadata) primary.metadata = {};
		primary.metadata.artists = merged;
	}

	function buildLibrary(items) {
		const groups = new Map();
		rawItemsMap.clear();

		for (const item of items) {
			if (item.logic?.hash_sha256) {
				rawItemsMap.set(item.logic.hash_sha256, item);
			}
			if (item.file?.path) {
				const normPath = item.file.path.replace(/\\/g, '/');
				rawItemsMap.set(normPath, item);
				rawItemsMap.set(toMediaUrl(normPath, 'media'), item);
				rawItemsMap.set(toMediaUrl(normPath, 'raw'), item);
				rawItemsMap.set(toMediaUrl(normPath, 'cdn'), item);
			}
			if (item.file?.name) {
				rawItemsMap.set(item.file.name, item);
			}
			const key = `${item.logic?.track_name || 'track'}###${item.logic?.hierarchy?.folder || item.file?.dir || 'root'}`;
			if (!groups.has(key)) groups.set(key, []);
			groups.get(key).push(item);
		}

		const primaries = [];
		versionToPrimaryMap = {};

		for (const versions of groups.values()) {
			const sorted = versions.slice().sort(compareTrackVersions);
			const primary = { ...sorted[0], versions: sorted };
			mergeArtistsFromVersions(primary, sorted);
			primaries.push(primary);
			for (const v of sorted) {
				if (v.logic?.hash_sha256) {
					versionToPrimaryMap[v.logic.hash_sha256] = primary.logic.hash_sha256;
				}
			}
		}

		libraryPrimaries = primaries;
		return { primaries, versionToPrimaryMap };
	}

	function getBestArtwork(primary) {
		if (!primary || !primary.artworks) return undefined;

		const trackArt = findArtworkInList(primary.artworks.track_artwork);
		if (trackArt) return trackArt;

		if (Array.isArray(primary.versions)) {
			for (const v of primary.versions) {
				const verArt = findArtworkInList(v.artworks?.track_artwork);
				if (verArt) return verArt;
			}
		}

		if (isSingleTrack(primary)) {
			return undefined;
		}

		const albumArt = findArtworkInList(primary.artworks.album_artwork);
		if (albumArt) return albumArt;

		if (Array.isArray(primary.versions)) {
			for (const v of primary.versions) {
				const verAlbumArt = findArtworkInList(v.artworks?.album_artwork);
				if (verAlbumArt) return verAlbumArt;
			}
		}

		return undefined;
	}

	function getBestAlbumArtwork(primary) {
		if (!primary || !primary.artworks || isSingleTrack(primary)) return undefined;

		const albumArt = findArtworkInList(primary.artworks.album_artwork);
		if (albumArt) return albumArt;

		if (Array.isArray(primary.versions)) {
			for (const v of primary.versions) {
				const verAlbumArt = findArtworkInList(v.artworks?.album_artwork);
				if (verAlbumArt) return verAlbumArt;
			}
		}

		return undefined;
	}

	function getTrackDisplayName(track, fallback = '') {
		const name = track?.logic?.track_name?.trim();
		if (name) return name;
		const title = track?.metadata?.title?.trim();
		if (title) return title;
		return fallback;
	}

	function getTrackVersionDisplayName(track, fallback = '') {
		const fileName = track?.file?.name?.trim();
		if (fileName) return fileName;
		const versionName = track?.logic?.version_name?.trim();
		if (versionName) return versionName;
		return fallback;
	}

	function formatWebampTrack(trackItem) {
		if (!trackItem || !trackItem.file) return null;
		const title = getTrackDisplayName(trackItem, trackItem.file.name);
		const artists = normalizeArtists(trackItem.metadata?.artists);
		const artist = artists.length > 0 ? artists.join(', ') : (trackItem.metadata?.album_artist || 'Wartets');
		const duration = parseDuration(trackItem.audio_specs?.duration) || 0;
		const url = toMediaUrl(trackItem.file.path, 'media');

		return {
			metaData: {
				title: title,
				artist: artist,
				album: trackItem.metadata?.album || '',
				year: trackItem.metadata?.year || ''
			},
			url: url,
			duration: duration
		};
	}

	function populateFileSystem(items) {
		const fsInstance = (typeof fs !== 'undefined' && fs) ? fs : window.fs;
		if (!fsInstance || !fsInstance.root) return;

		let musicFolder = fsInstance.root.getByName('Music');
		if (!musicFolder || !(musicFolder instanceof Folder)) {
			musicFolder = new Folder('Music');
			musicFolder.icon = '../assets/images/desk/icons/Folder Closed.webp';
			musicFolder.parent = fsInstance.root;
			fsInstance.root.children.set('Music', musicFolder);
		} else {
			musicFolder.icon = '../assets/images/desk/icons/Folder Closed.webp';
		}

		const addedArtworks = new Set();

		items.forEach(item => {
			if (!item || !item.file) return;

			const normalizedFilePath = (item.file.path || '').replace(/\\/g, '/');
			if (!normalizedFilePath) return;

			let normalizedDir = (item.file.dir || '').replace(/\\/g, '/');
			if (!normalizedDir) {
				const lastSlash = normalizedFilePath.lastIndexOf('/');
				normalizedDir = lastSlash > 0 ? normalizedFilePath.substring(0, lastSlash) : '';
			}

			const cleanDir = normalizedDir.replace(/^\/?assets\/?/i, '').trim();
			const segments = cleanDir ? cleanDir.split('/').filter(Boolean) : [];

			let currentFolder = musicFolder;
			for (const segment of segments) {
				let nextFolder = currentFolder.getByName(segment);
				if (!nextFolder || !(nextFolder instanceof Folder)) {
					nextFolder = new Folder(segment);
					nextFolder.icon = '../assets/images/desk/icons/Folder Closed.webp';
					nextFolder.parent = currentFolder;
					currentFolder.children.set(segment, nextFolder);
				}
				currentFolder = nextFolder;
			}

			const fileName = item.file.name || normalizedFilePath.split('/').pop();
			let file = currentFolder.getByName(fileName);
			const mediaUrl = toMediaUrl(normalizedFilePath, 'media');

			if (!file || !(file instanceof File)) {
				file = new File(fileName, currentFolder, '');
				file.parent = currentFolder;
				currentFolder.children.set(fileName, file);
			}

			file.remoteUrl = mediaUrl;
			file.size = item.file.size_bytes || 0;
			file.readOnly = true;
			file.musicTrack = item;
			file.icon = '../assets/images/desk/icons/Music File.webp';

			if (item.file.created) file.createdAt = new Date(item.file.created);
			if (item.file.modified) file.modifiedAt = new Date(item.file.modified);

			const registerArtwork = (art, targetDirSegments) => {
				if (!art || !art.path) return;
				const normArtPath = art.path.replace(/\\/g, '/');
				const artMediaUrl = toMediaUrl(normArtPath, 'media');
				if (addedArtworks.has(artMediaUrl)) return;
				addedArtworks.add(artMediaUrl);

				let artFolder = musicFolder;
				for (const seg of targetDirSegments) {
					let nextF = artFolder.getByName(seg);
					if (!nextF || !(nextF instanceof Folder)) {
						nextF = new Folder(seg);
						nextF.icon = '../assets/images/desk/icons/Folder Closed.webp';
						nextF.parent = artFolder;
						artFolder.children.set(seg, nextF);
					}
					artFolder = nextF;
				}

				const artName = art.name || normArtPath.split('/').pop();
				let artFile = artFolder.getByName(artName);
				if (!artFile || !(artFile instanceof File)) {
					artFile = new File(artName, artFolder, '');
					artFile.parent = artFolder;
					artFolder.children.set(artName, artFile);
				}
				artFile.remoteUrl = artMediaUrl;
				artFile.size = art.size_bytes || 0;
				artFile.readOnly = true;
				artFile.icon = '../assets/images/desk/icons/Picture.webp';
			};

			if (item.artworks) {
				if (Array.isArray(item.artworks.track_artwork)) {
					item.artworks.track_artwork.forEach(art => registerArtwork(art, segments));
				}
				if (Array.isArray(item.artworks.album_artwork) && !isSingleTrack(item)) {
					const parentSegments = segments.length > 1 ? segments.slice(0, -1) : segments;
					item.artworks.album_artwork.forEach(art => registerArtwork(art, parentSegments));
				}
			}
		});

		if (typeof refreshUI === 'function') {
			refreshUI();
		}
	}

	async function init() {
		if (isInitialized) return Promise.resolve(libraryPrimaries);
		if (initPromise) return initPromise;

		const cachedRaw = sessionStorage.getItem(STORAGE_CACHE_KEY) || localStorage.getItem(STORAGE_CACHE_KEY);
		if (cachedRaw) {
			try {
				rawBibData = JSON.parse(cachedRaw);
				const cachedItems = rawBibData.items || [];
				buildLibrary(cachedItems);
				populateFileSystem(cachedItems);
				isInitialized = true;
			} catch (e) {}
		}

		initPromise = (async () => {
			try {
				let res = await fetch(PRIMARY_BIB_URL);
				if (!res.ok) {
					res = await fetch(FALLBACK_BIB_URL);
				}
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				const freshData = await res.json();
				rawBibData = freshData;
				const items = rawBibData.items || [];
				buildLibrary(items);
				populateFileSystem(items);
				isInitialized = true;

				try {
					const strData = JSON.stringify(freshData);
					sessionStorage.setItem(STORAGE_CACHE_KEY, strData);
					localStorage.setItem(STORAGE_CACHE_KEY, strData);
				} catch (e) {}

				if (window.DeskEventBus) {
					window.DeskEventBus.emit('music:loaded', { items, primaries: libraryPrimaries });
				}
				return libraryPrimaries;
			} catch (error) {
				if (isInitialized) return libraryPrimaries;
				return [];
			}
		})();

		return initPromise;
	}

	init();

	function resolveWebampTrack(target) {
		if (!target) return null;
		if (target.metaData && target.url) {
			return target;
		}
		if (target.musicTrack) {
			return formatWebampTrack(target.musicTrack);
		}
		if (target.file && target.metadata) {
			return formatWebampTrack(target);
		}
		if (target instanceof File || (target && typeof target === 'object' && target.name)) {
			if (target.remoteUrl) {
				const trackByUrl = rawItemsMap.get(target.remoteUrl);
				if (trackByUrl) return formatWebampTrack(trackByUrl);
			}
			const trackByName = rawItemsMap.get(target.name);
			if (trackByName) return formatWebampTrack(trackByName);

			const fileName = target.name || 'Unknown Track';
			const title = fileName.replace(/\.[^/.]+$/, '');
			const parentFolder = target.parent ? target.parent.name : '';
			return {
				metaData: {
					title: title,
					artist: 'Wartets',
					album: parentFolder
				},
				url: target.remoteUrl || target.content || '',
				duration: 0
			};
		}
		if (typeof target === 'string') {
			const byHash = rawItemsMap.get(target);
			if (byHash) return formatWebampTrack(byHash);
			return {
				metaData: { title: target.split('/').pop().replace(/\.[^/.]+$/, ''), artist: 'Wartets' },
				url: toMediaUrl(target, 'media'),
				duration: 0
			};
		}
		return null;
	}

	function getAllWebampTracks(includeAllItems = false) {
		if (includeAllItems) {
			if (rawBibData && Array.isArray(rawBibData.items) && rawBibData.items.length > 0) {
				return rawBibData.items.map(formatWebampTrack).filter(Boolean);
			}
			if (rawItemsMap.size > 0) {
				return Array.from(new Set(rawItemsMap.values())).map(formatWebampTrack).filter(Boolean);
			}
		}
		if (libraryPrimaries && libraryPrimaries.length > 0) {
			return libraryPrimaries.map(formatWebampTrack).filter(Boolean);
		}
		if (rawBibData && Array.isArray(rawBibData.items)) {
			return rawBibData.items.map(formatWebampTrack).filter(Boolean);
		}
		return [];
	}

	function resolveRawItem(key) {
		if (!key) return null;
		if (rawItemsMap.has(key)) return rawItemsMap.get(key);
		const cleanKey = String(key).replace(/\\/g, '/');
		if (rawItemsMap.has(cleanKey)) return rawItemsMap.get(cleanKey);
		const fileName = cleanKey.split('/').pop();
		if (rawItemsMap.has(fileName)) return rawItemsMap.get(fileName);
		return null;
	}

	window.MusicStore = {
		init,
		toMediaUrl,
		buildAudioCandidates,
		normalizeEpochToSeconds,
		parseDuration,
		normalizeArtists,
		parseGenres,
		getQualityScore,
		compareTrackVersions,
		getBestArtwork,
		getBestAlbumArtwork,
		getTrackDisplayName,
		getTrackVersionDisplayName,
		formatWebampTrack,
		resolveWebampTrack,
		resolveRawItem,
		getAllWebampTracks,
		isSingleTrack,
		getPrimaries: () => libraryPrimaries,
		getRawData: () => rawBibData,
		isReady: () => isInitialized
	};
})();
