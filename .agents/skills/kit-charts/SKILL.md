---
name: kit-charts
description: Produit, corrige ou audite un graphique, une carte KPI, un tableau de bord, une carte ou un tableau de données à partir de 73 templates Chart.js vérifiés (axe à zéro, polarité, contraste). À utiliser pour toute visualisation, même sans mention de kit-charts. À préférer à tout Chart.js écrit à la main.
---

# kit-charts

Un graphique est un argument : il doit transmettre un message vrai, vite, à tout le monde.
Tu ne codes aucun graphique. Une commande choisit le template, convertit les données,
compile, audite et vérifie le rendu. Ton travail porte sur ce qu'aucun script ne juge : le
message du titre, la polarité, le bon encodage.

Commande : `kit-charts` (paquet installé), ou `node bin/kit-charts.js` dans le dépôt kit-charts.

## Workflow

1. **Qualifier.** Message à faire comprendre en 5 secondes, données, polarité. Ne demande
   que ce qui bloque (aucune donnée, polarité indéterminable). Sinon applique le défaut et
   note l'hypothèse. N'invente jamais de données.
2. **Écrire les données** dans un fichier : CSV (une ligne par catégorie, une colonne par
   série) ou JSON `formattedData` pour les formes non tabulaires (KPI, Sankey, treemap...).
3. **Un appel :**

```bash
kit-charts make donnees.csv --title "Le constat en une phrase" --subtitle "Unité, périmètre, période" \
  --footnote "Source : ..." --polarity HIGHER_IS_BETTER [--intent comparison] [--export png]
```

4. **Lire la sortie** (quelques lignes) : template retenu et écartés, erreurs et
   avertissements avec leur correctif, statut du rendu, fichiers exportés. Exit 0 = livrable.
5. **Corriger sans tout refaire :** `kit-charts update output/<slug> --title "..."`
   (ou `--data`, `--template`, `--polarity`, `--export`). Sans `--data`, la source d'origine
   est relue : un fichier mis à jour chaque mois suffit. Trois échecs sur la même règle :
   le template ou l'intention est mal choisi, change-les.
6. **Relire le sens** ([review-checklist.md](references/review-checklist.md)) : recalcule le
   constat du titre depuis les données. Ouvre le PNG si tu peux le voir.
7. **Livrer** le rapport ci-dessous.

## Données : CSV vers le template

`make` lit CSV, TSV ou JSON en lignes (`[{...}, ...]`). Nombres à la française acceptés
(« 1 234,5 », « 12 % »). Par défaut : première colonne texte = catégories, colonnes
numériques = séries. Préciser au besoin :

| Données | Options | Exemple de colonnes |
| :--- | :--- | :--- |
| Catégories × séries | `--label C --value C1,C2` | `region;CA 2025;CA 2026` |
| Format long | `--series C` | `mois,agence,ventes` |
| Observations brutes | (automatique : catégories répétées) | `entrepot,delai` |
| Nuage, bulles | `--x C --y C [--r C] [--label C]` | `pays,pib,vie,pop` |
| Pont `waterfall-chart` | total de départ, variations signées, total d'arrivée | `poste;M€` |
| Planning `gantt-progress` | `--today 7` (colonnes début, fin, avancement repérées) | `chantier,debut,fin,avancement` |
| Avant / après `slope-chart` | transposé automatiquement | `agence,2023,2025` |

Ce que `make` fait seul :
- calcule les paires chaînées du waterfall ;
- calcule les quartiles d'un `box-plot` ;
- garde l'ordre des tranches d'âge et des échelles sur `bar-chart-horizontal` ;
- écarte les templates qui ne savent pas lire la forme des données.

Autres formes : `kit-charts describe <id>` donne le contrat et un exemple. Écris le JSON
`formattedData`, puis `make donnees.json --template <id> ...`.

## Choix du template

`make` recommande parmi les templates éligibles et écarte ceux qui violent une règle (ne
les reprends pas). Oriente avec `--intent` : `kpi`, `comparison`, `composition`,
`distribution`, `correlation`, `evolution`, `flow`, `hierarchy`, `geo`, `table`. Impose
avec `--template` quand la question métier tranche. Exemple : deux années sur 7 agences
donnent des barres groupées, mais si le message est le changement de rang, `slope-chart`
le montre mieux. Arbre complet : [decision-matrix.md](references/decision-matrix.md).

## Polarité métier

| Polarité | Exemples | Hausse affichée en |
| :--- | :--- | :--- |
| `HIGHER_IS_BETTER` | CA, marge, rétention, NPS, conversion | vert |
| `LOWER_IS_BETTER` | coûts, churn, latence, pannes, délais, émissions | rouge |
| `TARGET_BASED` | SLA, température, budget, stock, planning | vert dans la cible, orange en tolérance, rouge hors cible |
| `NEUTRAL_CATEGORICAL` | pays, produits, segments, canaux | aucun jugement |

