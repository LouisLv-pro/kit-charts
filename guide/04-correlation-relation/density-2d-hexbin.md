# Fiche Méthodologique : Hexbin Plot (Diagramme d'Agrégation Hexagonale / Hexagonal Binning)

> **Catégorie** : 04-correlation-relation  
> **Type Chart.js** : Plugin Canvas sur mesure sur échelle cartésienne linéaire `scatter` ou `matrix`  
> **Niveau de précision Cleveland & McGill** : RANG 1 (Position 2D cartésienne) pour le repérage spatial des alvéoles ; RANG 7 (Densité de couleur / Saturation) pour la fréquence $C_k$ — Erreur 10-15% sur les valeurs exactes, mais efficacité cognitive maximale sur les données massives ($N > 10^4$)  
> **Dernière révision** : 2026-08-13  

---

## 1. Description & Principe visuel

Le **Hexbin Plot** (ou *Hexagonal Binning Plot*) est la méthode canonique pour la visualisation et l'agrégation bidimensionnelle de jeux de données massifs (*Big Data*, $N \in [10^3, 10^7]$ points). Il résout le problème critique de saturation visuelle (*overplotting*) en partitionnant l'espace cartésien continu $(X, Y)$ en une grille régulière d'alvéoles hexagonales adjacentes (*tessellation hexagonale*).

Pour un ensemble d'observations $\{(x_i, y_i)\}_{i=1}^N$, l'espace est découpé en bins hexagonaux $B_k$. Chaque observation $(x_i, y_i)$ est affectée à l'alvéole hexagonale dont le centre est le plus proche, et chaque alvéole calcule son décompte d'agrégation $C_k$ :

$$C_k = \sum_{i=1}^{N} \mathbb{I}\left( (x_i, y_i) \in B_k \right)$$

La valeur $C_k$ est encodée par l'intensité chromatique (luminance et saturation) de l'hexagone via une palette séquentielle perceptuellement uniforme (ex: *Viridis*, *Cividis*, *Magma*).

```
        PAVAGE HEXAGONAL 2D (6 VOISINS ÉQUIDISTANTS, PAS DE BIAIS D'ANISOTROPIE)
        ▲ Y
        │          / \     / \     / \
        │         | C1|---| C2|---| C3|   <- Hexagones adjacents réguliers
        │          \ /     \ /     \ /       Distance centre-à-centre = R√3
        │         / \     / \     / \
        │        | C4|---| C5|---| C6|    <- Couleur de la cellule = f(C_k)
        │         \ /     \ /     \ /
        └──────────────────────────────► X
```

### Encodages visuels mobilisés
1. **Position 2D des alvéoles ($X, Y$)** : Position cartésienne des centres d'hexagones le long des échelles continues.
2. **Couleur / Luminance (Teinte séquentielle)** : Encodage de la densité $C_k$ de points contenus dans chaque alvéole.
3. **Pavage spatial régulier (Gestalt Proximité & Clôture)** : Émergence pré-attentive immédiate des clusters 2D, des modes de distribution et des corridors de corrélation.

### Fondements géométriques & Supériorité sur la grille carrée
Soit $R$ le rayon de l'hexagone régulier (distance du centre aux sommets). Les propriétés géométriques fondamentales sont :
- **Rayon interne / Apothème ($r$)** : Distance du centre au milieu des côtés :

  $$r = R \cdot \cos\left(\frac{\pi}{6}\right) = R \frac{\sqrt{3}}{2} \approx 0.866025 \cdot R$$

- **Largeur ($W$) et Hauteur ($H$)** (orientation pointe en haut / *pointy-topped*) :

  $$W = 2r = R\sqrt{3}, \quad H = 2R$$

#### Atténuation des biais d'anisotropie spatiale
Dans une grille carrée/rectangulaire classique, chaque cellule a 4 voisins orthogonaux à distance $d = 1$ et 4 voisins diagonaux à distance $d = \sqrt{2} \approx 1.414$ (soit une distorsion de $41.4\%$). Cette anisotropie crée un biais visuel d'orientation préférentielle (*grid bias*).

