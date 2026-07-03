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
      bio: "iLe の独自ブリーチ技術「エフェクトブリーチ」の開発者。ケミカル（薬剤設計）に精通し、ダメージ履歴を10段階で診断して過酸化水素の濃度をミリ単位で調整する「パーソナル減力」を体系化した。複雑な履歴を持つ髪のブリーチ設計を専門とし、美容師向けのカラーセミナーにも多数登壇している。",
      knowsAbout: [
        "エフェクトブリーチ",
        "ブリーチ",
        "ヘアカラーの薬剤設計（ケミカル）",
        "ダメージレスブリーチ",
        "ハイトーンカラー",
        "複雑履歴のブリーチ",
      ],
      authoredBook: "複雑履歴のブリーチ大全",
      sameAs: [
        "https://www.instagram.com/sakaimotoki/",
        "https://beauty.hotpepper.jp/slnH000499134/stylist/T000652297/",
      ],
      press: [
        {
          label: "HAIRCAMP 講師ページ（美容師向けオンライン学習）",
          url: "https://haircamp.jp/sakaimotoki/",
        },
        {
          label: "b-ex palette セミナー「ブリーチロングリタッチ パーフェクトテクニック」",
          url: "https://bexpalette.beautyexperience.com/contents/307",
        },
        {
          label: "inborn インタビュー（株式会社スタイラーズ）",
          url: "https://stylers-inborn.com/ile-sakaisan_st2nd/",
        },
      ],
    },
    {
      name: "西村 涼",
      nameLatin: "Nishimura Ryo",
      title: "共同代表",
      titleEn: "Co-Representative",
      id: "#founder",
      bio: "iLe 創業者。バレイヤージュをはじめとするデザインカラーを得意とし、「根元が伸びても気になりにくい・メンテナンスしやすい」設計を追求する。スタイリストの育成とブランドづくりを担う。",
      knowsAbout: [
        "バレイヤージュ",
        "ハイライト",
        "デザインカラー",
        "ハイトーンカラー",
        "ブリーチ",
      ],
      authoredBook: "複雑履歴のブリーチ大全",
      sameAs: [
        "https://www.instagram.com/nishishing/",
        "https://beauty.hotpepper.jp/slnH000499134/stylist/T000652296/",
      ],
      press: [
        {
          label: "inborn インタビュー（株式会社スタイラーズ）",
          url: "https://stylers-inborn.com/%E2%91%A8-ile-interview/",
        },
      ],
    },
  ],
  // Co-authored book — verified against the publisher's page (髪書房) 2026-06-12.
  book: {
    title: "複雑履歴のブリーチ大全 iLe's BLEACH METHOD",
    publisher: "髪書房",
    publisherUrl: "https://www.kamishobo.co.jp/",
    datePublished: "2022-04-08",
    isbn: "4908697507",
    url: "https://www.kamishobo.co.jp/archives/book/%E8%A4%87%E9%9B%91%E5%B1%A5%E6%AD%B4%E3%81%AE%E3%83%96%E3%83%AA%E3%83%BC%E3%83%81%E5%A4%A7%E5%85%A8%E3%80%80iles-bleach-method",
    sameAs: ["https://www.amazon.co.jp/dp/4908697507"],
    authorIds: ["#rep-sakai", "#founder"],
  },
  press: [
    {
      label: "リクエストQJ SALON REPORT — 酒井元樹／西村涼「フリーからの転身。新しい価値観が繋いだ共同経営の道」",
      url: "https://www.qjnavi.jp/special/trend/ile_sakainishimura/",
    },
    {
      label: "inborn — iLe. 酒井元樹・西村涼 代表2名によるインタビュー",
      url: "https://stylers-inborn.com/inborn-system-treatment-by-ile/",
    },
    {
      label: "バングス — iLe.を代表する美容師たちが織りなすカラーマジック【前編】",
      url: "https://bangs.jp/special_contents/article.php?id=43",
    },
  ],
  founderName: "西村 涼",
  founderNameLatin: "Nishimura Ryo",
  foundedAt: "2020-08-01",
  foundedAtLabel: "August 1, 2020",
  unifiedAt: "2026-08-01",
  unifiedAtLabel: "August 1, 2026",
  // 本社 = 原宿本店と同一 (2026-07-04 オーナー確認済み)。GBP API審査で「会社情報が不完全」と
  // 却下された対策として番地まで明記 — company.astro の概要表と JSON-LD(PostalAddress) が参照。
  headOffice: "〒150-0001 東京都渋谷区神宮前6-10-8 原宿NAビル 4F",
  headOfficeParts: {
    postalCode: "150-0001",
    addressRegion: "Tokyo",
    addressLocality: "渋谷区",
    streetAddress: "神宮前6-10-8 原宿NAビル 4F",
  },
  contactTel: "03-6427-5235", // 代表電話(2026-07-04 オーナー提供)。company概要表とJSON-LD telephone が参照
  contactEmail: "ile.ing801@gmail.com",
  description:
    "iLe｜美容室 — 原宿・名古屋・長岡。船から、島へ。2026年8月1日、4店舗すべてを iLe に統一。",
  ogImage: "/og-default.jpg",
  instagramHandle: "ile.801",
};

export const navPrimary = [
  { label: "SALONS", href: "/salons" },
  { label: "STYLISTS", href: "/stylists" },
  { label: '<span class="brand-token">irida</span>', href: "/irida" },
  { label: "EFFECT BLEACH", href: "/effect-bleach" },
  { label: "STORY", href: "/story" },
  { label: "JOURNAL", href: "/journal" },
  { label: "RECRUIT", href: "/recruit" },
] as const;

export const navFooter = [
  { label: "SALONS", href: "/salons" },
  { label: "STYLISTS", href: "/stylists" },
  { label: "MENU", href: "/menu" },
  { label: "EFFECT BLEACH", href: "/effect-bleach" },
  { label: "TECHNOLOGY", href: "/technology" },
  { label: '<span class="brand-token">irida</span>', href: "/irida" },
  { label: "EXPERTISE", href: "/expertise" },
  { label: "VOICE", href: "/reviews" },
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
