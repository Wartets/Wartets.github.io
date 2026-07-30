const fs = require('fs');
const path = require('path');

const [, , slug, titleFr, titleEn, mdPathFr, mdPathEn] = process.argv;

if (!slug || !mdPathFr || !mdPathEn) {
	console.error('Usage: node tools/generate-context-page.js <slug> "Titre FR" "Title EN" <markdown_fr_path> <markdown_en_path>');
	process.exit(1);
}

const templatePath = path.join(__dirname, '..', 'contexts_pages', '_template.html');
const template = fs.readFileSync(templatePath, 'utf-8');

function escapeForScriptTag(content) {
	return content.replace(/<\/script>/gi, '<\\/script>');
}

function write(lang, title, mdPath) {
	const outputPath = path.join(__dirname, '..', 'contexts_pages', `${slug}_${lang}.html`);
	const markdownContent = fs.readFileSync(mdPath, 'utf-8');
	const content = template
		.replace('lang="fr"', () => `lang="${lang}"`)
		.replace(/Context Title/g, () => title)
		.replace('Detailed content of the context.', () => escapeForScriptTag(markdownContent));
	fs.writeFileSync(outputPath, content, 'utf-8');
	console.log(`Generated : ${outputPath}`);
}

write('fr', titleFr || slug, mdPathFr);
write('en', titleEn || slug, mdPathEn);
