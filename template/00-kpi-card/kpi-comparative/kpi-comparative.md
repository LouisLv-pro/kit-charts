# ⚖️ KPI Card Comparative / Multi-Période (Dual-Benchmark)

> **Catégorie** : `00-kpi-card`  
> **Type de composant** : Carte de diagnostic financier et de gestion multi-repères  
> **Niveau de précision psychophysique** : Rang 1 (Comparaison côte-à-côte alignée)  
> **Temps de décodage pré-attentionnel** : $< 190 \text{ ms}$

---

## 1. Cas d'Usage Analytique

La **KPI Card Comparative Multi-Période** permet de confronter simultanément la valeur courante ($N$) à **deux référentiels stratégiques distincts** :
1. **L'Historique Réalisé ($N-1$)** : Mesure de la croissance réelle / dynamique temporelle.
2. **Le Budget ou Plan Prévisionnel** : Mesure de l'exécution et du respect des engagements contractuels.

Elle élimine le biais de cadrage temporel unique où une progression annuelle trompeuse masquerait un retard budgétaire critique.

---

## 2. Fondements Scientifiques & Justifications Cognitives

### 2.1 Élimination du Biais d'Ancrage Unique (Tversky & Kahneman, 1974)
Un repère unique ancre artificiellement le jugement. La présentation en grille bivalente (Historique vs Budget) fournit une triangulation décisionnelle robuste.

### 2.2 Double Encodage Absolu & Relatif
Pour chaque repère, la carte présente :
- Le **delta absolu en points / monnaie** (ex: $+4.3\text{ pt}$).
- Le **delta relatif en pourcentage** (ex: $+6.7\%$).

---

## 3. Spécifications Techniques d'Intégration

```javascript
import { renderCard, createChart, DEFAULT_DATA } from './template.js';

renderCard(document.getElementById('kpi-container'), {
  title: 'Marge Brute Opérationnelle',
  value: 68.5,
  unit: '%',
  historical: { label: 'vs N-1', value: 64.2, deltaAbs: 4.3, deltaPct: 6.7 },
  budget: { label: 'vs Budget', value: 70.0, deltaAbs: -1.5, deltaPct: -2.1 },
  footnote: 'Normes comptables IFRS consolidées'
}, 'colorbrewer-accessible');
```
