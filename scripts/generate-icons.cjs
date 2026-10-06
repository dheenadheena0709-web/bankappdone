const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// SVG representation of the user-provided HSBC IN icon
// Background: pure white #FFFFFF
// HSBC Hexagon: 2:1 ratio (width: 340, height: 170)
// Center of hexagon at (256, 230)
// Top triangle: (171, 145) to (341, 145) to (256, 230)
// Bottom triangle: (171, 315) to (341, 315) to (256, 230)
// Left outer triangle: (86, 230) to (171, 145) to (171, 315)
// Right outer triangle: (426, 230) to (341, 145) to (341, 315)
// Text "IN": font-size 70, bold, fill #1A1A1A, centered at (256, 400)

const hsbcRed = '#DB0011';

function createSvg(size = 512, isMaskable = false) {
  // If maskable, slightly scale down (safe zone 80%)
  const scale = isMaskable ? 0.82 : 0.95;
  const cx = size / 2;
  const cy = size / 2;

  // Base coordinates in 512x512 space
  // Hexagon height H = 160, width = 320
  // Hexagon center at (256, 220)
  // Text "IN" at (256, 385)
  return `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#FFFFFF" />
  <g transform="translate(${cx}, ${cy}) scale(${scale}) translate(-256, -256)">
    <!-- Top red triangle -->
    <polygon points="176,140 336,140 256,220" fill="${hsbcRed}" />
    
    <!-- Bottom red triangle -->
    <polygon points="176,300 336,300 256,220" fill="${hsbcRed}" />
    
    <!-- Left outer red triangle -->
    <polygon points="96,220 176,140 176,300" fill="${hsbcRed}" />
    
    <!-- Right outer red triangle -->
    <polygon points="416,220 336,140 336,300" fill="${hsbcRed}" />
    
    <!-- Text "IN" below the hexagon -->
    <text x="256" y="392" text-anchor="middle" font-family="Plus Jakarta Sans, Arial, Helvetica, sans-serif" font-size="70" font-weight="800" fill="#1A1A1A" letter-spacing="1.5">IN</text>
  </g>
</svg>
`;
}

async function generate() {
  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Save standard SVG icon
  const svg512 = createSvg(512, false);
  const svgMaskable = createSvg(512, true);
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svg512);

  // 2. Generate 512x512 PNG
  await sharp(Buffer.from(svg512))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Created pwa-512x512.png');

  // 3. Generate 192x192 PNG
  await sharp(Buffer.from(svg512))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Created pwa-192x192.png');

  // 4. Generate maskable 512x512 PNG
  await sharp(Buffer.from(svgMaskable))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Created pwa-maskable-512x512.png');

  // 5. Generate apple-touch-icon.png (180x180) for iOS Safari home screen installation
  await sharp(Buffer.from(svg512))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // 6. Generate favicon-32x32.png and favicon.ico / favicon.png
  await sharp(Buffer.from(svg512))
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('Created favicon.png');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
