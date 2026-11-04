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
  const checkRequiredArrays = (KitChartsTheme && KitChartsTheme.checkRequiredArrays) || (typeof window !== 'undefined' && window.checkRequiredArrays) || function() { return null; };
  const renderInvalidData = (KitChartsTheme && KitChartsTheme.renderInvalidData) || (typeof window !== 'undefined' && window.renderInvalidData) || function(t, r) { if (typeof console !== 'undefined') console.error('[kit-charts] Données invalides : ' + r); return null; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';


  function relLum(hex) {
    const h = String(hex || '').replace('#', '');
    if (h.length < 6) return 0;
    const c = [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function contrastRatio(a, b) {
    const x = relLum(a), y = relLum(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }
  // Ajuste une teinte de texte (assombrie en clair, éclaircie en sombre) jusqu'à 4.5:1 sur le fond.
  function ensureTextContrast(hex, bg, isDarkTheme) {
    if (typeof hex !== 'string' || hex.charAt(0) !== '#' || hex.length < 7 || typeof bg !== 'string' || bg.charAt(0) !== '#') return hex;
    let col = hex;
    for (let i = 0; i < 12 && contrastRatio(col, bg) < 4.5; i++) {
      const ch = [1, 3, 5].map(k => parseInt(col.substr(k, 2), 16));
      const next = ch.map(v => Math.round(isDarkTheme ? v + (255 - v) * 0.15 : v * 0.85));
      col = '#' + next.map(v => v.toString(16).padStart(2, '0')).join('');
    }
    return col;
  }

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
    // Données fournies mais incomplètes : refus visible, jamais de repli sur l'exemple DEFAULT_DATA.
    const invalidReason = customData ? checkRequiredArrays(rawData, ['labels', 'datasets[0].data', 'datasets[1].data']) : null;
    if (invalidReason) return renderInvalidData(canvas, invalidReason);
    const labels = rawData.labels;
    const actuals = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data);
    const targets = (rawData.datasets && rawData.datasets[1] && rawData.datasets[1].data);

    const analysis = computeVarianceDeltas(actuals, targets);
    // Carte étroite (< 420 px) : polices réduites, étiquettes compactes, légende courte.
    const cw = (canvas.clientWidth || (canvas.parentElement && canvas.parentElement.clientWidth) || 0);
    const narrow = cw > 0 && cw < 420;

    const successColor = tokens.semantic?.positive || tokens.status?.success || '#2E7D32';
    const warningColor = tokens.semantic?.warning || tokens.status?.warning || '#EF6C00';
    const dangerColor = tokens.semantic?.negative || tokens.status?.danger || '#C62828';
    const targetMarkerColor = tokens.emphasis?.benchmark || (isDark ? '#ECEFF4' : '#0F172A');
    const cardBg = tokens.bg || (isDark ? '#2E3440' : '#FFFFFF');
    const textFor = (c) => ensureTextContrast(c, cardBg, isDark);
    const haloColor = isDark ? '#2E3440' : '#FFFFFF';

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
          // Liseré de séparation puis trait : lisible même sur une barre de couleur
          [[haloColor, 6], [targetMarkerColor, 3]].forEach(([col, w]) => {
            ctx.beginPath();
            ctx.strokeStyle = col;
            ctx.lineWidth = w;
            ctx.moveTo(xTarget, yCenter - tickHeight / 2);
            ctx.lineTo(xTarget, yCenter + tickHeight / 2);
            ctx.stroke();
          });

          // Libellé de variance Delta% et valeur affichés si showDataLabels est actif
          if (showLabels) {
            const xActual = x.getPixelForValue(item.actual);
            ctx.font = `600 ${narrow ? 10 : 11}px ${tokens.fontMono || 'monospace'}`;
            ctx.fillStyle = textFor(item.status === 'success' ? successColor : (item.status === 'warning' ? warningColor : dangerColor));
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            const sign = item.deltaPct >= 0 ? '+' : '';
            const labelStr = `${item.actual.toLocaleString('fr-FR')}${narrow ? '' : ' k€'} (${sign}${item.deltaPct.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %)`;
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
            right: narrow ? 66 : 120 // place pour l'étiquette valeur + écart de la barre la plus longue
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
          legend: {
            display: true,
            position: 'top',
            align: narrow ? 'start' : 'end',
            onClick: null,
            labels: {
              usePointStyle: true,
              boxWidth: narrow ? 8 : 12,
              boxHeight: narrow ? 8 : 12,
              padding: narrow ? 8 : 10,
              color: tokens.textPrimary,
              font: { family: tokens.fontFamily, size: narrow ? 10 : 11, weight: '500' },
              generateLabels: () => ([
                { text: 'Objectif', fillStyle: targetMarkerColor, strokeStyle: targetMarkerColor, lineWidth: 3, pointStyle: 'line', rotation: 90, fontColor: tokens.textPrimary, hidden: false },
                { text: narrow ? 'Atteint' : 'Objectif atteint', fillStyle: successColor, strokeStyle: successColor, lineWidth: 0, pointStyle: 'rect', fontColor: tokens.textPrimary, hidden: false },
                { text: narrow ? 'Écart ≤ 10 %' : 'Écart jusqu\'à -10 %', fillStyle: warningColor, strokeStyle: warningColor, lineWidth: 0, pointStyle: 'rect', fontColor: tokens.textPrimary, hidden: false },
                { text: narrow ? 'Écart > 10 %' : 'Écart pire que -10 %', fillStyle: dangerColor, strokeStyle: dangerColor, lineWidth: 0, pointStyle: 'rect', fontColor: tokens.textPrimary, hidden: false }
              ])
            }
          },
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
            ticks: { ...(defaultOpts.scales.x && defaultOpts.scales.x.ticks), maxTicksLimit: narrow ? 5 : 8, font: { family: tokens.fontMono || tokens.fontFamily, size: narrow ? 10 : 12 } },
            title: {
              display: !narrow,
              text: 'Montant (k€)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          },
          y: {
            ...defaultOpts.scales.y,
            ticks: { ...(defaultOpts.scales.y && defaultOpts.scales.y.ticks), font: { family: tokens.fontMono || tokens.fontFamily, size: narrow ? 10 : 12 } },
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
