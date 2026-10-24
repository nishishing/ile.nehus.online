// hair-history.astro に並べる記事（2026-10-23）。記事ページの「テーマ別に見る」導線もここを見る（2026-10-24）。
// 🔴 載せるのは自動ブログの既存記事の slug だけ（説明文は各記事の summary）。
export const hairHistorySections = [
  {
    id: "black",
    heading: "黒染め・セルフカラーから明るくする",
    lead: "暗くした髪や市販カラーを重ねた髪を、ハイトーンに戻していくときの考え方です。",
    slugs: ["black-dye-selfcolor-to-hightone", "black-hair-to-hightone-flow", "self-vs-salon-bleach-difference"],
  },
  {
    id: "check",
    heading: "自分の髪はブリーチできる？",
    lead: "ダメージの見分け方と、一度でどこまで明るくできるかの話です。",
    slugs: [
      "can-my-hair-be-bleached-damage-check",
      "why-bleach-damages-hair-and-how-to-minimize",
      "bleach-once-brightness-reality",
      "bleach-once-twice-difference",
    ],
  },
  {
    id: "straight",
    heading: "縮毛矯正・パーマ・髪質改善の履歴",
    lead: "どちらも髪に負担がかかる施術なので、順番と間隔が大切です。",
    slugs: ["straightening-perm-history-bleach-care", "bleached-hair-perm-straightening-order", "hair-improvement-and-bleach-balance"],
  },
  {
    id: "fix",
    heading: "ムラ・失敗のお直しとケア",
    lead: "ムラになってしまった髪の相談と、毎日のケアです。",
    slugs: ["bleach-mura-onaoshi-guide", "bleached-hair-nighttime-care"],
  },
] as const;

export const hairHistorySlugs: readonly string[] = hairHistorySections.flatMap((s) => s.slugs);
