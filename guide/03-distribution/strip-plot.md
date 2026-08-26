# Fiche Méthodologique : Graphique en Bandes de Points (Strip Plot / Jitter Plot / 1D Scatter Plot)

> **Catégorie** : 03-distribution  
> **Type Chart.js** : `scatter` (avec transformation $X$ discrète + jittering PRNG déterministe et bornes de graduation fixe `min: -0.5, max: N - 0.5`)  
> **Niveau de précision Cleveland & McGill** : RANG 1 (Position le long d'une échelle commune pour les valeurs individuelles 1D) & RANG 7 (Teinte / Saturation par opacité alpha blending pour la densité locale) — Erreur 3-5%  
> **Dernière révision** : 2026-08-13  

---

## 1. Description & Principe visuel

Le **graphique en bandes de points** (ou *Strip Plot*, parfois appelé *Jitter Plot* ou *1D Scatter Plot*) est la représentation graphique la plus directe et la plus fidèle pour afficher la distribution d'une variable quantitative à travers une ou plusieurs catégories. Contrairement aux diagrammes synthétiques comme le Box Plot ou l'Histogramme qui agrègent les données en statistiques résumées ou en classes, le Strip Plot affiche **$100\%$ des observations individuelles brutes** sous forme de points le long d'un axe continu vertical (ou horizontal), sans aucune perte d'information.

Pour résoudre le problème fondamental du chevauchement exact des points (*overplotting*) lorsque plusieurs observations possèdent la même valeur quantitative, une méthode statistique appelée **jittering** (dispersion latérale aléatoire contrôlée) est appliquée le long de l'axe perpendiculaire catégoriel.

```
                    SCHÉMA STRUCTUREL D'UN STRIP PLOT AVEC JITTERING
  Échelle Y (Valeurs Quantitatives Continues)
   80 ┤                            o
   70 ┤                         o    o   ◄── Outliers identifiables sans masquage
   60 ┤                        (o) o
   50 ┤         o  o  o           o      ◄── Zone de moyenne densité
   40 ┤       o (o o) o        o o o o
   30 ┤      (o o o o o)       (o o o)   ◄── Zone de forte densité (Chevauchement = Saturation)
   20 ┤       o (o o) o          o o
   10 ┤         o  o              o
    0 ┼───────┴───────┴───────┴───────┴───────► Axe X (Index des Catégories)
           Groupe A        Groupe B
           (X = 0)         (X = 1)
      ◄─ Jitter Amplitude ─► (min: -0.5, max: N - 0.5)
         (± 0.15 canal)
```

### Fondements Mathématiques : PRNG Déterministe & Opacité Calibrée

#### 1. Jittering Déterministe par Générateur Pseudo-Aléatoire Reproductible (PRNG)
Pour respecter le principe de **déterminisme visuel des agents IA**, l'injection de bruit latéral ne doit jamais reposer sur un `Math.random()` non réinitialisable (qui régénérerait des positions différentes à chaque rendu du canvas). On utilise un algorithme PRNG déterministe à graine (*seeded PRNG*), tel que **Mulberry32** :

Soit une graine initiale $\text{seed} \in \mathbb{N}$. Le générateur produit une séquence de nombres pseudo-aléatoires $r_k \in [0, 1[$ :
$$t_k = (S_{k-1} + \text{0x6D2B79F5}) \pmod{2^{32}}$$
$$r_k = \frac{(t_k \oplus (t_k \gg 15)) \times (t_k \lor 1)}{2^{32}}$$

Pour une observation $y_{i, j}$ appartenant au groupe d'index $i \in \{0, 1, \dots, N-1\}$, la coordonnée horizontale perturbée $x_{i, j}$ est calculée par :
$$x_{i, j} = i + \text{amplitude} \times (2 \cdot r_{i, j} - 1)$$

Où :
- $i$ est l'index entier du canal catégoriel (ex: $0$ pour Groupe A, $1$ pour Groupe B).
- $\text{amplitude}$ est le facteur de dispersion latérale (strictement $0.10 \le \text{amplitude} \le 0.18$, recommandé $0.15$).
- $r_{i, j} \in [0, 1[$ est la valeur retournée par le PRNG Mulberry32 déterministe.

#### 2. Calibration Scientifique de l'Opacité ($\alpha$-Blending) selon la Taille $N$
La superposition de points partiellement transparents crée un gradient de saturation chromatique naturel (loi de Beer-Lambert visuelle). L'opacité $\alpha \in ]0, 1]$ du remplissage des points **doit être calibrée mathématiquement** en fonction du nombre d'observations $N$ par groupe :

$$\alpha(N) = \max \left( 0.15, \min \left( 0.80, \frac{1}{\sqrt{N}} \right) \right)$$

```markdown
| Taille d'échantillon ($N$) | Opacité recommandée ($\alpha$) | Rayon du point ($r$) | Effet Perceptif |
| :--- | :--- | :--- | :--- |
| **$N \le 15$** (Très petit) | $\alpha = 0.85$ ($85\%$) | $r = 6\text{ px}$ | Points individuels très détachés et bien lisibles. |
| **$15 < N \le 50$** (Moyen) | $\alpha = 0.50$ ($50\%$) | $r = 5\text{ px}$ | Transparence équilibrée, superposition légère visible. |
| **$50 < N \le 100$** (Grand) | $\alpha = 0.30$ ($30\%$) | $r = 4\text{ px}$ | Forte densité révélée par la saturation cumulative de couleur. |
| **$N > 100$** (Limite) | $\alpha = 0.15$ ($15\%$) | $r = 3\text{ px}$ | Basculer vers un Beeswarm Plot ou un Box Plot si $N > 150$. |
```

### Encodages visuels mobilisés
1. **Position 1D le long d'une échelle commune (Axe Y)** : Valeur quantitative exacte de chaque observation (Rang 1 Cleveland & McGill).
2. **Position orthogonale perturbée (Axe X)** : Perturbation latérale sans valeur sémantique (évite uniquement la superposition).
3. **Densité visuelle par Saturation (Teinte/Luminance)** : L'accumulation de points transparents augmente l'opacité perçue (Rang 7 Cleveland & McGill).
4. **Groupement par Canaux Spatiaux (Axe X)** : Séparation claire des catégories.

### Mécanisme Neuro-Cognitif
Le Strip Plot active l'attention visuelle pré-attentive pour la détection de **distributions réelles sans filtre**.
- **Loi de Proximité (Gestalt)** : Les points regroupés dans l'espace d'une même bande sont perçus comme appartenant à la même catégorie. L'amplitude du jitter doit impérativement être inférieure au demi-espacement des canaux ($\text{amplitude} \le 0.20$) pour ne pas violer les frontières perceptives entre groupes.
- **Principe de Fidélité et Transparence Absolue** : Selon Weissgerber et al. (2015), présenter les données individuelles élimine les illusions cognitives créées par les barres de moyenne/écart-type qui masquent les distributions asymétriques ou bimodales.
- **Réduction du biais d'agrégation (Sweller)** : Permet d'évaluer directement si un résultat significatif provient de l'ensemble du groupe ou de 2 ou 3 points aberrants extrêmes.

---

## 2. Quand l'utiliser (Cas d'usage cibles)

### Types de variables adaptées
- **Axe horizontal (Axe X)** : Variable qualitative catégorielle ($1$ à $8$ catégories max).
- **Axe vertical (Axe Y)** : Variable quantitative continue ou discrète.

### Cas d me usage privilégiés
- **Petits à moyens échantillons ($N \le 100$ par groupe, idéalement $N \in [10, 60]$)** : Domaines de la recherche scientifique, des essais cliniques, des tests de performance et de l'expérimentation A/B.
- **Superposition avec un indicateur de tendance centrale (Médiane & IQR)** : Ajouter un trait horizontal épais pour la médiane et des moustaches légères pour donner à la fois le résumé statistique et la masse brute des données.
- **Détection des trous de distribution (*Data Gaps*) et micro-clusters** : Révéler si les données sont réparties de manière continue ou si elles forment des sous-groupes isolés.
- **Contrôle d'intégrité des données** : Vérifier s'il existe des effets d'arrondi (ex: points alignés sur des entiers).

### Questions d'analyse résolues
- *Combien d'observations réelles composent chaque groupe (visualisation directe de $N$) ?*
- *Existe-t-il des micro-clusters ou des sous-groupes masqués au sein d'une même catégorie ?*
- *Les valeurs aberrantes sont-elles réellement isolées ou font-elles partie d'une seconde distribution ?*

---

## 3. Quand NE PAS l'utiliser (Contre-indications)

```markdown
| Situation & Données | Pourquoi le Strip Plot échoue | Alternative Recommandée |
| :--- | :--- | :--- |
| **Très grands volumes de données** ($N > 300-500$) | Les points s'accumulent en un bloc noir/sombre massif totalement saturé (*Overplotting* chaotique). | **Box Plot** (`box-plot.md`) ou **Density Plot** (`density-plot.md`) |
| **Nombreux groupes catégoriels** ($> 10$ groupes) | L'espace horizontal devient trop étroit pour appliquer un jittering lisible. | **Box Plot Horizontal** (`box-plot.md`) |
| **Données strictement discrets à faibles valeurs** (ex: notes de 1 à 5) | Même avec le jittering, les points forment des lignes horizontales rigides peu informatives. | **Beeswarm Plot** (`beeswarm-plot.md`) ou **Heatmap de distribution** |
| **Public exigeant une présentation ultra-synthétique** | La masse de points peut sembler "bruitée" ou complexe pour un tableau de bord exécutif. | **Bullet Chart** ou **Bar Chart avec barres d'erreur** |
```

---

## 4. Règles cognitives & Meilleures pratiques spécifiques

### 4.1 La Règle d'Or du Jittering Déterministe
- **Jamais de Jitter sur l'axe des Valeurs (Axe Y)** : Le bruit aléatoire **doit être appliqué exclusivement sur l'axe catégoriel neutre (Axe X)**. Appliquer un jitter sur Y altère la valeur quantitative mesurée, ce qui constitue une falsification de données (*Lie Factor* de Tufte).
- **Amplitude du Jitter ($\pm 0.15$)** : L'amplitude de la perturbation latérale doit être bornée entre $-0.15$ et $+0.15$ unités de catégorie. Si l'amplitude dépasse $0.35$, les points d'un groupe envahissent l'espace du groupe voisin (violation de la loi de proximité Gestalt).

```
      JITTERING HARMONIEUX (amplitude = 0.15)            JITTERING EXCESSIF (amplitude = 0.40)
  ┌─────────────────────────────────────┐   ┌─────────────────────────────────────┐
  │     Groupe A       Groupe B         │   │     Groupe A       Groupe B         │
  │      o  o o         o o  o          │   │      o  o o o o   o o  o o          │
  │     o (o o) o      (o o o)          │   │     o (o o (o o o) o o o)           │  ◄── Confusion entre
  │      o  o o         o o  o          │   │      o  o o o o   o o  o o          │      les deux catégories !
  └─────────────────────────────────────┘   └─────────────────────────────────────┘
   Séparation nette entre canaux (Gestalt)    Chevauchement chaotique des groupes
```

### 4.2 Bornes d'Échelle Fixes (`min: -0.5, max: N - 0.5`)
Pour centrer parfaitement les canaux de catégories dans l'espace de tracé Canvas de Chart.js, l'axe linéaire $X$ **doit impérativement être configuré avec des bornes explicites** :
- `min = -0.5`
- `max = N - 0.5` (où $N$ est le nombre total de catégories).

Cette règle garantit que la première catégorie (index $0$) dispose d'une marge exacte de $0.5$ à gauche et la dernière (index $N-1$) d'une marge de $0.5$ à droite, offrant une symétrie parfaite.

### 4.3 Superposition de Repères Statistiques (Médiane & IQR)
Pour maximiser la valeur analytique du Strip Plot, il est fortement recommandé de superposer en arrière-plan ou en avant-plan des repères statistiques non-paramétriques :
- Un **trait horizontal épais** (`borderWidth: 3px`, couleur sombre `#0F172A`) matérialisant la **Médiane** ($Q_2$).
- Une fine plage rectangulaire ou des moustaches discrètes pour l'**Écart Interquartile** ($Q_1 - Q_3$).

---

## 5. Erreurs fréquentes & Anti-patterns visuels

```
   [ ANTI-PATTERN 1 : 100% Opaque sans Jitter ]        [ ANTI-PATTERN 2 : Jittering sur l'Axe Quantitatif Y ]
  Y                                                      Y (Valeurs altérées !)
 50 ┤         o            o                            50 ┤       o  o o          o o  o
 40 ┤        (o) ◄── 20 points superposés masqués !     40 ┤     o (o o) o        (o o o)  ◄── Bruit ajouté sur
 30 ┤         o            o                            30 ┤      o  o o         o o  o       les vraies valeurs !
  0 ┼─────────┴────────────┴────────► X                  0 ┼───────┴───────────────┴────────► X
           Groupe A     Groupe B                                Groupe A        Groupe B
```

1. **Points 100% opaques sans jittering** : Tous les points partageant la même valeur tombent exactement au même pixel, donnant l'illusion trompeuse d'un point unique (masquage de $90\%$ des données).
2. **Jittering sur l'axe Y des valeurs** : Injecter du bruit sur la mesure quantitative fausse les valeurs réelles.
3. **Absence de graine PRNG (Utilisation de `Math.random()`)** : Provoque un clignotement ou un saut des points à chaque redimensionnement ou survol de la souris.
4. **Absence de bornes fixes d'échelle (`min/max`)** : Entraîne un décalage des points de la première catégorie contre le bord gauche de la zone de tracé.
5. **Couleurs incohérentes** : Affecter des couleurs aléatoires aux points d'un même groupe violant la loi de similarité de la Gestalt.

---

## 6. Recommandations d'implémentation Chart.js

### 6.1 Architecture technique : Type natif `'scatter'`
En Chart.js v4+, le Strip Plot est implémenté via le type natif **`scatter`**. 
- Chaque catégorie est représentée par son index entier ($0, 1, 2, \dots, N-1$) sur l'axe $X$.
- Un algorithme JS applique la formule Mulberry32 PRNG pour générer l'écart `xJitter` déterministe.
- L'axe $X$ utilise un type `linear` avec un `callback` de graduation retournant le nom de la catégorie correspondante.

### 6.2 Structure HTML & Accessibilité (DOM & ARIA)
```html
<div class="chart-container" role="region" aria-label="Graphique en bandes de points du temps de chargement des pages par navigateur" tabindex="0">
  <canvas id="stripPlotCanvas" role="img" aria-label="Graphique en bandes de points montrant les temps de chargement individuels pour Chrome, Firefox et Safari. Chrome présente la médiane la plus basse à 210 ms." aria-describedby="stripplot-fallback"></canvas>
  <div id="stripplot-fallback" class="sr-only">
    <table>
      <caption>Distribution individuelle des temps de chargement par navigateur (N = 45 par groupe)</caption>
      <thead>
        <tr>
          <th scope="col">Navigateur</th>
          <th scope="col">Nombre de points (N)</th>
          <th scope="col">Min (ms)</th>
          <th scope="col">Médiane (ms)</th>
          <th scope="col">Max (ms)</th>
          <th scope="col">Outliers (> Q3 + 1.5*IQR)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Chrome</td><td>45</td><td>120</td><td>210</td><td>380</td><td>380 ms</td></tr>
        <tr><td>Firefox</td><td>45</td><td>145</td><td>245</td><td>420</td><td>410 ms, 420 ms</td></tr>
        <tr><td>Safari</td><td>45</td><td>160</td><td>280</td><td>490</td><td>490 ms</td></tr>
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
  height: 450px;
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

### 6.4 Algorithme JS PRNG Mulberry32, Jittering & Configuration Chart.js v4+

```javascript
import { Chart } from 'chart.js/auto';

// 1. Générateur Pseudo-Aléatoire Déterministe (Mulberry32 PRNG)
function createMulberry32(seed) {
  let s = seed >>> 0;
  return function() {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 2. Calculateur d'opacité déterministe selon N
function getCalibratedAlpha(n) {
  if (n <= 0) return 0.5;
  const alpha = 1 / Math.sqrt(n);
  return Math.max(0.15, Math.min(0.80, alpha));
}

// Données brutes par catégorie
const categories = ['Chrome', 'Firefox', 'Safari'];
const rawDataset = {
  'Chrome': [120, 140, 150, 165, 170, 175, 180, 190, 195, 200, 205, 210, 215, 220, 225, 230, 240, 250, 260, 280, 380],
  'Firefox': [145, 160, 175, 185, 195, 200, 210, 220, 230, 240, 245, 250, 260, 270, 285, 295, 310, 330, 350, 410, 420],
  'Safari': [160, 180, 190, 205, 215, 225, 240, 250, 265, 275, 280, 290, 300, 315, 325, 340, 360, 380, 410, 440, 490]
};

// Initialisation du PRNG avec une graine fixe pour garantir 100% de répétabilité
const prng = createMulberry32(42);
const JITTER_AMPLITUDE = 0.14; // Perturbation latérale bornée à +/- 0.14

// Palettes Okabe-Ito (Bleu, Orange, Vert Céladon)
const PALETTE = ['#0072B2', '#D55E00', '#009E73'];
const COLOR_TEXT = '#0F172A';

// Transformation des données brutes en points scatter jitterés
const chartDatasets = categories.map((catName, catIdx) => {
  const values = rawDataset[catName];
  const alpha = getCalibratedAlpha(values.length);
  const colorHex = PALETTE[catIdx % PALETTE.length];
  
  // Conversion HEX + Alpha vers RGBA
  const r = parseInt(colorHex.slice(1, 3), 16);
  const g = parseInt(colorHex.slice(3, 5), 16);
  const b = parseInt(colorHex.slice(5, 7), 16);
  const bgRgba = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;

  const points = values.map(val => {
    // Calcul du jitter horizontal déterministe
    const jitterOffset = (prng() * 2 - 1) * JITTER_AMPLITUDE;
    return {
      x: Number((catIdx + jitterOffset).toFixed(3)),
      y: val,
      rawVal: val,
      category: catName
    };
  });

  return {
    label: catName,
    data: points,
    backgroundColor: bgRgba,
    borderColor: colorHex,
    borderWidth: 1,
    pointRadius: 5,
    pointHoverRadius: 7
  };
});

// 3. Configuration Chart.js v4+
const numCategories = categories.length;
const config = {
  type: 'scatter',
  data: {
    datasets: chartDatasets
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
          color: COLOR_TEXT,
          font: { family: 'Inter', size: 12, weight: '600' },
          usePointStyle: true,
          boxWidth: 8
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
          title: (items) => `Navigateur : ${items[0].raw.category}`,
          label: (context) => ` Temps mesuré : ${context.raw.rawVal} ms`
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        // Règle d'or : Bornes d'échelle fixes pour centrer les canaux
        min: -0.5,
        max: numCategories - 0.5,
        ticks: {
          stepSize: 1,
          color: COLOR_TEXT,
          font: { family: 'Inter', size: 12, weight: '600' },
          callback: (value) => {
            const index = Math.round(value);
            return categories[index] !== undefined ? categories[index] : '';
          }
        },
        grid: {
          display: true,
          color: '#E2E8F0',
          drawTicks: true
        }
      },
      y: {
        beginAtZero: true, // Règle d'or de fidélité
        title: {
          display: true,
          text: 'Temps de chargement (ms)',
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
1. **Utilisation obligatoire d'un PRNG déterministe** : Interdiction formelle d'utiliser `Math.random()`. L'agent IA doit inclure une fonction PRNG déterministe à graine fixe (ex: Mulberry32 avec `seed = 42`).
2. **Fixation stricte des bornes de l'Axe X** : L'axe X catégoriel doit systématiquement porter les bornes `min: -0.5` et `max: N - 0.5`.
3. **Guardrail d'invalidation pour $N > 100$** : Si le dataset contient plus de $100$ points par groupe, l'agent IA doit rejeter le Strip Plot et basculer vers un **Box Plot** (`box-plot.md`) ou un **Density Plot** (`density-plot.md`).

---

## Règles Cognitives d'Accentuation & Valence

Le Strip Plot (avec jitter déterministe) offre une granularité maximale. L'accentuation cognitive y joue un rôle déterminant pour extraire instantanément le signal du bruit :

### 1. Hiérarchie Visuelle & Ratio 90/10 (Tufte)
- **Observations de Contexte (90%)** : Les points normaux de la distribution adoptent `tokens.emphasis.context` (`#CBD5E1` / gris clair) avec un rayon modéré (`pointRadius: 3.5–4.5`) et une opacité $\alpha \approx 0.5$.
- **Points Héroïques / Cibles (10%)** : Les individus clés (ex: top performers, anomalies ou cohorte test) utilisent `tokens.emphasis.focal` (couleur contrastée, rayon élargi `pointRadius: 6–7`, opacité 1.0).

### 2. Détection d'Anomalies & Seuils Critiques
- **Règle Statistique $2\sigma$ ou $1.5 \text{IQR}$** : Tout point s'écartant au-delà du seuil statistique est mis en valeur.
- **Double Encodage Strict des Anomalies** :
  - **Couleur** : `tokens.emphasis.anomaly` (magenta saillant `#D01C8B`).
  - **Forme** : Glyphe triangulaire (`pointStyle: 'triangle'`) avec rayon augmenté (`pointRadius: 7–8`).
  - **Contour** : Bordure contrastée blanche ou `surfaceRaised` (`borderWidth: 1.5`).

### 3. Valence Métier & Directionnalité
- Pour des métriques financières ou de rentabilité, les points en gain supérieur adoptent `status.success` (vert) tandis que les pertes critiques adoptent `status.danger` (rouge).
- Pour des métriques de risque/latence, la polarité est inversée via `getValenceColor(tokens, delta, 'cost')`.

### 4. Exemple d'Implémentation Chart.js v4+ (Accentuation & Valence)

```javascript
import { createChart } from './template.js';
import { getEmphasisStyle, getValenceColor } from '../../themes/theme-tokens.js';

// Analyse de temps de chargement avec points normaux (contexte) et anomalies (> 90ms)
const perfData = {
  categories: ['API Gateway', 'Microservice Auth', 'Base de Données'],
  datasets: [
    {
      label: 'API Gateway',
      data: [
        { x: 1, y: 35, role: 'context' },
        { x: 1, y: 42, role: 'context' },
        { x: 1, y: 38, role: 'context' },
        { x: 1, y: 98, role: 'anomaly' } // Point aberrant double-encodé
      ]
    },
    {
      label: 'Microservice Auth',
      data: [
        { x: 2, y: 22, role: 'context' },
        { x: 2, y: 25, role: 'context' },
        { x: 2, y: 28, role: 'focal' }
      ]
    }
  ]
};

// Initialisation avec le thème Tableau 10 Stone
const chart = createChart('myCanvas', perfData, 'tableau-stone-categorical');
```

---

## 7. Sources & Références académiques / clés

1. **Chambers, J. M., Cleveland, W. S., Kleiner, B., & Tukey, P. A. (1983)**. *Graphical Methods for Data Analysis*. Wadsworth & Brooks/Cole.
   - *Apport* : Formalisation originale des 1D scatter plots et introduction des techniques d'injection de bruit (jittering).
2. **Weissgerber, T. L., Milic, N. M., Winham, S. J., & Garovic, V. D. (2015)**. *Beyond bar and line graphs: time for a new data presentation paradigm*. PLOS Biology, 13(4), e1002128.
   - *Apport* : Étude majeure démontrant la nécessité de remplacer les bar charts synthétiques par des strip plots montrant les données brutes.
3. **Cleveland, W. S. (1985)**. *The Elements of Graphing Data*. Hobart Press.
   - *Apport* : Principes de perception visuelle appliquée aux nuages de points et gestion du chevauchement.
4. **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.
   - *Apport* : Règle de fidélité visuelle et présentation transparente des micro-données sans distorsion.
5. **Wilkinson, L. (1999)**. *Dot Plots*. The American Statistician, 53(3), 276-281.
   - *Apport* : Analyse comparative approfondie entre dot plots déterministes et strip plots aléatoires.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Ciblage Spatial 2D (MacKenzie 1992, ISO 9241-9)
- **Ciblage Spatial 2D & Rayon d'Attraction Élargi** : L'acquisition d'un point jitterisé ($2r = 4\text{px}$) à distance $D = 350\text{px}$ requiert $MT \approx 1424\text{ms}$ ($ID = 6.47\text{ bits}$). En appliquant les options spatiales `getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 14, hoverRadius: 7 })`, la surface effective de pointage atteint $W_e = 32\text{px}$, réduisant $ID$ à $3.58\text{ bits}$ ($MT \approx 846\text{ms}$), soit un gain de **$40.6\%$** et l'élimination des erreurs de visée.
- **Partition Spatiale de Voronoï Implicite** : Le mode `nearest` en coordonnées $XY$ sans intersection stricte permet de survoler les points individuels dispersés par jitter sans saccade ni imprécision.

### 2. Réactivité Temporelle & Latences Perceptives (Card-Moran-Newell 1983, Nielsen 1993)
- **Instantanéité Perceptive ($\le 100\text{ms}$)** : Réaction visuelle immédiate du point survolé (agrandissement à `hoverRadius: 7px` et halo contrasté) en $100\text{ms}$ à $60\text{ fps}$.
- **Débounce & Hystérésis Physiologique** : Filtre d'entrée $\Delta t_{\text{enter}} = 80\text{ms}$ pour prévenir les infobulles intempestives lors du balayage de la bande, et persistance $\Delta t_{\text{exit}} = 150\text{ms}$ contre les micro-tremblements neuromusculaires.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Auto-Suffisance des *Details-on-Demand*** : L'infobulle détaille la catégorie, l'identifiant ou l'observation, la valeur quantitative exacte au format tabulaire `tokens.fontMono` (`font-variant-numeric: tabular-nums`) et son rôle sémantique (Focal, Contexte, Anomalie).
- **Algorithme Anti-Occlusion Déterministe** : Positionnement via `computeAntiOcclusionTooltipPosition` avec déport vertical ($12\text{px}$) et inversion automatique de quadrant vers le bas lors de l'approche du bord supérieur ($y < \text{margin}$).

### 4. Constance d'Objet & Physique des Courbes d'Amorti (Heer & Robertson 2007, Penner 2002)
- **Transitions Amorties Déterminées** : Les réorganisations de points et changements de thèmes appliquent une cinétique `easeOutQuart` ($400\text{ms}$) ou `easeOutCubic` ($350\text{ms}$) sans oscillation parasite ($\zeta = 1.0$), prévenant la cécité au changement (*Change Blindness*).

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3 (Animation from Interactions)** : Durée ramenée à `0ms` dès détection de `@media (prefers-reduced-motion: reduce)` via `isReducedMotionPreferred()`.
- **Contraste Élevé & Typographie Tabulaire** : Ratios de contraste $\ge 16:1$ pour le texte d'infobulle et $\ge 3:1$ pour les points et bordures, conformité WCAG AAA.
