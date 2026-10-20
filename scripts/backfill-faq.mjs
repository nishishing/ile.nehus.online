// 既存の自動ブログ記事に「よくある質問」3つを後から付ける（2026-10-20 オーナー選択「記事を AI が引用しやすい形に」）。
//
// - 対象は src/data/blog-generated.json のうち faq が無い記事。本文だけを根拠に3問を作らせる
// - 生成ルールと検査は generate-post.mjs と同じ（3問ちょうど・答え30〜260字・リンク禁止・使わない表現の禁止）
// - 1本でも検査に落ちたら、その記事は飛ばして続ける（全体は止めない）。最後に件数を出す
// - 公開はしない。GitHub Actions（backfill-faq.yml）が build と validate を通ったときだけ commit する
//
// 使い方:
//   ANTHROPIC_API_KEY=… node scripts/backfill-faq.mjs            # 全件
//   BACKFILL_LIMIT=5 ANTHROPIC_API_KEY=… node scripts/backfill-faq.mjs   # 先頭から5件だけ
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const BRIEF = join(ROOT, "scripts/brand-brief.md");
const STORE = join(ROOT, "src/data/blog-generated.json");
const MODEL = "claude-opus-4-8"; // generate-post.mjs と揃える
const LIMIT = Number(process.env.BACKFILL_LIMIT || 0);

const banned = /開発元|10段階|ミリ単位|パーソナル減力|フランス語で「?島/;

const schema = {
  type: "object",
  properties: {
    faq: {
      type: "array",
      items: {
        type: "object",
        properties: { question: { type: "string" }, answer: { type: "string" } },
        required: ["question", "answer"],
        additionalProperties: false,
      },
    },
  },
  required: ["faq"],
  additionalProperties: false,
};

function check(faq) {
  if (!Array.isArray(faq) || faq.length !== 3) return `faq must have 3 items (got ${faq?.length})`;
  for (const f of faq) {
    if (typeof f.question !== "string" || f.question.trim().length < 5) return "question too short";
    if (typeof f.answer !== "string" || f.answer.trim().length < 30 || f.answer.length > 260)
      return `answer length ${f.answer?.length}`;
    if (/\]\(|https?:\/\//.test(f.answer)) return "answer contains a link";
    const hit = `${f.question}\n${f.answer}`.match(banned);
    if (hit) return `banned expression: ${hit[0]}`;
  }
  return null;
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("backfill-faq: ANTHROPIC_API_KEY is not set");
  process.exit(1);
}
const { default: Anthropic } = await import("@anthropic-ai/sdk");
const client = new Anthropic();
const brief = readFileSync(BRIEF, "utf8");

const store = JSON.parse(readFileSync(STORE, "utf8"));
const targets = store.filter((p) => !p.faq?.length);
const todo = LIMIT ? targets.slice(0, LIMIT) : targets;
let ok = 0;
const skipped = [];

for (const post of todo) {
  const bodyText = (post.body || "").replace(/<[^>]+>/g, "").slice(0, 6000);
  try {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 4000,
      output_config: { effort: "low", format: { type: "json_schema", schema } },
      system: [{ type: "text", text: brief, cache_control: { type: "ephemeral" } }],
      messages: [
        {
          role: "user",
          content:
            `次のコラム記事を読む人が AI や検索で実際に聞きそうな質問をちょうど3つと、その答えを作ってください。\n` +
            `答えは各80〜160字、本文に書いてあることだけを根拠にし、1文目で問いに直接答える。` +
            `質問は「〜とは？」「〜はどのくらい？」のような自然な問いの形に。` +
            `iLe の数字・受賞・店舗ごとの情報・価格は書かない。リンクや Markdown 記法は使わない。\n\n` +
            `題名: ${post.title}\n要約: ${post.summary ?? ""}\n本文:\n${bodyText}`,
        },
      ],
    });
    const text = res.content.find((b) => b.type === "text")?.text;
    const faq = JSON.parse(text).faq.map((f) => ({ question: f.question.trim(), answer: f.answer.trim() }));
    const err = check(faq);
    if (err) {
      skipped.push(`${post.slug}: ${err}`);
      continue;
    }
    post.faq = faq;
    ok += 1;
    console.log(`backfill-faq: ✓ ${post.slug}`);
  } catch (e) {
    skipped.push(`${post.slug}: ${String(e).slice(0, 120)}`);
  }
}

writeFileSync(STORE, JSON.stringify(store, null, 2) + "\n");
console.log(`backfill-faq: added ${ok} / ${todo.length}（未対応のまま残り ${targets.length - ok}）`);
if (skipped.length) console.log("backfill-faq: skipped\n  " + skipped.join("\n  "));
