/**
 * @file test/fixtures/datasets.js
 * @description Standard mock datasets and boundary test dataset generators for all 46 kit-charts dataviz types.
 * Supports standard mock data, empty datasets, 1-item datasets, massive datasets (500+ items),
 * and extreme/negative/decimal value sets.
 */

import { getSyntheticChoroplethData, getSyntheticBubbleMapData } from './geo-fixtures.js';

/**
 * Generates standard deterministic mock data for any chart type.
 * @param {string} chartId - Chart identifier slug
 * @param {Object} [tokens] - Theme tokens object
 * @returns {Object}
 */
export function getStandardDataset(chartId, tokens = {}) {
  const palette = tokens.palette || ['#2B8CBE', '#E66101', '#5E3C99', '#4DAC26', '#D01C8B', '#FDB863', '#B8E186', '#999999'];

  switch (chartId) {
    // 01-comparaison (10)
    case 'bar-chart-vertical':
      return {
        labels: ['France', 'Allemagne', 'Royaume-Uni', 'Italie', 'Espagne', 'Pays-Bas', 'Belgique'],
        datasets: [{
          label: 'PIB (Mds €)',
          data: [2800, 2600, 2400, 1900, 1400, 950, 520],
          backgroundColor: palette[0]
        }]
      };

    case 'bar-chart-horizontal':
      return {
        labels: ['Tokyo', 'Delhi', 'Shanghai', 'São Paulo', 'Mexico', 'Le Caire', 'Mumbai', 'Pékin'],
        datasets: [{
          label: 'Population (Millions)',
          data: [37.4, 32.9, 29.2, 22.6, 22.3, 22.2, 21.3, 21.3],
          backgroundColor: palette[0]
        }]
      };

    case 'grouped-bar-chart':
      return {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
          { label: '2024', data: [120, 150, 180, 210], backgroundColor: palette[0] },
          { label: '2025', data: [140, 175, 210, 260], backgroundColor: palette[1] },
          { label: '2026', data: [160, 205, 245, 310], backgroundColor: palette[2] }
        ]
      };

    case 'stacked-bar-chart':
      return {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        datasets: [
          { label: 'Direct', data: [45, 52, 58, 62, 70, 75], backgroundColor: palette[0] },
          { label: 'Organique', data: [30, 35, 40, 48, 55, 60], backgroundColor: palette[1] },
          { label: 'Payant', data: [20, 25, 28, 30, 32, 35], backgroundColor: palette[2] }
        ]
      };

    case 'bullet-chart':
      return {
        labels: ['Ventes EMEA', 'Ventes APAC', 'Ventes AMER'],
        datasets: [
          { label: 'Réalisé', data: [275, 185, 310], backgroundColor: palette[0] },
          { label: 'Objectif', data: [250, 200, 300], backgroundColor: '#111827', type: 'scatter', pointStyle: 'line' },
          { label: 'Excellent', data: [300, 250, 350], backgroundColor: 'rgba(0,0,0,0.06)' },
          { label: 'Moyen', data: [200, 150, 250], backgroundColor: 'rgba(0,0,0,0.12)' },
          { label: 'Faible', data: [100, 75, 120], backgroundColor: 'rgba(0,0,0,0.18)' }
        ]
      };

    case 'lollipop-chart':
      return {
        labels: ['Python', 'JavaScript', 'TypeScript', 'Rust', 'Go', 'Java', 'C++'],
        datasets: [{
          label: 'Popularité Index (%)',
          data: [88.5, 82.4, 76.1, 68.9, 64.2, 58.0, 52.3],
          backgroundColor: palette[0],
          borderColor: palette[0]
        }]
      };

    case 'slope-chart':
      return {
        labels: ['2020', '2025'],
        datasets: [
          { label: 'Énergie Renouvelable', data: [21.5, 38.2], borderColor: palette[0] },
          { label: 'Nucléaire', data: [40.1, 35.8], borderColor: palette[1] },
          { label: 'Gaz Naturel', data: [25.4, 18.2], borderColor: palette[2] },
          { label: 'Charbon', data: [13.0, 7.8], borderColor: palette[3] }
        ]
      };

    case 'dumbbell-chart':
      return {
        labels: ['Santé', 'Éducation', 'Défense', 'Infrastructures', 'Recherche'],
        datasets: [
          { label: 'Budget Initial', data: [45, 38, 32, 28, 15], backgroundColor: palette[1] },
          { label: 'Budget Final', data: [58, 46, 39, 31, 24], backgroundColor: palette[0] }
        ]
      };

    case 'radar-chart':
      return {
        labels: ['Vitesse', 'Fiabilité', 'Sécurité', 'Scalabilité', 'Ergonomie', 'Documentation'],
        datasets: [
          { label: 'Plateforme A', data: [85, 92, 90, 78, 88, 95], backgroundColor: 'rgba(43, 140, 190, 0.2)', borderColor: palette[0] },
          { label: 'Plateforme B', data: [70, 80, 85, 92, 75, 80], backgroundColor: 'rgba(230, 97, 1, 0.2)', borderColor: palette[1] }
        ]
      };

    case 'polar-area-chart':
      return {
        labels: ['Nord', 'Nord-Est', 'Est', 'Sud-Est', 'Sud', 'Sud-Ouest', 'Ouest', 'Nord-Ouest'],
        datasets: [{
          data: [42, 28, 35, 18, 50, 32, 45, 22],
          backgroundColor: palette.slice(0, 8)
        }]
      };

    // 02-composition-part-to-whole (6)
    case 'pie-chart':
      return {
        labels: ['Mobile', 'Desktop', 'Tablette'],
        datasets: [{
          data: [58.5, 36.2, 5.3],
          backgroundColor: [palette[0], palette[1], palette[2]]
        }]
      };

    case 'doughnut-chart':
      return {
        labels: ['Abonnement Pro', 'Abonnement Ent.', 'Usage à l’acte', 'Services Pro'],
        datasets: [{
          data: [45, 30, 15, 10],
          backgroundColor: palette.slice(0, 4)
        }]
      };

    case 'treemap':
      return {
        datasets: [{
          tree: [
            { category: 'Tech', name: 'Software', value: 450 },
            { category: 'Tech', name: 'Hardware', value: 320 },
            { category: 'Tech', name: 'Cloud', value: 280 },
            { category: 'Finance', name: 'Banque', value: 390 },
            { category: 'Finance', name: 'Assurance', value: 210 },
            { category: 'Santé', name: 'Pharma', value: 310 },
            { category: 'Santé', name: 'Biotech', value: 160 }
          ],
          key: 'value',
          groups: ['category', 'name'],
          backgroundColor: (ctx) => palette[ctx.dataIndex % palette.length]
        }]
      };

    case 'sunburst':
      return {
        labels: ['Monde > Europe', 'Monde > Amériques', 'Monde > Asie', 'Monde > Autres'],
        datasets: [
          { data: [40, 30, 20, 10], backgroundColor: palette.slice(0, 4) },
          { data: [20, 20, 15, 15, 12, 8, 6, 4], backgroundColor: palette.slice(0, 8) }
        ]
      };

    case 'waffle-chart':
      return {
        datasets: [{
          label: 'Progression des Objectifs (%)',
          data: Array.from({ length: 100 }, (_, i) => ({
            x: (i % 10) + 1,
            y: Math.floor(i / 10) + 1,
            v: i < 68 ? 1 : 0
          }))
        }]
      };

    case 'stacked-bar-100':
      return {
        labels: ['Équipe A', 'Équipe B', 'Équipe C', 'Équipe D'],
        datasets: [
          { label: 'Succès', data: [75, 60, 82, 90], backgroundColor: palette[0] },
          { label: 'En cours', data: [15, 25, 10, 5], backgroundColor: palette[1] },
          { label: 'Échec', data: [10, 15, 8, 5], backgroundColor: palette[2] }
        ]
      };

    // 03-distribution (6)
    case 'histogramme':
      return {
        labels: ['[0-10[', '[10-20[', '[20-30[', '[30-40[', '[40-50[', '[50-60[', '[60-70[', '[70-80['],
        datasets: [{
          label: 'Fréquence',
          data: [4, 12, 28, 45, 38, 22, 9, 3],
          backgroundColor: palette[0]
        }]
      };

    case 'density-plot':
      return {
        labels: Array.from({ length: 50 }, (_, i) => (i * 2).toString()),
        datasets: [{
          label: 'Densité de Probabilité (KDE)',
          data: Array.from({ length: 50 }, (_, i) => {
            const x = i * 2;
            return (1 / (15 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - 50) / 15, 2));
          }),
          borderColor: palette[0],
          fill: 'origin'
        }]
      };

    case 'box-plot':
      return {
        labels: ['Groupe Contrôle', 'Traitement A', 'Traitement B', 'Placebo'],
        datasets: [{
          label: 'Distribution Biomarqueur',
          data: [
            { min: 12, q1: 18, median: 24, q3: 31, max: 42, outliers: [48] },
            { min: 19, q1: 28, median: 36, q3: 44, max: 55, outliers: [] },
            { min: 22, q1: 34, median: 42, q3: 50, max: 62, outliers: [14, 68] },
            { min: 10, q1: 16, median: 22, q3: 29, max: 38, outliers: [] }
          ],
          backgroundColor: 'rgba(43, 140, 190, 0.4)',
          borderColor: palette[0]
        }]
      };

    case 'strip-plot':
      return {
        datasets: [
          {
            label: 'Condition Alpha',
            data: Array.from({ length: 30 }, () => ({
              x: 1 + (Math.random() - 0.5) * 0.25,
              y: 20 + Math.random() * 50
            })),
            backgroundColor: palette[0]
          },
          {
            label: 'Condition Bêta',
            data: Array.from({ length: 30 }, () => ({
              x: 2 + (Math.random() - 0.5) * 0.25,
              y: 35 + Math.random() * 45
            })),
            backgroundColor: palette[1]
          }
        ]
      };

    case 'beeswarm-plot':
      return {
        datasets: [{
          label: 'Scores Cohorte',
          data: Array.from({ length: 40 }, (_, i) => ({
            x: (i % 5 - 2) * 0.1,
            y: 30 + (i * 1.5) + (Math.sin(i) * 5)
          })),
          backgroundColor: palette[0]
        }]
      };

    case 'distribution-heatmap':
      return {
        datasets: [{
          label: 'Densité Bivariée',
          data: Array.from({ length: 25 }, (_, i) => ({
            x: (i % 5) + 1,
            y: Math.floor(i / 5) + 1,
            v: Math.floor(Math.random() * 100)
          }))
        }]
      };

    // 04-correlation-relation (5)
    case 'scatter-plot':
      return {
        datasets: [{
          label: 'Corrélation Dépenses R&D vs Croissance',
          data: [
            { x: 2.1, y: 4.5 }, { x: 3.4, y: 6.2 }, { x: 4.8, y: 7.9 }, { x: 5.5, y: 8.4 },
            { x: 6.2, y: 9.1 }, { x: 7.1, y: 11.2 }, { x: 8.0, y: 12.8 }, { x: 9.5, y: 14.5 }
          ],
          backgroundColor: palette[0]
        }]
      };

    case 'bubble-chart':
      return {
        datasets: [{
          label: 'Marchés Mondiaux (PIB, Croissance, Population)',
          data: [
            { x: 25, y: 3.2, r: 18 },
            { x: 18, y: 5.4, r: 24 },
            { x: 12, y: 6.8, r: 14 },
            { x: 8, y: 2.1, r: 9 },
            { x: 5, y: 4.0, r: 12 }
          ],
          backgroundColor: 'rgba(43, 140, 190, 0.6)'
        }]
      };

    case 'matrix-heatmap':
      return {
        datasets: [{
          label: 'Matrice de Corrélation',
          data: [
            { x: 'Actif A', y: 'Actif A', v: 1.0 }, { x: 'Actif A', y: 'Actif B', v: 0.72 }, { x: 'Actif A', y: 'Actif C', v: -0.45 },
            { x: 'Actif B', y: 'Actif A', v: 0.72 }, { x: 'Actif B', y: 'Actif B', v: 1.0 }, { x: 'Actif B', y: 'Actif C', v: -0.18 },
            { x: 'Actif C', y: 'Actif A', v: -0.45 }, { x: 'Actif C', y: 'Actif B', v: -0.18 }, { x: 'Actif C', y: 'Actif C', v: 1.0 }
          ]
        }]
      };

    case 'connected-scatter-plot':
      return {
        datasets: [{
          label: 'Trajectoire Prix vs Demande (2015-2024)',
          data: [
            { x: 100, y: 200, year: 2015 },
            { x: 105, y: 190, year: 2016 },
            { x: 115, y: 175, year: 2017 },
            { x: 130, y: 150, year: 2018 },
            { x: 125, y: 160, year: 2019 },
            { x: 140, y: 140, year: 2020 },
            { x: 155, y: 120, year: 2021 },
            { x: 170, y: 110, year: 2022 },
            { x: 165, y: 115, year: 2023 },
            { x: 180, y: 95, year: 2024 }
          ],
          borderColor: palette[0],
          showLine: true
        }]
      };

    case 'density-2d-hexbin':
      return {
        datasets: [{
          label: 'Densité Hexbin',
          data: Array.from({ length: 40 }, (_, i) => ({
            x: (i % 8) * 10 + 5,
            y: Math.floor(i / 8) * 10 + 5,
            v: Math.floor(Math.random() * 200) + 10
          }))
        }]
      };

    // 05-evolution-temporelle (7)
    case 'line-chart':
      return {
        labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        datasets: [{
          label: 'Revenu Récurrent Annuel (M€)',
          data: [12.4, 18.2, 25.8, 36.1, 49.5, 67.2, 89.0],
          borderColor: palette[0]
        }]
      };

    case 'multi-line-chart':
      return {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8'],
        datasets: [
          { label: 'Produit Core', data: [100, 115, 125, 140, 155, 170, 190, 210], borderColor: palette[0] },
          { label: 'Produit Cloud', data: [30, 45, 65, 90, 120, 160, 205, 260], borderColor: palette[1] },
          { label: 'Produit Legacy', data: [80, 78, 72, 65, 58, 50, 42, 35], borderColor: palette[2] }
        ]
      };

    case 'area-chart':
      return {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
        datasets: [{
          label: 'Trafic Mensuel (To)',
          data: [120, 135, 150, 165, 180, 210, 240, 260, 290, 310, 340, 380],
          borderColor: palette[0],
          fill: 'origin'
        }]
      };

    case 'stacked-area-chart':
      return {
        labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
        datasets: [
          { label: 'Éolien', data: [45, 55, 68, 85, 105, 130], borderColor: palette[0], fill: true },
          { label: 'Solaire', data: [25, 38, 54, 75, 100, 135], borderColor: palette[1], fill: true },
          { label: 'Hydro', data: [60, 62, 58, 64, 60, 63], borderColor: palette[2], fill: true }
        ]
      };

    case 'streamgraph':
      return {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'],
        datasets: [
          { label: 'Flux A', data: [20, 35, 45, 60, 50, 40, 30], borderColor: palette[0], fill: true },
          { label: 'Flux B', data: [15, 25, 30, 45, 55, 60, 50], borderColor: palette[1], fill: true },
          { label: 'Flux C', data: [30, 20, 15, 25, 35, 45, 40], borderColor: palette[2], fill: true }
        ]
      };

    case 'candlestick-ohlc':
      return {
        datasets: [{
          label: 'Action TECH (OHLC)',
          data: [
            { x: new Date('2025-01-01').getTime(), o: 150, h: 158, l: 148, c: 155 },
            { x: new Date('2025-01-02').getTime(), o: 155, h: 162, l: 153, c: 160 },
            { x: new Date('2025-01-03').getTime(), o: 160, h: 161, l: 152, c: 154 },
            { x: new Date('2025-01-04').getTime(), o: 154, h: 159, l: 150, c: 157 },
            { x: new Date('2025-01-05').getTime(), o: 157, h: 166, l: 156, c: 164 }
          ]
        }]
      };

    case 'sparkline':
      return {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [{
          label: 'Trend',
          data: [12, 14, 11, 16, 18, 15, 20, 24, 22, 28],
          borderColor: palette[0]
        }]
      };

    // 06-flux-processus (5)
    case 'sankey-diagram':
      return {
        datasets: [{
          label: 'Flux Énergétique',
          data: [
            { from: 'Nucléaire', to: 'Électricité', flow: 65 },
            { from: 'Renouvelable', to: 'Électricité', flow: 35 },
            { from: 'Électricité', to: 'Résidentiel', flow: 45 },
            { from: 'Électricité', to: 'Industrie', flow: 35 },
            { from: 'Électricité', to: 'Pertes Réseau', flow: 20 }
          ]
        }]
      };

    case 'chord-diagram':
      return {
        labels: ['Région Nord', 'Région Sud', 'Région Est', 'Région Ouest'],
        matrix: [
          [0, 25, 18, 12],
          [20, 0, 15, 30],
          [14, 16, 0, 22],
          [10, 28, 20, 0]
        ],
        datasets: [{
          label: 'Échanges Inter-Régionaux',
          data: [
            { from: 'Région Nord', to: 'Région Sud', value: 25 },
            { from: 'Région Sud', to: 'Région Ouest', value: 30 },
            { from: 'Région Est', to: 'Région Ouest', value: 22 }
          ]
        }]
      };

    case 'funnel-chart':
      return {
        labels: ['Visiteurs Uniques', 'Inscriptions', 'Utilisateurs Actifs', 'Abonnés Payants', 'Renouvellements'],
        datasets: [{
          label: 'Entonnoir de Conversion',
          data: [10000, 3200, 1450, 480, 390],
          backgroundColor: palette.slice(0, 5)
        }]
      };

    case 'waterfall-chart':
      return {
        labels: ['EBITDA Initial', 'Croissance Ventes', 'Nouveaux Produits', 'Hausse Coûts', 'Charges Admin', 'EBITDA Final'],
        datasets: [{
          label: 'Variation EBITDA (M€)',
          data: [
            [0, 100],
            [100, 135],
            [135, 155],
            [155, 125],
            [125, 110],
            [0, 110]
          ],
          backgroundColor: [
            palette[7],
            tokens.semantic?.positive || '#2E7D32',
            tokens.semantic?.positive || '#2E7D32',
            tokens.semantic?.negative || '#C62828',
            tokens.semantic?.negative || '#C62828',
            palette[0]
          ]
        }]
      };

    case 'alluvial-diagram':
      return {
        datasets: [{
          label: 'Parcours Utilisateurs',
          data: [
            { from: 'Acquisition Organique', to: 'Plan Gratuit', flow: 500 },
            { from: 'Acquisition Payante', to: 'Plan Pro', flow: 300 },
            { from: 'Plan Gratuit', to: 'Désabonné', flow: 200 },
            { from: 'Plan Gratuit', to: 'Plan Pro', flow: 300 },
            { from: 'Plan Pro', to: 'Plan Entreprise', flow: 150 }
          ]
        }]
      };

    // 07-hierarchie-reseau (4)
    case 'node-link-network':
      return {
        datasets: [
          {
            label: 'Nœuds',
            data: [
              { x: 10, y: 20, r: 8, label: 'Node A' },
              { x: 30, y: 50, r: 12, label: 'Node B' },
              { x: 50, y: 20, r: 10, label: 'Node C' },
              { x: 70, y: 60, r: 14, label: 'Node D' }
            ],
            backgroundColor: palette[0]
          }
        ],
        links: [
          { source: 0, target: 1, weight: 2 },
          { source: 1, target: 2, weight: 3 },
          { source: 2, target: 3, weight: 4 },
          { source: 0, target: 3, weight: 1 }
        ]
      };

    case 'arc-diagram':
      return {
        nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
        links: [
          { source: 0, target: 2, value: 5 },
          { source: 1, target: 3, value: 8 },
          { source: 2, target: 4, value: 3 },
          { source: 0, target: 5, value: 10 }
        ],
        datasets: [{
          data: [
            { x: 1, y: 0, label: 'A' }, { x: 2, y: 0, label: 'B' }, { x: 3, y: 0, label: 'C' },
            { x: 4, y: 0, label: 'D' }, { x: 5, y: 0, label: 'E' }, { x: 6, y: 0, label: 'F' }
          ]
        }]
      };

    case 'dendrogram':
      return {
        datasets: [{
          label: 'Arbre Taxonomique',
          data: [
            { x: 10, y: 1 }, { x: 10, y: 2 }, { x: 25, y: 1.5 },
            { x: 15, y: 3 }, { x: 15, y: 4 }, { x: 30, y: 3.5 },
            { x: 50, y: 2.5 }
          ]
        }]
      };

    case 'marimekko-chart':
      return {
        datasets: [{
          label: 'Marché Automobile par Segment & Motorisation',
          data: [
            { x: 'Citadines', y: 'Électrique', v: 45, width: 30 },
            { x: 'Citadines', y: 'Thermique', v: 55, width: 30 },
            { x: 'Berlines', y: 'Électrique', v: 60, width: 40 },
            { x: 'Berlines', y: 'Thermique', v: 40, width: 40 },
            { x: 'SUV', y: 'Électrique', v: 35, width: 30 },
            { x: 'SUV', y: 'Thermique', v: 65, width: 30 }
          ]
        }]
      };

    // 08-geospatial-cartes (3)
    case 'choropleth-map':
      return getSyntheticChoroplethData(tokens.sequential || ['#EFF3FF', '#08519C']);

    case 'bubble-map':
      return getSyntheticBubbleMapData();

    case 'cartogram-tilegram':
      return {
        datasets: [{
          label: 'Tilegramme Égalitaire',
          data: [
            { x: 1, y: 1, label: 'HDF', v: 85 }, { x: 2, y: 1, label: 'NOR', v: 65 }, { x: 3, y: 1, label: 'IDF', v: 120 },
            { x: 1, y: 2, label: 'BRE', v: 70 }, { x: 2, y: 2, label: 'PDL', v: 75 }, { x: 3, y: 2, label: 'CVL', v: 55 },
            { x: 1, y: 3, label: 'NAQ', v: 90 }, { x: 2, y: 3, label: 'OCC', v: 95 }, { x: 3, y: 3, label: 'PAC', v: 110 }
          ]
        }]
      };

    default:
      return {
        labels: ['A', 'B', 'C', 'D'],
        datasets: [{
          label: 'Mock Data',
          data: [10, 20, 30, 40],
          backgroundColor: palette[0]
        }]
      };
  }
}

