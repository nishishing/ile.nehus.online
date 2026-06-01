// Auto-generate one SEO/LLMO "column" article for the iLe journal.
//
// Reads a brand brief + a curated SEO-topic list, asks Claude for a
// brand-grounded article as structured JSON, validates it hard, converts the
// Markdown body to HTML, and appends it to src/data/blog-generated.json.
//
// It does NOT commit or publish — the GitHub Action runs `npm run build` and
// `npm run validate` AFTER this, and only commits to main if both pass. So a
// hallucinated/broken article can't reach the live site: it either fails
// validation here or fails the build/validate gate.
//
// Usage:
//   ANTHROPIC_API_KEY=… node scripts/generate-post.mjs            # pick next unused topic
//   INPUT_TOPIC="…" node scripts/generate-post.mjs                # force a topic
//   node scripts/generate-post.mjs --mock                         # no API call (pipeline test)
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { marked } from "marked";

const ROOT = process.cwd();
const BRIEF = join(ROOT, "scripts/brand-brief.md");
const TOPICS = join(ROOT, "src/data/seo-topics.json");
const STORE = join(ROOT, "src/data/blog-generated.json");
const MODEL = "claude-opus-4-8";
const MOCK = process.argv.includes("--mock") || process.env.GENERATE_MOCK === "1";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "column";

function fail(msg) {
  console.error(`generate-post: ${msg}`);
  process.exit(1);
}

// ---- pick a topic ----------------------------------------------------------
const topics = read(TOPICS);
const store = read(STORE);
const usedTopics = new Set(store.map((p) => p.topic).filter(Boolean));
const usedSlugs = new Set(store.map((p) => p.slug));

let chosen;
if (process.env.INPUT_TOPIC && process.env.INPUT_TOPIC.trim()) {
  chosen = { topic: process.env.INPUT_TOPIC.trim(), keywords: [] };
} else {
  chosen = topics.find((t) => !usedTopics.has(t.topic));
}
if (!chosen) {
  // Nothing to do — not an error; the Action sees no file change and skips commit.
  console.log("generate-post: all seed topics already covered — nothing to generate.");
  process.exit(0);
}
console.log(`generate-post: topic = ${chosen.topic}`);

// ---- output schema ---------------------------------------------------------
const schema = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    slug: { type: "string" },
    body_markdown: { type: "string" },
    keywords_used: { type: "array", items: { type: "string" } },
  },
  required: ["title", "description", "slug", "body_markdown", "keywords_used"],
  additionalProperties: false,
};

// ---- get the article (Claude, or a canned mock) ----------------------------
async function generate() {
  if (MOCK) {
    return {
      title: `【テスト】${chosen.topic}`,
      description:
        "これは generate-post の動作確認用に生成されたダミー記事です。ブリーチやハイトーンカラーの考え方を iLe の視点でまとめています。",
      slug: `mock-${slugify(chosen.topic)}-${Date.now().toString(36)}`,
      body_markdown:
        "## はじめに\n\nこれは generate-post のパイプライン検証用に用意したダミー本文です。実際の記事では、ブリーチやハイトーンカラーに関するテーマを iLe の視点でていねいに掘り下げていきます。\n\n## ブリーチの考え方\n\nブリーチは「色を抜く」だけの施術ではなく、数ヶ月先の状態まで見据えた設計が大切だと考えています。髪の状態を見極め、負担を最小限に抑えながらデザインしていきます。\n\n### ポイント\n\n- 履歴を読み解くことから始める\n- 透明感と手触りの両立を目指す\n- 色落ちの過程まで設計する\n\n詳しくは[エフェクトブリーチ](/effect-bleach)のページをご覧ください。仕上がりのご相談は[店舗一覧](/salons)からどうぞ。",
      keywords_used: chosen.keywords ?? [],
    };
  }

  if (!process.env.ANTHROPIC_API_KEY) fail("ANTHROPIC_API_KEY is not set");
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();

  const brief = readFileSync(BRIEF, "utf8");
  const kw = (chosen.keywords ?? []).join("、");

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 12000,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "low",
      format: { type: "json_schema", schema },
    },
    // Stable brand brief first, cached; volatile topic last.
    system: [
      { type: "text", text: brief, cache_control: { type: "ephemeral" } },
    ],
    messages: [
      {
        role: "user",
        content:
          `次のトピックで日本語のコラム記事を1本書いてください。\n\n` +
          `トピック: ${chosen.topic}\n` +
          (kw ? `必ず自然に織り込むSEOキーワード: ${kw}\n` : "") +
          `\n出力は指定のJSONスキーマに従ってください。` +
          `body_markdown は ## / ### の見出しのみ（# は使わない）、本文1,000〜1,600字程度。` +
          `description はメタ説明用に60〜120字。slug は内容を表す英小文字ハイフン区切り。`,
      },
    ],
  });

  const text = response.content.find((b) => b.type === "text")?.text;
  if (!text) fail("model returned no text block (output may have been truncated)");
  try {
    return JSON.parse(text);
  } catch {
    fail("model output was not valid JSON");
  }
}

// ---- validate --------------------------------------------------------------
function validate(a) {
  for (const f of ["title", "description", "slug", "body_markdown"]) {
    if (typeof a[f] !== "string" || !a[f].trim()) fail(`missing/empty field: ${f}`);
    if (/\b(undefined|null)\b/.test(a[f])) fail(`field ${f} contains undefined/null`);
  }
  if (a.description.length < 40 || a.description.length > 160)
    fail(`description length ${a.description.length} out of range (40–160)`);
  if (/^\s*#\s/m.test(a.body_markdown) || /^\s*#[^#]/m.test(a.body_markdown))
    fail("body uses a top-level # heading (must start at ##)");
  if (a.body_markdown.length < 200) fail("body too short");
  // internal links must point at known, real pages
  const allowed = new Set(["/effect-bleach", "/salons", "/stylists", "/menu", "/faq", "/story"]);
  for (const m of a.body_markdown.matchAll(/\]\((\/[^)\s]*)\)/g)) {
    const path = m[1].split("#")[0].replace(/\/$/, "");
    if (!allowed.has(path)) fail(`body links to a non-allowed internal path: ${m[1]}`);
  }
}

// ---- main ------------------------------------------------------------------
const article = await generate();
validate(article);

let slug = slugify(article.slug);
while (usedSlugs.has(slug)) slug = `${slug}-2`;

const now = new Date();
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const publishedAt = now.toISOString().slice(0, 10);
const publishedAtLabel = `${MONTHS[now.getUTCMonth()]} ${now.getUTCDate()}, ${now.getUTCFullYear()}`;

const post = {
  slug,
  category: "column",
  categoryLabel: "COLUMN",
  title: article.title.trim(),
  publishedAt,
  publishedAtLabel,
  summary: article.description.trim(),
  body: marked.parse(article.body_markdown, { async: false }),
  topic: chosen.topic,
  keywords: article.keywords_used ?? chosen.keywords ?? [],
};

store.push(post);
writeFileSync(STORE, JSON.stringify(store, null, 2) + "\n");
console.log(`generate-post: wrote "${post.title}" → /journal/${slug} (${store.length} generated posts total)`);
