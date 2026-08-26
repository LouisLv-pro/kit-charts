# Fiche Méthodologique : Histogramme (Histogram / Frequency Histogram)

> **Catégorie** : 03-distribution  
> **Type Chart.js** : `bar` (avec pré-agrégation par tranches et `categoryPercentage: 1.0`, `barPercentage: 0.98`)  
> **Niveau de précision Cleveland & McGill** : RANG 1 (Position le long d'une échelle commune) & RANG 3 (Longueur 1D pour l'effectif/densité) — Erreur 3-5%  
> **Dernière révision** : 2026-08-13  

---

## 1. Description & Principe visuel

L'**histogramme** (introduit par Karl Pearson en 1895) est la représentation graphique fondamentale pour analyser la distribution empirique d'une **variable quantitative continue**. Il découpe le domaine des valeurs observées en un ensemble d'intervalles adjacents et non chevauchants appelés **classes** ou **bins** (bacs), et élève au-dessus de chaque classe un rectangle dont la **surface** (ou la hauteur lorsque les classes sont de largeur égale) est strictement proportionnelle à l'effectif ou à la fréquence relative des observations tombant dans cet intervalle.

```
       POSITIONS ET SURFACES SUR ÉCHELLE CONTINUE (X)
  Fréquence / Densité (Y)
   40 ┤                   ┌────────┐
   30 ┤          ┌────────┤        │
   20 ┤  ┌───────┤        │        ├──┬─────┐
   10 ┤  │       │        │        │  │     │
    0 ┼──┴───────┴────────┴────────┴──┴─────┴──► Axis X (Variable Continue)
        [10-20[  [20-30[  [30-40[  [40-50[ [50-60[
      ◄── Intervalles contigus sans espace (Bins) ──►
```

### Encodages visuels mobilisés
1. **Position le long d'une échelle commune (Axe X)** : Emplacement continu des bornes de classes $[x_i, x_{i+1}[$.
2. **Hauteur / Longueur 1D (Axe Y)** : Nombre d'observations ($n_i$), fréquence relative ($f_i$) ou densité de probabilité ($h_i = \frac{f_i}{\Delta x_i}$).
3. **Surface 2D du rectangle** : Proportionnelle au nombre total d'observations dans la classe ($S_i \propto n_i$).
4. **Juxtaposition contiguë** : Absences d'espaces inter-barres (gaps) pour matérialiser la continuité mathématique de la variable sous-jacente.

### Distinguo fondamental : Histogramme vs Diagramme en Barres (Bar Chart)
Il est essentiel de lever la confusion courante entre l'histogramme et le diagramme en barres :
- **Diagramme en barres** : Représente une variable **qualitative / catégorielle** ou discrète. Les barres sont séparées par des espaces distincts (loi de proximité Gestalt) car l'axe $X$ n'a pas de continuité topologique.
- **Histogramme** : Représente une variable **quantitative continue**. Les barres sont jointives (adjacentes), car l'axe $X$ représente un continuum mathématique. La surface entière couverte par les barres représente $100\%$ des données.

### Mécanisme Neuro-Cognitif
L'histogramme mobilise le traitement visuel pré-attentif ($< 200\text{ ms}$) pour l'extraction automatique de la **forme globale d'une distribution**. Le cortex visuel primaire (V1-V4) identifie instantanément :
- Le **mode** (la classe la plus haute / la valeur la plus fréquente).
- La **symétrie** ou l'**asymétrie** (*skewness* à gauche ou à droite).
- L'**étalement** (la variance / dispersion des données).
- La **multimodalité** (présence de plusieurs pics révélant des sous-populations).
- Les **valeurs aberrantes isolées** (*outliers*).

---

## 2. Quand l'utiliser (Cas d'usage cibles)

