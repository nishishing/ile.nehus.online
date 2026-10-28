import { writeFileSync, mkdirSync, readFileSync, existsSync } from "fs";

// 各サービスの「資料の内容」（Notion資料/PDFから起こした文章）
const DOSSIER = existsSync("./writeups.json")
  ? Object.fromEntries(JSON.parse(readFileSync("./writeups.json", "utf8")).map((d) => [d.sid, d]))
  : {};

const OUT = process.argv[2] || "./out";
mkdirSync(OUT, { recursive: true });

const LINE_URL = "https://lin.ee/aQTLZGG";
const OC_URL = "https://line.me/ti/g2/Mzs6FgiX6-gHl9kRAesPADRvcjVkVdlc-wPdCg?utm_source=invitation&utm_medium=link_copy&utm_campaign=default";
const LP_URL = "https://drive-blue.online/test/";
const SALOPIT_URL = "https://salopit.vercel.app"; // 別サイト（別の人が作成・この担当は中身を触らない）。2026-10-23 オーナー指示でトップ上部から案内
const ABOUT = "/about"; // 自前の説明LP（旧: LP_URL 外部）

const categories = ["開業支援", "不動産", "内装業者", "財務", "福利厚生", "材料", "ヘアスタイル販売", "教育", "集客", "予約サービス"];

const services = [
  { id:"salon-start", cat:"開業支援", name:"Salon Start（0円開業）", desc:"0円開業の導線設計。融資・事業計画などの相談に対応。" },
  { id:"next-beauty-tech", cat:"開業支援", name:"NEXT BEAUTY TECH（融資・事業計画）", desc:"融資・事業計画の相談サポート。" },
  { id:"stylebase", cat:"開業支援", name:"StyleBase 開業支援", desc:"開業準備〜運営の立ち上げ支援。" },

  { id:"mutas", cat:"不動産", name:"ムータス（不動産専属 事業提携）", desc:"不動産専門事業提携。" },
  { id:"real-estate-salon", cat:"不動産", name:"美容室専門の不動産屋（テナント・居抜き・M&A）", desc:"テナント・居抜き・M&Aまで美容室特化で対応。" },

  { id:"plum-plan", cat:"内装業者", name:"PLUM PLAN", desc:"内装・運営から空間設計までトータルサポート。" },
  { id:"layer-design-works", cat:"内装業者", name:"Layer Design Works", desc:"内装業界最安値クラスを目指す施工パートナー。" },
  { id:"sunny-side-life", cat:"内装業者", name:"SUNNY SIDE LIFE", desc:"内装・空間づくりの相談先。" },

  { id:"imamura-fp", cat:"財務", name:"税務調査対策 × 保険（元国税調査官 今村FP）", desc:"税務調査対策×保険（財務面の守りを強化）。" },

  { id:"materials-intro", cat:"材料", name:"材料（仕入れ紹介）", desc:"材料（仕入れ）の紹介・相談。" },
  { id:"drive-blue", cat:"材料", name:"ドライブブルー", desc:"エフェクトブリーチ・イリーダの業務用発注サイト。" },
  { id:"liverty", cat:"福利厚生", name:"携帯電話プラン（ソフトバンク・BCC限定）", desc:"ソフトバンクのBCC限定プラン。通信料削減・最新iPhone・福利厚生・節税に。" },

  { id:"hairstyle-market", cat:"ヘアスタイル販売", name:"ヘアスタイル販売サイト", desc:"ヘアスタイルの販売プラットフォーム。" },

  { id:"tonari-seminar", cat:"教育", name:"隣店セミナー講師紹介", desc:"セミナー講師の紹介・マッチング。" },
  { id:"haircamp", cat:"教育", name:"ヘアキャンプスクール", desc:"学びを継続しやすい教育プログラム。" },
  { id:"toko", cat:"教育", name:"企業向け 人材育成・採用支援サービス（都甲）", desc:"育成と採用の仕組み化を支援。" },

  { id:"tete-lab", cat:"集客", name:"TETE LAB（HPB完全攻略 / WEB集客）", desc:"HPB完全攻略 / WEB集客の支援。" },
  { id:"atsukyakumania", cat:"集客", name:"集客マニア（ホットペッパー / Google）", desc:"ホットペッパー・Google（MEO/SEO）などの集客支援。" },
  { id:"ones", cat:"集客", name:"ONE's 流 集客サポート", desc:"ホットペッパー・ミニモ中心の集客支援。" },
  { id:"stylepost", cat:"集客", name:"スタイルポスト（HPBスタイル/ブログ）", desc:"ホットペッパースタイル/ブログのサポート。" },
  { id:"freed", cat:"集客", name:"フリード（TikTokコンサル / 運用代行）", desc:"TikTokのコンサル・運用代行。" },
  { id:"instagram", cat:"集客", name:"Instagramコンサル＆運用代行", desc:"Instagramの設計〜運用までサポート。" },
  { id:"biyoushijuku", cat:"集客", name:"美容師塾（SNS集客コンサル）", desc:"美容師専門のマンツーマン集客コンサル。SNSで新規・指名・売上を伸ばす。" }, // 2026-10-28 オーナー「美容師塾内容がちょっと変わってます！」で資料（コンサルLP_実績版_配布用_2026-10.pdf）に差し替え
  { id:"miseba", cat:"集客", name:"MISEBA（美容師のSNS分析アプリ）", desc:"今伸びている美容師リールの実データで、インスタの新規集客を伸ばす美容師専用アプリ。" }, // 2026-10-28 オーナー「あともう一つ、集客コンテンツ追加！」（資料 MISEBA紹介_配布用_2026-10.pdf・LP）
  { id:"gita", cat:"集客", name:"美容室専門 TikTokコンサル（ギータ）", desc:"美容室特化のTikTok戦略支援。" },

  { id:"refundhub", cat:"予約サービス", name:"RefundHub（キャンセル請求・再予約）", desc:"キャンセル請求・再予約の導線づくり。" },
];

