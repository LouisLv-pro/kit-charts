import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

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
console.log(`Analyzing ${templateFiles.length} template.js files...`);

for (const file of templateFiles) {
  let code = fs.readFileSync(file, 'utf8');
  let original = code;

  // Fix UMD header pattern: typeof exports === 'object" && typeof module !== \'undefined"
  code = code.replace(/typeof\s+exports\s*===\s*['"][^'"]*['"]\s*&&\s*typeof\s+module\s*!==\s*['"][^'"]*['"]/g, 
    "typeof exports === 'object' && typeof module !== 'undefined'");
  code = code.replace(/typeof\s+define\s*===\s*['"][^'"]*['"]\s*&&\s*define\.amd/g,
    "typeof define === 'function' && define.amd");

  // Fix specific corrupted patterns
  code = code.replace(/\\'undefined"/g, "'undefined'");
  code = code.replace(/'undefined"/g, "'undefined'");
  code = code.replace(/\\'object"/g, "'object'");
  code = code.replace(/'object"/g, "'object'");
  code = code.replace(/\\'string"/g, "'string'");
  code = code.replace(/'string"/g, "'string'");
  code = code.replace(/\\'function"/g, "'function'");
  code = code.replace(/'function"/g, "'function'");
  code = code.replace(/\\'linear"/g, "'linear'");
  code = code.replace(/'linear"/g, "'linear'");
  code = code.replace(/\\'category"/g, "'category'");
  code = code.replace(/'category"/g, "'category'");
  code = code.replace(/\\'time"/g, "'time'");
  code = code.replace(/'time"/g, "'time'");
  code = code.replace(/\\'top"/g, "'top'");
  code = code.replace(/'top"/g, "'top'");
  code = code.replace(/\\'bottom"/g, "'bottom'");
  code = code.replace(/'bottom"/g, "'bottom'");
  code = code.replace(/\\'left"/g, "'left'");
  code = code.replace(/'left"/g, "'left'");
  code = code.replace(/\\'right"/g, "'right'");
  code = code.replace(/'right"/g, "'right'");
  code = code.replace(/\\'index"/g, "'index'");
  code = code.replace(/'index"/g, "'index'");
  code = code.replace(/\\'dataset"/g, "'dataset'");
  code = code.replace(/'dataset"/g, "'dataset'");
  code = code.replace(/\\'point"/g, "'point'");
  code = code.replace(/'point"/g, "'point'");
  code = code.replace(/\\'nearest"/g, "'nearest'");
  code = code.replace(/'nearest"/g, "'nearest'");
  code = code.replace(/\\'x"/g, "'x'");
  code = code.replace(/'x"/g, "'x'");
  code = code.replace(/\\'y"/g, "'y'");
  code = code.replace(/'y"/g, "'y'");
  code = code.replace(/\\'xy"/g, "'xy'");
  code = code.replace(/'xy"/g, "'xy'");
  code = code.replace(/\\'bar"/g, "'bar'");
  code = code.replace(/'bar"/g, "'bar'");
  code = code.replace(/\\'line"/g, "'line'");
  code = code.replace(/'line"/g, "'line'");
  code = code.replace(/\\'scatter"/g, "'scatter'");
  code = code.replace(/'scatter"/g, "'scatter'");
  code = code.replace(/\\'fr-FR"/g, "'fr-FR'");
  code = code.replace(/'fr-FR"/g, "'fr-FR'");
  code = code.replace(/\\'compact"/g, "'compact'");
  code = code.replace(/'compact"/g, "'compact'");
  code = code.replace(/\\'2d"/g, "'2d'");
  code = code.replace(/'2d"/g, "'2d'");
  code = code.replace(/\\'number"/g, "'number'");
  code = code.replace(/'number"/g, "'number'");

  // Fix French months/labels patterns
  code = code.replace(/\\'Jan"/g, "'Jan'");
  code = code.replace(/'Jan"/g, "'Jan'");
  code = code.replace(/\\'Fév"/g, "'Fév'");
  code = code.replace(/'Fév"/g, "'Fév'");
  code = code.replace(/\\'Mar"/g, "'Mar'");
  code = code.replace(/'Mar"/g, "'Mar'");
  code = code.replace(/\\'Avr"/g, "'Avr'");
  code = code.replace(/'Avr"/g, "'Avr'");
  code = code.replace(/\\'Mai"/g, "'Mai'");
  code = code.replace(/'Mai"/g, "'Mai'");
  code = code.replace(/\\'Juin"/g, "'Juin'");
  code = code.replace(/'Juin"/g, "'Juin'");
  code = code.replace(/\\'Juil"/g, "'Juil'");
  code = code.replace(/'Juil"/g, "'Juil'");
  code = code.replace(/\\'Aoû"/g, "'Aoû'");
  code = code.replace(/'Aoû"/g, "'Aoû'");
  code = code.replace(/\\'Sep"/g, "'Sep'");
  code = code.replace(/'Sep"/g, "'Sep'");
  code = code.replace(/\\'Oct"/g, "'Oct'");
  code = code.replace(/'Oct"/g, "'Oct'");
  code = code.replace(/\\'Nov"/g, "'Nov'");
  code = code.replace(/'Nov"/g, "'Nov'");
  code = code.replace(/\\'Déc"/g, "'Déc'");
  code = code.replace(/'Déc"/g, "'Déc'");

  // Fix box-strip-plot labels
  code = code.replace(/'Contrôle",\s*\\'Traitement A",\s*'Traitement B",\s*\\'Placebo"]/g, 
    "['Contrôle', 'Traitement A', 'Traitement B', 'Placebo']");

  // Fix general escaped single quotes that don't need escaping if inside double quotes
  // Replace patterns like: 'something" or \'something"
  code = code.replace(/\\'([a-zA-Z0-9_-]+)"/g, "'$1'");
  code = code.replace(/'([a-zA-Z0-9_-]+)"/g, "'$1'");
  code = code.replace(/"([a-zA-Z0-9_-]+)'/g, "'$1'");

  if (code !== original) {
    fs.writeFileSync(file, code, 'utf8');
    console.log(`Cleaned: ${path.relative(ROOT, file)}`);
  }
}

console.log('\nRunning node --check on all 83 template.js files...');
let validCount = 0;
let failedCount = 0;

for (const file of templateFiles) {
  try {
    execSync(`node --check "${file}"`, { stdio: 'pipe' });
    validCount++;
  } catch (err) {
    console.error(`❌ Syntax Error in ${path.relative(ROOT, file)}:`);
    console.error(err.stderr ? err.stderr.toString() : err.message);
    failedCount++;
  }
}

console.log(`\nSummary: ${validCount} passed, ${failedCount} failed.`);
if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 100% of template.js files have valid syntax!');
}
