# Spec : Thèmes et polarité

Statut : livrée. Date : 2026-11-05.

## Objectif

Choisir un thème de couleurs adapté au contexte de lecture (clair, sombre, daltonisme, basse vision)
et indiquer si une hausse est bonne ou mauvaise, sans que la couleur induise le lecteur en erreur.

## Comportement attendu

- 8 thèmes, définis dans `themes/theme-tokens.js` (liste `THEME_NAMES`) : `colorbrewer-accessible` (défaut), `viridis-perceptual`, `paul-tol-scientific`, `tableau-stone-categorical`, `okabe-ito-cud`, `tufte-minimalist-executive`, `nord-cognitive-dark`, `atkinson-hyperlegible`. Un dossier `themes/0N-<nom>/` existe pour chacun.
- Un thème fournit des tokens : fond (`bg`), texte (`textPrimary`, `textSecondary`, `textMuted`), polices, grille, `palette` (8 couleurs), `sequential`, `status`, `semantic` (`positive`, `negative`, `warning`, `info`, `neutral`), couleurs d'infobulle. Seul `nord-cognitive-dark` est sombre (`isDark`).
- Le thème se donne dans la spec (`colorStrategy.themeName`). Une valeur inconnue ne produit ni erreur ni avertissement : le thème par défaut est utilisé.
- Dans une page, le thème peut venir de l'URL (`?theme=`), puis de `localStorage` (`kitcharts_theme`), puis du défaut.
- Rendu instantané : animations, survol et infobulles sans animation (0 ms) par défaut.
- Polarité (`colorStrategy.metricPolarity`) : `HIGHER_IS_BETTER`, `LOWER_IS_BETTER`, `TARGET_BASED`, `NEUTRAL_CATEGORICAL`. Toute autre valeur donne l'avertissement `INVALID_METRIC_POLARITY` (pas une erreur bloquante).
- Le linter signale `VALENCE_POLARITY_MISMATCH` (erreur bloquante) seulement si la spec porte, à la racine, un `delta` nombre et un `deltaColor` dont le texte contient un code vert ou rouge connu (`2E7D32`, `22A884`, `C62828`, `CA0020`, `green`, `red`).
- La polarité de la spec décide des couleurs du rendu (décision 0002). Les templates colorent une variation selon `formattedData.metricType` (`gain`, `cost`, `neutral`) ou, pour `kpi-status-alert`, `formattedData.polarity`. Avant de valider et de rendre, le compilateur complète ces champs depuis `metricPolarity` (fonction `applyMetricPolarity`) :
  - `HIGHER_IS_BETTER` donne `gain` (et `higher-is-better`), `LOWER_IS_BETTER` donne `cost` (et `lower-is-better`), `NEUTRAL_CATEGORICAL` donne `neutral`. `TARGET_BASED` ne change rien (les seuils du template décident).
  - Champs complétés seulement s'ils sont absents : `formattedData.metricType` à la racine, `metricType` de chaque série qui porte une valence (`valence`, `valences` ou `direction`), et `formattedData.polarity` si le template le lit. Les lignes, nœuds et indicateurs d'un tableau ou d'une carte composite gardent leur propre nature.
  - La spec d'origine n'est pas modifiée : la copie `spec.json` reste celle de l'utilisateur.
- Contradiction : `metricPolarity` qui contredit un `metricType` ou une `polarity` écrits dans les données (par exemple `LOWER_IS_BETTER` avec `metricType: 'gain'`) donne l'erreur bloquante `METRIC_POLARITY_CONFLICT`.
- Les couleurs `semantic` ne sont pas toutes vertes et rouges : `viridis-perceptual` a un positif turquoise et un négatif violet foncé.
- Contrastes : `WCAG_CONTRAST_PRIMARY` (erreur bloquante) si le texte principal du thème est sous 4.5:1 sur son fond. `WCAG_CONTRAST_SECONDARY` (avertissement) pour le texte secondaire.
- Cas d'erreur : une spec avec une erreur bloquante (contraste, polarité) fait sortir `compile` en code 1 sans rien écrire.
- Règles cognitives touchées : polarité (AGENTS.md, § 3), WCAG AA 4.5:1, rendu 0 ms.

