# Fiche Méthodologique : Nuage de Points Relié (Connected Scatter Plot / Trajectoire Temporelle 2D)

> **Catégorie** : 04-correlation-relation  
> **Type Chart.js** : `line` (avec `showLine: true` sur échelle linéaire $X/Y$) ou `scatter` + Plugin Canvas personnalisé  
> **Niveau de précision Cleveland & McGill** : RANG 1 (Position 2D sur échelles communes $X$ et $Y$) pour la position des jalons, RANG 4 (Angle / Orientation) pour la trajectoire vectorielle $\vec{v}_i$ — Erreur < 5%  
> **Dernière révision** : 2026-08-13  

---

## 1. Description & Principe visuel

Le **Connected Scatter Plot** (nuage de points relié ou diagramme de trajectoire bivariée) est une forme hybride combinant la capacité d'exploration bivariée du *Scatter Plot* et la continuité séquentielle du *Line Chart*. Il représente l'évolution conjointe de deux variables quantitatives continues $X(t)$ et $Y(t)$ enregistrées sur une séquence temporelle ou logique ordonnée $t_1 < t_2 < \dots < t_N$.

Chaque observation $i$ est représentée par un point de coordonnées cartésiennes :

$$(x_i, y_i) = \left( X(t_i), Y(t_i) \right) \quad \text{pour } i = 1, 2, \dots, N$$

Contrairement au Scatter Plot conventionnel où la dimension temporelle est absente, des segments de droite orientés relient chaque point consécutif $(x_i, y_i)$ à $(x_{i+1}, y_{i+1})$. Chaque segment matérialise le vecteur de transition bivarié :

$$\vec{v}_i = \begin{pmatrix} \Delta x_i \\ \Delta y_i \end{pmatrix} = \begin{pmatrix} x_{i+1} - x_i \\ y_{i+1} - y_i \end{pmatrix}$$

```
       TRAJECTOIRE TEMPOLOGIQUE 2D (CLEVELAND RANG 1 & GESTALT CONTINUITÉ)
  Y (Inflation %)
   6 ┤                                    ● (2022 : Choc d'Inflation)
   5 ┤                                   ▲ \
   4 ┤                                  /   \
   3 ┤            ● (2024 Present)     /     \
   2 ┤           ▲ \                  /       \
   1 ┤ (2010) ● ───► ● (2012) ─────────► ● (2018)  \
   0 ┼──┬───────┴────┴────┴────┴────┴────┴────┴────┴──► X (Chômage %)
       6.0     7.0  7.5  8.0  8.5  9.0  9.5 10.0
```

### Encodages visuels mobilisés
1. **Position sur l'axe X ($X(t)$)** : Variable quantitative continue (ex: Taux de chômage, PIB, Prix).
2. **Position sur l'axe Y ($Y(t)$)** : Variable quantitative continue (ex: Taux d'inflation, Dette publique, Volume).
3. **Continuité des segments (Loi Gestalt)** : Connexion filaire séquentielle liant les jalons chronologiques.
4. **Orientation & Angle du vecteur ($\theta_i = \operatorname{atan2}(\Delta y, \Delta x)$)** : Pente instantanée de la trajectoire révélant les arbitrages (trade-offs) ou synergies locales.
5. **Forme & Couleur des marqueurs d'extrémité** : Distinction pré-attentive du point d'origine $t_1$ (ex: vert/cercle) et du point actuel $t_N$ (ex: rouge/disque).

### Mécanisme Neuro-Cognitif & Justification Académique
Le Connected Scatter Plot repose sur la dualité du traitement perceptif visuel :
- **Rang 1 (Position 2D)** : L'œil évalue la position absolue de chaque point sur des échelles communes alignées $X$ et $Y$, garantissant la précision absolue du décodage quantitatif (Cleveland & McGill, 1984).
- **Loi de Continuité & Destin Commun (Gestalt)** : Le cerveau relie les points par des segments continus, transformant une collection de points isolés en un **objet visuel unique unifié** (une trajectoire).
- **Mémorisation et Récit (*Storytelling*)** : Les travaux expérimentaux de Haroz, Kosara & Franconeri (2015) ont démontré que les Connected Scatter Plots facilitent la mémorisation des récits de données par rapport aux graphiques temporels doubles, car ils traduisent la dynamique d'un système sous forme de formes géométriques caractéristiques (boucles, spirales, demi-tours).

