#!/usr/bin/env node
// drafts/*.json → カルーセル各面(PNG 1080x1350) と 確認用プレビュー(HTML)
// 使い方: node bcc-beauty/_ig/render.mjs [sid ...]   （省略時は drafts/ 全部）
// 出力: _ig/out/<sid>-1.png … <sid>-N.png（投稿する順）, _ig/out/preview.html
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

const STYLE = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{width:${W}px;height:${H}px;background:#f4f2ec;color:#14130f;
    font-family:'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif;-webkit-font-smoothing:antialiased}
  .card{width:100%;height:100%;padding:96px 88px;display:flex;flex-direction:column;position:relative;overflow:hidden}
  .card.dark{background:#14130f;color:#f4f2ec}
  .mark{position:absolute;right:-40px;bottom:-90px;font-family:Georgia,serif;font-weight:600;
    font-size:420px;line-height:1;color:rgba(20,19,15,.035)}
  .dark .mark{color:rgba(244,242,236,.05)}
  .cat{font-family:Georgia,serif;font-size:26px;letter-spacing:.34em;text-transform:uppercase;color:#8a6f38}
  .cat span{display:block;font-family:inherit;font-size:20px;letter-spacing:.2em;color:#8d897b;margin-top:10px}
  .dark .cat span{color:#a8a496}
  .rule{width:64px;height:1px;background:#8a6f38;margin:36px 0 44px}
  h1{font-size:66px;line-height:1.35;font-weight:600;letter-spacing:.01em}
  h2{font-size:52px;line-height:1.4;font-weight:600;letter-spacing:.01em}
  .lead{margin-top:34px;font-size:30px;line-height:1.85;color:#3a382f;font-weight:400}
  .dark .lead{color:#d6d2c5}
  .body{margin-top:36px;font-size:32px;line-height:1.95;color:#3a382f}
  .num{font-family:Georgia,serif;font-size:96px;line-height:1;color:#8a6f38;font-weight:600}
  .label{margin-top:22px;font-size:24px;letter-spacing:.22em;color:#8d897b}
  ul{list-style:none;margin-top:52px;border-top:1px solid #d6d2c5;padding-top:36px}
  li{font-size:32px;line-height:1.6;padding:22px 0 22px 36px;position:relative;color:#3a382f}
  li+li{border-top:1px solid #e2dfd4}
  li:before{content:"";position:absolute;left:0;top:34px;width:14px;height:1px;background:#8a6f38}
  .spacer{flex:1}
  .cta-note{margin-top:44px;font-size:30px;line-height:1.7;color:#d6d2c5}
  .foot{margin-top:44px;display:flex;justify-content:space-between;align-items:baseline}
  .brand{font-family:Georgia,serif;font-size:30px;letter-spacing:.14em;font-weight:600}
  .foot .small{font-size:19px;letter-spacing:.18em;color:#a8a496;text-transform:uppercase}
  .dark .foot .small{color:#8d897b}
  .pager{font-size:19px;letter-spacing:.18em;color:#a8a496}
`;

// 面ごとの組み方。d=下書き全体, s=その面, i/total=ページ番号
function slideHtml(d, s, i, total) {
  const dark = s.type === "cta";
  const pager = i === 1 ? "SWIPE →" : `${i} / ${total}`;
  const head = s.type === "cover"
    ? `<div class="cat">${esc(d.categoryEn || "")}<span>${esc(d.category || "")}</span></div>
       <div class="rule"></div><h1>${esc(d.title || "")}</h1>
       <p class="lead">${esc(d.lead || "")}</p><div class="spacer"></div>`
    : s.type === "cta"
    ? `<div class="spacer"></div><h2>${esc(s.heading || "")}</h2>
       <p class="cta-note">${esc(s.note || "詳しくはプロフィールのリンクから")}</p><div class="spacer"></div>`
    : `<div class="num">${String(i - 1).padStart(2, "0")}</div>
       <div class="label">${esc(s.label || "")}</div><div class="rule"></div>
       <h2>${esc(s.heading || "")}</h2>
       ${s.body ? `<p class="body">${esc(s.body)}</p>` : ""}
       ${s.items ? `<ul>${s.items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}<div class="spacer"></div>`;
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>${STYLE}</style></head>
<body><div class="card${dark ? " dark" : ""}">
  <div class="mark">${esc((d.categoryEn || "BCC").slice(0, 1))}</div>
  ${head}
  <div class="foot"><div class="brand">BCC</div><div class="small">${esc(d.service || "beauty Cooperative Chain")}</div><div class="pager">${esc(pager)}</div></div>
</div></body></html>`;
}

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
  const slides = d.slides || [];
  if (slides.length < 2) { console.error(`${sid}: slides が2枚未満です（カルーセルになりません）`); process.exit(1); }
  if (slides.length > 10) { console.error(`${sid}: slides が10枚を超えています`); process.exit(1); }
  const pngs = [];
  slides.forEach((s, idx) => {
    const n = idx + 1;
    const html = path.join(outDir, `${sid}-${n}.html`);
    const png = path.join(outDir, `${sid}-${n}.png`);
    fs.writeFileSync(html, slideHtml(d, s, n, slides.length));
    execFileSync(CHROME, ["--headless", "--disable-gpu", "--hide-scrollbars",
      `--screenshot=${png}`, `--window-size=${W},${H}`, `file://${html}`], { stdio: "ignore" });
    if (!fs.existsSync(png)) throw new Error(`PNG が出ていません: ${sid}-${n}`);  // 失敗を成功の顔で通さない
    pngs.push(png);
  });
  done.push({ sid, pngs, d });
  console.log(`${sid}: ${pngs.length}枚 → ${outDir}/${sid}-1..${pngs.length}.png`);
}

const preview = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><title>BCC Instagram 下書き</title><style>
 body{font-family:'Hiragino Kaku Gothic ProN',sans-serif;background:#f4f2ec;color:#14130f;margin:0;padding:48px}
 h1{font-size:22px;letter-spacing:.06em;margin:0 0 8px} .note{color:#8d897b;font-size:14px;margin-bottom:32px}
 .post{background:#fbfaf6;border:1px solid #e2dfd4;border-radius:6px;padding:28px;margin-bottom:28px}
 h2{font-size:16px;margin:0 0 16px;letter-spacing:.04em}
 .strip{display:flex;gap:14px;overflow-x:auto;padding-bottom:10px}
 .strip figure{margin:0;flex:none}
 .strip img{width:260px;height:325px;object-fit:contain;border:1px solid #e2dfd4;background:#fff;display:block}
 .strip figcaption{font-size:11px;letter-spacing:.14em;color:#8d897b;margin-top:6px;text-align:center}
 pre{white-space:pre-wrap;word-break:break-word;font:inherit;font-size:14px;line-height:1.9;background:#fff;
   border:1px solid #e2dfd4;border-radius:4px;padding:16px;margin:18px 0 12px;max-width:70ch}
 .tags{color:#8a6f38;font-size:13px;line-height:1.9}
</style></head><body>
<h1>BCC Instagram — カルーセル下書き ${done.length} 本（${new Date().toLocaleString("ja-JP")}）</h1>
<div class="note">投稿はしていません。画像は左から順に並べてアップロードしてください（1080×1350・4:5）。</div>
${done.map(({ sid, d }) => `<div class="post"><h2>${esc(sid)}　/　${esc(d.category || "")}　/　${d.slides.length}枚</h2>
  <div class="strip">${d.slides.map((_, i) => `<figure><img src="./${sid}-${i + 1}.png" alt="${esc(sid)} ${i + 1}枚目">
    <figcaption>${i + 1}</figcaption></figure>`).join("")}</div>
  <pre>${esc(d.caption || "")}</pre>
  <div class="tags">${esc((d.hashtags || []).join("  "))}</div></div>`).join("")}
</body></html>`;
fs.writeFileSync(path.join(outDir, "preview.html"), preview);
console.log(`preview: ${path.join(outDir, "preview.html")}`);
