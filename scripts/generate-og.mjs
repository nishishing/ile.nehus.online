// Generates public/og-default.jpg (1200×630) from the real Harajuku hero photo
// + the boxed "iLe." mark + brand tagline. Cool-mono treatment to match the site.
// Re-run: `node scripts/generate-og.mjs`
import sharp from "sharp";

const W = 1200, H = 630;

const overlay = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0"   stop-color="#16171A" stop-opacity="0.55"/>
      <stop offset="0.5" stop-color="#16171A" stop-opacity="0.32"/>
      <stop offset="1"   stop-color="#16171A" stop-opacity="0.72"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#scrim)"/>

  <!-- boxed iLe. mark (from BrandMark) -->
  <svg x="${W/2 - 66}" y="118" width="132" height="126" viewBox="183 443 572 545" preserveAspectRatio="xMidYMid meet">
    <rect x="189.74" y="449.5" width="558.48" height="531" fill="none" stroke="#FFFFFF" stroke-width="6"/>
    <rect x="198.5" y="457.5" width="541" height="515" fill="none" stroke="#FFFFFF" stroke-width="6" opacity="0.5"/>
    <text transform="translate(399 768.96) scale(.96 1)" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="96.67" letter-spacing="2.9" fill="#FFFFFF">iLe.</text>
  </svg>

  <text x="${W/2}" y="372" text-anchor="middle" font-family="IPAGothic, sans-serif"
        font-size="64" letter-spacing="6" fill="#FFFFFF">船から、島へ。</text>

  <text x="${W/2}" y="430" text-anchor="middle" font-family="Arial, sans-serif"
        font-size="21" letter-spacing="9" fill="#DCDEE2">FROM A SHIP, TO AN ISLAND</text>

  <line x1="${W/2 - 70}" y1="470" x2="${W/2 + 70}" y2="470" stroke="#9CA0A6" stroke-width="1"/>

  <text x="${W/2}" y="556" text-anchor="middle" font-family="IPAGothic, sans-serif"
        font-size="22" letter-spacing="4" fill="#F4F5F6">原宿 ・ 名古屋 ・ 長岡</text>
  <text x="${W/2}" y="588" text-anchor="middle" font-family="Arial, sans-serif"
        font-size="16" letter-spacing="6" fill="#9CA0A6">ile-hair-harajuku.com</text>
</svg>`;

const bg = await sharp("public/hero/harajuku.jpg")
  .resize(W, H, { fit: "cover", position: "attention" })
  .grayscale()
  .modulate({ brightness: 0.92 })
  .toBuffer();

await sharp(bg)
  .composite([{ input: Buffer.from(overlay), top: 0, left: 0 }])
  .jpeg({ quality: 86, progressive: true })
  .toFile("public/og-default.jpg");

console.log("wrote public/og-default.jpg (1200x630)");
