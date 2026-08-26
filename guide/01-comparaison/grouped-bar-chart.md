# Diagramme en Barres Groupées (Grouped / Clustered Bar Chart)

## 1. Description & Principe Visuel
Le diagramme en barres groupées juxtapose des barres de différentes sous-catégories au sein d'une même catégorie principale le long d'un axe commun.
- **Encodage primaire** : Position sur une échelle commune et regroupement spatial (Loi de proximité de la Gestalt).
- **Type de données** : Deux variables catégorielles (ex: Année et Région) et une variable quantitative continue.

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Comparer une mesure entre plusieurs sous-groupes pour un petit nombre de catégories principales (ex: Ventes 2023 vs 2024 par catégorie de produit).
- Répondre à deux questions à la fois : comparaison intra-groupe (au sein d'une catégorie) et inter-groupes (entre catégories).
- Limite idéale : **2 à 3 barres par groupe**, et **≤ 5 groupes au total**.

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Plus de 4 barres par groupe ou plus de 6 groupes** : Crée un encombrement visuel majeur (*visual clutter*) et une surcharge cognitive de comparaison. 👉 *Remplacer par des Small Multiples (petits graphiques multiples) ou un Dumbbell Chart*.
- **Évolution temporelle longue (> 6 périodes)** : 👉 *Remplacer par un Multi-Line Chart*.
- **Part dans le total (Part-to-Whole)** : Ne montre pas la somme totale du groupe. 👉 *Remplacer par un Stacked Bar Chart*.

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Hiérarchie d'espacement (Gestalt de Proximité)** : L'espace intra-groupe (entre les barres d'un même groupe) doit être très faible voire nul, tandis que l'espace inter-groupes doit être large (au moins 50% de la largeur du cluster).
- **Consistance des couleurs** : Chaque série/sous-catégorie doit conserver une teinte strictement identique dans tous les groupes.
- **Ordre logique des séries** : L'ordre des barres au sein de chaque cluster doit être constant de gauche à droite (ex: chronologique N-1 puis N, ou segment A puis B).
- **Légende proche ou étiquetage direct** : Placer la légende immédiatement au-dessus du graphique, alignée à gauche, dans l'ordre d'apparition des barres.

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Trop de séries par groupe (5+)** : L'utilisateur perd le fil de la comparaison et doit décoder la légende en continu (effet d'attention divisée).
- ❌ **Couleurs trop proches ou mal contrastées** : Difficulté de discrimination visuelle rapide.
- ❌ **Barres trop fines** : Donne l'illusion d'une trame vibratoire (effet moiré de Tufte).

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Type natif : `'bar'` avec plusieurs `datasets`

```javascript
const config = {
  type: 'bar',
  data: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Budget 2023',
        data: [120, 150, 180, 140],
        backgroundColor: '#94A3B8', // Teinte secondaire / historique
        borderRadius: 4
      },
      {
        label: 'Réalisé 2024',
        data: [140, 175, 210, 195],
        backgroundColor: '#2563EB', // Teinte principale / actuelle
        borderRadius: 4
      }
    ]
  },
  options: {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        labels: { boxWidth: 12, usePointStyle: true }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        categoryPercentage: 0.7, // Espace entre clusters
        barPercentage: 0.9       // Proximité intra-cluster
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      }
    }
  }
};
```

---

## 7. Sources & Références Académiques
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception*. JASA.
- **Sweller, J. (1998)**. *Cognitive architecture and instructional design*. Educational Psychology Review.
- **Few, S. (2012)**. *Show Me the Numbers*, Chapitre 6.

---

## Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle (Ratio 90/10 de Tufte & Focus Narratif)
- **Série Focale vs Contexte** : Dans un cluster multi-séries (ex: comparaison N vs N-1 vs Budget), la série directrice (année en cours) adopte le rôle `focal` avec une couleur saturée (`tokens.emphasis.focal`), tandis que les années passées sont atténuées en `tokens.emphasis.context`.
- **Réduction du bruit intra-cluster** : Éviter 4 couleurs vives concurrentes ; réserver la saturation à la série d'intérêt.

### 2. Valence Métier & Directionnalité (Gain vs Coût/Risque/Churn)
- **Comparaison de cohortes / séries** :
  - Série de gains / surperformance : coloration positive `status.success` via `getValenceColor(tokens, 1, 'gain')`.
  - Série de coûts / dégradations : coloration `status.danger` via `getValenceColor(tokens, 1, 'cost')`.

### 3. Matrice de Double-Encodage Strict
- **Différenciation multi-séries sans ambiguïté** :
  - Série Focale (N) : Teinte primaire saturée + bordure contrastée 2px.
  - Série Référence / Cible : Couleur neutre + motif hachuré ou bordure tiretée `tokens.emphasis.benchmark`.
  - Séries Historiques : Teintes estompées (alpha 0.45).

### 4. Exemple d'Implémentation Pratique

```javascript
import { createChart } from './template.js';
import { getThemeTokens, getEmphasisStyle } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

const customData = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: '2024 (Historique)',
      data: [120, 150, 180, 210],
      emphasisRole: 'context'
    },
    {
      label: '2025 (Précédent)',
      data: [140, 175, 210, 260],
      emphasisRole: 'context'
    },
    {
      label: '2026 (Focus Réalisé)',
      data: [160, 205, 245, 310],
      emphasisRole: 'focal'
    }
  ]
};

const chart = createChart('chartCanvas', customData, 'colorbrewer-accessible');
```

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation de la Cible Interactive (Fitts 1954, MacKenzie 1992)
- **Formulation mathématique formelle** : Le temps d'acquisition motrice pour inspecter un cluster s'exprime selon le modèle Shannon-MacKenzie :
  $$MT = a + b \cdot \log_2\left(\frac{D}{W_e} + 1\right)$$
- **Capture synchronisée indexée 1D** : Pour les barres groupées, l'interaction est configurée en `mode: 'index'`, `axis: 'x'`, `intersect: false`. Le survol d'un point quelconque du cluster déclenche instantanément l'infobulle comparant l'ensemble des séries du trimestre/de la catégorie ($W_e = W_{\text{cluster}}$).
- **Gain psychomoteur mesuré** : Élimination totale de l'obligation de pointer une barre individuelle étroite au sein du groupe (gain de temps moteur de **$> 45\%$**).

### 2. Seuils Temporels & Model Human Processor (Card, Moran, Newell 1983 ; Nielsen 1993)
- **Constantes MHP** : Cycle perceptif $\tau_p \approx 100\text{ms}$, cycle cognitif $\tau_c \approx 70\text{ms}$, cycle moteur $\tau_m \approx 70\text{ms}$.
- **Feedback multi-séries $\le 100\text{ms}$** : Rehaussement coordonné des barres du cluster actif avec `hover.animationDuration: 100ms`.
- **Dynamique d'infobulle** :
  - Débounce anti-flicker d'entrée : $70\text{ms}$.
  - Hystérésis de maintien de sortie : $150\text{ms}$.
  - Fondu d'opacité : $120\text{ms}$ en `easeOutQuad`.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Principe de Contiguïté Spatiale (Mayer 2001)** : L'infobulle consolide les valeurs de toutes les séries contemporaines en une seule fenêtre compacte, évitant la charge cognitive de va-et-vient avec la légende.
- **Anti-Occlusion déterministe** : Déport vertical au-dessus du sommet le plus haut du groupe ($12\text{px}$) et inversion automatique de quadrant en cas de proximité avec le bord supérieur.
- **Structure cognitive multi-lignes tabulaires** :
  1. Titre du cluster / Trimestre (Sans-serif 12px, Weight 600).
  2. Lignes de séries avec pastilles de couleur (`fontMono` 12px, chiffres tabulaires `tabular-nums` parfaitement alignés verticalement).
  3. Calcul d'évolution ou de total en pied de tooltip.

### 4. Cinématique des Courbes d'Amorti & Constance d'Objet (Penner 2002, Heer & Robertson 2007)
- **Rendu initial standard** : Durée $400\text{ms}$ avec profil `easeOutQuart` ($s(t) = 1 - (1 - t)^4$). Émergence étagée ou simultanée des barres depuis $Y=0$.
- **Proscription des rebonds** : Élimination stricte des fonctions `bounce`/`elastic` pour garantir une lecture professionnelle et non distrayante.

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3** : Désactivation instantanée des animations sous `prefers-reduced-motion: reduce` (`duration: 0`, `animation: false`).
- **Contraste de texte SC 1.4.6 (AAA)** : Ratios de contraste $> 16:1$ sur fond d'infobulle sombre, pastilles de couleur contrastées.


