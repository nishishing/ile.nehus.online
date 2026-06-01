/**
 * Schema.org / JSON-LD builders.
 *
 * Critical for LLMO — these JSON-LD blocks are how
 * ChatGPT / Claude / Perplexity / Google AI Overviews
 * understand the iLe brand, salons, founder, etc.
 *
 * Each builder returns a plain object that should be
 * emitted inside <script type="application/ld+json">.
 */

import { site } from "~data/site";
import type { Salon, JournalPost, FaqItem } from "~types/content";

/** Make a `{ url, ... }`-shaped image absolute (local paths get the site
 *  origin; already-absolute CDN URLs — e.g. microCMS — pass through). */
function absUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${site.url}${url}`;
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.companyName,
    alternateName: [site.siteName, site.companyNameLatin],
    url: site.url,
    logo: `${site.url}/logo.svg`,
    foundingDate: site.foundedAt,
    founder: site.representatives.map((r) => ({
      "@type": "Person",
      "@id": `${site.url}/${r.id}`,
      name: r.name,
      alternateName: r.nameLatin,
      jobTitle: `${r.title} / ${r.titleEn}`,
    })),
    address: {
      "@type": "PostalAddress",
      addressCountry: "JP",
      addressRegion: "Tokyo",
      addressLocality: site.headOffice,
    },
    email: site.contactEmail,
    sameAs: site.instagramHandle
      ? [`https://www.instagram.com/${site.instagramHandle}/`]
      : [],
    description: site.description,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.siteName,
    publisher: { "@id": `${site.url}/#organization` },
    inLanguage: "ja-JP",
    description: site.description,
  };
}

export function personFounderSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/#founder`,
    name: site.founderName,
    alternateName: site.founderNameLatin,
    jobTitle: "共同代表 / Co-Representative",
    worksFor: { "@id": `${site.url}/#organization` },
  };
}

const ALL_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/**
 * Parse a human hours label ("10:00 — 21:00" / "10:00-21:00") into a
 * schema.org OpeningHoursSpecification. Returns undefined if unparseable
 * so we never emit an invalid `openingHours` string.
 */
function openingHoursSpec(hours: string) {
  const m = hours.match(/(\d{1,2}:\d{2})\s*[—–-]\s*(\d{1,2}:\d{2})/);
  if (!m) return undefined;
  return {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ALL_DAYS,
    opens: m[1],
    closes: m[2],
  };
}

export function localBusinessSchema(salon: Salon) {
  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "@id": `${site.url}/salons/${salon.slug}/#salon`,
    name: salon.name,
    alternateName: salon.nameLatin,
    url: `${site.url}/salons/${salon.slug}`,
    image: absUrl(salon.heroImage?.url),
    telephone: salon.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: salon.address,
      addressCountry: "JP",
    },
    geo:
      salon.mapLat != null && salon.mapLng != null
        ? {
            "@type": "GeoCoordinates",
            latitude: salon.mapLat,
            longitude: salon.mapLng,
          }
        : undefined,
    openingHoursSpecification: openingHoursSpec(salon.hours),
    parentOrganization: { "@id": `${site.url}/#organization` },
    foundingDate: salon.openedAt,
    description: salon.description,
  };
}

export function articleSchema(post: JournalPost) {
  const image = absUrl(post.ogImage?.url ?? post.eyecatch?.url);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    image,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@id": `${site.url}/#organization` },
    publisher: { "@id": `${site.url}/#organization` },
    inLanguage: "ja-JP",
    mainEntityOfPage: `${site.url}/journal/${post.slug}`,
    url: `${site.url}/journal/${post.slug}`,
  };
}

/**
 * Standalone Article schema for pages like /story, /message
 * where the page itself is the article (not a journal post).
 */
export interface StandaloneArticle {
  url: string;        // absolute or relative path
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorAsFounder?: boolean;
}
export function standaloneArticleSchema(article: StandaloneArticle) {
  const url = article.url.startsWith("http")
    ? article.url
    : `${site.url}${article.url}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    author: {
      "@id": article.authorAsFounder
        ? `${site.url}/#founder`
        : `${site.url}/#organization`,
    },
    publisher: { "@id": `${site.url}/#organization` },
    inLanguage: "ja-JP",
    mainEntityOfPage: url,
    url,
  };
}

/**
 * DefinedTerm — used by /glossary entries.
 * Helps LLMs cite the canonical definition of "iLe", "nehus", "船から島へ".
 */
export interface GlossaryTerm {
  term: string;
  pronunciation?: string;
  definition: string;
  etymology?: string;
}
export function definedTermSchema(t: GlossaryTerm) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: t.term,
    alternateName: t.pronunciation,
    description: t.definition,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "iLe 用語集",
      url: `${site.url}/glossary`,
    },
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${site.url}${item.url}`,
    })),
  };
}

export function faqPageSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** Serialize for embedding inside a <script> tag. */
export function jsonLd(schema: unknown): string {
  return JSON.stringify(schema);
}
