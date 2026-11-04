---
name: nouvelle-feature
description: Faire évoluer kit-charts (template, thème, règle, commande du CLI, galerie) à partir d'une idée, en passant par une spec validée, des tests écrits avant le code et une preuve en navigateur.
disable-model-invocation: true
argument-hint: <idée de fonctionnalité ou spec existante>
---

Fonctionnalité : $ARGUMENTS. Le cycle est toujours le même : spec, tests rouges, code, preuves.

## 1. Spec (spec-driven)

Rédige ou complète une spec dans `docs/specs/` à partir de `docs/specs/_template.md`, avec le
vocabulaire de `docs/glossary.md` (un concept nouveau y entre d'abord). Une évolution d'une spec
existante modifie cette spec, plutôt que d'en créer une nouvelle.
Pour explorer du code que tu ne vas pas modifier, lance l'agent `Explore` avec
`model: "haiku"` : il ne renvoie que sa conclusion.
Un choix difficile à défaire (format de spec, nouvelle dépendance CDN, règle cognitive ajoutée ou
assouplie) donne d'abord `docs/decisions/NNNN-<sujet>.md` (modèle `_template.md`).
Pose-moi les questions dont la réponse change le périmètre, puis attends ma validation.

## 2. Tests d'abord (test-driven)

Spec validée : délègue à l'agent `test-writer`. Il ajoute un bloc à
`test/run-integration-tests.js` et montre la sortie rouge. Relis ses tests contre AGENTS.md
(§ Discipline des tests) : chacun doit pouvoir échouer sur un bug réaliste.
Si le comportement de l'agent `dataviz` change (choix de template, refus d'une demande), ajoute
aussi un cas d'eval dans `.agents/skills/kit-charts/evals/<cas>/` sur le modèle des cas existants.

## 3. Implémentation

Délègue à l'agent `implementeur` (Sonnet ; `model: opus` seulement après un échec de Sonnet sur
le même brief, à noter dans le bilan). Le brief nomme la spec, les fichiers, le bloc de tests et
la commande de vérification. Après son retour, relance toi-même `npm run check` en sortie
résumée (`tail -5`) : ne te fie pas au rapport.
Template modifié : `npm run snapshots`, puis relis le diff de `test/__snapshots__/` toi-même.

## 4. Preuves (eval-driven)

Compile un exemple réel : `node bin/kit-charts.js compile output/<slug>/spec.json`, puis
`node bin/kit-charts.js check output/<slug>/index.html` (rendu réel dans Chrome).
Fais rejouer les critères « Navigateur » de la spec par l'agent `verificateur-haiku` (cinq
scénarios au plus par agent). Brief : la page (`file://…/index.html` pour la galerie, ou
`output/<slug>/index.html`), le dossier des captures (`output/<slug>/`), les scénarios
numérotés tirés de la spec. Ne pilote pas le navigateur toi-même : les captures resteraient
dans ton contexte.
À son retour, ouvre les captures des scénarios KO et une capture d'ensemble. Un défaut repart
vers le même implémenteur par `SendMessage`, avec la capture.
Agent `reviewer` sur le diff avant le commit. Si le skill a changé, lance les evals concernés.

## 5. Bilan

Coche les critères vérifiés dans la spec et passe son statut à « livrée ». Envoie-moi les
captures (SendUserFile). Liste ce qui n'a pas pu être vérifié. Commit seulement si je le demande.