#### Phénomène d'Hystérésis & Attracteurs
L'atout majeur du Connected Scatter Plot est sa capacité à révéler les **boucles d'hystérésis** (quand le chemin de retour d'un système économique ou physique diffère du chemin d'aller) et les **changements de régime** :
- **Boucle Horaire / Anti-horaire** : Indique la présence d'un décalage temporel (*lag*) entre la cause $X$ et la réponse $Y$.
- **Resserrement en spirale** : Révèle la convergence du système vers un état d'équilibre stable.

---

## 2. Quand l'utiliser (Cas d'usage cibles)

### Types de variables adaptées
- **Axe X** : Variable quantitative continue mesurée à intervalle régulier $t_i$.
- **Axe Y** : Variable quantitative continue mesurée au même instant $t_i$.
- **Séquence $t$** : Variable temporelle (années, mois, trimestres) ou logique d'étape.

### Cas d'usage privilégiés
- **Macroéconomie & Économétrie** :
  - **Courbe de Phillips dynamique** : Relation historique entre le taux de chômage ($X$) et l'inflation ($Y$).
  - **Trajectoire PIB vs Dette** : Analyse conjointe de la croissance ($X$) et de l'endettement public ($Y$).
  - **Élasticité Prix-Volume** : Suivi mensuel de la répercussion du prix unitaire ($X$) sur le volume vendu ($Y$).
- **Physiologie & Biomécanique** :
  - **Cycles Cardiaques Pression-Volume** : Volume du ventricule gauche ($X$) vs Pression ventriculaire ($Y$).
- **Environnement & Écologie** :
  - **Emissions CO2 vs Température globale** : Évolution séquentielle sur un siècle.

### Questions d'analyse résolues
- *Comment la relation bivariée entre chômage et inflation a-t-elle évolué avant, pendant et après la crise ?*
- *Le système est-il revenu à son état d'origine après le choc, ou s'est-il stabilisé sur un nouvel équilibre ?*
- *Y a-t-il un retard structurel (hystérésis) dans la réponse du marché aux variations de prix ?*

---

## 3. Quand NE PAS l'utiliser (Contre-indications)

| Situation & Données | Pourquoi le Connected Scatter Plot échoue | Alternative Recommandée |
| :--- | :--- | :--- |
| **Absence d'ordre chronologique strict** | Relier des observations indépendantes crée des lignes fictives trompeuses (violation de la vérité des données). | **Scatter Plot** classique avec ligne de régression (`scatter-plot.md`) |
| **Grand nombre d'observations ($N > 50$)** | La trajectoire se croise elle-même des dizaines de fois, formant un "nœud de spaghetti" totalement illisible. | **Line Charts synchronisés** (Small Multiples temporels) ou animation interactive |
| **Comparaison de multiples catégories ($K > 2$)** | La superposition de 3 ou 4 trajectoires entrelacées crée un chaos perceptif insurmontable. | **Small Multiples** (une grille de mini-connected scatter plots avec axes partagés) |
| **Données à haute fréquence très bruitées** | Les micro-oscillations génèrent un tracé chaotique en dents de scie sans direction claire. | Appliquer un **lissage par moyenne mobile** avant le tracé |

---

## 4. Règles cognitives & Meilleures pratiques spécifiques

### 4.1 Signalétique directionnelle & Jalons temporels
1. **Flèches vectorielles obligatoires** : Les segments doivent comporter des pointeurs de flèches (arrowheads) indiquant sans ambiguïté le sens d'écoulement du temps.
2. **Encodage origine / terminus** :
   - Point initial $t_1$ : Marqueur ouvert ou vert (`#10b981`), étiqueté "Début (Année)".
   - Point final $t_N$ : Disque plein ou rouge/bleu (`#ef4444` / `#2563eb`), étiqueté "Présent / Actuel".
3. **Étiquetage direct sélectif** : Ne PAS étiqueter 100% des points si $N > 15$. Étiqueter uniquement les jalons majeurs (ex: 2010, 2015, 2020) et les points d'inflexion stratégiques.

### 4.2 Lignes de segments vs Courbes d'interpolation
- **Segemnts droits stricts (`tension: 0`)** : Toujours privilégier les segments linéaires entre points réels.
- ❌ **Interdiction des splines Bézier agressives** : Un lissage courbe non contrôlé (`tension: 0.4`) crée de fausses trajectoires virtuelles et des boucles qui n'existent pas dans les données réelles.

