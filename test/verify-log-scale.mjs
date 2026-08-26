/**
 * @file test/verify-log-scale.mjs
 * @description Verification suite for Weber-Fechner Logarithmic Scale System (T5).
 */

import { assert, expect } from './test-helpers.js';
import { suggestScale, getLogScaleOptions } from '../themes/theme-tokens.js';
import lineChart from '../template/05-evolution-temporelle/line-chart/template.js';
import scatterPlot from '../template/04-correlation-relation/scatter-plot/template.js';
import barChart from '../template/01-comparaison/bar-chart-vertical/template.js';

console.log('🧪 Starting Weber-Fechner Logarithmic Scale Verification Suite (T5)...');

// 1. suggestScale Weber-Fechner Evaluation
console.log('\n📊 1. suggestScale Quantitative Decades Evaluation:');
{
  // Ratio < 100 -> linear
  const linearData = [10, 25, 50, 85, 120]; // ratio = 12
  expect(suggestScale(linearData)).toBe('linear');
  console.log('  ✓ Data with ratio < 100 correctly suggests "linear" scale');

  // Ratio >= 100 -> log
  const logData = [1, 15, 120, 950, 8500]; // ratio = 8500
  expect(suggestScale(logData)).toBe('log');
  console.log('  ✓ Data with ratio >= 100 (>= 2 decades) correctly suggests "log" scale');

  // Non-positive values present -> linear
  const negativeData = [-5, 10, 100, 5000];
  expect(suggestScale(negativeData)).toBe('linear');
  console.log('  ✓ Datasets containing values <= 0 automatically reject "log" and return "linear"');

  // Object series ({x, y})
  const scatterData = [{ x: 1, y: 1 }, { x: 2, y: 10 }, { x: 3, y: 5000 }];
  expect(suggestScale(scatterData)).toBe('log');
  console.log('  ✓ Object coordinate points evaluated accurately');
}

// 2. getLogScaleOptions Configuration
console.log('\n⚙️ 2. getLogScaleOptions Generator:');
{
  const opts = getLogScaleOptions('colorbrewer-accessible');
  expect(opts.type).toBe('logarithmic');
  expect(typeof opts.ticks.callback).toBe('function');
  expect(opts.ticks.callback(100)).toBe('100');
  expect(opts.ticks.callback(1000)).toBe('1e+3');
  console.log('  ✓ Logarithmic scale options formatted with decade tick decimation');
}

// 3. Error Guardrails on Non-Positive Values
console.log('\n🚫 3. Non-Positive Value Guardrails:');
{
  const mockCanvas = { getContext: () => ({}) };

  // Line chart with negative values and log scale forced -> throws
  let lineError = null;
  try {
    lineChart.createChart(mockCanvas, {
      labels: ['A', 'B'],
      datasets: [{ data: [-10, 500] }]
    }, 'colorbrewer-accessible', { logScale: true });
  } catch (err) {
    lineError = err;
  }
  assert(lineError !== null, 'Line chart should throw error on non-positive value with log scale');
  expect(lineError.message).toContain('kit-charts: log scale requires strictly positive values');
  console.log('  ✓ Line chart strictly rejects log scale when values <= 0 are present');

  // Scatter plot with y <= 0 and log scale forced -> throws
  let scatterError = null;
  try {
    scatterPlot.createChart(mockCanvas, {
      datasets: [{ data: [{ x: 10, y: 0 }, { x: 20, y: 1000 }] }]
    }, 'colorbrewer-accessible', { logScaleY: true });
  } catch (err) {
    scatterError = err;
  }
  assert(scatterError !== null, 'Scatter plot should throw error on y<=0 with log scale');
  expect(scatterError.message).toContain('kit-charts: log scale requires strictly positive values');
  console.log('  ✓ Scatter plot strictly rejects log scale when coordinate <= 0');
}

// 4. Prohibition on Length-Encoded Bar Charts
console.log('\n🛑 4. Prohibition on Length-Encoded Bar Charts:');
{
  const mockCanvas = { getContext: () => ({}) };
  let barError = null;
  try {
    barChart.createChart(mockCanvas, {
      labels: ['A', 'B'],
      datasets: [{ data: [10, 1000] }]
    }, 'colorbrewer-accessible', { logScale: true });
  } catch (err) {
    barError = err;
  }
  assert(barError !== null, 'Bar chart should throw error when log scale requested');
  expect(barError.message).toContain('kit-charts: log scale is forbidden on length-encoded bar charts');
  console.log('  ✓ Bar chart strictly rejects log scale to prevent length-distortion perception fallacy');
}

console.log('\n🎉 All Weber-Fechner Logarithmic Scale tests passed successfully!');
