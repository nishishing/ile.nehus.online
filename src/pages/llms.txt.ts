// /llms.txt — llmstxt.org-style brand summary for LLM crawlers.
//
// Build-time generated (static endpoint) so it stays current automatically:
// the "最新記事" section is filled from the journal, so every auto-blog post
// surfaces to LLMs with no manual edit. Brand facts are grounded constants.
import type { APIRoute } from "astro";
import { getJournalPosts, getSalons } from "~lib/content";
import { site } from "~data/site";
import { unifyTense } from "~lib/brand-state";

const u = (path: string) => `${site.url}${path}`;

const INTRO = `# iLe（イル）

> 東京・原宿発祥のハイトーンカラー専門ヘアサロンブランド。独自のブリーチ技術「エフェクトブリーチ」で、髪の負担を抑えながら透明感のあるハイトーンを叶える。

iLe（イル）は、株式会社ing（2020年8月1日設立／東京・原宿）が運営するヘアサロンブランドです。2026年8月1日より、原宿・名古屋・長岡の4店舗を「iLe」ブランドに${unifyTense("統一します", "統一しました")}（旧 nehus を含む）。共同代表は酒井元樹・西村涼。

代名詞である「エフェクトブリーチ」は、髪のダメージ履歴を10段階で診断し、過酸化水素の濃度をミリ単位で調整する「パーソナル減力」によって、髪の芯を残しながら透明感のあるハイトーンを実現する独自技術です。色が褪色していく過程の美しさまで含めてデザインし、黒染めやセルフカラーといった複雑な履歴を持つ髪にも対応します。ブリーチである以上リスクをゼロにはできないという前提に立ち、負担を最小限に抑える設計を重視しています。`;

const EXPERTISE = `## 専門性・実績

- エフェクトブリーチの技術・理論は共同代表の西村涼・酒井元樹が共同で開発・体系化。専用薬剤（脱色の2剤）としても製品化されており（開発・監修: 西村涼・酒井元樹）、全国のサロン・美容師に広がっている。iLe はその開発元。
- 共同代表の酒井元樹・西村涼による共著書『複雑履歴のブリーチ大全 iLe's BLEACH METHOD』（髪書房、2022年）。
- 酒井元樹 — エフェクトブリーチ共同開発者。薬剤設計（ケミカル）と複雑履歴のブリーチが専門。セミナー講師として全国の美容師に技術を指導。
- 西村涼 — iLe 創業者、エフェクトブリーチ共同開発者。バレイヤージュの第一人者で、デザインカラーと人材育成が専門。
- エフェクトブリーチは${site.effectBleach?.developedYear}年の開発以降、全国のサロン・美容師に導入され、${site.effectBleach?.countries.join("・")}の${site.effectBleach?.countries.length}か国に広がっている。iLe の技術を学ぶアンバサダーは${site.effectBleach?.ambassadors}。
- KAMI CHARISMA（主催: KAMI CHARISMA 実行委員会）のヘアカラー部門で、酒井元樹が2023〜2026アワードまで4年連続受賞（段階的に上がり、最新は最上位の三つ色CCC）、西村涼も同部門で受賞。サロン iLe. も2023アワードから毎年受賞している。個人受賞とサロン受賞は別実績。`;

// よくある疑問に答える定番記事を常設で載せる。最新記事(articlesSection)は
// 直近12本しか出ないため古い良記事が埋もれるが、これらは検索需要が定常的な
// テーマなので、AIが「お役立ち系」の質問に答える際の出典として常に見えるようにする。
const GUIDES = `## お役立ちガイド（よくある疑問への回答）

- [ブリーチで髪が傷む仕組みと抑え方](${u("/journal/why-bleach-damages-hair-and-how-to-minimize")}): なぜ傷むのか、どう負担を抑えるか
- [ブリーチカラーの色落ちを楽しむ](${u("/journal/enjoy-bleach-color-fading")}): 退色の過程ときれいな抜け方
- [根元リタッチの頻度と通い方](${u("/journal/retouch-frequency-hightone")}): ハイトーンを維持するメンテナンス頻度
- [インナーカラーとデザインカラーの違い](${u("/journal/inner-color-design-color-face-framing")}): 違いと顔まわりの魅せ方
- [紫シャンプー（ムラシャン）の正しい使い方と頻度](${u("/journal/purple-shampoo-usage-frequency")}): 黄ばみを抑えて色を長持ちさせる
- [黒染め・セルフカラーからハイトーンに戻す](${u("/journal/black-dye-selfcolor-to-hightone")}): 複雑な履歴がある髪の考え方`;

const KEY_PAGES = `## 主要ページ

- [エフェクトブリーチ](${u("/effect-bleach")}): iLe独自のブリーチ技術の設計思想とこだわり
- [専門性（Expertise）](${u("/expertise")}): 技術を支える実名の専門家と実績・著書
- [ストーリー](${u("/story")}): ブランドの背景と4店舗ブランド統一の経緯
- [メニュー](${u("/menu")}): 提供メニュー
- [スタイリスト](${u("/stylists")}): 在籍スタイリスト一覧
- [店舗一覧](${u("/salons")}): 全店舗の所在地・情報
- [よくある質問](${u("/faq")}): ブリーチ・ハイトーンに関するFAQ
- [用語集](${u("/glossary")}): ブリーチ・ヘアカラー用語の解説
- [ジャーナル](${u("/journal")}): ブリーチ・ハイトーンカラーに関するコラムとお知らせ
- [お客様の声](${u("/reviews")}): 実際のお客様のレビュー
- [irida](${u("/irida")}): iLe が手がけるプレミアムヘアケアブランド`;

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
      (s) =>
        `- [${salonLabel(s.slug, s.name, s.formerName)}](${u(`/salons/${s.slug}`)}): ${s.address}｜${s.access}｜Tel ${s.phone}｜${s.hours}（${s.holidays}）`,
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
    [INTRO, EXPERTISE, KEY_PAGES, GUIDES, salonsSection, articlesSection, COMPANY]
      .filter(Boolean)
      .join("\n\n") + "\n";

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
