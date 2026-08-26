/**
 * @file themes/stat-helpers.js
 * @description Statistical & Psychophysical Computation Engine for kit-charts.
 * Universal Module (runs on file://, http://, and Node.js).
 * Includes pure descriptive statistics, Student t distribution, confidence intervals (Cumming & Finch),
 * and Chart.js error bars rendering plugin.
 * @version 1.0.0
 * @author kit-charts Team
 * @license MIT
 */

/**
 * Calculates arithmetic mean.
 * @param {number[]} data
 * @returns {number}
 */
function mean(data) {
  if (!Array.isArray(data) || data.length === 0) return 0;
  const clean = data.map(Number).filter(v => !isNaN(v));
  if (clean.length === 0) return 0;
  return clean.reduce((sum, v) => sum + v, 0) / clean.length;
}

/**
 * Calculates sample variance (divisor n-1).
 * @param {number[]} data
 * @returns {number}
 */
function variance(data) {
  if (!Array.isArray(data) || data.length < 2) return 0;
  const clean = data.map(Number).filter(v => !isNaN(v));
  if (clean.length < 2) return 0;
  const m = mean(clean);
  return clean.reduce((sum, v) => sum + Math.pow(v - m, 2), 0) / (clean.length - 1);
}

/**
 * Calculates sample standard deviation.
 * @param {number[]} data
 * @returns {number}
 */
function stddev(data) {
  return Math.sqrt(variance(data));
}

/**
 * Calculates Standard Error of the Mean (SE = s / sqrt(n)).
 * @param {number[]} data
 * @returns {number}
 */
function sem(data) {
  if (!Array.isArray(data) || data.length === 0) return 0;
  const clean = data.map(Number).filter(v => !isNaN(v));
  if (clean.length < 2) return 0;
  return stddev(clean) / Math.sqrt(clean.length);
}

/**
 * Quantile calculation with continuous linear interpolation.
 * position h = (n-1)*p
 * @param {number[]} data
 * @param {number} p - probability [0, 1]
 * @returns {number}
 */
function quantile(data, p) {
  if (!Array.isArray(data) || data.length === 0) return 0;
  const clean = data.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b);
  if (clean.length === 0) return 0;
  if (p <= 0) return clean[0];
  if (p >= 1) return clean[clean.length - 1];

  const h = (clean.length - 1) * p;
  const floor = Math.floor(h);
  const ceil = Math.ceil(h);
  if (floor === ceil) return clean[floor];
  return clean[floor] + (h - floor) * (clean[ceil] - clean[floor]);
}

/**
 * Critical Student t-distribution value for two-tailed confidence interval.
 * Exact table for df 1 to 30 at 95% (p=0.975), Cornish-Fisher expansion for df > 30.
 */
const STUDENT_T_95 = [
  0, // 0
  12.7062, 4.3027, 3.1824, 2.7764, 2.5706, // 1-5
  2.4469, 2.3646, 2.3060, 2.2622, 2.2281, // 6-10
  2.2010, 2.1788, 2.1604, 2.1448, 2.1314, // 11-15
  2.1199, 2.1098, 2.1009, 2.0930, 2.0860, // 16-20
  2.0796, 2.0739, 2.0687, 2.0639, 2.0595, // 21-25
  2.0555, 2.0518, 2.0484, 2.0452, 2.0423  // 26-30
];

/**
 * Returns two-tailed t-critical value for given probability and degrees of freedom.
 * @param {number} p - Upper quantile e.g. 0.975 for 95% CI
 * @param {number} df - Degrees of freedom (n - 1)
 * @returns {number}
 */
function studentT(p = 0.975, df = 10) {
  if (df < 1) return 1.96;
  if (Math.abs(p - 0.975) < 0.005) {
    if (df <= 30) return STUDENT_T_95[Math.round(df)];
    const z = 1.95996;
    return z + (Math.pow(z, 3) + z) / (4 * df) + (5 * Math.pow(z, 5) + 16 * Math.pow(z, 3) + 3 * z) / (96 * Math.pow(df, 2));
  }
  return 1.96;
}

/**
 * Computes 95% confidence interval for a raw dataset or summary stats.
 * @param {number[]|Object} input - Array of numbers or { mean, sd, n }
 * @param {number} [confidence=0.95] - Confidence level (default 0.95)
 * @returns {{ mean: number, low: number, high: number, se: number, sd: number, n: number, margin: number, confidence: number }}
 */
function ci95(input, confidence = 0.95) {
  let m = 0, s = 0, n = 0;
  if (Array.isArray(input)) {
    const clean = input.map(Number).filter(v => !isNaN(v));
    n = clean.length;
    if (n === 0) return { mean: 0, low: 0, high: 0, se: 0, sd: 0, n: 0, margin: 0, confidence };
    m = mean(clean);
    s = n >= 2 ? stddev(clean) : 0;
  } else if (typeof input === 'object' && input !== null) {
    m = Number(input.mean || input.value || 0);
    s = Number(input.sd || input.stddev || 0);
    n = Number(input.n || input.count || 30);
  }

  const se = n >= 2 ? s / Math.sqrt(n) : 0;
  const tcrit = n >= 30 ? 1.96 : studentT((1 + confidence) / 2, Math.max(1, n - 1));
  const margin = tcrit * se;

  return {
    mean: m,
    low: m - margin,
    high: m + margin,
    se,
    sd: s,
    n,
    margin,
    confidence
  };
}

/**
 * Evaluates CI overlap between two series according to Cumming & Finch (2005).
 * If 95% CIs overlap by more than ~29% of average half-width, difference is NOT significant at p < 0.05.
 *
 * @param {{ low: number, high: number }} ci1
 * @param {{ low: number, high: number }} ci2
 * @returns {{ overlap: number, overlapRatio: number, isSignificant: boolean, isOverlapping: boolean, recommendedValence: 'directional'|'neutral' }}
 */
