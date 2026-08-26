# Graphique en Flux Organique (Streamgraph / ThemeRiver)

## 1. Description & Principe Visuel
Variante du graphique en aires empilées centrée autour d'un axe médian oscillant et fluide (sans ligne de base plate), le Streamgraph évoque le flux organique d'une rivière où l'épaisseur de chaque nappe représente le volume d'une catégorie.
- **Encodage primaire** : Épaisseur locale de la silhouette fluide et couleur.
- **Profil cognitif** : Hautement esthétique et engageant, idéal pour une lecture holistique des flux temporels (début, apogée et déclin de sujets/mots-clés), mais **inadapté pour la lecture de valeurs chiffrées précises**.

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Visualisation de tendances médiatiques, sujets d'actualité, écoutes musicales ou flux d'événements temporels sur de longues périodes.
- Communication grand public, journalisme de données narratif (*data storytelling*).

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Tableaux de bord opérationnels et prise de décision critique** : Aucune ligne de base commune, impossible de lire une valeur absolue sans infobulle interactive. 👉 *Remplacer par un Line Chart ou Stacked Area Chart*.

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Palette harmonieuse et fluide** : Dégradés thématiques continus ou nuances catégorielles douces.
- **Centrage de la masse principale** : Placer les catégories aux volumes les plus importants au cœur du flux central pour minimiser les ondulations parasites des bords extérieurs (algorithme de Byron & Wattenberg, 2008).
- **Interactivité obligatoire** : Au survol, mettre en surbrillance le flux ciblé et assombrir les autres pour isoler la trajectoire.

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Tenter d'ajouter un axe Y gradué classique** : Un axe vertical n'a pas de sens physique sur un streamgraph centré.
- ❌ **Lignes de rupture anguleuses** : Détruit l'effet de flux continu.

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Implémenté via des courbes lissées (`tension: 0.4`) avec empilage de couches fluides.

```javascript
const config = {
  type: 'line',
  data: {
    labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Sujet A (IA)',
        data: [10, 25, 45, 80, 140, 220, 310],
        fill: true,
        backgroundColor: 'rgba(37, 99, 235, 0.6)',
        borderColor: 'transparent',
        tension: 0.4
      },
      {
        label: 'Sujet B (Crypto)',
        data: [80, 120, 90, 210, 150, 110, 130],
        fill: true,
        backgroundColor: 'rgba(245, 158, 11, 0.6)',
        borderColor: 'transparent',
        tension: 0.4
      }
    ]
  },
  options: {
    responsive: true,
    scales: {
      x: { grid: { display: false } },
      y: { stacked: true, display: false }
    },
    plugins: {
      legend: { position: 'bottom' }
    }
  }
};
```

---

## Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle & Ratio 90/10 (Flux Narratif Focal)
Dans un flot organique à forte densité d'information :
- **Flux Thématique Clé (*Hero Stream*)** : Utilise la couleur d'accentuation vive `tokens.emphasis.focal` et une opacité accrue ($\alpha \approx 0.80$), avec une bordure nette `borderWidth: 2.0`.
- **Flux d'Arrière-Plan (*Context Streams*)** : Teintes coordonnées mais atténuées (`tokens.emphasis.context` ou palette désaturée, $\alpha \approx 0.40$).

### 2. Encodage des Flux Prévisionnels (*Forecast Extensions*)
- Lorsque les flux se prolongent dans un horizon temporel prédictif :
  - Opacité modulée via `tokens.emphasis.forecastAlpha` ($0.35 - 0.45$).
  - Bordure supérieure en pointillés / tirets `borderDash: [5, 5]`.

