# Fiche Méthodologique : Diagramme en Barres Horizontales (Horizontal Bar Chart)

> **Catégorie** : 01-comparaison  
> **Type Chart.js** : `bar` (avec `indexAxis: 'y'`)  
> **Niveau de précision Cleveland & McGill** : RANG 1 (Position le long d'une échelle commune) — Erreur 3-5%  
> **Dernière révision** : 2026-08-13  

---

## 1. Description & Principe visuel

Le **diagramme en barres horizontales** (ou *Horizontal Bar Chart*) déploie les catégories qualitatives le long de l'axe vertical ($Y$), de haut en bas, et mesure les grandeurs numériques sur l'axe horizontal ($X$), de gauche à droite.

C'est l'adaptation ergonomique optimale du diagramme en barres verticales pour les données possédant des intitulés de catégories longs ou une forte cardinalité.

### Encodages visuels mobilisés
1. **Position sur échelle commune (Axe X)** : L'extrémité droite de chaque barre est ancrée le long d'un axe horizontal gradué continu démarrant à la ligne de base zéro ($X=0$).
2. **Longueur 1D horizontale** : La grandeur quantitative est encodée par l'étirement horizontal du rectangle (de gauche à droite).
3. **Alignement spatial vertical descendant (Axe Y)** : Les catégories sont disposées sur une ligne d'attache verticale à gauche, facilitant le balayage typographique naturel (*top-down*).

```
       ALIGNEMENT TYPOGRAPHIQUE ET ÉTIREMENT HORIZONTAL (X)
  Y (Catégories à libellés longs)
  ┌─────────────────────────────────┐
  │ Direction de la Recherche       │ ████████████████████████████ 148 k€
  │ Direction des Opérations        │ ████████████████████ 105 k€
  │ Direction du Marketing Digital  │ ██████████████ 78 k€
  │ Direction des Ressources Hum.   │ ████████ 42 k€
  └─────────────────────────────────┴─────────────────────────────────► X
                                    0           50          100       150
                                    ▲
                                    └─ Ligne de Base Zéro Obligatoire (X=0)
```

### Mécanisme Neuro-Cognitif
Le diagramme en barres horizontales s'aligne parfaitement avec les **motifs de balayage visuel oculomoteurs de type F-Pattern** (Nielsen, 2006) et la direction de lecture occidentale (de haut en bas et de gauche à droite). Le cortex visuel décode d'abord le libellé textuel non déformé à gauche, puis évalue instantanément la longueur de la barre horizontale via le traitement pré-attentif de Rang 1 (Cleveland & McGill, 1984).

---

## 2. Quand l'utiliser (Cas d'usage cibles)

### Types de variables adaptées
- **Axe Y (Catégoriel)** : Variable qualitative à libellés textuels longs (> 10-12 caractères) ou à cardinalité élevée (10 à 30 catégories).
- **Axe X (Numérique)** : Variable quantitative continue (ex: budgets, effectifs, scores, temps de réponse).

### Cas d'usage privilégiés
- **Classements & Palmarès (Rankings / Leaderboards)** : Présentation des *Top 10* ou *Bottom 10* entités (ex: "Top 10 des produits les plus vendus", "Palmarès des filiales").
- **Tableaux de bord opérationnels complexes** : Affichage de libellés descriptifs complets (ex: questions d'un sondage d'opinion, descriptions de processus métiers).
- **Comparaison de métriques à cardinalité élevée (10 à 25 items)** : Permet une intégration propre dans une mise en page web avec défilement vertical naturel (*vertical scroll*).

### Questions d'analyse résolues
- *Quel est le classement hiérarchique exact des entités de la plus forte à la plus faible ?*
- *Quelle est la valeur associée à l'intitulé métier "Direction du Marketing Digital" sans abréviation ni distorsion ?*
- *Quel est l'écart relatif entre le premier et le dixième du classement ?*

---

## 3. Quand NE PAS l'utiliser (Contre-indications)

```markdown
| Situation & Données | Pourquoi l'Horizontal Bar Chart échoue | Alternative Recommandée |
| :--- | :--- | :--- |
| **Séries temporelles** (Évolution $T_1 \rightarrow T_n$) | Le temps est perçu naturellement de gauche à droite sur l'axe X. Orienter le temps verticalement viole la métaphore spatio-temporelle universelle. | **Line Chart** ou **Vertical Bar Chart** |
| **Faible cardinalité à libellés très courts** ($N \le 4$, ex: *Oui / Non*) | Occupe inutilement de la hauteur verticale. | **Vertical Bar Chart** (`bar-chart.md`) |
| **Analyse de composition / Part-au-tout** | Si l'objectif principal est de percevoir la somme globale à 100%. | **100% Stacked Bar** ou **Treemap** |
| **Comparaison bi-dimensionnelle complexe** (> 4 sub-series) | L'empilement ou le groupement horizontal sur des barres horizontales devient visuellement très lourd. | **Small Multiples** (Facettes) |
```

---

## 4. Règles cognitives & Meilleures pratiques spécifiques

### 4.1 Tri Systématique par Valeur Décroissante
Dans un diagramme en barres horizontales, le balayage visuel commence au sommet de l'axe vertical.
- **Règle absolue** : Sauf ordre ordinal naturel intrinsèque, **trier impérativement les catégories par valeur numérique décroissante** (la plus grande barre en haut, la plus petite en bas).
- *Bénéfice cognitif* : Crée un profil visuel en escalier descendant qui accélère l'identification du classement et la perception de la distribution.

### 4.2 Alignement Typographique à Gauche
- Les intitulés de catégories sur l'axe Y doivent être **alignés à droite contre l'axe Y** (ou alignés à gauche dans une marge dédiée) avec une typographie lisible horizontale (rotation $0^\circ$).
- Ne jamais tronquer brutalement les libellés avec des points de suspension (`...`) si l'espace le permet.

### 4.3 La Ligne de Base Zéro sur l'Axe X ($X_{\min} = 0$)
Tout comme le diagramme vertical, l'encodage repose sur le ratio de longueur brute depuis l'origine. L'axe horizontal $X$ doit **impérativement commencer à zéro** (`scales.x.beginAtZero: true`).

### 4.5 Principes de la Gestalt
- **Loi de Proximité** : L'ajustement des paramètres `categoryPercentage: 0.8` et `barPercentage: 0.85` resserre la barre contre son étiquette textuelle verticale sur l'axe Y tout en ménageant un espacement suffisant entre les barres adjacentes.
- **Loi de Similarité** : L'utilisation d'une teinte chromatique constante pour les catégories d'un même ensemble sémantique garantit la reconnaissance immédiate du groupe.

### 4.6 Accessibilité WCAG 2.1 & Daltonisme (CVD)
- **Contraste de luminance WCAG AA/AAA** : Assurer un ratio de contraste $\ge 3.0:1$ pour les aplats des barres contre le fond canvas, et $\ge 4.5:1$ pour les étiquettes textuelles (`#0072B2` Bleu Okabe-Ito sur fond blanc `#FFFFFF`).
- **Palettes universelles CUD Okabe-Ito** : Pour mettre en valeur une barre d'intérêt (effet pop-out), utiliser la couleur vermillon `#D55E00` couplée à un contour visuel ou une étiquette textuelle distinctive.
- **Support ARIA & Lecteurs d'écran** : Intégrer les attributs `role="img"`, `aria-label`, et un tableau de secours accessible dans le DOM.

---

## 5. Erreurs fréquentes & Anti-patterns visuels

```
  [ ANTI-PATTERN 1 : Représentation du temps en horizontal ]   [ ANTI-PATTERN 2 : Absense de tri (Ordre aléatoire) ]
  Y                                                             Y
  ┌────────────────────────┐                                    ┌────────────────────────┐
  │ Décembre 2026          │ ████████                           │ Catégorie C            │ ████████ 45
  │ Novembre 2026          │ ██████                             │ Catégorie A            │ ██████████████ 85
  │ Octobre 2026           │ ██████████                         │ Catégorie D            │ ████ 20
  └────────────────────────┴─────────────────► X                │ Catégorie B            │ ██████████ 60
   (Viole le modèle mental : le temps coule vers la droite !)   └────────────────────────┴─────────────────► X
                                                                 (Profil visuel chaotique - Lecture très lente)
```

1. **Représentation d'une série temporelle en barres horizontales** : Viole la métaphore spatio-temporelle cognitive. Le futur doit s'étendre vers la droite, pas vers le bas.
2. **Absence de tri des catégories (Ordre aléatoire ou alphabétique)** : Force l'utilisateur à parcourir l'ensemble du graphique de haut en bas plusieurs fois pour reconstituer mentalement le classement.
3. **Ligne de base tronquée ($X_{\min} > 0$)** : Fausse l'évaluation de la longueur relative des barres (ex: une valeur de $105$ paraît 3 fois plus longue qu'une valeur de $100$).
4. **Libellés verticaux ou inclinés sur l'axe Y** : Détruit l'avantage principal du graphique horizontal qui est de permettre une lecture textuelle fluide à $0^\circ$.
5. **Épaisseur de barre excessive ou dérisoire** : Ajuster `barPercentage` et `categoryPercentage` pour conserver des barres d'une hauteur agréable (16px à 28px).

