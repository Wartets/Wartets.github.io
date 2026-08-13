# Architecture d'ajout d'une section d'anecdotes dans le portfolio

Je veux ajouter à mon portefolio à la fin de celui-ci une section dédiée à des anecdotes, fun fact, éléments liés aux projets que je fais de façon journalière, donc chaque jour une anecdote associée à des informations supplémentaires en tout genre.

## Format de stockage et de gestion des anecdotes

L'objectif est d'avoir un stockage intelligent, lisible, multi-fichiers, extrêmement bien ordonné et capable de gérer de longs textes (Markdown, LaTeX) ainsi que des variables dynamiques. Le JSON et le YAML sont inadaptés (illisibles avec les retours à la ligne, conflits d'échappement de caractères, impossibilité d'avoir des fonctions).

*   **Format retenu :** Modules JavaScript natifs (ES6 Modules) sous forme de fichiers `.js` purs.
*   **Architecture de fichiers :** 
    *   Un fichier par anecdote (ex: `marie_curie.js`, `vitesse_pere_noel.js`).
    *   Les fichiers sont classés dans des sous-dossiers par thématique/domaine (ex: `/data/anecdotes/physique_quantique/`, `/data/anecdotes/histoire_sciences/`).
    *   Un fichier index central (ex: `registry.js`) qui répertorie uniquement les chemins et métadonnées de base (identifiants, dates) pour éviter de tout charger.
*   **Structure détaillée de l'objet exporté par fichier :**
    *   `id` : Identifiant unique en snake_case (ex: `anecdote_vitesse_pere_noel`). Utilisé pour le suivi et comme critère de départage déterministe en cas de conflit.
    *   `domain` : Catégorie de l'anecdote (ex: Thermodynamique, Mathématiques Pures).
    *   `scheduling` : Objet définissant les règles temporelles d'apparition.
        *   `type` : Prend les valeurs `anytime` (vivier général), `annual` (tous les ans à la même date), `specific_date` (un jour précis d'une année précise) ou `period` (une plage de dates).
        *   `dates` : Tableau de valeurs associées (ex: `["12-25"]` ou `["2024-02-29"]` ou `["12-20", "12-26"]`).
    *   `content` : Le texte de l'anecdote. Utilisation des *Template Literals* (backticks `` ` ``) pour permettre des retours à la ligne natifs. Permet également d'être une fonction retournant une chaîne, recevant des paramètres (comme la date du jour) pour insérer des variables dynamiques (ex: calcul de l'âge d'une découverte `(currentYear) => currentYear - 1867`).
    *   `sources` : Tableau d'objets (détails dans la section correspondante).
    *   `contexts` : Tableau d'objets (détails dans la section correspondante).
*   **Structure détaillée du Registre Central (`registry.js`) :**
    *   Puisque le site est strictement statique sans étape de compilation (build), ce fichier est le seul point d'entrée pour l'algorithme. Il doit être un tableau d'objets allégés ne contenant que les métadonnées nécessaires au calcul temporel et au routage, sans le contenu lourd.
    *   Format requis : `[{ id: "anecdote_vitesse_pere_noel", domain: "Physique", priority: 2, scheduling: { type: "annual", dates: ["12-25"] }, path: "./anecdotes/physique/vitesse_pere_noel.js" }]`.
*   **Activation/désactivation d'anecdotes :**
    *   Chaque anecdote peut être activée ou désactivée via un booléen `enabled` dans le fichier de l'anecdote. Si `enabled: false`, l'anecdote est ignorée par l'algorithme de sélection.
*   **Signature de la fonction dynamique (`content`) :**
    *   Pour que les variables temporelles et la traduction fonctionnent simultanément dans les fichiers `.js`, la valeur dynamique ne doit pas être une simple chaîne de caractères, mais une fonction prenant des paramètres d'état.
    *   Signature requise : `(lang, currentYear, todayDateObj) => string`. 
    *   *Exemple d'implémentation dans le fichier :* `content: (lang, year) => lang === 'fr' ? \`Marie Curie aurait eu \${year - 1867} ans.\` : \`Marie Curie would be \${year - 1867} years old.\``
*   **Hiérarchie et attribut `priority` :**
    *   Ajout d'un entier `priority` (ex: de 1 à 10, 1 étant le plus prioritaire) au même niveau que `id`. Il servira de premier critère de départage avant le choix aléatoire déterministe lors d'un conflit de dates (deux événements `annual` le même jour). EN cas de valeur égale ont détermine le choix de façon aléatoire.
*   **Gestion du chargement asynchrone et de ses échecs (Erreurs réseau) :**
    *   L'utilisation de `import('./anecdotes/....js')` retourne une Promesse (`Promise`). Il est impératif d'implémenter un bloc `.catch()` pour gérer les micro-coupures réseau.
    *   En cas d'échec de l'import, le script tentera un maximum de 3 essais (retry pattern) avec un délai exponentiel (ex: 500ms, 1s, 2s). Si l'échec persiste, un objet `fallback` générique et traduit ("Anecdote indisponible pour le moment") sera injecté pour éviter de casser l'interface (Single Page Application statique).
*   **Format strict des dates dans les données :**
    *   Les dates définies dans `dates` pour les types `specific_date`, `annual`, ou `period` doivent strictement utiliser la norme ISO 8601 partielle : `MM-DD` pour l'annuel, `YYYY-MM-DD` pour le spécifique. L'utilisation d'un format de type chaîne (string) évite les comportements imprévisibles de l'objet `Date` natif en JavaScript liés aux fuseaux horaires locaux lors de la lecture du fichier.
*   **Gestion dynamique des pluriels et des règles typographiques (dans la signature de la fonction `content`) :**
    *   La fonction dynamique devra intégrer `Intl.PluralRules` pour une gestion propre des pluriels ("1 an" vs "2 ans" ou "1st" vs "2nd" en anglais).
    *   Les espaces insécables (`&nbsp;` ou le caractère Unicode `\u00A0`) requis par la typographie française (avant `?`, `!`, `:`, `;`) devront être gérés directement dans le gabarit de chaîne (Template Literal) pour éviter les sauts de ligne orphelins sur mobile.
*   **Résolution des chemins des médias (Images/GIFs) statiques :**
    *   Dans un environnement purement statique sans "bundler" (comme Webpack ou Vite), les chemins relatifs écrits dans les fichiers `.js` ou Markdown sont calculés par rapport à l'URL de la page HTML exécutant le script, et non par rapport à l'emplacement du fichier `.js`.
    *   Il faut imposer une nomenclature de chemins absolus à la racine pour tous les médias liés aux anecdotes : `/assets/anecdotes/nom_anecdote/image.png`.
*   **Séparation des modes LaTeX (Inline vs Display) :**
    *   Le parseur Markdown devra reconnaître deux syntaxes distinctes pour KaTeX : `\\( ... \\)` (ou `$ ... $`) pour les équations en ligne (s'intégrant dans le texte) et `\\[ ... \\]` (ou `$$ ... $$`) pour les équations en bloc (centrées, avec un espacement vertical).

## Contenu des anectodes

Le ton doit rester très professionnel, adapté à un profil avancé en physique, mathématiques et numérique. 

*   **Règles strictes :** Aucune utilisation d'émojis, aucun tags apparents, aucun easter-egg, aucune fonction d'archive.
*   **Indicateur de domaine (UI subtile) :** Exploitation de la métadonnée `domain` affichée de manière discrète (ex: petite taille, police monospace, couleur gris clair) juste au-dessus du texte de l'anecdote pour contextualiser le sujet de l'information.
*   **Variables contextuelles :** Le format de données permet au texte de s'adapter au jour de consultation (ex: "Marie Curie aurait eu {calcul de l'âge} aujourd'hui", et même par exemple en hover ça ajoute un tips qui donne l'age à la seconde près).
*   **Localisation native des variables temporelles (Intl API) :**
    *   Si la date du jour ou une date d'événement est injectée dynamiquement dans l'anecdote (ex: "Aujourd'hui, le 15 mars..."), elle ne doit pas être codée en dur. L'API JavaScript native `Intl.DateTimeFormat` sera appelée au sein de la fonction `content` pour formater la date selon la langue active (ex: `en-US` -> "March 15", `fr-FR` -> "15 mars").
