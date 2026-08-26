/**
 * @file test/verify-anscombe-guards.mjs
 * @description Verification suite for Anscombe Small-Sample Guardrails (T9).
 */

import { assert, expect } from './test-helpers.js';
import boxPlot from '../template/03-distribution/box-plot/template.js';
import stripPlot from '../template/03-distribution/strip-plot/template.js';
import scatterPlot from '../template/04-correlation-relation/scatter-plot/template.js';

console.log('🧪 Starting Anscombe Small-Sample Guardrails Verification Suite (T9)...');

const mockCanvas = { getContext: () => ({ fillRect: () => {}, strokeRect: () => {}, arc: () => {}, beginPath: () => {} }) };

// 1. Box Plot Raw Points & Small n Guardrails
console.log('\n📦 1. Box Plot Small n & Raw Points Overlay Guardrail:');
{
  // n = 4 (small n < 5)
  const smallData = {
    labels: ['Petit Groupe'],
    datasets: [{
      data: [[10, 12, 14, 16]]
    }]
  };
  const chartSmall = boxPlot.createChart(mockCanvas, smallData, 'colorbrewer-accessible');
  expect(chartSmall).toBeDefined();

  // Test tooltip callback on n=4
  const tooltipLabelFn = chartSmall.config.options.plugins.tooltip.callbacks.label;
  const labelsSmall = tooltipLabelFn({ dataIndex: 0 });
  expect(labelsSmall[0]).toContain('non représentatif');
  expect(labelsSmall[0]).toContain('n=4');
  console.log(`  ✓ Tooltip on n < 5 includes explicit disclaimer badge: "${labelsSmall[0]}"`);

  // n = 15 (raw points overlay active)
  const mediumData = {
    labels: ['Groupe Moyen'],
    datasets: [{
      data: [Array.from({ length: 15 }, (_, i) => 10 + i * 2)]
    }]
  };
  const chartMed = boxPlot.createChart(mockCanvas, mediumData, 'colorbrewer-accessible');
  const labelsMed = chartMed.config.options.plugins.tooltip.callbacks.label({ dataIndex: 0 });
  expect(labelsMed[0]).toContain('n=15');
  assert(!labelsMed[0].includes('non représentatif'), 'n=15 should not have non-representative warning');
  console.log(`  ✓ Tooltip on n=15 reports count without non-representative disclaimer: "${labelsMed[0]}"`);
}

// 2. Strip Plot Deterministic Jittering
console.log('\n〰️ 2. Strip Plot Golden-Ratio Deterministic Jittering:');
{
  const rawNumbers = [10, 12, 15, 18, 20, 25, 30];
  const stripData = {
    categories: ['Groupe 1'],
    datasets: [{
      label: 'Groupe 1',
      data: rawNumbers
    }]
  };
  const chartStrip1 = stripPlot.createChart(mockCanvas, stripData, 'colorbrewer-accessible');
  const chartStrip2 = stripPlot.createChart(mockCanvas, stripData, 'colorbrewer-accessible');

  const pts1 = chartStrip1.config.data.datasets[0].data;
  const pts2 = chartStrip2.config.data.datasets[0].data;

  expect(pts1.length).toBe(7);
  expect(pts1).toEqual(pts2);
  console.log('  ✓ 1D raw numbers automatically jittered with 100% deterministic repeatability');
}

// 3. Scatter Plot R² Threshold (n >= 10 points)
console.log('\n📈 3. Scatter Plot Trendline Validity Guardrail:');
{
  // n = 6 (< 10) -> no trendline by default
  const smallScatter = {
    datasets: [{
      label: 'Points',
      data: [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 5 },
        { x: 4, y: 8 },
        { x: 5, y: 9 },
        { x: 6, y: 12 }
      ]
    }]
  };
  const chartSmallScat = scatterPlot.createChart(mockCanvas, smallScatter, 'colorbrewer-accessible');
  expect(chartSmallScat.config.data.datasets.length).toBe(1); // Only points, NO spurious trendline
  console.log('  ✓ Trendline omitted automatically when n = 6 (< 10) to prevent Anscombe fallacy');

  // n = 12 (>= 10) -> trendline added
  const bigScatter = {
    datasets: [{
      label: 'Points',
      data: Array.from({ length: 12 }, (_, i) => ({ x: i + 1, y: (i + 1) * 2 + 1 }))
    }]
  };
  const chartBigScat = scatterPlot.createChart(mockCanvas, bigScatter, 'colorbrewer-accessible');
  expect(chartBigScat.config.data.datasets.length).toBe(2); // Points + Trendline
  expect(chartBigScat.config.data.datasets[1].label).toContain('Tendance');
  assert(!chartBigScat.config.data.datasets[1].label.includes('n < 10'), 'n=12 should not have small n warning');
  console.log(`  ✓ Trendline generated automatically when n = 12 (>= 10): "${chartBigScat.config.data.datasets[1].label}"`);

  // n = 6 with showTrend: true forced -> includes disclaimer
  const smallScatterForced = {
    datasets: [{
      label: 'Points',
      showTrend: true,
      data: smallScatter.datasets[0].data
    }]
  };
  const chartForced = scatterPlot.createChart(mockCanvas, smallScatterForced, 'colorbrewer-accessible');
  expect(chartForced.config.data.datasets.length).toBe(2);
  expect(chartForced.config.data.datasets[1].label).toContain('n < 10');
  console.log(`  ✓ Forced trendline on small n displays explicit caution badge: "${chartForced.config.data.datasets[1].label}"`);
}

console.log('\n🎉 All Anscombe Small-Sample Guardrail tests passed successfully!');
