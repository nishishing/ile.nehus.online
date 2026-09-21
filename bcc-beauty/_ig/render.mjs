#!/usr/bin/env node
// drafts/*.json → 投稿カード(PNG 1080x1350) と 確認用プレビュー(HTML)
// 使い方: node bcc-beauty/_ig/render.mjs [sid ...]   （省略時は drafts/ 全部）
// 出力: _ig/out/<sid>.png, _ig/out/preview.html （out/ はコミットしない）
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const draftsDir = path.join(here, "drafts");
const outDir = path.join(here, "out");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const W = 1080, H = 1350;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const card = (d) => `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>
  @page{margin:0}
  *{box-sizing:border-box;margin:0;padding:0}
  body{width:${W}px;height:${H}px;background:#f4f2ec;color:#14130f;
    font-family:'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif;-webkit-font-smoothing:antialiased}
  .card{width:100%;height:100%;padding:96px 88px;display:flex;flex-direction:column;position:relative}
  .mark{position:absolute;right:-40px;bottom:-90px;font-family:Georgia,serif;font-weight:600;
    font-size:420px;line-height:1;color:rgba(20,19,15,.035);letter-spacing:.02em}
  .cat{font-family:Georgia,serif;font-size:26px;letter-spacing:.34em;text-transform:uppercase;color:#8a6f38}
  .cat span{display:block;font-family:inherit;font-size:20px;letter-spacing:.2em;color:#8d897b;margin-top:10px}
  .rule{width:64px;height:1px;background:#8a6f38;margin:36px 0 44px}
  h1{font-size:66px;line-height:1.35;font-weight:600;letter-spacing:.01em}
  .lead{margin-top:34px;font-size:30px;line-height:1.8;color:#3a382f;font-weight:400}
  ul{margin-top:auto;list-style:none;border-top:1px solid #d6d2c5;padding-top:40px}
  li{font-size:30px;line-height:1.6;padding:20px 0 20px 34px;position:relative;color:#3a382f}
  li+li{border-top:1px solid #e2dfd4}
  li:before{content:"";position:absolute;left:0;top:32px;width:14px;height:1px;background:#8a6f38}
  .foot{margin-top:44px;display:flex;justify-content:space-between;align-items:baseline}
  .brand{font-family:Georgia,serif;font-size:30px;letter-spacing:.14em;font-weight:600}
  .foot .small{font-size:19px;letter-spacing:.18em;color:#a8a496;text-transform:uppercase}
</style></head><body><div class="card">
  <div class="mark">${esc((d.categoryEn || "BCC").slice(0, 1))}</div>
  <div class="cat">${esc(d.categoryEn || "")}<span>${esc(d.category || "")}</span></div>
  <div class="rule"></div>
  <h1>${esc(d.title || "")}</h1>
  <p class="lead">${esc(d.lead || "")}</p>
  <ul>${(d.bullets || []).map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
  <div class="foot"><div class="brand">BCC</div><div class="small">beauty Cooperative Chain</div></div>
</div></body></html>`;

const sids = process.argv.slice(2);
const files = fs.readdirSync(draftsDir).filter((f) => f.endsWith(".json"))
  .filter((f) => sids.length === 0 || sids.includes(path.basename(f, ".json")));
if (files.length === 0) { console.error("drafts/ に対象の json がありません"); process.exit(1); }
if (!fs.existsSync(CHROME)) { console.error(`Chrome が見つかりません: ${CHROME}`); process.exit(1); }
fs.mkdirSync(outDir, { recursive: true });

const done = [];
for (const f of files) {
  const d = JSON.parse(fs.readFileSync(path.join(draftsDir, f), "utf8"));
  const sid = d.sid || path.basename(f, ".json");
  const html = path.join(outDir, `${sid}.html`);
  const png = path.join(outDir, `${sid}.png`);
  fs.writeFileSync(html, card(d));
  execFileSync(CHROME, ["--headless", "--disable-gpu", "--hide-scrollbars",
    `--screenshot=${png}`, `--window-size=${W},${H}`, `file://${html}`], { stdio: "ignore" });
  if (!fs.existsSync(png)) throw new Error(`PNG が出ていません: ${sid}`);  // 失敗を成功の顔で通さない
  done.push({ sid, png, d });
  console.log(`${sid}: ${png} (${fs.statSync(png).size} bytes)`);
}

// 確認用プレビュー（画像と本文を並べて、人が見て判断するためのもの）
const preview = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><title>BCC Instagram 下書き</title><style>
 body{font-family:'Hiragino Kaku Gothic ProN',sans-serif;background:#f4f2ec;color:#14130f;margin:0;padding:48px}
 h1{font-size:22px;letter-spacing:.06em;margin:0 0 8px} .note{color:#8d897b;font-size:14px;margin-bottom:32px}
 .row{display:flex;gap:32px;background:#fbfaf6;border:1px solid #e2dfd4;border-radius:6px;padding:28px;margin-bottom:28px}
 img{width:360px;height:450px;object-fit:contain;border:1px solid #e2dfd4;background:#fff}
 .body{flex:1;min-width:0} h2{font-size:16px;margin:0 0 12px;letter-spacing:.04em}
 pre{white-space:pre-wrap;word-break:break-word;font:inherit;font-size:14px;line-height:1.9;background:#fff;
   border:1px solid #e2dfd4;border-radius:4px;padding:16px;margin:0 0 14px}
 .tags{color:#8a6f38;font-size:13px;line-height:1.9}
</style></head><body>
<h1>BCC Instagram — 下書き ${done.length} 本（${new Date().toLocaleString("ja-JP")}）</h1>
<div class="note">投稿はしていません。出すものだけ選んでください。画像は 1080×1350（4:5）。</div>
${done.map(({ sid, d }) => `<div class="row">
  <img src="./${sid}.png" alt="${esc(sid)}">
  <div class="body"><h2>${esc(sid)}　/　${esc(d.category || "")}</h2>
  <pre>${esc(d.caption || "")}</pre>
  <div class="tags">${esc((d.hashtags || []).join("  "))}</div></div></div>`).join("")}
</body></html>`;
fs.writeFileSync(path.join(outDir, "preview.html"), preview);
console.log(`preview: ${path.join(outDir, "preview.html")}`);