*   **Prévention du Cumulative Layout Shift (CLS) :**
    *   Pour éviter un "saut" désagréable de la page lors du chargement de l'anecdote du jour (particulièrement si l'import dynamique prend quelques millisecondes), un "Skeleton Loader" (zone grisée clignotante de la taille moyenne d'une anecdote) ou une hauteur minimale fixe (`min-height`) sera appliqué à la balise conteneur de l'anecdote en CSS.

## Sources et contextes

La présence de sources ou de contextes est optionnelle et combinable (une anecdote peut n'avoir ni l'un ni l'autre, ou plusieurs des deux).

*   **Structure des Sources :**
    *   Tableau d'objets : `[{ name: { fr: "...", en: "..." }, url: "..." }]`.
    *   Comportement : Un simple lien s'ouvrant dans un nouvel onglet.
    *   UI : Au survol (hover), apparition d'une petite icône "lien externe".
*   **Structure des Contextes :**
    *   Tableau d'objets : `[{ title: { fr: "...", en: "..." }, body: { fr: "...", en: "..." } }]`.
    *   Contenu du `body` : Écrit en Markdown pur, supporte les paragraphes, retours à la ligne, images, GIFs, et équations mathématiques en LaTeX via KaTeX/MathJax.
    *   Comportement : S'ouvre dans une petite fenêtre (modale) qui s'affiche au-dessus de la zone de l'anecdote lors du clic ou du survol. Clique en dehors de la zone refermera le modal mais il faudra également emttre un petite croix pour fermer la modale.
    *   Exception de longueur : Si un contexte devient trop long ou nécessite un développement massif, il sera traité comme une page internet extérieure à part entière et ajouté en tant que "Source" classique plutôt que de surcharger la modale. Il doit donc y avoir un gestion de génération de fihcier html pour ces contextes longs, avec un style graphique identique au reste du site.
*   **Gestion de l'injection LaTeX (Optimisation des performances) :**
    *   Pour ne pas alourdir inutilement le DOM, les scripts lourds de rendu mathématique (KaTeX) ne doivent pas être chargés sur chaque page du portfolio.
    *   Le script client doit vérifier la présence de délimiteurs LaTeX (ex: `$$`, `\\[`, ou `\\(`) dans le texte du `body` du contexte via une expression régulière (Regex) lors de l'import dynamique. Si la Regex est validée, le script injecte dynamiquement les balises `<link>` (CSS) et `<script>` (JS) de KaTeX dans le `<head>`.
*   **Architecture des contextes longs (Pages externes HTML) :**
    *   Les contextes excédant une certaine longueur (à définir, ex: > 500 mots) nécessitent la création de fichiers distincts.
    *   Stockage : Création d'un dossier `/pages_contextes/` contenant des fichiers HTML statiques (ex: `contexte_lagrangien_fr.html`, `contexte_lagrangien_en.html`).
    *   Ces pages devront importer la même feuille de style CSS globale (navbar, footer, polices) que le portfolio pour maintenir une cohérence visuelle stricte.
*   **Déclaration globale des macros LaTeX :**
    *   Pour éviter de réécrire des commandes récurrentes complexes (ex: le formalisme de Dirac `\ket{\psi}` ou des opérateurs différentiels partiels), l'initialisation de KaTeX dans le script principal passera un objet `macros` global. Toutes les équations des contextes bénéficieront de ces alias définis une seule fois.
*   **Accessibilité avancée (Liaison ARIA des Modales) :**
    *   S'il y a "Contexte 1" et "Contexte 2", la balise HTML déclenchant le contexte 1 possédera l'attribut `aria-controls="modal-context-1"` et `aria-expanded="false"`. Lors du clic, ce dernier passera à `true` et le focus sera transféré au premier élément lisible de la modale.
*   **Sécurité anti-XSS des contextes Markdown :**
    *   Même si les données sont statiques et internes, une bibliothèque de rendu Markdown légère (comme *Marked.js*) couplée obligatoirement à *DOMPurify* sera utilisée avant l'injection dans le `innerHTML` de la modale. DOMPurify sera configuré avec une liste blanche stricte autorisant les classes générées par KaTeX (ex: `katex`, `katex-mathml`, etc.), sinon les mathématiques seront effacées par la purge de sécurité.
*   **Prévention des conflits de parsing (Markdown vs LaTeX) :**
    *   Les parseurs Markdown standards (comme Marked.js) interprètent les underscores (`_`) et les astérisques (`*`) comme du formatage italique/gras. Cela détruit les équations LaTeX (ex: `H_2O` ou `A^*`).
    *   *Solution architecturale :* Avant de passer le texte au parseur Markdown, un script de pré-traitement doit extraire toutes les chaînes comprises entre les délimiteurs mathématiques, les remplacer par des jetons (tokens) temporaires alphanumériques uniques (ex: `@@MATH_TOKEN_1@@`), exécuter la conversion Markdown, puis réinjecter les équations brutes à la place des jetons avant d'appeler le rendu KaTeX.
*   **Intégration transparente des contextes longs (Fichiers HTML externes) :**
    *   Pour éviter que l'utilisateur ne quitte le portfolio en cliquant sur un contexte long (ce qui brise l'expérience utilisateur), ces fichiers statiques (`/pages_contextes/fichier.html`) ne doivent pas s'ouvrir comme de simples liens.
    *   *Comportement requis :* Le script client utilisera l'API `fetch()` pour récupérer le contenu de la balise `<main>` du fichier HTML distant et l'injectera dynamiquement dans la modale existante (méthodologie AJAX/SPA).
*   **Protection du style (CSS Scoping) de la modale :**
    *   Le HTML généré par le Markdown ne doit pas altérer le reste du portfolio (ex: si le Markdown génère une balise `<h1>`, elle ne doit pas prendre les propriétés du `<h1>` du titre de votre site).
    *   Toute la zone d'injection Markdown/KaTeX doit être encapsulée dans une `div` avec une classe dédiée (ex: `.anecdote-markdown-body`), et le CSS associé utilisera des sélecteurs descendants stricts (ex: `.anecdote-markdown-body h1 { ... }`).

## Mise en page et affichage

L'affichage doit être irréprochable, "responsive" (adapté aux téléphones et tablettes), et s'intégrer parfaitement au style graphique et aux polices existantes du site web statique.

*   **Alignement et Typographie :** 
    *   L'anecdote est strictement alignée à gauche (`text-align: left`). L'idée de la justification a été rejetée pour des raisons d'ergonomie et de typographie professionnelle : la justification crée des espacements irréguliers très disgracieux, qui rendent mal sur les petits écrans mobiles.
*   **Disposition des Liens (Sources et Contextes) :**
    *   Positionnés sur la ligne directement après le texte de l'anecdote.
    *   Format visuel : "Source 1, Source 2, Contexte 1, Contexte 2".
    *   État visuel : Les 4 éléments (ou ceux présents) sont soulignés. Leurs actions respectives sont déclenchées au survol (hover) ou au clic.
*   **Optimisation des Fenêtres Modales (Contextes) :**
    *   Gestion du LaTeX responsive : Les équations longues (ex: Lagrangiens) risquent de casser la modale sur mobile. La zone contenant l'équation KaTeX se verra appliquer le CSS `overflow-x: auto` et `overflow-y: hidden` pour permettre à l'utilisateur de scroller l'équation horizontalement sans déformer la fenêtre principale.
    *   Verrouillage de l'arrière-plan : Lors du déclenchement et de la lecture d'un contexte, la page principale en arrière-plan sera bloquée (ajout de `overflow: hidden` sur la balise `body`) pour empêcher le site de défiler accidentellement sous le doigt de l'utilisateur.
*   **Optimisation de chargement (Lazy Loading) :** Le code client isole le choix de l'anecdote de son contenu. L'algorithme tourne sur le fichier de registre léger, puis utilise l'import dynamique de module JavaScript (`import('./anecdotes/nom_fichier.js')`) pour ne télécharger que le texte, les images et le code LaTeX spécifiques au jour J, évitant de surcharger le réseau.
*   **Accessibilité (a11y) et gestion du focus de la Modale :**
    *   La modale doit comporter l'attribut `aria-modal="true"` et `role="dialog"`.
    *   Gestion du clavier : Lors de l'ouverture, le focus JavaScript doit être forcé à l'intérieur de la modale. L'appui sur la touche `Échap` (Escape) doit impérativement déclencher la fermeture de la modale.
*   **Bouton de fermeture explicite :**
    *   En plus de la fermeture par clic à l'extérieur (sur l'overlay/backdrop), la modale doit comporter une croix fixe (ex: `&times;` ou un SVG minimaliste) dans le coin supérieur droit. Cette croix doit avoir une zone de clic (padding) d'au moins 44x44 pixels pour respecter les standards d'ergonomie mobile tactile.
