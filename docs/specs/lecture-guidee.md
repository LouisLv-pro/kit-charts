# Spec : Lecture guidée (mise en avant, distributions, finitions)

Statut : livrée. Date : 2026-11-06.

## Objectif

Le graphique produit par `make` montre d'emblée ce que dit son titre : l'élément cité ressort,
une distribution à deux paquets se voit, aucun détail n'invente ou ne répète une information.
L'agent obtient ce résultat sans écrire une option de plus.

## Comportement attendu

### Mise en avant (règle 90/10, `cognitive-rules.md`)

- La spec accepte `cognitiveFeatures.focus` : le libellé d'une catégorie (ou d'une série, pour
  `slope-chart` et `multi-line-chart`). À la compilation, cet élément prend la couleur
  `emphasis.focal` du thème, les autres la couleur `emphasis.context` (gris).
  Exemple : « Lille passe de la 6e à la 1re place » : la ligne de Lille en bleu, les six autres en gris.
- Templates concernés : `bar-chart-vertical`, `bar-chart-horizontal`, `lollipop-chart`,
  `polar-area-chart`, `pie-chart`, `doughnut-chart` (focusIndex déjà lu), `box-plot`,
  `violin-plot`, `box-strip-plot` (par catégorie), `slope-chart`, `multi-line-chart`
  (par série).
- `make` déduit la mise en avant du titre : si le titre cite exactement un libellé (casse et
  accents ignorés), il est mis en avant et la sortie l'annonce par une ligne `note :`.
  `--focus "<libellé>"` l'impose, `--focus aucun` l'enlève. `update` garde le choix, et
  recalcule la déduction quand le titre change.
- Libellé absent des données : erreur `FOCUS_UNKNOWN_LABEL`, avec la liste des libellés.
  Template qui ne sait pas mettre en avant : avertissement `FOCUS_UNSUPPORTED`.
- `box-plot`, `violin-plot`, `box-strip-plot` sans mise en avant : une seule couleur. Les
  groupes sont déjà nommés sur l'axe, une couleur par groupe n'apporte rien.

### Distributions à deux paquets

- Sur des observations brutes, un groupe est « à deux paquets » quand, valeurs triées, le plus
  grand écart entre deux valeurs voisines vaut au moins 25 % de l'étendue et laisse au moins
  25 % des points (3 au minimum) de chaque côté. Exemple : Saint-Priest, 21 à 27 h puis 49 à 60 h.
- Le recommandeur classe alors `violin-plot` en tête (la forme montre les deux bosses).
  Sinon, avec moins de 30 observations dans chaque groupe, `box-strip-plot` (chaque point reste
  visible). Sinon `box-plot`, comme avant.
- `box-plot` sur un groupe à deux paquets : avertissement `BOX_PLOT_HIDES_MODES`.

### Finitions

- Les courbes relient leurs points par des segments droits (`tension: 0`), sauf `streamgraph`
  dont le lissage est le principe. Un arrondi suggère des valeurs entre deux mesures.
- Libellés « Mois Année » d'une même année : l'année n'est affichée qu'au premier mois et à
  chaque changement d'année (`Jan 2024, Fév, Mar…`), sur `line-chart`, `multi-line-chart`,
  `area-chart`, `stacked-area-chart`.
- Titre d'axe masqué quand l'unité entre parenthèses du nom de série figure déjà dans le
  sous-titre (`CA 2024 (M€)` sous « Chiffre d'affaires 2024, en M€ »), sur
  `bar-chart-vertical` et `bar-chart-horizontal`.
- `slope-chart` affiche autant de décimales que les données (au plus 2) : `84` et non `84,0`.
- `waterfall-chart` n'ajoute plus « M€ » en dur aux valeurs, à l'infobulle et à l'axe.

### Sortie plus courte pour l'agent

- Une erreur de schéma sur le nombre de libellés ou de séries n'est plus répétée quand une règle
  cognitive signale la même cause (`VERTICAL_BAR_MAX_CATEGORIES`, `PIE_DONUT_MAX_SLICES`,
  `MULTI_LINE_MAX_SERIES`).
- Les correctifs de `CLEVELAND_Y_ZERO`, `VALENCE_POLARITY_MISMATCH`, `WCAG_CONTRAST_*` et
  `DATALABELS_OVERCROWDING` donnent l'option de `make` à utiliser. La table « Règles et
  correctifs » de `SKILL.md`, devenue redondante, est retirée.

- Règles cognitives touchées : 90/10 (focus + contexte), encodage redondant, Cleveland (aucun
  changement d'axe), WCAG (contrastes du thème inchangés).

## Hors périmètre

- Plusieurs éléments mis en avant à la fois (« Apple et Samsung… » : aucune mise en avant).
- Réduire le poids des pages : les 8 thèmes ne pèsent que 13 Ko des 167 Ko de
  `theme-tokens.js` ; le reste sert la galerie (animations). Gain trop faible pour le risque.
- Contraste 3:1 des éléments gris de contexte (`#94A3B8`, 2,6:1) : les valeurs restent lisibles
  par les étiquettes, le token du thème n'est pas modifié ici.

## Critères d'acceptation

- [x] Test : `applyFocus` place `focusIndex` ou les rôles focal/contexte selon le template, libellé inconnu refusé → `test/run-integration-tests.js`, Bloc 16
- [x] Test : `make` met en avant le libellé cité par le titre, `--focus aucun` l'enlève → Bloc 16
- [x] Test : `findModeGap` sur fixtures (Saint-Priest oui, Gonesse et Vitrolles non) ; recommandeur : violon en tête, box-strip pour petits groupes ; `BOX_PLOT_HIDES_MODES` → Bloc 16
- [x] Test : aucune courbe émise avec `tension > 0` (hors `streamgraph`), année compactée, titre d'axe redondant masqué, décimales du slope, pas de « M€ » en dur → Bloc 16
- [x] Test : une seule erreur pour 9 colonnes sur `bar-chart-vertical` → Bloc 16
- [x] Snapshots : `npm run snapshots` puis diff relu
- [x] Rendu réel et captures avant/après sur les cas d'eval
- [x] `npm test` passe, `npm run bench` ne coûte pas plus
