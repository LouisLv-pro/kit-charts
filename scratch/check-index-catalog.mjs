import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

const ALL_14 = [
  'histogramme-kde', 'box-strip-plot', 'raincloud-plot', 'candlestick-volume',
  'pareto-chart', 'scatter-regression', 'bar-target-overlay', 'dual-axis-controlled',
  'violin-plot', 'joint-scatter-marginals', 'stacked-total-line', 'gantt-progress',
  'waterfall-cumulative-line', 'price-indicator-overlays'
];

for (const id of ALL_14) {
  const match = html.includes(`id: '${id}'`);
  console.log(`${id}: ${match ? 'FOUND' : 'MISSING'}`);
}
