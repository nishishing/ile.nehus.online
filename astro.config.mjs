// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "node:fs";

const SITE_URL = process.env.PUBLIC_SITE_URL ?? "https://ile-hair-harajuku.com";

// サイトマップに記事の公開日を lastmod として載せる（2026-10-14）。
// 検索エンジン（Bing / IndexNow 系）が「どのページが新しいか」を判断する材料になる。
/** @type {{ slug: string; publishedAt: string; updatedAt?: string }[]} */
const generatedPosts = JSON.parse(
  readFileSync(new URL("./src/data/blog-generated.json", import.meta.url), "utf8"),
);
const lastmodByUrl = new Map(
  generatedPosts.map((p) => [`${SITE_URL}/journal/${p.slug}`, p.updatedAt ?? p.publishedAt]),
);
const latestPost = [...lastmodByUrl.values()].sort().at(-1);
if (latestPost) lastmodByUrl.set(`${SITE_URL}/journal`, latestPost);

export default defineConfig({
  site: SITE_URL,
  trailingSlash: "never",
  build: {
    format: "directory",
  },
  vite: {
    // tailwindcss v4 ships a Vite plugin whose Plugin<any> type drifts
    // slightly from astro's bundled Vite types; the runtime contract is
    // identical, so we widen the cast at the config boundary.
    plugins: [/** @type {any} */ (tailwindcss())],
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/draft/") && !page.includes("/_"),
      serialize(item) {
        const lastmod = lastmodByUrl.get(item.url.replace(/\/$/, ""));
        if (lastmod) item.lastmod = new Date(`${lastmod}T00:00:00+09:00`).toISOString();
        return item;
      },
    }),
  ],
  image: {
    responsiveStyles: true,
  },
});
