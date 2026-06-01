// Static SEO / Open Graph / meta validator over the built site (dist/).
// No network. Verifies per-page head completeness + cross-page uniqueness.
//
// Usage: npm run build && node scripts/validate-seo.mjs
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const SITE = "https://ile-hair-harajuku.com";
const ASSET_RE = /\.(svg|jpg|jpeg|png|webp|avif|ico|gif|xml|webmanifest|json)$/i;

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

function localExists(url) {
  if (!url.startsWith(SITE)) return null;
  let path = url.slice(SITE.length) || "/";
  if (ASSET_RE.test(path)) return existsSync(join(DIST, path));
  path = path.replace(/\/$/, "");
  return (
    existsSync(join(DIST, path, "index.html")) ||
    existsSync(join(DIST, `${path}.html`)) ||
    (path === "" && existsSync(join(DIST, "index.html")))
  );
}

// extractors
const meta = (head, prop, kind = "name") =>
  head.match(new RegExp(`<meta[^>]*${kind}="${prop}"[^>]*content="([^"]*)"`, "i"))?.[1] ??
  head.match(new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${kind}="${prop}"`, "i"))?.[1] ??
  null;
const all = (re, s) => [...s.matchAll(re)];

const titleMap = new Map(); // title -> [pages]
const canonMap = new Map(); // canonical -> [pages]

for (const file of walk(DIST)) {
  const page = file.replace(`${DIST}/`, "/").replace(/\/index\.html$/, "/");
  const html = readFileSync(file, "utf8");
  const head = html.slice(0, html.search(/<\/head>/i) + 1 || html.length);

  const noindex = /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(head);

  // title
  const titles = all(/<title[^>]*>([\s\S]*?)<\/title>/gi, head);
  if (titles.length === 0) err(page, "no <title>");
  else if (titles.length > 1) err(page, `${titles.length} <title> tags`);
  const title = titles[0]?.[1]?.trim() ?? "";
  if (titles.length && !title) err(page, "empty <title>");
  if (title.length > 60) warn(page, `<title> long (${title.length} chars): "${title}"`);
  if (title) (titleMap.get(title) ?? titleMap.set(title, []).get(title)).push(page);

  // description
  const descs = all(/<meta[^>]*name="description"[^>]*>/gi, head);
  if (descs.length === 0) err(page, "no meta description");
  else if (descs.length > 1) err(page, `${descs.length} meta description tags`);
  const desc = meta(head, "description");
  if (descs.length && !desc) err(page, "empty meta description");
  if (desc && desc.length < 40) warn(page, `meta description short (${desc.length} chars)`);
  if (desc && desc.length > 200) warn(page, `meta description long (${desc.length} chars)`);

  // canonical
  const canons = all(/<link[^>]*rel="canonical"[^>]*>/gi, head);
  if (canons.length === 0) err(page, "no canonical link");
  else if (canons.length > 1) err(page, `${canons.length} canonical links`);
  const canonical = head.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i)?.[1];
  if (canons.length && !canonical) err(page, "canonical without href");
  if (canonical) {
    if (!canonical.startsWith("http")) err(page, `canonical not absolute: "${canonical}"`);
    else if (localExists(canonical) === false) err(page, `canonical points to missing page: ${canonical}`);
    // self-referential: canonical path should equal this page's path
    // (skip noindex pages like 404, whose canonical is irrelevant)
    if (!noindex) {
      const cPath = canonical.replace(SITE, "").replace(/\/$/, "") || "/";
      const pPath = page.replace(/\/$/, "").replace(/\.html$/, "") || "/";
      if (cPath !== pPath) warn(page, `canonical "${cPath}" != page path "${pPath}"`);
    }
    if (!noindex) (canonMap.get(canonical) ?? canonMap.set(canonical, []).get(canonical)).push(page);
  }

  // OGP
  const ogType = meta(head, "og:type", "property");
  const ogTitle = meta(head, "og:title", "property");
  const ogDesc = meta(head, "og:description", "property");
  const ogUrl = meta(head, "og:url", "property");
  const ogImage = meta(head, "og:image", "property");
  if (!ogType) err(page, "missing og:type");
  if (!ogTitle) err(page, "missing og:title");
  if (!ogDesc) err(page, "missing og:description");
  if (!ogUrl) err(page, "missing og:url");
  if (!ogImage) err(page, "missing og:image");
  else {
    if (!ogImage.startsWith("http")) err(page, `og:image not absolute: "${ogImage}"`);
    else if (localExists(ogImage) === false) err(page, `og:image missing file: ${ogImage}`);
  }
  if (ogUrl && canonical && ogUrl !== canonical)
    warn(page, `og:url "${ogUrl}" != canonical "${canonical}"`);
  if (ogTitle && title && ogTitle !== title)
    warn(page, "og:title differs from <title>");
  if (ogDesc && desc && ogDesc !== desc)
    warn(page, "og:description differs from meta description");

  // Twitter
  const twCard = meta(head, "twitter:card");
  if (!twCard) err(page, "missing twitter:card");
  else if (!/^(summary|summary_large_image)$/.test(twCard))
    warn(page, `unusual twitter:card "${twCard}"`);
  for (const t of ["twitter:title", "twitter:description", "twitter:image"])
    if (!meta(head, t)) warn(page, `missing ${t}`);

  // charset + viewport
  if (!/<meta[^>]*charset=/i.test(head)) err(page, "no charset meta");
  if (!/<meta[^>]*name="viewport"/i.test(head)) err(page, "no viewport meta");

  // referenced local head assets exist (icons, manifest, feed)
  for (const m of all(/<link[^>]*href="([^"]+)"[^>]*>/gi, head)) {
    const href = m[1];
    if (href.startsWith("/") && ASSET_RE.test(href) && !existsSync(join(DIST, href)))
      err(page, `<link> references missing asset: ${href}`);
  }
}

// cross-page
for (const [title, pages] of titleMap)
  if (pages.length > 1) warn("(site)", `duplicate <title> "${title}" on: ${[...new Set(pages)].join(", ")}`);
for (const [canon, pages] of canonMap) {
  const uniq = [...new Set(pages)];
  if (uniq.length > 1) err("(site)", `duplicate canonical ${canon} on: ${uniq.join(", ")}`);
}

const uniq = (a) => [...new Set(a)];
const E = uniq(errors), W = uniq(warns);
console.log(`\nSEO / OGP validation — ${walk(DIST).length} pages\n`);
if (E.length) { console.log(`❌ ERRORS (${E.length}):`); E.forEach((e) => console.log("  - " + e)); }
else console.log("✅ 0 errors");
if (W.length) { console.log(`\n⚠️  WARNINGS (${W.length}):`); W.forEach((w) => console.log("  - " + w)); }
else console.log("✅ 0 warnings");
console.log("");
process.exit(E.length ? 1 : 0);
