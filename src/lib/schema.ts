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
    founder: {
      "@type": "Person",
      "@id": `${site.url}/#founder`,
      name: site.founderName,
      jobTitle: "代表取締役 / Founder",
    },
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
    jobTitle: "代表取締役 / Founder",
    worksFor: { "@id": `${site.url}/#organization` },
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
    address: {
      "@type": "PostalAddress",
      streetAddress: salon.address,
      addressCountry: "JP",
    },
    openingHours: salon.hours,
    parentOrganization: { "@id": `${site.url}/#organization` },
    foundingDate: salon.openedAt,
    description: salon.description,
  };
}

export function articleSchema(post: JournalPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    datePublished: post.publishedAt,
    author: { "@id": `${site.url}/#organization` },
    publisher: { "@id": `${site.url}/#organization` },
    inLanguage: "ja-JP",
    url: `${site.url}/journal/${post.slug}`,
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
