/**
 * @file test/verify-violin.mjs
 * @description Verification suite for Violin Plot + KDE (Scott's Rule) (T4).
 */

import { assert, expect } from './test-helpers.js';
import violinTemplate from '../template/03-distribution/violin-plot/template.js';

console.log('🧪 Starting Violin Plot & Gaussian KDE Verification Suite (T4)...');

const { computeGaussianKDE, computeScottBandwidth, createChart, DEFAULT_DATA } = violinTemplate;

// 1. Scott's Bandwidth Determinism & Accuracy
console.log("\n📐 1. Scott's Rule Bandwidth Validation:");
{
  const testSample = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28]; // n=10, mean=19
  // sigma = sqrt(330/9) = sqrt(36.6667) ≈ 6.0553
  // h = 1.06 * 6.0553 * 10^(-0.2) = 1.06 * 6.0553 * 0.630957 ≈ 4.05
  const h = computeScottBandwidth(testSample);
  expect(h).toBeCloseTo(4.05, 1);
  console.log(`  ✓ Scott bandwidth h=${h.toFixed(4)} matches analytical expectation`);

  // Degenerate case: constant series sigma = 0 -> fallback h = 1
  const constSample = [5, 5, 5, 5, 5];
  const hConst = computeScottBandwidth(constSample);
  expect(hConst).toBe(1.0);
  console.log('  ✓ Constant series (sigma=0) falls back gracefully to h=1.0');
}

// 2. Gaussian KDE Bimodal Detection
console.log('\n📈 2. Gaussian KDE Bimodal Mode Detection:');
{
  // Bimodal dataset centered around -2 and +2
  const bimodal = [
    -2.8, -2.5, -2.2, -2.0, -2.0, -1.9, -1.8, -1.5, -1.2,
    1.2, 1.5, 1.8, 1.9, 2.0, 2.0, 2.2, 2.5, 2.8
  ];
  const kde = computeGaussianKDE(bimodal, 0.5, 128);
  expect(kde.grid.length).toBe(128);
  expect(kde.density.length).toBe(128);

  // Find local maxima in density
  const peaks = [];
  for (let i = 1; i < kde.density.length - 1; i++) {
    if (kde.density[i] > kde.density[i - 1] && kde.density[i] > kde.density[i + 1]) {
      peaks.push({ x: kde.grid[i], density: kde.density[i] });
    }
  }

  expect(peaks.length).toBe(2);
  expect(peaks[0].x).toBeCloseTo(-2.0, 0.5);
  expect(peaks[1].x).toBeCloseTo(2.0, 0.5);
  console.log(`  ✓ Successfully detected 2 distinct modes: mode 1 at x=${peaks[0].x.toFixed(2)}, mode 2 at x=${peaks[1].x.toFixed(2)}`);
}

// 3. Numerical Integration (Area under KDE curve ≈ 1.0)
console.log('\n∫ 3. Numerical Integration of Probability Density:');
{
  const sample = [1, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10];
  const kde = computeGaussianKDE(sample, null, 128);
  
  // Trapezoidal numerical integration
  let integral = 0;
  for (let i = 0; i < kde.grid.length - 1; i++) {
    const dx = kde.grid[i + 1] - kde.grid[i];
    const avgY = (kde.density[i] + kde.density[i + 1]) / 2;
    integral += avgY * dx;
  }

  assert(Math.abs(integral - 1.0) < 0.05, `KDE integral ${integral} must be 1.0 within +/- 0.05`);
  expect(integral).toBeCloseTo(1.0, 1);
  console.log(`  ✓ Numerical integral of density = ${integral.toFixed(4)} ≈ 1.0 (valid probability distribution within ±0.05)`);
}

// 4. Headless Instantiation & Options
console.log('\n🖼️ 4. Headless Instantiation & Custom Options:');
{
  const mockCanvas = { getContext: () => ({}) };
  const chartMock = createChart(mockCanvas, DEFAULT_DATA, 'colorbrewer-accessible', { showInnerBox: true, showRawPoints: true });
  expect(chartMock).toBeDefined();
  expect(chartMock.config.type).toBe('bar');
  expect(chartMock.groupAnalysis.length).toBe(3);
  console.log('  ✓ Headless violin plot initialized with 3 categories and KDE analysis');
}

console.log('\n🎉 All Violin Plot & Gaussian KDE tests passed successfully!');
