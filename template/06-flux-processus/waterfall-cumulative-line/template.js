/**
 * @file 06-flux-processus/waterfall-cumulative-line/template.js
 * @description Standardized Waterfall Chart + Continuous Cumulative Trajectory Line Template.
 * Combines discrete sequential variance bridges and continuous net cumulative trend.
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
    global.KitCharts['waterfall-cumulative-line'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeWaterfallBalances = exp.computeWaterfallBalances;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const createCompactResizePlugin = (KitChartsTheme && KitChartsTheme.createCompactResizePlugin) || (typeof window !== 'undefined' && window.createCompactResizePlugin) || function() { return { id: 'kcCompactResize' }; };
  const checkRequiredArrays = (KitChartsTheme && KitChartsTheme.checkRequiredArrays) || (typeof window !== 'undefined' && window.checkRequiredArrays) || function() { return null; };
  const renderInvalidData = (KitChartsTheme && KitChartsTheme.renderInvalidData) || (typeof window !== 'undefined' && window.renderInvalidData) || function(t, r) { if (typeof console !== 'undefined') console.error('[kit-charts] Données invalides : ' + r); return null; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeWaterfallBalances(steps) {
    let running = 0;
    const balances = [];
    const barRanges = [];
    const types = [];

    steps.forEach((s, idx) => {
      const val = Number(s.value) || 0;
      const isTotal = Boolean(s.isTotal);

      if (idx === 0 || isTotal) {
        if (isTotal) {
          barRanges.push([0, running]);
          balances.push(running);
          types.push('total');
        } else {
          barRanges.push([0, val]);
          running = val;
          balances.push(running);
          types.push('start');
        }
      } else {
        const prev = running;
        running += val;
        barRanges.push([Math.min(prev, running), Math.max(prev, running)]);
        balances.push(running);
        types.push(val >= 0 ? 'pos' : 'neg');
      }
    });

    return { balances, barRanges, types, finalTotal: running };
  }

  const DEFAULT_DATA = {
    labels: [
      'Solde Initial',
      'Nouveaux Contrats',
      'Expansion Comptes',
      'Remises Commerciales',
      'Désabonnements (Churn)',
      "Frais d'Infrastructure",
      'Solde Final'
    ],
    datasets: [{
      label: 'Pont Financier (k€)',
      data: [
        { label: 'Solde Initial', value: 500, isTotal: false },
        { label: 'Nouveaux Contrats', value: 180, isTotal: false },
        { label: 'Expansion Comptes', value: 75, isTotal: false },
        { label: 'Remises Commerciales', value: -45, isTotal: false },
        { label: 'Désabonnements (Churn)', value: -60, isTotal: false },
        { label: "Frais d'Infrastructure", value: -110, isTotal: false },
        { label: 'Solde Final', value: 0, isTotal: true }
      ]
    }]
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
    const invalidReason = customData ? checkRequiredArrays(rawData, ['labels', 'datasets[0].data']) : null;
    if (invalidReason) return renderInvalidData(canvas, invalidReason);
    const labels = rawData.labels;
    const steps = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data);

    const analysis = computeWaterfallBalances(steps);

    // Mode compact : largeur disponible sous ~420 px (carte d'aperçu) ; libellés abrégés sur 2 lignes, légende réduite
    // Recalculé au redimensionnement du conteneur (plugin kcCompactResize), pas seulement à la création
    const measureCompact = () => {
      const w = (container && container.clientWidth) || (canvas && canvas.clientWidth) || 0;
      return w > 0 ? w < 460 : null;
    };
    let compact = measureCompact() === true;
    // Retour à la ligne des libellés d'axe : 2 lignes de `max` caractères (abrégé en carte étroite)
    const wrapTick = (text, max, abbreviate) => {
      const src = abbreviate ? String(text).replace(/\s*\(.*?\)\s*/g, ' ').trim() : String(text);
      const words = src.split(/\s+/);
      const cut = (w) => (abbreviate && w.length > max ? w.slice(0, max - 1) + '.' : w);
      const lines = [];
      words.forEach((w) => {
        const last = lines[lines.length - 1];
        if (last && (last + ' ' + w).length <= max) lines[lines.length - 1] = last + ' ' + w;
        else lines.push(w);
      });
      return lines.map(cut);
    };
    const nf = (v) => new Intl.NumberFormat('fr-FR').format(v);

    const posColor = tokens.semantic?.positive || tokens.status?.success || '#2E7D32';
    const negColor = tokens.semantic?.negative || tokens.status?.danger || '#C62828';
    const totalColor = tokens.emphasis?.focal || tokens.palette?.[0] || '#2B8CBE';
    const lineColor = tokens.emphasis?.benchmark || (isDark ? '#ECEFF4' : '#0F172A');

    const barColors = analysis.types.map(t => {
      if (t === 'pos') return posColor;
      if (t === 'neg') return negColor;
      return totalColor;
    });

    const defaultOpts = getChartDefaultOptions(tokens);
    const labelsPlugin = {
      id: 'kitChartsWaterfallLabels',
      afterDatasetsDraw(chart) {
        if (!showDataLabels) return;
        const meta = chart.getDatasetMeta(0);
        const y = chart.scales && chart.scales.y;
        if (!meta || !meta.data || !y) return;
        const { ctx } = chart;
        ctx.save();
        ctx.font = `700 ${compact ? 10 : 11}px ${tokens.fontMono || tokens.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.lineJoin = 'round';
        meta.data.forEach((bar, i) => {
          const st = steps[i];
          if (!st) return;
          const unit = compact ? '' : ' k€';
          const txt = st.isTotal || i === 0
            ? `${nf(analysis.balances[i])}${unit}`
            : `${st.value >= 0 ? '+' : '\u2212'}${nf(Math.abs(st.value))}${unit}`;
          const top = Math.min(bar.y, bar.base, y.getPixelForValue(analysis.balances[i]));
          ctx.lineWidth = 4;
          ctx.strokeStyle = tokens.surface || tokens.bg;
          ctx.strokeText(txt, bar.x, top - 8);
          ctx.fillStyle = tokens.textPrimary;
          ctx.fillText(txt, bar.x, top - 8);
        });
        ctx.restore();
      }
    };

    // Options reconstruites à chaque bascule du mode compact (polices, légende, grace, ticks)
    const buildOptions = () => ({
      ...defaultOpts,
      _kitChartsTokens: tokens,
      showDataLabels: showDataLabels,
      layout: {
        padding: {
          top: 16
        }
      },
      animation: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        ...defaultOpts.plugins,
        datalabels: { display: false },
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          onClick: null,
          labels: {
            color: tokens.textPrimary,
            font: { family: tokens.fontFamily, size: compact ? 10 : 12 },
            boxWidth: compact ? 10 : 40,
            boxHeight: compact ? 10 : 12,
            padding: compact ? 8 : 10,
            generateLabels: () => [
              { text: 'Hausse', fillStyle: posColor, strokeStyle: posColor, fontColor: tokens.textPrimary, color: tokens.textPrimary, lineWidth: 0, hidden: false },
              { text: 'Baisse', fillStyle: negColor, strokeStyle: negColor, fontColor: tokens.textPrimary, color: tokens.textPrimary, lineWidth: 0, hidden: false },
              { text: compact ? 'Initial / final' : 'Solde initial / final', fillStyle: totalColor, strokeStyle: totalColor, fontColor: tokens.textPrimary, color: tokens.textPrimary, lineWidth: 0, hidden: false },
              { text: compact ? 'Cumulé' : 'Solde cumulé', fillStyle: lineColor, strokeStyle: lineColor, fontColor: tokens.textPrimary, color: tokens.textPrimary, lineWidth: 2, hidden: false }
            ]
          }
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          callbacks: {
            title: (items) => items[0].label,
            label: (ctx) => {
              const idx = ctx.dataIndex;
              const s = steps[idx];
              const bal = analysis.balances[idx];
              if (ctx.dataset.type === 'bar') {
                const valStr = s.isTotal ? `${bal} k€ (Total)` : `${s.value >= 0 ? '+' : ''}${s.value} k€`;
                return `Impact : ${valStr}`;
              }
              return `Solde Cumulé : ${bal.toLocaleString('fr-FR')} k€`;
            }
          }
        }
      },
      scales: {
        x: {
          ...defaultOpts.scales.x,
          grid: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: { family: tokens.fontFamily, size: compact ? 10 : 11 },
            maxRotation: 0, autoSkip: false,
            callback: function(val) {
              const t = this.getLabelForValue(val);
              return compact ? wrapTick(t, 7, true).slice(0, 2) : wrapTick(t, 16, false);
            }
          }
        },
        y: {
          ...defaultOpts.scales.y,
          beginAtZero: true,
          ticks: { ...((defaultOpts.scales.y && defaultOpts.scales.y.ticks) || {}), font: { family: tokens.fontMono || tokens.fontFamily, size: compact ? 10 : 11 }, padding: compact ? 4 : 6, maxTicksLimit: compact ? 5 : 8 },
          grace: compact ? '18%' : '12%',
          grid: { color: tokens.gridColor },
          title: {
            display: true,
            text: 'Solde Net (k€)',
            color: tokens.textSecondary,
            font: { family: tokens.fontFamily, size: compact ? 10 : 12, weight: '500' }, padding: compact ? 2 : 4
          }
        }
      }
    });

    const config = {
      type: 'bar',
      plugins: [labelsPlugin, createCompactResizePlugin(measureCompact, compact, (next, chart) => {
        compact = next;
        chart.options = buildOptions();
      })],
      data: {
        labels,
        datasets: [
          {
            type: 'bar',
            label: 'Variation Étape',
            data: analysis.barRanges,
            backgroundColor: barColors.map(c => hexToRgba(c, isDark ? 0.85 : 0.75)),
            borderColor: barColors,
            borderWidth: 1.5,
            borderRadius: 4,
            datalabels: { display: false },
            order: 2
          },
          {
            type: 'line',
            label: 'Trajectoire Cumulée',
            data: analysis.balances,
            borderColor: lineColor,
            backgroundColor: lineColor,
            borderWidth: 2.5,
            pointRadius: 3,
            pointHoverRadius: 6,
            tension: 0,
            datalabels: {
              display: false
            },
            order: 1
          }
        ]
      },
      options: buildOptions()
    };

    if (typeof Chart === 'undefined') return { config, analysis, computeWaterfallBalances };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeWaterfallBalances,
    getDataLabelOptions,
    formatLabelValue
  };
});