---

## 6. Recommandations d'implémentation Chart.js

### 6.1 Architecture technique : Type natif vs Plugins communautaires
Ce diagramme utilise le type natif **`bar`** configuré avec `indexAxis: 'y'`. Aucun plugin tiers n'est requis pour la géométrie. Le plugin communautaire **`chartjs-plugin-datalabels`** gère l'étiquetage direct en bout de barre.

### 6.2 Structure HTML & Accessibilité (DOM & ARIA)
Envelopper le canvas dans un conteneur d'accessibilité complet.

```html
<div class="chart-container" role="region" aria-label="Diagramme en barres horizontales du temps de résolution des tickets" tabindex="0">
  <canvas id="horizontalBarCanvas" role="img" aria-label="Graphique en barres horizontales montrant le temps moyen de résolution des tickets par direction. La Direction de la Qualité & Sécurité est en tête avec 42.5h." aria-describedby="horizontal-bar-fallback"></canvas>
  <div id="horizontal-bar-fallback" class="sr-only">
    <table>
      <caption>Temps moyen de résolution des tickets par direction (en heures)</caption>
      <thead>
        <tr>
          <th scope="col">Direction</th>
          <th scope="col">Temps de résolution (h)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Direction de la Qualité & Sécurité</td><td>42.5</td></tr>
        <tr><td>Direction de l Infogérance Systèmes</td><td>38.0</td></tr>
        <tr><td>Direction du Marketing Digital</td><td>29.4</td></tr>
        <tr><td>Direction des Ressources Humaines</td><td>21.2</td></tr>
        <tr><td>Direction Financière & Comptabilité</td><td>16.8</td></tr>
        <tr><td>Direction Juridique & Conformité</td><td>11.5</td></tr>
      </tbody>
    </table>
  </div>
</div>
```

