# Box Plot + Strip / Jitter Plot (Box-Strip Combo)

## 1. Fondements Scientifiques & Justification Cognitive
Le combo **Box Plot + Strip Plot** répond directement aux recommandations majeures de **Weissgerber et al. (2015)** (*Beyond Bar and Line Graphs: Time for a New Data Presentation Paradigm*, PLOS Biology).
Alors que la boîte à moustaches conventionnelle (Tukey 1977) résume l'échantillon à 5 statistiques (min, Q1, médiane, Q3, max), elle masque la taille d'échantillon réelle et d'éventuelles concentrations discrètes. La superposition de points individuels jitterés de manière déterministe permet de visualiser **chaque observation sans sur-tracé**, tout en conservant les repères non paramétriques robustes.

### Citations Fondatrices
- **Tukey, J. W. (1977)**. *Exploratory Data Analysis*. Addison-Wesley.
- **Weissgerber, T. L., Milic, N. M., Winham, S. J., & Garovic, V. D. (2015)**. *Beyond Bar and Line Graphs: Time for a New Data Presentation Paradigm*. PLOS Biology, 13(4), e1002128.
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception: Theory, Experimentation, and Application*. JASA, 79(387), 531-554.
- **Cumming, G. (2012)**. *Understanding the New Statistics: Effect Sizes, Confidence Intervals, and Meta-Analysis*. Routledge.
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Résumé de Tukey Type R-7
Position continue $p = 1 + (n - 1) \cdot q$ pour $q \in \{0.25, 0.50, 0.75\}$ :
$$Q(q) = x_{(\lfloor p \rfloor)} + (p - \lfloor p \rfloor) \cdot (x_{(\lceil p \rceil)} - x_{(\lfloor p \rfloor)})$$
$$\text{IQR} = Q_3 - Q_1$$

### 2.2 Moustaches et Outliers
- Borne inférieure : $\text{LowW} = \max\left(\min(x), Q_1 - 1.5 \cdot \text{IQR}\right)$
- Borne supérieure : $\text{UpW} = \min\left(\max(x), Q_3 + 1.5 \cdot \text{IQR}\right)$
- Outlier si $x_i < \text{LowW}$ ou $x_i > \text{UpW}$.

### 2.3 Jitter Déterministe au Nombre d'Or
Pour éviter tout appel non reproductible à `Math.random()`, chaque point $i$ est décalé horizontalement via la séquence de quasi-Monte Carlo :
$$\Delta x_i = \left( (i \cdot \phi + \text{seed}) \bmod 1 - 0.5 \right) \cdot W_{\text{jitter}}$$
avec $\phi = \frac{\sqrt{5}-1}{2} \approx 0.6180339887$ et $W_{\text{jitter}} \le 0.4 \times \text{largeur boîte}$.

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Boîte interquartile** : Fond coloré transparent ($\alpha = 0.25$) et contour net 2px.
2. **Médiane contrastée** : Trait épais de 2.5px en contraste fort.
3. **Points bruts** : Disques de rayon 2.5px avec opacité 0.85 pour discerner la densité.
4. **Outliers mis en évidence** : Couleur d'anomalie (`tokens.emphasis.anomaly`) et rayon 3.5px.
5. **Indication de $n$** : Inscription tabulaire `n = XX` au-dessus de chaque groupe.

---

## 4. Quand l'utiliser / Quand NE PAS l'utiliser

### ✅ Quand l'utiliser
- Comparaison de distributions pour des échantillons petits à modérés ($10 \le n \le 200$ par groupe).
- Publications biomédicales, tests A/B, benchmarks de performances.

### ❌ Quand NE PAS l'utiliser
- Très grands échantillons ($n > 500$) où les points individuels saturent le graphique (👉 *utiliser Histogramme-KDE ou Violin Plot*).
- Échantillons minuscules ($n < 5$) où la boîte n'a pas de sens mathématique (👉 *utiliser Strip Plot pur*).

---

## 5. Intégration Tokens & Données Déterministes

```javascript
const DEFAULT_DATA = {
  labels: ['Traitement A', 'Traitement B (Optimisé)', 'Contrôle'],
  datasets: [{
    label: 'Performance Score',
    data: [
      [45, 48, 50, 52, 54, 55, 56, 58, 60, 61, 62, 64, 65, 68, 72, 75, 88],
      [58, 60, 62, 65, 66, 68, 70, 72, 73, 75, 78, 80, 82, 85, 88, 92, 95],
      [30, 35, 38, 40, 42, 43, 45, 46, 48, 50, 52, 53, 55, 58, 60, 62]
    ]
  }]
};
```