### 4.3 Matrice de Décision & Déterminisme IA
Un agent IA doit appliquer les règles univoques suivantes :

```
Saisie : 2 variables quantitatives continues + 1 axe temps (N points)
├── N > 50 points ──────────────────────────────────► Préférer 2 Line Charts superposés
├── K > 2 catégories/groupes ────────────────────────► Préférer Small Multiples
└── 8 ≤ N ≤ 40 et K ≤ 2 groupes
    ├── Ordre temporel strict présent ──────────────► CONNECTED SCATTER PLOT
    │   ├── tension: 0 (segments droits)
    │   ├── Plugin vectoriel : Flèches au centre des segments (longueur ≥ 20px)
    │   ├── Encodage point d'origine vs point terminus (couleurs distinctes)
    │   └── Étiquetage direct des jalons (pas de légende distante)
    └── Aucune séquence temporelle ──────────────────► SCATTER PLOT CLASSIQUE
```

---

## 5. Erreurs fréquentes & Anti-patterns visuels

```
  [ ANTI-PATTERN 1 : Spaghetti Knot ]            [ ANTI-PATTERN 2 : Ambiguïté sans flèches ]
   Y                                               Y
  10 ┤   /\/\  / \                                10 ┤   ●─────────●
   5 ┤  /  \ \/   \                                5 ┤  /           \
   0 ┼──┴───┴───┴──► X                             0 ┼──●───────────●──► X
   (N > 60 : Trajectoire illisible)                (Impossible de savoir dans quel sens tourne le temps !)
```

1. **Absence de flèches directionnelles** : L'utilisateur ne peut pas savoir si l'évolution va de gauche à droite ou de haut en bas.
2. **Le "Nœud de Spaghetti" ($N > 60$)** : Tracé trop long qui se superpose continuellement et obscurcit la tendance.
3. **Lissage Bézier trompeur** : Courbes arrondies artificielles déformant les extrema réels.
4. **Absence d'étiquettes de jalons** : Forcer l'utilisateur à deviner les dates en consultant un tableau annexe (violation de la contiguïté spatiale).

---

## 6. Recommandations d'implémentation Chart.js

### 6.1 Architecture technique : Native vs Plugin
- **Support natif Chart.js** : Utiliser le type `'line'` avec une échelle linéaire pour $X$ et $Y$ (`scales.x.type = 'linear'`). Les données sont passées sous forme d'objets `{x: number, y: number, label: string}`.
- **Plugin sur mesure (`connectedScatterPlugin`)** : Requis pour :
  1. Calculer les angles vectoriels et dessiner les flèches au milieu de chaque segment.
  2. Afficher les étiquettes de jalons temporels sans collision visuelle.
  3. Mettre en valeur l'origine (vert) et la fin (rouge).

### 6.2 Algorithmes JS Fondamentaux

#### 1. Algorithme de Tri Chronologique Strict
```javascript
/**
 * Garantit que les observations sont strictement ordonnées par séquence temporelle
 * avant l'injection dans Chart.js.
 */
function prepareConnectedScatterData(rawData, timeKey, xKey, yKey) {
  return rawData
    .slice()
    .sort((a, b) => new Date(a[timeKey]) - new Date(b[timeKey]))
    .map(item => ({
      x: Number(item[xKey]),
      y: Number(item[yKey]),
      timeLabel: String(item[timeKey])
    }));
}
```

#### 2. Algorithme de Calcul du Vecteur Directionnel et des Flèches Canvas
```javascript
/**
 * Calcule l'orientation et la position de la flèche directionnelle
 * au milieu d'un segment entre deux points Canvas p1(x1, y1) et p2(x2, y2).
 */
function drawDirectionalArrow(ctx, p1, p2, color, arrowSize = 8, minDistance = 20) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Ignorer si les points sont trop proches pour éviter l'encombrement
  if (dist < minDistance) return;

  const midX = (p1.x + p2.x) / 2;
  const midY = (p1.y + p2.y) / 2;
  const angle = Math.atan2(dy, dx);

  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(midX, midY);
  ctx.lineTo(
    midX - arrowSize * Math.cos(angle - Math.PI / 6),
    midY - arrowSize * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    midX - arrowSize * Math.cos(angle + Math.PI / 6),
    midY - arrowSize * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
```

