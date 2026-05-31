import type { SiteConfig } from "~types/content";

export const site: SiteConfig = {
  domain: "ile-hair-harajuku.com",
  url: "https://ile-hair-harajuku.com",
  siteName: "iLe",
  companyName: "株式会社ing",
  companyNameLatin: "ing inc.",
  representatives: [
    {
      name: "酒井 元樹",
      nameLatin: "Motoki Sakai",
      title: "共同代表",
      titleEn: "Co-Representative",
      id: "#rep-sakai",
    },
    {
      name: "西村 涼",
      nameLatin: "Nishimura Ryo",
      title: "共同代表",
      titleEn: "Co-Representative",
      id: "#founder",
    },
  ],
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
  instagramHandle: "ile.801",
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
  { label: "STYLISTS", href: "/stylists" },
  { label: "EFFECT BLEACH", href: "/effect-bleach" },
  { label: "STORY", href: "/story" },
  { label: "MESSAGE", href: "/message" },
  { label: "JOURNAL", href: "/journal" },
  { label: "RECRUIT", href: "/recruit" },
  { label: "FAQ", href: "/faq" },
  { label: "GLOSSARY", href: "/glossary" },
  { label: "COMPANY", href: "/company" },
  { label: "CONTACT", href: "/contact" },
  { label: "iLe.ONLINE", href: "/ile-online" },
  { label: "INSTAGRAM", href: "https://instagram.com/ile.801" },
] as const;

export const navLegal = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;

// `available` flips to true once a localized version actually ships.
// Until then the code is shown but not linked (avoids site-wide 404s).
export interface Language {
  code: string;
  href: string;
  current: boolean;
  available: boolean;
}
export const languages: readonly Language[] = [
  { code: "JP", href: "/", current: true, available: true },
  { code: "EN", href: "/en/", current: false, available: false },
  { code: "ZH", href: "/zh/", current: false, available: false },
  { code: "KR", href: "/kr/", current: false, available: false },
];
