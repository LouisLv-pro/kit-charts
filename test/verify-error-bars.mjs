/**
 * @file test/verify-error-bars.mjs
 * @description Verification suite for Error Bars & Confidence Intervals (T2).
 */

import { assert, expect } from './test-helpers.js';
import { mean, variance, stddev, sem, studentT, ci95, checkCIOverlap, errorBarsPlugin } from '../themes/stat-helpers.js';

console.log('🧪 Starting Error Bars & Confidence Intervals Verification Suite (T2)...');

// 1. Descriptive Statistics & SE
console.log('\n📊 1. Pure Descriptive Statistics:');
{
  const data = [2, 4, 4, 4, 5, 5, 7, 9]; // n = 8, sum = 40, mean = 5.0
  const m = mean(data);
  expect(m).toBe(5.0);

  const v = variance(data); // 32 / 7 ≈ 4.57142857
  expect(v).toBeCloseTo(4.5714, 3);

  const s = stddev(data); // sqrt(32/7) ≈ 2.1380899
  expect(s).toBeCloseTo(2.1381, 3);

  const se = sem(data); // s / sqrt(8) ≈ 0.7559289
  expect(se).toBeCloseTo(0.7559, 3);
  console.log('  ✓ Mean, variance, standard deviation and SE match exact values');
}

// 2. Student's t Distribution Critical Values
console.log('\n📐 2. Student t-Distribution Quantiles:');
{
  expect(studentT(0.975, 1)).toBeCloseTo(12.7062, 3);
  expect(studentT(0.975, 7)).toBeCloseTo(2.3646, 3);
  expect(studentT(0.975, 10)).toBeCloseTo(2.2281, 3);
  expect(studentT(0.975, 29)).toBeCloseTo(2.0452, 3);
  expect(studentT(0.975, 100)).toBeCloseTo(1.984, 1); // Large sample approximation
  expect(studentT(0.975, 500)).toBeCloseTo(1.96, 1);
  console.log('  ✓ Student t table and Cornish-Fisher expansion accurate');
}

// 3. 95% Confidence Interval Calculation
console.log('\n📈 3. CI95 Numerical Validation:');
{
  // Test dataset [2, 4, 4, 4, 5, 5, 7, 9] (n=8, df=7, t=2.3646)
  const data = [2, 4, 4, 4, 5, 5, 7, 9];
  const ci = ci95(data, 0.95);
  expect(ci.mean).toBe(5.0);
  expect(ci.n).toBe(8);
  expect(ci.low).toBeCloseTo(5.0 - 2.3646 * 0.7559, 2);
  expect(ci.high).toBeCloseTo(5.0 + 2.3646 * 0.7559, 2);
  console.log(`  ✓ CI95 on n=8: [${ci.low.toFixed(2)}, ${ci.high.toFixed(2)}] matches theoretical bounds`);

  // Anscombe I Y dataset: [8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68] (n=11)
  const anscombeY = [8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68];
  const ciAnscombe = ci95(anscombeY, 0.95);
  expect(ciAnscombe.mean).toBeCloseTo(7.5009, 3);
  expect(ciAnscombe.low).toBeCloseTo(6.14, 1);
  expect(ciAnscombe.high).toBeCloseTo(8.86, 1);
  console.log(`  ✓ Anscombe I Y mean=${ciAnscombe.mean.toFixed(4)}, CI95=[${ciAnscombe.low.toFixed(2)}, ${ciAnscombe.high.toFixed(2)}]`);
}

// 4. Cumming & Finch (2005) CI Overlap Rule & Valence Refusal
console.log('\n⚖️ 4. Cumming & Finch Overlap Rule:');
{
  // Strongly overlapping intervals (no significant difference at p < 0.05)
  const ciA = { low: 8.0, high: 14.0 }; // half-width = 3, center = 11
  const ciB = { low: 10.0, high: 16.0 }; // half-width = 3, center = 13
  const overlapCheck1 = checkCIOverlap(ciA, ciB);
  expect(overlapCheck1.isOverlapping).toBe(true);
  expect(overlapCheck1.isSignificant).toBe(false);
  expect(overlapCheck1.recommendedValence).toBe('neutral');
  console.log(`  ✓ Overlapping CIs (>29% MOE) strictly enforce neutral valence`);

  // Completely non-overlapping intervals (statistically significant difference)
  const ciC = { low: 2.0, high: 5.0 };
  const ciD = { low: 9.0, high: 12.0 };
  const overlapCheck2 = checkCIOverlap(ciC, ciD);
  expect(overlapCheck2.isOverlapping).toBe(false);
  expect(overlapCheck2.isSignificant).toBe(true);
  expect(overlapCheck2.recommendedValence).toBe('directional');
  console.log(`  ✓ Non-overlapping CIs permit directional valence encoding`);
}

// 5. Chart.js errorBarsPlugin Integration
console.log('\n🎨 5. Error Bars Plugin Execution:');
{
  expect(errorBarsPlugin).toBeDefined();
  expect(errorBarsPlugin.id).toBe('kitChartsErrorBars');
  expect(typeof errorBarsPlugin.afterDatasetsDraw).toBe('function');

  // Mock headless canvas drawing call
  let strokes = 0;
  const mockCtx = {
    save: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => { strokes++; },
    lineWidth: 1,
    strokeStyle: '#64748B'
  };

  const mockChart = {
    ctx: mockCtx,
    chartArea: { top: 10, bottom: 200, left: 10, right: 300 },
    scales: {
      x: { getPixelForValue: (v) => 50 + v * 10 },
      y: { getPixelForValue: (v) => 200 - v * 10 }
    },
    config: { options: { indexAxis: 'x' } },
    options: {
      plugins: {
        errorBars: { mode: 'ci95' }
      }
    },
    data: {
      datasets: [{
        label: 'Mesures',
        data: [10, 20],
        errorBarsData: [{ low: 8, high: 12 }, { low: 17, high: 23 }]
      }]
    },
    getDatasetMeta: () => ({
      hidden: false,
      data: [{ x: 100, y: 100 }, { x: 200, y: 50 }]
    })
  };

  errorBarsPlugin.afterDatasetsDraw(mockChart, {}, {});
  expect(strokes).toBeGreaterThan(0);
  console.log(`  ✓ errorBarsPlugin executed headless drawing with ${strokes} stroke passes`);
}

console.log('\n🎉 All Error Bars & Confidence Interval tests passed successfully!');
