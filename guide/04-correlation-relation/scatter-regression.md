# Scatter Plot + Régression Linéaire + IC 95%

## 1. Fondements Scientifiques & Justification Cognitive
Le diagramme de dispersion avec droite de régression et bande de confiance à 95% est le modèle de référence pour présenter une corrélation bivariée continue (Gauss, Legendre, Anscombe 1973).
Comme démontré par **Anscombe (1973)** (*Graphs in Statistical Analysis*) et **Matejka & Fitzmaurice (2017)** (*Same Stats, Different Graphs*), les coefficients statistiques ($r, R^2$) seuls sont insuffisants et peuvent masquer des structures non linéaires ou des points aberrants extrêmes (*outliers* à fort levier). La visualisation simultanée des points réels, de la droite OLS et de l'intervalle de confiance assure une transparence empirique absolue.

### Citations Fondatrices
- **Anscombe, F. J. (1973)**. *Graphs in Statistical Analysis*. The American Statistician, 27(1), 17-21.
- **Matejka, J., & Fitzmaurice, G. (2017)**. *Same Stats, Different Graphs: Generating Datasets with Varied Appearance and Identical Statistics through Simulated Annealing*. ACM CHI.
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception*. JASA.
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Moindres Carrés Ordinaires (OLS)
$$\hat{y} = \beta_0 + \beta_1 x, \quad \beta_1 = \frac{\text{Cov}(x,y)}{\text{Var}(x)}, \quad \beta_0 = \bar{y} - \beta_1 \bar{x}$$

### 2.2 Qualité d'Ajustement
$$r = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum(x_i - \bar{x})^2 \sum(y_i - \bar{y})^2}}, \quad R^2 = r^2$$

### 2.3 Bande de Confiance à 95% pour la Moyenne Prédite
$$SE(\hat{y}(x)) = s_e \sqrt{\frac{1}{n} + \frac{(x - \bar{x})^2}{\sum(x_i - \bar{x})^2}}, \quad \text{Bande} = \hat{y}(x) \pm t_{0.975, n-2} \cdot SE(\hat{y}(x))$$

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Points individuels** : Disques transparents ($\alpha = 0.75$) permettant d'observer les chevauchements.
2. **Droite de régression** : Trait plein contrasté 2.5px.
3. **Bande de confiance 95%** : Zone ombrée douce ($lpha = 0.12$) signalant l'incertitude croissante aux extrémités de l'échantillon.
