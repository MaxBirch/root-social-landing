// OG image generator using Sharp + SVG composition
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const WIDTH = 1200;
const HEIGHT = 630;

// Load and resize the logo to ~80px
const logoBuffer = await sharp(join(root, 'public', 'logo.png'))
  .resize(80, 80, { fit: 'contain', background: { r: 10, g: 10, b: 10, alpha: 0 } })
  .png()
  .toBuffer();

// Get logo metadata to position correctly
const logoMeta = await sharp(logoBuffer).metadata();
const logoW = logoMeta.width || 80;
const logoH = logoMeta.height || 80;

// Build SVG overlay for text elements
const svgText = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <!-- "FREE Ad Account Audit" - white bold large -->
  <text
    x="${WIDTH / 2}"
    y="${HEIGHT / 2 + logoH / 2 + 20}"
    font-family="Arial, Helvetica, sans-serif"
    font-size="54"
    font-weight="bold"
    fill="#FFFFFF"
    text-anchor="middle"
    dominant-baseline="hanging"
  >FREE Ad Account Audit</text>

  <!-- "get.root-social.com" - green smaller -->
  <text
    x="${WIDTH / 2}"
    y="${HEIGHT / 2 + logoH / 2 + 96}"
    font-family="Arial, Helvetica, sans-serif"
    font-size="26"
    font-weight="400"
    fill="#2D8B3C"
    text-anchor="middle"
    dominant-baseline="hanging"
  >get.root-social.com</text>
</svg>
`.trim();

const svgBuffer = Buffer.from(svgText);

// Logo Y: centred slightly above mid-point
const logoX = Math.round((WIDTH - logoW) / 2);
const logoY = Math.round(HEIGHT / 2 - logoH / 2 - 70);

const outputPath = join(root, 'public', 'og-image.png');

await sharp({
  create: {
    width: WIDTH,
    height: HEIGHT,
    channels: 4,
    background: { r: 10, g: 10, b: 10, alpha: 1 },
  },
})
  .composite([
    { input: logoBuffer, top: logoY, left: logoX },
    { input: svgBuffer, top: 0, left: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(outputPath);

console.log(`✅ OG image generated: ${outputPath}`);
console.log(`   Dimensions: ${WIDTH}x${HEIGHT}`);
