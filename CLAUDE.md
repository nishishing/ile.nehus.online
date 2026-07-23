# CLAUDE.md — Project handover

> **Read this file first when starting a new Claude Code session on this repo.**
> It captures the full design and implementation context built up over the
> previous session, so you can continue without re-litigating decisions.

> 🧭 **横断的な「決まったこと」は `claude-config` の決定ログ + Notion「🧭 決定ログ」DB（data_source `3a312a42-37b7-447b-9bac-456d8e63bc2f`）を参照。** このリポ固有の設計判断は本ファイルに残す。

---

## TL;DR

This repo is the source for **iLe**'s official website
(<https://ile-hair-harajuku.com>), launching **2026-08-01** when the parent
company (**株式会社ing**) unifies its four salons under the single iLe brand
("船から、島へ" — *from a ship, to an island*).

The site is built as a **static Astro 5 + Tailwind v4** project deployed via
**Cloudflare Workers Static Assets**. Design system = **v8 "Cool Mono
Editorial"** (cool grayscale only). All pages emit Schema.org JSON-LD so
LLMs (ChatGPT, Claude, Perplexity, Google AI Overviews) can correctly
learn and cite the brand.

**Current state:** W1-W7 complete + a full **real-content pass** (2026-05-31):
real salon NAP, the actual 32-person staff roster, the co-representative
model, and an Effect Bleach section are all live in the data. Staging is at
`https://ile.boku-244.workers.dev`. Production domain **not yet switched**
(still legacy WordPress on ConoHa WING). What's left before launch is mostly
**assets** (photos / logo / OGP) + microCMS + DNS.

> **⚠️ KEEP THIS FILE CURRENT.** Whenever you change site content, data,
> structure, or conventions, update CLAUDE.md in the *same* change. See
> "Maintenance convention" at the bottom. The user has explicitly asked for
> this — treat it as a standing requirement.

---

## Mission (1-liner)

公式サイトを、2026年8月1日のリブランド「船から島へ」に合わせて、LLMO（LLM
最適化）を最大限組み込んだ形で設計・構築する。**期日：2026年7月末までに
先行公開、8月1日のプレスリリース配信と連動。**

---

## Brand context (memorise this)

- **iLe** (イル / île) — French for "island". Founded 2020-08-01 in Harajuku.
- **nehus** (ネハス) — coined word meaning "ship". Brand used for the three
  satellite salons (Harajuku 2nd location, Nagoya, Nagaoka) before unification.
- **「船から、島へ」** — the canonical brand phrase. The boats put out from the
  original Harajuku island reached new shores, took root, and became islands
  themselves. So now all are iLe.
- **2026-08-01** — 7th anniversary; the day all four salons rename to iLe.
- **共同代表 (Co-Representatives)**: 酒井 元樹 (Sakai Motoki) ＆ 西村 涼
  (Nishimura Ryo). **Publicly the company is led by two co-reps.**
  (Internally 酒井 is effectively the company head, but that is NOT public —
  so on the site, ALWAYS say 共同代表, never a sole 代表取締役.)
  - 酒井 元樹 — **エフェクトブリーチ開発者** / ケミカルの権威.
  - 西村 涼 — バレイヤージュ第一人者 / 創業者. Authors the /message & /story.
  - **エフェクトブリーチは薬剤（脱色の2剤＝オキシ）として製品化されており、
    その開発・監修は酒井・西村の両名**（オーナー確認 2026-07-03）。全国の
    サロン・美容師にも広がっている＝iLe は「開発元」。技術・理論（10段階診断
    /パーソナル減力）の開発・体系化は従来どおり酒井のクレジット。メーカー名・
    販売元は未確認のためサイトに書かない。
- **Company**: 株式会社ing (ing inc.) — HQ in 東京都渋谷区神宮前
- **Contact**: <ile.ing801@gmail.com>
- **Instagram (brand)**: `ile.801` (https://instagram.com/ile.801)
- **Domain**: `ile-hair-harajuku.com` (current Cloudflare staging:
  `https://ile.boku-244.workers.dev`)

The 4 salons (after unification) — **real NAP confirmed 2026-05-31**, all
年中無休 (no regular holiday):

| # | slug | Name | Former | Address | Tel | Hours |
|---|---|---|---|---|---|---|
| 01 | `harajuku-a` | iLe 原宿 (origin) | — | 〒150-0001 渋谷区神宮前6-10-8 原宿NAビル4F | 03-6427-5235 | 10–20 |
| 02 | `harajuku-b` | iLe 原宿 B | nehus | 渋谷区神宮前3-20-13 MANA表参道2F | 03-6447-0253 | 10–20 |
| 03 | `nagoya` | iLe 名古屋 | nehus 名古屋 | 〒460-0008 名古屋市中区栄3-19-7 PROTECT4 4F | 052-228-9783 | 10–20 |
| 04 | `nagaoka` | iLe 長岡 | nehus 長岡 | 〒940-2106 長岡市古正寺1-246-3 | 0258-77-6236 | 9–19 |

Each salon also has `access` (nearest stations) and a `hotPepperUrl`
(booking) in `src/data/salons.ts`. Opened: 01=2020-08 / 02=2022 /
03=**2025-11** / 04=**2025-03** (長岡 opened *before* 名古屋 — corrected by
owner 2026-06-12; the old 2023/2024 values were wrong); 02–04 rename to iLe
on 2026-08-01.

---

## Tech stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Astro 5** (SSG) | Best CWV, easy Schema.org control |
| Language | TypeScript strict | Type safety |
| Styling | **Tailwind CSS v4** via `@tailwindcss/vite` | `@theme` directive + per-component `<style>` |
| Content | **microCMS** (planned) / static `src/data/*` (current) | Japanese-friendly headless CMS |
| Hosting | **Cloudflare Workers Static Assets** (NOT Pages) | Modern unified Cloudflare flow |
| Wrangler | `wrangler.jsonc` with `assets.directory = "./dist"` | No worker script needed |
| Sitemap | `@astrojs/sitemap` | Auto |
| CI | GitHub Actions (`.github/workflows/ci.yml`) | check + build on every PR/push |

**Important — DO NOT** switch to `@astrojs/cloudflare` adapter or SSR. The
site is intentionally pure static; the Cloudflare deploy is a Static Assets
Worker (no JS runtime). Keep it that way unless there's a concrete need.

**Why Astro 5, not 6**: tried Astro 6 first, hit a rolldown ↔
`@tailwindcss/vite` incompatibility (`Missing field tsconfigPaths on
BindingViteResolvePluginConfig.resolveOptions`). Downgraded to Astro 5.13+.
Don't bump back to 6 until that issue is resolved upstream.

---

## Design system — **v8 "Cool Mono Editorial"**

We iterated through v1 → v8 (see "Design history" below). **v8 is the
final and accepted direction.** Do not revisit color or layout direction
without explicit user approval.

### Palette (cool grayscale only, no warm tones)

```
SNOW      #F4F5F6   page background
PEARL     #ECEDEF   alt-section background
MIST      #DCDEE2   light borders
ASH       #9CA0A6   subtle text
SLATE     #5B5E64   secondary text
CHARCOAL  #2A2C30   hero / footer
INK       #16171A   primary text / dark sections
WHITE     #FFFFFF
```

Defined in `src/styles/global.css` as Tailwind v4 `@theme` tokens.

### Typography

```
--font-display  Libre Caslon Text   (display serif)
--font-body     Instrument Sans      (geometric sans)
--font-mono     Questrial            (small caps / labels)
--font-jp       Noto Sans JP         (Japanese)
```

Use uppercase + wide letter-spacing for `nav`, `eyebrow`, and section
labels. Italics in Libre Caslon Text are used for brand keywords
(*ship*, *island*, *est.*, etc.).

### Texture

- Subtle SVG noise overlay on the page background (`body::before`) for
  paper-like depth, **cool only** (no warm tint).
- A stronger noise overlay on every photo placeholder for film grain.
- **Do NOT add** scanlines, chromatic aberration, VT323-style fonts, or
  any other "Y2K CSS effects". They were tried in v5 and explicitly
  rejected. Y2K warmth must come from the real photographs/video supplied
  for production, not from CSS distortion.

### Reference sites

- **Naitlovy** (<https://naitlovy.co.jp>) — design language model for
  structure (Shopify Stiletto theme). v6/v7/v8 inherit its
  Hero → Slideshow → Tabbed-list → Two-panels → Carousel → Journal →
  Ticker → CTA → Footer layout.
- **LOA OIL** (<https://jade-japan.com/loa/ambassador/>) — large-mono
  statement headlines + left-photo/right-spec rows + ambassador floating
  CTA. v8 borrows these patterns.

---

## Repository structure

```
.
├── .github/workflows/ci.yml   GitHub Actions (check + build)
├── astro.config.mjs           Astro config (Tailwind, sitemap)
├── wrangler.jsonc             Cloudflare Workers Static Assets config
├── package.json
├── tsconfig.json              Path aliases ~/ ~components ~lib etc.
├── public/
│   ├── robots.txt             AI crawler explicit allow (15+ bots)
│   └── favicon.svg
├── src/
│   ├── styles/global.css      Tailwind v4 + @theme tokens
│   ├── lib/
│   │   ├── seo.ts             Page title / canonical / OG helpers
│   │   ├── schema.ts          ALL Schema.org JSON-LD builders
│   │   └── microcms.ts        Client stub, env-gated
│   ├── types/content.ts       Content type contracts (== microCMS schema)
│   ├── data/                  Static content (until microCMS connects)
│   │   ├── site.ts            Company / co-reps / nav / languages
│   │   ├── salons.ts          4 salons — real NAP, access, tel, hours, 年中無休
│   │   ├── stylists.ts        Real roster: 32 staff (2 co-reps + 16 stylists + 14 assistants)
│   │   ├── journal.ts         Seed posts
│   │   ├── faq.ts             23 LLMO-critical Q&A (brand / salon / access / technique / recruit)
│   │   └── glossary.ts        16 DefinedTerm entries (iLe / nehus / 船から島へ / 酒井元樹 / 西村涼 / エフェクトブリーチ / パーソナル減力 / バレイヤージュ / ハイライト / ケアブリーチ / 白髪ぼかし / インナーカラー / ダブルカラー / …)
│   ├── components/            Astro components
│   ├── layouts/BaseLayout.astro
│   └── pages/                 content pages (see "Pages shipped")
├── public/
│   ├── robots.txt  favicon.svg/.ico  site.webmanifest
│   └── .well-known/security.txt
└── docs/
    ├── microcms-schema.md     Operator-facing API spec
    ├── microcms-setup.md      Operator step-by-step (microCMS導入)
    ├── dns-launch.md          Operator step-by-step (DNS切替+Search Console)
    └── deploy.md              Cloudflare Pages legacy notes
```

### Path aliases

```ts
~/*           → src/*
~components/* → src/components/*
~layouts/*    → src/layouts/*
~lib/*        → src/lib/*
~types/*      → src/types/*
~data/*       → src/data/*
```

---

## Pages shipped (57 built pages)

| Route | Schema.org | Notes |
|---|---|---|
| `/` | Organization + WebSite + Person + 4× HairSalon + Breadcrumb | Top, v8 |
| `/effect-bleach` | **Service + DefinedTerm + Breadcrumb** | iLe signature technique; **LLMO-critical** |
| `/menu` | Breadcrumb | Price guide (cut / bleach&color); real prices |
| `/technology` | Breadcrumb | 3 pillars: Effect Bleach / Layer Cut / Hair Esthe |
| `/reviews` | Breadcrumb | お客様の声 (carried-over testimonials) |
| `/story` | Article | "船から、島へ" 4-chapter editorial (西村, 共同代表) |
| `/message` | Article (author=Person) | 西村's signed message (共同代表) |
| `/company` | Breadcrumb | Overview + Timeline; lists both co-reps |
| `/salons` | 4× HairSalon | Real NAP / tel / hours |
| `/salons/[slug]` | HairSalon (telephone, openingHoursSpecification) | 4 salons |
| `/stylists` | Breadcrumb | Grouped by salon |
| `/stylists/[slug]` | Person | **32 generated**; Person → worksFor → HairSalon |
| `/journal` + `/journal/[slug]` | Breadcrumb / Article | seed posts |
| `/faq` | **FAQPage** | 23 Q&A — brand / salon (初めて・メンズ含む) / **access** (原宿/名古屋/長岡の最寄駅) / **technique** (バレイヤージュ・ケアブリーチ・色落ち・白髪ぼかし・大人世代 等) / recruit。冒頭にカテゴリのジャンプindex |
| `/glossary` | **DefinedTerm** | iLe / nehus / 船から島へ / 酒井元樹 / 西村涼 / エフェクトブリーチ / パーソナル減力 / バレイヤージュ / ハイライト / ケアブリーチ / 白髪ぼかし / インナーカラー / ダブルカラー / iLe.online / … |
| `/irida` | **Brand + Product + Breadcrumb** | 自社プレミアムヘアケア「Irida（イリーダ）」。Bonding Plex シャンプー&トリートメント等。購入は STORES（`https://ileing.stores.jp`）。footer nav に IRIDA |
| `/recruit` | **3× JobPosting + Breadcrumb** | 作り込み済（2026-07-03）+ **実給与データ掲載（2026-07-04、オーナー提供の採用資料より）**: 統計バンド / Why iLe 3本柱 / iLe Academy 節 / **給与セクション**（東京・名古屋と長岡の歩合テーブル、完全歩合+最低保証、最高月収 スタイリスト180万・アシスタント50万）/ **福利厚生・休日**（国保・厚生年金・店販手当・月8〜10休 等12項目）/ 職種3件 / 応募の流れ / CTA。JobPosting description・jobBenefits にも反映 |
| `/contact` `/ile-online` `/privacy` `/terms` | Breadcrumb | |
| `/404` | (noindex) | Custom 404; Cloudflare serves it via `not_found_handling` |

`sitemap-index.xml` is auto-generated (404 / manifest / security.txt excluded).

---

## LLMO playbook (核となる差別化)

1. **Site-wide JSON-LD** (`Organization`, `WebSite`) emitted from
   `src/components/BaseHead.astro`. Every page also emits its own
   page-specific Schema (Article / HairSalon / Person / FAQPage / etc.)
   via `src/lib/schema.ts` builders.
2. **`public/robots.txt`** explicitly allows the AI bot list:
   GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-Web,
   anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended,
   Applebot-Extended, CCBot, cohere-ai, Meta-ExternalAgent,
   Meta-ExternalFetcher, Bytespider, plus Googlebot/Bingbot.
3. **`/faq`** is written so each answer can be quoted verbatim by an LLM
   answering "iLe って何？" / "What is nehus?" etc. Keep answers concise
   and self-contained.
4. **`/glossary`** is the canonical place for term definitions. Each item
   emits a `DefinedTerm` JSON-LD. When adding new terms, follow the same
   format: `term`, `pronunciation`, `definition`, optional `etymology`.
5. **Per-page `<title>`, `description`, canonical, OGP, Twitter** — all
   handled by `BaseHead.astro` + `src/lib/seo.ts`.

When adding a new page, always:
- Pass `title` and `description` to `<BaseLayout>` (don't omit).
- Add a `breadcrumbSchema(...)` at minimum.
- Add a page-specific Schema if the page represents a thing (Article,
  Person, Organization, Event, etc.) — use builders in `~lib/schema`.

---

## Deployment

- Pushes to `main` → Cloudflare auto-deploys via the `nishishing/ile.nehus.online`
  Workers project owned by Boku.244@gmail.com.
- Staging URL: `https://ile.boku-244.workers.dev`
- Production domain (`ile-hair-harajuku.com`) **not yet** switched.
  Currently still pointing at the legacy WordPress on ConoHa WING.
- Plan: switch DNS on or shortly before 2026-07-27 for soft launch.

See `docs/deploy.md` for the legacy Pages flow notes (now superseded by
the Workers Static Assets flow we actually used).

---

## What still needs the user (operator-side work)

> **📊 TODO — Web Analytics 有効化（2026-07-02 実装済・トークン待ち）。**
> コードは `PUBLIC_CF_BEACON_TOKEN` があるときだけ Cloudflare Web Analytics の
> beacon を出す（BaseLayout）。有効化はどちらか:
> ① **推奨**: Cloudflare ダッシュボード → アカウントの **Analytics & Logs →
> Web Analytics → Add a site** で `ile-hair-harajuku.com` を追加 → 発行された
> JS スニペットの `token` 値をコピー → Workers のビルド設定（Settings →
> Variables and Secrets）に `PUBLIC_CF_BEACON_TOKEN` として追加 → 再デプロイ。
> ② プロキシ済みドメインなら同画面の automatic setup（自動注入）でも可（この場合
> env 変数は不要・コード側は何も出さないまま）。

> **📌 TODO — awaiting operator photos (add when supplied; per owner, "later").**
> These couldn't be auto-sourced: HPB had no clean shot and Instagram is
> login-walled / rate-limited from CI. Drop the files in and wire as noted —
> reuse the same `sharp` pipeline (see Changelog commits) so the cool-mono
> treatment stays consistent.
> - ~~**Salon interiors — harajuku-a + nagoya.**~~ ✅ DONE 2026-06-13 — all 4
>   salons now have owner-supplied interiors (`public/salons/*.jpg`, 1600×680
>   grayscale). harajuku-b / nagaoka were also replaced with the owner's photos.
> - **Staff portraits — 7 missing** (`inoe-mizuki`, `horibe-mihana`,
>   `fukutani-amane`, `kawahara-ichika`, `yukimatsu-hisa`, `tanogami-yoshiho`,
>   `yokoyama-ichika`). Grayscale, 600×750 top-anchored, save
>   `public/staff/<slug>.jpg`, then add
>   `portrait: { url, width: 600, height: 750 }` to each in
>   `src/data/stylists.ts`.
> - **Effect Bleach before/after** — still open. (real OGP ✅ done 2026-06-15 —
>   branded `public/og-default.jpg` from the real Harajuku hero photo + boxed
>   mark + 「船から、島へ」, via `scripts/generate-og.mjs`. iLe logo ✅ done
>   2026-06-13 — boxed "iLe." mark, see `BrandMark.astro`; hero photo ✅ done.)

1. **Real assets** — remaining: Effect Bleach before/after photos.
   ✅ **Done 2026-06-13**: iLe logo (boxed mark, header/footer/favicon/JSON-LD),
   homepage hero photo, and all **4 salon interiors** (owner-supplied).
   **Provisional assets still in place** (replace when real ones land):
   - **Salon interiors**: ✅ 4/4 — all salons have an owner-supplied interior in
     `public/salons/<slug>.jpg` (1600×680 grayscale), shown as a full-bleed band
     under the salon hero + fed to LocalBusiness `image`. (harajuku-b / nagaoka's
     earlier HPB photos were replaced by the owner's on 2026-06-13.)
   - **Staff portraits**: 25/32 staff have photos pulled from the salon's
     own **Hot Pepper Beauty** pages, self-hosted in `public/staff/<slug>.jpg`,
     downsampled + **grayscaled** (`sharp`) to fit cool-mono. 7 have no HPB
     photo yet (nehus-原宿/iLe-原宿/名古屋 assistants without an HPB photo) —
     left as gradient placeholder. (`shimizu-mizuki` appears on HPB as「今井
     瑞希」— confirmed same person.)
   - **Style gallery**: `/effect-bleach` Works section shows 12 real colour
     works from the salons' HPB style galleries, self-hosted in
     `public/gallery/`, given a **low-saturation cool grade** (cool-mono *lean*
     that keeps the colour legible — colour is the product) + ImageGallery
     JSON-LD. Swap freely; the grade is one `modulate` param.
   - **OGP**: ✅ real branded `public/og-default.jpg` (1200×630) — the real
     Harajuku hero photo (grayscale) + boxed iLe. mark + 「船から、島へ」+
     原宿・名古屋・長岡. Regenerate via `node scripts/generate-og.mjs`.
   - In-page photo placeholders (salons, gallery) are cool-grayscale
     gradients with a CSS film-grain overlay — replace preserving that tone.
2. **microCMS** — account + APIs per `docs/microcms-schema.md`. Then set
   `MICROCMS_SERVICE_DOMAIN` and `MICROCMS_API_KEY` in Cloudflare env vars
   and swap `src/data/*.ts` consumers to `src/lib/microcms.ts`.
3. **DNS** — Cloudflare custom domain setup + ConoHa WING DNS switch
   (planned on/around 2026-07-27). This is the moment the public site flips.
4. **Effect Bleach specifics** — confirm pricing (current = carried-over
   guide), refine the technical wording, supply before/after photos.
5. **Business委託 (2)** — currently omitted from the public roster
   (西小野 隼輝 = back-office; 高橋 雄太 = 長岡 業務委託). Decide if either
   should appear.

✅ **Done in the 2026-05-31 pass:** salon NAP / tel / hours / 年中無休,
the 32-person roster, co-rep model, Instagram `ile.801`, Effect Bleach
section. `ROADMAP.md` tracks the week plan.

---

## Conventions / DO NOT

- **Do not introduce a chromatic accent color.** Cool grayscale only.
  Even subtle warmth (cream, beige, sand) was tried in v7 and rejected.
- **Do not use** `@astrojs/cloudflare` adapter, SSR, or any server-side
  features. Pure SSG.
- **Do not add** CSS effects like scanlines, chromatic aberration,
  VT323-style pixel fonts. They were tried in v5 and rejected.
- **Do not** push directly to `main`. Use a feature branch + PR. (The sole
  exception is the `auto-blog` workflow, which the owner chose to auto-publish
  to `main` — gated behind a passing build + `npm run validate`.)
- **Do not** create files without a clear reason (no scratchpad docs,
  no design notes, no TODO lists unless asked).
- **Do not** revisit settled design decisions (palette, fonts, structure)
  without explicit user approval.
- **Use `~components/Picture.astro`** (not a bare `<img>`) for self-hosted
  photos, so they get AVIF/WebP. Add the source `.jpg` under
  `public/{staff,salons,gallery}` — derivatives are generated automatically.
- **Always** verify with `npm run check` + `npm run build` before committing.
- **Always** commit messages should be specific and scoped (see existing
  history for the style).

---

## Design history (why decisions are where they are)

For future reference if any pixel decisions are questioned:

- **v1** — Poetic / warm sand `#C9B58E` accent on near-white. User rejected:
  too clean, "美容室っぽくない."
- **v2** — Industrial stainless with 4 accent options. User picked PURE
  (grayscale-only direction) but liked v1's design.
- **v3** — v1 design + grayscale palette. User found it "綺麗すぎて美容室
  っぽくない" → wanted museum/art-catalog feel.
- **v4** — Museum/catalog vocabulary (PLATE numbers, vertical Japanese,
  chapter Roman numerals, marginalia, specimen cards). Got accepted-ish
  but user then asked for "Y2K noise feel."
- **v5** — Stacked Y2K CSS effects (scanlines, chromatic aberration,
  VT323 timecodes, REC indicator). **Rejected** — user wanted to lean
  closer to reference sites (naitlovy / jade-japan).
- **v6** — Naitlovy-structured layout in stark pure mono. User: "monochrome
  感が強い" (too harsh).
- **v7** — Warmer cream/beige palette to soften v6. **Rejected** —
  user wanted white/black/cool-grey, not warm.
- **v8** — Cool grayscale only + Naitlovy structure + LOA OIL flourishes
  (large statement headline, salon detail rows, info strip, floating
  ambassador-style CTA). **ACCEPTED — this is the final direction.**

Lesson learned: Y2K warmth comes from the **photographs themselves**
(styling, film grain in the shot, color grading) — not from CSS distortion
effects. CSS stays clean.

---

## Branch & PR convention

- Feature branches: `claude/<descriptor>`. PRs open against `main` as
  **draft**, rebased on merge to keep history linear.
- After pushing, always open a draft PR; merge only when the user confirms.
- Merged so far: #1 (W1-W5), #2 (CLAUDE.md), microCMS/W7/a11y PRs (#5),
  pre-launch hardening (#6), the real-content pass (#7), Effect-Bleach
  integration (#8). Subsequent work (image optimization W6, JSON-LD/SEO/a11y/
  link validators W7-W8, auto-blog pipeline, llms.txt) landed via later feature
  branches — see the Changelog below for the authoritative per-change record.

---

## Data sources (operator's Notion — "🤖 Claude 秘書 HQ")

The authoritative staff data lives in the Notion **"👥 スタッフmaster"**
database (data source `collection://7459ce52-3436-4225-a246-b663a86916e7`).
`src/data/stylists.ts` was generated from its 在籍 (active) rows.

- **Public fields only** were copied: 氏名 → `nameJa`, ローマ字 (from フリガナ)
  → `name`, 所属店舗 → `salonSlug` (iLe原宿→harajuku-a, nehus原宿→harajuku-b,
  名古屋→nagoya, 長岡→nagaoka), 職位/役割 → `position` (現場責任者→「店長」),
  得意分野 → `specialties`, Instagram ID → `instagram`.
- **NEVER publish** the master's sensitive fields: 売上・面談・生年・歩合率・
  課題・備考 (備考 can contain health notes). These must not reach the repo/site.
- Effect Bleach copy was sourced from the **legacy site**
  (`/effect-bleach`, `/ile-technology`, `/menu`, `/reviews`) + public refs
  (co-authored book 『複雑履歴のブリーチ大全』). Pricing is a carried-over guide.

---

## Quick commands

```sh
# install
npm install

# dev server (localhost:4321)
npm run dev

# type-check (must pass before commit)
npm run check

# production build (writes to ./dist)
npm run build

# preview production build
npm run preview

# deploy to Cloudflare (Cloudflare CI does this automatically on push to main)
npm run deploy   # or: npx wrangler deploy
```

---

## What to do at session start

1. Read this file.
2. `git status && git log --oneline -10` to see current state.
3. Ask the user what they want next, or pick up the most recent
   `ROADMAP.md` open item.
4. Stay quiet, stay scoped, ship.

---

## Maintenance convention (KEEP CLAUDE.md CURRENT)

The user has asked that this file be kept up to date whenever things change.
**This is a standing requirement, not a one-off.**

- When you change site **content, data, structure, pages, conventions, or
  brand facts**, update the relevant section of CLAUDE.md *in the same
  commit/PR* as the change. Don't leave it for "later".
- Add a one-line entry to the **Changelog** below for any notable change
  (newest first), with the date.
- Keep it accurate over comprehensive: fix anything that has become wrong
  (e.g. stale counts, names, or "still pending" items that are now done).

> Note: this is a model-followed working practice, not an automated hook
> (a shell hook can't meaningfully rewrite prose). It persists because it
> lives here and every session reads this file first.

### Changelog

- **2026-07-23** — URL の trailing-slash 統一（オーナー承認済み）: `wrangler.jsonc` の
  `assets.html_handling` を `auto-trailing-slash` → **`drop-trailing-slash`** に変更。
  Astro は `trailingSlash: "never"`・canonical/sitemap も末尾スラッシュなしなのに、
  Workers 既定挙動が `/faq` → `/faq/` に 307 していた不一致を解消（`/faq` を直接 200 で
  配信、`/faq/` は `/faq` へ1ホップ）。wrangler dev で /・/faq・/faq/・llms.txt を検証。

- **2026-07-23** — AI定点観測（7/20実測: 出現率44%/引用率9%）のNGクエリ対策で llms.txt＋FAQ を補強:
  (1) `llms.txt.ts` に「## 専門性・実績」セクション新設（開発元・共著書・両代表の肩書。
  ambition系クエリ「バレイヤージュ第一人者は誰？」等の対策）＋店舗一覧に NAP
  （住所/アクセス/Tel/営業時間）を展開（ローカル系クエリ対策）＋主要ページに
  /expertise /reviews /irida を追加。(2) FAQ +2問（計26問）: access に「表参道エリア
  からも通えますか？」（iLe.＋= MANA表参道の立地。「表参道 ハイトーン」系クエリ未出現
  対策）、technique に「『傷まないブリーチ』はありますか？」（ゼロにできない前提の
  正直な回答＝ブランドスタンス。「髪を傷ませないブリーチ」「ダメージレス」系クエリ対策）。
  check 0／build 102 pages／4バリデータ 0エラー。

- **2026-07-04** — 新卒採用を一旦締切表示に＋名古屋/長岡の店名を英語表記に（オーナー指示）:
  (1) /recruit の新卒採用は **2026-06-30 で一旦締切** — カードは「締切」バッジ＋案内文
  （次期募集はページ/Instagram で告知）に切替、応募ボタン非表示、**JobPosting JSON-LD からも
  除外**（募集中はスタイリスト/アシスタントの2件のみ）。再開時は positions の `closed: false` へ。
  (2) `salons.ts` の表示名を `iLe. 長岡`→`iLe. nagaoka` / `iLe. 名古屋`→`iLe. nagoya`
  （n は小文字、B2B告知の表記と統一）。`nameLatin`/seoDescription は据え置き。

- **2026-07-04** — /recruit に実給与・福利厚生を掲載（オーナー提供の採用資料スクショより）:
  **給与セクション**（東京・名古屋 / 長岡 の2カード: スタイリスト完全歩合の歩合テーブル
  30〜40%＋店販10%・最低保証あり、アシスタント基本給+歩合 30〜50%/長岡20〜50%、
  最高月収バンド 180万/50万）＋**福利厚生・休日セクション**（12項目 pill + 月8〜10休/
  夏季冬季休暇/有給）。JobPosting JSON-LD の description・jobBenefits にも同データを反映。
  職種の待遇行は #compensation へのアンカーに。数値は資料の実データのみ・推測なし。
  check 0／build 89 pages／4バリデータ 0エラー。

- **2026-07-03** — 「エフェクトブリーチ＝iLe が開発元」を全面打ち出し（オーナー回答:
  市販の専用オキシは酒井・西村の開発監修製品）: (1) /effect-bleach リードに「薬剤として
  製品化・全国に展開・iLe は開発元」段落 (2) glossary 定義拡張 (3) FAQ +1問「iLe 以外でも
  受けられる？」（薬剤は全国、技術体系は開発元の iLe） (4) brand-brief に確定事実追加
  （メーカー名は書かない縛り付き） (5) 開発元解説コラム `what-is-effect-bleach-by-developer`
  （「エフェクトブリーチとは」検索面の奪還が狙い。パーソナル減力記事へ内部リンク）。
  build 89 pages／4バリデータ 0エラー。

- **2026-07-03** — SEOコラム +1本（オーナー指示・AI定点観測の未出現クエリ対策）:
  「パーソナル減力」解説記事 `what-is-personal-genryoku`（`blog-generated.json`）。初回のAI
  visibility 実測で「パーソナル減力というブリーチの考え方」に未出現だったため、glossary の
  DefinedTerm と整合する自己完結の定義段落＋10段階診断/ミリ単位減力/断毛防止を brand-brief
  準拠で執筆（ダメージ「ゼロにはできない」明記・価格なし）。内部リンク /effect-bleach /salons。
  build 88 pages／4バリデータ 0エラー。

- **2026-07-03** — /recruit 作り込み（オーナー指示）: 旧・簡素な3職種リストから全面リビルド。
  構成 = Intro（次の島を、あなたと。＋統計バンド 2020/4 salons/3 cities/32 members）→
  店舗内観の full-bleed band → **Why iLe 3本柱**（①エフェクトブリーチ開発元・共著書・
  セミナー講師 ②6年で4店舗＋2026統合=挑戦の余白 ③3都市同基準）→ **iLe Academy**（ink 背景の
  Education 節）→ **Open Positions 3職種**（応募資格/勤務地/待遇=面談で、mailto 応募ボタン、
  職種別 subject）→ 応募の流れ 3step → CTA（見学だけでも歓迎）。**JobPosting JSON-LD ×3**
  （hiringOrganization→#organization、jobLocation=4店舗実住所、applicationContact、
  directApply。給与は schema にも本文にも載せない）。brand-brief 準拠＝給与・福利厚生等の
  未確定情報は一切捏造せず「面談時に説明」で統一。Playwright で desktop/mobile 実機確認済。
  check 0／build 87 pages／4バリデータ 0エラー。
- **2026-07-02** — サイト点検フォローアップ5点（オーナー指示「すべてお願いします」）:
  (1) **スマホ用ハンバーガーメニュー** — `Header.astro` に mobile 専用のメニューボタン＋
  フルスクリーンオーバーレイナビ（navPrimary + BOOK、ink 背景、Esc/リンククリックで閉、
  `aria-expanded`/`aria-controls`、scroll lock）。≤768px でナビ非表示だった問題を解消。
  あわせて **LanguageStrip をモバイル非表示に**（JP 以外は coming-soon の飾りでリンク無し、
  メニューボタンのタップを横取りしていた）＋ desktop も `pointer-events:none`（リンクのみ auto）。
  (2) **8/1 統合の告知バー** — 新規 `AnnounceBar.astro`（fixed 最上部、`--announce-h:34px` を
  global.css で定義し Header/LanguageStrip がオフセット）。press 記事
  `/journal/press-release-2026-08-01-unification` へリンク。**8/1 以降は撤去（または文言差替）+
  `--announce-h:0px`**。
  (3) **Cloudflare Web Analytics（env-gated）** — BaseLayout が `PUBLIC_CF_BEACON_TOKEN`
  設定時のみ beacon script を出力。⚠️ 有効化はオーナー作業（下の operator 節参照）。
  (4) **Journal 一覧カードにサムネ** — `JournalCard` が `eyecatch ?? ogImage` を `Picture` で表示
  （hover ズーム、無い記事は従来のグラデ。ホームの Journal セクションにも波及）。
  (5) **Contact にアドレスコピー** — `data-copy-email` ボタン（clipboard API、✓フィードバック、
  mailto 不動作な PC 環境向け）。全て Playwright 実機確認済（メニュー開閉/Esc/ナビゲーション/
  コピー動作/desktop 非表示）。check/build 86 pages/4バリデータ 0エラー。
- **2026-06-27** — Journal 記事にアイキャッチ画像対応（オーナー指示「ブログに写真を」）:
  `journal/[slug].astro` で `post.eyecatch`（MicroCMSImage、既存の型フィールド）を `Picture` で
  PageHero 直下にフルブリード表示（`eyecatchAlt`→alt、未設定なら従来どおり非表示）。`articleSchema` は
  既に `eyecatch.url` を JSON-LD image に使うため AI 露出にも寄与。irida コラムに **Bonding Plex の
  シャンプー＆トリートメント2点を並べた合成ヒーロー**（`public/irida/journal-bonding-plex.jpg`、
  1600×1000、`sharp` で dark cool-mono 合成）を設定。全 journal 記事で再利用可能。build 82 pages／
  4バリデータ 0エラー。
- **2026-06-27** — SEOコラム +1本（オーナー指示）: irida のシャンプー＆トリートメント記事
  `irida-bonding-plex-shampoo-treatment`（`blog-generated.json`、計23本）。Bonding Plex S&T の
  考え方・使い方（シャンプー単体はトリートメント併用推奨）・サロンケアとの組合せを brand-brief 準拠で執筆
  （価格・医療断定なし）。内部リンクは `/irida` `/effect-bleach`。BlogPosting JSON-LD・llms.txt・Journal・
  ホーム Floating に自動反映。build 82 pages／4バリデータ 0エラー。
- **2026-06-27** — 自社ブランド **Irida（イリーダ）** ページ新設（オーナー指示）: 新規
  `/irida`（プレミアムヘアケア）。Brand + Product JSON-LD（Brand→parentOrganization→#organization、
  Bonding Plex S&T を Product として offers ¥5,500/JPY/InStock）。フラッグシップ **Bonding Plex
  シャンプー&トリートメント**（左右写真の feature 行・配合成分 BAOBAB/ARGAN/OLIVE LEAF・
  「シャンプー単体はボンディング処方で硬く感じる場合→トリートメント併用推奨」の注記）＋
  Lineup（repair milk / moist oil / silky oil 等、実価格）＋ STORES（`https://ileing.stores.jp`）への
  購入導線。商品写真2点はオーナー支給画像を `sharp` で低彩度クールグレード（`public/irida/*.jpg`、
  `optimize-images.mjs` の DIRS に `irida` 追加）。**ブランド表記は小文字「irida」**（ロゴ準拠）—
  ヒーロー/ヘッダー/フッターは `brand-token` span（`text-transform:none`）で大文字化を打ち消し、
  uppercase ナビ内でも小文字を維持（`brandLabel` と同じ仕組み）。**主ナビ（STYLISTS の隣）+ footer nav に
  irida** を追加（Header/404 のラベルを `set:html` 化）。cool-mono 準拠。build 81 pages／4バリデータ 0エラー。
- **2026-06-16** — ヒーロー調整（オーナー指示）: (1) 中央ロゴをやや縮小
  （`clamp(240px,40vw,460px)` → `clamp(170px,30vw,360px)`）。(2) **スマホでヒーロー写真の
  ズームを解消** — 横長写真を縦長 100vh に cover すると中央が大きく切れて“ズームしすぎ”に
  見えるため、`@media(max-width:768px)` で `.hero` を height:auto＋写真を `aspect-ratio:16/10`
  の横長バンド表示（全景が見える）に。モバイルのロゴも `clamp(140px,34vw,220px)` に。
  デスクトップは従来のフルブリードのまま。build 70 pages／4バリデータ 0エラー。
- **2026-06-15** — 実OGP（ブランドOGP画像）を作成: `public/og-default.jpg`（1200×630）を
  実素材ベースに刷新。実写のヒーロー写真（夜の原宿の交差点・グレースケール）＋スクリム＋枠付き iLe. マーク。
  **英字「FROM A SHIP, TO AN ISLAND」を主役**にし（サイト本体が英字 display 主体のため）、
  和文「船から、島へ。」は小さめの上品なキャプションに（環境に IPAGothic しか無く、大きい
  和文ゴシックは野暮ったいため）。下部に HARAJUKU・NAGOYA・NAGAOKA＋ドメイン。再生成は
  `node scripts/generate-og.mjs`（sharp）。
  全ページの og:image / twitter:image に反映。build 70 pages／4バリデータ 0エラー。
- **2026-06-15** — SEOコラム +3本（ローカル/カラー）＋ /menu・/technology 内部リンク補強:
  (1) **コラム3本（計12本）**: 名古屋でブリーチが得意なサロンの選び方／長岡でブリーチカラーを
  楽しむ／グレージュとは？（原宿に続きローカルSEOを名古屋・長岡へ拡張。確定NAPの範囲で店舗に言及）。
  brand-brief 準拠・許可パスのみ内部リンク。topic は seo-topics と一致。
  (2) **/menu** と **/technology** に関連リンク pill（Effect Bleach / 技術 / メニュー /
  スタイリスト / FAQ / 声）を追加し回遊性を改善。build 70 pages／4バリデータ 0エラー。
- **2026-06-15** — コンテンツ拡充3点（SEOコラム＋内部リンク＋運用手順書）:
  (1) **SEOコラム +3本（計9本）** を手動執筆（`blog-generated.json`）: ブリーチ後の
  ホームケア／ブリーチあり・なしの違い／根元リタッチの頻度。いずれも brand-brief 準拠
  （価格・医療断定なし、許可パスのみ内部リンク）。BlogPosting JSON-LD・llms.txt・Journal・
  ホーム Floating に自動反映。topic 文字列は seo-topics と一致させ auto-blog 重複回避。
  (2) **内部リンク強化＋/reviews・/story 厚み増し**: `salons/[slug]` のリードに関連リンク
  （Effect Bleach/メニュー/スタイリスト/FAQ）の pill を追加。`/story` に技術＋店舗一覧への
  橋渡し段落＆リンク。`/reviews` に事実ベースの導入文＋関連リンク（捏造の声は追加せず実声のみ）。
  (3) **運用手順書2本**: `docs/microcms-setup.md`（microCMS導入の操作ガイド）と
  `docs/dns-launch.md`（本番ドメインのDNS切替＋Search Console＋sitemap送信＋ロールバック）。
  check 0／build 67 pages／4バリデータ 0エラー（内部リンクも 0 broken）。
- **2026-06-15** — ホームの STYLISTS 欄にも共同代表バンドを追加（オーナー指示）:
  `/stylists` と同様に、トップページのスタイリストセクション先頭へ「/ 00
  Co-Representatives — iLe」（西村 涼・酒井 元樹）を表示（`index.astro` の
  `reps`）。各店舗グループからは従来どおり除外。build 64 pages／4バリデータ 0エラー。
- **2026-06-15** — /salons の店舗写真を横長に（オーナー指示）: `SalonRow` の写真を
  ポートレート `4 / 5` → ホームの SalonCard と同じ **横長 `16 / 10`** に変更。横長の
  内観写真がポートレートに切り詰められて不自然だった問題を解消。
- **2026-06-15** — /stylists 最上部に共同代表バンドを追加（オーナー指示）: 西村 涼・
  酒井 元樹の2名を「/ 00 Co-Representatives — iLe」セクションとしてサロン別グループの
  **上**に独立表示（`stylists/index` の `reps = position==="共同代表"`）。各店舗ロスター
  からは従来どおり除外。build 64 pages／4バリデータ 0エラー。
- **2026-06-15** — スタッフカードのサロン名をブランドのみに＋「＋」を全角化（オーナー指示）:
  (1) **StylistCard のサロン名はブランドトークンのみ**（`nameLatin.split(" ")[0]`）＝
  `iLe.`／`iLe.＋` を表示し、地名（HARAJUKU 等）は出さない。グループ見出しに店舗＋地名が
  あるため重複を解消。(2) **`iLe.+` の「+」を全角「＋」に**（`salons.ts` harajuku-b の
  `name`/`nameLatin`/`seoDescription`）。`lib/brand.ts` の `BRAND_RE` を `[+＋]` 対応に。
  build 64 pages／4バリデータ 0エラー。
- **2026-06-15** — 店名・ブランド表記の全ページ統一＋スタッフ並び替え（オーナー指示）:
  (1) **原宿の2店舗の表示名から「原宿」を除去** — `iLe. 原宿`→`iLe.`／`iLe.+ 原宿`→`iLe.+`
  （`salons.ts` の `name`。location はサブ見出し/住所で表示）。`nameLatin`（`iLe. Harajuku`等）は
  SEO/曖昧性回避のため維持。`SalonCard`/`SalonRow` は area を条件付き描画に。
  (2) **ブランドワードマークを全ページで「iLe」（大文字 ILE にしない）** — `src/lib/brand.ts`
  の `brandLabel()` が `iLe`/`iLe.`/`iLe.+` を `<span class="brand-token">` でラップし、
  `global.css` の `.brand-token{text-transform:none}` で大文字化を打ち消す。`text-transform:
  uppercase` のラベル内でもブランドだけ正しい casing になる（周囲の地名は大文字のまま）。
  適用: StylistCard サロン名／stylists・home のグループ見出し／salon 詳細ヒーロー（`PageHero`
  の `title`、eyebrow も `set:html` 化）／salon 詳細「Stylists at …」／stylist 詳細の eyebrow・
  リンク／Footer（`iLe.ONLINE`）。
  (3) **スタッフ一覧で写真のないスタッフを各店舗の最後尾に整列**（`stylists/index` と home の
  グループで `portrait` 有無の安定ソート）。check 0／build 64 pages／4バリデータ 0エラー。
- **2026-06-15** — 店舗カードの表記修正（オーナー指示）: (1) **`iLe.+` の表記は
  原宿の第2店舗のみ**に統一 — 長岡・名古屋は `iLe.+ → iLe.`（`salons.ts` の
  `name`/`nameLatin`/`seoDescription`）。東京＝`iLe. 原宿`＋`iLe.+ 原宿`の2店舗、
  長岡・名古屋＝`iLe.`。`formerly nehus` バッジは据え置き（事実なので）。
  (2) **店名の `text-transform: uppercase` を撤去**（`SalonCard`/`SalonRow`/
  `salons/[slug]` の name）→ ブランドは大文字「ILE.」ではなく **「iLe.」** で表示。
  （詳細ページの PageHero は Latin 名の全大文字見出しのため据え置き）。
  (3) **ホームの `SalonCard` に住所（`address`）行を追加**（SalonRow・詳細ページは
  既出）。build 63 pages／4バリデータ 0エラー。
- **2026-06-15** — ヒーロー中央ロゴを拡大（オーナー要望）: `Hero.astro` の
  中央 `BrandMark` を `size={150}` → `size={210}` に。フルブリードの 100vh
  ヒーローに対して旗艦ブランドマークが小さく見えたため。ヘッダー(46)/フッター(56)は据え置き。
- **2026-06-15** — LLMO コンテンツ拡充 第2弾 ＋ UI 仕上げ: (1) **SEOコラム1本**
  を手動執筆し `blog-generated.json` に追記（`choosing-harajuku-bleach-salon`
  「原宿でブリーチが得意なサロンの選び方」/ keywords: 原宿 ブリーチ 等。ローカル
  SEO×LLMO の核。BlogPosting JSON-LD・llms.txt・Journal・ホーム Floating に自動反映、
  計5コラム）。topic 文字列が seo-topics と一致するため auto-blog の重複選択も回避。
  (2) **FAQ +5問（計23問）**: salon に「初めてブリーチ」「メンズ利用可否」、**access
  カテゴリ新設**（原宿/名古屋/長岡の最寄駅、`salons.ts` の access と整合）、technique に
  「30〜40代の大人世代」。`faq.astro` の categories に `access` 追加。(3) **glossary
  +3語（計16語）**: 白髪ぼかし／インナーカラー／ダブルカラー。(4) **UI仕上げ**: FAQ
  冒頭に**カテゴリのジャンプindex**（pill 型アンカー `#faq-<id>`＋`scroll-margin-top`、
  validate:links の in-page anchor 検証も通過）／**主ナビ（`navPrimary`）に
  「EFFECT BLEACH」を追加**（旗艦 LLMO ページがフッターのみだったのを解消、desktop の
  flex nav に1項目追加、mobile は従来どおり nav 非表示）。check 0 error／build 63 pages／
  4バリデータ 0エラー。
- **2026-06-14** — LLMO コンテンツ拡充（FAQ / glossary）: 確定事実の範囲内で
  AI が引用しやすい一次情報を増補。(1) **FAQ に「技術（Technique）」カテゴリ新設**
  ＋7問追加（バレイヤージュとは／バレイヤージュ vs ハイライト／エフェクトブリーチ
  vs ケアブリーチ／ブリーチのダメージ＝“ゼロにはできない”と明記しつつ最小化を説明／
  黒染め・縮毛矯正など複雑履歴対応／色落ち設計／白髪ぼかし）。`faq.astro` の
  categories に `technique` を追加（番号は index 駆動で自動採番）、meta description も
  技術を含むよう更新。FAQPage JSON-LD に自動反映（計18問）。(2) **glossary に
  DefinedTerm を5語追加**（パーソナル減力／バレイヤージュ／ハイライト／ケアブリーチ／
  iLe.online、計13語）。価格・受賞・医療効果の断定は brand-brief のルール通り不記載。
  check 0 error／build 62 pages／4バリデータ 0エラー。
- **2026-06-13** — ホームページ仕上げ（実素材投入）: (1) ヒーローの開発用
  プレースホルダー文言を実キャプション「*est.* 2020 — Harajuku, Tokyo」に差替。
  (2) **ブランド実ロゴ**（枠付き「iLe.」）を導入 — 新規 `BrandMark.astro`
  （Questrial・`currentColor`）をヘッダー/フッターに、`public/logo.svg`（JSON-LD）
  と `favicon.svg` も枠付きマークに。(3) **ヒーロー実写真**（夜の原宿交差点）を
  全画面に組込（`public/hero/harajuku.jpg`、`<Picture>` eager、スクリム＋グレイン）。
  `optimize-images.mjs` に `hero` ディレクトリ追加。(4) **4店舗の内観写真**を
  オーナー支給に差替/新規（`public/salons/*.jpg` 1600×680 grayscale、harajuku-a /
  nagoya は新規で `heroImage` 追加、harajuku-b / nagaoka は差替）→ 写真なし店舗の
  JSON-LD 警告も解消。check/build/4バリデータ 0エラー。
  > 運用メモ: オーナーがチャットに貼った画像は transcript JSONL
  > (`/root/.claude/projects/-home-user/<session>.jsonl`) に base64 で残るため、
  > そこから実ファイルに復元して `sharp` 加工できる（最大~2000pxで取得可）。
  > Drive 共有リンク経由DL（`drive.google.com/uc?export=download&id=`）も可。
  > Drive MCP は当セッションでは承認が通らなかった。
- **2026-06-12** — 開店年の訂正（オーナー指摘）: 長岡＝**2025年3月**・名古屋＝
  **2025年11月**（旧データの 2023/2024 は誤り。開店順も 長岡→名古屋 に逆転）。
  `salons.ts` `openedAt`（JSON-LD foundingDate / est. 表示）、`/company`
  タイムライン、`/story` III章、glossary「nehus」定義を修正。
- **2026-06-12** — E-E-A-T 外部裏付け（Web検証済みURLを反映）: 共著
  『複雑履歴のブリーチ大全 iLe's BLEACH METHOD』の書誌を確定（**髪書房**刊・
  2022-04-08発売・ISBN 4908697507・出版社ページ + Amazon URL）→ `site.book` に
  集約し `authoredBooksSchema()` が publisher/datePublished/isbn/url/sameAs ＋
  両代表を author に出力（西村にも `authoredBook` 追加）。各代表 Person に
  `sameAs`（Instagram: @sakaimotoki / @nishishing ＋ HPB スタイリストページ）と
  `subjectOf`（QJナビ・inborn・HAIRCAMP・b-ex palette 等の第三者記事/登壇）を
  追加（organizationSchema 経由で全ページ展開）。`/expertise` に 共著書セクション
  （出版社/Amazonリンク）・メディア掲載セクション・各人のプロフィール/掲載リンクを
  追加。⚠️ `nishishing.xyz` は売出し中のパークドメインと判明 — リンク禁止。
  受賞歴は検証可能なソースが見つからず未掲載（盛らない方針）。check/build/
  4バリデータ 0エラー。
- **2026-06-12** — E-E-A-T 専門性ページ + Person/Organization 権威付け: 新規
  `/expertise`（共同代表＝酒井元樹『エフェクトブリーチ開発者・ケミカル』／
  西村涼『創業者・バレイヤージュ』、共著『複雑履歴のブリーチ大全』、技術の体系）。
  `organizationSchema` に組織 `knowsAbout` と各 founder Person の `description`/
  `knowsAbout`/`worksFor` を追加（全ページに展開）。`authoredBooksSchema()` で
  Book→author(@id #rep-sakai) を /expertise に出力。`site.representatives` に
  `bio`/`knowsAbout`/`authoredBook` を追加、footer に EXPERTISE。AIに「ブリーチ／
  バレイヤージュの権威」として認識させる土台。check/build/4バリデータ 0エラー。
- **2026-06-11** — Auto-blog cadence → 平日毎日 (5x/week): cron `0 0 * * 1,3,5`
  → `0 0 * * 1-5` (Mon–Fri). Balanced SEO×LLMO point — daily-ish freshness
  without "thin mass content" risk (≤1/day). `seo-topics.json` expanded 20 → 56
  brand-relevant topics (~11 weeks of runway at 5/week). Context: Cloudflare's
  production branch was also corrected to `main` this day, so the backlog of
  auto-blog commits finally went live.
- **2026-06-11** — Auto-blog: LINE notification on every run + Actions bump.
  `auto-blog.yml` now sends a LINE push (✅ published w/ title+URL / ℹ️ no-op /
  ❌ failure w/ run URL) via the LINE Messaging API push endpoint on every run
  (`if: always()`), gated on optional secrets `LINE_CHANNEL_ACCESS_TOKEN` +
  `LINE_TO` (skips silently if unset). The commit step now exposes
  `published/title/slug` outputs. Also bumped `actions/checkout`,
  `setup-node`, `upload-artifact` to v5 in both workflows (clears the Node20
  deprecation). Context: the 2026-06-10 run failed because the Anthropic
  credit balance hit zero — failures are loud by design (no broken article
  published); operator must keep credits topped up (Auto Reload recommended).
- **2026-06-01** — Self-updating LLMO/structured-data pass: (1) `articleSchema`
  now emits `BlogPosting` (not `Article`) for `category:"column"` posts, with
  `keywords` + `articleSection` — auto-applies to every current/future auto-blog
  article. (2) `llms.txt` moved from a static file to a build-time endpoint
  (`src/pages/llms.txt.ts`) that auto-lists the latest journal posts from
  `getJournalPosts()`, so new auto-blog articles surface to LLMs with no manual
  edit. Both verified: build green, all 4 validators 0 errors.
- **2026-06-01** — `llms.txt` (llmstxt.org): curated brand summary +
  links for LLMs (ChatGPT/Claude/Perplexity), grounded in confirmed facts.
  Complements the AI-crawler-allow `robots.txt` and the auto-blog for LLMO.
  (Now generated dynamically — see entry above.)
- **2026-06-01** — Auto-blog pipeline: Claude-generated SEO/LLMO "column"
  articles, auto-published. `scripts/generate-post.mjs` (Anthropic TS SDK,
  `claude-opus-4-8`, structured `json_schema` output, brand brief cached) picks
  the next unused topic from `src/data/seo-topics.json`, grounds the article in
  `scripts/brand-brief.md` (confirmed facts + hard "do not invent" rules),
  validates it, and appends to `src/data/blog-generated.json` (merged into
  `getJournalPosts()` as `category:"column"`). `.github/workflows/auto-blog.yml`
  runs it weekly + on-demand and **only commits to main if `npm run build` +
  `npm run validate` pass** — so a hallucinated/broken article can't reach the
  live site. New `JournalCategory` value `"column"`; deps `@anthropic-ai/sdk`,
  `marked`. ⚠️ Needs repo secret **`ANTHROPIC_API_KEY`** (operator).
- **2026-06-01** — Salon interior photos in list cards + Picture sizing fix:
  `SalonRow` (homepage + `/salons`) now shows the real interior photo for
  salons that have one (harajuku-b, nagaoka), with a legibility scrim behind
  the corner labels; the two photo-less salons keep their gradient. Doing this
  surfaced a latent regression from the W6 `<Picture>` refactor: parent scoped
  styles can't reach the `<img>` inside a child component, so `object-fit`/
  sizing silently fell back to `fill` everywhere (the other 4 usages only
  *looked* right because the image ratio matched the container). Fixed at the
  source — `Picture.astro` now owns the base `width/height:100%; object-fit:
  cover` style; the gallery hover-zoom/filter was restored via `:global()`.
- **2026-06-01** — Link integrity + header CTA fix (W8): added
  `scripts/validate-links.mjs` (`npm run validate:links`; now part of
  `npm run validate` + CI) — resolves every internal href/src/srcset against
  `dist/` and checks in-page `#anchor` targets. 0 broken links/assets. It
  surfaced the only real issue: the header's `BOOK` and account `◯` pointed at
  dead `#book`/`#account` anchors on all 57 pages. `BOOK` now links to
  `/salons` (booking is per-salon via Hot Pepper); the account icon was
  removed (no account feature exists).
- **2026-06-01** — Meta description enrichment: gave the short-description
  pages factual SEO/LLMO meta text. Salons got a new optional `seoDescription`
  field (area + station walk-times + Effect Bleach service + hours) used only
  for the `<meta>` — the displayed poetic `description` tagline is untouched.
  Privacy / Terms / Journal-list descriptions expanded inline. validate:seo
  now 0 warnings.
- **2026-06-01** — SEO/OGP validation (W7): `scripts/validate-seo.mjs`
  (`npm run validate:seo`; `npm run validate` runs all three) checks `dist/`
  for `<title>`/description/canonical (self-referential, absolute, exists),
  the full OGP + Twitter card set, og:image existence, referenced head assets,
  and cross-page `<title>`/canonical uniqueness. Fixed the duplicate `<title>`
  (homepage tagline collided with the press-release journal post — journal
  page titles now append the subtitle). Remaining warnings = a few short brand
  descriptions (salons / legal), left as intentional copy.
- **2026-06-01** — Static a11y checks (W7): `scripts/validate-a11y.mjs`
  (`npm run validate:a11y`, in CI) checks `dist/` for lang, `<title>`,
  landmarks, one-`<h1>`/no-skipped-heading-levels, `<img>` alt, accessible
  names on links/buttons, duplicate ids, aria idref targets, disabled zoom,
  positive tabindex, and a working skip link. Fixed the only finding: h1→h3
  jumps on `/salons` and `/journal` (added `sr-only` `<h2>` section headings).
  Contrast & visible-focus are visual, out of static scope. 0 errors.
- **2026-06-01** — JSON-LD validation (W7): `scripts/validate-jsonld.mjs`
  (`npm run validate:jsonld`, wired into CI) parses every JSON-LD block in
  `dist/` and checks @id reference resolution, absolute URLs, referenced
  asset/page existence, ISO dates, breadcrumb ordering, and per-type required
  shape. Fixed what it caught: created `public/logo.svg` (was a dead
  Organization `logo` ref on all 57 pages); made `HairSalon`/`Article` images
  absolute via an `absUrl()` helper; resolved two dangling `@id` refs
  (gallery `about` → `#service`; `inDefinedTermSet` → inline `DefinedTermSet`).
  Now 0 errors; 4 warnings = the 2 photo-less salons (expected).
- **2026-06-01** — Image optimization (W6): `src/components/Picture.astro`
  serves AVIF/WebP with a JPEG fallback (`<picture>`, `display:contents` so
  layout is unchanged); `scripts/optimize-images.mjs` generates the siblings
  for `public/{staff,salons,gallery}` and runs as `prebuild` (derivatives
  gitignored). Remote URLs (microCMS) fall back to plain `<img>`. ~50% smaller
  (AVIF). All 4 `<img>` sites migrated.
- **2026-06-01** — Style gallery (Phase 3): added a Works section to
  `/effect-bleach` with 12 real colour works from HPB (self-hosted in
  `public/gallery/`, low-saturation cool grade) + ImageGallery JSON-LD.
- **2026-06-01** — Salon interiors (Phase 2): added HPB interior photos for
  harajuku-b + nagaoka (grayscaled, self-hosted in `public/salons/`), shown as
  a full-bleed atmosphere band on the salon page + LocalBusiness `image`.
  harajuku-a / nagoya have no clean HPB interior — pending operator photos.
- **2026-06-01** — Staff portraits (Phase 1): pulled 24/32 staff photos from
  the salons' Hot Pepper pages, self-hosted + grayscaled in `public/staff/`,
  wired into StylistCard / stylist detail / Person JSON-LD (image + sameAs).
- **2026-05-31** — Added `/menu` (price guide), `/technology` (3 technique
  pillars), `/reviews` (お客様の声); provisional cool-mono OGP image
  (`public/og-default.jpg` via sharp). Footer nav extended.
- **2026-05-31** — Effect Bleach section integrated from legacy site + web
  (Three Principles, the Logic, voices, menu, iLe Academy); glossary + FAQ
  enriched, pricing FAQ added. (PR #8)
- **2026-05-31** — Real-content pass (PR #7): real salon NAP / tel / hours /
  年中無休 / access / Hot Pepper; **co-representative model** (酒井元樹・西村涼,
  replacing the old sole-代表取締役 framing); **32-person roster** from the
  Notion staff master; Instagram fixed to `ile.801`.
- **2026-05-31** — Pre-launch hardening (PR #6): custom `/404`,
  `site.webmanifest`, `/.well-known/security.txt`, favicon.ico + theme-color.
- **2026-05-31** — microCMS env-gated content layer, W7 structured-data /
  a11y fixes, site-wide 404 language-link fix, a11y deep pass (PR #5).
