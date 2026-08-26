# Fiche Méthodologique : Polar Area Chart (Graphique à Zones Polaires / Diagramme de Nightingale)

> **Catégorie** : 01-comparaison  
> **Type Chart.js** : `polarArea`  
> **Niveau de précision Cleveland & McGill** : RANG 5 (Aire / Surface 2D) & RANG 1 (Rayon 1D) — Erreur 8-18%  
> **Dernière révision** : 2026-08-13  

---

## 1. Description & Principe visuel

Le **Polar Area Chart** (graphique à zones polaires, également historiquement nommé diagramme de Florence Nightingale ou *Coxcomb Chart*) est un graphique polaire circulaire dans lequel chaque catégorie est représentée par un secteur angulaire de taille identique ($\theta = \frac{360^\circ}{N}$), et la valeur quantitative est représentée par la **longueur du rayon** ($r$) et la **surface 2D** ($A$) du secteur émanant du centre.

```
┌───────────────────────────────────────────────────────────────────────────┐
│                        POLAR AREA CHART GEOMETRY                          │
├───────────────────────────────────────────────────────────────────────────┤
                                   Jan
                               ┌─────────┐
                         Nod   │  r=80   │   Fev
                      ┌────────┘         └────────┐
                      │   r=45             r=60   │
                      │                           │
                  Mar │                           │ Avr
                      └────────┐         ┌────────┘
                         Mai   │  r=30   │   Juin
                               └─────────┘
```

### Origine Historique Canonique
Le Polar Area Chart a été inventé par Florence Nightingale en 1858 (*"Diagram of the Causes of Mortality in the Army in the East"*) pour démontrer aux autorités britanniques que la grande majorité des décès lors de la guerre de Crimée résultait de maladies infectieuses évitables (secteurs bleus) plutôt que des blessures directes de combat (secteurs rouges).

### Encodages Visuels Mobilisés
1. **Longueur du Rayon Radiale ($r$)** : Éloignement du bord extérieur du secteur par rapport au centre.
2. **Surface 2D du Secteur Polaire ($A = \frac{\theta}{2} r^2$)** : Aire balayée par le secteur angulaire.

### La Distorsion Psychophysique Quadratique & Correction de Stevens / Flannery
Le Polar Area Chart pose un problème de perception fondamental en sciences cognitives (Cleveland & McGill 1984, Stevens 1957) :
- **Si le rayon varie de façon linéaire avec la valeur brute ($r \propto V$)** : La surface du secteur varie de manière **quadratique** par rapport à la valeur ($A \propto r^2 \propto V^2$). Une donnée 2 fois plus grande aura un rayon 2 fois plus long, mais couvrira une surface **4 fois plus grande (+300%)**.
- **Perception visuelle des surfaces (Loi de Stevens)** : Le cerveau humain évalue la grandeur globale du secteur en combinant le rayon et l'aire. Une variation quadratique exagère dramatiquement les écarts et viole le principe du *Lie Factor* ($0.95 \le \text{Lie Factor} \le 1.05$, Tufte 1983).
- **Règle de Correction Déterministe** : Pour que la surface perçue du secteur soit strictement proportionnelle à la valeur brute ($A \propto V$), la longueur du rayon $r$ **DOIT impérativement être calculée proportionnellement à la racine carrée de la valeur** :

$$r_i = k \cdot \sqrt{V_i}$$

---

## 2. Quand l'utiliser (Cas d'usage cibles)

### Cas d'Usage Recommandés
- **Données Catégorielles à Périodicité Naturelle ou Cyclique ($5 \le N \le 12$)** : Représentation de données distribuées sur les 12 mois de l'année, les 24 heures de la journée, ou les 8/16 orientations de la rose des vents.
- **Storytelling Visuel & Mises en Relief d'Anomalies Saisonnières** : Communiquer un impact visuel fort lors de rapports de synthèse pour mettre en évidence un pic saisonnier exceptionnel (ex. Pic de mortalité ou pic de pollution).
- **Comparaison de Profils de Modèles Cycliques** : Comparer l'empreinte saisonnière globale d'une année par rapport à une autre.