## Hors périmètre

- Écrire ou ajouter un thème, ou des couleurs en dur dans une spec (le skill l'interdit).
- Couleurs `TARGET_BASED` dans les templates sans seuils (aucun template ne les définit aujourd'hui).
- Chargement des polices Google (`loadGoogleFonts`) et simulation de daltonisme.

## Critères d'acceptation

- [x] Test : le contraste est calculé exactement (noir sur blanc ≈ 21:1, identique 1:1, vert `#2E7D32` ≥ 4.5:1) → `test/run-integration-tests.js`, Bloc 5
- [x] Test : une hausse en rouge sous `HIGHER_IS_BETTER` est refusée (`VALENCE_POLARITY_MISMATCH`) → Bloc 4.4
- [x] Test : animations, survol et infobulles à 0 ms par défaut → Bloc 6 (`getChartDefaultOptions`, `getAnimationDuration`)
- [x] Test : un template émet une config pour chacun des 8 thèmes, sans exception, et elle ne change pas → `node test/snapshot-configs.js --check` (584 configs)
- [x] Test : 6 des 8 thèmes compilent et passent le linter, donc `WCAG_CONTRAST_PRIMARY` : `nord-cognitive-dark` (Bloc 2), `paul-tol-scientific` (Bloc 3), `tufte-minimalist-executive` (Bloc 7.1), `okabe-ito-cud` (Bloc 7.2), `tableau-stone-categorical` (Bloc 7.3), `colorbrewer-accessible` (Bloc 1)
- [ ] `viridis-perceptual` et `atkinson-hyperlegible` passent `WCAG_CONTRAST_PRIMARY` (pas de test aujourd'hui)
- [x] Test : `applyMetricPolarity` complète la racine et les séries à valence, ne touche ni une valeur écrite, ni une série sans valence, ni `TARGET_BASED`, et ne modifie pas son entrée → Bloc 15
- [x] Test : même hausse, `kpi-standard` et `bar-chart-vertical` (série à `valences`) émettent la couleur positive sous `HIGHER_IS_BETTER` et la négative sous `LOWER_IS_BETTER` → Bloc 15
- [x] Test : la page compilée sous `LOWER_IS_BETTER` porte `metricType: "cost"`, et sa copie `spec.json` reste celle de l'utilisateur → Bloc 15
- [x] Test : `kpi-status-alert` sans `polarity` dans ses données compile, avec la polarité de la spec → Bloc 15
- [x] Test : contradiction `metricPolarity` / `metricType` refusée (`METRIC_POLARITY_CONFLICT`), `compile` sort en 1 sans rien écrire → Bloc 15
- [x] Navigateur (`agent-browser`) : la même carte de facture cloud (+12 %) faite par `make` en `HIGHER_IS_BETTER` puis `LOWER_IS_BETTER` affiche son badge en vert puis en rouge, console sans erreur, captures `output/polarite-*/`
- [ ] `VALENCE_POLARITY_MISMATCH` sous `LOWER_IS_BETTER` (hausse en vert) est refusée (pas de test aujourd'hui, seul le cas `HIGHER_IS_BETTER` est testé)
- [ ] Une valeur de `metricPolarity` inconnue donne `INVALID_METRIC_POLARITY` (pas de test aujourd'hui)
- [ ] Un `themeName` inconnu est signalé (pas de test aujourd'hui, et il ne l'est pas)
- [ ] Les couleurs `semantic` ont un contraste graphique d'au moins 3:1 sur le fond (pas de test aujourd'hui : mesuré, `viridis-perceptual` positif 3.0, `paul-tol-scientific` négatif 3.1, `nord-cognitive-dark` négatif 3.1)
- [ ] Les palettes sont distinguables sous simulation de daltonisme et uniformes en CIEDE2000 (pas de test aujourd'hui : `themes/README.md` cite `test/verify-palette-uniformity.mjs`, absent du dépôt)
- [x] `npm test` passe
