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
  { id:"biyoushijuku", cat:"集客", name:"美容師塾（人間力・美容師力コンサル）", desc:"人間力・美容師力のコンサル支援。" },
  { id:"gita", cat:"集客", name:"美容室専門 TikTokコンサル（ギータ）", desc:"美容室特化のTikTok戦略支援。" },

  { id:"refundhub", cat:"予約サービス", name:"RefundHub（キャンセル請求・再予約）", desc:"キャンセル請求・再予約の導線づくり。" },
];

const enOf = {
  "開業支援":"Open","不動産":"Real estate","内装業者":"Interior","財務":"Finance","福利厚生":"Benefits","材料":"Materials",
  "ヘアスタイル販売":"Hairstyle","教育":"Education","集客":"Marketing","予約サービス":"Reservation",
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const STYLE = `:root{
  --bg:#f4f2ec;
  --surface:#fbfaf6;
  --ink:#14130f;
  --soft-ink:#3a382f;
  --muted:#8d897b;
  --line:#e2dfd4;
  --hair:#d6d2c5;
  --gold:#8a6f38;
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
.nav{position:sticky;top:0;z-index:40;background:rgba(244,242,236,.8);backdrop-filter:saturate(150%) blur(12px);border-bottom:1px solid var(--line)}
.nav-inner{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:20px 0}
.brand{font-family:var(--font-serif);font-weight:600;letter-spacing:.06em;font-size:1.45rem}
.nav-links{display:flex;align-items:center;gap:30px}
.nav-links a{color:var(--soft-ink);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;font-weight:500}
.nav-links a:hover{color:var(--ink)}
.btn-join{border:1px solid var(--ink);color:var(--ink);padding:9px 20px;border-radius:999px;font-size:.74rem;letter-spacing:.14em;text-transform:uppercase;transition:.25s}
.btn-join:hover{background:var(--ink);color:var(--surface)}
@media(max-width:680px){.nav-links a.hide-sp{display:none}}

/* hero */
.hero{position:relative;overflow:hidden;min-height:min(92vh,820px);display:grid;place-items:center;text-align:center;padding:96px 0}
.hero::before{content:"";position:absolute;inset:0;z-index:0;background:radial-gradient(60% 50% at 50% 38%,rgba(20,19,15,.035),transparent 70%)}
.hero-mark{position:absolute;z-index:0;bottom:-6%;left:50%;transform:translateX(-50%);font-family:var(--font-serif);font-weight:600;font-size:min(40vw,520px);line-height:1;color:rgba(20,19,15,.035);user-select:none;letter-spacing:.02em;white-space:nowrap}
.hero-inner{position:relative;z-index:2;padding:0 20px;max-width:880px}
.hero .eyebrow{display:block;text-transform:uppercase;letter-spacing:.34em;font-size:.72rem;color:var(--muted);font-weight:500;margin:0 0 30px}
.hero h1{font-family:var(--font-jp);font-weight:500;font-size:clamp(2.2rem,6.2vw,4.4rem);line-height:1.28;letter-spacing:.02em;margin:0}
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
.grid{display:grid;gap:1px;grid-template-columns:repeat(3,1fr);background:var(--line);border:1px solid var(--line)}
.grid.two{grid-template-columns:repeat(2,1fr);max-width:760px;margin:0 auto}
@media(max-width:880px){.grid{grid-template-columns:1fr}.grid.two{grid-template-columns:1fr}}
.hero-sub strong,.lead strong{color:var(--gold);font-weight:700}
.card{position:relative;background:var(--surface);padding:30px 30px 30px;transition:.35s cubic-bezier(.2,.7,.2,1);display:flex;flex-direction:column;gap:14px;min-height:230px}
a.card:hover{background:#fff}
.cmark{width:52px;height:52px;border-radius:11px;border:1px solid var(--line);background:#fff;display:grid;place-items:center;overflow:hidden;flex:none}
.cmark img{width:100%;height:100%;object-fit:contain;padding:8px}
.cmark.dark{background:var(--ink);border-color:var(--ink)}
.cmark .mono{font-family:var(--font-serif);font-weight:600;font-size:1.5rem;color:var(--gold);line-height:1}
.card .ctag{margin:0}
.card h4{font-family:var(--font-jp);font-weight:600;font-size:1.08rem;margin:0;line-height:1.55;letter-spacing:.02em}
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
.footer .small{color:#a8a496;font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;margin-top:46px}

/* detail */
.detail-hero{padding:88px 0 22px}
.back{display:inline-flex;align-items:center;gap:9px;color:var(--muted);font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;margin:0 0 34px}
.back:hover{color:var(--ink)}
.detail .lbl{margin:0 0 18px}
.detail h1{font-family:var(--font-jp);font-weight:500;font-size:clamp(1.9rem,4.2vw,2.9rem);margin:0 0 8px;letter-spacing:.03em;line-height:1.4}
.detail .en{font-family:var(--font-serif);font-style:italic;color:var(--gold);font-size:1.15rem;display:block;margin:0 0 26px}
.lead{color:var(--soft-ink);max-width:680px;font-size:1.02rem;line-height:2}
.panelbox{border-top:1px solid var(--hair);padding-top:40px;max-width:680px;margin-top:18px}
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
      <a class="hide-sp" href="/">Home</a>
      <a class="hide-sp" href="/#services">Services</a>
      <a class="hide-sp" href="${ABOUT}">About</a>
      <a class="btn-join" href="${OC_URL}" target="_blank" rel="noopener noreferrer">オープンチャット</a>
    </div>
  </div>
</nav>`;

// 公開LP（/about）用ナビ：サービス一覧（会員限定）へは出さず、公式LINE登録に集約
const lpNav = `<nav class="nav">
  <div class="container nav-inner">
    <a class="brand" href="/about">BCC</a>
    <div class="nav-links">
      <a class="btn-join" href="${LINE_URL}" target="_blank" rel="noopener noreferrer">公式LINE登録</a>
    </div>
  </div>
</nav>`;

const footer = `<footer class="footer">
  <div class="container footer-inner reveal">
    <p class="big serif">BCC</p>
    <p class="komoji" style="margin:0 0 26px">beauty Cooperative Chain</p>
    <p>美容師の開業・集客・運営を支えるインフラ整備サービス。<br>必要な外部パートナーを、カテゴリ別にまとめています。</p>
    <div class="links">
      <a href="${OC_URL}" target="_blank" rel="noopener noreferrer">Open Chat</a>
      <a href="${ABOUT}">About</a>
    </div>
    <p class="small">© BCC — beauty Cooperative Chain</p>
  </div>
</footer>`;

// 公開LP（/about）用フッター：オープンチャット（会員限定）は出さず公式LINE登録に
const lpFooter = `<footer class="footer">
  <div class="container footer-inner reveal">
    <p class="big serif">BCC</p>
    <p class="komoji" style="margin:0 0 26px">beauty Cooperative Chain</p>
    <p>美容師の開業・集客・運営を支える共同体。<br>まずは公式LINEの登録から。</p>
    <div class="links">
      <a href="${LINE_URL}" target="_blank" rel="noopener noreferrer">公式LINE登録</a>
      <a href="${ABOUT}">About</a>
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
  "plum-plan": { lineUrl: "https://lin.ee/u4V8BIt", intro: "内装・運営から空間設計まで、サロンづくりをトータルでサポートします。", features: ["内装・空間設計をトータルサポート", "運営・立ち上げまで対応", "公式LINEで相談受付"] },
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
  "biyoushijuku": { lineUrl: "https://lin.ee/5WuYMGB", intro: "美容師の人間力と美容師力を高めることを目的としたコンサルティング（美容師塾）。土台づくりから伴走します。", features: ["人間力コンサル", "美容師力コンサル", "公式LINEで相談受付"] },
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

// ---- detail pages ----
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
    if (line) ctas.push(`<a class="btn btn-line" href="${line}" target="_blank" rel="noopener noreferrer">${esc(brand)}専用の公式LINEへ</a>`);
    if (doc) ctas.push(`<a class="btn" href="${doc}" target="_blank" rel="noopener noreferrer">資料（詳細）を見る</a>`);
    else if (line) ctas.push(`<a class="btn" href="/#services">ほかのサービスを見る</a>`);
    if (line) note = `\n        <p class="small" style="margin-top:16px">※詳しい内容・お見積り・ご予約は、${esc(brand)}専用の公式LINEでご案内します（BCCの公式LINEとは別アカウントです）。</p>`;
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
        <h2>${esc(panelTitle)}</h2>${gateHTML}
        ${grid}${note}
      </div>`
    : "";
  const body = `<main>
  <section class="detail detail-hero">
    <div class="container reveal">
      <a class="back" href="/">← Back to top</a>
      <p class="komoji lbl">${esc(enOf[s.cat] || "")} ・ ${esc(s.cat)}</p>
      <h1>${esc(s.name)}</h1>${logo}
      <p class="lead">${esc(s.desc)}</p>
      <p class="lead" style="margin-top:16px">${esc(intro)}</p>
      ${panel}
    </div>
  </section>${rich ? `
  <section style="padding-top:40px">
    <div class="container reveal">${rich}</div>
  </section>` : ""}
</main>`;
  writeFileSync(`${OUT}/${s.id}.html`, pageDoc(`${s.name}｜BCC`, s.desc, body, s.id));
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
const aboutBody = `<header class="hero">
  <div class="hero-mark serif">BCC</div>
  <div class="hero-inner">
    <span class="eyebrow">About — beauty Cooperative Chain</span>
    <h1><span style="white-space:nowrap">美容業界を、</span><span style="white-space:nowrap">もっと強く。</span><span style="white-space:nowrap">もっと面白く。</span></h1>
    <div class="rule"></div>
    <p class="kicker">Make the beauty industry stronger, and more fun.</p>
    <p class="hero-sub">美容師の可能性を広げるために生まれた共同体。材料・教育・SNS・財務など、技術以外の経営課題を、仲間とサポートで解決します。</p>
    <div class="hero-cta">
      <a class="primary" href="${LINE_URL}" target="_blank" rel="noopener noreferrer">BCC公式LINEに登録</a>
    </div>
  </div>
  <div class="scrollcue"><span>scroll</span><span class="line"></span></div>
</header>

<main>

  <section class="alt">
    <div class="container">
      <div class="sec-head reveal">
        <p class="komoji lbl">Pick up</p>
        <h2>注目の、<em>サービス</em>。</h2>
        <p>会員の反響が大きい2つのサービス。詳細は公式LINE登録後にご覧いただけます。</p>
      </div>
      <div class="grid two reveal">
        <a class="card" href="${LINE_URL}" target="_blank" rel="noopener noreferrer">
          <p class="komoji ctag">携帯事業</p>
          <h4>携帯電話プラン（ソフトバンク・BCC限定）</h4>
          <p>通信料を大幅に削減。最新iPhoneに機種変更でき、スタッフの福利厚生・節税にも活用できます。</p>
          <span class="more">公式LINEで見る <span class="arw">→</span></span>
        </a>
        <a class="card" href="${LINE_URL}" target="_blank" rel="noopener noreferrer">
          <p class="komoji ctag">仕入れ紹介</p>
          <h4>材料（仕入れ紹介）</h4>
          <p>サロン向けに、材料の仕入れ（ディーラー）を特別価格でご紹介。取引内容に応じた特典もあります。</p>
          <span class="more">公式LINEで見る <span class="arw">→</span></span>
        </a>
      </div>
    </div>
  </section>

  <section class="container">
    <div class="sec-head reveal">
      <p class="komoji lbl">Vision</p>
      <h2>私たちの、<em>想い</em>。</h2>
    </div>
    <div class="visions reveal">
      <div class="vision">
        <span class="vn">01</span>
        <h3>美容業界を、もっと強く。もっと面白く。</h3>
        <p>美容師の可能性を広げるために生まれた共同体です。材料・スタッフ教育・SNS・財務など、技術以外の経営課題を、コミュニティのサポートで解決していきます。</p>
      </div>
      <div class="vision">
        <span class="vn">02</span>
        <h3>美容業界の未来を、私たちの手で変える。</h3>
        <p>海外では当たり前に使える商材が、国内では規制で使えないことがあります。美容師がもっと自由に、創造的に働ける環境へ。業界そのものを前に進めます。</p>
      </div>
      <div class="vision">
        <span class="vn">03</span>
        <h3>流行や美学を生み出す“場”と“仲間”をつくりたい。</h3>
        <p>技術・感性・経営力を、つながり合う起業家のコミュニティで磨く。トレンドと美学が生まれ続ける場所を、仲間とともに育てていきます。</p>
      </div>
    </div>
  </section>

  <section class="alt">
    <div class="container">
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
    </div>
  </section>

  <section class="container">
    <div class="sec-head reveal">
      <p class="komoji lbl">Why BCC</p>
      <h2>選ばれる、<em>3つの理由</em>。</h2>
    </div>
    <div class="pillars reveal">
      <div class="pillar">
        <span class="pi">01</span>
        <div>
          <h3>美容室経営の負担を軽減する仕組み</h3>
          <p>ディーラー・メーカーとの直接提携により、材料を特別価格で安定供給。材料費・運営コストを抑えながら、利益を確保できる運営体制づくりを支えます。</p>
        </div>
      </div>
      <div class="pillar">
        <span class="pi">02</span>
        <div>
          <h3>教育・集客・海外展開まで、充実のサポート</h3>
          <p>オーナー向けの経営研修・技術講習、ホットペッパー／SNSを活用した集客支援、さらに海外展開まで。学びと集客をまとめて後押しします。</p>
        </div>
      </div>
      <div class="pillar">
        <span class="pi">03</span>
        <div>
          <h3>出店から経営まで、徹底サポート</h3>
          <p>不動産・融資・事業計画から、保険・税務対策・福利厚生まで。経営の知識がなくても安心して進められる環境をご提供します。</p>
        </div>
      </div>
    </div>
  </section>

  <section class="alt">
    <div class="container">
      <div class="sec-head reveal">
        <p class="komoji lbl">Support</p>
        <h2>提供する、<em>サポート</em>。</h2>
      </div>
      <div class="block reveal" style="max-width:720px;margin:0 auto">
        <ul class="feature-list">
          <li>専用の仕入れルートで、商材を特別価格で提供</li>
          <li>オーナー向けの経営研修・技術講習</li>
          <li>ホットペッパー・SNSを活用した集客支援コンサルティング</li>
          <li>不動産・融資の相談（物件探し・融資支援・事業計画書の作成）</li>
          <li>店舗運営サポート（保険・税務対策・福利厚生支援）</li>
          <li>全国の加盟店・アンバサダーとのネットワーク形成</li>
        </ul>
        <p class="lead" style="margin-top:26px">経営の知識がなくても、安心して取り組める環境をご提供します。</p>
      </div>
    </div>
  </section>

  <section class="container">
    <div class="sec-head reveal">
      <p class="komoji lbl">Flow</p>
      <h2>加盟までの、<em>流れ</em>。</h2>
    </div>
    <div class="block reveal" style="max-width:720px;margin:0 auto">
      <ol class="steps">
        <li>BCC公式LINEに登録</li>
        <li>会員ページのサービス一覧から、必要なパートナーを選ぶ</li>
        <li>各サービス専用の窓口に相談</li>
        <li>導入・利用スタート</li>
      </ol>
    </div>
  </section>

  <section class="alt">
    <div class="container">
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
    </div>
  </section>

  <section class="container">
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
  </section>

  <section class="alt">
    <div class="container">
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
    </div>
  </section>

  <section class="container lp-cta">
    <div class="sec-head reveal" style="margin-bottom:34px">
      <p class="komoji lbl">Get started</p>
      <h2>BCCで、<em>一緒に解決</em>しませんか。</h2>
      <p>材料費の削減、セミナー参加、融資相談まで。あなたのサロン経営を、まるごとサポートします。まずは公式LINEの登録から。</p>
    </div>
    <a class="go reveal" href="${LINE_URL}" target="_blank" rel="noopener noreferrer">BCC公式LINEに登録する</a>
  </section>

</main>`;

writeFileSync(
  `${OUT}/about.html`,
  pageDoc(
    "BCCとは｜beauty Cooperative Chain",
    "美容師の開業・集客・運営を支える共同体 BCC（beauty Cooperative Chain）の想い・提供サポート・実績・会社概要。",
    aboutBody,
    "about",
    lpNav,
    lpFooter,
  ),
);

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

const indexBody = `<header class="hero">
  <div class="hero-mark serif">BCC</div>
  <div class="hero-inner">
    <span class="eyebrow">beauty Cooperative Chain</span>
    <h1>美容師のインフラを、<br>ひとつに。</h1>
    <div class="rule"></div>
    <p class="kicker">From open to grow &mdash; all in one place.</p>
    <p class="hero-sub">開業・集客・運営に必要な外部パートナーを、カテゴリ別に厳選してご紹介します。</p>
    <div class="hero-cta">
      <a class="primary" href="#services">View services</a>
      <a class="ghost" href="${OC_URL}" target="_blank" rel="noopener noreferrer">Open chat</a>
    </div>
  </div>
  <div class="scrollcue"><span>scroll</span><span class="line"></span></div>
</header>

<main>

  <section class="container">
    <div class="sec-head reveal">
      <p class="komoji lbl">Information</p>
      <h2>まずは、<em>ここから</em>。</h2>
      <p>BCCの全体像はこちら。気になることはオープンチャットで気軽に。</p>
    </div>
    <div class="grid two reveal">
      <a class="card" href="${ABOUT}">
        <p class="komoji ctag">About</p>
        <h4>BCCとは</h4>
        <p>想い・提供サポート・実績・会社概要。BCCの全体像はこちら。</p>
        <span class="more">View <span class="arw">→</span></span>
      </a>
      <a class="card" href="${OC_URL}" target="_blank" rel="noopener noreferrer">
        <p class="komoji ctag">Community</p>
        <h4>オープンチャット</h4>
        <p>同業者の情報交換・最新の共有・先行案内。ご相談もこちら。</p>
        <span class="more">Enter <span class="arw">→</span></span>
      </a>
    </div>
  </section>

  <section class="alt" id="services">
    <div class="container">
      <div class="sec-head reveal">
        <p class="komoji lbl">Services</p>
        <h2>必要なものが、<em>ここに</em>。</h2>
        <p>業種ごとにタブで切り替えできます。</p>
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
    return '<a class="card" href="/'+it.id+'">'+mark+'<p class="komoji ctag">'+(d.en||d.name)+'</p><h4>'+it.name+'</h4><p>'+it.desc+'</p><span class="more">詳細 <span class="arw">→</span></span></a>';
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
    "BCC｜美容師のインフラ整備サービス",
    "BCC（beauty Cooperative Chain）は、美容師の開業・集客・運営を支えるインフラ整備サービスです。",
    indexBody
  )
);

console.log(`generated ${services.length} detail pages + index into ${OUT}`);
