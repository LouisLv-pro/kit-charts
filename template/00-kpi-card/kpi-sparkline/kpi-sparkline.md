# 📈 KPI Card avec Sparkline / Micro-Tendance

> **Catégorie** : `00-kpi-card`  
> **Type de composant** : Carte d'indicateur avec trajectoire temporelle continue haute densité  
> **Niveau de précision psychophysique** : Rang 1 (Chiffre Hero) & Rang 4 (Pente / Continuité de Tufte)  
> **Temps de décodage pré-attentionnel** : $< 180 \text{ ms}$

---

## 1. Cas d'Usage Analytique

La **KPI Card avec Sparkline** est indispensable dès lors qu'une métrique est sujette à la volatilité, à la saisonnalité ou aux micro-cycles (ex: Taux de conversion e-commerce, Trafic en temps réel, Consommation mémoire/CPU, Taux de churn, Volume d'appels entrants).

Elle enrichit la valeur instantanée en répondant à la question critique :
> *"Cette valeur est-elle un pic accidentel, un creux passager ou le résultat d'une tendance structurelle ?"*

---

## 2. Fondements Scientifiques & Justifications Cognitives

### 2.1 Le Concept de Sparkline d'Edward Tufte (2006)
- **Définition** : Micro-graphique à très haute densité d'information, dépourvu d'axes et de graduations encombrantes.
- **Data-Ink Ratio Maximal** : 100% des pixels de la sparkline représentent la trajectoire de la donnée.
- **Élimination de l'Effet d'Attention Divisée (Split-Attention Effect)** : La tendance temporelle est contiguë à la valeur numérique, évitant les allers-retours oculaires vers un grand graphique lointain.

### 2.2 Lois de la Gestalt & Continuité Visuelle
- **Loi de Continuité** : Le cortex visuel trace naturellement la ligne de projection future sans rupture cognitive.
- **Loi de Connectivité Élémentaire** : Les points $T_{\min}$, $T_{\max}$ et $T_{\text{actuel}}$ sont perçus comme une entité unifiée.

### 2.3 Marqueurs Stratégiques Tufte
- **Point Actuel ($T_{\text{fin}}$)** : Marqueur plein de 4px à fort contraste (`tokens.emphasis.focal`).
- **Extrema ($T_{\min}$ et $T_{\max}$)** : Annotations légères en périphérie pour situer immédiatement les bornes de volatilité sans encombrer la zone de tracé.

---

## 3. Spécifications Techniques d'Intégration

```javascript
import { renderCard, createChart, DEFAULT_DATA } from './template.js';

renderCard(document.getElementById('kpi-container'), {
  title: 'Taux de Conversion E-Commerce',
  value: 3.84,
  unit: '%',
  delta: 0.8,
  deltaLabel: 'vs moyenne 30j (3.04%)',
  metricType: 'gain',
  history: [2.9, 3.1, 3.0, 3.4, 3.2, 3.6, 3.5, 3.3, 3.7, 3.9, 3.6, 3.84]
}, 'colorbrewer-accessible');
```
