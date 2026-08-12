export default {
	id: 'anecdote_von_neumann_architecture',
	enabled: true,
	priority: 4,
	addedDate: '2026-08-11',
	domain: { fr: 'Histoire des Sciences / Informatique', en: 'History of Science / Computer Science' },
	scheduling: { type: 'anytime', dates: [] },
	content: {
		fr: `En 1945, dans un rapport préliminaire décrivant le calculateur EDVAC, le mathématicien John von Neumann formalise une architecture où les instructions du programme et les données qu'il manipule résident dans la même mémoire, sous la même forme binaire. Cette idée simple, révolutionnaire pour l'époque où les machines devaient être physiquement recâblées pour chaque nouveau calcul, reste aujourd'hui l'architecture de base de la quasi-totalité des ordinateurs.`,
		en: `In 1945, in a preliminary report describing the EDVAC computer, mathematician John von Neumann formalized an architecture in which a program's instructions and the data it manipulates reside in the same memory, in the same binary form. This simple idea, revolutionary at a time when machines had to be physically rewired for each new calculation, remains today the fundamental architecture of nearly every computer.`
	},
	sources: [
		{
			name: { fr: 'First Draft of a Report on the EDVAC (J. von Neumann, 1945)', en: 'First Draft of a Report on the EDVAC (J. von Neumann, 1945)' },
			url: 'https://web.mit.edu/STS.035/www/PDFs/edvac.pdf'
		}
	],
	contexts: [
		{
			title: { fr: 'Programme enregistré et le goulot d\'étranglement de von Neumann', en: 'Stored programs and the von Neumann bottleneck' },
			body: {
				fr: `L'architecture décrit une unité centrale de traitement (composée d'une unité arithmétique et d'une unité de contrôle), une mémoire unique partagée entre instructions et données, ainsi que des dispositifs d'entrée-sortie. Cette unification simplifie radicalement la conception matérielle et permet à un programme de se modifier lui-même. Sa principale limite structurelle, connue sous le nom de « goulot d'étranglement de von Neumann », vient du fait que le processeur et la mémoire communiquent via un unique bus, dont le débit borne la vitesse effective de calcul, un défi encore central dans la conception des microprocesseurs modernes.`,
				en: `The architecture describes a central processing unit (comprising an arithmetic unit and a control unit), a single memory shared between instructions and data, and input-output devices. This unification radically simplifies hardware design and allows a program to modify itself. Its main structural limitation, known as the "von Neumann bottleneck", arises because the processor and memory communicate through a single bus, whose throughput bounds effective computation speed, a challenge still central to modern microprocessor design.`
			},
			external: false
		}
	]
};
