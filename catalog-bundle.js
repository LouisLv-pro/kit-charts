/**
 * @file catalog-bundle.js
 * @description All kit-charts template generators pre-bundled for instant zero-CORS execution.
 * Allows index.html and npm consumers to render all 95 charts immediately on file://, http://, and Node.js.
 * @version 1.0.0
 * @generated 2026-08-30T21:41:50.024Z
 */

(function(global) {
  "use strict";

  global.KitCharts = global.KitCharts || {};
  var ThemeModule = global.KitChartsTheme || (global.KitCharts && global.KitCharts.Theme) || (typeof window !== "undefined" && (window.KitChartsTheme || window.KitChartsTokens)) || {};

  // --------------------------------------------------------------------------
  // Chart: template/00-kpi-card/kpi-bullet
  // --------------------------------------------------------------------------
  global.KitCharts["kpi-bullet"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return d >= 0 ? '#2E7D32' : '#C62828'; };
  const resolveThresholds = (KitChartsTheme && KitChartsTheme.resolveThresholds) || (typeof window !== 'undefined' && window.resolveThresholds) || null;
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  const DEFAULT_DATA = {
    title: 'Quota Commercial T3',
    value: 460000,
    target: 500000,
    unit: '€',
    format: 'currency',
    ranges: [300000, 425000, 550000], // [Seuil Bas, Seuil Moyen, Plafond Optimal]
    metricType: 'gain',
    footnote: 'Écart restant : -40 000 € • 18 jours ouvrés restants'
  };

  /**
   * Crée et initialise un micro-bullet graph dans le canvas.
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

    let actual = data.value;
    let target = data.target;
    let ranges = data.ranges || [target * 0.6, target * 0.85, target * 1.15];

    let resolvedProvenance = null;
    if (resolveThresholds) {
      const historyData = data.history || (Array.isArray(data.data) ? data.data : null);
      const explicitThresh = data.thresholds || (data.target && data.ranges ? { target: data.target, warning: data.ranges[1], danger: data.ranges[0], polarity: data.metricType } : null);
      if (explicitThresh) {
        try {
          resolvedProvenance = resolveThresholds(historyData, explicitThresh, { polarity: data.metricType });
        } catch (e) {}
      } else if (options.autoThreshold !== false && data.autoThreshold !== false && historyData && historyData.length >= 5) {
        resolvedProvenance = resolveThresholds(historyData, null, { polarity: data.metricType });
        if (resolvedProvenance && resolvedProvenance.target !== null) {
          target = resolvedProvenance.target;
          ranges = [resolvedProvenance.danger, resolvedProvenance.warning, target * 1.15];
        }
      }
    }

    const maxScale = Math.max(ranges[2] || target * 1.15, actual * 1.05, target * 1.05);


    const attainment = Math.round((actual / target) * 100);
    const valence = attainment >= 100 ? 1 : (attainment >= 85 ? 0 : -1);
    const barColor = valence >= 1 ? (tokens.semantic?.positive || '#2E7D32') : (tokens.palette[0] || '#2B8CBE');
    const targetMarkerColor = tokens.textPrimary || (isDark ? '#ECEFF4' : '#0F172A');

    // Plugin custom pour dessiner le marqueur cible vertical
    const targetPlugin = {
      id: 'bulletTargetMarker',
      afterDatasetsDraw(chart) {
        const { ctx, chartArea, scales: { x, y } } = chart;
        if (!x || !y) return;

        const targetX = x.getPixelForValue(target);
        const yTop = chartArea.top + 2;
        const yBottom = chartArea.bottom - 2;

        ctx.save();
        ctx.strokeStyle = targetMarkerColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(targetX, yTop);
        ctx.lineTo(targetX, yBottom);
        ctx.stroke();

        // Petit repère textuel subtil
        ctx.fillStyle = tokens.textMuted || '#64748B';
        ctx.font = `600 10px ${tokens.fontMono || 'monospace'}`;
        ctx.textAlign = 'center';
        ctx.fillText('▼', targetX, yTop - 2);
        ctx.restore();
      }
    };

    if (typeof Chart === 'undefined') return null;

    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Performance'],
        datasets: [
          // 1. Barre de mesure centrale (Réalisé)
          {
            label: 'Réalisé',
            data: [actual],
            backgroundColor: barColor,
            borderRadius: 4,
            barThickness: 12,
            order: 1,
            zIndex: 10
          },
          // 2. Plage Qualificative 1 (Bas / Insatisfaisant)
          {
            label: 'Plage Insatisfaisant',
            data: [ranges[0]],
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.08)',
            barThickness: 24,
            borderRadius: 4,
            order: 4,
            grouped: false
          },
          // 3. Plage Qualificative 2 (Moyen / Satisfaisant)
          {
            label: 'Plage Satisfaisant',
            data: [ranges[1]],
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(15, 23, 42, 0.05)',
            barThickness: 24,
            borderRadius: 4,
            order: 3,
            grouped: false
          },
          // 4. Plage Qualificative 3 (Optimal / Plafond)
          {
            label: 'Plage Optimale',
            data: [ranges[2]],
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(15, 23, 42, 0.03)',
            barThickness: 24,
            borderRadius: 4,
            order: 2,
            grouped: false
          }
        ]
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
            filter: (item) => item.datasetIndex === 0,
            callbacks: {
              title: () => data.title,
              label: (ctx) => `Réalisé : ${actual.toLocaleString('fr-FR')} ${data.unit} (${attainment}% de l'objectif de ${target.toLocaleString('fr-FR')} ${data.unit})${resolvedProvenance ? ' • ' + resolvedProvenance.badge : ''}`
            }
          }
        },
        scales: {
          x: {
            min: 0,
            max: maxScale,
            display: false
          },
          y: {
            display: false,
            stacked: false
          }
        }
      },
      plugins: [targetPlugin]
    });

    return chart;
  }

  /**
   * Rendu complet du composant DOM de la KPI Card avec Bullet Graph.
   */
  function renderCard(targetElement, customData = null, themeName = DEFAULT_THEME) {
    const el = typeof targetElement === 'string' && typeof document !== 'undefined'
      ? document.getElementById(targetElement)
      : targetElement;

    if (!el) return null;

    const tokens = getThemeTokens(themeName, el);
    const data = Object.assign({}, DEFAULT_DATA, customData || {});
    const canvasId = 'kpi-bullet-canvas-' + Math.random().toString(36).substr(2, 9);

    const actual = data.value;
    const target = data.target;
    const attainment = Math.round((actual / target) * 100);
    const isSuccess = attainment >= 100;
    const isWarning = attainment >= 80 && attainment < 100;

    const statusColor = isSuccess
      ? (tokens.semantic?.positive || '#2E7D32')
      : (isWarning ? (tokens.palette[0] || '#2B8CBE') : (tokens.semantic?.warning || '#EF6C00'));

    const badgeBg = hexToRgba(statusColor, tokens.isDark ? 0.18 : 0.10);
    const badgeBorder = hexToRgba(statusColor, tokens.isDark ? 0.35 : 0.25);

    el.innerHTML = `
      <div class="kpi-card kpi-card--bullet" style="
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
        min-height: 195px;
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
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            flex-shrink: 0;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 700;
            line-height: 1.15;
            white-space: nowrap;
            font-variant-numeric: tabular-nums;
            background: ${badgeBg};
            color: ${statusColor};
            border: 1px solid ${badgeBorder};
          ">
            <span style="display: block; text-align: center;">${attainment}%</span>
            <span style="display: block; font-size: 0.675rem; font-weight: 600; text-align: center;">Atteint</span>
          </span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.35rem;">
          <div style="
            font-size: 2.1rem;
            font-weight: 800;
            line-height: 1.1;
            letter-spacing: -0.03em;
            color: ${tokens.textPrimary};
            font-variant-numeric: tabular-nums;
          ">
            ${actual.toLocaleString('fr-FR')} <span style="font-size: 1.25rem; font-weight: 500; color: ${tokens.textMuted};">${data.unit || ''}</span>
          </div>
          <div style="font-size: 0.78125rem; font-weight: 600; color: ${tokens.textMuted}; text-align: right;">
            Cible : ${target.toLocaleString('fr-FR')} ${data.unit || ''}
          </div>
        </div>

        <!-- Zone Micro-Canvas Bullet -->
        <div style="position: relative; width: 100%; height: 38px; margin: 0.35rem 0;">
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

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/00-kpi-card/kpi-comparative
  // --------------------------------------------------------------------------
  global.KitCharts["kpi-comparative"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

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

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/00-kpi-card/kpi-composite
  // --------------------------------------------------------------------------
  global.KitCharts["kpi-composite"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return d >= 0 ? '#2E7D32' : '#C62828'; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  const DEFAULT_DATA = {
    title: 'Chiffre d\'Affaires E-Commerce',
    value: 842500,
    unit: '€',
    delta: 18.4,
    deltaLabel: 'vs N-1 (711 500 €)',
    metricType: 'gain',
    drivers: [
      { label: 'Commandes', value: 10240, unit: '', delta: 12.1, deltaUnit: '%' },
      { label: 'Panier Moyen', value: 82.27, unit: '€', delta: 5.6, deltaUnit: '%' },
      { label: 'Tx Conv.', value: 3.42, unit: '%', delta: -0.2, deltaUnit: 'pt' }
    ],
    footnote: 'Équation : CA = Commandes × Panier Moyen'
  };

  /**
   * Crée et initialise un micro-bar Chart.js pour visualiser les 3 drivers.
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
    const drivers = data.drivers || DEFAULT_DATA.drivers;

    const bgColors = drivers.map(d => {
      const isPos = d.delta >= 0;
      return getValenceColor(tokens, isPos ? 1 : -1, 'gain');
    });

    if (typeof Chart === 'undefined') return null;

    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: drivers.map(d => d.label),
        datasets: [{
          data: drivers.map(d => d.delta),
          backgroundColor: bgColors,
          borderRadius: 4,
          barThickness: 16
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
              label: (ctx) => `Variation : ${ctx.parsed.x > 0 ? '+' : ''}${ctx.parsed.x}%`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 10, family: tokens.fontMono }, color: tokens.textSecondary }
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 11, family: tokens.fontFamily }, color: tokens.textPrimary }
          }
        }
      }
    });

    return chart;
  }

  /**
   * Rendu complet du composant DOM de la KPI Card Composite.
   */
  function renderCard(targetElement, customData = null, themeName = DEFAULT_THEME) {
    const el = typeof targetElement === 'string' && typeof document !== 'undefined'
      ? document.getElementById(targetElement)
      : targetElement;

    if (!el) return null;

    const tokens = getThemeTokens(themeName, el);
    const data = Object.assign({}, DEFAULT_DATA, customData || {});
    const drivers = data.drivers || DEFAULT_DATA.drivers;
    const isDark = Boolean(tokens.isDark);

    const isPositive = data.delta >= 0;
    const valence = isPositive ? 1 : -1;
    const valenceColor = getValenceColor(tokens, valence, data.metricType || 'gain');
    const badgeBg = hexToRgba(valenceColor, isDark ? 0.18 : 0.10);
    const badgeBorder = hexToRgba(valenceColor, isDark ? 0.35 : 0.25);

    // Génération des 3 colonnes drivers
    const driversHtml = drivers.map(drv => {
      const drvPos = drv.delta >= 0;
      const drvColor = getValenceColor(tokens, drvPos ? 1 : -1, 'gain');
      const valStr = typeof drv.value === 'number' ? drv.value.toLocaleString('fr-FR') : String(drv.value);
      return `
        <div style="display: flex; flex-direction: column; gap: 2px;">
          <span style="font-size: 0.6875rem; font-weight: 600; color: ${tokens.textMuted}; text-transform: uppercase;">
            ${drv.label}
          </span>
          <span style="font-size: 1.05rem; font-weight: 700; color: ${tokens.textPrimary}; font-variant-numeric: tabular-nums;">
            ${valStr} <span style="font-size: 0.75rem; font-weight: 500; color: ${tokens.textMuted};">${drv.unit || ''}</span>
          </span>
          <span style="font-size: 0.7rem; font-weight: 700; color: ${drvColor}; font-variant-numeric: tabular-nums;">
            ${drvPos ? '▲ +' : '▼ '}${drv.delta}${drv.deltaUnit || '%'}
          </span>
        </div>
      `;
    }).join('');

    el.innerHTML = `
      <div class="kpi-card kpi-card--composite" style="
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
        min-height: 220px;
        position: relative;
        transition: all 0.2s ease;
      ">
        <!-- En-tête Hero -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 0.4rem;">
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

        <!-- Valeur Hero -->
        <div style="margin-bottom: 0.6rem;">
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
          <div style="font-size: 0.75rem; color: ${tokens.textMuted}; margin-top: 2px;">
            ${data.deltaLabel}
          </div>
        </div>

        <!-- Séparateur Subtil -->
        <div style="
          width: 100%;
          height: 1px;
          background: ${tokens.gridColor || tokens.border};
          margin-bottom: 0.6rem;
        "></div>

        <!-- Grille des Drivers Liés -->
        <div style="
          display: grid;
          grid-template-columns: repeat(${drivers.length}, 1fr);
          gap: 10px;
          margin-bottom: 0.4rem;
        ">
          ${driversHtml}
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

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/00-kpi-card/kpi-distribution
  // --------------------------------------------------------------------------
  global.KitCharts["kpi-distribution"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

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

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/00-kpi-card/kpi-sparkline
  // --------------------------------------------------------------------------
  global.KitCharts["kpi-sparkline"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

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

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/00-kpi-card/kpi-standard
  // --------------------------------------------------------------------------
  global.KitCharts["kpi-standard"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return d >= 0 ? '#2E7D32' : '#C62828'; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Données représentatives par défaut (Revenu Mensuel Récurrent - MRR)
   */
  const DEFAULT_DATA = {
    title: 'Revenu Mensuel Récurrent (MRR)',
    value: 142850,
    unit: '€',
    format: 'currency',
    delta: 14.2,
    deltaLabel: 'vs mois précédent (125 080 €)',
    metricType: 'gain', // 'gain' (ex: CA, profit) ou 'cost' (ex: churn, coûts, délai)
    footnote: 'Mise à jour aujourd\'hui • Clôture M-1 confirmée',
    benchmark: 125080,
    history: [118000, 121500, 120200, 124000, 122800, 125080, 142850]
  };

  /**
   * Formate une valeur numérique avec séparateurs de milliers et chiffres tabulaires.
   */
  function formatValue(val, format, unit) {
    if (typeof val !== 'number') return String(val);
    let str = val.toLocaleString('fr-FR', { maximumFractionDigits: 1 });
    if (unit) str += ' ' + unit;
    return str;
  }

  /**
   * Rendu Canvas Chart.js d'une micro-jauge / anneau de complétion stylisé et moderne.
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

    const valence = data.delta > 0 ? 1 : (data.delta < 0 ? -1 : 0);
    const valenceColor = getValenceColor(tokens, valence, data.metricType || 'gain');
    const primaryColor = getColor(tokens, 0);

    // Dessin d'une micro-visualisation en anneau avec Chart.js
    if (typeof Chart === 'undefined') return null;

    const progressRatio = data.benchmark ? Math.min(100, Math.round((data.value / data.benchmark) * 100)) : 100;
    const isDark = Boolean(tokens.isDark);

    const chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Réalisé', 'Reste'],
        datasets: [{
          data: [progressRatio, Math.max(0, 100 - progressRatio)],
          backgroundColor: [
            valenceColor,
            isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.06)'
          ],
          borderWidth: 0,
          cutout: '80%',
          circumference: 260,
          rotation: 230
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
            callbacks: {
              label: (ctx) => `Atteinte : ${progressRatio}% (${formatValue(data.value, data.format, data.unit)})`
            }
          }
        }
      }
    });

    return chart;
  }

  /**
   * Rendu complet du composant HTML de la carte KPI avec gestion réactive du thème.
   */
  function renderCard(targetElement, customData = null, themeName = DEFAULT_THEME) {
    const el = typeof targetElement === 'string' && typeof document !== 'undefined'
      ? document.getElementById(targetElement)
      : targetElement;

    if (!el) return null;

    const tokens = getThemeTokens(themeName, el);
    const data = Object.assign({}, DEFAULT_DATA, customData || {});

    const isPositive = data.delta >= 0;
    const valence = isPositive ? 1 : -1;
    const valenceColor = getValenceColor(tokens, valence, data.metricType || 'gain');
    const badgeBg = hexToRgba(valenceColor, tokens.isDark ? 0.18 : 0.10);
    const badgeBorder = hexToRgba(valenceColor, tokens.isDark ? 0.35 : 0.25);
    const arrowGlyph = isPositive ? '▲' : '▼';
    const deltaSign = isPositive ? '+' : '';

    el.innerHTML = `
      <div class="kpi-card" style="
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
        min-height: 160px;
        position: relative;
        transition: all 0.2s ease;
      ">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 0.75rem;">
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
          <div style="
            font-size: 0.8125rem;
            color: ${tokens.textMuted};
            margin-top: 0.35rem;
          ">
            ${data.deltaLabel}
          </div>
        </div>

        ${data.footnote ? `
        <div style="
          padding-top: 0.6rem;
          border-top: 1px solid ${tokens.gridColor || tokens.border};
          font-size: 0.725rem;
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

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/00-kpi-card/kpi-status-alert
  // --------------------------------------------------------------------------
  global.KitCharts["kpi-status-alert"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function(t, s) { return '#999999'; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function(v, tr, th, p, t) {
    return { status: 'warning', color: '#EF6C00', label: 'Attention' };
  };
  const resolveThresholds = (KitChartsTheme && KitChartsTheme.resolveThresholds) || (typeof window !== 'undefined' && window.resolveThresholds) || null;
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  const DEFAULT_DATA = {
    title: 'Latence Serveur P99',
    value: 142,
    unit: 'ms',
    target: 80,
    thresholds: {
      optimal: 50,
      nominal: 100,
      critical: 150
    },
    polarity: 'lower-is-better', // 'lower-is-better' ou 'higher-is-better'
    maxScale: 200,
    footnote: 'Seuil critique : > 150 ms • Action : Vérifier pool DB'
  };

  /**
   * Crée et initialise la jauge de seuil linéaire dans le canvas.
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

    const val = data.value;
    const maxVal = data.maxScale || 200;
    let tNominal = (data.thresholds && data.thresholds.nominal !== undefined) ? data.thresholds.nominal : 100;
    let tCritical = (data.thresholds && data.thresholds.critical !== undefined) ? data.thresholds.critical : 150;

    let resolvedProvenance = null;
    if (resolveThresholds) {
      const historyData = data.history || (Array.isArray(data.data) ? data.data : null);
      const explicitThresh = data.thresholds && data.thresholds.optimal !== undefined ? { target: data.target || data.thresholds.optimal, warning: data.thresholds.nominal, danger: data.thresholds.critical, polarity: data.polarity } : null;
      if (explicitThresh) {
        try {
          resolvedProvenance = resolveThresholds(historyData, explicitThresh, { polarity: data.polarity });
        } catch (e) {}
      } else if (options.autoThreshold !== false && data.autoThreshold !== false && historyData && historyData.length >= 5) {
        resolvedProvenance = resolveThresholds(historyData, null, { polarity: data.polarity });
        if (resolvedProvenance && resolvedProvenance.warning !== null) {
          tNominal = resolvedProvenance.warning;
          tCritical = resolvedProvenance.danger;
        }
      }
    }


    const normalColor = tokens.status?.success || tokens.semantic?.positive || '#2E7D32';
    const warningColor = tokens.status?.warning || tokens.semantic?.warning || '#EF6C00';
    const dangerColor = tokens.status?.danger || tokens.semantic?.negative || '#C62828';

    // Plugin custom pour le curseur pointeur
    const cursorPlugin = {
      id: 'thresholdCursorMarker',
      afterDatasetsDraw(chart) {
        const { ctx, chartArea, scales: { x } } = chart;
        if (!x) return;

        const cursorX = Math.min(chartArea.right, Math.max(chartArea.left, x.getPixelForValue(val)));
        const yMid = (chartArea.top + chartArea.bottom) / 2;

        ctx.save();
        // Ligne de repère
        ctx.strokeStyle = tokens.textPrimary || '#0F172A';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cursorX, chartArea.top - 2);
        ctx.lineTo(cursorX, chartArea.bottom + 2);
        ctx.stroke();

        // Curseur triangulaire au dessus
        ctx.fillStyle = tokens.textPrimary || '#0F172A';
        ctx.beginPath();
        ctx.moveTo(cursorX - 5, chartArea.top - 6);
        ctx.lineTo(cursorX + 5, chartArea.top - 6);
        ctx.lineTo(cursorX, chartArea.top - 1);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    };

    if (typeof Chart === 'undefined') return null;

    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Seuils'],
        datasets: [
          {
            label: 'Normal (<100ms)',
            data: [tNominal],
            backgroundColor: hexToRgba(normalColor, isDark ? 0.35 : 0.25),
            barThickness: 16,
            borderRadius: { topLeft: 4, bottomLeft: 4 }
          },
          {
            label: 'Attention (100-150ms)',
            data: [tCritical - tNominal],
            backgroundColor: hexToRgba(warningColor, isDark ? 0.35 : 0.25),
            barThickness: 16
          },
          {
            label: 'Critique (>150ms)',
            data: [maxVal - tCritical],
            backgroundColor: hexToRgba(dangerColor, isDark ? 0.35 : 0.25),
            barThickness: 16,
            borderRadius: { topRight: 4, bottomRight: 4 }
          }
        ]
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
              label: () => `Valeur courante : ${val} ${data.unit} (Seuil Nominal: ${tNominal}${data.unit}, Critique: ${tCritical}${data.unit})${resolvedProvenance ? ' • ' + resolvedProvenance.badge : ''}`
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            max: maxVal,
            display: false
          },
          y: {
            stacked: true,
            display: false
          }
        }
      },
      plugins: [cursorPlugin]
    });

    return chart;
  }

  /**
   * Rendu complet du composant DOM de la KPI Card Statut & Seuil d'Alerte.
   */
  function renderCard(targetElement, customData = null, themeName = DEFAULT_THEME) {
    const el = typeof targetElement === 'string' && typeof document !== 'undefined'
      ? document.getElementById(targetElement)
      : targetElement;

    if (!el) return null;

    const tokens = getThemeTokens(themeName, el);
    const data = Object.assign({}, DEFAULT_DATA, customData || {});
    const isDark = Boolean(tokens.isDark);
    const canvasId = 'kpi-status-canvas-' + Math.random().toString(36).substr(2, 9);

    const val = data.value;
    const tNominal = data.thresholds.nominal || 100;
    const tCritical = data.thresholds.critical || 150;

    let statusKey = 'success';
    let statusLabel = 'Optimal';
    let statusIcon = '✓';
    let statusColor = tokens.status?.success || tokens.semantic?.positive || '#2E7D32';

    if (data.polarity === 'lower-is-better') {
      if (val >= tCritical) {
        statusKey = 'danger';
        statusLabel = 'Critique';
        statusIcon = '⛔';
        statusColor = tokens.status?.danger || tokens.semantic?.negative || '#C62828';
      } else if (val >= tNominal) {
        statusKey = 'warning';
        statusLabel = 'Attention';
        statusIcon = '⚠️';
        statusColor = tokens.status?.warning || tokens.semantic?.warning || '#EF6C00';
      } else {
        statusKey = 'success';
        statusLabel = 'Nominal';
        statusIcon = '✓';
        statusColor = tokens.status?.success || tokens.semantic?.positive || '#2E7D32';
      }
    }

    const badgeBg = hexToRgba(statusColor, isDark ? 0.18 : 0.10);
    const badgeBorder = hexToRgba(statusColor, isDark ? 0.35 : 0.25);

    el.innerHTML = `
      <div class="kpi-card kpi-card--status" style="
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
        min-height: 205px;
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
            gap: 5px;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 700;
            font-variant-numeric: tabular-nums;
            background: ${badgeBg};
            color: ${statusColor};
            border: 1px solid ${badgeBorder};
          ">
            <span>${statusIcon}</span>
            <span>${statusLabel}</span>
          </span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.25rem;">
          <div style="
            font-size: 2.1rem;
            font-weight: 800;
            line-height: 1.1;
            letter-spacing: -0.03em;
            color: ${tokens.textPrimary};
            font-variant-numeric: tabular-nums;
          ">
            ${val.toLocaleString('fr-FR')} <span style="font-size: 1.25rem; font-weight: 500; color: ${tokens.textMuted};">${data.unit || ''}</span>
          </div>
          <div style="font-size: 0.75rem; color: ${tokens.textMuted}; font-weight: 500;">
            Plage nominale : &lt; ${tNominal} ${data.unit}
          </div>
        </div>

        <!-- Jauge Linéaire de Seuils -->
        <div style="position: relative; width: 100%; height: 32px; margin: 0.35rem 0;">
          <canvas id="${canvasId}" style="width: 100%; height: 100%; display: block;"></canvas>
        </div>

        ${data.footnote ? `
        <div style="
          padding-top: 0.4rem;
          border-top: 1px solid ${tokens.gridColor || tokens.border};
          font-size: 0.7rem;
          color: ${statusKey === 'danger' ? statusColor : tokens.textMuted};
          font-weight: ${statusKey === 'danger' ? '600' : 'normal'};
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

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/01-comparaison/bar-chart-horizontal
  // --------------------------------------------------------------------------
  global.KitCharts["bar-chart-horizontal"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function() { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function(t, o) { return o || {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 01-comparaison/bar-chart-horizontal/template.js
 * @description Template Chart.js v4+ pour Diagramme en Barres Horizontales (Horizontal Bar Chart).
 * Psychophysique: Idéal pour libellés longs (N=8-25) et élimination de la rotation textuelle.
 * Règle d'or: beginAtZero: true sur l'axe X, tri décroissant par magnitude, espacements Gestalt.
 */

/**
 * Données par défaut représentatives (Population des grandes métropoles mondiales en Millions)
 */
const DEFAULT_DATA = {
  labels: ['Tokyo', 'Delhi', 'Shanghai', 'São Paulo', 'Mexico', 'Le Caire', 'Mumbai', 'Pékin'],
  datasets: [{
    label: 'Population (Millions)',
    data: [37.4, 32.9, 29.2, 22.6, 22.3, 22.2, 21.3, 21.3]
  }]
};

/**
 * Crée et initialise un diagramme en barres horizontales dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @param {Object} [options={}] - Options additionnelles (ex: showDataLabels)
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  // Destruction propre de l'instance précédente
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  // Préparation des données avec support d'accentuation et tri cognitif
  const rawData = customData || DEFAULT_DATA;
  let labels = rawData.labels ? [...rawData.labels] : [];
  let datasets = (rawData.datasets || []).map((ds, idx) => {
    const dataLen = Array.isArray(ds.data) ? ds.data.length : labels.length;
    const primaryColor = getColor(tokens, idx);

    let bgColors = ds.backgroundColor;
    let borderColors = ds.borderColor;
    let borderWidths = ds.borderWidth;

    if (!bgColors || Array.isArray(ds.emphasisRoles) || Array.isArray(ds.roles) || Array.isArray(ds.valences) || ds.emphasisRole || ds.role || ds.metricType || ds.valence !== undefined || ds.focusIndex !== undefined) {
      if (Array.isArray(ds.emphasisRoles) || Array.isArray(ds.roles)) {
        const roles = ds.emphasisRoles || ds.roles;
        bgColors = roles.map(r => getEmphasisStyle(tokens, r).backgroundColor || primaryColor);
        borderColors = roles.map(r => getEmphasisStyle(tokens, r).borderColor || primaryColor);
      } else if (Array.isArray(ds.valences)) {
        const metricType = ds.metricType || 'gain';
        bgColors = ds.valences.map(v => getValenceColor(tokens, v, metricType));
        borderColors = bgColors;
      } else if (ds.focusIndex !== undefined) {
        bgColors = Array.from({ length: dataLen }, (_, i) =>
          i === ds.focusIndex ? (tokens.emphasis?.focal || primaryColor) : (tokens.emphasis?.context || tokens.textMuted || '#CBD5E1')
        );
        borderColors = bgColors;
      } else if (ds.emphasisRole || ds.role) {
        const style = getEmphasisStyle(tokens, ds.emphasisRole || ds.role);
        bgColors = ds.backgroundColor || style.backgroundColor || primaryColor;
        borderColors = ds.borderColor || style.borderColor || primaryColor;
      } else if (ds.valence !== undefined || ds.direction !== undefined) {
        const valColor = getValenceColor(tokens, ds.valence !== undefined ? ds.valence : ds.direction, ds.metricType || 'gain');
        bgColors = ds.backgroundColor || valColor;
        borderColors = ds.borderColor || valColor;
      } else {
        bgColors = ds.backgroundColor || primaryColor;
        borderColors = ds.borderColor || primaryColor;
      }
    }

    return {
      label: ds.label || `Série ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      backgroundColor: bgColors,
      borderColor: borderColors,
      borderWidth: typeof borderWidths === 'number' ? borderWidths : 0,
      borderRadius: isTufte ? 0 : 4,
      borderSkipped: false,
      categoryPercentage: typeof ds.categoryPercentage === 'number' ? ds.categoryPercentage : 0.8,
      barPercentage: typeof ds.barPercentage === 'number' ? ds.barPercentage : 0.9,
      sorted: ds.sorted !== undefined ? ds.sorted : true
    };
  });

  // Tri cognitif par magnitude décroissante si 1 seule série pour optimiser la charge perceptive
  if (datasets.length === 1 && labels.length > 0 && datasets[0].data.length === labels.length && datasets[0].sorted !== false) {
    const ds0 = datasets[0];
    const isBgArray = Array.isArray(ds0.backgroundColor);
    const isBorderArray = Array.isArray(ds0.borderColor);

    const pairs = labels.map((lbl, i) => ({
      label: lbl,
      val: ds0.data[i],
      bg: isBgArray ? ds0.backgroundColor[i] : ds0.backgroundColor,
      border: isBorderArray ? ds0.borderColor[i] : ds0.borderColor
    }));

    // Trier de manière décroissante
    pairs.sort((a, b) => {
      const va = typeof a.val === 'object' && a.val !== null ? (a.val.x ?? a.val.y ?? a.val.value ?? 0) : Number(a.val);
      const vb = typeof b.val === 'object' && b.val !== null ? (b.val.x ?? b.val.y ?? b.val.value ?? 0) : Number(b.val);
      return vb - va;
    });

    labels = pairs.map(p => p.label);
    ds0.data = pairs.map(p => p.val);
    if (isBgArray) {
      ds0.backgroundColor = pairs.map(p => p.bg);
    }
    if (isBorderArray) {
      ds0.borderColor = pairs.map(p => p.border);
    }
  }

  const chartData = { labels, datasets };

  // Options Chart.js v4+ avec indexAxis: 'y' et interaction Fitts sur axe Y
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'bar',
    data: chartData,
    options: {
      ...defaultOpts,
      indexAxis: 'y', // Orientation horizontale
      _kitChartsTokens: tokens,
      showDataLabels: showDataLabels,
      layout: {
        padding: {
          right: 28
        }
      },
      animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'index',
        intersect: false,
        axis: 'y'
      },
      hover: {
        mode: 'index',
        intersect: false,
        axis: 'y',
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 100
      },
      categoryPercentage: 0.8,
      barPercentage: 0.9,
      plugins: {
        ...defaultOpts.plugins,
        datalabels: getDataLabelOptions(tokens, {
          display: showDataLabels,
          formatter: (val) => {
            if (typeof val === 'number' && Math.abs(val) >= 1000) {
              return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
            }
            return val;
          }
        }),
        legend: {
          ...defaultOpts.plugins.legend,
          display: datasets.length > 1 && !isTufte
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono || 'monospace',
            size: 12,
            weight: '400'
          },
          animation: (isTufte || isReducedMotionPreferred()) ? false : { duration: 150, easing: 'easeOutQuad' },
          callbacks: {
            label: (context) => {
              const val = context.parsed.x !== null && context.parsed.x !== undefined
                ? context.parsed.x
                : context.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val)
                : val;
              return ` ${context.dataset.label || ''}: ${formatted}`;
            }
          }
        }
      },
      scales: {
        y: {
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 8
          }
        },
        x: {
          beginAtZero: true, // Règle psychophysique obligatoire pour encodage horizontal
          grace: '15%',
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontMono || tokens.fontFamily,
              size: 11
            },
            padding: 6,
            callback: (val) => {
              if (typeof val === 'number' && Math.abs(val) >= 1000) {
                return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
              }
              return val;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Simulation mock pour environnement Node.js headless
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    isReducedMotionPreferred: typeof isReducedMotionPreferred === 'function' ? isReducedMotionPreferred : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getPartitionInteractionOptions: typeof getPartitionInteractionOptions === 'function' ? getPartitionInteractionOptions : null,
    computeAntiOcclusionTooltipPosition: typeof computeAntiOcclusionTooltipPosition === 'function' ? computeAntiOcclusionTooltipPosition : null,
    getDataLabelOptions: typeof getDataLabelOptions === 'function' ? getDataLabelOptions : null,
    formatLabelValue: typeof formatLabelValue === 'function' ? formatLabelValue : null,
    kitChartsDataLabelsPlugin: typeof kitChartsDataLabelsPlugin !== 'undefined' ? kitChartsDataLabelsPlugin : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/01-comparaison/bar-chart-vertical
  // --------------------------------------------------------------------------
  global.KitCharts["bar-chart-vertical"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function() { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function(t, o) { return o || {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 01-comparaison/bar-chart-vertical/template.js
 * @description Template Chart.js v4+ pour Diagramme en Barres Verticales (Column Chart).
 * Psychophysique: Encodage par position sur échelle commune (Rang 1 Cleveland-McGill) + longueur 1D.
 * Règle d'or: beginAtZero: true absolu sur l'axe Y, espacements Gestalt (0.8 / 0.9), tabular nums.
 */

/**
 * Données par défaut représentatives (PIB des principales économies européennes en Mds €)
 */
const DEFAULT_DATA = {
  labels: ['France', 'Allemagne', 'Royaume-Uni', 'Italie', 'Espagne', 'Pays-Bas', 'Belgique'],
  datasets: [{
    label: 'PIB (Mds €)',
    data: [2800, 2600, 2400, 1900, 1400, 950, 520]
  }]
};

/**
 * Crée et initialise un diagramme en barres verticales dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @param {Object} [options={}] - Options additionnelles (ex: showDataLabels)
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  // Destruction propre de l'instance précédente
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  if (options.logScale || (options.scales && options.scales.y && options.scales.y.type === 'logarithmic')) {
    throw new Error('kit-charts: log scale is forbidden on length-encoded bar charts');
  }

  let statHelpers;
  try {
    statHelpers = typeof require === 'function' ? require('../../../themes/stat-helpers.js') : (typeof window !== 'undefined' ? window.KitChartsStats : null);
  } catch (e) {
    try {
      statHelpers = typeof require === 'function' ? require('../../themes/stat-helpers.js') : (typeof window !== 'undefined' ? window.KitChartsStats : null);
    } catch (e2) {}
  }

  const ebOption = options.errorBars || (customData && customData.errorBars);
  if (ebOption && ebOption.confidence !== undefined) {
    if (typeof ebOption.confidence !== 'number' || ebOption.confidence < 0.80 || ebOption.confidence > 0.99) {
      throw new Error('kit-charts: confidence must be bounded to [0.80, 0.99]');
    }
  }

  // Préparation des données avec support de l'accentuation sémantique et de la valence
  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];
  let ciOverlapAnalysis = null;

  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const rawDataArr = Array.isArray(ds.data) ? ds.data : [];
    const dataLen = rawDataArr.length || labels.length;
    const primaryColor = getColor(tokens, idx);

    // Extraction des barres d'erreur / calcul CI95 si données brutes imbriquées
    let errorBarsData = ds.errorBarsData || (ebOption && ebOption.explicit) || null;
    let computedData = [...rawDataArr];

    if (rawDataArr.some(item => Array.isArray(item))) {
      const computedCIs = rawDataArr.map(item => {
        if (Array.isArray(item) && statHelpers && typeof statHelpers.ci95 === 'function') {
          return statHelpers.ci95(item, ebOption?.confidence || 0.95);
        }
        return null;
      });
      computedData = rawDataArr.map((item, i) => Array.isArray(item) ? (computedCIs[i]?.mean ?? 0) : item);
      errorBarsData = computedCIs.map(ci => ci ? { low: ci.low, high: ci.high } : null);

      // Garde-fou de valence sur IC chevauchants (Cumming & Finch 2005)
      if (computedCIs.length >= 2 && computedCIs[0] && computedCIs[1] && statHelpers && typeof statHelpers.checkCIOverlap === 'function') {
        ciOverlapAnalysis = statHelpers.checkCIOverlap(computedCIs[0], computedCIs[1]);
      }
    }

    // Résolution des couleurs par barre si accentuation ou valence spécifiée
    let bgColors = ds.backgroundColor;
    let borderColors = ds.borderColor;
    let borderWidths = ds.borderWidth;

    const hasOverlapNeutral = ciOverlapAnalysis && !ciOverlapAnalysis.isSignificant;

    if (!bgColors || Array.isArray(ds.emphasisRoles) || Array.isArray(ds.roles) || Array.isArray(ds.valences) || ds.emphasisRole || ds.role || ds.metricType || ds.valence !== undefined || ds.focusIndex !== undefined || hasOverlapNeutral) {
      if (hasOverlapNeutral) {
        const neutralColor = tokens.status?.neutral || tokens.emphasis?.context || '#8E9AAF';
        bgColors = neutralColor;
        borderColors = neutralColor;
      } else if (Array.isArray(ds.emphasisRoles) || Array.isArray(ds.roles)) {
        const roles = ds.emphasisRoles || ds.roles;
        bgColors = roles.map(r => getEmphasisStyle(tokens, r).backgroundColor || primaryColor);
        borderColors = roles.map(r => getEmphasisStyle(tokens, r).borderColor || primaryColor);
      } else if (Array.isArray(ds.valences)) {
        const metricType = ds.metricType || 'gain';
        bgColors = ds.valences.map(v => getValenceColor(tokens, v, metricType));
        borderColors = bgColors;
      } else if (ds.focusIndex !== undefined) {
        bgColors = Array.from({ length: dataLen }, (_, i) =>
          i === ds.focusIndex ? (tokens.emphasis?.focal || primaryColor) : (tokens.emphasis?.context || tokens.textMuted || '#CBD5E1')
        );
        borderColors = bgColors;
      } else if (ds.emphasisRole || ds.role) {
        const style = getEmphasisStyle(tokens, ds.emphasisRole || ds.role);
        bgColors = ds.backgroundColor || style.backgroundColor || primaryColor;
        borderColors = ds.borderColor || style.borderColor || primaryColor;
      } else if (ds.valence !== undefined || ds.direction !== undefined) {
        const valColor = getValenceColor(tokens, ds.valence !== undefined ? ds.valence : ds.direction, ds.metricType || 'gain');
        bgColors = ds.backgroundColor || valColor;
        borderColors = ds.borderColor || valColor;
      } else {
        bgColors = ds.backgroundColor || primaryColor;
        borderColors = ds.borderColor || primaryColor;
      }
    }

    return {
      label: ds.label || `Série ${idx + 1}`,
      data: computedData,
      errorBarsData,
      backgroundColor: bgColors,
      borderColor: borderColors,
      borderWidth: typeof borderWidths === 'number' ? borderWidths : (Array.isArray(borderWidths) ? borderWidths : 0),
      borderRadius: isTufte ? 0 : 4,
      borderSkipped: false,
      categoryPercentage: typeof ds.categoryPercentage === 'number' ? ds.categoryPercentage : 0.8,
      barPercentage: typeof ds.barPercentage === 'number' ? ds.barPercentage : 0.9
    };
  });

  const chartData = { labels, datasets };

  // Options Chart.js v4+ avec respect des règles psychophysiques (Fitts, Mayer, WCAG 2.2)
  const defaultOpts = getChartDefaultOptions(tokens);
  const pluginsList = [];
  if (ebOption && statHelpers && statHelpers.errorBarsPlugin) {
    pluginsList.push(statHelpers.errorBarsPlugin);
  }

  const config = {
    type: 'bar',
    data: chartData,
    plugins: pluginsList,
    options: {
      ...defaultOpts,
      _kitChartsTokens: tokens,
      showDataLabels: showDataLabels,
      layout: {
        padding: {
          top: 16
        }
      },
      animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'index',
        intersect: false,
        axis: 'x'
      },
      hover: {
        mode: 'index',
        intersect: false,
        axis: 'x',
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 100
      },
      categoryPercentage: 0.8,
      barPercentage: 0.9,
      plugins: {
        ...defaultOpts.plugins,
        datalabels: getDataLabelOptions(tokens, {
          display: showDataLabels,
          formatter: (val) => {
            if (typeof val === 'number' && Math.abs(val) >= 1000) {
              return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
            }
            return val;
          }
        }),
        legend: {
          ...defaultOpts.plugins?.legend,
          display: datasets.length > 1 && !isTufte
        },
        tooltip: {
          ...defaultOpts.plugins?.tooltip,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono || 'monospace',
            size: 12,
            weight: '400'
          },
          animation: (isTufte || isReducedMotionPreferred()) ? false : { duration: 150, easing: 'easeOutQuad' },
          callbacks: {
            label: (context) => {
              const val = context.parsed.y !== null && context.parsed.y !== undefined
                ? context.parsed.y
                : context.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val)
                : val;
              const lines = [` ${context.dataset.label || ''}: ${formatted}`];
              const eb = context.dataset.errorBarsData && context.dataset.errorBarsData[context.dataIndex];
              if (eb && eb.low !== undefined && eb.high !== undefined) {
                const overlapNotice = (ciOverlapAnalysis && !ciOverlapAnalysis.isSignificant) ? ' — Δ non significative (IC95 chevauchants)' : '';
                lines.push(` IC95%: [${eb.low.toFixed(1)} — ${eb.high.toFixed(1)}]${overlapNotice}`);
              }
              return lines;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 6
          }
        },
        y: {
          beginAtZero: true, // Règle psychophysique obligatoire pour encodage par longueur
          grace: '10%',
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontMono || tokens.fontFamily,
              size: 11
            },
            padding: 8,
            callback: (val) => {
              if (typeof val === 'number' && Math.abs(val) >= 1000) {
                return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
              }
              return val;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    const chartInstance = new Chart(canvas, config);
    chartInstance.$ciOverlapAnalysis = ciOverlapAnalysis;
    return chartInstance;
  }

  // Simulation mock pour environnement Node.js headless
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    $ciOverlapAnalysis: ciOverlapAnalysis,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    isReducedMotionPreferred: typeof isReducedMotionPreferred === 'function' ? isReducedMotionPreferred : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getPartitionInteractionOptions: typeof getPartitionInteractionOptions === 'function' ? getPartitionInteractionOptions : null,
    computeAntiOcclusionTooltipPosition: typeof computeAntiOcclusionTooltipPosition === 'function' ? computeAntiOcclusionTooltipPosition : null,
    getDataLabelOptions: typeof getDataLabelOptions === 'function' ? getDataLabelOptions : null,
    formatLabelValue: typeof formatLabelValue === 'function' ? formatLabelValue : null,
    kitChartsDataLabelsPlugin: typeof kitChartsDataLabelsPlugin !== 'undefined' ? kitChartsDataLabelsPlugin : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/01-comparaison/bar-target-overlay
  // --------------------------------------------------------------------------
  global.KitCharts["bar-target-overlay"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

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

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/01-comparaison/bullet-chart
  // --------------------------------------------------------------------------
  global.KitCharts["bullet-chart"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function() { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const resolveThresholds = (KitChartsTheme && KitChartsTheme.resolveThresholds) || (typeof window !== 'undefined' && window.resolveThresholds) || null;
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };

  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function(t, o) { return o || {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 01-comparaison/bullet-chart/template.js
 * @description Template Chart.js v4+ pour Graphique à Puces (Stephen Few Bullet Chart).
 * Psychophysique: Remplacement compact et dense des cadrans/jauges analogiques.
 * Règle d'or: beginAtZero: true sur X, bande de performance, seuils qualitatifs et cible.
 */

/**
 * Données par défaut représentatives (Performance commerciale vs objectifs et paliers)
 */
const DEFAULT_DATA = {
  labels: ['Ventes EMEA', 'Ventes APAC', 'Ventes AMER'],
  datasets: [
    { label: 'Réalisé', data: [275, 185, 310] },
    { label: 'Objectif', data: [250, 200, 300] },
    { label: 'Excellent', data: [300, 250, 350] },
    { label: 'Moyen', data: [200, 150, 250] },
    { label: 'Faible', data: [100, 75, 120] }
  ]
};

/**
 * Crée et initialise un graphique à puces (Bullet Chart) dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @param {Object} [options={}] - Options additionnelles (ex: showDataLabels)
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  // Destruction propre de l'instance précédente
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isDark = Boolean(tokens.isDark);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  // Préparation des données
  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];
  const rawDatasets = rawData.datasets || [];

  const focalStyle = getEmphasisStyle(tokens, 'focal');
  const benchmarkStyle = getEmphasisStyle(tokens, 'benchmark');

  const datasets = rawDatasets.map((ds, idx) => {
    const label = (ds.label || '').toLowerCase();
    const primaryColor = focalStyle.backgroundColor || getColor(tokens, 0);

    // 1. Barre de performance principale (Réalisé)
    if (label.includes('réalisé') || label.includes('actual') || idx === 0) {
      let bg = ds.backgroundColor;
      if (!bg) {
        if (ds.emphasisRole || ds.role) {
          bg = getEmphasisStyle(tokens, ds.emphasisRole || ds.role).backgroundColor;
        } else if (ds.metricType || ds.valence !== undefined) {
          bg = getValenceColor(tokens, ds.valence !== undefined ? ds.valence : 1, ds.metricType || 'gain');
        } else {
          bg = primaryColor;
        }
      }

      return {
        label: ds.label || 'Réalisé',
        type: 'bar',
        data: Array.isArray(ds.data) ? [...ds.data] : [],
        backgroundColor: bg,
        borderColor: ds.borderColor || bg,
        borderWidth: 0,
        borderRadius: isTufte ? 0 : 3,
        barPercentage: 0.45,
        categoryPercentage: 0.8,
        order: 1
      };
    }

    // 2. Marqueur d'objectif cible (Objectif / Target / Cible / Benchmark)
    if (label.includes('objectif') || label.includes('target') || label.includes('cible') || label.includes('benchmark') || idx === 1) {
      const benchmarkColor = benchmarkStyle.borderColor || tokens.emphasis?.benchmark || tokens.textPrimary;
      return {
        label: ds.label || 'Objectif',
        type: 'scatter',
        data: (Array.isArray(ds.data) ? ds.data : []).map((val, i) => ({
          x: typeof val === 'object' && val !== null ? (val.x ?? val.value ?? 0) : Number(val),
          y: labels[i] || i
        })),
        backgroundColor: benchmarkColor,
        borderColor: benchmarkColor,
        pointStyle: 'line',
        pointRotation: 90,
        pointRadius: 12,
        pointHoverRadius: 14,
        borderWidth: 3,
        order: 0
      };
    }

    // 3. Paliers de contexte qualitatif (Bandes de fond)
    const bandColor = isDark ? '#4C566A' : '#CBD5E1';
    const alertBorderColor = isDark ? '#4C566A' : '#CBD5E1';

    return {
      label: ds.label || `Palier ${idx}`,
      type: 'bar',
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      backgroundColor: ds.backgroundColor || bandColor,
      borderColor: ds.borderColor || alertBorderColor,
      borderWidth: 0,
      borderRadius: 0,
      barPercentage: 0.85,
      categoryPercentage: 0.8,
      order: 10 + idx
    };
  });

  const chartData = { labels, datasets };

  // Options Chart.js v4+
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'bar',
    data: chartData,
    options: {
      ...defaultOpts,
      indexAxis: 'y', // Orientation horizontale Stephen Few
      animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'index',
        intersect: false,
        axis: 'y'
      },
      hover: {
        mode: 'index',
        intersect: false,
        axis: 'y',
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 100
      },
      categoryPercentage: 0.8,
      barPercentage: 0.9,
      plugins: {
        ...defaultOpts.plugins,
        datalabels: getDataLabelOptions(tokens, {
          display: showDataLabels,
          anchor: 'end',
          align: 'right',
          offset: 8,
          clip: false,
          color: isDark ? '#ECEFF4' : '#0F172A',
          font: {
            family: tokens.fontMono || 'monospace',
            size: 11,
            weight: '600'
          },
          formatter: (val, ctx) => {
            // Only label dataset 0 (Réalisé)
            if (ctx && ctx.datasetIndex !== 0) return null;
            const rawVal = typeof val === 'object' && val !== null ? (val.x ?? val.value ?? 0) : val;
            if (typeof rawVal === 'number') {
              return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(rawVal) + ' MW';
            }
            return String(rawVal || '');
          }
        }),
        legend: {
          ...defaultOpts.plugins.legend,
          display: !isTufte,
          position: 'top',
          align: 'end',
          labels: {
            usePointStyle: true,
            boxWidth: 10,
            boxHeight: 10,
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              size: 11,
              weight: '500'
            }
          }
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          usePointStyle: true,
          boxWidth: 10,
          boxHeight: 10,
          boxPadding: 4,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono || 'monospace',
            size: 12,
            weight: '400'
          },
          animation: (isTufte || isReducedMotionPreferred()) ? false : { duration: 150, easing: 'easeOutQuad' },
          callbacks: {
            title: (items) => {
              if (!items || items.length === 0) return '';
              return items[0].label || '';
            },
            label: (context) => {
              const ds = context.dataset;
              const rawVal = context.raw;
              const val = typeof rawVal === 'object' && rawVal !== null
                ? (rawVal.x ?? rawVal.y ?? 0)
                : rawVal;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(val)
                : val;
              return ` ${ds.label || ''}: ${formatted}`;
            },
            labelColor: (context) => {
              const ds = context.dataset;
              const bg = Array.isArray(ds.backgroundColor) ? ds.backgroundColor[context.dataIndex] : ds.backgroundColor;
              const border = Array.isArray(ds.borderColor) ? ds.borderColor[context.dataIndex] : (ds.borderColor || bg);
              return {
                borderColor: border,
                backgroundColor: bg,
                borderWidth: 1,
                borderRadius: 2
              };
            },
            labelPointStyle: (context) => {
              return {
                pointStyle: 'circle',
                rotation: 0
              };
            }
          }
        }
      },
      scales: {
        y: {
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 8
          }
        },
        x: {
          beginAtZero: true, // Règle psychophysique obligatoire
          grace: '15%', // Espace suffisant pour les étiquettes à droite
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontMono || tokens.fontFamily,
              size: 11
            },
            padding: 6,
            callback: (val) => {
              if (typeof val === 'number' && Math.abs(val) >= 1000) {
                return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
              }
              return val;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Simulation mock pour environnement Node.js headless
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    isReducedMotionPreferred: typeof isReducedMotionPreferred === 'function' ? isReducedMotionPreferred : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getPartitionInteractionOptions: typeof getPartitionInteractionOptions === 'function' ? getPartitionInteractionOptions : null,
    computeAntiOcclusionTooltipPosition: typeof computeAntiOcclusionTooltipPosition === 'function' ? computeAntiOcclusionTooltipPosition : null,
    getDataLabelOptions: typeof getDataLabelOptions === 'function' ? getDataLabelOptions : null,
    formatLabelValue: typeof formatLabelValue === 'function' ? formatLabelValue : null,
    kitChartsDataLabelsPlugin: typeof kitChartsDataLabelsPlugin !== 'undefined' ? kitChartsDataLabelsPlugin : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/01-comparaison/dumbbell-chart
  // --------------------------------------------------------------------------
  global.KitCharts["dumbbell-chart"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function() { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function(t, o) { return o || {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 01-comparaison/dumbbell-chart/template.js
 * @description Template Chart.js v4+ pour Graphique en Haltères (Dumbbell Plot / Connected Dot Plot).
 * Psychophysique: Comparaison bivariée Avant/Après ou Écart A/B par entité avec ligne de liaison.
 * Règle d'or: Points contrastés, ligne de liaison claire, axe catégoriel vertical pour libellés lisibles.
 */

/**
 * Données par défaut représentatives (Évolution budgétaire par ministère en Mds €)
 */
const DEFAULT_DATA = {
  labels: ['Santé', 'Éducation', 'Défense', 'Infrastructures', 'Recherche'],
  datasets: [
    { label: 'Budget Initial', data: [45, 38, 32, 28, 15] },
    { label: 'Budget Final', data: [58, 46, 39, 31, 24] }
  ]
};

/**
 * Plugin inline pour tracer la barre de liaison (connector line) entre les deux points de chaque haltère
 * et afficher les étiquettes de données latérales sans chevauchement.
 */
const dumbbellConnectorPlugin = {
  id: 'dumbbellConnectorPlugin',
  beforeDatasetsDraw(chart) {
    const { ctx } = chart;
    const meta0 = chart.getDatasetMeta(0);
    const meta1 = chart.getDatasetMeta(1);

    if (!meta0 || !meta1 || meta0.hidden || meta1.hidden) return;

    const count = Math.min(meta0.data.length, meta1.data.length);
    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = chart.options.scales?.x?.grid?.color || 'rgba(148, 163, 184, 0.4)';

    for (let i = 0; i < count; i++) {
      const p0 = meta0.data[i];
      const p1 = meta1.data[i];
      if (p0 && p1) {
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
      }
    }
    ctx.restore();
  },
  afterDatasetsDraw(chart) {
    const showLabels = chart.options?.plugins?.datalabels?.display !== false && chart.options?.showDataLabels !== false && chart.config?.showDataLabels !== false;
    if (!showLabels) return;
    const { ctx } = chart;
    const tokens = chart.options?._kitChartsTokens || getThemeTokens(DEFAULT_THEME);
    const meta0 = chart.getDatasetMeta(0);
    const meta1 = chart.getDatasetMeta(1);
    if (!meta0 || !meta1 || meta0.hidden || meta1.hidden) return;

    const count = Math.min(meta0.data.length, meta1.data.length);
    ctx.save();
    ctx.font = `600 11px ${tokens.fontMono || 'monospace'}`;

    for (let i = 0; i < count; i++) {
      const p0 = meta0.data[i];
      const p1 = meta1.data[i];
      const raw0 = chart.data.datasets[0]?.data?.[i];
      const raw1 = chart.data.datasets[1]?.data?.[i];
      const v0 = typeof raw0 === 'object' && raw0 !== null ? raw0.x : raw0;
      const v1 = typeof raw1 === 'object' && raw1 !== null ? raw1.x : raw1;

      if (!p0 || !p1) continue;

      const dx = Math.abs(p1.x - p0.x);
      const isClose = dx < 36;

      if (v0 !== undefined && v0 !== null) {
        ctx.fillStyle = chart.data.datasets[0]?.backgroundColor || tokens.palette[1] || '#E66101';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(String(v0), p0.x, p0.y - 8);
      }

      if (v1 !== undefined && v1 !== null) {
        ctx.fillStyle = chart.data.datasets[1]?.backgroundColor || tokens.palette[0] || '#2B8CBE';
        ctx.textAlign = 'center';
        ctx.textBaseline = isClose ? 'top' : 'bottom';
        const yOffset = isClose ? 14 : -8;
        ctx.fillText(String(v1), p1.x, p1.y + yOffset);
      }
    }
    ctx.restore();
  }
};

/**
 * Crée et initialise un diagramme en haltères (Dumbbell Chart) dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @param {Object} [options={}] - Options additionnelles (ex: showDataLabels)
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  // Destruction propre de l'instance précédente
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  // Préparation des données avec support de l'accentuation et de la valence
  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : ['A', 'B', 'C', 'D', 'E'];
  const rawDatasets = rawData.datasets || [];

  const datasets = rawDatasets.map((ds, idx) => {
    const defaultColor = idx === 0 ? (tokens.palette[1] || '#E66101') : (tokens.palette[0] || '#2B8CBE');
    let color = ds.backgroundColor;

    if (!color || ds.emphasisRole || ds.role || ds.valence !== undefined || ds.metricType) {
      if (ds.emphasisRole || ds.role) {
        const style = getEmphasisStyle(tokens, ds.emphasisRole || ds.role);
        color = ds.backgroundColor || style.borderColor || style.backgroundColor || defaultColor;
      } else if (ds.valence !== undefined || ds.direction !== undefined) {
        color = ds.backgroundColor || getValenceColor(tokens, ds.valence !== undefined ? ds.valence : ds.direction, ds.metricType || 'gain');
      } else {
        color = ds.backgroundColor || defaultColor;
      }
    }

    // Normalisation des points au format { x, y } pour type 'scatter'
    const pointData = (Array.isArray(ds.data) ? ds.data : []).map((item, i) => {
      if (typeof item === 'object' && item !== null && 'x' in item) {
        return item;
      }
      return {
        x: typeof item === 'number' ? item : Number(item) || 0,
        y: labels[i] !== undefined ? labels[i] : i
      };
    });

    return {
      label: ds.label || (idx === 0 ? 'Point A' : 'Point B'),
      type: 'scatter',
      data: pointData,
      backgroundColor: color,
      borderColor: tokens.bg,
      borderWidth: 2,
      pointRadius: isTufte ? 5 : 7,
      pointHoverRadius: 9,
      pointHitRadius: 12,
      datalabels: false,
      displayDataLabels: false
    };
  });

  const chartData = { labels, datasets };

  // Options Chart.js v4+ avec respect des règles de pointage Fitts 2D
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'scatter',
    data: chartData,
    plugins: [dumbbellConnectorPlugin],
    options: {
      ...defaultOpts,
      _kitChartsTokens: tokens,
      showDataLabels: showDataLabels,
      layout: {
        padding: {
          right: 24,
          left: 12,
          top: 12,
          bottom: 12
        }
      },
      animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'nearest',
        intersect: false,
        axis: 'xy'
      },
      hover: {
        mode: 'nearest',
        intersect: false,
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 100
      },
      plugins: {
        ...defaultOpts.plugins,
        datalabels: getDataLabelOptions(tokens, {
          display: showDataLabels
        }),
        legend: {
          ...defaultOpts.plugins.legend,
          display: !isTufte,
          position: 'top',
          align: 'end'
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono || 'monospace',
            size: 12,
            weight: '400'
          },
          animation: (isTufte || isReducedMotionPreferred()) ? false : { duration: 150, easing: 'easeOutQuad' },
          callbacks: {
            label: (context) => {
              const raw = context.raw;
              const xVal = typeof raw === 'object' && raw !== null ? raw.x : raw;
              const formatted = typeof xVal === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(xVal)
                : xVal;
              return ` ${context.dataset.label || ''}: ${formatted}`;
            }
          }
        }
      },
      scales: {
        y: {
          type: 'category',
          labels: labels,
          offset: true,
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 12,
              weight: '500'
            },
            padding: 20
          }
        },
        x: {
          min: 0,
          beginAtZero: true,
          grace: '14%',
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontMono || tokens.fontFamily,
              size: 11
            },
            padding: 6,
            callback: (val) => {
              if (typeof val === 'number' && Math.abs(val) >= 1000) {
                return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
              }
              return val;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Simulation mock pour environnement Node.js headless
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    dumbbellConnectorPlugin: typeof dumbbellConnectorPlugin !== 'undefined' ? dumbbellConnectorPlugin : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    isReducedMotionPreferred: typeof isReducedMotionPreferred === 'function' ? isReducedMotionPreferred : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getPartitionInteractionOptions: typeof getPartitionInteractionOptions === 'function' ? getPartitionInteractionOptions : null,
    computeAntiOcclusionTooltipPosition: typeof computeAntiOcclusionTooltipPosition === 'function' ? computeAntiOcclusionTooltipPosition : null,
    getDataLabelOptions: typeof getDataLabelOptions === 'function' ? getDataLabelOptions : null,
    formatLabelValue: typeof formatLabelValue === 'function' ? formatLabelValue : null,
    kitChartsDataLabelsPlugin: typeof kitChartsDataLabelsPlugin !== 'undefined' ? kitChartsDataLabelsPlugin : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/01-comparaison/grouped-bar-chart
  // --------------------------------------------------------------------------
  global.KitCharts["grouped-bar-chart"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function() { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function(t, o) { return o || {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 01-comparaison/grouped-bar-chart/template.js
 * @description Template Chart.js v4+ pour Diagramme en Barres Groupées (Clustered / Grouped Bar Chart).
 * Psychophysique: Comparaison multivariée intra-groupe et inter-groupes (<= 4 séries).
 * Règle d'or: beginAtZero: true sur Y, espacement Gestalt intra vs inter, légende claire.
 */

/**
 * Données par défaut représentatives (Comparaison des ventes trimestrielles sur 3 ans)
 */
const DEFAULT_DATA = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    { label: '2024', data: [120, 150, 180, 210] },
    { label: '2025', data: [140, 175, 210, 260] },
    { label: '2026', data: [160, 205, 245, 310] }
  ]
};

/**
 * Crée et initialise un diagramme en barres groupées dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @param {Object} [options={}] - Options additionnelles (ex: showDataLabels)
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  // Destruction propre de l'instance précédente
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  let statHelpers;
  try {
    statHelpers = typeof require === 'function' ? require('../../../themes/stat-helpers.js') : (typeof window !== 'undefined' ? window.KitChartsStats : null);
  } catch (e) {
    try {
      statHelpers = typeof require === 'function' ? require('../../themes/stat-helpers.js') : (typeof window !== 'undefined' ? window.KitChartsStats : null);
    } catch (e2) {}
  }

  const ebOption = options.errorBars || (customData && customData.errorBars);
  if (ebOption && ebOption.confidence !== undefined) {
    if (typeof ebOption.confidence !== 'number' || ebOption.confidence < 0.80 || ebOption.confidence > 0.99) {
      throw new Error('kit-charts: confidence must be bounded to [0.80, 0.99]');
    }
  }

  // Préparation des données avec support d'accentuation et de valence par série
  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];
  let ciOverlapAnalysis = null;

  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const primaryColor = getColor(tokens, idx);
    const rawDataArr = Array.isArray(ds.data) ? ds.data : [];

    let errorBarsData = ds.errorBarsData || (ds.errorBars && ds.errorBars.explicit) || (ebOption && ebOption.explicit) || null;
    let computedData = [...rawDataArr];

    if (rawDataArr.some(item => Array.isArray(item))) {
      const computedCIs = rawDataArr.map(item => {
        if (Array.isArray(item) && statHelpers && typeof statHelpers.ci95 === 'function') {
          return statHelpers.ci95(item, ebOption?.confidence || 0.95);
        }
        return null;
      });
      computedData = rawDataArr.map((item, i) => Array.isArray(item) ? (computedCIs[i]?.mean ?? 0) : item);
      errorBarsData = computedCIs.map(ci => ci ? { low: ci.low, high: ci.high } : null);
    }

    let bgColors = ds.backgroundColor;
    let borderColors = ds.borderColor;
    let borderWidths = ds.borderWidth;

    if (!bgColors || ds.emphasisRole || ds.role || ds.valence !== undefined || ds.metricType) {
      if (ds.emphasisRole || ds.role) {
        const style = getEmphasisStyle(tokens, ds.emphasisRole || ds.role);
        bgColors = ds.backgroundColor || style.backgroundColor || primaryColor;
        borderColors = ds.borderColor || style.borderColor || primaryColor;
        borderWidths = typeof ds.borderWidth === 'number' ? ds.borderWidth : (style.borderWidth || 0);
      } else if (ds.valence !== undefined || ds.direction !== undefined) {
        const valColor = getValenceColor(tokens, ds.valence !== undefined ? ds.valence : ds.direction, ds.metricType || 'gain');
        bgColors = ds.backgroundColor || valColor;
        borderColors = ds.borderColor || valColor;
      } else {
        bgColors = ds.backgroundColor || primaryColor;
        borderColors = ds.borderColor || primaryColor;
      }
    }

    return {
      label: ds.label || `Série ${idx + 1}`,
      data: computedData,
      errorBarsData,
      backgroundColor: bgColors,
      borderColor: borderColors,
      borderWidth: typeof borderWidths === 'number' ? borderWidths : 0,
      borderRadius: isTufte ? 0 : 3,
      borderSkipped: false,
      categoryPercentage: typeof ds.categoryPercentage === 'number' ? ds.categoryPercentage : 0.8,
      barPercentage: typeof ds.barPercentage === 'number' ? ds.barPercentage : 0.9
    };
  });

  const chartData = { labels, datasets };

  // Options Chart.js v4+ avec synchronisation multi-séries Fitts
  const defaultOpts = getChartDefaultOptions(tokens);
  const pluginsList = [];
  if (ebOption && statHelpers && statHelpers.errorBarsPlugin) {
    pluginsList.push(statHelpers.errorBarsPlugin);
  }

  const config = {
    type: 'bar',
    data: chartData,
    plugins: pluginsList,
    options: {
      ...defaultOpts,
      _kitChartsTokens: tokens,
      showDataLabels: showDataLabels,
      layout: {
        padding: {
          top: 16
        }
      },
      animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'index',
        intersect: false,
        axis: 'x'
      },
      hover: {
        mode: 'index',
        intersect: false,
        axis: 'x',
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 100
      },
      categoryPercentage: 0.8,
      barPercentage: 0.9,
      plugins: {
        ...defaultOpts.plugins,
        datalabels: getDataLabelOptions(tokens, {
          display: showDataLabels,
          formatter: (val) => {
            if (typeof val === 'number' && Math.abs(val) >= 1000) {
              return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
            }
            return val;
          }
        }),
        legend: {
          ...defaultOpts.plugins?.legend,
          display: !isTufte,
          position: 'top',
          align: 'end'
        },
        tooltip: {
          ...defaultOpts.plugins?.tooltip,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono || 'monospace',
            size: 12,
            weight: '400'
          },
          animation: (isTufte || isReducedMotionPreferred()) ? false : { duration: 150, easing: 'easeOutQuad' },
          callbacks: {
            label: (context) => {
              const val = context.parsed.y !== null && context.parsed.y !== undefined
                ? context.parsed.y
                : context.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val)
                : val;
              const lines = [` ${context.dataset.label || ''}: ${formatted}`];
              const eb = context.dataset.errorBarsData && context.dataset.errorBarsData[context.dataIndex];
              if (eb && eb.low !== undefined && eb.high !== undefined) {
                lines.push(` IC95%: [${eb.low.toFixed(1)} — ${eb.high.toFixed(1)}]`);
              }
              return lines;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 6
          }
        },
        y: {
          beginAtZero: true, // Règle psychophysique absolue
          grace: '10%',
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontMono || tokens.fontFamily,
              size: 11
            },
            padding: 8,
            callback: (val) => {
              if (typeof val === 'number' && Math.abs(val) >= 1000) {
                return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
              }
              return val;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    const chartInstance = new Chart(canvas, config);
    chartInstance.$ciOverlapAnalysis = ciOverlapAnalysis;
    return chartInstance;
  }

  // Simulation mock pour environnement Node.js headless
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    $ciOverlapAnalysis: ciOverlapAnalysis,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    isReducedMotionPreferred: typeof isReducedMotionPreferred === 'function' ? isReducedMotionPreferred : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getPartitionInteractionOptions: typeof getPartitionInteractionOptions === 'function' ? getPartitionInteractionOptions : null,
    computeAntiOcclusionTooltipPosition: typeof computeAntiOcclusionTooltipPosition === 'function' ? computeAntiOcclusionTooltipPosition : null,
    getDataLabelOptions: typeof getDataLabelOptions === 'function' ? getDataLabelOptions : null,
    formatLabelValue: typeof formatLabelValue === 'function' ? formatLabelValue : null,
    kitChartsDataLabelsPlugin: typeof kitChartsDataLabelsPlugin !== 'undefined' ? kitChartsDataLabelsPlugin : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/01-comparaison/lollipop-chart
  // --------------------------------------------------------------------------
  global.KitCharts["lollipop-chart"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function() { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function(t, o) { return o || {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 01-comparaison/lollipop-chart/template.js
 * @description Template Chart.js v4+ pour Graphique Sucette (Lollipop Chart).
 * Psychophysique: Alternative épurée au diagramme en barres avec un ratio Data-Ink maximal.
 * Règle d'or: beginAtZero: true sur Y, tige fine (2-3px) et tête circulaire pré-attentive.
 */

/**
 * Données par défaut représentatives (Indice de popularité des langages de programmation en %)
 */
const DEFAULT_DATA = {
  labels: ['Python', 'JavaScript', 'TypeScript', 'Rust', 'Go', 'Java', 'C++'],
  datasets: [{
    label: 'Popularité Index (%)',
    data: [88.5, 82.4, 76.1, 68.9, 64.2, 58.0, 52.3]
  }]
};

/**
 * Plugin inline Chart.js pour dessiner les têtes circulaires au sommet de chaque tige de sucette.
 */
const lollipopHeadPlugin = {
  id: 'lollipopHeadPlugin',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const tokens = chart.options?._kitChartsTokens || getThemeTokens(DEFAULT_THEME);
    const showLabels = chart.options?.plugins?.datalabels?.display !== false && chart.options?.showDataLabels !== false && chart.config?.showDataLabels !== false;

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (meta.hidden) return;

      meta.data.forEach((element, index) => {
        const val = dataset.data[index];
        if (val === null || val === undefined || isNaN(val)) return;

        const { x, y } = element.tooltipPosition();
        const headColor = Array.isArray(dataset.backgroundColor)
          ? dataset.backgroundColor[index]
          : dataset.backgroundColor;

        const headRadius = Array.isArray(dataset.headRadius)
          ? dataset.headRadius[index]
          : (dataset.headRadius || 6);

        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, headRadius, 0, Math.PI * 2);
        ctx.fillStyle = headColor || '#2B8CBE';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = chart.options.scales?.y?.grid?.color || '#FFFFFF';
        ctx.stroke();

        // Data label direct au sommet
        if (showLabels) {
          const font = chart.options?.plugins?.datalabels?.font || {};
          const fSize = font.size || 10;
          const fFam = font.family || tokens.fontMono || 'monospace';
          const fWeight = font.weight || '600';
          const formatted = typeof val === 'number'
            ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(val)
            : val;
          ctx.font = `${fWeight} ${fSize}px ${fFam}`;
          ctx.fillStyle = chart.options?.plugins?.datalabels?.color || tokens.textPrimary || '#0F172A';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(formatted, x, y - headRadius - 4);
        }

        ctx.restore();
      });
    });
  }
};

/**
 * Crée et initialise un diagramme lollipop dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @param {Object} [options={}] - Options additionnelles (ex: showDataLabels)
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  // Destruction propre de l'instance précédente
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  // Préparation des données avec support de l'accentuation sémantique et de la valence
  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];
  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const dataLen = Array.isArray(ds.data) ? ds.data.length : labels.length;
    const primaryColor = getColor(tokens, idx);

    let bgColors = ds.backgroundColor;
    let borderColors = ds.borderColor;

    if (!bgColors || Array.isArray(ds.emphasisRoles) || Array.isArray(ds.roles) || Array.isArray(ds.valences) || ds.emphasisRole || ds.role || ds.metricType || ds.valence !== undefined || ds.focusIndex !== undefined) {
      if (Array.isArray(ds.emphasisRoles) || Array.isArray(ds.roles)) {
        const roles = ds.emphasisRoles || ds.roles;
        bgColors = roles.map(r => getEmphasisStyle(tokens, r).backgroundColor || primaryColor);
        borderColors = roles.map(r => getEmphasisStyle(tokens, r).borderColor || primaryColor);
      } else if (Array.isArray(ds.valences)) {
        const metricType = ds.metricType || 'gain';
        bgColors = ds.valences.map(v => getValenceColor(tokens, v, metricType));
        borderColors = bgColors;
      } else if (ds.focusIndex !== undefined) {
        bgColors = Array.from({ length: dataLen }, (_, i) =>
          i === ds.focusIndex ? (tokens.emphasis?.focal || primaryColor) : (tokens.emphasis?.context || tokens.textMuted || '#CBD5E1')
        );
        borderColors = bgColors;
      } else if (ds.emphasisRole || ds.role) {
        const style = getEmphasisStyle(tokens, ds.emphasisRole || ds.role);
        bgColors = ds.backgroundColor || style.backgroundColor || primaryColor;
        borderColors = ds.borderColor || style.borderColor || primaryColor;
      } else if (ds.valence !== undefined || ds.direction !== undefined) {
        const valColor = getValenceColor(tokens, ds.valence !== undefined ? ds.valence : ds.direction, ds.metricType || 'gain');
        bgColors = ds.backgroundColor || valColor;
        borderColors = ds.borderColor || valColor;
      } else {
        bgColors = ds.backgroundColor || primaryColor;
        borderColors = ds.borderColor || primaryColor;
      }
    }

    return {
      label: ds.label || `Série ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      backgroundColor: bgColors,
      borderColor: borderColors,
      borderWidth: 0,
      borderRadius: 0,
      barThickness: 3, // Tige étroite pour ratio Data-Ink élevé
      maxBarThickness: 4,
      headRadius: ds.headRadius || (isTufte ? 4 : 6),
      categoryPercentage: typeof ds.categoryPercentage === 'number' ? ds.categoryPercentage : 0.8,
      barPercentage: typeof ds.barPercentage === 'number' ? ds.barPercentage : 0.9,
      datalabels: false,
      displayDataLabels: false
    };
  });

  const chartData = { labels, datasets };

  // Options Chart.js v4+ avec capture Fitts 1D
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'bar',
    data: chartData,
    plugins: [lollipopHeadPlugin],
    options: {
      ...defaultOpts,
      _kitChartsTokens: tokens,
      showDataLabels: showDataLabels,
      layout: {
        padding: {
          top: 18
        }
      },
      animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'index',
        intersect: false,
        axis: 'x'
      },
      hover: {
        mode: 'index',
        intersect: false,
        axis: 'x',
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 100
      },
      categoryPercentage: 0.8,
      barPercentage: 0.9,
      plugins: {
        ...defaultOpts.plugins,
        datalabels: getDataLabelOptions(tokens, {
          display: showDataLabels,
          formatter: (val) => {
            if (typeof val === 'number' && Math.abs(val) >= 1000) {
              return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
            }
            return val;
          }
        }),
        legend: {
          ...defaultOpts.plugins.legend,
          display: datasets.length > 1 && !isTufte
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono || 'monospace',
            size: 12,
            weight: '400'
          },
          animation: (isTufte || isReducedMotionPreferred()) ? false : { duration: 150, easing: 'easeOutQuad' },
          callbacks: {
            label: (context) => {
              const val = context.parsed.y !== null && context.parsed.y !== undefined
                ? context.parsed.y
                : context.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val)
                : val;
              return ` ${context.dataset.label || ''}: ${formatted}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 8
          }
        },
        y: {
          beginAtZero: true, // Règle psychophysique obligatoire
          grace: '12%',
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontMono || tokens.fontFamily,
              size: 11
            },
            padding: 8,
            callback: (val) => {
              if (typeof val === 'number' && Math.abs(val) >= 1000) {
                return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
              }
              return val;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Simulation mock pour environnement Node.js headless
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    lollipopHeadPlugin: typeof lollipopHeadPlugin !== 'undefined' ? lollipopHeadPlugin : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    isReducedMotionPreferred: typeof isReducedMotionPreferred === 'function' ? isReducedMotionPreferred : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getPartitionInteractionOptions: typeof getPartitionInteractionOptions === 'function' ? getPartitionInteractionOptions : null,
    computeAntiOcclusionTooltipPosition: typeof computeAntiOcclusionTooltipPosition === 'function' ? computeAntiOcclusionTooltipPosition : null,
    getDataLabelOptions: typeof getDataLabelOptions === 'function' ? getDataLabelOptions : null,
    formatLabelValue: typeof formatLabelValue === 'function' ? formatLabelValue : null,
    kitChartsDataLabelsPlugin: typeof kitChartsDataLabelsPlugin !== 'undefined' ? kitChartsDataLabelsPlugin : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/01-comparaison/polar-area-chart
  // --------------------------------------------------------------------------
  global.KitCharts["polar-area-chart"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function() { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function(t, o) { return o || {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 01-comparaison/polar-area-chart/template.js
 * @description Template Chart.js v4+ pour Diagramme de Zone Polaire (Florence Nightingale Polar Area Chart).
 * Psychophysique: Encodage cyclique ou directionnel par rayon variable sur angles constants.
 * Règle d'or: Angles de secteurs égaux, échelle radiale proportionnelle, séparation nette par fond.
 */

/**
 * Données par défaut représentatives (Distribution directionnelle des flux en 8 secteurs cardinaux)
 */
const DEFAULT_DATA = {
  labels: ['Nord', 'Nord-Est', 'Est', 'Sud-Est', 'Sud', 'Sud-Ouest', 'Ouest', 'Nord-Ouest'],
  datasets: [{
    data: [42, 28, 35, 18, 50, 32, 45, 22]
  }]
};

/**
 * Crée et initialise un diagramme polaire (Polar Area Chart) dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @param {Object} [options={}] - Options additionnelles (ex: showDataLabels)
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  // Destruction propre de l'instance précédente
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  // Préparation des données avec support d'accentuation et de valence
  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];
  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const dataLen = Array.isArray(ds.data) ? ds.data.length : labels.length;
    let bgColors = ds.backgroundColor;

    if (!bgColors || Array.isArray(ds.emphasisRoles) || Array.isArray(ds.roles) || Array.isArray(ds.valences) || ds.focusIndex !== undefined) {
      if (Array.isArray(ds.emphasisRoles) || Array.isArray(ds.roles)) {
        const roles = ds.emphasisRoles || ds.roles;
        bgColors = roles.map((r, i) => getEmphasisStyle(tokens, r).backgroundColor || getColor(tokens, i));
      } else if (Array.isArray(ds.valences)) {
        const metricType = ds.metricType || 'gain';
        bgColors = ds.valences.map(v => getValenceColor(tokens, v, metricType));
      } else if (ds.focusIndex !== undefined) {
        bgColors = Array.from({ length: dataLen }, (_, i) =>
          i === ds.focusIndex ? (tokens.emphasis?.focal || getColor(tokens, 0)) : (tokens.emphasis?.context || tokens.textMuted || '#CBD5E1')
        );
      } else if (!Array.isArray(bgColors)) {
        bgColors = Array.from({ length: dataLen }, (_, i) => getColor(tokens, i));
      }
    }

    return {
      label: ds.label || 'Valeur',
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      backgroundColor: bgColors,
      borderColor: tokens.bg,
      borderWidth: isTufte ? 1 : 2
    };
  });

  const chartData = { labels, datasets };

  // Options Chart.js v4+ avec respect des partitions polaires Fitts
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'polarArea',
    data: chartData,
    options: {
      ...defaultOpts,
      animation: getAccessibleAnimationOptions(tokens, { duration: 450, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'nearest',
        intersect: true,
        axis: 'xy'
      },
      hover: {
        mode: 'nearest',
        intersect: true,
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 120
      },
      plugins: {
        ...defaultOpts.plugins,
        datalabels: getDataLabelOptions(tokens, {
          display: showDataLabels,
          formatter: (val) => {
            if (typeof val === 'number' && Math.abs(val) >= 1000) {
              return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
            }
            return val;
          }
        }),
        legend: {
          ...defaultOpts.plugins.legend,
          display: !isTufte,
          position: 'right',
          align: 'center'
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono || 'monospace',
            size: 12,
            weight: '400'
          },
          animation: (isTufte || isReducedMotionPreferred()) ? false : { duration: 150, easing: 'easeOutQuad' },
          callbacks: {
            label: (context) => {
              const val = context.parsed.r !== null && context.parsed.r !== undefined
                ? context.parsed.r
                : context.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val)
                : val;
              return ` ${context.label || ''}: ${formatted}`;
            }
          }
        }
      },
      scales: {
        x: { display: false },
        y: { display: false },
        r: {
          angleLines: {
            color: tokens.gridColor,
            lineWidth: 1
          },
          grid: {
            color: tokens.gridColor,
            lineWidth: 1
          },
          ticks: {
            backdropColor: 'transparent',
            color: tokens.textMuted,
            font: {
              family: tokens.fontMono || tokens.fontFamily,
              size: 10
            },
            showLabelBackdrop: false
          },
          suggestedMin: 0
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Simulation mock pour environnement Node.js headless
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    isReducedMotionPreferred: typeof isReducedMotionPreferred === 'function' ? isReducedMotionPreferred : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getPartitionInteractionOptions: typeof getPartitionInteractionOptions === 'function' ? getPartitionInteractionOptions : null,
    computeAntiOcclusionTooltipPosition: typeof computeAntiOcclusionTooltipPosition === 'function' ? computeAntiOcclusionTooltipPosition : null,
    getDataLabelOptions: typeof getDataLabelOptions === 'function' ? getDataLabelOptions : null,
    formatLabelValue: typeof formatLabelValue === 'function' ? formatLabelValue : null,
    kitChartsDataLabelsPlugin: typeof kitChartsDataLabelsPlugin !== 'undefined' ? kitChartsDataLabelsPlugin : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/01-comparaison/radar-chart
  // --------------------------------------------------------------------------
  global.KitCharts["radar-chart"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function() { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function(t, o) { return o || {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 01-comparaison/radar-chart/template.js
 * @description Template Chart.js v4+ pour Graphique Radar / Profil Multivarié (Radar Chart / Spider Chart).
 * Psychophysique: Évaluation globale d'une empreinte multidimensionnelle (5 à 8 critères, max 2 entités).
 * Règle d'or: Échelle radiale partagée, opacité de remplissage faible (20-30%) pour éviter les masquages.
 */

/**
 * Données par défaut représentatives (Comparaison de profils techniques entre plateformes logicielles)
 */
const DEFAULT_DATA = {
  labels: ['Vitesse', 'Fiabilité', 'Sécurité', 'Scalabilité', 'Ergonomie', 'Documentation'],
  datasets: [
    { label: 'Plateforme A', data: [85, 92, 90, 78, 88, 95] },
    { label: 'Plateforme B', data: [70, 80, 85, 92, 75, 80] }
  ]
};

/**
 * Convertit une couleur Hex en chaîne RGBA valide.
 * @param {string} hex
 * @param {number} alpha
 * @returns {string}
 */
function hexToRgba(hex, alpha = 0.2) {
  if (!hex || typeof hex !== 'string') return `rgba(43, 140, 190, ${alpha})`;
  if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean.substring(0, 6), 16);
  if (isNaN(num)) return `rgba(43, 140, 190, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Crée et initialise un graphique radar dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @param {Object} [options={}] - Options additionnelles (ex: showDataLabels)
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  // Destruction propre de l'instance précédente
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  // Préparation des données avec support d'accentuation et de valence
  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];
  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const primaryColor = getColor(tokens, idx);

    let borderColor = ds.borderColor;
    let borderWidth = ds.borderWidth;
    let borderDash = ds.borderDash || [];
    let pointRadius = ds.pointRadius !== undefined ? ds.pointRadius : (isTufte ? 3 : 4);
    let pointStyle = ds.pointStyle || 'circle';
    let alpha = 0.2;

    if (ds.emphasisRole || ds.role) {
      const style = getEmphasisStyle(tokens, ds.emphasisRole || ds.role);
      borderColor = borderColor || style.borderColor || primaryColor;
      borderWidth = borderWidth !== undefined ? borderWidth : style.borderWidth;
      borderDash = style.borderDash || [];
      pointRadius = style.pointRadius || pointRadius;
      pointStyle = style.pointStyle || pointStyle;
      alpha = (ds.emphasisRole === 'context' || ds.role === 'context') ? 0.08 : 0.25;
    } else if (ds.valence !== undefined || ds.metricType) {
      const valColor = getValenceColor(tokens, ds.valence !== undefined ? ds.valence : 1, ds.metricType || 'gain');
      borderColor = borderColor || valColor;
    } else {
      borderColor = borderColor || primaryColor;
      borderWidth = borderWidth !== undefined ? borderWidth : (isTufte ? 1.5 : 2);
    }

    const fillColor = ds.backgroundColor || hexToRgba(borderColor, alpha);

    return {
      label: ds.label || `Profil ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      backgroundColor: fillColor,
      borderColor: borderColor,
      borderWidth: borderWidth !== undefined ? borderWidth : (isTufte ? 1.5 : 2),
      borderDash: borderDash,
      pointBackgroundColor: borderColor,
      pointBorderColor: tokens.bg,
      pointBorderWidth: 1.5,
      pointRadius: pointRadius,
      pointHoverRadius: pointRadius + 3,
      pointHitRadius: 10,
      pointStyle: pointStyle,
      fill: ds.fill !== undefined ? ds.fill : true
    };
  });

  const chartData = { labels, datasets };

  // Options Chart.js v4+ pour échelle radiale 'r' avec interaction Fitts indexée
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'radar',
    data: chartData,
    options: {
      ...defaultOpts,
      animation: getAccessibleAnimationOptions(tokens, { duration: 450, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'index',
        intersect: false
      },
      hover: {
        mode: 'index',
        intersect: false,
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 100
      },
      plugins: {
        ...defaultOpts.plugins,
        datalabels: {
          display: (context) => {
            return showDataLabels && (typeof context === 'object' && context.datasetIndex !== undefined ? context.datasetIndex < 2 : true);
          },
          align: (context) => (context && context.datasetIndex === 0) ? 'end' : 'start',
          anchor: (context) => (context && context.datasetIndex === 0) ? 'end' : 'start',
          offset: 6,
          backgroundColor: (context) => hexToRgba(tokens.surface || '#FFFFFF', 0.92),
          borderColor: (context) => (context && context.dataset && context.dataset.borderColor) || tokens.border,
          borderWidth: 1,
          borderRadius: 4,
          padding: { top: 2, bottom: 2, left: 4, right: 4 },
          color: (context) => (context && context.dataset && context.dataset.borderColor) || tokens.textPrimary,
          font: {
            family: tokens.fontMono || 'monospace',
            size: 10,
            weight: '700'
          },
          formatter: (val) => {
            if (typeof val === 'number' && Math.abs(val) >= 1000) {
              return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
            }
            return val;
          }
        },
        legend: {
          ...defaultOpts.plugins.legend,
          display: !isTufte,
          position: 'top',
          align: 'end'
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono || 'monospace',
            size: 12,
            weight: '400'
          },
          animation: (isTufte || isReducedMotionPreferred()) ? false : { duration: 150, easing: 'easeOutQuad' },
          callbacks: {
            label: (context) => {
              const val = context.parsed.r !== null && context.parsed.r !== undefined
                ? context.parsed.r
                : context.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val)
                : val;
              return ` ${context.dataset.label || ''}: ${formatted}`;
            }
          }
        }
      },
      scales: {
        x: { display: false },
        y: { display: false },
        r: {
          angleLines: {
            color: tokens.gridColor,
            lineWidth: 1
          },
          grid: {
            color: tokens.gridColor,
            lineWidth: 1
          },
          pointLabels: {
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              size: 11,
              weight: '500'
            },
            padding: 16
          },
          ticks: {
            display: false
          },
          suggestedMin: 0
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Simulation mock pour environnement Node.js headless
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    isReducedMotionPreferred: typeof isReducedMotionPreferred === 'function' ? isReducedMotionPreferred : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getPartitionInteractionOptions: typeof getPartitionInteractionOptions === 'function' ? getPartitionInteractionOptions : null,
    computeAntiOcclusionTooltipPosition: typeof computeAntiOcclusionTooltipPosition === 'function' ? computeAntiOcclusionTooltipPosition : null,
    getDataLabelOptions: typeof getDataLabelOptions === 'function' ? getDataLabelOptions : null,
    formatLabelValue: typeof formatLabelValue === 'function' ? formatLabelValue : null,
    kitChartsDataLabelsPlugin: typeof kitChartsDataLabelsPlugin !== 'undefined' ? kitChartsDataLabelsPlugin : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/01-comparaison/slope-chart
  // --------------------------------------------------------------------------
  global.KitCharts["slope-chart"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function() { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function(t, o) { return o || {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 01-comparaison/slope-chart/template.js
 * @description Template Chart.js v4+ pour Graphique de Pente (Slopegraph / Slope Chart).
 * Psychophysique: Évaluation pré-attentive des variations relatives et inversions de rang entre 2 états/dates.
 * Règle d'or: tension: 0 (lignes rigoureusement droites), points d'extrémités nets, étiquetage direct.
 */

/**
 * Données par défaut représentatives (Transition du mix énergétique européen entre 2020 et 2025 en %)
 */
const DEFAULT_DATA = {
  labels: ['2020', '2025'],
  datasets: [
    { label: 'Énergie Renouvelable', data: [21.5, 38.2] },
    { label: 'Nucléaire', data: [40.1, 35.8] },
    { label: 'Gaz Naturel', data: [25.4, 18.2] },
    { label: 'Charbon', data: [13.0, 7.8] }
  ]
};

/**
 * Crée et initialise un graphique de pente (Slope Chart) dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @param {Object} [options={}] - Options additionnelles (ex: showDataLabels)
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  // Destruction propre de l'instance précédente
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  // Préparation des données avec support de l'accentuation et de la valence de pente
  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : ['T0', 'T1'];
  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const primaryColor = getColor(tokens, idx);

    let borderColor = ds.borderColor;
    let borderWidth = ds.borderWidth;
    let borderDash = ds.borderDash || [];
    let pointRadius = ds.pointRadius !== undefined ? ds.pointRadius : (isTufte ? 3 : 5);
    let pointStyle = ds.pointStyle || 'circle';

    if (ds.emphasisRole || ds.role) {
      const style = getEmphasisStyle(tokens, ds.emphasisRole || ds.role);
      borderColor = borderColor || style.borderColor || primaryColor;
      borderWidth = borderWidth !== undefined ? borderWidth : style.borderWidth;
      borderDash = style.borderDash || [];
      pointRadius = style.pointRadius || pointRadius;
      pointStyle = style.pointStyle || pointStyle;
    } else if (ds.valence !== undefined || ds.metricType) {
      const dataArr = Array.isArray(ds.data) ? ds.data : [];
      const delta = dataArr.length >= 2 ? (Number(dataArr[1]) - Number(dataArr[0])) : 0;
      const valColor = getValenceColor(tokens, ds.valence !== undefined ? ds.valence : delta, ds.metricType || 'gain');
      borderColor = borderColor || valColor;
    } else {
      borderColor = borderColor || primaryColor;
      borderWidth = borderWidth !== undefined ? borderWidth : (isTufte ? 1.5 : 2.5);
    }

    const bg = ds.backgroundColor || borderColor;

    return {
      label: ds.label || `Série ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      borderColor: borderColor,
      backgroundColor: bg,
      borderWidth: borderWidth !== undefined ? borderWidth : (isTufte ? 1.5 : 2.5),
      borderDash: borderDash,
      tension: 0, // Règle psychophysique obligatoire : segment strictement linéaire
      pointRadius: pointRadius,
      pointHoverRadius: pointRadius + 2,
      pointHitRadius: 12,
      pointStyle: pointStyle,
      pointBackgroundColor: borderColor,
      pointBorderColor: tokens.bg,
      pointBorderWidth: 2,
      fill: false
    };
  });

  const chartData = { labels, datasets };

  // Options Chart.js v4+ avec synchronisation indexée
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'line',
    data: chartData,
    options: {
      ...defaultOpts,
      _kitChartsTokens: tokens,
      showDataLabels: showDataLabels,
      layout: {
        padding: {
          left: 48,
          right: 54,
          top: 16,
          bottom: 16
        }
      },
      animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'index',
        intersect: false,
        axis: 'x'
      },
      hover: {
        mode: 'index',
        intersect: false,
        axis: 'x',
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 100
      },
      plugins: {
        ...defaultOpts.plugins,
        datalabels: getDataLabelOptions(tokens, {
          display: showDataLabels,
          formatter: (val) => {
            if (typeof val === 'number' && Math.abs(val) >= 1000) {
              return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
            }
            return val;
          }
        }),
        legend: {
          ...defaultOpts.plugins.legend,
          display: !isTufte,
          position: 'top',
          align: 'end'
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono || 'monospace',
            size: 12,
            weight: '400'
          },
          animation: (isTufte || isReducedMotionPreferred()) ? false : { duration: 150, easing: 'easeOutQuad' },
          callbacks: {
            label: (context) => {
              const val = context.parsed.y !== null && context.parsed.y !== undefined
                ? context.parsed.y
                : context.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val)
                : val;
              return ` ${context.dataset.label || ''}: ${formatted}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              size: 13,
              weight: '600'
            },
            padding: 8
          }
        },
        y: {
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontMono || tokens.fontFamily,
              size: 11
            },
            padding: 8,
            callback: (val) => {
              if (typeof val === 'number' && Math.abs(val) >= 1000) {
                return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
              }
              return val;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Simulation mock pour environnement Node.js headless
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    isReducedMotionPreferred: typeof isReducedMotionPreferred === 'function' ? isReducedMotionPreferred : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getPartitionInteractionOptions: typeof getPartitionInteractionOptions === 'function' ? getPartitionInteractionOptions : null,
    computeAntiOcclusionTooltipPosition: typeof computeAntiOcclusionTooltipPosition === 'function' ? computeAntiOcclusionTooltipPosition : null,
    getDataLabelOptions: typeof getDataLabelOptions === 'function' ? getDataLabelOptions : null,
    formatLabelValue: typeof formatLabelValue === 'function' ? formatLabelValue : null,
    kitChartsDataLabelsPlugin: typeof kitChartsDataLabelsPlugin !== 'undefined' ? kitChartsDataLabelsPlugin : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/01-comparaison/stacked-bar-chart
  // --------------------------------------------------------------------------
  global.KitCharts["stacked-bar-chart"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function() { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function(t, o) { return o || {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 01-comparaison/stacked-bar-chart/template.js
 * @description Template Chart.js v4+ pour Diagramme en Barres Empilées (Stacked Bar Chart).
 * Psychophysique: Comparaison absolue des totaux combinée à la décomposition interne (max 4-5 sous-segments).
 * Règle d'or: beginAtZero: true sur Y, ordre constant des séries, info-bulle affichant le total agrégé.
 */

/**
 * Données par défaut représentatives (Répartition trimestrielle des revenus par canal de distribution en k€)
 */
const DEFAULT_DATA = {
  labels: ['T1', 'T2', 'T3', 'T4'],
  datasets: [
    { label: 'E-commerce', data: [120, 145, 160, 190] },
    { label: 'Boutiques Physiques', data: [85, 90, 95, 110] },
    { label: 'Grands Comptes / B2B', data: [55, 60, 75, 95] }
  ]
};

/**
 * Crée et initialise un diagramme en barres empilées dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @param {Object} [options={}] - Options additionnelles (ex: showDataLabels)
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  // Destruction propre de l'instance précédente
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  // Préparation des données avec support d'accentuation et de valence
  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];
  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const primaryColor = getColor(tokens, idx);

    let bgColors = ds.backgroundColor;
    let borderColors = ds.borderColor;
    let borderWidths = ds.borderWidth;

    if (!bgColors || ds.emphasisRole || ds.role || ds.valence !== undefined || ds.metricType) {
      if (ds.emphasisRole || ds.role) {
        const style = getEmphasisStyle(tokens, ds.emphasisRole || ds.role);
        bgColors = ds.backgroundColor || style.backgroundColor || primaryColor;
        borderColors = ds.borderColor || style.borderColor || primaryColor;
        borderWidths = typeof ds.borderWidth === 'number' ? ds.borderWidth : (style.borderWidth || 0);
      } else if (ds.valence !== undefined || ds.direction !== undefined) {
        const valColor = getValenceColor(tokens, ds.valence !== undefined ? ds.valence : ds.direction, ds.metricType || 'gain');
        bgColors = ds.backgroundColor || valColor;
        borderColors = ds.borderColor || valColor;
      } else {
        bgColors = ds.backgroundColor || primaryColor;
        borderColors = ds.borderColor || primaryColor;
      }
    }

    return {
      label: ds.label || `Segment ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      backgroundColor: bgColors,
      borderColor: borderColors,
      borderWidth: typeof borderWidths === 'number' ? borderWidths : 0,
      borderRadius: isTufte ? 0 : (idx === (rawData.datasets || []).length - 1 ? 3 : 0),
      borderSkipped: false,
      categoryPercentage: typeof ds.categoryPercentage === 'number' ? ds.categoryPercentage : 0.75,
      barPercentage: typeof ds.barPercentage === 'number' ? ds.barPercentage : 0.85
    };
  });

  const chartData = { labels, datasets };

  // Options Chart.js v4+ avec empilement et interaction Fitts indexée
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'bar',
    data: chartData,
    options: {
      ...defaultOpts,
      _kitChartsTokens: tokens,
      showDataLabels: showDataLabels,
      layout: {
        padding: {
          top: 16
        }
      },
      animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'index',
        intersect: false,
        axis: 'x'
      },
      hover: {
        mode: 'index',
        intersect: false,
        axis: 'x',
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 100
      },
      categoryPercentage: 0.75,
      barPercentage: 0.85,
      plugins: {
        ...defaultOpts.plugins,
        datalabels: getDataLabelOptions(tokens, {
          display: showDataLabels,
          formatter: (val) => {
            if (typeof val === 'number' && Math.abs(val) >= 1000) {
              return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
            }
            return val;
          }
        }),
        legend: {
          ...defaultOpts.plugins.legend,
          display: !isTufte,
          position: 'top',
          align: 'end'
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          mode: 'index',
          intersect: false,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono || 'monospace',
            size: 12,
            weight: '400'
          },
          footerFont: {
            family: tokens.fontMono || tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          animation: (isTufte || isReducedMotionPreferred()) ? false : { duration: 150, easing: 'easeOutQuad' },
          callbacks: {
            label: (context) => {
              const val = context.parsed.y !== null && context.parsed.y !== undefined
                ? context.parsed.y
                : context.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val)
                : val;
              return ` ${context.dataset.label || ''}: ${formatted}`;
            },
            footer: (tooltipItems) => {
              let total = 0;
              tooltipItems.forEach((item) => {
                total += item.parsed.y || 0;
              });
              return `Total : ${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(total)}`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true, // Empilement sur l'axe X
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 6
          }
        },
        y: {
          stacked: true, // Empilement sur l'axe Y
          beginAtZero: true, // Règle psychophysique absolue
          grace: '10%',
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontMono || tokens.fontFamily,
              size: 11
            },
            padding: 8,
            callback: (val) => {
              if (typeof val === 'number' && Math.abs(val) >= 1000) {
                return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
              }
              return val;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Simulation mock pour environnement Node.js headless
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    isReducedMotionPreferred: typeof isReducedMotionPreferred === 'function' ? isReducedMotionPreferred : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getPartitionInteractionOptions: typeof getPartitionInteractionOptions === 'function' ? getPartitionInteractionOptions : null,
    computeAntiOcclusionTooltipPosition: typeof computeAntiOcclusionTooltipPosition === 'function' ? computeAntiOcclusionTooltipPosition : null,
    getDataLabelOptions: typeof getDataLabelOptions === 'function' ? getDataLabelOptions : null,
    formatLabelValue: typeof formatLabelValue === 'function' ? formatLabelValue : null,
    kitChartsDataLabelsPlugin: typeof kitChartsDataLabelsPlugin !== 'undefined' ? kitChartsDataLabelsPlugin : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/02-composition-part-to-whole/doughnut-chart
  // --------------------------------------------------------------------------
  global.KitCharts["doughnut-chart"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function() { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function(t, o) { return o || {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 02-composition-part-to-whole/doughnut-chart/template.js
 * @description Template Chart.js v4+ pour Diagramme en Anneau (Doughnut Chart).
 * Psychophysique: Pas d'axes cartésiens x/y, cavité centrale 65% avec KPI saillant.
 */

const DEFAULT_DATA = {
  labels: ['Abonnements SaaS', 'Licences Enterprise', 'Services Pro', 'Usage API'],
  datasets: [{
    label: 'Revenus (M€)',
    data: [42, 28, 18, 12]
  }]
};

function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) throw new Error('Canvas not found');

  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  const rawData = customData || DEFAULT_DATA;
  let labels = rawData.labels ? [...rawData.labels] : [];
  let rawValues = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || [42, 28, 18, 12];
  const ds0 = rawData.datasets?.[0] || {};

  // Support d'accentuation et de valence
  const dataLen = Array.isArray(rawValues) ? rawValues.length : labels.length;
  let initialColors = null;

  if (Array.isArray(ds0.emphasisRoles) || Array.isArray(ds0.roles)) {
    const roles = ds0.emphasisRoles || ds0.roles;
    initialColors = roles.map((r, i) => getEmphasisStyle(tokens, r).backgroundColor || getColor(tokens, i));
  } else if (Array.isArray(ds0.valences)) {
    const metricType = ds0.metricType || 'gain';
    initialColors = ds0.valences.map(v => getValenceColor(tokens, v, metricType));
  } else if (ds0.focusIndex !== undefined) {
    initialColors = Array.from({ length: dataLen }, (_, i) =>
      i === ds0.focusIndex ? (tokens.emphasis?.focal || getColor(tokens, 0)) : (tokens.emphasis?.context || tokens.textMuted || '#CBD5E1')
    );
  } else if (Array.isArray(ds0.backgroundColor)) {
    initialColors = [...ds0.backgroundColor];
  }

  const pairs = labels.map((lbl, i) => ({
    label: lbl,
    val: typeof rawValues[i] === 'object' && rawValues[i] !== null ? (rawValues[i].value ?? rawValues[i].v ?? 0) : Number(rawValues[i]) || 0,
    color: initialColors ? initialColors[i] : null
  }));

  if (ds0.sorted !== false) {
    pairs.sort((a, b) => b.val - a.val);
  }

  labels = pairs.map(p => p.label);
  const data = pairs.map(p => p.val);
  const total = data.reduce((a, b) => a + b, 0);
  const bgColors = pairs.map((p, i) => p.color || getColor(tokens, i));

  // Plugin texte central KPI
  const centerTextPlugin = {
    id: 'doughnutCenterKpi_' + Math.random().toString(36).substring(2, 7),
    beforeDraw(chart) {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // KPI
      ctx.fillStyle = tokens.textPrimary || '#0F172A';
      ctx.font = `700 18px ${tokens.fontMono || 'monospace'}`;
      ctx.fillText(total + (ds0.unit || ' M€'), centerX, centerY - 6);

      // Label
      ctx.fillStyle = tokens.textMuted || '#64748B';
      ctx.font = `600 10px ${tokens.fontFamily || 'sans-serif'}`;
      ctx.fillText(ds0.centerLabel || 'TOTAL', centerX, centerY + 12);

      ctx.restore();
    }
  };

  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        label: ds0.label || 'Revenus',
        data,
        backgroundColor: bgColors,
        borderColor: tokens.bg || '#FFFFFF',
        borderWidth: isTufte ? 1 : 2
      }]
    },
    plugins: [centerTextPlugin],
    options: {
      ...defaultOpts,
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      rotation: -90,
      scales: {}, // AUCUN AXE CARTÉSIEN X/Y
      animation: getAccessibleAnimationOptions(tokens, { duration: 450, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'nearest',
        intersect: true,
        axis: 'xy'
      },
      hover: {
        mode: 'nearest',
        intersect: true,
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 120
      },
      plugins: {
        ...defaultOpts.plugins,
        datalabels: getDataLabelOptions(tokens, {
          display: showDataLabels,
          formatter: (val, ctx) => {
            if (ctx && ctx.percentText) return ctx.percentText;
            const num = typeof val === 'object' && val !== null ? (val.value ?? val.v ?? 0) : (Number(val) || 0);
            const pct = total > 0 ? ((num / total) * 100).toFixed(0) : 0;
            return `${pct}%`;
          }
        }),
        legend: {
          display: !isTufte,
          position: 'right',
          labels: {
            color: tokens.textPrimary,
            font: { family: tokens.fontFamily, size: 12, weight: '500' },
            boxWidth: 12,
            padding: 12,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono || 'monospace', size: 12, weight: '400' },
          animation: (isTufte || isReducedMotionPreferred()) ? false : { duration: 150, easing: 'easeOutQuad' },
          callbacks: {
            label: (ctx) => {
              const val = ctx.parsed;
              const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
              return ` ${ctx.label} : ${val} (${pct}%)`;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }
  return { canvas, config, data: config.data, options: config.options, destroy: () => {}, update: () => {}, resize: () => {} };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    isReducedMotionPreferred: typeof isReducedMotionPreferred === 'function' ? isReducedMotionPreferred : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getPartitionInteractionOptions: typeof getPartitionInteractionOptions === 'function' ? getPartitionInteractionOptions : null,
    computeAntiOcclusionTooltipPosition: typeof computeAntiOcclusionTooltipPosition === 'function' ? computeAntiOcclusionTooltipPosition : null,
    getDataLabelOptions: typeof getDataLabelOptions === 'function' ? getDataLabelOptions : null,
    formatLabelValue: typeof formatLabelValue === 'function' ? formatLabelValue : null,
    kitChartsDataLabelsPlugin: typeof kitChartsDataLabelsPlugin !== 'undefined' ? kitChartsDataLabelsPlugin : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/02-composition-part-to-whole/pareto-chart
  // --------------------------------------------------------------------------
  global.KitCharts["pareto-chart"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Trie les catégories par ordre décroissant de valeur et calcule les cumuls.
   */
  function computeParetoCumsum(labels, values) {
    const pairs = labels.map((lbl, idx) => ({ label: lbl, value: Number(values[idx]) || 0 }));
    pairs.sort((a, b) => b.value - a.value);

    const total = pairs.reduce((sum, p) => sum + p.value, 0);
    let running = 0;

    const sortedLabels = [];
    const sortedValues = [];
    const cumulativePcts = [];

    pairs.forEach(p => {
      sortedLabels.push(p.label);
      sortedValues.push(p.value);
      running += p.value;
      const pct = total > 0 ? (running / total) * 100 : 0;
      cumulativePcts.push(Math.round(pct * 10) / 10);
    });

    const thresholdIndex80 = cumulativePcts.findIndex(p => p >= 80);

    return {
      labels: sortedLabels,
      values: sortedValues,
      cumulativePcts,
      thresholdIndex80,
      total
    };
  }

  /**
   * Calcule le coefficient de Gini pour évaluer la concentration Pareto.
   * G = Σ|xi - xj| / (2 * n^2 * mu)
   */
  function computeGini(values) {
    const clean = Array.isArray(values) ? values.map(Number).filter(v => !isNaN(v) && v >= 0) : [];
    const n = clean.length;
    if (n < 2) return 0;
    const mean = clean.reduce((s, v) => s + v, 0) / n;
    if (mean === 0) return 0;

    let diffSum = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        diffSum += Math.abs(clean[i] - clean[j]);
      }
    }
    return Math.round((diffSum / (2 * n * n * mean)) * 1000) / 1000;
  }

  const DEFAULT_DATA = {
    labels: [
      "Erreur d'authentification",
      'Timeout passerelle SQL',
      'Fichier payload corrompu',
      'Certificat SSL expiré',
      'Quota mémoire dépassé',
      'Erreur DNS transitoire',
      'Déconnexion WebSocket'
    ],
    datasets: [{
      label: "Occurrences d'Incidents",
      data: [142, 89, 45, 23, 14, 8, 4]
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
    const inputLabels = rawData.labels || DEFAULT_DATA.labels;
    const inputValues = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;
    const seriesLabel = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Incidents';

    const pareto = computeParetoCumsum(inputLabels, inputValues);
    const gini = computeGini(pareto.values);

    const barColor = getColor(tokens, 0);
    const lineColor = tokens.emphasis?.focal || tokens.palette?.[1] || '#E66101';
    const thresholdColor = tokens.emphasis?.benchmark || tokens.status?.warning || '#CA0020';

    const pareto80LinePlugin = {
      id: 'kitChartsPareto80Line',
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y1 }, chartArea } = chart;
        if (!y1 || !chartArea) return;

        const y80 = y1.getPixelForValue(80);
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = thresholdColor;
        ctx.lineWidth = 1.5;
        ctx.moveTo(chartArea.left, y80);
        ctx.lineTo(chartArea.right, y80);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.font = `600 11px ${tokens.fontMono || 'monospace'}`;
        ctx.fillStyle = thresholdColor;
        ctx.textAlign = 'right';
        ctx.fillText('Seuil 80% (Vital Few)', chartArea.right - 8, y80 - 6);
        ctx.restore();
      }
    };

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'bar',
      data: {
        labels: pareto.labels,
        datasets: [
          {
            type: 'bar',
            label: seriesLabel,
            yAxisID: 'y',
            data: pareto.values,
            backgroundColor: pareto.cumulativePcts.map(pct =>
              pct <= 80 ? hexToRgba(barColor, isDark ? 0.90 : 0.80) : hexToRgba(tokens.emphasis?.context || '#CBD5E1', 0.50)
            ),
            borderColor: barColor,
            borderWidth: 1.5,
            borderRadius: 4,
            datalabels: {
              display: showDataLabels,
              color: tokens.textPrimary
            },
            order: 2
          },
          {
            type: 'line',
            label: 'Cumul (%)',
            yAxisID: 'y1',
            data: pareto.cumulativePcts,
            borderColor: lineColor,
            backgroundColor: hexToRgba(lineColor, 0.10),
            borderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: lineColor,
            tension: 0.2,
            datalabels: {
              display: showDataLabels,
              align: 'top',
              anchor: 'center',
              color: lineColor,
              font: { weight: '700', size: 10 },
              formatter: (v) => `${v}%`
            },
            order: 1
          }
        ]
      },
      options: {
        ...defaultOpts,
        _kitChartsTokens: tokens,
        showDataLabels: showDataLabels,
        animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          ...defaultOpts.plugins,
          datalabels: getDataLabelOptions(tokens, {
            display: showDataLabels,
            formatter: (v, ctx) => {
              if (ctx && ctx.dataset && ctx.dataset.type === 'line') {
                return `${v}%`;
              }
              return formatLabelValue(v);
            }
          }),
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: tokens.textPrimary,
              font: { family: tokens.fontFamily, size: 12 }
            }
          },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              title: (items) => items[0].label,
              label: (ctx) => {
                const idx = ctx.dataIndex;
                if (ctx.dataset.type === 'bar') {
                  const pctIndiv = ((pareto.values[idx] / pareto.total) * 100).toFixed(1);
                  return `Effectif : ${ctx.parsed.y} (${pctIndiv}% du total)`;
                }
                return `Cumul : ${ctx.parsed.y}% (Gini = ${gini})`;
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
              font: { family: tokens.fontFamily, size: 11 },
              maxRotation: 30
            }
          },
          y: {
            type: 'linear',
            position: 'left',
            beginAtZero: true,
            grace: '8%',
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: "Nombre d'occurrences",
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          },
          y1: {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            min: 0,
            max: 105,
            grid: { display: false },
            ticks: {
              color: lineColor,
              font: { family: tokens.fontMono, size: 11 },
              callback: (val) => `${val}%`
            },
            title: {
              display: true,
              text: 'Pourcentage cumulé',
              color: lineColor,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      },
      plugins: [pareto80LinePlugin]
    };

    if (typeof Chart === 'undefined') return Object.assign(config, { pareto, gini, computeParetoCumsum, computeGini });
    return new Chart(canvas, config);
  }

  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || function() { return {}; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || function() { return '#2B8CBE'; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || function() { return 'nominal'; };

  function computeParetoCumulative(labels, values) {
    const res = computeParetoCumsum(labels, values);
    return {
      sortedLabels: res.labels,
      sortedValues: res.values,
      cumulativePcts: res.cumulativePcts,
      cumulativePercentages: res.cumulativePcts,
      total: res.total,
      thresholdIndex80: res.thresholdIndex80,
      labels: res.labels,
      values: res.values
    };
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeParetoCumsum,
    computeParetoCumulative,
    computeGini,
    computeGiniCoefficient: computeGini,
    getDataLabelOptions,
    formatLabelValue,
    getEmphasisStyle,
    getValenceColor,
    getThresholdStatus
  };

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/02-composition-part-to-whole/pie-chart
  // --------------------------------------------------------------------------
  global.KitCharts["pie-chart"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function() { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function(t, o) { return o || {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 02-composition-part-to-whole/pie-chart/template.js
 * @description Template Chart.js v4+ pour Diagramme Circulaire (Pie Chart).
 * Psychophysique: Pas d'axes cartésiens x/y, départ à 12h, tri décroissant.
 */

const DEFAULT_DATA = {
  labels: ['Mobile', 'Desktop', 'Tablette'],
  datasets: [{
    label: 'Trafic Web (%)',
    data: [58, 34, 8]
  }]
};

function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) throw new Error('Canvas not found');

  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  const rawData = customData || DEFAULT_DATA;
  let labels = rawData.labels ? [...rawData.labels] : [];
  let rawValues = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || [58, 34, 8];
  const ds0 = rawData.datasets?.[0] || {};

  // Support d'accentuation et de valence
  const dataLen = Array.isArray(rawValues) ? rawValues.length : labels.length;
  let initialColors = null;

  if (Array.isArray(ds0.emphasisRoles) || Array.isArray(ds0.roles)) {
    const roles = ds0.emphasisRoles || ds0.roles;
    initialColors = roles.map((r, i) => getEmphasisStyle(tokens, r).backgroundColor || getColor(tokens, i));
  } else if (Array.isArray(ds0.valences)) {
    const metricType = ds0.metricType || 'gain';
    initialColors = ds0.valences.map(v => getValenceColor(tokens, v, metricType));
  } else if (ds0.focusIndex !== undefined) {
    initialColors = Array.from({ length: dataLen }, (_, i) =>
      i === ds0.focusIndex ? (tokens.emphasis?.focal || getColor(tokens, 0)) : (tokens.emphasis?.context || tokens.textMuted || '#CBD5E1')
    );
  } else if (Array.isArray(ds0.backgroundColor)) {
    initialColors = [...ds0.backgroundColor];
  }

  // Tri décroissant pour maximiser la discrimination angulaire
  const pairs = labels.map((lbl, i) => ({
    label: lbl,
    val: typeof rawValues[i] === 'object' && rawValues[i] !== null ? (rawValues[i].value ?? rawValues[i].v ?? 0) : Number(rawValues[i]) || 0,
    color: initialColors ? initialColors[i] : null
  }));

  if (ds0.sorted !== false) {
    pairs.sort((a, b) => b.val - a.val);
  }

  labels = pairs.map(p => p.label);
  const data = pairs.map(p => p.val);
  const bgColors = pairs.map((p, i) => p.color || getColor(tokens, i));

  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        label: ds0.label || 'Proportion',
        data,
        backgroundColor: bgColors,
        borderColor: tokens.bg || '#FFFFFF',
        borderWidth: isTufte ? 1 : 2
      }]
    },
    options: {
      ...defaultOpts,
      responsive: true,
      maintainAspectRatio: false,
      rotation: -90, // Départ à 12h
      scales: {}, // AUCUN AXE CARTÉSIEN X/Y
      animation: getAccessibleAnimationOptions(tokens, { duration: 450, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'nearest',
        intersect: true,
        axis: 'xy'
      },
      hover: {
        mode: 'nearest',
        intersect: true,
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 120
      },
      plugins: {
        datalabels: getDataLabelOptions(tokens, {
          display: showDataLabels,
          formatter: (val) => {
            const num = typeof val === 'object' && val !== null ? (val.value ?? val.v ?? 0) : val;
            return `${num}%`;
          }
        }),
        legend: {
          display: !isTufte,
          position: 'right',
          labels: {
            color: tokens.textPrimary,
            font: { family: tokens.fontFamily, size: 12, weight: '500' },
            boxWidth: 12,
            padding: 12,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono || 'monospace', size: 12, weight: '400' },
          animation: (isTufte || isReducedMotionPreferred()) ? false : { duration: 150, easing: 'easeOutQuad' },
          callbacks: {
            label: (ctx) => {
              const val = ctx.parsed;
              return ` ${ctx.label} : ${val} %`;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }
  return { canvas, config, data: config.data, options: config.options, destroy: () => {}, update: () => {}, resize: () => {} };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    isReducedMotionPreferred: typeof isReducedMotionPreferred === 'function' ? isReducedMotionPreferred : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getPartitionInteractionOptions: typeof getPartitionInteractionOptions === 'function' ? getPartitionInteractionOptions : null,
    computeAntiOcclusionTooltipPosition: typeof computeAntiOcclusionTooltipPosition === 'function' ? computeAntiOcclusionTooltipPosition : null,
    getDataLabelOptions: typeof getDataLabelOptions === 'function' ? getDataLabelOptions : null,
    formatLabelValue: typeof formatLabelValue === 'function' ? formatLabelValue : null,
    kitChartsDataLabelsPlugin: typeof kitChartsDataLabelsPlugin !== 'undefined' ? kitChartsDataLabelsPlugin : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/02-composition-part-to-whole/stacked-bar-100
  // --------------------------------------------------------------------------
  global.KitCharts["stacked-bar-100"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function() { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function(t, o) { return o || {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 02-composition-part-to-whole/stacked-bar-100/template.js
 * @description Template Chart.js v4+ pour Barres Empilées 100% (100% Stacked Bar Chart).
 * Psychophysique: Comparaison normalisée de la composition relative entre multiples entités/groupes.
 * Règle d'or: beginAtZero: true sur Y, total normalisé à 100%, segments de base et de sommet stables.
 */

/**
 * Données par défaut représentatives (Répartition en % de l'état des projets par équipe opérationnelle)
 */
const DEFAULT_DATA = {
  labels: ['Équipe A', 'Équipe B', 'Équipe C', 'Équipe D'],
  datasets: [
    { label: 'Succès', data: [75, 60, 82, 90] },
    { label: 'En cours', data: [15, 25, 10, 5] },
    { label: 'Échec', data: [10, 15, 8, 5] }
  ]
};

/**
 * Crée et initialise un diagramme en barres empilées 100% dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @param {Object} [options={}] - Options additionnelles (ex: showDataLabels)
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  // Destruction propre de l'instance précédente
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  // Préparation des données avec support d'accentuation et de valence
  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];
  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const primaryColor = getColor(tokens, idx);

    let bgColors = ds.backgroundColor;
    let borderColors = ds.borderColor;
    let borderWidths = ds.borderWidth;

    if (!bgColors || ds.emphasisRole || ds.role || ds.valence !== undefined || ds.metricType) {
      if (ds.emphasisRole || ds.role) {
        const style = getEmphasisStyle(tokens, ds.emphasisRole || ds.role);
        bgColors = ds.backgroundColor || style.backgroundColor || primaryColor;
        borderColors = ds.borderColor || style.borderColor || primaryColor;
        borderWidths = typeof ds.borderWidth === 'number' ? ds.borderWidth : (style.borderWidth || 0);
      } else if (ds.valence !== undefined || ds.direction !== undefined) {
        const valColor = getValenceColor(tokens, ds.valence !== undefined ? ds.valence : ds.direction, ds.metricType || 'gain');
        bgColors = ds.backgroundColor || valColor;
        borderColors = ds.borderColor || valColor;
      } else {
        bgColors = ds.backgroundColor || primaryColor;
        borderColors = ds.borderColor || primaryColor;
      }
    }

    return {
      label: ds.label || `Segment ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      backgroundColor: bgColors,
      borderColor: borderColors,
      borderWidth: typeof borderWidths === 'number' ? borderWidths : 0,
      borderRadius: isTufte ? 0 : (idx === (rawData.datasets?.length || 1) - 1 ? 4 : 0),
      borderSkipped: false,
      categoryPercentage: typeof ds.categoryPercentage === 'number' ? ds.categoryPercentage : 0.8,
      barPercentage: typeof ds.barPercentage === 'number' ? ds.barPercentage : 0.9
    };
  });

  const chartData = { labels, datasets };

  // Options Chart.js v4+ avec empilement 100% et capture Fitts 1D
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'bar',
    data: chartData,
    options: {
      ...defaultOpts,
      animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'index',
        intersect: false,
        axis: 'x'
      },
      hover: {
        mode: 'index',
        intersect: false,
        axis: 'x',
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 100
      },
      categoryPercentage: 0.8,
      barPercentage: 0.9,
      plugins: {
        ...defaultOpts.plugins,
        datalabels: getDataLabelOptions(tokens, {
          display: showDataLabels,
          formatter: (val) => {
            const num = typeof val === 'object' && val !== null ? (val.value ?? val.y ?? val.v ?? 0) : val;
            return `${num}%`;
          }
        }),
        legend: {
          ...defaultOpts.plugins.legend,
          display: !isTufte,
          position: 'top',
          align: 'end',
          reverse: true // Aligne la légende visuelle avec l'ordre d'empilement
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          mode: 'index',
          intersect: false,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono || 'monospace',
            size: 12,
            weight: '400'
          },
          animation: (isTufte || isReducedMotionPreferred()) ? false : { duration: 150, easing: 'easeOutQuad' },
          callbacks: {
            label: (context) => {
              const val = context.parsed.y !== null && context.parsed.y !== undefined
                ? context.parsed.y
                : context.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(val)
                : val;
              return ` ${context.dataset.label || ''}: ${formatted}%`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true, // Empilement sur l'axe X
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 6
          }
        },
        y: {
          stacked: true, // Empilement sur l'axe Y
          beginAtZero: true, // Règle psychophysique absolue
          max: 100, // Plafond normalisé à 100%
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontMono || tokens.fontFamily,
              size: 11
            },
            padding: 8,
            callback: (val) => `${val}%`
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Simulation mock pour environnement Node.js headless
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    isReducedMotionPreferred: typeof isReducedMotionPreferred === 'function' ? isReducedMotionPreferred : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getPartitionInteractionOptions: typeof getPartitionInteractionOptions === 'function' ? getPartitionInteractionOptions : null,
    computeAntiOcclusionTooltipPosition: typeof computeAntiOcclusionTooltipPosition === 'function' ? computeAntiOcclusionTooltipPosition : null,
    getDataLabelOptions: typeof getDataLabelOptions === 'function' ? getDataLabelOptions : null,
    formatLabelValue: typeof formatLabelValue === 'function' ? formatLabelValue : null,
    kitChartsDataLabelsPlugin: typeof kitChartsDataLabelsPlugin !== 'undefined' ? kitChartsDataLabelsPlugin : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/02-composition-part-to-whole/stacked-total-line
  // --------------------------------------------------------------------------
  global.KitCharts["stacked-total-line"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeStackedTotals(labelsOrDatasets, maybeDatasets) {
    const datasets = Array.isArray(maybeDatasets) ? maybeDatasets : (Array.isArray(labelsOrDatasets) ? labelsOrDatasets : []);
    if (!Array.isArray(datasets) || datasets.length === 0) {
      const empty = [];
      empty.totals = [];
      empty.maxTotal = 0;
      empty.shares = [];
      return empty;
    }
    const len = (datasets[0] && Array.isArray(datasets[0].data)) ? datasets[0].data.length : 0;
    const totals = new Array(len).fill(0);
    datasets.forEach(ds => {
      if (Array.isArray(ds.data)) {
        ds.data.forEach((val, idx) => {
          totals[idx] += Number(val) || 0;
        });
      }
    });
    const roundedTotals = totals.map(v => Math.round(v * 10) / 10);
    const maxTotal = Math.max(...roundedTotals, 0);
    const shares = datasets.map(ds => {
      if (!Array.isArray(ds.data)) return [];
      return ds.data.map((val, idx) => (roundedTotals[idx] > 0 ? (Number(val) / roundedTotals[idx]) * 100 : 0));
    });
    roundedTotals.totals = roundedTotals;
    roundedTotals.maxTotal = maxTotal;
    roundedTotals.shares = shares;
    return roundedTotals;
  }

  const DEFAULT_DATA = {
    labels: ['T1 2024', 'T2 2024', 'T3 2024', 'T4 2024', 'T1 2025', 'T2 2025', 'T3 2025', 'T4 2025'],
    datasets: [
      { label: 'Cloud SaaS', data: [120, 145, 170, 195, 230, 260, 290, 330] },
      { label: 'Services Pro', data: [80, 85, 90, 95, 90, 85, 80, 75] },
      { label: 'Licences On-Prem', data: [110, 100, 90, 80, 70, 60, 50, 40] }
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
    const rawDatasets = rawData.datasets || DEFAULT_DATA.datasets;

    const totals = computeStackedTotals(rawDatasets);
    const totalColor = tokens.emphasis?.focal || (isDark ? '#ECEFF4' : '#0F172A');

    const processedDatasets = rawDatasets.map((ds, idx) => {
      const color = getColor(tokens, idx);
      return {
        type: 'bar',
        label: ds.label,
        data: ds.data,
        backgroundColor: hexToRgba(color, 0.85),
        borderColor: color,
        borderWidth: 1,
        stack: 'totalStack',
        datalabels: {
          display: showDataLabels
        },
        order: 2
      };
    });

    processedDatasets.push({
      type: 'line',
      label: "Chiffre d'Affaires Total",
      data: totals,
      borderColor: totalColor,
      backgroundColor: totalColor,
      borderWidth: 3,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: totalColor,
      tension: 0.25,
      datalabels: {
        display: showDataLabels,
        align: 'top',
        anchor: 'center',
        color: totalColor,
        font: { weight: '700', size: 10 },
        formatter: (v) => formatLabelValue(v)
      },
      order: 1
    });

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'bar',
      data: {
        labels,
        datasets: processedDatasets
      },
      options: {
        ...defaultOpts,
        _kitChartsTokens: tokens,
        showDataLabels: showDataLabels,
        animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          ...defaultOpts.plugins,
          datalabels: getDataLabelOptions(tokens, {
            display: showDataLabels,
            formatter: (v) => formatLabelValue(v)
          }),
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: tokens.textPrimary,
              font: { family: tokens.fontFamily, size: 12 }
            }
          },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              title: (items) => `Période : ${items[0].label}`,
              footer: (items) => {
                const totalVal = totals[items[0].dataIndex];
                return `Total Consolidé : ${totalVal.toLocaleString('fr-FR')} k€`;
              }
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            stacked: true,
            grid: { display: false }
          },
          y: {
            ...defaultOpts.scales.y,
            stacked: true,
            beginAtZero: true,
            grace: '10%',
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Revenu (k€)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      }
    };

    if (typeof Chart === 'undefined') return { config, totals, computeStackedTotals };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeStackedTotals,
    getDataLabelOptions,
    formatLabelValue,
    getEmphasisStyle: (KitChartsTheme && KitChartsTheme.getEmphasisStyle),
    getValenceColor: (KitChartsTheme && KitChartsTheme.getValenceColor),
    getThresholdStatus: (KitChartsTheme && KitChartsTheme.getThresholdStatus)
  };

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/02-composition-part-to-whole/sunburst
  // --------------------------------------------------------------------------
  global.KitCharts["sunburst"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function() { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function(t, o) { return o || {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 02-composition-part-to-whole/sunburst/template.js
 * @description Template Chart.js v4+ pour Diagramme Rayonnant (Sunburst Chart / Multi-level Doughnut).
 * Psychophysique: Encodage hiérarchique radial en anneaux concentriques (Niveau 1 au centre, Niveau 2 en périphérie).
 * Règle d'or: Alignement angulaire des sous-branches, palettes graduelles cohérentes par branche.
 */

/**
 * Données par défaut représentatives (Répartition géographique hiérarchique : Régions > Sous-régions)
 */
const DEFAULT_DATA = {
  labels: ['Europe', 'Amériques', 'Asie-Pacifique', 'Afrique & ME'],
  datasets: [
    // Anneau intérieur (Niveau 1 : Régions Macro)
    {
      label: 'Régions',
      data: [40, 30, 20, 10],
      weight: 1
    },
    // Anneau extérieur (Niveau 2 : Sous-régions)
    {
      label: 'Sous-Régions',
      data: [20, 20, 15, 15, 12, 8, 6, 4],
      weight: 1.8
    }
  ]
};

/**
 * Crée et initialise un diagramme rayonnant (Sunburst Chart) dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @param {Object} [options={}] - Options additionnelles (ex: showDataLabels)
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  // Destruction propre de l'instance précédente
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  // Préparation des données avec support d'accentuation
  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];
  const datasets = (rawData.datasets || []).map((ds, levelIdx) => {
    const dataLen = Array.isArray(ds.data) ? ds.data.length : 1;
    let bgColors = ds.backgroundColor;

    if (!bgColors || Array.isArray(ds.emphasisRoles) || Array.isArray(ds.roles) || Array.isArray(ds.valences) || ds.focusIndex !== undefined) {
      if (Array.isArray(ds.emphasisRoles) || Array.isArray(ds.roles)) {
        const roles = ds.emphasisRoles || ds.roles;
        bgColors = roles.map((r, i) => getEmphasisStyle(tokens, r).backgroundColor || getColor(tokens, (levelIdx * 4 + i) % tokens.palette.length));
      } else if (Array.isArray(ds.valences)) {
        const metricType = ds.metricType || 'gain';
        bgColors = ds.valences.map(v => getValenceColor(tokens, v, metricType));
      } else if (ds.focusIndex !== undefined) {
        bgColors = Array.from({ length: dataLen }, (_, i) =>
          i === ds.focusIndex ? (tokens.emphasis?.focal || getColor(tokens, 0)) : (tokens.emphasis?.context || tokens.textMuted || '#CBD5E1')
        );
      } else if (!Array.isArray(bgColors)) {
        bgColors = Array.from({ length: dataLen }, (_, i) => getColor(tokens, (levelIdx * 4 + i) % tokens.palette.length));
      }
    }

    return {
      label: ds.label || `Niveau ${levelIdx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      backgroundColor: bgColors,
      borderColor: tokens.bg,
      borderWidth: isTufte ? 1 : 2,
      weight: ds.weight !== undefined ? ds.weight : (levelIdx === 0 ? 1 : 1.5)
    };
  });

  const chartData = { labels, datasets };

  // Options Chart.js v4+ avec capture de partition multi-niveaux
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'doughnut',
    data: chartData,
    options: {
      scales: {},
      ...defaultOpts,
      cutout: '35%', // Cavité centrale modérée pour structure multi-anneaux
      rotation: -90, // Départ à 12h
      animation: getAccessibleAnimationOptions(tokens, { duration: 450, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'nearest',
        intersect: true,
        axis: 'xy'
      },
      hover: {
        mode: 'nearest',
        intersect: true,
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 120
      },
      plugins: {
        ...defaultOpts.plugins,
        datalabels: getDataLabelOptions(tokens, {
          display: showDataLabels,
          formatter: (val) => {
            const num = typeof val === 'object' && val !== null ? (val.value ?? val.v ?? 0) : val;
            return `${num}%`;
          }
        }),
        legend: {
          ...defaultOpts.plugins.legend,
          display: !isTufte,
          position: 'right',
          align: 'center'
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono || 'monospace', size: 12, weight: '400' },
          animation: (isTufte || isReducedMotionPreferred()) ? false : { duration: 150, easing: 'easeOutQuad' },
          callbacks: {
            label: (context) => {
              const val = context.parsed !== null && context.parsed !== undefined
                ? context.parsed
                : context.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val)
                : val;
              return ` ${context.dataset.label || ''} (${context.label || ''}): ${formatted}%`;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Simulation mock pour environnement Node.js headless
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    isReducedMotionPreferred: typeof isReducedMotionPreferred === 'function' ? isReducedMotionPreferred : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getPartitionInteractionOptions: typeof getPartitionInteractionOptions === 'function' ? getPartitionInteractionOptions : null,
    computeAntiOcclusionTooltipPosition: typeof computeAntiOcclusionTooltipPosition === 'function' ? computeAntiOcclusionTooltipPosition : null,
    getDataLabelOptions: typeof getDataLabelOptions === 'function' ? getDataLabelOptions : null,
    formatLabelValue: typeof formatLabelValue === 'function' ? formatLabelValue : null,
    kitChartsDataLabelsPlugin: typeof kitChartsDataLabelsPlugin !== 'undefined' ? kitChartsDataLabelsPlugin : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/02-composition-part-to-whole/treemap
  // --------------------------------------------------------------------------
  global.KitCharts["treemap"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function() { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function(t, o) { return o || {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 02-composition-part-to-whole/treemap/template.js
 * @description Template Chart.js v4+ pour Carte Proportionnelle (Treemap hiérarchique).
 * Psychophysique: Subdivision récursive de l'espace en rectangles proportionnels à la valeur (Squarified layout).
 * Règle d'or: Ratio hauteur/largeur proche du carré (aspect ratio ~1), étiquetage lisible, palette hiérarchique.
 */

/**
 * Données par défaut représentatives (Répartition de la capitalisation boursière par secteur et industrie)
 */
const DEFAULT_DATA = {
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
    groups: ['category', 'name']
  }]
};

/**
 * Crée et initialise un treemap dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @param {Object} [options={}] - Options additionnelles (ex: showDataLabels)
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  // Destruction propre de l'instance précédente
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  // Préparation des données
  const rawData = customData || DEFAULT_DATA;
  const datasets = (rawData.datasets || []).map((ds, idx) => {
    // Détermination de la couleur de fond par élément ou groupe avec support de l'accentuation et de la valence
    const bgFn = typeof ds.backgroundColor === 'function'
      ? ds.backgroundColor
      : (ctx) => {
          const raw = ctx.raw;
          const item = raw ? (raw._data || raw) : null;
          if (item) {
            if (item.emphasisRole || item.role) {
              return getEmphasisStyle(tokens, item.emphasisRole || item.role).backgroundColor || getColor(tokens, 0);
            }
            if (item.valence !== undefined || item.direction !== undefined) {
              return getValenceColor(tokens, item.valence !== undefined ? item.valence : item.direction, item.metricType || 'gain');
            }
          }
          const itemIndex = ctx.dataIndex !== undefined ? ctx.dataIndex : 0;
          return getColor(tokens, itemIndex);
        };

    return {
      tree: ds.tree || ds.data || [],
      key: ds.key || 'value',
      groups: ds.groups || ['category', 'name'],
      backgroundColor: ds.backgroundColor ? ds.backgroundColor : bgFn,
      borderColor: tokens.bg,
      borderWidth: isTufte ? 1 : 1.5,
      spacing: 1,
      labels: {
        display: showDataLabels,
        align: 'left',
        position: 'top',
        formatter: (ctx) => {
          if (!showDataLabels) return '';
          const raw = ctx.raw;
          const item = raw ? (raw._data || raw) : null;
          if (!item) return '';
          const name = item.name || item.category || '';
          const val = raw.v !== undefined ? raw.v : (item.value || '');
          return val ? `${name} (${val})` : name;
        },
        color: (ctx) => {
          // Contraste de texte adaptatif
          return tokens.isDark ? '#ECEFF4' : '#FFFFFF';
        },
        font: {
          family: tokens.fontFamily,
          size: 11,
          weight: '600'
        },
        padding: 4
      }
    };
  });

  const chartData = { datasets };

  // Options Chart.js v4+ pour Treemap avec capture de partition 2D
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'treemap',
    data: chartData,
    options: {
      scales: {},
      ...defaultOpts,
      animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'nearest',
        intersect: true,
        axis: 'xy'
      },
      hover: {
        mode: 'nearest',
        intersect: true,
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 100
      },
      plugins: {
        ...defaultOpts.plugins,
        legend: {
          display: false
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono || 'monospace', size: 12, weight: '400' },
          animation: (isTufte || isReducedMotionPreferred()) ? false : { duration: 150, easing: 'easeOutQuad' },
          callbacks: {
            title: (items) => {
              if (!items || !items[0]) return '';
              const raw = items[0].raw;
              if (!raw) return '';
              const g = raw._data ? raw._data : raw;
              return g.name ? `${g.category || ''} > ${g.name}` : (g.category || '');
            },
            label: (context) => {
              const raw = context.raw;
              const val = raw && raw.v !== undefined ? raw.v : (raw && raw.value !== undefined ? raw.value : raw);
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val)
                : val;
              return ` Valeur : ${formatted} Mds €`;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Simulation mock pour environnement Node.js headless
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    isReducedMotionPreferred: typeof isReducedMotionPreferred === 'function' ? isReducedMotionPreferred : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getPartitionInteractionOptions: typeof getPartitionInteractionOptions === 'function' ? getPartitionInteractionOptions : null,
    computeAntiOcclusionTooltipPosition: typeof computeAntiOcclusionTooltipPosition === 'function' ? computeAntiOcclusionTooltipPosition : null,
    getDataLabelOptions: typeof getDataLabelOptions === 'function' ? getDataLabelOptions : null,
    formatLabelValue: typeof formatLabelValue === 'function' ? formatLabelValue : null,
    kitChartsDataLabelsPlugin: typeof kitChartsDataLabelsPlugin !== 'undefined' ? kitChartsDataLabelsPlugin : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/02-composition-part-to-whole/waffle-chart
  // --------------------------------------------------------------------------
  global.KitCharts["waffle-chart"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function() { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function(t, o) { return o || {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 02-composition-part-to-whole/waffle-chart/template.js
 * @description Template Chart.js v4+ pour Graphique Gaufre (Waffle Chart / 10x10 Isotype Grid).
 * Psychophysique: Encodage unitaire discret (100 cellules carrées, 1 cellule = 1%).
 * Règle d'or: Grille 10x10 régulière, comptage visuel direct, forte supériorité sur le camembert pour les pourcentages entiers.
 */

/**
 * Génère une grille 10x10 (100 cellules) pour une valeur de pourcentage donnée (0-100%).
 * @param {number} percentage
 * @returns {Array<{x: number, y: number, v: number}>}
 */
function generateWaffleData(percentage = 68) {
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));
  return Array.from({ length: 100 }, (_, i) => ({
    x: (i % 10) + 1,
    y: Math.floor(i / 10) + 1,
    v: i < clamped ? 1 : 0
  }));
}

/**
 * Données par défaut représentatives (Taux d'atteinte de l'objectif annuel : 68%)
 */
const DEFAULT_DATA = {
  datasets: [{
    label: 'Progression des Objectifs (%)',
    data: generateWaffleData(68)
  }]
};

/**
 * Crée et initialise un graphique gaufre (Waffle Chart) dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @param {Object} [options={}] - Options additionnelles (ex: showDataLabels)
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  // Destruction propre de l'instance précédente
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isDark = Boolean(tokens.isDark);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);
  const primaryColor = getColor(tokens, 0);
  const inactiveColor = isDark ? 'rgba(236, 239, 244, 0.12)' : 'rgba(15, 23, 42, 0.08)';

  // Préparation des données avec support d'accentuation et de valence
  const rawData = customData || DEFAULT_DATA;
  const datasets = (rawData.datasets || []).map((ds, idx) => {
    let data = ds.data;
    if (!data || !Array.isArray(data) || data.length === 0) {
      data = generateWaffleData(68);
    } else if (typeof data[0] === 'number') {
      // Si un simple nombre de pourcentage est passé
      data = generateWaffleData(data[0]);
    }

    let dsColor = ds.backgroundColor;
    if (!dsColor) {
      if (ds.emphasisRole || ds.role) {
        dsColor = getEmphasisStyle(tokens, ds.emphasisRole || ds.role).backgroundColor || primaryColor;
      } else if (ds.metricType || ds.valence !== undefined) {
        dsColor = getValenceColor(tokens, ds.valence !== undefined ? ds.valence : 1, ds.metricType || 'gain');
      } else {
        dsColor = primaryColor;
      }
    }

    return {
      label: ds.label || 'Progression (%)',
      data: data,
      width: ({ chart }) => {
        const area = chart.chartArea || {};
        const w = (area.right - area.left) || 300;
        return Math.max(12, Math.floor(w / 11) - 3);
      },
      height: ({ chart }) => {
        const area = chart.chartArea || {};
        const h = (area.bottom - area.top) || 300;
        return Math.max(12, Math.floor(h / 11) - 3);
      },
      backgroundColor: (c) => {
        const raw = c.raw || (c.dataset?.data?.[c.dataIndex]);
        const active = raw ? (raw.v === 1 || raw.v === true) : false;
        return active ? dsColor : inactiveColor;
      },
      borderColor: tokens.bg,
      borderWidth: 2,
      borderRadius: isTufte ? 0 : 3
    };
  });

  const chartData = { datasets };

  const waffleSummaryPlugin = {
    id: 'waffleSummaryPlugin_' + Math.random().toString(36).substring(2, 7),
    afterDraw(chart) {
      if (!showDataLabels) return;
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
      const ds = chart.data.datasets?.[0];
      if (!ds) return;
      const activeCount = (ds.data || []).filter(d => d && (d.v === 1 || d.v === true)).length;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const cx = (chartArea.left + chartArea.right) / 2;
      const cy = chartArea.bottom + 8;
      ctx.font = `700 14px ${tokens.fontMono || 'monospace'}`;
      ctx.fillStyle = tokens.textPrimary || '#0F172A';
      ctx.fillText(`${activeCount}% atteint (${activeCount} / 100)`, cx, cy);
      ctx.restore();
    }
  };

  // Options Chart.js v4+ pour Matrix / Waffle avec capture 2D
  const defaultOpts = getChartDefaultOptions(tokens);
  const config = {
    type: 'matrix',
    data: chartData,
    plugins: [waffleSummaryPlugin],
    options: {
      ...defaultOpts,
      layout: {
        padding: { bottom: showDataLabels ? 25 : 5 }
      },
      animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
      interaction: {
        mode: 'nearest',
        intersect: true,
        axis: 'xy'
      },
      hover: {
        mode: 'nearest',
        intersect: true,
        animationDuration: (isTufte || isReducedMotionPreferred()) ? 0 : 100
      },
      plugins: {
        ...defaultOpts.plugins,
        legend: {
          display: false
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono || 'monospace', size: 12, weight: '400' },
          animation: (isTufte || isReducedMotionPreferred()) ? false : { duration: 150, easing: 'easeOutQuad' },
          callbacks: {
            title: () => 'Avancement Global',
            label: (context) => {
              const dataset = context.dataset;
              const activeCount = (dataset.data || []).filter(d => d && (d.v === 1 || d.v === true)).length;
              return ` ${dataset.label || 'Score'} : ${activeCount} / 100 (${activeCount}%)`;
            }
          }
        }
      },
      scales: {
        x: {
          display: false,
          min: 0.5,
          max: 10.5
        },
        y: {
          display: false,
          min: 0.5,
          max: 10.5
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Simulation mock pour environnement Node.js headless
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    isReducedMotionPreferred: typeof isReducedMotionPreferred === 'function' ? isReducedMotionPreferred : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getPartitionInteractionOptions: typeof getPartitionInteractionOptions === 'function' ? getPartitionInteractionOptions : null,
    computeAntiOcclusionTooltipPosition: typeof computeAntiOcclusionTooltipPosition === 'function' ? computeAntiOcclusionTooltipPosition : null,
    getDataLabelOptions: typeof getDataLabelOptions === 'function' ? getDataLabelOptions : null,
    formatLabelValue: typeof formatLabelValue === 'function' ? formatLabelValue : null,
    kitChartsDataLabelsPlugin: typeof kitChartsDataLabelsPlugin !== 'undefined' ? kitChartsDataLabelsPlugin : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/03-distribution/beeswarm-plot
  // --------------------------------------------------------------------------
  global.KitCharts["beeswarm-plot"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

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
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 03-distribution/beeswarm-plot/template.js
 * @description Template Chart.js v4+ pour Essaim de Points Non-Chevauchants (Beeswarm Swarm Plot).
 * Psychophysique: Encodage 1D individuel exact combiné à une compacité d'essaim (packing) révélant la densité locale sans aucun chevauchement.
 * Règle d'or: Algorithme d'empilement déterministe par force/collision assurant une distance minimale garantie entre chaque point.
 */



/**
 * Calcule un positionnement d'essaim (beeswarm packing) déterministe et sans collision.
 *
 * @param {number[]} values - Valeurs d'observations Y
 * @param {number} categoryX - Position centrale sur l'axe X (ex: 1, 2, ...)
 * @param {number} [radiusY=1.5] - Rayon de collision effectif en unités Y
 * @param {number} [stepX=0.035] - Incrément de déplacement latéral
 * @returns {{x: number, y: number}[]} Points positionnés sans collision
 */
function computeBeeswarmLayout(values, categoryX, radiusY = 1.5, stepX = 0.035) {
  if (!Array.isArray(values) || values.length === 0) return [];

  const valid = values.map(v => typeof v === 'number' ? v : (v?.y ?? 0)).filter(v => Number.isFinite(v));
  if (valid.length === 0) return [];

  // Tri pour empilement cohérent
  const sorted = [...valid].sort((a, b) => a - b);
  const placed = [];

  const yRange = (sorted[sorted.length - 1] - sorted[0]) || 1;
  const effectiveRadiusY = radiusY || (yRange / 40);

  for (let i = 0; i < sorted.length; i++) {
    const y = sorted[i];
    let bestX = categoryX;
    let found = false;

    // Tester l'axe central puis les décalages alternés gauche / droite
    let k = 0;
    while (!found && k < 100) {
      const offset = (k === 0) ? 0 : (k % 2 === 1 ? 1 : -1) * Math.ceil(k / 2) * stepX;
      const candX = categoryX + offset;

      let collides = false;
      for (const p of placed) {
        const dy = Math.abs(p.y - y);
        const dx = Math.abs(p.x - candX);
        // Distance normalisée elliptique (ratio hauteur/largeur d'affichage)
        const distSq = Math.pow(dx / stepX, 2) + Math.pow(dy / effectiveRadiusY, 2);
        if (distSq < 1.0) {
          collides = true;
          break;
        }
      }

      if (!collides) {
        bestX = candX;
        found = true;
      }
      k++;
    }

    placed.push({ x: bestX, y });
  }

  return placed;
}

/**
 * Données par défaut représentatives (Scores de test d'utilisabilité par cohorte, N=120)
 */
const DEFAULT_DATA = (() => {
  const genVals = (count, mean, std) => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      // Approximation normale déterministe
      const z = (Math.sin(i * 1.7) + Math.cos(i * 2.3) + Math.sin(i * 3.1)) / 1.7;
      arr.push(Math.round((mean + z * std) * 10) / 10);
    }
    return arr;
  };

  const v1 = genVals(40, 42, 7.5);
  const v2 = genVals(40, 68, 9.0);
  const v3 = genVals(40, 55, 8.0);

  return {
    categories: ['Design Système A', 'Design Système B', 'Design Système C'],
    datasets: [
      {
        label: 'Design Système A',
        data: computeBeeswarmLayout(v1, 1, 1.4, 0.035)
      },
      {
        label: 'Design Système B',
        data: computeBeeswarmLayout(v2, 2, 1.4, 0.035)
      },
      {
        label: 'Design Système C',
        data: computeBeeswarmLayout(v3, 3, 1.4, 0.035)
      }
    ]
  };
})();

/**
 * Crée et initialise un Beeswarm Plot dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément Canvas
 * @param {Object} [customData=null] - Données personnalisées
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';

  const rawData = customData || DEFAULT_DATA;
  const categories = rawData.categories || (rawData.datasets || []).map(d => d.label || '');

  const resolveBeeswarmDatasetStyle = (ds, idx) => {
    if (ds.role || ds.emphasis) {
      const emp = getEmphasisStyle(tokens, ds.role || ds.emphasis);
      return {
        bg: ds.backgroundColor || emp.backgroundColor,
        border: ds.borderColor || emp.borderColor,
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (emp.borderWidth || 1),
        pointStyle: ds.pointStyle || emp.pointStyle || 'circle',
        pointRadius: ds.pointRadius || (isTufte ? 3.5 : 4.5)
      };
    }
    if (ds.valence || ds.metricType || ds.direction !== undefined) {
      const vColor = getValenceColor(tokens, ds.direction ?? ds.delta ?? 0, ds.metricType || ds.valence || 'gain');
      return {
        bg: ds.backgroundColor || vColor,
        border: ds.borderColor || (isTufte ? tokens.textPrimary : vColor),
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : 1,
        pointStyle: ds.pointStyle || 'circle',
        pointRadius: ds.pointRadius || (isTufte ? 3.5 : 4.5)
      };
    }
    const color = getColor(tokens, idx);
    return {
      bg: ds.backgroundColor || color,
      border: ds.borderColor || (isTufte ? tokens.textPrimary : color),
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : 1,
      pointStyle: ds.pointStyle || 'circle',
      pointRadius: ds.pointRadius || (isTufte ? 3.5 : 4.5)
    };
  };

  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const baseStyle = resolveBeeswarmDatasetStyle(ds, idx);
    let points = [];

    if (Array.isArray(ds.data)) {
      if (ds.data.length > 0 && typeof ds.data[0] === 'number') {
        points = computeBeeswarmLayout(ds.data, idx + 1);
      } else {
        points = ds.data;
      }
    }

    const hasPerPointRoles = points.some(p => p && (p.role || p.emphasis || p.anomaly)) || ds.highlightIndices || ds.anomalies;
    let pointBackgroundColors = baseStyle.bg;
    let pointBorderColors = baseStyle.border;
    let pointStyles = baseStyle.pointStyle;
    let pointRadii = baseStyle.pointRadius;

    if (hasPerPointRoles) {
      pointBackgroundColors = points.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return tokens.emphasis?.anomaly || '#D01C8B';
        }
        if (p && (p.role === 'focal' || p.emphasis === 'focal') || (ds.highlightIndices && ds.highlightIndices.includes(pIdx))) {
          return tokens.emphasis?.focal || getColor(tokens, 0);
        }
        if (p && (p.role === 'context' || p.emphasis === 'context')) {
          return tokens.emphasis?.context || '#CBD5E1';
        }
        return baseStyle.bg;
      });

      pointStyles = points.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return 'triangle';
        }
        return baseStyle.pointStyle;
      });

      pointRadii = points.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return 7;
        }
        if (p && (p.role === 'focal' || p.emphasis === 'focal') || (ds.highlightIndices && ds.highlightIndices.includes(pIdx))) {
          return 6;
        }
        return baseStyle.pointRadius;
      });
    }

    return {
      label: ds.label || `Essaim ${idx + 1}`,
      data: points,
      backgroundColor: pointBackgroundColors,
      borderColor: pointBorderColors,
      borderWidth: baseStyle.borderWidth,
      pointStyle: pointStyles,
      pointRadius: pointRadii,
      pointHoverRadius: 7,
      pointHitRadius: 14
    };
  });

  const chartData = { datasets };
  const defaultOpts = getChartDefaultOptions(tokens);
  const spatialOpts = getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 14, hoverRadius: 7 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' });

  const config = {
    type: 'scatter',
    data: chartData,
    options: {
      ...defaultOpts,
      ...spatialOpts,
      animation: animOpts,
      plugins: {
        ...defaultOpts.plugins,
        legend: {
          ...defaultOpts.plugins?.legend,
          display: datasets.length > 1 && !isTufte
        },
        tooltip: {
          ...defaultOpts.plugins?.tooltip,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '400'
          },
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              const xVal = Math.round(items[0].parsed.x);
              const catLabel = categories[xVal - 1] || `Groupe ${xVal}`;
              return `${catLabel}`;
            },
            label: (context) => {
              const yVal = context.parsed.y;
              const formatted = typeof yVal === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(yVal)
                : yVal;
              return ` ${context.dataset.label || 'Point'}: ${formatted}`;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          min: 0.4,
          max: (categories.length || datasets.length) + 0.6,
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            stepSize: 1,
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              weight: '600',
              size: 11
            },
            padding: 8,
            callback: (val) => {
              const idx = Math.round(val) - 1;
              return categories[idx] || '';
            }
          }
        },
        y: {
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 8
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function' && typeof Chart === 'function') {
    return new Chart(canvas, config);
  }

  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/03-distribution/box-plot
  // --------------------------------------------------------------------------
  global.KitCharts["box-plot"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

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
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 03-distribution/box-plot/template.js
 * @description Native Box Plot (Tukey 5-number summary) for kit-charts.
 * Standalone, robust, 100% offline with zero CDN dependencies.
 */

/**
 * Calcule déterministement les statistiques Tukey à 5 nombres (Min, Q1, Médiane, Q3, Max, Outliers)
 * @param {Array<number>} rawArray - Tableau de valeurs numériques
 * @returns {Object} { min, q1, median, q3, max, outliers, mean }
 */
function computeTukeyBoxplotStats(rawArray) {
  if (!Array.isArray(rawArray) || rawArray.length === 0) {
    return { min: 0, q1: 0, median: 0, q3: 0, max: 0, outliers: [], mean: 0 };
  }
  const sorted = [...rawArray].filter(v => typeof v === 'number' && !isNaN(v)).sort((a, b) => a - b);
  if (sorted.length === 0) {
    return { min: 0, q1: 0, median: 0, q3: 0, max: 0, outliers: [], mean: 0 };
  }
  const n = sorted.length;
  const mean = sorted.reduce((sum, v) => sum + v, 0) / n;

  function getQuantile(p) {
    const idx = (n - 1) * p;
    const low = Math.floor(idx);
    const high = Math.ceil(idx);
    if (low === high) return sorted[low];
    return sorted[low] + (sorted[high] - sorted[low]) * (idx - low);
  }

  const median = getQuantile(0.5);
  const q1 = getQuantile(0.25);
  const q3 = getQuantile(0.75);
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;

  const outliers = [];
  const valid = [];
  for (const v of sorted) {
    if (v < lowerFence || v > upperFence) {
      outliers.push(v);
    } else {
      valid.push(v);
    }
  }

  const min = valid.length > 0 ? valid[0] : (sorted[0] ?? 0);
  const max = valid.length > 0 ? valid[valid.length - 1] : (sorted[sorted.length - 1] ?? 0);

  return { min, q1, median, q3, max, outliers, mean, n, rawPoints: sorted };
}

const DEFAULT_DATA = {
  labels: ['Contrôle', 'Traitement A', 'Traitement B', 'Placebo'],
  datasets: [{
    label: 'Biomarqueur (mg/dL)',
    data: [
      { min: 12, q1: 18, median: 24, q3: 31, max: 42, outliers: [48] },
      { min: 19, q1: 28, median: 36, q3: 44, max: 55, outliers: [] },
      { min: 22, q1: 34, median: 42, q3: 50, max: 62, outliers: [14, 68] },
      { min: 10, q1: 16, median: 22, q3: 29, max: 38, outliers: [] }
    ]
  }]
};

function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) throw new Error('Canvas not found');

  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';

  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels || ['Groupe 1', 'Groupe 2', 'Groupe 3', 'Groupe 4'];
  const rawBoxData = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || [
    { min: 12, q1: 18, median: 24, q3: 31, max: 42, outliers: [48] },
    { min: 19, q1: 28, median: 36, q3: 44, max: 55, outliers: [] },
    { min: 22, q1: 34, median: 42, q3: 50, max: 62, outliers: [14, 68] },
    { min: 10, q1: 16, median: 22, q3: 29, max: 38, outliers: [] }
  ];
  const boxStats = rawBoxData.map(d => Array.isArray(d) ? computeTukeyBoxplotStats(d) : d);

  // Floating bars [q1, q3]
  const barData = boxStats.map(s => [s.q1, s.q3]);

  // Compute absolute min & max across all Tukey stats & outliers to properly bound the Y scale
  const allValues = [];
  boxStats.forEach(stat => {
    if (!stat) return;
    ['min', 'q1', 'median', 'q3', 'max'].forEach(key => {
      if (typeof stat[key] === 'number' && !isNaN(stat[key])) {
        allValues.push(stat[key]);
      }
    });
    if (Array.isArray(stat.outliers)) {
      stat.outliers.forEach(val => {
        if (typeof val === 'number' && !isNaN(val)) {
          allValues.push(val);
        }
      });
    }
  });

  const rawMin = allValues.length > 0 ? Math.min(...allValues) : 0;
  const rawMax = allValues.length > 0 ? Math.max(...allValues) : 100;
  const span = rawMax - rawMin || 10;
  const yPadding = span * 0.08;
  const suggestedMin = rawMin >= 0 && (rawMin - yPadding < 0) ? 0 : Math.floor(rawMin - yPadding);
  const suggestedMax = Math.ceil(rawMax + yPadding);

  const primaryColors = boxStats.map((stat, i) => {
    if (stat.role || stat.emphasis) {
      return getEmphasisStyle(tokens, stat.role || stat.emphasis).borderColor || getColor(tokens, i);
    }
    if (stat.valence || stat.metricType || stat.direction !== undefined) {
      return getValenceColor(tokens, stat.direction ?? stat.delta ?? 0, stat.metricType || stat.valence || 'gain');
    }
    if (rawData.datasets?.[0]?.role || rawData.datasets?.[0]?.emphasis) {
      const empRole = rawData.datasets[0].role || rawData.datasets[0].emphasis;
      return getEmphasisStyle(tokens, empRole).borderColor || getColor(tokens, i);
    }
    return getColor(tokens, i);
  });

  // Custom Tukey Boxplot Painter Plugin
  const boxplotPainterPlugin = {
    id: 'nativeTukeyPainter_' + Math.random().toString(36).substring(2, 7),
    afterDatasetsDraw(chart) {
      const { ctx, scales: { x, y } } = chart;
      if (!x || !y) return;

      ctx.save();

      boxStats.forEach((stat, i) => {
        const xPos = x.getPixelForValue(i);
        const yMin = y.getPixelForValue(stat.min);
        const yQ1 = y.getPixelForValue(stat.q1);
        const yMed = y.getPixelForValue(stat.median);
        const yQ3 = y.getPixelForValue(stat.q3);
        const yMax = y.getPixelForValue(stat.max);
        const color = primaryColors[i];

        const boxWidth = Math.min(48, Math.max(24, (x.width / boxStats.length) * 0.45));
        const halfBox = boxWidth / 2;
        const whiskerWidth = boxWidth * 0.4;

        // 1. Lower Whisker (min to q1)
        ctx.beginPath();
        ctx.strokeStyle = tokens.isDark ? '#D8DEE9' : '#334155';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.moveTo(xPos, yMin);
        ctx.lineTo(xPos, yQ1);
        ctx.stroke();
        ctx.setLineDash([]);

        // Lower Cap
        ctx.beginPath();
        ctx.moveTo(xPos - whiskerWidth / 2, yMin);
        ctx.lineTo(xPos + whiskerWidth / 2, yMin);
        ctx.stroke();

        // 2. Upper Whisker (q3 to max)
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.moveTo(xPos, yQ3);
        ctx.lineTo(xPos, yMax);
        ctx.stroke();
        ctx.setLineDash([]);

        // Upper Cap
        ctx.beginPath();
        ctx.moveTo(xPos - whiskerWidth / 2, yMax);
        ctx.lineTo(xPos + whiskerWidth / 2, yMax);
        ctx.stroke();

        // 3. Solid Box [q1, q3]
        ctx.fillStyle = color;
        ctx.globalAlpha = tokens.isDark ? 0.65 : 0.45;
        ctx.fillRect(xPos - halfBox, yQ3, boxWidth, yQ1 - yQ3);
        ctx.globalAlpha = 1.0;

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(xPos - halfBox, yQ3, boxWidth, yQ1 - yQ3);

        // 4. Median Line (salient)
        ctx.beginPath();
        ctx.strokeStyle = tokens.isDark ? '#ECEFF4' : '#0F172A';
        ctx.lineWidth = 3;
        ctx.moveTo(xPos - halfBox, yMed);
        ctx.lineTo(xPos + halfBox, yMed);
        ctx.stroke();

        // 5. Outliers (Double encoding: Distinctive Anomaly Token + Triangle Glyphs)
        if (Array.isArray(stat.outliers)) {
          const anomalyColor = tokens.emphasis?.anomaly || tokens.semantic?.negative || '#D01C8B';
          stat.outliers.forEach(outVal => {
            const yOut = y.getPixelForValue(outVal);
            const size = 5;
            ctx.beginPath();
            ctx.fillStyle = anomalyColor;
            ctx.moveTo(xPos, yOut - size);
            ctx.lineTo(xPos + size, yOut + size);
            ctx.lineTo(xPos - size, yOut + size);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = tokens.surfaceRaised || tokens.bg || '#FFFFFF';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          });
        }

        // 6. Anscombe Guard: Raw points overlay for small n (n <= 30)
        if (stat.rawPoints && stat.rawPoints.length > 0 && stat.rawPoints.length <= 30) {
          const phi = 0.618033988749895;
          ctx.fillStyle = tokens.isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(15, 23, 42, 0.55)';
          stat.rawPoints.forEach((val, pIdx) => {
            const yPt = y.getPixelForValue(val);
            const jitterOffset = (((pIdx * phi) % 1) - 0.5) * (boxWidth * 0.3);
            ctx.beginPath();
            ctx.arc(xPos + jitterOffset, yPt, 2.5, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      });

      ctx.restore();
    }
  };

  const defaultOpts = getChartDefaultOptions(tokens);
  const spatialOpts = getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 14, hoverRadius: 7 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' });

  const config = {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'IQR [Q1 - Q3]',
        data: barData,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 0
      }]
    },
    plugins: [boxplotPainterPlugin],
    options: {
      ...defaultOpts,
      ...spatialOpts,
      animation: animOpts,
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: tokens.textPrimary,
            font: { family: tokens.fontFamily, size: 12, weight: '600' }
          }
        },
        y: {
          beginAtZero: false,
          suggestedMin,
          suggestedMax,
          grid: { color: tokens.gridColor },
          ticks: {
            color: tokens.textSecondary,
            font: { family: tokens.fontMono, size: 11 }
          }
        }
      },
      plugins: {
        ...defaultOpts.plugins,
        legend: { display: false },
        tooltip: {
          ...defaultOpts.plugins?.tooltip,
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono, size: 12, weight: '400' },
          callbacks: {
            label: (ctx) => {
              const stat = boxStats[ctx.dataIndex];
              if (!stat) return '';
              const nWarning = stat.n !== undefined && stat.n < 5 ? ` (n=${stat.n} — non représentatif)` : (stat.n ? ` (n=${stat.n})` : '');
              return [
                ` Médiane: ${stat.median}${nWarning}`,
                ` Q3 (75%): ${stat.q3}`,
                ` Q1 (25%): ${stat.q1}`,
                ` Max: ${stat.max}`,
                ` Min: ${stat.min}`,
                stat.outliers?.length ? ` Outliers: ${stat.outliers.join(', ')}` : null
              ].filter(Boolean);
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }
  return {
    canvas,
    config,
    data: config.data,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    computeTukeyBoxplotStats: typeof computeTukeyBoxplotStats === 'function' ? computeTukeyBoxplotStats : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/03-distribution/box-strip-plot
  // --------------------------------------------------------------------------
  global.KitCharts["box-strip-plot"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeTukeyBoxStats(data) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n === 0) return { min: 0, q1: 0, median: 0, q3: 0, max: 0, iqr: 0, lowerWhisker: 0, upperWhisker: 0, outliers: [], n: 0 };

    const getQ = (p) => {
      const idx = (n - 1) * p;
      const lo = Math.floor(idx);
      const hi = Math.ceil(idx);
      if (lo === hi) return clean[lo];
      return clean[lo] + (clean[hi] - clean[lo]) * (idx - lo);
    };

    const q1 = getQ(0.25);
    const median = getQ(0.50);
    const q3 = getQ(0.75);
    const iqr = q3 - q1;

    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;

    let lowerWhisker = q1;
    let upperWhisker = q3;
    const outliers = [];

    clean.forEach(val => {
      if (val < lowerFence || val > upperFence) {
        outliers.push(val);
      }
    });

    for (let i = 0; i < n; i++) {
      if (clean[i] >= lowerFence) {
        lowerWhisker = clean[i];
        break;
      }
    }
    for (let i = n - 1; i >= 0; i--) {
      if (clean[i] <= upperFence) {
        upperWhisker = clean[i];
        break;
      }
    }

    return {
      min: clean[0],
      q1,
      median,
      q3,
      max: clean[n - 1],
      iqr,
      lowerWhisker,
      upperWhisker,
      outliers,
      n
    };
  }

  function computeDeterministicJitter(index, maxOffset = 20, seed = 0.618033988749895) {
    const phi = 0.618033988749895;
    const frac = ((index + 1) * phi + seed) % 1;
    return (frac - 0.5) * 2 * maxOffset;
  }

  const DEFAULT_DATA = {
    labels: ['Traitement A', 'Traitement B (Optimisé)', 'Contrôle'],
    datasets: [{
      label: 'Performance Score',
      data: [
        [45, 48, 50, 52, 54, 55, 56, 58, 60, 61, 62, 64, 65, 68, 72, 75, 88],
        [58, 60, 62, 65, 66, 68, 70, 72, 73, 75, 78, 80, 82, 85, 88, 92, 95],
        [30, 35, 38, 40, 42, 43, 45, 46, 48, 50, 52, 53, 55, 58, 60, 62]
      ]
    }]
  };

  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
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

    const rawData = customData || DEFAULT_DATA;
    const labels = rawData.labels || ['Groupe 1', 'Groupe 2', 'Groupe 3'];
    const groups = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;

    const groupStats = groups.map((g, i) => {
      const rawPoints = Array.isArray(g) ? g : [];
      const stats = computeTukeyBoxStats(rawPoints);
      const color = getColor(tokens, i);
      return { rawPoints, stats, color, label: labels[i] || `Groupe ${i + 1}` };
    });

    let globalMin = Infinity;
    let globalMax = -Infinity;
    groupStats.forEach(gs => {
      if (gs.stats.min < globalMin) globalMin = gs.stats.min;
      if (gs.stats.max > globalMax) globalMax = gs.stats.max;
    });
    if (globalMin === Infinity) { globalMin = 0; globalMax = 100; }
    const span = globalMax - globalMin || 10;
    const yPad = span * 0.08;

    const boxStripPainterPlugin = {
      id: 'kitChartsBoxStripPainter',
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y } } = chart;
        if (!x || !y) return;

        ctx.save();
        const totalGroups = groupStats.length;
        const catWidth = x.width / totalGroups;
        const boxWidth = Math.min(40, catWidth * 0.32);
        const stripMaxOffset = Math.min(22, catWidth * 0.18);

        groupStats.forEach((gs, idx) => {
          const xCenter = x.getPixelForValue(idx);
          const { stats, color, rawPoints } = gs;
          if (stats.n === 0) return;

          const yQ1 = y.getPixelForValue(stats.q1);
          const yQ3 = y.getPixelForValue(stats.q3);
          const yMed = y.getPixelForValue(stats.median);
          const yLowW = y.getPixelForValue(stats.lowerWhisker);
          const yUpW = y.getPixelForValue(stats.upperWhisker);

          ctx.beginPath();
          ctx.strokeStyle = isDark ? '#94A3B8' : '#475569';
          ctx.lineWidth = 1.5;
          ctx.moveTo(xCenter, yLowW);
          ctx.lineTo(xCenter, yQ1);
          ctx.moveTo(xCenter, yQ3);
          ctx.lineTo(xCenter, yUpW);
          const capW = boxWidth * 0.4;
          ctx.moveTo(xCenter - capW / 2, yLowW);
          ctx.lineTo(xCenter + capW / 2, yLowW);
          ctx.moveTo(xCenter - capW / 2, yUpW);
          ctx.lineTo(xCenter + capW / 2, yUpW);
          ctx.stroke();

          ctx.fillStyle = hexToRgba(color, isDark ? 0.35 : 0.25);
          ctx.fillRect(xCenter - boxWidth / 2, yQ3, boxWidth, yQ1 - yQ3);
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.strokeRect(xCenter - boxWidth / 2, yQ3, boxWidth, yQ1 - yQ3);

          ctx.beginPath();
          ctx.strokeStyle = isDark ? '#FFFFFF' : '#0F172A';
          ctx.lineWidth = 2.5;
          ctx.moveTo(xCenter - boxWidth / 2, yMed);
          ctx.lineTo(xCenter + boxWidth / 2, yMed);
          ctx.stroke();

          rawPoints.forEach((val, pIdx) => {
            const yPt = y.getPixelForValue(val);
            const xOffset = computeDeterministicJitter(pIdx, stripMaxOffset);
            const isOutlier = val < stats.lowerWhisker || val > stats.upperWhisker;

            ctx.beginPath();
            ctx.fillStyle = isOutlier
              ? (tokens.emphasis?.anomaly || '#D01C8B')
              : hexToRgba(color, 0.85);
            ctx.arc(xCenter + xOffset, yPt, isOutlier ? 3.5 : 2.5, 0, Math.PI * 2);
            ctx.fill();

            if (isOutlier) {
              ctx.strokeStyle = isDark ? '#FFFFFF' : '#0F172A';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });

          ctx.font = `500 11px ${tokens.fontMono || 'monospace'}`;
          ctx.fillStyle = tokens.textMuted || '#64748B';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(`n=${stats.n}`, xCenter, Math.max(14, yUpW - 8));
        });

        ctx.restore();
      }
    };

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Distribution',
          data: groupStats.map(gs => [gs.stats.min, gs.stats.max]),
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0
        }]
      },
      options: {
        ...defaultOpts,
        animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          ...defaultOpts.plugins,
          legend: { display: false },
          tooltip: {
            enabled: true,
            callbacks: {
              title: (items) => labels[items[0].dataIndex] || '',
              label: (ctx) => {
                const gs = groupStats[ctx.dataIndex];
                if (!gs) return '';
                const { stats } = gs;
                return [
                  `Échantillon : n = ${stats.n} observations`,
                  `Médiane : ${stats.median.toLocaleString('fr-FR')}`,
                  `IQR [Q1—Q3] : [${stats.q1.toLocaleString('fr-FR')} — ${stats.q3.toLocaleString('fr-FR')}]`,
                  `Moustaches : [${stats.lowerWhisker.toLocaleString('fr-FR')} — ${stats.upperWhisker.toLocaleString('fr-FR')}]`,
                  `Outliers détectés : ${stats.outliers.length}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            grid: { display: false }
          },
          y: {
            ...defaultOpts.scales.y,
            min: Math.floor(globalMin - yPad),
            max: Math.ceil(globalMax + yPad),
            title: {
              display: true,
              text: (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Valeur',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      },
      plugins: [boxStripPainterPlugin]
    };

    if (typeof Chart === 'undefined') return { config, groupStats, computeTukeyBoxStats, computeDeterministicJitter };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeTukeyBoxStats,
    computeDeterministicJitter
  };

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/03-distribution/density-plot
  // --------------------------------------------------------------------------
  global.KitCharts["density-plot"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

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
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 03-distribution/density-plot/template.js
 * @description Template Chart.js v4+ pour Graphique de Densité Continue (Kernel Density Estimation - KDE).
 * Psychophysique: Encodage de fonction de densité de probabilité continue f(x) via courbe lisse et surface sous la courbe (Rang 1/2).
 * Règle d'or: beginAtZero: true sur l'axe Y, calcul authentique de KDE Gaussienne avec règle de Silverman pour la bande passante (bandwidth h).
 */



/**
 * Calcule l'estimation par noyau gaussien (Gaussian Kernel Density Estimation) sur un échantillon 1D.
 * f_hat(x) = (1 / (n * h)) * sum( K( (x - X_i) / h ) )
 * avec K(u) = (1 / sqrt(2 * pi)) * exp(-0.5 * u^2)
 *
 * @param {number[]} values - Échantillon de données continues
 * @param {number} [numPoints=60] - Nombre de points d'évaluation
 * @param {number} [bandwidthFactor=1.0] - Facteur d'ajustement du lissage
 * @returns {{ labels: string[], data: number[], points: {x: number, y: number}[], bandwidth: number }}
 */
function computeGaussianKDE(values, numPoints = 60, bandwidthFactor = 1.0) {
  if (!Array.isArray(values) || values.length === 0) {
    return { labels: [], data: [], points: [], bandwidth: 0 };
  }

  const valid = values.filter(v => typeof v === 'number' && Number.isFinite(v));
  if (valid.length === 0) {
    return { labels: [], data: [], points: [], bandwidth: 0 };
  }

  const n = valid.length;
  const sorted = [...valid].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[n - 1];

  // Calcul moyenne et écart-type
  const mean = valid.reduce((acc, v) => acc + v, 0) / n;
  const variance = valid.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n > 1 ? n - 1 : 1);
  const std = Math.sqrt(variance) || 1.0;

  // Calcul IQR
  const q1 = sorted[Math.floor(n * 0.25)];
  const q3 = sorted[Math.floor(n * 0.75)];
  const iqr = q3 - q1;

  // Règle de Silverman: h = 0.9 * min(std, IQR / 1.34) * n^(-1/5)
  const spread = (iqr > 0 && iqr / 1.34 < std) ? (iqr / 1.34) : std;
  let h = 0.9 * spread * Math.pow(n, -0.2) * bandwidthFactor;
  if (h <= 0 || !Number.isFinite(h)) h = 1.0;

  // Plage d'évaluation étendue de [min - 3h, max + 3h]
  const xStart = min - 2.5 * h;
  const xEnd = max + 2.5 * h;
  const step = (xEnd - xStart) / (numPoints - 1);

  const SQRT_2PI = Math.sqrt(2 * Math.PI);
  const labels = [];
  const data = [];
  const points = [];

  for (let i = 0; i < numPoints; i++) {
    const x = xStart + i * step;
    let sumK = 0;

    for (let j = 0; j < n; j++) {
      const u = (x - valid[j]) / h;
      sumK += Math.exp(-0.5 * u * u) / SQRT_2PI;
    }

    const density = sumK / (n * h);
    labels.push(x.toFixed(1));
    data.push(density);
    points.push({ x, y: density });
  }

  return { labels, data, points, bandwidth: h };
}

/**
 * Données par défaut représentatives (Score d'évaluation de performance continue, N=200)
 */
const DEFAULT_DATA = (() => {
  // Génération synthétique bimodale représentative
  const points = [];
  for (let i = 0; i < 50; i++) {
    const x = i * 2;
    // Bimodal distribution (mix of 2 Gaussians)
    const g1 = (0.6 / (12 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - 40) / 12, 2));
    const g2 = (0.4 / (10 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - 70) / 10, 2));
    points.push({ x: x.toString(), y: g1 + g2 });
  }
  return {
    labels: points.map(p => p.x),
    datasets: [{
      label: 'Densité de Probabilité (KDE)',
      data: points.map(p => p.y)
    }]
  };
})();

/**
 * Crée et initialise un Graphique de Densité KDE dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément Canvas
 * @param {Object} [customData=null] - Données personnalisées
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';

  const rawData = customData || DEFAULT_DATA;
  let chartLabels = [];
  let chartDatasets = [];

  const resolveDensityDatasetStyle = (ds, idx) => {
    if (ds.role || ds.emphasis) {
      const emp = getEmphasisStyle(tokens, ds.role || ds.emphasis, {
        fill: true,
        alpha: ds.fillAlpha ?? 0.2
      });
      return {
        borderColor: ds.borderColor || emp.borderColor,
        backgroundColor: ds.backgroundColor || emp.backgroundColor,
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (emp.borderWidth || (isTufte ? 1.5 : 2.5)),
        borderDash: ds.borderDash || emp.borderDash || []
      };
    }
    if (ds.valence || ds.metricType || ds.direction !== undefined) {
      const vColor = getValenceColor(tokens, ds.direction ?? ds.delta ?? 0, ds.metricType || ds.valence || 'gain');
      return {
        borderColor: ds.borderColor || vColor,
        backgroundColor: ds.backgroundColor || hexToRgba(vColor, ds.fillAlpha ?? 0.2),
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (isTufte ? 1.5 : 2.5),
        borderDash: ds.borderDash || []
      };
    }
    const color = getColor(tokens, idx);
    return {
      borderColor: ds.borderColor || color,
      backgroundColor: ds.backgroundColor || (ds.fill !== false ? hexToRgba(color, ds.fillAlpha ?? 0.2) : color),
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (isTufte ? 1.5 : 2.5),
      borderDash: ds.borderDash || []
    };
  };

  if (Array.isArray(rawData)) {
    const kde = computeGaussianKDE(rawData);
    chartLabels = kde.labels;
    chartDatasets = [{
      label: 'Densité estimée (KDE)',
      data: kde.data,
      borderColor: tokens.palette[0],
      backgroundColor: hexToRgba(tokens.palette[0], 0.2)
    }];
  } else {
    chartLabels = rawData.labels ? [...rawData.labels] : [];
    chartDatasets = (rawData.datasets || []).map((ds, idx) => {
      const style = resolveDensityDatasetStyle(ds, idx);
      if (Array.isArray(ds.rawValues) && ds.rawValues.length > 0) {
        const kde = computeGaussianKDE(ds.rawValues);
        chartLabels = kde.labels;
        return {
          label: ds.label || `Densité Série ${idx + 1}`,
          data: kde.data,
          borderColor: style.borderColor,
          backgroundColor: style.backgroundColor,
          borderWidth: style.borderWidth,
          borderDash: style.borderDash,
          fill: ds.fill !== undefined ? ds.fill : 'origin',
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 5
        };
      }

      return {
        label: ds.label || `Densité Série ${idx + 1}`,
        data: Array.isArray(ds.data) ? [...ds.data] : [],
        borderColor: style.borderColor,
        backgroundColor: style.backgroundColor,
        borderWidth: style.borderWidth,
        borderDash: style.borderDash,
        fill: ds.fill !== undefined ? ds.fill : 'origin',
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 5
      };
    });
  }

  const chartData = {
    labels: chartLabels,
    datasets: chartDatasets
  };

  const defaultOpts = getChartDefaultOptions(tokens);
  const spatialOpts = getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'x', hitRadius: 14, hoverRadius: 7 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 450, easing: 'easeOutQuad' });

  const config = {
    type: 'line',
    data: chartData,
    options: {
      ...defaultOpts,
      ...spatialOpts,
      animation: animOpts,
      plugins: {
        ...defaultOpts.plugins,
        legend: {
          ...defaultOpts.plugins?.legend,
          display: chartDatasets.length > 1 && !isTufte
        },
        tooltip: {
          ...defaultOpts.plugins?.tooltip,
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono, size: 12, weight: '400' },
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              return `Valeur x : ${items[0].label}`;
            },
            label: (context) => {
              const val = context.parsed.y !== null && context.parsed.y !== undefined
                ? context.parsed.y
                : context.raw;
              const formatted = typeof val === 'number'
                ? val.toFixed(5)
                : val;
              return ` ${context.dataset.label || 'Densité'}: ${formatted}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            maxTicksLimit: 10,
            padding: 6
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 8,
            callback: (val) => {
              if (typeof val === 'number') {
                return val.toFixed(3);
              }
              return val;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function' && typeof Chart === 'function') {
    return new Chart(canvas, config);
  }

  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/03-distribution/distribution-heatmap
  // --------------------------------------------------------------------------
  global.KitCharts["distribution-heatmap"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

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
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Données par défaut représentatives (Charge CPU serveur % par Plage Horaire x Jour de la semaine)
   */
  const DEFAULT_DATA = (() => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const hours = ['00-04h', '04-08h', '08-12h', '12-16h', '16-20h', '20-24h'];
    const matrix = [];

    for (let d = 0; d < days.length; d++) {
      for (let h = 0; h < hours.length; h++) {
        const isWeekend = d >= 5;
        const isWorkHours = h >= 2 && h <= 4;
        let baseVal = isWeekend ? 15 : 30;
        if (isWorkHours && !isWeekend) baseVal += 52;
        if (h === 3 && !isWeekend) baseVal += 12;
        const noise = Math.sin(d * 3 + h * 5) * 5;
        const v = Math.max(5, Math.min(100, Math.round(baseVal + noise)));

        matrix.push({
          x: days[d],
          y: hours[h],
          day: days[d],
          hour: hours[h],
          v
        });
      }
    }

    return {
      labels: days,
      xLabels: days,
      yLabels: hours,
      datasets: [{
        label: 'Charge Serveur (%)',
        data: matrix
      }]
    };
  })();

  /**
   * Crée et initialise une Heatmap de Distribution 2D dans le canvas cible.
   */
  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
    const canvas = typeof canvasTarget === 'string'
      ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
      : canvasTarget;

    if (!canvas) {
      throw new Error(`Canvas element "${canvasTarget}" not found`);
    }

    if (typeof Chart !== 'undefined' && Chart.getChart) {
      const existing = Chart.getChart(canvas);
      if (existing) existing.destroy();
    }

    const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
    const tokens = getThemeTokens(themeName, container);
    const isDark = Boolean(tokens.isDark);
    const isTufte = tokens.name === 'tufte-minimalist-executive';

    const rawData = customData || DEFAULT_DATA;
    const rawPoints = rawData.datasets?.[0]?.data || [];

    // Détection robuste des étiquettes X et Y
    let xLabels = rawData.xLabels || rawData.labels;
    let yLabels = rawData.yLabels;

    if (!xLabels || !Array.isArray(xLabels) || xLabels.length === 0) {
      const xSet = new Set();
      rawPoints.forEach(p => { if (p && p.x !== undefined) xSet.add(String(p.x)); });
      xLabels = Array.from(xSet);
      if (xLabels.length === 0) xLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    }

    if (!yLabels || !Array.isArray(yLabels) || yLabels.length === 0) {
      const ySet = new Set();
      rawPoints.forEach(p => { if (p && p.y !== undefined) ySet.add(String(p.y)); });
      yLabels = Array.from(ySet);
      if (yLabels.length === 0) yLabels = ['00-04h', '04-08h', '08-12h', '12-16h', '16-20h', '20-24h'];
    }

    // Normalisation des points pour correspondre aux labels de catégories
    const formattedData = rawPoints.map(p => {
      let xVal = p.x;
      let yVal = p.y;
      if (typeof xVal === 'number' && xLabels[xVal - 1]) xVal = xLabels[xVal - 1];
      if (typeof yVal === 'number' && yLabels[yVal - 1]) yVal = yLabels[yVal - 1];
      return {
        ...p,
        x: xVal,
        y: yVal,
        v: p.v ?? p.value ?? 0
      };
    });

    const maxVal = formattedData.length > 0
      ? Math.max(...formattedData.map(p => (typeof p === 'object' && p !== null ? (p.v ?? 0) : 0)), 1)
      : 100;
    const minVal = formattedData.length > 0
      ? Math.min(...formattedData.map(p => (typeof p === 'object' && p !== null ? (p.v ?? 0) : 0)), 0)
      : 0;

    const firstDs = rawData.datasets?.[0] || {};
    const dataset = {
      label: firstDs.label || 'Densité 2D',
      data: formattedData,
      backgroundColor: (ctx) => {
        const raw = ctx.raw;
        if (raw && (raw.role || raw.emphasis)) {
          return getEmphasisStyle(tokens, raw.role || raw.emphasis).backgroundColor;
        }
        if (raw && raw.isAnomaly) {
          return tokens.emphasis?.anomaly || '#D01C8B';
        }
        const v = raw?.v ?? raw?.value ?? (typeof raw === 'number' ? raw : 0);
        if (firstDs.valence || firstDs.metricType) {
          const threshold = firstDs.threshold ?? (maxVal + minVal) / 2;
          const delta = v - threshold;
          return getValenceColor(tokens, delta, firstDs.metricType || firstDs.valence || 'gain');
        }
        const ratio = maxVal > minVal ? Math.max(0, Math.min(1, (v - minVal) / (maxVal - minVal))) : 0.5;
        return getSequentialColor(tokens, ratio);
      },
      borderColor: (ctx) => {
        const raw = ctx.raw;
        if (raw && (raw.role === 'focal' || raw.emphasis === 'focal')) {
          return tokens.emphasis?.focal || tokens.textPrimary;
        }
        if (raw && (raw.role === 'anomaly' || raw.isAnomaly)) {
          return tokens.emphasis?.anomaly || '#D01C8B';
        }
        return isTufte ? tokens.textPrimary : (tokens.surface || '#FFFFFF');
      },
      borderWidth: (ctx) => {
        const raw = ctx.raw;
        if (raw && (raw.role === 'focal' || raw.role === 'anomaly' || raw.isAnomaly)) {
          return 2.5;
        }
        return isTufte ? 0.5 : 2;
      },
      borderRadius: 4,
      width: ({ chart }) => {
        const area = chart.chartArea;
        if (!area) return 24;
        const cols = Math.max(1, xLabels.length);
        return (area.width / cols) - 4;
      },
      height: ({ chart }) => {
        const area = chart.chartArea;
        if (!area) return 24;
        const rows = Math.max(1, yLabels.length);
        return (area.height / rows) - 4;
      }
    };

    const heatmapValueLabelsPlugin = {
      id: 'kitChartsHeatmapValuesPlugin',
      afterDatasetsDraw(chart) {
        const { ctx, data } = chart;
        const meta = chart.getDatasetMeta(0);
        if (!meta || !meta.data) return;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `600 11px ${tokens.fontMono || 'monospace'}`;

        meta.data.forEach((element, i) => {
          const item = data.datasets[0].data[i];
          if (!item || item.v === undefined) return;
          const ratio = maxVal > minVal ? (item.v - minVal) / (maxVal - minVal) : 0.5;
          ctx.fillStyle = ratio > 0.45 ? '#FFFFFF' : (tokens.textPrimary || '#0F172A');
          const cp = typeof element.getCenterPoint === 'function'
            ? element.getCenterPoint()
            : { x: element.x + (element.width || 0) / 2, y: element.y + (element.height || 0) / 2 };
          ctx.fillText(`${item.v}%`, cp.x, cp.y);
        });

        ctx.restore();
      }
    };

    const chartData = { datasets: [dataset] };
    const defaultOpts = getChartDefaultOptions(tokens);
    const spatialOpts = getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 12, hoverRadius: 6 });
    const animOpts = getAccessibleAnimationOptions(tokens, { duration: 350, easing: 'easeOutQuad' });

    const config = {
      type: 'matrix',
      data: chartData,
      options: {
        ...defaultOpts,
        ...spatialOpts,
        layout: {
          padding: {
            top: 20,
            right: 20,
            bottom: 34,
            left: 12
          }
        },
        animation: animOpts,
        plugins: {
          ...defaultOpts.plugins,
          legend: { display: false },
          tooltip: {
            ...defaultOpts.plugins?.tooltip,
            titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
            bodyFont: { family: tokens.fontMono, size: 12, weight: '400' },
            callbacks: {
              title: (items) => {
                if (!items.length) return '';
                const r = items[0].raw;
                return `${r.x} • Plage ${r.y}`;
              },
              label: (context) => {
                const r = context.raw;
                const v = r?.v ?? r?.value ?? 0;
                return ` Charge observée : ${v}%`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'category',
            labels: xLabels,
            position: 'bottom',
            grid: { display: false },
            border: { display: false },
            ticks: {
              display: true,
              color: tokens.textPrimary,
              font: {
                family: tokens.fontFamily,
                weight: '600',
                size: 12
              },
              padding: 12
            }
          },
          y: {
            type: 'category',
            labels: yLabels,
            position: 'left',
            grid: { display: false },
            border: { display: false },
            ticks: {
              display: true,
              color: tokens.textSecondary,
              font: {
                family: tokens.fontFamily,
                size: 11
              },
              padding: 12
            }
          }
        }
      },
      plugins: [heatmapValueLabelsPlugin]
    };

    if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function' && typeof Chart === 'function') {
      return new Chart(canvas, config);
    }

    return {
      canvas,
      config,
      data: chartData,
      options: config.options,
      ctx: canvas?.getContext ? canvas.getContext('2d') : {},
      destroy: () => {},
      update: () => {},
      resize: () => {}
    };
  }

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : {},
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/03-distribution/histogramme
  // --------------------------------------------------------------------------
  global.KitCharts["histogramme"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

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
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 03-distribution/histogramme/template.js
 * @description Template Chart.js v4+ pour Histogramme de Fréquence (Histogram).
 * Psychophysique: Encodage de distribution continue via surfaces de barres contiguës (Rang 1/2 Cleveland-McGill).
 * Règle d'or: beginAtZero: true absolu sur l'axe Y, espacement contigu (barPercentage: 1.0, categoryPercentage: 0.98),
 * algorithme de binning Freedman-Diaconis déterministe pour découpage optimal en classes de fréquence.
 */



/**
 * Calcule les bornes et fréquences d'un histogramme selon la règle de Freedman-Diaconis.
 * h = 2 * IQR(x) * n^(-1/3)
 *
 * @param {number[]} values - Tableau brut d'observations continues
 * @param {number} [maxBins=20] - Plafond de sécurité du nombre de classes
 * @returns {{ labels: string[], data: number[], binWidth: number, min: number, max: number }}
 */
function computeFreedmanDiaconisBins(values, maxBins = 20) {
  if (!Array.isArray(values) || values.length === 0) {
    return { labels: [], data: [], binWidth: 0, min: 0, max: 0 };
  }

  const valid = values.filter(v => typeof v === 'number' && Number.isFinite(v));
  if (valid.length === 0) {
    return { labels: [], data: [], binWidth: 0, min: 0, max: 0 };
  }

  const sorted = [...valid].sort((a, b) => a - b);
  const n = sorted.length;
  const min = sorted[0];
  const max = sorted[n - 1];

  if (min === max || n === 1) {
    return {
      labels: [`[${min.toFixed(1)}]`],
      data: [n],
      binWidth: 1,
      min,
      max
    };
  }

  // Calcul Quartiles et IQR
  const q1 = sorted[Math.floor(n * 0.25)];
  const q3 = sorted[Math.floor(n * 0.75)];
  const iqr = q3 - q1;

  // Largeur de bin selon Freedman-Diaconis ou Sturges fallback si IQR nul
  let h = iqr > 0 ? (2 * iqr * Math.pow(n, -1 / 3)) : 0;
  if (h <= 0 || !Number.isFinite(h)) {
    // Sturges fallback: k = ceil(log2(n) + 1)
    const kSturges = Math.max(1, Math.ceil(Math.log2(n) + 1));
    h = (max - min) / kSturges;
  }

  let numBins = Math.max(1, Math.min(maxBins, Math.ceil((max - min) / h)));
  const binWidth = (max - min) / numBins;

  const counts = new Array(numBins).fill(0);
  const labels = [];

  for (let i = 0; i < numBins; i++) {
    const bStart = min + i * binWidth;
    const bEnd = min + (i + 1) * binWidth;
    labels.push(`[${bStart.toFixed(1)} - ${bEnd.toFixed(1)}[`);
  }

  for (const v of sorted) {
    let idx = Math.floor((v - min) / binWidth);
    if (idx >= numBins) idx = numBins - 1;
    if (idx < 0) idx = 0;
    counts[idx]++;
  }

  return { labels, data: counts, binWidth, min, max };
}

/**
 * Données par défaut représentatives (Temps de réponse serveur en ms, N=320 requêtes)
 */
const DEFAULT_DATA = {
  labels: ['[10-25[', '[25-40[', '[40-55[', '[55-70[', '[70-85[', '[85-100[', '[100-115[', '[115-130['],
  datasets: [{
    label: 'Distribution Latence Serveur (ms)',
    data: [14, 42, 88, 96, 51, 20, 7, 2]
  }]
};

/**
 * Crée et initialise un Histogramme de fréquence dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément Canvas
 * @param {Object} [customData=null] - Données personnalisées
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  // Destruction propre de l'instance préexistante
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';

  // Traitement et normalisation des données
  const rawData = customData || DEFAULT_DATA;
  let chartLabels = [];
  let chartDatasets = [];

  const resolveDatasetColors = (ds, idx, labels) => {
    if (ds.role || ds.emphasis) {
      const emp = getEmphasisStyle(tokens, ds.role || ds.emphasis, { fill: true });
      return {
        bg: ds.backgroundColor || emp.backgroundColor,
        border: ds.borderColor || emp.borderColor,
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (emp.borderWidth || (isTufte ? 1 : 0.5))
      };
    }
    if (ds.valence || ds.metricType || ds.direction !== undefined) {
      const vColor = getValenceColor(tokens, ds.direction ?? ds.delta ?? 0, ds.metricType || ds.valence || 'gain');
      return {
        bg: ds.backgroundColor || vColor,
        border: ds.borderColor || (isTufte ? tokens.textPrimary : tokens.surface),
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (isTufte ? 1 : 0.5)
      };
    }
    if (ds.highlightIndices || ds.binRoles || ds.anomalies) {
      const bg = labels.map((lbl, bIdx) => {
        if (ds.highlightIndices && ds.highlightIndices.includes(bIdx)) {
          return tokens.emphasis?.focal || getColor(tokens, 0);
        }
        if (ds.binRoles && ds.binRoles[bIdx]) {
          return getEmphasisStyle(tokens, ds.binRoles[bIdx], { fill: true }).backgroundColor;
        }
        if (ds.anomalies && ds.anomalies.includes(bIdx)) {
          return tokens.emphasis?.anomaly || getEmphasisStyle(tokens, 'anomaly').backgroundColor;
        }
        return getEmphasisStyle(tokens, 'context', { fill: true }).backgroundColor || getColor(tokens, idx);
      });
      return {
        bg: ds.backgroundColor || bg,
        border: ds.borderColor || (isTufte ? tokens.textPrimary : tokens.surface),
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (isTufte ? 1 : 0.5)
      };
    }
    const primaryColor = getColor(tokens, idx);
    return {
      bg: ds.backgroundColor || primaryColor,
      border: ds.borderColor || (isTufte ? tokens.textPrimary : tokens.surface),
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (isTufte ? 1 : 0.5)
    };
  };

  // Si un tableau de nombres bruts est passé directement
  if (Array.isArray(rawData)) {
    const binned = computeFreedmanDiaconisBins(rawData);
    chartLabels = binned.labels;
    chartDatasets = [{
      label: 'Fréquence d’observations',
      data: binned.data,
      backgroundColor: tokens.palette[0]
    }];
  } else {
    chartLabels = rawData.labels ? [...rawData.labels] : [];
    chartDatasets = (rawData.datasets || []).map((ds, idx) => {
      // Si le dataset contient des valeurs brutes continues au lieu de fréquences pré-agrégées
      if (Array.isArray(ds.rawValues) && ds.rawValues.length > 0) {
        const binned = computeFreedmanDiaconisBins(ds.rawValues);
        chartLabels = binned.labels;
        const colors = resolveDatasetColors(ds, idx, chartLabels);
        return {
          label: ds.label || `Fréquence Série ${idx + 1}`,
          data: binned.data,
          backgroundColor: colors.bg,
          borderColor: colors.border,
          borderWidth: colors.borderWidth,
          borderRadius: 0,
          categoryPercentage: 0.98,
          barPercentage: 1.0
        };
      }

      const colors = resolveDatasetColors(ds, idx, chartLabels);
      return {
        label: ds.label || `Fréquence ${idx + 1}`,
        data: Array.isArray(ds.data) ? [...ds.data] : [],
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: colors.borderWidth,
        borderRadius: 0, // Pas de bordure arrondie pour signifier la continuité physique des bins
        categoryPercentage: 0.98,
        barPercentage: 1.0
      };
    });
  }

  const chartData = {
    labels: chartLabels,
    datasets: chartDatasets
  };

  const defaultOpts = getChartDefaultOptions(tokens);
  const spatialOpts = getSpatialInteractionOptions(tokens, { mode: 'index', axis: 'x', hitRadius: 12, hoverRadius: 6 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' });

  const config = {
    type: 'bar',
    data: chartData,
    options: {
      ...defaultOpts,
      ...spatialOpts,
      animation: animOpts,
      // Encodage continu Gestalt : barres contiguës sans interstices parasites
      categoryPercentage: 0.98,
      barPercentage: 1.0,
      plugins: {
        ...defaultOpts.plugins,
        legend: {
          ...defaultOpts.plugins?.legend,
          display: chartDatasets.length > 1 && !isTufte
        },
        tooltip: {
          ...defaultOpts.plugins?.tooltip,
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono, size: 12, weight: '400' },
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              return `Classe : ${items[0].label}`;
            },
            label: (context) => {
              const val = context.parsed.y !== null && context.parsed.y !== undefined
                ? context.parsed.y
                : context.raw;
              const total = (context.dataset.data || []).reduce((acc, cur) => acc + (typeof cur === 'number' ? cur : (cur?.y || 0)), 0);
              const pct = total > 0 && typeof val === 'number' ? ((val / total) * 100).toFixed(1) : null;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR').format(val)
                : val;
              const pctSuffix = pct !== null ? ` (${pct}%)` : '';
              return ` ${context.dataset.label || 'Effectif'}: ${formatted} obs.${pctSuffix}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 10
            },
            maxRotation: 45,
            minRotation: 0,
            padding: 6
          }
        },
        y: {
          beginAtZero: true, // Règle psychophysique obligatoire pour encodage par hauteur de bin
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 8,
            callback: (val) => {
              if (typeof val === 'number' && Math.abs(val) >= 1000) {
                return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
              }
              return val;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function' && typeof Chart === 'function') {
    return new Chart(canvas, config);
  }

  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/03-distribution/histogramme-kde
  // --------------------------------------------------------------------------
  global.KitCharts["histogramme-kde"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function quantile(cleanSorted, p) {
    const n = cleanSorted.length;
    if (n === 0) return 0;
    if (p <= 0) return cleanSorted[0];
    if (p >= 1) return cleanSorted[n - 1];
    const idx = (n - 1) * p;
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    if (lo === hi) return cleanSorted[lo];
    return cleanSorted[lo] + (cleanSorted[hi] - cleanSorted[lo]) * (idx - lo);
  }

  function computeFreedmanDiaconisBins(data) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n < 2) return { binWidth: 1, binCount: 1, bins: [], min: 0, max: 1 };

    const q1 = quantile(clean, 0.25);
    const q3 = quantile(clean, 0.75);
    const iqr = q3 - q1;
    const min = clean[0];
    const max = clean[n - 1];

    let binWidth = 2 * iqr * Math.pow(n, -1 / 3);
    if (binWidth <= 0 || isNaN(binWidth)) {
      const mean = clean.reduce((s, v) => s + v, 0) / n;
      const sigma = Math.sqrt(clean.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (n - 1));
      binWidth = (3.49 * (sigma || 1)) * Math.pow(n, -1 / 3) || 1;
    }

    const span = max - min;
    const binCount = Math.max(3, Math.min(50, Math.ceil(span / binWidth)));
    const actualWidth = span / binCount;

    const bins = [];
    for (let i = 0; i < binCount; i++) {
      const bMin = min + i * actualWidth;
      const bMax = (i === binCount - 1) ? max + 0.0001 : min + (i + 1) * actualWidth;
      bins.push({
        index: i,
        min: bMin,
        max: bMax,
        mid: (bMin + bMax) / 2,
        count: 0
      });
    }

    clean.forEach(val => {
      for (let i = 0; i < bins.length; i++) {
        if (val >= bins[i].min && val < bins[i].max) {
          bins[i].count++;
          break;
        }
      }
    });

    return { binWidth: actualWidth, binCount, bins, min, max, n };
  }

  function computeSilvermanBandwidth(data) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n < 2) return 1.0;

    const mean = clean.reduce((s, v) => s + v, 0) / n;
    const variance = clean.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (n - 1);
    const sigma = Math.sqrt(variance);
    const q1 = quantile(clean, 0.25);
    const q3 = quantile(clean, 0.75);
    const iqr = q3 - q1;

    const robustSigma = iqr > 0 ? Math.min(sigma, iqr / 1.34) : (sigma || 1);
    const h = 0.9 * robustSigma * Math.pow(n, -0.2);
    return (h > 0 && !isNaN(h)) ? h : 1.0;
  }

  function computeGaussianKDE(data, bandwidth = null, gridPoints = 128) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n === 0) return { grid: [], density: [], maxDensity: 0, h: 1, min: 0, max: 0 };

    const h = (typeof bandwidth === 'number' && bandwidth > 0) ? bandwidth : computeSilvermanBandwidth(clean);
    const minVal = clean[0];
    const maxVal = clean[clean.length - 1];
    const spanMin = minVal - 2.5 * h;
    const spanMax = maxVal + 2.5 * h;
    const step = (spanMax - spanMin) / (gridPoints - 1);

    const SQRT_2PI = Math.sqrt(2 * Math.PI);
    const grid = new Array(gridPoints);
    const density = new Array(gridPoints);
    let maxDensity = 0;

    for (let j = 0; j < gridPoints; j++) {
      const x = spanMin + j * step;
      grid[j] = x;
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const u = (x - clean[i]) / h;
        sum += Math.exp(-0.5 * u * u) / SQRT_2PI;
      }
      const dens = sum / (n * h);
      density[j] = dens;
      if (dens > maxDensity) maxDensity = dens;
    }

    return { grid, density, maxDensity, h, min: spanMin, max: spanMax, n };
  }

  const DEFAULT_DATA = {
    datasets: [{
      label: 'Temps de Réponse API (ms)',
      data: [
        42, 45, 48, 50, 52, 53, 55, 56, 58, 59, 60, 61, 62, 63, 65, 66,
        68, 70, 71, 72, 73, 75, 76, 78, 80, 82, 85, 88, 92, 95, 110, 115,
        120, 125, 130, 132, 135, 138, 140, 142, 145, 148, 150, 155, 160, 175
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
    const seriesData = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;
    const seriesLabel = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Distribution';

    const binAnalysis = computeFreedmanDiaconisBins(seriesData);
    const kdeAnalysis = computeGaussianKDE(seriesData);

    const mainColor = getColor(tokens, 0);
    const kdeColor = tokens.emphasis?.focal || tokens.palette[1] || '#E66101';

    const countScaleFactor = binAnalysis.n * binAnalysis.binWidth;
    const kdePoints = kdeAnalysis.grid.map((x, idx) => ({
      x: Math.round(x * 10) / 10,
      y: kdeAnalysis.density[idx] * countScaleFactor
    }));

    const barLabels = binAnalysis.bins.map(b => `${Math.round(b.min)}–${Math.round(b.max)}`);
    const barData = binAnalysis.bins.map(b => b.count);

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'bar',
      data: {
        labels: barLabels,
        datasets: [
          {
            type: 'bar',
            label: `Histogramme (${seriesLabel})`,
            data: barData,
            backgroundColor: hexToRgba(mainColor, isDark ? 0.40 : 0.30),
            borderColor: mainColor,
            borderWidth: 1.5,
            borderRadius: 3,
            datalabels: {
              display: showDataLabels
            },
            order: 2
          },
          {
            type: 'line',
            label: `Densité KDE (Silverman h=${kdeAnalysis.h.toFixed(1)})`,
            data: binAnalysis.bins.map(b => {
              let bestY = 0;
              let minDiff = Infinity;
              kdePoints.forEach(p => {
                const diff = Math.abs(p.x - b.mid);
                if (diff < minDiff) {
                  minDiff = diff;
                  bestY = p.y;
                }
              });
              return Math.round(bestY * 100) / 100;
            }),
            borderColor: kdeColor,
            borderWidth: 2.5,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.35,
            fill: false,
            datalabels: {
              display: false
            },
            order: 1
          }
        ]
      },
      options: {
        ...defaultOpts,
        _kitChartsTokens: tokens,
        showDataLabels: showDataLabels,
        animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          ...defaultOpts.plugins,
          datalabels: getDataLabelOptions(tokens, {
            display: showDataLabels,
            formatter: (v, ctx) => {
              if (ctx && ctx.dataset && ctx.dataset.type === 'bar' && v > 0) {
                return String(v);
              }
              return '';
            }
          }),
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: tokens.textPrimary,
              font: { family: tokens.fontFamily, size: 12 }
            }
          },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              title: (items) => `Classe : ${items[0].label} ms`,
              label: (ctx) => {
                if (ctx.dataset.type === 'bar') {
                  const pct = ((ctx.parsed.y / binAnalysis.n) * 100).toFixed(1);
                  return `Effectif : ${ctx.parsed.y} obs. (${pct}%)`;
                }
                return `Densité théorique : ${ctx.parsed.y.toFixed(2)} obs./bin`;
              }
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            title: {
              display: true,
              text: seriesLabel,
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          },
          y: {
            ...defaultOpts.scales.y,
            beginAtZero: true,
            grace: '8%',
            title: {
              display: true,
              text: 'Effectif (Fréquence)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      }
    };

    if (typeof Chart === 'undefined') return { config, binAnalysis, kdeAnalysis, computeFreedmanDiaconisBins, computeSilvermanBandwidth, computeGaussianKDE };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeFreedmanDiaconisBins,
    computeSilvermanBandwidth,
    computeGaussianKDE,
    getDataLabelOptions,
    formatLabelValue
  };

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/03-distribution/raincloud-plot
  // --------------------------------------------------------------------------
  global.KitCharts["raincloud-plot"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function quantile(cleanSorted, p) {
    const n = cleanSorted.length;
    if (n === 0) return 0;
    if (p <= 0) return cleanSorted[0];
    if (p >= 1) return cleanSorted[n - 1];
    const idx = (n - 1) * p;
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    if (lo === hi) return cleanSorted[lo];
    return cleanSorted[lo] + (cleanSorted[hi] - cleanSorted[lo]) * (idx - lo);
  }

  function computeSilvermanBandwidth(data) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n < 2) return 1.0;
    const mean = clean.reduce((s, v) => s + v, 0) / n;
    const variance = clean.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (n - 1);
    const sigma = Math.sqrt(variance);
    const q1 = quantile(clean, 0.25);
    const q3 = quantile(clean, 0.75);
    const iqr = q3 - q1;
    const robustSigma = iqr > 0 ? Math.min(sigma, iqr / 1.34) : (sigma || 1);
    const h = 0.9 * robustSigma * Math.pow(n, -0.2);
    return (h > 0 && !isNaN(h)) ? h : 1.0;
  }

  function computeGaussianKDE(data, bandwidth = null, gridPoints = 128) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n === 0) return { grid: [], density: [], maxDensity: 0, h: 1, min: 0, max: 0 };

    const h = (typeof bandwidth === 'number' && bandwidth > 0) ? bandwidth : computeSilvermanBandwidth(clean);
    const minVal = clean[0];
    const maxVal = clean[clean.length - 1];
    const spanMin = minVal - 2.5 * h;
    const spanMax = maxVal + 2.5 * h;
    const step = (spanMax - spanMin) / (gridPoints - 1);

    const SQRT_2PI = Math.sqrt(2 * Math.PI);
    const grid = new Array(gridPoints);
    const density = new Array(gridPoints);
    let maxDensity = 0;

    for (let j = 0; j < gridPoints; j++) {
      const x = spanMin + j * step;
      grid[j] = x;
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const u = (x - clean[i]) / h;
        sum += Math.exp(-0.5 * u * u) / SQRT_2PI;
      }
      const dens = sum / (n * h);
      density[j] = dens;
      if (dens > maxDensity) maxDensity = dens;
    }

    return { grid, density, maxDensity, h, min: spanMin, max: spanMax, n };
  }

  function computeTukeyBoxStats(data) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n === 0) return { min: 0, q1: 0, median: 0, q3: 0, max: 0, iqr: 0, lowerWhisker: 0, upperWhisker: 0, n: 0 };

    const q1 = quantile(clean, 0.25);
    const median = quantile(clean, 0.50);
    const q3 = quantile(clean, 0.75);
    const iqr = q3 - q1;
    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;

    let lowerWhisker = q1;
    let upperWhisker = q3;
    for (let i = 0; i < n; i++) {
      if (clean[i] >= lowerFence) { lowerWhisker = clean[i]; break; }
    }
    for (let i = n - 1; i >= 0; i--) {
      if (clean[i] <= upperFence) { upperWhisker = clean[i]; break; }
    }

    return { min: clean[0], q1, median, q3, max: clean[n - 1], iqr, lowerWhisker, upperWhisker, n };
  }

  const DEFAULT_DATA = {
    labels: ['Cohorte Contrôle', 'Cohorte Variante A', 'Cohorte Variante B'],
    datasets: [{
      label: 'Engagement Score (0-100)',
      data: [
        [35, 38, 42, 45, 46, 48, 50, 52, 53, 55, 56, 58, 60, 62, 65, 68, 70],
        [48, 52, 55, 58, 60, 62, 65, 68, 70, 72, 75, 78, 80, 82, 85, 88, 92],
        [25, 28, 30, 32, 35, 38, 40, 72, 75, 78, 80, 82, 85, 88, 90, 94, 96]
      ]
    }]
  };

  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
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

    const rawData = customData || DEFAULT_DATA;
    const labels = rawData.labels || ['Groupe 1', 'Groupe 2', 'Groupe 3'];
    const groups = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;

    const analysis = groups.map((g, i) => {
      const rawPoints = Array.isArray(g) ? g : [];
      const kde = computeGaussianKDE(rawPoints);
      const stats = computeTukeyBoxStats(rawPoints);
      const color = getColor(tokens, i);
      return { rawPoints, kde, stats, color, label: labels[i] || `Groupe ${i + 1}` };
    });

    let globalMin = Infinity;
    let globalMax = -Infinity;
    analysis.forEach(a => {
      if (a.kde.min < globalMin) globalMin = a.kde.min;
      if (a.kde.max > globalMax) globalMax = a.kde.max;
    });
    if (globalMin === Infinity) { globalMin = 0; globalMax = 100; }
    const span = globalMax - globalMin || 10;
    const yPad = span * 0.08;

    const raincloudPlugin = {
      id: 'kitChartsRaincloudPainter',
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y } } = chart;
        if (!x || !y) return;

        ctx.save();
        const totalGroups = analysis.length;
        const catWidth = x.width / totalGroups;
        const maxCloudWidth = Math.min(50, catWidth * 0.35);

        analysis.forEach((item, idx) => {
          const xCenter = x.getPixelForValue(idx);
          const { kde, stats, color, rawPoints } = item;
          if (!kde.grid.length || kde.maxDensity === 0) return;

          ctx.beginPath();
          ctx.moveTo(xCenter, y.getPixelForValue(kde.grid[0]));
          for (let j = 0; j < kde.grid.length; j++) {
            const yVal = kde.grid[j];
            const yPx = y.getPixelForValue(yVal);
            const wRatio = kde.density[j] / kde.maxDensity;
            const xPx = xCenter + wRatio * maxCloudWidth;
            ctx.lineTo(xPx, yPx);
          }
          ctx.lineTo(xCenter, y.getPixelForValue(kde.grid[kde.grid.length - 1]));
          ctx.closePath();

          ctx.fillStyle = hexToRgba(color, isDark ? 0.40 : 0.30);
          ctx.fill();
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          if (stats.n >= 3) {
            const yQ1 = y.getPixelForValue(stats.q1);
            const yQ3 = y.getPixelForValue(stats.q3);
            const yMed = y.getPixelForValue(stats.median);
            const yLowW = y.getPixelForValue(stats.lowerWhisker);
            const yUpW = y.getPixelForValue(stats.upperWhisker);

            ctx.beginPath();
            ctx.strokeStyle = isDark ? '#D8DEE9' : '#334155';
            ctx.lineWidth = 1.5;
            ctx.moveTo(xCenter, yLowW);
            ctx.lineTo(xCenter, yUpW);
            ctx.stroke();

            const boxW = 8;
            ctx.fillStyle = isDark ? '#ECEFF4' : '#0F172A';
            ctx.fillRect(xCenter - boxW / 2, yQ3, boxW, yQ1 - yQ3);

            ctx.beginPath();
            ctx.fillStyle = '#FFFFFF';
            ctx.arc(xCenter, yMed, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }

          const phi = 0.618033988749895;
          rawPoints.forEach((val, pIdx) => {
            const yPt = y.getPixelForValue(val);
            const jitterOffset = -8 - (((pIdx * phi) % 1) * (maxCloudWidth * 0.6));
            ctx.beginPath();
            ctx.fillStyle = hexToRgba(color, 0.80);
            ctx.arc(xCenter + jitterOffset, yPt, 2.5, 0, Math.PI * 2);
            ctx.fill();
          });

          ctx.font = `500 11px ${tokens.fontMono || 'monospace'}`;
          ctx.fillStyle = tokens.textMuted || '#64748B';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(`n=${stats.n}`, xCenter, Math.max(14, y.getPixelForValue(kde.max) - 6));
        });

        ctx.restore();
      }
    };

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Distribution',
          data: analysis.map(a => [a.stats.min, a.stats.max]),
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0
        }]
      },
      options: {
        ...defaultOpts,
        animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          ...defaultOpts.plugins,
          legend: { display: false },
          tooltip: {
            enabled: true,
            callbacks: {
              title: (items) => labels[items[0].dataIndex] || '',
              label: (ctx) => {
                const item = analysis[ctx.dataIndex];
                if (!item) return '';
                const { stats, kde } = item;
                return [
                  `Échantillon : n = ${stats.n} observations`,
                  `Médiane : ${stats.median.toLocaleString('fr-FR')}`,
                  `IQR [Q1—Q3] : [${stats.q1.toLocaleString('fr-FR')} — ${stats.q3.toLocaleString('fr-FR')}]`,
                  `Bande de Silverman (h) : ${kde.h.toFixed(2)}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            grid: { display: false }
          },
          y: {
            ...defaultOpts.scales.y,
            min: Math.floor(globalMin - yPad),
            max: Math.ceil(globalMax + yPad),
            title: {
              display: true,
              text: (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Valeur',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      },
      plugins: [raincloudPlugin]
    };

    if (typeof Chart === 'undefined') return { config, analysis, computeGaussianKDE, computeTukeyBoxStats, computeSilvermanBandwidth };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeGaussianKDE,
    computeTukeyBoxStats,
    computeSilvermanBandwidth
  };

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/03-distribution/strip-plot
  // --------------------------------------------------------------------------
  global.KitCharts["strip-plot"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

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
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 03-distribution/strip-plot/template.js
 * @description Template Chart.js v4+ pour Graphique en Bandes de Points avec Jitter Déterministe (Strip / Jitter Plot).
 * Psychophysique: Affichage 100% granulaire des observations individuelles sans perte d'information (Rang 1 Cleveland-McGill).
 * Règle d'or: Générateur pseudo-aléatoire déterministe (Mulberry32 PRNG) pour un étalement spatial constant et reproductible.
 */



/**
 * Générateur PRNG Mulberry32 déterministe pour jitter reproductible sans effet stroboscopique.
 * @param {number} seed
 * @returns {() => number} Fonction retournant un float dans [0, 1[
 */
function createMulberry32(seed = 123456789) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Applique un étalement (jitter) 1D déterministe sur un tableau d'observations.
 *
 * @param {number[]} values - Valeurs d'observations Y
 * @param {number} categoryIndex - Indice de la catégorie sur l'axe X (1, 2, ...)
 * @param {number} [jitterWidth=0.28] - Largeur d'étalement maximale
 * @param {number} [seed=42] - Graine du générateur PRNG
 * @returns {{x: number, y: number}[]}
 */
function generateJitter(values, categoryIndex, jitterWidth = 0.28, seed = 42) {
  if (!Array.isArray(values)) return [];
  const rng = createMulberry32(seed + categoryIndex * 1000);
  return values.map(v => {
    const valY = typeof v === 'number' ? v : (v?.y ?? 0);
    const offset = (rng() - 0.5) * jitterWidth;
    return {
      x: categoryIndex + offset,
      y: valY
    };
  });
}

/**
 * Données par défaut représentatives (Score de récupération clinique, 3 cohortes, N=90)
 */
const DEFAULT_DATA = (() => {
  const rng = createMulberry32(98765);
  const genVals = (count, mean, std) => Array.from({ length: count }, () => {
    // Box-Muller transform
    const u1 = Math.max(1e-6, rng());
    const u2 = rng();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return Math.round((mean + z * std) * 10) / 10;
  });

  const c1 = genVals(30, 45, 8);
  const c2 = genVals(30, 62, 11);
  const c3 = genVals(30, 54, 9);

  return {
    categories: ['Groupe A (Témoin)', 'Groupe B (Traitement 1)', 'Groupe C (Traitement 2)'],
    datasets: [
      {
        label: 'Groupe A (Témoin)',
        data: generateJitter(c1, 1, 0.26, 101)
      },
      {
        label: 'Groupe B (Traitement 1)',
        data: generateJitter(c2, 2, 0.26, 202)
      },
      {
        label: 'Groupe C (Traitement 2)',
        data: generateJitter(c3, 3, 0.26, 303)
      }
    ]
  };
})();

/**
 * Crée et initialise un Strip Plot dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément Canvas
 * @param {Object} [customData=null] - Données personnalisées
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';

  const rawData = customData || DEFAULT_DATA;
  const categories = rawData.categories || (rawData.datasets || []).map(d => d.label || '');

  const resolveStripDatasetStyle = (ds, idx) => {
    if (ds.role || ds.emphasis) {
      const emp = getEmphasisStyle(tokens, ds.role || ds.emphasis);
      return {
        bg: ds.backgroundColor || emp.backgroundColor,
        border: ds.borderColor || emp.borderColor,
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (emp.borderWidth || 1),
        pointStyle: ds.pointStyle || emp.pointStyle || 'circle',
        pointRadius: ds.pointRadius || (isTufte ? 3.5 : 4.5)
      };
    }
    if (ds.valence || ds.metricType || ds.direction !== undefined) {
      const vColor = getValenceColor(tokens, ds.direction ?? ds.delta ?? 0, ds.metricType || ds.valence || 'gain');
      return {
        bg: ds.backgroundColor || vColor,
        border: ds.borderColor || (isTufte ? tokens.textPrimary : vColor),
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : 1,
        pointStyle: ds.pointStyle || 'circle',
        pointRadius: ds.pointRadius || (isTufte ? 3.5 : 4.5)
      };
    }
    const color = getColor(tokens, idx);
    return {
      bg: ds.backgroundColor || color,
      border: ds.borderColor || (isTufte ? tokens.textPrimary : color),
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : 1,
      pointStyle: ds.pointStyle || 'circle',
      pointRadius: ds.pointRadius || (isTufte ? 3.5 : 4.5)
    };
  };

  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const baseStyle = resolveStripDatasetStyle(ds, idx);
    const rawPoints = Array.isArray(ds.data) ? ds.data : [];
    const points = rawPoints.map((p, pIdx) => {
      if (typeof p === 'number') {
        const phi = 0.618033988749895;
        const jitterOffset = (((pIdx * phi) % 1) - 0.5) * 0.28;
        return { x: idx + 1 + jitterOffset, y: p };
      }
      return p;
    });

    const hasPerPointRoles = points.some(p => p && (p.role || p.emphasis || p.anomaly)) || ds.highlightIndices || ds.anomalies;
    let pointBackgroundColors = baseStyle.bg;
    let pointBorderColors = baseStyle.border;
    let pointStyles = baseStyle.pointStyle;
    let pointRadii = baseStyle.pointRadius;

    if (hasPerPointRoles) {
      pointBackgroundColors = points.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return tokens.emphasis?.anomaly || '#D01C8B';
        }
        if (p && (p.role === 'focal' || p.emphasis === 'focal') || (ds.highlightIndices && ds.highlightIndices.includes(pIdx))) {
          return tokens.emphasis?.focal || getColor(tokens, 0);
        }
        if (p && (p.role === 'context' || p.emphasis === 'context')) {
          return tokens.emphasis?.context || '#CBD5E1';
        }
        return baseStyle.bg;
      });

      pointStyles = points.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return 'triangle';
        }
        return baseStyle.pointStyle;
      });

      pointRadii = points.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return 7;
        }
        if (p && (p.role === 'focal' || p.emphasis === 'focal') || (ds.highlightIndices && ds.highlightIndices.includes(pIdx))) {
          return 6;
        }
        return baseStyle.pointRadius;
      });
    }

    return {
      label: ds.label || `Série ${idx + 1}`,
      data: points,
      backgroundColor: pointBackgroundColors,
      borderColor: pointBorderColors,
      borderWidth: baseStyle.borderWidth,
      pointStyle: pointStyles,
      pointRadius: pointRadii,
      pointHoverRadius: 7,
      pointHitRadius: 14
    };
  });

  const chartData = { datasets };
  const defaultOpts = getChartDefaultOptions(tokens);
  const spatialOpts = getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 14, hoverRadius: 7 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' });

  const config = {
    type: 'scatter',
    data: chartData,
    options: {
      ...defaultOpts,
      ...spatialOpts,
      animation: animOpts,
      plugins: {
        ...defaultOpts.plugins,
        legend: {
          ...defaultOpts.plugins?.legend,
          display: datasets.length > 1 && !isTufte
        },
        tooltip: {
          ...defaultOpts.plugins?.tooltip,
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono, size: 12, weight: '400' },
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              const xVal = Math.round(items[0].parsed.x);
              const catLabel = categories[xVal - 1] || `Catégorie ${xVal}`;
              return `${catLabel}`;
            },
            label: (context) => {
              const yVal = context.parsed.y;
              const formatted = typeof yVal === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(yVal)
                : yVal;
              return ` ${context.dataset.label || 'Obs'}: ${formatted}`;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          min: 0.5,
          max: (categories.length || datasets.length) + 0.5,
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            stepSize: 1,
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              weight: '600',
              size: 11
            },
            padding: 8,
            callback: (val) => {
              const idx = Math.round(val) - 1;
              return categories[idx] || '';
            }
          }
        },
        y: {
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 8
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function' && typeof Chart === 'function') {
    return new Chart(canvas, config);
  }

  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/03-distribution/violin-plot
  // --------------------------------------------------------------------------
  global.KitCharts["violin-plot"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

var factory = function(KitChartsTheme) {
      'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function() { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Calcule la bande passante optimale selon la règle univariée de Scott (1992):
   * h = 1.06 * sigma * n^(-1/5)
   * @param {number[]} data - Échantillon de données
   * @returns {number}
   */
  function computeScottBandwidth(data) {
    if (!Array.isArray(data) || data.length < 2) return 1.0;
    const clean = data.map(Number).filter(v => !isNaN(v));
    const n = clean.length;
    if (n < 2) return 1.0;
    const mean = clean.reduce((sum, v) => sum + v, 0) / n;
    const variance = clean.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (n - 1);
    const sigma = Math.sqrt(variance);
    if (sigma === 0 || isNaN(sigma)) return 1.0;
    return 1.06 * sigma * Math.pow(n, -0.2);
  }

  /**
   * Évalue le Kernel Density Estimator (KDE) gaussien sur une grille de points.
   * f̂(x) = (1 / (n * h)) * Σ K((x - x_i) / h), K(u) = (1 / √(2π)) * exp(-u^2 / 2)
   *
   * @param {number[]} data - Échantillon brut
   * @param {number} [bandwidth] - Bande passante h (auto Scott si omis)
   * @param {number} [gridPoints=128] - Nombre de points sur la grille d'évaluation
   * @returns {{ grid: number[], density: number[], maxDensity: number, h: number, min: number, max: number }}
   */
  function computeGaussianKDE(data, bandwidth = null, gridPoints = 128) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n === 0) {
      return { grid: [], density: [], maxDensity: 0, h: 1, min: 0, max: 0 };
    }

    const h = (typeof bandwidth === 'number' && bandwidth > 0) ? bandwidth : computeScottBandwidth(clean);
    const minVal = clean[0];
    const maxVal = clean[clean.length - 1];
    const spanMin = minVal - 3 * h;
    const spanMax = maxVal + 3 * h;
    const step = (spanMax - spanMin) / (gridPoints - 1);

    const SQRT_2PI = Math.sqrt(2 * Math.PI);
    const grid = new Array(gridPoints);
    const density = new Array(gridPoints);
    let maxDensity = 0;

    for (let j = 0; j < gridPoints; j++) {
      const x = spanMin + j * step;
      grid[j] = x;
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const u = (x - clean[i]) / h;
        sum += Math.exp(-0.5 * u * u) / SQRT_2PI;
      }
      const dens = sum / (n * h);
      density[j] = dens;
      if (dens > maxDensity) maxDensity = dens;
    }

    return { grid, density, maxDensity, h, min: spanMin, max: spanMax };
  }

  /**
   * Calcule les quantiles Tukey pour le box plot interne
   */
  function computeSummaryStats(data) {
    const clean = Array.isArray(data) ? data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n === 0) return { min: 0, q1: 0, median: 0, q3: 0, max: 0, n: 0 };

    const getQ = (p) => {
      const idx = (n - 1) * p;
      const lo = Math.floor(idx);
      const hi = Math.ceil(idx);
      if (lo === hi) return clean[lo];
      return clean[lo] + (clean[hi] - clean[lo]) * (idx - lo);
    };

    return {
      min: clean[0],
      q1: getQ(0.25),
      median: getQ(0.50),
      q3: getQ(0.75),
      max: clean[n - 1],
      n
    };
  }

  const DEFAULT_DATA = {
    labels: ['Groupe A (Contrôle)', 'Groupe B (Bimodal)', 'Groupe C (Asymétrique)'],
    datasets: [{
      label: 'Distribution Score',
      data: [
        [14, 15, 16, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 23, 24, 25],
        [10, 11, 12, 12, 13, 13, 14, 24, 25, 25, 26, 26, 27, 28, 29, 30],
        [5, 6, 6, 7, 7, 8, 9, 10, 12, 15, 18, 22, 26, 31, 37, 44]
      ]
    }]
  };

  /**
   * Crée et initialise un Violin Plot avec KDE gaussien dans le canvas cible.
   *
   * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
   * @param {Object} [customData=null] - Jeu de données
   * @param {string} [themeName='colorbrewer-accessible'] - Thème cognitif
   * @param {Object} [options={}] - Options (showInnerBox, showRawPoints)
   * @returns {Object} Instance Chart.js
   */
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
    const isTufte = tokens.name === 'tufte-minimalist-executive';

    const rawData = customData || DEFAULT_DATA;
    const labels = rawData.labels || ['Groupe 1', 'Groupe 2', 'Groupe 3'];
    const groups = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;

    const showInnerBox = options.showInnerBox !== undefined ? options.showInnerBox : true;
    const showRawPoints = options.showRawPoints !== undefined ? options.showRawPoints : (groups.some(g => Array.isArray(g) && g.length <= 30));

    // Pré-calcul du KDE et stats pour chaque groupe
    const groupAnalysis = groups.map((g, i) => {
      const rawPoints = Array.isArray(g) ? g : [];
      const kde = computeGaussianKDE(rawPoints);
      const stats = computeSummaryStats(rawPoints);
      const color = getColor(tokens, i);
      return { rawPoints, kde, stats, color, label: labels[i] || `Groupe ${i + 1}` };
    });

    // Calcul des bornes globales Y
    let globalMin = Infinity;
    let globalMax = -Infinity;
    groupAnalysis.forEach(ga => {
      if (ga.kde.min < globalMin) globalMin = ga.kde.min;
      if (ga.kde.max > globalMax) globalMax = ga.kde.max;
    });
    if (globalMin === Infinity) { globalMin = 0; globalMax = 100; }
    const span = globalMax - globalMin || 10;
    const yPad = span * 0.05;

    // Plugin custom de rendu Violin KDE
    const violinPainterPlugin = {
      id: 'kitChartsViolinPainter',
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y } } = chart;
        if (!x || !y) return;

        ctx.save();
        const totalGroups = groupAnalysis.length;
        const catWidth = x.width / totalGroups;
        const maxViolinHalfWidth = Math.min(60, catWidth * 0.40);

        groupAnalysis.forEach((ga, idx) => {
          const xCenter = x.getPixelForValue(idx);
          const { kde, stats, color, rawPoints } = ga;
          if (!kde.grid.length || kde.maxDensity === 0) return;

          // 1. Trace de la silhouette du violon (symétrie miroir gauche/droite)
          ctx.beginPath();
          // Côté droit (de bas en haut)
          for (let j = 0; j < kde.grid.length; j++) {
            const yVal = kde.grid[j];
            const yPx = y.getPixelForValue(yVal);
            const wRatio = kde.density[j] / kde.maxDensity;
            const xOffset = wRatio * maxViolinHalfWidth;
            const xPx = xCenter + xOffset;
            if (j === 0) ctx.moveTo(xPx, yPx);
            else ctx.lineTo(xPx, yPx);
          }
          // Côté gauche (de haut en bas)
          for (let j = kde.grid.length - 1; j >= 0; j--) {
            const yVal = kde.grid[j];
            const yPx = y.getPixelForValue(yVal);
            const wRatio = kde.density[j] / kde.maxDensity;
            const xOffset = wRatio * maxViolinHalfWidth;
            const xPx = xCenter - xOffset;
            ctx.lineTo(xPx, yPx);
          }
          ctx.closePath();

          // Remplissage contextuel avec alpha 0.35
          ctx.fillStyle = hexToRgba(color, isDark ? 0.45 : 0.35);
          ctx.fill();

          // Contour du violon
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // 2. Boîte interne optionnelle (Tukey box plot compact)
          if (showInnerBox && stats.n >= 3) {
            const yQ1 = y.getPixelForValue(stats.q1);
            const yQ3 = y.getPixelForValue(stats.q3);
            const yMed = y.getPixelForValue(stats.median);
            const yMin = y.getPixelForValue(stats.min);
            const yMax = y.getPixelForValue(stats.max);

            // Moustache fine centrale [min - max]
            ctx.beginPath();
            ctx.strokeStyle = isDark ? '#D8DEE9' : '#334155';
            ctx.lineWidth = 1.5;
            ctx.moveTo(xCenter, yMin);
            ctx.lineTo(xCenter, yMax);
            ctx.stroke();

            // Rectangle interquartile [Q1 - Q3]
            const boxW = 8;
            ctx.fillStyle = isDark ? '#ECEFF4' : '#0F172A';
            ctx.fillRect(xCenter - boxW / 2, yQ3, boxW, yQ1 - yQ3);

            // Marqueur médiane (disque blanc 4px)
            ctx.beginPath();
            ctx.fillStyle = '#FFFFFF';
            ctx.arc(xCenter, yMed, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }

          // 3. Points bruts déterministes (Anscombe guard T9)
          if (showRawPoints && rawPoints.length > 0) {
            const phi = 0.618033988749895; // Golden ratio
            ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(15, 23, 42, 0.55)';
            rawPoints.forEach((val, pIdx) => {
              const yPt = y.getPixelForValue(val);
              const jitterOffset = (((pIdx * phi) % 1) - 0.5) * (maxViolinHalfWidth * 0.5);
              ctx.beginPath();
              ctx.arc(xCenter + jitterOffset, yPt, 2, 0, Math.PI * 2);
              ctx.fill();
            });
          }

          // 4. Affichage explicite de la taille d'échantillon n (Garde-fou cognitif Knific & Weissgerber 2018)
          ctx.save();
          ctx.font = `500 11px ${tokens.fontMono || "'JetBrains Mono', monospace"}`;
          ctx.fillStyle = tokens.textMuted || (isDark ? '#94A3B8' : '#64748B');
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          const topDensityY = y.getPixelForValue(kde.max);
          ctx.fillText(`n = ${stats.n}`, xCenter, Math.max(14, topDensityY - 6));
          ctx.restore();
        });

        ctx.restore();
      }
    };

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Distribution',
          data: groupAnalysis.map(ga => [ga.stats.min, ga.stats.max]),
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0
        }]
      },
      options: {
        ...defaultOpts,
        animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
        interaction: {
          mode: 'index',
          intersect: false,
          axis: 'x'
        },
        plugins: {
          ...defaultOpts.plugins,
          legend: { display: false },
          tooltip: {
            enabled: true,
            callbacks: {
              title: (items) => labels[items[0].dataIndex] || '',
              label: (ctx) => {
                const ga = groupAnalysis[ctx.dataIndex];
                if (!ga) return '';
                const { stats, kde } = ga;
                const nBadge = stats.n < 5 ? ` (n=${stats.n} — échantillon non représentatif)` : ` (n=${stats.n})`;
                return [
                  `Échantillon : n = ${stats.n}`,
                  `Médiane : ${stats.median.toLocaleString('fr-FR')}${nBadge}`,
                  `IQR [Q1—Q3] : [${stats.q1.toLocaleString('fr-FR')} — ${stats.q3.toLocaleString('fr-FR')}]`,
                  `Étendue : [${stats.min.toLocaleString('fr-FR')} — ${stats.max.toLocaleString('fr-FR')}]`,
                  `Bande de Scott (h) : ${kde.h.toFixed(2)}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            grid: { display: false }
          },
          y: {
            ...defaultOpts.scales.y,
            min: Math.floor(globalMin - yPad),
            max: Math.ceil(globalMax + yPad),
            title: {
              display: true,
              text: (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Valeur',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      },
      plugins: [violinPainterPlugin]
    };

    if (typeof Chart === 'undefined') return { config, groupAnalysis, computeScottBandwidth, computeGaussianKDE };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeScottBandwidth,
    computeGaussianKDE,
    computeSummaryStats,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null
  };
    };
    return factory(KitChartsTheme);

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/04-correlation-relation/bubble-chart
  // --------------------------------------------------------------------------
  global.KitCharts["bubble-chart"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

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
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 04-correlation-relation/bubble-chart/template.js
 * @description Template Chart.js v4+ pour Diagramme à Bulles Trivarié (Bubble Chart).
 * Psychophysique: Encodage trivarié (X, Y, Z) combinant double position orthogonale (Rang 1) et aire de surface circulaire (Rang 6).
 * Règle d'or: Proportionnalité stricte de l'aire au signal (r = k * sqrt(Z)) évitant l'exagération quadratique de surface (Facteur de distorsion de Tufte).
 */



/**
 * Calcule le rayon des bulles avec proportionnalité stricte à la racine carrée de Z (Aire = pi * r^2).
 * r = rMin + (rMax - rMin) * sqrt((z - zMin) / (zMax - zMin))
 *
 * @param {{x: number, y: number, z?: number, r?: number, label?: string}[]} points - Tableau de points avec grandeur Z
 * @param {number} [minRadius=4] - Rayon minimal en pixels
 * @param {number} [maxRadius=28] - Rayon maximal en pixels
 * @returns {{x: number, y: number, r: number, z: number, label?: string}[]} Points normalisés
 */
function computeBubbleRadii(points, minRadius = 4, maxRadius = 28) {
  if (!Array.isArray(points) || points.length === 0) return [];

  const valid = points.map(p => {
    if (typeof p !== 'object' || p === null) return { x: 0, y: 0, z: 0, r: minRadius };
    const zVal = typeof p.z === 'number' ? p.z : (typeof p.r === 'number' ? Math.pow(p.r, 2) : 10);
    return { ...p, z: zVal };
  });

  const zValues = valid.map(p => Math.max(0, p.z));
  const minZ = Math.min(...zValues);
  const maxZ = Math.max(...zValues);
  const rangeZ = maxZ - minZ;

  return valid.map(p => {
    let r = minRadius;
    if (rangeZ > 0) {
      const normSqrt = Math.sqrt((p.z - minZ) / rangeZ);
      r = minRadius + (maxRadius - minRadius) * normSqrt;
    } else if (typeof p.r === 'number' && p.r > 0) {
      r = p.r;
    } else {
      r = (minRadius + maxRadius) / 2;
    }

    return {
      ...p,
      x: p.x,
      y: p.y,
      r: Math.round(r * 10) / 10,
      z: p.z
    };
  });
}

/**
 * Données par défaut représentatives (PIB par hab en k$ vs Espérance de vie vs Population en Millions)
 */
const DEFAULT_DATA = {
  datasets: [{
    label: 'Marchés Mondiaux (N=12)',
    data: [
      { x: 12.5, y: 72.1, z: 1420, label: 'Inde' },
      { x: 21.4, y: 77.4, z: 1410, label: 'Chine' },
      { x: 76.3, y: 79.2, z: 335, label: 'États-Unis' },
      { x: 17.8, y: 75.8, z: 215, label: 'Brésil' },
      { x: 44.2, y: 82.5, z: 125, label: 'Japon' },
      { x: 54.1, y: 81.3, z: 84, label: 'Allemagne' },
      { x: 48.6, y: 83.0, z: 68, label: 'France' },
      { x: 51.2, y: 81.8, z: 67, label: 'Royaume-Uni' },
      { x: 38.9, y: 83.2, z: 59, label: 'Italie' },
      { x: 34.5, y: 83.6, z: 48, label: 'Espagne' },
      { x: 62.4, y: 82.1, z: 38, label: 'Canada' },
      { x: 65.8, y: 83.3, z: 26, label: 'Australie' }
    ]
  }]
};

/**
 * Crée et initialise un Diagramme à Bulles dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément Canvas
 * @param {Object} [customData=null] - Données personnalisées
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';

  const rawData = customData || DEFAULT_DATA;
  const resolveBubbleDatasetStyle = (ds, idx) => {
    if (ds.role || ds.emphasis) {
      const emp = getEmphasisStyle(tokens, ds.role || ds.emphasis, { fill: true, alpha: 0.6 });
      return {
        bg: ds.backgroundColor || emp.backgroundColor,
        border: ds.borderColor || emp.borderColor,
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (emp.borderWidth || 1.5)
      };
    }
    if (ds.valence || ds.metricType || ds.direction !== undefined) {
      const vColor = getValenceColor(tokens, ds.direction ?? ds.delta ?? 0, ds.metricType || ds.valence || 'gain');
      return {
        bg: ds.backgroundColor || hexToRgba(vColor, 0.6),
        border: ds.borderColor || vColor,
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : 1.5
      };
    }
    const color = getColor(tokens, idx);
    return {
      bg: ds.backgroundColor || hexToRgba(color, 0.6),
      border: ds.borderColor || (isTufte ? tokens.textPrimary : color),
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : 1.5
    };
  };

  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const baseStyle = resolveBubbleDatasetStyle(ds, idx);
    let points = [];

    if (Array.isArray(ds.data)) {
      points = computeBubbleRadii(ds.data);
    }

    const hasPerPointRoles = points.some(p => p && (p.role || p.emphasis || p.anomaly)) || ds.highlightIndices || ds.anomalies;
    let bgColors = baseStyle.bg;
    let borderColors = baseStyle.border;
    let borderWidths = baseStyle.borderWidth;

    if (hasPerPointRoles) {
      bgColors = points.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return hexToRgba(tokens.emphasis?.anomaly || '#D01C8B', 0.85);
        }
        if (p && (p.role === 'focal' || p.emphasis === 'focal') || (ds.highlightIndices && ds.highlightIndices.includes(pIdx))) {
          return hexToRgba(tokens.emphasis?.focal || getColor(tokens, 0), 0.85);
        }
        if (p && (p.role === 'context' || p.emphasis === 'context')) {
          return hexToRgba(tokens.emphasis?.context || '#CBD5E1', 0.35);
        }
        return baseStyle.bg;
      });

      borderColors = points.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return tokens.emphasis?.anomaly || '#D01C8B';
        }
        if (p && (p.role === 'focal' || p.emphasis === 'focal') || (ds.highlightIndices && ds.highlightIndices.includes(pIdx))) {
          return tokens.emphasis?.focal || getColor(tokens, 0);
        }
        if (p && (p.role === 'context' || p.emphasis === 'context')) {
          return tokens.emphasis?.context || '#CBD5E1';
        }
        return baseStyle.border;
      });

      borderWidths = points.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly || p.role === 'focal' || p.emphasis === 'focal')) {
          return 2.5;
        }
        return baseStyle.borderWidth;
      });
    }

    return {
      type: 'bubble',
      label: ds.label || `Série ${idx + 1}`,
      data: points,
      backgroundColor: bgColors,
      borderColor: borderColors,
      borderWidth: borderWidths,
      hoverBorderWidth: 2.5
    };
  });

  const chartData = { datasets };
  const defaultOpts = getChartDefaultOptions(tokens);
  const spatialOpts = getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 14, hoverRadius: 7 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' });

  const config = {
    type: 'bubble',
    data: chartData,
    options: {
      ...defaultOpts,
      ...spatialOpts,
      animation: animOpts,
      plugins: {
        ...defaultOpts.plugins,
        legend: {
          ...defaultOpts.plugins?.legend,
          display: datasets.length > 1 && !isTufte
        },
        tooltip: {
          ...defaultOpts.plugins?.tooltip,
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono, size: 12, weight: '400' },
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              const raw = items[0].raw;
              return raw.label ? `${raw.label}` : `${items[0].dataset.label || 'Bulle'}`;
            },
            label: (context) => {
              const raw = context.raw;
              const xVal = context.parsed.x;
              const yVal = context.parsed.y;
              const zVal = raw.z !== undefined ? raw.z : Math.round(Math.pow(raw.r || 5, 2));
              const fmt = (v) => typeof v === 'number' ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(v) : v;
              return [
                ` Axe X: ${fmt(xVal)}`,
                ` Axe Y: ${fmt(yVal)}`,
                ` Grandeur Z (Aire): ${fmt(zVal)}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 6
          }
        },
        y: {
          type: 'linear',
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 8
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function' && typeof Chart === 'function') {
    return new Chart(canvas, config);
  }

  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/04-correlation-relation/connected-scatter-plot
  // --------------------------------------------------------------------------
  global.KitCharts["connected-scatter-plot"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

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
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 04-correlation-relation/connected-scatter-plot/template.js
 * @description Template Chart.js v4+ pour Nuage de Points Relié Temporel (Connected Scatter Plot).
 * Psychophysique: Encodage d'une trajectoire bivariée dynamique (X_t, Y_t) au fil du temps (Loi de Continuité Gestalt + Rang 1 Cleveland-McGill).
 * Règle d'or: Ligne ordonnée chronologiquement révélant les cycles d'hystérésis, points de mesure temporels explicites dans l'infobulle.
 */



/**
 * Données par défaut représentatives (Trajectoire Macroéconomique : Inflation % vs Chômage % sur 10 ans)
 */
const DEFAULT_DATA = {
  datasets: [{
    label: 'Courbe de Phillips Dynamique (2015-2024)',
    data: [
      { x: 9.8, y: 0.8, year: 2015 },
      { x: 9.4, y: 0.6, year: 2016 },
      { x: 8.8, y: 1.2, year: 2017 },
      { x: 8.2, y: 1.6, year: 2018 },
      { x: 7.9, y: 1.3, year: 2019 },
      { x: 8.5, y: 0.5, year: 2020 },
      { x: 7.6, y: 2.1, year: 2021 },
      { x: 7.1, y: 6.8, year: 2022 },
      { x: 7.2, y: 4.9, year: 2023 },
      { x: 7.4, y: 2.4, year: 2024 }
    ]
  }]
};

/**
 * Crée et initialise un Nuage de Points Relié dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément Canvas
 * @param {Object} [customData=null] - Données personnalisées
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';

  const rawData = customData || DEFAULT_DATA;
  const resolveConnectedScatterStyle = (ds, idx) => {
    if (ds.role || ds.emphasis) {
      const emp = getEmphasisStyle(tokens, ds.role || ds.emphasis);
      return {
        lineColor: ds.borderColor || emp.borderColor,
        lineWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (emp.borderWidth || (isTufte ? 1.5 : 2.5)),
        borderDash: ds.borderDash || emp.borderDash || [],
        pointBg: isTufte ? tokens.bg : (emp.pointBackgroundColor || tokens.surface),
        pointBorder: emp.pointBorderColor || emp.borderColor,
        pointRadius: ds.pointRadius || emp.pointRadius || (isTufte ? 4 : 5.5)
      };
    }
    if (ds.valence || ds.metricType || ds.direction !== undefined) {
      const vColor = getValenceColor(tokens, ds.direction ?? ds.delta ?? 0, ds.metricType || ds.valence || 'gain');
      return {
        lineColor: ds.borderColor || vColor,
        lineWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (isTufte ? 1.5 : 2.5),
        borderDash: ds.borderDash || [],
        pointBg: isTufte ? tokens.bg : tokens.surface,
        pointBorder: vColor,
        pointRadius: ds.pointRadius || (isTufte ? 4 : 5.5)
      };
    }
    const color = getColor(tokens, idx);
    return {
      lineColor: ds.borderColor || color,
      lineWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (isTufte ? 1.5 : 2.5),
      borderDash: ds.borderDash || [],
      pointBg: isTufte ? tokens.bg : tokens.surface,
      pointBorder: color,
      pointRadius: ds.pointRadius || (isTufte ? 4 : 5.5)
    };
  };

  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const baseStyle = resolveConnectedScatterStyle(ds, idx);
    const points = Array.isArray(ds.data) ? ds.data : [];

    const hasPerPointRoles = points.some(p => p && (p.role || p.emphasis || p.anomaly)) || ds.highlightIndices || ds.anomalies;
    let pointBgColors = baseStyle.pointBg;
    let pointBorderColors = baseStyle.pointBorder;
    let pointStyles = 'circle';
    let pointRadii = baseStyle.pointRadius;

    if (hasPerPointRoles) {
      pointBgColors = points.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return tokens.emphasis?.anomaly || '#D01C8B';
        }
        if (p && (p.role === 'focal' || p.emphasis === 'focal') || (ds.highlightIndices && ds.highlightIndices.includes(pIdx))) {
          return tokens.emphasis?.focal || getColor(tokens, 0);
        }
        if (p && (p.role === 'context' || p.emphasis === 'context')) {
          return tokens.emphasis?.context || '#CBD5E1';
        }
        return baseStyle.pointBg;
      });

      pointBorderColors = points.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return tokens.emphasis?.anomaly || '#D01C8B';
        }
        if (p && (p.role === 'focal' || p.emphasis === 'focal') || (ds.highlightIndices && ds.highlightIndices.includes(pIdx))) {
          return tokens.emphasis?.focal || getColor(tokens, 0);
        }
        if (p && (p.role === 'context' || p.emphasis === 'context')) {
          return tokens.emphasis?.context || '#CBD5E1';
        }
        return baseStyle.pointBorder;
      });

      pointStyles = points.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return 'triangle';
        }
        return 'circle';
      });

      pointRadii = points.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return 8;
        }
        if (p && (p.role === 'focal' || p.emphasis === 'focal') || (ds.highlightIndices && ds.highlightIndices.includes(pIdx))) {
          return 7;
        }
        return baseStyle.pointRadius;
      });
    }

    return {
      type: 'line',
      label: ds.label || `Trajectoire ${idx + 1}`,
      data: points,
      borderColor: baseStyle.lineColor,
      backgroundColor: ds.backgroundColor || baseStyle.lineColor,
      borderDash: baseStyle.borderDash,
      borderWidth: baseStyle.lineWidth,
      pointBackgroundColor: pointBgColors,
      pointBorderColor: pointBorderColors,
      pointBorderWidth: isTufte ? 1.5 : 2.5,
      pointStyle: pointStyles,
      pointRadius: pointRadii,
      pointHoverRadius: 8.5,
      pointHitRadius: 12,
      fill: false,
      showLine: true,
      tension: 0.15
    };
  });

  const chartData = { datasets };
  const defaultOpts = getChartDefaultOptions(tokens);
  const spatialOpts = getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 14, hoverRadius: 7 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 450, easing: 'easeOutQuad' });

  const config = {
    type: 'line',
    data: chartData,
    options: {
      ...defaultOpts,
      ...spatialOpts,
      animation: animOpts,
      showLine: true,
      plugins: {
        ...defaultOpts.plugins,
        legend: {
          ...defaultOpts.plugins?.legend,
          display: datasets.length > 1 && !isTufte
        },
        tooltip: {
          ...defaultOpts.plugins?.tooltip,
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono, size: 12, weight: '400' },
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              const raw = items[0].raw;
              if (raw && (raw.year || raw.label || raw.t)) {
                return `Période : ${raw.year || raw.label || raw.t}`;
              }
              return items[0].dataset.label || 'Point temporel';
            },
            label: (context) => {
              const xVal = context.parsed.x;
              const yVal = context.parsed.y;
              const fmt = (v) => typeof v === 'number' ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(v) : v;
              return [
                ` Chômage (X): ${fmt(xVal)}%`,
                ` Inflation (Y): ${fmt(yVal)}%`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 6
          }
        },
        y: {
          type: 'linear',
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 8
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function' && typeof Chart === 'function') {
    return new Chart(canvas, config);
  }

  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/04-correlation-relation/density-2d-hexbin
  // --------------------------------------------------------------------------
  global.KitCharts["density-2d-hexbin"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2B8CBE'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function(t, r, o) { return { borderColor: '#2B8CBE', backgroundColor: '#2B8CBE', ...o }; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Calcule le pavage hexagonal d'un échantillon continu de points (x, y)
   */
  function computeHexBins(rawPoints, xBins = 14, yBins = 10) {
    if (!Array.isArray(rawPoints) || rawPoints.length === 0) {
      return { bins: [], minX: 145, maxX: 200, minY: 45, maxY: 110, maxCount: 0, total: 0 };
    }

    // Si les points sont déjà binnés ({x, y, v})
    if (rawPoints[0] && typeof rawPoints[0].v === 'number') {
      const maxCount = Math.max(...rawPoints.map(p => p.v || 0), 1);
      const total = rawPoints.reduce((s, p) => s + (p.v || 0), 0);
      return { bins: rawPoints, maxCount, total };
    }

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    rawPoints.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });

    const stepX = (maxX - minX) / xBins || 5;
    const stepY = (maxY - minY) / yBins || 6;
    const counts = new Map();
    let maxCount = 0;

    rawPoints.forEach(p => {
      const row = Math.round((p.y - minY) / stepY);
      const isOdd = row % 2 !== 0;
      const xOffset = isOdd ? stepX * 0.5 : 0;
      const col = Math.round((p.x - minX - xOffset) / stepX);

      const hx = Math.round((minX + col * stepX + xOffset) * 10) / 10;
      const hy = Math.round((minY + row * stepY) * 10) / 10;
      const key = `${hx}_${hy}`;

      const count = (counts.get(key) || 0) + 1;
      counts.set(key, count);
      if (count > maxCount) maxCount = count;
    });

    const bins = [];
    counts.forEach((v, key) => {
      const [xStr, yStr] = key.split('_');
      bins.push({
        x: parseFloat(xStr),
        y: parseFloat(yStr),
        v
      });
    });

    return { bins, minX, maxX, minY, maxY, maxCount, total: rawPoints.length };
  }

  const compute2DBins = computeHexBins;

  /**
   * Données de démonstration bivariées (N = 1800 mesures réelles Taille cm × Poids kg)
   */
  const DEFAULT_DATA = (() => {
    const bins = [];
    const xStep = 3.6;
    const yStep = 4.8;
    const numCols = 13;
    const numRows = 11;
    const startX = 152;
    const startY = 48;

    for (let r = 0; r < numRows; r++) {
      const isOdd = r % 2 !== 0;
      const xOffset = isOdd ? xStep * 0.5 : 0;
      const y = startY + r * yStep;

      for (let c = 0; c < numCols; c++) {
        const x = startX + c * xStep + xOffset;

        // Modèle de distribution bivariée corrélée gaussienne (Taille μ=174, Poids μ=72, corr=0.74)
        const zx = (x - 174) / 10.5;
        const zy = (y - 72) / 12.0;
        const rho = 0.74;
        const exponent = -0.5 * (zx * zx - 2 * rho * zx * zy + zy * zy) / (1 - rho * rho);
        const intensity = Math.exp(exponent);

        // Bruit statistique réaliste
        const noise = (Math.sin(c * 1.7 + r * 2.3) * 0.08);
        const v = Math.round(intensity * 148 + noise * 12);

        if (v >= 3) {
          bins.push({
            x: Math.round(x * 10) / 10,
            y: Math.round(y * 10) / 10,
            v
          });
        }
      }
    }

    return {
      datasets: [{
        label: 'Densité Biométrique (Taille cm × Poids kg)',
        data: bins
      }]
    };
  })();

  /**
   * Crée et initialise un Graphique Hexbin dans le canvas cible.
   */
  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
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
    const isTufte = tokens.name === 'tufte-minimalist-executive';

    const rawData = customData || DEFAULT_DATA;
    const rawPoints = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;
    const seriesLabel = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Densité Spatiale 2D';

    const hexResult = computeHexBins(rawPoints);
    const bins = hexResult.bins || rawPoints;
    const maxCount = Math.max(...bins.map(b => b.v || 0), 1);
    const minCount = Math.min(...bins.map(b => b.v || 0), 1);
    const totalObs = bins.reduce((sum, b) => sum + (b.v || 0), 0);

    let activeHoverIdx = -1;

    // Calcul des bornes de l'axe
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    bins.forEach(b => {
      if (b.x < minX) minX = b.x;
      if (b.x > maxX) maxX = b.x;
      if (b.y < minY) minY = b.y;
      if (b.y > maxY) maxY = b.y;
    });
    const padX = (maxX - minX) * 0.08 || 4;
    const padY = (maxY - minY) * 0.08 || 4;

    const hexbinCustomPlugin = {
      id: 'kitChartsHexbinHoneycombPainter',
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y }, chartArea } = chart;
        if (!x || !y || !chartArea) return;

        ctx.save();
        ctx.lineJoin = 'round';

        // Calcul dynamique du rayon optimal de l'alvéole hexagonale
        const pxStepX = Math.abs(x.getPixelForValue(minX + 3.6) - x.getPixelForValue(minX)) || 30;
        const hexRadius = Math.max(12, Math.min(26, pxStepX * 0.58));

        // 1. Tracé de toutes les alvéoles hexagonales
        bins.forEach((bin, idx) => {
          const px = x.getPixelForValue(bin.x);
          const py = y.getPixelForValue(bin.y);

          // Hors zone du graphique ?
          if (px < chartArea.left - 10 || px > chartArea.right + 10 || py < chartArea.top - 10 || py > chartArea.bottom + 10) {
            return;
          }

          // Échelle séquentielle logarithmique pour optimiser le contraste perçu
          const logRatio = Math.log(Math.max(1, bin.v - minCount + 1)) / Math.log(Math.max(2, maxCount - minCount + 1));
          const fillColor = getSequentialColor(tokens, Math.min(1, Math.max(0.06, logRatio)));

          const isHovered = (idx === activeHoverIdx);

          // Tracé de l'hexagone régulier (6 sommets)
          ctx.beginPath();
          for (let k = 0; k < 6; k++) {
            const angle = (Math.PI / 6) + (k * Math.PI / 3);
            const vx = px + (isHovered ? hexRadius * 1.15 : hexRadius) * Math.cos(angle);
            const vy = py + (isHovered ? hexRadius * 1.15 : hexRadius) * Math.sin(angle);
            if (k === 0) ctx.moveTo(vx, vy);
            else ctx.lineTo(vx, vy);
          }
          ctx.closePath();

          ctx.fillStyle = fillColor;
          ctx.fill();

          // Bordure
          if (isHovered) {
            ctx.strokeStyle = tokens.emphasis?.focal || tokens.textPrimary || '#FFFFFF';
            ctx.lineWidth = 2.5;
            ctx.stroke();
          } else {
            ctx.strokeStyle = isTufte
              ? tokens.textPrimary
              : (isDark ? 'rgba(36, 41, 51, 0.95)' : 'rgba(255, 255, 255, 0.90)');
            ctx.lineWidth = isTufte ? 0.75 : 1.5;
            ctx.stroke();
          }

          // Affichage du chiffre de densité au centre si l'alvéole est assez grande
          if (hexRadius >= 16 && bin.v >= 10) {
            ctx.fillStyle = logRatio > 0.55 ? '#FFFFFF' : (tokens.textPrimary || '#0F172A');
            ctx.font = `600 10px ${tokens.fontMono || 'monospace'}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(String(bin.v), px, py);
          }
        });

        // 2. Échelle de Légende Continue en haut à droite
        const barW = 120;
        const barH = 10;
        const barX = chartArea.right - barW - 10;
        const barY = chartArea.top + 12;

        // Boîtier de fond
        ctx.fillStyle = isDark ? 'rgba(36, 41, 51, 0.85)' : 'rgba(255, 255, 255, 0.85)';
        ctx.strokeStyle = tokens.gridColor || 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(barX - 12, barY - 18, barW + 24, barH + 34, 6);
          ctx.fill();
          ctx.stroke();
        }

        // Titre de l'échelle
        ctx.fillStyle = tokens.textSecondary || '#64748B';
        ctx.font = `600 10px ${tokens.fontFamily || 'sans-serif'}`;
        ctx.textAlign = 'left';
        ctx.fillText('Densité (obs / alvéole)', barX - 6, barY - 5);

        // Barre dégradée
        const legendGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
        legendGrad.addColorStop(0, getSequentialColor(tokens, 0.08));
        legendGrad.addColorStop(0.5, getSequentialColor(tokens, 0.5));
        legendGrad.addColorStop(1, getSequentialColor(tokens, 1.0));

        ctx.fillStyle = legendGrad;
        ctx.fillRect(barX, barY, barW, barH);
        ctx.strokeStyle = tokens.gridColor || 'rgba(0,0,0,0.1)';
        ctx.strokeRect(barX, barY, barW, barH);

        // Chiffres min et max
        ctx.fillStyle = tokens.textPrimary || '#0F172A';
        ctx.font = `500 9px ${tokens.fontMono || 'monospace'}`;
        ctx.textAlign = 'left';
        ctx.fillText(String(minCount), barX, barY + barH + 11);
        ctx.textAlign = 'right';
        ctx.fillText(`${maxCount}+`, barX + barW, barY + barH + 11);

        ctx.restore();
      }
    };

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'scatter',
      data: {
        datasets: [{
          label: `${seriesLabel} (N ≈ ${totalObs} obs)`,
          data: bins.map(b => ({ x: b.x, y: b.y, v: b.v })),
          pointRadius: 0, // Les points sont dessinés comme de vrais hexagones par le plugin
          pointHoverRadius: 0,
          backgroundColor: 'transparent',
          borderColor: 'transparent'
        }]
      },
      options: {
        ...defaultOpts,
        layout: {
          padding: {
            top: 20,
            right: 24,
            bottom: 12,
            left: 12
          }
        },
        animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
        interaction: {
          mode: 'nearest',
          axis: 'xy',
          intersect: false
        },
        onHover: (evt, elements, chart) => {
          if (elements && elements.length > 0) {
            activeHoverIdx = elements[0].index;
            chart.draw();
          } else if (activeHoverIdx !== -1) {
            activeHoverIdx = -1;
            chart.draw();
          }
        },
        plugins: {
          ...defaultOpts.plugins,
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: tokens.textPrimary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' },
              usePointStyle: true,
              boxWidth: 8
            }
          },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              title: (items) => {
                if (!items.length) return '';
                const r = items[0].raw;
                return `Alvéole : Taille ${r.x} cm × Poids ${r.y} kg`;
              },
              label: (context) => {
                const r = context.raw;
                const pct = totalObs > 0 ? ((r.v / totalObs) * 100).toFixed(1) : '0';
                return ` Densité : ${r.v} observations (${pct}% du total)`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            ...defaultOpts.scales.x,
            min: Math.floor(minX - padX),
            max: Math.ceil(maxX + padX),
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Taille corporelle (cm)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '600' }
            }
          },
          y: {
            type: 'linear',
            ...defaultOpts.scales.y,
            min: Math.floor(minY - padY),
            max: Math.ceil(maxY + padY),
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Masse corporelle (kg)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '600' }
            }
          }
        }
      },
      plugins: [hexbinCustomPlugin]
    };

    if (typeof Chart === 'undefined') {
      return {
        canvas,
        config,
        data: config.data,
        options: config.options,
        ctx: canvas?.getContext ? canvas.getContext('2d') : {},
        destroy: () => {},
        update: () => {},
        resize: () => {},
        hexResult,
        bins,
        computeHexBins,
        compute2DBins,
        getEmphasisStyle,
        getValenceColor,
        getThresholdStatus
      };
    }

    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeHexBins,
    compute2DBins,
    getEmphasisStyle,
    getValenceColor,
    getThresholdStatus
  };

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/04-correlation-relation/joint-scatter-marginals
  // --------------------------------------------------------------------------
  global.KitCharts["joint-scatter-marginals"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function(t, r, o) { return { borderColor: '#2B8CBE', backgroundColor: '#2B8CBE', ...o }; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function(v, tr, th, p, t) { return {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeMarginalKDE(values, gridPoints = 64) {
    const clean = Array.isArray(values) ? values.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b) : [];
    const n = clean.length;
    if (n < 2) return { grid: [], density: [], maxDensity: 0, h: 1, min: 0, max: 0 };

    const mean = clean.reduce((s, v) => s + v, 0) / n;
    const variance = clean.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (n - 1);
    const sigma = Math.sqrt(variance) || 1;
    const h = 1.06 * sigma * Math.pow(n, -0.2);

    const min = clean[0] - 1.2 * h;
    const max = clean[n - 1] + 1.2 * h;
    const step = (max - min) / (gridPoints - 1);

    const SQRT_2PI = Math.sqrt(2 * Math.PI);
    const grid = new Array(gridPoints);
    const density = new Array(gridPoints);
    let maxDensity = 0;

    for (let j = 0; j < gridPoints; j++) {
      const x = min + j * step;
      grid[j] = Math.round(x * 100) / 100;
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const u = (x - clean[i]) / h;
        sum += Math.exp(-0.5 * u * u) / SQRT_2PI;
      }
      const d = sum / (n * h);
      density[j] = d;
      if (d > maxDensity) maxDensity = d;
    }

    return { grid, density, maxDensity, h, min, max };
  }

  function computePearsonR(points) {
    const clean = points.filter(p => p && !isNaN(p.x) && !isNaN(p.y));
    const n = clean.length;
    if (n < 2) return 0;
    const mx = clean.reduce((s, p) => s + p.x, 0) / n;
    const my = clean.reduce((s, p) => s + p.y, 0) / n;
    let num = 0, dx2 = 0, dy2 = 0;
    clean.forEach(p => {
      const dx = p.x - mx;
      const dy = p.y - my;
      num += dx * dy;
      dx2 += dx * dx;
      dy2 += dy * dy;
    });
    return (dx2 > 0 && dy2 > 0) ? Math.round((num / Math.sqrt(dx2 * dy2)) * 1000) / 1000 : 0;
  }

  function computeCovarianceEllipse(points, confidence = 0.95, numPoints = 64) {
    const clean = points.filter(p => p && !isNaN(p.x) && !isNaN(p.y));
    const n = clean.length;
    if (n < 3) return { centerX: 0, centerY: 0, ellipsePoints: [], sx: 0, sy: 0, rho: 0 };

    const mx = clean.reduce((s, p) => s + p.x, 0) / n;
    const my = clean.reduce((s, p) => s + p.y, 0) / n;

    let varX = 0, varY = 0, covXY = 0;
    clean.forEach(p => {
      const dx = p.x - mx;
      const dy = p.y - my;
      varX += dx * dx;
      varY += dy * dy;
      covXY += dx * dy;
    });
    varX /= (n - 1);
    varY /= (n - 1);
    covXY /= (n - 1);

    const sx = Math.sqrt(Math.max(1e-9, varX));
    const sy = Math.sqrt(Math.max(1e-9, varY));
    const rho = Math.max(-0.9999, Math.min(0.9999, covXY / (sx * sy)));

    const chi2 = confidence === 0.99 ? 9.210 : confidence === 0.90 ? 4.605 : 5.991;
    const k = Math.sqrt(chi2);
    const sqrt1MinusRho2 = Math.sqrt(Math.max(0, 1 - rho * rho));

    const ellipsePoints = [];
    for (let i = 0; i <= numPoints; i++) {
      const t = (i / numPoints) * Math.PI * 2;
      const cosT = Math.cos(t);
      const sinT = Math.sin(t);
      const x = mx + k * sx * cosT;
      const y = my + k * sy * (rho * cosT + sqrt1MinusRho2 * sinT);
      ellipsePoints.push({ x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 });
    }

    return {
      centerX: Math.round(mx * 100) / 100,
      centerY: Math.round(my * 100) / 100,
      ellipsePoints,
      sx, sy, rho, k, varX, varY, covXY
    };
  }

  function computeConfidenceEllipse(points, confidence = 0.95, numPoints = 64) {
    const res = computeCovarianceEllipse(points, confidence, numPoints);
    return res.ellipsePoints || [];
  }

  function computeMarginalKDEs(points, gridPoints = 64) {
    const clean = points.filter(p => p && !isNaN(p.x) && !isNaN(p.y));
    const n = clean.length;
    if (n < 2) return { n, pearsonR: 0, rSquared: 0, xKde: { grid: [], density: [], maxDensity: 0 }, yKde: { grid: [], density: [], maxDensity: 0 } };

    const xVals = clean.map(p => p.x);
    const yVals = clean.map(p => p.y);

    const xKde = computeMarginalKDE(xVals, gridPoints);
    const yKde = computeMarginalKDE(yVals, gridPoints);
    const pearsonR = computePearsonR(clean);
    const rSquared = Math.round(pearsonR * pearsonR * 1000) / 1000;

    return {
      n,
      pearsonR,
      rSquared,
      xKde,
      yKde
    };
  }

  const DEFAULT_DATA = {
    datasets: [{
      label: "Temps d'attente (min) vs Satisfaction (0-100)",
      data: [
        { x: 4.2, y: 92 }, { x: 5.8, y: 86 }, { x: 6.5, y: 95 }, { x: 7.8, y: 81 }, { x: 8.4, y: 89 },
        { x: 9.6, y: 77 }, { x: 10.5, y: 85 }, { x: 11.8, y: 73 }, { x: 12.4, y: 82 }, { x: 13.9, y: 70 },
        { x: 15.1, y: 78 }, { x: 15.8, y: 64 }, { x: 16.9, y: 75 }, { x: 17.5, y: 62 }, { x: 18.9, y: 69 },
        { x: 19.4, y: 58 }, { x: 20.8, y: 67 }, { x: 21.5, y: 53 }, { x: 22.9, y: 63 }, { x: 23.4, y: 48 },
        { x: 24.8, y: 59 }, { x: 25.5, y: 45 }, { x: 26.9, y: 55 }, { x: 27.8, y: 42 }, { x: 28.5, y: 51 },
        { x: 29.8, y: 39 }, { x: 31.2, y: 46 }, { x: 32.5, y: 35 }, { x: 33.8, y: 41 }, { x: 35.0, y: 32 },
        { x: 11.2, y: 90 }, { x: 14.0, y: 65 }, { x: 18.0, y: 79 }, { x: 22.0, y: 47 }, { x: 27.0, y: 38 }
      ]
    }]
  };

  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
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

    const rawData = customData || DEFAULT_DATA;
    const points = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;
    const seriesLabel = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Observations';

    const marginals = computeMarginalKDEs(points, 64);
    const kdeX = marginals.xKde;
    const kdeY = marginals.yKde;
    const pearsonR = marginals.pearsonR;
    const rSquared = marginals.rSquared;
    const ellipseData = computeCovarianceEllipse(points, 0.95, 64);
    const ellipsePoints = ellipseData.ellipsePoints;

    const mainColor = getColor(tokens, 0) || '#2B8CBE';
    const accentColor = tokens.emphasis?.focal || getColor(tokens, 1) || '#E66101';
    const textColor = tokens.textPrimary || '#0F172A';
    const textMuted = tokens.textMuted || '#64748B';
    const gridColor = tokens.gridColor || (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)');

    // OLS Linear Regression
    let minX = Infinity, maxX = -Infinity;
    let sumX = 0, sumY = 0;
    points.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      sumX += p.x;
      sumY += p.y;
    });
    const meanX = sumX / points.length;
    const meanY = sumY / points.length;
    let num = 0, den = 0;
    points.forEach(p => {
      num += (p.x - meanX) * (p.y - meanY);
      den += (p.x - meanX) * (p.x - meanX);
    });
    const slope = den !== 0 ? num / den : 0;
    const intercept = meanY - slope * meanX;
    const regressionPoints = [
      { x: Math.floor(minX), y: Math.round((intercept + slope * Math.floor(minX)) * 10) / 10 },
      { x: Math.ceil(maxX), y: Math.round((intercept + slope * Math.ceil(maxX)) * 10) / 10 }
    ];

    const jointplotPainterPlugin = {
      id: 'kitChartsJointMarginalsPainter',
      beforeDatasetsDraw(chart) {
        const { ctx, scales: { x, y } } = chart;
        if (!x || !y) return;

        // 1. Dessin de l'ellipse de confiance bivariée 95%
        if (ellipsePoints && ellipsePoints.length > 2) {
          ctx.save();
          ctx.beginPath();
          for (let i = 0; i < ellipsePoints.length; i++) {
            const px = x.getPixelForValue(ellipsePoints[i].x);
            const py = y.getPixelForValue(ellipsePoints[i].y);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fillStyle = hexToRgba(accentColor, isDark ? 0.16 : 0.08);
          ctx.fill();
          ctx.strokeStyle = hexToRgba(accentColor, 0.70);
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 3]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Centre de gravité bivarié (μx, μy)
          const cx = x.getPixelForValue(ellipseData.centerX);
          const cy = y.getPixelForValue(ellipseData.centerY);
          ctx.fillStyle = accentColor;
          ctx.beginPath();
          ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      },
      afterDraw(chart) {
        const { ctx, scales: { x, y }, chartArea } = chart;
        if (!x || !y || !chartArea) return;

        ctx.save();

        // -------------------------------------------------------------
        // 2. DISTRIBUTION MARGINALE X (Haut)
        // -------------------------------------------------------------
        if (kdeX.grid.length && kdeX.maxDensity > 0) {
          const topMarginH = 38;
          const baseY = chartArea.top - 8;

          // Ligne de base
          ctx.strokeStyle = gridColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(chartArea.left, baseY);
          ctx.lineTo(chartArea.right, baseY);
          ctx.stroke();

          // Courbe KDE remplie
          ctx.beginPath();
          const firstX = Math.max(chartArea.left, Math.min(chartArea.right, x.getPixelForValue(kdeX.grid[0])));
          ctx.moveTo(firstX, baseY);
          for (let j = 0; j < kdeX.grid.length; j++) {
            const px = Math.max(chartArea.left, Math.min(chartArea.right, x.getPixelForValue(kdeX.grid[j])));
            const ratio = kdeX.density[j] / kdeX.maxDensity;
            const py = baseY - (ratio * topMarginH);
            ctx.lineTo(px, py);
          }
          const lastX = Math.max(chartArea.left, Math.min(chartArea.right, x.getPixelForValue(kdeX.grid[kdeX.grid.length - 1])));
          ctx.lineTo(lastX, baseY);
          ctx.closePath();

          const gradX = ctx.createLinearGradient(0, baseY - topMarginH, 0, baseY);
          gradX.addColorStop(0, hexToRgba(mainColor, 0.35));
          gradX.addColorStop(1, hexToRgba(mainColor, 0.04));
          ctx.fillStyle = gradX;
          ctx.fill();

          ctx.strokeStyle = hexToRgba(mainColor, 0.85);
          ctx.lineWidth = 2;
          ctx.stroke();

          // Label indicateur
          ctx.fillStyle = textMuted;
          ctx.font = `600 10px ${tokens.fontFamily || 'Inter, sans-serif'}`;
          ctx.textAlign = 'left';
          ctx.fillText('▲ DENSITÉ MARGINALE X', chartArea.left + 2, baseY - topMarginH + 2);
        }

        // -------------------------------------------------------------
        // 3. DISTRIBUTION MARGINALE Y (Droite)
        // -------------------------------------------------------------
        if (kdeY.grid.length && kdeY.maxDensity > 0) {
          const rightMarginW = 38;
          const baseX = chartArea.right + 8;

          // Ligne de base
          ctx.strokeStyle = gridColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(baseX, chartArea.top);
          ctx.lineTo(baseX, chartArea.bottom);
          ctx.stroke();

          // Courbe KDE remplie
          ctx.beginPath();
          const firstY = Math.max(chartArea.top, Math.min(chartArea.bottom, y.getPixelForValue(kdeY.grid[0])));
          ctx.moveTo(baseX, firstY);
          for (let j = 0; j < kdeY.grid.length; j++) {
            const py = Math.max(chartArea.top, Math.min(chartArea.bottom, y.getPixelForValue(kdeY.grid[j])));
            const ratio = kdeY.density[j] / kdeY.maxDensity;
            const px = baseX + (ratio * rightMarginW);
            ctx.lineTo(px, py);
          }
          const lastY = Math.max(chartArea.top, Math.min(chartArea.bottom, y.getPixelForValue(kdeY.grid[kdeY.grid.length - 1])));
          ctx.lineTo(baseX, lastY);
          ctx.closePath();

          const gradY = ctx.createLinearGradient(baseX + rightMarginW, 0, baseX, 0);
          gradY.addColorStop(0, hexToRgba(mainColor, 0.35));
          gradY.addColorStop(1, hexToRgba(mainColor, 0.04));
          ctx.fillStyle = gradY;
          ctx.fill();

          ctx.strokeStyle = hexToRgba(mainColor, 0.85);
          ctx.lineWidth = 2;
          ctx.stroke();

          // Label indicateur
          ctx.fillStyle = textMuted;
          ctx.font = `600 10px ${tokens.fontFamily || 'Inter, sans-serif'}`;
          ctx.textAlign = 'left';
          ctx.save();
          ctx.translate(baseX + rightMarginW + 12, chartArea.bottom);
          ctx.rotate(-Math.PI / 2);
          ctx.fillText('▲ DENSITÉ MARGINALE Y', 0, 0);
          ctx.restore();
        }

        // -------------------------------------------------------------
        // 4. BADGE STATISTIQUE DU COIN SUPÉRIEUR DROIT
        // -------------------------------------------------------------
        const statText = `r = ${pearsonR} • R² = ${rSquared}`;
        ctx.font = `600 11px ${tokens.fontMono || 'monospace'}`;
        const textMetrics = ctx.measureText(statText);
        const pillW = textMetrics.width + 16;
        const pillH = 22;
        const statX = chartArea.right - pillW;
        const statY = chartArea.top - 20;

        ctx.fillStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(statX, statY - 14, pillW, pillH, 5);
        } else {
          ctx.rect(statX, statY - 14, pillW, pillH);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.fillText(statText, statX + pillW / 2, statY + 1);

        ctx.restore();
      }
    };

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'scatter',
      data: {
        datasets: [
          {
            type: 'scatter',
            label: `${seriesLabel} (N = ${points.length})`,
            data: points,
            backgroundColor: hexToRgba(mainColor, 0.75),
            borderColor: mainColor,
            borderWidth: 1.5,
            pointRadius: 5.5,
            pointHoverRadius: 8,
            order: 2
          },
          {
            type: 'line',
            label: `Régression OLS (r = ${pearsonR})`,
            data: regressionPoints,
            borderColor: hexToRgba(tokens.textSecondary || '#475569', 0.85),
            borderWidth: 2,
            borderDash: [5, 4],
            pointRadius: 0,
            pointHoverRadius: 0,
            fill: false,
            tension: 0,
            order: 3
          }
        ]
      },
      options: {
        ...defaultOpts,
        layout: {
          padding: {
            top: 54,
            right: 64,
            bottom: 8,
            left: 6
          }
        },
        animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
        interaction: {
          mode: 'nearest',
          axis: 'xy',
          intersect: false
        },
        plugins: {
          ...defaultOpts.plugins,
          legend: {
            display: true,
            position: 'bottom',
            align: 'center',
            labels: {
              color: tokens.textPrimary,
              font: { family: tokens.fontFamily, size: 12 },
              usePointStyle: true,
              boxWidth: 8,
              padding: 16
            }
          },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              label: (ctx) => {
                if (ctx.dataset.type === 'scatter') {
                  return `Observation : X = ${ctx.parsed.x} min, Y = ${ctx.parsed.y} / 100`;
                }
                return `Régression : y = ${Math.round(slope * 100) / 100}x + ${Math.round(intercept * 10) / 10}`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            ...defaultOpts.scales.x,
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: "Temps d'attente au support (min)",
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '600' }
            }
          },
          y: {
            type: 'linear',
            ...defaultOpts.scales.y,
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Score de satisfaction client CSAT (0-100)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '600' }
            }
          }
        }
      },
      plugins: [jointplotPainterPlugin]
    };

    if (typeof Chart === 'undefined') {
      return {
        config,
        kdeX,
        kdeY,
        ellipsePoints,
        ellipseData,
        pearsonR,
        rSquared,
        computeMarginalKDE,
        computeMarginalKDEs,
        computeConfidenceEllipse,
        computeCovarianceEllipse,
        computePearsonR,
        getEmphasisStyle,
        getValenceColor,
        getThresholdStatus
      };
    }
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeMarginalKDE,
    computeMarginalKDEs,
    computeConfidenceEllipse,
    computeCovarianceEllipse,
    computePearsonR,
    getEmphasisStyle,
    getValenceColor,
    getThresholdStatus
  };

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/04-correlation-relation/matrix-heatmap
  // --------------------------------------------------------------------------
  global.KitCharts["matrix-heatmap"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

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
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 04-correlation-relation/matrix-heatmap/template.js
 * @description Template Chart.js v4+ pour Matrice de Corrélation / Heatmap Matricielle (Correlation Matrix).
 * Psychophysique: Encodage de coefficients de dépendance bivariée r dans [-1.0, +1.0] par palette divergente symétrique (Rang 7 Cleveland-McGill + Grille 2D).
 * Plugin: chartjs-chart-matrix@2.0.1
 * Règle d'or: Échelle de couleur divergente strictement symétrique centrée sur r=0, étiquetage tabulaire précis dans l'infobulle.
 */



/**
 * Calcule la couleur divergente interpolée pour un coefficient de corrélation r dans [-1, +1].
 *
 * @param {number} r - Coefficient de corrélation dans [-1.0, +1.0]
 * @param {Object} tokens - Tokens du thème actif
 * @returns {string} Chaîne de couleur CSS (RGBA ou Hex)
 */
function getDivergentCorrelationColor(r, tokens) {
  const clamped = Math.max(-1, Math.min(1, Number(r) || 0));
  const div = tokens.divergent || { neg: '#CA0020', mid: '#FFFFFF', pos: '#0571B0' };

  if (clamped >= 0) {
    const alpha = Math.max(0.08, Math.min(1, clamped));
    // Extraction ou fallback couleur positive
    const posHex = div.pos || tokens.palette[0] || '#2B8CBE';
    return hexToRgba(posHex, alpha);
  } else {
    const alpha = Math.max(0.08, Math.min(1, Math.abs(clamped)));
    const negHex = div.neg || tokens.semantic?.negative || '#CA0020';
    return hexToRgba(negHex, alpha);
  }
}

/**
 * Convertit une couleur Hex en chaîne RGBA avec opacité alpha.
 */
function hexToRgba(hex, alpha) {
  if (!hex || typeof hex !== 'string') return `rgba(43, 140, 190, ${alpha})`;
  if (hex.startsWith('rgba(') || hex.startsWith('rgb(')) return hex;
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `rgba(43, 140, 190, ${alpha})`;
}

/**
 * Données par défaut représentatives (Matrice de corrélation multi-actifs financiers)
 */
const DEFAULT_DATA = (() => {
  const vars = ['Actions US', 'Actions EU', 'Obligations', 'Or', 'Pétrole', 'Immobilier'];
  const matrixValues = [
    [ 1.00,  0.82, -0.35,  0.12,  0.45,  0.64],
    [ 0.82,  1.00, -0.28,  0.18,  0.52,  0.58],
    [-0.35, -0.28,  1.00,  0.42, -0.15, -0.22],
    [ 0.12,  0.18,  0.42,  1.00,  0.25,  0.08],
    [ 0.45,  0.52, -0.15,  0.25,  1.00,  0.38],
    [ 0.64,  0.58, -0.22,  0.08,  0.38,  1.00]
  ];

  const data = [];
  for (let r = 0; r < vars.length; r++) {
    for (let c = 0; c < vars.length; c++) {
      data.push({
        x: vars[c],
        y: vars[r],
        v: matrixValues[r][c]
      });
    }
  }

  return {
    labels: vars,
    datasets: [{
      label: 'Corrélation Inter-Actifs',
      data
    }]
  };
})();

/**
 * Crée et initialise une Matrice de Corrélation Heatmap dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément Canvas
 * @param {Object} [customData=null] - Données personnalisées
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';

  const rawData = customData || DEFAULT_DATA;
  const rawPoints = rawData.datasets?.[0]?.data || [];

  // Extraction unique des étiquettes de lignes et colonnes
  let xLabels = [];
  let yLabels = [];

  if (Array.isArray(rawData.labels)) {
    xLabels = [...rawData.labels];
    yLabels = [...rawData.labels];
  } else {
    const xSet = new Set();
    const ySet = new Set();
    rawPoints.forEach(p => {
      if (p.x !== undefined) xSet.add(String(p.x));
      if (p.y !== undefined) ySet.add(String(p.y));
    });
    xLabels = Array.from(xSet);
    yLabels = Array.from(ySet);
    if (xLabels.length === 0) xLabels = ['A', 'B', 'C'];
    if (yLabels.length === 0) yLabels = ['A', 'B', 'C'];
  }

  const firstDs = rawData.datasets?.[0] || {};
  const dataset = {
    label: firstDs.label || 'Matrice de Corrélation',
    data: rawPoints,
    backgroundColor: (ctx) => {
      const raw = ctx.raw;
      if (raw && (raw.role || raw.emphasis)) {
        return getEmphasisStyle(tokens, raw.role || raw.emphasis).backgroundColor;
      }
      if (raw && raw.isAnomaly) {
        return tokens.emphasis?.anomaly || '#D01C8B';
      }
      const val = raw?.v ?? raw?.value ?? 0;
      if (firstDs.valence || firstDs.metricType) {
        return getValenceColor(tokens, val, firstDs.metricType || firstDs.valence || 'gain');
      }
      return getDivergentCorrelationColor(val, tokens);
    },
    borderColor: (ctx) => {
      const raw = ctx.raw;
      if (raw && (raw.role === 'focal' || raw.emphasis === 'focal')) {
        return tokens.emphasis?.focal || tokens.textPrimary;
      }
      if (raw && (raw.role === 'anomaly' || raw.isAnomaly)) {
        return tokens.emphasis?.anomaly || '#D01C8B';
      }
      return isTufte ? tokens.textPrimary : tokens.surface;
    },
    borderWidth: (ctx) => {
      const raw = ctx.raw;
      if (raw && (raw.role === 'focal' || raw.role === 'anomaly' || raw.isAnomaly)) {
        return 2.5;
      }
      return isTufte ? 0.5 : 1.5;
    },
    borderRadius: 3,
    width: ({ chart }) => {
      const area = chart.chartArea;
      if (!area) return 24;
      const count = Math.max(1, xLabels.length);
      return (area.width / count) - 3;
    },
    height: ({ chart }) => {
      const area = chart.chartArea;
      if (!area) return 24;
      const count = Math.max(1, yLabels.length);
      return (area.height / count) - 3;
    }
  };

  const chartData = { datasets: [dataset] };
  const defaultOpts = getChartDefaultOptions(tokens);
  const spatialOpts = getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 10, hoverRadius: 5 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 350, easing: 'easeOutQuad' });

  const config = {
    type: 'matrix',
    data: chartData,
    options: {
      ...defaultOpts,
      ...spatialOpts,
      animation: animOpts,
      plugins: {
        ...defaultOpts.plugins,
        legend: { display: false },
        tooltip: {
          ...defaultOpts.plugins?.tooltip,
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono, size: 12, weight: '400' },
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              const r = items[0].raw;
              return `${r.x} × ${r.y}`;
            },
            label: (context) => {
              const r = context.raw;
              const v = r?.v ?? r?.value ?? 0;
              const sign = v > 0 ? '+' : '';
              const fmt = typeof v === 'number' ? `${sign}${v.toFixed(2)}` : v;
              return ` Corrélation (r): ${fmt}`;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'category',
          labels: xLabels,
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              weight: '600',
              size: 11
            },
            padding: 6
          }
        },
        y: {
          type: 'category',
          labels: yLabels,
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              weight: '600',
              size: 11
            },
            padding: 8
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function' && typeof Chart === 'function') {
    return new Chart(canvas, config);
  }

  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getDivergentCorrelationColor: typeof getDivergentCorrelationColor === 'function' ? getDivergentCorrelationColor : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/04-correlation-relation/scatter-plot
  // --------------------------------------------------------------------------
  global.KitCharts["scatter-plot"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2B8CBE'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function(t, r, o) { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const suggestScale = (KitChartsTheme && KitChartsTheme.suggestScale) || (typeof window !== 'undefined' && window.suggestScale) || function() { return 'linear'; };
  const getLogScaleOptions = (KitChartsTheme && KitChartsTheme.getLogScaleOptions) || (typeof window !== 'undefined' && window.getLogScaleOptions) || function() { return { type: 'logarithmic' }; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';


/**
 * @file 04-correlation-relation/scatter-plot/template.js
 * @description Template Chart.js v4+ pour Nuage de Points Bivarié avec Droite de Tendance (Scatter Plot).
 * Psychophysique: Encodage de relation bidimensionnelle (X, Y) par double position sur échelles orthogonales (Rang 1 Cleveland-McGill).
 * Règle d'or: Calcul authentique de régression linéaire par moindres carrés (y = ax + b), coefficient de corrélation de Pearson (r) et R².
 */



/**
 * Calcule la droite de régression linéaire (moindres carrés ordinaires) et les métriques de corrélation.
 *
 * @param {{x: number, y: number}[]} points - Tableau de coordonnées bivariées
 * @returns {{ slope: number, intercept: number, r: number, r2: number, trendPoints: {x: number, y: number}[] }}
 */
function computeLinearRegression(points) {
  if (!Array.isArray(points) || points.length < 2) {
    return { slope: 0, intercept: 0, r: 0, r2: 0, trendPoints: [] };
  }

  const valid = points.filter(p => typeof p === 'object' && p !== null && Number.isFinite(p.x) && Number.isFinite(p.y));
  const n = valid.length;
  if (n < 2) {
    return { slope: 0, intercept: 0, r: 0, r2: 0, trendPoints: [] };
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;
  let minX = Infinity;
  let maxX = -Infinity;

  for (const p of valid) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumX2 += p.x * p.x;
    sumY2 += p.y * p.y;
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
  }

  const denomX = n * sumX2 - sumX * sumX;
  const denomY = n * sumY2 - sumY * sumY;

  if (Math.abs(denomX) < 1e-12) {
    return { slope: 0, intercept: sumY / n, r: 0, r2: 0, trendPoints: [] };
  }

  const slope = (n * sumXY - sumX * sumY) / denomX;
  const intercept = (sumY - slope * sumX) / n;

  // Corrélation de Pearson r
  const denomR = Math.sqrt(Math.max(0, denomX * denomY));
  const r = denomR > 0 ? (n * sumXY - sumX * sumY) / denomR : 0;
  const r2 = r * r;

  const trendPoints = [
    { x: minX, y: slope * minX + intercept },
    { x: maxX, y: slope * maxX + intercept }
  ];

  return { slope, intercept, r, r2, trendPoints };
}

/**
 * Données par défaut représentatives (Dépenses R&D en % du CA vs Croissance annuelle du CA en %)
 */
const DEFAULT_DATA = {
  datasets: [{
    label: 'Entreprises Tech (N=16)',
    data: [
      { x: 4.2, y: 5.1 }, { x: 5.0, y: 7.4 }, { x: 6.1, y: 8.8 }, { x: 7.3, y: 11.2 },
      { x: 8.0, y: 10.5 }, { x: 9.2, y: 14.8 }, { x: 10.5, y: 16.0 }, { x: 11.8, y: 17.5 },
      { x: 12.4, y: 21.0 }, { x: 13.5, y: 22.4 }, { x: 14.8, y: 25.1 }, { x: 16.0, y: 28.5 },
      { x: 17.2, y: 29.0 }, { x: 18.5, y: 33.2 }, { x: 19.8, y: 35.8 }, { x: 21.0, y: 39.0 }
    ]
  }]
};

/**
 * Crée et initialise un Nuage de Points avec Droite de Tendance dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément Canvas
 * @param {Object} [customData=null] - Données personnalisées
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';

  let statHelpers;
  try {
    statHelpers = typeof require === 'function' ? require('../../../themes/stat-helpers.js') : (typeof window !== 'undefined' ? window.KitChartsStats : null);
  } catch (e) {
    try {
      statHelpers = typeof require === 'function' ? require('../../themes/stat-helpers.js') : (typeof window !== 'undefined' ? window.KitChartsStats : null);
    } catch (e2) {}
  }

  const ebOption = options.errorBars || (customData && customData.errorBars);
  if (ebOption && ebOption.confidence !== undefined) {
    if (typeof ebOption.confidence !== 'number' || ebOption.confidence < 0.80 || ebOption.confidence > 0.99) {
      throw new Error('kit-charts: confidence must be bounded to [0.80, 0.99]');
    }
  }

  const rawData = customData || DEFAULT_DATA;
  const datasets = [];

  const resolveScatterDatasetStyle = (ds, idx) => {
    if (ds.role || ds.emphasis) {
      const emp = getEmphasisStyle(tokens, ds.role || ds.emphasis);
      return {
        bg: ds.backgroundColor || emp.backgroundColor,
        border: ds.borderColor || emp.borderColor,
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (emp.borderWidth || 1),
        pointStyle: ds.pointStyle || emp.pointStyle || 'circle',
        pointRadius: ds.pointRadius || (isTufte ? 3.5 : 5)
      };
    }
    if (ds.valence || ds.metricType || ds.direction !== undefined) {
      const vColor = getValenceColor(tokens, ds.direction ?? ds.delta ?? 0, ds.metricType || ds.valence || 'gain');
      return {
        bg: ds.backgroundColor || vColor,
        border: ds.borderColor || (isTufte ? tokens.textPrimary : vColor),
        borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : 1,
        pointStyle: ds.pointStyle || 'circle',
        pointRadius: ds.pointRadius || (isTufte ? 3.5 : 5)
      };
    }
    const color = getColor(tokens, idx);
    return {
      bg: ds.backgroundColor || color,
      border: ds.borderColor || (isTufte ? tokens.textPrimary : color),
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : 1,
      pointStyle: ds.pointStyle || 'circle',
      pointRadius: ds.pointRadius || (isTufte ? 3.5 : 5)
    };
  };

  (rawData.datasets || []).forEach((ds, idx) => {
    const baseStyle = resolveScatterDatasetStyle(ds, idx);
    const rawPoints = Array.isArray(ds.data) ? ds.data : [];

    const hasPerPointRoles = rawPoints.some(p => p && (p.role || p.emphasis || p.anomaly)) || ds.highlightIndices || ds.anomalies;
    let pointBackgroundColors = baseStyle.bg;
    let pointBorderColors = baseStyle.border;
    let pointStyles = baseStyle.pointStyle;
    let pointRadii = baseStyle.pointRadius;

    if (hasPerPointRoles) {
      pointBackgroundColors = rawPoints.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return tokens.emphasis?.anomaly || '#D01C8B';
        }
        if (p && (p.role === 'focal' || p.emphasis === 'focal') || (ds.highlightIndices && ds.highlightIndices.includes(pIdx))) {
          return tokens.emphasis?.focal || getColor(tokens, 0);
        }
        if (p && (p.role === 'context' || p.emphasis === 'context')) {
          return tokens.emphasis?.context || '#CBD5E1';
        }
        return baseStyle.bg;
      });

      pointStyles = rawPoints.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return 'triangle';
        }
        return baseStyle.pointStyle;
      });

      pointRadii = rawPoints.map((p, pIdx) => {
        if (p && (p.role === 'anomaly' || p.emphasis === 'anomaly' || p.anomaly) || (ds.anomalies && ds.anomalies.includes(pIdx))) {
          return 8;
        }
        if (p && (p.role === 'focal' || p.emphasis === 'focal') || (ds.highlightIndices && ds.highlightIndices.includes(pIdx))) {
          return 7;
        }
        return baseStyle.pointRadius;
      });
    }

    const errorBarsData = ds.errorBarsData || (ds.errorBars && ds.errorBars.explicit) || (ebOption && ebOption.explicit) || rawPoints.map(p => p?.errorBars || null);

    // Dataset principal : Nuage de points
    datasets.push({
      type: 'scatter',
      label: ds.label || `Série ${idx + 1}`,
      data: rawPoints,
      errorBarsData,
      backgroundColor: pointBackgroundColors,
      borderColor: pointBorderColors,
      borderWidth: baseStyle.borderWidth,
      pointStyle: pointStyles,
      pointRadius: pointRadii,
      pointHoverRadius: 7,
      pointHitRadius: 14
    });

    // Ajout automatique de la droite de régression linéaire si >= 10 points (Garde-fou Anscombe 1973)
    const minPointsForTrend = (options.minTrendPoints !== undefined) ? options.minTrendPoints : (ds.minTrendPoints !== undefined ? ds.minTrendPoints : 10);
    const shouldShowTrend = (rawPoints.length >= minPointsForTrend && ds.showTrend !== false) || (rawPoints.length >= 2 && ds.showTrend === true);
    if (shouldShowTrend) {
      const reg = computeLinearRegression(rawPoints);
      if (reg.trendPoints.length === 2) {
        const isSmallN = rawPoints.length < 10;
        const trendColor = tokens.emphasis?.benchmark || getColor(tokens, idx + 1) || tokens.textSecondary;
        datasets.push({
          type: 'line',
          label: isSmallN ? `Tendance (R² = ${reg.r2.toFixed(2)} — n < 10)` : `Tendance (R² = ${reg.r2.toFixed(2)})`,
          data: reg.trendPoints,
          borderColor: trendColor,
          borderWidth: isTufte ? 1.5 : 2,
          borderDash: [6, 6],
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
          tension: 0
        });
      }
    }
  });

  const chartData = { datasets };
  const defaultOpts = getChartDefaultOptions(tokens);
  const spatialOpts = getSpatialInteractionOptions(tokens, { mode: 'nearest', axis: 'xy', hitRadius: 14, hoverRadius: 7 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' });

  const pluginsList = [];
  if (ebOption && statHelpers && statHelpers.errorBarsPlugin) {
    pluginsList.push(statHelpers.errorBarsPlugin);
  }

  const isYLogRequested = Boolean(options.logScale || options.logScaleY || (options.scales && options.scales.y && options.scales.y.type === 'logarithmic'));
  const isXLogRequested = Boolean(options.logScaleX || (options.scales && options.scales.x && options.scales.x.type === 'logarithmic'));

  if (isYLogRequested || isXLogRequested) {
    const rawPoints = (rawData.datasets || []).flatMap(ds => Array.isArray(ds.data) ? ds.data : []);
    if (isYLogRequested && rawPoints.some(p => p && typeof p.y === 'number' && p.y <= 0)) {
      throw new Error('kit-charts: log scale requires strictly positive values');
    }
    if (isXLogRequested && rawPoints.some(p => p && typeof p.x === 'number' && p.x <= 0)) {
      throw new Error('kit-charts: log scale requires strictly positive values');
    }
  }

  const config = {
    type: 'scatter',
    data: chartData,
    plugins: pluginsList,
    options: {
      ...defaultOpts,
      ...spatialOpts,
      animation: animOpts,
      plugins: {
        ...defaultOpts.plugins,
        legend: {
          ...defaultOpts.plugins?.legend,
          display: datasets.length > 1 && !isTufte
        },
        tooltip: {
          ...defaultOpts.plugins?.tooltip,
          titleFont: { family: tokens.fontFamily, size: 12, weight: '600' },
          bodyFont: { family: tokens.fontMono, size: 12, weight: '400' },
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              const ds = items[0].dataset;
              return `${ds.label || 'Observation'}`;
            },
            label: (context) => {
              const xVal = context.parsed.x;
              const yVal = context.parsed.y;
              const fmt = (v) => typeof v === 'number' ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(v) : v;
              const lines = [` (X: ${fmt(xVal)}, Y: ${fmt(yVal)})`];
              const pt = context.raw || {};
              const eb = pt.errorBars || (context.dataset.errorBarsData && context.dataset.errorBarsData[context.dataIndex]);
              if (eb && eb.low !== undefined && eb.high !== undefined) {
                lines.push(` IC95%: [${eb.low.toFixed(1)} — ${eb.high.toFixed(1)}]`);
              }
              return lines;
            }
          }
        }
      },
      scales: {
        x: isXLogRequested ? {
          ...getLogScaleOptions(tokens, typeof options.logScaleX === 'object' ? options.logScaleX : {}),
          border: { display: false }
        } : {
          type: 'linear',
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 6
          }
        },
        y: isYLogRequested ? {
          ...getLogScaleOptions(tokens, typeof options.logScale === 'object' ? options.logScale : (typeof options.logScaleY === 'object' ? options.logScaleY : {})),
          border: { display: false }
        } : {
          type: 'linear',
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 8
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function' && typeof Chart === 'function') {
    return new Chart(canvas, config);
  }

  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/04-correlation-relation/scatter-regression
  // --------------------------------------------------------------------------
  global.KitCharts["scatter-regression"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function(t, o) { return o || {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Régression linéaire par moindres carrés ordinaires (OLS).
   */
  function computeLinearRegression(points) {
    const clean = Array.isArray(points) ? points.filter(p => p && !isNaN(p.x) && !isNaN(p.y)) : [];
    const n = clean.length;
    if (n < 2) return { slope: 0, intercept: 0, r: 0, r2: 0, se: 0, n: 0, xMean: 0, yMean: 0, ssx: 0 };

    const xMean = clean.reduce((s, p) => s + p.x, 0) / n;
    const yMean = clean.reduce((s, p) => s + p.y, 0) / n;

    let num = 0;
    let denX = 0;
    let denY = 0;

    clean.forEach(p => {
      const dx = p.x - xMean;
      const dy = p.y - yMean;
      num += dx * dy;
      denX += dx * dx;
      denY += dy * dy;
    });

    const slope = denX !== 0 ? num / denX : 0;
    const intercept = yMean - slope * xMean;
    const r = (denX > 0 && denY > 0) ? num / Math.sqrt(denX * denY) : 0;
    const r2 = r * r;

    let ssRes = 0;
    clean.forEach(p => {
      const pred = intercept + slope * p.x;
      ssRes += Math.pow(p.y - pred, 2);
    });
    const se = n > 2 ? Math.sqrt(ssRes / (n - 2)) : 0;

    return {
      slope,
      intercept,
      r: Math.round(r * 1000) / 1000,
      r2: Math.round(r2 * 1000) / 1000,
      se,
      n,
      xMean,
      yMean,
      ssx: denX
    };
  }

  function computePearsonR(points) {
    return computeLinearRegression(points).r;
  }

  /**
   * Calcule la bande de confiance à 95% pour la moyenne prédite.
   */
  function computeConfidenceBand(points, regOrGrid, gridPoints = 30) {
    const reg = (typeof regOrGrid === 'object' && regOrGrid !== null && regOrGrid.slope !== undefined)
      ? regOrGrid
      : computeLinearRegression(points);
    const numPoints = (typeof regOrGrid === 'number') ? regOrGrid : gridPoints;

    const clean = points.filter(p => p && !isNaN(p.x));
    if (clean.length < 2 || reg.n < 2) {
      return { line: [], upper: [], lower: [], trendPoints: [], ciUpperPoints: [], ciLowerPoints: [] };
    }

    const xMin = Math.min(...clean.map(p => p.x));
    const xMax = Math.max(...clean.map(p => p.x));
    const step = numPoints > 1 ? (xMax - xMin) / (numPoints - 1) : 0;

    const tCrit = 1.96; // Approximation asymptotique normale
    const line = [];
    const upper = [];
    const lower = [];

    for (let i = 0; i < numPoints; i++) {
      const x = xMin + i * step;
      const yHat = reg.intercept + reg.slope * x;
      const seFit = reg.se * Math.sqrt((1 / reg.n) + (Math.pow(x - reg.xMean, 2) / (reg.ssx || 1)));
      const margin = tCrit * seFit;

      line.push({ x: Math.round(x * 10) / 10, y: Math.round(yHat * 10) / 10 });
      upper.push({ x: Math.round(x * 10) / 10, y: Math.round((yHat + margin) * 10) / 10 });
      lower.push({ x: Math.round(x * 10) / 10, y: Math.round((yHat - margin) * 10) / 10 });
    }

    return {
      line,
      upper,
      lower,
      trendPoints: line,
      ciUpperPoints: upper,
      ciLowerPoints: lower
    };
  }

  function computeConfidenceInterval95(points, gridPoints = 30) {
    return computeConfidenceBand(points, gridPoints);
  }

  const DEFAULT_DATA = {
    datasets: [{
      label: "Budget R&D vs Chiffre d'Affaires (M€)",
      data: [
        { x: 1.2, y: 14.5 }, { x: 1.8, y: 18.2 }, { x: 2.1, y: 19.8 },
        { x: 2.5, y: 24.1 }, { x: 3.0, y: 28.5 }, { x: 3.4, y: 31.0 },
        { x: 3.8, y: 33.2 }, { x: 4.2, y: 39.5 }, { x: 4.6, y: 41.8 },
        { x: 5.0, y: 44.0 }, { x: 5.5, y: 49.2 }, { x: 6.0, y: 53.5 },
        { x: 6.5, y: 56.8 }, { x: 7.0, y: 62.0 }, { x: 7.5, y: 64.5 }
      ]
    }]
  };

  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
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

    const rawData = customData || DEFAULT_DATA;
    const points = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;
    const seriesLabel = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Observations';

    const reg = computeLinearRegression(points);
    const bands = computeConfidenceBand(points, reg);

    const pointColor = getColor(tokens, 0);
    const regColor = tokens.emphasis?.focal || tokens.palette?.[1] || '#E66101';

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'scatter',
      data: {
        datasets: [
          {
            type: 'scatter',
            label: seriesLabel,
            data: points,
            backgroundColor: hexToRgba(pointColor, 0.75),
            borderColor: pointColor,
            borderWidth: 1.5,
            pointRadius: 5,
            pointHoverRadius: 7,
            order: 3
          },
          {
            type: 'line',
            label: `Régression OLS (R² = ${reg.r2}, r = ${reg.r})`,
            data: bands.line,
            borderColor: regColor,
            borderWidth: 2.5,
            pointRadius: 0,
            fill: false,
            tension: 0,
            order: 1
          },
          {
            type: 'line',
            label: 'IC 95% Supérieur',
            data: bands.upper,
            borderColor: 'transparent',
            backgroundColor: hexToRgba(regColor, isDark ? 0.20 : 0.12),
            pointRadius: 0,
            fill: '+1',
            tension: 0,
            order: 2
          },
          {
            type: 'line',
            label: 'IC 95% Inférieur',
            data: bands.lower,
            borderColor: 'transparent',
            pointRadius: 0,
            fill: false,
            tension: 0,
            order: 2
          }
        ]
      },
      options: {
        ...defaultOpts,
        animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
        interaction: {
          mode: 'nearest',
          axis: 'xy',
          intersect: false
        },
        plugins: {
          ...defaultOpts.plugins,
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: tokens.textPrimary,
              font: { family: tokens.fontFamily, size: 12 },
              filter: (item) => !item.text.includes('Inférieur') && !item.text.includes('Supérieur')
            }
          },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              label: (ctx) => {
                if (ctx.dataset.type === 'scatter') {
                  return `Observation : X = ${ctx.parsed.x}, Y = ${ctx.parsed.y}`;
                }
                if (ctx.dataset.label.includes('Régression')) {
                  return `Prédiction ŷ = ${ctx.parsed.y} (R² = ${reg.r2})`;
                }
                return `Borne IC 95% : ${ctx.parsed.y}`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            ...defaultOpts.scales.x,
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Variable X (Investissement R&D)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          },
          y: {
            type: 'linear',
            ...defaultOpts.scales.y,
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Variable Y (Revenu)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      }
    };

    if (typeof Chart === 'undefined') return Object.assign(config, { reg, bands, computeLinearRegression, computeConfidenceBand, computePearsonR });
    return new Chart(canvas, config);
  }

  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || function() { return {}; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || function() { return '#2B8CBE'; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || function() { return 'nominal'; };

  return {
    createChart,
    DEFAULT_DATA,
    computeLinearRegression,
    computeLinearRegressionOLS: computeLinearRegression,
    computeConfidenceBand,
    computeConfidenceInterval95: computeConfidenceBand,
    computePearsonR,
    computeR2: (pts) => computeLinearRegression(pts).r2,
    getEmphasisStyle,
    getValenceColor,
    getThresholdStatus
  };

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/05-evolution-temporelle/area-chart
  // --------------------------------------------------------------------------
  global.KitCharts["area-chart"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function(t, r, o) { return { borderColor: '#2B8CBE', backgroundColor: '#2B8CBE', ...o }; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function(v, tr, th, p, t) { return {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 05-evolution-temporelle/area-chart/template.js
 * @description Standardized Area Chart template for kit-charts.
 * Encodes cumulative single/multi-series volume under a continuous temporal curve.
 * Enforces strict Y=0 baseline origin (Cleveland-McGill magnitude rule) and semantic emphasis tokens.
 */

/**
 * Données par défaut représentatives (Volume mensuel de données réseau en To et projection)
 */
const DEFAULT_DATA = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
  datasets: [{
    label: 'Volume Données Réseau (To)',
    data: [120, 135, 150, 165, 180, 210, 240, 260, 290, 310, 340, 380],
    role: 'focal'
  }]
};

/**
 * Creates and renders an Area Chart in the specified canvas target.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - DOM Canvas ID or Canvas Element
 * @param {Object} [customData] - Optional user data payload
 * @param {string} [themeName='colorbrewer-accessible'] - Theme identifier
 * @returns {Object} Initialized Chart.js instance or mock instance
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string' && typeof document !== 'undefined'
    ? document.getElementById(canvasTarget)
    : canvasTarget;

  if (typeof Chart !== 'undefined' && canvas) {
    const existing = Chart.getChart(canvas);
    if (existing) {
      existing.destroy();
    }
  }

  const container = canvas && canvas.parentElement ? canvas.parentElement : null;
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';

  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];

  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const role = ds.role || (ds.forecast ? 'forecast' : (idx === 0 ? 'focal' : 'context'));
    const isForecast = role === 'forecast' || Boolean(ds.forecast);
    const alpha = ds.alpha ?? (isForecast ? (tokens.emphasis?.forecastAlpha || 0.4) : (isTufte ? 0.15 : 0.25));

    let baseColor = getColor(tokens, idx);
    if (ds.valence && ds.metricType) {
      baseColor = getValenceColor(tokens, ds.valence, ds.metricType);
    } else if (ds.valence) {
      baseColor = getValenceColor(tokens, ds.valence, 'gain');
    }

    const emphasisStyle = getEmphasisStyle(tokens, role, {
      fill: true,
      alpha,
      fillAlpha: ds.fillAlpha ?? alpha * 0.5,
      borderColor: ds.borderColor || (ds.valence ? baseColor : undefined),
      borderWidth: ds.borderWidth ?? (isTufte ? 1.5 : (role === 'focal' ? 2.5 : 1.5))
    });

    const border = ds.borderColor || emphasisStyle.borderColor || baseColor;
    const bg = ds.backgroundColor || (typeof emphasisStyle.backgroundColor === 'string'
      ? emphasisStyle.backgroundColor
      : hexToRgba(border, alpha));

    return {
      label: ds.label || `Série ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      borderColor: border,
      backgroundColor: bg,
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : emphasisStyle.borderWidth,
      borderDash: ds.borderDash || emphasisStyle.borderDash || (isForecast ? [5, 5] : []),
      tension: typeof ds.tension === 'number' ? ds.tension : 0.3,
      fill: ds.fill !== undefined ? ds.fill : 'origin',
      pointRadius: typeof ds.pointRadius === 'number' ? ds.pointRadius : (emphasisStyle.pointRadius ?? 3),
      pointHoverRadius: 6,
      pointStyle: ds.pointStyle || emphasisStyle.pointStyle || (isForecast ? 'crossRot' : 'circle'),
      pointBackgroundColor: ds.pointBackgroundColor || emphasisStyle.pointBackgroundColor || border,
      pointBorderColor: ds.pointBorderColor || emphasisStyle.pointBorderColor || tokens.bg,
      pointBorderWidth: ds.pointBorderWidth ?? 1.5
    };
  });

  const chartData = { labels, datasets };
  const baseOptions = getChartDefaultOptions(tokens);
  const temporalOpts = getTemporalInteractionOptions(tokens, { mode: 'index', axis: 'x', hitRadius: 12, hoverRadius: 6 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 700, easing: 'easeOutCubic' });

  const config = {
    type: 'line',
    data: chartData,
    options: {
      ...baseOptions,
      ...temporalOpts,
      animation: animOpts,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 6
          }
        },
        y: {
          beginAtZero: true, // Strict psychophysical mandate for area-encoded charts
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 8,
            callback: (val) => {
              if (typeof val === 'number' && Math.abs(val) >= 1000) {
                return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
              }
              return val;
            }
          }
        }
      },
      plugins: {
        legend: {
          display: datasets.length > 1 && !isTufte,
          position: 'top',
          align: 'end',
          labels: {
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              size: 12,
              weight: '500'
            },
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
            padding: 14
          }
        },
        tooltip: {
          backgroundColor: tokens.tooltipBg,
          titleColor: tokens.tooltipText,
          bodyColor: tokens.tooltipText,
          borderColor: tokens.borderStrong,
          borderWidth: 1,
          padding: 10,
          cornerRadius: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '500'
          },
          callbacks: {
            label: (context) => {
              const val = context.parsed.y !== null && context.parsed.y !== undefined
                ? context.parsed.y
                : context.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val)
                : val;
              const isForecastDs = context.dataset.borderDash && context.dataset.borderDash.length > 0;
              const suffix = isForecastDs ? ' (Projection)' : '';
              return ` ${context.dataset.label || ''}: ${formatted}${suffix}`;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Headless test fallback mock
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/05-evolution-temporelle/candlestick-ohlc
  // --------------------------------------------------------------------------
  global.KitCharts["candlestick-ohlc"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function(t, r, o) { return { borderColor: '#2B8CBE', backgroundColor: '#2B8CBE', ...o }; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function(v, tr, th, p, t) { return {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 05-evolution-temporelle/candlestick-ohlc/template.js
 * @description Standardized Candlestick (OHLC) Chart template for kit-charts.
 * Visualizes financial price intervals (Open, High, Low, Close) over continuous time.
 * Employs chartjs-chart-financial plugin, Luxon time scale adapter, and psychophysically calibrated semantic valence colors.
 */

/**
 * Données par défaut représentatives (Cours boursier journalier TECH EUR)
 */
const DEFAULT_DATA = {
  datasets: [{
    label: 'Action TECH EUR (OHLC)',
    data: [
      { x: new Date('2025-01-02').getTime(), o: 152.4, h: 156.8, l: 151.2, c: 155.6 },
      { x: new Date('2025-01-03').getTime(), o: 155.6, h: 161.0, l: 154.5, c: 159.8 },
      { x: new Date('2025-01-06').getTime(), o: 160.0, h: 162.5, l: 157.0, c: 158.2 },
      { x: new Date('2025-01-07').getTime(), o: 157.8, h: 159.4, l: 153.0, c: 154.5 },
      { x: new Date('2025-01-08').getTime(), o: 154.2, h: 158.0, l: 153.5, c: 157.1 },
      { x: new Date('2025-01-09').getTime(), o: 157.0, h: 164.2, l: 156.8, c: 163.5 },
      { x: new Date('2025-01-10').getTime(), o: 163.8, h: 167.0, l: 162.0, c: 166.4 },
      { x: new Date('2025-01-13').getTime(), o: 166.0, h: 168.5, l: 163.2, c: 164.0 },
      { x: new Date('2025-01-14').getTime(), o: 164.0, h: 165.5, l: 159.0, c: 160.2 },
      { x: new Date('2025-01-15').getTime(), o: 160.5, h: 163.8, l: 158.5, c: 162.9 }
    ],
    role: 'focal'
  }]
};

/**
 * Creates and renders a Candlestick OHLC Chart in the specified canvas target.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - DOM Canvas ID or Canvas Element
 * @param {Object} [customData] - Optional user data payload
 * @param {string} [themeName='colorbrewer-accessible'] - Theme identifier
 * @returns {Object} Initialized Chart.js instance or mock instance
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string' && typeof document !== 'undefined'
    ? document.getElementById(canvasTarget)
    : canvasTarget;

  if (typeof Chart !== 'undefined' && canvas) {
    const existing = Chart.getChart(canvas);
    if (existing) {
      existing.destroy();
    }
  }

  const container = canvas && canvas.parentElement ? canvas.parentElement : null;
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';

  const rawData = customData || DEFAULT_DATA;
  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const metricType = ds.metricType || 'gain';
    const upColor = getValenceColor(tokens, 'up', metricType);
    const downColor = getValenceColor(tokens, 'down', metricType);
    const neutralColor = tokens.status?.neutral || tokens.semantic?.neutral || '#94A3B8';

    const role = ds.role || (ds.forecast ? 'forecast' : 'focal');
    const isForecast = role === 'forecast' || Boolean(ds.forecast);
    const alpha = isForecast ? (tokens.emphasis?.forecastAlpha || 0.5) : 1.0;

    const colorConfig = {
      up: isForecast ? hexToRgba(upColor, alpha) : upColor,
      down: isForecast ? hexToRgba(downColor, alpha) : downColor,
      unchanged: isForecast ? hexToRgba(neutralColor, alpha) : neutralColor
    };

    return {
      label: ds.label || `Série ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      color: ds.color || colorConfig,
      borderColor: ds.borderColor || colorConfig,
      backgroundColor: ds.backgroundColor || (role === 'focal' ? getColor(tokens, idx) : tokens.emphasis?.context || '#CBD5E1')
    };
  });

  const chartData = { datasets };
  const baseOptions = getChartDefaultOptions(tokens);
  const temporalOpts = getTemporalInteractionOptions(tokens, { mode: 'index', axis: 'x', hitRadius: 12, hoverRadius: 6 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 700, easing: 'easeOutCubic' });

  const config = {
    type: 'candlestick',
    data: chartData,
    options: {
      ...baseOptions,
      ...temporalOpts,
      animation: animOpts,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'timeseries',
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 6
          }
        },
        y: {
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 8
          }
        }
      },
      plugins: {
        legend: {
          display: datasets.length > 1 && !isTufte,
          position: 'top',
          align: 'end',
          labels: {
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              size: 12,
              weight: '500'
            },
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
            padding: 14
          }
        },
        tooltip: {
          backgroundColor: tokens.tooltipBg,
          titleColor: tokens.tooltipText,
          bodyColor: tokens.tooltipText,
          borderColor: tokens.borderStrong,
          borderWidth: 1,
          padding: 10,
          cornerRadius: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '500'
          },
          callbacks: {
            label: (ctx) => {
              const raw = ctx.raw;
              if (raw && typeof raw === 'object') {
                const delta = raw.c - raw.o;
                const sign = delta >= 0 ? '+' : '';
                const pct = raw.o !== 0 ? ((delta / raw.o) * 100).toFixed(2) : '0.00';
                return [
                  ` O: ${raw.o} | H: ${raw.h} | L: ${raw.l} | C: ${raw.c}`,
                  ` Variation: ${sign}${delta.toFixed(2)} (${sign}${pct}%)`
                ];
              }
              return '';
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Headless test fallback mock
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/05-evolution-temporelle/candlestick-volume
  // --------------------------------------------------------------------------
  global.KitCharts["candlestick-volume"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeVolumeMA(volumeList, period = 5) {
    if (!Array.isArray(volumeList)) return [];
    return volumeList.map((val, idx, arr) => {
      const start = Math.max(0, idx - period + 1);
      const slice = arr.slice(start, idx + 1);
      const sum = slice.reduce((s, v) => s + v, 0);
      return Math.round(sum / slice.length);
    });
  }

  function computeCandleStats(ohlcData) {
    if (!Array.isArray(ohlcData)) return [];
    return ohlcData.map(d => ({
      ...d,
      isBullish: d.c >= d.o,
      body: Math.abs(d.c - d.o),
      top: Math.max(d.o, d.c),
      bottom: Math.min(d.o, d.c)
    }));
  }

  const DEFAULT_DATA = {
    labels: [
      '01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan',
      '08 Jan', '09 Jan', '10 Jan', '11 Jan', '12 Jan',
      '15 Jan', '16 Jan', '17 Jan', '18 Jan', '19 Jan',
      '22 Jan', '23 Jan', '24 Jan', '25 Jan', '26 Jan'
    ],
    datasets: [
      {
        label: 'Action Tech Corp (OHLC)',
        type: 'ohlc',
        data: [
          { o: 150, h: 155, l: 148, c: 154, v: 12000 },
          { o: 154, h: 158, l: 152, c: 157, v: 14500 },
          { o: 157, h: 160, l: 155, c: 156, v: 11000 },
          { o: 156, h: 157, l: 149, c: 151, v: 18000 },
          { o: 151, h: 153, l: 147, c: 148, v: 19500 },
          { o: 148, h: 152, l: 146, c: 151, v: 13000 },
          { o: 151, h: 156, l: 150, c: 155, v: 16000 },
          { o: 155, h: 162, l: 154, c: 161, v: 22000 },
          { o: 161, h: 165, l: 159, c: 163, v: 21000 },
          { o: 163, h: 164, l: 158, c: 159, v: 14000 },
          { o: 159, h: 162, l: 157, c: 161, v: 12500 },
          { o: 161, h: 167, l: 160, c: 166, v: 24000 },
          { o: 166, h: 170, l: 164, c: 169, v: 27000 },
          { o: 169, h: 172, l: 167, c: 171, v: 23000 },
          { o: 171, h: 173, l: 166, c: 168, v: 17000 },
          { o: 168, h: 169, l: 162, c: 164, v: 18500 },
          { o: 164, h: 168, l: 163, c: 167, v: 15000 },
          { o: 167, h: 174, l: 166, c: 173, v: 26000 },
          { o: 173, h: 178, l: 171, c: 176, v: 29000 },
          { o: 176, h: 180, l: 174, c: 179, v: 31000 }
        ]
      }
    ]
  };

  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
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

    const rawData = customData || DEFAULT_DATA;
    const labels = rawData.labels || DEFAULT_DATA.labels;
    const ohlcList = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;

    const candleStats = computeCandleStats(ohlcList);
    const volumeList = ohlcList.map(d => d.v || 0);
    const vmaList = computeVolumeMA(volumeList, 5);

    let priceMin = Infinity;
    let priceMax = -Infinity;
    ohlcList.forEach(d => {
      if (d.l < priceMin) priceMin = d.l;
      if (d.h > priceMax) priceMax = d.h;
    });
    const priceSpan = priceMax - priceMin || 10;
    const pricePad = priceSpan * 0.05;

    let volMax = Math.max(...volumeList, 100);

    const bullColor = tokens.semantic?.positive || tokens.status?.success || '#2E7D32';
    const bearColor = tokens.semantic?.negative || tokens.status?.danger || '#C62828';
    const vmaColor = tokens.emphasis?.focal || tokens.palette?.[0] || '#2B8CBE';

    const candlestickPainterPlugin = {
      id: 'kitChartsCandlestickVolumePainter',
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, yPrice, yVolume }, chartArea } = chart;
        if (!x || !yPrice) return;

        ctx.save();
        const n = candleStats.length;
        const colWidth = x.width / n;
        const bodyWidth = Math.max(3, Math.min(18, colWidth * 0.65));

        const splitY = yVolume ? yVolume.top : chartArea.bottom * 0.70;
        ctx.beginPath();
        ctx.strokeStyle = tokens.border || (isDark ? '#334155' : '#E2E8F0');
        ctx.lineWidth = 1;
        ctx.moveTo(chartArea.left, splitY);
        ctx.lineTo(chartArea.right, splitY);
        ctx.stroke();

        candleStats.forEach((d, idx) => {
          const xCenter = x.getPixelForValue(idx);
          const yOpen = yPrice.getPixelForValue(d.o);
          const yClose = yPrice.getPixelForValue(d.c);
          const yHigh = yPrice.getPixelForValue(d.h);
          const yLow = yPrice.getPixelForValue(d.l);

          const isBull = d.isBullish;
          const color = isBull ? bullColor : bearColor;

          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.moveTo(xCenter, yHigh);
          ctx.lineTo(xCenter, yLow);
          ctx.stroke();

          const yTop = Math.min(yOpen, yClose);
          const yHeight = Math.max(2, Math.abs(yClose - yOpen));

          ctx.fillStyle = isBull ? hexToRgba(color, 0.85) : color;
          ctx.fillRect(xCenter - bodyWidth / 2, yTop, bodyWidth, yHeight);
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(xCenter - bodyWidth / 2, yTop, bodyWidth, yHeight);
        });

        ctx.restore();
      }
    };

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            type: 'bar',
            label: 'Volume',
            yAxisID: 'yVolume',
            data: volumeList,
            backgroundColor: candleStats.map(d => hexToRgba(d.isBullish ? bullColor : bearColor, 0.35)),
            borderColor: candleStats.map(d => (d.isBullish ? bullColor : bearColor)),
            borderWidth: 1,
            borderRadius: 2,
            order: 3
          },
          {
            type: 'line',
            label: 'Volume MA (5j)',
            yAxisID: 'yVolume',
            data: vmaList,
            borderColor: vmaColor,
            borderWidth: 1.5,
            pointRadius: 0,
            tension: 0.3,
            order: 2
          },
          {
            type: 'line',
            label: 'Prix Clôture',
            yAxisID: 'yPrice',
            data: ohlcList.map(d => d.c),
            borderColor: 'transparent',
            pointRadius: 0,
            order: 1
          }
        ]
      },
      options: {
        ...defaultOpts,
        animation: getAccessibleAnimationOptions(tokens, { duration: 700, easing: 'easeOutCubic' }),
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          ...defaultOpts.plugins,
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: tokens.textPrimary,
              font: { family: tokens.fontFamily, size: 12 },
              filter: (item) => item.text !== 'Prix Clôture'
            }
          },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              title: (items) => `Date : ${items[0].label}`,
              label: (ctx) => {
                const idx = ctx.dataIndex;
                const d = ohlcList[idx];
                if (!d) return '';
                if (ctx.dataset.label === 'Volume') {
                  return `Volume : ${d.v.toLocaleString('fr-FR')} titres`;
                }
                if (ctx.dataset.label.includes('Volume MA')) {
                  return `VMA (5) : ${vmaList[idx].toLocaleString('fr-FR')} titres`;
                }
                return [
                  `Open : ${d.o.toFixed(2)} € | High : ${d.h.toFixed(2)} €`,
                  `Low  : ${d.l.toFixed(2)} € | Close : ${d.c.toFixed(2)} €`,
                  `Variation : ${d.c >= d.o ? '+' : ''}${((d.c - d.o) / d.o * 100).toFixed(2)}%`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            grid: { color: tokens.gridColor }
          },
          yPrice: {
            type: 'linear',
            position: 'left',
            weight: 2,
            min: Math.floor(priceMin - pricePad),
            max: Math.ceil(priceMax + pricePad),
            grid: { color: tokens.gridColor },
            ticks: {
              color: tokens.textSecondary,
              font: { family: tokens.fontMono }
            },
            title: {
              display: true,
              text: 'Cours (€)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          },
          yVolume: {
            type: 'linear',
            position: 'right',
            weight: 1,
            beginAtZero: true,
            max: Math.ceil(volMax * 3.5),
            grid: { display: false },
            ticks: {
              color: tokens.textMuted,
              font: { family: tokens.fontMono, size: 10 },
              callback: (val) => val > 0 && val <= volMax ? `${(val / 1000).toFixed(0)}k` : ''
            },
            title: {
              display: true,
              text: 'Volume',
              color: tokens.textMuted,
              font: { family: tokens.fontFamily, size: 11 }
            }
          }
        }
      },
      plugins: [candlestickPainterPlugin]
    };

    if (typeof Chart === 'undefined') return { config, candleStats, volumeList, vmaList, computeVolumeMA, computeCandleStats };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeVolumeMA,
    computeCandleStats
  };

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/05-evolution-temporelle/dual-axis-controlled
  // --------------------------------------------------------------------------
  global.KitCharts["dual-axis-controlled"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeBase100(series, baseIndex = 0) {
    if (!Array.isArray(series) || series.length === 0) return [];
    const baseVal = Number(series[baseIndex]) || series[0] || 1;
    return series.map(v => Math.round((Number(v) / baseVal) * 1000) / 10);
  }

  function computePearsonR(s1, s2) {
    const n = Math.min(s1.length, s2.length);
    if (n < 2) return 0;
    const m1 = s1.reduce((s, v) => s + v, 0) / n;
    const m2 = s2.reduce((s, v) => s + v, 0) / n;

    let num = 0, d1 = 0, d2 = 0;
    for (let i = 0; i < n; i++) {
      const diff1 = s1[i] - m1;
      const diff2 = s2[i] - m2;
      num += diff1 * diff2;
      d1 += diff1 * diff1;
      d2 += diff2 * diff2;
    }
    return (d1 > 0 && d2 > 0) ? Math.round((num / Math.sqrt(d1 * d2)) * 1000) / 1000 : 0;
  }

  function computeZeroAlignedBounds(s1, s2) {
    const max1 = Math.max(...s1, 10);
    const max2 = Math.max(...s2, 10);
    return {
      y1: { min: 0, max: Math.ceil(max1 * 1.15) },
      y2: { min: 0, max: Math.ceil(max2 * 1.15) }
    };
  }

  const DEFAULT_DATA = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Température Moyenne (°C)',
        yAxisID: 'y',
        data: [5.2, 6.8, 10.5, 14.2, 18.6, 22.4, 25.1, 24.8, 20.3, 15.1, 9.8, 6.0]
      },
      {
        label: 'Consommation Électrique (GWh)',
        yAxisID: 'y1',
        data: [850, 780, 620, 490, 420, 380, 410, 430, 470, 560, 720, 890]
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
    const showDataLabels = (customData && customData.showDataLabels !== undefined)
      ? customData.showDataLabels
      : (options.showDataLabels !== undefined ? options.showDataLabels : true);

    const rawData = customData || DEFAULT_DATA;
    const labels = rawData.labels || DEFAULT_DATA.labels;
    const s1 = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;
    const s2 = (rawData.datasets && rawData.datasets[1] && rawData.datasets[1].data) || DEFAULT_DATA.datasets[1].data;
    const label1 = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Série 1';
    const label2 = (rawData.datasets && rawData.datasets[1] && rawData.datasets[1].label) || 'Série 2';

    const pearsonR = computePearsonR(s1, s2);
    const bounds = computeZeroAlignedBounds(s1, s2);

    const color1 = getColor(tokens, 0);
    const color2 = getColor(tokens, 1);

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: label1,
            yAxisID: 'y',
            data: s1,
            borderColor: color1,
            backgroundColor: color1,
            borderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3,
            datalabels: {
              display: showDataLabels,
              color: color1,
              align: 'top',
              anchor: 'center',
              font: { weight: '600', size: 10 }
            }
          },
          {
            label: label2,
            yAxisID: 'y1',
            data: s2,
            borderColor: color2,
            backgroundColor: color2,
            borderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3,
            datalabels: {
              display: showDataLabels,
              color: color2,
              align: 'bottom',
              anchor: 'center',
              font: { weight: '600', size: 10 }
            }
          }
        ]
      },
      options: {
        ...defaultOpts,
        _kitChartsTokens: tokens,
        showDataLabels: showDataLabels,
        animation: getAccessibleAnimationOptions(tokens, { duration: 700, easing: 'easeOutCubic' }),
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          ...defaultOpts.plugins,
          datalabels: getDataLabelOptions(tokens, {
            display: showDataLabels,
            formatter: (v) => formatLabelValue(v)
          }),
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: tokens.textPrimary,
              font: { family: tokens.fontFamily, size: 12 }
            }
          },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              title: (items) => `Mois : ${items[0].label}`,
              afterBody: () => [`Corrélation de Pearson : r = ${pearsonR}`]
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            grid: { color: tokens.gridColor }
          },
          y: {
            type: 'linear',
            position: 'left',
            min: bounds.y1.min,
            max: bounds.y1.max,
            grid: { color: tokens.gridColor },
            ticks: {
              color: color1,
              font: { family: tokens.fontMono, weight: '600' }
            },
            title: {
              display: true,
              text: label1,
              color: color1,
              font: { family: tokens.fontFamily, size: 12, weight: '600' }
            }
          },
          y1: {
            type: 'linear',
            position: 'right',
            min: bounds.y2.min,
            max: bounds.y2.max,
            grid: { display: false },
            ticks: {
              color: color2,
              font: { family: tokens.fontMono, weight: '600' }
            },
            title: {
              display: true,
              text: label2,
              color: color2,
              font: { family: tokens.fontFamily, size: 12, weight: '600' }
            }
          }
        }
      }
    };

    if (typeof Chart === 'undefined') return Object.assign(config, { pearsonR, bounds, computeBase100, computePearsonR, computeZeroAlignedBounds });
    return new Chart(canvas, config);
  }

  function computeZScores(series) {
    if (!Array.isArray(series) || series.length === 0) return [];
    const n = series.length;
    if (n === 1) return [0];
    const mean = series.reduce((s, v) => s + v, 0) / n;
    const std = Math.sqrt(series.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / (n - 1)) || 1;
    return series.map(v => Math.round(((v - mean) / std) * 1000) / 1000);
  }

  function alignZeroScales(y1Min, y1Max, y2Min, y2Max) {
    const ratio1 = Math.abs(y1Min) / (y1Max - y1Min);
    const ratio2 = Math.abs(y2Min) / (y2Max - y2Min);
    const maxRatio = Math.max(ratio1, ratio2);

    let newY1Min = y1Min, newY1Max = y1Max;
    let newY2Min = y2Min, newY2Max = y2Max;

    if (y1Min < 0 && y1Max > 0 && y2Min < 0 && y2Max > 0) {
      newY1Min = -maxRatio * y1Max / (1 - maxRatio);
      newY2Min = -maxRatio * y2Max / (1 - maxRatio);
    }
    return {
      y1Min: newY1Min,
      y1Max: newY1Max,
      y2Min: newY2Min,
      y2Max: newY2Max
    };
  }

  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || function() { return {}; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || function() { return '#2B8CBE'; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || function() { return 'nominal'; };

  return {
    createChart,
    DEFAULT_DATA,
    computeBase100,
    computeBase100Index: computeBase100,
    computeZScores,
    computePearsonR,
    computeZeroAlignedBounds,
    alignZeroScales,
    getDataLabelOptions,
    formatLabelValue,
    getEmphasisStyle,
    getValenceColor,
    getThresholdStatus
  };

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/05-evolution-temporelle/line-chart
  // --------------------------------------------------------------------------
  global.KitCharts["line-chart"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function(t, r, o) { return { borderColor: '#2B8CBE', backgroundColor: '#2B8CBE', ...o }; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function(v, tr, th, p, t) { return {}; };
  const suggestScale = (KitChartsTheme && KitChartsTheme.suggestScale) || (typeof window !== 'undefined' && window.suggestScale) || function() { return 'linear'; };
  const getLogScaleOptions = (KitChartsTheme && KitChartsTheme.getLogScaleOptions) || (typeof window !== 'undefined' && window.getLogScaleOptions) || function() { return { type: 'logarithmic' }; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';


/**
 * @file 05-evolution-temporelle/line-chart/template.js
 * @description Standardized Line Chart template for kit-charts.
 * Visualizes continuous temporal progression of a single quantitative metric.
 * Respects Cleveland-McGill position encoding, semantic emphasis, and high Data-Ink ratio.
 */

/**
 * Données par défaut représentatives (Revenu Récurrent Mensuel MRR en k€)
 */
const DEFAULT_DATA = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
  datasets: [{
    label: 'Revenu Récurrent Mensuel (k€)',
    data: [124, 138, 145, 158, 165, 182, 195, 210, 218, 235, 252, 270],
    role: 'focal'
  }]
};

/**
 * Creates and renders a Line Chart in the specified canvas target.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - DOM Canvas ID or Canvas Element
 * @param {Object} [customData] - Optional user data payload
 * @param {string} [themeName='colorbrewer-accessible'] - Theme identifier
 * @returns {Object} Initialized Chart.js instance or mock instance
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string' && typeof document !== 'undefined'
    ? document.getElementById(canvasTarget)
    : canvasTarget;

  if (typeof Chart !== 'undefined' && canvas) {
    const existing = Chart.getChart(canvas);
    if (existing) {
      existing.destroy();
    }
  }

  const container = canvas && canvas.parentElement ? canvas.parentElement : null;
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';

  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];

  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const role = ds.role || (ds.forecast ? 'forecast' : (idx === 0 ? 'focal' : 'context'));
    const isForecast = role === 'forecast' || Boolean(ds.forecast);
    const alpha = ds.alpha ?? (isForecast ? (tokens.emphasis?.forecastAlpha || 0.5) : (isTufte ? 0.1 : 0.2));

    let baseColor = getColor(tokens, idx);
    if (ds.valence && ds.metricType) {
      baseColor = getValenceColor(tokens, ds.valence, ds.metricType);
    } else if (ds.valence) {
      baseColor = getValenceColor(tokens, ds.valence, 'gain');
    }

    const emphasisStyle = getEmphasisStyle(tokens, role, {
      fill: ds.fill ?? false,
      alpha,
      borderColor: ds.borderColor || (ds.valence ? baseColor : undefined),
      borderWidth: ds.borderWidth ?? (isTufte ? 1.5 : (role === 'focal' ? 2.5 : 1.5))
    });

    const border = ds.borderColor || emphasisStyle.borderColor || baseColor;
    const bg = ds.backgroundColor || (typeof emphasisStyle.backgroundColor === 'string'
      ? emphasisStyle.backgroundColor
      : hexToRgba(border, alpha));

    return {
      label: ds.label || `Série ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      borderColor: border,
      backgroundColor: bg,
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : emphasisStyle.borderWidth,
      borderDash: ds.borderDash || emphasisStyle.borderDash || (isForecast ? [5, 5] : []),
      tension: typeof ds.tension === 'number' ? ds.tension : 0.2,
      fill: ds.fill !== undefined ? ds.fill : false,
      pointRadius: typeof ds.pointRadius === 'number' ? ds.pointRadius : (emphasisStyle.pointRadius ?? (isTufte ? 2.5 : 3.5)),
      pointHoverRadius: 6,
      pointStyle: ds.pointStyle || emphasisStyle.pointStyle || (isForecast ? 'crossRot' : 'circle'),
      pointBackgroundColor: ds.pointBackgroundColor || emphasisStyle.pointBackgroundColor || border,
      pointBorderColor: ds.pointBorderColor || emphasisStyle.pointBorderColor || tokens.bg,
      pointBorderWidth: ds.pointBorderWidth ?? 1.5
    };
  });

  const chartData = { labels, datasets };
  const baseOptions = getChartDefaultOptions(tokens);
  const temporalOpts = getTemporalInteractionOptions(tokens, { mode: 'index', axis: 'x', hitRadius: 12, hoverRadius: 6 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 700, easing: 'easeOutCubic' });

  const isLogRequested = Boolean(options.logScale || (options.scales && options.scales.y && options.scales.y.type === 'logarithmic'));
  if (isLogRequested) {
    const allValues = (rawData.datasets || []).flatMap(ds => Array.isArray(ds.data) ? ds.data : []);
    if (allValues.some(v => typeof v === 'number' && v <= 0)) {
      throw new Error('kit-charts: log scale requires strictly positive values');
    }
  }

  const config = {
    type: 'line',
    data: chartData,
    options: {
      ...baseOptions,
      ...temporalOpts,
      animation: animOpts,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 6
          }
        },
        y: isLogRequested ? {
          ...getLogScaleOptions(tokens, typeof options.logScale === 'object' ? options.logScale : {}),
          border: { display: false }
        } : {
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 8,
            callback: (val) => {
              if (typeof val === 'number' && Math.abs(val) >= 1000) {
                return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
              }
              return val;
            }
          }
        }
      },

      plugins: {
        legend: {
          display: datasets.length > 1 && !isTufte,
          position: 'top',
          align: 'end',
          labels: {
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              size: 12,
              weight: '500'
            },
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
            padding: 14
          }
        },
        tooltip: {
          backgroundColor: tokens.tooltipBg,
          titleColor: tokens.tooltipText,
          bodyColor: tokens.tooltipText,
          borderColor: tokens.borderStrong,
          borderWidth: 1,
          padding: 10,
          cornerRadius: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '500'
          },
          callbacks: {
            label: (context) => {
              const val = context.parsed.y !== null && context.parsed.y !== undefined
                ? context.parsed.y
                : context.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val)
                : val;
              const isForecastDs = context.dataset.borderDash && context.dataset.borderDash.length > 0;
              const suffix = isForecastDs ? ' (Projection)' : '';
              return ` ${context.dataset.label || ''}: ${formatted}${suffix}`;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Headless test fallback mock
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/05-evolution-temporelle/multi-line-chart
  // --------------------------------------------------------------------------
  global.KitCharts["multi-line-chart"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function(t, r, o) { return { borderColor: '#2B8CBE', backgroundColor: '#2B8CBE', ...o }; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function(v, tr, th, p, t) { return {}; };
  const resolveSeriesBudget = (KitChartsTheme && KitChartsTheme.resolveSeriesBudget) || (typeof window !== 'undefined' && window.resolveSeriesBudget) || function(d) { return d; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 05-evolution-temporelle/multi-line-chart/template.js
 * @description Standardized Multi-Line Chart template for kit-charts.
 * Visualizes multi-series temporal evolution with Focus + Context principles (2-4 series max).
 * Rejects dual-Y distortion, provides grouped index tooltips, and strict semantic double-encoding.
 */

/**
 * Données par défaut représentatives (Comparaison de croissance de gammes de produits avec focus narratif)
 */
const DEFAULT_DATA = {
  labels: ['T1-23', 'T2-23', 'T3-23', 'T4-23', 'T1-24', 'T2-24', 'T3-24', 'T4-24'],
  datasets: [
    {
      label: 'Produit Cloud Platform (Hero)',
      data: [42, 58, 78, 105, 140, 185, 230, 290],
      role: 'focal'
    },
    {
      label: 'Produit Core Enterprise (Benchmark)',
      data: [130, 145, 155, 168, 180, 192, 205, 218],
      role: 'benchmark'
    },
    {
      label: 'Produit Legacy Desktop (Context)',
      data: [95, 90, 84, 76, 68, 58, 48, 38],
      role: 'context'
    }
  ]
};

/**
 * Creates and renders a Multi-Line Chart in the specified canvas target.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - DOM Canvas ID or Canvas Element
 * @param {Object} [customData] - Optional user data payload
 * @param {string} [themeName='colorbrewer-accessible'] - Theme identifier
 * @param {Object} [options={}] - Additional options (maxSeries, aggregateRemainder, budgetSeries)
 * @returns {Object} Initialized Chart.js instance or mock instance
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string' && typeof document !== 'undefined'
    ? document.getElementById(canvasTarget)
    : canvasTarget;

  if (typeof Chart !== 'undefined' && canvas) {
    const existing = Chart.getChart(canvas);
    if (existing) {
      existing.destroy();
    }
  }

  const container = canvas && canvas.parentElement ? canvas.parentElement : null;
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';

  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];
  const rawDatasets = rawData.datasets || [];

  const budgetedDatasets = (options.budgetSeries !== false && rawDatasets.length > (options.maxSeries || 7))
    ? resolveSeriesBudget(rawDatasets, {
        maxSeries: options.maxSeries || 7,
        aggregateRemainder: options.aggregateRemainder !== undefined ? options.aggregateRemainder : true,
        rankBy: options.rankBy || 'sum'
      })
    : rawDatasets;

  const datasets = budgetedDatasets.map((ds, idx) => {
    const defaultRole = idx === 0 ? 'focal' : (idx === 1 ? 'benchmark' : 'context');
    const role = ds.role || (ds.forecast ? 'forecast' : defaultRole);
    const isForecast = role === 'forecast' || Boolean(ds.forecast);


    let baseColor = getColor(tokens, idx);
    if (ds.valence && ds.metricType) {
      baseColor = getValenceColor(tokens, ds.valence, ds.metricType);
    } else if (ds.valence) {
      baseColor = getValenceColor(tokens, ds.valence, 'gain');
    }

    const emphasisStyle = getEmphasisStyle(tokens, role, {
      fill: ds.fill ?? false,
      alpha: ds.alpha,
      borderColor: ds.borderColor || (ds.valence ? baseColor : undefined),
      borderWidth: ds.borderWidth ?? (isTufte ? 1.5 : (role === 'focal' ? 3.0 : (role === 'benchmark' ? 2.0 : 1.5)))
    });

    const border = ds.borderColor || emphasisStyle.borderColor || baseColor;
    const bg = ds.backgroundColor || (typeof emphasisStyle.backgroundColor === 'string'
      ? emphasisStyle.backgroundColor
      : hexToRgba(border, 0.2));

    return {
      label: ds.label || `Série ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      borderColor: border,
      backgroundColor: bg,
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : emphasisStyle.borderWidth,
      borderDash: ds.borderDash || emphasisStyle.borderDash || (isForecast ? [5, 5] : (role === 'benchmark' ? [4, 4] : [])),
      tension: typeof ds.tension === 'number' ? ds.tension : 0.25,
      fill: ds.fill !== undefined ? ds.fill : false,
      pointRadius: typeof ds.pointRadius === 'number' ? ds.pointRadius : (emphasisStyle.pointRadius ?? (role === 'focal' ? 4 : (role === 'benchmark' ? 3 : 2))),
      pointHoverRadius: 6,
      pointStyle: ds.pointStyle || emphasisStyle.pointStyle || (isForecast ? 'crossRot' : (role === 'benchmark' ? 'rectRot' : 'circle')),
      pointBackgroundColor: ds.pointBackgroundColor || emphasisStyle.pointBackgroundColor || border,
      pointBorderColor: ds.pointBorderColor || emphasisStyle.pointBorderColor || tokens.bg,
      pointBorderWidth: ds.pointBorderWidth ?? 1.5
    };
  });

  const chartData = { labels, datasets };
  const baseOptions = getChartDefaultOptions(tokens);
  const temporalOpts = getTemporalInteractionOptions(tokens, { mode: 'index', axis: 'x', hitRadius: 12, hoverRadius: 6 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 700, easing: 'easeOutCubic' });

  const config = {
    type: 'line',
    data: chartData,
    options: {
      ...baseOptions,
      ...temporalOpts,
      animation: animOpts,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 6
          }
        },
        y: {
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 8,
            callback: (val) => {
              if (typeof val === 'number' && Math.abs(val) >= 1000) {
                return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
              }
              return val;
            }
          }
        }
      },
      plugins: {
        legend: {
          display: !isTufte,
          position: 'top',
          align: 'end',
          labels: {
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              size: 12,
              weight: '500'
            },
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
            padding: 14,
            generateLabels: (chart) => (chart.data.datasets || []).map((ds, i) => {
              const c = (typeof ds.borderColor === 'string')
                ? ds.borderColor
                : (Array.isArray(ds.borderColor) ? ds.borderColor[0] : (ds.backgroundColor || '#9CA3AF'));
              return {
                text: ds.label || ('Série ' + (i + 1)),
                fillStyle: c,
                strokeStyle: c,
                lineWidth: 2,
                pointStyle: 'line',
                hidden: !chart.isDatasetVisible(i),
                index: i
              };
            })
          }
        },
        tooltip: {
          backgroundColor: tokens.tooltipBg,
          titleColor: tokens.tooltipText,
          bodyColor: tokens.tooltipText,
          borderColor: tokens.borderStrong,
          borderWidth: 1,
          padding: 10,
          cornerRadius: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '500'
          },
          callbacks: {
            label: (context) => {
              const val = context.parsed.y !== null && context.parsed.y !== undefined
                ? context.parsed.y
                : context.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val)
                : val;
              const roleTag = context.dataset.borderDash && context.dataset.borderDash.length > 0 ? ' [Tirets]' : '';
              return ` ${context.dataset.label || ''}: ${formatted}${roleTag}`;
            }
          }
        }
      }
    }
  };

  const budgetInfo = budgetedDatasets.__budget;

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    const chartInstance = new Chart(canvas, config);
    chartInstance.$kitBudget = budgetInfo;
    return chartInstance;
  }

  // Headless test fallback mock
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    $kitBudget: budgetInfo,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/05-evolution-temporelle/price-indicator-overlays
  // --------------------------------------------------------------------------
  global.KitCharts["price-indicator-overlays"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return o || {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeSMA(prices, period = 20) {
    if (!Array.isArray(prices)) return [];
    return prices.map((val, idx, arr) => {
      if (idx < period - 1) {
        const slice = arr.slice(0, idx + 1);
        return Math.round((slice.reduce((s, v) => s + v, 0) / slice.length) * 100) / 100;
      }
      const slice = arr.slice(idx - period + 1, idx + 1);
      return Math.round((slice.reduce((s, v) => s + v, 0) / period) * 100) / 100;
    });
  }

  function computeEMA(prices, period = 50) {
    if (!Array.isArray(prices) || prices.length === 0) return [];
    const k = 2 / (period + 1);
    const ema = [prices[0]];
    for (let i = 1; i < prices.length; i++) {
      ema.push(Math.round((prices[i] * k + ema[i - 1] * (1 - k)) * 100) / 100);
    }
    return ema;
  }

  function computeBollingerBands(prices, period = 20, k = 2) {
    const sma = computeSMA(prices, period);
    const upper = [];
    const lower = [];

    prices.forEach((val, idx, arr) => {
      const start = Math.max(0, idx - period + 1);
      const slice = arr.slice(start, idx + 1);
      const mean = sma[idx];
      const variance = slice.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / slice.length;
      const sigma = Math.sqrt(variance);

      upper.push(Math.round((mean + k * sigma) * 100) / 100);
      lower.push(Math.round((mean - k * sigma) * 100) / 100);
    });

    return { sma, upper, lower };
  }

  const DEFAULT_DATA = {
    labels: [
      'J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'J10',
      'J11', 'J12', 'J13', 'J14', 'J15', 'J16', 'J17', 'J18', 'J19', 'J20',
      'J21', 'J22', 'J23', 'J24', 'J25', 'J26', 'J27', 'J28', 'J29', 'J30'
    ],
    datasets: [{
      label: 'Indice Synthétique (€)',
      data: [
        100, 102, 101, 104, 106, 105, 108, 110, 109, 112,
        115, 114, 116, 118, 120, 119, 122, 125, 124, 126,
        128, 127, 130, 133, 132, 135, 137, 136, 139, 142
      ]
    }]
  };

  function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
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

    const rawData = customData || DEFAULT_DATA;
    const labels = rawData.labels || DEFAULT_DATA.labels;
    const prices = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;
    const seriesLabel = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].label) || 'Prix Clôture';

    const bollinger = computeBollingerBands(prices, 10, 2);

    const priceColor = tokens.emphasis?.focal || tokens.palette?.[0] || '#2B8CBE';
    const smaColor = tokens.palette?.[1] || '#E66101';
    const bandColor = tokens.emphasis?.context || (isDark ? '#4C566A' : '#CBD5E1');

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: seriesLabel,
            data: prices,
            borderColor: priceColor,
            backgroundColor: priceColor,
            borderWidth: 2.5,
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.2,
            order: 1
          },
          {
            label: 'Moyenne Mobile (SMA 10)',
            data: bollinger.sma,
            borderColor: smaColor,
            borderWidth: 1.5,
            borderDash: [3, 3],
            pointRadius: 0,
            tension: 0.3,
            order: 2
          },
          {
            label: 'Bollinger Supérieure (+2σ)',
            data: bollinger.upper,
            borderColor: hexToRgba(bandColor, 0.60),
            borderWidth: 1,
            pointRadius: 0,
            fill: '+1',
            backgroundColor: hexToRgba(bandColor, isDark ? 0.18 : 0.10),
            tension: 0.3,
            order: 3
          },
          {
            label: 'Bollinger Inférieure (-2σ)',
            data: bollinger.lower,
            borderColor: hexToRgba(bandColor, 0.60),
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
            tension: 0.3,
            order: 3
          }
        ]
      },
      options: {
        ...defaultOpts,
        animation: getAccessibleAnimationOptions(tokens, { duration: 700, easing: 'easeOutCubic' }),
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          ...defaultOpts.plugins,
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: tokens.textPrimary,
              font: { family: tokens.fontFamily, size: 12 },
              filter: (item) => !item.text.includes('Inférieure')
            }
          },
          tooltip: {
            ...defaultOpts.plugins.tooltip,
            callbacks: {
              title: (items) => `Jour : ${items[0].label}`,
              label: (ctx) => {
                return `${ctx.dataset.label} : ${ctx.parsed.y.toFixed(2)} €`;
              }
            }
          }
        },
        scales: {
          x: {
            ...defaultOpts.scales.x,
            grid: { color: tokens.gridColor }
          },
          y: {
            ...defaultOpts.scales.y,
            beginAtZero: false,
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Valeur (€)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      }
    };

    if (typeof Chart === 'undefined') return { config, bollinger, computeSMA, computeEMA, computeBollingerBands };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeSMA,
    computeEMA,
    computeBollingerBands
  };

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/05-evolution-temporelle/sparkline
  // --------------------------------------------------------------------------
  global.KitCharts["sparkline"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function(t, r, o) { return { borderColor: '#2B8CBE', backgroundColor: '#2B8CBE', ...o }; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function(v, tr, th, p, t) { return {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 05-evolution-temporelle/sparkline/template.js
 * @description Standardized Sparkline template for kit-charts.
 * Ultra-compact, high Data-Ink micro trendline designed for executive KPI scorecards.
 * Eliminates axis chrome and legends to maximize cognitive signal density (Edward Tufte).
 */

/**
 * Données par défaut représentatives (Micro-tendance de taux de conversion en %)
 */
const DEFAULT_DATA = {
  labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  datasets: [{
    label: 'Taux de Conversion (%)',
    data: [3.2, 3.4, 3.1, 3.6, 3.8, 3.5, 4.0, 4.2, 3.9, 4.5, 4.8, 5.2],
    role: 'focal'
  }]
};

/**
 * Creates and renders a Sparkline in the specified canvas target.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - DOM Canvas ID or Canvas Element
 * @param {Object} [customData] - Optional user data payload
 * @param {string} [themeName='colorbrewer-accessible'] - Theme identifier
 * @returns {Object} Initialized Chart.js instance or mock instance
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string' && typeof document !== 'undefined'
    ? document.getElementById(canvasTarget)
    : canvasTarget;

  if (typeof Chart !== 'undefined' && canvas) {
    const existing = Chart.getChart(canvas);
    if (existing) {
      existing.destroy();
    }
  }

  const container = canvas && canvas.parentElement ? canvas.parentElement : null;
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';

  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];

  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const role = ds.role || (ds.forecast ? 'forecast' : 'focal');
    const isForecast = role === 'forecast' || Boolean(ds.forecast);

    let baseColor = getColor(tokens, idx);
    if (ds.valence && ds.metricType) {
      baseColor = getValenceColor(tokens, ds.valence, ds.metricType);
    } else if (ds.valence) {
      baseColor = getValenceColor(tokens, ds.valence, 'gain');
    }

    const emphasisStyle = getEmphasisStyle(tokens, role, {
      fill: ds.fill ?? false,
      alpha: ds.alpha,
      borderColor: ds.borderColor || (ds.valence ? baseColor : undefined),
      borderWidth: ds.borderWidth ?? (isTufte ? 1.5 : 2.0)
    });

    const border = ds.borderColor || emphasisStyle.borderColor || baseColor;
    const bg = ds.backgroundColor || (typeof emphasisStyle.backgroundColor === 'string'
      ? emphasisStyle.backgroundColor
      : hexToRgba(border, 0.15));

    return {
      label: ds.label || `Série ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      borderColor: border,
      backgroundColor: bg,
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : emphasisStyle.borderWidth,
      borderDash: ds.borderDash || emphasisStyle.borderDash || (isForecast ? [4, 4] : []),
      tension: typeof ds.tension === 'number' ? ds.tension : 0.25,
      fill: ds.fill !== undefined ? ds.fill : false,
      pointRadius: typeof ds.pointRadius === 'number' ? ds.pointRadius : (ctx) => {
        const count = ctx.chart?.data?.datasets?.[idx]?.data?.length || 12;
        return ctx.dataIndex === count - 1 ? 4 : 0;
      },
      pointHoverRadius: 5,
      pointStyle: ds.pointStyle || emphasisStyle.pointStyle || (isForecast ? 'crossRot' : 'circle'),
      pointBackgroundColor: ds.pointBackgroundColor || emphasisStyle.pointBackgroundColor || border,
      pointBorderColor: ds.pointBorderColor || emphasisStyle.pointBorderColor || tokens.bg,
      pointBorderWidth: ds.pointBorderWidth ?? 1.5
    };
  });

  const chartData = { labels, datasets };
  const baseOptions = getChartDefaultOptions(tokens);
  const temporalOpts = getTemporalInteractionOptions(tokens, { mode: 'index', axis: 'x', hitRadius: 10, hoverRadius: 5 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 550, easing: 'easeOutCubic' });

  const config = {
    type: 'line',
    data: chartData,
    options: {
      ...baseOptions,
      ...temporalOpts,
      animation: animOpts,
      responsive: true,
      maintainAspectRatio: false,
      events: ['mousemove', 'mouseout', 'touchstart', 'touchmove'],
      layout: {
        padding: { top: 4, bottom: 4, left: 2, right: 6 }
      },
      scales: {
        x: {
          display: false,
          grid: { display: false },
          border: { display: false }
        },
        y: {
          display: false,
          grid: { display: false },
          border: { display: false }
        }
      },
      plugins: {
        legend: {
          display: false // Sparkline rule: zero legend clutter
        },
        tooltip: {
          backgroundColor: tokens.tooltipBg,
          titleColor: tokens.tooltipText,
          bodyColor: tokens.tooltipText,
          borderColor: tokens.borderStrong,
          borderWidth: 1,
          padding: 8,
          cornerRadius: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 11,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 11,
            weight: '500'
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Headless test fallback mock
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/05-evolution-temporelle/stacked-area-chart
  // --------------------------------------------------------------------------
  global.KitCharts["stacked-area-chart"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function(t, r, o) { return { borderColor: '#2B8CBE', backgroundColor: '#2B8CBE', ...o }; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function(v, tr, th, p, t) { return {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 05-evolution-temporelle/stacked-area-chart/template.js
 * @description Standardized Stacked Area Chart template for kit-charts.
 * Visualizes cumulative multi-part composition over continuous time.
 * Enforces strict Y=0 baseline origin, stacked scale configuration, and semantic emphasis tokens.
 */

/**
 * Données par défaut représentatives (Évolution du mix énergétique renouvelable en TWh)
 */
const DEFAULT_DATA = {
  labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
  datasets: [
    {
      label: 'Éolien',
      data: [45, 55, 68, 85, 105, 130],
      role: 'focal'
    },
    {
      label: 'Solaire',
      data: [25, 38, 54, 75, 100, 135],
      role: 'focal'
    },
    {
      label: 'Hydroélectrique',
      data: [60, 62, 58, 64, 60, 63],
      role: 'context'
    }
  ]
};

/**
 * Creates and renders a Stacked Area Chart in the specified canvas target.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - DOM Canvas ID or Canvas Element
 * @param {Object} [customData] - Optional user data payload
 * @param {string} [themeName='colorbrewer-accessible'] - Theme identifier
 * @returns {Object} Initialized Chart.js instance or mock instance
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string' && typeof document !== 'undefined'
    ? document.getElementById(canvasTarget)
    : canvasTarget;

  if (typeof Chart !== 'undefined' && canvas) {
    const existing = Chart.getChart(canvas);
    if (existing) {
      existing.destroy();
    }
  }

  const container = canvas && canvas.parentElement ? canvas.parentElement : null;
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';

  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];

  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const role = ds.role || (ds.forecast ? 'forecast' : 'focal');
    const isForecast = role === 'forecast' || Boolean(ds.forecast);
    const alpha = ds.alpha ?? (isForecast ? (tokens.emphasis?.forecastAlpha || 0.4) : (isTufte ? 0.4 : 0.65));

    let baseColor = getColor(tokens, idx);
    if (ds.valence && ds.metricType) {
      baseColor = getValenceColor(tokens, ds.valence, ds.metricType);
    } else if (ds.valence) {
      baseColor = getValenceColor(tokens, ds.valence, 'gain');
    }

    const emphasisStyle = getEmphasisStyle(tokens, role, {
      fill: true,
      alpha,
      borderColor: ds.borderColor || (ds.valence ? baseColor : undefined),
      borderWidth: ds.borderWidth ?? (isTufte ? 1.5 : 2.0)
    });

    const border = ds.borderColor || emphasisStyle.borderColor || baseColor;
    const bg = ds.backgroundColor || hexToRgba(border, alpha);

    return {
      label: ds.label || `Série ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      borderColor: border,
      backgroundColor: bg,
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : emphasisStyle.borderWidth,
      borderDash: ds.borderDash || emphasisStyle.borderDash || (isForecast ? [5, 5] : []),
      tension: typeof ds.tension === 'number' ? ds.tension : 0.3,
      fill: ds.fill !== undefined ? ds.fill : true,
      pointRadius: typeof ds.pointRadius === 'number' ? ds.pointRadius : 0,
      pointHoverRadius: 5,
      pointStyle: ds.pointStyle || emphasisStyle.pointStyle || (isForecast ? 'crossRot' : 'circle'),
      pointBackgroundColor: ds.pointBackgroundColor || border,
      pointBorderColor: ds.pointBorderColor || emphasisStyle.pointBorderColor || tokens.bg
    };
  });

  const chartData = { labels, datasets };
  const baseOptions = getChartDefaultOptions(tokens);
  const temporalOpts = getTemporalInteractionOptions(tokens, { mode: 'index', axis: 'x', hitRadius: 12, hoverRadius: 6 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 700, easing: 'easeOutCubic' });

  const config = {
    type: 'line',
    data: chartData,
    options: {
      ...baseOptions,
      ...temporalOpts,
      animation: animOpts,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 6
          }
        },
        y: {
          stacked: true,
          beginAtZero: true, // Strict psychophysical mandate for stacked area charts
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 8,
            callback: (val) => {
              if (typeof val === 'number' && Math.abs(val) >= 1000) {
                return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(val);
              }
              return val;
            }
          }
        }
      },
      plugins: {
        legend: {
          display: true && !isTufte,
          position: 'top',
          align: 'end',
          labels: {
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              size: 12,
              weight: '500'
            },
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
            padding: 14,
            generateLabels: (chart) => (chart.data.datasets || []).map((ds, i) => {
              const c = (typeof ds.borderColor === 'string')
                ? ds.borderColor
                : (Array.isArray(ds.borderColor) ? ds.borderColor[0] : (ds.backgroundColor || '#9CA3AF'));
              return {
                text: ds.label || ('Série ' + (i + 1)),
                fillStyle: c,
                strokeStyle: c,
                lineWidth: 2,
                pointStyle: 'line',
                hidden: !chart.isDatasetVisible(i),
                index: i
              };
            })
          }
        },
        tooltip: {
          backgroundColor: tokens.tooltipBg,
          titleColor: tokens.tooltipText,
          bodyColor: tokens.tooltipText,
          borderColor: tokens.borderStrong,
          borderWidth: 1,
          padding: 10,
          cornerRadius: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '500'
          },
          callbacks: {
            label: (context) => {
              const val = context.parsed.y !== null && context.parsed.y !== undefined
                ? context.parsed.y
                : context.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(val)
                : val;
              const isForecastDs = context.dataset.borderDash && context.dataset.borderDash.length > 0;
              const suffix = isForecastDs ? ' (Projection)' : '';
              return ` ${context.dataset.label || ''}: ${formatted}${suffix}`;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Headless test fallback mock
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/05-evolution-temporelle/streamgraph
  // --------------------------------------------------------------------------
  global.KitCharts["streamgraph"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function(t, r, o) { return { borderColor: '#2B8CBE', backgroundColor: '#2B8CBE', ...o }; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function(v, tr, th, p, t) { return {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function(t, o) { return {}; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return {}; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 05-evolution-temporelle/streamgraph/template.js
 * @description Standardized Streamgraph template for kit-charts.
 * Visualizes qualitative shifts in thematic volume over continuous time using organic, fluid splines.
 * Employs smooth Bézier tension (0.4), stacked area layers, and semantic emphasis tokens.
 */

/**
 * Données par défaut représentatives (Mentions thématiques dans les médias au fil du temps)
 */
const DEFAULT_DATA = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct'],
  datasets: [
    {
      label: 'Intelligence Artificielle',
      data: [20, 32, 45, 68, 92, 115, 130, 142, 160, 175],
      role: 'focal'
    },
    {
      label: 'Cybersécurité & Privacy',
      data: [45, 50, 48, 55, 62, 70, 75, 80, 82, 85],
      role: 'context'
    },
    {
      label: 'Cloud & DevOps',
      data: [60, 58, 55, 52, 48, 45, 42, 40, 38, 35],
      role: 'context'
    },
    {
      label: 'Blockchain & Web3',
      data: [35, 42, 38, 25, 20, 18, 15, 12, 10, 8],
      role: 'context'
    }
  ]
};

/**
 * Creates and renders a Streamgraph in the specified canvas target.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - DOM Canvas ID or Canvas Element
 * @param {Object} [customData] - Optional user data payload
 * @param {string} [themeName='colorbrewer-accessible'] - Theme identifier
 * @returns {Object} Initialized Chart.js instance or mock instance
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string' && typeof document !== 'undefined'
    ? document.getElementById(canvasTarget)
    : canvasTarget;

  if (typeof Chart !== 'undefined' && canvas) {
    const existing = Chart.getChart(canvas);
    if (existing) {
      existing.destroy();
    }
  }

  const container = canvas && canvas.parentElement ? canvas.parentElement : null;
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';

  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];

  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const role = ds.role || (ds.forecast ? 'forecast' : (idx === 0 ? 'focal' : 'context'));
    const isForecast = role === 'forecast' || Boolean(ds.forecast);
    const alpha = ds.alpha ?? (isForecast ? (tokens.emphasis?.forecastAlpha || 0.4) : (isTufte ? 0.4 : 0.65));

    let baseColor = getColor(tokens, idx);
    if (ds.valence && ds.metricType) {
      baseColor = getValenceColor(tokens, ds.valence, ds.metricType);
    } else if (ds.valence) {
      baseColor = getValenceColor(tokens, ds.valence, 'gain');
    }

    const emphasisStyle = getEmphasisStyle(tokens, role, {
      fill: true,
      alpha,
      borderColor: ds.borderColor || (ds.valence ? baseColor : undefined),
      borderWidth: ds.borderWidth ?? (isTufte ? 1.0 : (role === 'focal' ? 2.0 : 1.0))
    });

    const border = ds.borderColor || emphasisStyle.borderColor || baseColor;
    const bg = ds.backgroundColor || (typeof emphasisStyle.backgroundColor === 'string'
      ? emphasisStyle.backgroundColor
      : hexToRgba(border, alpha));

    return {
      label: ds.label || `Série ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      borderColor: border,
      backgroundColor: bg,
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : emphasisStyle.borderWidth,
      borderDash: ds.borderDash || emphasisStyle.borderDash || (isForecast ? [5, 5] : []),
      fill: ds.fill !== undefined ? ds.fill : true,
      tension: typeof ds.tension === 'number' ? ds.tension : 0.4,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointStyle: ds.pointStyle || emphasisStyle.pointStyle || (isForecast ? 'crossRot' : 'circle'),
      pointBackgroundColor: border,
      pointBorderColor: tokens.bg
    };
  });

  const chartData = { labels, datasets };
  const baseOptions = getChartDefaultOptions(tokens);
  const temporalOpts = getTemporalInteractionOptions(tokens, { mode: 'index', axis: 'x', hitRadius: 12, hoverRadius: 6 });
  const animOpts = getAccessibleAnimationOptions(tokens, { duration: 700, easing: 'easeOutCubic' });

  const config = {
    type: 'line',
    data: chartData,
    options: {
      ...baseOptions,
      ...temporalOpts,
      animation: animOpts,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 6
          }
        },
        y: {
          stacked: true,
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 8
          }
        }
      },
      plugins: {
        legend: {
          display: true && !isTufte,
          position: 'top',
          align: 'end',
          labels: {
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              size: 12,
              weight: '500'
            },
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
            padding: 14
          }
        },
        tooltip: {
          backgroundColor: tokens.tooltipBg,
          titleColor: tokens.tooltipText,
          bodyColor: tokens.tooltipText,
          borderColor: tokens.borderStrong,
          borderWidth: 1,
          padding: 10,
          cornerRadius: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '500'
          },
          callbacks: {
            label: (context) => {
              const val = context.parsed.y !== null && context.parsed.y !== undefined
                ? context.parsed.y
                : context.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(val)
                : val;
              const isForecastDs = context.dataset.borderDash && context.dataset.borderDash.length > 0;
              const suffix = isForecastDs ? ' (Projection)' : '';
              return ` ${context.dataset.label || ''}: ${formatted}${suffix}`;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Headless test fallback mock
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/06-flux-processus/alluvial-diagram
  // --------------------------------------------------------------------------
  global.KitCharts["alluvial-diagram"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function(t, r, o) { return { borderColor: '#2B8CBE', backgroundColor: '#2B8CBE', ...o }; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function(v, tr, th, p, t) { return {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function() { return {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function() { return {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function() { return {}; };
  const getExecutiveModeOptions = (KitChartsTheme && KitChartsTheme.getExecutiveModeOptions) || (typeof window !== 'undefined' && window.getExecutiveModeOptions) || function() { return {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 06-flux-processus/alluvial-diagram/template.js
 * @description Standardized Alluvial Diagram template for kit-charts.
 * Visualizes multi-stage categorical cohort migrations and redistributions across discrete states.
 * Employs chartjs-chart-sankey plugin, flow conservation, dynamic theme tokens, and semantic valence ribbons.
 */

/**
 * Données par défaut représentatives (Parcours & Migration des Cohortes Utilisateurs avec valence métier)
 */
const DEFAULT_DATA = {
  datasets: [{
    label: 'Parcours & Migration des Cohortes Utilisateurs',
    data: [
      { from: 'Acquisition Organique', to: 'Plan Gratuit', flow: 600, valence: 'neutral' },
      { from: 'Acquisition Organique', to: 'Plan Pro', flow: 250, valence: 'positive' },
      { from: 'Acquisition Payante (Ads)', to: 'Plan Gratuit', flow: 400, valence: 'neutral' },
      { from: 'Acquisition Payante (Ads)', to: 'Plan Pro', flow: 450, valence: 'positive' },
      { from: 'Plan Gratuit', to: 'Désabonné (Churn)', flow: 350, valence: 'negative' },
      { from: 'Plan Gratuit', to: 'Plan Pro (Upgrade)', flow: 450, valence: 'positive' },
      { from: 'Plan Gratuit', to: 'Plan Gratuit (Actif)', flow: 200, valence: 'neutral' },
      { from: 'Plan Pro', to: 'Plan Entreprise (Expansion)', flow: 280, valence: 'positive' },
      { from: 'Plan Pro', to: 'Plan Pro (Renouvelé)', flow: 360, valence: 'positive' },
      { from: 'Plan Pro', to: 'Désabonné (Churn)', flow: 60, valence: 'negative' }
    ]
  }]
};

/**
 * Creates and renders an Alluvial Diagram in the specified canvas target.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - DOM Canvas ID or Canvas Element
 * @param {Object} [customData] - Optional user data payload
 * @param {string} [themeName='colorbrewer-accessible'] - Theme identifier
 * @returns {Object} Initialized Chart.js instance or mock instance
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string' && typeof document !== 'undefined'
    ? document.getElementById(canvasTarget)
    : canvasTarget;

  if (typeof Chart !== 'undefined' && canvas) {
    const existing = Chart.getChart(canvas);
    if (existing) {
      existing.destroy();
    }
  }

  const container = canvas && canvas.parentElement ? canvas.parentElement : null;
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const reduceMotion = isReducedMotionPreferred();

  const rawData = customData || DEFAULT_DATA;
  const rawDatasets = rawData.datasets || [];

  const datasets = rawDatasets.map((ds, dsIdx) => {
    const flowData = Array.isArray(ds.data) ? ds.data : [];

    const defaultColorFrom = (ctx) => {
      const palette = tokens.palette || ['#2B8CBE', '#E66101', '#5E3C99', '#4DAC26'];
      const item = ctx.dataset?.data?.[ctx.dataIndex];
      if (item && item.valence) {
        if (item.valence === 'positive' || item.valence === 'gain') return getValenceColor(tokens, 'up', 'gain');
        if (item.valence === 'negative' || item.valence === 'churn') return getValenceColor(tokens, 'down', 'gain');
      }
      const fromNode = item?.from || '';
      let hash = 0;
      for (let i = 0; i < fromNode.length; i++) hash += fromNode.charCodeAt(i);
      return palette[Math.abs(hash) % palette.length];
    };

    const defaultColorTo = (ctx) => {
      const palette = tokens.palette || ['#2B8CBE', '#E66101', '#5E3C99', '#4DAC26'];
      const item = ctx.dataset?.data?.[ctx.dataIndex];
      if (item && item.valence) {
        if (item.valence === 'positive' || item.valence === 'gain') return getValenceColor(tokens, 'up', 'gain');
        if (item.valence === 'negative' || item.valence === 'churn') return getValenceColor(tokens, 'down', 'gain');
      }
      const toNode = item?.to || '';
      let hash = 0;
      for (let i = 0; i < toNode.length; i++) hash += toNode.charCodeAt(i);
      return palette[Math.abs(hash) % palette.length];
    };

    return {
      label: ds.label || `Flux ${dsIdx + 1}`,
      data: flowData,
      colorFrom: ds.colorFrom || defaultColorFrom,
      colorTo: ds.colorTo || defaultColorTo,
      colorMode: ds.colorMode || 'gradient',
      borderWidth: ds.borderWidth ?? 0,
      nodeWidth: ds.nodeWidth ?? 16,
      nodePadding: ds.nodePadding ?? 18,
      backgroundColor: ds.backgroundColor || getColor(tokens, dsIdx)
    };
  });

  const chartData = { datasets };
  const baseOptions = getChartDefaultOptions(tokens);

  const config = {
    type: 'sankey',
    data: chartData,
    options: {
      scales: {},
      ...baseOptions,
      responsive: true,
      maintainAspectRatio: false,
      animation: getAccessibleAnimationOptions(tokens, {
        duration: (isTufte || reduceMotion) ? 0 : 450,
        easing: 'easeOutQuart'
      }),
      interaction: {
        mode: 'nearest',
        intersect: true
      },
      hover: {
        mode: 'nearest',
        intersect: true,
        animationDuration: (isTufte || reduceMotion) ? 0 : 100
      },
      layout: {
        padding: { top: 16, bottom: 16, left: 16, right: 16 }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: tokens.tooltipBg || '#0F172A',
          titleColor: tokens.tooltipText || '#F8FAFC',
          bodyColor: tokens.tooltipText || '#F8FAFC',
          borderColor: tokens.borderStrong || tokens.border || '#334155',
          borderWidth: 1,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          boxPadding: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '400'
          },
          callbacks: {
            label: (ctx) => {
              const item = ctx.raw;
              if (!item) return '';
              const valTag = item.valence === 'positive' ? ' (Favorable / Progression)' : (item.valence === 'negative' ? ' (Alerte / Churn)' : '');
              const formattedFlow = typeof item.flow === 'number' ? item.flow.toLocaleString('fr-FR') : item.flow;
              return ` ${item.from} → ${item.to} : ${formattedFlow} utilisateurs${valTag}`;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Headless test fallback mock
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/06-flux-processus/chord-diagram
  // --------------------------------------------------------------------------
  global.KitCharts["chord-diagram"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function(t, r, o) { return { borderColor: '#2B8CBE', backgroundColor: '#2B8CBE', ...o }; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function(v, tr, th, p, t) { return {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function() { return {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function() { return {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function() { return {}; };
  const getExecutiveModeOptions = (KitChartsTheme && KitChartsTheme.getExecutiveModeOptions) || (typeof window !== 'undefined' && window.getExecutiveModeOptions) || function() { return {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 06-flux-processus/chord-diagram/template.js
 * @description Standardized Chord Diagram / Circular Matrix Flow template for kit-charts.
 * Visualizes bilateral inter-entity quantitative exchanges around a circular radial topology.
 * Employs circular matrix projection, dynamic theme palette tokens, semantic emphasis, and tabular numeric tooltips.
 */

/**
 * Données par défaut représentatives (Matrice de flux économiques inter-régionaux avec entité focale)
 */
const DEFAULT_DATA = {
  labels: ['Région Nord (Focal)', 'Région Sud', 'Région Est', 'Région Ouest'],
  datasets: [
    {
      label: 'Flux Émis — Nord (Focal)',
      data: [0, 25, 18, 12],
      role: 'focal'
    },
    {
      label: 'Flux Émis — Sud',
      data: [20, 0, 15, 30],
      role: 'context'
    },
    {
      label: 'Flux Émis — Est',
      data: [14, 16, 0, 22],
      role: 'context'
    },
    {
      label: 'Flux Émis — Ouest',
      data: [10, 28, 20, 0],
      role: 'context'
    }
  ]
};

/**
 * Creates and renders a Chord Diagram (Radial Matrix Flow) in the specified canvas target.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - DOM Canvas ID or Canvas Element
 * @param {Object} [customData] - Optional user data payload
 * @param {string} [themeName='colorbrewer-accessible'] - Theme identifier
 * @returns {Object} Initialized Chart.js instance or mock instance
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string' && typeof document !== 'undefined'
    ? document.getElementById(canvasTarget)
    : canvasTarget;

  if (typeof Chart !== 'undefined' && canvas) {
    const existing = Chart.getChart(canvas);
    if (existing) {
      existing.destroy();
    }
  }

  const container = canvas && canvas.parentElement ? canvas.parentElement : null;
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const reduceMotion = isReducedMotionPreferred();

  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels || ['Région Nord', 'Région Sud', 'Région Est', 'Région Ouest'];

  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const role = ds.role || (idx === 0 ? 'focal' : 'context');
    const isFocal = role === 'focal';

    let baseColor = getColor(tokens, idx);
    if (ds.valence && ds.metricType) {
      baseColor = getValenceColor(tokens, ds.valence, ds.metricType);
    }

    const cleanData = Array.isArray(ds.data)
      ? ds.data.map(d => typeof d === 'object' && d !== null ? (d.value ?? d.flow ?? d.v ?? 10) : Number(d) || 0)
      : [10, 20, 15, 25];

    const alpha = ds.alpha ?? (isTufte ? 0.15 : (isFocal ? 0.35 : 0.18));
    const border = ds.borderColor || (isFocal ? (tokens.emphasis?.focal || baseColor) : baseColor);
    const bg = ds.backgroundColor || hexToRgba(border, alpha);

    return {
      label: ds.label || `Flux Émis — ${labels[idx] || `Entité ${idx + 1}`}`,
      data: cleanData,
      borderColor: border,
      backgroundColor: bg,
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : (isFocal ? 2.5 : 1.5),
      fill: ds.fill ?? true,
      pointRadius: typeof ds.pointRadius === 'number' ? ds.pointRadius : (isFocal ? 4 : 2),
      pointHitRadius: 12,
      pointHoverRadius: isFocal ? 7 : 5,
      pointBackgroundColor: border,
      pointBorderColor: tokens.bg
    };
  });

  const chartData = { labels, datasets };
  const baseOptions = getChartDefaultOptions(tokens);

  const config = {
    type: 'radar',
    data: chartData,
    options: {
      scales: {},
      ...baseOptions,
      responsive: true,
      maintainAspectRatio: false,
      animation: getAccessibleAnimationOptions(tokens, {
        duration: (isTufte || reduceMotion) ? 0 : 450,
        easing: 'easeOutQuart'
      }),
      interaction: {
        mode: 'nearest',
        intersect: false,
        axis: 'r'
      },
      hover: {
        mode: 'nearest',
        intersect: false,
        animationDuration: (isTufte || reduceMotion) ? 0 : 100
      },
      scales: {
        r: {
          grid: {
            color: tokens.gridColor,
            lineWidth: 1
          },
          angleLines: {
            color: tokens.gridColor,
            lineWidth: 1
          },
          pointLabels: {
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              size: 11,
              weight: '500'
            }
          },
          ticks: {
            color: tokens.textSecondary,
            backdropColor: 'transparent',
            font: {
              family: tokens.fontFamily,
              size: 10
            }
          }
        }
      },
      plugins: {
        legend: {
          display: true && !isTufte,
          position: 'top',
          align: 'end',
          labels: {
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              size: 12,
              weight: '500'
            },
            usePointStyle: true,
            boxWidth: 8,
            boxHeight: 8,
            padding: 14
          }
        },
        tooltip: {
          backgroundColor: tokens.tooltipBg || '#0F172A',
          titleColor: tokens.tooltipText || '#F8FAFC',
          bodyColor: tokens.tooltipText || '#F8FAFC',
          borderColor: tokens.borderStrong || tokens.border || '#334155',
          borderWidth: 1,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          boxPadding: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '400'
          },
          callbacks: {
            label: (ctx) => {
              const val = ctx.raw;
              const formatted = typeof val === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(val)
                : val;
              return ` ${ctx.dataset.label || ''} → ${ctx.label || ''} : ${formatted} flux`;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Headless test fallback mock
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/06-flux-processus/funnel-chart
  // --------------------------------------------------------------------------
  global.KitCharts["funnel-chart"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function(t, r, o) { return { borderColor: '#2B8CBE', backgroundColor: '#2B8CBE', ...o }; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function(v, tr, th, p, t) { return {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function() { return {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function() { return {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function() { return {}; };
  const getExecutiveModeOptions = (KitChartsTheme && KitChartsTheme.getExecutiveModeOptions) || (typeof window !== 'undefined' && window.getExecutiveModeOptions) || function() { return {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 06-flux-processus/funnel-chart/template.js
 * @description Standardized Funnel Chart template for kit-charts.
 * Visualizes sequential multi-stage conversion pipeline with monotonic drop-off.
 * Enforces horizontal orientation (indexAxis: 'y'), strict X=0 baseline, sorted stages, semantic emphasis, and Gestalt spacing.
 */

/**
 * Données par défaut représentatives (Entonnoir d'acquisition et de conversion SaaS)
 */
const DEFAULT_DATA = {
  labels: [
    '1. Visiteurs Uniques',
    '2. Inscriptions Gratuites',
    '3. Utilisateurs Actifs (WAU)',
    '4. Souscriptions Payantes',
    '5. Renouvellements Annuels'
  ],
  datasets: [{
    label: 'Volume Utilisateurs',
    data: [10000, 3200, 1450, 480, 390],
    role: 'focal'
  }]
};

/**
 * Creates and renders a Funnel Chart in the specified canvas target.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - DOM Canvas ID or Canvas Element
 * @param {Object} [customData] - Optional user data payload
 * @param {string} [themeName='colorbrewer-accessible'] - Theme identifier
 * @param {Object} [options={}] - Additional options (e.g. showDataLabels)
 * @returns {Object} Initialized Chart.js instance or mock instance
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string' && typeof document !== 'undefined'
    ? document.getElementById(canvasTarget)
    : canvasTarget;

  if (typeof Chart !== 'undefined' && canvas) {
    const existing = Chart.getChart(canvas);
    if (existing) {
      existing.destroy();
    }
  }

  const container = canvas && canvas.parentElement ? canvas.parentElement : null;
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const reduceMotion = isReducedMotionPreferred();
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];

  const datasets = (rawData.datasets || []).map((ds, idx) => {
    const dataLen = Array.isArray(ds.data) ? ds.data.length : 5;
    
    // Dynamic sequential palette generation from theme tokens
    const defaultColors = (ds.data || []).map((_, i) => {
      if (tokens.sequential && tokens.sequential.length > 0) {
        const factor = dataLen > 1 ? i / (dataLen - 1) : 1;
        return getSequentialColor(tokens, 0.4 + factor * 0.6);
      }
      return getColor(tokens, i);
    });

    const bgColors = ds.backgroundColor || defaultColors;

    return {
      label: ds.label || `Étape ${idx + 1}`,
      data: Array.isArray(ds.data) ? [...ds.data] : [],
      backgroundColor: bgColors,
      borderColor: ds.borderColor || (isTufte ? tokens.borderStrong : tokens.bg),
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : 1,
      borderRadius: isTufte ? 0 : 4,
      categoryPercentage: typeof ds.categoryPercentage === 'number' ? ds.categoryPercentage : 0.8,
      barPercentage: typeof ds.barPercentage === 'number' ? ds.barPercentage : 0.85
    };
  });

  const chartData = { labels, datasets };
  const baseOptions = getChartDefaultOptions(tokens);

  const config = {
    type: 'bar',
    data: chartData,
    options: {
      ...baseOptions,
      indexAxis: 'y', // Horizontal layout for natural top-to-bottom reading
      responsive: true,
      maintainAspectRatio: false,
      animation: getAccessibleAnimationOptions(tokens, {
        duration: (isTufte || reduceMotion) ? 0 : 400,
        easing: 'easeOutQuart'
      }),
      interaction: {
        mode: 'index',
        intersect: false,
        axis: 'y'
      },
      hover: {
        mode: 'index',
        intersect: false,
        axis: 'y',
        animationDuration: (isTufte || reduceMotion) ? 0 : 100
      },
      categoryPercentage: 0.8,
      barPercentage: 0.85,
      layout: {
        padding: {
          right: 28
        }
      },
      scales: {
        x: {
          beginAtZero: true, // Strict length-encoding origin rule on X axis
          grace: '15%',
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 6
          }
        },
        y: {
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              size: 11,
              weight: '500'
            },
            padding: 8
          }
        }
      },
      plugins: {
        datalabels: getDataLabelOptions(tokens, {
          display: showDataLabels,
          align: 'right',
          anchor: 'end',
          formatter: (val, ctx) => {
            const raw0 = ctx && ctx.dataset && ctx.dataset.data ? ctx.dataset.data[0] : null;
            const firstNum = typeof raw0 === 'object' && raw0 !== null ? (raw0.value ?? raw0.x ?? 1) : (Number(raw0) || 1);
            const num = typeof val === 'object' && val !== null ? (val.value ?? val.x ?? 0) : (Number(val) || 0);
            const pct = firstNum > 0 ? ((num / firstNum) * 100).toFixed(0) : '0';
            const formattedVal = formatLabelValue(num);
            return `${formattedVal} (${pct}%)`;
          }
        }),
        legend: {
          display: false // High Data-Ink ratio: labels are on Y axis
        },
        tooltip: {
          backgroundColor: tokens.tooltipBg || '#0F172A',
          titleColor: tokens.tooltipText || '#F8FAFC',
          bodyColor: tokens.tooltipText || '#F8FAFC',
          borderColor: tokens.borderStrong || tokens.border || '#334155',
          borderWidth: 1,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          boxPadding: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '400'
          },
          callbacks: {
            label: (ctx) => {
              const dataset = ctx.dataset;
              const currentVal = Number(ctx.raw) || 0;
              const firstVal = Number(dataset.data[0]) || currentVal || 1;
              const prevVal = ctx.dataIndex > 0 ? (Number(dataset.data[ctx.dataIndex - 1]) || currentVal) : currentVal;
              
              const conversionTotal = ((currentVal / firstVal) * 100).toFixed(1);
              const stepRate = ctx.dataIndex > 0 ? ((currentVal / prevVal) * 100).toFixed(1) : '100.0';
              const dropOff = ctx.dataIndex > 0 ? (100 - Number(stepRate)).toFixed(1) : '0.0';
              
              return [
                ` Effectif: ${currentVal.toLocaleString('fr-FR')}`,
                ` Taux de conversion global: ${conversionTotal}%`,
                ` Rétention étape précédente: ${stepRate}%`,
                ` Déperdition (Chute): ${dropOff}%`
              ];
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Headless test fallback mock
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    isReducedMotionPreferred: typeof isReducedMotionPreferred === 'function' ? isReducedMotionPreferred : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getPartitionInteractionOptions: typeof getPartitionInteractionOptions === 'function' ? getPartitionInteractionOptions : null,
    computeAntiOcclusionTooltipPosition: typeof computeAntiOcclusionTooltipPosition === 'function' ? computeAntiOcclusionTooltipPosition : null,
    getDataLabelOptions: typeof getDataLabelOptions === 'function' ? getDataLabelOptions : null,
    formatLabelValue: typeof formatLabelValue === 'function' ? formatLabelValue : null,
    kitChartsDataLabelsPlugin: typeof kitChartsDataLabelsPlugin !== 'undefined' ? kitChartsDataLabelsPlugin : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/06-flux-processus/gantt-progress
  // --------------------------------------------------------------------------
  global.KitCharts["gantt-progress"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };

  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  function computeGanttSchedule(tasks, todayWeek = 6) {
    if (!Array.isArray(tasks)) {
      const empty = [];
      empty.tasks = [];
      empty.summary = { completed: 0, delayed: 0, onTrack: 0 };
      return empty;
    }
    let completed = 0;
    let onTrack = 0;
    let delayed = 0;
    const computedTasks = tasks.map(t => {
      const start = Number(t.start) || 0;
      const end = Number(t.end) || 0;
      const rawProg = Number(t.progress) || 0;
      const progress = rawProg <= 1.0 && rawProg > 0 ? rawProg * 100 : Math.max(0, Math.min(100, rawProg));
      const duration = end - start;
      const doneTime = start + (duration * (progress / 100));
      const isCompleted = progress >= 100;
      const isLate = !isCompleted && todayWeek > doneTime;
      const status = isCompleted ? 'completed' : (isLate ? 'delayed' : 'on-track');
      if (status === 'completed') completed++;
      else if (status === 'delayed') delayed++;
      else onTrack++;

      return {
        ...t,
        start,
        end,
        duration,
        progress,
        doneTime,
        status,
        isLate
      };
    });
    computedTasks.tasks = computedTasks;
    computedTasks.summary = { completed, delayed, onTrack };
    return computedTasks;
  }

  const DEFAULT_DATA = {
    labels: [
      '1. Spécifications & Cadrage',
      '2. Architecture & Schéma DB',
      '3. Développement API Core',
      '4. Intégration Frontend UI',
      '5. Tests E2E & Recette',
      '6. Déploiement Production'
    ],
    datasets: [{
      label: 'Planning Projet',
      todayWeek: 6.5,
      tasks: [
        { label: '1. Spécifications & Cadrage', start: 1, end: 4, progress: 100, category: 0 },
        { label: '2. Architecture & Schéma DB', start: 3, end: 6, progress: 100, category: 0 },
        { label: '3. Développement API Core', start: 5, end: 9, progress: 65, category: 1 },
        { label: '4. Intégration Frontend UI', start: 6, end: 11, progress: 30, category: 1 },
        { label: '5. Tests E2E & Recette', start: 9, end: 12, progress: 0, category: 2 },
        { label: '6. Déploiement Production', start: 11, end: 13, progress: 0, category: 2 }
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
    const labels = rawData.labels || DEFAULT_DATA.labels;
    const rawTasks = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].tasks) || DEFAULT_DATA.datasets[0].tasks;
    const todayWeek = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].todayWeek) || 6.5;

    const schedule = computeGanttSchedule(rawTasks, todayWeek);

    const todayColor = tokens.emphasis?.benchmark || tokens.status?.danger || '#CA0020';

    const ganttPainterPlugin = {
      id: 'kitChartsGanttPainter',
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y }, chartArea } = chart;
        if (!x || !y || !chartArea) return;

        ctx.save();
        const n = schedule.length;
        const rowH = y.height / n;
        const barH = Math.min(22, rowH * 0.50);

        // 1. Tracé des sous-barres d'avancement interne (Progress fill)
        schedule.forEach((t, idx) => {
          const yCenter = y.getPixelForValue(idx);
          const xStart = x.getPixelForValue(t.start);
          const xEnd = x.getPixelForValue(t.end);
          const xDone = x.getPixelForValue(t.doneTime);
          const color = getColor(tokens, t.category || 0);

          // Barre d'avancement réel (opacité forte)
          if (t.progress > 0) {
            ctx.fillStyle = color;
            ctx.fillRect(xStart, yCenter - barH / 2, xDone - xStart, barH);
          }

          // Libellé de pourcentage %
          if (showDataLabels) {
            ctx.font = `600 11px ${tokens.fontMono || 'monospace'}`;
            ctx.fillStyle = isDark ? '#ECEFF4' : '#0F172A';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${t.progress}%`, xEnd + 8, yCenter);
          }
        });

        // 2. Ligne repère "Aujourd'hui" (Now vertical line)
        const xToday = x.getPixelForValue(todayWeek);
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = todayColor;
        ctx.lineWidth = 2;
        ctx.moveTo(xToday, chartArea.top);
        ctx.lineTo(xToday, chartArea.bottom);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.font = `600 11px ${tokens.fontFamily}`;
        ctx.fillStyle = todayColor;
        ctx.textAlign = 'center';
        ctx.fillText("Aujourd'hui (S6.5)", xToday, chartArea.top - 6);

        ctx.restore();
      }
    };

    const defaultOpts = getChartDefaultOptions(tokens);
    const config = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Durée Prévue',
          data: schedule.map(t => [t.start, t.end]),
          backgroundColor: schedule.map(t => hexToRgba(getColor(tokens, t.category || 0), isDark ? 0.30 : 0.20)),
          borderColor: schedule.map(t => getColor(tokens, t.category || 0)),
          borderWidth: 1.5,
          borderRadius: 4,
          datalabels: false,
          displayDataLabels: false
        }]
      },
      options: {
        ...defaultOpts,
        indexAxis: 'y',
        _kitChartsTokens: tokens,
        showDataLabels: showDataLabels,
        layout: {
          padding: {
            right: 30,
            top: 16
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
                const item = schedule[ctx.dataIndex];
                if (!item) return '';
                return [
                  `Période : Semaine ${item.start} à Semaine ${item.end} (${item.duration} sem.)`,
                  `Avancement : ${item.progress}% achevé`,
                  `Statut : ${item.progress === 100 ? 'Terminé' : (item.isLate ? 'En retard' : 'En cours')}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            ...defaultOpts.scales.x,
            min: 0,
            max: 15,
            grid: { color: tokens.gridColor },
            ticks: {
              stepSize: 1,
              callback: (val) => `S${val}`
            },
            title: {
              display: true,
              text: 'Calendrier (Semaines)',
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
      plugins: [ganttPainterPlugin]
    };

    if (typeof Chart === 'undefined') return { config, schedule, computeGanttSchedule };
    return new Chart(canvas, config);
  }

  return {
    createChart,
    DEFAULT_DATA,
    computeGanttSchedule,
    computeGanttProgress: computeGanttSchedule,
    getDataLabelOptions,
    formatLabelValue,
    getEmphasisStyle: (KitChartsTheme && KitChartsTheme.getEmphasisStyle),
    getValenceColor: (KitChartsTheme && KitChartsTheme.getValenceColor),
    getThresholdStatus: (KitChartsTheme && KitChartsTheme.getThresholdStatus)
  };

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/06-flux-processus/sankey-diagram
  // --------------------------------------------------------------------------
  global.KitCharts["sankey-diagram"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function(t, r, o) { return { borderColor: '#2B8CBE', backgroundColor: '#2B8CBE', ...o }; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function(v, tr, th, p, t) { return {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function() { return {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function() { return {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function() { return {}; };
  const getExecutiveModeOptions = (KitChartsTheme && KitChartsTheme.getExecutiveModeOptions) || (typeof window !== 'undefined' && window.getExecutiveModeOptions) || function() { return {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 06-flux-processus/sankey-diagram/template.js
 * @description Standardized Sankey Diagram template for kit-charts.
 * Visualizes directed multi-stage quantitative flow transfers with strict mass conservation (Σ In = Σ Out).
 * Utilizes chartjs-chart-sankey plugin with dynamic theme node and gradient link coloring and semantic valence.
 */

/**
 * Données par défaut représentatives (Bilan flux énergétique national en TWh avec valence de flux)
 */
const DEFAULT_DATA = {
  datasets: [{
    label: 'Bilan Flux Énergétique National (TWh)',
    data: [
      { from: 'Nucléaire', to: 'Électricité Réseau', flow: 68, valence: 'neutral' },
      { from: 'Renouvelable (Éolien/Solaire)', to: 'Électricité Réseau', flow: 32, valence: 'positive' },
      { from: 'Gaz Naturel', to: 'Chaleur Industrielle', flow: 40, valence: 'neutral' },
      { from: 'Électricité Réseau', to: 'Secteur Résidentiel', flow: 45, valence: 'positive' },
      { from: 'Électricité Réseau', to: 'Industrie Électrifiée', flow: 38, valence: 'positive' },
      { from: 'Électricité Réseau', to: 'Pertes Réseau & Transport', flow: 17, valence: 'negative' },
      { from: 'Chaleur Industrielle', to: 'Transformation & Chimie', flow: 28, valence: 'positive' },
      { from: 'Chaleur Industrielle', to: 'Pertes Thermiques', flow: 12, valence: 'negative' }
    ]
  }]
};

/**
 * Creates and renders a Sankey Diagram in the specified canvas target.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - DOM Canvas ID or Canvas Element
 * @param {Object} [customData] - Optional user data payload
 * @param {string} [themeName='colorbrewer-accessible'] - Theme identifier
 * @returns {Object} Initialized Chart.js instance or mock instance
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string' && typeof document !== 'undefined'
    ? document.getElementById(canvasTarget)
    : canvasTarget;

  if (typeof Chart !== 'undefined' && canvas) {
    const existing = Chart.getChart(canvas);
    if (existing) {
      existing.destroy();
    }
  }

  const container = canvas && canvas.parentElement ? canvas.parentElement : null;
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const reduceMotion = isReducedMotionPreferred();

  const rawData = customData || DEFAULT_DATA;
  const rawDatasets = rawData.datasets || [];

  const datasets = rawDatasets.map((ds, dsIdx) => {
    const flowData = Array.isArray(ds.data) ? ds.data : [];

    const defaultColorFrom = (ctx) => {
      const palette = tokens.palette || ['#2B8CBE', '#E66101', '#5E3C99', '#4DAC26'];
      const item = ctx.dataset?.data?.[ctx.dataIndex];
      if (item && item.valence) {
        if (item.valence === 'positive' || item.valence === 'gain') return getValenceColor(tokens, 'up', 'gain');
        if (item.valence === 'negative' || item.valence === 'cost' || item.valence === 'loss') return getValenceColor(tokens, 'up', 'cost');
      }
      const fromNode = item?.from || '';
      let hash = 0;
      for (let i = 0; i < fromNode.length; i++) hash += fromNode.charCodeAt(i);
      return palette[Math.abs(hash) % palette.length];
    };

    const defaultColorTo = (ctx) => {
      const palette = tokens.palette || ['#2B8CBE', '#E66101', '#5E3C99', '#4DAC26'];
      const item = ctx.dataset?.data?.[ctx.dataIndex];
      if (item && item.valence) {
        if (item.valence === 'positive' || item.valence === 'gain') return getValenceColor(tokens, 'up', 'gain');
        if (item.valence === 'negative' || item.valence === 'cost' || item.valence === 'loss') return getValenceColor(tokens, 'up', 'cost');
      }
      const toNode = item?.to || '';
      let hash = 0;
      for (let i = 0; i < toNode.length; i++) hash += toNode.charCodeAt(i);
      return palette[Math.abs(hash) % palette.length];
    };

    return {
      label: ds.label || `Flux ${dsIdx + 1}`,
      data: flowData,
      colorFrom: ds.colorFrom || defaultColorFrom,
      colorTo: ds.colorTo || defaultColorTo,
      colorMode: ds.colorMode || 'gradient',
      borderWidth: ds.borderWidth ?? 0,
      nodeWidth: ds.nodeWidth ?? 14,
      nodePadding: ds.nodePadding ?? 16,
      backgroundColor: ds.backgroundColor || getColor(tokens, dsIdx)
    };
  });

  const chartData = { datasets };
  const baseOptions = getChartDefaultOptions(tokens);

  const config = {
    type: 'sankey',
    data: chartData,
    options: {
      scales: {},
      ...baseOptions,
      responsive: true,
      maintainAspectRatio: false,
      animation: getAccessibleAnimationOptions(tokens, {
        duration: (isTufte || reduceMotion) ? 0 : 450,
        easing: 'easeOutQuart'
      }),
      interaction: {
        mode: 'nearest',
        intersect: true
      },
      hover: {
        mode: 'nearest',
        intersect: true,
        animationDuration: (isTufte || reduceMotion) ? 0 : 100
      },
      layout: {
        padding: { top: 16, bottom: 16, left: 16, right: 16 }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: tokens.tooltipBg || '#0F172A',
          titleColor: tokens.tooltipText || '#F8FAFC',
          bodyColor: tokens.tooltipText || '#F8FAFC',
          borderColor: tokens.borderStrong || tokens.border || '#334155',
          borderWidth: 1,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          boxPadding: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '400'
          },
          callbacks: {
            label: (ctx) => {
              const item = ctx.raw;
              if (!item) return '';
              const valTag = item.valence === 'positive' ? ' [Utile / Valeur]' : (item.valence === 'negative' ? ' [Perte / Dissipation]' : '');
              const formatted = typeof item.flow === 'number' ? item.flow.toLocaleString('fr-FR') : item.flow;
              return ` ${item.from} → ${item.to} : ${formatted}${valTag}`;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Headless test fallback mock
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/06-flux-processus/waterfall-chart
  // --------------------------------------------------------------------------
  global.KitCharts["waterfall-chart"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function(t, r, o) { return { borderColor: '#2B8CBE', backgroundColor: '#2B8CBE', ...o }; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function(v, tr, th, p, t) { return {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function() { return {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function() { return {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function() { return {}; };
  const getExecutiveModeOptions = (KitChartsTheme && KitChartsTheme.getExecutiveModeOptions) || (typeof window !== 'undefined' && window.getExecutiveModeOptions) || function() { return {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 06-flux-processus/waterfall-chart/template.js
 * @description Standardized Waterfall Chart template for kit-charts.
 * Visualizes sequential step-by-step reconciliation of cumulative financial gains (+) and losses (-).
 * Employs native floating bar ranges [y1, y2], semantic green/red valence coloring, and strict Y=0 baseline.
 */

/**
 * Données par défaut représentatives (Pont Financier de Réconciliation EBITDA en M€)
 */
const DEFAULT_DATA = {
  labels: [
    'EBITDA 2023 Initial',
    '+ Volume Ventes',
    '+ Mix Prix / Produits',
    '- Coûts Matières Premières',
    '- Frais R&D & Recrutement',
    'EBITDA 2024 Final'
  ],
  datasets: [{
    label: 'Pont Financier EBITDA (M€)',
    data: [
      [0, 100],      // Base Initial (100)
      [100, 135],    // +35 Gain
      [135, 155],    // +20 Gain
      [155, 125],    // -30 Loss
      [125, 110],    // -15 Loss
      [0, 110]       // Total Final (110)
    ]
  }]
};

/**
 * Creates and renders a Waterfall Chart in the specified canvas target.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - DOM Canvas ID or Canvas Element
 * @param {Object} [customData] - Optional user data payload
 * @param {string} [themeName='colorbrewer-accessible'] - Theme identifier
 * @param {Object} [options={}] - Additional options (e.g. showDataLabels)
 * @returns {Object} Initialized Chart.js instance or mock instance
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string' && typeof document !== 'undefined'
    ? document.getElementById(canvasTarget)
    : canvasTarget;

  if (typeof Chart !== 'undefined' && canvas) {
    const existing = Chart.getChart(canvas);
    if (existing) {
      existing.destroy();
    }
  }

  const container = canvas && canvas.parentElement ? canvas.parentElement : null;
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const reduceMotion = isReducedMotionPreferred();
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  const posColor = getValenceColor(tokens, 'up', 'gain');
  const negColor = getValenceColor(tokens, 'down', 'gain');
  const totalColor = (tokens.emphasis?.benchmark && tokens.emphasis.benchmark !== negColor && tokens.emphasis.benchmark !== posColor)
    ? tokens.emphasis.benchmark
    : (tokens.zeroLine && tokens.zeroLine !== negColor && tokens.zeroLine !== posColor ? tokens.zeroLine : (getColor(tokens, 0) || '#475569'));

  const rawData = customData || DEFAULT_DATA;
  const labels = rawData.labels ? [...rawData.labels] : [];

  const datasets = (rawData.datasets || []).map((ds, dsIdx) => {
    const rawPoints = Array.isArray(ds.data) ? ds.data : [];
    const len = rawPoints.length;

    const bgColors = rawPoints.map((val, idx) => {
      if (Array.isArray(val)) {
        if (idx === 0 || idx === len - 1) return totalColor;
        const diff = val[1] - val[0];
        return diff >= 0 ? posColor : negColor;
      }
      return totalColor;
    });

    return {
      label: ds.label || `Cascade ${dsIdx + 1}`,
      data: rawPoints,
      backgroundColor: ds.backgroundColor || bgColors,
      borderColor: ds.borderColor || (isTufte ? tokens.borderStrong : tokens.bg),
      borderWidth: typeof ds.borderWidth === 'number' ? ds.borderWidth : 1,
      borderRadius: isTufte ? 0 : 4,
      categoryPercentage: typeof ds.categoryPercentage === 'number' ? ds.categoryPercentage : 0.8,
      barPercentage: typeof ds.barPercentage === 'number' ? ds.barPercentage : 0.85
    };
  });

  const chartData = { labels, datasets };
  const baseOptions = getChartDefaultOptions(tokens);

  const config = {
    type: 'bar',
    data: chartData,
    options: {
      ...baseOptions,
      responsive: true,
      maintainAspectRatio: false,
      animation: getAccessibleAnimationOptions(tokens, {
        duration: (isTufte || reduceMotion) ? 0 : 400,
        easing: 'easeOutQuart'
      }),
      interaction: {
        mode: 'index',
        intersect: false,
        axis: 'x'
      },
      hover: {
        mode: 'index',
        intersect: false,
        axis: 'x',
        animationDuration: (isTufte || reduceMotion) ? 0 : 100
      },
      categoryPercentage: 0.8,
      barPercentage: 0.85,
      layout: {
        padding: {
          top: 16
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 6
          }
        },
        y: {
          beginAtZero: true, // Strict psychophysical mandate for waterfall baseline
          grace: '10%',
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 8
          }
        }
      },
      plugins: {
        datalabels: getDataLabelOptions(tokens, {
          display: showDataLabels,
          align: 'top',
          anchor: 'end',
          formatter: (val, ctx) => {
            const raw = ctx && ctx.rawVal !== undefined ? ctx.rawVal : (Array.isArray(val) ? val : null);
            if (Array.isArray(raw)) {
              const dIndex = ctx.dataIndex ?? ctx.index ?? 0;
              const dLen = (ctx.dataset && ctx.dataset.data) ? ctx.dataset.data.length : 0;
              const isTotal = dIndex === 0 || dIndex === dLen - 1;
              if (isTotal) {
                return `${formatLabelValue(raw[1])} M€`;
              }
              const diff = raw[1] - raw[0];
              const sign = diff > 0 ? '+' : '';
              return `${sign}${formatLabelValue(diff)}`;
            }
            return formatLabelValue(val);
          }
        }),
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: tokens.tooltipBg || '#0F172A',
          titleColor: tokens.tooltipText || '#F8FAFC',
          bodyColor: tokens.tooltipText || '#F8FAFC',
          borderColor: tokens.borderStrong || tokens.border || '#334155',
          borderWidth: 1,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          boxPadding: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '400'
          },
          callbacks: {
            label: (ctx) => {
              const val = ctx.raw;
              if (Array.isArray(val)) {
                const diff = val[1] - val[0];
                const sign = diff > 0 ? '+' : '';
                const isTotal = ctx.dataIndex === 0 || ctx.dataIndex === ctx.dataset.data.length - 1;
                const formattedDiff = typeof diff === 'number' ? diff.toLocaleString('fr-FR') : diff;
                const formattedTotal = typeof val[1] === 'number' ? val[1].toLocaleString('fr-FR') : val[1];
                if (isTotal) {
                  return ` Solde Total: ${formattedTotal} M€`;
                }
                return [
                  ` Niveau Atteint: ${formattedTotal} M€`,
                  ` Contribution Étape: ${sign}${formattedDiff} M€ (${diff > 0 ? 'Gain' : 'Perte/Coût'})`
                ];
              }
              const formattedVal = typeof val === 'number' ? val.toLocaleString('fr-FR') : val;
              return ` Valeur: ${formattedVal} M€`;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Headless test fallback mock
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    isReducedMotionPreferred: typeof isReducedMotionPreferred === 'function' ? isReducedMotionPreferred : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getPartitionInteractionOptions: typeof getPartitionInteractionOptions === 'function' ? getPartitionInteractionOptions : null,
    computeAntiOcclusionTooltipPosition: typeof computeAntiOcclusionTooltipPosition === 'function' ? computeAntiOcclusionTooltipPosition : null,
    getDataLabelOptions: typeof getDataLabelOptions === 'function' ? getDataLabelOptions : null,
    formatLabelValue: typeof formatLabelValue === 'function' ? formatLabelValue : null,
    kitChartsDataLabelsPlugin: typeof kitChartsDataLabelsPlugin !== 'undefined' ? kitChartsDataLabelsPlugin : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/06-flux-processus/waterfall-cumulative-line
  // --------------------------------------------------------------------------
  global.KitCharts["waterfall-cumulative-line"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

  'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
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
      'CA Brut Initial',
      'Nouveaux Contrats',
      'Expansion Comptes',
      'Remises Commerciales',
      'Désabonnements (Churn)',
      "Frais d'Infrastructure",
      'EBITDA Net'
    ],
    datasets: [{
      label: 'Pont Financier (k€)',
      data: [
        { label: 'CA Brut Initial', value: 500, isTotal: false },
        { label: 'Nouveaux Contrats', value: 180, isTotal: false },
        { label: 'Expansion Comptes', value: 75, isTotal: false },
        { label: 'Remises Commerciales', value: -45, isTotal: false },
        { label: 'Désabonnements (Churn)', value: -60, isTotal: false },
        { label: "Frais d'Infrastructure", value: -110, isTotal: false },
        { label: 'EBITDA Net', value: 0, isTotal: true }
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
    const labels = rawData.labels || DEFAULT_DATA.labels;
    const steps = (rawData.datasets && rawData.datasets[0] && rawData.datasets[0].data) || DEFAULT_DATA.datasets[0].data;

    const analysis = computeWaterfallBalances(steps);

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
    const config = {
      type: 'bar',
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
            datalabels: {
              display: showDataLabels,
              formatter: (val, ctx) => {
                const s = steps[ctx.dataIndex];
                if (!s) return '';
                if (s.isTotal) return `${analysis.balances[ctx.dataIndex]} k€`;
                return `${s.value >= 0 ? '+' : ''}${s.value} k€`;
              }
            },
            order: 2
          },
          {
            type: 'line',
            label: 'Trajectoire Cumulée',
            data: analysis.balances,
            borderColor: lineColor,
            backgroundColor: lineColor,
            borderWidth: 2.5,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.15,
            datalabels: {
              display: false
            },
            order: 1
          }
        ]
      },
      options: {
        ...defaultOpts,
        _kitChartsTokens: tokens,
        showDataLabels: showDataLabels,
        layout: {
          padding: {
            top: 16
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
            display: showDataLabels,
            formatter: (val, ctx) => {
              const s = steps[ctx.dataIndex];
              if (!s) return '';
              if (s.isTotal) return `${analysis.balances[ctx.dataIndex]} k€`;
              return `${s.value >= 0 ? '+' : ''}${s.value} k€`;
            }
          }),
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: tokens.textPrimary,
              font: { family: tokens.fontFamily, size: 12 }
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
              font: { family: tokens.fontFamily, size: 11 },
              maxRotation: 25
            }
          },
          y: {
            ...defaultOpts.scales.y,
            beginAtZero: true,
            grace: '12%',
            grid: { color: tokens.gridColor },
            title: {
              display: true,
              text: 'Solde Net (k€)',
              color: tokens.textSecondary,
              font: { family: tokens.fontFamily, size: 12, weight: '500' }
            }
          }
        }
      }
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

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/07-hierarchie-reseau/arc-diagram
  // --------------------------------------------------------------------------
  global.KitCharts["arc-diagram"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function() { return ''; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function() { return {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function() { return {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function() { return {}; };
  const getExecutiveModeOptions = (KitChartsTheme && KitChartsTheme.getExecutiveModeOptions) || (typeof window !== 'undefined' && window.getExecutiveModeOptions) || function() { return {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 07-hierarchie-reseau/arc-diagram/template.js
 * @description Template Chart.js v4+ pour Diagramme en Arcs (Arc Diagram).
 * Psychophysique: Encodage 1D ordonné des nœuds + arcs de liaison semi-circulaires (Cleveland-McGill: position 1D + épaisseur).
 * Règle cognitive: Préservation d'un ordre naturel séquentiel (ex: étapes de pipeline, chapitres, flux amont-aval).
 */

/**
 * Données par défaut représentatives (Interactions dans un pipeline de données en streaming)
 */
const DEFAULT_DATA = {
  nodes: [
    { id: 'ingest', label: '1. Ingestion', x: 1, y: 0, role: 'context' },
    { id: 'valid', label: '2. Validation', x: 2, y: 0, role: 'context' },
    { id: 'dedup', label: '3. Dédoublonnage', x: 3, y: 0, role: 'context' },
    { id: 'enrich', label: '4. Enrichissement', x: 4, y: 0, role: 'context' },
    { id: 'features', label: '5. Feature Store', x: 5, y: 0, role: 'context' },
    { id: 'infer', label: '6. Inférence IA', x: 6, y: 0, role: 'focal' },
    { id: 'alert', label: '7. Alerting / Dispatch', x: 7, y: 0, role: 'anomaly' }
  ],
  links: [
    { source: 0, target: 1, value: 8, label: 'Flux Brut' },
    { source: 1, target: 2, value: 7, label: 'Données Conformes' },
    { source: 1, target: 6, value: 2, label: 'Rejet / Erreur Schéma', role: 'anomaly' },
    { source: 2, target: 3, value: 6, label: 'Flux Unique' },
    { source: 0, target: 4, value: 4, label: 'Archivage Froid' },
    { source: 3, target: 5, value: 6, label: 'Vecteurs Calculés', role: 'focal' },
    { source: 4, target: 5, value: 3, label: 'Features Historiques' },
    { source: 5, target: 6, value: 5, label: 'Détections Anomalies', role: 'focal' }
  ],
  datasets: [{
    label: 'Étapes du Pipeline',
    data: [
      { x: 1, y: 0, label: '1. Ingestion', r: 8, role: 'context' },
      { x: 2, y: 0, label: '2. Validation', r: 8, role: 'context' },
      { x: 3, y: 0, label: '3. Dédoublonnage', r: 8, role: 'context' },
      { x: 4, y: 0, label: '4. Enrichissement', r: 8, role: 'context' },
      { x: 5, y: 0, label: '5. Feature Store', r: 8, role: 'context' },
      { x: 6, y: 0, label: '6. Inférence IA', r: 12, role: 'focal' },
      { x: 7, y: 0, label: '7. Alerting / Dispatch', r: 10, role: 'anomaly' }
    ]
  }]
};

/**
 * Plugin Canvas Chart.js pour le tracé des arcs semi-circulaires au-dessus de l'axe Y=0.
 */
const arcDiagramLinksPlugin = {
  id: 'arcDiagramLinksPlugin',
  beforeDatasetsDraw(chart) {
    const { ctx, data, scales } = chart;
    const xScale = scales.x;
    const yScale = scales.y;
    if (!xScale || !yScale) return;

    const rawData = data;
    const links = rawData.links || (rawData.datasets && rawData.datasets[0]?.links) || [];
    const nodes = rawData.datasets && rawData.datasets[0]?.data
      ? rawData.datasets[0].data
      : (Array.isArray(rawData.nodes) ? rawData.nodes : []);

    if (!links.length || !nodes.length) return;

    ctx.save();
    const isDark = chart.options?.plugins?.arcMeta?.isDark;
    const tokens = chart.options?.plugins?.arcMeta?.tokens || {};
    const palette = tokens.palette || ['#2B8CBE', '#E66101', '#5E3C99'];

    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      let sourceNode = null;
      let targetNode = null;

      if (typeof link.source === 'number') {
        sourceNode = nodes[link.source];
      } else if (typeof link.source === 'string') {
        sourceNode = nodes.find(n => n.id === link.source || n.label === link.source);
      } else if (link.source && typeof link.source === 'object') {
        sourceNode = link.source;
      }

      if (typeof link.target === 'number') {
        targetNode = nodes[link.target];
      } else if (typeof link.target === 'string') {
        targetNode = nodes.find(n => n.id === link.target || n.label === link.target);
      } else if (link.target && typeof link.target === 'object') {
        targetNode = link.target;
      }

      if (!sourceNode || !targetNode) continue;

      const x1 = xScale.getPixelForValue(sourceNode.x);
      const x2 = xScale.getPixelForValue(targetNode.x);
      const y0 = yScale.getPixelForValue(0);

      if (!Number.isFinite(x1) || !Number.isFinite(x2) || !Number.isFinite(y0)) {
        continue;
      }

      const cx = (x1 + x2) / 2;
      const radius = Math.abs(x2 - x1) / 2;
      if (radius <= 0) continue;

      const sourceIdx = typeof link.source === 'number' ? link.source : i;
      let color = palette[sourceIdx % palette.length];
      let isDashed = false;
      let strokeWidth = Math.max(1, Math.min(5, (link.value || link.weight || 2) * 0.6));

      if (link.role === 'anomaly' || link.valence === 'negative' || (link.label && (link.label.toLowerCase().includes('erreur') || link.label.toLowerCase().includes('rejet')))) {
        color = (tokens.status && tokens.status.danger) || (tokens.emphasis && tokens.emphasis.anomaly) || '#C62828';
        isDashed = true;
        strokeWidth = Math.max(2, strokeWidth);
      } else if (link.role === 'focal') {
        color = (tokens.emphasis && tokens.emphasis.focal) || color;
        strokeWidth = Math.max(2.5, strokeWidth + 1);
      } else if (link.role === 'context') {
        color = (tokens.emphasis && tokens.emphasis.context) || '#CBD5E1';
        strokeWidth = 1;
      }

      ctx.beginPath();
      if (isDashed) {
        ctx.setLineDash([4, 3]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.arc(cx, y0, radius, Math.PI, 0, false);
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }

    ctx.restore();
  }
};

/**
 * Crée et initialise un diagramme en arcs dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  // Destruction propre de l'instance précédente
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const isDark = Boolean(tokens.isDark);
  const reduceMotion = isReducedMotionPreferred();

  const rawData = customData || DEFAULT_DATA;
  const nodes = rawData.datasets && rawData.datasets[0]?.data
    ? rawData.datasets[0].data
    : (Array.isArray(rawData.nodes) ? rawData.nodes : []);
  const links = rawData.links || (rawData.datasets && rawData.datasets[0]?.links) || [];

  const processedData = nodes.map((node, idx) => {
    let nodeColor = isTufte ? tokens.palette[0] : getColor(tokens, idx);
    let nodeRadius = typeof node.r === 'number' ? node.r : 8;
    let nodeBorderColor = isDark ? tokens.surface : '#FFFFFF';
    let nodeBorderWidth = 2;

    if (node.role) {
      const emp = getEmphasisStyle(tokens, node.role, { radius: nodeRadius });
      nodeColor = emp.backgroundColor || nodeColor;
      nodeBorderColor = emp.borderColor || nodeBorderColor;
      nodeBorderWidth = emp.borderWidth !== undefined ? emp.borderWidth : 2;
      if (node.role === 'focal') {
        nodeRadius = Math.max(nodeRadius, 12);
      } else if (node.role === 'context') {
        nodeRadius = Math.min(nodeRadius, 6);
      }
    } else if (node.valence !== undefined || node.delta !== undefined) {
      nodeColor = getValenceColor(tokens, node.valence !== undefined ? node.valence : node.delta, node.metricType || 'gain');
    }

    return {
      x: typeof node.x === 'number' ? node.x : (idx + 1),
      y: 0,
      r: nodeRadius,
      id: node.id || `node-${idx}`,
      label: node.label || `Étape ${idx + 1}`,
      role: node.role || 'context',
      color: nodeColor,
      borderColor: nodeBorderColor,
      borderWidth: nodeBorderWidth
    };
  });

  const datasetLabel = (rawData.datasets && rawData.datasets[0]?.label) || 'Nœuds Séquentiels';

  const chartData = {
    datasets: [{
      label: datasetLabel,
      data: processedData,
      backgroundColor: processedData.map(d => d.color),
      borderColor: processedData.map(d => d.borderColor),
      borderWidth: processedData.map(d => d.borderWidth),
      pointRadius: (ctx) => {
        const item = ctx.raw;
        return item && typeof item.r === 'number' ? item.r : (isTufte ? 4 : 8);
      },
      pointHoverRadius: (ctx) => {
        const item = ctx.raw;
        return item && typeof item.r === 'number' ? item.r + 3 : 11;
      },
      pointHitRadius: 14
    }],
    links
  };

  const defaultOpts = getChartDefaultOptions(tokens);

  const minX = processedData.length > 0 ? Math.min(...processedData.map(d => d.x)) - 0.8 : 0;
  const maxX = processedData.length > 0 ? Math.max(...processedData.map(d => d.x)) + 0.8 : 10;

  const config = {
    type: 'scatter',
    data: chartData,
    options: {
      scales: {},
      ...defaultOpts,
      animation: getAccessibleAnimationOptions(tokens, {
        duration: (isTufte || reduceMotion) ? 0 : 400,
        easing: 'easeOutQuart'
      }),
      interaction: {
        mode: 'nearest',
        intersect: false,
        axis: 'xy'
      },
      hover: {
        mode: 'nearest',
        intersect: false,
        animationDuration: (isTufte || reduceMotion) ? 0 : 100
      },
      plugins: {
        ...defaultOpts.plugins,
        legend: {
          display: false
        },
        arcMeta: {
          isDark,
          tokens,
          palette: tokens.palette
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          backgroundColor: tokens.tooltipBg || '#0F172A',
          titleColor: tokens.tooltipText || '#F8FAFC',
          bodyColor: tokens.tooltipText || '#F8FAFC',
          borderColor: tokens.borderStrong || tokens.border || '#334155',
          borderWidth: 1,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          boxPadding: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '400'
          },
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              return items[0].raw?.label || `Point ${items[0].dataIndex + 1}`;
            },
            label: (item) => {
              const node = item.raw;
              const roleLabel = node.role ? ` [${node.role.toUpperCase()}]` : '';
              return [
                ` Position ordonnée : ${node.x}${roleLabel}`,
                ` Statut : ${node.role === 'anomaly' ? 'Anomalie / Déviation' : 'Opérationnel'}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          min: minX,
          max: maxX,
          afterBuildTicks: (scale) => {
            scale.ticks = processedData.map(d => ({ value: d.x }));
          },
          grid: {
            display: false,
            drawBorder: false
          },
          border: {
            color: tokens.borderStrong,
            width: 1.5
          },
          ticks: {
            autoSkip: false,
            stepSize: 1,
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              size: 11,
              weight: '600'
            },
            callback: (val) => {
              const match = processedData.find(d => Math.abs(d.x - val) < 0.1);
              return match ? match.label : '';
            },
            padding: 10
          }
        },
        y: {
          min: -0.5,
          max: 6,
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            display: false,
            color: tokens.textSecondary
          }
        }
      }
    },
    plugins: [arcDiagramLinksPlugin]
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Simulation mock pour environnement Node.js headless
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;
  moduleExports.getEmphasisStyle = moduleExports.getEmphasisStyle;
  moduleExports.getValenceColor = moduleExports.getValenceColor;
  moduleExports.getThresholdStatus = moduleExports.getThresholdStatus;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/07-hierarchie-reseau/dendrogram
  // --------------------------------------------------------------------------
  global.KitCharts["dendrogram"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function() { return ''; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function() { return {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function() { return {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function() { return {}; };
  const getExecutiveModeOptions = (KitChartsTheme && KitChartsTheme.getExecutiveModeOptions) || (typeof window !== 'undefined' && window.getExecutiveModeOptions) || function() { return {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 07-hierarchie-reseau/dendrogram/template.js
 * @description Template Chart.js v4+ pour Dendrogramme & Arbre Hiérarchique (Dendrogram / Tree Diagram).
 * Psychophysique: Encodage hiérarchique par emboîtement et hauteur de branche (Cleveland-McGill: distance de dissimilarité).
 * Règle cognitive: Orientation horizontale (racine à gauche/droite, feuilles alignées), connecteurs orthogonaux stricts à 90°, ligne de coupe seuil.
 */

/**
 * Données par défaut représentatives (Segmentation hiérarchique de profils clients HCA)
 */
const DEFAULT_DATA = {
  labels: [
    'Visiteurs Occasionnels',
    'Chasseurs de Promos',
    'Acheteurs Fidèles Standard',
    'Abonnés Premium',
    'PME / Indépendants',
    'Grands Comptes B2B'
  ],
  datasets: [
    // Cluster 1 : Retail B2C (Feuilles 1 & 2)
    {
      label: 'Cluster B2C Grand Public',
      role: 'context',
      data: [
        { x: 0, y: 1 }, { x: 14, y: 1 }, { x: 14, y: 2 }, { x: 0, y: 2 },
        { x: 14, y: 1.5 }, { x: 32, y: 1.5 }, { x: 32, y: 3 }, { x: 18, y: 3 },
        { x: 18, y: 3 }, { x: 0, y: 3 }, { x: 18, y: 4 }, { x: 0, y: 4 }
      ]
    },
    // Cluster 2 : Entreprises B2B (Feuilles 5 & 6) - Cible focale haute valeur
    {
      label: 'Cluster B2B Professionnel (Cible Focale)',
      role: 'focal',
      data: [
        { x: 0, y: 5 }, { x: 22, y: 5 }, { x: 22, y: 6 }, { x: 0, y: 6 },
        { x: 22, y: 5.5 }, { x: 48, y: 5.5 }
      ]
    },
    // Tronc principal reliant les méta-clusters
    {
      label: 'Jonction Hiérarchique Principale',
      role: 'context',
      data: [
        { x: 32, y: 2.25 }, { x: 65, y: 2.25 }, { x: 65, y: 5.5 }, { x: 48, y: 5.5 }
      ]
    },
    // Ligne de coupe de seuil K=2 clusters (Benchmark de partition)
    {
      label: 'Seuil de Partition (Cutoff Benchmark)',
      role: 'benchmark',
      data: [
        { x: 40, y: 0.5 }, { x: 40, y: 6.5 }
      ]
    }
  ]
};

/**
 * Crée et initialise un Dendrogramme dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  // Destruction propre de l'instance précédente
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const isDark = Boolean(tokens.isDark);
  const reduceMotion = isReducedMotionPreferred();

  const rawData = customData || DEFAULT_DATA;
  const rawDatasets = rawData.datasets || [];

  const datasets = rawDatasets.map((ds, idx) => {
    const isCutoff = ds.role === 'benchmark' || (ds.label && (ds.label.toLowerCase().includes('seuil') || ds.label.toLowerCase().includes('cutoff')));
    const isMainTrunk = ds.label && (ds.label.toLowerCase().includes('jonction') || ds.label.toLowerCase().includes('tronc'));

    let color = getColor(tokens, idx);
    let borderDash = [];
    let borderWidth = isTufte ? 1.5 : 2;
    let pointRadius = 3;

    if (ds.role) {
      const emp = getEmphasisStyle(tokens, ds.role, { borderWidth: isTufte ? 1.5 : (ds.role === 'focal' ? 3 : 2) });
      color = emp.borderColor || emp.backgroundColor || color;
      borderWidth = emp.borderWidth !== undefined ? emp.borderWidth : borderWidth;
      borderDash = emp.borderDash || borderDash;
      if (ds.role === 'benchmark') {
        pointRadius = 0;
      }
    } else if (ds.valence !== undefined || ds.delta !== undefined) {
      color = getValenceColor(tokens, ds.valence !== undefined ? ds.valence : ds.delta, ds.metricType || 'gain');
    } else if (isCutoff) {
      const emp = getEmphasisStyle(tokens, 'benchmark');
      color = emp.borderColor || tokens.semantic?.warning || '#F59E0B';
      borderDash = emp.borderDash || [6, 6];
      borderWidth = 1.5;
      pointRadius = 0;
    } else if (isMainTrunk) {
      color = tokens.textMuted || '#64748B';
      borderWidth = 1.5;
      pointRadius = 0;
    } else {
      color = isTufte ? (idx === 0 ? tokens.palette[0] : tokens.palette[1]) : getColor(tokens, idx);
    }

    const dataPoints = (ds.data || []).map(p => {
      if (typeof p === 'object' && p !== null) {
        return {
          x: typeof p.x === 'number' ? p.x : 0,
          y: typeof p.y === 'number' ? p.y : 0
        };
      }
      return { x: 0, y: 0 };
    });

    return {
      label: ds.label || `Branche ${idx + 1}`,
      data: dataPoints,
      borderColor: color,
      backgroundColor: color,
      borderWidth,
      borderDash,
      pointRadius,
      pointHitRadius: 12,
      pointHoverRadius: 6,
      fill: false,
      stepped: false,
      showLine: true
    };
  });

  const leafLabels = rawData.labels || [
    'Feuille 1', 'Feuille 2', 'Feuille 3', 'Feuille 4', 'Feuille 5', 'Feuille 6'
  ];

  const chartData = {
    datasets
  };

  const defaultOpts = getChartDefaultOptions(tokens);

  const config = {
    type: 'line',
    data: chartData,
    options: {
      scales: {},
      ...defaultOpts,
      animation: getAccessibleAnimationOptions(tokens, {
        duration: (isTufte || reduceMotion) ? 0 : 400,
        easing: 'easeOutQuart'
      }),
      interaction: {
        mode: 'nearest',
        intersect: false,
        axis: 'xy'
      },
      hover: {
        mode: 'nearest',
        intersect: false,
        animationDuration: (isTufte || reduceMotion) ? 0 : 100
      },
      plugins: {
        ...defaultOpts.plugins,
        legend: {
          display: datasets.length > 1 && !isTufte,
          position: 'top',
          align: 'end',
          labels: {
            color: tokens.textPrimary,
            usePointStyle: true,
            boxWidth: 8,
            font: {
              family: tokens.fontFamily,
              size: 11
            }
          }
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          backgroundColor: tokens.tooltipBg || '#0F172A',
          titleColor: tokens.tooltipText || '#F8FAFC',
          bodyColor: tokens.tooltipText || '#F8FAFC',
          borderColor: tokens.borderStrong || tokens.border || '#334155',
          borderWidth: 1,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          boxPadding: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '400'
          },
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              const raw = items[0].raw;
              const leafIndex = Math.round(raw?.y);
              const label = leafLabels[leafIndex - 1];
              return label ? `Feuille : ${label}` : `Nœud (y = ${raw?.y})`;
            },
            label: (item) => {
              const raw = item.raw;
              const formattedX = typeof raw.x === 'number' ? raw.x.toLocaleString('fr-FR') : raw.x;
              return [
                ` Distance de dissimilarité : ${formattedX}`,
                ` Position taxonomique : ${raw.y}`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          title: {
            display: true,
            text: 'Distance de Dissimilarité (Indice de Ward / Hauteur)',
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11,
              weight: '500'
            }
          },
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 6
          }
        },
        y: {
          type: 'linear',
          min: 0.2,
          max: leafLabels.length + 0.8,
          grid: {
            display: false,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            stepSize: 1,
            color: tokens.textPrimary,
            font: {
              family: tokens.fontFamily,
              size: 11,
              weight: '500'
            },
            padding: 8,
            callback: (val) => {
              const idx = Math.round(val) - 1;
              return leafLabels[idx] || '';
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Simulation mock pour environnement Node.js headless
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;
  moduleExports.getEmphasisStyle = moduleExports.getEmphasisStyle;
  moduleExports.getValenceColor = moduleExports.getValenceColor;
  moduleExports.getThresholdStatus = moduleExports.getThresholdStatus;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/07-hierarchie-reseau/marimekko-chart
  // --------------------------------------------------------------------------
  global.KitCharts["marimekko-chart"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function() { return ''; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function() { return {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function() { return {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function() { return {}; };
  const getExecutiveModeOptions = (KitChartsTheme && KitChartsTheme.getExecutiveModeOptions) || (typeof window !== 'undefined' && window.getExecutiveModeOptions) || function() { return {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 07-hierarchie-reseau/marimekko-chart/template.js
 * @description Template Chart.js v4+ pour Graphique Marimekko / Mosaïque (Marimekko / Mekko / Mosaic Chart).
 * Psychophysique: Encodage bidimensionnel proportionnel (Cleveland-McGill: aire 2D = largeur de colonne x hauteur de segment).
 * Règle cognitive: Tri décroissant des colonnes et des segments, bordures blanches nettes, repères de pourcentages.
 */

/**
 * Données par défaut représentatives (Marché automobile européen par segment et motorisation)
 */
const DEFAULT_DATA = {
  datasets: [{
    label: 'Marché Automobile Européen (% x %)',
    data: [
      // 1. SUV (Part de marché totale = 45%)
      { col: 'SUV (45%)', sub: 'Électrique (BEV)', v: 38, colWeight: 0.45, subShare: 0.38, label: 'SUV - Électrique', role: 'focal', growth: 34.2 },
      { col: 'SUV (45%)', sub: 'Hybride (HEV/PHEV)', v: 42, colWeight: 0.45, subShare: 0.42, label: 'SUV - Hybride', role: 'context', growth: 12.0 },
      { col: 'SUV (45%)', sub: 'Thermique Pur', v: 20, colWeight: 0.45, subShare: 0.20, label: 'SUV - Thermique', role: 'context', growth: -18.5 },

      // 2. Berlines & Compactes (Part de marché totale = 35%)
      { col: 'Berlines & Compactes (35%)', sub: 'Électrique (BEV)', v: 45, colWeight: 0.35, subShare: 0.45, label: 'Berlines - Électrique', role: 'focal', growth: 26.5 },
      { col: 'Berlines & Compactes (35%)', sub: 'Hybride (HEV/PHEV)', v: 35, colWeight: 0.35, subShare: 0.35, label: 'Berlines - Hybride', role: 'context', growth: 8.4 },
      { col: 'Berlines & Compactes (35%)', sub: 'Thermique Pur', v: 20, colWeight: 0.35, subShare: 0.20, label: 'Berlines - Thermique', role: 'context', growth: -22.1 },

      // 3. Citadines (Part de marché totale = 20%)
      { col: 'Citadines (20%)', sub: 'Électrique (BEV)', v: 50, colWeight: 0.20, subShare: 0.50, label: 'Citadines - Électrique', role: 'focal', growth: 41.0 },
      { col: 'Citadines (20%)', sub: 'Hybride (HEV/PHEV)', v: 25, colWeight: 0.20, subShare: 0.25, label: 'Citadines - Hybride', role: 'context', growth: 4.1 },
      { col: 'Citadines (20%)', sub: 'Thermique Pur', v: 25, colWeight: 0.20, subShare: 0.25, label: 'Citadines - Thermique', role: 'anomaly', growth: -28.0 }
    ]
  }]
};

/**
 * Normalise un jeu de données quelconque en matrice Mekko avec calculs des coordonnées et dimensions.
 *
 * @param {Array} rawItems
 * @returns {Array} Éléments normalisés avec { x, y, w, h, v, col, sub, label, subIndex, role, growth }
 */
function normalizeMekkoData(rawItems) {
  if (!Array.isArray(rawItems) || !rawItems.length) return [];

  // Vérification si données déjà au format Mekko (avec colWeight ou w/h)
  const columnsMap = new Map();

  for (const item of rawItems) {
    const colName = item.col || (typeof item.x === 'string' ? item.x : `Col-${item.x ?? 0}`);
    const subName = item.sub || (typeof item.y === 'string' ? item.y : `Sub-${item.y ?? 0}`);
    const val = typeof item.v === 'number' ? item.v : (typeof item.value === 'number' ? item.value : (Number(item.y) || 10));
    const widthHint = typeof item.colWeight === 'number' ? item.colWeight : (typeof item.width === 'number' ? item.width / 100 : (typeof item.w === 'number' ? item.w : null));

    if (!columnsMap.has(colName)) {
      columnsMap.set(colName, { name: colName, widthHint, items: [] });
    }
    columnsMap.get(colName).items.push({
      colName,
      subName,
      val,
      rawItem: item
    });
  }

  // Calcul du poids de chaque colonne
  const columns = Array.from(columnsMap.values());
  let totalColumnWeight = 0;
  for (const col of columns) {
    if (col.widthHint !== null && col.widthHint > 0) {
      col.weight = col.widthHint;
    } else {
      col.weight = col.items.reduce((sum, it) => sum + Math.max(0, it.val), 0) || 1;
    }
    totalColumnWeight += col.weight;
  }

  // Normalisation des largeurs de colonnes sur [0, 1]
  let currentCumX = 0;
  const result = [];
  const distinctSubs = Array.from(new Set(rawItems.map(it => it.sub || (typeof it.y === 'string' ? it.y : `Sub-${it.y ?? 0}`))));

  for (const col of columns) {
    const colFraction = totalColumnWeight > 0 ? (col.weight / totalColumnWeight) : (1 / columns.length);
    const colCenterX = currentCumX + colFraction / 2;

    const colTotalVal = col.items.reduce((sum, it) => sum + Math.max(0, it.val), 0) || 1;
    let currentCumY = 0;

    for (const item of col.items) {
      const segFraction = Math.max(0, item.val) / colTotalVal;
      const segCenterY = currentCumY + segFraction / 2;
      const subIdx = distinctSubs.indexOf(item.subName);

      result.push({
        x: colCenterX,
        y: segCenterY,
        w: colFraction,
        h: segFraction,
        v: item.val,
        col: item.colName,
        sub: item.subName,
        label: item.rawItem.label || `${item.colName} - ${item.subName}`,
        role: item.rawItem.role || null,
        growth: typeof item.rawItem.growth === 'number' ? item.rawItem.growth : null,
        marketShare: (colFraction * segFraction * 100).toFixed(1),
        subSharePct: (segFraction * 100).toFixed(1),
        colWeightPct: (colFraction * 100).toFixed(1),
        subIndex: subIdx >= 0 ? subIdx : 0
      });

      currentCumY += segFraction;
    }

    currentCumX += colFraction;
  }

  return result;
}

/**
 * Crée et initialise un graphique Marimekko dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  // Destruction propre de l'instance précédente
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const isDark = Boolean(tokens.isDark);
  const reduceMotion = isReducedMotionPreferred();

  const rawData = customData || DEFAULT_DATA;
  const rawItems = (rawData.datasets && rawData.datasets[0]?.data) || (Array.isArray(rawData) ? rawData : []);
  const normalizedData = normalizeMekkoData(rawItems);

  const distinctSubNames = Array.from(new Set(normalizedData.map(d => d.sub)));

  const datasets = distinctSubNames.map((subName, sIdx) => {
    const itemsOfSub = normalizedData.filter(d => d.sub === subName);
    let baseColor = getColor(tokens, sIdx);

    const dataPoints = itemsOfSub.map(it => {
      let color = baseColor;
      let borderColor = isDark ? tokens.surface : '#FFFFFF';
      let borderWidth = isTufte ? 1 : 2;

      if (it.role) {
        const emp = getEmphasisStyle(tokens, it.role);
        color = emp.backgroundColor || color;
        borderColor = emp.borderColor || borderColor;
        borderWidth = emp.borderWidth !== undefined ? emp.borderWidth : borderWidth;
      } else if (it.growth !== null) {
        if (it.growth > 25) {
          color = getValenceColor(tokens, 'up', 'gain');
        } else if (it.growth < -20) {
          color = getValenceColor(tokens, 'down', 'gain');
        }
      }

      return {
        x: it.x,
        y: it.y,
        w: it.w,
        h: it.h,
        v: it.v,
        col: it.col,
        sub: it.sub,
        label: it.label,
        role: it.role,
        growth: it.growth,
        marketShare: it.marketShare,
        subSharePct: it.subSharePct,
        colWeightPct: it.colWeightPct,
        color,
        borderColor,
        borderWidth
      };
    });

    return {
      label: subName,
      data: dataPoints,
      backgroundColor: dataPoints.map(d => d.color),
      borderColor: dataPoints.map(d => d.borderColor),
      borderWidth: dataPoints.map(d => d.borderWidth),
      pointRadius: (ctx) => {
        const item = ctx.raw;
        return item ? 8 : 4;
      },
      pointHoverRadius: 10,
      pointHitRadius: 12
    };
  });

  const chartData = {
    datasets
  };

  const defaultOpts = getChartDefaultOptions(tokens);

  const config = {
    type: 'scatter',
    data: chartData,
    options: {
      scales: {},
      ...defaultOpts,
      animation: getAccessibleAnimationOptions(tokens, {
        duration: (isTufte || reduceMotion) ? 0 : 400,
        easing: 'easeOutQuart'
      }),
      interaction: {
        mode: 'nearest',
        intersect: true
      },
      hover: {
        mode: 'nearest',
        intersect: true,
        animationDuration: (isTufte || reduceMotion) ? 0 : 100
      },
      plugins: {
        ...defaultOpts.plugins,
        legend: {
          display: !isTufte && distinctSubNames.length > 1,
          position: 'top',
          align: 'end',
          labels: {
            color: tokens.textPrimary,
            usePointStyle: true,
            boxWidth: 8,
            font: {
              family: tokens.fontFamily,
              size: 11
            }
          }
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          backgroundColor: tokens.tooltipBg || '#0F172A',
          titleColor: tokens.tooltipText || '#F8FAFC',
          bodyColor: tokens.tooltipText || '#F8FAFC',
          borderColor: tokens.borderStrong || tokens.border || '#334155',
          borderWidth: 1,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          boxPadding: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '400'
          },
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              return items[0].raw?.label || 'Segment Mekko';
            },
            label: (item) => {
              const raw = item.raw;
              if (!raw) return '';
              const growthInfo = typeof raw.growth === 'number'
                ? ` Évolution A/A-1 : ${raw.growth > 0 ? '+' : ''}${raw.growth}%`
                : '';
              const roleInfo = raw.role ? ` [${raw.role.toUpperCase()}]` : '';
              return [
                ` Segment : ${raw.col} (Poids: ${raw.colWeightPct}%)`,
                ` Catégorie : ${raw.sub} (Part: ${raw.subSharePct}%)${roleInfo}`,
                ` Volume Global : ${raw.marketShare}% du marché total`,
                ...(growthInfo ? [growthInfo] : [])
              ];
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Simulation mock pour environnement Node.js headless
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;
  moduleExports.getEmphasisStyle = moduleExports.getEmphasisStyle;
  moduleExports.getValenceColor = moduleExports.getValenceColor;
  moduleExports.getThresholdStatus = moduleExports.getThresholdStatus;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/07-hierarchie-reseau/node-link-network
  // --------------------------------------------------------------------------
  global.KitCharts["node-link-network"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function() { return ''; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function() { return {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function() { return {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function() { return {}; };
  const getExecutiveModeOptions = (KitChartsTheme && KitChartsTheme.getExecutiveModeOptions) || (typeof window !== 'undefined' && window.getExecutiveModeOptions) || function() { return {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 07-hierarchie-reseau/node-link-network/template.js
 * @description Template Chart.js v4+ pour Réseau Nœuds-Liens (Force-Directed / Node-Link Network).
 * Psychophysique: Encodage topologique de relations et centralité (Cleveland-McGill: position spatiale + aire du nœud).
 * Règle cognitive: Finesse et transparence des arêtes pour éviter l'effet 'Hairball', clustering par couleur qualitative.
 */

/**
 * Données par défaut représentatives (Architecture micro-services et flux de données)
 */
const DEFAULT_DATA = {
  datasets: [{
    label: 'Services & Modules',
    data: [
      { x: 50, y: 85, r: 16, id: 'api-gw', label: 'API Gateway', cluster: 0, connections: 4, role: 'focal' },
      { x: 25, y: 65, r: 12, id: 'auth-svc', label: 'Auth Service', cluster: 1, connections: 2, role: 'context' },
      { x: 75, y: 65, r: 13, id: 'user-svc', label: 'User Service', cluster: 1, connections: 3, role: 'context' },
      { x: 40, y: 45, r: 14, id: 'order-engine', label: 'Order Engine', cluster: 2, connections: 4, role: 'focal' },
      { x: 15, y: 35, r: 11, id: 'pay-gw', label: 'Payment Gateway', cluster: 2, connections: 2, role: 'context' },
      { x: 65, y: 45, r: 13, id: 'inventory-svc', label: 'Inventory Service', cluster: 3, connections: 3, role: 'context' },
      { x: 85, y: 25, r: 15, id: 'primary-db', label: 'Primary PostgreSQL', cluster: 3, connections: 3, role: 'focal' },
      { x: 50, y: 20, r: 12, id: 'cache-redis', label: 'Redis Cache Cluster', cluster: 3, connections: 3, role: 'anomaly' },
      { x: 30, y: 15, r: 10, id: 'analytics-bus', label: 'Kafka Event Bus', cluster: 4, connections: 2, role: 'context' }
    ]
  }],
  links: [
    { source: 0, target: 1, weight: 3, role: 'context' },
    { source: 0, target: 2, weight: 3, role: 'context' },
    { source: 0, target: 3, weight: 4, role: 'focal' },
    { source: 1, target: 2, weight: 2, role: 'context' },
    { source: 3, target: 4, weight: 3, role: 'context' },
    { source: 3, target: 5, weight: 3, role: 'context' },
    { source: 2, target: 6, weight: 2, role: 'context' },
    { source: 5, target: 6, weight: 3, role: 'focal' },
    { source: 3, target: 7, weight: 2, role: 'anomaly', label: 'Latence Critique' },
    { source: 5, target: 7, weight: 2, role: 'anomaly', label: 'Timeout Détecté' },
    { source: 4, target: 8, weight: 2, role: 'context' },
    { source: 3, target: 8, weight: 2, role: 'context' }
  ]
};

/**
 * Plugin Canvas Chart.js pour le tracé des liens / arêtes entre les nœuds.
 */
const networkLinksPlugin = {
  id: 'networkLinksPlugin',
  beforeDatasetsDraw(chart) {
    const { ctx, data, scales } = chart;
    const xScale = scales.x;
    const yScale = scales.y;
    if (!xScale || !yScale) return;

    const rawData = data;
    const links = rawData.links || (rawData.datasets && rawData.datasets[0]?.links) || [];
    const nodes = rawData.datasets && rawData.datasets[0]?.data ? rawData.datasets[0].data : [];
    if (!links.length || !nodes.length) return;

    ctx.save();
    const isDark = chart.options?.plugins?.networkMeta?.isDark;
    const tokens = chart.options?.plugins?.networkMeta?.tokens || {};

    for (const link of links) {
      let sourceNode = null;
      let targetNode = null;

      if (typeof link.source === 'number') {
        sourceNode = nodes[link.source];
      } else if (typeof link.source === 'string') {
        sourceNode = nodes.find(n => n.id === link.source || n.label === link.source);
      } else if (link.source && typeof link.source === 'object') {
        sourceNode = link.source;
      }

      if (typeof link.target === 'number') {
        targetNode = nodes[link.target];
      } else if (typeof link.target === 'string') {
        targetNode = nodes.find(n => n.id === link.target || n.label === link.target);
      } else if (link.target && typeof link.target === 'object') {
        targetNode = link.target;
      }

      if (!sourceNode || !targetNode) continue;

      const x1 = xScale.getPixelForValue(sourceNode.x);
      const y1 = yScale.getPixelForValue(sourceNode.y);
      const x2 = xScale.getPixelForValue(targetNode.x);
      const y2 = yScale.getPixelForValue(targetNode.y);

      if (!Number.isFinite(x1) || !Number.isFinite(y1) || !Number.isFinite(x2) || !Number.isFinite(y2)) {
        continue;
      }

      let strokeColor = isDark ? 'rgba(216, 222, 233, 0.28)' : 'rgba(71, 85, 105, 0.25)';
      let strokeWidth = Math.max(1, Math.min(4, link.weight || 1.5));
      let isDashed = false;

      if (link.role === 'anomaly' || (link.label && (link.label.toLowerCase().includes('latence') || link.label.toLowerCase().includes('timeout') || link.label.toLowerCase().includes('erreur')))) {
        strokeColor = (tokens.status && tokens.status.danger) || (tokens.emphasis && tokens.emphasis.anomaly) || '#C62828';
        strokeWidth = Math.max(2, strokeWidth);
        isDashed = true;
      } else if (link.role === 'focal') {
        strokeColor = (tokens.emphasis && tokens.emphasis.focal) || strokeColor;
        strokeWidth = Math.max(2.5, strokeWidth + 1);
      }

      ctx.beginPath();
      if (isDashed) {
        ctx.setLineDash([4, 3]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = strokeColor;
      ctx.stroke();
    }

    ctx.restore();
  }
};

/**
 * Crée et initialise un graphique Node-Link Network dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  // Destruction propre de l'instance précédente
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const isDark = Boolean(tokens.isDark);
  const reduceMotion = isReducedMotionPreferred();

  const rawData = customData || DEFAULT_DATA;
  const rawNodes = (rawData.datasets && rawData.datasets[0]?.data) ? rawData.datasets[0].data : (Array.isArray(rawData.nodes) ? rawData.nodes : []);
  const links = rawData.links || (rawData.datasets && rawData.datasets[0]?.links) || [];

  const processedData = rawNodes.map((node, idx) => {
    let nodeColor = getColor(tokens, node.cluster !== undefined ? node.cluster : idx);
    let nodeRadius = typeof node.r === 'number' ? node.r : 10;
    let nodeBorderColor = isDark ? tokens.surface : '#FFFFFF';
    let nodeBorderWidth = 2;

    if (node.role) {
      const emp = getEmphasisStyle(tokens, node.role, { radius: nodeRadius });
      nodeColor = emp.backgroundColor || nodeColor;
      nodeBorderColor = emp.borderColor || nodeBorderColor;
      nodeBorderWidth = emp.borderWidth !== undefined ? emp.borderWidth : 2;
    } else if (node.valence !== undefined || node.delta !== undefined) {
      nodeColor = getValenceColor(tokens, node.valence !== undefined ? node.valence : node.delta, node.metricType || 'gain');
    }

    return {
      x: typeof node.x === 'number' ? node.x : Math.random() * 80 + 10,
      y: typeof node.y === 'number' ? node.y : Math.random() * 80 + 10,
      r: isTufte ? Math.max(4, nodeRadius * 0.75) : nodeRadius,
      id: node.id || `node-${idx}`,
      label: node.label || `Nœud ${idx + 1}`,
      cluster: node.cluster !== undefined ? node.cluster : 0,
      role: node.role || null,
      connections: node.connections || 1,
      color: nodeColor,
      borderColor: nodeBorderColor,
      borderWidth: nodeBorderWidth
    };
  });

  const datasetLabel = (rawData.datasets && rawData.datasets[0]?.label) || 'Entités Réseau';

  const chartData = {
    datasets: [{
      label: datasetLabel,
      data: processedData,
      backgroundColor: processedData.map(d => d.color),
      borderColor: processedData.map(d => d.borderColor),
      borderWidth: processedData.map(d => d.borderWidth),
      pointRadius: (ctx) => {
        const item = ctx.raw;
        return item && typeof item.r === 'number' ? item.r : 8;
      },
      pointHoverRadius: (ctx) => {
        const item = ctx.raw;
        return item && typeof item.r === 'number' ? item.r + 4 : 12;
      },
      pointHitRadius: 14
    }],
    links
  };

  const defaultOpts = getChartDefaultOptions(tokens);

  const config = {
    type: 'scatter',
    data: chartData,
    options: {
      scales: {},
      ...defaultOpts,
      animation: getAccessibleAnimationOptions(tokens, {
        duration: (isTufte || reduceMotion) ? 0 : 400,
        easing: 'easeOutQuart'
      }),
      interaction: {
        mode: 'nearest',
        intersect: false,
        axis: 'xy'
      },
      hover: {
        mode: 'nearest',
        intersect: false,
        animationDuration: (isTufte || reduceMotion) ? 0 : 100
      },
      plugins: {
        ...defaultOpts.plugins,
        legend: {
          display: false
        },
        networkMeta: {
          isDark,
          tokens
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          backgroundColor: tokens.tooltipBg || '#0F172A',
          titleColor: tokens.tooltipText || '#F8FAFC',
          bodyColor: tokens.tooltipText || '#F8FAFC',
          borderColor: tokens.borderStrong || tokens.border || '#334155',
          borderWidth: 1,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          boxPadding: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '400'
          },
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              const raw = items[0].raw;
              const roleInfo = raw?.role ? ` [${raw.role.toUpperCase()}]` : '';
              return `${raw?.label || `Nœud (${raw?.x}, ${raw?.y})`}${roleInfo}`;
            },
            label: (item) => {
              const raw = item.raw;
              const clusterName = `Communauté ${raw?.cluster !== undefined ? raw.cluster + 1 : 1}`;
              const radiusInfo = raw?.r ? `Rayon: ${raw.r}px` : `Coord: [${raw?.x}, ${raw?.y}]`;
              const statusInfo = raw?.role === 'anomaly' ? 'État : Dégradé / Alerte Latence' : 'État : Nominal';
              return [` ${clusterName}`, ` ${radiusInfo}`, ` ${statusInfo}`];
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 6
          }
        },
        y: {
          grid: {
            color: tokens.gridColor,
            lineWidth: 1,
            drawBorder: false
          },
          border: { display: false },
          ticks: {
            color: tokens.textSecondary,
            font: {
              family: tokens.fontFamily,
              size: 11
            },
            padding: 8
          }
        }
      }
    },
    plugins: [networkLinksPlugin]
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Simulation mock pour environnement Node.js headless
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;
  moduleExports.getEmphasisStyle = moduleExports.getEmphasisStyle;
  moduleExports.getValenceColor = moduleExports.getValenceColor;
  moduleExports.getThresholdStatus = moduleExports.getThresholdStatus;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/08-geospatial-cartes/bubble-map
  // --------------------------------------------------------------------------
  global.KitCharts["bubble-map"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function() { return ''; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function() { return {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function() { return {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function() { return {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const getDataLabelOptions = (KitChartsTheme && KitChartsTheme.getDataLabelOptions) || (typeof window !== 'undefined' && window.getDataLabelOptions) || function(t, o) { return o || {}; };
  const kitChartsDataLabelsPlugin = (KitChartsTheme && KitChartsTheme.kitChartsDataLabelsPlugin) || (typeof window !== 'undefined' && window.kitChartsDataLabelsPlugin) || null;
  const formatLabelValue = (KitChartsTheme && KitChartsTheme.formatLabelValue) || (typeof window !== 'undefined' && window.formatLabelValue) || function(v) { return String(v); };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

const EUROPE_DATA = {"type":"FeatureCollection","features":[{"type":"Feature","id":"FRA","properties":{"name":"France","value":2800,"capital":"Paris","lat":48.8566,"lon":2.3522,"code":"FR"},"geometry":{"type":"Polygon","coordinates":[[[-4.8,48.4],[-1.9,49.7],[0.1,49.4],[1.6,50.1],[2.5,51.1],[4.2,49.9],[6.2,49.5],[7.7,49],[7.5,47.6],[6.8,45.9],[7.2,43.7],[5.3,43.3],[3.1,42.4],[1.8,42.5],[-1.8,43.4],[-1.2,46],[-3,47.6],[-4.8,48.4]]]}},{"type":"Feature","id":"DEU","properties":{"name":"Allemagne","value":4100,"capital":"Berlin","lat":52.52,"lon":13.405,"code":"DE"},"geometry":{"type":"Polygon","coordinates":[[[6,50.8],[6.9,53.6],[8.6,54.9],[10,54.4],[13.7,54.3],[14.2,53.9],[14.8,51.8],[15,51.1],[12.1,50.3],[13,47.7],[10,47.5],[7.6,49],[6.2,49.5],[6,50.8]]]}},{"type":"Feature","id":"GBR","properties":{"name":"Royaume-Uni","value":3100,"capital":"Londres","lat":51.5074,"lon":-0.1278,"code":"UK"},"geometry":{"type":"Polygon","coordinates":[[[-5.7,50],[-3,50.6],[1.4,51.2],[1.7,52.5],[0.1,53.8],[-1.8,55.8],[-2,57.5],[-3,58.6],[-5,58.6],[-5.6,55.4],[-3,53.4],[-5,51.5],[-5.7,50]]]}},{"type":"Feature","id":"ITA","properties":{"name":"Italie","value":2100,"capital":"Rome","lat":41.9028,"lon":12.4964,"code":"IT"},"geometry":{"type":"Polygon","coordinates":[[[6.8,45.9],[10.5,46.5],[13.8,46.5],[13,45.6],[12.3,44],[15,41.9],[18.5,40.2],[16.8,38.9],[15.8,38],[15.6,38.2],[14.8,40.8],[11.5,42.5],[9.5,44],[7.5,44.2],[6.8,45.9]]]}},{"type":"Feature","id":"ESP","properties":{"name":"Espagne","value":1500,"capital":"Madrid","lat":40.4168,"lon":-3.7038,"code":"ES"},"geometry":{"type":"Polygon","coordinates":[[[-9.3,43],[-1.8,43.4],[3.1,42.4],[3.3,41.9],[0.2,38.8],[-0.8,37.8],[-2.2,36.7],[-5.6,36],[-7.4,37.2],[-6.9,38],[-6.5,42],[-8.9,41.8],[-9.3,43]]]}},{"type":"Feature","id":"PRT","properties":{"name":"Portugal","value":260,"capital":"Lisbonne","lat":38.7223,"lon":-9.1393,"code":"PT"},"geometry":{"type":"Polygon","coordinates":[[[-8.9,41.8],[-6.5,42],[-6.9,38],[-7.4,37.2],[-9,37],[-9.5,38.7],[-8.9,41.8]]]}},{"type":"Feature","id":"NLD","properties":{"name":"Pays-Bas","value":1050,"capital":"Amsterdam","lat":52.3676,"lon":4.9041,"code":"NL"},"geometry":{"type":"Polygon","coordinates":[[[3.4,51.4],[4.7,52.9],[6.9,53.6],[7.1,53.2],[6,51.8],[5,51.4],[3.4,51.4]]]}},{"type":"Feature","id":"BEL","properties":{"name":"Belgique","value":580,"capital":"Bruxelles","lat":50.8503,"lon":4.3517,"code":"BE"},"geometry":{"type":"Polygon","coordinates":[[[2.5,51.1],[3.4,51.4],[5.9,50.8],[6.4,50.3],[5.8,49.5],[4.2,49.9],[2.5,51.1]]]}},{"type":"Feature","id":"CHE","properties":{"name":"Suisse","value":870,"capital":"Berne","lat":46.948,"lon":7.4474,"code":"CH"},"geometry":{"type":"Polygon","coordinates":[[[6,46.2],[6,47.5],[8.6,47.8],[10.5,46.9],[9,45.8],[6.8,45.9],[6,46.2]]]}},{"type":"Feature","id":"POL","properties":{"name":"Pologne","value":750,"capital":"Varsovie","lat":52.2297,"lon":21.0122,"code":"PL"},"geometry":{"type":"Polygon","coordinates":[[[14.2,53.9],[18.6,54.8],[22.8,54.3],[24.1,52.7],[23.5,50],[22.7,49],[18.9,49.5],[15,51.1],[14.2,53.9]]]}},{"type":"Feature","id":"AUT","properties":{"name":"Autriche","value":480,"capital":"Vienne","lat":48.2082,"lon":16.3738,"code":"AT"},"geometry":{"type":"Polygon","coordinates":[[[9.5,47.5],[13,47.7],[15,48.8],[17,48],[16,46.8],[13.8,46.5],[10.5,46.9],[9.5,47.5]]]}},{"type":"Feature","id":"SWE","properties":{"name":"Suède","value":590,"capital":"Stockholm","lat":59.3293,"lon":18.0686,"code":"SE"},"geometry":{"type":"Polygon","coordinates":[[[11.2,58.9],[12.8,56.3],[14.5,55.4],[16,56.5],[19,60],[24.1,65.8],[20.6,68.5],[14,64],[12,63.5],[11.2,58.9]]]}},{"type":"Feature","id":"NOR","properties":{"name":"Norvège","value":520,"capital":"Oslo","lat":59.9139,"lon":10.7522,"code":"NO"},"geometry":{"type":"Polygon","coordinates":[[[5,62],[6,58.5],[10,58],[11.2,58.9],[12,63.5],[14,64],[20.6,68.5],[28,71],[14,68],[5,62]]]}},{"type":"Feature","id":"IRL","properties":{"name":"Irlande","value":500,"capital":"Dublin","lat":53.3498,"lon":-6.2603,"code":"IE"},"geometry":{"type":"Polygon","coordinates":[[[-10.5,51.5],[-6,52.2],[-6,54],[-7.5,55.3],[-10,54.2],[-10.5,51.5]]]}}]};

const DEFAULT_DATA = {
  title: 'Investissements Métropoles Européennes (M€)',
  features: EUROPE_DATA.features,
  bubbles: [
    { city: 'Paris', lon: 2.3522, lat: 48.8566, val: 3400, role: 'focal', growth: 14.5 },
    { city: 'Londres', lon: -0.1278, lat: 51.5074, val: 3800, role: 'focal', growth: 18.2 },
    { city: 'Berlin', lon: 13.4050, lat: 52.5200, val: 2600, role: 'context', growth: 6.1 },
    { city: 'Madrid', lon: -3.7038, lat: 40.4168, val: 1900, role: 'context', growth: 3.4 },
    { city: 'Rome', lon: 12.4964, lat: 41.9028, val: 1400, role: 'anomaly', growth: -8.5 },
    { city: 'Amsterdam', lon: 4.9041, lat: 52.3676, val: 2100, role: 'context', growth: 9.0 },
    { city: 'Bruxelles', lon: 4.3517, lat: 50.8503, val: 1100, role: 'context', growth: 2.1 },
    { city: 'Stockholm', lon: 18.0686, lat: 59.3293, val: 1300, role: 'context', growth: 5.5 },
    { city: 'Dublin', lon: -6.2603, lat: 53.3498, val: 1600, role: 'focal', growth: 22.0 }
  ]
};

function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME, options = {}) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) throw new Error('Canvas not found');

  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const reduceMotion = isReducedMotionPreferred();
  const showDataLabels = (customData && customData.showDataLabels !== undefined) ? customData.showDataLabels : (options.showDataLabels !== undefined ? options.showDataLabels : true);

  const rawData = customData || DEFAULT_DATA;
  const features = rawData.features || EUROPE_DATA.features;
  const bubbles = rawData.bubbles || DEFAULT_DATA.bubbles;

  const defaultBubbleColor = getColor(tokens, 0);

  const bubbleMapPlugin = {
    id: 'bubbleVectorMap_' + Math.random().toString(36).substring(2, 7),
    afterDraw(chart) {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;

      const { left, top, right, bottom, width, height } = chartArea;
      ctx.save();

      const lonMin = -11, lonMax = 28;
      const latMin = 35, latMax = 71;
      const cosLat = Math.cos(50 * Math.PI / 180);

      const geoWidth = (lonMax - lonMin) * cosLat;
      const geoHeight = (latMax - latMin);

      const padding = 12;
      const scale = Math.min((width - padding * 2) / geoWidth, (height - padding * 2) / geoHeight);

      const mapPixelWidth = geoWidth * scale;
      const mapPixelHeight = geoHeight * scale;
      const offsetX = left + (width - mapPixelWidth) / 2;
      const offsetY = top + (height - mapPixelHeight) / 2;

      const project = (lon, lat) => {
        const x = offsetX + (lon - lonMin) * cosLat * scale;
        const y = offsetY + (latMax - lat) * scale;
        return [x, y];
      };

      // 1. Draw Basemap Polygons
      features.forEach((feature) => {
        const coords = feature.geometry.coordinates[0];
        if (!coords || coords.length < 3) return;

        ctx.beginPath();
        const [startX, startY] = project(coords[0][0], coords[0][1]);
        ctx.moveTo(startX, startY);

        for (let i = 1; i < coords.length; i++) {
          const [px, py] = project(coords[i][0], coords[i][1]);
          ctx.lineTo(px, py);
        }
        ctx.closePath();

        ctx.fillStyle = tokens.isDark ? '#3B4252' : '#F1F5F9';
        ctx.fill();

        ctx.strokeStyle = tokens.isDark ? '#4C566A' : '#CBD5E1';
        ctx.lineWidth = 1.0;
        ctx.stroke();
      });

      // 2. Draw Proportional Bubbles (r ∝ √V for perceptual accuracy)
      const maxVal = Math.max(...bubbles.map(b => b.val));
      const maxRadius = Math.max(12, Math.min(22, width * 0.045));

      bubbles.forEach((b) => {
        const [bx, by] = project(b.lon, b.lat);
        const radius = Math.sqrt(b.val / maxVal) * maxRadius;

        let bColor = defaultBubbleColor;
        let bAlpha = tokens.isDark ? 0.75 : 0.65;
        let bBorderColor = tokens.bg || '#FFFFFF';
        let bBorderWidth = 1.5;

        if (b.role) {
          const emp = getEmphasisStyle(tokens, b.role);
          bColor = emp.backgroundColor || bColor;
          bBorderColor = emp.borderColor || bBorderColor;
          if (b.role === 'focal') {
            bAlpha = 0.90;
            bBorderWidth = 2.5;
          } else if (b.role === 'anomaly') {
            bAlpha = 0.85;
            bBorderColor = (tokens.status && tokens.status.danger) || '#C62828';
            bBorderWidth = 2.0;
          } else if (b.role === 'context') {
            bAlpha = 0.50;
          }
        } else if (typeof b.growth === 'number' || typeof b.valence === 'number') {
          bColor = getValenceColor(tokens, typeof b.growth === 'number' ? b.growth : b.valence, b.metricType || 'gain');
        }

        // Outer fill
        ctx.beginPath();
        ctx.fillStyle = bColor;
        ctx.globalAlpha = bAlpha;
        ctx.arc(bx, by, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Stroke
        ctx.strokeStyle = bBorderColor;
        ctx.lineWidth = bBorderWidth;
        ctx.stroke();

        // City & Data Label
        if (showDataLabels) {
          ctx.fillStyle = tokens.isDark ? '#ECEFF4' : '#0F172A';
          ctx.font = `600 9px ${tokens.fontFamily || 'sans-serif'}`;
          ctx.textAlign = 'center';
          const labelText = `${b.city} (${formatLabelValue(b.val)})`;
          ctx.fillText(labelText, bx, by - radius - 3);
        }
      });

      ctx.restore();
    }
  };

  const config = {
    type: 'scatter',
    data: { datasets: [{ data: [] }] },
    plugins: [bubbleMapPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: getAccessibleAnimationOptions(tokens, {
        duration: (isTufte || reduceMotion) ? 0 : 400,
        easing: 'easeOutQuart'
      }),
      interaction: {
        mode: 'nearest',
        intersect: false,
        axis: 'xy'
      },
      hover: {
        mode: 'nearest',
        intersect: false,
        animationDuration: (isTufte || reduceMotion) ? 0 : 100
      },
      scales: {
        x: { display: false, grid: { display: false } },
        y: { display: false, grid: { display: false } }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: tokens.tooltipBg || '#0F172A',
          titleColor: tokens.tooltipText || '#F8FAFC',
          bodyColor: tokens.tooltipText || '#F8FAFC',
          borderColor: tokens.borderStrong || tokens.border || '#334155',
          borderWidth: 1,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          boxPadding: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '400'
          },
          callbacks: {
            label: (ctx) => {
              const item = ctx.raw;
              if (!item) return '';
              const formatted = typeof item.val === 'number' ? item.val.toLocaleString('fr-FR') : item.val;
              return ` ${item.city || ''} : ${formatted} M€`;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }
  return {
    canvas,
    config,
    data: config.data,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null,
    isReducedMotionPreferred: typeof isReducedMotionPreferred === 'function' ? isReducedMotionPreferred : null,
    getAccessibleAnimationOptions: typeof getAccessibleAnimationOptions === 'function' ? getAccessibleAnimationOptions : null,
    getSpatialInteractionOptions: typeof getSpatialInteractionOptions === 'function' ? getSpatialInteractionOptions : null,
    getTemporalInteractionOptions: typeof getTemporalInteractionOptions === 'function' ? getTemporalInteractionOptions : null,
    getPartitionInteractionOptions: typeof getPartitionInteractionOptions === 'function' ? getPartitionInteractionOptions : null,
    computeAntiOcclusionTooltipPosition: typeof computeAntiOcclusionTooltipPosition === 'function' ? computeAntiOcclusionTooltipPosition : null,
    getDataLabelOptions: typeof getDataLabelOptions === 'function' ? getDataLabelOptions : null,
    formatLabelValue: typeof formatLabelValue === 'function' ? formatLabelValue : null,
    kitChartsDataLabelsPlugin: typeof kitChartsDataLabelsPlugin !== 'undefined' ? kitChartsDataLabelsPlugin : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;
  moduleExports.getEmphasisStyle = moduleExports.getEmphasisStyle;
  moduleExports.getValenceColor = moduleExports.getValenceColor;
  moduleExports.getThresholdStatus = moduleExports.getThresholdStatus;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/08-geospatial-cartes/cartogram-tilegram
  // --------------------------------------------------------------------------
  global.KitCharts["cartogram-tilegram"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function() { return ''; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function() { return {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function() { return {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function() { return {}; };
  const getExecutiveModeOptions = (KitChartsTheme && KitChartsTheme.getExecutiveModeOptions) || (typeof window !== 'undefined' && window.getExecutiveModeOptions) || function() { return {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

/**
 * @file 08-geospatial-cartes/cartogram-tilegram/template.js
 * @description Template Chart.js v4+ pour Cartogramme / Grille de Tuiles Égalitaires (Cartogram / Tilegram / Tile Grid Map).
 * Psychophysique: Encodage schématique spatial avec poids visuel identique (Cleveland-McGill: position relative + luminance).
 * Règle cognitive: Égalité visuelle stricte de chaque entité politique/administrative (élimination du biais de surface), sigles centrés, préservation des voisinages cardinaux.
 */

/**
 * Données par défaut représentatives (Indice d'innovation & transition numérique des 13 régions françaises)
 */
const DEFAULT_DATA = {
  datasets: [{
    label: 'Indice d’Innovation Régionale (sur 100)',
    data: [
      // Rangée 1
      { x: 2, y: 1, label: 'HDF', name: 'Hauts-de-France', v: 72, role: 'context', growth: 4.2 },

      // Rangée 2
      { x: 1, y: 2, label: 'NOR', name: 'Normandie', v: 68, role: 'context', growth: 2.5 },
      { x: 2, y: 2, label: 'IDF', name: 'Île-de-France', v: 98, role: 'focal', growth: 16.8 },
      { x: 3, y: 2, label: 'GES', name: 'Grand Est', v: 74, role: 'context', growth: 5.1 },

      // Rangée 3
      { x: 0, y: 3, label: 'BRE', name: 'Bretagne', v: 82, role: 'context', growth: 8.9 },
      { x: 1, y: 3, label: 'PDL', name: 'Pays de la Loire', v: 78, role: 'context', growth: 6.4 },
      { x: 2, y: 3, label: 'CVL', name: 'Centre-Val de Loire', v: 64, role: 'context', growth: 1.8 },
      { x: 3, y: 3, label: 'BFC', name: 'Bourgogne-Franche-Comté', v: 66, role: 'context', growth: 2.0 },

      // Rangée 4
      { x: 1, y: 4, label: 'NAQ', name: 'Nouvelle-Aquitaine', v: 76, role: 'context', growth: 7.2 },
      { x: 2, y: 4, label: 'ARA', name: 'Auvergne-Rhône-Alpes', v: 88, role: 'focal', growth: 12.4 },

      // Rangée 5
      { x: 1, y: 5, label: 'OCC', name: 'Occitanie', v: 80, role: 'context', growth: 9.1 },
      { x: 2, y: 5, label: 'PAC', name: "Provence-Alpes-Côte d'Azur", v: 84, role: 'context', growth: 10.5 },

      // Rangée 6
      { x: 3, y: 6, label: 'COR', name: 'Corse', v: 58, role: 'anomaly', growth: -4.3 }
    ]
  }]
};

/**
 * Plugin Canvas Chart.js pour afficher les sigles régionaux centrés en gras dans chaque tuile.
 */
const tileLabelsPlugin = {
  id: 'tileLabelsPlugin',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    if (!meta || !meta.data) return;

    const tokens = chart.options?.plugins?.tileMeta?.tokens;
    const fontMono = tokens?.fontMono || 'monospace';

    ctx.save();
    ctx.font = `700 11px ${fontMono}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < meta.data.length; i++) {
      const element = meta.data[i];
      const raw = chart.data.datasets[0].data[i];
      if (!element || !raw) continue;

      const code = raw.label || raw.code || (raw.name ? raw.name.substring(0, 3).toUpperCase() : '');
      if (!code) continue;

      const { x, y } = element.getCenterPoint ? element.getCenterPoint() : { x: element.x, y: element.y };
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

      // Calcul de contraste pour lisibilité du texte
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 3;
      ctx.fillText(code, x, y);
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  }
};

/**
 * Crée et initialise un Cartogramme / Tilegramme dans le canvas cible.
 *
 * @param {string|HTMLCanvasElement} canvasTarget - ID du canvas ou élément HTMLCanvasElement
 * @param {Object} [customData=null] - Jeu de données optionnel
 * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème cognitif
 * @returns {Object} Instance Chart.js initialisée
 */
function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) {
    throw new Error(`Canvas element "${canvasTarget}" not found`);
  }

  // Destruction propre de l'instance précédente
  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const isDark = Boolean(tokens.isDark);
  const reduceMotion = isReducedMotionPreferred();

  const rawData = customData || DEFAULT_DATA;
  const rawItems = (rawData.datasets && rawData.datasets[0]?.data) ? rawData.datasets[0].data : [];

  const values = rawItems.map(d => typeof d === 'object' && d !== null ? (d.v ?? d.value ?? 50) : Number(d));
  const minVal = values.length > 0 ? Math.min(...values) : 0;
  const maxVal = values.length > 0 ? Math.max(...values) : 100;
  const valRange = Math.max(1, maxVal - minVal);

  const processedData = rawItems.map((item, idx) => {
    const x = typeof item.x === 'number' ? item.x : (idx % 4);
    const y = typeof item.y === 'number' ? item.y : Math.floor(idx / 4);
    const v = typeof item.v === 'number' ? item.v : (typeof item.value === 'number' ? item.value : 50);
    const code = item.label || item.code || `T${idx + 1}`;
    const name = item.name || `Territoire ${code}`;

    let borderColor = isDark ? tokens.surface : '#FFFFFF';
    let borderWidth = isTufte ? 1.5 : 2;

    if (item.role) {
      const emp = getEmphasisStyle(tokens, item.role);
      borderColor = emp.borderColor || borderColor;
      borderWidth = emp.borderWidth !== undefined ? emp.borderWidth : (item.role === 'focal' ? 3 : borderWidth);
    }

    return {
      x,
      y,
      v,
      label: code,
      name,
      role: item.role || null,
      growth: typeof item.growth === 'number' ? item.growth : null,
      borderColor,
      borderWidth
    };
  });

  const datasetLabel = (rawData.datasets && rawData.datasets[0]?.label) || 'Tuiles Régionales';

  const chartData = {
    datasets: [{
      label: datasetLabel,
      data: processedData,
      borderColor: processedData.map(d => d.borderColor),
      borderWidth: processedData.map(d => d.borderWidth),
      backgroundColor: (ctx) => {
        const raw = ctx.raw;
        if (raw && raw.role === 'focal') {
          const emp = getEmphasisStyle(tokens, 'focal');
          if (emp.backgroundColor) return emp.backgroundColor;
        }
        if (raw && raw.role === 'anomaly') {
          const emp = getEmphasisStyle(tokens, 'anomaly');
          if (emp.backgroundColor) return emp.backgroundColor;
        }
        if (raw && typeof raw.growth === 'number' && raw.role !== 'context') {
          return getValenceColor(tokens, raw.growth, 'gain');
        }
        const v = raw && typeof raw.v === 'number' ? raw.v : 50;
        const ratio = (v - minVal) / valRange;
        return getSequentialColor(tokens, ratio);
      },
      width: ({ chart }) => {
        const area = chart.chartArea;
        const w = area ? area.width / 5.2 : 55;
        return Math.max(25, Math.min(68, w));
      },
      height: ({ chart }) => {
        const area = chart.chartArea;
        const h = area ? area.height / 7.5 : 45;
        return Math.max(25, Math.min(56, h));
      }
    }]
  };

  const defaultOpts = getChartDefaultOptions(tokens);

  const minX = processedData.length > 0 ? Math.min(...processedData.map(d => d.x)) - 0.7 : -0.7;
  const maxX = processedData.length > 0 ? Math.max(...processedData.map(d => d.x)) + 0.7 : 4.7;
  const minY = processedData.length > 0 ? Math.min(...processedData.map(d => d.y)) - 0.7 : 0.3;
  const maxY = processedData.length > 0 ? Math.max(...processedData.map(d => d.y)) + 0.7 : 7.7;

  const config = {
    type: 'matrix',
    data: chartData,
    options: {
      ...defaultOpts,
      animation: getAccessibleAnimationOptions(tokens, {
        duration: (isTufte || reduceMotion) ? 0 : 400,
        easing: 'easeOutQuart'
      }),
      interaction: {
        mode: 'nearest',
        intersect: true
      },
      hover: {
        mode: 'nearest',
        intersect: true,
        animationDuration: (isTufte || reduceMotion) ? 0 : 100
      },
      plugins: {
        ...defaultOpts.plugins,
        legend: {
          display: false
        },
        tileMeta: {
          tokens
        },
        tooltip: {
          ...defaultOpts.plugins.tooltip,
          backgroundColor: tokens.tooltipBg || '#0F172A',
          titleColor: tokens.tooltipText || '#F8FAFC',
          bodyColor: tokens.tooltipText || '#F8FAFC',
          borderColor: tokens.borderStrong || tokens.border || '#334155',
          borderWidth: 1,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          boxPadding: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '400'
          },
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              const raw = items[0].raw;
              const roleInfo = raw?.role ? ` [${raw.role.toUpperCase()}]` : '';
              return `${raw?.name || 'Région'} (${raw?.label || ''})${roleInfo}`;
            },
            label: (item) => {
              const raw = item.raw;
              const formatted = typeof raw?.v === 'number'
                ? new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(raw.v)
                : raw?.v;
              const growthInfo = typeof raw?.growth === 'number'
                ? ` Évolution A/A-1 : ${raw.growth > 0 ? '+' : ''}${raw.growth}%`
                : '';
              return [
                ` Indice mesuré : ${formatted} / 100`,
                ` Position grille : [Col ${raw?.x}, Ligne ${raw?.y}]`,
                ...(growthInfo ? [growthInfo] : [])
              ];
            }
          }
        }
      },
      scales: {
        x: {
          min: minX,
          max: maxX,
          grid: { display: false, drawBorder: false },
          border: { display: false },
          ticks: { display: false }
        },
        y: {
          min: minY,
          max: maxY,
          reverse: false,
          grid: { display: false, drawBorder: false },
          border: { display: false },
          ticks: { display: false }
        }
      }
    },
    plugins: [tileLabelsPlugin]
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }

  // Simulation mock pour environnement Node.js headless
  return {
    canvas,
    config,
    data: chartData,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;
  moduleExports.getEmphasisStyle = moduleExports.getEmphasisStyle;
  moduleExports.getValenceColor = moduleExports.getValenceColor;
  moduleExports.getThresholdStatus = moduleExports.getThresholdStatus;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/08-geospatial-cartes/choropleth-map
  // --------------------------------------------------------------------------
  global.KitCharts["choropleth-map"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getChartDefaultOptions = (KitChartsTheme && KitChartsTheme.getChartDefaultOptions) || (typeof window !== 'undefined' && window.getChartDefaultOptions) || function() { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getSemanticColor = (KitChartsTheme && KitChartsTheme.getSemanticColor) || (typeof window !== 'undefined' && window.getSemanticColor) || function() { return '#999999'; };
  const getSequentialColor = (KitChartsTheme && KitChartsTheme.getSequentialColor) || (typeof window !== 'undefined' && window.getSequentialColor) || function() { return '#3182BD'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return '#2E7D32'; };
  const getEmphasisStyle = (KitChartsTheme && KitChartsTheme.getEmphasisStyle) || (typeof window !== 'undefined' && window.getEmphasisStyle) || function() { return {}; };
  const getThresholdStatus = (KitChartsTheme && KitChartsTheme.getThresholdStatus) || (typeof window !== 'undefined' && window.getThresholdStatus) || function() { return {}; };
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function() { return ''; };
  const isReducedMotionPreferred = (KitChartsTheme && KitChartsTheme.isReducedMotionPreferred) || (typeof window !== 'undefined' && window.isReducedMotionPreferred) || function() { return false; };
  const getAccessibleAnimationOptions = (KitChartsTheme && KitChartsTheme.getAccessibleAnimationOptions) || (typeof window !== 'undefined' && window.getAccessibleAnimationOptions) || function(t, o) { return o || {}; };
  const getSpatialInteractionOptions = (KitChartsTheme && KitChartsTheme.getSpatialInteractionOptions) || (typeof window !== 'undefined' && window.getSpatialInteractionOptions) || function() { return {}; };
  const getTemporalInteractionOptions = (KitChartsTheme && KitChartsTheme.getTemporalInteractionOptions) || (typeof window !== 'undefined' && window.getTemporalInteractionOptions) || function() { return {}; };
  const getPartitionInteractionOptions = (KitChartsTheme && KitChartsTheme.getPartitionInteractionOptions) || (typeof window !== 'undefined' && window.getPartitionInteractionOptions) || function() { return {}; };
  const getExecutiveModeOptions = (KitChartsTheme && KitChartsTheme.getExecutiveModeOptions) || (typeof window !== 'undefined' && window.getExecutiveModeOptions) || function() { return {}; };
  const computeAntiOcclusionTooltipPosition = (KitChartsTheme && KitChartsTheme.computeAntiOcclusionTooltipPosition) || (typeof window !== 'undefined' && window.computeAntiOcclusionTooltipPosition) || function() { return {}; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

const EUROPE_DATA = {"type":"FeatureCollection","features":[{"type":"Feature","id":"FRA","properties":{"name":"France","value":2800,"capital":"Paris","lat":48.8566,"lon":2.3522,"code":"FR","role":"focal","growth":1.2},"geometry":{"type":"Polygon","coordinates":[[[-4.8,48.4],[-1.9,49.7],[0.1,49.4],[1.6,50.1],[2.5,51.1],[4.2,49.9],[6.2,49.5],[7.7,49],[7.5,47.6],[6.8,45.9],[7.2,43.7],[5.3,43.3],[3.1,42.4],[1.8,42.5],[-1.8,43.4],[-1.2,46],[-3,47.6],[-4.8,48.4]]]}},{"type":"Feature","id":"DEU","properties":{"name":"Allemagne","value":4100,"capital":"Berlin","lat":52.52,"lon":13.405,"code":"DE","role":"focal","growth":0.8},"geometry":{"type":"Polygon","coordinates":[[[6,50.8],[6.9,53.6],[8.6,54.9],[10,54.4],[13.7,54.3],[14.2,53.9],[14.8,51.8],[15,51.1],[12.1,50.3],[13,47.7],[10,47.5],[7.6,49],[6.2,49.5],[6,50.8]]]}},{"type":"Feature","id":"GBR","properties":{"name":"Royaume-Uni","value":3100,"capital":"Londres","lat":51.5074,"lon":-0.1278,"code":"UK","role":"context","growth":1.1},"geometry":{"type":"Polygon","coordinates":[[[-5.7,50],[-3,50.6],[1.4,51.2],[1.7,52.5],[0.1,53.8],[-1.8,55.8],[-2,57.5],[-3,58.6],[-5,58.6],[-5.6,55.4],[-3,53.4],[-5,51.5],[-5.7,50]]]}},{"type":"Feature","id":"ITA","properties":{"name":"Italie","value":2100,"capital":"Rome","lat":41.9028,"lon":12.4964,"code":"IT","role":"context","growth":0.7},"geometry":{"type":"Polygon","coordinates":[[[6.8,45.9],[10.5,46.5],[13.8,46.5],[13,45.6],[12.3,44],[15,41.9],[18.5,40.2],[16.8,38.9],[15.8,38],[15.6,38.2],[14.8,40.8],[11.5,42.5],[9.5,44],[7.5,44.2],[6.8,45.9]]]}},{"type":"Feature","id":"ESP","properties":{"name":"Espagne","value":1500,"capital":"Madrid","lat":40.4168,"lon":-3.7038,"code":"ES","role":"context","growth":2.3},"geometry":{"type":"Polygon","coordinates":[[[-9.3,43],[-1.8,43.4],[3.1,42.4],[3.3,41.9],[0.2,38.8],[-0.8,37.8],[-2.2,36.7],[-5.6,36],[-7.4,37.2],[-6.9,38],[-6.5,42],[-8.9,41.8],[-9.3,43]]]}},{"type":"Feature","id":"PRT","properties":{"name":"Portugal","value":260,"capital":"Lisbonne","lat":38.7223,"lon":-9.1393,"code":"PT","role":"context","growth":2.1},"geometry":{"type":"Polygon","coordinates":[[[-8.9,41.8],[-6.5,42],[-6.9,38],[-7.4,37.2],[-9,37],[-9.5,38.7],[-8.9,41.8]]]}},{"type":"Feature","id":"NLD","properties":{"name":"Pays-Bas","value":1050,"capital":"Amsterdam","lat":52.3676,"lon":4.9041,"code":"NL","role":"context","growth":1.4},"geometry":{"type":"Polygon","coordinates":[[[3.4,51.4],[4.7,52.9],[6.9,53.6],[7.1,53.2],[6,51.8],[5,51.4],[3.4,51.4]]]}},{"type":"Feature","id":"BEL","properties":{"name":"Belgique","value":580,"capital":"Bruxelles","lat":50.8503,"lon":4.3517,"code":"BE","role":"context","growth":1.0},"geometry":{"type":"Polygon","coordinates":[[[2.5,51.1],[3.4,51.4],[5.9,50.8],[6.4,50.3],[5.8,49.5],[4.2,49.9],[2.5,51.1]]]}},{"type":"Feature","id":"CHE","properties":{"name":"Suisse","value":870,"capital":"Berne","lat":46.948,"lon":7.4474,"code":"CH","role":"context","growth":1.5},"geometry":{"type":"Polygon","coordinates":[[[6,46.2],[6,47.5],[8.6,47.8],[10.5,46.9],[9,45.8],[6.8,45.9],[6,46.2]]]}},{"type":"Feature","id":"POL","properties":{"name":"Pologne","value":750,"capital":"Varsovie","lat":52.2297,"lon":21.0122,"code":"PL","role":"context","growth":3.1},"geometry":{"type":"Polygon","coordinates":[[[14.2,53.9],[18.6,54.8],[22.8,54.3],[24.1,52.7],[23.5,50],[22.7,49],[18.9,49.5],[15,51.1],[14.2,53.9]]]}},{"type":"Feature","id":"AUT","properties":{"name":"Autriche","value":480,"capital":"Vienne","lat":48.2082,"lon":16.3738,"code":"AT","role":"context","growth":1.3},"geometry":{"type":"Polygon","coordinates":[[[9.5,47.5],[13,47.7],[15,48.8],[17,48],[16,46.8],[13.8,46.5],[10.5,46.9],[9.5,47.5]]]}},{"type":"Feature","id":"SWE","properties":{"name":"Suède","value":590,"capital":"Stockholm","lat":59.3293,"lon":18.0686,"code":"SE","role":"context","growth":1.7},"geometry":{"type":"Polygon","coordinates":[[[11.2,58.9],[12.8,56.3],[14.5,55.4],[16,56.5],[19,60],[24.1,65.8],[20.6,68.5],[14,64],[12,63.5],[11.2,58.9]]]}},{"type":"Feature","id":"NOR","properties":{"name":"Norvège","value":520,"capital":"Oslo","lat":59.9139,"lon":10.7522,"code":"NO","role":"context","growth":1.9},"geometry":{"type":"Polygon","coordinates":[[[5,62],[6,58.5],[10,58],[11.2,58.9],[12,63.5],[14,64],[20.6,68.5],[28,71],[14,68],[5,62]]]}},{"type":"Feature","id":"IRL","properties":{"name":"Irlande","value":500,"capital":"Dublin","lat":53.3498,"lon":-6.2603,"code":"IE","role":"anomaly","growth":5.8},"geometry":{"type":"Polygon","coordinates":[[[-10.5,51.5],[-6,52.2],[-6,54],[-7.5,55.3],[-10,54.2],[-10.5,51.5]]]}}]};

const DEFAULT_DATA = {
  title: 'PIB par Pays Européen (Mds €)',
  features: EUROPE_DATA.features
};

function createChart(canvasTarget, customData = null, themeName = DEFAULT_THEME) {
  const canvas = typeof canvasTarget === 'string'
    ? (typeof document !== 'undefined' ? document.getElementById(canvasTarget) : null)
    : canvasTarget;

  if (!canvas) throw new Error('Canvas not found');

  if (typeof Chart !== 'undefined' && Chart.getChart) {
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();
  }

  const container = canvas.parentElement || (typeof document !== 'undefined' ? document.body : null);
  const tokens = getThemeTokens(themeName, container);
  const isTufte = tokens.name === 'tufte-minimalist-executive';
  const reduceMotion = isReducedMotionPreferred();

  const rawData = customData || DEFAULT_DATA;
  const features = rawData.features || EUROPE_DATA.features;

  const values = features.map(f => f.properties.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);

  // Standalone Vector Canvas Map Renderer with True Conformal Aspect Ratio
  const mapPlugin = {
    id: 'choroplethVectorMap_' + Math.random().toString(36).substring(2, 7),
    afterDraw(chart) {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;

      const { left, top, right, bottom, width, height } = chartArea;
      ctx.save();

      // Europe Bounding Box with Latitude cosine aspect ratio correction (50°N)
      const lonMin = -11, lonMax = 28;
      const latMin = 35, latMax = 71;
      const cosLat = Math.cos(50 * Math.PI / 180); // ~0.6428

      const geoWidth = (lonMax - lonMin) * cosLat;
      const geoHeight = (latMax - latMin);

      // Fit within available chartArea preserving aspect ratio
      const padding = 12;
      const scale = Math.min((width - padding * 2) / geoWidth, (height - padding * 2) / geoHeight);

      const mapPixelWidth = geoWidth * scale;
      const mapPixelHeight = geoHeight * scale;
      const offsetX = left + (width - mapPixelWidth) / 2;
      const offsetY = top + (height - mapPixelHeight) / 2;

      const project = (lon, lat) => {
        const x = offsetX + (lon - lonMin) * cosLat * scale;
        const y = offsetY + (latMax - lat) * scale;
        return [x, y];
      };

      // 1. Draw each country polygon
      features.forEach((feature) => {
        const val = feature.properties.value;
        const ratio = (val - minVal) / (maxVal - minVal || 1);
        let fillColor = getSequentialColor(tokens, ratio);
        let strokeColor = tokens.isDark ? '#4C566A' : '#CBD5E1';
        let strokeWidth = 1.0;

        if (feature.properties.role === 'focal') {
          strokeColor = tokens.emphasis?.focal || (tokens.isDark ? '#ECEFF4' : '#0F172A');
          strokeWidth = 2.5;
        } else if (feature.properties.role === 'anomaly') {
          strokeColor = (tokens.status && tokens.status.danger) || (tokens.emphasis && tokens.emphasis.anomaly) || '#C62828';
          strokeWidth = 2.0;
        }

        const coords = feature.geometry.coordinates[0];
        if (!coords || coords.length < 3) return;

        ctx.beginPath();
        const [startX, startY] = project(coords[0][0], coords[0][1]);
        ctx.moveTo(startX, startY);

        for (let i = 1; i < coords.length; i++) {
          const [px, py] = project(coords[i][0], coords[i][1]);
          ctx.lineTo(px, py);
        }
        ctx.closePath();

        ctx.fillStyle = fillColor;
        ctx.fill();

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();

        // Label on capital
        if (feature.properties.code && feature.properties.lon && feature.properties.lat) {
          const [cx, cy] = project(feature.properties.lon, feature.properties.lat);
          if (cx >= left && cx <= right && cy >= top && cy <= bottom) {
            ctx.fillStyle = ratio > 0.6 ? '#FFFFFF' : (tokens.isDark ? '#ECEFF4' : '#0F172A');
            ctx.font = `700 9px ${tokens.fontFamily || 'sans-serif'}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(feature.properties.code, cx, cy);
          }
        }
      });

      // 2. Sequential Colorbar Legend (bottom right)
      const barW = 80;
      const barH = 8;
      const barX = right - barW - 10;
      const barY = bottom - barH - 10;

      const grad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
      grad.addColorStop(0, getSequentialColor(tokens, 0));
      grad.addColorStop(0.5, getSequentialColor(tokens, 0.5));
      grad.addColorStop(1, getSequentialColor(tokens, 1));

      ctx.fillStyle = grad;
      ctx.fillRect(barX, barY, barW, barH);
      ctx.strokeStyle = tokens.border || '#CBD5E1';
      ctx.strokeRect(barX, barY, barW, barH);

      ctx.fillStyle = tokens.textSecondary || '#334155';
      ctx.font = `600 8px ${tokens.fontMono || 'monospace'}`;
      ctx.fillText(minVal + ' Mds', barX - 2, barY + barH + 9);
      ctx.fillText(maxVal + ' Mds', barX + barW - 16, barY + barH + 9);

      ctx.restore();
    }
  };

  const config = {
    type: 'scatter',
    data: { datasets: [{ data: [] }] },
    plugins: [mapPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: getAccessibleAnimationOptions(tokens, {
        duration: (isTufte || reduceMotion) ? 0 : 400,
        easing: 'easeOutQuart'
      }),
      interaction: {
        mode: 'nearest',
        intersect: false,
        axis: 'xy'
      },
      hover: {
        mode: 'nearest',
        intersect: false,
        animationDuration: (isTufte || reduceMotion) ? 0 : 100
      },
      scales: {
        x: { display: false, grid: { display: false } },
        y: { display: false, grid: { display: false } }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: tokens.tooltipBg || '#0F172A',
          titleColor: tokens.tooltipText || '#F8FAFC',
          bodyColor: tokens.tooltipText || '#F8FAFC',
          borderColor: tokens.borderStrong || tokens.border || '#334155',
          borderWidth: 1,
          padding: { top: 10, bottom: 10, left: 14, right: 14 },
          cornerRadius: isTufte ? 0 : 6,
          boxPadding: 6,
          titleFont: {
            family: tokens.fontFamily,
            size: 12,
            weight: '600'
          },
          bodyFont: {
            family: tokens.fontMono,
            size: 12,
            weight: '400'
          },
          callbacks: {
            label: (ctx) => {
              const item = ctx.raw;
              if (!item) return '';
              const formatted = typeof item.value === 'number' ? item.value.toLocaleString('fr-FR') : item.value;
              return ` ${item.name || ''} : ${formatted} Mds €`;
            }
          }
        }
      }
    }
  };

  if (typeof Chart !== 'undefined' && canvas && typeof canvas.getContext === 'function') {
    return new Chart(canvas, config);
  }
  return {
    canvas,
    config,
    data: config.data,
    options: config.options,
    ctx: canvas?.getContext ? canvas.getContext('2d') : {},
    destroy: () => {},
    update: () => {},
    resize: () => {}
  };
}

  const moduleExports = {
    DEFAULT_DATA: typeof DEFAULT_DATA !== 'undefined' ? DEFAULT_DATA : (typeof defaultData !== 'undefined' ? defaultData : {}),
    createChart: typeof createChart === 'function' ? createChart : null,
    getEmphasisStyle: typeof getEmphasisStyle === 'function' ? getEmphasisStyle : null,
    getValenceColor: typeof getValenceColor === 'function' ? getValenceColor : null,
    getThresholdStatus: typeof getThresholdStatus === 'function' ? getThresholdStatus : null
  };

  moduleExports.default = moduleExports;
  moduleExports.DEFAULT_DATA = moduleExports.DEFAULT_DATA;
  moduleExports.createChart = moduleExports.createChart;
  moduleExports.getEmphasisStyle = moduleExports.getEmphasisStyle;
  moduleExports.getValenceColor = moduleExports.getValenceColor;
  moduleExports.getThresholdStatus = moduleExports.getThresholdStatus;

  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/09-tableaux-dataviz/table-bar-in-cell
  // --------------------------------------------------------------------------
  global.KitCharts["table-bar-in-cell"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return d >= 0 ? '#2E7D32' : '#C62828'; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Données par défaut représentatives : Tableau comparatif des lignes de produits et performance vs objectifs
   */
  const DEFAULT_DATA = {
    title: 'Benchmark des Lignes de Produits — Chiffre d\'Affaires & Taux d\'Atteinte',
    subtitle: 'Micro-barres proportionnelles 1D et mini bullet graphs Stephen Few',
    columns: [
      { key: 'product', label: 'Gamme de Produit', align: 'left', sortable: true },
      { key: 'category', label: 'Division', align: 'center', sortable: true },
      { key: 'revenue', label: 'Chiffre d\'Affaires', align: 'right', sortable: true, format: 'bar_in_cell' },
      { key: 'volume', label: 'Volume Ventes', align: 'right', sortable: true, format: 'number' },
      { key: 'bullet', label: 'Réalisé vs Objectif (Bullet)', align: 'left', sortable: true, format: 'bullet' },
      { key: 'completion', label: 'Atteinte', align: 'right', sortable: true, format: 'percent' }
    ],
    rows: [
      { product: 'Enterprise Cloud Platform', category: 'SaaS B2B', revenue: 4850000, maxRevenue: 5000000, volume: 1420, actualRate: 97, targetRate: 90, unit: ' €' },
      { product: 'Cybersecurity Suite X', category: 'Sécurité', revenue: 3920000, maxRevenue: 5000000, volume: 2150, actualRate: 108, targetRate: 100, unit: ' €' },
      { product: 'AI Analytics Engine Pro', category: 'Data & IA', revenue: 3450000, maxRevenue: 5000000, volume: 980, actualRate: 115, targetRate: 100, unit: ' €' },
      { product: 'Workflow Automation Hub', category: 'Productivité', revenue: 2780000, maxRevenue: 5000000, volume: 3400, actualRate: 92, targetRate: 95, unit: ' €' },
      { product: 'Identity Access Manager', category: 'Sécurité', revenue: 2150000, maxRevenue: 5000000, volume: 1890, actualRate: 86, targetRate: 90, unit: ' €' },
      { product: 'Customer Data Platform', category: 'Data & IA', revenue: 1940000, maxRevenue: 5000000, volume: 760, actualRate: 102, targetRate: 100, unit: ' €' },
      { product: 'DevOps CI/CD Pipeline', category: 'Infrastructure', revenue: 1620000, maxRevenue: 5000000, volume: 1240, actualRate: 81, targetRate: 85, unit: ' €' }
    ]
  };

  /**
   * Génère une micro-barre horizontale proportionnelle SVG intégrée dans la cellule
   */
  function generateDataBarSVG(value, maxValue, width = 120, height = 14, color = '#2B8CBE', isDark = false, isTufte = false) {
    const ratio = Math.max(0, Math.min(1, value / maxValue));
    const barWidth = Math.max(2, ratio * width).toFixed(1);
    const bgTrack = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)';

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="display:inline-block; vertical-align:middle; margin-right:8px;" aria-hidden="true">
        <rect x="0" y="1" width="${width}" height="${height - 2}" rx="${isTufte ? 0 : 3}" fill="${bgTrack}" />
        <rect x="0" y="1" width="${barWidth}" height="${height - 2}" rx="${isTufte ? 0 : 3}" fill="${color}" />
      </svg>
    `;
  }

  /**
   * Génère un mini Bullet Graph Stephen Few (Réalisé + Marqueur Cible + Plages)
   */
  function generateBulletGraphSVG(actual, target, width = 130, height = 18, color = '#2B8CBE', isDark = false, isTufte = false) {
    const maxScale = 125; // 0 à 125%
    const actualWidth = Math.max(2, Math.min(width, (actual / maxScale) * width)).toFixed(1);
    const targetX = Math.min(width - 2, Math.max(2, (target / maxScale) * width)).toFixed(1);

    // Plages qualitatives en niveaux de gris discrets
    const poorW = (60 / maxScale) * width;
    const satisfactoryW = (90 / maxScale) * width;
    const targetColor = isDark ? '#ECEFF4' : '#0F172A';

    const bg1 = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)';
    const bg2 = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';
    const bg3 = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="display:inline-block; vertical-align:middle;" aria-label="Réalisé: ${actual}%, Cible: ${target}%">
        <title>Réalisé: ${actual}%, Cible: ${target}%</title>
        <!-- Plages de fond Stephen Few -->
        <rect x="0" y="2" width="${width}" height="${height - 4}" fill="${bg1}" rx="${isTufte ? 0 : 2}" />
        <rect x="0" y="2" width="${satisfactoryW.toFixed(1)}" height="${height - 4}" fill="${bg2}" />
        <rect x="0" y="2" width="${poorW.toFixed(1)}" height="${height - 4}" fill="${bg3}" />
        <!-- Barre de performance réalisée -->
        <rect x="0" y="5" width="${actualWidth}" height="${height - 10}" fill="${color}" rx="${isTufte ? 0 : 1}" />
        <!-- Marqueur cible vertical -->
        <line x1="${targetX}" y1="1" x2="${targetX}" y2="${height - 1}" stroke="${targetColor}" stroke-width="2.5" stroke-linecap="butt" />
      </svg>
    `;
  }

  /**
   * Crée et initialise un Tableau Comparatif avec Barres Intégrées
   *
   * @param {string|HTMLElement} target - ID ou élément DOM cible
   * @param {Object} [customData=null] - Jeu de données optionnel
   * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème
   * @param {Object} [options={}] - Options de configuration
   * @returns {Object} Instance de contrôle
   */
  function createTable(target, customData = null, themeName = DEFAULT_THEME, options = {}) {
    let container = null;
    let canvasElement = null;

    if (typeof target === 'string') {
      container = typeof document !== 'undefined' ? document.getElementById(target) : null;
    } else {
      container = target;
    }

    if (!container) {
      return {
        target,
        canvas: null,
        data: customData || DEFAULT_DATA,
        options: options || {},
        theme: themeName,
        destroy: () => {},
        update: () => {},
        setTheme: () => {},
        sort: () => {},
        exportCSV: () => ''
      };
    }

    if (container.tagName === 'CANVAS') {
      canvasElement = container;
      canvasElement.style.display = 'none';
      let wrapper = container.parentElement.querySelector('.kc-table-wrapper');
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'kc-table-wrapper';
        container.parentElement.appendChild(wrapper);
      }
      container = wrapper;
    }

    const tokens = getThemeTokens(themeName, container);
    const isTufte = tokens.name === 'tufte-minimalist-executive';
    const isDark = Boolean(tokens.isDark);

    let data = JSON.parse(JSON.stringify(customData || DEFAULT_DATA));
    let sortColumn = options.sortColumn || 'revenue';
    let sortDirection = options.sortDirection || 'desc';

    function render() {
      if (!container) return;

      const primaryColor = getColor(tokens, 0);
      const bgSurface = tokens.surface || (isDark ? '#242933' : '#FFFFFF');
      const bgHeader = isDark ? '#1F232B' : (isTufte ? '#FFFFFF' : '#F8FAFC');
      const borderCol = tokens.border || (isDark ? '#4C566A' : '#E2E8F0');
      const borderStrong = tokens.borderStrong || (isDark ? '#5E81AC' : '#CBD5E1');
      const textPrimary = tokens.textPrimary || (isDark ? '#ECEFF4' : '#0F172A');
      const textSecondary = tokens.textSecondary || (isDark ? '#D8DEE9' : '#475569');
      const textMuted = tokens.textMuted || (isDark ? '#9EABC0' : '#64748B');
      const fontSans = tokens.fontFamily || "'Inter', sans-serif";
      const fontMono = tokens.fontMono || "'JetBrains Mono', monospace";

      // Calcul du maximum absolu pour calibrer l'échelle de toutes les barres de la colonne
      const maxRevenueCol = Math.max(...data.rows.map(r => r.revenue || 0));

      // Tri des lignes
      let displayRows = [...data.rows];
      if (sortColumn) {
        displayRows.sort((a, b) => {
          let valA = a[sortColumn];
          let valB = b[sortColumn];
          if (sortColumn === 'bullet') {
            valA = a.actualRate;
            valB = b.actualRate;
          }
          if (typeof valA === 'string') valA = valA.toLowerCase();
          if (typeof valB === 'string') valB = valB.toLowerCase();
          if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
          if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }

      let html = `
        <div class="kc-dataviz-barincell-container" style="
          width: 100%;
          overflow-x: auto;
          background: ${bgSurface};
          border: 1px solid ${borderCol};
          border-radius: ${isTufte ? '0' : '10px'};
          box-shadow: ${isTufte ? 'none' : (isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 2px 8px rgba(15,23,42,0.04)')};
          font-family: ${fontSans};
          color: ${textPrimary};
          box-sizing: border-box;
        ">
          <table style="
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            font-size: 0.8125rem;
            line-height: 1.45;
            font-variant-numeric: tabular-nums lining-nums;
            font-feature-settings: 'tnum' 1, 'lnum' 1;
          ">
            <thead>
              <tr style="
                background: ${bgHeader};
                border-bottom: 1.5px solid ${borderStrong};
              ">
      `;

      data.columns.forEach(col => {
        const isSorted = sortColumn === col.key;
        const sortIcon = isSorted ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : '';
        const cursor = col.sortable ? 'cursor: pointer; user-select: none;' : '';
        html += `
          <th data-key="${col.key}" style="
            padding: 10px 14px;
            text-align: ${col.align};
            font-weight: 600;
            font-size: 0.725rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: ${isSorted ? primaryColor : textSecondary};
            border: none;
            white-space: nowrap;
            ${cursor}
          " title="${col.sortable ? 'Cliquer pour trier' : ''}">
            ${col.label}${sortIcon}
          </th>
        `;
      });

      html += `
              </tr>
            </thead>
            <tbody>
      `;

      displayRows.forEach((row, idx) => {
        const rowBg = isTufte
          ? 'transparent'
          : (idx % 2 === 1 ? (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(15,23,42,0.015)') : 'transparent');
        const borderBottom = idx === displayRows.length - 1 ? 'none' : `1px solid ${borderCol}`;

        const isOverTarget = row.actualRate >= row.targetRate;
        const bulletColor = isOverTarget
          ? (tokens.status?.success || '#2E7D32')
          : (tokens.status?.warning || '#D97706');

        html += `
          <tr class="kc-table-row" style="
            background: ${rowBg};
            border-bottom: ${borderBottom};
            transition: background 0.15s ease;
          ">
            <td style="padding: 10px 14px; text-align: left; vertical-align: middle;">
              <div style="font-weight: 600; color: ${textPrimary};">${row.product}</div>
            </td>
            <td style="padding: 10px 14px; text-align: center; vertical-align: middle;">
              <span style="
                display: inline-block;
                padding: 2px 7px;
                border-radius: 9999px;
                font-size: 0.7rem;
                font-weight: 500;
                background: ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)'};
                color: ${textSecondary};
              ">${row.category}</span>
            </td>
            <td style="padding: 10px 14px; text-align: right; vertical-align: middle; white-space: nowrap;">
              <div style="display: flex; align-items: center; justify-content: flex-end; gap: 8px;">
                ${generateDataBarSVG(row.revenue, maxRevenueCol, 95, 14, primaryColor, isDark, isTufte)}
                <span style="font-family: ${fontMono}; font-weight: 600; color: ${textPrimary};">
                  ${(row.revenue / 1000000).toFixed(2)} M€
                </span>
              </div>
            </td>
            <td style="padding: 10px 14px; text-align: right; font-family: ${fontMono}; color: ${textSecondary}; vertical-align: middle;">
              ${row.volume.toLocaleString('fr-FR')}
            </td>
            <td style="padding: 10px 14px; text-align: left; vertical-align: middle; white-space: nowrap;">
              <div style="display: flex; align-items: center; gap: 8px;">
                ${generateBulletGraphSVG(row.actualRate, row.targetRate, 110, 16, bulletColor, isDark, isTufte)}
                <span style="font-size: 0.7rem; color: ${textMuted}; font-family: ${fontMono};">
                  Cible: ${row.targetRate}%
                </span>
              </div>
            </td>
            <td style="padding: 10px 14px; text-align: right; vertical-align: middle;">
              <span style="
                font-family: ${fontMono};
                font-weight: 700;
                font-size: 0.8125rem;
                color: ${bulletColor};
              ">
                ${row.actualRate}%
              </span>
            </td>
          </tr>
        `;
      });

      html += `
            </tbody>
          </table>
        </div>
      `;

      container.innerHTML = html;

      // Écouteurs de tri
      const headers = container.querySelectorAll('th[data-key]');
      headers.forEach(th => {
        const key = th.getAttribute('data-key');
        const colDef = data.columns.find(c => c.key === key);
        if (colDef && colDef.sortable) {
          th.addEventListener('click', () => {
            if (sortColumn === key) {
              sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
              sortColumn = key;
              sortDirection = 'desc';
            }
            render();
          });
        }
      });
    }

    render();

    return {
      container,
      canvas: canvasElement,
      data,
      options: options || {},
      theme: themeName,
      destroy: () => {
        if (container) container.innerHTML = '';
        if (canvasElement) canvasElement.style.display = '';
      },
      update: (newData) => {
        if (newData) data = JSON.parse(JSON.stringify(newData));
        render();
      },
      setTheme: (newTheme) => {
        themeName = newTheme;
        render();
      },
      sort: (key, direction = 'desc') => {
        sortColumn = key;
        sortDirection = direction;
        render();
      },
      exportCSV: () => {
        const headers = data.columns.map(c => `"${c.label}"`).join(';');
        const rows = data.rows.map(r => [
          `"${r.product}"`,
          `"${r.category}"`,
          r.revenue,
          r.volume,
          r.actualRate,
          r.targetRate
        ].join(';')).join('\n');
        return `${headers}\n${rows}`;
      }
    };
  }

  const createChart = function(target, customData = null, themeName = DEFAULT_THEME, options = {}) {
    return createTable(target, customData, themeName, options);
  };

  const moduleExports = {
    DEFAULT_DATA,
    createTable,
    createChart,
    renderTable: createTable,
    generateDataBarSVG,
    generateBulletGraphSVG
  };

  moduleExports.default = moduleExports;
  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/09-tableaux-dataviz/table-financial-variance
  // --------------------------------------------------------------------------
  global.KitCharts["table-financial-variance"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return d >= 0 ? '#2E7D32' : '#C62828'; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Données par défaut représentatives : Compte de Résultat Simplifié (P&L) avec analyse des variances vs Budget et N-1
   */
  const DEFAULT_DATA = {
    title: 'Compte de Résultat & Analyse des Variances (k€)',
    subtitle: 'Standards IBCS® — Comparaison Réalisé 2026 vs Budget et N-1 avec barres divergentes',
    columns: [
      { key: 'item', label: 'Structure du Compte (P&L)', align: 'left' },
      { key: 'actual', label: 'Réalisé N', align: 'right', format: 'currency' },
      { key: 'budget', label: 'Budget N', align: 'right', format: 'currency' },
      { key: 'priorYear', label: 'Réalisé N-1', align: 'right', format: 'currency' },
      { key: 'varAbs', label: 'Écart Absolue (Δ)', align: 'right', format: 'delta_currency' },
      { key: 'varPct', label: 'Écart Relatif (%)', align: 'right', format: 'delta_percent' },
      { key: 'varBar', label: 'Structure Variance IBCS', align: 'center', format: 'ibcs_bar' }
    ],
    rows: [
      { item: 'CHIFFRE D\'AFFAIRES BRUT', isSummary: false, isHeader: true, level: 0, actual: 48500, budget: 45000, priorYear: 41200, metricType: 'revenue' },
      { item: '  Ventes Licences SaaS', isSummary: false, isHeader: false, level: 1, actual: 36200, budget: 33000, priorYear: 29500, metricType: 'revenue' },
      { item: '  Services Professionnels & Conseil', isSummary: false, isHeader: false, level: 1, actual: 12300, budget: 12000, priorYear: 11700, metricType: 'revenue' },
      { item: 'COÛTS DES VENTES (COGS)', isSummary: false, isHeader: true, level: 0, actual: -9700, budget: -9000, priorYear: -8500, metricType: 'cost' },
      { item: '  Hébergement Cloud & Télécom', isSummary: false, isHeader: false, level: 1, actual: -4200, budget: -3800, priorYear: -3500, metricType: 'cost' },
      { item: '  Support Technique & Opérations', isSummary: false, isHeader: false, level: 1, actual: -5500, budget: -5200, priorYear: -5000, metricType: 'cost' },
      { item: 'MARGE BRUTE', isSummary: true, isHeader: true, level: 0, actual: 38800, budget: 36000, priorYear: 32700, metricType: 'revenue' },
      { item: 'CHARGES D\'EXPLOITATION (OPEX)', isSummary: false, isHeader: true, level: 0, actual: -26400, budget: -25000, priorYear: -23800, metricType: 'cost' },
      { item: '  R&D & Ingénierie Produit', isSummary: false, isHeader: false, level: 1, actual: -11800, budget: -11000, priorYear: -10200, metricType: 'cost' },
      { item: '  Ventes & Marketing', isSummary: false, isHeader: false, level: 1, actual: -10200, budget: -9800, priorYear: -9500, metricType: 'cost' },
      { item: '  Frais Généraux & Administratifs', isSummary: false, isHeader: false, level: 1, actual: -4400, budget: -4200, priorYear: -4100, metricType: 'cost' },
      { item: 'EBITDA OPÉRATIONNEL', isSummary: true, isHeader: true, level: 0, actual: 12400, budget: 11000, priorYear: 8900, metricType: 'revenue' }
    ]
  };

  /**
   * Formate une valeur monétaire selon la norme comptable (parenthèses pour les négatifs)
   */
  function formatAccounting(val, unit = ' k€') {
    if (val === null || val === undefined || isNaN(val)) return '—';
    const isNegative = val < 0;
    const absVal = Math.abs(val);
    const formatted = absVal.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    return isNegative ? `(${formatted}${unit})` : `${formatted}${unit}`;
  }

  /**
   * Génère une micro-barre divergente de variance IBCS à axe zéro central
   */
  function generateIBCSVarianceBarSVG(deltaPct, metricType = 'revenue', width = 120, height = 16, tokens = {}, isDark = false, isTufte = false) {
    const maxScalePct = 25; // Axe de -25% à +25%
    const midX = width / 2;

    // Règle de valence financière : delta >= 0 est Favorable (Vert), delta < 0 est Défavorable / Perte (Rouge)
    const isFavorable = deltaPct >= 0;
    const barColor = isFavorable
      ? (tokens.status?.success || '#2E7D32')
      : (tokens.status?.danger || '#C62828');

    const absRatio = Math.min(1, Math.abs(deltaPct) / maxScalePct);
    const barLength = Math.max(2, absRatio * (width / 2)).toFixed(1);

    let startX = midX;
    if (deltaPct < 0) {
      startX = midX - barLength;
    }

    const axisColor = isDark ? '#D8DEE9' : '#0F172A';

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="display:block; margin:0 auto;" aria-label="Variance: ${deltaPct.toFixed(1)}%">
        <title>Variance: ${deltaPct > 0 ? '+' : ''}${deltaPct.toFixed(1)}%</title>
        <!-- Ligne d'axe zéro central -->
        <line x1="${midX}" y1="1" x2="${midX}" y2="${height - 1}" stroke="${axisColor}" stroke-width="1.5" />
        <!-- Micro-barre divergente -->
        <rect x="${startX}" y="3" width="${barLength}" height="${height - 6}" fill="${barColor}" rx="${isTufte ? 0 : 2}" />
      </svg>
    `;
  }

  /**
   * Crée et initialise un Tableau Financier & Variance IBCS
   *
   * @param {string|HTMLElement} target - ID ou élément DOM cible
   * @param {Object} [customData=null] - Jeu de données optionnel
   * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème
   * @param {Object} [options={}] - Options de rendu
   * @returns {Object} Instance de contrôle
   */
  function createTable(target, customData = null, themeName = DEFAULT_THEME, options = {}) {
    let container = null;
    let canvasElement = null;

    if (typeof target === 'string') {
      container = typeof document !== 'undefined' ? document.getElementById(target) : null;
    } else {
      container = target;
    }

    if (!container) {
      return {
        target,
        canvas: null,
        data: customData || DEFAULT_DATA,
        options: options || {},
        theme: themeName,
        destroy: () => {},
        update: () => {},
        setTheme: () => {},
        exportCSV: () => ''
      };
    }

    if (container.tagName === 'CANVAS') {
      canvasElement = container;
      canvasElement.style.display = 'none';
      let wrapper = container.parentElement.querySelector('.kc-table-wrapper');
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'kc-table-wrapper';
        container.parentElement.appendChild(wrapper);
      }
      container = wrapper;
    }

    const tokens = getThemeTokens(themeName, container);
    const isTufte = tokens.name === 'tufte-minimalist-executive';
    const isDark = Boolean(tokens.isDark);

    let data = JSON.parse(JSON.stringify(customData || DEFAULT_DATA));

    function render() {
      if (!container) return;

      const bgSurface = tokens.surface || (isDark ? '#242933' : '#FFFFFF');
      const bgHeader = isDark ? '#1F232B' : (isTufte ? '#FFFFFF' : '#F8FAFC');
      const borderCol = tokens.border || (isDark ? '#4C566A' : '#E2E8F0');
      const borderStrong = tokens.borderStrong || (isDark ? '#5E81AC' : '#CBD5E1');
      const textPrimary = tokens.textPrimary || (isDark ? '#ECEFF4' : '#0F172A');
      const textSecondary = tokens.textSecondary || (isDark ? '#D8DEE9' : '#475569');
      const textMuted = tokens.textMuted || (isDark ? '#9EABC0' : '#64748B');
      const fontSans = tokens.fontFamily || "'Inter', sans-serif";
      const fontMono = tokens.fontMono || "'JetBrains Mono', monospace";

      let html = `
        <div class="kc-dataviz-financial-container" style="
          width: 100%;
          overflow-x: auto;
          background: ${bgSurface};
          border: 1px solid ${borderCol};
          border-radius: ${isTufte ? '0' : '10px'};
          box-shadow: ${isTufte ? 'none' : (isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 2px 8px rgba(15,23,42,0.04)')};
          font-family: ${fontSans};
          color: ${textPrimary};
          box-sizing: border-box;
        ">
          <table style="
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            font-size: 0.8125rem;
            line-height: 1.45;
            font-variant-numeric: tabular-nums lining-nums;
            font-feature-settings: 'tnum' 1, 'lnum' 1;
          ">
            <thead>
              <tr style="
                background: ${bgHeader};
                border-bottom: 1.5px solid ${borderStrong};
              ">
      `;

      data.columns.forEach(col => {
        html += `
          <th style="
            padding: 10px 14px;
            text-align: ${col.align};
            font-weight: 600;
            font-size: 0.725rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: ${textSecondary};
            border: none;
            white-space: nowrap;
          ">
            ${col.label}
          </th>
        `;
      });

      html += `
              </tr>
            </thead>
            <tbody>
      `;

      data.rows.forEach((row, idx) => {
        const isHeaderRow = row.isHeader;
        const isSummaryRow = row.isSummary;
        const indentPx = (row.level || 0) * 16;

        let rowBg = 'transparent';
        let borderBottom = `1px solid ${borderCol}`;
        let borderTop = 'none';

        if (isSummaryRow) {
          rowBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)';
          borderTop = `1.5px solid ${borderStrong}`;
          borderBottom = `2px double ${borderStrong}`;
        } else if (isHeaderRow) {
          rowBg = isDark ? 'rgba(255,255,255,0.015)' : 'rgba(15,23,42,0.01)';
        }

        const deltaAbs = row.actual - row.budget;
        const deltaPct = row.budget !== 0 ? (deltaAbs / Math.abs(row.budget)) * 100 : 0;

        const isFavorable = deltaAbs >= 0;
        const deltaColor = isFavorable
          ? (tokens.status?.success || '#2E7D32')
          : (tokens.status?.danger || '#C62828');

        const arrow = deltaAbs > 0 ? '+' : '';
        const fontWeight = isSummaryRow ? '700' : (isHeaderRow ? '600' : '400');
        const textColor = isSummaryRow ? textPrimary : (isHeaderRow ? textPrimary : textSecondary);

        html += `
          <tr class="kc-table-row" style="
            background: ${rowBg};
            border-top: ${borderTop};
            border-bottom: ${borderBottom};
            font-weight: ${fontWeight};
            transition: background 0.15s ease;
          ">
            <td style="padding: 8px 14px; text-align: left; vertical-align: middle; white-space: nowrap;">
              <span style="padding-left: ${indentPx}px; color: ${textColor};">
                ${row.item}
              </span>
            </td>
            <td style="padding: 8px 14px; text-align: right; font-family: ${fontMono}; color: ${textColor}; vertical-align: middle;">
              ${formatAccounting(row.actual)}
            </td>
            <td style="padding: 8px 14px; text-align: right; font-family: ${fontMono}; color: ${textSecondary}; vertical-align: middle;">
              ${formatAccounting(row.budget)}
            </td>
            <td style="padding: 8px 14px; text-align: right; font-family: ${fontMono}; color: ${textMuted}; vertical-align: middle;">
              ${formatAccounting(row.priorYear)}
            </td>
            <td style="padding: 8px 14px; text-align: right; font-family: ${fontMono}; color: ${deltaColor}; vertical-align: middle;">
              ${arrow}${deltaAbs.toLocaleString('fr-FR')} k€
            </td>
            <td style="padding: 8px 14px; text-align: right; font-family: ${fontMono}; color: ${deltaColor}; vertical-align: middle;">
              ${arrow}${deltaPct.toFixed(1)}%
            </td>
            <td style="padding: 6px 10px; text-align: center; vertical-align: middle;">
              ${generateIBCSVarianceBarSVG(deltaPct, row.metricType, 110, 16, tokens, isDark, isTufte)}
            </td>
          </tr>
        `;
      });

      html += `
            </tbody>
          </table>
        </div>
      `;

      container.innerHTML = html;
    }

    render();

    return {
      container,
      canvas: canvasElement,
      data,
      options: options || {},
      theme: themeName,
      destroy: () => {
        if (container) container.innerHTML = '';
        if (canvasElement) canvasElement.style.display = '';
      },
      update: (newData) => {
        if (newData) data = JSON.parse(JSON.stringify(newData));
        render();
      },
      setTheme: (newTheme) => {
        themeName = newTheme;
        render();
      },
      exportCSV: () => {
        const headers = ['Structure P&L', 'Réalisé', 'Budget', 'N-1', 'Var Abs', 'Var %'].join(';');
        const rows = data.rows.map(r => {
          const delta = r.actual - r.budget;
          const pct = r.budget !== 0 ? (delta / Math.abs(r.budget)) * 100 : 0;
          return [`"${r.item}"`, r.actual, r.budget, r.priorYear, delta, pct.toFixed(1)].join(';');
        }).join('\n');
        return `${headers}\n${rows}`;
      }
    };
  }

  const createChart = function(target, customData = null, themeName = DEFAULT_THEME, options = {}) {
    return createTable(target, customData, themeName, options);
  };

  const moduleExports = {
    DEFAULT_DATA,
    createTable,
    createChart,
    renderTable: createTable,
    formatAccounting,
    generateIBCSVarianceBarSVG
  };

  moduleExports.default = moduleExports;
  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/09-tableaux-dataviz/table-heatmap-matrix
  // --------------------------------------------------------------------------
  global.KitCharts["table-heatmap-matrix"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Données par défaut représentatives : Matrice de Performance Mensuelle des Régions Commerciales (k€)
   */
  const DEFAULT_DATA = {
    title: 'Matrice de Chiffre d\'Affaires Mensuel par Région (k€)',
    subtitle: 'Intensité colorimétrique proportionnelle au revenu mensuel avec totaux et moyennes',
    unit: ' k€',
    columns: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    rows: [
      { id: 'idf', label: 'Île-de-France', values: [340, 360, 420, 390, 410, 480, 520, 310, 490, 530, 580, 640] },
      { id: 'ara', label: 'Auvergne-Rhône-Alpes', values: [220, 240, 280, 270, 290, 340, 370, 210, 350, 380, 410, 460] },
      { id: 'paca', label: 'Provence-Alpes-Côte d\'Azur', values: [180, 190, 230, 250, 310, 390, 440, 410, 320, 270, 240, 290] },
      { id: 'naq', label: 'Nouvelle-Aquitaine', values: [150, 160, 190, 210, 240, 290, 340, 320, 260, 230, 210, 250] },
      { id: 'occ', label: 'Occitanie', values: [140, 150, 180, 200, 230, 280, 330, 300, 250, 220, 190, 230] },
      { id: 'hdf', label: 'Hauts-de-France', values: [170, 180, 210, 200, 220, 250, 260, 170, 240, 270, 290, 330] },
      { id: 'ges', label: 'Grand Est', values: [160, 170, 195, 190, 210, 240, 250, 160, 230, 260, 280, 320] },
      { id: 'bre', label: 'Bretagne', values: [120, 130, 155, 170, 190, 230, 270, 260, 210, 180, 160, 190] }
    ]
  };

  /**
   * Parse hex color to RGB object
   */
  function hexToRgb(hex) {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(c => c + c).join('');
    }
    const num = parseInt(cleanHex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  /**
   * Calcule la luminance relative standard CIE selon WCAG 2.1
   */
  function getRelativeLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  /**
   * Interpole linéairement entre deux couleurs RGB
   */
  function interpolateRgb(rgb1, rgb2, factor) {
    const t = Math.max(0, Math.min(1, factor));
    return {
      r: Math.round(rgb1.r + t * (rgb2.r - rgb1.r)),
      g: Math.round(rgb1.g + t * (rgb2.g - rgb1.g)),
      b: Math.round(rgb1.b + t * (rgb2.b - rgb1.b))
    };
  }

  /**
   * Résout une couleur d'échelle séquentielle pour une valeur normalisée t in [0, 1]
   */
  function getSequentialColorForRatio(t, sequentialPalette, isDark) {
    if (!sequentialPalette || sequentialPalette.length === 0) {
      const c1 = isDark ? { r: 36, g: 41, b: 51 } : { r: 239, g: 243, b: 255 };
      const c2 = { r: 43, g: 140, b: 190 };
      return interpolateRgb(c1, c2, t);
    }
    if (sequentialPalette.length === 1) {
      const c1 = isDark ? { r: 36, g: 41, b: 51 } : { r: 255, g: 255, b: 255 };
      const c2 = hexToRgb(sequentialPalette[0]);
      return interpolateRgb(c1, c2, t);
    }

    const n = sequentialPalette.length - 1;
    const scaled = t * n;
    const idx = Math.min(Math.floor(scaled), n - 1);
    const localT = scaled - idx;

    const rgbA = hexToRgb(sequentialPalette[idx]);
    const rgbB = hexToRgb(sequentialPalette[idx + 1]);
    return interpolateRgb(rgbA, rgbB, localT);
  }

  /**
   * Crée et initialise un Tableau Heatmap / Highlight Table
   *
   * @param {string|HTMLElement} target - ID ou élément DOM cible
   * @param {Object} [customData=null] - Jeu de données
   * @param {string} [themeName='colorbrewer-accessible'] - Nom du thème
   * @param {Object} [options={}] - Options de rendu
   * @returns {Object} Instance de contrôle
   */
  function createTable(target, customData = null, themeName = DEFAULT_THEME, options = {}) {
    let container = null;
    let canvasElement = null;

    if (typeof target === 'string') {
      container = typeof document !== 'undefined' ? document.getElementById(target) : null;
    } else {
      container = target;
    }

    if (!container) {
      return {
        target,
        canvas: null,
        data: customData || DEFAULT_DATA,
        options: options || {},
        theme: themeName,
        destroy: () => {},
        update: () => {},
        setTheme: () => {},
        sort: () => {},
        exportCSV: () => ''
      };
    }

    if (container.tagName === 'CANVAS') {
      canvasElement = container;
      canvasElement.style.display = 'none';
      let wrapper = container.parentElement.querySelector('.kc-table-wrapper');
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'kc-table-wrapper';
        container.parentElement.appendChild(wrapper);
      }
      container = wrapper;
    }

    const tokens = getThemeTokens(themeName, container);
    const isTufte = tokens.name === 'tufte-minimalist-executive';
    const isDark = Boolean(tokens.isDark);

    let data = JSON.parse(JSON.stringify(customData || DEFAULT_DATA));

    function render() {
      if (!container) return;

      const bgSurface = tokens.surface || (isDark ? '#242933' : '#FFFFFF');
      const bgHeader = isDark ? '#1F232B' : (isTufte ? '#FFFFFF' : '#F8FAFC');
      const borderCol = tokens.border || (isDark ? '#4C566A' : '#E2E8F0');
      const borderStrong = tokens.borderStrong || (isDark ? '#5E81AC' : '#CBD5E1');
      const textPrimary = tokens.textPrimary || (isDark ? '#ECEFF4' : '#0F172A');
      const textSecondary = tokens.textSecondary || (isDark ? '#D8DEE9' : '#475569');
      const textMuted = tokens.textMuted || (isDark ? '#9EABC0' : '#64748B');
      const fontSans = tokens.fontFamily || "'Inter', sans-serif";
      const fontMono = tokens.fontMono || "'JetBrains Mono', monospace";
      const sequentialPalette = tokens.sequential || ['#EFF3FF', '#C6DBEF', '#9ECAE1', '#6BAED6', '#3182BD', '#08519C'];

      // Calcul des min et max globaux pour l'échelle d'intensité
      let allValues = [];
      data.rows.forEach(r => {
        allValues.push(...r.values);
      });
      const globalMin = Math.min(...allValues);
      const globalMax = Math.max(...allValues);
      const globalRange = (globalMax - globalMin) === 0 ? 1 : (globalMax - globalMin);

      // Calcul des totaux et moyennes par ligne
      const rowStats = data.rows.map(r => {
        const sum = r.values.reduce((acc, v) => acc + v, 0);
        const avg = sum / r.values.length;
        return { sum, avg };
      });

      // Calcul des totaux et moyennes par colonne
      const colSums = data.columns.map((_, colIdx) => {
        return data.rows.reduce((acc, r) => acc + r.values[colIdx], 0);
      });
      const colAvgs = colSums.map(s => s / data.rows.length);

      let html = `
        <div class="kc-dataviz-heatmap-container" style="
          width: 100%;
          overflow-x: auto;
          background: ${bgSurface};
          border: 1px solid ${borderCol};
          border-radius: ${isTufte ? '0' : '10px'};
          box-shadow: ${isTufte ? 'none' : (isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 2px 8px rgba(15,23,42,0.04)')};
          font-family: ${fontSans};
          color: ${textPrimary};
          box-sizing: border-box;
          padding: 12px 14px;
        ">
          <!-- Légende de l'échelle de gradient continue -->
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 10px;
            border-bottom: 1px solid ${borderCol};
            flex-wrap: wrap;
            gap: 8px;
          ">
            <div>
              <div style="font-weight: 600; font-size: 0.8125rem; color: ${textPrimary};">${data.title || 'Tableau Heatmap'}</div>
              ${data.subtitle ? `<div style="font-size: 0.7rem; color: ${textMuted};">${data.subtitle}</div>` : ''}
            </div>
            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.725rem; color: ${textSecondary};">
              <span style="font-family: ${fontMono}; font-weight: 600;">Min (${globalMin}${data.unit || ''})</span>
              <div style="
                width: 120px;
                height: 10px;
                border-radius: 4px;
                background: linear-gradient(to right, ${sequentialPalette[0] || '#EFF3FF'}, ${sequentialPalette[sequentialPalette.length - 1] || '#08519C'});
                border: 1px solid ${borderCol};
              "></div>
              <span style="font-family: ${fontMono}; font-weight: 600;">Max (${globalMax}${data.unit || ''})</span>
            </div>
          </div>

          <table style="
            width: 100%;
            border-collapse: separate;
            border-spacing: 2px;
            font-size: 0.775rem;
            line-height: 1.35;
            font-variant-numeric: tabular-nums lining-nums;
            font-feature-settings: 'tnum' 1, 'lnum' 1;
          ">
            <thead>
              <tr>
                <th style="
                  padding: 8px 12px;
                  text-align: left;
                  font-weight: 600;
                  font-size: 0.7rem;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                  color: ${textSecondary};
                  background: ${bgHeader};
                  border-bottom: 1.5px solid ${borderStrong};
                  position: sticky;
                  left: 0;
                  z-index: 2;
                ">
                  Région
                </th>
      `;

      data.columns.forEach(col => {
        html += `
          <th style="
            padding: 8px 6px;
            text-align: center;
            font-weight: 600;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            color: ${textSecondary};
            background: ${bgHeader};
            border-bottom: 1.5px solid ${borderStrong};
            min-width: 44px;
          ">
            ${col}
          </th>
        `;
      });

      html += `
                <th style="
                  padding: 8px 10px;
                  text-align: right;
                  font-weight: 700;
                  font-size: 0.7rem;
                  text-transform: uppercase;
                  color: ${textPrimary};
                  background: ${bgHeader};
                  border-bottom: 1.5px solid ${borderStrong};
                ">
                  Total
                </th>
                <th style="
                  padding: 8px 10px;
                  text-align: right;
                  font-weight: 700;
                  font-size: 0.7rem;
                  text-transform: uppercase;
                  color: ${textPrimary};
                  background: ${bgHeader};
                  border-bottom: 1.5px solid ${borderStrong};
                ">
                  Moy.
                </th>
              </tr>
            </thead>
            <tbody>
      `;

      data.rows.forEach((row, rIdx) => {
        html += `
          <tr>
            <td style="
              padding: 7px 12px;
              text-align: left;
              font-weight: 600;
              color: ${textPrimary};
              background: ${bgSurface};
              border-bottom: 1px solid ${borderCol};
              position: sticky;
              left: 0;
              z-index: 1;
              white-space: nowrap;
            ">
              ${row.label}
            </td>
        `;

        row.values.forEach(val => {
          const ratio = (val - globalMin) / globalRange;
          const rgb = getSequentialColorForRatio(ratio, sequentialPalette, isDark);
          const lum = getRelativeLuminance(rgb.r, rgb.g, rgb.b);
          // Règle d'inversion WCAG AAA : Si fond sombre (lum < 0.38), texte clair
          const cellTextColor = lum < 0.38 ? '#FFFFFF' : (isDark && lum < 0.5 ? '#F8FAFC' : '#0F172A');
          const cellBg = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

          html += `
            <td style="
              padding: 7px 4px;
              text-align: center;
              font-family: ${fontMono};
              font-weight: 500;
              font-size: 0.75rem;
              background-color: ${cellBg};
              color: ${cellTextColor};
              border-radius: 3px;
              transition: transform 0.1s ease, box-shadow 0.1s ease;
              cursor: default;
            " title="${row.label} - ${val}${data.unit || ''}">
              ${val}
            </td>
          `;
        });

        const stats = rowStats[rIdx];
        html += `
            <td style="
              padding: 7px 10px;
              text-align: right;
              font-family: ${fontMono};
              font-weight: 700;
              color: ${textPrimary};
              border-bottom: 1px solid ${borderCol};
              background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.02)'};
            ">
              ${stats.sum.toLocaleString('fr-FR')}
            </td>
            <td style="
              padding: 7px 10px;
              text-align: right;
              font-family: ${fontMono};
              font-weight: 600;
              color: ${textSecondary};
              border-bottom: 1px solid ${borderCol};
              background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.02)'};
            ">
              ${stats.avg.toFixed(0)}
            </td>
          </tr>
        `;
      });

      // Ligne de synthèse Totaux & Moyennes
      const grandTotal = colSums.reduce((acc, v) => acc + v, 0);
      const grandAvg = grandTotal / (data.rows.length * data.columns.length);

      html += `
              <tr style="border-top: 1.5px solid ${borderStrong}; font-weight: 700;">
                <td style="
                  padding: 9px 12px;
                  text-align: left;
                  font-weight: 700;
                  color: ${textPrimary};
                  background: ${bgHeader};
                  position: sticky;
                  left: 0;
                  z-index: 1;
                ">
                  TOTAL MENSUEL
                </td>
      `;

      colSums.forEach(cSum => {
        html += `
          <td style="
            padding: 9px 4px;
            text-align: center;
            font-family: ${fontMono};
            font-size: 0.725rem;
            color: ${textPrimary};
            background: ${bgHeader};
          ">
            ${cSum.toLocaleString('fr-FR')}
          </td>
        `;
      });

      html += `
                <td style="
                  padding: 9px 10px;
                  text-align: right;
                  font-family: ${fontMono};
                  font-weight: 700;
                  color: ${textPrimary};
                  background: ${bgHeader};
                ">
                  ${grandTotal.toLocaleString('fr-FR')}
                </td>
                <td style="
                  padding: 9px 10px;
                  text-align: right;
                  font-family: ${fontMono};
                  font-weight: 700;
                  color: ${textSecondary};
                  background: ${bgHeader};
                ">
                  ${grandAvg.toFixed(0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      `;

      container.innerHTML = html;
    }

    render();

    return {
      container,
      canvas: canvasElement,
      data,
      options: options || {},
      theme: themeName,
      destroy: () => {
        if (container) container.innerHTML = '';
        if (canvasElement) canvasElement.style.display = '';
      },
      update: (newData) => {
        if (newData) data = JSON.parse(JSON.stringify(newData));
        render();
      },
      setTheme: (newTheme) => {
        themeName = newTheme;
        render();
      },
      exportCSV: () => {
        const headers = ['Région', ...data.columns, 'Total', 'Moyenne'].join(';');
        const rows = data.rows.map(r => {
          const sum = r.values.reduce((a, b) => a + b, 0);
          const avg = (sum / r.values.length).toFixed(1);
          return [`"${r.label}"`, ...r.values, sum, avg].join(';');
        }).join('\n');
        return `${headers}\n${rows}`;
      }
    };
  }

  const createChart = function(target, customData = null, themeName = DEFAULT_THEME, options = {}) {
    return createTable(target, customData, themeName, options);
  };

  const moduleExports = {
    DEFAULT_DATA,
    createTable,
    createChart,
    renderTable: createTable,
    getRelativeLuminance,
    interpolateRgb
  };

  moduleExports.default = moduleExports;
  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/09-tableaux-dataviz/table-hierarchical-tree
  // --------------------------------------------------------------------------
  global.KitCharts["table-hierarchical-tree"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Données par défaut représentatives : Structure budgétaire et allocation des effectifs par département
   */
  const DEFAULT_DATA = {
    title: 'Budget Opérationnel & Allocation des Ressources par Organisation',
    subtitle: 'Arborescence interactive multi-niveaux avec sous-totaux et taux d\'exécution',
    columns: [
      { key: 'name', label: 'Département / Équipe', align: 'left' },
      { key: 'headcount', label: 'Effectifs (ETP)', align: 'right', format: 'number' },
      { key: 'budget', label: 'Budget Alloué', align: 'right', format: 'currency' },
      { key: 'spent', label: 'Dépenses Réalisées', align: 'right', format: 'currency' },
      { key: 'burnRate', label: 'Taux d\'Exécution', align: 'right', format: 'percent' },
      { key: 'status', label: 'Statut Budget', align: 'center', format: 'badge' }
    ],
    items: [
      {
        id: 'eng',
        name: 'Ingénierie & R&D',
        level: 0,
        expanded: true,
        headcount: 85,
        budget: 9500000,
        spent: 8900000,
        children: [
          {
            id: 'eng-core',
            name: 'Core Platform & Infrastructure',
            level: 1,
            expanded: true,
            headcount: 32,
            budget: 3800000,
            spent: 3650000,
            children: [
              { id: 'eng-core-cloud', name: 'Cloud Architecture & SRE', level: 2, headcount: 14, budget: 1800000, spent: 1750000 },
              { id: 'eng-core-sec', name: 'Security & Compliance', level: 2, headcount: 8, budget: 1100000, spent: 1050000 },
              { id: 'eng-core-db', name: 'Data Pipeline & Storage', level: 2, headcount: 10, budget: 900000, spent: 850000 }
            ]
          },
          {
            id: 'eng-app',
            name: 'Applications & Produits Web',
            level: 1,
            expanded: true,
            headcount: 38,
            budget: 4200000,
            spent: 3950000,
            children: [
              { id: 'eng-app-front', name: 'Frontend & Design System', level: 2, headcount: 18, budget: 2000000, spent: 1900000 },
              { id: 'eng-app-api', name: 'Microservices & API Gateway', level: 2, headcount: 20, budget: 2200000, spent: 2050000 }
            ]
          },
          {
            id: 'eng-ai',
            name: 'Intelligence Artificielle & ML',
            level: 1,
            expanded: false,
            headcount: 15,
            budget: 1500000,
            spent: 1300000,
            children: [
              { id: 'eng-ai-models', name: 'LLM Fine-tuning & Agents', level: 2, headcount: 9, budget: 950000, spent: 820000 },
              { id: 'eng-ai-ops', name: 'MLOps & Inference Cluster', level: 2, headcount: 6, budget: 550000, spent: 480000 }
            ]
          }
        ]
      },
      {
        id: 'sales',
        name: 'Ventes & Développement Commercial',
        level: 0,
        expanded: true,
        headcount: 54,
        budget: 6800000,
        spent: 6650000,
        children: [
          {
            id: 'sales-ent',
            name: 'Grands Comptes (Enterprise)',
            level: 1,
            expanded: false,
            headcount: 28,
            budget: 3900000,
            spent: 3850000,
            children: [
              { id: 'sales-ent-emea', name: 'EMEA Enterprise', level: 2, headcount: 16, budget: 2300000, spent: 2280000 },
              { id: 'sales-ent-us', name: 'North America Enterprise', level: 2, headcount: 12, budget: 1600000, spent: 1570000 }
            ]
          },
          {
            id: 'sales-mid',
            name: 'Mid-Market & SMB',
            level: 1,
            expanded: false,
            headcount: 26,
            budget: 2900000,
            spent: 2800000,
            children: [
              { id: 'sales-mid-inbound', name: 'Inbound Sales', level: 2, headcount: 14, budget: 1500000, spent: 1460000 },
              { id: 'sales-mid-outbound', name: 'Outbound SDRs', level: 2, headcount: 12, budget: 1400000, spent: 1340000 }
            ]
          }
        ]
      },
      {
        id: 'mkt',
        name: 'Marketing & Communication',
        level: 0,
        expanded: false,
        headcount: 22,
        budget: 3200000,
        spent: 3100000,
        children: [
          { id: 'mkt-growth', name: 'Growth & Acquisition Numérique', level: 1, headcount: 12, budget: 1900000, spent: 1850000 },
          { id: 'mkt-brand', name: 'Marque, Événements & RP', level: 1, headcount: 10, budget: 1300000, spent: 1250000 }
        ]
      }
    ]
  };

  /**
   * Aplati la structure arborescente en respectant l'état d'expansion de chaque nœud
   */
  function flattenTree(items, expandedStateMap) {
    let result = [];
    function traverse(nodeList) {
      nodeList.forEach(node => {
        const isExpanded = expandedStateMap[node.id] !== undefined ? expandedStateMap[node.id] : Boolean(node.expanded);
        result.push({ ...node, isExpanded, hasChildren: Boolean(node.children && node.children.length > 0) });
        if (node.children && node.children.length > 0 && isExpanded) {
          traverse(node.children);
        }
      });
    }
    traverse(items);
    return result;
  }

  /**
   * Crée et initialise un Tableau Hiérarchique & Arborescent
   *
   * @param {string|HTMLElement} target - ID ou élément DOM cible
   * @param {Object} [customData=null] - Jeu de données
   * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème
   * @param {Object} [options={}] - Options de configuration
   * @returns {Object} Instance de contrôle
   */
  function createTable(target, customData = null, themeName = DEFAULT_THEME, options = {}) {
    let container = null;
    let canvasElement = null;

    if (typeof target === 'string') {
      container = typeof document !== 'undefined' ? document.getElementById(target) : null;
    } else {
      container = target;
    }

    if (!container) {
      return {
        target,
        canvas: null,
        data: customData || DEFAULT_DATA,
        options: options || {},
        theme: themeName,
        destroy: () => {},
        update: () => {},
        setTheme: () => {},
        toggleAll: () => {},
        exportCSV: () => ''
      };
    }

    if (container.tagName === 'CANVAS') {
      canvasElement = container;
      canvasElement.style.display = 'none';
      let wrapper = container.parentElement.querySelector('.kc-table-wrapper');
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'kc-table-wrapper';
        container.parentElement.appendChild(wrapper);
      }
      container = wrapper;
    }

    const tokens = getThemeTokens(themeName, container);
    const isTufte = tokens.name === 'tufte-minimalist-executive';
    const isDark = Boolean(tokens.isDark);

    let data = JSON.parse(JSON.stringify(customData || DEFAULT_DATA));
    let expandedStateMap = {};

    // Initialiser l'état d'expansion
    function initExpanded(items) {
      items.forEach(item => {
        if (item.expanded !== undefined) {
          expandedStateMap[item.id] = item.expanded;
        }
        if (item.children) initExpanded(item.children);
      });
    }
    initExpanded(data.items);

    function render() {
      if (!container) return;

      const primaryColor = getColor(tokens, 0);
      const bgSurface = tokens.surface || (isDark ? '#242933' : '#FFFFFF');
      const bgHeader = isDark ? '#1F232B' : (isTufte ? '#FFFFFF' : '#F8FAFC');
      const borderCol = tokens.border || (isDark ? '#4C566A' : '#E2E8F0');
      const borderStrong = tokens.borderStrong || (isDark ? '#5E81AC' : '#CBD5E1');
      const textPrimary = tokens.textPrimary || (isDark ? '#ECEFF4' : '#0F172A');
      const textSecondary = tokens.textSecondary || (isDark ? '#D8DEE9' : '#475569');
      const textMuted = tokens.textMuted || (isDark ? '#9EABC0' : '#64748B');
      const fontSans = tokens.fontFamily || "'Inter', sans-serif";
      const fontMono = tokens.fontMono || "'JetBrains Mono', monospace";

      const flatRows = flattenTree(data.items, expandedStateMap);

      // Calcul des totaux globaux
      let totalHeadcount = 0;
      let totalBudget = 0;
      let totalSpent = 0;
      data.items.forEach(topItem => {
        totalHeadcount += topItem.headcount || 0;
        totalBudget += topItem.budget || 0;
        totalSpent += topItem.spent || 0;
      });
      const grandBurnRate = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

      let html = `
        <div class="kc-dataviz-tree-container" style="
          width: 100%;
          overflow-x: auto;
          background: ${bgSurface};
          border: 1px solid ${borderCol};
          border-radius: ${isTufte ? '0' : '10px'};
          box-shadow: ${isTufte ? 'none' : (isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 2px 8px rgba(15,23,42,0.04)')};
          font-family: ${fontSans};
          color: ${textPrimary};
          box-sizing: border-box;
        ">
          <table style="
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            font-size: 0.8125rem;
            line-height: 1.45;
            font-variant-numeric: tabular-nums lining-nums;
            font-feature-settings: 'tnum' 1, 'lnum' 1;
          ">
            <thead>
              <tr style="
                background: ${bgHeader};
                border-bottom: 1.5px solid ${borderStrong};
              ">
      `;

      data.columns.forEach(col => {
        html += `
          <th style="
            padding: 10px 14px;
            text-align: ${col.align};
            font-weight: 600;
            font-size: 0.725rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: ${textSecondary};
            border: none;
            white-space: nowrap;
          ">
            ${col.label}
          </th>
        `;
      });

      html += `
              </tr>
            </thead>
            <tbody>
      `;

      flatRows.forEach((row, idx) => {
        const isParent = row.level === 0;
        const isSubParent = row.level === 1;
        const indentPx = row.level * 22;

        let rowBg = 'transparent';
        if (isParent) {
          rowBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)';
        } else if (isSubParent) {
          rowBg = isDark ? 'rgba(255,255,255,0.015)' : 'rgba(15,23,42,0.01)';
        }

        const fontWeight = isParent ? '700' : (isSubParent ? '600' : '400');
        const textColor = isParent ? textPrimary : (isSubParent ? textPrimary : textSecondary);
        const borderBottom = idx === flatRows.length - 1 ? 'none' : `1px solid ${borderCol}`;

        const burnRate = row.budget > 0 ? (row.spent / row.budget) * 100 : 0;
        const isOverBudget = burnRate > 100;
        const isWarning = burnRate >= 95 && burnRate <= 100;

        let statusBg = isDark ? 'rgba(46, 125, 50, 0.2)' : 'rgba(46, 125, 50, 0.12)';
        let statusColor = isDark ? '#81C784' : '#2E7D32';
        let statusLabel = 'Maîtrisé';

        if (isOverBudget) {
          statusBg = isDark ? 'rgba(198, 40, 40, 0.25)' : 'rgba(198, 40, 40, 0.12)';
          statusColor = isDark ? '#E57373' : '#C62828';
          statusLabel = 'Dépassement';
        } else if (isWarning) {
          statusBg = isDark ? 'rgba(239, 108, 0, 0.25)' : 'rgba(239, 108, 0, 0.12)';
          statusColor = isDark ? '#FFB74D' : '#D97706';
          statusLabel = 'Sous tension';
        }

        const chevron = row.hasChildren
          ? `<span class="kc-tree-toggle" data-node-id="${row.id}" style="
              display: inline-block;
              width: 16px;
              height: 16px;
              line-height: 16px;
              text-align: center;
              font-size: 0.65rem;
              margin-right: 6px;
              cursor: pointer;
              user-select: none;
              color: ${primaryColor};
              font-weight: 700;
            ">${row.isExpanded ? '▼' : '▶'}</span>`
          : `<span style="display: inline-block; width: 22px;"></span>`;

        html += `
          <tr class="kc-table-row" style="
            background: ${rowBg};
            border-bottom: ${borderBottom};
            font-weight: ${fontWeight};
            transition: background 0.15s ease;
          ">
            <td style="padding: 9px 14px; text-align: left; vertical-align: middle; white-space: nowrap;">
              <div style="padding-left: ${indentPx}px; display: flex; align-items: center;">
                ${chevron}
                <span style="color: ${textColor};">${row.name}</span>
              </div>
            </td>
            <td style="padding: 9px 14px; text-align: right; font-family: ${fontMono}; color: ${textColor}; vertical-align: middle;">
              ${row.headcount} ETP
            </td>
            <td style="padding: 9px 14px; text-align: right; font-family: ${fontMono}; color: ${textColor}; vertical-align: middle;">
              ${(row.budget / 1000000).toFixed(2)} M€
            </td>
            <td style="padding: 9px 14px; text-align: right; font-family: ${fontMono}; color: ${textColor}; vertical-align: middle;">
              ${(row.spent / 1000000).toFixed(2)} M€
            </td>
            <td style="padding: 9px 14px; text-align: right; vertical-align: middle;">
              <span style="
                font-family: ${fontMono};
                font-weight: ${isParent ? '700' : '600'};
                color: ${statusColor};
              ">
                ${burnRate.toFixed(1)}%
              </span>
            </td>
            <td style="padding: 9px 14px; text-align: center; vertical-align: middle;">
              <span style="
                display: inline-block;
                padding: 2px 7px;
                border-radius: ${isTufte ? '0' : '4px'};
                font-size: 0.7rem;
                font-weight: 600;
                background: ${statusBg};
                color: ${statusColor};
                border: ${isTufte ? `1px solid ${statusColor}` : 'none'};
                white-space: nowrap;
              ">${statusLabel}</span>
            </td>
          </tr>
        `;
      });

      // Ligne Totaux
      html += `
              <tr style="
                border-top: 2px solid ${borderStrong};
                background: ${bgHeader};
                font-weight: 700;
              ">
                <td style="padding: 11px 14px; text-align: left; color: ${textPrimary};">
                  TOTAL ORGANISATION
                </td>
                <td style="padding: 11px 14px; text-align: right; font-family: ${fontMono}; color: ${textPrimary};">
                  ${totalHeadcount} ETP
                </td>
                <td style="padding: 11px 14px; text-align: right; font-family: ${fontMono}; color: ${textPrimary};">
                  ${(totalBudget / 1000000).toFixed(2)} M€
                </td>
                <td style="padding: 11px 14px; text-align: right; font-family: ${fontMono}; color: ${textPrimary};">
                  ${(totalSpent / 1000000).toFixed(2)} M€
                </td>
                <td style="padding: 11px 14px; text-align: right; font-family: ${fontMono}; color: ${grandBurnRate <= 100 ? (tokens.status?.success || '#2E7D32') : (tokens.status?.danger || '#C62828')};">
                  ${grandBurnRate.toFixed(1)}%
                </td>
                <td style="padding: 11px 14px; text-align: center; color: ${textPrimary}; font-size: 0.725rem;">
                  100% Alloué
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      `;

      container.innerHTML = html;

      // Attacher les écouteurs de clic sur les toggles d'arborescence
      const toggles = container.querySelectorAll('.kc-tree-toggle');
      toggles.forEach(t => {
        t.addEventListener('click', (e) => {
          e.stopPropagation();
          const nodeId = t.getAttribute('data-node-id');
          expandedStateMap[nodeId] = !expandedStateMap[nodeId];
          render();
        });
      });
    }

    render();

    return {
      container,
      canvas: canvasElement,
      data,
      options: options || {},
      theme: themeName,
      destroy: () => {
        if (container) container.innerHTML = '';
        if (canvasElement) canvasElement.style.display = '';
      },
      update: (newData) => {
        if (newData) data = JSON.parse(JSON.stringify(newData));
        render();
      },
      setTheme: (newTheme) => {
        themeName = newTheme;
        render();
      },
      toggleAll: (expand = true) => {
        function setAll(items) {
          items.forEach(i => {
            expandedStateMap[i.id] = expand;
            if (i.children) setAll(i.children);
          });
        }
        setAll(data.items);
        render();
      },
      exportCSV: () => {
        const rows = flattenTree(data.items, expandedStateMap);
        const headers = ['Nom', 'Niveau', 'Effectifs', 'Budget', 'Dépenses'].join(';');
        const body = rows.map(r => [`"${'  '.repeat(r.level) + r.name}"`, r.level, r.headcount, r.budget, r.spent].join(';')).join('\n');
        return `${headers}\n${body}`;
      }
    };
  }

  const createChart = function(target, customData = null, themeName = DEFAULT_THEME, options = {}) {
    return createTable(target, customData, themeName, options);
  };

  const moduleExports = {
    DEFAULT_DATA,
    createTable,
    createChart,
    renderTable: createTable,
    flattenTree
  };

  moduleExports.default = moduleExports;
  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/09-tableaux-dataviz/table-kpi-scorecard
  // --------------------------------------------------------------------------
  global.KitCharts["table-kpi-scorecard"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) {
    const isCost = ['cost', 'churn', 'risk', 'loss', 'latency', 'cac', 'expense', 'debt', 'defect'].includes(String(m || 'revenue').toLowerCase().trim());
    const isPositive = typeof d === 'number' ? d > 0 : (d === 'up' || d === '+');
    const isNegative = typeof d === 'number' ? d < 0 : (d === 'down' || d === '-');
    if (isCost) {
      return isNegative ? '#2E7D32' : (isPositive ? '#C62828' : '#94A3B8');
    }
    return isPositive ? '#2E7D32' : (isNegative ? '#C62828' : '#94A3B8');
  };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Données par défaut représentatives : Tableau de bord exécutif d'une entreprise SaaS B2B
   */
  const DEFAULT_DATA = {
    title: 'Tableau de Bord Stratégique — Performance Trimestrielle',
    subtitle: 'Suivi des indicateurs clés vs cibles annuelles avec tendances 12 mois',
    columns: [
      { key: 'kpi', label: 'Indicateur Clé', align: 'left', sortable: true },
      { key: 'category', label: 'Domaine', align: 'center', sortable: true },
      { key: 'actual', label: 'Réalisé', align: 'right', sortable: true, format: 'number' },
      { key: 'target', label: 'Cible', align: 'right', sortable: true, format: 'number' },
      { key: 'delta', label: 'Écart vs Cible', align: 'right', sortable: true, format: 'delta' },
      { key: 'trend', label: 'Tendance 12M', align: 'center', sortable: false, format: 'sparkline' },
      { key: 'status', label: 'Statut', align: 'center', sortable: true, format: 'status' }
    ],
    rows: [
      {
        kpi: 'Chiffre d\'Affaires Récurrent (ARR)',
        desc: 'Revenus annuels souscrits normalisés',
        category: 'Revenu',
        actual: 14250000,
        target: 13800000,
        unit: ' €',
        delta: 3.26,
        metricType: 'revenue',
        trend: [11.2, 11.5, 11.9, 12.1, 12.4, 12.8, 13.0, 13.3, 13.7, 13.9, 14.1, 14.25],
        status: 'success',
        statusText: 'Dépassé'
      },
      {
        kpi: 'Taux de Rétention Nette (NDR)',
        desc: 'Expansion nette sur cohorte existante',
        category: 'Clients',
        actual: 114.2,
        target: 110.0,
        unit: ' %',
        delta: 3.82,
        metricType: 'revenue',
        trend: [108.0, 108.5, 109.2, 110.0, 109.8, 111.0, 111.8, 112.5, 113.0, 113.8, 114.0, 114.2],
        status: 'success',
        statusText: 'Conforme'
      },
      {
        kpi: 'Coût d\'Acquisition Client (CAC)',
        desc: 'Dépenses sales & marketing par nouveau client',
        category: 'Marketing',
        actual: 840,
        target: 750,
        unit: ' €',
        delta: 12.0,
        metricType: 'cost',
        trend: [720, 710, 740, 750, 760, 780, 810, 790, 820, 830, 835, 840],
        status: 'danger',
        statusText: 'Dérive'
      },
      {
        kpi: 'Marge Brute Opérationnelle',
        desc: 'Marge brute après coûts d\'infrastructure & support',
        category: 'Finance',
        actual: 78.5,
        target: 80.0,
        unit: ' %',
        delta: -1.88,
        metricType: 'revenue',
        trend: [81.0, 80.5, 80.2, 79.8, 79.5, 79.0, 78.8, 78.5, 78.2, 78.4, 78.6, 78.5],
        status: 'warning',
        statusText: 'Sous surveillance'
      },
      {
        kpi: 'Net Promoter Score (NPS)',
        desc: 'Score de recommandation client ([-100, +100])',
        category: 'Qualité',
        actual: 64,
        target: 60,
        unit: ' pts',
        delta: 6.67,
        metricType: 'revenue',
        trend: [52, 54, 55, 57, 56, 58, 60, 59, 61, 62, 63, 64],
        status: 'success',
        statusText: 'Excellent'
      },
      {
        kpi: 'Taux d\'Attrition Mensuel (Churn)',
        desc: 'Pourcentage de logos perdus par mois',
        category: 'Clients',
        actual: 0.85,
        target: 0.70,
        unit: ' %',
        delta: 21.43,
        metricType: 'cost',
        trend: [0.65, 0.68, 0.70, 0.72, 0.71, 0.75, 0.78, 0.80, 0.82, 0.84, 0.83, 0.85],
        status: 'danger',
        statusText: 'Alerte'
      },
      {
        kpi: 'Latence API Médiane (p95)',
        desc: 'Temps de réponse des requêtes de production',
        category: 'Tech',
        actual: 118,
        target: 120,
        unit: ' ms',
        delta: -1.67,
        metricType: 'cost',
        trend: [145, 140, 135, 130, 128, 125, 122, 120, 119, 118, 118, 118],
        status: 'success',
        statusText: 'Conforme'
      }
    ]
  };

  /**
   * Formate un nombre selon la norme locale avec séparateurs de milliers et décimales fixes
   */
  function formatNumber(val, unit = '') {
    if (val === null || val === undefined || isNaN(val)) return '—';
    const absVal = Math.abs(val);
    let formatted = '';
    if (absVal >= 1000000) {
      formatted = (val / 1000000).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' M';
    } else if (absVal >= 1000) {
      formatted = val.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 1 });
    } else {
      formatted = Number.isInteger(val) ? val.toString() : val.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
    }
    return formatted + unit;
  }

  /**
   * Génère le SVG inline de la sparkline de tendance (Edward Tufte)
   */
  function generateSparklineSVG(values, width = 110, height = 28, strokeColor = '#2B8CBE', isTufte = false) {
    if (!values || values.length < 2) return '<span style="color:#94A3B8;">—</span>';
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = (max - min) === 0 ? 1 : (max - min);
    const paddingX = 4;
    const paddingY = 4;
    const innerW = width - 2 * paddingX;
    const innerH = height - 2 * paddingY;

    const points = values.map((val, idx) => {
      const x = paddingX + (idx / (values.length - 1)) * innerW;
      const y = height - paddingY - ((val - min) / range) * innerH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const minIdx = values.indexOf(min);
    const maxIdx = values.lastIndexOf(max);
    const lastIdx = values.length - 1;

    const minX = (paddingX + (minIdx / (values.length - 1)) * innerW).toFixed(1);
    const minY = (height - paddingY - ((min - min) / range) * innerH).toFixed(1);

    const maxX = (paddingX + (maxIdx / (values.length - 1)) * innerW).toFixed(1);
    const maxY = (height - paddingY - ((max - min) / range) * innerH).toFixed(1);

    const lastX = (paddingX + (lastIdx / (values.length - 1)) * innerW).toFixed(1);
    const lastY = (height - paddingY - ((values[lastIdx] - min) / range) * innerH).toFixed(1);

    const titleText = `Tendance: Début ${values[0]} → Fin ${values[lastIdx]} (Min: ${min}, Max: ${max})`;

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow:visible; display:block; margin:0 auto;" aria-label="${titleText}">
        <title>${titleText}</title>
        <polyline fill="none" stroke="${strokeColor}" stroke-width="${isTufte ? '1.25' : '1.75'}" stroke-linecap="round" stroke-linejoin="round" points="${points.join(' ')}" />
        ${!isTufte ? `<circle cx="${minX}" cy="${minY}" r="2" fill="#C62828" opacity="0.85"><title>Min: ${min}</title></circle>` : ''}
        ${!isTufte ? `<circle cx="${maxX}" cy="${maxY}" r="2" fill="#2E7D32" opacity="0.85"><title>Max: ${max}</title></circle>` : ''}
        <circle cx="${lastX}" cy="${lastY}" r="${isTufte ? '2' : '2.5'}" fill="${strokeColor}"><title>Dernier: ${values[lastIdx]}</title></circle>
      </svg>
    `;
  }

  /**
   * Crée et initialise un Tableau Exécutif KPI Scorecard
   *
   * @param {string|HTMLElement} target - ID ou élément DOM cible
   * @param {Object} [customData=null] - Jeu de données optionnel
   * @param {string} [themeName='colorbrewer-accessible'] - Identifiant du thème
   * @param {Object} [options={}] - Options de configuration
   * @returns {Object} Instance de contrôle du tableau
   */
  function createTable(target, customData = null, themeName = DEFAULT_THEME, options = {}) {
    let container = null;
    let canvasElement = null;

    if (typeof target === 'string') {
      container = typeof document !== 'undefined' ? document.getElementById(target) : null;
    } else {
      container = target;
    }

    if (!container) {
      // Simulation pour environnement Node.js headless
      return {
        target,
        canvas: null,
        data: customData || DEFAULT_DATA,
        options: options || {},
        theme: themeName,
        destroy: () => {},
        update: () => {},
        setTheme: () => {},
        sort: () => {},
        exportCSV: () => ''
      };
    }

    // Si la cible est un canvas, adapter son conteneur parent pour insérer le tableau
    if (container.tagName === 'CANVAS') {
      canvasElement = container;
      canvasElement.style.display = 'none';
      let wrapper = container.parentElement.querySelector('.kc-table-wrapper');
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'kc-table-wrapper';
        container.parentElement.appendChild(wrapper);
      }
      container = wrapper;
    }

    const tokens = getThemeTokens(themeName, container);
    const isTufte = tokens.name === 'tufte-minimalist-executive';
    const isDark = Boolean(tokens.isDark);

    let data = JSON.parse(JSON.stringify(customData || DEFAULT_DATA));
    let sortColumn = options.sortColumn || null;
    let sortDirection = options.sortDirection || 'asc';

    function render() {
      if (!container) return;

      const primaryColor = getColor(tokens, 0);
      const bgSurface = tokens.surface || (isDark ? '#242933' : '#FFFFFF');
      const bgHeader = isDark ? '#1F232B' : (isTufte ? '#FFFFFF' : '#F8FAFC');
      const borderCol = tokens.border || (isDark ? '#4C566A' : '#E2E8F0');
      const borderStrong = tokens.borderStrong || (isDark ? '#5E81AC' : '#CBD5E1');
      const textPrimary = tokens.textPrimary || (isDark ? '#ECEFF4' : '#0F172A');
      const textSecondary = tokens.textSecondary || (isDark ? '#D8DEE9' : '#475569');
      const textMuted = tokens.textMuted || (isDark ? '#9EABC0' : '#64748B');
      const fontSans = tokens.fontFamily || "'Inter', sans-serif";
      const fontMono = tokens.fontMono || "'JetBrains Mono', monospace";

      // Tri des lignes si requis
      let displayRows = [...data.rows];
      if (sortColumn) {
        displayRows.sort((a, b) => {
          let valA = a[sortColumn];
          let valB = b[sortColumn];
          if (sortColumn === 'delta') {
            valA = typeof a.delta === 'number' ? a.delta : (typeof a.actual === 'number' && typeof a.target === 'number' && a.target !== 0 ? ((a.actual - a.target) / Math.abs(a.target)) * 100 : 0);
            valB = typeof b.delta === 'number' ? b.delta : (typeof b.actual === 'number' && typeof b.target === 'number' && b.target !== 0 ? ((b.actual - b.target) / Math.abs(b.target)) * 100 : 0);
          }
          if (typeof valA === 'string') valA = valA.toLowerCase();
          if (typeof valB === 'string') valB = valB.toLowerCase();
          if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
          if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }

      let html = `
        <div class="kc-dataviz-table-container" style="
          width: 100%;
          overflow-x: auto;
          background: ${bgSurface};
          border: 1px solid ${borderCol};
          border-radius: ${isTufte ? '0' : '10px'};
          box-shadow: ${isTufte ? 'none' : (isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 2px 8px rgba(15,23,42,0.04)')};
          font-family: ${fontSans};
          color: ${textPrimary};
          box-sizing: border-box;
        ">
          <table style="
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            font-size: 0.8125rem;
            line-height: 1.45;
            font-variant-numeric: tabular-nums lining-nums;
            font-feature-settings: 'tnum' 1, 'lnum' 1;
          ">
            <thead>
              <tr style="
                background: ${bgHeader};
                border-bottom: 1.5px solid ${borderStrong};
              ">
      `;

      data.columns.forEach(col => {
        const isSorted = sortColumn === col.key;
        const sortIcon = isSorted ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : '';
        const cursor = col.sortable ? 'cursor: pointer; user-select: none;' : '';
        html += `
          <th data-key="${col.key}" style="
            padding: 10px 14px;
            text-align: ${col.align};
            font-weight: 600;
            font-size: 0.725rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: ${isSorted ? primaryColor : textSecondary};
            border: none;
            white-space: nowrap;
            ${cursor}
          " title="${col.sortable ? 'Cliquer pour trier' : ''}">
            ${col.label}${sortIcon}
          </th>
        `;
      });

      html += `
              </tr>
            </thead>
            <tbody>
      `;

      displayRows.forEach((row, idx) => {
        const rowBg = isTufte
          ? 'transparent'
          : (idx % 2 === 1 ? (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(15,23,42,0.015)') : 'transparent');
        const borderBottom = idx === displayRows.length - 1 ? 'none' : `1px solid ${borderCol}`;

        // Calcul automatique du delta si non spécifié
        let deltaVal = row.delta;
        if (typeof deltaVal !== 'number' && typeof row.actual === 'number' && typeof row.target === 'number' && row.target !== 0) {
          deltaVal = ((row.actual - row.target) / Math.abs(row.target)) * 100;
        }
        const hasDelta = typeof deltaVal === 'number' && !isNaN(deltaVal);
        const effectiveDelta = hasDelta ? deltaVal : 0;
        const deltaColor = hasDelta ? getValenceColor(tokens, effectiveDelta, row.metricType || 'revenue') : textSecondary;
        const arrow = effectiveDelta > 0 ? '↑' : (effectiveDelta < 0 ? '↓' : '=');
        const plusSign = effectiveDelta > 0 ? '+' : '';
        const deltaFormatted = hasDelta ? `${plusSign}${effectiveDelta.toFixed(2)}%` : '—';

        // Badge de statut accessible (Double encodage: couleur + texte + symbole)
        let statusBg = 'rgba(148, 163, 184, 0.15)';
        let statusColor = textSecondary;
        let statusSymbol = '●';

        if (row.status === 'success') {
          statusBg = isDark ? 'rgba(46, 125, 50, 0.25)' : 'rgba(46, 125, 50, 0.12)';
          statusColor = isDark ? '#81C784' : '#2E7D32';
          statusSymbol = '✓';
        } else if (row.status === 'warning') {
          statusBg = isDark ? 'rgba(239, 108, 0, 0.25)' : 'rgba(239, 108, 0, 0.12)';
          statusColor = isDark ? '#FFB74D' : '#D97706';
          statusSymbol = '▲';
        } else if (row.status === 'danger') {
          statusBg = isDark ? 'rgba(198, 40, 40, 0.25)' : 'rgba(198, 40, 40, 0.12)';
          statusColor = isDark ? '#E57373' : '#C62828';
          statusSymbol = '■';
        }

        html += `
          <tr class="kc-table-row" style="
            background: ${rowBg};
            border-bottom: ${borderBottom};
            transition: background 0.15s ease;
          ">
            <td style="padding: 10px 14px; text-align: left; vertical-align: middle;">
              <div style="font-weight: 600; color: ${textPrimary};">${row.kpi}</div>
              ${row.desc ? `<div style="font-size: 0.7rem; color: ${textMuted}; margin-top: 1px;">${row.desc}</div>` : ''}
            </td>
            <td style="padding: 10px 14px; text-align: center; vertical-align: middle;">
              <span style="
                display: inline-block;
                padding: 2px 7px;
                border-radius: 9999px;
                font-size: 0.7rem;
                font-weight: 500;
                background: ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)'};
                color: ${textSecondary};
              ">${row.category}</span>
            </td>
            <td style="padding: 10px 14px; text-align: right; font-family: ${fontMono}; font-weight: 600; color: ${textPrimary}; vertical-align: middle;">
              ${formatNumber(row.actual, row.unit || '')}
            </td>
            <td style="padding: 10px 14px; text-align: right; font-family: ${fontMono}; color: ${textSecondary}; vertical-align: middle;">
              ${formatNumber(row.target, row.unit || '')}
            </td>
            <td style="padding: 10px 14px; text-align: right; vertical-align: middle;">
              <span style="
                display: inline-flex;
                align-items: center;
                gap: 3px;
                font-family: ${fontMono};
                font-weight: 600;
                font-size: 0.775rem;
                color: ${deltaColor};
              ">
                <span>${hasDelta ? arrow : ''}</span>
                <span>${deltaFormatted}</span>
              </span>
            </td>
            <td style="padding: 6px 10px; text-align: center; vertical-align: middle;">
              ${generateSparklineSVG(row.trend, 105, 26, primaryColor, isTufte)}
            </td>
            <td style="padding: 10px 14px; text-align: center; vertical-align: middle;">
              <span style="
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 3px 8px;
                border-radius: ${isTufte ? '0' : '4px'};
                font-size: 0.725rem;
                font-weight: 600;
                background: ${statusBg};
                color: ${statusColor};
                border: ${isTufte ? `1px solid ${statusColor}` : 'none'};
                white-space: nowrap;
              ">
                <span aria-hidden="true" style="font-size: 0.65rem;">${statusSymbol}</span>
                <span>${row.statusText || row.status}</span>
              </span>
            </td>
          </tr>
        `;
      });

      html += `
            </tbody>
          </table>
        </div>
      `;

      container.innerHTML = html;

      // Attacher les gestionnaires de tri interactif
      const headers = container.querySelectorAll('th[data-key]');
      headers.forEach(th => {
        const key = th.getAttribute('data-key');
        const colDef = data.columns.find(c => c.key === key);
        if (colDef && colDef.sortable) {
          th.addEventListener('click', () => {
            if (sortColumn === key) {
              sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
              sortColumn = key;
              sortDirection = 'asc';
            }
            render();
          });
        }
      });
    }

    render();

    return {
      container,
      canvas: canvasElement,
      data,
      options: options || {},
      theme: themeName,
      destroy: () => {
        if (container) container.innerHTML = '';
        if (canvasElement) canvasElement.style.display = '';
      },
      update: (newData) => {
        if (newData) data = JSON.parse(JSON.stringify(newData));
        render();
      },
      setTheme: (newTheme) => {
        themeName = newTheme;
        render();
      },
      sort: (key, direction = 'asc') => {
        sortColumn = key;
        sortDirection = direction;
        render();
      },
      exportCSV: () => {
        const headers = data.columns.map(c => `"${c.label}"`).join(';');
        const rows = data.rows.map(r => [
          `"${r.kpi}"`,
          `"${r.category}"`,
          r.actual,
          r.target,
          r.delta,
          `"${(r.trend || []).join(',')}"`,
          `"${r.statusText || r.status}"`
        ].join(';')).join('\n');
        return `${headers}\n${rows}`;
      }
    };
  }

  // Alias createChart pour conformité absolue avec le registre global kit-charts
  const createChart = function(target, customData = null, themeName = DEFAULT_THEME, options = {}) {
    return createTable(target, customData, themeName, options);
  };

  const moduleExports = {
    DEFAULT_DATA,
    createTable,
    createChart,
    renderTable: createTable,
    formatNumber,
    generateSparklineSVG
  };

  moduleExports.default = moduleExports;
  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/09-tableaux-dataviz/table-ranking-leaderboard
  // --------------------------------------------------------------------------
  global.KitCharts["table-ranking-leaderboard"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

'use strict';

  const getThemeTokens = (KitChartsTheme && KitChartsTheme.getThemeTokens) || (typeof window !== 'undefined' && window.getThemeTokens) || function(t) { return {}; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const DEFAULT_THEME = (KitChartsTheme && KitChartsTheme.DEFAULT_THEME) || 'colorbrewer-accessible';

  /**
   * Données par défaut représentatives : Classement de performance des équipes commerciales & scoring global
   */
  const DEFAULT_DATA = {
    title: 'Classement de la Performance Commerciale — Leaderboard Trimestriel',
    subtitle: 'Classement ordonné par score global, progression de rang et dynamique sur 6 mois',
    columns: [
      { key: 'rank', label: 'Rang', align: 'center', sortable: true },
      { key: 'trendRank', label: 'Progression', align: 'center', sortable: true },
      { key: 'team', label: 'Équipe Commerciale', align: 'left', sortable: true },
      { key: 'region', label: 'Région', align: 'center', sortable: true },
      { key: 'score', label: 'Score Global (Base 100)', align: 'right', sortable: true, format: 'score_bar' },
      { key: 'deals', label: 'Contrats Signés', align: 'right', sortable: true, format: 'number' },
      { key: 'conversion', label: 'Taux Conv.', align: 'right', sortable: true, format: 'percent' },
      { key: 'monthlyActivity', label: 'Activité 6M', align: 'center', sortable: false, format: 'sparkbar' }
    ],
    rows: [
      { rank: 1, prevRank: 2, team: 'Équipe Alpha Grands Comptes', leader: 'Sophie Martin', region: 'EMEA', score: 98.4, deals: 42, conversion: 34.2, activity: [18, 22, 25, 28, 35, 42] },
      { rank: 2, prevRank: 1, team: 'Division Fintech & Banking', leader: 'Marc Dupont', region: 'US East', score: 95.1, deals: 39, conversion: 31.8, activity: [24, 28, 32, 36, 38, 39] },
      { rank: 3, prevRank: 4, team: 'Pôle Retail & E-Commerce', leader: 'Camille Leroy', region: 'Europe Ouest', score: 91.8, deals: 36, conversion: 29.5, activity: [15, 19, 24, 28, 30, 36] },
      { rank: 4, prevRank: 3, team: 'Équipe Santé & Pharma', leader: 'Alexandre Roux', region: 'France', score: 86.2, deals: 29, conversion: 27.0, activity: [22, 25, 27, 28, 29, 29] },
      { rank: 5, prevRank: 7, team: 'SaaS & Scale-ups', leader: 'Elena Rossi', region: 'DACH', score: 82.5, deals: 31, conversion: 25.4, activity: [12, 16, 20, 24, 28, 31] },
      { rank: 6, prevRank: 5, team: 'Secteur Public & Éducation', leader: 'Thomas Bernard', region: 'France', score: 79.3, deals: 24, conversion: 22.8, activity: [18, 20, 22, 23, 25, 24] },
      { rank: 7, prevRank: 6, team: 'Industrie & Manufacturing', leader: 'David Chen', region: 'APAC', score: 74.6, deals: 21, conversion: 21.0, activity: [16, 17, 19, 20, 22, 21] },
      { rank: 8, prevRank: 8, team: 'Mid-Market Emerging', leader: 'Inès Dubois', region: 'Nordics', score: 68.0, deals: 18, conversion: 18.5, activity: [10, 12, 14, 15, 16, 18] }
    ]
  };

  /**
   * Génère une micro-jauge de score proportionnelle à la première place
   */
  function generateScoreBarSVG(score, maxScore = 100, width = 100, height = 12, color = '#2B8CBE', isDark = false, isTufte = false) {
    const ratio = Math.max(0, Math.min(1, score / maxScore));
    const barWidth = Math.max(2, ratio * width).toFixed(1);
    const bgTrack = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)';

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="display:inline-block; vertical-align:middle; margin-right:6px;" aria-hidden="true">
        <rect x="0" y="1" width="${width}" height="${height - 2}" rx="${isTufte ? 0 : 3}" fill="${bgTrack}" />
        <rect x="0" y="1" width="${barWidth}" height="${height - 2}" rx="${isTufte ? 0 : 3}" fill="${color}" />
      </svg>
    `;
  }

  /**
   * Génère une micro sparkbar mensuelle d'activité SVG (6 barres verticales)
   */
  function generateSparkbarSVG(values, width = 72, height = 22, baseColor = '#94A3B8', focalColor = '#2B8CBE', isTufte = false) {
    if (!values || values.length === 0) return '';
    const max = Math.max(...values, 1);
    const count = values.length;
    const barWidth = 7;
    const gap = 4;
    const totalW = count * barWidth + (count - 1) * gap;

    const bars = values.map((val, idx) => {
      const isLast = idx === count - 1;
      const h = Math.max(2, (val / max) * (height - 4));
      const x = idx * (barWidth + gap);
      const y = height - h;
      const color = isLast ? focalColor : baseColor;
      return `<rect x="${x}" y="${y.toFixed(1)}" width="${barWidth}" height="${h.toFixed(1)}" rx="${isTufte ? 0 : 1.5}" fill="${color}" opacity="${isLast ? '1' : '0.65'}"><title>Mois ${idx + 1}: ${val}</title></rect>`;
    });

    return `
      <svg width="${totalW}" height="${height}" viewBox="0 0 ${totalW} ${height}" style="display:block; margin:0 auto;" aria-hidden="true">
        ${bars.join('')}
      </svg>
    `;
  }

  /**
   * Crée et initialise un Tableau de Classement Leaderboard
   *
   * @param {string|HTMLElement} target - ID ou élément DOM cible
   * @param {Object} [customData=null] - Données personnalisées
   * @param {string} [themeName='colorbrewer-accessible'] - Nom du thème
   * @param {Object} [options={}] - Options de configuration
   * @returns {Object} Instance de contrôle
   */
  function createTable(target, customData = null, themeName = DEFAULT_THEME, options = {}) {
    let container = null;
    let canvasElement = null;

    if (typeof target === 'string') {
      container = typeof document !== 'undefined' ? document.getElementById(target) : null;
    } else {
      container = target;
    }

    if (!container) {
      return {
        target,
        canvas: null,
        data: customData || DEFAULT_DATA,
        options: options || {},
        theme: themeName,
        destroy: () => {},
        update: () => {},
        setTheme: () => {},
        sort: () => {},
        exportCSV: () => ''
      };
    }

    if (container.tagName === 'CANVAS') {
      canvasElement = container;
      canvasElement.style.display = 'none';
      let wrapper = container.parentElement.querySelector('.kc-table-wrapper');
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'kc-table-wrapper';
        container.parentElement.appendChild(wrapper);
      }
      container = wrapper;
    }

    const tokens = getThemeTokens(themeName, container);
    const isTufte = tokens.name === 'tufte-minimalist-executive';
    const isDark = Boolean(tokens.isDark);

    let data = JSON.parse(JSON.stringify(customData || DEFAULT_DATA));
    let sortColumn = options.sortColumn || 'rank';
    let sortDirection = options.sortDirection || 'asc';

    function render() {
      if (!container) return;

      const primaryColor = getColor(tokens, 0);
      const bgSurface = tokens.surface || (isDark ? '#242933' : '#FFFFFF');
      const bgHeader = isDark ? '#1F232B' : (isTufte ? '#FFFFFF' : '#F8FAFC');
      const borderCol = tokens.border || (isDark ? '#4C566A' : '#E2E8F0');
      const borderStrong = tokens.borderStrong || (isDark ? '#5E81AC' : '#CBD5E1');
      const textPrimary = tokens.textPrimary || (isDark ? '#ECEFF4' : '#0F172A');
      const textSecondary = tokens.textSecondary || (isDark ? '#D8DEE9' : '#475569');
      const textMuted = tokens.textMuted || (isDark ? '#9EABC0' : '#64748B');
      const fontSans = tokens.fontFamily || "'Inter', sans-serif";
      const fontMono = tokens.fontMono || "'JetBrains Mono', monospace";

      // Tri des lignes
      let displayRows = [...data.rows];
      if (sortColumn) {
        displayRows.sort((a, b) => {
          let valA = a[sortColumn];
          let valB = b[sortColumn];
          if (sortColumn === 'trendRank') {
            valA = (a.prevRank || a.rank) - a.rank;
            valB = (b.prevRank || b.rank) - b.rank;
          }
          if (typeof valA === 'string') valA = valA.toLowerCase();
          if (typeof valB === 'string') valB = valB.toLowerCase();
          if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
          if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }

      let html = `
        <div class="kc-dataviz-leaderboard-container" style="
          width: 100%;
          overflow-x: auto;
          background: ${bgSurface};
          border: 1px solid ${borderCol};
          border-radius: ${isTufte ? '0' : '10px'};
          box-shadow: ${isTufte ? 'none' : (isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 2px 8px rgba(15,23,42,0.04)')};
          font-family: ${fontSans};
          color: ${textPrimary};
          box-sizing: border-box;
        ">
          <table style="
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            font-size: 0.8125rem;
            line-height: 1.45;
            font-variant-numeric: tabular-nums lining-nums;
            font-feature-settings: 'tnum' 1, 'lnum' 1;
          ">
            <thead>
              <tr style="
                background: ${bgHeader};
                border-bottom: 1.5px solid ${borderStrong};
              ">
      `;

      data.columns.forEach(col => {
        const isSorted = sortColumn === col.key;
        const sortIcon = isSorted ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : '';
        const cursor = col.sortable ? 'cursor: pointer; user-select: none;' : '';
        html += `
          <th data-key="${col.key}" style="
            padding: 10px 14px;
            text-align: ${col.align};
            font-weight: 600;
            font-size: 0.725rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: ${isSorted ? primaryColor : textSecondary};
            border: none;
            white-space: nowrap;
            ${cursor}
          " title="${col.sortable ? 'Cliquer pour trier' : ''}">
            ${col.label}${sortIcon}
          </th>
        `;
      });

      html += `
              </tr>
            </thead>
            <tbody>
      `;

      displayRows.forEach((row, idx) => {
        const rowBg = isTufte
          ? 'transparent'
          : (idx % 2 === 1 ? (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(15,23,42,0.015)') : 'transparent');
        const borderBottom = idx === displayRows.length - 1 ? 'none' : `1px solid ${borderCol}`;

        // Badge de Podium (Rang 1 Or, Rang 2 Argent, Rang 3 Bronze)
        let rankBadge = '';
        if (row.rank === 1) {
          rankBadge = `<span style="
            display: inline-flex; align-items: center; justify-content: center;
            width: 24px; height: 24px; border-radius: 50%;
            background: #FEF3C7; color: #92400E; font-weight: 700; font-size: 0.75rem;
            box-shadow: 0 1px 3px rgba(180, 83, 9, 0.2);
          ">1</span>`;
        } else if (row.rank === 2) {
          rankBadge = `<span style="
            display: inline-flex; align-items: center; justify-content: center;
            width: 24px; height: 24px; border-radius: 50%;
            background: #E2E8F0; color: #334155; font-weight: 700; font-size: 0.75rem;
          ">2</span>`;
        } else if (row.rank === 3) {
          rankBadge = `<span style="
            display: inline-flex; align-items: center; justify-content: center;
            width: 24px; height: 24px; border-radius: 50%;
            background: #FFEDD5; color: #9A3412; font-weight: 700; font-size: 0.75rem;
          ">3</span>`;
        } else {
          rankBadge = `<span style="font-family: ${fontMono}; font-weight: 600; color: ${textMuted};">${row.rank}</span>`;
        }

        // Évolution de position
        const deltaRank = (row.prevRank || row.rank) - row.rank;
        let trendHtml = `<span style="color: ${textMuted}; font-size: 0.75rem;">=</span>`;
        if (deltaRank > 0) {
          trendHtml = `<span style="color: ${tokens.status?.success || '#2E7D32'}; font-weight: 700; font-size: 0.75rem;">▲ +${deltaRank}</span>`;
        } else if (deltaRank < 0) {
          trendHtml = `<span style="color: ${tokens.status?.danger || '#C62828'}; font-weight: 700; font-size: 0.75rem;">▼ ${deltaRank}</span>`;
        }

        html += `
          <tr class="kc-table-row" style="
            background: ${rowBg};
            border-bottom: ${borderBottom};
            transition: background 0.15s ease;
          ">
            <td style="padding: 10px 14px; text-align: center; vertical-align: middle;">
              ${rankBadge}
            </td>
            <td style="padding: 10px 14px; text-align: center; vertical-align: middle;">
              ${trendHtml}
            </td>
            <td style="padding: 10px 14px; text-align: left; vertical-align: middle;">
              <div style="font-weight: 600; color: ${textPrimary};">${row.team}</div>
              ${row.leader ? `<div style="font-size: 0.7rem; color: ${textMuted};">Lead: ${row.leader}</div>` : ''}
            </td>
            <td style="padding: 10px 14px; text-align: center; vertical-align: middle;">
              <span style="
                display: inline-block;
                padding: 2px 7px;
                border-radius: 9999px;
                font-size: 0.7rem;
                font-weight: 500;
                background: ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)'};
                color: ${textSecondary};
              ">${row.region}</span>
            </td>
            <td style="padding: 10px 14px; text-align: right; vertical-align: middle; white-space: nowrap;">
              <div style="display: flex; align-items: center; justify-content: flex-end;">
                ${generateScoreBarSVG(row.score, 100, 75, 12, primaryColor, isDark, isTufte)}
                <span style="font-family: ${fontMono}; font-weight: 700; color: ${textPrimary}; width: 38px; text-align: right;">
                  ${row.score.toFixed(1)}
                </span>
              </div>
            </td>
            <td style="padding: 10px 14px; text-align: right; font-family: ${fontMono}; color: ${textPrimary}; vertical-align: middle;">
              ${row.deals}
            </td>
            <td style="padding: 10px 14px; text-align: right; font-family: ${fontMono}; color: ${textSecondary}; vertical-align: middle;">
              ${row.conversion.toFixed(1)}%
            </td>
            <td style="padding: 6px 10px; text-align: center; vertical-align: middle;">
              ${generateSparkbarSVG(row.activity, 72, 22, textMuted, primaryColor, isTufte)}
            </td>
          </tr>
        `;
      });

      html += `
            </tbody>
          </table>
        </div>
      `;

      container.innerHTML = html;

      // Écouteurs de tri
      const headers = container.querySelectorAll('th[data-key]');
      headers.forEach(th => {
        const key = th.getAttribute('data-key');
        const colDef = data.columns.find(c => c.key === key);
        if (colDef && colDef.sortable) {
          th.addEventListener('click', () => {
            if (sortColumn === key) {
              sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
              sortColumn = key;
              sortDirection = key === 'rank' ? 'asc' : 'desc';
            }
            render();
          });
        }
      });
    }

    render();

    return {
      container,
      canvas: canvasElement,
      data,
      options: options || {},
      theme: themeName,
      destroy: () => {
        if (container) container.innerHTML = '';
        if (canvasElement) canvasElement.style.display = '';
      },
      update: (newData) => {
        if (newData) data = JSON.parse(JSON.stringify(newData));
        render();
      },
      setTheme: (newTheme) => {
        themeName = newTheme;
        render();
      },
      sort: (key, direction = 'asc') => {
        sortColumn = key;
        sortDirection = direction;
        render();
      },
      exportCSV: () => {
        const headers = data.columns.map(c => `"${c.label}"`).join(';');
        const rows = data.rows.map(r => [
          r.rank,
          (r.prevRank || r.rank) - r.rank,
          `"${r.team}"`,
          `"${r.region}"`,
          r.score,
          r.deals,
          r.conversion
        ].join(';')).join('\n');
        return `${headers}\n${rows}`;
      }
    };
  }

  const createChart = function(target, customData = null, themeName = DEFAULT_THEME, options = {}) {
    return createTable(target, customData, themeName, options);
  };

  const moduleExports = {
    DEFAULT_DATA,
    createTable,
    createChart,
    renderTable: createTable,
    generateScoreBarSVG,
    generateSparkbarSVG
  };

  moduleExports.default = moduleExports;
  return moduleExports;

    };
    return factory(KitChartsTheme);
  })();

  // --------------------------------------------------------------------------
  // Chart: template/tooltip
  // --------------------------------------------------------------------------
  global.KitCharts["tooltip"] = (function() {
    var KitChartsTheme = ThemeModule;
    var factory = function(KitChartsTheme) {

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

    };
    return factory(KitChartsTheme);
  })();

})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : this);
