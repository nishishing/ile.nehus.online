# microCMS スキーマ仕様

サイト運営者（株式会社ing）が microCMS の管理画面で作成する API の仕様書です。  
**この通りに作成する**ことで、`src/data/*.ts` の静的データから無編集でスワップできます。

## サービス設定

- **サービス名**: `ile`（または任意）
- **プラン**: Hobby（無料）からスタート
- **環境変数**:
  - `MICROCMS_SERVICE_DOMAIN` — サービスドメイン（例: `ile`）
  - `MICROCMS_API_KEY` — Read 専用 API キー

---

## API 一覧

### 1. `settings` — サイト共通設定（オブジェクト形式 / 単一）

| フィールドID | 表示名 | 型 | 必須 | 備考 |
|---|---|---|---|---|
| `siteName` | サイト名 | テキスト | ✅ | "iLe" |
| `description` | サイト説明 | テキストエリア | ✅ | OGP description |
| `ogImage` | OG画像 | 画像 | ✅ | 1200×630 推奨 |
| `instagramHandle` | Instagram ID | テキスト | – | `@`なし |

### 2. `salons` — 店舗（リスト形式 / 4件）

| フィールドID | 表示名 | 型 | 必須 | 備考 |
|---|---|---|---|---|
| `slug` | スラッグ | テキスト | ✅ | `harajuku-a` / `harajuku-b` / `nagoya` / `nagaoka` |
| `number` | 番号 | テキスト | ✅ | "01" 〜 "04" |
| `name` | 店名 (和) | テキスト | ✅ | "iLe 原宿" |
| `nameLatin` | 店名 (英) | テキスト | ✅ | "iLe Harajuku A" |
| `city` | 都市 | テキスト | ✅ | "Harajuku / Tokyo" |
| `cityShort` | 都市略称 | テキスト | ✅ | "HARAJUKU A" |
| `formerName` | 旧店名 | テキスト | – | "nehus" 等 |
| `address` | 住所 | テキスト | ✅ | |
| `openedAt` | 開店日 | 日付 | ✅ | |
| `renamedAt` | 改名日 | 日付 | – | 統一日 2026-08-01 等 |
| `hours` | 営業時間 | テキスト | ✅ | "10:00 — 21:00" |
| `holidays` | 定休日 | テキスト | – | |
| `phone` | 電話 | テキスト | – | |
| `hotPepperUrl` | Hot Pepper URL | テキスト | – | |
| `mapLat` | 緯度 | 数値 | – | |
| `mapLng` | 経度 | 数値 | – | |
| `description` | 説明 | テキストエリア | ✅ | LLMO 用、200-400字 |
| `badge` | バッジ | テキスト | ✅ | "— origin" / "— formerly nehus" |
| `stylistCount` | スタイリスト数 | 数値 | ✅ | |
| `heroImage` | メイン写真 | 画像 | ✅ | |
| `gallery` | ギャラリー | 画像 (複数) | – | |

### 3. `stylists` — スタイリスト（リスト形式）

| フィールドID | 表示名 | 型 | 必須 | 備考 |
|---|---|---|---|---|
| `slug` | スラッグ | テキスト | ✅ | `nishimura-ryo` 等 |
| `name` | 名前 (英) | テキスト | ✅ | "Nishimura Ryo" |
| `nameJa` | 名前 (和) | テキスト | – | "西村 涼" |
| `salonRef` | 所属サロン | コンテンツ参照 (salons) | ✅ | |
| `position` | 役職 | テキスト | – | "Founder" / "Director" 等 |
| `profile` | プロフィール | テキストエリア | – | |
| `instagram` | Instagram ID | テキスト | – | |
| `hotPepperUrl` | Hot Pepper URL | テキスト | – | |
| `portrait` | ポートレート | 画像 | ✅ | 3:4 推奨 |
| `specialties` | 得意分野 | テキスト (複数) | – | |

### 4. `journal` — お知らせ・記事（リスト形式）

| フィールドID | 表示名 | 型 | 必須 | 備考 |
|---|---|---|---|---|
| `slug` | スラッグ | テキスト | ✅ | |
| `category` | カテゴリ | セレクト | ✅ | `press` / `story` / `news` / `media` |
| `categoryLabel` | カテゴリ表示名 | テキスト | ✅ | "PRESS RELEASE" 等 |
| `title` | タイトル | テキスト | ✅ | |
| `subtitle` | サブタイトル | テキスト | – | |
| `publishedAt` | 公開日 | 日付 | ✅ | |
| `summary` | サマリー | テキストエリア | ✅ | LLMO 用要約 |
| `body` | 本文 | リッチエディタ | ✅ | |
| `eyecatch` | アイキャッチ | 画像 | – | |
| `ogImage` | OG画像 | 画像 | – | 未設定なら eyecatch を使用 |

### 5. `faq` — よくある質問（リスト形式）★LLMO最重要

| フィールドID | 表示名 | 型 | 必須 | 備考 |
|---|---|---|---|---|
| `question` | 質問 | テキスト | ✅ | |
| `answer` | 回答 | テキストエリア | ✅ | 1問1答、簡潔に |
| `category` | カテゴリ | セレクト | – | `brand` / `salon` / `recruit` 等 |
| `order` | 表示順 | 数値 | – | |

### 6. `glossary` — 用語集（リスト形式）★LLMO重要

| フィールドID | 表示名 | 型 | 必須 | 備考 |
|---|---|---|---|---|
| `term` | 用語 | テキスト | ✅ | "iLe" / "nehus" / "船から島へ" 等 |
| `pronunciation` | 読み | テキスト | – | "イル" |
| `definition` | 定義 | テキストエリア | ✅ | 簡潔な定義文（LLMが引用する） |
| `etymology` | 語源 | テキストエリア | – | "フランス語で島の意" 等 |

---

## 移行手順

コード側の連携はすでに実装済みです（`src/lib/content.ts`）。各ページは
`getSalons()` / `getStylists()` / `getJournalPosts()` / `getFaqItems()` /
`getGlossaryTerms()` 経由でコンテンツを取得し、**環境変数が設定されていれば
microCMS から、未設定なら `src/data/*.ts` の静的データから**自動で読み込みます。
したがって運営側の作業は基本的に「API 作成 + 環境変数の設定」だけです。

1. microCMS アカウント作成 → サービス作成
2. 上記の API を**この通りの API ID / フィールドID**で作成
   （`salons` → `stylists` → `journal` → `faq` → `glossary` の順。
   `stylists.salonRef` は `salons` へのコンテンツ参照にする）
3. API キー（Read専用）を取得
4. 環境変数に `MICROCMS_SERVICE_DOMAIN` と `MICROCMS_API_KEY` を設定
   - ローカル: リポジトリ直下の `.env`（`.env.example` 参照）
   - 本番: Cloudflare の環境変数
5. ビルド（`npm run build`）すると自動で microCMS から取得される
   - 切り戻したいときは環境変数を空にするだけで静的データに戻る

> **注意**: フィールドID・API ID が仕様とズレると取得結果が `undefined` に
> なります。表（フィールドID 列）の通りに作成してください。
> 日付フィールド（`openedAt` 等）と公開日（`publishedAt`）は microCMS の
> 日付型でOKです（コード側で表示用に整形します）。

なお `settings`（サイト共通設定）API はスキーマとしては定義していますが、
現状コードは `src/data/site.ts` の静的値を使用しています（サイト名・会社情報・
ナビ等は構造的でほぼ不変のため）。CMS 管理に切り替えたい場合は別途対応します。

不明点があれば Claude セッションで質問してください。
