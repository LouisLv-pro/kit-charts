# Fiche Méthodologique : Graphique de Densité (Density Plot / Kernel Density Estimation - KDE Plot)

> **Catégorie** : 03-distribution  
> **Type Chart.js** : `line` (avec `fill: 'start'`, lissage spline/monotone et évaluation JS préalable par noyau KDE)  
> **Niveau de précision Cleveland & McGill** : RANG 1 (Position le long d'une échelle commune) & RANG 4 (Pente / Courbure continue) — Erreur 3-8%  
> **Dernière révision** : 2026-08-13  

---

## 1. Description & Principe visuel

Le **graphique de densité** (ou *KDE Plot* pour *Kernel Density Estimation*) est la version continue, lissée et non paramétrique de l'histogramme. Il permet de visualiser la **fonction de densité de probabilité** (PDF) sous-jacente d'une variable quantitative continue sans subir la sensibilité arbitraire au découpage en classes (*bins*) propre à l'histogramme.

```
       ESTIMATION CONTINUE PAR NOYAU GAUSSIEN (KDE)
  Densité de Probabilité f(x)
  0.03 ┤                 .---.
  0.02 ┤               ./     \.
  0.01 ┤     .---.    /         \.       .---.
  0.00 ┼────/─────\──/───────────\─────/─────\────► Variable X (Continue)
       ▲   ▲   ▲   ▲   ▲   ▲   ▲   ▲   ▲   ▲   ▲
       └───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
       (Noyaux gaussiens élémentaires sommés sur chaque datapoint)
```

### Encodage visuel et fondements mathématiques
L'estimation par noyau repose sur la superposition d'une petite fonction de masse (le **noyau** $K$, généralement une gaussienne) centrée sur chaque point de donnée individuel $x_i$. La somme de ces noyaux produit une courbe lissée continue dont l'intégrale totale sous la courbe est égale à $1.0$ ($\int_{-\infty}^{+\infty} \hat{f}(x) dx = 1.0$).

La formule mathématique de l'estimateur de Rosenblatt-Parzen s'exprime par :
$$\hat{f}_h(x) = \frac{1}{n h} \sum_{i=1}^{n} K\left( \frac{x - x_i}{h} \right)$$

Où :
- $n$ est le nombre total d'observations.
- $h$ est la **largeur de bande** (*bandwidth* ou paramètre de lissage).
- $K(u)$ est la fonction noyau gaussienne standard : $K(u) = \frac{1}{\sqrt{2\pi}} e^{-\frac{1}{2} u^2}$.

### Encodages visuels mobilisés
1. **Position le long de l'axe horizontal (Axe X)** : Domaine de valeurs de la variable continue.
2. **Hauteur / Position verticale (Axe Y)** : Densité de probabilité estimée $\hat{f}(x)$.
3. **Pente et courbure (Gradient 2D)** : Taux de variation de la concentration des données.
4. **Aire sous la courbe** : Proportion de la population contenue dans un intervalle $[a, b]$.

### Mécanisme Neuro-Cognitif
Le cerveau humain perçoit les formes continues bien plus efficacement que les assemblages discrets de barres. En éliminant les discontinuités artificielles des bacs d'histogramme, le graphique de densité active la **loi de continuité de la Gestalt** ($< 200\text{ ms}$). Il permet une évaluation intuitive de la **symétrie**, de l'**étalement**, de la **leptokurticité** (pics aigus) et de la **multimodalité** (présence de plusieurs bosses signalant des mélanges de distributions).

---

## 2. Quand l'utiliser (Cas d'usage cibles)

### Types de variables adaptées
- **Axe X (Échelle continue)** : Variable quantitative continue mesurée sur des échantillons de taille modérée à grande ($N \ge 50$ ou $N \ge 100$).
- **Axe Y (Densité)** : Densité de probabilité continue $\hat{f}(x)$ ($\ge 0$).

### Cas d'usage privilégiés
- **Comparaison de 2 à 4 distributions superposées** (ex: distribution du salaire des employés selon le genre, temps de conversion selon le canal marketing). C'est l'usage roi du Density Plot, surpassant l'histogramme en évitant l'occlusion visuelle.
- **Analyse de formes de distributions complexes ou multimodales** sur de grands jeux de données ($N > 500$).
- **Visualisation d'échantillons continus sans a priori sur le binning**.

### Questions d'analyse résolues
- *Comment se comparent les distributions de deux groupes distincts (ex: groupe test vs contrôle) ?*
- *Existe-t-il un décalage de médiane ou de variance entre plusieurs sous-populations ?*
- *La distribution présente-t-elle des sous-groupes bimodaux ou des queues de distribution épaisses ?*

---

## 3. Quand NE PAS l'utiliser (Contre-indications)

```markdown
| Situation & Données | Pourquoi le Density Plot échoue | Alternative Recommandée |
| :--- | :--- | :--- |
| **Petits échantillons** ($N < 30$) | L'estimation KDE produit une fausse illusion de continuité et crée de faux modes artificiels. | **Strip Plot** (`strip-plot.md`) ou **Beeswarm Plot** (`beeswarm-plot.md`) |
| **Données avec bornes physiques strictes** (ex: revenus $\ge 0$, pourcentages $[0, 100\%]$) | Le lissage gaussien déborde au-delà des bornes réelles (*Boundary Leakage*), prédisant des valeurs impossibles (ex: âge $< 0$). | **Histogramme** (`histogramme.md`) ou KDE tronqué avec réflexion |
| **Public non technique / grand public** | Le concept de "densité de probabilité" sur l'axe Y est fréquemment confondu avec un nombre d'individus bruts. | **Histogramme** (`histogramme.md`) |
| **Comparaison de nombreuses distributions** ($> 5$ séries) | L'enchevêtrement de 5+ courbes de densité crée un plat d'espaghettis illisible. | **Box Plot** (`box-plot.md`) ou **Ridge Plot** (Joyplot) |
| **Variables discrètes ou catégorielles** | Le lissage sur des entiers discrets (ex: nombre d'enfants) génère des vagues artificielles. | **Bar Chart** (`bar-chart.md`) |
```

---

## 4. Règles cognitives & Meilleures pratiques spécifiques

### 4.1 La Règle Scientifique d'Ajustement de la Largeur de Bande (Bandwidth $h$)
La largeur de bande $h$ contrôle le degré de lissage. Un $h$ trop petit génère une courbe hachée et bruitée (*undersmoothing*) ; un $h$ trop grand écrase les pics réels et masque la bimodalité (*oversmoothing*).

L'algorithme **doit impérativement** utiliser la **Règle empirique de Silverman** (*Silverman's Rule of Thumb*, 1986) pour déterminer la largeur de bande optimale $h^*$ :

