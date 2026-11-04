---
name: corriger-bug
description: Corriger un défaut de kit-charts en commençant par un test qui le reproduit (rouge), puis le correctif (vert), puis la preuve en navigateur si le défaut est visible.
disable-model-invocation: true
argument-hint: <description du défaut, capture ou sortie d'erreur>
---

Défaut : $ARGUMENTS.

1. Reproduis-le. Graphique : compile la spec en cause et ouvre la page avec `agent-browser`
   (capture « avant » dans `output/<slug>/avant.png`). CLI : lance la commande, note code de
   sortie et message exacts.
2. Écris le test qui échoue à cause de ce défaut, dans `test/run-integration-tests.js` (bloc
   existant du sujet, ou nouveau bloc). Lance-le : il doit être rouge pour la bonne raison.
   Défaut de rendu sans test possible en Node : un critère dans la spec concernée de
   `docs/specs/`, rejoué par `verificateur-haiku`.
3. Corrige au plus simple. Rien hors du défaut : une autre anomalie remarquée va dans le bilan.
4. `npm run check`. Template touché : `npm run snapshots` et relis le diff (seuls les templates du
   défaut doivent bouger).
5. Défaut visible : capture « après » au même endroit, et envoie-moi les deux (SendUserFile).
6. Si la spec du sujet ne décrivait pas ce comportement, complète-la.
