// Internal-consistency validator for all JSON-LD across the built site.
// No network: it parses every <script type="application/ld+json"> in dist/,
// builds the node graph, and checks references, URLs, assets, dates and the
// per-type shape. Exits non-zero on ERROR so it can gate CI (W7).
//
// Usage: npm run build && node scripts/validate-jsonld.mjs
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const SITE = "https://ile-hair-harajuku.com";
const ASSET_RE = /\.(svg|jpg|jpeg|png|webp|avif|ico|gif)$/i;
const ISO_RE = /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2})?([+-]\d{2}:?\d{2}|Z)?)?$/;

const errors = [];
const warns = [];
const err = (page, msg) => errors.push(`${page}: ${msg}`);
const warn = (page, msg) => warns.push(`${page}: ${msg}`);

// ---- collect html files ----------------------------------------------------
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

// resolve an absolute SITE url to a dist path that should exist
function assetExists(url) {
  if (!url.startsWith(SITE)) return null; // external, skip
  let path = url.slice(SITE.length) || "/";
  if (ASSET_RE.test(path)) return existsSync(join(DIST, path));
  // page url -> directory index
  path = path.replace(/\/$/, "");
  return (
    existsSync(join(DIST, path, "index.html")) ||
    existsSync(join(DIST, `${path}.html`)) ||
    (path === "" && existsSync(join(DIST, "index.html")))
  );
}

// ---- pass 1: gather every node and @id ------------------------------------
const definedIds = new Map(); // id -> Set(types)
const pages = []; // { page, blocks: [parsed] }

function collectIds(node) {
  if (Array.isArray(node)) return node.forEach(collectIds);
  if (!node || typeof node !== "object") return;
  if (node["@id"] && node["@type"]) {
    const id = node["@id"];
    if (!definedIds.has(id)) definedIds.set(id, new Set());
    [].concat(node["@type"]).forEach((t) => definedIds.get(id).add(t));
  }
  for (const v of Object.values(node)) collectIds(v);
}

const htmlFiles = walk(DIST);
for (const file of htmlFiles) {
  const page = file.replace(`${DIST}/`, "/").replace(/\/index\.html$/, "/");
  const html = readFileSync(file, "utf8");
  const blocks = [];
  const re = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    try {
      const parsed = JSON.parse(m[1]);
      blocks.push(parsed);
      collectIds(parsed);
    } catch (e) {
      err(page, `JSON-LD parse error: ${e.message}`);
    }
  }
  if (blocks.length === 0) warn(page, "no JSON-LD block");
  pages.push({ page, blocks });
}

// ---- pass 2: per-node validation ------------------------------------------
const refsSeen = []; // { page, id }

function checkStringUrl(page, field, val) {
  if (typeof val !== "string") return;
  if (val.includes("undefined") || val.includes("null")) {
    err(page, `${field} contains literal undefined/null: "${val}"`);
  }
  if (/^(https?:)?\//.test(val) === false && /^https?:\/\//.test(val) === false) {
    // not absolute and not site-rooted path
    err(page, `${field} is not an absolute URL: "${val}"`);
  } else if (val.startsWith(SITE)) {
    if (assetExists(val) === false)
      err(page, `${field} points to missing asset/page: ${val}`);
  } else if (val.startsWith("/")) {
    err(page, `${field} is a root-relative URL (should be absolute): "${val}"`);
  }
}

function emptyCheck(page, type, field, val) {
  if (val === "" || (typeof val === "string" && val.trim() === ""))
    err(page, `${type}.${field} is empty`);
  if (typeof val === "string" && /\bundefined\b/.test(val))
    err(page, `${type}.${field} contains "undefined": "${val}"`);
}

