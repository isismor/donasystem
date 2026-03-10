import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

const htmlPath = path.resolve(process.argv[2] || 'skills-catalog.html');
const outPath = process.argv[3] || htmlPath.replace(/\.html$/, '.pdf');

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' });
await page.pdf({
  path: outPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' }
});
await browser.close();
console.log('PDF saved:', outPath);