*   **Correction du bug de défilement sur iOS Safari :**
    *   Le simple ajout de `overflow: hidden` sur le `body` ne suffit pas à bloquer le défilement de l'arrière-plan sur les appareils iOS. Il faudra ajouter de manière conditionnelle la propriété CSS `touch-action: none` sur le conteneur principal ou utiliser une petite fonction JavaScript bloquant l'événement `touchmove` en dehors de la modale (`e.preventDefault()`).
*   **Gestion des zones de sécurité mobile (Safe Areas) :**
    *   La modale doit intégrer les variables CSS `env(safe-area-inset-bottom)` et `env(safe-area-inset-top)` dans son `padding`. Cela garantit que le texte du contexte ou la croix de fermeture ne seront jamais masqués par l'encoche (notch) de l'écran ou la barre de navigation virtuelle d'iOS/Android.
*   **Piège du focus (Focus Trap) dans la modale :**
    *   Pour respecter strictement les normes professionnelles, un script de "Focus Trap" sera implémenté. Lorsque la modale de contexte est ouverte, l'utilisation de la touche `Tab` (navigation au clavier) devra boucler indéfiniment entre la croix de fermeture et les liens internes du contexte, sans jamais sélectionner des éléments de la page en arrière-plan.
*   **Restauration du focus (Accessibilité avancée) :**
    *   Outre le "Focus Trap" à l'intérieur de la modale, il est impératif qu'à la fermeture de celle-ci, le focus du clavier soit automatiquement redonné à l'élément (le lien "Contexte 1") qui a déclenché l'ouverture. Ne pas le faire force l'utilisateur naviguant au clavier à recommencer son parcours depuis le haut de la page.
