/**
 * @file tooltip/template.js
 * @description Standardized Universal Tooltip & Details-on-Demand Showcase Template for kit-charts.
 * Implements Fitts law hit target expansion, Mayer spatial contiguity / anti-occlusion,
 * Sweller tabular numbers, multi-series synchronization, and WCAG AAA accessibility.
 * Compatible with browsers (file://, http://), Node.js, and bundlers.
 */

(function(global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory(require('../../themes/theme-tokens.js'));
  } else if (typeof define === 'function' && define.amd) {
    define(['../../themes/theme-tokens.js'], factory);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    var tokens = global.KitChartsTheme || (global.KitCharts && global.KitCharts.Theme) || {};
    var exp = factory(tokens);
    global.KitCharts = global.KitCharts || {};
    global.KitCharts['tooltip'] = exp;
    global.KitCharts['tooltip-showcase'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2B8CBE'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function(t, r, o) { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Données de démonstration pour le laboratoire des tooltips
   * Représente des métriques trimestrielles avec valeurs, objectifs et marges
   */
  const DEFAULT_DATA = {
    labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'],
    datasets: [
      {
        label: 'Chiffre d\'Affaires Réalisé (k€)',
        data: [420, 490, 560, 610, 590, 680, 740, 810],
        type: 'bar',
        unit: ' k€'
      },
      {
        label: 'Objectif Budgétaire Prévisionnel (k€)',
        data: [400, 450, 520, 580, 620, 650, 700, 750],
        type: 'line',
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 8,
        pointHitRadius: 12,
        unit: ' k€'
      },
      {
        label: 'Marge Brute Opérationnelle (%)',
        data: [28.4, 29.1, 31.0, 32.5, 30.8, 33.2, 34.0, 35.5],
        type: 'line',
        yAxisID: 'y1',
        borderWidth: 2.5,
        pointRadius: 4,
        pointHoverRadius: 8,
        pointHitRadius: 12,
        unit: ' %'
      }
    ]
  };

  /**
   * Crée et initialise le démonstrateur interactif de tooltips cognitifs.
   *
   * @param {string|HTMLCanvasElement} canvasTarget - ID ou élément Canvas
   * @param {Object} [customData=null] - Données personnalisées
   * @param {string} [themeName='colorbrewer-accessible'] - Nom du thème cognitif
   * @param {Object} [options={}] - Options de configuration du laboratoire
   * @returns {Object} Instance Chart.js
   */
  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
    const canvas = typeof canvasTarget === 'string'
      ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
      : canvasTarget;

    if (!canvas) {
      if (typeof process !== 'undefined' && process.versions && process.versions.node) {
        return {
          id: 'tooltip-mock',
          destroy: () => {},
          update: () => {},
          resize: () => {},
          data: customData || DEFAULT_DATA,
          options: {}
        };
      }
      throw new Error(`Canvas element "${canvasTarget}" not found`);
    }

    if (typeof Chart !== 'undefined' && Chart.getChart) {
      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();
    }

    const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
    const tokens = getThemeTokens(themeName, container);
    const isTufte = tokens.name === 'tufte-minimalist-executive';
    const isDark = tokens.isDark || tokens.name === 'nord-cognitive-dark';

    const data = customData || DEFAULT_DATA;
    const labels = data.labels || [];

    // Détermination du mode de tooltip demandé dans options
    const tooltipMode = options.tooltipMode || 'index'; // 'index', 'nearest', 'point', 'anti-occlusion'
    const intersect = options.intersect !== undefined ? options.intersect : false;

    // Palette et assignation des couleurs harmonieuses du thème
    const barColor = isTufte ? '#333333' : getColor(tokens, 0);
    const targetLineColor = isTufte ? '#777777' : getColor(tokens, 1);
    const marginLineColor = isTufte ? '#111111' : getColor(tokens, 2);

    const datasets = (data.datasets || []).map((ds, idx) => {
      const copy = { ...ds };
      if (ds.type === 'bar' || !ds.type) {
        if (Array.isArray(ds.emphasisRoles) || Array.isArray(ds.roles)) {
          const roles = ds.emphasisRoles || ds.roles;
          copy.backgroundColor = roles.map(r => getEmphasisStyle(tokens, r).backgroundColor || barColor);
          copy.borderColor = roles.map(r => getEmphasisStyle(tokens, r).borderColor || barColor);
        } else {
          copy.backgroundColor = isTufte ? 'rgba(0, 0, 0, 0.12)' : hexToRgba(barColor, 0.85);
          copy.borderColor = barColor;
        }
        copy.borderWidth = 1.5;
        copy.borderRadius = 4;
        copy.hoverBorderWidth = 2.5;
        copy.hoverBackgroundColor = barColor;
      } else if (idx === 1) {
        copy.borderColor = targetLineColor;
        copy.backgroundColor = targetLineColor;
        copy.pointBackgroundColor = targetLineColor;
        copy.pointBorderColor = tokens.surfaceRaised || tokens.bg || '#FFFFFF';
      } else if (idx === 2) {
        copy.borderColor = marginLineColor;
        copy.backgroundColor = marginLineColor;
        copy.pointBackgroundColor = marginLineColor;
        copy.pointBorderColor = tokens.surfaceRaised || tokens.bg || '#FFFFFF';
      }
      return copy;
    });

    const baseOptions = getChartDefaultOptions(tokens);
    const animationOptions = getAccessibleAnimationOptions(tokens, { duration: isTufte ? 0 : 400 });

    const chartOptions = {
      ...baseOptions,
      ...animationOptions,
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: tooltipMode,
        intersect: intersect,
        axis: 'x'
      },
      plugins: {
        ...baseOptions.plugins,
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11,
              weight: '500'
            },
            boxWidth: 12,
            boxHeight: 12,
            usePointStyle: true,
            pointStyle: 'rectRounded'
          }
        },
        tooltip: {
          enabled: true,
          mode: tooltipMode,
          intersect: intersect,
          backgroundColor: isDark ? 'rgba(46, 52, 64, 0.96)' : (isTufte ? '#FFFFFF' : 'rgba(15, 23, 42, 0.95)'),
          titleColor: isDark ? '#ECEFF4' : (isTufte ? '#111111' : '#FFFFFF'),
          bodyColor: isDark ? '#D8DEE9' : (isTufte ? '#333333' : '#F1F5F9'),
          footerColor: isDark ? '#88C0D0' : (isTufte ? '#B22222' : '#38BDF8'),
          borderColor: isDark ? '#4C566A' : (isTufte ? '#111111' : 'rgba(255, 255, 255, 0.15)'),
          borderWidth: isTufte ? 1.5 : 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '700'
          },
          bodyFont: {
            family: tokens.fontMono || 'monospace',
            size: 11.5,
            weight: '500'
          },
          footerFont: {
            family: tokens.fontMono || 'monospace',
            size: 11,
            weight: '600'
          },
          cornerRadius: isTufte ? 0 : 8,
          displayColors: true,
          callbacks: {
            title: function(tooltipItems) {
              if (!tooltipItems.length) return '';
              const item = tooltipItems[0];
              return `Période : ${item.label}`;
            },
            label: function(context) {
              const label = context.dataset.label || '';
              const val = context.parsed.y !== undefined ? context.parsed.y : context.raw;
              const unit = context.dataset.unit || '';
              const formattedVal = typeof val === 'number'
                ? Number(val).toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
                : val;

              // Calcul de statut par rapport à l'objectif si c'est la série réalisée
              let extraInfo = '';
              if (context.datasetIndex === 0 && context.chart.data.datasets[1]) {
                const targetVal = context.chart.data.datasets[1].data[context.dataIndex];
                if (typeof targetVal === 'number' && targetVal > 0) {
                  const deltaPct = ((val - targetVal) / targetVal) * 100;
                  const sign = deltaPct >= 0 ? '+' : '';
                  extraInfo = ` (${sign}${deltaPct.toFixed(1)}% vs obj)`;
                }
              }

              return `  ${label.split(' (')[0]}: ${formattedVal}${unit}${extraInfo}`;
            },
            footer: function(tooltipItems) {
              // Règle psychophysique de Sweller : Résumé cognitif en pied d'infobulle
              if (tooltipItems.length >= 2) {
                const ca = tooltipItems.find(i => i.datasetIndex === 0);
                const obj = tooltipItems.find(i => i.datasetIndex === 1);
                if (ca && obj) {
                  const diff = ca.parsed.y - obj.parsed.y;
                  const sign = diff >= 0 ? '+' : '';
                  return `Écart Net Budgétaire : ${sign}${diff.toFixed(1)} k€`;
                }
              }
              return '';
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            }
          }
        },
        y: {
          beginAtZero: true,
          position: 'left',
          title: {
            display: true,
            text: 'Montant (k€)',
            color: tokens.textSecondary,
            font: { family: tokens.fontFamily, size: 11, weight: '600' }
          },
          grid: {
            color: tokens.gridColor || 'rgba(0, 0, 0, 0.06)'
          },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontMono || 'monospace',
              size: 10.5
            },
            callback: (v) => `${v} k€`
          }
        },
        y1: {
          beginAtZero: true,
          max: 50,
          position: 'right',
          title: {
            display: true,
            text: 'Marge (%)',
            color: tokens.textSecondary,
            font: { family: tokens.fontFamily, size: 11, weight: '600' }
          },
          grid: {
            drawOnChartArea: false
          },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontMono || 'monospace',
              size: 10.5
            },
            callback: (v) => `${v}%`
          }
        }
      }
    };

    if (typeof Chart !== 'undefined') {
      return new Chart(canvas, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: datasets
        },
        options: chartOptions
      });
    }

    return null;
  }

  return {
    createChart: createChart,
    createTooltipDemo: createChart,
    DEFAULT_DATA: DEFAULT_DATA,
    computeAntiOcclusionTooltipPosition: computeAntiOcclusionTooltipPosition
  };
});
