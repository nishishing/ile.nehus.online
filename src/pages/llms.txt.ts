// /llms.txt — llmstxt.org-style brand summary for LLM crawlers.
//
// Build-time generated (static endpoint) so it stays current automatically:
// the "最新記事" section is filled from the journal, so every auto-blog post
// surfaces to LLMs with no manual edit. Brand facts are grounded constants.
import type { APIRoute } from "astro";
import { getJournalPosts, getSalons } from "~lib/content";
import { site } from "~data/site";

const u = (path: string) => `${site.url}${path}`;

const INTRO = `# iLe（イル）

> 東京・原宿発祥のハイトーンカラー専門ヘアサロンブランド。独自のブリーチ技術「エフェクトブリーチ」で、髪の負担を抑えながら透明感のあるハイトーンを叶える。

iLe（イル）は、株式会社ing（2020年8月1日設立／東京・原宿）が運営するヘアサロンブランドです。2026年8月1日より、原宿・名古屋・長岡の4店舗を「iLe」ブランドに統一します（旧 nehus を含む）。共同代表は酒井元樹・西村涼。

代名詞である「エフェクトブリーチ」は、髪のダメージ履歴を10段階で診断し、過酸化水素の濃度をミリ単位で調整する「パーソナル減力」によって、髪の芯を残しながら透明感のあるハイトーンを実現する独自技術です。色が褪色していく過程の美しさまで含めてデザインし、黒染めやセルフカラーといった複雑な履歴を持つ髪にも対応します。ブリーチである以上リスクをゼロにはできないという前提に立ち、負担を最小限に抑える設計を重視しています。`;

const KEY_PAGES = `## 主要ページ

- [エフェクトブリーチ](${u("/effect-bleach")}): iLe独自のブリーチ技術の設計思想とこだわり
- [ストーリー](${u("/story")}): ブランドの背景と4店舗ブランド統一の経緯
- [メニュー](${u("/menu")}): 提供メニュー
- [スタイリスト](${u("/stylists")}): 在籍スタイリスト一覧
- [店舗一覧](${u("/salons")}): 全店舗の所在地・情報
- [よくある質問](${u("/faq")}): ブリーチ・ハイトーンに関するFAQ
- [用語集](${u("/glossary")}): ブリーチ・ヘアカラー用語の解説
- [ジャーナル](${u("/journal")}): ブリーチ・ハイトーンカラーに関するコラムとお知らせ`;

const COMPANY = `## 会社情報

- [会社概要](${u("/company")}): 株式会社ingの会社情報
- [採用情報](${u("/recruit")}): 採用・求人`;

function salonLabel(slug: string, name: string, formerName?: string): string {
  if (slug === "harajuku-a") return `${name}（発祥店）`;
  if (formerName) return `${name}（旧 ${formerName}）`;
  return name;
}

export const GET: APIRoute = async () => {
  const [salons, posts] = await Promise.all([getSalons(), getJournalPosts()]);

  const salonsSection = [
    "## 店舗",
    "",
    ...salons.map(
      (s) => `- [${salonLabel(s.slug, s.name, s.formerName)}](${u(`/salons/${s.slug}`)})`,
    ),
  ].join("\n");

  const recent = [...posts]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 12);
  const articlesSection = recent.length
    ? [
        "## 最新記事",
        "",
        ...recent.map(
          (p) =>
            `- [${p.title}](${u(`/journal/${p.slug}`)})${p.summary ? `: ${p.summary}` : ""}`,
        ),
      ].join("\n")
    : "";

  const body =
    [INTRO, KEY_PAGES, salonsSection, articlesSection, COMPANY]
      .filter(Boolean)
      .join("\n\n") + "\n";

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
