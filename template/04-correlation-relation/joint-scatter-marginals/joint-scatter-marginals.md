# Scatter Plot + Distributions Marginales (Jointplot)

## 1. Fondements Scientifiques & Justification Cognitive
Le graphique conjoint associe un nuage de points bivarié central et les projections marginales 1D de chaque variable le long des axes (Tufte 1983, Silverman 1986).
En statistique multivariée, analyser uniquement les marges ($X$ et $Y$ séparément) peut masquer des corrélations fortes, tandis qu'analyser le scatter seul sans les densités marginales dissimule la présence de sous-populations multimodales sur un seul des axes.

### Citations Fondatrices
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.
- **Silverman, B. W. (1986)**. *Density Estimation for Statistics and Data Analysis*.
- **Pearson, K. (1896)**. *Mathematical Contributions to the Theory of Evolution*. Phil. Trans. R. Soc.
- **Heer, J., Bostock, M., & Ogievetsky, V. (2010)**. *A Tour Through the Visualization Zoo*. ACM.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Distributions Marginales
$$f_X(x) = \int f(x,y) dy, \quad f_Y(y) = \int f(x,y) dx$$

### 2.2 Ellipse de Confiance Bivariée à 95%
$$(x - \mu)^T \Sigma^{-1} (x - \mu) \le \chi^2_2(0.95) \approx 5.991$$
où $\Sigma = \begin{pmatrix} \sigma_x^2 & \sigma_{xy} \\ \sigma_{xy} & \sigma_y^2 \end{pmatrix}$ est la matrice de covariance empirique.

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Points 2D** : Observation directe des paires individuelles.
2. **Ellipse 95%** : Zone de covariance gaussienne pour apprécier la dispersion bidirectionnelle.
3. **Rubans marginaux** : Trajectoires KDE continues intégrées aux bordures du canvas.
