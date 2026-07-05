# BCC ポータル — Claude 引き継ぎ (handover)

> **新しいセッションでBCCを触るときは、まずこのファイルを読む。**
> セッションのコンテキストが消えても、このファイルと `_build/` があれば復旧できる。
> 何か変えたら、このファイルの該当箇所と Changelog を **同じコミットで**更新すること（恒久ルール）。

---

## TL;DR（これは何か）

**BCC（beauty Cooperative Chain）** = 美容師向けのB2Bサービスポータル。
美容師が公式LINE登録後に見る「外部パートナー一覧」ページ。開業支援／不動産／内装／
財務／福利厚生／材料／ヘアスタイル販売／教育／集客／予約 の各カテゴリに、提携サービスを
カード表示 → クリックで各サービスの内部詳細ページ（Notionではなく自前ページ）へ。

- **本番URL**: <https://bcc-tau.vercel.app>
- **ホスティング**: Vercel（プロジェクト名 `bcc` / scope `boku244-gmailcoms-projects`）。
  GitHub連携で **このリポジトリのブランチ `claude/vigilant-dirac-cduzkl` への push で自動デプロイ**。
  Vercel の **Root Directory = `bcc-beauty`**、`vercel.json` の `cleanUrls`（拡張子なしURL）。
- **⚠️ `main` には push しない**（iLe本サイトのCloudflare本番デプロイが走る）。BCCの作業は必ず上記ブランチで。
- BCCは iLe本サイト（`src/` のAstro）とは**完全に独立**。`bcc-beauty/` 配下で閉じている。
  PRは #53（ドラフト、Vercelデプロイ用。mainへのマージは想定していない）。

---

## ビルドの仕組み（重要）

サイトは**静的HTMLジェネレータ**で生成する。`bcc-beauty/*.html` は**生成物**。手で直接編集しない。

- **ソース・オブ・トゥルース**:
  - `_build/gen.mjs` … ジェネレータ本体（プレーンなES modules・Node）。全ページのデータ・
    デザイン(CSS)・レイアウトがここに入っている。
  - `_build/writeups.json` … 各サービスの「資料の内容」本文（dossier）。`{sid, overview, sections:[{heading, bullets[]|text}]}` の配列。
- **再生成コマンド（検証済み・再現可能）**:
  ```sh
  cd bcc-beauty/_build && node gen.mjs ..
  ```
  → `bcc-beauty/` 直下に `index.html` / `404.html` / 各サービス `<id>.html`（計25詳細＋index＋404）を出力。
  （cwd=_build なので `writeups.json` を読み、出力先 `..` = `bcc-beauty/`）
- **手順**: `gen.mjs`（または `writeups.json`）を編集 → 上記コマンドで再生成 →
  `git add bcc-beauty/` → コミット → push で Vercel 自動デプロイ。
- 画像は `notion/<id>/logo.*`・`notion/layer-design-works/case-*.jpg` に自己ホスト（gen.mjsは画像処理しない）。

---

## デザインシステム（v: ミニマル・ラグジュアリー）

アイボリー基調のモノトーン＋シャンパンゴールドの1色差し。**和文は常にゴシック（明朝にしない）**。

```
--bg #f4f2ec / --surface #fbfaf6 / --ink #14130f / --soft-ink #3a382f
--muted #8d897b / --line #e2dfd4 / --hair #d6d2c5 / --gold #8a6f38
font: Cormorant Garamond(セリフ欧文) / Inter + Zen Kaku Gothic New(和文)
```
ヘアラインのグリッド、余白多め、絵文字・原色は使わない。参考: notion.com / iLe.online系。

---

## gen.mjs のデータモデル

| 変数 | 役割 |
|---|---|
| `services[]` | `{id, cat, name, desc}`。カード＆詳細ページの基本。 |
| `categories[]` / `enOf{}` | カテゴリ順とその英語ラベル（タブに表示）。 |
| `RICH{}` | サービス別の詳細情報（下表）。キー=service id。 |
| `DOSSIER`（=`writeups.json`） | 「資料の内容」。`overview` + `sections`。アコーディオン表示。 |
| `DOC{}` / `DOC_RICH` | Notion公開ページの「資料（詳細）を見る」リンク。`DOC_RICH` に入れたidだけ表示。 |
| `LOGO{}` / `DARKLOGO` | カード＆詳細のロゴ画像。`DARKLOGO` は濃色タイルに載せる。 |

