# Contrat de spec `dataviz-spec.json`

Référence des champs lus par `compile-chart.js` et `validate-chart.js`. La forme exacte de
`formattedData` dépend du template : son `schema.json` la décrit, son `DEFAULT_DATA` en donne
un exemple conforme (`kit-charts describe <id>` affiche les deux). `validate-chart.js` vérifie
`formattedData` contre ce schéma (règle bloquante `SCHEMA_FORMATTED_DATA`) et signale les champs
inconnus (`UNKNOWN_FIELD`). Un template qui reçoit des données incomplètes affiche « Données
invalides » au lieu de compléter avec son exemple : `kit-charts check` le rapporte (`invalid`).

## Sommaire

1. Champs racine
2. `layout`
3. `colorStrategy` (thème, mode couleur, polarité)
4. `cognitiveFeatures` (étiquettes, infobulle)
5. `formattedData` selon la famille
6. `options` (avancé)
7. Page à plusieurs graphiques

## 1. Champs racine

| Champ | Requis | Rôle |
| :--- | :---: | :--- |
| `targetTemplateId` | oui | Identifiant exact d'un template de `registry.json` |
| `layout` | non | Titre, sous-titre, hauteur, source |
| `colorStrategy` | non | Thème, mode couleur, polarité métier |
| `cognitiveFeatures` | non | Étiquettes directes, mise en avant, infobulle |
| `formattedData` | oui | Données au format du template |
| `options` | non | Surcharges Chart.js contrôlées par le linter |

## 2. `layout`

| Champ | Type | Défaut | Conseil |
| :--- | :--- | :--- | :--- |
| `title` | string | nom du template | Énonce le constat, en une phrase |
| `subtitle` | string | description du template | Unité, périmètre, période |
| `height` | entier 100 à 2000 | 400 | 320 à 480 pour un graphique seul |
| `footnote` | string | vide | Source ou note de lecture, rendue en pied de carte par tous les templates. Vide : pas de pied. Carte KPI : `formattedData.footnote` prioritaire, sinon `layout.footnote` |
| `span` | entier 1 à 3 | 1 | Page à plusieurs graphiques seulement : nombre de colonnes occupées par ce graphique |

## 3. `colorStrategy`

### `themeName`

| Contexte de lecture | Thème |
| :--- | :--- |
| Défaut, rapports et dashboards clairs | `colorbrewer-accessible` |
| Monitoring 24/7, interface sombre | `nord-cognitive-dark` |
| Publication scientifique, séries denses | `paul-tol-scientific` |
| Public large, daltonisme garanti | `okabe-ito-cud` |
| Comité de direction, impression | `tufte-minimalist-executive` |
| Heatmap ou échelle continue | `viridis-perceptual` |
| Présentation business multi-catégories | `tableau-stone-categorical` |
| Basse vision, accessibilité renforcée | `atkinson-hyperlegible` |

### `mode` (mode couleur)

| Valeur | Quand |
| :--- | :--- |
| `semantic-valence` | Deltas, statuts, réalisé vs cible : la couleur juge selon la polarité |
| `categorical` | Catégories sans ordre (pays, produits) |
| `sequential` | Grandeur ordonnée d'un seul sens (heatmap, choroplèthe de taux) |
| `diverging` | Écart autour d'un point neutre (variance, solde) |

### `metricPolarity`

`HIGHER_IS_BETTER`, `LOWER_IS_BETTER`, `TARGET_BASED`, `NEUTRAL_CATEGORICAL`. Voir le
tableau de polarité dans `SKILL.md`. Toute autre valeur déclenche `INVALID_METRIC_POLARITY`.

## 4. `cognitiveFeatures`

### `showDataLabels`

| Situation | Valeur |
| :--- | :--- |
| N ≤ 7, ou carte KPI | `true` |
| 8 ≤ N ≤ 12 sur `bar-chart-horizontal` ou `bullet-chart` (l'étiquette tient au bout de la barre) | `true` |
| 8 ≤ N ≤ 12 ailleurs | `false`, sauf points focaux |
| N > 12, plus de 3 courbes, nuages de points, treemaps fins | `false` |

Au-delà de 12 points, `true` déclenche `DATALABELS_OVERCROWDING`.

### `focus`

Nom d'une catégorie (ou d'une série) à mettre en avant : elle prend la couleur focale, les
autres passent en gris de contexte. Exemple : `"focus": "Lille"` sur un classement d'agences.
Le compilateur le traduit en `focusIndex` ou en rôles `focal` / `context` ; ne les écris pas
à la main. `make` le déduit d'un titre qui cite une seule catégorie (`--focus` pour imposer,
`--focus aucun` pour enlever).

| Situation | Résultat |
| :--- | :--- |
| Barres, sucettes, parts, boîtes, violons | une catégorie mise en avant |
| `slope-chart`, `multi-line-chart` | une série mise en avant |
| Nom absent des données | erreur `FOCUS_UNKNOWN_LABEL`, avec les noms connus |
| Autre template | avertissement `FOCUS_UNSUPPORTED`, rendu inchangé |

