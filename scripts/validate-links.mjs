// Internal link & asset integrity checker over the built site (dist/).
// No network: verifies every internal href/src/srcset resolves to a page or
// asset that actually exists, and that same-page #fragments have a target.
//
// Usage: npm run build && node scripts/validate-links.mjs
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, normalize } from "node:path";

const DIST = "dist";
const SITE = "https://ile-hair-harajuku.com";
const ASSET_RE = /\.[a-z0-9]+$/i;

const errors = [];
const warns = [];
const err = (p, m) => errors.push(`${p}: ${m}`);
const warn = (p, m) => warns.push(`${p}: ${m}`);

function walk(dir) {
  const out = [];
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (n.endsWith(".html")) out.push(p);
  }
  return out;
}

// does an internal path (no query/hash) resolve to a file or page in dist?
function resolves(path) {
  if (ASSET_RE.test(path)) return existsSync(join(DIST, path));
  const clean = path.replace(/\/$/, "");
  return (
    existsSync(join(DIST, clean, "index.html")) ||
    existsSync(join(DIST, `${clean}.html`)) ||
    (clean === "" && existsSync(join(DIST, "index.html")))
  );
}

const SKIP = /^(mailto:|tel:|data:|javascript:|blob:)/i;

for (const file of walk(DIST)) {
  const page = file.replace(`${DIST}/`, "/").replace(/\/index\.html$/, "/");
  const html = readFileSync(file, "utf8");
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  // collect every candidate URL: href, src, and each srcset entry
  const urls = [];
  for (const m of html.matchAll(/\b(?:href|src)="([^"]+)"/gi)) urls.push(m[1]);
  for (const m of html.matchAll(/\bsrcset="([^"]+)"/gi))
    for (const part of m[1].split(","))
      urls.push(part.trim().split(/\s+/)[0]);

  for (let raw of urls) {
    if (!raw || SKIP.test(raw)) continue;

    // external: normalise own-domain absolute to a path; skip other hosts
    if (/^https?:\/\//i.test(raw)) {
      if (raw.startsWith(SITE)) raw = raw.slice(SITE.length) || "/";
      else continue;
    }
    if (raw.startsWith("//")) continue; // protocol-relative external (fonts etc.)

    // split off hash + query
    const hash = raw.includes("#") ? raw.slice(raw.indexOf("#") + 1) : null;
    let path = raw.split("#")[0].split("?")[0];

    // pure same-page fragment
    if (raw.startsWith("#")) {
      if (hash && !ids.has(hash)) warn(page, `dead in-page anchor #${hash}`);
      continue;
    }

    // resolve relative paths against the page directory
    if (!path.startsWith("/")) {
      const baseDir = dirname(file).replace(`${DIST}`, "") || "/";
      path = "/" + normalize(join(baseDir, path)).replace(/^(\.\.\/)+/, "");
    }

    if (path && !resolves(path)) err(page, `broken link → ${path}`);
  }
}

const uniq = (a) => [...new Set(a)];
const E = uniq(errors), W = uniq(warns);
console.log(`\nLink & asset integrity — ${walk(DIST).length} pages\n`);
if (E.length) { console.log(`❌ ERRORS (${E.length}):`); E.forEach((e) => console.log("  - " + e)); }
else console.log("✅ 0 broken links/assets");
if (W.length) { console.log(`\n⚠️  WARNINGS (${W.length}):`); W.forEach((w) => console.log("  - " + w)); }
else console.log("✅ 0 warnings");
console.log("");
process.exit(E.length ? 1 : 0);