### `RICH` のフィールド（サービス別）
- `intro` … 見出し下のリード文（常に表示）。
- `features[]` … 特長リスト（**curatedページ=`cases`ありのみ表示**。dossierがある通常ページでは非表示＝dossier側で説明）。
- `lineUrl` … そのサービス**専用**の公式LINE。あると「〈ブランド名〉専用の公式LINEへ」ボタンを出す。
- `panelTitle` … CTAパネルの見出し（既定「ご相談・ご予約」）。
- `links[]` … CTAを自前で組む場合。`{label, href, primary?(濃色ボタン), note?(小さい注記)}`。指定するとlineUrl/docより優先。
- `gate` … パスワードゲート（クリックでPW表示→サイトを開く）。`{pw, href, revealLabel, openLabel}`。drive-blueで使用。
- `review` … 「お客様の声」引用（1文字列）。
- `cases[]` … 施工写真つき実例（layer-design-worksのみ。curated扱い）。
- `logo` … ロゴパス（LOGO未登録でも個別指定可）。

### dossier（`writeups.json`）の見出し自動整形
- 見出しに `流れ/STEP/ステップ/フロー` → 連番タイムライン（`<ol class="steps">`）
- 見出しに `料金/プラン/費用/価格/目安` → カード表示（bullet を `：` で名前:内容に分割）
- それ以外 → 特長リスト（`<ul class="feature-list">`）

### CTA（ご相談・ご予約パネル）のロジック
1. `r.gate` があればパスワードゲートwidgetを出す。
2. `r.links` があればそれをボタン化（`primary`=濃色、最初のnoteを小注記に）。
3. なければ: `lineUrl`→公式LINEボタン、`DOC_RICH`なら「資料（詳細）を見る」、
   LINEありでdocなしなら「ほかのサービスを見る」。
4. **公式LINEも links も doc も無ければパネルごと非表示**（＝連絡先が無いサービスは連絡ボタンを出さない）。
   ※以前あった「オープンチャットで相談」フォールバックは廃止済み。

---

## 現在のサービス（25件）と連絡先

| id | カテゴリ | 表示名 | 連絡/リンク |
|---|---|---|---|
| salon-start | 開業支援 | Salon Start（0円開業） | LINE + Notion資料 |
| next-beauty-tech | 開業支援 | NEXT BEAUTY TECH | LINE |
| stylebase | 開業支援 | StyleBase 開業支援 | LINE |
| mutas | 不動産 | ムータス | LINE |
| real-estate-salon | 不動産 | 美容室専門の不動産屋 | LINE |
| plum-plan | 内装業者 | PLUM PLAN | LINE `lin.ee/u4V8BIt` |
| layer-design-works | 内装業者 | Layer Design Works | LINE + 施工写真 + 資料 |
| sunny-side-life | 内装業者 | SUNNY SIDE LIFE | LINE |
| imamura-fp | 財務 | 税務調査対策×保険（今村FP） | LINE |
| liverty | 福利厚生 | 携帯電話プラン（ソフトバンク・BCC限定） | 料金シミュレーター/LP/チラシ/Instagram `shoo1004_official`（合言葉「BCC／携帯」） |
| materials-intro | 材料 | 材料（仕入れ紹介） | LINE + 資料 |
| drive-blue | 材料 | ドライブブルー | **PWゲート**→発注サイト `irida.stores.jp`（PW 123）+ リジェネ使い方Notion |
| hairstyle-market | ヘアスタイル販売 | ヘアスタイル販売サイト | Artify `artify.stores.jp` + 資料 |
| tonari-seminar | 教育 | 隣店セミナー講師紹介 | 資料 |
| haircamp | 教育 | ヘアキャンプスクール | LINE + 資料 |
| toko | 教育 | 企業向け人材育成・採用支援（都甲） | LINE + 資料 |
| tete-lab | 集客 | TETE LAB（HPB/WEB集客） | LINE |
| atsukyakumania | 集客 | 集客マニア | LINE |
| ones | 集客 | ONE's 流 集客サポート | LINE |
| stylepost | 集客 | スタイルポスト | LINE |
| freed | 集客 | フリード（TikTok） | LINE |
| instagram | 集客 | Instagramコンサル＆運用代行 | LINE |
| biyoushijuku | 集客 | 美容師塾 | LINE |
| gita | 集客 | 美容室専門TikTokコンサル（ギータ） | LINE |
| refundhub | 予約サービス | RefundHub | LINE |

