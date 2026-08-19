(function () {
	const TILE_SERVERS = {
		osm: {
			name: 'OpenStreetMap Standard',
			url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
			subdomains: ['a', 'b', 'c'],
			maxZoom: 18,
			attribution: '© OpenStreetMap contributors'
		},
		cartoLight: {
			name: 'Encarta Physical / Carto',
			url: 'https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
			subdomains: ['a', 'b', 'c', 'd'],
			maxZoom: 18,
			attribution: '© OpenStreetMap © CARTO'
		},
		cartoDark: {
			name: 'Satellite Night / Dark',
			url: 'https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
			subdomains: ['a', 'b', 'c', 'd'],
			maxZoom: 18,
			attribution: '© OpenStreetMap © CARTO'
		},
		topo: {
			name: 'Topographic Relief Atlas',
			url: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
			subdomains: ['a', 'b', 'c'],
			maxZoom: 17,
			attribution: '© OpenTopoMap © OpenStreetMap'
		}
	};

	const WORLD_DATABASE = [
		{
			id: 'fra',
			name: 'France',
			official: 'French Republic',
			capital: 'Paris',
			lat: 48.8566,
			lon: 2.3522,
			continent: 'Europe',
			region: 'Western Europe',
			population: 67750000,
			area: 643801,
			highestPoint: 'Mont Blanc (4,809 m)',
			currency: 'Euro (EUR, €)',
			languages: ['French'],
			tz: 'UTC+1 (CET)',
			callingCode: '+33',
			flagColors: ['#002395', '#ffffff', '#ed2939'],
			overview: 'France spans from the Mediterranean Sea to the English Channel and the North Sea, and from the Rhine to the Atlantic Ocean. Renowned for its scientific contributions to calculus, fluid mechanics, and the metric system.',
			geography: 'Metropolitan France features extensive agricultural plains in the north and west, rolling hills in the Massif Central, and formidable alpine mountain ranges on the Italian and Swiss borders.',
			landmarks: [
				{ name: 'Eiffel Tower', lat: 48.8584, lon: 2.2945, desc: 'Wrought-iron lattice tower on the Champ de Mars in Paris, constructed in 1889.' },
				{ name: 'Mont-Saint-Michel', lat: 48.6360, lon: -1.5115, desc: 'Tidal island and medieval Benedictine abbey in Normandy.' }
			]
		},
		{
			id: 'gbr',
			name: 'United Kingdom',
			official: 'United Kingdom of Great Britain and Northern Ireland',
			capital: 'London',
			lat: 51.5074,
			lon: -0.1278,
			continent: 'Europe',
			region: 'Northern Europe',
			population: 67330000,
			area: 242495,
			highestPoint: 'Ben Nevis (1,345 m)',
			currency: 'Pound Sterling (GBP, £)',
			languages: ['English', 'Welsh', 'Scots'],
			tz: 'UTC+0 (GMT)',
			callingCode: '+44',
			flagColors: ['#012169', '#ffffff', '#c8102e'],
			overview: 'An island nation situated off the northwestern coast of continental Europe. Cradle of the Industrial Revolution, modern computing foundations through Babbage and Turing, and common law.',
			geography: 'Comprises Great Britain, the northeastern part of Ireland, and numerous surrounding smaller islands. Characterized by rugged highlands in Scotland and Wales, and undulating terrain across England.',
			landmarks: [
				{ name: 'Big Ben & Westminster', lat: 51.5007, lon: -0.1246, desc: 'Iconic neo-Gothic clock tower and Houses of Parliament on the River Thames.' },
				{ name: 'Stonehenge', lat: 51.1789, lon: -1.8262, desc: 'Prehistoric monument consisting of an outer ring of vertical sarsen standing stones in Wiltshire.' }
			]
		},
		{
			id: 'usa',
			name: 'United States',
			official: 'United States of America',
			capital: 'Washington, D.C.',
			lat: 38.9072,
			lon: -77.0369,
			continent: 'North America',
			region: 'Northern America',
			population: 331900000,
			area: 9833517,
			highestPoint: 'Denali (6,190 m)',
			currency: 'US Dollar (USD, $)',
			languages: ['English', 'Spanish'],
			tz: 'UTC-5 to UTC-10',
			callingCode: '+1',
			flagColors: ['#b22234', '#ffffff', '#3c3b6e'],
			overview: 'Federal republic composed of 50 states, a federal district, and several territories. Leading economic and technological power with extensive contributions to microprocessor architectures and space research.',
			geography: 'Extends from the Atlantic to the Pacific Ocean, bordered by Canada to the north and Mexico to the south. Ranges from dense temperate rainforests to the Great Plains and the Rocky Mountains.',
			landmarks: [
				{ name: 'Statue of Liberty', lat: 40.6892, lon: -74.0445, desc: 'Colossal neoclassical copper sculpture on Liberty Island in New York Harbor.' },
				{ name: 'Grand Canyon', lat: 36.1069, lon: -112.1129, desc: 'Steep-sided canyon carved by the Colorado River in Arizona.' }
			]
		},
		{
			id: 'jpn',
			name: 'Japan',
			official: 'State of Japan',
			capital: 'Tokyo',
			lat: 35.6762,
			lon: 139.6503,
			continent: 'Asia',
			region: 'Eastern Asia',
			population: 125700000,
			area: 377975,
			highestPoint: 'Mount Fuji (3,776 m)',
			currency: 'Japanese Yen (JPY, ¥)',
			languages: ['Japanese'],
			tz: 'UTC+9 (JST)',
			callingCode: '+81',
			flagColors: ['#ffffff', '#bc002d'],
			overview: 'Stratovolcanic archipelago in East Asia. A global leader in robotics, optical engineering, high-speed rail transportation, and microelectronics manufacturing.',
			geography: 'Consists of four main islands: Honshu, Hokkaido, Kyushu, and Shikoku. Over 73% of the land area is mountainous and heavily forested.',
			landmarks: [
				{ name: 'Mount Fuji', lat: 35.3606, lon: 138.7274, desc: 'Active stratovolcano and Japan’s highest peak, renowned for its symmetrical snow-capped cone.' },
				{ name: 'Fushimi Inari Shrine', lat: 34.9671, lon: 135.7727, desc: 'Shinto shrine in Kyoto famous for thousands of vermilion torii gates.' }
			]
		},
		{
			id: 'deu',
			name: 'Germany',
			official: 'Federal Republic of Germany',
			capital: 'Berlin',
			lat: 52.5200,
			lon: 13.4050,
			continent: 'Europe',
			region: 'Western Europe',
			population: 83240000,
			area: 357022,
			highestPoint: 'Zugspitze (2,962 m)',
			currency: 'Euro (EUR, €)',
			languages: ['German'],
			tz: 'UTC+1 (CET)',
			callingCode: '+49',
			flagColors: ['#000000', '#dd0000', '#ffcc00'],
			overview: 'Located in Central Europe between the Baltic and North Seas to the north and the Alps to the south. Renowned for precision automotive engineering, physics, and philosophy.',
			geography: 'Rises from northern lowlands through the forested central uplands to the high elevations of the Bavarian Alps.',
			landmarks: [
				{ name: 'Brandenburg Gate', lat: 52.5163, lon: 13.3777, desc: '18th-century neoclassical monument in Berlin representing peace and unity.' },
				{ name: 'Neuschwanstein Castle', lat: 47.5576, lon: 10.7498, desc: '19th-century historicist palace on a rugged hill above the village of Hohenschwangau.' }
			]
		},
		{
			id: 'can',
			name: 'Canada',
			official: 'Canada',
			capital: 'Ottawa',
			lat: 45.4215,
			lon: -75.6972,
			continent: 'North America',
			region: 'Northern America',
			population: 38250000,
			area: 9984670,
			highestPoint: 'Mount Logan (5,959 m)',
			currency: 'Canadian Dollar (CAD, $)',
			languages: ['English', 'French'],
			tz: 'UTC-3.5 to UTC-8',
			callingCode: '+1',
			flagColors: ['#ff0000', '#ffffff'],
			overview: 'Second-largest country by total area in the world, spanning three ocean coastlines: Atlantic, Pacific, and Arctic. Rich in freshwater resources and boreal biomes.',
			geography: 'Encompasses vast Arctic archipelagoes, the Canadian Shield plateau, the interior prairies, and the Canadian Rockies.',
			landmarks: [
				{ name: 'Niagara Falls (Horseshoe)', lat: 43.0799, lon: -79.0747, desc: 'Massive waterfall system on the Niagara River draining Lake Erie into Lake Ontario.' },
				{ name: 'CN Tower', lat: 43.6426, lon: -79.3871, desc: '553.3 m-high concrete communications and observation tower in downtown Toronto.' }
			]
		},
		{
			id: 'bra',
			name: 'Brazil',
			official: 'Federative Republic of Brazil',
			capital: 'Brasília',
			lat: -15.7975,
			lon: -47.8919,
			continent: 'South America',
			region: 'South America',
			population: 214300000,
			area: 8515767,
			highestPoint: 'Pico da Neblina (2,995 m)',
			currency: 'Brazilian Real (BRL, R$)',
			languages: ['Portuguese'],
			tz: 'UTC-2 to UTC-5',
			callingCode: '+55',
			flagColors: ['#009c3b', '#ffdf00', '#002776'],
			overview: 'Largest country in South America and the fifth largest nation globally. Houses the Amazon River basin, representing the greatest tropical biodiversity repository on Earth.',
			geography: 'Dominated by the Amazon Lowlands in the north and the Brazilian Highlands plateau in the south and central regions.',
			landmarks: [
				{ name: 'Christ the Redeemer', lat: -22.9519, lon: -43.2105, desc: 'Art Deco statue of Jesus Christ atop the 700-meter Corcovado mountain in Rio de Janeiro.' },
				{ name: 'Iguazu Falls', lat: -25.6953, lon: -54.4367, desc: 'Semi-circular waterfall cataract spanning 2.7 kilometers on the border with Argentina.' }
			]
		},
		{
			id: 'aus',
			name: 'Australia',
			official: 'Commonwealth of Australia',
			capital: 'Canberra',
			lat: -35.2809,
			lon: 149.1300,
			continent: 'Oceania',
			region: 'Australia and New Zealand',
			population: 25690000,
			area: 7692024,
			highestPoint: 'Mount Kosciuszko (2,228 m)',
			currency: 'Australian Dollar (AUD, $)',
			languages: ['English'],
			tz: 'UTC+8 to UTC+10.5',
			callingCode: '+61',
			flagColors: ['#012169', '#ffffff', '#e4002b'],
			overview: 'Comprises the mainland of the Australian continent, the island of Tasmania, and numerous smaller islands. Oldest, flattest, and driest inhabited continent with unique marsupial fauna.',
			geography: 'Dominated by the Western Plateau and Great Dividing Range along the eastern seaboard, flanking the arid central Outback.',
			landmarks: [
				{ name: 'Sydney Opera House', lat: -33.8568, lon: 151.2153, desc: 'Multi-venue performing arts centre with distinctive interlocking vaulted sail roofs on Sydney Harbour.' },
				{ name: 'Uluru (Ayers Rock)', lat: -25.3444, lon: 131.0369, desc: 'Massive sandstone monolith in the southern part of the Northern Territory.' }
			]
		},
		{
			id: 'chn',
			name: 'China',
			official: "People's Republic of China",
			capital: 'Beijing',
			lat: 39.9042,
			lon: 116.4074,
			continent: 'Asia',
			region: 'Eastern Asia',
			population: 1412000000,
			area: 9596961,
			highestPoint: 'Mount Everest (8,848.86 m)',
			currency: 'Chinese Yuan (CNY, ¥)',
			languages: ['Standard Chinese'],
			tz: 'UTC+8 (CST)',
			callingCode: '+86',
			flagColors: ['#de2910', '#ffde00'],
			overview: 'Ancient civilization spanning over five millennia. Global economic hub, leading in high-speed infrastructure, discrete mathematics, and advanced materials manufacturing.',
			geography: 'Steps down from the high Tibetan Plateau in the west through central plateaus and basins to the fertile eastern plains along the Yellow and Yangtze rivers.',
			landmarks: [
				{ name: 'Great Wall of China', lat: 40.4319, lon: 116.5704, desc: 'Ancient series of stone and rammed-earth fortifications stretching across historical northern borders.' },
				{ name: 'Forbidden City', lat: 39.9163, lon: 116.3972, desc: 'Palace complex in central Beijing, serving as the imperial palace from the Ming to the Qing dynasty.' }
			]
		},
		{
			id: 'ind',
			name: 'India',
			official: 'Republic of India',
			capital: 'New Delhi',
			lat: 28.6139,
			lon: 77.2090,
			continent: 'Asia',
			region: 'Southern Asia',
			population: 1408000000,
			area: 3287263,
			highestPoint: 'Kangchenjunga (8,586 m)',
			currency: 'Indian Rupee (INR, ₹)',
			languages: ['Hindi', 'English', '22 recognized languages'],
			tz: 'UTC+5:30 (IST)',
			callingCode: '+91',
			flagColors: ['#ff9933', '#ffffff', '#128807', '#000080'],
			overview: 'Seventh-largest country by area and most populous democracy. Birthplace of zero, major trigonometric series expansions, and foundational astrophysics.',
			geography: 'Bounded by the Indian Ocean on the south, the Arabian Sea on the southwest, and the Bay of Bengal on the southeast, sheltered by the Himalayas in the north.',
			landmarks: [
				{ name: 'Taj Mahal', lat: 27.1751, lon: 78.0421, desc: 'Ivory-white marble mausoleum on the right bank of the river Yamuna in Agra.' },
				{ name: 'Qutub Minar', lat: 28.5244, lon: 77.1855, desc: '72.5-meter tall minaret forming part of the Qutb complex in Mehrauli, Delhi.' }
			]
		},
		{
			id: 'rus',
			name: 'Russia',
			official: 'Russian Federation',
			capital: 'Moscow',
			lat: 55.7558,
			lon: 37.6173,
			continent: 'Europe/Asia',
			region: 'Eastern Europe / Northern Asia',
			population: 143400000,
			area: 17098242,
			highestPoint: 'Mount Elbrus (5,642 m)',
			currency: 'Russian Ruble (RUB, ₽)',
			languages: ['Russian'],
			tz: 'UTC+2 to UTC+12',
			callingCode: '+7',
			flagColors: ['#ffffff', '#0039a6', '#d52b1e'],
			overview: 'Largest country in the world, covering more than one-eighth of Earth’s inhabited land area. Extends across eleven time zones with rich traditions in mathematics and space exploration.',
			geography: 'Extensive European Plain in the west, separated from the vast West Siberian Plain and Siberian Plateau by the Ural Mountains.',
			landmarks: [
				{ name: 'Saint Basil’s Cathedral', lat: 55.7525, lon: 37.6231, desc: 'Iconic multi-domed orthodox church on Red Square in Moscow.' },
				{ name: 'Hermitage Museum (Winter Palace)', lat: 59.9398, lon: 30.3146, desc: 'Major art and culture museum situated on the Neva embankment in Saint Petersburg.' }
			]
		},
		{
			id: 'ita',
			name: 'Italy',
			official: 'Italian Republic',
			capital: 'Rome',
			lat: 41.9028,
			lon: 12.4964,
			continent: 'Europe',
			region: 'Southern Europe',
			population: 59030000,
			area: 301340,
			highestPoint: 'Monte Bianco (4,808 m)',
			currency: 'Euro (EUR, €)',
			languages: ['Italian'],
			tz: 'UTC+1 (CET)',
			callingCode: '+39',
			flagColors: ['#009246', '#ffffff', '#ce2b37'],
			overview: 'Peninsular country located in Southern Europe. Cradle of the Roman Empire and Renaissance, home to foundational discoveries in physics, anatomy, and classical geometry.',
			geography: 'Boot-shaped peninsula extending into the Mediterranean Sea, bordered by the Alps in the north and traversed by the Apennine Mountains.',
			landmarks: [
				{ name: 'Colosseum', lat: 41.8902, lon: 12.4922, desc: 'Oval amphitheatre in the centre of the city of Rome, the largest ancient amphitheatre built.' },
				{ name: 'Leaning Tower of Pisa', lat: 43.7230, lon: 10.3966, desc: 'Freestanding bell tower of the cathedral of Pisa, known for its unintended tilt.' }
			]
		},
		{
			id: 'egy',
			name: 'Egypt',
			official: 'Arab Republic of Egypt',
			capital: 'Cairo',
			lat: 30.0444,
			lon: 31.2357,
			continent: 'Africa',
			region: 'Northern Africa',
			population: 109300000,
			area: 1002450,
			highestPoint: 'Mount Catherine (2,629 m)',
			currency: 'Egyptian Pound (EGP, E£)',
			languages: ['Arabic'],
			tz: 'UTC+2 (EET)',
			callingCode: '+20',
			flagColors: ['#ce1126', '#ffffff', '#000000'],
			overview: 'Transcontinental country spanning the northeast corner of Africa and southwest corner of Asia via the Sinai Peninsula. Holds one of the earliest civilizations in human history.',
			geography: 'Dominated by the arid Sahara Desert, bifurcated by the fertile Nile River Valley and the Mediterranean Delta.',
			landmarks: [
				{ name: 'Great Pyramid of Giza', lat: 29.9792, lon: 31.1342, desc: 'Oldest and largest of the pyramids in the Giza pyramid complex, the sole surviving Ancient Wonder.' },
				{ name: 'Karnak Temple Complex', lat: 25.7188, lon: 32.6573, desc: 'Vast mix of decayed temples, chapels, pylons, and other buildings near Luxor.' }
			]
		},
		{
			id: 'zaf',
			name: 'South Africa',
			official: 'Republic of South Africa',
			capital: 'Pretoria',
			lat: -25.7479,
			lon: 28.2293,
			continent: 'Africa',
			region: 'Southern Africa',
			population: 59390000,
			area: 1221037,
			highestPoint: 'Mafadi (3,450 m)',
			currency: 'South African Rand (ZAR, R)',
			languages: ['11 official languages including Zulu, Xhosa, Afrikaans, English'],
			tz: 'UTC+2 (SAST)',
			callingCode: '+27',
			flagColors: ['#000000', '#ffb612', '#007749', '#ffffff', '#de3831', '#002395'],
			overview: 'Southernmost country in Africa, with three official capitals: Pretoria (executive), Cape Town (legislative), and Bloemfontein (judicial).',
			geography: 'Bordered by the South Atlantic and Indian oceans, featuring an interior plateau surrounded by the Great Escarpment.',
			landmarks: [
				{ name: 'Table Mountain', lat: -33.9628, lon: 18.4098, desc: 'Flat-topped mountain forming a prominent landmark overlooking Cape Town.' },
				{ name: 'Kruger National Park', lat: -23.9884, lon: 31.5547, desc: 'One of the largest game reserves in Africa covering nearly 20,000 square kilometers.' }
			]
		},
		{
			id: 'che',
			name: 'Switzerland',
			official: 'Swiss Confederation',
			capital: 'Bern',
			lat: 46.9480,
			lon: 7.4474,
			continent: 'Europe',
			region: 'Western Europe',
			population: 8700000,
			area: 41285,
			highestPoint: 'Dufourspitze (4,634 m)',
			currency: 'Swiss Franc (CHF, Fr.)',
			languages: ['German', 'French', 'Italian', 'Romansh'],
			tz: 'UTC+1 (CET)',
			callingCode: '+41',
			flagColors: ['#ff0000', '#ffffff'],
			overview: 'Landlocked nation situated at the confluence of Western, Central, and Southern Europe. Global centre for particle physics (CERN) and precision watchmaking.',
			geography: 'Geographically divided between the Alps, the Swiss Plateau, and the Jura mountains.',
			landmarks: [
				{ name: 'Matterhorn', lat: 45.9763, lon: 7.6586, desc: 'Iconic pyramidal peak in the Pennine Alps on the border between Switzerland and Italy.' },
				{ name: 'CERN Large Hadron Collider', lat: 46.2330, lon: 6.0557, desc: 'World’s largest and highest-energy particle collider near Geneva.' }
			]
		},
		{
			id: 'nor',
			name: 'Norway',
			official: 'Kingdom of Norway',
			capital: 'Oslo',
			lat: 59.9139,
			lon: 10.7522,
			continent: 'Europe',
			region: 'Northern Europe',
			population: 5430000,
			area: 385207,
			highestPoint: 'Galdhøpiggen (2,469 m)',
			currency: 'Norwegian Krone (NOK, kr)',
			languages: ['Norwegian', 'Sámi'],
			tz: 'UTC+1 (CET)',
			callingCode: '+47',
			flagColors: ['#ba0c2f', '#ffffff', '#00205b'],
			overview: 'Nordic country in Northern Europe whose mainland territory comprises the western and northernmost portion of the Scandinavian Peninsula.',
			geography: 'Famous for its deeply indented fjord coastline carved by prehistoric glaciers, mountainous plateaus, and Arctic islands.',
			landmarks: [
				{ name: 'Geirangerfjord', lat: 62.1015, lon: 7.0940, desc: 'UNESCO-listed fjord in Sunnmøre region known for deep blue waters and majestic waterfalls.' },
				{ name: 'Preikestolen (Pulpit Rock)', lat: 58.9864, lon: 6.1887, desc: 'Steep cliff towering 604 metres over the Lysefjorden.' }
			]
		},
		{
			id: 'arg',
			name: 'Argentina',
			official: 'Argentine Republic',
			capital: 'Buenos Aires',
			lat: -34.6037,
			lon: -58.3816,
			continent: 'South America',
			region: 'South America',
			population: 45810000,
			area: 2780400,
			highestPoint: 'Aconcagua (6,961 m)',
			currency: 'Argentine Peso (ARS, $)',
			languages: ['Spanish'],
			tz: 'UTC-3 (ART)',
			callingCode: '+54',
			flagColors: ['#74acdf', '#ffffff', '#f6b40e'],
			overview: 'Second-largest country in South America by area, stretching from subtropical northern borders to the sub-Antarctic tip of Tierra del Fuego.',
			geography: 'Features the Andes mountains in the west, the fertile Pampas lowlands in the centre, and the arid plateaus of Patagonia in the south.',
			landmarks: [
				{ name: 'Perito Moreno Glacier', lat: -50.4961, lon: -73.1378, desc: 'Spectacular active advancing glacier located in Los Glaciares National Park.' },
				{ name: 'Teatro Colón', lat: -34.6011, lon: -58.3831, desc: 'Main opera house in Buenos Aires, renowned for acoustical excellence.' }
			]
		},
		{
			id: 'mex',
			name: 'Mexico',
			official: 'United Mexican States',
			capital: 'Mexico City',
			lat: 19.4326,
			lon: -99.1332,
			continent: 'North America',
			region: 'Central America / Northern America',
			population: 126700000,
			area: 1964375,
			highestPoint: 'Pico de Orizaba (5,636 m)',
			currency: 'Mexican Peso (MXN, $)',
			languages: ['Spanish', '68 indigenous languages'],
			tz: 'UTC-5 to UTC-8',
			callingCode: '+52',
			flagColors: ['#006847', '#ffffff', '#ce1126'],
			overview: 'Country in the southern portion of North America. Site of pre-Columbian Mesoamerican civilizations including the Maya, Zapotec, and Aztec empires.',
			geography: 'Encompasses high interior plateaus framed by the Sierra Madre mountain chains, dropping to tropical coastal lowlands.',
			landmarks: [
				{ name: 'Chichen Itza (El Castillo)', lat: 20.6843, lon: -88.5678, desc: 'Monumental step pyramid temple built by the Maya civilization in Yucatán.' },
				{ name: 'Teotihuacan Pyramids', lat: 19.6925, lon: -98.8437, desc: 'Ancient Mesoamerican city renowned for the Pyramid of the Sun and Moon.' }
			]
		},
		{
			id: 'kor',
			name: 'South Korea',
			official: 'Republic of Korea',
			capital: 'Seoul',
			lat: 37.5665,
			lon: 126.9780,
			continent: 'Asia',
			region: 'Eastern Asia',
			population: 51740000,
			area: 100210,
			highestPoint: 'Hallasan (1,947 m)',
			currency: 'South Korean Won (KRW, ₩)',
			languages: ['Korean'],
			tz: 'UTC+9 (KST)',
			callingCode: '+82',
			flagColors: ['#ffffff', '#cd2e3a', '#0047a0', '#000000'],
			overview: 'Highly developed nation in East Asia occupying the southern half of the Korean Peninsula. World leader in memory chips, flat panel displays, and broadband.',
			geography: 'Predominantly mountainous terrain along the east coast, sloping to gentle coastal plains in the west and south.',
			landmarks: [
				{ name: 'Gyeongbokgung Palace', lat: 37.5796, lon: 126.9770, desc: 'Main royal palace of the Joseon dynasty, originally built in 1395 in Seoul.' },
				{ name: 'N Seoul Tower', lat: 37.5512, lon: 126.9882, desc: 'Communication and observation tower located on Namsan Mountain.' }
			]
		},
		{
			id: 'grc',
			name: 'Greece',
			official: 'Hellenic Republic',
			capital: 'Athens',
			lat: 37.9838,
			lon: 23.7275,
			continent: 'Europe',
			region: 'Southern Europe',
			population: 10430000,
			area: 131957,
			highestPoint: 'Mount Olympus (2,918 m)',
			currency: 'Euro (EUR, €)',
			languages: ['Greek'],
			tz: 'UTC+2 (EET)',
			callingCode: '+30',
			flagColors: ['#0d5eaf', '#ffffff'],
			overview: 'Located in Southeast Europe on the southern tip of the Balkan Peninsula. Birthplace of democracy, Western philosophy, classical literature, and the Olympic Games.',
			geography: 'Features extensive mountainous terrain on the mainland and an archipelago of over 2,000 islands scattered across the Aegean and Ionian seas.',
			landmarks: [
				{ name: 'Acropolis & Parthenon', lat: 37.9715, lon: 23.7257, desc: 'Ancient citadel located on a rocky outcrop above the city of Athens.' },
				{ name: 'Meteora Monasteries', lat: 39.7217, lon: 21.6306, desc: 'Monastery complex built upon colossal natural rock pillars in central Greece.' }
			]
		}
	];

	function computeDistanceKm(lat1, lon1, lat2, lon2) {
		const R = 6371;
		const dLat = (lat2 - lat1) * Math.PI / 180;
		const dLon = (lon2 - lon1) * Math.PI / 180;
		const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
			Math.sin(dLon / 2) * Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return Math.round(R * c);
	}

	const EncartaGlobeApp = {
		open() {
			const id = 'window-encarta-globe';
			const existingWin = document.getElementById(id);
			if (existingWin) {
				if (typeof bringWindowToFront === 'function') bringWindowToFront(existingWin);
				if (existingWin.classList.contains('minimized') && typeof unminimizeWindow === 'function') {
					unminimizeWindow(existingWin);
				}
				return existingWin;
			}

			const contentHTML = this.buildWindowTemplate();
			const win = createXPWindow(id, 'Microsoft Encarta World Atlas 2002', contentHTML, 880, 580, {
				iconSrc: '../assets/images/desk/icons/Earth (fixed).webp',
				resizable: true
			});

			win.classList.add('xp-encarta-app-window');
			win.dataset.appId = 'encarta';
			win.querySelector('.xp-window-content').style.padding = '0';
			win.querySelector('.xp-window-content').style.overflow = 'hidden';

			this.initAtlasEngine(win);
			return win;
		},

		buildWindowTemplate() {
			return `
				<div class="xp-explorer-layout xp-encarta-layout">
					<div class="xp-explorer-menubar">
						<ul class="xp-menubar-list">
							<li class="xp-menubar-item" data-menu="file"><u>F</u>ile</li>
							<li class="xp-menubar-item" data-menu="edit"><u>E</u>dit</li>
							<li class="xp-menubar-item" data-menu="view"><u>V</u>iew</li>
							<li class="xp-menubar-item" data-menu="projections"><u>P</u>rojections</li>
							<li class="xp-menubar-item" data-menu="tools"><u>T</u>ools</li>
							<li class="xp-menubar-item" data-menu="help"><u>H</u>elp</li>
						</ul>
						<div class="xp-menubar-brand">
							<img src="../assets/images/desk/window_logo.png" alt="XP">
						</div>
					</div>

					<div class="xp-explorer-toolbar xp-encarta-toolbar">
						<div class="xp-tb-group">
							<button type="button" class="xp-tb-btn tb-enc-zoom-in" title="Zoom In (+)">
								<img src="https://api.iconify.design/mdi/magnify-plus-outline.svg?color=%231b4b9b" alt="">
								<span>Zoom In</span>
							</button>
							<button type="button" class="xp-tb-btn tb-enc-zoom-out" title="Zoom Out (-)">
								<img src="https://api.iconify.design/mdi/magnify-minus-outline.svg?color=%231b4b9b" alt="">
								<span>Zoom Out</span>
							</button>
							<button type="button" class="xp-tb-btn tb-enc-reset" title="Full World Reset">
								<img src="https://api.iconify.design/mdi/earth.svg?color=%231b4b9b" alt="">
								<span>World</span>
							</button>
						</div>

						<div class="xp-tb-sep"></div>

						<div class="xp-tb-group">
							<button type="button" class="xp-tb-btn active tb-enc-proj-globe" title="3D Dynamic Rotating Globe">
								<img src="../assets/images/desk/icons/Earth (fixed).webp" alt="">
								<span>3D Globe</span>
							</button>
							<button type="button" class="xp-tb-btn tb-enc-proj-flat" title="2D Equirectangular Mercator Map">
								<img src="../assets/images/desk/icons/Display.webp" alt="">
								<span>Flat Map</span>
							</button>
							<button type="button" class="xp-tb-btn tb-enc-dither" title="Toggle 16-Color Vintage Dithered CRT Shading">
								<img src="https://api.iconify.design/mdi/monitor-shimmer.svg?color=%231b4b9b" alt="">
								<span>VGA Dither</span>
							</button>
						</div>

						<div class="xp-tb-sep"></div>

						<div class="xp-tb-group">
							<button type="button" class="xp-tb-btn tb-enc-quiz" title="Launch Encarta Geography Challenge">
								<img src="../assets/images/desk/icons/Trophy.webp" alt="">
								<span>Geo Quiz</span>
							</button>
							<button type="button" class="xp-tb-btn tb-enc-stats" title="Compare World Statistics">
								<img src="../assets/images/desk/icons/List File.webp" alt="">
								<span>Statistics</span>
							</button>
						</div>

						<div class="xp-tb-sep"></div>

						<div class="xp-tb-group" style="flex: 1; justify-content: flex-end;">
							<div class="xp-address-combo" style="max-width: 220px;">
								<img src="https://api.iconify.design/mdi/magnify.svg?color=%23555555" class="xp-address-icon" alt="">
								<input type="text" class="xp-address-input enc-find-input" placeholder="Search country, capital...">
							</div>
						</div>
					</div>

					<div class="xp-explorer-body xp-encarta-body">
						<div class="xp-explorer-sidebar xp-encarta-sidebar-panel">
							<div class="xp-sidebar-tasks-view">
								<div class="xp-task-box">
									<div class="xp-task-header">
										<span>Atlas Information</span>
										<button type="button" class="xp-task-chevron"></button>
									</div>
									<div class="xp-task-content enc-profile-content" id="enc-profile-viewport">
										<div class="enc-profile-empty">Select any country on the globe or type in the search bar above to inspect geographical and encyclopedic records.</div>
									</div>
								</div>

								<div class="xp-task-box">
									<div class="xp-task-header">
										<span>Geodesic Flight Calculator</span>
										<button type="button" class="xp-task-chevron"></button>
									</div>
									<div class="xp-task-content">
										<div style="font-size: 11px; line-height: 1.35; color: var(--xp-main-text);">Click two distinct countries or landmarks to calculate Great-Circle flight paths:</div>
										<div class="enc-dist-result" id="enc-flight-distance-display">Distance: -- km</div>
										<button type="button" class="xp-button-small enc-clear-dist-btn" style="margin-top: 4px;">Clear Measurement</button>
									</div>
								</div>

								<div class="xp-task-box">
									<div class="xp-task-header">
										<span>Quick Country Index</span>
										<button type="button" class="xp-task-chevron"></button>
									</div>
									<div class="xp-task-content enc-countries-quick-list" id="enc-quick-country-list" style="max-height: 140px; overflow-y: auto;"></div>
								</div>
							</div>
						</div>

						<div class="xp-explorer-splitter"></div>

						<div class="xp-explorer-main xp-encarta-viewport-container">
							<canvas class="encarta-gl-canvas" id="encarta-canvas-viewport"></canvas>

							<div class="encarta-viewport-overlay">
								<div class="encarta-overlay-hud" id="enc-telemetry-hud">00.00° N, 00.00° E | Scale: 1:100,000,000</div>
								<div class="encarta-layer-selector">
									<label for="enc-layer-select" style="font-size:10px; font-weight:bold; color:#ffffff;">Map Layer:</label>
									<select class="xp-select" id="enc-layer-select" style="font-size:10px; height:20px;">
										<option value="cartoLight" selected>Encarta Physical Topography</option>
										<option value="osm">OpenStreetMap Standard</option>
										<option value="cartoDark">Satellite Night Shading</option>
										<option value="topo">Topographic Contour Relief</option>
									</select>
								</div>
							</div>

							<div class="encarta-quiz-overlay" id="enc-quiz-panel" style="display: none;">
								<div class="encarta-quiz-header">
									<strong>Encarta Geography Quiz</strong>
									<span id="enc-quiz-score-badge">Score: 0 / 0</span>
								</div>
								<div class="encarta-quiz-body" id="enc-quiz-prompt-text">Locate France on the map and click it!</div>
								<button type="button" class="xp-button-small" id="enc-quiz-exit-btn">Exit Quiz</button>
							</div>
						</div>
					</div>

					<div class="xp-explorer-statusbar">
						<div class="xp-sb-pane xp-sb-count" id="enc-sb-selected-info">Microsoft Encarta 2002 World Atlas</div>
						<div class="xp-sb-pane xp-sb-size" id="enc-sb-projection-mode">Orthographic 3D Globe</div>
						<div class="xp-sb-pane xp-sb-zone">
							<img src="../assets/images/desk/icons/Earth (fixed).webp" alt="">
							<span>Global Geography</span>
						</div>
					</div>
				</div>
			`;
		},

		initAtlasEngine(win) {
			const canvas = win.querySelector('#encarta-canvas-viewport');
			const searchInput = win.querySelector('.enc-find-input');
			const profileContainer = win.querySelector('#enc-profile-viewport');
			const quickListContainer = win.querySelector('#enc-quick-country-list');
			const hudTelemetry = win.querySelector('#enc-telemetry-hud');
			const flightDistDisplay = win.querySelector('#enc-flight-distance-display');
			const clearDistBtn = win.querySelector('.enc-clear-dist-btn');
			const layerSelect = win.querySelector('#enc-layer-select');
			const sbSelectedInfo = win.querySelector('#enc-sb-selected-info');
			const sbProjectionMode = win.querySelector('#enc-sb-projection-mode');

			const zoomInBtn = win.querySelector('.tb-enc-zoom-in');
			const zoomOutBtn = win.querySelector('.tb-enc-zoom-out');
			const resetBtn = win.querySelector('.tb-enc-reset');
			const globeProjBtn = win.querySelector('.tb-enc-proj-globe');
			const flatProjBtn = win.querySelector('.tb-enc-proj-flat');
			const ditherBtn = win.querySelector('.tb-enc-dither');
			const quizBtn = win.querySelector('.tb-enc-quiz');
			const statsBtn = win.querySelector('.tb-enc-stats');

			const quizPanel = win.querySelector('#enc-quiz-panel');
			const quizScoreBadge = win.querySelector('#enc-quiz-score-badge');
			const quizPromptText = win.querySelector('#enc-quiz-prompt-text');
			const quizExitBtn = win.querySelector('#enc-quiz-exit-btn');

			let is3D = true;
			let isDithered = false;
			let rotX = 15;
			let rotY = 0;
			let scale = 1.0;
			let panX = 0;
			let panY = 0;
			let isDragging = false;
			let dragStartX = 0;
			let dragStartY = 0;
			let selectedCountry = null;
			let measuredPoints = [];

			let quizActive = false;
			let quizCurrentTarget = null;
			let quizScore = 0;
			let quizTotal = 0;

			const tileImageCache = new Map();
			let activeTileLayer = 'cartoLight';

			const populateQuickIndex = () => {
				if (!quickListContainer) return;
				quickListContainer.innerHTML = '';
				const sorted = [...WORLD_DATABASE].sort((a, b) => a.name.localeCompare(b.name));
				sorted.forEach(c => {
					const item = document.createElement('a');
					item.href = '#';
					item.className = 'xp-task-link';
					item.innerHTML = `<img src="../assets/images/desk/icons/Earth (fixed).webp" alt=""><span>${c.name}</span>`;
					item.addEventListener('click', (e) => {
						e.preventDefault();
						selectCountry(c);
					});
					quickListContainer.appendChild(item);
				});
			};
			populateQuickIndex();

			const resizeCanvas = () => {
				const parent = canvas.parentElement;
				if (!parent) return;
				const rect = parent.getBoundingClientRect();
				canvas.width = Math.max(320, Math.round(rect.width));
				canvas.height = Math.max(240, Math.round(rect.height));
				renderScene();
			};

			const projectGeo = (lat, lon, w, h) => {
				if (!is3D) {
					const x = w / 2 + (lon * (w / 360)) * scale + panX;
					const y = h / 2 - (lat * (h / 180)) * scale + panY;
					return { x, y, visible: true, z: 1 };
				}

				const radius = (Math.min(w, h) * 0.40) * scale;
				const radLat = lat * Math.PI / 180;
				const radLon = (lon + rotY) * Math.PI / 180;
				const tilt = rotX * Math.PI / 180;

				const cosLat = Math.cos(radLat);
				const sinLat = Math.sin(radLat);
				const cosLon = Math.cos(radLon);
				const sinLon = Math.sin(radLon);
				const cosTilt = Math.cos(tilt);
				const sinTilt = Math.sin(tilt);

				const x3d = cosLat * sinLon;
				const y3d = sinLat * cosTilt - cosLat * cosLon * sinTilt;
				const z3d = sinLat * sinTilt + cosLat * cosLon * cosTilt;

				const x = w / 2 + x3d * radius + panX;
				const y = h / 2 - y3d * radius + panY;

				return { x, y, visible: z3d > 0.05, z: z3d };
			};

			const unprojectScreen = (x, y, w, h) => {
				if (!is3D) {
					const lon = ((x - w / 2 - panX) / scale) / (w / 360);
					const lat = -((y - h / 2 - panY) / scale) / (h / 180);
					return { lat: Math.max(-85, Math.min(85, lat)), lon: Math.max(-180, Math.min(180, lon)) };
				}
				const radius = (Math.min(w, h) * 0.40) * scale;
				const dx = (x - w / 2 - panX) / radius;
				const dy = -(y - h / 2 - panY) / radius;
				const distSq = dx * dx + dy * dy;
				if (distSq > 1.0) return null;
				const dz = Math.sqrt(Math.max(0, 1.0 - distSq));

				const tilt = rotX * Math.PI / 180;
				const cosTilt = Math.cos(tilt);
				const sinTilt = Math.sin(tilt);

				const sinLat = dy * cosTilt + dz * sinTilt;
				const lat = Math.asin(Math.max(-1, Math.min(1, sinLat))) * 180 / Math.PI;

				const cosLat = Math.cos(lat * Math.PI / 180);
				const yRotated = -dy * sinTilt + dz * cosTilt;
				const radLon = Math.atan2(dx, yRotated);
				let lon = radLon * 180 / Math.PI - rotY;
				while (lon < -180) lon += 360;
				while (lon > 180) lon -= 360;

				return { lat, lon };
			};

			const renderFlagCanvas = (flagColors) => {
				const fCanvas = document.createElement('canvas');
				fCanvas.width = 36;
				fCanvas.height = 24;
				const fCtx = fCanvas.getContext('2d');

				if (flagColors && flagColors.length >= 2) {
					const stripeWidth = fCanvas.width / flagColors.length;
					flagColors.forEach((col, idx) => {
						fCtx.fillStyle = col;
						fCtx.fillRect(idx * stripeWidth, 0, stripeWidth + 1, fCanvas.height);
					});
				} else {
					fCtx.fillStyle = '#0055ea';
					fCtx.fillRect(0, 0, fCanvas.width, fCanvas.height);
				}
				fCtx.strokeStyle = '#000000';
				fCtx.strokeRect(0, 0, fCanvas.width, fCanvas.height);
				return fCanvas.toDataURL();
			};

			const selectCountry = (c) => {
				selectedCountry = c;

				if (is3D) {
					rotY = -c.lon;
					rotX = Math.max(-60, Math.min(60, c.lat * 0.7));
				} else {
					panX = -(c.lon * (canvas.width / 360)) * scale;
					panY = (c.lat * (canvas.height / 180)) * scale;
				}

				const flagDataUri = renderFlagCanvas(c.flagColors);
				if (sbSelectedInfo) sbSelectedInfo.textContent = `Selected: ${c.name} — Capital: ${c.capital}`;

				let landmarksListHtml = '';
				if (c.landmarks && c.landmarks.length > 0) {
					landmarksListHtml = `
						<div style="margin-top: 8px; border-top: 1px dashed var(--xp-border-light); padding-top: 6px;">
							<strong>Notable Wonders & Sights:</strong>
							<ul style="margin: 4px 0 0 16px; padding: 0;">
								${c.landmarks.map(lm => `<li><b>${lm.name}</b>: ${lm.desc}</li>`).join('')}
							</ul>
						</div>
					`;
				}

				profileContainer.innerHTML = `
					<div style="display: flex; gap: 8px; align-items: center; border-bottom: 1px solid var(--xp-border-light); padding-bottom: 6px;">
						<img src="${flagDataUri}" style="box-shadow: 1px 1px 3px rgba(0,0,0,0.3); flex-shrink: 0;" alt="${c.name}">
						<div>
							<h3 style="margin: 0; font-size: 13px; color: var(--xp-groupbox-legend-color);">${c.name}</h3>
							<span style="font-size: 10px; color: var(--xp-main-text); opacity: 0.85;">${c.official}</span>
						</div>
					</div>

					<div class="xp-info-grid" style="grid-template-columns: 95px 1fr; gap: 3px; font-size: 11px; margin-top: 6px;">
						<div>Capital City:</div><div><strong>${c.capital}</strong></div>
						<div>Continent:</div><div>${c.continent} (${c.region})</div>
						<div>Population:</div><div><strong>${c.population.toLocaleString()}</strong></div>
						<div>Surface Area:</div><div>${c.area.toLocaleString()} km²</div>
						<div>Highest Elevation:</div><div>${c.highestPoint}</div>
						<div>National Currency:</div><div>${c.currency}</div>
						<div>Official Language:</div><div>${c.languages.join(', ')}</div>
						<div>Time Zone:</div><div>${c.tz}</div>
						<div>Dialing Code:</div><div>${c.callingCode}</div>
					</div>

					<div style="margin-top: 8px; font-size: 11px; line-height: 1.45; background: var(--xp-main-bg); color: var(--xp-main-text); padding: 6px; border: 1px inset #ffffff;">
						<strong>Physical Geography & Overview:</strong><br>
						${c.overview}<br><br>
						${c.geography}
					</div>

					${landmarksListHtml}
				`;

				renderScene();
			};

			const renderScene = () => {
				const ctx = canvas.getContext('2d');
				const w = canvas.width;
				const h = canvas.height;

				ctx.imageSmoothingEnabled = !isDithered;

				ctx.fillStyle = is3D ? '#030f24' : '#081a38';
				ctx.fillRect(0, 0, w, h);

				if (is3D) {
					const radius = (Math.min(w, h) * 0.40) * scale;
					const cx = w / 2 + panX;
					const cy = h / 2 + panY;

					const oceanGradient = ctx.createRadialGradient(cx - radius * 0.35, cy - radius * 0.35, radius * 0.05, cx, cy, radius);
					oceanGradient.addColorStop(0, '#246cdb');
					oceanGradient.addColorStop(0.65, '#0e3a7a');
					oceanGradient.addColorStop(1, '#03142e');

					ctx.beginPath();
					ctx.arc(cx, cy, radius, 0, Math.PI * 2);
					ctx.fillStyle = oceanGradient;
					ctx.fill();

					ctx.strokeStyle = '#3988ff';
					ctx.lineWidth = 1.5;
					ctx.stroke();

					ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
					ctx.lineWidth = 1;
					for (let lat = -80; lat <= 80; lat += 20) {
						ctx.beginPath();
						let first = true;
						for (let lon = -180; lon <= 180; lon += 4) {
							const pt = projectGeo(lat, lon, w, h);
							if (pt.visible) {
								if (first) { ctx.moveTo(pt.x, pt.y); first = false; }
								else ctx.lineTo(pt.x, pt.y);
							} else {
								first = true;
							}
						}
						ctx.stroke();
					}
					for (let lon = -180; lon <= 180; lon += 30) {
						ctx.beginPath();
						let first = true;
						for (let lat = -90; lat <= 90; lat += 3) {
							const pt = projectGeo(lat, lon, w, h);
							if (pt.visible) {
								if (first) { ctx.moveTo(pt.x, pt.y); first = false; }
								else ctx.lineTo(pt.x, pt.y);
							} else {
								first = true;
							}
						}
						ctx.stroke();
					}
				} else {
					ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
					ctx.lineWidth = 1;
					ctx.beginPath();
					for (let x = 0; x <= w; x += 36) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); }
					for (let y = 0; y <= h; y += 36) { ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); }
					ctx.stroke();
				}

				WORLD_DATABASE.forEach(c => {
					const pt = projectGeo(c.lat, c.lon, w, h);
					if (pt.visible) {
						const isSelected = selectedCountry && selectedCountry.id === c.id;
						const isQuizTarget = quizActive && quizCurrentTarget && quizCurrentTarget.id === c.id;

						ctx.beginPath();
						const markerR = isSelected ? 7 : (isQuizTarget ? 6 : 4.5);
						ctx.arc(pt.x, pt.y, markerR, 0, Math.PI * 2);

						if (isSelected) {
							ctx.fillStyle = '#ffe600';
							ctx.shadowColor = '#ffea00';
							ctx.shadowBlur = 8;
						} else {
							ctx.fillStyle = '#ffffff';
							ctx.shadowColor = '#000000';
							ctx.shadowBlur = 3;
						}
						ctx.fill();
						ctx.shadowBlur = 0;

						ctx.strokeStyle = '#000000';
						ctx.lineWidth = 1.2;
						ctx.stroke();

						ctx.font = isSelected ? 'bold 11px Tahoma' : '10px Tahoma';
						ctx.fillStyle = isSelected ? '#fff566' : '#ffffff';
						ctx.shadowColor = '#000000';
						ctx.shadowBlur = 4;
						ctx.fillText(`${c.name} (${c.capital})`, pt.x + 8, pt.y + 3);
						ctx.shadowBlur = 0;
					}
				});

				if (measuredPoints.length === 2) {
					const p1 = projectGeo(measuredPoints[0].lat, measuredPoints[0].lon, w, h);
					const p2 = projectGeo(measuredPoints[1].lat, measuredPoints[1].lon, w, h);

					ctx.strokeStyle = '#ff3333';
					ctx.lineWidth = 2;
					ctx.setLineDash([4, 3]);
					ctx.beginPath();
					let drawn = false;

					for (let t = 0; t <= 1.0; t += 0.02) {
						const curLat = measuredPoints[0].lat + (measuredPoints[1].lat - measuredPoints[0].lat) * t;
						const curLon = measuredPoints[0].lon + (measuredPoints[1].lon - measuredPoints[0].lon) * t;
						const curPt = projectGeo(curLat, curLon, w, h);
						if (curPt.visible) {
							if (!drawn) { ctx.moveTo(curPt.x, curPt.y); drawn = true; }
							else ctx.lineTo(curPt.x, curPt.y);
						} else {
							drawn = false;
						}
					}
					ctx.stroke();
					ctx.setLineDash([]);
				}
			};

			const handleMapClick = (e) => {
				const rect = canvas.getBoundingClientRect();
				const clickX = e.clientX - rect.left;
				const clickY = e.clientY - rect.top;

				let hitCountry = null;
				WORLD_DATABASE.forEach(c => {
					const pt = projectGeo(c.lat, c.lon, canvas.width, canvas.height);
					if (pt.visible) {
						const dist = Math.hypot(pt.x - clickX, pt.y - clickY);
						if (dist <= 14) hitCountry = c;
					}
				});

				if (quizActive && quizCurrentTarget) {
					if (hitCountry && hitCountry.id === quizCurrentTarget.id) {
						quizScore++;
						if (window.SettingsApp && window.SettingsApp.playSound) window.SettingsApp.playSound('asterisk');
						quizPromptText.innerHTML = `<span style="color:#2e7d32; font-weight:bold;">Correct!</span> That is ${quizCurrentTarget.name}.`;
						selectCountry(hitCountry);
					} else {
						if (window.SettingsApp && window.SettingsApp.playSound) window.SettingsApp.playSound('error');
						quizPromptText.innerHTML = `<span style="color:#cc2222; font-weight:bold;">Incorrect.</span> You clicked ${hitCountry ? hitCountry.name : 'an empty area'}. Expected: ${quizCurrentTarget.name}.`;
					}
					quizTotal++;
					quizScoreBadge.textContent = `Score: ${quizScore} / ${quizTotal}`;
					setTimeout(nextQuizQuestion, 1800);
					return;
				}

				if (hitCountry) {
					selectCountry(hitCountry);
					measuredPoints.push(hitCountry);
					if (measuredPoints.length > 2) measuredPoints = [hitCountry];
					if (measuredPoints.length === 2) {
						const d = computeDistanceKm(
							measuredPoints[0].lat, measuredPoints[0].lon,
							measuredPoints[1].lat, measuredPoints[1].lon
						);
						const miles = Math.round(d * 0.621371);
						const nm = Math.round(d * 0.539957);
						flightDistDisplay.innerHTML = `<strong>${d.toLocaleString()} km</strong><br><span style="font-size:10px; color:#555;">${miles.toLocaleString()} mi | ${nm.toLocaleString()} NM</span>`;
					}
				}
			};

			const nextQuizQuestion = () => {
				if (!quizActive) return;
				const pool = WORLD_DATABASE;
				quizCurrentTarget = pool[Math.floor(Math.random() * pool.length)];
				quizPromptText.textContent = `Find and click on: ${quizCurrentTarget.name} (Capital: ${quizCurrentTarget.capital})`;
				renderScene();
			};

			canvas.addEventListener('mousedown', (e) => {
				isDragging = true;
				dragStartX = e.clientX;
				dragStartY = e.clientY;
			});

			window.addEventListener('mousemove', (e) => {
				if (!isDragging) return;
				const dx = e.clientX - dragStartX;
				const dy = e.clientY - dragStartY;

				if (is3D) {
					rotY += dx * 0.45;
					rotX = Math.max(-80, Math.min(80, rotX - dy * 0.45));
				} else {
					panX += dx;
					panY += dy;
				}

				dragStartX = e.clientX;
				dragStartY = e.clientY;
				renderScene();
			});

			window.addEventListener('mouseup', () => {
				isDragging = false;
			});

			canvas.addEventListener('wheel', (e) => {
				e.preventDefault();
				if (e.deltaY < 0) {
					scale = Math.min(4.0, scale * 1.15);
				} else {
					scale = Math.max(0.4, scale / 1.15);
				}
				renderScene();
			});

			canvas.addEventListener('click', handleMapClick);

			canvas.addEventListener('mousemove', (e) => {
				const rect = canvas.getBoundingClientRect();
				const coords = unprojectScreen(e.clientX - rect.left, e.clientY - rect.top, canvas.width, canvas.height);
				if (coords) {
					const latStr = `${Math.abs(coords.lat).toFixed(2)}° ${coords.lat >= 0 ? 'N' : 'S'}`;
					const lonStr = `${Math.abs(coords.lon).toFixed(2)}° ${coords.lon >= 0 ? 'E' : 'W'}`;
					hudTelemetry.textContent = `${latStr}, ${lonStr} | Scale: 1:${Math.round(100000000 / scale).toLocaleString()}`;
				}
			});

			zoomInBtn.addEventListener('click', () => { scale = Math.min(4.0, scale * 1.25); renderScene(); });
			zoomOutBtn.addEventListener('click', () => { scale = Math.max(0.4, scale / 1.25); renderScene(); });
			resetBtn.addEventListener('click', () => {
				scale = 1.0;
				panX = 0;
				panY = 0;
				rotX = 15;
				rotY = 0;
				renderScene();
			});

			globeProjBtn.addEventListener('click', () => {
				is3D = true;
				globeProjBtn.classList.add('active');
				flatProjBtn.classList.remove('active');
				if (sbProjectionMode) sbProjectionMode.textContent = 'Orthographic 3D Globe';
				renderScene();
			});

			flatProjBtn.addEventListener('click', () => {
				is3D = false;
				flatProjBtn.classList.add('active');
				globeProjBtn.classList.remove('active');
				if (sbProjectionMode) sbProjectionMode.textContent = 'Equirectangular Flat Map';
				renderScene();
			});

			ditherBtn.addEventListener('click', () => {
				isDithered = !isDithered;
				ditherBtn.classList.toggle('active', isDithered);
				canvas.classList.toggle('pixel-dither-mode', isDithered);
				renderScene();
			});

			quizBtn.addEventListener('click', () => {
				quizActive = !quizActive;
				quizBtn.classList.toggle('active', quizActive);
				quizPanel.style.display = quizActive ? 'flex' : 'none';
				if (quizActive) {
					quizScore = 0;
					quizTotal = 0;
					quizScoreBadge.textContent = 'Score: 0 / 0';
					nextQuizQuestion();
				}
			});

			if (quizExitBtn) {
				quizExitBtn.addEventListener('click', () => {
					quizActive = false;
					quizBtn.classList.remove('active');
					quizPanel.style.display = 'none';
					renderScene();
				});
			}

			if (statsBtn) {
				statsBtn.addEventListener('click', () => {
					this.openWorldStatisticsDialog();
				});
			}

			if (clearDistBtn) {
				clearDistBtn.addEventListener('click', () => {
					measuredPoints = [];
					flightDistDisplay.textContent = 'Distance: -- km';
					renderScene();
				});
			}

			if (layerSelect) {
				layerSelect.addEventListener('change', () => {
					activeTileLayer = layerSelect.value;
					renderScene();
				});
			}

			searchInput.addEventListener('input', () => {
				const q = searchInput.value.toLowerCase().trim();
				if (!q) return;
				const hit = WORLD_DATABASE.find(c => c.name.toLowerCase().includes(q) || c.capital.toLowerCase().includes(q));
				if (hit) {
					selectCountry(hit);
				}
			});

			win.querySelectorAll('.xp-task-header').forEach(header => {
				header.addEventListener('click', () => {
					const box = header.closest('.xp-task-box');
					if (box) box.classList.toggle('collapsed');
				});
			});

			setTimeout(() => {
				resizeCanvas();
				selectCountry(WORLD_DATABASE[0]);
			}, 100);
			win.addEventListener('resize', resizeCanvas);
		},

		openWorldStatisticsDialog() {
			const sortedByPop = [...WORLD_DATABASE].sort((a, b) => b.population - a.population);
			let rowsHtml = '';
			sortedByPop.forEach((c, idx) => {
				rowsHtml += `
					<div class="xp-tm-row" style="grid-template-columns: 32px 140px 100px 100px 1fr; font-size: 11px;">
						<div>${idx + 1}</div>
						<div><strong>${c.name}</strong></div>
						<div>${c.population.toLocaleString()}</div>
						<div>${c.area.toLocaleString()} km²</div>
						<div>${c.capital}</div>
					</div>
				`;
			});

			const content = `
				<div style="padding: 10px; display: flex; flex-direction: column; height: 100%; box-sizing: border-box; background: var(--xp-window-bg);">
					<div style="font-size: 11px; margin-bottom: 8px; color: var(--xp-main-text);">
						<strong>Global Nations by Population & Territory (2002 Reference Index)</strong>
					</div>
					<div class="xp-taskmgr-table-frame" style="flex: 1; overflow-y: auto;">
						<div class="xp-taskmgr-list-header" style="grid-template-columns: 32px 140px 100px 100px 1fr; font-size: 11px;">
							<div class="tm-th">#</div>
							<div class="tm-th">Country</div>
							<div class="tm-th">Population</div>
							<div class="tm-th">Area</div>
							<div class="tm-th">Capital</div>
						</div>
						<div class="xp-taskmgr-list-body">${rowsHtml}</div>
					</div>
				</div>
			`;

			createXPWindow('window-encarta-stats', 'World Atlas Statistical Almanac', content, 580, 420, {
				iconSrc: '../assets/images/desk/icons/List File.webp',
				resizable: true
			});
		}
	};

	window.EncartaGlobeApp = EncartaGlobeApp;
	window.openEncartaGlobe = () => EncartaGlobeApp.open();
})();
