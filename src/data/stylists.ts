import type { Stylist } from "~types/content";

/**
 * Stylist roster. Real entries will be added once each salon
 * provides photos, bios, and Instagram handles.
 */
export const stylists: readonly Stylist[] = [
  {
    slug: "nishimura-ryo",
    name: "Nishimura Ryo",
    nameJa: "西村 涼",
    salonSlug: "harajuku-a",
    position: "Founder",
  },
  {
    slug: "stylist-harajuku-a-1",
    name: "Stylist A",
    salonSlug: "harajuku-a",
  },
  {
    slug: "stylist-harajuku-b-1",
    name: "Stylist B",
    salonSlug: "harajuku-b",
  },
  {
    slug: "stylist-nagoya-1",
    name: "Stylist C",
    salonSlug: "nagoya",
  },
  {
    slug: "stylist-nagoya-2",
    name: "Stylist D",
    salonSlug: "nagoya",
  },
  {
    slug: "stylist-nagaoka-1",
    name: "Stylist E",
    salonSlug: "nagaoka",
  },
];
