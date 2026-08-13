function applyStagger(container) {
	if (!container) return;
	Array.from(container.children).forEach((item, index) => {
		item.style.animationDelay = `${Math.min(index, 24) * 35}ms`;
	});
}

function loadScriptOnce(src) {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.src = src;
		script.onload = () => resolve();
		script.onerror = () => reject(new Error(`Failed to load ${src}`));
		document.body.appendChild(script);
	});
}

document.addEventListener('DOMContentLoaded', () => {
	const internalPages = [
		{ name: 'Home', url: '../' },
		{ name: 'Projects', url: '../projects/' },
		{ name: 'Library', url: '../library/' },
		{ name: "Thought's Library", url: '../poetry/' },
		{ name: 'Music', url: '../music/' },
		{ name: 'Desk', url: '../desk/' },
		{ name: '404', url: '../404.html' },
		{ name: 'Offline', url: '../offline.html' }
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
	applyStagger(internalList);

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
	applyStagger(socialList);

	function resolveLocalizedText(value, fallbackLang) {
		if (value === null || value === undefined) return '';
		if (typeof value === 'string') return value;
		const lang = fallbackLang || 'en';
		return value[lang] || value.en || value.fr || Object.values(value)[0] || '';
	}

	const projectList = document.getElementById('project-links');
	if (typeof projects !== 'undefined') {
		const seen = new Set();
		projects.flat().forEach(project => {
			if (!project) return;
			const title = resolveLocalizedText(project.title);
			if (!title || seen.has(title)) return;
			seen.add(title);

			const li = document.createElement('li');
			li.textContent = title;

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
	applyStagger(projectList);

	const pdfLibraryData = window.libraryData;
	const pdfList = document.getElementById('pdf-links');
	if (pdfList && pdfLibraryData && Array.isArray(pdfLibraryData.documents)) {
		const documents = pdfLibraryData.documents
			.filter(doc => doc && doc.show !== false && doc.filePath)
			.slice()
			.sort((a, b) => {
				const tsA = Array.isArray(a.timestamp) ? a.timestamp[0] : a.timestamp;
				const tsB = Array.isArray(b.timestamp) ? b.timestamp[0] : b.timestamp;
				return new Date(tsB || 0) - new Date(tsA || 0);
			});

		documents.forEach(doc => {
			const li = document.createElement('li');
			li.textContent = resolveLocalizedText(doc.title) || doc.filePath.split('/').pop();
			li.appendChild(document.createTextNode(' '));

			const a = document.createElement('a');
			a.href = doc.filePath;
			a.target = '_blank';
			a.rel = 'noopener noreferrer';
			a.textContent = 'PDF';
			li.appendChild(a);

			pdfList.appendChild(li);
		});
	}
	applyStagger(pdfList);

	const poemList = document.getElementById('poem-links');
	if (poemList) {
		loadScriptOnce('../data/poetry.js').then(() => {
			const poemLibraryData = window.libraryData;
			window.libraryData = pdfLibraryData;

			if (poemLibraryData && Array.isArray(poemLibraryData.documents)) {
				const poems = poemLibraryData.documents
					.filter(doc => doc && doc.filePath)
					.slice()
					.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

				poems.forEach(poem => {
					const li = document.createElement('li');
					li.textContent = resolveLocalizedText(poem.title) || poem.filePath.split('/').pop();
					li.appendChild(document.createTextNode(' '));

					const a = document.createElement('a');
					a.href = poem.filePath;
					a.target = '_blank';
					a.rel = 'noopener noreferrer';
					a.textContent = 'TXT';
					li.appendChild(a);

					poemList.appendChild(li);
				});
			}
			applyStagger(poemList);
		}).catch(() => {
			window.libraryData = pdfLibraryData;
		});
	}
});
