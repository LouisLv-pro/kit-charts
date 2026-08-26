# Thème 06 : Tufte Minimalist Executive

## 1. Origine & Fondements Scientifiques
Inspiré directement par la philosophie d'**Edward Tufte** (*The Visual Display of Quantitative Information*, 1983) et de **Stephen Few** (*Show Me the Numbers*, 2004), ce thème applique de manière intransigeante le principe de **maximisation du Ratio Data-Ink** et d'élimination totale du bruit visuel (*Chartjunk*).

### Principes Fondateurs :
- **Suppression Radicale du Bruit** : Élimination des bordures lourdes, des arrière-plans grisâtres, des effets d'ombrage et des grilles superflues.
- **Monochromie Fonctionnelle & Accent Unique (*Single Accent Color*)** : 90% des données sont encodées dans une palette sobre de gris ardoise neutres. Une couleur vive unique (Bleu Cobalt ou Ambre) est strictement réservée au point focal d'intérêt narratif (*Pre-attentive pop-out*).
- **Lignes Subtiles & Espaces Respirants** : La structure est guidée par l'espace blanc négatif (*whitespace*) plutôt que par des boîtes englobantes (Loi de Clôture de la Gestalt).

---

## 2. Caractéristiques Chromatiques & Typographiques

### 2.1 Système de Couleurs (Palette Ardoise & Accent)
- `--chart-tufte-bg` (`#FFFFFF` - Blanc pur mat).
- `--chart-tufte-slate-900` (`#0F172A` - Encre sombre pour titres et valeurs clés).
- `--chart-tufte-slate-600` (`#475569` - Texte secondaire et séries de contexte).
- `--chart-tufte-slate-400` (`#94A3B8` - Barres et courbes de second plan).
- `--chart-tufte-slate-200` (`#E2E8F0` - Grilles ultra-fines et séparateurs).
- `--chart-tufte-accent` (`#1D4ED8` - Bleu cobalt d'accentuation focale).
- `--chart-tufte-alert` (`#B91C1C` - Rouge sombre pour anomalie).

### 2.2 Système Typographique
- **Police Principale** : `Newsreader` ou `Inter` (Paire éditoriale raffinée / Typeface de presse financière).
- **Police Numérique / Monospace** : `Geist Mono` ou `JetBrains Mono`
  - Chiffres tabulaires stricts et formatage financier compact.

---

## 3. Cas d'Usage Recommandés
- **Tableaux de bord pour comités de direction (Comex/Codir) et investisseurs**.
- **Rapports annuels financiers, bilans et lettres d'actionnaires**.
- **Bullet Charts, Sparklines, Slopegraphs et Dumbbell Charts**.

---

## 4. Analyse d'Accessibilité (WCAG 2.1 & CVD)
- **Contraste Maximal** : L'utilisation d'encre sombre `#0F172A` sur blanc pur assure un ratio de contraste $> 16:1$.
- **Zéro Confusion Chromatique** : Comme l'encodage repose sur la position, la longueur et l'intensité de gris, la vision des couleurs n'est jamais sollicitée de manière critique.

---

## 5. Code d'Intégration Chart.js

```javascript
import Chart from 'chart.js/auto';

export const tufteMinimalistTheme = {
  apply() {
    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
    Chart.defaults.color = '#475569';
    Chart.defaults.scale.grid.color = 'rgba(0, 0, 0, 0.03)';
    Chart.defaults.scale.grid.borderColor = 'transparent';
    Chart.defaults.elements.bar.borderRadius = 0; // Bords droits stricts
    Chart.defaults.elements.line.borderWidth = 1.5;
    Chart.defaults.plugins.legend.display = false; // Privilégier étiquetage direct
  }
};
```

---

## 6. Références Académiques
- **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.
- **Few, S. (2006)**. *Information Dashboard Design: The Effective Visual Communication of Data*. O'Reilly.