### 6.3 Code complet, autonome et accessible (HTML5 / Chart.js v4+)

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Connected Scatter Plot - Chart.js</title>
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
      max-width: 850px;
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
      height: 480px;
    }

    /* Formatage numérique tabulaire */
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
      <h2 class="chart-title">Trajectoire Économique : Taux de Chômage vs Inflation (2010 - 2024)</h2>
      <p class="chart-subtitle">Connected Scatter Plot illustrant la dynamique bivariée et la boucle d'hystérésis macroéconomique.</p>
    </div>

    <!-- Conteneur avec rôle ARIA et tabindex pour accessibilité keyboard/screen reader -->
    <div class="chart-container" role="region" aria-label="Graphique de trajectoire bivariée Chômage et Inflation de 2010 à 2024" tabindex="0">
      <canvas id="connectedScatterCanvas" aria-label="Nuage de points relié montrant l'évolution du taux de chômage en abscisse et du taux d'inflation en ordonnée entre 2010 et 2024." aria-describedby="fallback-table"></canvas>
    </div>

    <!-- Tableau fallback pour lecteurs d'écran (WCAG / RGAA) -->
    <table id="fallback-table" class="sr-only tabular-nums" summary="Tableau de données chronologiques bivariées du taux de chômage et du taux d'inflation">
      <caption>Données historiques de la trajectoire Chômage vs Inflation</caption>
      <thead>
        <tr>
          <th scope="col">Année</th>
          <th scope="col">Taux de Chômage (%)</th>
          <th scope="col">Taux d'Inflation (%)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>2010</td><td>9.3</td><td>1.5</td></tr>
        <tr><td>2012</td><td>9.8</td><td>2.0</td></tr>
        <tr><td>2014</td><td>10.3</td><td>0.5</td></tr>
        <tr><td>2016</td><td>10.0</td><td>0.2</td></tr>
        <tr><td>2018</td><td>8.8</td><td>1.8</td></tr>
        <tr><td>2020</td><td>8.0</td><td>0.5</td></tr>
        <tr><td>2022</td><td>7.3</td><td>5.2</td></tr>
        <tr><td>2024</td><td>7.5</td><td>2.3</td></tr>
      </tbody>
    </table>
  </div>

  <script>
    // 1. Données brutes avec tri chronologique déterministe
    const rawInputData = [
      { year: '2010', unemployment: 9.3, inflation: 1.5 },
      { year: '2012', unemployment: 9.8, inflation: 2.0 },
      { year: '2014', unemployment: 10.3, inflation: 0.5 },
      { year: '2016', unemployment: 10.0, inflation: 0.2 },
      { year: '2018', unemployment: 8.8, inflation: 1.8 },
      { year: '2020', unemployment: 8.0, inflation: 0.5 },
      { year: '2022', unemployment: 7.3, inflation: 5.2 },
      { year: '2024', unemployment: 7.5, inflation: 2.3 }
    ];

    // Algorithme de tri chronologique
    const datasetData = rawInputData
      .slice()
      .sort((a, b) => parseInt(a.year) - parseInt(b.year))
      .map(item => ({
        x: item.unemployment,
        y: item.inflation,
        timeLabel: item.year
      }));

    // 2. Plugin Canvas pour le rendu des flèches vectorielles et étiquettes sans collision
    const connectedScatterPlugin = {
      id: 'connectedScatterPlugin',
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        const meta = chart.getDatasetMeta(0);
        const points = meta.data;
        const raw = chart.data.datasets[0].data;

        if (points.length < 2) return;

        ctx.save();

        // Dessin des flèches directionnelles
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 22) continue; // Éviter l'encombrement si les points sont très proches

          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          const angle = Math.atan2(dy, dx);
          const arrowLength = 8;

          ctx.fillStyle = '#2563eb';
          ctx.beginPath();
          ctx.moveTo(midX, midY);
          ctx.lineTo(
            midX - arrowLength * Math.cos(angle - Math.PI / 6),
            midY - arrowLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            midX - arrowLength * Math.cos(angle + Math.PI / 6),
            midY - arrowLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();
        }

        // Dessin des étiquettes de jalons temporels
        ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#0f172a';

        points.forEach((pt, idx) => {
          const label = raw[idx].timeLabel;
          let offsetX = 10;
          let offsetY = -8;

          // Ajustement manuel anti-collision selon la position du point
          if (idx === 0) { // 2010 (Début)
            offsetX = -38;
            offsetY = 14;
          } else if (idx === points.length - 1) { // 2024 (Présent)
            offsetX = 12;
            offsetY = 4;
          } else if (idx % 2 === 1) {
            offsetY = 16;
          }

          ctx.fillText(label, pt.x + offsetX, pt.y + offsetY);
        });

        ctx.restore();
      }
    };

    // 3. Initialisation du graphique Chart.js
    const ctx = document.getElementById('connectedScatterCanvas').getContext('2d');

    new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Trajectoire 2010-2024',
          data: datasetData,
          borderColor: '#2563eb',
          borderWidth: 2.5,
          backgroundColor: '#3b82f6',
          pointRadius: (ctx) => {
            const idx = ctx.dataIndex;
            return (idx === 0 || idx === datasetData.length - 1) ? 7 : 5;
          },
          pointBackgroundColor: (ctx) => {
            const idx = ctx.dataIndex;
            if (idx === 0) return '#10b981'; // Vert d'origine
            if (idx === datasetData.length - 1) return '#ef4444'; // Rouge de fin
            return '#ffffff';
          },
          pointBorderColor: '#2563eb',
          pointBorderWidth: 2,
          tension: 0 // Segments droits stricts (pas d'interpolation courbe trompeuse)
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { top: 24, right: 45, bottom: 20, left: 24 }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => `Année : ${items[0].raw.timeLabel}`,
              label: (item) => [
                `Taux de chômage (X) : ${item.raw.x.toFixed(1)}%`,
                `Taux d'inflation (Y) : ${item.raw.y.toFixed(1)}%`
              ]
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            title: {
              display: true,
              text: 'Taux de Chômage (%)',
              font: { weight: '600', size: 13 }
            },
            grid: { color: 'rgba(0, 0, 0, 0.05)' }
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: "Taux d'Inflation Annuel (%)",
              font: { weight: '600', size: 13 }
            },
            grid: { color: 'rgba(0, 0, 0, 0.05)' }
          }
        }
      },
      plugins: [connectedScatterPlugin]
    });
  </script>