### 3. Directionnalité & Valence Métier (Tonalité Sémantique)
- **Flux à Valence Positive (*Sentiment Médias Favorable, Nouveaux Marchés*)** : Utilisation de nuances `status.success` (`getValenceColor(tokens, 'up', 'gain')`).
- **Flux à Valence Négative (*Crises, Signalements d'Incidents*)** : Teintes d'alerte `status.danger` (`getValenceColor(tokens, 'up', 'cost')`).

### 4. Double-Encodage Strict (Légende Dynamique & Infobulle Riche)
Étant donné que la géométrie du streamgraph ne comporte pas d'axe $Y$ chiffré :
1. **Canal 1 (Couleur)** : Palette harmonieuse avec contraste pré-attentif entre flux focal et flux neutres.
2. **Canal 2 (Liseré de contour)** : Trait continu contrasté sur le flux sélectionné.
3. **Canal 3 (Infobulle contextuelle)** : Mention précise du volume absolu, du rang d'importance et de la part relative par rapport à l'ensemble du flux temporel à cette date.

### 5. Guide d'Implémentation & Exemple de Code

```javascript
import { getEmphasisStyle, getThemeTokens } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

const streamgraphDatasets = [
  {
    label: 'IA Générative (Focal)',
    data: [10, 35, 90, 220, 450],
    ...getEmphasisStyle(tokens, 'focal', { fill: true, alpha: 0.8, tension: 0.4 })
  },
  {
    label: 'Technologies Générales (Contexte)',
    data: [100, 110, 115, 120, 118],
    ...getEmphasisStyle(tokens, 'context', { fill: true, alpha: 0.4, tension: 0.4 })
  }
];
```

---

## 8. Sources & Références Académiques
- **Byron, L., & Wattenberg, M. (2008)**. *Stacked graphs–geometry & aesthetics*. IEEE Transactions on Visualization and Computer Graphics, 14(6), 1245-1252.
- **Havre, S., et al. (2002)**. *ThemeRiver: Visualizing thematic changes in large document collections*. IEEE TVCG, 8(1), 9-20.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Capture Indexée 1D Organique (MacKenzie 1992, ISO 9241-9)
- **Capture Temporelle Axiale 1D Multi-Rubans** : Sur un flux organique de rubans empilés (Streamgraph), l'épaisseur fluide de chaque strate varie continuellement. L'interaction mobilise une capture indexée `getTemporalInteractionOptions(tokens, { mode: 'index', axis: 'x', hitRadius: 12, hoverRadius: 6 })`. Le pointeur n'a pas à cibler un ruban courbé : la coordonnée temporelle verticale complète active l'infobulle globale, comprimant l'Indice de Difficulté de Fitts à $ID \approx 1.1\text{ bits}$ ($MT \le 340\text{ms}$).
- **Décodage Thématique sans Rupture** : Permet d'explorer les flux thématiques continus sans friction motrice.

### 2. Réactivité Temporelle & Latences Perceptives (Card-Moran-Newell 1983, Nielsen 1993)
- **Instantanéité Perceptive ($\le 100\text{ms}$)** : Réaction visuelle immédiate des flux et mise en surbrillance de l'ensemble des rubans en $100\text{ms}$ à $60\text{ fps}$.
- **Débounce & Hystérésis Physiologique** : Filtre d'entrée $\Delta t_{\text{enter}} = 80\text{ms}$ et rémanence de sortie $\Delta t_{\text{exit}} = 150\text{ms}$ stabilisant l'infobulle face aux micro-tremblements neuromusculaires.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Auto-Suffisance des *Details-on-Demand*** : L'infobulle détaille chaque thème avec sa valeur volumétrique et sa proportion relative au format tabulaire `tokens.fontMono` (`font-variant-numeric: tabular-nums`).
- **Algorithme Anti-Occlusion Déterministe** : Positionnement via `computeAntiOcclusionTooltipPosition` avec déport vertical ($12\text{px}$) et inversion automatique vers le bas ($y < \text{margin}$) lors du survol du sommet du fleuve de données.

### 4. Constance d'Objet & Physique des Courbes d'Amorti (Heer & Robertson 2007, Penner 2002)
- **Cinétique Temporelle Fluide** : Les flux et courbures de Bézier se propagent avec une cinétique `easeOutQuad` ($450\text{ms}$), simulant un écoulement continu congruant avec la métaphore du flux.

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3 (Animation from Interactions)** : Durée ramenée à `0ms` dès détection de `@media (prefers-reduced-motion: reduce)` via `isReducedMotionPreferred()`.
- **Contraste Élevé & Typographie Tabulaire** : Ratios de contraste $\ge 16:1$ dans l'infobulle et $\ge 3:1$ pour les bordures de rubans, conformité WCAG AAA.
