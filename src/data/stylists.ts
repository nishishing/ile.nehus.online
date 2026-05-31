import type { Stylist } from "~types/content";

/**
 * Director roster.
 *
 * The two co-representatives are carried over from the existing site with
 * their real profiles. The wider stylist roster (names, salons, IG handles,
 * portraits) is still pending from the operator.
 */
export const stylists: readonly Stylist[] = [
  {
    slug: "sakai-motoki",
    name: "Motoki Sakai",
    nameJa: "酒井 元樹",
    salonSlug: "harajuku-a",
    position: "共同代表 / エフェクトブリーチ開発者",
    profile:
      "独自開発の「エフェクトブリーチ」により、髪の芯を残したまま透明感を引き出すケミカルロジックの権威。感覚ではなく科学に基づいたダメージレスなベース作りは、全国の美容師が指標とする技術スタンダード。",
    specialties: ["エフェクトブリーチ", "ケミカル", "ベースメイク"],
  },
  {
    slug: "nishimura-ryo",
    name: "Nishimura Ryo",
    nameJa: "西村 涼",
    salonSlug: "harajuku-a",
    position: "共同代表 / バレイヤージュ",
    profile:
      "日本におけるバレイヤージュ技術の第一人者。圧倒的なデザインセンスと緻密な塗り分けにより、立体感と透け感を両立させるスペシャリスト。",
    specialties: ["バレイヤージュ", "レイヤーカット", "ハイトーンデザイン"],
  },
];