### Structure des Données requise
- **Variable Angulaire** : 1 variable catégorielle discrète ordonnée présentant une cyclicité ou séquence naturelle ($N$ catégories).
- **Variable Radiale** : 1 variable quantitative continue strictement positive ($\mathbb{R}^+$).

---

## 3. Quand NE PAS l'utiliser (Contre-indications)

```
┌───────────────────────────────────────────────────────────────────────────┐
│                    MATRICE D'INVALIDATION POLAR AREA                      │
├────────────────────────────────┬──────────────────────────────────────────┤
│ Situation à risque             │ Alternative recommandée                  │
├────────────────────────────────┼──────────────────────────────────────────┤
│ Comparaison quantitative       │ Bar Chart classique (Horizontal ou       │
│ de précision (valeurs proches) │ Vertical) ou Lollipop Chart.             │
├────────────────────────────────┼──────────────────────────────────────────┤
│ Grand nombre de catégories     │ Line Chart temporel ou Heatmap           │
│ ($N > 12$)                     │ circulaire.                              │
├────────────────────────────────┼──────────────────────────────────────────┤
│ Données non cycliques /         │ Bar Chart ou Dot Plot.                   │
│ non périodiques                │                                          │
├────────────────────────────────┼──────────────────────────────────────────┤
│ Données comportant des         │ Les rayons ne peuvent pas être négatifs. │
│ valeurs négatives ($\mathbb{R}^-$)│ Préférer un Diverging Bar Chart.        │
└────────────────────────────────┴──────────────────────────────────────────┘
```

1. **Recherche de précision numérique fine** : La perception d'aires circulaires a un taux d'erreur de 15 à 25% selon Cleveland & McGill (1984), soit 4 fois plus d'erreur qu'un diagramme en barres sur axe commun.
2. **Grand nombre de catégories ($N > 12$)** : Les angles des secteurs deviennent trop aigus ($\theta < 30^\circ$) et la lecture est totalement dégradée.
3. **Données avec valeurs négatives ou nulles** : Le zéro polaire est au centre; une valeur négative n'a aucune signification géométrique radiale.

---

## 4. Règles cognitives & Meilleures pratiques spécifiques

### 1. Application de la Racine Carrée sur les Données de Rayon
Pour neutraliser la distorsion quadratique de surface ($A \propto r^2$), appliquer la transformation $V_{\text{modèle}} = \sqrt{V_{\text{brut}}}$ si le moteur d'affichage calcule les rayons de façon linéaire. Lors du survol (tooltip) et des datalabels, réafficher **toujours la valeur brute originale $V_{\text{brut}}$**.

### 2. Conservation de la Séquence Chronologique / Horodatée
Conserver l'ordre naturel des aiguilles d'une montre (12:00 en haut ou 03:00 à droite), en débutant par le premier mois de l'année (Janvier) ou la première heure de la journée (00:00). Ne pas trier arbitrairement les secteurs par valeur sous peine de détruire la continuité temporelle.

### 3. Palette Séquentielle Perceptuellement Uniforme (Viridis / Cividis)
Ne pas attribuer des couleurs chaotiques et aléatoires aux secteurs. Utiliser une palette séquentielle perceptuellement uniforme (Viridis) où la luminance de la couleur renforce la perception du rayon, garantissant une lisibilité 100% universelle et CVD-friendly (van der Walt & Smith, 2015).

### 4. Bordures Nettes et Contraste inter-secteurs
Appliquer une bordure blanche net de $2\text{ px}$ (`borderColor: '#FFFFFF'`, `borderWidth: 2`) entre chaque secteur angulaire pour matérialiser clairement la séparation physique des zones et éviter que deux teintes proches ne se fondent.

### 5. Principes de la Gestalt
- **Loi de Fermeture / Clôture** : La disposition circulaire fermée à $360^\circ$ induit la perception du graphique comme un tout organique complet ou un cycle temporel clos (12 mois).
- **Loi de Similarité Radiale** : La découpe angulaire identique ($\theta = 360^\circ / N$) impose la perception de chaque secteur comme un élément équivalent de comparaison.
- **Loi de Continuité Radiale** : Le parcours circulaire le long des rayons concentriques guide le balayage visuel et fait émerger les patterns d'incidentologie saisonnière.

