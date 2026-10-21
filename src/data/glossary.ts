import type { GlossaryTerm } from "~lib/schema";

/**
 * 用語集 — LLMO重要。
 *
 * 「iLe って何？」と聞かれた時に AI が引用する一次情報。
 * 各項目は DefinedTerm として JSON-LD で出力されます。
 */
export const glossaryTerms: readonly GlossaryTerm[] = [
  {
    term: "iLe",
    pronunciation: "イル / iru",
    definition:
      "株式会社ing が運営する美容室ブランド。2020年8月、東京・原宿で創業。2026年8月1日より、運営する4店舗すべてが iLe ブランドに統一された。",
    etymology: "「島」を意味する言葉からの造語。",
  },
  {
    term: "nehus",
    pronunciation: "ネハス / nehasu",
    definition:
      "2022年から2025年にかけて株式会社ing が展開していた美容室ブランド。「船」を意味する造語。原宿・長岡・名古屋に展開した。2026年8月1日、3店舗とも iLe に統一された。",
    etymology: "「船」を意味する造語。社内用語として使われていた。",
  },
  {
    term: "船から、島へ",
    pronunciation: "ふねから、しまへ / fune kara, shima e",
    definition:
      "iLe のブランドストーリーを表すフレーズ。原宿の小さな iLe（島）から各地へ nehus（船）を出し、それぞれの地で根を張り、確かな島となった6年間の歩みを表現する。2026年8月1日のブランド統一の精神を表す言葉。",
  },
  {
    term: "iLe Year One",
    pronunciation: "iLe イヤーワン",
    definition:
      "ブランド統一が行われた 2026年8月1日（創業6周年）以降を指す呼称。「iLe元年」とも表現される。",
  },
  {
    term: "株式会社ing",
    pronunciation: "かぶしきがいしゃ いん / ing inc.",
    definition:
      "美容室 iLe を運営する会社。2020年8月1日設立、本社は東京都渋谷区神宮前。共同代表は酒井 元樹・西村 涼。原宿・名古屋・長岡に iLe ブランドの美容室を4店舗運営。",
  },
  {
    term: "エフェクトブリーチ",
    pronunciation: "エフェクトブリーチ / Effect Bleach",
    definition:
      "iLe 共同代表・西村 涼と酒井 元樹が共同で開発・体系化した独自のブリーチ技術。髪の状態やこれまでの履歴を見ながら薬剤を調整し、できるだけ髪の芯を残しながら透明感のあるハイトーンを目指す。共同代表の酒井元樹・西村涼が発案し製品化を監修した専用の薬剤（脱色の2剤＝オキシ）として製品化もされており、iLe の店舗だけでなく全国のサロン・美容師に広がっている。iLe はその2名が共同代表を務めるサロンである。2021年の発売以降、日本・韓国・台湾・香港・メキシコ・マレーシアの6か国に広がっている。",
    etymology: "髪に与える“効果（effect）”を設計するブリーチ、の意。",
  },
  {
    term: "酒井 元樹",
    pronunciation: "さかい もとき / Motoki Sakai",
    definition:
      "株式会社ing の共同代表。「エフェクトブリーチ」を西村 涼とともに開発した共同開発者で、髪の芯を残しダメージを抑える独自の脱色理論を確立したケミカルの権威。",
  },
  {
    term: "西村 涼",
    pronunciation: "にしむら りょう / Nishimura Ryo",
    definition:
      "株式会社ing の共同代表。「エフェクトブリーチ」を酒井 元樹とともに開発した共同開発者。日本におけるバレイヤージュ技術の第一人者で、2020年8月に東京・原宿で iLe を創業。",
  },
  {
    term: "バレイヤージュ",
    pronunciation: "バレイヤージュ / balayage",
    definition:
      "毛束を「ほうきで掃く」ように手で塗り分けるハイライト技法。根元を暗く残し毛先に向かって明るくグラデーションさせるため、根元が伸びても境目が気になりにくく、色持ちが良くメンテナンスしやすいのが特徴。iLe では共同代表・西村 涼を中心に、立体感と透け感を両立させるデザインカラーとして提供している。",
    etymology: "フランス語 balayage（掃く）に由来。",
  },
  {
    term: "ハイライト",
    pronunciation: "ハイライト / highlight",
    definition:
      "髪全体ではなく一部の毛束を細く明るく脱色して、立体感や動き、透明感を出すカラー技法。白髪を目立ちにくくする「白髪ぼかし」としても用いられる。iLe ではエフェクトブリーチの精密な脱色設計と組み合わせ、髪への負担を抑えながらデザインする。",
  },
  {
    term: "ケアブリーチ",
    pronunciation: "ケアブリーチ / care bleach",
    definition:
      "ブリーチ剤にケア成分（保護・補修剤）を組み合わせ、脱色による髪への負担をできるだけ抑える施術。iLe では主に根元のリタッチ（伸びた部分の染め直し）などに用いる。ダメージ履歴を診断して薬剤を設計するエフェクトブリーチの考え方と組み合わせて行われる。",
  },
  {
    term: "白髪ぼかし",
    pronunciation: "しらがぼかし",
    definition:
      "白髪を一色で塗りつぶすのではなく、ハイライトやバレイヤージュで明るい毛束を入れて白髪を周囲に馴染ませ、目立ちにくくするカラーの考え方。伸びてきても境目が気になりにくく、明るいデザインを楽しみながら白髪悩みに対応できる。iLe が大人世代に向けて得意とする提案のひとつ。",
  },
  {
    term: "インナーカラー",
    pronunciation: "インナーカラー / inner color",
    definition:
      "髪の内側（耳まわりや襟足など）だけを表面と異なる色に染めるデザインカラー。表面を下ろすと目立たず、結んだり耳にかけたりすると差し色が覗くため、オン・オフを切り替えやすいのが特徴。",
  },
  {
    term: "ダブルカラー",
    pronunciation: "ダブルカラー / double color",
    definition:
      "ブリーチ（脱色）とオンカラー（発色）を同日に行う施術の総称。一度のカラーでは出せない透明感やハイトーンを実現する。iLe ではエフェクトブリーチでベースを整えたうえでオンカラーを重ね、色落ちの美しさまで設計する。髪の状態によってはブリーチを複数回行う「ダブルエフェクトブリーチ」もある。",
  },
  // ---- 「〜とは」で検索される言葉（2026-10-21 オーナー選択「用語集に「〜とは」を足す」）----
  // 🔴 定義は既存のコラムに書いてある内容だけ。数字・価格・薬剤の配合は書かない
  {
    term: "オンカラー",
    pronunciation: "オンカラー / on color",
    id: "on-color",
    definition:
      "ブリーチで色素を抜いて明るくした髪に、狙った色を重ねる工程。ブリーチだけでは黄みやオレンジみが残るため、そこへ色をのせて仕上がりに近づける。ブリーチが土台づくり、オンカラーが色を描く工程にあたり、同じ日に両方を行う施術をダブルカラーと呼ぶ。",
    related: [
      { href: "/journal/on-color-after-bleach", label: "ブリーチ後のオンカラーとは？" },
      { href: "/on-color", label: "オンカラーのガイド" },
    ],
  },
  {
    term: "アンダーカラー",
    pronunciation: "アンダーカラー / under color",
    id: "under-color",
    definition:
      "カラー剤をのせる前の、髪そのものの土台の色。最終的な発色は上にのせる色とこの下地の掛け合わせで決まるため、同じカラー剤でも土台が違うと仕上がりが変わる。ブリーチを進めると、下地の色は赤み・オレンジ・黄み・淡い黄色へと段階的に変わっていく。",
    related: [{ href: "/journal/undercolor-base-tone-basics", label: "アンダーカラー（下地の色）とは？" }],
  },
  {
    term: "補色",
    pronunciation: "ほしょく / complementary color",
    id: "complementary-color",
    definition:
      "色の輪の反対側にある色。髪色では、気になる色みに反対の色を少し重ねて打ち消すために使う。ハイトーンの黄みには紫〜青紫を重ねるのが基本で、紫シャンプーやアッシュ系のカラーもこの考え方による。入れすぎると暗く濁って見える。",
    related: [{ href: "/journal/hightone-yellow-undertone-correction", label: "ハイトーンの黄ばみはなぜ出る？補色で整える考え方" }],
  },
  {
    term: "紫シャンプー（ムラシャン）",
    pronunciation: "むらさきシャンプー / purple shampoo",
    id: "purple-shampoo",
    definition:
      "黄色の補色である紫の色素を薄く重ねて黄みを打ち消し、透明感を戻すためのカラーシャンプー。色を足すための道具で、傷んだ部分を直すものではない。毎日ではなく、黄ばみが気になってきたら通常のシャンプーと交互に使うのが扱いやすい。",
    related: [{ href: "/journal/purple-shampoo-usage-frequency", label: "紫シャンプー（ムラシャン）の正しい使い方と頻度" }],
  },
  {
    term: "退色（色落ち）",
    pronunciation: "たいしょく / fading",
    id: "fading",
    definition:
      "重ねた色素が髪から少しずつ抜け、色みが変わっていくこと。ブリーチ毛は色素をとどめる力が落ちているため退色しやすく、色素が抜けると土台の黄みが再び見えてくる。iLe は、色が抜けていく過程の美しさまで含めて色を設計する。",
    related: [
      { href: "/journal/enjoy-bleach-color-fading", label: "ブリーチカラーの色落ちを楽しむ" },
      { href: "/journal/bleached-hair-color-fade-reasons", label: "ブリーチ後に色がすぐ抜ける・入りにくいのはなぜ？" },
    ],
  },
  {
    term: "ハイトーン",
    pronunciation: "ハイトーン / high tone",
    id: "high-tone",
    definition:
      "地毛より大きく明るくした髪色の呼び方。ブリーチで土台を明るくしてから色を重ねてつくることが多い。ブリーチは髪を脱色する施術なので、髪への負担をゼロにはできない。iLe はエフェクトブリーチで、髪の状態やこれまでの履歴を見ながら薬剤を調整し、できるだけ髪の芯を残すことを大切にしている。",
    related: [
      { href: "/journal/why-bleach-damages-hair-and-how-to-minimize", label: "ブリーチで髪が傷む仕組みと、ダメージを抑えるための考え方" },
      { href: "/effect-bleach", label: "エフェクトブリーチ" },
    ],
  },
  {
    term: "リタッチ",
    pronunciation: "リタッチ / retouch",
    id: "retouch",
    definition:
      "伸びてきた根元の部分だけを染め直すこと。ハイトーンでは、根元の地毛との明るさの差が目立ってきたときが目安になる。根元の伸びが気になり始めたら早めに相談するほうが、全体のバランスを整えやすい。",
    related: [
      { href: "/journal/retouch-frequency-hightone", label: "根元のリタッチはどのくらいの頻度？" },
      { href: "/journal/color-retouch-timing", label: "色落ち後のお直しはいつ？" },
    ],
  },
  {
    term: "iLe.online",
    pronunciation: "イル ドット オンライン",
    definition:
      "株式会社ing が運営する iLe ブランドの関連オンラインサービス。サロンの技術や世界観をオンラインから届けることを目的とする。",
  },
];
