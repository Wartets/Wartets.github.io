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
			body: "<p>A new device has logged into your account. If this was not you, please secure your account immediately.</p>"
		},
		{
			id: 3,
			folder: "Inbox",
			from: "SoundCloud",
			fromAddress: "no-reply@soundcloud.com",
			subject: "Your weekly stats are here",
			date: "2024-05-18 08:45",
			body: "<p>You got 1,234 plays this week! Keep up the great work.</p>"
		},
		{
			id: 100,
			folder: "Spam",
			from: "Milfeuille.com",
			fromAddress: "newsletter@milfeuille.com",
			subject: "Rencontrez votre douceur parfaite",
			date: "2026-02-19 09:12",
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

	senderPool: [
		{ name: "GitHub", address: "notifications@github.com" },
		{ name: "SoundCloud", address: "no-reply@soundcloud.com" },
		{ name: "YouTube", address: "no-reply@youtube.com" },
		{ name: "Université Paris Cité", address: "scolarite@u-paris.fr" },
		{ name: "Phisis Association", address: "contact@phisis-asso.fr" },
		{ name: "Overleaf", address: "notifications@overleaf.com" },
		{ name: "Steam", address: "noreply@steampowered.com" },
		{ name: "LinkedIn", address: "messages-noreply@linkedin.com" },
		{ name: "arXiv", address: "no-reply@arxiv.org" },
		{ name: "Google Drive", address: "drive-shares-noreply@google.com" },
		{ name: "Docker Hub", address: "noreply@docker.com" },
		{ name: "npm", address: "support@npmjs.com" },
		{ name: "Windows Update", address: "update@microsoft.com" },
		{ name: "Météo France", address: "alerts@meteo-france.fr" },
		{ name: "CNRS Newsletter", address: "newsletter@cnrs.fr" },
        { name: "Mozilla", address: "newsletter@mozilla.org" },
        { name: "Stack Overflow", address: "noreply@stackoverflow.com" },
        { name: "GitLab", address: "notifications@gitlab.com" },
        { name: "Microsoft", address: "account-security@microsoft.com" },
        { name: "Google", address: "accounts-noreply@google.com" },
        { name: "Google Calendar", address: "calendar-notification@google.com" },
        { name: "Discord", address: "noreply@discord.com" },
        { name: "Reddit", address: "notifications@reddit.com" },
        { name: "Medium", address: "hello@medium.com" },
        { name: "Notion", address: "team@notion.so" },
        { name: "Figma", address: "notifications@figma.com" },
        { name: "Vercel", address: "notifications@vercel.com" },
        { name: "Netlify", address: "notifications@netlify.com" },
        { name: "Cloudflare", address: "notifications@cloudflare.com" },
        { name: "Trello", address: "noreply@trello.com" },
        { name: "Slack", address: "team@slack.com" },
        { name: "Dropbox", address: "no-reply@dropbox.com" },
        { name: "ResearchGate", address: "updates@researchgate.net" },
        { name: "Nature", address: "alerts@nature.com" },
        { name: "ScienceDirect", address: "alerts@sciencedirect.com" },
        { name: "IEEE", address: "noreply@ieee.org" },
        { name: "Springer", address: "alerts@springernature.com" },
        { name: "ESA", address: "news@esa.int" },
        { name: "NASA", address: "nasa@newsletters.nasa.gov" },
        { name: "Python", address: "python-dev@python.org" },
        { name: "Rust", address: "notifications@rust-lang.org" },
        { name: "Ubuntu", address: "newsletter@ubuntu.com" },
        { name: "Debian", address: "news@debian.org" },
        { name: "Arch Linux", address: "newsletter@archlinux.org" },
        { name: "Kaggle", address: "notifications@kaggle.com" }
	],

	topicPool: [
		"the Lenia GPU Simulator repository", "the physics seminar", "your repository",
		"quantum computing resources", "the Phisis association meeting", "your cloud storage",
		"the N-Body simulation project", "your open-source contributions", "your recent upload",
		"the upcoming conference", "your Turbulence Simulation build", "your document library",
		"the TikZ Generator issue tracker", "your account settings", "the weekly newsletter",
        "the Lenia cellular automaton", "the GPU benchmark results", "the CUDA implementation",
        "the N-Body simulation", "the Barnes-Hut algorithm", "the fluid dynamics experiment",
        "the Navier-Stokes project", "the particle simulator", "the TikZ Generator",
        "the LaTeX document", "the physics seminar", "the mathematics department", 
        "the research notebook", "the numerical methods project", "the scientific computing environment",
        "the Python package", "the Rust simulation engine", "the Docker container",
        "the GitHub repository", "the GitLab project", "the CI pipeline",
        "the latest commit", "the open-source project", "the documentation website",
        "the portfolio website", "the personal homepage", "the university account",
        "the student portal", "the research group", "the upcoming conference",
        "the summer workshop", "the weekly meeting", "the association meeting",
        "the cloud storage", "the shared document", "the project bibliography",
        "the Overleaf workspace", "the latest paper", "the arXiv search",
        "the research digest", "the security settings", "the account activity",
        "the authentication system", "the notification preferences", "the weekly statistics",
        "the latest upload", "the media library", "the development environment",
        "the package registry", "the dependency tree", "the container registry",
        "the server configuration"
	],

	subjectTemplates: [
		"{count} new notifications regarding {topic}",
		"Your weekly digest is ready",
		"Action required: {topic}",
		"New comment on {topic}",
		"Reminder: {topic} deadline approaching",
		"{topic} - system update available",
		"Your report on {topic} is ready to view",
		"Security notice regarding your account",
		"Invitation: collaborate on {topic}",
		"Your subscription related to {topic} has been renewed",
        "{count} new events detected in {topic}",
        "New activity detected: {topic}",
        "Update available for {topic}",
        "Status report: {topic}",
        "Daily summary: {topic}",
        "Weekly report concerning {topic}",
        "New activity on {topic}",
        "Someone commented on {topic}",
        "Someone mentioned you in {topic}",
        "Review requested: {topic}",
        "Your attention is needed: {topic}",
        "Task update: {topic}",
        "Reminder: review {topic}",
        "Reminder: {topic}",
        "Important information about {topic}",
        "New document related to {topic}",
        "New version available: {topic}",
        "Build completed: {topic}",
        "Build failed: {topic}",
        "Deployment notification: {topic}",
        "Security notification: {topic}",
        "Account activity: {topic}",
        "New collaboration request: {topic}",
        "Invitation to {topic}",
        "Your {topic} digest",
        "Monthly summary: {topic}",
        "Automatic notification: {topic}",
        "System notification: {topic}",
        "Activity summary for {topic}",
        "Changes detected in {topic}",
	],

	bodyIntros: [
		"We wanted to let you know about some recent activity related to {topic}.",
		"Here is a short summary concerning {sender} and {topic}.",
		"This is an automated message regarding {topic}.",
		"Your attention is requested for an update involving {topic}.",
		"A new event has been recorded that concerns {topic}.",
        "A recent change has been detected concerning {topic}.",
        "Your account has received new activity related to {topic}.",
        "The system has generated a new notification concerning {topic}.",
        "There has been an update involving {topic}.",
        "A new event has been registered for {topic}.",
        "Several changes have been detected in {topic}.",
        "The latest activity concerning {topic} is now available.",
        "A new update has been generated automatically for {topic}.",
        "Your latest activity concerning {topic} has been processed.",
        "The system has finished processing the latest information about {topic}.",
        "A new item has been added to {topic}.",
        "Your recent activity has triggered a notification concerning {topic}.",
        "New information has become available concerning {topic}.",
        "The latest status information for {topic} is now available.",
        "A new automated report concerning {topic} has been generated.",
	],

	bodyClosings: [
		"You can review the full details by logging into your account.",
		"No further action is required at this time.",
		"Thank you for continuing to use our services.",
		"Feel free to reach out if you have any questions.",
		"This message was sent automatically and does not require a reply.",
        "You can open the corresponding application to view additional information.",
        "The information will remain available in your account.",
        "You do not need to respond to this automated notification.",
        "Please review the information when convenient.",
        "This notification was generated automatically.",
        "The current status can be checked from your dashboard.",
        "Additional details may be available in the associated project.",
        "Your existing preferences have not been modified.",
        "No immediate action is required.",
        "The system will continue monitoring for new activity.",
        "Thank you for your attention.",
        "This message is part of your regular activity summary.",
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

		const rng = mulberry32(djb2(`daily-mail::${dateKey}`));
		const sender = pick(window.mailData.senderPool, rng);
		const topic = pick(window.mailData.topicPool, rng);
		const subjectTemplate = pick(window.mailData.subjectTemplates, rng);
		const count = 1 + Math.floor(rng() * 12);

		const subject = subjectTemplate
			.replace("{count}", String(count))
			.replace("{sender}", sender.name)
			.replace("{topic}", topic);

		const introA = pick(window.mailData.bodyIntros, rng).replace("{topic}", topic).replace("{sender}", sender.name);
		const introB = pick(window.mailData.bodyIntros, rng).replace("{topic}", topic).replace("{sender}", sender.name);
		const closing = pick(window.mailData.bodyClosings, rng);

		const body = `
			<p>${introA}</p>
			<p>${introB}</p>
			<p>${closing}</p>
		`;

		return {
			from: sender.name,
			fromAddress: sender.address,
			subject,
			body
		};
	}
};
