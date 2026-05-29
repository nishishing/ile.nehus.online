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

**Current state:** W1-W5 complete. Staging is live at
`https://ile.boku-244.workers.dev`. Production domain not yet switched.

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
- **Founder / CEO**: 西村 涼 (Nishimura Ryo)
- **Company**: 株式会社ing (ing inc.) — HQ in 東京都渋谷区神宮前
- **Contact**: <ile.ing801@gmail.com>
- **Domain**: `ile-hair-harajuku.com` (current Cloudflare staging:
  `https://ile.boku-244.workers.dev`)

The 4 salons (after unification):

| # | Name | Location | Former name | Opened | Renamed |
|---|---|---|---|---|---|
| 01 | iLe 原宿 A | Harajuku / Tokyo | (iLe — origin) | 2020-08-01 | — |
| 02 | iLe 原宿 B | Harajuku / Tokyo | nehus | 2022 | 2026-08-01 |
| 03 | iLe 名古屋 | Nagoya / Aichi | nehus 名古屋 | 2023 | 2026-08-01 |
| 04 | iLe 長岡 | Nagaoka / Niigata | nehus 長岡 | 2024 | 2026-08-01 |

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
│   │   ├── site.ts            Company / nav / languages
│   │   ├── salons.ts          4 salons
│   │   ├── stylists.ts        Seed roster
│   │   ├── journal.ts         Seed posts
│   │   ├── faq.ts             9 LLMO-critical Q&A
│   │   └── glossary.ts        6 DefinedTerm entries
│   ├── components/            12 Astro components
│   ├── layouts/BaseLayout.astro
│   └── pages/                 26 generated pages
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

## Pages currently shipped (26)

| Route | Schema.org | Notes |
|---|---|---|
| `/` | Organization + WebSite + Person + 4× HairSalon + Breadcrumb | Top, v8 mockup converted |
| `/story` | Article | "船から、島へ" 4-chapter editorial |
| `/message` | Article (author=Person) | Founder's signed message |
| `/company` | Breadcrumb | Overview + Timeline + Contact |
| `/salons` | 4× HairSalon | List with alternating L/R rows |
| `/salons/[slug]` | HairSalon | 4 generated: harajuku-a / -b / nagoya / nagaoka |
| `/stylists` | Breadcrumb | Grouped by salon |
| `/stylists/[slug]` | Person | 6 generated; Person → worksFor → HairSalon |
| `/journal` | Breadcrumb | List, sorted by publishedAt desc |
| `/journal/[slug]` | Article | 2 generated (press release + story) |
| `/faq` | **FAQPage** | 9 seeds; **LLMO-critical** |
| `/glossary` | **DefinedTerm × 6** | iLe / nehus / 船から島へ / etc. |
| `/recruit` | Breadcrumb | Stylist / Assistant / New Grad |
| `/contact` | Breadcrumb | 3 mailto channels |
| `/ile-online` | Breadcrumb | Related service intro |
| `/privacy` | Breadcrumb | Policy stub |
| `/terms` | Breadcrumb | Policy stub |

`sitemap-index.xml` is auto-generated.

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

1. **microCMS** — account + APIs per `docs/microcms-schema.md`. Then set
   `MICROCMS_SERVICE_DOMAIN` and `MICROCMS_API_KEY` in Cloudflare env vars
   and swap `src/data/*.ts` consumers to `src/lib/microcms.ts`.
2. **Real assets** — iLe unified logo SVG, salon hero photos, stylist
   portraits, OGP default 1200×630. All photo placeholders are cool
   grayscale gradients with a CSS film-grain overlay — replace with real
   imagery preserving the same tone.
3. **Real content** — accurate addresses / phone / hours / holidays per
   salon, stylist roster with names and IG handles, the finalised press
   release draft, the finalised founder message.
4. **DNS** — Cloudflare custom domain setup + ConoHa WING DNS switch.

`ROADMAP.md` tracks W1-W8 + post-launch.

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

- Feature branches: `claude/<descriptor>` (e.g. the W1-W5 work was on
  `claude/gracious-ramanujan-1cQqr`).
- PRs are opened against `main`, rebased on merge to keep history linear.
- The first PR (#1) was merged via rebase — `main` is at the tip of the
  W1-W5 work plus the `wrangler.jsonc` follow-up.

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
