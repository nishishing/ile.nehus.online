# Roadmap

Milestones leading up to the **2026-08-01 unification launch**.

## ✅ W1 — Foundation (6/1 – 6/7) — **DONE**

Astro project scaffold, design tokens, base layout, top page, LLMO basis.

- [x] Astro 5 + TS strict + Tailwind v4 + sitemap
- [x] Design tokens (v8 Cool Mono Editorial)
- [x] Components: Header / Footer / Hero / Statement / SalonRow / StylistCard / InfoStrip / JournalCard / Ticker / Floating / LanguageStrip
- [x] Top page (`/`)
- [x] Schema.org JSON-LD builders + per-page SEO
- [x] robots.txt with explicit AI crawler allow
- [x] microCMS schema spec (`docs/microcms-schema.md`)
- [x] Cloudflare Pages deploy notes (`docs/deploy.md`)
- [x] GitHub Actions CI

## ✅ W2 — Story & Founder (6/8 – 6/14) — **DONE**

- [x] `/story` — 「船から、島へ」フルストーリー（4章構成）
- [x] `/message` — 代表メッセージ（西村涼 署名）
- [x] `/company` — 会社概要 / 沿革年表
- [x] Schema.org `Article` for `/story`, `/message`（author=Person/Organization の出し分け）
- [ ] Cloudflare Pages 接続（ユーザー側作業）

## ✅ W3 — Salons & Stylists (6/15 – 6/21) — **DONE**

- [x] `/salons` 一覧
- [x] `/salons/[slug]` 4店舗の個別ページ
- [x] `/stylists` 一覧（店舗別グループ）
- [x] `/stylists/[slug]` スタイリスト個別ページ
- [ ] microCMS 連携（コード準備済み、API設定はユーザー側）
- [ ] 写真投入（ユーザー側）

## ✅ W4 — Journal / FAQ / Glossary (6/22 – 6/28) — **DONE**

- [x] `/journal` 一覧
- [x] `/journal/[slug]` 詳細
- [x] `/faq` — LLMO最重要ページ（9問seed）
- [x] `/glossary` — 用語集（iLe / nehus / 船から島へ等6項目）
- [x] Schema.org `FAQPage`, `DefinedTerm`
- [ ] microCMS 連携（コード準備済み、API設定はユーザー側）

## ✅ W5 — Contact / Recruit / iLe.online (6/29 – 7/5) — **DONE**

- [x] `/contact` — 3チャネル（General / Recruit / Partnership）
- [x] `/recruit` — Stylist / Assistant / New Grad
- [x] `/ile-online` 関連サービス紹介
- [x] `/privacy`, `/terms`
- [ ] Contact フォーム（Workers連携、現在は mailto のみ）

## 🟡 W6 — Content Fill (7/6 – 7/12)

- [ ] プレスリリース原稿を投入（別セッション成果物）
- [ ] note 代表記事を投入
- [ ] 全ページの画像差し替え（実写真へ）
- [x] 画像最適化（WebP / AVIF）— `<Picture>` + `scripts/optimize-images.mjs`
      が public/ の自前JPEGに AVIF/WebP 兄弟を prebuild 生成

## 🟡 W7 — LLMO 検証 & A11y (7/13 – 7/19)

- [ ] Google Rich Results Test 全ページ（外部ツール／ユーザー側）
- [x] SEO/OGP メタ内部検証 — `scripts/validate-seo.mjs`
      (`npm run validate:seo`) を CI に組込。title/description/canonical/OGP/
      twitter card/参照アセット実在/title・canonical重複を検証。0 errors
      （警告=サロン/法務ページの短い説明文＝意図的ブランドコピー、要件次第）
- [x] Schema.org 内部整合チェック 全ページ — `scripts/validate-jsonld.mjs`
      (`npm run validate:jsonld`) を CI に組込。@id参照解決・絶対URL・画像実在・
      日付/パンくず整合・型別必須を検証。現状 0 errors（警告=写真未提供2店）
- [ ] ChatGPT / Claude / Perplexity に質問テスト（"iLe って何？"）
- [ ] Lighthouse 全項目 90+（外部ツール／ユーザー側）
- [x] 静的 a11y チェック — `scripts/validate-a11y.mjs`
      (`npm run validate:a11y`) を CI に組込。lang/title/landmark/見出し階層/
      alt/リンク・ボタンの名前/重複id/aria参照/zoom無効化/skip link を検証。
      0 errors（コントラスト・可視フォーカスは視覚チェックのため対象外）

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

---

## 🚧 Pending — User-side work

Claude が完了させた以降の、運営側でやってもらう必要があるタスク：

### microCMS（コードは準備済み）
- [ ] microCMS アカウント作成
- [ ] `docs/microcms-schema.md` の仕様で API 作成
- [ ] API キー発行（Read 専用）
- [ ] Cloudflare Pages の環境変数に `MICROCMS_SERVICE_DOMAIN`, `MICROCMS_API_KEY` を登録

### Cloudflare Pages（接続）
- [ ] Cloudflare アカウント（無料）
- [ ] GitHub リポジトリと接続
- [ ] `docs/deploy.md` 通りにビルド設定
- [ ] カスタムドメイン `ile-hair-harajuku.com` の DNS 設定

### 素材
- [ ] iLe 公式ロゴ SVG（2026/8/1 統一版）
- [ ] 各店舗のヒーロー写真（フィルム調モノクロ推奨）
- [ ] スタイリスト個別ポートレート
- [ ] OGP デフォルト画像（1200×630）

### コンテンツ確定
- [ ] 各店舗の正確な住所・電話・営業時間・休業日
- [ ] スタイリスト氏名・役職・Instagram ID
- [ ] プレスリリース確定原稿（別セッション成果物）
