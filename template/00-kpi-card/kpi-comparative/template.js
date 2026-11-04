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
  const escapeHtml = (KitChartsTheme && KitChartsTheme.escapeHtml) || (typeof window !== 'undefined' && window.escapeHtml) || function(v) { return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); };
  const checkRequiredArrays = (KitChartsTheme && KitChartsTheme.checkRequiredArrays) || (typeof window !== 'undefined' && window.checkRequiredArrays) || function() { return null; };
  const renderInvalidData = (KitChartsTheme && KitChartsTheme.renderInvalidData) || (typeof window !== 'undefined' && window.renderInvalidData) || function(t, r) { if (typeof console !== 'undefined') console.error('[kit-charts] Données invalides : ' + r); return null; };
  const getColor = (KitChartsTheme && KitChartsTheme.getColor) || (typeof window !== 'undefined' && window.getColor) || function(t, i) { return '#2B8CBE'; };
  const getValenceColor = (KitChartsTheme && KitChartsTheme.getValenceColor) || (typeof window !== 'undefined' && window.getValenceColor) || function(t, d, m) { return d >= 0 ? '#2E7D32' : '#C62828'; };
  const resolveThresholds = (KitChartsTheme && KitChartsTheme.resolveThresholds) || (typeof window !== 'undefined' && window.resolveThresholds) || null;
  const hexToRgba = (KitChartsTheme && KitChartsTheme.hexToRgba) || (typeof window !== 'undefined' && window.hexToRgba) || function(c, a) { return c; };
  const readableText = (fg, surface, alpha) => {
    const parse = (h) => { const m = /^#?([0-9a-f]{6})$/i.exec(String(h || '').trim()) || /^#?([0-9a-f]{3})$/i.exec(String(h || '').trim()); if (!m) return null; let x = m[1]; if (x.length === 3) x = x.split('').map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(x.slice(i, i + 2), 16)); };
    const lum = (c) => { const l = c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]; };
    const ratio = (a, b) => { const la = lum(a), lb = lum(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); };
    const f = parse(fg), s = parse(surface);
    if (!f || !s) return fg;
    const a = alpha == null ? 0.18 : alpha;
    const bg = s.map((v, i) => Math.round(v * (1 - a) + f[i] * a));
    const toward = lum(bg) < 0.4 ? 255 : 0;
    let c = f.slice();
    for (let t = 0; t <= 1.0001 && ratio(c, bg) < 4.6; t += 0.05) c = f.map(v => Math.round(v + (toward - v) * t));
    return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
  };
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

  const kindOf = (v) => (v === undefined ? 'absent' : (v === null ? 'null' : (Array.isArray(v) ? 'tableau' : typeof v)));
  const isNum = (v) => typeof v === 'number' && Number.isFinite(v);

  /**
   * Contrôle les champs indispensables quand des données sont fournies.
   * Aucun champ manquant n'est repris de DEFAULT_DATA : la carte passe en état invalide.
   * @param {Object} d - customData
   * @returns {string|null} Raison lisible, ou null si les données sont exploitables
   */
  function validateData(d) {
    if (!d || typeof d !== 'object' || Array.isArray(d)) return 'formattedData doit être un objet';
    if (typeof d.title !== 'string' || !d.title.trim()) return `formattedData.title attendu en texte non vide, reçu ${kindOf(d.title)}`;
    if (!isNum(d.value)) return `formattedData.value attendu en nombre, reçu ${kindOf(d.value)}`;
    for (const key of ['historical', 'budget']) {
      const ref = d[key];
      if (!ref || typeof ref !== 'object' || Array.isArray(ref)) return `formattedData.${key} attendu en objet { value, label?, deltaAbs?, deltaPct? }, reçu ${kindOf(ref)}`;
      if (!isNum(ref.value)) return `formattedData.${key}.value attendu en nombre, reçu ${kindOf(ref.value)}`;
      for (const f of ['deltaAbs', 'deltaPct']) {
        if (ref[f] !== undefined && ref[f] !== null && !isNum(ref[f])) return `formattedData.${key}.${f} attendu en nombre, reçu ${kindOf(ref[f])}`;
      }
    }
    return null;
  }

  /**
   * Repère comparatif complet : écarts fournis, sinon calculés depuis les valeurs fournies.
   * deltaPct reste null si la référence vaut 0 (pourcentage non défini).
   */
  function withDeltas(ref, slotLabel, current) {
    const deltaAbs = isNum(ref.deltaAbs) ? ref.deltaAbs : Math.round((current - ref.value) * 100) / 100;
    const deltaPct = isNum(ref.deltaPct) ? ref.deltaPct : (ref.value !== 0 ? Math.round((deltaAbs / Math.abs(ref.value)) * 1000) / 10 : null);
    return { label: typeof ref.label === 'string' && ref.label ? ref.label : slotLabel, value: ref.value, deltaAbs, deltaPct };
  }

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
    const invalidReason = customData ? validateData(customData) : null;
    if (invalidReason) return renderInvalidData(canvas, invalidReason);
    const data = customData || DEFAULT_DATA;
    const isDark = Boolean(tokens.isDark);

    const currentVal = data.value;
    const histVal = data.historical.value;
    const budgetVal = data.budget.value;

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
        animation: false,
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
    const invalidReason = customData ? validateData(customData) : null;
    if (invalidReason) return renderInvalidData(el, invalidReason);
    const data = customData || DEFAULT_DATA;
    const isDark = Boolean(tokens.isDark);

    const hist = withDeltas(data.historical, 'vs N-1', data.value);
    const bud = withDeltas(data.budget, 'vs Budget', data.value);

    const histValence = hist.deltaAbs >= 0 ? 1 : -1;
    const histColor = getValenceColor(tokens, histValence, data.metricType || 'gain');
    const histBg = hexToRgba(histColor, isDark ? 0.18 : 0.10);
    const histBorder = hexToRgba(histColor, isDark ? 0.35 : 0.25);

    const budValence = bud.deltaAbs >= 0 ? 1 : -1;
    const budColor = getValenceColor(tokens, budValence, data.metricType || 'gain');
    const budBg = hexToRgba(budColor, isDark ? 0.18 : 0.10);
    const budBorder = hexToRgba(budColor, isDark ? 0.35 : 0.25);

    function formatRefValue(val, unit) {
      const formattedVal = typeof val === 'number' ? val.toLocaleString('fr-FR') : String(val);
      return `${formattedVal}${unit ? ' ' + unit : ''}`;
    }

    function formatDeltaPct(deltaPct) {
      return isNum(deltaPct) ? ` (${deltaPct >= 0 ? '+' : ''}${deltaPct.toLocaleString('fr-FR', { maximumFractionDigits: 1 })}%)` : '';
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
          ">${escapeHtml(data.title)}</span>
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
            ${data.value.toLocaleString('fr-FR')} <span style="font-size: 1.25rem; font-weight: 500; color: ${tokens.textMuted};">${escapeHtml(data.unit || '')}</span>
          </div>
        </div>

        <!-- Double Repere Comparatif : grille 2x2 (labels ligne 1, pastilles ligne 2).
             Les pastilles restent alignees quelle que soit la hauteur des labels. -->
        <div style="
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 4px 6px;
          padding: 8px 6px;
          background: ${tokens.gridColor || (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.03)')};
          border-radius: 8px;
          margin-bottom: 0.5rem;
        ">
          <div style="font-size: 0.7rem; font-weight: 600; color: ${tokens.textMuted}; text-transform: uppercase; text-align: center; white-space: normal; overflow-wrap: break-word; max-width: 100%; min-width: 0;">
            ${escapeHtml(hist.label)}<br><span style="font-weight: 500; font-variant-numeric: tabular-nums; white-space: nowrap;">${escapeHtml(formatRefValue(hist.value, data.unit))}</span>
          </div>
          <div style="font-size: 0.7rem; font-weight: 600; color: ${tokens.textMuted}; text-transform: uppercase; text-align: center; white-space: normal; overflow-wrap: break-word; max-width: 100%; min-width: 0;">
            ${escapeHtml(bud.label)}<br><span style="font-weight: 500; font-variant-numeric: tabular-nums; white-space: nowrap;">${escapeHtml(formatRefValue(bud.value, data.unit))}</span>
          </div>
          <div style="display: flex; justify-content: center; min-width: 0;">
            <div style="
              display: inline-flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              gap: 2px 4px;
              flex-wrap: wrap;
              max-width: 100%;
              margin-top: 4px;
              padding: 3px 8px;
              border-radius: 12px;
              font-size: 0.7rem;
              font-weight: 700;
              white-space: normal;
              font-variant-numeric: tabular-nums;
              background: ${histBg};
              color: ${readableText(histColor, (tokens.surfaceRaised || tokens.surface), isDark ? 0.18 : 0.10)};
              border: 1px solid ${histBorder};
            ">
              <span style="font-size: 0.65rem;">${hist.deltaAbs >= 0 ? '▲' : '▼'}</span>
              <span>${escapeHtml(formatDeltaAbs(hist.deltaAbs, data.unit))}${formatDeltaPct(hist.deltaPct)}</span>
            </div>
          </div>

          <div style="display: flex; justify-content: center; min-width: 0;">
            <div style="
              display: inline-flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              gap: 2px 4px;
              flex-wrap: wrap;
              max-width: 100%;
              margin-top: 4px;
              padding: 3px 8px;
              border-radius: 12px;
              font-size: 0.7rem;
              font-weight: 700;
              white-space: normal;
              font-variant-numeric: tabular-nums;
              background: ${budBg};
              color: ${readableText(budColor, (tokens.surfaceRaised || tokens.surface), isDark ? 0.18 : 0.10)};
              border: 1px solid ${budBorder};
            ">
              <span style="font-size: 0.65rem;">${bud.deltaAbs >= 0 ? '▲' : '▼'}</span>
              <span>${escapeHtml(formatDeltaAbs(bud.deltaAbs, data.unit))}${formatDeltaPct(bud.deltaPct)}</span>
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
          ${escapeHtml(data.footnote)}
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
