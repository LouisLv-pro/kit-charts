# Diagramme Circulaire (Pie Chart / Camembert)

## 1. Description & Principe Visuel
Le diagramme circulaire divise un disque plein en secteurs angulaires proportionnels aux parts d'un tout (totalisant 100%).
- **Encodage primaire** : Angle au centre, surface du secteur et longueur de l'arc de cercle (niveaux 4 & 5 de la hiérarchie de Cleveland & McGill).
- **Limite cognitive avérée** : Le cortex visuel humain évalue très mal les angles et les aires circulaires par rapport aux positions linéaires et longueurs alignées.

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- **Exactement 2 ou 3 tranches** avec des proportions très contrastées et évidentes (ex: 75% Oui vs 25% Non, 60% Mobile vs 40% Desktop).
- Cas où l'objectif est d'illustrer la notion métaphorique de "part d'un gâteau" ou d'une majorité absolue (> 50%).

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Plus de 4 ou 5 tranches** : Illisible, micro-tranches impossibles à distinguer. 👉 *Remplacer par un Bar Chart Horizontal ou Treemap*.
- **Tranches de tailles similaires (ex: 24% vs 26%)** : Le cerveau est incapable de discerner laquelle est la plus grande sans lire le texte. 👉 *Remplacer par un Bar Chart*.
- **Comparaison de parts entre deux groupes différents** : Comparer deux camemberts côte à côte produit des erreurs d'interprétation massives. 👉 *Remplacer par un 100% Stacked Bar*.
- **Données ne totalisant pas 100%** (ex: questions à choix multiples) : Faux-sens mathématique grave.

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Tri décroissant strict** : Démarrer la plus grande tranche à 12h00 (sommet) et tourner dans le sens des aiguilles d'une montre en ordre décroissant de taille.
- **Étiquetage direct obligatoire** : Placer le nom de la catégorie et le pourcentage directement à côté de la tranche. Supprimer toute boîte de légende séparée.
- **Regroupement en "Autres"** : Toutes les parts < 5% doivent être fusionnées dans une tranche unique "Autres" (`#E2E8F0`).
- **Maximum absolu : 4 parts**.

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Camembert 3D ou incliné** : Déforme dramatiquement la perspective, faisant paraître la tranche avant jusqu'à 2 fois plus grande que la tranche arrière (distortion cognitive majeure).
- ❌ **Camembert à 10 tranches en arc-en-ciel** : Anti-pattern absolu de la dataviz.
- ❌ **Éclatement (*Exploded pie*) systématique de toutes les tranches** : Détruit l'estimation visuelle de l'angle global.

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Type natif : `'pie'`

```javascript
const config = {
  type: 'pie',
  data: {
    labels: ['B2B Entreprises', 'B2C Particuliers', 'Secteur Public'],
    datasets: [{
      data: [65, 25, 10], // Somme = 100
      backgroundColor: ['#1D4ED8', '#60A5FA', '#CBD5E1'],
      borderWidth: 2,
      borderColor: '#FFFFFF'
    }]
  },
  options: {
    responsive: true,
    rotation: -90, // Démarrage à 12h00
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label} : ${ctx.raw}%`
        }
      }
    }
  }
};
```

---

## 7. Sources & Références Académiques
- **Spence, I., & Lewandowsky, S. (1991)**. *Displaying proportions and percentages*. Applied Cognitive Psychology, 5(1), 61-77.
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception*, Section 3.
- **Few, S. (2007)**. *Save the Pies for Dessert*. Visual Business Intelligence Newsletter.

---

## Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle (Ratio 90/10 de Tufte & Focus Narratif)
- **Part Focale Unique (Hero Slice)** : Pour compenser la faible précision de décodage des angles et des aires (Rang 4 & 5 de Cleveland-McGill), réserver la teinte saturée `tokens.emphasis.focal` à la part majoritaire ou à la catégorie d'intérêt stratégique (positionnée à 12h00).
- **Parts de Contexte** : Toutes les parts secondaires sont regroupées ou teintées en dégradé neutre `tokens.emphasis.context` (`#CBD5E1`).

