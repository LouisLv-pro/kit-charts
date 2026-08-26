/**
 * @file test/saliency-model.mjs
 * @description Standard Visual Saliency Model (Itti & Koch 2001; Tufte 90/10 Rule).
 * Calculates multi-channel visual saliency: Luminance, Chroma (ΔE00), Background Contrast, and Size.
 */

import { hexToLab, deltaEHex } from './ciede2000.mjs';

/**
 * Computes individual mark visual saliency score.
 * S = 0.4 * C_lum + 0.3 * C_chroma + 0.2 * C_bg + 0.1 * C_size
 *
 * @param {Object} mark - { hex, alpha, area, role }
 * @param {string} [bgHex='#FFFFFF'] - Background color hex
 * @param {string} [neutralHex='#CBD5E1'] - Neutral reference gray hex
 * @returns {number} Saliency score S in [0, 1]
 */
export function computeMarkSaliency(mark, bgHex = '#FFFFFF', neutralHex = '#CBD5E1') {
  const alpha = typeof mark.alpha === 'number' ? mark.alpha : 1.0;
  const area = typeof mark.area === 'number' ? mark.area : 1.0;
  const hex = mark.hex || '#000000';

  const [L] = hexToLab(hex);
  const [L_bg] = hexToLab(bgHex);

  const cLum = (Math.abs(L - L_bg) / 100) * alpha;
  const cChroma = (deltaEHex(hex, neutralHex) / 100) * alpha;
  const cBg = (deltaEHex(hex, bgHex) / 100) * alpha;
  const cSize = Math.min(1.0, area / 2.0);

  const S = 0.4 * cLum + 0.3 * cChroma + 0.2 * cBg + 0.1 * cSize;
  return S;
}

/**
 * Computes complete saliency profile for a set of marks and verifies 90/10 focus dominance.
 *
 * @param {Array<Object>} marks - Array of { hex, alpha, area, role, label }
 * @param {string} [bgHex='#FFFFFF']
 * @param {string} [neutralHex='#CBD5E1']
 * @returns {{ scores: number[], maxSaliencyRole: string, focalDominanceRatio: number, isDominant: boolean }}
 */
export function computeSaliencyProfile(marks, bgHex = '#FFFFFF', neutralHex = '#CBD5E1') {
  if (!Array.isArray(marks) || marks.length === 0) {
    return { scores: [], maxSaliencyRole: 'none', focalDominanceRatio: 0, isDominant: false };
  }

  const scores = marks.map(m => computeMarkSaliency(m, bgHex, neutralHex));
  const maxScore = Math.max(...scores);
  const maxIdx = scores.indexOf(maxScore);
  const maxRole = marks[maxIdx]?.role || 'context';

  const focalScores = [];
  const contextScores = [];

  marks.forEach((m, i) => {
    if (m.role === 'focal' || m.emphasis === 'focal') {
      focalScores.push(scores[i]);
    } else {
      contextScores.push(scores[i]);
    }
  });

  const avgFocal = focalScores.length > 0 ? focalScores.reduce((a, b) => a + b, 0) / focalScores.length : 0;
  let superiorComparisons = 0;
  let totalComparisons = 0;

  for (const f of focalScores) {
    for (const c of contextScores) {
      totalComparisons++;
      if (f > c) superiorComparisons++;
    }
  }

  const focalDominanceRatio = totalComparisons > 0 ? superiorComparisons / totalComparisons : (maxRole === 'focal' ? 1.0 : 0);
  const isDominant = focalDominanceRatio >= 0.90;

  return {
    scores,
    maxSaliencyRole: maxRole,
    focalDominanceRatio: Math.round(focalDominanceRatio * 1000) / 1000,
    isDominant
  };
}
