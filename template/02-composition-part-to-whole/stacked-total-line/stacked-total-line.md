# Barres Empilées + Ligne de Total (Stacked Total Combo)

## 1. Fondements Scientifiques & Justification Cognitive
Le combo **Barres Empilées + Ligne de Total** permet de répondre au paradoxe perceptif des graphiques empilés identifié par **Skau & Kosara (2016)** (*Arcs, Angles, or Areas: Individual Data Encodings in Pie and Donut Charts*, EuroVis) et **Heer & Robertson (2007)**.
Dans un empilement classique, seul le segment inférieur est aligné sur une ligne de base commune ($Y=0$). Les segments supérieurs subissent la gigue des composantes inférieures, rendant l'appréciation du total macro fastidieuse. La superposition d'une ligne de total sommée résout cette charge cognitive.

### Citations Fondatrices
- **Skau, D., & Kosara, R. (2016)**. *Arcs, Angles, or Areas: Individual Data Encodings*. EuroVis.
- **Heer, J., & Robertson, G. G. (2007)**. *Animated Transitions in Statistical Data Graphics*. IEEE TVCG.
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.
- **Miller, G. A. (1956)**. *The Magical Number Seven, Plus or Minus Two*. Psychological Review.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Somme Consolidée Macro
$$T(t) = \sum_{k=1}^K S_k(t)$$
où $S_k(t)$ représente le montant du segment $k$ à la période $t$.

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Ligne de Total Hero** : Trait plein épais (3px) avec marqueurs discrets contrastés.
2. **Ordre stable des segments** : Préservation stricte de l'ordre des couches dans le temps (*Object Constancy*).
3. **Infobulle consolidée** : Détail des parts individuelles et total calculé dans le footer.
