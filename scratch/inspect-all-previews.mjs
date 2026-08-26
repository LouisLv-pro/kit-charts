import fs from 'fs';
import path from 'path';

const ROOT = '/Users/louislaville/Desktop/kit-charts';

function walk(dir) {
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git') files = files.concat(walk(full));
    } else if (f.endsWith('preview.html')) {
      files.push(full);
    }
  }
  return files;
}

const files = walk(path.join(ROOT, 'template'));
console.log(`Analyzing ${files.length} preview files...`);

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  const breadcrumbMatch = content.match(/<div class="breadcrumb">([\s\S]*?)<\/div>/i);
  const titleGroupMatch = content.match(/<div class="title-group">([\s\S]*?)<\/div>/i);
  const chartContainerMatch = content.match(/<div id="chartContainer"[\s\S]*?>([\s\S]*?)<\/div>\s*<!--\s*Synthèse/i) 
    || content.match(/<div id="chartContainer"[\s\S]*?>([\s\S]*?)<\/div>\s*<div id="cognitiveRulesCard"/i)
    || content.match(/<div id="chartContainer"[\s\S]*?>([\s\S]*?)<\/div>/i);
  const rulesCardMatch = content.match(/<div id="cognitiveRulesCard"[\s\S]*?>([\s\S]*?)<\/div>/i);
  const scriptMatch = content.match(/<script[\s\S]*?>([\s\S]*?)<\/script>\s*<\/body>/i);

  if (!titleMatch || !breadcrumbMatch || !titleGroupMatch || !rulesCardMatch || !scriptMatch) {
    console.log(`Missing parts in ${file}:`, {
      title: !!titleMatch,
      breadcrumb: !!breadcrumbMatch,
      titleGroup: !!titleGroupMatch,
      rulesCard: !!rulesCardMatch,
      script: !!scriptMatch
    });
  }
}
console.log('Inspection complete.');
