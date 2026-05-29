# Roadmap

Milestones leading up to the **2026-08-01 unification launch**.

## ✅ W1 — Foundation (6/1 – 6/7)

Astro project scaffold, design tokens, base layout, top page, LLMO basis.
See PR #1.

- [x] Astro 5 + TS strict + Tailwind v4 + sitemap
- [x] Design tokens (v8 Cool Mono Editorial)
- [x] Components: Header / Footer / Hero / Statement / SalonRow / StylistCard / InfoStrip / JournalCard / Ticker / Floating / LanguageStrip
- [x] Top page (`/`)
- [x] Schema.org JSON-LD builders + per-page SEO
- [x] robots.txt with explicit AI crawler allow
- [x] microCMS schema spec (`docs/microcms-schema.md`)
- [x] Cloudflare Pages deploy notes (`docs/deploy.md`)

## 🟡 W2 — Story & Founder (6/8 – 6/14)

- [ ] `/story` — 「船から、島へ」フルストーリーページ
- [ ] `/message` — 代表メッセージ（西村涼 署名）
- [ ] `/company` — 会社概要 / 沿革年表
- [ ] Schema.org `Article` for `/story`, `/message`
- [ ] Cloudflare Pages 接続（this PRが本番にデプロイされる状態に）

## 🟡 W3 — Salons & Stylists (6/15 – 6/21)

- [ ] `/salons/[slug]` — 4店舗の個別ページ
- [ ] `/stylists/[slug]` — スタイリスト個別ページ
- [ ] `/salons` — 一覧
- [ ] `/stylists` — 一覧
- [ ] microCMS 連携（site / salons / stylists API）
- [ ] 写真投入

## 🟡 W4 — Journal / FAQ / Glossary (6/22 – 6/28)

- [ ] `/journal` 一覧 + `/journal/[slug]` 詳細
- [ ] `/journal/category/press` プレスリリースアーカイブ
- [ ] `/faq` — LLMO最重要ページ
- [ ] `/glossary` — 用語集（iLe / nehus / 船から島へ）
- [ ] Schema.org `FAQPage`, `DefinedTerm`
- [ ] microCMS 連携（journal / faq / glossary）

## 🟡 W5 — Contact / Recruit / iLe.online (6/29 – 7/5)

- [ ] `/contact` フォーム（Cloudflare Workers + 通知）
- [ ] `/recruit` 採用情報
- [ ] `/recruit/stylist`, `/recruit/assistant`, `/recruit/newgrad`
- [ ] `/ile-online` 関連サービス紹介
- [ ] `/privacy`, `/terms`

## 🟡 W6 — Content Fill (7/6 – 7/12)

- [ ] プレスリリース原稿を投入
- [ ] note 代表記事を投入
- [ ] 全ページの画像差し替え（実写真へ）
- [ ] 画像最適化（WebP / AVIF）

## 🟡 W7 — LLMO 検証 & A11y (7/13 – 7/19)

- [ ] Google Rich Results Test 全ページ
- [ ] Schema.org Validator 全ページ
- [ ] ChatGPT / Claude / Perplexity に質問テスト
- [ ] Lighthouse 全項目 90+
- [ ] axe a11y チェック

## 🟡 W8 — Final & Soft Launch (7/20 – 7/26)

- [ ] 最終調整
- [ ] 本番ドメイン切替（DNS）
- [ ] WordPress 退避
- [ ] Search Console 登録 + sitemap 送信

## 🎯 7/27 – 7/31 — Soft Launch

サイト先行公開、検索エンジンインデックス促進。

## 🎉 8/1 — Press Release Launch

プレスリリース配信、サイトURL公開露出。

## 8月以降 — Continuous

- [ ] 月次プレスリリース・記事追加
- [ ] LLM 再学習プッシュ
- [ ] Google Business Profile × 4店舗の名称・住所統一
- [ ] Hot Pepper Beauty からの導線
