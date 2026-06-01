// Static accessibility checks over the built site (dist/). No browser, no
// network — structural/DOM checks only (the parts that don't need rendering).
// Colour contrast / focus-visibility are visual and live outside this script.
//
// Usage: npm run build && node scripts/validate-a11y.mjs
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
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

const stripTags = (s) =>
  s
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/gi, "x") // any entity counts as visible text
    .replace(/\s+/g, " ")
    .trim();

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\b${name}="([^"]*)"`, "i"));
  return m ? m[1] : null;
};
const hasAttr = (tag, name) => new RegExp(`\\b${name}(=|\\b)`, "i").test(tag);

for (const file of walk(DIST)) {
  const page = file.replace(`${DIST}/`, "/").replace(/\/index\.html$/, "/");
  const html = readFileSync(file, "utf8");

  // --- lang -----------------------------------------------------------------
  const htmlTag = html.match(/<html[^>]*>/i)?.[0] ?? "";
  const lang = attr(htmlTag, "lang");
  if (!lang) err(page, "<html> has no lang attribute");
  else if (!/^[a-z]{2}(-[A-Za-z]{2,4})?$/.test(lang))
    err(page, `<html lang="${lang}"> is not a valid BCP-47 tag`);

  // --- title ----------------------------------------------------------------
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  if (!title) err(page, "missing or empty <title>");

  // --- viewport (zoom must not be disabled) ---------------------------------
  const vp = html.match(/<meta[^>]*name="viewport"[^>]*>/i)?.[0];
  if (!vp) warn(page, "no viewport meta");
  else if (/user-scalable\s*=\s*no|maximum-scale\s*=\s*1\b/i.test(vp))
    err(page, "viewport disables zoom (user-scalable=no / maximum-scale=1)");

  // --- landmarks ------------------------------------------------------------
  if (!/<main\b/i.test(html)) err(page, "no <main> landmark");
  if ((html.match(/<main\b/gi) || []).length > 1) err(page, "more than one <main>");
  if (!/<header\b|role="banner"/i.test(html)) warn(page, "no <header> banner");
  if (!/<footer\b|role="contentinfo"/i.test(html)) warn(page, "no <footer>");

  // --- headings: one h1, no skipped levels ----------------------------------
  const levels = [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map((m) => +m[1]);
  const h1s = levels.filter((l) => l === 1).length;
  if (h1s === 0) err(page, "no <h1>");
  else if (h1s > 1) err(page, `${h1s} <h1> elements (expected 1)`);
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1)
      err(page, `heading jump h${levels[i - 1]} → h${levels[i]} (skipped a level)`);
  }

  // --- images: alt present & not literal junk -------------------------------
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    if (!hasAttr(tag, "alt")) err(page, `<img> without alt: ${tag.slice(0, 80)}`);
    else {
      const a = attr(tag, "alt") ?? "";
      if (/\b(undefined|null)\b/.test(a)) err(page, `<img alt> has literal undefined/null: "${a}"`);
    }
  }

  // --- accessible name for links & buttons ----------------------------------
  const named = (openTag, inner) => {
    if (/aria-hidden="true"|role="presentation"|role="none"/i.test(openTag)) return true;
    if ((attr(openTag, "aria-label") || "").trim()) return true;
    if (hasAttr(openTag, "aria-labelledby")) return true;
    if ((attr(openTag, "title") || "").trim()) return true;
    if (stripTags(inner)) return true;
    // nested img/svg with a name
    for (const im of inner.matchAll(/<img\b[^>]*>/gi))
      if ((attr(im[0], "alt") || "").trim()) return true;
    if (/<svg\b[^>]*(aria-label="[^"]+"|role="img")/i.test(inner)) return true;
    return false;
  };
  for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    if (!/\bhref=/i.test(m[1])) continue; // bare anchor target, not a link
    if (!named(m[1], m[2])) err(page, `<a> has no accessible name: <a${m[1].slice(0, 60)}>`);
  }
  for (const m of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    if (!named(m[1], m[2])) err(page, `<button> has no accessible name: <button${m[1].slice(0, 60)}>`);
  }

  // --- duplicate ids --------------------------------------------------------
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  const seen = new Set(), dup = new Set();
  for (const id of ids) (seen.has(id) ? dup : seen).add(id);
  for (const d of dup) err(page, `duplicate id="${d}" (breaks aria/label associations)`);

  // --- aria idref targets exist ---------------------------------------------
  for (const m of html.matchAll(/\b(aria-labelledby|aria-describedby|aria-controls)="([^"]+)"/gi)) {
    for (const ref of m[2].split(/\s+/))
      if (ref && !seen.has(ref)) err(page, `${m[1]}="${ref}" points to a missing id`);
  }

  // --- anti-patterns --------------------------------------------------------
  for (const m of html.matchAll(/\btabindex="(\d+)"/gi))
    if (+m[1] > 0) err(page, `positive tabindex="${m[1]}" (disrupts tab order)`);

  // --- skip link (target must exist) ----------------------------------------
  const skip = html.match(/<a[^>]*href="#([^"]+)"[^>]*>(?:(?!<\/a>)[\s\S])*?(?:skip|本文|コンテンツ|メイン)[\s\S]*?<\/a>/i);
  if (!skip) warn(page, "no skip link to main content");
  else if (!seen.has(skip[1]) && !new RegExp(`\\bid="${skip[1]}"`).test(html))
    err(page, `skip link target #${skip[1]} does not exist`);
}

const uniq = (a) => [...new Set(a)];
const E = uniq(errors), W = uniq(warns);
console.log(`\nStatic a11y checks — ${walk(DIST).length} pages\n`);
if (E.length) { console.log(`❌ ERRORS (${E.length}):`); E.forEach((e) => console.log("  - " + e)); }
else console.log("✅ 0 errors");
if (W.length) { console.log(`\n⚠️  WARNINGS (${W.length}):`); W.forEach((w) => console.log("  - " + w)); }
else console.log("✅ 0 warnings");
console.log("\nNote: colour contrast & visible-focus are visual checks, not covered here.\n");
process.exit(E.length ? 1 : 0);
