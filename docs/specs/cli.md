# Spec : CLI kit-charts

Statut : livrée. Date : 2026-11-04.

## Objectif

Une personne ou un agent IA pilote tout le parcours (recommander, décrire, compiler, valider, vérifier) avec une seule commande `kit-charts`, depuis n'importe quel dossier.

## Comportement attendu

- Point d'entrée : `bin/kit-charts.js`. Les templates, thèmes et scripts viennent du paquet. Les specs et les sorties restent dans le dossier courant (`output/`).
- `recommend`, `compile`, `validate`, `check` délèguent au script correspondant (`recommend-template.js`, `compile-chart.js`, `validate-chart.js`, `render-check.js`) en gardant ses arguments, sa sortie et son code de sortie. Voir les specs `recommandeur`, `compilation`, `validation-et-rendu`.
- `describe <id>` affiche le schéma de `formattedData` et l'exemple `DEFAULT_DATA` du template. `--json` donne `id`, `family`, `name`, `description`, `dataRequirements`, `formattedDataSchema`, `example`.
- `init-spec <id>` écrit une spec squelette : `targetTemplateId`, `layout` vide, thème `colorbrewer-accessible`, infobulle avec `antiOcclusion`, et une forme de données vide (jamais de données d'exemple). Options : `--data`/`-d` (fichier ou JSON en ligne), `-o`/`--output` (défaut `output/<id>/spec.json`), `--force`. Elle liste ce qu'il reste à compléter et les écarts au schéma (`SCHEMA_FORMATTED_DATA`), puis sort en 0.
- `init-spec` refuse d'écraser un fichier existant sans `--force` : exit 2.
- `list [--family F]` liste les templates du registre (filtre par sous-chaîne de la famille). `--json` donne `id`, `family`, `name`, `dataRequirements`.
- `install-skill [--dir D]` copie `SKILL.md`, `references/` et l'agent `dataviz.md` dans `D/.claude/` (défaut : dossier courant). Sans `--force`, refuse si la cible existe : exit 2.
- `--version` / `-v` affiche la version de `package.json`. `help`, `--help`, `-h` affichent l'aide.
- Codes de sortie du CLI lui-même : 0 conforme, 1 non conforme ou erreur, 2 usage ou prérequis manquant.
  - exit 2 : aucune commande (l'aide s'affiche), commande inconnue, id de template manquant (`describe`, `init-spec`) ou inconnu (avec des ids proches), cible déjà présente.
  - Les commandes déléguées gardent le code du script : `recommend` sans argument sort en 1, `validate` sans argument affiche l'aide et sort en 0, `check` sans page sort en 2.
- Règles cognitives touchées : aucune (le CLI orchestre, les règles sont dans `validate`).

## Hors périmètre

- `make`, `update` et `export` (ajoutés par la PR #3, testés par `test/workflow-tests.js` et `test/export-tests.js`) : spec à écrire, `docs/specs/parcours-make.md`.
- Pas de lecture de la spec par `describe` : il décrit un template, pas une spec.
- Pas de code de sortie 2 uniforme : les scripts délégués gardent le leur (voir ci-dessus).

## Critères d'acceptation

Chaque critère nomme sa preuve.

- [x] `list --json` renvoie autant de templates que le registre → `test/run-integration-tests.js`, Bloc 13
- [x] `init-spec` écrit la spec dans le dossier courant, et sa compilation est refusée tant que le squelette est vide (exit 1, `SCHEMA_FORMATTED_DATA`, aucun fichier écrit) → Bloc 13
- [x] `compile` écrit la page dans le dossier courant ; sans `-o`, la sortie va dans `output/` du dossier courant → Bloc 13
- [x] `describe gantt-progress --json` expose le vrai schéma (`tasks` requis) → Bloc 13
- [x] Le CLI installé (`npm pack`, `install -g`) fait le parcours complet depuis un dossier hors dépôt → `test/cli-smoke.js` (`npm run test:cli`, hors `npm test`)
- [x] `describe` sur un id inconnu : exit 2 avec suggestions → `test/cli-smoke.js`
- [x] `install-skill` copie skill et agent, les liens `references/` résolvent, il refuse d'écraser (exit 2) → `test/cli-smoke.js`
- [ ] Commande inconnue et appel sans commande : exit 2 (pas de test aujourd'hui)
- [ ] `init-spec` refuse d'écraser sans `--force` : exit 2 (pas de test aujourd'hui)
- [ ] `list --family`, `describe` en texte, `--version`, `install-skill --dir` (pas de test aujourd'hui)
- [ ] `recommend`, `validate` et `check` transmettent le code de sortie du script (seul `compile` est vu, Bloc 13)
