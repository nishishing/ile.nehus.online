// Generate AVIF + WebP siblings for self-hosted JPEGs under public/.
// Runs as `prebuild` (and can be run manually). Derivatives are gitignored;
// CI / Cloudflare regenerate them from the committed .jpg sources.
//
// Skips work when an up-to-date derivative already exists (mtime check).
import { readdir, stat } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import sharp from "sharp";

const DIRS = ["staff", "salons", "gallery", "hero", "irida"].map((d) => join("public", d));
const AVIF = { quality: 50, effort: 4 };
const WEBP = { quality: 72 };

const fresh = (src, out) =>
  existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs;

let made = 0;
for (const dir of DIRS) {
  let files;
  try {
    files = await readdir(dir);
  } catch {
    continue; // dir may not exist yet
  }
  for (const f of files) {
    if (extname(f).toLowerCase() !== ".jpg") continue;
    const src = join(dir, f);
    const base = src.slice(0, -extname(src).length);
    const targets = [
      [`${base}.avif`, (img) => img.avif(AVIF)],
      [`${base}.webp`, (img) => img.webp(WEBP)],
    ];
    for (const [out, encode] of targets) {
      if (fresh(src, out)) continue;
      await encode(sharp(src)).toFile(out);
      made++;
    }
  }
}
console.log(`optimize-images: generated ${made} derivative(s).`);
