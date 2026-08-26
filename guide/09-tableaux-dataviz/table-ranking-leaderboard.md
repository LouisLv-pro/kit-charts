# Fiche Méthodologique : Tableau de Classement & Performance (Leaderboard)

> **Catégorie** : `09-tableaux-dataviz`  
> **Identifiant** : `table-ranking-leaderboard`  
> **Niveau de précision Cleveland & McGill** : RANG 1 (Ordre sérial & Longueur 1D)  
> **Références** : Stephen Few (*Table Design*), Psychophysique du Classement  

---

## 1. Description & Objectif Cognitif

Le **Tableau de Classement (Leaderboard)** met en valeur l'émulation et la dynamique de performance d'entités en compétition (commerciaux, pays, produits). Il intègre :
1. **Badges de Podium** : Mise en valeur discrète des 3 premières places (Or, Argent, Bronze).
2. **Indicateur de Mobilité ($\Delta \text{pos}$)** : Flèches explicites et deltas numériques pour la progression ou régression de rang.
3. **Sparkbar d'Activité 6M** : Micro-histogramme mettant en relief le dernier mois de mesure.

---

## 2. Exemple d'Intégration ESM

```javascript
import { createTable } from './template/09-tableaux-dataviz/table-ranking-leaderboard/template.js';

const tableInstance = createTable('leaderboardTarget', null, 'colorbrewer-accessible');
```
