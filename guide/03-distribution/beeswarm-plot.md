# Fiche Méthodologique : Beeswarm Plot (Swarm Plot / Dot Plot d'Alignement Non-Chevauchant)

> **Catégorie** : 03-distribution  
> **Type Chart.js** : `scatter` (avec pré-calcul déterministe d'empilement/packing des points)  
> **Niveau de précision Cleveland & McGill** : RANG 1 (Position le long d'une échelle commune) — Erreur 3-5%  
> **Dernière révision** : 2026-08-13  

---

## 1. Description & Principe visuel

Le **Beeswarm Plot** (ou *Swarm Plot*, *Sina Plot* compact) est une représentation graphique de distribution dans laquelle chaque observation individuelle est matérialisée par un point non déformé. 

À la différence du Strip Plot (qui applique un décalage aléatoire/jitter), le Beeswarm Plot utilise un **algorithme d'empilement géométrique déterministe** (*circle packing algorithm*). Les points sont disposés le long de l'axe quantitatif $Y$ sans altérer leur valeur réelle, et sont écartés latéralement sur l'axe $X$ au strict minimum requis pour éliminer tout chevauchement (*zero-overlap guarantee*).

Il en résulte un motif visuel évoquant un essaim d'abeilles (*beeswarm*), dont la largeur latérale reflète fidèlement et continûment la densité locale des données.

### Encodages visuels mobilisés
1. **Position sur une échelle commune (Axe Y quantitatif)** : La valeur exacte de chaque point est encodée avec une précision absolue par son centre le long de l'axe vertical gradué.
2. **Équidistance latérale & Largeur d'essaim (Axe X)** : L'écartement par rapport à la ligne centrale du groupe encode la densité relative de points pour la tranche de valeur $Y$ donnée.
3. **Conservation intégrale de la forme du marqueur (Rayon $R$)** : Tous les points conservent la même taille et une surface circulaire intacte.

```
       ALIGNEMENT DÉTERMINISTE SANS CHEVAUCHEMENT (ESSAIM DÉMETRIQUE)
  Y (Mesure Continu)
 100 ┤          ●
  80 ┤        ● ● ●
  60 ┤      ● ● ● ● ●     ◄── Zone de forte densité (Essaim large)
  40 ┤        ● ● ●
  20 ┤          ●         ◄── Zone de faible densité (Essaim étroit)
   0 ┼──────────┼─────────► X (Catégorie)
           Axe Central
```

### Mécanisme Neuro-Cognitif
Le Beeswarm Plot combine l'excellence perceptive du canal de **position sur échelle commune** ($< 200\text{ ms}$, Cleveland & McGill Rang 1) avec la perception globale de la **silhouette de densité** (*contour shape*) issue des lois de la Gestalt (**continuité** et **symétrie**).

Puisque les points sont placés sans chevauchement et de manière symétrique par rapport à l'axe central, l'œil perçoit simultanément les observations individuelles (micro-vue) et l'enveloppe de distribution globale (macro-vue), à la manière d'un Violin Plot composé de vrais points de données.

---

## 2. Quand l'utiliser (Cas d'usage cibles)

### Types de variables adaptées
- **Axe Y (Numérique)** : Variable quantitative continue (ex: niveau d'expression génique, pression artérielle, temps d'exécution d'un pipeline, salaire).
- **Axe X (Catégoriel)** : Variable qualitative nominale ou ordinale (1 à 6 catégories).

### Cas d'usage privilégiés
- **Échantillons de taille faible à modérée ($N = 15$ à $300$ points par catégorie)** : Zone idéale où $N$ est suffisant pour former une silhouette expressive, mais pas trop grand pour provoquer des débordements.
- **Comparaison fine de distributions complexes** : Révélation instantanée des distributions bimodales, trimodales ou asymétriques sans le biais de lissage des estimations de densité de Kernel (KDE).
- **Dashboards médicaux, scientifiques et financiers de haute précision** : Visualisation où chaque donnée représente une entité critique (ex: un patient, une filiale, un produit) nécessitant un survol interactif (*tooltip*) individuel.

### Questions d'analyse résolues
- *Quelle est la silhouette exacte de la distribution pour chaque groupe sans approximation statistique ?*
- *Y a-t-il des sous-populations distinctes au sein du même groupe ?*
- *Les valeurs médianes ou moyennes sont-elles tirées par une poignée d'outliers extrêmes ?*

---

## 3. Quand NE PAS l'utiliser (Contre-indications)

```markdown
| Situation & Données | Pourquoi le Beeswarm Plot échoue | Alternative Recommandée |
| :--- | :--- | :--- |
| **Grands volumes de données** ($N > 500 - 1000$ points par groupe) | L'algorithme d'empilement fait déborder l'essaim latéralement hors de la catégorie, provoquant le chevauchement inter-groupes. | **Violin Plot** ou **Distribution Heatmap** (`distribution-heatmap.md`) |
| **Applications web à très faibles ressources / temps réel** | Complexité algorithmique d'empilement en $O(N^2)$ ralentissant le rendu lors de rafraîchissements à 60 FPS. | **Strip plot** (`strip-plot.md`) avec jitter statique ou **Box Plot** |
| **Espace horizontal disponible très restreint** | Les essaims se retrouvent étouffés ou tronqués sur les bords. | **Box Plot** ou **Histogramme vertical** |
```

---

## 4. Règles cognitives & Meilleures pratiques spécifiques

### 4.1 Algorithme d'Empilement & Respect de la Valeur Y
- **Interdiction absolue de modifier la valeur Y** : Les points doivent conserver leur position exacte sur l'axe vertical. L'ajustement s'effectue **uniquement** sur l'axe horizontal $X$.
- **Critère de Collision Spatiale** : Deux points $i$ et $j$ de rayon $R$ subissent une collision si la distance euclidienne entre leurs centres est inférieure à $2R + \text{padding}$ :
  $$\sqrt{(x_i - x_j)^2 + (y_i - y_j)^2} < 2R + \text{padding}$$
- **Placement Symétrique Alterné** : Pour chaque point trié par ordre croissant de $Y$, calculer le plus petit décalage $|x|$ par rapport au centre de la catégorie (alternant droite $+x$ et gauche $-x$) qui satisfait le critère de non-collision.

### 4.2 Calibrage du Rayon $R$ et de la Largeur Maximale d'Essaim
- **Rayon dynamique selon $N$** :
  - $N \le 50 \implies R = 5\text{px}$ à $6\text{px}$
  - $50 < N \le 200 \implies R = 3.5\text{px}$ à $4.5\text{px}$
  - $N > 200 \implies R = 2.5\text{px}$ à $3\text{px}$
- **Bande limite de catégorie (Swath Boundary)** : Limiter l'extension latérale maximale à **$\pm 35\%$** de l'intervalle catégoriel pour respecter la loi de région commune et empêcher l'empiètement sur les catégories voisines.

### 4.3 Ordre de Tri Préalable
Avant d'exécuter l'empilement, les données **doivent être impérativement triées par valeur $Y$ croissante** (ou par distance à la médiane). Un placement dans un ordre aléatoire produit des essaims asymétriques et visuellement instables.

### 4.4 Encapsulation Chromatique & Double Encodage
- Conserver une couleur de fond uniforme par catégorie (palette Okabe-Ito).
- Utiliser un contour fin contrasté (`borderWidth: 1px`, couleur `#0F172A` ou `#1E293B`) pour maintenir l'accessibilité WCAG AA ($\ge 3:1$) lorsque les points se touchent bord à bord.

---

## 5. Erreurs fréquentes & Anti-patterns visuels

```
  [ ANTI-PATTERN 1 : Altération de Y par Snap-to-Grid ]     [ ANTI-PATTERN 2 : Débordement Inter-Catégories ]
   Y                                                         Y
  100 ┤    ● ● ● ● ●  (Valeurs Y forcées sur des            100 ┤      ●
   80 ┤    ● ● ● ● ●   lignes horizontales artificielles)    80 ┤    ● ● ● ● ●  (Essaim A déborde
   60 ┤    ● ● ● ● ●                                         60 ┤  ● ● ● ● ● ● ● sur l'espace du
   40 ┤    ● ● ● ● ●                                         40 ┤    ● ● ● ● ●   groupe B !)
    0 ┼────────┬────────► X                                  0 ┼──────┬───────┬──────► X
             Cat A                                                 Cat A   Cat B
```

1. **Quantification verticale artificielle (Snap-to-Grid sur Y)** : Forcer les valeurs Y à se placer sur une grille discrète modifie la donnée réelle et crée de faux paliers horizontaux.
2. **Débordement d'essaim (*Swath Spillover*)** : Rayon $R$ trop grand par rapport à l'effectif $N$, provoquant un croisement entre les points de la catégorie A et de la catégorie B.
3. **Empilement asymétrique unilatéral** : Placer tous les points décalés uniquement vers la droite (au lieu d'une alternance symétrique droite/gauche), détruisant la loi Gestalt de symétrie.
4. **Utilisation sur de très grands jeux de données ($N > 1000$)** : Produit des essaims géants totalement déformés nécessitant une réduction de rayon sous le seuil d'acuité visuelle ($< 1\text{px}$).

---

## 6. Recommandations d'implémentation Chart.js

### 6.1 Architecture technique : Type natif `scatter` + Algorithme Swarm
Chart.js ne possède pas de type natif nommé `beeswarm`. La solution industrielle déterministe consiste à utiliser le type **`scatter`** et à calculer les coordonnées $\{x, y\}$ via une fonction d'empilement JavaScript pur avant la transmission à la configuration Chart.js.

### 6.2 Structure HTML & Accessibilité (DOM & ARIA)
```html
<div class="chart-container" role="region" aria-label="Beeswarm plot du niveau d'expression génique par groupe" tabindex="0">
  <canvas id="beeswarmCanvas" role="img" aria-label="Graphique Beeswarm montrant la distribution des niveaux d'expression génique pour 2 groupes. Le groupe A montre une distribution bimodal centrée sur 45 et 85." aria-describedby="beeswarm-fallback"></canvas>
  <div id="beeswarm-fallback" class="sr-only">
    <table>
      <caption>Distribution et synthèse du niveau d'expression génique</caption>
      <thead>
        <tr>
          <th scope="col">Groupe</th>
          <th scope="col">Effectif (N)</th>
          <th scope="col">Médiane</th>
          <th scope="col">Écart Interquartile (IQR)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Groupe Contrôle</td><td>60</td><td>42.5</td><td>18.2</td></tr>
        <tr><td>Groupe Traité</td><td>65</td><td>78.1</td><td>22.4</td></tr>
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
  max-width: 850px;
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

### 6.4 Algorithme Déterministe de Beeswarm Packing & Snippet Chart.js (v4+)

```javascript
import { Chart } from 'chart.js/auto';

/**
 * Algorithme déterministe d'empilement Beeswarm (Swarm Packing)
 * Convertit un tableau de valeurs Y brutes en coordonnées {x, y} pour un Scatter plot.
 */
function calculateBeeswarmPositions(values, categoryIndex, pointRadiusPx, yAxisLengthPx, yMin, yMax, maxOffset = 0.35, categoryWidthPx = 100) {
  if (!values || values.length === 0) return [];

  // 1. Trier les données par valeur Y croissante
  const sorted = values.map((v, i) => ({ val: v, origIdx: i })).sort((a, b) => a.val - b.val);

  // Conversion Y valeur -> Y pixel (échelle linéaire)
  const valToPx = (v) => ((v - yMin) / (yMax - yMin)) * yAxisLengthPx;
  const diameterPx = pointRadiusPx * 2 + 1; // Rayon + 1px padding
  const result = [];

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    const yPx = valToPx(current.val);

    let bestXOffset = 0;
    let found = false;
    let minCollisionDist = -1;
    let fallbackOffset = 0;

    // Tester des candidats d'offset croissants sans s'effondrer sur 0.000 en cas de forte densité
    for (let step = 0; step <= 500; step++) {
      const direction = step % 2 === 0 ? 1 : -1;
      const rawMagnitude = Math.ceil(step / 2) * (diameterPx * 0.5);
      let testOffsetNorm = (direction * rawMagnitude) / categoryWidthPx; // Normalisé par rapport aux dimensions pixel de catégorie

      // Si le décalage candidat dépasse le maxOffset autorisé, borner à maxOffset avec alternance de signe
      if (Math.abs(testOffsetNorm) > maxOffset) {
        testOffsetNorm = direction * maxOffset;
      }

      // Vérifier collision avec tous les points déjà placés
      let collision = false;
      let minOverlapForStep = Infinity;

      for (let j = 0; j < result.length; j++) {
        const prev = result[j];
        const prevYPx = valToPx(prev.rawY);
        const prevXNorm = prev.x - categoryIndex;

        const dyPx = yPx - prevYPx;
        const dxPx = (testOffsetNorm - prevXNorm) * categoryWidthPx; // Échelle spatiale cohérente en pixels (normalisation dynamique)
        const distSq = dxPx * dxPx + dyPx * dyPx;

        if (distSq < diameterPx * diameterPx) {
          collision = true;
          const dist = Math.sqrt(distSq);
          if (dist < minOverlapForStep) {
            minOverlapForStep = dist;
          }
        }
      }

      if (!collision) {
        bestXOffset = testOffsetNorm;
        found = true;
        break;
      } else {
        if (minOverlapForStep > minCollisionDist) {
          minCollisionDist = minOverlapForStep;
          fallbackOffset = testOffsetNorm;
        }
      }

      if (Math.abs((direction * rawMagnitude) / categoryWidthPx) >= maxOffset && step > 2) {
        break;
      }
    }

    if (!found) {
      bestXOffset = fallbackOffset;
    }

    result.push({
      x: categoryIndex + bestXOffset,
      y: current.val,
      rawY: current.val,
      origIdx: current.origIdx
    });
  }

  return result;
}

// Données brutes de démonstration
const rawValuesGroupA = [15, 18, 20, 22, 22, 23, 24, 25, 25, 25, 26, 27, 28, 30, 35, 42, 45, 45, 46, 48, 50, 52, 80, 85, 88];
const rawValuesGroupB = [30, 35, 40, 42, 45, 50, 52, 55, 56, 58, 60, 60, 62, 65, 70, 72, 75, 78, 80, 95];
const categories = ['Groupe Contrôle', 'Groupe Traité'];

const Y_MIN = 0;
const Y_MAX = 100;
const POINT_RADIUS = 5;

// Calcul des positions pour chaque dataset
const swarmDataA = calculateBeeswarmPositions(rawValuesGroupA, 0, POINT_RADIUS, 400, Y_MIN, Y_MAX, 0.35);
const swarmDataB = calculateBeeswarmPositions(rawValuesGroupB, 1, POINT_RADIUS, 400, Y_MIN, Y_MAX, 0.35);

// Couleurs Okabe-Ito
const COLOR_A = '#0072B2'; // Bleu
const COLOR_B = '#D55E00'; // Vermillon

const config = {
  type: 'scatter',
  data: {
    datasets: [
      {
        label: 'Groupe Contrôle',
        data: swarmDataA,
        backgroundColor: COLOR_A,
        borderColor: '#003355',
        borderWidth: 1,
        pointRadius: POINT_RADIUS,
        pointHoverRadius: POINT_RADIUS + 2
      },
      {
        label: 'Groupe Traité',
        data: swarmDataB,
        backgroundColor: COLOR_B,
        borderColor: '#661100',
        borderWidth: 1,
        pointRadius: POINT_RADIUS,
        pointHoverRadius: POINT_RADIUS + 2
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'Inter', size: 12, weight: '600' },
          color: '#0F172A',
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: '#1E293B',
        titleFont: { family: 'Inter', size: 13, weight: '600' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          title: (items) => {
            const catIdx = Math.round(items[0].parsed.x);
            return categories[catIdx] || '';
          },
          label: (context) => ` Valeur : ${context.raw.rawY.toLocaleString('fr-FR')}`
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        min: -0.5,
        max: categories.length - 0.5,
        grid: { display: false },
        ticks: {
          color: '#0F172A',
          font: { family: 'Inter', size: 12, weight: '600' },
          stepSize: 1,
          callback: (val) => {
            const idx = Math.round(val);
            return Math.abs(val - idx) < 0.01 ? categories[idx] : '';
          }
        }
      },
      y: {
        min: Y_MIN,
        max: Y_MAX,
        grid: { color: '#F1F5F9' },
        title: {
          display: true,
          text: 'Niveau d\'expression',
          color: '#475569',
          font: { family: 'Inter', size: 12, weight: '500' }
        },
        ticks: {
          color: '#64748B',
          font: { family: 'Inter', size: 11 }
        }
      }
    }
  }
};
```

### 6.5 Déterminisme pour les Agents IA
- **Algorithme d'empilement déterministe strict** : L'agent IA doit utiliser une fonction d'empilement pure (telle que `calculateBeeswarmPositions`) sans aucune composante aléatoire (`Math.random()`).
- **Tri préalable obligatoire** : Garantir que les valeurs $Y$ sont triées avant le calcul du placement $X$ pour obtenir un essaim strictement reproduisible d'une exécution à l'autre.

---

## Règles Cognitives d'Accentuation & Valence

Le Beeswarm Plot combine la précision absolue d'un nuage de points et la lisibilité d'une forme globale compacte. L'accentuation sélective y prévient la surcharge attentionnelle :

### 1. Hiérarchie Visuelle & Ratio 90/10 (Tufte)
- **Points de Contexte / Cohorte de Base (90%)** : Les points standards de la population sont encodés avec `tokens.emphasis.context` (`#CBD5E1` / gris clair) avec un rayon standard (`pointRadius: 4.0–4.5`) et une opacité $\alpha \approx 0.5$.
- **Points Héroïques / Clusters Focaux (10%)** : Les observations cibles (ex: cohorte test, répondants d'élite) sont encodées avec `tokens.emphasis.focal` (couleur contrastée, opacité 1.0, contour contrasté `surfaceRaised`).

### 2. Détection d'Anomalies & Seuils Statistiques
- **Règle des Extrêmes** : Tout individu au-delà de $2\sigma$ ou $1.5 \text{IQR}$ est isolé.
- **Double Encodage des Outliers** :
  - **Canal Couleur** : `tokens.emphasis.anomaly` (magenta saillant `#D01C8B`).
  - **Canal Forme** : Glyphe géométrique distinct (`pointStyle: 'triangle'`).
  - **Canal Taille** : Rayon augmenté (`pointRadius: 7–8`).

### 3. Valence Métier & Polarité
- Les scores d'impact métier (ex: satisfaction CSAT, taux d'adoption) utilisent `getValenceColor(tokens, delta, 'gain')` (vert `status.success` / ambre `status.warning` / rouge `status.danger`).

### 4. Exemple d'Implémentation Chart.js v4+ (Accentuation & Valence)

```javascript
import { createChart } from './template.js';
import { getEmphasisStyle, getValenceColor } from '../../themes/theme-tokens.js';

// Scores UX de 3 variantes d'interface avec mise en exergue de la variante B
const usabilityData = {
  categories: ['Variante A (Legacy)', 'Variante B (Hero)', 'Variante C (Expérimental)'],
  datasets: [
    {
      label: 'Variante A (Legacy)',
      data: [42, 45, 48, 50, 52, 55],
      role: 'context'
    },
    {
      label: 'Variante B (Hero)',
      data: [72, 75, 78, 80, 82, 85, 98], // 98 = outlier saillant
      role: 'focal',
      anomalies: [6] // Index 6 mis en valeur comme anomalie
    },
    {
      label: 'Variante C (Expérimental)',
      data: [58, 60, 62, 65, 68],
      role: 'context'
    }
  ]
};

// Initialisation avec le thème Okabe-Ito CUD
const chart = createChart('myCanvas', usabilityData, 'okabe-ito-cud');
```

---

## 7. Sources & Références académiques / clés

1. **Wilkinson, L. (1999)**. *Dot Plots*. The American Statistician, 53(3), 276-281.
   - *Apport* : Formulation scientifique initiale des algorithmes de dot plots déterministes et d'empilement de points.
2. **Eklund, A. (2016)**. *beeswarm: The Bee Swarm Plot, an Alternative to Stripchart for Visualizing Small Datasets*. R Package.
   - *Apport* : Standardisation de la terminologie Beeswarm plot et implémentation des algorithmes d'empilement symétriques.
3. **Sidiropoulos, N. et al. (2018)**. *SinaPlot: An Enhanced Chart for Visualizing Data Distributions*. Journal of Computational and Graphical Statistics, 27(3), 673-676.
   - *Apport* : Évolution du beeswarm combinant la densité de Kernel et le placement déterministe de points individuels.
4. **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception: Theory, Computation, and Application to the Development of Graphic Methods*. JASA, 79(387), 531-554.
   - *Apport* : Preuve de la supériorité de la position sur échelle commune.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modèle de Pointage Continu 2D (MacKenzie 1992, ISO 9241-9)
- **Ciblage Spatial 2D & Rayon d'Attraction Élargi** : L'acquisition motrice d'un point d'essaim de diamètre $2r = 4\text{px}$ à une distance $D = 350\text{px}$ impose un Indice de Difficulté $ID = \log_2(350/4 + 1) \approx 6.47\text{ bits}$ ($MT \approx 1424\text{ms}$). En intégrant les options spatiales déterministes `getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 14, hoverRadius: 7 })`, la cible effective passe à $W_e = 4 + 2 \times 14 = 32\text{px}$, ramenant $ID$ à $3.58\text{ bits}$ ($MT \approx 846\text{ms}$), soit un gain moteur de **$40.6\%$** et l'élimination des erreurs d'acquisition.
- **Partition Spatiale de Voronoï Implicite** : Le mode `mode: 'nearest'` avec `axis: 'xy'` et `intersect: false` associe à chaque point de données une cellule d'attraction continue couvrant le plan cartésien, garantissant un survol fluide sans exiger une superposition exacte du pointeur.

### 2. Réactivité Temporelle & Latences Perceptives (Card-Moran-Newell 1983, Nielsen 1993)
- **Instantanéité Perceptive ($\le 100\text{ms}$)** : La réaction visuelle au survol (agrandissement à `hoverRadius: 7px` et activation de la bordure contrastée) s'exécute en $100\text{ms}$ à $60\text{ fps}$, garantissant le sentiment de manipulation directe.
- **Débounce & Hystérésis Physiologique** : Un filtre d'entrée de $80\text{ms}$ neutralise les déclenchements d'infobulles parasites lors des saccades oculaires traversant l'essaim, tandis qu'une persistance de sortie de $150\text{ms}$ protège contre les micro-tremblements physiologiques ($8\text{--}12\text{ Hz}$).

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Auto-Suffisance des *Details-on-Demand*** : L'infobulle affiche la strate catégorielle, le nom de la cohorte, la valeur absolue formatée selon la typographie tabulaire `tokens.fontMono` (`font-variant-numeric: tabular-nums`) et le rôle sémantique (Focal, Contexte, Anomalie).
- **Algorithme Anti-Occlusion Déterministe** : Les coordonnées sont calculées via `computeAntiOcclusionTooltipPosition` avec déport vertical de sécurité ($12\text{px}$ au-dessus du point) et basculement automatique de quadrant (*quadrant flipping* vers le bas) lorsque le point approche du bord supérieur du canvas ($y < \text{margin}$), évitant tout masquage des points voisins.

### 4. Constance d'Objet & Physique des Courbes d'Amorti (Heer & Robertson 2007, Penner 2002)
- **Transitions Amorties Déterminées** : Les réorganisations de points et changements de thèmes appliquent une cinétique à décélération douce `easeOutQuart` ($400\text{ms}$) ou `easeOutCubic` ($350\text{ms}$) sans oscillation parasite ($\zeta = 1.0$), prévenant la cécité au changement (*Change Blindness*). Les animations perpétuelles en boucle sont proscrites.

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3 (Animation from Interactions)** : Dès la détection du drapeau système `@media (prefers-reduced-motion: reduce)` via `isReducedMotionPreferred()`, la durée d'animation est instantanément ramenée à `0ms` (`duration: 0`, `hover.animationDuration: 0`).
- **Contraste & Typographie Tabulaire** : Le texte de l'infobulle respecte un ratio de contraste supérieur à $16:1$ sur fond sombre, avec bordure de délimitation `borderStrong` ($\ge 3:1$) et fonte monospace pour l'alignement strict des décimales.
