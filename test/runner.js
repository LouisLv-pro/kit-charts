#!/usr/bin/env node

/**
 * @file test/runner.js
 * @description Automated Headless CLI Test Runner for kit-charts E2E Verification.
 * Spawns a lightweight local HTTP static server and executes all 541 tests via
 * in-process ESM runner or headless Chrome with CDP.
 * Exits with code 0 on pass or code 1 on failure.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 8488;

// MIME Type Registry for Static Server
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

/**
 * Starts static HTTP server for browser test execution.
 * @returns {Promise<http.Server>}
 */
function startStaticServer(port) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const parsedUrl = new URL(req.url, `http://localhost:${port}`);
      let reqPath = decodeURIComponent(parsedUrl.pathname);

      if (reqPath === '/' || reqPath === '') {
        reqPath = '/test/runner.html';
      }

      const filePath = path.join(PROJECT_ROOT, reqPath.replace(/^\//, ''));
      const ext = path.extname(filePath).toLowerCase();

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(`404 Not Found: ${reqPath}`);
          return;
        }

        const mime = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, {
          'Content-Type': mime,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache'
        });
        res.end(data);
      });
    });

    server.listen(port, '127.0.0.1', () => {
      resolve(server);
    });

    server.on('error', reject);
  });
}

/**
 * Formats results into terminal report table.
 * @param {Object} results
 */
function printTerminalReport(results) {
  const c = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m'
  };

  console.log(`\n${c.bold}${c.cyan}======================================================================${c.reset}`);
  console.log(`${c.bold}${c.cyan}           kit-charts E2E Verification Suite (Tiers 1–4)             ${c.reset}`);
  console.log(`${c.bold}${c.cyan}======================================================================${c.reset}\n`);

  console.log(`${c.bold}TIER SUMMARY BREAKDOWN:${c.reset}`);
  console.log(`${c.gray}----------------------------------------------------------------------${c.reset}`);

  const tierLabels = {
    tier1: 'Tier 1: Feature Coverage & Lifecycle (235 tests)',
    tier2: 'Tier 2: Boundary & Corner Cases (235 tests)',
    tier3: 'Tier 3: Pairwise Interactions (47 tests)',
    tier4: 'Tier 4: Real-World Scenarios (24 tests)'
  };

  for (const [tierKey, stats] of Object.entries(results.tierStats || {})) {
    const label = tierLabels[tierKey] || tierKey;
    const passColor = stats.failed === 0 ? c.green : c.red;
    const statusSymbol = stats.failed === 0 ? '✓ PASS' : '✗ FAIL';
    console.log(
      `  ${label.padEnd(50)} ${passColor}${statusSymbol}${c.reset}  (${stats.passed}/${stats.total})`
    );
  }

  console.log(`${c.gray}----------------------------------------------------------------------${c.reset}\n`);

  // Overall Statistics
  const passRate = results.total > 0 ? ((results.passed / results.total) * 100).toFixed(1) : '0.0';
  const overallColor = results.failed === 0 ? c.green : c.red;

  console.log(`${c.bold}OVERALL SUITE METRICS:${c.reset}`);
  console.log(`  Total Tests Executed : ${c.bold}${results.total}${c.reset}`);
  console.log(`  Passed               : ${c.green}${c.bold}${results.passed}${c.reset}`);
  console.log(`  Failed               : ${results.failed > 0 ? c.red : c.gray}${c.bold}${results.failed}${c.reset}`);
  console.log(`  Skipped              : ${c.yellow}${results.skipped}${c.reset}`);
  console.log(`  Pass Rate            : ${overallColor}${c.bold}${passRate}%${c.reset}`);
  console.log(`  Total Suite Duration : ${c.cyan}${results.duration}s${c.reset}\n`);

  // Print failures if any
  if (results.failed > 0) {
    console.log(`${c.bold}${c.red}FAILURES REPORT (${results.failed}):${c.reset}`);
    const failedTests = results.list.filter(t => !t.passed);
    failedTests.slice(0, 15).forEach((t, i) => {
      console.log(`\n  ${i + 1}) [${t.id}] ${t.name}`);
      console.log(`     ${c.red}Error: ${t.error}${c.reset}`);
      if (t.stack) {
        console.log(`     ${c.gray}${t.stack.split('\n').slice(1, 4).join('\n     ')}${c.reset}`);
      }
    });
    if (failedTests.length > 15) {
      console.log(`\n  ... and ${failedTests.length - 15} more failure(s).`);
    }
  }

  console.log(`${c.bold}${c.cyan}======================================================================${c.reset}\n`);
}

