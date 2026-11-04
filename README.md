<p align="center">
  <img src="docs/banner.png" width="100%" alt="kit-charts">
</p>

# kit-charts

Un kit pour vos agents d'IA (Antigravity, Claude Code, Cursor, etc.) pour générer des graphiques fiables, clairs et sans erreurs avec Chart.js.

L'agent n'a **plus besoin de recréer les graphiques de zéro** : il pioche dans **73 modèles prêts à l'emploi**, applique de bonnes règles de lisibilité et livre une page HTML que vous pouvez ouvrir directement dans votre navigateur.

---

## Pourquoi ce kit ?

Quand une IA essaie de coder un graphique à partir d'une feuille blanche, elle fait souvent de grosses erreurs :
- **Des axes coupés** qui trompent l'œil et font paraître de petits écarts énormes.
- **Trop d'informations entassées** (15 barres verticales illisibles ou 10 courbes emmêlées).
- **Des couleurs mal choisies**, impossibles à lire pour les personnes daltoniennes.
- **Des animations lentes, instables ou clignotantes** qui nuisent à la lecture immédiate.
- **Du code bricolé**, difficile à relire ou à réutiliser.

**kit-charts** règle ce problème en garantissant un **rendu instantané déterministe (0 ms de latence)**, des infobulles/étiquettes impeccables et des modèles déjà testés :

```
┌─────────────────────────────────────────────────────────────┐
│ UN SEUL AGENT : dataviz                                     │
│                                                             │
│ 1. Qualifie : le message, les données, le sens de la        │
│    métrique (une hausse est-elle bonne ?)                   │
│ 2. Construit : choisit le modèle, écrit la spec, compile    │
│    dans output/<nom-du-graphique>/index.html                │
│ 3. Audite : vérifie les règles, relit titre et couleurs,    │
│    corrige jusqu'à zéro erreur                              │
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
- **Interactif** : Testez les 8 thèmes de couleurs en un clic et parcourez les 73 modèles.

### 3. Demander à votre IA de Créer un Graphique
Donnez simplement votre besoin en langage naturel à votre agent IA :

```text
"Fais-moi un graphique pour comparer les ventes par région par rapport aux objectifs de l'année, avec un thème sombre et des alertes claires."
```

L'agent choisit le bon modèle (`bullet-chart`), applique les bonnes couleurs et place le résultat dans `output/ventes-regions/index.html`.

### Utiliser le kit dans n'importe quel projet

Inutile de copier ce dépôt dans chaque dossier : installez la commande `kit-charts` une fois.

```bash
npm i -g github:LouisLv-pro/kit-charts
```

Puis, dans le projet où vous voulez des graphiques, installez le skill et l'agent pour votre IA :

```bash
kit-charts install-skill
```

Les graphiques et leurs configurations sont créés dans `output/` du projet courant.

---

## Ce que fait l'Agent du Kit

Un seul agent, **`dataviz`** ([`.agents/agents/dataviz.md`](.agents/agents/dataviz.md)), fait tout le cycle en s'appuyant sur le skill [`kit-charts`](.agents/skills/kit-charts/SKILL.md) :

| Étape | Ce qu'il fait | Outil |
| :--- | :--- | :--- |
| **Qualifier** | Comprend le message à transmettre et note ses hypothèses | Le skill `kit-charts` |
| **Choisir** | Propose les modèles compatibles avec vos données, écarte ceux qui violent une règle | `recommend-template.js` |
| **Construire** | Écrit la configuration et génère la page | `compile-chart.js` (refuse une configuration non conforme) |
| **Auditer** | Vérifie les règles automatiques, puis relit le sens (titre, unité, tri, couleurs) | `validate-chart.js` + revue experte |

---

## Les 10 Familles de Graphiques (73 Modèles Prêts à l'Emploi)

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
| **07. Hiérarchies & Arbres** | `sunburst`, `dendrogram`, `marimekko-chart` | 3 niveaux maximum pour éviter la surcharge visuelle. |
| **08. Cartes géographiques** | `choropleth-map`, `bubble-map`, `cartogram-tilegram` | Valeurs ramenées par habitant ou par surface pour éviter les fausses impressions. |
| **09. Tableaux avec graphiques** | `table-kpi-scorecard`, `table-bar-in-cell` | Chiffres alignés à droite avec mini-barres de comparaison intégrées. |
| **Bonus. Infobulles & Détails** | `tooltip` (démonstrateur de la galerie, hors registre) | Infobulles anti-occlusion respectant Mayer et Fitts. |

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
kit-charts list                                   # les 73 modèles
kit-charts recommend data.json                    # modèles adaptés à vos données
kit-charts describe bar-chart-horizontal          # forme des données attendue et exemple
kit-charts init-spec bar-chart-horizontal -o output/mon-graphique/spec.json
kit-charts compile output/mon-graphique/spec.json -o output/mon-graphique/index.html
kit-charts validate output/mon-graphique/index.html
kit-charts check output/mon-graphique/index.html  # rendu réel dans Chrome
```

Dans ce dépôt sans installation, remplacez `kit-charts` par `node bin/kit-charts.js`.

Pour les contributeurs :

```bash
npm run build        # régénère catalog-bundle.js
npm test             # intégration + snapshots
npm run test:render  # rendu réel des 73 modèles dans Chrome headless (réseau requis)
npm run test:cli     # paquet installé, parcours complet du CLI
```

---

## Structure du Projet

```
kit-charts/
├── index.html                        # Galerie interactive pour voir tous les modèles
├── catalog-bundle.js                 # Fichier complet qui regroupe les 73 modèles et la démo d'infobulles
├── package.json                      # Commandes du projet
├── README.md                         # Ce guide
├── LICENSE                           # Licence libre MIT
│
├── template/                         # Les 73 modèles rangés par dossiers
│   ├── 00-kpi-card/                  # Cartes et indicateurs clés (7 modèles)
│   ├── 01-comparaison/               # Barres, colonnes, bullet charts (11 modèles)
│   ├── 02-composition-part-to-whole/ # Parts de marché, camemberts, treemaps (8 modèles)
│   ├── 03-distribution/              # Histogrammes, boîtes à moustaches (10 modèles)
│   ├── 04-correlation-relation/      # Nuages de points, bulles, heatmaps (7 modèles)
│   ├── 05-evolution-temporelle/      # Courbes et aires dans le temps (10 modèles)
│   ├── 06-flux-processus/            # Entonnoirs de vente, cascades (7 modèles)
│   ├── 07-hierarchie-reseau/         # Réseaux et arbres (4 modèles)
│   ├── 08-geospatial-cartes/         # Cartes et pays (3 modèles)
│   ├── 09-tableaux-dataviz/          # Tableaux avec mini-graphiques (6 modèles)
│   └── tooltip/                      # Démonstrateur d'infobulles (hors registre)
│
├── themes/                           # Les 8 thèmes de couleurs
│   └── theme-tokens.js               # Gestion des couleurs, contrastes et options Chart.js
│
├── output/                           # Dossier où sont enregistrés vos graphiques
│
└── .agents/                          # Rôles et instructions pour les agents d'IA
    ├── agents/                       # L'agent unique dataviz
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
