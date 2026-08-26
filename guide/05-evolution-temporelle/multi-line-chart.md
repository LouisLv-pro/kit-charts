# Graphique à Courbes Multiples (Multi-Line Chart & Small Multiples)

## 1. Description & Principe Visuel
Le graphique à courbes multiples trace plusieurs séries temporelles sur le même système d'axes cartésiens afin de comparer leurs dynamiques relatives d'évolution.
- **Encodage primaire** : Position sur échelles communes et couleur/style de tracé pour distinguer les séries.
- **Le syndrome du Spaghetti Chart** : Dès que plus de 4 ou 5 courbes s'entrecroisent, le cerveau sature (dépassement des $4 \pm 1$ items de la mémoire de travail de Cowan), rendant le graphique totalement illisible.

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Comparer l'évolution temporelle de **2 à 4 séries distinctes maximum**.
- Mettre en valeur une série cible par rapport à une moyenne ou un benchmark sectoriel (*Highlighting*).

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Plus de 5 séries s'entrecroisant** : Anti-pattern absolu (*Spaghetti plot*). 👉 *Remplacer par des **Small Multiples** (grille de mini-courbes individuelles partageant le même axe Y)*.
- **Séries ayant des ordres de grandeur très disparates** (ex: Série A entre 10 et 20, Série B entre 10 000 et 50 000) : 👉 *Remplacer par une normalisation en base 100 ou deux graphiques séparés (interdiction des doubles axes Y trompeurs)*.

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Étiquetage direct en bout de courbe (*Direct Labeling*)** : Placer le nom de chaque série directement à droite du dernier point. **Éliminer la boîte de légende déportée** qui impose un va-et-vient visuel fatiguant (*Split-attention effect*).
- **Stratégie du focus narratif (*Focus + Context*)** : Colorer la série critique en couleur vive (`#2563EB`, épaisseur 3px) et laisser les autres séries en nuances de gris (`#94A3B8`, épaisseur 1.5px).
- **Double encodage pour l'accessibilité** : Varier le style de trait (`borderDash: [5, 5]` vs continu) et la forme des marqueurs pour permettre la distinction aux personnes daltoniennes ou à l'impression monochrome.

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Double axe Y (Axe gauche + Axe droit avec échelles différentes)** : Source majeure de manipulation ou d'incompréhension visuelle, car l'utilisateur interprète les croisements de courbes comme des égalités alors qu'ils ne sont que le fruit d'un calage d'échelle arbitraire.
- ❌ **10 courbes aux couleurs vives de l'arc-en-ciel**.

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Type natif : `'line'` avec gestion du focus ou décomposition en Small Multiples.

```javascript
const config = {
  type: 'line',
  data: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Produit Phare (Focal)',
        data: [100, 140, 185, 230],
        borderColor: '#2563EB', // Couleur vive
        borderWidth: 3,
        pointRadius: 4,
        tension: 0.1
      },
      {
        label: 'Moyenne Marché (Benchmark)',
        data: [120, 130, 145, 160],
        borderColor: '#475569',
        borderDash: [4, 4],
        borderWidth: 2,
        pointRadius: 3,
        tension: 0.1
      },
      {
        label: 'Concurrent B (Contexte)',
        data: [90, 85, 95, 90],
        borderColor: '#CBD5E1', // Grisé plus clair
        borderWidth: 1.5,
        pointRadius: 2,
        tension: 0.1
      }
    ]
  },
  options: {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        title: { display: true, text: 'Indice de Performance' }
      }
    },
    plugins: {
      legend: { position: 'top', align: 'end' }
    }
  }
};
```

---

## Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle & Ratio 90/10 (Focus Narratif vs Contexte)
Le défi cognitif fondamental du graphique multi-lignes est d'éviter la surcharge mentale causée par la rivalité visuelle des tracés :
- **Série Cible (*Hero Series / Focal*)** : `tokens.emphasis.focal` (teinte chromatique saturée), épaisseur `borderWidth: 3.0`, rayon de point `pointRadius: 4.0`, opacité 1.0. Elle guide immédiatement le regard.
- **Série de Référence (*Benchmark / Baseline*)** : `tokens.emphasis.benchmark` (`#475569`), épaisseur `borderWidth: 2.0`, trait discontinu `borderDash: [4, 4]`, marqueur losange (`pointStyle: 'rectRot'`).
- **Séries Contextuelles (*Context / Competitors*)** : `tokens.emphasis.context` (`#CBD5E1` / ardoise clair), épaisseur affinée `borderWidth: 1.5`, marqueur réduit (`pointRadius: 2.0`).

### 2. Encodage des Prévisions & Projections Temporelles
- Si une série correspond à une projection prédictive :
  - `borderDash: [5, 5]`.
  - `pointStyle: 'crossRot'`.
  - Application du token `tokens.emphasis.forecastAlpha` ($0.45 - 0.55$) sur le trait.

