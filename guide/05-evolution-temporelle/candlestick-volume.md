# Candlestick + Volume (Stacked Panels)

## 1. Fondements Scientifiques & Justification Cognitive
Le graphique en **Chandeliers Japonais + Volume** trouve son origine historique dans les travaux de **Homma Munehisa (~1750)** sur le marché du riz de Dojima, formalisé en finance moderne par **Wilder (1978)** et **Heer, Bostock & Ogievetsky (2010)**.

### Architecture Cognitive Obligatoire (Anti Double-Axe Spatiale)
Superposer le cours de bourse et le volume de transactions sur une même surface avec deux échelles Y arbitraires crée une collision visuelle sévère et induit des corrélations fallacieuses (Tufte 1983 ; Few 2008).
La règle cognitive absolue impose **deux sous-panneaux verticaux alignés partageant exactement le même axe temporel X** :
- **Panneau supérieur (70% hauteur)** : Cours boursier en chandeliers OHLC (Open, High, Low, Close).
- **Panneau inférieur (30% hauteur)** : Barres de volume de transactions + Moyenne Mobile du Volume (VMA).

### Citations Fondatrices
- **Heer, J., Bostock, M., & Ogievetsky, V. (2010)**. *A Tour Through the Visualization Zoo*. Communications of the ACM, 53(6), 59-67.
- **Wilder, J. W. (1978)**. *New Concepts in Technical Trading Systems*. Trend Research.
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.
- **Sweller, J. (1988)**. *Cognitive Load During Problem Solving*. Cognitive Science.
- **Mayer, R. E. (2001)**. *Multimedia Learning*. Cambridge University Press.

---

## 2. Formulation Mathématique Déterministe

### 2.1 Géométrie du Chandelier OHLC
Pour chaque période $t$ :
- **Mèche (*Wick*)** : Intervalle $[L_t, H_t]$
- **Corps (*Real Body*)** : $[\min(O_t, C_t), \max(O_t, C_t)]$
- **Polarité** : Hausse (*Bullish*) si $C_t \ge O_t$ ; Baisse (*Bearish*) si $C_t < O_t$.

### 2.2 Moyenne Mobile du Volume (VMA)
$$\text{VMA}_n(t) = \frac{1}{n} \sum_{i=0}^{n-1} V_{t-i}$$

---

## 3. Double-Encodage & Garde-Fous Cognitifs
1. **Valence CVD-Safe** : Couleurs de hausse et de baisse issues de `tokens.semantic.positive` et `tokens.semantic.negative` (pas de rouge/vert purs inaccessibles).
2. **Couplage temporel 1D** : Infobulle unifiée synchronisée par index (`mode: 'index'`, `axis: 'x'`).

---

## 4. Quand l'utiliser / Quand NE PAS l'utiliser

### ✅ Quand l'utiliser
- Analyse de cours financiers, actions, cryptomonnaies ou matières premières où la corrélation prix-volume valide la force d'une tendance.

### ❌ Quand NE PAS l'utiliser
- Communication financière grand public non initiée (👉 *utiliser Line Chart standard ou Area Chart*).