/**
 * Generates an empty dataset payload suitable for boundary testing.
 * @param {string} chartId
 * @returns {Object}
 */
export function getEmptyDataset(chartId) {
  if (chartId === 'treemap') {
    return { datasets: [{ tree: [], key: 'value', groups: [] }] };
  }
  if (chartId === 'sankey-diagram' || chartId === 'alluvial-diagram') {
    return { datasets: [{ data: [] }] };
  }
  if (chartId === 'choropleth-map' || chartId === 'bubble-map') {
    return { labels: [], datasets: [{ data: [], outline: [] }] };
  }
  return {
    labels: [],
    datasets: [{
      label: 'Empty Test',
      data: []
    }]
  };
}

/**
 * Generates a 1-item single observation dataset for boundary testing.
 * @param {string} chartId
 * @param {Object} [tokens]
 * @returns {Object}
 */
export function getSingleItemDataset(chartId, tokens = {}) {
  const palette = tokens.palette || ['#2B8CBE'];

  if (chartId === 'treemap') {
    return {
      datasets: [{
        tree: [{ name: 'Solo Node', value: 100 }],
        key: 'value',
        groups: ['name']
      }]
    };
  }
  if (chartId === 'sankey-diagram' || chartId === 'alluvial-diagram') {
    return {
      datasets: [{
        data: [{ from: 'Source', to: 'Sink', flow: 100 }]
      }]
    };
  }
  if (chartId === 'candlestick-ohlc') {
    return {
      datasets: [{
        data: [{ x: new Date('2025-01-01').getTime(), o: 100, h: 105, l: 95, c: 102 }]
      }]
    };
  }
  if (chartId === 'scatter-plot' || chartId === 'strip-plot' || chartId === 'beeswarm-plot') {
    return {
      datasets: [{
        label: 'Single Point',
        data: [{ x: 10, y: 25 }],
        backgroundColor: palette[0]
      }]
    };
  }
  if (chartId === 'bubble-chart') {
    return {
      datasets: [{
        label: 'Single Bubble',
        data: [{ x: 15, y: 30, r: 12 }],
        backgroundColor: palette[0]
      }]
    };
  }
  if (chartId === 'choropleth-map') {
    const feature = {
      type: 'Feature',
      properties: { name: 'Île-de-France', normalizedRate: 0.84 },
      geometry: { type: 'Polygon', coordinates: [[[1.5, 48.5], [3.5, 48.5], [3.5, 49.5], [1.5, 49.5], [1.5, 48.5]]] }
    };
    return {
      labels: ['Île-de-France'],
      datasets: [{
        outline: [feature],
        data: [{ feature, value: 84 }]
      }]
    };
  }
  if (chartId === 'bubble-map') {
    const feature = {
      type: 'Feature',
      properties: { name: 'Paris Hub' },
      geometry: { type: 'Point', coordinates: [2.3522, 48.8566] }
    };
    return {
      labels: ['Paris Hub'],
      datasets: [{
        outline: [],
        data: [{ feature, value: 500, latitude: 48.8566, longitude: 2.3522 }]
      }]
    };
  }

  return {
    labels: ['Single Category'],
    datasets: [{
      label: 'Single Observation',
      data: [100],
      backgroundColor: palette[0]
    }]
  };
}

