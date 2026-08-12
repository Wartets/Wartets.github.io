const NAV_LABELS = {
	prevYear: { fr: 'Année précédente', en: 'Previous year' },
	prevMonth: { fr: 'Mois précédent', en: 'Previous month' },
	nextMonth: { fr: 'Mois suivant', en: 'Next month' },
	nextYear: { fr: 'Année suivante', en: 'Next year' }
};

function navLabel(key, lang) {
	const entry = NAV_LABELS[key];
	if (!entry) return key;
	if (window.resolveWithFallback) return window.resolveWithFallback(entry, lang) || key;
	return entry.en || key;
}

function isSameUTCDate(a, b) {
	return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate();
}

function daysInMonth(year, month) {
	return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function weekdayLabels(lang) {
	const labels = [];
	const locale = window.getIntlTag ? window.getIntlTag(lang) : 'en-US';
	for (let i = 1; i <= 7; i++) {
		const reference = new Date(Date.UTC(2024, 0, i));
		labels.push(new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' }).format(reference));
	}
	return labels;
}

export function buildCalendar(container, options) {
	let viewYear = options.initialDate.getUTCFullYear();
	let viewMonth = options.initialDate.getUTCMonth();
	let selectedDate = options.initialDate;
	const todayDate = options.todayDate;

	function currentLang() {
		return window.currentSiteLang || document.documentElement.lang || 'en';
	}

	function render() {
		const lang = currentLang();
		const locale = lang === 'fr' ? 'fr-FR' : 'en-US';
		container.innerHTML = '';

		const header = document.createElement('div');
		header.className = 'debug-calendar-header';

		const prevYearBtn = document.createElement('button');
		prevYearBtn.type = 'button';
		prevYearBtn.className = 'debug-calendar-nav';
		prevYearBtn.setAttribute('aria-label', navLabel('prevYear', lang));
		prevYearBtn.innerHTML = '<i class="fa-solid fa-angles-left" aria-hidden="true"></i>';
		prevYearBtn.addEventListener('click', () => {
			viewYear -= 1;
			render();
		});

		const prevMonthBtn = document.createElement('button');
		prevMonthBtn.type = 'button';
		prevMonthBtn.className = 'debug-calendar-nav';
		prevMonthBtn.setAttribute('aria-label', navLabel('prevMonth', lang));
		prevMonthBtn.innerHTML = '<i class="fa-solid fa-chevron-left" aria-hidden="true"></i>';
		prevMonthBtn.addEventListener('click', () => {
			viewMonth -= 1;
			if (viewMonth < 0) {
				viewMonth = 11;
				viewYear -= 1;
			}
			render();
		});

		const label = document.createElement('span');
		label.className = 'debug-calendar-label';
		label.textContent = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(viewYear, viewMonth, 1)));

		const nextMonthBtn = document.createElement('button');
		nextMonthBtn.type = 'button';
		nextMonthBtn.className = 'debug-calendar-nav';
		nextMonthBtn.setAttribute('aria-label', navLabel('nextMonth', lang));
		nextMonthBtn.innerHTML = '<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>';
		nextMonthBtn.addEventListener('click', () => {
			viewMonth += 1;
			if (viewMonth > 11) {
				viewMonth = 0;
				viewYear += 1;
			}
			render();
		});

		const nextYearBtn = document.createElement('button');
		nextYearBtn.type = 'button';
		nextYearBtn.className = 'debug-calendar-nav';
		nextYearBtn.setAttribute('aria-label', navLabel('nextYear', lang));
		nextYearBtn.innerHTML = '<i class="fa-solid fa-angles-right" aria-hidden="true"></i>';
		nextYearBtn.addEventListener('click', () => {
			viewYear += 1;
			render();
		});

		header.append(prevYearBtn, prevMonthBtn, label, nextMonthBtn, nextYearBtn);
		container.appendChild(header);

		const weekdaysRow = document.createElement('div');
		weekdaysRow.className = 'debug-calendar-weekdays';
		weekdayLabels(lang).forEach(text => {
			const cell = document.createElement('span');
			cell.textContent = text;
			weekdaysRow.appendChild(cell);
		});
		container.appendChild(weekdaysRow);

		const grid = document.createElement('div');
		grid.className = 'debug-calendar-grid';

		const firstOfMonth = new Date(Date.UTC(viewYear, viewMonth, 1));
		const firstWeekdayRaw = firstOfMonth.getUTCDay();
		const firstWeekday = firstWeekdayRaw === 0 ? 6 : firstWeekdayRaw - 1;

		const totalDaysThisMonth = daysInMonth(viewYear, viewMonth);
		const prevMonthIndex = viewMonth - 1 < 0 ? 11 : viewMonth - 1;
		const prevMonthYear = viewMonth - 1 < 0 ? viewYear - 1 : viewYear;
		const totalDaysPrevMonth = daysInMonth(prevMonthYear, prevMonthIndex);

		const cells = [];
		for (let i = 0; i < firstWeekday; i++) {
			cells.push({ day: totalDaysPrevMonth - firstWeekday + 1 + i, monthOffset: -1 });
		}
		for (let d = 1; d <= totalDaysThisMonth; d++) {
			cells.push({ day: d, monthOffset: 0 });
		}
		const remaining = (7 - (cells.length % 7)) % 7;
		for (let i = 1; i <= remaining; i++) {
			cells.push({ day: i, monthOffset: 1 });
		}

		cells.forEach(cellInfo => {
			const cellDate = new Date(Date.UTC(viewYear, viewMonth + cellInfo.monthOffset, cellInfo.day));
			const button = document.createElement('button');
			button.type = 'button';
			button.className = 'debug-calendar-day';
			if (cellInfo.monthOffset !== 0) button.classList.add('is-outside-month');
			const isToday = isSameUTCDate(cellDate, todayDate);
			const isSelected = isSameUTCDate(cellDate, selectedDate);
			if (isToday) {
				button.classList.add('is-today');
				button.setAttribute('aria-current', 'date');
			}
			if (isSelected) {
				button.classList.add('is-selected');
				button.setAttribute('aria-pressed', 'true');
			}
			button.textContent = String(cellInfo.day);
			button.setAttribute('aria-label', new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(cellDate));
			button.addEventListener('click', () => {
				selectedDate = cellDate;
				if (cellInfo.monthOffset !== 0) {
					viewYear = cellDate.getUTCFullYear();
					viewMonth = cellDate.getUTCMonth();
				}
				render();
				options.onSelect(cellDate);
			});
			grid.appendChild(button);
		});

		container.appendChild(grid);
	}

	render();

	return {
		setSelectedDate(dateUTC) {
			selectedDate = dateUTC;
			viewYear = dateUTC.getUTCFullYear();
			viewMonth = dateUTC.getUTCMonth();
			render();
		},
		refresh() {
			render();
		}
	};
}
