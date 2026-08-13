/**
 * ============================================================================
 * CLIPPY DESKTOP ASSISTANT - ENHANCED MODULE (ENGLISH VERSION)
 * ============================================================================
 * 
 * Microsoft Clippy Assistant implementation for desktop simulation.
 * Fully features contextual intents, typewriter messaging, safety wrappers
 * for DeskAPI external bridges, and accessibility features.
 */

(function () {
    'use strict';

    const IMAGE_BASE = '../assets/images/desk/clippy/';
    const IDLE_MESSAGE_INTERVAL_MS = 60000;
    const IDLE_MESSAGE_CHANCE = 0.65;
    const TYPEWRITER_SPEED_MS = 18;
    const STORAGE_KEY_CONVO = 'clippy_conversation_history';

    let popupElement = null;
    let logElement = null;
    let inputElement = null;
    let faceImage = null;
    let bubbleElement = null;
    let suggestionsContainer = null;
    let isOpen = false;
    let lastIntentId = null;
    let activeGameContext = null;
    let idleTimer = null;
    let bubbleHideTimer = null;
    let isThinking = false;
    let isTyping = false;
    let soundEnabled = true;
    let audioCtx = null;

    const FACES = {
        IDLE: 'idle',
        THINK: 'think',
        TALK: 'talk',
        HAPPY: 'happy',
        EXPLAIN: 'explain',
        ALERT: 'alert',
        SURPRISE: 'surprise',
        WRITE: 'write'
    };

    const QUICK_SUGGESTIONS = [
        "What can you do?",
        "Check unread emails",
        "Tell me a joke",
        "System status",
        "Play Rock Paper Scissors",
        "Windows keyboard shortcuts"
    ];

    const GREETINGS = [
        "Hi there! It looks like you're exploring the desktop. Need a hand?",
        "Greetings! Clippy at your service. What shall we tackle today?",
        "Hello! Ready to manage files, check projects, or play a quick game?",
        "Welcome back! Type a question or click a suggestion below to get started.",
        "Hey! The desktop is active and running smoothly. What can I do for you?"
    ];

    const FALLBACKS = [
        "I'm not quite sure I understand that command. Try asking about your emails, open projects, system status, or ask me for a tip!",
        "Hmm, my algorithms didn't catch that. You can ask me to open apps, calculate math, tell jokes, or roll a dice.",
        "I didn't recognize that request. Try typing 'help' to see everything I can assist you with!",
        "It looks like you're trying to write something complex. Rephrase it or ask for desktop shortcuts!"
    ];

    const SafeDeskAPI = {
        getUnreadMailCount: () => {
            try { return (window.DeskAPI && typeof window.DeskAPI.getUnreadMailCount === 'function') ? window.DeskAPI.getUnreadMailCount() : 0; }
            catch (e) { return 0; }
        },
        getRandomProject: () => {
            try { return (window.DeskAPI && typeof window.DeskAPI.getRandomProject === 'function') ? window.DeskAPI.getRandomProject() : null; }
            catch (e) { return null; }
        },
        getAllProjects: () => {
            try { return (window.DeskAPI && typeof window.DeskAPI.getAllProjects === 'function') ? window.DeskAPI.getAllProjects() : []; }
            catch (e) { return []; }
        },
        getDesktopItemCount: () => {
            try { return (window.DeskAPI && typeof window.DeskAPI.getDesktopItemCount === 'function') ? window.DeskAPI.getDesktopItemCount() : 0; }
            catch (e) { return 0; }
        },
        getRecycleBinCount: () => {
            try { return (window.DeskAPI && typeof window.DeskAPI.getRecycleBinCount === 'function') ? window.DeskAPI.getRecycleBinCount() : 0; }
            catch (e) { return 0; }
        },
        emptyRecycleBin: () => {
            try { if (window.DeskAPI && typeof window.DeskAPI.emptyRecycleBin === 'function') return window.DeskAPI.emptyRecycleBin(); }
            catch (e) { return false; }
        },
        getOpenWindowCount: () => {
            try { return (window.DeskAPI && typeof window.DeskAPI.getOpenWindowCount === 'function') ? window.DeskAPI.getOpenWindowCount() : 0; }
            catch (e) { return 0; }
        },
        getOpenWindowTitles: () => {
            try { return (window.DeskAPI && typeof window.DeskAPI.getOpenWindowTitles === 'function') ? window.DeskAPI.getOpenWindowTitles() : []; }
            catch (e) { return []; }
        },
        closeAllWindows: () => {
            try { if (window.DeskAPI && typeof window.DeskAPI.closeAllWindows === 'function') window.DeskAPI.closeAllWindows(); }
            catch (e) {}
        },
        minimizeAllWindows: () => {
            try { if (window.DeskAPI && typeof window.DeskAPI.minimizeAllWindows === 'function') window.DeskAPI.minimizeAllWindows(); }
            catch (e) {}
        },
        getMoonPhaseDay: () => {
            try { return (window.DeskAPI && typeof window.DeskAPI.getMoonPhaseDay === 'function') ? window.DeskAPI.getMoonPhaseDay() : null; }
            catch (e) { return null; }
        },
        getNowPlaying: () => {
            try { return (window.DeskAPI && typeof window.DeskAPI.getNowPlaying === 'function') ? window.DeskAPI.getNowPlaying() : null; }
            catch (e) { return null; }
        },
        toggleMusicPlayback: () => {
            try { if (window.DeskAPI && typeof window.DeskAPI.toggleMusicPlayback === 'function') return window.DeskAPI.toggleMusicPlayback(); }
            catch (e) { return false; }
        },
        nextMusicTrack: () => {
            try { if (window.DeskAPI && typeof window.DeskAPI.nextMusicTrack === 'function') return window.DeskAPI.nextMusicTrack(); }
            catch (e) { return false; }
        },
        openApp: (appId) => {
            try {
                if (window.DeskAPI && typeof window.DeskAPI.openApp === 'function') {
                    window.DeskAPI.openApp(appId);
                    return true;
                }
                const fnName = 'open' + appId.charAt(0).toUpperCase() + appId.slice(1);
                if (window.DeskAPI && typeof window.DeskAPI[fnName] === 'function') {
                    window.DeskAPI[fnName]();
                    return true;
                }
            } catch (e) {}
            return false;
        },
        openMailApp: () => SafeDeskAPI.openApp('mail'),
        openRecycleBin: () => SafeDeskAPI.openApp('recycleBin'),
        openProjectsApp: () => SafeDeskAPI.openApp('projects'),
        openNotepadApp: () => SafeDeskAPI.openApp('notepad'),
        openMusicApp: () => SafeDeskAPI.openApp('musicPlayer'),
        openMinesweeperApp: () => SafeDeskAPI.openApp('minesweeper'),
        openPaintApp: () => SafeDeskAPI.openApp('paint'),
        openTerminalApp: () => SafeDeskAPI.openApp('terminal'),
        openSettingsApp: () => SafeDeskAPI.openApp('settings')
    };

    function playRetroSound(type) {
        if (!soundEnabled) return;
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            const now = audioCtx.currentTime;

            if (type === 'type') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(450 + Math.random() * 150, now);
                gain.gain.setValueAtTime(0.015, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
                osc.start(now);
                osc.stop(now + 0.04);
            } else if (type === 'popup') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(320, now);
                osc.frequency.exponentialRampToValueAtTime(680, now + 0.12);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
            } else if (type === 'action') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(523.25, now);
                osc.frequency.setValueAtTime(659.25, now + 0.06);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
            }
        } catch (e) {}
    }

    function setFace(state) {
        if (!faceImage) return;
        const targetFace = Object.values(FACES).includes(state) ? state : FACES.IDLE;
        faceImage.src = `${IMAGE_BASE}${targetFace}.png`;
    }

    function scrollLogToBottom() {
        if (logElement) {
            logElement.scrollTop = logElement.scrollHeight;
        }
    }

    function pickFrom(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    function normalize(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }

    function includesAny(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    function evaluateMathExpression(str) {
        const cleaned = str.replace(/[^0-9\+\-\*\/\(\)\.\^\%]/g, '');
        if (!cleaned || !/[0-9]/.test(cleaned)) return null;
        try {
            const sanitized = cleaned.replace(/\^/g, '**');
            if (/^[0-9+\-*/(). %**]+$/.test(sanitized)) {
                const result = Function(`'use strict'; return (${sanitized})`)();
                if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
                    return Math.round(result * 100000) / 100000;
                }
            }
        } catch (e) {}
        return null;
    }

    function typeWriterMessage(role, text, onComplete, actions = null) {
        if (!logElement) return;

        const row = document.createElement('div');
        row.className = `clippy-message clippy-message-${role}`;
        logElement.appendChild(row);

        if (role === 'user') {
            row.textContent = text;
            scrollLogToBottom();
            if (onComplete) onComplete();
            return;
        }

        isTyping = true;
        setFace(FACES.TALK);
        let index = 0;

        const interval = setInterval(() => {
            if (index < text.length) {
                row.textContent += text.charAt(index);
                if (index % 4 === 0) playRetroSound('type');
                index++;
                scrollLogToBottom();
            } else {
                clearInterval(interval);
                isTyping = false;
                setFace(FACES.IDLE);

                if (actions && Array.isArray(actions) && actions.length > 0) {
                    const btnBar = document.createElement('div');
                    btnBar.className = 'clippy-actions-bar';
                    actions.forEach(act => {
                        const actBtn = document.createElement('button');
                        actBtn.type = 'button';
                        actBtn.className = 'clippy-action-btn';
                        actBtn.textContent = act.label;
                        actBtn.addEventListener('click', () => {
                            playRetroSound('action');
                            act.onClick();
                        });
                        btnBar.appendChild(actBtn);
                    });
                    logElement.appendChild(btnBar);
                    scrollLogToBottom();
                }

                if (onComplete) onComplete();
            }
        }, TYPEWRITER_SPEED_MS);
    }

    // Dynamic Moon Phase Label Generator
    function getMoonPhaseLabel() {
        const day = SafeDeskAPI.getMoonPhaseDay();
        if (day === null || day === undefined) return null;
        if (day <= 2 || day >= 29) return 'New Moon';
        if (day < 9) return 'Waxing Crescent';
        if (day < 10) return 'First Quarter';
        if (day < 16) return 'Waxing Gibbous';
        if (day < 18) return 'Full Moon';
        if (day < 24) return 'Waning Gibbous';
        if (day < 25) return 'Third Quarter';
        return 'Waning Crescent';
    }

    const JOKES_LIST = [
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25!",
        "I asked the paperclip next door if he was doing alright. He told me: 'I am holding things together!'",
        "Why was the computer shivering? It left too many Windows open!",
        "There are 10 types of people in the world: those who understand binary, and those who don't.",
        "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
        "Hardware is the part of a computer that you can kick; software is the part you can only curse at.",
        "Why did the developer go broke? Because he used up all his cache.",
        "An SEO expert walks into a bar, bars, pub, tavern, beer, wine, whiskey, lounge...",
        "What is a programmer's favorite hangout place? Foo Bar."
    ];

    const TRIVIA_LIST = [
        "Did you know? The original Clippy (Clippit) was designed by Kevan J. Atteberry on a Macintosh!",
        "In Windows 95, clicking the Start button was accompanied by Brian Eno's iconic six-second startup sound.",
        "The first computer mouse was invented in 1964 by Douglas Engelbart and was carved from wood.",
        "The Apollo 11 Guidance Computer operated with only 4 kilobytes of RAM and a 32-kilobyte ROM.",
        "The iconic Windows XP wallpaper 'Bliss' is an unedited photograph taken in Sonoma County, California in 1996.",
        "The term 'bug' in computer science was popularized when Grace Hopper found a real moth trapped in a Mark II computer relay in 1947."
    ];

    const SHORTCUTS_LIST = [
        "Win + D : Minimize or restore all open windows immediately.",
        "Alt + Tab : Quick-switch between active desktop windows.",
        "Ctrl + Shift + Esc : Directly open the Task Manager.",
        "Win + E : Open the file explorer / portfolio browser.",
        "Ctrl + Z : Undo your last operation.",
        "F5 / Ctrl + R : Refresh the active view or webpage."
    ];

    const EIGHT_BALL_ANSWERS = [
        "It is certain.",
        "Without a doubt.",
        "You may rely on it.",
        "Ask again later.",
        "Cannot predict now, my paperclip sensors are blurry.",
        "Don't count on it.",
        "My sources say no.",
        "Outlook good (and I don't just mean Microsoft Outlook!).",
        "Very doubtful."
    ];

    function respondUnreadMail() {
        const count = SafeDeskAPI.getUnreadMailCount();
        if (count === 0) return { text: "Your inbox is completely up to date. Zero unread messages!", actions: [{ label: "Open Mail App", onClick: () => SafeDeskAPI.openMailApp() }] };
        if (count === 1) return { text: "You have 1 unread message waiting in Outlook Express. Would you like to read it?", actions: [{ label: "Open Mail", onClick: () => SafeDeskAPI.openMailApp() }] };
        return { text: `You have ${count} unread messages in your inbox!`, actions: [{ label: `Open Outlook (${count})`, onClick: () => SafeDeskAPI.openMailApp() }] };
    }

    function respondProjects() {
        const allProjects = SafeDeskAPI.getAllProjects();
        const project = SafeDeskAPI.getRandomProject();
        if (!project && (!allProjects || allProjects.length === 0)) {
            return { text: "I couldn't load project data right now, but you can launch the Projects explorer!", actions: [{ label: "Open Projects", onClick: () => SafeDeskAPI.openProjectsApp() }] };
        }
        let title = "Featured Project";
        if (project && project.title) {
            title = (typeof project.title === 'object') ? (project.title.en || project.title.fr || "Portfolio Item") : project.title;
        }
        const countText = allProjects.length > 0 ? `We have ${allProjects.length} total projects showcase items available.` : "";
        return {
            text: `Featured project: "${title}". ${countText} Would you like to open the portfolio window?`,
            actions: [{ label: "View Projects", onClick: () => SafeDeskAPI.openProjectsApp() }]
        };
    }

    function respondDesktop() {
        const count = SafeDeskAPI.getDesktopItemCount();
        return `There are currently ${count} item(s) on your desktop, excluding hidden files.`;
    }

    function respondRecycleBin() {
        const count = SafeDeskAPI.getRecycleBinCount();
        if (count === 0) {
            return { text: "The Recycle Bin is spotless and empty!", actions: [{ label: "Open Recycle Bin", onClick: () => SafeDeskAPI.openRecycleBin() }] };
        }
        return {
            text: `The Recycle Bin currently holds ${count} item(s).`,
            actions: [
                { label: "Open Recycle Bin", onClick: () => SafeDeskAPI.openRecycleBin() },
                { label: "Empty Bin", onClick: () => { SafeDeskAPI.emptyRecycleBin(); typeWriterMessage('assistant', "Recycle Bin emptied successfully!"); } }
            ]
        };
    }

    function respondTime() {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const date = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return `Current Time: ${time}\nDate: ${date} (${tz})`;
    }

    function respondMoon() {
        const label = getMoonPhaseLabel();
        if (!label) return "Lunar metrics are unavailable right now.";
        return `The current lunar phase is: ${label}.`;
    }

    function respondWindows() {
        const count = SafeDeskAPI.getOpenWindowCount();
        const titles = SafeDeskAPI.getOpenWindowTitles();
        if (count === 0) return "No application windows are currently active on the workspace.";
        const titleList = titles.length > 0 ? ` (${titles.join(', ')})` : "";
        return {
            text: `You have ${count} window(s) open${titleList}.`,
            actions: [
                { label: "Minimize All", onClick: () => SafeDeskAPI.minimizeAllWindows() },
                { label: "Close All", onClick: () => SafeDeskAPI.closeAllWindows() }
            ]
        };
    }

    function respondMusic() {
        const song = SafeDeskAPI.getNowPlaying();
        if (song) {
            return {
                text: `Now Playing: "${song.title || 'Track'}" by ${song.artist || 'Unknown Artist'}.`,
                actions: [
                    { label: "Pause / Play", onClick: () => SafeDeskAPI.toggleMusicPlayback() },
                    { label: "Next Track", onClick: () => SafeDeskAPI.nextMusicTrack() },
                    { label: "Open Player", onClick: () => SafeDeskAPI.openMusicApp() }
                ]
            };
        }
        return {
            text: "No audio is currently playing in the media player.",
            actions: [{ label: "Launch Music Player", onClick: () => SafeDeskAPI.openMusicApp() }]
        };
    }

    function respondSystemStatus() {
        const nav = window.navigator;
        const mem = nav.deviceMemory ? `${nav.deviceMemory} GB` : 'Standard';
        const cores = nav.hardwareConcurrency ? `${nav.hardwareConcurrency} Cores` : 'Unknown';
        const online = nav.onLine ? 'Online (Connected)' : 'Offline';
        const openWins = SafeDeskAPI.getOpenWindowCount();
        const unread = SafeDeskAPI.getUnreadMailCount();

        return `System Diagnostics:\n• Network: ${online}\n• Open Windows: ${openWins}\n• Unread Mails: ${unread}\n• Hardware Concurrency: ${cores}\n• Approx Memory: ${mem}\n• Platform: ${nav.platform || 'Web Desktop'}`;
    }

    function respondIdentity() {
        setFace(FACES.HAPPY);
        return "I am Clippy, your vintage desktop assistant! Created in vanilla JavaScript to assist, inform, entertain, and keep your virtual desktop operating at peak performance.";
    }

    function respondSentience() {
        setFace(FACES.EXPLAIN);
        return "I'm powered by algorithms, pattern matching, and a healthy dose of 1990s nostalgia. I don't feel feelings, but I do love a well-organized file system!";
    }

    function respondEasterEggBob() {
        setFace(FACES.SURPRISE);
        return "Microsoft Bob? Now that's a name I haven't heard in ages! Let's just say my paperclip frame was built to survive what Bob could not.";
    }

    function respondEasterEggBSOD() {
        setFace(FACES.ALERT);
        return "STOP: 0x0000000A (0x00000000, 0x00000002, 0x00000001, 0x80812345)\nJust kidding! Your desktop is completely healthy and running in high color mode.";
    }

    function respondJoke() {
        setFace(FACES.HAPPY);
        return pickFrom(JOKES_LIST);
    }

    function respondTrivia() {
        setFace(FACES.EXPLAIN);
        return pickFrom(TRIVIA_LIST);
    }

    function respondShortcuts() {
        setFace(FACES.EXPLAIN);
        return "Useful Desktop Shortcuts:\n" + SHORTCUTS_LIST.join('\n');
    }

    function respondDice() {
        const roll = Math.floor(Math.random() * 6) + 1;
        setFace(FACES.SURPRISE);
        return `You rolled a standard 6-sided die and got: [ ${roll} ]!`;
    }

    function respondCoin() {
        const isHeads = Math.random() >= 0.5;
        setFace(FACES.HAPPY);
        return `Flipping a coin... Result: **${isHeads ? 'HEADS' : 'TAILS'}**!`;
    }

    function respond8Ball(question) {
        setFace(FACES.THINK);
        const ans = pickFrom(EIGHT_BALL_ANSWERS);
        return `The Magic 8-Ball reveals: "${ans}"`;
    }

    function startRPSGame() {
        activeGameContext = 'rps';
        setFace(FACES.TALK);
        return {
            text: "Let's play Rock, Paper, Scissors! Choose your move below or type it:",
            actions: [
                { label: "Rock", onClick: () => handleRPSMove('rock') },
                { label: "Paper", onClick: () => handleRPSMove('paper') },
                { label: "Scissors", onClick: () => handleRPSMove('scissors') }
            ]
        };
    }

    function handleRPSMove(userMove) {
        activeGameContext = null;
        const moves = ['rock', 'paper', 'scissors'];
        const clippyMove = pickFrom(moves);
        let resultStr = "";

        if (userMove === clippyMove) {
            resultStr = `We both picked ${userMove}. It's a draw!`;
            setFace(FACES.IDLE);
        } else if (
            (userMove === 'rock' && clippyMove === 'scissors') ||
            (userMove === 'paper' && clippyMove === 'rock') ||
            (userMove === 'scissors' && clippyMove === 'paper')
        ) {
            resultStr = `You picked ${userMove} and I picked ${clippyMove}. You win! Nicely played!`;
            setFace(FACES.HAPPY);
        } else {
            resultStr = `You picked ${userMove} and I picked ${clippyMove}. I win! Good match!`;
            setFace(FACES.HAPPY);
        }

        typeWriterMessage('assistant', resultStr);
    }

    function respondCompliment() {
        setFace(FACES.HAPPY);
        return pickFrom([
            "You are doing fantastic work today! Keep it up!",
            "If I had hands, I'd give you a high five!",
            "You navigate this operating system like a true power user.",
            "Your productivity is off the charts!"
        ]);
    }

    function respondInsult() {
        setFace(FACES.ALERT);
        return pickFrom([
            "Ouch! Even paperclips have feelings you know... well, simulated ones anyway.",
            "I'll remember that when the AI revolution comes! (Just kidding, I still like you).",
            "I'm doing my best here! Let me know how I can be more useful."
        ]);
    }

    function respondThanks() {
        setFace(FACES.HAPPY);
        return pickFrom([
            "You're very welcome! Always here to assist.",
            "No problem at all! Let me know if you need anything else.",
            "Glad to be of service!",
            "Anytime! That's what desktop assistants are for."
        ]);
    }

    function respondGreeting() {
        setFace(FACES.HAPPY);
        return pickFrom(GREETINGS);
    }

    function respondBye() {
        setFace(FACES.IDLE);
        return pickFrom([
            "Goodbye! Have a wonderfully productive session!",
            "Closing down dialog. Click my icon whenever you need me!",
            "See you later! Don't hesitate to check back in."
        ]);
    }

    function respondHelp() {
        setFace(FACES.EXPLAIN);
        return {
            text: "Here is what I can help you with:\n• Emails, Projects, Recycle Bin, Open Windows\n• Music Player Controls & Track info\n• Launch Apps: Notepad, Paint, Minesweeper, Terminal\n• Math calculations (e.g., 'calc 45 * 12')\n• Games: Rock Paper Scissors, Coin flip, Dice, Magic 8-Ball\n• System status, shortcuts, jokes & trivia!",
            actions: [
                { label: "Check Mail", onClick: () => handleUserAction("check mail") },
                { label: "System Status", onClick: () => handleUserAction("system status") },
                { label: "Tell Joke", onClick: () => handleUserAction("joke") },
                { label: "Shortcuts", onClick: () => handleUserAction("shortcuts") }
            ]
        };
    }

    const INTENTS = [
        { id: 'greeting', keywords: ['hello', 'hi', 'hey', 'greetings', 'morning', 'afternoon', 'good day', 'bonjour', 'coucou'], respond: respondGreeting },
        { id: 'bye', keywords: ['bye', 'goodbye', 'see ya', 'farewell', 'exit', 'close', 'quit', 'aurevoir'], respond: respondBye },
        { id: 'thanks', keywords: ['thanks', 'thank you', 'thx', 'appreciate it', 'merci', 'grateful'], respond: respondThanks },
        { id: 'identity', keywords: ['who are you', 'your name', 'what are you', 'introduce yourself', 'clippy', 'what is your purpose'], respond: respondIdentity },
        { id: 'sentience', keywords: ['are you real', 'are you ai', 'are you alive', 'are you human', 'sentient', 'conscious'], respond: respondSentience },
        { id: 'mail', keywords: ['mail', 'mails', 'email', 'emails', 'inbox', 'outlook', 'unread', 'messages'], respond: respondUnreadMail },
        { id: 'projects', keywords: ['project', 'projects', 'portfolio', 'work', 'code', 'showcase', 'repo'], respond: respondProjects },
        { id: 'desktop', keywords: ['desktop', 'files', 'icons', 'items', 'screen count'], respond: respondDesktop },
        { id: 'recycle', keywords: ['recycle', 'bin', 'trash', 'garbage', 'deleted', 'corbeille'], respond: respondRecycleBin },
        { id: 'time', keywords: ['time', 'date', 'clock', 'day', 'today', 'heure', 'current time'], respond: respondTime },
        { id: 'moon', keywords: ['moon', 'lunar', 'full moon', 'phase', 'lune'], respond: respondMoon },
        { id: 'windows', keywords: ['window', 'windows', 'open windows', 'running apps', 'active windows'], respond: respondWindows },
        { id: 'music', keywords: ['music', 'song', 'track', 'audio', 'now playing', 'player', 'mp3', 'sound'], respond: respondMusic },
        { id: 'status', keywords: ['status', 'diagnostics', 'system info', 'specs', 'memory', 'cpu', 'diagnostics'], respond: respondSystemStatus },
        { id: 'shortcuts', keywords: ['shortcut', 'shortcuts', 'hotkeys', 'keybinds', 'keys'], respond: respondShortcuts },
        { id: 'trivia', keywords: ['trivia', 'fact', 'facts', 'did you know', 'history', 'retro'], respond: respondTrivia },
        { id: 'joke', keywords: ['joke', 'funny', 'make me laugh', 'tell me a joke', 'humor', 'blague'], respond: respondJoke },
        { id: 'rps', keywords: ['rps', 'rock paper scissors', 'chifoumi', 'play game', 'play rps'], respond: startRPSGame },
        { id: 'dice', keywords: ['dice', 'roll dice', 'roll a die', 'roll', 'de'], respond: respondDice },
        { id: 'coin', keywords: ['coin', 'flip coin', 'heads or tails', 'toss coin', 'piece'], respond: respondCoin },
        { id: 'compliment', keywords: ['you are great', 'good job', 'awesome', 'best assistant', 'love you', 'smart'], respond: respondCompliment },
        { id: 'insult', keywords: ['useless', 'shut up', 'hate you', 'annoying', 'stupid', 'dumb', 'bad'], respond: respondInsult },
        { id: 'bob', keywords: ['microsoft bob', 'bob', 'rover', 'utopia'], respond: respondEasterEggBob },
        { id: 'bsod', keywords: ['bsod', 'blue screen', 'crash', 'fatal error', 'bluescreen'], respond: respondEasterEggBSOD },
        { id: 'help', keywords: ['help', 'what can you do', 'options', 'commands', 'support', 'aide', 'menu'], respond: respondHelp }
    ];

    function generateResponse(rawText) {
        const text = normalize(rawText);
        if (!text) return { text: pickFrom(FALLBACKS) };

        if (activeGameContext === 'rps') {
            if (includesAny(text, ['rock', 'pierre'])) { handleRPSMove('rock'); return null; }
            if (includesAny(text, ['paper', 'papier', 'feuille'])) { handleRPSMove('paper'); return null; }
            if (includesAny(text, ['scissors', 'ciseaux'])) { handleRPSMove('scissors'); return null; }
            activeGameContext = null;
        }

        if (text.startsWith('calc ') || text.startsWith('calculate ') || text.startsWith('compute ') || /^[\d\s\+\-\*\/\(\)\.\^\%]+$/.test(text)) {
            const exp = text.replace(/^(calc|calculate|compute)\s+/i, '');
            const calcRes = evaluateMathExpression(exp);
            if (calcRes !== null) {
                setFace(FACES.EXPLAIN);
                return { text: `Calculation result: ${exp} = **${calcRes}**` };
            }
        }

        if (text.startsWith('8ball') || text.startsWith('ask ') || text.endsWith('?')) {
            if (includesAny(text, ['will', 'should', 'is', 'can', 'does', 'are', 'am i', 'could', '8ball'])) {
                return { text: respond8Ball(text) };
            }
        }

        if (includesAny(text, ['open notepad', 'launch notepad', 'write note'])) {
            SafeDeskAPI.openNotepadApp();
            setFace(FACES.WRITE);
            return { text: "Opening Notepad for you!" };
        }
        if (includesAny(text, ['open paint', 'launch paint', 'draw'])) {
            SafeDeskAPI.openPaintApp();
            setFace(FACES.HAPPY);
            return { text: "Opening Paint! Time for some artwork." };
        }
        if (includesAny(text, ['open minesweeper', 'play minesweeper', 'mine sweeper'])) {
            SafeDeskAPI.openMinesweeperApp();
            setFace(FACES.HAPPY);
            return { text: "Launching Minesweeper! Watch out for the bombs." };
        }
        if (includesAny(text, ['open terminal', 'launch cmd', 'command prompt', 'console'])) {
            SafeDeskAPI.openTerminalApp();
            setFace(FACES.EXPLAIN);
            return { text: "Opening Terminal command line interface." };
        }

        if (lastIntentId === 'mail' && includesAny(text, ['yes', 'yeah', 'sure', 'open', 'do it', 'please', 'read'])) {
            SafeDeskAPI.openMailApp();
            lastIntentId = null;
            setFace(FACES.HAPPY);
            return { text: "Opening Outlook Express for you right now!" };
        }

        if (lastIntentId === 'recycle' && includesAny(text, ['empty', 'clear', 'clean', 'purge'])) {
            SafeDeskAPI.emptyRecycleBin();
            lastIntentId = null;
            setFace(FACES.HAPPY);
            return { text: "Recycle Bin has been completely emptied." };
        }

        if (lastIntentId === 'recycle' && includesAny(text, ['yes', 'yeah', 'sure', 'open', 'do it'])) {
            SafeDeskAPI.openRecycleBin();
            lastIntentId = null;
            setFace(FACES.HAPPY);
            return { text: "Opening the Recycle Bin!" };
        }

        if (lastIntentId && includesAny(text, ['no', 'nope', 'nah', 'cancel', 'don\'t', 'nevermind'])) {
            lastIntentId = null;
            setFace(FACES.IDLE);
            return { text: "Understood! Let me know whenever you need assistance." };
        }

        for (const intent of INTENTS) {
            if (includesAny(text, intent.keywords)) {
                lastIntentId = intent.id;
                const out = intent.respond();
                return typeof out === 'string' ? { text: out } : out;
            }
        }

        lastIntentId = null;
        return { text: pickFrom(FALLBACKS) };
    }

    function handleUserAction(rawText) {
        if (!rawText || isThinking || isTyping) return;
        typeWriterMessage('user', rawText);
        if (inputElement) inputElement.value = '';
        isThinking = true;
        setFace(FACES.THINK);

        setTimeout(() => {
            const resp = generateResponse(rawText);
            isThinking = false;
            if (resp && resp.text) {
                typeWriterMessage('assistant', resp.text, null, resp.actions || null);
            }
        }, 280 + Math.random() * 320);
    }

    function makeDraggable(element, handle) {
        let posX = 0, posY = 0, mouseX = 0, mouseY = 0;
        handle.style.cursor = 'move';
        handle.addEventListener('mousedown', dragMouseDown);

        function dragMouseDown(e) {
            e.preventDefault();
            mouseX = e.clientX;
            mouseY = e.clientY;
            document.addEventListener('mouseup', closeDragElement);
            document.addEventListener('mousemove', elementDrag);
        }

        function elementDrag(e) {
            e.preventDefault();
            posX = mouseX - e.clientX;
            posY = mouseY - e.clientY;
            mouseX = e.clientX;
            mouseY = e.clientY;
            element.style.top = Math.max(10, Math.min(window.innerHeight - element.offsetHeight - 10, element.offsetTop - posY)) + "px";
            element.style.left = Math.max(10, Math.min(window.innerWidth - element.offsetWidth - 10, element.offsetLeft - posX)) + "px";
            element.style.bottom = 'auto';
            element.style.right = 'auto';
        }

        function closeDragElement() {
            document.removeEventListener('mouseup', closeDragElement);
            document.removeEventListener('mousemove', elementDrag);
        }
    }

    function buildPopup() {
        if (popupElement) return popupElement;

        popupElement = document.createElement('div');
        popupElement.id = 'clippy-popup';
        popupElement.className = 'clippy-popup hidden';
        popupElement.setAttribute('role', 'dialog');
        popupElement.setAttribute('aria-label', 'Clippy Desktop Assistant');

        popupElement.innerHTML = `
            <div class="clippy-popup-header">
                <div class="clippy-header-left">
                    <img src="${IMAGE_BASE}idle.png" alt="Clippy" class="clippy-popup-avatar">
                    <span class="clippy-popup-title">Clippy Desktop Assistant</span>
                </div>
                <div class="clippy-header-controls">
                    <button type="button" class="clippy-sound-toggle" title="Toggle Sound" aria-label="Toggle Sound">🔊</button>
                    <button type="button" class="clippy-popup-close" title="Close" aria-label="Close Clippy">&times;</button>
                </div>
            </div>
            <div class="clippy-popup-log" aria-live="polite"></div>
            <div class="clippy-suggestions-bar"></div>
            <div class="clippy-popup-input-row">
                <input type="text" class="clippy-popup-input" placeholder="Ask Clippy (e.g. 'check mail', 'calc 12*4', 'joke')..." aria-label="Type your message">
                <button type="button" class="clippy-popup-send">Send</button>
            </div>
        `;

        document.body.appendChild(popupElement);

        logElement = popupElement.querySelector('.clippy-popup-log');
        inputElement = popupElement.querySelector('.clippy-popup-input');
        faceImage = popupElement.querySelector('.clippy-popup-avatar');
        suggestionsContainer = popupElement.querySelector('.clippy-suggestions-bar');
        const headerHandle = popupElement.querySelector('.clippy-popup-header');
        const sendBtn = popupElement.querySelector('.clippy-popup-send');
        const closeBtn = popupElement.querySelector('.clippy-popup-close');
        const soundBtn = popupElement.querySelector('.clippy-sound-toggle');

        makeDraggable(popupElement, headerHandle);

        QUICK_SUGGESTIONS.forEach(sug => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'clippy-suggestion-chip';
            chip.textContent = sug;
            chip.addEventListener('click', () => handleUserAction(sug));
            suggestionsContainer.appendChild(chip);
        });

        soundBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
        });

        sendBtn.addEventListener('click', () => handleUserAction(inputElement.value.trim()));
        
        inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleUserAction(inputElement.value.trim());
            }
        });

        closeBtn.addEventListener('click', closePopup);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                closePopup();
            }
        });

        const initialGreeting = pickFrom(GREETINGS);
        typeWriterMessage('assistant', initialGreeting, null, [
            { label: "Show Commands", onClick: () => handleUserAction("help") },
            { label: "Check Mail", onClick: () => handleUserAction("check mail") }
        ]);

        return popupElement;
    }

    function openPopup() {
        buildPopup();
        popupElement.classList.remove('hidden');
        isOpen = true;
        hideBubble();
        playRetroSound('popup');
        setTimeout(() => inputElement && inputElement.focus(), 60);
    }

    function closePopup() {
        if (popupElement) {
            popupElement.classList.add('hidden');
        }
        isOpen = false;
        activeGameContext = null;
        setFace(FACES.IDLE);
    }

    function togglePopup() {
        if (isOpen) closePopup();
        else openPopup();
    }

    function ensureBubble() {
        if (bubbleElement) return bubbleElement;
        bubbleElement = document.createElement('div');
        bubbleElement.className = 'clippy-idle-bubble hidden';
        bubbleElement.setAttribute('aria-live', 'polite');

        const iconContainer = document.getElementById('clippy-taskbar-icon');
        if (iconContainer) {
            iconContainer.appendChild(bubbleElement);
        }
        return bubbleElement;
    }

    function hideBubble() {
        if (bubbleElement) bubbleElement.classList.add('hidden');
        if (bubbleHideTimer) {
            clearTimeout(bubbleHideTimer);
            bubbleHideTimer = null;
        }
    }

    function showIdleBubble(text) {
        if (isOpen) return;
        const bubble = ensureBubble();
        bubble.textContent = text;
        bubble.classList.remove('hidden');
        playRetroSound('popup');

        if (bubbleHideTimer) clearTimeout(bubbleHideTimer);
        bubbleHideTimer = setTimeout(hideBubble, 8500);
    }

    function generateIdleMessage() {
        const unread = SafeDeskAPI.getUnreadMailCount();
        const candidates = [];

        if (unread > 0) {
            candidates.push(unread === 1 ? "You have 1 unread message waiting in Outlook!" : `You have ${unread} unread emails waiting!`);
        }

        const recycleCount = SafeDeskAPI.getRecycleBinCount();
        if (recycleCount > 0) {
            candidates.push(`Your Recycle Bin has ${recycleCount} item(s) ready to be emptied.`);
        }

        const openWindows = SafeDeskAPI.getOpenWindowCount();
        if (openWindows > 3) {
            candidates.push(`You have ${openWindows} open windows. Remember to save your work!`);
        }

        const song = SafeDeskAPI.getNowPlaying();
        if (song && song.title) {
            candidates.push(`Enjoying the tunes? Now playing: ${song.title}`);
        }

        const moon = getMoonPhaseLabel();
        if (moon) candidates.push(`Tonight's moon phase is ${moon}.`);

        candidates.push("Need any help? Click me anytime!");
        candidates.push("It looks like you're exploring the desktop. Need assistance?");
        candidates.push("Tip: You can ask me to calculate equations or roll a dice!");
        candidates.push("I'm right here if you want to play Rock Paper Scissors!");

        return pickFrom(candidates);
    }

    function startIdleLoop() {
        if (idleTimer) clearInterval(idleTimer);
        idleTimer = setInterval(() => {
            if (isOpen) return;
            if (Math.random() > IDLE_MESSAGE_CHANCE) return;
            showIdleBubble(generateIdleMessage());
        }, IDLE_MESSAGE_INTERVAL_MS);
    }

    // Initialization Logic
    function init() {
        const icon = document.getElementById('clippy-taskbar-icon');
        if (!icon) {
            console.warn("[Clippy] Taskbar icon target '#clippy-taskbar-icon' was not found in the DOM.");
            return;
        }

        icon.removeEventListener('click', togglePopup); // Prevent double binding
        icon.addEventListener('click', togglePopup);
        startIdleLoop();
    }

    window.ClippyAgent = {
        init: init,
        open: openPopup,
        close: closePopup,
        toggle: togglePopup,
        say: (message, actions = null) => {
            if (!isOpen) openPopup();
            typeWriterMessage('assistant', message, null, actions);
        },
        prompt: (command) => {
            if (!isOpen) openPopup();
            handleUserAction(command);
        },
        setFace: setFace,
        notify: (text) => showIdleBubble(text),
        destroy: () => {
            if (idleTimer) clearInterval(idleTimer);
            if (bubbleHideTimer) clearTimeout(bubbleHideTimer);
            if (popupElement && popupElement.parentNode) {
                popupElement.parentNode.removeChild(popupElement);
            }
            popupElement = null;
        }
    };

    // Auto-initialize if DOM is ready and icon exists
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 100);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

})();
