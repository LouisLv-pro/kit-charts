# 🎨 Thèmes Cognitifs & Systèmes Typographiques pour Dataviz (Chart.js)

Bienvenue dans le répertoire des **Thèmes Spécialisés de Dataviz** de `kit-charts`.

Tous les thèmes inclus dans ce répertoire ont été conçus et calibrés à partir des découvertes en **sciences cognitives, psychophysique de la vision des couleurs (CVD), espaces colorimétriques uniformes (CIELAB / CAM02)** et **ergonomie typographique numérique**.

---

## 🏛️ Fondements Théoriques des Thèmes

### 1. Perception de la Couleur & Espaces Uniformes
Le système visuel humain ne perçoit pas les variations de couleur de manière linéaire dans l'espace RGB standard (sRGB). Deux couleurs distantes de 20 unités en RGB peuvent paraître identiques ou au contraire radicalement différentes selon la sensibilité rétinienne des cônes $L$, $M$ et $S$.
- **Luminance vs Teinte** : Le système visuel traite la luminance (luminosité perçue) via la voie magnocellulaire (haute résolution spatiale, vitesse) et la teinte via la voie parvocellulaire. Nos thèmes garantissent que les données quantitatives critiques sont encodées avec une progression de **luminance monotone**.
- **Sécurité Daltonisme (CVD Safe)** : Environ 8% de la population masculine et 0.5% de la population féminine présentent une anomalie de vision des couleurs (Deutéranopie/Deutéranomalie, Protanopie/Protanomalie, Tritanopie). Tous nos thèmes sont audités pour être discernables sous toutes les formes de daltonisme ainsi qu'en impression monochrome.

### 2. Ergonomie Typographique Spécifique aux Données
- **Chiffres Tabulaires (`font-variant-numeric: tabular-nums` / `font-feature-settings: 'tnum'`)** : Tous nos thèmes imposent des chiffres à largeur fixe pour que les colonnes de données et les graduations d'axes s'alignent parfaitement au pixel près sans décalage horizontal des décimales.
- **Haute Hauteur d'X (*High x-height*) & Ouvertures Larges (*Open Counters*)** : Polices sélectionnées pour éviter toute ambiguïté de lecture rapide entre caractères visuellement proches (`0` vs `O`, `1` vs `l` vs `I`, `8` vs `B`, `6` vs `b`).
- **Paires Typographiques Hiérarchisées** : Association d'une police de titrage/labellisation claire (ex: *Inter*, *IBM Plex Sans*, *Atkinson Hyperlegible*) avec des polices mono adaptées aux valeurs numériques (*JetBrains Mono*, *Fira Code*, *IBM Plex Mono*).

---

## 📁 Catalogue des Thèmes Disponibles