### 3. Directionnalité & Valence Métier
- Lorsque les séries représentent des entités en concurrence sur une métrique orientée gain (*Croissance de chiffre d'affaires, Acquisition*) ou coût (*Taux de churn, Latence infrastructure*), les écarts de performance peuvent être colorés via `getValenceColor(tokens, direction, metricType)` :
  - Surperformance par rapport au benchmark $\to$ `tokens.status.success`.
  - Sous-performance critique $\to$ `tokens.status.danger`.

### 4. Double-Encodage Strict (Accessibilité CVD & Noir & Blanc)
Pour garantir une décodabilité absolue sans distinction de couleur :
1. **Canal 1 (Couleur)** : Palette contrastée respectant le ratio WCAG AA $\ge 4.5:1$.
2. **Canal 2 (Texture de ligne)** : Continue (Hero), tirets moyens `[4, 4]` (Benchmark), tirets longs `[5, 5]` (Forecast), pointillés fins `[2, 2]` (Objectifs).
3. **Canal 3 (Forme du point)** : Disque (`circle`) pour Hero, losange (`rectRot`) pour Benchmark, croix (`crossRot`) pour Forecast, triangle (`triangle`) pour Alerte/Anomalie.
4. **Canal 4 (Étiquetage direct)** : Nom de la série affiché en regard de la trajectoire terminale.

### 5. Guide d'Implémentation & Exemple de Code

```javascript
import { getEmphasisStyle, getThemeTokens } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

// Application des rôles d'accentuation Focus + Benchmark + Contexte
const heroStyle = getEmphasisStyle(tokens, 'focal');
const benchmarkStyle = getEmphasisStyle(tokens, 'benchmark');
const contextStyle = getEmphasisStyle(tokens, 'context');

const multiLineDatasets = [
  {
    label: 'Cloud Platform (Notre Offre)',
    data: [42, 78, 140, 230, 290],
    ...heroStyle
  },
  {
    label: 'Moyenne Marché',
    data: [130, 155, 180, 205, 218],
    ...benchmarkStyle
  },
  {
    label: 'Concurrent Historique',
    data: [95, 84, 68, 48, 38],
    ...contextStyle
  }
];
```

---

## 8. Sources & Références Académiques
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*, p. 170.
- **Few, S. (2008)**. *Dual-Scaled Axes in Graphs: Are They Ever Warranted?* Visual Business Intelligence Newsletter.
- **Ayres, P., & Sweller, J. (2005)**. *The Split-Attention Principle in Multimedia Learning*.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Capture Indexée 1D Synchronisée (MacKenzie 1992, ISO 9241-9)
- **Capture Temporelle Axiale 1D Multi-Séries** : Sur un graphique multi-lignes, l'interaction utilise une capture groupée `getTemporalInteractionOptions(tokens, { mode: 'index', axis: 'x', hitRadius: 12, hoverRadius: 6 })`. Le pointeur n'exige aucun ciblage micrométrique d'une courbe particulière : l'axe vertical temporel complet déclenche l'affichage synchronisé de toutes les séries superposées à cet instant $t$, comprimant l'Indice de Difficulté de Fitts à $ID \approx 1.1\text{ bits}$ ($MT \le 340\text{ms}$).
- **Glissière Temporelle Comparée** : Permet une comparaison instantanée inter-séries à chaque point sans rupture d'attention (*Split-Attention*).

### 2. Réactivité Temporelle & Latences Perceptives (Card-Moran-Newell 1983, Nielsen 1993)
- **Instantanéité Perceptive ($\le 100\text{ms}$)** : Réaction visuelle simultanée de l'ensemble des points d'intersection et mise en surbrillance sous les $100\text{ms}$ ($60\text{ fps}$).
- **Débounce & Hystérésis Physiologique** : Filtre d'entrée $\Delta t_{\text{enter}} = 80\text{ms}$ neutralisant les clignotements rapides et rémanence $\Delta t_{\text{exit}} = 150\text{ms}$ stabilisant l'infobulle groupée face aux micro-tremblements neuromusculaires.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Auto-Suffisance des *Details-on-Demand*** : L'infobulle groupée liste chaque série avec sa pastille chromatique / forme de point, son nom explicite et sa valeur formatée en typographie tabulaire `tokens.fontMono` (`font-variant-numeric: tabular-nums`).
- **Algorithme Anti-Occlusion Déterministe** : Positionnement via `computeAntiOcclusionTooltipPosition` avec déport vertical ($12\text{px}$) et inversion automatique vers le bas ($y < \text{margin}$) lors du survol de crêtes supérieures.

### 4. Constance d'Objet & Physique des Courbes d'Amorti (Heer & Robertson 2007, Penner 2002)
- **Cinétique Visuelle Congruente** : Propagation simultanée des lignes de gauche à droite selon la flèche du temps avec une courbe `easeOutQuad` ($450\text{ms}$).

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3 (Animation from Interactions)** : Durée ramenée à `0ms` dès détection de `@media (prefers-reduced-motion: reduce)` via `isReducedMotionPreferred()`.
- **Contraste Élevé & Typographie Tabulaire** : Ratios de contraste $\ge 16:1$ dans l'infobulle et $\ge 3:1$ pour les tracés de lignes, conformité WCAG AAA.
