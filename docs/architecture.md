# Architecture de kit-charts

Vue d'ensemble de ce qui existe. Le détail est dans `AGENTS.md` et dans `docs/specs/`.

## Dossiers

- `template/` : les graphiques, rangés par famille (`00-kpi-card` à `09-tableaux-dataviz`). Un dossier par template, avec `template.js`, `template.html`, `schema.json` et `preview.html`. `template/tooltip/` est un démonstrateur, hors registre.
- `themes/` : les 8 thèmes (`theme-tokens.js`), les calculs statistiques (`stat-helpers.js`) et les données de carte (`world-atlas.js`).
- `.agents/` : l'agent `dataviz`, le skill `kit-charts` (`SKILL.md`, `registry.json`, `references/`, `evals/`, `scripts/`), les règles et `hooks.json`.
- `bin/kit-charts.js` : le CLI, qui délègue aux scripts de `.agents/skills/kit-charts/scripts/`.
- `test/` : `run-integration-tests.js` (blocs 1 à 13), `snapshot-configs.js` (filet de configs), `cli-smoke.js` (CLI installé).
- `output/` : les specs et pages produites (ignoré par git).
- `index.html` : le catalogue visuel. Il charge `catalog-bundle.js`, fichier généré par `npm run build` (`build-bundle.js`) à partir du registre. Ne pas l'éditer à la main.
- `docs/` : cette vue, les specs de rattrapage (`docs/specs/`) et les revues.

## Flux

1. `recommend` : le profil des données borne le choix du template.
2. `describe` et `init-spec` : la forme de `formattedData` est montrée, une `spec.json` squelette est écrite.
3. `compile` : la spec est auditée puis assemblée en `index.html` autonome. Une spec non conforme est refusée (exit 1, rien n'est écrit).
4. `validate` : audit cognitif, WCAG et contrat de données.
5. `check` : rendu réel dans Chrome headless, statut `data-kc-render`.

`npm test` lance les tests d'intégration puis la vérification des snapshots. Le rendu réel des 73 templates est à part : `npm run test:render`.

## Sources uniques

- `registry.json` : la liste des 73 templates, leurs chemins et leurs `dataRequirements`. Généré par `generate-triplets-and-registry.js`. Le recommandeur, le compilateur, le validateur, le CLI et le bundle le lisent.
- `vendor-pins.js` : les URL CDN à version exacte et les plugins par template. Le compilateur s'en sert, un test les compare aux previews.
- `theme-tokens.js` : couleurs, polarités, options Chart.js par défaut (animation désactivée).
- `stat-helpers.js` : quantiles, moyenne, Student, intervalle à 95 %.

## Format des templates

Chaque `template.js` est un module UMD : il s'exporte avec `module.exports` sous Node, avec `define` en AMD, ou comme `KitCharts['<id>']` dans le navigateur. Il expose `createChart` (ou `renderCard` pour les cartes KPI) et `DEFAULT_DATA`. Le même fichier tourne donc dans une page, dans Node (tests, snapshots) et dans le bundle.