### 6. Accessibilité WCAG 2.1 & Daltonisme (CVD)
- **Contraste & Palettes Universelles (Viridis)** : La palette séquentielle Viridis garantit la monotonicité de luminance pour toutes les formes de daltonisme (protanopie, deutéranopie, tritanopie) et l'impression N&B.
- **Bordures de séparation** : Les contours blancs stricts (`borderColor: '#FFFFFF'`, `borderWidth: 2`) garantissent le contraste de séparation inter-secteurs ($\ge 3.0:1$).
- **Support ARIA & Lecteurs d'écran** : Attributs `role="img"`, `aria-label`, et structure de secours sous forme de tableau HTML.

---

## 5. Erreurs fréquentes & Anti-patterns visuels

1. **Distorsion Quadratique Non Compensée** : Laisser l'échelle polaire tracer le rayon de façon strictement linéaire, ce qui quadruple visuellement les surfaces et trompe massivement le lecteur.
2. **Couleurs Arc-en-Ciel Incompatibles CVD** : Utiliser des dégradés rouge/vert non conformes qui empêchent les personnes atteintes de deutéranopie de distinguer les secteurs.
3. **Absence d'Anneaux Concentriques de Référence** : Omettre les lignes de grille circulaires, rendant impossible l'estimation visuelle de la longueur des rayons.
4. **Graphique Tronqué au Centre (Trou Polaire)** : Ajouter un trou central artificiel (façon Donut polaire) qui modifie la géométrie du triangle polaire et fausse le calcul de surface.

---

## 6. Recommandations d'implémentation Chart.js

### 6.1 Architecture technique : Type natif vs Plugins communautaires
Ce graphique utilise le type natif **`polarArea`** de Chart.js (avec `scales.r.beginAtZero: true`). L'étiquetage direct sur les secteurs radiaux est fourni par le plugin **`chartjs-plugin-datalabels`**.

### 6.2 Structure HTML & Accessibilité (DOM & ARIA)
Envelopper la zone canvas dans un conteneur accessible avec tableau HTML de secours.

```html
<div class="chart-container" role="region" aria-label="Diagramme polaire de l'incidentologie mensuelle" tabindex="0">
  <canvas id="polarAreaCanvas" role="img" aria-label="Polar Area Chart de l'incidentologie sur 12 mois. Le pic maximal est enregistré en août avec 240 incidents." aria-describedby="polar-area-fallback"></canvas>
  <div id="polar-area-fallback" class="sr-only">
    <table>
      <caption>Incidentologie mensuelle (nombre d'incidents)</caption>
      <thead>
        <tr>
          <th scope="col">Mois</th>
          <th scope="col">Incidents</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Janvier</td><td>120</td></tr>
        <tr><td>Février</td><td>95</td></tr>
        <tr><td>Mars</td><td>80</td></tr>
        <tr><td>Avril</td><td>65</td></tr>
        <tr><td>Mai</td><td>50</td></tr>
        <tr><td>Juin</td><td>45</td></tr>
        <tr><td>Juillet</td><td>110</td></tr>
        <tr><td>Août</td><td>240</td></tr>
        <tr><td>Septembre</td><td>165</td></tr>
        <tr><td>Octobre</td><td>90</td></tr>
        <tr><td>Novembre</td><td>75</td></tr>
        <tr><td>Décembre</td><td>130</td></tr>
      </tbody>
    </table>
  </div>
</div>
```

### 6.3 Style CSS & Typographie Tabulaire (`tabular-nums`)
Appliquer la règle CSS de chiffres tabulaires pour aligner le décompte des incidents.

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

### 6.4 Configuration standard baseline (Chart.js v4+)

> **Note d'implémentation déterministe** : Par défaut, `Chart.js` trace l'échelle polaire de sorte que le rayon $r$ varie de manière linéaire avec la valeur. Pour obtenir une exacte proportionnalité des surfaces ($A \propto \text{Valeur}$), il est recommandé de fournir à Chart.js la racine carrée des valeurs brutes pour la géométrie du dataset, tout en utilisant les callbacks de `tooltip` et `datalabels` pour restituer la valeur brute réelle.

