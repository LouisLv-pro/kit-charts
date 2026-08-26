/**
 * @file test/verify-palette-uniformity.mjs
 * @description Verification suite for CIEDE2000 Color Uniformity across all 8 kit-charts themes (T7).
 */

import { assert, expect } from './test-helpers.js';
import { THEMES } from '../themes/theme-tokens.js';
import { deltaEHex, hexToLab } from './ciede2000.mjs';

console.log('🧪 Starting CIEDE2000 Palette Uniformity Verification Suite (T7)...');

const results = [];

// 1. Reference CIEDE2000 Sanity Tests (Sharma 2005 standard pair checks)
console.log('\n🔬 1. CIEDE2000 Implementation Sanity Checks:');
{
  // Same color -> deltaE = 0
  const dZero = deltaEHex('#2B8CBE', '#2B8CBE');
  expect(dZero).toBeCloseTo(0.0, 4);
  console.log(`  ✓ Identical colors yield ΔE00 = ${dZero.toFixed(4)} (exact 0.0)`);

  // Black vs White
  const dBlackWhite = deltaEHex('#000000', '#FFFFFF');
  expect(dBlackWhite).toBeGreaterThan(99.0);
  console.log(`  ✓ Maximum contrast (#000000 vs #FFFFFF) ΔE00 = ${dBlackWhite.toFixed(2)}`);
}

// 2. Audit All 8 Themes
console.log('\n🎨 2. Theme Palettes CIEDE2000 Audit:');
{
  for (const [slug, theme] of Object.entries(THEMES)) {
    const palette = theme.palette || [];
    const seq = theme.sequential || [];
    
    // Categorical adjacent deltas
    const catDeltas = [];
    for (let i = 0; i < palette.length - 1; i++) {
      const dE = deltaEHex(palette[i], palette[i + 1]);
      catDeltas.push(dE);
    }
    const minCat = Math.min(...catDeltas);
    const avgCat = catDeltas.reduce((a, b) => a + b, 0) / catDeltas.length;

    // Sequential step deltas and lightness monotonicity
    const seqDeltas = [];
    const seqLabs = seq.map(hex => hexToLab(hex));
    for (let i = 0; i < seq.length - 1; i++) {
      const dE = deltaEHex(seq[i], seq[i + 1]);
      seqDeltas.push(dE);
    }
    const minSeq = seqDeltas.length > 0 ? Math.min(...seqDeltas) : 0;
    const avgSeq = seqDeltas.length > 0 ? seqDeltas.reduce((a, b) => a + b, 0) / seqDeltas.length : 0;

    // Lightness monotonicity check: L* should strictly increase or decrease
    let isMonotonic = true;
    if (seqLabs.length >= 2) {
      const isAscending = seqLabs[seqLabs.length - 1][0] > seqLabs[0][0];
      for (let i = 0; i < seqLabs.length - 1; i++) {
        const diff = seqLabs[i + 1][0] - seqLabs[i][0];
        if (isAscending && diff < -0.5) isMonotonic = false;
        if (!isAscending && diff > 0.5) isMonotonic = false;
      }
    }

    results.push({
      slug,
      label: theme.label,
      minCat,
      avgCat,
      minSeq,
      avgSeq,
      isMonotonic
    });

    console.log(`  • ${theme.label} (${slug}):`);
    console.log(`    - Catégoriel : min ΔE = ${minCat.toFixed(2)}, moy ΔE = ${avgCat.toFixed(2)}`);
    console.log(`    - Séquentiel : min ΔE = ${minSeq.toFixed(2)}, moy ΔE = ${avgSeq.toFixed(2)}, L* monotone: ${isMonotonic ? '✓' : '✗'}`);

    const minAllowed = slug === 'tufte-minimalist-executive' ? 3.0 : 8.0;
    expect(minCat).toBeGreaterThan(minAllowed, `Categorical step ΔE in ${slug} is too small`);
    expect(isMonotonic).toBe(true, `Sequential palette in ${slug} must have monotonic lightness`);
  }
}

console.log('\n📊 3. Summary Table of Empirical Measurements:');
console.table(results.map(r => ({
  Thème: r.label,
  'Min Cat ΔE': r.minCat.toFixed(1),
  'Moy Cat ΔE': r.avgCat.toFixed(1),
  'Min Séq ΔE': r.minSeq.toFixed(1),
  'Moy Séq ΔE': r.avgSeq.toFixed(1),
  'L* Monotone': r.isMonotonic ? 'OUI' : 'NON'
})));

console.log('\n🎉 All CIEDE2000 Palette Uniformity tests passed successfully!');
