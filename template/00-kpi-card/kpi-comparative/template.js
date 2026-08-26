/**
 * @file template/00-kpi-card/kpi-comparative/template.js
 * @description Standardized Universal kpi-comparative Template for kit-charts.
 * Compatible with browsers (file://, http://), Node.js, and bundlers.
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
    global.KitCharts['kpi-comparative'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return d >= 0 ? '#2E7D32' : '#C62828'; };
  const resolveThresholds = (KitChartsTheme && KitChartsTheme.resolveThresholds) || (typeof window !== 'undefined' && window.resolveThresholds) || null;
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  const DEFAULT_DATA = {
    title: 'Marge Brute Opérationnelle',
    value: 68.5,
    unit: '%',
    metricType: 'gain',
    historical: {
      label: 'vs Année N-1',
      value: 64.2,
      deltaAbs: 4.3,
      deltaPct: 6.7
    },
    budget: {
      label: 'vs Budget Prévu',
      value: 70.0,
      deltaAbs: -1.5,
      deltaPct: -2.1
    },
    footnote: 'Audit semestriel consolidé • Normes IFRS'
  };

  /**
   * Crée et initialise un micro-graphique comparatif 3 barres (N, N-1, Budget) dans le canvas.
   */
  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
    const canvas = typeof canvasTarget === 'string' && typeof document !== 'undefined'
      ? document.getElementById(canvasTarget)
      : canvasTarget;

    if (!canvas) return null;

    if (typeof Chart !== 'undefined') {
      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();
    }

    const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
    const tokens = getThemeTokens(themeName, container);
    const data = Object.assign({}, DEFAULT_DATA, customData || {});
    const isDark = Boolean(tokens.isDark);

    const currentVal = data.value;
    let histVal = data.historical ? data.historical.value : currentVal;
    let budgetVal = data.budget ? data.budget.value : currentVal;

    let resolvedProvenance = null;
    if (resolveThresholds) {
      const historyData = data.history || (Array.isArray(data.data) ? data.data : null);
      const explicitThresh = data.thresholds || (data.budget ? { target: data.budget.value, warning: (data.historical ? data.historical.value : data.budget.value * 0.9), danger: (data.budget.value * 0.8), polarity: data.metricType } : null);
      if (data.thresholds) {
        try {
          resolvedProvenance = resolveThresholds(historyData, explicitThresh, { polarity: data.metricType });
        } catch (e) {}
      } else if (options.autoThreshold !== false && data.autoThreshold !== false && historyData && historyData.length >= 5) {
        resolvedProvenance = resolveThresholds(historyData, null, { polarity: data.metricType });
        if (resolvedProvenance && resolvedProvenance.target !== null) {
          budgetVal = resolvedProvenance.target;
        }
      }
    }

    const primaryColor = tokens.palette[0] || '#2B8CBE';
    const histColor = tokens.emphasis?.context || (isDark ? '#4C566A' : '#94A3B8');
    const budgetColor = tokens.emphasis?.benchmark || (isDark ? '#D8DEE9' : '#475569');


    if (typeof Chart === 'undefined') return null;

    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Réalisé N', 'Historique N-1', 'Budget Prévu'],
        datasets: [{
          data: [currentVal, histVal, budgetVal],
          backgroundColor: [primaryColor, histColor, budgetColor],
          borderRadius: 4,
          barThickness: 14
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (ctx) => `${ctx.label} : ${ctx.parsed.x} ${data.unit || ''}`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { display: false },
            ticks: {
              font: { size: 10, family: tokens.fontMono },
              color: tokens.textSecondary
            }
          },
          y: {
            grid: { display: false },
            ticks: {
              font: { size: 11, family: tokens.fontFamily, weight: '500' },
              color: tokens.textPrimary
            }
          }
        }
      }
    });

    return chart;
  }

  /**
   * Rendu complet du composant DOM de la KPI Card Comparative Multi-Période.
   */
  function renderCard(targetElement, customData = null, themeName = DEFAULT_THEME) {
    const el = typeof targetElement === 'string' && typeof document !== 'undefined'
      ? document.getElementById(targetElement)
      : targetElement;

    if (!el) return null;

    const tokens = getThemeTokens(themeName, el);
    const data = Object.assign({}, DEFAULT_DATA, customData || {});
    const isDark = Boolean(tokens.isDark);

    const hist = data.historical || { label: 'vs N-1', value: 0, deltaAbs: 0, deltaPct: 0 };
    const bud = data.budget || { label: 'vs Budget', value: 0, deltaAbs: 0, deltaPct: 0 };

    const histValence = hist.deltaAbs >= 0 ? 1 : -1;
    const histColor = getValenceColor(tokens, histValence, data.metricType || 'gain');
    const histBg = hexToRgba(histColor, isDark ? 0.18 : 0.10);
    const histBorder = hexToRgba(histColor, isDark ? 0.35 : 0.25);

    const budValence = bud.deltaAbs >= 0 ? 1 : -1;
    const budColor = getValenceColor(tokens, budValence, data.metricType || 'gain');
    const budBg = hexToRgba(budColor, isDark ? 0.18 : 0.10);
    const budBorder = hexToRgba(budColor, isDark ? 0.35 : 0.25);

    function formatBenchmarkLabel(label, val, unit) {
      if (!label) return '';
      if (/\(.*\)/.test(label)) return label;
      if (val !== undefined && val !== null) {
        const formattedVal = typeof val === 'number' ? val.toLocaleString('fr-FR') : val;
        return `${label} (${formattedVal}${unit ? ' ' + unit : ''})`;
      }
      return label;
    }

    function formatDeltaAbs(deltaAbs, unit) {
      if (deltaAbs === undefined || deltaAbs === null) return '';
      const sign = deltaAbs >= 0 ? '+' : '';
      if (unit === '%') {
        return `${sign}${deltaAbs.toLocaleString('fr-FR')} pt`;
      }
      const formatted = typeof deltaAbs === 'number' ? deltaAbs.toLocaleString('fr-FR') : deltaAbs;
      return `${sign}${formatted}${unit ? ' ' + unit : ''}`;
    }

    el.innerHTML = `
      <div class="kpi-card kpi-card--comparative" style="
        background: ${tokens.surfaceRaised || tokens.surface};
        border: 1px solid ${tokens.border};
        border-radius: 14px;
        padding: 1.25rem 1.4rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        font-family: ${tokens.fontFamily};
        color: ${tokens.textPrimary};
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 210px;
        position: relative;
        transition: all 0.2s ease;
      ">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 0.5rem;">
          <span style="
            font-size: 0.8125rem;
            font-weight: 600;
            color: ${tokens.textSecondary};
            text-transform: uppercase;
            letter-spacing: 0.04em;
          ">${data.title}</span>
          <span style="font-size: 0.725rem; color: ${tokens.textMuted}; font-weight: 500; white-space: nowrap; flex-shrink: 0;">Période Active N</span>
        </div>

        <div style="margin-bottom: 0.75rem;">
          <div style="
            font-size: 2.1rem;
            font-weight: 800;
            line-height: 1.1;
            letter-spacing: -0.03em;
            color: ${tokens.textPrimary};
            font-variant-numeric: tabular-nums;
          ">
            ${data.value.toLocaleString('fr-FR')} <span style="font-size: 1.25rem; font-weight: 500; color: ${tokens.textMuted};">${data.unit || ''}</span>
          </div>
        </div>

        <!-- Double Repère Comparatif (Grid 2 Colonnes) -->
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding: 8px 10px;
          background: ${tokens.gridColor || (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.03)')};
          border-radius: 8px;
          margin-bottom: 0.5rem;
        ">
          <!-- Colonne Historique -->
          <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
            <div style="font-size: 0.7rem; font-weight: 600; color: ${tokens.textMuted}; text-transform: uppercase; text-align: center; white-space: nowrap;">
              ${formatBenchmarkLabel(hist.label, hist.value, data.unit)}
            </div>
            <div style="
              display: inline-flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              gap: 4px;
              margin-top: 4px;
              padding: 3px 10px;
              border-radius: 9999px;
              font-size: 0.725rem;
              font-weight: 700;
              white-space: nowrap;
              font-variant-numeric: tabular-nums;
              background: ${histBg};
              color: ${histColor};
              border: 1px solid ${histBorder};
            ">
              <span style="font-size: 0.65rem;">${hist.deltaAbs >= 0 ? '▲' : '▼'}</span>
              <span>${formatDeltaAbs(hist.deltaAbs, data.unit)} (${hist.deltaPct >= 0 ? '+' : ''}${hist.deltaPct}%)</span>
            </div>
          </div>

          <!-- Colonne Budget -->
          <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
            <div style="font-size: 0.7rem; font-weight: 600; color: ${tokens.textMuted}; text-transform: uppercase; text-align: center; white-space: nowrap;">
              ${formatBenchmarkLabel(bud.label, bud.value, data.unit)}
            </div>
            <div style="
              display: inline-flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              gap: 4px;
              margin-top: 4px;
              padding: 3px 10px;
              border-radius: 9999px;
              font-size: 0.725rem;
              font-weight: 700;
              white-space: nowrap;
              font-variant-numeric: tabular-nums;
              background: ${budBg};
              color: ${budColor};
              border: 1px solid ${budBorder};
            ">
              <span style="font-size: 0.65rem;">${bud.deltaAbs >= 0 ? '▲' : '▼'}</span>
              <span>${formatDeltaAbs(bud.deltaAbs, data.unit)} (${bud.deltaPct >= 0 ? '+' : ''}${bud.deltaPct}%)</span>
            </div>
          </div>
        </div>

        ${data.footnote ? `
        <div style="
          padding-top: 0.4rem;
          border-top: 1px solid ${tokens.gridColor || tokens.border};
          font-size: 0.7rem;
          color: ${tokens.textMuted};
        ">
          ${data.footnote}
        </div>` : ''}
      </div>
    `;

    return el;
  }

  return {
    createChart,
    renderCard,
    DEFAULT_DATA
  };
});
