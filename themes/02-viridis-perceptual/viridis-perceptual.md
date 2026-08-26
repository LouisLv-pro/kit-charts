# Thème 02 : Viridis Perceptual

## 1. Origine & Fondements Scientifiques
Créé par **Stéfan van der Walt** et **Nathaniel Smith** pour la bibliothèque scientifique *Matplotlib* (SciPy 2015) et étendu par **Jamie Nuñez et al.** (PLOS ONE 2018), le système **Viridis** a été mathématiquement conçu dans l'espace colorimétrique uniforme **CAM02-UCS**.

### Principes Psychophysiques & Mathématiques :
- **Luminance Strictement Monotone** : Contrairement aux palettes conventionnelles (comme *Jet* ou *Rainbow*) qui présentent des pics et des creux de luminance trompeurs, Viridis possède une courbe de luminance strictement croissante de bas en haut. Une marche de 5% dans les données correspond rigoureusement à une variation de 5% de contraste perçu.
- **Uniformité Perceptuelle ($\Delta E$ constant)** : La distance perçue entre deux valeurs adjacentes est rigoureusement identique sur toute l'échelle, éliminant les faux gradients et les artefacts visuels.
- **Robustesse Totale au Daltonisme (CVD)** : Testé et validé pour la deutéranopie, la protanopie, la tritanopie et la désaturation complète (impression noir et blanc).

---

## 2. Caractéristiques Chromatiques & Typographiques

### 2.1 Échelle de Viridis & Sous-Palettes Dérivées (*Magma*, *Plasma*, *Cividis*)
- `--chart-viridis-1` (`#440154` - Violet sombre profond) : Point zéro / basse intensité.
- `--chart-viridis-2` (`#482777` - Indigo bleuté).
- `--chart-viridis-3` (`#3E4A89` - Bleu cobalt).
- `--chart-viridis-4` (`#31688E` - Sarcelle moyen).
- `--chart-viridis-5` (`#26828E` - Émeraude / Turquoise).
- `--chart-viridis-6` (`#1F9E89` - Vert jade).
- `--chart-viridis-7` (`#35B779` - Vert prairie).
- `--chart-viridis-8` (`#6DCD59` - Vert lime éclatant).
- `--chart-viridis-9` (`#B4DE2C` - Jaune verdâtre).
- `--chart-viridis-10` (`#FDE725` - Jaune vif solaire) : Point maximal / haute intensité.

### 2.2 Système Typographique
- **Police Principale** : `IBM Plex Sans` (Google Fonts)
  - Caractéristiques : Conception technique et géométrique rigoureuse, développée par IBM pour la lisibilité sur écrans haute et basse résolution.
- **Police Numérique / Monospace** : `IBM Plex Mono`
  - Utilisation : Tableaux de données, axes continus et infobulles scientifiques.

---

## 3. Cas d'Usage Recommandés
- **Visualisations scientifiques et d'ingénierie** : Courbes de densité (KDE), 2D Density / Hexbins.
- **Matrices & Heatmaps** : Matrices de corrélation, cartes thermiques géospatiales.
- **Surfaces et données continues 3D projetées**.

---

## 4. Analyse d'Accessibilité (WCAG 2.1 & CVD)
- **Conversion Noir & Blanc Parfaite** : Comme la luminance est monotone, une impression en niveaux de gris préserve 100% de l'information quantitative sans aucune inversion de polarité.
- **Tritanopie & Deutéranopie** : La palette traverse des longueurs d'ondes allant de 400nm à 580nm avec une pente de clarté continue, assurant une discrimination optimale même en absence totale de cônes $L$ ou $M$.

---

## 5. Code d'Intégration Chart.js

```javascript
import Chart from 'chart.js/auto';

export const viridisScale = [
  '#440154', '#482777', '#3E4A89', '#31688E', '#26828E',
  '#1F9E89', '#35B779', '#6DCD59', '#B4DE2C', '#FDE725'
];

export function getViridisColor(normalizedValue) {
  // normalizedValue entre 0.0 et 1.0
  const index = Math.min(
    Math.floor(normalizedValue * (viridisScale.length - 1)),
    viridisScale.length - 1
  );
  return viridisScale[index];
}
```

---

## 6. Références Académiques
- **Van der Walt, S., & Smith, N. (2015)**. *A Better Default Colormap for Matplotlib*. SciPy 2015 Conference Presentation.
- **Nuñez, J. R., Anderton, C. R., & Renslow, R. S. (2018)**. *Optimizing colormaps with recognition of color vision deficiency*. PLOS ONE, 13(7), e0199239.