En cas de doute réel (« effectifs », « volume d'appels »), `NEUTRAL_CATEGORICAL`, signalé.

## Titre

Le titre énonce le constat, pas le sujet. « CA par région » oblige à chercher ;
« L'Île-de-France pèse autant que les trois suivantes » donne la conclusion que le graphique
prouve. Unité et période vont dans `--subtitle`, la source dans `--footnote`. Les valeurs
affichées n'ont pas de suffixe : l'unité doit être dans le sous-titre ou le nom de la série.

## Pages à plusieurs graphiques, export, hors ligne

- **Page** (tableau de bord, rapport) : crée chaque graphique avec `make`, puis écris
  `output/<page>/page.json` et compile-le avec `kit-charts compile output/<page>/page.json`.

```json
{ "layout": { "title": "Le message d'ensemble", "subtitle": "...", "columns": 2 },
  "colorStrategy": { "themeName": "colorbrewer-accessible" },
  "charts": ["../ventes/spec.json", "../couts/spec.json"] }
```

  - 6 graphiques au plus, de 1 à 3 colonnes ;
  - un seul thème, celui de la page ;
  - `layout.span: 2` dans la spec d'un graphique l'élargit.
- **Export** : `--export png,svg,pdf` sur `make` et `update`, ou
  `kit-charts export page.html --format png,svg,pdf`.
  - PNG : densité 2.
  - SVG : vectoriel.
  - PDF : une page aux dimensions du contenu.
  - L'export refuse une page dont le rendu est en erreur.
- **Hors ligne** : `--offline` inclut Chart.js et ses plugins (copies vérifiées) dans la
  page, qui s'ouvre sans réseau.

## Règles et correctifs

| Règle | Correctif |
| :--- | :--- |
| `CLEVELAND_Y_ZERO` axe tronqué sur barres | Garder l'axe à zéro ; petits écarts : `dumbbell-chart`, `slope-chart`, `line-chart` |
| `NO_LOG_ON_LENGTH` log sur barres | Échelle linéaire, ou `scatter-plot` |
| `VERTICAL_BAR_MAX_CATEGORIES` plus de 7 colonnes | `bar-chart-horizontal`, ou top 6 + « Autres » |
| `MULTI_LINE_MAX_SERIES` plus de 5 courbes | Top 4 + « Autres », ou plusieurs `line-chart` |
| `PIE_DONUT_MAX_SLICES` trop de tranches (registre : pie 3, doughnut 4) | `bar-chart-horizontal` trié ou `treemap` |
| `DATALABELS_OVERCROWDING` étiquettes avec N > 12 | `--no-labels`, détail dans l'infobulle |
| `VALENCE_POLARITY_MISMATCH` | Corriger `--polarity`, jamais les couleurs à la main |
| `WCAG_CONTRAST_*` | Changer de thème (`--theme`) |
| `SCHEMA_FORMATTED_DATA` | Reprendre la forme de `kit-charts describe <id>` ; le message donne le chemin fautif |
| `DATA_LENGTH_MISMATCH` | Une valeur par catégorie, `null` si manquante |
| `PAGE_TOO_MANY_CHARTS`, `PAGE_COLUMNS` | 6 graphiques au plus, 1 à 3 colonnes |
| Avertissement `TITLE_IS_TOPIC` | Phrase avec verbe, chiffre ou comparaison |
| Avertissement `MISSING_UNIT` | Unité dans `--subtitle` ou dans le nom de la colonne |
| Avertissement `UNSORTED_BARS`, `ORDINAL_ORDER_LOST` | Trier par valeur, sauf ordre naturel à garder (et à dire) |
| Avertissement `WATERFALL_STEP_AS_TOTAL` | Paires chaînées (`make` les calcule depuis un CSV) |
| Avertissement `UNKNOWN_FIELD` | Champ mal nommé ou au mauvais niveau |

Un avertissement se corrige ou se justifie dans le rapport.

## Ne pas faire

- Écrire du Chart.js ou modifier un `template.js` pour un cas : les garanties disparaissent.
- Mettre des couleurs dans la spec : le thème gère contraste, daltonisme et polarité.
- Tronquer l'axe pour « voir les écarts » : si les écarts sont petits, c'est le message.
- Livrer une sortie `--force`.
- Totaux bruts sur une `choropleth-map` : normaliser (par habitant, en taux) ou `bubble-map`.

## Rapport

```markdown
**Graphique** : output/<slug>/index.html (+ exports)
**Template** : <id>, choisi parce que <raison en une phrase>
**Écartés** : <template> (<règle>), ...
**Hypothèses** : <défauts appliqués, ou « aucune »>
**Audit** : <0 erreur, N avertissement(s)> ; rendu <ok, ou raison> ; revue du sens <OK ou points ouverts>
```

## Pas à pas (rarement utile)

`recommend`, `describe`, `init-spec`, `compile`, `validate`, `check` restent disponibles pour
un cas que `make` ne couvre pas. Champs de la spec : [spec-contract.md](references/spec-contract.md).
Autres références, à lire seulement au besoin :
- [interaction-tooltips-animations.md](references/interaction-tooltips-animations.md) ;
- [color-semantics.md](references/color-semantics.md) ;
- [cognitive-rules.md](references/cognitive-rules.md).
