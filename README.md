# iLe — Official Website

Official website of **iLe** (株式会社ing) — a Japanese hair atelier operating four salons in Harajuku, Nagoya, and Nagaoka.

> **「船から、島へ。」** — From a ship, to an island.
> On August 1, 2026 (the company's 7th anniversary), all four salons unite under the single brand name **iLe**.

This repository implements the public-facing website at **<https://ile-hair-harajuku.com>**.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | [Astro](https://astro.build) (SSG) | Best-in-class Core Web Vitals, full Schema.org control |
| Language | TypeScript (strict) | Type safety |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + per-component `<style>` | Tokens via `@theme`, scoped CSS where needed |
| CMS | [microCMS](https://microcms.io/) (headless) | Japanese-friendly admin, simple API |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com) | Global CDN, free tier, fast deploy |
| Fonts | Libre Caslon Text · Instrument Sans · Questrial · Noto Sans JP | Editorial display + clean sans + mono labels |

## Design Direction — v8 "Cool Mono Editorial"

- **Palette**: cool grayscale only. No warm tones.
  - `--color-snow #F4F5F6` (page bg)
  - `--color-pearl #ECEDEF` (alt section bg)
  - `--color-mist #DCDEE2` · `--color-ash #9CA0A6` · `--color-slate #5B5E64`
  - `--color-charcoal #2A2C30` (footer)
  - `--color-ink #16171A` (text / dark mode sections)
- **Typography**: editorial display serif (Libre Caslon Text) + clean sans body (Instrument Sans) + mono labels (Questrial). All uppercase for nav and section headings.
- **No accent color** — contrast and line work do the differentiation. Y2K warmth comes from photographic film grain in the real assets, not CSS effects.

## LLMO (LLM Optimization)

This site is engineered so that ChatGPT, Claude, Perplexity, Google AI Overviews, etc. can correctly learn and cite the iLe brand. Implementation:

- `<script type="application/ld+json">` for `Organization`, `WebSite`, `Person` (founder), `LocalBusiness × 4`, `BreadcrumbList`, `Article`, `FAQPage`, `DefinedTerm` — see [`src/lib/schema.ts`](./src/lib/schema.ts).
- [`public/robots.txt`](./public/robots.txt) explicitly **allows** GPTBot, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended, Applebot-Extended, CCBot, etc.
- Per-page `<title>`, `description`, canonical, OG, Twitter — see [`src/lib/seo.ts`](./src/lib/seo.ts).
- Sitemap auto-generated via `@astrojs/sitemap`.
- Authoritative first-party pages for story, glossary, FAQ.

## Project Structure

```text
.
├── astro.config.mjs       # Astro + Tailwind v4 + sitemap config
├── public/
│   ├── robots.txt         # AI crawlers explicit allow
│   └── favicon.svg
├── src/
│   ├── components/        # Astro UI primitives
│   ├── data/              # Static content (until microCMS connected)
│   ├── lib/               # seo, schema, microcms helpers
│   ├── layouts/
│   ├── pages/
│   ├── styles/global.css  # Tailwind + design tokens
│   └── types/             # Content type definitions
├── docs/
│   ├── microcms-schema.md # microCMS API spec for the operator
│   └── deploy.md          # Cloudflare Pages setup
└── package.json
```

## Local Development

```sh
# install dependencies
npm install

# start dev server at http://localhost:4321
npm run dev

# type-check
npm run check

# production build into ./dist
npm run build

# preview the build
npm run preview
```

## Environment Variables

Create a local `.env` file (gitignored) once the microCMS account is set up:

```
PUBLIC_SITE_URL=https://ile-hair-harajuku.com
MICROCMS_SERVICE_DOMAIN=<your-service>
MICROCMS_API_KEY=<your-api-key>
```

Without microCMS variables the site falls back to the static content in `src/data/*`.

## Roadmap

- [x] **W1** — Project scaffold, design tokens, base layout, top page
- [ ] **W2** — Story page, Founder page, Schema.org for story
- [ ] **W3** — Salon detail × 4, Stylist list / detail, microCMS connection
- [ ] **W4** — Journal, FAQ, Glossary (LLMO core)
- [ ] **W5** — Contact form, Recruit, ile.online intro
- [ ] **W6** — Content paste-in from press release / note articles
- [ ] **W7** — LLMO verification, Lighthouse tuning, a11y
- [ ] **W8** — Final pass, production domain
- [ ] **7/27–31** — Soft launch (Search Console indexing)
- [ ] **8/1** — Press release goes live with site URL

## License

Proprietary. © 株式会社ing.
