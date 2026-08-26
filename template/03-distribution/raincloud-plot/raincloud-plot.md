# Raincloud Plot (Half-Violin + Box + Rain Strip)

## 1. Fondements Scientifiques & Justification Cognitive
Le **Raincloud Plot** a été formalisé par **Allen, Poggiali, Whitaker, Marshall & Kievit (2019)** (*Raincloud plots: a multi-platform tool for robust data visualization*, Wellcome Open Research).
Il s'agit du compromis ergonomique et statistique ultime pour représenter des distributions continues :
1. **Le nuage (*Cloud*)** : Demi-KDE gaussien asymétrique montrant la forme continue et la multimodalité sans redondance bilatérale.
2. **Le parapluie (*Umbrella*)** : Micro-boîte à moustaches de Tukey synthétisant médiane et quartiles.
3. **La pluie (*Rain*)** : Points individuels jitterés révélant l'échantillon brut réel ($n$) et les groupements locaux.

### Citations Fondatrices
- **Allen, M., Poggiali, D., Whitaker, K., Marshall, T. R., & Kievit, R. A. (2019)**. *Raincloud plots: a multi-platform tool for robust data visualization*. Wellcome Open Research, 4, 63.
- **Weissgerber, T. L. et al. (2015)**. *Beyond Bar and Line Graphs*. PLOS Biology.
- **Cumming, G. (2012)**. *Understanding the New Statistics*. Routledge.
- **Silverman, B. W. (1986)**. *Density Estimation for Statistics and Data Analysis*.
- **Mayer, R. E. (2001)**. *Multimedia Learning*. Cambridge University Press.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Demi-KDE Gaussien Asymétrique
$$\hat{f}_{\text{half}}(x) = \frac{1}{n \cdot h} \sum_{i=1}^n K\left(\frac{x - x_i}{h}\right) \quad \text{pour } x \ge x_{\text{center}}$$

### 2.2 Bande Passante de Silverman
$$h = 0.9 \cdot \min\left(\sigma, \frac{\text{IQR}}{1.34}\right) \cdot n^{-1/5}$$

### 2.3 Disposition Spatiale Anti-Occlusion (Kievit 2019)
- $X_{\text{cloud}} = X_{\text{center}} + w(x) \cdot W_{\max}$
- $X_{\text{box}} = X_{\text{center}} \pm 4\text{px}$
- $X_{\text{rain}} = X_{\text{center}} - \Delta_{\text{jitter}}$

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Élimination de la redondance symétrique** : Le demi-violon utilise 50% d'espace en moins qu'un violon classique, laissant la place aux observations individuelles.
2. **Points déterministes** : Jitter calculé au nombre d'or ($\phi \approx 0.618$).
3. **Indication de $n$** : Libellé explicite au sommet de chaque colonne.

---

## 4. Quand l'utiliser / Quand NE PAS l'utiliser

### ✅ Quand l'utiliser
- Rapports de recherche scientifique, publications cliniques, comparaisons d'algorithmes et d'expériences utilisateur.
- Échantillons de 15 à 300 observations par groupe.

### ❌ Quand NE PAS l'utiliser
- Tableaux de bord très compacts (< 300px) ou très grands volumes (> 1000 observations).

---

## 5. Données de Démonstration Déterministes

```javascript
const DEFAULT_DATA = {
  labels: ['Cohorte Contrôle', 'Cohorte Variante A', 'Cohorte Variante B'],
  datasets: [{
    label: 'Engagement Score (0-100)',
    data: [
      [35, 38, 42, 45, 46, 48, 50, 52, 53, 55, 56, 58, 60, 62, 65, 68, 70],
      [48, 52, 55, 58, 60, 62, 65, 68, 70, 72, 75, 78, 80, 82, 85, 88, 92],
      [25, 28, 30, 32, 35, 38, 40, 72, 75, 78, 80, 82, 85, 88, 90, 94, 96]
    ]
  }]
};
```
