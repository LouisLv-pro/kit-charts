# kit-charts : consignes de développement

`AGENTS.md` (chargé aussi) porte les règles cognitives non négociables, l'agent `dataviz` et la
discipline des tests. Ce fichier ajoute la façon de développer le kit lui-même.

Écriture : jamais de tiret cadratin (virgule, point, deux points ou parenthèses). Phrases
courtes. Textes visibles par l'utilisateur : sans jargon, avec un exemple métier. Ne jamais lire
ni modifier un fichier `.env` : demander la valeur.

## Où est quoi

- Vue d'ensemble : `docs/architecture.md`. Vocabulaire : `docs/glossary.md` (un concept, un
  seul mot, dans le code, la galerie et les specs).
- Specs : `docs/specs/<sujet>.md` (modèle `_template.md`). Décisions : `docs/decisions/NNNN-*.md`.
- Skill et agent du produit : `.agents/` (source). `.claude/skills/kit-charts` et
  `.claude/agents/dataviz.md` sont des liens vers cette source : ne jamais lancer
  `kit-charts install-skill` dans ce dépôt.

## Façon de travailler (specs, tests, evals)

1. Spec d'abord. Chaque évolution a sa spec dans `docs/specs/`, validée par moi avant le code.
   Son périmètre est le livrable : un bug ou une amélioration hors périmètre se signale à la fin.
2. Test rouge ensuite. Le test qui prouve le critère est écrit et vu échouer avant le code
   (Blocs de `test/run-integration-tests.js`, règles d'AGENTS.md § Discipline).
3. Code le plus simple qui passe. Une abstraction se justifie par un besoin actuel.
4. Preuve de bout en bout. Compiler un exemple réel, `kit-charts check` dessus, l'ouvrir avec
   `agent-browser`, console sans erreur, captures envoyées. Un changement de comportement de
   l'agent `dataviz` se prouve par les evals (`.agents/skills/kit-charts/evals/`).

Skills : `/nouvelle-feature` (cycle complet), `/corriger-bug` (test qui reproduit, puis
correctif). Agents : `test-writer`, `implementeur`, `verificateur-haiku` (navigateur, captures),
`reviewer`.
Quand je pose une question ou décris un problème, donne ton analyse et attends.
Une seule session par dossier de travail : sinon un worktree git par session.
Doc d'une lib (Chart.js, plugins, d3) : Context7 avant de répondre de mémoire.

## Commandes

- `npm run check` : tout vérifier sans rien modifier (format, lint, typecheck, tests, snapshots).
- `npm test` (environ 10 s : intégration, parcours `make`, snapshots, benchmark de tokens).
- `npm run test:render` (73 templates dans Chrome, réseau), `npm run test:export` (PNG, SVG, PDF),
  `npm run test:cli` (paquet installé), `npm run bench` (coût en tokens).
- Parcours par défaut d'un graphique : `node bin/kit-charts.js make data.csv --title … --polarity …`.
- `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run typecheck`.
- `npm run snapshots` : seulement après un changement voulu d'un template, puis relire le diff.
- `npm run build` : régénère `catalog-bundle.js` (fichier généré, à ne pas éditer).
- CLI sans installation : `node bin/kit-charts.js <commande>`.
- Galerie : ouvrir `index.html` en `file://`, ou `python3 -m http.server 8123 --bind 127.0.0.1`.
- GitHub : skill `gh`.

## Qualité

Crée et modifie les fichiers avec Edit et Write, jamais par Bash : les hooks ne voient que ces
outils. Après chaque édition, un hook formate (Prettier), lint (ESLint, Stylelint) et audite
toute spec ou page de `output/` (`validate-chart.js`). Avant la fin d'un tour, un hook relance
ESLint et `npm test` si du code a changé (pas en phase rouge, quand seuls des tests ont changé).
Corrige ce qu'ils remontent, et rapporte honnêtement ce qui échoue.

Dette gelée, à ne pas aggraver (`docs/decisions/0001-outillage-dev.md`) :

- ESLint : erreurs existantes gelées dans `eslint-suppressions.json`. Une erreur nouvelle bloque.
  Après une correction, `npm run lint:prune`.
- Prettier : le code existant est listé dans `.prettierignore`. Migration par dossier, un commit
  dédié chacun.
- Typage : `jsconfig.json` sert le LSP (navigation, survol) sans vérifier les fichiers. Un fichier
  entre dans `npm run typecheck` avec `// @ts-check` en tête ; tout nouveau script Node l'a.