$$h^* = 0.9 \cdot \min\left( s, \frac{\text{IQR}}{1.34} \right) \cdot N^{-1/5}$$

*Où $s$ est l'écart-type de l'échantillon, $\text{IQR}$ l'écart interquartile et $N$ la taille d'échantillon.*

```
      SUR-LISSAGE (h trop grand)               OPTIMAL (Silverman)              SOUS-LISSAGE (h trop petit)
  ┌───────────────────────────────┐   ┌───────────────────────────────┐   ┌───────────────────────────────┐
  │              .---.            │   │      .---.     .---.          │   │   /\  /\    /\  /\    /\  /\  │
  │            ./     \.          │   │    ./     \._./     \.        │   │  /  \/  \  /  \/  \  /  \/  \ │
  └───────────────────────────────┘   └───────────────────────────────┘   └───────────────────────────────┘
   (Bimodalité totalement masquée)      (Deux modes distincts révélés)       (Bruit d'échantillonnage pur)
```

### 4.2 Superposition & Transparence Chromatique (Loi de Région Commune)
- **Remplissage avec opacité réduite ($\alpha = 0.20 - 0.35$)** : Lorsque 2 à 3 distributions sont comparées sur le même graphique, la zone située sous la courbe doit être remplie avec une couleur de la palette Okabe-Ito dotée d'une transparence de $20\%$ à $35\%$.
- **Ligne de contour appuyée** : La courbe supérieure doit conserver une bordure opaque (`borderWidth: 2px` ou `3px`) pour détacher nettement chaque profil.

