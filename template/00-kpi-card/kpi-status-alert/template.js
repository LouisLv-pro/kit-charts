/**
 * @file template/00-kpi-card/kpi-status-alert/template.js
 * @description Standardized Universal kpi-status-alert Template for kit-charts.
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
    global.KitCharts['kpi-status-alert'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
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
});
