/**
 * RSS 2.0 feed for the Journal.
 *
 * BaseHead links every page to /feed.xml; this endpoint generates it at
 * build time from the journal content (microCMS or static fallback).
 * Hand-rolled to avoid an extra dependency — the feed is small and flat.
 */
import type { APIRoute } from "astro";
import { site } from "~data/site";
import { getJournalPosts } from "~lib/content";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const GET: APIRoute = async () => {
  const posts = [...(await getJournalPosts())].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

  const items = posts
    .map((p) => {
      const link = `${site.url}/journal/${p.slug}`;
      const desc = p.summary ?? p.subtitle ?? p.title;
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <description>${esc(desc)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.siteName)} — Journal</title>
    <link>${site.url}/journal</link>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${esc(site.description)}</description>
    <language>ja</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
