const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const projects = ['anji', 'mahesh', 'vinod'];

  for (const proj of projects) {
    const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
    const reportPath = path.resolve(__dirname, proj, `${proj}-security-report.html`);
    const ssDir = path.resolve(__dirname, proj, 'screenshots');

    // Full report screenshot
    await page.goto('file://' + reportPath);
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ssDir, 'security-report-full.png'), fullPage: true });
    console.log(`${proj}: security-report-full.png`);

    // Summary section only (top of page)
    await page.screenshot({ path: path.join(ssDir, 'security-summary.png'), clip: { x: 0, y: 0, width: 1400, height: 500 } });
    console.log(`${proj}: security-summary.png`);

    // Also screenshot the coverage report if available
    const covPath = path.resolve(__dirname, proj, 'artifacts', 'backend-coverage-report', 'htmlcov', 'index.html');
    try {
      await page.goto('file://' + covPath);
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(ssDir, 'backend-coverage.png'), fullPage: true });
      console.log(`${proj}: backend-coverage.png`);
    } catch(e) { console.log(`${proj}: coverage skipped`); }

    // Frontend coverage
    const fcovPath = path.resolve(__dirname, proj, 'artifacts', 'frontend-coverage-report', 'lcov-report', 'index.html');
    try {
      await page.goto('file://' + fcovPath);
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(ssDir, 'frontend-coverage.png'), fullPage: true });
      console.log(`${proj}: frontend-coverage.png`);
    } catch(e) { console.log(`${proj}: frontend coverage skipped`); }

    // ZAP report
    const zapPath = path.resolve(__dirname, proj, 'artifacts', 'zap-report', 'report_html.html');
    try {
      await page.goto('file://' + zapPath);
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(ssDir, 'zap-report.png'), fullPage: true });
      console.log(`${proj}: zap-report.png`);
    } catch(e) { console.log(`${proj}: zap skipped`); }

    // Live app login page
    const urls = { anji: 'http://13.218.144.4', mahesh: 'http://3.238.107.20', vinod: 'http://98.80.177.28' };
    try {
      await page.goto(urls[proj] + '/login', { timeout: 10000 });
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(ssDir, 'app-login.png'), fullPage: true });
      console.log(`${proj}: app-login.png`);
    } catch(e) { console.log(`${proj}: app login skipped - ${e.message}`); }

    await page.close();
  }

  await browser.close();
  console.log('All screenshots done!');
})();