/**
 * Generates a massive high-cardinality dataset (500+ items) for performance & stress testing.
 * @param {string} chartId
 * @param {number} [count=500]
 * @param {Object} [tokens]
 * @returns {Object}
 */
export function getMassiveDataset(chartId, count = 500, tokens = {}) {
  const palette = tokens.palette || ['#2B8CBE'];

  if (chartId === 'scatter-plot' || chartId === 'strip-plot' || chartId === 'beeswarm-plot') {
    return {
      datasets: [{
        label: `Massive Points (N=${count})`,
        data: Array.from({ length: count }, (_, i) => ({
          x: i * 0.5,
          y: Math.sin(i * 0.1) * 50 + 50 + (Math.random() * 10)
        })),
        backgroundColor: palette[0]
      }]
    };
  }

  if (chartId === 'bubble-chart') {
    return {
      datasets: [{
        label: `Massive Bubbles (N=${count})`,
        data: Array.from({ length: count }, (_, i) => ({
          x: i,
          y: Math.random() * 100,
          r: Math.random() * 8 + 2
        })),
        backgroundColor: 'rgba(43, 140, 190, 0.4)'
      }]
    };
  }

  if (chartId === 'treemap') {
    return {
      datasets: [{
        tree: Array.from({ length: count }, (_, i) => ({
          group: `Group_${Math.floor(i / 50)}`,
          name: `Item_${i}`,
          value: Math.floor(Math.random() * 1000) + 10
        })),
        key: 'value',
        groups: ['group', 'name']
      }]
    };
  }

  if (chartId === 'candlestick-ohlc') {
    const baseTime = new Date('2024-01-01').getTime();
    let currentPrice = 100;
    return {
      datasets: [{
        label: `OHLC Series (N=${count})`,
        data: Array.from({ length: count }, (_, i) => {
          const delta = (Math.random() - 0.48) * 4;
          const open = currentPrice;
          const close = open + delta;
          const high = Math.max(open, close) + Math.random() * 2;
          const low = Math.min(open, close) - Math.random() * 2;
          currentPrice = close;
          return {
            x: baseTime + i * 86400000,
            o: Number(open.toFixed(2)),
            h: Number(high.toFixed(2)),
            l: Number(low.toFixed(2)),
            c: Number(close.toFixed(2))
          };
        })
      }]
    };
  }

  if (chartId === 'sankey-diagram' || chartId === 'alluvial-diagram') {
    return {
      datasets: [{
        data: Array.from({ length: count }, (_, i) => ({
          from: `StageA_${i % 10}`,
          to: `StageB_${(i + 1) % 10}`,
          flow: Math.floor(Math.random() * 100) + 1
        }))
      }]
    };
  }

  return {
    labels: Array.from({ length: count }, (_, i) => `Cat_${i}`),
    datasets: [{
      label: `Massive Dataset (N=${count})`,
      data: Array.from({ length: count }, (_, i) => Math.floor(Math.sin(i * 0.05) * 500 + 500)),
      backgroundColor: palette[0]
    }]
  };
}

