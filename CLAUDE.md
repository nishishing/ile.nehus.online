# CLAUDE.md — Project handover

> **Read this file first when starting a new Claude Code session on this repo.**
> It captures the full design and implementation context built up over the
> previous session, so you can continue without re-litigating decisions.

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
(booking) in `src/data/salons.ts`. Opened: 01=2020 / 02=2022 / 03=2023 /
04=2024; 02–04 rename to iLe on 2026-08-01.

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
│   │   ├── faq.ts             11 LLMO-critical Q&A (incl. Effect Bleach + pricing)
│   │   └── glossary.ts        DefinedTerm entries (iLe / nehus / 船から島へ / 酒井元樹 / 西村涼 / エフェクトブリーチ / …)
│   ├── components/            Astro components
│   ├── layouts/BaseLayout.astro
│   └── pages/                 content pages (see "Pages shipped")
├── public/
│   ├── robots.txt  favicon.svg/.ico  site.webmanifest
│   └── .well-known/security.txt
└── docs/
    ├── microcms-schema.md     Operator-facing API spec
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

## Pages shipped (~54 built pages)

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
| `/faq` | **FAQPage** | 11 Q&A incl. Effect Bleach + pricing |
| `/glossary` | **DefinedTerm** | iLe / nehus / 船から島へ / 酒井元樹 / 西村涼 / エフェクトブリーチ / … |
| `/recruit` `/contact` `/ile-online` `/privacy` `/terms` | Breadcrumb | |
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

> **📌 TODO — awaiting operator photos (add when supplied; per owner, "later").**
> These couldn't be auto-sourced: HPB had no clean shot and Instagram is
> login-walled / rate-limited from CI. Drop the files in and wire as noted —
> reuse the same `sharp` pipeline (see Changelog commits) so the cool-mono
> treatment stays consistent.
> - **Salon interiors — harajuku-a (iLe origin) + nagoya.** Grayscale band,
>   1600×680, save `public/salons/{harajuku-a,nagoya}.jpg`, then add
>   `heroImage: { url, width: 1600, height: 680 }` to those entries in
>   `src/data/salons.ts` (LocalBusiness `image` + the atmosphere band pick it
>   up automatically).
> - **Staff portraits — 7 missing** (`inoe-mizuki`, `horibe-mihana`,
>   `fukutani-amane`, `kawahara-ichika`, `yukimatsu-hisa`, `tanogami-yoshiho`,
>   `yokoyama-ichika`). Grayscale, 600×750 top-anchored, save
>   `public/staff/<slug>.jpg`, then add
>   `portrait: { url, width: 600, height: 750 }` to each in
>   `src/data/stylists.ts`.
> - **Effect Bleach before/after + real OGP + iLe logo SVG** — still open.

1. **Real assets** *(the main remaining blocker)* — iLe unified logo SVG,
   salon interiors for **harajuku-a + nagoya** (HPB only had clean interiors
   for the other two; these two need operator-supplied photos), Effect Bleach
   before/after photos, and a real OGP.
   **Provisional assets already in place** (replace when real ones land):
   - **Salon interiors**: 2/4 (`harajuku-b`, `nagaoka`) use the salon's own
     HPB interior photo, self-hosted in `public/salons/<slug>.jpg`, grayscaled,
     shown as a full-bleed band under the salon hero + fed to LocalBusiness
     `image`. harajuku-a / nagoya have no clean HPB interior (only style
     collages) — left text-only until real photos arrive.
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
   - **OGP**: `public/og-default.jpg` (cool-mono, `sharp` from an SVG).
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
- **Do not** push directly to `main`. Use a feature branch + PR.
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
  pre-launch hardening (#6), the real-content pass (#7). Effect-Bleach
  integration is PR #8 (open at time of writing).

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