### 6.3 Style CSS & Typographie Tabulaire (`tabular-nums`)
Garantir le rendu en chiffres tabulaires pour éviter l'alignement irrégulier des chiffres des durées.

```css
.chart-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  font-family: Inter, system-ui, -apple-system, sans-serif;
  font-variant-numeric: tabular-nums lining-nums;
  font-feature-settings: "tnum" 1, "lnum" 1;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### 6.4 Configuration standard baseline (Chart.js v4+)
Exemple d'implémentation d'un classement de 6 départements par temps moyen de résolution de tickets (en heures), avec tri décroissant et étiquetage direct.

```javascript
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Données triées par valeur décroissante (Top-Down)
const rawData = [
  { label: 'Direction de la Qualité & Sécurité', value: 42.5 },
  { label: 'Direction de l Infogérance Systèmes', value: 38.0 },
  { label: 'Support Technique Clientèle', value: 29.4 },
  { label: 'Développement d Applications Web', value: 22.1 },
  { label: 'Direction Marketing & Digital', value: 14.8 },
  { label: 'Ressources Humaines & Logistique', value: 9.2 }
];

// Palette Okabe-Ito (Monochromie avec accentuation du leader)
const COLOR_PRIMARY = '#0072B2';
const COLOR_ACCENT = '#D55E00'; // Vermillon sur le 1er du classement