- 共通導線: ヘッダー/フッターの **オープンチャット**（`line.me/ti/g2/...`）と **説明LP**（`drive-blue.online/test/`）。
- 各サービスの公式LINE/リンクの実URLは `gen.mjs` の `RICH`（`lineUrl`/`links`）に一覧。

---

## 決まっていること / DO・DON'T（恒久）

- **カタログ段階で料金・「無料」を書かない**（実料金は各サービスの公式LINE側で案内されるため）。
- **公式LINEボタンはサービス名入り**（例「ヘアキャンプスクール専用の公式LINEへ」）。BCCの公式LINEと混同させない。
- **連絡先が無いサービスは連絡ボタンを出さない**（パネルごと非表示）。
- **外部URLの追跡パラメータ（`fbclid` 等）は除去**してから使う。
- **和文はゴシックのみ**。原色・絵文字・CSS装飾過多はしない。
- **`main` に push しない**。作業は `claude/vigilant-dirac-cduzkl`。push→Vercel自動デプロイ。
- **生成HTMLを手編集しない**。`_build/gen.mjs`（＋`writeups.json`）を直して再生成。
- **秘密情報をコミットしない**。自分のモデル識別子はコミット/PR/成果物に書かない（チャット内のみ）。
- push前チェック: 生成物（`bcc-beauty/`）にAPIキー/アクセストークン/モデル識別子らしき
  文字列が混入していないか grep で確認してから push する（何も出なければOK）。

---

## Changelog（新しい順）

- **2026-07-05** — 引き継ぎ整備: `_build/gen.mjs`＋`_build/writeups.json` をリポに永続化し、
  この `CLAUDE.md` を作成。再生成コマンドの再現性を確認。Notion側にも要点を記録。
- **2026-07-05** — 「携帯電話プラン（ソフトバンク・BCC限定）」を新カテゴリ **福利厚生** で本格ページ化
  （料金例・ポイント・オーナーの福利厚生/節税メリット・口コミ・試算/LP/チラシ/Instagram相談ボタン）。
- **2026-07-05** — Liverty（→上記に発展）を材料カテゴリに追加。ヘアスタイル販売の主ボタンをArtify販売サイトへ。
  PLUM PLANに公式LINE（`lin.ee/u4V8BIt`）を追加。
- **2026-07-03** — drive-blueをパスワードゲート化（クリックでPW表示→発注サイトを開く）。
  公式LINEが無いサービスは連絡ボタン非表示に。drive-blueを発注サイト（irida）導線へ。
- **2026-07-03** — 「資料の内容」を折りたたみ＋STEPタイムライン＋料金カードで読みやすく。
  詳細ページのご相談パネルを上部へ移動。
- **（初期）** — Vercel Git連携で公開、ミニマル・ラグジュアリーへデザイン刷新、Notion資料(PDF/外部サイト)を
  読み取って各詳細ページに文章化、favicon/OGP/404整備、カード用ロゴ追加。

---

## Notion 連携（クロスセッション／秘書用）

このBCCの存在・場所・引き継ぎ先を Notion にも残している（新セッション/秘書AIが辿れるように）。
横断的な「決まったこと」は claude-config の決定ログ + Notion「🧭 決定ログ」DB
（data_source `3a312a42-37b7-447b-9bac-456d8e63bc2f`）を参照。
今後BCCで重要な変更をしたら、**このファイル**を更新し、必要なら決定ログにも1行残す。
