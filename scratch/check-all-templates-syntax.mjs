import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';

const require = createRequire(import.meta.url);
const ROOT = '/Users/louislaville/Desktop/kit-charts';

function findFiles(dir, name) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      results = results.concat(findFiles(fullPath, name));
    } else if (entry.isFile() && entry.name === name) {
      results.push(fullPath);
    }
  }
  return results;
}

const templateFiles = findFiles(path.join(ROOT, 'template'), 'template.js');
console.log(`Checking ${templateFiles.length} template.js files with require/import...`);

let errors = 0;
for (const file of templateFiles) {
  try {
    const mod = require(file);
    if (typeof mod !== 'object' && typeof mod !== 'function') {
      throw new Error('Module did not export an object or function');
    }
    console.log(`✓ ${path.relative(ROOT, file)}`);
  } catch (err) {
    console.error(`✗ ERROR in ${path.relative(ROOT, file)}:`, err.message);
    errors++;
  }
}

if (errors > 0) {
  console.error(`\nFound ${errors} module load errors!`);
  process.exit(1);
} else {
  console.log(`\nAll ${templateFiles.length} template.js files load cleanly via require/import!`);
  process.exit(0);
}
