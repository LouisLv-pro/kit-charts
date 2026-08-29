# Bar Chart + Marqueur de Cible (Target Overlay)

## 1. Fondements Scientifiques & Justification Cognitive
Le combo **Bar Chart + Target Overlay** permet de comparer précisément une série de réalisations réelles à des objectifs fixes par catégorie (Cleveland & McGill 1984, Stephen Few 2005).
Plutôt que d'aligner deux barres côte à côte (barres groupées) qui doublent l'encombrement spatial et obligent à une comparaison d'intervalles décalés, le marqueur transversal (tick) superposé sur la barre permet un jugement immédiat d'atteinte d'objectif en position absolue.

### Citations Fondatrices
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception*. JASA.
- **Few, S. (2005)**. *Bullet Graph Design Specification*. Perceptual Edge.
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Écart Relatif à l'Objectif
$$\Delta = \text{Réalisé} - \text{Cible}, \quad \Delta\% = \frac{\text{Réalisé} - \text{Cible}}{\text{Cible}} \times 100\%$$

### 2.2 Classification de Performance
- **Succès** ($\Delta \ge 0$) : Vert accessible (`status.success`).
- **Vigilance** ($-10\% \le \Delta\% < 0\%$) : Orange (`status.warning`).
- **Critique** ($\Delta\% < -10\%$) : Rouge accessible (`status.danger`).

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Marqueur de cible proéminent** : Trait perpendiculaire de 3px débordant légèrement de la barre.
2. **Annotation numérique directe** : Delta en pourcentage affiché en chiffres tabulaires (`fontMono`).
3. **Double encodage de valence** : Couleur de statut + libellé chiffré explicite avec signe.

---

## 4. Quand l'utiliser / Quand NE PAS l'utiliser

### ✅ Quand l'utiliser
- Suivi de budgets, KPI commerciaux avec objectifs fixes, indicateurs de performance annuelle.

### ❌ Quand NE PAS l'utiliser
- Comparaison sans cible explicite prédéfinie.
- Séries temporelles longues avec tendance continue.

---

## 5. Intégration Tokens
- Barres tracées avec `tokens.palette[0]`.
- Marqueur d'objectif superposé avec `tokens.textPrimary`.
- Valeurs de delta en `tokens.fontMono`.

---

## 6. Données de Démonstration Déterministes
- 6 pays européens avec montants réalisés et objectifs budgétaires.

---

## 7. Psychophysique de l'Interaction
- Infobulle informative indiquant le réalisé, la cible et l'écart absolu/relatif.

---

## 8. Règles Cognitives d'Accentuation & Valence
- Valence tricolore sémantique selon l'atteinte d'objectif (succès, vigilance, critique).
