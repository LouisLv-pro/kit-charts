# Diagramme de Cordes (Chord Diagram)

## 1. Description & Principe Visuel
Le diagramme de cordes dispose des entités réparties sur la circonférence d'un cercle extérieur, reliées entre elles par des arcs ou rubans courbés (les cordes) traversant l'intérieur du disque pour représenter des relations ou flux bidirectionnels.
- **Encodage primaire** : Longueur de l'arc circulaire extérieur (taille globale de l'entité) et **largeur des rubans intérieurs** à leurs points d'ancrage (volume du flux échangé).
- **Profil cognitif** : Idéal pour mettre en lumière des matrices de flux d'échanges inter-groupes complexes et réciproques.

---

## 2. Quand l'utiliser (Cas d'usage cibles)
- Flux migratoires entre pays ou régions (ex: Échanges de population entre 5 continents).
- Commerce international bilatéral (Exportations / Importations croisées).
- Transferts de compétences ou de budgets entre départements matriciels.
- Nombre d'entités idéal : **4 à 8 entités majeures**.

---

## 3. Quand NE PAS l'utiliser (Contre-indications)
- **Plus de 10 à 12 entités** : Les cordes intérieures forment une masse opaque impénétrable. 👉 *Remplacer par une Matrice Heatmap de flux*.
- **Flux strictement linéaires sans réciprocité** : 👉 *Remplacer par un Diagramme de Sankey*.

---

## 4. Règles Cognitives & Meilleures Pratiques Spécifiques
- **Gestion asymétrique de la direction** : Les deux extrémités d'une corde doivent refléter les volumes respectifs (l'extrémité source est plus large que l'extrémité réceptrice en cas de flux net).
- **Couleur héritée de l'émetteur dominant** : Teinter le ruban de la couleur de l'entité qui envoie le plus gros volume.
- **Transparence d'opacité** : `opacity: 0.5` pour percevoir les superpositions au centre du cercle.
- **Interactivité de focus au survol** : Isoler les cordes rattachées au segment survolé et griser toutes les autres.

---

## 5. Erreurs Fréquentes & Anti-Patterns Visuels
- ❌ **Cordes 100% opaques** se masquant mutuellement.
- ❌ **Trop d'entités minuscules**.

---

## 6. Recommandations d'Implémentation Chart.js

### Configuration Type
- Représentation matricielle radiale ou intégration Canvas spécifique.

```javascript
// Matrice de flux bidirectionnels inter-régions
const matrixData = [
  [0, 25, 18, 12],
  [20, 0, 15, 30],
  [14, 16, 0, 22],
  [10, 28, 20, 0]
];
```

---

## Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle & Ratio 90/10 (Entité Focale vs Contexte)
- **Entité Pivot (*Hero Entity*)** : L'entité au centre de la question analytique (ex: notre filiale ou région cible) est mise en valeur par la couleur `tokens.emphasis.focal`, un contour accentué (`borderWidth: 2.5`) et une opacité accrue sur ses cordes émises ($\alpha \approx 0.35$).
- **Entités Partenaires (*Context Entities*)** : Couleurs de palette atténuées ou `tokens.emphasis.context` avec opacité réduite ($\alpha \approx 0.15 - 0.20$).

### 2. Valence Métier & Directionnalité des Soldes d'Échange
Dans un réseau bilatéral, le solde net entre deux entités ($S = \text{Flux}_{A \to B} - \text{Flux}_{B \to A}$) peut être teinté sémantiquement :
- **Solde Net Excédentaire ($S > 0$)** : Teinté avec `status.success` (`getValenceColor(tokens, 'up', 'gain')`).
- **Solde Net Déficitaire ($S < 0$)** : Teinté avec `status.danger` (`getValenceColor(tokens, 'down', 'gain')`).

### 3. Encodage des Flux Estimés ou Modélisés
- **Flux Prévisionnels / Modélisations Gravitaires** : Cordes tracées avec le token `tokens.emphasis.forecastAlpha` ($0.30 - 0.40$) et contours en tirets.

### 4. Double-Encodage Strict (Épaisseur d'Ancrage & Infobulle Bilatérale)
Pour éviter la confusion sur les flux croisés :
1. **Canal 1 (Couleur)** : Teinte de l'émetteur majeur ou valence du solde.
2. **Canal 2 (Largeur asymétrique)** : La racine source est plus épaisse que la terminaison réceptrice.
3. **Canal 3 (Infobulle tabulaire)** : Décomposition explicite : Volume émis, Volume reçu, et Solde net ($\pm \Delta$).

### 5. Guide d'Implémentation & Exemple de Code

