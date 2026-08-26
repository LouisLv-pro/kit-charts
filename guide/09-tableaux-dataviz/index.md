# Guide Méthodologique & Fondements Cognitifs des Tableaux de Datavisualisation

> **Catégorie** : `09-tableaux-dataviz`  
> **Auteurs & Références** : Stephen Few (*Show Me the Numbers*), Edward Tufte (*Data-Ink & Sparklines*), John Sweller (*Cognitive Load Theory*), Cleveland & McGill (*Graphical Perception*), IBCS® (*International Business Communication Standards*)  
> **Dernière révision** : 2026-08-22  

---

## 1. Introduction : Pourquoi et Quand Utiliser un Tableau en Dataviz ?

En visualisation de données, le choix entre un **graphique visuel** et un **tableau structuré** répond à deux modes de traitement cognitif fondamentalement différents :

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               MODES DE TRAITEMENT MENTAL                               │
├───────────────────────────────────────────┬────────────────────────────────────────────┤
│           TABLEAU DE DONNÉES              │            GRAPHIQUE VISUEL                │
│     (Traitement Symbolique / Verbal)      │     (Traitement Perceptuel / Spatial)      │
├───────────────────────────────────────────┼────────────────────────────────────────────┤
│ • Consultation de valeurs numériques      │ • Détection globale de formes & patterns   │
│   exactes et individuelles                │ • Analyse de tendances continues           │
│ • Comparaison précise de paires de nombres│ • Identification de corrélations bivariées │
│ • Coexistence d'unités hétérogènes (€, %) │ • Perception de clusters et distributions  │
│ • États comptables, totaux & sous-totaux  │ • Grands volumes de données ($N \ge 100$)  │
└───────────────────────────────────────────┴────────────────────────────────────────────┘
```

### Le Tableau Dataviz Hybride : Le Meilleur des Deux Mondes
Le **Tableau Dataviz Hybride** intègre des micro-visualisations vectorielles au cœur même des cellules (sparklines, micro-barres proportionnelles, mini-bullets, indicateurs de valence). Il permet une **lecture à double vitesse** :
1. **Traitement Pré-attentif (< 200 ms)** : L'œil appréhende immédiatement les grandeurs relatives via la longueur des barres et la direction des sparklines.
2. **Traitement Analytique Approfondi** : L'utilisateur dispose des valeurs chiffrées exactes sans quitter la cellule.

---

## 2. Fondements Théoriques & Sciences Cognitives

### 2.1 Théorie de la Charge Cognitive (Sweller, 1988, 2011)
La mémoire de travail est limitée à **4 ± 1 éléments d'information simultanés** (Cowan, 2001). Dans la conception de tableaux, nous appliquons :
- **Élimination de la Charge Extrinsèque** : Suppression absolue des quadrillages lourds, des bordures verticales parasites et des cellules en boîte close (*caged data*).
- **Suppression de l'Effet d'Attention Divisée (*Split-Attention Effect*)** : Intégration contiguë des unités, tendances et statuts directement au contact des chiffres.
- **Maximisation de la Charge Essentielle (*Germane Load*)** : Focalisation de l'attention sur les anomalies, les écarts budgétaires et les leviers de décision.

### 2.2 Les Règles d'Alignement Invariables de Stephen Few
| Type de Donnée | Alignement | Justification Psychophysique |
| :--- | :--- | :--- |
| **Nombres quantitatifs** | **Droite (`text-align: right`)** | Préservation de la magnitude décimale (alignement des unités, dizaines, milliers). |
| **Textes et Libellés** | **Gauche (`text-align: left`)** | Alignement naturel du point de départ de lecture occidentale. |
| **En-têtes de colonnes** | **Alignés avec leurs cellules** | En-tête à droite pour les colonnes numériques, à gauche pour les colonnes de texte. |
| **Codes courts & Dates fixes** | **Centre (`text-align: center`)** | Réservé strictement aux chaînes de caractères de longueur invariable (ex: `FR`, `DE`). |

### 2.3 Typographie Tabulaire Obligatoire : `tabular-nums`
Sans numéraux tabulaires, les largeurs variables des chiffres provoquent une ondulation des colonnes :
```css
font-variant-numeric: tabular-nums lining-nums;
font-feature-settings: "tnum" 1, "lnum" 1;
```

### 2.4 Double Encodage & Accessibilité WCAG 2.1 AAA
- **Inversion Dynamique du Texte** : Commutation automatique du texte en clair/sombre selon la luminance relative $L_{\text{fond}} < 0.38$ de la cellule.
- **Double Encodage de Valence** : Chaque variation ou statut combine impérativement **Couleur** + **Symbole/Flèche** ($\uparrow/\downarrow/✓/▲/■$) + **Texte explicite**.

---

## 3. Matrice de Sélection des Variantes de Tableaux

```
Objectif Métier / Analytique ────────► Structure des Données ──────────────► Variante Recommandée
─────────────────────────────────────────────────────────────────────────────────────────────
1. SYNTHÈSE MULTI-KPI EXÉCUTIVE ─────► Indicateurs hétérogènes + Cibles ──► table-kpi-scorecard
2. MATRICE DE CONCENTRATION / PIC ──► Grille 2D (ex: Région x Mois) ──────► table-heatmap-matrix
3. COMPARAISON DE GRANDEURS ─────────► Liste d'entités + Volume / % ──────► table-bar-in-cell
4. TAXONOMIE / DRILL-DOWN ──────────► Arborescence parent-enfant ────────► table-hierarchical-tree
5. ÉCARTS BUDGÉTAIRES & P&L ────────► Réalisé vs Budget (Gain/Coût) ─────► table-financial-variance
6. EMULATION / TOP-FLOP ────────────► Classement ordonné + Trajectoire ──► table-ranking-leaderboard
```

---

## 4. Catalogue des 6 Variantes

1. [**`table-kpi-scorecard.md`**](./table-kpi-scorecard.md) : Tableau Exécutif KPI Scorecard (Indicateurs clés, cibles, deltas, sparklines 12M, statuts décisionnels).
2. [**`table-heatmap-matrix.md`**](./table-heatmap-matrix.md) : Tableau Heatmap / Matrice Colorimétrique 2D (Gradient continu, inversion WCAG AAA, totaux et moyennes).
3. [**`table-bar-in-cell.md`**](./table-bar-in-cell.md) : Tableau Comparatif Bar-in-Cell & Mini Bullet Graph (Encodage longueur Cleveland Rang 1, marqueurs cibles).
4. [**`table-hierarchical-tree.md`**](./table-hierarchical-tree.md) : Tableau Hiérarchique & Arborescent (Grouped Tree Table, repliage interactif, sous-totaux).
5. [**`table-financial-variance.md`**](./table-financial-variance.md) : Tableau Financier & Variance IBCS (P&L, barres divergentes axe 0, valence inversée gain/coût).
6. [**`table-ranking-leaderboard.md`**](./table-ranking-leaderboard.md) : Tableau de Classement & Performance (Podium doux, delta de position, micro-jauge et sparkbar 6M).