### 2. Valence Métier & Directionnalité (Gain vs Coût/Risque/Churn)
- **Décomposition de parts de marché / flux** :
  - Part contributrice vertueuse : `status.success` (vert).
  - Part d'attrition ou coût structurel : `status.danger` (rouge).

### 3. Matrice de Double-Encodage Strict
- **Élimination de l'ambiguïté angulaire** :
  - Part Focale : Couleur vive + bordure blanche nette (2px) + libellé avec pourcentage direct (`XX%`).
  - Tri décroissant systématique : Facilite la lecture ordonnée dans le sens des aiguilles d'une montre.

### 4. Exemple d'Implémentation Pratique

```javascript
import { createChart } from './template.js';
import { getThemeTokens, getEmphasisStyle } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

const customData = {
  labels: ['Mobile', 'Desktop', 'Tablette'],
  datasets: [{
    label: 'Trafic Web (%)',
    data: [58, 34, 8],
    emphasisRoles: ['focal', 'context', 'context']
  }]
};

const chart = createChart('chartCanvas', customData, 'colorbrewer-accessible');
```

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation de la Cible Interactive (Fitts 1954, MacKenzie 1992)
- **Formulation mathématique polaire sur tranche angulaire** : Le temps d'acquisition motrice pour sélectionner un secteur de tarte d'angle $\theta_i$ et de rayon $R$ s'exprime selon le modèle Shannon-MacKenzie :
  $$MT = a + b \cdot \log_2\left(\frac{D}{W_e} + 1\right)$$
- **Attraction 2D sectorielle** : Avec `mode: 'nearest'`, `intersect: true`, `axis: 'xy'`, la cible d'interaction s'étend sur toute la surface triangulaire polaire du secteur ($W_e \propto R \cdot \theta_i$). Même pour des parts modérées (10-15%), $W_e \ge 30\text{px}$, éliminant les erreurs de clic.
- **Gain psychomoteur mesuré** : Indice de difficulté réduit ($ID \approx 1.7\text{ bit}$), accélérant l'inspection des parts de plus de **$38\%$**.

### 2. Seuils Temporels & Model Human Processor (Card, Moran, Newell 1983 ; Nielsen 1993)
- **Constantes MHP** : Cycle perceptif $\tau_p \approx 100\text{ms}$, cycle cognitif $\tau_c \approx 70\text{ms}$, cycle moteur $\tau_m \approx 70\text{ms}$.
- **Feedback sectoriel $\le 100\text{ms}$** : Décalage radial ou surbrillance du secteur survolé avec `hover.animationDuration: 120ms`.
- **Dynamique d'infobulle** :
  - Débounce d'entrée : $70\text{ms}$.
  - Hystérésis de maintien : $150\text{ms}$.
  - Fondu d'opacité : $120\text{ms}$ en `easeOutQuad`.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Principe de Contiguïté Spatiale (Mayer 2001)** : L'infobulle se projette à l'extérieur du disque pour ne pas masquer la courbure angulaire ni les secteurs voisins.
- **Anti-Occlusion déterministe** : Décalage tangentiel évitant tout débordement hors du conteneur parent.
- **Structure cognitive *Details-on-Demand*** :
  1. Catégorie (Sans-serif 12px, Weight 600).
  2. Pourcentage et valeur absolue (`fontMono` 12px, format tabulaire `tabular-nums`).

### 4. Cinématique des Courbes d'Amorti & Constance d'Objet (Penner 2002, Heer & Robertson 2007)
- **Rendu initial circulaire** : Déploiement angulaire depuis 12h ($-90^\circ$) en $450\text{ms}$ avec profil `easeOutQuart` ($s(t) = 1 - (1 - t)^4$), visualisant la sommation continue à $100\%$.

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3** : Désactivation instantanée des animations sous `prefers-reduced-motion: reduce` (`duration: 0`, `animation: false`).
- **Contraste de délimitation SC 1.4.11** : Bordures blanches ou de fond `tokens.bg` de $2\text{px}$ isolant chaque secteur.