/**
 * Executes test suite via in-process Node runner.
 * @returns {Promise<Object>}
 */
async function runInProcessTests() {
  const { runner } = await import('./e2e-tests.js');
  return await runner.run({ filterTier: 'all', filterCategory: 'all', searchQuery: '' });
}

/**
 * Executes test suite in Headless Chrome via CDP HTTP/WebSocket.
 * @param {number} port
 * @returns {Promise<Object>}
 */
async function runChromeHeadless(port) {
  if (!fs.existsSync(CHROME_PATH)) {
    return null;
  }

  const remotePort = 9233;
  const chromeArgs = [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `--remote-debugging-port=${remotePort}`,
    `http://127.0.0.1:${port}/test/runner.html?mode=automated`
  ];

  let chromeProc = null;
  try {
    chromeProc = spawn(CHROME_PATH, chromeArgs, { stdio: 'ignore' });
  } catch (err) {
    return null;
  }

  // Poll CDP endpoint for results with 5s timeout
  const pollStart = Date.now();
  let results = null;
  const WSClass = globalThis.WebSocket;

  try {
    await new Promise(r => setTimeout(r, 1000));

    while (Date.now() - pollStart < 6000) {
      try {
        const pagesRes = await fetch(`http://127.0.0.1:${remotePort}/json`);
        const pages = await pagesRes.json();
        const testPage = pages.find(p => p.url && p.url.includes('/test/runner.html'));

        if (testPage && testPage.webSocketDebuggerUrl && WSClass) {
          const wsUrl = testPage.webSocketDebuggerUrl;
          const ws = new WSClass(wsUrl);

          results = await new Promise((resolve) => {
            ws.onopen = () => {
              ws.send(JSON.stringify({
                id: 1,
                method: 'Runtime.evaluate',
                params: {
                  expression: 'window.E2E_TEST_RESULTS',
                  returnByValue: true
                }
              }));
            };

            ws.onmessage = (event) => {
              try {
                const data = JSON.parse(event.data);
                if (data.id === 1 && data.result?.result?.value) {
                  ws.close();
                  resolve(data.result.result.value);
                }
              } catch (e) {
                resolve(null);
              }
            };

            ws.onerror = () => resolve(null);
            setTimeout(() => resolve(null), 1500);
          });

          if (results && results.total >= 541) break;
        }
      } catch (e) {
        // Retry
      }
      await new Promise(r => setTimeout(r, 500));
    }
  } finally {
    if (chromeProc) {
      try { chromeProc.kill(); } catch (e) {}
    }
  }

  return results;
}

/**
 * Main CLI execution entrypoint.
 */
async function main() {
  const args = process.argv.slice(2);
  const preferBrowser = args.includes('--browser');
  let server = null;

  try {
    server = await startStaticServer(PORT);

    let results = null;

    if (preferBrowser && fs.existsSync(CHROME_PATH)) {
      console.log('Attempting headless Chrome verification...');
      try {
        results = await runChromeHeadless(PORT);
      } catch (err) {
        // Fallback
      }
    }

    if (!results) {
      console.log('Executing test suite in Node.js runtime...');
      results = await runInProcessTests();
    }

    printTerminalReport(results);

    // Strict exit code contract: 0 on success, 1 on any failure or incomplete suite
    const isPassing = results.total >= 541 && results.failed === 0;
    process.exit(isPassing ? 0 : 1);
  } catch (error) {
    console.error('Fatal Test Runner Error:', error);
    process.exit(1);
  } finally {
    if (server) {
      server.close();
    }
  }
}

main();