### 4.3 Marge de Grille ($3 \times h$) & Gestion du Débordement aux Frontières (*Boundary Leakage*)
- **Marge d'évaluation étendue ($3 \times h$)** : La grille d'évaluation X doit obligatoirement s'étendre de `xStart = minVal - 3 * h` à `xEnd = maxVal + 3 * h` pour ne pas tronquer arbitrairement les queues de probabilité de la fonction noyau gaussienne.
- **Réflexion aux limites** : Lorsque la variable possède une limite naturelle inférieure stricte (ex: $X \ge 0$), l'algorithme KDE doit appliquer la méthode de réflexion aux limites ($u_2 = (x - (2 \cdot \text{minBoundary} - x_j))/h$) tout en bornant `xStart` à `minBoundary` pour préserver une intégrale exacte de $1.0$.

### 4.4 Étiquetage et Légendes (Anti Split-Attention)
- Pour 2 ou 3 séries, utiliser si possible de l'**étiquetage direct** sur le pic de chaque courbe plutôt qu'une légende déportée, afin d'éliminer la surcharge de mémoire de travail (Sweller, 1988).
- L'axe Y doit porter le libellé explicitant : *"Densité de probabilité"* (ou être masqué si l'objectif est purement la comparaison qualitative des formes).

---

## 5. Erreurs fréquentes & Anti-patterns visuels

```
   [ ANTI-PATTERN 1 : Fuite aux frontières (Boundary Leakage) ]     [ ANTI-PATTERN 2 : Enchevêtrement spaghetti ]
  Y                                                                Y
 0.04 ┤           .---.                                           0.04 ┤      .---/\_./---.
 0.02 ┤         ./     \.                                         0.02 ┤    ./---\/_/----\.\_
 0.00 ┼──────.-/────────\───────► X (Montant des ventes)          0.00 ┼───/──/──/──\──\──\──\──►
       -50  0    50    100                                                (5+ courbes opaques superposées)
      (Densité affichée pour des ventes négatives !)
```

1. **Fuite aux frontières non corrigée (*Boundary Leakage*)** : Afficher de la densité sur des valeurs négatives (ex. salaire $< 0$) décrédibilise l'analyse.
2. **Sur-lissage abusif masquant des modes distincts** : Utiliser un $h$ arbitrairement élevé qui transforme une distribution bimodale en une simple cloche gaussienne.
3. **Superposition de plus de 4 séries sur le même axe** : Entraîne un chevauchement chaotique où les teintes se mélangent, annulant la saillance pré-attentif.
4. **Interprétation de creux comme significatifs sur de petits $N$** ($N < 30$) : Prendre les fluctuations du lissage pour des vérités statistiques alors qu me elles découlent du bruit d'échantillonnage.

---

## 6. Recommandations d'implémentation Chart.js

### 6.1 Architecture technique : Type natif vs Plugins
Chart.js ne possède pas de type `density` natif. La méthode scientifique recommandée consiste à :
1. Calculer en JavaScript l'estimation KDE sur une grille fine de $M = 100$ points $x_j$ régulièrement espacés entre $\min(X) - 3h$ et $\max(X) + 3h$ via le noyau gaussien et la règle de Silverman.
2. Injecter les coordonnées $(x_j, y_j)$ dans un graphique natif Chart.js de type **`line`** avec `fill: 'start'`, `pointRadius: 0` (lignes lisses sans points), et `tension: 0.3` ou `cubicInterpolationMode: 'monotone'`.

### 6.2 Structure HTML & Accessibilité (DOM & ARIA)
```html
<div class="chart-container" role="region" aria-label="Graphique de densité de probabilité des salaires par genre" tabindex="0">
  <canvas id="densityCanvas" role="img" aria-label="Graphique de densité comparant la distribution des salaires des Femmes et des Hommes. La médiane des hommes est décalée de 4 k€ vers la droite." aria-describedby="density-fallback"></canvas>
  <div id="density-fallback" class="sr-only">
    <table>
      <caption>Statistiques descriptives de la densité des salaires (N = 500)</caption>
      <thead>
        <tr>
          <th scope="col">Groupe</th>
          <th scope="col">Médiane (k€)</th>
          <th scope="col">IQR (k€)</th>
          <th scope="col">Mode de densité principal (k€)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Femmes</td><td>42.5</td><td>12.0</td><td>41.0</td></tr>
        <tr><td>Hommes</td><td>46.2</td><td>14.5</td><td>45.5</td></tr>
      </tbody>
    </table>
  </div>
</div>
```

### 6.3 Style CSS (`tabular-nums`)
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

### 6.4 Algorithme JS d'Estimation KDE & Configuration Chart.js v4+

