# Prix + Overlays Indicateurs (SMA & Bandes de Bollinger)

## 1. Fondements Scientifiques & Justification Cognitive
Le combo **Prix + Overlays Indicateurs** est le standard analytique pour l'étude de séries temporelles avec volatilité et tendance (Bollinger 1980s, Wilder 1978).

### Garde-Fou Cognitif Strict : Maximum 3 Couches Visuelles
Conformément aux limites de la mémoire de travail humaine (**Miller 1956** : $7 \pm 2$ chunks ; **Mayer 2001** : principe de cohérence cognitive), superposer plus de 3 indicateurs simultanés génère un bruit visuel toxique (*cognitive clutter*).
Ce template limite strictement l'affichage à :
1. **La série principale des prix** (Hero).
2. **La tendance centrale lissée** (Moyenne Mobile Simple - SMA).
3. **Le canal de volatilité à $\pm 2\sigma$** (Bandes de Bollinger en halo translucide).

### Citations Fondatrices
- **Bollinger, J. (2001)**. *Bollinger on Bollinger Bands*. McGraw-Hill.
- **Wilder, J. W. (1978)**. *New Concepts in Technical Trading Systems*. Trend Research.
- **Miller, G. A. (1956)**. *The Magical Number Seven, Plus or Minus Two*. Psychological Review.
- **Mayer, R. E. (2001)**. *Multimedia Learning*. Cambridge University Press.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Moyenne Mobile Simple (SMA)
$$\text{SMA}_n(t) = \frac{1}{n} \sum_{i=0}^{n-1} P_{t-i}$$

### 2.2 Bandes de Bollinger ($\pm 2\sigma$)
$$\text{Upper}_t = \text{SMA}_n(t) + 2 \cdot \sigma_n(t), \quad \text{Lower}_t = \text{SMA}_n(t) - 2 \cdot \sigma_n(t)$$
où $\sigma_n(t) = \sqrt{\frac{1}{n}\sum_{i=0}^{n-1} (P_{t-i} - \text{SMA}_n(t))^2}$.

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Halo de volatilité** : Remplissage doux $\alpha = 0.10$ entre les bornes supérieure et inférieure.
2. **Courbe de prix Hero** : Trait plein d'épaisseur 2.5px.
3. **Contrainte 3 couches** : Aucune surcharge d'indicateurs secondaires superflus.
