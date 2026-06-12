/**
 * Content type definitions for iLe site.
 * 1:1 with the microCMS schema (see docs/microcms-schema.md).
 * Pages consume these via the loaders in src/lib/content.ts, which
 * fetch from microCMS when configured and fall back to src/data/*.
 */

/** Image field as returned by the microCMS media API. */
export interface MicroCMSImage {
  url: string;
  width?: number;
  height?: number;
}

export type SalonSlug = "harajuku-a" | "harajuku-b" | "nagoya" | "nagaoka";

export interface Salon {
  slug: SalonSlug;
  number: string; // "01", "02", ...
  name: string; // "iLe 原宿"
  nameLatin: string; // "iLe Harajuku A"
  city: string; // "Harajuku / Tokyo"
  cityShort: string; // "HARAJUKU A"
  formerName?: string; // "nehus", "nehus 名古屋", etc.
  address: string;
  access?: string; // nearest stations, e.g. "原宿駅7分 / 明治神宮前駅2分"
  openedAt: string; // "2020.08.01"
  renamedAt?: string;
  hours: string;
  holidays?: string;
  phone?: string;
  hotPepperUrl?: string;
  mapLat?: number;
  mapLng?: number;
  description: string;
  /** Richer, factual meta description for SEO/LLMO (area, access, services,
   *  hours). Falls back to `description` when absent. The displayed brand
   *  tagline (`description`) stays untouched. */
  seoDescription?: string;
  badge: string; // "— origin", "— formerly nehus"
  stylistCount?: number;
  heroImage?: MicroCMSImage;
  gallery?: MicroCMSImage[];
}

export interface Stylist {
  slug: string;
  name: string;
  nameJa?: string;
  salonSlug: SalonSlug;
  position?: string; // "Founder", "Director"
  profile?: string;
  instagram?: string;
  hotPepperUrl?: string;
  specialties?: string[];
  portrait?: MicroCMSImage;
}

export type JournalCategory = "press" | "story" | "news" | "media" | "column";

export interface JournalPost {
  slug: string;
  category: JournalCategory;
  categoryLabel: string;
  title: string;
  subtitle?: string;
  publishedAt: string; // ISO date
  publishedAtLabel: string; // "August 1, 2026"
  body?: string;
  summary?: string;
  eyecatchAlt?: string;
  eyecatch?: MicroCMSImage;
  ogImage?: MicroCMSImage;
  /** Set on auto-generated "column" posts: the source SEO topic + keywords.
   *  Used to dedupe topics across runs; not rendered. */
  topic?: string;
  keywords?: readonly string[];
}

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
  order?: number;
}

/** A verified external link (third-party page about the brand/person). */
export interface ExternalLink {
  label: string; // "リクエストQJ SALON REPORT"
  url: string;
}

export interface Representative {
  name: string; // "酒井 元樹"
  nameLatin: string; // "Motoki Sakai"
  title: string; // "共同代表"
  titleEn: string; // "Co-Representative"
  id: string; // JSON-LD @id fragment, e.g. "#founder"
  /** E-E-A-T: short public bio surfacing expertise. */
  bio?: string;
  /** E-E-A-T: areas of expertise → Person.knowsAbout. */
  knowsAbout?: string[];
  /** E-E-A-T: authored/co-authored work title (→ Person.subjectOf Book). */
  authoredBook?: string;
  /** E-E-A-T: identity profiles (Instagram, Hot Pepper Beauty) → Person.sameAs. */
  sameAs?: string[];
  /** E-E-A-T: third-party interviews / seminar pages → Person.subjectOf. */
  press?: ExternalLink[];
}

/** Co-authored book — an external authority signal (→ Book JSON-LD). */
export interface AuthoredBook {
  title: string; // full title incl. subtitle
  publisher: string;
  publisherUrl?: string;
  datePublished: string; // ISO yyyy-mm-dd
  isbn?: string;
  /** Canonical external page (publisher's book page). */
  url?: string;
  /** Other listings (Amazon etc.). */
  sameAs?: string[];
  /** JSON-LD @id fragments of the representative authors. */
  authorIds: string[];
}

export interface SiteConfig {
  domain: string;
  url: string;
  siteName: string;
  companyName: string;
  companyNameLatin: string;
  /** Public co-representatives of the company. */
  representatives: Representative[];
  /** E-E-A-T: the co-authored book (verified facts only). */
  book?: AuthoredBook;
  /** E-E-A-T: brand-level third-party media coverage. */
  press?: ExternalLink[];
  /** Identity used for author-signed pages (/message, /story). */
  founderName: string;
  founderNameLatin: string;
  foundedAt: string;
  foundedAtLabel: string;
  unifiedAt: string;
  unifiedAtLabel: string;
  headOffice: string;
  contactEmail: string;
  description: string;
  ogImage: string;
  twitterHandle?: string;
  instagramHandle?: string;
}
