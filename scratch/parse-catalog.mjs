import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');

// Extract CATALOG array text
const match = html.match(/const CATALOG = (\[[\s\S]*?\n    \];)/);
if (!match) {
  console.log('CATALOG not found');
  process.exit(1);
}

// Evaluate CATALOG
const catalogCode = match[1];
const catalog = eval(catalogCode);
console.log(`Total items in CATALOG: ${catalog.length}`);

const byCat = {};
catalog.forEach(item => {
  byCat[item.category] = (byCat[item.category] || 0) + 1;
});
console.log('Items by category:');
console.log(byCat);
