# Spec : Validation d'une spec ou d'une page, et contrôle du rendu réel

Statut : livrée. Date : 2026-11-04.

## Objectif

Savoir si un graphique respecte les règles cognitives et WCAG, et s'il s'affiche vraiment. `validate` lit la spec ou la page, `check` ouvre la page dans Chrome.

## Comportement attendu

- `validate-chart.js` (`kit-charts validate <fichier>`) accepte une spec `.json`, une page `.html` ou un `.js`. Pour une page compilée, il relit `customData`, `options` et `themeName` dans son script. Le contrat de données n'est vérifié que si `customData` est retrouvé en entier.
- Rapport : `valid`, `errorsCount`, `warningsCount`, `errors`, `warnings`, `summary`, `targetFile`. Chaque entrée a `ruleId`, `category`, `severity` (`ERROR` ou `WARNING`), `message`, `suggestion`. `valid` est vrai s'il n'y a aucune erreur. `--json` affiche le rapport seul.
- Erreurs (bloquent) : `SCHEMA_FORMATTED_DATA` (données contre le `schema.json` du template), `CLEVELAND_Y_ZERO` (`beginAtZero: false` sur un encodage de longueur), `NO_LOG_ON_LENGTH`, `VERTICAL_BAR_MAX_CATEGORIES` (N > 7), `MULTI_LINE_MAX_SERIES` (> 5 séries), `PIE_DONUT_MAX_SLICES` (> 7 tranches), `WCAG_CONTRAST_PRIMARY` (texte principal sous 4,5:1 sur le fond du thème), `VALENCE_POLARITY_MISMATCH`, `INVALID_SPEC_STRUCTURE`, `FILE_NOT_FOUND`, `JSON_SYNTAX_ERROR`.
- Avertissements (ne bloquent pas) : `UNKNOWN_TEMPLATE_ID`, `UNKNOWN_FIELD`, `DATA_LENGTH_MISMATCH` (sauf templates à `dataPerLabel: false`), `WATERFALL_STEP_AS_TOTAL`, `DATALABELS_OVERCROWDING` (étiquettes avec N > 12), `WCAG_CONTRAST_SECONDARY`, `INVALID_METRIC_POLARITY`, `REDUCED_MOTION_GUARD` (page ou JS sans `prefers-reduced-motion`).
- `VALENCE_POLARITY_MISMATCH` ne se déclenche que sur une spec JSON qui porte `delta` et `deltaColor` à la racine : hausse en rouge sous `HIGHER_IS_BETTER`, hausse en vert sous `LOWER_IS_BETTER`.
- `--strict` : tout avertissement compte comme une erreur, `valid` passe à faux.
- Codes de sortie : 0 conforme, 1 sinon. Sans argument, l'aide s'affiche et le code est 0.
- `render-check.js` (`kit-charts check <page.html...>`) ouvre chaque page dans Chrome headless (`--dump-dom`, 10 s de temps virtuel, 45 s maximum, 4 pages en parallèle) et lit `data-kc-render` : `ok`, `invalid` (données refusées, `data-kc-invalid`) ou `error` (avec `data-kc-error`). Sans statut, c'est `error`.
- Chrome est cherché dans `CHROME_PATH`, les emplacements usuels, puis le `PATH`. Le réseau est requis (CDN).
- `check --all-templates [--only id1,id2]` compile chaque template avec son `DEFAULT_DATA` dans un dossier temporaire, supprimé si tout passe. `--json` donne `total`, `failed`, `results`.
- Codes de `check` : 0 tout est rendu, 1 au moins un échec, 2 Chrome introuvable ou aucune page donnée.
- Règles cognitives touchées : Y=0, pas de log sur les longueurs, N ≤ 7, ≤ 5 courbes, parts ≤ 7, polarité, WCAG AA.

## Hors périmètre

- `check` ne juge pas le sens (titre, polarité choisie) : c'est la revue de `review-checklist.md`.
- `FORBIDDEN_EASINGS` est exporté mais aucune règle ne l'utilise.
- Pas de capture d'écran ni de contrôle visuel du rendu.

## Critères d'acceptation

Chaque critère nomme sa preuve.

- [x] `CLEVELAND_Y_ZERO`, `VERTICAL_BAR_MAX_CATEGORIES`, `MULTI_LINE_MAX_SERIES`, `NO_LOG_ON_LENGTH` déclenchées chacune par une spec fautive, `valid` faux → `test/run-integration-tests.js`, Bloc 4
- [x] `VALENCE_POLARITY_MISMATCH` : hausse rouge sous `HIGHER_IS_BETTER` → Bloc 4 (la branche `LOWER_IS_BETTER` n'est pas testée)
- [x] `SCHEMA_FORMATTED_DATA` sur 5 formes fausses, aucune sur les `DEFAULT_DATA` des templates du registre → Bloc 12
- [x] `UNKNOWN_FIELD` (3 fautes), `DATA_LENGTH_MISMATCH`, `WATERFALL_STEP_AS_TOTAL` ; aucun `DEFAULT_DATA` ne les déclenche → Bloc 12
- [x] L'audit de la page compilée retrouve la violation de schéma, sans fausse alerte sur une page conforme → Bloc 12
- [x] Pages compilées conformes (KPI, barres, courbes, bullet) : `valid` vrai → Blocs 1, 2, 7
- [x] Y=0 vérifié à l'émission sur les templates à longueur → Bloc 11
- [x] Calcul du contraste WCAG (21:1, 1:1) → Bloc 5 (la règle `WCAG_CONTRAST_*` elle-même n'est pas testée)
- [x] Un template reçoit `{}` : `data-kc-invalid` posé, aucun graphique construit → Bloc 12
- [x] `validate` sur une page compilée sort 0 avec `valid: true` ; `check` : `failed: 0` (si Chrome) → `test/cli-smoke.js` (`npm run test:cli`)
- [x] Rendu réel des 73 templates → `npm run test:render` (Chrome et réseau, hors `npm test`)
- [ ] `PIE_DONUT_MAX_SLICES`, `DATALABELS_OVERCROWDING`, `INVALID_METRIC_POLARITY`, `UNKNOWN_TEMPLATE_ID`, `REDUCED_MOTION_GUARD` (pas de test aujourd'hui)
- [ ] `WCAG_CONTRAST_PRIMARY` et `WCAG_CONTRAST_SECONDARY` (pas de test aujourd'hui)
- [ ] `INVALID_SPEC_STRUCTURE`, `FILE_NOT_FOUND`, `JSON_SYNTAX_ERROR` (pas de test aujourd'hui)
- [ ] `--strict` fait échouer sur un avertissement ; exit 1 sur spec invalide en CLI (pas de test aujourd'hui)
- [ ] `check` : exit 1 sur statut `invalid` ou `error`, exit 2 sans Chrome, lecture de `data-kc-render` (`parseRenderStatus`) (pas de test aujourd'hui)
