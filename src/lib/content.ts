/**
 * Content access layer.
 *
 * Single source of truth for how pages/components obtain content.
 * When microCMS is configured (env vars present) it fetches from the CMS
 * and maps each response to the domain types in src/types/content.ts.
 * Otherwise it falls back to the static seed data in src/data/*.
 *
 * Connecting microCMS is therefore a config-only operation: set
 * MICROCMS_SERVICE_DOMAIN + MICROCMS_API_KEY and the site flips over.
 * See docs/microcms-schema.md for the expected API/field shapes.
 *
 * Results are memoised per build so repeated calls (e.g. one StylistCard
 * per stylist) hit the CMS at most once per endpoint.
 */

import { microcms, microcmsEnabled } from "~lib/microcms";
import type {
  Salon,
  SalonSlug,
  Stylist,
  JournalPost,
  JournalCategory,
  FaqItem,
  MicroCMSImage,
} from "~types/content";
import type { GlossaryTerm } from "~lib/schema";

import { salons as staticSalons } from "~data/salons";
import { stylists as staticStylists } from "~data/stylists";
import { journalPosts as staticJournal } from "~data/journal";
import blogGenerated from "~data/blog-generated.json";
import { faqItems as staticFaq } from "~data/faq";
import { glossaryTerms as staticGlossary } from "~data/glossary";

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

/** "2020-08-01T00:00:00.000Z" → "2020-08-01" for date-only display. */
function dateOnly(value?: string): string | undefined {
  if (!value) return undefined;
  return value.slice(0, 10);
}

/** ISO date → "August 1, 2026" to match the existing label style. */
function formatDateLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** microCMS image field may arrive as null; normalise to undefined. */
function image(value: MicroCMSImage | null | undefined): MicroCMSImage | undefined {
  return value && value.url ? value : undefined;
}

/* ------------------------------------------------------------------ *
 * Raw microCMS shapes (what each endpoint returns before mapping)
 * ------------------------------------------------------------------ */

interface RawSalon {
  slug: string;
  number: string;
  name: string;
  nameLatin: string;
  city: string;
  cityShort: string;
  formerName?: string;
  address: string;
  access?: string;
  openedAt: string;
  renamedAt?: string;
  hours: string;
  holidays?: string;
  phone?: string;
  hotPepperUrl?: string;
  mapLat?: number;
  mapLng?: number;
  description: string;
  badge: string;
  stylistCount?: number;
  heroImage?: MicroCMSImage | null;
  gallery?: MicroCMSImage[] | null;
}

interface RawStylist {
  slug: string;
  name: string;
  nameJa?: string;
  salonRef?: { slug: string } | null;
  position?: string;
  profile?: string;
  instagram?: string;
  hotPepperUrl?: string;
  specialties?: string[] | null;
  portrait?: MicroCMSImage | null;
}

interface RawJournal {
  slug: string;
  category: string;
  categoryLabel: string;
  title: string;
  subtitle?: string;
  publishedAt: string;
  summary?: string;
  body?: string;
  eyecatch?: MicroCMSImage | null;
  ogImage?: MicroCMSImage | null;
}

interface RawFaq {
  question: string;
  answer: string;
  category?: string;
  order?: number;
}

interface RawGlossary {
  term: string;
  pronunciation?: string;
  definition: string;
  etymology?: string;
}

/* ------------------------------------------------------------------ *
 * Mappers (raw microCMS content → domain type)
 * ------------------------------------------------------------------ */

function mapSalon(r: RawSalon): Salon {
  return {
    slug: r.slug as SalonSlug,
    number: r.number,
    name: r.name,
    nameLatin: r.nameLatin,
    city: r.city,
    cityShort: r.cityShort,
    formerName: r.formerName,
    address: r.address,
    access: r.access,
    openedAt: dateOnly(r.openedAt) ?? r.openedAt,
    renamedAt: dateOnly(r.renamedAt),
    hours: r.hours,
    holidays: r.holidays,
    phone: r.phone,
    hotPepperUrl: r.hotPepperUrl,
    mapLat: r.mapLat,
    mapLng: r.mapLng,
    description: r.description,
    badge: r.badge,
    stylistCount: r.stylistCount,
    heroImage: image(r.heroImage),
    gallery: r.gallery ?? undefined,
  };
}

