# Thème 05 : Okabe-Ito Color Universal Design (CUD)

## 1. Origine & Fondements Scientifiques
Développé par **Masataka Okabe** (Université Jikei de Tokyo) et **Kei Ito** (Institut de Génétique du Japon), le jeu de couleurs **Okabe-Ito** (2008) est le standard mondial du *Color Universal Design* (CUD), recommandé officiellement par les revues du groupe **Nature Publishing**, **Cell Press** et de multiples gouvernements pour éliminer toute barrière visuelle dans la communication scientifique.

### Principes Scientifiques Fondateurs :
- **Algorithme de Séparation CVD Absolue** : Chaque couleur est choisie pour être sans ambiguïté identifiable par les personnes trichromates normales, deutéranopes (déficience vert), protanopes (déficience rouge) et tritanopes (déficience bleu).
- **Contraste de Luminance Hybride** : La palette alterne teintes sombres et claires pour garantir une lisibilité même sur photocopies ou affichages monochromes.
- **Zéro Dépendance au Rouge/Vert Classique** : Le rouge pur et le vert pur sont bannis au profit du Vermillon (`#D55E00`) et du Vert bleuté (`#009E73`).

---

## 2. Caractéristiques Chromatiques & Typographiques

### 2.1 Système de Couleurs Okabe-Ito (Palette Officielle 8 Couleurs)
- `--chart-cud-orange` (`#E69F00` - Orange chaud / Ambre) : Lumineux et distinct.
- `--chart-cud-skyblue` (`#56B4E9` - Bleu ciel) : Teinte claire fraîche.
- `--chart-cud-bluishgreen` (`#009E73` - Vert bleuté) : Remplace avantageusement le vert standard.
- `--chart-cud-yellow` (`#F0E442` - Jaune clair) : Point de surbrillance.
- `--chart-cud-blue` (`#0072B2` - Bleu royal sombre) : Ancre de contraste forte.
- `--chart-cud-vermillion` (`#D55E00` - Vermillon / Rouge orangé) : Remplace le rouge standard.
- `--chart-cud-reddishpurple` (`#CC79A7` - Pourpre rosé / Magenta doux).
- `--chart-cud-black` (`#000000` - Noir pur) ou `--chart-cud-gray` (`#999999` - Gris moyen).

### 2.2 Système Typographique
- **Police Principale** : `Source Sans 3` (Google Fonts / Adobe Open Source)
  - Caractéristiques : Dessinée par Paul D. Hunt pour une clarté textuelle exemplaire dans les environnements d'interface utilisateur denses.
- **Police Numérique / Monospace** : `Source Code Pro`
  - Utilisation : Alignement tabulaire et clarté des valeurs décimales.

---

## 3. Cas d'Usage Recommandés
- **Publications scientifiques, thèses et rapports médicaux**.
- **Rapports publics gouvernementaux et institutionnels** soumis à des obligations légales d'accessibilité numérique.
- **Graphiques multicatégoriels présentés devant de larges audiences variées**.

---

## 4. Analyse d'Accessibilité (WCAG 2.1 & CVD)
- **Certification CUD (Color Universal Design)** : La palette répond aux exigences les plus sévères de discrimination visuelle.
- **Contraste Élevé** : Le bleu royal (`#0072B2`) et le vermillon (`#D55E00`) offrent un contraste supérieur à $4.5:1$ sur fond blanc.

---

## 5. Code d'Intégration Chart.js

```javascript
import Chart from 'chart.js/auto';

export const okabeItoPalette = [
  '#0072B2', // Bleu royal
  '#D55E00', // Vermillon
  '#009E73', // Vert bleuté
  '#E69F00', // Orange
  '#56B4E9', // Bleu ciel
  '#CC79A7', // Pourpre
  '#F0E442', // Jaune
  '#000000'  // Noir
];
```

---

## 6. Références Académiques
- **Okabe, M., & Ito, K. (2008)**. *Color Universal Design (CUD): How to make figures and presentations that are friendly to Colorblind People*. Jikei Med.
- **Wong, B. (2011)**. *Color coding*. Nature Methods, 8(7), 525-525.
