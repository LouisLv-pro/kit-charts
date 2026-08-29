<p align="center">
  <img src="docs/banner.png" width="100%" alt="kit-charts">
</p>

# kit-charts

Un kit pour vos agents d'IA (Antigravity, Claude Code, Cursor, etc.) pour générer des graphiques fiables, clairs et sans erreurs avec Chart.js.

L'agent n'a **plus besoin de recréer les graphiques de zéro** : il pioche dans **95 modèles prêts à l'emploi**, applique de bonnes règles de lisibilité et livre une page HTML que vous pouvez ouvrir directement dans votre navigateur.

---

## Pourquoi ce kit ?

Quand une IA essaie de coder un graphique à partir d'une feuille blanche, elle fait souvent de grosses erreurs :
- **Des axes coupés** qui trompent l'œil et font paraître de petits écarts énormes.
- **Trop d'informations entassées** (15 barres verticales illisibles ou 10 courbes emmêlées).
- **Des couleurs mal choisies**, impossibles à lire pour les personnes daltoniennes.
- **Du code bricolé**, difficile à relire ou à réutiliser.

**kit-charts** règle ce problème en donnant à l'agent une méthode simple et des modèles déjà testés :

```
┌─────────────────────────────────────────────────────────────┐
│ 1. L'ARCHITECTE (dataviz-architect)                         │
│    Comprend votre besoin, choisit le bon modèle et prépare  │
│    le fichier de configuration dataviz-spec.json.           │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. LE CONSTRUCTEUR (dataviz-builder)                        │
│    Assemble vos données avec le modèle et crée la page      │
│    dans output/<nom-du-graphique>/index.html.               │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. LE VÉRIFICATEUR (dataviz-reviewer)                       │
│    Contrôle que le graphique est lisible, bien cadré        │
│    et accessible à tout le monde.                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Démarrer en 3 Étapes

### 1. Cloner le Répertoire
```bash
git clone https://github.com/LouisLv-pro/kit-charts.git
cd kit-charts
```
*Rien d'autre à installer pour faire fonctionner les graphiques.*

### 2. Explorer la Galerie dans votre Navigateur
Ouvrez simplement [**`index.html`**](index.html) dans votre navigateur (double-clic ou `open index.html`).
- **100% Hors-Ligne** : Tous les graphiques s'affichent immédiatement, sans avoir besoin d'un serveur web.
- **Interactif** : Testez les 8 thèmes de couleurs en un clic et parcourez les 95 modèles.

### 3. Demander à votre IA de Créer un Graphique
Donnez simplement votre besoin en langage naturel à votre agent IA :

```text
"Fais-moi un graphique pour comparer les ventes par région par rapport aux objectifs de l'année, avec un thème sombre et des alertes claires."
```

L'agent choisit le bon modèle (`bullet-chart`), applique les bonnes couleurs et place le résultat dans `output/ventes-regions/index.html`.

---

## Ce que font les Agents du Kit

| Rôle | Mission | Ce qu'il produit |
| :--- | :--- | :--- |
| **`dataviz-architect`** | Analyse votre besoin et choisit le meilleur modèle du catalogue | Le fichier de configuration `dataviz-spec.json` |
| **`dataviz-builder`** | Assemble vos données dans le modèle choisi | Le dossier prêt à l'emploi `output/<projet>/index.html` |
| **`dataviz-reviewer`** | Vérifie que le graphique respecte toutes les règles de lisibilité | La confirmation que tout est en ordre |

---

## Les 10 Familles de Graphiques (95 Modèles Prêts à l'Emploi)

Chaque modèle est rangé dans son dossier avec sa structure standard (`template.html`, `schema.json`, `template.js`) :

| Famille | Exemples de modèles | Règle de bonne pratique |
| :--- | :--- | :--- |
| **00. Cartes KPI** | `kpi-standard`, `kpi-sparkline`, `kpi-bullet` | Gros chiffres bien lisibles et rappel clair de la période comparée. |
| **01. Comparer des valeurs** | `bar-chart-vertical`, `bar-chart-horizontal`, `bullet-chart` | L'axe commence toujours à 0 pour ne pas tromper l'œil. Barres horizontales dès qu'il y a plus de 7 éléments. |
| **02. Montrer des parts (100%)** | `doughnut-chart`, `stacked-bar-100`, `treemap` | Total égal à 100%, 2 à 5 tranches maximum, jamais d'effet 3D. |
| **03. Répartition & Distribution** | `box-plot`, `histogramme`, `density-plot` | Affichage net de la médiane et des valeurs exceptionnelles (anomalies). |
| **04. Corrélation & Liens** | `scatter-plot`, `bubble-chart`, `matrix-heatmap` | Pour les bulles, la taille représente la surface réelle et non le rayon. |
| **05. Évolution dans le temps** | `line-chart`, `multi-line-chart`, `area-chart` | Le temps se lit toujours de gauche à droite, avec un maximum de 5 courbes. |
| **06. Étapes & Flux** | `funnel-chart`, `waterfall-chart` | Étapes en cascade et taux de passage d'une étape à l'autre bien visibles. |
| **07. Hiérarchies & Arbres** | `sunburst`, `network-graph`, `radial-tree` | 3 niveaux maximum pour éviter la surcharge visuelle. |
| **08. Cartes géographiques** | `choropleth-map`, `bubble-map` | Valeurs ramenées par habitant ou par surface pour éviter les fausses impressions. |
| **09. Bourse & Finance** | `candlestick-chart`, `ohlc` | Vert pour la hausse, rouge pour la baisse. |
| **10. Tableaux avec graphiques** | `table-sparklines`, `table-bar-in-cell` | Chiffres alignés à droite avec mini-barres de comparaison intégrées. |

---

## 8 Thèmes de Couleurs Adaptés à Tous

Toutes les palettes ont été testées pour être confortables et lisibles par tout le monde, y compris les personnes daltoniennes :

1. **`colorbrewer-accessible`** (thème clair par défaut) : Palette équilibrée et facile à lire.
2. **`viridis-perceptual`** : Reste parfaitement lisible même si vous imprimez en noir et blanc.
3. **`paul-tol-scientific`** : Idéal quand vous avez plusieurs courbes à bien différencier.
4. **`tableau-stone-categorical`** : Couleurs sobres et professionnelles pour rapports d'entreprise.
5. **`okabe-ito-cud`** : Standard international pour les documents officiels.
6. **`tufte-minimalist-executive`** : Noir, blanc et gris, avec une seule touche de rouge pour l'essentiel.
7. **`nord-cognitive-dark`** : Thème sombre et doux pour ne pas fatiguer les yeux.
8. **`atkinson-hyperlegible`** : Conçu pour les personnes malvoyantes avec de forts contrastes.

### Des Couleurs qui ont du Sens
Le kit adapte automatiquement le vert et le rouge selon le sujet :
- **Chiffre d'affaires ou marge** : une hausse est verte, une baisse est rouge.
- **Pannes, temps d'attente ou coûts** : une hausse est rouge (mauvaise nouvelle), une baisse est verte (bonne nouvelle).
- **Objectifs à tenir** : vert quand l'objectif est atteint, orange pour un léger retard, rouge en cas d'alerte.

---

## Commandes Utiles

```bash
# 1. Créer un graphique à partir d'une configuration
node .agents/skills/kit-charts/scripts/compile-chart.js dataviz-spec.json -o output/mon-graphique/index.html

