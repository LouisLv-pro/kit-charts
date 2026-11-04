/**
 * @file template/00-kpi-card/kpi-bullet/template.js
 * @description Standardized Universal kpi-bullet Template for kit-charts.
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
    global.KitCharts['kpi-bullet'] = exp;
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
   * Statut d'atteinte selon la polarité : 'cost' = LOWER_IS_BETTER (atteint si valeur <= cible).
   * @returns {{attainment:number, isCost:boolean, success:boolean, near:boolean}}
   */
  function resolveAttainment(actual, target, metricType) {
    const isCost = metricType === 'cost';
    const attainment = Math.round((actual / target) * 100);
    const success = isCost ? actual <= target : actual >= target;
    const near = !success && (isCost ? actual <= target * 1.2 : actual >= target * 0.85);
    return { attainment, isCost, success, near };
  }

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
    if (!isNum(d.target) || d.target <= 0) return `formattedData.target attendu en nombre strictement positif, reçu ${isNum(d.target) ? d.target : kindOf(d.target)}`;
    if (d.ranges !== undefined && d.ranges !== null && !(Array.isArray(d.ranges) && d.ranges.length >= 3 && d.ranges.slice(0, 3).every(isNum))) {
      return 'formattedData.ranges attendu en tableau de 3 nombres [bas, moyen, plafond]';
    }
    return null;
  }

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
    const invalidReason = customData ? validateData(customData) : null;
    if (invalidReason) return renderInvalidData(canvas, invalidReason);
    const data = customData || DEFAULT_DATA;
    const isDark = Boolean(tokens.isDark);

    let actual = data.value;
    let target = data.target;
    let ranges = Array.isArray(data.ranges) ? data.ranges : null;

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
        if (resolvedProvenance && resolvedProvenance.warning !== null && resolvedProvenance.danger !== null) {
          ranges = [resolvedProvenance.danger, resolvedProvenance.warning, target * 1.15];
        }
      }
    }

    const maxScale = Math.max((ranges && ranges[2]) || target * 1.15, actual * 1.05, target * 1.05);
    const unitSuffix = data.unit ? ' ' + data.unit : '';


    const status = resolveAttainment(actual, target, data.metricType);
    const attainment = status.attainment;
    const barColor = status.success
      ? (tokens.semantic?.positive || '#2E7D32')
      : (status.near ? (tokens.palette[0] || '#2B8CBE') : (tokens.semantic?.negative || '#C62828'));
    // Gradation des bandes : la plus foncée = zone la moins bonne (convention Few), identique clair/sombre.
    const bandAlpha = status.isCost ? [0.05, 0.11, 0.18] : [0.18, 0.11, 0.05];
    const bandBase = isDark ? '255, 255, 255' : '15, 23, 42';
    const bandFill = (i) => `rgba(${bandBase}, ${isDark ? bandAlpha[i] * 0.8 : bandAlpha[i]})`;
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
          ranges && {
            label: 'Plage Insatisfaisant',
            data: [ranges[0]],
            backgroundColor: bandFill(0),
            barThickness: 24,
            borderRadius: 4,
            order: 4,
            grouped: false
          },
          // 3. Plage Qualificative 2 (Moyen / Satisfaisant)
          ranges && {
            label: 'Plage Satisfaisant',
            data: [ranges[1]],
            backgroundColor: bandFill(1),
            barThickness: 24,
            borderRadius: 4,
            order: 3,
            grouped: false
          },
          // 4. Plage Qualificative 3 (Optimal / Plafond)
          ranges && {
            label: 'Plage Optimale',
            data: [ranges[2]],
            backgroundColor: bandFill(2),
            barThickness: 24,
            borderRadius: 4,
            order: 2,
            grouped: false
          }
        ].filter(Boolean)
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
            filter: (item) => item.datasetIndex === 0,
            callbacks: {
              title: () => data.title,
              label: (ctx) => `Réalisé : ${actual.toLocaleString('fr-FR')}${unitSuffix} (${attainment}% de l'objectif de ${target.toLocaleString('fr-FR')}${unitSuffix})${resolvedProvenance ? ' • ' + resolvedProvenance.badge : ''}`
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
    const invalidReason = customData ? validateData(customData) : null;
    if (invalidReason) return renderInvalidData(el, invalidReason);
    const data = customData || DEFAULT_DATA;
    const canvasId = 'kpi-bullet-canvas-' + Math.random().toString(36).substr(2, 9);

    const actual = data.value;
    const target = data.target;
    const st = resolveAttainment(actual, target, data.metricType);
    const attainment = st.attainment;
    const statusLabel = st.success ? 'Atteint' : (st.isCost ? 'Dépassé' : 'En cours');

    const statusColor = st.success
      ? (tokens.semantic?.positive || '#2E7D32')
      : (st.near ? (tokens.palette[0] || '#2B8CBE') : (tokens.semantic?.negative || '#C62828'));

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
          ">${escapeHtml(data.title)}</span>
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
            color: ${readableText(statusColor, (tokens.surfaceRaised || tokens.surface), tokens.isDark ? 0.18 : 0.10)};
            border: 1px solid ${badgeBorder};
          ">
            <span style="display: block; text-align: center;">${attainment}%</span>
            <span style="display: block; font-size: 0.675rem; font-weight: 600; text-align: center;">${statusLabel}</span>
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
            ${actual.toLocaleString('fr-FR')} <span style="font-size: 1.25rem; font-weight: 500; color: ${tokens.textMuted};">${escapeHtml(data.unit || '')}</span>
          </div>
          <div style="font-size: 0.78125rem; font-weight: 600; color: ${tokens.textMuted}; text-align: right;">
            Cible : ${target.toLocaleString('fr-FR')} ${escapeHtml(data.unit || '')}
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
          ${escapeHtml(data.footnote)}
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
