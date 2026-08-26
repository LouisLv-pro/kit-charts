# Double Axe Y Normalisé (Dual-Axis Controlled)

## 1. Fondements Scientifiques & Justification Cognitive
Le graphique à double axe Y est historiquement documenté depuis **Croxton & Stryker (1927)** mais constitue **le template le plus sujet aux manipulations perceptives et aux erreurs d'interprétation** (Few 2008, Franconeri et al. 2021).

### ⚠️ Risque Majeur : Corrélations Fallacieuses (*Spurious Correlations*)
Ajuster manuellement les minima et maxima de deux axes indépendants permet visuellement de faire coïncider deux courbes arbitraires sans aucun lien causal sous-jacent.
Pour neutraliser ce biais, ce template impose **5 garde-fous cognitifs stricts et non négociables** :
1. **Titrage explicite et unités sur chaque axe**.
2. **Appariement chromatique strict** : Chaque axe Y prend exactement la couleur de la courbe qu'il mesure.
3. **Zéro horizontal aligné** sur les deux échelles lorsque les grandeurs sont positives.
4. **Calcul et affichage transparent du coefficient de Pearson $r$**.
5. **Normalisation déterministe** (Base 100 ou z-score).

### Citations Fondatrices
- **Croxton, F. E., & Stryker, R. E. (1927)**. *Bar Charts Versus Circle Diagrams*. JASA, 22(160), 473-482.
- **Few, S. (2008)**. *Dual-Scaled Axes in Graphs: Are They Ever Warranted?*. Perceptual Edge.
- **Franconeri, S. L., Padilla, L. M., Shah, P., Zacks, J. M., & Hullman, J. (2021)**. *The Science of Visual Data Communication*. Psychological Science in the Public Interest, 22(3), 110-161.
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Index Base 100
$$I_i(t) = \frac{s_i(t)}{s_i(t_0)} \times 100$$

### 2.2 Coefficient de Pearson
$$r = \frac{\sum_{t=1}^n (z_{1,t} \cdot z_{2,t})}{n - 1}, \quad z_{i,t} = \frac{x_{i,t} - \bar{x}_i}{\sigma_i}$$

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Axe Gauche** : Titre et graduations dans la couleur de la Série 1.
2. **Axe Droit** : Titre et graduations dans la couleur de la Série 2.
3. **Zéro partagé** : Ligne de base $Y=0$ commune.
4. **Infobulle indicée** : Rappel du coefficient $r$ à chaque survol.
