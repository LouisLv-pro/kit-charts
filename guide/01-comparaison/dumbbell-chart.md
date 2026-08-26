# Graphique en Haltères (Dumbbell / DNA / Connected Dot Plot)

## 1. Description & Principe Visuel
Le Dumbbell Chart présente deux points de données (ou plus) reliés par une ligne droite horizontale ou verticale pour chaque catégorie.
- **Encodage primaire** : Position sur échelle commune alignée pour chaque point et longueur de la ligne intermédiaire (écart / delta).
- **Efficacité cognitive** : Permet une comparaison instantanée de deux états (ex: Hommes vs Femmes, Début vs Fin de projet, Min vs Max) ainsi que l'évaluation visuelle immédiate du différentiel.

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Comparer deux valeurs numériques associées à une même entité catégorielle (ex: Écart de rémunération, Évolution de satisfaction client 2022 vs 2024 par secteur).
- Idéal pour 10 à 25 catégories sans encombrement visuel.
- Remplacement hautement efficace des barres groupées encombrantes.

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Plus de 3 états par entité** : La ligne reliant 4+ points perd son statut d'écart direct. 👉 *Remplacer par un Line Chart ou Box Plot*.
- **Part dans un tout** : 👉 *Remplacer par un Stacked Bar 100%*.

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Tri sur la variable clé** : Trier les catégories soit par la valeur finale, soit par l'amplitude du différentiel ($\Delta = \text{Valeur 2} - \text{Valeur 1}$).
- **Codage couleur sémantique des extrémités** : Donner une couleur distinctive et contrastée à chaque point (ex: Gris pour point de départ, Bleu pour point d'arrivée).
- **Ligne de liaison neutre** : La ligne reliant les points doit être fine et neutre (Gris moyen `#94A3B8`) pour servir de support sans dominer visuellement les points focaux.
- **Orientation horizontale** : Favorise la lecture fluide des étiquettes textuelles à gauche.

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Points trop petits** : Rendre difficile la distinction des deux séries.
- ❌ **Absence d'indication de direction** : Si le sens du changement est important (gain vs perte), utiliser une flèche ou une coloration différenciée du segment ($\Delta > 0$ en vert/bleu, $\Delta < 0$ en rouge/orange).

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Implémenté via un dataset `'bar'` flottant horizontal `[min, max]` superposé à deux datasets de points `'scatter'`.

```javascript
const config = {
  type: 'bar',
  data: {
    labels: ['France', 'Allemagne', 'Espagne', 'Italie', 'Royaume-Uni'],
    datasets: [
      {
        type: 'bar', // Ligne de liaison
        label: 'Écart',
        data: [[45, 78], [52, 85], [38, 62], [41, 59], [50, 72]],
        backgroundColor: '#CBD5E1',
        barThickness: 3,
        borderRadius: 2
      },
      {
        type: 'scatter', // Point Départ
        label: '2020',
        data: [{ x: 45, y: 0 }, { x: 52, y: 1 }, { x: 38, y: 2 }, { x: 41, y: 3 }, { x: 50, y: 4 }],
        backgroundColor: '#64748B',
        pointRadius: 6
      },
      {
        type: 'scatter', // Point Arrivée
        label: '2024',
        data: [{ x: 78, y: 0 }, { x: 85, y: 1 }, { x: 62, y: 2 }, { x: 59, y: 3 }, { x: 72, y: 4 }],
        backgroundColor: '#2563EB',
        pointRadius: 6
      }
    ]
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    scales: {
      x: { beginAtZero: false, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
      y: { grid: { display: false } }
    },
    plugins: {
      legend: { position: 'top', align: 'start' }
    }
  }
};
```

---

## 7. Sources & Références Académiques
- **Cleveland, W. S. (1993)**. *A Model for Studying Display Methods of Statistical Graphics*. Journal of Computational and Graphical Statistics.
- **Schwabish, J. (2021)**. *Better Data Visualizations*, pp. 64-68.

---

## Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle (Ratio 90/10 de Tufte & Focus Narratif)
- **Haltère Focale (Écart Majeur)** : Mettre en saillance l'écart critique ou l'entité la plus performante avec un point final en `tokens.emphasis.focal` (rayon 8px) et une ligne de liaison renforcée (3px).
- **Haltères de Contexte** : Les paires de comparaison secondaires utilisent des points atténués en `tokens.emphasis.context` (`#CBD5E1`).

### 2. Valence Métier & Directionnalité (Gain vs Coût/Risque/Churn)
- **Sens de l'écart ($P_{\text{final}} - P_{\text{initial}}$)** :
  - Écart positif sur métrique de Gain : coloration du point final en `status.success` (vert).
  - Écart négatif (régression) : coloration du point final en `status.danger` (rouge).
  - Inversion sur métriques de Coût : la hausse budgétaire imprévue s'affiche en rouge `status.danger`.

### 3. Matrice de Double-Encodage Strict
- **Double différenciation temporelle / catégorielle** :
  - Point Initial (T0 / Budget) : Forme de cercle vide ou neutre (`pointBackgroundColor: 'transparent'`, bordure `tokens.textMuted`).
  - Point Final (T1 / Réalisé) : Disque plein saturé `tokens.emphasis.focal` + infobulle explicitant le delta absolu et relatif ($\Delta$ chiffré).

### 4. Exemple d'Implémentation Pratique

```javascript
import { createChart } from './template.js';
import { getThemeTokens, getEmphasisStyle, getValenceColor } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

const customData = {
  labels: ['Santé', 'Éducation', 'Défense'],
  datasets: [
    {
      label: 'Budget Initial',
      data: [45, 38, 32],
      backgroundColor: tokens.textMuted
    },
    {
      label: 'Budget Final (Dépassement)',
      data: [58, 46, 39],
      backgroundColor: getValenceColor(tokens, 1, 'cost') // Rouge car dérive de coût
    }
  ]
};

const chart = createChart('chartCanvas', customData, 'colorbrewer-accessible');
```

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation de la Cible Interactive (Fitts 1954, MacKenzie 1992)
- **Formulation mathématique bivariée 2D** : Le temps d'acquisition motrice d'un point d'haltère de rayon physique $r = 4\text{px}$ à distance $D = 250\text{px}$ :
  $$MT = a + b \cdot \log_2\left(\frac{D}{W_e} + 1\right)$$
- **Zone d'attraction interactive (*Hit Padding*)** : Grâce à `hitRadius: 12px`, la largeur effective $W_e$ passe de $8\text{px}$ à $32\text{px}$, diminuant l'indice de difficulté $ID$ de $5.01\text{ bits}$ à $3.14\text{ bits}$ (gain de vitesse motrice de **$37.3\%$**).
- **Mode d'interaction** : `mode: 'nearest'`, `axis: 'xy'`, `intersect: false`. L'utilisateur sélectionne instantanément le point le plus proche sans exiger une précision microscopique au pixel près.

### 2. Seuils Temporels & Model Human Processor (Card, Moran, Newell 1983 ; Nielsen 1993)
- **Constantes MHP** : Cycle perceptif $\tau_p \approx 100\text{ms}$, cycle cognitif $\tau_c \approx 70\text{ms}$, cycle moteur $\tau_m \approx 70\text{ms}$.
- **Feedback de survol $\le 100\text{ms}$** : Expansion du point actif de $7\text{px}$ à $9\text{px}$ avec `hover.animationDuration: 100ms` procurant un retour haptique visuel immédiat.
- **Dynamique d'infobulle** :
  - Débounce d'entrée : $70\text{ms}$.
  - Persistance de sortie (Hystérésis) : $150\text{ms}$.
  - Fondu alpha : $120\text{ms}$ en `easeOutQuad`.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Principe de Contiguïté Spatiale (Mayer 2001)** : L'infobulle est déportée verticalement au-dessus du point ciblé avec un offset de $12\text{px}$.
- **Anti-Occlusion déterministe** : Inversion vers le bas (`caretPosition: 'top'`) si le point est situé en haut du canevas, et clamping horizontal pour éviter tout débordement.
- **Structure cognitive *Details-on-Demand*** :
  1. Catégorie inspectée & État de la mesure (Initial vs Final).
  2. Valeur absolue exacte (`fontMono` 12px, format tabulaire `tabular-nums`).
  3. Écart absolu et pourcentage d'évolution ($\Delta = P_1 - P_0$) explicite.

### 4. Cinématique des Courbes d'Amorti & Constance d'Objet (Penner 2002, Heer & Robertson 2007)
- **Rendu initial standard** : Durée $400\text{ms}$ avec profil `easeOutQuart` ($s(t) = 1 - (1 - t)^4$). Traçage simultané de la ligne de liaison et des deux disques avec amortissement critique.
- **Mise à jour des données** : Morphing continu des coordonnées en $350\text{ms}$ (`easeOutCubic`) sans scintillement ni téléportation visuelle.

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3** : Détection universelle de `prefers-reduced-motion: reduce` via `isReducedMotionPreferred()` $\implies$ `duration: 0`, `animation: false`.
- **Contraste non-textuel SC 1.4.11** : Bordure de point `tokens.bg` assurant un contraste $\ge 3:1$ entre le marqueur et la ligne de liaison.