# 2. Vérifier la lisibilité d'une page générée
node .agents/skills/kit-charts/scripts/validate-chart.js output/mon-graphique/index.html

# 3. Mettre à jour le fichier global (catalog-bundle.js)
npm run build

# 4. Lancer la série de tests
npm test
```

---

## Structure du Projet

```
kit-charts/
├── index.html                        # Galerie interactive pour voir tous les modèles
├── catalog-bundle.js                 # Fichier complet qui regroupe les 95 modèles
├── package.json                      # Commandes du projet
├── README.md                         # Ce guide
├── LICENSE                           # Licence libre MIT
│
├── template/                         # Les 95 modèles rangés par dossiers
│   ├── 00-kpi-card/                  # Cartes et indicateurs clés
│   ├── 01-comparaison/               # Barres, colonnes, bullet charts
│   ├── 02-composition/               # Parts de marché, camemberts, treemaps
│   ├── 03-distribution/              # Histogrammes, boîtes à moustaches
│   ├── 04-correlation/               # Nuages de points, bulles, heatmaps
│   ├── 05-evolution-temporelle/      # Courbes et aires dans le temps
│   ├── 06-flux-processus/            # Entonnoirs de vente, cascades
│   ├── 07-hierarchie-reseau/         # Réseaux et arbres
│   ├── 08-geospatial-cartes/         # Cartes et pays
│   ├── 09-financiere-bourse/         # Graphiques boursiers et chandeliers
│   ├── 10-tableaux-matrices/         # Tableaux avec mini-graphiques
│   ├── tooltip/                      # Infobulles intelligentes
│   └── animation/                    # 20 animations fluides
│
├── themes/                           # Les 8 thèmes de couleurs
│   └── theme-tokens.js               # Gestion des couleurs et contrastes
│
├── output/                           # Dossier où sont enregistrés vos graphiques
│
└── .agents/                          # Rôles et instructions pour les agents d'IA
    ├── agents/                       # Instructions pour l'Architecte, le Constructeur et le Vérificateur
    ├── rules/                        # Règles de bonne lisibilité
    └── skills/kit-charts/            # Outils de génération et de vérification
```

---

## Contribuer & Signaler un Problème

Les contributions sont les bienvenues :

- **Ajouter un nouveau modèle** : Proposer un dossier modèle bien structuré (`template.html`, `schema.json`, `template.js`).
- **Ajouter un thème de couleurs** : Proposer une palette lisible et contrastée.
- **Signaler un problème** : Ouvrez une [Issue GitHub](https://github.com/LouisLv-pro/kit-charts/issues) en expliquant ce qui ne va pas.

### Vérifications avant d'Envoyer une Modification

```bash
# 1. Vérifier que tous les tests passent
npm test

# 2. Mettre à jour le fichier global
npm run build
```

---

## Licence

Projet sous licence libre **MIT**. Vous pouvez l'utiliser librement pour vos projets personnels, professionnels ou vos agents d'IA.
