/**
 * @file template/00-kpi-card/kpi-sparkline/template.js
 * @description Standardized Universal kpi-sparkline Template for kit-charts.
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
    global.KitCharts['kpi-sparkline'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return d >= 0 ? '#2E7D32' : '#C62828'; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  const DEFAULT_DATA = {
    title: 'Taux de Conversion E-Commerce',
    value: 3.84,
    unit: '%',
    delta: 0.8,
    deltaLabel: 'vs moyenne 30j (3.04%)',
    metricType: 'gain',
    history: [2.9, 3.1, 3.0, 3.4, 3.2, 3.6, 3.5, 3.3, 3.7, 3.9, 3.6, 3.84],
    labels: ['J-11', 'J-10', 'J-9', 'J-8', 'J-7', 'J-6', 'J-5', 'J-4', 'J-3', 'J-2', 'J-1', 'Aujourd\'hui'],
    footnote: 'Historique continu sur 12 jours • Min: 2.90% | Max: 3.90%'
  };

  /**
   * Crée et initialise la sparkline Chart.js dans le canvas.
   */
  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
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
    const history = data.history || DEFAULT_DATA.history;
    const labels = data.labels || history.map((_, i) => `Point ${i + 1}`);

    const valence = data.delta > 0 ? 1 : (data.delta < 0 ? -1 : 0);
    const strokeColor = getValenceColor(tokens, valence, data.metricType || 'gain');
    const isDark = Boolean(tokens.isDark);

    const ctx = canvas.getContext ? canvas.getContext('2d') : null;
    let gradient = 'transparent';
    if (ctx && canvas.clientHeight) {
      gradient = ctx.createLinearGradient(0, 0, 0, canvas.clientHeight);
      gradient.addColorStop(0, hexToRgba(strokeColor, isDark ? 0.35 : 0.20));
      gradient.addColorStop(1, hexToRgba(strokeColor, 0.0));
    } else {
      gradient = hexToRgba(strokeColor, 0.12);
    }

    const minVal = Math.min(...history);
    const maxVal = Math.max(...history);
    const minIndex = history.indexOf(minVal);
    const maxIndex = history.lastIndexOf(maxVal);
    const lastIndex = history.length - 1;

    if (typeof Chart === 'undefined') return null;

    const chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: history,
          borderColor: strokeColor,
          borderWidth: 2.2,
          backgroundColor: gradient,
          fill: true,
          tension: 0.35,
          pointRadius: (ctx) => {
            const idx = ctx.dataIndex;
            if (idx === lastIndex) return 4;
            if (idx === minIndex || idx === maxIndex) return 3;
            return 0;
          },
          pointBackgroundColor: (ctx) => {
            const idx = ctx.dataIndex;
            if (idx === lastIndex) return strokeColor;
            if (idx === maxIndex) return tokens.palette[1] || strokeColor;
            if (idx === minIndex) return tokens.textMuted || '#64748B';
            return strokeColor;
          },
          pointBorderColor: tokens.surfaceRaised || tokens.bg || '#FFFFFF',
          pointBorderWidth: 1.5,
          pointHoverRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            displayColors: false,
            padding: { top: 4, bottom: 4, left: 8, right: 8 },
            backgroundColor: tokens.tooltipBg || 'rgba(15, 23, 42, 0.92)',
            titleColor: tokens.tooltipText || '#F8FAFC',
            bodyColor: tokens.tooltipText || '#F8FAFC',
            bodyFont: { family: tokens.fontMono, size: 11, weight: '600' },
            callbacks: {
              title: (items) => items[0]?.label || '',
              label: (ctx) => `${data.title} : ${ctx.parsed.y}${data.unit || ''}`
            }
          }
        },
        scales: {
          x: { display: false },
          y: {
            display: false,
            grace: '8%'
          }
        }
      }
    });

    return chart;
  }

  /**
   * Rendu complet du composant DOM de la KPI Card avec Sparkline intégrée.
   */
  function renderCard(targetElement, customData = null, themeName = DEFAULT_THEME) {
    const el = typeof targetElement === 'string' && typeof document !== 'undefined'
      ? document.getElementById(targetElement)
      : targetElement;

    if (!el) return null;

    const tokens = getThemeTokens(themeName, el);
    const data = Object.assign({}, DEFAULT_DATA, customData || {});
    const canvasId = 'kpi-sparkline-canvas-' + Math.random().toString(36).substr(2, 9);

    const isPositive = data.delta >= 0;
    const valence = isPositive ? 1 : -1;
    const valenceColor = getValenceColor(tokens, valence, data.metricType || 'gain');
    const badgeBg = hexToRgba(valenceColor, tokens.isDark ? 0.18 : 0.10);
    const badgeBorder = hexToRgba(valenceColor, tokens.isDark ? 0.35 : 0.25);
    const arrowGlyph = isPositive ? '▲' : '▼';
    const deltaSign = isPositive ? '+' : '';

    el.innerHTML = `
      <div class="kpi-card kpi-card--sparkline" style="
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
        min-height: 190px;
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
          <span style="
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            flex-shrink: 0;
            white-space: nowrap;
            gap: 4px;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 700;
            font-variant-numeric: tabular-nums;
            background: ${badgeBg};
            color: ${valenceColor};
            border: 1px solid ${badgeBorder};
          ">
            <span>${arrowGlyph}</span>
            <span>${deltaSign}${data.delta}%</span>
          </span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
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
          <div style="font-size: 0.75rem; color: ${tokens.textMuted}; text-align: right;">
            ${data.deltaLabel}
          </div>
        </div>

        <!-- Zone Micro-Canvas Sparkline -->
        <div style="position: relative; width: 100%; height: 50px; margin: 0.25rem 0;">
          <canvas id="${canvasId}" style="width: 100%; height: 100%; display: block;"></canvas>
        </div>

        ${data.footnote ? `
        <div style="
          padding-top: 0.5rem;
          border-top: 1px solid ${tokens.gridColor || tokens.border};
          font-size: 0.7rem;
          color: ${tokens.textMuted};
        ">
          ${data.footnote}
        </div>` : ''}
      </div>
    `;

    setTimeout(() => {
      createChart(canvasId, data, themeName);
    }, 0);

    return el;
  }

  return {
    createChart,
    renderCard,
    DEFAULT_DATA
  };
});
