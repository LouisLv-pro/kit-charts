/**
 * @file scratch/generate-all-previews-clean.mjs
 * @description Générateur propre et complet des 84 fichiers preview.html
 * - Barre d'outils avec 8 pastilles de thèmes colorimétriques
 * - Bouton de surbrillance des étiquettes de données (dataLabelsToggleBtn)
 * - Indicateur de thème actif
 * - Fil d'Ariane normalisé et carte cognitive
 * - Compatibilité 100% tests et standards ISO
 */

import fs from 'fs';
import path from 'path';

const ROOT = '/Users/louislaville/Desktop/kit-charts';
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const catMatch = indexHtml.match(/const CATALOG = (\[[\s\S]*?\]);\s*\/\/ \=\=\=/);
if (!catMatch) {
  throw new Error('Impossible de charger CATALOG depuis index.html');
}
const CATALOG = (new Function('return ' + catMatch[1]))();
const catMap = new Map();
CATALOG.forEach(c => catMap.set(c.id, c));

// Liste des 26 templates supportant cognitivement les étiquettes de données (datalabels)
const SUPPORTS_DATALABELS = new Set([
  // 19 templates de base
  'bar-chart-vertical',
  'bar-chart-horizontal',
  'grouped-bar-chart',
  'stacked-bar-chart',
  'bullet-chart',
  'lollipop-chart',
  'slope-chart',
  'dumbbell-chart',
  'radar-chart',
  'polar-area-chart',
  'pie-chart',
  'doughnut-chart',
  'stacked-bar-100',
  'sunburst',
  'treemap',
  'waffle-chart',
  'funnel-chart',
  'waterfall-chart',
  'bubble-map',
  // 7 nouveaux combos
  'histogramme-kde',
  'pareto-chart',
  'bar-target-overlay',
  'dual-axis-controlled',
  'stacked-total-line',
  'gantt-progress',
  'waterfall-cumulative-line'
]);

