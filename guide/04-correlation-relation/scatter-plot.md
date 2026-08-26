# Fiche Méthodologique : Nuage de Points (Scatter Plot / Diagramme de Dispersion)

> **Catégorie** : 04-correlation-relation  
> **Type Chart.js** : `scatter` (Type natif)  
> **Niveau de précision Cleveland & McGill** : RANG 1 (Position le long d'échelles communes $X$ et $Y$) — Erreur 3-5%  
> **Dernière révision** : 2026-08-13  

---

## 1. Description & Principe visuel

Le **nuage de points** (ou *Scatter Plot*) est le modèle canonique pour l'exploration et la visualisation de la relation entre deux variables quantitatives continues. Chaque observation statistique est matérialisée par un marqueur ponctuel (généralement un disque) dont les coordonnées $(x, y)$ sur un plan cartésien à deux dimensions orthogonales correspondent aux valeurs prises par les deux variables.

### Encodages visuels mobilisés
1. **Position sur l'axe horizontal ($X$)** : Encodage quantitatif continu de la variable indépendante ou explicative.
2. **Position sur l'axe vertical ($Y$)** : Encodage quantitatif continu de la variable dépendante ou expliquée.
3. **Densité spatiale / Groupement (Gestalt)** : Émergence pré-attentive de formes, de clusters, de pentes de corrélation et de zones de vide.

```
       POSITION CARTÉSIENNE 2D (RANG 1 CLEVELAND & MCGILL)
  Y (Variable Dépendante)
 120 ┤                                      ● (Outlier)
 100 ┤                                  ●  ●
  80 ┤                            ●   ●  ●   ◄─ Ligne de tendance
  60 ┤                      ●   ●   ● (Régression linéaire)
  40 ┤                ●   ●   ●
  20 ┤          ●   ●   ●
   0 ┼──┬───────┴───┴───┴───┴───┴───┴───┴───┴──► X (Variable Indépendante)
       0       10  20  30  40  50  60  70  80
```

### Mécanisme Neuro-Cognitif & Justification Académique
Le nuage de points exploite le canal pré-attentif le plus performant du système visuel humain : la **position spatiale 2D le long d'échelles communes** (Cleveland & McGill, 1984, Rang 1). La loi psychophysique de Stevens (1957) attribue à la perception de la position cartésienne un exposant $\beta = 1.0$, garantissant une fidélité absolue entre les variations numériques et le décodage perceptif sans distorsion non linéaire.

Selon les **Lois de la Gestalt** :
- **Loi de Proximité** : Le cerveau regroupe instantanément (en moins de $200\text{ ms}$) les points spatialement proches pour percevoir des structures globales (*clusters* ou sous-populations).
- **Loi de Continuité** : L'intégration d'une ligne de tendance (régression linéaire ou lissage LOWESS) permet au système visuel d'aligner le décodage des points sur une trajectoire continue.

#### Le Quartet d'Anscombe (1973) et le Datasaurus Dozen (2017)
L'argument scientifique majeur en faveur du Scatter Plot repose sur les travaux d'Francis Anscombe (1973) et la démonstration étendue de Matejka & Fitzmaurice (2017). Des jeux de données possédant des statistiques descriptives strictement identiques (moyenne $\bar{x}$, moyenne $\bar{y}$, variance $s_x^2$, $s_y^2$, corrélation $r = 0.816$ et équation de régression $y = 3.0 + 0.5x$) présentent en réalité des structures géométriques totalement disparates (relation linéaire pure, courbe quadratique, présence d'un *outlier* influent unique, ou alignement vertical). Le Scatter Plot est l'outil indispensable pour éviter le piège des résumés statistiques aveugles.

---

## 2. Quand l'utiliser (Cas d'usage cibles)

### Types de variables adaptées
- **Axe X** : Variable quantitative continue (ex: dépense R&D, âge, taux de chômage, investissement publicitaire).
- **Axe Y** : Variable quantitative continue (ex: chiffre d'affaires, espérance de vie, chiffre de ventes, taux de conversion).

### Cas d'usage privilégiés
- **Évaluation de la corrélation bivariée** : Identifier la nature (linéaire, polynomiale, exponentielle, nulle), le sens (positive ou négative) et la force de la relation entre deux métriques.
- **Détection des anomalies et outliers bivariés** : Repérer les points qui s'écartent significativement de la distribution conjointe, même s'ils paraissent normaux en analyse univariée.
- **Identification de sous-groupes (*Clustering*)** : Détecter la présence de sous-populations naturelles dans les données sans a priori algorithmique.
- **Diagnostic de régression et hétéroscédasticité** : Vérifier si la variance des erreurs augmente ou diminue en fonction de la variable $X$.

### Questions d'analyse résolues
- *Existe-t-il une relation mesurable entre le budget marketing et les ventes ?*
- *La hausse du prix de vente réduit-elle le volume d'achat de manière linéaire ou logarithmique ?*
- *Y a-t-il des anomalies atypiques parmi nos filiales par rapport au modèle général ?*

---

## 3. Quand NE PAS l'utiliser (Contre-indications)

| Situation & Données | Pourquoi le Scatter Plot échoue | Alternative Recommandée |
| :--- | :--- | :--- |
| **Variables catégorielles ou ordinales à faible cardinalité** | Les points s'empilent en grilles rigides et se superposent totalement (*point grid locking*). | **Strip Plot** (avec jittering), **Beeswarm Plot** ou **Box Plot** |
| **Série temporelle séquentielle unique** ($X = \text{Temps}$) | Perte de la séquence temporelle continue ; l'œil perçoit des points isolés au lieu d'une trajectoire. | **Line Chart** (`line-chart.md`) |
| **Très grand volume de données** ($N > 50\text{ }000$) | Saturation complète de l'écran (*Overplotting disaster*) formant une masse d'encre uniforme sans relief. | **2D Density Heatmap / Hexbin Plot** (`hexbin-plot.md`) |
| **Plus de 3 variables quantitatives simultanées** | La surcharge de canaux (X, Y, Taille, Couleur, Forme) détruit la lisibilité pré-attentive. | **Scatter Plot Matrix (SPLOM)** ou **Réduction de dimension (PCA / t-SNE)** |

---

## 4. Règles cognitives & Meilleures pratiques spécifiques

### 4.1 Stratégies d'atténuation du chevauchement (*Overplotting Mitigation*)
Lorsque le nombre d'observations $N$ dépasse une cinquantaine de points, les disques se superposent et masquent la densité réelle des données. 4 règles déterministes doivent être appliquées :

1. **Transparence Alpha dynamique** :
   $$\alpha = \max\left(0.15, \frac{1}{\sqrt{N / 20}}\right)$$
   Pour $N \approx 500$, utiliser une opacité de $20\%$ à $30\%$ (`rgba(0, 114, 178, 0.25)`). La superposition des couches d'alpha crée une saturation naturelle révélant les zones de haute densité.
2. **Dimensionnement des marqueurs** :
   - $N < 100$ : `pointRadius: 5` à `6`
   - $100 \le N \le 1000$ : `pointRadius: 3` à `4`
   - $N > 1000$ : `pointRadius: 1.5` à `2` (ou passer en Hexbin/Density).
3. **Bordures de points fines** : Conserver un contour légèrement plus sombre (`borderWidth: 1`, `borderColor: 'rgba(255,255,255,0.8)'`) pour séparer les éléments adjacents.
4. **Bruit aléatoire contrôlé (*Jittering*)** : Si $X$ ou $Y$ comporte des données arrondies ou discrétisées, ajouter une variation aléatoire minime ($\pm 0.5\%$ de l'amplitude de l'axe) pour désagréger les superpositions strictes.

```
[ ÉCHEC : Points opaques géants (Masse d'encre) ]   [ SUCCÈS : Alpha Transparence + Rayon réduit ]
 Y                                                 Y
 ┤   █████████                                     ┤   ░▒▓█▓▒░
 ┤   ███████████                                   ┤  ░▒▓███▓▒░
 0 ┼─────────────► X                               0 ┼─────────────► X
 (Densité réelle masquée, overplotting 100%)       (Gradation de densité visuelle nette)
```

### 4.2 Ligne de tendance & Lissage (Loi de Continuité)
- **Ligne de Régression Linéaire ($y = mx + b$)** : Indispensable pour guider le décodage de la tendance globale. Doit être tracée en trait discontinu ou semi-transparent (`borderDash: [6, 4]`, `borderWidth: 2`) avec une couleur d'accentuation contrastée (ex: rouge vermillon `#D55E00`) pour ne pas dissimuler les points individuels.
- **R-carré ($R^2$), Pearson $r$ & Équation** : Toujours afficher le coefficient de corrélation $r$, le coefficient de détermination $R^2$ et la p-valeur dans un sous-titre ou un cartouche discret (`Data-Ink Ratio` élevé).

### 4.3 Rapport d'aspect & Cadrage des axes (*Banking to 45 degrees*)
- **Rapport d'aspect (Aspect Ratio)** : Privilégier un conteneur carré ($1:1$) ou légèrement rectangulaire ($4:3$). Un graphique trop étiré horizontalement écrase la pente visuelle et fait paraître une corrélation forte comme négligeable.
- **Banking to 45 degrees (Cleveland, 1988)** : Régler les amplitudes des axes de sorte que la pente moyenne des segments de tendance avoisine $45^\circ$, angle pour lequel la sensibilité de la rétine humaine aux variations d'orientation est maximale.
- **Ligne de base non nulle autorisée** : Contrairement aux diagrammes en barres, l'axe $X$ et l'axe $Y$ d'un Scatter Plot **n'ont pas l'obligation de démarrer à 0** (`beginAtZero: false`). L'objectif étant d'analyser la variance et la co-variance, les échelles doivent être cadrées au plus près de l'étendue des données ($[\min - 5\%, \max + 5\%]$) avec un repère visuel clair.

---

## 5. Erreurs fréquentes & Anti-patterns visuels

```
  [ ANTI-PATTERN 1 : Spaghetti d'interconnexion ]    [ ANTI-PATTERN 2 : Sur-encodage multi-canaux ]
   Y                                                 Y
  10 ┤   /\  /\                                     10 ┤  ▲  ■  ●   ★
   5 ┤  /  \/  \                                     5 ┤  ★  ▲  ■   ●
   0 ┼──┴───┴───┴──► X                               0 ┼──┴───┴───┴──► X
   (Ne jamais relier des points non temporels !)     (5 formes + 5 couleurs = Chaos cognitif)
```

1. **Relier les points par une ligne continue désordonnée** : Erreur classique consistant à activer `showLine: true` sur un dataset non ordonné. Cela crée un gribouillis incompréhensible ("effet plat de spaghetti"). Les lignes ne doivent relier les points que si l'axe $X$ représente une séquence temporelle ordonnée (*Connected Scatter Plot*).
2. **Utiliser des formes de marqueurs multiples non nécessaires** : Mélanger carrés, triangles, étoiles et cercles surcharge inutilement la mémoire de travail (Sweller). Conserver des disques circulaires uniformes.
3. **Penser que Corrélation = Causalité (*Cum hoc ergo propter hoc*)** : Anti-pattern d'interprétation. Toujours rappeler dans le titre ou les notes de cadrage qu'une corrélation visuelle n'implique aucun lien causal direct.
4. **Masquer l'échelle avec des échelles logarithmiques non étiquetées** : Si une transformation $\log$ est appliquée sur un axe pour gérer une distribution asymétrique, conserver des étiquettes en valeurs réelles (ex: $1, 10, 100, 1000$) plutôt que la valeur du $\log$ ($0, 1, 2, 3$).

---

## 6. Recommandations d'implémentation Chart.js

### 6.1 Architecture technique : Type natif `'scatter'`
Chart.js prend en charge nativement le Nuage de Points via le type natif `'scatter'`. La structure de données exige un tableau d'objets `{x: number, y: number}`.

Pour afficher la droite de tendance ainsi que les coefficients statistiques sans dépendance externe, nous utilisons des algorithmes JavaScript natifs calculant la corrélation de Pearson $r$, la corrélation de rang de Spearman $\rho$, et la droite de régression linéaire par la méthode des moindres carrés ordinaires (OLS).

### 6.2 Structure HTML & Accessibilité (DOM & ARIA)
```html
<div class="chart-container" role="region" aria-label="Nuage de points : Relation entre dépenses R&D et Chiffre d'affaires" tabindex="0">
  <canvas id="scatterPlotCanvas" role="img" aria-label="Nuage de points montrant une corrélation positive forte (Pearson r = 0.91, R² = 0.84) entre le budget R&D et le chiffre d'affaires sur 45 filiales." aria-describedby="scatter-fallback"></canvas>
  <div id="scatter-fallback" class="sr-only">
    <table>
      <caption>Données du Nuage de Points : R&D (k€) vs Chiffre d'affaires (M€)</caption>
      <thead>
        <tr>
          <th scope="col">Filiale / Observation</th>
          <th scope="col">Budget R&D (k€)</th>
          <th scope="col">Chiffre d'affaires (M€)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Filiale Alpha</td><td>120</td><td>4.2</td></tr>
        <tr><td>Filiale Bêta</td><td>250</td><td>7.8</td></tr>
        <tr><td>Filiale Gamma</td><td>310</td><td>9.1</td></tr>
        <tr><td>Filiale Delta</td><td>450</td><td>12.4</td></tr>
        <tr><td>Filiale Epsilon</td><td>520</td><td>13.9</td></tr>
      </tbody>
    </table>
  </div>
</div>
```

### 6.3 Style CSS & Typographie Tabulaire (`tabular-nums`)
```css
.chart-container {
  position: relative;
  width: 100%;
  max-width: 750px;
  aspect-ratio: 4 / 3; /* Cadrage Banking to 45° */
  margin: 0 auto;
  font-family: Inter, system-ui, -apple-system, sans-serif;
  font-variant-numeric: tabular-nums lining-nums;
  font-feature-settings: "tnum" 1, "lnum" 1;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### 6.4 Algorithmes Statistiques JS & Configuration Chart.js v4+

```javascript
import { Chart } from 'chart.js/auto';

// 1. Algorithme de calcul du coefficient de corrélation de Pearson (r)
function calculatePearsonR(points) {
  const n = points.length;
  if (n < 2) return 0;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;
  for (let i = 0; i < n; i++) {
    const { x, y } = points[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
    sumYY += y * y;
  }
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
  return denominator === 0 ? 0 : numerator / denominator;
}

// 2. Algorithme de calcul du coefficient de corrélation de rang de Spearman (rho)
function calculateSpearmanRho(points) {
  const n = points.length;
  if (n < 2) return 0;

  // Fonction interne de conversion d'un vecteur numérique en rangs avec gestion des égalités (ties)
  const getRanks = (arr) => {
    const sorted = arr.map((val, idx) => ({ val, idx })).sort((a, b) => a.val - b.val);
    const ranks = new Array(n);
    let i = 0;
    while (i < n) {
      let j = i;
      while (j < n - 1 && sorted[j + 1].val === sorted[i].val) {
        j++;
      }
      const count = j - i + 1;
      const avgRank = (i + 1 + j + 1) / 2;
      for (let k = i; k <= j; k++) {
        ranks[sorted[k].idx] = avgRank;
      }
      i = j + 1;
    }
    return ranks;
  };

  const xRanks = getRanks(points.map(p => p.x));
  const yRanks = getRanks(points.map(p => p.y));

  const rankPairs = points.map((_, idx) => ({ x: xRanks[idx], y: yRanks[idx] }));
  return calculatePearsonR(rankPairs); // Spearman est le Pearson des rangs
}

// 3. Algorithme de Régression Linéaire OLS (Moindres Carrés Ordinaires : y = mx + b)
function calculateLinearRegression(points) {
  const n = points.length;
  if (n < 2) return { slope: 0, intercept: 0, r2: 0, trendPoints: [] };

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumXX += p.x * p.x;
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const pearsonR = calculatePearsonR(points);
  const r2 = pearsonR * pearsonR;

  const minX = Math.min(...points.map(p => p.x));
  const maxX = Math.max(...points.map(p => p.x));

  return {
    slope,
    intercept,
    pearsonR,
    r2,
    trendPoints: [
      { x: minX, y: slope * minX + intercept },
      { x: maxX, y: slope * maxX + intercept }
    ]
  };
}

// Jeu de données d'exemple
const rawData = [
  { x: 105, y: 3.2 }, { x: 120, y: 4.2 }, { x: 135, y: 3.9 }, { x: 150, y: 5.1 },
  { x: 175, y: 5.8 }, { x: 190, y: 5.4 }, { x: 210, y: 6.7 }, { x: 230, y: 7.1 },
  { x: 250, y: 7.8 }, { x: 275, y: 8.3 }, { x: 290, y: 7.9 }, { x: 310, y: 9.1 },
  { x: 340, y: 9.8 }, { x: 360, y: 10.4 }, { x: 380, y: 11.2 }, { x: 410, y: 11.8 },
  { x: 430, y: 11.5 }, { x: 450, y: 12.4 }, { x: 480, y: 13.1 }, { x: 520, y: 13.9 },
  { x: 550, y: 14.8 }, { x: 580, y: 15.2 }, { x: 600, y: 16.0 }, { x: 210, y: 9.5 }
];

// Calculs statistiques
const regression = calculateLinearRegression(rawData);
const spearmanRho = calculateSpearmanRho(rawData);

// Palettes Okabe-Ito (WCAG compliant)
const COLOR_POINTS = 'rgba(0, 114, 178, 0.4)';  // Bleu Okabe-Ito avec Alpha 40%
const COLOR_BORDER = '#004C75';                  // Contour bleu sombre
const COLOR_TREND = '#D55E00';                   // Vermillon pour ligne de tendance
const COLOR_TEXT = '#0F172A';                    // Slate 900

const config = {
  type: 'scatter',
  data: {
    datasets: [
      {
        label: 'Filiales (R&D vs CA)',
        data: rawData,
        backgroundColor: COLOR_POINTS,
        borderColor: COLOR_BORDER,
        borderWidth: 1,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#0072B2',
        order: 2
      },
      {
        type: 'line',
        label: `Régression : y = ${regression.slope.toFixed(3)}x + ${regression.intercept.toFixed(2)} (r = ${regression.pearsonR.toFixed(2)}, R² = ${regression.r2.toFixed(2)})`,
        data: regression.trendPoints,
        borderColor: COLOR_TREND,
        borderWidth: 2,
        borderDash: [6, 4],
        pointRadius: 0,
        fill: false,
        tooltip: { enabled: false },
        order: 1
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          font: { family: 'Inter', size: 12 }
        }
      },
      tooltip: {
        backgroundColor: '#1E293B',
        titleFont: { family: 'Inter', size: 13, weight: '600' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          label: (context) => {
            if (context.dataset.type === 'line') return '';
            const pt = context.raw;
            return ` R&D : ${pt.x.toLocaleString('fr-FR')} k€ | CA : ${pt.y.toLocaleString('fr-FR', { minimumFractionDigits: 1 })} M€`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'Budget R&D Annuel (en milliers d\'euros)',
          color: COLOR_TEXT,
          font: { family: 'Inter', size: 12, weight: '600' }
        },
        grid: { color: '#F1F5F9' },
        ticks: {
          color: '#64748B',
          font: { family: 'Inter', size: 11 },
          callback: (val) => `${val} k€`
        }
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: 'Chiffre d\'Affaires Réalisé (en millions d\'euros)',
          color: COLOR_TEXT,
          font: { family: 'Inter', size: 12, weight: '600' }
        },
        grid: { color: '#F1F5F9' },
        ticks: {
          color: '#64748B',
          font: { family: 'Inter', size: 11 },
          callback: (val) => `${val} M€`
        }
      }
    }
  }
};
```

### 6.5 Principes de Déterminisme pour Agents IA
1. **Transparence Alpha Dynamique en fonction de $N$** : Appliquer systématiquement la formule $\alpha = \max\left(0.15, \frac{1}{\sqrt{N / 20}}\right)$ dès que $N \ge 50$ pour prévenir le masquage par overplotting.
2. **Calcul impératif de la droite de tendance OLS** : Toujours associer un Nuage de Points à sa droite de tendance et aux coefficients $r$ et $R^2$ calculés algorithmiquement (ne jamais estimer à l'œil).
3. **Seuil d'invalidation (Bascule automatique)** : Si $N > 50\text{ }000$, l'agent IA **doit impérativement refuser** le type `scatter` natif et basculer sur un **Hexbin Plot / 2D Density Heatmap** (`hexbin-plot.md`). Si les variables sont purement ordinales/discrètes à faible cardinalité, basculer sur un **Strip Plot** avec jittering.

---

## Règles Cognitives d'Accentuation & Valence

Le nuage de points bivarié (Scatter Plot) combine le plus haut niveau de fidélité perceptive (Cleveland & McGill, Rang 1). L'application des règles d'accentuation cognitive permet d'isoler immédiatement les signaux d'intérêt :

### 1. Hiérarchie Visuelle & Ratio 90/10 (Tufte)
- **Points de Contexte (90%)** : Le corps principal des observations bivariées adopte `tokens.emphasis.context` (`#CBD5E1` / gris clair) avec un rayon modéré (`pointRadius: 4`) et une opacité $\alpha \approx 0.45$.
- **Points Héroïques / Entreprises Cibles (10%)** : Les éléments clés de l'analyse (ex: votre entreprise ou le leader sectoriel) utilisent `tokens.emphasis.focal` (couleur saturée, `pointRadius: 7`, contour contrasté).
- **Droite de Tendance (Benchmark)** : La droite de régression linéaire représente la trajectoire attendue et utilise `tokens.emphasis.benchmark` avec des tirets `[6, 6]`.

### 2. Détection d'Anomalies & Résidus Élevés
- **Critère des Résidus ($> 2\sigma$)** : Tout point s'écartant fortement de la droite de régression ($|y_i - \hat{y}_i| > 2 \cdot \sigma_{\text{résiduelle}}$) est qualifié d'anomalie de corrélation.
- **Double Encodage Strict des Anomalies** :
  - **Couleur** : `tokens.emphasis.anomaly` (magenta / rouge vif saillant).
  - **Forme du Glyphe** : Glyphe géométrique distinct (`pointStyle: 'triangle'`).
  - **Taille** : Rayon augmenté (`pointRadius: 8`).
  - **Tooltip** : Libellé explicite de l'écart (`"Anomalie de rentabilité : +34% vs modèle"`).

### 3. Valence Métier & Quadrants
- Les observations situées dans le quadrant favorable (ex: Haute croissance + Faible coût) adoptent `status.success` (`#2E7D32`), tandis que les observations dans le quadrant défavorable adoptent `status.danger` (`#C62828`).

### 4. Exemple d'Implémentation Chart.js v4+ (Accentuation & Valence)

```javascript
import { createChart } from './template.js';
import { getEmphasisStyle, getValenceColor } from '../../themes/theme-tokens.js';

// Corrélation R&D vs Croissance avec leader identifié et anomalie isolée
const techData = {
  datasets: [{
    label: 'Entreprises Tech',
    data: [
      { x: 4.2, y: 5.1, role: 'context' },
      { x: 6.1, y: 8.8, role: 'context' },
      { x: 8.0, y: 10.5, role: 'context' },
      { x: 12.4, y: 21.0, role: 'context' },
      { x: 16.0, y: 28.5, role: 'context' },
      { x: 19.8, y: 35.8, role: 'focal' }, // Hero point
      { x: 7.3, y: 38.2, role: 'anomaly' } // Anomalie forte (croissance exceptionnelle à faible R&D)
    ]
  }]
};

// Initialisation avec le thème ColorBrewer Accessible
const chart = createChart('myCanvas', techData, 'colorbrewer-accessible');
```

---

## 7. Sources & Références académiques / clés

1. **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception: Theory, Computation, and Application to the Development of Graphic Methods*. Journal of the American Statistical Association, 79(387), 531-554.
   - *Contribution* : Établissement de la position 2D sur échelles communes comme canal quantitatif le plus précis.
2. **Anscombe, F. J. (1973)**. *Graphs in Statistical Analysis*. The American Statistician, 27(1), 17-21.
   - *Contribution* : Démonstration historique de la nécessité absolue de visualiser les données par Scatter Plot pour révéler la structure que les statistiques récapitulatives masquent.
3. **Matejka, J., & Fitzmaurice, G. (2017)**. *Same Stats, Different Graphs: Generating Datasets with Varied Appearance and Identical Summary Statistics through Simulated Annealing*. ACM CHI 2017.
   - *Contribution* : Extension moderne d'Anscombe (Datasaurus Dozen) confirmant la portée du Scatter Plot.
4. **Cleveland, W. S. (1988)**. *A Graph for Estimating the Optimal Transformation in Regression*. Journal of the American Statistical Association, 83(402), 507-510.
   - *Contribution* : Règle de cadrage *Banking to 45 degrees* pour la perception optimale des pentes.
5. **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.
   - *Contribution* : Élimination du bruit visuel et maximalisation du Data-Ink Ratio.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Ciblage Spatial 2D Continu (MacKenzie 1992, ISO 9241-9)
- **Ciblage Spatial 2D & Rayon d'Attraction Élargi** : L'acquisition d'un point bivarié ($2r = 4\text{px}$) à distance $D = 350\text{px}$ requiert $MT \approx 1424\text{ms}$ ($ID = 6.47\text{ bits}$). En appliquant les options spatiales `getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 14, hoverRadius: 7 })`, la surface effective de pointage atteint $W_e = 32\text{px}$, réduisant $ID$ à $3.58\text{ bits}$ ($MT \approx 846\text{ms}$), soit un gain de **$40.6\%$** et l'élimination des erreurs de visée.
- **Partition Spatiale de Voronoï Implicite** : Le mode `nearest` en coordonnées $XY$ sans intersection stricte permet de balayer le plan bivarié sans rupture tactile ni saccade.

### 2. Réactivité Temporelle & Latences Perceptives (Card-Moran-Newell 1983, Nielsen 1993)
- **Instantanéité Perceptive ($\le 100\text{ms}$)** : Réaction visuelle immédiate du point survolé (agrandissement à `hoverRadius: 7px` et halo contrasté) en $100\text{ms}$ à $60\text{ fps}$.
- **Débounce & Hystérésis Physiologique** : Filtre d'entrée $\Delta t_{\text{enter}} = 80\text{ms}$ pour prévenir les infobulles intempestives lors de traversées rapides du nuage, et persistance $\Delta t_{\text{exit}} = 150\text{ms}$ stabilisant l'infobulle face aux micro-tremblements moteurs.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Auto-Suffisance des *Details-on-Demand*** : L'infobulle détaille le nom de la série ou de l'entité, les coordonnées exactes $(X, Y)$ au format tabulaire `tokens.fontMono` (`font-variant-numeric: tabular-nums`) et son statut sémantique (Focal, Contexte, Anomalie).
- **Algorithme Anti-Occlusion Déterministe** : Positionnement via `computeAntiOcclusionTooltipPosition` avec déport vertical ($12\text{px}$) et inversion automatique de quadrant vers le bas lors de l'approche du bord supérieur ($y < \text{margin}$).

### 4. Constance d'Objet & Physique des Courbes d'Amorti (Heer & Robertson 2007, Penner 2002)
- **Cinétique d'Apparition & Réorganisation Amortie** : Les transitions et ajustements de régression appliquent une cinétique `easeOutQuart` ($400\text{ms}$) sans oscillation parasite ($\zeta = 1.0$), prévenant la cécité au changement (*Change Blindness*).

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3 (Animation from Interactions)** : Durée ramenée à `0ms` dès détection de `@media (prefers-reduced-motion: reduce)` via `isReducedMotionPreferred()`.
- **Contraste Élevé & Typographie Tabulaire** : Ratios de contraste $\ge 16:1$ pour le texte d'infobulle et $\ge 3:1$ pour les points et bordures, conformité WCAG AAA.