```javascript
import { getEmphasisStyle, getValenceColor, getThemeTokens } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

const chordConfig = {
  datasets: [
    {
      label: 'Région Siège (Focal)',
      data: [0, 45, 30, 20],
      ...getEmphasisStyle(tokens, 'focal', { fill: true, alpha: 0.35 })
    },
    {
      label: 'Région Sud',
      data: [15, 0, 10, 25],
      ...getEmphasisStyle(tokens, 'context', { fill: true, alpha: 0.18 })
    }
  ]
};
```

---

## 8. Sources & Références Académiques
- **Krzywinski, M., et al. (2009)**. *Circos: an information aesthetic for comparative genomics*. Genome Research, 19(9), 1639-1645.
- **Bostock, M., Ogievetsky, V., & Heer, J. (2011)**. *D³: Data-Driven Documents*. IEEE TVCG.
- **MacKenzie, I. S., & Buxton, W. (1992)**. *Extending Fitts' law to two-dimensional tasks*. Proc. ACM CHI '92, 219–226.
- **Mayer, R. E. (2009)**. *Multimedia Learning* (2nd ed.). Cambridge University Press.
- **Nielsen, J. (1993)**. *Usability Engineering*. Morgan Kaufmann.

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation du Pointage Circulaire / Radial (MacKenzie & Buxton)
Dans un diagramme de cordes ou matrice de flux circulaire, l'opérateur explore des relations bilatérales réparties sur une circonférence.
Selon le modèle bivarié de pointage 2D :
- **Capture Radiale Continue** : L'interaction est configurée en coordonnées polaires (`interaction: { mode: 'nearest', intersect: false, axis: 'r' }`). Le rayon d'attraction moteur étendu (`pointHitRadius: 12px`, `pointHoverRadius: 7px`) augmente la largeur effective $W_e$ des sommets à $24\text{px}$.
- **Réduction de l'Index de Difficulté ($ID$)** : Le ciblage angulaire guidé par les axes radiaux réduit l'incertitude spatiale de premier tir, permettant un temps d'acquisition $MT \approx 130 + 190 \cdot \log_2(D/W_e + 1) \le 420\text{ms}$.

### 2. Seuils Temporels & Modèle Humain Processeur (Card-Moran-Newell, Nielsen)
- **Instantanéité Causale ($\le 100\text{ms}$)** : Au survol d'un sommet ou d'un flux, l'accentuation de l'opacité et l'élargissement du marqueur se produisent en $100\text{ms}$ (`hover.animationDuration: 100ms`).
- **Filtrage Anti-Flicker & Persistance** : Un debounce de $80\text{ms}$ neutralise les activations parasites lors de la rotation visuelle rapide autour du cercle. L'hystérésis de $150\text{ms}$ stabilise l'infobulle lors des transitions d'un axe radial à l'autre.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer, Sweller)
- **Positionnement Polaire Anti-Occlusion** : L'infobulle est déportée radialement par rapport au point d'interaction pour ne pas masquer les cordes internes sous-jacentes.
- **Inversion Verticale & Clamping Latéral** : Lorsque le point survolé se situe sur l'arc supérieur du cercle ($y < \text{margin}$), l'infobulle bascule automatiquement vers le bas (`caretPosition: 'top'`) et s'aligne latéralement pour rester confinée dans le viewport.

### 4. Hiérarchie Cognitive des Infobulles (*Details-on-Demand*) & Typographie Tabulaire
L'infobulle décompose le flux bilatéral en strates analytiques nettes :
1. **Strate 1 (Émetteur & Récepteur)** : Nom de l'entité source $\to$ Entité cible en sans-serif gras (`weight: 600`).
2. **Strate 2 (Volume Émis)** : Grandeur en flux brut formatée en chiffres tabulaires (`fontMono`, `toLocaleString('fr-FR')`).
3. **Strate 3 (Solde Net)** : Calcul du flux net bilatéral ($\pm \Delta$ volume) avec pastille de couleur.
4. **Strate 4 (Rôle)** : Mention explicite *[Focal]* ou *[Contexte]*.

### 5. Cinématique des Courbes d'Amorti (*Easing Curves*) & Constance d'Objet
- **Déploiement Initial** : Transition en $450\text{ms}$ animée par `easeOutQuart` ($s(t) = 1 - (1-t)^4$), offrant une décélération progressive sans harmonique oscillatoire.
- **Constance d'Objet** : Les cordes s'étendent de manière continue sans saut discontinu, prévenant la cécité au changement (*change blindness*, Simons & Rensink).

### 6. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2)
- **SC 2.3.3 (Animation from Interactions - AAA)** : Désactivation immédiate des animations (`duration: 0`) sous `@media (prefers-reduced-motion: reduce)` via `isReducedMotionPreferred()`.
- **SC 1.4.3 & 1.4.6 (Contraste Élevé)** : Contraste de l'infobulle $> 16:1$ (`#F8FAFC` sur `#0F172A`), bordure `tokens.borderStrong` visible sur fonds clairs et sombres.