```javascript
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

// Données mensuelles brutes (Incidentologie sur 12 mois)
const rawMonthlyData = [
  { month: 'Jan', value: 120 },
  { month: 'Fév', value: 95 },
  { month: 'Mar', value: 80 },
  { month: 'Avr', value: 65 },
  { month: 'Mai', value: 50 },
  { month: 'Juin', value: 45 },
  { month: 'Juil', value: 110 },
  { month: 'Août', value: 240 }, // Pic saisonnier majeur
  { month: 'Sep', value: 165 },
  { month: 'Oct', value: 90 },
  { month: 'Nov', value: 75 },
  { month: 'Déc', value: 130 }
];

// Transformation racine carrée pour neutraliser la distorsion quadratique
const adjustedData = rawMonthlyData.map(d => Math.sqrt(d.value));

// Palette Viridis échantillonnée sur 12 teintes
const viridis12 = [
  '#440154', '#481567', '#482677', '#453781', '#404788', '#39568C',
  '#31688E', '#28788E', '#1F968B', '#29AF7F', '#52C569', '#90D743'
];

const config = {
  type: 'polarArea',
  data: {
    labels: rawMonthlyData.map(d => d.month),
    datasets: [{
      data: adjustedData, // Injection des rayons compensés
      backgroundColor: viridis12.map(c => c + 'E6'), // Opacité 90%
      borderColor: '#FFFFFF',
      borderWidth: 2,
      hoverBorderWidth: 3
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#0F172A',
          font: { family: 'Inter', size: 11, weight: '500' },
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: '#0F172A',
        callbacks: {
          label: (context) => {
            const rawVal = rawMonthlyData[context.dataIndex].value;
            return ` ${context.label} : ${rawVal} incidents (Valeur Brute)`;
          }
        }
      },
      datalabels: {
        color: '#FFFFFF',
        font: { family: 'Inter', size: 10, weight: 'bold' },
        formatter: (value, context) => {
          // Affichage de la valeur brute réelle sur le secteur
          return rawMonthlyData[context.dataIndex].value;
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        grid: {
          color: '#E2E8F0',
          circular: true
        },
        ticks: {
          display: true,
          color: '#64748B',
          font: { family: 'Inter', size: 10 },
          backdropColor: 'transparent',
          callback: (val) => `${Math.round(val * val)} inc.`
        },
        pointLabels: {
          display: true,
          color: '#0F172A',
          font: { family: 'Inter', size: 12, weight: '600' }
        }
      }
    }
  }
};
```

---

## 7. Sources & Références académiques / clés

1. **Nightingale, F. (1858)**. *Notes on Matters Affecting the Health, Efficiency, and Hospital Administration of the British Army*. Harrison and Sons, London.
2. **Cleveland, W. S., & McGill, R. (1984)**. "Graphical Perception: Theory, Computation, and Application to the Development of Graphic Methods". *JASA*, 79(387), 528-554.
3. **Stevens, S. S. (1957)**. "On the psychophysical law". *Psychological Review*, 64(3), 153-181.
4. **Flannery, J. J. (1971)**. "The relative effectiveness of some common graduated symbol maps". *The Canadian Cartographer*, 8(2), 96-109.
5. **van der Walt, S., & Smith, N. (2015)**. "Designing Perceptually Uniform Color Maps for SciPy". *SciPy Conference*.
6. **Cairo, A. (2016)**. *The Truthful Art: Data, Charts, and Maps for Communication*. New Riders.

---

## Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle (Ratio 90/10 de Tufte & Focus Narratif)
- **Secteur Focal (Hero Sector)** : Le secteur d'angle prioritaire (ex: secteur cardinal dominant ou pic saisonnier) est mis en valeur avec `tokens.emphasis.focal` (opacité 1.0) et une bordure renforcée.
- **Secteurs de Contexte** : Les secteurs secondaires utilisent une palette atténuée (`tokens.emphasis.context` ou déclinaison séquentielle de saturation modérée).

### 2. Valence Métier & Directionnalité (Gain vs Coût/Risque/Churn)
- **Distribution des flux directionnels / saisonniers** :
  - Secteurs favorables : coloration en `status.success` (vert).
  - Secteurs à risque ou anomalies de charge : coloration en `status.danger` (rouge) ou `tokens.emphasis.anomaly`.

