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

export type JournalCategory = "press" | "story" | "news" | "media";

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
}

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
  order?: number;
}

export interface Representative {
  name: string; // "酒井 元樹"
  nameLatin: string; // "Motoki Sakai"
  title: string; // "共同代表"
  titleEn: string; // "Co-Representative"
  id: string; // JSON-LD @id fragment, e.g. "#founder"
}

export interface SiteConfig {
  domain: string;
  url: string;
  siteName: string;
  companyName: string;
  companyNameLatin: string;
  /** Public co-representatives of the company. */
  representatives: Representative[];
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
