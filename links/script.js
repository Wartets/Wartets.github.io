document.addEventListener('DOMContentLoaded', () => {
	const internalPages = [
		{ name: 'Home', url: 'https://wartets.github.io/' },
		{ name: 'Projects', url: 'https://wartets.github.io/projects/' },
		{ name: 'Library', url: 'https://wartets.github.io/library/' },
		{ name: "Thought's Library", url: 'https://wartets.github.io/poetry/' },
		{ name: 'Music', url: 'https://wartets.github.io/music/' },
		{ name: 'Desk', url: 'https://wartets.github.io/desk/' }
	];

	const socialLinks = [
		{ name: 'GitHub', url: 'https://github.com/Wartets' },
		{ name: 'LinkedIn', url: 'https://linkedin.com/in/colin-bossu' },
		{ name: 'YouTube', url: 'https://youtube.com/@wartets' },
		{ name: 'YouTube Music', url: 'https://www.youtube.com/@Wartets' },
		{ name: 'SoundCloud', url: 'https://soundcloud.com/wartets' }
	];

	const internalList = document.getElementById('internal-links');
	internalPages.forEach(page => {
		const li = document.createElement('li');
		const a = document.createElement('a');
		a.href = page.url;
		a.textContent = page.name;
		li.appendChild(a);
		internalList.appendChild(li);
	});

	const socialList = document.getElementById('social-links');
	socialLinks.forEach(link => {
		const li = document.createElement('li');
		const a = document.createElement('a');
		a.href = link.url;
		a.target = '_blank';
		a.rel = 'noopener noreferrer';
		a.textContent = link.name;
		li.appendChild(a);
		socialList.appendChild(li);
	});

	const projectList = document.getElementById('project-links');
	if (typeof projects !== 'undefined') {
		const seen = new Set();
		projects.flat().forEach(project => {
			if (!project || !project.title || seen.has(project.title)) return;
			seen.add(project.title);

			const li = document.createElement('li');
			li.textContent = project.title;

			if (project.link) {
				li.appendChild(document.createTextNode(' '));
				const a = document.createElement('a');
				a.href = project.link;
				a.target = '_blank';
				a.rel = 'noopener noreferrer';
				a.textContent = project.link.replace(/^https?:\/\//, '');
				li.appendChild(a);
			}

			if (project.github) {
				const span = document.createElement('span');
				span.className = 'label';
				const a = document.createElement('a');
				a.href = project.github;
				a.target = '_blank';
				a.rel = 'noopener noreferrer';
				a.textContent = 'GitHub';
				span.appendChild(a);
				li.appendChild(span);
			}

			projectList.appendChild(li);
		});
	}
});