```javascript
import { Chart } from 'chart.js/auto';

// 1. Algorithme Mathématique KDE (Noyau Gaussien + Silverman + Marge 3*h + Réflexion aux limites)
function calculateKDE(data, numPoints = 100, minBoundary = null) {
  const n = data.length;
  if (n === 0) return [];

  const sorted = [...data].sort((a, b) => a - b);
  const minVal = sorted[0];
  const maxVal = sorted[n - 1];

  // Statistique : Écart-type & IQR
  const mean = sorted.reduce((a, b) => a + b, 0) / n;
  const stdDev = Math.sqrt(sorted.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n);
  const q1 = sorted[Math.floor(n * 0.25)];
  const q3 = sorted[Math.floor(n * 0.75)];
  const iqr = q3 - q1;

  // Largeur de bande optimale de Silverman (h = 0.9 * min(s, IQR/1.34) * n^(-1/5))
  const spread = Math.min(stdDev, iqr / 1.34) || stdDev || 1;
  const h = 0.9 * spread * Math.pow(n, -0.2);

  // Domaine d'évaluation X (avec marge de 3 * h de chaque côté pour éviter la truncation des queues, restreint au minBoundary si spécifié)
  let xStart = minVal - 3 * h;
  let xEnd = maxVal + 3 * h;
  if (minBoundary !== null && xStart < minBoundary) {
    xStart = minBoundary;
  }

  const step = (xEnd - xStart) / (numPoints - 1);
  const kdePoints = [];

  // Noyau Gaussien Standard K(u) = (1 / sqrt(2*pi)) * exp(-0.5 * u^2)
  const gaussianKernel = (u) => (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * u * u);

  for (let i = 0; i < numPoints; i++) {
    const x = xStart + i * step;
    let densitySum = 0;

    for (let j = 0; j < n; j++) {
      // Densité directe du noyau
      const u1 = (x - data[j]) / h;
      let kVal = gaussianKernel(u1);

      // Correction par réflexion aux limites (Boundary Reflection) pour préserver l'aire intégrée = 1.0
      if (minBoundary !== null) {
        const u2 = (x - (2 * minBoundary - data[j])) / h;
        kVal += gaussianKernel(u2);
      }

      densitySum += kVal;
    }

    const density = densitySum / (n * h);
    kdePoints.push({ x: Number(x.toFixed(4)), y: Number(density.toFixed(6)) });
  }

  return kdePoints;
}

// 2. Échantillons de démonstration (N = 200)
const sampleGroupA = Array.from({ length: 200 }, () => 30 + Math.random() * 25 + Math.random() * 20);
const sampleGroupB = Array.from({ length: 200 }, () => 40 + Math.random() * 30 + Math.random() * 15);

const kdeGroupA = calculateKDE(sampleGroupA, 100, 0);
const kdeGroupB = calculateKDE(sampleGroupB, 100, 0);

// Palettes Okabe-Ito (Bleu et Orange Vermillon)
const COLOR_BLUE = '#0072B2';
const COLOR_ORANGE = '#D55E00';
const COLOR_TEXT = '#0F172A';

// 3. Configuration Chart.js v4+
const config = {
  type: 'line',
  data: {
    datasets: [
      {
        label: 'Groupe A (Contrôle)',
        data: kdeGroupA,
        fill: 'start',
        backgroundColor: 'rgba(0, 114, 178, 0.25)', // Opacité 25% pour superposition
        borderColor: COLOR_BLUE,
        borderWidth: 2.5,
        pointRadius: 0, // Désactive les points discrets pour maximiser la continuité
        tension: 0.3
      },
      {
        label: 'Groupe B (Test)',
        data: kdeGroupB,
        fill: 'start',
        backgroundColor: 'rgba(213, 94, 0, 0.25)', // Opacité 25% Okabe-Ito
        borderColor: COLOR_ORANGE,
        borderWidth: 2.5,
        pointRadius: 0,
        tension: 0.3
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      intersect: false
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          color: COLOR_TEXT,
          font: { family: 'Inter', size: 12, weight: '600' },
          usePointStyle: true,
          boxWidth: 10
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#1E293B',
        titleFont: { family: 'Inter', size: 13, weight: '600' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          title: (items) => `Valeur X : ${items[0].parsed.x} units`,
          label: (context) => ` ${context.dataset.label} : Densité ${context.parsed.y}`
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'Valeurs de la variable continue',
          color: COLOR_TEXT,
          font: { family: 'Inter', size: 12, weight: '600' }
        },
        grid: { display: false },
        ticks: { color: COLOR_TEXT, font: { family: 'Inter', size: 11 } }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Densité de probabilité f(x)',
          color: COLOR_TEXT,
          font: { family: 'Inter', size: 12, weight: '600' }
        },
        grid: { color: '#F1F5F9' },
        ticks: { color: '#64748B', font: { family: 'Inter', size: 11 } }
      }
    }
  }
};
```

