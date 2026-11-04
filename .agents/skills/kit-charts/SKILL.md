---
name: kit-charts
description: Conçoit, compile et audite des visualisations de données fondées sur les sciences cognitives (Cleveland-McGill, Tufte, Sweller, Mayer) et WCAG 2.2, à partir de 73 templates Chart.js certifiés, d'un recommandeur déterministe, d'un compilateur et d'un linter. À utiliser dès qu'il faut produire ou corriger un graphique, une carte KPI, un tableau de bord, une carte géographique ou un tableau de données dans ce dépôt, choisir le bon type de graphique pour des données, ou auditer un HTML de graphique, même si l'utilisateur ne cite ni kit-charts ni un template. À préférer à tout code Chart.js écrit à la main.
---

# kit-charts

Un graphique est un argument : il doit transmettre un message vrai, vite, à tout le monde.
Ce skill y parvient sans code graphique ad hoc. Tu choisis un template certifié, tu écris une
spec JSON, et les scripts garantissent le reste (axe à zéro, palettes accessibles, polarité
métier, rendu sans animation). Ton travail porte sur ce qu'aucun script ne sait juger : la
question métier, le bon encodage, le message du titre.

Toutes les commandes passent par le CLI `kit-charts`, lancé depuis le dossier du projet : les
specs et les pages produites y restent, les templates viennent du paquet installé
(`npm i -g github:LouisLv-pro/kit-charts`). Dans le dépôt kit-charts lui-même, sans
installation, remplace `kit-charts` par `node bin/kit-charts.js`.

## Workflow

Copie cette liste et coche au fil de l'eau :

```
- [ ] 1. Qualifier la demande (message, données, polarité, thème, sortie)
- [ ] 2. Choisir le template (kit-charts recommend puis jugement)
- [ ] 3. Lire le contrat de données du template choisi (kit-charts describe)
- [ ] 4. Écrire output/<slug>/spec.json (kit-charts init-spec)
- [ ] 5. Compiler, corriger jusqu'à 0 erreur bloquante (3 essais max)
- [ ] 6. Valider le HTML, vérifier le rendu réel (kit-charts check), passer la revue experte
- [ ] 7. Livrer le rapport
```

### 1. Qualifier

Établis cinq choses avant de choisir quoi que ce soit :

| Élément | Question | Défaut si rien n'est dit |
| :--- | :--- | :--- |
| Message | Que doit comprendre le lecteur en 5 secondes ? | Déduit des données, formulé dans le titre |
| Données | Catégories, séries, période, unité ? | Celles fournies, sans les inventer |
| Polarité | Une hausse est-elle bonne, mauvaise ou neutre ? | Voir le tableau de polarité ci-dessous |
| Thème | Quel contexte de lecture ? | `colorbrewer-accessible` |
| Sortie | Page autonome ou fragment à intégrer ? | Page HTML (`--format html`) |

Ne demande à l'utilisateur que ce qui bloque vraiment : pas de données du tout, ou une
métrique dont le sens change la polarité sans indice possible. Pour le reste, applique le
défaut et note l'hypothèse : elle figurera dans le rapport. Une hypothèse visible vaut mieux
qu'une question de plus, et un graphique livré se corrige vite.

N'invente jamais de données. Si l'utilisateur veut une maquette, utilise les données
d'exemple du template et dis-le.

### 2. Choisir le template

Commence par le recommandeur. Il profile les données (N catégories, séries, longueur des
libellés, dates, somme à 100 %, série cible) et applique les règles du kit :

```bash
kit-charts recommend data.json --intent comparison
kit-charts recommend --intent evolution --n 24 --series 3 --json
```

Intentions : `kpi`, `comparison`, `composition`, `distribution`, `correlation`, `evolution`,
`flow`, `hierarchy`, `geo`, `table`. Sans `--intent`, il la déduit des données et le signale.

