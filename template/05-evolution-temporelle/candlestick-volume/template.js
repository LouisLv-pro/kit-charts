/**
 * @file 05-evolution-temporelle/candlestick-volume/template.js
 * @description Standardized Candlestick + Trading Volume (Stacked Panels) Template for kit-charts.
 * Adheres strictly to cognitive dual-panel architecture sharing the same X temporal continuum.
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
    global.KitCharts['candlestick-volume'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
    global.computeVolumeMA = exp.computeVolumeMA;
    global.computeCandleStats = exp.computeCandleStats;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {
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
        animation: getAccessibleAnimationOptions(tokens, { duration: 400, easing: 'easeOutQuart' }),
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
});
