export default [
	{
		id: 'anecdote_vitesse_lumiere',
		priority: 5,
		enabled: true,
		addedDate: '2026-07-30',
		scheduling: { type: 'anytime', dates: [] },
		path: '/data/anecdotes/physique/vitesse_lumiere.js'
	},
	{
		id: 'anecdote_naissance_marie_curie',
		priority: 3,
		enabled: true,
		addedDate: '2026-07-30',
		scheduling: { type: 'annual', dates: ['11-07'] },
		path: '/data/anecdotes/histoire_sciences/naissance_marie_curie.js'
	},
	{
		id: 'anecdote_annee_bissextile',
		priority: 1,
		enabled: true,
		addedDate: '2026-07-30',
		scheduling: { type: 'annual', dates: ['02-29'] },
		path: '/data/anecdotes/mathematiques/annee_bissextile.js'
	}
];
