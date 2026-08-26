# Fiche Méthodologique : Tableau Comparatif Bar-in-Cell & Bullet Graph

> **Catégorie** : `09-tableaux-dataviz`  
> **Identifiant** : `table-bar-in-cell`  
> **Niveau de précision Cleveland & McGill** : RANG 1 / RANG 3 (Longueur 1D sur échelle commune)  
> **Références** : Stephen Few (*Bullet Graph Design* & *Show Me the Numbers*), Mayer (Contiguïté Spatiale)  

---

## 1. Description & Objectif Cognitif

Le **Tableau Bar-in-Cell** intègre des micro-barres proportionnelles et des mini bullet graphs au cœur des cellules de tableau. Il exploite la vitesse de calcul pré-attentif de la longueur (Cleveland Rang 1) tout en conservant les valeurs numériques exactes pour les comparaisons directes.

---

## 2. Règles d'Échelle Commune

Toutes les micro-barres d'une même colonne sont obligatoirement calibrées sur le **maximum de la colonne ($0 \rightarrow \max(\text{colonne})$)**. L'intégration contiguë élimine tout phénomène de dissociation spatiale entre la donnée et sa représentation visuelle.

---

## 3. Exemple d'Intégration ESM

```javascript
import { createTable } from './template/09-tableaux-dataviz/table-bar-in-cell/template.js';

const tableInstance = createTable('barInCellTarget', null, 'colorbrewer-accessible');
```
