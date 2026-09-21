#!/usr/bin/env node
// BCC Instagram — ネタ票を作る（何を・どの角度で出すか まで）
// 使い方: node bcc-beauty/_ig/plan.mjs [本数]   （既定 3本）
// 出力: 標準出力に「ネタ票」。これを Claude に渡して drafts/<sid>.json を書かせる。
// 投稿済みは posted.json（sid → 最終投稿日）で避ける。実際に出した後に記録する。
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));          // 絶対パス固定にしない
const writeups = JSON.parse(fs.readFileSync(path.join(here, "..", "_build", "writeups.json"), "utf8"));
const postedPath = path.join(here, "posted.json");
const posted = fs.existsSync(postedPath) ? JSON.parse(fs.readFileSync(postedPath, "utf8")) : {};

const n = Number(process.argv[2] || 3);
if (!Number.isInteger(n) || n < 1) { console.error("本数は1以上の整数で"); process.exit(1); }

// 古く出したもの・一度も出していないものから順に
const ranked = writeups
  .map((w) => ({ w, last: posted[w.sid] || "" }))
  .sort((a, b) => (a.last || "").localeCompare(b.last || "") || a.w.sid.localeCompare(b.w.sid))
  .slice(0, n);

const RULES = [
  "料金・「無料」は書かない（ポータルと同じ恒久ルール。実額の案内は各サービスの公式LINE側）",
  "サービス提供者の個人名は書かない（会社名・サービス名は可）",
  "断定的な効果の約束はしない（「必ず」「確実に」等）。実績は writeups にある範囲だけ",
  "絵文字は使わない。和文はゴシック（カード側で担保）",
  "本文は300字前後・ハッシュタグは8〜12個・CTAは「詳しくはプロフィールのリンクから」",
];

console.log(`# BCC Instagram ネタ票（${new Date().toISOString().slice(0, 10)}・${ranked.length}本）\n`);
console.log(`## 守ること\n${RULES.map((r) => `- ${r}`).join("\n")}\n`);
for (const { w, last } of ranked) {
  console.log(`---\n## sid: ${w.sid}　（前回: ${last || "未投稿"}）`);
  console.log(`- 概要: ${(w.overview || "").replace(/\s+/g, " ")}`);
  for (const s of w.sections || []) {
    const bullets = (s.bullets || []).slice(0, 6)
      // 金額の入った素材は「出さない」と分かる形で渡す（そのまま書き写す事故を防ぐ）
      .map((b) => (/[0-9０-９][^。]*円|無料/.test(b) ? `【価格・投稿に書かない】${b}` : b));
    console.log(`- ${s.heading}: ${bullets.join(" / ")}`);
  }
  console.log(`- 出力先: bcc-beauty/_ig/drafts/${w.sid}.json`);
}
console.log(`\n---\n## drafts/<sid>.json の形\n` + JSON.stringify({
  sid: "<sid>", category: "<日本語カテゴリ>", categoryEn: "<英字ラベル>",
  title: "カード見出し・20字前後", lead: "カードの小見出し・35字前後",
  bullets: ["カードの要点1・24字以内", "要点2", "要点3"],
  caption: "本文（投稿キャプション）", hashtags: ["#美容師", "…"],
}, null, 2));
