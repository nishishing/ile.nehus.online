import type { Salon } from "~types/content";

/**
 * 4 salons under the unified iLe brand (as of 2026.08.01).
 *
 * Address / access / Hot Pepper booking URLs are the real values carried
 * over from the existing site. STILL PENDING from the operator: phone,
 * hours, and holidays per salon (the legacy site did not list them) — the
 * `hours` values below are provisional placeholders until confirmed.
 */
export const salons: readonly Salon[] = [
  {
    slug: "harajuku-a",
    number: "01",
    name: "iLe 原宿",
    nameLatin: "iLe Harajuku A",
    city: "Harajuku / Tokyo",
    cityShort: "HARAJUKU A",
    address: "〒150-0001 東京都渋谷区神宮前6-10-8 原宿NAビル 4F",
    access: "原宿駅 徒歩7分 / 明治神宮前駅 徒歩2分",
    hotPepperUrl: "https://beauty.hotpepper.jp/slnH000499134/",
    openedAt: "2020-08-01",
    hours: "10:00 — 21:00",
    description:
      "創業の地。2020年8月、ここから iLe は始まった。原宿の小さな島として、すべての始まりとなった一店舗。",
    badge: "— origin",
    stylistCount: 8,
  },
  {
    slug: "harajuku-b",
    number: "02",
    name: "iLe 原宿",
    nameLatin: "iLe Harajuku B",
    city: "Harajuku / Tokyo",
    cityShort: "HARAJUKU B",
    formerName: "nehus",
    address: "東京都渋谷区神宮前3-20-13 MANA表参道 2F",
    access: "原宿駅 徒歩7分 / 明治神宮前駅 徒歩5分",
    hotPepperUrl: "https://beauty.hotpepper.jp/slnH000635691/",
    openedAt: "2022-01-01",
    renamedAt: "2026-08-01",
    hours: "10:00 — 21:00",
    description:
      "同じ街の、もう一つの島。独立した空気と常連を持つ、原宿のもう一つの拠点。",
    badge: "— formerly nehus",
    stylistCount: 6,
  },
  {
    slug: "nagoya",
    number: "03",
    name: "iLe 名古屋",
    nameLatin: "iLe Nagoya",
    city: "Nagoya / Aichi",
    cityShort: "NAGOYA",
    formerName: "nehus 名古屋",
    address: "愛知県名古屋市中区栄3-19-7 PROTECT4 4F",
    access: "栄駅 徒歩9分 / 矢場町駅 徒歩6分",
    hotPepperUrl: "https://beauty.hotpepper.jp/slnH000776236/",
    openedAt: "2023-01-01",
    renamedAt: "2026-08-01",
    hours: "10:00 — 20:00",
    description:
      "中部の島。名古屋に根を張った独立したコミュニティとともに歩む店舗。",
    badge: "— formerly nehus 名古屋",
    stylistCount: 5,
  },
  {
    slug: "nagaoka",
    number: "04",
    name: "iLe 長岡",
    nameLatin: "iLe Nagaoka",
    city: "Nagaoka / Niigata",
    cityShort: "NAGAOKA",
    formerName: "nehus 長岡",
    address: "新潟県長岡市古正寺1-246-3",
    access: "イオン長岡店 裏（古正寺・千秋方面）",
    hotPepperUrl: "https://beauty.hotpepper.jp/slnH000742471/",
    openedAt: "2024-01-01",
    renamedAt: "2026-08-01",
    hours: "10:00 — 19:00",
    description:
      "雪の街の島。地域に深く根づいた、人と人の繋がりを大切にする店舗。",
    badge: "— formerly nehus 長岡",
    stylistCount: 4,
  },
];

export const getSalon = (slug: string): Salon | undefined =>
  salons.find((s) => s.slug === slug);
