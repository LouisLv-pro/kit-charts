# Waterfall + Ligne Cumulée (Waterfall-Cumulative Line)

## 1. Fondements Scientifiques & Justification Cognitive
Le diagramme Waterfall enrichi d'une ligne de trajectoire cumulée permet de suivre la réconciliation budgétaire pas-à-pas (pont de variance) tout en visualisant le niveau de solde instantané à chaque étape (Tufte 1983, Heer & Robertson 2007).
Alors que le waterfall simple encode les variations isolées par la hauteur relative des barres flottantes, l'œil humain peine à interpoler mentalement la pente du chemin cumulé. La ligne de cumul continu fournit un encodage par position directe (niveau 1 de Cleveland & McGill).

### Citations Fondatrices
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.
- **Heer, J., & Robertson, G. G. (2007)**. *Animated Transitions in Statistical Data Graphics*. IEEE TVCG.
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception*. JASA.
- **Mayer, R. E. (2001)**. *Multimedia Learning*. Cambridge University Press.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Solde et Bornes Flottantes
$$R_0 = \text{Départ}, \quad R_i = R_{i-1} + \Delta_i, \quad \text{Barre}_i = [\min(R_{i-1}, R_i), \max(R_{i-1}, R_i)]$$

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Valence sémantique** : Gains en vert (`semantic.positive`), pertes en rouge (`semantic.negative`), totaux en couleur focale.
2. **Ligne de cumul continue** : Trait continu 2.5px contrasté reliant les sommets des soldes.