</body>
</html>
```

---

## Règles Cognitives d'Accentuation & Valence

Le Nuage de Points Relié (Connected Scatter Plot) matérialise des trajectoires et des cycles d'hystérésis bivariés à travers le temps :

### 1. Hiérarchie Visuelle & Ratio 90/10 (Tufte)
- **Trajectoire Historique de Contexte (90%)** : Les segments passés de la courbe adoptent un trait continu modéré (`borderWidth: 2`) avec des points atténués (`tokens.emphasis.context`).
- **Jalon Présent / État Actuel Focal (10%)** : Le point temporel le plus récent ($t_{\text{actuel}}$) est mis en avant avec `tokens.emphasis.focal` (disque élargi `pointRadius: 7–8`, contour contrasté `surfaceRaised`).
- **Projections Futures / Modélisations** : Les segments prévisionnels adoptent `tokens.emphasis.forecastAlpha` et des pointillés stricts `borderDash: [5, 5]`.

### 2. Détection de Ruptures & Chocs Macroéconomiques
- **Chocs / Points d'Inflexion Majeurs** : Les points correspondant à des crises ou ruptures de régime sont encodés comme anomalies.
- **Double Encodage des Chocs** :
  - **Couleur** : `tokens.emphasis.anomaly` (magenta/rouge vif).
  - **Forme** : Glyphe triangulaire (`pointStyle: 'triangle'`) avec liseré contrasté.
  - **Annotation** : Badge textuel direct (`"Choc Pétrolier 2022"`).

### 3. Valence Métier & Cibles
- La zone cible de politique économique ou financière (ex: Inflation 2% + Plein emploi) est matérialisée par un réticule de repère avec `tokens.emphasis.benchmark` et tirets `[4, 4]`.

### 4. Exemple d'Implémentation Chart.js v4+ (Accentuation & Valence)

```javascript
import { createChart } from './template.js';
import { getEmphasisStyle, getValenceColor } from '../../themes/theme-tokens.js';

// Trajectoire Chômage vs Inflation avec choc 2022 et état actuel 2024
const phillipsData = {
  datasets: [{
    label: 'Courbe de Phillips (2018-2024)',
    data: [
      { x: 8.2, y: 1.6, year: 2018, role: 'context' },
      { x: 7.9, y: 1.3, year: 2019, role: 'context' },
      { x: 8.5, y: 0.5, year: 2020, role: 'context' },
      { x: 7.6, y: 2.1, year: 2021, role: 'context' },
      { x: 7.1, y: 6.8, year: 2022, role: 'anomaly' }, // Choc d'inflation
      { x: 7.2, y: 4.9, year: 2023, role: 'context' },
      { x: 7.4, y: 2.4, year: 2024, role: 'focal' }    // Situation actuelle
    ]
  }]
};

