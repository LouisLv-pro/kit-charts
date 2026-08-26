# 🧬 KPI Card Composite / Multi-Métriques Liées (Equation Drivers)

> **Catégorie** : `00-kpi-card`  
> **Type de composant** : Carte d'arbre de rentabilité et d'équation de performance  
> **Niveau de précision psychophysique** : Rang 1 (Hiérarchie dominante Hero vs Drivers secondaires)  
> **Temps de décodage pré-attentionnel** : $< 195 \text{ ms}$

---

## 1. Cas d'Usage Analytique

La **KPI Card Composite** est conçue pour les analyses de rentabilité (arbres de DuPont) et les équations économiques ($CA = \text{Trafic} \times \text{TauxConv} \times \text{PanierMoyen}$).

Elle permet de décomposer instantanément la cause racine d'une variation sans multiplier les écrans ou les widgets distants.

---

## 2. Fondements Scientifiques & Justifications Cognitives

### 2.1 Théorie des Schémas Cognitifs (Sweller, 1988)
Le regroupement spatial de la métrique résultat avec ses 2 ou 3 variables causales permet au décideur d'intégrer le lien de dépendance en un seul bloc mnésique (*chunk*).

### 2.2 Hiérarchie Visuelle Pré-attentionnelle
- **Zone Résultat (Hero)** : 60% de la surface, typographie 32px, badge dominant.
- **Zone Drivers** : Séparation par un trait 1px, typographie compacte 14–16px avec micro-deltas individuels.

---

## 3. Spécifications Techniques d'Intégration

```javascript
import { renderCard, createChart, DEFAULT_DATA } from './template.js';

renderCard(document.getElementById('kpi-container'), {
  title: 'Chiffre d\'Affaires E-Commerce',
  value: 842500,
  unit: '€',
  delta: 18.4,
  drivers: [
    { label: 'Commandes', value: 10240, delta: 12.1, deltaUnit: '%' },
    { label: 'Panier Moyen', value: 82.27, unit: '€', delta: 5.6, deltaUnit: '%' },
    { label: 'Tx Conv.', value: 3.42, unit: '%', delta: -0.2, deltaUnit: 'pt' }
  ]
}, 'colorbrewer-accessible');
```
