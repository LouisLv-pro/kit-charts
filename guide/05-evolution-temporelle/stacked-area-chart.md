# Graphique en Aires Empilées (Stacked Area Chart)

## 1. Description & Principe Visuel
Le graphique en aires empilées empile plusieurs séries temporelles continues les unes sur les autres, la hauteur du contour supérieur représentant le total cumulé et l'épaisseur de chaque bande colorée représentant la contribution de chaque composante.
- **Encodage primaire** : 
  - Série de base (inférieure) : Position sur échelle commune alignée (précision élevée).
  - Séries intermédiaires et supérieures : Épaisseur de bande sur échelles fluctuantes non alignées (précision faible).
  - Sommet total : Position globale sur échelle commune.

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Suivre l'évolution d'un **volume total cumulé** ET sa répartition macroscopique dans le temps.
- Séries additives dont toutes les valeurs sont strictement positives.
- Nombre de séries recommandé : **2 à 4 séries maximum**.

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Comparaison précise des composantes intermédiaires** : Les fluctuations de la couche inférieure se propagent mécaniquement aux couches supérieures (artefact d'entraînement), faisant paraître en baisse une série qui est en réalité constante. 👉 *Remplacer par un Multi-Line Chart ou Small Multiples*.
- **Présence de valeurs négatives**.
- **Plus de 5 séries**.

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Placer la série la plus volumineuse et la plus stable à la base (en bas)** pour stabiliser la ligne de référence des couches supérieures.
- **Placer la série la plus volatile ou la plus petite au sommet**.
- **Couleurs catégorielles douces et distinctes** avec opacité modérée (`0.6` à `0.8`).
- **Étiquetage direct au sein des bandes** si la largeur le permet, ou en bout d'axe à droite.

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Inverser l'ordre des séries** au cours du temps.
- ❌ **Superposition de 8 couches fines illisibles**.

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Type natif : `'line'` avec `fill: true` et `stacked: true` sur l'axe Y.

```javascript
const config = {
  type: 'line',
  data: {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Trafic Organique (Base)',
        data: [500, 600, 750, 900, 1100, 1300],
        borderColor: '#1E40AF',
        backgroundColor: 'rgba(30, 64, 175, 0.7)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Trafic Payant (Ads)',
        data: [200, 350, 400, 450, 500, 450],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Réseaux Sociaux',
        data: [100, 120, 180, 220, 300, 380],
        borderColor: '#93C5FD',
        backgroundColor: 'rgba(147, 197, 253, 0.7)',
        fill: true,
        tension: 0.3
      }
    ]
  },
  options: {
    responsive: true,
    scales: {
      x: { grid: { display: false } },
      y: {
        stacked: true, // EMPILAGE DES AIRES
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      }
    },
    plugins: {
      legend: { position: 'top', align: 'start' }
    }
  }
};
```

---

## Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle & Ratio 90/10 (Couche Cible vs Fond)
- **Couche Stratégique (*Hero Layer*)** : Utiliser la couleur de focalisation du thème (`tokens.emphasis.focal`), avec une opacité légèrement renforcée et un contour supérieur net (`borderWidth: 2.0`).
- **Couches Secondaires (*Context Layers*)** : Teintes harmonisées issues de la palette séquentielle ou catégorielle du thème avec opacité standard ($\alpha \approx 0.50 - 0.65$).
- L'œil perçoit d'abord l'enveloppe globale (sommet total à $100\%$) puis analyse la contribution de la composante mise en saillance.

### 2. Encodage des Couches Prévisionnelles (*Forecast Layers*)
- **Composantes Projetées** : Application de `tokens.emphasis.forecastAlpha` ($0.40 - 0.50$), bordure supérieure en tirets `borderDash: [5, 5]`, et mention explicite dans l'infobulle.

### 3. Directionnalité & Valence Métier (Mix Énergétique & Revenus)
- **Composantes Vertueuses (*Énergies renouvelables, Marges à haute valeur*)** : Mises en valeur avec les couleurs positives du thème (`getValenceColor(tokens, 'up', 'gain')`).
- **Composantes Polluantes ou Coûteuses (*Énergies fossiles, Frais généraux*)** : Colorées avec des nuances de surveillance (`tokens.status.warning` ou `tokens.status.danger`).

### 4. Double-Encodage Strict (Lignes de Découpe & Badges)
Pour éviter la confusion entre bandes adjacentes chez les utilisateurs atteints de déficience chromatique :
1. **Canal 1 (Couleur)** : Palettes CVD-safe avec contraste de luminance suffisant entre couches contiguës.
2. **Canal 2 (Bordure séparatrice)** : Trait de séparation continu de 1.5px dans la couleur du fond (`tokens.bg` ou blanc).
3. **Canal 3 (Infobulle décomposée)** : Affichage simultané de la valeur brute de la couche et de son pourcentage de contribution au total ($Y_{\text{total}}$).

### 5. Guide d'Implémentation & Exemple de Code

```javascript
import { getEmphasisStyle, getThemeTokens } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

const stackedAreaConfig = {
  type: 'line',
  data: {
    labels: ['2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Solaire (Croissance Focal)',
        data: [30, 55, 90, 140],
        ...getEmphasisStyle(tokens, 'focal', { fill: true, alpha: 0.7 })
      },
      {
        label: 'Éolien',
        data: [50, 70, 95, 120],
        borderColor: tokens.palette[1],
        backgroundColor: tokens.palette[1],
        fill: true
      },
      {
        label: 'Hydraulique (Base Stable)',
        data: [60, 62, 59, 61],
        ...getEmphasisStyle(tokens, 'context', { fill: true, alpha: 0.5 })
      }
    ]
  }
};
```

---

## 8. Sources & Références Académiques
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception*, Section 6.
- **Few, S. (2012)**. *Show Me the Numbers*, pp. 132-136.
- **Cairo, A. (2016)**. *The Truthful Art*, Chapitre 8.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Capture Indexée 1D Groupée (MacKenzie 1992, ISO 9241-9)
- **Capture Temporelle Axiale 1D Multi-Couches** : L'acquisition des strates empilées le long de la série temporelle repose sur une interaction indexée `getTemporalInteractionOptions(tokens, { mode: 'index', axis: 'x', hitRadius: 12, hoverRadius: 6 })`. Le pointeur n'a pas à viser l'épaisseur variable ou irrégulière d'une couche intermédiaire : la tranche temporelle verticale globale active l'infobulle complète, ramenant $ID$ à $\approx 1.1\text{ bits}$ ($MT \le 340\text{ms}$).
- **Décomposition Part-to-Whole Instantanée** : Élimine le besoin d'estimer mentalement la hauteur nette d'une couche non alignée sur la ligne de base zéro.

### 2. Réactivité Temporelle & Latences Perceptives (Card-Moran-Newell 1983, Nielsen 1993)
- **Instantanéité Perceptive ($\le 100\text{ms}$)** : Réaction visuelle immédiate des strates et apparition de l'infobulle groupée en $100\text{ms}$ à $60\text{ fps}$.
- **Débounce & Hystérésis Physiologique** : Filtre d'entrée $\Delta t_{\text{enter}} = 80\text{ms}$ neutralisant les bruits d'activation et maintien de sortie $\Delta t_{\text{exit}} = 150\text{ms}$ stabilisant l'infobulle face aux micro-tremblements neuromusculaires.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Auto-Suffisance des *Details-on-Demand*** : L'infobulle décompose chaque couche par ordre d'empilement avec sa valeur brute et son pourcentage relatif par rapport au volume global cumulé, au format tabulaire `tokens.fontMono` (`font-variant-numeric: tabular-nums`).
- **Algorithme Anti-Occlusion Déterministe** : Positionnement via `computeAntiOcclusionTooltipPosition` avec déport vertical ($12\text{px}$) et inversion automatique vers le bas ($y < \text{margin}$) lors du survol de l'enveloppe cumulée supérieure.

### 4. Constance d'Objet & Physique des Courbes d'Amorti (Heer & Robertson 2007, Penner 2002)
- **Cinétique Temporelle Amortie** : Progression des surfaces de gauche à droite selon la flèche du temps avec une courbe `easeOutQuad` ($450\text{ms}$), préservant la continuité spatio-temporelle des aires.

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3 (Animation from Interactions)** : Durée ramenée à `0ms` dès détection de `@media (prefers-reduced-motion: reduce)` via `isReducedMotionPreferred()`.
- **Contraste Élevé & Typographie Tabulaire** : Ratios de contraste $\ge 16:1$ dans l'infobulle et $\ge 3:1$ pour les bordures de couches, conformité WCAG AAA.
