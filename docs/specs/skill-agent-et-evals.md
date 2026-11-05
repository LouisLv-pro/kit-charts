# Spec : Skill, agent dataviz et evals

Statut : livrée. Date : 2026-11-04.

## Objectif

Un agent IA reçoit une demande de graphique en langage courant et livre une page conforme aux règles
cognitives, en suivant un workflow fixe. Une personne peut installer ce workflow dans son projet.

## Comportement attendu

- Le skill `kit-charts` (`.agents/skills/kit-charts/SKILL.md`) impose 7 étapes : qualifier, choisir le template (`kit-charts recommend`), lire le contrat (`describe`), écrire la spec (`init-spec`), compiler, valider (`validate`, `check`, revue experte), livrer.
- Il s'arrête après 3 échecs de compilation sur la même règle et revient au choix du template. `--force` ne produit jamais un livrable.
- Le rapport de livraison tient en 5 lignes : Graphique, Template, Écartés, Hypothèses, Audit.
- L'agent `dataviz` (`.agents/agents/dataviz.md`, outils `Read, Write, Edit, Bash, Glob, Grep`) fait seul trois postures : qualifier, construire, auditer. Il ne peut pas interroger l'utilisateur : il déduit, applique les défauts du skill et note chaque hypothèse.
- Ce qui ne se négocie pas, même sur demande explicite : axe à zéro, pas d'échelle log sur les barres, polarité respectée, contraste WCAG AA, aucune donnée inventée, aucune sortie `--force` livrée.
- `kit-charts install-skill [--dir D] [--force]` copie `SKILL.md`, `references/` et l'agent dans `D/.claude/skills/kit-charts/` et `D/.claude/agents/dataviz.md` (`D` = dossier courant par défaut). Les scripts, le registre et les evals restent dans le paquet npm.
- Si le skill ou l'agent existe déjà et que `--force` manque : message d'erreur, code de sortie 2, rien n'est écrasé.
- Le paquet npm (`files` de `package.json`) ne contient pas `evals/`. Les evals ne servent que dans le dépôt.
- Une eval est un dossier `.agents/skills/kit-charts/evals/<cas>/` avec trois parties :
  - `case.yaml` : `schema_version: "1.1"`, `name`, `expected_outcome` (le résultat attendu, en prose).
  - `prompt.md` : en-tête (`tags: [kit-charts]`, `max_turns: 30`, `timeout_seconds: 900`, `allowed_tools`) puis la demande de l'utilisateur, en langage courant.
  - `graders/NN-<critère>.md` : un critère par fichier, `type: llm`, `focus: trace`, `weight: 1`.
- Les 9 cas, 40 critères en tout : `axe-tronque-refuse`, `classement-satisfaction-agences-2023-2025` (slope-chart), `couts-cloud-polarite-inverse` (line-chart), `delais-livraison-observations-brutes-par-entrepot` (violin-plot), `kpi-mrr-avec-reference` (kpi-standard), `neuf-regions-bascule-horizontal` (bar-chart-horizontal), `parts-de-marche-trop-de-tranches`, `planning-migration-crm-taches-et-avancement` (gantt-progress), `pont-ebit-variations-en-paires-chainees` (waterfall-chart).
- Règles cognitives touchées : Y=0, N ≤ 7, polarité (par les cas d'eval), toutes par le workflow.

## Hors périmètre

- Lancer les evals (`claude plugin eval`, hors de `npm test`).
- Les anciens sous-agents (remplacés par l'agent unique).
- Écrire de nouvelles evals.

## Critères d'acceptation

- [x] Test : `install-skill` copie le skill et l'agent, les liens `references/` du skill installé existent, un second appel sans `--force` sort en code 2 → `test/cli-smoke.js` (`npm run test:cli`, hors `npm test`)
- [x] Test : le parcours `list`, `describe`, `init-spec`, `compile` fonctionne depuis un dossier hors dépôt (le skill s'appuie sur la commande `kit-charts`) → `test/run-integration-tests.js`, Bloc 13
- [x] Test : le squelette de `init-spec` n'est pas compilable tant qu'il n'est pas rempli (aucune donnée d'exemple ne part) → Bloc 13
- [x] Test : un `compile` sur spec non conforme sort en code 1 sans écrire de fichier → Bloc 10
- [ ] Chaque cas d'eval a un `case.yaml`, un `prompt.md` et au moins 3 critères dans `graders/` (pas de test aujourd'hui, vérifié à la main : 9 cas, 40 critères, tous `type: llm`)
- [ ] Les evals passent avec l'agent `dataviz` (pas de test aujourd'hui : aucun script ne les lance, `claude plugin eval` est manuel)
- [ ] Le format des evals est valide (`schema_version`, champs du `prompt.md`) (pas de test aujourd'hui)
- [ ] `install-skill --dir D` et `--force` fonctionnent (pas de test aujourd'hui, seuls le cas par défaut et le refus sont couverts)
- [ ] Le skill et l'agent installés contiennent le même texte que `.agents/` (pas de test aujourd'hui, seule l'existence et les liens sont vérifiés)
- [ ] Les règles de la table « Règles bloquantes » de `SKILL.md` portent la bonne gravité : `DATALABELS_OVERCROWDING`, `INVALID_METRIC_POLARITY` et `WCAG_CONTRAST_SECONDARY` sont des avertissements dans le code (pas de test aujourd'hui, écart connu)
- [x] `npm test` passe
