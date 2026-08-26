# 🍰 KPI Card Décomposition / Micro-Distribution (Part-to-Whole)

> **Catégorie** : `00-kpi-card`  
> **Type de composant** : Carte d'agrégat macroscopique avec décomposition segmentaire 100%  
> **Niveau de précision psychophysique** : Rang 1 (Total) & Rang 3 (Longueur de segment)  
> **Temps de décodage pré-attentionnel** : $< 170 \text{ ms}$

---

## 1. Cas d'Usage Analytique

La **KPI Card Décomposition** s'impose pour surveiller un total macroscopique dont la dynamique dépend de plusieurs sous-segments (ex: Trafic par canal d'acquisition, Ventes par catégorie de produits, Budget par pôle de dépenses, Chiffre d'affaires par région).

Elle permet d'identifier immédiatement quel levier soutient ou freine la métrique globale.

---

## 2. Fondements Scientifiques & Justifications Cognitives

### 2.1 Principe de Contiguïté Spatiale (Richard Mayer, 2009)
Les étiquettes descriptives sont placées directement sous la barre de décomposition, éliminant les allers-retours visuels vers une légende déportée.

### 2.2 Palette Catégorielle Accessible & Loi de Similarité
Les segments utilisent la palette ordonnée du thème (`tokens.palette[0..3]`) garantissant une luminance harmonisée et une conformité daltonisme (CVD).

---

## 3. Spécifications Techniques d'Intégration

```javascript
import { renderCard, createChart, DEFAULT_DATA } from './template.js';

renderCard(document.getElementById('kpi-container'), {
  title: 'Acquisition Globale (Trafic)',
  value: 1240000,
  unit: 'visites',
  delta: 8.5,
  segments: [
    { label: 'Organique', pct: 45, value: 558000 },
    { label: 'Direct', pct: 25, value: 310000 },
    { label: 'Payant', pct: 20, value: 248000 },
    { label: 'Referral', pct: 10, value: 124000 }
  ]
}, 'colorbrewer-accessible');
```