// Dictionnaire des règles cognitives pour chaque template
const COGNITIVE_RULES = {
  'kpi-standard': {
    usage: "Tableaux de bord exécutifs, rapports financiers et indicateurs clés de performance nécessitant une lecture immédiate et sans équivoque.",
    avoid: "Analyse exploratoire détaillée ou séries temporelles complexes nécessitant un historique étendu."
  },
  'kpi-sparkline': {
    usage: "Suivi de tendances continues à haute densité sans encombrer l'espace décisionnel (volatilité, trajectoire sur 12 à 30 points).",
    avoid: "Mesures nécessitant une lecture précise point par point ou échelles à fortes ruptures d'ordre de grandeur."
  },
  'kpi-bullet': {
    usage: "Pilotage d'objectifs, quotas commerciaux et seuils de performance (Stephen Few) comparés à des bandes qualitatives.",
    avoid: "Visualisation de distributions multi-variables ou de parts d'un tout."
  },
  'kpi-comparative': {
    usage: "Comparaison bivalente côte-à-côte entre Réalisé (N), Historique (N-1) et Budget prévisionnel.",
    avoid: "Séries chronologiques très longues ou mesures isolées sans contexte comparatif."
  },
  'kpi-distribution': {
    usage: "Décomposition synthétique d'un total en sous-parties contiguës (principe de Mayer) directement étiquetées.",
    avoid: "Catégories trop nombreuses (> 5 segments) créant une fragmentation excessive de la micro-barre."
  },
  'kpi-status-alert': {
    usage: "Supervision opérationnelle, monitoring de SLA et métriques critiques avec seuils d'alerte déterministes (RAG).",
    avoid: "Indicateurs purement informatifs sans seuil d'action ni polarité définie."
  },
  'kpi-composite': {
    usage: "Équations décisionnelles liant une métrique Hero dominante (60%) à ses 3 leviers opérationnels causaux directs.",
    avoid: "Métrique autonome sans causalité directe démontrée."
  },
  'bar-chart-vertical': {
    usage: "Comparaison de grandeurs discrètes entre 3 et 10 catégories à libellés courts, ou évolution par périodes discrètes.",
    avoid: "Libellés textuels longs nécessitant une inclinaison, ou cardinalité supérieure à 12 catégories."
  },
  'bar-chart-horizontal': {
    usage: "Classements, palmarès (Top/Bottom 10), catégories à libellés textuels longs (> 10 caractères) et cardinalité élevée.",
    avoid: "Séries chronologiques continues où le temps s'écoule naturellement de gauche à droite sur l'axe X."
  },
  'grouped-bar-chart': {
    usage: "Comparaison de 2 à 3 sous-groupes par catégorie principale sur une échelle commune.",
    avoid: "Plus de 4 sous-groupes par catégorie provoquant un encombrement visuel et une surcharge cognitive."
  },
  'stacked-bar-chart': {
    usage: "Comparaison simultanée des totaux agrégés et de la décomposition par sous-groupes pour 2 à 5 segments.",
    avoid: "Comparaison précise des segments intermédiaires non alignés sur une ligne de base commune."
  },
  'bullet-chart': {
    usage: "Évaluation de la performance d'une métrique par rapport à une cible et des plages qualitatives normées.",
    avoid: "Présentation de séries chronologiques ou de flux de données sans objectif fixe."
  },
  'bar-target-overlay': {
    usage: "Superposition directe de cibles fixes et d'écarts de variance sur des barres de performance catégorielles.",
    avoid: "Multiples cibles concurrentes créant un encombrement de marqueurs."
  },
  'lollipop-chart': {
    usage: "Alternative épurée au diagramme en barres à ratio Data-Ink élevé pour classements de cardinalité moyenne à forte.",
    avoid: "Données très denses où les disques terminaux se chevauchent."
  },
  'slope-chart': {
    usage: "Comparaison avant/après ou évolution entre 2 points temporels clés pour mettre en évidence les changements de rang.",
    avoid: "Séries temporelles continues avec fluctuations intermédiaires significatives."
  },
  'dumbbell-chart': {
    usage: "Visualisation d'écarts ou de deltas entre deux états (N vs N-1, Hommes vs Femmes, Réel vs Cible).",
    avoid: "Plus de 3 états par entité ou comparaisons sans axe quantitatif continu."
  },
  'radar-chart': {
    usage: "Profils multidimensionnels et benchmarks de compétences sur 4 à 8 axes normalisés.",
    avoid: "Comparaisons quantitatives de haute précision (l'aire perçue est biaisée par l'ordre des axes)."
  },
  'polar-area-chart': {
    usage: "Mise en avant de grandeurs cycliques ou saisonnières à angles égaux (modèle de Florence Nightingale).",
    avoid: "Comparaison précise de valeurs proches (biais de perception des rayons au carré)."
  },
  'pie-chart': {
    usage: "Part-au-tout simple avec 2 à 5 catégories maximales et des proportions très différenciées.",
    avoid: "Plus de 5 catégories ou comparaison fine de proportions proches (biais angulaire Cleveland-McGill)."
  },
  'doughnut-chart': {
    usage: "Part-au-tout avec libellé ou métrique centrale en espace réservé pour 2 à 4 segments.",
    avoid: "Cardinalité élevée ou décompositions hiérarchiques complexes."
  },
  'treemap': {
    usage: "Décomposition hiérarchique imbriquée de grandes cardinalités (dizaines à centaines de catégories).",
    avoid: "Comparaisons fines de valeurs proches où l'alignement sur un axe commun est requis."
  },
  'sunburst': {
    usage: "Navigation dans des arborescences hiérarchiques multi-niveaux rayonnantes.",
    avoid: "Hiérarchies plates sans relations parent-enfant."
  },
  'waffle-chart': {
    usage: "Représentation intuitive de pourcentages sur une grille 10x10 unitaire (principe du compte d'icônes).",
    avoid: "Grandes magnitudes continues ou valeurs nécessitant des décimales précises."
  },
  'stacked-bar-100': {
    usage: "Comparaison de proportions relatives normalisées à 100% entre plusieurs cohortes ou périodes.",
    avoid: "Analyse de volumes absolus (les totaux étant artificiellement égalisés à 100%)."
  },
  'pareto-chart': {
    usage: "Identification des 20% de causes générant 80% des effets (loi de Pareto) avec courbe cumulative.",
    avoid: "Séries non ordonnables par fréquence ou distributions uniformes sans asymétrie."
  },
  'stacked-total-line': {
    usage: "Visualisation simultanée de la composition par empilement et de l'évolution du total via une ligne de synthèse.",
    avoid: "Plus de 5 couches d'empilement rendant la lecture des segments instable."
  },
  'histogramme': {
    usage: "Distribution de fréquence d'une variable quantitative continue découpée en classes régulières.",
    avoid: "Variables catégorielles discrètes sans ordre naturel."
  },
  'density-plot': {
    usage: "Estimation de densité par noyau (KDE) pour lisser et révéler la forme théorique d'une distribution continue.",
    avoid: "Échantillons très réduits (N < 30) où le lissage par bande passante masque la réalité des points."
  },
  'box-plot': {
    usage: "Synthèse robuste de 5 nombres (médiane, quartiles, moustaches, outliers de Tukey) pour comparer des distributions.",
    avoid: "Distributions multimodales ou en U (masquées par les 5 quartiles synthétiques)."
  },
  'violin-plot': {
    usage: "Combinaison d'une boîte à moustaches et d'une densité symétrique pour révéler multimodalités et asymétries.",
    avoid: "Présentation à un public non familiarisé avec les concepts d'estimation de densité."
  },
  'strip-plot': {
    usage: "Affichage brut de chaque observation individuelle avec gigue (jitter) pour petits à moyens échantillons (N ≤ 200).",
    avoid: "Volumes massifs de données créant une occlusion totale des points."
  },
  'beeswarm-plot': {
    usage: "Distribution exacte des points individuels compactés sans superposition pour une observation sans distorsion.",
    avoid: "Très grands volumes (> 1000 points) risquant de saturer le calcul d'empilement."
  },
  'distribution-heatmap': {
    usage: "Densité conjointe 2D discrétisée sous forme de matrice thermique pour grands volumes d'observations.",
    avoid: "Petits échantillons où la matrice apparaît clairsemée et peu informative."
  },
  'histogramme-kde': {
    usage: "Combinaison directe de l'histogramme empirique et de la courbe KDE lissée sur double axe.",
    avoid: "Séries multivariées trop chargées superposant plus de 3 groupes."
  },
  'box-strip-plot': {
    usage: "Superposition de la boîte à moustaches statistique et des points individuels réels pour transparence totale.",
    avoid: "Échantillons géants (> 5000 points) masquant la structure de la boîte."
  },
  'raincloud-plot': {
    usage: "Visualisation complète combinant demi-violon, boîte à moustaches et points individuels (nuage de pluie).",
    avoid: "Espaces graphiques très réduits ou contraintes de concision extrême."
  },
  'scatter-plot': {
    usage: "Analyse de corrélation, dispersion et détection de patterns ou clusters entre 2 variables continues.",
    avoid: "Séries temporelles séquentielles pures où l'ordre des observations prime."
  },
  'bubble-chart': {
    usage: "Relations trivariées (X, Y et Z encodé par l'aire du disque) pour 10 à 50 entités.",
    avoid: "Valeurs négatives sur la dimension de taille ou cardinalité excessive (> 100 bulles)."
  },
  'matrix-heatmap': {
    usage: "Tableau croisé de corrélations ou intensités bivariées avec échelle de couleur continue normalisée.",
    avoid: "Matrices asymétriques sans graduation continue."
  },
  'connected-scatter-plot': {
    usage: "Trajectoire conjointe de 2 variables continues ordonnées chronologiquement dans le temps.",
    avoid: "Séries sans lien temporel séquentiel ou trajectoires chaotiques avec auto-intersections massives."
  },
  'density-2d-hexbin': {
    usage: "Agrégation hexagonale de haute densité pour cartographier des nuages de plus de 10 000 points sans occlusion.",
    avoid: "Petits échantillons où les hexagones isolés nuisent à la perception de la distribution."
  },
  'scatter-regression': {
    usage: "Nuage de points enrichi de la droite des moindres carrés (OLS) et de son intervalle de confiance à 95%.",
    avoid: "Relations non linéaires manifestes traitées par une régression linéaire simple sans avertissement."
  },
  'joint-scatter-marginals': {
    usage: "Nuage de points central associé à des histogrammes ou densités marginales projetés sur chaque axe.",
    avoid: "Affichages compacts en dashboard où l'espace latéral est restreint."
  },
  'line-chart': {
    usage: "Évolution d'une variable quantitative continue le long d'un axe temporel régulier ou continu.",
    avoid: "Données catégorielles discrètes sans continuité temporelle ou relationnelle."
  },
  'multi-line-chart': {
    usage: "Comparaison d'évolution temporelle de 2 à 5 séries simultanées avec étiquetage direct en fin de courbe.",
    avoid: "Plus de 6 séries créant un effet 'plat de spaghetti' illisible."
  },
  'area-chart': {
    usage: "Accentuation de la magnitude globale cumulée sous une courbe d'évolution temporelle continue.",
    avoid: "Séries à valeurs négatives ou multiples séries opaques se chevauchant."
  },
  'stacked-area-chart': {
    usage: "Évolution de la part de chaque sous-groupe et du volume global cumulé au fil du temps.",
    avoid: "Comparaison fine des variations des couches intermédiaires instables."
  },
  'streamgraph': {
    usage: "Visualisation fluide et esthétique de flux thématiques organiques centrés sur un axe médian.",
    avoid: "Rapports financiers ou mesures quantitatives requérant une lecture de précision sur un axe Y fixe."
  },
  'candlestick-ohlc': {
    usage: "Analyse boursière et financière des cours (Open, High, Low, Close) par unité temporelle.",
    avoid: "Données scalaires simples sans structure de prix à 4 bornes."
  },
  'sparkline': {
    usage: "Micro-courbe ultra-compacte intégrée in-line ou dans des tableaux pour indiquer une tendance immédiate.",
    avoid: "Analyse nécessitant la lecture précise de coordonnées ou de valeurs absolues."
  },
  'candlestick-volume': {
    usage: "Analyse technique couplant chandeliers japonais (70%) et barres d'histogramme de volume (30%).",
    avoid: "Présentation grand public sans familiarité avec le trading technique."
  },
  'dual-axis-controlled': {
    usage: "Corrélation de 2 séries aux unités différentes avec repères colorés et zéro aligné de façon stricte.",
    avoid: "Échelles trompeuses non corrélées ou manipulations d'amplitude visuelle."
  },
  'price-indicator-overlays': {
    usage: "Graphique de prix enrichi de moyennes mobiles (SMA 20/50) et de bandes de volatilité (Bollinger).",
    avoid: "Accumulation de plus de 4 indicateurs techniques saturant l'espace graphique."
  },
  'sankey-diagram': {
    usage: "Visualisation de flux directionnels avec conservation des volumes entre étapes de transfert.",
    avoid: "Réseaux avec boucles rétroactives complexes ou flux non quantifiables."
  },
  'chord-diagram': {
    usage: "Matrice de flux bidirectionnels circulaires entre entités connectées.",
    avoid: "Réseaux avec plus de 12 entités rendant les arcs illisibles."
  },
  'funnel-chart': {
    usage: "Parcours de conversion par étapes séquentielles avec taux de déperdition quantifiés.",
    avoid: "Processus non linéaires avec embranchements multiples ou retours en arrière."
  },
  'waterfall-chart': {
    usage: "Décomposition des contributions positives et négatives expliquant le passage d'une valeur initiale à finale.",
    avoid: "Séries temporelles pures sans relation de calcul incrémental."
  },
  'alluvial-diagram': {
    usage: "Évolution de flux et reclassements structurels entre étapes catégorielles successives.",
    avoid: "Séries à deux états simples où un diagramme en barres empilées suffit."
  },
  'gantt-progress': {
    usage: "Planning de projet, jalons temporels, dépendances et avancement avec repère 'Aujourd'hui'.",
    avoid: "Tâches sans durée définie ni temporalité calendaire."
  },
  'waterfall-cumulative-line': {
    usage: "Cascade de variations combinée à une ligne de trajectoire cumulée continue.",
    avoid: "Données sans logique de solde progressif."
  },
  'node-link-network': {
    usage: "Cartographie de relations, graphes de connexions et topologie de réseau.",
    avoid: "Hiérarchies strictes où un arbre ou dendrogramme offre une lecture plus structurée."
  },
  'arc-diagram': {
    usage: "Visualisation ordonnée 1D des connexions entre entités le long d'un axe linéaire.",
    avoid: "Réseaux denses avec forte densité d'arcs superposés."
  },
  'dendrogram': {
    usage: "Classification hiérarchique arborescente (clustering) illustrant les distances taxonomiques.",
    avoid: "Données relationnelles cycliques non hiérarchiques."
  },
  'marimekko-chart': {
    usage: "Mosaïque bidimensionnelle encodant simultanément les parts relatives en largeur et hauteur.",
    avoid: "Comparaisons simples à une seule dimension."
  },
  'choropleth-map': {
    usage: "Cartographie statistique de taux ou ratios normalisés sur des zones géographiques administratives.",
    avoid: "Valeurs absolues brutes non normalisées (biais de surface géographique des grands territoires)."
  },
  'bubble-map': {
    usage: "Localisation géographique de grandeurs absolues encodées par la taille de disques sur carte.",
    avoid: "Fortes densités urbaines créant une occlusion totale des disques superposés."
  },
  'cartogram-tilegram': {
    usage: "Grille de tuiles régulières égalisant l'aire de chaque territoire pour éliminer le biais spatial.",
    avoid: "Besoins nécessitant une précision topographique ou côtière exacte."
  },
  'table-kpi-scorecard': {
    usage: "Tableau exécutif consolidé combinant métriques clés, statuts RAG et micro-visualisations intégrées.",
    avoid: "Tableaux comptables bruts sans hiérarchisation analytique."
  },
  'table-heatmap-matrix': {
    usage: "Matrice de données tabulaires encodée en couleur continue pour repérage visuel rapide des extrêmes.",
    avoid: "Tableaux textuels sans valeurs quantitatives graduables."
  },
  'table-bar-in-cell': {
    usage: "Intégration de micro-barres proportionnelles directement dans les cellules pour comparaison instantanée.",
    avoid: "Tableaux à grand nombre de colonnes compactes limitant la largeur utile des cellules."
  },
  'table-hierarchical-tree': {
    usage: "Structure arborescente pliable/dépliable pour explorer des agrégats financiers ou organisationnels multi-niveaux.",
    avoid: "Listes plates sans hiérarchie parent-enfant."
  },
  'table-financial-variance': {
    usage: "Rapports financiers conformes aux standards IBCS avec barres de variance et écarts normalisés.",
    avoid: "Visualisations exploratoires informelles sans rigueur comptable."
  },
  'table-ranking-leaderboard': {
    usage: "Palmarès, classements compétitifs et classements périodiques avec rangs, badges et scores.",
    avoid: "Séries temporelles longues non ordonnées par rang."
  },
  'tooltip': {
    usage: "Détails-on-Demand interactifs, exploration contextuelle sans encombrer la vue globale.",
    avoid: "Masquage d'informations vitales à la compréhension immédiate du graphique."
  },
  'animation': {
    usage: "Transitions perceptives continues, constance d'objet (Gestalt) et navigation fluide entre états visuels.",
    avoid: "Animations décoratives gratuites sans signification sémantique, ou en cas de mode prefers-reduced-motion."
  },
  'anim-staged-transitions': {
    usage: "Découpage séquentiel en 3 temps (Sortie → Déplacement → Entrée) lors de restructurations visuelles majeures.",
    avoid: "Mises à jour scalaires directes sans changement de géométrie."
  },
  'anim-anti-change-blindness': {
    usage: "Guidage fovéal ciblé pour prévenir la cécité au changement lors de modifications locales de données.",
    avoid: "Mises à jour globales affectant simultanément l'ensemble du canevas."
  },
  'anim-preattentive-pulse': {
    usage: "Alerte visuelle immédiate par impulsion lumineuse pré-attentionnelle sur franchissement de seuil critique.",
    avoid: "Signaux permanents provoquant une fatigue visuelle ou une désensibilisation de l'utilisateur."
  },
  'anim-continuous-zoom': {
    usage: "Exploration sémantique continue et zoom dynamique sans perte de repères spatiaux de référence.",
    avoid: "Sauts discontinus et ruptures d'échelle sans interpolation intermédiaire."
  },
  'anim-mot-stagger': {
    usage: "Décalage temporel maîtrisé (stagger plafonné k ≤ 4) pour suivre des entités en mouvement simultané (MOT).",
    avoid: "Décalages supérieurs à 4 objets saturant la mémoire de travail visuelle."
  },
  'anim-apprehension-replay': {
    usage: "Contrôle utilisateur complet avec fonctions de relecture, pause et inspection pas-à-pas des transitions.",
    avoid: "Animations non interactives imposant un rythme forcé à l'utilisateur."
  },
  'anim-event-segmentation': {
    usage: "Segmentation narrative découpant une démonstration complexe en étapes cognitives assimilables.",
    avoid: "Flux continu ininterrompu sans temps de pause pour l'intégration cognitive."
  },
  'anim-lasseter-anticipation': {
    usage: "Principes classiques d'animation (anticipation, amorti physique) pour renforcer le réalisme perceptif.",
    avoid: "Mouvements exagérés nuisant à la rigueur de restitution des données analytiques."
  }
};