const config = {
  type: 'bar',
  plugins: [ChartDataLabels],
  data: {
    labels: rawData.map(d => d.label),
    datasets: [{
      label: 'Temps Moyen de Résolution (heures)',
      data: rawData.map(d => d.value),
      // Accentuation sur la 1ère barre du classement
      backgroundColor: rawData.map((_, i) => i === 0 ? COLOR_ACCENT : COLOR_PRIMARY),
      borderColor: rawData.map((_, i) => i === 0 ? '#9A3412' : '#004C75'),
      borderWidth: 1,
      borderRadius: 4,
      borderSkipped: 'left', // Ligne de base verticale exacte à X=0
      categoryPercentage: 0.75,
      barPercentage: 0.85
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // Bascule le diagramme en barres horizontales
    plugins: {
      legend: {
        display: false // Supprimé : l'intitulé figure sur l'axe Y à gauche
      },
      tooltip: {
        backgroundColor: '#1E293B',
        titleFont: { family: 'Inter', size: 13, weight: '600' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          label: (ctx) => ` Temps moyen : ${ctx.parsed.x.toLocaleString('fr-FR')} h`
        }
      },
      datalabels: {
        anchor: 'end',
        align: 'right',
        offset: 6,
        color: '#0F172A',
        font: { family: 'Inter', size: 12, weight: '600' },
        formatter: (val) => `${val.toLocaleString('fr-FR')} h`
      }
    },
    scales: {
      x: {
        beginAtZero: true, // Impératif Lie Factor (Xmin = 0)
        grid: { display: false }, // Supprime le bruit visuel (Data-Ink ratio max)
        border: { display: false },
        ticks: {
          color: '#64748B',
          font: { family: 'Inter', size: 11 },
          callback: (val) => `${val} h`
        }
      },
      y: {
        grid: { display: false },
        border: { color: '#94A3B8', width: 1 }, // Ligne d'ancre verticale à X=0
        ticks: {
          color: '#0F172A',
          font: { family: 'Inter', size: 12, weight: '500' },
          padding: 8
        }
      }
    }
  }
};
```

---

## 7. Sources & Références académiques / clés

1. **Cleveland, W. S., & McGill, R. (1984)**. *Graphical Perception: Theory, Computation, and Application to the Development of Graphic Methods*. Journal of the American Statistical Association, 79(387), 531-554.
   - *Apport* : Évaluation de la précision de perception de la longueur et position 1D.
2. **Nielsen, J. (2006)**. *F-Shaped Pattern For Reading Web Content*. NN/g Nielsen Norman Group.
   - *Apport* : Preuve expérimentale du balayage visuel web en F (haut vers bas, gauche vers droite).
3. **Wigdor, D., & Balakrishnan, R. (2005)**. *Empirical Investigation of the Effect of Orientation on Text Readability*. ACM CHI 2005, 211-220.
   - *Apport* : Justification ergonomique de la lisibilité des libellés horizontaux à 0°.
4. **Tufte, E. R. (1983)**. *The Visual Display of Quantitative Information*. Graphics Press.
   - *Apport* : Optimisation du Data-Ink Ratio par la suppression des grilles grâce à l'étiquetage direct.
5. **Few, S. (2012)**. *Show Me the Numbers: Designing Tables and Graphs to Enlighten*. Analytics Press.
   - *Apport* : Directives de design pour les classements et le tri systématique des barres horizontales.

---

## Règles Cognitives d'Accentuation & Valence

### 1. Hiérarchie Visuelle (Ratio 90/10 de Tufte & Focus Narratif)
- **Focalisation sélective** : Mettre en exergue l'entité clé (ex: "Notre Marque" ou l'élément en tête) avec la teinte focale saturée (`tokens.emphasis.focal`).
- **Contexte atténué** : Les barres concurrentes ou de comparaison utilisent `tokens.emphasis.context` (`#CBD5E1` / opacité réduite), permettant un balayage immédiat sans surcharge cognitive.

### 2. Valence Métier & Directionnalité (Gain vs Coût/Risque/Churn)
- **Métriques directes (Revenus, Marge, Parts de marché)** :
  - Valeur positive / Surperformance : `status.success` (vert).
  - Valeur négative / Sous-performance : `status.danger` (rouge).
- **Métriques inversées (Temps de réponse, Coût d'acquisition, Churn)** :
  - Valeurs élevées : `status.danger` (rouge).
  - Valeurs basses : `status.success` (vert).
- **Résolution dynamique** : Intégration transparente via `getValenceColor(tokens, delta, metricType)`.

### 3. Matrice de Double-Encodage Strict
- **Accessibilité CVD (Color Vision Deficiency)** :
  - Barre focale : Couleur d'accent + bordure nette (`borderWidth: 2`) + police de libellé en demi-gras (weight: 600).
  - Seuil / Moyenne cible : Ligne repère verticale tiretée `tokens.emphasis.benchmark` (`borderDash: [4, 4]`).
  - Écarts / Deltas : Badges de texte direct avec symbole explicite (`+X%` ou `-X%`).

### 4. Exemple d'Implémentation Pratique

```javascript
import { createChart } from './template.js';
import { getThemeTokens, getEmphasisStyle, getValenceColor } from '../../themes/theme-tokens.js';

const tokens = getThemeTokens('colorbrewer-accessible');

// Classement de métropoles avec accentuation focale sur Tokyo
const customData = {
  labels: ['Tokyo', 'Delhi', 'Shanghai', 'São Paulo', 'Mexico'],
  datasets: [{
    label: 'Population (M)',
    data: [37.4, 32.9, 29.2, 22.6, 22.3],
    emphasisRoles: ['focal', 'context', 'context', 'context', 'context'],
    backgroundColor: [
      getEmphasisStyle(tokens, 'focal').backgroundColor,
      getEmphasisStyle(tokens, 'context').backgroundColor,
      getEmphasisStyle(tokens, 'context').backgroundColor,
      getEmphasisStyle(tokens, 'context').backgroundColor,
      getEmphasisStyle(tokens, 'context').backgroundColor
    ]
  }]
};

const chart = createChart('chartCanvas', customData, 'colorbrewer-accessible');
```

---

## Psychophysique de l'Interaction, Infobulles (*Details-on-Demand*) & Micro-Animations

### 1. Loi de Fitts & Modélisation de la Cible Interactive (Fitts 1954, MacKenzie 1992)
- **Formulation mathématique formelle** : Le temps d'acquisition motrice d'une barre horizontale s'exprime selon le modèle Shannon-MacKenzie :
  $$MT = a + b \cdot \log_2\left(\frac{D}{W_e} + 1\right)$$
- **Attraction 1D indexée sur l'axe Y** : Pour le diagramme horizontal, l'interaction est configurée en `mode: 'index'`, `axis: 'y'`, `intersect: false`. La bande interactive couvre l'intégralité de la hauteur de la ligne catégorielle ($W_e = H_{\text{bande}}$), ce qui ramène l'indice de difficulté à $ID \approx 1.2\text{ bit}$.
- **Gain psychomoteur mesuré** : L'acquisition d'une barre horizontale par balayage vertical naturel est accélérée de **$> 40\%$** par rapport à un pointage ponctuel $2D$.

### 2. Seuils Temporels & Model Human Processor (Card, Moran, Newell 1983 ; Nielsen 1993)
- **Constantes MHP** : Cycle perceptif $\tau_p \approx 100\text{ms}$, cycle cognitif $\tau_c \approx 70\text{ms}$, cycle moteur $\tau_m \approx 70\text{ms}$.
- **Réactivité de survol $\le 100\text{ms}$** : Retour visuel immédiat via `hover.animationDuration: 100ms`, garantissant une perception de causalité directe.
- **Micro-dynamique temporelle de l'infobulle** :
  - Débounce anti-flicker d'entrée : $60\text{--}80\text{ms}$ pour ignorer les saccades de traversée verticale.
  - Hystérésis de maintien de sortie : $150\text{ms}$ pour prévenir la fermeture intempestive lors de micro-mouvements de la main.
  - Fondu d'opacité : $120\text{ms}$ avec amorti `easeOutQuad`.

### 3. Contiguïté Spatiale, Anti-Occlusion & Prévention du *Split-Attention* (Mayer 2001, Sweller 1988)
- **Principe de Contiguïté Spatiale (Mayer 2001)** : L'infobulle apparaît à proximité immédiate de l'extrémité droite de la barre horizontale, sans masquer la longueur totale ni le libellé de catégorie situé sur l'axe Y.
- **Anti-Occlusion déterministe** : Inversion automatique de quadrant si la barre approche du bord droit du canevas, avec clamping latéral pour éviter tout débordement hors du conteneur.
- **Structure de l'infobulle *Details-on-Demand*** :
  1. Libellé complet de la métropole / catégorie (Sans-serif 12px, Weight 600).
  2. Valeur quantitative précise (`fontMono` 12px, Regular, format tabulaire `tabular-nums`).
  3. Rang ordinal ou part relative dans la population totale.

### 4. Cinématique des Courbes d'Amorti & Constance d'Objet (Penner 2002, Heer & Robertson 2007)
- **Rendu initial horizontal** : Déploiement progressif des barres de gauche à droite depuis l'axe vertical $X=0$ en $400\text{ms}$ avec profil `easeOutQuart` ($s(t) = 1 - (1 - t)^4$), matérialisant l'expansion de magnitude sans oscillation ($\zeta = 1.0$).
- **Transitions de tri dynamique** : Durée $350\text{ms}$ en `easeOutCubic` pour guider le suivi visuel des changements de position ordinale sans rupture attentionnelle.

### 5. Accessibilité Vestibulaire & Motrice (W3C WCAG 2.2 AAA)
- **Conformité SC 2.3.3** : Détection automatique de la directive système `prefers-reduced-motion: reduce` désactivant instantanément toute animation (`duration: 0`, `animation: false`).
- **Contraste renforcé SC 1.4.6 (AAA)** : Fond d'infobulle sombre avec texte clair haute lisibilité ($> 16:1$) et bordures de délimitation nettes.
- **Mode exécutif Tufte** : Suppression complète des animations et affichage épuré direct.


