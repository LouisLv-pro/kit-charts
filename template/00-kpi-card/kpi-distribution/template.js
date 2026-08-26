/**
 * @file template/00-kpi-card/kpi-distribution/template.js
 * @description Standardized Universal kpi-distribution Template for kit-charts.
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
    global.KitCharts['kpi-distribution'] = exp;
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
    title: 'Acquisition Globale (Trafic)',
    value: 1240000,
    unit: 'visites',
    delta: 8.5,
    deltaLabel: 'vs N-1 (1 142 850)',
    metricType: 'gain',
    segments: [
      { label: 'Organique', pct: 45, value: 558000 },
      { label: 'Direct', pct: 25, value: 310000 },
      { label: 'Payant (Ads)', pct: 20, value: 248000 },
      { label: 'Referral', pct: 10, value: 124000 }
    ],
    footnote: 'Canaux d\'acquisition qualifiés • GA4 Analytics'
  };

  /**
   * Crée et initialise un micro-stacked bar Chart.js dans le canvas.
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
    const segments = data.segments || DEFAULT_DATA.segments;

    const datasets = segments.map((seg, idx) => ({
      label: seg.label,
      data: [seg.pct],
      backgroundColor: getColor(tokens, idx),
      borderRadius: idx === 0 ? { topLeft: 4, bottomLeft: 4 } : (idx === segments.length - 1 ? { topRight: 4, bottomRight: 4 } : 0),
      barThickness: 16
    }));

    if (typeof Chart === 'undefined') return null;

    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Répartition'],
        datasets: datasets
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
              label: (ctx) => `${ctx.dataset.label} : ${ctx.parsed.x}% (${(segments[ctx.datasetIndex]?.value || 0).toLocaleString('fr-FR')})`
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            max: 100,
            display: false
          },
          y: {
            stacked: true,
            display: false
          }
        }
      }
    });

    return chart;
  }

  /**
   * Rendu complet du composant DOM de la KPI Card Décomposition.
   */
  function renderCard(targetElement, customData = null, themeName = DEFAULT_THEME) {
    const el = typeof targetElement === 'string' && typeof document !== 'undefined'
      ? document.getElementById(targetElement)
      : targetElement;

    if (!el) return null;

    const tokens = getThemeTokens(themeName, el);
    const data = Object.assign({}, DEFAULT_DATA, customData || {});
    const segments = data.segments || DEFAULT_DATA.segments;
    const isDark = Boolean(tokens.isDark);

    const isPositive = data.delta >= 0;
    const valence = isPositive ? 1 : -1;
    const valenceColor = getValenceColor(tokens, valence, data.metricType || 'gain');
    const badgeBg = hexToRgba(valenceColor, isDark ? 0.18 : 0.10);
    const badgeBorder = hexToRgba(valenceColor, isDark ? 0.35 : 0.25);

    // Construction de la barre segmentée HTML pure (ultra-rapide, zéro-latence)
    const barSegmentsHtml = segments.map((seg, idx) => {
      const color = getColor(tokens, idx);
      return `<div style="
        width: ${seg.pct}%;
        height: 100%;
        background-color: ${color};
        title: ${seg.label} (${seg.pct}%);
      "></div>`;
    }).join('');

    // Construction de la légende directe sous la barre
    const labelsGridHtml = segments.map((seg, idx) => {
      const color = getColor(tokens, idx);
      return `
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="width: 8px; height: 8px; border-radius: 2px; background-color: ${color}; flex-shrink: 0;"></span>
          <span style="font-size: 0.725rem; color: ${tokens.textSecondary}; font-weight: 500;">${seg.label}:</span>
          <span style="font-size: 0.725rem; font-weight: 700; color: ${tokens.textPrimary}; font-variant-numeric: tabular-nums;">${seg.pct}%</span>
        </div>
      `;
    }).join('');

    el.innerHTML = `
      <div class="kpi-card kpi-card--distribution" style="
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
        min-height: 215px;
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
            gap: 4px;
            padding: 3px 8px;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 700;
            font-variant-numeric: tabular-nums;
            background: ${badgeBg};
            color: ${valenceColor};
            border: 1px solid ${badgeBorder};
          ">
            <span>${isPositive ? '▲' : '▼'}</span>
            <span>${isPositive ? '+' : ''}${data.delta}%</span>
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
          <div style="font-size: 0.75rem; color: ${tokens.textMuted};">
            ${data.deltaLabel}
          </div>
        </div>

        <!-- Barre Segmentée 100% -->
        <div style="
          width: 100%;
          height: 10px;
          border-radius: 6px;
          overflow: hidden;
          display: flex;
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.05)'};
          margin: 0.4rem 0 0.6rem 0;
        ">
          ${barSegmentsHtml}
        </div>

        <!-- Légendes Directes (Mayer Contiguity) -->
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 12px;
          margin-bottom: 0.4rem;
        ">
          ${labelsGridHtml}
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
