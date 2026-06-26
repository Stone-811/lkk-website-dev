/**
 * PWA Icon Generator Script
 *
 * Generates PWA icons in PNG format using sharp.
 *
 * Usage: node scripts/generate-pwa-icons.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');

// Brand colors from CLAUDE.md
const NAVY = '#2A5269';
const ORANGE = '#FB720A';
const CREAM = '#F5EFE4';

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icon
function generateSVG(size) {
  const fontSize = Math.floor(size * 0.4);
  const padding = Math.floor(size * 0.12);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${NAVY}" rx="${Math.floor(size * 0.12)}"/>
  <text
    x="50%"
    y="52%"
    font-family="Arial, Helvetica, sans-serif"
    font-size="${fontSize}"
    font-weight="bold"
    fill="${CREAM}"
    text-anchor="middle"
    dominant-baseline="middle"
  >練</text>
  <rect
    x="${padding}"
    y="${size - padding - Math.max(3, Math.floor(size * 0.02))}"
    width="${size - padding * 2}"
    height="${Math.max(3, Math.floor(size * 0.02))}"
    fill="${ORANGE}"
    rx="${Math.max(1, Math.floor(size * 0.01))}"
  />
</svg>`;
}

async function generateIcons() {
  console.log('Generating PWA icons...\n');

  for (const size of sizes) {
    const svg = generateSVG(size);
    const pngFilename = `icon-${size}x${size}.png`;
    const pngPath = path.join(iconsDir, pngFilename);

    try {
      await sharp(Buffer.from(svg))
        .png()
        .toFile(pngPath);
      console.log(`Generated: ${pngFilename}`);
    } catch (error) {
      console.error(`Error generating ${pngFilename}:`, error.message);
    }
  }

  // Generate favicon.ico (as PNG, browser will handle it)
  const favicon32 = generateSVG(32);
  const favicon16 = generateSVG(16);

  try {
    await sharp(Buffer.from(favicon32))
      .png()
      .toFile(path.join(iconsDir, '../favicon-32x32.png'));
    console.log('Generated: favicon-32x32.png');

    await sharp(Buffer.from(favicon16))
      .png()
      .toFile(path.join(iconsDir, '../favicon-16x16.png'));
    console.log('Generated: favicon-16x16.png');
  } catch (error) {
    console.error('Error generating favicon:', error.message);
  }

  console.log(`
========================================
PWA Icons Generated Successfully!
========================================

PNG icons created in: apps/web/public/icons/

Icon sizes: ${sizes.join(', ')} pixels

For custom branding, replace these icons with your actual brand icons.
Use tools like:
  - https://realfavicongenerator.net/
  - https://www.pwabuilder.com/imageGenerator
`);
}

generateIcons().catch(console.error);
