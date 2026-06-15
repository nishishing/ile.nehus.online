import type { Salon } from "~types/content";

/**
 * 4 salons under the unified iLe brand (as of 2026.08.01).
 *
 * Address / access / phone / hours / holidays / Hot Pepper booking URLs are
 * the real, operator-confirmed values. All four salons are open year-round
 * (年中無休).
 */
export const salons: readonly Salon[] = [
  {
    slug: "harajuku-a",
    number: "01",
    name: "iLe.",
    nameLatin: "iLe. Harajuku",
    city: "Harajuku / Tokyo",
    cityShort: "HARAJUKU",
    address: "〒150-0001 東京都渋谷区神宮前6-10-8 原宿NAビル 4F",
    access: "原宿駅 徒歩7分 / 明治神宮前駅 徒歩2分",
    phone: "03-6427-5235",
    holidays: "年中無休",
    hotPepperUrl: "https://beauty.hotpepper.jp/slnH000499134/",
    openedAt: "2020-08-01",
    hours: "10:00 — 20:00",
    description:
      "創業の地。2020年8月、ここから iLe は始まった。原宿の小さな島として、すべての始まりとなった一店舗。",
    seoDescription:
      "iLe. 原宿（iLe. Harajuku）｜明治神宮前駅 徒歩2分・原宿駅 徒歩7分。2020年創業、iLe ブランド発祥の店。独自技術「エフェクトブリーチ」による透明感のあるハイトーンカラー・ブリーチが得意。年中無休、10:00–20:00。",
    badge: "— origin",
    heroImage: { url: "/salons/harajuku-a.jpg", width: 1600, height: 680 },
  },
  {
    slug: "harajuku-b",
    number: "02",
    name: "iLe.＋",
    nameLatin: "iLe.＋ Harajuku",
    city: "Harajuku / Tokyo",
    cityShort: "HARAJUKU",
    formerName: "nehus",
    address: "東京都渋谷区神宮前3-20-13 MANA表参道 2F",
    access: "原宿駅 徒歩7分 / 明治神宮前駅 徒歩5分",
    phone: "03-6447-0253",
    holidays: "年中無休",
    hotPepperUrl: "https://beauty.hotpepper.jp/slnH000635691/",
    openedAt: "2022-01-01",
    renamedAt: "2026-08-01",
    hours: "10:00 — 20:00",
    description:
      "同じ街の、もう一つの島。独立した空気と常連を持つ、原宿のもう一つの拠点。",
    seoDescription:
      "iLe.＋ 原宿（旧 nehus／iLe.＋ Harajuku）｜明治神宮前駅 徒歩5分・原宿駅 徒歩7分、表参道 MANA。独自技術「エフェクトブリーチ」によるダメージレスなハイトーン・デザインカラーが強み。年中無休、10:00–20:00。",
    badge: "— formerly nehus",
    heroImage: { url: "/salons/harajuku-b.jpg", width: 1600, height: 680 },
  },
  {
    slug: "nagaoka",
    number: "03",
    name: "iLe. 長岡",
    nameLatin: "iLe. Nagaoka",
    city: "Nagaoka / Niigata",
    cityShort: "NAGAOKA",
    formerName: "nehus 長岡",
    address: "〒940-2106 新潟県長岡市古正寺1-246-3",
    access: "イオン長岡店 裏（古正寺・千秋方面）",
    phone: "0258-77-6236",
    holidays: "年中無休",
    hotPepperUrl: "https://beauty.hotpepper.jp/slnH000742471/",
    openedAt: "2025-03-01",
    renamedAt: "2026-08-01",
    hours: "9:00 — 19:00",
    description:
      "雪の街の島。地域に深く根づいた、人と人の繋がりを大切にする店舗。",
    seoDescription:
      "iLe. 長岡（旧 nehus 長岡／iLe. Nagaoka）｜新潟県長岡市古正寺、イオン長岡店すぐ近く。地域に根ざしたサロンで、独自技術「エフェクトブリーチ」によるダメージレスなハイトーンカラーが人気。年中無休、9:00–19:00。",
    badge: "— formerly nehus 長岡",
    heroImage: { url: "/salons/nagaoka.jpg", width: 1600, height: 680 },
  },
  {
    slug: "nagoya",
    number: "04",
    name: "iLe. 名古屋",
    nameLatin: "iLe. Nagoya",
    city: "Nagoya / Aichi",
    cityShort: "NAGOYA",
    formerName: "nehus 名古屋",
    address: "〒460-0008 愛知県名古屋市中区栄3-19-7 PROTECT4 4F",
    access: "栄駅 徒歩9分 / 矢場町駅 徒歩6分",
    phone: "052-228-9783",
    holidays: "年中無休",
    hotPepperUrl: "https://beauty.hotpepper.jp/slnH000776236/",
    openedAt: "2025-11-01",
    renamedAt: "2026-08-01",
    hours: "10:00 — 20:00",
    description:
      "中部の島。名古屋に根を張った独立したコミュニティとともに歩む店舗。",
    seoDescription:
      "iLe. 名古屋（旧 nehus 名古屋／iLe. Nagoya）｜栄駅 徒歩9分・矢場町駅 徒歩6分、名古屋市中区栄。独自技術「エフェクトブリーチ」で透明感のあるハイトーンカラー・ブリーチを提案。年中無休、10:00–20:00。",
    badge: "— formerly nehus 名古屋",
    heroImage: { url: "/salons/nagoya.jpg", width: 1600, height: 680 },
  },
];

export const getSalon = (slug: string): Salon | undefined =>
  salons.find((s) => s.slug === slug);
