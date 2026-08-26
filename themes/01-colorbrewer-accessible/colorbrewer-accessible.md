# Thème 01 : ColorBrewer Accessible

## 1. Origine & Fondements Scientifiques
Développé par le Dr. **Cynthia Brewer** et **Mark Harrower** à l'Université d'État de Pennsylvanie (Penn State), le système **ColorBrewer** est le fruit de plus de 15 années d'expérimentations psychophysiques sur la perception humaine des couleurs en cartographie et en visualisation d'information.

### Principes Psychophysiques Clés :
- **Isolation Perceptuelle** : Chaque teinte a été sélectionnée pour maintenir une distance colorimétrique minimale ($\Delta E$) calculée dans l'espace perceptuel uniforme CIELAB.
- **Luminance Équilibrée pour Variables Catégorielles** : Aucune catégorie nominale ne ressort artificiellement comme "plus importante" qu'une autre en raison d'une saturation excessive, éliminant ainsi le biais de saillance pré-attentive involontaire.
- **Validation Multi-Déficiences (CVD Safe)** : Testé systématiquement pour assurer la discrimination chez les personnes atteintes de deutéranopie, protanopie et tritanopie.

---

## 2. Caractéristiques Chromatiques & Typographiques

### 2.1 Système de Couleurs (Palette Qualitative `Set2` & Dérivés)
- `--chart-color-1` (`#66C2A5` - Vert d'eau / Sarcelle doux) : Équilibre froid et serein.
- `--chart-color-2` (`#FC8D62` - Corail / Saumon chaud) : Contraste d'opposition thermique immédiat.
- `--chart-color-3` (`#8DA0CB` - Bleu lavande / Pervenche) : Teinte intermédiaire douce.
- `--chart-color-4` (`#E78AC3` - Rose poudré) : Discrimination catégorielle nette.
- `--chart-color-5` (`#A6D854` - Vert lime clair) : Clarté et fraîcheur.
- `--chart-color-6` (`#FFD92F` - Jaune ambre) : Point lumineux équilibré.
- `--chart-color-7` (`#E5C494` - Sable / Beige chaud) : Teinte de contexte neutre.
- `--chart-color-8` (`#B3B3B3` - Gris moyen neutre) : Catégorie "Autres" ou base de référence.

### 2.2 Système Typographique
- **Police Principale** : `Inter` (Google Fonts)
  - Caractéristiques : Grande hauteur d'x (*x-height*), ouvertures larges, distinction nette entre `1`, `l` (L minuscule) et `I` (i majuscule), et zéro barré/pointé optionnel.
- **Police Numérique / Monospace** : `JetBrains Mono`
  - Utilisation : Chiffres d'axes, KPIs et valeurs d'infobulles avec alignement tabulaire strict (`font-feature-settings: 'tnum' 1`).

---

## 3. Cas d'Usage Recommandés
- **Dashboards polyvalents et d'entreprise** : Bar charts groupés, diagrammes en anneaux, multi-line charts.
- **Visualisations cartographiques et géographiques** : Cartes choroplèthes, cartes à bulles.
- **Applications nécessitant une conformité légale d'accessibilité**.

---

## 4. Analyse d'Accessibilité (WCAG 2.1 & CVD)
- **Contraste Texte / Fond** : Texte principal `#0F172A` sur fond `#FFFFFF` $\rightarrow$ Ratio **16.1:1** (Conforme **WCAG AAA**).
- **Contraste Objets Graphiques** : Lignes et bordures $\ge 3:1$ sur fond blanc.
- **Daltonisme** : Les paires opposées (ex: `#66C2A5` et `#FC8D62`) restent parfaitement discernables en vision deutéranope et protanope grâce à leur décalage de luminance et de longueur d'onde.

---

## 5. Code d'Intégration Chart.js

```javascript
import Chart from 'chart.js/auto';

export const colorBrewerTheme = {
  fontFamily: "'Inter', sans-serif",
  monoFamily: "'JetBrains Mono', monospace",
  colors: [
    '#66C2A5', '#FC8D62', '#8DA0CB', '#E78AC3',
    '#A6D854', '#FFD92F', '#E5C494', '#B3B3B3'
  ],
  apply() {
    Chart.defaults.font.family = this.fontFamily;
    Chart.defaults.color = '#334155';
    Chart.defaults.scale.grid.color = 'rgba(0, 0, 0, 0.05)';
    Chart.defaults.scale.ticks.font = { family: this.monoFamily, size: 11 };
  }
};
```

---

## 6. Références Académiques
- **Brewer, C. A. (2003)**. *ColorBrewer in Print and on the Web*. Cartographic Perspectives, 45, 78-79.
- **Harrower, M., & Brewer, C. A. (2003)**. *ColorBrewer.org: An Online Tool for Selecting Colour Schemes for Maps*. The Cartographic Journal, 40(1), 27-37.
