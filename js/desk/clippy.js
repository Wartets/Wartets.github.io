(function () {
    'use strict';

    const IMAGE_BASE = '../assets/images/desk/clippy/';
    const IDLE_MESSAGE_INTERVAL_MS = 55000;
    const IDLE_MESSAGE_CHANCE = 0.7;
    const TYPEWRITER_SPEED_MS = 14;

    const STORAGE_KEY_TODOS = 'clippy_user_todos_v2';
    const STORAGE_KEY_PET = 'clippy_pet_state_v2';
    const STORAGE_KEY_NOTES = 'clippy_user_scratchpad';
    const STORAGE_KEY_STATS = 'clippy_user_stats';

    let popupElement = null;
    let logElement = null;
    let inputElement = null;
    let faceImage = null;
    let bubbleElement = null;
    let suggestionsContainer = null;
    let isOpen = false;
    let lastIntentId = null;
    let activeGameContext = null;
    let gameState = {};
    let idleTimer = null;
    let bubbleHideTimer = null;
    let activePomodoroTimer = null;
    let isThinking = false;
    let isTyping = false;
    let soundEnabled = true;
    let audioCtx = null;

    const FACES = {
        IDLE: 'idle.png',
        THINK: 'think.png'
    };

    const QUICK_SUGGESTIONS = [
        "What can you do?",
        "Check unread emails",
        "System diagnostics",
        "Inspect active windows",
        "Show desktop items",
        "Recycle bin status",
        "Play Tic-Tac-Toe",
        "Play Memory Game",
        "Play Hangman",
        "Tech Trivia Quiz",
        "Guess the Number",
        "Rock Paper Scissors",
        "Pet Clippy status",
        "Defrag Drive C:",
        "Start Pomodoro Timer",
        "View To-Do List",
        "Open Scratchpad Note",
        "Tell me a joke",
        "Random Retro Trivia",
        "Keyboard Shortcuts",
        "Generate Secure Password",
        "Convert 100 km to miles",
        "Convert 32 celsius to fahrenheit",
        "Convert 1024 mb to gb",
        "Calc sqrt(144) * 5 + cos(0)",
        "Calc 2^10 * log10(100)",
        "System uptime and clock",
        "Lunar phase details"
    ];

    const GREETINGS = [
        "Greetings! It looks like you are exploring the Windows XP workstation. How may I assist your workflow today?",
        "Clippit at your service. All 32-bit subsystem routines are active and operating at nominal efficiency.",
        "Welcome back to the desktop environment. I am standing by to assist with task tracking, diagnostics, math, or retro entertainment.",
        "Hello! I noticed you opened the assistant panel. Would you like me to inspect your inbox, check system resources, or run a diagnostic?",
        "Ready for maximum productivity! Type any command into the prompt or click one of the quick action chips below.",
        "Bonjour! Clippy is online. I can compute formulas, convert metric units, track your to-do list, or defragment drive C:.",
        "System initialization complete. Sound subsystems active, graphical interface synchronized. What shall we work on today?",
        "Need assistance holding your projects together? I am anchored right here in your system notification tray.",
        "Workstation status: Memory allocated, processor responsive, display resolution calibrated. Let me know what you need.",
        "Good day! Whether you need to calculate complex equations, generate passwords, or review keyboard hotkeys, I am at your disposal.",
        "Hello! Did you know you can type commands like 'todo add Review files', 'convert 50 kmh to mph', or 'quiz' directly into the console?",
        "Greetings, user. Workspace telemetry indicates zero critical faults. Standing by for user instructions.",
        "Need a hand navigating the interface? Ask me to launch Notepad, Paint, Minesweeper, or check your running windows.",
        "Interactive assistant ready. All Office 97 heuristics and Windows XP management subroutines are fully loaded.",
        "Welcome! It appears you are working on something interesting. Let me know if you need assistance organizing your workspace."
    ];

    const FALLBACKS = [
        "Command not recognized by current system heuristics. Type 'help' or 'commands' to inspect all supported instructions.",
        "My indexing parser was unable to match your inquiry. You can try asking about mail, running windows, system specs, or games.",
        "Query unresolved. You can evaluate math expressions ('calc 2^8 * 4'), convert units ('convert 100 c to f'), or start a focus timer ('timer 25').",
        "Instruction syntax not found in workstation index. Try typing 'quiz', 'memory', 'hangman', 'tictactoe', 'defrag', or 'todo list'.",
        "Unable to execute specified request. For a detailed list of desktop capabilities, please enter 'help' or click a suggestion chip below.",
        "The syntax could not be resolved by the assistant subroutines. Ensure correct spelling or type 'shortcuts' to review useful hotkeys.",
        "Command syntax unindexed. You may query system memory, check the recycle bin, inspect open windows, or generate a strong password.",
        "Instruction not understood. If you wish to manage your tasks, type 'todo add [Task description]' or 'todo clear'.",
        "Heuristic analysis returned zero definitive matches. Enter 'diagnostics' to review machine statistics or 'trivia' for retro tech history.",
        "The command interpreter could not parse your statement. Type 'help' for comprehensive system documentation."
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
        }
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
            const now = audioCtx.currentTime;

            if (type === 'type') {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(520 + Math.random() * 180, now);
                gain.gain.setValueAtTime(0.015, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
                osc.start(now);
                osc.stop(now + 0.025);
            } else if (type === 'popup') {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(360, now);
                osc.frequency.exponentialRampToValueAtTime(720, now + 0.14);
                gain.gain.setValueAtTime(0.045, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
                osc.start(now);
                osc.stop(now + 0.14);
            } else if (type === 'action') {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(587.33, now);
                osc.frequency.setValueAtTime(880.00, now + 0.06);
                gain.gain.setValueAtTime(0.035, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
                osc.start(now);
                osc.stop(now + 0.14);
            } else if (type === 'crunch') {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = 'square';
                osc.frequency.setValueAtTime(120 + Math.random() * 80, now);
                gain.gain.setValueAtTime(0.02, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
                osc.start(now);
                osc.stop(now + 0.04);
            } else if (type === 'win') {
                [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.06);
                    gain.gain.setValueAtTime(0.045, now + idx * 0.06);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.12);
                    osc.start(now + idx * 0.06);
                    osc.stop(now + idx * 0.06 + 0.12);
                });
            } else if (type === 'lose') {
                [440, 370, 311, 220, 164.81].forEach((freq, idx) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.08);
                    gain.gain.setValueAtTime(0.025, now + idx * 0.08);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.14);
                    osc.start(now + idx * 0.08);
                    osc.stop(now + idx * 0.08 + 0.14);
                });
            } else if (type === 'tada') {
                [440, 554.37, 659.25, 880, 1108.73].forEach((freq, idx) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.08);
                    gain.gain.setValueAtTime(0.045, now + idx * 0.08);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.16);
                    osc.start(now + idx * 0.08);
                    osc.stop(now + idx * 0.08 + 0.16);
                });
            }
        } catch (e) {}
    }

    function setVisualState(state) {
        if (!faceImage) return;
        faceImage.classList.remove('clippy-anim-nod', 'clippy-anim-think', 'clippy-anim-wiggle', 'clippy-anim-shake');

        if (state === 'think' || state === 'alert') {
            faceImage.src = `${IMAGE_BASE}${FACES.THINK}`;
            faceImage.classList.add(state === 'think' ? 'clippy-anim-think' : 'clippy-anim-shake');
        } else {
            faceImage.src = `${IMAGE_BASE}${FACES.IDLE}`;
            if (state === 'talk' || state === 'happy') faceImage.classList.add('clippy-anim-nod');
            else if (state === 'surprise' || state === 'write') faceImage.classList.add('clippy-anim-wiggle');
        }
    }

    function scrollLogToBottom() {
        if (logElement) logElement.scrollTop = logElement.scrollHeight;
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
        let exp = str.toLowerCase()
            .replace(/\basin\b/g, 'Math.asin')
            .replace(/\bacos\b/g, 'Math.acos')
            .replace(/\batan\b/g, 'Math.atan')
            .replace(/\bsin\b/g, 'Math.sin')
            .replace(/\bcos\b/g, 'Math.cos')
            .replace(/\btan\b/g, 'Math.tan')
            .replace(/\bsqrt\b/g, 'Math.sqrt')
            .replace(/\bcbrt\b/g, 'Math.cbrt')
            .replace(/\babs\b/g, 'Math.abs')
            .replace(/\bfloor\b/g, 'Math.floor')
            .replace(/\bceil\b/g, 'Math.ceil')
            .replace(/\bround\b/g, 'Math.round')
            .replace(/\blog10\b/g, 'Math.log10')
            .replace(/\blog2\b/g, 'Math.log2')
            .replace(/\blog\b/g, 'Math.log10')
            .replace(/\bln\b/g, 'Math.log')
            .replace(/\bexp\b/g, 'Math.exp')
            .replace(/\bpi\b/g, 'Math.PI')
            .replace(/\be\b/g, 'Math.E')
            .replace(/\^/g, '**');

        const allowed = /^[0-9+\-*/(). %**\sMath\.sincotaqrbelgPIEfloundexp210]+$/;
        if (!allowed.test(exp)) return null;

        try {
            const result = Function(`'use strict'; return (${exp})`)();
            if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
                return Math.round(result * 100000000) / 100000000;
            }
        } catch (e) {}
        return null;
    }

    function parseUnitConversion(text) {
        const match = text.match(/([\d\.]+)\s*(km|mi|miles|mile|meters|meter|m|ft|feet|foot|yd|yards|yard|cm|mm|nm|inch|in|kg|lbs|pounds|pound|g|oz|ounces|ounce|ton|tons|c|f|k|celsius|fahrenheit|kelvin|tb|gb|mb|kb|bytes|byte|b|bits|bit|kmh|mph|knot|knots|ms|liters|liter|l|ml|gallons|gallon|gal|floz|bar|psi|pa|atm|deg|rad)\s*(?:to|in|en|vers)\s*(km|mi|miles|mile|meters|meter|m|ft|feet|foot|yd|yards|yard|cm|mm|nm|inch|in|kg|lbs|pounds|pound|g|oz|ounces|ounce|ton|tons|c|f|k|celsius|fahrenheit|kelvin|tb|gb|mb|kb|bytes|byte|b|bits|bit|kmh|mph|knot|knots|ms|liters|liter|l|ml|gallons|gallon|gal|floz|bar|psi|pa|atm|deg|rad)/i);
        if (!match) return null;

        const val = parseFloat(match[1]);
        const from = match[2].toLowerCase();
        const to = match[3].toLowerCase();

        if (isNaN(val)) return null;

        if ((from === 'km') && (to === 'mi' || to === 'miles' || to === 'mile')) return `${val} km = ${(val * 0.621371).toFixed(4)} miles`;
        if ((from === 'mi' || from === 'miles' || from === 'mile') && to === 'km') return `${val} miles = ${(val * 1.609344).toFixed(4)} km`;
        if ((from === 'm' || from === 'meters' || from === 'meter') && (to === 'ft' || to === 'feet' || to === 'foot')) return `${val} m = ${(val * 3.28084).toFixed(4)} feet`;
        if ((from === 'ft' || from === 'feet' || from === 'foot') && (to === 'm' || to === 'meters' || to === 'meter')) return `${val} feet = ${(val * 0.3048).toFixed(4)} m`;
        if ((from === 'm' || from === 'meters' || from === 'meter') && (to === 'yd' || to === 'yards' || to === 'yard')) return `${val} m = ${(val * 1.09361).toFixed(4)} yards`;
        if ((from === 'yd' || from === 'yards' || from === 'yard') && (to === 'm' || to === 'meters' || to === 'meter')) return `${val} yards = ${(val * 0.9144).toFixed(4)} m`;
        if ((from === 'cm') && (to === 'inch' || to === 'in')) return `${val} cm = ${(val * 0.393701).toFixed(4)} inches`;
        if ((from === 'inch' || from === 'in') && to === 'cm') return `${val} inches = ${(val * 2.54).toFixed(4)} cm`;
        if ((from === 'mm') && (to === 'inch' || to === 'in')) return `${val} mm = ${(val * 0.0393701).toFixed(4)} inches`;
        if ((from === 'inch' || from === 'in') && to === 'mm') return `${val} inches = ${(val * 25.4).toFixed(4)} mm`;

        if ((from === 'kg') && (to === 'lbs' || to === 'pounds' || to === 'pound')) return `${val} kg = ${(val * 2.20462).toFixed(4)} lbs`;
        if ((from === 'lbs' || from === 'pounds' || from === 'pound') && to === 'kg') return `${val} lbs = ${(val * 0.453592).toFixed(4)} kg`;
        if ((from === 'g') && (to === 'oz' || to === 'ounces' || to === 'ounce')) return `${val} g = ${(val * 0.035274).toFixed(4)} oz`;
        if ((from === 'oz' || from === 'ounces' || from === 'ounce') && to === 'g') return `${val} oz = ${(val * 28.34952).toFixed(4)} g`;
        if ((from === 'ton' || from === 'tons') && (to === 'kg')) return `${val} tons = ${(val * 1000).toFixed(2)} kg`;
        if ((from === 'kg') && (to === 'ton' || to === 'tons')) return `${val} kg = ${(val / 1000).toFixed(4)} tons`;

        if ((from === 'c' || from === 'celsius') && (to === 'f' || to === 'fahrenheit')) return `${val} °C = ${((val * 9/5) + 32).toFixed(2)} °F`;
        if ((from === 'f' || from === 'fahrenheit') && (to === 'c' || to === 'celsius')) return `${val} °F = ${(((val - 32) * 5)/9).toFixed(2)} °C`;
        if ((from === 'c' || from === 'celsius') && (to === 'k' || to === 'kelvin')) return `${val} °C = ${(val + 273.15).toFixed(2)} K`;
        if ((from === 'k' || from === 'kelvin') && (to === 'c' || to === 'celsius')) return `${val} K = ${(val - 273.15).toFixed(2)} °C`;

        if (from === 'tb' && to === 'gb') return `${val} TB = ${val * 1024} GB`;
        if (from === 'gb' && to === 'tb') return `${val} GB = ${(val / 1024).toFixed(4)} TB`;
        if (from === 'gb' && to === 'mb') return `${val} GB = ${val * 1024} MB`;
        if (from === 'mb' && to === 'gb') return `${val} MB = ${(val / 1024).toFixed(4)} GB`;
        if (from === 'mb' && to === 'kb') return `${val} MB = ${val * 1024} KB`;
        if (from === 'kb' && to === 'mb') return `${val} KB = ${(val / 1024).toFixed(4)} MB`;
        if (from === 'kb' && (to === 'bytes' || to === 'byte' || to === 'b')) return `${val} KB = ${val * 1024} Bytes`;
        if ((from === 'bytes' || from === 'byte' || from === 'b') && (to === 'bits' || to === 'bit')) return `${val} Bytes = ${val * 8} Bits`;
        if ((from === 'bits' || from === 'bit') && (to === 'bytes' || to === 'byte' || to === 'b')) return `${val} Bits = ${(val / 8).toFixed(2)} Bytes`;

        if (from === 'kmh' && to === 'mph') return `${val} km/h = ${(val * 0.621371).toFixed(3)} mph`;
        if (from === 'mph' && to === 'kmh') return `${val} mph = ${(val * 1.60934).toFixed(3)} km/h`;
        if (from === 'ms' && to === 'kmh') return `${val} m/s = ${(val * 3.6).toFixed(3)} km/h`;
        if (from === 'kmh' && to === 'ms') return `${val} km/h = ${(val / 3.6).toFixed(3)} m/s`;
        if ((from === 'knot' || from === 'knots') && to === 'kmh') return `${val} knots = ${(val * 1.852).toFixed(3)} km/h`;

        if ((from === 'liters' || from === 'liter' || from === 'l') && (to === 'gallons' || to === 'gallon' || to === 'gal')) return `${val} L = ${(val * 0.264172).toFixed(4)} gal`;
        if ((from === 'gallons' || from === 'gallon' || from === 'gal') && (to === 'liters' || to === 'liter' || to === 'l')) return `${val} gal = ${(val * 3.78541).toFixed(4)} L`;
        if ((from === 'ml') && (to === 'floz')) return `${val} mL = ${(val * 0.033814).toFixed(4)} fl oz`;
        if ((from === 'floz') && (to === 'ml')) return `${val} fl oz = ${(val * 29.5735).toFixed(4)} mL`;

        if (from === 'bar' && to === 'psi') return `${val} bar = ${(val * 14.5038).toFixed(3)} psi`;
        if (from === 'psi' && to === 'bar') return `${val} psi = ${(val * 0.0689476).toFixed(4)} bar`;
        if (from === 'atm' && to === 'pa') return `${val} atm = ${(val * 101325).toFixed(0)} Pa`;
        if (from === 'pa' && to === 'atm') return `${val} Pa = ${(val / 101325).toFixed(6)} atm`;

        if (from === 'deg' && to === 'rad') return `${val} deg = ${(val * Math.PI / 180).toFixed(6)} rad`;
        if (from === 'rad' && to === 'deg') return `${val} rad = ${(val * 180 / Math.PI).toFixed(4)} deg`;

        return null;
    }

    function generateSecurePassword(length = 14) {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*()_+-=';
        let res = '';
        for (let i = 0; i < length; i++) {
            res += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return res;
    }

    function getStoredTodos() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY_TODOS) || '[]'); }
        catch (e) { return []; }
    }

    function saveStoredTodos(todos) {
        try { localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos)); }
        catch (e) {}
    }

    function getPetState() {
        try {
            const now = Date.now();
            const defaultPet = { hunger: 30, energy: 85, happiness: 85, level: 1, xp: 15, lastUpdate: now };
            let pet = JSON.parse(localStorage.getItem(STORAGE_KEY_PET) || 'null');
            if (!pet) return defaultPet;

            const elapsedMinutes = Math.min(180, Math.floor((now - (pet.lastUpdate || now)) / 60000));
            if (elapsedMinutes > 0) {
                pet.hunger = Math.min(100, pet.hunger + Math.floor(elapsedMinutes * 0.3));
                pet.energy = Math.max(0, pet.energy - Math.floor(elapsedMinutes * 0.2));
                pet.happiness = Math.max(0, pet.happiness - Math.floor(elapsedMinutes * 0.25));
                pet.lastUpdate = now;
                savePetState(pet);
            }
            return pet;
        } catch (e) {
            return { hunger: 30, energy: 85, happiness: 85, level: 1, xp: 15, lastUpdate: Date.now() };
        }
    }

    function savePetState(pet) {
        try {
            pet.lastUpdate = Date.now();
            while (pet.xp >= pet.level * 50) {
                pet.xp -= pet.level * 50;
                pet.level++;
            }
            localStorage.setItem(STORAGE_KEY_PET, JSON.stringify(pet));
        } catch (e) {}
    }

    function trackStat(key) {
        try {
            const stats = JSON.parse(localStorage.getItem(STORAGE_KEY_STATS) || '{}');
            stats[key] = (stats[key] || 0) + 1;
            localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
        } catch (e) {}
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
        setVisualState('talk');
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
                setVisualState('idle');

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
        "Why do programmers prefer dark mode? Because light attracts bugs.",
        "Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25.",
        "I asked the paperclip next door if he was doing alright. He told me: 'I am holding things together!'",
        "Why was the computer cold? It left too many Windows open.",
        "There are 10 types of people in the world: those who understand binary, and those who do not.",
        "A SQL query walks into a bar, approaches two tables and asks: 'May I JOIN you?'",
        "Hardware is the part of a computer you can kick; software is the part you can only curse at.",
        "Why did the developer go bankrupt? Because they cleaned out all their cache.",
        "An SEO specialist walks into a bar, bars, tavern, pub, beer, wine, alcohol, lounge, brewery.",
        "What is a software engineer's favorite refreshment station? Foo Bar.",
        "To understand what recursion is, you must first understand recursion.",
        "Why do C# and Java developers wear glasses? Because they cannot C clearly.",
        "A user interface is like a joke: if you have to explain it, it was poorly designed.",
        "Standard BIOS message: Keyboard not detected. Press F1 to resume operation.",
        "There are two hard problems in Computer Science: cache invalidation, naming things, and off-by-one errors.",
        "A programmer's spouse says: 'Go to the store and buy a loaf of bread. If they have fresh eggs, buy a dozen.' The programmer returns with 12 loaves of bread.",
        "How many software engineers does it take to replace a burned-out light bulb? None, that is classified as a physical hardware defect.",
        "Real programmers always index collections starting from offset 0.",
        "!false -- it is mathematically accurate because it evaluates to true.",
        "Why was the asynchronous JavaScript routine so aloof? Because it made too many unresolved Promises.",
        "What do you call a data collection of exactly 8 hobbits? A hobbyte.",
        "Why did the relational database administrator file for divorce? Too many unindexed one-to-many relationships.",
        "There is no place like 127.0.0.1.",
        "Why did the functional program crash? It encountered an unexpected side effect.",
        "A tester walks into a bar and orders a beer, 0 beers, 99999999 beers, a lizard, -1 beers, and a null string. The first real patron asks where the restroom is and the bar burns down.",
        "Why do assembly programmers prefer working in the basement? Because they operate directly on the bare metal.",
        "Optimist: The glass is half full. Pessimist: The glass is half empty. Programmer: The allocated buffer is twice as large as necessary.",
        "Why did the Boolean variable get rejected for a loan? It could not provide a non-null guarantee.",
        "What did the router say to the data packet? 'Stop broadcasting, you are causing a collision in my subnet.'",
        "How did the developer handle their stress? They pushed all pending changes to production on Friday afternoon.",
        "Why did the object-oriented developer get confused in the hardware store? They could not find an instance of the abstract hammer class.",
        "Why did the computer keep freezing during boot? It had a bad case of cold boot syndrome.",
        "What is the difference between a bug and a feature? A feature is simply a bug with formal documentation.",
        "Why did the network packet cross the gateway? To reach the default route on the other side.",
        "Why was the pointer arithmetic confusing? Because it was pointing at nothing in particular.",
        "What is a compiler's favorite genre of music? Heavy Metal, compiled straight to machine code.",
        "Why do sysadmins love automation scripts? Because repetition without automation is unallocated CPU cycles.",
        "Why did the terminal prompt refuse to cooperate? Access denied: superuser privileges required.",
        "What happens when you declare an infinite loop without a break statement? See: What happens when you declare an infinite loop without a break statement."
    ];

    const TRIVIA_LIST = [
        "The original Clippy character (internally named Clippit) was designed in 1994 by Kevan J. Atteberry on an Apple Macintosh workstation.",
        "In Windows 95, the six-second ambient startup sound was composed by ambient pioneer Brian Eno on an Apple Mac using synthesizer processing.",
        "The first computer mouse prototype was built in 1964 by Douglas Engelbart at Stanford Research Institute, featuring a carved wooden chassis and two perpendicular wheels.",
        "The Apollo 11 Guidance Computer (AGC) operated with exactly 2,048 words (approximately 4 KB) of RAM and 36,864 words (approximately 72 KB) of core rope ROM.",
        "The iconic Windows XP default wallpaper 'Bliss' is an unedited photograph captured in Sonoma County, California in January 1996 by photographer Charles O'Rear using a Mamiya RZ67 camera.",
        "The computer term 'debugging' was popularized after Grace Hopper and her team found a physical moth short-circuiting Relay 70 in Panel F of the Harvard Mark II computer on September 9, 1947.",
        "Windows XP was released to manufacturing (RTM) on August 24, 2001, developed under the internal Microsoft codename 'Whistler'.",
        "3D Pinball for Windows: Space Cadet was originally developed by Cinematronics and published by Maxis in 1995 as part of the 'Full Tilt! Pinball' suite before being integrated into Windows NT and XP.",
        "The text displayed on the original Blue Screen of Death (BSOD) in Windows 3.1 was authored directly by Steve Ballmer while heading the Systems Division at Microsoft.",
        "The initial floppy disk format introduced commercially by IBM in 1971 measured 8 inches (200 mm) in diameter and offered an unformatted capacity of 80 Kilobytes.",
        "The world's first networked webcam was created in 1991 at the University of Cambridge computer laboratory to monitor the physical level of the Trojan Room coffee pot.",
        "The very first commercial Internet domain name ever registered under the .com top-level domain was 'symbolics.com' on March 15, 1985.",
        "The QWERTY mechanical layout was patented in 1878 by Christopher Latham Sholes to physically separate commonly sequential letter pairs and reduce mechanical typewriter jams.",
        "The typeface Comic Sans was created in 1994 by Vincent Connare at Microsoft, inspired by comic book lettering and intended for Microsoft Bob.",
        "The classic Windows XP Luna visual style blue hue is officially specified in hex code as #0055EA with highlight borders at #316AC5.",
        "The FAT32 file system was first introduced to consumer PCs with Windows 95 OSR2 in August 1996, extending partition limits beyond the 2 GB constraint of FAT16.",
        "The maximum addressable physical memory for 32-bit x86 architectures without Physical Address Extension (PAE) enabled is exactly 4,294,967,296 bytes (4 Gigabytes).",
        "The standard VGA graphics mode (Video Graphics Array), introduced by IBM in 1987, specified 640x480 pixel resolution with 16 simultaneous colors from a palette of 262,144.",
        "The first mechanical general-purpose computing engine design, the Analytical Engine, was conceptualized by English mathematician Charles Babbage in 1837.",
        "Ada Lovelace wrote the world's first published machine algorithm in 1843, intended to calculate Bernoulli numbers on Babbage's Analytical Engine.",
        "Ethernet networking was originally invented between 1973 and 1974 by Robert Metcalfe and his colleagues at Xerox PARC.",
        "The standard IPv4 addressing scheme provides an address space of 2^32, which equals exactly 4,294,967,296 unique internet addresses.",
        "The TCP/IP protocol suite officially replaced NCP (Network Control Program) as the core standard of ARPANET on January 1, 1983, often called the birth of the Internet.",
        "The C programming language was developed between 1972 and 1973 by Dennis Ritchie at Bell Labs to rewrite the Unix operating system kernel.",
        "JavaScript was originally designed and implemented in only 10 days in May 1995 by Brendan Eich while working at Netscape Communications.",
        "The standard CD-ROM format (Compact Disc Read-Only Memory) established in the 1985 Yellow Book standard holds up to 650 to 700 MB of data, roughly equivalent to 450 floppy disks.",
        "The first hard disk drive, the IBM 350 Disk Storage Unit shipped in 1956, weighed over one ton and stored approximately 3.75 Megabytes of data across 50 magnetic platters.",
        "The BIOS (Basic Input/Output System) acronym was first coined by Gary Kildall in 1975 for the CP/M operating system boot sequence.",
        "Microsoft Solitaire was originally written in 1989 by Microsoft intern Wes Cherry to help novice users practice fluent mouse drag-and-drop actions in Windows 3.0.",
        "Minesweeper was originally created by Robert Donner and Curt Johnson for the Windows Entertainment Pack in 1990 to train users on precision left and right mouse clicks."
    ];

    const SHORTCUTS_LIST = [
        "[Workstation Management]",
        "- Win + D : Toggle Show Desktop (minimize or restore all active workspace windows).",
        "- Win + M : Minimize all open windows across all displays.",
        "- Win + Shift + M : Undo minimize all windows.",
        "- Win + E : Launch Windows Explorer file manager.",
        "- Win + R : Display system Run dialog prompt.",
        "- Win + L : Lock workstation console session.",
        "- Win + F : Open file search utility dialog.",
        "- Win + Pause/Break : Open System Properties control panel.",
        "",
        "[Window & Task Navigation]",
        "- Alt + Tab : Fast task switcher between running application processes.",
        "- Alt + Shift + Tab : Reverse task switcher traversal.",
        "- Alt + F4 : Close active application process or initiate shutdown dialog.",
        "- Alt + Space : Open active window system control context menu.",
        "- Ctrl + Shift + Esc : Directly launch Windows Task Manager.",
        "- Ctrl + Alt + Del : Open Windows Security dialog or task list.",
        "",
        "[Document & Text Editing]",
        "- Ctrl + A : Select all elements in active container or document.",
        "- Ctrl + C / Ctrl + X / Ctrl + V : Copy, Cut, and Paste clipboard buffers.",
        "- Ctrl + Z / Ctrl + Y : Undo and Redo transaction stack.",
        "- Ctrl + F / Ctrl + H : Open Find and Replace utility dialogs.",
        "- Ctrl + S : Execute immediate file save routine.",
        "- F5 / Ctrl + R : Force refresh of current view or file buffer.",
        "- F2 : Rename selected file, folder, or desktop icon.",
        "- Shift + Delete : Permanently delete file bypassing Recycle Bin."
    ];

    const QUIZ_QUESTIONS = [
        {
            q: "What was the official internal development codename for Windows XP?",
            options: ["Whistler", "Memphis", "Chicago", "Longhorn"],
            answer: 0,
            fact: "Whistler was named after Whistler, British Columbia, where Microsoft development teams frequently skied."
        },
        {
            q: "Which ambient music pioneer composed the iconic Windows 95 startup sound?",
            options: ["Brian Eno", "Hans Zimmer", "Jean-Michel Jarre", "Vangelis"],
            answer: 0,
            fact: "Brian Eno crafted 84 micro-compositions before selecting the final six-second signature chord."
        },
        {
            q: "What default TCP port number is officially allocated to unencrypted HTTP traffic?",
            options: ["21", "80", "443", "8080"],
            answer: 1,
            fact: "Port 80 is the standard IANA allocation for HTTP, whereas Port 443 is designated for SSL/TLS encrypted HTTPS."
        },
        {
            q: "What does the 'XP' suffix officially signify in the Windows XP brand name?",
            options: ["eXtra Performance", "eXPerience", "eXtreme Protocol", "eXtra Power"],
            answer: 1,
            fact: "Microsoft introduced the 'XP' designation to highlight the enhanced multimedia user experience."
        },
        {
            q: "In what year did the Clippy office assistant make its official commercial debut?",
            options: ["1995", "1997", "1999", "2001"],
            answer: 1,
            fact: "Clippy was introduced in Microsoft Office 97 to assist users with letter drafting and automated formatting."
        },
        {
            q: "What is the theoretical maximum single file size allowable on a FAT32 file system?",
            options: ["2 GB", "4 GB minus 1 byte", "8 GB", "16 GB"],
            answer: 1,
            fact: "FAT32 records file sizes in 32-bit unsigned integers, restricting maximum file size to exactly 4,294,967,295 bytes."
        },
        {
            q: "Which consumer release of Windows was the first built entirely on the 32-bit Windows NT kernel?",
            options: ["Windows 98", "Windows Me", "Windows 2000 Professional", "Windows XP"],
            answer: 3,
            fact: "Windows XP unified the consumer MS-DOS-based 9x line and the enterprise 32-bit Windows NT architecture."
        },
        {
            q: "What was the internal project codename for Windows 95 during its engineering cycle?",
            options: ["Chicago", "Daytona", "Cairo", "Memphis"],
            answer: 0,
            fact: "Chicago was the milestone project that introduced the Start menu, taskbar, and 32-bit Win32 API."
        },
        {
            q: "How many total address bits compose a single standard IPv4 network address?",
            options: ["16 bits", "32 bits", "64 bits", "128 bits"],
            answer: 1,
            fact: "IPv4 uses 32-bit addresses structured across four 8-bit octets, yielding approximately 4.29 billion distinct addresses."
        },
        {
            q: "Which game was bundled with Windows 3.0 primarily to teach users drag-and-drop mouse mechanics?",
            options: ["Minesweeper", "Solitaire", "Hearts", "FreeCell"],
            answer: 1,
            fact: "Solitaire was engineered by intern Wes Cherry to train user reflexes on graphical drag-and-drop operations."
        },
        {
            q: "Which scripting language was authored by Brendan Eich in 10 days in May 1995 for Netscape?",
            options: ["Python", "JavaScript", "PHP", "Ruby"],
            answer: 1,
            fact: "JavaScript was originally named Mocha, briefly renamed LiveScript, and finally branded JavaScript."
        },
        {
            q: "What exact pixel resolution defines standard IBM VGA (Video Graphics Array) mode?",
            options: ["320x240", "640x480", "800x600", "1024x768"],
            answer: 1,
            fact: "IBM standard VGA was established in 1987 with 640x480 pixels in 16 colors."
        },
        {
            q: "What is the standard data transfer rate of a 1X speed standard Audio CD-ROM drive?",
            options: ["150 KB/s", "300 KB/s", "600 KB/s", "1024 KB/s"],
            answer: 0,
            fact: "A single-speed (1X) CD-ROM reads raw data at exactly 150 Kilobytes per second (153.6 KB/s continuous)."
        },
        {
            q: "Which classic computer science protocol operates at Transport Layer 4 without guaranteeing packet delivery?",
            options: ["TCP", "UDP", "ICMP", "BGP"],
            answer: 1,
            fact: "UDP (User Datagram Protocol) provides connectionless, lightweight datagram transport without delivery acknowledgments."
        },
        {
            q: "What was the default web browser packaged out-of-the-box with initial Windows XP installations?",
            options: ["Internet Explorer 5.0", "Internet Explorer 6.0", "Netscape Navigator 4", "MSN Explorer"],
            answer: 1,
            fact: "Windows XP RTM originally shipped with Internet Explorer 6.0 integrated directly into the shell."
        },
        {
            q: "What is the standard sector size on traditional master boot record (MBR) magnetic hard drives?",
            options: ["256 bytes", "512 bytes", "1024 bytes", "4096 bytes"],
            answer: 1,
            fact: "Traditional hard disk drives utilized 512-byte physical sectors before Advanced Format (4K) sectors emerged."
        },
        {
            q: "Who is recognized for building the first mechanical computer mouse in 1964 out of wood?",
            options: ["Douglas Engelbart", "Alan Kay", "Dennis Ritchie", "Ken Thompson"],
            answer: 0,
            fact: "Douglas Engelbart engineered the wooden prototype mouse at Stanford Research Institute."
        },
        {
            q: "What CPU instruction set architecture was Windows XP primarily engineered for on desktop PCs?",
            options: ["x86 (IA-32)", "ARMv5", "MIPS", "SPARC"],
            answer: 0,
            fact: "Windows XP 32-bit was engineered natively for Intel IA-32 (x86) compatible microprocessors."
        }
    ];

    const HANGMAN_WORDS = [
        "DESKTOP", "WINDOWS", "CLIPPY", "MONITOR", "BROWSER", "KEYBOARD",
        "OUTLOOK", "EXPLORER", "TERMINAL", "INTERNET", "PROCESSOR", "MEGABYTE",
        "GIGABYTE", "DEFRAGMENT", "FIREWALL", "ETHERNET", "GRAPHICS", "DATABASE",
        "POINTER", "JOYSTICK", "MAINFRAME", "DISPATCH", "REGISTER", "VARIABLE",
        "FUNCTION", "COMPILER", "OPERATING", "SYSTEM", "HARDWARE", "SOFTWARE",
        "MOTHERBOARD", "CHIPSET", "BANDWIDTH", "PROTOCOL", "NETWORK", "GATEWAY",
        "BUFFER", "CACHE", "INTERRUPT", "STORAGE", "SECTOR", "PARTITION",
        "REGISTRY", "SUBROUTINE", "ALGORITHM", "FIRMWARE", "MICROCODE", "PIPELINE",
        "BUSMASTER", "VIRTUAL", "DYNAMIC", "LINKED", "LIBRARY", "TASKBAR",
        "CONTROLLER", "INTERFACE", "PERIPHERAL", "RESOLUTION", "PIXEL", "RASTER",
        "DEBUGGER", "ASSEMBLER", "INSTRUCTION", "SYNTAX", "EXCEPTION", "SOCKET",
        "THREAD", "MULTITASK", "OVERFLOW", "RECURSION", "BOOLEAN", "HEXADECIMAL",
        "BINARY", "DECIMAL", "MONOCHROME", "EXPANSION", "MODEM", "BROADBAND"
    ];

    function startTicTacToe() {
        activeGameContext = 'ttt';
        gameState = {
            board: Array(9).fill(null),
            turn: 'X',
            winner: null
        };
        setVisualState('happy');
        playRetroSound('action');
        renderTicTacToeView("[Tic-Tac-Toe Matrix] Player token: [X] | Assistant token: [O]. Select a cell to play:");
    }

    function renderTicTacToeView(statusText) {
        if (!logElement) return;
        const row = document.createElement('div');
        row.className = 'clippy-message clippy-message-assistant';

        const label = document.createElement('div');
        label.textContent = statusText;
        row.appendChild(label);

        const grid = document.createElement('div');
        grid.className = 'clippy-ttt-grid';

        for (let i = 0; i < 9; i++) {
            const cellBtn = document.createElement('button');
            cellBtn.type = 'button';
            cellBtn.className = 'clippy-ttt-cell';
            cellBtn.textContent = gameState.board[i] || '';
            cellBtn.disabled = !!gameState.board[i] || !!gameState.winner;

            cellBtn.addEventListener('click', () => {
                if (gameState.board[i] || gameState.winner) return;
                makeTicTacToeMove(i);
            });
            grid.appendChild(cellBtn);
        }

        row.appendChild(grid);
        logElement.appendChild(row);
        scrollLogToBottom();
    }

    function checkTTTWinner(board) {
        const lines = [
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6],[1,4,7],[2,5,8],
            [0,4,8],[2,4,6]
        ];
        for (let [a,b,c] of lines) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
        }
        if (board.every(cell => cell !== null)) return 'TIE';
        return null;
    }

    function makeTicTacToeMove(cellIndex) {
        gameState.board[cellIndex] = 'X';
        playRetroSound('action');

        let winner = checkTTTWinner(gameState.board);
        if (winner) {
            finishTTTGame(winner);
            return;
        }

        const emptyIndices = gameState.board.map((v, i) => v === null ? i : null).filter(v => v !== null);
        if (emptyIndices.length > 0) {
            let clippyMove = emptyIndices.find(idx => {
                const testBoard = [...gameState.board];
                testBoard[idx] = 'O';
                return checkTTTWinner(testBoard) === 'O';
            });
            if (clippyMove === undefined) {
                clippyMove = emptyIndices.find(idx => {
                    const testBoard = [...gameState.board];
                    testBoard[idx] = 'X';
                    return checkTTTWinner(testBoard) === 'X';
                });
            }
            if (clippyMove === undefined) {
                clippyMove = pickFrom(emptyIndices);
            }
            gameState.board[clippyMove] = 'O';
        }

        winner = checkTTTWinner(gameState.board);
        if (winner) finishTTTGame(winner);
        else renderTicTacToeView("Your turn (X):");
    }

    function finishTTTGame(winner) {
        gameState.winner = winner;
        activeGameContext = null;
        trackStat('ttt_games');

        if (winner === 'X') {
            setVisualState('surprise');
            playRetroSound('win');
            typeWriterMessage('assistant', "[VICTORY] Outstanding strategy. You defeated the decision heuristic algorithm! Would you like a rematch?", null, [
                { label: "Play Again", onClick: () => startTicTacToe() }
            ]);
        } else if (winner === 'O') {
            setVisualState('happy');
            playRetroSound('lose');
            typeWriterMessage('assistant', "[DEFEAT] Clippit wins this round! The defensive calculation prevailed. Care to challenge again?", null, [
                { label: "Rematch", onClick: () => startTicTacToe() }
            ]);
        } else {
            setVisualState('idle');
            typeWriterMessage('assistant', "[DRAW] Stalemate reached. All grid vectors are occupied with no winner.", null, [
                { label: "Play Again", onClick: () => startTicTacToe() }
            ]);
        }
    }

    function startMemoryGame() {
        activeGameContext = 'memory';
        const tokens = ['SYS', 'DLL', 'EXE', 'INI', 'BAT', 'COM'];
        const deck = [...tokens, ...tokens].sort(() => Math.random() - 0.5);

        gameState = {
            deck: deck,
            revealed: Array(12).fill(false),
            matched: Array(12).fill(false),
            flipped: [],
            lock: false
        };

        setVisualState('happy');
        playRetroSound('action');
        renderMemoryView("[Memory Match Challenge] Uncover matching 16-bit / 32-bit system token pairs:");
    }

    function renderMemoryView(statusText) {
        if (!logElement) return;
        const row = document.createElement('div');
        row.className = 'clippy-message clippy-message-assistant';

        const label = document.createElement('div');
        label.textContent = statusText;
        row.appendChild(label);

        const grid = document.createElement('div');
        grid.className = 'clippy-memory-grid';

        gameState.deck.forEach((card, idx) => {
            const cardBtn = document.createElement('button');
            cardBtn.type = 'button';
            cardBtn.className = 'clippy-memory-card';

            if (gameState.matched[idx]) {
                cardBtn.classList.add('matched');
                cardBtn.textContent = card;
            } else if (gameState.revealed[idx]) {
                cardBtn.classList.add('revealed');
                cardBtn.textContent = card;
            } else {
                cardBtn.textContent = '?';
            }

            cardBtn.addEventListener('click', () => {
                if (gameState.lock || gameState.revealed[idx] || gameState.matched[idx]) return;
                handleMemoryClick(idx);
            });
            grid.appendChild(cardBtn);
        });

        row.appendChild(grid);
        logElement.appendChild(row);
        scrollLogToBottom();
    }

    function handleMemoryClick(idx) {
        gameState.revealed[idx] = true;
        gameState.flipped.push(idx);
        playRetroSound('action');

        if (gameState.flipped.length === 2) {
            const [first, second] = gameState.flipped;
            if (gameState.deck[first] === gameState.deck[second]) {
                gameState.matched[first] = true;
                gameState.matched[second] = true;
                gameState.flipped = [];
                playRetroSound('win');

                if (gameState.matched.every(m => m)) {
                    activeGameContext = null;
                    playRetroSound('tada');
                    setVisualState('happy');
                    typeWriterMessage('assistant', "[SUCCESS] Outstanding memory recall! All 6 system token pairs successfully identified.", null, [
                        { label: "Play Again", onClick: () => startMemoryGame() }
                    ]);
                    return;
                }
                renderMemoryView("[MATCH VERIFIED] Pair matched! Select next token:");
            } else {
                gameState.lock = true;
                setTimeout(() => {
                    gameState.revealed[first] = false;
                    gameState.revealed[second] = false;
                    gameState.flipped = [];
                    gameState.lock = false;
                    renderMemoryView("[MISMATCH] Tokens concealed. Select first card:");
                }, 900);
            }
        } else {
            renderMemoryView("Select a second card to verify pair:");
        }
    }

    function startHangmanGame() {
        activeGameContext = 'hangman';
        const word = pickFrom(HANGMAN_WORDS);
        gameState = {
            word: word,
            guessed: new Set(),
            errors: 0,
            maxErrors: 6
        };
        setVisualState('think');
        playRetroSound('action');
        renderHangmanStatus();
    }

    function renderHangmanStatus() {
        const masked = gameState.word
            .split('')
            .map(char => gameState.guessed.has(char) ? char : '_')
            .join(' ');

        const remaining = gameState.maxErrors - gameState.errors;
        const attemptsStr = Array.from(gameState.guessed).join(', ') || 'None';
        typeWriterMessage('assistant', `[Hangman Terminal]\nWord: ${masked}\nTries remaining: [${remaining}/${gameState.maxErrors}]\nTested letters: [${attemptsStr}]\nEnter a single letter into the prompt:`);
    }

    function handleHangmanInput(letter) {
        letter = letter.toUpperCase();
        if (gameState.guessed.has(letter)) {
            typeWriterMessage('assistant', `Letter '${letter}' has already been evaluated. Please select an alternate character.`);
            return;
        }

        gameState.guessed.add(letter);
        if (gameState.word.includes(letter)) {
            playRetroSound('action');
            setVisualState('happy');
            const isWon = gameState.word.split('').every(c => gameState.guessed.has(c));
            if (isWon) {
                activeGameContext = null;
                playRetroSound('tada');
                setVisualState('happy');
                typeWriterMessage('assistant', `[VICTORY] Target word confirmed: **${gameState.word}**. System buffer restored.`, null, [
                    { label: "Play Again", onClick: () => startHangmanGame() }
                ]);
            } else {
                renderHangmanStatus();
            }
        } else {
            gameState.errors++;
            playRetroSound('lose');
            setVisualState('alert');
            if (gameState.errors >= gameState.maxErrors) {
                activeGameContext = null;
                typeWriterMessage('assistant', `[FAILURE] Maximum fault threshold exceeded. The target word was **${gameState.word}**.`, null, [
                    { label: "Try Again", onClick: () => startHangmanGame() }
                ]);
            } else {
                renderHangmanStatus();
            }
        }
    }

    function startQuizGame() {
        activeGameContext = 'quiz';
        gameState = {
            index: 0,
            score: 0,
            questions: [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5)
        };
        setVisualState('think');
        playRetroSound('action');
        askQuizQuestion();
    }

    function askQuizQuestion() {
        const qData = gameState.questions[gameState.index];
        const actions = qData.options.map((opt, idx) => ({
            label: opt,
            onClick: () => handleQuizAnswer(idx)
        }));

        typeWriterMessage('assistant', `Question ${gameState.index + 1}/${gameState.questions.length}:\n**${qData.q}**`, null, actions);
    }

    function handleQuizAnswer(chosenIdx) {
        const qData = gameState.questions[gameState.index];
        if (chosenIdx === qData.answer) {
            gameState.score++;
            playRetroSound('win');
            setVisualState('happy');
            typeWriterMessage('assistant', `[CORRECT] ${qData.fact}`);
        } else {
            playRetroSound('lose');
            setVisualState('alert');
            typeWriterMessage('assistant', `[INCORRECT] The validated answer is: "${qData.options[qData.answer]}".\n${qData.fact}`);
        }

        gameState.index++;
        if (gameState.index < gameState.questions.length) {
            setTimeout(askQuizQuestion, 1200);
        } else {
            activeGameContext = null;
            const finalScore = gameState.score;
            const total = gameState.questions.length;
            setTimeout(() => {
                playRetroSound('tada');
                setVisualState(finalScore >= Math.floor(total * 0.7) ? 'happy' : 'idle');
                typeWriterMessage('assistant', `[EVALUATION COMPLETE] Diagnostic quiz finalized. Total score: **${finalScore} / ${total}** points.`, null, [
                    { label: "Try Again", onClick: () => startQuizGame() }
                ]);
            }, 900);
        }
    }

    function startGuessNumberGame() {
        activeGameContext = 'guess';
        gameState = {
            target: Math.floor(Math.random() * 100) + 1,
            attempts: 0
        };
        setVisualState('talk');
        playRetroSound('action');
        typeWriterMessage('assistant', "[Random Value Generator] I have computed an integer between 1 and 100. Enter your numerical guess into the input prompt:");
    }

    function handleGuessNumberInput(num) {
        if (isNaN(num) || num < 1 || num > 100) {
            typeWriterMessage('assistant', "Input out of range. Please enter an integer between 1 and 100.");
            return;
        }
        gameState.attempts++;
        if (num === gameState.target) {
            activeGameContext = null;
            playRetroSound('tada');
            setVisualState('happy');
            typeWriterMessage('assistant', `[TARGET ACQUIRED] Exact match: **${gameState.target}** identified in ${gameState.attempts} cycle(s)!`, null, [
                { label: "Play Again", onClick: () => startGuessNumberGame() }
            ]);
        } else if (num < gameState.target) {
            playRetroSound('type');
            setVisualState('think');
            typeWriterMessage('assistant', `Target is GREATER than ${num}. (Attempt count: ${gameState.attempts})`);
        } else {
            playRetroSound('type');
            setVisualState('think');
            typeWriterMessage('assistant', `Target is LESS than ${num}. (Attempt count: ${gameState.attempts})`);
        }
    }

    function handlePetAction(act) {
        const pet = getPetState();
        if (act === 'feed') {
            pet.hunger = Math.max(0, pet.hunger - 40);
            pet.happiness = Math.min(100, pet.happiness + 15);
            pet.xp += 15;
            savePetState(pet);
            playRetroSound('win');
            setVisualState('happy');
            typeWriterMessage('assistant', "[MAINTENANCE] Consumed polished brass paperclip reserves. Hunger decreased. (+15 XP)", null, [
                { label: "View Status", onClick: () => handlePetAction('status') }
            ]);
        } else if (act === 'pet') {
            pet.happiness = Math.min(100, pet.happiness + 25);
            pet.xp += 10;
            savePetState(pet);
            playRetroSound('action');
            setVisualState('happy');
            typeWriterMessage('assistant', "[AFFIRMATION] Metal wire polished and calibrated. Morale optimized. (+10 XP)", null, [
                { label: "View Status", onClick: () => handlePetAction('status') }
            ]);
        } else if (act === 'sleep') {
            pet.energy = 100;
            pet.hunger = Math.min(100, pet.hunger + 10);
            pet.xp += 10;
            savePetState(pet);
            playRetroSound('action');
            setVisualState('idle');
            typeWriterMessage('assistant', "[STANDBY] System entered low-power standby routine in document cache. Energy replenished to 100%.", null, [
                { label: "View Status", onClick: () => handlePetAction('status') }
            ]);
        } else {
            setVisualState('talk');
            playRetroSound('action');
            if (!logElement) return;

            const row = document.createElement('div');
            row.className = 'clippy-message clippy-message-assistant';

            const header = document.createElement('div');
            header.innerHTML = `[ASSISTANT METRICS] <b>Clippit Status</b> — Level ${pet.level} (XP: ${pet.xp} / ${pet.level * 50})`;
            row.appendChild(header);

            const meter = document.createElement('div');
            meter.className = 'clippy-pet-meter';
            meter.innerHTML = `
                <div class="clippy-pet-row"><span>Morale:</span><span>${pet.happiness}%</span></div>
                <div class="clippy-pet-bar"><div class="clippy-pet-bar-fill happiness" style="width:${pet.happiness}%"></div></div>
                <div class="clippy-pet-row"><span>Energy Reserve:</span><span>${pet.energy}%</span></div>
                <div class="clippy-pet-bar"><div class="clippy-pet-bar-fill energy" style="width:${pet.energy}%"></div></div>
                <div class="clippy-pet-row"><span>Depletion / Hunger:</span><span>${pet.hunger}%</span></div>
                <div class="clippy-pet-bar"><div class="clippy-pet-bar-fill hunger" style="width:${pet.hunger}%"></div></div>
            `;
            row.appendChild(meter);

            const btnBar = document.createElement('div');
            btnBar.className = 'clippy-actions-bar';

            const actions = [
                { label: "Supply Paperclips", act: 'feed' },
                { label: "Polish Wire", act: 'pet' },
                { label: "Standby Mode", act: 'sleep' }
            ];

            actions.forEach(a => {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'clippy-action-btn';
                b.textContent = a.label;
                b.addEventListener('click', () => handlePetAction(a.act));
                btnBar.appendChild(b);
            });

            row.appendChild(btnBar);
            logElement.appendChild(row);
            scrollLogToBottom();
        }
    }

    function simulateDefrag() {
        setVisualState('write');
        playRetroSound('action');

        if (!logElement) return;
        const row = document.createElement('div');
        row.className = 'clippy-message clippy-message-assistant';

        const label = document.createElement('div');
        label.textContent = "Disk Defragmenter (FAT32 Volume C: Optimizing clusters...)";
        row.appendChild(label);

        const map = document.createElement('div');
        map.className = 'clippy-defrag-map';
        const blocks = [];
        for (let i = 0; i < 40; i++) {
            const b = document.createElement('div');
            b.className = 'clippy-defrag-block' + (Math.random() > 0.45 ? ' frag' : (Math.random() > 0.3 ? '' : ' free'));
            map.appendChild(b);
            blocks.push(b);
        }
        row.appendChild(map);

        const bar = document.createElement('div');
        bar.className = 'clippy-progress-box';
        const fill = document.createElement('div');
        fill.className = 'clippy-progress-fill';
        bar.appendChild(fill);
        row.appendChild(bar);

        logElement.appendChild(row);
        scrollLogToBottom();

        let progress = 0;
        let blockIndex = 0;

        const interval = setInterval(() => {
            progress += 5;
            if (blockIndex < blocks.length) {
                blocks[blockIndex].className = 'clippy-defrag-block';
                if (blockIndex + 1 < blocks.length) {
                    blocks[blockIndex + 1].className = 'clippy-defrag-block active';
                }
                blockIndex++;
            }

            playRetroSound('crunch');
            fill.style.width = `${Math.min(100, progress)}%`;

            if (progress >= 100) {
                clearInterval(interval);
                blocks.forEach(b => b.className = 'clippy-defrag-block');
                playRetroSound('tada');
                setVisualState('happy');
                label.textContent = "[STATUS: COMPLETE] Defragmentation finished. 100% contiguous cluster allocation on Volume C:. Fragmentation level: 0.00%.";
            }
        }, 130);
    }

    function handleTodoListCommand(rawText) {
        let todos = getStoredTodos();
        const norm = normalize(rawText);

        if (norm.startsWith('todo add ') || norm.startsWith('add todo ') || norm.startsWith('task add ')) {
            const taskText = rawText.replace(/^(todo add|add todo|task add)\s+/i, '').trim();
            if (taskText) {
                todos.push({ id: Date.now(), text: taskText, done: false });
                saveStoredTodos(todos);
                playRetroSound('action');
                setVisualState('write');
                renderInteractiveTodos();
                return;
            }
        }

        if (norm === 'todo clear' || norm === 'clear todos') {
            saveStoredTodos([]);
            playRetroSound('action');
            typeWriterMessage('assistant', "All tasks have been cleared from your list!");
            return;
        }

        renderInteractiveTodos();
    }

    function renderInteractiveTodos() {
        const todos = getStoredTodos();
        if (todos.length === 0) {
            setVisualState('idle');
            typeWriterMessage('assistant', "[TASK MANAGER] Task register is empty. You can register an entry by typing 'todo add [Task description]' or using the shortcut below.", null, [
                { label: "Register Sample Task", onClick: () => handleTodoListCommand("todo add Test all Windows XP features") }
            ]);
            return;
        }

        if (!logElement) return;
        const row = document.createElement('div');
        row.className = 'clippy-message clippy-message-assistant';

        const label = document.createElement('div');
        label.innerHTML = `[TASK MANAGER] <b>Desktop Task List (${todos.filter(t => !t.done).length} pending):</b>`;
        row.appendChild(label);

        const container = document.createElement('div');
        container.className = 'clippy-todo-container';

        todos.forEach((t, idx) => {
            const item = document.createElement('div');
            item.className = `clippy-todo-item ${t.done ? 'done' : ''}`;

            const check = document.createElement('input');
            check.type = 'checkbox';
            check.className = 'clippy-todo-check';
            check.checked = t.done;
            check.addEventListener('change', () => {
                t.done = check.checked;
                saveStoredTodos(todos);
                item.className = `clippy-todo-item ${t.done ? 'done' : ''}`;
                playRetroSound(t.done ? 'win' : 'action');
            });

            const span = document.createElement('span');
            span.style.flexGrow = '1';
            span.textContent = t.text;

            const del = document.createElement('button');
            del.type = 'button';
            del.className = 'clippy-todo-del';
            del.innerHTML = '&times;';
            del.title = 'Delete Task';
            del.addEventListener('click', () => {
                const updated = getStoredTodos().filter(item => item.id !== t.id);
                saveStoredTodos(updated);
                playRetroSound('action');
                renderInteractiveTodos();
            });

            item.appendChild(check);
            item.appendChild(span);
            item.appendChild(del);
            container.appendChild(item);
        });

        row.appendChild(container);

        const btnBar = document.createElement('div');
        btnBar.className = 'clippy-actions-bar';

        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'clippy-action-btn';
        clearBtn.textContent = 'Clear All';
        clearBtn.addEventListener('click', () => handleTodoListCommand('todo clear'));
        btnBar.appendChild(clearBtn);

        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'clippy-action-btn';
        addBtn.textContent = '+ Add Task';
        addBtn.addEventListener('click', () => {
            if (inputElement) {
                inputElement.value = "todo add ";
                inputElement.focus();
            }
        });
        btnBar.appendChild(addBtn);

        row.appendChild(btnBar);
        logElement.appendChild(row);
        scrollLogToBottom();
    }

    function handleScratchpad(rawText) {
        const norm = normalize(rawText);
        if (norm.startsWith('note ') || norm.startsWith('scratchpad write ')) {
            const content = rawText.replace(/^(note|scratchpad write)\s+/i, '').trim();
            localStorage.setItem(STORAGE_KEY_NOTES, content);
            playRetroSound('action');
            setVisualState('write');
            typeWriterMessage('assistant', `[SCRATCHPAD COMMITTED] Buffer written to local storage:\n"${content}"`);
            return;
        }
        const saved = localStorage.getItem(STORAGE_KEY_NOTES) || "(Scratchpad buffer empty. Type 'note [text]' to commit a memo.)";
        typeWriterMessage('assistant', `[SCRATCHPAD BUFFER]\n${saved}`);
    }

    function startPomodoroTimer(minutes = 25) {
        if (activePomodoroTimer) {
            clearInterval(activePomodoroTimer);
            activePomodoroTimer = null;
        }

        let secondsLeft = minutes * 60;
        playRetroSound('action');
        setVisualState('write');
        typeWriterMessage('assistant', `[TIMER INITIALIZED] Focus countdown initiated for ${minutes} minute(s).`);

        activePomodoroTimer = setInterval(() => {
            secondsLeft -= 10;
            if (secondsLeft <= 0) {
                clearInterval(activePomodoroTimer);
                activePomodoroTimer = null;
                playRetroSound('tada');
                setVisualState('happy');
                showIdleBubble("[TIMER ELAPSED] Focus period complete. Recommended break: 5 minutes.");
                typeWriterMessage('assistant', "[TIMER EXPIRED] Work interval complete. Please execute standard 5-minute rest cycle.");
            }
        }, 10000);
    }

    function respondUnreadMail() {
        const count = SafeDeskAPI.getUnreadMailCount();
        if (count === 0) return { text: "Your inbox is completely up to date. Zero unread messages!", actions: [{ label: "Open Mail App", onClick: () => SafeDeskAPI.openApp('mail') }] };
        return { text: `You have ${count} unread message(s) waiting in Outlook Express!`, actions: [{ label: `Open Outlook (${count})`, onClick: () => SafeDeskAPI.openApp('mail') }] };
    }

    function respondProjects() {
        const allProjects = SafeDeskAPI.getAllProjects();
        const project = SafeDeskAPI.getRandomProject();
        let title = "Featured Project";
        if (project && project.title) {
            title = (typeof project.title === 'object') ? (project.title.en || project.title.fr || "Portfolio Item") : project.title;
        }
        const countText = allProjects.length > 0 ? `We have ${allProjects.length} total showcase items available.` : "";
        return {
            text: `Featured project: "${title}". ${countText}`,
            actions: [{ label: "Open Projects Explorer", onClick: () => SafeDeskAPI.openApp('projects') }]
        };
    }

    function respondDesktop() {
        const count = SafeDeskAPI.getDesktopItemCount();
        return `There are currently ${count} item(s) on your desktop surface.`;
    }

    function respondRecycleBin() {
        const count = SafeDeskAPI.getRecycleBinCount();
        if (count === 0) {
            return { text: "The Recycle Bin is spotless and completely empty!", actions: [{ label: "Open Recycle Bin", onClick: () => SafeDeskAPI.openApp('recycleBin') }] };
        }
        return {
            text: `The Recycle Bin currently holds ${count} item(s).`,
            actions: [
                { label: "Open Recycle Bin", onClick: () => SafeDeskAPI.openApp('recycleBin') },
                { label: "Empty Bin", onClick: () => { SafeDeskAPI.emptyRecycleBin(); playRetroSound('action'); typeWriterMessage('assistant', "Recycle Bin emptied successfully!"); } }
            ]
        };
    }

    function respondTime() {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const date = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return `Current System Clock: ${time}\nDate: ${date}\nTimezone: ${tz}`;
    }

    function respondMoon() {
        const label = getMoonPhaseLabel();
        if (!label) return "Lunar metrics are unavailable right now.";
        return `The current moon phase is: **${label}**.`;
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
                    { label: "Open Player", onClick: () => SafeDeskAPI.openApp('musicPlayer') }
                ]
            };
        }
        return {
            text: "No audio is currently playing in the media player.",
            actions: [{ label: "Launch Music Player", onClick: () => SafeDeskAPI.openApp('musicPlayer') }]
        };
    }

    function respondSystemStatus() {
        const nav = window.navigator;
        const mem = nav.deviceMemory ? `${nav.deviceMemory} GB Unified RAM` : '512 MB SDRAM PC-133 (Simulated)';
        const cores = nav.hardwareConcurrency ? `${nav.hardwareConcurrency} Logical Threads` : 'Intel Pentium 4 (1 Logical Thread)';
        const online = nav.onLine ? 'Connected (TCP/IP 100BASE-TX OK)' : 'Disconnected (Network Link Offline)';
        const screenRes = `${window.screen.width}x${window.screen.height} (${window.screen.colorDepth}-bit TrueColor)`;
        const openWins = SafeDeskAPI.getOpenWindowCount();
        const unread = SafeDeskAPI.getUnreadMailCount();
        const recycleCount = SafeDeskAPI.getRecycleBinCount();
        const desktopItems = SafeDeskAPI.getDesktopItemCount();
        const moon = getMoonPhaseLabel() || 'Unavailable';

        return `[WORKSTATION DIAGNOSTICS LOG]\n- Host Operating Environment: Windows XP Professional (Win32 API Emulated)\n- Network Link: ${online}\n- Display Subsystem: ${screenRes}\n- Window Manager: ${openWins} active process window(s)\n- Mail Subsystem: ${unread} unread message(s)\n- Shell Storage: ${desktopItems} desktop item(s), ${recycleCount} recycled file(s)\n- Processor Topology: ${cores}\n- Host Memory: ${mem}\n- Platform Architecture: ${nav.platform || 'Win32'}\n- Lunar Phase Metric: ${moon}\n- Agent Signature: ${nav.userAgent.slice(0, 50)}...`;
    }

    function respondShortcuts() {
        setVisualState('think');
        return "Useful Windows Desktop Hotkeys:\n" + SHORTCUTS_LIST.join('\n');
    }

    function startRPSGame() {
        activeGameContext = 'rps';
        setVisualState('talk');
        return {
            text: "[Rock-Paper-Scissors Challenge] Select your move:",
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
            setVisualState('idle');
            playRetroSound('action');
        } else if (
            (userMove === 'rock' && clippyMove === 'scissors') ||
            (userMove === 'paper' && clippyMove === 'rock') ||
            (userMove === 'scissors' && clippyMove === 'paper')
        ) {
            resultStr = `You picked ${userMove} and I picked ${clippyMove}. You win! Well played!`;
            setVisualState('happy');
            playRetroSound('tada');
        } else {
            resultStr = `You picked ${userMove} and I picked ${clippyMove}. I win this round!`;
            setVisualState('happy');
            playRetroSound('lose');
        }

        typeWriterMessage('assistant', resultStr, null, [
            { label: "Play Again", onClick: () => startRPSGame() }
        ]);
    }

    function respondHelp() {
        setVisualState('think');
        return {
            text: "Here is a summary of what I can do for you:\n• **Productivity:** To-Do lists (`todo add ...`), Scratchpad (`note ...`), Pomodoro (`timer 25`), Unit conversions (`convert 100 km to miles`), Password generator (`pass`), Calculations (`calc 12 * 4`)\n• **Desktop Controls:** Open apps (Notepad, Paint, Minesweeper, Mail, Terminal), inspect open windows, Recycle Bin, music\n• **Games:** Memory Match, Tic-Tac-Toe, Hangman, Tech Quiz, Guess the Number, Shifumi, Pet Clippy, Jokes & Trivia\n• **Diagnostics:** Defrag simulation, System Specs, Moon Phase",
            actions: [
                { label: "Memory Match", onClick: () => startMemoryGame() },
                { label: "Tic-Tac-Toe", onClick: () => startTicTacToe() },
                { label: "Tech Quiz", onClick: () => startQuizGame() },
                { label: "Defrag Drive", onClick: () => simulateDefrag() }
            ]
        };
    }

    const INTENTS = [
        { id: 'greeting', keywords: ['hello', 'hi', 'hey', 'greetings', 'morning', 'afternoon', 'good day', 'bonjour', 'coucou', 'salut', 'yo', 'howdy', 'bonsoir'], respond: () => pickFrom(GREETINGS) },
        { id: 'bye', keywords: ['bye', 'goodbye', 'see ya', 'farewell', 'exit', 'close', 'quit', 'aurevoir', 'ciao', 'adieu', 'leave'], respond: () => "Session closed. Click the tray icon at any point to reactivate the assistant interface." },
        { id: 'thanks', keywords: ['thanks', 'thank you', 'thx', 'appreciate it', 'merci', 'grateful', 'remercie', 'much obliged'], respond: () => "You are very welcome. Standing by for further workspace instructions." },
        { id: 'identity', keywords: ['who are you', 'your name', 'what are you', 'introduce yourself', 'clippy', 'qui es tu', 'about you', 'identity', 'presentation'], respond: () => "I am Clippit, the default interactive office and workspace assistant for Windows XP, operating with full 32-bit heuristics." },
        { id: 'mail', keywords: ['mail', 'mails', 'email', 'emails', 'inbox', 'outlook', 'unread', 'messages', 'courrier', 'boite de reception', 'message'], respond: respondUnreadMail },
        { id: 'projects', keywords: ['project', 'projects', 'portfolio', 'work', 'code', 'showcase', 'projets', 'travaux', 'creations'], respond: respondProjects },
        { id: 'desktop', keywords: ['desktop', 'files', 'icons', 'items', 'bureau', 'fichiers', 'surface'], respond: respondDesktop },
        { id: 'recycle', keywords: ['recycle', 'bin', 'trash', 'garbage', 'corbeille', 'poubelle', 'waste'], respond: respondRecycleBin },
        { id: 'time', keywords: ['time', 'date', 'clock', 'day', 'today', 'heure', 'horloge', 'date', 'calendar', 'quelle heure'], respond: respondTime },
        { id: 'moon', keywords: ['moon', 'lunar', 'phase', 'lune', 'phase lunaire', 'pleine lune'], respond: respondMoon },
        { id: 'windows', keywords: ['window', 'windows', 'running apps', 'active windows', 'fenetres', 'taches', 'processes'], respond: respondWindows },
        { id: 'music', keywords: ['music', 'song', 'track', 'audio', 'now playing', 'player', 'musique', 'chanson', 'lecteur audio'], respond: respondMusic },
        { id: 'status', keywords: ['status', 'diagnostics', 'system info', 'specs', 'memory', 'ram', 'cpu', 'workstation', 'configuration', 'systeme', 'info systeme'], respond: respondSystemStatus },
        { id: 'shortcuts', keywords: ['shortcut', 'shortcuts', 'hotkeys', 'keybinds', 'raccourcis', 'clavier', 'touches'], respond: respondShortcuts },
        { id: 'trivia', keywords: ['trivia', 'fact', 'facts', 'did you know', 'anecdote', 'histoire', 'culture', 'culture g'], respond: () => pickFrom(TRIVIA_LIST) },
        { id: 'joke', keywords: ['joke', 'funny', 'tell me a joke', 'humor', 'blague', 'rigolo', 'drole', 'blagues'], respond: () => pickFrom(JOKES_LIST) },
        { id: 'defrag', keywords: ['defrag', 'defragment', 'disk defragmenter', 'optimise', 'optimiser', 'defragmentation'], respond: () => { simulateDefrag(); return null; } },
        { id: 'pet', keywords: ['pet', 'feed', 'pet clippy', 'tamagotchi', 'nourrir', 'statut compagnon', 'compagnon'], respond: () => { handlePetAction('status'); return null; } },
        { id: 'memory', keywords: ['memory', 'memory match', 'pairs', 'cartes', 'jeu de memoire', 'paires'], respond: () => { startMemoryGame(); return null; } },
        { id: 'hangman', keywords: ['hangman', 'pendu', 'guess word', 'jeu du pendu'], respond: () => { startHangmanGame(); return null; } },
        { id: 'ttt', keywords: ['tic tac toe', 'tictactoe', 'morpion', 'morpion game'], respond: () => { startTicTacToe(); return null; } },
        { id: 'quiz', keywords: ['quiz', 'tech quiz', 'test me', 'qcm', 'questionnaire'], respond: () => { startQuizGame(); return null; } },
        { id: 'guess', keywords: ['guess', 'guess number', 'devinette', 'nombre mystere', 'deviner'], respond: () => { startGuessNumberGame(); return null; } },
        { id: 'rps', keywords: ['rps', 'rock paper scissors', 'chifoumi', 'pierre feuille ciseaux', 'shifumi'], respond: startRPSGame },
        { id: 'help', keywords: ['help', 'what can you do', 'options', 'commands', 'aide', 'manuel', 'fonctions', 'instructions', '?'], respond: respondHelp }
    ];

    function generateResponse(rawText) {
        const text = normalize(rawText);
        if (!text) return { text: pickFrom(FALLBACKS) };

        if (activeGameContext === 'guess' && /^\d+$/.test(text)) {
            handleGuessNumberInput(parseInt(text, 10));
            return null;
        }

        if (activeGameContext === 'hangman' && /^[a-zA-Z]$/.test(text)) {
            handleHangmanInput(text);
            return null;
        }

        if (text.startsWith('note') || text.startsWith('scratchpad')) {
            handleScratchpad(rawText);
            return null;
        }

        if (text.startsWith('todo') || text.startsWith('task') || text === 'todos' || text === 'tasks') {
            handleTodoListCommand(rawText);
            return null;
        }

        if (text.startsWith('timer ') || text.startsWith('pomodoro') || text.startsWith('minuteur')) {
            const match = text.match(/\d+/);
            const mins = match ? parseInt(match[0], 10) : 25;
            startPomodoroTimer(mins);
            return null;
        }

        if (text.startsWith('password') || text.startsWith('pass') || text.includes('generate password')) {
            const match = text.match(/\d+/);
            const len = match ? parseInt(match[0], 10) : 14;
            const pwd = generateSecurePassword(len);
            setVisualState('write');
            playRetroSound('action');
            return { text: `Generated Secure Password (${len} chars):\n**\`${pwd}\`**` };
        }

        const convResult = parseUnitConversion(rawText);
        if (convResult) {
            setVisualState('think');
            playRetroSound('action');
            return { text: `Unit Conversion: **${convResult}**` };
        }

        if (text.startsWith('calc ') || text.startsWith('calculate ') || /^[\d\s\+\-\*\/\(\)\.\^\%]+$/.test(text)) {
            const exp = text.replace(/^(calc|calculate)\s+/i, '');
            const calcRes = evaluateMathExpression(exp);
            if (calcRes !== null) {
                setVisualState('think');
                playRetroSound('action');
                return { text: `Calculation: ${exp} = **${calcRes}**` };
            }
        }

        if (includesAny(text, ['open notepad', 'launch notepad', 'notepad', 'bloc notes'])) {
            SafeDeskAPI.openApp('notepad');
            setVisualState('write');
            return { text: "Opening Notepad for you!" };
        }
        if (includesAny(text, ['open paint', 'launch paint', 'paint', 'dessin'])) {
            SafeDeskAPI.openApp('paint');
            setVisualState('happy');
            return { text: "Opening Paint! Time to draw." };
        }
        if (includesAny(text, ['open minesweeper', 'play minesweeper', 'demineur'])) {
            SafeDeskAPI.openApp('minesweeper');
            setVisualState('happy');
            return { text: "Launching Minesweeper! Watch out for bombs." };
        }
        if (includesAny(text, ['open terminal', 'cmd', 'command prompt', 'terminal', 'console'])) {
            SafeDeskAPI.openApp('terminal');
            setVisualState('think');
            return { text: "Launching Command Prompt Terminal." };
        }

        for (const intent of INTENTS) {
            if (includesAny(text, intent.keywords)) {
                lastIntentId = intent.id;
                const out = intent.respond();
                if (out === null) return null;
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
        setVisualState('think');

        setTimeout(() => {
            const resp = generateResponse(rawText);
            isThinking = false;
            if (resp && resp.text) {
                typeWriterMessage('assistant', resp.text, null, resp.actions || null);
            }
        }, 220 + Math.random() * 260);
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
        popupElement.setAttribute('aria-label', 'Clippy Assistant');

        popupElement.innerHTML = `
            <div class="clippy-popup-header">
                <div class="clippy-header-left">
                    <img src="${IMAGE_BASE}${FACES.IDLE}" alt="Clippy" class="clippy-popup-avatar">
                    <span class="clippy-popup-title">Clippy Desktop Assistant</span>
                </div>
                <div class="clippy-header-controls">
                    <button type="button" class="clippy-header-btn clippy-sound-toggle" title="Toggle Sound">[SND]</button>
                    <button type="button" class="clippy-popup-close" title="Close">&times;</button>
                </div>
            </div>
            <div class="clippy-popup-log"></div>
            <div class="clippy-suggestions-bar"></div>
            <div class="clippy-popup-input-row">
                <input type="text" class="clippy-popup-input" placeholder="Enter instruction (e.g. 'check mail', 'calc 12*4', 'quiz')...">
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
            soundBtn.textContent = soundEnabled ? '[SND]' : '[MUTE]';
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
            if (e.key === 'Escape' && isOpen) closePopup();
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
        setTimeout(() => inputElement && inputElement.focus(), 50);
    }

    function closePopup() {
        if (popupElement) popupElement.classList.add('hidden');
        isOpen = false;
        activeGameContext = null;
        setVisualState('idle');
    }

    function togglePopup() {
        if (isOpen) closePopup();
        else openPopup();
    }

    function ensureBubble() {
        if (bubbleElement) return bubbleElement;
        bubbleElement = document.createElement('div');
        bubbleElement.className = 'clippy-idle-bubble hidden';

        const iconContainer = document.getElementById('clippy-taskbar-icon');
        if (iconContainer) iconContainer.appendChild(bubbleElement);
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
        bubbleHideTimer = setTimeout(hideBubble, 8000);
    }

    function generateIdleMessage() {
        const unread = SafeDeskAPI.getUnreadMailCount();
        const candidates = [];

        if (unread > 0) candidates.push(`You have ${unread} unread email(s) waiting in Outlook!`);
        const recycleCount = SafeDeskAPI.getRecycleBinCount();
        if (recycleCount > 0) candidates.push(`Recycle Bin contains ${recycleCount} deleted item(s).`);
        const openWindows = SafeDeskAPI.getOpenWindowCount();
        if (openWindows > 2) candidates.push(`You have ${openWindows} open windows active on desktop.`);

        const moon = getMoonPhaseLabel();
        if (moon) candidates.push(`The moon phase tonight is ${moon}.`);

        candidates.push("Need a hand with your tasks? Click me anytime!");
        candidates.push("Tip: Ask me to solve math or convert units!");
        candidates.push("Want to play Memory Match or Tic-Tac-Toe?");

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

    function init() {
        const icon = document.getElementById('clippy-taskbar-icon');
        if (!icon) return;

        icon.removeEventListener('click', togglePopup);
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
        notify: (text) => showIdleBubble(text)
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 100);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
