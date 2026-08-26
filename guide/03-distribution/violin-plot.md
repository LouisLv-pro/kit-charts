# Fiche Méthodologique : Diagramme en Violon (Violin Plot + KDE & Boîte Interne)

> **Catégorie** : `03-distribution`  
> **Type Chart.js** : `bar` étendu par plugin Canvas 2D custom (`kitChartsViolinPainter`)  
> **Niveau de précision Cleveland & McGill** : RANG 1 (Position le long d'échelles communes) + RANG 2 (Longueur / Largeur de densité)  
> **Dernière révision** : 2026-08-25  

---

## 1. Fondements Scientifiques & Justification Cognitive

Le **Diagramme en Violon** (*Violin Plot*) est un graphique combiné associant une estimation non-paramétrique de densité par noyau (*Kernel Density Estimation* — KDE) en silhouette miroir symétrique et un résumé statistique à 5 nombres (boîte à moustaches de Tukey).

### Citations Fondatrices & Littérature Académique
1. **Hintze & Nelson (1998)** — *Violin Plots: A Compound Display of Continuous Data Distributions*, The American Statistician, 52(2), 181–184 : invention formelle du violin plot pour surmonter l'incapacité de la boîte à moustaches conventionnelle à révéler les **bimodalités**, les **creux de densité**, les **asymétries multimodales** et les concentrations locales.
2. **Knific & Weissgerber (2018)** — *Pitfalls of Violin Plots and Sample Size Perception*, PLOS Biology : démonstration empirique du piège de confusion perceptuelle entre l'aire du violon et l'effectif d'échantillon $n$.
3. **Scott (1992)** — *Multivariate Density Estimation: Theory, Practice, and Visualization*, John Wiley & Sons : règle de bande passante asymptotiquement optimale pour estimateurs à noyau gaussien.
4. **Tukey (1977)** — *Exploratory Data Analysis*, Addison-Wesley : fondation de la boîte à moustaches et des clôtures d'outliers $[Q_1 - 1.5\text{IQR}, Q_3 + 1.5\text{IQR}]$.
5. **Cleveland & McGill (1984)** — *Graphical Perception*, JASA : hiérarchie psychophysique d'extraction de données quantitatives (position > longueur > aire).
6. **Anscombe (1973)** / **Matejka & Fitzmaurice (2017)** : nécessité impérieuse de révéler la distribution sous-jacente plutôt que des statistiques agrégées aveugles.

```
       STRUCTURE COGNITIVE DU VIOLIN PLOT ENRICHI (AVEC n & BOÎTE INTERNE)
   Score
    45 ┤             n = 16              n = 16
    35 ┤              ( )                 / \
    25 ┤            (  ●  )             /     \          n = 16
    15 ┤            (  |  )            |   ●   |          / \
     5 ┤              \ /               \  |  /          | ● |
     0 ┼───────────────┴───────────────────┴───────────────┴────────► Groupes
                  Groupe A              Groupe B       Groupe C
                 (Unimodal)            (Bimodal)     (Asymétrique)
```

---

## 2. Formulation Mathématique Déterministe & Piège Cognitif (« Aire du Violon $\propto$ Densité, Pas $n$ »)

### 2.1 Analyse du Piège Cognitif (Knific & Weissgerber 2018)
L'illusion visuelle majeure du diagramme en violon réside dans la **confusion aire-effectif** :
- La silhouette du violon encode la **fonction de densité de probabilité continue** $\hat{f}(x)$, dont l'intégrale est strictement normalisée à $1.0$ ($\int \hat{f}(x) dx = 1.0$).
- L'œil humain non entraîné applique instinctivement une heuristique de volume : il interprète la largeur ou la surface globale d'un violon comme proportionnelle au nombre d'observations ($n$).
- **Conséquence toxique** : Un échantillon minuscule ($n = 8$) ayant une forte variance paraîtra visuellement plus volumineux et « plus solide » qu'un échantillon massif ($n = 5000$) concentré autour d'une faible variance.
- **Garde-Fou Déterministe kit-charts** :
  1. Affichage alphanumérique explicite de $n$ ($n = \dots$) au-dessus de chaque violon en chiffres tabulaires (`fontMono`).
  2. Normalisation géométrique à aire unitaire constante $\int \hat{f}(x) dx = 1$.
  3. Superposition déterministe des points réels pour $n \le 30$.

### 2.2 Kernel Density Estimator (KDE) Gaussien
$$\hat{f}(x) = \frac{1}{n \cdot h} \sum_{i=1}^n K\left(\frac{x - x_i}{h}\right), \quad K(u) = \frac{1}{\sqrt{2\pi}} e^{-\frac{u^2}{2}}$$

### 2.3 Bande Passante Optimale de Scott (1992)
$$h = 1.06 \cdot \sigma \cdot n^{-1/5}$$
- Écart-type d'échantillon sans biais :
  $$\sigma = \sqrt{\frac{1}{n - 1} \sum_{i=1}^n (x_i - \bar{x})^2}$$
- Fallback déterministe si variance nulle ($\sigma = 0$) : $h = 1.0$.

### 2.4 Normalisation d'Aire & Grille d'Évaluation
- Grille uniforme de 128 points équidistants sur l'intervalle étendu $[\min(x) - 3h, \max(x) + 3h]$.
- Intégrale trapézoïdale de vérification :
  $$\int_{\min - 3h}^{\max + 3h} \hat{f}(x) \, dx \approx 1.00 \pm 0.05$$
- Largeur maximale du demi-violon plafonnée à $W_{\text{half}} = \min(60\text{px}, 0.40 \times \text{largeur de catégorie})$.

### 2.5 Résumé Tukey & Jitter au Nombre d'Or
- Quantiles type R-7 : position $p = 1 + (n - 1) \cdot q$ pour $q \in \{0.25, 0.50, 0.75\}$.
- Décalage horizontal pseudo-aléatoire déterministe :
  $$\Delta x_i = \left( (i \cdot \phi) \bmod 1 - 0.5 \right) \cdot W_{\max}, \quad \phi = \frac{\sqrt{5} - 1}{2} \approx 0.61803398875$$

---

## 3. Double-Encodage & Garde-Fous Cognitifs

1. **Silhouette continue** : Remplissage contextuel `tokens.emphasis.context` ($\alpha = 0.35$).
2. **Boîte interne (*Inner Box*)** : Mini rectangle interquartile $[Q_1, Q_3]$ en couleur contrastée + disque médian blanc.
3. **Garde-fou Anscombe ($n \le 30$)** : Superposition déterministe des points bruts avec jitter basé sur le nombre d'or ($\phi \approx 0.618$).
4. **Affichage Alphanumérique de $n$** : Badge textuel direct $n = \dots$ au-dessus de chaque silhouette.

---

## 4. Quand l'utiliser / Quand NE PAS l'utiliser

| Contexte d'analyse | Pertinence | Justification & Recommandation |
| :--- | :---: | :--- |
| **Comparaison de distributions continues avec bimodalités suspectées** | **Optimale** | Révèle les séparations de sous-populations (ex: salaires par filiale, temps de réponse serveurs). |
| **Échantillons moyens à grands ($n \ge 30$ par groupe)** | **Optimale** | L'estimation de densité KDE est stable, continue et hautement représentative. |
| **Très petits échantillons ($n < 10$)** | **Interdite** | Le KDE produit des formes lisses trompeuses sans réalité statistique $\to$ Utiliser *Beeswarm Plot* ou *Strip Plot*. |
| **Public exécutif généraliste non formé** | **Déconseillée** | Risque d'incompréhension de la forme miroir $\to$ Préférer un *Box Plot* annoté standard. |
| **Données discrètes ou catégorielles pures** | **Interdite** | Le lissage continu gaussien crée des valeurs fictives inexistantes dans les données. |

---

## 5. Intégration Tokens & Moteur Central

Le template `violin-plot` s'intègre rigoureusement avec l'écosystème de tokens `kit-charts` :
- `getChartDefaultOptions(tokens)` : gestion de la typographie, des marges et des infobulles anti-occlusion.
- `getColor(tokens, index)` : attribution cyclique des teintes de palette harmonisées.
- `hexToRgba(color, 0.35)` : remplissage contextuel semi-transparent de la silhouette KDE.
- `getAccessibleAnimationOptions(tokens)` : respect de `@media (prefers-reduced-motion: reduce)`.
- `getEmphasisStyle`, `getValenceColor`, `getThresholdStatus` : support universel des annotations sémantiques.

---

## 6. Données de Démonstration Déterministes

```javascript
const DEFAULT_DATA = {
  labels: ['Groupe A (Contrôle)', 'Groupe B (Bimodal)', 'Groupe C (Asymétrique)'],
  datasets: [{
    label: 'Distribution Score',
    data: [
      [14, 15, 16, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 23, 24, 25],
      [10, 11, 12, 12, 13, 13, 14, 24, 25, 25, 26, 26, 27, 28, 29, 30],
      [5, 6, 6, 7, 7, 8, 9, 10, 12, 15, 18, 22, 26, 31, 37, 44]
    ]
  }]
};
```

---

## 7. Recommandations d'Implémentation Chart.js & Psychophysique

1. **Hiérarchie Visuelle à 3 Couches Maximales (Miller 1956, Mayer 2001)** :
   - Couche 1 (Fond) : Silhouette KDE continue en teinte adoucie ($\alpha = 0.35$).
   - Couche 2 (Milieu) : Boîte à moustaches Tukey miniature (barre sombre 8px, disque blanc médiane 5px).
   - Couche 3 (Premier plan) : Points de données bruts individuels + badge textuel $n = \dots$.
2. **Infobulles Anti-Occlusion (Mayer 2001)** :
   - Affichage de $n$, Médiane, IQR $[Q_1 - Q_3]$, Étendue totale et Bande passante $h$.
   - Formatage des chiffres avec séparateurs de milliers locaux (`toLocaleString('fr-FR')`).
3. **Loi de Fitts (MacKenzie 1992)** :
   - Zone de sélection élargie à l'intégralité de la colonne catégorielle (`mode: 'index'`, `axis: 'x'`).

---

## 8. Règles Cognitives d'Accentuation & Valence

### 8.1 Hiérarchie 90/10 & Focus Narratif (*Hero vs Context*)
- Le violon d'intérêt focal (*Hero*) est rehaussé avec une bordure saturée et une opacité accrue ($\alpha = 0.55$).
- Les distributions secondaires de référence (*Context*) sont atténuées en teinte neutre désaturée (`tokens.emphasis.context`).

### 8.2 Valence Métier & Directionnalité
- Si la distribution représente une métrique de gain (ex: productivité, score de test), une médiane supérieure au benchmark est valorisée via `tokens.status.success`.
- Pour les métriques inversées de coût ou de latence, les queues de distribution élevées sont signalées en `tokens.status.danger`.

### 8.3 Seuils & Cible vs Réel (Thresholds)
- Les repères d'objectifs critiques ou de seuils réglementaires (Target / Benchmark) peuvent être projetés sous forme de ligne horizontale discrète tiretée (`tokens.emphasis.benchmark`).

### 8.4 Double Encodage & Accessibilité CVD (Daltonisme)
- L'information statistique ne repose jamais sur la couleur seule : la forme continue de la courbe, la position de la médiane Tukey, le tracé des quartiles et le badge textuel $n$ fournissent un quadruple encodage géométrique et alphanumérique accessible.

### 8.5 Exemple d'Utilisation

```javascript
import { createChart } from './template.js';
import { getThemeTokens } from '../../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

// Données avec 3 groupes comparatifs
const customData = {
  labels: ['Équipe A', 'Équipe B', 'Équipe C'],
  datasets: [{
    label: 'Temps de cycle (heures)',
    data: [
      [12, 14, 15, 16, 17, 18, 19, 20, 22],
      [8, 9, 10, 11, 12, 24, 25, 26, 28],
      [15, 16, 17, 18, 19, 20, 21, 22, 23]
    ]
  }]
};

const chart = createChart('chartCanvas', customData, 'colorbrewer-accessible', {
  showInnerBox: true,
  showRawPoints: true
});
```


## 7. Psychophysique de l'Interaction & Infobulles

Infobulles anti-occlusion (Mayer 2001) et hit targets >= 10px (Fitts 1954).
