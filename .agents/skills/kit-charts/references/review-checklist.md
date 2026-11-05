# Revue experte avant livraison

Le linter garantit les règles mesurables. Cette revue couvre ce qu'il ne peut pas voir :
le sens. Un graphique peut passer `kit-charts validate` et `kit-charts check` et tromper son lecteur.

Ouvre `output/<slug>/spec.json` et vérifie chaque point. Un point en échec se corrige dans
la spec, puis on recompile.

## Message

| Contrôle | Pourquoi | Correctif |
| :--- | :--- | :--- |
| Le titre énonce un constat vérifiable dans les données (automatisé en partie : `TITLE_IS_TOPIC`) | Le lecteur retient le titre, pas l'axe | Réécrire en phrase : sujet, verbe, chiffre ou comparaison |
| Le constat du titre est vrai | Un titre faux est pire qu'un titre vague | Recalculer à partir de `formattedData` |
| Le sous-titre donne unité, périmètre et période (unité automatisée : `MISSING_UNIT`) | Sans unité, aucun chiffre n'a de sens | Compléter `layout.subtitle` |
| La source figure si elle est connue | Crédibilité et traçabilité | `layout.footnote`, rendu en pied de carte par tous les templates |

## Encodage

| Contrôle | Pourquoi | Correctif |
| :--- | :--- | :--- |
| La variable clé est encodée par position ou longueur | Précision maximale (Cleveland-McGill) | Changer de template plutôt que de garder une aire ou une teinte |
| Barres horizontales triées par valeur décroissante (automatisé : `UNSORTED_BARS`) | Le classement se lit sans effort | Automatique sur `bar-chart-horizontal` ; `"sorted": false` pour un ordre naturel ou « Autres » en dernier |
| Pas de part inférieure à 3 % isolée | Une tranche fine est invisible | Regrouper dans « Autres », en dernier |
| Bulles : z encodé par l'aire | L'œil perçoit la surface, pas le rayon | Vérifier que la donnée fournie est z, pas un rayon calculé |
| Choroplèthe : valeurs normalisées | Les grandes zones écrasent le message | Diviser par la population ou la surface, ou passer en `bubble-map` |
| Temps de gauche à droite, sans trou silencieux | Une période manquante fausse la pente | Ordonner, et signaler les périodes absentes |
| Libellés lisibles sans rotation | Un libellé incliné double le temps de lecture | `bar-chart-horizontal` ou libellés abrégés |

## Couleur et polarité

| Contrôle | Pourquoi | Correctif |
| :--- | :--- | :--- |
| La polarité suit le sens métier, pas l'enum par défaut | Une hausse de coûts en vert est un contresens | Corriger `metricPolarity` |
| Catégories arbitraires en `NEUTRAL_CATEGORICAL` | Du rouge sur un pays suggère un problème inexistant | Polarité neutre, `mode: "categorical"` |
| Aucune information portée par la seule couleur | 8 % des hommes sont daltoniens | Garder les badges ▲ ▼ et les libellés des templates |
| Thème adapté au contexte de lecture | Un thème sombre imprimé devient illisible | Voir le tableau des thèmes dans `spec-contract.md` |

## Charge et interaction

| Contrôle | Pourquoi | Correctif |
| :--- | :--- | :--- |
| Étiquettes directes selon `spec-contract.md` §4 (N ≤ 7, ou N ≤ 12 au bout de barres horizontales) | Au-delà, le texte masque la forme | `showDataLabels: false` |
| Légende masquée pour une série unique | Encre sans information (Tufte) | Le titre porte la métrique |
| Infobulle `antiOcclusion: true` et mode adapté | Ne jamais masquer le point inspecté | Voir `spec-contract.md` §4 |
| KPI : variation accompagnée de sa référence | « +12 % » ne dit rien sans « vs M-1 » | Renseigner `deltaLabel` |

## Verdict

- Tous les points passent : livrer.
- Un point échoue et se corrige dans la spec : corriger, recompiler, revalider.
- Un point échoue sans correctif possible (donnée absente, template inadapté) : livrer en
  le signalant dans « Hypothèses » ou « Audit » du rapport.
