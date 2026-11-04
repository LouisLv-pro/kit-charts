# Spec : Templates et registre

Statut : livrée. Date : 2026-11-04.

## Objectif

Un agent ou une personne peut choisir parmi 73 templates, connaître la forme exacte des données
de chacun, et compter sur le fait que chaque template respecte la règle Y=0 et ne change pas sans
qu'on le voie.

## Comportement attendu

- Un template est un dossier `template/<famille>/<id>/` avec quatre fichiers : `template.js` (exporte `createChart` et `DEFAULT_DATA`, et `renderCard` pour les 7 cartes KPI), `template.html`, `schema.json` (contrat de données) et `preview.html`.
- Le registre (`.agents/skills/kit-charts/registry.json`) liste chaque template : `id`, `family`, `name`, `description`, `dataRequirements`, `supportedFeatures`, `paths` (les 4 fichiers). `totalTemplates` égale le nombre d'entrées (73, dans 10 familles).
- Le démonstrateur `template/tooltip/` n'est pas au registre (`NON_TEMPLATE_DIRS` dans `generate-triplets-and-registry.js`).
- Le registre fait foi pour les plafonds de catégories : `pie-chart` 3 au plus, `doughnut-chart` 4 au plus (champ `maxCategories`).
- Contrat de données : `DEFAULT_DATA` de chaque template respecte son `schema.json`. Une spec dont `formattedData` viole le schéma est une erreur bloquante (`SCHEMA_FORMATTED_DATA`), avec le chemin fautif dans le message.
- Données fournies mais incomplètes (`{}`) : le template pose `data-kc-invalid` et ne construit aucun graphique. Il ne complète jamais avec `DEFAULT_DATA`. Cela vaut pour les 18 templates qui contrôlent leurs tableaux requis.
- `layout.footnote` est rendu en pied de carte par les 73 templates, et retiré quand il est vide.
- Les textes de données sont échappés dans les cartes KPI et les tableaux (aucune balise injectée telle quelle).
- Y=0 émis : les 12 templates de `LENGTH_ENCODED_TEMPLATES` (`bar-chart-vertical`, `bar-chart-horizontal`, `grouped-bar-chart`, `stacked-bar-chart`, `stacked-bar-100`, `bar-target-overlay`, `lollipop-chart`, `bullet-chart`, `kpi-bullet`, `pareto-chart`, `waterfall-chart`, `kpi-distribution`) n'émettent jamais `beginAtZero:false`. Dès qu'un template émet des échelles, un axe est à `beginAtZero:true`, sauf `kpi-bullet` et `kpi-distribution` (gabarits DOM, exemptions documentées dans AGENTS.md).
- Snapshots : la config Chart.js de chaque template, avec son `DEFAULT_DATA`, pour chacun des 8 thèmes, est figée (73 × 8 = 584 fichiers, générateur de hasard seedé `20260914`). Tout écart fait échouer `--check`.
- Cas d'erreur : un id inconnu dans `kit-charts describe` sort en code 2 et propose des ids proches.
- Règles cognitives touchées : Y=0, pas d'échelle log sur les barres, N ≤ 7 colonnes, ≤ 5 courbes.

## Hors périmètre

- Le rendu réel des 73 templates dans Chrome (`npm run test:render`, voir validation-et-rendu).
- Le choix d'un template pour des données données (recommandeur).
- Ajouter ou retirer un template.

## Critères d'acceptation

- [x] Test : chaque dossier numéroté a son entrée au registre, chaque chemin existe, `totalTemplates` égale le nombre d'entrées → `test/run-integration-tests.js`, Bloc 6
- [x] Test : `DEFAULT_DATA` conforme à `schema.json` pour tous les templates → Bloc 12.1
- [x] Test : 5 specs fausses déclenchent `SCHEMA_FORMATTED_DATA` (chemin vérifié), `sorted: false` accepté → Bloc 12.2
- [x] Test : compilation stricte refusée sur contrat violé, `--force` produit un HTML que `validate` refuse → Bloc 12.3
- [x] Test : `formattedData` vide refusé visiblement par les templates gardés (18 aujourd'hui, compte calculé) → Bloc 12.6
- [x] Test : aucun repli champ par champ sur `DEFAULT_DATA` → Bloc 12.6
- [x] Test : `layout.footnote` rendu par tous les templates, échappé, absent si vide → Bloc 12.4
- [x] Test : aucune donnée injectée telle quelle dans les cartes KPI et tableaux → Bloc 12.4 bis
- [x] Test : `UNKNOWN_FIELD` et `DATA_LENGTH_MISMATCH` ne se déclenchent pas sur les `DEFAULT_DATA`, et se déclenchent sur des fautes de frappe (3 champs) et un décalage 2 valeurs pour 3 labels → Bloc 12.5
- [x] Test : aucun axe `beginAtZero:false` sur les 12 templates longueur, `beginAtZero:true` partout hors exemptions → Bloc 11.2 (config lue avec `DEFAULT_DATA` et le thème `colorbrewer-accessible` seulement)
- [x] Test : `describe` sur un id inconnu sort en code 2 avec des ids proches → `test/cli-smoke.js` (`npm run test:cli`, hors `npm test`)
- [x] Test : `describe` expose le schéma réel d'un template → Bloc 13 (`gantt-progress`, `tasks` requis)
- [x] Snapshots : 584 configs identiques → `node test/snapshot-configs.js --check` (`npm test`)
- [x] Test : dépendances CDN des pages compilées épinglées à une version exacte → Bloc 7.3 et Bloc 11.3
- [ ] Le registre se régénère à l'identique avec `generate-triplets-and-registry.js` (pas de test aujourd'hui)
- [ ] Y=0 émis avec des données autres que `DEFAULT_DATA` (pas de test aujourd'hui)
- [ ] Les 12 templates longueur sont bien tous les templates à encodage par longueur du registre (liste écrite à la main, pas de test aujourd'hui)
- [x] `npm test` passe