function checkCIOverlap(ci1, ci2) {
  if (!ci1 || !ci2) {
    return { overlap: 0, overlapRatio: 0, isSignificant: true, isOverlapping: false, recommendedValence: 'directional' };
  }
  const moe1 = Math.abs(ci1.high - ci1.low) / 2;
  const moe2 = Math.abs(ci2.high - ci2.low) / 2;
  const avgMOE = (moe1 + moe2) / 2;

  const overlap = Math.max(0, Math.min(ci1.high, ci2.high) - Math.max(ci1.low, ci2.low));
  const overlapRatio = avgMOE > 0 ? overlap / avgMOE : 0;
  const isOverlapping = overlapRatio >= 0.29;
  const isSignificant = !isOverlapping;

  return {
    overlap: Math.round(overlap * 10000) / 10000,
    overlapRatio: Math.round(overlapRatio * 10000) / 10000,
    isSignificant,
    isOverlapping,
    recommendedValence: isOverlapping ? 'neutral' : 'directional'
  };
}

/**
 * Universal Chart.js Custom Plugin for Error Bars & Confidence Intervals.
 * Draws 1px error bars with 6px horizontal caps and enforces tabular tooltip formatting.
 */
const errorBarsPlugin = {
  id: 'kitChartsErrorBars',
  afterDatasetsDraw(chart, args, options) {
    const { ctx, chartArea, scales } = chart;
    if (!scales || !scales.x || !scales.y) return;

    const opts = Object.assign({}, chart.options?.plugins?.errorBars || options || {});
    const defaultColor = opts.color || '#64748B';
    const capWidth = typeof opts.capWidth === 'number' ? opts.capWidth : 6;
    const halfCap = capWidth / 2;

    ctx.save();
    ctx.lineWidth = 1;

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (!meta || meta.hidden) return;

      const dsErrorBars = dataset.errorBars || opts;
      if (!dsErrorBars || (!dsErrorBars.mode && !dsErrorBars.explicit && !dataset.errorBarsData)) {
        return;
      }

      const rawBars = dataset.errorBarsData || dsErrorBars.explicit || [];

      (meta.data || []).forEach((elem, index) => {
        if (!elem) return;
        const val = dataset.data[index];
        if (val === null || val === undefined) return;

        let lowVal, highVal;
        if (rawBars[index]) {
          lowVal = rawBars[index].low !== undefined ? rawBars[index].low : val - (rawBars[index].margin || 0);
          highVal = rawBars[index].high !== undefined ? rawBars[index].high : val + (rawBars[index].margin || 0);
        } else if (typeof dsErrorBars.calculate === 'function') {
          const res = dsErrorBars.calculate(val, index, dataset);
          lowVal = res.low;
          highVal = res.high;
        } else if (Array.isArray(val)) {
          const ci = ci95(val, dsErrorBars.confidence || 0.95);
          lowVal = ci.low;
          highVal = ci.high;
        } else {
          return;
        }

        if (isNaN(lowVal) || isNaN(highVal)) return;

        const isHorizontal = chart.config?.options?.indexAxis === 'y';
        ctx.strokeStyle = dataset.errorBarColor || dsErrorBars.color || defaultColor;

        if (isHorizontal) {
          const y = elem.y;
          const xLow = scales.x.getPixelForValue(lowVal);
          const xHigh = scales.x.getPixelForValue(highVal);

          ctx.beginPath();
          ctx.moveTo(xLow, y);
          ctx.lineTo(xHigh, y);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(xLow, y - halfCap);
          ctx.lineTo(xLow, y + halfCap);
          ctx.moveTo(xHigh, y - halfCap);
          ctx.lineTo(xHigh, y + halfCap);
          ctx.stroke();
        } else {
          const x = elem.x;
          const yLow = scales.y.getPixelForValue(lowVal);
          const yHigh = scales.y.getPixelForValue(highVal);

          ctx.beginPath();
          ctx.moveTo(x, yLow);
          ctx.lineTo(x, yHigh);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x - halfCap, yLow);
          ctx.lineTo(x + halfCap, yLow);
          ctx.moveTo(x - halfCap, yHigh);
          ctx.lineTo(x + halfCap, yHigh);
          ctx.stroke();
        }
      });
    });

    ctx.restore();
  }
};

// Auto registration if Chart.js is present
if (typeof Chart !== 'undefined' && Chart.register) {
  try {
    Chart.register(errorBarsPlugin);
  } catch (e) {}
}

const StatHelpers = {
  mean,
  variance,
  stddev,
  sd: stddev,
  sem,
  se: sem,
  quantile,
  studentT,
  ci95,
  checkCIOverlap,
  errorBarsPlugin
};

// Browser Global
if (typeof window !== 'undefined') {
  window.KitCharts = window.KitCharts || {};
  window.KitCharts.StatHelpers = StatHelpers;
  window.KitChartsStatHelpers = StatHelpers;
  window.StatHelpers = StatHelpers;
}

// CommonJS Exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StatHelpers;
  module.exports.default = StatHelpers;
  module.exports.mean = mean;
  module.exports.variance = variance;
  module.exports.stddev = stddev;
  module.exports.sd = stddev;
  module.exports.sem = sem;
  module.exports.se = sem;
  module.exports.quantile = quantile;
  module.exports.studentT = studentT;
  module.exports.ci95 = ci95;
  module.exports.checkCIOverlap = checkCIOverlap;
  module.exports.errorBarsPlugin = errorBarsPlugin;
}
