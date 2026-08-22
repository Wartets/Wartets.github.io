(function () {
	'use strict';

	const STORAGE_KEY_TODOS = 'clippy_user_todos_v3';
	const STORAGE_KEY_PET = 'clippy_pet_state_v3';
	const STORAGE_KEY_NOTES = 'clippy_user_scratchpad_v3';

	function gammaLanczos(z) {
		if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gammaLanczos(1 - z));
		z -= 1;
		const p = [
			0.99999999999980993, 676.5203681218851, -1259.1392167224028,
			771.32342877765313, -176.61502916214059, 12.507343278686905,
			-0.13857109583115912, 9.9843695780195716e-6, 1.5056327351493116e-7
		];
		let x = p[0];
		for (let i = 1; i < p.length; i++) x += p[i] / (z + i);
		const t = z + p.length - 1.5;
		return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
	}

	function errorFunction(x) {
		const sign = (x >= 0) ? 1 : -1;
		x = Math.abs(x);
		const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
		const t = 1.0 / (1.0 + p * x);
		const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
		return sign * y;
	}

	function factorialInt(n) {
		n = Math.round(n);
		if (n < 0) return NaN;
		if (n === 0 || n === 1) return 1;
		let res = 1;
		for (let i = 2; i <= n; i++) res *= i;
		return res;
	}

	const ActivitiesManager = {
		activePomodoroTimer: null,

		evaluateMathExpression(str) {
			let exp = str.toLowerCase()
				.replace(/\bhbar\b/g, '(1.054571817e-34)')
				.replace(/\bh\b/g, '(6.62607015e-34)')
				.replace(/\bc_light\b/g, '(299792458)')
				.replace(/\bc\b/g, '(299792458)')
				.replace(/\bg_accel\b/g, '(9.80665)')
				.replace(/\bkb\b/g, '(1.380649e-23)')
				.replace(/\bk_b\b/g, '(1.380649e-23)')
				.replace(/\bna\b/g, '(6.02214076e23)')
				.replace(/\beps0\b/g, '(8.8541878128e-12)')
				.replace(/\bmu0\b/g, '(1.25663706212e-6)')
				.replace(/\bme\b/g, '(9.1093837015e-31)')
				.replace(/\bmp\b/g, '(1.67262192369e-27)')
				.replace(/\bmn\b/g, '(1.67492749804e-27)')
				.replace(/\bqe\b/g, '(1.602176634e-19)')
				.replace(/\bq_e\b/g, '(1.602176634e-19)')
				.replace(/\bsigma_sb\b/g, '(5.670374419e-8)')
				.replace(/\br_gas\b/g, '(8.314462618)')
				.replace(/\bphi\b/g, '(1.618033988749895)')
				.replace(/\balpha_fs\b/g, '(0.0072973525693)')
				.replace(/\basinh\b/g, 'Math.asinh')
				.replace(/\bacosh\b/g, 'Math.acosh')
				.replace(/\batanh\b/g, 'Math.atanh')
				.replace(/\bsinh\b/g, 'Math.sinh')
				.replace(/\bcosh\b/g, 'Math.cosh')
				.replace(/\btanh\b/g, 'Math.tanh')
				.replace(/\basin\b/g, 'Math.asin')
				.replace(/\bacos\b/g, 'Math.acos')
				.replace(/\batan2\b/g, 'Math.atan2')
				.replace(/\batan\b/g, 'Math.atan')
				.replace(/\bsin\b/g, 'Math.sin')
				.replace(/\bcos\b/g, 'Math.cos')
				.replace(/\btan\b/g, 'Math.tan')
				.replace(/\bsqrt\b/g, 'Math.sqrt')
				.replace(/\bcbrt\b/g, 'Math.cbrt')
				.replace(/\bhypot\b/g, 'Math.hypot')
				.replace(/\babs\b/g, 'Math.abs')
				.replace(/\bfloor\b/g, 'Math.floor')
				.replace(/\bceil\b/g, 'Math.ceil')
				.replace(/\bround\b/g, 'Math.round')
				.replace(/\blog10\b/g, 'Math.log10')
				.replace(/\blog2\b/g, 'Math.log2')
				.replace(/\blog\b/g, 'Math.log10')
				.replace(/\bln\b/g, 'Math.log')
				.replace(/\bexp\b/g, 'Math.exp')
				.replace(/\berf\b/g, 'errorFunction')
				.replace(/\bgamma\b/g, 'gammaLanczos')
				.replace(/\bfact\b/g, 'factorialInt')
				.replace(/\bfactorial\b/g, 'factorialInt')
				.replace(/\bpi\b/g, 'Math.PI')
				.replace(/\be\b/g, 'Math.E')
				.replace(/\^/g, '**');

			const allowed = /^[0-9+\-*/(). %**\sMath\.sincotaqrbelgPIEfloundexp210asinhcoshynputGgLanczverFkbaM_]+$/;
			if (!allowed.test(exp)) return null;

			try {
				const evalFn = new Function('gammaLanczos', 'errorFunction', 'factorialInt', `'use strict'; return (${exp})`);
				const result = evalFn(gammaLanczos, errorFunction, factorialInt);
				if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
					if (Math.abs(result) < 1e-4 || Math.abs(result) >= 1e9) {
						return result.toExponential(8);
					}
					return Math.round(result * 100000000) / 100000000;
				}
			} catch (e) {}
			return null;
		},

		parseUnitConversion(text) {
			const match = text.match(/([\d\.eE\+\-]+)\s*(km|mi|miles|mile|meters|meter|m|ft|feet|foot|yd|yards|yard|cm|mm|nm|pm|fm|angstrom|inch|in|au|ly|parsec|pc|kg|lbs|pounds|pound|g|mg|ug|amu|u|slug|solar_mass|oz|ounces|ounce|ton|tons|c|f|k|celsius|fahrenheit|kelvin|rankine|r|tib|gib|mib|kib|tb|gb|mb|kb|bytes|byte|b|bits|bit|kmh|mph|knot|knots|ms|mps|c_light|liters|liter|l|ml|gallons|gallon|gal|floz|bar|mbar|psi|pa|kpa|mpa|atm|torr|mmhg|ev|kev|mev|gev|joules|joule|j|kj|cal|kcal|btu|kwh|erg|watt|w|kw|mw|gw|hp|tesla|t|gauss|g_field|deg|rad|arcmin|arcsec)\s*(?:to|in|en|vers)\s*(km|mi|miles|mile|meters|meter|m|ft|feet|foot|yd|yards|yard|cm|mm|nm|pm|fm|angstrom|inch|in|au|ly|parsec|pc|kg|lbs|pounds|pound|g|mg|ug|amu|u|slug|solar_mass|oz|ounces|ounce|ton|tons|c|f|k|celsius|fahrenheit|kelvin|rankine|r|tib|gib|mib|kib|tb|gb|mb|kb|bytes|byte|b|bits|bit|kmh|mph|knot|knots|ms|mps|c_light|liters|liter|l|ml|gallons|gallon|gal|floz|bar|mbar|psi|pa|kpa|mpa|atm|torr|mmhg|ev|kev|mev|gev|joules|joule|j|kj|cal|kcal|btu|kwh|erg|watt|w|kw|mw|gw|hp|tesla|t|gauss|g_field|deg|rad|arcmin|arcsec)/i);
			if (!match) return null;

			const val = parseFloat(match[1]);
			const from = match[2].toLowerCase();
			const to = match[3].toLowerCase();

			if (isNaN(val)) return null;

			if ((from === 'km') && (to === 'mi' || to === 'miles' || to === 'mile')) return `${val} km = ${(val * 0.621371192).toFixed(6)} miles`;
			if ((from === 'mi' || from === 'miles' || from === 'mile') && to === 'km') return `${val} miles = ${(val * 1.609344).toFixed(6)} km`;
			if ((from === 'm' || from === 'meters' || from === 'meter') && (to === 'ft' || to === 'feet' || to === 'foot')) return `${val} m = ${(val * 3.280839895).toFixed(6)} feet`;
			if ((from === 'ft' || from === 'feet' || from === 'foot') && (to === 'm' || to === 'meters' || to === 'meter')) return `${val} feet = ${(val * 0.3048).toFixed(6)} m`;
			if ((from === 'cm') && (to === 'inch' || to === 'in')) return `${val} cm = ${(val * 0.393700787).toFixed(6)} inches`;
			if ((from === 'inch' || from === 'in') && to === 'cm') return `${val} inches = ${(val * 2.54).toFixed(6)} cm`;
			if (from === 'm' && to === 'au') return `${val} m = ${(val / 1.495978707e11).toExponential(6)} au`;
			if (from === 'au' && to === 'm') return `${val} au = ${(val * 1.495978707e11).toExponential(6)} m`;
			if (from === 'ly' && to === 'm') return `${val} ly = ${(val * 9.4607304725808e15).toExponential(6)} m`;
			if (from === 'm' && to === 'ly') return `${val} m = ${(val / 9.4607304725808e15).toExponential(6)} ly`;

			if ((from === 'kg') && (to === 'lbs' || to === 'pounds' || to === 'pound')) return `${val} kg = ${(val * 2.20462262).toFixed(6)} lbs`;
			if ((from === 'lbs' || from === 'pounds' || from === 'pound') && to === 'kg') return `${val} lbs = ${(val * 0.45359237).toFixed(6)} kg`;
			if ((from === 'c' || from === 'celsius') && (to === 'f' || to === 'fahrenheit')) return `${val} °C = ${((val * 9/5) + 32).toFixed(4)} °F`;
			if ((from === 'f' || from === 'fahrenheit') && (to === 'c' || to === 'celsius')) return `${val} °F = ${(((val - 32) * 5)/9).toFixed(4)} °C`;
			if ((from === 'c' || from === 'celsius') && (to === 'k' || to === 'kelvin')) return `${val} °C = ${(val + 273.15).toFixed(4)} K`;
			if ((from === 'k' || from === 'kelvin') && (to === 'c' || to === 'celsius')) return `${val} K = ${(val - 273.15).toFixed(4)} °C`;

			if ((from === 'ev') && (to === 'joules' || to === 'joule' || to === 'j')) return `${val} eV = ${(val * 1.602176634e-19).toExponential(8)} J`;
			if ((from === 'joules' || from === 'joule' || from === 'j') && to === 'ev') return `${val} J = ${(val / 1.602176634e-19).toExponential(8)} eV`;
			if (from === 'bar' && to === 'psi') return `${val} bar = ${(val * 14.5037738).toFixed(4)} psi`;
			if (from === 'psi' && to === 'bar') return `${val} psi = ${(val * 0.06894757).toFixed(6)} bar`;
			if (from === 'atm' && to === 'pa') return `${val} atm = ${(val * 101325).toFixed(2)} Pa`;
			if (from === 'pa' && to === 'atm') return `${val} Pa = ${(val / 101325).toExponential(6)} atm`;

			if (from === 'tb' && to === 'gb') return `${val} TB = ${val * 1000} GB`;
			if (from === 'tib' && to === 'gib') return `${val} TiB = ${val * 1024} GiB`;
			if (from === 'gb' && to === 'mb') return `${val} GB = ${val * 1000} MB`;
			if (from === 'mb' && to === 'kb') return `${val} MB = ${val * 1000} KB`;
			if (from === 'kb' && (to === 'bytes' || to === 'b')) return `${val} KB = ${val * 1024} Bytes`;

			return null;
		},

		generatePassword(length = 14) {
			const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*()_+-=';
			let res = '';
			for (let i = 0; i < length; i++) {
				res += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return res;
		},

		getStoredTodos() {
			try {
				const raw = window.DeskStorage ? window.DeskStorage.getItem(STORAGE_KEY_TODOS) : localStorage.getItem(STORAGE_KEY_TODOS);
				return raw ? JSON.parse(raw) : [];
			} catch (e) {
				return [];
			}
		},

		saveStoredTodos(todos) {
			try {
				const payload = JSON.stringify(todos);
				if (window.DeskStorage) window.DeskStorage.setItem(STORAGE_KEY_TODOS, payload);
				else localStorage.setItem(STORAGE_KEY_TODOS, payload);
			} catch (e) {}
		},

		getPetState() {
			try {
				const now = Date.now();
				const defaultPet = { hunger: 30, energy: 85, happiness: 85, level: 1, xp: 15, lastUpdate: now };
				const raw = window.DeskStorage ? window.DeskStorage.getItem(STORAGE_KEY_PET) : localStorage.getItem(STORAGE_KEY_PET);
				let pet = raw ? JSON.parse(raw) : defaultPet;

				const elapsedMinutes = Math.min(180, Math.floor((now - (pet.lastUpdate || now)) / 60000));
				if (elapsedMinutes > 0) {
					pet.hunger = Math.min(100, pet.hunger + Math.floor(elapsedMinutes * 0.3));
					pet.energy = Math.max(0, pet.energy - Math.floor(elapsedMinutes * 0.2));
					pet.happiness = Math.max(0, pet.happiness - Math.floor(elapsedMinutes * 0.25));
					pet.lastUpdate = now;
					this.savePetState(pet);
				}
				return pet;
			} catch (e) {
				return { hunger: 30, energy: 85, happiness: 85, level: 1, xp: 15, lastUpdate: Date.now() };
			}
		},

		savePetState(pet) {
			try {
				pet.lastUpdate = Date.now();
				while (pet.xp >= pet.level * 50) {
					pet.xp -= pet.level * 50;
					pet.level++;
				}
				const payload = JSON.stringify(pet);
				if (window.DeskStorage) window.DeskStorage.setItem(STORAGE_KEY_PET, payload);
				else localStorage.setItem(STORAGE_KEY_PET, payload);
			} catch (e) {}
		},

		getScratchpadNote() {
			try {
				return (window.DeskStorage ? window.DeskStorage.getItem(STORAGE_KEY_NOTES) : localStorage.getItem(STORAGE_KEY_NOTES)) || '';
			} catch (e) {
				return '';
			}
		},

		saveScratchpadNote(text) {
			try {
				if (window.DeskStorage) window.DeskStorage.setItem(STORAGE_KEY_NOTES, text);
				else localStorage.setItem(STORAGE_KEY_NOTES, text);
			} catch (e) {}
		}
	};

	window.ClippyActivities = ActivitiesManager;
})();
