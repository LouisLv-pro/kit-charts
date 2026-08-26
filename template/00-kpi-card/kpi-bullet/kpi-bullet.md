# 🎯 KPI Card Objectif & Cible / Micro-Bullet (Stephen Few)

> **Catégorie** : `00-kpi-card`  
> **Type de composant** : Carte de pilotage d'objectifs avec micro-bullet graph linéaire  
> **Niveau de précision psychophysique** : Rang 1 (Position alignée & Longueur sur échelle commune)  
> **Temps de décodage pré-attentionnel** : $< 160 \text{ ms}$

---

## 1. Cas d'Usage Analytique

La **KPI Card Micro-Bullet** est l'étalon-or du pilotage de la performance par objectifs (Quotas commerciaux, Respect budgétaire, Engagements de niveau de service SLA, OKRs trimestriels).

Elle remplace avantageusement les jauges circulaires ("speedometers") en fournissant dans un encombrement minimal :
1. **La valeur réalisée** (Barre centrale sombre / colorée).
2. **La valeur cible** (Marqueur perpendiculaire contrasté).
3. **Les plages qualitatives** (Bandes de fond en niveaux de gris : Insatisfaisant, Satisfaisant, Optimal).

---

## 2. Fondements Scientifiques & Justifications Cognitives

### 2.1 Supériorité Psychophysique sur les Jauges (Cleveland & McGill, 1984)
- **Position & Longueur (Rang 1)** : L'œil humain évalue les distances linéaires le long d'un axe avec un exposant de Stevens $\alpha = 1.0$ (sans biais perceptif).
- **Angles & Arcs de Cercle (Rang 4)** : Les jauges circulaires souffrent d'une distorsion perceptive systématique (sous-estimation des courbures, gaspillage de 70% de la surface).

### 2.2 Ratio Data-Ink & Bandes Qualitatives
- Les plages qualitatives d'arrière-plan sont encodées par de légères nuances de luminance sans saturation chromatique vive, évitant la fatigue visuelle et laissant la barre de mesure capter l'attention principale.

---

## 3. Spécifications Techniques d'Intégration

```javascript
import { renderCard, createChart, DEFAULT_DATA } from './template.js';

renderCard(document.getElementById('kpi-container'), {
  title: 'Quota Commercial T3',
  value: 460000,
  target: 500000,
  unit: '€',
  ranges: [300000, 425000, 550000],
  footnote: 'Écart restant: -40 000 € (18 jours restants)'
}, 'colorbrewer-accessible');
```
