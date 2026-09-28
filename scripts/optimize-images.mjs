// Generate AVIF + WebP siblings for self-hosted JPEGs under public/.
// Runs as `prebuild` (and can be run manually). Derivatives are gitignored;
// CI / Cloudflare regenerate them from the committed .jpg sources.
//
// Skips work when an up-to-date derivative already exists (mtime check).
import { readdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import sharp from "sharp";

// ⚠️ readdir は再帰しない。サブフォルダは個別に並べる（2026-09-29: journal/pool を入れ忘れて
//    auto-blog がプール写真を付けた記事で avif/webp のリンク切れ 302件 → 9/28 の記事が出なかった）
const DIRS = ["staff", "salons", "gallery", "hero", "irida", "journal", "journal/pool"].map((d) => join("public", d));
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
