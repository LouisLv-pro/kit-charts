# 0002 : La polarité de la spec décide des couleurs

Date : 2026-11-05. Statut : acceptée.

## Contexte

AGENTS.md § 3 fait de `colorStrategy.metricPolarity` la règle métier des couleurs : une hausse de
coûts n'est jamais verte. Pourtant aucun des 73 `template.js` ne lisait ce champ. Les templates
colorent selon `formattedData.metricType` (`gain` par défaut) ou, pour `kpi-status-alert`,
`formattedData.polarity`. Une facture cloud en hausse, déclarée `LOWER_IS_BETTER`, s'affichait
donc en vert.

## Décision

- Le compilateur traduit `metricPolarity` en `metricType` (et `polarity`) avant la validation et
  le rendu, seulement là où les données ne le disent pas déjà (`applyMetricPolarity`).
- Une contradiction entre `metricPolarity` et une valeur écrite dans les données est une erreur
  bloquante, `METRIC_POLARITY_CONFLICT`.

## Raisons

- Un seul endroit à changer (le compilateur) au lieu de 44 templates : moins de risque, et les
  584 snapshots (rendus sans compilateur) ne bougent pas.
- La valeur écrite dans les données reste prioritaire quand elle est cohérente : un tableau
  peut mêler des lignes de revenus et de coûts, chacune avec sa nature.
- Refuser la contradiction plutôt que trancher en silence : l'une des deux valeurs est fausse, et
  seul l'auteur sait laquelle.

## Conséquences

- `make --polarity` et `compile` colorent enfin selon la polarité déclarée.
- Une spec existante qui contredisait sa polarité ne compile plus : message et correctif cités.
- Revenir en arrière : retirer l'appel à `applyMetricPolarity` et la règle dans `validate-chart.js`.
