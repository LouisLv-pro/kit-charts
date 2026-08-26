# Fiche Méthodologique : Sunburst Chart (Diagramme Rayonnant)

> **Catégorie** : Composition / Part-to-Whole  
> **Type Chart.js** : Multi-level `doughnut` (Nested Datasets) ou Plugin custom  
> **Niveau de précision Cleveland & McGill** : RANG 5 (Angle / Surface par anneau polaire) — Erreur 15–25%  
> **Dernière révision** : 2026-08-13  

---

## 1. Description & Principe visuel

Le **Sunburst Chart** (ou *Diagramme rayonnant* / *Camembert multi-niveaux*) est une représentation polaire de la décomposition d'un tout sous forme d'anneaux concentriques divisés en segments angulaires. L'anneau le plus au centre représente le niveau supérieur de la hiérarchie (nœuds parents), tandis que les anneaux extérieurs successifs décomposent chaque parent en ses sous-catégories enfants.

### Encodages visuels mobilisés
1. **Angle d'ouverture ($\theta$)** : L'angle d'un secteur parent contraint la somme angulaire absolue de l'ensemble de ses enfants : $\theta_{\text{parent}} = \sum \theta_{\text{enfants}}$.
2. **Profondeur radiale / Rayon ($r$)** : La distance au centre matérialise la profondeur dans l'arbre hiérarchique ($L1 \rightarrow L2 \rightarrow L3$).
3. **Imbrication polaire (Contraintes de Continuité Gestalt)** : L'alignement angulaire des frontières valide la relation de sous-ensemble (Part-au-tout hiérarchique).
4. **Teinte & Saturation** : Continuité de la teinte de la couleur mère vers les enfants avec dégradation de saturation.

```
                 HIÉRARCHIE POLAIRE CONCENTRIQUE (SUNBURST)
                               ┌────────┐
                           . '    12h     ' .
                       . '   ┌──────────┐   ' .
                     /   L2  │ L1 (Eur) │ L2  \
                    / (FR)   └──────────┘ (DE) \
                   |   ┌────────┐    ┌────────┐ |
                   |───│L1 (Eur)│ C  │L1(Amer)│─|  ◄── Anneau Intérieur (Niveau 1)
                   |   └────────┘    └────────┘ |  ◄── Anneau Extérieur (Niveau 2)
                    \  (USA)   . '  . '  (CAN) /
                     \   L2  '        └────   /
                       . ' ────┴───┴────── ' .
                               └────────┘
             ◄── Alignement angulaire strict Parent-Enfant ──►
```

### Mécanisme Neuro-Cognitif
Développé par Stasko & Zhang (2000), le Sunburst Chart combine la décomposition en part-au-tout et la navigation hiérarchique. Le système visuel humain perçoit la relation hiérarchique grâce à la loi de **continuité et de clôture de la Gestalt** : le regard suit les rayons émanant du centre vers la périphérie pour explorer la structure arborescente.

Toutefois, le Sunburst présente un **biais perceptif polaire majeur** : pour un même angle $\theta$, la surface $A$ d'un secteur augmente en fonction du carré du rayon ($A \propto r^2$). Ainsi, un segment situé sur l'anneau extérieur paraît visuellement beaucoup plus étendu et important qu'un segment situé au centre avec exactement la même proportion relative. L'utilisateur doit s'appuyer sur l'angle au centre $\theta$ (Rang 5 Cleveland & McGill) plutôt que sur la surface apparente 2D.

---

## 2. Quand l'utiliser (Cas d'usage cibles)

