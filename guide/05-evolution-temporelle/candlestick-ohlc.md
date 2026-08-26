# Chandeliers Japonais & Barres OHLC (Candlestick / OHLC Chart)

## 1. Description & Principe Visuel
Conçu pour les marchés financiers, le chandelier japonais encode 4 valeurs quantitatives pour chaque unité de temps : le cours d'**Ouverture (*Open*)**, le **Plus Haut (*High*)**, le **Plus Bas (*Low*)** et la **Clôture (*Close*)**.
- **Encodage primaire** : 
  - Corps rectangulaire (*Real body*) : Différence entre Ouverture et Clôture (hauteur et position).
  - Mèches / Ombres (*Wicks / Shadows*) : Lignes fines marquant l'amplitude extrême entre Plus Haut et Plus Bas.
  - Couleur : Hausse ($\text{Clôture} \ge \text{Ouverture}$, vert/blanc) vs Baisse ($\text{Clôture} < \text{Ouverture}$, rouge/noir).

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Analyse technique boursière, trading financier, suivi de cours de devises/matières premières ou crypto-actifs.
- Évaluation simultanée de la direction du prix et de la **volatilité intra-période**.

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Données d'affaires générales non financières** (ex: ventes mensuelles standard). 👉 *Remplacer par un Line Chart*.
- **Public non initié aux conventions financières**.

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Convention couleur & Accessibilité** : Si le duo Vert/Rouge est utilisé, préférer un Vert bleuté (`#059669`) et un Rouge orangé (`#DC2626`) ou utiliser des corps pleins vs corps évidés (double encodage pour personnes daltoniennes).
- **Proportions des chandeliers** : Largeur du corps comprise entre 60% et 80% de l'intervalle de temps pour que les mèches soient bien individualisées.
- **Association au volume en sous-panneau** : Placer un mini bar chart de volume de transactions aligné directement sous l'axe X temporel.

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Chandeliers trop tassés devenant illisibles** : Nécessite un zoom/pan dynamique pour explorer les différentes granularités temporelles (1m, 1h, 1j).
- ❌ **Inverser les codes couleurs conventionnels**.

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Plugin officiel requis : `chartjs-chart-financial` (avec adaptateur de dates comme `chartjs-adapter-date-fns`).

```javascript
// Requiert: npm install chartjs-chart-financial chartjs-adapter-date-fns
import 'chartjs-chart-financial';

const config = {
  type: 'candlestick',
  data: {
    datasets: [{
      label: 'Action Tech Corp',
      data: [
        { x: new Date(2024, 0, 1).getTime(), o: 150, h: 158, l: 148, c: 155 },
        { x: new Date(2024, 0, 2).getTime(), o: 155, h: 162, l: 153, c: 160 },
        { x: new Date(2024, 0, 3).getTime(), o: 160, h: 161, l: 152, c: 154 }, // Baisse
        { x: new Date(2024, 0, 4).getTime(), o: 154, h: 165, l: 153, c: 164 }
      ],
      color: {
        up: '#059669',     // Hausse (Vert émeraude)
        down: '#DC2626',   // Baisse (Rouge vif)
        unchanged: '#64748B'
      }
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: { type: 'time', time: { unit: 'day' }, grid: { display: false } },
      y: { grid: { color: 'rgba(0, 0, 0, 0.05)' } }
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
- **Actif Principal (*Hero Asset*)** : Les bougies de la série d'analyse principale utilisent des couleurs contrastées vives issues des tokens thématiques (`getValenceColor(tokens, 'up', 'gain')` et `getValenceColor(tokens, 'down', 'gain')`).
- **Indices de Référence / Contexte (*Benchmark / Peer Assets*)** : Les séries secondaires comparatives (ex: Indice sectoriel CAC/S&P) doivent être affichées sous forme de courbe continue fine ou de chandeliers atténués en gris neutre (`tokens.emphasis.context` ou `tokens.emphasis.benchmark`).

### 2. Valence Métier & Directionnalité (Gain vs Risque/Volatilité)
La valence dans les représentations boursières dépend de la nature de la métrique :
- **Actifs Standard / Actions / Devises (*Asset Pricing*)** : 
  - Clôture > Ouverture ($\Delta > 0$) $\to$ `tokens.status.success` (`#2E7D32` ou `#059669`).
  - Clôture < Ouverture ($\Delta < 0$) $\to$ `tokens.status.danger` (`#C62828` ou `#DC2626`).
- **Indicateurs de Risque / Spreads de Crédit / Indice de Peur (VIX, CDS)** :
  - Hausse du spread ($\Delta > 0$, augmentation du risque de défaut) $\to$ `tokens.status.danger` (polarité inversée via `metricType: 'risk'`).
  - Détente du spread ($\Delta < 0$, assainissement financier) $\to$ `tokens.status.success`.

