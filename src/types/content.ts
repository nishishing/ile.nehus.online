/**
 * Content type definitions for iLe site.
 * Will be 1:1 with microCMS schema once CMS is connected.
 */

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
  openedAt: string; // "2020.08.01"
  renamedAt?: string;
  hours: string;
  holidays?: string;
  phone?: string;
  hotPepperUrl?: string;
  mapLat?: number;
  mapLng?: number;
  description: string;
  badge: string; // "— origin", "— formerly nehus"
  stylistCount: number;
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
}

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export interface SiteConfig {
  domain: string;
  url: string;
  siteName: string;
  companyName: string;
  companyNameLatin: string;
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
