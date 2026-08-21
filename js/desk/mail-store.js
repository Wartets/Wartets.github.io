(function() {
	const STORAGE_KEY = "desktopMailState";

	const SYSTEM_FOLDERS = [
		{ id: "inbox", name: "Inbox", icon: "../assets/images/desk/icons/Folder Closed (Alt).webp", deletable: false },
		{ id: "outbox", name: "Outbox", icon: "../assets/images/desk/icons/Folder Closed.webp", deletable: false },
		{ id: "sent", name: "Sent Items", icon: "../assets/images/desk/icons/Folder Closed.webp", deletable: false },
		{ id: "drafts", name: "Drafts", icon: "../assets/images/desk/icons/Folder Closed.webp", deletable: false },
		{ id: "deleted", name: "Deleted Items", icon: "../assets/images/desk/icons/Trash.webp", deletable: false },
		{ id: "spam", name: "Spam", icon: "../assets/images/desk/icons/Folder Closed.webp", deletable: false }
	];

	const FOLDER_NAME_TO_ID = {
		Inbox: "inbox",
		Outbox: "outbox",
		"Sent Items": "sent",
		Drafts: "drafts",
		"Deleted Items": "deleted",
		Spam: "spam"
	};

	const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	let state = null;

	function todayLocalKey() {
		const now = new Date();
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
	}

	function persist() {
		const payload = JSON.stringify(state);
		if (window.DeskStorage) {
			window.DeskStorage.setItem(STORAGE_KEY, payload);
			window.DeskStorage.setItem("wartets_xp_mailstore_v1", payload);
		} else {
			localStorage.setItem(STORAGE_KEY, payload);
			localStorage.setItem("wartets_xp_mailstore_v1", payload);
		}
	}

	function generateId(prefix) {
		return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
	}

	function seedFromFixedEmails() {
		const mailData = window.mailData;
		if (!mailData || !Array.isArray(mailData.fixedEmails)) return [];
		return mailData.fixedEmails.map(email => ({
			id: `fixed-${email.id}`,
			folderId: FOLDER_NAME_TO_ID[email.folder] || "inbox",
			from: email.from,
			fromAddress: email.fromAddress || "",
			to: "wartets@mail.to",
			subject: email.subject,
			date: email.date,
			body: email.body,
			read: typeof email.read === "boolean" ? email.read : false,
			kind: "fixed"
		}));
	}

	function loadState() {
		try {
			const raw = window.DeskStorage ? (window.DeskStorage.getItem(STORAGE_KEY) || window.DeskStorage.getItem("wartets_xp_mailstore_v1")) : (localStorage.getItem(STORAGE_KEY) || localStorage.getItem("wartets_xp_mailstore_v1"));
			if (raw) {
				state = JSON.parse(raw);
				if (!Array.isArray(state.customFolders)) state.customFolders = [];
				if (!Array.isArray(state.messages)) state.messages = [];
				return;
			}
		} catch (error) {}

		state = {
			version: 1,
			customFolders: [],
			messages: seedFromFixedEmails(),
			lastGeneratedDateKey: null
		};
		persist();
	}

	function init() {
		if (!state) loadState();
	}

	function getFolders() {
		init();
		return [
			...SYSTEM_FOLDERS,
			...state.customFolders.map(f => ({ ...f, icon: "../assets/images/desk/icons/Folder Closed.webp", deletable: true }))
		];
	}

	function getFolderById(id) {
		return getFolders().find(f => f.id === id) || null;
	}

	function createFolder(name) {
		init();
		const trimmed = (name || "").trim();
		if (!trimmed) throw new Error("Folder name cannot be empty.");
		if (getFolders().some(f => f.name.toLowerCase() === trimmed.toLowerCase())) {
			throw new Error(`A folder named "${trimmed}" already exists.`);
		}
		const folder = { id: generateId("folder"), name: trimmed };
		state.customFolders.push(folder);
		persist();
		return folder;
	}

	function renameFolder(id, newName) {
		init();
		const folder = state.customFolders.find(f => f.id === id);
		if (!folder) throw new Error("Folder not found.");
		const trimmed = (newName || "").trim();
		if (!trimmed) throw new Error("Folder name cannot be empty.");
		if (getFolders().some(f => f.id !== id && f.name.toLowerCase() === trimmed.toLowerCase())) {
			throw new Error(`A folder named "${trimmed}" already exists.`);
		}
		folder.name = trimmed;
		persist();
	}

	function deleteFolder(id) {
		init();
		const index = state.customFolders.findIndex(f => f.id === id);
		if (index === -1) throw new Error("Folder not found.");
		state.messages.forEach(msg => {
			if (msg.folderId === id) msg.folderId = "inbox";
		});
		state.customFolders.splice(index, 1);
		persist();
	}

	function getMessages(folderId) {
		init();
		return state.messages
			.filter(msg => msg.folderId === folderId)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	}

	function getMessageById(id) {
		init();
		return state.messages.find(msg => msg.id === id) || null;
	}

	function markRead(id, isRead = true) {
		init();
		const message = getMessageById(id);
		if (message) {
			message.read = isRead;
			persist();
		}
	}

	function moveMessage(id, folderId) {
		init();
		const message = getMessageById(id);
		if (!message) throw new Error("Message not found.");
		if (!getFolderById(folderId)) throw new Error("Destination folder not found.");
		message.folderId = folderId;
		persist();
	}

	function deleteMessage(id) {
		init();
		const message = getMessageById(id);
		if (!message) return;
		if (message.folderId === "deleted") {
			state.messages = state.messages.filter(msg => msg.id !== id);
		} else {
			message.folderId = "deleted";
		}
		persist();
	}

	function isValidEmail(address) {
		return EMAIL_REGEX.test((address || "").trim());
	}

	function sendMessage({ to, subject, body }) {
		init();
		if (!isValidEmail(to)) {
			throw new Error("Please enter a valid e-mail address.");
		}
		const message = {
			id: generateId("sent"),
			folderId: "sent",
			from: "Wartets (You)",
			fromAddress: "wartets@mail.to",
			to: to.trim(),
			subject: (subject || "(No subject)").trim(),
			date: new Date().toISOString(),
			body: (body || "").replace(/\n/g, "<br>"),
			read: true,
			kind: "user"
		};
		state.messages.push(message);
		persist();
		return message;
	}

	function saveDraft({ id, to, subject, body }) {
		init();
		if (id) {
			const existing = getMessageById(id);
			if (existing && existing.folderId === "drafts") {
				existing.to = to || "";
				existing.subject = subject || "(No subject)";
				existing.body = (body || "").replace(/\n/g, "<br>");
				existing.date = new Date().toISOString();
				persist();
				return existing;
			}
		}
		const draft = {
			id: generateId("draft"),
			folderId: "drafts",
			from: "Wartets (You)",
			fromAddress: "wartets@mail.to",
			to: to || "",
			subject: subject || "(No subject)",
			date: new Date().toISOString(),
			body: (body || "").replace(/\n/g, "<br>"),
			read: true,
			kind: "user"
		};
		state.messages.push(draft);
		persist();
		return draft;
	}

	function deleteDraft(id) {
		init();
		state.messages = state.messages.filter(msg => msg.id !== id);
		persist();
	}

	async function buildAnecdoteEmail(dateUTC, dateKey) {
		try {
			const [{ resolveEntryForDate }, { getFullEntry }, { loadRegistry }, markdownModule] = await Promise.all([
				import("/js/anecdotes/debug/engine.js"),
				import("/js/anecdotes/debug/entry-cache.js"),
				import("/js/anecdotes/loader.js"),
				import("/js/anecdotes/markdown-render.js")
			]);
			const registry = await loadRegistry();
			const { registryEntry } = resolveEntryForDate(dateUTC, registry);
			if (!registryEntry) return null;

			const fullEntry = await getFullEntry(registryEntry, "en");
			if (!fullEntry || fullEntry.__loadFailed) return null;

			await markdownModule.ensureMarkdownAssets();

			const domainText = (fullEntry.domain && (fullEntry.domain.en || fullEntry.domain.fr)) || "";
			const contentText = typeof fullEntry.content === "function"
				? fullEntry.content("en", dateUTC.getUTCFullYear(), dateUTC)
				: ((fullEntry.content && (fullEntry.content.en || fullEntry.content.fr)) || "");

			let bodyHtml = `<p style="text-transform:uppercase;font-size:11px;color:#666;letter-spacing:0.05em;">${domainText}</p>`;
			bodyHtml += `<div class="anecdote-markdown-body">${await markdownModule.renderMarkdownWithMath(contentText)}</div>`;

			for (const context of (fullEntry.contexts || [])) {
				if (context.external) continue;
				const title = (context.title && (context.title.en || context.title.fr)) || "";
				const body = (context.body && (context.body.en || context.body.fr)) || "";
				bodyHtml += `<h4 style="margin-bottom:4px;">${title}</h4>`;
				bodyHtml += `<div class="anecdote-markdown-body">${await markdownModule.renderMarkdownWithMath(body)}</div>`;
			}

			if (fullEntry.sources && fullEntry.sources.length > 0) {
				bodyHtml += '<h4 style="margin-bottom:4px;">Sources</h4><ul>';
				fullEntry.sources.forEach(source => {
					const name = (source.name && (source.name.en || source.name.fr)) || source.url;
					bodyHtml += `<li><a href="${source.url}" target="_blank" rel="noopener noreferrer">${name}</a></li>`;
				});
				bodyHtml += "</ul>";
			}

			return {
				id: `anecdote-${dateKey}`,
				folderId: "inbox",
				from: "Anecdote of the Day",
				fromAddress: "anecdotes@wartets.local",
				to: "wartets@mail.to",
				subject: `Anecdote of the Day - ${domainText}`,
				date: dateUTC.toISOString(),
				body: bodyHtml,
				read: false,
				kind: "anecdote"
			};
		} catch (error) {
			return null;
		}
	}

	async function ensureDailyContent() {
		init();
		const key = todayLocalKey();
		if (state.lastGeneratedDateKey === key) return false;

		let added = false;

		if (window.mailData && typeof window.mailData.generateProceduralEmail === "function") {
			const alreadyExists = state.messages.some(msg => msg.id === `daily-${key}`);
			if (!alreadyExists) {
				const generated = window.mailData.generateProceduralEmail(key);
				state.messages.push({
					id: `daily-${key}`,
					folderId: "inbox",
					from: generated.from,
					fromAddress: generated.fromAddress,
					to: "wartets@mail.to",
					subject: generated.subject,
					date: new Date().toISOString(),
					body: generated.body,
					read: false,
					kind: "daily"
				});
				added = true;
			}
		}

		try {
			const { getAuthoritativeUTCDate, toUTCDateOnly } = await import("/js/anecdotes/time-sync.js");
			const preciseNow = await getAuthoritativeUTCDate();
			const today = toUTCDateOnly(preciseNow);
			const anecdoteId = `anecdote-${key}`;
			const alreadyExists = state.messages.some(msg => msg.id === anecdoteId);
			if (!alreadyExists) {
				const anecdoteEmail = await buildAnecdoteEmail(today, key);
				if (anecdoteEmail) {
					state.messages.push(anecdoteEmail);
					added = true;
				}
			}
		} catch (error) {}

		state.lastGeneratedDateKey = key;
		persist();
		return added;
	}

	window.MailStore = {
		init,
		ensureDailyContent,
		getFolders,
		getFolderById,
		createFolder,
		renameFolder,
		deleteFolder,
		getMessages,
		getMessageById,
		markRead,
		moveMessage,
		deleteMessage,
		sendMessage,
		saveDraft,
		deleteDraft,
		isValidEmail
	};
})();
