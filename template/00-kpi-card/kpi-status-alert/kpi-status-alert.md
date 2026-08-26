# 🚨 KPI Card Statut & Seuil d'Alerte (Multi-State RAG)

> **Catégorie** : `00-kpi-card`  
> **Type de composant** : Carte de supervision opérationnelle et de monitoring critique  
> **Niveau de précision psychophysique** : Rang 1 (Position du curseur sur la réglette de seuil)  
> **Temps de décodage pré-attentionnel** : $< 130 \text{ ms}$

---

## 1. Cas d'Usage Analytique

La **KPI Card Statut & Seuil d'Alerte** répond en priorité absolue à la question de sécurité opérationnelle :
> *"Le système fonctionne-t-il dans une plage nominale, d'attention ou de danger critique ?"*

Elle s'applique au monitoring d'infrastructure IT (latence P99, taux d'erreur HTTP 5xx, charge CPU), au contrôle qualité industriel, aux ratios de solvabilité bancaire et aux seuils réglementaires.

---

## 2. Fondements Scientifiques & Justifications Cognitives

### 2.1 Double Encodage Sémantique & Accessibilité Daltonisme
- Le statut ne repose jamais uniquement sur la couleur :
  1. **Icône explicite** : `✓ Nominal` / `⚠️ Attention` / `⛔ Critique`.
  2. **Teinte sémantique** calculée par `getThresholdStatus()`.
  3. **Pointeur spatial** sur la jauge linéaire de seuils.
- Respecte la polarité métier (`lower-is-better` pour les temps de latence vs `higher-is-better` pour les taux de disponibilité).

---

## 3. Spécifications Techniques d'Intégration

```javascript
import { renderCard, createChart, DEFAULT_DATA } from './template.js';

renderCard(document.getElementById('kpi-container'), {
  title: 'Latence Serveur P99',
  value: 142,
  unit: 'ms',
  thresholds: { nominal: 100, critical: 150 },
  polarity: 'lower-is-better',
  footnote: 'Action: Vérifier la charge du cluster DB'
}, 'colorbrewer-accessible');
```
