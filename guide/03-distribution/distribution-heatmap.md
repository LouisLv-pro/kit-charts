# Fiche Méthodologique : Heatmap de Distribution (2D Density Heatmap / Matrix Distribution Plot)

> **Catégorie** : 03-distribution  
> **Type Chart.js** : `matrix` (via le plugin officiel `chartjs-chart-matrix`)  
> **Niveau de précision Cleveland & McGill** : RANG 1 (Position spatiale 2D de la cellule) & RANG 7 (Luminance / Saturation pour l'estimation de densité)  
> **Dernière révision** : 2026-08-13  

---

## 1. Description & Principe visuel

La **Heatmap de Distribution** (également appelée *2D Density Heatmap*, *Binned Histogram Matrix* ou *Carte de Chaleur de Distribution*) est une représentation bidimensionnelle de la densité de fréquence ou de la distribution conjointe de données.

L'espace bidimensionnel défini par l'axe $X$ et l'axe $Y$ est découpé en une grille de cellules rectangulaires (ou réceptacles, *bins*). La couleur (luminance, saturation ou teinte) de chaque cellule encode la quantité absolue d'observations ou la densité de probabilité relative tombant dans ce réceptacle spatial.

### Encodages visuels mobilisés
1. **Position spatiale bidimensionnelle (Axes X et Y)** : Les deux dimensions décrivent soit 2 variables quantitatives continues (distribution 2D), soit 1 variable continue croisée avec 1 variable temporelle/catégorielle.
2. **Luminance & Saturation de Couleur (Échelle Séquentielle)** : La valeur numérique de fréquence (effectif $N_{\text{cellule}}$) est encodée par la graduation d'une palette perceptuellement uniforme (ex: Viridis, Cividis, YlGnBu).
3. **Structure de Grille Régulière** : Les cellules partagent toutes la même surface géométrique ($W \times H$), évitant ainsi le biais de distorsion des surfaces (loi de Stevens).

```
       GRILLE 2D DE DENSITÉ ET ÉCHELLE CHROMATIQUE SÉQUENTIELLE
  Y (Intervalle / Tranche)
  Tranche 4 ┤  [ 2 ] [ 5 ] [ 18] [ 4 ]
  Tranche 3 ┤  [ 1 ] [ 12] [ 85] [ 22]  ◄── Cellule [85] (Luminance Max / Couleur Intense)
  Tranche 2 ┤  [ 0 ] [ 45] [ 120] [ 60] ◄── Zone de pic de densité conjointe
  Tranche 1 ┤  [ 0 ] [ 8 ] [ 30] [ 5 ]
            └────┬─────┬─────┬─────┬────► X (Temps / Catégories / Tranches)
                Bin 1 Bin 2 Bin 3 Bin 4

  Échelle de Couleur (Viridis/Luminance Monotone) :
  [ 0 ] ░░  ──►  [ 50 ] ▒▒  ──►  [ 120 ] ██  (Clair/Lumineux = Densité Élevée)
```

### Mécanisme Neuro-Cognitif
La Heatmap de Distribution exploite le traitement pré-attentif massif de la **luminance et du contraste chromatique** ($< 100\text{ ms}$). Selon la hiérarchie de Cleveland & McGill, le canal chromatique (Rang 7) est incalculable mentalement pour déduire des ratios numériques précis (ex: "la cellule A contient-elle exactement 2.3 fois plus de points que la cellule B ?"). 

Cependant, il excelle pour la **détection immédiate de motifs spatiaux globaux** (*pattern recognition*), l'identification des modes de distribution, et la révélation de corrélations non-linéaires sur des masses de données gigantesques ($N > 10^5$), totalement affranchies du phénomène de saturation visuelle (*overplotting*).

---

## 2. Quand l'utiliser (Cas d'usage cibles)

### Types de variables adaptées
- **Axe X** : Variable quantitative continue discrétisée en tranches (*bins*), variable temporelle (heures de la journée, jours de la semaine) ou variable qualitative catégorielle.
- **Axe Y** : Variable quantitative continue discrétisée en tranches (*bins*) d'égale amplitude.
- **Couleur (Z - Métrique)** : Variable quantitative de comptage ($N$), de densité relative ($\%$) ou d'agrégation statistique (ex: temps de réponse moyen).

### Cas d'usage privilégiés
- **Très grands volumes de données ($N > 10\,000$ à des millions d'observations)** : Cas où les Scatter plots ou Strip plots s'effondrent sous un bloc d'encre opaque (*black blob effect*).
- **Analyse comportementale et temporelle de distribution** : Suivi de l'évolution d'une distribution au fil du temps (ex: distribution de la charge CPU heure par heure sur 30 jours, distribution des temps de latence par jour de la semaine).
- **Analyse de corrélations bidimensionnelles denses et non-linéaires** : Détection de relations complexes (ex: bimodalités croisées, structures en fer à cheval).

### Questions d'analyse résolues
- *Où se trouvent les zones de concentration maximale de données dans l'espace 2D ?*
- *La forme de la distribution quantitative varie-t-elle selon les heures, les jours ou les segments d'utilisateurs ?*
- *Existe-t-il des anomalies marginales rares (cellules isolees à faible fréquence mais aberrantes) ?*

---

## 3. Quand NE PAS l'utiliser (Contre-indications)

```markdown
| Situation & Données | Pourquoi la Heatmap de Distribution échoue | Alternative Recommandée |
| :--- | :--- | :--- |
| **Petits échantillons de données** ($N < 100 - 200$ points total) | La grille apparaît très clairsemée, saccadée et dominée par le bruit d'échantillonnage (cellules vides avec des points isolés). | **Strip plot** (`strip-plot.md`), **Beeswarm plot** (`beeswarm-plot.md`) ou **Scatter plot** |
| **Besoin de lecture quantitative exacte des effectifs** | Le système visuel humain est médiocre pour estimer des chiffres exacts à partir de teintes de couleur (loi de Stevens $\beta \approx 0.3-0.5$). | **Histogramme 1D**, **Box Plot** ou Tableau structuré avec texte direct |
| **Nombre de bins excessivement élevé** ($N_x, N_y > 100$) | Les cellules deviennent plus petites que la résolution des pixels, créant un phénomène de moiré visuel. | **2D Density Plot lisse (KDE 2D)** ou réduction du nombre de bins |
```

---

## 4. Règles cognitives & Meilleures pratiques spécifiques

### 4.1 Choix de la Palette de Couleur : Palettes Perceptuellement Uniformes
Le choix de la palette de couleur est la décision critique d'une Heatmap :
- **Obligation de palettes perceptuellement uniformes** : Utiliser impérativement **Viridis**, **Cividis**, **Magma**, **Plasma** ou une palette séquentielle d'encre uniforme (ex: *Blues*, *YlGnBu* de ColorBrewer).
- **Propriété de Monotonie de Luminance** : La luminance doit augmenter (ou diminuer) de façon strictement monotone d'un bout à l'autre de l'échelle. Ainsi, l'impression visuelle de puissance reste proportionnelle à la valeur numérique, y compris en impression noir et blanc ou sous déficience chromatique (CVD).

### 4.2 Interdiction Absolue de la Palette Arc-en-Ciel (*Rainbow / Jet*)
La palette Arc-en-Ciel (*Jet / Rainbow*) est **strictement proscrite**. Les travaux de Borland & Taylor (2007) ont démontré qu'elle introduit de **fausses frontières perceptuelles** : les variations de teinte non-linéaires (notamment le passage brutal du vert au jaune) font percevoir au cerveau des sauts de densité virtuels qui n'existent absolument pas dans les données.

```
  [ PALETTE RAINBOW / JET (INTERDITE) ]         [ PALETTE VIRIDIS / PERCEPTUELLE (OBLIGATOIRE) ]
  Jaune ──► Vert ──► Bleu ──► Rouge             Violet Sombre ───────────────► Jaune Lumineux
  (Faux sauts perceptuels, non-CVD)            (Luminance monotone, 100% CVD-friendly)
```

### 4.3 Dimensionnement du Binning (Équilibre Biais-Variance)
- **Taille de la Grille** : Opter pour une grille de **$10 \times 10$ à $30 \times 30$ cellules**.
- **Méthodes d'optimisation de largeur de bin** : Utiliser la règle de **Freedman-Diaconis** ou de **Scott** sur chaque axe pour calculer la largeur optimale du réceptacle $h$ :
  $$h = 2 \cdot \frac{\text{IQR}(X)}{\sqrt[3]{N}}$$

### 4.4 Atténuation de l'Effet de Contraste Simultané (Loi de Chevreul)
La loi du contraste simultané (Chevreul, 1839) stipule que la perception de la couleur d'une cellule dépend des cellules qui l'entourent. Une cellule de valeur 50 paraîtra plus claire si elle est entourée de cellules sombres (valeur 0) que si elle est entourée de cellules très claires (valeur 100).
- **Mesure mitigative** : Fournir systématiquement un **tooltip interactif clair** affichant la valeur numérique exacte de la cellule survolée.
- **Séparateur de grille** : Insérer une fine bordure neutre très subtile (`borderColor: '#FFFFFF'`, `borderWidth: 1px`) entre les cellules pour stabiliser la perception des contours.

### 4.5 Transformation Logarithmique ($\log(1 + N)$) sur Données Asymétriques
Si la densité varie de $1$ à $10\,000$ (distribution à queue lourde), une échelle chromatique linéaire écrasera toutes les faibles densités dans la teinte la plus sombre. Application de la transformation :
$$Z_{\text{display}} = \log_{10}(1 + N_{\text{cellule}})$$

---

## 5. Erreurs fréquentes & Anti-patterns visuels

```
  [ ANTI-PATTERN 1 : Palette Arc-en-ciel Jet ]       [ ANTI-PATTERN 2 : Cellules sans séparateur ]
   Y                                                  Y
  4 ┤  [ Rouge ] [ Jaune ] [ Vert ]                  4 ┤  ██████████████████  (Illusion de Chevreul :
  3 ┤  [ Vert  ] [ Bleu  ] [ Rouge]                  3 ┤  ██████████████████   les bords des cellules
  2 ┤  (Fausse frontière nette perçue                2 ┤  ██████████████████   fondent et déforment la
    └────┴───────┴───────┴───────► X                   └────┴───────┴───────┴──► X  valeur perçue !)
```

1. **Utilisation de la palette Arc-en-Ciel (Rainbow / Jet)** : Distorsion perceptuelle sévère et incompatibilité totale avec le daltonisme (protanopie/deutéranopie).
2. **Absence de légende d'échelle de couleur (*Colorbar*)** : Sans légende graduée associant la teinte à la valeur numérique, la heatmap devient un simple motif décoratif sans valeur quantitative.
3. **Binning incohérent à largeurs de réceptacles variables** : Si les cellules $X$ ou $Y$ n'ont pas la même amplitude (ex: Bin 1 = 0-10, Bin 2 = 10-100), les fréquences sont artificiellement déformées.
4. **Grille trop dense ($> 100 \times 100$) sur petit écran** : Entraîne le clignotement de sous-échantillonnage et masque les données réelles sous le bruit de rendu canvas.

---

## 6. Recommandations d'implémentation Chart.js

### 6.1 Architecture technique : Plugin `chartjs-chart-matrix`
Chart.js natif ne possède pas de type de diagramme en matrice 2D. La mise en œuvre officielle et performante s'effectue via le plugin officiel **`chartjs-chart-matrix`** (type **`matrix`**).

Chaque cellule est définie par un objet `{x, y, v}` où :
- `x` : Indice ou libellé du bin sur l'axe horizontal.
- `y` : Indice ou libellé du bin sur l'axe vertical.
- `v` : Valeur numérique de fréquence ou d'effectif $N$.

### 6.2 Structure HTML & Accessibilité (DOM & ARIA)
```html
<div class="chart-container" role="region" aria-label="Heatmap de distribution de la charge serveur par tranche horaire" tabindex="0">
  <canvas id="distributionHeatmapCanvas" role="img" aria-label="Heatmap 2D montrant la densité des requêtes web par heure et par temps de réponse. Le pic principal se situe entre 14h et 16h avec des temps de réponse de 200 à 300ms." aria-describedby="heatmap-fallback"></canvas>
  <div id="heatmap-fallback" class="sr-only">
    <table>
      <caption>Matrice de distribution de la densité des requêtes (Nombre de requêtes)</caption>
      <thead>
        <tr>
          <th scope="col">Temps de réponse / Heure</th>
          <th scope="col">00h - 06h</th>
          <th scope="col">06h - 12h</th>
          <th scope="col">12h - 18h</th>
          <th scope="col">18h - 24h</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>0 - 100 ms</td><td>1 200</td><td>4 500</td><td>8 900</td><td>3 100</td></tr>
        <tr><td>100 - 300 ms</td><td>450</td><td>2 100</td><td>14 500</td><td>1 800</td></tr>
        <tr><td>300 - 500 ms</td><td>80</td><td>350</td><td>2 400</td><td>210</td></tr>
        <tr><td>> 500 ms</td><td>12</td><td>45</td><td>310</td><td>28</td></tr>
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
  max-width: 900px;
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

### 6.4 Configuration JavaScript Baseline Déterministe (Chart.js v4+ & `chartjs-chart-matrix`)

```javascript
import { Chart } from 'chart.js/auto';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';

// Enregistrement du plugin Matrix auprès de Chart.js
Chart.register(MatrixController, MatrixElement);

// Palette Viridis perceptuellement uniforme (Échelle de 0 à 1)
// Garantit une luminance monotone, 100% conforme WCAG et CVD-friendly
function getViridisColor(normalizedValue) {
  // Interpolation hexadécimale simplifiée sur 5 étapes Viridis canoniques
  const viridisStops = [
    { t: 0.00, r: 68,  g: 1,   b: 84  }, // #440154 (Purple Sombre - Densité min)
    { t: 0.25, r: 59,  g: 82,  b: 139 }, // #3B528B (Bleu)
    { t: 0.50, r: 33,  g: 145, b: 140 }, // #21918C (Teal)
    { t: 0.75, r: 94,  g: 201, b: 98  }, // #5EC962 (Vert)
    { t: 1.00, r: 253, g: 231, b: 37  }  // #FDE725 (Jaune Lumineux - Densité max)
  ];

  const val = Math.max(0, Math.min(1, normalizedValue));
  
  let lower = viridisStops[0];
  let upper = viridisStops[viridisStops.length - 1];

  for (let i = 0; i < viridisStops.length - 1; i++) {
    if (val >= viridisStops[i].t && val <= viridisStops[i + 1].t) {
      lower = viridisStops[i];
      upper = viridisStops[i + 1];
      break;
    }
  }

  const range = upper.t - lower.t;
  const rangeVal = (val - lower.t) / (range === 0 ? 1 : range);

  const r = Math.round(lower.r + rangeVal * (upper.r - lower.r));
  const g = Math.round(lower.g + rangeVal * (upper.g - lower.g));
  const b = Math.round(lower.b + rangeVal * (upper.b - lower.b));

  return `rgb(${r}, ${g}, ${b})`;
}

// Libellés des axes
const xLabels = ['00h-06h', '06h-12h', '12h-18h', '18h-24h'];
const yLabels = ['0-100 ms', '100-300 ms', '300-500 ms', '> 500 ms'];

// Données de densité de fréquence (Matrice 4x4)
const matrixDataRaw = [
  { x: '00h-06h', y: '0-100 ms', v: 1200 },
  { x: '06h-12h', y: '0-100 ms', v: 4500 },
  { x: '12h-18h', y: '0-100 ms', v: 8900 },
  { x: '18h-24h', y: '0-100 ms', v: 3100 },

  { x: '00h-06h', y: '100-300 ms', v: 450 },
  { x: '06h-12h', y: '100-300 ms', v: 2100 },
  { x: '12h-18h', y: '100-300 ms', v: 14500 }, // Max Density
  { x: '18h-24h', y: '100-300 ms', v: 1800 },

  { x: '00h-06h', y: '300-500 ms', v: 80 },
  { x: '06h-12h', y: '300-500 ms', v: 350 },
  { x: '12h-18h', y: '300-500 ms', v: 2400 },
  { x: '18h-24h', y: '300-500 ms', v: 210 },

  { x: '00h-06h', y: '> 500 ms', v: 12 },
  { x: '06h-12h', y: '> 500 ms', v: 45 },
  { x: '12h-18h', y: '> 500 ms', v: 310 },
  { x: '18h-24h', y: '> 500 ms', v: 28 }
];

// Calcul des bornes de min/max de fréquence
const values = matrixDataRaw.map(d => d.v);
const minVal = Math.min(...values);
const maxVal = Math.max(...values);

const config = {
  type: 'matrix',
  data: {
    datasets: [{
      label: 'Densité de requêtes',
      data: matrixDataRaw,
      backgroundColor(context) {
        if (!context.dataset.data[context.dataIndex]) return '#FFFFFF';
        const v = context.dataset.data[context.dataIndex].v;
        // Normalisation min-max (avec protection contre la division par zéro)
        const normalized = maxVal === minVal ? 0.5 : (v - minVal) / (maxVal - minVal);
        return getViridisColor(normalized);
      },
      borderColor: '#FFFFFF', // Séparateur de grille blanc pour contrer l'illusion de Chevreul
      borderWidth: 1,
      width: ({ chart }) => (chart.chartArea || {}).width / xLabels.length - 2,
      height: ({ chart }) => (chart.chartArea || {}).height / yLabels.length - 2
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Supprimé au profit de l'étiquetage direct et tooltips
      tooltip: {
        backgroundColor: '#1E293B',
        titleFont: { family: 'Inter', size: 13, weight: '600' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          title: (items) => {
            const item = items[0].raw;
            return `Tranche : ${item.x} × ${item.y}`;
          },
          label: (context) => {
            const item = context.raw;
            return ` Fréquence : ${item.v.toLocaleString('fr-FR')} requêtes`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'category',
        labels: xLabels,
        grid: { display: false },
        ticks: {
          color: '#0F172A',
          font: { family: 'Inter', size: 12, weight: '600' }
        }
      },
      y: {
        type: 'category',
        labels: yLabels,
        offset: true,
        grid: { display: false },
        ticks: {
          color: '#0F172A',
          font: { family: 'Inter', size: 12, weight: '600' }
        }
      }
    }
  }
};
```

### 6.5 Déterminisme pour les Agents IA
- **Génération déterministe de la matrice** : L'agent IA doit impérativement discrétiser l'espace $X$ et $Y$ en bins d'amplitudes fixes et calculer les fréquences exactes sans tronquage aléatoire.
- **Fonction de couleur explicite et constante** : Utiliser la fonction d'interpolation Viridis déterministe basée sur le min/max global du dataset complet, pour éviter que les couleurs ne changent de signification entre deux graphiques.

---

## Règles Cognitives d'Accentuation & Valence

La Heatmap de distribution 2D synthétise des densités bivariées sur une grille matricielle. L'accentuation cognitive y guide l'attention pré-attentive vers les zones critiques et hotspots :

### 1. Hiérarchie Visuelle & Ratio 90/10 (Tufte)
- **Cellules de Densité Modérée (90%)** : Le continuum de la grille est encodé avec la palette séquentielle du thème (`tokens.sequential`) garantissant une progression monotone en luminance.
- **Cellules Focales / Hotspots (10%)** : Les cellules de concentration maximale ou d'intérêt stratégique reçoivent une bordure contrastée `tokens.emphasis.focal` (`borderWidth: 2`) pour découper visuellement la cellule sans altérer la luminance interne.

### 2. Détection d'Anomalies & Cellules Critiques
- **Cellules Hors Normes** : Les cellules révélant des charges extrêmes (ex: saturation CPU $> 90\%$ ou incidents critiques) adoptent `tokens.emphasis.anomaly` ou `tokens.status.danger` (`#C62828`).
- **Double Encodage Strict** :
  - **Couleur** : Teinte saturée ou divergente (`tokens.emphasis.anomaly`).
  - **Bordure** : Contour contrasté épais (`borderWidth: 2`).
  - **Tooltip** : Mention textuelle claire du statut critique (`"Charge Critique: 98% [DANGER]"`).

### 3. Valence Métier & Écarts
- Pour une métrique de charge / latence / défaut (valence inversée), les cellules supérieures au seuil de tolérance basculent vers la couleur de danger via `getValenceColor(tokens, delta, 'cost')`.

### 4. Exemple d'Implémentation Chart.js v4+ (Accentuation & Valence)

```javascript
import { createChart } from './template.js';
import { getEmphasisStyle, getValenceColor } from '../../themes/theme-tokens.js';

// Matrice d'incidents serveur par tranche horaire avec accentuation des hotspots
const serverMatrix = {
  xLabels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  yLabels: ['00-04h', '04-08h', '08-12h', '12-16h', '16-20h', '20-24h'],
  datasets: [{
    label: 'Taux de saturation (%)',
    data: [
      { x: 1, y: 1, v: 12 },
      { x: 1, y: 2, v: 15 },
      { x: 4, y: 4, v: 98, role: 'anomaly', isAnomaly: true }, // Hotspot critique mis en valeur
      { x: 5, y: 4, v: 92, role: 'focal' }
    ],
    metricType: 'latency'
  }]
};

// Initialisation avec le thème Nord Dark
const chart = createChart('myCanvas', serverMatrix, 'nord-cognitive-dark');
```

---

## 7. Sources & Références académiques / clés

1. **Borland, D., & Taylor, M. R. (2007)**. *Rainbow Color Map (Still) Considered Harmful*. IEEE Computer Graphics and Applications, 27(2), 14-17.
   - *Apport* : Preuve scientifique des distorsions perceptuelles provoquées par les palettes non-monotones en luminance.
2. **van der Walt, S., & Smith, N. (2015)**. *Designing Viridis Color Maps for Matplotlib*. SciPy 2015 Proceedings.
   - *Apport* : Développement et validation de la palette Viridis pour l'uniformité perceptuelle et l'accessibilité CVD.
3. **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception: Theory, Computation, and Application to the Development of Graphic Methods*. JASA, 79(387), 531-554.
   - *Apport* : Analyse du canal de luminance/saturation et classement en Rang 7.
4. **Carr, D. B., Littlefield, R. J., Nicholson, W. L., & Littlefield, J. S. (1987)**. *Scatterplot Matrix Techniques for Large N*. Journal of the American Statistical Association, 82(398), 424-436.
   - *Apport* : Formalisation du binning bidimensionnel pour la représentation de la densité de grands jeux de données.
5. **Chevreul, M. E. (1839)**. *De la loi du contraste simultané des couleurs*. Pitois-Levrault.
   - *Apport* : Découverte du principe de l'illusion de contraste simultané des couleurs adjacentes.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Ciblage Matriciel 2D (MacKenzie 1992, ISO 9241-9)
- **Ciblage Spatial 2D de Cellule** : Dans une matrice de distribution bidimensionnelle, les cellules forment une grille discrète d'aire finie ($W \times H$). En configurant l'interaction avec `getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 10, hoverRadius: 5 })`, le pointage capture la cellule la plus proche sans exiger un centrage millimétrique, abaissant l'Indice de Difficulté de Fitts à $ID \le 2.8\text{ bits}$ ($MT \le 650\text{ms}$).
- **Partition Régulière sans Zone Morte** : Le partitionnement continu garantit que chaque mouvement de souris dans la zone active de la heatmap met immédiatement en surbrillance la case correspondante.

### 2. Réactivité Temporelle & Latences Perceptives (Card-Moran-Newell 1983, Nielsen 1993)
- **Instantanéité Perceptive ($\le 100\text{ms}$)** : Rendu de la bordure de focus de cellule sous $100\text{ms}$ ($60\text{ fps}$) pour maintenir le feedback kinesthésique continu.
- **Débounce & Hystérésis Physiologique** : Filtre d'entrée $\Delta t_{\text{enter}} = 80\text{ms}$ évitant les sursauts visuels lors de traversées rapides de la grille et rémanence de sortie $\Delta t_{\text{exit}} = 150\text{ms}$ neutralisant les micro-tremblements musculaires.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Auto-Suffisance des *Details-on-Demand*** : L'infobulle associe les libellés exacts des deux dimensions ($X \times Y$), la valeur de densité numérique formatée selon `tokens.fontMono` (`font-variant-numeric: tabular-nums`) et le statut d'alerte métier le cas échéant.
- **Algorithme Anti-Occlusion Déterministe** : Positionnement via `computeAntiOcclusionTooltipPosition` inversant automatiquement le quadrant vertical vers le bas pour les cellules de la rangée supérieure ($y < \text{margin}$) et appliquant un clamping latéral sur les bords gauche/droit.

### 4. Constance d'Objet & Physique des Courbes d'Amorti (Heer & Robertson 2007, Penner 2002)
- **Cinétique Visuelle Contrôlée** : Les changements de palettes ou filtrages matriciels s'exécutent avec `easeOutQuad` ($350\text{ms}$), assurant une transition douce de la saturation chromatique sans scintillement.

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3 (Animation from Interactions)** : Durée ramenée à `0ms` dès détection de `@media (prefers-reduced-motion: reduce)` via `isReducedMotionPreferred()`.
- **Contraste Élevé & Typographie Tabulaire** : Ratios de contraste $\ge 16:1$ dans l'infobulle et contours de cellules contrastés avec le fond du thème, conformité WCAG AAA.
