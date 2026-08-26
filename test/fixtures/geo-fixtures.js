/**
 * @file test/fixtures/geo-fixtures.js
 * @description Synthetic GeoJSON & TopoJSON fixtures for kit-charts geospatial E2E testing.
 * Provides lightweight, valid geometric structures for choropleth maps, bubble maps,
 * and cartograms without requiring multi-megabyte external topology downloads.
 */

/**
 * Synthetic 5-region territorial Polygon FeatureCollection.
 * Valid GeoJSON specification (RFC 7946) with bounding box in [-10, 30] to [30, 60].
 */
export const SYNTHETIC_GEO_REGIONS = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'REG-FR-IDF',
      properties: {
        id: 'REG-FR-IDF',
        name: 'Île-de-France',
        code: '11',
        density: 1022.4,
        normalizedRate: 0.84,
        population: 12278210
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [[1.5, 48.5], [3.5, 48.5], [3.5, 49.5], [1.5, 49.5], [1.5, 48.5]]
        ]
      }
    },
    {
      type: 'Feature',
      id: 'REG-FR-ARA',
      properties: {
        id: 'REG-FR-ARA',
        name: 'Auvergne-Rhône-Alpes',
        code: '84',
        density: 118.2,
        normalizedRate: 0.62,
        population: 8078652
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [[2.5, 44.5], [7.0, 44.5], [7.0, 46.5], [2.5, 46.5], [2.5, 44.5]]
        ]
      }
    },
    {
      type: 'Feature',
      id: 'REG-FR-NAQ',
      properties: {
        id: 'REG-FR-NAQ',
        name: 'Nouvelle-Aquitaine',
        code: '75',
        density: 72.8,
        normalizedRate: 0.45,
        population: 6010289
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [[-1.5, 43.0], [2.0, 43.0], [2.0, 46.5], [-1.5, 46.5], [-1.5, 43.0]]
        ]
      }
    },
    {
      type: 'Feature',
      id: 'REG-FR-OCC',
      properties: {
        id: 'REG-FR-OCC',
        name: 'Occitanie',
        code: '76',
        density: 82.5,
        normalizedRate: 0.51,
        population: 5933185
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [[0.0, 42.5], [4.5, 42.5], [4.5, 44.5], [0.0, 44.5], [0.0, 42.5]]
        ]
      }
    },
    {
      type: 'Feature',
      id: 'REG-FR-PAC',
      properties: {
        id: 'REG-FR-PAC',
        name: "Provence-Alpes-Côte d'Azur",
        code: '93',
        density: 161.4,
        normalizedRate: 0.73,
        population: 5081101
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [[4.5, 43.0], [7.5, 43.0], [7.5, 44.8], [4.5, 44.8], [4.5, 43.0]]
        ]
      }
    }
  ]
};

/**
 * Synthetic proportional symbol point fixtures for Bubble Maps.
 */
export const SYNTHETIC_GEO_POINTS = [
  { feature: SYNTHETIC_GEO_REGIONS.features[0], value: 1250, label: 'Paris Hub', latitude: 48.8566, longitude: 2.3522 },
  { feature: SYNTHETIC_GEO_REGIONS.features[1], value: 890, label: 'Lyon Terminal', latitude: 45.7640, longitude: 4.8357 },
  { feature: SYNTHETIC_GEO_REGIONS.features[2], value: 520, label: 'Bordeaux Port', latitude: 44.8378, longitude: -0.5792 },
  { feature: SYNTHETIC_GEO_REGIONS.features[3], value: 610, label: 'Toulouse Cargo', latitude: 43.6047, longitude: 1.4442 },
  { feature: SYNTHETIC_GEO_REGIONS.features[4], value: 940, label: 'Marseille Port', latitude: 43.2965, longitude: 5.3698 }
];

/**
 * Synthetic TopoJSON Topology object for mock testing topojson unpacking.
 */
export const SYNTHETIC_TOPOJSON = {
  type: 'Topology',
  objects: {
    regions: {
      type: 'GeometryCollection',
      geometries: SYNTHETIC_GEO_REGIONS.features.map(f => ({
        type: f.geometry.type,
        properties: f.properties,
        id: f.id,
        arcs: [[0]]
      }))
    }
  },
  arcs: [
    [[1500, 4850], [2000, 0], [0, 1000], [-2000, 0], [0, -1000]]
  ],
  transform: {
    scale: [0.001, 0.001],
    translate: [0, 0]
  }
};

/**
 * Helper to get synthetic choropleth dataset matching Chart.js Geo plugin requirements.
 * @param {Array<string>} [palette] - Optional custom color scale
 * @returns {Object}
 */
export function getSyntheticChoroplethData(palette = ['#EFF3FF', '#08519C']) {
  return {
    labels: SYNTHETIC_GEO_REGIONS.features.map(d => d.properties.name),
    datasets: [{
      label: 'Taux de Couverture Régionale (%)',
      outline: SYNTHETIC_GEO_REGIONS.features,
      data: SYNTHETIC_GEO_REGIONS.features.map(d => ({
        feature: d,
        value: d.properties.normalizedRate * 100
      }))
    }]
  };
}

/**
 * Helper to get synthetic bubble map dataset matching Chart.js Geo plugin requirements.
 * @returns {Object}
 */
export function getSyntheticBubbleMapData() {
  return {
    labels: SYNTHETIC_GEO_POINTS.map(d => d.label),
    datasets: [{
      label: 'Volume Fret (kilo-tonnes)',
      outline: SYNTHETIC_GEO_REGIONS.features,
      data: SYNTHETIC_GEO_POINTS.map(d => ({
        feature: d.feature,
        value: d.value,
        latitude: d.latitude,
        longitude: d.longitude
      }))
    }]
  };
}