// CSS Standard unifié
const CSS_BLOCK = `    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background-color: #F8FAFC;
      color: #0F172A;
      min-height: 100vh;
      padding: 2rem 1.5rem;
      transition: background-color 0.25s ease, color 0.25s ease;
    }

    .wrapper {
      max-width: 1040px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .breadcrumb {
      font-size: 0.8125rem;
      color: #64748B;
      margin-bottom: 0.5rem;
    }

    .breadcrumb a {
      color: #2B8CBE;
      text-decoration: none;
      font-weight: 500;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }

    .header-panel {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #E2E8F0;
    }

    .title-group h1 {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .title-group p {
      font-size: 0.875rem;
      color: #64748B;
      margin-top: 0.25rem;
    }

    .controls-group {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      flex-wrap: wrap;
    }

    .toolbar-theme-label {
      font-size: 0.825rem;
      font-weight: 700;
      color: #0F172A;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .theme-swatches-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #F1F5F9;
      padding: 0.3rem 0.5rem;
      border-radius: 9999px;
      border: 1px solid #E2E8F0;
    }

    .theme-swatch {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      position: relative;
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      outline: none;
      padding: 0;
      flex-shrink: 0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }

    .theme-swatch:hover {
      transform: scale(1.18);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
    }

    .theme-swatch.active {
      transform: scale(1.22);
      border-color: #FFFFFF;
      box-shadow: 0 0 0 3px #2B8CBE, 0 3px 10px rgba(43, 140, 190, 0.35);
    }

    .active-theme-name-tag {
      font-size: 0.8rem;
      font-weight: 600;
      color: #475569;
      background: #FFFFFF;
      padding: 0.3rem 0.75rem;
      border-radius: 9999px;
      border: 1px solid #E2E8F0;
      white-space: nowrap;
    }

    .btn-label-toggle {
      width: 38px;
      height: 38px;
      border-radius: 9999px;
      border: 1px solid #E2E8F0;
      background: #F1F5F9;
      color: #94A3B8;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      outline: none;
    }

    .btn-label-toggle svg {
      width: 18px;
      height: 18px;
      transition: transform 0.2s ease;
    }

    .btn-label-toggle:hover {
      background: #FFFFFF;
      border-color: #2B8CBE;
      color: #2B8CBE;
      transform: translateY(-1px);
    }

    .btn-label-toggle.active {
      background: #2B8CBE;
      color: #FFFFFF !important;
      border-color: #2B8CBE;
      box-shadow: 0 0 14px rgba(43, 140, 190, 0.4), 0 2px 8px rgba(43, 140, 190, 0.3);
      transform: translateY(-1px);
    }

    .btn-label-toggle.active svg {
      filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.6));
    }

    .chart-container {
      position: relative;
      width: 100%;
      min-height: 420px;
      background-color: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: background-color 0.25s ease, border-color 0.25s ease;
    }

    .cognitive-rules-card {
      background-color: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
      transition: background-color 0.25s ease, border-color 0.25s ease;
    }

    .rule-item {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .rule-item h3 {
      font-size: 0.8125rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #2B8CBE;
    }

    .rule-item p {
      font-size: 0.875rem;
      line-height: 1.45;
      color: #475569;
    }

    .btn-action {
      padding: 0.45rem 0.85rem;
      border-radius: 6px;
      border: 1px solid #CBD5E1;
      background: #F1F5F9;
      color: #0F172A;
      font-size: 0.825rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-action:hover {
      background: #2B8CBE;
      color: #FFFFFF;
      border-color: #2B8CBE;
    }

    .btn-primary {
      background: #2B8CBE;
      color: #FFFFFF;
      border-color: #2B8CBE;
    }

    .btn-action.active {
      background: #2B8CBE;
      color: #FFFFFF;
      border-color: #2B8CBE;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.25rem;
    }

    .kpi-scorecard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
      gap: 1.25rem;
    }`;

// Plugins CDN nécessaires
function getPluginScripts(item, depth) {
  const scripts = [];
  const id = item ? item.id : '';
  const plugin = item ? item.plugin : null;

  if (id === 'candlestick-ohlc' || id === 'candlestick-volume' || id === 'price-indicator-overlays') {
    scripts.push('<script src="https://cdn.jsdelivr.net/npm/luxon@3.5.0/build/global/luxon.min.js"></script>');
    scripts.push('<script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-luxon@1.3.1/dist/chartjs-adapter-luxon.umd.min.js"></script>');
    scripts.push('<script src="https://cdn.jsdelivr.net/npm/chartjs-chart-financial@0.2.0/dist/chartjs-chart-financial.min.js"></script>');
  }
  if (id === 'treemap') {
    scripts.push('<script src="https://cdn.jsdelivr.net/npm/chartjs-chart-treemap@2.3.1/dist/chartjs-chart-treemap.min.js"></script>');
  }
  if (id === 'matrix-heatmap' || id === 'table-heatmap-matrix') {
    scripts.push('<script src="https://cdn.jsdelivr.net/npm/chartjs-chart-matrix@2.0.1/dist/chartjs-chart-matrix.min.js"></script>');
  }
  if (id === 'box-plot' || id === 'box-strip-plot' || id === 'violin-plot') {
    scripts.push('<script src="https://cdn.jsdelivr.net/npm/@sgratzl/chartjs-chart-boxplot@4.3.4/build/index.umd.min.js"></script>');
  }
  if (id === 'sankey-diagram' || id === 'alluvial-diagram') {
    scripts.push('<script src="https://cdn.jsdelivr.net/npm/chartjs-chart-sankey@0.12.1/dist/chartjs-chart-sankey.min.js"></script>');
  }
  if (id === 'choropleth-map' || id === 'bubble-map' || id === 'cartogram-tilegram') {
    scripts.push('<script src="https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js"></script>');
    scripts.push('<script src="https://cdn.jsdelivr.net/npm/chartjs-chart-geo@4.3.4/build/index.umd.min.js"></script>');
  }
  return scripts.join('\n  ');
}

// Recherche de tous les fichiers preview.html
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        results = results.concat(walk(fullPath));
      }
    } else if (file === 'preview.html') {
      results.push(fullPath);
    }
  });
  return results;
}

const previewFiles = walk(path.join(ROOT, 'template'));
console.log(`Génération des ${previewFiles.length} fichiers preview.html...`);

let generatedCount = 0;

