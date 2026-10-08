// Generate PWA icon PNGs, favicons, and favicon.ico from app/icon.svg using sharp
// Run: node scripts/generate-icons.mjs

import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgBuffer = readFileSync(resolve(__dirname, '../app/icon.svg'));

const sizes = [
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 64, name: 'favicon.png' },
  { size: 512, name: 'logo.png' },
];

for (const { size, name } of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(resolve(__dirname, '../public', name));
  console.log(`✓ Generated public/${name} (${size}×${size})`);
}

// Generate 32x32 PNG for favicon.ico container
const ico32Buffer = await sharp(svgBuffer).resize(32, 32).png().toBuffer();

function pngToIco(pngBuffer) {
  const header = Buffer.from([0, 0, 1, 0, 1, 0]); // ICO signature: 1 image
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0); // width 32
  entry.writeUInt8(32, 1); // height 32
  entry.writeUInt8(0, 2);  // color count (0 = 256+)
  entry.writeUInt8(0, 3);  // reserved
  entry.writeUInt16LE(1, 4);  // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel (32-bit RGBA)
  entry.writeUInt32LE(pngBuffer.length, 8); // image size
  entry.writeUInt32LE(22, 12); // offset (header: 6 + entry: 16 = 22)
  return Buffer.concat([header, entry, pngBuffer]);
}

const icoBuffer = pngToIco(ico32Buffer);
writeFileSync(resolve(__dirname, '../public/favicon.ico'), icoBuffer);
writeFileSync(resolve(__dirname, '../app/favicon.ico'), icoBuffer);
console.log('✓ Generated public/favicon.ico and app/favicon.ico (32×32)');

console.log('\nDone! All Oddword PWA icons, favicon.ico & assets generated.');