function mapStylist(r: RawStylist): Stylist {
  return {
    slug: r.slug,
    name: r.name,
    nameJa: r.nameJa,
    salonSlug: (r.salonRef?.slug ?? "") as SalonSlug,
    position: r.position,
    profile: r.profile,
    instagram: r.instagram,
    hotPepperUrl: r.hotPepperUrl,
    specialties: r.specialties ?? undefined,
    portrait: image(r.portrait),
  };
}

function mapJournal(r: RawJournal): JournalPost {
  return {
    slug: r.slug,
    category: r.category as JournalCategory,
    categoryLabel: r.categoryLabel,
    title: r.title,
    subtitle: r.subtitle,
    publishedAt: r.publishedAt,
    publishedAtLabel: formatDateLabel(r.publishedAt),
    summary: r.summary,
    body: r.body,
    eyecatch: image(r.eyecatch),
    ogImage: image(r.ogImage),
  };
}

function mapFaq(r: RawFaq): FaqItem {
  return {
    question: r.question,
    answer: r.answer,
    category: r.category,
    order: r.order,
  };
}

function mapGlossary(r: RawGlossary): GlossaryTerm {
  return {
    term: r.term,
    pronunciation: r.pronunciation,
    definition: r.definition,
    etymology: r.etymology,
  };
}

/* ------------------------------------------------------------------ *
 * Memoised loaders
 * ------------------------------------------------------------------ */

const cache = new Map<string, Promise<unknown>>();

function load<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (!cache.has(key)) cache.set(key, fn());
  return cache.get(key) as Promise<T>;
}

export function getSalons(): Promise<readonly Salon[]> {
  return load("salons", async () => {
    if (!microcmsEnabled || !microcms) return staticSalons;
    const items = await microcms.getAllContents<RawSalon>({ endpoint: "salons" });
    return items.map(mapSalon);
  });
}

export async function getSalonBySlug(slug: string): Promise<Salon | undefined> {
  const salons = await getSalons();
  return salons.find((s) => s.slug === slug);
}

export function getStylists(): Promise<readonly Stylist[]> {
  return load("stylists", async () => {
    if (!microcmsEnabled || !microcms) return staticStylists;
    const items = await microcms.getAllContents<RawStylist>({ endpoint: "stylists" });
    return items.map(mapStylist);
  });
}

export function getJournalPosts(): Promise<readonly JournalPost[]> {
  return load("journal", async () => {
    // Hand-written seed posts + auto-generated "column" articles. Pages sort
    // by publishedAt, so order here doesn't matter.
    const seeded = [...staticJournal, ...(blogGenerated as JournalPost[])];
    if (!microcmsEnabled || !microcms) return seeded;
    const items = await microcms.getAllContents<RawJournal>({
      endpoint: "journal",
      queries: { orders: "-publishedAt" },
    });
    return items.map(mapJournal);
  });
}

export function getFaqItems(): Promise<readonly FaqItem[]> {
  return load("faq", async () => {
    if (!microcmsEnabled || !microcms) return staticFaq;
    const items = await microcms.getAllContents<RawFaq>({
      endpoint: "faq",
      queries: { orders: "order" },
    });
    return items.map(mapFaq);
  });
}

export function getGlossaryTerms(): Promise<readonly GlossaryTerm[]> {
  return load("glossary", async () => {
    if (!microcmsEnabled || !microcms) return staticGlossary;
    const items = await microcms.getAllContents<RawGlossary>({ endpoint: "glossary" });
    return items.map(mapGlossary);
  });
}