### Types de variables adaptées
- **Axe X (Échelle continue)** : Variable quantitative continue (ex: âge, salaire, montant de commande, temps de réponse serveur en ms, tension artérielle, poids).
- **Axe Y (Métrique d'effectif)** : Effectif brut ($n$), Fréquence relative ($\%$) ou Densité empirique ($\text{fréquence} / \text{largeur de classe}$).

### Cas d'usage privilégiés
- **Exploration initiale de la forme d'une distribution** pour un échantillon de taille modérée à grande ($N \ge 30$).
- **Vérification des hypothèses de normalité** (distribution en cloche / gaussienne) avant l'application de tests statistiques paramétriques ($t$-test, ANOVA).
- **Détection de sous-populations masquées** (ex: deux pics distincts sur la distribution des temps de visite indiquant des profils d'utilisateurs mobiles vs desktop).
- **Contrôle de qualité industriel** (ex: tolérance de fabrication des pièces mécaniques, temps de latence réseau).

### Questions d'analyse résolues
- *Quelle est la forme générale de la distribution des données (normale, bimodale, étalée à droite) ?*
- *Où se concentre la majorité de la population et quelle est la classe modale ?*
- *Y a-t-il des anomalies ou des valeurs aberrantes aux extrêmes du domaine ?*

---

## 3. Quand NE PAS l'utiliser (Contre-indications)

```markdown
| Situation & Données | Pourquoi l'Histogramme échoue | Alternative Recommandée |
| :--- | :--- | :--- |
| **Très petits échantillons** ($N < 30$) | L'histogramme devient instable et dépendant du choix arbitraire des bornes de bins. | **Strip Plot** (`strip-plot.md`) ou **Beeswarm Plot** (`beeswarm-plot.md`) |
| **Comparaison simultanée de nombreuses distributions** ($> 3-4$ séries) | Superposer plusieurs histogrammes génère une occlusion visuelle totale et un chaos chromatique. | **Box Plot** (`box-plot.md`) ou **Density Plot** (`density-plot.md`) |
| **Données catégorielles ou qualitatives** (ex: pays, catégories de produits) | L'axe X n'est pas continu ; imposer la contiguïté viole la sémantique des données. | **Bar Chart** (`bar-chart.md`) |
| **Échantillons massifs continuels** ($N > 100\text{ }000$) | Le bruit d'échantillonnage s'estompe mais l'histogramme reste discret et moins fluide qu'une fonction continue. | **Density Plot (KDE)** (`density-plot.md`) |
| **Besoin de lire des statistiques synthétiques exactes** (médiane, IQR) | L'histogramme nécessite un calcul mental pour estimer la médiane et les quartiles. | **Box Plot** (`box-plot.md`) |
```

---

## 4. Règles cognitives & Meilleures pratiques spécifiques

### 4.1 La Règle Scientifique du Découpage en Bins (Binning)
Le choix du nombre de classes $k$ ou de la largeur de classe $h$ est la décision critique d'un histogramme. Un nombre $k$ trop faible lisse à l'excès (*oversmoothing*) et masque des détails essentiels (ex: bimodalité) ; un nombre $k$ trop élevé introduit du bruit d'échantillonnage (*undersmoothing*).

L'agent IA ou le concepteur **doit impérativement** utiliser une formule algorithmique standardisée :

1. **Règle de Freedman-Diaconis (Recommandation par défaut - Robuste aux Outliers)** :
   $$h = \frac{2 \cdot \text{IQR}(X)}{N^{1/3}} \quad \implies \quad k = \left\lceil \frac{\max(X) - \min(X)}{h} \right\rceil$$
   *Où $\text{IQR}$ est l'écart interquartile ($Q3 - Q1$) et $N$ le nombre d'observations.*

2. **Règle de Scott (Optimale pour distributions gaussiennes)** :
   $$h = \frac{3.49 \cdot s}{N^{1/3}}$$
   *Où $s$ est l'écart-type de l'échantillon.*

3. **Règle de Sturges (Adaptée aux petits échantillons normaux $N < 200$)** :
   $$k = 1 + \log_2(N) \quad \approx 1 + 3.322 \cdot \log_{10}(N)$$

```
      SUR-LISSAGE (k trop petit)         OPTIMAL (Freedman-Diaconis)         SOUS-LISSAGE (k trop grand)
  ┌───────────────────────────────┐   ┌───────────────────────────────┐   ┌───────────────────────────────┐
  │ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ │   │   ▄█▄                         │   │   █ ▄ █ ▄ █ ▄ █ ▄ █ ▄ █ ▄ █   │
  │ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ │   │ ▄█████▄   ▄█▄                 │   │ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ │
  └───────────────────────────────┘   └───────────────────────────────┘   └───────────────────────────────┘
   (Information bimodale perdue)        (Bimodalité révélée avec clarté)     (Bruit visuel chaotique)
```

### 4.2 Continuité Visuelle et Gestion des Gaps
- **Contiguïté des barres** : Contrairement aux diagrammes en barres qui utilisent un gap inter-barres de $20\%$ à $50\%$, l'histogramme doit réduire l'espace inter-barres à **zéro** (`categoryPercentage: 1.0`, `barPercentage: 1.0`) ou conserver un gap minimal d'inter-séparation de $1\text{px}$ à $2\text{px}$ (`barPercentage: 0.98`) pour marquer distinctement la frontière entre les bacs sans rompre la perception de continuité.
- **Bordure de séparation** : Appliquer une fine bordure contrastée (`borderColor: '#FFFFFF'` sur fond sombre ou `#0F172A` avec `borderWidth: 1`) pour découper les barres adjacents.

### 4.3 Ligne de Base Zéro et Ancrage Spatial ($Y_{\min} = 0$)
- L'axe vertical des fréquences/densités doit **strictement débuter à zero** (`scales.y.beginAtZero: true`). Tronquer l'axe Y fausse le ratio de surface de la distribution et viole le *Lie Factor* de Tufte ($0.95 \le \text{Lie Factor} \le 1.05$).

### 4.4 Palette Chromatique & Saillance Visuelle
- **Monochromie sémantique** : Utiliser **une seule couleur neutre et uniforme** pour toutes les barres (ex: Bleu Okabe-Ito `#0072B2` ou Slate `#334155`). Ne jamais appliquer une palette multicolore arc-en-ciel sur l'axe continu X.
- **Accents ciblés** : Utiliser une couleur d'accentuation (ex: `#D55E00`) exclusivement pour surligner une classe d'intérêt spécifique (ex: l'intervalle contenant la moyenne ou dépassant un seuil critique).

---

## 5. Erreurs fréquentes & Anti-patterns visuels

```
   [ ANTI-PATTERN 1 : Gaps séparateurs excessifs ]      [ ANTI-PATTERN 2 : Classes à largeurs inégales non ajustées ]
  Y                                                      Y (Effectifs bruts non ramenés à la densité)
 40 ┤     ┌──┐     ┌──┐                                 40 ┤          ┌──────────────────────────┐
 20 ┤ ┌──┐ │  │ ┌──┐ │  │                                 20 ┤ ┌──┐ ┌──┐│                          │
  0 ┼─┴──┴─┴──┴─┴──┴─┴──┴──►                              0 ┼─┴──┴─┴──┴┴──────────────────────────┴──►
     10-20 20-30 30-40 40-50                                   10-15 15-20            20-50
     (L'axe X ressemble à du catégoriel !)                  (La surface de la classe large trompe l'œil !)
```

1. **Confusion avec le Bar Chart (Espaces béants entre barres)** : Laisser un espacement large entre les barres donne l'illusion qu'il s'agit de catégories discrètes indépendantes.
2. **Bins à largeurs inégales sans ajustement par la densité** : Si une classe est 3 fois plus large qu'une autre, sa hauteur doit être divisée par 3 pour que la **surface** reste proportionnelle à l'effectif. Ne pas corriger la hauteur crée une distorsion visuelle massive.
3. **Nombre de bins fixe et arbitraire (ex: toujours 10 bins)** : Ignorer la taille $N$ du jeu de données produit des histogrammes soit totalement lissés soit excessivement hachés.
4. **Superposition de 3+ histogrammes opaques** : Créer des barres opaques chevauchantes rend les séries du fond invisibles. Utiliser des transparences ($0.3$) ou préférer des **Density Plots** (`density-plot.md`).
5. **Axe X non ordonné ou avec trous d'intervalles masqués** : Sauter les classes vides (effectif $= 0$) tronque la distance spatiale sur l'axe X et déforme la perception de la dispersion.

---

## 6. Recommandations d'implémentation Chart.js

### 6.1 Architecture technique : Type natif vs Plugins
En Chart.js v4+, l'histogramme est implémenté à l'aide du type natif **`bar`**. 
- **Pré-traitement des données** : Chart.js ne calcule pas automatiquement les bins à partir de données brutes d'un tableau continu. Le dataset doit être pré-agrégé en amont via un algorithme JS (fourni ci-dessous) calculant les bornes de classes selon la règle de Freedman-Diaconis.
- **Réglage visuel** : Le paramètre `categoryPercentage` est fixé à `1.0` et `barPercentage` à `0.98` (ou `1.0`) pour coller les barres.

### 6.2 Structure HTML & Accessibilité (DOM & ARIA)
```html
<div class="chart-container" role="region" aria-label="Histogramme de la distribution des temps de réponse" tabindex="0">
  <canvas id="histogramCanvas" role="img" aria-label="Histogramme montrant la distribution des temps de réponse en millisecondes. La classe modale se situe entre 200 et 250 ms avec 42 réquêtes." aria-describedby="histogram-fallback"></canvas>
  <div id="histogram-fallback" class="sr-only">
    <table>
      <caption>Distribution des temps de réponse (N = 250)</caption>
      <thead>
        <tr>
          <th scope="col">Intervalle de temps (ms)</th>
          <th scope="col">Effectif (Nombre de requêtes)</th>
          <th scope="col">Fréquence relative (%)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>[100 - 150[</td><td>12</td><td>4.8%</td></tr>
        <tr><td>[150 - 200[</td><td>35</td><td>14.0%</td></tr>
        <tr><td>[200 - 250[</td><td>84</td><td>33.6%</td></tr>
        <tr><td>[250 - 300[</td><td>62</td><td>24.8%</td></tr>
        <tr><td>[300 - 350[</td><td>38</td><td>15.2%</td></tr>
        <tr><td>[350 - 400[</td><td>19</td><td>7.6%</td></tr>
      </tbody>
    </table>
  </div>
</div>
```

### 6.3 Style CSS & Micro-Ergonomie (`tabular-nums`)
```css
.chart-container {
  position: relative;
  width: 100%;
  max-width: 800px;
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

### 6.4 Algorithme JS d'agrégation Binning & Configuration Chart.js v4+

```javascript
import { Chart } from 'chart.js/auto';

// 1. Algorithme de Calcul des Bins (Règle de Freedman-Diaconis avec secours et gestion de variance nulle)
function computeHistogramBins(rawData) {
  if (!rawData || rawData.length === 0) return [];
  const sorted = [...rawData].sort((a, b) => a - b);
  const n = sorted.length;
  const min = sorted[0];
  const max = sorted[n - 1];
  const range = max - min;
  
  let numBins;
  let actualBinWidth;
  let effMin = min;
  let effMax = max;

  // Gestion des jeux de données à variance nulle ou à valeur unique (range === 0 ou min === max)
  if (range === 0 || min === max) {
    effMin = min - 0.5;
    effMax = max + 0.5;
    numBins = 1;
    actualBinWidth = 1;
  } else {
    // Calcul de l'IQR (Interquartile Range)
    const q1 = sorted[Math.floor(n * 0.25)];
    const q3 = sorted[Math.floor(n * 0.75)];
    const iqr = q3 - q1;
    
    // Largeur de bin d'après Freedman-Diaconis (h = 2 * IQR / n^(1/3))
    let binWidth = (2 * iqr) / Math.cbrt(n);
    if (binWidth === 0 || isNaN(binWidth)) {
      // Secours selon la règle de Scott
      const mean = sorted.reduce((a, b) => a + b, 0) / n;
      const stdDev = Math.sqrt(sorted.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n);
      binWidth = (3.49 * stdDev) / Math.cbrt(n);
    }
    
    // Garde explicite si l'écart-type/IQR est nul ou si la division produit 0, NaN ou Infinity
    if (binWidth === 0 || isNaN(binWidth) || !isFinite(binWidth)) {
      binWidth = (effMax - effMin) / 5;
    }
    
    if (binWidth === 0 || isNaN(binWidth) || !isFinite(binWidth)) {
      binWidth = 1;
    }
    
    numBins = Math.max(1, Math.ceil((effMax - effMin) / binWidth));
    if (!isFinite(numBins) || isNaN(numBins) || numBins <= 0) {
      numBins = 1;
    }
    actualBinWidth = (effMax - effMin) / numBins;
    if (actualBinWidth === 0 || !isFinite(actualBinWidth) || isNaN(actualBinWidth)) {
      actualBinWidth = 1;
      numBins = 1;
    }
  }

  const bins = Array.from({ length: numBins }, (_, i) => ({
    xMin: effMin + i * actualBinWidth,
    xMax: effMin + (i + 1) * actualBinWidth,
    count: 0
  }));
  
  // Répartition des données dans les bins
  sorted.forEach(val => {
    let binIdx = Math.floor((val - effMin) / actualBinWidth);
    if (binIdx >= numBins) binIdx = numBins - 1;
    if (binIdx < 0) binIdx = 0;
    if (isNaN(binIdx)) binIdx = 0;
    bins[binIdx].count++;
  });
  
  return bins;
}


// 2. Préparation des Données
const rawSampleData = [
  120, 145, 160, 175, 180, 190, 195, 200, 205, 210, 212, 215, 218, 220, 222, 225,
  228, 230, 235, 240, 242, 245, 250, 255, 260, 265, 270, 280, 290, 310, 330, 380
];

const computedBins = computeHistogramBins(rawSampleData);
const labels = computedBins.map(b => `${Math.round(b.xMin)}-${Math.round(b.xMax)}`);
const counts = computedBins.map(b => b.count);

// Palette Okabe-Ito (Bleu principal)
const COLOR_PRIMARY = '#0072B2';
const COLOR_BORDER = '#0F172A';
const COLOR_TEXT = '#0F172A';

// 3. Configuration Chart.js
const config = {
  type: 'bar',
  data: {
    labels: labels,
    datasets: [{
      label: 'Effectif (Fréquence)',
      data: counts,
      backgroundColor: COLOR_PRIMARY,
      borderColor: COLOR_BORDER,
      borderWidth: 1,
      borderRadius: 0, // Conserve la forme rectangulaire stricte
      categoryPercentage: 1.0, // Coller les barres pour marquer la continuité
      barPercentage: 0.98 // Très fine séparation nette de 2% entre barres adjacentes
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#1E293B',
        titleFont: { family: 'Inter', size: 13, weight: '600' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          title: (items) => `Intervalle : [ ${items[0].label} ms [`,
          label: (context) => ` Effectif : ${context.parsed.y} observation(s)`
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Temps de réponse (ms)',
          color: COLOR_TEXT,
          font: { family: 'Inter', size: 12, weight: '600' }
        },
        grid: {
          display: false
        },
        ticks: {
          color: COLOR_TEXT,
          font: { family: 'Inter', size: 11 },
          maxRotation: 0,
          minRotation: 0
        }
      },
      y: {
        beginAtZero: true, // Règle d'or de fidélité
        title: {
          display: true,
          text: 'Fréquence (Nombre d\'observations)',
          color: COLOR_TEXT,
          font: { family: 'Inter', size: 12, weight: '600' }
        },
        grid: {
          color: '#F1F5F9'
        },
        ticks: {
          color: '#64748B',
          font: { family: 'Inter', size: 11 },
          precision: 0
        }
      }
    }
  }
};
```

### 6.5 Principes de Déterminisme pour Agents IA
1. **Obligation de Binning Algorithmique** : Ne jamais laisser un agent IA générer un nombre de bins de manière empirique sans appliquer explicitement la règle de Freedman-Diaconis ($h = 2 \cdot \text{IQR} / N^{1/3}$).
2. **Axe X ordonné et continu** : Interdire la réorganisation ou le tri des barres d'un histogramme par effectif décroissant. L'ordre spatial de l'axe X représente le continuum mathématique.
3. **Guardrail d'invalidation** : Si le dataset contient $N < 30$ points, basculer immédiatement vers un **Strip Plot** ou **Beeswarm Plot**.

---

## Règles Cognitives d'Accentuation & Valence

L'application des principes de sémiologie graphique et de charge cognitive sur l'histogramme structure l'exploration des distributions selon des règles strictes et déterministes :

### 1. Hiérarchie Visuelle & Ratio 90/10 (Edward Tufte)
- **Distribution de Contexte (90%)** : L'ensemble des classes standards de la distribution constitue le fond descriptif. Elles adoptent la teinte `tokens.emphasis.context` ou une couleur de palette désaturée (`opacity: 0.4–0.6`), évitant la saturation perceptive.
- **Classe Modale / Focus Narratif (10%)** : Le bin focal (ex: pic modal ou cohorte cible) est mis en exergue avec `tokens.emphasis.focal` (couleur saturée contrastée, opacité 1.0, contour contrasté).

### 2. Détection d'Anomalies & Classes Critiques
- **Règle de Tukey** : Toute classe située au-delà de $Q_3 + 1.5 \cdot \text{IQR}$ ou en-deçà de $Q_1 - 1.5 \cdot \text{IQR}$ contenant des effectifs est qualifiée d'anomalie statistique.
- **Encodage d'Anomalie** : Application de `tokens.emphasis.anomaly` (magenta/rouge saillant) sur les bacs extrêmes.
- **Seuils Métier & SLA** : Pour les métriques de latence ou de défauts (valence inversée), les classes dépassant le seuil de tolérance (ex: $> 100\text{ ms}$) sont encodées via `getValenceColor(tokens, 1, 'cost')` ($\to$ `tokens.status.danger`).

### 3. Matrice de Double-Encodage Strict
Pour garantir l'accessibilité universelle (WCAG 2.1 AA / daltonismes) :
- **Canal 1 (Couleur)** : `tokens.emphasis.focal`, `tokens.emphasis.anomaly`, `tokens.emphasis.context`.
- **Canal 2 (Bordure / Texture)** : Trait épais contrasté (`borderWidth: 2`) sur le bin focal/anomalie vs trait fin (`borderWidth: 0.5`) sur le contexte.
- **Canal 3 (Texte / Tooltip)** : Mention explicite dans le tooltip (`"Pic Modal (42.5%)"`, `"[ANOMALIE] > 1.5 IQR"`).

### 4. Exemple d'Implémentation Chart.js v4+ (Accentuation & Valence)

```javascript
import { createChart } from './template.js';
import { getEmphasisStyle, getValenceColor } from '../../themes/theme-tokens.js';

// Histogramme de latence serveur avec mise en valeur de la zone critique (> 85ms)
const latencyData = {
  labels: ['[10-25[', '[25-40[', '[40-55[', '[55-70[', '[70-85[', '[85-100[', '[100-115[', '[115-130['],
  datasets: [{
    label: 'Latence API (ms)',
    data: [14, 42, 88, 96, 51, 20, 7, 2],
    // Accentuation sélective : Contexte (0-4), Vigilance (5), Anomalie/Hors SLA (6-7)
    binRoles: ['context', 'context', 'focal', 'focal', 'context', 'warning', 'anomaly', 'anomaly'],
    metricType: 'latency'
  }]
};

// Initialisation avec le thème accessible
const chart = createChart('myCanvas', latencyData, 'colorbrewer-accessible');
```

---

## 7. Sources & Références académiques / clés

1. **Pearson, K. (1895)**. *Contributions to the Mathematical Theory of Evolution. II. Skew Variation in Homogeneous Material*. Philosophical Transactions of the Royal Society of London (A), 186, 343-414.
   - *Apport* : Formalisation originale du concept d'histogramme pour l'analyse de distributions empiriques.
2. **Freedman, D., & Diaconis, P. (1981)**. *On the histogram as a density estimator: $L_2$ theory*. Zeitschrift für Wahrscheinlichkeitstheorie und Verwandte Gebiete, 57(4), 453-476.
   - *Apport* : Dérivation mathématique de la règle de binning basée sur l'IQR et $N^{1/3}$, optimale contre les outliers.
3. **Scott, D. W. (1979)**. *On optimal and data-based histograms*. Biometrika, 66(3), 605-610.
   - *Apport* : Règle optimale de découpage en bins basée sur l'écart-type pour les distributions gaussiennes.
4. **Sturges, H. A. (1926)**. *The choice of a class interval*. Journal of the American Statistical Association, 21(153), 65-66.
   - *Apport* : Formule classique de découpage binomial en classes.
5. **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception: Theory, Computation, and Application to the Development of Graphic Methods*. JASA, 79(387), 531-554.
   - *Apport* : Évaluation de la précision de la position sur échelle commune et de la longueur.
6. **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.
   - *Apport* : Principes de sobriété visuelle, Data-Ink ratio et obligation de ligne de base zéro.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Capture Indexée 1D (MacKenzie 1992, ISO 9241-9)
- **Capture de Classe Axiale 1D** : L'acquisition d'un bin d'histogramme s'effectue le long de l'axe $X$ via `getSpatialInteractionOptions(tokens, { mode: 'index', axis: 'x', hitRadius: 12, hoverRadius: 6 })`. Le pointeur n'exige pas de viser le sommet de la barre : la tranche entière active l'infobulle, réduisant l'Indice de Difficulté de Fitts à $ID \approx 1.2\text{ bits}$ ($MT \le 350\text{ms}$).
- **Continuité Gestalt sans Rupture Spatiale** : La contiguïté des barres (`categoryPercentage: 0.98`, `barPercentage: 1.0`) associée au survol indexé procure une transition tactile continue d'une classe de fréquence à l'autre.

### 2. Réactivité Temporelle & Latences Perceptives (Card-Moran-Newell 1983, Nielsen 1993)
- **Instantanéité Perceptive ($\le 100\text{ms}$)** : Réaction visuelle de mise en surbrillance de la barre et contour contrasté sous les $100\text{ms}$ ($60\text{ fps}$).
- **Débounce & Hystérésis Physiologique** : Filtre d'entrée $\Delta t_{\text{enter}} = 80\text{ms}$ neutralisant les bruits d'activation lors du balayage de la distribution et maintien de sortie $\Delta t_{\text{exit}} = 150\text{ms}$ stabilisant l'infobulle contre les micro-tremblements neuromusculaires.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Auto-Suffisance des *Details-on-Demand*** : L'infobulle détaille l'intervalle exact de la classe $[x_a - x_b[$, l'effectif brut d'observations et le pourcentage relatif par rapport au total avec chiffres tabulaires `tokens.fontMono` (`font-variant-numeric: tabular-nums`).
- **Algorithme Anti-Occlusion Déterministe** : Positionnement via `computeAntiOcclusionTooltipPosition` avec déport vertical de sécurité ($12\text{px}$) et inversion automatique de quadrant vers le bas lors de l'approche du bord supérieur ($y < \text{margin}$).

### 4. Constance d'Objet & Physique des Courbes d'Amorti (Heer & Robertson 2007, Penner 2002)
- **Croissance Verticale Congruente** : Émergence des barres depuis la ligne de base $Y=0$ avec une courbe de décélération `easeOutQuart` ($400\text{ms}$) respectant le principe de congruence physique de Tversky.

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3 (Animation from Interactions)** : Durée ramenée à `0ms` dès détection de `@media (prefers-reduced-motion: reduce)` via `isReducedMotionPreferred()`.
- **Contraste Élevé & Typographie Tabulaire** : Ratios de contraste $\ge 16:1$ dans l'infobulle et $\ge 3:1$ pour les bordures de bacs, conformité WCAG AAA.