### 3. Matrice de Double-Encodage Strict
- **Décodage radial fiable** :
  - Secteur Focal : Couleur saturée + étiquette de catégorie en gras sur le pourtour.
  - Cercles de grille concentriques : Valeurs de repères explicites pour compenser la non-linéarité perceptive de l'aire ($\beta = 0.8$ de Stevens).

### 4. Exemple d'Implémentation Pratique

```javascript
import { createChart } from './template.js';
import { getThemeTokens, getEmphasisStyle } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

const customData = {
  labels: ['Nord', 'Nord-Est', 'Est', 'Sud-Est', 'Sud', 'Sud-Ouest', 'Ouest', 'Nord-Ouest'],
  datasets: [{
    data: [42, 28, 35, 18, 50, 32, 45, 22],
    // Focus sur le secteur Sud (indice 4)
    focusIndex: 4
  }]
};

const chart = createChart('chartCanvas', customData, 'colorbrewer-accessible');
```

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation de la Cible Interactive (Fitts 1954, MacKenzie 1992)
- **Formulation mathématique polaire** : Le temps d'acquisition motrice pour sélectionner un secteur angulaire $\theta_i$ de rayon $R_i$ s'exprime selon le modèle Shannon-MacKenzie :
  $$MT = a + b \cdot \log_2\left(\frac{D}{W_e} + 1\right)$$
- **Attraction sectorielle polaire** : Avec `mode: 'nearest'`, `intersect: true`, `axis: 'xy'`, la surface effective de pointage correspond à l'intégralité du coin angulaire ($W_e \propto R_i \cdot \Delta\theta$), offrant une cible d'interaction large même pour les rayons courts ($W_e \ge 24\text{px}$).
- **Gain psychomoteur mesuré** : L'acquisition motrice sectorielle est stabilisée à $ID \approx 2.0\text{ bits}$, éliminant les hésitations de ciblage en coordonnées non-euclidiennes.

### 2. Seuils Temporels & Model Human Processor (Card, Moran, Newell 1983 ; Nielsen 1993)
- **Constantes MHP** : Cycle perceptif $\tau_p \approx 100\text{ms}$, cycle cognitif $\tau_c \approx 70\text{ms}$, cycle moteur $\tau_m \approx 70\text{ms}$.
- **Feedback radial $\le 100\text{ms}$** : Surbrillance immédiate du secteur avec `hover.animationDuration: 120ms`.
- **Dynamique d'infobulle** :
  - Débounce d'entrée : $70\text{ms}$.
  - Hystérésis de maintien : $150\text{ms}$.
  - Fondu d'opacité : $120\text{ms}$ en `easeOutQuad`.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Principe de Contiguïté Spatiale (Mayer 2001)** : L'infobulle se projette à l'extérieur du rayon du secteur inspecté pour ne jamais masquer l'angle ni l'aire de comparaison.
- **Anti-Occlusion déterministe** : Clamping radial prévenant tout débordement hors des quatre coins du canevas.
- **Structure cognitive *Details-on-Demand*** :
  1. Direction / Mois / Catégorie angulaire (Sans-serif 12px, Weight 600).
  2. Grandeur mesurée exacte (`fontMono` 12px, chiffres tabulaires `tabular-nums`).
  3. Part relative ou écart au secteur médian.

### 4. Cinématique des Courbes d'Amorti & Constance d'Objet (Penner 2002, Heer & Robertson 2007)
- **Rendu initial radial** : Expansion circulaire synchronisée en $450\text{ms}$ avec profil `easeOutQuart` ($s(t) = 1 - (1 - t)^4$). Émergence depuis le centre polaire vers la périphérie sans à-coups ni dépassement oscillatoire ($\zeta = 1.0$).

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3** : Prise en compte immédiate de `prefers-reduced-motion: reduce` $\implies$ `duration: 0`, `animation: false`.
- **Bordures de séparation SC 1.4.11** : Bordures inter-secteurs `tokens.bg` de $2\text{px}$ garantissant une délimitation spatiale sans ambiguïté.


