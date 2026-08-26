# Diagramme en Anneau (Doughnut Chart / Donut Chart)

## 1. Description & Principe Visuel
Le diagramme en anneau est une variante évidée du camembert où le centre est supprimé pour former une couronne circulaire.
- **Encodage primaire** : Longueur de l'arc de cercle extérieur et angle.
- **Avantage cognitif sur le Pie Chart** : En supprimant le centre plein (le point de convergence des angles), il force le regard à évaluer la **longueur des arcs de cercle** plutôt que les angles au centre, ce qui est légèrement plus précis selon les études psychophysiques. De plus, l'espace central libre peut accueillir un KPI synthétique ou un libellé clé.

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Afficher une proportion simple (2 à 4 segments maximum) avec un **indicateur clé récapitulatif logé au centre** (ex: Total 1,2M€, Taux d'achèvement 78%).
- Jauge circulaire de progression vers un objectif (ex: 85% atteint).

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Plus de 4 ou 5 segments** : Encombrement immédiat. 👉 *Remplacer par un Bar Chart Horizontal ou Treemap*.
- **Comparaison fine de tranches de tailles comparables** : 👉 *Remplacer par un Bar Chart*.

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Épaisseur de l'anneau équilibrée** : `cutout: '70%'` pour laisser un espace central généreux et éviter l'effet d'anneau trop épais ou trop fin.
- **Valeur centrale proéminente** : Utiliser un plugin d'écriture centrale pour afficher le KPI total ou le pourcentage dominant en grand format typographique.
- **Démarrage à 12h00 (`rotation: -90`) et tri décroissant**.
- **Séparateur blanc subtil** : `borderWidth: 2`, `borderColor: '#FFFFFF'` pour délimiter nettement les segments.

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Anneau trop fin (filiforme) ou trop épais (quasi-pie)**.
- ❌ **Centre laissé vide sans valeur explicative**.
- ❌ **Anneaux concentriques multiples imbriqués** : Illisible car chaque cercle a une circonférence différente pour une même proportion.

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Type natif : `'doughnut'`

```javascript
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw(chart) {
    const { width, height, ctx } = chart;
    ctx.restore();
    ctx.font = 'bold 22px sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#0F172A';
    const text = '78%';
    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2;
    ctx.fillText(text, textX, textY);
    ctx.save();
  }
};

const config = {
  type: 'doughnut',
  data: {
    labels: ['Complété', 'Restant'],
    datasets: [{
      data: [78, 22],
      backgroundColor: ['#2563EB', '#E2E8F0'],
      borderWidth: 0
    }]
  },
  options: {
    responsive: true,
    cutout: '75%',
    rotation: -90,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    }
  },
  plugins: [centerTextPlugin]
};
```

---

## 7. Sources & Références Académiques
- **Kosara, R. (2019)**. *An Illustrated Tour of the Pie Chart Study Results*. EagerEyes.
- **Skau, D., & Kosara, R. (2016)**. *Arcs, Angles, or Areas: Individual Data Encodings in Pie and Donut Charts*. EuroVis 2016.

---

## Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle (Ratio 90/10 de Tufte & Focus Narratif)
- **Segment Focal d'Arc (Hero Arc)** : Le segment principal adopte la teinte focale vive `tokens.emphasis.focal` avec une bordure nette.
- **Segments de Contexte** : Les parts résiduelles sont rendues en teintes douces neutres `tokens.emphasis.context` (`#CBD5E1`).
- **Ancrage Central KPI** : La cavité centrale (cutout 65%) accueille la valeur agrégée totale ou le score clé en typographie tabulaire `fontMono`.

### 2. Valence Métier & Directionnalité (Gain vs Coût/Risque/Churn)
- **Progression d'objectifs / Parts positives** :
  - Atteinte $\ge 100\%$ : anneau principal coloré en `status.success` (vert).
  - Retard ou zone de risque : anneau coloré en `status.danger` (rouge) ou `status.warning` (orange).

### 3. Matrice de Double-Encodage Strict
- **Décodage combiné arc + centre** :
  - Segment Focal : Couleur saturée + KPI central explicite (*"XX M€ TOTAL"* ou *"XX% ATTEINT"*).
  - Info-bulle : Affichage couplé du montant absolu et du pourcentage relatif normalisé.

### 4. Exemple d'Implémentation Pratique

```javascript
import { createChart } from './template.js';
import { getThemeTokens, getEmphasisStyle } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

const customData = {
  labels: ['Abonnements SaaS', 'Licences Enterprise', 'Services Pro'],
  datasets: [{
    label: 'Revenus (M€)',
    data: [42, 28, 18],
    emphasisRoles: ['focal', 'context', 'context']
  }]
};

const chart = createChart('chartCanvas', customData, 'colorbrewer-accessible');
```

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation de la Cible Interactive (Fitts 1954, MacKenzie 1992)
- **Formulation mathématique polaire sur secteur d'anneau** : Le temps d'acquisition motrice d'un arc de couronne circulaire s'exprime selon le modèle Shannon-MacKenzie :
  $$MT = a + b \cdot \log_2\left(\frac{D}{W_e} + 1\right)$$
- **Attraction de partition d'anneau** : L'interaction est configurée en `mode: 'nearest'`, `intersect: true`, `axis: 'xy'`. La cible interactive correspond à la portion d'arc torique d'épaisseur $e = R_{\text{ext}} - R_{\text{int}} \approx 0.35 \cdot R_{\text{total}}$, assurant une surface de capture généreuse ($W_e \ge 35\text{px}$).
- **Gain psychomoteur mesuré** : Stabilité de pointage ($ID \approx 1.8\text{ bit}$), avec sélection aisée des portions même étroites.

### 2. Seuils Temporels & Model Human Processor (Card, Moran, Newell 1983 ; Nielsen 1993)
- **Constantes MHP** : Cycle perceptif $\tau_p \approx 100\text{ms}$, cycle cognitif $\tau_c \approx 70\text{ms}$, cycle moteur $\tau_m \approx 70\text{ms}$.
- **Feedback d'arc $\le 100\text{ms}$** : Décalage radial (*hoverOffset*) ou surbrillance du secteur d'anneau avec `hover.animationDuration: 120ms`.
- **Dynamique d'infobulle** :
  - Débounce d'entrée : $70\text{ms}$.
  - Hystérésis de maintien : $150\text{ms}$.
  - Fondu d'opacité : $120\text{ms}$ en `easeOutQuad`.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Principe de Contiguïté Spatiale (Mayer 2001)** : L'infobulle se projette à l'extérieur de la couronne pour ne masquer ni l'arc actif ni le KPI central de totalisation.
- **Anti-Occlusion déterministe** : Décalage radial tangentiel et inversion automatique si l'arc est au voisinage immédiat des bords du canevas.
- **Structure cognitive *Details-on-Demand*** :
  1. Catégorie / Part (Sans-serif 12px, Weight 600).
  2. Montant absolu et pourcentage de contribution normalisé (`fontMono` 12px, format `tabular-nums`).
  3. Total général rappelé en cavité centrale.

### 4. Cinématique des Courbes d'Amorti & Constance d'Objet (Penner 2002, Heer & Robertson 2007)
- **Rendu initial circulaire** : Rotation et expansion de l'anneau depuis $-90^\circ$ (midi) en $450\text{ms}$ avec profil `easeOutQuart` ($s(t) = 1 - (1 - t)^4$), matérialisant l'agrégation ordonnée des parts.
- **KPI central** : Fondu d'apparition alpha coordonné sans décalage temporel distrayant.

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3** : Désactivation instantanée des animations sous `prefers-reduced-motion: reduce` (`duration: 0`, `animation: false`).
- **Contraste de séparation SC 1.4.11** : Bordures de démarcation d'arcs `tokens.bg` de $2\text{px}$ garantissant une résolution visuelle nette entre secteurs contigus.


