# 🧠 Règles Cognitives & Fondements de la Datavisualisation (Kit-Charts)

Ce document formalise les lois de la psychophysique visuelle, des sciences cognitives et de l'ergonomie de l'information gouvernant la bibliothèque **kit-charts**. Ces règles s'appliquent à tous les agents et modules de génération.

---

## 1. Hiérarchie Perceptuelle de Cleveland & McGill (1984)

La recherche empirique de William S. Cleveland et Robert McGill établit la précision de décodage par le cerveau humain selon les canaux graphiques élémentaires :

```
Précision cognitive maximale (Erreur d'estimation minimale)
  ▲  1. Position sur une échelle commune alignée (Bar chart, Scatter plot)
  │  2. Position sur des échelles non alignées (Small multiples)
  │  3. Longueur 1D (Barres non alignées, Lollipop)
  │  4. Direction / Angle / Pente (Slope chart, Camembert 2-3 parts)
  │  5. Surface / Aire 2D (Bubble chart, Treemap) — Loi de Stevens α ≈ 0.7
  │  6. Volume 3D / Profondeur (Graphiques 3D — STRICTEMENT INTERDITS)
  ▼  7. Teinte / Saturation / Densité (Heatmap, Choroplèthe — Ordinal uniquement)
Précision cognitive minimale (Estimation qualitative globale)
```

### Règle d'or absolue pour les agents IA :
> **Tout encodage d'une variable quantitative critique doit prioriser la Position (1) ou la Longueur (3). Les variables de couleur (7) et d'aire (5) ne doivent être utilisées que pour des dimensions secondaires ou du contexte.**

---

## 2. Lois de la Gestalt & Encodage Visuel

Le cerveau humain organise les scènes visuelles en structures globales pré-attentives (< 250 ms) :

| Loi Gestalt | Mécanisme perceptif | Implémentation Déterministe Chart.js |
| :--- | :--- | :--- |
| **Proximité** | Les objets proches sont perçus comme appartenant au même groupe. | `categoryPercentage: 0.8`, `barPercentage: 0.9` (espacement intra-groupe < inter-groupe). |
| **Similarité** | Même couleur / forme = même catégorie sémantique. | Une même couleur identifie toujours la même catégorie à travers tout le dashboard. |
| **Continuité** | L'œil suit naturellement les courbes et lignes continues. | Tri continu sur l'axe X (chronologique ou ordonné par valeur décroissante). |
| **Clôture** (*Closure*) | Le cerveau comble les vides sans nécessiter de contours pleins. | Supprimer les bordures lourdes (`borderWidth: 0`), grille subtile `rgba(0,0,0,0.06)`. |
| **Figure / Fond** | Détachement immédiat entre le signal utile et l'arrière-plan. | Fond neutre sans texture, contraste minimal $3:1$ pour les formes et $4.5:1$ pour les textes. |
| **Destin Commun** | Les éléments se déplaçant ensemble sont perçus comme une entité. | Synchronisation des transitions d'état et flux ordonnés. |

---

## 3. Théorie de la Charge Cognitive (Sweller) & Ratio Data-Ink (Tufte)

### 3.1 Gestion des 3 Charges Cognitives (Sweller 1988, Cowan 2001)
- **Capacité de la mémoire de travail** : $4 \pm 1$ chunks d'information simultanés.
- **Charge Intrinsèque** : Complexité inhérente au domaine métier (incompressible).
- **Charge Extrinsèque (Bruit)** : Perturbations causées par le design, les légendes déportées, les axes surchargés. **Doit être strictement réduite à 0.**
- **Charge Essentielle (*Germane*)** : Effort mental dédié à l'extraction d'insights et à la prise de décision. **Doit être maximisée.**

### 3.2 Ratio Data-Ink & Règle 90/10 d'Edward Tufte (1983)
$$\text{Data-Ink Ratio} = \frac{\text{Pixels dédiés aux données non redondantes}}{\text{Pixels totaux de la visualisation}} \to 1.0$$

- **Suppression du Chartjunk** : Zéro 3D décorative, zéro dégradés non fonctionnels, zéro ombres lourdes.
- **Règle 90/10** : 90% des éléments graphiques représentent le contexte (tons neutres/ardoise `#94A3B8`, opacité 0.35-0.45) ; seuls 10% des éléments forment le focus narratif (couleur saturée contrastée).
- **Étiquetage Direct (*Direct Labeling*)** : Mayer (2009, principe de contiguïté spatiale) — privilégier les libellés directs au bout des courbes/barres plutôt qu'une boîte de légende déportée lorsque $N \le 5$.

---

## 4. Règles d'Échelle & Géométrie Fondamentales

### 4.1 Ligne de Base Y = 0 Obligatoire sur les Graphiques de Longueur
- **Types concernés** : `bar-chart-vertical`, `bar-chart-horizontal`, `grouped-bar-chart`, `stacked-bar-chart`, `lollipop-chart`, `bullet-chart`, `waterfall-chart`.
- **Règle** : L'axe Y (ou X pour les barres horizontales) **DOIT obligatoirement inclure 0 (`beginAtZero: true`)**. Tronquer l'axe Y sur un graphique en barres exagère artificiellement les deltas relatifs et constitue une faute déontologique majeure (Huff, 1954).
- **Échelles logarithmiques** : **STRICTEMENT INTERDITES** sur les bar charts (car la longueur physique d'une barre ne correspond plus à sa valeur). Les échelles log ne sont permises que sur `scatter-plot` ou `line-chart` à très forte dynamique ($> 3$ décades).

### 4.2 Ligne de Base sur les Séries Temporelles (`line-chart`, `area-chart`)
- Pour les courbes de tendance (`line-chart`), l'axe Y peut être resserré autour de l'intervalle de variation $[\min \times 0.95, \max \times 1.05]$ pour révéler la volatilité, à condition d'indiquer explicitement l'échelle et de ne pas remplir l'aire sous la courbe (un `area-chart` requiert $Y = 0$).

---

## 5. Limites de Cardinalité & Encombrement Perceptif

| Type de Graphique | Seuil Optimal | Seuil Limite | Action Déterministe si Dépassement |
| :--- | :--- | :--- | :--- |
| `bar-chart-vertical` | $N \le 7$ | $N = 10$ | Basculer vers `bar-chart-horizontal` ou `lollipop-chart`. |
| `bar-chart-horizontal` | $N \le 15$ | $N = 25$ | Ajouter un filtre "Top 10 + Autres" ou pagination. |
| `multi-line-chart` | $K \le 4$ séries | $K = 5$ | Basculer vers le mode Focus+Context (1 active, 4 en fond gris) ou Small Multiples. |
| `pie-chart` / `doughnut-chart` | $N = 2 \text{ à } 3$ | $N = 4$ | Basculer vers `bar-chart-horizontal` ou `waffle-chart`. |
| `dataLabels` (étiquettes directes) | $N \le 7$ | $N = 12$ | Désactiver les labels et basculer sur tooltips interactifs au survol. |

---

## 6. Typographie Tabulaire & Formatage Numérique

- **Chiffres tabulaires obligatoires** : Utiliser `font-variant-numeric: tabular-nums` ou des polices à espacement fixe (`Fira Code`, `Geist Mono`, `JetBrains Mono`) pour tous les nombres, tableaux et KPIs afin d'aligner parfaitement les colonnes décimales.
- **Séparateurs et unités** :
  - Espace fine insécable pour les milliers (`142 850 €`).
  - Maximum 1 à 2 décimales significatives.
  - Toujours spécifier l'unité physique ou monétaire (€, $, %, ms, kg).
