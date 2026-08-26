import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

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
console.log(`Testing import on ${templateFiles.length} template.js files...`);

let successCount = 0;
let errors = [];

for (const file of templateFiles) {
  try {
    const fileUrl = pathToFileURL(file).href + `?t=${Date.now()}`;
    const mod = await import(fileUrl);
    const exp = mod.default || mod;
    if (!exp || (typeof exp !== 'object' && typeof exp !== 'function')) {
      throw new Error('Module did not export valid object');
    }
    successCount++;
  } catch (err) {
    errors.push({ file: path.relative(ROOT, file), absPath: file, error: err });
  }
}

console.log(`\n======================================================`);
console.log(`RESULTS: ${successCount}/${templateFiles.length} templates imported successfully.`);
console.log(`======================================================`);

if (errors.length > 0) {
  console.error(`\n❌ Failed templates (${errors.length}):`);
  for (const e of errors) {
    console.error(`\n- ${e.file}: ${e.error.message}`);
    // Read and show surrounding context if possible
    try {
      const match = e.error.stack && e.error.stack.match(/template\.js:(\d+)/);
      if (match) {
        const lineNum = parseInt(match[1], 10);
        const lines = fs.readFileSync(e.absPath, 'utf8').split('\n');
        const start = Math.max(0, lineNum - 3);
        const end = Math.min(lines.length, lineNum + 3);
        console.error(`  Lines ${start+1}-${end}:`);
        for (let i = start; i < end; i++) {
          console.error(`    ${i+1}: ${lines[i]}`);
        }
      }
    } catch {}
  }
  process.exit(1);
} else {
  console.log(`\n🎉 All ${templateFiles.length} templates imported cleanly with 0 errors!`);
}
