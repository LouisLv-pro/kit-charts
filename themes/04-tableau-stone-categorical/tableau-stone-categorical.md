# Thème 04 : Tableau Stone Categorical

## 1. Origine & Fondements Scientifiques
Développé par le Dr. **Maureen Stone** (directrice de recherche chez Tableau / Salesforce Research), **Cristy Miller** et le Pr. **Jeffrey Heer** (Université de Washington), ce système est l'aboutissement de recherches empiriques majeures présentées à l'**IEEE InfoVis** sur la psychologie cognitive de la couleur appliquée aux affaires.

### Découvertes Clés de Recherche :
- **Théorie de la "Nommabilité" (*Color Namability*)** : Une couleur que l'utilisateur peut nommer spontanément sans hésitation (ex: "le bleu", "l'orange", "le vert") est traitée et mémorisée **2.5 fois plus vite** par la mémoire de travail qu'une nuance ambiguë (ex: "le bleu-vert turquoise intermédiaire").
- **Saillance Équilibrée** : Évite qu'une couleur ne saute aux yeux (*pop-out effect*) par rapport aux autres au sein d'une même catégorie sémantique.
- **Tableau 10 & Tableau Color Blind 10** : Les palettes les plus célèbres et les plus universellement reconnues du monde des affaires et de la business intelligence.

---

## 2. Caractéristiques Chromatiques & Typographiques

### 2.1 Système de Couleurs (Palette Tableau 10 Moderne)
- `--chart-color-1` (`#4E79A7` - Bleu Tableau acier) : Teinte leader sobre et professionnelle.
- `--chart-color-2` (`#F28E2B` - Orange vif) : Contraste d'accentuation chaud.
- `--chart-color-3` (`#E15759` - Rouge brique / Corail foncé) : Alerte ou indicateur négatif.
- `--chart-color-4` (`#76B7B2` - Sarcelle d'eau) : Nuance froide apaisante.
- `--chart-color-5` (`#59A14F` - Vert prairie équilibré) : Indicateur positif ou volume de croissance.
- `--chart-color-6` (`#EDC948` - Jaune bouton d'or) : Attention / neutre chaud.
- `--chart-color-7` (`#B07AA1` - Prune / Violet doux).
- `--chart-color-8` (`#FF9DA7` - Rose pastel saumoné).
- `--chart-color-9` (`#9C755F` - Brun noisette).
- `--chart-color-10` (`#BAB0AC` - Gris perle de référence).

### 2.2 Système Typographique
- **Police Principale** : `Roboto` (Google Fonts)
  - Caractéristiques : Police sans-serif néo-grotesque à squelette géométrique et courbes ouvertes, offrant une excellente lisibilité à toutes les échelles.
- **Police Numérique / Monospace** : `Roboto Mono`
  - Utilisation : Alignement tabulaire strict des chiffres et des labels de pourcentage.

---

## 3. Cas d'Usage Recommandés
- **Tableaux de bord d'entreprise et Business Intelligence (BI)**.
- **Rapports de ventes, marketing, finance et RH**.
- **Graphiques catégoriels multi-séries (Barres groupées, Stacked bars, Treemaps)**.

---

## 4. Analyse d'Accessibilité (WCAG 2.1 & CVD)
- **Palette Spécialisée Color Blind 10** : Tableau propose une variante certifiée sans rouge/vert problématique pour les rapports grand public.
- **Contraste de Luminance** : Les teintes foncées (`#4E79A7`, `#E15759`, `#59A14F`) assurent un contraste $> 3:1$ sur fond clair pour les barres et lignes.

---

## 5. Code d'Intégration Chart.js

```javascript
import Chart from 'chart.js/auto';

export const tableau10Colors = [
  '#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F',
  '#EDC948', '#B07AA1', '#FF9DA7', '#9C755F', '#BAB0AC'
];

export const tableauColorBlind10 = [
  '#1170AA', '#FC7D0B', '#A3ACB9', '#57606C', '#5FA2CE',
  '#C85200', '#7B848F', '#A3C4DC', '#FFBC79', '#C8D0D9'
];
```

---

## 6. Références Académiques
- **Stone, M. (2006)**. *Choosing colors for data visualization*. Business Intelligence Network, 2.
- **Heer, J., & Stone, M. (2012)**. *Color naming models for color design, coordination, and evaluation*. ACM Transactions on Graphics (TOG), 31(4), 1-10.
- **Lin, S., Fortuna, J., Kulkarni, C., Stone, M., & Heer, J. (2013)**. *Selecting semantically-resonant colors for data visualization*. Computer Graphics Forum, 32(3pt4), 401-410.
