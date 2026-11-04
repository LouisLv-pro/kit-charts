# Spec : Recommandeur de templates

Statut : livrée. Date : 2026-11-04.

## Objectif

À partir de données (ou de quelques chiffres), un agent obtient les templates éligibles, ceux qui sont écartés avec la raison, et un candidat recommandé. Le recommandeur borne le choix, il ne remplace pas le jugement.

## Comportement attendu

- Script : `recommend-template.js` (`kit-charts recommend`). Entrée : fichier JSON, JSON en ligne, ou une spec complète (il lit `formattedData`). Sans données, on peut donner le profil à la main : `--n`, `--series`, `--labels-type`, `--max-label-length` (ils surchargent le profil mesuré).
- Profil mesuré (`profileData`) : nombre de catégories `categoryCount`, nombre de séries `seriesCount`, longueur du plus long libellé, `labelsType` (`categorical`, `temporal`, `continuous`, `none`), valeurs négatives, somme égale à 100 (ou 1), plus petite part en %, présence d'une série « cible » (cible, target, objectif, budget, goal, quota).
- Intention : `--intent`/`-i` parmi `kpi`, `comparison`, `composition`, `distribution`, `correlation`, `evolution`, `flow`, `hierarchy`, `geo`, `table`. Sans option, elle est déduite : valeur seule → `kpi`, libellés temporels (80 % ou plus) → `evolution`, points `x`/`y` → `correlation`, somme à 100 → `composition`, sinon `comparison`. Un avertissement demande de la confirmer.
- Chaque intention a une liste ordonnée de templates (`INTENT_ORDER`, tirée de `decision-matrix.md`). Le score de départ baisse de 5 par rang.
- Un template est écarté (`rejected`, avec ses raisons) si le profil sort de `dataRequirements` du registre (N, nombre de séries), si une règle cognitive le refuse, ou s'il lui manque des séries (cible, avant et après).
- Règles cognitives appliquées : colonnes verticales N ≤ 7 et libellés ≤ 12 caractères, une seule série ; camembert et anneau N ≤ 7 et une seule série ; `multi-line-chart` ≤ 5 séries ; `line-chart` écarté si plusieurs séries ; aires refusées avec valeurs négatives ; repli sur `bar-chart-horizontal` si une composition a plus de 7 parts.
- Bonus de score : série cible (`bar-target-overlay`, `bullet-chart`), plusieurs séries (`grouped-bar-chart`, `multi-line-chart`), barres horizontales si N > 7 ou libellés longs.
- Sortie : `intent`, `intentSource` (`explicit` ou `inferred`), `profile`, `recommended`, `eligible`, `rejected`, `warnings`. `--json` pour un agent.
- Avertissements : part inférieure à 3 % (regrouper en « Autres »), plus de 5 séries en évolution, libellés temporels en comparaison, intention déduite.
- Codes de sortie : 0 si un template est recommandé, 1 si aucun (ou intention inconnue, ou aucun argument).
- Règles cognitives touchées : N ≤ 7 en colonnes, ≤ 5 courbes, parts de camembert ≤ 7.

## Hors périmètre

- Il ne lit pas la polarité métier ni le thème.
- Il ne vérifie pas la forme de `formattedData` (c'est `validate`, règle `SCHEMA_FORMATTED_DATA`).

## Critères d'acceptation

Chaque critère nomme sa preuve.

- [x] 9 régions à libellés longs : `bar-chart-horizontal` recommandé, `bar-chart-vertical` écarté → `test/run-integration-tests.js`, Bloc 9 (ne distingue pas N > 7 de libellés longs, les deux sont vrais)
- [x] 4 catégories courtes : `bar-chart-vertical` → Bloc 9
- [x] Réalisé et cible : `bar-target-overlay` → Bloc 9
- [x] 3 séries annuelles : `multi-line-chart` recommandé, `line-chart` écarté → Bloc 9
- [x] 11 parts d'un tout : `bar-chart-horizontal` en repli, `doughnut-chart` écarté → Bloc 9
- [x] Valeur seule : `kpi-standard` (intention déduite) → Bloc 9
- [x] 8 séries temporelles : aucun recommandé, `multi-line-chart` écarté → Bloc 9
- [x] Tous les ids de `INTENT_ORDER` existent au registre → Bloc 9
- [ ] Libellés longs seuls (N ≤ 7) écartent `bar-chart-vertical` (pas de test aujourd'hui)
- [ ] Valeurs négatives écartent aires, camembert et empilé 100 % (pas de test aujourd'hui)
- [ ] Bornes `minCategories`, `maxCategories`, `seriesCount` du registre (pas de test aujourd'hui)
- [ ] Les 4 avertissements (pas de test aujourd'hui)
- [ ] Déduction d'intention : temporel, `x`/`y`, somme à 100 (pas de test aujourd'hui, seul le cas `kpi` est vu)
- [ ] Intention inconnue : message et exit 1 ; aucun candidat : exit 1 (pas de test aujourd'hui)
