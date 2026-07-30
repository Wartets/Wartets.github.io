const fs = require('fs');
const path = require('path');

const [, , slug, titleFr, titleEn] = process.argv;

if (!slug) {
	console.error('Usage: node tools/generate-context-page.js <slug> "Titre FR" "Title EN"');
	process.exit(1);
}

const templatePath = path.join(__dirname, '..', 'contexts_pages', '_template.html');
const template = fs.readFileSync(templatePath, 'utf-8');

function write(lang, title) {
	const outputPath = path.join(__dirname, '..', 'contexts_pages', `${slug}_${lang}.html`);
	const content = template
		.replace('lang="fr"', `lang="${lang}"`)
		.replace(/Context Title/g, title);
	fs.writeFileSync(outputPath, content, 'utf-8');
	console.log(`Generated : ${outputPath}`);
}

write('fr', titleFr || slug);
write('en', titleEn || slug);