À l'inverse, l'hexagone est la figure géométrique régulière la plus proche du cercle qui permet un **pavage parfait de l'espace 2D sans lacune ni chevauchement**. Chaque alvéole hexagonale possède **6 voisins adjacents situés exactement à la même distance de centre à centre** ($\Delta d = R\sqrt{3}$). De plus, l'hexagone possède le ratio périmètre/surface le plus faible des polygones de pavage, minimisant les artefacts de bordure lors du lissage visuel des gradients de densité.

---

## 2. Quand l'utiliser (Cas d'usage cibles)

### Types de variables adaptées
- **Axe X** : Variable quantitative continue (ex: Puissance, Revenu, Coordonnée spatiale X).
- **Axe Y** : Variable quantitative continue (ex: Consommation, Prix, Coordonnée spatiale Y).
- **Volume de données ($N$)** : **Massif ($N \in [5\text{ }000, 10^7]$ points)**.

### Cas d'usage privilégiés
- **Visualisation de données massives (Big Data)** : Résoudre l'overplotting là où un Scatter Plot produit un pavé opaque sans structure.
- **Détection de modes et de sous-populations bivariées** :
  - **Génomique & Bio-informatique** : Comparaison d'expression de dizaines de milliers de gènes.
  - **Téléphonie & Mobilité** : Cartographie de densité d'appels ou de connexions GPS.
  - **Finance de marché** : Analyse de haute fréquence (Prix vs Volume dans les carnets d'ordres).
  - **Automobile / Ingénierie** : Puissance moteur ($X$) vs Émissions / Consommation ($Y$) sur des flottes de millions de véhicules.
- **Optimisation des performances de rendu Web** : Dessiner 500 à 2000 alvéoles hexagonales nécessite une fraction négligeable des ressources GPU/CPU par rapport au rendu de 500 000 éléments DOM ou cercles SVG.

---

## 3. Quand NE PAS l'utiliser (Contre-indications)

| Situation & Données | Pourquoi le Hexbin Plot échoue | Alternative Recommandée |
| :--- | :--- | :--- |
| **Faible volume de données ($N < 500$ points)** | La grille hexagonale est creuse, la plupart des bins contiennent 0 ou 1 point, masquant les points individuels sans gain d'agrégation. | **Scatter Plot** classique avec transparence alpha (`scatter-plot.md`) |
| **Détection critique d'outliers isolés** | Un point extrême isolé risque d'être sous-représenté ou noyé dans une alvéole à faible couleur. | **Scatter Plot hybride** (Hexbin pour le cœur + Scatter pour les points isolés) |
| **Variables catégorielles ou discrètes à faible cardinalité** | Les points s'alignent en bandes strictes et la grille hexagonale crée une distorsion spatiale sans fondement. | **Distribution Heatmap** ou **Grouped Bar Chart** |

---

## 4. Règles cognitives & Meilleures pratiques spécifiques

### 4.1 Palettes de couleurs perceptuellement uniformes (Borland & Taylor, 2007)
- **Règle absolue** : Utiliser exclusivement des palettes séquentielles dont la luminance varie de manière strictly monotone.
- **Palettes recommandées** : **Viridis** (bleu profond $\to$ teal $\to$ jaune), **Cividis** (optimisé pour le daltonisme CVD), **Magma** ou **Plasma**.
- ❌ **Interdiction formelle de la palette Arc-en-ciel (Rainbow / Jet)** : La palette Jet crée des faux contours (*false boundaries*) là où la luminance oscille brutalement, trompant le système visuel sur la position des pics de densité.

### 4.2 Échelle de densité non linéaire ($\sqrt{\cdot}$ ou $\log$)
Les distributions de densité 2D réelles suivent souvent une loi à longue traîne (ex: un pic à 10 000 points et des zones périphériques à 5 points).
- Une échelle de couleur linéaire fait disparaître 90% des hexagones sous la couleur minimale.
- **Solution cognitive** : Appliquer une transformation en racine carrée $f(C_k) = \sqrt{C_k}$ ou logarithmique $f(C_k) = \log(1 + C_k)$ pour révéler la structure complète des gradients.

### 4.3 Matrice de Décision & Déterminisme IA
Un agent IA doit exécuter les règles univoques suivantes pour choisir et configurer le Hexbin Plot :

```
Saisie : 2 variables quantitatives continues
├── N < 500 points ──────────────────────────────────► SCATTER PLOT (alpha = 0.4)
├── 500 ≤ N ≤ 5000 points ───────────────────────────► SCATTER PLOT (alpha = 0.15, radius = 2)
└── N > 5000 points ─────────────────────────────────► HEXBIN PLOT 2D
    ├── Résolution : 30 à 50 hexagones par axe
    ├── Géométrie : Conversion exacte coordonnées axiales / cube (cubeRound)
    ├── Palette : Viridis ou Cividis (perceptual uniform)
    ├── Transformation : f(C_k) = Math.sqrt(C_k) / Math.sqrt(C_max)
    └── Légende : Barre continue de dégradé avec ticks numériques (tabular-nums)
```

---

## 5. Erreurs fréquentes & Anti-patterns visuels

```
  [ ANTI-PATTERN 1 : Palette Arc-en-ciel Jet ]    [ ANTI-PATTERN 2 : Hexagones étirés / Déformés ]
   Y                                               Y
  10 ┤   [Rouge] [Jaune] [Vert] [Bleu]            10 ┤   ◇   ◇   ◇   (Losanges déformés car
   5 ┤   (Faux contours & artefacts)               5 ┤     ◇   ◇     l'aspect ratio X/Y n'a pas
   0 ┼──┴────────┴────────┴────────► X             0 ┼──┴───┴───┴──► X été compensé !)
```

1. **Utiliser la palette Arc-en-ciel (Jet / Rainbow)** : Crée de fausses frontières perceptives et fausse l'analyse de densité.
2. **Déformation de l'aspect ratio des hexagones** : Ignorer le ratio d'aspect des échelles X et Y sur le Canvas, transformant les hexagones réguliers en losanges ou ovales étirés.
3. **Bordures d'hexagones trop sombres** : Utiliser un contour noir épais (`strokeStyle: '#000'`) qui écrase la couleur des cellules de faible densité. Privilégier des bordures ultra-fines semi-transparentes (`rgba(255, 255, 255, 0.15)`).
4. **Ombrage 3D ou effets de relief** : Surcharge extrinsèque (Sweller) détruisant le ratio Data-Ink (Tufte).

---

## 6. Recommandations d'implémentation Chart.js

### 6.1 Architecture technique : Native vs Plugin
- **Support natif Chart.js** : Chart.js ne possède pas de type natif `'hexbin'`.
- **Solution canonique** : Un **Plugin Canvas sur mesure (`hexbinPlugin`)** s'appuyant sur un graphique de type `'scatter'`. Le plugin prend en charge la conversion des points en coordonnées axiales/cube, le calcul de la tessellation, et le dessin vectoriel des hexagones sur le contexte Canvas.

### 6.2 Algorithmes JS Fondamentaux

#### 1. Algorithme de Conversion Coordonnées Cartésiennes $\to$ Grille Hexagonale (Coordonnées Cube & Arrondi Exact)
Pour éviter tout chevauchement ou trou entre hexagones, l'algorithme convertit les coordonnées pixel $(px, py)$ en **coordonnées cube 3D d'hexagone $(q, r, s)$** satisfaisant la contrainte $q + r + s = 0$, puis applique l'arrondi exact (*Cube Rounding*) :

```javascript
/**
 * Convertit un point cartésien (px, py) en coordonnées de grille hexagonale (Q, R)
 * par l'algorithme exact de projection en coordonnées Cube (q, r, s) et arrondi.
 * 
 * @param {number} px - Position X en pixels Canvas
 * @param {number} py - Position Y en pixels Canvas
 * @param {number} radius - Rayon externe de l'hexagone R en pixels
 * @returns {{ q: number, r: number }} Coordonnées de l'alvéole hexagonale
 */
function pixelToHexAxial(px, py, radius) {
  // En orientation pointe en haut (pointy-topped hex) :
  // q = (sqrt(3)/3 * px - 1/3 * py) / radius
  // r = (2/3 * py) / radius
  const qFrac = (Math.sqrt(3) / 3 * px - 1 / 3 * py) / radius;
  const rFrac = (2 / 3 * py) / radius;
  const sFrac = -qFrac - rFrac;

  // Arrondi en coordonnées Cube (x = q, y = r, z = s)
  let q = Math.round(qFrac);
  let r = Math.round(rFrac);
  let s = Math.round(sFrac);

  const qDiff = Math.abs(q - qFrac);
  const rDiff = Math.abs(r - rFrac);
  const sDiff = Math.abs(s - sFrac);

  if (qDiff > rDiff && qDiff > sDiff) {
    q = -r - s;
  } else if (rDiff > sDiff) {
    r = -q - s;
  }

  return { q, r };
}

/**
 * Reconvertit les coordonnées axiales (q, r) au centre pixel exact (cx, cy)
 */
function hexAxialToPixel(q, r, radius) {
  const cx = radius * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r);
  const cy = radius * (3 / 2 * r);
  return { cx, cy };
}
```

#### 2. Algorithme de Normalisation et Palette Viridis
```javascript
/**
 * Interpolation de la palette séquentielle Viridis (5 nœuds RGB)
 * @param {number} t - Valeur normalisée entre 0.0 et 1.0
 */
function getViridisColor(t) {
  t = Math.max(0, Math.min(1, t));
  const stops = [
    [68, 1, 84],     // 0.0 : Violet foncé
    [59, 82, 139],   // 0.25 : Bleu indigo
    [33, 145, 140],  // 0.50 : Teal / Cyan
    [94, 201, 98],   // 0.75 : Vert pomme
    [253, 231, 37]   // 1.00 : Jaune brillant
  ];

  const idx = t * (stops.length - 1);
  const i = Math.floor(idx);
  const f = idx - i;

  if (i >= stops.length - 1) return `rgb(${stops[stops.length - 1].join(',')})`;

  const r = Math.round(stops[i][0] + f * (stops[i + 1][0] - stops[i][0]));
  const g = Math.round(stops[i][1] + f * (stops[i + 1][1] - stops[i][1]));
  const b = Math.round(stops[i][2] + f * (stops[i + 1][2] - stops[i][2]));

  return `rgb(${r}, ${g}, ${b})`;
}
```

### 6.3 Code complet, autonome et accessible (HTML5 / Chart.js v4+)

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hexbin Plot - Chart.js</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <style>
    :root {
      --bg-color: #ffffff;
      --text-color: #0f172a;
      --border-color: #e2e8f0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: var(--text-color);
      background-color: #f8fafc;
      padding: 24px;
      margin: 0;
    }

    .chart-card {
      max-width: 880px;
      margin: 0 auto;
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }

    .chart-header {
      margin-bottom: 20px;
    }

    .chart-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0 0 6px 0;
    }

    .chart-subtitle {
      font-size: 0.875rem;
      color: #475569;
      margin: 0;
    }

    .chart-container {
      position: relative;
      width: 100%;
      height: 500px;
    }

    .legend-bar {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 16px;
      font-size: 0.8125rem;
      color: #475569;
    }

    .gradient-box {
      width: 180px;
      height: 12px;
      border-radius: 3px;
      background: linear-gradient(to right, #440154, #3b528b, #21918c, #5ec962, #fde725);
    }

    /* Typographie numérique tabulaire */
    .tabular-nums {
      font-variant-numeric: tabular-nums;
    }

    /* Fallback accessible pour lecteurs d'écran */
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
  </style>
</head>
<body>

  <div class="chart-card">
    <div class="chart-header">
      <h2 class="chart-title">Densité Bivariée : Puissance Moteur vs Consommation (N = 10,000 véhicules)</h2>
      <p class="chart-subtitle">Agrégation spatiale par alvéoles hexagonales (Hexbin Plot) avec palette séquentielle Viridis.</p>
    </div>

    <!-- Zone de rendu accessible avec rôle ARIA -->
    <div class="chart-container" role="region" aria-label="Graphique de densité bivariée par alvéoles hexagonales" tabindex="0">
      <canvas id="hexbinCanvas" aria-label="Diagramme d'agrégation hexagonale montrant la distribution conjointe de la puissance moteur et de la consommation de carburant sur 10 000 observations." aria-describedby="hexbin-fallback"></canvas>
    </div>

    <!-- Légende de couleur de densité -->
    <div class="legend-bar tabular-nums">
      <span>Faible (1 obs)</span>
      <div class="gradient-box"></div>
      <span>Élevée (100+ obs)</span>
    </div>

    <!-- Tableau fallback pour lecteurs d'écran (WCAG / RGAA) -->
    <table id="hexbin-fallback" class="sr-only tabular-nums" summary="Résumé des modes de densité bivariée Puissance Moteur vs Consommation">
      <caption>Données de densité par cluster d'alvéoles majeures</caption>
      <thead>
        <tr>
          <th scope="col">Plage de Puissance (kW)</th>
          <th scope="col">Plage de Consommation (L/100km)</th>
          <th scope="col">Nombre de Véhicules (Décompte Hexbin)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>110 - 145 kW</td><td>6.2 - 7.8 L</td><td>6,500 (Cluster principal)</td></tr>
        <tr><td>170 - 210 kW</td><td>9.2 - 11.2 L</td><td>3,500 (Cluster secondaire)</td></tr>
      </tbody>
    </table>
  </div>

  <script>
    // 1. Génération synthétique de N = 10,000 points avec bimodalité
    function generateBivariateDataset(count) {
      const data = [];
      for (let i = 0; i < count; i++) {
        const isModeA = Math.random() < 0.65;
        let x, y;
        const u1 = Math.random(), u2 = Math.random();
        const rand1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        const rand2 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

        if (isModeA) {
          x = 130 + rand1 * 20;
          y = 7.0 + rand1 * 0.7 + rand2 * 0.8;
        } else {
          x = 190 + rand1 * 25;
          y = 10.2 + rand1 * 1.0 + rand2 * 1.1;
        }
        data.push({ x, y });
      }
      return data;
    }

    const rawPoints = generateBivariateDataset(10000);

    // 2. Fonctions d'algorithme Hexbin exact (Coordonnées Cube)
    function pixelToHexAxial(px, py, radius) {
      const qFrac = (Math.sqrt(3) / 3 * px - 1 / 3 * py) / radius;
      const rFrac = (2 / 3 * py) / radius;
      const sFrac = -qFrac - rFrac;

      let q = Math.round(qFrac);
      let r = Math.round(rFrac);
      let s = Math.round(sFrac);

      const qDiff = Math.abs(q - qFrac);
      const rDiff = Math.abs(r - rFrac);
      const sDiff = Math.abs(s - sFrac);

      if (qDiff > rDiff && qDiff > sDiff) {
        q = -r - s;
      } else if (rDiff > sDiff) {
        r = -q - s;
      }
      return { q, r };
    }

    function hexAxialToPixel(q, r, radius) {
      const cx = radius * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r);
      const cy = radius * (3 / 2 * r);
      return { cx, cy };
    }

    function getViridisColor(t) {
      t = Math.max(0, Math.min(1, t));
      const colors = [
        [68, 1, 84],
        [59, 82, 139],
        [33, 145, 140],
        [94, 201, 98],
        [253, 231, 37]
      ];
      const idx = t * (colors.length - 1);
      const i = Math.floor(idx);
      const f = idx - i;
      if (i >= colors.length - 1) return `rgb(${colors[colors.length - 1].join(',')})`;
      const r = Math.round(colors[i][0] + f * (colors[i + 1][0] - colors[i][0]));
      const g = Math.round(colors[i][1] + f * (colors[i + 1][1] - colors[i][1]));
      const b = Math.round(colors[i][2] + f * (colors[i + 1][2] - colors[i][2]));
      return `rgb(${r}, ${g}, ${b})`;
    }

    // 3. Plugin Canvas pour la tessellation et le rendu des hexagones
    const hexbinPlugin = {
      id: 'hexbinPlugin',
      beforeDraw(chart) {
        const { ctx, chartArea, scales } = chart;
        const xAxis = scales.x;
        const yAxis = scales.y;

        if (!chartArea) return;

        ctx.save();
        ctx.beginPath();
        ctx.rect(chartArea.left, chartArea.top, chartArea.width, chartArea.height);
        ctx.clip();

        const R = 13; // Rayon externe en pixels
        const bins = new Map();

        // Binning exact
        rawPoints.forEach(pt => {
          const pixelX = xAxis.getPixelForValue(pt.x);
          const pixelY = yAxis.getPixelForValue(pt.y);

          if (pixelX < chartArea.left || pixelX > chartArea.right ||
              pixelY < chartArea.top || pixelY > chartArea.bottom) {
            return;
          }

          // Décalage relatif au centre de la zone de tracé
          const relX = pixelX - chartArea.left;
          const relY = pixelY - chartArea.top;

          const { q, r } = pixelToHexAxial(relX, relY, R);
          const key = `${q}_${r}`;

          if (!bins.has(key)) {
            const { cx, cy } = hexAxialToPixel(q, r, R);
            bins.set(key, {
              centerX: chartArea.left + cx,
              centerY: chartArea.top + cy,
              count: 0
            });
          }
          bins.get(key).count += 1;
        });

        // Recherche du max pour normalisation racine carrée
        let maxCount = 0;
        bins.forEach(b => { if (b.count > maxCount) maxCount = b.count; });

        function drawHexagonPath(centerX, centerY, radius) {
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
        }

        // Rendu des hexagones
        bins.forEach(bin => {
          const normDensity = Math.sqrt(bin.count) / Math.sqrt(maxCount);
          ctx.fillStyle = getViridisColor(normDensity);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 0.8;

          drawHexagonPath(bin.centerX, bin.centerY, R - 0.4);
          ctx.fill();
          ctx.stroke();
        });

        ctx.restore();
      }
    };

    // 4. Initialisation Chart.js
    const ctx = document.getElementById('hexbinCanvas').getContext('2d');

    new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Observations',
          data: [] // Géré intégralement par le plugin Canvas hexbin
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        scales: {
          x: {
            type: 'linear',
            min: 50,
            max: 260,
            title: {
              display: true,
              text: 'Puissance Moteur (kW)',
              font: { weight: '600', size: 13 }
            },
            grid: { color: 'rgba(0, 0, 0, 0.05)' }
          },
          y: {
            type: 'linear',
            min: 4,
            max: 14,
            title: {
              display: true,
              text: 'Consommation Carburant (L/100km)',
              font: { weight: '600', size: 13 }
            },
            grid: { color: 'rgba(0, 0, 0, 0.05)' }
          }
        }
      },
      plugins: [hexbinPlugin]
    });
  </script>
