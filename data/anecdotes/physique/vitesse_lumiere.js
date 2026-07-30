import { formatNumber } from '/js/anecdotes/format.js';

export default {
	id: 'anecdote_vitesse_lumiere',
	enabled: true,
	priority: 5,
	addedDate: '2026-07-30',
	domain: { fr: 'Physique — Relativité', en: 'Physics — Relativity' },
	scheduling: { type: 'anytime', dates: [] },
	content: (lang) => {
		const value = formatNumber(299792458, lang);
		return lang === 'fr'
			? `La vitesse de la lumière dans le vide vaut exactement ${value} mètres par seconde depuis la redéfinition du mètre en 1983.`
			: `The speed of light in vacuum has been exactly ${value} metres per second since the 1983 redefinition of the metre.`;
	},
	sources: [
		{
			name: { fr: 'Bureau International des Poids et Mesures', en: 'International Bureau of Weights and Measures' },
			url: 'https://www.bipm.org/en/publications/si-brochure'
		}
	],
	contexts: [
		{
			title: { fr: 'Pourquoi une valeur exacte ?', en: 'Why an exact value?' },
			body: {
				fr: `Depuis 1983, le mètre n'est plus défini par un artefact physique mais par la vitesse de la lumière elle-même.\n\nCette approche fixe $c$ par convention et définit le mètre comme la distance parcourue par la lumière dans le vide pendant $\\frac{1}{299\\,792\\,458}$ seconde.`,
				en: `Since 1983, the metre has no longer been defined by a physical artefact but by the speed of light itself.\n\nThis approach fixes $c$ by convention and defines the metre as the distance travelled by light in vacuum during $\\frac{1}{299,792,458}$ of a second.`
			},
			external: false
		}
	]
};
