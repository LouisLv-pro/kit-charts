# Guide d'Ingénierie & Psychophysique des Infobulles (*Details-on-Demand*)

Ce guide détaille l'architecture ergonomique, les lois psychophysiques et l'implémentation déterministe des infobulles (*Tooltips*) au sein de la bibliothèque **kit-charts**.

---

## 1. Fondements Scientifiques & Lois de Vision

### 1.1 Loi de Fitts & Modèle de Pointage de MacKenzie (1992)
La loi de Fitts standardisée par l'ISO 9241-9 démontre que le temps d'acquisition motrice d'une cible interactive dépend de la distance $D$ et de la largeur effective $W_e$ :

$$MT = a + b \cdot \log_2\left(\frac{D}{W_e} + 1\right)$$

Dans `kit-charts`, chaque élément graphique possède un `pointHitRadius` / zone de tolérance de $8\text{ à }12\text{px}$, augmentant la largeur perçue de $W=3\text{px}$ à $W_e=23\text{px}$ et réduisant l'indice de difficulté $ID$ de $6.66\text{ bits}$ à $3.81\text{ bits}$ (gain de temps de pointage $>40\%$).

### 1.2 Modèle Temporel de Card-Moran-Newell (1983) & Nielsen (1993)
- **$\tau_p \le 100\text{ms}$** : L'infobulle doit réagir en moins de 100 millisecondes pour être perçue comme instantanée par le système visuel sans rupture d'attention.
- **Hystérésis de survol** : Un amorti de $150\text{ms}$ empêche les disparitions intempestives lors des micro-tremblements de la main.

### 1.3 Contiguïté Spatiale & Anti-Occlusion (Richard Mayer, 2002/2009)
L'infobulle ne doit **jamais occulter le point focal inspecté** ni déborder de la zone d'affichage (*viewport clipping*).
La fonction `computeAntiOcclusionTooltipPosition()` bascule dynamiquement l'infobulle au-dessus, en-dessous ou latéralement avec une marge de sécurité de $12\text{px}$.

### 1.4 Typographie Tabulaire & Prévention du *Split-Attention* (John Sweller, 1988)
- Utilisation systématique de polices monospacées (`JetBrains Mono`, `Fira Code`, `IBM Plex Mono`) ou de la propriété `tabular-nums` pour aligner verticalement les virgules et chiffres décimaux.
- Intégration directe des unités ($k€$, $\%$, $ms$) et des écarts relatifs ($\pm\Delta\%$) évitant les allers-retours vers les légendes distantes.

---

## 2. Options d'Intégration & Code

### 2.1 Utilisation ESM (JavaScript ES6+)

```javascript
import { createChart } from './tooltip/template.js';

// Initialisation sur le canvas avec le thème cognitif de votre choix
const chart = createChart('myCanvas', null, 'colorbrewer-accessible', {
  tooltipMode: 'index', // 'index' (multi-séries synchronisé) ou 'nearest' (point unique)
  intersect: false      // Détection continue par zone de proximité
});
```

### 2.2 Structure HTML Minimale

```html
<div style="position: relative; width: 100%; height: 420px;">
  <canvas id="myCanvas"></canvas>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
<script src="./themes/theme-tokens.js"></script>
<script src="./tooltip/template.js"></script>
<script>
  window.KitCharts['tooltip'].createChart('myCanvas');
</script>
```

---

## 3. Matrice d'Accessibilité WCAG 2.2 AAA

| Critère WCAG | Exigence | Implémentation `kit-charts` |
| :--- | :--- | :--- |
| **SC 1.4.6 Contraste Amélioré** | Ratio $\ge 7:1$ pour le texte normal | **16.2 : 1** (Fond sombre `#0F172A` / Texte blanc `#FFFFFF`) |
| **SC 2.3.3 Mouvement Réduit** | Pas d'animation déstabilisante | Fondu fluide $\le 150\text{ms}$ ou $0\text{ms}$ sous `prefers-reduced-motion` |
| **SC 2.5.5 Taille de Cible** | Cible tactile minimale $\ge 24\text{px}$ | `hitRadius: 12px` ($W_e \ge 24\text{px}$) |