### 6.5 Principes de Déterminisme pour Agents IA
1. **Application Stricte de la Règle de Silverman & Grille $3 \times h$** : L'agent IA doit toujours utiliser la formule $h^* = 0.9 \cdot \min(s, \text{IQR}/1.34) \cdot N^{-1/5}$ pour le calcul du lissage et étendre les bornes de la grille à `minVal - 3 * h` et `maxVal + 3 * h`.
2. **Gestion de l'Opacité** : Fixer l'opacité de l'arrière-plan à $\alpha = 0.25$ pour prévenir le masquage des distributions superposées.
3. **Guardrail d'invalidation** : Si $N < 30$, l'agent IA doit rejeter le Density Plot et basculer vers un **Strip Plot** ou **Box Plot**.

---

## Règles Cognitives d'Accentuation & Valence

Le tracé de densité continue (KDE) bénéficie d'une hiérarchisation sélective rigoureuse pour éviter la cacophonie visuelle lors de la comparaison de multiples distributions :

### 1. Hiérarchie Visuelle & Ratio 90/10 (Tufte)
- **Distributions de Référence / Cohortes Témoins (90%)** : Les courbes contextuelles adoptent `tokens.emphasis.context` (`#CBD5E1` / gris ardoise), avec un trait fin (`borderWidth: 1.5`) et une aire très légèrement transparente (`alpha: 0.10`).
- **Distribution Cible / Focus Narratif (10%)** : La cohorte d'intérêt (*Hero distribution*) est encodée avec `tokens.emphasis.focal` (trait contrasté `borderWidth: 2.5–3.0`, remplissage saturé `alpha: 0.25`).

