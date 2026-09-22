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

const bold = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");  // **ここ** を太字に
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const STYLE = `
  *{box-sizing:border-box;margin:0;padding:0}
  /* 既存フィードに合わせる: 白＋淡い水色の方眼、太い黒見出し（オーナー確定 2026-09-22） */
  body{width:${W}px;height:${H}px;color:#111418;background:#ffffff;
    background-image:linear-gradient(#e6eff7 1px,transparent 1px),linear-gradient(90deg,#e6eff7 1px,transparent 1px);
    background-size:54px 54px;
    font-family:'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif;-webkit-font-smoothing:antialiased}
  .card{width:100%;height:100%;padding:92px 84px;display:flex;flex-direction:column;position:relative}
  .card.dark{background:#111418;background-image:none;color:#ffffff}
  .mark{display:none}
  /* 上部の帯: BCC ワードマーク＋「美容室経営者向け」 */
  .top{display:flex;flex-direction:column;align-items:center;gap:18px}
  .top .bcc{font-family:Georgia,serif;font-size:40px;font-weight:700;letter-spacing:.2em}
  .top .bcc span{display:block;font-size:13px;letter-spacing:.24em;color:#8a93a0;margin-top:6px;font-family:inherit}
  .top .eyebrow{font-size:27px;letter-spacing:.1em;color:#111418}
  .top .eyebrow i{color:#9fb3c8;font-style:normal;padding:0 14px}
  .dark .top .eyebrow{color:#ffffff}
  .dark .top .eyebrow i{color:#5b6672}
  .cat{margin-top:56px;font-size:24px;letter-spacing:.2em;color:#6b7684}
  .cat span{display:none}
  .rule{width:72px;height:3px;background:#111418;margin:28px 0 36px}
  .dark .rule{background:#ffffff}
  h1{font-size:74px;line-height:1.3;font-weight:800;letter-spacing:.01em}
  h2{font-size:58px;line-height:1.36;font-weight:800;letter-spacing:.01em}
  .lead{margin-top:32px;font-size:30px;line-height:1.85;color:#49525e}
  .dark .lead{color:#c9d1da}
  .body{margin-top:32px;font-size:32px;line-height:1.9;color:#49525e}
  .num{font-family:Georgia,serif;font-size:92px;line-height:1;color:#111418;font-weight:700}
  .label{margin-top:18px;font-size:25px;letter-spacing:.16em;color:#6b7684}
  ul{list-style:none;margin-top:48px;border-top:2px solid #111418;padding-top:34px}
  li{font-size:33px;line-height:1.55;padding:24px 0 24px 38px;position:relative;font-weight:500}
  li+li{border-top:1px solid #dbe3ec}
  li:before{content:"";position:absolute;left:0;top:36px;width:18px;height:3px;background:#111418}
  .spacer{flex:1}
  .choose{margin-top:44px;border-top:2px solid #111418}
  .choose .row{padding:30px 0;border-bottom:1px solid #dbe3ec}
  .choose .when{font-size:28px;line-height:1.5;color:#6b7684}
  .choose .pick{margin-top:8px;font-size:38px;line-height:1.35;font-weight:800;color:#111418}
  .choose .pick:before{content:"→ ";font-family:Georgia,serif}
  .cta-note{margin-top:30px;font-size:29px;line-height:1.7;color:#c9d1da}
  .steps{margin-top:54px;border-top:2px solid rgba(255,255,255,.7)}
  .steps .step{display:flex;gap:26px;align-items:baseline;padding:26px 0;border-bottom:1px solid rgba(255,255,255,.18)}
  .steps .no{font-family:Georgia,serif;font-size:30px;color:#ffffff;font-weight:700;flex:none}
  .steps .txt{font-size:29px;line-height:1.6;color:#aeb8c4}
  .steps .txt b{color:#ffffff;font-weight:700}
  .foot{margin-top:40px;display:flex;justify-content:space-between;align-items:baseline;
    border-top:1px solid #dbe3ec;padding-top:24px}
  .dark .foot{border-top-color:rgba(255,255,255,.2)}
  .brand{font-size:24px;letter-spacing:.14em;font-weight:700;color:#6b7684}
  .dark .brand{color:#aeb8c4}
  .foot .small{font-size:22px;letter-spacing:.06em;color:#111418;font-weight:600}
  .dark .foot .small{color:#ffffff}
  .pager{font-size:20px;letter-spacing:.16em;color:#9aa5b1}
`;

// 面ごとの組み方。d=下書き全体, s=その面, i/total=ページ番号
function slideHtml(d, s, i, total) {
  const dark = s.type === "cta";
  const pager = i === 1 ? "SWIPE →" : `${i} / ${total}`;
  const head = s.type === "cover"
    ? `<div class="cat">${esc(d.categoryEn || "")}<span>${esc(d.category || "")}</span></div>
       <div class="rule"></div><h1>${esc(d.title || "")}</h1>
       <p class="lead">${esc(d.lead || "")}</p><div class="spacer"></div>`
    // 最後の面。どのサービスを選ぶか・どう辿り着くかを具体的に置く
    : s.type === "cta"
    ? `<h2>${esc(s.heading || "")}</h2>
       ${s.note ? `<p class="cta-note">${esc(s.note)}</p>` : ""}
       <div class="steps">${(s.steps || []).map((t, n) => `<div class="step"><span class="no">${String(n + 1).padStart(2, "0")}</span><span class="txt">${bold(t)}</span></div>`).join("")}</div>
       <div class="spacer"></div>`
    // 同じカテゴリに複数あるので、迷わないように「条件 → サービス名」で並べる
    : s.type === "choose"
    ? `<div class="label">${esc(s.label || "どれを選ぶ？")}</div><div class="rule"></div>
       <h2>${esc(s.heading || "")}</h2>
       <div class="choose">${(s.pairs || []).map((p) => `<div class="row"><div class="when">${esc(p.when)}</div><div class="pick">${esc(p.pick)}</div></div>`).join("")}</div>
       <div class="spacer"></div>`
    : `<div class="num">${String(i - 1).padStart(2, "0")}</div>
       <div class="label">${esc(s.label || "")}</div><div class="rule"></div>
       <h2>${esc(s.heading || "")}</h2>
       ${s.body ? `<p class="body">${esc(s.body)}</p>` : ""}
       ${s.items ? `<ul>${s.items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}<div class="spacer"></div>`;
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>${STYLE}</style></head>
<body><div class="card${dark ? " dark" : ""}">
  <div class="top">
    <div class="bcc">BCC<span>BEAUTY CO-OPERATIVE CHAIN</span></div>
    <div class="eyebrow"><i>＼</i>美容室経営者向け<i>／</i></div>
  </div>
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