/**
 * Generates an extreme values dataset (negative, zero, high-precision decimals).
 * @param {string} chartId
 * @param {Object} [tokens]
 * @returns {Object}
 */
export function getExtremesDataset(chartId, tokens = {}) {
  const palette = tokens.palette || ['#2B8CBE', '#E66101'];

  if (chartId === 'scatter-plot') {
    return {
      datasets: [{
        label: 'Extremes',
        data: [
          { x: -1000.5, y: -500.25 },
          { x: 0, y: 0 },
          { x: 0.000123, y: 0.000456 },
          { x: 1000000, y: 5000000 }
        ],
        backgroundColor: palette[0]
      }]
    };
  }

  if (chartId === 'matrix-heatmap') {
    return {
      datasets: [{
        data: [
          { x: 'A', y: 'A', v: -1.0 }, { x: 'A', y: 'B', v: 0.0 }, { x: 'A', y: 'C', v: 0.00001 },
          { x: 'B', y: 'A', v: -0.999 }, { x: 'B', y: 'B', v: 1.0 }, { x: 'B', y: 'C', v: 9999.5 }
        ]
      }]
    };
  }

  return {
    labels: ['Négatif Fort', 'Négatif Faible', 'Zéro Absolu', 'Micro Décimal', 'Grand Positif'],
    datasets: [{
      label: 'Extremes & Zeros',
      data: [-4500.75, -0.05, 0, 0.00042, 987654.32],
      backgroundColor: palette[0]
    }]
  };
}