Le recommandeur borne le choix, il ne le fait pas à ta place. Un template qu'il écarte viole
une règle : ne le reprends pas. Parmi les éligibles, tranche avec la question métier et
[references/decision-matrix.md](references/decision-matrix.md). Exemple : deux séries
« 2023 » et « 2024 » sur 6 régions donnent `grouped-bar-chart`, mais si le message est
l'écart, `dumbbell-chart` le montre mieux.

Repères qui couvrent la majorité des demandes :

| Intention | Cas | Template |
| :--- | :--- | :--- |
| KPI | Une valeur et sa variation | `kpi-standard`, `kpi-sparkline` si tendance |
| Comparaison | N ≤ 7, libellés courts | `bar-chart-vertical` |
| Comparaison | N > 7 ou libellés > 12 caractères | `bar-chart-horizontal`, trié décroissant |
| Comparaison | Réalisé vs cible | `bar-target-overlay`, `bullet-chart` |
| Composition | 2 à 4 parts | `doughnut-chart` |
| Composition | 5 parts ou plus | `bar-chart-horizontal` trié, `treemap` ou `waffle-chart` |
| Composition | Plusieurs groupes à comparer | `stacked-bar-100` |
| Évolution | 1 série | `line-chart` |
| Évolution | 2 à 5 séries | `multi-line-chart` |
| Distribution | Groupes à comparer | `box-plot` |
| Corrélation | 2 variables continues | `scatter-plot`, `scatter-regression` |
| Géo | Taux par zone | `choropleth-map` (données normalisées) |

### 3. Lire le contrat de données

La forme de `formattedData` change selon le template : `labels` + `datasets` pour les
barres et courbes, `value` + `delta` pour les KPI, `tree` pour le treemap, nœuds et liens
pour le Sankey. Lis donc, pour le template retenu :

```bash
kit-charts describe <id>
```

Il affiche la forme exigée de `formattedData` (le `schema.json` du template : champs, types,
bornes) et un exemple conforme (son `DEFAULT_DATA`). L'exemple montre la forme, jamais des
données à livrer.

Les deux concordent : chaque `DEFAULT_DATA` passe son `schema.json` (vérifié par `npm test`),
et le linter refuse un `formattedData` qui le viole (règle `SCHEMA_FORMATTED_DATA`). Le schéma
ne contrôle pas les longueurs croisées (autant de valeurs que de `labels`) : vérifie-les toi-même.

### 4. Écrire la spec

Pars d'un squelette, rempli avec tes données s'il y en a déjà au bon format :

```bash
kit-charts init-spec <id> -o output/<slug>/spec.json [--data data.json]
```

Le squelette a des valeurs vides : la compilation le refuse tant que tu n'y as pas mis les
vraies données, le titre, le sous-titre et la polarité. Slug court en kebab-case. Champs et
valeurs permises : [references/spec-contract.md](references/spec-contract.md).

```json
{
  "targetTemplateId": "bar-chart-horizontal",
  "layout": {
    "title": "L'Île-de-France pèse autant que les trois régions suivantes",
    "subtitle": "Chiffre d'affaires 2024, en millions d'euros",
    "height": 420
  },
  "colorStrategy": {
    "themeName": "colorbrewer-accessible",
    "mode": "categorical",
    "metricPolarity": "HIGHER_IS_BETTER"
  },
  "cognitiveFeatures": {
    "showDataLabels": true,
    "tooltip": { "enabled": true, "mode": "index", "axis": "y", "antiOcclusion": true }
  },
  "formattedData": {
    "labels": ["Île-de-France", "Auvergne-Rhône-Alpes", "Nouvelle-Aquitaine", "Occitanie"],
    "datasets": [{ "label": "CA (M€)", "data": [450, 180, 150, 120] }]
  }
}
```

Le titre énonce le constat, pas le sujet. « CA par région » oblige le lecteur à chercher ;
« L'Île-de-France pèse autant que les trois suivantes » lui donne la conclusion, que le
graphique prouve. Le sous-titre porte l'unité et la période. La source va dans `layout.footnote`, rendu en pied
de carte par tous les templates.

