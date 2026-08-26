# Histogramme + Densité KDE (Histogram-KDE Combo)

## 1. Fondements Scientifiques & Justification Cognitive
L'histogramme combiné à l'estimation de densité par noyau (*Kernel Density Estimation* — KDE) réunit le décompte empirique d'échantillon et la modélisation probabiliste continue sur un même axe de mesure partagé.
Comme démontré par **Silverman (1986)** et **Freedman & Diaconis (1981)**, l'histogramme seul souffre d'artéfacts de discrétisation dépendant de l'origine et de la largeur des classes. Le tracé de la courbe KDE gaussienne supprime ces effets de découpage et révèle la véritable distribution sous-jacente (multimodalité, queues épaisses).

### Citations Fondatrices
- **Rosenblatt, M. (1956)**. *Remarks on Some Nonparametric Estimates of a Density Function*. The Annals of Mathematical Statistics, 27(3), 832-837.
- **Parzen, E. (1962)**. *On Estimation of a Probability Density Function and Mode*. The Annals of Mathematical Statistics, 33(3), 1065-1076.
- **Silverman, B. W. (1986)**. *Density Estimation for Statistics and Data Analysis*. Chapman and Hall / CRC.
- **Scott, D. W. (1979)**. *On optimal and data-based histograms*. Biometrika, 66(3), 605-610.
- **Freedman, D., & Diaconis, P. (1981)**. *On the histogram as a density estimator: L2 theory*. Zeitschrift für Wahrscheinlichkeitstheorie und verwandte Gebiete, 57(4), 453-476.
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception: Theory, Experimentation, and Application to the Development of Graphical Methods*. JASA, 79(387), 531-554.
- **Mayer, R. E. (2001)**. *Multimedia Learning*. Cambridge University Press.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Largeur de Classe de Freedman-Diaconis (1981)
$$h_{\text{bin}} = 2 \cdot \text{IQR} \cdot n^{-1/3}$$
- $\text{IQR} = Q_3 - Q_1$
- Si $\text{IQR} = 0$, règle de Scott : $h_{\text{bin}} = 3.49 \cdot \sigma \cdot n^{-1/3}$.

### 2.2 KDE Gaussien Univarié
$$\hat{f}(x) = \frac{1}{n \cdot h} \sum_{i=1}^n K\left(\frac{x - x_i}{h}\right), \quad K(u) = \frac{1}{\sqrt{2\pi}} e^{-u^2 / 2}$$

### 2.3 Bande Passante Optimale de Silverman (1986)
$$h = 0.9 \cdot \min\left(\sigma, \frac{\text{IQR}}{1.34}\right) \cdot n^{-1/5}$$

### 2.4 Alignement d'Échelle (Count-Scaled Density)
Pour superposer la courbe KDE sur l'axe des effectifs sans double axe trompeur :
$$g(x) = \hat{f}(x) \cdot n \cdot h_{\text{bin}}$$

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Histogramme contextuel** : Barres avec opacité modérée ($\alpha \approx 0.35$) pour ne pas masquer la trajectoire continue.
2. **Courbe KDE Hero** : Trait plein d'épaisseur 2.5px en couleur focale (`tokens.emphasis.focal` ou palette contrastée).
3. **Axe Y unique** : Échelle d'effectifs réels (pas de second axe non aligné).
4. **Infobulle duale** : Affiche à la fois l'effectif observé et la densité théorique locale.

---

## 4. Quand l'utiliser / Quand NE PAS l'utiliser

### ✅ Quand l'utiliser
- Analyse de distribution continue où l'on souhaite vérifier l'adéquation empirique à un modèle théorique (normalité, asymétrie, bimodalité).
- Échantillons modérés à grands ($n \ge 30$).

### ❌ Quand NE PAS l'utiliser
- Très petits échantillons ($n < 30$) où le KDE produit des modes parasites (👉 *utiliser Strip Plot ou Beeswarm Plot*).
- Données strictement discrètes ou catégorielles (👉 *utiliser Bar Chart*).

---

## 5. Intégration Tokens & Options
- Barres : `hexToRgba(tokens.palette[0], 0.35)`.
- Courbe KDE : `tokens.emphasis.focal || tokens.palette[1]`.
- Typographie : `tokens.fontFamily` et `tokens.fontMono`.

---

## 6. Données de Démonstration Déterministes

```javascript
const DEFAULT_DATA = {
  datasets: [{
    label: 'Temps de Réponse API (ms)',
    data: [
      42, 45, 48, 50, 52, 53, 55, 56, 58, 59, 60, 61, 62, 63, 65, 66,
      68, 70, 71, 72, 73, 75, 76, 78, 80, 82, 85, 88, 92, 95, 110, 115,
      120, 125, 130, 132, 135, 138, 140, 142, 145, 148, 150, 155, 160, 175
    ]
  }]
};
```

---

## 7. Recommandations d'Implémentation Chart.js

```javascript
import { createChart } from './template.js';
const chart = createChart('chartCanvas', null, 'colorbrewer-accessible');
```

---

## 8. Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle (Ratio 90/10)
- **KDE (Hero)** : Trait plein contrasté 2.5px.
- **Barres de fréquence (Contexte)** : Remplissage léger $\alpha \le 0.35$.
