# Fiche Méthodologique : Tableau Hiérarchique & Arborescent (Grouped Tree Table)

> **Catégorie** : `09-tableaux-dataviz`  
> **Identifiant** : `table-hierarchical-tree`  
> **Niveau de précision Cleveland & McGill** : RANG 1 (Alignement tabulaire) + Structuration Parent-Enfant  
> **Références** : John Sweller (*Cognitive Load & Chunking*), Lois de la Gestalt (Proximité & Continuité)  

---

## 1. Description & Objectif Cognitif

Le **Tableau Hiérarchique (Tree Table)** permet d'organiser et de naviguer dans des arborescences de données complexes (départements, gammes de produits, zones géographiques) sans saturer l'attention de l'utilisateur, grâce à :
1. Un mécanisme de pliage/dépliage sélectif (*Drill-Down / Roll-Up*).
2. Une indentation spatiale rigoureuse (22px par niveau).
3. Une hiérarchie typographique dégressive garantissant le repérage immédiat des lignes de synthèse.

---

## 2. Exemple d'Intégration ESM

```javascript
import { createTable } from './template/09-tableaux-dataviz/table-hierarchical-tree/template.js';

const tableInstance = createTable('treeTableTarget', null, 'colorbrewer-accessible');
```