Les valeurs affichées n'ont pas de suffixe d'unité (« 28 », pas « 28 % ») : l'unité doit
donc figurer dans le sous-titre ou le `label` de la série.

### 5. Compiler

```bash
kit-charts compile output/<slug>/spec.json -o output/<slug>/index.html
```

Ajoute `--format snippet -o output/<slug>/snippet.html` pour un fragment sans `<html>`.

Le compilateur valide la spec avant d'écrire. En cas d'erreur bloquante, il n'écrit rien,
sort en code 1 et affiche pour chaque règle un `Correctif`. Applique-le dans la spec et
recompile. Au bout de 3 échecs sur la même règle, arrête et explique le conflit : c'est
souvent le signe que l'intention ou le template est mal choisi, pas la spec.

`--force` génère malgré les erreurs, pour du débogage seulement. Une sortie forcée n'est
jamais livrable.

### 6. Valider et relire

```bash
kit-charts validate output/<slug>/index.html --json
kit-charts check output/<slug>/index.html
```

Zéro erreur est exigé. Chaque avertissement est corrigé ou justifié dans le rapport.

`check` ouvre la page dans Chrome headless et lit le statut posé par la page :
`ok`, `invalid` (données refusées par le template, la raison est donnée) ou `error`
(script ou CDN en échec, rendu vide). Le linter lit la spec, `check` lit le rendu : les deux
sont exigés. Sans Chrome (exit 2), dis-le dans le rapport. Si un outil de capture d'écran
est disponible, regarde aussi la page : un rendu `ok` peut encore avoir un titre tronqué ou
des étiquettes qui se chevauchent.

Le linter ne voit pas tout : il ignore si le titre dit vrai, si l'unité manque, si les
barres sont triées ou si la polarité correspond au sens réel de la métrique. Passe la
[revue experte](references/review-checklist.md) avant de livrer. Elle prend deux minutes et
attrape les erreurs qui trompent le lecteur sans casser aucune règle.

### 7. Livrer

Réponds avec ce gabarit, sans rien ajouter :

```markdown
**Graphique** : output/<slug>/index.html
**Template** : <id>, choisi parce que <raison en une phrase>
**Écartés** : <template> (<règle>), ...
**Hypothèses** : <défauts appliqués, ou « aucune »>
**Audit** : validate <0 erreur, N avertissement(s)> ; check <ok, ou raison> ; revue experte <OK ou points ouverts>
```

## Polarité métier

La couleur porte un jugement. Se tromper de polarité affiche en vert une hausse des coûts.
Raisonne sur le sens de la métrique, pas sur son signe :

| Polarité | Exemples | Hausse affichée en |
| :--- | :--- | :--- |
| `HIGHER_IS_BETTER` | CA, marge, rétention, NPS, conversion | vert |
| `LOWER_IS_BETTER` | coûts, churn, latence, pannes, délais, émissions | rouge |
| `TARGET_BASED` | SLA, température, budget, stock | vert dans la cible, orange en tolérance, rouge hors cible |
| `NEUTRAL_CATEGORICAL` | pays, produits, segments, canaux | aucun jugement, palette catégorielle |

