// /on-color（オンカラーのまとめページ）に載せる記事の並び（2026-10-21 オーナー選択「両方進める」）。
// 記事ページにも「オンカラーのまとめ」への導線を出すので、ここが唯一の一覧。
// 🔴 載せるのは自動ブログの既存記事の slug だけ（説明文は各記事の summary を使う＝新しい事実を足さない）。
export const onColorGuide = [
  {
    id: "basics",
    heading: "オンカラーの基本",
    lead: "ブリーチで明るくした髪に色を重ねる工程と、その仕上がりを左右する「下地の色」の話です。",
    slugs: ["on-color-after-bleach", "undercolor-base-tone-basics", "double-color-transparency-mechanism"],
  },
  {
    id: "colors",
    heading: "色の選び方",
    lead: "よく相談される色ごとに、ブリーチとの関係や色持ちの考え方をまとめています。",
    groups: [
      { heading: "ベージュ・ピンク系", slugs: ["milk-tea-beige-bleach-basics", "what-is-greige", "pink-beige-high-tone-guide"] },
      {
        heading: "透明感・寒色系",
        slugs: [
          "ash-color-transparency-fade-care",
          "olive-matte-color-transparency",
          "lavender-color-yellow-control",
          "blue-black-cool-dark-hair",
          "korean-high-tone-transparent-color-guide",
          "transparent-color-personal-color",
        ],
      },
      { heading: "ホワイト・シルバー", slugs: ["white-color-process-and-cautions", "silver-white-silver-bleach-design"] },
      {
        heading: "部分的に入れる",
        slugs: ["inner-color-design-color-face-framing", "suso-color-point-color-guide", "highlight-innercolor-hair-arrange"],
      },
    ],
  },
  {
    id: "fade",
    heading: "黄ばみ・色落ちと付き合う",
    lead: "ハイトーンは色が抜けていくのが前提です。なぜ抜けるのか、どう変わっていくのかを知っておくと慌てずに済みます。",
    slugs: [
      "hightone-yellow-undertone-correction",
      "bleached-hair-color-fade-reasons",
      "enjoy-bleach-color-fading",
      "summer-uv-haircolor-fade-care",
      "pool-sea-chlorine-seawater-hightone-fade",
    ],
  },
  {
    id: "care",
    heading: "色を長持ちさせるホームケア",
    lead: "毎日の洗い方・乾かし方と、紫シャンプーの使いどころです。",
    slugs: ["purple-shampoo-usage-frequency", "color-longevity-wash-dry-basics", "bleach-aftercare-home"],
  },
  {
    id: "retouch",
    heading: "お直しのタイミング",
    lead: "色が抜けてきたとき、根元が伸びてきたときの考え方です。",
    slugs: ["color-retouch-timing", "retouch-frequency-hightone"],
  },
] as const;

export const onColorSlugs: readonly string[] = onColorGuide.flatMap((s) =>
  "groups" in s ? s.groups.flatMap((g) => g.slugs) : s.slugs,
);