// Initialisation avec le thème ColorBrewer Accessible
const chart = createChart('myCanvas', phillipsData, 'colorbrewer-accessible');
```

---

## 7. Sources & Références académiques / clés

1. **Haroz, S., Kosara, R., & Franconeri, S. L. (2015)**. *ISOTYPE Visualization: Working Memory and Storytelling with Connected Scatterplots*. IEEE Transactions on Visualization and Computer Graphics, 21(12), 1386-1392.
2. **Cairo, A. (2016)**. *The Truthful Art: Data, Charts, and Maps for Communication*. New Riders. (Chapitre 8 : *Visualizing Change and Dynamics*).
3. **Fairfield, H. (2010)**. *Driving Shifts Into Reverse*. The New York Times. (Article pionnier vulgarisant le Connected Scatter Plot pour analyser la relation entre le prix de l'essence et la distance parcourue aux États-Unis).
4. **Cleveland, W. S. (1993)**. *Visualizing Data*. Hobart Press, Summit, New Jersey.
5. **Few, S. (2009)**. *Now You See It: Simple Visualization Techniques for Quantitative Analysis*. Analytics Press.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Ciblage Spatial 2D Continu (MacKenzie 1992, ISO 9241-9)
- **Ciblage Spatial 2D de Nœuds Temporels** : L'acquisition d'un jalon chronologique discret le long de la trajectoire ($2r = 5\text{px}$) à distance $D = 350\text{px}$ impose un Indice de Difficulté $ID = \log_2(350/5 + 1) \approx 6.15\text{ bits}$ ($MT \approx 1360\text{ms}$). En intégrant les options spatiales `getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 14, hoverRadius: 7 })`, la surface effective atteint $W_e = 33\text{px}$, ramenant $ID$ à $3.54\text{ bits}$ ($MT \approx 838\text{ms}$), soit un gain de **$38.4\%$** d'efficacité motrice.
- **Partition Spatiale Continue** : Le mode `nearest` en coordonnées $XY$ sans intersection stricte permet de balayer la trajectoire continue et d'interroger instantanément l'état du système à n'importe quel point du plan de phase.

### 2. Réactivité Temporelle & Latences Perceptives (Card-Moran-Newell 1983, Nielsen 1993)
- **Instantanéité Perceptive ($\le 100\text{ms}$)** : Réaction visuelle immédiate du nœud temporel survolé (agrandissement à `hoverRadius: 7px` et halo contrasté) en $100\text{ms}$ à $60\text{ fps}$.
- **Débounce & Hystérésis Physiologique** : Filtre d'entrée $\Delta t_{\text{enter}} = 80\text{ms}$ prévenant les sursauts d'infobulles lors de traversées rapides de la trajectoire et rémanence de sortie $\Delta t_{\text{exit}} = 150\text{ms}$ stabilisant l'infobulle face aux micro-tremblements moteurs.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Auto-Suffisance des *Details-on-Demand*** : L'infobulle synthétise la période chronologique (Année / Trimestre), les coordonnées bivariées $(X, Y)$ avec typographie tabulaire `tokens.fontMono` (`font-variant-numeric: tabular-nums`) et le statut du point (Focal, Contexte, Anomalie).
- **Algorithme Anti-Occlusion Déterministe** : Positionnement via `computeAntiOcclusionTooltipPosition` avec déport vertical de sécurité ($12\text{px}$) et inversion automatique vers le bas ($y < \text{margin}$) pour les nœuds supérieurs.

### 4. Constance d'Objet & Physique des Courbes d'Amorti (Heer & Robertson 2007, Penner 2002)
- **Déroulement Chronologique Congruent** : Le tracé animé de la trajectoire se propage dans l'ordre chronologique avec une courbe `easeOutQuad` ($450\text{ms}$), matérialisant physiquement la dynamique temporelle sans rupture attentionnelle.

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3 (Animation from Interactions)** : Durée ramenée à `0ms` dès détection de `@media (prefers-reduced-motion: reduce)` via `isReducedMotionPreferred()`.
- **Contraste Élevé & Typographie Tabulaire** : Ratios de contraste $\ge 16:1$ dans l'infobulle et $\ge 3:1$ pour les lignes et nœuds de la trajectoire, conformité WCAG AAA.