</body>
</html>
```

---

## Règles Cognitives d'Accentuation & Valence

Le graphique d'agrégation spatiale Hexbin résout le sur-traçage massif ($N > 10\ 000$). L'accentuation cognitive y structure les niveaux de densité et met en relief les concentrations exceptionnelles :

### 1. Hiérarchie Visuelle & Ratio 90/10 (Tufte)
- **Densités Modérées de Contexte (90%)** : Le pavage matriciel/hexagonal est rendu avec la palette séquentielle monotone (`tokens.sequential`), encodant la distribution conjointe sans effet stroboscopique.
- **Clusters Modaux / Hotspots Focaux (10%)** : Les alvéoles de concentration maximale ou les clusters cibles sont rehaussés par une bordure contrastée `tokens.emphasis.focal` (`borderWidth: 2.5`).

### 2. Détection d'Anomalies & Cellules Isolées
- **Alvéoles Isolées Hors Régression** : Les alvéoles périphériques comptabilisant des événements rares mais critiques sont encodées avec `tokens.emphasis.anomaly` (magenta/rouge vif) avec un contour épais.
- **Double Encodage Strict** :
  - **Canal 1 (Luminance/Saturation Séquentielle)** : Normalisation logarithmique de la densité.
  - **Canal 2 (Bordure de Cellule)** : Trait épais contrasté (`borderWidth: 2.5`) sur les cellules d'intérêt.
  - **Canal 3 (Tooltip)** : Décompte tabulaire exact des effectifs d'observations par alvéole.

### 3. Valence Métier & Directionnalité
- Pour des variables de charge ou de consommation polluante (ex: CO2 vs Puissance), les zones de surconsommation dépassent le seuil de tolérance et basculent vers `tokens.status.danger` via `getValenceColor(tokens, delta, 'cost')`.

### 4. Exemple d'Implémentation Chart.js v4+ (Accentuation & Valence)

```javascript
import { createChart } from './template.js';
import { getEmphasisStyle, getValenceColor } from '../../themes/theme-tokens.js';

