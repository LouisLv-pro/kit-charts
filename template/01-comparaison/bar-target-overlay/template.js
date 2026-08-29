/**
 * @file 01-comparaison/bar-target-overlay/template.js
 * @description Standardized Bar Chart + Target Overlay Marker Template for kit-charts.
 * Combines category performance bars and target benchmark ticks with automated variance analysis.
 */

(function(global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory(require('../../../themes/theme-tokens.js'));
  } else if (typeof define === 'function' && define.amd) {
    define(['../../../themes/theme-tokens.js'], factory);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    var tokens = global.KitChartsTheme || (global.KitCharts && global.KitCharts.Theme) || {};
    var exp = factory(tokens);
    global.KitCharts = global.KitCharts || {};
    global.KitCharts['bar-target-overlay'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeVarianceDeltas = exp.computeVarianceDeltas;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeVarianceDeltas(actuals, targets) {
    return actuals.map((act, idx) => {
      const tgt = Number(targets[idx]) || 0;
      const delta = act - tgt;
      const deltaPct = tgt > 0 ? (delta / tgt) * 100 : 0;
      let status = 'neutral';
      if (delta >= 0) status = 'success';
      else if (deltaPct >= -10) status = 'warning';
      else status = 'danger';

      return {
        actual: act,
        target: tgt,
        delta,
        deltaPct: Math.round(deltaPct * 10) / 10,
        status
      };
    });
  }

  const DEFAULT_DATA = {
    labels: ['France', 'Allemagne', 'Royaume-Uni', 'Espagne', 'Italie', 'Benelux'],
    datasets: [
      {
        label: 'CA Réalisé (k€)',
        data: [540, 620, 480, 390, 410, 320]
      },
      {
        label: 'Objectif Budgétaire (k€)',
        data: [500, 650, 450, 420, 380, 300]
      }
    ]
  };

  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
    const canvas = typeof canvasTarget === 'string'
      ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
      : canvasTarget;

    if (!canvas) throw new Error(`Canvas element "${canvasTarget}" not found`);

    if (typeof Chart !== 'undefined' && Chart.getChart) {
      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();
    }

    const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
    const tokens = getThemeTokens(themeName, container);
    const isDark = Boolean(tokens.isDark);
    const showDataLabels = (customData && customData.showDataLabels !== undefined)
      ? customData.showDataLabels
      : (options.showDataLabels !== undefined ? options.showDataLabels : true);

    const rawData = customData || DEFAULT_DATA;
    const labels = rawData.labels || DEFAULT_DATA.labels;
    const actuals = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;
    const targets = (rawData.datasets && rawData.datasets[1] && rawData.datasets[1].data) || DEFAULT_DATA.datasets[1].data;

    const analysis = computeVarianceDeltas(actuals, targets);

    const successColor = tokens.semantic?.positive || tokens.status?.success || '#2E7D32';
    const warningColor = tokens.semantic?.warning || tokens.status?.warning || '#EF6C00';
    const dangerColor = tokens.semantic?.negative || tokens.status?.danger || '#C62828';
    const targetMarkerColor = tokens.emphasis?.benchmark || (isDark ? '#ECEFF4' : '#0F172A');

    const targetOverlayPlugin = {
      id: 'kitChartsTargetOverlayPainter',
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y } } = chart;
        if (!x || !y) return;

        ctx.save();
        const n = labels.length;
        const rowHeight = y.height / n;
        const barThickness = Math.min(26, rowHeight * 0.55);
        const tickHeight = barThickness + 8;

        analysis.forEach((item, idx) => {
          const yCenter = y.getPixelForValue(idx);
          const xTarget = x.getPixelForValue(item.target);

          // Tracé du trait vertical de cible (Target Tick)
          ctx.beginPath();
          ctx.strokeStyle = targetMarkerColor;
          ctx.lineWidth = 3;
          ctx.moveTo(xTarget, yCenter - tickHeight / 2);
          ctx.lineTo(xTarget, yCenter + tickHeight / 2);
          ctx.stroke();

          // Libellé de variance Delta% et valeur affichés si showDataLabels est actif
          if (showLabels) {
            const xActual = x.getPixelForValue(item.actual);
            ctx.font = `600 11px ${tokens.fontMono || 'monospace'}`;
            ctx.fillStyle = item.status === 'success' ? successColor : (item.status === 'warning' ? warningColor : dangerColor);
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            const sign = item.deltaPct >= 0 ? '+' : '';
            const labelStr = `${item.actual.toLocaleString('fr-FR')} k€ (${sign}${item.deltaPct}%)`;
            const xPos = Math.max(xActual, xTarget) + 8;
            ctx.fillText(labelStr, xPos, yCenter);
          }
        });

        ctx.restore();
      }
    };

    const showLabels = showDataLabels;

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Réalisé',
            data: actuals,
            backgroundColor: analysis.map(item => {
              if (item.status === 'success') return hexToRgba(successColor, 0.85);
              if (item.status === 'warning') return hexToRgba(warningColor, 0.85);
              return hexToRgba(dangerColor, 0.85);
            }),
            borderColor: analysis.map(item => {
              if (item.status === 'success') return successColor;
              if (item.status === 'warning') return warningColor;
              return dangerColor;
            }),
            borderWidth: 1.5,
            borderRadius: 4,
            datalabels: false,
            displayDataLabels: false
          }
        ]
      },
      options: {
        ...defaultOpts,
        indexAxis: 'y',
        _kitChartsTokens: tokens,
        showDataLabels: showDataLabels,
        layout: {
          padding: {
            right: 32
          }
        },
        animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          ...defaultOpts.plugins,
          datalabels: getDataLabelOptions(tokens, {
            display: showDataLabels
          }),
          legend: { display: false },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              title: (items) => items[0].label,
              label: (ctx) => {
                const item = analysis[ctx.dataIndex];
                if (!item) return '';
                const sign = item.delta >= 0 ? '+' : '';
                return [
                  `Réalisé : ${item.actual.toLocaleString('fr-FR')} k€`,
                  `Objectif : ${item.target.toLocaleString('fr-FR')} k€`,
                  `Écart : ${sign}${item.delta.toLocaleString('fr-FR')} k€ (${sign}${item.deltaPct}%)`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            beginAtZero: true,
            grace: '25%',
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Montant (k€)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          },
          y: {
            ...defaultOpts.scales.y,
            grid: { display: false }
          }
        }
      },
      plugins: [targetOverlayPlugin]
    };

    if (typeof Chart === 'undefined') return Object.assign(config, { analysis, computeVarianceDeltas });
    return new Chart(canvas, config);
  }

  function computeTargetDeltas(actuals, targets, direction = 'gain') {
    const list = computeVarianceDeltas(actuals, targets);
    return {
      deltasAbs: list.map(item => item.delta),
      deltasRel: list.map(item => item.deltaPct),
      statuses: list.map(item => item.status),
      items: list
    };
  }

  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || function() { return {}; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || function() { return '#2B8CBE'; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || function() { return 'nominal'; };

  return {
    createChart,
    DEFAULT_DATA,
    computeVarianceDeltas,
    computeTargetDeltas,
    getDataLabelOptions,
    formatLabelValue,
    getEmphasisStyle,
    getValenceColor,
    getThresholdStatus
  };
});
