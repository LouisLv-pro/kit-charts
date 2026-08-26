# Thème 03 : Paul Tol Scientific

## 1. Origine & Fondements Scientifiques
Conçu par le Dr. **Paul Tol** au *SRON Netherlands Institute for Space Research*, ce système de palettes chromatiques est la référence officielle adoptée par de nombreuses revues scientifiques internationales (*Nature Methods*, *Geophysical Research Letters*).

### Principes Psychophysiques & Méthodologie :
- **Optimisation Combinatoire CVD** : Chaque couleur d'une palette est mathématiquement distante de toutes les autres sous simulation des trois types de daltonisme (Deutéranopie, Protanopie, Tritanopie).
- **Discrimination Visuelle Maximale** : Calibré pour que même des lignes très fines (1px) ou de petits symboles de scatter plots restent identifiables sans effort attentionnel.
- **Variantes Harmoniques** : Propose des palettes *Bright* (contrastes forts), *Muted* (élégance et calme visuel), et *High-Contrast* (extrême lisibilité).

---

## 2. Caractéristiques Chromatiques & Typographiques

### 2.1 Système de Couleurs (Palette `Bright` & `Muted` de Tol)
- `--chart-tol-1` (`#4477AA` - Bleu Tol) : Teinte primaire équilibrée.
- `--chart-tol-2` (`#EE6677` - Rouge / Rose corail vif).
- `--chart-tol-3` (`#228833` - Vert forêt).
- `--chart-tol-4` (`#CCBB44` - Jaune moutarde / Olive clair).
- `--chart-tol-5` (`#66CCEE` - Cyan ciel).
- `--chart-tol-6` (`#AA3377` - Pourpre magenta).
- `--chart-tol-7` (`#BBBBBB` - Gris neutre de référence).

### 2.2 Système Typographique
- **Police Principale** : `Fira Sans` (Google Fonts)
  - Caractéristiques : Police humaniste conçue par Erik Spiekermann, optimisée pour une clarté optique exceptionnelle sur les écrans techniques.
- **Police Numérique / Monospace** : `Fira Code`
  - Utilisation : Alignement tabulaire précis, ligatures claires et lisibilité des symboles mathématiques.

---

## 3. Cas d'Usage Recommandés
- **Graphiques de données scientifiques, biomédicales et physiques**.
- **Multi-Line Charts denses (3 à 6 courbes)** nécessitant une discrimination immédiate des tracés fins.
- **Scatter Plots multicatégoriels avec points de petit rayon**.

---

## 4. Analyse d'Accessibilité (WCAG 2.1 & CVD)
- **Tol Muted Palette** : Réduit l'éblouissement tout en garantissant un contraste de ratio $> 4.5:1$ par rapport aux arrière-plans clairs.
- **Sécurité Daltonisme Absolue** : Conçu spécifiquement pour qu'aucun couple de couleurs ne se confonde sous aucune forme d'anomalie des cônes rétiniens.

---

## 5. Code d'Intégration Chart.js

```javascript
import Chart from 'chart.js/auto';

export const paulTolBright = [
  '#4477AA', '#EE6677', '#228833', '#CCBB44',
  '#66CCEE', '#AA3377', '#BBBBBB'
];

export const paulTolMuted = [
  '#CC6677', '#332288', '#DDCC77', '#117733',
  '#88CCEE', '#882255', '#44AA99', '#999933', '#AA4499'
];
```

---

## 6. Références Académiques
- **Tol, P. (2021)**. *Colour Schemes: Introduction to Colour Schemes*. SRON Technical Note, SRON/EPS/TN/09-002, issue 3.2.
- **Wong, B. (2011)**. *Points of view: Color blindness*. Nature Methods, 8(6), 441-441.
