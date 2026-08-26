/**
 * @file test/verify-saliency-focus.mjs
 * @description Verification suite for Visual Saliency Model (Itti & Koch 2001; Tufte 90/10 Rule) (D5, T8).
 */

import { assert, expect } from './test-helpers.js';
import { getThemeTokens } from '../themes/theme-tokens.js';
import { computeMarkSaliency, computeSaliencyProfile } from './saliency-model.mjs';

console.log('🧪 Starting Visual Saliency Model & 90/10 Rule Verification Suite (D5, T8)...');

// 1. Mark Saliency Calculations on Bar Chart
console.log('\n📊 1. Bar Chart Saliency Profile (1 Hero Focal Bar vs 9 Context Bars):');
{
  const tokens = getThemeTokens('colorbrewer-accessible');
  const bg = tokens.bg || '#FFFFFF';
  const neutralGray = tokens.emphasis?.context || '#CBD5E1';
  const focalHex = tokens.emphasis?.focal || '#2B8CBE';

  const marks = [
    { hex: focalHex, alpha: 1.0, area: 1.0, role: 'focal', label: 'France (Hero)' },
    ...Array.from({ length: 9 }, (_, i) => ({
      hex: neutralGray,
      alpha: 0.40,
      area: 1.0,
      role: 'context',
      label: `Pays ${i + 2}`
    }))
  ];

  const profile = computeSaliencyProfile(marks, bg, neutralGray);
  console.log(`  • Rôle avec Saillance Maximale: "${profile.maxSaliencyRole}" (attendu: "focal")`);
  console.log(`  • Ratio de dominance focale: ${(profile.focalDominanceRatio * 100).toFixed(1)}% (>= 90%)`);

  expect(profile.maxSaliencyRole).toBe('focal');
  expect(profile.isDominant).toBe(true);
  assert(profile.focalDominanceRatio >= 0.90, 'Focal dominance ratio must be >= 0.90');
  console.log('  ✓ Hero focal bar dominates 100% of context bars in visual saliency');
}

// 2. Multi-Line Chart (1 Focal Curve vs 3 Context Curves)
console.log('\n📈 2. Multi-Line Chart Saliency Profile (1 Focal Curve vs 3 Context Curves):');
{
  const tokens = getThemeTokens('colorbrewer-accessible');
  const bg = tokens.bg || '#FFFFFF';
  const neutralGray = tokens.emphasis?.context || '#CBD5E1';
  const focalHex = tokens.emphasis?.focal || '#2B8CBE';

  const lineMarks = [
    { hex: focalHex, alpha: 1.0, area: 2.0, role: 'focal', label: 'CAC 40 (Hero)' },
    { hex: neutralGray, alpha: 0.35, area: 1.0, role: 'context', label: 'DAX' },
    { hex: neutralGray, alpha: 0.35, area: 1.0, role: 'context', label: 'FTSE' },
    { hex: neutralGray, alpha: 0.35, area: 1.0, role: 'context', label: 'IBEX' }
  ];

  const profile = computeSaliencyProfile(lineMarks, bg, neutralGray);
  console.log(`  • Rôle Saillant Max: "${profile.maxSaliencyRole}"`);
  console.log(`  • Dominance Focale: ${(profile.focalDominanceRatio * 100).toFixed(1)}% (>= 90%)`);

  expect(profile.maxSaliencyRole).toBe('focal');
  expect(profile.isDominant).toBe(true);
  console.log('  ✓ Hero curve achieves 100% saliency dominance over background context lines');
}

// 3. Mathematical Monotonicity of Saliency Components
console.log('\n🔬 3. Saliency Model Mathematical Monotonicity:');
{
  const bg = '#FFFFFF';
  const neutral = '#CBD5E1';

  // Increasing alpha -> increases S
  const sLowAlpha = computeMarkSaliency({ hex: '#2B8CBE', alpha: 0.3, area: 1.0 }, bg, neutral);
  const sHighAlpha = computeMarkSaliency({ hex: '#2B8CBE', alpha: 1.0, area: 1.0 }, bg, neutral);
  expect(sHighAlpha).toBeGreaterThan(sLowAlpha);

  // Increasing area -> increases S
  const sSmallArea = computeMarkSaliency({ hex: '#2B8CBE', alpha: 1.0, area: 1.0 }, bg, neutral);
  const sLargeArea = computeMarkSaliency({ hex: '#2B8CBE', alpha: 1.0, area: 2.0 }, bg, neutral);
  expect(sLargeArea).toBeGreaterThan(sSmallArea);

  console.log('  ✓ Saliency score increases monotonically with opacity and visual area');
}

console.log('\n🎉 All Saliency Model & 90/10 Focus tests passed successfully!');