const enOf = {
  "開業支援":"Open","不動産":"Real estate","内装業者":"Interior","財務":"Finance","福利厚生":"Benefits","材料":"Materials",
  "ヘアスタイル販売":"Hairstyle","教育":"Education","集客":"Marketing","予約サービス":"Reservation",
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const STYLE = `:root{
  --bg:#f3f7fc;
  --surface:#ffffff;
  --ink:#0f1a2b;
  --soft-ink:#2c3a52;
  --muted:#5f6c82;
  --line:#e1e8f1;
  --hair:#c9d5e4;
  --gold:#1f63d6; /* 差し色（名前は旧ゴールドのまま・2026-10-27 青へ変更） */
  --tint:#e8f0fd;
  --radius:6px;
  --max:1080px;
  --font-serif:'Cormorant Garamond',Georgia,serif;
  --font-jp:'Inter','Zen Kaku Gothic New',-apple-system,BlinkMacSystemFont,"Hiragino Kaku Gothic ProN","Noto Sans JP",sans-serif;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;font-family:var(--font-jp);background:var(--bg);color:var(--ink);line-height:1.85;font-weight:400;-webkit-font-smoothing:antialiased;letter-spacing:.01em}
a{color:inherit;text-decoration:none}
.container{width:min(var(--max),calc(100% - 48px));margin:auto}
.serif{font-family:var(--font-serif)}
em{font-style:italic}
.komoji{text-transform:uppercase;letter-spacing:.28em;font-size:.7rem;font-weight:500;color:var(--muted)}

/* reveal */
html.js .reveal{opacity:0;transform:translateY(16px);transition:opacity 1s cubic-bezier(.2,.7,.2,1),transform 1s cubic-bezier(.2,.7,.2,1)}
html.js .reveal.in{opacity:1;transform:none}

/* nav */
.sem-card{display:flex;align-items:center;gap:18px;max-width:640px;margin:40px auto 0;padding:16px 18px 16px 22px;background:var(--surface);border:1px solid var(--line);border-radius:16px;box-shadow:0 10px 30px rgba(15,23,42,.08);text-align:left;color:var(--ink);text-decoration:none;transition:transform .2s,box-shadow .2s}
.sem-card:hover{transform:translateY(-2px);box-shadow:0 14px 34px rgba(15,23,42,.12)}
.sem-card .sem-tag{flex:none;font-size:.7rem;font-weight:700;letter-spacing:.08em;color:#fff;background:var(--ink);padding:5px 10px;border-radius:999px}
.sem-card .sem-txt{flex:1;line-height:1.55}
.sem-card .sem-txt b{display:block;font-size:1rem}
.sem-card .sem-txt small{display:block;font-size:.8rem;color:var(--muted,#64748b)}
.sem-card .nw{white-space:nowrap}
.sem-card .sem-go{flex:none;padding:10px 16px;border-radius:999px;background:#06c755;color:#fff;font-weight:700;font-size:.82rem;white-space:nowrap}
@media(max-width:680px){.sem-card{flex-direction:column;align-items:stretch;gap:10px;margin-top:32px;padding:16px;text-align:center}.sem-card .sem-tag{align-self:center}.sem-card .sem-go{text-align:center;padding:12px}}
.nav{position:sticky;top:0;z-index:40;background:rgba(255,255,255,.86);backdrop-filter:saturate(150%) blur(12px);border-bottom:1px solid var(--line)}
.nav-inner{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:20px 0}
.brand{font-family:var(--font-serif);font-weight:600;letter-spacing:.06em;font-size:1.45rem}
.nav-links{display:flex;align-items:center;gap:30px}
.nav-links a{color:var(--soft-ink);font-size:.84rem;letter-spacing:.06em;font-weight:600}
.nav-links a:hover{color:var(--ink)}
.btn-join{border:1px solid var(--ink);color:var(--ink);padding:9px 20px;border-radius:999px;font-size:.74rem;letter-spacing:.14em;text-transform:uppercase;transition:.25s}
.btn-join:hover{background:var(--ink);color:var(--surface)}
@media(max-width:680px){.nav-links a.hide-sp{display:none}}
@media(max-width:680px){.nav-links{gap:10px}.nav-links a.nav-about{font-size:.74rem;padding:7px 12px;border:1px solid var(--line);border-radius:999px;background:var(--surface);white-space:nowrap}}

/* hero */
.hero{position:relative;overflow:hidden;min-height:min(92vh,820px);display:grid;place-items:center;text-align:center;padding:96px 0}
.hero::before{content:"";position:absolute;inset:0;z-index:0;background-image:linear-gradient(rgba(31,99,214,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(31,99,214,.07) 1px,transparent 1px);background-size:28px 28px;-webkit-mask-image:radial-gradient(80% 70% at 50% 45%,#000 40%,transparent 100%);mask-image:radial-gradient(80% 70% at 50% 45%,#000 40%,transparent 100%)}
.hero-mark{position:absolute;z-index:0;bottom:-6%;left:50%;transform:translateX(-50%);font-family:var(--font-serif);font-weight:600;font-size:min(40vw,520px);line-height:1;color:rgba(31,99,214,.05);user-select:none;letter-spacing:.02em;white-space:nowrap}
.hero-inner{position:relative;z-index:2;padding:0 20px;max-width:880px}
.hero .eyebrow{display:block;text-transform:uppercase;letter-spacing:.34em;font-size:.72rem;color:var(--muted);font-weight:500;margin:0 0 30px}
.hero h1{font-family:var(--font-jp);font-weight:700;font-size:clamp(2.2rem,6.2vw,4.4rem);line-height:1.28;letter-spacing:.02em;margin:0}
.hero .rule{width:54px;height:1px;background:var(--gold);opacity:.7;margin:34px auto}
.hero .kicker{font-family:var(--font-serif);font-style:italic;font-weight:500;font-size:clamp(1.2rem,2.6vw,1.7rem);color:var(--soft-ink);margin:0;letter-spacing:.01em}
.hero-sub{margin:22px auto 0;font-size:clamp(.95rem,1.6vw,1.05rem);color:var(--muted);max-width:540px;line-height:2}
.hero-cta{margin-top:40px;display:inline-flex;gap:14px;flex-wrap:wrap;justify-content:center}
.hero-cta a{padding:15px 34px;font-size:.78rem;letter-spacing:.16em;text-transform:uppercase;transition:.25s}
.hero-cta .primary{background:var(--ink);color:var(--surface);border:1px solid var(--ink)}
.hero-cta .primary:hover{background:transparent;color:var(--ink)}
.hero-cta .ghost{background:transparent;color:var(--ink);border:1px solid var(--hair)}
.hero-cta .ghost:hover{border-color:var(--ink)}
.scrollcue{position:absolute;left:50%;bottom:30px;transform:translateX(-50%);z-index:2;color:var(--muted);display:flex;flex-direction:column;align-items:center;gap:10px}
.scrollcue span{text-transform:uppercase;letter-spacing:.26em;font-size:.64rem}
.scrollcue .line{width:1px;height:40px;background:linear-gradient(var(--hair),transparent);animation:cue 2s ease-in-out infinite}
@keyframes cue{0%,100%{opacity:.25;transform:scaleY(.55)}50%{opacity:1;transform:scaleY(1)}}

/* feature (サロピット) */
.feature{padding:72px 0 0}
.feat{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:30px;background:var(--surface);border:1px solid var(--line);padding:36px 40px;transition:.35s cubic-bezier(.2,.7,.2,1)}
a.feat:hover{background:#fff;border-color:var(--hair)}
.feat .fmark{width:72px;height:72px;border-radius:14px;background:var(--ink);display:grid;place-items:center;font-family:var(--font-serif);font-weight:600;font-size:1.5rem;color:var(--gold);letter-spacing:.04em}
.feat .ctag{margin:0 0 8px}
.feat h3{font-family:var(--font-jp);font-weight:600;font-size:clamp(1.15rem,2.2vw,1.4rem);margin:0 0 10px;letter-spacing:.03em;line-height:1.5}
.feat p{margin:0;color:var(--muted);font-size:.9rem;line-height:1.9}
.feat .more{display:inline-flex;align-items:center;gap:10px;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);font-weight:600;white-space:nowrap}
.feat .more .arw{transition:transform .3s}
a.feat:hover .more .arw{transform:translateX(8px)}
@media(max-width:760px){.feat{grid-template-columns:1fr;gap:18px;padding:30px 24px}.feat .fmark{width:56px;height:56px;font-size:1.2rem}}

/* お悩みから選ぶ */
.finder{display:grid;grid-template-columns:repeat(2,1fr);gap:0 48px;max-width:980px;margin:0 auto;border-top:1px solid var(--hair)}
.frow{padding:22px 0;border-bottom:1px solid var(--line)}
.fwhen{margin:0;color:var(--muted);font-size:.9rem}
.fpick{margin:6px 0 0;font-weight:600;font-size:1.02rem;line-height:1.6}
.frow{display:block;color:var(--ink)}
.fpick span{border-bottom:1px solid var(--gold);padding-bottom:1px}
a.frow:hover .fpick{color:var(--gold)}
.fpick span::after{content:" →";color:var(--gold);font-weight:400}
.fnum{display:none}
.fbody{display:block}
/* パソコン: 押せるカードを2列（スマホは下の max-width:760px のまま・2026-10-27 オーナー「パソコンバージョンは…見せ方が弱い」） */
@media(min-width:761px){
  .finder{border-top:0;gap:18px;max-width:none}
  #find .sec-head h2{font-weight:700;font-size:2.6rem}
  #find .sec-head p{font-size:1.02rem;color:var(--soft-ink)}
  .frow{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:20px;background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:22px 26px;transition:.25s}
  .frow::after{content:"→";color:var(--gold);font-size:1.3rem;font-weight:700;transition:transform .25s}
  a.frow:hover{border-color:var(--gold);box-shadow:0 10px 28px rgba(31,99,214,.10);transform:translateY(-2px)}
  a.frow:hover::after{transform:translateX(4px)}
  .fnum{display:grid;place-items:center;width:64px;height:64px;border-radius:14px;background:var(--tint);color:var(--gold);font-size:1.7rem;font-weight:700;line-height:1}
  .fnum small{font-size:.7rem;font-weight:600;margin-top:-10px}
  .fwhen{color:var(--ink);font-size:1.12rem;font-weight:700;line-height:1.5;letter-spacing:.01em}
  .fpick{margin-top:4px;font-size:.88rem;font-weight:600;color:var(--gold)}
  .fpick span{border-bottom:0}
  .fpick span::after{content:""}
}
@media(max-width:760px){.finder{grid-template-columns:1fr;border-top:0;gap:10px}.frow{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:14px 16px}}
@media(max-width:430px){.hero h1{font-size:1.85rem}}
.hero-cta a.jp{letter-spacing:.06em;text-transform:none;font-size:.9rem;font-weight:600;border-radius:999px}
.hero .eyebrow.jp{text-transform:none;letter-spacing:.12em;font-size:.86rem;color:var(--gold);font-weight:700;margin-bottom:22px}
.hero h1 .hl{background:linear-gradient(transparent 62%,var(--tint) 62%)}
.hero-sub b{color:var(--ink);font-weight:700}
.hstats{display:flex;justify-content:center;gap:12px;margin:34px auto 0;flex-wrap:wrap}
.hstats div{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:12px 18px;min-width:120px}
.hstats strong{display:block;font-size:1.5rem;font-weight:700;color:var(--gold);line-height:1.2}
.hstats span{font-size:.78rem;color:var(--muted)}
@media(max-width:760px){.hero{min-height:auto;padding:64px 0 72px}.hero-cta{display:flex;flex-direction:column;align-items:stretch;max-width:340px;margin-left:auto;margin-right:auto}.hstats div{min-width:0;flex:1;padding:10px 8px}.hstats strong{font-size:1.25rem}.hstats span{font-size:.7rem}.scrollcue{display:none}}

/* BCCでできること */
.does{padding:72px 0 24px}
.does h2{text-align:center;font-weight:700;font-size:clamp(1.4rem,3vw,2rem);margin:0 0 8px;letter-spacing:.03em}
.does .dlead{text-align:center;color:var(--muted);margin:0 0 34px;font-size:.95rem}
.dgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.dcard{display:flex;flex-direction:column;gap:10px;background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:26px 24px;transition:.25s}
a.dcard:hover{border-color:var(--gold);transform:translateY(-2px)}
.dcard .dn{width:38px;height:38px;border-radius:50%;background:var(--tint);color:var(--gold);display:grid;place-items:center;font-weight:700}
.dcard h3{margin:0;font-size:1.1rem;font-weight:700;line-height:1.5}
.dcard p{margin:0;color:var(--muted);font-size:.88rem;line-height:1.8;flex:1}
.dcard .go{color:var(--gold);font-weight:700;font-size:.88rem}
.dcard .new{display:inline-block;margin-left:8px;font-size:.66rem;background:var(--gold);color:#fff;border-radius:999px;padding:2px 8px;vertical-align:3px;letter-spacing:.06em}
@media(max-width:760px){.dgrid{grid-template-columns:1fr;gap:12px}.dcard{display:grid;grid-template-columns:auto 1fr;column-gap:14px;row-gap:4px;padding:18px}.dcard .dn{grid-row:span 3}.dcard p{font-size:.84rem}}

/* 紹介ページ: 登録すると相談できること */
.mgrid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;max-width:1080px;margin:0 auto}
.mcell{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:16px 16px 18px;display:flex;flex-direction:column;gap:6px}
.mcat{color:var(--gold);font-weight:700;font-size:.95rem}
.mwhen{color:var(--muted);font-size:.8rem;line-height:1.6}
.mnote{text-align:center;color:var(--muted);font-size:.85rem;margin:26px 0 0}
@media(max-width:980px){.mgrid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:560px){.mgrid{grid-template-columns:repeat(2,1fr);gap:8px}.mcell{padding:12px 12px 14px}.mcat{font-size:.88rem}.mwhen{font-size:.72rem}}

/* 詳細ページ（2026-10-28 全ページ共通の作り込み） */
.detail-hero .gtag{margin:0 0 12px}
.dprice{margin:14px 0 0;font-weight:700;color:var(--ink);font-size:1rem}
.dprice span{display:inline-block;margin-right:8px;font-size:.7rem;font-weight:600;color:var(--gold);background:var(--tint);border-radius:999px;padding:2px 10px;vertical-align:2px}
.dpoints{list-style:none;padding:0;margin:18px 0 6px;display:flex;flex-wrap:wrap;gap:8px;max-width:720px}
.dpoints li{background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:6px 14px 6px 32px;position:relative;font-size:.88rem;font-weight:600;color:var(--soft-ink)}
.dpoints li::before{content:"";position:absolute;left:13px;top:50%;width:10px;height:6px;border-left:2px solid var(--gold);border-bottom:2px solid var(--gold);transform:translateY(-70%) rotate(-45deg)}
.detail .btn,.dbottom .btn{border-radius:999px;font-size:.86rem;letter-spacing:.06em;text-transform:none;font-weight:700;padding:17px}
.detail .btn-line,.dbottom .btn-line{background:#06c755;border-color:#06c755;color:#fff}
.detail .btn-line:hover,.dbottom .btn-line:hover{background:#05b04b;color:#fff}
.dworry{margin:0 0 50px}
.dworry-item{margin:0 0 8px;background:var(--surface);border:1px solid var(--line);border-left:3px solid var(--gold);border-radius:10px;padding:12px 16px;font-weight:600;color:var(--soft-ink)}
.dflow{margin-top:50px}
.dsteps{list-style:none;counter-reset:d;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:780px}
.dsteps li{counter-increment:d;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:18px 18px 18px;display:flex;flex-direction:column;gap:6px}
.dsteps li::before{content:counter(d);width:30px;height:30px;border-radius:50%;background:var(--tint);color:var(--gold);display:grid;place-items:center;font-weight:700}
.dsteps strong{font-size:.98rem}
.dsteps span{color:var(--muted);font-size:.85rem;line-height:1.7}
@media(max-width:680px){.dsteps{grid-template-columns:1fr}.dsteps li{display:grid;grid-template-columns:auto 1fr;column-gap:12px}.dsteps li::before{grid-row:span 2}}
.dbottom{padding:60px 0 10px}
.dbottom-box{max-width:780px;background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:30px 28px}
.dbottom-k{margin:0 0 6px;color:var(--gold);font-weight:700;font-size:.8rem}
.dbottom-h{margin:0;font-weight:700;font-size:1.15rem;line-height:1.6}
.dbottom-box .panelbox{max-width:none}
.dbottom-box .panelbox h2{display:none}
.dothers{padding:50px 0 30px}
.dothers-list{display:flex;flex-wrap:wrap;gap:10px;max-width:780px}
.dothers-list a{display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:10px 14px;font-weight:700;font-size:.9rem}
.dothers-list a:hover{border-color:var(--gold)}
.dothers-list small{color:var(--gold);font-weight:600;font-size:.72rem}
.dsticky{position:fixed;left:0;right:0;bottom:0;z-index:60;padding:10px 16px calc(10px + env(safe-area-inset-bottom));background:rgba(255,255,255,.94);backdrop-filter:blur(8px);border-top:1px solid var(--line);display:flex;justify-content:center}
.dsticky a{display:block;width:100%;max-width:520px;text-align:center;background:#06c755;color:#fff;font-weight:700;border-radius:999px;padding:14px;font-size:.92rem}
main.has-dsticky{padding-bottom:84px}

/* ジャンル専用ページ */
.detail.genre-hero{padding-bottom:8px}
.detail.genre-hero h1{font-weight:700;margin-bottom:6px}
.genre-hero .back{display:flex;width:max-content}
.gsub{margin:0 0 6px;color:var(--muted);font-weight:600}
@media(max-width:760px){.detail.genre-hero{padding-top:36px}.genre-hero .back{margin-bottom:20px}.genre-list{padding-top:20px}}
.gtag{display:inline-block;margin:0 0 14px;background:var(--tint);color:var(--gold);font-weight:700;font-size:.85rem;border-radius:999px;padding:4px 14px}
.genre-hero .lead strong{color:var(--gold)}
.genre-list{padding-top:36px}
.grid.one{grid-template-columns:1fr;max-width:520px;margin:0 auto}
.subgroup+.subgroup{margin-top:40px}
.krow+.krow{margin-top:14px}
.subgroup .grid.two{max-width:none;margin:0;grid-template-columns:repeat(3,1fr)}
@media(max-width:880px){.subgroup .grid.two{grid-template-columns:repeat(2,1fr)}}
/* 見出しの高さをそろえる（ラベルや料金の段落が伸びないように） */
.card .ctag,.card .cprice{flex:none}
.subh{display:flex;align-items:center;gap:10px;font-size:1.15rem;font-weight:700;margin:0 0 14px;padding-left:12px;border-left:4px solid var(--gold);line-height:1.3}
.subh span{font-size:.78rem;font-weight:600;color:var(--gold);background:var(--tint);border-radius:999px;padding:2px 10px}
.subgroup .grid.one{margin:0;max-width:none;grid-template-columns:repeat(3,1fr)}
@media(max-width:880px){.subgroup .grid.one{grid-template-columns:repeat(2,1fr)}}
.genre-others{margin-top:64px}
.genre-others h2{font-size:1.15rem;font-weight:700;margin:0 0 16px}
.gchips{display:flex;flex-wrap:wrap;gap:10px}
.gchips a{background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:9px 16px;font-size:.88rem;color:var(--soft-ink);font-weight:600}
.gchips a:hover{border-color:var(--gold);color:var(--gold)}

/* sections */
section{padding:108px 0}
.alt{background:var(--surface);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.sec-head{text-align:center;max-width:680px;margin:0 auto 64px}
.sec-head .lbl{margin:0 0 20px}
.sec-head h2{font-family:var(--font-jp);font-weight:500;font-size:clamp(1.7rem,3.4vw,2.6rem);margin:0;letter-spacing:.03em;line-height:1.4}
.sec-head h2 em{font-style:normal;font-family:var(--font-serif);font-weight:600;letter-spacing:.01em;color:var(--gold)}
.sec-head p{color:var(--muted);margin:20px 0 0;font-size:.96rem}

/* tabs */
.tabs{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin:0 auto 64px;max-width:940px}
.tab{border:1px solid var(--hair);background:transparent;color:var(--soft-ink);font-family:var(--font-jp);font-weight:600;font-size:1.02rem;letter-spacing:.05em;padding:14px 30px;border-radius:999px;cursor:pointer;white-space:nowrap;transition:.22s}
.tab:hover{border-color:var(--ink);color:var(--ink)}
.tab.on{background:var(--ink);color:var(--surface);border-color:var(--ink)}
@media(max-width:680px){.tab{font-size:.92rem;padding:12px 22px}}

/* category block (すべて) */
.cat-block{margin-bottom:72px}
.cat-bar{display:flex;align-items:baseline;gap:18px;border-bottom:1px solid var(--hair);padding-bottom:18px;margin-bottom:34px}
.cat-bar .idx{font-family:var(--font-serif);font-size:1.5rem;color:var(--gold);font-weight:600;line-height:1}
.cat-bar h3{font-family:var(--font-jp);font-weight:500;font-size:1.2rem;margin:0;letter-spacing:.04em}
.cat-bar .en{font-family:var(--font-serif);font-style:italic;color:var(--gold);font-size:1rem}
.cat-bar .cnt{margin-left:auto;color:var(--muted);font-size:.7rem;letter-spacing:.18em;text-transform:uppercase}

/* cards */
.grid{display:grid;gap:14px;grid-template-columns:repeat(3,1fr)}
.grid.two{grid-template-columns:repeat(2,1fr);max-width:760px;margin:0 auto}
@media(max-width:880px){.grid{grid-template-columns:repeat(2,1fr)}.grid.two{grid-template-columns:repeat(2,1fr)}}
/* スマホ: カードを2列に詰める（2026-10-27 オーナー「スマホ版だと縦に下に長すぎて…2列か3列にして」） */
@media(max-width:560px){
  .grid{gap:10px}
  .grid .card{padding:16px 14px 14px;min-height:0;gap:8px}
  .grid .card .ctag{display:none}
  .grid .cmark{width:40px;height:40px;border-radius:9px}
  .grid .cmark img{padding:5px}
  .grid .cmark .mono{font-size:1.15rem}
  .grid .card h4{font-size:.95rem;line-height:1.4}
  .grid .card h4 .csub{font-size:.7rem;margin-top:3px}
  .grid .card p{font-size:.76rem;line-height:1.6;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
  .grid .cpts{font-size:.76rem;line-height:1.5}
  .grid .cpts li{padding-left:11px;margin-top:3px}
  .grid .cpts li::before{width:5px;height:5px}
  .grid .cprice{font-size:.72rem}
  .grid .cprice span{display:block;width:max-content;margin:0 0 2px}
  .grid .card .more{font-size:.68rem;letter-spacing:.08em}
  .grid.one .card{min-height:0}
}
.hero-sub strong,.lead strong{color:var(--gold);font-weight:700}
.card{position:relative;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:30px 30px 30px;transition:.35s cubic-bezier(.2,.7,.2,1);display:flex;flex-direction:column;gap:14px;min-height:230px}
a.card:hover{background:#fff;border-color:var(--gold);box-shadow:0 10px 28px rgba(31,99,214,.10)}
.cmark{width:52px;height:52px;border-radius:11px;border:1px solid var(--line);background:#fff;display:grid;place-items:center;overflow:hidden;flex:none}
.cmark img{width:100%;height:100%;object-fit:contain;padding:8px}
.cmark.dark{background:var(--ink);border-color:var(--ink)}
.cmark .mono{font-family:var(--font-serif);font-weight:600;font-size:1.5rem;color:var(--gold);line-height:1}
.card .ctag{margin:0}
.card h4{font-family:var(--font-jp);font-weight:700;font-size:1.08rem;margin:0;line-height:1.5;letter-spacing:.02em}
/* 言葉の途中で切らず、空白・「/」の位置で折り返す（入り切らない時だけ途中で切る） */
.card h4,.card h4 .csub{word-break:keep-all;overflow-wrap:anywhere}
.cpts{list-style:none;margin:0;padding:0;flex:1;color:var(--soft-ink);font-size:.86rem;line-height:1.6}
.cpts li{position:relative;padding-left:14px;margin-top:4px}
.cpts li::before{content:"";position:absolute;left:0;top:.62em;width:6px;height:6px;border-radius:50%;background:var(--gold);opacity:.55}
.cprice{margin:6px 0 0;font-size:.82rem;font-weight:700;color:var(--ink)}
.cprice span{display:inline-block;margin-right:6px;font-size:.66rem;font-weight:600;color:var(--gold);background:var(--tint);border-radius:999px;padding:1px 8px;vertical-align:1px}
.card h4 .csub{display:block;margin-top:4px;font-size:.78rem;font-weight:600;color:var(--gold);line-height:1.5;letter-spacing:.01em}
.card p{margin:0;color:var(--muted);font-size:.88rem;flex:1;line-height:1.85}
.card .more{display:inline-flex;align-items:center;gap:10px;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);font-weight:600}
.card .more .arw{transition:transform .3s}
a.card:hover .more .arw{transform:translateX(8px)}

/* footer */
.footer{background:var(--bg);border-top:1px solid var(--line)}
.footer-inner{padding:96px 0 56px;text-align:center}
.footer .big{font-family:var(--font-serif);font-weight:600;font-size:clamp(2.2rem,6vw,3.6rem);letter-spacing:.04em;margin:0 0 22px}
.footer p{margin:0 auto;color:var(--muted);font-size:.92rem;max-width:520px;line-height:2}
.footer .links{display:flex;gap:30px;flex-wrap:wrap;justify-content:center;margin-top:34px}
.footer .links a{color:var(--ink);font-size:.74rem;letter-spacing:.16em;text-transform:uppercase}
.footer .links a:hover{color:var(--gold)}
.footer .small{color:#94a0b4;font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;margin-top:46px}

/* detail */
.detail-hero{padding:88px 0 22px}
.back{display:inline-flex;align-items:center;gap:9px;color:var(--muted);font-size:.82rem;letter-spacing:.06em;margin:0 0 34px}
.back:hover{color:var(--ink)}
.detail .lbl{margin:0 0 18px}
.detail h1{font-family:var(--font-jp);font-weight:500;font-size:clamp(1.9rem,4.2vw,2.9rem);margin:0 0 8px;letter-spacing:.03em;line-height:1.4}
.detail .en{font-family:var(--font-serif);font-style:italic;color:var(--gold);font-size:1.15rem;display:block;margin:0 0 26px}
.lead{color:var(--soft-ink);max-width:680px;font-size:1.02rem;line-height:2}
.panelbox{border-top:1px solid var(--hair);padding-top:40px;max-width:680px;margin-top:18px}
.panel-lead{margin:-8px 0 22px;color:var(--soft-ink);font-size:.95rem;line-height:1.9}
.panelbox h2{font-family:var(--font-jp);font-weight:500;font-size:1.05rem;margin:0 0 24px;letter-spacing:.06em}
.cta-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.cta-grid.one{grid-template-columns:1fr}
@media(max-width:680px){.cta-grid{grid-template-columns:1fr}}
/* password gate (click → reveal pw → open site) */
.pwgate .btn{width:100%}
.pwgate-btn[hidden]{display:none}
.pwgate-open{margin-top:14px;display:grid;gap:12px}
.pwgate-open[hidden]{display:none}
.pwgate-pw{margin:0;padding:15px 18px;border:1px solid var(--hair);border-radius:8px;background:var(--surface);text-align:center;font-size:1rem;letter-spacing:.06em;color:var(--soft-ink)}
.pwgate-pw strong{font-family:var(--font-serif);font-weight:600;font-size:1.7rem;letter-spacing:.14em;color:var(--gold);margin-left:8px;vertical-align:-2px}
.btn{display:block;text-align:center;padding:16px;font-size:.76rem;letter-spacing:.14em;text-transform:uppercase;border:1px solid var(--hair);transition:.25s}
.btn:hover{border-color:var(--ink)}
.btn-line{background:var(--ink);color:var(--surface);border-color:var(--ink)}
.btn-line:hover{background:transparent;color:var(--ink)}
.small{font-size:.78rem;color:var(--muted);letter-spacing:.04em}
/* rich detail content (from Notion) */
.svc-logo{display:block;width:230px;max-width:62%;height:auto;border-radius:10px;border:1px solid var(--line);background:#fff;padding:16px;margin:24px 0 4px;object-fit:contain}
.svc-logo.dark{background:var(--ink);border-color:var(--ink)}
.block{max-width:780px}
.subhead{font-family:var(--font-jp);font-weight:600;font-size:.74rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin:0 0 18px}
.feature-list{list-style:none;padding:0;margin:0;display:grid;gap:12px;max-width:700px}
.feature-list li{position:relative;padding-left:24px;color:var(--soft-ink);line-height:1.8}
.feature-list li::before{content:"";position:absolute;left:0;top:.85em;width:12px;height:1px;background:var(--gold)}
.quote{margin:0;border-left:2px solid var(--gold);padding:6px 0 6px 22px;color:var(--soft-ink);line-height:2;max-width:720px}
.cases{display:grid;gap:34px;max-width:780px}
.case{display:grid;gap:14px}
.case .meta{margin:0;color:var(--ink);font-weight:500}
.case .ph{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:680px){.case .ph{grid-template-columns:1fr}}
.case img{width:100%;height:auto;border-radius:10px;border:1px solid var(--line);display:block}
.dsec{margin-top:28px}
.dsub{font-family:var(--font-jp);font-weight:600;font-size:1rem;letter-spacing:.02em;margin:0 0 12px;color:var(--ink)}
.dossier .lead{max-width:760px}
.dossier .feature-list{margin-bottom:0}
/* dossier: accordion + timeline + plan cards */
.dossier .dov{max-width:760px;margin:0 0 30px}
.dacc{border-top:1px solid var(--hair);max-width:780px}
.dossier .dacc:last-of-type{border-bottom:1px solid var(--hair)}
.dacc>summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 2px;font-family:var(--font-jp);font-weight:600;font-size:1.02rem;letter-spacing:.02em;color:var(--ink)}
.dacc>summary::-webkit-details-marker{display:none}
.dacc>summary:hover{color:var(--gold)}
.dacc-i{position:relative;width:14px;height:14px;flex:none}
.dacc-i::before,.dacc-i::after{content:"";position:absolute;background:var(--gold)}
.dacc-i::before{top:6px;left:0;width:14px;height:1.5px}
.dacc-i::after{top:0;left:6px;width:1.5px;height:14px;transition:.25s}
.dacc[open] .dacc-i::after{transform:scaleY(0)}
.dacc-body{padding:0 2px 30px}
.dacc-body .feature-list{max-width:none}
.steps{list-style:none;counter-reset:st;margin:0;padding:0;max-width:720px}
.steps li{counter-increment:st;position:relative;padding:0 0 24px 46px;color:var(--soft-ink);line-height:1.85}
.steps li::before{content:counter(st,decimal-leading-zero);position:absolute;left:0;top:-1px;font-family:var(--font-serif);font-weight:600;font-size:1.05rem;color:var(--gold)}
.steps li::after{content:"";position:absolute;left:11px;top:24px;bottom:0;width:1px;background:var(--hair)}
.steps li:last-child{padding-bottom:0}
.steps li:last-child::after{display:none}
.plans{display:grid;gap:12px;max-width:720px}
.plan{border:1px solid var(--line);border-radius:10px;padding:16px 20px;background:var(--surface)}
.plan .pn{display:block;font-family:var(--font-jp);font-weight:700;color:var(--ink);margin-bottom:5px;letter-spacing:.02em}
.plan .pd{color:var(--soft-ink);font-size:.92rem;line-height:1.85}
/* about / LP */
.visions{display:grid;gap:1px;background:var(--line);border:1px solid var(--line)}
.vision{background:var(--surface);padding:44px 40px}
@media(max-width:680px){.vision{padding:34px 26px}}
.vision .vn{font-family:var(--font-serif);font-size:1.4rem;color:var(--gold);font-weight:600;line-height:1;display:block;margin-bottom:18px}
.vision h3{font-family:var(--font-jp);font-weight:500;font-size:1.3rem;letter-spacing:.03em;margin:0 0 14px;line-height:1.55}
.vision p{margin:0;color:var(--soft-ink);font-size:.95rem;line-height:2;max-width:760px}
.problems{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border:1px solid var(--line)}
@media(max-width:880px){.problems{grid-template-columns:1fr}}
.problems{gap:14px;background:none;border:0}.problem{border:1px solid var(--line);border-radius:16px}
@media(max-width:760px){.problems{gap:10px}.problem{padding:20px 22px}.problem h3{margin-bottom:10px}.problem .feature-list li{padding-top:4px;padding-bottom:4px;font-size:.88rem}}
.problem{background:var(--surface);padding:34px 30px}
.problem h3{font-family:var(--font-jp);font-weight:600;font-size:1.05rem;margin:0 0 18px;letter-spacing:.02em}
.pillars{display:grid;gap:38px;max-width:820px;margin:0 auto}
.pillar{display:grid;grid-template-columns:auto 1fr;gap:26px;align-items:start}
.pillar .pi{font-family:var(--font-serif);font-size:2rem;color:var(--gold);font-weight:600;line-height:1}
.pillar h3{font-family:var(--font-jp);font-weight:600;font-size:1.12rem;margin:0 0 10px;letter-spacing:.02em}
.pillar p{margin:0;color:var(--soft-ink);line-height:2}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1px;background:var(--line);border:1px solid var(--line)}
.stat{background:var(--surface);padding:40px 20px;text-align:center}
.stat .num{font-family:var(--font-serif);font-weight:600;font-size:2.6rem;color:var(--gold);line-height:1;letter-spacing:.02em}
.stat .lbl2{display:block;margin-top:14px;color:var(--muted);font-size:.78rem;letter-spacing:.08em}
.faq{max-width:780px;margin:0 auto}
.faq .qa{border-top:1px solid var(--hair);padding:26px 2px}
.faq .qa:last-child{border-bottom:1px solid var(--hair)}
.faq .q{font-family:var(--font-jp);font-weight:600;font-size:1.02rem;margin:0 0 12px;letter-spacing:.02em}
.faq .q::before{content:"Q  ";font-family:var(--font-serif);color:var(--gold)}
.faq .a{margin:0;color:var(--soft-ink);line-height:2;font-size:.95rem}
.spec{max-width:720px;margin:0 auto;border-top:1px solid var(--hair)}
.spec .row{display:grid;grid-template-columns:180px 1fr;gap:20px;padding:20px 2px;border-bottom:1px solid var(--hair)}
@media(max-width:680px){.spec .row{grid-template-columns:1fr;gap:6px}}
.spec dt{margin:0;color:var(--muted);font-size:.78rem;letter-spacing:.12em;text-transform:uppercase}
.spec dd{margin:0;color:var(--soft-ink);line-height:1.9}
.lp-cta{text-align:center}
.lp-cta .go{display:inline-block;margin-top:4px;padding:16px 42px;background:var(--ink);color:var(--surface);border:1px solid var(--ink);font-size:.78rem;letter-spacing:.16em;text-transform:uppercase;transition:.25s}
.lp-cta .go:hover{background:transparent;color:var(--ink)}`;

const nav = `<nav class="nav">
  <div class="container nav-inner">
    <a class="brand" href="/">BCC</a>
    <div class="nav-links">
      <a class="hide-sp" href="/">トップ</a>
      <a class="hide-sp" href="/#services">サービス</a>
      <a class="nav-about" href="${ABOUT}">BCCとは</a>
      <a class="btn-join" href="${OC_URL}" target="_blank" rel="noopener noreferrer">オープンチャット</a>
    </div>
  </div>
</nav>`;

// トップのヒーロー下（「サロン経営の困りごと…」と「BCCでできること」の間）のセミナー告知（2026-10-28 オーナー「ページの一番上に、このセミナーに誘導するようなボタンを作ってほしい！」→「サロンの困りごとをまとめて相談、BCCができることとの間の空白あたりにバナーみたいな感じで」）
// 申込先はオーナー貼り付けの告知文の BCC公式LINE。開催が終わったら外す（12/7 17時以降は画面でも自動で隠す）
const SEM_URL = "https://liff.line.me/2011747330-BQph4fkB";
const semBar = `<a class="sem-card" id="semBar" href="${SEM_URL}" target="_blank" rel="noopener noreferrer">
      <span class="sem-tag">セミナー</span>
      <span class="sem-txt"><b><span class="nw">ONE’s GROUP</span> <span class="nw">集客セミナー</span></b><small><span class="nw">12/7（月）16:30〜</span>　<span class="nw">ダリア渋谷</span></small></span>
      <span class="sem-go">詳細・参加はこちら</span>
    </a>
    <script>if(Date.now()>Date.parse("2026-12-07T17:00:00+09:00")){var b=document.getElementById("semBar");if(b)b.remove();}</script>`;

// 公開LP（/about）用ナビ：サービス一覧（会員限定）へは出さず、オープンチャットに集約（2026-10-28 オーナー「公式LINEに誘導してるんですけど、オープンチャットに変えたい！」）
const lpNav = `<nav class="nav">
  <div class="container nav-inner">
    <a class="brand" href="/about">BCC</a>
    <div class="nav-links">
      <a class="btn-join" href="${OC_URL}" target="_blank" rel="noopener noreferrer">オープンチャット</a>
    </div>
  </div>
</nav>`;

const footer = `<footer class="footer">
  <div class="container footer-inner reveal">
    <p class="big serif">BCC</p>
    <p class="komoji" style="margin:0 0 26px">beauty Cooperative Chain</p>
    <p>美容室の開業・集客・運営の困りごとを、パートナーのサービスで解決する窓口。<br>必要な外部パートナーを、カテゴリ別にまとめています。</p>
    <div class="links">
      <a href="${OC_URL}" target="_blank" rel="noopener noreferrer">オープンチャット</a>
      <a href="${ABOUT}">BCCとは</a>
    </div>
    <p class="small">© BCC — beauty Cooperative Chain</p>
  </div>
</footer>`;

// 公開LP（/about）用フッター：オープンチャット（会員限定）は出さず公式LINE登録に
const lpFooter = `<footer class="footer">
  <div class="container footer-inner reveal">
    <p class="big serif">BCC</p>
    <p class="komoji" style="margin:0 0 26px">beauty Cooperative Chain</p>
    <p>美容師の開業・集客・運営を支える共同体。<br>まずはオープンチャットで気軽にどうぞ。</p>
    <div class="links">
      <a href="${OC_URL}" target="_blank" rel="noopener noreferrer">オープンチャット</a>
      <a href="${ABOUT}">BCCとは</a>
    </div>
    <p class="small">© BCC — beauty Cooperative Chain</p>
  </div>
</footer>`;

const BASE = "https://bcc-tau.vercel.app";
function pageDoc(title, desc, body, path = "", navHtml = nav, footerHtml = footer) {
  const url = `${BASE}/${path}`;
  // 会員限定ページ（トップ＋サービス詳細）は検索エンジンに載せない。
  // /about は公開広告LPなので indexable のまま。404 は HTTP 404 のため対象外。
  const robots = path === "about" || path === "404" ? "" : '\n<meta name="robots" content="noindex">';
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">${robots}
<link rel="canonical" href="${url}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:site_name" content="BCC">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${BASE}/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${BASE}/og.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Inter:wght@400;500;600&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap" rel="stylesheet">
<style>
${STYLE}
</style>
<!-- 訪問者の計測: Vercel Web Analytics（2026-10-26 オーナー「これ計測できるようにしといて！」）。Vercel の管理画面で Analytics を有効にしないと何も集計されない -->
<script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments);};</script>
<script defer src="/_vercel/insights/script.js"></script>
</head>
<body>
${navHtml}
${body}
${footerHtml}
<script>
document.documentElement.classList.add("js");
(function(){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{threshold:.12});
  document.querySelectorAll(".reveal").forEach(function(el){io.observe(el);});
})();
(function(){
  document.querySelectorAll(".pwgate-btn").forEach(function(b){
    b.addEventListener("click",function(){
      var g=b.closest(".pwgate");if(!g)return;
      b.setAttribute("hidden","");
      var o=g.querySelector(".pwgate-open");if(o)o.removeAttribute("hidden");
    });
  });
})();
</script>
</body>
</html>
`;
}

// ---- 資料(Notion公開ページ)URL ----
const DOC = {
  "salon-start": "https://amplified-moss-043.notion.site/Salon-Start-25cb15ad990a812aa12edec53b11caba",
  "next-beauty-tech": "https://amplified-moss-043.notion.site/NEXT-BEAUTY-TECH-1feb15ad990a80ef9e89ca36ac98cf37",
  "stylebase": "https://amplified-moss-043.notion.site/StyleBase-1feb15ad990a80ab8d0bf83fc10555eb",
  "mutas": "https://amplified-moss-043.notion.site/1feb15ad990a803fb293ef9c93e7f6cc",
  "real-estate-salon": "https://amplified-moss-043.notion.site/M-A-1feb15ad990a8077ba5adf584d742a20",
  "layer-design-works": "https://amplified-moss-043.notion.site/Layer-Design-Works-21eb15ad990a80f99be6fcdc48a39529",
  "sunny-side-life": "https://amplified-moss-043.notion.site/SUNNY-SIDE-LIFE-1feb15ad990a80cd82c4fd4ba4c091e2",
  "imamura-fp": "https://amplified-moss-043.notion.site/1feb15ad990a80bea60df41b55dd0412",
  "materials-intro": "https://amplified-moss-043.notion.site/1feb15ad990a8076b1b5d409f25efb8e",
  "drive-blue": "https://amplified-moss-043.notion.site/1feb15ad990a8063872bc074e8b3b0b7",
  "hairstyle-market": "https://amplified-moss-043.notion.site/286b15ad990a811ea0c9c09889c6ad39",
  "tonari-seminar": "https://amplified-moss-043.notion.site/238b15ad990a8150b35bc571f12db7d1",
  "haircamp": "https://amplified-moss-043.notion.site/1feb15ad990a8078b362c13836085cf9",
  "toko": "https://amplified-moss-043.notion.site/1feb15ad990a80dbad18e72b0f8cd3ed",
  "tete-lab": "https://amplified-moss-043.notion.site/TETE-LAB-HPB-WEB-2a7b15ad990a81efbd78fd43d6c6c464",
  "atsukyakumania": "https://amplified-moss-043.notion.site/google-1feb15ad990a80918c2edb1788bc8f68",
  "ones": "https://amplified-moss-043.notion.site/ONE-1feb15ad990a8077b5c3c6c80c2a0005",
  "stylepost": "https://amplified-moss-043.notion.site/1feb15ad990a803fa8a8daab01ffb2fd",
  "freed": "https://amplified-moss-043.notion.site/TikTok-1feb15ad990a802294addd6890a5c2af",
  "instagram": "https://amplified-moss-043.notion.site/Instagram-1feb15ad990a803dabf1d3b03b33197c",
  "biyoushijuku": "https://amplified-moss-043.notion.site/1feb15ad990a80a2b5acd3d79b4f358a",
  "gita": "https://amplified-moss-043.notion.site/tiktok-21eb15ad990a807bb1e6e14f69139300",
  "refundhub": "https://amplified-moss-043.notion.site/RefundHub-21eb15ad990a81878d54c7435fcc1716",
};

// 中身のある資料ページだけ「資料（詳細）を見る」を出す（薄いLINE+PDFのみのページはリンクしない）
const DOC_RICH = new Set([
  "layer-design-works", "haircamp", "toko", "materials-intro", "hairstyle-market", "tonari-seminar", "drive-blue",
]);

// ロゴ（Notionから取得・自己ホスト： notion/<id>/logo.<ext>）
const LOGO = {
  "next-beauty-tech": "notion/next-beauty-tech/logo.jpg",
  "real-estate-salon": "notion/real-estate-salon/logo.jpg",
  "drive-blue": "notion/drive-blue/logo.jpg",
  "haircamp": "notion/haircamp/logo.png",
  "tete-lab": "notion/tete-lab/logo.png",
};
// 白/淡色/濃色背景のロゴはダークタイルに載せる
const DARKLOGO = new Set(["drive-blue", "haircamp", "tete-lab"]);

// ---- 各サービスの要約・特長・公式LINE（Notionの資料より） ----
const RICH = {
  "salon-start": { lineUrl: "https://lin.ee/mGm4cDZ", intro: "美容室の独立・開業を支援するサービス。0円開業の導線設計など、開業に関するご相談に対応します。", features: ["美容室の独立・開業支援", "0円開業の導線設計", "公式LINEで相談受付"] },
  "next-beauty-tech": { lineUrl: "https://lin.ee/3j3yWlS", intro: "融資や事業計画の作成に関する相談を支援するサービス。開業・出店時の資金計画づくりをサポートします。", features: ["融資の相談に対応", "事業計画の作成を支援", "公式LINEで相談受付"] },
  "stylebase": { lineUrl: "https://lin.ee/PlhUEY9", intro: "美容室の開業を、準備から運営の立ち上げまで支援するサービス。開業に関するご相談を受け付けています。", features: ["美容室の開業支援", "立ち上げ〜運営をサポート", "公式LINEで相談受付"] },
  "mutas": { lineUrl: "https://lin.ee/zneHaGp", intro: "不動産の専属事業提携によるサービス。物件・出店に関するご相談に対応します。", features: ["不動産の専属事業提携", "物件・出店の相談", "公式LINEで相談受付"] },
  "real-estate-salon": { lineUrl: "https://lin.ee/tIoKLH1", intro: "美容室に特化した不動産サービス。テナント・居抜き・M&Aまで幅広く対応します。", features: ["美容室専門の不動産", "テナント・居抜きに対応", "M&Aに対応", "公式LINEで相談受付"] },
  "plum-plan": {
    lineUrl: "https://lin.ee/u4V8BIt",
    intro: "内装・運営から空間設計まで、サロンづくりをトータルでサポートします。",
    features: ["内装・空間設計をトータルサポート", "運営・立ち上げまで対応", "公式LINEで相談受付"],
    links: [
      { label: "PLUM PLAN専用の公式LINEへ", href: "https://lin.ee/u4V8BIt", primary: true, note: "※詳しい内容・お見積り・ご予約は、PLUM PLAN専用の公式LINEでご案内します（BCCの公式LINEとは別アカウントです）。" },
      { label: "公式サイトで施工事例を見る", href: "https://lacompany.jp/plamplan/" },
    ],
  },
  "layer-design-works": {
    logo: "notion/layer-design-works/logo.jpg",
    lineUrl: "https://lin.ee/DXZM8Px",
    intro: "内装業界最安値クラスを目指す施工パートナー。美容室オーナーの「やりたい」に寄り添い、予算に合わせた設計・内装を行います。",
    features: ["美容室オーナー様の「やりたい」に寄り添う内装設計", "予算に合わせた設計・内装も可能", "立ち会いしながら理想の空間づくり"],
    review:
      "立ち会いし、作業を進めながら内装を作ることができたので理想通り作ることができました！途中でセット面の位置や造作のサイズ感も作りながら合わせることができたので、イメージと相違なくできました！",
    cases: [
      { meta: "名古屋／25坪（スケルトン工事から・ボイラー・エアコン込み）", imgs: ["notion/layer-design-works/case-01.jpg", "notion/layer-design-works/case-02.jpg"] },
    ],
  },
  "sunny-side-life": { lineUrl: "https://lin.ee/3xCh6Ix", intro: "内装・空間づくりのご相談に対応するサービス。施工に関するご相談を受け付けています。", features: ["内装・空間づくりの相談", "公式LINEで相談受付"] },
  "imamura-fp": { lineUrl: "https://lin.ee/ICaMxf0", intro: "元国税局調査官のFPが、税務調査対策と保険に関するご相談に対応。財務面の守りを強化します。", features: ["税務調査対策の相談", "保険の相談", "元国税調査官のFPが対応", "公式LINEで相談受付"] },
  "materials-intro": { lineUrl: "https://lin.ee/mDeyuuv", intro: "サロン向けに材料の仕入れ（ディーラー）を紹介するサービス。取引内容に応じた特典のご案内があります。", features: ["サロン向け仕入れ紹介", "取引内容に応じた特典", "公式LINEで問い合わせ"] },
  "drive-blue": {
    intro: "エフェクトブリーチ・イリーダを仕入れできる業務用の発注サイト。最強コスパの髪質改善トリートメント「リジェネトリートメント」も仕入れ可能です。",
    panelTitle: "ご注文・使い方",
    gate: { pw: "123", href: "https://irida.stores.jp", revealLabel: "業務用発注サイトのパスワードを見る", openLabel: "発注サイトを開く →" },
    links: [
      { label: "リジェネトリートメントの使い方", href: "https://app.notion.com/p/20cb15ad990a80d9bac5ca57ee71736a" },
    ],
  },
  "liverty": {
    intro: "携帯電話を格安にできるご案内。格安SIMではなく「ソフトバンク」のBCC限定プランです。最新のiPhoneに機種変更でき、通信料も削減。スタッフの福利厚生（社用携帯）や節税にも活用できます。",
    panelTitle: "試算・お問い合わせ",
    review: "実際に僕がやってみました。ギガ放題・電話かけ放題・テザリングなどオプションが全てついていて、通信料が12,000円から5,000円ほどになりました！ 携帯はiPhone16でしたが、1円でiPhone17に変えて、iPhone16はメルカリで10万円ほどで売れました。スタッフもみんな最新のiPhoneに変えられて、画質も容量も料金も良くなり、従業員満足度もかなり上げることができました！ ソフトバンクショップでは必ずしも案内されないプランなので、ぜひお問い合わせください。",
    links: [
      { label: "携帯プラン専用の公式LINEへ", href: "https://lin.ee/WNphK9j", primary: true, note: "ご連絡時に「BCC／携帯」とお伝えください。芸能関係も担当する担当スタッフが順次対応します。" },
      { label: "スマホ料金シミュレーターで試算", href: "https://liverty-mobile-sim.vercel.app/" },
      { label: "新デザインLPを見る", href: "https://liverty-salon-lp.vercel.app/" },
      { label: "チラシ（A4）を見る", href: "https://liverty-salon-lp.vercel.app/flyer-a4.html" },
    ],
  },
  "hairstyle-market": {
    intro: "ヘアスタイルの販売サイト「Artify」をご案内するサービス。AIヘアスタイルのオーダーメイドにも対応しています。",
    panelTitle: "ヘアスタイル販売サイト",
    links: [
      { label: "ヘアスタイル販売サイトへ（Artify）", href: "https://artify.stores.jp/", primary: true },
      { label: "資料（詳細）を見る", href: "https://amplified-moss-043.notion.site/286b15ad990a811ea0c9c09889c6ad39" },
    ],
  },
  "tonari-seminar": { intro: "各スタイリストによる技術セミナーの講師を紹介するサービス。カット・ストレート・アレンジ・ブリーチなど、カテゴリ別に講師を確認できます。", features: ["カット/ストレート/アレンジ/ブリーチ", "カテゴリ別に講師を紹介"] },
  "haircamp": { lineUrl: "https://lin.ee/c72BN74", intro: "美容業界に特化したオンライン学習プラットフォーム。オンラインセミナーやオンラインサロンで、24時間365日いつでも学べます。", features: ["美容業界特化のeラーニング", "24時間365日いつでも学習", "オンラインセミナー・サロン", "学ぶ・実践・FBの学びのサイクル"] },
  "toko": { lineUrl: "https://lin.ee/PmI2KwO", intro: "美容業界経験20年以上の都甲真利恵氏による、企業向けの人材育成・採用支援サービス。育成支援と採用支援の2本柱で伴走します。", features: ["新人の定着・離職防止支援", "幹部・内定者の育成研修", "学校訪問代行・求人票添削", "説明会の企画・運営"] },
  "tete-lab": { lineUrl: "https://lin.ee/GHzbAr5", intro: "ホットペッパービューティー（HPB）の攻略とWEB集客を支援するサービス。掲載最適化や集客導線づくりをサポートします。", features: ["HPB完全攻略を支援", "WEB集客を支援", "公式LINEで相談受付"] },
  "atsukyakumania": { lineUrl: "https://lin.ee/z5Xl98D", intro: "ホットペッパービューティーとGoogle（マップ・口コミ等）を活用した集客支援サービスです。", features: ["ホットペッパー集客支援", "Googleを活用した集客", "公式LINEで相談受付"] },
  "ones": { lineUrl: "https://lin.ee/iBFE8up", intro: "ホットペッパービューティーとミニモを使った「ONE’s流」の集客サポートサービスです。", features: ["ホットペッパー集客サポート", "ミニモの集客サポート", "公式LINEで相談受付"] },
  "stylepost": { lineUrl: "https://lin.ee/xJJJzTa", intro: "ホットペッパービューティーのスタイル投稿・ブログ投稿を自動化するサービス。掲載運用の手間を削減します。", features: ["スタイル投稿の自動化", "ブログ投稿の自動化", "公式LINEで相談受付"] },
  "freed": { lineUrl: "https://lin.ee/3Tap1qV", intro: "TikTokのコンサルティングおよび運用代行を行うサービス。動画集客の戦略・運用をサポートします。", features: ["TikTokコンサルティング", "TikTok運用代行", "公式LINEで相談受付"] },
  "instagram": { lineUrl: "https://lin.ee/X4xLPIW", intro: "美容室・美容師向けにInstagramのコンサルティング・運用代行を行うサービス。設計から運用までサポートします。", features: ["Instagram運用代行", "Instagramコンサル", "公式LINEで相談受付"] },
  "biyoushijuku": { lineUrl: "https://lin.ee/5WuYMGB", intro: "美容師専門の、マンツーマン集客コンサルティング（美容師塾）。今伸びている実データとあなたの数字をもとに、やることを一緒に決めて毎月伴走します。" },
  "miseba": { panelTitle: "登録・お申し込み", intro: "全国の美容師リールを毎日計測して、いま伸びている型と、あなたの動画の直し方を出す美容師専用のアプリです。", links: [{ label: "MISEBAの紹介ページを見る", href: "https://bigup-dashboard.onrender.com/lp", primary: true, note: "※登録・お支払いは、MISEBAの紹介ページから行います。" }] },
  "gita": { lineUrl: "https://lin.ee/fpFKHWF", intro: "美容室を専門としたTikTokコンサルティングサービス。集客向けのTikTok運用を支援します。", features: ["美容室専門のTikTokコンサル", "集客向けTikTok運用支援", "公式LINEで相談受付"] },
  "refundhub": { lineUrl: "https://lin.ee/74gb9g5", intro: "キャンセル請求と再予約に対応するサービス。キャンセルによる機会損失を抑える導線をつくります。", features: ["キャンセル請求対応", "再予約対応", "公式LINEで相談受付"] },
};

function sectionBody(s) {
  const h = s.heading || "";
  const isStep = /流れ|ＳＴＥＰ|STEP|ステップ|フロー/i.test(h);
  const isPrice = /料金|プラン|費用|価格|目安/.test(h);
  let body = "";
  if (s.bullets && s.bullets.length) {
    if (isStep) {
      body += `<ol class="steps">${s.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ol>`;
    } else if (isPrice) {
      body += `<div class="plans">${s.bullets
        .map((b) => {
          const i = b.indexOf("：");
          return i > 0
            ? `<div class="plan"><span class="pn">${esc(b.slice(0, i))}</span><span class="pd">${esc(b.slice(i + 1))}</span></div>`
            : `<div class="plan"><span class="pd">${esc(b)}</span></div>`;
        })
        .join("")}</div>`;
    } else {
      body += `<ul class="feature-list">${s.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`;
    }
  }
  if (s.text) body += `<p class="lead" style="margin:0">${esc(s.text)}</p>`;
  return body;
}

function dossierHTML(d) {
  if (!d || (!d.overview && !(d.sections || []).length)) return "";
  const secs = d.sections || [];
  let inner = "";
  if (d.overview) inner += `<p class="lead dov">${esc(d.overview)}</p>`;
  secs.forEach((s, i) => {
    inner += `<details class="dacc"${i === 0 ? " open" : ""}><summary><span>${esc(s.heading || "詳細")}</span><span class="dacc-i" aria-hidden="true"></span></summary><div class="dacc-body">${sectionBody(s)}</div></details>`;
  });
  return `\n      <div class="block dossier"><p class="subhead">資料の内容</p>${inner}</div>`;
}

function richHTML(r, skipFeatures) {
  let h = "";
  if (!skipFeatures && r.features && r.features.length) {
    h += `\n      <div class="block" style="margin-top:8px"><p class="subhead">特長</p><ul class="feature-list">${r.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul></div>`;
  }
  if (r.review) {
    h += `\n      <div class="block" style="margin-top:50px"><p class="subhead">お客様の声</p><blockquote class="quote">${esc(r.review)}</blockquote></div>`;
  }
  if (r.cases && r.cases.length) {
    const cases = r.cases
      .map((c) => {
        const imgs = (c.imgs || []).map((src) => `<img src="${src}" alt="" loading="lazy">`).join("");
        return `<div class="case"><p class="meta">${esc(c.meta)}</p>${imgs ? `<div class="ph">${imgs}</div>` : ""}</div>`;
      })
      .join("");
    h += `\n      <div class="block" style="margin-top:50px"><p class="subhead">実例</p><div class="cases">${cases}</div></div>`;
  }
  return h;
}

// ---- 404 ----
writeFileSync(
  `${OUT}/404.html`,
  pageDoc(
    "ページが見つかりません｜BCC",
    "お探しのページは見つかりませんでした。",
    `<main>
  <section class="detail detail-hero">
    <div class="container">
      <a class="back" href="/">← BCC トップへ</a>
      <p class="komoji lbl">404</p>
      <h1>ページが見つかりません</h1>
      <p class="lead">お探しのページは移動または削除された可能性があります。トップからサービスをご覧ください。</p>
      <div class="panelbox" style="margin-top:32px">
        <div class="cta-grid">
          <a class="btn btn-line" href="/">トップへ戻る</a>
          <a class="btn" href="/#services">サービス一覧</a>
        </div>
      </div>
    </div>
  </section>
</main>`,
    "404",
  ),
);

// ---- about / 説明LP ----
const aboutBody = () => `<header class="hero">
  <div class="hero-mark serif">BCC</div>
  <div class="hero-inner">
    <span class="eyebrow jp">BCCとは</span>
    <h1><span style="white-space:nowrap">美容業界を、</span><br><span style="white-space:nowrap">もっと強く。</span><span class="hl" style="white-space:nowrap">もっと面白く。</span></h1>
    <p class="hero-sub">材料・教育・集客・お金・出店。<br><span style="white-space:nowrap"><b>技術以外の経営の困りごと</b>を、</span><span style="white-space:nowrap">仲間とサポートで解決する共同体です。</span></p>
    <div class="hero-cta">
      <a class="primary jp" href="${OC_URL}" target="_blank" rel="noopener noreferrer">オープンチャットに参加する</a>
    </div>
  </div>
</header>

<main>

  <section class="container">
    <div class="sec-head reveal">
      <p class="komoji lbl">Challenges</p>
      <h2>こんなお悩み、<em>ありませんか</em>。</h2>
    </div>
    <div class="problems reveal">
      <div class="problem">
        <h3>経営の負担を減らしたい</h3>
        <ul class="feature-list">
          <li>材料費・運営コストの負担が大きい</li>
          <li>開業・融資の手続きが不透明</li>
          <li>税務・保険の相談先がない</li>
        </ul>
      </div>
      <div class="problem">
        <h3>技術や集客方法を知りたい</h3>
        <ul class="feature-list">
          <li>スタッフの教育・育成が難しい</li>
          <li>最新の技術・薬剤の情報がほしい</li>
          <li>SNS・採用の方法がわからない</li>
        </ul>
      </div>
      <div class="problem">
        <h3>人脈やサポートがほしい</h3>
        <ul class="feature-list">
          <li>同業の起業家とつながりたい</li>
          <li>不動産・内装の情報がほしい</li>
          <li>頼れるサポート体制がほしい</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="does">
    <div class="container reveal">
      <h2>BCCで、解決できること。</h2>
      <p class="dlead">経営の知識がなくても、安心して進められます。</p>
      <div class="dgrid">
        <div class="dcard"><span class="dn">1</span><h3>材料を、特別価格で</h3><p>ディーラー・メーカーとの直接提携で、商材を特別価格で安定して仕入れられます。材料費を抑えて、利益を残せる運営に。</p></div>
        <div class="dcard"><span class="dn">2</span><h3>学びと集客を、まとめて</h3><p>オーナー向けの経営研修・技術講習。ホットペッパー・SNSを使った集客の支援。海外展開まで後押しします。</p></div>
        <div class="dcard"><span class="dn">3</span><h3>出店から経営まで、まるごと</h3><p>物件探し・融資・事業計画書づくりから、保険・税務対策・福利厚生まで。全国の加盟店・アンバサダーともつながれます。</p></div>
      </div>
    </div>
  </section>

  <section class="alt">
    <div class="container">
      <div class="sec-head reveal">
        <p class="komoji lbl">Members</p>
        <h2>BCCで、<em style="white-space:nowrap">相談できること</em>。</h2>
        <p>BCCが選んだ${DATA.reduce((n, c) => n + c.items.length, 0)}のサービスを、悩みごとに探せます。</p>
      </div>
      <div class="mgrid reveal">
        ${FINDER.map((f) => `<div class="mcell"><span class="mcat">${esc(f.cat)}</span><span class="mwhen">${esc(f.when.replace(/（.*?）/g, ""))}</span></div>`).join("\n        ")}
      </div>
      <p class="mnote reveal">各サービスの内容・窓口は、会員の方にご案内しています。まずはオープンチャットで気軽にご相談ください。</p>
    </div>
  </section>

  <section class="container">
    <div class="sec-head reveal">
      <p class="komoji lbl">Track record</p>
      <h2>これまでの、<em>実績</em>。</h2>
    </div>
    <div class="stats reveal">
      <div class="stat"><span class="num">755</span><span class="lbl2">会員数（名）</span></div>
      <div class="stat"><span class="num">23</span><span class="lbl2">加盟ディーラー</span></div>
      <div class="stat"><span class="num">8</span><span class="lbl2">提携メーカー</span></div>
      <div class="stat"><span class="num">21</span><span class="lbl2">自社商品</span></div>
      <div class="stat"><span class="num">4</span><span class="lbl2">海外エリア展開</span></div>
    </div>
    <p class="sec-head" style="margin:34px auto 0;color:var(--muted);font-size:.9rem">日本・韓国・香港・台湾でサロン運営／美容業界向けの広告・教育も展開。</p>
  </section>

  <section class="alt">
    <div class="container">
      <div class="sec-head reveal">
        <p class="komoji lbl">Vision</p>
        <h2>私たちの、<em>想い</em>。</h2>
      </div>
      <div class="visions reveal">
        <div class="vision">
          <span class="vn">01</span>
          <h3>美容業界の未来を、私たちの手で変える。</h3>
          <p>海外では当たり前に使える商材が、国内では規制で使えないことがあります。美容師がもっと自由に、創造的に働ける環境へ。業界そのものを前に進めます。</p>
        </div>
        <div class="vision">
          <span class="vn">02</span>
          <h3>流行や美学を生み出す“場”と“仲間”をつくりたい。</h3>
          <p>技術・感性・経営力を、つながり合う起業家のコミュニティで磨く。トレンドと美学が生まれ続ける場所を、仲間とともに育てていきます。</p>
        </div>
      </div>
    </div>
  </section>

  <section class="container">
    <div class="sec-head reveal">
      <p class="komoji lbl">Flow</p>
      <h2>はじめるまでの、<em>流れ</em>。</h2>
    </div>
    <div class="block reveal" style="max-width:720px;margin:0 auto">
      <ol class="steps">
        <li>オープンチャットに参加</li>
        <li>悩みを相談・同業者と情報交換</li>
        <li>必要なサービスの窓口につながる</li>
        <li>導入・利用スタート</li>
      </ol>
    </div>
  </section>

  <section class="alt">
    <div class="container">
      <div class="sec-head reveal">
        <p class="komoji lbl">FAQ</p>
        <h2>よくある、<em>ご質問</em>。</h2>
      </div>
      <div class="faq reveal">
        <div class="qa">
          <p class="q">フランチャイズとは何が違うの？</p>
          <p class="a">BCCはフランチャイズではなく「加盟店制度」です。経営の自由度が高いのが特徴です。</p>
        </div>
        <div class="qa">
          <p class="q">どのくらいの費用がかかりますか？</p>
          <p class="a">BCCへの入会は無料です。各サービスの費用は、実際にご利用いただくサービスごとに、それぞれの窓口で個別にご案内します。</p>
        </div>
      </div>
    </div>
  </section>

  <section class="container">
    <div class="sec-head reveal">
      <p class="komoji lbl">Company</p>
      <h2>会社、<em>概要</em>。</h2>
    </div>
    <dl class="spec reveal">
      <div class="row"><dt>会社名</dt><dd>合同会社BCC（Beauty Co-operative Chain）</dd></div>
      <div class="row"><dt>事業内容</dt><dd>美容室向け商材の提供・販売／サロン経営支援（教育・集客・不動産・融資）／国内外のサロン展開・マーケティング支援／アンバサダーネットワークの構築</dd></div>
      <div class="row"><dt>代表者</dt><dd>西村 涼・瀬野 克・岡本 裕也</dd></div>
      <div class="row"><dt>事業展開</dt><dd>日本・韓国・香港・台湾</dd></div>
    </dl>
  </section>

  <section class="container lp-cta">
    <div class="sec-head reveal" style="margin-bottom:34px">
      <p class="komoji lbl">Get started</p>
      <h2>BCCで、<em>一緒に解決</em>しませんか。</h2>
      <p>材料費の削減、セミナー参加、融資相談まで。あなたのサロン経営を、まるごとサポートします。まずはオープンチャットから。</p>
    </div>
    <a class="go reveal" href="${OC_URL}" target="_blank" rel="noopener noreferrer">オープンチャットに参加する</a>
  </section>

</main>`;


// ---- index ----
const monoOf = (name) => [...name.split("（")[0].split("(")[0].trim()][0] || "·";
const DATA = categories
  .map((name) => ({
    name,
    en: enOf[name] || "",
    items: services
      .filter((s) => s.cat === name)
      .map((s) => ({
        id: s.id,
        name: s.name,
        desc: s.desc,
        logo: (RICH[s.id] && RICH[s.id].logo) || LOGO[s.id] || null,
        dark: DARKLOGO.has(s.id),
        mono: monoOf(s.name),
      })),
  }))
  .filter((c) => c.items.length);
// StyleManager（自社商品・2026-08-27 掲載可）を「集客」の先頭に置く（2026-10-27 オーナー「集客に関してスタイルマネージャー作るの忘れてました。一番上に持ってきて表示してほしい！」）。
// 実体は /stylemanager の転送（vercel.json）なので services[] には入れない＝詳細ページは作らず、href で転送先へ
DATA.find((c) => c.name === "集客").items.unshift({
  id: "stylemanager",
  href: "/stylemanager",
  name: "StyleManager｜PV爆上げ ホットペッパー自動化ツール", // 名前の後ろはオーナー指定（2026-10-27「タイトルにPV爆上げホットペッパー自動化ツールみたいな文章も入れてほしい！」）
  desc: "ホットペッパーのスタイル・ブログ・口コミの運用代行。5店舗の実データを公開中。",
  logo: null,
  dark: false,
  mono: "S",
});
// カード見出しの改行をきれいにする（2026-10-27 オーナー「改行をちょっともうちょっときれいにしましょう。例えばタイトル、括弧っていうのが並んでたりするので！」）。
// 「集客マニア（ホットペッパー / Google）」→ 本体「集客マニア」＋下の小さな行「ホットペッパー / Google」
const splitName = (name) => {
  const m = name.match(/^(.+?)\s*[（(｜]\s*(.+?)\s*[）)]?$/);
  return m ? [m[1], m[2]] : [name, ""];
};
const wb = (t) => esc(t).replace(/ \/ /g, " /<wbr> ").replace(/・/g, "・<wbr>");
// 見出しの下の小さな行＝サービスの種類（2026-10-27 オーナー「タイトルが一番上にあって、その下の文字は…自動化ツールなのか、コンサルなのかとかにしましょうかね！」）。
// 中身は各サービスの desc・資料の範囲で付けた（誇張しない）。無いサービスはビルドで止める
// StyleManager とスタイルポストは同じタグ「自動化ツール」で隣に並べる（2026-10-27 オーナー「スタイルマネージャーとスタイルポストは自動化ツールにしましょう！…その2つは同じタグなので、よく並べてください！」）
const KIND = {
  "stylemanager": "自動化ツール", "tete-lab": "集客コンサル", "atsukyakumania": "集客コンサル", "ones": "集客コンサル",
  "stylepost": "自動化ツール", "freed": "TikTok", "instagram": "Instagram", "gita": "TikTok", "biyoushijuku": "Instagram", "miseba": "Instagram",
  "salon-start": "開業サポート", "next-beauty-tech": "融資・事業計画の相談", "stylebase": "開業サポート",
  "mutas": "不動産", "real-estate-salon": "不動産",
  "plum-plan": "内装・空間設計", "layer-design-works": "内装施工", "sunny-side-life": "内装・空間づくり",
  "imamura-fp": "税務・保険の相談", "liverty": "通信費の見直し",
  "materials-intro": "仕入れ紹介", "drive-blue": "業務用発注サイト", "hairstyle-market": "販売プラットフォーム",
  "tonari-seminar": "講師紹介", "haircamp": "スクール", "toko": "研修・採用支援", "refundhub": "キャンセル対策",
};
// 見出しの差し替え（括弧の中がサービス名のもの）
const TITLE = { gita: "ギータ" };
const titleHTML = (it) => {
  if (!KIND[it.id]) throw new Error(`KIND に種類が無い: ${it.id}`);
  return wb(TITLE[it.id] || splitName(it.name)[0]) + `<span class="csub">${esc(KIND[it.id])}</span>`;
};
// 料金が資料に載っているサービスだけ、カードに「〇〇円〜」を小さく出す（2026-10-27 オーナー「料金が見えてるものは、この最初のページにもいくらいくらからみたいなっていうのが小さくてもいいので載ってるといいかもですね！」）。
// 値は各サービスの「資料の内容」（writeups.json）の一番安いプラン。税の表記も資料どおり。資料の料金を変えたらここも直す
const PRICE = {
  "stylemanager": "1万円〜", // オーナー指定 2026-10-27「スタイルマネージャーは1万円からにしといて！」（資料ではなくオーナーの値）
  "atsukyakumania": "月2万円〜（税抜）",
  "freed": "月13万円〜（税別・助成金利用時の実質）",
  "gita": "月15万円〜（税抜）",
  "instagram": "3か月 7万円〜（税抜）",
  "biyoushijuku": "月3万5,000円（税込）",
  "miseba": "月2,200円〜（税込・10/31までの登録）", // 11/1 から新規は月2,750円（資料）。11/1 になったら直す
  "ones": "6か月 60万円〜",
  "haircamp": "1人 月2,100円〜（税別）",
  "toko": "3万円〜",
  "liverty": "通信料 月3,280円〜",
  "tonari-seminar": "5万円〜（講師により異なる）",
};
// カードの説明は短い箇条書き（2026-10-27 オーナー「端的に箇条書きでいいと思ってます！」）。中身は desc の範囲（誇張しない）
const POINTS = {
  "stylemanager": ["PV爆上げのホットペッパー自動化", "スタイル・ブログ・口コミ返信を自動化", "ネイル・まつげサロンにも対応"], // 2・3行目は紹介サイト stylemanager-lp の表記に合わせた（2026-10-27）
  "tete-lab": ["ホットペッパー完全攻略", "WEB集客の支援"],
  "atsukyakumania": ["ホットペッパー集客", "Google（MEO/SEO）対策"],
  "ones": ["ホットペッパー中心", "ミニモの集客も"],
  "stylepost": ["HPBのスタイル投稿", "ブログ更新のサポート"],
  "freed": ["コンサル", "運用代行"],
  "instagram": ["コンサル・運用代行", "設計から運用までサポート"],
  "gita": ["美容室専門のコンサル", "TikTok戦略の支援"],
  "biyoushijuku": ["SNSで新規・指名・売上アップ", "数字の診断→集客の道筋づくり", "月1回の面談＋随時フォロー"], // 2026-10-28 新資料に合わせて差し替え
  "miseba": ["伸びてる美容師リールが毎日わかる", "自分の数字を毎週自動で記録", "動画をシーンごとに添削"],
  "salon-start": ["0円開業の導線設計", "融資・事業計画も相談可"],
  "next-beauty-tech": ["融資の相談", "事業計画づくり"],
  "stylebase": ["開業準備から", "運営の立ち上げまで"],
  "mutas": ["不動産専門", "事業提携"],
  "real-estate-salon": ["テナント・居抜き", "M&Aまで美容室特化"],
  "plum-plan": ["内装・運営", "空間設計までトータル"],
  "layer-design-works": ["施工パートナー", "業界最安値クラスを目指す"],
  "sunny-side-life": ["内装の相談先", "空間づくり"],
  "imamura-fp": ["税務調査対策", "保険で財務の守りを強化"],
  "liverty": ["ソフトバンクのBCC限定", "通信料削減・最新iPhone", "福利厚生・節税に"],
  "materials-intro": ["材料の仕入れ紹介", "仕入れの相談"],
  "drive-blue": ["エフェクトブリーチ・イリーダ", "業務用の発注サイト"],
  "hairstyle-market": ["ヘアスタイルを販売", "販売の場を用意"],
  "tonari-seminar": ["セミナー講師の紹介", "マッチング"],
  "haircamp": ["教育プログラム", "学びを続けやすい"],
  "toko": ["人材育成の仕組み化", "採用の仕組み化"],
  "refundhub": ["キャンセル料の請求", "再予約の導線づくり"],
};
// 種類ごとに並べる（2026-10-27 オーナー「自動化ツールは自動化ツールで並び替えたりとかした方がいいかな」）。
// ツール・サイト → コンサル → 運用代行・サポート → その他。同じ種類の中は元の順（安定ソート）
const kindRank = (id) => { const k = KIND[id] || ""; return /ツール|サイト|プラットフォーム/.test(k) ? 0 : /コンサル/.test(k) ? 1 : /運用代行|サポート/.test(k) ? 2 : 3; };
for (const c of DATA) c.items.sort((x, y) => kindRank(x.id) - kindRank(y.id));
for (const c of DATA) for (const it of c.items) {
  it.title = titleHTML(it);
  if (!POINTS[it.id]) throw new Error(`POINTS に箇条書きが無い: ${it.id}`);
  it.pts = `<ul class="cpts">${POINTS[it.id].map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` +
    (PRICE[it.id] ? `<p class="cprice"><span>料金の目安</span>${esc(PRICE[it.id])}</p>` : "");
}
const itemCount = DATA.reduce((n, c) => n + c.items.length, 0);

// 「お悩みから選ぶ」（2026-10-27 オーナー「今言った内容もざっくり改善していきたいですね！」）。
// 🔴 悩み → ジャンルにつなぐ。特定の会社に絞らない（2026-10-27 オーナー「企業を絞っちゃうと…平等じゃないかな」）。
// cat は categories[] の名前。押すとジャンル専用ページ（/genre-xxx）が開き、全社が同じ並びで出る（2026-10-27 オーナー「別ページで…見やすくした方がいい」）
const FINDER = [
  { when: "開業したい（資金・事業計画・準備）", cat: "開業支援" },
  { when: "開業する物件を探したい", cat: "不動産" },
  { when: "内装・お店づくりを相談したい", cat: "内装業者" },
  { when: "お客様を増やしたい（ホットペッパー・SNS・Google）", cat: "集客" },
  { when: "無断キャンセル・予約まわりを整えたい", cat: "予約サービス" },
  { when: "スタッフ教育・採用を仕組みにしたい", cat: "教育" },
  { when: "税務調査・節税が気になる", cat: "財務" },
  { when: "スタッフの携帯代・福利厚生を見直したい", cat: "福利厚生" },
  { when: "材料の仕入れを見直したい", cat: "材料" },
  { when: "ヘアスタイルを販売したい", cat: "ヘアスタイル販売" },
];
const genreSlug = (c) => "genre-" + enOf[c].toLowerCase().replace(/\s+/g, "-");
const catCount = (c) => { const n = (DATA.find((x) => x.name === c) || { items: [] }).items.length; if (!n) throw new Error(`FINDER: 不明なジャンル ${c}`); return n; };

// ジャンル内の小分け（2026-10-27 オーナー「集客もこの中で、ホットペッパーなのかとかが順番に分かれてると分かりやすいかもしれません！」）。
// 並びは各グループ内で DATA の順（StyleManager が先頭）。どのグループにも入らない id はビルドで止める
const SUBGROUPS = {
  "集客": [
    { label: "ホットペッパー", ids: ["stylemanager", "stylepost", "tete-lab", "atsukyakumania", "ones"] },
    // SNS は青い小見出しを Instagram／TikTok にして段を分ける（2026-10-27 オーナー「ここはSNSで分けましょう。…インスタなのかTikTokなのか！」）
    // 美容師塾は SNS の Instagram 段へ（2026-10-27 オーナー「これもインスタグラムのコンサルに近いので、インスタのコンサルっぽい内容と、あとSNS以外のサポートもみたいな感じで」。資料のカリキュラムも SNS運用指導が先頭）
    { label: "SNS（Instagram・TikTok）", ids: ["instagram", "biyoushijuku", "miseba", "freed", "gita"] },
  ],
};

// ---- ジャンル専用ページ（お悩みから選ぶ → ここ）----
for (const f of FINDER) {
  const d = DATA.find((x) => x.name === f.cat);
  const slug = genreSlug(f.cat);
  if (services.some((v) => v.id === slug)) throw new Error(`ジャンルのURLがサービスと重なる: ${slug}`);
  const card = (it) => {
    const mark = it.logo
      ? `<div class="cmark${it.dark ? " dark" : ""}"><img src="${it.logo}" alt=""></div>`
      : `<div class="cmark"><span class="mono">${esc(it.mono)}</span></div>`;
    return `<a class="card" href="${it.href || "/" + it.id}">${mark}<p class="komoji ctag">${esc(d.en || d.name)}</p><h4>${it.title}</h4>${it.pts}<span class="more">詳細 <span class="arw">→</span></span></a>`;
  };
  const gridOf = (items) => `<div class="grid${items.length === 1 ? " one" : items.length === 2 ? " two" : ""}">
        ${items.map(card).join("\n        ")}
      </div>`;
  let listHTML;
  if (SUBGROUPS[f.cat]) {
    const used = SUBGROUPS[f.cat].flatMap((g) => g.ids);
    const left = d.items.filter((it) => !used.includes(it.id)).map((it) => it.id);
    if (left.length) throw new Error(`SUBGROUPS(${f.cat}) に入っていない: ${left.join(", ")}`);
    listHTML = SUBGROUPS[f.cat].map((g) => {
      const items = g.ids.map((id) => d.items.find((it) => it.id === id)).filter(Boolean);
      if (items.length !== g.ids.length) throw new Error(`SUBGROUPS(${f.cat}/${g.label}) に不明な id`);
      // 同じ種類ごとに段を分ける（2026-10-27 オーナー「上が2段、下が3段にすれば綺麗に分かれます！」＝自動化ツール2枚／集客コンサル3枚）
      const rows = [];
      for (const it of items) { const row = rows.find((r) => KIND[r[0].id] === KIND[it.id]); if (row) row.push(it); else rows.push([it]); }
      return `<div class="subgroup"><h2 class="subh">${esc(g.label)}<span>${items.length}件</span></h2>
      ${rows.map((r) => `<div class="krow">${gridOf(r)}</div>`).join("\n      ")}</div>`;
    }).join("\n      ");
  } else {
    listHTML = gridOf(d.items);
  }
  const others = FINDER.filter((o) => o !== f).map((o) => `<a href="/${genreSlug(o.cat)}">${esc(o.when.split("（")[0])}</a>`).join("");
  const body = `<main>
  <section class="detail detail-hero genre-hero">
    <div class="container reveal">
      <a class="back" href="/#find">← お悩み一覧にもどる</a>
      <p class="gtag">${esc(f.cat)}</p>
      <h1>${esc(f.when.split("（")[0])}</h1>${f.when.includes("（") ? `<p class="gsub">${esc(f.when.slice(f.when.indexOf("（") + 1).replace(/）$/, ""))}</p>` : ""}
      <p class="lead">${esc(f.cat)}のサービスは<strong>${d.items.length}件</strong>あります。気になるものを開くと、内容と相談先（公式LINEなど）が見られます。</p>
    </div>
  </section>
  <section class="genre-list">
    <div class="container reveal">
      ${listHTML}
      <div class="genre-others">
        <h2>ほかのお悩みから探す</h2>
        <div class="gchips">${others}</div>
      </div>
    </div>
  </section>
</main>`;
  writeFileSync(`${OUT}/${slug}.html`, pageDoc(`${f.cat}のサービス｜BCC`, `${f.when}。BCCの${f.cat}のサービス${d.items.length}件をまとめています。`, body, slug));
}

const indexBody = `<header class="hero">
  <div class="hero-mark serif">BCC</div>
  <div class="hero-inner">
    <span class="eyebrow jp">美容室オーナー・美容師のための</span>
    <h1><span style="white-space:nowrap">サロン経営の困りごと、</span><br><span class="hl" style="white-space:nowrap">ここでまとめて相談。</span></h1>
    <p class="hero-sub">開業・集客・スタッフ・お金・仕入れ。<br><span style="white-space:nowrap"><b>BCCが選んだサービス</b>を、</span><span style="white-space:nowrap">悩みから探せます。</span></p>
    ${semBar}
  </div>
</header>

<main>

  <section class="does">
    <div class="container reveal">
      <h2>BCCでできること</h2>
      <p class="dlead">技術以外の「困った」を、ここで片づけられます。</p>
      <div class="dgrid">
        <a class="dcard" href="#find"><span class="dn">1</span><h3>悩みからサービスを探す</h3><p>開業・集客・教育・節税など、BCCが選んだ${itemCount}のサービスから選べます。</p><span class="go">悩みから探す →</span></a>
        <a class="dcard" href="${OC_URL}" target="_blank" rel="noopener noreferrer"><span class="dn">2</span><h3>同業者に、気軽に相談する</h3><p>オープンチャットで情報交換。各サービスへは公式LINEから直接聞けます。</p><span class="go">オープンチャットへ →</span></a>
        <a class="dcard" href="${SALOPIT_URL}" target="_blank" rel="noopener noreferrer"><span class="dn">3</span><h3>施術ツール「サロピット」<span class="new">NEW</span></h3><p>参考レシピ・配合計算・お助けチャット。施術中にそのまま開けます。</p><span class="go">サロピットを開く →</span></a>
      </div>
    </div>
  </section>

  <section class="container" id="find">
    <div class="sec-head reveal">
      <p class="komoji lbl">Find</p>
      <h2>お悩みから、<em>選ぶ</em>。</h2>
      <p>いま困っていることを選ぶと、そのジャンルのサービスだけをまとめたページが開きます。</p>
    </div>
    <div class="finder reveal">
${FINDER.map((f) => `      <a class="frow" href="/${genreSlug(f.cat)}"><span class="fnum">${catCount(f.cat)}<small>件</small></span><span class="fbody"><p class="fwhen">${esc(f.when)}</p><p class="fpick"><span>${esc(f.cat)}のサービス ${catCount(f.cat)}件を見る</span></p></span></a>`).join("\n")}
    </div>
  </section>

  <section class="alt" id="services">
    <div class="container">
      <div class="sec-head reveal">
        <p class="komoji lbl">Services</p>
        <h2>サービスを、<em>ジャンル</em>で見る。</h2>
        <p>ジャンルごとにタブで切り替えできます。</p>
      </div>
      <div class="tabs reveal" id="tabs"></div>
      <div id="panels"></div>
    </div>
  </section>


</main>

<script>
const DATA = ${JSON.stringify(DATA)};

(function(){
  var tabs=document.getElementById("tabs");
  var panels=document.getElementById("panels");
  var TABS=[{name:"すべて",all:true}].concat(DATA.map(function(d){return {name:d.name,en:d.en};}));
  function card(it,d){
    var mark = it.logo
      ? '<div class="cmark'+(it.dark?' dark':'')+'"><img src="'+it.logo+'" alt=""></div>'
      : '<div class="cmark"><span class="mono">'+it.mono+'</span></div>';
    return '<a class="card" href="'+(it.href||'/'+it.id)+'">'+mark+'<p class="komoji ctag">'+(d.en||d.name)+'</p><h4>'+it.title+'</h4>'+it.pts+'<span class="more">詳細 <span class="arw">→</span></span></a>';
  }
  function panel(tab){
    if(tab.all){
      return DATA.map(function(d,i){
        var idx=("0"+(i+1)).slice(-2);
        return '<div class="cat-block"><div class="cat-bar"><span class="idx">'+idx+'</span><h3>'+d.name+'</h3><span class="en">'+d.en+'</span><span class="cnt">'+d.items.length+' '+(d.items.length>1?'services':'service')+'</span></div><div class="grid">'+d.items.map(function(it){return card(it,d);}).join("")+'</div></div>';
      }).join("");
    }
    var d=DATA.find(function(x){return x.name===tab.name;});
    return '<div class="grid">'+d.items.map(function(it){return card(it,d);}).join("")+'</div>';
  }
  function activate(i){
    [].forEach.call(tabs.children,function(b,bi){b.classList.toggle("on",bi===i);});
    panels.innerHTML=panel(TABS[i]);
  }
  TABS.forEach(function(t,i){
    var b=document.createElement("button");
    b.className="tab"+(i===0?" on":"");
    b.textContent=t.name;
    b.onclick=function(){activate(i);};
    tabs.appendChild(b);
  });
  activate(0);
})();
</script>`;

writeFileSync(
  `${OUT}/index.html`,
  pageDoc(
    "BCC｜美容室経営の困りごと、まとめて相談",
    "BCC（beauty Cooperative Chain）は、美容室の開業・集客・スタッフ・お金・仕入れの困りごとを、厳選したパートナーのサービスにつなぐ相談窓口です。",
    indexBody
  )
);

console.log(`generated ${services.length} detail pages + index into ${OUT}`);

// 紹介ページ（/about）は FINDER・DATA を使うので最後に書き出す
writeFileSync(
  `${OUT}/about.html`,
  pageDoc(
    "BCCとは｜beauty Cooperative Chain",
    "美容師の開業・集客・運営を支える共同体 BCC（beauty Cooperative Chain）の想い・提供サポート・実績・会社概要。",
    aboutBody(),
    "about",
    lpNav,
    lpFooter,
  ),
);

// ---- detail pages ----
// 2026-10-28 オーナー「開いた後の内容をもっと詳しく、マーケティングの観点から公式内にクリックされやすいように誘導できるようにしたい！」「これはここだけじゃなくて全部！」
// → 全詳細ページ共通で: 種類・料金の目安・できること（POINTS）を見出しの近くに／こんなお悩みに（FINDER）／ご相談の流れ／ページ下にもう一度ボタン／画面下に固定ボタン／同じジャンルのほかのサービス。
// KIND・POINTS・PRICE・FINDER・DATA を使うのでファイルの最後で呼ぶ
function renderDetailPages() {
for (const s of services) {
  const r = RICH[s.id] || {};
  const logoSrc = r.logo || LOGO[s.id] || null;
  const logo = logoSrc ? `\n      <img class="svc-logo${DARKLOGO.has(s.id) ? " dark" : ""}" src="${logoSrc}" alt="${esc(s.name)}">` : "";
  const intro = r.intro || "詳しい内容やお申し込み・ご相談は、下記からお気軽にどうぞ。";
  const hasCurated = r.cases && r.cases.length; // layer(施工写真つき) は従来の curated 表示
  const rich = hasCurated ? richHTML(r, false) : richHTML(r, true) + dossierHTML(DOSSIER[s.id]);
  const doc = (DOC_RICH.has(s.id) && DOC[s.id]) || null;
  const line = r.lineUrl || null;
  const brand = ({ "imamura-fp": "今村FP", "toko": "都甲（人材育成）" })[s.id] || s.name.split("（")[0].split("(")[0].trim();
  // CTAボタン群を組み立て。公式LINEが無いサービスは連絡ボタンを出さない（オープンチャットのフォールバックは廃止）。
  let ctas = [];
  let note = "";
  let lead = "";  // ボタンの手前の一言（押すと何ができるか）
  // パスワードゲート：ボタン→パスワード表示→サイトを開く の2段階
  let gateHTML = "";
  if (r.gate) {
    const g = r.gate;
    gateHTML = `\n        <div class="pwgate">
          <button class="btn btn-line pwgate-btn" type="button">${esc(g.revealLabel)}</button>
          <div class="pwgate-open" hidden>
            <p class="pwgate-pw">パスワード <strong>${esc(g.pw)}</strong></p>
            <a class="btn btn-line" href="${g.href}" target="_blank" rel="noopener noreferrer">${esc(g.openLabel)}</a>
          </div>
        </div>`;
  }
  if (r.links && r.links.length) {
    ctas = r.links.map((l) => `<a class="btn${l.primary ? " btn-line" : ""}" href="${l.href}" target="_blank" rel="noopener noreferrer">${esc(l.label)}</a>`);
    const notes = r.links.filter((l) => l.note).map((l) => esc(l.note));
    if (notes.length) note = `\n        <p class="small" style="margin-top:16px">${notes.join("　／　")}</p>`;
  } else {
    if (line) ctas.push(`<a class="btn btn-line" href="${line}" target="_blank" rel="noopener noreferrer">${esc(brand)}専用の公式LINEで相談する</a>`);
    if (doc) ctas.push(`<a class="btn" href="${doc}" target="_blank" rel="noopener noreferrer">資料（詳細）を見る</a>`);
    // 「ほかのサービスを見る」は公式LINEへのクリックを分散させるので外した（2026-10-28・ページ下に同じジャンルのほかのサービスを置いた）
    if (line) {
      lead = `\n        <p class="panel-lead">${esc(brand)}専用の公式LINEで、詳しい内容・お見積り・ご予約の相談ができます。<br>友だち追加して、気になることをそのまま送ってください。</p>`;
      note = `\n        <p class="small" style="margin-top:16px">※BCCの公式LINEとは別のアカウントです。</p>`;
    }
    else if (doc) note = `\n        <p class="small" style="margin-top:16px">※詳しい内容は、上の資料をご覧ください。</p>`;
  }
  const grid = ctas.length
    ? `<div class="cta-grid${ctas.length === 1 ? " one" : ""}"${gateHTML ? ' style="margin-top:14px"' : ""}>
          ${ctas.join("\n          ")}
        </div>`
    : "";
  const panelTitle = r.panelTitle || ((line || (r.links && r.links.length) || r.gate) ? "ご相談・ご予約" : "詳しくはこちら");
  const panel = (gateHTML || grid)
    ? `<div class="panelbox" style="margin-top:38px">
        <h2>${esc(panelTitle)}</h2>${lead}${gateHTML}
        ${grid}${note}
      </div>`
    : "";
  // ボタンの行き先（固定ボタン用）。パスワードゲートだけのページは固定ボタンを出さない
  const primaryLink = (r.links || []).find((l) => l.primary) || null;
  const mainHref = (r.links && r.links.length) ? (primaryLink ? primaryLink.href : null) : (line || doc || null);
  const mainLabel = (r.links && r.links.length) ? (primaryLink ? primaryLink.label : "") : (line ? `${brand}に公式LINEで相談する` : "資料（詳細）を見る");
  const kind = KIND[s.id] ? `<p class="gtag">${esc(KIND[s.id])}</p>` : "";
  const price = PRICE[s.id] ? `\n      <p class="dprice"><span>料金の目安</span>${esc(PRICE[s.id])}</p>` : "";
  const points = (POINTS[s.id] || []).length
    ? `\n      <ul class="dpoints">${POINTS[s.id].map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`
    : "";
  const worries = FINDER.filter((f) => f.cat === s.cat).map((f) => f.when);
  const worryHTML = worries.length
    ? `\n      <div class="block dworry"><p class="subhead">こんなお悩みに</p>${worries.map((w) => `<p class="dworry-item">${esc(w)}</p>`).join("")}</div>`
    : "";
  const flowHTML = line
    ? `\n      <div class="block dflow"><p class="subhead">ご相談の流れ</p><ol class="dsteps">
        <li><strong>友だち追加</strong><span>下のボタンから${esc(brand)}専用の公式LINEを追加します。</span></li>
        <li><strong>気になることを送る</strong><span>料金・内容・自分のサロンに合うかなど、そのまま送ってOKです。</span></li>
        <li><strong>案内が届く</strong><span>${esc(brand)}から、詳しい内容・お見積り・ご予約のご案内が届きます。</span></li>
      </ol></div>`
    : "";
  const bottomPanel = panel
    ? `\n  <section class="dbottom">
    <div class="container reveal">
      <div class="dbottom-box">
        <p class="dbottom-k">${esc(KIND[s.id] || s.cat)}</p>
        <p class="dbottom-h">${esc(splitName(s.name)[0])}について、まずは気軽に聞いてみる</p>
        ${panel.replace('style="margin-top:38px"', 'style="margin-top:18px;border-top:0;padding-top:0"')}
      </div>
    </div>
  </section>`
    : "";
  const others = ((DATA.find((c) => c.name === s.cat) || { items: [] }).items).filter((it) => it.id !== s.id);
  const othersHTML = others.length
    ? `\n  <section class="dothers">
    <div class="container reveal">
      <p class="subhead">${esc(s.cat)}のほかのサービス</p>
      <div class="dothers-list">${others.map((it) => `<a href="${it.href || "/" + it.id}"><span>${esc(TITLE[it.id] || splitName(it.name)[0])}</span><small>${esc(KIND[it.id] || "")}</small></a>`).join("")}</div>
      <a class="back" style="margin:22px 0 0" href="/${genreSlug(s.cat)}">${esc(s.cat)}のサービス一覧へ →</a>
    </div>
  </section>`
    : "";
  const sticky = mainHref
    ? `\n<div class="dsticky"><a href="${mainHref}" target="_blank" rel="noopener noreferrer">${esc(mainLabel)}</a></div>`
    : "";
  const body = `<main${mainHref ? ' class="has-dsticky"' : ""}>
  <section class="detail detail-hero">
    <div class="container reveal">
      <a class="back" href="/${genreSlug(s.cat)}">← ${esc(s.cat)}のサービス一覧</a>
      ${kind}
      <h1>${esc(s.name)}</h1>${logo}${price}${points}
      <p class="lead">${esc(s.desc)}</p>
      <p class="lead" style="margin-top:16px">${esc(intro)}</p>
      ${panel}
    </div>
  </section>${(rich || worryHTML || flowHTML) ? `
  <section style="padding-top:40px">
    <div class="container reveal">${worryHTML}${rich}${flowHTML}</div>
  </section>` : ""}${bottomPanel}${othersHTML}
</main>${sticky}`;
  writeFileSync(`${OUT}/${s.id}.html`, pageDoc(`${s.name}｜BCC`, s.desc, body, s.id));
}
}

renderDetailPages();