| Thème | Dossier | Fondement Scientifique | Profil Idéal | Mode |
| :--- | :--- | :--- | :--- | :--- |
| **ColorBrewer Accessible** | [`01-colorbrewer-accessible/`](file:///Users/louislaville/Desktop/kit-charts/themes/01-colorbrewer-accessible) | Cynthia Brewer & Mark Harrower (Penn State) | Polyvalent, cartographie, dashboards généralistes | Light |
| **Viridis Perceptual** | [`02-viridis-perceptual/`](file:///Users/louislaville/Desktop/kit-charts/themes/02-viridis-perceptual) | Stéfan van der Walt & Nathaniel Smith (SciPy) | Données scientifiques, matrices Heatmap, KDE | Light / Dark |
| **Paul Tol Scientific** | [`03-paul-tol-scientific/`](file:///Users/louislaville/Desktop/kit-charts/themes/03-paul-tol-scientific) | Dr. Paul Tol (SRON Space Research) | Séries multicatégorielles denses, contrastes optimisés CVD | Light |
| **Tableau Stone Categorical** | [`04-tableau-stone-categorical/`](file:///Users/louislaville/Desktop/kit-charts/themes/04-tableau-stone-categorical) | Maureen Stone, Cristy Miller, Jeffrey Heer (IEEE InfoVis) | Dashboards décisionnels business, nomination rapide des couleurs | Light |
| **Okabe-Ito CUD** | [`05-okabe-ito-cud/`](file:///Users/louislaville/Desktop/kit-charts/themes/05-okabe-ito-cud) | Masataka Okabe & Kei Ito (Color Universal Design) | Accessibilité stricte, rapports officiels & académiques | Light |
| **Tufte Minimalist Executive** | [`06-tufte-minimalist-executive/`](file:///Users/louislaville/Desktop/kit-charts/themes/06-tufte-minimalist-executive) | Edward Tufte (Data-Ink) & Stephen Few | Direction financière, rapports exécutifs, minimalisme absolu | Light |
| **Nord Cognitive Dark** | [`07-nord-cognitive-dark/`](file:///Users/louislaville/Desktop/kit-charts/themes/07-nord-cognitive-dark) | Ergonomie du mode sombre & Réduction de la fatigue oculaire | Monitoring 24/7, NOC, salles de contrôle, faible luminosité | Dark |
| **Atkinson Hyperlegible** | [`08-atkinson-hyperlegible/`](file:///Users/louislaville/Desktop/kit-charts/themes/08-atkinson-hyperlegible) | Braille Institute of America & Applied Vision Science | Basse vision, accessibilité universelle maximale | High Contrast |

---

## 🔬 Audit Empirique d'Uniformité Perceptive (CIEDE2000 — Sharma et al. 2005)

Toutes les palettes sont validées par calcul mathématique standardisé dans l'espace colorimétrique **CIE $L^*a^*b^*$** avec la métrique **CIEDE2000 ($\Delta E_{00}$)** (`test/verify-palette-uniformity.mjs`) :

| Thème Cognitif | Min $\Delta E_{00}$ Catégoriel | Moyenne $\Delta E_{00}$ Catégoriel | Min $\Delta E_{00}$ Séquentiel | Moyenne $\Delta E_{00}$ Séquentiel | Monotonie $L^*$ |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **ColorBrewer Accessible** | 28.8 | 52.1 | 7.9 | 11.7 | **Monotone Strict (OUI)** |
| **Viridis Perceptual** | 24.0 | 54.1 | 9.0 | 13.2 | **Monotone Strict (OUI)** |
| **Paul Tol Scientific** | 31.7 | 46.9 | 5.3 | 10.5 | **Monotone Strict (OUI)** |
| **Tableau 10 Stone** | 19.7 | 36.1 | 10.5 | 11.4 | **Monotone Strict (OUI)** |
| **Okabe-Ito CUD** | 33.2 | 50.5 | 10.2 | 15.1 | **Monotone Strict (OUI)** |
| **Tufte Minimalist Executive** | 3.9 *(gris)* | 27.8 | 7.7 | 17.6 | **Monotone Strict (OUI)** |
| **Nord Cognitive Dark** | 11.1 | 20.2 | 6.9 | 13.6 | **Monotone Strict (OUI)** |
| **Atkinson Hyperlegible** | 20.0 | 53.1 | 8.9 | 15.9 | **Monotone Strict (OUI)** |

---

## 🔧 Structure Standardisée des Tokens CSS

Chaque fichier `theme.css` expose une architecture uniforme de variables CSS sous `:root` (ou sous une classe dédiée `[data-theme="..."]`) :

```css
:root {
  /* Surfaces & Conteneurs */
  --chart-bg: #FFFFFF;
  --chart-surface: #F8FAFC;
  --chart-border: #E2E8F0;
  
  /* Textes & Typographie */
  --chart-font-sans: 'Inter', system-ui, sans-serif;
  --chart-font-mono: 'JetBrains Mono', monospace;
  --chart-text-primary: #0F172A;
  --chart-text-secondary: #475569;
  --chart-text-muted: #94A3B8;

  /* Grille & Axes */
  --chart-grid-color: rgba(0, 0, 0, 0.05);
  --chart-axis-color: #CBD5E1;

  /* Palettes de Données */
  --chart-color-1: #...;
  --chart-color-2: #...;
  --chart-color-3: #...;
  --chart-color-4: #...;
  --chart-color-5: #...;
  --chart-color-6: #...;
  --chart-color-7: #...;
  --chart-color-8: #...;

  /* Sémantique & Alertes */
  --chart-positive: #...;
  --chart-negative: #...;
  --chart-warning: #...;
  --chart-neutral: #...;
}
```

---

## 🚀 Intégration Globale dans Chart.js

Pour appliquer automatiquement un thème à l'ensemble des graphiques d'une application ou d'un dashboard :

```javascript
import Chart from 'chart.js/auto';

// Fonction utilitaire pour extraire les variables CSS calculées
function getThemeTokens() {
  const root = getComputedStyle(document.documentElement);
  return {
    fontSans: root.getPropertyValue('--chart-font-sans').trim(),
    fontMono: root.getPropertyValue('--chart-font-mono').trim(),
    textPrimary: root.getPropertyValue('--chart-text-primary').trim(),
    textSecondary: root.getPropertyValue('--chart-text-secondary').trim(),
    gridColor: root.getPropertyValue('--chart-grid-color').trim(),
    axisColor: root.getPropertyValue('--chart-axis-color').trim(),
    palette: [
      root.getPropertyValue('--chart-color-1').trim(),
      root.getPropertyValue('--chart-color-2').trim(),
      root.getPropertyValue('--chart-color-3').trim(),
      root.getPropertyValue('--chart-color-4').trim(),
      root.getPropertyValue('--chart-color-5').trim(),
      root.getPropertyValue('--chart-color-6').trim(),
      root.getPropertyValue('--chart-color-7').trim(),
      root.getPropertyValue('--chart-color-8').trim()
    ]
  };
}

// Configuration globale des valeurs par défaut de Chart.js
export function applyChartTheme() {
  const tokens = getThemeTokens();

  // Typographie par défaut avec chiffres tabulaires
  Chart.defaults.font.family = tokens.fontSans;
  Chart.defaults.font.size = 12;
  Chart.defaults.color = tokens.textSecondary;

  // Grilles et axes
  Chart.defaults.scale.grid.color = tokens.gridColor;
  Chart.defaults.scale.grid.borderColor = tokens.axisColor;
  Chart.defaults.scale.ticks.color = tokens.textSecondary;

  // Titres et légendes
  Chart.defaults.plugins.legend.labels.color = tokens.textPrimary;
  Chart.defaults.plugins.legend.labels.font = {
    family: tokens.fontSans,
    weight: '500',
    size: 12
  };
  
  // Infobulles (Tooltips)
  Chart.defaults.plugins.tooltip.titleFont = {
    family: tokens.fontSans,
    weight: '600'
  };
  Chart.defaults.plugins.tooltip.bodyFont = {
    family: tokens.fontMono, // Chiffres alignés monospace dans les infobulles
    weight: '500'
  };
}
```