### 3. Encodage des Prévisions & Modèles Prédictifs
- **Séances Prévisionnelles / Extrapolations Monte-Carlo** : Application du token `tokens.emphasis.forecastAlpha` ($0.45 - 0.55$) sur les corps de bougies et les mèches, associé à une mention explicite dans l'infobulle.

### 4. Double-Encodage Strict (Accessibilité CVD & Noir & Blanc)
Pour garantir la lisibilité aux personnes atteintes de daltonisme (deutéranopie/protanopie) :
1. **Canal 1 (Couleur)** : Utilisation de palettes conformes aux contrastes WCAG AA (ex: Vert émeraude Okabe-Ito / ColorBrewer vs Vermillon).
2. **Canal 2 (Remplissage géométrique)** : Bougie haussière évidée / claire vs bougie baissière pleine / sombre.
3. **Canal 3 (Signe & Texte)** : Affichage systématique du signe mathématique `+` ou `-` et du delta en pourcentage dans le tooltip tabulaire (`font-variant-numeric: tabular-nums`).

### 5. Guide d'Implémentation & Exemple de Code

```javascript
import { getValenceColor, getThemeTokens } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

// Résolution déterministe des couleurs de valence financière
const upColor = getValenceColor(tokens, 'up', 'gain');      // #2E7D32
const downColor = getValenceColor(tokens, 'down', 'gain');  // #C62828
const neutralColor = tokens.status.neutral;                // #94A3B8

const candlestickDataset = {
  label: 'Action TECH EUR',
  data: [
    { x: new Date('2025-01-02').getTime(), o: 152.4, h: 156.8, l: 151.2, c: 155.6 },
    { x: new Date('2025-01-03').getTime(), o: 155.6, h: 161.0, l: 154.5, c: 159.8 },
    { x: new Date('2025-01-06').getTime(), o: 160.0, h: 162.5, l: 157.0, c: 158.2 }
  ],
  color: {
    up: upColor,
    down: downColor,
    unchanged: neutralColor
  }
};
```

---

## 8. Sources & Références Académiques
- **Nison, S. (1991)**. *Japanese Candlestick Charting Techniques*. New York Institute of Finance.
- **Morris, G. L. (2006)**. *Candlestick Charting Explained*. McGraw-Hill.
- **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception: Theory, Computation, and Application*. JASA.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Capture Indexée 1D Temporelle (MacKenzie 1992, ISO 9241-9)
- **Capture Temporelle Axiale 1D** : La sélection d'un chandelier financier (corps et mèches étroites $W \approx 6\text{--}12\text{px}$) le long de l'axe temporel s'effectue via `getTemporalInteractionOptions(tokens, { mode: 'index', axis: 'x', hitRadius: 12, hoverRadius: 6 })`. Le pointeur n'exige pas de toucher précisément le corps de la bougie : le créneau temporel vertical entier capture l'interaction, réduisant l'Indice de Difficulté de Fitts à $ID \le 1.4\text{ bits}$ ($MT \le 380\text{ms}$).
- **Continuité Gestalt sans Décrochage** : Le balayage temporel horizontal continu permet de faire défiler l'historique de cotation sans à-coup moteur.

### 2. Réactivité Temporelle & Latences Perceptives (Card-Moran-Newell 1983, Nielsen 1993)
- **Instantanéité Perceptive ($\le 100\text{ms}$)** : Rétroaction visuelle immédiate (surbrillance des mèches et du corps) en $100\text{ms}$ à $60\text{ fps}$.
- **Débounce & Hystérésis Physiologique** : Filtre d'entrée $\Delta t_{\text{enter}} = 80\text{ms}$ neutralisant les bruits de survol et maintien de sortie $\Delta t_{\text{exit}} = 150\text{ms}$ stabilisant l'infobulle face aux micro-tremblements neuromusculaires.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Auto-Suffisance des *Details-on-Demand*** : L'infobulle décompose simultanément les 4 cours $(O, H, L, C)$, le delta absolu et la variation en pourcentage avec chiffres tabulaires `tokens.fontMono` (`font-variant-numeric: tabular-nums`).
- **Algorithme Anti-Occlusion Déterministe** : Positionnement via `computeAntiOcclusionTooltipPosition` avec déport vertical ($12\text{px}$) et inversion automatique vers le bas ($y < \text{margin}$) lors du survol de mèches sommitales.

### 4. Constance d'Objet & Physique des Courbes d'Amorti (Heer & Robertson 2007, Penner 2002)
- **Cinétique Temporelle Amortie** : Les rafraîchissements de flux ou changements de périodicité s'animent avec `easeOutQuad` ($450\text{ms}$), évitant tout effet stroboscopique.

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3 (Animation from Interactions)** : Durée ramenée à `0ms` dès détection de `@media (prefers-reduced-motion: reduce)` via `isReducedMotionPreferred()`.
- **Contraste Élevé & Typographie Tabulaire** : Ratios de contraste $\ge 16:1$ dans l'infobulle et $\ge 3:1$ pour les corps de bougies, conformité WCAG AAA.
