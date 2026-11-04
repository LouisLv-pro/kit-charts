# Glossaire kit-charts

Un concept, un seul mot. Quand le code ou la documentation en emploient plusieurs, le mot
retenu est en gras et les synonymes à éviter sont signalés.

- **template** : un graphique, une carte KPI ou un tableau prêt à l'emploi, dans `template/<famille>/<id>/`. Il y en a 73. À éviter : « modèle » (README), « composant », « type de graphique ».
- **famille** : un des 10 dossiers qui regroupent les templates (`00-kpi-card` à `09-tableaux-dataviz`). Clé `family` du registre. À éviter : « catégorie » (c'est le nom du champ `category` dans `index.html`, pour la même chose).
- **spec** : le fichier JSON `output/<slug>/spec.json` qui décrit un graphique à produire (template, titre, thème, polarité, données). À éviter : « config » (réservé à la config Chart.js émise par un template).
- **formattedData** : le champ de la spec qui contient les données, dans la forme propre au template. À éviter : « data » seul, « dataset » (c'est une série à l'intérieur de `formattedData`).
- **DEFAULT_DATA** : l'exemple de données exporté par chaque `template.js`. Il montre la forme attendue, jamais des données à livrer.
- **contrat de données** : la forme exigée de `formattedData` pour un template, écrite dans son `schema.json`. Affichée par `kit-charts describe <id>`. À éviter : « schéma » employé seul.
- **registre** : `.agents/skills/kit-charts/registry.json`, la liste machine des 73 templates (famille, exigences de données, chemins des fichiers). Il est produit par `generate-triplets-and-registry.js`. À éviter : « catalogue » pour désigner cette liste.
- **galerie** : la page `index.html`, qui affiche les 73 templates et le démonstrateur d'infobulles. À éviter : « catalogue » et « portail » (mots utilisés dans le code de la page).
- **démonstrateur tooltip** : le dossier `template/tooltip/`. Il est montré dans la galerie mais ne fait pas partie du registre et aucune spec ne peut le viser.
- **thème** : un des 8 jeux de couleurs, polices et contrastes (`themes/`). Identifié par un nom comme `colorbrewer-accessible`. À éviter : « palette » seul (une palette est une liste de couleurs à l'intérieur d'un thème).
- **couleur sémantique** : une couleur qui porte un jugement (`positive`, `negative`, `warning`, `info`, `neutral`). Dans un thème, la clé `semantic`.
- **polarité** : le sens dans lequel une métrique est « bonne ». Quatre valeurs, écrites `metricPolarity` dans la spec. À éviter : « valence » seul, « metricType » (`gain` ou `cost`, nom du champ de données lu par les cartes KPI), « polarity » en minuscules (`lower-is-better`, lu par `kpi-status-alert`).
- **HIGHER_IS_BETTER** : une hausse est bonne (chiffre d'affaires, marge, rétention).
- **LOWER_IS_BETTER** : une hausse est mauvaise (coûts, churn, latence, pannes).
- **TARGET_BASED** : bon dans la cible, à surveiller dans la tolérance, mauvais au-delà (SLA, température).
- **NEUTRAL_CATEGORICAL** : aucun jugement de valeur, palette de catégories (pays, produits).
- **encodage par longueur** : un graphique où la valeur se lit à la longueur d'une barre. L'axe doit partir de zéro (Y=0). La liste est `LENGTH_ENCODED_TEMPLATES` dans `validate-chart.js` (12 templates).
- **Y=0** : la règle qui impose `beginAtZero: true` sur l'axe de valeur d'un encodage par longueur. Nom de règle : `CLEVELAND_Y_ZERO`.
- **règle** : un contrôle du linter, identifié par un `ruleId` en majuscules (`VERTICAL_BAR_MAX_CATEGORIES`). À éviter : « check » (réservé au rendu réel).
- **erreur bloquante** : une règle de gravité `ERROR`. `compile` refuse la spec, n'écrit rien et sort en code 1.
- **avertissement** : une règle de gravité `WARNING`. Elle ne bloque pas, mais le rapport doit la corriger ou la justifier.
- **linter** : `validate-chart.js`, qui lit une spec ou un HTML compilé et applique les règles. Commande `kit-charts validate`.
- **compilateur** : `compile-chart.js`, qui transforme une spec en page HTML autonome (`--format html`) ou en fragment (`--format snippet`).
- **rendu réel** : l'ouverture de la page dans Chrome headless par `kit-charts check`. Le statut est lu dans l'attribut `data-kc-render` (`ok`, `invalid` ou `error`).
- **snapshot** : la config Chart.js émise par un template pour un thème, figée dans `test/__snapshots__/cognitive/<id>--<thème>.json`. Il y en a 73 × 8.
- **intention** : ce que le lecteur doit faire du graphique (`--intent`) : `kpi`, `comparison`, `composition`, `distribution`, `correlation`, `evolution`, `flow`, `hierarchy`, `geo`, `table`.
- **recommandeur** : `recommend-template.js`, qui liste les templates éligibles et écartés pour des données. Il borne le choix, il ne le fait pas.
- **skill** : le dossier `.agents/skills/kit-charts/` (workflow en 7 étapes, références, scripts, registre, evals). Installé sous `.claude/skills/kit-charts/` par `install-skill`.
- **agent dataviz** : l'agent unique (`.agents/agents/dataviz.md`) qui qualifie, construit et audite. À éviter : « sous-agent », « agent designer » (anciens rôles supprimés).
- **eval** : un cas d'évaluation du skill dans `.agents/skills/kit-charts/evals/<cas>/` : un prompt, un résultat attendu, des critères de notation. À éviter : « test » (un test est dans `test/`).
