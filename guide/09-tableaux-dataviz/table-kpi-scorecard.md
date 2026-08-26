# Fiche Méthodologique : Tableau Exécutif KPI Scorecard

> **Catégorie** : `09-tableaux-dataviz`  
> **Identifiant** : `table-kpi-scorecard`  
> **Niveau de précision Cleveland & McGill** : RANG 1 (Position & Longueur) + RANG 4 (Pente Sparkline)  
> **Références** : Stephen Few (*Show Me the Numbers*), Edward Tufte (*Beautiful Evidence*), WCAG 2.1 AAA  

---

## 1. Description & Objectif Cognitif

Le **Tableau Exécutif KPI Scorecard** est conçu pour les comités de direction et revues d'activité trimestrielles. Il consolide sur une vue unique et dense les indicateurs stratégiques de l'entreprise en réduisant la charge mentale via :
1. **Écarts bivalents normalisés** ($\Delta\%$) avec flèche de direction et couleur adaptée à la polarité métier (gain vs coût).
2. **Sparklines vectorielles 12M** révélant la dynamique historique sans l'encombrement d'axes complets.
3. **Badges de statuts accessibles** combinant couleur douce, libellé textuel et pictogramme de forme.

---

## 2. Règles Ergonomiques & Psychophysiques

- **Alignement strict** : Colonnes de texte à gauche, colonnes chiffrées à droite, badges et sparklines centrés.
- **Typographie** : Chiffres en police `JetBrains Mono` ou `IBM Plex Mono` avec `font-variant-numeric: tabular-nums`.
- **Valence Inversée** : Une augmentation du CAC ou du Churn est automatiquement encodée en couleur rouge/alerte.
- **Micro-Graphiques Tufte** : Les sparklines soulignent le minimum (rouge), le maximum (vert) et le dernier point de mesure.

---

## 3. Exemple d'Intégration ESM

```javascript
import { createTable } from './template/09-tableaux-dataviz/table-kpi-scorecard/template.js';

const tableInstance = createTable('tableContainer', null, 'colorbrewer-accessible');
```
