/**
 * brandLabel — keep the "iLe" wordmark in its proper mixed case even inside
 * UI labels that are styled `text-transform: uppercase`.
 *
 * Wraps every occurrence of the brand token (iLe / iLe. / iLe.+) in a
 * `<span class="brand-token">` (which has `text-transform: none` in
 * global.css). The exact casing "iLe" only ever appears as the brand, so a
 * global match is safe. Output is HTML — render with `set:html`.
 */
const BRAND_RE = /iLe\.?[+＋]?/g;

export function brandLabel(s: string): string {
  return s.replace(BRAND_RE, (m) => `<span class="brand-token">${m}</span>`);
}