En cas de doute réel (« effectifs », « volume d'appels »), choisis `NEUTRAL_CATEGORICAL` et
signale-le : une couleur neutre ne trompe personne, une couleur fausse si.

## Règles bloquantes et correctifs

Le linter applique ces règles. Les connaître évite des allers-retours de compilation.

| Règle | Déclencheur | Correctif |
| :--- | :--- | :--- |
| `CLEVELAND_Y_ZERO` | `beginAtZero: false` sur un encodage par longueur | Retirer l'option : la longueur doit être proportionnelle à la valeur |
| `NO_LOG_ON_LENGTH` | Échelle log sur des barres | Échelle linéaire, ou `scatter-plot` si le log est indispensable |
| `VERTICAL_BAR_MAX_CATEGORIES` | Plus de 7 colonnes | `bar-chart-horizontal`, ou top 6 + « Autres » |
| `MULTI_LINE_MAX_SERIES` | Plus de 5 courbes | Top 4 + « Autres », ou plusieurs `line-chart` |
| `PIE_DONUT_MAX_SLICES` | Plus de 7 tranches | `bar-chart-horizontal` trié ou `treemap` |
| `DATALABELS_OVERCROWDING` | Étiquettes avec N > 12 | `showDataLabels: false`, détail dans l'infobulle |
| `INVALID_METRIC_POLARITY` | Polarité inconnue | Une des 4 valeurs ci-dessus |
| `VALENCE_POLARITY_MISMATCH` | Couleur contraire à la polarité | Corriger `metricPolarity`, jamais les couleurs à la main |
| `WCAG_CONTRAST_*` | Contraste texte insuffisant | Changer de thème, ne pas surcharger les couleurs |
| `SCHEMA_FORMATTED_DATA` | `formattedData` hors du `schema.json` du template (type, champ requis, bornes, nombre d'éléments) | Reprendre la forme du schéma ; le message donne le chemin fautif, par exemple `formattedData.datasets[0].data[2]` |
| `UNKNOWN_FIELD` (avertissement) | Champ que ni le compilateur ni le template ne lisent : faute de frappe ou mauvais niveau | Corriger le nom ou le déplacer (par exemple la source va dans `layout.footnote`) |
| `DATA_LENGTH_MISMATCH` (avertissement) | Un dataset n'a pas une valeur par label | Une valeur par label, `null` pour une valeur manquante |
| `WATERFALL_STEP_AS_TOTAL` (avertissement) | Étape intermédiaire d'un `waterfall-chart` en nombre seul : dessinée comme un total depuis 0 | Paire chaînée `[cumul avant, cumul après]` |

Le registre est plus strict que le linter et c'est lui qui fait foi : `pie-chart` 3 parts au
plus, `doughnut-chart` 4 au plus. Le recommandeur applique déjà ces plafonds.

## Ce qu'il ne faut pas faire, et pourquoi

- Écrire du Chart.js à la main ou modifier un `template.js` pour un cas précis : les
  garanties du kit disparaissent, et les tests ne couvrent plus le rendu.
- Mettre des couleurs hexadécimales dans la spec : le thème gère contraste, daltonisme et
  polarité. Une couleur en dur casse les trois.
- Tronquer l'axe pour « voir les écarts » : si les écarts sont petits, c'est le message.
  Montre plutôt la variation (`dumbbell-chart`, `slope-chart`) ou un `line-chart`.
- Activer une animation : le mode cognitif rend en 0 ms, sans saut ni latence.
- Représenter des totaux bruts sur une `choropleth-map` : les grandes zones dominent
  visuellement. Normalise (par habitant, par km², en taux) ou prends `bubble-map`.

## Références

Lis seulement celle dont tu as besoin :

- [references/decision-matrix.md](references/decision-matrix.md) : arbre complet des 73 templates et limites par template. Pour départager des éligibles.
- [references/spec-contract.md](references/spec-contract.md) : tous les champs de la spec, valeurs permises, choix du thème et du mode couleur.
- [references/review-checklist.md](references/review-checklist.md) : revue experte avant livraison.
- [references/interaction-tooltips-animations.md](references/interaction-tooltips-animations.md) : étiquettes, infobulles, légendes.
- [references/color-semantics.md](references/color-semantics.md) : polarités et 8 thèmes.
- [references/cognitive-rules.md](references/cognitive-rules.md) : fondements scientifiques, pour justifier un choix.
- `kit-charts list` et `kit-charts describe <id> --json` : métadonnées machine des 73 templates (`dataRequirements`, schéma, exemple).
