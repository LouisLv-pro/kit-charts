# Graphique en Aires Simple (Area Chart)

## 1. Description & Principe Visuel
Le graphique en aires est une déclinaison du graphique linéaire où l'espace délimité entre la ligne de données et la ligne de base zéro de l'axe horizontal est entièrement rempli d'une couleur ou nuance.
- **Encodage primaire** : Position sur l'axe Y et **surface colorée continue**.
- **Impact perceptuel** : Accentue la sensation de **volume cumulé, d'amplitude totale ou de masse globale** dans le temps, contrairement à la ligne simple qui focalise uniquement sur le taux de variation / la vitesse.

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Représenter des grandeurs qui évoquent naturellement un stock, une capacité ou un volume cumulé (ex: Volume d'eau dans un réservoir, Stock en entrepôt, Consommation électrique totale en MWh, Bande passante réseau).
- Série temporelle continue unique ou 2 séries non sécantes.

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Plusieurs séries qui se croisent fréquemment** : Les aires superposées se masquent mutuellement de façon confuse. 👉 *Remplacer par un Line Chart*.
- **Variations relatives fines où la ligne de base 0 n'est pas pertinente** : L'aire impose une ligne de base à 0 obligatoire.

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Ligne de base à zéro obligatoire (`beginAtZero: true`)** : Remplir une aire coupée à une valeur arbitraire (ex: 50) fausse l'intégrale visuelle perçue de la masse.
- **Transparence ou gradient vertical subtil** : Utiliser un dégradé ou une opacité modérée ($\alpha \approx 0.20 - 0.30$) pour guider l'œil vers la frontière supérieure sans alourdir le fond.
- **Ligne de contour supérieure nette** : `borderWidth: 2` à `3` pour préserver la précision de lecture de la position.

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Remplissage opaque à 100%** : Crée une masse sombre trop lourde (dépense inutile d'encre visuelle).
- ❌ **Axe Y tronqué avec aire pleine**.

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Type natif : `'line'` avec `fill: 'origin'`.

```javascript
const config = {
  type: 'line',
  data: {
    labels: ['00h', '04h', '08h', '12h', '16h', '20h', '24h'],
    datasets: [{
      label: 'Consommation Électrique (MW)',
      data: [320, 290, 480, 720, 690, 810, 450],
      borderColor: '#2563EB',
      borderWidth: 2.5,
      tension: 0.3,
      fill: 'origin',
      backgroundColor: 'rgba(37, 99, 235, 0.25)',
      pointRadius: 3,
      pointHoverRadius: 6
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true, // OBLIGATOIRE POUR UNE AIRE
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      }
    },
    plugins: {
      legend: { display: false }
    }
  }
};
```

---

## Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle & Ratio 90/10 (Focus Narratif)
Dans un graphique en aires, la hiérarchie visuelle doit immédiatement détacher la série d'intérêt de la masse contextuelle :
- **Série Cible (*Hero / Focal*)** : Encodée avec `tokens.emphasis.focal` (couleur primaire saturée du thème), une ligne de contour renforcée (`borderWidth: 2.5` à `3.0`) et un remplissage à opacité standard ($\alpha \approx 0.25$).
- **Série Contexte / Référence (*Context / Muted*)** : Encodée avec `tokens.emphasis.context` (`#CBD5E1` ou ardoise clair), avec un contour fin (`borderWidth: 1.0`) et une opacité très discrète ($\alpha \approx 0.08 - 0.12$).
- Cette répartition respecte le ratio 90/10 de Tufte : 90% des pixels constituent la toile de fond informative et 10% captent l'attention pré-attentive ($< 200\text{ ms}$).

### 2. Encodage des Prévisions & Données Incertaines (*Forecast vs Actual*)
Pour distinguer sans ambiguïté une trajectoire historique certifiée d'une extrapolation future ou prévisionnelle :
- **Opacité réduite (*Forecast Alpha*)** : Application stricte du token `tokens.emphasis.forecastAlpha` ($0.40 \le \alpha \le 0.50$) sur la surface projetée.
- **Ligne de contour tiretée** : `borderDash: [5, 5]` obligatoire sur le segment prévisionnel.
- **Glyphes de mesure** : Utilisation de points en croix rotative (`pointStyle: 'crossRot'`) au lieu de disques pleins.

### 3. Directionnalité & Valence Métier (Gain vs Coût/Risque)
Lorsque l'aire représente une métrique à polarité métier explicite :
- **Métrique de Gain / Capacité** (*Production d'énergie, Volume de ventes*) : La croissance est associée à `tokens.status.success` (`getValenceColor(tokens, 'up', 'gain')`).
- **Métrique de Coût / Risque / Déchet** (*Consommation polluante, Débit de fuite*) : Une augmentation de l'aire mobilise `tokens.status.danger` (`getValenceColor(tokens, 'up', 'cost')`), signalant visuellement une charge financière ou écologique critique.

### 4. Double-Encodage Strict (Accessibilité WCAG 2.1 & CVD)
Conformément aux normes d'accessibilité universelle, aucun état sémantique ne repose exclusivement sur la nuance chromatique :
1. **Canal 1 (Couleur)** : Différenciation par saturation / teinte via les tokens `emphasis`.
2. **Canal 2 (Texture / Ligne)** : Ligne continue pour le réel, tirets `[5, 5]` pour les projections, tirets fins `[3, 3]` pour les intervalles de tolérance.
3. **Canal 3 (Glyphes)** : Disque plein (`circle`) pour l'historique, croix (`crossRot`) pour la prévision, triangle (`triangle`) pour les anomalies de crête.
4. **Canal 4 (Infobulle tabulaire)** : Mention explicite `"(Projection)"` et formatage `tabular-nums`.

### 5. Guide d'Implémentation & Exemple de Code

```javascript
import { getEmphasisStyle, getValenceColor, getThemeTokens } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

// Configuration d'une aire de prévision budgétaire avec double encodage
const historicalStyle = getEmphasisStyle(tokens, 'focal', { fill: true, alpha: 0.25 });
const forecastStyle = getEmphasisStyle(tokens, 'forecast', { fill: true });

const chartData = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai (Proj)', 'Juin (Proj)'],
  datasets: [
    {
      label: 'Volume Réel',
      data: [120, 145, 160, 180, null, null],
      ...historicalStyle
    },
    {
      label: 'Projection T2',
      data: [null, null, null, 180, 210, 245],
      ...forecastStyle
    }
  ]
};
```

---

## 8. Sources & Références Académiques
- **Cleveland, W. S. (1993)**. *Visualizing Data*. Hobart Press.
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*.
- **Ware, C. (2019)**. *Information Visualization: Perception for Design* (4th ed.). Morgan Kaufmann.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Capture Indexée 1D (MacKenzie 1992, ISO 9241-9)
- **Capture Temporelle Axiale 1D** : L'interrogation des points sur une courbe d'aire continue s'effectue le long de l'axe temporel $X$ via `getTemporalInteractionOptions(tokens, { mode: 'index', axis: 'x', hitRadius: 12, hoverRadius: 6 })`. Le curseur n'exige pas de pointer précisément la ligne de contour : la tranche temporelle verticale entière active l'infobulle synchronisée, réduisant $ID$ à $\approx 1.2\text{ bits}$ ($MT \le 350\text{ms}$).
- **Continuité Gestalt sans Décrochage** : Le survol continu d'une date à l'autre offre une glissière d'exploration fluide et sans rupture tactile.

### 2. Réactivité Temporelle & Latences Perceptives (Card-Moran-Newell 1983, Nielsen 1993)
- **Instantanéité Perceptive ($\le 100\text{ms}$)** : Affichage synchronisé de l'infobulle et surbrillance du jalon temporel en $100\text{ms}$ à $60\text{ fps}$.
- **Débounce & Hystérésis Physiologique** : Filtre d'entrée $\Delta t_{\text{enter}} = 80\text{ms}$ prévenant les clignotements intempestifs et rémanence de sortie $\Delta t_{\text{exit}} = 150\text{ms}$ stabilisant l'affichage contre les micro-tremblements neuromusculaires.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Auto-Suffisance des *Details-on-Demand*** : L'infobulle récapitule la date/période, la valeur exacte du volume avec chiffres tabulaires `tokens.fontMono` (`font-variant-numeric: tabular-nums`) et la mention explicite du statut (Réel vs Projection).
- **Algorithme Anti-Occlusion Déterministe** : Positionnement via `computeAntiOcclusionTooltipPosition` avec déport vertical de sécurité ($12\text{px}$) et inversion automatique vers le bas ($y < \text{margin}$) lors du survol des crêtes sommitales.

### 4. Constance d'Objet & Physique des Courbes d'Amorti (Heer & Robertson 2007, Penner 2002)
- **Cinétique Visuelle Congruente** : Remplissage et progression horizontale de l'aire avec une cinétique `easeOutQuad` ($450\text{ms}$), respectant le flux chronologique naturel.

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3 (Animation from Interactions)** : Durée ramenée à `0ms` dès détection de `@media (prefers-reduced-motion: reduce)` via `isReducedMotionPreferred()`.
- **Contraste Élevé & Typographie Tabulaire** : Ratios de contraste $\ge 16:1$ pour le texte d'infobulle et $\ge 3:1$ pour les bordures d'aire, conformité WCAG AAA.
