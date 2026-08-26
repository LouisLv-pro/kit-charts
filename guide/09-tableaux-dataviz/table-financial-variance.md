# Fiche Méthodologique : Tableau Financier & Variance IBCS (P&L Table)

> **Catégorie** : `09-tableaux-dataviz`  
> **Identifiant** : `table-financial-variance`  
> **Niveau de précision Cleveland & McGill** : RANG 1 (Barres divergentes axe 0 & Alignement comptable)  
> **Références** : Rolf Hichert (*IBCS Standards*), Conventions Financières Internationales  

---

## 1. Description & Objectif Cognitif

Le **Tableau Financier & Variance IBCS** standardise la restitution des comptes de résultat (P&L) et des analyses budgétaires. Il élimine toute ambiguïté sur la signification des écarts en introduisant :
1. **L'Axe Zéro Central** : Les micro-barres s'étendent à droite pour les écarts favorables et à gauche pour les écarts défavorables.
2. **L'Inversion de Polarité** : Une hausse de coût est systématiquement encodée en couleur défavorable (rouge).
3. **La Convention Comptable** : Parenthèses explicites pour les flux négatifs `(9 700 k€)`.

---

## 2. Exemple d'Intégration ESM

```javascript
import { createTable } from './template/09-tableaux-dataviz/table-financial-variance/template.js';

const tableInstance = createTable('financialTarget', null, 'colorbrewer-accessible');
```