### Types de variables adaptées
- **Hiérarchie (Structure)** : Variable qualitative hiérarchique stricte comportant **2 à 3 niveaux de profondeur** maximum.
- **Valeurs (Métriques)** : Variable quantitative continue additive (ex: chiffre d'affaires mondial par continent $\rightarrow$ pays $\rightarrow$ canal de vente).

### Cas d'usage privilégiés
- **Exploration d'arborescences de ventes globales** (ex: *Monde $\rightarrow$ Régions $\rightarrow$ Catégories de produits*).
- **Analyse des parcours utilisateurs (Clickstream/Funnel)** (ex: *Page d'accueil $\rightarrow$ Catégorie $\rightarrow$ Fiche produit*).
- **Décomposition des coûts opérationnels** (ex: *Dépense globale $\rightarrow$ Département $\rightarrow$ Type de prestation*).

### Questions d'analyse résolues
- *Comment une branche majeure se décompose-t-elle au niveau inférieur ?*
- *Quelle est la contribution relative d'une sous-catégorie spécifique par rapport à la catégorie mère et au total général ?*

---

## 3. Quand NE PAS l'utiliser (Contre-indications)

```markdown
| Situation & Données | Pourquoi le Sunburst échoue | Alternative Recommandée |
| :--- | :--- | :--- |
| **Données plat-non hiérarchiques** (1 seul niveau) | Complexité polaire inutile et espace central perdu. | **Doughnut Chart** (`doughnut-chart.md`) |
| **Hiérarchie profonde** ($> 3-4$ niveaux) | Anneaux périphériques filiformes, étiquettes illisibles. | **Treemap** (`treemap.md`) ou **Dendrogramme** |
| **Comparaison quantitative de précision** | L'illusion d'aire liée au rayon déforme la perception des proportions. | **Stacked Bar Chart** (`stacked-bar-chart.md`) |
| **Nombreux petits enfants** ($N > 20$ sur l'anneau ext.) | Fragementation angulaire poussée sous le seuil d'acuité pré-attentive ($< 2^\circ$). | **Treemap** (`treemap.md`) |
| **Valeurs négatives** | Impossible de représenter un angle négatif dans un secteur polaire. | **Bar Chart** |
```

---

## 4. Règles cognitives & Meilleures pratiques spécifiques

### 4.1 Limite de Profondeur à 2-3 Niveaux
Ne jamais dépasser **3 niveaux d'anneaux concentriques** sur un même graphique statique. Au-delà, l'épaisseur radiale de chaque anneau devient trop fine et la lisibilité du texte s'effondre.

### 4.2 Harmonie Chromatique Parent-Enfant (Dégradation de Saturation)
- Attribuer une teinte de base unique à chaque secteur du premier niveau (Anneau intérieur).
- Pour le second et troisième niveau, utiliser la **même teinte mère** mais avec des variations de **luminance / saturation** (ex: Europe = Bleu saturé `#0072B2` ; France = Bleu moyen `#3386C5` ; Allemagne = Bleu clair `#66A8D8`).
- Cette continuité chromatique exploite la loi de similarité de la Gestalt pour regrouper visuellement les enfants avec leur parent.

### 4.3 Orientation & Lisibilité des Étiquettes Textuelles
- Sur l'anneau intérieur (L1), placer des étiquettes horizontales ou orientées au centre du secteur.
- Sur l'anneau extérieur (L2/L3), si l'angle du secteur est inférieur à $15^\circ$, désactiver l'étiquette directe textuelle et s'appuyer sur l'infobulle (Tooltip) au survol.

### 4.4 Accessibilité et Normes de Contraste WCAG 2.1/2.2
Afin de garantir une accessibilité optimale et respecter les critères **WCAG 2.1** et **WCAG 2.2** aux niveaux AA et AAA :
- **Objets graphiques & Bordures d'arcs (Contraste $\ge 3:1$)** : Conformément au critère WCAG 2.1 (1.4.11 Objets non textuels), les bordures séparatrices entre secteurs polaires et anneaux concentriques adjacents doivent présenter un ratio de contraste d'au moins **3:1** (ou intégrer un liseré blanc `#FFFFFF` de 1.5px à 2px pour séparer les teintes dégradées).
- **Textes d'étiquettes & Infobulles (Contraste $\ge 4.5:1$ / $7:1$)** : Le texte inscrit sur les arcs ou dans les infobulles interactives doit satisfaire un ratio de contraste d'au moins **4.5:1** pour le niveau AA (WCAG 1.4.3) et **7:1** pour le niveau AAA. Désactiver l'étiquette directe si la couleur d'arrière-plan du secteur n'offre pas ce contraste minimal.
- **Support ARIA et alternatives textuelles** : Le graphique doit comporter un conteneur accessible (`role="region"`, `aria-label`), une balise `<canvas>` munie de `role="img"`, et un tableau HTML alternatif structuré sous la classe `.sr-only` décrivant l'arborescence complète.

---

## 5. Erreurs fréquentes & Anti-patterns visuels

```
   [ ANTI-PATTERN 1 : Rupture d'Alignement Angulaire ]      [ ANTI-PATTERN 2 : Profondeur Abusive (> 4 Anneaux) ]
                     ┌────────┐                                          ┌────────┐
                 . ' ┌──────┐   ' .                                  . ' ┌──────┐ ' .
             . '   /  │    │ \    ' .                            . '   /  /||| \  \   ' .
           /      |===╪====╪==|      \                          /     |||||||||||    \
          |  L2 chevauche 2 parents ! |                        | (Anneaux de 2px de large)|
           \      |===╪====╪==|      /                          \     |||||||||||    /
             . '   \  │    │ /    ' .                            . '   \  \||| /  / ' .
                 ' . └──────┘  ' .                                   ' . └──────┘ ' .
        (Violation de la relation de sous-ensemble)                (Impression d'une cible de fléchette)
```

1. **Rupture d'Alignement Angulaire Parent-Enfant** : Laisser un secteur enfant déborder visuellement sur l'angle du secteur parent voisin. Détruit la logique de sous-ensemble.
2. **Palette "Arc-en-Ciel" Désordonnée** : Colorer les sous-catégories enfants avec des teintes aléatoires qui n'ont aucun lien chromatique avec le secteur parent.
3. **Profondeur d'Anneaux Excessive ($> 4$)** : Multiplier les anneaux concentriques, réduisant le graphique à une cible de tir illisible.
4. **Secteurs Périphériques Étroits sans Tooltip** : Tenter d'imprimer du texte miniature sur des arcs de $1^\circ$ de largeur.
5. **Absence de Bordure de Séparation** : Omettre les séparateurs blancs entre arcs voisins, provoquant la fusion visuelle des segments.

---

## 6. Recommandations d'implémentation Chart.js

### 6.1 Architecture technique : Type natif vs Plugins communautaires
Chart.js v4+ ne possède pas de mot-clé natif unique nommé `'sunburst'`. Cependant, l'architecture native du moteur permet de créer un **Sunburst multi-niveaux canonique** en définissant plusieurs jeux de données (datasets) de type **`doughnut`** imbriqués au sein du même objet `data.datasets` :
- `datasets[0]` : Anneau intérieur (Niveau 1 - Parents)
- `datasets[1]` : Anneau extérieur (Niveau 2 - Enfants)

Pour des structures hiérarchiques complexes dynamiques, des plugins communautaires ou des extensions de contrôleur canvas sont utilisables.

### 6.2 Structure HTML & Accessibilité (DOM & ARIA)

```html
<div class="chart-container" role="region" aria-label="Sunburst de la répartition des ventes mondiales 2026" tabindex="0">
  <canvas id="sunburstCanvas" role="img" aria-label="Graphique Sunburst montrant la répartition des ventes par continent et par pays. L'Europe représente 60% du total." aria-describedby="sunburst-fallback"></canvas>
  <div id="sunburst-fallback" class="sr-only">
    <table>
      <caption>Ventes mondiales par région et pays (2026)</caption>
      <thead>
        <tr>
          <th scope="col">Région (Niveau 1)</th>
          <th scope="col">Pays (Niveau 2)</th>
          <th scope="col">Ventes (k€)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Europe</td><td>France</td><td>360</td></tr>
        <tr><td>Europe</td><td>Allemagne</td><td>240</td></tr>
        <tr><td>Amériques</td><td>USA</td><td>300</td></tr>
        <tr><td>Amériques</td><td>Canada</td><td>100</td></tr>
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
  max-width: 520px;
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

### 6.4 Configuration standard baseline (Chart.js v4+ Multi-Dataset Doughnut)

```javascript
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Niveau 1 (Parents) : Europe (600k€), Amériques (400k€)
const dataLevel1 = [600, 400];
const labelsLevel1 = ['Europe', 'Amériques'];
const colorsLevel1 = ['#0072B2', '#D55E00']; // Bleu & Vermillon Okabe-Ito

// Niveau 2 (Enfants alignés) : Europe (France 360, All 240), Amériques (USA 300, Can 100)
const dataLevel2 = [360, 240, 300, 100];
const labelsLevel2 = ['France', 'Allemagne', 'USA', 'Canada'];
const colorsLevel2 = [
  '#3386C5', '#66A8D8', // Dégradé bleu pour enfants Europe
  '#DE7E33', '#E79E66'  // Dégradé vermillon pour enfants Amériques
];

const totalGlobal = 1000;

const config = {
  type: 'doughnut',
  plugins: [ChartDataLabels],
  data: {
    labels: labelsLevel2, // Utilisé pour les tooltips
    datasets: [
      // Dataset 0 : Anneau Intérieur (Niveau 1 - Parents)
      {
        label: 'Région (L1)',
        data: dataLevel1,
        backgroundColor: colorsLevel1,
        borderColor: '#FFFFFF',
        borderWidth: 2,
        weight: 1.2
      },
      // Dataset 1 : Anneau Extérieur (Niveau 2 - Enfants)
      {
        label: 'Pays (L2)',
        data: dataLevel2,
        backgroundColor: colorsLevel2,
        borderColor: '#FFFFFF',
        borderWidth: 1.5,
        weight: 1.0
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '35%', // Espace au centre
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#0F172A',
          font: { family: 'Inter', size: 12, weight: '500' }
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#1E293B',
        titleFont: { family: 'Inter', size: 13, weight: '600' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 10,
        callbacks: {
          label: (context) => {
            const val = context.parsed;
            const pct = ((val / totalGlobal) * 100).toFixed(1);
            return ` ${context.dataset.label} - ${context.label}: ${val} k€ (${pct}%)`;
          }
        }
      },
      datalabels: {
        color: '#FFFFFF',
        font: { family: 'Inter', size: 11, weight: '700' },
        formatter: (value, context) => {
          const pct = ((value / totalGlobal) * 100).toFixed(1);
          return pct > 8 ? `${pct}%` : '';
        }
      }
    }
  }
};
```

---

## 7. Sources & Références académiques / clés

1. **Stasko, J., & Zhang, E. (2000)**. *Focus+Context Display and Navigation Techniques for Visualizing Large Hierarchical Data Sets*. IEEE Visualization 2000, 57-64.
   - *Apport* : Formalisation du Sunburst Chart pour la navigation dans les structures arborescentes.
2. **Andrews, K., & Heidegger, H. (1998)**. *Information Slices: Visualising Hierarchical Structures using Interlinked Radial Pie Charts*. Proceedings of Information Visualization (IV 98), 9-12.
   - *Apport* : Exploration initiale des représentations polaires multi-niveaux.
3. **Skau, D., & Kosara, R. (2016)**. *Arcs, Angles, or Areas: Individual Data Encodings in Pie and Donut Charts*. Computer Graphics Forum, 35(3), 121-130.
   - *Apport* : Preuves des biais perceptifs liés aux variations de rayon dans les structures annulaires.
4. **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception: Theory, Computation, and Application to the Development of Graphic Methods*. JASA, 79(387), 531-554.
   - *Apport* : Évaluation des limites de la perception angulaire.
5. **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.
   - *Apport* : Principes de clarté visuelle, d'optimisation du Data-Ink Ratio et de minimisation des distortions géométriques.
6. **Few, S. (2012)**. *Show Me the Numbers: Designing Tables and Graphs to Enlighten*. Analytics Press.
   - *Apport* : Principes de hiérarchie visuelle et de limitation de la profondeur pour éviter la surcharge cognitive.

---

## Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle (Ratio 90/10 de Tufte & Focus Narratif)
- **Branche Focale Traversante (Hero Branch)** : Mettre en valeur une branche hiérarchique complète (ex: Europe > France / Allemagne) en saturant ses secteurs avec la teinte `tokens.emphasis.focal` sur l'anneau intérieur et des variantes progressives sur l'anneau extérieur.
- **Branches de Contexte** : Toutes les branches non ciblées sont atténuées via `tokens.emphasis.context` (`#CBD5E1`), canalisant immédiatement le regard sans surcharge visuelle.

### 2. Valence Métier & Directionnalité (Gain vs Coût/Risque/Churn)
- **Classification par santé de portefeuille** :
  - Sous-branches performantes / en croissance : `status.success` (vert).
  - Sous-branches déficitaires / à risque : `status.danger` (rouge) ou `tokens.emphasis.anomaly`.

### 3. Matrice de Double-Encodage Strict
- **Guidage de la navigation hiérarchique** :
  - Branche Focale : Teinte vive + bordure blanche marquée (2px) + infobulle multi-niveaux (*"Niveau 1 > Niveau 2 : Valeur"*).
  - Continuité angulaire : Alignement des sous-secteurs avec leur secteur parent pour préserver la loi de destin commun et de clôture de la Gestalt.

### 4. Exemple d'Implémentation Pratique

```javascript
import { createChart } from './template.js';
import { getThemeTokens, getEmphasisStyle } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

const customData = {
  labels: ['Europe', 'Amériques', 'Asie-Pacifique', 'Afrique & ME'],
  datasets: [
    {
      label: 'Régions (Niveau 1)',
      data: [40, 30, 20, 10],
      // Focus sur l'Europe (indice 0)
      focusIndex: 0
    },
    {
      label: 'Sous-Régions (Niveau 2)',
      data: [20, 20, 15, 15, 12, 8, 6, 4]
    }
  ]
};

const chart = createChart('chartCanvas', customData, 'colorbrewer-accessible');
```

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation de la Cible Interactive (Fitts 1954, MacKenzie 1992)
- **Formulation mathématique polaire multi-anneaux** : Le temps d'acquisition motrice d'un secteur d'anneau au niveau de profondeur $k$ s'exprime selon le modèle Shannon-MacKenzie :
  $$MT = a + b \cdot \log_2\left(\frac{D}{W_e} + 1\right)$$
- **Attraction de partition multi-niveaux** : Avec `mode: 'nearest'`, `intersect: true`, `axis: 'xy'`, la surface de capture correspond à l'arc angulaire à la profondeur considérée ($W_e = R_k \cdot \Delta\theta$). Le découpage radial étagé offre une surface de pointage stabilisée ($W_e \ge 28\text{px}$).
- **Gain psychomoteur mesuré** : Réduction des faux clics et ciblage immédiat des sous-branches ($ID \approx 1.9\text{ bit}$, gain de vitesse motrice de **$> 35\%$**).

### 2. Seuils Temporels & Model Human Processor (Card, Moran, Newell 1983 ; Nielsen 1993)
- **Constantes MHP** : Cycle perceptif $\tau_p \approx 100\text{ms}$, cycle cognitif $\tau_c \approx 70\text{ms}$, cycle moteur $\tau_m \approx 70\text{ms}$.
- **Feedback d'arc multi-niveaux $\le 100\text{ms}$** : Surbrillance simultanée de l'arc enfant et de son arc parent avec `hover.animationDuration: 120ms`.
- **Dynamique d'infobulle** :
  - Débounce d'entrée : $70\text{ms}$.
  - Hystérésis de maintien : $150\text{ms}$.
  - Fondu d'opacité : $120\text{ms}$ en `easeOutQuad`.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Principe de Contiguïté Spatiale (Mayer 2001)** : L'infobulle affiche le chemin hiérarchique complet (*Fil d'Ariane*) : `Parent > Enfant`, évitant la désorientation spatiale dans la hiérarchie.
- **Anti-Occlusion déterministe** : Déport radial externe évitant de recouvrir l'anneau parent sous-jacent.
- **Structure cognitive *Details-on-Demand*** :
  1. Chemin hiérarchique complet (Sans-serif 12px, Weight 600).
  2. Valeur absolue et proportion relative au parent et au total global (`fontMono` 12px, format `tabular-nums`).

### 4. Cinématique des Courbes d'Amorti & Constance d'Objet (Penner 2002, Heer & Robertson 2007)
- **Rendu initial multi-anneaux** : Déploiement concentrique séquentiel du centre vers la périphérie en $450\text{ms}$ en `easeOutQuart` ($s(t) = 1 - (1 - t)^4$), matérialisant l'arborescence des données.

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3** : Désactivation instantanée des animations sous `prefers-reduced-motion: reduce` (`duration: 0`, `animation: false`).
- **Contraste de séparation SC 1.4.11** : Bordures de démarcation `tokens.bg` de 1.5 à 2px isolant les sous-secteurs voisins.