function validateNode(page, node) {
  if (Array.isArray(node)) return node.forEach((n) => validateNode(page, n));
  if (!node || typeof node !== "object") return;

  const type = []
    .concat(node["@type"] || [])
    .join("+") || (node["@id"] ? "(ref)" : "");

  // reference object: @id only, no @type
  if (node["@id"] && !node["@type"]) refsSeen.push({ page, id: node["@id"] });

  // url-ish fields
  for (const f of ["url", "image", "logo", "contentUrl", "mainEntityOfPage", "item"]) {
    if (typeof node[f] === "string") checkStringUrl(page, `${type}.${f}`, node[f]);
    if (Array.isArray(node[f]))
      node[f].forEach((v) => checkStringUrl(page, `${type}.${f}[]`, v));
  }
  // date fields
  for (const f of ["datePublished", "dateModified", "foundingDate"]) {
    if (node[f] != null && !ISO_RE.test(String(node[f])))
      err(page, `${type}.${f} not ISO 8601: "${node[f]}"`);
  }
  // empty-string scan on common text fields
  for (const f of ["name", "headline", "description", "text"]) {
    if (f in node) emptyCheck(page, type, f, node[f]);
  }

  // per-type required shape
  const t = [].concat(node["@type"] || []);
  if (t.includes("BreadcrumbList")) {
    const items = node.itemListElement || [];
    items.forEach((it, i) => {
      if (it.position !== i + 1)
        err(page, `BreadcrumbList position ${it.position} != expected ${i + 1}`);
      if (!it.name) err(page, `BreadcrumbList item ${i} missing name`);
      if (!it.item) err(page, `BreadcrumbList item ${i} missing item URL`);
    });
  }
  if (t.includes("FAQPage")) {
    const qs = node.mainEntity || [];
    if (qs.length === 0) err(page, "FAQPage has no mainEntity questions");
    qs.forEach((q, i) => {
      if (!q.name) err(page, `FAQ Q${i} missing name`);
      if (!q.acceptedAnswer?.text) err(page, `FAQ Q${i} missing acceptedAnswer.text`);
    });
  }
  if (t.includes("Article")) {
    for (const f of ["headline", "author", "publisher", "datePublished"])
      if (!node[f]) err(page, `Article missing ${f}`);
  }
  if (t.some((x) => /Organization$/.test(x))) {
    for (const f of ["name", "url"]) if (!node[f]) err(page, `Organization missing ${f}`);
  }
  if (t.includes("HairSalon") || t.includes("LocalBusiness")) {
    for (const f of ["name", "address", "telephone"])
      if (!node[f]) warn(page, `${t.join("+")} missing recommended ${f}`);
    if (!node.image) warn(page, `${t.join("+")} has no image`);
  }
  if (t.includes("ImageGallery")) {
    if (!(node.associatedMedia?.length > 0))
      err(page, "ImageGallery has no associatedMedia");
  }
  if (t.includes("DefinedTerm")) {
    for (const f of ["name", "description"]) if (!node[f]) err(page, `DefinedTerm missing ${f}`);
  }

  for (const v of Object.values(node)) validateNode(page, v);
}

// top-level @context check + walk
for (const { page, blocks } of pages) {
  for (const b of blocks) {
    const tops = Array.isArray(b) ? b : [b];
    for (const top of tops) {
      if (top && typeof top === "object" && !top["@context"])
        err(page, `top-level ${top["@type"] || "node"} missing @context`);
      if (top && typeof top === "object" && !top["@type"])
        err(page, "top-level node missing @type");
    }
    validateNode(page, b);
  }
}

// ---- pass 3: reference resolution -----------------------------------------
for (const { page, id } of refsSeen) {
  if (!definedIds.has(id))
    err(page, `@id reference "${id}" is never defined anywhere on the site`);
}
// duplicate @id with conflicting @type
for (const [id, types] of definedIds) {
  if (types.size > 1) warn("(graph)", `@id ${id} defined with multiple types: ${[...types].join(", ")}`);
}

// ---- report ----------------------------------------------------------------
const uniq = (a) => [...new Set(a)];
const E = uniq(errors), W = uniq(warns);
console.log(`\nJSON-LD validation — ${htmlFiles.length} pages, ${definedIds.size} unique @id node(s)\n`);
if (E.length) { console.log(`❌ ERRORS (${E.length}):`); E.forEach((e) => console.log("  - " + e)); }
else console.log("✅ 0 errors");
if (W.length) { console.log(`\n⚠️  WARNINGS (${W.length}):`); W.forEach((w) => console.log("  - " + w)); }
else console.log("✅ 0 warnings");
console.log("");
process.exit(E.length ? 1 : 0);