// Densité bivariée Puissance vs Consommation avec détection de cluster focal et anomalie
const fleetDensity = {
  datasets: [{
    label: 'Flotte Automobile',
    data: [
      { x: 130, y: 7.0, v: 450, role: 'context' },
      { x: 140, y: 7.2, v: 620, role: 'context' },
      { x: 190, y: 10.2, v: 580, role: 'focal' }, // Cluster haute performance focal
      { x: 250, y: 13.8, v: 45,  role: 'anomaly', isAnomaly: true } // Alvéole extrême polluante
    ],
    metricType: 'cost'
  }]
};

// Initialisation avec le thème Viridis Perceptual
const chart = createChart('myCanvas', fleetDensity, 'viridis-perceptual');
```

---

## 7. Sources & Références académiques / clés

1. **Carr, D. B., Olsen, A. R., & Denis, W. M. (1987)**. *Data Visualizations for Large Data Sets*. Proceedings of the Section on Statistical Graphics, American Statistical Association, 37-43. (Article princeps introduisant le Hexagonal Binning).
2. **Carr, D. B., Littlefield, R. J., Nicholson, W. L., & Littlefield, J. S. (1987)**. *Scatterplot Matrix Techniques for Large N*. Journal of the American Statistical Association, 82(398), 424-436.
3. **Borland, D., & Taylor, M. R. (2007)**. *Rainbow Color Map (Still) Considered Harmful*. IEEE Computer Graphics and Applications, 27(2), 14-17.
4. **Wickham, H. (2016)**. *ggplot2: Elegant Graphics for Data Analysis*. Springer. (Spécification de `stat_binhex` et pavage 2D).
5. **Nuñez, J. R., Anderton, C. R., & Renslow, R. S. (2018)**. *Optimizing colormaps to improve visual analysis of data*. PLOS ONE, 13(12), e0208378. (Validation empirique des palettes Viridis et Cividis).

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Ciblage Spatial 2D d'Alvéoles (MacKenzie 1992, ISO 9241-9)
- **Ciblage Spatial 2D de Cellule d'Agrégation** : Dans un pavage de densité 2D / hexbin, chaque cellule possède une surface finie ($W \approx 20\text{--}30\text{px}$). En appliquant les options spatiales `getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 14, hoverRadius: 7 })`, le pointage capture immédiatement l'alvéole la plus proche sans exiger un survol au pixel près, ramenant l'Indice de Difficulté de Fitts à $ID \le 2.6\text{ bits}$ ($MT \le 600\text{ms}$).
- **Partition Régulière sans Zone Morte** : Le partitionnement continu garantit que chaque déplacement dans l'espace $(X, Y)$ met en valeur l'alvéole correspondante avec son contour contrasté.

### 2. Réactivité Temporelle & Latences Perceptives (Card-Moran-Newell 1983, Nielsen 1993)
- **Instantanéité Perceptive ($\le 100\text{ms}$)** : Réaction visuelle immédiate de l'alvéole survolée (bordure contrastée `borderWidth: 2`) en $100\text{ms}$ à $60\text{ fps}$.
- **Débounce & Hystérésis Physiologique** : Filtre d'entrée $\Delta t_{\text{enter}} = 80\text{ms}$ neutralisant les bruits d'activation lors des mouvements rapides de curseur et rémanence $\Delta t_{\text{exit}} = 150\text{ms}$ stabilisant l'infobulle.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Auto-Suffisance des *Details-on-Demand*** : L'infobulle affiche les coordonnées centrales $(X, Y)$ de l'alvéole, le décompte exact d'observations avec typographie tabulaire `tokens.fontMono` (`font-variant-numeric: tabular-nums`) et son statut d'alerte métier le cas échéant.
- **Algorithme Anti-Occlusion Déterministe** : Positionnement via `computeAntiOcclusionTooltipPosition` avec déport vertical de sécurité ($12\text{px}$) et inversion automatique vers le bas ($y < \text{margin}$) pour les alvéoles de la rangée supérieure.

### 4. Constance d'Objet & Physique des Courbes d'Amorti (Heer & Robertson 2007, Penner 2002)
- **Cinétique Visuelle Contrôlée** : Les changements de palettes ou filtrages matriciels s'exécutent avec `easeOutQuart` ($400\text{ms}$), assurant une transition douce de la saturation chromatique sans scintillement.

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3 (Animation from Interactions)** : Durée ramenée à `0ms` dès détection de `@media (prefers-reduced-motion: reduce)` via `isReducedMotionPreferred()`.
- **Contraste Élevé & Typographie Tabulaire** : Ratios de contraste $\ge 16:1$ dans l'infobulle et contours d'alvéoles contrastés avec le fond du thème, conformité WCAG AAA.
