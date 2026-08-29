# Diagramme de Pareto (80/20 Rule)

## 1. Fondements Scientifiques & Justification Cognitive
Le diagramme de Pareto combine un classement catégoriel trié par fréquence décroissante et une courbe de pourcentage cumulé (Juran 1951, Pareto 1896).
Comme démontré par **Juran (1951)** dans le cadre du contrôle qualité (*Quality Control Handbook*), une minorité de causes (environ 20%, les *vital few*) produit la grande majorité des effets ou coûts (environ 80%). Le diagramme oriente directement l'attention préattentive de l'analyste vers les leviers d'action à fort impact.

### Citations Fondatrices
- **Pareto, V. (1896)**. *Cours d'économie politique*. Université de Lausanne.
- **Juran, J. M. (1951)**. *Quality Control Handbook*. McGraw-Hill.
- **Zipf, G. K. (1949)**. *Human Behavior and the Principle of Least Effort*. Addison-Wesley.
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception*. JASA, 79(387), 531-554.
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Tri et Cumul de Pareto
Soit les observations réordonnées par valeur décroissante : $x_{(1)} \ge x_{(2)} \ge \dots \ge x_{(n)}$
$$\text{Total} = \sum_{k=1}^n x_{(k)}, \quad C_i = \frac{\sum_{j=1}^i x_{(j)}}{\text{Total}} \times 100\%$$

### 2.2 Coefficient de Concentration de Gini
$$G = \frac{\sum_{i=1}^n \sum_{j=1}^n |x_i - x_j|}{2 n^2 \bar{x}}$$
- Une structure 80/20 typique correspond à un coefficient de Gini $G \gtrsim 0.60$.

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Accentuation binaire 80/20** : Les barres représentant les causes cumulant jusqu'à 80% sont accentuées en couleur vive ; les suivantes passent en couleur contextuelle désaturée.
2. **Ligne de référence 80%** : Trait pointillé net marquant le seuil critique.
3. **Zéro aligné** : L'axe gauche (effectifs) et l'axe droit (0–100%) partagent le même zéro horizontal.

---

## 4. Quand l'utiliser / Quand NE PAS l'utiliser

### ✅ Quand l'utiliser
- Analyse de causes racines, priorisation de bugs, réclamations clients, répartition du chiffre d'affaires par produit.

### ❌ Quand NE PAS l'utiliser
- Catégories ordinales ou temporelles où le tri détruirait l'ordre chronologique (👉 *utiliser Bar Chart ou Line Chart*).
- Données non sommables ou non additives.

---

## 5. Intégration Tokens
- Utilisation de `tokens.palette[0]` pour la série principale de barres.
- Accentuation binaire pour le seuil 80% via `tokens.palette[1]` ou `tokens.border`.
- Typographie `tokens.fontMono` pour les pourcentages cumulés.

---

## 6. Données de Démonstration Déterministes
- 8 causes avec distribution décroissante respectant le principe 80/20.

---

## 7. Psychophysique de l'Interaction
- Survol synchrone avec infobulle combinée affichant effectif absolu et pourcentage cumulé.

---

## 8. Règles Cognitives d'Accentuation & Valence
- Accentuation des 20% des causes critiques représentant 80% des effets.
