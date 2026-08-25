(function () {
    'use strict';

    const allNodesMap = new Map();
    const inboundConnections = new Map();
    const outboundConnections = new Map();
    const searchIndexMap = new Map();
    const discoveredTrees = new Set();
    const discoveredMoods = new Set();

    let networkInstance = null;
    let isPhysicsEnabled = true;
    let isHierarchical = false;
    let currentScope = 'FULL';
    let selectedNodeId = null;
    let dataSetNodes = null;
    let dataSetEdges = null;
    let searchDebounceTimer = null;
    let isGenerating = false;

    function hslToHex(h, s, l) {
        s /= 100;
        l /= 100;
        const k = n => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
        return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
    }

    function getContrastTextColor(hexColor) {
        const c = hexColor.replace('#', '');
        const r = parseInt(c.substring(0, 2), 16) / 255;
        const g = parseInt(c.substring(2, 4), 16) / 255;
        const b = parseInt(c.substring(4, 6), 16) / 255;
        const luminance = 0.2126 * (r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4))
            + 0.7152 * (g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4))
            + 0.0722 * (b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4));
        return luminance > 0.36 ? '#0f172a' : '#ffffff';
    }

    function getDarkenedBorderColor(hexColor, factor = 0.72) {
        const c = hexColor.replace('#', '');
        const r = Math.max(0, Math.floor(parseInt(c.substring(0, 2), 16) * factor));
        const g = Math.max(0, Math.floor(parseInt(c.substring(2, 4), 16) * factor));
        const b = Math.max(0, Math.floor(parseInt(c.substring(4, 6), 16) * factor));
        const toHex = x => x.toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    const dynamicColorCache = new Map();

    function generateXpColor(seedKey, salt = 0) {
        const cacheKey = `${seedKey}_${salt}`;
        if (dynamicColorCache.has(cacheKey)) return dynamicColorCache.get(cacheKey);

        let hash = 0;
        const str = String(seedKey || 'default') + String(salt);
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }

        const hue = Math.abs(hash * 137.508) % 360;
        const sat = 48 + (Math.abs(hash) % 20);
        const light = 44 + (Math.abs(hash >> 3) % 14);
        const hex = hslToHex(hue, sat, light);
        dynamicColorCache.set(cacheKey, hex);
        return hex;
    }

    function createHarmoniousPaletteEntry(bgHex, customLabel = null) {
        const border = getDarkenedBorderColor(bgHex);
        const text = getContrastTextColor(bgHex);
        return { bg: bgHex, border, text, badge: bgHex, label: customLabel };
    }

    const MOOD_PALETTE = {
        OPTIMISTIC: createHarmoniousPaletteEntry('#22c55e', 'Optimistic'),
        EUPHORIC: createHarmoniousPaletteEntry('#10b981', 'Euphoric'),
        EXISTENTIAL: createHarmoniousPaletteEntry('#8b5cf6', 'Existential'),
        PHILOSOPHICAL: createHarmoniousPaletteEntry('#a855f7', 'Philosophical'),
        ZEN: createHarmoniousPaletteEntry('#0284c7', 'Zen & Balanced'),
        MELANCHOLIC: createHarmoniousPaletteEntry('#64748b', 'Melancholic'),
        ANALYTICAL: createHarmoniousPaletteEntry('#2563eb', 'Analytical'),
        PLAYFUL: createHarmoniousPaletteEntry('#f59e0b', 'Playful'),
        SARCASTIC: createHarmoniousPaletteEntry('#f43f5e', 'Sarcastic'),
        CYNICAL: createHarmoniousPaletteEntry('#e11d48', 'Cynical'),
        ENRAGED: createHarmoniousPaletteEntry('#dc2626', 'Enraged'),
        FATIGUED: createHarmoniousPaletteEntry('#78716c', 'Fatigued'),
        NOSTALGIC: createHarmoniousPaletteEntry('#0284c7', 'Nostalgic'),
        GLITCHED: createHarmoniousPaletteEntry('#991b1b', 'Glitched'),
        DELTARUNE: { bg: '#0f172a', border: '#38bdf8', text: '#ffffff', badge: '#0f172a', label: 'Deltarune / Mystery' },
        PIRATE: createHarmoniousPaletteEntry('#d97706', 'Pirate Mode'),
        ARCHAIC: createHarmoniousPaletteEntry('#b45309', 'Archaic Script'),
        PARANOID: createHarmoniousPaletteEntry('#ea580c', 'Paranoid'),
        DRAMA: createHarmoniousPaletteEntry('#c026d3', 'Dramatic'),
        OFFENDED: createHarmoniousPaletteEntry('#e11d48', 'Offended'),
        DEFAULT: createHarmoniousPaletteEntry('#eab308', 'Standard Dialogue')
    };

    function getMoodPaletteEntry(moodName) {
        const m = String(moodName || 'DEFAULT').toUpperCase();
        if (MOOD_PALETTE[m]) return MOOD_PALETTE[m];
        const autoBg = generateXpColor(m, 1);
        MOOD_PALETTE[m] = createHarmoniousPaletteEntry(autoBg, m);
        return MOOD_PALETTE[m];
    }

    const DOMAIN_PALETTE = {
        MATHEMATICS: createHarmoniousPaletteEntry('#2563eb', 'Mathematics & Analysis'),
        PHYSICS: createHarmoniousPaletteEntry('#7c3aed', 'Physics & Constants'),
        TECHNOLOGY: createHarmoniousPaletteEntry('#0284c7', 'Tech & Architecture'),
        PHILOSOPHY: createHarmoniousPaletteEntry('#9333ea', 'Philosophy & Mind'),
        LIFESTYLE: createHarmoniousPaletteEntry('#16a34a', 'Daily Habits & Focus'),
        GAMES: createHarmoniousPaletteEntry('#ea580c', 'Activities & Games'),
        SYSTEM: createHarmoniousPaletteEntry('#475569', 'System Diagnostics'),
        NARRATIVE: { bg: '#0f172a', border: '#38bdf8', text: '#ffffff', badge: '#0f172a', label: 'Narrative & Mystery' },
        CONFLICT: createHarmoniousPaletteEntry('#dc2626', 'Banter & Friction'),
        GENERAL: createHarmoniousPaletteEntry('#ca8a04', 'General Dialogue')
    };

    const COMPLEXITY_PALETTE = {
        ACADEMIC: createHarmoniousPaletteEntry('#7c3aed', 'Academic & Formal'),
        TECHNICAL: createHarmoniousPaletteEntry('#2563eb', 'Technical & Systems'),
        STANDARD: createHarmoniousPaletteEntry('#0284c7', 'Standard Dialogue'),
        CASUAL: createHarmoniousPaletteEntry('#16a34a', 'Casual & Brief')
    };

    const EDGE_CATEGORY_COLORS = {
        AGREE: '#16a34a',
        INQUIRE: '#2563eb',
        PHILOSOPHICAL: '#8b5cf6',
        PROVOKE: '#dc2626',
        APOLOGY: '#0d9488',
        ZEN: '#0284c7',
        PLAYFUL: '#d97706',
        SERIOUS: '#475569',
        JOKE: '#ea580c',
        INDIFFERENT: '#64748b',
        ACTION: '#0284c7',
        DEFAULT: '#64748b'
    };

    const STORAGE_KEY_POS_ORGANIC = 'clippy_graph_pos_organic_v3';
    const STORAGE_KEY_POS_HIERARCHICAL = 'clippy_graph_pos_hierarchical_v3';

    const positionsMemoryCache = {
        organic: new Map(),
        hierarchical: new Map()
    };

    function loadStoredPositions(mode) {
        try {
            const key = mode === 'hierarchical' ? STORAGE_KEY_POS_HIERARCHICAL : STORAGE_KEY_POS_ORGANIC;
            const raw = window.DeskStorage ? window.DeskStorage.getItem(key) : localStorage.getItem(key);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
                const targetMap = mode === 'hierarchical' ? positionsMemoryCache.hierarchical : positionsMemoryCache.organic;
                for (const [id, coords] of Object.entries(parsed)) {
                    if (Array.isArray(coords) && coords.length === 2) {
                        targetMap.set(id, { x: coords[0], y: coords[1] });
                    }
                }
            }
        } catch (e) {}
    }

    function saveCurrentPositions(mode) {
        if (!networkInstance) return;
        try {
            const posObj = networkInstance.getPositions();
            const targetMap = mode === 'hierarchical' ? positionsMemoryCache.hierarchical : positionsMemoryCache.organic;
            const compactObj = {};
            for (const id in posObj) {
                const p = posObj[id];
                if (p && typeof p.x === 'number' && typeof p.y === 'number') {
                    const roundX = Math.round(p.x);
                    const roundY = Math.round(p.y);
                    targetMap.set(id, { x: roundX, y: roundY });
                    compactObj[id] = [roundX, roundY];
                }
            }
            const key = mode === 'hierarchical' ? STORAGE_KEY_POS_HIERARCHICAL : STORAGE_KEY_POS_ORGANIC;
            const payload = JSON.stringify(compactObj);
            if (window.DeskStorage) window.DeskStorage.setItem(key, payload);
            else localStorage.setItem(key, payload);
        } catch (e) {}
    }

    function escapeHtml(str) {
        return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function parseMarkdownToHtml(text) {
        if (!text || typeof text !== 'string') return '';
        let html = escapeHtml(text);
        html = html.replace(/\$\$([\s\S]*?)\$\$/g, (m, math) => {
            if (window.katex) {
                try {
                    return window.katex.renderToString(math.trim(), { displayMode: true, throwOnError: false });
                } catch (e) {}
            }
            return `<div style="text-align:center;margin:4px 0;"><code>$$${math}$$</code></div>`;
        });
        html = html.replace(/\$([^\$\n]+?)\$/g, (m, math) => {
            if (window.katex) {
                try {
                    return window.katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
                } catch (e) {}
            }
            return `<code>$${math}$</code>`;
        });
        html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');
        html = html.replace(/\n\n/g, '<br><br>');
        html = html.replace(/\n/g, '<br>');
        return html;
    }

    function extractNodeMood(node) {
        if (node.mood) {
            return String(node.mood).toUpperCase();
        }
        if (node.derivedMood) {
            return String(node.derivedMood).toUpperCase();
        }
        if (node.moodDelta && node.moodDelta.mood) {
            const m = Array.isArray(node.moodDelta.mood) ? node.moodDelta.mood[0] : node.moodDelta.mood;
            return String(m).toUpperCase();
        }
        if (node.conditions) {
            if (Array.isArray(node.conditions.moods) && node.conditions.moods.length > 0) return String(node.conditions.moods[0]).toUpperCase();
            if (typeof node.conditions.mood === 'string') return String(node.conditions.mood).toUpperCase();
        }
        if (node.criteria) {
            if (Array.isArray(node.criteria.moods) && node.criteria.moods.length > 0) return String(node.criteria.moods[0]).toUpperCase();
            if (typeof node.criteria.mood === 'string') return String(node.criteria.mood).toUpperCase();
        }
        if (Array.isArray(node.responses)) {
            for (const resp of node.responses) {
                if (resp && resp.conditions && Array.isArray(resp.conditions.moods) && resp.conditions.moods.length > 0) {
                    return String(resp.conditions.moods[0]).toUpperCase();
                }
            }
        }
        if (Array.isArray(node.options)) {
            for (const opt of node.options) {
                if (opt && opt.moodDelta && opt.moodDelta.mood) {
                    return String(opt.moodDelta.mood).toUpperCase();
                }
            }
        }
        return 'OPTIMISTIC';
    }

    function registerNodeInIndex(id, node, sourceTree) {
        const mood = extractNodeMood(node);
        discoveredMoods.add(mood);

        let primaryText = '';
        if (typeof node.text === 'string') {
            primaryText = node.text;
        } else if (Array.isArray(node.responses) && node.responses.length > 0) {
            primaryText = node.responses.map(r => (typeof r === 'string' ? r : (r.text || ''))).join(' ');
        }

        let optionsText = '';
        if (Array.isArray(node.options)) {
            optionsText = node.options.map(o => `${o.label || ''} ${o.next || o.targetNode || ''} ${o.category || ''}`).join(' ');
        }

        const isRoot = (id === 'N001' || id === 'greeting_root' || id.endsWith('_root'));
        const isTerminal = (!node.options || node.options.length === 0);
        const hasAction = !!node.actionTrigger;

        const pal = MOOD_PALETTE[mood] || MOOD_PALETTE.DEFAULT;
        let colors = { background: pal.bg, border: pal.border, font: pal.text };

        if (isRoot) {
            colors = { background: '#22c55e', border: '#14532d', font: '#ffffff' };
        } else if (isTerminal) {
            colors = { background: '#0284c7', border: '#0c4a6e', font: '#ffffff' };
        } else if (hasAction) {
            colors = { background: pal.bg, border: '#ffffff', font: pal.text };
        }

        const snippet = primaryText ? primaryText.replace(/\s+/g, ' ').substring(0, 24) : '';
        const label = snippet ? `${id}\n${snippet}...` : id;

        const searchCorpus = `${id} ${primaryText} ${optionsText} ${mood} ${sourceTree} ${node.actionTrigger || ''}`.toLowerCase();

        const enrichedNode = {
            ...node,
            id,
            sourceTree,
            derivedMood: mood,
            searchCorpus,
            cachedLabel: label,
            cachedColors: colors
        };

        allNodesMap.set(id, enrichedNode);

        const terms = searchCorpus.split(/\s+/).filter(t => t.length > 1);
        terms.forEach(t => {
            if (!searchIndexMap.has(t)) searchIndexMap.set(t, []);
            searchIndexMap.get(t).push(id);
        });
    }

    function buildAdjacencyMaps() {
        inboundConnections.clear();
        outboundConnections.clear();

        for (const [id, node] of allNodesMap.entries()) {
            if (!inboundConnections.has(id)) inboundConnections.set(id, []);
            if (!outboundConnections.has(id)) outboundConnections.set(id, []);

            if (Array.isArray(node.options)) {
                node.options.forEach(opt => {
                    const target = opt.next || opt.targetNode;
                    if (target) {
                        outboundConnections.get(id).push(target);
                        if (!inboundConnections.has(target)) inboundConnections.set(target, []);
                        inboundConnections.get(target).push({ fromId: id, label: opt.label || '' });
                    }
                });
            }
        }
    }

    function computeTopologicalLevels() {
        const levels = new Map();
        const adj = new Map();

        for (const id of allNodesMap.keys()) {
            adj.set(id, []);
        }

        for (const [id, node] of allNodesMap.entries()) {
            if (Array.isArray(node.options)) {
                for (const opt of node.options) {
                    const target = opt.next || opt.targetNode;
                    if (target && allNodesMap.has(target) && target !== id) {
                        adj.get(id).push(target);
                    }
                }
            }
        }

        const roots = [];
        for (const id of allNodesMap.keys()) {
            const inb = (inboundConnections.get(id) || []).length;
            if (inb === 0 || id === 'greeting_root' || id === 'N001' || id.endsWith('_root')) {
                roots.push(id);
            }
        }

        if (roots.length === 0 && allNodesMap.size > 0) {
            roots.push(allNodesMap.keys().next().value);
        }

        const queue = [];
        roots.forEach(r => {
            levels.set(r, 0);
            queue.push(r);
        });

        while (queue.length > 0) {
            const curr = queue.shift();
            const currLvl = levels.get(curr) || 0;
            const neighbors = adj.get(curr) || [];

            for (let i = 0; i < neighbors.length; i++) {
                const nxt = neighbors[i];
                const proposed = currLvl + 1;
                if (!levels.has(nxt)) {
                    levels.set(nxt, proposed);
                    queue.push(nxt);
                } else if (proposed > levels.get(nxt) && proposed < 25) {
                    levels.set(nxt, proposed);
                    if (!queue.includes(nxt)) queue.push(nxt);
                }
            }
        }

        for (const id of allNodesMap.keys()) {
            if (!levels.has(id)) {
                levels.set(id, 0);
            }
        }

        return levels;
    }

    function detectKnowledgeDomain(id, node) {
        const idLower = String(id || '').toLowerCase();
        const search = node.searchCorpus || '';

        if (idLower.includes('math') || idLower.includes('calculus') || idLower.includes('algebra') || idLower.includes('fourier') || idLower.includes('integral') || idLower.includes('polynomial') || idLower.includes('linear_system') || search.includes('linear algebra') || search.includes('derivatives')) {
            return 'MATHEMATICS';
        }
        if (idLower.includes('physics') || idLower.includes('quantum') || idLower.includes('relativity') || idLower.includes('thermodynamics') || idLower.includes('constant') || idLower.includes('dimensional_analysis')) {
            return 'PHYSICS';
        }
        if (idLower.includes('tech') || idLower.includes('programming') || idLower.includes('compiler') || idLower.includes('architecture') || idLower.includes('defrag') || idLower.includes('code')) {
            return 'TECHNOLOGY';
        }
        if (idLower.includes('philosophy') || idLower.includes('epistemology') || idLower.includes('theseus') || idLower.includes('simulation') || idLower.includes('stoic') || idLower.includes('truth')) {
            return 'PHILOSOPHY';
        }
        if (idLower.includes('habit') || idLower.includes('morning') || idLower.includes('procrastination') || idLower.includes('focus') || idLower.includes('routine') || idLower.includes('reading') || idLower.includes('coffee') || idLower.includes('pomodoro')) {
            return 'LIFESTYLE';
        }
        if (idLower.includes('game') || idLower.includes('ttt') || idLower.includes('memory') || idLower.includes('hangman') || idLower.includes('quiz') || idLower.includes('rps') || idLower.includes('mines') || idLower.includes('wheel') || idLower.includes('tps') || idLower.includes('date_calc')) {
            return 'GAMES';
        }
        if (idLower.includes('hostile') || idLower.includes('enraged') || idLower.includes('dispute') || idLower.includes('debate') || idLower.includes('retort')) {
            return 'CONFLICT';
        }
        if (idLower.includes('deltarune') || idLower.includes('shadow') || idLower.includes('mystery')) {
            return 'NARRATIVE';
        }
        if (idLower.includes('diagnostic') || idLower.includes('specs') || idLower.includes('window') || idLower.includes('file') || idLower.includes('theme') || idLower.includes('wallpaper') || idLower.includes('volume') || idLower.includes('mail') || idLower.includes('shortcut')) {
            return 'SYSTEM';
        }
        return 'GENERAL';
    }

    function detectComplexityLevel(id, node) {
        const corpus = node.searchCorpus || '';
        const wordCount = corpus.split(/\s+/).length;
        const isMathPhys = corpus.includes('integral') || corpus.includes('quantum') || corpus.includes('manifold') || corpus.includes('eigenvalue') || corpus.includes('epistemology');

        if (isMathPhys || wordCount > 40) return 'ACADEMIC';
        if (corpus.includes('architecture') || corpus.includes('compiler') || corpus.includes('linear') || corpus.includes('algorithm') || corpus.includes('matrix')) return 'TECHNICAL';
        if (wordCount > 15) return 'STANDARD';
        return 'CASUAL';
    }

    let cachedGraphClusters = null;

    function computeGraphClusters() {
        const clusters = new Map();
        const visited = new Set();
        let clusterIdx = 0;

        for (const id of allNodesMap.keys()) {
            if (visited.has(id)) continue;
            const queue = [id];
            visited.add(id);
            clusters.set(id, clusterIdx);

            while (queue.length > 0) {
                const curr = queue.shift();
                const outs = outboundConnections.get(curr) || [];
                const inb = (inboundConnections.get(curr) || []).map(i => i.fromId);
                const neighbors = [...outs, ...inb];

                for (let i = 0; i < neighbors.length; i++) {
                    const nxt = neighbors[i];
                    if (allNodesMap.has(nxt) && !visited.has(nxt)) {
                        visited.add(nxt);
                        clusters.set(nxt, clusterIdx);
                        queue.push(nxt);
                    }
                }
            }
            clusterIdx++;
        }
        return clusters;
    }

    function computeGraphStatisticalMetrics() {
        const totalNodes = allNodesMap.size;
        let totalEdges = 0;
        let reciprocalEdges = 0;
        const inDegreeMap = new Map();
        const outDegreeMap = new Map();
        const moodCounts = new Map();
        const domainCounts = new Map();
        const complexityCounts = new Map();
        let actionableNodes = 0;
        let sinkNodes = 0;
        let sourceNodes = 0;

        if (!cachedGraphClusters) cachedGraphClusters = computeGraphClusters();
        const uniqueClusters = new Set(cachedGraphClusters.values()).size;

        for (const [id, node] of allNodesMap.entries()) {
            const outb = outboundConnections.get(id) || [];
            const inb = inboundConnections.get(id) || [];
            outDegreeMap.set(id, outb.length);
            inDegreeMap.set(id, inb.length);
            totalEdges += outb.length;

            if (outb.length === 0) sinkNodes++;
            if (inb.length === 0) sourceNodes++;

            for (let i = 0; i < outb.length; i++) {
                const targetOuts = outboundConnections.get(outb[i]);
                if (targetOuts && targetOuts.includes(id)) {
                    reciprocalEdges++;
                }
            }

            const m = node.derivedMood || 'OPTIMISTIC';
            moodCounts.set(m, (moodCounts.get(m) || 0) + 1);

            const dom = detectKnowledgeDomain(id, node);
            domainCounts.set(dom, (domainCounts.get(dom) || 0) + 1);

            const comp = detectComplexityLevel(id, node);
            complexityCounts.set(comp, (complexityCounts.get(comp) || 0) + 1);

            if (node.actionTrigger) actionableNodes++;
        }

        const density = totalNodes > 1 ? (totalEdges / (totalNodes * (totalNodes - 1))) : 0;
        const avgDegree = totalNodes > 0 ? (totalEdges / totalNodes) : 0;
        const reciprocityRate = totalEdges > 0 ? Math.round((reciprocalEdges / totalEdges) * 100) : 0;

        const hubs = Array.from(allNodesMap.keys()).map(id => ({
            id,
            inDegree: inDegreeMap.get(id) || 0,
            outDegree: outDegreeMap.get(id) || 0,
            totalDegree: (inDegreeMap.get(id) || 0) + (outDegreeMap.get(id) || 0),
            mood: allNodesMap.get(id).derivedMood || 'OPTIMISTIC',
            domain: detectKnowledgeDomain(id, allNodesMap.get(id))
        })).sort((a, b) => b.totalDegree - a.totalDegree);

        return {
            totalNodes,
            totalEdges,
            density: (density * 100).toFixed(2),
            avgDegree: Math.round(avgDegree * 100) / 100,
            reciprocityRate,
            uniqueClusters,
            sinkNodes,
            sourceNodes,
            actionableNodes,
            actionablePercentage: totalNodes > 0 ? Math.round((actionableNodes / totalNodes) * 100) : 0,
            hubs: hubs.slice(0, 15),
            moodCounts,
            domainCounts,
            complexityCounts
        };
    }

    function gatherAllDialogueNodes() {
        allNodesMap.clear();
        searchIndexMap.clear();
        discoveredTrees.clear();
        discoveredMoods.clear();

        if (window.ClippyKnowledge && window.ClippyKnowledge.DIALOGUE_NODES) {
            discoveredTrees.add('KNOWLEDGE');
            for (const [id, node] of Object.entries(window.ClippyKnowledge.DIALOGUE_NODES)) {
                registerNodeInIndex(id, node, 'KNOWLEDGE');
            }
        }

        if (window.ClippyTrees) {
            for (const [treeKey, treeNodes] of Object.entries(window.ClippyTrees)) {
                const treeName = treeKey.toUpperCase();
                discoveredTrees.add(treeName);
                if (treeNodes && typeof treeNodes === 'object') {
                    for (const [id, node] of Object.entries(treeNodes)) {
                        registerNodeInIndex(id, node, treeName);
                    }
                }
            }
        }

        buildAdjacencyMaps();
    }

    function populateDynamicControls() {
        const treeSelect = document.getElementById('filter-tree');
        const moodSelect = document.getElementById('filter-mood');
        const legendContainer = document.getElementById('graph-legend-container');

        treeSelect.innerHTML = '<option value="ALL">All Sources</option>';
        Array.from(discoveredTrees).sort().forEach(treeName => {
            const opt = document.createElement('option');
            opt.value = treeName;
            opt.textContent = `${treeName.charAt(0)}${treeName.slice(1).toLowerCase()} Tree`;
            treeSelect.appendChild(opt);
        });

        moodSelect.innerHTML = '<option value="ALL">All Moods</option>';
        Array.from(discoveredMoods).sort().forEach(moodName => {
            const opt = document.createElement('option');
            opt.value = moodName;
            opt.textContent = `${moodName.charAt(0)}${moodName.slice(1).toLowerCase()}`;
            moodSelect.appendChild(opt);
        });

        legendContainer.innerHTML = '';
        const legendEntries = [
            { label: 'Root & Entry Points', color: '#22c55e' },
            { label: 'Standard Dialogue', color: '#fef08a' },
            { label: 'Philosophical & Existential', color: '#8b5cf6' },
            { label: 'Analytical & Memory', color: '#2563eb' },
            { label: 'Playful & Humor', color: '#f59e0b' },
            { label: 'Conflict, Glitch & Anomaly', color: '#dc2626' },
            { label: 'Terminal State Nodes', color: '#67e8f9' },
            { label: 'Tool & Action Triggers', color: '#cbd5e1' }
        ];

        legendEntries.forEach(entry => {
            const row = document.createElement('div');
            row.className = 'legend-row';
            row.innerHTML = `<div class="legend-color" style="background:${entry.color};"></div><span>${entry.label}</span>`;
            legendContainer.appendChild(row);
        });
    }

    function getNeighborhoodSet(centerId, depth = 2) {
        const resultSet = new Set();
        if (!centerId || !allNodesMap.has(centerId)) return resultSet;

        const queue = [centerId];
        const depths = [0];
        resultSet.add(centerId);
        let head = 0;

        while (head < queue.length) {
            const current = queue[head];
            const currDepth = depths[head];
            head++;

            if (currDepth >= depth) continue;

            const outs = outboundConnections.get(current);
            if (outs) {
                for (let i = 0; i < outs.length; i++) {
                    const target = outs[i];
                    if (!resultSet.has(target)) {
                        resultSet.add(target);
                        queue.push(target);
                        depths.push(currDepth + 1);
                    }
                }
            }

            const ins = inboundConnections.get(current);
            if (ins) {
                for (let i = 0; i < ins.length; i++) {
                    const source = ins[i].fromId;
                    if (!resultSet.has(source)) {
                        resultSet.add(source);
                        queue.push(source);
                        depths.push(currDepth + 1);
                    }
                }
            }
        }
        return resultSet;
    }

    let currentColorMode = 'MOOD';
    let cachedTopologicalLevels = null;

    function getNodeVisualColors(node, colorMode, maxDegree = 1) {
        const id = node.id;
        if (colorMode === 'DOMAIN') {
            const domKey = detectKnowledgeDomain(id, node);
            const p = DOMAIN_PALETTE[domKey] || createHarmoniousPaletteEntry(generateXpColor(domKey, 2), domKey);
            return { background: p.bg, border: p.border, font: p.text };
        }

        if (colorMode === 'COMPLEXITY') {
            const compKey = detectComplexityLevel(id, node);
            const p = COMPLEXITY_PALETTE[compKey] || COMPLEXITY_PALETTE.STANDARD;
            return { background: p.bg, border: p.border, font: p.text };
        }

        if (colorMode === 'EDGECAT') {
            const outs = node.options || [];
            const firstCat = (outs.length > 0 && outs[0].category) ? outs[0].category : 'DEFAULT';
            const bg = EDGE_CATEGORY_COLORS[firstCat] || generateXpColor(firstCat, 4);
            return { background: bg, border: getDarkenedBorderColor(bg), font: getContrastTextColor(bg) };
        }

        if (colorMode === 'CLUSTER') {
            if (!cachedGraphClusters) cachedGraphClusters = computeGraphClusters();
            const cIdx = cachedGraphClusters.get(id) || 0;
            const bg = generateXpColor(`cluster_${cIdx}`, cIdx);
            return { background: bg, border: getDarkenedBorderColor(bg), font: getContrastTextColor(bg) };
        }

        if (colorMode === 'SOURCE') {
            const src = node.sourceTree || 'DEFAULT';
            const bg = generateXpColor(src, 3);
            return { background: bg, border: getDarkenedBorderColor(bg), font: getContrastTextColor(bg) };
        }

        if (colorMode === 'CENTRALITY') {
            const inDeg = (inboundConnections.get(id) || []).length;
            const outDeg = (outboundConnections.get(id) || []).length;
            const deg = inDeg + outDeg;
            const ratio = Math.min(1.0, deg / Math.max(1, maxDegree));

            let bg = '#2563eb';
            if (ratio > 0.66) bg = '#dc2626';
            else if (ratio > 0.33) bg = '#ea580c';
            else if (ratio > 0.15) bg = '#16a34a';
            return { background: bg, border: getDarkenedBorderColor(bg), font: getContrastTextColor(bg) };
        }

        if (colorMode === 'LEVEL') {
            const lvl = (cachedTopologicalLevels && cachedTopologicalLevels.get(id)) || 0;
            const bg = generateXpColor(`level_${lvl}`, lvl * 7);
            return { background: bg, border: getDarkenedBorderColor(bg), font: getContrastTextColor(bg) };
        }

        if (colorMode === 'ACTION') {
            if (node.actionTrigger) {
                const bg = '#f59e0b';
                return { background: bg, border: getDarkenedBorderColor(bg), font: getContrastTextColor(bg) };
            }
            const bg = '#64748b';
            return { background: bg, border: getDarkenedBorderColor(bg), font: getContrastTextColor(bg) };
        }

        const m = node.derivedMood || extractNodeMood(node);
        const pal = getMoodPaletteEntry(m);
        return { background: pal.bg, border: pal.border, font: pal.text };
    }

    function getEdgeVisualColor(srcNode, targetId, colorMode) {
        if (!srcNode || !Array.isArray(srcNode.options)) return '#64748b';
        const opt = srcNode.options.find(o => (o.next === targetId || o.targetNode === targetId));
        const cat = (opt && opt.category) || 'DEFAULT';

        if (colorMode === 'EDGECAT') {
            return EDGE_CATEGORY_COLORS[cat] || generateXpColor(cat, 5);
        }
        if (colorMode === 'MOOD' && opt && opt.moodDelta && opt.moodDelta.mood) {
            const m = String(opt.moodDelta.mood).toUpperCase();
            return getMoodPaletteEntry(m).bg;
        }
        return EDGE_CATEGORY_COLORS[cat] || '#64748b';
    }

    function updateDynamicLegend(colorMode, renderedNodes) {
        const legendContainer = document.getElementById('graph-legend-container');
        if (!legendContainer) return;
        legendContainer.innerHTML = '';

        const nodeSectionTitle = document.createElement('div');
        nodeSectionTitle.className = 'xp-legend-section-title';
        nodeSectionTitle.textContent = 'Node Colors';
        legendContainer.appendChild(nodeSectionTitle);

        let entries = [];

        if (colorMode === 'MOOD') {
            const presentMoods = new Set(renderedNodes.map(n => n.derivedMood || 'OPTIMISTIC'));
            presentMoods.forEach(m => {
                const pal = getMoodPaletteEntry(m);
                entries.push({ label: m, color: pal.bg });
            });
        } else if (colorMode === 'DOMAIN') {
            const presentDomains = new Set(renderedNodes.map(n => detectKnowledgeDomain(n.id, n)));
            presentDomains.forEach(domKey => {
                const p = DOMAIN_PALETTE[domKey] || createHarmoniousPaletteEntry(generateXpColor(domKey, 2), domKey);
                entries.push({ label: p.label || domKey, color: p.bg });
            });
        } else if (colorMode === 'EDGECAT') {
            for (const [cat, col] of Object.entries(EDGE_CATEGORY_COLORS)) {
                entries.push({ label: cat, color: col });
            }
        } else if (colorMode === 'COMPLEXITY') {
            const presentComp = new Set(renderedNodes.map(n => detectComplexityLevel(n.id, n)));
            presentComp.forEach(cKey => {
                const p = COMPLEXITY_PALETTE[cKey] || COMPLEXITY_PALETTE.STANDARD;
                entries.push({ label: p.label, color: p.bg });
            });
        } else if (colorMode === 'CLUSTER') {
            if (!cachedGraphClusters) cachedGraphClusters = computeGraphClusters();
            const clusterCounts = new Map();
            renderedNodes.forEach(n => {
                const c = cachedGraphClusters.get(n.id) || 0;
                clusterCounts.set(c, (clusterCounts.get(c) || 0) + 1);
            });
            Array.from(clusterCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8).forEach(([cIdx, cnt]) => {
                entries.push({ label: `Cluster ${cIdx + 1} (${cnt} nodes)`, color: generateXpColor(`cluster_${cIdx}`, cIdx) });
            });
        } else if (colorMode === 'CENTRALITY') {
            entries = [
                { label: 'High Centrality (>66%)', color: '#dc2626' },
                { label: 'Medium-High (33-66%)', color: '#ea580c' },
                { label: 'Active Node (15-33%)', color: '#16a34a' },
                { label: 'Standard Branch (<15%)', color: '#2563eb' }
            ];
        } else if (colorMode === 'LEVEL') {
            entries = [
                { label: 'Level 0 (Root / Entry)', color: generateXpColor('level_0', 0) },
                { label: 'Level 1 (Direct Child)', color: generateXpColor('level_1', 7) },
                { label: 'Level 2 (Expansion)', color: generateXpColor('level_2', 14) },
                { label: 'Level 3+ (Leaf / Subtree)', color: generateXpColor('level_3', 21) }
            ];
        } else if (colorMode === 'SOURCE') {
            const presentTrees = new Set(renderedNodes.map(n => n.sourceTree || 'DEFAULT'));
            presentTrees.forEach(t => {
                entries.push({ label: `${t} Tree`, color: generateXpColor(t, 3) });
            });
        } else if (colorMode === 'ACTION') {
            entries = [
                { label: 'Action Trigger Node', color: '#f59e0b' },
                { label: 'Pure Dialogue Node', color: '#64748b' }
            ];
        }

        entries.slice(0, 10).forEach(entry => {
            const row = document.createElement('div');
            row.className = 'legend-row';
            row.innerHTML = `<div class="legend-color" style="background:${entry.color};"></div><span>${entry.label}</span>`;
            legendContainer.appendChild(row);
        });

        const edgeSectionTitle = document.createElement('div');
        edgeSectionTitle.className = 'xp-legend-section-title';
        edgeSectionTitle.textContent = 'Link Types';
        legendContainer.appendChild(edgeSectionTitle);

        const edgeSamples = [
            { label: 'Agreement / Forward', color: EDGE_CATEGORY_COLORS.AGREE },
            { label: 'Inquiry / Exploration', color: EDGE_CATEGORY_COLORS.INQUIRE },
            { label: 'Philosophical Branch', color: EDGE_CATEGORY_COLORS.PHILOSOPHICAL },
            { label: 'Confrontation / Banter', color: EDGE_CATEGORY_COLORS.PROVOKE },
            { label: 'Apology / Reconciliation', color: EDGE_CATEGORY_COLORS.APOLOGY }
        ];

        edgeSamples.forEach(item => {
            const row = document.createElement('div');
            row.className = 'legend-row';
            row.innerHTML = `<div class="legend-line" style="background:${item.color};"></div><span>${item.label}</span>`;
            legendContainer.appendChild(row);
        });
    }

    function applyColorModeOnly(newColorMode) {
        currentColorMode = newColorMode;
        if (!dataSetNodes || dataSetNodes.length === 0) return;

        let maxDeg = 1;
        for (const id of allNodesMap.keys()) {
            const inDeg = (inboundConnections.get(id) || []).length;
            const outDeg = (outboundConnections.get(id) || []).length;
            if (inDeg + outDeg > maxDeg) maxDeg = inDeg + outDeg;
        }

        const existingNodes = dataSetNodes.get();
        const nodeUpdates = [];
        const renderedNodeObjects = [];

        for (let i = 0; i < existingNodes.length; i++) {
            const item = existingNodes[i];
            const nodeObj = allNodesMap.get(item.id);
            if (!nodeObj) continue;
            renderedNodeObjects.push(nodeObj);

            const colors = getNodeVisualColors(nodeObj, newColorMode, maxDeg);
            nodeUpdates.push({
                id: item.id,
                color: {
                    background: colors.background,
                    border: colors.border,
                    highlight: { background: '#ffffff', border: '#0055ea' }
                },
                font: {
                    color: colors.font,
                    size: 10,
                    face: 'Tahoma, sans-serif'
                }
            });
        }

        dataSetNodes.update(nodeUpdates);

        if (dataSetEdges && dataSetEdges.length > 0) {
            const edgeUpdates = [];
            const existingEdges = dataSetEdges.get();
            for (let i = 0; i < existingEdges.length; i++) {
                const e = existingEdges[i];
                const srcNode = allNodesMap.get(e.from);
                const edgeColor = getEdgeVisualColor(srcNode, e.to, newColorMode);
                edgeUpdates.push({
                    id: e.id,
                    color: { color: edgeColor, highlight: '#0055ea', hover: '#0055ea', inherit: false }
                });
            }
            dataSetEdges.update(edgeUpdates);
        }

        updateDynamicLegend(newColorMode, renderedNodeObjects);
        renderStatisticsPanel();
    }

    function buildGraphDataFast(filterTree = 'ALL', filterMood = 'ALL', searchFilter = '', scope = 'FULL', centerNodeId = null, colorMode = 'MOOD') {
        const nodes = [];
        const edges = [];
        const addedNodeIds = new Set();
        const cleanSearch = (searchFilter || '').toLowerCase().trim();
        const searchTokens = cleanSearch ? cleanSearch.split(/\s+/).filter(Boolean) : [];

        if (!cachedTopologicalLevels) {
            cachedTopologicalLevels = computeTopologicalLevels();
        }

        let maxDeg = 1;
        for (const id of allNodesMap.keys()) {
            const inDeg = (inboundConnections.get(id) || []).length;
            const outDeg = (outboundConnections.get(id) || []).length;
            if (inDeg + outDeg > maxDeg) maxDeg = inDeg + outDeg;
        }

        let candidateIds = null;
        if (scope === 'NEIGHBORHOOD' && centerNodeId && allNodesMap.has(centerNodeId) && !cleanSearch) {
            candidateIds = getNeighborhoodSet(centerNodeId, 2);
        }

        const posMap = isHierarchical ? positionsMemoryCache.hierarchical : positionsMemoryCache.organic;
        const renderedNodeObjects = [];

        for (const [id, node] of allNodesMap.entries()) {
            if (candidateIds && !candidateIds.has(id)) continue;
            if (filterTree !== 'ALL' && node.sourceTree !== filterTree) continue;
            if (filterMood !== 'ALL' && node.derivedMood !== filterMood) continue;

            if (searchTokens.length > 0) {
                const matchesAll = searchTokens.every(token => node.searchCorpus.includes(token));
                if (!matchesAll) continue;
            }

            renderedNodeObjects.push(node);
            const colors = getNodeVisualColors(node, colorMode, maxDeg);
            const level = cachedTopologicalLevels.get(id) || 0;
            const cachedPos = posMap.get(id);

            const nodeRecord = {
                id,
                label: node.cachedLabel,
                level: level,
                shape: 'box',
                margin: 4,
                borderWidth: 1,
                borderWidthSelected: 2,
                shadow: false,
                color: {
                    background: colors.background,
                    border: colors.border,
                    highlight: { background: '#ffffff', border: '#0055ea' }
                },
                font: {
                    color: colors.font,
                    size: 10,
                    face: 'Tahoma, sans-serif',
                    minVisible: 7,
                    maxVisible: 24
                }
            };

            if (cachedPos && !isHierarchical) {
                nodeRecord.x = cachedPos.x;
                nodeRecord.y = cachedPos.y;
            }

            nodes.push(nodeRecord);
            addedNodeIds.add(id);
        }

        for (let i = 0; i < nodes.length; i++) {
            const id = nodes[i].id;
            const node = allNodesMap.get(id);
            if (!node || !Array.isArray(node.options)) continue;

            for (let j = 0; j < node.options.length; j++) {
                const opt = node.options[j];
                const target = opt.next || opt.targetNode;
                if (target && addedNodeIds.has(target)) {
                    const edgeColor = getEdgeVisualColor(node, target, colorMode);
                    edges.push({
                        id: `e_${id}_${target}_${j}`,
                        from: id,
                        to: target,
                        arrows: { to: { enabled: true, scaleFactor: 0.4 } },
                        color: { color: edgeColor, highlight: '#0055ea', hover: '#0055ea', inherit: false },
                        smooth: false,
                        shadow: false,
                        width: 1,
                        hoverWidth: 0,
                        selectionWidth: 1.5
                    });
                }
            }
        }

        updateDynamicLegend(colorMode, renderedNodeObjects);
        return { nodes, edges };
    }

    function updateLoadingProgress(percentage, statusText) {
        const loader = document.getElementById('graph-loader-modal');
        const bar = document.getElementById('graph-loader-bar');
        const statusEl = document.getElementById('graph-loader-status');
        if (loader) loader.classList.remove('hidden');
        if (bar) bar.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
        if (statusEl && statusText) statusEl.textContent = statusText;
    }

    function hideLoadingProgress() {
        const loader = document.getElementById('graph-loader-modal');
        if (loader) loader.classList.add('hidden');
    }

    let activeIngestionId = 0;

    async function ingestGraphDataAsync(graphData) {
        const ingestionId = ++activeIngestionId;
        isGenerating = true;

        dataSetNodes.clear();
        dataSetEdges.clear();

        const totalNodes = graphData.nodes.length;
        const totalEdges = graphData.edges.length;
        const chunkSize = 4000;

        for (let i = 0; i < totalNodes; i += chunkSize) {
            if (ingestionId !== activeIngestionId) return;
            const slice = graphData.nodes.slice(i, i + chunkSize);
            dataSetNodes.add(slice);
            const pct = Math.round(((i + slice.length) / (totalNodes + totalEdges || 1)) * 100);
            updateLoadingProgress(pct, `Loaded ${i + slice.length} of ${totalNodes} nodes...`);
            await new Promise(resolve => requestAnimationFrame(resolve));
        }

        for (let i = 0; i < totalEdges; i += chunkSize) {
            if (ingestionId !== activeIngestionId) return;
            const slice = graphData.edges.slice(i, i + chunkSize);
            dataSetEdges.add(slice);
            const pct = Math.round(((totalNodes + i + slice.length) / (totalNodes + totalEdges || 1)) * 100);
            updateLoadingProgress(pct, `Connected ${i + slice.length} of ${totalEdges} links...`);
            await new Promise(resolve => requestAnimationFrame(resolve));
        }

        if (ingestionId !== activeIngestionId) return;

        updateStatusBar();
        isGenerating = false;
        hideLoadingProgress();

        if (totalNodes > 0 && networkInstance) {
            networkInstance.fit({ animation: { duration: 300 } });
            if (isPhysicsEnabled) {
                networkInstance.startSimulation();
            }
        }
    }

    let isEdgesHiddenForSpeed = false;
    let lastVelocityCheckTime = 0;

    function initNetwork() {
        updateLoadingProgress(10, 'Parsing knowledge bases...');
        gatherAllDialogueNodes();
        cachedTopologicalLevels = computeTopologicalLevels();
        loadStoredPositions('organic');
        loadStoredPositions('hierarchical');
        populateDynamicControls();

        const container = document.getElementById('network-graph-container');
        const initialData = buildGraphDataFast('ALL', 'ALL', '', 'FULL', null, currentColorMode);

        dataSetNodes = new vis.DataSet([]);
        dataSetEdges = new vis.DataSet([]);

        const options = {
            physics: {
                enabled: isPhysicsEnabled,
                solver: 'forceAtlas2Based',
                forceAtlas2Based: {
                    theta: 0.94,
                    gravitationalConstant: -32,
                    centralGravity: 0.003,
                    springLength: 36,
                    springConstant: 0.05,
                    damping: 0.65,
                    avoidOverlap: 0
                },
                maxVelocity: 40,
                minVelocity: 0.2,
                timestep: 0.4,
                adaptiveTimestep: true,
                stabilization: {
                    enabled: false
                }
            },
            interaction: {
                hover: false,
                hoverConnectedEdges: false,
                tooltipDelay: 300,
                hideEdgesOnDrag: true,
                hideEdgesOnZoom: true,
                navigationButtons: true,
                keyboard: false,
                multiselect: false,
                selectable: true
            },
            layout: {
                improvedLayout: false,
                hierarchical: {
                    enabled: false,
                    direction: 'UD',
                    sortMethod: 'directed',
                    nodeSpacing: 110,
                    levelSeparation: 90,
                    parentCentralization: false
                }
            }
        };

        networkInstance = new vis.Network(container, { nodes: dataSetNodes, edges: dataSetEdges }, options);

        networkInstance.on('selectNode', params => {
            if (params.nodes && params.nodes.length > 0) {
                selectedNodeId = params.nodes[0];
                inspectNode(selectedNodeId);
                if (currentScope === 'NEIGHBORHOOD') {
                    refreshGraph();
                }
            }
        });

        networkInstance.on('afterDrawing', () => {
            const now = performance.now();
            if (now - lastVelocityCheckTime < 250) return;
            lastVelocityCheckTime = now;

            if (!networkInstance || !networkInstance.physics || !networkInstance.physics.physicsBody) return;
            const physicsNodes = networkInstance.physics.physicsBody.nodes;
            if (!physicsNodes) return;

            let totalSpeed = 0;
            let count = 0;
            for (const id in physicsNodes) {
                const n = physicsNodes[id];
                if (n && n.vx !== undefined && n.vy !== undefined) {
                    totalSpeed += Math.abs(n.vx) + Math.abs(n.vy);
                    count++;
                    if (count > 80) break;
                }
            }

            const avgSpeed = count > 0 ? (totalSpeed / count) : 0;
            const velocityThreshold = 1.8;

            if (avgSpeed > velocityThreshold && !isEdgesHiddenForSpeed && dataSetEdges.length > 100) {
                isEdgesHiddenForSpeed = true;
                networkInstance.setOptions({ interaction: { hideEdgesOnDrag: true } });
                document.getElementById('status-selection').textContent = `High Velocity Physics: ${avgSpeed.toFixed(1)} px/f`;
            } else if (avgSpeed <= velocityThreshold && isEdgesHiddenForSpeed) {
                isEdgesHiddenForSpeed = false;
                document.getElementById('status-selection').textContent = `Physics Equilibrium: ${avgSpeed.toFixed(2)} px/f`;
            }
        });

        networkInstance.on('stabilizationProgress', params => {
            const pct = Math.round((params.iterations / params.total) * 100);
            document.getElementById('status-selection').textContent = `Settling layout: ${pct}%`;
        });

        networkInstance.on('stabilizationIterationsDone', () => {
            document.getElementById('status-selection').textContent = 'Graph layout ready';
            hideLoadingProgress();
        });

        ingestGraphDataAsync(initialData).then(() => {
            if (allNodesMap.has('N001')) inspectNode('N001');
            else if (allNodesMap.has('greeting_root')) inspectNode('greeting_root');
            renderStatisticsPanel();
        });
    }

    function inspectNode(nodeId) {
        const node = allNodesMap.get(nodeId);
        if (!node) return;

        selectedNodeId = nodeId;
        document.getElementById('insp-id').textContent = nodeId;
        document.getElementById('status-selection').textContent = `Selected: ${nodeId}`;

        let primaryText = node.text || '';
        if (Array.isArray(node.responses) && node.responses.length > 0 && node.responses[0].text) {
            primaryText = node.responses[0].text;
        }
        document.getElementById('insp-text').innerHTML = parseMarkdownToHtml(primaryText);

        const badge = document.getElementById('insp-badge');
        const mood = node.derivedMood || 'OPTIMISTIC';
        badge.textContent = mood;
        const pal = MOOD_PALETTE[mood] || MOOD_PALETTE.DEFAULT;
        badge.style.background = pal.badge;
        badge.style.color = '#ffffff';

        const actionBox = document.getElementById('insp-action-box');
        const actionName = document.getElementById('insp-action-name');
        if (node.actionTrigger) {
            actionBox.style.display = 'flex';
            actionBox.style.alignItems = 'center';
            actionBox.style.justifyContent = 'space-between';
            actionBox.style.gap = '6px';
            actionName.textContent = node.actionTrigger;

            let existingBtn = actionBox.querySelector('.xp-action-trigger-btn');
            if (!existingBtn) {
                existingBtn = document.createElement('button');
                existingBtn.type = 'button';
                existingBtn.className = 'xp-button xp-action-trigger-btn';
                existingBtn.textContent = 'Execute';
                actionBox.appendChild(existingBtn);
            }
            existingBtn.onclick = () => {
                const isStandalone = (window.ClippySystemBridge && window.ClippySystemBridge.getEnvironment() === 'standalone') || (window.ClippyEnvironment === 'standalone');
                if (isStandalone) {
                    window.location.href = `../../index.html?action=${encodeURIComponent(node.actionTrigger)}`;
                } else {
                    window.location.href = `../../desk/?action=${encodeURIComponent(node.actionTrigger)}`;
                }
            };
        } else {
            actionBox.style.display = 'none';
        }

        const optionsContainer = document.getElementById('insp-options-container');
        optionsContainer.innerHTML = '';
        const optionsList = Array.isArray(node.options) ? node.options : [];
        document.getElementById('insp-options-count').textContent = optionsList.length;

        optionsList.forEach(opt => {
            const target = opt.next || opt.targetNode || 'None';
            const item = document.createElement('div');
            item.className = 'option-item';

            let deltaText = '';
            if (opt.moodDelta) {
                const parts = [];
                for (const [k, v] of Object.entries(opt.moodDelta)) {
                    parts.push(`${k}: ${v > 0 ? '+' : ''}${v}`);
                }
                deltaText = `<div class="option-delta">Delta: ${parts.join(', ')}</div>`;
            }

            item.innerHTML = `
                <div class="option-header">
                    <span>${opt.category || 'CHOICE'}</span>
                    <span class="option-target">-&gt; ${target}</span>
                </div>
                <div style="font-size:11px; color:#111827;">${opt.label || 'Continue...'}</div>
                ${deltaText}
            `;

            item.addEventListener('click', () => {
                if (target && allNodesMap.has(target)) {
                    focusNode(target);
                }
            });

            optionsContainer.appendChild(item);
        });

        const inboundContainer = document.getElementById('insp-inbound-container');
        inboundContainer.innerHTML = '';
        const inbounds = inboundConnections.get(nodeId) || [];
        document.getElementById('insp-inbound-count').textContent = inbounds.length;

        inbounds.forEach(inb => {
            const tag = document.createElement('div');
            tag.className = 'inbound-tag';
            tag.textContent = inb.fromId;
            tag.title = inb.label || '';
            tag.addEventListener('click', () => focusNode(inb.fromId));
            inboundContainer.appendChild(tag);
        });
    }

    function focusNode(nodeId) {
        if (!networkInstance || !allNodesMap.has(nodeId)) return;
        selectedNodeId = nodeId;
        inspectNode(nodeId);

        if (currentScope === 'NEIGHBORHOOD') {
            refreshGraph();
            return;
        }

        if (!dataSetNodes.get(nodeId)) {
            refreshGraph();
            return;
        }

        networkInstance.selectNodes([nodeId]);
        networkInstance.focus(nodeId, {
            scale: 1.1,
            animation: { duration: 400, easingFunction: 'easeInOutQuad' }
        });
    }

    function renderStatisticsPanel() {
        const container = document.getElementById('stats-content-area');
        if (!container) return;
        const stats = computeGraphStatisticalMetrics();

        let moodBarsHtml = '';
        stats.moodCounts.forEach((count, mood) => {
            const pct = Math.round((count / (stats.totalNodes || 1)) * 100);
            const pal = MOOD_PALETTE[mood] || MOOD_PALETTE.DEFAULT;
            moodBarsHtml += `
                <div style="margin-bottom:4px;">
                    <div style="display:flex; justify-content:space-between; font-size:10px;">
                        <span><strong>${mood}</strong></span>
                        <span>${count} (${pct}%)</span>
                    </div>
                    <div class="xp-stat-bar-track">
                        <div class="xp-stat-bar-fill" style="width:${pct}%; background:${pal.bg};"></div>
                    </div>
                </div>
            `;
        });

        let domainBarsHtml = '';
        stats.domainCounts.forEach((count, domKey) => {
            const pct = Math.round((count / (stats.totalNodes || 1)) * 100);
            const p = DOMAIN_PALETTE[domKey] || DOMAIN_PALETTE.GENERAL;
            domainBarsHtml += `
                <div style="margin-bottom:4px;">
                    <div style="display:flex; justify-content:space-between; font-size:10px;">
                        <span><strong>${p.label}</strong></span>
                        <span>${count} (${pct}%)</span>
                    </div>
                    <div class="xp-stat-bar-track">
                        <div class="xp-stat-bar-fill" style="width:${pct}%; background:${p.bg};"></div>
                    </div>
                </div>
            `;
        });

        let complexityBarsHtml = '';
        stats.complexityCounts.forEach((count, compKey) => {
            const pct = Math.round((count / (stats.totalNodes || 1)) * 100);
            const p = COMPLEXITY_PALETTE[compKey] || COMPLEXITY_PALETTE.STANDARD;
            complexityBarsHtml += `
                <div style="margin-bottom:4px;">
                    <div style="display:flex; justify-content:space-between; font-size:10px;">
                        <span><strong>${p.label}</strong></span>
                        <span>${count} (${pct}%)</span>
                    </div>
                    <div class="xp-stat-bar-track">
                        <div class="xp-stat-bar-fill" style="width:${pct}%; background:${p.bg};"></div>
                    </div>
                </div>
            `;
        });

        let hubsHtml = '';
        stats.hubs.forEach(h => {
            hubsHtml += `
                <div class="xp-hub-row" data-node-id="${h.id}">
                    <div>
                        <span class="xp-hub-id">${h.id}</span>
                        <span style="font-size:10px; color:#64748b; margin-left:4px;">(${h.domain})</span>
                    </div>
                    <div style="display:flex; gap:4px; align-items:center;">
                        <span class="xp-hub-badge">${h.totalDegree} links</span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = `
            <div class="xp-stat-card">
                <strong style="color:#0055ea; font-size:11px;">Topology Metrics</strong>
                <div class="xp-stat-grid-2">
                    <div class="xp-stat-metric-box">
                        <span class="xp-stat-metric-label">Total Nodes</span>
                        <span class="xp-stat-metric-value">${stats.totalNodes.toLocaleString()}</span>
                    </div>
                    <div class="xp-stat-metric-box">
                        <span class="xp-stat-metric-label">Active Links</span>
                        <span class="xp-stat-metric-value">${stats.totalEdges.toLocaleString()}</span>
                    </div>
                    <div class="xp-stat-metric-box">
                        <span class="xp-stat-metric-label">Average Degree</span>
                        <span class="xp-stat-metric-value">${stats.avgDegree}</span>
                    </div>
                    <div class="xp-stat-metric-box">
                        <span class="xp-stat-metric-label">Density</span>
                        <span class="xp-stat-metric-value">${stats.density}%</span>
                    </div>
                    <div class="xp-stat-metric-box">
                        <span class="xp-stat-metric-label">Clusters</span>
                        <span class="xp-stat-metric-value">${stats.uniqueClusters}</span>
                    </div>
                    <div class="xp-stat-metric-box">
                        <span class="xp-stat-metric-label">Reciprocity</span>
                        <span class="xp-stat-metric-value">${stats.reciprocityRate}%</span>
                    </div>
                    <div class="xp-stat-metric-box">
                        <span class="xp-stat-metric-label">Root Entries</span>
                        <span class="xp-stat-metric-value">${stats.sourceNodes}</span>
                    </div>
                    <div class="xp-stat-metric-box">
                        <span class="xp-stat-metric-label">Actionable</span>
                        <span class="xp-stat-metric-value">${stats.actionableNodes} (${stats.actionablePercentage}%)</span>
                    </div>
                </div>
            </div>

            <div class="xp-stat-card">
                <strong style="color:#0055ea; font-size:11px;">Top Central Hubs</strong>
                <div style="display:flex; flex-direction:column; max-height:130px; overflow-y:auto;">
                    ${hubsHtml}
                </div>
            </div>

            <div class="xp-stat-card">
                <strong style="color:#0055ea; font-size:11px;">Knowledge Domains Distribution</strong>
                <div>${domainBarsHtml}</div>
            </div>

            <div class="xp-stat-card">
                <strong style="color:#0055ea; font-size:11px;">Conceptual Complexity Distribution</strong>
                <div>${complexityBarsHtml}</div>
            </div>

            <div class="xp-stat-card">
                <strong style="color:#0055ea; font-size:11px;">Emotional States Distribution</strong>
                <div>${moodBarsHtml}</div>
            </div>
        `;

        container.querySelectorAll('.xp-hub-row').forEach(row => {
            row.addEventListener('click', () => {
                const targetId = row.getAttribute('data-node-id');
                if (targetId) {
                    document.getElementById('tab-btn-details').click();
                    focusNode(targetId);
                }
            });
        });
    }

    function setupInspectorResizer() {
        const resizer = document.getElementById('inspector-resizer');
        const inspector = document.getElementById('inspector-panel');
        const toggleBtn = document.getElementById('btn-toggle-inspector');
        const closeBtn = document.getElementById('btn-close-inspector');

        let isDragging = false;
        let startX = 0;
        let startWidth = 380;

        try {
            const savedWidth = localStorage.getItem('clippy_tree_insp_width');
            if (savedWidth) {
                const parsed = parseInt(savedWidth, 10);
                if (!isNaN(parsed) && parsed >= 220 && parsed <= window.innerWidth * 0.85) {
                    inspector.style.width = `${parsed}px`;
                }
            }
        } catch (e) {}

        resizer.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startWidth = inspector.offsetWidth;
            resizer.classList.add('resizing');
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const delta = startX - e.clientX;
            const newWidth = Math.max(220, Math.min(window.innerWidth * 0.85, startWidth + delta));
            inspector.style.width = `${newWidth}px`;
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                resizer.classList.remove('resizing');
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                try {
                    localStorage.setItem('clippy_tree_insp_width', String(inspector.offsetWidth));
                } catch (e) {}
            }
        });

        const toggleCollapse = (forceState = null) => {
            const shouldCollapse = forceState !== null ? forceState : !inspector.classList.contains('collapsed');
            inspector.classList.toggle('collapsed', shouldCollapse);
            resizer.style.display = shouldCollapse ? 'none' : 'block';
            toggleBtn.classList.toggle('active', !shouldCollapse);
            toggleBtn.textContent = shouldCollapse ? 'Show Inspector' : 'Inspector Panel';
            if (networkInstance) {
                setTimeout(() => {
                    networkInstance.redraw();
                    networkInstance.fit({ animation: { duration: 250 } });
                }, 60);
            }
        };

        toggleBtn.addEventListener('click', () => toggleCollapse());
        closeBtn.addEventListener('click', () => toggleCollapse(true));

        const tabDetails = document.getElementById('tab-btn-details');
        const tabStats = document.getElementById('tab-btn-stats');
        const paneDetails = document.getElementById('insp-tab-details');
        const paneStats = document.getElementById('insp-tab-stats');

        tabDetails.addEventListener('click', () => {
            tabDetails.classList.add('active');
            tabStats.classList.remove('active');
            paneDetails.style.display = 'flex';
            paneStats.style.display = 'none';
        });

        tabStats.addEventListener('click', () => {
            tabStats.classList.add('active');
            tabDetails.classList.remove('active');
            paneStats.style.display = 'flex';
            paneDetails.style.display = 'none';
            renderStatisticsPanel();
        });
    }

    function refreshGraph() {
        const filterTree = document.getElementById('filter-tree').value;
        const filterMood = document.getElementById('filter-mood').value;
        const search = document.getElementById('search-input').value;
        currentScope = document.getElementById('filter-scope').value;
        currentColorMode = document.getElementById('filter-color-mode').value;

        const freshData = buildGraphDataFast(filterTree, filterMood, search, currentScope, selectedNodeId || 'N001', currentColorMode);
        return ingestGraphDataAsync(freshData);
    }

    function updateStatusBar() {
        const nodesCount = dataSetNodes ? dataSetNodes.length : 0;
        const edgesCount = dataSetEdges ? dataSetEdges.length : 0;
        document.getElementById('status-nodes-count').textContent = `Rendered Nodes: ${nodesCount.toLocaleString()} | Active Links: ${edgesCount.toLocaleString()}`;
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (typeof updateFaviconToMoonPhase === 'function') {
            updateFaviconToMoonPhase('../../assets/images/moon_phases/');
        }

        initNetwork();
        setupInspectorResizer();

        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', () => {
            if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
            searchDebounceTimer = setTimeout(refreshGraph, 120);
        });

        document.getElementById('filter-color-mode').addEventListener('change', (e) => {
            applyColorModeOnly(e.target.value);
        });

        document.getElementById('filter-tree').addEventListener('change', refreshGraph);
        document.getElementById('filter-mood').addEventListener('change', refreshGraph);
        document.getElementById('filter-scope').addEventListener('change', refreshGraph);

        const btnPhysics = document.getElementById('btn-physics');
        btnPhysics.addEventListener('click', () => {
            isPhysicsEnabled = !isPhysicsEnabled;
            if (isPhysicsEnabled) {
                networkInstance.setOptions({ physics: { enabled: true } });
                networkInstance.startSimulation();
            } else {
                networkInstance.setOptions({ physics: { enabled: false } });
                networkInstance.stopSimulation();
            }
            btnPhysics.textContent = isPhysicsEnabled ? 'Physics: ON' : 'Physics: OFF';
            btnPhysics.classList.toggle('active', isPhysicsEnabled);
        });

        const btnFree = document.getElementById('btn-layout-free');
        const btnHierarchical = document.getElementById('btn-layout-hierarchical');

        btnFree.addEventListener('click', () => {
            if (!isHierarchical) return;
            saveCurrentPositions('hierarchical');
            isHierarchical = false;
            btnFree.classList.add('active');
            btnHierarchical.classList.remove('active');

            const cachedOrganic = positionsMemoryCache.organic;
            if (cachedOrganic.size > 0) {
                const posUpdates = [];
                cachedOrganic.forEach((pos, id) => {
                    if (dataSetNodes.get(id)) {
                        posUpdates.push({ id, x: pos.x, y: pos.y });
                    }
                });
                if (posUpdates.length > 0) dataSetNodes.update(posUpdates);
            }

            networkInstance.setOptions({
                layout: { hierarchical: { enabled: false } },
                physics: {
                    enabled: isPhysicsEnabled,
                    solver: 'forceAtlas2Based',
                    forceAtlas2Based: {
                        theta: 0.94,
                        gravitationalConstant: -32,
                        centralGravity: 0.003,
                        springLength: 36,
                        springConstant: 0.05,
                        damping: 0.65,
                        avoidOverlap: 0
                    }
                }
            });
            if (isPhysicsEnabled) {
                networkInstance.startSimulation();
            }
        });

        btnHierarchical.addEventListener('click', () => {
            if (isHierarchical) return;
            saveCurrentPositions('organic');
            isHierarchical = true;
            btnHierarchical.classList.add('active');
            btnFree.classList.remove('active');
            cachedTopologicalLevels = computeTopologicalLevels();

            const cachedHier = positionsMemoryCache.hierarchical;
            if (cachedHier.size > 0) {
                const posUpdates = [];
                cachedHier.forEach((pos, id) => {
                    if (dataSetNodes.get(id)) {
                        posUpdates.push({ id, x: pos.x, y: pos.y });
                    }
                });
                if (posUpdates.length > 0) dataSetNodes.update(posUpdates);
            }

            networkInstance.setOptions({
                layout: {
                    hierarchical: {
                        enabled: true,
                        direction: 'UD',
                        sortMethod: 'directed',
                        levelSeparation: 110,
                        nodeSpacing: 150,
                        treeSpacing: 180,
                        blockShifting: true,
                        edgeMinimization: true,
                        parentCentralization: true
                    }
                },
                physics: {
                    enabled: isPhysicsEnabled,
                    solver: 'hierarchicalRepulsion',
                    hierarchicalRepulsion: {
                        nodeDistance: 140,
                        centralGravity: 0.0,
                        springLength: 80,
                        springConstant: 0.015,
                        damping: 0.85,
                        avoidOverlap: 1
                    }
                }
            });
            if (isPhysicsEnabled) {
                networkInstance.startSimulation();
            }
        });

        document.getElementById('btn-fit').addEventListener('click', () => {
            if (networkInstance) networkInstance.fit({ animation: { duration: 300 } });
        });

        document.getElementById('btn-focus-root').addEventListener('click', () => {
            if (allNodesMap.has('N001')) focusNode('N001');
            else if (allNodesMap.has('greeting_root')) focusNode('greeting_root');
        });

        document.getElementById('btn-back-nav').addEventListener('click', () => {
            const isStandalone = (window.ClippySystemBridge && window.ClippySystemBridge.getEnvironment() === 'standalone') || (window.ClippyEnvironment === 'standalone');
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = isStandalone ? '../../index.html' : '../../desk/';
            }
        });
    });
})();
