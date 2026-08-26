# Micro-Courbe (Sparkline)

## 1. Description & Principe Visuel
Inventée et formalisée par Edward Tufte (2006), la Sparkline est un "graphique de la taille d'un mot", dépourvu d'axes, de graduations et de grille, inséré directement dans le flux d'un texte, d'un tableau ou à côté d'un chiffre clé de KPI.
- **Encodage primaire** : Pente et forme continue dans un espace ultra-compact.
- **Ratio Data-Ink** : Maximal (100% de l'encre est dédiée à la forme temporelle).

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Tableaux de bord de direction financière : insérée immédiatement à droite d'un grand KPI (ex: `74 200 €  📈  +14%`).
- Tableaux de données denses (lignes de tableau contenant le chiffre actuel + l'historique sur 12 mois).
- Offrir du **contexte historique instantané** sans obliger l'utilisateur à ouvrir un grand graphique.

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Besoin de lecture de valeurs précises à des dates intermédiaires** : La sparkline ne possède pas d'axes gradués. 👉 *Remplacer par un Line Chart complet*.

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Point focal sur le dernier point** : Mettre en valeur le dernier point mesuré avec un point contrasté et la valeur courante en texte gras.
- **Ligne fine et fluide** : `borderWidth: 1.5` à `2`, sans points intermédiaires pour ne pas créer de surcharge.
- **Zone grisée pour les normales (optionnel)** : Afficher une bande de fond très claire représentant la plage normale ou la cible.

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Ajouter des axes ou grilles encombrantes** : Détruit l'essence même de la sparkline.
- ❌ **Rendre la sparkline trop haute** : Doit conserver un ratio très allongé (hauteur typographique de 20px à 35px pour 80px à 120px de largeur).

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Type natif : `'line'` avec tous les axes et plugins désactivés.

```javascript
const config = {
  type: 'line',
  data: {
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    datasets: [{
      data: [10, 12, 11, 14, 13, 16, 15, 18, 17, 22],
      borderColor: '#2563EB',
      borderWidth: 2,
      tension: 0.3,
      pointRadius: (ctx) => ctx.dataIndex === ctx.dataset.data.length - 1 ? 4 : 0, // Point uniquement sur le dernier
      pointBackgroundColor: '#2563EB',
      fill: false
    }]
  },
  options: {
    responsive: false, // Dimensions fixes compactes (ex: 100x30)
    maintainAspectRatio: false,
    scales: {
      x: { display: false },
      y: { display: false }
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    }
  }
};
```

---

## Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle & Ratio 90/10 (Point Terminal Saillant)
Dans une sparkline, la trajectoire temporelle sert de contexte visuel d'arrière-plan, tandis que la valeur la plus récente constitue le point d'action critique :
- **Ligne de Trajectoire (*Context / History*)** : Tracé fin et continu (`borderWidth: 1.5` à `2.0`), sans marqueurs intermédiaires (`pointRadius: 0`).
- **Point Terminal (*Hero / End Point*)** : Disque de rayon agrandi (`pointRadius: 4.0`), encodé avec `tokens.emphasis.focal` ou la couleur de valence du dernier delta.

### 2. Valence Métier & Directionnalité (Scorecard KPI)
La coloration de la sparkline s'adapte instantanément à la santé du KPI :
- **Métriques Positives / Gain (*Conversion, Revenu*)** : Si la trajectoire terminale est haussière, utilisation de `tokens.status.success` (`getValenceColor(tokens, 'up', 'gain')`). Si elle dévisse, bascule en `tokens.status.danger`.
- **Métriques Inversées (*Coût unitaire, Temps d'attente, Churn*)** : Si la courbe monte, coloration en `tokens.status.danger` (`getValenceColor(tokens, 'up', 'cost')`).

### 3. Encodage des Prévisions & Intervalles de Tolérance
- Si la sparkline intègre des valeurs estimées futures :
  - Segment prévisionnel tireté `borderDash: [3, 3]`.
  - Opacité atténuée via `tokens.emphasis.forecastAlpha`.

### 4. Double-Encodage Strict (Typographie & Badge Directionnel)
Une sparkline ne doit jamais être présentée seule sans son chiffre clé :
1. **Canal 1 (Couleur)** : Teinte de statut du thème (`success`, `warning`, `danger`).
2. **Canal 2 (Symbole typographique)** : Flèche directionnelle intégrée au texte d'accompagnement (`▲ +12%` ou `▼ -5%`).
3. **Canal 3 (Chiffre brut)** : Typographie à chasse tabulaire (`font-variant-numeric: tabular-nums`).

### 5. Guide d'Implémentation & Exemple de Code

```javascript
import { getValenceColor, getThemeTokens } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

// Évaluation dynamique de la tendance pour une sparkline financière
const deltaSign = +1; // Hausse sur le dernier mois
const sparkColor = getValenceColor(tokens, deltaSign > 0 ? 'up' : 'down', 'gain');

const sparklineData = {
  labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
  datasets: [{
    data: [120, 125, 122, 130, 128, 135, 142, 150],
    borderColor: sparkColor,
    pointBackgroundColor: sparkColor,
    pointRadius: (ctx) => ctx.dataIndex === 7 ? 4 : 0
  }]
};
```

---

## 8. Sources & Références Académiques
- **Tufte, E. R. (2006)**. *Beautiful Evidence*. Graphics Press, Chapter 2 (Sparklines: Intense, Simple, Word-Sized Graphics).
- **Few, S. (2013)**. *Information Dashboard Design*, pp. 112-115.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Capture Indexée 1D Micro-Format (MacKenzie 1992, ISO 9241-9)
- **Capture Temporelle Axiale 1D sans Chrome** : Dans une sparkline compacte intégrée aux tableaux de bord ($H \approx 30\text{--}40\text{px}$), l'interaction repose sur une capture indexée `getTemporalInteractionOptions(tokens, { mode: 'index', axis: 'x', hitRadius: 10, hoverRadius: 5 })`. Malgré l'exiguïté de l'espace graphique, le balayage horizontal interroge les jalons sans friction motrice, maintenant l'Indice de Difficulté de Fitts à $ID \le 1.3\text{ bits}$ ($MT \le 360\text{ms}$).
- **Densité Maximale du Signal (Data-Ink Ratio)** : Absence totale de grilles, bordures ou axes distrayants ; seul le point terminal ou survolé est projeté.

### 2. Réactivité Temporelle & Latences Perceptives (Card-Moran-Newell 1983, Nielsen 1993)
- **Instantanéité Perceptive ($\le 100\text{ms}$)** : Réaction visuelle immédiate au survol et infobulle discrète en $100\text{ms}$ à $60\text{ fps}$.
- **Débounce & Hystérésis Physiologique** : Filtre d'entrée $\Delta t_{\text{enter}} = 80\text{ms}$ et rémanence $\Delta t_{\text{exit}} = 150\text{ms}$ évitant les scintillements intempestifs lors du défilement des tableaux.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Auto-Suffisance des *Details-on-Demand*** : L'infobulle compacte affiche la valeur brute au format tabulaire `tokens.fontMono` (`font-variant-numeric: tabular-nums`).
- **Algorithme Anti-Occlusion Déterministe** : Positionnement via `computeAntiOcclusionTooltipPosition` avec déport vertical ($12\text{px}$) et inversion automatique vers le bas ($y < \text{margin}$) pour éviter le masquage des cellules adjacentes.

### 4. Constance d'Objet & Physique des Courbes d'Amorti (Heer & Robertson 2007, Penner 2002)
- **Micro-Animation Temporelle Rapide** : Tracé amorti rapide `easeOutQuad` ($300\text{ms}$), adapté au gabarit condensé du widget sans saturer le processeur graphique lors du rendu multiple en grille.

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3 (Animation from Interactions)** : Durée ramenée à `0ms` dès détection de `@media (prefers-reduced-motion: reduce)` via `isReducedMotionPreferred()`.
- **Contraste Élevé & Typographie Tabulaire** : Ratios de contraste $\ge 16:1$ dans l'infobulle et $\ge 3:1$ pour le trait de sparkline, conformité WCAG AAA.
