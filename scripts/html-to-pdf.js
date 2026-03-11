#!/usr/bin/env node
// html-to-pdf.js — Gera PDF a partir de HTML local usando Puppeteer + Chrome headless
// Uso: node html-to-pdf.js input.html output.pdf

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF(inputPath, outputPath) {
  const absoluteInput = path.resolve(inputPath);
  if (!fs.existsSync(absoluteInput)) {
    console.error(`Arquivo não encontrado: ${absoluteInput}`);
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-first-run',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-extensions',
      '--disable-background-networking',
    ]
  });

  const page = await browser.newPage();
  
  // Carrega o HTML local
  const htmlContent = fs.readFileSync(absoluteInput, 'utf8');
  await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 30000 });

  // Espera fontes do Google Fonts carregarem
  await page.evaluateHandle('document.fonts.ready');
  
  // Espera extra pra garantir renderização completa
  await new Promise(r => setTimeout(r, 2000));

  // Gera PDF
  await page.pdf({
    path: path.resolve(outputPath),
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
    preferCSSPageSize: true,
  });

  await browser.close();
  
  const stats = fs.statSync(path.resolve(outputPath));
  console.log(`PDF gerado: ${outputPath} (${(stats.size / 1024).toFixed(0)}KB)`);
}

const [,, input, output] = process.argv;
if (!input || !output) {
  console.error('Uso: node html-to-pdf.js <input.html> <output.pdf>');
  process.exit(1);
}

generatePDF(input, output).catch(err => {
  console.error('Erro:', err.message);
  process.exit(1);
});
