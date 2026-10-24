// balayage.astro に並べる記事（2026-10-23）。記事ページの「テーマ別に見る」導線もここを見る（2026-10-24）。
// 🔴 載せるのは自動ブログの既存記事の slug だけ（説明文は各記事の summary）。
export const balayageSections = [
  {
    id: "basics",
    heading: "バレイヤージュ・ハイライトの基本",
    lead: "どんな技法か、ハイライトの太さや量でどう変わるかの話です。",
    slugs: ["highlight-balayage-dimensional-color-guide", "highlight-thickness-amount-difference", "lowlight-dimension-calm-haircolor"],
  },
  {
    id: "design",
    heading: "デザインと伸ばしかけ",
    lead: "根元が伸びてきても決まりやすいデザインと、まとめ髪での見せ方です。",
    slugs: ["long-balayage-growing-out-design", "highlight-innercolor-hair-arrange"],
  },
  {
    id: "mens",
    heading: "メンズのバレイヤージュ・ハイライト",
    lead: "短めのスタイルでも、少しの明暗差で印象が変わります。",
    slugs: ["mens-balayage-order-guide", "mens-highlight-mesh-dimension"],
  },
  {
    id: "gray",
    heading: "白髪をぼかす",
    lead: "白髪を塗りつぶさずに、明るい筋でなじませる考え方です。",
    slugs: ["grey-hair-highlight-guide", "escape-gray-dye-to-highlights", "mens-gray-blending-highlight"],
  },
  {
    id: "area",
    heading: "名古屋・長岡のコラム",
    lead: "地域ごとに、頼むときのポイントと通い方をまとめています。",
    slugs: ["nagoya-balayage-highlight-points", "nagaoka-niigata-highlight-balayage-seasons"],
  },
] as const;

export const balayageSlugs: readonly string[] = balayageSections.flatMap((s) => s.slugs);
