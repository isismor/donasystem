#!/bin/bash
# Gera QR do WhatsApp, converte pra JPG e salva
# Uso: bash gerar-qr-whatsapp.sh

# 1. Gerar QR via CLI e capturar output do terminal
timeout 25 openclaw channels login --channel whatsapp 2>&1 | head -40 > /tmp/qr-output.txt &
PID=$!
sleep 8
kill $PID 2>/dev/null

# 2. Extrair linhas do QR (as que tem caracteres unicode block)
grep -E '[▄▀█]' /tmp/qr-output.txt > /tmp/qr-lines.txt

echo "QR lines captured: $(wc -l < /tmp/qr-lines.txt)"
cat /tmp/qr-lines.txt

# 3. Converter pra imagem via node
node -e "
const sharp = require('/tmp/node_modules/sharp');
const fs = require('fs');

const qrText = fs.readFileSync('/tmp/qr-lines.txt', 'utf8').trim();
const lines = qrText.split('\n');
const scale = 10;

// Find max line length in characters
let maxLen = 0;
for (const l of lines) maxLen = Math.max(maxLen, [...l].length);

const w = maxLen * scale;
const h = lines.length * 2 * scale;
const pixels = Buffer.alloc(w * h * 3, 255);

function setBlock(x, y) {
  for (let sy = 0; sy < scale; sy++) {
    for (let sx = 0; sx < scale; sx++) {
      const px = x + sx, py = y + sy;
      if (px >= 0 && px < w && py >= 0 && py < h) {
        const idx = (py * w + px) * 3;
        pixels[idx] = 0; pixels[idx+1] = 0; pixels[idx+2] = 0;
      }
    }
  }
}

for (let row = 0; row < lines.length; row++) {
  const chars = [...lines[row]];
  for (let col = 0; col < chars.length; col++) {
    const c = chars[col];
    const px = col * scale;
    const py = row * 2 * scale;
    if (c === '█') { setBlock(px, py); setBlock(px, py + scale); }
    else if (c === '▀') { setBlock(px, py); }
    else if (c === '▄') { setBlock(px, py + scale); }
  }
}

sharp(pixels, { raw: { width: w, height: h, channels: 3 } })
  .jpeg({ quality: 95 })
  .toFile('/home/openclaw/.openclaw/workspace/output/qr-whatsapp-latest.jpg')
  .then(() => console.log('QR image saved'))
  .catch(e => console.error('ERR:', e.message));
"
