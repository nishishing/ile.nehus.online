// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const SITE_URL = process.env.PUBLIC_SITE_URL ?? "https://ile-hair-harajuku.com";

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
    }),
  ],
  image: {
    responsiveStyles: true,
  },
});
