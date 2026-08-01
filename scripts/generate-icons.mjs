// Generate PWA icon PNGs from the SVG icon using sharp
// Run: node scripts/generate-icons.mjs

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgBuffer = readFileSync(resolve(__dirname, '../app/icon.svg'));

const sizes = [
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
];

for (const { size, name } of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(resolve(__dirname, '../public', name));
  console.log(`✓ Generated public/${name} (${size}×${size})`);
}

console.log('\nDone! All PWA icons generated.');
