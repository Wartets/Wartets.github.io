window.mailData = {
	folders: [
		{ id: "inbox", name: "Inbox" },
		{ id: "outbox", name: "Outbox" },
		{ id: "sent", name: "Sent Items" },
		{ id: "drafts", name: "Drafts" },
		{ id: "deleted", name: "Deleted Items" },
		{ id: "spam", name: "Spam" }
	],

	fixedEmails: [
		{
			id: 1,
			folder: "Inbox",
			from: "System Administrator",
			fromAddress: "notifications@github.com",
			subject: "Welcome to your portfolio!",
			date: "2026-08-13 10:00",
			read: false,
			body: `
				<p>Hello Wartets,</p>
				<p>Welcome to your interactive Windows XP portfolio. This is a demonstration of the Outlook Express application.</p>
				<p>You can click on different emails in the list to see their content displayed here in the preview pane.</p>
				<p>Best regards,<br>The Developer</p>
			`
		},
		{
			id: 2,
			folder: "Inbox",
			from: "System Administrator",
			fromAddress: "admin@wartets-security.local",
			subject: "Security Alert: New Login",
			date: "2024-05-19 15:30",
			read: true,
			body: "<p>A new device has logged into your account. If this was not you, please secure your account immediately.</p>"
		},
		{
			id: 3,
			folder: "Inbox",
			from: "SoundCloud",
			fromAddress: "no-reply@soundcloud.com",
			subject: "Your weekly stats are here",
			date: "2024-05-18 08:45",
			read: true,
			body: "<p>You got 1,234 plays this week! Keep up the great work.</p>"
		},
		{
			id: 4,
			folder: "Inbox",
			from: "Université Paris Cité",
			fromAddress: "scolarite@u-paris.fr",
			subject: "Confirmation d'inscription pédagogique",
			date: "2026-07-02 09:15",
			read: true,
			body: `
				<p>Bonjour Colin Bossu Réaubourg,</p>
				<p>Votre inscription pédagogique pour l'année universitaire à venir a bien été enregistrée par les services de scolarité.</p>
				<p>Vous pouvez dès à présent consulter votre emploi du temps provisoire depuis votre espace étudiant.</p>
				<p>Cordialement,<br>La scolarité de l'UFR de Physique</p>
			`
		},
		{
			id: 5,
			folder: "Inbox",
			from: "Overleaf",
			fromAddress: "notifications@overleaf.com",
			subject: "Vous avez été invité à collaborer sur un projet",
			date: "2026-06-11 17:42",
			read: false,
			body: `
				<p>Un collaborateur vous a ajouté au projet Overleaf "Rapport de stage MPQ-QITE".</p>
				<p>Vous pouvez désormais éditer ce document en temps réel avec les autres membres du projet.</p>
				<p>Ouvrez Overleaf pour commencer à collaborer.</p>
			`
		},
		{
			id: 100,
			folder: "Spam",
			from: "Milfeuille.com",
			fromAddress: "newsletter@milfeuille.com",
			subject: "Rencontrez votre douceur parfaite",
			date: "2026-02-19 09:12",
			read: true,
			body: `
				<div style="font-family: sans-serif; color: #333;">
					<h2 style="color: #d63384; margin: 0 0 8px 0;">Salut beauté,</h2>
					<p>Vous méritez le plus délicat des plaisirs - et nous l'avons trouvé pour vous. Milfeuille est le nouveau site de rencontres où les coeurs sensibles rencontrent des gourmands charmants.</p>
					<p style="background: #fff0f6; padding: 8px; border-radius: 6px;">Créez votre profil en 2 minutes et recevez des messages de personnes prêtes à partager pâtisseries et câlins. <a href="https://wartets.github.io/Milfeuille/" target="_blank">Découvrir Milfeuille</a></p>
					<p>Inscrivez-vous maintenant et obtenez <strong>1 mois gratuit</strong> de visibilité premium - seulement pour nos nouvelles membres.</p>
					<p style="margin-top: 12px;">Bisous sucrés,<br><em>L'équipe Milfeuille</em></p>
				</div>
			`
		}
	],

	generateProceduralEmail: function(dateKey) {
		function djb2(str) {
			let hash = 5381;
			for (let i = 0; i < str.length; i++) {
				hash = ((hash << 5) + hash) + str.charCodeAt(i);
				hash |= 0;
			}
			return hash >>> 0;
		}

		function mulberry32(seed) {
			let a = seed >>> 0;
			return function() {
				a |= 0;
				a = (a + 0x6D2B79F5) | 0;
				let t = Math.imul(a ^ (a >>> 15), 1 | a);
				t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
				return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
			};
		}

		function pick(array, rng) {
			return array[Math.floor(rng() * array.length)];
		}

		function pickInt(min, max, rng) {
			return min + Math.floor(rng() * (max - min + 1));
		}

		function fill(template, vars) {
			return template.replace(/\{(\w+)\}/g, (match, key) => (key in vars) ? String(vars[key]) : match);
		}

		function resolveProjectTitle(title) {
			if (typeof title === 'string') return title;
			if (title && typeof title === 'object') return title.en || title.fr || Object.values(title)[0] || '';
			return '';
		}

		function getProjectRepoNames() {
			try {
				if (typeof projects === 'undefined') return [];
				return projects.flat()
					.filter(p => typeof p === 'object' && p !== null && p.github && p.title)
					.map(p => resolveProjectTitle(p.title))
					.filter(Boolean);
			} catch (error) {
				return [];
			}
		}

		function getLibraryDocumentTitles() {
			try {
				if (typeof window.libraryData === 'undefined' || !window.libraryData.documents) return [];
				return window.libraryData.documents
					.filter(d => d.show !== false && d.title)
					.map(d => (d.title && typeof d.title === 'object') ? (d.title.en || d.title.fr || Object.values(d.title)[0]) : d.title)
					.filter(Boolean);
			} catch (error) {
				return [];
			}
		}

		const fallbackRepoNames = ["Lenia GPU Simulator", "N-Body-Simulation", "TikZ Generator", "Turbulence Simulation", "FDTD Wave Simulator", "Origami", "Molecule Builder"];
		const fallbackPaperTitles = ["Rapport de stage MPQ-QITE", "Construction progressive du modèle standard", "Étude expérimentale du lasso", "Probabilités des galettes des rois"];

		const repoNames = getProjectRepoNames().length ? getProjectRepoNames() : fallbackRepoNames;
		const paperTitles = getLibraryDocumentTitles().length ? getLibraryDocumentTitles() : fallbackPaperTitles;

		const musicTrackTitles = ["Projet 27", "Projet 12", "Projet 8", "Dance", "Projet 2", "End of Chapter One", "Cell", "Hypocritical World's Nostalgia"];
		const universityCourses = ["Mécanique Quantique", "Physique Statistique", "Électromagnétisme", "Analyse Numérique", "Optique Ondulatoire", "Thermodynamique", "Mécanique des Fluides"];
		const associationEvents = ["la conférence de rentrée", "l'atelier de vulgarisation scientifique", "la sortie au Palais de la Découverte", "la réunion du bureau", "la soirée d'intégration", "le café-débat mensuel"];
		const arxivSearchTerms = ["quantum computing", "cellular automata", "fluid dynamics", "N-body simulation", "condensed matter physics", "statistical mechanics", "entangled photon sources"];
		const productivityDocumentNames = ["Notes de réunion", "Feuille de route Q3", "Cahier des charges", "Plan de présentation", "Suivi de projet", "Compte-rendu hebdomadaire"];
		const slackChannels = ["general", "physique-projets", "dev-simulation", "annonces", "random"];
		const redditSubreddits = ["Physics", "ProgrammerHumor", "generative", "math", "simulation"];
		const kaggleDatasets = ["particle-collision-events", "exoplanet-transit-curves", "n-body-trajectories", "fluid-turbulence-samples"];
		const dropboxFolderNames = ["Archives Simulation", "Documents Administratifs", "Backup Musique", "Notes de Cours"];

		function unorderedListItems(items) {
			return items.map(item => `<li>${item}</li>`).join("");
		}

		const categories = [
			{
				id: "development",
				senders: [
					{ name: "GitHub", address: "notifications@github.com" },
					{ name: "GitLab", address: "notifications@gitlab.com" },
					{ name: "Docker Hub", address: "noreply@docker.com" },
					{ name: "npm", address: "support@npmjs.com" },
					{ name: "Vercel", address: "notifications@vercel.com" },
					{ name: "Netlify", address: "notifications@netlify.com" },
					{ name: "Cloudflare", address: "notifications@cloudflare.com" },
					{ name: "Stack Overflow", address: "noreply@stackoverflow.com" }
				],
				closings: [
					"No action is required unless you want to review the changes yourself.",
					"You can manage notification preferences for this repository at any time.",
					"This is an automated message generated by your repository's activity feed.",
					"Feel free to mute this repository if you no longer wish to receive these updates."
				],
				scenarios: [
					(rng) => {
						const repo = pick(repoNames, rng);
						const count = pickInt(1, 9, rng);
						return {
							subject: fill("New issue opened on {repo}", { repo }),
							paragraphs: [
								fill("A new issue has just been opened on the repository <strong>{repo}</strong>.", { repo }),
								fill("There {verb} currently {count} open issue{plural} awaiting triage on this repository.", { count, verb: count === 1 ? "is" : "are", plural: count === 1 ? "" : "s" })
							]
						};
					},
					(rng) => {
						const repo = pick(repoNames, rng);
						const prNumber = pickInt(12, 348, rng);
						return {
							subject: fill("Pull request #{prNumber} merged into {repo}", { prNumber, repo }),
							paragraphs: [
								fill("Pull request #{prNumber} has been successfully merged into the main branch of <strong>{repo}</strong>.", { prNumber, repo }),
								"All required checks passed before the merge was completed."
							]
						};
					},
					(rng) => {
						const repo = pick(repoNames, rng);
						const count = pickInt(2, 47, rng);
						return {
							subject: fill("{count} new stargazers on {repo}", { count, repo }),
							paragraphs: [
								fill("Your repository <strong>{repo}</strong> gained {count} new stargazers this week.", { count, repo }),
								"Keep up the momentum, your project is gaining visibility within the community."
							]
						};
					},
					(rng) => {
						const repo = pick(repoNames, rng);
						const versionMajor = pickInt(1, 4, rng);
						const versionMinor = pickInt(0, 9, rng);
						const versionPatch = pickInt(0, 9, rng);
						return {
							subject: fill("New release published: {repo} v{version}", { repo, version: `${versionMajor}.${versionMinor}.${versionPatch}` }),
							paragraphs: [
								fill("A new release of <strong>{repo}</strong> has just been published: version {version}.", { repo, version: `${versionMajor}.${versionMinor}.${versionPatch}` }),
								"The changelog and release notes are available on the repository's Releases page."
							]
						};
					},
					(rng) => {
						const repo = pick(repoNames, rng);
						return {
							subject: fill("Build failed: {repo} — action required", { repo }),
							paragraphs: [
								fill("The latest continuous integration build for <strong>{repo}</strong> has failed.", { repo }),
								"Check the build logs to identify which step caused the failure before merging any further changes."
							]
						};
					}
				]
			},
			{
				id: "academic",
				senders: [
					{ name: "Université Paris Cité", address: "scolarite@u-paris.fr" },
					{ name: "arXiv", address: "no-reply@arxiv.org" },
					{ name: "ResearchGate", address: "updates@researchgate.net" },
					{ name: "Nature", address: "alerts@nature.com" },
					{ name: "IEEE", address: "noreply@ieee.org" },
					{ name: "Springer", address: "alerts@springernature.com" },
					{ name: "ScienceDirect", address: "alerts@sciencedirect.com" },
					{ name: "CNRS Newsletter", address: "newsletter@cnrs.fr" },
					{ name: "Overleaf", address: "notifications@overleaf.com" }
				],
				closings: [
					"You can access the full details from your institutional account.",
					"This alert was generated based on your saved search preferences.",
					"No further action is required unless you wish to follow up.",
					"You can adjust your notification settings for this topic at any time."
				],
				scenarios: [
					(rng) => {
						const paper = pick(paperTitles, rng);
						return {
							subject: fill("New citation alert for \"{paper}\"", { paper }),
							paragraphs: [
								fill("A recently published article has cited your work <strong>\"{paper}\"</strong>.", { paper }),
								"You can view the citing publication and its context from your citation tracking dashboard."
							]
						};
					},
					(rng) => {
						const term = pick(arxivSearchTerms, rng);
						const count = pickInt(1, 6, rng);
						return {
							subject: fill("{count} new preprints matching \"{term}\"", { count, term }),
							paragraphs: [
								fill("{count} new preprint(s) matching your saved search \"{term}\" have been submitted to arXiv today.", { count, term }),
								"You can review the abstracts directly from your personalized feed."
							]
						};
					},
					(rng) => {
						const paper = pick(paperTitles, rng);
						return {
							subject: fill("Vous avez été invité à collaborer sur \"{paper}\"", { paper }),
							paragraphs: [
								fill("Un collaborateur vous a ajouté au projet Overleaf <strong>\"{paper}\"</strong>.", { paper }),
								"Vous pouvez désormais éditer ce document en temps réel avec les autres membres du projet."
							]
						};
					},
					(rng) => {
						const course = pick(universityCourses, rng);
						return {
							subject: fill("Rappel : contrôle continu de {course}", { course }),
							paragraphs: [
								fill("Le contrôle continu de l'UE <strong>{course}</strong> aura lieu prochainement.", { course }),
								"Consultez votre emploi du temps pour connaître la date, l'heure et la salle exactes."
							]
						};
					},
					(rng) => {
						const paper = pick(paperTitles, rng);
						return {
							subject: fill("Your submission \"{paper}\" is under review", { paper }),
							paragraphs: [
								fill("Your manuscript <strong>\"{paper}\"</strong> has entered the peer review stage.", { paper }),
								"Reviewers typically respond within four to six weeks. You will be notified as soon as a decision is made."
							]
						};
					}
				]
			},
			{
				id: "music",
				senders: [
					{ name: "SoundCloud", address: "no-reply@soundcloud.com" },
					{ name: "YouTube", address: "no-reply@youtube.com" }
				],
				closings: [
					"Keep creating, your audience is growing steadily.",
					"You can view the full analytics breakdown from your creator dashboard.",
					"This summary is generated automatically at the end of each week."
				],
				scenarios: [
					(rng) => {
						const track = pick(musicTrackTitles, rng);
						const plays = pickInt(230, 4800, rng);
						return {
							subject: "Your weekly stats are here",
							paragraphs: [
								fill("Your track <strong>\"{track}\"</strong> received {plays} plays this week.", { track, plays }),
								"That is a solid increase compared to the previous week."
							]
						};
					},
					(rng) => {
						const track = pick(musicTrackTitles, rng);
						return {
							subject: fill("New comment on \"{track}\"", { track }),
							paragraphs: [
								fill("Someone left a new comment on your track <strong>\"{track}\"</strong>.", { track }),
								"Reply to keep the conversation going with your listeners."
							]
						};
					},
					(rng) => {
						const track = pick(musicTrackTitles, rng);
						const subs = pickInt(3, 42, rng);
						return {
							subject: fill("{subs} new followers this week", { subs }),
							paragraphs: [
								fill("You gained {subs} new followers this week, many of whom discovered you through <strong>\"{track}\"</strong>.", { subs, track }),
								"Consider sharing your latest release to keep the momentum going."
							]
						};
					}
				]
			},
			{
				id: "productivity",
				senders: [
					{ name: "Notion", address: "team@notion.so" },
					{ name: "Trello", address: "noreply@trello.com" },
					{ name: "Slack", address: "team@slack.com" },
					{ name: "Figma", address: "notifications@figma.com" },
					{ name: "Discord", address: "noreply@discord.com" },
					{ name: "Dropbox", address: "no-reply@dropbox.com" },
					{ name: "Google Drive", address: "drive-shares-noreply@google.com" },
					{ name: "Google Calendar", address: "calendar-notification@google.com" }
				],
				closings: [
					"You can adjust how often you receive these notifications in your settings.",
					"This is an automated notification and does not require a reply.",
					"Open the application to see the full context of this activity."
				],
				scenarios: [
					(rng) => {
						const doc = pick(productivityDocumentNames, rng);
						return {
							subject: fill("A document was shared with you: \"{doc}\"", { doc }),
							paragraphs: [
								fill("A collaborator shared the document <strong>\"{doc}\"</strong> with you.", { doc }),
								"You now have access to view and comment on it."
							]
						};
					},
					(rng) => {
						const doc = pick(productivityDocumentNames, rng);
						return {
							subject: fill("You were assigned a task in \"{doc}\"", { doc }),
							paragraphs: [
								fill("You have been assigned a new task within the board <strong>\"{doc}\"</strong>.", { doc }),
								"Check the due date and update the task status once you begin working on it."
							]
						};
					},
					(rng) => {
						const channel = pick(slackChannels, rng);
						return {
							subject: fill("You were mentioned in #{channel}", { channel }),
							paragraphs: [
								fill("You were mentioned in a message posted to #<strong>{channel}</strong>.", { channel }),
								"Open the conversation to see the full context and reply if needed."
							]
						};
					},
					(rng) => {
						const folder = pick(dropboxFolderNames, rng);
						return {
							subject: fill("A folder was shared with you: \"{folder}\"", { folder }),
							paragraphs: [
								fill("Access to the folder <strong>\"{folder}\"</strong> has been shared with your account.", { folder }),
								"You can now sync its contents to your local devices."
							]
						};
					},
					(rng) => {
						const doc = pick(productivityDocumentNames, rng);
						const minutesBefore = pick([15, 30, 60], rng);
						return {
							subject: fill("Reminder: meeting starting in {minutesBefore} minutes", { minutesBefore }),
							paragraphs: [
								fill("Your scheduled meeting related to <strong>\"{doc}\"</strong> starts in {minutesBefore} minutes.", { doc, minutesBefore }),
								"Make sure you have reviewed the agenda before joining."
							]
						};
					}
				]
			},
			{
				id: "security",
				senders: [
					{ name: "Microsoft", address: "account-security@microsoft.com" },
					{ name: "Google", address: "accounts-noreply@google.com" },
					{ name: "Windows Update", address: "update@microsoft.com" }
				],
				closings: [
					"If this was not you, please reset your password immediately and enable two-factor authentication.",
					"This is an automated security notification.",
					"No further action is required if you recognize this activity."
				],
				scenarios: [
					(rng) => {
						const device = pick(["Windows PC", "Android device", "MacBook", "iPhone"], rng);
						return {
							subject: "New sign-in detected on your account",
							paragraphs: [
								fill("A new sign-in to your account was detected from a <strong>{device}</strong>.", { device }),
								"If you recognize this device, no action is needed."
							]
						};
					},
					(rng) => {
						return {
							subject: "Your password was recently changed",
							paragraphs: [
								"This is a confirmation that the password associated with your account was changed successfully.",
								"If you did not make this change, please contact support right away."
							]
						};
					},
					(rng) => {
						const versionBuild = pickInt(19041, 26100, rng);
						return {
							subject: "Windows Update is ready to install",
							paragraphs: [
								fill("A cumulative update (build {versionBuild}) is ready to be installed on your device.", { versionBuild }),
								"Restart your computer to complete the installation."
							]
						};
					}
				]
			},
			{
				id: "community",
				senders: [
					{ name: "Reddit", address: "notifications@reddit.com" },
					{ name: "Medium", address: "hello@medium.com" },
					{ name: "Kaggle", address: "notifications@kaggle.com" }
				],
				closings: [
					"You can manage what you get notified about from your account preferences.",
					"This digest was generated based on your recent activity.",
					"Engage with the community to keep the discussion going."
				],
				scenarios: [
					(rng) => {
						const subreddit = pick(redditSubreddits, rng);
						return {
							subject: fill("New reply to your post in r/{subreddit}", { subreddit }),
							paragraphs: [
								fill("Someone replied to your post in <strong>r/{subreddit}</strong>.", { subreddit }),
								"Join the discussion by replying back."
							]
						};
					},
					(rng) => {
						const readers = pickInt(12, 340, rng);
						return {
							subject: "Your story has new readers",
							paragraphs: [
								fill("Your latest story on Medium reached {readers} new readers this week.", { readers }),
								"Consider publishing a follow-up to maintain engagement."
							]
						};
					},
					(rng) => {
						const dataset = pick(kaggleDatasets, rng);
						return {
							subject: fill("New version available for \"{dataset}\"", { dataset }),
							paragraphs: [
								fill("A new version of the dataset <strong>\"{dataset}\"</strong> you follow has just been published.", { dataset }),
								"Download the updated version to keep your analysis current."
							]
						};
					}
				]
			},
			{
				id: "spaceScience",
				senders: [
					{ name: "NASA", address: "nasa@newsletters.nasa.gov" },
					{ name: "ESA", address: "news@esa.int" },
					{ name: "Météo France", address: "alerts@meteo-france.fr" }
				],
				closings: [
					"This is an informational message and does not require a reply.",
					"Stay tuned for further updates as the situation develops.",
					"You can unsubscribe from these alerts at any time."
				],
				scenarios: [
					(rng) => {
						const mission = pick(["Artemis II", "Europa Clipper", "James Webb Space Telescope", "Perseverance Rover"], rng);
						return {
							subject: fill("Mission update: {mission}", { mission }),
							paragraphs: [
								fill("A new status update has been published for the <strong>{mission}</strong> mission.", { mission }),
								"The full report is available on the mission's official page."
							]
						};
					},
					(rng) => {
						const mission = pick(["Ariane 6", "JUICE", "Solar Orbiter", "Hera"], rng);
						return {
							subject: fill("Launch update: {mission}", { mission }),
							paragraphs: [
								fill("The launch schedule for <strong>{mission}</strong> has been updated.", { mission }),
								"Check the live stream details closer to the launch window."
							]
						};
					},
					(rng) => {
						const condition = pick(["orage", "vent violent", "vague de chaleur", "pluie verglaçante"], rng);
						return {
							subject: fill("Alerte météo : {condition} en Île-de-France", { condition }),
							paragraphs: [
								fill("Météo France a émis une alerte de type <strong>{condition}</strong> pour l'Île-de-France.", { condition }),
								"Prenez vos précautions et suivez les recommandations des autorités locales."
							]
						};
					}
				]
			},
			{
				id: "openSourceRelease",
				senders: [
					{ name: "Python", address: "python-dev@python.org" },
					{ name: "Rust", address: "notifications@rust-lang.org" },
					{ name: "Ubuntu", address: "newsletter@ubuntu.com" },
					{ name: "Debian", address: "news@debian.org" },
					{ name: "Arch Linux", address: "newsletter@archlinux.org" },
					{ name: "Mozilla", address: "newsletter@mozilla.org" }
				],
				closings: [
					"See the full changelog for a complete list of changes.",
					"We recommend updating at your earliest convenience.",
					"This announcement was sent to all subscribed users."
				],
				scenarios: [
					(rng) => {
						const major = pickInt(1, 4, rng);
						const minor = pickInt(0, 12, rng);
						const patch = pickInt(0, 9, rng);
						return {
							subject: fill("New release available: v{version}", { version: `${major}.${minor}.${patch}` }),
							paragraphs: [
								fill("A new stable release, version {version}, is now available for download.", { version: `${major}.${minor}.${patch}` }),
								"This release includes performance improvements and several bug fixes."
							]
						};
					},
					(rng) => {
						return {
							subject: "Security patch released",
							paragraphs: [
								"A security patch addressing a recently discovered vulnerability has been released.",
								"Updating as soon as possible is strongly recommended."
							]
						};
					}
				]
			},
			{
				id: "association",
				senders: [
					{ name: "Phisis Association", address: "contact@phisis-asso.fr" }
				],
				closings: [
					"N'hésitez pas à répondre à ce message si vous avez des questions.",
					"Toute l'équipe du bureau se réjouit de vous y voir.",
					"Ce message a été envoyé à l'ensemble des membres de l'association."
				],
				scenarios: [
					(rng) => {
						const event = pick(associationEvents, rng);
						return {
							subject: fill("Rappel : {event} approche", { event }),
							paragraphs: [
								fill("Nous vous rappelons que <strong>{event}</strong> aura lieu très prochainement.", { event }),
								"Merci de confirmer votre présence via le formulaire habituel."
							]
						};
					},
					(rng) => {
						const event = pick(associationEvents, rng);
						return {
							subject: fill("Compte-rendu de {event}", { event }),
							paragraphs: [
								fill("Voici un résumé des points abordés lors de <strong>{event}</strong>.", { event }),
								"Le compte-rendu complet est disponible sur le drive partagé de l'association."
							]
						};
					}
				]
			},
			{
				id: "banking",
				senders: [
					{ name: "Société Générale", address: "no-reply@societegenerale.fr" },
					{ name: "Boursorama Banque", address: "notifications@boursorama.com" },
					{ name: "Revolut", address: "noreply@revolut.com" },
					{ name: "PayPal", address: "service@paypal.com" }
				],
				closings: [
					"Ceci est un message automatique, merci de ne pas y répondre directement.",
					"Vous pouvez consulter le détail de cette opération depuis votre espace client.",
					"Pour toute question, contactez notre service client depuis l'application."
				],
				scenarios: [
					(rng) => {
						const amount = (pickInt(5, 480, rng) + rng()).toFixed(2);
						const merchant = pick(["Amazon", "SNCF Connect", "Uber", "Fnac", "Decathlon", "Steam"], rng);
						return {
							subject: fill("Nouvelle transaction : {amount} € chez {merchant}", { amount, merchant }),
							paragraphs: [
								fill("Une transaction de <strong>{amount} €</strong> a été effectuée chez <strong>{merchant}</strong>.", { amount, merchant }),
								"Si vous ne reconnaissez pas cette opération, faites opposition immédiatement depuis l'application."
							]
						};
					},
					(rng) => {
						const balance = pickInt(120, 4200, rng);
						return {
							subject: "Votre relevé mensuel est disponible",
							paragraphs: [
								fill("Votre relevé de compte du mois est désormais consultable. Solde actuel : <strong>{balance} €</strong>.", { balance }),
								"Téléchargez le PDF depuis la rubrique Documents de votre espace client."
							]
						};
					},
					(rng) => {
						return {
							subject: "Confirmation de virement",
							paragraphs: [
								"Votre virement a bien été traité et sera crédité sous 1 à 2 jours ouvrés.",
								"Aucune action supplémentaire n'est requise de votre part."
							]
						};
					}
				]
			},
			{
				id: "travel",
				senders: [
					{ name: "SNCF Connect", address: "no-reply@sncf-connect.com" },
					{ name: "Air France", address: "noreply@airfrance.fr" },
					{ name: "Booking.com", address: "no-reply@booking.com" },
					{ name: "BlaBlaCar", address: "notifications@blablacar.fr" }
				],
				closings: [
					"Bon voyage !",
					"Retrouvez tous les détails de votre réservation dans votre espace personnel.",
					"Ce message confirme votre réservation, conservez-le pour vos démarches."
				],
				scenarios: [
					(rng) => {
						const city = pick(["Lyon", "Marseille", "Bordeaux", "Lille", "Strasbourg", "Nantes"], rng);
						const trainNumber = pickInt(6100, 8999, rng);
						return {
							subject: fill("Votre billet Paris - {city} est confirmé", { city }),
							paragraphs: [
								fill("Votre trajet Paris - <strong>{city}</strong> à bord du train n°{trainNumber} est confirmé.", { city, trainNumber }),
								"Présentez votre billet électronique ou votre carte de fidélité à bord."
							]
						};
					},
					(rng) => {
						const nights = pickInt(1, 6, rng);
						const city = pick(["Rome", "Lisbonne", "Barcelone", "Amsterdam", "Prague"], rng);
						return {
							subject: fill("Confirmation de votre séjour à {city}", { city }),
							paragraphs: [
								fill("Votre réservation pour {nights} nuit(s) à <strong>{city}</strong> est confirmée.", { nights, city }),
								"L'hôte vous contactera prochainement avec les instructions d'arrivée."
							]
						};
					},
					(rng) => {
						const departure = pick(["Paris", "Lyon", "Toulouse"], rng);
						const arrival = pick(["Bruxelles", "Genève", "Barcelone"], rng);
						return {
							subject: fill("Trajet {departure} - {arrival} : votre conducteur a confirmé", { departure, arrival }),
							paragraphs: [
								fill("Votre conducteur pour le trajet <strong>{departure} → {arrival}</strong> a confirmé votre réservation.", { departure, arrival }),
								"Vous recevrez le point de rendez-vous exact la veille du départ."
							]
						};
					}
				]
			},
			{
				id: "shopping",
				senders: [
					{ name: "Amazon", address: "expedition@amazon.fr" },
					{ name: "Fnac", address: "commande@fnac.com" },
					{ name: "Decathlon", address: "no-reply@decathlon.fr" },
					{ name: "Steam", address: "noreply@steampowered.com" }
				],
				closings: [
					"Merci pour votre commande.",
					"Vous pouvez suivre votre colis depuis votre compte.",
					"À bientôt sur notre boutique."
				],
				scenarios: [
					(rng) => {
						const item = pick(["un casque audio", "une carte graphique", "un livre de physique", "des chaussures de randonnée", "un microphone USB"], rng);
						return {
							subject: "Votre commande a été expédiée",
							paragraphs: [
								fill("Votre commande contenant <strong>{item}</strong> a été expédiée et arrivera sous 2 à 4 jours ouvrés.", { item }),
								"Vous pouvez suivre l'acheminement du colis en temps réel."
							]
						};
					},
					(rng) => {
						const discount = pickInt(10, 40, rng);
						return {
							subject: fill("-{discount}% sur une sélection d'articles", { discount }),
							paragraphs: [
								fill("Profitez de <strong>-{discount}%</strong> sur une sélection d'articles jusqu'à dimanche minuit.", { discount }),
								"L'offre est automatiquement appliquée au moment du paiement."
							]
						};
					},
					(rng) => {
						const game = pick(["Factorio", "Cities: Skylines II", "Kerbal Space Program", "Portal 2", "Hades II"], rng);
						return {
							subject: fill("{game} est maintenant disponible dans votre bibliothèque", { game }),
							paragraphs: [
								fill("<strong>{game}</strong> a été ajouté à votre bibliothèque suite à votre achat.", { game }),
								"Lancez le client pour commencer le téléchargement."
							]
						};
					}
				]
			},
			{
				id: "recruiting",
				senders: [
					{ name: "LinkedIn", address: "jobs-noreply@linkedin.com" },
					{ name: "Indeed", address: "noreply@indeed.com" },
					{ name: "WelcomeToTheJungle", address: "hello@welcometothejungle.com" }
				],
				closings: [
					"Cette offre correspond à votre profil et vos recherches récentes.",
					"Vous pouvez postuler directement en un clic depuis l'application.",
					"Modifiez vos préférences de recherche à tout moment depuis votre profil."
				],
				scenarios: [
					(rng) => {
						const role = pick(["Ingénieur Simulation Numérique", "Développeur Python Scientifique", "Data Scientist Junior", "Ingénieur Recherche & Développement"], rng);
						const company = pick(["CNES", "CEA", "Thales", "Dassault Systèmes", "Onera"], rng);
						return {
							subject: fill("Nouvelle offre : {role} chez {company}", { role, company }),
							paragraphs: [
								fill("Une nouvelle offre correspondant à votre profil vient d'être publiée : <strong>{role}</strong> chez {company}.", { role, company }),
								"Consultez la fiche de poste complète et postulez directement en ligne."
							]
						};
					},
					(rng) => {
						const views = pickInt(3, 28, rng);
						return {
							subject: "Votre profil a été consulté récemment",
							paragraphs: [
								fill("Votre profil a été consulté {views} fois cette semaine par des recruteurs.", { views }),
								"Mettez à jour vos compétences pour augmenter votre visibilité."
							]
						};
					}
				]
			},
			{
				id: "cloudQuota",
				senders: [
					{ name: "Google One", address: "no-reply@google.com" },
					{ name: "iCloud", address: "no_reply@email.apple.com" },
					{ name: "Proton Mail", address: "no-reply@proton.me" }
				],
				closings: [
					"Gérez votre stockage à tout moment depuis les paramètres de votre compte.",
					"Ce message est envoyé automatiquement lorsque le seuil est atteint.",
					"Passez à un forfait supérieur pour éviter toute interruption de service."
				],
				scenarios: [
					(rng) => {
						const percent = pickInt(80, 98, rng);
						return {
							subject: fill("Votre espace de stockage est utilisé à {percent}%", { percent }),
							paragraphs: [
								fill("Votre espace de stockage est actuellement utilisé à <strong>{percent}%</strong> de sa capacité.", { percent }),
								"Libérez de l'espace ou augmentez votre quota pour continuer à recevoir des messages et sauvegarder vos fichiers."
							]
						};
					},
					(rng) => {
						return {
							subject: "Votre sauvegarde automatique a échoué",
							paragraphs: [
								"La dernière tentative de sauvegarde automatique n'a pas pu être réalisée par manque d'espace disponible.",
								"Une nouvelle tentative sera effectuée automatiquement dans 24 heures."
							]
						};
					}
				]
			}
		];

		const rng = mulberry32(djb2(`daily-mail::${dateKey}`));
		const category = pick(categories, rng);
		const sender = pick(category.senders, rng);
		const scenario = pick(category.scenarios, rng);
		const result = scenario(rng);
		const closing = pick(category.closings, rng);

		const bodyHtml = result.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join("\n\t\t\t\t") + `\n\t\t\t\t<p>${closing}</p>`;

		return {
			from: sender.name,
			fromAddress: sender.address,
			subject: result.subject,
			body: bodyHtml
		};
	}
};
