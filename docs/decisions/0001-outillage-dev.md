# 0001 : Outillage de développement et dette gelée

Date : 2026-11-04. Statut : acceptée.

## Contexte

kit-charts n'avait ni linter, ni formateur, ni typage, ni consignes Claude Code. Mesure au
2026-11-04 sur `main` (24478d9) :

- Prettier : 299 fichiers sur 349 hors format.
- ESLint (recommandé) : 52 erreurs et 297 avertissements. La plupart viennent du pied UMD
  copié dans les 73 templates. Restent des vrais défauts : clé `scales` en double
  (arc-diagram, dendrogram, node-link-network), conditions toujours vraies (stacked-area-chart,
  streamgraph, validate-chart.js l. 172).
- TypeScript en `checkJs` : environ 2 100 erreurs, dont 1 900 dans les templates.

Une autre branche (`gain-tokens-export`) modifie au même moment les scripts du skill et un
template. Tout reformater ou corriger maintenant créerait des conflits sur ces fichiers et
obligerait à régénérer les 584 snapshots.

## Décision

- Outils installés en devDependencies : ESLint 10, Prettier 3, Stylelint, TypeScript 6 (pas 7 :
  il ne fournit plus `tsserver`, dont le LSP a besoin).
- Les nouvelles fautes bloquent, l'existant est gelé :
  - ESLint : `eslint-suppressions.json` (suppressions en masse d'ESLint). Une erreur de plus dans
    un fichier fait échouer le lint.
  - Prettier : le code existant est listé dans `.prettierignore`.
  - Typage : `checkJs: false`, vérification par `// @ts-check` fichier par fichier.
- Le pied UMD des templates est toléré (`no-self-assign` désactivé, `defaultData` déclaré).
- Hooks Claude Code : contrôle de chaque fichier édité, et `npm test` avant la fin d'un tour.

## Raisons

La dette se paie au fil des modifications, sans gros commit de reformatage qui masquerait
l'historique et bloquerait les branches en cours. Les règles restent strictes pour le code neuf.

## Conséquences

Ordre de remboursement, chaque étape dans son propre commit, après fusion des branches en cours :

1. Corriger les 3 clés `scales` en double et les conditions toujours vraies (spec et test d'abord).
2. Prettier dossier par dossier : retirer la ligne de `.prettierignore`, `npm run format`,
   `npm test` (les snapshots ne doivent pas bouger, ce sont des configs émises).
3. Nettoyer le pied UMD des templates, puis réactiver `no-self-assign`.
4. `// @ts-check` sur `themes/stat-helpers.js`, puis les scripts du skill.

Revenir en arrière : supprimer les fichiers de config et les devDependencies. Rien dans le code
du produit n'en dépend, et le paquet publié n'embarque que `files` de `package.json`.