*   **Masquage ARIA du contenu principal :**
    *   Lorsque la modale s'ouvre, la balise `<main>` (ou le conteneur principal du portfolio) doit recevoir l'attribut `aria-hidden="true"`. Cela garantit que les lecteurs d'écran (Screen Readers) ne liront pas le contenu en arrière-plan pendant que la modale est active. Cet attribut doit être retiré à la fermeture.
*   **Prévention du Flash of Unstyled Content (FOUC) mathématique :**
    *   Si le CSS de KaTeX est chargé dynamiquement uniquement lorsque des mathématiques sont détectées, il y a un risque de voir le code brut `\frac{1}{2}` pendant une fraction de seconde avant que le style ne s'applique.
    *   Le fichier CSS de KaTeX sera déclaré dans le `<head>` principal du site avec l'attribut `rel="preload" as="style"`, permettant au navigateur de le télécharger en arrière-plan dès l'ouverture du portfolio, garantissant un rendu instantané à l'ouverture de la modale.

## Logique d'ordre et de sélection d'affichage des anecdotes

Le portfolio est un site statique pur, sans serveur. Le choix se fait côté client. Il faut un système aléatoire, cyclique, ne montrant jamais deux fois la même anecdote avant la fin d'un cycle, tout en garantissant que les événements spéciaux prennent le dessus sans briser le cycle général.

