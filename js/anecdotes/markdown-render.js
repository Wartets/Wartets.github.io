const MATH_TOKEN_PREFIX = '@@MATH_TOKEN_';

const KATEX_MACROS = {
	'\\ket': '\\left|#1\\right\\rangle',
	'\\bra': '\\left\\langle#1\\right|',
	'\\pd': '\\frac{\\partial #1}{\\partial #2}'
};

let katexAssetsPromise = null;

function injectKatexAssets() {
	if (katexAssetsPromise) return katexAssetsPromise;
	katexAssetsPromise = new Promise((resolve, reject) => {
		if (!document.querySelector('link[data-katex-style]')) {
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css';
			link.setAttribute('data-katex-style', 'true');
			document.head.appendChild(link);
		}
		if (window.katex) {
			resolve();
			return;
		}
		const script = document.createElement('script');
		script.src = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js';
		script.onload = resolve;
		script.onerror = reject;
		document.head.appendChild(script);
	});
	return katexAssetsPromise;
}

function extractMathTokens(text) {
	const tokens = [];
	const pattern = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\$([^\$\n]+?)\$|\\\(([\s\S]+?)\\\)/g;
	const tokenized = text.replace(pattern, (match, display1, display2, inline1, inline2) => {
		const isDisplay = display1 !== undefined || display2 !== undefined;
		const expression = display1 ?? display2 ?? inline1 ?? inline2;
		const token = `${MATH_TOKEN_PREFIX}${tokens.length}@@`;
		tokens.push({ expression, isDisplay });
		return token;
	});
	return { tokenized, tokens };
}

function reinjectMathTokens(html, tokens) {
	return tokens.reduce((acc, token, index) => {
		const placeholder = `${MATH_TOKEN_PREFIX}${index}@@`;
		let rendered;
		try {
			rendered = window.katex.renderToString(token.expression, {
				displayMode: token.isDisplay,
				throwOnError: false,
				macros: KATEX_MACROS
			});
		} catch (error) {
			rendered = token.expression;
		}
		return acc.split(placeholder).join(rendered);
	}, html);
}

export function containsMath(text) {
	return /\$\$|\\\[|\\\(|\$[^\$\n]+\$/.test(text);
}

export async function renderMarkdownWithMath(rawText) {
	const needsMath = containsMath(rawText);
	if (needsMath) await injectKatexAssets();

	const { tokenized, tokens } = extractMathTokens(rawText);
	const parsedHtml = window.marked ? window.marked.parse(tokenized) : tokenized;
	const withMath = needsMath ? reinjectMathTokens(parsedHtml, tokens) : parsedHtml;

	const purifyConfig = {
		ADD_TAGS: ['math', 'annotation', 'semantics', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub'],
		ADD_ATTR: ['class', 'style', 'aria-hidden']
	};
	return window.DOMPurify ? window.DOMPurify.sanitize(withMath, purifyConfig) : withMath;
}

export async function ensureMarkdownAssets() {
	const tasks = [];
	if (!window.marked) {
		tasks.push(new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = 'https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.6/marked.min.js';
			script.onload = resolve;
			script.onerror = reject;
			document.head.appendChild(script);
		}));
	}
	if (!window.DOMPurify) {
		tasks.push(new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = 'https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js';
			script.onload = resolve;
			script.onerror = reject;
			document.head.appendChild(script);
		}));
	}
	await Promise.all(tasks);
}
