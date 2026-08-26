# Fiche Méthodologique : Tableau Heatmap / Matrice Colorimétrique 2D

> **Catégorie** : `09-tableaux-dataviz`  
> **Identifiant** : `table-heatmap-matrix`  
> **Niveau de précision Cleveland & McGill** : RANG 7 (Luminance & Saturation) + Valeurs Textuelles Exactes  
> **Références** : Cynthia Brewer (*ColorBrewer*), WCAG 2.1 AAA, Gestalt (Continuité & Proximité)  

---

## 1. Description & Objectif Cognitif

Le **Tableau Heatmap (Highlight Table)** permet d'explorer des matrices bidimensionnelles (ex: Régions x Mois, Canaux x Heures) en révélant instantanément les zones de forte concentration, les pics saisonniers ou les déficits de performance.

---

## 2. Inversion Automatique du Texte (WCAG 2.1 AAA)

Chaque cellule calcule dynamiquement la luminance relative $L$ de sa couleur de fond selon la formule normalisée CIE :
$$L = 0.2126 \cdot R' + 0.7152 \cdot G' + 0.0722 \cdot B'$$
- Si $L < 0.38$, le texte commute en blanc pur (`#FFFFFF`) pour garantir un ratio de contraste supérieur à **7:1**.
- Si $L \ge 0.38$, le texte reste en noir/anthracite (`#0F172A`).

---

## 3. Exemple d'Intégration ESM

```javascript
import { createTable } from './template/09-tableaux-dataviz/table-heatmap-matrix/template.js';

const tableInstance = createTable('heatmapTarget', null, 'viridis-perceptual');
```
