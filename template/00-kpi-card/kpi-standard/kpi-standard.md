# 💳 KPI Card Standard / Executive Summary

> **Catégorie** : `00-kpi-card`  
> **Type de composant** : Carte de synthèse exécutive décisionnelle  
> **Niveau de précision psychophysique** : Rang 1 (Texte numérique direct & positionnement spatial)  
> **Temps de décodage pré-attentionnel** : $< 150 \text{ ms}$

---

## 1. Cas d'Usage Analytique & Cible Métier

La **KPI Card Standard** est le composant décisionnel roi des tableaux de bord analytiques exécutifs (C-Level, directeurs des opérations, chefs de produit). Elle synthétise en un coup d'œil la santé globale d'un indicateur clé de performance (ex: Chiffre d'Affaires, MRR, Nombre d'abonnés actifs, Taux de rétention).

Elle répond instantanément aux 3 questions fondamentales du décideur :
1. **Quelle est la valeur actuelle ?** $\to$ Chiffre Hero en grand format typographique.
2. **Quelle est la trajectoire immédiate ?** $\to$ Badge de variation ($\Delta$) avec icône fléchée et signe $+/-$.
3. **Par rapport à quel référentiel ?** $\to$ Libellé de contexte comparatif (ex: *"vs mois précédent"*).

---

## 2. Fondements Scientifiques & Justifications Cognitives

### 2.1 Théorie de la Charge Cognitive (Sweller, 1988)
- **Charge Intrinsèque Maîtrisée** : Un seul concept métier par carte pour respecter l'empan mnésique de Cowan ($4 \pm 1$ chunks).
- **Charge Extrinsèque Nulle** : Élimination de tout ornement inutile (pas d'ombres exagérées, pas de faux biseaux 3D, ratio Data-Ink de Tufte maximal).
- **Charge Essentielle Maximisée** : L'utilisateur comprend le sens de la variation sans effort mental.

### 2.2 Traitement Pré-attentionnel & Hiérarchie Visuelle (Treisman, 1985)
- **Taille & Graisse (Size & Weight)** : Le nombre Hero (32px, `font-weight: 800`) capte la première fixation fovéale en moins de 100 ms.
- **Orientation & Forme** : La flèche vectorielle ($\uparrow / \downarrow$) oriente le jugement avant même la lecture des chiffres.
- **Couleur de Valence Déterministe** : Le badge applique une teinte sémantique calculée selon la nature de la métrique (`gain` vs `cost`/`churn`).

### 2.3 Redondance Visuelle & Accessibilité WCAG 2.1 AAA
Pour garantir l'accessibilité à 100% des utilisateurs (y compris les 8% d'hommes daltoniens) :
- **Quadruple Encodage** :
  1. Teinte sémantique accessible avec fond teinté (10-18% d'opacité).
  2. Icône de direction ($\uparrow$ / $\downarrow$).
  3. Signe explicite ($+14.2\%$ / $-5.0\%$).
  4. Mention textuelle du benchmark.
- **Typographie Tabulaire** : Utilisation stricte de `font-variant-numeric: tabular-nums` pour éviter les décalages de largeur des chiffres.

---

## 3. Spécifications Techniques d'Intégration

```javascript
import { renderCard, createChart, DEFAULT_DATA } from './template.js';

// Rendu automatique dans un conteneur DOM
renderCard(document.getElementById('kpi-container'), {
  title: 'Chiffre d\'Affaires Mensuel',
  value: 284500,
  unit: '€',
  delta: 8.4,
  deltaLabel: 'vs M-1 (262 450 €)',
  metricType: 'gain',
  footnote: 'Données certifiées SAP'
}, 'colorbrewer-accessible');
```
