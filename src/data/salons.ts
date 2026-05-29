import type { Salon } from "~types/content";

/**
 * 4 salons under the unified iLe brand (as of 2026.08.01).
 *
 * NOTE: Address / phone / hours are placeholders pending confirmation
 * from the client. Real values will be filled before launch.
 */
export const salons: readonly Salon[] = [
  {
    slug: "harajuku-a",
    number: "01",
    name: "iLe 原宿",
    nameLatin: "iLe Harajuku A",
    city: "Harajuku / Tokyo",
    cityShort: "HARAJUKU A",
    address: "東京都渋谷区神宮前 X-XX-XX",
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
    address: "東京都渋谷区神宮前 X-XX-XX",
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
    address: "愛知県名古屋市 X-XX-XX",
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
    address: "新潟県長岡市 X-XX-XX",
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