### 2. Seuils Métier & Zones Critiques
- **Benchmark / Médiane Cible** : La valeur cible est tracée sous forme d'une ligne verticale de repère avec `tokens.emphasis.benchmark` et tirets (`borderDash: [4, 4]`).
- **Valence Métier** : Pour les distributions de métriques orientées (ex: taux de conversion vs coût d'acquisition), la courbe héroïque adopte `getValenceColor(tokens, delta, metricType)` (Vert `status.success` pour un gain supérieur, Rouge `status.danger` pour une latence ou un coût accru).

### 3. Matrice de Double-Encodage Strict
- **Canal 1 (Couleur & Opacité)** : `tokens.emphasis.focal` vs `tokens.emphasis.context`.
- **Canal 2 (Style de Trait)** : Trait plein renforcé pour la série focale vs ligne fine ou tiretée (`borderDash: [5, 5]`) pour les projections ou contextes.
- **Canal 3 (Texte / Annotations)** : Étiquetage direct du mode ou de la médiane sur la courbe plutôt que dans une légende externe.

### 4. Exemple d'Implémentation Chart.js v4+ (Accentuation & Valence)

```javascript
import { createChart } from './template.js';
import { getEmphasisStyle, getValenceColor } from '../../themes/theme-tokens.js';

// Comparaison de distribution de temps de chargement (avant vs après optimisation)
const speedData = {
  datasets: [
    {
      label: 'Version Précédente (Baseline)',
      rawValues: [120, 140, 155, 160, 175, 180, 195, 210, 230, 260],
      role: 'context', // Encodage atténué 90/10
      fill: true
    },
    {
      label: 'Version Optimisée (Hero)',
      rawValues: [45, 55, 60, 70, 75, 80, 85, 95, 105, 120],
      role: 'focal', // Encodage saillant
      fill: true
    }
  ]
};

// Initialisation avec le thème Viridis Perceptual
const chart = createChart('myCanvas', speedData, 'viridis-perceptual');
```

---

## 7. Sources & Références académiques / clés

1. **Rosenblatt, M. (1956)**. *Remarks on some nonparametric estimates of a density function*. Annals of Mathematical Statistics, 27(3), 832-837.
   - *Apport* : Publication originale de l'estimateur de densité par noyau.
2. **Parzen, E. (1962)**. *On estimation of a probability density function and mode*. Annals of Mathematical Statistics, 33(3), 1065-1076.
   - *Apport* : Généralisation des propriétés de convergence asymptotique de l'estimation par noyau.
3. **Silverman, B. W. (1986)**. *Density Estimation for Statistics and Data Analysis*. Chapman and Hall/CRC.
   - *Apport* : Ouvrage canonique introduisant la formule optimale de largeur de bande (Silverman's Rule of Thumb).
4. **Scott, D. W. (1992)**. *Multivariate Density Estimation: Theory, Practice, and Visualization*. John Wiley & Sons.
   - *Apport* : Théorie approfondie du lissage non paramétrique et de la visualisation de densité.
5. **Wand, M. P., & Jones, M. C. (1995)**. *Kernel Smoothing*. Chapman and Hall/CRC.
   - *Apport* : Traité de référence sur les choix de noyaux et les corrections de frontières.
6. **Wilke, C. O. (2019)**. *Fundamentals of Data Visualization*. O'Reilly Media.
   - *Apport* : Recommandations ergonomiques sur les graphiques de densité et la comparaison de distributions.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modèle de Pointage Continu (MacKenzie 1992, ISO 9241-9)
- **Ciblage Spatial & Largeur Effective $W_e$** : Sur une courbe de densité continue, la cible graphique initiale a une épaisseur de trait de seulement $2\text{px}$. L'intégration de `getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'x', hitRadius: 14, hoverRadius: 7 })` élargit la zone de capture motrice à $W_e = 30\text{px}$. Pour une distance d'approche $D = 300\text{px}$, l'Indice de Difficulté de Fitts passe de $ID = \log_2(300/2 + 1) = 7.24\text{ bits}$ ($MT \approx 1578\text{ms}$) à $ID = \log_2(300/30 + 1) = 3.46\text{ bits}$ ($MT \approx 822\text{ms}$), soit un gain moteur de **$47.9\%$**.
- **Interpolation Continue sur l'Axe de Densité** : La projection continue le long de l'axe $X$ permet d'interroger la fonction de densité $f(x)$ en tout point sans saccade ni à-coup.

### 2. Réactivité Temporelle & Latences Perceptives (Card-Moran-Newell 1983, Nielsen 1993)
- **Instantanéité Perceptive ($\le 100\text{ms}$)** : Affichage du réticule de survol et mise en valeur du point de densité sous $100\text{ms}$ ($60\text{ fps}$).
- **Débounce & Hystérésis Physiologique** : Filtre d'entrée $\Delta t_{\text{enter}} = 80\text{ms}$ neutralisant les bruits d'activation lors des saccades transversales et maintien de sortie $\Delta t_{\text{exit}} = 150\text{ms}$ stabilisant l'infobulle contre les micro-tremblements neuromusculaires.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Auto-Suffisance des *Details-on-Demand*** : L'infobulle affiche la coordonnée $X$ exacte, la valeur de densité estimée avec $4\text{--}5$ décimales au format tabulaire `tokens.fontMono` (`font-variant-numeric: tabular-nums`) et la proportion de population locale.
- **Algorithme Anti-Occlusion Déterministe** : Positionnement via `computeAntiOcclusionTooltipPosition` avec inversion de quadrant vertical vers le bas au sommet de la courbe ($y < \text{margin}$) et clamping latéral strict pour éviter tout débordement d'écran.

### 4. Constance d'Objet & Physique des Courbes d'Amorti (Heer & Robertson 2007, Penner 2002)
- **Transitions Amorties Déterminées** : Le tracé progressif de la courbe de densité et le morphing lors de changements d'échantillons ou de bandwidths appliquent une cinétique `easeOutQuad` ($450\text{ms}$) garantissant une décélération fluide sans oscillation ($\zeta = 1.0$).

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3 (Animation from Interactions)** : Annulation immédiate des animations (`duration: 0`) sous `@media (prefers-reduced-motion: reduce)` via `isReducedMotionPreferred()`.
- **Contraste Élevé & Typographie Tabulaire** : Ratios de contraste $\ge 16:1$ pour les textes et $\ge 3:1$ pour les traits et remplissages de densité, conformité WCAG AAA.
