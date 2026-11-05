# Spec : <Nom de la fonctionnalité>

Statut : brouillon | validée | livrée. Date : AAAA-MM-JJ.

## Objectif

<Une phrase : ce que l'utilisateur (une personne ou un agent IA) peut faire.>

## Comportement attendu

- <Règle ou cas nominal, avec le vocabulaire de docs/glossary.md>
- <Cas d'erreur : message affiché, code de sortie>
- Règles cognitives touchées : <Y=0, N ≤ 7, polarité, WCAG… ou « aucune »>

## Hors périmètre

- <Ce qui ne sera pas fait maintenant>

## Critères d'acceptation

Chaque critère nomme sa preuve. Une preuve doit pouvoir échouer (AGENTS.md, § Discipline).

- [ ] Test : <comportement> → `test/run-integration-tests.js`, Bloc <N> (écrit avant le code, vu rouge)
- [ ] Snapshots : `npm run snapshots` puis diff relu (seulement si un template change)
- [ ] Rendu réel : `node bin/kit-charts.js check output/<slug>/index.html` passe
- [ ] Navigateur (`agent-browser`) : <geste, puis résultat attendu à l'écran>, console sans erreur,
      capture `output/<slug>/verif-<n>.png`
- [ ] Eval (si le comportement de l'agent change) : cas dans `.agents/skills/kit-charts/evals/<cas>/`
- [ ] `npm run check` et `npm test` passent
