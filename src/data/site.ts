import type { SiteConfig } from "~types/content";

export const site: SiteConfig = {
  domain: "ile-hair-harajuku.com",
  url: "https://ile-hair-harajuku.com",
  siteName: "iLe",
  companyName: "株式会社ing",
  companyNameLatin: "ing inc.",
  founderName: "西村 涼",
  founderNameLatin: "Nishimura Ryo",
  foundedAt: "2020-08-01",
  foundedAtLabel: "August 1, 2020",
  unifiedAt: "2026-08-01",
  unifiedAtLabel: "August 1, 2026",
  headOffice: "東京都渋谷区神宮前",
  contactEmail: "ile.ing801@gmail.com",
  description:
    "iLe｜美容室 — 原宿・名古屋・長岡。船から、島へ。2026年8月1日、4店舗すべてを iLe に統一。",
  ogImage: "/og-default.jpg",
  instagramHandle: "ile_official",
};

export const navPrimary = [
  { label: "SALONS", href: "/salons" },
  { label: "STYLISTS", href: "/stylists" },
  { label: "STORY", href: "/story" },
  { label: "JOURNAL", href: "/journal" },
  { label: "RECRUIT", href: "/recruit" },
] as const;

export const navFooter = [
  { label: "SALONS", href: "/salons" },
  { label: "STORY", href: "/story" },
  { label: "MESSAGE", href: "/message" },
  { label: "STYLISTS", href: "/stylists" },
  { label: "JOURNAL", href: "/journal" },
  { label: "RECRUIT", href: "/recruit" },
  { label: "CONTACT", href: "/contact" },
  { label: "COMPANY", href: "/company" },
  { label: "INSTAGRAM", href: "https://instagram.com/ile_official" },
] as const;

export const languages = [
  { code: "JP", href: "/", current: true },
  { code: "EN", href: "/en/", current: false },
  { code: "ZH", href: "/zh/", current: false },
  { code: "KR", href: "/kr/", current: false },
] as const;
