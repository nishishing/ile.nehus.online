#!/usr/bin/env node
// オープンチャット投稿の下書き → 画像1枚（1080×1080）＋確認用 preview.html
// 使い方: node bcc-beauty/_oc/render.mjs [id ...]   （省略時は drafts/ 全部）
// 出力: _oc/out/<id>.png, _oc/out/preview.html（本文はコピーしやすいようにそのまま並べる）
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const draftsDir = path.join(here, "drafts");
const outDir = path.join(here, "out");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const S = 1080;  // トークの中では正方形がいちばん欠けずに見える

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const bold = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");

// 見た目は Instagram の既存フィードと同じ系統（白＋淡い水色の方眼・太い黒見出し）。BCC の投稿として並びが揃う
const STYLE = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{width:${S}px;height:${S}px;color:#111418;background:#fff;
    background-image:linear-gradient(#e6eff7 1px,transparent 1px),linear-gradient(90deg,#e6eff7 1px,transparent 1px);
    background-size:54px 54px;font-family:'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif;-webkit-font-smoothing:antialiased}
  .card{width:100%;height:100%;padding:70px 76px 56px;display:flex;flex-direction:column}
  .top{display:flex;justify-content:space-between;align-items:center}
  .bcc{font-family:Georgia,serif;font-size:34px;font-weight:700;letter-spacing:.2em}
  .tag{font-size:24px;font-weight:700;letter-spacing:.08em;background:#111418;color:#fff;padding:10px 22px;border-radius:999px}
  .hook{margin-top:58px;font-size:70px;line-height:1.32;font-weight:800;letter-spacing:.01em}
  .hook b{background:linear-gradient(transparent 62%,#bfe0f5 62%)}
  .sub{margin-top:26px;font-size:31px;line-height:1.7;color:#49525e}
  ul{list-style:none;margin-top:40px;border-top:3px solid #111418}
  li{font-size:33px;line-height:1.5;padding:22px 0 22px 44px;position:relative;font-weight:600;border-bottom:1px solid #dbe3ec}
  li:before{content:"";position:absolute;left:0;top:40px;width:22px;height:4px;background:#111418}
  .spacer{flex:1}
  .foot{display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid #dbe3ec;padding-top:22px}
  .svc{font-size:26px;font-weight:700}
  .go{font-size:24px;color:#6b7684;letter-spacing:.04em}
`;

function cardHtml(d) {
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>${STYLE}</style></head><body><div class="card">
  <div class="top"><div class="bcc">BCC</div><div class="tag">${esc(d.tag || "BCC のサービス")}</div></div>
  <h1 class="hook">${bold(d.hook)}</h1>
  ${d.sub ? `<p class="sub">${esc(d.sub)}</p>` : ""}
  ${d.points?.length ? `<ul>${d.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
  <div class="spacer"></div>
  <div class="foot"><div class="svc">${esc(d.service || "")}</div><div class="go">詳しくはトークのリンクから</div></div>
</div></body></html>`;
}

// 書いてはいけないものを機械で止める（ポータル・Instagram と同じ恒久ルール）
function check(d) {
  const all = [d.hook, d.sub, ...(d.points || []), d.text].join("\n");
  const errs = [];
  // 料金は「約」を付けた目安なら書いてよい（オープンチャットだけの例外・2026-10-27 オーナー「料金は約にしましょう」）
  const noApprox = all.replace(/0円開業/g, "").replace(/約[0-9０-９][0-9０-９,，.．]*万?円/g, "");
  if (/無料/.test(all)) errs.push("「無料」が入っています");
  if (/[0-9０-９][0-9０-９,，.．]*万?円/.test(noApprox)) errs.push("料金は「約〇〇円」の目安で書く（実額のままは不可）");
  if (/[Ѐ-ӿ]/.test(all)) errs.push("キリル文字が混ざっています");
  if (!/^https:\/\//m.test(d.text || "")) errs.push("本文にリンクがありません");
  if ((d.points || []).length > 3) errs.push("要点は3つまで（画像で読めなくなる）");
  return errs;
}

const ids = process.argv.slice(2);
const files = fs.readdirSync(draftsDir).filter((f) => f.endsWith(".json"))
  .filter((f) => ids.length === 0 || ids.includes(path.basename(f, ".json"))).sort();
if (!files.length) { console.error("drafts/ に対象の json がありません"); process.exit(1); }
if (!fs.existsSync(CHROME)) { console.error(`Chrome が見つかりません: ${CHROME}`); process.exit(1); }
fs.mkdirSync(outDir, { recursive: true });

const done = [];
let bad = false;
for (const f of files) {
  const d = JSON.parse(fs.readFileSync(path.join(draftsDir, f), "utf8"));
  const id = path.basename(f, ".json");
  const errs = check(d);
  if (errs.length) { console.error(`${id}: ${errs.join(" / ")}`); bad = true; continue; }
  const html = path.join(outDir, `${id}.html`), png = path.join(outDir, `${id}.png`);
  fs.writeFileSync(html, cardHtml(d));
  execFileSync(CHROME, ["--headless", "--disable-gpu", "--hide-scrollbars", `--screenshot=${png}`,
    `--window-size=${S},${S}`, `file://${html}`], { stdio: "ignore" });
  if (!fs.existsSync(png)) throw new Error(`PNG が出ていません: ${id}`);
  done.push({ id, d });
  console.log(`${id}: ${png}`);
}

fs.writeFileSync(path.join(outDir, "preview.html"), `<!doctype html><html lang="ja"><head><meta charset="utf-8"><title>BCC オープンチャット下書き</title><style>
 body{font-family:'Hiragino Kaku Gothic ProN',sans-serif;background:#f2f4f7;color:#111418;margin:0;padding:40px}
 .post{background:#fff;border:1px solid #dbe3ec;border-radius:8px;padding:24px;margin-bottom:24px;display:flex;gap:24px;flex-wrap:wrap}
 img{width:360px;height:360px;border:1px solid #dbe3ec} pre{white-space:pre-wrap;font:inherit;font-size:14px;line-height:1.9;max-width:52ch;margin:0}
 h2{font-size:15px;margin:0 0 10px;color:#6b7684}
</style></head><body><h1>オープンチャット下書き ${done.length} 本</h1>
${done.map(({ id, d }) => `<div class="post"><img src="./${id}.png"><div><h2>${esc(id)}｜おすすめの投稿時刻: ${esc(d.when || "")}</h2><pre>${esc(d.text)}</pre></div></div>`).join("")}
</body></html>`);
if (bad) process.exit(1);
