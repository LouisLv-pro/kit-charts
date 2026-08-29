/**
 * @file template/09-tableaux-dataviz/table-heatmap-matrix/template.js
 * @description Standardized Universal table-heatmap-matrix Template for kit-charts.
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
    global.KitCharts['table-heatmap-matrix'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
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
});