*   **Étape 1 : Le filtre des événements spéciaux (Priorité)**
    *   L'algorithme vérifie s'il existe une anecdote programmée pour le jour J.
    *   Règle de hiérarchie stricte en cas de dates superposées : `specific_date` (priorité absolue) > `annual` > `period` > `anytime` (vivier général).
    *   Gestion des conflits d'égalité : Si deux anecdotes de même niveau (ex: deux `annual`) tombent le même jour, l'algorithme les départage en classant leur `id` par ordre aléatoire selon la même seed utilisée plus tard. Un système de priorité doit aussi être mis en place, donc avant de faire ce choix aléatoire certaines anecdotes seront moins prioritaires avant d'autres, il faut donc utiliser un id `priority`.
    *   Si un événement spécial est trouvé, il est affiché. Fin du script pour l'affichage.

*   **Étape 2 : Le système Cyclique et Aléatoire sans répétition (Sans perte de données)**
    *   Pour éviter que l'anecdote générale du jour ne soit "sacrifiée" et perdue parce qu'un événement spécial a pris sa place, le calcul du compteur de jours est itératif.
    *   **Le compteur (`generalDaysCounter`) :** On fixe une date de lancement (Epoch). Le script boucle de l'Epoch jusqu'à la date du jour. Pour chaque jour itéré, il vérifie si une règle spéciale s'appliquait. Si OUI, le compteur stagne. Si NON (jour normal), le compteur s'incrémente de 1. Ce calcul est $O(N)$ mais extrêmement rapide en JavaScript client (< 1 milliseconde), il faut le faire le plus optimisé possible, garantissant qu'aucune anecdote n'est sautée, le cycle est simplement mis en "pause".
    *   **Le Cycle :** On divise le `generalDaysCounter` par le nombre total d'anecdotes générales (`anytime`).
        *   Le quotient arrondi à l'entier inférieur donne le **Numéro du Cycle** (0 pour le premier tour, 1 pour le 2ème...).
        *   Le reste de la division (modulo) donne l'**Index du jour** dans le cycle en cours.
    *   **Le Mélange Déterministe :** Le "Numéro du Cycle" sert de Graine (Seed) à un algorithme de mélange (Fisher-Yates). La liste générale est mélangée de façon pseudo-aléatoire. Avec la même graine, l'ordre sera toujours strictement identique pour tout le monde durant ce cycle. À la fin du cycle complet, le Numéro change, la graine change, et un tout nouvel ordre aléatoire est généré.
    *   **La Sélection :** On affiche l'anecdote située à l'emplacement correspondant à "l'Index du jour" dans ce nouveau tableau mélangé.

*   **Le Générateur de Nombres Pseudo-Aléatoires (PRNG) :**
    *   La fonction native `Math.random()` du JavaScript ne peut pas prendre de Graine (Seed). Elle est inutilisable pour un système déterministe.
    *   Il faut implémenter une fonction mathématique PRNG légère et performante, telle que **Mulberry32** ou un Générateur Congruentiel Linéaire (LCG). 
    *   *Exemple d'utilisation :* `const random = mulberry32(seed)` générera une suite de nombres strictement identique à chaque appel, tant que la variable `seed` (le Numéro du Cycle) reste la même.
