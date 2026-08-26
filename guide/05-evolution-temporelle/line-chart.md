# Graphique Linéaire Simple (Single Line Chart)

## 1. Description & Principe Visuel
Le graphique linéaire encode une série de mesures quantitatives continues ordonnées le long de l'axe temporel horizontal $X$, en reliant les points de données consécutifs par des segments continus.
- **Encodage primaire** : Position sur échelle commune alignée (les sommets) et pente des segments (direction et vitesse de variation).
- **Loi de la Gestalt mobilisée** : Loi de Continuité (l'œil suit sans effort le tracé continu pour extraire la tendance globale).

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Visualiser l'évolution continue d'une variable quantitative dans le temps (heures, jours, mois, années).
- Détecter les tendances de fond (*trends*), les saisonnalités, les cycles et les ruptures d'évolution.
- Nombre de points idéal : de $N = 5$ à plusieurs centaines de points continus.

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Données catégorielles discrètes non temporelles** (ex: Département, Produit) : Relier deux produits par une ligne continue induit une fausse relation de continuité mathématique inexistante (faute cognitive majeure). 👉 *Remplacer par un Bar Chart*.
- **Mesures isolées très dispersées avec de nombreuses valeurs manquantes** : 👉 *Remplacer par un Scatter Plot*.

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Règle d'ajustement d'axe Y (*Non-zero baseline*)** : Contrairement aux barres, un graphique linéaire **peut ne pas démarrer à 0** si la variance locale est l'objet critique de l'analyse (ex: cours d'une action de 150€ à 155€, température corporelle entre 36.5°C et 39.5°C), **à condition expresse** que l'échelle soit clairement affichée et que le ratio d'aspect ne déforme pas artificiellement la pente (*Banking to 45 degrees*, Cleveland 1988).
- **Lissage modéré (*Tension*)** : Ne pas utiliser de courbes de Bézier trop agressives (`tension: 0.1` à `0.3` maximum) afin d'éviter d'inventer des sommets ou creux artificiels inexistants dans les données réelles.
- **Points visibles si $N \le 20$** : Si la série compte peu de points, afficher les disques (`pointRadius: 3` à `4`) pour marquer explicitement les moments exacts de mesure.

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Relier des catégories non ordonnées par une ligne continue**.
- ❌ **Écrasement vertical ou étirement excessif** : Fausse l'évaluation de la vitesse de variation perçue.

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Type natif : `'line'`

```javascript
const config = {
  type: 'line',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [{
      label: 'Chiffre d\'Affaires (k€)',
      data: [120, 135, 128, 142, 160, 175, 170, 185, 190, 210, 205, 230],
      borderColor: '#2563EB',
      backgroundColor: 'rgba(37, 99, 235, 0.08)',
      borderWidth: 2.5,
      tension: 0.2, // Lissage léger et rigoureux
      fill: true,
      pointRadius: 3.5,
      pointHoverRadius: 6,
      pointBackgroundColor: '#2563EB'
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 } }
      },
      y: {
        beginAtZero: false, // Permis pour zoomer sur la tendance
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { callback: (v) => `${v} k€` }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    }
  }
};
```

---

## Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle & Ratio 90/10 (Focus Narratif)
- **Courbe Cible (*Hero Curve*)** : Mise en saillance via `tokens.emphasis.focal` (couleur contrastée du thème), une épaisseur `borderWidth: 2.5` à `3` et des points de repérage `pointRadius: 3.5` à `4`.
- **Ligne de Référence (*Benchmark / Baseline*)** : Encodée avec `tokens.emphasis.benchmark` (`#475569`), avec `borderWidth: 1.5` et un tracé tireté `borderDash: [4, 4]`.
- **Séries de Contexte (*Muted Series*)** : Teinte désaturée `tokens.emphasis.context` (`#CBD5E1`), épaisseur affinée `1.0` et points minimisés `pointRadius: 0` ou `1.5`.

### 2. Encodage des Prévisions & Projections (*Forecast vs Actual*)
Pour isoler la partie réalisée de l'extrapolation future :
- **Segment Prévisionnel** : `borderDash: [5, 5]` obligatoire.
- **Opacité & Remplissage** : Application du token `tokens.emphasis.forecastAlpha` ($0.45 - 0.55$).
- **Style de Point** : Glyphe en croix `pointStyle: 'crossRot'` au lieu d'un cercle plein.
- **Libellé direct** : Mention explicite `"(Projection)"` dans la légende et les infobulles.

### 3. Directionnalité & Valence Métier (Gain vs Coût/Risque)
- **Métrique de Gain (*Revenu, Marge, CSAT, Trafic*)** : Trajectoire montante orientée `status.success` (`getValenceColor(tokens, 'up', 'gain')`).
- **Métrique Inversée (*Taux de Churn, Incident Latency, CAC, Coûts fixes*)** : Hausse associée à `status.danger` (`getValenceColor(tokens, 'up', 'cost')`) et baisse associée à `status.success` (`getValenceColor(tokens, 'down', 'cost')`).

### 4. Double-Encodage Strict (Accessibilité WCAG 2.1 & CVD)
- **Canal 1 (Couleur)** : Palette accessible sans dépendance au rouge/vert pur.
- **Canal 2 (Style de trait)** : Continu pour la donnée empirique, tireté `[5, 5]` pour les prévisions, pointillé `[2, 2]` pour les objectifs.
- **Canal 3 (Glyphes & Marqueurs)** : Disques pour le standard, losanges pour les benchmarks, triangles pour les anomalies statistiques ($> 2\sigma$).

### 5. Guide d'Implémentation & Exemple de Code

```javascript
import { getEmphasisStyle, getValenceColor, getThemeTokens } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

// Double encodage : Série historique + extrapolation prévisionnelle
const actualStyle = getEmphasisStyle(tokens, 'focal');
const forecastStyle = getEmphasisStyle(tokens, 'forecast');

const chartConfig = {
  type: 'line',
  data: {
    labels: ['T1', 'T2', 'T3', 'T4', 'T1 (P)', 'T2 (P)'],
    datasets: [
      {
        label: 'MRR Réalisé',
        data: [120, 140, 165, 190, null, null],
        ...actualStyle
      },
      {
        label: 'MRR Prévisionnel',
        data: [null, null, null, 190, 220, 255],
        ...forecastStyle
      }
    ]
  }
};
```

---

## 8. Sources & Références Académiques
- **Cleveland, W. S., McGill, M. E., & McGill, R. (1988)**. *The shape parameter of a two-variable graph*. Journal of the American Statistical Association, 83(402), 289-300.
- **Playfair, W. (1786)**. *The Commercial and Political Atlas*.
- **Cairo, A. (2016)**. *The Truthful Art*, Chapitre 7.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Capture Indexée 1D Temporelle (MacKenzie 1992, ISO 9241-9)
- **Capture Temporelle Axiale 1D** : L'acquisition d'un point sur une courbe temporelle ($2r = 3.5\text{px}$) ne contraint pas l'utilisateur à viser le sommet ponctuel : la tranche verticale entière de la coordonnée temporelle $X$ est active via `getTemporalInteractionOptions(tokens, { mode: 'index', axis: 'x', hitRadius: 12, hoverRadius: 6 })`. L'Indice de Difficulté de Fitts est ainsi compressé à $ID \approx 1.1\text{ bits}$ ($MT \le 340\text{ms}$).
- **Glissière Temporelle sans Saccade** : Le mode indexé sans intersection stricte permet d'inspecter l'ensemble de la série chronologique par balayage fluide.

### 2. Réactivité Temporelle & Latences Perceptives (Card-Moran-Newell 1983, Nielsen 1993)
- **Instantanéité Perceptive ($\le 100\text{ms}$)** : Réaction visuelle immédiate du point de mesure (agrandissement à `hoverRadius: 6px` et halo) en $100\text{ms}$ à $60\text{ fps}$.
- **Débounce & Hystérésis Physiologique** : Filtre d'entrée $\Delta t_{\text{enter}} = 80\text{ms}$ prévenant les sursauts d'infobulles lors d'un passage rapide et maintien de sortie $\Delta t_{\text{exit}} = 150\text{ms}$ neutralisant les micro-tremblements neuromusculaires.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Auto-Suffisance des *Details-on-Demand*** : L'infobulle affiche la période temporelle, le nom de la série, la valeur quantitative exacte avec typographie tabulaire `tokens.fontMono` (`font-variant-numeric: tabular-nums`) et son qualificatif (Réalisé vs Prévisionnel).
- **Algorithme Anti-Occlusion Déterministe** : Positionnement via `computeAntiOcclusionTooltipPosition` avec déport vertical de sécurité ($12\text{px}$) et inversion automatique vers le bas ($y < \text{margin}$) lors du survol de pics élevés.

### 4. Constance d'Objet & Physique des Courbes d'Amorti (Heer & Robertson 2007, Penner 2002)
- **Tracé Progressif Congruent** : Propagation de la ligne de gauche à droite suivant la flèche du temps avec une courbe `easeOutQuad` ($450\text{ms}$), respectant le principe de causalité physique.

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3 (Animation from Interactions)** : Durée ramenée à `0ms` dès détection de `@media (prefers-reduced-motion: reduce)` via `isReducedMotionPreferred()`.
- **Contraste Élevé & Typographie Tabulaire** : Ratios de contraste $\ge 16:1$ dans l'infobulle et $\ge 3:1$ pour les lignes et points, conformité WCAG AAA.