for (const filePath of previewFiles) {
  const rel = path.relative(ROOT, filePath);
  const parts = rel.split('/');
  const depth = parts.length;
  const relRoot = depth === 4 ? '../../../' : '../../';
  const themeTokensPath = `${relRoot}themes/theme-tokens.js`;
  const indexPath = `${relRoot}index.html`;

  let category = parts[1];
  let slug = parts[2];
  if (depth === 3) {
    slug = parts[1]; // Ex: 00-kpi-card, animation, tooltip
  }

  let catalogId = slug;
  if (category === 'animation' && slug.startsWith('0')) {
    catalogId = 'anim-' + slug.substring(3);
  }

  const catalogItem = catMap.get(catalogId) || {
    id: catalogId,
    title: slug,
    category: category,
    categoryLabel: category,
    cognitiveRank: '',
    cognitiveSummary: ''
  };

  const title = catalogItem.title || slug;
  const subtitle = catalogItem.cognitiveSummary || 'Visualisation interactive conforme aux principes de psychophysique cognitive.';
  const ruleInfo = COGNITIVE_RULES[catalogId] || COGNITIVE_RULES[slug] || {
    usage: `Comparaison et analyse structurée pour la catégorie ${category}.`,
    avoid: `Séries inadaptées à la géométrie de ${slug}.`
  };

  const supportsDataLabels = SUPPORTS_DATALABELS.has(catalogId) || SUPPORTS_DATALABELS.has(slug);

  const pluginScripts = getPluginScripts(catalogItem, depth);

  let containerHtml = '';
  let scriptBody = '';

  // Fil d'Ariane spécial pour animation standalone
  let breadcrumbCat = category;
  if (category === 'animation') {
    breadcrumbCat = '11-animation';
  }

  if (rel === 'template/00-kpi-card/preview.html') {
    containerHtml = `    <!-- Grille des 7 Variantes de Cartes KPI -->
    <div id="chartContainer" class="chart-container kpi-scorecard-grid">
      <div id="targetCard1"></div>
      <div id="targetCard2"></div>
      <div id="targetCard3"></div>
      <div id="targetCard4"></div>
      <div id="targetCard5"></div>
      <div id="targetCard6"></div>
      <div id="targetCard7"></div>
    </div>`;

    scriptBody = `    document.addEventListener('DOMContentLoaded', function() {
      const chartContainer = document.getElementById('chartContainer');
      const rulesCard = document.getElementById('cognitiveRulesCard');
      const themeSwatchesGroup = document.getElementById('themeSwatchesGroup');
      const activeThemeIndicator = document.getElementById('activeThemeIndicator');
      const dataLabelsToggleBtn = document.getElementById('dataLabelsToggleBtn');
      const tokensEngine = window.KitChartsTheme || (window.KitCharts && window.KitCharts.Theme) || {};
      let currentTheme = 'colorbrewer-accessible';
      let showDataLabels = true;

      const THEME_NAMES = {
        'colorbrewer-accessible': 'ColorBrewer Accessible',
        'viridis-perceptual': 'Viridis Perceptual',
        'paul-tol-scientific': 'Paul Tol Scientific',
        'tableau-stone-categorical': 'Tableau Stone Categorical',
        'okabe-ito-cud': 'Okabe-Ito CUD',
        'tufte-minimalist-executive': 'Tufte Minimalist Executive',
        'nord-cognitive-dark': 'Nord Cognitive Dark',
        'atkinson-hyperlegible': 'Atkinson Hyperlegible'
      };

      function refreshAllCards(themeName) {
        currentTheme = themeName || 'colorbrewer-accessible';
        if (typeof tokensEngine.loadGoogleFonts === 'function') {
          tokensEngine.loadGoogleFonts(currentTheme);
        }
        const tokens = typeof tokensEngine.getThemeTokens === 'function' ? tokensEngine.getThemeTokens(currentTheme) : {};

        document.body.style.backgroundColor = tokens.isDark ? '#242933' : '#F8FAFC';
        document.body.style.color = tokens.textPrimary || '#0F172A';

        if (rulesCard) {
          rulesCard.style.backgroundColor = tokens.surface || '#FFFFFF';
          rulesCard.style.borderColor = tokens.border || '#E2E8F0';
        }

        const mods = window.KitCharts || {};

        if (mods['kpi-standard']) {
          mods['kpi-standard'].renderCard('targetCard1', {
            title: 'Revenu Récurrent (MRR)',
            value: 142850,
            unit: '€',
            delta: 14.2,
            deltaLabel: 'vs mois précédent (125 080 €)',
            metricType: 'gain',
            footnote: 'Clôture mensuelle certifiée'
          }, currentTheme);
        }

        if (mods['kpi-sparkline']) {
          mods['kpi-sparkline'].renderCard('targetCard2', {
            title: 'Taux de Conversion Global',
            value: 3.84,
            unit: '%',
            delta: 0.8,
            deltaLabel: 'vs moyenne 30j (3.04%)',
            metricType: 'gain',
            history: [2.9, 3.1, 3.0, 3.4, 3.2, 3.6, 3.5, 3.3, 3.7, 3.9, 3.6, 3.84],
            footnote: 'Tendance 12j • Max: 3.90%'
          }, currentTheme);
        }

        if (mods['kpi-bullet']) {
          mods['kpi-bullet'].renderCard('targetCard3', {
            title: 'Quota Commercial T3',
            value: 460000,
            target: 500000,
            unit: '€',
            ranges: [300000, 425000, 550000],
            footnote: 'Écart restant: -40 000 € (92% atteint)'
          }, currentTheme);
        }

        if (mods['kpi-comparative']) {
          mods['kpi-comparative'].renderCard('targetCard4', {
            title: 'Marge Brute Opérationnelle',
            value: 68.5,
            unit: '%',
            historical: { label: 'vs N-1', value: 64.2, deltaAbs: 4.3, deltaPct: 6.7 },
            budget: { label: 'vs Budget', value: 70.0, deltaAbs: -1.5, deltaPct: -2.1 },
            footnote: 'Consolidation semestrielle'
          }, currentTheme);
        }

        if (mods['kpi-distribution']) {
          mods['kpi-distribution'].renderCard('targetCard5', {
            title: 'Acquisition Globale (Trafic)',
            value: 1240000,
            unit: 'visites',
            delta: 8.5,
            deltaLabel: 'vs N-1 (1 142 850)',
            segments: [
              { label: 'Organique', pct: 45, value: 558000 },
              { label: 'Direct', pct: 25, value: 310000 },
              { label: 'Payant', pct: 20, value: 248000 },
              { label: 'Referral', pct: 10, value: 124000 }
            ],
            footnote: 'Canaux GA4 qualifiés'
          }, currentTheme);
        }

        if (mods['kpi-status-alert']) {
          mods['kpi-status-alert'].renderCard('targetCard6', {
            title: 'Latence Serveur P99',
            value: 142,
            unit: 'ms',
            thresholds: { nominal: 100, critical: 150 },
            polarity: 'lower-is-better',
            maxScale: 200,
            footnote: '⚠️ Seuil d\\'attention franchi (> 100 ms)'
          }, currentTheme);
        }

        if (mods['kpi-composite']) {
          mods['kpi-composite'].renderCard('targetCard7', {
            title: 'Chiffre d\\'Affaires E-Commerce',
            value: 842500,
            unit: '€',
            delta: 18.4,
            deltaLabel: 'vs N-1 (711 500 €)',
            drivers: [
              { label: 'Commandes', value: 10240, unit: '', delta: 12.1, deltaUnit: '%' },
              { label: 'Panier Moyen', value: 82.27, unit: '€', delta: 5.6, deltaUnit: '%' },
              { label: 'Tx Conv.', value: 3.42, unit: '%', delta: -0.2, deltaUnit: 'pt' }
            ],
            footnote: 'Équation: CA = Commandes × Panier'
          }, currentTheme);
        }
      }

      function updateTheme(themeName) {
        refreshAllCards(themeName);
        setActiveThemeUI(themeName);
      }

      function setActiveThemeUI(themeName) {
        const swatches = document.querySelectorAll('.theme-swatch');
        swatches.forEach(s => {
          if (s.dataset.themeName === themeName) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
        if (activeThemeIndicator) {
          activeThemeIndicator.textContent = THEME_NAMES[themeName] || themeName;
        }
      }

      if (themeSwatchesGroup) {
        themeSwatchesGroup.addEventListener('click', function(e) {
          const swatch = e.target.closest('.theme-swatch');
          if (swatch && swatch.dataset.themeName) {
            updateTheme(swatch.dataset.themeName);
          }
        });
      }

      if (dataLabelsToggleBtn) {
        dataLabelsToggleBtn.addEventListener('click', function() {
          showDataLabels = !showDataLabels;
          dataLabelsToggleBtn.classList.toggle('active', showDataLabels);
          dataLabelsToggleBtn.setAttribute('aria-pressed', String(showDataLabels));
          dataLabelsToggleBtn.title = showDataLabels ? 'Étiquettes de données (Labels) : Activées' : 'Étiquettes de données (Labels) : Désactivées';
          refreshAllCards(currentTheme);
        });
      }

      updateTheme('colorbrewer-accessible');
    });`;
  } else if (category === '00-kpi-card') {
    containerHtml = `    <!-- Démonstrateur KPI Card -->
    <div id="chartContainer" class="chart-container cards-grid">
      <div id="cardTarget1"></div>
      <div id="cardTarget2"></div>
      <div id="cardTarget3"></div>
    </div>`;

    scriptBody = `    document.addEventListener('DOMContentLoaded', function() {
      const chartContainer = document.getElementById('chartContainer');
      const rulesCard = document.getElementById('cognitiveRulesCard');
      const themeSwatchesGroup = document.getElementById('themeSwatchesGroup');
      const activeThemeIndicator = document.getElementById('activeThemeIndicator');
      const dataLabelsToggleBtn = document.getElementById('dataLabelsToggleBtn');
      const tokensEngine = window.KitChartsTheme || (window.KitCharts && window.KitCharts.Theme) || {};
      const cardModule = (window.KitCharts && window.KitCharts['${slug}']) || {};
      let currentTheme = 'colorbrewer-accessible';
      let showDataLabels = true;

      const THEME_NAMES = {
        'colorbrewer-accessible': 'ColorBrewer Accessible',
        'viridis-perceptual': 'Viridis Perceptual',
        'paul-tol-scientific': 'Paul Tol Scientific',
        'tableau-stone-categorical': 'Tableau Stone Categorical',
        'okabe-ito-cud': 'Okabe-Ito CUD',
        'tufte-minimalist-executive': 'Tufte Minimalist Executive',
        'nord-cognitive-dark': 'Nord Cognitive Dark',
        'atkinson-hyperlegible': 'Atkinson Hyperlegible'
      };

      function renderCards(themeName) {
        currentTheme = themeName || 'colorbrewer-accessible';
        if (typeof tokensEngine.loadGoogleFonts === 'function') {
          tokensEngine.loadGoogleFonts(currentTheme);
        }
        const tokens = typeof tokensEngine.getThemeTokens === 'function' ? tokensEngine.getThemeTokens(currentTheme) : {};

        document.body.style.backgroundColor = tokens.isDark ? '#242933' : '#F8FAFC';
        document.body.style.color = tokens.textPrimary || '#0F172A';

        if (rulesCard) {
          rulesCard.style.backgroundColor = tokens.surface || '#FFFFFF';
          rulesCard.style.borderColor = tokens.border || '#E2E8F0';
        }

        if (typeof cardModule.renderCard === 'function') {
          cardModule.renderCard('cardTarget1', {
            title: 'Indicateur Nominal A',
            value: 142850,
            unit: '€',
            delta: 14.2,
            deltaLabel: 'vs N-1 (125 080 €)',
            metricType: 'gain',
            history: [120, 125, 128, 134, 138, 142.85],
            target: 150000,
            ranges: [100000, 130000, 160000],
            thresholds: { nominal: 100, critical: 150 },
            footnote: 'Clôture opérationnelle certifiée'
          }, currentTheme);

          cardModule.renderCard('cardTarget2', {
            title: 'Indicateur Benchmark B',
            value: 84.5,
            unit: '%',
            delta: 3.2,
            deltaLabel: 'vs moyenne (81.3%)',
            metricType: 'gain',
            history: [78, 80, 81, 82, 83.5, 84.5],
            target: 90.0,
            ranges: [60, 80, 100],
            thresholds: { nominal: 80, critical: 95 },
            footnote: 'Objectif trimestriel T3'
          }, currentTheme);

          cardModule.renderCard('cardTarget3', {
            title: 'Indicateur d\\'Alerte C',
            value: 18.2,
            unit: 'ms',
            delta: -5.4,
            deltaLabel: 'vs semaine passée (23.6 ms)',
            metricType: 'cost',
            history: [25, 24, 22, 20, 19, 18.2],
            target: 15.0,
            ranges: [10, 20, 30],
            thresholds: { nominal: 15, critical: 25 },
            footnote: 'Latence nominale optimale'
          }, currentTheme);
        }
      }

      function updateTheme(themeName) {
        renderCards(themeName);
        setActiveThemeUI(themeName);
      }

      function setActiveThemeUI(themeName) {
        const swatches = document.querySelectorAll('.theme-swatch');
        swatches.forEach(s => {
          if (s.dataset.themeName === themeName) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
        if (activeThemeIndicator) {
          activeThemeIndicator.textContent = THEME_NAMES[themeName] || themeName;
        }
      }

      if (themeSwatchesGroup) {
        themeSwatchesGroup.addEventListener('click', function(e) {
          const swatch = e.target.closest('.theme-swatch');
          if (swatch && swatch.dataset.themeName) {
            updateTheme(swatch.dataset.themeName);
          }
        });
      }

      if (dataLabelsToggleBtn) {
        dataLabelsToggleBtn.addEventListener('click', function() {
          showDataLabels = !showDataLabels;
          dataLabelsToggleBtn.classList.toggle('active', showDataLabels);
          dataLabelsToggleBtn.setAttribute('aria-pressed', String(showDataLabels));
          dataLabelsToggleBtn.title = showDataLabels ? 'Étiquettes de données (Labels) : Activées' : 'Étiquettes de données (Labels) : Désactivées';
          renderCards(currentTheme);
        });
      }

      updateTheme('colorbrewer-accessible');
    });`;
  } else if (category === '09-tableaux-dataviz') {
    containerHtml = `    <!-- Conteneur Tableau Dataviz -->
    <div id="chartContainer" class="chart-container" style="overflow-x: auto; min-height: 480px;">
      <div id="tableTarget"></div>
    </div>`;

    scriptBody = `    document.addEventListener('DOMContentLoaded', function() {
      const chartContainer = document.getElementById('chartContainer');
      const rulesCard = document.getElementById('cognitiveRulesCard');
      const themeSwatchesGroup = document.getElementById('themeSwatchesGroup');
      const activeThemeIndicator = document.getElementById('activeThemeIndicator');
      const dataLabelsToggleBtn = document.getElementById('dataLabelsToggleBtn');
      const tokensEngine = window.KitChartsTheme || (window.KitCharts && window.KitCharts.Theme) || {};
      const tableModule = (window.KitCharts && window.KitCharts['${slug}']) || {};
      let currentTheme = 'colorbrewer-accessible';
      let showDataLabels = true;

      const THEME_NAMES = {
        'colorbrewer-accessible': 'ColorBrewer Accessible',
        'viridis-perceptual': 'Viridis Perceptual',
        'paul-tol-scientific': 'Paul Tol Scientific',
        'tableau-stone-categorical': 'Tableau Stone Categorical',
        'okabe-ito-cud': 'Okabe-Ito CUD',
        'tufte-minimalist-executive': 'Tufte Minimalist Executive',
        'nord-cognitive-dark': 'Nord Cognitive Dark',
        'atkinson-hyperlegible': 'Atkinson Hyperlegible'
      };

      function renderTable(themeName) {
        currentTheme = themeName || 'colorbrewer-accessible';
        if (typeof tokensEngine.loadGoogleFonts === 'function') {
          tokensEngine.loadGoogleFonts(currentTheme);
        }
        let tokens = null;
        if (typeof tokensEngine.applyThemeToContainer === 'function') {
          tokens = tokensEngine.applyThemeToContainer(chartContainer, currentTheme);
        } else if (typeof tokensEngine.getThemeTokens === 'function') {
          tokens = tokensEngine.getThemeTokens(currentTheme);
        }

        if (tokens) {
          document.body.style.backgroundColor = tokens.isDark ? '#242933' : '#F8FAFC';
          document.body.style.color = tokens.textPrimary || '#0F172A';
          if (rulesCard) {
            rulesCard.style.backgroundColor = tokens.surface || '#FFFFFF';
            rulesCard.style.borderColor = tokens.border || '#E2E8F0';
          }
        }

        if (typeof tableModule.renderTable === 'function') {
          tableModule.renderTable('tableTarget', tableModule.DEFAULT_DATA || null, currentTheme, { showDataLabels });
        }
      }

      function updateTheme(themeName) {
        renderTable(themeName);
        setActiveThemeUI(themeName);
      }

      function setActiveThemeUI(themeName) {
        const swatches = document.querySelectorAll('.theme-swatch');
        swatches.forEach(s => {
          if (s.dataset.themeName === themeName) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
        if (activeThemeIndicator) {
          activeThemeIndicator.textContent = THEME_NAMES[themeName] || themeName;
        }
      }

      if (themeSwatchesGroup) {
        themeSwatchesGroup.addEventListener('click', function(e) {
          const swatch = e.target.closest('.theme-swatch');
          if (swatch && swatch.dataset.themeName) {
            updateTheme(swatch.dataset.themeName);
          }
        });
      }

      if (dataLabelsToggleBtn) {
        dataLabelsToggleBtn.addEventListener('click', function() {
          showDataLabels = !showDataLabels;
          dataLabelsToggleBtn.classList.toggle('active', showDataLabels);
          dataLabelsToggleBtn.setAttribute('aria-pressed', String(showDataLabels));
          dataLabelsToggleBtn.title = showDataLabels ? 'Étiquettes de données (Labels) : Activées' : 'Étiquettes de données (Labels) : Désactivées';
          renderTable(currentTheme);
        });
      }

      updateTheme('colorbrewer-accessible');
    });`;
  } else if (category === 'animation' && slug === 'animation') {
    containerHtml = `    <!-- Conteneur Laboratoire d'Animations -->
    <div id="chartContainer" class="chart-container" style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="position: relative; width: 100%; height: 420px;">
        <canvas id="chartCanvas"></canvas>
      </div>

      <div class="interactive-toolbar" style="display: flex; flex-wrap: wrap; gap: 0.5rem; padding-top: 0.75rem; border-top: 1px solid #E2E8F0; align-items: center;">
        <button class="btn-action btn-primary" id="replayBtn">▶ Rejouer</button>
        <button class="btn-action" id="sortDescBtn">Tri Décroissant</button>
        <button class="btn-action" id="sortAscBtn">Tri Croissant</button>
        <button class="btn-action" id="shuffleBtn">Mélanger</button>
        <button class="btn-action" id="filterTopBtn">Top 4</button>
        <button class="btn-action" id="resetBtn">Réinitialiser</button>
        <button class="btn-action" id="reducedMotionBtn" style="margin-left: auto;">Reduced Motion : Inactif</button>
      </div>
    </div>`;

    scriptBody = `    document.addEventListener('DOMContentLoaded', function() {
      const canvas = document.getElementById('chartCanvas');
      const chartContainer = document.getElementById('chartContainer');
      const rulesCard = document.getElementById('cognitiveRulesCard');
      const themeSwatchesGroup = document.getElementById('themeSwatchesGroup');
      const activeThemeIndicator = document.getElementById('activeThemeIndicator');
      const dataLabelsToggleBtn = document.getElementById('dataLabelsToggleBtn');
      const reducedMotionBtn = document.getElementById('reducedMotionBtn');
      const replayBtn = document.getElementById('replayBtn');
      const sortDescBtn = document.getElementById('sortDescBtn');
      const sortAscBtn = document.getElementById('sortAscBtn');
      const shuffleBtn = document.getElementById('shuffleBtn');
      const filterTopBtn = document.getElementById('filterTopBtn');
      const resetBtn = document.getElementById('resetBtn');
      const tokensEngine = window.KitChartsTheme || (window.KitCharts && window.KitCharts.Theme) || {};

      let currentChart = null;
      let currentTheme = 'colorbrewer-accessible';
      let showDataLabels = true;
      let forceReducedMotion = false;

      const THEME_NAMES = {
        'colorbrewer-accessible': 'ColorBrewer Accessible',
        'viridis-perceptual': 'Viridis Perceptual',
        'paul-tol-scientific': 'Paul Tol Scientific',
        'tableau-stone-categorical': 'Tableau Stone Categorical',
        'okabe-ito-cud': 'Okabe-Ito CUD',
        'tufte-minimalist-executive': 'Tufte Minimalist Executive',
        'nord-cognitive-dark': 'Nord Cognitive Dark',
        'atkinson-hyperlegible': 'Atkinson Hyperlegible'
      };

      const ORIGINAL_DATA = {
        labels: ['Recherche', 'Ingénierie', 'Infrastructure', 'Marketing', 'Support', 'RH', 'Finance', 'Logistique'],
        datasets: [
          {
            label: 'Score d\\'Efficacité 2026',
            data: [88, 94, 76, 82, 69, 85, 91, 78]
          },
          {
            label: 'Benchmark Marché',
            data: [75, 80, 70, 75, 65, 75, 82, 70]
          }
        ]
      };

      function renderCurrentChart() {
        if (typeof tokensEngine.loadGoogleFonts === 'function') {
          tokensEngine.loadGoogleFonts(currentTheme);
        }
        let tokens = null;
        if (typeof tokensEngine.applyThemeToContainer === 'function') {
          tokens = tokensEngine.applyThemeToContainer(chartContainer, currentTheme);
        } else if (typeof tokensEngine.getThemeTokens === 'function') {
          tokens = tokensEngine.getThemeTokens(currentTheme);
        }

        if (tokens) {
          document.body.style.backgroundColor = tokens.isDark ? '#242933' : '#F8FAFC';
          document.body.style.color = tokens.textPrimary || '#0F172A';
          if (rulesCard) {
            rulesCard.style.backgroundColor = tokens.surface || '#FFFFFF';
            rulesCard.style.borderColor = tokens.border || '#E2E8F0';
          }
        }

        const animMod = window.KitCharts && window.KitCharts['animation'];
        if (animMod && typeof animMod.createChart === 'function') {
          if (currentChart && typeof currentChart.destroy === 'function') {
            currentChart.destroy();
          }
          currentChart = animMod.createChart(
            canvas,
            JSON.parse(JSON.stringify(ORIGINAL_DATA)),
            currentTheme,
            {
              duration: forceReducedMotion ? 0 : 750,
              reducedMotion: forceReducedMotion,
              showDataLabels: showDataLabels
            }
          );
        }
      }

      function updateTheme(themeName) {
        currentTheme = themeName || 'colorbrewer-accessible';
        setActiveThemeUI(currentTheme);
        renderCurrentChart();
      }

      function setActiveThemeUI(themeName) {
        const swatches = document.querySelectorAll('.theme-swatch');
        swatches.forEach(s => {
          if (s.dataset.themeName === themeName) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
        if (activeThemeIndicator) {
          activeThemeIndicator.textContent = THEME_NAMES[themeName] || themeName;
        }
      }

      if (themeSwatchesGroup) {
        themeSwatchesGroup.addEventListener('click', function(e) {
          const swatch = e.target.closest('.theme-swatch');
          if (swatch && swatch.dataset.themeName) {
            updateTheme(swatch.dataset.themeName);
          }
        });
      }

      if (dataLabelsToggleBtn) {
        dataLabelsToggleBtn.addEventListener('click', function() {
          showDataLabels = !showDataLabels;
          dataLabelsToggleBtn.classList.toggle('active', showDataLabels);
          dataLabelsToggleBtn.setAttribute('aria-pressed', String(showDataLabels));
          dataLabelsToggleBtn.title = showDataLabels ? 'Étiquettes de données (Labels) : Activées' : 'Étiquettes de données (Labels) : Désactivées';
          renderCurrentChart();
        });
      }

      if (reducedMotionBtn) {
        reducedMotionBtn.addEventListener('click', () => {
          forceReducedMotion = !forceReducedMotion;
          reducedMotionBtn.textContent = forceReducedMotion ? 'Reduced Motion : Actif' : 'Reduced Motion : Inactif';
          reducedMotionBtn.classList.toggle('active', forceReducedMotion);
          renderCurrentChart();
        });
      }

      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          renderCurrentChart();
        });
      }

      if (sortDescBtn) {
        sortDescBtn.addEventListener('click', () => {
          if (!currentChart) return;
          const pairs = ORIGINAL_DATA.labels.map((l, i) => ({
            label: l,
            score: ORIGINAL_DATA.datasets[0].data[i],
            bench: ORIGINAL_DATA.datasets[1].data[i]
          }));
          pairs.sort((a, b) => b.score - a.score);
          currentChart.data.labels = pairs.map(p => p.label);
          currentChart.data.datasets[0].data = pairs.map(p => p.score);
          currentChart.data.datasets[1].data = pairs.map(p => p.bench);
          currentChart.update();
        });
      }

      if (sortAscBtn) {
        sortAscBtn.addEventListener('click', () => {
          if (!currentChart) return;
          const pairs = ORIGINAL_DATA.labels.map((l, i) => ({
            label: l,
            score: ORIGINAL_DATA.datasets[0].data[i],
            bench: ORIGINAL_DATA.datasets[1].data[i]
          }));
          pairs.sort((a, b) => a.score - b.score);
          currentChart.data.labels = pairs.map(p => p.label);
          currentChart.data.datasets[0].data = pairs.map(p => p.score);
          currentChart.data.datasets[1].data = pairs.map(p => p.bench);
          currentChart.update();
        });
      }

      if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
          if (!currentChart) return;
          const pairs = ORIGINAL_DATA.labels.map((l, i) => ({
            label: l,
            score: ORIGINAL_DATA.datasets[0].data[i],
            bench: ORIGINAL_DATA.datasets[1].data[i]
          }));
          pairs.sort(() => Math.random() - 0.5);
          currentChart.data.labels = pairs.map(p => p.label);
          currentChart.data.datasets[0].data = pairs.map(p => p.score);
          currentChart.data.datasets[1].data = pairs.map(p => p.bench);
          currentChart.update();
        });
      }

      if (filterTopBtn) {
        filterTopBtn.addEventListener('click', () => {
          if (!currentChart) return;
          const pairs = ORIGINAL_DATA.labels.map((l, i) => ({
            label: l,
            score: ORIGINAL_DATA.datasets[0].data[i],
            bench: ORIGINAL_DATA.datasets[1].data[i]
          }));
          pairs.sort((a, b) => b.score - a.score);
          const top4 = pairs.slice(0, 4);
          currentChart.data.labels = top4.map(p => p.label);
          currentChart.data.datasets[0].data = top4.map(p => p.score);
          currentChart.data.datasets[1].data = top4.map(p => p.bench);
          currentChart.update();
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          renderCurrentChart();
        });
      }

      updateTheme('colorbrewer-accessible');
    });`;
  } else if (category === 'animation' && slug.startsWith('0')) {
    containerHtml = `    <!-- Démonstrateur Animation Cognitive -->
    <div id="chartContainer" class="chart-container" style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="position: relative; width: 100%; height: 420px;">
        <canvas id="chartCanvas"></canvas>
      </div>

      <div class="interactive-toolbar" style="display: flex; flex-wrap: wrap; gap: 0.5rem; padding-top: 0.75rem; border-top: 1px solid #E2E8F0; align-items: center;">
        <button class="btn-action btn-primary" id="btnAction1">▶ Lancer Démonstration</button>
        <button class="btn-action" id="btnAction2">Alternative / Reconfiguration</button>
        <button class="btn-action" id="btnAction3">Données Initiales</button>
        <button class="btn-action" id="btnReducedMotion" style="margin-left: auto;">Reduced Motion : Inactif</button>
      </div>
    </div>`;

    scriptBody = `    document.addEventListener('DOMContentLoaded', function() {
      let chartInstance = null;
      let isReducedMotion = false;
      const canvas = document.getElementById('chartCanvas');
      const chartContainer = document.getElementById('chartContainer');
      const rulesCard = document.getElementById('cognitiveRulesCard');
      const themeSwatchesGroup = document.getElementById('themeSwatchesGroup');
      const activeThemeIndicator = document.getElementById('activeThemeIndicator');
      const dataLabelsToggleBtn = document.getElementById('dataLabelsToggleBtn');
      const btnAction1 = document.getElementById('btnAction1');
      const btnAction2 = document.getElementById('btnAction2');
      const btnAction3 = document.getElementById('btnAction3');
      const btnReducedMotion = document.getElementById('btnReducedMotion');
      const tokensEngine = window.KitChartsTheme || (window.KitCharts && window.KitCharts.Theme) || {};

      let currentTheme = 'colorbrewer-accessible';
      let showDataLabels = true;

      const THEME_NAMES = {
        'colorbrewer-accessible': 'ColorBrewer Accessible',
        'viridis-perceptual': 'Viridis Perceptual',
        'paul-tol-scientific': 'Paul Tol Scientific',
        'tableau-stone-categorical': 'Tableau Stone Categorical',
        'okabe-ito-cud': 'Okabe-Ito CUD',
        'tufte-minimalist-executive': 'Tufte Minimalist Executive',
        'nord-cognitive-dark': 'Nord Cognitive Dark',
        'atkinson-hyperlegible': 'Atkinson Hyperlegible'
      };

      const data1 = {
        labels: ["Recherche & Dév.", "Ingénierie Logicielle", "Production & Infra", "Marketing Digital", "Service Client", "Ressources Humaines", "Finance & Audit", "Logistique"],
        datasets: [{ label: "Score d'Efficacité 2026", data: [88, 94, 76, 82, 69, 85, 91, 78] }]
      };
      const data2 = {
        labels: ["R&D", "Logiciel", "Cloud Infra", "Marketing", "Support", "RH", "Audit", "Logistique"],
        datasets: [{ label: "Projection Budgétaire Q4", data: [95, 98, 85, 90, 78, 82, 94, 88] }]
      };

      function renderCurrentChart() {
        if (typeof tokensEngine.loadGoogleFonts === 'function') {
          tokensEngine.loadGoogleFonts(currentTheme);
        }
        let tokens = null;
        if (typeof tokensEngine.applyThemeToContainer === 'function') {
          tokens = tokensEngine.applyThemeToContainer(chartContainer, currentTheme);
        } else if (typeof tokensEngine.getThemeTokens === 'function') {
          tokens = tokensEngine.getThemeTokens(currentTheme);
        }

        if (tokens) {
          document.body.style.backgroundColor = tokens.isDark ? '#242933' : '#F8FAFC';
          document.body.style.color = tokens.textPrimary || '#0F172A';
          if (rulesCard) {
            rulesCard.style.backgroundColor = tokens.surface || '#FFFFFF';
            rulesCard.style.borderColor = tokens.border || '#E2E8F0';
          }
        }

        const mod = window.KitCharts && (window.KitCharts['anim-${slug.substring(3)}'] || window.KitCharts['${slug}'] || window.KitCharts['animation']);
        if (mod && typeof mod.createChart === 'function') {
          if (chartInstance && typeof chartInstance.destroy === 'function') {
            chartInstance.destroy();
          }
          chartInstance = mod.createChart(canvas, JSON.parse(JSON.stringify(data1)), currentTheme, {
            duration: isReducedMotion ? 0 : 750,
            reducedMotion: isReducedMotion,
            showDataLabels: showDataLabels
          });
        }
      }

      function updateTheme(themeName) {
        currentTheme = themeName || 'colorbrewer-accessible';
        setActiveThemeUI(currentTheme);
        renderCurrentChart();
      }

      function setActiveThemeUI(themeName) {
        const swatches = document.querySelectorAll('.theme-swatch');
        swatches.forEach(s => {
          if (s.dataset.themeName === themeName) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
        if (activeThemeIndicator) {
          activeThemeIndicator.textContent = THEME_NAMES[themeName] || themeName;
        }
      }

      if (themeSwatchesGroup) {
        themeSwatchesGroup.addEventListener('click', function(e) {
          const swatch = e.target.closest('.theme-swatch');
          if (swatch && swatch.dataset.themeName) {
            updateTheme(swatch.dataset.themeName);
          }
        });
      }

      if (dataLabelsToggleBtn) {
        dataLabelsToggleBtn.addEventListener('click', function() {
          showDataLabels = !showDataLabels;
          dataLabelsToggleBtn.classList.toggle('active', showDataLabels);
          dataLabelsToggleBtn.setAttribute('aria-pressed', String(showDataLabels));
          dataLabelsToggleBtn.title = showDataLabels ? 'Étiquettes de données (Labels) : Activées' : 'Étiquettes de données (Labels) : Désactivées';
          renderCurrentChart();
        });
      }

      if (btnReducedMotion) {
        btnReducedMotion.addEventListener('click', () => {
          isReducedMotion = !isReducedMotion;
          btnReducedMotion.textContent = isReducedMotion ? 'Reduced Motion : Actif' : 'Reduced Motion : Inactif';
          btnReducedMotion.classList.toggle('active', isReducedMotion);
          renderCurrentChart();
        });
      }

      if (btnAction1) {
        btnAction1.addEventListener('click', () => {
          if (!chartInstance) return;
          const mod = window.KitCharts && (window.KitCharts['anim-${slug.substring(3)}'] || window.KitCharts['${slug}'] || window.KitCharts['animation']);
          if (mod && typeof mod.playTransition === 'function') {
            mod.playTransition(chartInstance, data2, { reducedMotion: isReducedMotion });
          } else {
            chartInstance.data.labels = [...data2.labels];
            chartInstance.data.datasets[0].data = [...data2.datasets[0].data];
            chartInstance.update();
          }
        });
      }

      if (btnAction2) {
        btnAction2.addEventListener('click', () => {
          if (!chartInstance) return;
          const nextType = chartInstance.config.type === 'bar' ? 'line' : 'bar';
          chartInstance.config.type = nextType;
          chartInstance.update();
        });
      }

      if (btnAction3) {
        btnAction3.addEventListener('click', () => {
          renderCurrentChart();
        });
      }

      updateTheme('colorbrewer-accessible');
    });`;
  } else if (category === 'tooltip') {
    containerHtml = `    <!-- Démonstrateur Laboratoire Tooltips -->
    <div id="chartContainer" class="chart-container" style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="position: relative; width: 100%; height: 420px;">
        <canvas id="tooltipDemoCanvas"></canvas>
      </div>

      <div class="interactive-toolbar" style="display: flex; flex-wrap: wrap; gap: 0.5rem; padding-top: 0.75rem; border-top: 1px solid #E2E8F0; align-items: center;">
        <button class="btn-action btn-primary" id="randomizeBtn">🎲 Données Aléatoires</button>
      </div>
    </div>`;

    scriptBody = `    document.addEventListener('DOMContentLoaded', function() {
      const canvas = document.getElementById('tooltipDemoCanvas');
      const chartContainer = document.getElementById('chartContainer');
      const rulesCard = document.getElementById('cognitiveRulesCard');
      const themeSwatchesGroup = document.getElementById('themeSwatchesGroup');
      const activeThemeIndicator = document.getElementById('activeThemeIndicator');
      const dataLabelsToggleBtn = document.getElementById('dataLabelsToggleBtn');
      const randomizeBtn = document.getElementById('randomizeBtn');
      const tokensEngine = window.KitChartsTheme || (window.KitCharts && window.KitCharts.Theme) || {};

      let currentChart = null;
      let currentTheme = 'colorbrewer-accessible';
      let showDataLabels = true;

      const THEME_NAMES = {
        'colorbrewer-accessible': 'ColorBrewer Accessible',
        'viridis-perceptual': 'Viridis Perceptual',
        'paul-tol-scientific': 'Paul Tol Scientific',
        'tableau-stone-categorical': 'Tableau Stone Categorical',
        'okabe-ito-cud': 'Okabe-Ito CUD',
        'tufte-minimalist-executive': 'Tufte Minimalist Executive',
        'nord-cognitive-dark': 'Nord Cognitive Dark',
        'atkinson-hyperlegible': 'Atkinson Hyperlegible'
      };

      function renderCurrentChart() {
        if (typeof tokensEngine.loadGoogleFonts === 'function') {
          tokensEngine.loadGoogleFonts(currentTheme);
        }
        let tokens = null;
        if (typeof tokensEngine.applyThemeToContainer === 'function') {
          tokens = tokensEngine.applyThemeToContainer(chartContainer, currentTheme);
        } else if (typeof tokensEngine.getThemeTokens === 'function') {
          tokens = tokensEngine.getThemeTokens(currentTheme);
        }

        if (tokens) {
          document.body.style.backgroundColor = tokens.isDark ? '#242933' : '#F8FAFC';
          document.body.style.color = tokens.textPrimary || '#0F172A';
          if (rulesCard) {
            rulesCard.style.backgroundColor = tokens.surface || '#FFFFFF';
            rulesCard.style.borderColor = tokens.border || '#E2E8F0';
          }
        }

        if (window.KitCharts && window.KitCharts['tooltip']) {
          currentChart = window.KitCharts['tooltip'].createChart(
            canvas,
            null,
            currentTheme,
            { tooltipMode: 'nearest', intersect: false, showDataLabels: showDataLabels }
          );
        }
      }

      function updateTheme(themeName) {
        currentTheme = themeName || 'colorbrewer-accessible';
        setActiveThemeUI(currentTheme);
        renderCurrentChart();
      }

      function setActiveThemeUI(themeName) {
        const swatches = document.querySelectorAll('.theme-swatch');
        swatches.forEach(s => {
          if (s.dataset.themeName === themeName) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
        if (activeThemeIndicator) {
          activeThemeIndicator.textContent = THEME_NAMES[themeName] || themeName;
        }
      }

      if (themeSwatchesGroup) {
        themeSwatchesGroup.addEventListener('click', function(e) {
          const swatch = e.target.closest('.theme-swatch');
          if (swatch && swatch.dataset.themeName) {
            updateTheme(swatch.dataset.themeName);
          }
        });
      }

      if (dataLabelsToggleBtn) {
        dataLabelsToggleBtn.addEventListener('click', function() {
          showDataLabels = !showDataLabels;
          dataLabelsToggleBtn.classList.toggle('active', showDataLabels);
          dataLabelsToggleBtn.setAttribute('aria-pressed', String(showDataLabels));
          dataLabelsToggleBtn.title = showDataLabels ? 'Étiquettes de données (Labels) : Activées' : 'Étiquettes de données (Labels) : Désactivées';
          renderCurrentChart();
        });
      }

      if (randomizeBtn) {
        randomizeBtn.addEventListener('click', () => {
          if (!currentChart) return;
          const newCA = [
            Math.round(350 + Math.random() * 400),
            Math.round(400 + Math.random() * 400),
            Math.round(450 + Math.random() * 400),
            Math.round(500 + Math.random() * 400),
            Math.round(520 + Math.random() * 400),
            Math.round(600 + Math.random() * 400),
            Math.round(680 + Math.random() * 400),
            Math.round(750 + Math.random() * 400)
          ];
          currentChart.data.datasets[0].data = newCA;
          currentChart.update();
        });
      }

      updateTheme('colorbrewer-accessible');
    });`;
  } else if (slug === 'candlestick-volume') {
    containerHtml = `    <!-- Conteneur Graphique Double Fenêtre (70% Prix / 30% Volume) -->
    <div id="chartContainer" class="chart-container" style="height: 480px; display: flex; flex-direction: column; gap: 0.5rem;">
      <div style="flex: 7; position: relative; min-height: 0;">
        <canvas id="chartCanvas"></canvas>
      </div>
      <div style="flex: 3; position: relative; min-height: 0;">
        <canvas id="volumeCanvas"></canvas>
      </div>
    </div>`;

    scriptBody = `    document.addEventListener('DOMContentLoaded', function() {
      const canvasId = 'chartCanvas';
      const chartContainer = document.getElementById('chartContainer');
      const rulesCard = document.getElementById('cognitiveRulesCard');
      const themeSwatchesGroup = document.getElementById('themeSwatchesGroup');
      const activeThemeIndicator = document.getElementById('activeThemeIndicator');
      const dataLabelsToggleBtn = document.getElementById('dataLabelsToggleBtn');
      const tokensEngine = window.KitChartsTheme || (window.KitCharts && window.KitCharts.Theme) || {};
      let currentTheme = 'colorbrewer-accessible';
      let showDataLabels = true;

      const THEME_NAMES = {
        'colorbrewer-accessible': 'ColorBrewer Accessible',
        'viridis-perceptual': 'Viridis Perceptual',
        'paul-tol-scientific': 'Paul Tol Scientific',
        'tableau-stone-categorical': 'Tableau Stone Categorical',
        'okabe-ito-cud': 'Okabe-Ito CUD',
        'tufte-minimalist-executive': 'Tufte Minimalist Executive',
        'nord-cognitive-dark': 'Nord Cognitive Dark',
        'atkinson-hyperlegible': 'Atkinson Hyperlegible'
      };

      function renderCurrentChart() {
        const chartModule = (window.KitCharts && window.KitCharts['${slug}']) || window;
        if (typeof chartModule.createChart === 'function') {
          const chartData = chartModule.DEFAULT_DATA ? { ...chartModule.DEFAULT_DATA, showDataLabels } : null;
          chartModule.createChart(canvasId, chartData, currentTheme, { showDataLabels, volumeCanvasId: 'volumeCanvas' });
        }
      }

      function updateTheme(themeName) {
        currentTheme = themeName || 'colorbrewer-accessible';
        if (typeof tokensEngine.loadGoogleFonts === 'function') {
          tokensEngine.loadGoogleFonts(currentTheme);
        }
        let tokens = null;
        if (typeof tokensEngine.applyThemeToContainer === 'function') {
          tokens = tokensEngine.applyThemeToContainer(chartContainer, currentTheme);
        } else if (typeof tokensEngine.getThemeTokens === 'function') {
          tokens = tokensEngine.getThemeTokens(currentTheme);
        }

        if (tokens) {
          document.body.style.backgroundColor = tokens.isDark ? '#242933' : '#F8FAFC';
          document.body.style.color = tokens.textPrimary || '#0F172A';
          if (rulesCard) {
            rulesCard.style.backgroundColor = tokens.surface || '#FFFFFF';
            rulesCard.style.borderColor = tokens.border || '#E2E8F0';
          }
        }

        setActiveThemeUI(currentTheme);
        renderCurrentChart();
      }

      function setActiveThemeUI(themeName) {
        const swatches = document.querySelectorAll('.theme-swatch');
        swatches.forEach(s => {
          if (s.dataset.themeName === themeName) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
        if (activeThemeIndicator) {
          activeThemeIndicator.textContent = THEME_NAMES[themeName] || themeName;
        }
      }

      if (themeSwatchesGroup) {
        themeSwatchesGroup.addEventListener('click', function(e) {
          const swatch = e.target.closest('.theme-swatch');
          if (swatch && swatch.dataset.themeName) {
            updateTheme(swatch.dataset.themeName);
          }
        });
      }

      if (dataLabelsToggleBtn) {
        dataLabelsToggleBtn.addEventListener('click', function() {
          showDataLabels = !showDataLabels;
          dataLabelsToggleBtn.classList.toggle('active', showDataLabels);
          dataLabelsToggleBtn.setAttribute('aria-pressed', String(showDataLabels));
          dataLabelsToggleBtn.title = showDataLabels ? 'Étiquettes de données (Labels) : Activées' : 'Étiquettes de données (Labels) : Désactivées';
          renderCurrentChart();
        });
      }

      updateTheme('colorbrewer-accessible');
    });`;
  } else {
    // Template standard Chart.js (bar, line, scatter, doughnut, radar, etc.)
    containerHtml = `    <!-- Conteneur Graphique -->
    <div id="chartContainer" class="chart-container">
      <canvas id="chartCanvas"></canvas>
    </div>`;

    scriptBody = `    document.addEventListener('DOMContentLoaded', function() {
      const canvasId = 'chartCanvas';
      const chartContainer = document.getElementById('chartContainer');
      const rulesCard = document.getElementById('cognitiveRulesCard');
      const themeSwatchesGroup = document.getElementById('themeSwatchesGroup');
      const activeThemeIndicator = document.getElementById('activeThemeIndicator');
      const dataLabelsToggleBtn = document.getElementById('dataLabelsToggleBtn');
      const tokensEngine = window.KitChartsTheme || (window.KitCharts && window.KitCharts.Theme) || {};
      let currentTheme = 'colorbrewer-accessible';
      let showDataLabels = true;

      const THEME_NAMES = {
        'colorbrewer-accessible': 'ColorBrewer Accessible',
        'viridis-perceptual': 'Viridis Perceptual',
        'paul-tol-scientific': 'Paul Tol Scientific',
        'tableau-stone-categorical': 'Tableau Stone Categorical',
        'okabe-ito-cud': 'Okabe-Ito CUD',
        'tufte-minimalist-executive': 'Tufte Minimalist Executive',
        'nord-cognitive-dark': 'Nord Cognitive Dark',
        'atkinson-hyperlegible': 'Atkinson Hyperlegible'
      };

      function renderCurrentChart() {
        const chartModule = (window.KitCharts && window.KitCharts['${slug}']) || window;
        if (typeof chartModule.createChart === 'function') {
          const chartData = chartModule.DEFAULT_DATA ? { ...chartModule.DEFAULT_DATA, showDataLabels } : null;
          chartModule.createChart(canvasId, chartData, currentTheme, { showDataLabels });
        }
      }

      function updateTheme(themeName) {
        currentTheme = themeName || 'colorbrewer-accessible';
        if (typeof tokensEngine.loadGoogleFonts === 'function') {
          tokensEngine.loadGoogleFonts(currentTheme);
        }
        let tokens = null;
        if (typeof tokensEngine.applyThemeToContainer === 'function') {
          tokens = tokensEngine.applyThemeToContainer(chartContainer, currentTheme);
        } else if (typeof tokensEngine.getThemeTokens === 'function') {
          tokens = tokensEngine.getThemeTokens(currentTheme);
        }

        if (tokens) {
          document.body.style.backgroundColor = tokens.isDark ? '#242933' : '#F8FAFC';
          document.body.style.color = tokens.textPrimary || '#0F172A';
          if (rulesCard) {
            rulesCard.style.backgroundColor = tokens.surface || '#FFFFFF';
            rulesCard.style.borderColor = tokens.border || '#E2E8F0';
          }
        }

        setActiveThemeUI(currentTheme);
        renderCurrentChart();
      }

      function setActiveThemeUI(themeName) {
        const swatches = document.querySelectorAll('.theme-swatch');
        swatches.forEach(s => {
          if (s.dataset.themeName === themeName) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
        if (activeThemeIndicator) {
          activeThemeIndicator.textContent = THEME_NAMES[themeName] || themeName;
        }
      }

      if (themeSwatchesGroup) {
        themeSwatchesGroup.addEventListener('click', function(e) {
          const swatch = e.target.closest('.theme-swatch');
          if (swatch && swatch.dataset.themeName) {
            updateTheme(swatch.dataset.themeName);
          }
        });
      }

      if (dataLabelsToggleBtn) {
        dataLabelsToggleBtn.addEventListener('click', function() {
          showDataLabels = !showDataLabels;
          dataLabelsToggleBtn.classList.toggle('active', showDataLabels);
          dataLabelsToggleBtn.setAttribute('aria-pressed', String(showDataLabels));
          dataLabelsToggleBtn.title = showDataLabels ? 'Étiquettes de données (Labels) : Activées' : 'Étiquettes de données (Labels) : Désactivées';
          renderCurrentChart();
        });
      }

      updateTheme('colorbrewer-accessible');
    });`;
  }

  // Template HTML global
  const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — kit-charts</title>
  <!-- Google Fonts pour tous les thèmes -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Fira+Code:wght@400;500;600&family=Fira+Sans:wght@400;500;600;700&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Roboto+Mono:wght@400;500;700&family=Roboto:wght@400;500;700&family=Source+Code+Pro:wght@400;500;600&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet">
  <!-- Chart.js v4.4.7 CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
  ${pluginScripts ? pluginScripts + '\n  ' : ''}<!-- Theme Tokens & Template -->
  <script src="${themeTokensPath}"></script>
  <script src="./template.js"></script>
  <style>
${CSS_BLOCK}
  </style>
</head>
<body>
  <div class="wrapper">
    <div>
      <div class="breadcrumb">
        <a href="${indexPath}">← kit-charts</a> / <a href="${indexPath}#gallerySection">${breadcrumbCat}</a> / ${slug}
      </div>
      <div class="header-panel">
        <div class="title-group">
          <h1>${title}</h1>
          <p>${subtitle}</p>
        </div>
        <div class="controls-group">
          <div class="toolbar-theme-label"><span>🎨</span> Thème :</div>
          <div class="theme-swatches-group" id="themeSwatchesGroup" role="radiogroup" aria-label="Sélection du thème colorimétrique">
            <button type="button" class="theme-swatch active" data-theme-name="colorbrewer-accessible" style="background: linear-gradient(135deg, #2B8CBE 50%, #E66101 50%);" title="01. ColorBrewer Accessible" aria-label="Thème ColorBrewer Accessible"></button>
            <button type="button" class="theme-swatch" data-theme-name="viridis-perceptual" style="background: linear-gradient(135deg, #3E4A89 50%, #35B779 50%);" title="02. Viridis Perceptual" aria-label="Thème Viridis Perceptual"></button>
            <button type="button" class="theme-swatch" data-theme-name="paul-tol-scientific" style="background: linear-gradient(135deg, #4477AA 50%, #CC6677 50%);" title="03. Paul Tol Scientific" aria-label="Thème Paul Tol Scientific"></button>
            <button type="button" class="theme-swatch" data-theme-name="tableau-stone-categorical" style="background: linear-gradient(135deg, #4E79A7 50%, #F28E2B 50%);" title="04. Tableau Stone Categorical" aria-label="Thème Tableau Stone"></button>
            <button type="button" class="theme-swatch" data-theme-name="okabe-ito-cud" style="background: linear-gradient(135deg, #E69F00 50%, #56B4E9 50%);" title="05. Okabe-Ito CUD" aria-label="Thème Okabe-Ito CUD"></button>
            <button type="button" class="theme-swatch" data-theme-name="tufte-minimalist-executive" style="background: linear-gradient(135deg, #111111 50%, #B22222 50%);" title="06. Tufte Minimalist Executive" aria-label="Thème Tufte Minimalist"></button>
            <button type="button" class="theme-swatch" data-theme-name="nord-cognitive-dark" style="background: linear-gradient(135deg, #2E3440 50%, #88C0D0 50%);" title="07. Nord Cognitive Dark" aria-label="Thème Nord Cognitive Dark"></button>
            <button type="button" class="theme-swatch" data-theme-name="atkinson-hyperlegible" style="background: linear-gradient(135deg, #000000 50%, #005A9C 50%);" title="08. Atkinson Hyperlegible" aria-label="Thème Atkinson Hyperlegible"></button>
          </div>
          <div id="activeThemeIndicator" class="active-theme-name-tag">ColorBrewer Accessible</div>${supportsDataLabels ? `

          <!-- Bouton Dessin de Label en Surbrillance -->
          <button id="dataLabelsToggleBtn" class="btn-label-toggle active" type="button" aria-pressed="true" title="Étiquettes de données (Labels) : Activées" aria-label="Activer ou désactiver les étiquettes de données">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <circle cx="7" cy="7" r="1.5" fill="currentColor"></circle>
            </svg>
          </button>` : ''}
        </div>
      </div>
    </div>

${containerHtml}

    <!-- Synthèse des Recommandations & Règles Cognitives -->
    <div id="cognitiveRulesCard" class="cognitive-rules-card">
      <div class="rule-item">
        <h3>✅ Quand l'utiliser</h3>
        <p><strong>Cas d'usage :</strong> ${ruleInfo.usage}</p>
      </div>
      <div class="rule-item">
        <h3>❌ Quand NE PAS l'utiliser</h3>
        <p><strong>Contre-indications :</strong> ${ruleInfo.avoid}</p>
      </div>
    </div>
  </div>

  <!-- Intégration Modulaire UMD -->
  <script>
${scriptBody}
  </script>
</body>
</html>
`;

  fs.writeFileSync(filePath, htmlContent, 'utf8');
  generatedCount++;
}

console.log(`✅ ${generatedCount} fichiers preview.html régénérés avec succès !`);
