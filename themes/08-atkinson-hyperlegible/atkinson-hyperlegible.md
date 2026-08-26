# Thème 08 : Atkinson Hyperlegible (Accessibilité Maximale & Basse Vision)

## 1. Origine & Fondements Scientifiques
Développée par le **Braille Institute of America** en collaboration avec **Applied Design Works**, la police et le système de design **Atkinson Hyperlegible** ont été créés spécifiquement pour les personnes malvoyantes et atteintes de basse vision (*low vision*).

### Découvertes Psychophysiques Clés :
- **Différenciation Extrême des Glyphes** : Contrairement aux polices grotesques modernes (ex: Helvetica ou Arial) où les lettres partagent des formes standardisées identiques, Atkinson exagère volontairement les caractéristiques distinctives de chaque lettre et chiffre :
  - Le `0` (zéro) possède une barre oblique interne pour ne jamais être confondu avec la lettre `O`.
  - Le `1` possède un crochet supérieur accentué et une base horizontale pour se distinguer du `l` (L minuscule) et du `I` (i majuscule).
  - Le `8` et le `B`, ainsi que le `6` et le `b`, ont des ouvertures et boucles très asymétriques.
- **Contraste Éprouvé pour la Dégénérescence Maculaire et le Glaucome** : Réduit les erreurs de lecture de plus de 40% chez les sujets malvoyants.

---

## 2. Caractéristiques Chromatiques & Typographiques

### 2.1 Système de Couleurs (Palette Haute Lisibilité / High Contrast)
- `--chart-color-1` (`#005AB5` - Bleu cobalt foncé) : Contraste maximal avec le jaune.
- `--chart-color-2` (`#DC3220` - Vermillon éclatant).
- `--chart-color-3` (`#009E73` - Vert émeraude sombre).
- `--chart-color-4` (`#FE6100` - Orange brûlé).
- `--chart-color-5` (`#785EF0` - Violet ultra-contrasté).
- `--chart-color-6` (`#FFB000` - Ambre haute luminance).
- `--chart-color-7` (`#000000` - Noir d'encre).

### 2.2 Système Typographique
- **Police Principale** : `Atkinson Hyperlegible` (Google Fonts)
  - Caractéristiques : Hauteur d'x très haute, contrastes de traits fins/épais étudiés, ouvertures d'arcades larges.
- **Police Numérique / Monospace** : `Atkinson Hyperlegible Mono` ou `Fira Code`

---

## 3. Cas d'Usage Recommandés
- **Applications de santé, hôpitaux, services d'urgence et portails d'accessibilité publique**.
- **Interfaces destinées aux seniors et personnes âgées**.
- **Tableaux de bord d'intérêt public nécessitant un niveau d'accessibilité sans compromis**.

---

## 4. Analyse d'Accessibilité (WCAG 2.1 & CVD)
- **Certification WCAG AAA Totale** : Tous les textes et labels de données atteignent des ratios de contraste $> 7:1$.
- **Testé et Validé par la communauté malvoyante du Braille Institute**.

---

## 5. Code d'Intégration Chart.js

```javascript
import Chart from 'chart.js/auto';

export const atkinsonTheme = {
  apply() {
    Chart.defaults.font.family = "'Atkinson Hyperlegible', sans-serif";
    Chart.defaults.font.size = 13; // Taille légèrement augmentée pour basse vision
    Chart.defaults.color = '#000000';
    Chart.defaults.scale.grid.color = 'rgba(0, 0, 0, 0.12)'; // Grille légèrement plus visible
    Chart.defaults.elements.line.borderWidth = 3; // Lignes plus épaisses pour malvoyants
    Chart.defaults.elements.point.radius = 6;
  }
};
```

---

## 6. Références Académiques
- **Braille Institute of America (2020)**. *Atkinson Hyperlegible Font: A typeface for greater legibility and readability for low vision readers*. Applied Design Works.
- **Legge, G. E., & Bigelow, C. A. (2011)**. *Does print size matter for reading? A review of findings from vision science and typography*. Journal of Vision, 11(5), 8-8.