### `tooltip`

Toujours `enabled: true` et `antiOcclusion: true` : l'infobulle ne doit jamais masquer le
point inspecté (Mayer, contiguïté).

| Géométrie | `mode` | `axis` |
| :--- | :--- | :--- |
| Courbes, colonnes | `index` | `x` |
| Barres horizontales, bullet, entonnoir, cascade | `index` | `y` |
| Nuages, bulles, heatmaps | `nearest` | `xy` |
| Parts d'un tout, distributions | `nearest` | `xy` |

## 5. `formattedData` selon la famille

Formes les plus courantes. Pour tout autre template, ouvrir son `schema.json` (forme
exigée) et son `DEFAULT_DATA` (exemple conforme).

| Famille | Forme |
| :--- | :--- |
| Barres, courbes, aires | `{ labels: [...], datasets: [{ label, data: [nombres] }] }` |
| KPI (`kpi-standard`) | `{ title, value, unit?, delta?, deltaLabel?, benchmark? }` ; les autres cartes exigent en plus `history` (sparkline), `target` (bullet), `historical` + `budget` (comparative), `segments` (distribution), `drivers` (composite), `polarity` + `thresholds` (status-alert) : `kit-charts describe <id>` |
| Nuages (`scatter-plot`) | `{ datasets: [{ label, data: [{ x, y }] }] }` |
| Bulles (`bubble-chart`) | `{ datasets: [{ label, data: [{ x, y, z }] }] }` : z est encodé par l'aire |
| Treemap | `{ datasets: [{ tree: [{ category, name, value }] }] }` |
| `box-plot` | `{ labels: [groupes], datasets: [{ label, data: [{ min, q1, median, q3, max, outliers }] }] }` |
| `box-strip-plot`, `raincloud-plot`, `violin-plot` | `{ labels: [groupes], datasets: [{ label, data: [[observations du groupe 1], [groupe 2], ...] }] }` : un seul dataset, échantillons bruts |
| `waterfall-chart` | `{ labels, datasets: [{ label, data: [[début, fin], ...] }] }` : paire pour une variation, nombre seul pour un total |
| `gantt-progress` | `{ labels, datasets: [{ todayWeek, tasks: [{ label, start, end, progress, category }] }] }` : `progress` de 0 à 100 |
| `slope-chart` | `{ labels: [date 1, date 2], datasets: [{ label, data: [v1, v2] }] }` : exactement 2 labels, un dataset par entité (10 au plus) |
| `bullet-chart` | `{ labels, datasets: [réalisé, objectif, bandes qualitatives...] }` : 5 datasets au plus |
| `table-heatmap-matrix` | `{ title, subtitle, unit, columns: [libellés], rows: [{ id, label, values: [nombres] }] }` |
| Autres distributions | forme propre à chaque template, voir `schema.json` |
| Cartes géo | valeurs par code ou nom de zone, voir `DEFAULT_DATA` |

Règles de données valables partout :

- Une seule unité par axe. Deux unités différentes : deux graphiques, ou `dual-axis-controlled`.
- Barres horizontales triées par valeur décroissante, sauf ordre naturel (âge, étapes, mois).
  `bar-chart-horizontal` trie déjà tout seul. Pour garder un ordre naturel ou « Autres » en
  dernier, fournis les données dans l'ordre voulu et ajoute `"sorted": false` au dataset
  (booléen, défaut `true`, déclaré dans son `schema.json`).
- Parts inférieures à 3 % regroupées dans « Autres », placé en dernier (voir ci-dessus).
- Dates dans l'ordre chronologique, de gauche à droite.

## 6. `options` (avancé)

Surcharges passées au template. Le linter refuse `beginAtZero: false` et les échelles
logarithmiques sur les encodages par longueur. N'y mets jamais de couleur ni d'animation.

## 7. Page à plusieurs graphiques

Un tableau de bord ou un rapport tient dans une spec de page, compilée par
`kit-charts compile output/<page>/page.json` en une seule page HTML. Le code commun (Chart.js,
moteur de thèmes, code de chaque template) n'y est chargé qu'une fois.

| Champ | Requis | Rôle |
| :--- | :---: | :--- |
| `layout.title` | conseillé | Le message d'ensemble de la page |
| `layout.subtitle`, `layout.footnote` | non | Périmètre et période ; source commune |
| `layout.columns` | non | 1 à 3 (défaut : 2 dès deux graphiques). Sous 760 px, une colonne |
| `colorStrategy.themeName` | non | Un seul thème, imposé à tous les graphiques |
| `charts` | oui | 1 à 6 specs : objets, ou chemins vers des `spec.json` relatifs au fichier de page |

Règles bloquantes : `PAGE_EMPTY`, `PAGE_TOO_MANY_CHARTS` (plus de 6), `PAGE_COLUMNS`, et les
erreurs de chaque graphique, préfixées par `charts[i]`. Les graphiques sont alignés en haut de
leur rangée : une carte KPI garde sa hauteur à côté d'un graphique plus haut.