*   **Algorithme de départage déterministe (Conflit d'égalité absolue) :**
    *   Si deux anecdotes ont la même date ET la même `priority`, elles sont départagées en triant leur `id` alphabétiquement, puis en appliquant la fonction PRNG initialisée avec une graine combinant le "Numéro de l'année en cours" et la somme des codes ASCII de leurs `id`. Ainsi, si ce conflit se reproduit l'année suivante, ce ne sera pas systématiquement la même anecdote qui l'emportera.
*   **Optimisation du calcul O(N) (Mise en cache temporelle) :**
    *   Pour éviter que l'algorithme ne recalcule la boucle des jours depuis l'Epoch à chaque visite (bien que rapide, cela draine la batterie sur mobile de façon répétée), le script doit utiliser le `localStorage` du navigateur.
    *   Le script sauvegarde deux clés : `last_calculated_date` (au format `YYYY-MM-DD`) et `saved_general_days_counter` (entier).
    *   À la prochaine visite, si la date du jour est différente de `last_calculated_date`, la boucle ne part plus de l'Epoch, mais de `last_calculated_date + 1 jour`, reprenant le compteur là où il s'était arrêté. L'algorithme devient ainsi d'une complexité constante $O(1)$ dans 99% des cas.
*   **Définition stricte de l'Epoch :**
    *   L'Epoch (date de lancement) doit être initialisée en utilisant la méthode temporelle universelle stricte `Date.UTC(YYYY, MM, DD)` pour éviter que l'algorithme ne décale le calcul d'un jour selon l'heure locale de création. *(Attention : le mois commence à 0 en JS, donc Janvier = 0).*
*   **Cas particulier : Gestion mathématique des années bissextiles :**
    *   Si une anecdote a la règle `annual` avec la date `["02-29"]` (29 février). L'algorithme de filtre vérifiera si l'année en cours (`Date.getUTCFullYear()`) est bissextile. Si NON, l'anecdote sera, au choix mathématique, soit décalée sur le 28 février, soit purement ignorée pour cette année-là (ce dernier choix étant le plus rigoureux : l'anecdote ne s'affiche que tous les 4 ans).
*   **Traitement temporel des règles de "Périodes" sur le compteur :**
    *   Lors du calcul $O(N)$ du compteur `generalDaysCounter`, si une règle `period` s'applique et chevauche 5 jours, l'algorithme doit bloquer l'incrémentation du compteur `anytime` pendant très exactement ces 5 jours, afin de maintenir le déterminisme parfait de l'index du cycle.
*   **Mise à jour en direct (Roll-over de minuit UTC) :**
    *   Si un utilisateur garde le portfolio ouvert dans un onglet inactif à 23h59 UTC, puis y retourne à 00h01 UTC, l'anecdote affichée sera périmée. 
    *   Pour contrer cela, le script vérifiera la date au déclenchement de l'événement navigateur `visibilitychange` (lorsque l'utilisateur revient sur l'onglet). Si la date UTC a changé depuis le dernier rendu, le script déclenchera une transition fluide (fade-out / fade-in) pour afficher la nouvelle anecdote de manière autonome, sans nécessiter de rafraîchissement manuel de la page.
    *   **Faille critique : L'ajout d'anecdotes en cours de cycle :**
    *   *Le problème :* L'algorithme de Fisher-Yates standard mélange un tableau. Si la taille de ce tableau change au milieu d'un cycle (parce que de nouvelles anecdotes générales dans le registre ont été ajoutées), l'index généré pour le jour J pointera vers une donnée différente dans le tableau redimensionné. Cela provoquera des répétitions ou des omissions inopinées.
    *   *La solution mathématique :* Le "Mélange Déterministe" ne doit pas se faire sur l'ensemble du tableau à la volée. L'algorithme assignera plutôt à chaque anecdote de la liste un "Poids de tri" calculé par une fonction de hachage combinant la Graine (le Numéro du Cycle) ET l'identifiant unique de l'anecdote (`hash(seed + anecdote.id)`). La liste est ensuite triée selon ce poids. Ainsi, l'ajout d'une nouvelle donnée l'insérera à une position déterministe dans le tri sans bouleverser massivement l'ordre des éléments déjà consultés (seul le modulo de l'index sera affecté, limitant l'impact).
*   **Verrouillage du Modulo de l'Index :**
    *   Pour éviter totalement le décalage de l'Index du jour en cas d'ajout, le `generalDaysCounter` ne doit pas être divisé par la longueur *actuelle* du tableau (qui fluctue).
    *   Une métadonnée `cycle_length_lock` (la taille du tableau au moment où le cycle 0 a commencé) doit être fixée mathématiquement. Les nouvelles anecdotes ajoutées pendant le Cycle 0 ne seront prises en compte qu'à partir du Cycle 1. L'algorithme filtre la liste générale pour exclure les objets ayant une date de création (ajout d'une métadonnée `added_date` requise dans l'objet) supérieure à la date de début du cycle en cours.

## Planification avancée : conditions dynamiques (type `formula`)

En plus des types `anytime`, `annual`, `specific_date` et `period`, le planificateur (`js/anecdotes/scheduler.js`) supporte un cinquième type : `formula`. Ce type permet de conditionner l'apparition d'une anecdote à n'importe quel calcul arbitraire sur la date du jour (phase lunaire, jour de la semaine, divisibilité du quantième, liste figée de dates astronomiques, etc.), sans avoir à étendre indéfiniment le vocabulaire de `scheduling.type`.

*   **Format :** `{ type: 'formula', dates: [], predicate: (dateUTC) => boolean, description?: { fr, en } }`. Le champ `predicate` est une fonction JavaScript pure prenant un objet `Date` en UTC (minuit) et retournant un booléen. Comme `registry.js` est un module ES natif et non un fichier JSON, il peut légitimement contenir des fonctions : aucune sérialisation n'est nécessaire.
*   **Hiérarchie de priorité mise à jour :** `specific_date` (4) > `annual` (3) > `formula` (2) > `period` (1) > `anytime` (vivier général, hors compétition). Une anecdote `formula` cède donc la place à un événement `annual` ou `specific_date` tombant le même jour, mais prime sur un `period` en cours.
*   **Bibliothèque de constructeurs de conditions (`js/anecdotes/conditions.js`) :** pour éviter de réécrire un calcul de phase lunaire dans chaque fichier de registre, un module utilitaire expose des fabriques de prédicats réutilisables et combinables :
    *   `moonPhase(phase, toleranceDays)` : phase parmi `new`, `first_quarter`, `full`, `last_quarter`, calculée par un modèle synodique simplifié, avec une tolérance en jours pour absorber l'imprécision du modèle.
    *   `weekday(dayIndex)` : `0` (dimanche) à `6` (samedi), basé sur `Date.prototype.getUTCDay`.
    *   `dayOfMonthDivisibleBy(n)` et `dayOfYearDivisibleBy(n)` : conditions arithmétiques sur le quantième du mois ou de l'année.
    *   `specificYears(years)` : restreint une condition à un ensemble d'années précises.
    *   `knownDates(isoDates)` : vérifie l'appartenance à une liste figée de dates ISO (`YYYY-MM-DD`). C'est le mécanisme retenu pour les éclipses : en l'absence de bibliothèque d'éphémérides utilisable hors-ligne, la liste des dates d'éclipses pertinentes est maintenue manuellement et versionnée avec le reste du site plutôt que recalculée dynamiquement.
    *   `and(...)`, `or(...)`, `not(...)` : combinateurs logiques permettant de composer des conditions complexes (ex : `and(weekday(4), dayOfMonthDivisibleBy(13))` pour « seulement les vendredis 13 »).
*   **Absence d'effet sur le vivier général :** une entrée `formula` est, comme les autres types spéciaux, exclue du pool `anytime` par construction, donc son ajout ne perturbe jamais le calcul du cycle général ni le verrouillage de longueur de cycle.
*   **Intégration à l'outil de debug (`/anecdote/`) :** `js/anecdotes/debug/card-renderer.js` reconnaît le type `formula` et affiche, dans le badge de planification, le libellé générique suivi, si fourni, du champ `scheduling.description` résolu selon la langue active. L'outil de debug évalue directement la fonction pour la date consultée (via `resolveSpecialEntry`, agnostique au type de planification) : naviguer au calendrier jusqu'à un jour de pleine lune ou un vendredi 13 affiche donc correctement l'anecdote programmée.

## Corrections apportées à l'algorithme de sélection générale (mise à jour de conformité au code)

Cette section corrige des écarts entre la description initiale de l'algorithme cyclique et son implémentation réelle dans `js/anecdotes/cycle-engine.js`.

*   **Le mélange n'est pas un Fisher-Yates classique, mais un tri par poids pseudo-aléatoire déterministe :** pour un cycle de numéro `n`, chaque identifiant `id` du vivier se voit attribuer un poids `mulberry32(hash(n + "::" + id))()`, puis la liste est triée par poids croissant (`weightedOrder`). Le résultat est équivalent en distribution à un mélange déterministe, tout en restant stable localement lors de l'insertion d'un nouvel identifiant.
*   **Le pool éligible est réévalué à chaque cycle, pas verrouillé une fois pour toutes au cycle 0 :** l'implémentation recalcule `eligibleAnytimePool` à chaque nouveau cycle à partir de la date ISO correspondant au premier jour de ce cycle (`isoDateAtGeneralCounter`), en filtrant les anecdotes dont `addedDate` est postérieure à cette date. Une anecdote ajoutée en cours de cycle 0 n'entre donc en jeu qu'à partir du cycle où sa date d'ajout précède le début de cycle recalculé.
*   **Fenêtre anti-répétition inter-cycles (`ANTI_REPEAT_WINDOW`) :** l'algorithme retient les 18 derniers identifiants affichés (`forbiddenTailIds`) et, lors du calcul du nouvel ordre pondéré, permute les 18 premières positions du nouvel ordre pour en exclure ces identifiants récents lorsque c'est possible. Cette permutation est un simple échange de position, ce qui préserve le déterminisme du mélange pondéré.
*   **Cache à points de contrôle :** `js/anecdotes/debug/engine.js` et `cycle-engine.js` maintiennent chacun une table de points de contrôle triée permettant une recherche par dichotomie du point de départ le plus proche avant de reprendre le parcours jour par jour, bornant le coût des requêtes répétées sur des dates éloignées.
*   **Séparation stricte entre l'état persistant du site principal et l'outil de debug :** le site principal persiste son compteur dans `localStorage`. L'outil de debug et toute intégration résolvant une anecdote pour une date arbitraire (par exemple le calendrier de bureau `desk/script.js`) doivent s'appuyer sur `resolveEntryForDate` (`js/anecdotes/debug/engine.js`) plutôt que sur `computeGeneralDaysCounter`, afin de ne jamais désynchroniser le compteur affiché sur la page d'accueil.

## Sécurité et intégrité de la date

Le système ne doit pas permettre de triche basique ni de navigation dans le temps (pas d'archives, pas de tags permettant de fouiller). L'accès direct aux fichiers sources par un utilisateur avancé n'est pas un problème (aucun cryptage nécessaire), mais l'interface du site doit rester inviolable de façon simple.

*   **Référentiel de temps (UTC) :** Pour que le monde entier bascule sur la nouvelle anecdote à la même seconde, la logique mathématique doit reposer sur le temps universel (UTC) et non sur le fuseau horaire local.
*   **Synchronisation réseau :** L'heure de l'ordinateur de l'utilisateur (`new Date()`) n'est pas fiable (facilement modifiable pour tricher). Au lancement, le système exécutera une requête (Fetch) ultralégère vers une API publique de temps universel (ex: `http://worldtimeapi.org/api/timezone/Etc/UTC`) pour récupérer l'heure authentique.
*   **Solution de repli (Fallback) :** En cas de bloqueur d'API, de navigation hors ligne ou de perte réseau, l'algorithme interceptera l'erreur silencieusement et se rabattra sur l'horloge système locale (`new Date()`) convertie en UTC, afin de ne jamais empêcher l'affichage du site, un message log devra être affiché dans la console pour détailler le problème survenu.
*   **Gestion des quotas d'API et optimisation réseau (Offset) :**
    *   Les API gratuites comme WorldTimeAPI ont des limites de requêtes (rate limiting). Faire une requête à chaque navigation ou rafraîchissement de page entraînera un blocage de l'IP de l'utilisateur.
    *   *Solution :* Lors de la première requête Fetch réussie, le script calcule la différence (Offset) en millisecondes entre l'heure UTC de l'API et l'heure UTC locale de la machine (`apiTime - localTime`). 
    *   Cet Offset est stocké dans le `sessionStorage` (valide le temps de la session de navigation).
    *   Pour les affichages suivants, l'heure vraie est calculée localement via `new Date(Date.now() + offset)`. La requête API n'est faite qu'une seule fois par session, protégeant le système contre les blocages réseau.
*   **Prévention du cache agressif de l'API temporelle :**
    *   Lors de la requête Fetch vers `WorldTimeAPI`, le navigateur (ou le CDN) pourrait mettre la réponse en cache, renvoyant l'heure de la veille.
    *   L'appel réseau devra inclure le paramètre de cache control : `fetch('URL', { cache: 'no-store' })`.
*   **Invalidation de l'Offset de session :**
    *   L'Offset (différence calculée entre l'horloge système et l'UTC réel) stocké en `sessionStorage` devra comporter un "Timestamp d'expiration" (ex: validité de 2 heures maximum). Si l'utilisateur sort son ordinateur de veille le lendemain sans avoir fermé le navigateur, l'offset doit être recalculé pour corriger la dérive des horloges matérielles post-mise en veille.

*   **Gestion du Cross-Origin Resource Sharing (CORS) de l'API temporelle :**
    *   Les appels réseau (Fetch) vers des API publiques tierces depuis un navigateur sont soumis aux politiques CORS. L'API sélectionnée (ex: WorldTimeAPI) doit explicitement autoriser les requêtes cross-origin (`Access-Control-Allow-Origin: *`). En cas d'évolution stricte des politiques CORS du navigateur, un plan B consistant à lire les en-têtes HTTP (headers) d'une requête HEAD vers votre propre domaine statique (qui renvoie le timestamp UTC du serveur hébergeant votre site statique) sera implémenté (ici on utilise github pages).

## Gestion de la traduction de tout le contenu (i18n)

L'intégralité de cette nouvelle section doit s'imbriquer dans le système de traduction existant du portfolio. Le format d'objet `cle: { en: "english", fr: "français" }` sera respecté pour chaque élément textuel.

*   **Éléments concernés par la traduction :**
    *   `content` : Le corps principal de l'anecdote (qu'il soit une simple chaîne ou le retour d'une fonction dynamique).
    *   `sources` : Le nom de la source (`name`). L'URL peut être identique pour les deux langues ou être traduite si la page externe existe dans les deux langues.
    *   `contexts` : Le titre de la modale (`title`) et le corps de texte complet (`body`) incluant les balises Markdown et LaTeX.
*   **Mécanisme de "Fallback" linguistique strict :**
    *   Si, par erreur d'omission lors de l'ajout d'une nouvelle anecdote, la clé `en` est manquante dans l'objet de traduction, le système ne doit pas retourner `undefined` (ce qui ferait planter le site). L'accesseur de traduction inclura une condition de repli automatique vers une autre langue disponible pour garantir que le texte s'affiche toujours, avec potentiellement un log de type "Warning" dans la console développeur pour vous signaler l'oubli.
*   **Règles typographiques numériques pour les mathématiques et la physique :**
    *   Outre le texte, le formatage des nombres injectés dynamiquement doit respecter les conventions linguistiques scientifiques.
    *   En anglais, les milliers sont séparés par des virgules et les décimales par des points (ex: $299,792.458$). En français, les milliers sont séparés par des espaces insécables et les décimales par des virgules (ex: $299\ 792,458$).
    *   Les variables numériques injectées dans les `content` ou les contextes devront passer par une fonction utilitaire utilisant `new Intl.NumberFormat(lang).format(value)` avant d'être concaténées, pour garantir la justesse scientifique selon la langue sélectionnée.
